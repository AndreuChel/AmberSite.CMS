<?
   require_once('../../languages.txt');
   ini_set ("include_path", "../../../../:../../:../../../../php_classes" );
   require_once ("_options.php");
   require_once ("php_classes/login_manager.php");
   require_once ("php_classes/site_control.php");
   include "func_emulation.php";
   $opt = new COptions ( "normal" );
   setlocale(LC_CTYPE, "ru_RU.KOI8-R");
   Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );

   header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
   header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
   header('Cache-Control: no-cache, must-revalidate');
   header('Pragma: no-cache');
   
   $session_id = $sessionid;
   $query = "SELECT us.name, us.full_name FROM \"USERS\" us,\"SESSIONS\" ses WHERE ses.id='$session_id' AND us.id = ses.user_id";
   $link = pg_connect ($opt->dbconnect);
   $res = pg_exec ( $link, $query );
   $num = pg_numrows ( $res );
   $login_name = "";
   $full_name = "";
   if ( $num > 0 ) {
      $row = pg_fetch_array ( $res, 0 );
      $login_name = $row["name"];
      $full_name = $row["full_name"];
   };
   $str_user = ($full_name == "") ? $login_name: $login_name." ( $full_name ) ";

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
       <meta http-equiv="Content-Type" CONTENT="text/html; charset=<?get_language_title('ENCODING');?>"/>
	   <link rel="stylesheet" type="text/css" href="header.css" />
       <script language="JavaScript" type="text/javascript" src="head_menu.js"></script>
       <script>
            var LinkToLogin = top.AppCMS.site_path+"cms";
        	navMenu = new head_menu("head_menu",top.AppCMS, "path_place");
       </script>
</head>
<body id="MainContext">

<table class="top">
	<tr>
		<td class="logo" ><b>AmberSite CMS</b><br/>v <script>document.write(top.AppCMS.ver);</script></td>
		<td class="user"><? echo $str_user; ?></td>
		<td class="logout"><a href="#" onclick="javascript:top.AppCMS.kill();"> Выйти </a></td>
        <td class="path"><div id="path_place"></div></td>
		<td>&#160;</td>
	</tr>
</table>
</body>
</html>