<?
	require_once "page_cache.php";

	$_id    = $action->get_node ( "/action/@selected_id" );
	$EditNode = $site -> get_site_node_by_id ($_id);


	$t_title = $action->get_node ( "/action/@t_title" );
	$t_description = $action->get_node ( "/action/@t_description" );
	$t_content = $action->get_node ( "/action/@t_content" );

	if ($t_title !== null) {
		$EditNode -> set("t:title", $t_title);
	};
	if ($t_description !== null) {
		$EditNode -> set("t:description", $t_description);
	};
	if ($t_content !== null) {
		$EditNode -> set("t:content", $t_content);
	};

	$site -> set_site_node($EditNode);
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