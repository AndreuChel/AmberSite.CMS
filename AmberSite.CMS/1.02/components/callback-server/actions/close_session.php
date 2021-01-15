<?
	require_once "site_node_data_processing.php";
	$buff = "<result status='OK'></result>";
	$_ids    = $action->get_node ( "/action/@sessionid");
	$link =   pg_connect ( $opt->dbconnect );	
	pg_exec($link, "delete from \"SESSIONS\" where id='$_ids'");
	echo $buff;
	exit;
?>