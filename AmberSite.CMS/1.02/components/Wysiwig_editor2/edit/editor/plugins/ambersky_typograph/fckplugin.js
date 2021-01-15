FCKCommands.RegisterCommand( 'ambersky_typograph', new FCKDialogCommand( 'typograph', 'typograph'	, FCKConfig.PluginsPath + 'ambersky_typograph/typograph.html', 600, 600 ) ) ;
var oTypographItem		= new FCKToolbarButton( 'ambersky_typograph', "Типографировать" ) ;
oTypographItem.IconPath	= FCKConfig.PluginsPath + 'ambersky_typograph/image.gif' ;
FCKToolbarItems.RegisterItem( 'ambersky_typograph', oTypographItem ) ;			// 'My_Find' is the name used in the Toolbar config.
