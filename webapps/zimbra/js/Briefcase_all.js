if (AjxPackage.define("Briefcase")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: Briefcase
 * 
 * Supports: The Briefcase application
 * 
 * Loaded:
 * 	- When the user goes to the Briefcase application
 * 	- When the user creates a new briefcase or uploaded file
 */
if (AjxPackage.define("zimbraMail.briefcase.view.ZmBriefcaseBaseView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the briefcase base view.
 * @class
 * This class represents the base view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @param	{ZmControl}		params.parent		the parent
 * @param	{String}	params.className		the class name
 * @param	{constant}	params.view		the view
 * @param	{ZmBriefcaseController}	params.controller		the controller
 * @param	{DwtDropTarget}		params.dropTgt		the drop target
 * 
 * @extends		ZmListView
 */
ZmBriefcaseBaseView = function(params) {

	if (arguments.length == 0) { return; }
	
	params.posStyle = params.posStyle || DwtControl.ABSOLUTE_STYLE;
	params.type = ZmItem.BRIEFCASE_ITEM;
	params.pageless = (params.pageless !== false);
	ZmListView.call(this, params);
};

ZmBriefcaseBaseView.prototype = new ZmListView;
ZmBriefcaseBaseView.prototype.constructor = ZmBriefcaseBaseView;

/**
 * Gets the title.
 * 
 * @return	{String}	the title
 */
ZmBriefcaseBaseView.prototype.getTitle =
function() {
	//TODO: title is the name of the current folder
	return [ZmMsg.zimbraTitle, this._controller.getApp().getDisplayName()].join(": ");
};

ZmBriefcaseBaseView.prototype._sortIndex =
function(list, item){
    if(!list){
        return null;
    }
    var a = list.getArray(), index = a.length;
	for(var i = 0; i < a.length; i++) {
        var lItem = a[i];
		if (!lItem.isFolder && item.name.toLowerCase() < lItem.name.toLowerCase()) {
			index = i;
            break;
		}

	}
	return { listIndex: index, displayIndex: index};
};

ZmBriefcaseBaseView.prototype._changeListener =
function(ev) {

	if (ev.type != this.type) { return; }

	var items = ev.getDetail("items");

	if (ev.event == ZmEvent.E_CREATE) {
		var indices;
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (this._list && this._list.contains(item)) { continue; }			// skip if we already have it
			if (this._list) {
				indices = this._sortIndex(this._list, item);
				if (indices) {
					this.addItem(item, indices.displayIndex, false, indices.listIndex);
					this.scrollToItem(item);
					if(this.getSelection().length == 0) {
						// Only select if nothing else is selected
						this.setSelection(item);
					}
				}
			} else {
				// Create the list and add the item
				this.addItem(item, 0, false, 0);
				this.setSelection(item);
			}
		}
	}

    if (ev.event == ZmEvent.E_MODIFY) {
		var updateList = false;
		var item;
		var nameUpdated;
		for (var i = 0; i < items.length; i++) {
			item = items[i];
			if (this._list && this._list.contains(item)) {
				nameUpdated = ev.getDetail(ZmBriefcaseBaseItem.NAME_UPDATED);
				if (nameUpdated) {
					this._handleRename(item);
				} else {
					this._handleModified(item);
				}
			}
		}
    }

    ZmListView.prototype._changeListener.call(this, ev);

    if(ev.event == ZmEvent.E_MOVE){
        var folderId = this._controller._folderId || this.folderId || this._folderId;
        var item = items && items.length ? items[0] : items;
        if(item && item.folderId == folderId && this._getRowIndex(item) === null){
            this.addItem(item, 0, true);
            item.handled = true;
        }
    }

};

ZmBriefcaseBaseView.prototype._handleRename = function(item) {
	this._handleModified(item);
};

ZmBriefcaseBaseView.prototype._handleModified = function(item) {
	this._redrawItem(item);
	if (this._expanded && this._expanded[item.id]) {
		//if already expanded, update revisions row
		this.parent._expand(item);
	}
};


ZmBriefcaseBaseView.prototype._getToolTip =
function(params) {

	var item = params.item;
	if (item.isFolder) { return null; }

	var prop = [{name:ZmMsg.briefcasePropName, value:item.name}];
	if (item.size) {
		prop.push({name:ZmMsg.briefcasePropSize, value:AjxUtil.formatSize(item.size)});
	}
	if (item.contentChangeDate) {
		var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM);
		var dateStr = dateFormatter.format(item.contentChangeDate);
		prop.push({name:ZmMsg.briefcasePropModified, value:dateStr});
	}

    if(item.locked){
        prop.push({name:ZmMsg.status, value:ZmMsg.locked});
    }

	var subs = {
        title: ZmMsg.briefcaseFileProps,
		fileProperties:	prop,
		tagTooltip:		this._getTagToolTip(item)
	};
	return AjxTemplate.expand("briefcase.Briefcase#Tooltip", subs);
};

/**
 * Uploads files from drag-and-drop.
 * 
 * @private
 */
ZmBriefcaseBaseView.prototype.uploadFiles =
function() {
    var attachDialog = appCtxt.getUploadDialog();
    var files = this.processUploadFiles();
    attachDialog.uploadFiles(null, files, document.getElementById("zdnd_form"), {id:this._controller._folderId});
};

/**
 * @private
 */
ZmBriefcaseBaseView.prototype.processUploadFiles =
function() {
	var files = [];
	var ulEle = document.getElementById('zdnd_ul');
    if (ulEle) {
        for (var i = 0; i < ulEle.childNodes.length; i++) {
            var liEle = ulEle.childNodes[i];
            var inputEl = liEle.childNodes[0];
            if (inputEl.name != "_attFile_") continue;
            if (!inputEl.value) continue;
            var file = {
                fullname: inputEl.value,
                name: inputEl.value.replace(/^.*[\\\/:]/, "")
            };
            files.push(file);
         }
   }
   return files;
};

ZmBriefcaseBaseView.prototype.getListView =
function(){
    return this;
};

ZmBriefcaseBaseView.prototype.getTitle =
function(){
    return [ZmMsg.zimbraTitle, ZmMsg.briefcase].join(': ');  
};

ZmBriefcaseBaseView.prototype._cloneList =
function(list){
    var newList = new ZmList(list.type, list.search);
    var item;
    for(var i=0; i<list.size(); i++){
        item = list.get(i);
        item.list = newList;
        newList.add(item);
    }
    newList.setHasMore(list.hasMore());
    return newList;
};

ZmBriefcaseBaseView.prototype.appendFolders =
function(srcList){

    if(srcList._foldersAdded)
        return srcList;

    var subs = this._folders = this._controller._getSubfolders();
    var subsLen = subs ? subs.length : 0;
    var newList = srcList;
    if(subsLen > 0){
        for(var i=subsLen-1; i>=0; i--){
            newList.add(subs[i], 0);
        }
        newList._foldersAdded = true;
    }
    return newList;
};

ZmBriefcaseBaseView.prototype.set =
function(list, sortField, doNotIncludeFolders){
    this.cleanup();

    if(!doNotIncludeFolders){
        list = this.appendFolders(list);
    }

    this._zmList = list;
    ZmListView.prototype.set.call(this, list, sortField);
    if (this._expanded){
    	var arr = list.getArray();
    	var cnt = arr.length;
    	for(var i=0;i<cnt;i++) {
    		var item = arr[i];
    		if(this._expanded[item.id]) {
    			this.parent._expand(item);
    		}
    	}
        
    }
};

ZmBriefcaseBaseView.prototype.renameFile =
function(item){
    //TODO: Make rename field singleton across briefcase views
    var fileNameEl = this._getFieldId(item, ZmItem.F_NAME);
    fileNameEl = document.getElementById(fileNameEl);
    var fileNameBounds = Dwt.getBounds(fileNameEl);

    var fileInput = this._enableRenameInput(true, fileNameBounds);
    fileInput.setValue(item.isRevision ? item.parent.name : item.name);
    this._fileItem = item;
};

ZmBriefcaseBaseView.prototype._enableRenameInput =
function(enable, bounds){
    var fileInput = this._getRenameInput();
    if(enable){
        fileInput.setBounds(bounds.x, bounds.y, bounds.width ,  18);
        fileInput.setDisplay(Dwt.DISPLAY_INLINE);
        fileInput.focus();
    }else{
        fileInput.setDisplay(Dwt.DISPLAY_NONE);
        fileInput.setLocation("-10000px", "-10000px");
    }
    return fileInput;
};

ZmBriefcaseBaseView.prototype._getRenameInput =
function(){
    if(!this._renameField){
        this._renameField = new DwtInputField({parent:appCtxt.getShell(), className:"RenameInput DwtInputField", posStyle: Dwt.ABSOLUTE_STYLE});
        this._renameField.setZIndex(Dwt.Z_VIEW + 10); //One layer above the VIEW
        this._renameField.setDisplay(Dwt.DISPLAY_NONE);
        this._renameField.setLocation("-10000px", "-10000px");
        this._renameField.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleKeyUp));
    }
    return this._renameField;
};

ZmBriefcaseBaseView.prototype._mouseDownAction = function(mouseEv, div) {
	if (this._renameField && this._renameField.getVisibility() && this._fileItem) {
		this._doRename(this._fileItem);
		this.resetRenameFile();
	}
	ZmListView.prototype._mouseDownAction(mouseEv, div);
};


ZmBriefcaseBaseView.prototype._handleKeyUp =
function(ev) {
    var allowDefault = true;
	var key = DwtKeyEvent.getCharCode(ev);
    var item = this._fileItem;
    if (DwtKeyEvent.IS_RETURN[key]) {
        this._doRename(item);
        allowDefault = false;
    }
    else if( key === DwtKeyEvent.KEY_ESCAPE){
        this._redrawItem(item);
        allowDefault = false;
    }
	DwtUiEvent.setBehaviour(ev, true, allowDefault);
};

ZmBriefcaseBaseView.prototype._doRename = function(item) {
	var fileName = this._renameField.getValue();
	if (fileName != '' && (fileName != item.name)) {
		var warning = appCtxt.getMsgDialog();
		if (this._checkDuplicate(fileName)) {
			this._redrawItem(item);
			warning.setMessage(AjxMessageFormat.format(ZmMsg.itemWithFileNameExits, fileName), DwtMessageDialog.CRITICAL_STYLE, ZmMsg.briefcase);
			warning.popup();
		} else if(ZmAppCtxt.INVALID_NAME_CHARS_RE.test(fileName)) {
			//Bug fix # 79986 show warning popup in case of invalid filename
			warning.setMessage(AjxMessageFormat.format(ZmMsg.errorInvalidName, AjxStringUtil.htmlEncode(fileName)), DwtMessageDialog.WARNING_STYLE, ZmMsg.briefcase);
			warning.popup();
		} else {
			item.rename(fileName, new AjxCallback(this, this.resetRenameFile));
		}
	} else {
		this.redrawItem(item);
	}
}


ZmBriefcaseBaseView.prototype.resetRenameFile =
function(){
    this._enableRenameInput(false);
    this._fileItem = null;
};

ZmBriefcaseBaseView.prototype._redrawItem =
function(item){
    this.resetRenameFile();
    this.redrawItem(item);
};

ZmBriefcaseBaseView.prototype._checkDuplicate =
function(name){

    name = name.toLowerCase();
    var list = this.getList();
    if(list){
        list = list.getArray();
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if(item.name.toLowerCase() == name)
                return true;
        }
    }
    return false;   
};

ZmBriefcaseBaseView.prototype.cleanup = function() {
    if (this._renameField) {
        this.resetRenameFile();
	}
};

}
if (AjxPackage.define("zimbraMail.briefcase.view.ZmBriefcaseIconView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the briefcase icon view.
 * @class
 * This class represents the briefcase icon view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmBriefcaseBaseView
 */
ZmBriefcaseIconView = function(params) {
	ZmBriefcaseBaseView.call(this, params);
	this.getHtmlElement().style.backgroundColor = "white";
}

ZmBriefcaseIconView.prototype = new ZmBriefcaseBaseView;
ZmBriefcaseIconView.prototype.constructor = ZmBriefcaseIconView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBriefcaseIconView.prototype.toString =
function() {
	return "ZmBriefcaseIconView";
};

// Data
ZmBriefcaseIconView.prototype._createItemHtml =
function(item, params) {
	
	var name = item.name;
	var contentType = item.contentType;
	
	if(contentType && contentType.match(/;/)) {
			contentType = contentType.split(";")[0];
	}
	var mimeInfo = contentType ? ZmMimeTable.getInfo(contentType) : null;
	icon = "Img" + ( mimeInfo ? mimeInfo.imageLarge : "UnknownDoc_48");

	if(item.isFolder) {
		icon = "ImgBriefcase_48";
	}
	
	if(name.length>14){
		name = name.substring(0,14)+"...";
	}
	
	var div = document.createElement("div");
	div.className = "ZmBriefcaseItemSmall";
	
	var htmlArr = [];
	var idx = 0;

	var icon = null;
	if (!icon) {
		var contentType = item.contentType;
		if(contentType && contentType.match(/;/)) {
			contentType = contentType.split(";")[0];
		}
		var mimeInfo = contentType ? ZmMimeTable.getInfo(contentType) : null;
		icon = mimeInfo ? mimeInfo.image : "UnknownDoc" ;
		if(item.isFolder){
			icon = "Folder";
		}
	}
	
	htmlArr[idx++] = "<table role='presentation'><tr>";
    if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
        htmlArr[idx++] = "<td>";
        idx = this._getImageHtml(htmlArr, idx, "CheckboxUnchecked", this._getFieldId(item, ZmItem.F_SELECTION));
        htmlArr[idx++] = "</td>";
    }
    htmlArr[idx++] = "<td><div class='Img";
	htmlArr[idx++] = icon;
	htmlArr[idx++] = "'></div></td><td nowrap>";
	htmlArr[idx++] = AjxStringUtil.htmlEncode(item.name);
	htmlArr[idx++] = "</td><tr></table>";
	
	if (params && params.isDragProxy) {
		Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
	}
	div.innerHTML = htmlArr.join("");
	
	this.associateItemWithElement(item, div);
	return div;
};

ZmBriefcaseIconView.prototype.set =
function(list, sortField, doNotIncludeFolders){

    doNotIncludeFolders = true;

    ZmBriefcaseBaseView.prototype.set.call(this, list, sortField, doNotIncludeFolders);

};
}
if (AjxPackage.define("zimbraMail.briefcase.view.ZmDetailListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * 
 */

/**
 * Creates the briefcase detail list view.
 * @class
 * This class represents the briefcase detail list view.
 * 
 * @param	{ZmControl}		parent		the parent
 * @param	{ZmBriefcaseController}	controller		the controller
 * @param	{DwtDropTarget}		dropTgt		the drop target
 * 
 * @extends		ZmBriefcaseBaseView
 */
ZmDetailListView = 	function(parent, controller, dropTgt) {

    this._controller = controller;

	var headerList = this._getHeaderList(parent);

	var params = {parent:parent, className:"ZmBriefcaseDetailListView",
				  view: controller.getCurrentViewId(),
				  controller:controller, headerList:headerList, dropTgt:dropTgt,
				  listLabel: ZmMsg.documentList};
	ZmBriefcaseBaseView.call(this, params);

    this.enableRevisionView(true);

    this._expanded = {};
    this._itemRowIdList = {};

	if (controller.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
		this.setDragSource(this._dragSrc);
	
		this._dropTgt = new DwtDropTarget("ZmDetailListView");
		this._dropTgt.markAsMultiple();
		this._dropTgt.addDropListener(this._dropListener.bind(this));
		this.setDropTarget(this._dropTgt);
	}
    // Finder to DetailView drag and drop
    this._initDragAndDrop();
};

ZmDetailListView.prototype = new ZmBriefcaseBaseView;
ZmDetailListView.prototype.constructor = ZmDetailListView;

ZmDetailListView.ROW_DOUBLE_CLASS	= "RowDouble";


ZmDetailListView.SINGLE_COLUMN_SORT = [
	{field:ZmItem.F_NAME, msg:"name"},
	{field:ZmItem.F_SIZE, msg:"size"},
	{field:ZmItem.F_DATE, msg:"date"}
];


/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmDetailListView.prototype.toString =
function() {
	return "ZmDetailListView";
};

// Constants

ZmDetailListView.KEY_ID = "_keyId";

ZmDetailListView.COLWIDTH_ICON = 20;

// Protected methods

ZmDetailListView.prototype.enableRevisionView =
function(enabled){
    this._revisionView = enabled;    
};

ZmDetailListView.prototype._changeListener =
function(ev){
    if(ev.event == ZmEvent.E_MOVE || ev.event == ZmEvent.E_DELETE){
        if (this.getDnDSelection() && this.getDnDSelection instanceof AjxVector)
            this.dragDeselect(this.getDnDSelection().get(0));
        else if (this.getDnDSelection())
            this.dragDeselect(this.getDnDSelection());
    }


    ZmBriefcaseBaseView.prototype._changeListener.call(this, ev);
    if (this._revisionView && ( ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE )) {
        var items = ev.getDetail("items") ? ev.getDetail("items") : [this._getItemFromEvent(ev)];
        for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
            this.collapse(item, true);
        }
    }
};

ZmDetailListView.prototype._getHeaderList =
function(parent) {
	// Columns: tag, name, type, size, date, owner, folder
	var headers = [];
	var view = this._view;
	if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
		headers.push(new DwtListHeaderItem({field:ZmItem.F_SELECTION, icon:"CheckboxUnchecked", width:ZmListView.COL_WIDTH_ICON,
											name:ZmMsg.selection}));
	}
    if(this.isMultiColumn()){

        if(this._revisionView){
            headers.push(new DwtListHeaderItem({field:ZmItem.F_EXPAND, icon: "NodeCollapsed", width:ZmDetailListView.COLWIDTH_ICON, name:ZmMsg.expand}));            
        }

        if (appCtxt.get(ZmSetting.TAGGING_ENABLED)) {
            headers.push(new DwtListHeaderItem({field:ZmItem.F_TAG, icon:"Tag", width:ZmDetailListView.COLWIDTH_ICON,
                name:ZmMsg.tag}));
        }
        headers.push(
                new DwtListHeaderItem({field:ZmItem.F_LOCK, icon: "Padlock", width:ZmDetailListView.COLWIDTH_ICON, name:ZmMsg.lock}),
                new DwtListHeaderItem({field:ZmItem.F_SHARES, icon: "SharedContact", width:ZmDetailListView.COLWIDTH_ICON, name:ZmMsg.lock}),
                new DwtListHeaderItem({field:ZmItem.F_TYPE, icon:"GenericDoc", width:ZmDetailListView.COLWIDTH_ICON, name:ZmMsg.icon}),
                new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg._name, sortable:ZmItem.F_NAME}),
                new DwtListHeaderItem({field:ZmItem.F_FILE_TYPE, text:ZmMsg.type, width:ZmMsg.COLUMN_WIDTH_TYPE_DLV}),
                new DwtListHeaderItem({field:ZmItem.F_SIZE, text:ZmMsg.size, width:ZmMsg.COLUMN_WIDTH_SIZE_DLV, sortable:ZmItem.F_SIZE}),
                new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.modified, width:ZmMsg.COLUMN_WIDTH_DATE_DLV, sortable:ZmItem.F_DATE}),
                new DwtListHeaderItem({field:ZmItem.F_FROM, text:ZmMsg.author, width:ZmMsg.COLUMN_WIDTH_OWNER_DLV}),
                new DwtListHeaderItem({field:ZmItem.F_FOLDER, text:ZmMsg.folder, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV}),
                new DwtListHeaderItem({field:ZmItem.F_VERSION, text:ZmMsg.version, width:ZmMsg.COLUMN_WIDTH_VERSION_DLV})
                );
    }else{
        headers.push(new DwtListHeaderItem({field:ZmItem.F_SORTED_BY, text:AjxMessageFormat.format(ZmMsg.arrangedBy, ZmMsg.name), sortable:ZmItem.F_NAME, resizeable:false}));
    }
	return headers;
};

ZmDetailListView.prototype._getHeaderToolTip =
function(field, itemIdx, isOutboundFolder) {

    var tooltip;
    if(field == ZmItem.F_EXPAND){
        tooltip = ZmMsg.expandCollapse;
    }else if(field == ZmItem.F_LOCK){
        tooltip = ZmMsg.fileLockStatus;
    }else if(field == ZmItem.F_DATE){
        tooltip = ZmMsg.sortByModified; 
    }else if(field == ZmItem.F_FROM){
        tooltip = ZmMsg.author;
    }else if(field == ZmItem.F_VERSION){
        tooltip = ZmMsg.latestVersion;
    }else if(field == ZmItem.F_NAME){
        tooltip = ZmMsg.sortByName;
    }else{
        tooltip = ZmBriefcaseBaseView.prototype._getHeaderToolTip.call(this, field, itemIdx, isOutboundFolder);
    }   
    return tooltip;
};


