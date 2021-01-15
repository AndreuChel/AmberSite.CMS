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
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
       <meta http-equiv="Content-Type" CONTENT="text/html; charset=<?get_language_title('ENCODING');?>"/>
       <link rel="stylesheet" type="text/css" href="main.css" />
       <script language="JavaScript" type="text/javascript" src="js/LeftMenuClass.js"></script>
       <script>
			LeftMenu = new LeftMenuClass("LeftMenu", top.AppCMS, "main_menu", "process2");
			function callEvent (params) {
                LeftMenu.CallEvent(params);
			}
       </script>

</head>
<body id="MainContext" onselectstart = "return false;">
	<div id="content">
		<div id="nodes">
		 <div class="head">Доступные операции</div>
			  <div id="main_menu"> </div>
		 </div>
	</div>
</body>
</html>

