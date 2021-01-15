<?
   require_once('languages.txt');
   ini_set ("include_path", "../../:../../:../../php_classes" );
   require_once ("_options.php");
   require_once ("php_classes/login_manager.php");
   require_once ("php_classes/site_control.php");
   include "func_emulation.php";
   $opt = new COptions ( "normal" );
   setlocale(LC_CTYPE, "ru_RU.KOI8-R");
   Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );

   $session_id = $sessionid;
   $query = "SELECT * FROM \"SESSIONS\" ses WHERE ses.id='$session_id'";
   $link = pg_connect ($opt->dbconnect);
   $res = @pg_exec ( $link, $query );
   $num = pg_numrows ( $res );
   $Access = 0;
   if ($num > 0 ) $Access = 1;

	 function get_version () {
	 			$filename = "../version"; 		
	 			$fp = fopen($filename, "rb");
        $buffer = fread($fp, filesize($filename));
        fclose($fp);
        $lines = preg_split("/\r?\n|\r/", $buffer);
				$ver = "1.**";
				if (count($lines)>0) $ver = $lines[0];
        return $ver;
	 }

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
      <title>Система управления сайтом</title>
      <meta http-equiv="Content-Type" CONTENT="text/html; charset=<?get_language_title('ENCODING');?>"/>
      <script language="JavaScript" type="text/javascript" src="components/AppCMS/server.js"></script>
      <script language="JavaScript" type="text/javascript" src="components/AppCMS/AppCMS.js"></script>
      <script>
                  var sitepath         =  "<?echo $opt->site_domain.$opt->site_http_dir.'/';?>";
                  var conmanpath =  "<? echo $opt->newconman_path;?>";

                  var _access = <? echo $Access ?>;
                  if ( _access == 0) window.location.href = sitepath+"newcms";
									var _ver = "<? echo get_version(); ?>";
                  var sessionid      = <?echo $sessionid ?>;
	          AppCMS = new AppCMS ("AmberSite CMS", sitepath, sessionid, conmanpath,_ver);
       </script>
</head>

<!-- вариант без дебаггера -->

<frameset border="0" rows="67,*">
	<frame noresize="noresize" name="frame1" src="components/HeaderMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
	<frameset cols="250,*">
        <frameset rows="55%,*">
		  <frame noresize="noresize" name="frame2" src="components/LeftActionsMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
		  <frame noresize="noresize" scrolling="auto" name="frame3" src="components/AttribPanel/main.php?sessionid=<?echo $sessionid ?>"></frame>
    	</frameset>
		<frameset rows="90%,*">
			<frame name="frame5" src="components/NavigationMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
			<frame noresize="noresize" name="frame4" src="components/debuger/main.php?sessionid=<?echo $sessionid ?>"></frame>
  	    </frameset>
			
	</frameset>
	</frame>
</frameset>


<!-- вариант с дебаггером (раскоментировать) -->
<!--
<frameset border="0" rows="67,*">
	<frame noresize="noresize" name="frame1" src="components/HeaderMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
	<frameset cols="250,*">
		<frame noresize="noresize" name="frame2" src="components/LeftActionsMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
		<frameset rows="90%,*">
			<frame name="frame3" src="components/NavigationMenu/main.php?sessionid=<?echo $sessionid ?>"></frame>
			<frame noresize="noresize" name="frame3" src="components/debuger/main.php?sessionid=<?echo $sessionid ?>"></frame>
		</frameset>
	</frameset>
	</frame>
</frameset>
-->
</html>