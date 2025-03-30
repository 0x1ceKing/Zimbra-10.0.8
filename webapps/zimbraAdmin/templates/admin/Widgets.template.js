AjxTemplate.register("admin.Widgets#ZaAppTab", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZWidgetTable ZAppTabTable ZAppTabBorder' style='table-layout:auto;'><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_row'><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_left_icon'  \tclass='ZLeftIcon ZWidgetIcon'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title'\t\tclass='ZWidgetTitle'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_right_icon' \tclass='ZRightIcon ZWidgetIcon'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaAppTab",
	"class": "ZAppTab"
}, false);
AjxTemplate.register("admin.Widgets", AjxTemplate.getTemplate("admin.Widgets#ZaAppTab"), AjxTemplate.getParams("admin.Widgets#ZaAppTab"));

AjxTemplate.register("admin.Widgets#ZaToolBarLabel", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_label'\t\tclass='ZWidgetTable ZLabelBorder'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_left_icon'\tclass='ZLeftIcon ZWidgetIcon'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title'\t\tclass='ZWidgetTitle ZaNowrapTitle'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_right_icon'\tclass='ZRightIcon ZWidgetIcon'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaToolBarLabel",
	"class": "ZaToolBarLabel ZWidget"
}, false);

AjxTemplate.register("admin.Widgets#ZaToast", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='ZaToastBG'><div class='ZaToastContent'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_icon' class='ZaToastIcon'></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_text' class='ZaToastText'></div></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaToast",
	"class": "ZaToastInfo"
}, false);

AjxTemplate.register("admin.Widgets#ZaCurrentAppBar", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" style='table-layout:fixed;width:100%; height:100%'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title'\tclass='ZWidgetTitle'\tstyle='width:100%'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_action'\t\t\t\t\t\t\tstyle='width:0px'><div><table role=\"presentation\" class='ZToolbarTable'><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_actionitems'></tr></table></div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_settingimg'\t\t\t\t\t\tstyle='width:20px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dropdown'\tclass='ZDropDown'\t\tstyle='width:20px'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaCurrentAppBar",
	"class": "ZaCurrentAppBar"
}, false);

AjxTemplate.register("admin.Widgets#ZaTreeHeaderButton", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_table' class='DwtLinkButtonTable ";
	buffer[_i++] = data["bgImg"];
	buffer[_i++] = "' style='table-layout:fixed;width:100%'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_doubleArrow' style='width:20px'><div></div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_left_icon'  \tclass='ZLeftIcon ZWidgetIcon'\tstyle='width:0px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title'\t\tclass='ZWidgetTitle'\t\t\tstyle='width:120px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_right_icon' \tclass='ZRightIcon ZWidgetIcon'\tstyle='width:0px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dropdown' \tclass='ZDropDown'\t\t\t\tstyle='width:20px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_fill'\t\t\t\t\t\t\t\t\t\t\tstyle='width:100%;'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_img'\t\t\t\t\t\t\t\t\t\t\tstyle='width:20px'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaTreeHeaderButton",
	"class": "ZWidget"
}, false);

AjxTemplate.register("admin.Widgets#ZaTreeItem", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='";
	buffer[_i++] = data["divClassName"];
	buffer[_i++] = "' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_div'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_table'><tr>";
	 if (data.isCheckedStyle) { 
	buffer[_i++] = "<td nowrap id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_checkboxCell' class=\"ZTreeItemCheckboxCell\"><div class=\"ZTreeItemCheckbox\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_checkbox'><div class=\"ZTreeItemCheckboxImg\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_checkboxImg'>";
	buffer[_i++] =  AjxImg.getImageHtml("MenuCheck") ;
	buffer[_i++] = "</div></div></td>";
	 } 
	buffer[_i++] = "<td width=16 nowrap class='imageCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_imageCell'></td><td nowrap class='";
	buffer[_i++] = data["textClassName"];
	buffer[_i++] = "' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_textTDCell'><div class='ZTreeItemTextCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_textCell'></div></td><td width=16 class='imageCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_extraCell'></td><td width=1% align=center nowrap id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_countCell'></td><td align=center nowrap id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_nodeCell'></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "admin.Widgets#ZaTreeItem"
}, false);

AjxTemplate.register("admin.Widgets#ZaBaseDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='DwtDialog WindowOuterContainer'><table role=\"presentation\"><tr class='DwtDialogHeader' id='";
	buffer[_i++] = data["dragId"];
	buffer[_i++] = "'><td class='minWidth'>";
	buffer[_i++] = data["icon"];
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title' class='DwtDialogTitle'>";
	buffer[_i++] = data["title"];
	buffer[_i++] = "</td><td class='minWidth'><div class='";
	buffer[_i++] = data["closeIcon2"];
	buffer[_i++] = "'></div></td><td class='minWidth'><div class='";
	buffer[_i++] = data["closeIcon1"];
	buffer[_i++] = "'></div></td><td width=24 id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_minimize' class='DwtDialogMinIcon'></td></tr><tr><td colspan='5'><div class='horizSep'></div></td></tr><tr><td class='WindowInnerContainer' colspan='5'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_content' class='DwtDialogBody'></div></td></tr></tr><td>";
	 if (data.controlsTemplateId) { 
	buffer[_i++] =  AjxTemplate.expand(data.controlsTemplateId, data) ;
	 } 
	buffer[_i++] = "</td></table></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"width": "20",
	"id": "admin.Widgets#ZaBaseDialog",
	"height": "32"
}, false);

AjxTemplate.register("admin.Widgets#ZaSeachOptionDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='DwtDialog'><table role=\"presentation\"><tr><td class='WindowInnerContainer' colspan='4'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_content' class='DwtDialogBody'></div></td></tr></tr><td>";
	 if (data.controlsTemplateId) { 
	buffer[_i++] =  AjxTemplate.expand(data.controlsTemplateId, data) ;
	 } 
	buffer[_i++] = "</td></table></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"width": "20",
	"id": "admin.Widgets#ZaSeachOptionDialog",
	"height": "32"
}, false);

AjxTemplate.register("admin.Widgets#ZaAboutDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='ZaAboutDialog'><table role=\"presentation\" style='table-layout:fixed;width:100%'><tr class='ZaAboutDialogHeader' id='";
	buffer[_i++] = data["dragId"];
	buffer[_i++] = "'><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_full' class='ZaAboutDialogTitle' style='width:100%;'>&nbsp</td><td width=24 id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_close' ><div class=";
	buffer[_i++] = data["closeIcon"];
	buffer[_i++] = "></div></td></tr><tr><td class='WindowInnerContainer' colspan='2'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_content' class='DwtDialogBody'><div><div class='contentBox'><h1><a id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_bannerLink' target='_new' href='";
	buffer[_i++] = data["logoURL"];
	buffer[_i++] = "'><span class='";
	buffer[_i++] = data["aboutBanner"];
	buffer[_i++] = "'></span></a></h1><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_longVersion' class='version'>\n";
	buffer[_i++] = "                                                ";
	buffer[_i++] = data["version"];
	buffer[_i++] = "\n";
	buffer[_i++] = "                                            </div></div></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_footer' class='Footer'><div class='copyright'>\n";
	buffer[_i++] = "                                            ";
	buffer[_i++] = data["copyright"];
	buffer[_i++] = "\n";
	buffer[_i++] = "                                        </div></div></div></td></tr></table></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"width": "20",
	"id": "admin.Widgets#ZaAboutDialog",
	"height": "32"
}, false);

