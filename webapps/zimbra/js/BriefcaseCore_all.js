if (AjxPackage.define("BriefcaseCore")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: BriefcaseCore
 * 
 */
if (AjxPackage.define("zimbraMail.briefcase.model.ZmBriefcase")) {
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
 * @overview
 * This file contains the briefcase class.
 */

/**
 * Creates the briefcase 
 * @class
 * This class represents a briefcase. A briefcase contains briefcase items.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @param {int}	params.id			the numeric ID
 * @param {String}	params.name		the name
 * @param {ZmOrganizer}	params.parent		the parent organizer
 * @param {ZmTree}	params.tree		the tree model that contains this organizer
 * @param {constant}	params.color	the color for this briefcase
 * @param {String}	params.owner		the owner of this organizer
 * @param {String}	params.oname		the owner's name for this organizer
 * @param {String}	[params.zid]		the Zimbra id of owner, if remote share
 * @param {String}	[params.rid]		the Remote id of organizer, if remote share
 * @param {String}	[params.restUrl]	the REST URL of this organizer.
 * 
 * @extends		ZmFolder
 */
ZmBriefcase = function(params) {
	params.type = ZmOrganizer.BRIEFCASE;
	ZmFolder.call(this, params);
}

ZmBriefcase.prototype = new ZmFolder;
ZmBriefcase.prototype.constructor = ZmBriefcase;

// Constants

ZmBriefcase.PAGE_INDEX = "_Index";
ZmBriefcase.PAGE_CHROME = "_Template";
ZmBriefcase.PAGE_CHROME_STYLES = "_TemplateStyles";
ZmBriefcase.PAGE_TITLE_BAR = "_TitleBar";
ZmBriefcase.PAGE_HEADER = "_Header";
ZmBriefcase.PAGE_FOOTER = "_Footer";
ZmBriefcase.PAGE_SIDE_BAR = "_SideBar";
ZmBriefcase.PAGE_TOC_BODY_TEMPLATE = "_TocBodyTemplate";
ZmBriefcase.PAGE_TOC_ITEM_TEMPLATE = "_TocItemTemplate";
ZmBriefcase.PATH_BODY_TEMPLATE = "_PathBodyTemplate";
ZmBriefcase.PATH_ITEM_TEMPLATE = "_PathItemTemplate";
ZmBriefcase.PATH_SEPARATOR = "_PathSeparator";

// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBriefcase.prototype.toString = 
function() {
	return "ZmBriefcase";
};

ZmBriefcase.prototype.getIcon = 
function() {
	if (this.nId == ZmOrganizer.ID_ROOT)	{ return null; }
	if (this.nId == ZmOrganizer.ID_FILE_SHARED_WITH_ME)	{ return "SharedContact"; }
	if (this.link)							{ return "SharedMailFolder"; }
	return "Folder";
};

ZmBriefcase.prototype.notifyModify =
function(obj) {
	ZmOrganizer.prototype.notifyModify.call(this, obj);

	var doNotify = false;
	var fields = {};
	if (obj.name != null && this.name != obj.name && !obj._isRemote) {
		this.name = obj.name;
		fields[ZmOrganizer.F_NAME] = true;
		doNotify = true;
	} else if (obj.color != null && this.color != obj.color && !obj._isRemote) {
		this.color = obj.color;
		fields[ZmOrganizer.F_COLOR] = true;
		doNotify = true;
	}
	
	if (doNotify) {
		this._notify(ZmEvent.E_MODIFY, {fields: fields});
	}
};

// Static methods

/**
* Checks the briefcase name for validity. Returns an error message if the
* name is invalid and null if the name is valid.
*
* @param {String}		name		a briefcase name
* @return	{String}	the name
*/
ZmBriefcase.checkName =
function(name) {
	return ZmOrganizer.checkName(name);
};

/**
 * Returns true if the given object(s) may be placed in this folder.
 *
 * If the object is a folder, check that:
 * <ul>
 * <li>We are not the immediate parent of the folder</li>
 * <li>We are not a child of the folder</li>
 * <li>We are not Spam or Drafts</li>
 * <li>We don't already have a child with the folder's name (unless we are in Trash)</li>
 * <li>We are not moving a regular folder into a search folder</li>
 * <li>We are not moving a search folder into the Folders container</li>
 * <li>We are not moving a folder into itself</li>
 * </ul>
 *
 * If the object is an item or a list or items, check that:
 * <ul>
 * <li>We are not the Folders container</li>
 * <li>We are not a search folder</li>
 * <li>The items aren't already in this folder</li>
 * <li>A contact can only be moved to Trash</li>
 * <li>A draft can be moved to Trash or Drafts</li>
 * <li>Non-drafts cannot be moved to Drafts</li>
 * </ul>
 *
 * @param {Object}	what		the object(s) to possibly move into this briefcase (item or organizer)
 */
ZmBriefcase.prototype.mayContain =
function(what, targetFolderType) {

    if (!what) return true;

	var invalid = false;
    targetFolderType = targetFolderType || this.type;

    if (what instanceof ZmFolder) { //ZmBriefcase
         invalid =(
                    what.parent == this || this.isChildOf(what)
                 || targetFolderType == ZmOrganizer.SEARCH || targetFolderType == ZmOrganizer.TAG
                 || (!this.isInTrash() && this.hasChild(what.name))
                 || (what.id == this.id)
                 || (this.isRemote() && !this._remoteMoveOk(what))
                 || (what.isRemote() && !this._remoteMoveOk(what))
                 ||  this.disallowSubFolder
                 );
    } else { //ZmBriefcaseItem
        var items = AjxUtil.toArray(what);
		var item = items[0];
        if (item.type == ZmItem.BRIEFCASE_ITEM) {
            invalid = this._checkInvalidFolderItems(items);

            if (!invalid) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i] instanceof ZmBriefcaseFolderItem && (items[i].id == this.id ||             // Can't move folder items to themselves
                    		this.isChildOf(items[i].folder))) { // Can't move parent folder to child folder
                        invalid = true;
                        break;
                    }
                }
            }
            
            
            // can't move items to folder they're already in; we're okay if
            // we have one item from another folder
            if (!invalid && item.folderId) {
                invalid = true;
                for (var i = 0; i < items.length; i++) {
                    var tree = appCtxt.getById(items[i].folderId);
                    if (tree != this) {
                        invalid = false;
                        break;
                    }
                }
            }
        } else {
            invalid = true;
        }
        
        // attachments from mail can be moved inside briefcase
		if (item && item.msgId && item.partId) {
			invalid = false;
		}

    }

    if (!invalid && this.link) {
        invalid = this.isReadOnly();
    }	

	return !invalid;
};

ZmBriefcase.prototype._checkInvalidFolderItems =
function(items, targetFolderType) {
  var invalid = false;
  for (var i=0; i<items.length && !invalid; i++) {
    if (items[i] instanceof ZmBriefcaseFolderItem) {
        var item = items[i];
        invalid = (
           item.parent == this || this.isChildOf(item)
        || targetFolderType == ZmOrganizer.SEARCH || targetFolderType == ZmOrganizer.TAG
        || (!this.isInTrash() && this.hasChild(item.name))
        || (item.id == this.id)
        || (item.folder && item.folder.isRemote() && !this.isRemote() && !item.folder.rid)
        || (item.folder && this.isRemote())
        );
    }
  }
    return invalid;
};

ZmBriefcase.prototype.supportsPublicAccess =
function() {
	return true;
};

ZmBriefcase.prototype.isShared =
function(){
    return this.link ? true : false;  
};

