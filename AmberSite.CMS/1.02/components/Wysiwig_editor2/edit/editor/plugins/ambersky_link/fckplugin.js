FCKCommands.RegisterCommand( 'ambersky_link'  , new FCKDialogCommand( 'Insert link', 'Insert link'	, FCKConfig.PluginsPath + 'ambersky_link/links.html', 350, 550 ) ) ;

var oInsertLinkItem = new FCKToolbarButton( 'ambersky_link', "Вставка внутренней ссылки") ; //FCKLang.AmberskyLinkBtn
oInsertLinkItem.IconPath = FCKConfig.PluginsPath + 'ambersky_link/link.gif' ;
FCKToolbarItems.RegisterItem( 'ambersky_link', oInsertLinkItem ) ;