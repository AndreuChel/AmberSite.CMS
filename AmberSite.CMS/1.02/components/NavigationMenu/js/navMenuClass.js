function navMenuClass(name, app_cms, startpath, top_path, DC) {
    this.name = name;
    this.AppCMS = app_cms;
    this.StartPath = startpath;
    this.topPath = top_path;
    this.DC = DC;
    this.CurrentXML = false;
    this.AddNodeDialog = false;
    this.tmpDialogParams = "";
    this.tmpTitle = "";
    this.StatusShowAddNodeDialog = false;
    this.GetChildParams = false;
    this.LastLoadCardParams = false;
    this.AppCMS.StatusBarPrint("Загрузка данных ...");
    this.AppCMS.AddComponentToCMS(name, this, 1);
    this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/NavigationMenu/xslt/nav_menu.xsl");

    if (!this.xslt_Template)
        alert(this.AppCMS.Server.ErrorInfo());
    this.AppCMS.StatusBarPrint("Готово");

}
//********************************************************************************************
navMenuClass.prototype.StartMenu = start_menu;
navMenuClass.prototype.CMSEvent = cms_event;
navMenuClass.prototype.CallEvent = call_event;
navMenuClass.prototype.select_node = select_node;
navMenuClass.prototype.get_children = get_children;
navMenuClass.prototype.get_card = get_card;
navMenuClass.prototype.return_to_menu = return_to_menu;
navMenuClass.prototype.left_menu_action_node = left_menu_action_node;
//--
navMenuClass.prototype.add_load_fun = add_load_fun;
navMenuClass.prototype.add_exit_fun = add_exit_fun;
navMenuClass.prototype.add_event_fun = add_event_fun;
navMenuClass.prototype.rename_event_fun = rename_event_fun;
//--
navMenuClass.prototype.check_permissions = check_permissions;

navMenuClass.prototype.save_node_attribs = save_node_attribs;
navMenuClass.prototype.new_limit_set = new_limit_set;

