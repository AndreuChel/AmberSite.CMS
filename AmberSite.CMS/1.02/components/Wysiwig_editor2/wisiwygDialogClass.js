function wisiwygDialogClass (name, parent, app_cms) {
	this.name = name;
	this.AppCMS = app_cms;
	this.parent = parent;
	this.callback_fun = false;
	this.ElemId = false;
	this.SelectedNode = false;

	this.StatusShow = false;
	this.dc=false;
	this.win = false;
        if (this.AppCMS.Server.brouzer == "IE")
           this.dialog_prop = 'dialogHeight: 560px; dialogWidth: 777px; dialogTop: 150px; dialogLeft: 150px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';
        else
           this.dialog_prop = 'dialogHeight: 555px; dialogWidth: 771px; dialogTop: 150px; dialogLeft: 150px; edge: Raised; center: Yes; help: No; resizable: No; status: No;';
	this.AppCMS.StatusBarPrint("Загрузка данных ...");
	this.AppCMS.AddComponentToCMS(name,this);
        this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/Wysiwig_editor2/xslt/link_card.xsl");
        this.AppCMS.StatusBarPrint("Готово");
}
//********************************************************************************************
wisiwygDialogClass.prototype.CMSEvent = cms_event;
wisiwygDialogClass.prototype.set_callback = set_callback;
wisiwygDialogClass.prototype.CallEvent = call_event;
wisiwygDialogClass.prototype.get_wysiwig_content = get_wysiwig_content;
wisiwygDialogClass.prototype.get_linkdialog_content = get_linkdialog_content;
wisiwygDialogClass.prototype.get_selected_link = get_selected_link;
wisiwygDialogClass.prototype.get_selected_link_title = get_selected_link_title;
wisiwygDialogClass.prototype.load_dialog_fun = load_dialog_fun;
wisiwygDialogClass.prototype.exit_dialog_fun = exit_dialog_fun;
wisiwygDialogClass.prototype.event_dialog_fun = event_dialog_fun;
wisiwygDialogClass.prototype.event_dialog_fun_link = event_dialog_fun_link;
wisiwygDialogClass.prototype.callback_link = callback_link;

//********************************************************************************************
function  cms_event (name, params) {
         var param = params.split('#');
         for (i in param) {
             var pr = param[i].split('=');
             if (pr[0]=="method") eval ("if (this."+pr[1]+") this."+pr[1]+"(\""+params+"\",\""+name+"\")");
         };
}
//********************************************************************************************
function call_event (params) {
	this.AppCMS.ComponentEventToCMS(params);
}
//********************************************************************************************
function set_callback(elem_id,fun) {
         this.ElemId = elem_id;
         this.callback_fun = fun;
}
//********************************************************************************************
function get_wysiwig_content(params) {
         this.currentParams = params;
         if (!this.StatusShow) {
            var url_str = this.AppCMS.Server.conman_path  + "components/Wysiwig_editor2/wisiwygDialog.php";
            this.dialogwin = new modal_dialog(url_str, this, this.load_dialog_fun, this.exit_dialog_fun, this.event_dialog_fun, this.dialog_prop);
            this.dialogwin.ShowWyswig();
            return;
         };
}
//********************************************************************************************
function load_dialog_fun(owner, doc_param, win_param) {
         owner.AppCMS.StopActions();
         win_param.title = "Редактор текстов";
         owner.StatusShow = true;
         owner.dc = doc_param;
         owner.win = win_param;
         //owner.win.setAppCMS(owner.AppCMS);
         owner.win.MainAppCMS = owner.AppCMS;
         var _data = owner.callback_fun(owner.ElemId, "get_data", "");
         owner.dc.getElementById("FCKeditor1").value = _data;
         //win_param.generate_wysiwyg("textarea1");
};
//********************************************************************************************
function exit_dialog_fun(owner, params) {
         owner.StatusShow = false;
         owner.AppCMS.StartActions();
}

//********************************************************************************************
function event_dialog_fun(owner, params) {
         if (params == "get_link_dialog_wyswig")
            return owner.event_dialog_fun_link("test3");
         owner.currentParams = params;
         owner.callback_fun(owner.ElemId,"set_data", params);
}
//********************************************************************************************
function event_dialog_fun_link(params) {
         this.AppCMS.StartActions();
         //var new_params = "method=get_linkdialog#id=#choose_path=root/sites";
         var new_params = "method=get_linkdialog_content#id=#choose_path=root/sites";
         var l_d= top.AppCMS.GetLinkToComponent("LinkDialog");
         if (!l_d) l_d = new LinkDialogClass ("LinkDialog", this, this.AppCMS,this.StartPath);
         l_d.set_callback("", this.callback_link);
         this.AppCMS.ComponentEventToCMS(this.name,new_params);
         return "Yes";
}
//********************************************************************************************
function callback_link(owner, dc_id, params) {
         alert ("Ура нах");
         owner.AppCMS.StopActions();
         //
};
//********************************************************************************************
function get_linkdialog_content(params) {
         this.SelectedNode = false;
         var params_array = this.AppCMS.ParamsToArray(params);
         if (!params_array["method"]) {
            return false;
         };
         if (params_array["event"]) {
            this.SelectedNode  = "method=ChangeLink#id="+this.parentElementId;
            this.SelectedNode += "#title="+params_array["title"];
            this.SelectedNode += "#path="+params_array["path"];
            if (params_array["event"]=="click") return false;
         }

         if (params_array["method"]!="get_linkdialog_content" && params_array["method"]!="get_children") {
            return false;
         };
         var act = this.AppCMS.ParamsToAction(this.AppCMS.html_special(params));
         var res = this.AppCMS.Server.ExecuteAction(act);
         if (!res) {
            this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
            this.AppCMS.StopActions();
            return false;
         };
         var tmpHTML = this.AppCMS.Server.XSLT_transform(res,this.xslt_Template);
         return tmpHTML;
}
//********************************************************************************************
function get_selected_link() {
         if (!this.SelectedNode) return false;
         var params_array = this.AppCMS.ParamsToArray(this.SelectedNode);
         return params_array["path"];
};
//********************************************************************************************
function get_selected_link_title() {
         if (!this.SelectedNode) return false;
         var params_array = this.AppCMS.ParamsToArray(this.SelectedNode);
         return params_array["title"];
};
