<?
    include "php_classes/security_manager.php";
    
    // Уровень дерева с которого надо начинать отображение ("root/sites/butruba" например значение 3)
    $TreeLevel = 1;
    //Кол-во отображаемых страниц
    $GroupePagesCount = 10;
    // Выборка детей в массив $children
    if ( $_path == "/" )
    {
       $parent_node = new SITE_NODE ();
       $parent_node->id = 0;
       $children = $site->get_site_node_children ( $parent_node );
    }
    else
    {
       $parent_node = $site -> get_site_node($_path);
       if ($parent_node === false) abort();
       //$tree_sort = $parent_node->get ( "s:tree-sort" );
       $tree_sort = "";
       if ($tree_sort == "asc" || $tree_sort == "desc"){
                $tmp_params ["select"] = "*";
                $tmp_params ["order_by"] = "@".$parent_node->get ( "s:title-attr" ).",".$tree_sort;
                $children = $site -> select_site_nodes($parent_node, &$tmp_params);
       } else $children = $site -> select_site_nodes($parent_node, "*");
    }

    $num_children = sizeof ( $children );

    // Входные параметры
    $_start_pos = $action->get_node ( "/action/@start_position" );
    if ( $_start_pos == null || $_start_pos == "" ) $_start_pos = 0;
    $_limit = $action->get_node ( "/action/@limit" );
    if ( $_limit == null || $_limit == "" ) $_limit = $num_children;
    $_select = $action->get_node ( "/action/@select" );
    if ( $_select == null || $_select == "" ) $_select = 0;

    if ($_select != 0)
        for ( $i = 0; $i < $num_children; $i++ )
            if ($_select == $children[$i]) {
				$_start_pos = $i - $i%$_limit;
				break;
            };
			
    if ($_start_pos > ($num_children-1) && $num_children >0) {
		$lc = $num_children-1;
		$_start_pos = $lc - $lc%$_limit;
    };
    
	$_choose_path = $action->get_node ( "/action/@choose_path" );
    
	if ( $_choose_path == null || $_choose_path == "" ) $_choose_path = "";
    else {
        $tmp_choose =  stripos($_path,$_choose_path);
        if ($tmp_choose === false || $tmp_choose >1 ) {
           $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
           $buff .= "<result status=\"OK\" num_children=\"0\">";
           $buff .= "<data></data>";
           $buff .= "</result>";
           echo $buff;
           exit;
        };
        $tmp_s = split('/',$_choose_path);
        $TreeLevel = sizeof($tmp_s);
       $_choose_path = "#choose_path=".$_choose_path;
    }

    $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    $buff .= "<result status=\"OK\" num_children=\"$num_children\">";
    $attribs = $parent_node->dump_attrs();
    $attribs = str_replace(":","_",$attribs);
    $attribs .= " current_path='".$_path."' ";
    $attribs .= " current_limit='".$_limit."' ";
    $attribs .= " current_start_pos='".$_start_pos."' ";

    $node_mask = ""; // R,W,D,A,P	
	if ( $site->check_permissions ( $parent_node, "R" )) $node_mask .="R";
    if ( $site->check_permissions ( $parent_node, "W" )) $node_mask .="W";
    if ( $site->check_permissions ( $parent_node, "D" )) $node_mask .="D";
    if ( $site->check_permissions ( $parent_node, "A" )) $node_mask .="A";
    if ( $site->check_permissions ( $parent_node, "P" )) $node_mask .="P";
    $attribs .= " node_mask='".$node_mask."' ";


    $buff .= "<data ".$attribs.">";
    if ($parent_node) {
		//Формирование Загаловка страницы

		$title_attr = $parent_node->get ( "s:title-attr" );
		$title = htmlspecialchars($parent_node->get ( $title_attr ));
		$buff .= "<title_page title=\"$title\"/>";
	
		//Формирование ссылок быстрого перехода вверх
		$tmp_s = split('/',$_path);
		$noda_level = sizeof($tmp_s);
		if ($noda_level > $TreeLevel) {
			$tmp_parent = $parent_node;
			if ($tmp_parent->parent_id) $tmp_parent = $site -> get_site_node_by_id($tmp_parent->parent_id);
			else $tmp_parent = false;
			$buff .= "<quick_links>";
			$tmp_per = 1;
			while ($tmp_parent) {
				$title_attr = $tmp_parent->get( "s:title-attr" );
				$title = htmlspecialchars($tmp_parent->get ( $title_attr ));
				$tmp_path = $site -> make_site_node_path($tmp_parent);
				$tmp_s = split('/',$tmp_path);
				$level = sizeof($tmp_s);
				if ($level == $TreeLevel-1) break;
				$buff .= "<qlink level=\"$level\" title=\"$title\" num=\"$tmp_per\" link=\"method=get_children#path=$tmp_path#start_position=0#limit=$_limit$_choose_path\" />";
				if ($tmp_parent->parent_id)
				$tmp_parent = $site -> get_site_node_by_id($tmp_parent->parent_id);
				else
					$tmp_parent = false;
				$tmp_per++;
			};
			$buff .= "</quick_links>";
        };
    };
    //Формирование страниц
      
    if ($_limit < $num_children) {
		$tmp_calc = $_limit * $GroupePagesCount;
		$st_fl = $tmp_calc;
		$end_fl = floor($num_children/$tmp_calc)*$tmp_calc;
		$st_point = floor($_start_pos/$tmp_calc)*$tmp_calc;
		$end_point = $st_point+$tmp_calc;
	
		$gp_current = floor($_start_pos/$tmp_calc)*$tmp_calc;
		$gp_first = 0;
		$gp_end = floor($num_children/$tmp_calc)*$tmp_calc;
		$first_page = 0;
		$end_page = floor($num_children/$_limit)*$_limit;
		
		if ($end_point> $num_children) $end_point = $num_children;
	
		$buff .= "<pages>";
		if ($gp_current >=2*$tmp_calc ) {
			$buff .= "<page num=\"toStart\" link=\"method=get_children#path=$_path#start_position=0#limit=$_limit$_choose_path\"/>";
		}
		if ($_start_pos >= $st_fl) {
			$tmp_pos = $st_point-$_limit;
			$buff .= "<page num=\"pred\" link=\"method=get_children#path=$_path#start_position=$tmp_pos#limit=$_limit$_choose_path\"/>";
		};
		$num_page = $st_point/$_limit+1;
	
		for ($i=$st_point; $i < $end_point ; $i = $i+ $_limit) {
            if ($i == $_start_pos) {
               $buff .= "<page num=\"$num_page\" select=\"1\" link=\"method=get_children#path=$_path#start_position=$i#limit=$_limit$_choose_path\"/>";
            }else {
               $buff .= "<page num=\"$num_page\" link=\"method=get_children#path=$_path#start_position=$i#limit=$_limit$_choose_path\"/>";
            };
            $num_page++;
         };
        if ($_start_pos < $end_fl) {
			$tmp_pos = $end_point;
			$buff .= "<page num=\"next\" link=\"method=get_children#path=$_path#start_position=$tmp_pos#limit=$_limit$_choose_path\"/>";
        };
        if ($gp_end - $gp_current >= 2*$tmp_calc) {
			$buff .= "<page num=\"toEnd\" link=\"method=get_children#path=$_path#start_position=$end_page#limit=$_limit$_choose_path\"/>";
        };

        $buff .= "</pages>";
	};
    //Формирование непосредственно элементов меню навигации
    $buff .= "<elements>";
    if ($noda_level > $TreeLevel)
		//Формарование ссылки назад
		if ($parent_node->parent_id) {
			$tmp_parent = $site -> get_site_node_by_id($parent_node->parent_id);
			$tmp_path = $site -> make_site_node_path($tmp_parent);
			$tmp_pos = 0;
			//----Вычисление страницы, где находится родитель
			$tree_sort = $tmp_parent->get ( "s:tree-sort" );
			if ($tree_sort == "asc" || $tree_sort == "desc"){
				$tmp_params ["select"] = "*";
				$tmp_params ["order_by"] = "@".$tmp_parent->get ( "s:title-attr" ).",".$tree_sort;
				$t_c = $site -> select_site_nodes($tmp_parent, &$tmp_params);
			} else $t_c = $site -> select_site_nodes($tmp_parent, "*");
			foreach ($t_c as $t_pos => $t_id )
					if ($parent_node->id == $t_id ) $tmp_pos = $t_pos;
			$s_pos = floor ($tmp_pos / $_limit) * $_limit;
			//-----------------------------------
			$p_id = $parent_node->id;
			$link = "link=\"method=get_children#path=$tmp_path#start_position=$s_pos#limit=$_limit#select=$p_id$_choose_path\"";
			$buff .= "<back title=\"..\" id=\"id_link_back_id\" $link/>";
		};
	//формирование ссылок на дочерние элементы меню навигации
	for ( $i = $_start_pos; $i < $num_children; $i++ ) {
		if ( $i >= ( $_start_pos + $_limit ) ) break;

		$site_node = $site->get_site_node_by_id ( $children[$i] );

		$node_perms = $site->get_site_node_acl($site_node);
		$visible = "visible='false'";
		if (isset($node_perms["WebUsers"])) {
			$webUsersPerms = $node_perms["WebUsers"];
			if (stripos($webUsersPerms,"R") !== false) $visible = "visible='true'";
		};		

		$type = $site_node->name;
		$node_pos = $site_node->pos;
		$title_attr = $site_node->get ( "s:title-attr" );

		$title = $site_node->get ( $title_attr );

		$allowed_types = $site_node->get ( "s:allowed-types" );
		$allowed_actions = $site_node->get ( "s:allowed-actions" );
		if ( $allowed_actions == null ) $allowed_actions = "";
		else $allowed_actions = "allowed-actions=\"$allowed_actions\"";
		$title = htmlspecialchars ( $title );
		$noderid = $site_node->get ( "s:noderid" );
		$container = $site_node->get ( "s:container" );
		if ( $container == "true" ) $node_type = "container";
		else $node_type = "data";

		$tmp_path = $_path."/".$noderid;
		$sel = "";

		$t_attribs = "";

		$node_mask = ""; // R,W,D,A,P
		if ( $site->check_permissions ( $site_node, "R" )) $node_mask .="R";
		if ( $site->check_permissions ( $site_node, "W" )) $node_mask .="W";
		if ( $site->check_permissions ( $site_node, "D" )) $node_mask .="D";
		if ( $site->check_permissions ( $site_node, "A" )) $node_mask .="A";
		if ( $site->check_permissions ( $site_node, "P" )) $node_mask .="P";
		$node_mask = "node_mask='".$node_mask."'";
		if ($_select)
		   if ($children[$i] == $_select) $sel = "selected='1'";
		$n_pos = "position ='$node_pos'";
		if ( $container == "true" ) {
			$link = "link=\"method=get_children#path=$tmp_path#start_position=0#limit=$_limit$_choose_path\"";
			$buff .= "<container $node_mask $n_pos name=\"$type\" title=\"$title\" id=\"".$children[$i]."\" noderid=\"$noderid\" node-type=\"$node_type\" allowed-types=\"$allowed_types\" $allowed_actions $link $sel $visible $t_attribs>";
			$buff .= get_node_attribs_xml($opt, &$access_token, $site_node);
			$buff .= "</container>";
		}else {
			$link = "link=\"method=get_card#path=$tmp_path#pareanid=".$children[$i]."#limit=$_limit$_choose_path\"";
			$buff .= "<noda $n_pos $node_mask name=\"$type\" title=\"$title\" id=\"".$children[$i]."\" noderid=\"$noderid\" node-type=\"$node_type\" allowed-types=\"$allowed_types\" $allowed_actions $sel $link $visible $t_attribs>";
			$buff .= get_node_attribs_xml($opt, &$access_token, $site_node);
			$buff .= "</noda>";
		};

	}
	$buff .= "</elements>";
	$buff .= "</data>";
	$buff .= "</result>";
	echo $buff;
	exit;

