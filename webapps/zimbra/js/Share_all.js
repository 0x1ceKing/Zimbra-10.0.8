if (AjxPackage.define("Share")) {
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
/*
 * Package: Share
 * 
 * Supports: 
 * 	- Sharing folders with other users
 * 	- Handling links/mountpoints
 * 
 * Loaded:
 * 	- When share or mountpoint data arrives in a <refresh> block
 * 	- When user creates a share
 */
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
if (AjxPackage.define("zimbraMail.share.model.ZmShareProxy")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmShareProxy = function(params) {
    params.type = ZmOrganizer.SHARE;
    ZmOrganizer.call(this, params);
};
ZmShareProxy.prototype = new ZmFolder;
ZmShareProxy.prototype.constructor = ZmShareProxy;

ZmShareProxy.prototype.toString = function() {
    return "ZmShareProxy";
};

// Constants

ZmShareProxy.ID_LOADING = -1;
ZmShareProxy.ID_NONE_FOUND = -2;
ZmShareProxy.ID_WARNING = -2;
ZmShareProxy.ID_ERROR = -3;

// Data

ZmShareProxy.prototype.TOOLTIP_TEMPLATE = "share.Widgets#ZmShareProxyToolTip";

// ZmOrganizer methods

ZmShareProxy.prototype.getIcon = function() {
    // icons for loading states
    var m = String(this.id).match(/^(-\d)(?::(.*))?$/);
    switch (Number(m && m[1])) { // NOTE: case is === !!!
        case ZmShareProxy.ID_LOADING: return "Spinner";
        case ZmShareProxy.ID_NONE_FOUND: return "Warning";
        case ZmShareProxy.ID_ERROR: return "Critical";
    }

    // icon for share owner
    if (!this.shareInfo) return "SharedMailFolder";

    // icon based on view type
    var type = ZmOrganizer.TYPE[this.shareInfo.view];
    var orgPackage = ZmOrganizer.ORG_PACKAGE[type];
    if (orgPackage) AjxDispatcher.require(orgPackage);
    var orgClass = window[ZmOrganizer.ORG_CLASS[type]];
    return orgClass ? orgClass.prototype.getIcon.call(this) : "Folder";
};

ZmShareProxy.prototype.getToolTip = function(force) {
    if (!this.shareInfo) return null;
    if (force || !this._tooltip) {
        this._tooltip = AjxTemplate.expand(this.TOOLTIP_TEMPLATE, this.shareInfo);
    }
    return this._tooltip;
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmMountpoint")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file defines a mountpoint organizer class.
 */

/**
 * Creates a mountpoint organizer.
 * @class
 * This class represents a mountpoint organizer. This class can be used to represent generic
 * mountpoints in an overview tree but is mostly used as a utility to create mountpoints.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmOrganizer
 */
ZmMountpoint = function(params) {
	params.type = ZmOrganizer.MOUNTPOINT;
	ZmOrganizer.call(this, params);
	this.view = params.view;
}

ZmMountpoint.prototype = new ZmOrganizer;
ZmMountpoint.prototype.constructor = ZmMountpoint;

// Constants
ZmMountpoint.__CREATE_PARAMS = AjxUtil.arrayAsHash(["l", "name", "zid", "rid", "owner", "path", "view", "color", "rgb", "f"]);


// Public Methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmMountpoint.prototype.toString =
function() {
	return "ZmMountpoint";
};

/**
 * Creates the mountpoint.
 * 
 * @param {Hash}	params		a hash of parameters
 * @param	{String}	params.name		the name
 */
ZmMountpoint.create =
function(params, callback) {
	var soapDoc = AjxSoapDoc.create("CreateMountpointRequest", "urn:zimbraMail");

	var linkNode = soapDoc.set("link");
	for (var p in params) {
		if (!(p in ZmMountpoint.__CREATE_PARAMS)) continue;
		linkNode.setAttribute(p, params[p]);
	}

	var errorCallback = new AjxCallback(null, ZmMountpoint._handleCreateError, params.name);
	appCtxt.getAppController().sendRequest({soapDoc:soapDoc,
											asyncMode:true,
											callback:callback,
											errorCallback:errorCallback});
};

/**
 * @private
 */
ZmMountpoint._handleCreateError =
function(name, response) {

	var msg;
	if (response.code == ZmCsfeException.SVC_PERM_DENIED || response.code == ZmCsfeException.MAIL_NO_SUCH_FOLDER) {
		msg = ZmCsfeException.getErrorMsg(response.code);
	} else if (response.code == ZmCsfeException.MAIL_ALREADY_EXISTS) {
        var type = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getFolderTypeByName(name);
		msg = AjxMessageFormat.format(ZmMsg.errorAlreadyExists, [name,type.toLowerCase()]);
	}
	if (msg) {
		appCtxt.getAppController().popupErrorDialog(msg, null, null, true);
		return true;
	}
};
}

if (AjxPackage.define("zimbraMail.share.view.ZmShareReply")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a share reply widget.
 * @class
 * This class implements a share reply query box and additional input 
 * controls to allow the user to specify the reply type and quick reply 
 * note, if wanted. This control can be used from within the various
 * share dialogs to add reply capabilities.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}		className	the class name
 * @param	{Array}	options			an array of options
 * @extends		DwtComposite
 */
ZmShareReply = function(params) {

	params = Dwt.getParams(arguments, ZmShareReply.PARAMS);

	params.className = params.className || "ZmShareReply";
	params.id = "ZmShareReply";
	DwtComposite.call(this, params);
	this._tabGroup = new DwtTabGroup(this.toString());
	this._initControl(params);
};

ZmShareReply.PARAMS = [ 'parent', 'className', 'options' ];

ZmShareReply.prototype = new DwtComposite;
ZmShareReply.prototype.constructor = ZmShareReply;
//ZmShareReply.prototype.isFocusable = true;

// Constants
/**
 * Defines the "none" reply type.
 */
ZmShareReply.NONE		= 0;
/**
 * Defines the "standard" reply type.
 */
ZmShareReply.STANDARD	= 1;
/**
 * Defines the "quick" reply type.
 */
ZmShareReply.QUICK		= 2;

ZmShareReply.DEFAULT_OPTIONS = [
	ZmShareReply.NONE, ZmShareReply.STANDARD, ZmShareReply.QUICK
];

ZmShareReply.EXTERNAL_USER_OPTIONS = [
	ZmShareReply.STANDARD, ZmShareReply.QUICK
];

ZmShareReply._LABELS = {};
ZmShareReply._LABELS[ZmShareReply.NONE]		= ZmMsg.sendNoMailAboutShare;
ZmShareReply._LABELS[ZmShareReply.STANDARD] = ZmMsg.sendStandardMailAboutShare;
ZmShareReply._LABELS[ZmShareReply.QUICK]	= ZmMsg.sendStandardMailAboutSharePlusNote;

// Public methods

/**
 * Sets the reply type.
 * 
 * @param	{constant}	type		the type
 */
ZmShareReply.prototype.setReplyType =
function(type) {
	this._replyType.setSelectedValue(type);
	Dwt.setVisible(this._replyStandardMailNoteEl, type == ZmShareReply.STANDARD || type == ZmShareReply.QUICK);
	Dwt.setVisible(this._replyNoteEl, type == ZmShareReply.QUICK);
};

/**
 * Gets the reply type.
 * 
 * @return	{constant}		the reply type
 */
ZmShareReply.prototype.getReplyType =
function() {
	return this._replyType.getValue();
};

/**
 * Sets the reply note.
 * 
 * @param	{String}	note		the note
 */
ZmShareReply.prototype.setReplyNote =
function(note) {
	this._replyNoteEl.value = note;
};

/**
 * Gets the reply note.
 * 
 * @return	{String}		the reply note
 */
ZmShareReply.prototype.getReplyNote =
function() {
	return this._replyNoteEl.value;
};

/**
 * Sets the reply options.
 * 
 * @param	{Array}	options		an array of options
 */
ZmShareReply.prototype.setReplyOptions =
function(options) {
	if (this._replyOptions == options) return;

	this._replyOptions = options;
	this._replyType.clearOptions();

	for (var i = 0; i < options.length; i++) {
		var value = options[i];
		this._replyType.addOption(ZmShareReply._LABELS[value], false, value);
	}
};

/**
 * Gets the reply options.
 * 
 * @return	{Array}	an array of options
 */
ZmShareReply.prototype.getReplyOptions =
function() {
	return this._replyOptions;
};

// Protected methods

ZmShareReply.prototype._handleReplyType =
function(event) {
	var type = this._replyType.getValue();
	this.setReplyType(type);
};

ZmShareReply.prototype._initControl = function(params) {

	this._replyType = new DwtSelect({
		parent:   this,
		id:       "ZmShareReplySelect",
		legendId: params.legendId
	});
    var options = params.options || ZmShareReply.DEFAULT_OPTIONS;
    this.setReplyOptions(options);
	this._replyType.addChangeListener(this._handleReplyType.bind(this));

	var doc = document;
	this._replyTypeEl = doc.createElement("DIV");
	this._replyTypeEl.style.paddingBottom = "0.5em";
	this._replyTypeEl.appendChild(this._replyType.getHtmlElement());
	
	this._replyStandardMailNoteEl = doc.createElement("DIV");
	this._replyStandardMailNoteEl.style.paddingBottom = "0.125em";
	this._replyStandardMailNoteEl.style.width = "30em";
	this._makeFocusable(this._replyStandardMailNoteEl);
	this._replyStandardMailNoteEl.innerHTML = ZmMsg.sendMailAboutShareNote;
	
	var div = doc.createElement("DIV");
	this._replyNoteEl = doc.createElement("TEXTAREA");
	this._replyNoteEl.cols = 50;
	this._replyNoteEl.rows = 4;
	div.appendChild(this._replyNoteEl);
	
	this._replyControlsEl = doc.createElement("DIV");
	this._replyControlsEl.style.marginLeft = "1.5em";
	this._replyControlsEl.appendChild(this._replyTypeEl);
	this._replyControlsEl.appendChild(this._replyStandardMailNoteEl);
	this._replyControlsEl.appendChild(div);

	// append controls
	var element = this.getHtmlElement();
	element.appendChild(this._replyControlsEl);
	this._tabGroup.addMember(this._replyType);
	this._tabGroup.addMember(this._replyStandardMailNoteEl);
	this._tabGroup.addMember(this._replyNoteEl);
};

ZmShareReply.prototype.getTabGroupMember = function(){
	return this._tabGroup;
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmShareTreeView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmShareTreeView = function(params) {
    if (arguments.length == 0) return;
    params.className = params.className || "ZmShareTreeView OverviewTree";
	params.id = "ZmShareTreeView";
    DwtTree.call(this, params);
    // TODO: Why is this tree being set to overflow: visible?!?!
    this.getHtmlElement().style.overflow = "auto";
};
ZmShareTreeView.prototype = new DwtTree;
ZmShareTreeView.prototype.constructor = ZmShareTreeView;

ZmShareTreeView.TREE_INDEX = 0;

ZmShareTreeView.prototype.toString = function() {
    return "ZmShareTreeView";
};

//
// Public methods
//

ZmShareTreeView.prototype.set = function(params) {
    if (this.root) {
        this.removeNode(this.root);
    }
    this._itemHash = {};

    var root = this.root = params.dataTree.root;
    var rootItem = this._createTreeItem(this, root);
    var children = root.children.getArray();
    for (var i = 0; i < children.length; i++) {
        this._createTreeItem(rootItem, children[i]);
    }
};

ZmShareTreeView.prototype.getTreeItemById = function(id) {
    return this._itemHash && this._itemHash[id];
};

// DwtTree methods

ZmShareTreeView.prototype.removeChild = function(child) {
    delete this._itemHash[child.getData(Dwt.KEY_ID)];
    DwtTree.prototype.removeChild.apply(this, arguments);
};

// node manipulation

ZmShareTreeView.prototype.appendChild = function(newNode, parentNode, index, tooltip) {
    // add node
    var children = parentNode.children;
    index = index || children.size();
    children.add(newNode, index);

    // add tree item
    var parentTreeItem = this.getTreeItemById(parentNode.id);
    return this._createTreeItem(parentTreeItem, newNode, index, tooltip);
};

ZmShareTreeView.prototype.insertBefore = function(newNode, refNode) {
    var parent = refNode.parent;
    var index = parent.children.indexOf(refNode);
    this.appendChild(newNode, parent, index);
};

ZmShareTreeView.prototype.replaceNode = function(newNode, oldNode) {
    var parent = oldNode.parent;
    var children = parent.children;
    var index = children.indexOf(oldNode);
    var nextNode = children.get(index + 1);
    this.removeNode(oldNode);
    return nextNode ? this.insertBefore(newNode, nextNode) : this.appendChild(newNode, parent);
};

ZmShareTreeView.prototype.removeNode = function(oldNode) {
    // remove node
    if (oldNode.parent) {
        oldNode.parent.children.remove(oldNode);
    }

    // remove tree item
    var treeItem = this.getTreeItemById(oldNode.id);
    if (treeItem) {
        treeItem.parent.removeChild(treeItem);
    }
};

//
// Protected methods
//

ZmShareTreeView.prototype._createTreeItem = function(parent, organizer, index, tooltip) {
	var treeItemId = "ZmShareTreeItem_" + ZmShareTreeView.TREE_INDEX++;
    var treeItem = new DwtTreeItem({parent:parent, id: treeItemId, arrowDisabled: true, dynamicWidth: true});
    treeItem.setText(AjxStringUtil.htmlEncode(organizer.name));
    treeItem.setImage(organizer.getIcon());
    treeItem.setToolTipContent(tooltip);
    treeItem.setData(Dwt.KEY_ID, organizer.id);
    treeItem.setData(Dwt.KEY_OBJECT, organizer);
    this._itemHash[organizer.id] = treeItem;
    return treeItem;
};
}

if (AjxPackage.define("zimbraMail.share.view.dialog.ZmAcceptShareDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates an "accept share" dialog.
 * @class
 * This class represents an "accept share" dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmAcceptShareDialog = function(parent, className) {
	className = className || "ZmAcceptShareDialog";
	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.acceptShare,
						  standardButtons:[DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON], id: "ZmAcceptShare"});
	this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));
	this.setButtonListener(DwtDialog.NO_BUTTON, new AjxListener(this, this._handleNoButton));
	
	this.setView(this._createView());
	
	// create formatters
	this._headerFormatter = new AjxMessageFormat(ZmMsg.acceptShareHeader);
	this._detailsFormatter = new AjxMessageFormat(ZmMsg.acceptShareDetails);
};

