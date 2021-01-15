<?
Header ( "Cache-Control: no-cache" );
Header ( "Pragma: no-cache" );

include "../php_classes/login_manager.php";
include "../_options.php";
$opt = new COptions ( "modified" );

if ( $opt->ip_restriction === true ) {
	$access_allowed = false;
	foreach ( $opt->allowed_ip as $next ) {
		$pos = strpos ( $next, "*" );
		if ( $pos === false ) {
			if ( $next == $REMOTE_ADDR ) {
				$access_allowed = true;
				break;	
			}
		}
		else {
			$ip_mask = substr ( $next, 0, $pos );
			if ( strpos ( $REMOTE_ADDR, $ip_mask ) !== false ) {
				$access_allowed = true;
				break;
			}
		}
	}
   	if ( $access_allowed === false ) {
   		invalid_sessionid("С данного узла регистрация не возможна");
   	}
}

if ( empty ( $psw ) || $psw == null ) $psw = "xxxxxxxxxxxxxxxxxxx";

$pos = strpos ( $site_path, "/" );
$domain = substr ( $site_path, 0, $pos );
$sub_path = substr ( $site_path, $pos );
$site_path = $opt->protocol.$domain.$opt->server_port.$sub_path;

$len = strlen($opt->newconman_path);

if ( $opt->newconman_path[$len-1] == "/" ) {
	$temp = substr ( $opt->newconman_path, 0, $len - 1 );
	$pos = strrpos ( $temp, "/" );
	$ver = substr ( $temp, $pos + 1 );
} else {
	$temp = $opt->newconman_path;
	$pos = strrpos ( $temp, "/" );
	$ver = substr ( $temp, $pos + 1 );
}

$login_manager = new LOGIN_MANAGER ( $opt->dbconnect );
$access_token = $login_manager->get_access_token ( $usr, $psw );
if ( $access_token === false ) {
	invalid_sessionid("Неверный логин или пароль");
}

$sessionid = get_sessionid ( $usr );
$res = $login_manager->set_session_user ( $sessionid, $access_token->user_id );
if ( $res === false ) {
  echo "<result status=\"LOGIN_FAILED\">Can't set userid for this session</result>";
  exit;
}
$redirect = $opt->newconman_path."main.php?sessionid=".$sessionid;
Header ( "Location: $redirect" );

function get_sessionid ( $user_name ) {
	global $opt;
	
	$time = time ();
	$link = pg_connect ( $opt->dbconnect );
	for ( $i = 0; $i < 100; $i++ ) {
		$session_id = rand ();
		$query = "INSERT INTO \"SESSIONS\"(\"id\",\"user_id\",\"time\") SELECT '$session_id', \"id\",'$time' FROM \"USERS\" WHERE \"name\"='$user_name'";
		$res = @pg_exec ( $link, $query );
		if ( $res !== false ) return $session_id;
	};
}

?>
<html>
	<head></head>
	<body></body>
</html>

<?
	function invalid_sessionid ($message) {
		Header ( "Content-type: text/html; charset=$opt->web_page_encoding;" );
		Header ( "Cache-Control: no-cache" );
		Header ( "Pragma: no-cache" );
?>
		<html>
			<head>
				  <title>ОШИБКА БЕЗОПАСТНОСТИ</title>
				  <style>
						body {
						  font-size:15px;
						  font-family:Tahoma, Verdana, Arial;
						}
				   </style>
			</head>
			<body bgcolor="#FFFFFF" text="#000000">
				  <p>
					 <h3>Ошибка безопастности.</h3> <hr/>
					 <? echo $message ?>
				  </p>
			</body>
		</html>
<?
    exit();
}
?>