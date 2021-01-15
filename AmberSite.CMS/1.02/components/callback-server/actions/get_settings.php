<?

	$base_path = $opt->site_dir;
	if  (strrpos($base_path,'/') !=strlen($base_path)-1) $base_path = $base_path.'/';


	$menu_list = "<main_menu>";
	$menu = file_get_contents ( $base_path."xml_templates/menu/common-menu.xml" );

	foreach ( $access_token->groups as $group_name => $group_id )
	{
		$group_menu = $base_path."xml_templates/menu/$group_name.xml";
		if ( file_exists ( $group_menu ) ) $menu .= file_get_contents ( $group_menu );
	}
	$menu_list .= str_replace(array("\r\n", "\n\r", "\n", "\r"),"",$menu);
	$menu_list .= "</main_menu>";

	$file_path = $base_path."xml_templates/data-presentation.xml";
	if ( file_exists ( $file_path ) )
	{
		$data_pr .= "<dstyle>";
		$data_pr .= file_get_contents ( $file_path );
		$data_pr .= "</dstyle>";
	}

	if ( $access_token->member_of ( "Administrators" ) === true )
	{
		$priv_user = "true";
		$tree_root = "root";
	}
	else 
	{
		$priv_user = "false";
		$tree_root = "root/sites";
	}

	$buff .= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	$buff .= "<result status=\"OK\">";
	$buff .= "<settings privileged_user=\"$priv_user\" tree_root=\"$tree_root\"/>";
	$buff .= $menu_list;
	$buff .= $data_pr;
	$buff .= "</result>";

	$buff = vrecode( "windows-1251..UTF-8", $buff );
	echo $buff;
	exit;

?>