ZmBriefcase.prototype._generateRestUrl =
function() {
	var loc = document.location;
	var uname = this.getOwner();
	var host = loc.host;
	var m = uname.match(/^(.*)@(.*)$/);

	host = (m && m[2]) || host;

	// REVISIT: What about port? For now assume other host uses same port
	if (loc.port && loc.port != 80) {
		host = host + ":" + loc.port;
	}

	var searchPath =  this.getSearchPath(true);
	var generatedRestURL = [loc.protocol, "//", host, "/service/user/", uname, "/", AjxStringUtil.urlEncode(searchPath)].join("");
	var restUrl = this.restUrl;
	var oname = this.oname;
	var parent = this.parent;
	//Get the restUrl and oname from remote share
	while (parent) {
		if (parent.restUrl) {
			restUrl = parent.restUrl;
		}
		if (parent.oname) {
			oname = parent.oname;
		}
		parent = parent.parent;
	}

	if (restUrl) {
		var index = searchPath.indexOf(oname);  //remove oname from searchPath
		if (index != -1) {
			searchPath = searchPath.substring(index + oname.length);
		}
		generatedRestURL = restUrl +  AjxStringUtil.urlEncode(searchPath);
	}
	return generatedRestURL;
};
}
if (AjxPackage.define("zimbraMail.briefcase.model.ZmBriefcaseItem")) {
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

/**
 * @overview
 * 
 */

/**
 * Abstract class
 * @class
 * This class is a base class for briefcase item classes.
 * 
 * @param {int}			id			the unique id
 * @param {ZmList}		list		a list that contains this item
 * @param {Boolean}		noCache		if <code>true</code>, do not cache this item

 * @extends		ZmItem
 * 
 * @see		ZmBriefcaseBaseItem
 */
ZmBriefcaseBaseItem = function(id, list, noCache, type) {

	if (arguments.length == 0) { return; }
	ZmItem.call(this, type, id, list, noCache);
};

ZmBriefcaseBaseItem.prototype = new ZmItem;
ZmBriefcaseBaseItem.prototype.constructor = ZmBriefcaseBaseItem;

// Constants
ZmBriefcaseBaseItem.NAME_UPDATED = "nameUpdated";

//Public methods

/**
 * Gets the path.
 * 
 * @param	{Boolean}	dontIncludeThisName		if <code>true</code>, do not include this item name in the path
 * @return	{String}	the path
 */
ZmBriefcaseBaseItem.prototype.getPath =
function(dontIncludeThisName) {
	var briefcase = appCtxt.getById(this.folderId);
	var name = !dontIncludeThisName ? this.name : "";
	return [briefcase.getPath(), "/", name].join("");
};
                      
/**
 * Gets the REST URL.
 * 
 * @param	{Boolean}	dontIncludeThisName		if <code>true</code>, do not include this item name in the path
 * @param	{Boolean}	ignoreCustomDocs		if <code>true</code>, ignore custom docs
 * @param   {Boolean}   includeVersion			if <code>true</code> include the version if exists (it's latest for the base item)
 * @return	{String}	the REST URL
 */
ZmBriefcaseBaseItem.prototype.getRestUrl =
function(dontIncludeThisName, ignoreCustomDocs, includeVersion) {
	var url = ZmItem.prototype.getRestUrl.call(this);
	if (dontIncludeThisName) {
		url = url.replace(/[^\/]+$/,"");
	}
	if (includeVersion && this.version){
		url = url + (url.match(/\?/) ? '&' : '?' ) + "ver=" + this.version;
	}

	return url;
};

/**
 * Checks if this item is a real file.
 * 
 * @return	{Boolean}	<code>true</code> if this item is a real file (not a web doc or folder)
 */
ZmBriefcaseBaseItem.prototype.isRealFile =
function() {
    return (!this.isFolder && !this.isWebDoc());  
};

/**
 * Checks if this item is a web doc.
 * 
 * @return	{Boolean}	<code>true</code> if this item is a web doc
 */
ZmBriefcaseBaseItem.prototype.isWebDoc =
function() {
    return (this.contentType == ZmMimeTable.APP_ZIMBRA_DOC);
};

/**
 * Checks if this item is an document which can only be downloaded and cannot be rendered by browser
 *
 * @return	{Boolean}	<code>true</code> if this item is downloadable
 */
ZmBriefcaseBaseItem.prototype.isDownloadable =
function() {
    return (!this.isWebDoc() && !ZmMimeTable.isRenderable(this.contentType) && !ZmMimeTable.isRenderableImage(this.contentType) && !ZmMimeTable.isTextType(this.contentType));
};

/**
 * Gets the content type.
 * 
 * @return	{String}	the content type
 */
ZmBriefcaseBaseItem.prototype.getContentType =
function() {
    return this.contentType;
};

/**
 * Gets the icon.
 * 
 * @param	{Boolean}	large		if <code>true</code>, return the large icon
 * @return	{String}	the icon
 */
ZmBriefcaseBaseItem.prototype.getIcon =
function(large) {

	if (this.isFolder) {
		return "Folder";
	}

	var ct = this.contentType, icon;
	if (ct && ct.match(/;/)) {
		ct = ct.split(";")[0];
	}
	var mimeInfo = ct ? ZmMimeTable.getInfo(ct) : null;
	if (large) {
		icon = mimeInfo ? mimeInfo.imageLarge : "UnknownDoc_48";
	} else {
		icon = mimeInfo ? mimeInfo.image : "UnknownDoc" ;
	}

	return icon;
};

/**
 * Checks if this item is read only.
 * 
 * @return	{Boolean}	<code>true</code> if this item is read only
 */
ZmBriefcaseBaseItem.prototype.isReadOnly =
function() {
	// if one of the ancestor is readonly then no chances of childs being writable
	var isReadOnly = false;
	var folder = appCtxt.getById(this.folderId);
	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
	while (folder && folder.parent && (folder.parent.id != rootId) && !folder.isReadOnly()) {
		folder = folder.parent;
	}

	if (folder && folder.isReadOnly()) {
		isReadOnly = true;
	}

	return isReadOnly;
};

/**
 * Gets the briefcase folder.
 * 
 * @return	{ZmBriefcase}	the folder
 */
ZmBriefcaseBaseItem.prototype.getBriefcaseFolder =
function() {
	if (!this._briefcase) {
		var folder = appCtxt.getById(this.folderId);
		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
		while (folder && folder.parent && (folder.parent.id != rootId)) {
			folder = folder.parent;
		}
		this._briefcase = folder;
	}
	return this._briefcase;
};

/**
 * Checks if this item is shared.
 * 
 * @return	{Boolean}	<code>true</code> if this item is shared
 */
ZmBriefcaseBaseItem.prototype.isShared =
function() {
	var briefcase = this.getBriefcaseFolder();
	return briefcase && briefcase.link;
};

/**
 * Creates an item from an attachment.
 * 
 * @param	{String}	msgId		the message
 * @param	{String}	partId		the message part
 * @param	{String}	name		the item name
 * @param	{String}	folderId		the folder id
 */
ZmBriefcaseBaseItem.prototype.createFromAttachment =
function(msgId, partId, name, folderId, attribs) {

    attribs = attribs || {};

    var acctId = appCtxt.getActiveAccount().id;

    var json = {
        SaveDocumentRequest: {
            _jsns: "urn:zimbraMail",
			doc: {
                m: {
                    id: msgId,
                    part: partId
                }
            }
        }
    };

    var doc = json.SaveDocumentRequest.doc;
    if (attribs.id && attribs.version) {
        doc.id = attribs.id;
        doc.ver = attribs.version;
    }else{
        doc.l = folderId;
    }
    if(attribs.rename){
        doc.name = attribs.rename;
    }
    var params = {
		jsonObj: json,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleResponseCreateItem, [folderId, attribs.callback])),
		errorCallback: (new AjxCallback(this, this._handleErrorCreateItem, [attribs.errorCallback]))
	};
    appCtxt.getAppController().sendRequest(params);
};

ZmBriefcaseBaseItem.prototype.restoreVersion =
function(restoreVerion, callback){

    var json = {
		SaveDocumentRequest: {
			_jsns: "urn:zimbraMail",
			doc: {
				id:	this.id,
                ver: this.version,
                doc: {
                    id: this.id,
                    ver: restoreVerion
                }
			}
		}
	};

	var params = {
		jsonObj:		json,
		asyncMode:		true,
		callback:		callback
	};
	return appCtxt.getAppController().sendRequest(params);
    
};

ZmBriefcaseBaseItem.prototype.deleteVersion =
function(version, callback, batchCmd){

    var json = {
		PurgeRevisionRequest: {
			_jsns: "urn:zimbraMail",
			revision: {
				id:	this.id,
                ver: version,
                includeOlderRevisions: false
			}
		}
	};

    if(batchCmd){
        batchCmd.addRequestParams(json, callback);
    }else{
        var params = {
            jsonObj:		json,
            asyncMode:		true,
            callback:		callback
        };
        return appCtxt.getAppController().sendRequest(params);
    }

};


ZmBriefcaseBaseItem.prototype._handleResponseCreateItem =
function(folderId, callback, response) {
	appCtxt.getAppController().setStatusMsg(ZmMsg.fileCreated);
	appCtxt.getChooseFolderDialog().popdown();
    if(callback)
        callback.run(response);
};

ZmBriefcaseBaseItem.prototype._handleErrorCreateItem =
function(callback, ex) {

    var handled = false;
	if(callback){
        handled = callback.run(ex);
    }
    appCtxt.getAppController().setStatusMsg(ZmMsg.errorCreateFile, ZmStatusView.LEVEL_CRITICAL);
    return handled;
};

ZmBriefcaseBaseItem.prototype.notifyModify =
function(obj, batchMode) {

	var result = ZmItem.prototype.notifyModify.apply(this, arguments);
	if (result) {
		return result;
	}

    var modified = false, doNotify = true, fields=[];    
    //Updating modified attributes
	var nameUpdated = false;
	if (obj.name && (obj.name !== this.name)) {
		nameUpdated = true;
	}
    this.set(obj);

    if (doNotify) {
		var details = {fields: fields};
		details[ZmBriefcaseBaseItem.NAME_UPDATED] = nameUpdated;
		this._notify(ZmEvent.E_MODIFY, details);
	}
	
};
/**
 * Gets the folder.
 * 
 * @return	{ZmFolder}		the folder
 */
ZmBriefcaseBaseItem.prototype.getFolder =
function() {
	return appCtxt.getById(this.folderId);
};