//********************************************************************************************
function start_menu() {
    var _limit = 10;
    var cookie_limit = getCookie("element_limit");
    if (cookie_limit != null && cookie_limit != "")
        _limit = cookie_limit;

    //else setCookie("element_limit",10,700);
    var str_act = "method=get_children#path=" + this.StartPath + "#limit=" + _limit.toString() + "#choose_path=" + this.topPath;
    this.CallEvent(str_act);
}
//********************************************************************************************
function new_limit_set(params) {
    var param_array = this.AppCMS.ParamsToArray(params);
    var _id = param_array["html_id"];

    var cookie_limit = getCookie("element_limit");
    cookie_limit = parseInt(cookie_limit);

    var newLimit_input = document.getElementById(_id);
    if (!newLimit_input)
        return;
    var newLimit = newLimit_input.value;
    newLimit = parseInt(newLimit);
    if (isNaN(newLimit) && isNaN(cookie_limit))
        newLimit = 10;
    if (isNaN(newLimit) && !isNaN(cookie_limit)) {
        newLimit = cookie_limit;
        newLimit_input.value = cookie_limit;
        return;
    };
    if (newLimit < 5)
        newLimit = 5;
    if (newLimit > 100)
        newLimit = 100;

    if (cookie_limit != newLimit) {
        setCookie("element_limit", newLimit, 700);
    };
    var noda_param_array = this.AppCMS.ParamsToArray(this.GetChildParams);
    noda_param_array["limit"] = newLimit;

    var _select_arr = this.AppCMS.GetLinkToComponent("LeftMenu").SelectedNode;
    if (_select_arr)
        noda_param_array["select"] = _select_arr["id"];
    else {
        noda_param_array["start_position"] = 0
    };

    var action_str = this.AppCMS.ArrayToParams(noda_param_array);
    this.CallEvent(action_str);
};
//********************************************************************************************
function cms_event(name, params) {
    var param = params.split('#');
    for (i in param) {
        var pr = param[i].split('=');
        if (pr[0] == "method")
            eval("if (this." + pr[1] + ") this." + pr[1] + "(\"" + params + "\")");
    };
}
//********************************************************************************************
function call_event(params) {
    this.AppCMS.ComponentEventToCMS(this.name, params);
}
//********************************************************************************************
function check_permissions(node, perm) {
    if (!node)
        return false;
    var _mask = node.getAttribute("node_mask");
    var res = (_mask.indexOf(perm) == -1) ? false : true;
    return res;
}
//********************************************************************************************
function get_children(params) {
    var str_act = "<action";
    var param = params.split('#');
    for (i in param) {
        var pr = param[i].split('=');
        str_act += " " + pr[0] + "=\"" + pr[1] + "\"";
    };
    str_act += "/>";
    this.GetChildParams = params;
    this.AppCMS.StatusBarPrint("Загрузка данных...");
    var res = this.AppCMS.Server.ExecuteAction(str_act);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };

    this.CurrentXML = res;

    var node_data = this.AppCMS.XPathRes(this.CurrentXML, "//data[@current_path]");
    if (node_data) {
        var cur_lim = node_data.getAttribute("current_limit");
        var cur_sp = node_data.getAttribute("current_start_pos");
        var n_params = this.AppCMS.ParamsToArray(params);
        n_params["start_position"] = cur_sp.toString();
        this.GetChildParams = this.AppCMS.ArrayToParams(n_params);
    };

    var tmpHTML = this.AppCMS.Server.XSLT_transform(res, this.xslt_Template);
    if (tmpHTML) {
        document.getElementById(this.DC).innerHTML = tmpHTML;
        var selected_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@selected='1']");
        if (selected_node) {
            var _id = selected_node.getAttribute("id");
            if (_id)
                selectNode(_id);
        };
        this.AppCMS.StatusBarPrint("Готово");
        navMenuEventsLoad();
    } else
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
};
//********************************************************************************************
function select_node(params) {}
//********************************************************************************************
function get_card(params) {
    this.LastLoadCardParams = params;

    if (top.AppCMS.GetLinkToComponent("DataCard"))
        return false;
    var d_c = new DataCardClass("DataCard", this.AppCMS, this.StartPath, this.DC);
};
//********************************************************************************************
function return_to_menu(params) {
    var card_param_array = this.AppCMS.ParamsToArray(this.LastLoadCardParams);
    var noda_param_array = this.AppCMS.ParamsToArray(this.GetChildParams);
    var _pareanid = card_param_array["pareanid"];
    if (_pareanid) {
        noda_param_array["select"] = _pareanid;
        this.GetChildParams = this.AppCMS.ArrayToParams(noda_param_array);
    };
    this.get_children(this.GetChildParams);
}
//********************************************************************************************
function left_menu_action_node(params) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _action = params_array["action"];
    if (_action == "add" && !this.StatusShowAddNodeDialog) {
        var data_node = this.AppCMS.XPathRes(this.CurrentXML, "//data");
        if (!this.check_permissions(data_node, "W")) {
            alert("Недостаточно прав для выполнения операции!");
            return;
        };
        this.tmpDialogParams = params;
        var si = this.AppCMS.session_id;
        var url_str = this.AppCMS.Server.conman_path + "components/NavigationMenu/dialogs/NodeNameDialog.php?sessionid=" + si;
        var add_dialog_prop = 'dialogHeight: 200px; dialogWidth: 380px; dialogTop: 200px; dialogLeft: 300px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';
        this.AddNodeDialog = new modal_dialog(url_str, this, this.add_load_fun, this.add_exit_fun, this.add_event_fun, add_dialog_prop);
        this.AddNodeDialog.Show();
    };
    //**********************
    if (_action == "EXT_EXEC" && !this.StatusShowAddNodeDialog) {
        //current_select=2151#method=left_menu_action_node#action=EXT_EXEC#type_action=news_posting#selected_id=2151
        var _id = params_array["selected_id"];
        var _type_act = params_array["type_action"];
        var _path = this.AppCMS.XPathRes(this.CurrentXML, "//data[@current_path]").getAttribute("current_path");
        var action_string = "<action method='" + _type_act + "' path='" + _path + "' posted_id='" + _id + "'/>";
        var res = this.AppCMS.Server.ExecuteAction(action_string);
        alert(this.AppCMS.Server.request.responseText);
        //alert ("Процесс рассылки новостей запущен!");
    };
    //**********************
    if (_action == "NODE_EDIT" && !this.StatusShowAddNodeDialog) {
        var _id = params_array["selected_id"];
        if (!_id)
            return;
        var selected_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _id + "']");
        if (!selected_node)
            return;
        var _name = selected_node.nodeName;
        if (_name == "noda") {
            var _link = selected_node.getAttribute("link");
            this.CallEvent(_link);
            return;
        };
        if (_name == "container") {
            if (!this.check_permissions(selected_node, "W"))
                return;
            this.tmpDialogParams = params;
            this.tmpTitle = (selected_node.getAttribute("title")) ? selected_node.getAttribute("title") : "";
            var si = this.AppCMS.session_id;
            var url_str = this.AppCMS.Server.conman_path + "components/NavigationMenu/dialogs/NodeNameDialog.php?sessionid=" + si;
            var rename_dialog_prop = 'dialogHeight: 200px; dialogWidth: 380px; dialogTop: 200px; dialogLeft: 300px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';
            this.RenameNodeDialog = new modal_dialog(url_str, this, this.add_load_fun, this.add_exit_fun, this.rename_event_fun, rename_dialog_prop);
            this.RenameNodeDialog.Show();
        };
    };
    if (_action == "NODE_DELETE" && !this.StatusShowAddNodeDialog) {
        var _ids = params_array["selected_id"];
        if (!_ids)
            return;
        var _ids_array = _ids.split(',');
        var new_ids = "";
        var cx = 0;
        for (var i12 = 0; i12 < _ids_array.length; i12++) {
            var selected_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _ids_array[i12] + "']");
            if (this.check_permissions(selected_node, "D")) {
                if (cx != 0)
                    new_ids += ",";
                new_ids += _ids_array[i12];
                cx++;
            };
        };
        if (new_ids == "")
            return;
        this.AppCMS.StopActions();
        if (!confirm("Нажмите < OK > для удаления выбранных узлов ...")) {
            this.AppCMS.StartActions();
            return;
        };
        this.AppCMS.StartActions();
        var _path = this.AppCMS.XPathRes(this.CurrentXML, "//data[@current_path]").getAttribute("current_path");
        var action_string = "<action method='delete_node' path='" + _path + "' deleted_id='" + new_ids + "'/>";
        var res = this.AppCMS.Server.ExecuteAction(action_string);
        if (!res) {
            this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
            return false;
        };
        this.CallEvent(this.GetChildParams);
    };
    if (((_action == "NODE_BLOCK") || (_action == "NODE_UNBLOCK")) && !this.StatusShowAddNodeDialog) {
        var _type_action = (_action == "NODE_BLOCK") ? "block" : "unblock";
        var _ids = params_array["selected_id"];
        if (!_ids)
            return;

        var _ids_array = _ids.split(',');
        var new_ids = "";
        var cx = 0;
        for (var i12 = 0; i12 < _ids_array.length; i12++) {
            var selected_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _ids_array[i12] + "']");
            if (this.check_permissions(selected_node, "D")) {
                if (cx != 0)
                    new_ids += ",";
                new_ids += _ids_array[i12];
                cx++;
            };
        };
        if (new_ids == "")
            return;
        _ids = new_ids;

        this.AppCMS.StopActions();
        if (_type_action == "block")
            if (!confirm("Нажмите < OK > для запрета показа выбранных разделов на сайте...")) {
                this.AppCMS.StartActions();
                return;
            };
        this.AppCMS.StartActions();
        var _path = this.AppCMS.XPathRes(this.CurrentXML, "//data[@current_path]").getAttribute("current_path");
        var action_string = "<action method='block_node' path='" + _path + "' operation='" + _type_action + "' selected_id='" + _ids + "'/>";

        var res = this.AppCMS.Server.ExecuteAction(action_string);
        if (!res) {
            this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
            return false;
        };
        var n_params = this.AppCMS.ParamsToArray(this.GetChildParams);
        if (params_array["current_select"])
            n_params["select"] = params_array["current_select"]
                var act = this.AppCMS.ArrayToParams(n_params);
        this.CallEvent(act);
    };
    if ((_action == "NODE_MOVEUP" || _action == "NODE_MOVEDOWN") && !this.StatusShowAddNodeDialog) {
        var _ids = params_array["selected_id"];
        var selected_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _ids + "']");
        if (!this.check_permissions(selected_node, "D"))
            return;

        var action_string = "<action method='move_node' path='' moved_id='" + _ids + "' operation='" + _action + "'/>";
        var res = this.AppCMS.Server.ExecuteAction(action_string);
        if (!res) {
            this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
            return false;
        };
        var n_id = res.documentElement.getAttribute("select_id");
        if (!n_id)
            return;
        var n_params = this.AppCMS.ParamsToArray(this.GetChildParams);
        n_params["select"] = n_id;
        var act = this.AppCMS.ArrayToParams(n_params);
        this.CallEvent(act);
    };
}
//********************************************************************************************
function add_load_fun(owner, doc_param, win_param) {
    var params_array = owner.AppCMS.ParamsToArray(owner.tmpDialogParams);

    var _action = params_array["action"];
    if (_action == "NODE_EDIT")
        doc_param.getElementById("node_name").value = owner.tmpTitle;

    owner.StatusShowAddNodeDialog = true;
    owner.AppCMS.StopActions();
};
//********************************************************************************************
function add_exit_fun(owner, params) {
    owner.StatusShowAddNodeDialog = false;
    owner.AppCMS.StartActions();
};
//********************************************************************************************
function add_event_fun(owner, params) {
    owner.AppCMS.StartActions();
    var _title = params.replace(/\&/g, "&amp;"); ;

    var params_array = owner.AppCMS.ParamsToArray(owner.tmpDialogParams);
    var _node_rid = "DEFAULT"
        var _s_id = params_array["selected_id"];
    var _node_type = params_array["node_type"];
    var _par = "add";
    var _path = owner.AppCMS.XPathRes(owner.CurrentXML, "//data[@current_path]").getAttribute("current_path");
    if (_s_id) {
        var sel_node = owner.AppCMS.XPathRes(owner.CurrentXML, "//*[@id='" + _s_id + "']");
        if (sel_node) {
            _par = "insert_after";
            var _link = sel_node.getAttribute("link");
            var params_link = owner.AppCMS.ParamsToArray(_link);
            _path = params_link["path"];
        };
    };
    var action_string = "<action method=\"add_node\" path=\"" + _path + "\" node_type=\"" + _node_type;
    action_string += "\" node_title=\"" + _title;
    action_string += "\" node_rid=\"" + _node_rid + "\" param=\"" + _par + "\" />"; //"

    var res = owner.AppCMS.Server.ExecuteAction(action_string);
    if (!res) {
        owner.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    var n_id = res.documentElement.getAttribute("added_id");
    var s_pos = res.documentElement.getAttribute("start_pos");
    var n_params = owner.AppCMS.ParamsToArray(owner.GetChildParams);
    n_params["select"] = n_id;
    n_params["start_position"] = s_pos;
    var act = owner.AppCMS.ArrayToParams(n_params);
    owner.CallEvent(act);
    owner.AppCMS.StopActions();

};
//********************************************************************************************
function rename_event_fun(owner, params) {
    if (params == owner.tmpTitle)
        return;
    var _val = params;
    var params_array = owner.AppCMS.ParamsToArray(owner.tmpDialogParams);
    var _id = params_array["selected_id"];
    var action_string = "<action method='rename_node' path='' selected_id='" + _id + "' new_value='" + _val + "'/>";
    var res = owner.AppCMS.Server.ExecuteAction(action_string);
    if (!res) {
        owner.AppCMS.StatusBarPrint(owner.AppCMS.Server.ErrorInfo());
        return false;
    };
    var params_array = owner.AppCMS.ParamsToArray(owner.GetChildParams);
    params_array["select"] = _id;
    var act = owner.AppCMS.ArrayToParams(params_array);
    owner.CallEvent(act);
};
//********************************************************************************************
//method=save_node_attribs#xml_id=2000#t_title=3#t_description=3#t_content=3
function save_node_attribs(params) {
    this.AppCMS.StatusBarPrint("Сохранение атрибутов...");
    var par_arr = this.AppCMS.ParamsToArray(params);
    var _id = par_arr["xml_id"];
    var act_sub = "";
    for (i in par_arr) {
        if (i == "t_title") {
            act_sub += " t_title='" + par_arr[i] + "'";
            var t_title_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _id + "']/attr[@name='t:title']");
            if (t_title_node)
                this.AppCMS.SetInnerText(t_title_node, par_arr[i]);
        };
        if (i == "t_description") {
            act_sub += " t_description='" + par_arr[i] + "'";
            var t_description_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _id + "']/attr[@name='t:description']");
            if (t_description_node)
                this.AppCMS.SetInnerText(t_description_node, par_arr[i]);
        };
        if (i == "t_content") {
            act_sub += " t_content='" + par_arr[i] + "'";
            var t_content_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _id + "']/attr[@name='t:content']");
            if (t_content_node)
                this.AppCMS.SetInnerText(t_content_node, par_arr[i]);
        };
    };
    var _path = "";
    var sel_node = this.AppCMS.XPathRes(this.CurrentXML, "//*[@id='" + _id + "']");
    if (sel_node) {
        var _link = sel_node.getAttribute("link");
        var params_link = this.AppCMS.ParamsToArray(_link);
        _path = params_link["path"];
    };
    var action_string = "<action method='save_node_attribs' path='" + _path + "' selected_id='" + _id + "' " + act_sub + "/>";

    var res = this.AppCMS.Server.ExecuteAction(action_string);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    this.AppCMS.StatusBarPrint("Атрибуты сохранены");
};
