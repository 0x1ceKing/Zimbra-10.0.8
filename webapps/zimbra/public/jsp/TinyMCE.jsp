<%@ page import="com.zimbra.cs.taglib.bean.BeanUtils" %>
<%
String contextPath = request.getContextPath();
if (contextPath.equals("/")) contextPath = "";
String vers = (String) request.getAttribute("version");
vers = BeanUtils.cook(vers);
String ext = (String) request.getAttribute("fileExtension");
ext = BeanUtils.cook(ext);
%>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/tinymce_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/locales.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/localeconv_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/zemoticons/data.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/zemoticons/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/autolink/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/charmap/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/contextmenu/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/directionality/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/emoticons/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/image/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/hr/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/link/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/paste/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/table/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/textcolor/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/lists/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/advlist/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/plugins/code/plugin_min.js?v=<%=vers%>"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ajax/3rdparty/tinymce/themes/modern/theme_min.js?v=<%=vers%>"></script>
<script type="text/javascript">
AjxPackage.define("TinyMCE");
AjxPackage.define("ajax.3rdparty.tinymce.tinymce_min");
AjxPackage.define("ajax.3rdparty.tinymce.locales");
AjxPackage.define("ajax.3rdparty.tinymce.localeconv_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.zemoticons.data");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.zemoticons.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.autolink.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.charmap.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.contextmenu.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.directionality.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.emoticons.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.image.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.hr.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.link.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.paste.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.table.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.textcolor.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.lists.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.advlist.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.plugins.code.plugin_min");
AjxPackage.define("ajax.3rdparty.tinymce.themes.modern.theme_min");
</script>