ZmBriefcaseBaseItem.prototype._loadFromDom = function (node) {
	/**
	 * In search api response we get 'id' and 'sfid' for files in 'files shared with me' folder. Here id is a combination id which is required to form the rest url
	 * and get the preview data and sfid is the actual 'id' of the item/file.
	 * To delete the file need to call "ItemActionRequest' with 'sfid' coming from 'searchResponse' since this is the actual file id.
	 *  Interchanged the 'id' and 'sfid' properties for items in 'files shared with me' folder, so that rest of the operations is perfomed as earlier.
	 */
	if (node.sfid && node.l == ZmFolder.ID_FILE_SHARED_WITH_ME) {
		this.id = node.sfid;
		this.sfid = node.id;
	} else {
		this.id = node.id;
	}
	if (node.rest) {
		this.restUrl = node.rest;
	}
	if (node.l) {
		this.folderId = node.l;
	}
	if (node.name) {
		this.name = node.name;
	}
	if (node.cr) {
		this.creator = node.cr;
	}
	if (node.perm) {
		this.permission = node.perm;
	}

	this.shares = this.shares || [];

	if (node.acl && node.acl.grant) {
		this.acl = node.acl;

		if (node.acl.grant.length > 0) {
			for (var i = 0; i < node.acl.grant.length; i++) {
				var grant = node.acl.grant[i];
				this.shares.push(ZmShare.createFromJs(this, grant));
			}
		}
	}

	if (node.cd) {
		this.createDate = new Date(Number(node.cd));
	}
	if (node.md) {
		//node.md is seconds since epoch
		var mdMilliSecs = Number(node.md) * 1000;
		this.modifyDate = new Date(mdMilliSecs);
	}
	if (node.d) {
		this.contentChangeDate = new Date(Number(node.d));
	}

	if (node.leb) {
		this.modifier = node.leb;
	}
	if (node.s || node.s == 0) {
		//size can be 0
		this.size = Number(node.s);
	}
	if (node.ver) {
		this.version = Number(node.ver) || 0;
	}
	if (node.ct) {
		this.contentType = node.ct.split(";")[0];
	}
	if (node.tn) {
		this._parseTagNames(node.tn);
	}
	this.locked = false;
	if (node.loid) {
		this.locked = true;
		this.lockId = node.loid;
		this.lockUser = node.loe;
		this.lockTime = new Date(Number(node.lt));
	}

	if (node.desc) {
		this.notes = AjxStringUtil.htmlEncode(node.desc);
	}
	this.subject = this.getNotes();

	this._parseFlags(node.f);
};

/**
 * Creates a briefcase item.
 * @class
 * This class represents a briefcase item.
 * 
 * @param {int}			id			the unique id
 * @param {ZmList}		list		a list that contains this item
 * @param {Boolean}		noCache		if <code>true</code>, do not cache this item

 * @extends		ZmBriefcaseBaseItem
 * 
 * @see		ZmBriefcase
 */
ZmBriefcaseItem = function(id, list, noCache) {

	if (arguments.length == 0) { return; }
	ZmBriefcaseBaseItem.call(this, id, list, noCache, ZmItem.BRIEFCASE_ITEM);
};

ZmBriefcaseItem.prototype = new ZmBriefcaseBaseItem;
ZmBriefcaseItem.prototype.constructor = ZmBriefcaseItem;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBriefcaseItem.prototype.toString =
function() {
	return "ZmBriefcaseItem";
};


// Static functions
/**
 * Creates a briefcase item from the dom.
 * 
 * @param	{Object}	node		the node
 * @param	{Hash}		args		a hash of arguments
 * 
 * @return	{ZmBriefcaseItem}	the briefcase item
 */
ZmBriefcaseItem.createFromDom =
function(node, args) {
	var id;
	if (node.sfid && node.l == ZmFolder.ID_FILE_SHARED_WITH_ME) {
		id = node.sfid;
	} else {
		id = node.id
	}
	var item = new ZmBriefcaseItem(id, args.list);
	item._loadFromDom(node);
	return item;
};