ZmAcceptShareDialog.prototype = new DwtDialog;
ZmAcceptShareDialog.prototype.constructor = ZmAcceptShareDialog;

// Constants

ZmAcceptShareDialog._ACTIONS = {};
ZmAcceptShareDialog._ACTIONS[ZmShare.ROLE_NONE]		= ZmMsg.acceptShareDetailsNone;
ZmAcceptShareDialog._ACTIONS[ZmShare.ROLE_VIEWER]	= ZmMsg.acceptShareDetailsViewer;
ZmAcceptShareDialog._ACTIONS[ZmShare.ROLE_MANAGER]	= ZmMsg.acceptShareDetailsManager;
ZmAcceptShareDialog._ACTIONS[ZmShare.ROLE_ADMIN]	= ZmMsg.acceptShareDetailsAdmin;

// Public methods

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmShare}		share		the share
 * @param	{String}		fromAddr	the from address
 */
ZmAcceptShareDialog.prototype.popup =
function(share, fromAddr) {

	this._share = share;
	this._fromAddr = fromAddr;
	this._headerEl.innerHTML = this._headerFormatter.format([AjxStringUtil.htmlEncode(share.grantor.name) || share.grantor.email, AjxStringUtil.htmlEncode(share.link.name)]);

	var role = ZmShare._getRoleFromPerm(share.link.perm);
	var params = [
		ZmShare.getRoleName(role),
		ZmAcceptShareDialog._ACTIONS[role]   // TODO: Be able to generate custom perms list
	];
	this._detailsEl.innerHTML = this._detailsFormatter.format(params);
	this._questionEl.innerHTML = "<b>" + ZmMsg.acceptShareQuestion + "</b>";

	var namePart = share.grantor.name || (share.grantor.email && share.grantor.email.substr(0, share.grantor.email.indexOf('@')));
	this._nameEl.value = ZmShare.getDefaultMountpointName(namePart, share.link.name);

	this._reply.setReplyType(ZmShareReply.NONE);
	this._reply.setReplyNote("");

	var orgType = ZmOrganizer.TYPE[share.link.view];
	var icon = null;
	var orgClass = ZmOrganizer.ORG_CLASS[orgType];
	if (orgClass) {
		var orgPackage = ZmOrganizer.ORG_PACKAGE[orgType];
		if (orgPackage) {
			AjxDispatcher.require(orgPackage);
			//to fix bug 55320 - got rid of the calling getIcon on the prototype hack - that caused isRemote to set _isRemote on the prototype thus causing every object to have it by default set.
			var sample = new window[orgClass]({}); //get a sample object just for the icon
			sample._isRemote = true; //hack - so it would get the remote version of the icon
			icon = sample.getIcon();
		}
	}
	this._color.setImage(icon);
	this._color.setValue(ZmOrganizer.DEFAULT_COLOR[orgType]);
	
	DwtDialog.prototype.popup.call(this);
};

/**
 * Sets the accept listener.
 * 
 * @param	{AjxListener}		listener		the listener
 */
ZmAcceptShareDialog.prototype.setAcceptListener =
function(listener) {
	this.removeAllListeners(ZmAcceptShareDialog.ACCEPT);
	if (listener) {
		this.addListener(ZmAcceptShareDialog.ACCEPT, listener);
	}
};

// Protected methods

ZmAcceptShareDialog.prototype._handleYesButton =
function(ev) {
	var replyType = this._reply.getReplyType();
	var notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote(): "";
	var callback = new AjxCallback(this, this._yesButtonCallback, [ev]);
	this._share.accept(this._nameEl.value, this._color.getValue(), replyType, notes, callback, this._fromAddr);
};

ZmAcceptShareDialog.prototype._yesButtonCallback =
function(ev) {
	// notify accept listener and clear
	this.notifyListeners(ZmAcceptShareDialog.ACCEPT, ev);
	this.setAcceptListener(null);
	this.popdown();
};

ZmAcceptShareDialog.prototype._handleNoButton =
function(ev) {
	this.popdown();
};

ZmAcceptShareDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};

ZmAcceptShareDialog.prototype._createView =
function() {
	var view = new DwtComposite(this);

	this._headerEl = document.createElement("DIV");
	this._headerEl.style.marginBottom = "0.5em";
	this._detailsEl = document.createElement("DIV");
	this._detailsEl.style.marginBottom = "1em";
	this._detailsEl.id = "ZmAcceptShare_details";
	this._questionEl = document.createElement("DIV");
	this._questionEl.style.marginBottom = "0.5em";
	this._questionEl.id = "ZmAcceptShare_questions";
	this._nameEl = document.createElement("INPUT");
	this._nameEl.style.width = "20em";
	this._nameEl.id = "ZmAcceptShare_name";
	var nameElement = this._nameEl;

	this._color = new ZmColorButton({parent:this, id: "ZmAcceptShare_color"});

	var props = this._propSheet = new DwtPropertySheet(view);
	var propsEl = props.getHtmlElement();
	propsEl.style.marginBottom = "0.5em";
	propsEl.id = "ZmAcceptShare_props";
	props.addProperty(ZmMsg.nameLabel, nameElement);
	props.addProperty(ZmMsg.colorLabel, this._color);

	this._reply = new ZmShareReply(view);

	var settings = document.createElement("DIV");
	settings.style.marginLeft = "1.5em";
	settings.id = "ZmAcceptShare_settings";
	settings.appendChild(propsEl);
	settings.appendChild(this._reply.getHtmlElement());	

	var el = view.getHtmlElement();
	el.appendChild(this._headerEl);
	el.appendChild(this._detailsEl);
	el.appendChild(this._questionEl);
	el.appendChild(settings);

	this._tabGroup.addMember(this._color.getTabGroupMember());
	this._tabGroup.addMember(this._propSheet.getTabGroupMember());
	this._tabGroup.addMember(this._reply.getTabGroupMember());

	return view;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmDeclineShareDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates an "decline share" dialog.
 * @class
 * This class represents "decline share" dialog.
 * 
 * @param	{DwtControl}	shell		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmDeclineShareDialog = function(parent, className) {
	className = className || "ZmDeclineShareDialog";
	var title = ZmMsg.declineShare;
	var buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON ];
	DwtDialog.call(this, {parent:parent, className:className, title:title, standardButtons:buttons});
	this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));

	// create controls
	this._confirmMsgEl = document.createElement("DIV");
	this._confirmMsgEl.style.fontWeight = "bold";
	this._confirmMsgEl.style.marginBottom = "0.25em";
	this._reply = new ZmShareReply(this);

	// create view
	var view = new DwtComposite(this);
	var element = view.getHtmlElement();
	element.appendChild(this._confirmMsgEl);
	element.appendChild(this._reply.getHtmlElement());
	this.setView(view);

	// create formatters
	this._formatter = new AjxMessageFormat(ZmMsg.declineShareConfirm);
	this._tabGroup.addMember(this._reply.getTabGroupMember());
};

ZmDeclineShareDialog.prototype = new DwtDialog;
ZmDeclineShareDialog.prototype.constructor = ZmDeclineShareDialog;

// Public methods

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmShare}		share		the share
 * @param	{String}		fromAddr	the from address
 */
ZmDeclineShareDialog.prototype.popup =
function(share, fromAddr) {
	this._share = share;
    var isGuestShare = share.isGuest();
	this._fromAddr = fromAddr;
	var message = this._formatter.format([share.grantor.name, share.link.name]);
	this._confirmMsgEl.innerHTML = AjxStringUtil.htmlEncode(message);

	this._reply.setReplyType(ZmShareReply.STANDARD);
	this._reply.setReplyNote("");
    if (isGuestShare) {
        this._reply.setReplyOptions(ZmShareReply.EXTERNAL_USER_OPTIONS);
    }
    else {
        this._reply.setReplyOptions(ZmShareReply.DEFAULT_OPTIONS);
    }
	DwtDialog.prototype.popup.call(this);
};

/**
 * Sets the decline listener.
 * 
 * @param	{AjxListener}		listener		the listener
 */
ZmDeclineShareDialog.prototype.setDeclineListener =
function(listener) {
	this.removeAllListeners(ZmShare.DECLINE);
	if (listener) {
		this.addListener(ZmShare.DECLINE, listener);
	}
};

// Protected methods

ZmDeclineShareDialog.prototype._handleYesButton =
function(event) {
	// send mail
	var replyType = this._reply.getReplyType();

	if (replyType != ZmShareReply.NONE) {
		this._share.notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote(): "";

		this._share.sendMessage(ZmShare.DECLINE, null, this._fromAddr);
	}
	
	// notify decline listener and clear
	this.notifyListeners(ZmShare.DECLINE, event);
	this.setDeclineListener(null);

	this.popdown();
};

ZmDeclineShareDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmSharePropsDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a share properties dialog.
 * @class
 * This class represents a share properties dialog.
 * 
 * @param	{DwtComposite}	shell		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		DwtDialog
 */
ZmSharePropsDialog = function(shell, className) {
	className = className || "ZmSharePropsDialog";
	DwtDialog.call(this, {parent:shell, className:className, title:ZmMsg.shareProperties, id:"ShareDialog"});
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));

	var aifParams = {
		parent:		this,
		inputId:	"ShareDialog_grantee"
	}

	this._grantee = new ZmAddressInputField(aifParams);
	this._grantee.setData(Dwt.KEY_OBJECT, this);
	Dwt.associateElementWithObject(this._grantee, this);

	this._granteeInput = this._grantee.getInputElement();
	this._granteeInputId = this._grantee._htmlElId;
	Dwt.associateElementWithObject(this._granteeInput, this);

	// create auto-completer
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			options:		{massDLComplete:true},
			matchValue:		ZmAutocomplete.AC_VALUE_EMAIL,
			keyUpCallback:	this._acKeyUpListener.bind(this),
			contextId:		this.toString()
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		this._acAddrSelectList.handle(this._granteeInput, this._granteeInputId);
		this._grantee.setAutocompleteListView(this._acAddrSelectList);
	}

	// set view
	this.setView(this._createView());
};

ZmSharePropsDialog.prototype = new DwtDialog;
ZmSharePropsDialog.prototype.constructor = ZmSharePropsDialog;

ZmSharePropsDialog.prototype.isZmSharePropsDialog = true;
ZmSharePropsDialog.prototype.toString = function() { return "ZmSharePropsDialog"; };

// Constants


// modes
ZmSharePropsDialog.NEW	= ZmShare.NEW;
ZmSharePropsDialog.EDIT	= ZmShare.EDIT;

// roles
ZmSharePropsDialog.SHARE_WITH = [ 'user', 'external', 'public' ];
ZmSharePropsDialog.SHARE_WITH_MSG = {
	user:       ZmMsg.shareWithUserOrGroup,
	external:   ZmMsg.shareWithGuest,
	'public':     ZmMsg.shareWithPublicLong
};
ZmSharePropsDialog.SHARE_WITH_TYPE = {
	user:       ZmShare.TYPE_USER,
	external:   ZmShare.TYPE_GUEST,
	'public':     ZmShare.TYPE_PUBLIC
};