ZmDetailListView.prototype._getActionMenuForColHeader =
function(force) {

	if (!this.isMultiColumn()) {
		if (!this._colHeaderActionMenu || force) {
			this._colHeaderActionMenu = this._getSortMenu(ZmDetailListView.SINGLE_COLUMN_SORT, ZmItem.F_NAME);
		}
		return this._colHeaderActionMenu;
	}

	var menu = ZmListView.prototype._getActionMenuForColHeader.call(this, force);

	return menu;
};



ZmDetailListView.prototype._isExpandable =
function(item){
    return (!item.isFolder && !item.isRevision && parseInt(item.version) > 1 );
};

ZmDetailListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {

	if (field == ZmItem.F_SELECTION) {
		var icon = params.bContained ? "CheckboxChecked" : "CheckboxUnchecked";
		idx = this._getImageHtml(htmlArr, idx, icon, this._getFieldId(item, field));
    } else if (field == ZmItem.F_EXPAND) {
		idx = this._getImageHtml(htmlArr, idx, 
				this._isExpandable(item) ? (this._expanded[item.id] ? "NodeExpanded" : "NodeCollapsed" )
						: null, this._getFieldId(item, field));   
	} else if (field == ZmItem.F_TYPE) {
		htmlArr[idx++] = AjxImg.getImageHtml(item.getIcon());
	} else if (field == ZmItem.F_LOCK) {
		idx = this._getImageHtml(htmlArr, idx, (item.locked ? "Padlock" : "Blank_16") , this._getFieldId(item, field)); //AjxImg.getImageHtml(item.locked ? "Padlock" : "Blank_16");
	} else if (field == ZmItem.F_SHARES) {
		idx = this._getImageHtml(htmlArr, idx, (ZmDetailListView.showSharedIconOnFile(item) ? "SharedContact" : "Blank_16") , this._getFieldId(item, field));
	}  else if (field == ZmItem.F_VERSION) {
		htmlArr[idx++] = item.version;
	} else if (field == ZmItem.F_NAME || field == ZmItem.F_SUBJECT) {
		htmlArr[idx++] = "<div id='"+this._getFieldId(item, ZmItem.F_NAME)+"'>"+this._getDisplayName(item)+"</div>";
	} else if (field == ZmItem.F_FILE_TYPE) {
        if(item.isFolder){
            htmlArr[idx++] = ZmMsg.folder;
        }else{
            var mimeInfo = item.contentType ? ZmMimeTable.getInfo(item.contentType) : null;
            htmlArr[idx++] = mimeInfo ? mimeInfo.desc : "&nbsp;";
        }
	} else if (field == ZmItem.F_SIZE) {
	    htmlArr[idx++] = item.isFolder ? ZmMsg.folder : AjxUtil.formatSize(item.size);
	} else if (field == ZmItem.F_DATE) {
		if (item.contentChangeDate || item.modifyDate || item.createDate) {
			var displayDate;
			if (item.contentChangeDate) {
			    displayDate = item.contentChangeDate;
			} else if (item.modifyDate) {
				displayDate = item.modifyDate;
			} else {
				displayDate = item.createDate;
			}
			htmlArr[idx++] = AjxDateUtil.simpleComputeDateStr(displayDate);
		}
	} else if (field == ZmItem.F_FROM) {
        var creator = item.modifier || item.creator;
		creator = creator ? creator.split("@") : [""];
		var cname = creator[0];
		var uname = appCtxt.get(ZmSetting.USERNAME);
		if (uname) {
			var user = uname.split("@");
			if (creator[1] != user[1]) {
				cname = creator.join("@");
			}
		}
		htmlArr[idx++] = "<span style='white-space:nowrap'>";
		htmlArr[idx++] = cname;
		htmlArr[idx++] = "</span>";
	} else if (field == ZmItem.F_FOLDER) {
		var briefcase = appCtxt.getById(item.folderId);
		htmlArr[idx++] = briefcase ? briefcase.getName() : item.folderId;
	} else if (field == ZmItem.F_SORTED_BY){
        htmlArr[idx++] = this._getAbridgedContent(item, colIdx);
    } 
    else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}

	return idx;
};

ZmDetailListView.prototype._getDisplayName =
function(item){
    var subject;
    if(item.isRevision){
        subject = (item.subject);
    }else if(parseInt(item.version) > 1){
        subject = AjxMessageFormat.format(ZmMsg.briefcaseFileVersion, [AjxStringUtil.htmlEncode(item.name), item.version])
    }
    return subject || (AjxStringUtil.htmlEncode(item.name));
};

ZmDetailListView.prototype._getAbridgedContent =
function(item, colIdx) {

    var idx=0, html=[];
	var width = (AjxEnv.isIE || AjxEnv.isSafari) ? 22 : 16;
	
    html[idx++] = "<table role='presentation' width=100% class='TopRow'><tr>";

    if(this._revisionView){
        html[idx++] = "<td width=" + width + " id='" + this._getFieldId(item, ZmItem.F_FOLDER) + "'><center>";
        idx = this._getCellContents(html, idx, item, ZmItem.F_EXPAND, colIdx);
        html[idx++] = "</center></td>";
    }

	html[idx++] = "<td width=20 id='" + this._getFieldId(item, ZmItem.F_FOLDER) + "'><center>";
	html[idx++] = AjxImg.getImageHtml(item.getIcon());
	html[idx++] = "</center></td>";
	html[idx++] = "<td style='vertical-align:middle;' width=100% id='" + this._getFieldId(item, ZmItem.F_NAME) + "'>";
    html[idx++] = this._getDisplayName(item);
	html[idx++] = "</td>";

    html[idx++] = "<td style='vertical-align:middle;text-align:right;' width=40 id='" + this._getFieldId(item, ZmItem.F_SIZE) + "'>";
	idx = this._getCellContents(html, idx, item, ZmItem.F_SIZE, colIdx);
	html[idx++] = "</td>";

    html[idx++] = "<td style='text-align:right' width=" + width + " >";
    idx = this._getImageHtml(html, idx, item.getTagImageInfo(), this._getFieldId(item, ZmItem.F_TAG));
	html[idx++] = "</td>";

	html[idx++] = "</tr>";
    html[idx++] = "</table>";

    html[idx++] = "<table role='presentation' width=100% class='BottomRow'><tr>";
    html[idx++] = "<td style='padding-left:28px;' width=20 id='" + this._getFieldId(item, ZmItem.F_SHARES)+"'> ";
    idx = this._getImageHtml(html, idx, (ZmDetailListView.showSharedIconOnFile(item) ? "SharedContact" : "Blank_16") , this._getFieldId(item, ZmItem.F_SHARES));
    html[idx++] = "</td>";
    html[idx++] = "<td style='vertical-align:middle;'>";
    idx = this._getCellContents(html, idx, item, ZmItem.F_FROM, colIdx);
    html[idx++] = "<td style='vertical-align:middle;text-align:right;'>";
    idx = this._getCellContents(html, idx, item, ZmItem.F_DATE, colIdx);
    html[idx++] = "</td>";
    html[idx++] = "<td style='text-align:center;' width=" + width + " id='" + this._getFieldId(item, ZmItem.F_LOCK)+"'> ";
    idx =   this._getImageHtml(html, idx, (item.locked ? "Padlock" : "Blank_16") , this._getFieldId(item, ZmItem.F_LOCK));
	html[idx++] = "</td>";
    html[idx++] = "</tr></table>";

	return html.join('');
};

ZmDetailListView.showSharedIconOnFile =
function(item) {
	if (item.shares && item.shares.length > 0) {
		var folder = item.getFolder();
		if(folder._isRemote) {
			return folder._isAdmin;
		}
		return true;
	}
	return false;
};

ZmDetailListView.prototype._getDivClass =
function(base, item, params) {
	if (item.isRevision) {
	    return [base, "BriefcaseItemExpanded"].join(" ");
	} else {
		return ZmBriefcaseBaseView.prototype._getDivClass.apply(this, arguments);
	}
};

ZmDetailListView.prototype.expandItem =
function(item) {
	if (item && this._isExpandable(item) && this._revisionView) {
		this.parent._toggle(item);
	}
};

ZmDetailListView.prototype.expand =
function(item, revisions){

    if(!item || !revisions || revisions.size() == 0 ) return;

    this._addRevisionRows(item, revisions);
       
    this._setImage(item, ZmItem.F_EXPAND, "NodeExpanded");
    this._expanded[item.id] = true;
};

ZmDetailListView.prototype._addRevisionRows =
function(item, revisions){

    var rowIds = this._itemRowIdList[item.id];
    if (rowIds && rowIds.length && rowIds.length == revisions.size() && this._rowsArePresent(item)){
        this._showRows(rowIds, true);
    }else{
        var index = this._getRowIndex(item);
        this._itemRowIdList[item.id] = [];
        for(var i=0; i< revisions.size(); i++){
            var rev = revisions.get(i);
            var div = this._createItemHtml(rev);
            //check if item exists before adding row
            if (!document.getElementById(div.id))
                this._addRow(div, index+i+1);
            else
                this._showRows([div.id],true);
            this._itemRowIdList[item.id].push(div.id);
        }
    }
    
};

ZmDetailListView.prototype.collapse =
function(item, clear){
	var rowIds = this._itemRowIdList[item.id];
	this._showRows(rowIds, false);
	this._setImage(item, ZmItem.F_EXPAND, "NodeCollapsed");
	this._expanded[item.id] = false;
	if(clear && rowIds){
		var divId;
		var el;
		for (var i = 0; i < rowIds.length; i++) {
			divId = rowIds[i];
			el = document.getElementById(divId);
			if (el && el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
		this._itemRowIdList[item.id] = null;
	}
};

ZmDetailListView.prototype.collapseAll =
function(){
    var list = this.getItemList(), item;
    for(var id in this._expanded){
        if(this._expanded[id]){
            item = list.getById(id);
            if(item) this.collapse(item);
        }
    }
};

ZmDetailListView.prototype.refreshItem =
function(item){
     if(item && this._expanded[item.id]){
         var rowIds = this._itemRowIdList[item.id];
     }
};

ZmDetailListView.prototype._showRows =
function(rowIds, show){
   if (rowIds && rowIds.length) {
        for (var i = 0; i < rowIds.length; i++) {
            var row = document.getElementById(rowIds[i]);
            if (row) {
                Dwt.setVisible(row, show);
            }
        }
     }
};

ZmDetailListView.prototype._rowsArePresent =
function(item) {
	var rowIds = this._itemRowIdList[item.id];
	if (rowIds && rowIds.length) {
		for (var i = 0; i < rowIds.length; i++) {
			if (document.getElementById(rowIds[i])) {
				return true;
			}
		}
	}
	this._itemRowIdList[item.id] = [];	// start over
	this._expanded[item.id] = false;
	return false;
};



ZmDetailListView.prototype._allowFieldSelection =
function(id, field) {
	// allow left selection if clicking on blank icon
	if (field == ZmItem.F_EXPAND) {
		var item = appCtxt.getById(id);
		return (item && !this._isExpandable(item));
	} else {
		return ZmListView.prototype._allowFieldSelection.apply(this, arguments);
	}
};

// listeners

ZmDetailListView.prototype._sortColumn =
function(columnItem, bSortAsc) {

	// call base class to save the new sorting pref
	ZmBriefcaseBaseView.prototype._sortColumn.apply(this, arguments);

	var query = this._controller.getSearchString();
	var queryHint = this._controller.getSearchStringHint();

	if (this._sortByString && (query || queryHint)) {
		var params = {
			query:		query,
			queryHint:	queryHint,
			types:		[ZmItem.BRIEFCASE_ITEM],
			sortBy:		this._sortByString
		};
		appCtxt.getSearchController().search(params);
	}
};

ZmDetailListView.prototype.isMultiColumn =
function(controller) {
	var ctlr = controller || this._controller;
	return !ctlr.isReadingPaneOnRight();
};


ZmDetailListView.prototype.reRenderListView =
function(force) {
	var isMultiColumn = this.isMultiColumn();
	if (isMultiColumn != this._isMultiColumn || force) {
		this._saveState({selection:true, focus:true, scroll:true, expansion:true});
		this._isMultiColumn = isMultiColumn;
		this.headerColCreated = false;
		this._headerList = this._getHeaderList();
		this._rowHeight = null;
		this._normalClass = isMultiColumn ? DwtListView.ROW_CLASS : ZmDetailListView.ROW_DOUBLE_CLASS;
		var list = this._zmList || this.getList() || (new AjxVector());
		this.set(list);
		this._restoreState();
	}
};

ZmDetailListView.prototype.setSize =
function(width, height) {
	ZmListView.prototype.setSize.call(this, width, height);
	this._resetColWidth();
};

ZmDetailListView.prototype.resetSize =
function(newWidth, newHeight) {
	this.setSize(newWidth, newHeight);
	var height = (newHeight == Dwt.DEFAULT) ? newHeight : newHeight - DwtListView.HEADERITEM_HEIGHT;
	Dwt.setSize(this._parentEl, newWidth, height);
};

ZmDetailListView.prototype._resetColWidth =
function() {

	if (!this.headerColCreated) { return; }

	var lastColIdx = this._getLastColumnIndex();
    if (lastColIdx) {
        var lastCol = this._headerList[lastColIdx];
		if (lastCol._field != ZmItem.F_SORTED_BY) {
			DwtListView.prototype._resetColWidth.apply(this, arguments);
		}
	}
};

ZmDetailListView.prototype._getToolTip =
function(params) {

    if( params.field == ZmItem.F_LOCK){
        var item = params.item;
        if(item.locked){
            var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
            var subs = {
                title: ZmMsg.checkedOutFile,
                fileProperties:	[
                    {name: ZmMsg.checkoutTo, value:item.lockUser},
                    {name: ZmMsg.when, value: dateFormatter.format(item.lockTime)}
                ]
            };
            return AjxTemplate.expand("briefcase.Briefcase#Tooltip", subs);
        }
    }
    
	return ZmBriefcaseBaseView.prototype._getToolTip.call(this, params);
};

ZmDetailListView.prototype._folderChangeListener =
function(ev){

    // make sure this is current list view
	if (appCtxt.getCurrentController() != this._controller) { return; }

    ZmBriefcaseBaseView.prototype._folderChangeListener.call(this, ev);

    var organizers = ev.getDetail("organizers");
	var organizer = (organizers && organizers.length) ? organizers[0] : ev.source;
    var currentFolderId = this._controller._folderId;

    var refresh = false;
    if (ev.event == ZmEvent.E_CREATE) {
        if(organizer && currentFolderId == organizer.parent.id)
            refresh = true;
    }else if(ev.event == ZmEvent.E_MODIFY) {
        var fields = ev.getDetail("fields");        
        if( fields[ZmOrganizer.F_NAME] || fields[ZmOrganizer.F_COLOR] )
            refresh = true;
    }else if(ev.event == ZmEvent.E_MOVE || ev.event == ZmEvent.E_DELETE){
        refresh = true;
        if (this.getDnDSelection() && this.getDnDSelection instanceof AjxVector)
            this.dragDeselect(this.getDnDSelection().get(0));
        else if (this.getDnDSelection())
            this.dragDeselect(this.getDnDSelection());
        if(currentFolderId != organizer.id){
            this.collapseAll();
        }
    }

    if(refresh) {
        appCtxt.getApp(ZmApp.BRIEFCASE).search({folderId: currentFolderId});
    }
        
};

//drag and drop listeners
ZmDetailListView.prototype._dropListener =
function(ev) {
    var data = ev.srcData.data;
	var div = this.getTargetItemDiv(ev.uiEvent);
	var dropFolder = this.getItemFromElement(div);

    //handle drag from tree to listview by calling controller
    if (ev.srcData && ev.srcData.controller != appCtxt.getCurrentController()){
        appCtxt.getCurrentController()._dropListener(ev);
        return;
    }

	// only briefcase items can be dropped on us
	if (ev.action == DwtDropEvent.DRAG_ENTER) {
		ev.doIt = (dropFolder && (dropFolder instanceof ZmBriefcaseFolderItem) && (dropFolder.folder && dropFolder.folder.mayContain(data)));
		DBG.println(AjxDebug.DBG3, "DRAG_ENTER: doIt = " + ev.doIt);
        this.dragSelect(div);
	} else if (ev.action == DwtDropEvent.DRAG_DROP) {
        this.dragDeselect(div);
		appCtxt.getCurrentController()._doMove(data, dropFolder.folder);
	} else if (ev.action == DwtDropEvent.DRAG_LEAVE) {
		view.dragDeselect(div);
	} else if (ev.action == DwtDropEvent.DRAG_OP_CHANGED) {
		// nothing
	}

};

ZmDetailListView.prototype._dragListener =
function(ev) {
	if (ev.action == DwtDragEvent.SET_DATA) {
		ev.srcData = {data: ev.srcControl.getDnDSelection(), controller: this};
	}
};

ZmDetailListView.prototype._createHeader =
function(htmlArr, idx, headerCol, i, numCols, id, defaultColumnSort) {

	if (headerCol._field == ZmItem.F_SORTED_BY) {
		var field = headerCol._field;
		var textTdId = this._itemCountTextTdId = DwtId.makeId(this.view, ZmSetting.RP_RIGHT, "td");
		htmlArr[idx++] = "<td id='";
		htmlArr[idx++] = id;
		htmlArr[idx++] = "' class='";
		htmlArr[idx++] = (id == this._currentColId)	? "DwtListView-Column DwtListView-ColumnActive'" :
													  "DwtListView-Column'";
		htmlArr[idx++] = " width='auto'><table role='presentation' width='100%'><tr><td id='";
		htmlArr[idx++] = DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, field);
		htmlArr[idx++] = "' class='DwtListHeaderItem-label'>";
		htmlArr[idx++] = headerCol._label;
		htmlArr[idx++] = "</td>";

		// sort icon
		htmlArr[idx++] = "<td class='itemSortIcon' id='";
		htmlArr[idx++] = DwtId.getListViewHdrId(DwtId.WIDGET_HDR_ARROW, this._view, field);
		htmlArr[idx++] = "'>";
		htmlArr[idx++] = AjxImg.getImageHtml(this._bSortAsc ? "ColumnUpArrow" : "ColumnDownArrow");
		htmlArr[idx++] = "</td>";

		// item count text
		htmlArr[idx++] = "<td align=right class='itemCountText' id='";
		htmlArr[idx++] = textTdId;
		htmlArr[idx++] = "'></td></tr></table></div></td>";
	} else {
		return DwtListView.prototype._createHeader.apply(this, arguments);
	}
};

ZmDetailListView.prototype._initDragAndDrop =
function() {
    this._dnd = new ZmDragAndDrop(this);
};

ZmDetailListView.prototype._submitMyComputerAttachments =
function(files, node, isInline) {
	var selectionCallback = this._controller._uploadFileListener.bind(this._controller);
	var briefcaseApp = appCtxt.getApp(ZmApp.BRIEFCASE);
	briefcaseApp.initExternalDndUpload(files, node, isInline, selectionCallback);
};


ZmDetailListView.prototype._handleRename = function(item) {
	// Always collapse - should be harmless if already collapsed or has no versions.  We need
	// to insure any divs created for revisions are removed before moving the item - otherwise
	// they will be reused in their old location.
	this.collapse(item, true);

	this.removeItem(item);
	var indices = this._sortIndex(this._list, item);
	if (indices) {
		this.addItem(item, indices.displayIndex, false, indices.listIndex);
	}
	item._nameUpdated = false;
};


/**
 * Override the sorted Index calculation.  The DetailListView has a mismatch between its list
 * and the actual displayed rows, which can contain versions of a file.
 *
 * @param	{AjxVector}			list		  vector containing the file entries
 * @param	{ZmBriefcaseItem}	item		  file entry - find the position to insert it
 *
 * @return	Object                            See DwtListView.addItem
 *			{number}			displayIndex  the index at which to add item to list view
 *			{number}			listIndex	  index at which to add item to list
 */
ZmDetailListView.prototype._sortIndex = function(list, item){
	if (!list) {
		return null;
	}

	var lItem;
	var rowIds;
	var a = list.getArray();
	var displayIndex = 0;
	var itemName = item.name.toLowerCase();
	var i;
	for (i = 0; i < a.length; i++) {
		lItem = a[i];
		if (!lItem.isFolder && (itemName < lItem.name.toLowerCase())) {
			break;
		}
		rowIds = this._itemRowIdList[lItem.id];
		if (rowIds && rowIds.length) {
			displayIndex += rowIds.length + 1;
		} else {
			displayIndex++;
		}
	}
	// listIndex = insertion into the underlying list vector.
	// displayIndex:
	return { listIndex: i, displayIndex: displayIndex};
};
}
if (AjxPackage.define("zimbraMail.briefcase.view.ZmPreviewPaneView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmPreviewPaneView = function(parent, controller, dropTgt) {

	if (arguments.length == 0) { return; }

    var params = {};
    params.className = params.className || "ZmPreviewPaneView";
    params.parent = parent;
    params.controller = controller;
    params.posStyle = Dwt.ABSOLUTE_STYLE;
    DwtComposite.call(this, params);

	this._controller = controller;

	this._vertMsgSash = new DwtSash({parent:this, style:DwtSash.HORIZONTAL_STYLE, className:"AppSash-horiz",
									 threshold:ZmPreviewPaneView.SASH_THRESHOLD, posStyle:Dwt.ABSOLUTE_STYLE});
	this._vertMsgSash.registerCallback(this._sashCallback, this);

	this._horizMsgSash = new DwtSash({parent:this, style:DwtSash.VERTICAL_STYLE, className:"AppSash-vert",
									  threshold:ZmPreviewPaneView.SASH_THRESHOLD, posStyle:Dwt.ABSOLUTE_STYLE});
	this._horizMsgSash.registerCallback(this._sashCallback, this);

	this._previewView = new ZmPreviewView({parent:this, posStyle:DwtControl.ABSOLUTE_STYLE, controller: this._controller});
	
    this._detailListView = new ZmDetailListView(this, this._controller, this._controller._dropTgt );
    this._detailListView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
    this._listSelectionShortcutDelayAction = new AjxTimedAction(this, this._listSelectionTimedAction);
    this._delayedSelectionItem = null;
	this.setReadingPane();
};

ZmPreviewPaneView.prototype = new DwtComposite;
ZmPreviewPaneView.prototype.constructor = ZmPreviewPaneView;
ZmPreviewPaneView.LIST_SELECTION_SHORTCUT_DELAY = 300;

ZmPreviewPaneView.prototype.toString =
function() {
	return "ZmPreviewPaneView";
};

// consts

ZmPreviewPaneView.SASH_THRESHOLD = 5;
ZmPreviewPaneView._TAG_IMG = "TI";
ZmPreviewPaneView.REMOVE_FILE_BUTTON_ID = "ZmPreviewPaneViewButton";

// public methods

ZmPreviewPaneView.prototype.getController =
function() {
	return this._controller;
};

ZmPreviewPaneView.prototype.getTitle =
function() {
	return this._detailListView.getTitle();
};

ZmPreviewPaneView.prototype.getListView =
function() {
	return this._detailListView;
};

/**
 * Displays the reading pane, based on the current settings.
 */
ZmPreviewPaneView.prototype.setReadingPane =
function() {

	var tlv = this._detailListView, tv = this._previewView;
	var readingPaneEnabled = this._controller.isReadingPaneOn();
	if (!readingPaneEnabled) {
		tv.setVisible(false);
		this._vertMsgSash.setVisible(false);
		this._horizMsgSash.setVisible(false);
	} else {		
		tv.setVisible(true);
		var readingPaneOnRight = this._controller.isReadingPaneOnRight();
		var newSash = readingPaneOnRight ? this._vertMsgSash : this._horizMsgSash;
		var oldSash = readingPaneOnRight ? this._horizMsgSash : this._vertMsgSash;
		oldSash.setVisible(false);
		newSash.setVisible(true);
	}

	tlv.reRenderListView();


	tv.noTab = !readingPaneEnabled || AjxEnv.isIE;
	var sz = this.getSize();
	this._resetSize(sz.x, sz.y, true);
};

ZmPreviewPaneView.prototype.reRenderListView =
function(force){
    var tlv = this._detailListView;
    tlv.reRenderListView(force  );
    var sz = this.getSize();
	this._resetSize(sz.x, sz.y, true);
};

ZmPreviewPaneView.prototype.enableRevisionView =
function(enabled){
    this._detailListView.enableRevisionView(enabled);    
};

ZmPreviewPaneView.prototype.isRevisionViewEnabled =
function(){
    return this._detailListView._revisionView;  
};

ZmPreviewPaneView.prototype.resetPreviewPane =
function(newPreviewStatus, oldPreviewStatus){

	this._detailListView._colHeaderActionMenu = null;  //action menu needs to be recreated as it's different for different views

    this.setReadingPane();

    if(oldPreviewStatus == ZmSetting.RP_OFF){
        var items = this.getSelection();
        if(items.length > 0){
            this._previewView.set(items[0]);
        }else{
            this._selectFirstItem();
        }
    }
    
};

ZmPreviewPaneView.prototype.getPreviewView =
function() {
	return this._previewView;
};

ZmPreviewPaneView.prototype.getSelectionCount =
function() {
	return this._detailListView.getSelectionCount();
};

ZmPreviewPaneView.prototype.getSelection =
function() {
	return this._detailListView.getSelection();
};

ZmPreviewPaneView.prototype.reset =
function() {
	this._detailListView.reset();
	this._previewView.reset();
};

ZmPreviewPaneView.prototype.isPreviewPaneVisible =
function() {
	return this._previewView.getVisible();
};

ZmPreviewPaneView.prototype.setBounds =
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	this._resetSize(width, height);
};

