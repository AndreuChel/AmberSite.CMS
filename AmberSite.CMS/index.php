<?

  include "../_options.php";
  $opt = new COptions ( "modified" );
  require_once('1.02/languages.txt');
  Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );

?>

<html>
	<head>
		<title>AmberSite CMS - <?php get_language_title('LOGIN_TITLE'); ?></title>
		<style>
			.t, .t1 {font-family: Verdana, Tahoma; font-size: 10px; font-weight: bold; color: #ffffff;padding-right:10px;}
			.t1 {padding-left:15px;padding-top:5px;}
		</style>
	</head>
	<script language="JavaScript">
		function ok_logon() {
			var path = window.location.toString().substring(7);
			path = path.substring(0, path.indexOf("/")) + "<? echo $opt->server_port; ?>" + path.substring(path.indexOf("/"));
			var elem = document.getElementById("logon_form");
			elem.setAttribute("action", "<? echo $opt->protocol; ?>" + path + "login.php");
			elem.submit();
		}
	</script>

	<body bgcolor="#98A6B8" text="#000000" link="#165BB1" alink="#CC0000" vlink="#0C47A2" marginwidth="0" marginheight="0" topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0">
		<form id="logon_form" method="POST" style="padding:0px;"> <!-- action="_URL_" -->
			<input name="site_path" type="hidden" value="<?php
			   $path = split('/newcms',$_SERVER['PHP_SELF']);
			   echo $_SERVER['SERVER_NAME'].$path[0];
			?>"/>
			<table border="0" cellspacing="0" cellpadding="0" width="100%" height="100%">
				<tr>
					<td valign="center" align="center">
						<table border="0" cellspacing="0" cellpadding="0" width="393" height="233">
							<tr>
								<td background="i/bg.jpg">
									<table border="0" cellspacing="0" cellpadding="0" width="393" height="233">
										<tr><td colspan="5"><img src="i/x.gif" width="393" height="62"/></td></tr>
										<tr>
											<td rowspan="7"><img src="i/x.gif" width="51" height="26"/></td>
											<td colspan="3" background="i/h.gif" width="291" height="26" align="right" valign="top"><div class="t1">
												<?php
												   $path = split('/cms',$_SERVER['PHP_SELF']);
												   echo $_SERVER['SERVER_NAME'].$path[0];
											    ?>
											</div></td>
											<td rowspan="7"><img src="i/x.gif" width="51" height="26"/></td>
										</tr>
										<tr><td height="8" colspan="3"><img src="i/pix.gif" width="291" height="8"/></td></tr>
										<tr>
											<td width="82" height="19" align="right"><span class="t">»м¤</span></td>
											<td><input type="text" name="usr" style="width:196;height:19;border:solid 1px #505863;"/></td>
											<td width="13" height="19"><img src="i/x.gif" width="13" height="19"/></td>
										</tr>
										<tr><td height="8" colspan="3"><img src="i/pix.gif" width="291" height="8"/></td></tr>
										<tr>
											<td width="82" height="19" align="right"><span class="t">ѕароль</span></td>
											<td><input type="password" name="psw" style="width:196;height:19;border:solid 1px #505863;"/></td>
											<td width="13" height="19"><img src="i/x.gif" width="13" height="19"/></td>
										</tr>
										<tr><td height="8" colspan="3"><img src="i/pix.gif" width="291" height="8"/></td></tr>
										<tr>
											<td width="82" height="19" align="right"></td>
											<td align="right"><input onclick="ok_logon();" type="image" border="0" src="i/enter.gif" width="48" height="18"/><img src="i/x.gif" width="4" height="18"/><input onclick="window.returnValue=null;window.close();" type="image" border="0" src="i/cancel.gif" width="58" height="18"/></td>
											<td width="13" height="19"><img src="i/x.gif" width="13" height="19"/></td>
										</tr>
										<tr><td colspan="5"><img src="i/x.gif" width="393" height="67"/></td></tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>   
		</form>
	</body>
</html>