// Data

ZmSharePropsDialog.prototype._mode = ZmSharePropsDialog.NEW;


// Public methods


/**
 * Pops-up the dialog.
 * 
 * @param	{constant}	mode		the mode
 * @param	{ZmOrganizer}	object	the organizer object
 * @param	{ZmShare}	share		the share
 */
ZmSharePropsDialog.prototype.popup =
function(mode, object, share) {

	this._shareMode = mode;
	this._object = object;
	this._share = share;

	this._nameEl.innerHTML = AjxStringUtil.htmlEncode(object.name);
	this._typeEl.innerHTML = ZmMsg[ZmOrganizer.FOLDER_KEY[this._object.type]] || ZmMsg.folder;
	// TODO: False until server handling of the flag is added
	//if (object.type == ZmOrganizer.FOLDER) {
	if (false) {
		this._markReadEl.innerHTML = object.globalMarkRead ? ZmMsg.sharingDialogGlobalMarkRead :
                                                             ZmMsg.sharingDialogPerUserMarkRead;
		this._props.setPropertyVisible(this._markReadId, true)
	} else {
		this._props.setPropertyVisible(this._markReadId, false)
	}

	var isNewShare = (this._shareMode == ZmSharePropsDialog.NEW);
	var isUserShare = share ? share.isUser() || share.isGroup() : true;
	var isGuestShare = share ? share.isGuest() : false;
	var isPublicShare = share ? share.isPublic() : false;
	var supportsPublic = object.supportsPublicAccess();
	var externalEnabled = appCtxt.get(ZmSetting.SHARING_EXTERNAL_ENABLED);
	var publicEnabled = appCtxt.get(ZmSetting.SHARING_PUBLIC_ENABLED);

	this._userRadioEl.checked = isUserShare;
	this._userRadioEl.disabled = !isNewShare;
	this._guestRadioEl.checked = isGuestShare;
	this._guestRadioEl.disabled = !(externalEnabled && isNewShare  && supportsPublic);
	this._publicRadioEl.checked = isPublicShare;
	this._publicRadioEl.disabled = !(publicEnabled && isNewShare && supportsPublic && (object.type !== ZmOrganizer.FOLDER));

	var type = this._getType(isUserShare, isGuestShare, isPublicShare);
	this._handleShareWith(type);

	var grantee = "", password  = "";
	if (share) {
		if (isGuestShare) {
			grantee = share.grantee.id;
			password = share.link.pw;
		} else {
			grantee = (share.grantee.name || ZmMsg.userUnknown);
			password = share.grantee.id;
		}
	}
	this._grantee.clear();
	this._grantee.setValue(grantee, true);
	this._grantee.setEnabled(isNewShare);

	// Make all the properties visible so that their elements are in the
	// document. Otherwise, we won't be able to get a handle on them to perform
	// operations.
	this._props.setPropertyVisible(this._shareWithOptsId, true);
	//this._shareWithOptsProps.setPropertyVisible(this._passwordId, true);
	this._props.setPropertyVisible(this._shareWithBreakId, true);

	//this._passwordButton.setVisible(!isNewShare);
	//this._shareWithOptsProps.setPropertyVisible(this._passwordId, isGuestShare);
	//this._passwordInput.setValue(password, true);

	if (this._inheritEl) {
		this._inheritEl.checked = share ? share.link.inh : isNewShare;
	}

	var perm = share && share.link.perm;

	if (perm != null) {
		perm = perm.replace(/-./g, "");
		this._privateEl.checked = (perm.indexOf(ZmShare.PERM_PRIVATE) != -1);
		perm = perm.replace(/p/g, "");
		var role = ZmShare._getRoleFromPerm(perm);
		var radioEl = this._radioElByRole[role];
		if (radioEl) {
			radioEl.checked = true;
		}
	}

	this._privatePermissionEnabled = object.supportsPrivatePermission();
	this._privatePermission.setVisible(object.supportsPrivatePermission());

	if (perm == null || (perm == this._viewerRadioEl.value)) {
		this._viewerRadioEl.checked = true;
	} else if (perm == this._noneRadioEl.value) {
		this._noneRadioEl.checked = true;
	} else if (perm == this._managerRadioEl.value) {
		this._managerRadioEl.checked = true;
	} else if (perm == this._adminRadioEl.value) {
		this._adminRadioEl.checked = true;
	}

	// Force a reply if new share
	this._reply.setReplyType(ZmShareReply.STANDARD);
	this._reply.setReplyNote("");

	this._populateUrls();

    DwtDialog.prototype.popup.call(this);

	var size = this.getSize();
	Dwt.setSize(this._granteeInput, 0.6*size.x);
	//Dwt.setSize(this._passwordInput.getInputElement(), 0.6*size.x);

	this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	if (isNewShare) {
		this._userRadioEl.checked = true;
		this._grantee.focus();
	}

	if (appCtxt.multiAccounts) {
		var acct = object.account || appCtxt.accountList.mainAccount;
		this._acAddrSelectList.setActiveAccount(acct);
	}
};

ZmSharePropsDialog.prototype._populateUrls =
function() {

    var acct, restUrl;
    if (appCtxt.multiAccounts) {
        acct = this._object.getAccount();
        restUrl = this._object.getRestUrl(acct);
    } else {
        restUrl = this._object.getRestUrl();
    }    
	if (appCtxt.isOffline) {
		var remoteUri = appCtxt.get(ZmSetting.OFFLINE_REMOTE_SERVER_URI, null, acct);
		restUrl = remoteUri + restUrl.substring((restUrl.indexOf("/",7)));
	}
	var url = AjxStringUtil.htmlEncode(restUrl).replace(/&amp;/g,'%26');
	var text = url;
	if (text.length > 50) {
		var length = text.length - 50;
		var index = (text.length - length) / 2;
		text = text.substr(0, index) + "..." + text.substr(index + length);
	}

	var proto = (location.protocol === ZmSetting.PROTO_HTTPS) ? "webcals:" : "webcal:";
    var webcalURL = proto + url.substring((url.indexOf("//")));
    var webcalText = webcalURL;
    if (webcalText.length > 50) {
		var length = webcalText.length - 50;
		var index = (webcalText.length - length) / 2;
		webcalText = webcalText.substr(0, index) + "..." + webcalText.substr(index + length);
	}

	var isRestFolder = this._object.type != ZmOrganizer.FOLDER;
	this._urlGroup.setVisible(isRestFolder);
	if (isRestFolder) {
		if (this._object.type == ZmOrganizer.CALENDAR) {
			this._urlEl.innerHTML = [
				"<div>", ZmMsg.ics, ":&nbsp;&nbsp;&nbsp;&nbsp;",
					'<a target=_new id="SharePropsURL_ICS" href="',url,'.ics">',text,".ics</a>",
				"</div>",
				"<div>", ZmMsg.view, ":&nbsp;&nbsp;",
					'<a target=_new id="SharePropsURL_view" href="',url,'.html">',text,".html</a>",
				"</div>",
                "<div>", ZmMsg.outlookURL, ":&nbsp;&nbsp;",
					'<a target=_new id="SharePropsURL_Outlook" href="',webcalURL,'">',webcalText,"</a>",
				"</div>"
			].join("");
		} else if (this._object.type == ZmOrganizer.TASKS) {
			this._urlEl.innerHTML = [
				"<div style='padding-left:2em;'>",
					'<a target=_new id="SharePropsURL" href="',url,'.ics">',text,".ics</a>",
				"</div>"
			].join("");
		} else {
			this._urlEl.innerHTML = [
				"<div style='padding-left:2em;'>",
					'<a target=_new id="SharePropsURL" href="',url,'">',text,"</a>",
				"</div>"
			].join("");
		}
	}
};

ZmSharePropsDialog.prototype.popdown =
function() {
	if (this._acAddrSelectList) {
		this._acAddrSelectList.reset();
		this._acAddrSelectList.show(false);
	}
	DwtDialog.prototype.popdown.call(this);
};

// Protected methods

ZmSharePropsDialog.prototype._getType =
function(isUserShare, isGuestShare, isPublicShare) {
	if (arguments.length == 0) {
		isUserShare = this._userRadioEl.checked;
		isGuestShare = this._guestRadioEl.checked;
		isPublicShare = this._publicRadioEl.checked;
	}
	return (isUserShare && ZmShare.TYPE_USER) ||
		   (isGuestShare && ZmShare.TYPE_GUEST) ||
		   (isPublicShare && ZmShare.TYPE_PUBLIC);
};

ZmSharePropsDialog.prototype._handleChangeButton =
function(event) {
	//this._passwordButton.setVisible(false);
	//this._passwordInput.setVisible(true);
	//this._passwordInput.focus();
};

ZmSharePropsDialog.prototype._handleOkButton =
function(event) {
	var isUserShare = this._userRadioEl.checked;
	var isGuestShare = this._guestRadioEl.checked;
	var isPublicShare = this._publicRadioEl.checked;
	var shareWithMyself = false;

	var parsedEmailsFromText = AjxEmailAddress.parseEmailString(this._granteeInput.value);
	var goodEmailsFromText = parsedEmailsFromText.good.getArray();
	var goodEmailsFromBubbles =  this._grantee.getAddresses();

	var goodEmails = goodEmailsFromBubbles.concat(goodEmailsFromText);
	var badEmails = parsedEmailsFromText.bad.getArray();

	// validate input
	if (!isPublicShare) {
		var error;
		if (badEmails.length) {
			error = AjxMessageFormat.format(AjxMsg.invalidEmailAddrValue, AjxStringUtil.htmlEncode(this._granteeInput.value));
		}
		else if (!goodEmails.length) {
			error = AjxMsg.valueIsRequired;
		}

		if (error) {
			var dialog = appCtxt.getErrorDialog();
			dialog.setMessage(error);
			dialog.popup(null, true);

			if (!goodEmails.length) {
				return;
			}
		}
	}

    var replyType = this._reply.getReplyType();
    if (replyType != ZmShareReply.NONE) {
        var notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote() : "";
    }

	var shares = [];
	if (this._shareMode == ZmSharePropsDialog.NEW) {
		var type = this._getType(isUserShare, isGuestShare, isPublicShare);
		if (!isPublicShare) {
			for (var i = 0; i < goodEmails.length; i++) {
				// bug fix #26428 - exclude me from list of addresses
				var addr = goodEmails[i];
				//bug#66610: allow Calendar Sharing with addresses present in zimbraAllowFromAddress
				var allowLocal;
				var excludeAllowFromAddress = true;
				if (appCtxt.isMyAddress(addr, allowLocal, excludeAllowFromAddress)) {
					shareWithMyself = true;
					continue;
				}

				var share = this._setUpShare();
				share.grantee.name = addr;
				share.grantee.type = type;
				shares.push(share);
			}
		} else {
			var share = this._setUpShare();
			share.grantee.type = type;
			shares.push(share);
		}
	} else {
		shares.push(this._setUpShare(this._share)); // editing perms on a share
	}
	
	// Since we may be sharing with multiple users, use a batch command
	var accountName = appCtxt.multiAccounts ? this._object.getAccount().name : null;
	var batchCmd = new ZmBatchCommand(null, accountName);
	var perm = this._getPermsFromRole();
	//var pw = isGuestShare && this._passwordInput.getValue();
	if (shares && shares.length == 0 && shareWithMyself) {
		var msgDlg = appCtxt.getMsgDialog(true);
		msgDlg.setMessage(ZmMsg.sharingErrorWithSelf,DwtMessageDialog.INFO_STYLE);
		msgDlg.setTitle(ZmMsg.sharing);
		msgDlg.popup();
		return;
	}
	for (var i = 0; i < shares.length; i++) {
		var share = shares[i];
		if (perm != share.link.perm) {
			var cmd = new AjxCallback(share, share.grant,
			                          [perm, null, notes,
			                           replyType, this._shareMode]);
			batchCmd.add(cmd);
		}
	}
	if (batchCmd.size() > 0) {
		var respCallback = !isPublicShare
			? (new AjxCallback(this, this._handleResponseBatchCmd, [shares])) : null;
		batchCmd.run(respCallback);
	}
	
	this.popdown();
};

