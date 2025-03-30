if (AjxPackage.define("Docs")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: Docs
 *
 * Supports: The document editing application
 *
 */

if (AjxPackage.define("zimbraMail.docs.ZmDocsEditApp")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmDocsEditApp = function(){

    this._init();
    this.startup();

    window.app = this;

};

ZmDocsEditApp.prototype.constructor = ZmDocsEditApp;
ZmDocsEditApp.APP_ZIMBRA_DOC = "application/x-zimbra-doc";
ZmDocsEditApp._controller = null;

ZmDocsEditApp.prototype.toString = function(){
    return "ZmDocsEditApp";
};

ZmDocsEditApp.prototype._init = function(){
    this._controller =
        ZmDocsEditApp._controller || new ZmDocsEditController(appCtxt.getShell());

    if (!ZmDocsEditApp._controller) {
        ZmDocsEditApp._controller = this._controller;
    }

    if (!appCtxt.getAppController()) {
        appCtxt.setAppController(this._controller);
    }
};

ZmDocsEditApp.prototype.startup = function(){
    this._controller.show();
};


ZmDocsEditApp.launch = function(){

    window.appCtxt = new ZmAppCtxt();

    appCtxt.rememberMe = false;

    // Create and initialize settings
    var settings = new ZmSettings();
    appCtxt.setSettings(settings);

    var shell = new DwtShell({className:"MainShell", userShell: document.getElementById("main_shell"), id:ZmId.SHELL});
    appCtxt.setShell(shell);

    shell.getKeyboardMgr().registerKeyMap(new DwtKeyMap(true));

    //Removing all the arguments
    var rest = location.href;
    ZmDocsEditApp.restUrl = rest.replace(/\?.*/,'');

    new ZmDocsEditApp();

};

ZmDocsEditApp.setItemInfo = function(item){
    ZmDocsEditApp.fileInfo = item;
    ZmDocsEditApp.fileInfo.loaded = true;
};

ZmDocsEditApp.setFile = function(fileId, fileName, folderId){

    if(!fileId || fileId == ""){
       fileId = null;
   }

   if(!fileName || fileName == ""){
       fileName = fileId ? null : ZmMsg.untitled
   }

   folderId = (!folderId || folderId == "") ? ZmOrganizer.ID_BRIEFCASE : folderId;

   ZmDocsEditApp.fileInfo = {
       folderId: folderId,
       contentType: ZmDocsEditApp.APP_ZIMBRA_DOC,
       name:    fileName,
       id:      fileId,
       version: 1,
       descEnabled: true
   };
};
}
if (AjxPackage.define("zimbraMail.docs.view.ZmDocsEditView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmDocsEditView = function(parent, className, posStyle, controller, deferred) {
    className = className || "ZmDocsEditView";

    DwtComposite.call(this, {parent:parent, className:className, posStyle:DwtControl.ABSOLUTE_STYLE});

    this._buttons = {};
    this._controller = controller;
    this._docMgr = new ZmDocletMgr();
    this._initialize();    

    this.addControlListener(this._controlListener.bind(this));
};

ZmDocsEditView.prototype = new DwtComposite;
ZmDocsEditView.prototype.constructor = ZmDocsEditView;

ZmDocsEditView.ZD_VALUE = "ZD";
ZmDocsEditView.APP_ZIMBRA_DOC = "application/x-zimbra-doc";

ZmDocsEditView.prototype.TEMPLATE = 'briefcase.Briefcase#ZmDocsEditView';

ZmDocsEditView.prototype.toString =
function() {
	return "ZmDocsEditView";
};

ZmDocsEditView.prototype.getController =
function() {
	return this._controller;
};

ZmDocsEditView.prototype._focusPageInput =
function() {
	if (this.warngDlg) {
		this.warngDlg.popdown();
	}
	this._buttons.fileName.focus();
};


ZmDocsEditView.prototype._showVersionDescDialog =
function(callback){

    if(!this._descDialog){
        var dlg = this._descDialog = new DwtDialog({parent:appCtxt.getShell()});
        var id = Dwt.getNextId();
        dlg.setContent(AjxTemplate.expand("briefcase.Briefcase#VersionNotes", {id: id}));
        dlg.setTitle(ZmMsg.addVersionNotes);
        this._versionNotes = document.getElementById(id+"_notes");
    }

    ZmDocsEditApp.fileInfo.desc = "";
    this._versionNotes.value = "";

    this._descDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okCallback, callback));
    this._descDialog.popup();

    this._versionNotes.focus();

};

