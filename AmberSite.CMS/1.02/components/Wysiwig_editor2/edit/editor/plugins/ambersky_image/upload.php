<?
  ini_set ("include_path", "../../../../../../../../:../../../../../../../../php_include:../../../../../../../../php_classes" );
  include "_options.php";
  $opt = new COptions ( "modified" );

  function upload_image ($opt, $alt_text, $userfile,&$im_attribs) {

    $base_path = $opt->site_dir;
    $http_path = $opt->site_http_dir;
    if  (strrpos($http_path,'/') !=strlen($http_path)-1) $http_path = $http_path.'/';
    
    if  (strrpos($base_path,'/') !=strlen($base_path)-1) $base_path = $base_path.'/';
		$file_id = time();
    $t = array ( 1 => ".gif", 2 => ".jpg", 3 => ".png", 4 => ".swf", 5 => ".psd", 6 => ".bmp" );
    $info = getimagesize ( $userfile );
    $im_attribs ["filesize"] = filesize($userfile);
    $ext = $t[$info[2]];
    if (!$ext) { $comment =  "Ошибка загрузки: указан не графический файл"; return false; }
    $img_width = $info[0];
    $im_attribs ["width"] = $img_width;
    $img_height = $info[1];
    $im_attribs ["height"] = $img_height;
    $im_attribs ["alt"] = $alt_text;
    $img_size = "-$img_width"."x".$img_height;
    $rel_path = make_path ( $opt->site_dir."/data" );

    $file_path = $base_path."data/".$rel_path."/".$file_id.$img_size.$ext;
    $im_attribs ["filepath"] = "data/".$rel_path."/".$file_id.$img_size.$ext;
    $f_path = $im_attribs ["filepath"];
    $im_attribs ["filepath"] = $http_path.$im_attribs ["filepath"];
    
    umask ( 0117 );

    if (!copy($userfile, $file_path)) { $comment = "Ошибка загрузки: не указан файл для загрузки"; return false; }
    else
       if (!chmod($file_path, 0755)) {
                 $comment = "Ошибка загрузки: не возможно проставить права для загруженного файла";
                 return FALSE;
       };

    $comment = "Файл загружен в папку - ".$file_path;
    return true;
  };

  
  function make_path ( $base_path ){
    $num = rand ( 0, 9 );
    $new_path = "$num";
    umask ( 0 );
    if ( !file_exists ( "$base_path/$new_path" ) )
    {
      mkdir ( "$base_path/$new_path", 0775 );
    }

    $num = rand ( 0, 9 );
    $new_path .= "/$num";
    if ( !file_exists ( "$base_path/$new_path" ) )
    {
      mkdir ( "$base_path/$new_path", 0775 );
    }
    return $new_path;
  };

  $ResAtrib = array();
  $ResUpload = upload_image ($opt, $alt_text, $userfile,$ResAtrib);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<script>
    function setAction () {
             var _filepath = "<? echo $ResAtrib['filepath']; ?>";

             var _width    = "<? echo $ResAtrib['width']; ?>";
             var _height   = "<? echo $ResAtrib['height']; ?>";
             var _alt   = "<? echo $ResAtrib['alt']; ?>";
						 //alert ("#"+_filepath+"#");
             window.parent.Ok_upload(_filepath, _width, _height, _alt);
             window.parent.close_win();
    };
    function uploadFile() {
             var status = "<? echo $ResUpload; ?>";
             if (status == "1") {
                setAction();
             }
             else alert("Error Upload");
             
    };
</script>
</head>
<body onLoad="javascript: uploadFile();">
</body>
</html>