ZmSharePropsDialog.prototype._handleResponseBatchCmd =
function(shares, result) {


    var response = result.getResponse();
    var batchResponse = response.BatchResponse;

    //bug:67698 Do not send notification on failed share
    if(batchResponse.Fault){
       appCtxt.setStatusMsg(ZmMsg.shareNotCreated,ZmStatusView.LEVEL_WARNING);
       return false;
    }
    else{
        if (!shares || (shares && shares.length == 0)) { return; }
        var ignore = this._getFaultyEmails(result);
        var replyType = this._reply.getReplyType();
        if (replyType != ZmShareReply.NONE) {
            var notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote() : "";
            var guestnotes;
            var batchCmd;

            if (shares.length > 1) {
                var accountName = appCtxt.multiAccounts ? this._object.getAccount().name : null;
                batchCmd = new ZmBatchCommand(false, accountName, true);
            }

            for (var i = 0; i < shares.length; i++) {
                var share = shares[i];
                var email = share.grantee.email || share.grantee.id;
                if (!email) {
                    // last resort: check if grantee name is a valid email address
                    if (AjxEmailAddress.isValid(share.grantee.name))
                        email = share.grantee.name;
                }

                if (!email || (email && ignore[email])) { continue; }

                var addrs = new AjxVector();
                var addr = new AjxEmailAddress(email, AjxEmailAddress.TO);
                addrs.add(addr);

                var tmpShare = new ZmShare({object:share.object});

                tmpShare.grantee.id = share.grantee.id;
                tmpShare.grantee.email = email;
                tmpShare.grantee.name = share.grantee.name;

                // REVISIT: What if you have delegated access???
                if (tmpShare.object.isRemote()) {
                    tmpShare.grantor.id = tmpShare.object.zid;
                    tmpShare.grantor.email = tmpShare.object.owner;
                    tmpShare.grantor.name = tmpShare.grantor.email;
                    tmpShare.link.id = tmpShare.object.rid;
                    tmpShare.link.name = tmpShare.object.oname || tmpShare.object.name;
                } else {
                    // bug: 50936  get setting for respective account
                    // to prevent sharing the default account unintentionally
                    tmpShare.grantor.id = appCtxt.get(ZmSetting.USERID, null, this._object.getAccount());
                    tmpShare.grantor.email = appCtxt.get(ZmSetting.USERNAME, null, this._object.getAccount());
                    tmpShare.grantor.name = appCtxt.get(ZmSetting.DISPLAY_NAME, null, this._object.getAccount()) || tmpShare.grantor.email;
                    tmpShare.link.id = tmpShare.object.id;
                    tmpShare.link.name = tmpShare.object.name;
                }
                // If folder is not synced before sharing, link ID might have changed in ZD.
                // Always get from response.
                if(appCtxt.isOffline) {
                    var linkId = this.getLinkIdfromResp(result);
                    if(linkId) {
                        tmpShare.link.id =  [tmpShare.grantor.id, linkId].join(":");
                    }
                }

                tmpShare.link.perm = share.link.perm;
                tmpShare.link.view = ZmOrganizer.getViewName(tmpShare.object.type);
                tmpShare.link.inh = this._inheritEl ? this._inheritEl.checked : true;

                if (this._guestRadioEl.checked) {
                    if (!this._guestFormatter) {
                        this._guestFormatter = new AjxMessageFormat(ZmMsg.shareCalWithGuestNotes);
                    }

                    var url = share.object.getRestUrl();
                    url = url.replace(/&/g,'%26');
                    if (appCtxt.isOffline) {
                        var remoteUri = appCtxt.get(ZmSetting.OFFLINE_REMOTE_SERVER_URI);
                        url = remoteUri + url.substring((url.indexOf("/",7)));
                    }

                    //bug:34647 added webcal url for subscribing to outlook/ical on a click
                    var webcalURL = "webcals:" + url.substring((url.indexOf("//")));

                    //var password = this._passwordInput.getValue();
                    guestnotes = this._guestFormatter.format([url, webcalURL, email, "", notes]);
                }
                tmpShare.notes = guestnotes || notes;

                /*
                    tmpShare.sendMessage(this._shareMode, addrs, null, batchCmd);
                */
            }
            if (batchCmd)
                batchCmd.run();

            var shareMsg = (this._shareMode==ZmSharePropsDialog.NEW)?ZmMsg.shareCreatedSubject:ZmMsg.shareModifiedSubject;
            appCtxt.setStatusMsg(shareMsg);

        }
    }
};

ZmSharePropsDialog.prototype.getLinkIdfromResp =
function(result){

    if (!result) { return; }
    var resp = result.getResponse().BatchResponse.FolderActionResponse || [];
    if (resp.length > 0 && resp[0].action) {
        return resp[0].action.id;
    } else {
        return null;
    }
};

// HACK: grep the Faults in BatchResponse and sift out the bad emails
ZmSharePropsDialog.prototype._getFaultyEmails =
function(result) {

	if (!result) { return; }
	var noSuchAccount = "no such account: ";
	var bad = {};
	var fault = result.getResponse().BatchResponse.Fault || [];
	for (var i = 0; i < fault.length; i++) {
		var reason = fault[i].Reason.Text;
		if (reason.indexOf(noSuchAccount) == 0) {
			bad[reason.substring(noSuchAccount.length)] = true;
		}
	}
	return bad;
};

ZmSharePropsDialog.prototype._setUpShare =
function(share) {
	if (!share) {
		share = new ZmShare({object:this._object});
	}
	share.link.inh = (this._inheritEl && this._inheritEl.checked);
	
	return share;
};

ZmSharePropsDialog.prototype._acKeyUpListener =
function(event, aclv, result) {
	ZmSharePropsDialog._enableFieldsOnEdit(this);
};

ZmSharePropsDialog._handleKeyUp =
function(event){
	if (DwtInputField._keyUpHdlr(event)) {
		return ZmSharePropsDialog._handleEdit(event);
	}
	return false;
};

ZmSharePropsDialog._handleEdit =
function(event) {
	var target = DwtUiEvent.getTarget(event);
	var dialog = Dwt.getObjectFromElement(target);
	if (dialog instanceof DwtInputField) {
		dialog = dialog.getData(Dwt.KEY_OBJECT);
	}
	if (dialog != null) {
		ZmSharePropsDialog._enableFieldsOnEdit(dialog);
	}
	return true;
};

ZmSharePropsDialog._enableFieldsOnEdit =
function(dialog) {
	var isEdit = dialog._mode == ZmSharePropsDialog.EDIT;

	var isUserShare = dialog._userRadioEl.checked;
	var isPublicShare = dialog._publicRadioEl.checked;
	var isGuestShare = dialog._guestRadioEl.checked;

	dialog._privatePermission.setVisible(dialog._privatePermissionEnabled && !dialog._noneRadioEl.checked && !isPublicShare);
	if (isPublicShare) {
		// Remove private permissions (which may have been set earlier) if the share is a public share
		dialog._privateEl.checked = false;
	}

	var hasEmail = AjxStringUtil.trim(dialog._grantee.getValue()) != "";
	//var hasPassword = AjxStringUtil.trim(dialog._passwordInput.getValue()) != "";

	var enabled = isEdit ||
				  isPublicShare ||
				  (isUserShare && hasEmail) ||
				  (isGuestShare && hasEmail);
	dialog.setButtonEnabled(DwtDialog.OK_BUTTON, enabled);
};

ZmSharePropsDialog._handleShareWith =
function(event) {
	var target = DwtUiEvent.getTarget(event);
	var dialog = Dwt.getObjectFromElement(target);
	dialog._handleShareWith(target.value);

	return ZmSharePropsDialog._handleEdit(event);
};

ZmSharePropsDialog.prototype._handleShareWith = function(type) {
	var isUserShare = type == ZmShare.TYPE_USER;
	var isGuestShare = type == ZmShare.TYPE_GUEST;
	var isPublicShare = type == ZmShare.TYPE_PUBLIC;

    // TODO - Currently external sharing is enabled for briefcase only.
    var guestRadioLabelEl = document.getElementById("LblShareWith_external");

    if (appCtxt.getCurrentApp().getName() === ZmId.APP_BRIEFCASE) {
        this._rolesGroup.setVisible(isUserShare || isGuestShare);
        guestRadioLabelEl.innerHTML = ZmMsg.shareWithExternalGuest;
    }
    else {
	    this._rolesGroup.setVisible(isUserShare);
        guestRadioLabelEl.innerHTML = ZmMsg.shareWithGuest;
    }
	this._messageGroup.setVisible(!isPublicShare);
	this._privatePermission.setVisible(this._privatePermissionEnabled && !isPublicShare);

    var adminRadioRow = document.getElementById("ShareRole_Row_" + ZmShare.ROLE_ADMIN);

    if (isGuestShare) {
        this._reply && this._reply.setReplyOptions(ZmShareReply.EXTERNAL_USER_OPTIONS);
        adminRadioRow.style.display = 'none';
    }
    else {
        this._reply && this._reply.setReplyOptions(ZmShareReply.DEFAULT_OPTIONS);
        this._reply.setReplyType(ZmShareReply.STANDARD);
        adminRadioRow.style.display = '';
    }
	this._props.setPropertyVisible(this._shareWithOptsId, !isPublicShare);
	//this._shareWithOptsProps.setPropertyVisible(this._passwordId, isGuestShare);
	this._props.setPropertyVisible(this._shareWithBreakId, !isPublicShare);
    this._setAutoComplete(isGuestShare);

	if (!isUserShare) {
		this._viewerRadioEl.checked = true;
	}
};

/**
 * Returns a perms string based on the user's selection of a role and privacy.
 */
ZmSharePropsDialog.prototype._getPermsFromRole =
function() {
	var role = ZmShare.ROLE_NONE;
	if (this._viewerRadioEl.checked) {
		role = ZmShare.ROLE_VIEWER;
	}
	if (this._managerRadioEl.checked) {
		role = ZmShare.ROLE_MANAGER;
	}
	if (this._adminRadioEl.checked) {
		role = ZmShare.ROLE_ADMIN;
	}
	var perm = ZmShare.ROLE_PERMS[role];
	if (perm && this._privatePermissionEnabled && this._privateEl.checked) {
		perm += ZmShare.PERM_PRIVATE;
	}
	return perm;
};