ZmPreviewPaneView.prototype._resetSize =
function(newWidth, newHeight, force) {


	if (newWidth <= 0 || newHeight <= 0) { return; }
	if (!force && newWidth == this._lastResetWidth && newHeight == this._lastResetHeight) { return; }

	var readingPaneOnRight = this._controller.isReadingPaneOnRight();

	if (this.isPreviewPaneVisible()) {
		var sash = this.getSash();
		var sashSize = sash.getSize();
		var sashThickness = readingPaneOnRight ? sashSize.x : sashSize.y;
		if (readingPaneOnRight) {
			var listViewWidth = this._vertSashX || (Number(ZmMsg.LISTVIEW_WIDTH)) || Math.floor(newWidth / 2.5);
			this._detailListView.resetSize(listViewWidth, newHeight);
			sash.setLocation(listViewWidth, 0);
			this._previewView.setBounds(listViewWidth + sashThickness, 0,
									newWidth - (listViewWidth + sashThickness), newHeight);
		} else {
			var listViewHeight = this._horizSashY || (Math.floor(newHeight / 2) - DwtListView.HEADERITEM_HEIGHT);
			this._detailListView.resetSize(newWidth, listViewHeight);
			sash.setLocation(0, listViewHeight);
			this._previewView.setBounds(0, listViewHeight + sashThickness, newWidth,
									newHeight - (listViewHeight + sashThickness));
		}
	} else {
		this._detailListView.resetSize(newWidth, newHeight);
	}
	this._detailListView._resetColWidth();

	this._lastResetWidth = newWidth;
	this._lastResetHeight = newHeight;
};

ZmPreviewPaneView.prototype._sashCallback =
function(delta) {

	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	if (delta > 0) {
		if (readingPaneOnRight) {
			// moving sash right
			var minMsgViewWidth = 300;
			var currentMsgWidth = this._previewView.getSize(true).x;
			delta = Math.max(0, Math.min(delta, currentMsgWidth - minMsgViewWidth));
			var newListWidth = ((AjxEnv.isIE) ? this._vertMsgSash.getLocation().x : this._detailListView.getSize(true).x) + delta;
			if (delta > 0) {
				this._detailListView.resetSize(newListWidth, Dwt.DEFAULT);
				this._previewView.setBounds(this._previewView.getLocation().x + delta, Dwt.DEFAULT,
										currentMsgWidth - delta, Dwt.DEFAULT);
				
			} else {
				delta = 0;
			}
			
			
			
		} else {
			// moving sash down
			var newMsgViewHeight = this._previewView.getSize().y - delta;
			var minMsgViewHeight = 150;
			if (newMsgViewHeight > minMsgViewHeight) {
				this._detailListView.resetSize(Dwt.DEFAULT, this._detailListView.getSize(true).y + delta);
				this._previewView.setBounds(Dwt.DEFAULT, this._previewView.getLocation().y + delta,
							Dwt.DEFAULT, newMsgViewHeight);
			} else {
				delta = 0;
			}
		}
	} else {
		var absDelta = Math.abs(delta);

		if (readingPaneOnRight) {
			// moving sash left
			var currentWidth = this._vertMsgSash.getLocation().x;
			absDelta = Math.max(0, Math.min(absDelta, currentWidth - 300));

			if (absDelta > 0) {
				delta = -absDelta;
				this._detailListView.resetSize(currentWidth - absDelta, Dwt.DEFAULT);
				this._previewView.setBounds(this._previewView.getLocation().x - absDelta, Dwt.DEFAULT,
						this._previewView.getSize(true).x + absDelta, Dwt.DEFAULT);
			} else {
				delta = 0;
			}
		} else {
			// moving sash up
			if (!this._minMLVHeight) {
				var list = this._detailListView.getList();
				if (list && list.size()) {
					var item = list.get(0);
					var div = document.getElementById(this._detailListView._getItemId(item));
					this._minMLVHeight = DwtListView.HEADERITEM_HEIGHT + (Dwt.getSize(div).y * 2);
				} else {
					this._minMLVHeight = DwtListView.HEADERITEM_HEIGHT;
				}
			}

			if (this.getSash().getLocation().y - absDelta > this._minMLVHeight) {
				// moving sash up
				this._detailListView.resetSize(Dwt.DEFAULT, this._detailListView.getSize(true).y - absDelta);
				this._previewView.setBounds(Dwt.DEFAULT, this._previewView.getLocation().y - absDelta,
						Dwt.DEFAULT, this._previewView.getSize(true).y + absDelta);
			} else {
				delta = 0;
			}
		}
	}

	if (delta) {
		this._detailListView._resetColWidth();
		if (readingPaneOnRight) {
			this._vertSashX = this._vertMsgSash.getLocation().x;
		} else {
			this._horizSashY = this._horizMsgSash.getLocation().y;
		}
	}

	return delta;
};

ZmPreviewPaneView.prototype._selectFirstItem =
function() {
	var list = this._detailListView.getList();
	var selectedItem = list ? list.get(0) : null;
	if (selectedItem && !selectedItem.isFolder) {
		this._detailListView.setSelection(selectedItem);
	}else{
        this._previewView.enablePreview(false);
    }
};

ZmPreviewPaneView.prototype.getSash =
function() {
	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	return readingPaneOnRight ? this._vertMsgSash : this._horizMsgSash;
};

ZmPreviewPaneView.prototype.getLimit =
function(offset) {
	return this._detailListView.getLimit(offset);
};

ZmPreviewPaneView.prototype.set =
function(list, sortField) {
	this._detailListView.set(list, sortField);
    var list = this._detailListView._zmList;
    if(list)
        list.addChangeListener(new AjxListener(this, this._listViewChangeListener));
    this._previewView.set(null);
};

ZmPreviewPaneView.prototype._listViewChangeListener =
function(ev){
   
    var item = this._detailListView.getSelection();
    item = item && item[0];
    if(item){
         this._listSelectionListener(ev, item);
    }else{
         this._previewView.enablePreview(false);
    }
    
};

ZmPreviewPaneView.prototype._listSelectionTimedAction =
function() {
	if(!this._delayedSelectionItem) {
		return;
	}
	if (this._listSelectionShortcutDelayActionId) {
		AjxTimedAction.cancelAction(this._listSelectionShortcutDelayActionId);
	}
	this._previewView.set(this._delayedSelectionItem);
};

ZmPreviewPaneView.prototype._listSelectionListener = function (ev, item) {
	var item = item || ev.item;
	if (!item) {
		return;
	}

	var cs = appCtxt.isOffline && appCtxt.getCurrentSearch();
	if (cs) {
		appCtxt.accountList.setActiveAccount(item.getAccount());
	}
	var noChange = ev && ev._details && ev._details.oldFolderId == item.folderId;
	// Ignore (no preview change) if move to same folder, deletion, or multi-select (shift key)
	if ((ev.event === ZmEvent.E_MOVE && noChange) || ev.event === ZmEvent.E_DELETE || ev.shiftKey) {
		return;
	}

	if (ev.field == ZmItem.F_EXPAND && this._detailListView._isExpandable(item)) {
		this._detailListView.expandItem(item);
	} else if (item) {
		if (this._controller.isReadingPaneOn()) {
			if (ev.kbNavEvent) {
				if (this._listSelectionShortcutDelayActionId) {
					AjxTimedAction.cancelAction(this._listSelectionShortcutDelayActionId);
				}
				this._delayedSelectionItem = item;
				this._listSelectionShortcutDelayActionId = AjxTimedAction.scheduleAction(
					this._listSelectionShortcutDelayAction,
					ZmPreviewPaneView.LIST_SELECTION_SHORTCUT_DELAY
				);
			} else {
				this._previewView.set(item);
			}
		} else if (item.folderId == ZmFolder.ID_FILE_SHARED_WITH_ME) {
			var restUrl = item.getRestUrl();
			AjxRpc.invoke("", restUrl, null, this._handleNoPreviewUrlResponse.bind(this, item), true);
		}
	}
};

ZmPreviewPaneView.prototype._toggle =
function(item){
    if(this._detailListView._expanded[item.id]){
        this._detailListView.collapse(item);
    }else{
        this._expand(item);
    }   
};

ZmPreviewPaneView.prototype._expand =
function(item){
    var handleCallback = new AjxCallback(this, this._handleVersions, item);
    if(item && item instanceof ZmBriefcaseItem)
        item.getRevisions(handleCallback);
};

ZmPreviewPaneView.prototype._handleVersions =
function(item, result){
    result =  result.getResponse();
    result = result.ListDocumentRevisionsResponse.doc;

    var revisions = this._getRevisionItems(item, result);
    this._detailListView.expand(item, revisions);
};

ZmPreviewPaneView.prototype._getRevisionItems =
function(item, revisions){
    var revisionItems = [];
    for(var i=0; i<revisions.length; i++){
        var rev = revisions[i];
        var rItem = new ZmRevisionItem(this._getRevisionId(rev), item);
        rItem.set(rev);
        revisionItems.push(rItem);
    }
    return AjxVector.fromArray(revisionItems);
};

ZmPreviewPaneView.prototype._getRevisionId =
function(rev){
    return ( rev.id +'_'+(rev.version||rev.ver));    
};


ZmPreviewPaneView.prototype._restoreVerListener =
function(){
    var items = this._detailListView.getSelection();
    if(!items || items.length == 0) return;
    var verItem = items[0];
    this.restoreVersion(verItem);
};

ZmPreviewPaneView.prototype.restoreVersion =
function(verItem){
    if(verItem.isRevision){
        var item =  verItem.parent;
        if(item && item.version != verItem.revision ){
            item.restoreVersion(verItem.version, new AjxCallback(this, this.refreshItem, item));
        }
    }
};

ZmPreviewPaneView.prototype.deleteVersions =
function(items){
    items = items || this._detailListView.getSelection();
    if(!items || items.length == 0) return;

    var delVerBatchCmd = new ZmBatchCommand(true, null, true);
    for(var i=0; i<items.length; i++){
        delVerBatchCmd.add(new AjxCallback(this, this.deleteVersion, [items[i], delVerBatchCmd]));
    }
    delVerBatchCmd.run();
};

ZmPreviewPaneView.prototype.deleteVersion =
function(verItem, batchCmd){
    if(verItem.isRevision){
        var item =  verItem.parent;
        if(item && item.version != verItem.revision ){
            item.deleteVersion(verItem.version, new AjxCallback(this, this.refreshItem, item), batchCmd);
        }
    }
};

ZmPreviewPaneView.prototype.refreshItem =
function(item){
    this._detailListView.collapse(item, true);    
    this._expand(item);
};


//ZmPreviewView

/**
 * @overview
 * This file contains the Preview Pane View.
 */

/**
 * Creates a Preview view.
 * @class
 * This class represents the contact split view.
 *
 * @param	{Hash}	params		a hash of parameters
 * @extends	DwtComposite
 */

ZmPreviewView = function(params){

    if (arguments.length == 0) { return; }

    this._controller = params.controller;
	params.className = params.className || "ZmPreviewView";
    params.posStyle = Dwt.ABSOLUTE_STYLE;
	DwtComposite.call(this, params);

    this._initialize();

};

ZmPreviewView.prototype = new DwtComposite;
ZmPreviewView.prototype.constructor = ZmPreviewView;

ZmPreviewView.prototype.toString = 
function() {
	return "ZmPreviewView";	
};

ZmPreviewView.prototype._initialize =
function(){

    var htmlElId = this.getHTMLElId();
    this.getHtmlElement().innerHTML = AjxTemplate.expand("briefcase.Briefcase#PreviewView", {id:htmlElId});

    this._headerEl = document.getElementById(htmlElId+"_header");
    this._bodyEl   = document.getElementById(htmlElId+"_body");
    this._containerEl   = document.getElementById(htmlElId+"_container");

    //Create DWT IFrame
    var params = {
		parent: this,
		className: "PreviewFrame",
		id: htmlElId + "_iframe",
		hidden: false,
		html: AjxTemplate.expand("briefcase.Briefcase#NoPreview", {id:htmlElId}),
		noscroll: false,
		posStyle: DwtControl.STATIC_STYLE
	};
	
	
	this._iframePreview = new DwtIframe(params);
	this._iframePreviewId = this._iframePreview.getIframe().id;

    this._iframePreview.reparentHtmlElement(this._bodyEl);

    this._previewContainer = document.getElementById(htmlElId+"_filepreview");
    this._noresultContainer = document.getElementById(htmlElId+"_noitem");

    //Header Elements
    this._headerName = document.getElementById(this._htmlElId+"_name");
    this._headerImage = document.getElementById(this._htmlElId+"_image");   

    this._headerCreated = document.getElementById(this._htmlElId+"_created");
    this._headerCreator = document.getElementById(this._htmlElId+"_creator");
    this._headerModified = document.getElementById(this._htmlElId+"_modified");
    this._headerModifier = document.getElementById(this._htmlElId+"_modifier");
    this._headerLockTime = document.getElementById(this._htmlElId+"_lockTime");
    this._headerLockUser = document.getElementById(this._htmlElId+"_lockUser");

    this._headerNotesSection = document.getElementById(this._htmlElId+"_notes_section");
    this._headerNotes = document.getElementById(this._htmlElId+"_notes");
    this._headerExpand = document.getElementById(this._htmlElId+"_expand");

    this._lockStatus = document.getElementById(this._htmlElId+"_lock");

    Dwt.setHandler(this._headerExpand, DwtEvent.ONCLICK, AjxCallback.simpleClosure(this._toggleExpand, this));

    this._iframePreview.getIframe().onload = AjxCallback.simpleClosure(this._updatePreview, this);

    DwtShell.getShell(window).addControlListener(new AjxListener(this, function() { return this._onResize.apply(this, arguments); }));
    this.addControlListener(new AjxListener(this, function() { return this._onResize.apply(this, arguments); }));
};

ZmPreviewView._errorCallback =
function(errorCode, error){

    var previewView = window._zmPreviewView;
    previewView._handleError(previewView._previewItem, errorCode, error);

};

ZmPreviewView.prototype._handleError =
function(item, errorCode, error){

    this.enablePreview(true);

    if(item){

        var restUrl = item.getRestUrl();
        restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);

        //Try to generate, otherwise fallback
        if(ZmMimeTable.isRenderable(item.contentType)){
            this._iframePreview.setSrc(restUrl);
        }else if(ZmMimeTable.isMultiMedia(item.contentType)){
            html = [
                "<div style='height:100%;width:100%;text-align:center;vertical-align:middle;padding-top:30px;'>",
                "<embed src='",restUrl,"'/>",
                "</div>"
            ].join('');
            this._iframePreview.setIframeContent(html);
        }else{
            //Show Download Link
            var downloadLink = restUrl + (restUrl.match(/\?/) ? '&' : '?') + "disp=a";
            this._renderPreviewLink(ZmMsg.previewDownloadLink, downloadLink);
        }
        
    }    
};     

ZmPreviewView.prototype._handleDeleteSharedFile =
function(item) {
	this._controller._doDelete(item, true);
};

ZmPreviewPaneView.prototype._handleDeleteNoSuchFile =
function(item) {
	var ds = appCtxt.getYesNoMsgDialog();
	ds.reset();
	ds.registerCallback(DwtDialog.YES_BUTTON, this._controller._doDelete2, this._controller, [item, true]);
	ds.registerCallback(DwtDialog.NO_BUTTON, appCtxt.getAppController()._clearDialog, this, ds);
	var msg = AjxMessageFormat.format(ZmMsg.confirmDeleteMissingFile, AjxStringUtil.htmlEncode(item.name));
	ds.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
	ds.popup();
};

ZmPreviewPaneView.prototype._handleNoPreviewUrlResponse = function (item, response) {
	if (response.status == 404) {
		var listId = this._controller._listView[this._controller.getCurrentViewId()]._getFieldId(item, ZmItem.F_NAME);
		var name = document.getElementById(listId);
		name.setAttribute("class", "ZmSharedFileRemoved");
		if (!this._controller.isReadingPaneOn()) {
			this._handleDeleteNoSuchFile(item);
		}
	}
};

