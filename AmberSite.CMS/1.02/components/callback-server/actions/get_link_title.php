<?
	require_once "site_node_data_processing.php";

    $link_title = $action->get_node ( "/action/@link_title" );

    $site_node = $site->get_site_node ( $link_title );
    if ( $site_node === false )
    {
		echo "<result status=\"OK\">Information not found.</result>";
		exit;
    }
    $info = $site_node->get ( "n:title" );
    if ( empty ( $info ) ) {
		$title_attr = $site_node->get ( "s:title-attr" );
		$info = $site_node->get ( $title_attr );
    }

    $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    $buff .= "<result status=\"OK\" link_title=\"$info\">";
    $buff .= "</result>";

	echo $buff;
	exit;

?>