ZmSharePropsDialog.prototype._createView = function() {

	var view = new DwtComposite(this);

	// ids
	var nameId = Dwt.getNextId();
    var markReadValueId = Dwt.getNextId();
	var typeId = Dwt.getNextId();
	var granteeId = Dwt.getNextId();
	var inheritId = Dwt.getNextId();
	var urlId = Dwt.getNextId();
	var permissionId = Dwt.getNextId();

	var shareWithRadioName = this._htmlElId + "_shareWith";
	var shareWith = new DwtPropertySheet(this, null, null, DwtPropertySheet.RIGHT);
	var shareWithProperties = [], sw, label, value, swRadioId;
	for (var i = 0; i < ZmSharePropsDialog.SHARE_WITH.length; i++) {
		sw = ZmSharePropsDialog.SHARE_WITH[i];
        swRadioId = "ShareWith_" + sw;
		label = "<label id='LblShareWith_" + sw + "'for='" + swRadioId + "'>" + ZmSharePropsDialog.SHARE_WITH_MSG[sw] + "</label>";
        value = "<input type='radio' id='" + swRadioId + "' name='" + shareWithRadioName + "' value='" + ZmSharePropsDialog.SHARE_WITH_TYPE[sw] + "'>";
		shareWith.addProperty(label, value);
	}

	this._shareWithOptsProps = new DwtPropertySheet(this);
	this._shareWithOptsProps.addProperty(ZmMsg.emailLabel, this._grantee);

	var otherHtml = [
		"<table role='presentation' class='ZCheckboxTable'>",
			"<tr>",
				"<td>",
					"<input type='checkbox' id='",inheritId,"' checked>",
				"</td>",
				"<td>","<label for='", inheritId,  "'>" , ZmMsg.inheritPerms, "</label>", "</td>",
			"</tr>",
		"</table>"
	].join("");

	this._props = new DwtPropertySheet(view);
	this._props.addProperty(ZmMsg.nameLabel, "<span id='" + nameId + "'></span>");
    this._props.addProperty(ZmMsg.typeLabel, "<span id='" + typeId + "'></span>");
    this._markReadId = this._props.addProperty(ZmMsg.sharingDialogMarkReadLabel, "<span id='" + markReadValueId + "'></span>");
	var shareWithId = this._props.addProperty(ZmMsg.shareWithLabel, shareWith);
	var otherId = this._props.addProperty(ZmMsg.otherLabel, otherHtml);

	// Accessibility: set aria-labelledby for each radio button to two IDs, one is the group label, other is label for that button
	var shareWithLabelId = this._props.getProperty(shareWithId).labelId,
		radioId, radioEl;
	for (var i = 0; i < ZmSharePropsDialog.SHARE_WITH.length; i++) {
		sw = ZmSharePropsDialog.SHARE_WITH[i];
		radioId = 'ShareWith_' + sw;
		radioEl = document.getElementById(radioId);
		if (radioEl) {
			radioEl.setAttribute('aria-labelledby', [ shareWithLabelId, 'LblShareWith_' + sw ].join(' '));
		}
	}

	this._inheritEl = document.getElementById(inheritId);

	// XXX: for now, we are hiding this property for simplicity's sake
	this._props.setPropertyVisible(otherId, false);
	this._shareWithBreakId = this._props.addProperty("", "<HR>");
	this._shareWithOptsId = this._props.addProperty("", this._shareWithOptsProps);

	// add role group
	var idx = 0;
	var html = [];
	html[idx++] = "<table role='presentation' class='ZRadioButtonTable'>";

	this._rolesGroup = new DwtGrouper(view);

	var roleRadioName = this._htmlElId + "_role";
	var roles = [ZmShare.ROLE_NONE, ZmShare.ROLE_VIEWER, ZmShare.ROLE_MANAGER, ZmShare.ROLE_ADMIN];
	for (var i = 0; i < roles.length; i++) {
		var role = roles[i],
			rowId = 'ShareRole_Row_' + role,
			radioId = 'ShareRole_' + role,
			labelId = 'LblShareRole_' + role,
			legendId = this._rolesGroup._labelEl.id,
			labelledBy = [ legendId, labelId ].join(' ');

		html[idx++] = "<tr id='" + rowId + "'>";
        html[idx++] = "<td style='padding-left:10px; vertical-align:top;'>";
		html[idx++] = "<input type='radio' name='" + roleRadioName + "' value='" + role + "' id='" + radioId + "' aria-labelledby='" + labelledBy + "'>";
        html[idx++] = "</td>";
		html[idx++] = "<td style='font-weight:bold; padding:0 0.5em 0 .25em;'>";
		html[idx++] = "<label id='" + labelId + "' for='"+radioId+"' >";
		html[idx++] = ZmShare.getRoleName(role);
		html[idx++] = "</label>"
		html[idx++] = "</td>";
		html[idx++] = "<td style='white-space:nowrap'>";
		html[idx++] = ZmShare.getRoleActions(role);
		html[idx++] = "</td></tr>";
	}

	html[idx++] = "</table>";

	this._rolesGroup.setLabel(ZmMsg.role);
	this._rolesGroup.setContent(html.join(""));

	this._privatePermission = new DwtPropertySheet(view);
	this._privatePermission._vAlign = "middle";
	this._privatePermission.addProperty("<input type='checkbox' id='" + permissionId + "'/>",  "<label for='" + permissionId + "' >" +  ZmMsg.privatePermission +  "</label>");
	this._privateEl = document.getElementById(permissionId);
	Dwt.setHandler(this._privateEl, DwtEvent.ONCLICK, ZmSharePropsDialog._handleEdit);
	Dwt.associateElementWithObject(this._privateEl, this);

	// add message group
	this._messageGroup = new DwtGrouper(view);
	this._messageGroup.setLabel(ZmMsg.message);
	this._reply = new ZmShareReply({
		parent:     view,
		legendId:   this._messageGroup._labelEl.id
	});
	this._messageGroup.setView(this._reply);

	// add url group
	var urlHtml = [
		"<div>",
			"<div style='margin-bottom:.25em'>",ZmMsg.shareUrlInfo,"</div>",
			"<div style='cursor:text' id='",urlId,"'></div>",
		"</div>"
	].join("");

	this._urlGroup = new DwtGrouper(view);
	this._urlGroup.setLabel(ZmMsg.url);
	this._urlGroup.setContent(urlHtml);
	this._urlGroup._setAllowSelection();

	// save information elements
	this._nameEl = document.getElementById(nameId);
    this._typeEl = document.getElementById(typeId);
    this._markReadEl = document.getElementById(markReadValueId);
	this._urlEl = document.getElementById(urlId);

	this._setAutoComplete();

	// add change handlers
	if (this._inheritEl) {
		Dwt.setHandler(this._inheritEl, DwtEvent.ONCLICK, ZmSharePropsDialog._handleEdit);
		Dwt.associateElementWithObject(this._inheritEl, this);
	}

	var radios = ["_userRadioEl", "_guestRadioEl", "_publicRadioEl"];
	var radioEls = document.getElementsByName(shareWithRadioName);
	for (var i = 0; i < radioEls.length; i++) {
		this[radios[i]] = radioEls[i];
		Dwt.setHandler(radioEls[i], DwtEvent.ONCLICK, ZmSharePropsDialog._handleShareWith);
		Dwt.associateElementWithObject(radioEls[i], this);
	}

	radios = ["_noneRadioEl", "_viewerRadioEl", "_managerRadioEl", "_adminRadioEl"];
	radioEls = document.getElementsByName(roleRadioName);
	roles = [ZmShare.ROLE_NONE, ZmShare.ROLE_VIEWER, ZmShare.ROLE_MANAGER, ZmShare.ROLE_ADMIN];
	this._radioElByRole = {};
	for (var i = 0; i < radioEls.length; i++) {
		this[radios[i]] = radioEls[i];
		this._radioElByRole[roles[i]] = radioEls[i];
		Dwt.setHandler(radioEls[i], DwtEvent.ONCLICK, ZmSharePropsDialog._handleEdit);
		Dwt.associateElementWithObject(radioEls[i], this);
	}

	this._tabGroup.addMember(shareWith.getTabGroupMember());
	this._tabGroup.addMember(this._grantee);
	this._tabGroup.addMember(this._rolesGroup.getTabGroupMember());
	this._tabGroup.addMember(this._messageGroup.getTabGroupMember());
	this._tabGroup.addMember(this._urlGroup.getTabGroupMember());
	this._tabGroup.addMember(this._reply.getTabGroupMember());

	return view;
};