ZmPreviewView.prototype._handlePreviewUrlResponse =
function(item, restUrl, response) {
	var html =  AjxTemplate.expand("briefcase.Briefcase#sharedFileView", {id: ZmPreviewPaneView.REMOVE_FILE_BUTTON_ID});
	if (response.status == 404) {
		var listId = this._controller._listView[this._controller.getCurrentViewId()]._getFieldId(
			item,
			ZmItem.F_NAME
		);

		var name = document.getElementById(listId);
		name.setAttribute("class", "ZmSharedFileRemoved");
		this._iframePreview.setIframeContent(html);

		var iframeDoc = this._iframePreview && this._iframePreview.getDocument();
		var cssLink = document.createElement("link");
		cssLink.setAttribute("rel", "stylesheet");
		cssLink.setAttribute("type", "text/css");
		cssLink.setAttribute("href", "/css/zm.css");
		iframeDoc.head.appendChild(cssLink);
		var button = iframeDoc && iframeDoc.getElementById(ZmPreviewPaneView.REMOVE_FILE_BUTTON_ID);
		iframeDoc.body.style.backgroundColor = "white";

		if (button) {
			button.addEventListener("click", this._handleDeleteSharedFile.bind(this, item, true));
		}
		return;
	}
	
	restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);
	if (ZmMimeTable.isWebDoc(item.contentType)) {
		restUrl = restUrl + ( restUrl.match(/\?/) ? '&' : '?' ) + "viewonly=1";
	} else {
		this._setupLoading();
		restUrl = this._setupErrorCallback(restUrl);
		restUrl += ( restUrl.match(/\?/) ? '&' : '?' ) + "view=html";
	}

	this._iframePreview.setSrc(restUrl);
	Dwt.setLoadedTime("ZmBriefcaseItem"); //iframe src set but item may not be downloaded by browser
};

ZmPreviewView.prototype._setupErrorCallback =
function(url){

    if(!window._zmPreviewView)
        window._zmPreviewView = this;

    url = url + ( url.match(/\?/) ? '&' : '?' ) + "callback=ZmPreviewView._errorCallback";

    return url;
};

ZmPreviewView.prototype.set = function (item) {
	if (!item) {
		this.enablePreview(false);
		return;
	}

	if (item === this._previewItem) {
		return;
	}

	this._oldItem = this._previewItem;
	this._previewItem = item;
	this.enablePreview(true);

	this._previewContent = false;

	if (item.isFolder) {
		this._setFolder(item);
		return;
	}

	this._setHeader(item);

	var restUrl = item.getRestUrl();
	if (item.folderId == ZmFolder.ID_FILE_SHARED_WITH_ME) {
		AjxRpc.invoke("", restUrl, null, this._handlePreviewUrlResponse.bind(this, item, restUrl), true);
	} else {
		restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);
		if (ZmMimeTable.isWebDoc(item.contentType)) {
			restUrl = restUrl + (restUrl.match(/\?/) ? "&" : "?") + "viewonly=1";
		} else {
			this._setupLoading();

			restUrl = this._setupErrorCallback(restUrl);
			restUrl += (restUrl.match(/\?/) ? "&" : "?") + "view=html";
		}

		this._handleIframeContent(item, restUrl);
		Dwt.setLoadedTime("ZmBriefcaseItem"); //iframe src set but item may not be downloaded by browser
	}
};

ZmPreviewView.prototype._setupLoading =
function(){

    var html = [
        "<div style='height:100%;width:100%;text-align:center;vertical-align:middle;padding-top:30px;'>",ZmMsg.generatingPreview,"</div>"
    ].join('');
    try{
        this._iframePreview.setIframeContent(html);
    }catch(ex){
        //At times the previous item is not loaded or in the process of loading, causes iframe.body to be null.
        DBG.println("ZmPreviewView#_setupLoading");
        DBG.println("New Item:"+ this._previewItem.name );
		DBG.println("&nbsp;&nbsp;"+ex);
    }
};

ZmPreviewView.prototype._resetIframeHeight =
function(){
    var iframe = this._iframePreview.getIframe();
    var doc = this._iframePreview.getDocument();
    var origHeight = AjxEnv.isIE ? doc.body.scrollHeight : 0;
    var h = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, origHeight);
    iframe.style.height = h + "px";
    if (AjxEnv.isWebKitBased) {
        // bug: 39434, WebKit specific
        // After the iframe ht is set there is change is body.scrollHeight, weird.
        // So reset ht to make the entire body visible.
        var newHt = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
        if (newHt > h) {
            iframe.style.height = newHt + "px";
        }
    }
};

ZmPreviewView.prototype._setFolder =
function(item){

    this._cleanup();
    //Name
    this._headerName.innerHTML = AjxStringUtil.htmlEncode(item.name);
    //Briefcase icon
    this._headerImage.className = "ImgBriefcase_48";
    if(this._headerModifier)
        this._headerModifier.innerHTML = item.getOwner();
    this._setIframeContent(AjxTemplate.expand('briefcase.Briefcase#FolderPreview'));
};

ZmPreviewView.prototype._setIframeContent =
function(html){
    this._previewContent = html;
    this._iframePreview.setSrc('javascript:\"\";');
};

ZmPreviewView.prototype._updatePreview =
function(){
    if(this._previewContent){
        this._iframePreview.setIframeContent(this._previewContent);
        this._previewContent = false;
    }
	else {
	    var iframeDoc = this._iframePreview && this._iframePreview.getDocument();
	    if (!iframeDoc) {
		    return;
	    }
	    this._iframePreview._resetEventHandlers();  //for resizing reading pane on right
        var images = iframeDoc && iframeDoc.getElementsByTagName("img");
	    if (images && images.length) {
		    for (var i = 0; i <images.length; i++) {
			    var dfsrc = images[i].getAttribute("dfsrc");
			    if (dfsrc && dfsrc.match(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\_\.]*(\?\S+)?)?)?/)) {
				    // Fix for IE: Over HTTPS, http src urls for images might cause an issue.
				    try {
					    images[i].src = ''; //unload it first
					    images[i].src = dfsrc;
				    } catch (ex) {
					    // do nothing
				    }
			    }
		    }
	    }
    }
};


ZmPreviewView.prototype._handleIframeContent =
function(item, restUrl){
	if (item.contentType === 'application/pdf') {
		this._iframePreview.getIframe().setAttribute('sandbox', '');
		this._renderPreviewLink(ZmMsg.previewNewTabLink, restUrl);
	} else {
		this._iframePreview.getIframe().removeAttribute('sandbox');
		this._iframePreview.setSrc(restUrl);
	}
};

ZmPreviewView.prototype._renderPreviewLink = 
function(msg, link){
	this._iframePreview.setIframeContent([
		"<div style='height:100%;width:100%;text-align:center;vertical-align:middle;padding-top:30px;font-family: \'Helvetica Neue\',Helvetica,Arial,\'Liberation Sans\',sans-serif;'>",
		AjxMessageFormat.format(msg, link),
		"</div>"
	].join(''))
};

ZmPreviewView.prototype._cleanup =
function(){

    this._headerName.innerHTML = "";

    this._headerImage.className = "ImgUnknownDoc_48";

    if(this._headerModified)
        this._headerModified.innerHTML = "";
    if(this._headerCreated)
        this._headerCreated.innerHTML = "";
    if(this._headerCreator)
        this._headerCreator.innerHTML = "";
    if(this._lockStatus)
        this._lockStatus.innerHTML = AjxImg.getImageHtml("Blank_16");
    if(this._headerLockTime){
        this._headerLockTime.innerHTML = "";
    }
    if(this._headerLockUser){
        this._headerLockUser.innerHTML = "";
    }
    Dwt.setVisible(this._headerNotesSection, false);

    this._previewContent = false;

};

ZmPreviewView.prototype._setHeader =
function(item){

    //Name
    this._headerName.innerHTML = AjxStringUtil.htmlEncode(item.name);

    //Image icon
    var contentType = item.contentType;
    if(contentType && contentType.match(/;/)) {
        contentType = contentType.split(";")[0];
    }
    var mimeInfo = contentType ? ZmMimeTable.getInfo(contentType) : null;
    var icon = "Img" + ( mimeInfo ? mimeInfo.imageLarge : "UnknownDoc_48");
    this._headerImage.className = icon;

    //Modified & Created.  For Modified, use contentChangeDate, which is content modification (modifiedDate is
	// content and metaData changes).
    var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
    if (this._headerModified && item.contentChangeDate) {
        this._headerModified.innerHTML = dateFormatter.format(item.contentChangeDate);
	}
    if(this._headerModifier)
        this._headerModifier.innerHTML = item.modifier;
    if (this._headerCreated && item.createDate) {
        this._headerCreated.innerHTML = dateFormatter.format(item.createDate);
	}
    if(this._headerCreator)
        this._headerCreator.innerHTML = item.creator;

    if(this._lockStatus)
        this._lockStatus.innerHTML = AjxImg.getImageHtml(item.locked ? "Padlock" : "Blank_16");

    if(this._headerLockTime){
        if(item.locked){
            dateFormatter = AjxDateFormat.getDateInstance();
            this._headerLockTime.innerHTML = dateFormatter.format(item.lockTime);
        }else{
            this._headerLockTime.innerHTML = ""
        }        
    }

    if(this._headerLockUser){
        this._headerLockUser.innerHTML = item.locked ? item.lockUser : "";
    }

    this.setNotes(item);

    this._onResize();
};

ZmPreviewView.prototype.setNotes =
function(item){
    var visible = item.subject;
    Dwt.setVisible(this._headerNotesSection, visible);
    if(visible && this._headerNotes){
        this._headerNotes.innerHTML = AjxStringUtil.nl2br(item.subject);
    }
    this.expandNotes(false);
};

ZmPreviewView.prototype.expandNotes =
function(expand){

    this._expandState = expand;

    if(this._headerNotes){
        this._headerNotes.style.height = expand ? "" : "15px";
    }
    if(this._headerExpand){
       this._headerExpand.innerHTML = AjxImg.getImageHtml((expand ? "NodeExpanded" : "NodeCollapsed"));
    }
};

ZmPreviewView.prototype._toggleExpand =
function(){
    this.expandNotes(!this._expandState);
};

ZmPreviewView.prototype.downloadListener =
function(item){
    this._controller.downloadFile(item);
};

ZmPreviewView.prototype.emailListener =
function(item){
    this._controller.sendFilesAsAttachment(item);
};

ZmPreviewView.prototype.openListener =
function(item){
    this._controller.openFile(item);
};

ZmPreviewView.prototype.editListener =
function(item){
    this._controller.editFile(item);
};

ZmPreviewView.prototype.enablePreview =
function(enabled){
    if(enabled){
        Dwt.setDisplay(this._previewContainer, Dwt.DISPLAY_INLINE);
        Dwt.setDisplay(this._noresultContainer, Dwt.DISPLAY_NONE);
    }else{
        Dwt.setDisplay(this._previewContainer, Dwt.DISPLAY_NONE);
        Dwt.setDisplay(this._noresultContainer, Dwt.DISPLAY_INLINE);
    }
};

ZmPreviewView.prototype._onResize =
function() {
    if (this._containerEl && this._bodyEl) {
        // in order to adapt to decreasing sizes in IE, make the body
        // very small before getting its parent's size
        Dwt.setSize(this._bodyEl, 1, 1);

        var size = Dwt.getSize(this._containerEl);
        Dwt.setSize(this._bodyEl, size.x, size.y);
    }
};
}
if (AjxPackage.define("zimbraMail.briefcase.view.ZmNewBriefcaseDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the new briefcase dialog.
 * @class
 * This class represents the new briefcase dialog.
 * 
 * @param	{ZmControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		ZmNewOrganizerDialog
 */
ZmNewBriefcaseDialog = function(parent, className) {
	var title = ZmMsg.createNewBriefcaseItem;
	var type = ZmOrganizer.BRIEFCASE;
	ZmNewOrganizerDialog.call(this, parent, className, title, type);
}

ZmNewBriefcaseDialog.prototype = new ZmNewOrganizerDialog;
ZmNewBriefcaseDialog.prototype.constructor = ZmNewBriefcaseDialog;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmNewBriefcaseDialog.prototype.toString = 
function() {
	return "ZmNewBriefcaseDialog";
}

// Protected methods

// NOTE: don't show remote checkbox
ZmNewBriefcaseDialog.prototype._createRemoteContentHtml =
function(html, idx) {
	return idx;
};

/**
 * @private
 */
ZmNewBriefcaseDialog.prototype._setupFolderControl =
function(){
	ZmNewOrganizerDialog.prototype._setupFolderControl.call(this);
	if (this._omit) {
		this._omit[ZmFolder.ID_TRASH] = true;
	}
};
}
if (AjxPackage.define("zimbraMail.briefcase.view.ZmBriefcaseTreeView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the briefcase tree view class.
 *
 */

/**
 * Creates the briefcase tree view.
 * @class
 * This class is a view for the tree view used by the briefcase application, supporting external DnD
 *
 * @param	params		params passed to create TreeView
 *
 * @author Vince Bellows
 *
 * @extends		ZmTreeView
 */
ZmBriefcaseTreeView = function(params) {

	ZmTreeView.call(this,  params);
};

ZmBriefcaseTreeView.prototype = new ZmTreeView;
ZmBriefcaseTreeView.prototype.constructor = ZmBriefcaseTreeView;

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmBriefcaseTreeView.prototype.toString = function() {
	return "ZmBriefcaseTreeView";
};

ZmBriefcaseTreeView.prototype._submitMyComputerAttachments = function(files, node, isInline, ev) {
	var el = ev.target;
	var folderId;
	if (el != null) {
		// Walk up the parents and find one that has an associated folder id (if any)
		while ((el != null) && !folderId) {
			if (el.id) {
				folderId = this._idToOrganizer[el.id];
			}
			el = el.parentNode;
		}
	}
	if (folderId) {
		var briefcaseApp = appCtxt.getApp(ZmApp.BRIEFCASE);
		briefcaseApp.initExternalDndUpload(files, null, isInline, null, folderId);
	}
};


}
if (AjxPackage.define("zimbraMail.briefcase.view.dialog.ZmBriefcaseTabView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the briefcase tab view.
 * @class
 * This class represents the briefcase tab view.
 * 
 * @param	{ZmControl}		parent	the parent
 * @param	{String}		className		the class name
 * @param	{constant}		posStyle		the position style
 * 
 * @extends		DwtTabViewPage
 * 
 * @see			Dwt.STATIC_STYLE
 */
ZmBriefcaseTabView = function(parent,className,posStyle){
	this._app = appCtxt.getApp(ZmApp.BRIEFCASE);
	this.view = ZmId.VIEW_BRIEFCASE_ICON;
	DwtComposite.call(this,parent,className,Dwt.STATIC_STYLE);
    this._createHtml();
    this.showMe();
};

ZmBriefcaseTabView.prototype = new DwtComposite;
ZmBriefcaseTabView.prototype.constructor = ZmBriefcaseTabView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBriefcaseTabView.prototype.toString = function(){
    return "ZmBriefcaseTabView";
};

/**
 * Shows this view.
 * 
 */
ZmBriefcaseTabView.prototype.showMe =
function() {
    this.setSize(500, 295);
    this.showFolder(this._folderId || ZmOrganizer.ID_BRIEFCASE);
};

/**
 * Hides this view.
 * 
 */
ZmBriefcaseTabView.prototype.hideMe =
function() {
	this._itemCountText.setVisible(false);
};

//Create UI for Briefcase Tab UI
ZmBriefcaseTabView.prototype._createHtml =
function() {

    this._tableID = Dwt.getNextId();
    this._folderTreeCellId = Dwt.getNextId();
    this._folderListId = Dwt.getNextId();
    var html = [];
    var idx = 0;
    html[idx++] = ['<table role="presentation" class="ZmBriefcaseTabView_Table" id="', this._tableID, '" cellspacing="0" cellpadding="0" border="0">'].join("");
    html[idx++] = '<tr>';
    html[idx++] = ['<td width="30%" valign="top"  id="', this._folderTreeCellId, '">'].join("");
    html[idx++] = '</td>';
    html[idx++] = ['<td width="70%" valign="top" id="', this._folderListId, '">'].join("");
    html[idx++] = '</td>';
    html[idx++] = '</tr>';
    html[idx++] = '</table>';
    this.setContent(html.join(""));
    
    this.showBriefcaseTreeView();

	var loadCallback = new AjxCallback(this, this._createHtml1);
	AjxDispatcher.require(["BriefcaseCore", "Briefcase"], false, loadCallback);
};

ZmBriefcaseTabView.prototype._createHtml1 =
function() {

 	this._app = appCtxt.getApp(ZmApp.BRIEFCASE);
	var bc = this._controller = new ZmBriefcaseController(this._app._container, this._app);

    var params = {parent:bc._container, className:"BriefcaseTabBox BriefcaseList", view:this.view,
				  controller:bc};
    var lv = this._listView = this._controller._listView[this.view] = new ZmBriefcaseIconView(params);
	this._controller._currentViewId = this.view;
    lv.reparentHtmlElement(this._folderListId);
    Dwt.setPosition(lv.getHtmlElement(),Dwt.RELATIVE_STYLE);
};

ZmBriefcaseTabView.prototype.setSize =
function(width, height) {

    var treeWidth = width * 0.40;
    var listWidth = width - treeWidth;
    var newHeight = height - 15;
	if (this._overview) {
		this._overview.setSize(treeWidth, newHeight);
		this._listView.setSize(listWidth - 11, newHeight);
	}
	
    return this;
};

/**
 * Shows the folder.
 * 
 * @param	{String}	folderId		the folder id
 */
ZmBriefcaseTabView.prototype.showFolder =
function(folderId) {
    this._folderId = folderId;
    var callback = new AjxCallback(this, this.showFolderContents, [folderId]);
    var params = {
        folderId:folderId,
        callback:callback,
        noRender:true
    };
    if (appCtxt.multiAccounts) {
        params.accountName = appCtxt.getAppViewMgr().getCurrentView().getFromAccount().name;
    }
    this._app.search(params);
};

/**
 * Shows the folder contents.
 * 
 * @param	{String}	folderId		the folder id
 * @param	{Object}	results			the results
 */
ZmBriefcaseTabView.prototype.showFolderContents =
function(folderId, results) {
	var searchResult = results.getResponse();
	if (searchResult) {
		var list = this._controller._list = searchResult.getResults(ZmItem.BRIEFCASE_ITEM);
		this._controller._list.setHasMore(searchResult.getAttribute("more"));
		ZmListController.prototype.show.call(this._controller, searchResult, ZmId.VIEW_BRIEFCASE_ICON);
		this._listView.set(list);
        this._listView.focus();
		this._controller._setItemCountText();
	}
};

ZmBriefcaseTabView.prototype._handleKeys =
function(ev){
    var key = DwtKeyEvent.getCharCode(ev);
    return !DwtKeyEvent.IS_RETURN[key];
};

ZmBriefcaseTabView.prototype.gotAttachments =
function() {
    return false;
};

ZmBriefcaseTabView.prototype.uploadFiles =
function(attachDialog, docIds) {

    if (!docIds) {
        docIds = [];
        var items = this._listView.getSelection();
        if (!items || (items.length == 0)) {
            var attachDialog = appCtxt.getAttachDialog();
            attachDialog.setFooter(ZmMsg.attachSelectMessage);
            return;
        }
        for (var i in items) {
            docIds.push({id: items[i].id, ct: items[i].contentType, s: items[i].size});
        }
    }

	docIds = AjxUtil.toArray(docIds);

    var callback = attachDialog.getUploadCallback();
    if (callback) {
        callback.run(AjxPost.SC_OK, null, docIds);
    }
};

ZmBriefcaseTabView.prototype.showBriefcaseTreeView =
function() {

    //Force create deferred folders if not created
    var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
    var briefcaseApp = aCtxt.getApp(ZmApp.BRIEFCASE);
    briefcaseApp._createDeferredFolders();

    var base = this.toString();
    var acct = appCtxt.getActiveAccount();
    var params = {
        treeIds: [ZmOrganizer.BRIEFCASE],
        fieldId: this._folderTreeCellId,
        overviewId: (appCtxt.multiAccounts) ? ([base, acct.name].join(":")) : base,
        account: acct
    };
    this._setOverview(params);

};

ZmBriefcaseTabView.prototype._setOverview =
function(params) {
    var overviewId = params.overviewId;
    var opc = appCtxt.getOverviewController();
    var overview = opc.getOverview(overviewId);
    if (!overview) {
        var ovParams = {
            overviewId: overviewId,
            overviewClass: "BriefcaseTabBox",
            headerClass: "DwtTreeItem",
            noTooltips: true,
            treeIds: params.treeIds
        };
        overview = this._overview = opc.createOverview(ovParams);
        overview.set(params.treeIds);
        document.getElementById(params.fieldId).appendChild(overview.getHtmlElement());
        var treeView = overview.getTreeView(ZmOrganizer.BRIEFCASE);
        treeView.addSelectionListener(new AjxListener(this, this._treeListener));
        this._hideRoot(treeView);
    } else if (params.account) {
        overview.account = params.account;
    }
};

ZmBriefcaseTabView.prototype._treeListener =
function(ev) {
    if (ev.detail == DwtTree.ITEM_SELECTED) {
        var ti = ev.item;
        var folder = ti.getData(Dwt.KEY_OBJECT);
        if (folder) {
            this.showFolder(folder.id);
        }
    }
};

ZmBriefcaseTabView.prototype._hideRoot =
function(treeView) {
    var ti = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
    if (!ti) {
        var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT)
        ti = treeView.getTreeItemById(rootId);
    }
    ti.showCheckBox(false);
    ti.setExpanded(true);
    ti.setVisible(false, true);
};
}
if (AjxPackage.define("zimbraMail.briefcase.view.dialog.ZmCheckinDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
ZmCheckinDialog = function(parent, controller, className) {
	if (arguments.length == 0) return;
	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.checkInFileToBriefcase});

    this._controller = controller;

    this._createUploadHtml();

    this.getButton(DwtDialog.OK_BUTTON).setText(ZmMsg.checkIn);
    this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._upload));
};

ZmCheckinDialog.prototype = new DwtDialog;
ZmCheckinDialog.prototype.constructor = ZmCheckinDialog;

ZmCheckinDialog.prototype.popup =
function(item, callback){

    this._item = item;
    this._uploadCallback = callback;
    //this._uploadFolder = appCtxt.get(item.folderId);    

    this._verDiv.innerHTML = Number(item.version) + 1;
    this._fileTD.innerHTML = "";
    this._fileTD.innerHTML = [
        '<input type="file" name="file" id="',this._templateId,'_file" size="35"/>'
    ].join('');
    this._notes.value = "";

    DwtDialog.prototype.popup.call(this);
};

ZmCheckinDialog.prototype._createUploadHtml =
function(){
    this._templateId = Dwt.getNextId();
    var uri = appCtxt.get(ZmSetting.CSFE_UPLOAD_URI);
    this.setContent(AjxTemplate.expand("briefcase.Briefcase#CheckinDialog", {id: this._templateId, uri:uri}));
    this._verDiv = document.getElementById(this._templateId+"_version");
    this._fileTD = document.getElementById(this._templateId+"_fileTD");
    this._notes = document.getElementById(this._templateId+"_notes");
};

ZmCheckinDialog.prototype._upload = function(){
    var fileInput = document.getElementById(this._templateId+"_file");
    if(!fileInput.value) return;
    var item = this._item;
    var file = {
        fullname: fileInput.value,
        name: fileInput.value.replace(/^.*[\\\/:]/, ""),
        id: item.id,
        version: item.version,
        folder: item.folderId,
        notes: this._notes.value
    };

    var callback = new AjxCallback(this, this._uploadSaveDocs, file);

    this._initiateUpload(this._templateId+"_form", callback)

};

ZmCheckinDialog.prototype._initiateUpload =
function(formId, callback){

    this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, false);

	var uploadForm = document.getElementById(formId);

	var uploadMgr = appCtxt.getUploadManager();
	window._uploadManager = uploadMgr;
	try {
		uploadMgr.execute(callback, uploadForm);
	} catch (ex) {
		if (ex.msg) {
			this._popupErrorDialog(ex.msg);
		} else {
			this._popupErrorDialog(ZmMsg.unknownError);
		}
	}
};