ZmDocsEditView.prototype._okCallback =
function(callback){

    ZmDocsEditApp.fileInfo.desc = this._versionNotes.value;

    if(callback){
        callback.run();
    }

    this._descDialog.popdown();
};


ZmDocsEditView.prototype.isDirty = function() {
	return this._editor && this._editor.isDirty();
};

ZmDocsEditView.prototype.save = function(force){

    var fileName = this._buttons.fileName.getValue();
    var message = this._docMgr.checkInvalidDocName(fileName);

    // Ignore save if document is not dirty
    var _docModified = this.isDirty();
    var _docNameModified = fileName && (fileName != ZmDocsEditApp.fileInfo.name);
    if (!_docModified && !_docNameModified && !message) {
        if(this._saveClose){
            window.close();
        } else {
            return;
        }
    }

    ZmDocsEditApp.fileInfo.descEnabled = this._getVersionNotesChk().checked;
    if (message) {
		var style = DwtMessageDialog.WARNING_STYLE;
		var dialog = this.warngDlg = appCtxt.getMsgDialog();
		dialog.setMessage(message, style);
		dialog.popup();
	    dialog.registerCallback(DwtDialog.OK_BUTTON, this._focusPageInput, this);
		return false;
	}
    if(!force && this._getVersionNotesChk().checked){
        this._showVersionDescDialog(new AjxCallback(this, this.save, true));
        return false;
    }

    ZmDocsEditApp.fileInfo.name    = fileName;
    ZmDocsEditApp.fileInfo.content = this._editor.getContent();
    ZmDocsEditController.savedDoc = ZmDocsEditApp.fileInfo.content; 
    ZmDocsEditApp.fileInfo.contentType = ZmDocsEditApp.APP_ZIMBRA_DOC;

    this._docMgr.setSaveCallback(new AjxCallback(this, this._saveHandler));
    this._docMgr.saveDocument(ZmDocsEditApp.fileInfo);

};

ZmDocsEditView.prototype._saveHandler =
function(files, conflicts) {
    if(conflicts){
        var formatter = new AjxMessageFormat(ZmMsg.saveConflictDoc);
        appCtxt.setStatusMsg(formatter.format(files[0].name), ZmStatusView.LEVEL_WARNING);
    } else {
        if (files && files.length > 0) {
            this._editor.clearDirty();

            ZmDocsEditApp.fileInfo.id = files[0].id;
            ZmDocsEditApp.fileInfo.version = files[0].ver;

            var item = this.loadData(ZmDocsEditApp.fileInfo.id);
            if(item && !item.rest){    //TODO: Change this code to construct a rest url
                item.rest = ZmDocsEditApp.restUrl;
            }
            if(item != null) {
                ZmDocsEditApp.fileInfo = item;
                this.setFooterInfo(item);
            }

            if(this._saveClose){
                parentAppCtxt.setStatusMsg(ZmMsg.savedDoc, ZmStatusView.LEVEL_INFO);
                window.close();
            } else {
                appCtxt.setStatusMsg(ZmMsg.savedDoc, ZmStatusView.LEVEL_INFO);
            }
        }
    }

};

ZmDocsEditView.prototype.setFooterInfo = function(item){

    if(!this._locationEl) return;

	var content;
	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
    
	if (item.folderId == rootId) {
		content = appCtxt.getById(item.folderId).name;
	}else {
		var separator = "&nbsp;&raquo;&nbsp;";
		var a = [ ];
		var folderId = item.folderId;
		while ((folderId != null) && (folderId != rootId)) {
            var wAppCtxt = null;
            if(window.isRestView) {
               wAppCtxt = top.appCtxt;
            } else {
               wAppCtxt = window.opener && window.opener.appCtxt;
            }
            var docs = wAppCtxt && wAppCtxt.getById(folderId);
            if(!docs) {
                break;
            }
            
            a.unshift(docs.name);

            if(!docs.parent) {
                break;
            }

            folderId = docs.parent.id;
			if (folderId != rootId) {
				a.unshift(separator);
			}

        }
		content = a.join("");
	}

	this._locationEl.innerHTML = content;
	this._versionEl.innerHTML = (item.version ? item.version : "");
	this._authorEl.innerHTML = (item.creator ? item.creator : "");
	this._modifiedEl.innerHTML = (item.createDate ? item.createDate : "");
};


