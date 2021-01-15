<?
	require_once "page_cache.php";

	$_ids = $action->get_node ( "/action/@selected_id" );
	$_op_type = $action->get_node ( "/action/@operation" );

	$_ids_arr = split ( ",", $_ids );
	foreach ( $_ids_arr as $key => $id ) {
		$block_node = $site->get_site_node_by_id($id);
		$node_perms = $site->get_site_node_acl($block_node);
		if (isset($node_perms["WebUsers"])) {
			$webUsersPerms = $node_perms["WebUsers"];
			if (stripos($webUsersPerms,"R") !== false && $_op_type =="block") {
				//блокирование ноды, если она видна
				$_path = $site->make_site_node_path($block_node);
				$_mask = preg_replace("/.*(R\s*,?).*/","",$webUsersPerms);
				$site->set_site_node_ace ( $_path, "WebUsers", $_mask );
			};
			if (stripos($webUsersPerms,"R") === false && $_op_type =="unblock") {
				//разблокирование ноды, если она не видна
				$_path = $site->make_site_node_path($block_node);
				if (trim($webUsersPerms) == "") $_mask ="R";
				else $_mask = "R, ".$webUsersPerms;
				$site->set_site_node_ace ( $_path, "WebUsers", $_mask );
			};
		};								
	};
    $buff = "<result status='OK'></result>";

    $site->commit ();
    $cache = new PAGE_CACHE ( "html" );
    $cache->clear ();
    $cache->set_mode ( "xml" );
    $cache->clear ();
    $cache->set_mode ( "xhtml" );
    $cache->clear ();
    LastModifiedSite ();
	echo $buff;
	exit;
?>