ZmCheckinDialog.prototype._uploadSaveDocs = function(file, status, guid) {
	if (status != AjxPost.SC_OK) {
		appCtxt.getAppController().popupUploadErrorDialog(ZmItem.BRIEFCASE,
		                                                  status);
		this.setButtonEnabled(DwtDialog.OK_BUTTON, true );
		this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);
	} else {

        file.guid = guid;
		this._uploadSaveDocs2(file, status, guid);

	}
};

ZmCheckinDialog.prototype._uploadSaveDocs2 =
function(file, status, guid) {

    var json = {
		SaveDocumentRequest: {
			_jsns: "urn:zimbraMail",
			doc: {
				id:	    file.id,
                ver:    file.version,
                l:      file.folderId,
                name:   file.name,
                desc:   file.notes,
                upload: {
                    id: file.guid
                }
			}
		}
	};

    var callback = new AjxCallback(this, this._uploadSaveDocsResponse, [ file, status, guid ]);
    var params = {
        jsonObj:    json,
        asyncMode:  true,
        callback:   callback,
        errorCallback: new AjxCallback(this, this._handleSaveDocError, [file, status, guid])
    };
    appCtxt.getAppController().sendRequest(params);    
};

ZmCheckinDialog.prototype._handleSaveDocError =
function(file, status, guid, ex){

    this.setButtonEnabled(DwtDialog.OK_BUTTON, true );
    this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);

    if(ex.code == ZmCsfeException.MAIL_ALREADY_EXISTS){
        //Warning Message
        var warning = appCtxt.getMsgDialog();
        warning.reset();
        warning.setMessage(AjxMessageFormat.format(ZmMsg.itemWithFileNameExits, file.name), DwtMessageDialog.CRITICAL_STYLE, ZmMsg.briefcase);
        warning.popup();
        //Error Handled
        return true;
    }

    return false;
};        

ZmCheckinDialog.prototype._uploadSaveDocsResponse =
function(file, status, guid, response) {

    var resp = response && response._data;
    var saveDocResp = resp && resp.SaveDocumentResponse;

    if(saveDocResp){
        saveDocResp = saveDocResp.doc[0];
        file.done     = true;
        file.name     = saveDocResp.name;
        file.version  = saveDocResp.ver;

        this._finishUpload(file);
    }

    this.popdown();

    if (resp && resp.Fault) {
        var fault = resp.Fault;
        var error = fault.Detail.Error;
        var code = error.Code;
        //Handle Mailbox Exceeded Exception
        if(code == ZmCsfeException.MAIL_QUOTA_EXCEEDED){
            this._popupErrorDialog(ZmMsg.errorQuotaExceeded);
        }
    }

};

ZmCheckinDialog.prototype._finishUpload = function(file) {
	if(this._uploadCallback)
	    this._uploadCallback.run([file]);
};

ZmCheckinDialog.prototype._popupErrorDialog = function(message) {
	this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
	this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);

	var dialog = appCtxt.getMsgDialog();
	dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE, this._title);
	dialog.popup();
};
}
if (AjxPackage.define("zimbraMail.briefcase.controller.ZmBriefcaseController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the briefcase controller class.
 * 
 */

/**
 * Creates the briefcase controller.
 * @class
 * This class represents the briefcase controller for the content view used by the briefcase application.
 *
 * @author Parag Shah
 *
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						app							the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmListController
 */
ZmBriefcaseController = function(container, app, type, sessionId, searchResultsController) {

 	if (arguments.length == 0) { return; }

	ZmListController.apply(this, arguments);

	this._idMap = {};

	this._listChangeListener = this._fileListChangeListener.bind(this);
	
	this._listeners[ZmOperation.OPEN_FILE]			= this._openFileListener.bind(this);
	this._listeners[ZmOperation.SAVE_FILE]			= this._saveFileListener.bind(this);
	this._listeners[ZmOperation.SEND_FILE]			= this._sendFileListener.bind(this);
	this._listeners[ZmOperation.SEND_FILE_AS_ATT]	= this._sendFileAsAttachmentListener.bind(this);
	this._listeners[ZmOperation.NEW_FILE]			= this._uploadFileListener.bind(this);
	this._listeners[ZmOperation.VIEW_FILE_AS_HTML]	= this._viewAsHtmlListener.bind(this);
    this._listeners[ZmOperation.EDIT_FILE]			= this._editFileListener.bind(this);
    this._listeners[ZmOperation.RENAME_FILE]		= this._renameFileListener.bind(this);
    this._listeners[ZmOperation.DETACH_WIN]			= this._newWinListener.bind(this);

	this._listeners[ZmOperation.NEW_DOC]			= this._handleDoc.bind(this, ZmOperation.NEW_DOC);

    this._listeners[ZmOperation.CHECKIN]			= this._handleCheckin.bind(this);
    this._listeners[ZmOperation.CHECKOUT]			= this._checkoutListener.bind(this);
    this._listeners[ZmOperation.DISCARD_CHECKOUT]	= this._handleDiscardCheckout.bind(this);
    this._listeners[ZmOperation.RESTORE_VERSION]	= this._restoreVerListener.bind(this);

	if (this.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
	}

    this._parentView = {};
};

ZmBriefcaseController.prototype = new ZmListController;
ZmBriefcaseController.prototype.constructor = ZmBriefcaseController;

ZmBriefcaseController.prototype.isZmBriefcaseController = true;
ZmBriefcaseController.prototype.toString = function() { return "ZmBriefcaseController"; };

// Constants
ZmBriefcaseController._VIEWS = {};
ZmBriefcaseController._VIEWS[ZmId.VIEW_BRIEFCASE_DETAIL]	= "ZmPreviewPaneView";

ZmBriefcaseController.RP_IDS = [ZmSetting.RP_BOTTOM, ZmSetting.RP_RIGHT, ZmSetting.RP_OFF];

// reading pane options
ZmBriefcaseController.PREVIEW_PANE_TEXT = {};
ZmBriefcaseController.PREVIEW_PANE_TEXT[ZmSetting.RP_OFF]	= ZmMsg.previewPaneOff;
ZmBriefcaseController.PREVIEW_PANE_TEXT[ZmSetting.RP_BOTTOM]	= ZmMsg.previewPaneAtBottom;
ZmBriefcaseController.PREVIEW_PANE_TEXT[ZmSetting.RP_RIGHT]	= ZmMsg.previewPaneOnRight;

ZmBriefcaseController.PREVIEW_PANE_ICON = {};
ZmBriefcaseController.PREVIEW_PANE_ICON[ZmSetting.RP_OFF]	    = "SplitPaneOff";
ZmBriefcaseController.PREVIEW_PANE_ICON[ZmSetting.RP_BOTTOM]	= "SplitPane";
ZmBriefcaseController.PREVIEW_PANE_ICON[ZmSetting.RP_RIGHT]	    = "SplitPaneVertical";

// convert key mapping to view menu item
ZmBriefcaseController.ACTION_CODE_TO_MENU_ID = {};
ZmBriefcaseController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_OFF]		= ZmSetting.RP_OFF;
ZmBriefcaseController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_BOTTOM]	= ZmSetting.RP_BOTTOM;
ZmBriefcaseController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_RIGHT]	= ZmSetting.RP_RIGHT;

//List Views

ZmBriefcaseController.LIST_VIEW = {};
ZmBriefcaseController.LIST_VIEW[ZmId.VIEW_BRIEFCASE_DETAIL] =   {image: "GenericDoc", text: ZmMsg.byLatestFile };
ZmBriefcaseController.LIST_VIEW[ZmId.VIEW_BRIEFCASE_REVISION] = {image: "VersionHistory", text: ZmMsg.byVersionHistory };

/**
 * The list view as a whole is the drop target, since it's the lowest-level widget. Still, we
 * need to find out which item got dropped onto, so we get that from the original UI event
 * (a mouseup). The header is within the list view, but not an item, so it's not a valid drop
 * target. One drawback of having the list view be the drop target is that we can't exercise
 * fine-grained control on what's a valid drop target. If you enter via an item and then drag to
 * the header, it will appear to be valid.
 * 
 * @protected
 */
ZmBriefcaseController.prototype._dropListener =
function(ev) {
	var view = this._listView[this._currentViewId];
	var div = view.getTargetItemDiv(ev.uiEvent);
	var item = view.getItemFromElement(div);
	if(!item || !( item.isRevision || item.isFolder) ) {
		ZmListController.prototype._dropListener.call(this,ev);
	} else {
		ev.doIt = false;
	}
}

ZmBriefcaseController.prototype._standardActionMenuOps =
function() {
	return [ZmOperation.TAG_MENU, ZmOperation.DELETE, ZmOperation.MOVE];
};

/**
 * @private
 */
ZmBriefcaseController.prototype._getSecondaryToolBarOps =
function() {
	var list = [];
	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		list.push(ZmOperation.SEND_FILE, ZmOperation.SEND_FILE_AS_ATT, ZmOperation.SEP);
	}
	list.push(ZmOperation.DETACH_WIN, ZmOperation.SEP);

	list.push(ZmOperation.CHECKOUT, ZmOperation.CHECKIN, ZmOperation.DISCARD_CHECKOUT, ZmOperation.RESTORE_VERSION);

	list.push(ZmOperation.SEP);
	list.push(ZmOperation.RENAME_FILE);

	return list;
};


ZmBriefcaseController.prototype._getToolBarOps =
function() {
    var ops = [ZmOperation.NEW_FILE,
            ZmOperation.SAVE_FILE,
			ZmOperation.SEP,
            ZmOperation.EDIT_FILE,
			ZmOperation.SEP,
			ZmOperation.DELETE,
			ZmOperation.SEP,
			ZmOperation.MOVE_MENU,
			ZmOperation.TAG_MENU
			];

	/*if (appCtxt.get(ZmSetting.DOCS_ENABLED)) {
		   ops.push(ZmOperation.NEW_DOC,ZmOperation.SEP);
	}*/


	return ops;
};

ZmBriefcaseController.prototype._getRightSideToolBarOps =
function(noViewMenu) {
	return [ZmOperation.VIEW_MENU];
};


ZmBriefcaseController.prototype._handleDoc =
function(op) {
	this._app.handleOp(op);
};

ZmBriefcaseController.prototype._initializeToolBar =
function(view) {

	if (!this._toolbar[view]) {
		ZmListController.prototype._initializeToolBar.call(this, view);
		this._setupViewMenu(view, true);
        var toolbar = this._toolbar[view];
		toolbar.addFiller();
		this._initializeNavToolBar(view);
		appCtxt.notifyZimlets("initializeToolbar", [this._app, toolbar, this, view], {waitUntilLoaded:true});
	} else {
        this._setupDeleteButton(this._toolbar[view]);
        this._setupViewMenu(view, false);
	}
};

// If we're in the Trash folder, change the "Delete" button tooltip
ZmBriefcaseController.prototype._setupDeleteButton =
function(parent) {
    var folder = this._getSearchFolder();
    var inTrashFolder = (folder && folder.nId == ZmFolder.ID_TRASH);
    var tooltip = inTrashFolder ? ZmMsg.deletePermanentTooltip : ZmMsg.deleteTooltip;
    var deleteButton = parent.getButton(ZmOperation.DELETE);
    if(deleteButton){
        deleteButton.setToolTipContent(ZmOperation.getToolTip(ZmOperation.DELETE, this.getKeyMapName(), tooltip));
    }
};

ZmBriefcaseController.prototype._initializeNavToolBar =
function(view) {
	this._itemCountText[view] = this._toolbar[view].getButton(ZmOperation.TEXT);
};

ZmBriefcaseController.prototype._resetOperations =
function(parent, num) {
	if (!parent) { return; }

	// call base class
	ZmListController.prototype._resetOperations.call(this, parent, num);

	var items = this._listView[this._currentViewId].getSelection();
	var isFolderSelected=false, noOfFolders = 0, isRevisionSelected=false, isBriefcaseItemSelected=false, isMixedSelected=false;
    var isWebDocSelected= false, hasLocked = false, allLocked = true, sameLockOwner=true;
    var hasHighestRevisionSelected = false, hasOldRevisionSelected = false;
	if (items) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (item.isFolder) {
				isFolderSelected = true;
				noOfFolders++;
			}else if(item.isRevision){
                isRevisionSelected = true;
                if(item.parent.version == item.version){
                    hasHighestRevisionSelected = true;
                }
				else {
					hasOldRevisionSelected = true;
				}
            }else{
                isBriefcaseItemSelected = true;
            }

            isWebDocSelected = isWebDocSelected || ( !item.isFolder && item.isWebDoc() );

            allLocked = allLocked && item.locked;

            hasLocked = hasLocked || item.locked;

            sameLockOwner = sameLockOwner && (item.locked && item.lockUser == appCtxt.getActiveAccount().name);
		}
	}

    isMixedSelected = isFolderSelected ? (isBriefcaseItemSelected || isRevisionSelected) :  (isBriefcaseItemSelected && isRevisionSelected);

    var briefcase = appCtxt.getById(this._folderId);
    if(!(briefcase instanceof ZmBriefcase)){
        briefcase = null;
    }
    var isTrash = (briefcase && briefcase.nId == ZmOrganizer.ID_TRASH);
    var isShared = ((briefcase && briefcase.nId != ZmOrganizer.ID_TRASH && briefcase.isShared()));
	var isFileSharedWithMeFolder = this._folderId == ZmFolder.ID_FILE_SHARED_WITH_ME;
	var isReadOnly = briefcase ? briefcase.isReadOnly() : false;
	var isMultiFolder = (noOfFolders > 1);
	var isItemSelected = (num>0);
	var isZimbraAccount = appCtxt.getActiveAccount().isZimbraAccount;
	var isMailEnabled = appCtxt.get(ZmSetting.MAIL_ENABLED);
    var isAdmin = briefcase && briefcase.isAdmin(); 

	if (isFileSharedWithMeFolder) {
		parent.enable(ZmOperation.SAVE_FILE, num == 1);
		this.setFileOperations(parent, false);
		// Hide core file Open option for 'Files shared' with me folder
		if (parent && parent instanceof ZmActionMenu) {
			parent.getOp(ZmOperation.OPEN_FILE) && parent.getOp(ZmOperation.OPEN_FILE).setVisible(false);
		}
		return;
	} else {
		this.setFileOperations(parent, true);
	}

    var item = items[0];
    //bug 65351
    // treat the latest revision selection as if it was a file selection.
    // isOldRevision is true if the item is a revision but not the latest.
    var isOldRevision = hasOldRevisionSelected ? true : item && item.revision && !hasHighestRevisionSelected;
	
	parent.enable([ZmOperation.SEND_FILE, ZmOperation.SEND_FILE_AS_ATT], (isZimbraAccount && isMailEnabled && isItemSelected && !isMultiFolder && !isFolderSelected));
	parent.enable(ZmOperation.TAG_MENU, (!isReadOnly && isItemSelected && !isFolderSelected && !isOldRevision));
	parent.enable([ZmOperation.NEW_FILE, ZmOperation.VIEW_MENU], true);
	parent.enable([ZmOperation.NEW_DOC], true);
	parent.enable([ZmOperation.MOVE, ZmOperation.MOVE_MENU], ( isItemSelected &&  !isReadOnly && !isShared && !isOldRevision));
    parent.enable(ZmOperation.NEW_FILE, !(isTrash || isReadOnly));
    parent.enable(ZmOperation.DETACH_WIN, (isItemSelected && !isFolderSelected && num==1));

    var firstItem = items && items[0];
    var isWebDoc = firstItem && !firstItem.isFolder && firstItem.isWebDoc();
    var isLocked = firstItem && !firstItem.isFolder && firstItem.locked;
    var isLockOwner = isLocked && (item.lockUser == appCtxt.getActiveAccount().name);


    //Rename Operation
    parent.enable(ZmOperation.RENAME_FILE, ( num ==1 && !isFolderSelected && !isReadOnly && !isOldRevision && (isLocked ? isLockOwner : true) ));

    //Download - Files
    parent.enable(ZmOperation.SAVE_FILE, num >0 && (!isFolderSelected || isBriefcaseItemSelected));

    // Edit
    parent.enable(ZmOperation.OPEN_FILE, (num == 1 && isWebDoc));
    parent.enable(ZmOperation.EDIT_FILE, !isReadOnly && (  !isLocked || isLockOwner ) && isWebDoc && !isOldRevision && num == 1);

    //Delete Operation
    parent.enable(ZmOperation.DELETE, (!isReadOnly && isItemSelected && (hasHighestRevisionSelected ? !hasOldRevisionSelected : true) && !isMixedSelected && (isLocked ? isLockOwner : true)));

    if(parent &&  parent instanceof ZmActionMenu){

        //Open - webDocs
        parent.getOp(ZmOperation.OPEN_FILE) && parent.getOp(ZmOperation.OPEN_FILE).setVisible(isItemSelected && !isMultiFolder && isWebDoc);

	}
	//Case 1: Multiple Admins
	//Case 2: Stale Lock ( Handle exception )

	//Checkin
	var op = parent.getOp(ZmOperation.CHECKIN);
	if (op) {
		var checkinEnabled = !isReadOnly && isLockOwner && !isWebDoc && !isOldRevision;
		op.setVisible(checkinEnabled);
		parent.enable(ZmOperation.CHECKIN, checkinEnabled && num == 1);
	}

	//Checkout
	op = parent.getOp(ZmOperation.CHECKOUT);
	if (op) {
		var checkoutEnabled = !isReadOnly && !hasLocked && !isRevisionSelected && !isFolderSelected;
		op.setVisible(!isOldRevision && !isLocked);
		parent.enable(ZmOperation.CHECKOUT, checkoutEnabled);
	}

	//Discard Checkout
	op = parent.getOp(ZmOperation.DISCARD_CHECKOUT);
	if (op) {
		var discardCheckoutEnabled = sameLockOwner && !isRevisionSelected;
		op.setVisible(discardCheckoutEnabled);
		parent.enable(ZmOperation.DISCARD_CHECKOUT, discardCheckoutEnabled && (isAdmin || sameLockOwner || !isShared));
	}

	//Versioning
	op = parent.getOp(ZmOperation.RESTORE_VERSION);
	if (op) {
		var versionEnabled = (!isReadOnly && num == 1 && isOldRevision);
		var isHightestVersion = item && item.isRevision && ( item.parent.version == item.version );
		op.setVisible(isOldRevision);
		parent.enable(ZmOperation.RESTORE_VERSION, versionEnabled && !isHightestVersion);
	}

    var isDocOpEnabled = !(isTrash || isReadOnly);
    if (appCtxt.get(ZmSetting.DOCS_ENABLED)) {
        parent.enable(ZmOperation.NEW_DOC, isDocOpEnabled);
    }

    // ZmShare is not present when the virtual account loads
    AjxPackage.require("Briefcase");
	AjxPackage.require("Share");

    if (appCtxt.isExternalAccount() && items.length && isItemSelected) {

        var roleFromPerm = ZmShare.getRoleFromPerm(briefcase.perm);

        if (roleFromPerm === ZmShare.ROLE_NONE) {
            parent.enable ([ZmOperation.SEND_FILE,
                ZmOperation.SEND_FILE_AS_ATT,
                ZmOperation.RENAME_FILE,
                ZmOperation.MOVE,
                ZmOperation.MOVE_MENU,
                ZmOperation.NEW_FILE,
                ZmOperation.TAG_MENU,
                ZmOperation.EDIT_FILE,
                ZmOperation.OPEN_FILE,
                ZmOperation.CHECKIN,
                ZmOperation.CHECKOUT,
                ZmOperation.DISCARD_CHECKOUT,
                ZmOperation.RESTORE_VERSION,
                ZmOperation.DETACH_WIN,
                ZmOperation.DELETE
            ], false);
            parent.setItemVisible(ZmOperation.TAG_MENU, false);
        }
        else if (roleFromPerm === ZmShare.ROLE_MANAGER) {
            parent.enable ([
                ZmOperation.RENAME_FILE,
                ZmOperation.NEW_FILE,
                ZmOperation.OPEN_FILE,
                ZmOperation.CHECKIN,
                ZmOperation.CHECKOUT,
                ZmOperation.DISCARD_CHECKOUT,
                ZmOperation.DETACH_WIN,
                ZmOperation.DELETE
            ], true);
        }
    }
};

