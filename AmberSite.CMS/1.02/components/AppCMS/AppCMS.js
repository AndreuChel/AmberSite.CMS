function AppCMS (name, site_path, session_id, conman_path, ver) {
	//Начальные установки
	this.name = name;
	this.site_path =site_path;
	this.session_id = session_id;
	this.conman_path = conman_path;
	this.ver = ver;
	this.ActionsStatus = true;
    this.KillStatus = false;

    this.FlagExecuteAction = false;
    this.FlagExecuteActionArray = new Array();
    this.ProcessID = 0;
    
	//массив модулей	
	this.Components = new Array();

	//Инициализация класса сервера
	this.Server = new Server (this.name ,this.site_path, this.session_id, this.conman_path,this.ver, this);  
        this.SysSettings = this.Server.ExecuteAction("<action method='get_settings'/>");
        if (!this.SysSettings) {
            this.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
            return false;
        };

}
//********************************************************************************************
AppCMS.prototype.initCMSApp = init_app;
AppCMS.prototype.kill = kill;
//-------------- Работа с компонентами ---------------------
AppCMS.prototype.AddComponentToCMS  = add_component;
AppCMS.prototype.ComponentEventToCMS  = occur_event;
AppCMS.prototype.GetLinkToComponent  = get_component;
//-------------- Служебные функции -------------------------
AppCMS.prototype.ExecuteAction = execute_action;

AppCMS.prototype.StopActions = StopActions;
AppCMS.prototype.StartActions = StartActions;

AppCMS.prototype.StatusBarPrint = to_statusbar;

AppCMS.prototype.ParamsToArray = ParamsToArray;
AppCMS.prototype.ArrayToParams = ArrayToParams;
AppCMS.prototype.ParamsToAction = ParamsToAction;
AppCMS.prototype.XPathRes = XPathRes;
AppCMS.prototype.SetInnerText = SetInnerText;
AppCMS.prototype.html_special = html_special;
AppCMS.prototype.unhtml_special = unhtml_special;

//********************************************************************************************
//!!! НЕ ЗАПРОГРАММИРОВАННАЯ
function init_app() {
	//1) загрузить все служебные xml (только icons, остальные будут грузить сами модули)
	//2) загрузить все картинки в память из xml icons
};
//********************************************************************************************
function kill() {
	var action_string  = "<action method='close_session' path='' sessionid='"+this.session_id+"'></action>";
	res = this.Server.ExecuteAction(action_string);
	this.KillStatus = true;
	this.StopActions();
	parent.location.href = this.site_path+"cms";
};
//********************************************************************************************
//Все независимые модули (фреймы) должны быть предварительно зарегестрированы в главном классе
//AppCMS, это сделано для того, чтобы обеспечить взаимодействие между модулями по принципу
//"сообщений Windows".

// name - имя модуля
// link    - ссылка на модуль
function add_component (name,link, prior) {
    if (!prior) prior = 10;
    this.Components[name] = new Array();
	this.Components[name]['link'] = link;
	this.Components[name]['prior'] = prior;
}
//********************************************************************************************
function StopActions () {
	this.ActionsStatus = false;
};
//********************************************************************************************
function StartActions () {
	 this.ActionsStatus = true;
};
//********************************************************************************************

//от компонентов приходят события, которые рассылаются
//данной функцией по всем зарегестрированным модулям,
//которые самостоятельно их обрабатывают.
//У каждого модуля должна быть функция --- CMSEvent()

