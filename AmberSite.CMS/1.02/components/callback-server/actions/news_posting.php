<?
	// путь до ноды с подписчиками
	
	$nodepath = $opt -> news_subscribers_urn;
	//$nodepath = strtr($nodepath, $trans);
	
	$opt -> update_info_urn = $opt -> news_subscribers_urn . "/update-info";
	$info_node = $site -> get_site_node($opt -> update_info_urn);
	if ($info_node === false) abort11();
	
	$updating_attr = $info_node -> get("s:updating");
	if ($updating_attr == "true")
	{
	if ($opt -> src_encoding != $opt -> db_encoding)
		$wr_msg = vrecode($opt -> src_encoding . ".." . $opt -> db_encoding, "Предыдущий процесс рассылки еще не завершен.");
	echo "<result status=\"WARNING\">$wr_msg</result>";
	exit;
	}
	
	$new_ses = $login_manager -> new_session();
	$token = $login_manager -> get_access_token("SYSTEM", null);
	if ($token === false)
	abort11("<result status=\"NEWS_POSTING_FAILED\">Login failed for user System</result>");
	
	
	$document_base = $opt -> site_domen . $opt -> site_http_dir . "/";
	$p_id    = $action->get_node ( "/action/@posted_id" );
	$site_node = $site -> get_site_node_by_id($p_id);
	
	if ($site_node == false) abort11();
	
	$xml_data = '<root document_base="'.$document_base.'" site_root_url="?path="'.$site->namespaces.'>';
	$xml_data .= $site->get_site_node_data($site_node).'</root>';

	if(extension_loaded('xsl')){
		// libxsl backend
        $dom = new domDocument();
        $dom->load($opt->site_dir.'/xsl_templates/email/news.xsl');
        $proc = new xsltprocessor;
        $xsl = $proc->importStylesheet($dom);

        $document = new DomDocument();
        $document->loadXML($xml_data);
        $html_data = $proc->transformToXml($document);
      }elseif(extension_loaded('xslt')){
		// sablotron backend
        $args = array ( '/_xml' => $xml_data );
        $parser = xslt_create();
        $html_data = xslt_process ( $parser,  'arg:/_xml', $opt->site_dir.'/xsl_templates/email/news.xsl', NULL, $args );
        xslt_free($parser);
	}else{
        echo "<b>XSLT-processor error: no supported XSLT processors found</b>";
        exit;
	};

	if ( $html_data === false ) {
		echo "XSLT-processor error";
		exit;
	}
	// результат помещаем в файл
	$file = $opt -> temp_file();
	$fp = fopen($file, "w");
	if ($fp === false)
	{
		echo "<b>Can not create temp file</b>";
		exit;
	}
	if (fwrite($fp, $html_data) == -1)
	{
		echo "<b>Can not create temp file</b>";
		unlink ($file);
		exit;
	}
	if (fclose($fp) === false)
	{
		echo "<b>Can not close temp file</b>";
		unlink ($file);
		exit;
	}

	if ($login_manager -> set_session_user($new_ses, $token -> user_id) === false)
	{
		echo "<result status=\"NEWS_POSTING_FAILED\">Can't set user System for session $new_ses</result>";
		unlink ($file);
		exit;
	}

	$err_log = $opt -> temp_dir . "/NewsPosting.err";
	$out_log = $opt -> temp_dir . "/NewsPosting.out";
	$wget_log = $opt -> temp_dir . "/NewsPosting.wget";
	$url = $opt -> site_domen . $opt -> site_http_dir;

	$_path = $site->make_site_node_path($site_node);

	$res_str = system($opt -> nohup . " " . $opt -> wget . " -T 86400 \"http://www.auditkc.ru/php_include/web_services/news/update.php?file=$file&path=$_path&sessionid=$new_ses\" -O $out_log >$wget_log 2>$wget_log &", $res);


	if ($res != 0)
	{
		echo "<result status=\"NEWS_POSTING_FAILED\">";
		echo $res_str;
		echo "\nExitCode=$res";
		echo "</result>";
		exit;
	}

	$msg = "Процесс рассылки новости запущен.\n".
		 "Данная операция может занять продолжительное время.\n".
		 "Информацию о текущем состоянии процесса смотрите в \"Подписка на новости/Информация о рассылке\"\n";
	if ($opt -> src_encoding != $opt -> db_encoding)
	$msg = vrecode($opt -> src_encoding . ".." . $opt -> db_encoding, $msg);
	echo "<result status=\"MESSAGE\">$msg</result>";
	exit;


// ****************************
// Аварийное завершение скрипта
function abort11($err_msg = null)
{
	global $site, $opt, $time, $date, $info_node, $trans_id;

	if ($err_msg == null) $err_msg = $site -> err_msg;
	echo $err_msg;

	$site -> sql_rollback($trans_id);
	$site -> rollback();
	if ($info_node !== null)
	{
		$info_node -> set("s:updating", "false");
		if ($site -> set_site_node($info_node) === false) echo "Can not update update_info node\n";
	}
	$xml_data = "<update-info date=\"$date\" time=\"$time\" status=\"ERROR\">" . htmlspecialchars($err_msg) . "</update-info>";
	if ($site -> set_site_node_data($opt -> update_info_urn, $xml_data) === false) echo "\nCan't set data for site node";
	$site -> commit();

	exit;
}
  
?>