// Show / hide file toolbar and context menu options.
ZmBriefcaseController.prototype.setFileOperations =
function(parent, show) {
	var fileOperations = [
		ZmOperation.SEND_FILE,
		ZmOperation.SEND_FILE_AS_ATT,
		ZmOperation.RENAME_FILE,
		ZmOperation.MOVE,
		ZmOperation.MOVE_MENU,
		ZmOperation.NEW_FILE,
		ZmOperation.TAG_MENU,
		ZmOperation.EDIT_FILE,
		ZmOperation.CHECKIN,
		ZmOperation.CHECKOUT,
		ZmOperation.DISCARD_CHECKOUT,
		ZmOperation.RESTORE_VERSION,
		ZmOperation.DETACH_WIN,
		ZmOperation.SEP,
		ZmOperation.DELETE ];

	for (var i = 0; i < fileOperations.length; i++) {
		op = parent.getOp(fileOperations[i]);
		if (op) {
			op.setVisible(show);
		}
	}

	if (parent && parent instanceof ZmActionMenu) {
		for (var k=0; k< parent.opList.length; k++) {
			if (parent.opList[k] == "SEP") {
				parent._children._array[k].setVisible(show);
			}
		}
	}

	if (parent && parent instanceof ZmButtonToolBar) {
		parent.getActionsButton().setVisible(show);
	}
}

ZmBriefcaseController.prototype._getTagMenuMsg =
function() {
	return ZmMsg.tagFile;
};

ZmBriefcaseController.prototype._doDelete = function(items, hardDelete) {

	items = items || this._listView[this._currentViewId].getSelection();
    var item = items instanceof Array ? items[0] : items;
    if (!item) {
        return;
    }

	var message = items.length > 1 ? item.isRevision  ? ZmMsg.confirmPermanentDeleteItemList : ZmMsg.confirmDeleteItemList : null;
	if (!message) {
		if (hardDelete || this._folderId == String(ZmOrganizer.ID_TRASH) || (item.isRevision && item.parent.version !== item.version)) {
			var pattern = ZmMsg.confirmPermanentDeleteItem;
		}
		else {
			var pattern = ZmMsg.confirmDeleteItem;
		}
		var delMsgFormatter = new AjxMessageFormat(pattern);
		message = delMsgFormatter.format(AjxStringUtil.htmlEncode(item.name));
	}

    var dialog = appCtxt.getConfirmationDialog();
	if (AjxEnv.isIE || AjxEnv.isModernIE) {
		dialog.addPopupListener(ZmBriefcaseController._onDeleteDialogPopup);
	}
	dialog.popup(message, this._doDelete2.bind(this, items, hardDelete));
};

ZmBriefcaseController.prototype._doDelete2 = function(items, hardDelete) {

    var item = items instanceof Array ? items[0] : items,
        i;

    if (item.isRevision && item.parent.version !== item.version) {
        var view = this._parentView[this._currentViewId];
        view.deleteVersions(items);
    }
    else if (item.isFolder) {
        //Bug fix # 80600 force the BatchCommand to use JSON, mimicking the way right click delete behaves
        var delBatchCmd = new ZmBatchCommand(true, null, true), folder;
        for (i = 0; i < items.length; i++) {
            folder = items[i].folder;
            if (folder.isHardDelete()) {
                delBatchCmd.add(new AjxCallback(folder, folder._delete, [delBatchCmd]));
            }
            else {
                var trashFolder = appCtxt.getById(ZmFolder.ID_TRASH);
                delBatchCmd.add(new AjxCallback(folder, folder.move, [trashFolder, false, null, delBatchCmd]));
            }
        }
        delBatchCmd.run();
    }
    else {
		for (i = 0; i < items.length; i++) {
			if (items[i].isRevision) {
				items[i] = items[i].parent;
			}
		}
        ZmListController.prototype._doDelete.call(this, items, hardDelete, null, true);
    }
};

// view management

ZmBriefcaseController.getDefaultViewType =
function() {
	return ZmId.VIEW_BRIEFCASE_DETAIL;
};
ZmBriefcaseController.prototype.getDefaultViewType = ZmBriefcaseController.getDefaultViewType;

ZmBriefcaseController.prototype._createNewView =
function(view) {

	var viewType = appCtxt.getViewTypeFromId(view);
    var viewCtor = eval(ZmBriefcaseController._VIEWS[viewType]);
	this._parentView[view] = new viewCtor(this._container, this, this._dropTgt);
	var listView = this._parentView[view].getListView();
	if (this._dragSrc) {
		listView.setDragSource(this._dragSrc);
	}

	return listView;
};

ZmBriefcaseController.prototype._setViewContents =
function(view) {
	// If the controller is being used via the ZmBriefcaseTabView (for attaching briefcase files
	// to a mail message), then there is only a list view in use, not a parent with multiple views.
	if (this._parentView[view]) {
		this._parentView[view].set(this._list, this._switchView);
	}
    this._switchView = false;
};

ZmBriefcaseController.prototype._getDefaultFocusItem =
function() {
	return this._listView[this._currentViewId];
};

// Returns a list of subfolders of the given folder, as ZmBriefcaseItem objects
ZmBriefcaseController.prototype._getSubfolders =
function(folderId) {

	var folderId = folderId || this._currentSearch.folderId;
	var folder = folderId && appCtxt.getById(folderId);
	var subfolders = [];
	if (folder) {
		var children = folder.children;
		for (var i = 0, len = children.size(); i < len; i++) {
            folder = children.get(i);
            if(folder.type == ZmOrganizer.BRIEFCASE)
			    subfolders.push(new ZmBriefcaseFolderItem(children.get(i)));
		}
	}

	return subfolders;
};


// view management

/**
 * Shows the search results.
 * 
 * @param	{Object}	results		the search results
 */
ZmBriefcaseController.prototype.show =
function(results) {

	this._folderId = results && results.search && results.search.folderId;
	this.setList(results.getResults(ZmItem.BRIEFCASE_ITEM));
	this._list.setHasMore(results.getAttribute("more"));

	ZmListController.prototype.show.call(this, results, this._currentViewId);

	this._setup(this._currentViewId);

	// start fresh with search results
	var lv = this._listView[this._currentViewId];
	lv.offset = 0;
	lv._folderId = this._folderId;

	var elements = this.getViewElements(this._currentViewId, this._parentView[this._currentViewId]);

	this._setView({	view:		this._currentViewId,
					viewType:	this._currentViewType,
					noPush:		this.isSearchResults,
					elements:	elements,
					isAppView:	true});
	if (this.isSearchResults) {
		// if we are switching views, make sure app view mgr is up to date on search view's components
		appCtxt.getAppViewMgr().setViewComponents(this.searchResultsController.getCurrentViewId(), elements, true);
	}
	this._resetNavToolBarButtons();
};

ZmBriefcaseController.prototype.getFolderId = function() {
	return this._folderId;
}

/**
 * Change how briefcase items are displayed.
 * 
 * @param {constant}	view			the view to show
 * @param {Boolean}	force			if <code>true</code>, render view even if it's the current view
 */
ZmBriefcaseController.prototype.switchView =
function(view, force) {

	var viewChanged = (force || view != this._currentViewId);

	if (viewChanged) {
        var lv = this._listView[this._currentViewId];
        if (lv) {
			lv.cleanup();
		}
        this._switchView = true;
		this._currentViewId = view;
		this._setup(view);
	}
	this._resetOperations(this._toolbar[view], 0);

	if (viewChanged) {
		var elements = this.getViewElements(view, this._parentView[view]);
		
		this._setView({ view:		view,
						viewType:	this._currentViewType,
						elements:	elements,
						isAppView:	true});
		this._resetNavToolBarButtons();
	}
	Dwt.setTitle(this.getCurrentView().getTitle());
};

ZmBriefcaseController.prototype._preHideCallback =
function() {

    var lv = this._listView[this._currentViewId];
    if(lv) lv.cleanup();

    return ZmController.prototype._preHideCallback.call(this);
};

ZmBriefcaseController.prototype.getItemById =
function(itemId) {
	return (this._idMap[itemId] ? this._idMap[itemId].item : null);
};

ZmBriefcaseController.prototype.__popupUploadDialog =
function(title, callback) {


	var folderId = this._folderId;
    if(!folderId || folderId == ZmOrganizer.ID_TRASH)
        folderId = ZmOrganizer.ID_BRIEFCASE;
    
    if(this.chkFolderPermission(folderId)){
        var cFolder = appCtxt.getById(folderId);
		var uploadDialog = appCtxt.getUploadDialog();
         uploadDialog.popup(this, cFolder, callback, title, null, false, true, true, ZmBriefcaseApp.ACTION_KEEP_MINE);
    }	
};

ZmBriefcaseController.prototype.chkFolderPermission =
function(folderId){
    var briefcase = appCtxt.getById(folderId);
    if(briefcase.isRemote() && briefcase.isReadOnly()){
        var dialog = appCtxt.getMsgDialog();
        dialog.setMessage(ZmMsg.errorPermissionCreate, DwtMessageDialog.WARNING_STYLE);
        dialog.popup();
        return false;
    }
    return true;
};

ZmBriefcaseController.prototype._listSelectionListener =
function(ev) {
	Dwt.setLoadingTime("ZmBriefcaseItem");
	ZmListController.prototype._listSelectionListener.call(this, ev);

	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var item = ev.item;

        if(item.isFolder){
            this._app.search({folderId:item.id});
            return;
        }

		var restUrl = item.getRestUrl(false, false, true); //get it with the version number even if clicked on the base item (see ZmBriefcaseBaseItem.prototype.getRestUrl in ZmBriefcaseItem.js)
        //added for bug: 45150
        restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);
        if (item.isWebDoc()) {
            restUrl += (restUrl.match(/\?/) ? "&" : "?") + "localeId=" + AjxEnv.DEFAULT_LOCALE;

		}
		if (restUrl) {
            if(item.isDownloadable() && !this._alwaysOpenInNewWindow(item)) {
                this._downloadFile(restUrl);
            }else {
			    window.open(restUrl, this._getWindowName(item.name), item.isWebDoc() ? "" : ZmBriefcaseApp.getDocWindowFeatures());
            }
		}
	}
};

ZmBriefcaseController.prototype._alwaysOpenInNewWindow =
function(item){

    return (item.contentType == ZmMimeTable.APP_ADOBE_PDF && this.hasPDFReader())
            || (item.contentType == ZmMimeTable.TEXT_XML) || (item.contentType == ZmMimeTable.APP_XML);

};

ZmBriefcaseController.prototype.hasPDFReader =
function(){
    if(AjxUtil.isUndefined(this._hasPDFReader)){
        this._hasPDFReader = AjxPluginDetector.detectPDFReader();
    }
    return this._hasPDFReader;
}

ZmBriefcaseController.prototype._listActionListener =
function(ev) {

	var item = ev.item;

	if (item && item.isFolder) {
		ev.detail = DwtTree.ITEM_ACTIONED;
		var overviewController = appCtxt.getOverviewController();
		var treeController = overviewController.getTreeController(ZmOrganizer.BRIEFCASE);
		item.setData(ZmTreeView.KEY_TYPE, ZmOrganizer.BRIEFCASE);
		item.setData(Dwt.KEY_OBJECT, item.folder);
		item.setData(ZmTreeView.KEY_ID, this._app.getOverviewId());
		item.setData(Dwt.KEY_ID, item.id);
		treeController._treeViewListener(ev);
		return;
	}

	ZmListController.prototype._listActionListener.call(this, ev);

	var actionMenu = this.getActionMenu();
	actionMenu.popup(0, ev.docX, ev.docY);
	if (ev.ersatz) {
		actionMenu.setSelectedItem(0); // menu popped up via keyboard nav
	}

    
};

ZmBriefcaseController.prototype._restoreVerListener =
function(){
    var view = this._parentView[this._currentViewId];
    view._restoreVerListener();

};

//Checkin/Checkout

ZmBriefcaseController.prototype._checkoutListener =
function(){
     var items = this._getSelectedItems();
     if(items.length > 1){
        for(var i=0; i< items.length; i++){
           var item = items[i];
           if(item && item instanceof ZmBriefcaseItem){
                this.checkout(item);
           }
        }
     }else{
        var item = items[0];
        if(item && item instanceof ZmBriefcaseItem){
            this.checkout(item, item.isWebDoc() ? null : new AjxCallback(this, this._postCheckout, item));
        }
     }
};

ZmBriefcaseController.prototype._postCheckout =
function(item){
    if(AjxEnv.isSafari){
        setTimeout(AjxCallback.simpleClosure(this.downloadFile, this, item), 100);
    }else{
        this.downloadFile(item);
    }
};

ZmBriefcaseController.prototype._handleCheckin =
function(){    
    var item = this._getSelectedItem();
    if(item && item instanceof ZmBriefcaseItem){
        var dlg = this._getCheckinDlg();                                        
        dlg.popup(item, this._doneCheckin.bind(this, item));
    }
};

ZmBriefcaseController.prototype._doneCheckin =
function(item, files){
    //Update item attribs
	var file = files[0];
    item.version = file.version;
    item.name = file.name;
    this.unlockItem(item, new AjxCallback(this, this.refreshItem, item));

};

ZmBriefcaseController.prototype._handleDiscardCheckout =
function(){    
    var items = this._getSelectedItems();
    for(var i=0; i< items.length; i++){
        var item = items[i];
        if(item && item instanceof ZmBriefcaseItem)
            this.unlockItem(item);
    }
};

ZmBriefcaseController.prototype.refreshItem =
function(item){
    //TODO: Handle version notifications than hard refresh
    var view = this._parentView[this._currentViewId];
    view.refreshItem(item);
};

ZmBriefcaseController.prototype.checkout =
function(item, callback){        
    this.lockItem(item, callback);
};

ZmBriefcaseController.prototype.checkin =
function(item, callback){
    this.unlockItem(item, callback);
};

ZmBriefcaseController.prototype._initializeActionMenu = 
function () {
	ZmListController.prototype._initializeActionMenu.call(this);

	//notify Zimlet before showing
	appCtxt.notifyZimlets("onBriefcaseActionMenuInitialized", [this, this._actionMenu]);
};

ZmBriefcaseController.prototype.unlockItem =
function(item, callback){
   item.unlock(callback, new AjxCallback(this, this._handleErrorResponse, item)); 
};

ZmBriefcaseController.prototype.lockItem =
function(item, callback){
   item.lock(callback, new AjxCallback(this, this._handleErrorResponse, item));
};

ZmBriefcaseController.prototype._handleErrorResponse =
function(item, response){
    if(!(response && response.code)) return;

    var msg;
    switch(response.code){
        case ZmCsfeException.CANNOT_UNLOCK:
            msg = ZmMsg.unlockSufficientPermission;
            break;

        case ZmCsfeException.CANNOT_LOCK:
            msg = ZmMsg.lockSuffientPermissions;
            break;
    }

    if(msg){
        var dialog = appCtxt.getMsgDialog();
        dialog.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
        dialog.popup();
    }

    return msg;
};        

ZmBriefcaseController.prototype._getSelectedItem =
function(){
    var view = this._listView[this._currentViewId];
	var items = view.getSelection();    
    return ( items && items.length > 0 ) ? items[0] : null;
};

ZmBriefcaseController.prototype._getSelectedItems =
function(){
    var view = this._listView[this._currentViewId];
	return view.getSelection();
};

ZmBriefcaseController.prototype._getCheckinDlg =
function(){
    if(!this._checkinDlg){
       this._checkinDlg = new ZmCheckinDialog(appCtxt.getShell());
    }
    return this._checkinDlg;
};

ZmBriefcaseController.prototype._initializeActionMenu = 
function () {
	ZmListController.prototype._initializeActionMenu.call(this);

	//notify Zimlet before showing
	appCtxt.notifyZimlets("onBriefcaseActionMenuInitialized", [this, this._actionMenu]);
}

//End of Checkin/Checkout

ZmBriefcaseController.prototype._getActionMenuOps =
function() {
    var list = [
        ZmOperation.OPEN_FILE,
        ZmOperation.SAVE_FILE,
        ZmOperation.EDIT_FILE
    ];

    if (!appCtxt.isExternalAccount()) {
        list.push(ZmOperation.SEND_FILE);
        list.push(ZmOperation.SEND_FILE_AS_ATT);
    }

    list.push(ZmOperation.SEP);
    list.push(ZmOperation.CHECKOUT, ZmOperation.CHECKIN, ZmOperation.DISCARD_CHECKOUT, ZmOperation.RESTORE_VERSION/*, ZmOperation.DELETE_VERSION*/);

	list.push(ZmOperation.SEP);
	list = list.concat(this._standardActionMenuOps());
    list.push(ZmOperation.RENAME_FILE);
	return list;
};

ZmBriefcaseController.prototype._renameFileListener =
function(){

    var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }

    view.renameFile(items[0]);
};

ZmBriefcaseController.prototype._newWinListener =
function(){
    var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }
    items = AjxUtil.toArray(items);
    var item = items[0];
    if (item) {
        this.openFile(item);
    }
};


ZmBriefcaseController.prototype._editFileListener =
function() {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }
    items = AjxUtil.toArray(items);
    var item = items[0];
    if(item){
        this.editFile(item);
    }
};

ZmBriefcaseController.prototype.editFile =
function(items){
    items = AjxUtil.toArray(items);
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.isWebDoc()) {
			var win = appCtxt.getNewWindow(false, null, null, this._getWindowName(item.name));
	        if (win) {
	            win.command = "documentEdit";
	            win.params = {
					restUrl: item.getRestUrl(),
					id: item.id,
					name: item.name,
					folderId: item.folderId
				};
	        }
        }
    }
};

ZmBriefcaseController.prototype._getWindowName =
function(name){
    if(!name){
        return ZmMsg.briefcase;    
    }
    //IE does not like special chars as part of window name.
    return AjxEnv.isIE ? name.replace(/[^\w]/g,'') : name;    
};

ZmBriefcaseController.prototype._openFileListener =
function() {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }

    this.openFile(items);
};

ZmBriefcaseController.prototype.openFile =
function(items){
    items = AjxUtil.toArray(items);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var restUrl = item.getRestUrl(false, false, true);
		if (!restUrl) {
			continue;
		}
		restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);
		if (item.isWebDoc()) {
			//added for bug: 45150
			restUrl += (restUrl.match(/\?/) ? "&" : "?") + "localeId=" + AjxEnv.DEFAULT_LOCALE;
		} else {
            // do not try to
            //ZD doesn't support ConvertD.
			if (!ZmMimeTable.isRenderable(item.contentType) && !ZmMimeTable.isMultiMedia(item.contentType) && !appCtxt.isOffline) {
               	restUrl += (restUrl.match(/\?/) ? "&" : "?") + "view=html";
			}
        }

		var win = window.open(restUrl, this._getWindowName(item.name), item.isWebDoc() ? "" : ZmBriefcaseApp.getDocWindowFeatures());
        appCtxt.handlePopupBlocker(win);
	}
};

