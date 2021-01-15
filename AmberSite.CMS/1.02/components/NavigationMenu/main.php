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
       <link rel="stylesheet" type="text/css" href="nav_menu.css" />
       <link rel="stylesheet" type="text/css" href="dcard.css" />

       <script language="JavaScript" type="text/javascript" src="js/cookie.js"></script>
       <script language="JavaScript" type="text/javascript" src="js/modal_dialog.js"></script>
       <script language="JavaScript" type="text/javascript" src="js/navMenuClass.js"></script>
       <script language="JavaScript" type="text/javascript" src="../DataCard/DataCardClass.js"></script>
       <script language="JavaScript" type="text/javascript" src="../DataCard/js/calendar.js"></script>
       <script language="JavaScript" type="text/javascript" src="../LinkDialog/LinkDialogClass.js"></script>
       <script language="JavaScript" type="text/javascript" src="../UploadDialogs/UploadDialogClass.js"></script>
       <script language="JavaScript" type="text/javascript" src="../Wysiwig_editor2/wisiwygDialogClass.js"></script>

       <script>
<?
			$tmp_path = $opt->sites_path.$opt->site_id;
			if ( $opt->sites_path != "root/sites/")
				$tmp_path = substr($opt->sites_path, 0, -1); 
?>
			var sp = "<? echo $tmp_path ?>";
			var cp = "<? echo $tmp_path ?>";

			navMenu = new navMenuClass("navMenu", top.AppCMS, sp, cp, "MainContext");
			function callEvent (params) {
				navMenu.CallEvent(params);
			}
		</script>
       <script language="JavaScript" src="js/navMenuEvents.js"></script> 
</head>

<body id="MainContext" onLoad="navMenu.StartMenu();">

</body>
</html>
