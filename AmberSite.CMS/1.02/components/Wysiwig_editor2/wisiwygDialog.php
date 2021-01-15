<?
   require_once('../../languages.txt');
   ini_set ("include_path", "../../../../:../../:../../../../php_classes" );
   require_once ("_options.php");
   $opt = new COptions ( "normal" );
   setlocale(LC_CTYPE, "ru_RU.KOI8-R");
   Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );

   include("edit/fckeditor.php") ;
   $sBasePath = $_SERVER['PHP_SELF'] ;
   $sBasePath = substr( $sBasePath, 0, strpos( $sBasePath, "wisiwygDialog.php" ) ) ;
   $sBasePath .= "edit/";
   $oFCKeditor = new FCKeditor('FCKeditor1') ;
   $oFCKeditor->Height = "440px";
   $oFCKeditor->BasePath	= $sBasePath ;
   $oFCKeditor->Value		= '' ;

	 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
       <meta http-equiv="Content-Type" content="text/html; charset=<?get_language_title('ENCODING');?>">
       <title>Редактор</title>

        <style type="text/css" media="screen,print">
	       body {padding:0; margin:0; width:100%; font-family:Tahoma,Verdana; font-size:11px; color:#303030; background-color:#F8F9FC; line-height:24px;}
	       #content {margin:10px 5px 15px 5px; background-color:#FFFFFF; border:1px solid #B6B6B6;}
	       input.Exitbutton {width:70px; height:20px; font-family: Tahoma, Verdana, Arial; font-size:10px; padding:0 10px 0 10px; margin:0 5px 0 0px; text-align:center;}
	       .p2 {text-align:right; padding:0 10px 5px 0;}
				 </style>
       <script>
              var flag_close = false;
              var MainAppCMS;
              var testVar = 11;
              function ok_click() {
              	var obj = window.dialogArguments;
	        obj.ExitCallbackDialogFun(true);
	        flag_close = true;
	        var oEditor = FCKeditorAPI.GetInstance('FCKeditor1') ;
		callEvent(oEditor.GetXHTML( true ));
	        close_win();
              };
              
              function close_win () {
                 try {window.opener.focus();}catch(ex) {};
                 window.close();
              };
              function cancel_click() {
                try {
                    if (flag_close) return;
	            flag_close = true;
                    var obj = window.dialogArguments;
	            obj.ExitCallbackDialogFun(false);
	        } catch(ex) {}
                    close_win();
              };
              function on_load_dialog() {
	        try {
                    var obj = window.dialogArguments;
                    obj.LoadCallbackDialogFun(document, window);
              	} catch(ex) {}
	      }
              function callEvent(act) {
                 var obj = window.dialogArguments;
                 obj.EventCallbackDialogFun(act);
              };
        </script>
       <link rel="stylesheet" type="text/css" href="l_d.css" />
</head>

<body onload="javascript: on_load_dialog();" onunload="javascript: cancel_click();">
      <form name="wisiwyg" target="ifr" method="post">
            <div id="content">
            <?php
	         $oFCKeditor->Create() ;
             ?>
            </div>
            <div class="p2" id="content2">
                 <input class="Exitbutton" type="button" id="Ok_button" value="ОК" onclick="javasript:ok_click();"/>
                 <input class="Exitbutton" type="button" id="Cancel_button" value="Отмена" onclick="javascript: cancel_click();"/>
            </div>
      </form>
      <iframe id="ifr" name="ifr" border="0" frameborder="0" style="display:none; width:100%; height:100%;"></iframe>

</body>

</html>