ZmSharePropsDialog.prototype._setAutoComplete =
function(disabled) {
	if (!disabled && this._acAddrSelectList) {
		this._acAddrSelectList.handle(this._granteeInput);
	}
	else {
		Dwt.setHandler(this._granteeInput, DwtEvent.ONKEYUP, ZmSharePropsDialog._handleKeyUp);
	}
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmShareSearchDialog")) {
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

ZmShareSearchDialog = function(params) {
    // initialize params
    params.className = params.className || "ZmShareSearchDialog DwtDialog";
    params.title = ZmMsg.sharedFoldersAddTitle;
    params.standardButtons = [ ZmShareSearchDialog.ADD_BUTTON, DwtDialog.CANCEL_BUTTON ];
	params.id = "ZmShareSearchDialog";
	
    // setup auto-complete
    // NOTE: This needs to be done before default construction so
    // NOTE: that it is available when we initialize the email
    // NOTE: input field.
    var acparams = {
        dataClass:		  appCtxt.getAutocompleter(),
        matchValue:		  ZmAutocomplete.AC_VALUE_EMAIL,
        keyUpCallback:	  this._acKeyUpListener.bind(this),
		contextId:		  this.toString(),
		autocompleteType: "all"
    };
    this._acAddrSelectList = new ZmAutocompleteListView(acparams);
    
    // default construction
    DwtDialog.call(this, params);

    // set custom button label
    this.getButton(ZmShareSearchDialog.ADD_BUTTON).setText(ZmMsg.add);

    // insert form elements into tab group
    var tabGroup = this._tabGroup;
    tabGroup.addMemberBefore(this._form.getTabGroupMember(), tabGroup.getFirstMember());
};
ZmShareSearchDialog.prototype = new DwtDialog;
ZmShareSearchDialog.prototype.constructor = ZmShareSearchDialog;

ZmShareSearchDialog.prototype.isZmShareSearchDialog = true;
ZmShareSearchDialog.prototype.toString = function() { return "ZmShareSearchDialog"; };

//
// Constants
//

ZmShareSearchDialog.ADD_BUTTON = DwtDialog.OK_BUTTON; //++DwtDialog.LAST_BUTTON;

ZmShareSearchDialog._APP_TYPES = [ZmApp.MAIL, ZmApp.CONTACTS, ZmApp.CALENDAR, ZmApp.TASKS, ZmApp.BRIEFCASE];
ZmShareSearchDialog._APP_KEY = {};
ZmShareSearchDialog._APP_KEY[ZmApp.MAIL]		= "mailSharesOnly";
ZmShareSearchDialog._APP_KEY[ZmApp.TASKS]		= "taskSharesOnly";
ZmShareSearchDialog._APP_KEY[ZmApp.BRIEFCASE]	= "briefcaseSharesOnly";
ZmShareSearchDialog._APP_KEY[ZmApp.CALENDAR]    = "calendarSharesOnly";
ZmShareSearchDialog._APP_KEY[ZmApp.CONTACTS]    = "addrbookSharesOnly";

//
// Data
//

ZmShareSearchDialog.prototype.CONTENT_TEMPLATE = "share.Widgets#ZmShareSearchView";


//
// Public methods
//

ZmShareSearchDialog.prototype.getShares = function() {
    var treeView = this._form.getControl("TREE");
    var root = this._getNode(ZmOrganizer.ID_ROOT);
    var shares = [];
    this._collectShares(treeView, root, shares);
    return shares;
};

//
// Protected methods
//

ZmShareSearchDialog.prototype._collectShares = function(treeView, node, shares) {
    if (node.shareInfo) {
        var treeItem = treeView.getTreeItemById(node.id);
        // NOTE: Only collect shares that are checked *and* visible.
        // NOTE: In other words, we should never mount a share that
        // NOTE: is not visible even if the user had checked it before
        // NOTE: applying a filter. Otherwise they would be left
        // NOTE: wondering why it was mounted.
        if (treeItem && treeItem.getChecked() && treeItem.getVisible()) {
            shares.push(node.shareInfo);
        }
    }
    else {
        var children = node.children.getArray();
        for (var i = 0; i < children.length; i++) {
            this._collectShares(treeView, children[i], shares);
        }
    }
};

ZmShareSearchDialog.prototype._filterResults = function() {
    var treeView = this._form.getControl("TREE");
    var root = this._getNode(ZmOrganizer.ID_ROOT);
    var text = this._form.getValue("FILTER") || "";
    this._filterNode(treeView, root, text.toLowerCase());
};

ZmShareSearchDialog.prototype._filterNode = function(treeView, node, text) {
	var nodeItem = treeView.getTreeItemById(node.id);
	if (!nodeItem) {
		return false;
	}
    // process children
    var count = node.children.size();
    var app = this._form.getValue("APP") || "";
	var matches = false;
    if (count > 0) {
		//this node has children.
        for (var i = 0; i < count; i++) {
            var child = node.children.get(i);
            matches = this._filterNode(treeView, child, text) || matches; //order is important! (need to call _filterNode always
        }
    }
	else {
		//this is a leaf node
		var isInfoNode = String(node.id).match(/^-/);
		var textMatches = !text || node.name.toLowerCase().indexOf(text) !== -1;
		var appMatches = !app || node.shareInfo && node.shareInfo.view === app;
		matches = !isInfoNode && textMatches && appMatches;
	}
	matches = matches || node.id == ZmOrganizer.ID_ROOT;
	nodeItem.setVisible(matches);
	return matches;
};

ZmShareSearchDialog.prototype._createOrganizer = function(parent, id, name) {
    // NOTE: The caller is responsible for adding the new node
    // NOTE: to the parent's children.
    return new ZmShareProxy({parent:parent,id:id,name:name,tree:(parent&&parent.tree)});
};

ZmShareSearchDialog.prototype._resetTree = function() {
    // create new tree
    var tree = new ZmTree(ZmOrganizer.SHARE);
    // NOTE: The root should never be seen
    tree.root = this._createOrganizer(null, ZmOrganizer.ID_ROOT, "[Root]");

    // setup tree view
    var treeView = this._form.getControl("TREE");
    treeView.set({ dataTree: tree });
    var treeItem = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
    treeItem.setVisible(false, true);
    treeItem.setExpanded(true);
    treeItem.enableSelection(false);
    treeItem.showCheckBox(false);
};

// Fix for bug: 79402. Passing extra param for wide search.
ZmShareSearchDialog.prototype._doUserSearch = function(emails, isWideSearch) {
    this._resetTree();
    // collect unique email addresses
    emails = emails.split(/\s*[;,]\s*/);
    var emailMap = {};
    for (var i = 0; i < emails.length; i++) {
        var email = AjxStringUtil.trim(emails[i]);
        if (!email) {
            continue;
        }
        if (email === appCtxt.get(ZmSetting.USERNAME)) {
            continue;
        }
        emailMap[email.toLowerCase()] = email;
    }

    // build request
    var requests = [], requestIdMap = {};
    var i = 0;
    for (var emailId in emailMap) {
        // add request
        requests.push({
            _jsns: "urn:zimbraAccount",
            requestId: i,
            includeSelf: 0,
            owner: { by: "name", _content: emailMap[emailId] }
        });

        // add loading placeholder node
        if (!this._loadingUserFormatter) {
            this._loadingUserFormatter = new AjxMessageFormat(ZmMsg.sharedFoldersLoadingUser);
        }
        var text = this._loadingUserFormatter.format([email]);
        var loadingId = [ZmShareProxy.ID_LOADING,Dwt.getNextId("share")].join(":");
        this._appendInfoNode(ZmOrganizer.ID_ROOT, loadingId, AjxStringUtil.htmlEncode(text));

        // remember the placeholder nodes
        emailMap[emailId] = loadingId;
        requestIdMap[i] = loadingId;
        i++;
    }

    // Fix for bug: 79402. Replaces _doGroupSearch.
    if (isWideSearch) {
        this._appendInfoNode(ZmOrganizer.ID_ROOT, ZmShareProxy.ID_LOADING, ZmMsg.sharedFoldersLoading);

        requests.push({
            _jsns: "urn:zimbraAccount",
            includeSelf: 0
        });
    }

    // anything to do?
    if (requests.length == 0) {
        return;
    }

    // perform user search
    this._setSearching(true);
    var params = {
        jsonObj: {
            BatchRequest: {
                _jsns: "urn:zimbra",
                GetShareInfoRequest: requests
            }
        },
        asyncMode: true,
        callback: new AjxCallback(this, this._handleUserSearchResults, [emailMap, requestIdMap]),
        errorCallback: new AjxCallback(this, this._handleUserSearchError)
    };
    appCtxt.getAppController().sendRequest(params);
};

ZmShareSearchDialog.prototype._setSearching = function(searching) {
    this._form.setEnabled(!searching);
};

ZmShareSearchDialog.prototype._handleUserSearchResults = function(emailMap, requestIdMap, resp) {
    this._setSearching(false);

    // remove placeholder nodes
    for (var email in emailMap) {
        this._removeNode(emailMap[email]);
    }

    // add nodes for results
    var batchResponse = AjxUtil.get(resp.getResponse(), "BatchResponse");
    var responses = AjxUtil.get(batchResponse, "GetShareInfoResponse");
    if (responses) {
        // get list of owners with their shares, in alphabetical order
        var owners = {};
        for (var i = 0; i < responses.length; i++) {
            var response = responses[i];
            this._addToOwnerMap(owners, response.share);
        }
        owners = AjxUtil.values(owners);
        owners.sort(ZmShareSearchDialog.__byOwnerName);

        // add shares
        this._appendShareNodes(owners);
    }

    // apply current filter
    this._filterResults();

    // handle errors
    var faults = AjxUtil.get(batchResponse, "Fault");
    if (faults) {
        var treeView = this._form.getControl("TREE");
        for (var i = 0; i < faults.length; i++) {
            var fault = faults[i];

            // replace placeholder node with error node
            var faultNodeId = ZmShareProxy.ID_ERROR;// TODO: create unique error item id
            var loadingNode = this._getNode(requestIdMap[fault.requestId]);
            var faultNode = this._createOrganizer(loadingNode.parent, faultNodeId, ZmMsg.sharedFoldersError);
            treeView.replaceNode(faultNode, loadingNode);

            // set error message as tooltip
            var treeItem = treeView.getTreeItemById(faultNodeId);
            treeItem.showCheckBox(false);
            treeItem.setToolTipContent(AjxStringUtil.htmlEncode(fault.Reason.Text));
        }
    }
};

ZmShareSearchDialog.prototype._addToOwnerMap = function(owners, shares) {
    if (!shares) return;

    for (var j = 0; j < shares.length; j++) {
        var share = shares[j];
        var owner = owners[share.ownerId];
        if (!owner) {
            owner = owners[share.ownerId] = {
                ownerId: share.ownerId,
                ownerName: share.ownerName || share.ownerEmail,
                ownerEmail: share.ownerEmail,
                shares: []
            };
        }
        owner.shares.push(share);
    }
};

ZmShareSearchDialog.prototype._handleUserSearchError = function(resp) {
    this._setSearching(false);
    // TODO
};

// node management

ZmShareSearchDialog.prototype._getNode = function(id) {
    var treeView = this._form.getControl("TREE");
    var treeItem = treeView.getTreeItemById(id);
    return treeItem && treeItem.getData(Dwt.KEY_OBJECT);
};

ZmShareSearchDialog.prototype._removeNode = function(nodeId) {
    var treeView = this._form.getControl("TREE");
    treeView.removeNode(this._getNode(nodeId));
};

ZmShareSearchDialog.prototype._appendChild = function(childNode, parentNode, checkable, tooltip) {
    var treeView = this._form.getControl("TREE");
    var treeItem = treeView.appendChild(childNode, parentNode, null, tooltip);
    treeItem.setExpanded(true);
    treeItem.enableSelection(false);
    treeItem.showCheckBox(checkable);
    treeItem.setVisible(false);   //filterResults will set visibility
    return treeItem;
};

ZmShareSearchDialog.prototype._appendShareNodes = function(owners) {

    // run through owners
    for (var j = 0; j < owners.length; j++) {
        // create parent node, if needed
        var owner = owners[j];
        var parentNode = this._getNode(owner.ownerId);
        if (!parentNode) {
            var root = this._getNode(ZmOrganizer.ID_ROOT);
            parentNode = this._createOrganizer(root, owner.ownerId, owner.ownerName || owner.ownerEmail);
            this._appendChild(parentNode, root);
        }

        // add share nodes
        var shares = owner.shares;
        if (shares.length > 0) {
            shares.sort(ZmShareSearchDialog.__byFolderPath);
            for (var i = 0; i < shares.length; i++) {
                var share = shares[i];
				if (ZmFolder.HIDE_ID[share.folderId]) {
					continue;
				}
                var shareId = [share.ownerId,share.folderId].join(":");
                if (this._getNode(shareId) != null) continue;

                 // NOTE: strip the leading slash from folder path
				var folderPath = share.folderPath;
                var shareFullPathName = share.folderId == ZmOrganizer.ID_ROOT ? ZmMsg.allApplications : folderPath.substr(1);
                var shareNode = this._createOrganizer(parentNode, shareId, shareFullPathName);
                shareNode.shareInfo = share;

                // augment share info
                share.icon = shareNode.getIcon();
                share.role = ZmShare.getRoleFromPerm(share.rights);
                share.roleName = ZmShare.getRoleName(share.role);
                share.roleActions = ZmShare.getRoleActions(share.role);
                share.normalizedOwnerName = share.ownerName || share.ownerEmail;
                share.normalizedGranteeName = share.granteeDisplayName || share.granteeName;
                share.normalizedFolderPath = shareFullPathName;
				share.name = folderPath.substr(folderPath.lastIndexOf("/") + 1);
				var ownerName = share.normalizedOwnerName;
				var indexOfAtSign = ownerName.indexOf('@');
				if (indexOfAtSign > -1) {
					ownerName = ownerName.substr(0, indexOfAtSign)
				}
                share.defaultMountpointName = ZmShare.getDefaultMountpointName(ownerName, share.name);

                // set tooltip
                var tooltip = AjxTemplate.expand(shareNode.TOOLTIP_TEMPLATE, share);
                this._appendChild(shareNode, parentNode, true, tooltip);
            }
        }

        // no shares found
        else {
            this._appendInfoNode(parentNode, ZmShareProxy.ID_NONE_FOUND, ZmMsg.sharedFoldersNoneFound);
        }
    }
};

ZmShareSearchDialog.prototype._appendInfoNode = function(parentId, id, text, tooltip) {
    var parent = this._getNode(parentId);
    var node = this._createOrganizer(parent, id, text);
    return this._appendChild(node, parent, null, tooltip);
};

// sorting

ZmShareSearchDialog.__byOwnerName = AjxCallback.simpleClosure(AjxUtil.byStringProp, window, "ownerName");
ZmShareSearchDialog.__byFolderPath = AjxCallback.simpleClosure(AjxUtil.byStringProp, window, "folderPath");

// auto-complete

ZmShareSearchDialog.prototype._acKeyUpListener = function(event, aclv, result) {
	// TODO: Does anything need to be done here?
};

//
// DwtDialog methods
//

ZmShareSearchDialog.prototype.popup = function(organizerType, addCallback, cancelCallback) {
    this.reset();
    if (addCallback) this._buttonDesc[ZmShareSearchDialog.ADD_BUTTON].callback = addCallback;
    if (cancelCallback) this._buttonDesc[DwtDialog.CANCEL_BUTTON].callback = cancelCallback;

    if (appCtxt.multiAccounts) {
        var acct =   appCtxt.getActiveAccount() || appCtxt.accountList.mainAccount;
        this._acAddrSelectList.setActiveAccount(acct);
    }

    var form = this._form;
    form.setValue("FILTER", "");
    form.setValue("EMAIL", "");
    form.setEnabled("SEARCH", false);   //disable search button by default
    this._selectApplicationOption();
    this._resetTree();
    // Fix for bug: 79402. Do wide search.
    this._doUserSearch("", true);

    DwtDialog.prototype.popup.call(this);

    form.getControl("EMAIL").focus();
};

ZmShareSearchDialog.prototype.popdown = function() {
	if (this._acAddrSelectList) {
		this._acAddrSelectList.reset();
		this._acAddrSelectList.show(false);
	}
	DwtDialog.prototype.popdown.call(this);
};

//
// DwtBaseDialog methods
//

ZmShareSearchDialog.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtDialog.prototype._createHtmlFromTemplate.apply(this, arguments);

    // create form
    var params = {
        parent: this,
        className: "ZmShareSearchView",
        form: {
            template: this.CONTENT_TEMPLATE,
            items: [
                { id: "FILTER", type: "DwtInputField", hint: ZmMsg.sharedFoldersFilterHint,
                    onchange: "this.parent._filterResults()"
                },
                { id: "TREE", type: "ZmShareTreeView", style: DwtTree.CHECKEDITEM_STYLE },
                { id: "EMAIL", type: "DwtInputField", hint: ZmMsg.sharedFoldersUserSearchHint },
                { id: "SEARCH", type: "DwtButton", label: ZmMsg.searchInput,
                    enabled: "get('EMAIL')", onclick: "this.parent._doUserSearch(get('EMAIL'))"
                },
                { id: "APP", type: "DwtSelect",  items: this._getAppOptions(), onchange: "this.parent._filterResults()"

                }
            ]
        },
	    id: "ZmShareSearchView"
    };
    this._form = new DwtForm(params);
	this._form.setScrollStyle(DwtControl.CLIP);
    this.setView(this._form);

    var inputEl = this._form.getControl("EMAIL").getInputElement();
    var onkeyupHandlers = [inputEl.onkeyup];
    if (this._acAddrSelectList) {
        this._acAddrSelectList.handle(inputEl);
        onkeyupHandlers.push(inputEl.onkeyup);
    }
    onkeyupHandlers.push(AjxCallback.simpleClosure(this._handleEmailEnter, this));

    var handler = AjxCallback.simpleClosure(ZmShareSearchDialog.__onKeyUp, window, onkeyupHandlers);
    Dwt.setHandler(inputEl, DwtEvent.ONKEYUP, handler);
};

ZmShareSearchDialog.__onKeyUp = function(handlers, htmlEvent) {
    for (var i = 0; i < handlers.length; i++) {
        handlers[i](htmlEvent);
    }
};

ZmShareSearchDialog.prototype._handleEmailEnter = function(htmlEvent) {
    // TODO: on enter, run search
    if (false) {
        this._doUserSearch(this.getValue("EMAIL"));
    }
};

/**
 * Gets the include applications options.
 *
 * @return	{Array}	an array of include shares options
 */
ZmShareSearchDialog.prototype._getAppOptions = function() {
	var options = [];
    options.push({value: "", label: ZmMsg.allApplications});
    for (var i = 0; i < ZmShareSearchDialog._APP_TYPES.length; i++) {
		var appType = ZmShareSearchDialog._APP_TYPES[i];
	    var key = ZmShareSearchDialog._APP_KEY[appType];
	    var appEnabled = appCtxt.get(ZmApp.SETTING[appType]);
	    if (appEnabled) {
		    var shareKey = ZmApp.ORGANIZER[appType];
		    if (AjxUtil.isArray1(ZmOrganizer.VIEWS[shareKey])) {
				options.push({id: appType, value: ZmOrganizer.VIEWS[shareKey][0], label: ZmMsg[key]});
		    }
	    }
	}

    return options;
};

