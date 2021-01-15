<?
   require_once('../../../languages.txt');
   ini_set ("include_path", "../../../../../:../../../:../../../../php_classes" );
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
		input.file {margin-top:4px; width:287px; font-family: Tahoma, Verdana, Arial; font-size:12px;}
		input.stext {border: 1px solid #B6B6B6; height: 15px; width: 66px; margin:5px 5px 0 0;}

		input.button {width:70px; height:20px; font-family: Tahoma, Verdana, Arial; font-size:10px; padding:0 10px 0 10px; margin:0 5px 0 0px; text-align:center;}
		input.checkbox {padding:0; margin:0;}

		.p {padding:5px 0 8px 0; clear:both;}
		.p div {float:left;}
		.p2 {text-align:right; padding:0 10px 0px 0;}
		br {clear:both;}
	</style>

   <script>

		var flag_close = false;
		function html_special(str) {
			if(str == null) return "";
			var tmp = str.toString();	
			tmp = tmp.replace(/\&/g, "&amp;");
			tmp = tmp.replace(/\"/g, "&quot;"); //"
			tmp = tmp.replace(/\'/g, "&#x27;"); //'
			tmp = tmp.replace(/\</g, "&lt;");
			tmp = tmp.replace(/\>/g, "&gt;"); 
			return tmp;
		}

		function ok_click() {
			flag_close = true;
			var _node_name =  html_special(document.getElementById("node_name").value);
			if (_node_name == "") {
				close_win();
				return false;
			};
			var obj = window.dialogArguments;
			obj.EventCallbackDialogFun(_node_name);
			close_win();
			return true;
	    };
		function close_win () {
			var obj = window.dialogArguments;
			obj.ExitCallbackDialogFun(false);
			try {window.opener.focus();}catch(ex) {};
			window.close();
		};
		function cancel_click() {
			if (flag_close) return;
			flag_close = true;
			close_win();
	    };
	    function on_load_dialog() {
			var obj = window.dialogArguments;
			obj.LoadCallbackDialogFun(document, window);
			document.getElementById("node_name").focus();
		}
	</script>

</head>

<body onload="javascript: on_load_dialog();" onunload="javascript:cancel_click();">
	<form onSubmit="javascript:return false;">
		<div id="content">
			<table>
				<tr><td>
					<div class="p">
						Имя:<br/>
						<input id="node_name" size="40" type="text" class="file"/>
					</div>
				</td></tr>
			</table>
		</div>

		<div class="p2" id="content2">
			<input type="submit" class="button" onclick="javascript:ok_click();" value="Ок"/>
			<input type="button" class="button" onclick="javascript:cancel_click();" value="Отмена"/>
		</div>
	</form>
</body>

</html>