ZmDocsEditView.prototype.loadData =
function(id) {
    return this._docMgr.getItemInfo({id:id});
};

ZmDocsEditView.prototype.loadDoc =
function(item) {
	var content = this._docMgr.fetchDocumentContent(item) || "<br/>";

	//resurrecting code from bug 74873 that was removed in bug 84887.
	//this was in ZmDocsEditController.prototype.loadDocument. But fixed so it can take attributes before dfsrc, and choose http or https in this one line
	content = content.replace(/<img ([^>]*)dfsrc="http(s?):\/\//gi, '<img $1 src="http$2://');

    if(this._editor) {
        this._editor.setContent(content);
    } else {
		this.setPendingContent(content);
    }
};

ZmDocsEditView.prototype.setPendingContent =
function(content) {
	this._pendingContent = content;
};

ZmDocsEditView.prototype.getPendingContent =
function() {
	return this._pendingContent;
};

ZmDocsEditView.prototype.onLoadContent =
function() {
	var pendingContent = this.getPendingContent();
	if (pendingContent != null) {
		var ed = this.getEditor();
		ed.setContent(pendingContent, {format: "raw"});
		this.setPendingContent(null);
	}
};

ZmDocsEditView.prototype.onEditorLoad =
function(editor) {
	setTimeout(this._resetSize.bind(this), 0);
};

ZmDocsEditView.prototype._controlListener =
function() {
	this._resetSize();
};
    
ZmDocsEditView.prototype._resetSize =
function() {
	var bounds = this.getInsetBounds();
	var editorInsets = this._editor.getInsets();

	bounds.height -= this._toolbar.getOuterSize().y + Dwt.getOuterSize(this._footerEl).y + editorInsets.top + editorInsets.bottom;

	this._editor.setSize(bounds.width, bounds.height);
};


ZmDocsEditView.prototype._initialize = function() {
	var className = this.getClassName();
	var id = this.getHTMLElId();
	var data = {
		headerId: id + '_header',
		mainId: id + '_main',
		footerId: id + '_footer',

		locationId: id + '_location',
		versionId: id + '_version',
		authorId: id + '_author',
		modifiedId: id + '_modified'
	};

	this._createHtmlFromTemplate(this.TEMPLATE, data);

    var toolbar = this._toolbar = new DwtToolBar({parent:this, parentElement: data.headerId, className:"ZDToolBar", cellSpacing:2, posStyle:DwtControl.RELATIVE_STYLE});
    this._createToolbar(toolbar);

    var editor = this._editor = new ZmHtmlEditor({
		parent: this,
		parentElement: data.mainId,
		content: '',
		initCallback: this._controlListener.bind(this),
		autoFocus: true,
		mode: Dwt.HTML
        });
	editor.addOnContentInitializedListener(this.onLoadContent.bind(this));

	this._locationEl = document.getElementById(data.locationId);
	this._versionEl = document.getElementById(data.versionId);
	this._authorEl = document.getElementById(data.authorId);
	this._modifiedEl = document.getElementById(data.modifiedId);
	this._footerEl = document.getElementById(data.footerId);
};

ZmDocsEditView.prototype._stealFocus =
function(iFrameId) {
	if(AjxEnv.isFirefox3up) {
		var iframe = document.getElementById(iFrameId);
		if (iframe) {
			iframe.blur();
			iframe.focus();
		}
	}
}

ZmDocsEditView.prototype._saveButtonListener = function(ev) {
    this._saveClose = false;
    this.save();
};

ZmDocsEditView.prototype._saveCloseButtonListener = function(ev) {
    this._saveClose = true;
    this.save();
};

ZmDocsEditView.prototype._insertDocElements = function(ev) {

    var action = ev.item.getData(ZmDocsEditView.ZD_VALUE);

    var doc = this._editor._getIframeDoc();
    var spanEl = doc.createElement("span");

    if(action == "DocElement2") {
        spanEl.innerHTML = '<table role="presentation" width="90%" cellspacing="1" cellpadding="3" align="center" style="border:1px solid rgb(0,0,0);"><tbody><tr height="40"><td style="background-color: rgb(204, 0, 0);"><br/></td></tr><tr><td><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><div _moz_dirty="" style="margin-left: 80px;">' +
                            '<font size="7" _moz_dirty="">[ Document Title ]</font><br _moz_dirty=""/><font size="3" _moz_dirty="" style="color: rgb(192, 192, 192);">&nbsp;[ Sub Title]</font><br _moz_dirty=""/></div><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><div _moz_dirty="" style="margin-left: 76%;">&nbsp;' +
                            '<img src="https://www.zimbra.com/_media/logos/zimbra_logo.gif" alt="https://www.zimbra.com/_media/logos/zimbra_logo.gif" _moz_dirty="" style="width: 211px; height: 101px;"/>' +
                            '<br _moz_dirty=""/></div><br _moz_dirty=""/><br _moz_dirty=""/></td></tr></tbody></table>';

    } else if(action == "DocElement3") {

        spanEl.innerHTML = '<table role="presentation" width="90%" cellspacing="1" cellpadding="3" align="center"><tbody><tr><td style="border: 1px solid rgb(0, 0, 0);"><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><div _moz_dirty="" style="margin-left: 80px;">' +
                            '<font size="7" _moz_dirty="">[ Document Title ]</font><br _moz_dirty=""/><font size="3" _moz_dirty="" style="color: rgb(192, 192, 192);">&nbsp;[ Sub Title]</font><br _moz_dirty=""/></div><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/>' +
                            '<br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><br _moz_dirty=""/><div _moz_dirty="" style="margin-left: 80%;">&nbsp;' +
                            '<img src="http://yhoo.client.shareholder.com/press/images/yahoobang-small.gif" alt="http://yhoo.client.shareholder.com/press/images/yahoobang-small.gif" _moz_dirty="" style="width: 156px; height: 91px;"/>' +
                            '<br _moz_dirty=""/></div><br _moz_dirty=""/><br _moz_dirty=""/></td></tr></tbody></table>';

    }

    var p = doc.createElement("br");
    var df = doc.createDocumentFragment();
    df.appendChild(p);
    df.appendChild(spanEl.getElementsByTagName("table")[0]);
    df.appendChild(p.cloneNode(true));

    this._editor._insertNodeAtSelection(df);

};

ZmDocsEditView.prototype._createToolbar = function(toolbar) {

    var params = {parent:toolbar};

    b = this._buttons.fileName = new DwtInputField({parent:toolbar, size:20});    
    
    var b = this._buttons.saveFile = new DwtToolBarButton(params);
    b.setImage("Save");
    b.setText(ZmMsg.save);
    b.setData(ZmDocsEditView.ZD_VALUE, "Save");
    b.addSelectionListener(new AjxListener(this, this._saveButtonListener));
    b.setToolTipContent(ZmMsg.save);

    new DwtControl({parent:toolbar, className:"vertSep"});

    var b = this._buttons.saveAndCloseFile = new DwtToolBarButton(params);
    b.setImage("Save");
    b.setText(ZmMsg.saveClose);
    b.setData(ZmDocsEditView.ZD_VALUE, "Save&Close");
    b.addSelectionListener(new AjxListener(this, this._saveCloseButtonListener));
    b.setToolTipContent(ZmMsg.saveClose);

    toolbar.addFiller();

    b = new DwtComposite({parent:toolbar});
    b.setContent([
        "<div style='white-space: nowrap; padding-right:10px;'>",
            "<input type='checkbox' name='enableDesc' id='enableDesc' value='enableVersions'>",
            "&nbsp; <label class='ZmFieldLabelRight' for='enableDesc'>",
                ZmMsg.enableVersionNotes,
            "</label>",
        "</div>"
    ].join(''));

    /* var listener = new AjxListener(this, this._tbActionListener);


    new DwtControl({parent:toolbar, className:"vertSep"});

    b = this._buttons.clipboardCopy = new DwtToolBarButton(params);
	b.setImage("Copy");
	b.setData(ZmDocsEditView.ZD_VALUE, "ClipboardCopy");
	b.addSelectionListener(listener);
	b.setToolTipContent(ZmMsg.copy);

	b = this._buttons.clipboardCut = new DwtToolBarButton(params);
	b.setImage("Cut");
	b.setData(ZmDocsEditView.ZD_VALUE, "ClipboardCut");
	b.addSelectionListener(listener);
	b.setToolTipContent(ZmMsg.cut);

	b = this._buttons.clipboardPaste = new DwtToolBarButton(params);
	b.setImage("Paste");
	b.setData(ZmDocsEditView.ZD_VALUE, "ClipboardPaste");
	b.addSelectionListener(listener);
	b.setToolTipContent(ZmMsg.paste);

    new DwtControl({parent:toolbar, className:"vertSep"});

    b = this._buttons.newDocument = new DwtToolBarButton(params);
    b.setText(ZmMsg.newDocument);
    b.setImage("Doc");
    b.setData(ZmDocsEditView.ZD_VALUE, "NewDocument");
    b.addSelectionListener(listener);
    b.setToolTipContent(ZmMsg.briefcaseCreateNewDocument);


    b = this._buttons.clipboardPaste = new DwtToolBarButton(params);
    b.setText("Open Document");
    b.setData(ZmDocsEditView.ZD_VALUE, "OpenDocument");
    b.addSelectionListener(listener);
    b.setToolTipContent(ZmMsg.paste);
    */
    
};

ZmDocsEditView.prototype._getVersionNotesChk =
function(){
    if(!this._verNotesChk){
        this._verNotesChk = document.getElementById('enableDesc');
    }
    return this._verNotesChk;
}

ZmDocsEditView.prototype.enableVersionNotes =
function(enable){
    this._getVersionNotesChk().checked = !!enable;
};


ZmDocsEditView.prototype._pushIframeContent =
function(iframeN) {

    if(!iframeN) return;
    var iContentWindow = iframeN.contentWindow;
    var doc = iContentWindow ? iContentWindow.document : null;
    if(doc) {
        doc.open();
        var html = [];
        html.push('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">');
        html.push('<html>');
        html.push('<body><br _moz_dirty=""/></body>');
        html.push('</html>');
        doc.write(html.join(""));
        doc.close();
        iContentWindow.focus();
    }
};
}
if (AjxPackage.define("zimbraMail.docs.controller.ZmDocsEditController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmDocsEditController = 	function(shell) {
   if(arguments.length == 0) return;
    ZmController.call(this, shell);

    this._docsEdit = null;
    this._toolbar = null;

    this._docMgr = new ZmDocletMgr();
    this._requestMgr = new ZmRequestMgr(this);
    appCtxt.getShell().addControlListener(new AjxListener(this, this.resize));
};

ZmDocsEditController.prototype = new ZmController();
ZmDocsEditController.prototype.constructor = ZmDocsEditController;
ZmDocsEditController.savedDoc = null;

ZmDocsEditController.prototype.isZmDocsEditController = true;
ZmDocsEditController.prototype.toString = function() { return "ZmDocsEditController"; };

ZmDocsEditController.prototype._initDocsEdit = function(){
    if(this._docsEdit) return;
    this._docsEdit = new ZmDocsEditView(this._container, null, DwtControl.ABSOLUTE_STYLE, this, "absolute");
};

ZmDocsEditController.prototype.show = function(data){

    this._initDocsEdit(); 

    var docsEdit = this._docsEdit;

    docsEdit.setZIndex(Dwt.Z_VIEW);

    this.resize();

    this._initModel();
    
};

ZmDocsEditController.prototype.resize = function(ev){

    var docsEdit = this._docsEdit;

    if(!docsEdit) return;

    docsEdit.setDisplay("none");
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;

    docsEdit.setDisplay("block");
    docsEdit.setBounds(0, 0, w, h);

};

ZmDocsEditController.prototype.loadData =
function(id) {
    return this._docMgr.getItemInfo({id:id});
};

ZmDocsEditController.prototype.loadDocument = function(item) {
    this._docsEdit.loadDoc(item);
};

ZmDocsEditController.prototype._initModel = function(){
    if(ZmDocsEditApp.fileInfo && ZmDocsEditApp.fileInfo.id) {
        var item = ZmDocsEditApp.fileInfo.loaded ? ZmDocsEditApp.fileInfo : this.loadData(ZmDocsEditApp.fileInfo.id);
        if(!item.rest){    //TODO: Change this code to construct a rest url
            item.rest = ZmDocsEditApp.restUrl;
        }
        if(item != null) {
            ZmDocsEditApp.fileInfo = item;
            this._docsEdit._buttons.fileName.setValue(item.name);
            this.loadDocument(item);
            this._docsEdit.setFooterInfo(item);
            this._docsEdit.enableVersionNotes(item.descEnabled);
        }
    }else if (ZmDocsEditApp.fileInfo){
        this._docsEdit.enableVersionNotes(ZmDocsEditApp.fileInfo.descEnabled);
    }
};

ZmDocsEditController.prototype.sendRequest = function(params) {
    params.noSession = true;
    this._requestMgr.sendRequest(params);
};

ZmDocsEditController.prototype._kickPolling =
function(resetBackoff) {

};

ZmDocsEditController.prototype.setStatusMsg =
function(){
    if(!this.statusView){
        this.statusView = new ZmStatusView(appCtxt.getShell(), "ZmStatus", Dwt.ABSOLUTE_STYLE, ZmId.STATUS_VIEW);
    }
    params = Dwt.getParams(arguments, ZmStatusView.MSG_PARAMS);
    params.transitions = ZmToast.DEFAULT_TRANSITIONS;
	this.statusView.setStatusMsg(params);
};

ZmDocsEditController.prototype.checkForChanges = function() {
    if (this._docsEdit.isDirty()) {
        return ZmMsg.exitDocUnSavedChanges;
    }
};

/**
* return boolean  - Check if document has any changes to be saved
* */
ZmDocsEditController.prototype._isDirty = function() {
    return this._docsEdit.isDirty();
}

ZmDocsEditController.prototype.exit = function(){
    if(ZmDocsEditApp.fileInfo.locked){
        this._docMgr.unlock(ZmDocsEditApp.fileInfo);
    }
};
}
if (AjxPackage.define("zimbraMail.briefcase.model.ZmDocletMgr")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a doclet manager.
 * @class
 * This class represents a doclet manager.
 * 
 */
ZmDocletMgr = function() {
};

ZmDocletMgr.prototype.saveDocument =
function(item) {
    this._uploadSaveDocs2([{id: item.id, name: item.name, version: (item.version ? item.version :1), folderId: item.folderId}], null, null, item.name, item.content, item.contentType, item.descEnabled, item.desc);
};

ZmDocletMgr.prototype._uploadSaveDocs2 =
function(files, status, guids, name, content, ct, enableDesc, desc) {
    // create document wrappers
    var soapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra", null);
    soapDoc.setMethodAttribute("onerror", "continue");
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.done) continue;

        var saveDocNode = soapDoc.set("SaveDocumentRequest", null, null, "urn:zimbraMail");
        saveDocNode.setAttribute("requestId", i);

        var docNode = soapDoc.set("doc", null, saveDocNode);
        if (file.id) {
            docNode.setAttribute("id", file.id);
            docNode.setAttribute("ver", file.version);
        }
        else {
            docNode.setAttribute("l", file.folderId);
        }

        if(ct){
            docNode.setAttribute("ct", ct);
        }

        if(file.guid) {
            var uploadNode = soapDoc.set("upload", null, docNode);
            uploadNode.setAttribute("id", file.guid);
        }

        if(name!=null && content!=null) {
            var contentNode = soapDoc.set("content", content, docNode);
            docNode.setAttribute("name", name);
        }

        docNode.setAttribute("descEnabled", enableDesc ? "true" : "false");
        if(desc){
            docNode.setAttribute("desc", desc);
        }
    }

    var args = [ files, status, guids ];
    var callback = new AjxCallback(this, this._uploadSaveDocsResponse, args);
    var params = {
        soapDoc:soapDoc,
        asyncMode:true,
        callback:callback
    };

    var parentAppCtxt = window.opener && window.opener.appCtxt;
	if (parentAppCtxt) {
        var acct = parentAppCtxt.getActiveAccount();
        params.accountName = (acct && acct.id != ZmAccountList.DEFAULT_ID) ? acct.name : null;
    }
    this.sendRequest(params);
};

