function UploadDialogClass(name, parent, app_cms, startpath, type) {

    this.name = name;
    this.type = type;
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

    this.dialog_prop = 'dialogHeight: 277px; dialogWidth: 476px; dialogTop: 200px; dialogLeft: 300px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';
    this.file_dialog_prop = 'dialogHeight: 200px; dialogWidth: 476px; dialogTop: 200px; dialogLeft: 300px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';

    this.AppCMS.AddComponentToCMS(name, this);
    //загрузка шаблона формировани€ html карточки
}
//********************************************************************************************
UploadDialogClass.prototype.CMSEvent = cms_event;
UploadDialogClass.prototype.set_callback = set_callback;
UploadDialogClass.prototype.CallEvent = call_event;
UploadDialogClass.prototype.get_upload_content = get_upload_content;
UploadDialogClass.prototype.load_dialog_fun = load_dialog_fun;
UploadDialogClass.prototype.exit_dialog_fun = exit_dialog_fun;
UploadDialogClass.prototype.event_dialog_fun = event_dialog_fun;

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
function get_upload_content(params) {
    this.currentParams = params;
    var si = this.AppCMS.session_id;
    var nd = this.parent.Noderid;
    if (!this.StatusShow) {
        this.AppCMS.StatusBarPrint("ƒиалог дл€ загрузки изображени€");
        var url_str = this.AppCMS.Server.conman_path + "components/UploadDialogs/uploadDialog.php?nodeid=" + nd + "&sessionid=" + si + "&type=" + this.type;
        if (this.type == "file")
            var prop = this.file_dialog_prop;
        else
            var prop = this.dialog_prop;
        this.dialogwin = new modal_dialog(url_str, this, this.load_dialog_fun, this.exit_dialog_fun, this.event_dialog_fun, prop);
        this.dialogwin.Show();
    };
}
//********************************************************************************************
function load_dialog_fun(owner, doc_param, win_param) {
    owner.StatusShow = true;
    owner.dc = doc_param;
    owner.win = win_param;
    owner.AppCMS.StopActions();
};
//********************************************************************************************
function exit_dialog_fun(owner, params) {
    owner.StatusShow = false;
    owner.AppCMS.StatusBarPrint("√отово");
    owner.AppCMS.StartActions();
}

//********************************************************************************************
function event_dialog_fun(owner, params) {
    owner.AppCMS.StartActions();

    var params_array = owner.AppCMS.ParamsToArray(owner.currentParams);
    var dc_id = params_array["id"];
    var params_array = owner.AppCMS.ParamsToArray(params);
    params_array["method"] = "SaveCardElement";
    if (owner.type == "image")
        params_array["type"] = "image";
    if (owner.type == "file")
        params_array["type"] = "file";
    params_array["card_type"] = "e";
    params_array["xml_id"] = dc_id;
    params_array["html_id"] = dc_id;
    var new_params = owner.AppCMS.ArrayToParams(params_array);
    owner.AppCMS.ComponentEventToCMS(owner.name, new_params);
    if (owner.type == "image") {
        var act_prev = new Array();
        act_prev["method"] = "get_img_prev";
        act_prev["id"] = dc_id;
        act_prev["src"] = params_array["filepath"];
        var new_params = owner.AppCMS.ArrayToParams(act_prev);
        owner.AppCMS.ComponentEventToCMS(owner.name, new_params);
    };
    if (owner.type == "file") {
        var act_prev = new Array();
        act_prev["method"] = "update_file_path";
        act_prev["id"] = dc_id;
        act_prev["path"] = params_array["filepath"];
        var new_params = owner.AppCMS.ArrayToParams(act_prev);
        owner.AppCMS.ComponentEventToCMS(owner.name, new_params);
    };
}
//********************************************************************************************
