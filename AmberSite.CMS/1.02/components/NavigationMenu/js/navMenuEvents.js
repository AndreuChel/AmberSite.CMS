nSelected = false;
bgOver = "#F0F0F0";
bgSelected = "#E0E0E0";
bgOut = "#FFFFFF";

function onSelect(src, _id, flag) {
    var act = "method=menu_select_node#id=" + _id + "#flag=" + flag;
    navMenu.CallEvent(act);
}

function onDblclick(src) {
    var act = (src.path) ? src.path : src.getAttribute("path");
    navMenu.CallEvent(act);
}

function onCheck(src, flag, _id) {
    var act = "method=menu_check_node#id=" + _id + "#flag=" + flag;
    navMenu.CallEvent(act);
}
function _onCheck(arr) {
    for (var i11 = 0; i11 < arr.length; i11++)
        onCheck(arr[i11].src, arr[i11].flag, arr[i11].id);
}

function selectNode(id) {
    if (id == "id_link_back_id") {
        nSelected = false;
        onSelect(nSelected, nSelected.id, false);
        return;
    };
    nSelected = document.getElementById(id);
    nSelected.style.backgroundColor = bgSelected;
    if (id != "id_link_back_id")
        onSelect(nSelected, id, true);
}

function rollover(e) {
    if (!navMenu.AppCMS.ActionsStatus)
        return;
    src = window.event ? (ev = window.event).srcElement : (ev = e).currentTarget;
    var top = "TR";
    while (top != src.nodeName)
        src = src.parentNode;

    if (ev.type == "mouseover") {
        if (nSelected != src) {
            src.style.backgroundColor = bgOver;
        }
    }

    if (ev.type == "mouseout") {
        if (nSelected != src)
            src.style.backgroundColor = bgOut;
    }

    if (ev.type == "click") {
        if (nSelected && nSelected != src) {
            nSelected.style.backgroundColor = bgOut;
        }
        if (nSelected != src) {
            selectNode(src.id);
        }
    }

    if (ev.type == "dblclick") {
        onDblclick(src);
    }

}

function checker(e) {
    if (!navMenu.AppCMS.ActionsStatus)
        return;
    src = src1 = window.event ? (ev = window.event).srcElement : (ev = e).target;
    ev.cancelBubble = true;
    if (ev.stopPropagation)
        ev.stopPropagation();

    if (!(window.event) && ev.type == "dblclick")
        return false;
    try {
        var top = "INPUT";
        try {}
        catch (ex) {
            var _id = false;
        };
        while (top != src.nodeName)
            src = src.firstChild;
        var tmp_parent = src.parentNode.parentNode;
        var _id = (tmp_parent.id) ? tmp_parent.id : tmp_parent.getAttribute("id");

        if (src1 != src)
            src.checked = (src.checked == false) ? true : false;

        onCheck(src, src.checked, _id);
    } catch (ex) {};
}

function switchSelection() {
    if (!navMenu.AppCMS.ActionsStatus)
        return;
    n = document.getElementById("nodes");
    c = false;
    for (i = 0; i < n.rows.length; i++) {
        if (n.rows[i].cells[2].firstChild)
            try {
                if (n.rows[i].cells[2].firstChild.checked == false)
                    c = true;
            } catch (ex) {};
    }
    var ch = new Array();
    var j = 0;
    for (i = 0; i < n.rows.length; i++) {
        try {
            if (n.rows[i].cells[2].firstChild) {
                var _id = (n.rows[i].id) ? n.rows[i].id : n.rows[i].getAttribute("id");
                if (_id) {
                    n.rows[i].cells[2].firstChild.checked = c;
                    ch[j] = {
                        src: n.rows[i],
                        flag: c,
                        id: _id
                    };
                    j++;
                };
            };
        } catch (ex) {};
    }
    _onCheck(ch);
}

function navMenuEventsLoad() {

    n = document.getElementById("nodes");

    for (i = 1; i < n.rows.length; i++) {
        row = n.rows[i];
        try {
            row.onmouseover = rollover;
            row.onmouseout = rollover;
            row.onclick = rollover;
            row.ondblclick = rollover;

            row.cells[2].onclick = checker;
            row.cells[2].ondblclick = checker;
        } catch (ex) {}
    }

}