/**
 * Sends the request.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @see			ZmRequestMgr
 * @see			ZmRequestMgr.sendRequest
 */
ZmDocletMgr.prototype.sendRequest =
function(params) {
    if(!this._requestMgr) {
        this._requestMgr = new ZmRequestMgr(this);
    }
    params.noSession = true;
    return this._requestMgr.sendRequest(params);
};

ZmDocletMgr.prototype._uploadSaveDocsResponse =
function(files, status, guids, response) {
    var resp = response && response._data && response._data.BatchResponse;

    var folderIds = [];

    // mark successful uploads
    if (resp && resp.SaveDocumentResponse) {
        for (var i = 0; i < resp.SaveDocumentResponse.length; i++) {
            var saveDocResp = resp.SaveDocumentResponse[i];
            files[saveDocResp.requestId].done = true;
            files[saveDocResp.requestId].rest = saveDocResp.doc[0].rest;
            files[saveDocResp.requestId].ver = saveDocResp.doc[0].ver;
            files[saveDocResp.requestId].id = saveDocResp.doc[0].id;
            if(files[saveDocResp.requestId].folderId) {
                folderIds.push(files[saveDocResp.requestId].folderId);
            }
        }
    }

    // check for conflicts
    var conflicts = null;
    if (resp && resp.Fault) {
        var errors = [];
        conflicts = [];
        for (var i = 0; i < resp.Fault.length; i++) {
            var fault = resp.Fault[i];
            var error = fault.Detail.Error;
            var code = error.Code;
            var attrs = error.a;
            if (code == ZmCsfeException.MAIL_ALREADY_EXISTS ||
                code == ZmCsfeException.MODIFY_CONFLICT) {
                var file = files[fault.requestId];
                for (var p in attrs) {
                    var attr = attrs[p];
                    switch (attr.n) {
                        case "id": { file.id = attr._content; break; }
                        case "ver": { file.version = attr._content; break; }
                        case "rest": { file.rest = attr._content; break; }

                    }
                }
                conflicts.push(file);
            }
            else {
                DBG.println("Unknown error occurred: "+code);
                errors[fault.requestId] = fault;
            }
        }
        // TODO: What to do about other errors?
    }

	// poke parent window to get notifications
	var parentAppCtxt = window.opener && window.opener.appCtxt;
	var parentAppCtlr = parentAppCtxt && parentAppCtxt.getAppController();
	if (parentAppCtlr && !parentAppCtlr.getInstantNotify()) {
		parentAppCtlr.sendNoOp();
	}

    if (this._saveCallback) {
        //Pass on the conflicts to callback
        this._saveCallback.run(files, conflicts);
    }
};

