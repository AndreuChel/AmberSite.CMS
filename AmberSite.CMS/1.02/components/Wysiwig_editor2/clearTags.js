function ClaeanHTMLClass (docElem) {
         this.level = 0;
         this.buff = "";
         this.counter = 0;
				 var goodAttributes0=new Array();

  			 var goodTags0=["body","blockquote","u","a","p","br","strong","b","em","i","tt","code","pre","ul","ol","li","img","table","tbody","thead","tfoot","caption","tr","td","th","col","colgroup","h1","h2","h3","h4","h5","h6","small","big","sub","sup","div","span"];
  			 var emptyInlineTags0=["strong","b","em","i","tt","code","small","big","sub","sup","span", "p","strong","pre","div"];
				 // хорошие атрибуты (допустимы у всех тегов)
				 goodAttributes0["all"] = ["href", "target", "name", "title", "alt", "src", "id"];

				 // дополнительные допустимые атрибуты для отдельных тегов
				 goodAttributes0["img"] = ["width", "height", "align"];
				 goodAttributes0["table"] = ["border", "width"];
				 goodAttributes0["td"] = ["colSpan", "rowSpan"];
				 goodAttributes0["tr"] = ["noWrap", "align", "vAlign", "width"];
				 goodAttributes0["td"] = ["noWrap", "align", "vAlign", "width"];
				 goodAttributes0["col"] = ["noWrap", "align", "vAlign", "width"];
				 goodAttributes0["colgroup"] = ["noWrap", "align", "vAlign", "width"];
				 goodAttributes0["a"] = ["href", "name"];
				 goodAttributes0["area"] = ["href", "name"];
				 goodAttributes0["br"] = ["clear"];
				 goodAttributes0["p"] = ["align"];
				 goodAttributes0["blockquote"] = ["dir","style"];

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
								 this.goodAttribs[ii][tmp]=true;
						 }
				 }

}
ClaeanHTMLClass.prototype.ScanTags = ScanTags;

ClaeanHTMLClass.prototype.TestTags = TestTags;
ClaeanHTMLClass.prototype.TestAttribs = TestAttribs;
//-----------------------------------------------------------------------
function TestTags (nameTag, col_childs) {
	var _name	= nameTag.toLowerCase();
	if (this.goodTags[_name]) {
		 if (col_childs==0 && this.emptyInlineTags[_name]) return false;
		 return true;
	}
	return false;
}
//-----------------------------------------------------------------------
function TestAttribs(nameTag, nameAttrib) {
	var _name	= nameAttrib.toLowerCase();
	var _TagName	= nameTag.toLowerCase();
	if (this.goodAttribs["all"][_name]) return true;
	if (this.goodAttribs[_TagName])
		if (this.goodAttribs[_TagName][_name]) return true;
	return false;
}
//-----------------------------------------------------------------------
function ScanTags(parentElem) {
         var start_tag_buff = "";
         var end_tag_buff = "";
         var buff_attribs = "";
         var child_buff = "";
         if (!parentElem) return "";

         this.level++;
         var buff_attribs = "";
         if (parentElem.attributes)
            for (jj = 0; jj<parentElem.attributes.length; jj++) {
                 var nameAttr = parentElem.attributes[jj].nodeName;
					       var browserName = navigator.appName;
				  			 if (browserName == "Microsoft Internet Explorer" && nameAttr.toLowerCase() == "style")
								 		var valAttr = parentElem.getAttribute(nameAttr).cssText;
								 else	
                 		var valAttr = parentElem.getAttribute(nameAttr);

                 if (valAttr) {
                 		
                 		if (nameAttr.toLowerCase() == "style") {
 											  try {
										 			 valAttr = valAttr.replace(/\"/g, ""); //"
					 				 			} catch (ex) {
			 	 	   				 			 valAttr = "";
				 				 			  }
										 };

										 if (this.TestAttribs(parentElem.nodeName, nameAttr))
                    	 buff_attribs+=" "+nameAttr.toLowerCase()+"=\""+valAttr+"\"";
         	       };
            };

         start_tag_buff += (parentElem.nodeName != "#text")? "<"+parentElem.nodeName.toLowerCase() : parentElem.data;
         start_tag_buff += buff_attribs;
         var list = parentElem.childNodes;
         if  (parentElem.nodeName != "#text")
              start_tag_buff += (list.length == 0 ) ? "/>" : ">";
         for (var ii = 0; ii<list.length; ii++)
              child_buff += this.ScanTags(list[ii]);
         if  (parentElem.nodeName != "#text")
              end_tag_buff += ( list.length > 0 ) ? "</"+parentElem.nodeName.toLowerCase()+">":"";
         this.level--;
				 if (this.level == 0) { return child_buff; };
         var res = "";
				 if (parentElem.nodeName!="#text") {
				 		res = child_buff;
				 		if (this.TestTags(parentElem.nodeName, list.length))
         				res = start_tag_buff+child_buff+end_tag_buff;
				 }
				 else res=start_tag_buff;
				 
         return res;
};