ZmShareSearchDialog.prototype._selectApplicationOption = function() {
  var activeApp = appCtxt.getCurrentApp();
  var appSelect = this._form.getControl("APP");
  var appOptions = this._getAppOptions();

  if (!activeApp || !appSelect || !appOptions)
    return;

  for (var i=0; i<appOptions.length; i++) {
      if (appOptions[i].hasOwnProperty('id') &&
          appOptions[i].id == activeApp.getName()) {
            appSelect.setSelectedValue(appOptions[i].value);
            return;
      }
  }

};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmRevokeShareDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a revoke share dialog.
 * @class
 * This class represents a revoke share dialog.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		DwtDialog
 */
ZmRevokeShareDialog = function(parent, className) {
	if (arguments.length == 0) return;

	className = className || "ZmRevokeShareDialog";
	var title = ZmMsg.revokeShare;
	var buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON ];
	DwtDialog.call(this, {parent:parent, className:className, title:title, standardButtons:buttons});
	this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));
	
	var view = this._createView();
	this.setView(view);

	// create formatters
	this._formatter = new AjxMessageFormat(ZmMsg.revokeShareConfirm);
};

ZmRevokeShareDialog.prototype = new DwtDialog;
ZmRevokeShareDialog.prototype.constructor = ZmRevokeShareDialog;

// Public methods

ZmRevokeShareDialog.prototype.toString =
function() {
	return "ZmRevokeShareDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmShare}	share		the share
 */
ZmRevokeShareDialog.prototype.popup =
function(share) {
	this._share = share;

	var isPubShare = share.isPublic();
	var isGuestShare = share.isGuest();
	var isAllShare = share.grantee && (share.grantee.type == ZmShare.TYPE_ALL);

	var params = isPubShare ? ZmMsg.shareWithPublic : isGuestShare ? share.grantee.id : isAllShare ? ZmMsg.shareWithAll :
					(AjxStringUtil.htmlEncode(share.grantee.name) || ZmMsg.userUnknown);
	this._confirmMsgEl.innerHTML = this._formatter.format(params);

	this._reply.setReplyType(ZmShareReply.STANDARD);
	this._reply.setReplyNote("");
	this._reply.setVisible(!isPubShare && !isAllShare);

    if (isGuestShare) {
        this._reply.setReplyOptions(ZmShareReply.EXTERNAL_USER_OPTIONS);
    }
    else {
        this._reply.setReplyOptions(ZmShareReply.DEFAULT_OPTIONS);
    }

	DwtDialog.prototype.popup.call(this);
	this.setButtonEnabled(DwtDialog.YES_BUTTON, true);
};

// Protected methods

ZmRevokeShareDialog.prototype._handleYesButton =
function() {
	var callback = new AjxCallback(this, this._yesButtonCallback);
	this._share.revoke(callback);
};

ZmRevokeShareDialog.prototype._yesButtonCallback =
function() {
	var share = this._share;
	var replyType = this._reply.getReplyType();
	var sendMail = !(share.isAll() || share.isPublic() || share.invalid); 
	if (replyType != ZmShareReply.NONE && sendMail) {
		// initialize rest of share information
		share.grantee.email = share.grantee.name || share.grantee.id;
		share.grantor.id = appCtxt.get(ZmSetting.USERID);
		share.grantor.email = appCtxt.get(ZmSetting.USERNAME);
		share.grantor.name = appCtxt.get(ZmSetting.DISPLAY_NAME) || share.grantor.email;
		share.link.id = share.object.id;
		share.link.name = share.object.name;
		share.link.view = ZmOrganizer.getViewName(share.object.type);

		share.notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote() : "";
	
		share.sendMessage(ZmShare.DELETE);
	}

	this.popdown();
};

ZmRevokeShareDialog.prototype._createView =
function() {
	this._confirmMsgEl = document.createElement("DIV");
	this._confirmMsgEl.style.fontWeight = "bold";
	this._confirmMsgEl.style.marginBottom = "0.25em";
	
	var view = new DwtComposite(this);
	this._reply = new ZmShareReply(view);
	
	var element = view.getHtmlElement();
	element.appendChild(this._confirmMsgEl);
	element.appendChild(this._reply.getHtmlElement());

	this._tabGroup.addMember(this._reply.getTabGroupMember());
	return view;
};

ZmRevokeShareDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFindnReplaceDialog")) {
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
 */

/**
 * Creates a "find-and-replace" dialog.
 * @class
 * This class represents a "find-and-replace" dialog.
 * 
 * @param	{DwtControl}	shell		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmFindnReplaceDialog = function(shell, className) {
	className = className || "ZmFindnReplaceDialog";
	
	var findBtn = new DwtDialog_ButtonDescriptor(ZmFindnReplaceDialog.FIND_BUTTON, 
													  ZmMsg.find, DwtDialog.ALIGN_LEFT);
	var replaceBtn = new DwtDialog_ButtonDescriptor(ZmFindnReplaceDialog.REPLACE_BUTTON, 
													ZmMsg.replace, DwtDialog.ALIGN_LEFT);
	var replaceAllBtn = new DwtDialog_ButtonDescriptor(ZmFindnReplaceDialog.REPLACE_ALL_BUTTON, 
													ZmMsg.replaceAll, DwtDialog.ALIGN_LEFT);
	
	DwtDialog.call(this, {parent:shell, className:className, title:ZmMsg.findNReplaceTitle,
						  standardButtons:[DwtDialog.CANCEL_BUTTON], extraButtons:[findBtn,replaceBtn,replaceAllBtn]});

	this._findId = Dwt.getNextId();
	this._replaceId = Dwt.getNextId();
	this._dirId = Dwt.getNextId();
	this._dirIdUp = Dwt.getNextId();
	this._dirIdDown = Dwt.getNextId();
	this._caseId = Dwt.getNextId();
	this._wholeWordId = Dwt.getNextId();
	this._messageId = Dwt.getNextId();
	
	var numberOfCols =1;
		var html = [
         "<table role='presentation'><tr><td>",
         "<div style='padding:2px;' id='",this._messageId,"' style='padding-left:30px;'></div>",
         "<table role='presentation' border='0'>",
         "<tr><td class='Label' align='left'>",ZmMsg.findWhatLabel,"</td>",
         "<td colspan=2 id='",this._findId ,"'></td></tr>",
         "<tr><td class='Label' align='left'>",ZmMsg.replaceWithLabel,"</td>",
         "<td colspan=2 id='",this._replaceId ,"'></td></tr>",   
         "<tr><td class='Label' align='left'>",ZmMsg.directionLabel,"</td>",
         "<td colspan=2 id='",this._dirId ,"' align='left'>",
         	"<table role='presentation' cellpadding='3'><tr>",
         	"<td><input type='radio' id='",this._dirIdUp,"' name='",this._dirId,"' value='up'></td>","<td class='Label'>", "<label for='",this._dirIdUp,"'>", ZmMsg.upLabel, "</label>", "</td>",
         	"<td><input type='radio' id='",this._dirIdDown,"' name='",this._dirId,"' value='down' checked></td>","<td class='Label'>", "<label for='",this._dirIdDown,"'>", ZmMsg.downLabel, "</label>", "</td>",
         	"</tr></table>",
         "</td></tr>",        
         "<tr><td colspan='3'>",
		   	"<table role='presentation' cellpadding='3'><tr>",
		   	"<td class='Label' align='right'><input type='checkbox' id='",this._caseId,"'>",
		   	"<td class='Label' align='left'>", "<label for='", this._caseId,"'>", ZmMsg.caseSensitive, "</label>", "</td>",
         	"</tr></table>",
		 "</td></tr>",		         
         "</table>",          
         "</td></tr></table>"].join("");
     
	this.setContent(html);
	// set view
	this.setView(this._createView());
	this.registerCallback(ZmFindnReplaceDialog.FIND_BUTTON, this._handleFindButton, this);
	this.registerCallback(ZmFindnReplaceDialog.REPLACE_BUTTON, this._handleReplaceButton, this);
	this.registerCallback(ZmFindnReplaceDialog.REPLACE_ALL_BUTTON, this._handleReplaceAllButton, this);
};

ZmFindnReplaceDialog.prototype = new DwtDialog;
ZmFindnReplaceDialog.prototype.constructor = ZmFindnReplaceDialog;


ZmFindnReplaceDialog.FIND_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmFindnReplaceDialog.REPLACE_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmFindnReplaceDialog.REPLACE_ALL_BUTTON = ++DwtDialog.LAST_BUTTON;

// Public methods

/**
 * Pops-up the dialog.
 * 
 * @param	{Hash}		editorInfo		a hash of editor info
 * @param	{AjxCallback}	callback	the callback
 */
ZmFindnReplaceDialog.prototype.popup =
function(editorInfo, callback) {
	this._editorInfo = editorInfo || {};
	this._callback = callback;
    var findVal = "";
    if(editorInfo) {
        var editor = editorInfo.editor;
        findVal = editor._getSelectedText();
        if(findVal) {
            findVal = AjxStringUtil.trim(findVal.toString());
        }
    }
    this._findInput.setValue(findVal);
    this._replaceInput.setValue("");    
    DwtDialog.prototype.popup.call(this);
};

ZmFindnReplaceDialog.prototype.popdown =
function() {
	if (this._acPageList) {
		this._acPageList.show(false);
	}
	DwtDialog.prototype.popdown.call(this);
};

ZmFindnReplaceDialog._handleKeyPress = function(ev){
    var inputField = DwtControl.getTargetControl(ev);
	var charCode = DwtKeyEvent.getCharCode(ev);
	if (charCode == 13 || charCode == 3) {		
		var dialog = inputField.parent.parent;
		dialog.replaceAction('none',true);
	    return false;
	}
	return true;	
};

// Protected methods

ZmFindnReplaceDialog.prototype._createView =
function() {

	var view = new DwtComposite(this);
	var inputParams = {
		parent: view,
		type: DwtInputField.STRING,
		validationStyle: DwtInputField.CONTINUAL_VALIDATION
	}

	// create common DWT controls
	this._findInput = new DwtInputField(inputParams);
	this._findInput.reparentHtmlElement(this._findId);
	this._replaceInput = new DwtInputField(inputParams);
	this._replaceInput.reparentHtmlElement(this._replaceId);

	Dwt.setHandler(this._findInput.getInputElement(), DwtEvent.ONKEYPRESS, ZmFindnReplaceDialog._handleKeyPress);
	// create properties
	
	return view;
};

ZmFindnReplaceDialog.prototype._handleFindButton =
function(event) {
	this.replaceAction('none',true);
};

ZmFindnReplaceDialog.prototype._handleReplaceButton =
function() {
	this.replaceAction('current',false);
};

ZmFindnReplaceDialog.prototype._handleReplaceAllButton =
function() {
	this.replaceAction('all',false);
};

/**
 * Shows an informational message.
 * 
 * @param	{String}	msg		the message
 */
ZmFindnReplaceDialog.prototype.showInfoMsg =
function(msg) {
	if(!this.msgEl){
		this.msgEl = document.getElementById(this._messageId);
	}
	this.msgEl.innerHTML = msg;
};

ZmFindnReplaceDialog.prototype.replaceAction =
function(mode,findOnly)
{
	var findVal = this._findInput.getValue();
	var replaceVal = (findOnly? null : this._replaceInput.getValue());
	var radioBtns = document.getElementById(this._dirIdUp);
	var casesensitiveVal = false;
	var backwardsVal = false;
	if(radioBtns && radioBtns.checked){
		backwardsVal = true;
	}
	this._caseCheckbox = document.getElementById(this._caseId);
	
	if(this._caseCheckbox && this._caseCheckbox.checked) {
		casesensitiveVal = true;
	}	
	
	var params = {
			searchstring: findVal,
			replacestring: replaceVal,
			replacemode : mode,
			casesensitive : casesensitiveVal,
			backwards : backwardsVal
		};
	if(this._editorInfo.editor){
		var editor = this._editorInfo.editor;
		if(AjxEnv.iIE){
		editor.focus();
		}
		editor.searchnReplace(params);			
	}
	
	if (this._callback) {		
		this._callback.run(params);		
	}
};
// Private methods

}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFolderNotifyDialog")) {
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

/**
 * @overview
 */

/**
 * Creates a folder notification dialog.
 * @class
 * This class represents a folder notification dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmFolderNotifyDialog = function(parent, className) {

    className = className || "ZmFolderNotifyDialog";

	var extraButtons = [ new DwtDialog_ButtonDescriptor(ZmFolderPropsDialog.ADD_SHARE_BUTTON, ZmMsg.addShare, DwtDialog.ALIGN_LEFT)];

	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.folderNotify, extraButtons:extraButtons});
    this.getButton(DwtDialog.OK_BUTTON).setText(ZmMsg.notify);

    this.registerCallback(ZmFolderPropsDialog.ADD_SHARE_BUTTON, this._handleAddShareButton, this);

	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));

	this._folderChangeListener = new AjxListener(this, this._handleFolderChange);
	
    this.setView(this._createView());
};

ZmFolderNotifyDialog.prototype = new DwtDialog;
ZmFolderNotifyDialog.prototype.constructor = ZmFolderNotifyDialog;

// Constants

ZmFolderNotifyDialog.ADD_SHARE_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmFolderNotifyDialog.SHARES_HEIGHT = "9em";

// Public methods

ZmFolderNotifyDialog.prototype.toString =
function() {
	return "ZmFolderNotifyDialog";
};

/**
 * Pops-up the notification dialog.
 * 
 * @param	{ZmOrganizer}	organizer		the organizer
 */