function occur_event(name, params) {

	if (this.KillStatus) {alert("Система уже остановлена!"); this.kill(); return;};
	if (!this.ActionsStatus) return;

	this.ProcessID++;
	var num_process = this.ProcessID+'';
	this.FlagExecuteActionArray[num_process] = new Array();
	this.FlagExecuteActionArray[num_process]['name'] = name;
	this.FlagExecuteActionArray[num_process]['params'] = params;
	this.FlagExecuteActionArray[num_process]['id_pr'] = this.ProcessID;
	if (!this.FlagExecuteAction)
		while (this.FlagExecuteActionArray.length > 0) {
			this.FlagExecuteAction = true;
			var firstElem = 0;
			for (key in this.FlagExecuteActionArray) {
				firstElem = key;
				break;
			};
			var _name = this.FlagExecuteActionArray[firstElem]['name'];
			var _params = this.FlagExecuteActionArray[firstElem]['params'];
			var _pid = this.FlagExecuteActionArray[firstElem]['id_pr'];

			var flag_stop = false;
			var level = 0;
			var max_lev = 10;
			while (!flag_stop) {
				for (key in this.Components)  {
					if (this.Components[key]['prior'] == level) {
						this.Components[key]['link'].CMSEvent(_name,_params);
					};
				};
				level++;
				if (level > max_lev) {
					for (key in this.Components)
						if (this.Components[key]['prior'] > max_lev)
							this.Components[key]['link'].CMSEvent(_name,_params);
					flag_stop = true;
				};
			};
			var tmp_arr = new Array();
			for (key in this.FlagExecuteActionArray) {
				if ( this.FlagExecuteActionArray[key]['id_pr'] != _pid) {
					tmp_arr[key] = new Array();
					tmp_arr[key]['name'] = this.FlagExecuteActionArray[key]['name'];
					tmp_arr[key]['params'] = this.FlagExecuteActionArray[key]['params'];
					tmp_arr[key]['id_pr'] = this.FlagExecuteActionArray[key]['id_pr'];
				};
			};
			this.FlagExecuteActionArray = tmp_arr;
			this.FlagExecuteAction = false;
		};
}
//********************************************************************************************
//функция возвращает ссылку на зарегестрированный модуль (если он есть)
function get_component (name) {
	if (this.Components[name]) return this.Components[name]['link'];
	else return false;
}
//********************************************************************************************
//Результатом выполнения этой функции является XML документ в DOM формате, которые был получен
//с серрвера в ответ на xml_str
function execute_action (xml_str) {
	return this.Server.ExecuteAction(xml_str);
}
//********************************************************************************************
//Выводит информацию в строку статуса
function to_statusbar (text) {
	top.status = text;
}
//********************************************************************************************
function ParamsToArray(params) {
	var param = params.split('#');
	var params_array = new Array();
	for (i in param) {
		var pr = param[i].split('=');
		params_array[pr[0]] = pr[1];
	};
	return params_array;
}
//********************************************************************************************
function ArrayToParams(params_array) {
	var params = "";
	var flag_resh = false;
	for (i in params_array) {
		if (params_array[i]) params_array[i] = params_array[i].toString();
		if (!flag_resh) {
			params += i+"="+params_array[i];
			flag_resh=true;
		}
		else
			params += "#"+i+"="+params_array[i];
	};
	return params;
}
//********************************************************************************************
function ParamsToAction(params) {
	var str_act =  "<action";
	var param = params.split('#');
	for (i in param) {
		 var pr = param[i].split('=');
		 str_act += " "+pr[0]+"=\""+pr[1]+"\"";
	};
    str_act += "/>";
    return str_act;
}
//********************************************************************************************
function XPathRes (xml_obj, quary ) {
	if (!xml_obj) return false;
	if (this.Server.brouzer == "IE")  return xml_obj.documentElement.selectSingleNode(quary);
	else return xml_obj.evaluate(quary, xml_obj, null, XPathResult.ANY_TYPE, null).iterateNext();
}
//********************************************************************************************
function SetInnerText(_node, _val) {
	_val = this.unhtml_special(_val);
	try { _node.firstChild.nodeValue = _val; }
	catch(ex) {
		if (this.Server.brouzer == "IE") {
		   var tmp_parser = new ActiveXObject("Msxml2.DOMDocument");
		   var text_node = tmp_parser.createTextNode(_val);
		}
		else var text_node = document.createTextNode(_val);
		_node.appendChild(text_node);
	};
}
//********************************************************************************************
function html_special(str) {
	if(str == null) return "";
	var tmp = str;
	tmp = tmp.replace(/\"/g, "&quot;"); //"
	tmp = tmp.replace(/\'/g, "&#x27;");
	tmp = tmp.replace(/\%20/g, " ");
	tmp = tmp.replace(/\</g, "&lt;");
	tmp = tmp.replace(/\>/g, "&gt;");
	return tmp;
}
//********************************************************************************************
function unhtml_special(str) {
	if(str == null) return "";
	var tmp = str;
	tmp = tmp.replace(/\&quot;/g, "\""); //"
	tmp = tmp.replace(/\&#x27;/g, "'");
	tmp = tmp.replace(/\&lt;/g, "<");
	tmp = tmp.replace(/\&gt;/g, ">");
	return tmp;
}
