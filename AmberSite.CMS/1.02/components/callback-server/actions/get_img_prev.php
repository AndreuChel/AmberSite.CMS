<?
	require_once "site_node_data_processing.php";

    $width = 160;
    $height = 100;

    $_src = $action->get_node ( "/action/@src" );
    if ($_src == "") $_src="img/sys/empty.gif";

    $s_folder = substr($_src,0,strrpos($_src,'/'));
    $s_file = substr($_src,strrpos($_src,'/')+1);
    $base_path = $opt->site_dir;
    if  (strrpos($base_path,'/') !=strlen($base_path)-1) $base_path = $base_path.'/';
    $p_folder = "data/prev/".$s_folder;
    $p_file = $p_folder."/".$s_file;

    if (file_exists($base_path.$p_file)) {
        $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
        $buff .= "<result status=\"OK\" p_path=\"$p_file\">";
        $buff .= "</result>";
        echo $buff;
        exit;
    };

    $folders = split('/',$p_folder);
    $tmp_f = "";
    $old_umask = umask(0);
    foreach ($folders as $key => $f) {
        $tmp_f .= '/'.$f;
        if ( !file_exists ( $base_path.$tmp_f ) )
			if (!@mkdir ( $base_path.$tmp_f, 0777 )) {
				$buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
				$buff .= "<result status=\"Error\">";
				$buff .= "mkDir Error</result>";
				echo $buff;
				exit;
			};
	}
    umask($old_umask);
    $size = getimagesize($base_path.$_src);
    $im = @imagecreatefromstring(file_get_contents($base_path.$_src));
    $x_ratio = $width / $size[0];
    $y_ratio = $height / $size[1];
    
    $ratio = min($x_ratio, $y_ratio);
    $use_x_ratio = ($x_ratio == $ratio);

    $new_width   = $use_x_ratio  ? $width  : floor($size[0] * $ratio);
    $new_height  = !$use_x_ratio ? $height : floor($size[1] * $ratio);
    $new_left    = $use_x_ratio  ? 0 : floor(($width - $new_width) / 2);
    $new_top     = !$use_x_ratio ? 0 : floor(($height - $new_height) / 2);
    $im_new = imagecreatetruecolor($width, $height);
    imagefill($im_new, 0, 0, 0xFFFFFF);

    imagecopyresampled($im_new, $im, $new_left, $new_top, 0, 0,
    $new_width, $new_height, $size[0], $size[1]);

    $old_umask = umask(0);
    if (!@imagejpeg($im_new,$base_path.$p_file,60)) {
        $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
        $buff .= "<result status=\"Error\">";
        $buff .= "imagejpeg Error</result>";
        echo $buff;
        exit;
    };
    umask($old_umask);

    imagedestroy($im);
    imagedestroy($im_new);
	
    $res_path = $p_file;
    $buff =  "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    $buff .= "<result status=\"OK\" p_path=\"$p_file\">";
    $buff .= "</result>";

	echo $buff;
	exit;

?>