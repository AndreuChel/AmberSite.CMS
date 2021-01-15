//***********************************************
// get calendar HTML for specified year and month
function get_specified_calendar(calendar_year, calendar_month, dst) {
    while (calendar_month < 0) {
        calendar_month += 12;
        calendar_year--;
    }
    while (calendar_month > 11) {
        calendar_month -= 12;
        calendar_year++;
    }
    if (calendar_year < 1975) {
        calendar_year = 1975;
    }
    if (calendar_year > 2020) {
        calendar_year = 2020;
    }

    var buf;
    var date = new Date(calendar_year, calendar_month, 1);
    var month = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDay();

    var td = new Date();
    var today = td.getDate();
    var today_month = td.getMonth();
    var today_year = td.getFullYear();

    if (day == 0)
        day = 7;
    var days;

    buf = "<div  id=\"calendar_div_" + dst + "\">";
    buf += "<table class=\"tt_calendar\" width=\"170\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    buf += "<tr>";
    buf += "<td bgcolor=\"#000000\">";
    buf += "  <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#999999\">";
    buf += "    <tr>";
    buf += "      <td height=\"17\"><a href=\"left\" onclick=\"change_calendar(" + calendar_year + "," + (calendar_month - 1) + ",'" + dst + "'); return false;\"><img src=\"img/arrow-left.gif\" width=\"10\" height=\"10\" hspace=\"3\" border=\"0\"/></a></td>";
    buf += "      <td align=\"center\"><b><font color=\"#FFFFFF\" class=\"small10\">" + get_month_name(calendar_month) + ", " + calendar_year + "</font></b></td>";
    buf += "      <td align=\"right\"><a href=\"right\" onclick=\"change_calendar(" + calendar_year + "," + (calendar_month + 1) + ",'" + dst + "'); return false;\"><img src=\"img/arrow-right.gif\" width=\"10\" height=\"10\" hspace=\"3\" border=\"0\"/></a></td>";
    buf += "    </tr>";
    buf += "  </table>";
    buf += "  <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#FFFFFF\">";
    buf += "    <tr align=\"right\" bgcolor=\"#EEEEEE\">";
    buf += "      <td width=\"20\" height=\"14\"><font color=\"#006699\" class=\"small8\">" + get_day_name(0) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(1) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(2) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(3) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(4) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(5) + "</font></td>";
    buf += "      <td width=\"20\"><font color=\"#006699\" class=\"small8\">" + get_day_name(6) + "</font></td>";
    buf += "    </tr>";

    switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
        days = 31;
        break;
    case 1:
        days = (year % 4 == 0) ? 29 : 28;
        break;
    case 3:
    case 5:
    case 8:
    case 10:
        days = 30;
        break;
    default:
        days = 0;
        abort("Incorrect month!");
    }

    var td_buf = "";
    for (var i = 2 - day; i <= days; i++) {
        buf += "<tr>";
        for (; (i + day - 1) % 7 > 0; i++) {
            td_buf = (i == today && calendar_month == today_month && calendar_year == today_year) ? " class=\"bg_active\"" : "";
            buf += (i <= 0 || i > days) ? "<td align=\"right\"><font color=\"#FF0000\" class=\"small10\">&#160;</font></td>" : "<td align=\"right\"" + td_buf + "><a href=\"javascript:void(0);\" onclick=\"EditCalendar(" + calendar_year + "," + calendar_month + "," + i + ",'" + dst + "'); return false;\"><font color=\"#000000\" class=\"small10\">" + i + "</font></a></td>";
        }
        td_buf = (i == today && calendar_month == today_month && calendar_year == today_year) ? " class=\"bg_active\"" : ""; //"
        if (i > 0 && i <= days)
            buf += "<td align=\"right\"" + td_buf + "><a href=\"javascript:void(0);\" onclick=\"EditCalendar(" + calendar_year + "," + calendar_month + "," + i + ",'" + dst + "'); return false;\"><font color=\"#FF0000\" class=\"small10\">" + i + "</font></a></td>"; //"
        buf += "</tr>";
    }

    buf += "  </table>";
    buf += "</td>";
    buf += "</tr>";
    buf += "</table>";
    buf += "</div>";

    return buf;
}

//************************************
// get calendar HTML for current month
function get_calendar(calendar_year, calendar_month, dst) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    year = (calendar_year && calendar_year != "") ? calendar_year : year;

    month = (calendar_month && calendar_month != "") ? calendar_month - 1 : month;
    return get_specified_calendar(year, month, dst);
}

//*************************************************
// month name by number (0, 1, ..., 11)
function get_month_name(month) {
    switch (month) {
    case 0:
        return "Январь";
    case 1:
        return "Февраль";
    case 2:
        return "Март";
    case 3:
        return "Апрель";
    case 4:
        return "Май";
    case 5:
        return "Июнь";
    case 6:
        return "Июль";
    case 7:
        return "Август";
    case 8:
        return "Сентябрь";
    case 9:
        return "Октябрь";
    case 10:
        return "Ноябрь";
    case 11:
        return "Декабрь";

    default:
        abort("Incorrect month!");
        return "???";
    }
}

//*************************************************
// day identifier by number (0, 1, ..., 6)
function get_day_name(day) {
    switch (day) {
    case 0:
        return "Пн";
    case 1:
        return "Вт";
    case 2:
        return "Ср";
    case 3:
        return "Чт";
    case 4:
        return "Пт";
    case 5:
        return "Сб";
    case 6:
        return "Вс";

    default:
        abort("Incorrect day of the week!");
        return "???";
    }
}

//**************************************************
// change calendar HTML for specified year and month
function change_calendar(calendar_year, calendar_month, dst) {
    var divElem = document.getElementById("calendar_div_" + dst);
    divElem.innerHTML = get_specified_calendar(calendar_year, calendar_month, dst);
}

//*************************
// user day selection event
function EditCalendar(year, month, day, dst) {
    month = (++month < 10) ? "0" + month : month.toString();
    day = (day < 10) ? "0" + day : day.toString();
    year = year.toString();

    // what do you want to do with day, month & year?
    // applet.setObjectDataCMDocument("id" + dst, "update", day + "." + month + "." + year);
    document.getElementById("dd" + dst).value = day;
    document.getElementById("mm" + dst).value = month;
    document.getElementById("yyyy" + dst).value = year;
    callEvent('method=update_calendar#id=' + dst);
}

function calendar_switch(dst) {
    b = document.getElementById('button' + dst);
    if (!b.v || b.v != 1) {
        document.getElementById('calendar' + dst).style.display = 'block';
        document.getElementById('calendar' + dst).innerHTML = get_calendar(document.getElementById('yyyy' + dst).value, document.getElementById('mm' + dst).value, dst);
        b.value = 'спрятать';
        b.v = 1;
    } else {
        b.v = 2;
        document.getElementById('calendar' + dst).style.display = 'none';
        b.value = 'показать';
    }
}
