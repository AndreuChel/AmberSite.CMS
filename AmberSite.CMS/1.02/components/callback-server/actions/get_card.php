<?
	require_once "site_node_data_processing.php";
	
	$res = $site->check_permissions ( $_path, "R" );
	if ( $res === false ) abort ();
	
	$writeflag = 1;
	if ( $site->check_permissions ( $_path, "W" ) === false ) $writeflag = 0;
	
	$node_noderid = $site->get_site_node_id($_path);
	$xml_data = $site->get_site_node_data ( $_path );
	if ( $xml_data === false ) abort ();
	$util = new SITE_NODE_DATA_PROCESSING ();
	$buff = "<data $site->namespaces>";
	$buff .= $xml_data;
	$buff .= "</data>";
	$buff = $util->on_read_processing ( $buff );
	if ( $buff === false ) abort ();
	$xml_dom = new XML_DOM ( $buff, "string" );
	$xml_obj = $xml_dom->get_node ( "/*/*" );
	$xml_data = $xml_obj->dump ();
	
	//****************************
	$_choose_path = $action->get_node ( "/action/@choose_path" );
	$_limit = $action->get_node ( "/action/@limit" );
	if ( $_choose_path == null || $_choose_path == "" ) $_choose_path = "";
	$tmp_s = split('/',$_choose_path);
	$TreeLevel = sizeof($tmp_s);
	$sysInfoBuff = "<SysInfoTag>";
	$current_node = $site -> get_site_node ($_path);
	$title_attr = $current_node->get ( "s:title-attr" );
	$title = htmlspecialchars($current_node->get ( $title_attr ));
	$sysInfoBuff .= "<title_page title=\"$title\"/>";
	
	$tmp_s = split('/',$_path);
	$noda_level = sizeof($tmp_s);
	if ($noda_level > $TreeLevel) {
		$tmp_parent = $current_node;
		if ($tmp_parent->parent_id) $tmp_parent = $site -> get_site_node_by_id($tmp_parent->parent_id);
		else $tmp_parent = false;
		$sysInfoBuff .= "<quick_links>";
		$tmp_per = 1;
		while ($tmp_parent) {
			$title_attr = $tmp_parent->get( "s:title-attr" );
			$title = htmlspecialchars($tmp_parent->get ( $title_attr ));
			$tmp_path = $site -> make_site_node_path($tmp_parent);
			$tmp_s = split('/',$tmp_path);
			$level = sizeof($tmp_s);
			if ($level == $TreeLevel-1) break;
			if ($tmp_per >1)
			$sysInfoBuff .= "<qlink level=\"$level\" title=\"$title\" num=\"$tmp_per\" link=\"method=goto_from_data_card#path=$tmp_path#start_position=0#limit=$_limit#choose_path=$_choose_path\" />";
			else
			$sysInfoBuff .= "<qlink level=\"$level\" title=\"$title\" num=\"$tmp_per\" link=\"method=return_from_data_card\" />";
			if ($tmp_parent->parent_id)
			$tmp_parent = $site -> get_site_node_by_id($tmp_parent->parent_id);
			else
				$tmp_parent = false;
			$tmp_per++;
		};
		$sysInfoBuff .= "</quick_links>";
	};
    $sysInfoBuff .= "</SysInfoTag>";

	//****************************
	$buff = "<result status=\"OK\" ";
	$buff .= "site_path=\"".$opt->site_domain.$opt->site_http_dir."\"";
	$buff .= " noderid=\"".$node_noderid."\"";
	$buff .= " write_mode=\"".$writeflag."\"";
	$buff .= "$site->namespaces>";
	$buff .= $sysInfoBuff;
	$buff .= $xml_data;
	$buff .= "</result>";
	
	echo $buff;
	exit;

?>