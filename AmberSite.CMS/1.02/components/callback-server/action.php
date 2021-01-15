<?
ini_set ("include_path", "../../../../:../../../../php_include:../../../../php_classes" );
include "_options.php";
$opt = new COptions ( "modified" );
include "func_emulation.php";
include "_login.php";

include "site_control.php";

Header ( "Content-type: text/xml" );
	 $tmp_res = $HTTP_RAW_POST_DATA;
	 if (!isset($HTTP_RAW_POST_DATA)){
        $HTTP_RAW_POST_DATA = file_get_contents('php://input');
   }

   if ( empty ( $HTTP_RAW_POST_DATA ) )
   {
      $HTTP_RAW_POST_DATA = "<action method=\"$method\" param=\"$param\" path=\"$path\" node_rid=\"$node_rid\" node_type=\"$node_type\" node_title=\"" . htmlspecialchars($node_title) . "\"/>";
      $uploaded_file = $userfile;
   }

   if ( $opt->ssl === true )
   {
      if ( $opt->ssl_port != $SERVER_PORT )
      {
         echo "<result status=\"INVALID_SERVER_PORT\">Invalid server port: $SERVER_PORT</result>";
         exit;
      }
   }

   $action = new XML_DOM ( $HTTP_RAW_POST_DATA, "string" );
   $site = new SITE_CONTROL ( $opt->dbconnect, &$access_token );

   $_method = $action->get_node ( "/action/@method" );
   $_path = $action->get_node ( "/action/@path" );


   $priv = "ExecuteAction_";
   /* ƒл¤ совместимости со старой системой привилегии делаем вручную*/
   switch ($_method) {
      case "get_card":
           $priv .= "get_xml_data";
           break;
      case "get_img_prev":
           $priv .= "get_xml_data";
           break;
      case "get_link_title":
           $priv .= "get_xml_data";
           break;
      case "close_session":
           $priv .= "get_xml_data";
           break;
      case "move_node":
           $priv .= "get_xml_data";
           break;
      case "rename_node":
           $priv .= "get_xml_data";
           break;
  	  case "block_node":
           $priv .= "get_xml_data";
           break;
      case "save_node_attribs":
           $priv .= "get_xml_data";
           break;
      case "news_posting":
           $priv .= "get_xml_data";
           break;

      default:
         $priv .= $_method;
   };

   if ( $access_token->check_privilege ( $priv ) === false )
   {
      echo "<result status=\"PRIVILEGE_NOT_FOUND\">You don't have privilege '$priv' to execute operation </result>";
      exit;
   }

   $rpos = strrpos ( $_path, "$" );
   $pos = strpos ( $_path, "$" );
   if ( $rpos !== false ) $_path1 = substr ( $_path, 0, $rpos + 1 );
   if ( $rpos === false || ( $_path == $_path1 && $_method != "get_children" && $_method != "add_node" ) )
   {
      $php_include = "actions/".$_method.".php";
      if ( file_exists ( $php_include ) ) include ( $php_include );
      else
      {
         echo "<result status=\"UNKNOWN_METHOD\">Unknown method '$_method' #$tmp_res#</result>";
         exit;
      }
   }
   else
   {
      $_module = substr ( $_path, 0, $rpos );
      $_module = substr ( $_module, strrpos ( $_module, ":" ) + 1 );
      $_sub_path = substr ( $_path, $rpos + 2 );
      $php_include = "php_include/module_$_module/action_".$_method.".php";
      if ( file_exists ( $php_include ) ) include ( $php_include );
      else
      {
         echo "<result status=\"UNSUPPORTED_METHOD\">Module '$_module' doesn't support method '$_method' </result>";
         exit;
      }
   }


function LastModifiedSite ()
{
    $entry_line = "Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT";
    $fp = @fopen("../../../../LastModifiedSite.txt", "w");
	if  ($fp !== false) {
		fputs($fp, $entry_line);fclose($fp);
	};
}

function finish ()
{
   echo "<result status=\"OK\">OK</result>";
   exit;
}

function Error($msg) {
         echo "<result status=\"Error\">$msg</result>";
         exit;
}

function abort ()
{
   global $site;

   if ( !empty ( $GLOBALS["ERR_STATUS"] ) )
   {
      $err_status = $GLOBALS["ERR_STATUS"];
      $err_msg = $GLOBALS["ERR_MSG"];
      echo "<result status=\"$err_status\">$err_msg</result>";
   }
   else echo $site->get_err_msg ();
   exit;
}
echo "<result status=\"OK\">OK</result>";
?>