//******************************************************************************
function get_node_attribs_xml ($opt, &$access_token, $site_node ) {
    if ( $site_node === false ) abort ();

    $security_manager = new SECURITY_MANAGER ( $opt->dbconnect, &$access_token );
    $visible_attrs = $security_manager->get_user_visible_attrs ();
    if ( $site_node->container == true )
		$site_node_attrs = $site_node->get_all_attrs ();
    else
		$site_node_attrs = $site_node->_attributes;

    $buff = "";
    foreach ( $site_node_attrs as $name => $val ) {
		if ( is_visible_attr ( $name, $visible_attrs ) === false ) continue;
		$buff .="<attr name=\"".htmlspecialchars($name)."\">".htmlspecialchars($val)."</attr>";
    };
    return $buff;
};
//******************************************************************************
function is_visible_attr ( $test_attr, $visible_attrs ) {
	foreach ( $visible_attrs as $pos => $cur_attr ) {
		$pos = strpos ( $cur_attr, "*" );
		if ( $pos === false ) {
			if ( $cur_attr == $test_attr ) return true;
		}
		else {
			if ( $cur_attr == "*" ) return true;
			$cur_attr = substr ( $cur_attr, 0, $pos );
			$pos = strpos ( $test_attr, $cur_attr );
			if ( $pos !== false && $pos == 0 ) return true;
		}
	}
   return false;
}
//******************************************************************************

?>