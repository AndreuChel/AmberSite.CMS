<?
	require_once "page_cache.php";
	$_ids    = $action->get_node ( "/action/@deleted_id" );
	$_ids_arr = split ( ",", $_ids );
	$deleted_count = 0;
	$errors_count = 0;
	$access_count = 0;
	foreach ( $_ids_arr as $key => $id ) {
		$delete_node = $site->get_site_node_by_id($id);
		if ($site->check_permissions ( $delete_node, "D" )) {
			if ( $site->delete_site_node ( $delete_node ) ) $deleted_count ++;
			else $errors_count ++;
		}
		else $access_count++;
	};
	$buff = "<result status='OK'";
	$buff.= " deleted_count='".$deleted_count."'";
	$buff.= " access_count='".$access_count."'";
	$buff.= " errors_count='".$errors_count."'";
	$buff .= "></result>";


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