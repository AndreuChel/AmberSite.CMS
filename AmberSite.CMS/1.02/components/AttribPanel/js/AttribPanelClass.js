function AttribPanelClass (name, app_cms, DC) {
	this.name = name;
	this.AppCMS = app_cms;
	this.DC = DC;
	this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/AttribPanel/xslt/attribs.xsl");	
	this.AppCMS.AddComponentToCMS(name,this);
}
//********************************************************************************************
AttribPanelClass.prototype.CMSEvent = cms_event;
AttribPanelClass.prototype.CallEvent = call_event;
AttribPanelClass.prototype.menu_select_node = menu_select_node;
AttribPanelClass.prototype.get_children = get_children;
AttribPanelClass.prototype.get_card = get_card;
AttribPanelClass.prototype.SaveAttrib = SaveAttrib;
//********************************************************************************************
function call_event (params) {
	this.AppCMS.ComponentEventToCMS(this.name,params);
}
//********************************************************************************************
function cms_event (name,params) {
	var params_array = this.AppCMS.ParamsToArray(params);
	if (params_array["method"]) {
		var method = params_array["method"];
		eval ("if (this."+method+") this."+method+"(\""+params+"\",\""+name+"\")");
	};
}
//********************************************************************************************
function SaveAttrib (_id) {

}
//********************************************************************************************
function menu_select_node (params,name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _id = params_array["id"];
    var _flag = params_array["flag"];
    var nav_menu_xml = this.AppCMS.GetLinkToComponent("navMenu").CurrentXML;
    document.getElementById(this.DC).style.display='none';
    if (_flag == "true") {
		
        var selected_node = this.AppCMS.XPathRes(nav_menu_xml, "//*[@id='"+_id+"']");
        if (!selected_node) { return; };
        
        var perm = selected_node.getAttribute("node_mask");
        if (perm.indexOf("W") == -1) return;
		var sel_document = this.AppCMS.Server.NewXmlDocument(selected_node);
        var tmpHTML = this.AppCMS.Server.XSLT_transform(sel_document,this.xslt_Template);
		
		document.getElementById(this.DC).innerHTML = "<div id=\"nodes\"><div id=\"attr\">"+tmpHTML+"</div></div>";
        document.getElementById(this.DC).style.display='block';
	
    }
    else {
        document.getElementById(this.DC).style.display='none';
    };
}
//********************************************************************************************
function get_children (params,name) {
    document.getElementById(this.DC).style.display='none';
}
//********************************************************************************************
function get_card (params,name) {
    document.getElementById(this.DC).style.display='none';
}
//********************************************************************************************