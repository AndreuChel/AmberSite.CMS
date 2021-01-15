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
?>

<!doctype html public "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
    <script language="JavaScript" type="text/javascript" src="debuger.js"></script>
    <script>
		navMenu = new debuger("debuger",top.AppCMS, "MainContext");
   </script>
</head>

<body>
	<div id="MainContext"></div>
</body>
</html>