ZmDocletMgr.prototype.setSaveCallback =
function(callback) {
  this._saveCallback = callback;  

};

ZmDocletMgr.prototype._kickPolling =
function(resetBackoff) {

};

ZmDocletMgr.prototype._handleException =
function(ex, continuation) {
    //todo: handle exceptions
};

ZmDocletMgr.prototype.runAppFunction =
function(funcName, force) {
    //not needed in new function
};

ZmDocletMgr.prototype.fetchDocumentContent =
function(item) {
    var restURL = item.rest;
    var urlParts = AjxStringUtil.parseURL(restURL);
    if(urlParts && urlParts.path) {
        var result = AjxRpc.invoke("", urlParts.path + "?fmt=native&ver=" + item.version, {}, null, true);
        var docContent = "";
        if(result && result.success) {
            docContent = this._pendingContent = result.text;
        }
        return docContent;
    }
    return "";
};


ZmDocletMgr.prototype.getItemInfo =
function(params)
{
    var soapDoc = AjxSoapDoc.create("GetItemRequest", "urn:zimbraMail");
    var folderNode = soapDoc.set("item");

    if(params.path){
        folderNode.setAttribute("path", params.path);
    }else if(params.folderId && params.id){ //bug:19658
        folderNode.setAttribute("l", params.folderId);
        folderNode.setAttribute("id", params.id);
    }else if(params.folderId && params.name){
        folderNode.setAttribute("l", params.folderId);
        folderNode.setAttribute("name", params.name);
    }else if(params.id){
        folderNode.setAttribute("id", params.id);
    }

    var args = [];
    var asyncMode = (params.callback?true:false);

    var handleResponse = null;
    if(asyncMode){
        handleResponse = new AjxCallback(this, this.handleGetItemResponse,[params]);
    }

    var parentAppCtxt = window.opener && window.opener.appCtxt;
    if (parentAppCtxt && parentAppCtxt.multiAccounts) {
        var acct = parentAppCtxt.getActiveAccount();
        params.accountName = acct && acct.name;
    }

    var reqParams = {
        soapDoc: soapDoc,
        asyncMode: asyncMode,
        callback: handleResponse,
        accountName: params.accountName
    };

    var response = this.sendRequest(reqParams);

    if(!asyncMode && response){
        var item = this.handleGetItemResponse(params,response.GetItemResponse);
        return item;
    }

    return null;
};

