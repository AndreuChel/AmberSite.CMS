function LinkDialogClass(name, parent, app_cms, startpath) {

    this.name = name;
    this.AppCMS = app_cms;
    this.StartPath = startpath;
    this.parent = parent;
    this.callback_fun = false;
    this.parentElementId = false;
    this.StatusShow = false;
    this.dc = false;
    this.win = false;
    this.currentParams = "";
    this.SelectedNode = "";

    this.dialog_prop = 'dialogHeight: 550px; dialogWidth: 500px; dialogTop: 200px; dialogLeft: 300px; edge: Raised; center: Yes; help: No; resizable: No; status: No;'; //default features

    this.AppCMS.StatusBarPrint("Загрузка данных ...");
    this.AppCMS.AddComponentToCMS(name, this);
    //загрузка шаблона формирования html карточки
    this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/LinkDialog/xslt/link_card.xsl");
    if (!this.xslt_Template)
        alert(this.AppCMS.Server.ErrorInfo());
    this.AppCMS.StatusBarPrint("Готово");
}
//********************************************************************************************
LinkDialogClass.prototype.CMSEvent = cms_event;
LinkDialogClass.prototype.set_callback = set_callback;
LinkDialogClass.prototype.CallEvent = call_event;
LinkDialogClass.prototype.get_linkdialog_content = get_linkdialog_content;
LinkDialogClass.prototype.load_dialog_fun = load_dialog_fun;
LinkDialogClass.prototype.exit_dialog_fun = exit_dialog_fun;
LinkDialogClass.prototype.event_dialog_fun = event_dialog_fun;
LinkDialogClass.prototype.ExecEvents = ExecEvents;

//********************************************************************************************
function cms_event(name, params) {
    var param = params.split('#');
    for (i in param) {
        var pr = param[i].split('=');
        if (pr[0] == "method")
            eval("if (this." + pr[1] + ") this." + pr[1] + "(\"" + params + "\",\"" + name + "\")");
    };
}
//********************************************************************************************
function call_event(params) {
    this.AppCMS.ComponentEventToCMS(params);
}
//********************************************************************************************
function set_callback(dc_id, fun) {
    this.callback_fun = fun;
    this.parentElementId = dc_id;
}
//********************************************************************************************
function get_linkdialog_content(params) {
    this.currentParams = params;
    if (!this.StatusShow) {
        var url_str = this.AppCMS.Server.conman_path + "components/LinkDialog/LinkDialog.php";
        this.dialogwin = new modal_dialog(url_str, this, this.load_dialog_fun, this.exit_dialog_fun, this.event_dialog_fun, this.dialog_prop);
        this.dialogwin.Show();
        return;
    };
    //рисование в this.dc;
    this.ExecEvents();
}
//********************************************************************************************
function load_dialog_fun(owner, doc_param, win_param) {
    owner.AppCMS.StopActions();
    win_param.title = "Test";
    owner.StatusShow = true;
    owner.dc = doc_param;
    owner.win = win_param;
    if (owner.dc)
        owner.ExecEvents();
};
//********************************************************************************************
function exit_dialog_fun(owner, params) {
    owner.StatusShow = false;
    owner.AppCMS.StartActions();
    if (!params || this.SelectedNode == "")
        return;
    owner.callback_fun(owner.parent, owner.dc, owner.SelectedNode);
}

//********************************************************************************************
function event_dialog_fun(owner, params) {
    owner.currentParams = params;
    owner.ExecEvents()
}
//********************************************************************************************
function ExecEvents() {
    this.AppCMS.StartActions();
    var params_array = this.AppCMS.ParamsToArray(this.currentParams);
    if (!params_array["method"]) {
        this.AppCMS.StatusBarPrint("Ошибка вывода модального окна");
    };

    if (params_array["event"]) {
        this.SelectedNode = "method=ChangeLink#id=" + this.parentElementId;
        this.SelectedNode += "#title=" + params_array["title"];
        this.SelectedNode += "#path=" + params_array["path"];
        if (params_array["event"] == "click") {
            this.AppCMS.StopActions();
            return;
        };
    }

    if (params_array["method"] != "get_linkdialog_content" && params_array["method"] != "get_children") {
        this.AppCMS.StopActions();
        return;
    };

    this.SelectedNode = "";

    params_array["method"] = "get_children"
        if (!params_array["choose_path"]) {
            params_array["choose_path"] = "root/sites";
        };
    if (!params_array["path"])
        params_array["path"] = params_array["choose_path"];
    if (!params_array["limit"])
        params_array["limit"] = 10;

    var params = this.AppCMS.ArrayToParams(params_array);

    var act = this.AppCMS.ParamsToAction(this.AppCMS.html_special(params));

    this.AppCMS.StatusBarPrint("Загрузка данных...");

    var res = this.AppCMS.Server.ExecuteAction(act);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        this.AppCMS.StopActions();
        return false;
    };
    this.CurrentXML = res;
    var tmpHTML = this.AppCMS.Server.XSLT_transform(res, this.xslt_Template);
    if (tmpHTML) {
        this.dc.getElementById("dialog_tag").innerHTML = tmpHTML;
        this.AppCMS.StatusBarPrint("Готово");
        this.win.ldEventsLoad()
    } else
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
    this.AppCMS.StopActions();
}
//********************************************************************************************
