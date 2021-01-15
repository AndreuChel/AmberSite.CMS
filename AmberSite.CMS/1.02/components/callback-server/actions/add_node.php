<?
	require_once "page_cache.php";

    $_node_type  = $action->get_node ( "/action/@node_type" );
    $_node_title = $action->get_node ( "/action/@node_title" );
    $_node_rid   = $action->get_node ( "/action/@node_rid" );

    $_param    = $action->get_node ( "/action/@param" );

    $params = array (
                       "source" => "template",
                       "node_type" => $_node_type,
                       "node_title" => $_node_title,
                       "node_rid" => $_node_rid,
                       "position" => $_param
                    );
    $site_node = $site->add_site_node ( $_path, $params );
    if ( $site_node === false ) {
       $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
       $buff .= "<result status=\"Error\">";
       $buff .= "Error adding node</result>";
       echo $buff;
       exit;
    };
    
	$buff = "<result status=\"OK\" ";
    $buff.=" added_id='".$site_node->id."'>";
    $buff .= "</result>";

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