���� �������� �� ��������, ����:
	1) � php.ini ���� ��������� : "default_charset = UTF-8"
	2) � rustypo.php ����� ��������������� ������ ������������ ������������� �� UTF8 � windows-1251 ($text = iconv("UTF-8", "windows-1251", $text);	)
		� ����� �������������� ����� ($text = iconv("windows-1251","UTF-8", $text);	)