ZmDocletMgr.prototype.handleGetItemResponse =
function(params,response)
{

    var path = params.path;
    var callback = params.callback;

    var getItemResponse = response;
    if(response && response._data){
        getItemResponse = response && response._data && response._data.GetItemResponse;
    }

    var docResp = getItemResponse && getItemResponse.doc && getItemResponse.doc[0];

    var item = null;

    if(docResp){
        item = new ZmItem();
        var data = docResp;
        if (data.id) item.id = data.id;        
        if (data.rest) item.rest = data.rest;
        if (data.l) item.folderId = data.l;
        if (data.name) item.name = data.name;
        if (data.cr) item.creator = data.cr;
        if (data.d) item.createDate = new Date(Number(data.d));
        if (data.md) item.modifyDate = new Date(Number(data.md));
        if (data.leb) item.modifier = data.leb;
        if (data.s) item.size = Number(data.s);
        if (data.ver) item.version = Number(data.ver);
        if (data.ct) item.contentType = data.ct.split(";")[0];
        item.folderId = docResp.l || ZmOrganizer.ID_BRIEFCASE;
        item.locked = false;
        if (data.loid)    {
            item.locked = true;
            item.lockId = data.loid;
            item.lockUser = data.loe;
            item.lockTime = new Date(Number(data.lt));
        }
        item.descEnabled = data.descEnabled;
    }

    if(callback){
        callback.run(item);
    }

    return item;
};

