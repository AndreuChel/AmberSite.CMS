function LeftMenuClass(name, app_cms, DC, info_dc) {
    this.name = name;
    this.AppCMS = app_cms;
    this.DC = DC;
    this.InfoDC = info_dc;
    //массив элементов меню для карточек - ключ i ("id","title","type")
    this.CardElements = new Array();
    //массив элементов меню нод (действие, кроме добавления) - ключ i ("id","title","type")
    this.SysNodeElements = new Array();
    //массив элементов меню нод (добавление) - ключ node_type ("id","title","node_type")
    this.AddNodeElements = new Array();
    //массив всех элементов меню  - ключ id ("type_arr", "key")
    this.AllMenuElements = new Array();

    this.Separator = "";

    this.WorkHTML = "";

    //массив выбранных нод (где поставленны галочки)
    this.CheckedNodes = false;
    //выделенная нода (ссылка)
    this.SelectedNode = false;

    this.AppCMS.StatusBarPrint("Загрузка данных ...");
    this.IconsXml = this.AppCMS.Server.getXMLfile("components/LeftActionsMenu/icons.xml");
    this.xslt_Template = this.AppCMS.Server.getXSLTtamplate("components/LeftActionsMenu/xslt/leftMenu.xsl");
    this.xslt_set_id = this.AppCMS.Server.getXSLTtamplate("components/LeftActionsMenu/xslt/set_id.xsl");

    var tmp = this.AppCMS.SysSettings.getElementsByTagName("main_menu").item(0).cloneNode(true);
    this.main_menu = this.AppCMS.Server.NewXmlDocument(tmp);
    this.PrepareData();
    this.setIcons();
    this.main_menu = this.AppCMS.Server.XmlToDom(this.AppCMS.Server.XSLT_transform(this.main_menu, this.xslt_set_id));
    this.XmlToArrayAttribs();
    this.AppCMS.AddComponentToCMS(name, this);
    this.AppCMS.StatusBarPrint("Готово");
    this.nav_menu_xml = false;
}
//********************************************************************************************
LeftMenuClass.prototype.CMSEvent = cms_event;
LeftMenuClass.prototype.CallEvent = call_event;
LeftMenuClass.prototype.PrepareData = PrepareData;
LeftMenuClass.prototype.XmlToArrayAttribs = XmlToArrayAttribs;
LeftMenuClass.prototype.setIcons = setIcons;
LeftMenuClass.prototype.DrawHTML = DrawHTML;
LeftMenuClass.prototype.ActionForAllInArray = ActionForAllInArray;
LeftMenuClass.prototype.BuildNodeMenu = BuildNodeMenu;
LeftMenuClass.prototype.BuildCardMenu = BuildCardMenu;
LeftMenuClass.prototype.update_menu = update_menu;
LeftMenuClass.prototype.get_children = get_children;
LeftMenuClass.prototype.return_to_menu = return_to_menu;
LeftMenuClass.prototype.get_card = get_card;
LeftMenuClass.prototype.left_menu_click = left_menu_click;
LeftMenuClass.prototype.menu_select_node = menu_select_node;
LeftMenuClass.prototype.menu_check_node = menu_check_node;
LeftMenuClass.prototype.show_info = show_info;
//********************************************************************************************
function show_info(str) {
    var _info = document.getElementById(this.InfoDC);
    if (_info)
        _info.value = str;
};
//********************************************************************************************
function call_event(params) {
    this.AppCMS.ComponentEventToCMS(this.name, params);
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
function PrepareData() {

    var Items = this.main_menu.getElementsByTagName("menu_item");
    var _type = "";
    for (var i = Items.length - 1; i >= 0; i--) {
        _type = Items[i].getAttribute("type");
        if (_type.toUpperCase() == "ADD")
            Items[i].setAttribute("typeof", "node");
        if (_type.toUpperCase() == "EXT_EXEC")
            Items[i].setAttribute("typeof", "node");
    };
    var insert_tag = "<menu_item typeof='separator'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Редактировать' type='node_edit' typeof='node'></menu_item>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Запретить показ' type='node_block' typeof='node'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Разрешить показ' type='node_unblock' typeof='node'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Переместить вверх' type='node_moveup' typeof='node'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Переместить вниз' type='node_movedown' typeof='node'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Удалить' type='node_delete' typeof='node'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Сохранить' type='save_card' typeof='card'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Выйти и сохранить' type='quit_save_card' typeof='card'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

    var insert_tag = "<menu_item group='' title='Выйти без сохранения' type='quit_card' typeof='card'/>";
    var i_t = this.AppCMS.Server.XmlToDom(insert_tag).documentElement;
    this.main_menu.documentElement.appendChild(i_t);

};
//********************************************************************************************
function XmlToArrayAttribs() {
    var tmpHTML = this.AppCMS.Server.XSLT_transform(this.main_menu, this.xslt_Template);
    tmpHTML = this.AppCMS.Server.XmlToDom(tmpHTML);
    var Items = this.main_menu.getElementsByTagName("menu_item");

    for (var i = 0; i < Items.length; i++) {
        var _typeof = Items[i].getAttribute("typeof");
        var _type = Items[i].getAttribute("type");
        if (_type)
            _type = _type.toUpperCase();
        var _id = Items[i].getAttribute("id");
        
        var _html = this.AppCMS.Server.DomToSting(this.AppCMS.XPathRes(tmpHTML, "//*[@id='" + _id + "']"));
        var _title = Items[i].getAttribute("title");
        if (_typeof == "separator")
            this.Separator = _html;

        if (_typeof == "node" && _type == "ADD") {
            var _nodetype = Items[i].getAttribute("node_type");
            this.AddNodeElements[_nodetype] = {
                id: _id,
                title: _title,
                node_type: _nodetype,
                html: _html
            };
            this.AllMenuElements[_id] = {
                type_arr: "addnode",
                key: _nodetype
            };
        };
        if (_typeof == "node" && _type == "EXT_EXEC") {
            var _act = Items[i].getAttribute("action");
            this.SysNodeElements.push({
                id: _id,
                title: _title,
                type: _type,
                html: _html,
                action: _act
            });
            this.AllMenuElements[_id] = {
                type_arr: "actnode",
                key: this.SysNodeElements.length - 1
            };
        };

        if (_typeof == "node" && (_type != "ADD" && _type != "EXT_EXEC")) {
            this.SysNodeElements.push({
                id: _id,
                title: _title,
                type: _type,
                html: _html
            });
            this.AllMenuElements[_id] = {
                type_arr: "sysnode",
                key: this.SysNodeElements.length - 1
            };
        };
        if (_typeof == "card") {
            this.CardElements.push({
                id: _id,
                title: _title,
                type: _type,
                html: _html
            });
            this.AllMenuElements[_id] = {
                type_arr: "card",
                key: this.CardElements.length - 1
            };
        };
    };
};
//********************************************************************************************
function setIcons() {
    var Items = this.main_menu.getElementsByTagName("menu_item");
    var _type = "";
    for (var i = 0; i < Items.length; i++) {
        _type = Items[i].getAttribute("type");
        var _src_node = this.AppCMS.XPathRes(this.IconsXml, "//*[@type='" + _type + "']");
        if (_src_node)
            Items[i].setAttribute("src", _src_node.getAttribute("src"));
    }
};
//********************************************************************************************
function DrawHTML() {
    document.getElementById(this.DC).innerHTML = this.WorkHTML;
};
//********************************************************************************************
function ActionForAllInArray(arr, act, param) {
    for (var key in arr) {
        var _html = arr[key].html;
        if (act == "add_all")
            this.WorkHTML += _html;
    };
};
//********************************************************************************************
function BuildNodeMenu() {
    this.nav_menu_xml = this.AppCMS.GetLinkToComponent("navMenu").CurrentXML;

    var allowed_types_tag = this.AppCMS.XPathRes(this.nav_menu_xml, "//data[@s_allowed-types]");
    allowed_types = false;
    if (allowed_types_tag)
        allowed_types = allowed_types_tag.getAttribute("s_allowed-types");
    var sep_flag = false;
    if (allowed_types) {
        var types = allowed_types.split(',');
        for (key in types) {
            var _type = types[key];
            var tmp_add = this.AddNodeElements[_type];
            if (tmp_add) {
                this.WorkHTML += tmp_add.html;
                sep_flag = true;
            };
        };
    };
    if (sep_flag)
        this.WorkHTML += this.Separator;

    //********------------------*********************************************
    if (this.SelectedNode) {
        var sep_flag = false;
        var _id = this.SelectedNode["id"];
        var selected_node = this.AppCMS.XPathRes(this.nav_menu_xml, "//*[@id='" + _id + "']")
            if (selected_node) {
                var allowed_acts = selected_node.getAttribute("allowed-actions");
                if (allowed_acts) {
                    var _acts = allowed_acts.split(',');
                    for (key in _acts) {
                        var _act = _acts[key];
                        var _ell_id = false;
                        for (ell in this.SysNodeElements)
                            if (this.SysNodeElements[ell].action == _act) {
                                _ell_id = ell;
                                break;
                            };
                        if (_ell_id) {
                            this.WorkHTML += this.SysNodeElements[_ell_id].html;
                            sep_flag = true;
                        };
                    };
                };
            };
        if (sep_flag)
            this.WorkHTML += this.Separator;
    };
    //*********---------------------*************************************
    for (var key in this.SysNodeElements) {
        if (this.SysNodeElements[key].type == "EXT_EXEC")
            continue;
        var _html = this.SysNodeElements[key].html;
        this.WorkHTML += _html;
        if (this.SysNodeElements[key].type == "NODE_EDIT")
            this.WorkHTML += this.Separator;
        if (this.SysNodeElements[key].type == "NODE_UNBLOCK")
            this.WorkHTML += this.Separator;
        if (this.SysNodeElements[key].type == "NODE_MOVEDOWN")
            this.WorkHTML += this.Separator;
    };
};
//********************************************************************************************
function BuildCardMenu() {
    for (var key in this.CardElements) {
        if (this.CardElements[key].type == "QUIT_CARD")
            this.WorkHTML += this.Separator;
        var _html = this.CardElements[key].html;
        this.WorkHTML += _html;
    };
};
//********************************************************************************************
function get_children(params, name) {
    this.CheckedNodes = false;
    this.WorkHTML = "";
    this.BuildNodeMenu();

    var selected_node = this.AppCMS.XPathRes(this.nav_menu_xml, "//*[@selected='1']");
    if (!selected_node)
        this.SelectedNode = false;
    this.DrawHTML();
};
//********************************************************************************************
function get_card(params, name) {
    this.CheckedNodes = false;
    this.SelectedNode = false;
    this.WorkHTML = "";
    this.BuildCardMenu();
    this.DrawHTML();
};
//********************************************************************************************
function return_to_menu(params, name) {
    this.nav_menu_xml = this.AppCMS.GetLinkToComponent("navMenu").CurrentXML;
    var selected_node = this.AppCMS.XPathRes(this.nav_menu_xml, "//*[@selected='1']");
    if (!selected_node)
        this.SelectedNode = false;

    this.CheckedNodes = false;
    this.WorkHTML = "";
    this.BuildNodeMenu();
    this.DrawHTML();
};
//********************************************************************************************
function left_menu_click(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _id = params_array["id"];
    var _type_arr = this.AllMenuElements[_id].type_arr;
    var _key = this.AllMenuElements[_id].key;
    var new_param = new Array();
    if (this.SelectedNode)
        new_param["current_select"] = this.SelectedNode["id"];
    switch (_type_arr) {
    case "addnode":
        new_param["method"] = "left_menu_action_node";
        new_param["action"] = "add";
        new_param["node_type"] = this.AddNodeElements[_key].node_type;
        if (this.SelectedNode)
            new_param["selected_id"] = this.SelectedNode.id;
        break;
    case "actnode":
        new_param["method"] = "left_menu_action_node";
        new_param["action"] = this.SysNodeElements[_key].type;
        new_param["type_action"] = this.SysNodeElements[_key].action;
        if (this.SelectedNode)
            new_param["selected_id"] = this.SelectedNode.id;
        break;
    case "sysnode":
        new_param["method"] = "left_menu_action_node";
        new_param["action"] = this.SysNodeElements[_key].type;
        if (this.SysNodeElements[_key].type == "NODE_DELETE"
             || this.SysNodeElements[_key].type == "NODE_BLOCK"
             || this.SysNodeElements[_key].type == "NODE_UNBLOCK") {
            if (!this.CheckedNodes && this.SelectedNode)
                new_param["selected_id"] = this.SelectedNode.id;
            else {
                var check_count = 0;
                for (key in this.CheckedNodes)
                    check_count++;
                var del_nodes = "";
                var cx = 0;
                for (key in this.CheckedNodes) {
                    del_nodes += this.CheckedNodes[key].id;
                    cx++;
                    if (cx != check_count)
                        del_nodes += ",";
                };
                if (check_count > 0)
                    new_param["selected_id"] = del_nodes;
            };
        } else
            new_param["selected_id"] = this.SelectedNode.id;

        break;
    case "card":
        new_param["method"] = "left_menu_action_card";
        new_param["action"] = this.CardElements[_key].type;
        break;
    default:
        break;
    };
    this.AppCMS.ComponentEventToCMS(this.name, this.AppCMS.ArrayToParams(new_param));
};
//********************************************************************************************
function menu_select_node(params, name) {
    this.nav_menu_xml = this.AppCMS.GetLinkToComponent("navMenu").CurrentXML;
    var params_array = this.AppCMS.ParamsToArray(params);
    var _id = params_array["id"];
    var _flag = params_array["flag"];
    if (_flag == "false")
        this.SelectedNode = false;
    else {
        var selected_node = this.AppCMS.XPathRes(this.nav_menu_xml, "//*[@id='" + _id + "']")
            if (!selected_node) {
                return;
            };
        var _type = selected_node.nodeName;
        var _link = selected_node.getAttribute("link");
        var _link_params = this.AppCMS.ParamsToArray(_link);
        var _path = _link_params["path"];
        this.SelectedNode = {
            id: _id,
            type: _type,
            path: _path,
            link: _link
        };
    };
    this.WorkHTML = "";
    this.BuildNodeMenu();
    this.DrawHTML();
};
//********************************************************************************************
function menu_check_node(params, name) {
    var params_array = this.AppCMS.ParamsToArray(params);
    var _id = params_array["id"];
    var _flag = (params_array["flag"] == "true") ? true : false;
    var cheked_node = this.AppCMS.XPathRes(this.nav_menu_xml, "//*[@id='" + _id + "']")
        if (!cheked_node) {
            return;
        };

    var _type = cheked_node.nodeName;
    var _link = cheked_node.getAttribute("link");
    var _link_params = this.AppCMS.ParamsToArray(_link);
    var _path = _link_params["path"];

    var Node = {
        id: _id,
        type: _type,
        path: _path,
        link: _link
    };
    if (!this.CheckedNodes) {
        if (_flag) {
            this.CheckedNodes = new Array();
            this.CheckedNodes[_id] = Node;
        };
    } else {
        var _nodes = new Array();
        if (_flag && !this.CheckedNodes[_id])
            this.CheckedNodes[_id] = Node;
        if (!_flag) {
            var cx = 0;
            for (key in this.CheckedNodes)
                if (key != _id) {
                    _nodes[key] = this.CheckedNodes[key];
                    cx++;
                };
            if (cx > 0)
                this.CheckedNodes = _nodes;
            else
                this.CheckedNodes = false;
        };
    };
};
//********************************************************************************************
function update_menu(act) {
    
};
//********************************************************************************************
