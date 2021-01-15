nSelected = false;
bgOver = "#F0F0F0";
bgSelected = "#E0E0E0";
bgOut = "#FFFFFF";

function onSelect(src) {
    var path = (src.path) ? src.path : src.getAttribute("path");
    var title = (src.path) ? src.n_title : src.getAttribute("n_title");
    callEvent(path + "#event=click#title=" + title);
}

function onDblclick(src) {
    var path = (src.path) ? src.path : src.getAttribute("path");
    var title = (src.path) ? src.n_title : src.getAttribute("n_title");
    callEvent(path + "#event=dblclick#title=" + title);
}

function selectNode(id) {
    nSelected = document.getElementById(id);
    nSelected.style.backgroundColor = bgSelected;
    onSelect(nSelected);
}

function rollover(e) {

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

function ldEventsLoad() {

    n = document.getElementById("ld_nodes");

    for (i = 1; i < n.rows.length; i++) {
        row = n.rows[i];
        try {
            row.onmouseover = rollover;
            row.onmouseout = rollover;
            row.onclick = rollover;
            row.ondblclick = rollover;
        } catch (ex) {}
    }

}
