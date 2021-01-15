function ClaeanHTMLClass(docElem) {
    this.level = 0;
    this.buff = "";
    this.counter = 0;
    var goodAttributes0 = new Array();

    var goodTags0 = ["blockquote", "u", "a", "p", "br", "nobr", "strong", "b", "em", "i", "tt", "code", "pre", "ul", "ol", "li", "img", "table", "tbody", "thead", "tfoot", "caption", "tr", "td", "th", "col", "colgroup", "h1", "h2", "h3", "h4", "h5", "h6", "small", "big", "sub", "sup", "div", "span"];
    var emptyInlineTags0 = ["strong", "b", "em", "i", "tt", "code", "small", "big", "sub", "sup", "span", "p", "strong", "pre", "div", "a"];
    // хорошие атрибуты (допустимы у всех тегов)
    goodAttributes0["all"] = ["href", "target", "title", "alt", "src", "id"];
    // дополнительные допустимые атрибуты для отдельных тегов
    goodAttributes0["img"] = ["width", "height", "align", "preview"];
    goodAttributes0["table"] = ["border", "width"];
    goodAttributes0["tr"] = ["noWrap", "align", "vAlign", "width"];
    goodAttributes0["td"] = ["noWrap", "align", "vAlign", "width", "colspan", "rowspan"];
    goodAttributes0["col"] = ["noWrap", "align", "vAlign", "width"];
    goodAttributes0["colgroup"] = ["noWrap", "align", "vAlign", "width"];
    goodAttributes0["a"] = ["href"];
    goodAttributes0["area"] = ["href", "name"];
    goodAttributes0["br"] = ["clear"];
    goodAttributes0["p"] = ["align"];
    goodAttributes0["blockquote"] = ["dir", "style"];

    this.goodTags = new Array();
    for (var ii in goodTags0) {
        var tmp = goodTags0[ii];
        this.goodTags[tmp] = true;
    };
    this.emptyInlineTags = new Array();
    for (var ii in emptyInlineTags0) {
        var tmp = emptyInlineTags0[ii];
        this.emptyInlineTags[tmp] = true;
    };
    this.goodAttribs = new Array();
    for (var ii in goodAttributes0) {
        this.goodAttribs[ii] = new Array();
        for (var jj in goodAttributes0[ii]) {
            var tmp = goodAttributes0[ii][jj];
            this.goodAttribs[ii][tmp] = true;
        }
    }

}
ClaeanHTMLClass.prototype.ScanTags = ScanTags;
ClaeanHTMLClass.prototype.TestTags = TestTags;
ClaeanHTMLClass.prototype.TestAttribs = TestAttribs;
ClaeanHTMLClass.prototype.html_special = html_special;
//-----------------------------------------------------------------------
function TestTags(nameTag, col_childs) {
    var _name = nameTag.toLowerCase();
    if (this.goodTags[_name]) {
        if (col_childs == 0 && this.emptyInlineTags[_name])
            return false;
        return true;
    }
    return false;
}
//-----------------------------------------------------------------------
function TestAttribs(nameTag, nameAttrib) {
    var _name = nameAttrib.toLowerCase();
    var _TagName = nameTag.toLowerCase();
    if (this.goodAttribs["all"][_name])
        return true;
    if (this.goodAttribs[_TagName])
        if (this.goodAttribs[_TagName][_name])
            return true;
    return false;
}
//-----------------------------------------------------------------------
function ScanTags(parentElem, sitepath) {
    var start_tag_buff = "";
    var end_tag_buff = "";
    var buff_attribs = "";
    var child_buff = "";
    if (!parentElem)
        return "";

    this.level++;
    var buff_attribs = "";
    if (parentElem.attributes)
        for (jj = 0; jj < parentElem.attributes.length; jj++) {
            var nameAttr = parentElem.attributes[jj].nodeName;
            var browserName = navigator.appName;
            if (browserName == "Microsoft Internet Explorer" && nameAttr.toLowerCase() == "style")
                var valAttr = parentElem.getAttribute(nameAttr).cssText;
            else {
                var valAttr = parentElem.getAttribute(nameAttr);
                if (nameAttr.toLowerCase() == "alt" && valAttr == "")
                    valAttr = sitepath;
            };
            if (valAttr) {
                if (nameAttr.toLowerCase() == "style") {
                    try {
                        valAttr = valAttr.replace(/\"/g, ""); //"
                    } catch (ex) {
                        valAttr = "";
                    }
                };
                if (this.TestAttribs(parentElem.nodeName, nameAttr)) {
                    if (parentElem.nodeName.toLowerCase() == "img") {
                        var t_fl = false;
                        for (kk = 0; kk < parentElem.attributes.length; kk++)
                            if (parentElem.attributes[kk].nodeName.toLowerCase() == "alt")
                                t_fl = true;
                        if (!t_fl)
                            buff_attribs += " alt=\"" + sitepath + "\"";
                    };
                    buff_attribs += " " + nameAttr.toLowerCase() + "=\"" + this.html_special(valAttr) + "\"";
                };
            };

        };

    start_tag_buff += (parentElem.nodeName != "#text") ? "<" + parentElem.nodeName.toLowerCase() : this.html_special(parentElem.data);
    start_tag_buff += buff_attribs;

    var list = parentElem.childNodes;
    if (parentElem.nodeName != "#text")
        start_tag_buff += (list.length == 0) ? "/>" : ">";
    for (var ii = 0; ii < list.length; ii++)
        child_buff += this.ScanTags(list[ii], sitepath);
    if (parentElem.nodeName != "#text")
        end_tag_buff += (list.length > 0) ? "</" + parentElem.nodeName.toLowerCase() + ">" : "";
    this.level--;
    if (this.level == 0) {
        return child_buff;
    };
    var res = "";
    if (parentElem.nodeName != "#text") {
        res = child_buff;
        if (this.TestTags(parentElem.nodeName, list.length))
            res = start_tag_buff + child_buff + end_tag_buff;
    } else
        res = start_tag_buff;
    return res;
};
function html_special(str) {
    if (str == null)
        return "";
    var tmp = str.toString();
    tmp = tmp.replace(/\&/g, "&amp;");
    tmp = tmp.replace(/\"/g, "&quot;"); //"
    tmp = tmp.replace(/\'/g, "&#x27;");
    tmp = tmp.replace(/\</g, "&lt;");
    tmp = tmp.replace(/\>/g, "&gt;");
    return tmp;
}
//***************************************************************
//Запуск Объекта происходит в navMenuClass.js в методе "get_card"
//***************************************************************

//Класс карточки для редактирования
function DataCardClass(name, app_cms, startpath, DC) {
    this.FlagSaveCard = true;
    this.name = name;
    this.AppCMS = app_cms;
    this.StartPath = startpath;
    this.Noderid = "";
    this.WriteMode = 0;
    //идентификатор тега, куда будет осуществляться вывод карточки
    this.DC = DC;

    this.AppCMS.StatusBarPrint("Загрузка данных ...");
    this.AppCMS.AddComponentToCMS(name, this);
    //загрузка шаблона формирования html карточки
    this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/DataCard/xslt/card.xsl");
    //загрузка хмл данных типов элементов карточки
    //        this.dp_xml = this.AppCMS.Server.getXMLfile("settings/dp.xml");
    //загрузка шаблона для формирования хмл из данных пришедших с сервера
    this.xslt_buff = this.AppCMS.Server.getXSLTtamplate("components/DataCard/xslt/shab.xsl");
    this.save_xslt = this.AppCMS.Server.getXSLTtamplate("components/DataCard/xslt/unshab.xsl");

    this.title_xslt = this.AppCMS.Server.getXSLTtamplate("components/DataCard/xslt/title_card.xsl");

    //загрузка шаблона для присвоения id всем элеминтам рабочего хмл
    this.xslt_set_id = this.AppCMS.Server.getXSLTtamplate("components/DataCard/xslt/set_id.xsl");
    this.dstyle = this.AppCMS.SysSettings.getElementsByTagName("dstyle").item(0).cloneNode(true);
    if (!this.xslt_Template)
        alert(this.AppCMS.Server.ErrorInfo());
    this.AppCMS.StatusBarPrint("Готово");
    this.WorkXML = "";
    this.WorkParams = "";
    this.ColectionsCount = 0;
}
//********************************************************************************************
//функция обработки входящих сообщений системы
DataCardClass.prototype.CMSEvent = cms_event;

//функция для отравки сообщения модуля системе
DataCardClass.prototype.CallEvent = call_event;

//функция, которая реагирует на сообщение системы - нарисовать карточку
DataCardClass.prototype.get_card = get_card;

//функция, которая реагирует на сообщение системы - запросить с сервера превью изображения
DataCardClass.prototype.get_img_prev = get_img_prev;

//функция, которая реагирует на сообщение системы - запросить с сервера заголовок ссылки
DataCardClass.prototype.get_link_title = get_link_title;

//функция, которая реагирует на сообщение системы - показать диалог выбора ссылки
DataCardClass.prototype.get_linkdialog = get_linkdialog;

DataCardClass.prototype.get_wysiwig = get_wysiwig;
DataCardClass.prototype.callback_wisiwyg_fun = callback_wisiwyg_fun;
DataCardClass.prototype.SaveWysiwigData = SaveWysiwigData;

DataCardClass.prototype.get_upload_image_dialog = get_upload_image_dialog;
DataCardClass.prototype.get_upload_file_dialog = get_upload_file_dialog;
DataCardClass.prototype.update_file_path = update_file_path;

//функция выводит заголовок ссылки в карточку (callback фунция)
DataCardClass.prototype.save_linkdialog_res = save_linkdialog_res;

DataCardClass.prototype.insert_collection_element = insert_collection_element;
DataCardClass.prototype.delete_collection_element = delete_collection_element;
DataCardClass.prototype.update_calendar = update_calendar;

DataCardClass.prototype.SaveCardElement = SaveCardElement;
DataCardClass.prototype.save_and_synchronize_card = save_and_synchronize_card;
DataCardClass.prototype.left_menu_action_card = left_menu_action_card;
DataCardClass.prototype.goto_from_data_card = goto_from_data_card;
DataCardClass.prototype.return_from_data_card = return_from_data_card;
//********************************************************************************************
function cms_event(name, params) {
    var params_array = this.AppCMS.ParamsToArray(params);
    if (params_array["method"]) {
        var method = params_array["method"];
        eval("if (this." + method + ") this." + method + "(\"" + params + "\",\"" + name + "\")");
    };
}
//********************************************************************************************
function call_event(params) {
    //!!!!!продумать реализацию!!!!!!
    //	 this.AppCMS.ComponentEventToCMS(this.name,params);
}
//********************************************************************************************
function get_img_prev(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _src = params_array["src"];
    if (_src == "")
        _src = "img/sys/empty.gif";
    var dc_id = params_array["id"];
    var f_src = _src.split("/");
    var f_name = f_src[f_src.length - 1];
    if (f_name == "empty.gif") {
        document.getElementById(dc_id).onload = function () {
            return false;
        };
        document.getElementById(dc_id).src = this.AppCMS.site_path + '/' + _src;
        return;
    };
    var f_src = f_name.split("-");
    var f_name = f_src[1];
    var f_src = f_name.split(".");
    var f_name = f_src[0];
    var f_src = f_name.split("x");
    var _width = f_src[0];
    var _height = f_src[1];

    if (_width <= 160 && _height <= 100) {
        document.getElementById(dc_id).onload = function () {
            return false;
        };
        document.getElementById(dc_id).src = this.AppCMS.site_path + '/' + _src;
        return;
    };

    str_act = this.AppCMS.ParamsToAction(params);
    this.AppCMS.StatusBarPrint("Загрузка изображений...");
    var res = this.AppCMS.Server.ExecuteAction(str_act);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    var p_path = res.getElementsByTagName("result").item(0).getAttribute("p_path");
    this.AppCMS.StatusBarPrint("Готово");

    document.getElementById(dc_id).onload = function () {
        return false;
    };
    document.getElementById(dc_id).src = this.AppCMS.site_path + '/' + p_path;

    this.AppCMS.StatusBarPrint("Готово");
}
//********************************************************************************************
function get_link_title(params, name) {

    str_act = this.AppCMS.ParamsToAction(params);
    this.AppCMS.StatusBarPrint("Загрузка заголовков ссылок...");
    var res = this.AppCMS.Server.ExecuteAction(str_act);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    var link_title = res.getElementsByTagName("result").item(0).getAttribute("link_title");
    this.AppCMS.StatusBarPrint("Готово");

    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];

    if (link_title)
        document.getElementById(dc_id).value = link_title;
    this.AppCMS.StatusBarPrint("Готово");
}
//********************************************************************************************
function get_linkdialog(params, name) {

    if (this.WriteMode == "0")
        return;
    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];
    params_array["method"] = "get_linkdialog_content";
    var new_params = this.AppCMS.ArrayToParams(params_array);
    var l_d = top.AppCMS.GetLinkToComponent("LinkDialog");
    if (!l_d)
        l_d = new LinkDialogClass("LinkDialog", this, this.AppCMS, this.StartPath);
    l_d.set_callback(dc_id, this.save_linkdialog_res);

    this.AppCMS.ComponentEventToCMS(this.name, new_params);
};
//********************************************************************************************
function save_linkdialog_res(owner, dc_id, params) {
    var params_array = owner.AppCMS.ParamsToArray(params);
    var xml_id = params_array["id"];
    var _title = params_array["title"];
    var _path = params_array["path"];
    document.getElementById(xml_id).value = _title;

    var quary = "//*[@id='" + xml_id + "']";
    if (owner.AppCMS.Server.brouzer == "IE")
        var _node = owner.WorkXML.documentElement.selectSingleNode(quary);
    else
        var _node = owner.WorkXML.evaluate(quary, owner.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();

    var _typeElement = _node.nodeName;
    var new_params = new Array();
    new_params["method"] = "SaveCardElement";
    new_params["type"] = "link";
    if (_typeElement == "FormAttrib")
        new_params["card_type"] = "a";
    else
        new_params["card_type"] = "e";
    new_params["path"] = _path;
    new_params["xml_id"] = xml_id;
    new_params["html_id"] = xml_id;
    owner.AppCMS.ComponentEventToCMS(owner.name, owner.AppCMS.ArrayToParams(new_params));

};
//********************************************************************************************
function get_wysiwig(params, name) {

    if (this.WriteMode == "0")
        return;
    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];
    params_array["method"] = "get_wysiwig_content";
    var new_params = this.AppCMS.ArrayToParams(params_array);
    var l_d = top.AppCMS.GetLinkToComponent("WisiwygEditorDialog");
    if (!l_d)
        l_d = new wisiwygDialogClass("WisiwygEditorDialog", this, this.AppCMS);
    l_d.set_callback(dc_id, this.callback_wisiwyg_fun);
    this.AppCMS.ComponentEventToCMS(this.name, new_params);
};
//********************************************************************************************
function callback_wisiwyg_fun(dc_id, _action, _params) {
    if (_action == "get_data") {
        var _data = document.getElementById(dc_id).innerHTML;
        return _data;
    };
    if (_action == "set_data") {
        var dataCard = this.AppCMS.GetLinkToComponent("DataCard");
        document.getElementById(dc_id).innerHTML = _params;
        var scaner = new ClaeanHTMLClass(document.getElementById(dc_id));
        var res = scaner.ScanTags(document.getElementById(dc_id), this.AppCMS.site_path);
        document.getElementById(dc_id).innerHTML = res;
        dataCard.SaveWysiwigData(dc_id, res);
        var act = "method=SaveCardElement#type=html-text#card_type=e#xml_id=" + dc_id + "#html_id=" + dc_id;
        this.AppCMS.ComponentEventToCMS(this.name, act);
    };
};
//********************************************************************************************
function SaveWysiwigData(dc_id, _val) {
    var newChild = "<FormElementHtmlText>" + _val + "</FormElementHtmlText>";
    var new_node = this.AppCMS.Server.XmlToDom(newChild);
    var new_node = new_node.documentElement;

    var parent_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + dc_id + "']");
    var old_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + dc_id + "']/FormElementHtmlText");
    parent_node.replaceChild(new_node, old_node);
}
//********************************************************************************************
function get_upload_image_dialog(params, name) {
    if (this.WriteMode == "0")
        return;
    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];
    params_array["method"] = "get_upload_content";
    var new_params = this.AppCMS.ArrayToParams(params_array);
    var l_d = top.AppCMS.GetLinkToComponent("UploadDialog");
    if (!l_d)
        l_d = new UploadDialogClass("UploadDialog", this, this.AppCMS, this.StartPath, "image");
    l_d.type = "image";
    this.AppCMS.ComponentEventToCMS(this.name, new_params);
}
//********************************************************************************************
function get_upload_file_dialog(params, name) {
    if (this.WriteMode == "0")
        return;
    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];
    params_array["method"] = "get_upload_content";
    var new_params = this.AppCMS.ArrayToParams(params_array);
    var l_d = top.AppCMS.GetLinkToComponent("UploadDialog");
    if (!l_d)
        l_d = new UploadDialogClass("UploadDialog", this, this.AppCMS, this.StartPath, "file");
    l_d.type = "file";
    this.AppCMS.ComponentEventToCMS(this.name, new_params);
}
//********************************************************************************************
function update_file_path(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var dc_id = params_array["id"];
    var _path = params_array["path"];
    document.getElementById("path" + dc_id).value = _path;
};
//********************************************************************************************
function update_calendar(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var cal_id = params_array["id"];

    var quary = "//*[@id='" + cal_id + "']";
    if (this.AppCMS.Server.brouzer == "IE")
        var _node = this.WorkXML.documentElement.selectSingleNode(quary);
    else
        var _node = this.WorkXML.evaluate(quary, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();
    var _typeElement = _node.nodeName;

    var new_params = new Array();
    new_params["method"] = "SaveCardElement";
    new_params["type"] = "date";
    if (_typeElement == "FormAttrib")
        new_params["card_type"] = "a";
    else
        new_params["card_type"] = "e";
    new_params["in_attr"] = "d";
    new_params["xml_id"] = cal_id;
    new_params["html_id"] = "dd" + cal_id;
    var act1 = this.AppCMS.ArrayToParams(new_params);
    new_params["in_attr"] = "m";
    new_params["html_id"] = "mm" + cal_id;
    var act2 = this.AppCMS.ArrayToParams(new_params);
    new_params["in_attr"] = "y";
    new_params["html_id"] = "yyyy" + cal_id;
    var act3 = this.AppCMS.ArrayToParams(new_params);
    this.AppCMS.ComponentEventToCMS(this.name, act1);
    this.AppCMS.ComponentEventToCMS(this.name, act2);
    this.AppCMS.ComponentEventToCMS(this.name, act3);

};
//********************************************************************************************
function delete_collection_element(params, name) {
    this.FlagSaveCard = false;
    if (this.WriteMode == "0")
        return;
    if (!confirm("Нажмите < OK > для удаления элемента коллекции ..."))
        return;
    this.ColectionsCount++;
    var params_array = this.AppCMS.ParamsToArray(params);
    var parent_id = params_array["parent_id"];
    var _id = params_array["id"];

    var quary = "//FormElement[@id='" + _id + "']";
    if (this.AppCMS.Server.brouzer == "IE")
        var del_node = this.WorkXML.documentElement.selectSingleNode(quary);
    else
        var del_node = this.WorkXML.evaluate(quary, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();

    var quary = "//FormElement[@id='" + parent_id + "']";
    if (this.AppCMS.Server.brouzer == "IE")
        var collection_node = this.WorkXML.documentElement.selectSingleNode(quary);
    else
        var collection_node = this.WorkXML.evaluate(quary, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();
    collection_node.removeChild(del_node);

    var del_child = document.getElementById("div" + _id);
    var del_button = document.getElementById("cl_s" + _id);
    document.getElementById("div" + parent_id).removeChild(del_child);
    document.getElementById("div" + parent_id).removeChild(del_button);

};
//********************************************************************************************
function insert_collection_element(params, name) {
    this.FlagSaveCard = false;
    if (this.WriteMode == "0")
        return;
    this.ColectionsCount++;
    var params_array = this.AppCMS.ParamsToArray(params);
    var parent_id = params_array["parent_id"];
    var type = params_array["type"];
    var id = params_array["id"];
    var title = params_array["title"];
    var quary = "//FormElement[@id='" + parent_id + "']/options/FormElement";
    if (this.AppCMS.Server.brouzer == "IE")
        var node = this.WorkXML.documentElement.selectSingleNode(quary);
    else
        var node = this.WorkXML.evaluate(quary, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();

    var quary1 = "//FormElement[@id='" + parent_id + "']";
    if (this.AppCMS.Server.brouzer == "IE")
        var parent_node = this.WorkXML.documentElement.selectSingleNode(quary1);
    else
        var parent_node = this.WorkXML.evaluate(quary1, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();
    if (id) {
        var quary2 = "//FormElement[@id='" + id + "']";
        if (this.AppCMS.Server.brouzer == "IE")
            var before_node = this.WorkXML.documentElement.selectSingleNode(quary2);
        else
            var before_node = this.WorkXML.evaluate(quary2, this.WorkXML, null, XPathResult.ANY_TYPE, null).iterateNext();
    }

    var tmp_buf = this.AppCMS.Server.XmlToDom(this.AppCMS.Server.XSLT_transform(node, this.xslt_set_id));
    tmp_buf.documentElement.setAttribute("collection", parent_id);

    if (!node)
        return;
    var fe_tags = tmp_buf.getElementsByTagName("FormElement");
    var fa_tags = tmp_buf.getElementsByTagName("FormAttrib");
    for (var i = 0; i < fe_tags.length; i++) {
        var tmp = fe_tags.item(i).getAttribute("id");
        if (i == 0)
            var dc_id = this.ColectionsCount + tmp;
        fe_tags.item(i).setAttribute("id", this.ColectionsCount + tmp);
    };
    for (var i = 0; i < fa_tags.length; i++) {
        var tmp = fa_tags.item(i).getAttribute("id");
        fa_tags.item(i).setAttribute("id", this.ColectionsCount + tmp);
    };

    var tmpHTML = this.AppCMS.Server.XSLT_transform(tmp_buf, this.xslt_Template);

    var newlink = "<input type='button' class='button' id='cl_s" + dc_id + "' "; //"
    newlink += "onClick=\"javascript:callEvent('method=insert_collection_element#parent_id=" + parent_id;
    newlink += "#type=before#id=" + dc_id + "#title=" + title + "');\""; //"
    newlink += " value='" + title + "'/>";

    tmpHTML = newlink + tmpHTML;
    if (type == "last") {
        parent_node.appendChild(tmp_buf.documentElement);
        if (this.AppCMS.Server.brouzer == "IE")
            document.getElementById("cl_e" + parent_id).insertAdjacentHTML("BeforeBegin", tmpHTML);
        else {
            var mydiv = document.getElementById("div" + parent_id);
            var rng = document.createRange();
            rng.setEndBefore(document.getElementById("cl_e" + parent_id));
            htmlFrag = rng.createContextualFragment(tmpHTML);
            mydiv.insertBefore(htmlFrag, document.getElementById("cl_e" + parent_id));
        };
    }
    if (type == "before") {
        parent_node.insertBefore(tmp_buf.documentElement, before_node);
        if (this.AppCMS.Server.brouzer == "IE")
            document.getElementById("cl_s" + id).insertAdjacentHTML("BeforeBegin", tmpHTML);
        else {
            var mydiv = document.getElementById("div" + parent_id);
            var rng = document.createRange();
            rng.setEndBefore(document.getElementById("cl_e" + parent_id));
            htmlFrag = rng.createContextualFragment(tmpHTML);
            mydiv.insertBefore(htmlFrag, document.getElementById("cl_s" + id));
        };
    }
}
//********************************************************************************************
function get_card(params, name) {
    this.FlagSaveCard = true;
    this.WorkParams = params;
    if (name != "navMenu")
        return false;
    str_act = this.AppCMS.ParamsToAction(params);
    this.AppCMS.StatusBarPrint("Загрузка данных...");
    var res = this.AppCMS.Server.ExecuteAction(str_act);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    var tmp_res = "";

    this.Noderid = res.documentElement.getAttribute("noderid");
    this.WriteMode = res.documentElement.getAttribute("write_mode");

    //*******************************
    var system_node = this.AppCMS.XPathRes(res, "/result/SysInfoTag");
    var res_node = this.AppCMS.XPathRes(res, "/result");
    var sysOptions_xml = this.AppCMS.Server.DomToSting(system_node.cloneNode(true));
    var sysOptions = this.AppCMS.Server.XmlToDom(sysOptions_xml);
    res_node.removeChild(system_node);
    var title_html = this.AppCMS.Server.XSLT_transform(sysOptions, this.title_xslt);
    //*******************************

    res.getElementsByTagName("result").item(0).appendChild(this.dstyle);

    var tmp_buf = this.AppCMS.Server.XmlToDom(this.AppCMS.Server.XSLT_transform(res, this.xslt_buff));
    //alert (this.AppCMS.Server.DomToSting(tmp_buf));

    tmp_buf = this.AppCMS.Server.XmlToDom(this.AppCMS.Server.XSLT_transform(tmp_buf, this.xslt_set_id));

    var tmpHTML = this.AppCMS.Server.XSLT_transform(tmp_buf, this.xslt_Template);

    this.WorkXML = tmp_buf;
    if (tmpHTML) {
        document.onload = function () {
            alert("test");
        };
        document.getElementById(this.DC).innerHTML = "<div id='content'>" + title_html + "<div class='clayer'>" + tmpHTML + "<\div>" + "</div>";
        this.AppCMS.StatusBarPrint("Готово");
    } else
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
};
//********************************************************************************************
//********************************************************************************************
function SaveCardElement(params, name) {

    this.FlagSaveCard = false;

    var params_array = this.AppCMS.ParamsToArray(params);
    var _type = params_array["type"];
    var _xml_id = params_array["xml_id"];
    var _html_id = params_array["html_id"];
    var _card_type = params_array["card_type"];

    var change_node = this.AppCMS.XPathRes(this.WorkXML, "//*[@id='" + _xml_id + "']");

    //*******************
    if (_type == "checkbox" && _card_type == "e") {
        var opt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/options");
        var input_attr = opt_node.getAttribute("input_attr");
        var _checked = opt_node.getAttribute("checked");
        var _unchecked = opt_node.getAttribute("unchecked");
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='" + input_attr + "']");
        if (document.getElementById(_html_id).checked)
            var _val = _checked;
        else
            var _val = _unchecked;
        if (save_node)
            this.AppCMS.SetInnerText(save_node, _val);
    };
    //*******************
    if (_type == "date" && _card_type == "e") {
        var _in_attr = params_array["in_attr"];

        var _val = document.getElementById(_html_id).value;
        while (_val.charAt(0) == '0')
            _val = _val.substring(1, _val.length);
        _val = parseInt(_val);
        if (isNaN(_val))
            _val = "";
        else {
            switch (_in_attr) {
            case "d":
                if (_val < 1 || _val > 31)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "m":
                if (_val < 1 || _val > 12)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "y":
                if (_val != "" && _val.toString().length == 1)
                    _val = "200" + _val.toString();
                if (_val != "" && _val.toString().length == 2)
                    _val = "20" + _val.toString();
                if (_val != "" && _val.toString().length == 3)
                    _val = "2" + _val.toString();
                break;
            default:
                break;
            };
        };
        document.getElementById(_html_id).value = _val;
        var opt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/options");
        if (opt_node) {
            var input_attr = opt_node.getAttribute("input_attr");
            var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='" + input_attr + "']");
            try {
                var _date = save_node.firstChild.nodeValue;
            } catch (ex) {
                var _date = "..";
            };
            var _date_arr = _date.split('.');
            switch (_in_attr) {
            case "d":
                _date_arr[0] = _val;
                break;
            case "m":
                _date_arr[1] = _val;
                break;
            case "y":
                _date_arr[2] = _val;
                break;
            default:
                break;
            };
            var _newVal = _date_arr[0] + "." + _date_arr[1] + "." + _date_arr[2];
            if (save_node)
                this.AppCMS.SetInnerText(save_node, _newVal);
        };
    };
    //*******************
    if (_type == "time" && _card_type == "e") {
        var _in_attr = params_array["in_attr"];

        var _val = document.getElementById(_html_id).value;
        while (_val.charAt(0) == '0')
            _val = _val.substring(1, _val.length);
        _val = parseInt(_val);
        if (isNaN(_val))
            _val = "00";
        else {
            switch (_in_attr) {
            case "m":
                if (_val < 0 || _val > 59)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "h":
                if (_val < 0 || _val > 23)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            default:
                break;
            };
        };
        document.getElementById(_html_id).value = _val;
        var opt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/options");
        if (opt_node) {
            var input_attr = opt_node.getAttribute("input_attr");
            var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='" + input_attr + "']");

            try {
                var _time = save_node.firstChild.nodeValue;
            } catch (ex) {
                var _time = ":"
            }

            var _time_arr = _time.split(':');
            switch (_in_attr) {
            case "h":
                _time_arr[0] = _val;
                break;
            case "m":
                _time_arr[1] = _val;
                break;
            default:
                break;
            };
            var _newVal = _time_arr[0] + ":" + _time_arr[1];
            if (save_node)
                this.AppCMS.SetInnerText(save_node, _newVal);
        };
    };
    //*******************
    if (_type == "link" && _card_type == "e") {
        _path = params_array["path"];
        var opt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/options");
        if (opt_node) {
            var input_attr = opt_node.getAttribute("input_attr");
            var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='" + input_attr + "']");
            if (save_node)
                this.AppCMS.SetInnerText(save_node, _path);
        };
    };
    //*******************
    if (_type == "file" && _card_type == "e") {
        var _in_attr = params_array["in_attr"];
        if (_in_attr == "desc") {
            var _val = document.getElementById(_html_id).value;
            _val = this.AppCMS.html_special(_val);
            var title_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='title']");
            if (title_node)
                this.AppCMS.SetInnerText(title_node, _val);
        }
        if (_in_attr == "delete") {
            document.getElementById(_html_id).value = "";
            document.getElementById("desc" + _xml_id).value = "";
            var file_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']");
            var filepath_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='path']");
            if (filepath_node)
                this.AppCMS.SetInnerText(filepath_node, "");
            var title_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='title']");
            if (title_node)
                this.AppCMS.SetInnerText(title_node, "");
            var filename_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filename']");
            if (filename_node)
                file_node.removeChild(filename_node);
            var filesize_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filesize']");
            if (filesize_node)
                file_node.removeChild(filesize_node);
        }
        if (_in_attr != "desc" && _in_attr != "delete") {
            var _filename = this.AppCMS.html_special(params_array["filename"]);
            var _path = this.AppCMS.html_special(params_array["filepath"]);
            var _filesize = params_array["filesize"];
            var file_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']");
            var filename_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filename']");
            var filesize_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filesize']");
            var filepath_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='path']");

            if (filename_node)
                this.AppCMS.SetInnerText(filename_node, _filename);
            if (filesize_node)
                this.AppCMS.SetInnerText(filesize_node, _filesize);
            if (filepath_node)
                this.AppCMS.SetInnerText(filepath_node, _path);

            if (!filepath_node) {
                var insert_tag = "<FormAttrib sys-name='path'>" + _path + "</FormAttrib>";
                var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                file_node.appendChild(i_t);
            };

            if (!filename_node) {
                var insert_tag = "<FormAttrib sys-name='filename'>" + _filename + "</FormAttrib>";
                var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                file_node.insertBefore(i_t, filepath_node);
            };
            if (!filesize_node) {
                var insert_tag = "<FormAttrib sys-name='filesize'>" + _filesize + "</FormAttrib>";
                var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                file_node.insertBefore(i_t, filepath_node);
            };
        };
    };
    //*******************
    if (_type == "image" && _card_type == "e") {
        var _in_attr = params_array["in_attr"];
        if (_in_attr == "delete") {
            var image_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']");
            var src_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='src']");
            if (src_node)
                this.AppCMS.SetInnerText(src_node, "");
            var alt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='alt']");
            if (alt_node)
                this.AppCMS.SetInnerText(alt_node, "");
            var height_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='height']");
            if (height_node)
                image_node.removeChild(height_node);
            var width_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='width']");
            if (width_node)
                image_node.removeChild(width_node);
            var filename_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filename']");
            if (filename_node)
                image_node.removeChild(filename_node);
            var filesize_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filesize']");
            if (filesize_node)
                image_node.removeChild(filesize_node);
            document.getElementById(_html_id).src = this.AppCMS.site_path + '/' + "img/sys/empty.gif";
        };
        if (!_in_attr) {
            var _filename = this.AppCMS.html_special(params_array["filename"]);
            var _src = this.AppCMS.html_special(params_array["filepath"]);
            var _filesize = params_array["filesize"];
            var _width = params_array["width"];
            var _height = params_array["height"];
            var _alt = this.AppCMS.html_special(params_array["alt"]);
            var image_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']");
            var src_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='src']");
            if (src_node)
                this.AppCMS.SetInnerText(src_node, _src);
            var alt_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='alt']");
            if (alt_node)
                this.AppCMS.SetInnerText(alt_node, _alt);
            if (src_node && alt_node) {
                var height_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='height']");
                if (height_node)
                    this.AppCMS.SetInnerText(height_node, _height);
                else {
                    var insert_tag = "<FormAttrib sys-name='height'>" + _height + "</FormAttrib>";
                    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                    image_node.appendChild(i_t);
                };
                var width_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='width']");
                if (width_node)
                    this.AppCMS.SetInnerText(width_node, _width);
                else {
                    var insert_tag = "<FormAttrib sys-name='width'>" + _width + "</FormAttrib>";
                    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                    image_node.appendChild(i_t);
                };
                var filename_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filename']");
                if (filename_node)
                    this.AppCMS.SetInnerText(filename_node, _filename);
                else {
                    var insert_tag = "<FormAttrib sys-name='filename'>" + _filename + "</FormAttrib>";
                    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                    image_node.appendChild(i_t);
                };
                var filesize_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormAttrib[@sys-name='filesize']");
                if (filesize_node)
                    this.AppCMS.SetInnerText(filesize_node, _filesize);
                else {
                    var insert_tag = "<FormAttrib sys-name='filesize'>" + _filesize + "</FormAttrib>";
                    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
                    image_node.appendChild(i_t);
                };
            };
        };
    };
    //*******************
    if (_type == "plain-text" && _card_type == "e") {
        var _val = this.AppCMS.html_special(document.getElementById(_html_id).value);
        var plain_node = this.AppCMS.XPathRes(this.WorkXML, "//FormElement[@id='" + _xml_id + "']/FormElementHtmlText");
        //alert ( this.AppCMS.Server.DomToSting(plain_node) );
        if (plain_node)
            this.AppCMS.SetInnerText(plain_node, _val);

    };
    //*******************
    if (_type == "html-text" && _card_type == "e") {
        //сохраняет в XML функция SaveWysiwigData, которая вызывается в callback_wisiwyg_fun
    }
    //*******************
    if (_type == "default" && _card_type == "a") {
        var _val = this.AppCMS.html_special(document.getElementById(_html_id).value);
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormAttrib[@id='" + _xml_id + "']");
        if (save_node)
            this.AppCMS.SetInnerText(save_node, _val);
    };
    //*******************
    if (_type == "date" && _card_type == "a") {
        var _in_attr = params_array["in_attr"];

        var _val = document.getElementById(_html_id).value;
        while (_val.charAt(0) == '0')
            _val = _val.substring(1, _val.length);
        _val = parseInt(_val);
        if (isNaN(_val))
            _val = "";
        else {
            switch (_in_attr) {
            case "d":
                if (_val < 1 || _val > 31)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "m":
                if (_val < 1 || _val > 12)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "y":
                if (_val != "" && _val.toString().length == 1)
                    _val = "200" + _val.toString();
                if (_val != "" && _val.toString().length == 2)
                    _val = "20" + _val.toString();
                if (_val != "" && _val.toString().length == 3)
                    _val = "2" + _val.toString();
                break;
            default:
                break;
            };
        };
        document.getElementById(_html_id).value = _val;
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormAttrib[@id='" + _xml_id + "']");
        if (save_node) {
            try {
                var _date = save_node.firstChild.nodeValue;
            } catch (ex) {
                var _date = "..";
            };
            var _date_arr = _date.split('.');
            switch (_in_attr) {
            case "d":
                _date_arr[0] = _val;
                break;
            case "m":
                _date_arr[1] = _val;
                break;
            case "y":
                _date_arr[2] = _val;
                break;
            default:
                break;
            };
            var _newVal = _date_arr[0] + "." + _date_arr[1] + "." + _date_arr[2];
            this.AppCMS.SetInnerText(save_node, _newVal);
        };
    };
    //*******************
    if (_type == "link" && _card_type == "a") {
        _path = this.AppCMS.html_special(params_array["path"]);
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormAttrib[@id='" + _xml_id + "']");
        if (save_node)
            this.AppCMS.SetInnerText(save_node, _path);
    };
    //*******************
    if (_type == "time" && _card_type == "a") {
        var _in_attr = params_array["in_attr"];
        var _val = document.getElementById(_html_id).value;
        while (_val.charAt(0) == '0')
            _val = _val.substring(1, _val.length);
        _val = parseInt(_val);
        if (isNaN(_val))
            _val = "00";
        else {
            switch (_in_attr) {
            case "m":
                if (_val < 0 || _val > 59)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            case "h":
                if (_val < 0 || _val > 23)
                    _val = "";
                if (_val != "" && _val.toString().length < 2)
                    _val = "0" + _val.toString();
                break;
            default:
                break;
            };
        };
        document.getElementById(_html_id).value = _val;
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormAttrib[@id='" + _xml_id + "']");
        if (save_node)
            try {
                var _time = save_node.firstChild.nodeValue;
            } catch (ex) {
                var _time = ":"
            }

        var _time_arr = _time.split(':');
        switch (_in_attr) {
        case "h":
            _time_arr[0] = _val;
            break;
        case "m":
            _time_arr[1] = _val;
            break;
        default:
            break;
        };
        var _newVal = _time_arr[0] + ":" + _time_arr[1];
        this.AppCMS.SetInnerText(save_node, _newVal);
    };
    //*******************
    if (_type == "checkbox" && _card_type == "a") {
        var _val = document.getElementById(_html_id).checked;
        _val = _val + '';
        var save_node = this.AppCMS.XPathRes(this.WorkXML, "//FormAttrib[@id='" + _xml_id + "']");
        if (save_node)
            this.AppCMS.SetInnerText(save_node, _val);
    };
    //*******************
};
//********************************************************************************************
function save_and_synchronize_card(params, name) {
    if (this.WriteMode == "0") {
        alert("Недостаточно прав для сохранения");
        return;
    };
    var Work_param = this.AppCMS.ParamsToArray(this.WorkParams);

    var save_xml = this.AppCMS.Server.XmlToDom(this.AppCMS.Server.XSLT_transform(this.WorkXML, this.save_xslt));

    var action_string = "<action method='put_xml_data' path='" + Work_param["path"] + "'></action>";
    var act_obj = this.AppCMS.Server.XmlToDom(action_string);

    if (!save_xml || !act_obj)
        return false;
    try {
        act_obj.firstChild.appendChild(save_xml.documentElement);
    } catch (ex) {
        return false;
    };
    action_string = this.AppCMS.Server.DomToSting(act_obj);

    this.AppCMS.StatusBarPrint("Сохранение данных ...");
    var res = this.AppCMS.Server.ExecuteAction(action_string);
    if (!res) {
        this.AppCMS.StatusBarPrint(this.AppCMS.Server.ErrorInfo());
        return false;
    };
    this.AppCMS.StatusBarPrint("Данные сохранены");
    this.FlagSaveCard = true;

};
//********************************************************************************************
function left_menu_action_card(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _action = params_array["action"];
    switch (_action) {
    case "SAVE_CARD":
        this.AppCMS.ComponentEventToCMS(this.name, "method=save_and_synchronize_card");
        break;
    case "QUIT_SAVE_CARD":
        this.AppCMS.ComponentEventToCMS(this.name, "method=save_and_synchronize_card");
        this.AppCMS.ComponentEventToCMS(this.name, "method=return_to_menu");
        break;
    case "QUIT_CARD":
        this.AppCMS.ComponentEventToCMS(this.name, "method=return_to_menu");
        break;
    };
};
//********************************************************************************************
function goto_from_data_card(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    params_array["method"] = "get_children";
    if (!this.FlagSaveCard)
        if (confirm("Данные были изменены. Сохранить изменения?"))
            this.AppCMS.ComponentEventToCMS(this.name, "method=save_and_synchronize_card");
    this.AppCMS.ComponentEventToCMS(this.name, this.AppCMS.ArrayToParams(params_array));
};
//********************************************************************************************
function return_from_data_card(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    params_array["method"] = "return_to_menu";
    if (!this.FlagSaveCard)
        if (confirm("Данные были изменены. Сохранить изменения?"))
            this.AppCMS.ComponentEventToCMS(this.name, "method=save_and_synchronize_card");
    this.AppCMS.ComponentEventToCMS(this.name, this.AppCMS.ArrayToParams(params_array));
};
//********************************************************************************************

