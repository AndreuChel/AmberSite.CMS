≈сли типограф не работает, надо:
	1) в php.ini была настройка : "default_charset = UTF-8"
	2) в rustypo.php перед преобразованием должна производитс€ перекодировка из UTF8 в windows-1251 ($text = iconv("UTF-8", "windows-1251", $text);	)
		а после преобразований назад ($text = iconv("windows-1251","UTF-8", $text);	)