ZmBriefcaseController.prototype._saveFileListener =
function() {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }

	items = AjxUtil.toArray(items);

	// Allow download to only one file.
    this.downloadFile(items);
};

ZmBriefcaseController.prototype.downloadFile =
function(items){

    var restUrl, item, length= items.length;
    if(length > 1){
        var params = [];
        var organizer = appCtxt.getById(items[0].folderId);
        for(var i=0; i< length; i++){
            item = items[i];
	        if (!item.isFolder) {
				var itemId;
				if (appCtxt.isOffline && organizer.isShared()) {
					itemId = item.id;
				} else {
					itemId = item.getNormalizedItemId();
				}
				params.push((item.isRevision ? item.parent.id : itemId )+"."+item.version);
	        }
        }
        restUrl = [ ((organizer.isShared() && !appCtxt.isOffline ) ? organizer.getOwnerRestUrl() : organizer.getRestUrl()), "?fmt=zip&list=", params.join(',')].join('');
    }else{
        item = AjxUtil.isArray(items) ? items[0] : items;
        restUrl = item.getRestUrl();
        restUrl += ( restUrl.indexOf('?') == -1 ) ? "?" : "&";
        restUrl += "disp=a" + (item.version && item.folderId != ZmFolder.ID_FILE_SHARED_WITH_ME ? "&ver=" + item.version : "");
    }

    if (!restUrl) {
        return false;
    }
    restUrl = AjxStringUtil.fixCrossDomainReference(restUrl);
    if (restUrl) {
        this._downloadFile(restUrl)
    }
};

ZmBriefcaseController.prototype._downloadFile =
function(downloadUrl){
    if(downloadUrl){
        ZmZimbraMail.unloadHackCallback();
        location.href = downloadUrl;
    }
};

ZmBriefcaseController.prototype._viewAsHtmlListener =
function() {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	if (!items) { return; }

	items = AjxUtil.toArray(items);
	for (var i = 0; i<items.length; i++) {
		var item = items[i];
		var restUrl = item.getRestUrl();
		if (item && restUrl) {
			this.viewAsHtml(restUrl);
		}
	}
};

ZmBriefcaseController.prototype.viewAsHtml =
function(restUrl) {
	if (restUrl.match(/\?/)) {
		restUrl+= "&view=html";
	} else {
		restUrl+= "?view=html";
	}
	window.open(restUrl);
};

ZmBriefcaseController.prototype._uploadFileListener =
function() {
    this.__popupUploadDialog(ZmMsg.uploadFileToBriefcase, new AjxCallback(this, this._handlePostUpload));
};

ZmBriefcaseController.prototype.resetSelection = function() {
	var view = this._listView[this._currentViewId];
	if (view) {
		view.deselectAll();
	}
	var lv = this.getCurrentView();
	if (lv) {
		lv._selectFirstItem()
	}
}

ZmBriefcaseController.prototype._sendFileListener =
function(event) {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();
	items = AjxUtil.toArray(items);

	var names = [];
	var urls = [];
	var inNewWindow = this._app._inNewWindow(event);

	var briefcase, shares;
	var noprompt = false;

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		briefcase = appCtxt.getById(item.folderId);
		var url;
		if (briefcase.restUrl) {
			//present if the briefcase is a share from another user. In this case, keep that URL as the base.
			url = [briefcase.restUrl, "/", AjxStringUtil.urlComponentEncode(item.name)].join("")
		}
		else {
			//item is in this user's briefcase, so build the rest url.
			url = item.getRestUrl();
		}
		if (appCtxt.isOffline) {
			var remoteUri = appCtxt.get(ZmSetting.OFFLINE_REMOTE_SERVER_URI);
			url = remoteUri + url.substring((url.indexOf("/",7)));
		}
        
		urls.push(url);
		names.push(item.name);

		if (noprompt) { continue; }

		shares = briefcase && briefcase.shares;
		if (shares) {
			for (var j = 0; j < shares.length; j++) {
				noprompt = noprompt || shares[j].grantee.type == ZmShare.TYPE_PUBLIC;
			}
		}
	}

	if (!shares || !noprompt) {
		var args = [names, urls, inNewWindow];
		var callback = new AjxCallback(this, this._sendFileListener2, args);

		var dialog = appCtxt.getConfirmationDialog();
		dialog.popup(ZmMsg.errorPermissionRequired, callback);
	} else {
		this._sendFileListener2(names, urls);
	}
};

ZmBriefcaseController.prototype._sendFileListener2 =
function(names, urls, inNewWindow) {
	var action = ZmOperation.NEW_MESSAGE;
	var msg = new ZmMailMsg();
	var toOverride = null;
	var subjOverride = new AjxListFormat().format(names);
	var htmlCompose = appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT) == ZmSetting.COMPOSE_HTML;
	var extraBodyText = urls.join(htmlCompose ? "<br>" : "\n");
	AjxDispatcher.run("Compose", {action: action, inNewWindow: inNewWindow, msg: msg,
								  toOverride: toOverride, subjOverride: subjOverride,
								  extraBodyText: extraBodyText});
};

ZmBriefcaseController.prototype._sendFileAsAttachmentListener =
function(event) {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();

    this.sendFilesAsAttachment(items);	
};

ZmBriefcaseController.prototype.sendFilesAsAttachment =
function(items, callback){

    items = AjxUtil.toArray(items);
    var docInfo = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        docInfo.push({
            id:     ( item.isRevision ? item.parent.id : item.id ),
            ver:    ( item.isRevision ? item.version : null ),
            ct:     item.contentType,
            s:      item.size
        });
    }

    if (docInfo.length == 0) { return; }

    var action = ZmOperation.NEW_MESSAGE;
    var msg = new ZmMailMsg();
    var toOverride;

    var cc = AjxDispatcher.run("GetComposeController");
    cc._setView({action:action, msg:msg, toOverride:toOverride, inNewWindow:false});
    var draftType = ZmComposeController.DRAFT_TYPE_AUTO;
    var sendDocsCallback = new AjxCallback(cc, cc._handleResponseSaveDraftListener, [draftType, callback]);
    cc.saveDraft(draftType, null, docInfo, sendDocsCallback);
};

ZmBriefcaseController.prototype._resetOpForCurrentView =
function(num) {
	this._resetOperations(this._toolbar[this._currentViewId], num || 0);
};


ZmBriefcaseController.prototype._setupViewMenu =
function(view, firstTime) {

	var btn, menu;
	if (firstTime) {
		btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
		var menu = btn.getMenu();
		if (!menu) {
			menu = new ZmPopupMenu(btn);
			btn.setMenu(menu);

            this._setupPreviewPaneMenu(menu, btn);
		}
	}

    if(!menu){
       btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
       menu = btn && btn.getMenu();
    }
	
    this._resetPreviewPaneMenu(menu, view);
};

ZmBriefcaseController.prototype._setupPreviewPaneMenu =
function(menu, btn){

    if (menu.getItemCount() > 0) {
		new DwtMenuItem({parent:menu, style:DwtMenuItem.SEPARATOR_STYLE, id:"PREVIEW_SEPERATOR"});
	}

	var miParams = {text:ZmMsg.readingPaneAtBottom, style:DwtMenuItem.RADIO_STYLE, radioGroupId:"RP"};
	var ids = ZmDoublePaneController.RP_IDS;
	var pref = appCtxt.get(ZmSetting.READING_PANE_LOCATION_BRIEFCASE);
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (!menu._menuItems[id]) {
			miParams.text = ZmBriefcaseController.PREVIEW_PANE_TEXT[id];
			miParams.image = ZmBriefcaseController.PREVIEW_PANE_ICON[id];
            var mi = menu.createMenuItem(id, miParams);
			mi.setData(ZmOperation.MENUITEM_ID, id);
			mi.addSelectionListener(new AjxListener(this, this._previewPaneListener, id));
			if (id == pref) {
				mi.setChecked(true, true);
				btn.setImage(mi.getImage());
			}
		}
	}

};

ZmBriefcaseController.prototype._resetPreviewPaneMenu =
function(menu, view){
    view = view || this._currentViewId;
    var ids = ZmDoublePaneController.RP_IDS;
    for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (menu._menuItems[id]) {
            menu._menuItems[id].setEnabled(true);
        }
    }
};

/**
 * Checks if the reading pane is "on".
 *
 * @return	{Boolean}	<code>true</code> if the reading pane is "on"
 */
ZmBriefcaseController.prototype.isReadingPaneOn =
function() {
	return (this._getReadingPanePref() != ZmSetting.RP_OFF);
};

/**
 * Checks if the reading pane is "on" right.
 *
 * @return	{Boolean}	<code>true</code> if the reading pane is "on" right.
 */
ZmBriefcaseController.prototype.isReadingPaneOnRight =
function() {
	return (this._getReadingPanePref() == ZmSetting.RP_RIGHT);
};

ZmBriefcaseController.prototype._getReadingPanePref =
function() {
	return (this._readingPaneLoc || appCtxt.get(ZmSetting.READING_PANE_LOCATION_BRIEFCASE));
};

ZmBriefcaseController.prototype._setReadingPanePref =
function(value) {
	if (this.isSearchResults || appCtxt.isExternalAccount()) {
		this._readingPaneLoc = value;
	}
	else {
		appCtxt.set(ZmSetting.READING_PANE_LOCATION_BRIEFCASE, value);
	}
};

ZmBriefcaseController.prototype._previewPaneListener =
function(newPreviewStatus){
    var oldPreviewStatus = appCtxt.get(ZmSetting.READING_PANE_LOCATION_BRIEFCASE);
    this._setReadingPanePref(newPreviewStatus);
    var lv = this._parentView[this._currentViewId];
    lv.resetPreviewPane(newPreviewStatus, oldPreviewStatus);
	//update view button icon to reflect current selection
	var btn = this._toolbar[this._currentViewId].getButton(ZmOperation.VIEW_MENU);
	if (btn) {
		btn.setImage(ZmBriefcaseController.PREVIEW_PANE_ICON[newPreviewStatus]);
	}

};

ZmBriefcaseController.CONVERTABLE = {
	doc:/\.doc$/i,
	xls:/\.xls$/i,
	pdf:/\.pdf$/i,
	ppt:/\.ppt$/i,
	zip:/\.zip$/i,
    txt:/\.txt$/i
};

ZmBriefcaseController.prototype.isConvertable =
function(item) {
	var name = item.name;
	for (var type in ZmBriefcaseController.CONVERTABLE) {
		var regex = ZmBriefcaseController.CONVERTABLE[type];
		if (name.match(regex)) {
			return true;
		}
	}
	return false;
};

ZmBriefcaseController.prototype._fileListChangeListener =
function(ev) {
	if (ev.handled) { return; }
	var details = ev._details;
	if (!details) { return; }
	this._list._notify(ev.event,{items:details.items});
};

ZmBriefcaseController.prototype.getCurrentView =
function() {
	return this._parentView[this._currentViewId];
};
ZmBriefcaseController.prototype.getParentView = ZmBriefcaseController.prototype.getCurrentView;

ZmBriefcaseController.prototype._addListListeners =
function(colView) {
	colView.addActionListener(new AjxListener(this, this._listActionListener));
};

ZmBriefcaseController.prototype.isMultiColView =
function() {
	return (this._currentViewType == ZmId.VIEW_BRIEFCASE_COLUMN);
};

ZmBriefcaseController.prototype.mapSupported =
function(map) {
	return (map == "list" && (this._currentViewType != ZmId.VIEW_BRIEFCASE));
};

ZmBriefcaseController.prototype.getItemTooltip =
function(item, listView) {

	if (item.isFolder) { return null; }

	var prop = [{name:ZmMsg.briefcasePropName, value:item.name}];
	if (item.size) {
		prop.push({name:ZmMsg.briefcasePropSize, value:AjxUtil.formatSize(item.size)});
	}
	if (item.contentChangeDate) {
		var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM);
		var dateStr = dateFormatter.format(item.contentChangeDate);
		prop.push({name:ZmMsg.briefcasePropModified, value:dateStr});
	}

	var subs = {
		fileProperties: prop,
		tagTooltip: listView._getTagToolTip(item)
	};
	return AjxTemplate.expand("briefcase.Briefcase#Tooltip", subs);
};

ZmBriefcaseController.prototype._getDateInLocaleFormat =
function(date) {
	var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM);
	return dateFormatter.format(date);
};

ZmBriefcaseController.prototype._resetToolbarOperations =
function() {
	if (this._listView[this._currentViewId] != null) {
		this._resetOperations(this._toolbar[this._currentViewId], this._listView[this._currentViewId].getSelectionCount());
	}
};

// item count doesn't include subfolders
ZmBriefcaseController.prototype._getItemCount =
function() {
	var lv = this._listView[this._currentViewId];
	var list = lv && lv._list;
	if (!list) { return null; }
	var a = list.getArray();
	var num = 0;
	for (var i = 0, len = a.length; i < len; i++) {
		var item = a[i];
		if (item && item.type == ZmItem.BRIEFCASE_ITEM && !item.isFolder) {
			num++;
		}
	}
	return num;
};


ZmBriefcaseController.prototype.handleCreateNotify =
function(create){

    if(this.isMultiColView()){
        var isTrash = (this._folderId == String(ZmOrganizer.ID_TRASH));
        if(!isTrash)
            this.getCurrentView().handleNotifyCreate(create);
    }else{
        var list = this.getList();
        if (list) {
            var item = ZmBriefcaseItem.createFromDom(create, {list:list});
            if (list.search && list.search.matches(item)) {
                list.notifyCreate(create);
            }
        }
    }
};

ZmBriefcaseController.prototype.handleModifyNotify =
function(modifies){
    var view = this._listView[this._currentViewId];
    if (view) {
        var removeSelection = false;
        var selectedItems = view.getSelection();
        if (selectedItems.length) {
            var selectedItemIds = [];

            for (var i = 0; i < selectedItems.length; i++) {
                selectedItemIds.push(selectedItems[i].id);
            }

            for (var i = 0; i < modifies.doc.length; i++) {
                var modifiedDoc = modifies.doc[i];
                if ((typeof modifiedDoc.ver != 'undefined' || typeof modifiedDoc.loid != 'undefined') && selectedItemIds.indexOf(modifiedDoc.id) !== -1) {
                    removeSelection = true;
                    break;
                }
            }

            // Unselect item when user upload item with new version of selected item or perform Checkout/Checkin on item.
            if (removeSelection) {
                view.deselectAll();
            }
        }
    }
    this._resetToolbarOperations();
};

ZmBriefcaseController.prototype._actionErrorCallback =
function(ex){

    var handled = false;
    if(ex.code == ZmCsfeException.MAIL_ALREADY_EXISTS){
        handled = true;
        var dlg = appCtxt.getMsgDialog();
        dlg.setMessage(ZmMsg.errorFileAlreadyExistsResolution, DwtMessageDialog.WARNING_STYLE);
        dlg.popup();
    }

    return handled;
};


//Add to Briefcase

ZmBriefcaseController.prototype.createFromAttachment =
function(msgId, partId, name){

     var dlg = this._saveAttDialog = appCtxt.getChooseFolderDialog();
	 var chooseCb = new AjxCallback(this, this._chooserCallback, [msgId, partId, name]);
	 ZmController.showDialog(dlg, chooseCb, this._getCopyParams(dlg, msgId, partId));

};

ZmBriefcaseController.prototype._getCopyParams =
function(dlg, msgId, partId) {
	var params = {
		data:			{msgId:msgId,partId:partId},
		treeIds:		[ZmOrganizer.BRIEFCASE],
		overviewId:		dlg.getOverviewId(this._app._name),
		title:			ZmMsg.addToBriefcaseTitle,
		description:	ZmMsg.targetFolder,
		appName:		ZmApp.BRIEFCASE,
		noRootSelect:	true
	};
    params.omit = {};
    params.omit[ZmFolder.ID_DRAFTS] = true;
    params.omit[ZmFolder.ID_TRASH] = true;
    return params;
};

ZmBriefcaseController.prototype._chooserCallback =
function(msgId, partId, name, folder) {
    //TODO: Avoid using search, instead try renaming on failure
	var callback = new AjxCallback(this, this._handleDuplicateCheck, [msgId, partId, name, folder]);
	this._app.search({query:folder.createQuery(), noRender:true, callback:callback, accountName:(folder && folder.account && folder.account.name) || undefined});
};

ZmBriefcaseController.prototype._handleDuplicateCheck =
function(msgId, partId, name, folder, results) {

	var msg = appCtxt.getById(msgId);

	var briefcase = folder;
	if (briefcase.isReadOnly(folder.id)) {
		ZmOrganizer._showErrorMsg(ZmMsg.errorPermission);
		return;
	}

	if (msgId.indexOf(":") < 0) {
		msgId = msg.getAccount().id + ":" + msg.id;
	}


	var searchResult = results.getResponse();
	var items = searchResult && searchResult.getResults(ZmItem.BRIEFCASE_ITEM);
	if (items instanceof ZmList) {
		items = items.getArray();
	}

    var itemFound = false;
	for (var i = 0, len = items.length; i < len; i++) {
		if (items[i].name == name) {
			itemFound = items[i];
			break;
		}
	}

    var folderId = (!folder.account || folder.account == appCtxt.getActiveAccount() || (folder.id.indexOf(":") != -1)) ? folder.id : [folder.account.id, folder.id].join(":");
    if(itemFound){
        var dlg = this._conflictDialog = this._getFileConflictDialog();
        dlg.setButtonListener(DwtDialog.OK_BUTTON, this._handleConflictDialog.bind(this, msgId, partId, name, folderId, itemFound));
		dlg.setEnterListener(DwtDialog.OK_BUTTON, this._handleConflictDialog.bind(this, msgId, partId, name, folderId, itemFound));
	    this._renameField.value = "";
	    dlg.popup();
    }else{
       this._createFromAttachment(msgId, partId, name, folderId);
    }

    if(this._saveAttDialog.isPoppedUp())
        this._saveAttDialog.popdown();
};

ZmBriefcaseController.prototype._popupConflictDialog = 
function(dlg) {
	if (dlg) {
		dlg.popdown();
	}
	if (!this._conflictDialog) {
		this._conflictDialog = this._getFileConflictDialog();
	}
	this._conflictDialog.popup();
};

ZmBriefcaseController.prototype._handleConflictDialog =
function(msgId, partId, name, folderId, itemFound){

    var attribs = {};
    if(this._renameRadio.checked){
        var newName = this._renameField.value;
        var errorMsg = this.checkInvalidFileName(newName, itemFound && itemFound.name);
        if(errorMsg){
		    var dialog = appCtxt.getMsgDialog();
		    dialog.setMessage(errorMsg, DwtMessageDialog.WARNING_STYLE);
		    dialog.popup();
		    return false;
        }
        attribs.rename = newName;
    }else{
        attribs.id = itemFound.id;
        attribs.version = itemFound.version;
    }
	this._conflictDialog.popdown(); //hide dialog so user doesn't get it into a state that can be hung
    this._createFromAttachment(msgId, partId, name, folderId, attribs);
};

ZmBriefcaseController.prototype.checkInvalidFileName =
function(fileName, itemFound) {

    var message;
    fileName = fileName.replace(/^\s+/,"").replace(/\s+$/,"");

    if(fileName == ""){
        message = ZmMsg.emptyDocName;
    }
    else if (!ZmOrganizer.VALID_NAME_RE.test(fileName)) {
        message = AjxMessageFormat.format(ZmMsg.errorInvalidName, AjxStringUtil.htmlEncode(fileName));
    } 
    else if (fileName.length > ZmOrganizer.MAX_NAME_LENGTH){
        message = AjxMessageFormat.format(ZmMsg.nameTooLong, ZmOrganizer.MAX_NAME_LENGTH);
    }
	else if (itemFound === fileName) {
	    message = AjxMessageFormat.format(ZmMsg.errorFileExistsWarning, AjxStringUtil.htmlEncode(fileName));
    }

    return message;
};

ZmBriefcaseController.prototype._createFromAttachment =
function(msgId, partId, name, folderId, attribs){

    attribs = attribs || {};
    if(attribs.id || attribs.rename)
        attribs.callback = new AjxCallback(this, this._handleSuccessCreateFromAttachment, [msgId, partId, name, folderId]);
    if(attribs.rename)
        attribs.errorCallback = new AjxCallback(this, this._handleErrorCreateFromAttachment, [msgId, partId, attribs.rename, folderId]);

    var srcData = new ZmBriefcaseItem();
    srcData.createFromAttachment(msgId, partId, name, folderId, attribs);
};

ZmBriefcaseController.prototype._handleSuccessCreateFromAttachment =
function(msgId, partId, name, folderId, response){
    if(this._conflictDialog){
        this._renameField.value = "";
        this._conflictDialog.popdown();
    }
};

