<?
	require_once "site_node_data_processing.php";
	require_once "page_cache.php";

    if ( $site->check_permissions ( $_path, "W" ) === false ) abort ();
    $site_node = $site->get_site_node ( $_path );
    if ( $site_node === false ) abort ();
    if ( $site->lock_site_node ( $site_node ) === false ) abort ();

    $xml_obj  = $action->get_node ( "/action/*" );
    $xml_data = $xml_obj->dump ();
    $trans = $site->get_replace_files ( $site_node );

    $util = new SITE_NODE_DATA_PROCESSING();
    // параметр $xml_data !изменяется! внутри
    $files = $util -> on_write_paths_processing(&$xml_data, $trans);
    if ($files === false) abort();

    $sql_trans_id = $site->sql_begin ();
    if ( $site->set_site_node_data ( $site_node, $xml_data ) === false ) abort ();

    $site_node = $site->get_site_node_by_id ( $site_node->id );
    $time_stamp = make_time_stamp ( $site_node->get ( "date" ), $site_node->get ( "time" ) );
    if ( $time_stamp !== false )
    {
		$site->set_site_node_attr ( &$site_node, "s:time-stamp", $time_stamp );
    }

    $site->delete_replace_files ( $site_node );
    $site->set_files_for_site_node ( $site_node, $files );
    $site->sql_commit ( $sql_trans_id );

	$site->commit ();
	$cache = new PAGE_CACHE ( "html" );
	$cache->clear ();
	$cache->set_mode ( "xml" );
	$cache->clear ();
	$cache->set_mode ( "xhtml" );
	$cache->clear ();
	LastModifiedSite ();
	//*************

   function make_time_stamp ( $date, $time = null )
   {
		if ( empty ( $date ) ) return false;
		$date_parts = split ( "\.", $date );
		if ( sizeof ( $date_parts ) < 3 ) return false;
	
		$day = $date_parts[0];
		settype ( &$day, "integer" );
		$month = $date_parts[1];
		settype ( &$month, "integer" );
		$year = $date_parts[2];
		if ( strlen ( $year ) < 4 ) $year = "20".$year;
		settype ( &$year, "integer" );
	
		$time_stamp = mktime(0, 0, 0, $month, $day, $year);
		$time_parts = split ( ":", $time );
	
		if ( empty ( $time ) || $time == null || sizeof ( $time_parts ) < 2 )
		{
		$time_stamp= "$time_stamp";
		while (strlen($time_stamp) < 10) $time_stamp = "0" . $time_stamp;
		return $time_stamp;
		}
	
		$hours = $time_parts[0];
		settype ( &$hours, "integer" );
		$minutes = $time_parts[1];
		settype ( &$minutes, "integer" );
	
		$time_stamp += $hours * 3600;
		$time_stamp += $minutes * 60;
	
		$time_stamp= "$time_stamp";
		while (strlen($time_stamp) < 10) $time_stamp = "0" . $time_stamp;

		return $time_stamp;
	}

?>

