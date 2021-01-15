<?
	require_once "page_cache.php";

    $_ids    = $action->get_node ( "/action/@moved_id" );
    $_op    = $action->get_node ( "/action/@operation" );
    $moved_node = $site->get_site_node_by_id($_ids);

    if (!$moved_node) Error("moved node not found");
    $parent_node = $site->get_site_node_by_id($moved_node->parent_id);
    if (!$parent_node) Error("parent node not found");
    $children = $site->get_site_node_children ( $parent_node );
    $num_children = sizeof ( $children );

    $dst_id = "";
    for ( $i = 0; $i < $num_children; $i++ )
        if ($_ids == $children[$i]) {
           if ($_op == "NODE_MOVEUP" && $i > 0) $dst_id = $children[$i-1];
           if ($_op == "NODE_MOVEDOWN" && $i < $num_children-1) $dst_id = $children[$i+1];
           break;
        };
    if ($dst_id == "") finish();
    $site->move_xml_node($moved_node->id, $dst_id);
    
    $children = $site->get_site_node_children ( $parent_node );
    $num_children = sizeof ( $children );

    $addStr =" select_id='$_ids'";
    $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    $buff .= "<result status='OK' $addStr></result>";

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