<?
  ini_set ("include_path", "../../../../:../../../../php_include:../../../../php_classes" );
  include "_options.php";
  $opt = new COptions ( "modified" );
  include "func_emulation.php";
  include "_login.php";
  include "site_control.php";
  setlocale(LC_CTYPE, "ru_RU.KOI8-R");
  Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );

  function upload_image ($opt, $alt_text, $nodeid, $userfile, $user_image_file, &$access_token, &$im_attribs, &$comment) {

    $base_path = $opt->site_dir;
    if  (strrpos($base_path,'/') !=strlen($base_path)-1) $base_path = $base_path.'/';

    $site = new SITE_CONTROL ( $opt->dbconnect, &$access_token );
    if ( empty ( $nodeid ) ) { $comment =  "ќшибка загрузки: не задан приемник копировани¤"; return false; }
    $site_node = $site->get_site_node_by_id ( $nodeid );
    if ( $site_node === false ) { $comment =  "ќшибка загрузки: неизвестный раздел сайта"; return false; }

    if ( $site->check_permissions ( $site_node, "W" ) === false ) { $comment = "ќшибка загрузки: нет прав на данную операцию"; return false; };

    $t = array ( 1 => ".gif", 2 => ".jpg", 3 => ".png", 4 => ".swf", 5 => ".psd", 6 => ".bmp" );
    $info = getimagesize ( $userfile );
    $im_attribs ["filesize"] = filesize($userfile);
    $ext = $t[$info[2]];
    if (!$ext) { $comment =  "ќшибка загрузки: указан не графический файл"; return false; }
    $img_width = $info[0];
    $im_attribs ["width"] = $img_width;
    $img_height = $info[1];
    $im_attribs ["height"] = $img_height;
    $im_attribs ["alt"] = $alt_text;
    $img_size = "-$img_width"."x".$img_height;
    $rel_path = make_path ( $opt->site_dir."/data" );

    $res = pg_exec ( $site->link, "SELECT nextval('\"FILES_id_seq\"'::text)" );
    $row = pg_fetch_array ( $res, 0 );
    $file_id = $row["nextval"];
    $file_path = $base_path."data/".$rel_path."/".$file_id.$img_size.$ext;
    $im_attribs ["filepath"] = "data/".$rel_path."/".$file_id.$img_size.$ext;
    $f_path = $im_attribs ["filepath"];
    $user_image_file = urldecode($user_image_file);
    $user_image_file = vrecode( "windows-1251..UTF-8", $user_image_file );
    if ( $user_image_file == "" ) { $comment =  "ќшибка загрузки: ‘айл не определен"; return false; }
    $im_attribs ["filename"] = $user_image_file;
    umask ( 0117 );

    pg_exec ( $site->link, "BEGIN" );
    if (!copy($userfile, $file_path)) { $comment = "ќшибка загрузки: не указан файл дл¤ загрузки"; return false; }
    else
       if (!chmod($file_path, 0755)) {
                 $comment = "ќшибка загрузки: не возможно проставить права дл¤ загруженного файла";
                 return FALSE;
       };
    pg_exec ( $site->link, "INSERT INTO \"FILES\"(id,path,client_path) VALUES('$file_id','$f_path','$user_image_file')" );
    pg_exec ( $site->link, "INSERT INTO \"XML_NODE_FILES_M\"(node_id,file_id,replace) VALUES('$site_node->id','$file_id','T')" );
    pg_exec ( $site->link, "COMMIT" );
    $comment = "‘айл загружен в папку - ".$file_path;
    return true;
  };

  function upload_file ($opt, $alt_text, $nodeid, $userfile, $file_name, &$access_token, &$file_attribs, &$comment) {
     $base_path = $opt->site_dir;
     if  (strrpos($base_path,'/') !=strlen($base_path)-1) $base_path = $base_path.'/';

     $site = new SITE_CONTROL ( $opt->dbconnect, &$access_token );
     if ( empty ( $nodeid ) ) { $comment =  "ќшибка загрузки: не задан приемник копировани¤"; return false; }

     $site_node = $site->get_site_node_by_id ( $nodeid );
     if ( $site_node === false ) { $comment =  "ќшибка загрузки: неизвестный раздел сайта - ".$nodeid; return false; }
     if ( $site->check_permissions ( $site_node, "W" ) === false ) {$comment = "ќшибка загрузки: нет прав на данную операцию";  return false;};

     $file_name = urldecode($file_name);
     $pos = strrpos ( $file_name, "." );
     $ext = substr ( $file_name, $pos );
     $rel_path = make_path ( $opt->site_dir."/data" );

     $res = pg_exec ( $site->link, 'SELECT nextval(\'"FILES_id_seq"\'::text)' );
     $row = pg_fetch_array ( $res, 0 );
     $file_id = $row['nextval'];
     $file_path = 'data/'.$rel_path.'/'.$file_id.$ext;
     $f_path = $base_path."data/".$rel_path.'/'.$file_id.$ext;
     umask ( 0117 );
     $file_name = vrecode( "windows-1251..UTF-8", $file_name );
     if ( $file_name == "" ) { $comment = "ќшибка загрузки: отсутствует им¤ файла"; return false; }

     pg_exec ( $site->link, 'BEGIN' );
     if (!copy($userfile, $f_path)) { $comment = "ќшибка загрузки: не указан файл дл¤ загрузки"; return false; }
     else
       if (!chmod($f_path, 0755)) {
                 $comment = "ќшибка загрузки: не возможно проставить права дл¤ загруженного файла";
                 return FALSE;
       };
     pg_exec ( $site->link, "INSERT INTO \"FILES\"(id,path,client_path) VALUES('$file_id','$file_path','$file_name')" );
     pg_exec ( $site->link, "INSERT INTO \"XML_NODE_FILES_M\"(node_id,file_id,replace) VALUES('$site_node->id','$file_id','T')" );
     pg_exec ( $site->link, 'COMMIT' );
     $comment = "‘айл загружен в папку - ".$file_path;
     $file_attribs ["filesize"] = ceil(filesize($userfile)/1024);
     $file_attribs ["filepath"] = 'data/'.$rel_path.'/'.$file_id.$ext;
     $file_attribs ["filename"] = vrecode( "UTF-8..windows-1251", $file_name );
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
  if ($type == "image")
     $ResUpload = upload_image ($opt, $alt_text, $nodeid, $userfile, $user_image_file, $access_token, $ResAtrib ,$ResUploadComment);
  if ($type == "file")
      $ResUpload = upload_file ($opt, $alt_text, $nodeid, $userfile, $file_name, $access_token, $ResAtrib ,$ResUploadComment);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
<script>
    function html_special(str) {
        if (str == null)
            return "";
        var tmp = str;
        tmp = tmp.replace(/\"/g, "&quot;"); //"
        tmp = tmp.replace(/\'/g, "&#x27;"); //'
        tmp = tmp.replace(/\</g, "&lt;");
        tmp = tmp.replace(/\>/g, "&gt;");
        return tmp;
    }

    function setAction() {
        var reg = /#/g;
        var _filepath = html_special("<? echo $ResAtrib['filepath']; ?>");
        var _filesize = html_special("<? echo $ResAtrib['filesize']; ?>");
        var _filename = html_special("<? echo $ResAtrib['filename']; ?>");

        var fn = _filename.split('/');
        var i = fn.length - 1;
        _filename = fn[i].replace(reg, "?");

        var _width = html_special("<? echo $ResAtrib['width']; ?>");
        var _height = html_special("<? echo $ResAtrib['height']; ?>");
        var _alt = "<? echo $ResAtrib['alt']; ?>".replace(reg, "?");
        _alt = html_special(_alt);

        var str = "filename=" + _filename + "#filepath=" + _filepath + "#filesize=" + _filesize + "#width=" + _width + "#height=" + _height + "#alt=" + _alt;
        top.callEvent(str);
        top.close_win();
    };

    function setFileAction() {
        var reg = /#/g;
        var _filepath = html_special("<? echo $ResAtrib['filepath']; ?>");
        var _filesize = html_special("<? echo $ResAtrib['filesize']; ?>");
        var _filename = html_special("<? echo $ResAtrib['filename']; ?>");
        var fn = _filename.split('/');
        var i = fn.length - 1;
        _filename = fn[i].replace(reg, "?");
        var str = "filename=" + _filename + "#filepath=" + _filepath + "#filesize=" + _filesize;
        top.callEvent(str);
        top.close_win();
    };

    function uploadFile() {
        var status = "<? echo $ResUpload; ?>";
        var _type = "<? echo $type; ?>";
        if (status == "1") {
            if (_type == "image")
                setAction();
            if (_type == "file")
                setFileAction();
        };

        top.document.getElementById("content").style.display = 'none';
        top.document.getElementById("content2").style.display = 'none';
        top.document.getElementById("ifr").style.display = 'block';

        document.getElementById("resUpload").innerHTML = "<? echo $ResUploadComment; ?>";
    };
</script>
</head>

<body onLoad="javascript: uploadFile();">
    <div id="resUpload"></div>
    <input type="button" value="ќ " onclick="javascript:top.close_win();"/>
</body>

</html>