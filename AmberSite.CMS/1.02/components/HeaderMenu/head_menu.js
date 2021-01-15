function head_menu(name, app_cms, DC) {

    this.name = name;
    this.AppCMS = app_cms;
    this.DC = DC;
    this.AppCMS.AddComponentToCMS(name, this);
}
//********************************************************************************************
head_menu.prototype.CMSEvent = cms_event;
head_menu.prototype.CallEvent = call_event;
head_menu.prototype.menu_select_node = menu_select_node;
head_menu.prototype.get_children = get_children;
//********************************************************************************************
function call_event(params) {
    this.AppCMS.ComponentEventToCMS(params);
}
//********************************************************************************************
function cms_event(name, params) {
    var params_array = this.AppCMS.ParamsToArray(params);
    if (params_array["method"]) {
        var method = params_array["method"];
        eval("if (this." + method + ") this." + method + "(\"" + params + "\",\"" + name + "\")");
    };
}
//********************************************************************************************
function menu_select_node(params, name) {

    var params_array = this.AppCMS.ParamsToArray(params);
    var _id = params_array["id"];
    var _flag = params_array["flag"];
    var nav_menu_xml = this.AppCMS.GetLinkToComponent("navMenu").CurrentXML;
    var _path = "";

    if (_flag == "true") {
        var selected_node = this.AppCMS.XPathRes(nav_menu_xml, "//*[@id='" + _id + "']");
        if (!selected_node) {
            return;
        };
        var _link = selected_node.getAttribute("link");
        var _link_params = this.AppCMS.ParamsToArray(_link);
        var _path = _link_params["path"];
    } else {
        var selected_node = this.AppCMS.XPathRes(nav_menu_xml, "/result/data");
        if (!selected_node) {
            return;
        };
        var _path = selected_node.getAttribute("current_path");
    };
    document.getElementById(this.DC).innerHTML = _path;

}
//********************************************************************************************
function get_children(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _path = params_array["path"];
    document.getElementById(this.DC).innerHTML = _path;
}
//********************************************************************************************
