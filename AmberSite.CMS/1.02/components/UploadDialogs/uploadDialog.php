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
    <style type="text/css" media="screen,print">
		body {padding:0; margin:0; width:100%; font-family:Tahoma,Verdana; font-size:11px; color:#303030; background-color:#F8F9FC; line-height:24px;}
		#content {padding:10px 20px 15px 20px; background-color:#FFFFFF; border:1px solid #B6B6B6; margin:15px;}
		table, table td {border:0; padding:0; margin:0; border-collapse:collapse;}
	
		input.ltext {border: 1px solid #B6B6B6; height: 15px; width: 220px; margin:5px 5px 0 0;}
		input.file {margin-top:4px; width:287px; height:18px; font-family: Tahoma, Verdana, Arial; font-size:12px;}
		input.stext {border: 1px solid #B6B6B6; height: 15px; width: 66px; margin:5px 5px 0 0;}
	
		input.button {width:70px; height:20px; font-family: Tahoma, Verdana, Arial; font-size:10px; padding:0 10px 0 10px; margin:0 5px 0 0px; text-align:center;}
		input.checkbox {padding:0; margin:0;}
	
		.p {padding:5px 0 0px 0; clear:both;}
		.p div {float:left;}
		.p2 {text-align:right; padding:0 10px 5px 0;}
	
	
		br {clear:both;}
	</style>

    <script>

		var flag_close = false;
		
		function ok_click() {
		    var obj = window.dialogArguments;
		    var _type = "<? echo $type ?>";
		    obj.ExitCallbackDialogFun(true);
		    flag_close = true;
		    var src = "file:///" + document.getElementById("i_file").value.replace(/\\/g, "/");
		    document.getElementById("i_userFile").value = src;
		    document.getElementById("i_userFile2").value = src;

		    if (document.getElementById("i_file").value == "") {
		        return false;
		    };
		    return true;
		};
		
		function close_win() {
		    try {
		        window.opener.focus();
		    } catch (ex) {};
		    window.close();
		};
		
		function cancel_click() {
		    if (flag_close)
		        return;
		    flag_close = true;
		    var obj = window.dialogArguments;
		    obj.ExitCallbackDialogFun(false);
		    close_win();
		};
		
		function on_load_dialog() {
		    var obj = window.dialogArguments;
		    obj.LoadCallbackDialogFun(document, window);
		    var _type = "<? echo $type ?>";
		    if (_type != "image") {
		        document.getElementById("offdiv1").style.display = 'none';
		        document.getElementById("offdiv2").style.display = 'none';
		    };
		}
		
		function callEvent(act) {
		    var obj = window.dialogArguments;
		    obj.EventCallbackDialogFun(act);
		};

	</script>

</head>

<body onload="javascript: on_load_dialog();" onunload="javascript:cancel_click();">
	<form target="ifr" id="image_form" name="image_form" enctype="multipart/form-data" action="upload.php?sessionid=<?echo $sessionid?>&type=<?echo $type?>" method="POST">
		<div id="content">
			<table><tr><td>
				<div class="p">
					Путь до файла:<br/>
					<input id="i_file" size="40" type="file" class="file" name="userfile" value="Обзор..."/>
				</div>
				<div class="p" id="offdiv1">
					<div>Альт. текст:<br/><input type="text" name="alt_text" class="ltext"/></div>
					<div>Ширина<br/><input type="text" name="width" class="stext"/></div>
					<div>Высота<br/><input type="text" name="height" class="stext"/></div>
				</div>
				<div class="p" id="offdiv2">
					Просмотр&#160;<input type="checkbox" class="checkbox"/>
				</div>
			</td></tr></table>
		</div>

		<div class="p2" id="content2">
			<input type="submit" class="button" onclick="javascript:ok_click();" value="Ок"/>
            <input type="button" class="button" onclick="javascript:cancel_click();" value="Отмена"/>
            <input type="hidden" name="nodeid" value="<?echo $nodeid?>"/>
            <input id="i_userFile" type="hidden" name="user_image_file" value=""/>
            <input id="i_userFile2" type="hidden" name="file_name" value=""/>
		</div>
	</form>
    <iframe id="ifr" name="ifr" border="0" frameborder="0" style="width:100%; height:100%;"></iframe>
</body>

</html>