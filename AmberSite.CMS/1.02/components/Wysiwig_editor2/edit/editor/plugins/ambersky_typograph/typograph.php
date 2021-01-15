<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
	<meta content="noindex, nofollow" name="robots">
<script>
    function pocess_complit() {
			<?
				include("rustypo.php");
				$res =botRusTypo($src_text);
			?>
             var res = "<? echo $res ?>";
			 window.parent.res_typograth(res);
    };
</script>

</head>
<body onLoad="javascript: pocess_complit();">
</body>
</html>
