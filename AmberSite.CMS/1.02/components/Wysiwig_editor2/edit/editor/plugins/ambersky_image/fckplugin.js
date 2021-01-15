//FCKCommands.RegisterCommand( 'ambersky_image'	  , new FCKDialogCommand( FCKLang['DlgMyInsertImage'], FCKLang['DlgMyInsertImage']	, FCKConfig.PluginsPath + 'ambersky_image/upload.html', 400, 280 ) ) ;
FCKCommands.RegisterCommand( 'ambersky_image'	  , new FCKDialogCommand( 'Insert image', 'Insert image'	, FCKConfig.PluginsPath + 'ambersky_image/upload.html', 400, 280 ) ) ;

// Create the "Image" toolbar button.
var oInsertImageItem		= new FCKToolbarButton( 'ambersky_image', "Вставка картинки" ) ;
oInsertImageItem.IconPath	= FCKConfig.PluginsPath + 'ambersky_image/image.gif' ;
FCKToolbarItems.RegisterItem( 'ambersky_image', oInsertImageItem ) ;			// 'My_Find' is the name used in the Toolbar config.
