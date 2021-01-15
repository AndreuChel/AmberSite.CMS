function debuger(name, app_cms, DC) {

    this.name = name;
    this.AppCMS = app_cms;
    this.DC = DC;
    this.AppCMS.AddComponentToCMS(name, this);
}
//********************************************************************************************
debuger.prototype.CMSEvent = cms_event;
debuger.prototype.CallEvent = call_event;
//********************************************************************************************
function cms_event(name, params) {
    document.getElementById(this.DC).innerHTML = "<div> ->" + name + " :   " + params + "</div>" + document.getElementById(this.DC).innerHTML;
}
//********************************************************************************************
function call_event(params) {
    this.AppCMS.ComponentEventToCMS(params);
}
//********************************************************************************************
