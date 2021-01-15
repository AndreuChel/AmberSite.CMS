function modal_dialog(url, owner, load_callback_fun, exit_callback_fun, event_callback_fun, prop_win) {
    this.url = url;
    this.owner = owner;
    this.load_callback_fun = load_callback_fun;
    this.exit_callback_fun = exit_callback_fun;
    this.event_callback_fun = event_callback_fun;
    this.name_win = "";
    this.default_prop = 'dialogHeight: 460px; dialogWidth: 1049px; dialogTop: 646px; dialogLeft: 4px; edge: Raised; center: Yes; help: Yes; resizable: Yes; status: Yes;'; //default features
    if (prop_win == null || prop_win == '')
        this.prop_win = this.default_prop;
    else
        this.prop_win = prop_win + "; Scroll: no";
};
//************************************************************************
modal_dialog.prototype.transform_prop = transform_prop;
modal_dialog.prototype.Show = show_modal_dialog;
modal_dialog.prototype.ShowWyswig = show_modal_dialog_wyswig;
modal_dialog.prototype.LoadCallbackDialogFun = LoadCallbackDialogFun;
modal_dialog.prototype.ExitCallbackDialogFun = ExitCallbackDialogFun;
modal_dialog.prototype.EventCallbackDialogFun = EventCallbackDialogFun;
//************************************************************************
function transform_prop(flagIE) {

    var str_prop = this.prop_win;
    str_prop = str_prop.replace(/ /gi, '');
    var str_prop_array = str_prop.split(";");
    var res_str = "directories=0,menubar=0,titlebar=0,toolbar=0,scroll=0, ";
    for (x in str_prop_array) {
        aTmp = str_prop_array[x].split(":");
        sKey = aTmp[0].toLowerCase();
        sVal = aTmp[1];
        if (sKey == "dialogheight")
            sVal = parseInt(sVal) - 35;
        if (sKey == "dialogwidth")
            sVal = parseInt(sVal);
        switch (sKey) {
        case "dialogheight":
            res_str += "height=" + (sVal) + ",";
            var pHeight = sVal;
            break;
        case "dialogwidth":
            res_str += "width=" + sVal + ",";
            var pWidth = sVal;
            break;
        case "dialogtop":
            res_str += "screenY=" + sVal + ",";
            break;
        case "dialogleft":
            res_str += "screenX=" + sVal + ",";
            break;
        case "resizable":
            res_str += "resizable=" + sVal + ",";
            break;
        case "status":
            res_str += "status=" + sVal + ",";
            break;
        case "center":
            if (sVal.toLowerCase() == "yes") {
                if (!flagIE) {
                    res_str += "screenY=" + ((screen.availHeight - pHeight) / 2) + ",";
                    res_str += "screenX=" + ((screen.availWidth - pWidth) / 2) + ",";
                } else {
                    res_str += "top=" + ((screen.availHeight - pHeight) / 2) + ",";
                    res_str += "left=" + ((screen.availWidth - pWidth) / 2) + ",";

                }
            }
            break;
        }
    }
    res_str += ", modal=yes";
    return res_str;
}
//************************************************************************
function show_modal_dialog() {
    if (this.url == null || this.url == '')
        return false;

    if (window.navigator.appVersion.indexOf("MSIE") != -1) {
        this.name_win = window.showModelessDialog(this.url, this, this.prop_win);
        return;
    };
    this.name_win = window.open(this.url, "FCKBrowseWindow", this.transform_prop(false));
    this.name_win.dialogArguments = this;
}
//************************************************************************
function show_modal_dialog_wyswig() {
    var flag = false;
    if (this.url == null || this.url == '')
        return false;
    if (window.navigator.appVersion.indexOf("MSIE") != -1)
        flag = true;

    this.name_win = window.open(this.url, "Test", this.transform_prop(flag));
    this.name_win.dialogArguments = this;
}
//************************************************************************
function LoadCallbackDialogFun(doc_param, win_param) {
    this.load_callback_fun(this.owner, doc_param, win_param);
}
//************************************************************************
function ExitCallbackDialogFun(params) {
    this.exit_callback_fun(this.owner, params);
}
//************************************************************************
function EventCallbackDialogFun(params) {
    return this.event_callback_fun(this.owner, params);
}
//************************************************************************

