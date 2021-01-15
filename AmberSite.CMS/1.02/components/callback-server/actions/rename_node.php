<?
	require_once "page_cache.php";
	$_id    = $action->get_node ( "/action/@selected_id" );
	$_val   = $action->get_node ( "/action/@new_value" );
	$EditNode = $site -> get_site_node_by_id ($_id);
	$title_attr = $EditNode->get ( "s:title-attr" );
	$site -> set_site_node_attr ( $EditNode, $title_attr, $_val);
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