ZmBriefcaseController.prototype._handleErrorCreateFromAttachment =
function(msgId, partId, name, folderId, ex){

    var handled = false;
    if(ex.code == ZmCsfeException.MAIL_ALREADY_EXISTS){
        handled = true;
        var dlg = appCtxt.getMsgDialog();
        dlg.setMessage(AjxMessageFormat.format(ZmMsg.errorFileExistsWarning, name), DwtMessageDialog.WARNING_STYLE);
	    dlg.setButtonListener(DwtDialog.OK_BUTTON, this._popupConflictDialog.bind(this, dlg));
        dlg.popup();
    }

    return handled;
};

ZmBriefcaseController.prototype._getFileConflictDialog =
    function(){
        if(!this._nameConflictDialog){

            var dlg = new DwtMessageDialog({parent:appCtxt.getShell(), buttons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON],
                id: "Briefcase_FileConflictDialog"});
            this._nameConflictDialog = dlg;
            var id = this._nameConflictId = Dwt.getNextId();
            dlg.setTitle(ZmMsg.addToBriefcaseTitle);
            dlg.setContent(AjxTemplate.expand("briefcase.Briefcase#NameConflictDialog", {id: id}));

            this._renameRadio = document.getElementById(id+'_rename');
            this._renameField = document.getElementById(id+'_newname');

        }
        return this._nameConflictDialog;
    };

ZmBriefcaseController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_BRIEFCASE;
};

ZmBriefcaseController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG3, "ZmBriefcaseController.handleKeyAction");

    switch(actionCode) {

        case ZmKeyMap.READING_PANE_BOTTOM:
		case ZmKeyMap.READING_PANE_RIGHT:
		case ZmKeyMap.READING_PANE_OFF:
			var menuId = ZmBriefcaseController.ACTION_CODE_TO_MENU_ID[actionCode];
			this._previewPaneListener(menuId, true);
			break;

        default:
            return ZmListController.prototype.handleKeyAction.call(this, actionCode);
    }
    return true;
};

/**
 * Tag/untag items
 *
 * @private
 */
ZmBriefcaseController.prototype._doTag =
function(items, tag, doTag) {
	items = AjxUtil.toArray(items);
	if (!items.length) { return; }
	
	for (var i=0; i<items.length; i++) {
		if (items[i].isRevision) {
			items[i] = items[i].parent;
		}	
	}
	return ZmListController.prototype._doTag.call(this, items, tag, doTag);
};


/**
 * Moves a list of items to the given folder. Any item already in that folder is excluded.
 *
 * @param {Array}	items		a list of items to move
 * @param {ZmFolder}	folder		the destination folder
 * @param {Object}	attrs		the additional attrs for SOAP command
 * @param {Boolean}		isShiftKey	<code>true</code> if forcing a copy action
 * @param {Boolean}		noUndo	<code>true</code> undo not allowed
 * @private
 */
ZmBriefcaseController.prototype._doMove =
function(items, folder, attrs, isShiftKey, noUndo) {
	items = AjxUtil.toArray(items);
	if (!items.length) { return; }

	for (var i=0; i<items.length; i++) {
		if (items[i].isRevision) {
			items[i] = items[i].parent;
		}
	}
	return ZmListController.prototype._doMove.call(this, items, folder, attrs, isShiftKey, noUndo);
};

/**
 * Remove all tags for given items
 *
 * @private
 */
ZmBriefcaseController.prototype._doRemoveAllTags =
function(items) {

	items = AjxUtil.toArray(items);
	if (!items.length) { return; }

	for (var i=0; i<items.length; i++) {
		if (items[i].isRevision) {
			items[i] = items[i].parent;
		}
	}
	return ZmListController.prototype._doRemoveAllTags.call(this, items);
};

/*
** Using iframe provides a barrier to block any object below it
*/
ZmBriefcaseController._onDeleteDialogPopup = function(dialog) {
	var veilOverlay = appCtxt.getShell()._veilOverlay;
	if (!veilOverlay) {
		return;
	}
	var iframe = document.createElement("IFRAME");
	iframe.style.cssText = veilOverlay.style.cssText;
	iframe.style.zIndex = veilOverlay.style.zIndex - 1;
	document.body.appendChild(iframe);
	var onDeleteDialogPopdown = function(dialog) {
		iframe.parentNode.removeChild(iframe);
		dialog.removePopupListener(ZmBriefcaseController._onDeleteDialogPopup);
		dialog.removePopdownListener(onDeleteDialogPopdown);
	};
	dialog.addPopdownListener(onDeleteDialogPopdown);
};
}
if (AjxPackage.define("zimbraMail.briefcase.controller.ZmBriefcaseTreeController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the briefcase tree controller class.
 * 
 */

/**
 * Creates the briefcase tree controller.
 * @class
 * This class is a controller for the tree view used by the briefcase application.
 *
 * @param	{constant}	type		the organizer (see {@link ZmOrganizer.BRIEFCASE})
 * 
 * @author Parag Shah
 * 
 * @extends		ZmFolderTreeController
 */
ZmBriefcaseTreeController = function(type) {

	ZmFolderTreeController.call(this, (type || ZmOrganizer.BRIEFCASE));

	this._listeners[ZmOperation.NEW_BRIEFCASE] = new AjxListener(this, this._newListener);
	this._listeners[ZmOperation.SHARE_BRIEFCASE] = new AjxListener(this, this._shareBriefcaseListener);

	this._eventMgrs = {};
    this._app = appCtxt.getApp(ZmApp.BRIEFCASE);
};

ZmBriefcaseTreeController.prototype = new ZmFolderTreeController;
ZmBriefcaseTreeController.prototype.constructor = ZmBriefcaseTreeController;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBriefcaseTreeController.prototype.toString =
function() {
	return "ZmBriefcaseTreeController";
};

ZmBriefcaseTreeController.prototype.getItemActionMenu = function(ev, item) {
	var actionMenu = null;
	if (item.id != ZmFolder.ID_FILE_SHARED_WITH_ME) {
		actionMenu = ZmTreeController.prototype.getItemActionMenu.apply(this, arguments);
	}
	return actionMenu;
}

// Public methods

ZmBriefcaseTreeController.prototype.resetOperations =
function(actionMenu, type, id) {

	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
     if (actionMenu && id != rootId) {
		var briefcase = appCtxt.getById(id);
		if (!briefcase) { return; }
        var nId = ZmOrganizer.normalizeId(id);
		var isRoot = (nId == rootId);
		var isBriefcase = (nId == ZmOrganizer.getSystemId(ZmOrganizer.ID_BRIEFCASE));
		var isTopLevel = (!isRoot && briefcase.parent.id == rootId);
		var isLink = briefcase.link;
		var isLinkOrRemote = isLink || briefcase.isRemote();
        var isTrash = (nId == ZmFolder.ID_TRASH);
        var isReadOnly = briefcase ? briefcase.isReadOnly() : false;

        var deleteText = ZmMsg.del;

        actionMenu.getOp(ZmOperation.EMPTY_FOLDER).setVisible(isTrash);

        if (isTrash) {
            var hasContent = ((briefcase.numTotal > 0) || (briefcase.children && (briefcase.children.size() > 0)));
            actionMenu.enableAll(false);
            actionMenu.enable(ZmOperation.EMPTY_FOLDER,hasContent);
            actionMenu.getOp(ZmOperation.EMPTY_FOLDER).setText(ZmMsg.emptyTrash);            
        } else {
            actionMenu.enableAll(true);
            var showEditMenu = (!isLinkOrRemote || !isReadOnly || (isLink && isTopLevel) || ZmBriefcaseTreeController.__isAllowed(briefcase.parent, ZmShare.PERM_DELETE));
            actionMenu.enable(ZmOperation.DELETE_WITHOUT_SHORTCUT, showEditMenu && !isBriefcase);
            actionMenu.enable(ZmOperation.EDIT_PROPS, showEditMenu);

			var menuItem;
            menuItem = actionMenu.getMenuItem(ZmOperation.NEW_BRIEFCASE);
            menuItem.setText(ZmMsg.newFolder);
            menuItem.setImage("NewFolder");
            menuItem.setEnabled((!isLinkOrRemote || ZmBriefcaseTreeController.__isAllowed(briefcase, ZmShare.PERM_CREATE_SUBDIR) || briefcase.isAdmin() || ZmShare.getRoleFromPerm(briefcase.perm) == ZmShare.ROLE_MANAGER));

            if (appCtxt.get(ZmSetting.SHARING_ENABLED)) {
                isBriefcase = (!isRoot && briefcase.parent.id == rootId) || type==ZmOrganizer.BRIEFCASE;
                menuItem = actionMenu.getMenuItem(ZmOperation.SHARE_BRIEFCASE);
                menuItem.setText(ZmMsg.shareFolder);
                menuItem.setImage(isBriefcase ? "SharedMailFolder" : "Section");
                var isShareVisible = (!isLinkOrRemote || briefcase.isAdmin());
                if (appCtxt.isOffline) {
                    var acct = briefcase.getAccount();
                    isShareVisible = !acct.isMain && acct.isZimbraAccount;
                }
                menuItem.setEnabled(isShareVisible);
            }
        }
        var op = actionMenu.getOp(ZmOperation.DELETE_WITHOUT_SHORTCUT);
        if (op) {
            op.setText(deleteText);
        }
		this._enableRecoverDeleted(actionMenu, isTrash);

        // we always enable sharing in case we're in multi-mbox mode
        this._resetButtonPerSetting(actionMenu, ZmOperation.SHARE_BRIEFCASE, appCtxt.get(ZmSetting.SHARING_ENABLED));

	}

};

ZmBriefcaseTreeController.prototype._getAllowedSubTypes =
function() {
	return ZmTreeController.prototype._getAllowedSubTypes.call(this);
};

ZmBriefcaseTreeController.prototype._getSearchTypes =
function(ev) {
	return [ZmItem.BRIEFCASE_ITEM];
};

ZmBriefcaseTreeController.__isAllowed =
function(organizer, perm) {
	var allowed = true;
	if (organizer.link || organizer.isRemote()) {
		allowed = false; // change assumption to not allowed

		// REVISIT: bug 10801
		var share = organizer.getMainShare();
		if (share && !share.isPermRestricted(perm)) {
			allowed = share.isPermAllowed(perm);
		}
	}
	return allowed;
};

// Returns a list of desired header action menu operations
ZmBriefcaseTreeController.prototype._getHeaderActionMenuOps =
function() {
    var ops = [];
    if (!appCtxt.isExternalAccount()) {
        ops.push(ZmOperation.NEW_BRIEFCASE);
    }
    ops.push(ZmOperation.EXPAND_ALL);
	if (!appCtxt.isExternalAccount()) {
		ops.push(ZmOperation.FIND_SHARES);
	}
	return ops;
};

// Returns a list of desired action menu operations
ZmBriefcaseTreeController.prototype._getActionMenuOps =
function() {

	var ops = [
		ZmOperation.NEW_BRIEFCASE,
		ZmOperation.EMPTY_FOLDER,
		ZmOperation.RECOVER_DELETED_ITEMS
	];
	if (appCtxt.get(ZmSetting.SHARING_ENABLED)) {
		ops.push(ZmOperation.SHARE_BRIEFCASE);
	}
	ops.push(
		ZmOperation.DELETE_WITHOUT_SHORTCUT,
		ZmOperation.EDIT_PROPS
	);
	return ops;
};

ZmBriefcaseTreeController.prototype._getNewDialog =
function() {
	return appCtxt.getNewBriefcaseDialog();
};

/**
 * Gets the tree style.
 * 
 * @return	{constant}	the style
 * 
 * @see		DwtTree.SINGLE_STYLE
 */
ZmBriefcaseTreeController.prototype.getTreeStyle =
function() {
	return DwtTree.SINGLE_STYLE;
};

// Method that is run when a tree item is left-clicked
ZmBriefcaseTreeController.prototype._itemClicked =
function(folder) {
	appCtxt.getApp(ZmApp.BRIEFCASE).search({
        folderId:folder.id,
        callback: new AjxCallback(this, this._handleSearchResponse, [folder])
    });
};

// Listener callbacks

ZmBriefcaseTreeController.prototype._shareBriefcaseListener =
function(ev) {
	this._pendingActionData = this._getActionedOrganizer(ev);

	var briefcase = this._pendingActionData;
	var share = null;

	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (briefcase.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	var sharePropsDialog = appCtxt.getSharePropsDialog();
	sharePropsDialog.popup(ZmSharePropsDialog.NEW, briefcase, share);
};

ZmBriefcaseTreeController.prototype._notifyListeners =
function(overviewId, type, items, detail, srcEv, destEv) {
	if (this._eventMgrs[overviewId] && this._eventMgrs[overviewId].isListenerRegistered(type)) {
		if (srcEv) DwtUiEvent.copy(destEv, srcEv);
		destEv.items = items;
		if (items.length == 1) destEv.item = items[0];
		destEv.detail = detail;
		this._eventMgrs[overviewId].notifyListeners(type, destEv);
	}
};

ZmBriefcaseTreeController.prototype._doCreate =
function(params) {
	ZmTreeController.prototype._doCreate.apply(this, [params]);
};

ZmBriefcaseTreeController.prototype._getItems =
function(overviewId) {
	var treeView = this.getTreeView(overviewId);
	if (treeView) {
		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
		var root = treeView.getTreeItemById(rootId);
		if (root) {
			return root.getItems();
		}
	}
	return [];  
};

ZmBriefcaseTreeController.prototype.show =
function(params) {
	params.include = {};
	params.include[ZmFolder.ID_TRASH] = true;
    params.showUnread = false;
    var treeView = ZmFolderTreeController.prototype.show.call(this, params);

    treeView._controller = this;
    // Finder to BriefcaseTreeView drag and drop
    this._initDragAndDrop(treeView);

    return treeView;
};


/**
 * @private
 */
ZmBriefcaseTreeController.prototype._createTreeView = function(params) {
	return new ZmBriefcaseTreeView(params);
};


ZmBriefcaseTreeController.prototype._handleSearchResponse =
function(folder, result) {
    // bug fix #49568 - Trash is special when in Briefcase app since it
    // is a FOLDER type in BRIEFCASE tree. So reset selection if clicked
    if (folder.nId == ZmFolder.ID_TRASH) {
        this._treeView[this._app.getOverviewId()].setSelected(folder, true);
    }
};


ZmBriefcaseTreeController.prototype._initDragAndDrop = function(treeView) {
	this._dnd = new ZmDragAndDrop(treeView);
};
}
if (AjxPackage.define("ajax.util.AjxPluginDetector")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Does nothing (static class).
 * @constructor
 * @class
 * 
 * This class provides static methods to determine which standard plugins are
 * installed in the browser.
 *
 * @private
 */
AjxPluginDetector = function() {
}

AjxPluginDetector.canDetectPlugins =
function() {
	return AjxEnv.isIE || (navigator.plugins && navigator.plugins.length > 0);
};

AjxPluginDetector.detectFlash =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('ShockwaveFlash.ShockwaveFlash.1');
	} else {
		return AjxPluginDetector.detectPlugin('Shockwave','Flash'); 
	}
};

AjxPluginDetector.detectPDFReader =
function(){
    if(AjxEnv.isIE){
        return  ( AjxPluginDetector.detectActiveXControl('PDF.PdfCtrl.5')
                || AjxPluginDetector.detectActiveXControl('AcroExch.Document') );
    }else{
        var hasPDFReader = false;
        if(AjxEnv.isChrome){
            hasPDFReader = AjxPluginDetector.detectPlugin('Chrome PDF Viewer');
        }else if(AjxEnv.isFirefox){
            hasPDFReader = AjxPluginDetector.detectPlugin('Firefox PDF Plugin for Mac OS X');
        }
        if(!hasPDFReader){
            hasPDFReader = AjxPluginDetector.detectPlugin('Adobe Acrobat');
        }
        return hasPDFReader;
    }
};

AjxPluginDetector.detectDirector =
function() { 
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('SWCtl.SWCtl.1');
	} else {
		return AjxPluginDetector.detectPlugin('Shockwave','Director');
	}
};

AjxPluginDetector.detectQuickTime =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectQuickTimeActiveXControl();
	} else {
		return AjxPluginDetector.detectPlugin('QuickTime');
	}
};

// If quicktime is installed, returns the version as an array: [major, minor, build]
AjxPluginDetector.getQuickTimeVersion =
function() {
	if(AjxEnv.isIE) {
		var object = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1");
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Quicktime is " + object.IsQuickTimeAvailable(0) ? "available" : "not available");
		if (object.IsQuickTimeAvailable(0)) {
			try {
				var version = Number(object.QuickTimeVersion).toString(16);
				var result = [];
				for(var i = 0; i < 3; i++) {
					result[i] = Number(version.charAt(i));
				}
				return result;
			} catch(e) {
				DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Error while checking QuickTimeVersion: " + e);
			}
		}
		return null;
	} else {
		var match = AjxPluginDetector.matchPluginName(/QuickTime Plug-in (\d+)\.?(\d+)?\.?(\d+)?/);
		if (match) {
			DBG.println("AjxPluginDetector: able to find match for QuickTime plugin with version: " + match);
			var result = [];
			for(var i = 0; i < 3; i++) {
				result[i] = Number(match[i + 1] || 0);
			}
			return result;
		} else {
			DBG.println("AjxPluginDetector: unable to find match for QuickTime plugin with version");
			return null;
		}
	}
};

/**
 * This code is part of JQuery's Flash plugin.
 * http://jquery.lukelutman.com/plugins/flash/
 *
 * @return Flash plugin version
 */
AjxPluginDetector.getFlashVersion =
function() {
    var flashVersion = "0,0,0";
    // ie
    try {
        try {
            // avoid fp6 minor version lookup issues
            // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
            var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
            try {
                axo.AllowScriptAccess = 'always';
            }
            catch(e) {
                return '6,0,0';
            }
        } catch(e) {
            }
        flashVersion = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        // other browsers
    } catch(e) {
        try {
            if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                flashVersion = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
            }
        } catch(e) {
        }
    }
	return flashVersion;
};

AjxPluginDetector.detectReal =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('rmocx.RealPlayer G2 Control') ||
		       AjxPluginDetector.detectActiveXControl('RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)') ||
		       AjxPluginDetector.detectActiveXControl('RealVideo.RealVideo(tm) ActiveX Control (32-bit)');
	} else {
		return AjxPluginDetector.detectPlugin('RealPlayer');
	}
};

AjxPluginDetector.detectWindowsMedia =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('MediaPlayer.MediaPlayer.1');
	} else {
		return AjxPluginDetector.detectPlugin('Windows Media');
	}
};

AjxPluginDetector.detectPlugin =
function() {
	DBG.println(AjxDebug.DBG1, "-----------------------<br>AjxPluginDetector: Looking for plugin: [" + AjxPluginDetector._argumentsToString(AjxPluginDetector.detectPlugin.arguments) + "]");
	var names = AjxPluginDetector.detectPlugin.arguments;
	var allPlugins = navigator.plugins;
	var pluginsArrayLength = allPlugins.length;
	for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
	    // loop through all desired names and check each against the current plugin name
	    var numFound = 0;
	    for(var namesCounter=0; namesCounter < names.length; namesCounter++) {
			// if desired plugin name is found in either plugin name or description
			if (allPlugins[pluginsArrayCounter]) {
				if( (allPlugins[pluginsArrayCounter].name.indexOf(names[namesCounter]) >= 0)) {
					// this name was found
					DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found name match '" + allPlugins[pluginsArrayCounter].name + "'");
					numFound++;
				} else if (allPlugins[pluginsArrayCounter].description.indexOf(names[namesCounter]) >= 0) {
					// this name was found
					DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found description match '" + allPlugins[pluginsArrayCounter].description + "'");
					numFound++;
				}
			}
	    }
	    // now that we have checked all the required names against this one plugin,
	    // if the number we found matches the total number provided then we were successful
	    if(numFound == names.length) {
			DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Found plugin!<br>-----------------------");
			return true;
	    } else if (numFound) {
			DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Found partial plugin match, numFound=" + numFound);
		}
	}
	DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Failed to find plugin.<br>-----------------------");
	return false;
};

AjxPluginDetector.matchPluginName =
function(regExp) {
	var allPlugins = navigator.plugins;
	var pluginsArrayLength = allPlugins.length;
	for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
		var match = allPlugins[pluginsArrayCounter].name.match(regExp);
		if (match) {
			return match;
		}
	}
	return null;
};

AjxPluginDetector.detectActiveXControl =
function(progId) {
	try {
		new ActiveXObject(progId);
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found ActiveXObject '" + progId + "'");
		return true;
	} catch (e) {
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: unable to find ActiveXObject '" + progId + "'");
		return false;
	}
};

AjxPluginDetector.detectQuickTimeActiveXControl =
function(progId) {
	try {
		var object = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1");
		return object.IsQuickTimeAvailable(0);
	} catch (e) {
		return false;
	}
};

// Util method to log arguments, which to my surprise are not actually an array.
AjxPluginDetector._argumentsToString =
function(args) {
	var array = [];
	for (var i = 0, count = args.length; i < count; i++) {
		array[i] = args[i];
	}
	return array.join(',')
};
}
}