ZmDocletMgr.createItem = function(response) {
    var docletMgr = new ZmDocletMgr();
    return docletMgr.handleGetItemResponse({}, response);
};

ZmDocletMgr.prototype.getThemeContent =
function(themePath)
{
    if(!themePath)  return '';

    var result = AjxRpc.invoke("", themePath, {}, null, true);
    var docContent = "";
    if(result && result.success) {
        docContent = result.text;
    }
    return docContent;
};

ZmDocletMgr.prototype.checkInvalidDocName = function(fileName) {

    var message;
    fileName = fileName.replace(/^\s+/,"").replace(/\s+$/,"");

    if(fileName == ""){
        message = ZmMsg.emptyDocName;
    }else if (!ZmOrganizer.VALID_NAME_RE.test(fileName) || ZmAppCtxt.INVALID_NAME_CHARS_RE.test(fileName)) {
        //Bug fix # 79986 - < > , ? | / \ * : are invalid filenames
        message = AjxMessageFormat.format(ZmMsg.errorInvalidName, AjxStringUtil.htmlEncode(fileName));
    } else if ( fileName.length > ZmOrganizer.MAX_NAME_LENGTH){
        message = AjxMessageFormat.format(ZmMsg.nameTooLong, ZmOrganizer.MAX_NAME_LENGTH);
    }

    return message;
};

ZmDocletMgr.prototype.unlock =
function(item, callback, errorCallback, accountName){

    var json = {
		ItemActionRequest: {
			_jsns: "urn:zimbraMail",
			action: {
				id:	item.id,
				op:	"unlock"
			}
		}
	};

	var params = {
		jsonObj:		json,
		asyncMode:		Boolean(callback),
		callback:		callback,
		errorCallback:	errorCallback,
		accountName:	accountName
	};
	return this.sendRequest(params);

};
}
}
