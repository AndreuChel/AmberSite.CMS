//Класс Ajax сервера

function Server(name, site_path, session_id, conman_path, ver) {
    //Инициализация
    this.name = name;
    this.site_path = site_path;
    this.ver = ver;
    this.session_id = session_id;
    this.conman_path = conman_path;

    this.stXMLObject = "";
    this.actionXML = "";
    this.Error_description = "";

    //объект связи с сервером
    try {
        //IE
        this.request = new ActiveXObject("Msxml2.XMLHTTP");
        this.brouzer = "IE";
    } catch (e) {
        //Mozilla, Safari, etc
        this.request = new XMLHttpRequest();
        this.brouzer = "notIE";
    }

}
//******************************************************************************
Server.prototype.validate = check_status;
Server.prototype.ErrorInfo = ErrorInfo;
Server.prototype.StateError = _StateError;
Server.prototype.NewXmlDocument = NewXmlDocument;
Server.prototype.XmlToDom = _xmltodom;
Server.prototype.DomToSting = _domtostring;
Server.prototype.ExecuteAction = _executeAction;
Server.prototype.getXMLfile = _getFile;
Server.prototype.getXSLTtamplate = getXSLTtamplate;
Server.prototype.XSLT_transform = XSLT_transform;
//******************************************************************************
function ErrorInfo() {
    return this.Error_description;
}
//******************************************************************************
function NewXmlDocument(xml_obj) {
    var doc = this.XmlToDom(this.DomToSting(xml_obj));
    return doc;
};
//******************************************************************************
// Функция загружает из XML строки в модель DOM
function _xmltodom(xml_string) {
    this.Error_description = "";
    if (this.brouzer == "notIE") {
        var tmp_parser = new DOMParser();
        try {
            var tmp_rez = tmp_parser.parseFromString(xml_string, "text/xml");
            //alert (tmp_rez.nodeType);
        } catch (ex) {
            this.Error_description = "#Error parsing XML1 :" + ex.description + "#";
            return false;
        }
        if (tmp_rez.documentElement.nodeName == "parsererror") {
            //this.Error_description = "#Error parsing XML2 :"+ this.DomToSting(tmp_rez)+"#";
            this.Error_description = "#Error parsing XML2";
            return false;
        }
        return tmp_rez;
    } else {
        try {
            var tmp_parser = new ActiveXObject("Msxml2.DOMDocument");
            tmp_parser.loadXML(xml_string);
        } catch (ex) {
            this.Error_description = "#Error parsing XML3 :" + tmp_parser.parseError.reason + "#";
            return false;
        }
        if (tmp_parser.parseError != 0) {
            this.Error_description = "#Error parsing XML4 :" + tmp_parser.parseError.reason + "#";
            return false;
        }
        return tmp_parser;
    }
}
//******************************************************************************
//Функция сохраняет DOM объект в строку
function _domtostring(dom_obj) {
    this.Error_description = "";
    if (this.brouzer == "notIE") {
        var ser = new XMLSerializer();
        try {
            var tmp_str = ser.serializeToString(dom_obj);
        } catch (ex) {
            this.Error_description = "#Error serialize DOM XML : " + ex.description + "#";
            return false;
        }
        return tmp_str;
    } else {
        try {
            var tmp_str = dom_obj.xml;
        } catch (ex) {
            this.Error_description = "#Error serialize DOM XML : " + ex.description + "#";
            return false;
        }
        return tmp_str;
    }

}
//******************************************************************************
function check_status() {
    if (this.stXMLObject.documentElement.nodeName.toUpperCase() != "RESULT" || this.stXMLObject.documentElement.getAttribute("status") == null) {
        this.StateError("Non-status response", this.stXMLObject.xml);
        return false;
    } else {
        if (this.stXMLObject.documentElement.getAttribute("status").toUpperCase() != "OK") {
            this.StateError(this.stXMLObject.documentElement.getAttribute("status"), this.stXMLObject.documentElement.text);
            return false;
        }
        if (this.stXMLObject.documentElement.getAttribute("num-nodes") != null)
            alert(this.stXMLObject.documentElement.getAttribute("num-nodes") + " nodes processed");

        return true;
    }
}
//******************************************************************************
function _StateError(status, comment) {
    this.Error_description = "Response server Error :  " + status + "," + comment;
}
//******************************************************************************
function _executeAction(xml_string) {
    this.Error_description = "";
    this.actionXML = this.XmlToDom(xml_string);
    var url_str = this.conman_path + "components/callback-server/action.php?ver=" + this.ver + "&sessionid=" + this.session_id;
    try {
        this.request.open("POST", url_str, false);
        this.request.send(xml_string);
    } catch (ex) {
        this.Error_description = "ActionError :" + ex.description;
        return false;
    };
    var _tmp_xml = this.XmlToDom(this.request.responseText);
    if (!_tmp_xml) {
        alert(this.Error_description);
        return false;
    };
    this.stXMLObject = _tmp_xml;

    if (this.validate())
        return this.stXMLObject;
    return false;
}
//******************************************************************************
function _getFile(filename) {
    this.Error_description = "";
    try {
        this.request.open("GET", this.conman_path + filename, false);
        this.request.send(null);
        return this.request.responseXML;
    } catch (ex) {
        this.Error_description = "GetXMLFileError :" + ex.description;
        return false;
    }
}
//******************************************************************************
function getXSLTtamplate(filename) {
    this.Error_description = "";
    try {
        var xslt = this.getXMLfile(filename);
        if (!xslt)
            return false;
        if (this.brouzer == "IE") {
            var res = new ActiveXObject("Microsoft.XMLDOM");
            res.async = false;
            res.loadXML(this.DomToSting(xslt));
        } else {
            var res = new XSLTProcessor();
            res.importStylesheet(xslt);
        };
        return res;
    } catch (ex) {
        this.Error_description = "getXSLTtamplateError :" + ex.description;
        return false;
    };
}
//******************************************************************************
function XSLT_transform(xml, xslt) {
    this.Error_description = "";
    try {
        if (this.brouzer == "IE") {
            var source = new ActiveXObject("Microsoft.XMLDOM");
            source.async = false;
            source.loadXML(this.DomToSting(xml));
            return source.transformNode(xslt);
        } else {
            var fragment = xslt.transformToFragment(xml, document);
            return this.DomToSting(fragment);
        };
    } catch (ex) {
        this.Error_description = "XSLT_transformError :" + ex.description;
        return false;
    };
}
//******************************************************************************
