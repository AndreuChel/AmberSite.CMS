<?
   require_once('../../languages.txt');
   ini_set ("include_path", "../../../../:../../:../../../../php_classes" );
   require_once ("_options.php");
   $opt = new COptions ( "normal" );
   setlocale(LC_CTYPE, "ru_RU.KOI8-R");
   Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
       <meta http-equiv="Content-Type" content="text/html; charset=<?get_language_title('ENCODING');?>">
       <script>
			var flag_close = false;
            function ok_click() {
				var obj = window.dialogArguments;
				obj.ExitCallbackDialogFun(true);
				flag_close = true;
				window.close();
		    };
            function cancel_click() {
                if (flag_close) return;
                var obj = window.dialogArguments;
				obj.ExitCallbackDialogFun(false);
		    };
			function on_load_dialog() {
                var obj = window.dialogArguments;
                obj.LoadCallbackDialogFun(document, window);
			}
            function callEvent(act) {
                var obj = window.dialogArguments;
                obj.EventCallbackDialogFun(act);
			};
        </script>
       <script language="JavaScript" type="text/javascript" src="js/ld_Events.js"></script>
       <link rel="stylesheet" type="text/css" href="l_d.css" />
</head>
<body onselectstart = "return false;" 
	  onload="javascript: document.onmousedown=function(){return false}; on_load_dialog();" 
	  onunload="javascript:cancel_click();"
>
    <div id="dialog_tag"> </div>
	<div id="dialog_buttons">
		<input type="button" onclick="javascript:ok_click();" value="ok"/>
		<input type="button" onclick="javascript: window.close();" value="cancel"/>
	</div>

</body>
</html>