ZmBriefcaseItem.getRevision =
function(itemId, version, callback, errorCallback, accountName) {
	var json = {
		ListDocumentRevisionsRequest: {
			_jsns: "urn:zimbraMail",
			doc: {
				id:	itemId,
                ver: version,   //verion=-1 for all versions of count
                count: 50       //parametrize count to allow pagination
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
	return appCtxt.getAppController().sendRequest(params);
};

ZmBriefcaseItem.lock =
function(itemId, callback, errorCallback, accountName) {
	var json = {
		ItemActionRequest: {
			_jsns: "urn:zimbraMail",
			action: {
				id:	itemId instanceof Array ? itemId.join() : itemId,
				op:	"lock"
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
	return appCtxt.getAppController().sendRequest(params);
};


ZmBriefcaseItem.unlock =
function(itemId, callback, errorCallback, accountName) {
	var json = {
		ItemActionRequest: {
			_jsns: "urn:zimbraMail",
			action: {
				id:	itemId instanceof Array ? itemId.join() : itemId,
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
	return appCtxt.getAppController().sendRequest(params);
};
	

// Mendoza line

ZmBriefcaseItem.prototype.getRevisions =
function(callback, errorCallback, accountName){
	ZmBriefcaseItem.getRevision(this.id, -1 ,callback, errorCallback, accountName);
};

ZmBriefcaseItem.prototype.lock =
function(callback, errorCallback, accountName){
	ZmBriefcaseItem.lock(this.id, callback, errorCallback, accountName);  
};


ZmBriefcaseItem.prototype.unlock =
function(callback, errorCallback, accountName){
	ZmBriefcaseItem.unlock(this.id, callback, errorCallback, accountName);
};

ZmBriefcaseItem.prototype.set =
function(data) {

	this.id = data.id;
	if (data.rest) this.restUrl = data.rest;
	if (data.l)    this.folderId = data.l;
	if (data.name) this.name = data.name;
	if (data.cr)   this.creator = data.cr;
	if (data.perm) this.permission = data.perm;

	if (data.acl) {
		this.acl = data.acl;
		this.shares = [];

		if (data.acl.grant && data.acl.grant.length > 0) {
			for (var i = 0; i < data.acl.grant.length; i++) {
				var grant = data.acl.grant[i];
				this.shares.push(ZmShare.createFromJs(this, grant));
			}
		}
	}


	if (data.cd)   this.createDate = new Date(Number(data.cd));
	if (data.md)	{ //node.md is seconds since epoch
		var mdMilliSecs = Number(data.md)*1000;
		this.modifyDate = new Date(mdMilliSecs);
	}
	if (data.d)    this.contentChangeDate = new Date(Number(data.d));
	if (data.leb)  this.modifier = data.leb;
	if (data.s)    this.size = Number(data.s);
	if (data.ver)  this.version = Number(data.ver);
	if (data.ct)   this.contentType = data.ct.split(";")[0];
    if (data.tn)   this._parseTagNames(data.tn);
    if (data.loid)    {
        this.locked = true;
        this.lockId = data.loid;
        this.lockUser = data.loe;
        this.lockTime = new Date(Number(data.lt));
    } else if (data.loid===""){
        //loid is not always set in response; set locked to false when value is blank
        this.locked = false;
    }

    if (data.desc)  this.notes = AjxStringUtil.htmlEncode(data.desc);
    this.subject = this.getNotes();
};

ZmBriefcaseItem.prototype.getNotes =
function(){
    return AjxMessageFormat.format(ZmMsg.revisionNotes, [this.version, (this.notes || "")]);
};

/**
 * Gets the normalized item id by splitting it from a/c id if any associated
 *
 * @return	{Int}	normalized item id
 */
ZmBriefcaseItem.prototype.getNormalizedItemId =
function(){
    if(!this.getBriefcaseFolder().isShared()){return this.id;}
    return AjxStringUtil.split(this.id,':')[1];
};

ZmBriefcaseFolderItem = function(folder) {

	ZmBriefcaseItem.call(this, folder.id, null, true);

	this.name = folder.name;
	this.folderId = folder.parent && folder.parent.id;
	this.isFolder = true;
	this.folder = folder;
    this.size = folder.sizeTotal;
    this.creator = folder.getOwner();

	this._data = {};
};

ZmBriefcaseFolderItem.prototype = new ZmBriefcaseItem;
ZmBriefcaseFolderItem.prototype.constructor = ZmBriefcaseFolderItem;

ZmBriefcaseFolderItem.prototype.toString =
function() {
	return "ZmBriefcaseFolderItem";
};

ZmBriefcaseFolderItem.prototype.getData =
function(key) {
	return this._data[key];
};

ZmBriefcaseFolderItem.prototype.setData =
function(key, value) {
  this._data[key] = value;
};

ZmBriefcaseFolderItem.prototype.getIcon =
function(baseIcon, large){
    if(baseIcon)
        return ZmBriefcaseBaseItem.prototype.getIcon.call(this, true);
    else
        return this.folder.getIconWithColor();  
};

ZmBriefcaseFolderItem.prototype.getOwner =
function(){
    return this.folder.getOwner();
};

//ZmRevisionItem
ZmRevisionItem = function(id, parentItem){
    if(arguments.length == 0) return;
    this.parent = parentItem;
    this.isRevision = true;
    this.id = id;
    ZmBriefcaseBaseItem.call(this, id, null, false, ZmItem.BRIEFCASE_REVISION_ITEM);
};

ZmRevisionItem.prototype = new ZmBriefcaseBaseItem;
ZmRevisionItem.prototype.constructor = ZmRevisionItem;

ZmRevisionItem.prototype.toString = function() {
	return "ZmRevisionItem"; 
}
ZmRevisionItem.prototype.set =
function(data){

    //Props
    //this.id =       this.id || data.id;
    this.version =  data.ver;
    if (data.name)  this.name = data.name;
    if (data.l)     this.folderId = data.l;
    if (data.ct)    this.contentType = data.ct.split(";")[0];
    if (data.s)     this.size = Number(data.s);

    //Data
    if (data.cr)    this.creator = data.cr;
    if (data.cd)    this.createDate = new Date(Number(data.cd));
    if (data.leb)   this.modifier = data.leb;
	if (data.md)	{ //node.md is seconds since epoch
		var mdMilliSecs = Number(data.md)*1000;
		this.modifyDate = new Date(mdMilliSecs);
	}
	if (data.d)     this.contentChangeDate = new Date(Number(data.d));
	if (data.desc)  this.notes = AjxStringUtil.htmlEncode(data.desc);

    this.subject = this.getNotes();
	if (data.tn) { this._parseTagNames(data.tn); }

};

ZmRevisionItem.prototype.getNotes =
function(){
    return ((this.notes)?AjxMessageFormat.format(ZmMsg.revisionNotes, [this.version, this.notes]):AjxMessageFormat.format(ZmMsg.revisionWithoutNotes, [this.version]));
};

ZmRevisionItem.prototype.getRestUrl =
function(){
    var restUrl = this.parent.getRestUrl();
    if(this.version){
        restUrl = restUrl + ( restUrl.match(/\?/) ? '&' : '?' ) + "ver="+this.version;
    }
    return restUrl;
};

ZmRevisionItem.prototype.getIcon =
function(){
   return null; 
};

/**
 * Rename the item.
 *
 * @param	{String}	newName
 * @param	{AjxCallback}	callback		the callback
 * @param	{AjxCallback}	errorCallback	the callback on error
 * @return	{Object}		the result of the move
 */
ZmRevisionItem.prototype.rename =
function(newName, callback, errorCallback) {
	return ZmItem.rename(this.parent.id, newName, callback, errorCallback);
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmShare")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains a share class.
 */

/**
 * Creates a share with the given information about the sharer, the sharee, and
 * what is being shared.
 * @class
 * A share comprises information about an object that is shared by one user with
 * another user. Currently, only organizers may be shared.
 * <br/>
 * <br/>
 * XML representation:
 * <pre>
 * &lt;!ELEMENT share (grantee,grantor,link)>
 * &lt;!ATTLIST share xmlns CDATA #FIXED "urn:zimbraShare">
 * &lt;!ATTLIST share version NMTOKEN #FIXED "0.1">
 * &lt;!ATTLIST share action (new|edit|delete|accept|decline) #REQUIRED>
 *
 * &lt;!ELEMENT grantee EMPTY>
 * &lt;!ATTLIST grantee id CDATA #REQUIRED>
 * &lt;!ATTLIST grantee name CDATA #REQUIRED>
 * &lt;!ATTLIST grantee email CDATA #REQUIRED>
 *
 * &lt;!ELEMENT grantor EMPTY>
 * &lt;!ATTLIST grantor id CDATA #REQUIRED>
 * &lt;!ATTLIST grantor name CDATA #REQUIRED>
 * &lt;!ATTLIST grantor email CDATA #REQUIRED>
 *
 * &lt;!ELEMENT link EMPTY>
 * &lt;!ATTLIST link id NMTOKEN #REQUIRED>
 * &lt;!ATTLIST link name CDATA #REQUIRED>
 * &lt;!ATTLIST link view (appointment|...) #REQUIRED>
 * &lt;!ATTLISt link perm CDATA #REQUIRED>
 * </pre>
 *
 * @author Andy Clark
 * 
 * @param	{Hash}	params		a hash of parameters
 * @param {Object}	params.object		the object being shared
 * @param {constant}	params.granteeType	the grantee type (see <code>ZmShare.TYPE_</code> constants) (everyone, or a single user)
 * @param {String}	params.granteeId		a unique ID for the grantee
 * @param {String}	params.granteeName	the grantee's name
 * @param {String}	granteePwd			the grantee's password
 * @param {constant}	params.perm		the grantee's permissions on the shared object
 * @param {Boolean}	params.inherit		if <code>true</code>, children inherit share info
 * @param {Boolean}	params.invalid		if <code>true</code>, the share is invalid
 */
ZmShare = function(params) {

	this.grantee = {};
	this.grantor = {};
	this.link = {};

	if (!params) { return; }
	this.object = params.object;
	this.grantee.type = params.granteeType;
	this.grantee.id = params.granteeId;
	this.grantee.name = params.granteeName || "";
	this.link.inh = params.inherit;
	this.link.pw = params.granteePwd;
	this.invalid = params.invalid;
	this.setPermissions(params.perm);
};

// Constants

ZmShare.URI = "urn:zimbraShare";
ZmShare.VERSION = "0.2";
ZmShare.PREV_VERSION = "0.1"; // keep this till it's no longer supported

// actions
/**
 * Defines the "new" action.
 * 
 * @type {String}
 */
ZmShare.NEW		= "new";
/**
 * Defines the "edit" action.
 * 
 * @type {String}
 */
ZmShare.EDIT	= "edit";
/**
 * Defines the "delete" action.
 * 
 * @type {String}
 */
ZmShare.DELETE	= "delete";
/**
 * Defines the "accept" action.
 * 
 * @type {String}
 */
ZmShare.ACCEPT	= "accept";
/**
 * Defines the "decline" action.
 * 
 * @type {String}
 */
ZmShare.DECLINE	= "decline";
/**
 * Defines the "notify" action.
 * 
 * @type {String}
 */
ZmShare.NOTIFY  = "notify";
/**
 * Defines the "resend" action.
 * 
 * @type {String}
 */
ZmShare.RESEND	= "resend";
/**
 * Defines the "revoke" action.
 * 
 * @type {String}
 */
ZmShare.REVOKE	= "revoke";

ZmShare.ACTION_LABEL = {};
ZmShare.ACTION_LABEL[ZmShare.EDIT]		= ZmMsg.edit;
ZmShare.ACTION_LABEL[ZmShare.RESEND]	= ZmMsg.resend;
ZmShare.ACTION_LABEL[ZmShare.REVOKE]	= ZmMsg.revoke;

// allowed permission bits
/**
 * Defines the "read" allowed permission.
 */
ZmShare.PERM_READ		= "r";
/**
 * Defines the "write" allowed permission.
 */
ZmShare.PERM_WRITE		= "w";
/**
 * Defines the "insert" allowed permission.
 */
ZmShare.PERM_INSERT		= "i";
/**
 * Defines the "delete" allowed permission.
 */
ZmShare.PERM_DELETE		= "d";
/**
 * Defines the "admin" allowed permission.
 */
ZmShare.PERM_ADMIN		= "a";
/**
 * Defines the "workflow" allowed permission.
 */
ZmShare.PERM_WORKFLOW	= "x";
/**
 * Defines the "private" allowed permission.
 */
ZmShare.PERM_PRIVATE	= "p";

// virtual permissions
ZmShare.PERM_CREATE_SUBDIR	= "c";

// restricted permission bits
/**
 * Defines the "no read" restricted permission.
 */
ZmShare.PERM_NOREAD		= "-r";
/**
 * Defines the "no write" restricted permission.
 */
ZmShare.PERM_NOWRITE	= "-w";
/**
 * Defines the "no insert" restricted permission.
 */
ZmShare.PERM_NOINSERT	= "-i";
/**
 * Defines the "no delete" restricted permission.
 */
ZmShare.PERM_NODELETE	= "-d";
/**
 * Defines the "no admin" restricted permission.
 */
ZmShare.PERM_NOADMIN	= "-a";
/**
 * Defines the "no workflow" restricted permission.
 */
ZmShare.PERM_NOWORKFLOW	= "-x";

// allowed permission names
ZmShare.PERMS = {};
ZmShare.PERMS[ZmShare.PERM_READ]		= ZmMsg.shareActionRead;
ZmShare.PERMS[ZmShare.PERM_WRITE]		= ZmMsg.shareActionWrite;
ZmShare.PERMS[ZmShare.PERM_INSERT]		= ZmMsg.shareActionInsert;
ZmShare.PERMS[ZmShare.PERM_DELETE]		= ZmMsg.shareActionDelete;
ZmShare.PERMS[ZmShare.PERM_ADMIN]		= ZmMsg.shareActionAdmin;
ZmShare.PERMS[ZmShare.PERM_WORKFLOW]	= ZmMsg.shareActionWorkflow;

// restricted permission names
ZmShare.PERMS[ZmShare.PERM_NOREAD]		= ZmMsg.shareActionNoRead;
ZmShare.PERMS[ZmShare.PERM_NOWRITE]		= ZmMsg.shareActionNoWrite;
ZmShare.PERMS[ZmShare.PERM_NOINSERT]	= ZmMsg.shareActionNoInsert;
ZmShare.PERMS[ZmShare.PERM_NODELETE]	= ZmMsg.shareActionNoDelete;
ZmShare.PERMS[ZmShare.PERM_NOADMIN]		= ZmMsg.shareActionNoAdmin;
ZmShare.PERMS[ZmShare.PERM_NOWORKFLOW]	= ZmMsg.shareActionNoWorkflow;

// role permissions
/**
 * Defines the "none" role.
 * 
 * @type {String}
 */
ZmShare.ROLE_NONE		= "NONE";
/**
 * Defines the "viewer" role.
 * 
 * @type {String}
 */
ZmShare.ROLE_VIEWER		= "VIEWER";
/**
 * Defines the "manager" role.
 * 
 * @type {String}
 */
ZmShare.ROLE_MANAGER	= "MANAGER";
/**
 * Defines the "admin" role.
 * 
 * @type {String}
 */
ZmShare.ROLE_ADMIN		= "ADMIN";

// role names
ZmShare.ROLE_TEXT = {};
ZmShare.ROLE_TEXT[ZmShare.ROLE_NONE]	= ZmMsg.shareRoleNone;
ZmShare.ROLE_TEXT[ZmShare.ROLE_VIEWER]	= ZmMsg.shareRoleViewer;
ZmShare.ROLE_TEXT[ZmShare.ROLE_MANAGER]	= ZmMsg.shareRoleManager;
ZmShare.ROLE_TEXT[ZmShare.ROLE_ADMIN]	= ZmMsg.shareRoleAdmin;

ZmShare.ROLE_PERMS = {};
ZmShare.ROLE_PERMS[ZmShare.ROLE_NONE]		= "";
ZmShare.ROLE_PERMS[ZmShare.ROLE_VIEWER]		= "r";
ZmShare.ROLE_PERMS[ZmShare.ROLE_MANAGER]	= "rwidx";
ZmShare.ROLE_PERMS[ZmShare.ROLE_ADMIN]		= "rwidxa";

/**
 * Defines the "all" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_ALL	= "all";
/**
 * Defines the "user" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_USER	= "usr";
/**
 * Defines the "group" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_GROUP	= "grp";
/**
 * Defines the "domain" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_DOMAIN	= "dom";
/**
 * Defines the "COS" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_COS	= "cos";
/**
 * Defines the "guest" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_GUEST	= "guest";
/**
 * Defines the "public" type.
 * 
 * @type {String}
 */
ZmShare.TYPE_PUBLIC	= "pub";

ZmShare.ZID_ALL = "00000000-0000-0000-0000-000000000000";
ZmShare.ZID_PUBLIC = "99999999-9999-9999-9999-999999999999";

ZmShare.SHARE = "SHARE";
ZmShare.GRANT = "GRANT";

// message subjects
ZmShare._SUBJECTS = {};
ZmShare._SUBJECTS[ZmShare.NEW] = ZmMsg.shareCreatedSubject;
ZmShare._SUBJECTS[ZmShare.EDIT] = ZmMsg.shareModifiedSubject;
ZmShare._SUBJECTS[ZmShare.DELETE] = ZmMsg.shareRevokedSubject;
ZmShare._SUBJECTS[ZmShare.ACCEPT] = ZmMsg.shareAcceptedSubject;
ZmShare._SUBJECTS[ZmShare.DECLINE] = ZmMsg.shareDeclinedSubject;
ZmShare._SUBJECTS[ZmShare.NOTIFY]  = ZmMsg.shareNotifySubject;

// formatters
ZmShare._TEXT = null;
ZmShare._HTML = null;
ZmShare._HTML_NOTE = null;
ZmShare._XML = null;

// Utility methods

ZmShare.getDefaultMountpointName = function(owner, name) {
    if (!ZmShare._defaultNameFormatter) {
        ZmShare._defaultNameFormatter = new AjxMessageFormat(ZmMsg.shareNameDefault);
    }
    var defaultName = ZmShare._defaultNameFormatter.format([owner, name]);
	return defaultName.replace(/\//g," ");
};

/**
 * Gets the role name.
 * 
 * @param	{constant}	role		the role (see <code>ZmShare.ROLE_</code> constants)
 * @return	{String}	the name
 */
ZmShare.getRoleName =
function(role) {
	return ZmShare.ROLE_TEXT[role] || ZmMsg.shareRoleCustom;
};

/**
 * Gets the role actions.
 * 
 * @param	{constant}	role		the role (see <code>ZmShare.ROLE_</code> constants)
 * @return	{String}	the actions
 */
ZmShare.getRoleActions =
function(role) {
	var perm = ZmShare.ROLE_PERMS[role];
	var actions = [];
	if (perm) {
		for (var i = 0; i < perm.length; i++) {
			var c = perm.charAt(i);
			if(c == 'x') continue;
            if (c == "-") {
				c += perm.charAt(++i);
			}
			actions.push(ZmShare.PERMS[c]);
		}
	}
	return (actions.length > 0) ? actions.join(", ") : ZmMsg.shareActionNone;
};

// role action names
ZmShare.ACTIONS = {};
ZmShare.ACTIONS[ZmShare.ROLE_NONE]		= ZmShare.getRoleActions(ZmShare.ROLE_NONE);
ZmShare.ACTIONS[ZmShare.ROLE_VIEWER]	= ZmShare.getRoleActions(ZmShare.ROLE_VIEWER);
ZmShare.ACTIONS[ZmShare.ROLE_MANAGER]	= ZmShare.getRoleActions(ZmShare.ROLE_MANAGER);
ZmShare.ACTIONS[ZmShare.ROLE_ADMIN]		= ZmShare.getRoleActions(ZmShare.ROLE_ADMIN);

// Static methods

/**
 * Creates the share from the DOM.
 * 
 * @param	{Object}	doc		the document
 * @return	{ZmShare}	the resulting share
 */
ZmShare.createFromDom =
function(doc) {
	// NOTE: This code initializes share info from the Zimbra share format, v0.1
	var share = new ZmShare();

	var shareNode = doc.documentElement;
	share.version = shareNode.getAttribute("version");
	if (share.version != ZmShare.VERSION && share.version != ZmShare.PREV_VERSION) { //support previous version here for smooth transition. 
		throw "Zimbra share version must be " + ZmShare.VERSION;
	}
	share.action = shareNode.getAttribute("action");
	
	// NOTE: IE's getElementsByTagName doesn't seem to return the specified
	//		 tags when they're in a namespace. Will have to do this the
	//		 old-fashioned way because I'm tired of fighting with it...
	var child = shareNode.firstChild;
	while (child != null) {
		switch (child.nodeName) {
			case "grantee": case "grantor": {
				share[child.nodeName].id = child.getAttribute("id");
				share[child.nodeName].email = child.getAttribute("email");
				share[child.nodeName].name = child.getAttribute("name");
				break;
			}
			case "link": {
				share.link.id = child.getAttribute("id");
				share.link.name = child.getAttribute("name");
				share.link.view = child.getAttribute("view");
				share.link.perm = child.getAttribute("perm");
				break;
			}
		}
		child = child.nextSibling;
	}

	return share;
};

// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmShare.prototype.toString =
function() {
	return "ZmShare";
};

/**
 * Sets the permission.
 * 
 * @param	{constant}	perm		the permission (see <code>ZmShare.PERM_</code> constants)
 */
ZmShare.prototype.setPermissions =
function(perm) {
	this.link.perm = perm;
	this.link.role = ZmShare.getRoleFromPerm(perm);
};

/**
 * Checks if the given permission exists on this share.
 * 
 * @param	{constant}	perm		the permission (see <code>ZmShare.PERM_</code> constants)
 * @return	{Boolean}	<code>true</code> if the permission is allowed on this share
 */
ZmShare.prototype.isPermAllowed =
function(perm) {
	if (this.link.perm) {
		var positivePerms = this.link.perm.replace(/-./g, "");
		return (positivePerms.indexOf(perm) != -1);
	}
	return false;
};

/**
 * Checks if the given permission is restricted for this share.
 *
 * @param	{constant}	perm		the permission (see <code>ZmShare.PERM_</code> constants)
 * @return	{Boolean}	<code>true</code> if the permission is restricted on this share
 */
ZmShare.prototype.isPermRestricted =
function(perm) {
	if (this.link.perm) {
		return (this.link.perm.indexOf("-" + perm) != -1);
	}
	return false;
};

// Methods that return whether a particular permission exists on this share
/**
 * Checks if the read permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the read permission is allowed on this share
 * @see ZmShare.PERM_READ
 */
ZmShare.prototype.isRead = function() { return this.isPermAllowed(ZmShare.PERM_READ); };
/**
 * Checks if the write permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the write permission is allowed on this share
 * @see ZmShare.PERM_WRITE
 */
ZmShare.prototype.isWrite = function() { return this.isPermAllowed(ZmShare.PERM_WRITE); };
/**
 * Checks if the insert permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the insert permission is allowed on this share
 * @see ZmShare.PERM_INSERT
 */
ZmShare.prototype.isInsert = function() { return this.isPermAllowed(ZmShare.PERM_INSERT); };
/**
 * Checks if the delete permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the delete permission is allowed on this share
 * @see ZmShare.PERM_DELETE
 */
ZmShare.prototype.isDelete = function() { return this.isPermAllowed(ZmShare.PERM_DELETE); };
/**
 * Checks if the admin permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the admin permission is allowed on this share
 * @see ZmShare.PERM_ADMIN
 */
ZmShare.prototype.isAdmin = function() { return this.isPermAllowed(ZmShare.PERM_ADMIN); };
/**
 * Checks if the workflow permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the workflow permission is allowed on this share
 * @see ZmShare.PERM_WORKFLOW
 */
ZmShare.prototype.isWorkflow = function() { return this.isPermAllowed(ZmShare.PERM_WORKFLOW); };
/**
 * Checks if the private permission exists on this share.
 * 
 * @return	{Boolean}	<code>true</code> if the private permission is allowed on this share
 * @see ZmShare.PERM_PRIVATE
 */
ZmShare.prototype.hasPrivateAccess = function() { return this.isPermAllowed(ZmShare.PERM_PRIVATE); };

// Protected static methods

/**
 * @private
 */
ZmShare._getFolderType =
function(view) {
	if (view === ZmItem.BRIEFCASE_ITEM) {
		return ZmMsg.briefcaseFile;
	}
	var folderKey = (view && ZmOrganizer.FOLDER_KEY[ZmOrganizer.TYPE[view]]) || "folder";
	return ZmMsg[folderKey];
};


// Static methods

/**
 * Creates the share from JS.
 * 
 * @param	
 * @return	{ZmShare}	the resulting share
 */
ZmShare.createFromJs =
function(parent, grant) {
	return new ZmShare({object:parent, granteeType:grant.gt, granteeId:grant.zid,
						granteeName:grant.d, perm:grant.perm, inherit:grant.inh,
						granteePwd:grant.pw, invalid:grant.invalid});
};

// Public methods
/**
 * Checks if the grantee type is "all".
 * 
 * @return	{Boolean}	<code>true</code> if type "all"
 * @see		ZmShare.TYPE_ALL
 */
ZmShare.prototype.isAll =
function() {
	return this.grantee.type == ZmShare.TYPE_ALL;
};
/**
 * Checks if the grantee type is "user".
 * 
 * @return	{Boolean}	<code>true</code> if type "user"
 * @see		ZmShare.TYPE_USER
 */
ZmShare.prototype.isUser =
function() {
	return this.grantee.type == ZmShare.TYPE_USER;
};
/**
 * Checks if the grantee type is "group".
 * 
 * @return	{Boolean}	<code>true</code> if type "group"
 * @see		ZmShare.TYPE_GROUP
 */
ZmShare.prototype.isGroup =
function() {
	return this.grantee.type == ZmShare.TYPE_GROUP;
};
/**
 * Checks if the grantee type is "domain".
 * 
 * @return	{Boolean}	<code>true</code> if type "domain"
 * @see		ZmShare.TYPE_DOMAIN
 */
ZmShare.prototype.isDomain =
function() {
	return this.grantee.type == ZmShare.TYPE_DOMAIN;
};
/**
 * Checks if the grantee type is "guest".
 * 
 * @return	{Boolean}	<code>true</code> if type "guest"
 * @see		ZmShare.TYPE_GUEST
 */
ZmShare.prototype.isGuest =
function() {
	return this.grantee.type == ZmShare.TYPE_GUEST;
};
/**
 * Checks if the grantee type is "public".
 * 
 * @return	{Boolean}	<code>true</code> if type "public"
 * @see		ZmShare.TYPE_PUBLIC
 */
ZmShare.prototype.isPublic =
function() {
	return (this.grantee.type == ZmShare.TYPE_PUBLIC);
};

/**
 * Grants the permission.
 * 
 * @param	{constant}	perm	the permission (see <code>ZmShare.PERM_</code> constants)
 * @param	{String}	pw		
 * @param	{constant}	replyType		ZmShareReply.NONE, ZmShareReply.STANDARD or ZmShareReply.QUICK
 * @param	{constant}	shareAction		the share action, e.g. ZmShare.NEW or ZmShare.EDIT
 * @param	{ZmBatchCommand}	batchCmd	the batch command
 */
ZmShare.prototype.grant =
function(perm, pw, notes, replyType, shareAction, batchCmd) {
	this.link.perm = perm;
	var respCallback = new AjxCallback(this, this._handleResponseGrant, [notes, replyType, shareAction]);
	this._shareAction("grant", null, {perm: perm, pw: pw}, respCallback, batchCmd, notes);
};

/**
 * @private
 */
ZmShare.prototype._handleResponseGrant =
function(notes, replyType, shareAction, result) {
	var actionResponseType = this.isBriefcaseDocument() ? "DocumentActionResponse": "FolderActionResponse";
	var action = result.getResponse()[actionResponseType].action;
	this.grantee.id = action.zid;
	this.grantee.email = action.d;
    if(replyType != ZmShareReply.NONE && action.d && action.zid) {
        this._sendShareNotification(this.grantee.email, action.id,
		                            notes, shareAction);
    }
};

/**
 * @private
 */
ZmShare.prototype._sendShareNotification =
function(userEmail, folderId, notes, action, callback) {
    var soapDoc = AjxSoapDoc.create("SendShareNotificationRequest", "urn:zimbraMail");
    if (action != ZmShare.NEW)
        soapDoc.setMethodAttribute("action", action);
    var itemNode = soapDoc.set("item");
    itemNode.setAttribute("id", folderId);
    var emailNode = soapDoc.set("e");
    emailNode.setAttribute("a",userEmail);
    soapDoc.set("notes", notes);
    appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback});
};

/**
 * Revokes the share.
 * 
 * @param	{AjxCallback}	callback	the callback
 */
ZmShare.prototype.revoke = 
function(callback) {
	var isAllShare = this.grantee && (this.grantee.type == ZmShare.TYPE_ALL);
	var actionAttrs = { zid: this.isPublic() ? ZmShare.ZID_PUBLIC : isAllShare ? ZmShare.ZID_ALL : this.grantee.id };
	var respCallback = new AjxCallback(this, this._handleResponseRevoke, [callback]);
	this._shareAction("!grant", actionAttrs, null, respCallback);
};

/**
 * Revokes multiple shares.
 * 
 * @param	{AjxCallback}	callback	the callback
 * @param	{Object}	args		not used
 * @param	{ZmBatchCommand}	batchCmd	the batch command
 */
ZmShare.prototype.revokeMultiple =
function(callback, args, batchCmd) {
	var actionAttrs = { zid: this.isPublic() ? ZmShare.ZID_PUBLIC : this.grantee.id };
	var respCallback = new AjxCallback(this, this._handleResponseRevoke, [callback]);
	this._shareAction("!grant", actionAttrs, null, respCallback, batchCmd);
};

/**
 * @private
 */
ZmShare.prototype._handleResponseRevoke =
function(callback) {
	if (callback) {
		callback.run();
	}
};

/**
 * Accepts the share.
 * 
 */
ZmShare.prototype.accept = 
function(name, color, replyType, notes, callback, owner) {
	var respCallback = new AjxCallback(this, this._handleResponseAccept, [replyType, notes, callback, owner]);
	var params = {
		l: ZmOrganizer.ID_ROOT,
		name: name,
		zid: this.grantor.id,
		rid: ZmOrganizer.normalizeId(this.link.id),
		view: this.link.view
	};
	if (color) {
		params.color = color;
	}

	if (String(color).match(/^#/)) {
		params.rgb = color;
		delete params.color;
	}

	if (appCtxt.get(ZmSetting.CALENDAR_ENABLED) && ZmOrganizer.VIEW_HASH[ZmOrganizer.CALENDAR][this.link.view]) {
		params.f = ZmOrganizer.FLAG_CHECKED;
	}
	ZmMountpoint.create(params, respCallback);
};

/**
 * @private
 */
ZmShare.prototype._handleResponseAccept =
function(replyType, notes, callback, owner) {

	this.notes = notes;

	if (callback) {
		callback.run();
	}

	// check if we need to send message
	if (replyType != ZmShareReply.NONE) {
		this.sendMessage(ZmShare.ACCEPT, null, owner);
	}
};

/**
 * Sends a message.
 * 
 * @param	{constant}			mode		the request mode
 * @param	{AjxVector}			addrs		a vector of {@link AjxEmailAddress} objects or <code>null</code> to send to the grantee
 * @param	{String}			owner		the message owner
 * @param	{ZmBatchCommand}	batchCmd	batchCommand to put the SendMsgRequest into or <code>null</code> to send the message immediately
 */
ZmShare.prototype.sendMessage =
function(mode, addrs, owner, batchCmd) {
	// generate message
	if (!addrs) {
		var email = this.grantee.email;
		addrs = new AjxVector();
		addrs.add(new AjxEmailAddress(email, AjxEmailAddress.TO));
	}
	var msg = this._createMsg(mode, addrs, owner);
	var accountName = appCtxt.multiAccounts ? (this.object ? (this.object.getAccount().name) : null ) : null;

	// send message
	msg.send(false, null, null, accountName, false, false, batchCmd);
};


// Protected methods

/**
 * text formatters
 * 
 * @private
 */
ZmShare._getText =
function(mode) {
	if (!ZmShare._TEXT) {
		ZmShare._TEXT = {};
		ZmShare._TEXT[ZmShare.NEW] = new AjxMessageFormat(ZmMsg.shareCreatedText);
		ZmShare._TEXT[ZmShare.EDIT] = new AjxMessageFormat(ZmMsg.shareModifiedText);
		ZmShare._TEXT[ZmShare.DELETE] = new AjxMessageFormat(ZmMsg.shareRevokedText);
		ZmShare._TEXT[ZmShare.ACCEPT] = new AjxMessageFormat(ZmMsg.shareAcceptedText);
		ZmShare._TEXT[ZmShare.DECLINE] = new AjxMessageFormat(ZmMsg.shareDeclinedText);
		ZmShare._TEXT[ZmShare.NOTIFY] = new AjxMessageFormat(ZmMsg.shareNotifyText);
	}
	return ZmShare._TEXT[mode];
};
	
/**
 * html formatters
 * 
 * @private
 */
ZmShare._getHtml =
function(mode) {
	if (!ZmShare._HTML) {
		ZmShare._HTML = {};
		ZmShare._HTML[ZmShare.NEW] = new AjxMessageFormat(ZmMsg.shareCreatedHtml);
		ZmShare._HTML[ZmShare.EDIT] = new AjxMessageFormat(ZmMsg.shareModifiedHtml);
		ZmShare._HTML[ZmShare.DELETE] = new AjxMessageFormat(ZmMsg.shareRevokedHtml);
		ZmShare._HTML[ZmShare.ACCEPT] = new AjxMessageFormat(ZmMsg.shareAcceptedHtml);
		ZmShare._HTML[ZmShare.DECLINE] = new AjxMessageFormat(ZmMsg.shareDeclinedHtml);
		ZmShare._HTML[ZmShare.NOTIFY] = new AjxMessageFormat(ZmMsg.shareNotifyHtml);
	}
	return ZmShare._HTML[mode];
};

/**
 * @private
 */
ZmShare._getHtmlNote =
function() {
	if (!ZmShare._HTML_NOTE) {
		ZmShare._HTML_NOTE = new AjxMessageFormat(ZmMsg.shareNotesHtml);
	}
	return ZmShare._HTML_NOTE;
};

/**
 * xml formatter
 * 
 * @private
 */
ZmShare._getXml =
function() {
	if (!ZmShare._XML) {
		var pattern = [
			'<share xmlns="{0}" version="{1}" action="{2}" >',
			'  <grantee id="{3}" email="{4}" name="{5}" />',
			'  <grantor id="{6}" email="{7}" name="{8}" />',
			'  <link id="{9}" name="{10}" view="{11}" perm="{12}" />',
			'  <notes>{13}</notes>',
			'</share>'
		].join("\n");
		ZmShare._XML = new AjxMessageFormat(pattern);
	}
	return ZmShare._XML;
};

ZmShare.prototype.isBriefcaseDocument =
function () {
	return this.object.type == ZmItem.BRIEFCASE_ITEM;
};

/**
 * General method for handling the SOAP call. 
 * 
 * <strong>Note:</strong> Exceptions need to be handled by calling method.
 * 
 * @private
 */
ZmShare.prototype._shareAction =
function(operation, actionAttrs, grantAttrs, callback, batchCmd, notes) {
	var actionRequest = this.isBriefcaseDocument() ? "DocumentActionRequest": "FolderActionRequest";
	var soapDoc = AjxSoapDoc.create(actionRequest, "urn:zimbraMail");

	var actionNode = soapDoc.set("action");
	actionNode.setAttribute("op", operation);
	if (this.object.rid && this.object.zid) {
		actionNode.setAttribute("id", this.object.zid + ":" + this.object.rid);
	} else {
		actionNode.setAttribute("id", this.object.id);
	}
	for (var attr in actionAttrs) {
		actionNode.setAttribute(attr, actionAttrs[attr]);
	}

	if (operation != "!grant") {
		var shareNode = soapDoc.set("grant", null, actionNode);
		shareNode.setAttribute("gt", this.grantee.type);
		if (this.link.inh) {
			shareNode.setAttribute("inh", "1");
		}
		if (!this.isPublic()) {
			shareNode.setAttribute("d", this.isGuest() ? (this.grantee.id || this.grantee.name) : this.grantee.name);
		}
		for (var attr in grantAttrs) {
			shareNode.setAttribute(attr, (grantAttrs[attr] || ""));
		}
	}
	var respCallback = new AjxCallback(this, this._handleResponseShareAction, [callback]);
	var errorCallback = this._handleErrorShareAction.bind(this, notes);
	
	if (batchCmd) {
		batchCmd.addRequestParams(soapDoc, respCallback, errorCallback);
	} else {
		appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true,
													  callback: respCallback, errorCallback: errorCallback});
	}
};

/*
ZmShare.prototype._shareActionJson =
function(operation, actionAttrs, grantAttrs, callback, batchCmd) {

	var jsonObj = {FolderActionRequest:{_jsns:"urn:zimbraMail"}};
	var action = jsonObj.FolderActionRequest.action = {op:operation};
	if (this.object.rid && this.object.zid) {
		action.id = this.object.zid + ":" + this.object.rid;
	} else {
		action.id = this.object.id;
	}
	for (var attr in actionAttrs) {
		action.attr = actionAttrs[attr];
	}

	if (operation != "!grant") {
		var share = action.grant = {gt:this.grantee.type};
		if (this.link.inh) {
			share.inh = "1";
		}
		if (!this.isPublic()) {
			share.d = this.isGuest() ? this.grantee.id : this.grantee.name;
		}
		for (var attr in grantAttrs) {
			share.attr = grantAttrs[attr] || "";
		}
	}
	var respCallback = new AjxCallback(this, this._handleResponseShareAction, [callback]);
	var errorCallback = new AjxCallback(this, this._handleErrorShareAction);

	if (batchCmd) {
		batchCmd.addRequestParams(jsonObj, respCallback, errorCallback);
	} else {
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true,
												callback: respCallback, errorCallback: errorCallback});
	}
};
*/

/**
 * @private
 */
ZmShare.prototype._handleResponseShareAction =
function(callback, result) {
	if (callback) {
		callback.run(result);
	}
};

/**
 * @private
 */
ZmShare.prototype._handleErrorShareAction =
function(notes, ex) {
	var message = ZmMsg.unknownError;
	if (ex.isZmCsfeException && ex.code == "account.NO_SUCH_ACCOUNT") {
		if (!this._unknownUserFormatter) {
			this._unknownUserFormatter = new AjxMessageFormat(ZmMsg.unknownUser);
		}
		message = this._unknownUserFormatter.format(AjxStringUtil.htmlEncode(this.grantee.name));
		// NOTE: This prevents details from being shown
		ex = null;
	}
    if (ex.isZmCsfeException && ex.code == "service.PERM_DENIED") {
        //bug:67698 Displaying proper error message when grantee is owner
        if(this.object.getOwner() == this.grantee.name){
            message = ZmMsg.cannotGrantAccessToOwner;
            ex = null;
        }
        else{
            message = ZmMsg.errorPermission;
        }
	}
	if (ex.isZmCsfeException && ex.code == "mail.GRANT_EXISTS") {
		this._popupAlreadySharedWarningDialog(notes);
		return true;
	}

	appCtxt.getAppController().popupErrorDialog(message, ex, null, true, null, null, true);
	return true;
};


ZmShare.prototype._popupAlreadySharedWarningDialog =
function(notes) {
    var isPublic = this.isPublic(),
        fmtMsg,
        message,
        dialog;
	if (!this._shareExistsFormatter) {
        fmtMsg = isPublic ? ZmMsg.shareExistsPublic : ZmMsg.shareExists;
		this._shareExistsFormatter = new AjxMessageFormat(fmtMsg);
	}
	message = this._shareExistsFormatter.format(AjxStringUtil.htmlEncode(this.grantee.name));

	//creating a dialog for each one of those instead of re-using the singleton dialog from appCtxt for the case you are re-sharing with multiple users already shared. It's not ideal but it would have a warning for each. Since it's rare I think it's good enough for simplicity.
	dialog = new DwtMessageDialog({parent:appCtxt._shell, buttons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON], id:"ResendCancel"});
	dialog.getButton(DwtDialog.OK_BUTTON).setText(ZmMsg.resend);
	dialog.reset();
	dialog.setMessage(message, DwtMessageDialog.WARNING_STYLE);
	var dialogcallback = this._sendAnyway.bind(this, notes, ZmShare.NEW,
	                                           dialog);
	dialog.registerCallback(DwtDialog.OK_BUTTON, dialogcallback);
    dialog.setButtonEnabled(DwtDialog.OK_BUTTON, !isPublic);
	dialog.associateEnterWithButton(DwtDialog.OK_BUTTON);
	dialog.popup(null, DwtDialog.OK_BUTTON);
};

ZmShare.prototype._sendAnyway =
function(notes, action, dialog) {
	dialog.popdown();
	var callback = this._sendAnywayCallback.bind(this);
	this._sendShareNotification(this.grantee.name, this.object.id,
	                            notes, action, callback);
};

ZmShare.prototype._sendAnywayCallback =
function() {
	appCtxt.setStatusMsg(ZmMsg.notificationSent, ZmStatusView.LEVEL_INFO);
};


/**
 * @private
 */
ZmShare.prototype._createMsg =
function(mode, addrs, owner) {
	// generate message
	var textPart = this._createTextPart(mode);
	var htmlPart = this._createHtmlPart(mode);

	var topPart = new ZmMimePart();
	topPart.setContentType(ZmMimeTable.MULTI_ALT);
	topPart.children.add(textPart);
	topPart.children.add(htmlPart);

	if (mode != ZmShare.NOTIFY) {
		var xmlPart = this._createXmlPart(mode);
		topPart.children.add(xmlPart);
	}

	var msg = new ZmMailMsg();
	if (mode == ZmShare.ACCEPT || mode == ZmShare.DECLINE) {
		msg.setAddress(AjxEmailAddress.FROM, new AjxEmailAddress(this.grantee.email, AjxEmailAddress.FROM));
		var fromAddrs = new AjxVector();
		if (owner && owner != this.grantor.email) {
			fromAddrs.add(new AjxEmailAddress(owner, AjxEmailAddress.TO));
		}
		fromAddrs.add(new AjxEmailAddress(this.grantor.email, AjxEmailAddress.TO));
		msg.setAddresses(AjxEmailAddress.TO, fromAddrs);
	} else {
		msg.setAddress(AjxEmailAddress.FROM, new AjxEmailAddress(this.grantee.email, AjxEmailAddress.FROM));
		var addrType = (addrs.size() > 1) ? AjxEmailAddress.BCC : AjxEmailAddress.TO;
		msg.setAddresses(addrType, addrs);
	}
    //bug:10008 modified subject to support subject normalization for conversation
    msg.setSubject(ZmShare._SUBJECTS[mode] + ": " + AjxMessageFormat.format(ZmMsg.sharedBySubject, [this.link.name, this.grantor.name]));	
	msg.setTopPart(topPart);

	return msg;
};

/**
 * @private
 */
ZmShare.prototype._createTextPart =
function(mode) {
	var formatter = ZmShare._getText(mode);
	var content = this._createContent(formatter);
	if (this.notes) {
		var notes = this.notes;
		content = [content, ZmItem.NOTES_SEPARATOR, notes].join("\n");
	}

	var mimePart = new ZmMimePart();
	mimePart.setContentType(ZmMimeTable.TEXT_PLAIN);
	mimePart.setContent(content);

	return mimePart;
};

/**
 * @private
 */
ZmShare.prototype._createHtmlPart =
function(mode) {
	var formatter = ZmShare._getHtml(mode);
	var content = this._createContent(formatter);
	if (this.notes) {
		formatter = ZmShare._getHtmlNote();
		var notes = AjxStringUtil.nl2br(AjxStringUtil.htmlEncode(this.notes));
		content = [content, formatter.format(notes)].join("");
	}

	var mimePart = new ZmMimePart();
	mimePart.setContentType(ZmMimeTable.TEXT_HTML);
	mimePart.setContent(content);

	return mimePart;
};

/**
 * @private
 */
ZmShare.prototype._createXmlPart =
function(mode) {
	var folder = (appCtxt.isOffline) ? appCtxt.getFolderTree().getByPath(this.link.name) : null;
	var linkId = (folder) ? folder.id : this.link.id;
	var params = [
		ZmShare.URI, 
		ZmShare.VERSION, 
		mode,
		this.grantee.id, 
		this.grantee.email,
		AjxStringUtil.xmlAttrEncode(this.grantee.name),
		this.grantor.id, 
		this.grantor.email,
		AjxStringUtil.xmlAttrEncode(this.grantor.name),
		linkId,
		AjxStringUtil.xmlAttrEncode(this.link.name), 
		this.link.view, 
		this.link.perm,
		AjxStringUtil.xmlEncode(this.notes)
	];
	var content = ZmShare._getXml().format(params);

	var mimePart = new ZmMimePart();
	mimePart.setContentType(ZmMimeTable.XML_ZIMBRA_SHARE);
	mimePart.setContent(content);

	return mimePart;
};

/**
 * @private
 */
ZmShare.prototype._createContent =
function(formatter) {
	var role = ZmShare.getRoleFromPerm(this.link.perm);
	var owner = this.object ? (this.object.owner || this.grantor.name) : this.grantor.name;
	owner = AjxStringUtil.htmlEncode(owner);
	var params = [
		AjxStringUtil.htmlEncode(this.link.name),
		"(" + ZmShare._getFolderType(this.link.view) + ")",
		owner,
		AjxStringUtil.htmlEncode(this.grantee.name),
		ZmShare.getRoleName(role),
		ZmShare.getRoleActions(role)
	];
	return formatter.format(params);
};

ZmShare.getRoleFromPerm = function(perm) {
	if (!perm) { return ZmShare.ROLE_NONE; }

	if (perm.indexOf(ZmShare.PERM_ADMIN) != -1) {
		return ZmShare.ROLE_ADMIN;
	}
	if (perm.indexOf(ZmShare.PERM_WORKFLOW) != -1) {
		return ZmShare.ROLE_MANAGER;
	}
	if (perm.indexOf(ZmShare.PERM_READ) != -1) {
		return ZmShare.ROLE_VIEWER;
	}

	return ZmShare.ROLE_NONE;
};

/**
 * Backwards compatibility.
 * @private
 */
ZmShare._getRoleFromPerm = ZmShare.getRoleFromPerm;

/**
 * Revokes all grants for the given zid (one whose account has been
 * removed).
 *
 * @param {String}	zid			the zimbra ID
 * @param {constant}	granteeType	the grantee type (see <code>ZmShare.TYPE_</code> constants)
 * @param {AjxCallback}	callback		the client callback
 * @param {ZmBatchCommand}	batchCmd		the batch command
 */
ZmShare.revokeOrphanGrants =
function(zid, granteeType, callback, batchCmd) {

	var jsonObj = {
		FolderActionRequest: {
			_jsns:	"urn:zimbraMail",
			action:	{
				op:		"revokeorphangrants",
				id:		ZmFolder.ID_ROOT,
				zid:	zid,
				gt:		granteeType
			}
		}
	};

	if (batchCmd) {
		var respCallback = new AjxCallback(null, ZmShare._handleResponseRevokeOrphanGrants, [callback]);
		batchCmd.addRequestParams(jsonObj, respCallback);
	} else {
		appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	}
};

/**
 * @private
 */
ZmShare._handleResponseRevokeOrphanGrants =
function(callback) {
	if (callback) {
		callback.run();
	}
};

/**
 * Creates or updates a ZmShare from share info that comes in JSON form from
 * GetShareInfoResponse.
 *
 * @param shareInfo	[object]		JSON representing share info
 * @param share		[ZmShare]*		share to update
 */
ZmShare.getShareFromShareInfo =
function(shareInfo, share) {

	share = share || new ZmShare();

	// grantee is the user, or a group they belong to
	share.grantee = share.grantee || {};
	if (shareInfo.granteeName)	{ share.grantee.name	= shareInfo.granteeName; }
	if (shareInfo.granteeId)	{ share.grantee.id		= shareInfo.granteeId; }
	if (shareInfo.granteeType)	{ share.grantee.type	= shareInfo.granteeType; }

	// grantor is the owner of the shared folder
	share.grantor = share.grantor || {};
	if (shareInfo.ownerEmail)	{ share.grantor.email	= shareInfo.ownerEmail; }
	if (shareInfo.ownerName)	{ share.grantor.name	= shareInfo.ownerName; }
	if (shareInfo.ownerId)		{ share.grantor.id		= shareInfo.ownerId; }

	// link is the shared folder
	share.link = share.link || {};
	share.link.view	= shareInfo.view || "message";
	if (shareInfo.folderId)		{ share.link.id		= shareInfo.folderId; }
	if (shareInfo.folderPath)	{ share.link.path	= shareInfo.folderPath; }
	if (shareInfo.folderPath)	{ share.link.name	= shareInfo.folderPath.substr(shareInfo.folderPath.lastIndexOf("/") + 1); }
	if (shareInfo.rights)		{ share.setPermissions(shareInfo.rights); }

	// mountpoint is the local folder, if the share has been accepted and mounted
	if (shareInfo.mid) {
		share.mounted		= true;
		share.mountpoint	= share.mountpoint || {};
		share.mountpoint.id	= shareInfo.mid;
		var mtpt = appCtxt.getById(share.mountpoint.id);
		if (mtpt) {
			share.mountpoint.name = mtpt.getName();
			share.mountpoint.path = mtpt.getPath();
		}
	}

	share.action	= "new";
	share.version	= "0.1";

	share.type = ZmShare.SHARE;

	return share;
};

/**
 * Creates or updates a ZmShare from a ZmOrganizer that's a mountpoint. The grantee is
 * the current user.
 *
 * @param link		[ZmFolder]		mountpoint
 * @param share		[ZmShare]*		share to update
 */
ZmShare.getShareFromLink =
function(link, share) {

	share = share || new ZmShare();

	// grantor is the owner of the shared folder
	share.grantor = share.grantor || {};
	if (link.owner)	{ share.grantor.email	= link.owner; }
	if (link.zid)	{ share.grantor.id		= link.zid; }

	// link is the shared folder
	share.link = share.link || {};
	share.link.view	= ZmOrganizer.VIEWS[link.type][0];
	if (link.rid)	{ share.link.id = link.rid; }

	var linkShare = link.getMainShare();
	share.link.name = linkShare ? linkShare.link.name : link.name;
	share.setPermissions(linkShare ? linkShare.link.perm : link.perm);

	// mountpoint is the local folder
	share.mounted = true;
	share.mountpoint = share.mountpoint || {};
	share.mountpoint.id		= link.id;
	share.mountpoint.name	= link.getName();
	share.mountpoint.path	= link.getPath();

	share.action	= "new";
	share.version	= "0.1";

	share.type = ZmShare.SHARE;

	return share;
};

/**
 * Updates a ZmShare that represents a grant
 *
 * @param share		[ZmShare]		folder grant
 * @param oldShare	[ZmShare]*		share to update
 */
ZmShare.getShareFromGrant =
function(share, oldShare) {

	share.link = share.link || {};
	share.link.id	= share.object && (share.object.nId || share.object.id);
	share.link.path = share.object && share.object.getPath();
	share.link.name = share.object && share.object.getName();

	share.type = ZmShare.GRANT;
	share.domId = oldShare && oldShare.domId;

	return share;
};
}
}