ZmFolderNotifyDialog.prototype.popup =
function(organizer) {

    this._organizer = organizer;
	organizer.addChangeListener(this._folderChangeListener);

    this._populateShares(organizer);

    this._reply.setReplyType(ZmShareReply.STANDARD);
    this._reply.setReplyNote("");

    DwtDialog.prototype.popup.call(this);
};

ZmFolderNotifyDialog.prototype.popdown =
function() {
	this._organizer.removeChangeListener(this._folderChangeListener);
	this._organizer = null;
	DwtDialog.prototype.popdown.call(this);
};

// Protected methods

ZmFolderNotifyDialog.prototype._handleAddShareButton =
function(event) {
	var sharePropsDialog = appCtxt.getSharePropsDialog();

    // This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (this._organizer.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	sharePropsDialog.popup(ZmSharePropsDialog.NEW, this._organizer, null);
};

ZmFolderNotifyDialog.prototype._handleOkButton =
function(event) {

    var replyType = this._reply.getReplyType();
    var notes = replyType == ZmShareReply.QUICK ? this._reply.getReplyNote() : "";
    var shares = this._organizer.shares;

    for (var i = 0; i < shares.length; i++) {
        var share = shares[i];
        var email = share.grantee.email;
        if (!email) {
            // last resort: check if grantee name is a valid email address
            if (AjxEmailAddress.isValid(share.grantee.name))
                email = share.grantee.name;
        }

        if (!email) { continue; }

        var addrs = new AjxVector();
        var addr = new AjxEmailAddress(email, AjxEmailAddress.TO);
        addrs.add(addr);

        var tmpShare = new ZmShare({object:share.object});

        tmpShare.grantee.id = share.grantee.id;
        tmpShare.grantee.email = email;
        tmpShare.grantee.name = share.grantee.name;

			// REVISIT: What if you have delegated access???
        if(tmpShare.object.isRemote()) {
            tmpShare.grantor.id = tmpShare.object.zid;
            tmpShare.grantor.email = tmpShare.object.owner;
            tmpShare.grantor.name = tmpShare.grantor.email;
            tmpShare.link.id = tmpShare.object.rid;
        }else {
            tmpShare.grantor.id = appCtxt.get(ZmSetting.USERID);
            tmpShare.grantor.email = appCtxt.get(ZmSetting.USERNAME);
            tmpShare.grantor.name = appCtxt.get(ZmSetting.DISPLAY_NAME) || tmpShare.grantor.email;
            tmpShare.link.id = tmpShare.object.id;
        }

        tmpShare.link.perm = share.link.perm;
        tmpShare.link.name = tmpShare.object.name;
        tmpShare.link.view = ZmOrganizer.getViewName(tmpShare.object.type);
        tmpShare.link.inh = this._inheritEl ? this._inheritEl.checked : true;

        tmpShare.notes = notes;

        tmpShare.sendMessage(ZmShare.NOTIFY, addrs);
    }

    this.popdown();
};

ZmFolderNotifyDialog.prototype._handleCancelButton =
function(event) {
	this.popdown();
};

ZmFolderNotifyDialog.prototype._handleFolderChange =
function(event) {
    this._populateShares(this._organizer);
};

ZmFolderNotifyDialog.prototype._populateShares =
function(organizer) {
    
    this._sharesGroup.setContent("");

	var link = organizer.link;
	var shares = organizer.shares;
	var visible = ((!link || organizer.isAdmin()) && shares && shares.length > 0);
	if (visible) {
		AjxDispatcher.require("Share");
		var table = document.createElement("TABLE");
		table.setAttribute('role', 'presentation');
		table.border = 0;
		table.cellSpacing = 0;
		table.cellPadding = 3;
		for (var i = 0; i < shares.length; i++) {
			var share = shares[i];
			var row = table.insertRow(-1);

			var nameEl = row.insertCell(-1);
			nameEl.style.paddingRight = "15px";
			var nameText = share.grantee.name || ZmMsg.userUnknown;
			if (share.isAll()) nameText = ZmMsg.shareWithAll;
			else if (share.isPublic()) nameText = ZmMsg.shareWithPublic;
			nameEl.innerHTML = AjxStringUtil.htmlEncode(nameText);

			var roleEl = row.insertCell(-1);
			roleEl.style.paddingRight = "15px";
			roleEl.innerHTML = ZmShare.getRoleName(share.link.perm);
		}
		this._sharesGroup.setElement(table);

		var width = Dwt.DEFAULT;
		var height = shares.length > 5 ? ZmFolderNotifyDialog.SHARES_HEIGHT : Dwt.CLEAR;

		var insetElement = this._sharesGroup.getInsetHtmlElement();
		Dwt.setScrollStyle(insetElement, Dwt.SCROLL);
		Dwt.setSize(insetElement, width, height);
        this.getButton(DwtDialog.OK_BUTTON).setEnabled(true);
    }else{
        this._sharesGroup.setContent("<center>"+ZmMsg.noShareDetailsFound+"</center>");
        this.getButton(DwtDialog.OK_BUTTON).setEnabled(false);
    }
};

ZmFolderNotifyDialog.prototype._createView =
function() {

    var view = new DwtComposite(this);

    // add message group
	this._reply = new ZmShareReply(view, null, [ZmShareReply.STANDARD, ZmShareReply.QUICK]);

    this._messageGroup = new DwtGrouper(view);
	this._messageGroup.setLabel(ZmMsg.message);
	this._messageGroup.setView(this._reply);
    view.getHtmlElement().appendChild(this._messageGroup.getHtmlElement());

    // setup shares group
    this._sharesGroup = new DwtGrouper(view);
    this._sharesGroup.setLabel(ZmMsg.folderSharing);
    this._sharesGroup.setVisible(true);
    this._sharesGroup.setScrollStyle(Dwt.SCROLL);    
    view.getHtmlElement().appendChild(this._sharesGroup.getHtmlElement());

    return view;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmTimezonePicker")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a timezone dialog.
 * @class
 * This class represents a timezone dialog.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		DwtDialog
 */
ZmTimezonePicker = function(parent, className) {

    var buttons = [ ZmTimezonePicker.SAVE_BUTTON ];
    var saveButton = new DwtDialog_ButtonDescriptor(ZmTimezonePicker.SAVE_BUTTON, ZmMsg.save, DwtDialog.ALIGN_RIGHT);
	DwtDialog.call(this, {parent:parent, className:className,
        title:ZmMsg.selectTimezoneTitle, standardButtons:DwtDialog.NO_BUTTONS,
        extraButtons: [saveButton]});

    this.setButtonListener(ZmTimezonePicker.SAVE_BUTTON, new AjxListener(this, this._handleSaveButton));
    this.setContent(this._contentHtml());
	this._setTimezoneMenu();
};

ZmTimezonePicker.prototype = new DwtDialog;
ZmTimezonePicker.prototype.constructor = ZmTimezonePicker;

ZmTimezonePicker.SAVE_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmTimezonePicker.prototype.toString = 
function() {
	return "ZmTimezonePicker";
};

ZmTimezonePicker.prototype.popup =
function() {
	this._initTzSelect();
    this.autoSelectTimezone();
	DwtDialog.prototype.popup.call(this);
};

ZmTimezonePicker.prototype.cleanup =
function(bPoppedUp) {
	DwtDialog.prototype.cleanup.call(this, bPoppedUp);
};

ZmTimezonePicker.prototype._setTimezoneMenu =
function() {
	var timezoneListener = new AjxListener(this, this._timezoneListener);
	this._tzoneSelect = new DwtSelect({parent:this, parentElement: (this._htmlElId + "_tzSelect"), layout: DwtMenu.LAYOUT_SCROLL, maxRows:7});
	this._tzoneSelect.addChangeListener(timezoneListener);

	this._tzoneShowAll = new DwtCheckbox({parent:this, parentElement:(this._htmlElId+"_tzShowAll")});
	this._tzoneShowAll.setText(ZmMsg.selectTimezoneIShowAll);
	this._tzoneShowAll.addSelectionListener(new AjxListener(this, this._handleShowAllChange));
};

ZmTimezonePicker.prototype._initTzSelect =
function(force) {
    var showAll = this._tzoneShowAll.isSelected();
	var options = showAll ? AjxTimezone.getAbbreviatedZoneChoices() : AjxTimezone.getMatchingTimezoneChoices();
    var serverIdMap = {};
    var serverId;
	if (force || options.length != this._tzCount) {
		this._tzCount = options.length;
		this._tzoneSelect.clearOptions();
		for (var i = 0; i < options.length; i++) {
            if(options[i].autoDetected) continue;

            serverId = options[i].value;
            //avoid duplicate entries
            if(!showAll && serverIdMap[serverId]) continue;
            serverIdMap[serverId] = true;

            this._tzoneSelect.addOption(options[i]);
		}
	}
};

ZmTimezonePicker.prototype.autoSelectTimezone =
function() {
    if(AjxTimezone.DEFAULT_RULE.autoDetected) {

        var cRule = AjxTimezone.DEFAULT_RULE;
        var standardOffsetMatch, daylightOffsetMatch, transMatch;

        for(var i in AjxTimezone.MATCHING_RULES) {
            var rule = AjxTimezone.MATCHING_RULES[i];
            if(rule.autoDetected) continue;
            if(rule.standard.offset == cRule.standard.offset) {

                if(!standardOffsetMatch) standardOffsetMatch = rule.serverId;

                var isDayLightOffsetMatching = (cRule.daylight && rule.daylight && (rule.daylight.offset == cRule.daylight.offset));

                if(isDayLightOffsetMatching) {

                    if(!daylightOffsetMatch) daylightOffsetMatch = rule.serverId;

                    var isTransYearMatching = (rule.daylight.trans[0] == cRule.daylight.trans[0]);
                    var isTransMonthMatching = (rule.daylight.trans[1] == cRule.daylight.trans[1]);

                    if(isTransYearMatching && isTransMonthMatching && !transMatch) {
                        transMatch = rule.serverId;
                    }
                }
            }
        }
        //select closest matching timezone
        var serverId = transMatch ? transMatch : (daylightOffsetMatch || standardOffsetMatch);
        if(serverId) this._tzoneSelect.setSelectedValue(serverId);
    }else {
        var tz = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
        this._tzoneSelect.setSelectedValue(tz);
    }
};

/**
 * Updates the selected timezone.
 * 
 * @param	{Hash}	dateInfo		a hash of date information
 * @param	{ZmTimezone}	timezone		the timezone
 */
ZmTimezonePicker.prototype.updateTimezone =
function(dateInfo) {
	this._tzoneSelect.setSelectedValue(dateInfo.timezone);
};

ZmTimezonePicker.prototype.setCallback =
function(callback) {
	this._callback = callback;
};

ZmTimezonePicker.prototype._timezoneListener =
function(ev) {
	//todo: timezone change listener
};

ZmTimezonePicker.prototype._handleShowAllChange = function(evt) {
    var value = this._tzoneSelect.getValue();
    this._initTzSelect(true);
    this._tzoneSelect.setSelectedValue(value);
};

ZmTimezonePicker.prototype._contentHtml = 
function() {
	return AjxTemplate.expand("share.Dialogs#ZmTimezonePicker", {id:this._htmlElId});
};

ZmTimezonePicker.prototype._okButtonListener =
function(ev) {
	DwtDialog.prototype._buttonListener.call(this, ev, results);
};

ZmTimezonePicker.prototype._enterListener =
function(ev) {
};

ZmTimezonePicker.prototype._getTabGroupMembers =
function() {
	return [this._tzoneSelect];
};

ZmTimezonePicker.prototype._handleSaveButton =
function(event) {
    var timezone = this._tzoneSelect.getValue();
    this.popdown();
    if(this._callback) {
        this._callback.run(timezone);
    }
};

ZmTimezonePicker.prototype.handleKeyAction =
function(actionCode, ev) {
	switch (actionCode) {
		case DwtKeyMap.CANCEL:
			this._runCallbackForButtonId(DwtDialog.CANCEL_BUTTON);
			break;
		default:
			DwtDialog.prototype.handleKeyAction.call(this, actionCode, ev);
			break;
	}
	return true;
};
}
}
