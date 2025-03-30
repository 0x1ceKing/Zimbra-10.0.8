if (AjxPackage.define("MailCore")) {
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
 * Package: MailCore
 * 
 * Supports: The Mail application msg and conv list views
 * 
 * Loaded:
 * 	- When the user goes to the Mail application (typically on startup)
 */
if (AjxPackage.define("zimbraMail.mail.model.ZmMailItem")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a mail item.
 * @constructor
 * @class
 * This class represents a mail item, which may be a conversation or a mail
 * message.
 *
 * @param {constant}	type		the type of object (conv or msg)
 * @param {int}	id		the unique ID
 * @param {ZmMailList}	list		the list that contains this mail item
 * @param {Boolean}	noCache		if <code>true</code>, do not cache this item
 * 
 * @extends		ZmItem
 */
ZmMailItem = function(type, id, list, noCache) {

	if (arguments.length == 0) { return; }
	ZmItem.call(this, type, id, list, noCache);

	this._loaded = false;
	this._initializeParticipants();
};

ZmMailItem.prototype = new ZmItem;
ZmMailItem.prototype.constructor = ZmMailItem;

ZmMailItem.sortBy = ZmSearch.DATE_DESC;
ZmMailItem.sortCompare =
function(itemA, itemB) {
	var sortBy = ZmMailItem.sortBy;
	if (!sortBy || (sortBy != ZmSearch.DATE_DESC && sortBy != ZmSearch.DATE_ASC)) { return 0; }

	var itemDateA = parseInt(itemA.date);
	var itemDateB = parseInt(itemB.date);
	if (sortBy == ZmSearch.DATE_DESC) {
		return (itemDateA > itemDateB) ? -1 : (itemDateA < itemDateB) ? 1 : 0;
	}
	if (sortBy == ZmSearch.DATE_ASC) {
		return (itemDateA > itemDateB) ? 1 : (itemDateA < itemDateB) ? -1 : 0;
	}
};

ZmMailItem.prototype.toString =
function() {
	return "ZmMailItem";
};

/**
 * Gets the read/unread icon.
 *
 * @return	{String}	the icon
 */
ZmMailItem.prototype.getReadIcon =
function() {
	return this.isUnread ? "MsgUnread" : "MsgRead";
};

/**
 * Gets the mute/unmute icon.
 *
 * @return	{String}	the icon
 */
ZmMailItem.prototype.getMuteIcon =
function() {
	return "";
};


ZmMailItem.prototype.getColor =
function() {
	if (!this.tags || this.tags.length !== 1) {
		return null;
	}
	var tagList = appCtxt.getAccountTagList(this);

	var tag = tagList.getByNameOrRemote(this.tags[0]);

	return tag.getColor();
};

/**
 * Clears this item.
 * 
 */
ZmMailItem.prototype.clear = function() {

    // only clear data if no more views are using this item
    if (this.refCount <= 1) {
        this._clearParticipants();
        this._loaded = false;
    }

    ZmItem.prototype.clear.call(this);
};

ZmMailItem.prototype.getFolderId =
function() {
	return this.folderId;
};

ZmMailItem.prototype.notifyModify =
function(obj, batchMode) {
	var fields = {};
	if (obj.e && obj.e.length) {
		this._clearParticipants();
		this._initializeParticipants();
		for (var i = 0; i < obj.e.length; i++) {
			this._parseParticipantNode(obj.e[i]);
		}
		fields[ZmItem.F_FROM] = true;
		this._notify(ZmEvent.E_MODIFY, {fields:fields});
	}

	return ZmItem.prototype.notifyModify.apply(this, arguments);
};

ZmMailItem.prototype._initializeParticipants =
function() {
	this.participants = new AjxVector();
	this.participantsElided = false;
};

ZmMailItem.prototype._clearParticipants =
function() {
	if (this.participants) {
		this.participants.removeAll();
		this.participants = null;
		this.participantsElided = false;
	}
};

ZmMailItem.prototype._getFlags =
function() {
	var list = ZmItem.prototype._getFlags.call(this);
	list.push(ZmItem.FLAG_UNREAD, ZmItem.FLAG_MUTE, ZmItem.FLAG_REPLIED, ZmItem.FLAG_FORWARDED, ZmItem.FLAG_READ_RECEIPT_SENT, ZmItem.FLAG_PRIORITY);
	return list;
};

ZmMailItem.prototype._markReadLocal =
function(on) {
	this.isUnread = !on;
	this._notify(ZmEvent.E_FLAGS, {flags:[ZmItem.FLAG_UNREAD]});
};

ZmMailItem.prototype._parseParticipantNode =
function(node) {
	var type = AjxEmailAddress.fromSoapType[node.t];
	if (type == AjxEmailAddress.READ_RECEIPT) {
		this.readReceiptRequested = true;
	} else {
		// if we can find the person in contacts, use the name from there
		var contactList = AjxDispatcher.run("GetContacts"),
			contact = contactList && contactList.getContactByEmail(node.a),
			fullName = contact && contact.getFullNameForDisplay(false);

		// unless it's just the start of the email address (ZBUG-2236)
		if (node.p && node.a && node.a.startsWith(fullName + "@")) {
			fullName = node.p;
		}

		var addr = new AjxEmailAddress(node.a, type, fullName || node.p, node.d, node.isGroup, node.isGroup && node.exp);
		var ac = window.parentAppCtxt || window.appCtxt;
		ac.setIsExpandableDL(node.a, addr.canExpand);
		this.participants.add(addr);
	}
};

/**
 * Gets the email addresses of the participants.
 * 
 * @return	{Array}	an array of email addresses
 */
ZmMailItem.prototype.getEmails =
function() {
	return this.participants.map("address");
};

/**
 * Checks if this item is in Junk or Trash and the user is not including
 * those in search results.
 * 
 * @return	{Boolean}	<code>true</code> if this item is in the Junk or Trash folder
 */
ZmMailItem.prototype.ignoreJunkTrash =
function() {
	return Boolean((this.folderId == ZmFolder.ID_SPAM && !appCtxt.get(ZmSetting.SEARCH_INCLUDES_SPAM)) ||
				   (this.folderId == ZmFolder.ID_TRASH && !appCtxt.get(ZmSetting.SEARCH_INCLUDES_TRASH)));
};

ZmMailItem.prototype.setAutoSendTime =
function(autoSendTime) {
	var wasScheduled = this.isScheduled;
	var isDate = AjxUtil.isDate(autoSendTime);
	this.flagLocal(ZmItem.FLAG_ISSCHEDULED, isDate);
	var autoSendTime = isDate ? autoSendTime : null;
	if (autoSendTime != this.autoSendTime) {
		this.autoSendTime = autoSendTime;
		this._notify(ZmEvent.E_MODIFY);
	}
	if (wasScheduled != this.isScheduled) {
		this._notify(ZmEvent.E_FLAGS, {flags: ZmItem.FLAG_ISSCHEDULED});
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmConv")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a conversation.
 * @constructor
 * @class
 * This class represents a conversation, which is a collection of mail messages
 * which have the same subject.
 *
 * @param {int}	id		a unique ID
 * @param {ZmMailList}		list		a list that contains this conversation
 * 
 * @extends		ZmMailItem
 */
ZmConv = function(id, list) {

	ZmMailItem.call(this, ZmItem.CONV, id, list);
	
	// conversations are always sorted by date desc initially
	this._sortBy = ZmSearch.DATE_DESC;
	this._listChangeListener = new AjxListener(this, this._msgListChangeListener);
	this.folders = {};
	this.msgFolder = {};
};

ZmConv.prototype = new ZmMailItem;
ZmConv.prototype.constructor = ZmConv;

ZmConv.prototype.isZmConv = true;
ZmConv.prototype.toString = function() { return "ZmConv"; };

// Public methods

/**
 * Creates a conv from its JSON representation.
 * 
 * @param	{Object}	node		the node
 * @param	{Hash}		args		a hash of arguments
 * @return	{ZmConv}		the conversation
 */
ZmConv.createFromDom =
function(node, args) {
	var conv = new ZmConv(node.id, args.list);
	conv._loadFromDom(node);
	return conv;
};

/**
 * Creates a conv from msg data.
 * 
 * @param	{ZmMailMsg}		msg		the message
 * @param	{Hash}		args		a hash of arguments
 * @return	{ZmConv}		the conversation
 */
ZmConv.createFromMsg =
function(msg, args) {
	var conv = new ZmConv(msg.cid, args.list);
	conv._loadFromMsg(msg);
	return conv;
};

/**
 * Ensures that the requested range of msgs is loaded, getting them from the server if needed.
 * Because the list of msgs returned by the server contains info about which msgs matched the
 * search, we need to be careful about caching those msgs within the conv. This load function
 * should be used when in a search context, for example when expanding a conv that is the result
 * of a search.
 *
 * @param {Hash}		params						a hash of parameters:
 * @param {String}		params.query				the query used to retrieve this conv
 * @param {constant}	params.sortBy				the sort constraint
 * @param {int}			params.offset				the position of first msg to return
 * @param {int}			params.limit				the number of msgs to return
 * @param {Boolean}		params.getHtml				if <code>true</code>, return HTML part for inlined msg
 * @param {String}		params.fetch				which msg bodies to fetch (see soap.txt under SearchConvRequest)
 * @param {Boolean}		params.markRead				if <code>true</code>, mark that msg read
 * @param {boolean}		params.needExp				if not <code>false</code>, have server check if addresses are DLs
 * @param {AjxCallback}	callback					the callback to run with results
 */
ZmConv.prototype.load =
function(params, callback) {

	params = params || {};
	var ctlr = appCtxt.getCurrentController();
	var query = params.query;
	if (!query) {
		query = (ctlr && ctlr.getSearchString) 
			? ctlr.getSearchString()
			: appCtxt.get(ZmSetting.INITIAL_SEARCH);
	}
	var queryHint = params.queryHint;
	if (!queryHint) {
		queryHint = (ctlr && ctlr.getSearchStringHint)
			? ctlr.getSearchStringHint() : "";
	}
	var sortBy = params.sortBy || ZmSearch.DATE_DESC;
	var offset = params.offset || 0;
	var limit = params.limit || appCtxt.get(ZmSetting.CONVERSATION_PAGE_SIZE);

	var doSearch = true;
	if (this._loaded && this._expanded && this.msgs && this.msgs.size() && !params.forceLoad) {
		var size = this.msgs.size();
		if (this._sortBy != sortBy || this._query != query || (size != this.numMsgs && !offset)) {
			this.msgs.clear();
		} else if (!this.msgs.hasMore() || offset + limit <= size) {
			doSearch = false;	// we can use cached msg list
		}
	}
	if (!doSearch) {
		if (callback) {
			callback.run(this._createResult());
		}
	} else {
		this._sortBy = sortBy;
		this._query = query;
		this._offset = offset;
		this._limit = limit;

		var searchParams = {
			query: query,
			queryHint: queryHint,
			types: (AjxVector.fromArray([ZmItem.MSG])),
			sortBy: sortBy,
			offset: offset,
			limit: limit,
			getHtml: (params.getHtml || this.isDraft || appCtxt.get(ZmSetting.VIEW_AS_HTML)),
			accountName: (appCtxt.multiAccounts && this.getAccount().name)
		};

		var search = this.search = new ZmSearch(searchParams),
			fetch = (params.fetch === true) ? ZmSetting.CONV_FETCH_UNREAD_OR_FIRST : params.fetch || ZmSetting.CONV_FETCH_NONE;

		var needExp = fetch !== ZmSetting.CONV_FETCH_NONE;
		var	convParams = {
			cid:		this.id,
			callback:	(new AjxCallback(this, this._handleResponseLoad, [params, callback, needExp])),
			fetch:      fetch,
			markRead:	params.markRead,
			noTruncate:	params.noTruncate,
			needExp:	needExp
		};
		search.getConv(convParams);
	}
};

ZmConv.prototype._handleResponseLoad =
function(params, callback, expanded, result) {
	var results = result.getResponse();
	if (!params.offset) {
		this.msgs = results.getResults(ZmItem.MSG);
		this.msgs.convId = this.id;
		this.msgs.addChangeListener(this._listChangeListener);
		this.msgs.setHasMore(results.getAttribute("more"));
		this._loaded = true;
		this._expanded = expanded;
	}
	if (callback) {
		callback.run(result);
	}
};

/**
 * This method supports ZmZimletBase::getMsgsForConv. It loads *all* of this conv's
 * messages, including their content. Note that it is not search-based, and uses
 * GetConvRequest rather than SearchConvRequest.
 * 
 * @param {Hash}			params				a hash of parameters
 * @param {Boolean}			params.fetchAll		if <code>true</code>, fetch content of all msgs
 * @param {AjxCallback}		callback			the callback
 * @param {ZmBatchCommand}	batchCmd			the batch cmd that contains this request
 */
ZmConv.prototype.loadMsgs =
function(params, callback, batchCmd) {

	params = params || {};
	var jsonObj = {GetConvRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.GetConvRequest;
	var c = request.c = {
		id:		this.id,
		needExp:	true,
		html:	(params.getHtml || this.isDraft || appCtxt.get(ZmSetting.VIEW_AS_HTML))
	};
	if (params.fetchAll) {
		c.fetch = "all";
	}
	ZmMailMsg.addRequestHeaders(c);

	// never pass "undefined" as arg to a callback!
	var respCallback = this._handleResponseLoadMsgs.bind(this, callback || null);
	if (batchCmd) {
		batchCmd.addRequestParams(jsonObj, respCallback);
	} else {
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	}
};

ZmConv.prototype._handleResponseLoadMsgs =
function(callback, result) {

	var resp = result.getResponse().GetConvResponse.c[0];
	this.msgIds = [];

	if (!this.msgs) {
		// create new msg list
		this.msgs = new ZmMailList(ZmItem.MSG, this.search);
		this.msgs.convId = this.id;
		this.msgs.addChangeListener(this._listChangeListener);
	}
	else {
		//don't recreate if it already exists, so we don't lose listeners.. (see ZmConvView2.prototype.set)
		this.msgs.removeAllItems();
	}
	if (this.search && !this.msgs.search) {
		this.msgs.search = this.search;
	}
	this.msgs.setHasMore(false);
	this._loaded = true;

	var len = resp.m.length;
	//going from last to first since GetConvRequest returns the msgs in order of creation (older first) but we keep things newer first.
	for (var i = len - 1; i >= 0; i--) {
		var msgNode = resp.m[i];
		this.msgIds.push(msgNode.id);
		this.msgFolder[msgNode.id] = msgNode.l;
		msgNode.su = resp.su;
		// construct ZmMailMsg's so they get cached
		var msg = ZmMailMsg.createFromDom(msgNode, {list: this.msgs});
		this.msgs.add(msg);
	}

	if (callback) { callback.run(result); }
};

/**
 * Adds the message at the given index.
 *
 * @param	{ZmMailMsg}		msg		the message to add
 * @param	{int}			index	where to add it
 */
ZmConv.prototype.addMsg =
function(msg, index) {

	if (!this.msgs) {
		this.msgs = new ZmMailList(ZmItem.MSG, this.search);
		this.msgs.convId = this.id;
		this.msgs.addChangeListener(this._listChangeListener);
		this.msgs.setHasMore(false);
	}
	if (this.search && !this.msgs.search) {
		this.msgs.search = this.search;
	}
	this.msgs.add(msg, index);
	this.msgIds = [];
	var a = this.msgs.getArray();
	for (var i = 0, len = a.length; i < len; i++) {
		this.msgIds.push(a[i].id);
	}
	this.msgFolder[msg.id] = msg.folderId;
};

/**
 * Removes the message.
 * 
 * @param	{ZmMailMsg}		msg		the message to remove
 */
ZmConv.prototype.removeMsg =
function(msg) {
	if (this.msgs) {
		this.msgs.remove(msg, true);
	}
	if (this.msgIds && this.msgIds.length) {
		AjxUtil.arrayRemove(this.msgIds, msg.id);
	}
	delete this.msgFolder[msg.id];
};

ZmConv.prototype.canAddTag =
function(tagName) {
	if (!this.msgs) {
		return ZmItem.prototype.canAddTag.call(this, tagName);
	}
	var msgs = this.msgs.getArray();
	for (var i = 0; i < msgs.length; i++) {
		var msg = msgs[i];
		if (msg.canAddTag(tagName)) {
			return true;
		}
	}
	return false;
};

ZmConv.prototype.mute =
function() {
    this.isMute = true;
    if(this.msgs) {
        var msgs = this.msgs.getArray();
		for (var i = 0; i < msgs.length; i++) {
			var msg = msgs[i];
			msg.mute();
		}
    }
};

ZmConv.prototype.unmute =
function() {
    this.isMute = false;
    if(this.msgs) {
        var msgs = this.msgs.getArray();
		for (var i = 0; i < msgs.length; i++) {
			var msg = msgs[i];
			msg.unmute();
		}
    }
};

/**
 * Gets the mute/unmute icon.
 *
 * @return	{String}	the icon
 */
ZmConv.prototype.getMuteIcon =
function() {
	return this.isMute ? "Mute" : "Unmute";
};


ZmConv.prototype.clear =
function() {
	if (this.isInUse) {
		return;
	}
	if (this.msgs) {
		this.msgs.clear();
		this.msgs.removeChangeListener(this._listChangeListener);
		this.msgs = null;
	}
	this.msgIds = [];
	this.folders = {};
	this.msgFolder = {};
	
	ZmMailItem.prototype.clear.call(this);
};

/**
 * Checks if the conversation is read only. Returns false if it cannot be determined.
 * 
 * @return	{Boolean}	<code>true</code> if the conversation is read only
 */
ZmConv.prototype.isReadOnly =
function() {
	
	if (this._loaded && this.msgs && this.msgs.size()) {
		// conv has been loaded, check each msg
		var msgs = this.msgs.getArray();
		for (var i = 0; i < msgs.length; i++) {
			if (msgs[i].isReadOnly()) {
				return true;
			}
		}
	}
	else {
		// conv has not been loaded, see if it's constrained to a folder
		var folderId = this.getFolderId();
		var folder = folderId && appCtxt.getById(folderId);
		return !!(folder && folder.isReadOnly());
	}
	return false;
};

/**
 * Checks if this conversation has a message that matches the given search.
 * If we're not able to tell whether a msg matches, we return the given default value.
 *
 * @param {ZmSearch}	search			the search to match against
 * @param {Object}	    defaultValue	the value to return if search is not matchable or conv not loaded
 * @return	{Boolean}	<code>true</code> if this conversation has a matching message
 */
ZmConv.prototype.hasMatchingMsg =
function(search, defaultValue) {

	var msgs = this.msgs && this.msgs.getArray(),
		hasUnknown = false;

	if (msgs && msgs.length > 0) {
		for (var i = 0; i < msgs.length; i++) {
			var msg = msgs[i],
				msgMatches = search.matches(msg);

			if (msgMatches && !msg.ignoreJunkTrash() && this.folders[msg.folderId]) {
				return true;
			}
			else if (msgMatches === null) {
				hasUnknown = true;
			}
		}
	}

	return hasUnknown ? !!defaultValue : false;
};

ZmConv.prototype.containsMsg =
function(msg) {
	return this.msgIds && AjxUtil.arrayContains(this.msgIds, msg.id);
};

ZmConv.prototype.ignoreJunkTrash =
function() {
	return Boolean((this.numMsgs == 1) && this.folders &&
				   ((this.folders[ZmFolder.ID_SPAM] && !appCtxt.get(ZmSetting.SEARCH_INCLUDES_SPAM)) ||
			 	    (this.folders[ZmFolder.ID_TRASH] && !appCtxt.get(ZmSetting.SEARCH_INCLUDES_TRASH))));
};

ZmConv.prototype.getAccount =
function() {
    // pull out the account from the fully-qualified ID
	if (!this.account) {
        var folderId = this.getFolderId();
        var folder = folderId && appCtxt.getById(folderId);
        // make sure current folder is not remote folder
        // in that case getting account from parseID will fail if
        // the shared account is also configured in ZD
        if (!(folder && folder._isRemote)) {
            this.account = ZmOrganizer.parseId(this.id).account;
        }
    }

    // fallback on the active account if account not found from parsed ID (most
    // likely means this is a conv inside a shared folder of the active acct)
    if (!this.account) {
        this.account = appCtxt.getActiveAccount();
    }
    return this.account;

};

/**
* Handles a modification notification.
* TODO: Bundle MODIFY notifs (should bubble up to parent handlers as well)
*
* @param obj		item with the changed attributes/content
* 
* @private
*/
ZmConv.prototype.notifyModify =
function(obj, batchMode) {
	var fields = {};
	// a conv's ID can change if it's a virtual conv becoming real; 'this' will be
	// the old conv; if we can, we switch to using the new conv, which will be more
	// up to date; the new conv will be available if it was received via search results
	if (obj._newId != null) {
		var conv = appCtxt.getById(obj._newId) || this;
		conv._oldId = this.id;
		conv.id = obj._newId;
		appCtxt.cacheSet(conv._oldId);
		appCtxt.cacheSet(conv.id, conv);
		conv.msgs = conv.msgs || this.msgs;
		if (conv.msgs) {
			conv.msgs.convId = conv.id;
			var a = conv.msgs.getArray();
			for (var i = 0; i < a.length; i++) {
				a[i].cid = conv.id;
			}
		}
		conv.folders = AjxUtil.hashCopy(this.folders);
		if (conv.list && conv._oldId && conv.list._idHash[conv._oldId]) {
			delete conv.list._idHash[conv._oldId];
			conv.list._idHash[conv.id] = conv;
		}
		fields[ZmItem.F_ID] = true;
		conv._notify(ZmEvent.E_MODIFY, {fields : fields});
	}
	if (obj.n != null) {
		this.numMsgs = obj.n;
		fields[ZmItem.F_SIZE] = true;
		this._notify(ZmEvent.E_MODIFY, {fields : fields});
	}

	return ZmMailItem.prototype.notifyModify.apply(this, arguments);
};

/**
 * Checks if any of the msgs within this conversation has the given value for
 * the given flag. If the conv hasn't been loaded, looks at the conv-level flag.
 *
 * @param {constant}	flag		the flag (see <code>ZmItem.FLAG_</code> constants)
 * @param {Boolean}	value		the test value
 * @return	{Boolean}	<code>true</code> if the flag exists
 */
ZmConv.prototype.hasFlag =
function(flag, value) {
	if (!this.msgs) {
		return (this[ZmItem.FLAG_PROP[flag]] == value);
	}
	var msgs = this.msgs.getArray();
	for (var j = 0; j < msgs.length; j++) {
		var msg = msgs[j];
		if (msg[ZmItem.FLAG_PROP[flag]] == value) {
			return true;
		}
	}
	return false;
};

/**
 * Checks to see if a change in the value of a msg flag changes the value of the conv's flag. That will happen
 * for the first msg to get an off flag turned on, or when the last msg to have an on flag turns it off.
 */
ZmConv.prototype._checkFlags = 
function(flags) {

	var convOn = {};
	var msgsOn = {};
	for (var i = 0; i < flags.length; i++) {
		var flag = flags[i];
		if (!(flag == ZmItem.FLAG_FLAGGED || flag == ZmItem.FLAG_UNREAD || flag == ZmItem.FLAG_MUTE || flag == ZmItem.FLAG_ATTACH || flag == ZmItem.FLAG_PRIORITY)) { continue; }
		convOn[flag] = this[ZmItem.FLAG_PROP[flag]];
		msgsOn[flag] = this.hasFlag(flag, true);
	}			
	var doNotify = false;
	var flags = [];
	for (var flag in convOn) {
		if (convOn[flag] != msgsOn[flag]) {
			this[ZmItem.FLAG_PROP[flag]] = msgsOn[flag];
			flags.push(flag);
			doNotify = true;
		}
	}

	if (doNotify) {
		this._notify(ZmEvent.E_FLAGS, {flags: flags});
	}
};

/**
 * Figure out if any tags have been added or removed by comparing what we have now with what
 * our messages have.
 * 
 * @private
 */
ZmConv.prototype._checkTags = 
function() {
	var newTags = {};
	var allTags = {};
	
	for (var tagId in this.tagHash) {
		allTags[tagId] = true;
	}

	if (this.msgs) {
		var msgs = this.msgs.getArray();
		if (!(msgs && msgs.length)) { return; }
		for (var i = 0; i < msgs.length; i++) {
			for (var tagId in msgs[i].tagHash) {
				newTags[tagId] = true;
				allTags[tagId] = true;
			}
		}

		var notify = false;
		for (var tagId in allTags) {
			if (!this.tagHash[tagId] && newTags[tagId]) {
				if (this.tagLocal(tagId, true)) {
					notify = true;
				}
			} else if (this.tagHash[tagId] && !newTags[tagId]) {
				if (this.tagLocal(tagId, false)) {
					notify = true;
				}
			}
		}
	}

	if (notify) {
		this._notify(ZmEvent.E_TAGS);
	}
};

ZmConv.prototype.moveLocal =
function(folderId) {
	if (this.folders) {
		delete this.folders;
	}
	this.folders = {};
	this.folders[folderId] = true;
};

ZmConv.prototype.getMsgList =
function(offset, ascending, omit) {
	// this.msgs will not be set if the conv has not yet been loaded
	var list = this.msgs && this.msgs.getArray();
	var a = list ? (list.slice(offset || 0)) : [];
	if (omit) {
		var a1 = [];
		for (var i = 0; i < a.length; i++) {
			var msg = a[i];
			if (!(msg && msg.folderId && omit[msg.folderId])) {
				a1.push(msg);
			}
		}
		a = a1;
	}
	if (ascending) {
		a.reverse();
	}
	return a;
};

ZmConv.prototype.getFolderId =
function() {
	return this.folderId || (this.list && this.list.search && this.list.search.folderId);
};

/**
 * Gets the first relevant msg of this conv, loading the conv msg list if necessary. If the
 * msg itself hasn't been loaded we also load the conv. The conv load is a SearchConvRequest
 * which fetches the content of the first msg and returns it via a callback. If no
 * callback is provided, the conv will not be loaded - if it already has a msg list, the msg
 * will come from there; otherwise, a skeletal msg with an ID is returned. Note that a conv
 * always has at least one msg.
 * 
 * @param {Hash}	params	a hash of parameters
 * @param {String}      params.query				the query used to retrieve this conv
 * @param {constant}      params.sortBy			the sort constraint
 * @param {int}	      params.offset			the position of first msg to return
 * @param {int}	params.limit				the number of msgs to return
 * @param {AjxCallback}	callback			the callback to run with results
 * 
 * @return	{ZmMailMsg}	the message
 */
ZmConv.prototype.getFirstHotMsg =
function(params, callback) {
	
	var msg;
	params = params || {};

	if (this.msgs && this.msgs.size()) {
		msg = this.msgs.getFirstHit(params.offset, params.limit, params.foldersToOmit);
	}

	if (callback) {
		if (msg && msg._loaded && !params.forceLoad) {
			callback.run(msg);
		}
		else {
			var respCallback = this._handleResponseGetFirstHotMsg.bind(this, params, callback);
			params.fetch = ZmSetting.CONV_FETCH_FIRST;
			this.load(params, respCallback);
		}
	}
	else {
		// do our best to return a "realized" message by checking cache
		if (!msg && this.msgIds && this.msgIds.length) {
			var id = this.msgIds[0];
			msg = appCtxt.getById(id);
			if (!msg) {
				if (!this.msgs) {
					this.msgs = new ZmMailList(ZmItem.MSG);
					this.msgs.convId = this.id;
					this.msgs.addChangeListener(this._listChangeListener);
				}
				msg = new ZmMailMsg(id, this.msgs);
			}
		}
		return msg;
	}
};

ZmConv.prototype._handleResponseGetFirstHotMsg = function(params, callback) {

	var msg = this.msgs.getFirstHit(params.offset, params.limit, params.foldersToOmit);
	// should have a loaded msg
	if (msg && msg._loaded) {
		if (callback) {
			callback.run(msg);
		}
	}
	else {
		// desperate measures - get msg content from server
		if (!msg && this.msgIds && this.msgIds.length) {
			msg = new ZmMailMsg(this.msgIds[0]);
		}
		var respCallback = this._handleResponseLoadMsg.bind(this, msg, callback);
		msg.load({getHtml:params.getHtml, callback:respCallback});
	}
};

ZmConv.prototype._handleResponseLoadMsg =
function(msg, callback) {
	if (msg && callback) {
		callback.run(msg);
	}
};

ZmConv.prototype._loadFromDom =
function(convNode) {

	this.numMsgs = convNode.n;
	this.date = convNode.d;
	this._parseFlagsOfMsgs(convNode.m);   // parse flags based on msgs
	this._parseTagNames(convNode.tn);
	if (convNode.e) {
		for (var i = 0; i < convNode.e.length; i++) {
			this._parseParticipantNode(convNode.e[i]);
		}
	}
	this.participantsElided = convNode.elided;
	this.subject = convNode.su;
	this.fragment = convNode.fr;
	this.sf = convNode.sf;

	// note that the list of msg IDs in a search result is partial - only msgs that matched are included
	if (convNode.m) {
		this.msgIds = [];
		this.msgFolder = {};
		for (var i = 0, count = convNode.m.length; i < count; i++) {
			var msgNode = convNode.m[i];
			this.msgIds.push(msgNode.id);
			this.msgFolder[msgNode.id] = msgNode.l;
			this.folders[msgNode.l] = true;
		}
		if (count == 1) {
			var msgNode = convNode.m[0];

			// bug 49067 - SearchConvResponse does not return the folder ID w/in
			// the msgNode as fully qualified so reset if this 1-msg conv was
			// returned by a simple folder search
			// TODO: if 85358 is fixed, we can remove this section
			var searchFolderId = this.list && this.list.search && this.list.search.folderId;
			if (searchFolderId) {
				this.folderId = searchFolderId;
				this.folders[searchFolderId] = true;
			} else if (msgNode.l) {
				this.folderId = msgNode.l;
				this.folders[msgNode.l] = true;
			}
			else {
				AjxDebug.println(AjxDebug.NOTIFY, "no folder added for conv");
			}
			if (msgNode.s) {
				this.size = msgNode.s;
			}

			if (msgNode.autoSendTime) {
				var timestamp = parseInt(msgNode.autoSendTime);
				if (timestamp) {
					this.setAutoSendTime(new Date(timestamp));
				}
			}
		}
	}

	// Grab the metadata, keyed off the section name
	if (convNode.meta) {
		this.meta = {};
		for (var i = 0; i < convNode.meta.length; i++) {
			var section = convNode.meta[i].section;
			this.meta[section] = {};
			this.meta[section]._attrs = {};
			for (a in convNode.meta[i]._attrs) {
				this.meta[section]._attrs[a] = convNode.meta[i]._attrs[a];
			}
		}
	}
};

ZmConv.prototype._loadFromMsg =
function(msg) {
	this.date = msg.date;
	this.isFlagged = msg.isFlagged;
	this.isUnread = msg.isUnread;
	for (var i = 0; i < msg.tags.length; i++) {
		this.tagLocal(msg.tags[i], true);
	}
	var a = msg.participants ? msg.participants.getArray() : null;
	this.participants = new AjxVector();
	if (a && a.length) {
		for (var i = 0; i < a.length; i++) {
			var p = a[i];
			if ((msg.isDraft && p.type == AjxEmailAddress.TO) ||
				(!msg.isDraft && p.type == AjxEmailAddress.FROM)) {
				this.participants.add(p);
			}
		}
	}
	this.subject = msg.subject;
	this.fragment = msg.fragment;
	this.sf = msg.sf;
	this.msgIds = [msg.id];
	this.msgFolder[msg.id] = msg.folderId;
	//add a flag to redraw this conversation when additional information is available
	this.redrawConvRow = true;
};

ZmConv.prototype._msgListChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_MSG) {	return; }
	if (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL) {
		this._checkTags();
	} else if (ev.event == ZmEvent.E_FLAGS) {
		this._checkFlags(ev.getDetail("flags"));
	} else if (ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE) {
		// a msg was moved or deleted, see if this conv's row should remain
		if (this.list && this.list.search && !this.hasMatchingMsg(this.list.search, true)) {
            this.moveLocal(ev.item && ev.item.folderId);
			this._notify(ev.event);
		}
	}
};

/**
 * Returns a result created from this conv's data that looks as if it were the result
 * of an actual SOAP request.
 * 
 * @private
 */
ZmConv.prototype._createResult =
function() {
	var searchResult = new ZmSearchResult(this.search);
	searchResult.type = ZmItem.MSG;
	searchResult._results[ZmItem.MSG] = this.msgs;
	return new ZmCsfeResult(searchResult);
};

// Updates the conversation fragment based on the newest message in the conversation, optionally ignoring an array of messages
ZmConv.prototype.updateFragment =
function(ignore) {
	var best;
	var size = this.msgs && this.msgs.size();
	if (size) {
		for (var j = size - 1; j >= 0; j--) {
			var candidate = this.msgs.get(j);
			if (ignore && AjxUtil.indexOf(ignore, candidate) != -1) { continue; }
			if (candidate.fragment && (!best || candidate.date > best.date)) {
				best = candidate;
			}
		}
	}
	if (best) {
		this.fragment = best.fragment;
	}
};

/**
 * Gets a vector of addresses of the given type.
 *
 * @param {constant}	type			an email address type
 *
 * @return	{AjxVector}	a vector of email addresses
 */
ZmConv.prototype.getAddresses =
function(type) {

	var p = this.participants ? this.participants.getArray() : [];
	var list = [];
	for (var i = 0, len = p.length; i < len; i++) {
		var addr = p[i];
		if (addr.type == type) {
			list.push(addr);
		}
	}
	return AjxVector.fromArray(list);
};

/**
 * Gets the status tool tip.
 * 
 * @return	{String}	the tool tip
 */
ZmConv.prototype.getStatusTooltip =
function() {
	if (this.numMsgs === 1 && this.msgIds && this.msgIds.length > 0) {
		var msg = appCtxt.getById(this.msgIds[0]);
		if (msg) {
			return msg.getStatusTooltip();
		}
	}

	var status = [];

	// keep in sync with ZmMailMsg.prototype.getStatusTooltip
	if (this.isScheduled) {
		status.push(ZmMsg.scheduled);
	}
	if (this.isUnread) {
		status.push(ZmMsg.unread);
	}
	if (this.isReplied) {
		status.push(ZmMsg.replied);
	}
	if (this.isForwarded) {
		status.push(ZmMsg.forwarded);
	}
	if (this.isDraft) {
		status.push(ZmMsg.draft);
	} else if (this.isSent) {
		//sentAt is for some reason "sent", which is what we need.
		status.push(ZmMsg.sentAt);
	}

	return status.join(", ");
};

/**
 * Returns the number of unread messages in this conversation.
 */
ZmConv.prototype.getNumUnreadMsgs =
function() {
	var numUnread = 0;
	var msgs = this.getMsgList();
	if (msgs) {
		for (var i = 0, len = msgs.length; i < len; i++) {
			if (msgs[i].isUnread) {
				numUnread++;
			}
		}
		return numUnread;
	}
	return null;
};

/**
 * Parse flags based on which flags are in the messages we will display (which normally
 * excludes messages in Trash or Junk).
 *
 * @param   [array]     msgs        msg nodes from search result
 *
 * @private
 */
ZmConv.prototype._parseFlagsOfMsgs = function(msgs) {

	// use search from list since it's not yet set in controller
	var ignore = ZmMailApp.getFoldersToOmit(this.list && this.list.search),
		msg, len = msgs ? msgs.length : 0, i,
		flags = {};

	for (i = 0; i < len; i++) {
		msg = msgs[i];
		if (!ignore[msg.l]) {
			var msgFlags = msg.f && msg.f.split(''),
				len1 = msgFlags ? msgFlags.length : 0, j;

			for (j = 0; j < len1; j++) {
				flags[msgFlags[j]] = true;
			}
		}
	}

	this.flags = AjxUtil.keys(flags).join('');
	ZmItem.prototype._parseFlags.call(this, this.flags);
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailMsg")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file defines the mail message.
 */

/**
 * @constructor
 * @class
 * Creates a new (empty) mail message.
 *
 * @param {int}			id			the unique ID
 * @param {Array}		list		the list that contains this message
 * @param {Boolean}		noCache		if true, do not cache this message
 * 
 * @extends	ZmMailItem
 */
ZmMailMsg = function(id, list, noCache) {

	ZmMailItem.call(this, ZmItem.MSG, id, list, noCache);

	this.inHitList = false;
	this._attHitList = [];
	this._inviteDescBody = {};
	this._addrs = {};

	// info about MIME parts
	this.attachments = [];
	this._bodyParts = [];
	this._contentType = {};
	
	for (var i = 0; i < ZmMailMsg.ADDRS.length; i++) {
		var type = ZmMailMsg.ADDRS[i];
		this._addrs[type] = new AjxVector();
	}
	this.identity = null;
};

ZmMailMsg.prototype = new ZmMailItem;
ZmMailMsg.prototype.constructor = ZmMailMsg;

ZmMailMsg.prototype.isZmMailMsg = true;
ZmMailMsg.prototype.toString = function() {	return "ZmMailMsg"; };

ZmMailMsg.DL_SUB_VERSION = "0.1";

ZmMailMsg.ADDRS = [AjxEmailAddress.FROM, AjxEmailAddress.TO, AjxEmailAddress.CC,
				   AjxEmailAddress.BCC, AjxEmailAddress.REPLY_TO, AjxEmailAddress.SENDER,
                   AjxEmailAddress.RESENT_FROM];

ZmMailMsg.COMPOSE_ADDRS = [AjxEmailAddress.TO, AjxEmailAddress.CC, AjxEmailAddress.BCC];

ZmMailMsg.HDR_FROM		= AjxEmailAddress.FROM;
ZmMailMsg.HDR_TO		= AjxEmailAddress.TO;
ZmMailMsg.HDR_CC		= AjxEmailAddress.CC;
ZmMailMsg.HDR_BCC		= AjxEmailAddress.BCC;
ZmMailMsg.HDR_REPLY_TO	= AjxEmailAddress.REPLY_TO;
ZmMailMsg.HDR_SENDER	= AjxEmailAddress.SENDER;
ZmMailMsg.HDR_DATE		= "DATE";
ZmMailMsg.HDR_SUBJECT	= "SUBJECT";
ZmMailMsg.HDR_LISTID    = "List-ID";
ZmMailMsg.HDR_XZIMBRADL = "X-Zimbra-DL";
ZmMailMsg.HDR_INREPLYTO = "IN-REPLY-TO";

ZmMailMsg.HDR_KEY = {};
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_FROM]		= ZmMsg.from;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_TO]			= ZmMsg.to;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_CC]			= ZmMsg.cc;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_BCC]		= ZmMsg.bcc;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_REPLY_TO]	= ZmMsg.replyTo;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_SENDER]		= ZmMsg.sender;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_DATE]		= ZmMsg.sentAt;
ZmMailMsg.HDR_KEY[ZmMailMsg.HDR_SUBJECT]	= ZmMsg.subject;

// Ordered list - first matching status wins
ZmMailMsg.STATUS_LIST = ["isScheduled", "isDraft", "isReplied", "isForwarded", "isSent", "isUnread"];

ZmMailMsg.STATUS_ICON = {};
ZmMailMsg.STATUS_ICON["isDraft"]		= "MsgStatusDraft";
ZmMailMsg.STATUS_ICON["isReplied"]		= "MsgStatusReply";
ZmMailMsg.STATUS_ICON["isForwarded"]	= "MsgStatusForward";
ZmMailMsg.STATUS_ICON["isSent"]			= "MsgStatusSent";
ZmMailMsg.STATUS_ICON["isUnread"]		= "MsgStatusUnread";
ZmMailMsg.STATUS_ICON["isScheduled"]	= "SendLater";

ZmMailMsg.PSTATUS_ACCEPT		= "AC";
ZmMailMsg.PSTATUS_DECLINED		= "DE";
ZmMailMsg.PSTATUS_TENTATIVE		= "TE";

ZmMailMsg.STATUS_ICON[ZmMailMsg.PSTATUS_ACCEPT]		= "CalInviteAccepted";
ZmMailMsg.STATUS_ICON[ZmMailMsg.PSTATUS_DECLINED]	= "CalInviteDeclined";
ZmMailMsg.STATUS_ICON[ZmMailMsg.PSTATUS_TENTATIVE]	= "CalInviteTentative";

// tooltips for invite status icons
ZmMailMsg.TOOLTIP = {};
ZmMailMsg.TOOLTIP["Appointment"]		= ZmMsg.appointment;
ZmMailMsg.TOOLTIP["CalInviteAccepted"]	= ZmMsg.ptstAccept;
ZmMailMsg.TOOLTIP["CalInviteDeclined"]	= ZmMsg.ptstDeclined;
ZmMailMsg.TOOLTIP["CalInviteTentative"]	= ZmMsg.ptstTentative;

// We just hard-code "Re:" or "Fwd:", but other clients may use localized versions
ZmMailMsg.SUBJ_PREFIX_RE = new RegExp("^\\s*(Re|Fw|Fwd|" + ZmMsg.re + "|" + ZmMsg.fwd + "|" + ZmMsg.fw + "):" + "\\s*", "i");

ZmMailMsg.URL_RE = /((telnet:)|((https?|ftp|gopher|news|file):\/\/)|(www\.[\w\.\_\-]+))[^\s\xA0\(\)\<\>\[\]\{\}\'\"]*/i;

ZmMailMsg.CONTENT_PART_ID = "ci";
ZmMailMsg.CONTENT_PART_LOCATION = "cl";

// Additional headers to request.  Also used by ZmConv and ZmSearch
ZmMailMsg.requestHeaders = {listId: ZmMailMsg.HDR_LISTID, xZimbraDL: ZmMailMsg.HDR_XZIMBRADL,replyTo:ZmMailMsg.HDR_INREPLYTO};

/**
 * Fetches a message from the server.
 *
 * @param {Hash}			params					a hash of parameters
 * @param {ZmZimbraMail}	params.sender			the provides access to sendRequest()
 * @param {int}				params.msgId			the ID of the msg to be fetched.
 * @param {int}				params.partId 			the msg part ID (if retrieving attachment part, i.e. rfc/822)
 * @param {int}				params.ridZ   			the RECURRENCE-ID in Z (UTC) timezone
 * @param {Boolean}			params.getHtml			if <code>true</code>, try to fetch html from the server
 * @param {Boolean}			params.markRead			if <code>true</code>, mark msg read
 * @param {AjxCallback}		params.callback			the async callback
 * @param {AjxCallback}		params.errorCallback	the async error callback
 * @param {Boolean}			params.noBusyOverlay	if <code>true</code>, do not put up busy overlay during request
 * @param {Boolean}			params.noTruncate		if <code>true</code>, do not truncate message body
 * @param {ZmBatchCommand}	params.batchCmd			if set, request gets added to this batch command
 * @param {String}			params.accountName		the name of the account to send request on behalf of
 * @param {boolean}			params.needExp			if not <code>false</code>, have server check if addresses are DLs
 */
ZmMailMsg.fetchMsg =
function(params) {
	var jsonObj = {GetMsgRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.GetMsgRequest;
	var m = request.m = {};
	m.id = params.msgId;
	if (params.partId) {
		m.part = params.partId;
	}
	if (params.markRead) {
		m.read = 1;
	}
	if (params.getHtml) {
		m.html = 1;
	}
	if (params.needExp !== false) {
		m.needExp = 1;
	}

	if (params.ridZ) {
		m.ridZ = params.ridZ;
	}

	ZmMailMsg.addRequestHeaders(m);

	if (!params.noTruncate) {
		m.max = appCtxt.get(ZmSetting.MAX_MESSAGE_SIZE) || ZmMailApp.DEFAULT_MAX_MESSAGE_SIZE;
	}

	if (params.batchCmd) {
		params.batchCmd.addRequestParams(jsonObj, params.callback);
	} else {
		var newParams = {
			jsonObj:		jsonObj,
			asyncMode:		true,
            offlineCache:   true,
			callback:		ZmMailMsg._handleResponseFetchMsg.bind(null, params.callback),
			errorCallback:	params.errorCallback,
			noBusyOverlay:	params.noBusyOverlay,
			accountName:	params.accountName
		};
        newParams.offlineCallback = ZmMailMsg._handleOfflineResponseFetchMsg.bind(null, m.id, newParams.callback);
		params.sender.sendRequest(newParams);
	}
};

ZmMailMsg._handleResponseFetchMsg =
function(callback, result) {
	if (callback) {
		callback.run(result);
	}
};

ZmMailMsg._handleOfflineResponseFetchMsg =
function(msgId, callback) {
    var getItemCallback = ZmMailMsg._handleOfflineResponseFetchMsgCallback.bind(null, callback);
    ZmOfflineDB.getItem(msgId, ZmApp.MAIL, getItemCallback);
};

ZmMailMsg._handleOfflineResponseFetchMsgCallback =
function(callback, result) {
    var response = {
        GetMsgResponse : {
            m : result
        }
    };
    if (callback) {
        callback(new ZmCsfeResult(response));
    }
};

ZmMailMsg.stripSubjectPrefixes =
function(subj) {
	var regex = ZmMailMsg.SUBJ_PREFIX_RE;
	while (regex.test(subj)) {
		subj = subj.replace(regex, "");
	}
	return subj;
};

// Public methods

/**
 * Gets a vector of addresses of the given type.
 *
 * @param {constant}	type			an email address type
 * @param {Hash}		used			an array of addresses that have been used. If not <code>null</code>,
 *										then this method will omit those addresses from the
 * 										returned vector and will populate used with the additional new addresses
 * @param {Boolean}		addAsContact	if <code>true</code>, emails should be converted to {@link ZmContact} objects
 * @param {boolean}		dontUpdateUsed	if true, do not update the hash of used addresses
 * 
 * @return	{AjxVector}	a vector of email addresses
 */
ZmMailMsg.prototype.getAddresses =
function(type, used, addAsContact, dontUpdateUsed) {
	if (!used) {
		return this._addrs[type];
	} else {
		var a = this._addrs[type].getArray();
		var addrs = [];
		for (var i = 0; i < a.length; i++) {
			var addr = a[i];
			var email = addr.getAddress();
			if (!email) { continue; }
			email = email.toLowerCase();
			if (!used[email]) {
				var contact = addr;
				if (addAsContact) {
					var cl = AjxDispatcher.run("GetContacts");
					contact = cl && cl.getContactByEmail(email);
					if (contact == null || !cl) {
						contact = new ZmContact(null);
						contact.initFromEmail(addr);
					}
				}
				addrs.push(contact);
			}
			if (!dontUpdateUsed) {
				used[email] = true;
			}
		}
		return AjxVector.fromArray(addrs);
	}
};

/**
 * Gets a Reply-To address if there is one, otherwise the From address
 * unless this message was sent by the user, in which case, it is the To
 * field (but only in the case of Reply All). A list is returned, since
 * theoretically From and Reply To can have multiple addresses.
 * 
 * @return	{AjxVector}	an array of {@link AjxEmailAddress} objects
 */
ZmMailMsg.prototype.getReplyAddresses =
function(mode, aliases, isDefaultIdentity) {

	if (!this.isSent) { //ignore reply_to for sent messages.
		// reply-to has precedence over everything else
		var addrVec = this._addrs[AjxEmailAddress.REPLY_TO];
	}
	if (!addrVec && this.isInvite() && this.needsRsvp()) {
		var invEmail = this.invite.getOrganizerEmail(0);
		if (invEmail) {
			return AjxVector.fromArray([new AjxEmailAddress(invEmail)]);
		}
	}

	if (!(addrVec && addrVec.size())) {
		if (mode == ZmOperation.REPLY_CANCEL || (this.isSent && mode == ZmOperation.REPLY_ALL)) {
			addrVec = this.isInvite() ? this._getAttendees() : this.getAddresses(AjxEmailAddress.TO, aliases, false, true);
		} else {
			addrVec = this.getAddresses(AjxEmailAddress.FROM, aliases, false, true);
			if (addrVec.size() == 0) {
				addrVec = this.getAddresses(AjxEmailAddress.TO, aliases, false, true);
			}
		}
	}
	return addrVec;
};

ZmMailMsg.prototype._getAttendees =
function() {
	var attendees = this.invite.components[0].at;
	var emails = new AjxVector();
	for (var i = 0; i < (attendees ? attendees.length : 0); i++) {
		var at = attendees[i];
		emails.add(new AjxEmailAddress(at.a, null, null, at.d));
	}

	return emails;
};

/**
 * Gets the first address in the vector of addresses of the given type.
 * 
 * @param	{constant}		type		the type
 * @return	{String}	the address
 */
ZmMailMsg.prototype.getAddress =
function(type) {
	return this._addrs[type].get(0);
};

/**
 * Gets the fragment. If maxLen is given, will truncate fragment to maxLen and add ellipsis.
 * 
 * @param	{int}	maxLen		the maximum length
 * @return	{String}	the fragment
 */
ZmMailMsg.prototype.getFragment =
function(maxLen) {
	var frag = this.fragment;

	if (maxLen && frag && frag.length) {
		frag = frag.substring(0, maxLen);
		if (this.fragment.length > maxLen)
			frag += "...";
	}
	return frag;
};

/**
 * Checks if the message is read only.
 * 
 * @return	{Boolean}	<code>true</code> if read only
 */
ZmMailMsg.prototype.isReadOnly =
function() {
	if (this._isReadOnly == null) {
		var folder = appCtxt.getById(this.folderId);
		this._isReadOnly = (folder ? folder.isReadOnly() : false);
	}
	return this._isReadOnly;
};

/**
 * Gets the header string.
 * 
 * @param	{constant}	hdr			the header (see <code>ZmMailMsg.HDR_</code> constants)
 * @param	{boolean}	htmlMode	if true, format as HTML
 * @return	{String}	the value
 */
ZmMailMsg.prototype.getHeaderStr =
function(hdr, htmlMode) {

	var key, value;
	if (hdr == ZmMailMsg.HDR_DATE) {
		if (this.sentDate) {
			var formatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM);
			value = formatter.format(new Date(this.sentDate));
		}
	} else if (hdr == ZmMailMsg.HDR_SUBJECT) {
		value = this.subject;
	} else {
		var addrs = this.getAddresses(hdr);
		value = addrs.toString(", ", true);
	}

	var key = ZmMailMsg.HDR_KEY[hdr] + ": ";
	if (!value) { return; }
	if (htmlMode) {
		key = "<b>" + key + "</b>";
		value = AjxStringUtil.convertToHtml(value);
	}

	return key + value;
};

/**
 * Checks if this message has html parts.
 * 
 * @return	{Boolean}	<code>true</code> if this message has HTML
 */
ZmMailMsg.prototype.isHtmlMail =
function() {
    if (this.isInvite()) {
		return this.invite.isHtmlInvite();
    }
    else {
        return this.getBodyPart(ZmMimeTable.TEXT_HTML) != null;
    }
};

// Setters

/**
 * Sets the vector of addresses of the given type to the given vector of addresses
 *
 * @param {constant}		type	the address type
 * @param {AjxVector}		addrs	a vector of {@link AjxEmailAddress}	objects
 */
ZmMailMsg.prototype.setAddresses =
function(type, addrs) {
	this._onChange("address", type, addrs);
	this._addrs[type] = addrs;
};

/**
 * Sets the vector of addresses of the given type to the address given.
 *
 * @param {constant}	type	the address type
 * @param {AjxEmailAddress}	addr	an address
 */
ZmMailMsg.prototype.setAddress =
function(type, addr) {
	this._onChange("address", type, addr);
	this._addrs[type].removeAll();
	this._addrs[type] = new AjxVector();
	this._addrs[type].add(addr);
};

/**
 * Clears out all the address vectors.
 * 
 */
ZmMailMsg.prototype.clearAddresses =
function() {
	for (var i = 0; i < ZmMailMsg.ADDRS.length; i++) {
		var type = ZmMailMsg.ADDRS[i];
		this._addrs[type].removeAll();
	}
};

/**
 * Adds the given vector of addresses to the vector of addresses of the given type
 *
 * @param {constant}	type	the address type
 * @param {AjxVector}	addrs	a vector of {@link AjxEmailAddress} objects
 */
ZmMailMsg.prototype.addAddresses =
function(type, addrs) {
	var size = addrs.size();
	for (var i = 0; i < size; i++) {
		this._addrs[type].add(addrs.get(i));
	}
};

/**
 * Adds the given address to the vector of addresses of the given type
 *
 * @param {AjxEmailAddress}	addr	an address
 */
ZmMailMsg.prototype.addAddress =
function(addr, type) {
	type = type || addr.type || AjxEmailAddress.TO;
	this._addrs[type].add(addr);
};

/**
 * Sets the subject
 *
 * @param	{String}	subject		the subject
 */
ZmMailMsg.prototype.setSubject =
function(subject) {
	this._onChange("subject", subject);
	this.subject = subject;
};

/**
 * Sets the message's top part to the given MIME part
 *
 * @param {String}	part	a MIME part
 */
ZmMailMsg.prototype.setTopPart =
function(part) {
	this._onChange("topPart", part);
	this._topPart = part;
};

/**
 * Sets the body parts.
 *  
 * @param	{array}	parts		an array of ZmMimePart
 * 
 */
ZmMailMsg.prototype.setBodyParts =
function(parts) {
	this._onChange("bodyParts", parts);
	this._bodyParts = parts;
    this._loaded = this._bodyParts.length > 0 || this.attachments.length > 0;
};

/**
* Sets the ID of any attachments which have already been uploaded.
*
* @param {String}	id		an attachment ID
*/
ZmMailMsg.prototype.addAttachmentId =
function(id) {
	if (this.attId) {
		id = this.attId + "," + id;
	}
	this._onChange("attachmentId", id);
	this.attId = id;
};

/**
 * Adds an inline attachment.
 * 
 * @param	{String}	cid		the content id
 * @param	{String}	aid		the attachment id
 * @param	{String}	part		the part
 * @param	{Boolean}	ismsg		if true, aid is a message id
 */
ZmMailMsg.prototype.addInlineAttachmentId =
function (cid, aid, part, ismsg) {
	if (!this._inlineAtts) {
		this._inlineAtts = [];
	}
	this._onChange("inlineAttachments",aid);
	if (ismsg && aid && part) {
		this._inlineAtts.push({"cid":cid, "mid":aid, "part": part});
	} else if (aid) {
		this._inlineAtts.push({"cid":cid, "aid":aid});
	} else if (part) {
		this._inlineAtts.push({"cid":cid, "part":part});
	}
};

ZmMailMsg.prototype._resetAllInlineAttachments =
function(){
    this._inlineAtts = [];
    for (var i = 0; i < this.attachments.length; i++) {
       this.attachments[i].foundInMsgBody = false;
    }
}

/**
 * Adds an inline document attachment.
 * 
 * @param	{String}	cid		the content id
 * @param	{String}	docId		the document id
 * @param	{String}	docpath		the document path
 * @param	{String}	part		the part
 */
ZmMailMsg.prototype.addInlineDocAttachment =
function (cid, docId, docpath, part) {
	if (!this._inlineDocAtts) {
		this._inlineDocAtts = [];
	}
	this._onChange("inlineDocAttachments", docId, docpath, part);
	if (docId) {
		this._inlineDocAtts.push({"cid":cid,"docid":docId});
	} else if (docpath) {
		this._inlineDocAtts.push({"cid":cid,"docpath":docpath});
	}else if (part) {
		this._inlineDocAtts.push({"cid":cid,"part":part});
	}
};

ZmMailMsg.prototype.setInlineAttachments =
function(inlineAtts){
	if (inlineAtts) {
		this._inlineAtts = inlineAtts;
	}
};

/**
 * Gets the inline attachments.
 * 
 * @return	{Array}	an array of attachments
 */
ZmMailMsg.prototype.getInlineAttachments =
function() {
	return this._inlineAtts || [];
};


/**
 * Gets the inline document attachments.
 * 
 * @return	{Array}	an array of attachments
 */
ZmMailMsg.prototype.getInlineDocAttachments =
function() {
	return this._inlineDocAtts || [];
};

/**
 * Finds the attachment in this message for the given CID.
 * 
 * @param	{String}	cid		the content id
 * @return	{Object}	the attachment or <code>null</code> if not found
 */
ZmMailMsg.prototype.findInlineAtt =
function(cid) {
	if (!(this.attachments && this.attachments.length)) { return null; }

	for (var i = 0; i < this.attachments.length; i++) {
		if (this.attachments[i].contentId == cid) {
			return this.attachments[i];
		}
	}
	return null;
};

/**
 * Sets the IDs of messages to attach (as a forward)
 *
 * @param {Array}	ids	a list of mail message IDs
 */
ZmMailMsg.prototype.setMessageAttachmentId =
function(ids) {
	this._onChange("messageAttachmentId", ids);
	this._msgAttIds = ids;
};

/**
 * Sets the IDs of docs to attach 
 *
 * @param {Array}	ids	a list of document IDs
 */
ZmMailMsg.prototype.setDocumentAttachments =
function(docs) {
	this._onChange("documentAttachmentId", docs);
	this._docAtts = docs;
};

ZmMailMsg.prototype.addDocumentAttachment =
function(doc) {
	if(!this._docAtts) {
		this._docAtts = [];
	}
	this._docAtts.push(doc);
};

/**
* Sets the list of attachment (message part) IDs to be forwarded
*
* @param {Array}	ids		a list of attachment IDs
*/
ZmMailMsg.prototype.setForwardAttIds =
function(ids) {
	this._onChange("forwardAttIds", ids);
	this._forAttIds = ids;
};

/**
* Sets the list of attachments details(message id and message part) to be forwarded
*
* @param {Array}	objs		a list of attachments details {id, part}
*/
ZmMailMsg.prototype.setForwardAttObjs =
function(objs) {
	this._forAttObjs = objs;
};

/**
* Sets the ID of the contacts that are to be attached as vCards
*
* @param {Array}	ids		a list of contact IDs
*/
ZmMailMsg.prototype.setContactAttIds =
function(ids) {
	ids = AjxUtil.toArray(ids);
	this._onChange("contactAttIds", ids);
	this._contactAttIds = ids;
};

// Actions

/**
 * Fills in the message from the given message node. Whatever attributes and child nodes
 * are available will be used. The message node is not always fully populated, since it
 * may have been created as part of getting a conversation.
 *
 * @param	{Object}	node		a message node
 * @param	{Hash}		args		a hash of arguments
 * @param	{Boolean}	noCache		if true, do not cache this message
 * @return	{ZmMailMsg}				the message
 */
ZmMailMsg.createFromDom =
function(node, args, noCache) {
	var msg = new ZmMailMsg(node.id, args.list, noCache);
	msg._loadFromDom(node);
	return msg;
};

/**
 * Gets the full message object from the back end based on the current message ID, and
 * fills in the message.
 *
 * @param {Hash}			params					a hash of parameters:
 * @param {Boolean}			params.getHtml			if <code>true</code>, try to fetch html from the server
 * @param {Boolean}			params.markRead			if <code>true</code>, mark msg read
 * @param {Boolean}			params.forceLoad		if <code>true</code>, get msg from server
 * @param {AjxCallback}		params.callback			the async callback
 * @param {AjxCallback}		params.errorCallback	the async error callback
 * @param {Boolean}			params.noBusyOverlay	if <code>true</code>, do not put up busy overlay during request
 * @param {Boolean}			params.noTruncate		if <code>true</code>, do not set max limit on size of msg body
 * @param {ZmBatchCommand}	params.batchCmd			if set, request gets added to this batch command
 * @param {String}			params.accountName		the name of the account to send request on behalf of
 * @param {boolean}			params.needExp			if not <code>false</code>, have server check if addresses are DLs
 */
ZmMailMsg.prototype.load =
function(params) {
	if (this._loading && !params.forceLoad) {
		//the only way to not get partial results is to try in some timeout.
		//this method will be called again, eventually, the message will be finished loading, and the callback would be called safely.
		this._loadingWaitCount = (this._loadingWaitCount || 0) + 1;
		if (this._loadingWaitCount > 20) {
			//give up after 20 timeouts (about 10 seconds) - maybe request got lost. send another request below.
			this._loadingWaitCount = 0;
			this._loading = false;
		}
		else {
			setTimeout(this.load.bind(this, params), 500);
			return;
		}
	}
	// If we are already loaded, then don't bother loading
	if (!this._loaded || params.forceLoad) {
		this._loading = true;
		var respCallback = this._handleResponseLoad.bind(this, params, params.callback);
		params.getHtml = params.getHtml || this.isDraft || appCtxt.get(ZmSetting.VIEW_AS_HTML);
		params.sender = appCtxt.getAppController();
		params.msgId = this.id;
		params.partId = this.partId;
		params.callback = respCallback;
		var errorCallback = this._handleResponseLoadFail.bind(this, params, params.errorCallback);
		params.errorCallback = errorCallback;
		ZmMailMsg.fetchMsg(params);
	} else {
		if (params.callback) {
			params.callback.run(new ZmCsfeResult()); // return exceptionless result
		}
	}
};

ZmMailMsg.prototype._handleResponseLoad =
function(params, callback, result) {
	var response = result.getResponse().GetMsgResponse;

	this.clearAddresses();

	// clear all participants (since it'll get re-parsed w/ diff. ID's)
	if (this.participants) {
		this.participants.removeAll();
	}

	this._loadFromDom(response.m[0]);
	if (!this.isReadOnly() && params.markRead) {
        this.markRead();
	} else {
        // Setup the _evt.item field and list._evt.item in order to insure proper notifications.
        this._setupNotify();
    }
	this.findAttsFoundInMsgBody();

	this._loading = false;
	
	// return result so callers can check for exceptions if they want
	if (this._loadCallback) {
		// overriding callback (see ZmMsgController::show)
		this._loadCallback.run(result);
		this._loadCallback = null;
	} else if (callback) {
		callback.run(result);
	}
};

ZmMailMsg.prototype.markRead = function() {
	if (!this.isReadOnly()) {
		//For offline mode keep isUnread property as true so that additional MsgActionRequest gets fired.
		//MsgActionRequest also gets stored in outbox queue and it also sends notify header for reducing the folder unread count.
		this._markReadLocal(!appCtxt.isWebClientOffline());
	}
};

ZmMailMsg.prototype._handleResponseLoadFail =
function(params, callback, result) {
    this._loading = false;
	if (callback) {
		return callback.run(result);
	}
};

ZmMailMsg.prototype._handleIndexedDBResponse =
function(params, requestParams, result) {

    var obj = result[0],
        msgNode,
        data = {},
        methodName = requestParams.methodName;

    if (obj) {
        msgNode = obj[obj.methodName]["m"];
        if (msgNode) {
            msgNode.su = msgNode.su._content;
            msgNode.fr = msgNode.mp[0].content._content;
            msgNode.mp[0].content = msgNode.fr;
            if (msgNode.fr) {
                msgNode.mp[0].body = true;
            }
            data[methodName.replace("Request", "Response")] = { "m" : [msgNode] };
            var csfeResult = new ZmCsfeResult(data);
            this._handleResponseLoad(params, params.callback, csfeResult);
        }
    }
};

ZmMailMsg.prototype.isLoaded =
function() {
	return this._loaded;
};

/**
 * Returns the list of body parts.
 * 
 * @param	{string}	contentType		preferred MIME type of alternative parts (optional)
 */
ZmMailMsg.prototype.getBodyParts =
function(contentType) {

	if (contentType) {
		this._lastContentType = contentType;
	}

	// no multi/alt, so we have a plain list
	if (!this.hasContentType(ZmMimeTable.MULTI_ALT)) {
		return this._bodyParts;
	}
	
	// grab the preferred type out of multi/alt parts
	contentType = contentType || this._lastContentType;
	var parts = [];
	for (var i = 0; i < this._bodyParts.length; i++) {
		var part = this._bodyParts[i];
		if (part.isZmMimePart) {
			parts.push(part);
		}
		else if (part) {
			// part is a hash of alternative parts by content type
			var altPart = contentType && part[contentType];
			parts.push(altPart || AjxUtil.values(part)[0]);
		}
	}
		
	return parts;
};

/**
 * Returns true if this msg has loaded a part with the given content type.
 * 
 * @param	{string}		contentType		MIME type
 */
ZmMailMsg.prototype.hasContentType =
function(contentType) {
	return this._contentType[contentType];
};

/**
 * Returns true is the msg has more than one body part. The server marks parts that
 * it considers to be body parts.
 * 
 * @return {boolean}
 */
ZmMailMsg.prototype.hasMultipleBodyParts =
function() {
	var parts = this.getBodyParts();
	return (parts && parts.length > 1);
};

/**
 * Returns the first body part, of the given type if provided. May invoke a
 * server call if it needs to fetch an alternative part.
 * 
 * @param	{string}		contentType		MIME type
 * @param	{callback}		callback		callback
 * 
 * @return	{ZmMimePart}					MIME part
 */
ZmMailMsg.prototype.getBodyPart =
function(contentType, callback) {

	if (contentType) {
		this._lastContentType = contentType;
	}

	function getPart(ct) {
		var bodyParts = this.getBodyParts(ct);
		for (var i = 0; i < bodyParts.length; i++) {
			var part = bodyParts[i];
			// should be a ZmMimePart, but check just in case
			part = part.isZmMimePart ? part : part[ct];
			if (!ct || (part.contentType === ct)) {
				return part;
			}
		}
	}
	var bodyPart = getPart.call(this, contentType);
	
	if (this.isInvite()) {
		if (!bodyPart) {
			if (contentType === ZmMimeTable.TEXT_HTML) {
				//text/html not available so look for text/plain
				bodyPart = getPart.call(this,ZmMimeTable.TEXT_PLAIN);
			} else if (contentType === ZmMimeTable.TEXT_PLAIN) {
				//text/plain not available so look for text/html
				bodyPart = getPart.call(this,ZmMimeTable.TEXT_HTML);
			}
		}
		// bug: 46071, handle missing body part/content
		if (!bodyPart || (bodyPart && !bodyPart.getContent())) {
			bodyPart = this.getInviteDescriptionContent(contentType);
		}
	}

	if (callback) {
		if (bodyPart) {
			callback.run(bodyPart);
		}
		// see if we should try to fetch an alternative part
		else if (this.hasContentType(ZmMimeTable.MULTI_ALT) &&
				((contentType == ZmMimeTable.TEXT_PLAIN && this.hasContentType(ZmMimeTable.TEXT_PLAIN)) ||
				 (contentType == ZmMimeTable.TEXT_HTML && this.hasContentType(ZmMimeTable.TEXT_HTML)))) {

			ZmMailMsg.fetchMsg({
				sender:		appCtxt.getAppController(),
				msgId:		this.id,
				getHtml:	(contentType == ZmMimeTable.TEXT_HTML),
				callback:	this._handleResponseFetchAlternativePart.bind(this, contentType, callback)
			});
		}
		else {
			callback.run();
		}
	}

	return bodyPart;
};

/**
  * Fetches the requested alternative part and adds it to our MIME structure, and body parts.
  * 
  * @param {string}		contentType		MIME type of part to fetch
  * @param {callback}	callback
  */
ZmMailMsg.prototype.fetchAlternativePart =
function(contentType, callback) {
	
	var respCallback = this._handleResponseFetchAlternativePart.bind(this, contentType, callback);
	ZmMailMsg.fetchMsg({
		sender:		appCtxt.getAppController(),
		msgId:		this.id,
		getHtml:	(contentType == ZmMimeTable.TEXT_HTML),
		callback:	respCallback
	});
};

ZmMailMsg.prototype._handleResponseFetchAlternativePart =
function(contentType, callback, result) {

	// look for first multi/alt with child of type we want, add it; assumes at most one multi/alt per msg
	var response = result.getResponse().GetMsgResponse;
	var altPart = this._topPart && this._topPart.addAlternativePart(response.m[0].mp[0], contentType, 0);
	if (altPart) {
		var found = false;
		for (var i = 0; i < this._bodyParts.length; i++) {
			var bp = this._bodyParts[i];
			// a hash rather than a ZmMimePart indicates multi/alt
			if (!bp.isZmMimePart) {
				bp[altPart.contentType] = altPart;
			}
		}
	}
		
	if (callback) {
		callback.run();
	}
};

/**
 * Gets the content of the first body part of the given content type (if provided).
 * If HTML is requested, may return content set via setHtmlContent().
 * 
 * @param	{string}	contentType		MIME type
 * @param	{boolean}	useOriginal		if true, do not grab the copy w/ the images defanged (HTML only)
 * 
 * @return	{string}					the content
 */
ZmMailMsg.prototype.getBodyContent =
function(contentType, useOriginal) {

	if (contentType) {
		this._lastContentType = contentType;
	}

	if (contentType == ZmMimeTable.TEXT_HTML && !useOriginal && this._htmlBody) {
		return this._htmlBody;
	}

	var bodyPart = this._loaded && this.getBodyPart(contentType);
	return bodyPart ? bodyPart.getContent() : "";
};

/**
 * Extracts and returns the text content out of a text/calendar part.
 * 
 * @param	{ZmMimePart}	bodyPart	a text/calendar MIME part
 * @return	{string}					text content
 */
ZmMailMsg.getTextFromCalendarPart =
function(bodyPart) {

	// NOTE: IE doesn't match multi-line regex, even when explicitly
	// specifying the "m" attribute.
	var bpContent = bodyPart ? bodyPart.getContent() : "";
	var lines = bpContent.split(/\r\n/);
	var desc = [];
	var content = "";
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.match(/^DESCRIPTION:/)) {
			desc.push(line.substr(12));
			for (var j = i + 1; j < lines.length; j++) {
				line = lines[j];
				if (line.match(/^\s+/)) {
					desc.push(line.replace(/^\s+/, " "));
					continue;
				}
				break;
			}
			break;
		}
        else if (line.match(/^COMMENT:/)) {
            //DESCRIPTION is sent as COMMENT in Lotus notes.
            desc.push(line.substr(8));
            for (var j = i + 1; j < lines.length; j++) {
                line = lines[j];
                if (line.match(/^\s+/)) {
                    desc.push(line.replace(/^\s+/, " "));
                    continue;
                }
                break;
            }
            break;
        }
	}
	if (desc.length > 0) {
		content = desc.join("");
		content = content.replace(/\\t/g, "\t");
		content = content.replace(/\\n/g, "\n");
		content = content.replace(/\\(.)/g, "$1");
	}
	return content;
};

/**
 * Returns a text/plain or text-like (not HTML or calendar) body part
 * 
 * @return {ZmMimePart}		MIME part
 */
ZmMailMsg.prototype.getTextBodyPart =
function() {
	var bodyPart = this.getBodyPart(ZmMimeTable.TEXT_PLAIN) || this.getBodyPart();
	return (bodyPart && bodyPart.isBody && ZmMimeTable.isTextType(bodyPart.contentType)) ? bodyPart : null;
};

/**
 * Returns true if this message has an inline image
 * 
 * @return {boolean}
 */
ZmMailMsg.prototype.hasInlineImage =
function() {
	for (var i = 0; i < this._bodyParts.length; i++) {
		var bp = this._bodyParts[i];
		if (bp.isZmMimePart && bp.contentDisposition == "inline" && bp.fileName && ZmMimeTable.isRenderableImage(bp.contentType)) {
			return true;
		}
	}
	return false;
};

/**
 * Sets the html content, overriding that of any HTML body part.
 * 
 * @param	{string}	content		the HTML content
 */
ZmMailMsg.prototype.setHtmlContent =
function(content) {
	this._onChange("htmlContent", content);
	this._htmlBody = content;
};

/**
 * Sets the invite description.
 * 
 * @param {String}	contentType	the content type ("text/plain" or "text/html")
 * @param	{String}	content		the content
 */
ZmMailMsg.prototype.setInviteDescriptionContent =
function(contentType, content) {
	this._inviteDescBody[contentType] = content;
};

/**
 * Gets the invite description content value.
 *
 * @param {String}	contentType	the content type ("text/plain" or "text/html")
 * @return	{String}	the content value
 */
ZmMailMsg.prototype.getInviteDescriptionContentValue =
function(contentType) {
    return this._inviteDescBody[contentType];
}
/**
 * Gets the invite description content.
 * 
 * @param {String}	contentType	the content type ("text/plain" or "text/html")
 * @return	{String}	the content
 */
ZmMailMsg.prototype.getInviteDescriptionContent =
function(contentType) {

	if (!contentType) {
		contentType = ZmMimeTable.TEXT_HTML;
	}

	var desc = this._inviteDescBody[contentType];

	if (!desc) {
		var htmlContent =  this._inviteDescBody[ZmMimeTable.TEXT_HTML];
		var textContent =  this._inviteDescBody[ZmMimeTable.TEXT_PLAIN];

		if (!htmlContent && textContent) {
			htmlContent = AjxStringUtil.convertToHtml(textContent);
		}

		if (!textContent && htmlContent) {
			textContent = AjxStringUtil.convertHtml2Text(htmlContent);
		}

		desc = (contentType == ZmMimeTable.TEXT_HTML) ? htmlContent : textContent;
	}

	var idx = desc ? desc.indexOf(ZmItem.NOTES_SEPARATOR) : -1;

	if (idx == -1 && this.isInvite()) {
		var inviteSummary = this.invite.getSummary((contentType == ZmMimeTable.TEXT_HTML));
		desc = desc ? (inviteSummary + desc) : null;
	}

	if (desc != null) {
		var part = new ZmMimePart();
		part.contentType = part.ct = contentType;
		part.size = part.s = desc.length;
		part.node = {content: desc};
		return part;
	}
};

ZmMailMsg.prototype.sendInviteReply =
function(edited, componentId, callback, errorCallback, instanceDate, accountName, ignoreNotify) {
	this._origMsg = this._origMsg || this;
	if (componentId == 0){ // editing reply, custom message
		this._origMsg._customMsg = true;
	}
	this._sendInviteReply(edited, componentId || 0, callback, errorCallback, instanceDate, accountName, ignoreNotify);
};

ZmMailMsg.prototype._sendInviteReply =
function(edited, componentId, callback, errorCallback, instanceDate, accountName, ignoreNotify) {
	var jsonObj = {SendInviteReplyRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.SendInviteReplyRequest;

	request.id = this._origMsg.id;
	request.compNum = componentId;

	var verb = "ACCEPT";
	var needsRsvp = true;
	var newPtst;

	var toastMessage; //message to display after action is done.
	
	switch (this.inviteMode) {
		case ZmOperation.REPLY_ACCEPT_IGNORE:				//falls-through on purpose
			needsRsvp = false;
		case ZmOperation.REPLY_ACCEPT_NOTIFY:               //falls-through on purpose
		case ZmOperation.REPLY_ACCEPT:
			verb = "ACCEPT";
			newPtst = ZmCalBaseItem.PSTATUS_ACCEPT;
			toastMessage = ZmMsg.inviteAccepted;
			break;
		case ZmOperation.REPLY_DECLINE_IGNORE:				//falls-through on purpose
			needsRsvp = false;
		case ZmOperation.REPLY_DECLINE_NOTIFY:              //falls-through on purpose
		case ZmOperation.REPLY_DECLINE:
			verb = "DECLINE";
			newPtst = ZmCalBaseItem.PSTATUS_DECLINED;
			toastMessage = ZmMsg.inviteDeclined;
			break;
		case ZmOperation.REPLY_TENTATIVE_IGNORE:            //falls-through on purpose
			needsRsvp = false;
		case ZmOperation.REPLY_TENTATIVE_NOTIFY:            //falls-through on purpose
		case ZmOperation.REPLY_TENTATIVE:
			verb = "TENTATIVE";
			newPtst = ZmCalBaseItem.PSTATUS_TENTATIVE;
			toastMessage = ZmMsg.inviteAcceptedTentatively;
			break;
	}
	request.verb = verb;

	var inv = this._origMsg.invite;
	//update the ptst to new one (we currently don't use the rest of the info in "replies" so it's ok to remove it for now)
	//note - this updated value is used later in _handleResponseSendInviteReply, and also in the list view when
	// re-displaying the message (not reloaded from server)
	if (newPtst) {
		inv.replies = [{
			reply: [{
				ptst: newPtst
			}]
		}];
		if (appCtxt.isWebClientOffline()) {
			// Update the offline entry and appt too.  Depending upon whether this is invoked from mail or appointments,
			// msgId will either be a single id, or the composite msg-appt id
			var msgId = inv.getMessageId();
			var invId = msgId;
			if (msgId.indexOf("-") >= 0) {
				// Composite id
				msgId = msgId.split("-")[1];
			} else {
				invId = [inv.getAppointmentId(), msgId].join("-");
			}
			var inviteUpdateCallback = this.applyPtstOffline.bind(this, msgId, newPtst);
			appCtxt.updateOfflineAppt(invId, "ptst", newPtst, null, inviteUpdateCallback);
		}
	}
	if (this.getAddress(AjxEmailAddress.TO) == null && !inv.isOrganizer()) {
		var to = inv.getOrganizerEmail() || inv.getSentBy();
		if (to == null) {
			var ac = window.parentAppCtxt || window.appCtxt;
			var mainAcct = ac.accountList.mainAccount.getEmail();
			var from = this._origMsg.getAddresses(AjxEmailAddress.FROM).get(0);
			//bug: 33639 when organizer component is missing from invitation
			if (from && from.address != mainAcct) {
				to = from.address;
			}
		}
		if (to) {
			this.setAddress(AjxEmailAddress.TO, (new AjxEmailAddress(to)));
		}
	}

    if(!this.identity) {
		var ac = window.parentAppCtxt || window.appCtxt;
		var account = (ac.multiAccounts && ac.getActiveAccount().isMain)
			? ac.accountList.defaultAccount : null;
		var identityCollection = ac.getIdentityCollection(account);
		this.identity = identityCollection ? identityCollection.selectIdentity(this._origMsg) : null;
	}

	if (this.identity) {
		request.idnt = this.identity.id;
	}

	if (ignoreNotify) { //bug 53974
		needsRsvp = false;
	}
	this._sendInviteReplyContinue(jsonObj, needsRsvp ? "TRUE" : "FALSE", edited, callback, errorCallback, instanceDate, accountName, toastMessage);
};

ZmMailMsg.prototype.applyPtstOffline = function(msgId, newPtst) {
	var applyPtstOfflineCallback = this._applyPtstOffline.bind(this, newPtst);
	ZmOfflineDB.getItem(msgId, ZmApp.MAIL, applyPtstOfflineCallback);
};
ZmMailMsg.prototype._applyPtstOffline = function(newPtst, result) {
	if (result && result[0] && result[0].inv && result[0].inv[0]) {
		var inv = result[0].inv[0];
		if (!inv.replies) {
			// See _sendInviteReply - patch the invite status
			inv.replies = [{
				reply: [{
					ptst: newPtst
				}]
			}];
		} else {
			inv.replies[0].reply[0].ptst = newPtst;
		}
		// Finally, Alter the offline folder - upon accepting an invite, it moves to the Trash folder
		result[0].l = ZmFolder.ID_TRASH;
		ZmOfflineDB.setItem(result, ZmApp.MAIL);

		// With the Ptst of an invite altered offline, move the message to trash locally
		var originalMsg = this._origMsg;
		originalMsg.moveLocal(ZmFolder.ID_TRASH);
		if (originalMsg.list) {
			originalMsg.list.moveLocal([originalMsg], ZmFolder.ID_TRASH);
		}
		var details = {oldFolderId:originalMsg.folderId};
		originalMsg._notify(ZmEvent.E_MOVE, details);

	}
}

ZmMailMsg.prototype._sendInviteReplyContinue =
function(jsonObj, updateOrganizer, edited, callback, errorCallback, instanceDate, accountName, toastMessage) {

	var request = jsonObj.SendInviteReplyRequest;
	request.updateOrganizer = updateOrganizer;

	if (instanceDate) {
		var serverDateTime = AjxDateUtil.getServerDateTime(instanceDate);
		var timeZone = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
		var clientId = AjxTimezone.getClientId(timeZone);
		ZmTimezone.set(request, clientId, null, true);
		request.exceptId = {d:serverDateTime, tz:timeZone};
	}

	if (edited) {
		this._createMessageNode(request, null, accountName);
	}

	var respCallback = new AjxCallback(this, this._handleResponseSendInviteReply, [callback, toastMessage]);
    this._sendMessage({ jsonObj:jsonObj,
								isInvite:true,
								isDraft:false,
								callback:respCallback,
								errorCallback:errorCallback,
								accountName:accountName
                       });
};

ZmMailMsg.prototype._handleResponseSendInviteReply =
function(callback, toastMessage, result) {
	var resp = result.getResponse();

	var id = resp.id ? resp.id.split("-")[0] : null;
	var statusOK = (id || resp.status == "OK");

	if (statusOK) {
		this._notifySendListeners();
		this._origMsg.folderId = ZmFolder.ID_TRASH;
	}

	// allow or disallow move logic:
	var allowMove;
	if ((this.acceptFolderId != appCtxt.get(ZmSetting.CAL_DEFAULT_ID)) ||
		(appCtxt.multiAccounts &&
			!this.getAccount().isMain &&
			this.acceptFolderId == appCtxt.get(ZmSetting.CAL_DEFAULT_ID)))
	{
		allowMove = true;
	}

	if (this.acceptFolderId && allowMove && resp.apptId != null) {
		this.moveApptItem(resp.apptId, this.acceptFolderId);
	}

    if (window.parentController) {
		window.close();
	}

	if (toastMessage) {
		//note - currently this is not called from child window, but just in case it will in the future.
		var ctxt = window.parentAppCtxt || window.appCtxt; //show on parent window if this is a child window, since we close this child window on accept/decline/etc
		ctxt.setStatusMsg(toastMessage);
	}

	if (callback) {
		callback.run(result, this._origMsg.getPtst()); // the ptst was updated in _sendInviteReply
	}
};

/**
 * returns this user's reply to this invite.
 */
ZmMailMsg.prototype.getPtst =
function() {
	return this.invite && this.invite.replies && this.invite.replies[0].reply[0].ptst;
};

ZmMailMsg.APPT_TRASH_FOLDER = 3;

ZmMailMsg.prototype.isInviteCanceled =
function() {
	var invite = this.invite;
	if (!invite) {
		return false;
	}
	return invite.components[0].ciFolder == ZmMailMsg.APPT_TRASH_FOLDER;
};

ZmMailMsg.prototype.moveApptItem =
function(itemId, nfolder) {
	var callback = new AjxCallback(this, this._handleMoveApptResponse, [nfolder]);
	var errorCallback = new AjxCallback(this, this._handleMoveApptError, [nfolder]);
	var ac = window.parentAppCtxt || window.appCtxt;
	var accountName = ac.multiAccounts && ac.accountList.mainAccount.name;
	ZmItem.move(itemId, nfolder, callback, errorCallback, accountName);
};

ZmMailMsg.prototype._handleMoveApptResponse =
function(nfolder, resp) {
	this._lastApptFolder = nfolder;
	// TODO: Display some sort of confirmation?
};

ZmMailMsg.prototype._handleMoveApptError =
function(nfolder, resp) {
	var params = {
		msg:	ZmMsg.errorMoveAppt,
		level:	ZmStatusView.LEVEL_CRITICAL
	};
	appCtxt.setStatusMsg(params);
	return true;
};

/**
 * Sends the message.
 *
 * @param {Boolean}	isDraft				if <code>true</code>, this a draft
 * @param {AjxCallback}	callback			the callback to trigger after send
 * @param {AjxCallback}	errorCallback	the error callback to trigger
 * @param {String}	accountName			the account to send on behalf of
 * @param {Boolean}	noSave				if set, a copy will *not* be saved to sent regardless of account/identity settings
 * @param {Boolean}	requestReadReceipt	if set, a read receipt is sent to *all* recipients
 * @param {ZmBatchCommand} batchCmd		if set, request gets added to this batch command
 * @param {Date} sendTime				if set, tell server that this message should be sent at the specified time
 * @param {Boolean} isAutoSave          if <code>true</code>, this an auto-save draft
 */
ZmMailMsg.prototype.send =
function(isDraft, callback, errorCallback, accountName, noSave, requestReadReceipt, batchCmd, sendTime, isAutoSave) {

	var aName = accountName;
	if (!aName) {
		// only set the account name if this *isnt* the main/parent account
		var acct = appCtxt.getActiveAccount();
		if (acct && !acct.isMain) {
			aName = acct.name;
		}
	}
	// if we have an invite reply, we have to send a different message
	if (this.isInviteReply && !isDraft) {
		// TODO: support for batchCmd here as well
		return this.sendInviteReply(true, 0, callback, errorCallback, this._instanceDate, aName, false);
	} else {
		var jsonObj, request;
		if (isDraft) {
			jsonObj = {SaveDraftRequest:{_jsns:"urn:zimbraMail"}};
			request = jsonObj.SaveDraftRequest;
		} else {
			jsonObj = {SendMsgRequest:{_jsns:"urn:zimbraMail"}};
			request = jsonObj.SendMsgRequest;
			if (this.sendUID) {
				request.suid = this.sendUID;
			}
		}
		if (noSave) {
			request.noSave = 1;
		}
		this._createMessageNode(request, isDraft, aName, requestReadReceipt, sendTime);
		appCtxt.notifyZimlets("addExtraMsgParts", [request, isDraft]);

		var senderEmail = aName;
		// When primary account is selected in From field.
		if (!isDraft && this.identity && this.identity.sendFromAddress) {
			var delegatedRights = appCtxt.sendAsEmails.concat(appCtxt.sendOboEmails);
			var isDelegated = false;
			for (var i = 0; i < delegatedRights.length; i++) {
				if (delegatedRights[i].isDL) {
					continue;
				}
				if (delegatedRights[i].addr === this.identity.sendFromAddress) {
					isDelegated = true;
					break;
				}
			}

			if (isDelegated) {
				senderEmail = this.identity.sendFromAddress;
			}
		}

		var params = {
			jsonObj: jsonObj,
			isInvite: false,
			isDraft: isDraft,
			isAutoSave: isAutoSave,
			accountName: senderEmail,
			callback: (new AjxCallback(this, this._handleResponseSend, [isDraft, callback])),
			errorCallback: errorCallback,
			batchCmd: batchCmd,
            skipOfflineCheck: true
		};
        this._sendMessage(params);
    }
};

ZmMailMsg.prototype._handleResponseSend =
function(isDraft, callback, result) {
	var resp = result.getResponse().m[0];

	// notify listeners of successful send message
	if (!isDraft) {
		if (resp.id || !appCtxt.get(ZmSetting.SAVE_TO_SENT)) {
			this._notifySendListeners();
		}
	} else {
		this._loadFromDom(resp);
		if (resp.autoSendTime) {
			this._notifySendListeners();
		}
	}

	if (callback) {
		callback.run(result);
	}
};

ZmMailMsg.prototype._createMessageNode =
function(request, isDraft, accountName, requestReadReceipt, sendTime) {

	var msgNode = request.m = {};
	var ac = window.parentAppCtxt || window.appCtxt;
	var activeAccount = ac.accountList.activeAccount;
	var mainAccount = ac.accountList.mainAccount;

	//When fwding an email in Parent's(main) account(main == active), but we are sending on-behalf-of child(active != accountName)
	var doQualifyIds = !ac.isOffline && accountName && mainAccount.name !== accountName;

	// if origId is given, means we're saving a draft or sending a msg that was
	// originally a reply/forward
	if (this.origId) {
         // always Qualify ID when forwarding mail using a child account
        if (appCtxt.isOffline) {
            var origAccount = this._origMsg && this._origMsg.getAccount();
            doQualifyIds = ac.multiAccounts  && origAccount.id == mainAccount.id;
        }
		var id = this.origId;
		if(doQualifyIds) {
			id = ZmOrganizer.getSystemId(this.origId, mainAccount, true);
		}
		msgNode.origid = id;
	}
	// if id is given, means we are re-saving a draft
	var oboDraftMsgId = null; // On Behalf of Draft MsgId
	if ((isDraft || this.isDraft) && this.id) {
		// bug fix #26508 - check whether previously saved draft was moved to Trash
		var msg = ac.getById(this.id);
		var folder = msg ? ac.getById(msg.folderId) : null;
		if (!folder || (folder && !folder.isInTrash())) {
			if (!ac.isOffline && !isDraft && this._origMsg && this._origMsg.isDraft) {
				var defaultAcct = ac.accountList.defaultAccount || ac.accountList.mainAccount;
				var from = this._origMsg.getAddresses(AjxEmailAddress.FROM).get(0);
				// this means we're sending a draft msg obo
				if (from && from.address != defaultAcct.getEmail()) {
					oboDraftMsgId = (this.id.indexOf(":") == -1)
						? ([defaultAcct.id, ":", this.id].join("")) : this.id;
					msgNode.id = oboDraftMsgId;
				} else {
					msgNode.id = this.nId;
				}
			} else {
				msgNode.id = this.nId;
			}

			if (!isDraft) { // not saveDraftRequest 
				var did = this.nId || this.id; // set draft id
				var isDelegated = false;

				if (!doQualifyIds && this.identity && this.identity.sendFromAddress)
				{
					var delegatedRights = appCtxt.sendAsEmails.concat(appCtxt.sendOboEmails);

					for (var i = 0; i < delegatedRights.length; i++) {
						if (delegatedRights[i].isDL) {
							continue;
						}
						if (delegatedRights[i].addr === this.identity.sendFromAddress) {
							isDelegated = true;
							break;
						}
					}
				}

				// When delegated account is selected in From field
				// then set did as <account identity>:<draft id> such that server delete the message's draft on message sent.
				if (doQualifyIds || isDelegated) {
					did = ZmOrganizer.getSystemId(did, mainAccount, true);
				}
				msgNode.did = did;
			}
		}
	}

	if (this.isForwarded) {
		msgNode.rt = "w";
	} else if (this.isReplied) {
		msgNode.rt = "r";
	}
	if (this.identity) {
		msgNode.idnt = this.identity.id;
	}

	if (this.isHighPriority) {
		msgNode.f = ZmItem.FLAG_HIGH_PRIORITY;
	} else if (this.isLowPriority) {
		msgNode.f = ZmItem.FLAG_LOW_PRIORITY;
	}

	if (this.isPriority) {
	    msgNode.f = ZmItem.FLAG_PRIORITY;			
	}

    if (this.isOfflineCreated) {
        msgNode.f = msgNode.f || "";
        if (msgNode.f.indexOf(ZmItem.FLAG_OFFLINE_CREATED) === -1) {
            msgNode.f = msgNode.f + ZmItem.FLAG_OFFLINE_CREATED;
        }
    }
	
	var addrNodes = msgNode.e = [];
	for (var i = 0; i < ZmMailMsg.COMPOSE_ADDRS.length; i++) {
		var type = ZmMailMsg.COMPOSE_ADDRS[i];
		this._addAddressNodes(addrNodes, type, isDraft);
	}
	this._addFrom(addrNodes, msgNode, isDraft, accountName);
	this._addReplyTo(addrNodes);
	if (requestReadReceipt) {
		this._addReadReceipt(addrNodes, accountName);
	}
	if (addrNodes.length) {
		msgNode.e = addrNodes;
	}
	
	//Let Zimlets set custom mime headers. They need to push header-name and header-value like below:
	//customMimeHeaders.push({name:"header1", _content:"headerValue"})
	var customMimeHeaders = [];
	appCtxt.notifyZimlets("addCustomMimeHeaders", [customMimeHeaders]);
	if((customMimeHeaders instanceof Array) && customMimeHeaders.length > 0) {
		 msgNode.header = customMimeHeaders;
	}
	msgNode.su = {_content:this.subject};

	var topNode = {ct:this._topPart.getContentType()};
	msgNode.mp = [topNode];

	// if the top part has sub parts, add them as children
	var numSubParts = this._topPart.children ? this._topPart.children.size() : 0;
	if (numSubParts > 0) {
		var partNodes = topNode.mp = [];
		for (var i = 0; i < numSubParts; i++) {
			var part = this._topPart.children.get(i);
			var content = part.getContent();
			var numSubSubParts = part.children ? part.children.size() : 0;
			if (content == null && numSubSubParts == 0) { continue; }

			var partNode = {ct:part.getContentType()};

			if (numSubSubParts > 0) {
				// If each part again has subparts, add them as children
				var subPartNodes = partNode.mp = [];
				for (var j = 0; j < numSubSubParts; j++) {
					var subPart = part.children.get(j);
					subPartNodes.push({ct:subPart.getContentType(), content:{_content:subPart.getContent()}});
				}
				// Handle Related SubPart , a specific condition
				if (part.getContentType() == ZmMimeTable.MULTI_RELATED) {
					// Handle Inline Attachments
					var inlineAtts = this.getInlineAttachments() || [];
					if (inlineAtts.length) {
						for (j = 0; j < inlineAtts.length; j++) {
							var inlineAttNode = {ci:inlineAtts[j].cid};
							var attachNode = inlineAttNode.attach = {};
							if (inlineAtts[j].aid) {
								attachNode.aid = inlineAtts[j].aid;
							} else {
								var id = inlineAtts[j].mid
									|| (isDraft || this.isDraft)
									? (inlineAtts[j].mid || oboDraftMsgId || this.id || this.origId)
									: (this.origId || this.id);

								if (!id && this._origMsg) {
									id = this._origMsg.id;
								}
								if (id && doQualifyIds) {
									id = ZmOrganizer.getSystemId(id, mainAccount, true);
								}
								if(id) {
									attachNode.mp = [{mid:id, part:inlineAtts[j].part}];
								}
							}
							subPartNodes.push(inlineAttNode);
						}
					}
					// Handle Inline Attachments
					var inlineDocAtts = this.getInlineDocAttachments() || [];
					if (inlineDocAtts.length) {
						for (j = 0; j < inlineDocAtts.length; j++) {
							var inlineDocAttNode = {ci:inlineDocAtts[j].cid};
							var attachNode = inlineDocAttNode.attach = {};
							if (inlineDocAtts[j].docpath) {
								attachNode.doc = [{path: inlineDocAtts[j].docpath, optional:1 }];
							} else if (inlineDocAtts[j].docid) {
								attachNode.doc = [{id: inlineDocAtts[j].docid}];
							} 
							subPartNodes.push(inlineDocAttNode);
						}
					}
				}
			} else {
				partNode.content = {_content:content};
			}
			partNodes.push(partNode);
		}
	} else {
		topNode.content = {_content:this._topPart.getContent()};
	}

	if (this.irtMessageId) {
		msgNode.irt = {_content:this.irtMessageId};
	}

	if (this.attId ||
		(this._msgAttIds && this._msgAttIds.length) ||
		(this._docAtts && this._docAtts.length) ||
		(this._forAttIds && this._forAttIds.length) ||
		(this._contactAttIds && this._contactAttIds.length))
	{
		var attachNode = msgNode.attach = {};
		if (this.attId) {
			attachNode.aid = this.attId;
		}

		// attach mail msgs
		if (this._msgAttIds && this._msgAttIds.length) {
			var msgs = attachNode.m = [];
			for (var i = 0; i < this._msgAttIds.length; i++) {
				msgs.push({id:this._msgAttIds[i]});
			}
		}


		// attach docs
		if (this._docAtts) {
			var docs = attachNode.doc = [];
			for (var i = 0; i < this._docAtts.length; i++) {
                var d = this._docAtts[i];
                // qualify doc id
                var docId = (d.id.indexOf(":") == -1)
                        ? ([mainAccount.id, d.id].join(":")) : d.id;
                var props = {id: docId};
                if(d.ver) props.ver = d.ver;
				docs.push(props);
			}
		}

		// attach msg attachments
		if (this._forAttObjs && this._forAttObjs.length) {
			var parts = attachNode.mp = this._forAttObjs;
			if (doQualifyIds) {
				for (var i = 0; i < parts.length; i++) {
					var part = parts[i];
					part.mid = ZmOrganizer.getSystemId(part.mid, mainAccount, true);
				}
			}
		}

		if (this._contactAttIds && this._contactAttIds.length) {
			attachNode.cn = [];
			for (var i = 0; i < this._contactAttIds.length; i++) {
				attachNode.cn.push({id:this._contactAttIds[i]});
			}
		}
	}

	if (sendTime && sendTime.date) {
		var date = sendTime.date; // See ZmTimeDialog.prototype.getValue
		var timezone = sendTime.timezone || AjxTimezone.DEFAULT;
		var offset = AjxTimezone.getOffset(timezone, date);
		var utcEpochTime = date.getTime() - ((date.getTimezoneOffset() + offset) * 60 * 1000);
		// date.getTime() is the selected timestamp in local machine time (NOT UTC)
		// date.getTimezoneOffset() is negative minutes to UTC from local time (+ for West, - for East)
		// offset is minutes to UTC from selected time (- for West, + for East)
		msgNode.autoSendTime = utcEpochTime;
	}
};

/**
 * Sends this message to its recipients.
 *
 * @param params				[hash]			hash of params:
 *        jsonObj				[object]		JSON object
 *        isInvite				[boolean]		true if this message is an invite
 *        isDraft				[boolean]		true if this message is a draft
 *        callback				[AjxCallback]	async callback
 *        errorCallback			[AjxCallback]	async error callback
 *        batchCmd				[ZmBatchCommand]	if set, request gets added to this batch command
 *
 * @private
 */
ZmMailMsg.prototype._sendMessage =
function(params) {
	var respCallback = new AjxCallback(this, this._handleResponseSendMessage, [params]),
        offlineCallback = this._handleOfflineResponseSendMessage.bind(this, params);
    /* bug fix 63798 removing sync request and making it async
	// bug fix #4325 - its safer to make sync request when dealing w/ new window
	if (window.parentController) {
		var newParams = {
			jsonObj: params.jsonObj,
			accountName: params.accountName,
			errorCallback: params.errorCallback
		};
		var resp = appCtxt.getAppController().sendRequest(newParams);
		if (!resp) { return; } // bug fix #9154
		if (params.toastMessage) {
			parentAppCtxt.setStatusMsg(params.toastMessage); //show on parent window since this is a child window, since we close this child window on accept/decline/etc
		}

		if (resp.SendInviteReplyResponse) {
			return resp.SendInviteReplyResponse;
		} else if (resp.SaveDraftResponse) {
			resp = resp.SaveDraftResponse;
			this._loadFromDom(resp.m[0]);
			return resp;
		} else if (resp.SendMsgResponse) {
			return resp.SendMsgResponse;
		}
	} else if (params.batchCmd) {*/
    if  (params.batchCmd) {
		params.batchCmd.addNewRequestParams(params.jsonObj, respCallback, params.errorCallback);
	} else {
		appCtxt.getAppController().sendRequest({jsonObj:params.jsonObj,
												asyncMode:true,
												noBusyOverlay:params.isDraft && params.isAutoSave,
												callback:respCallback,
												errorCallback:params.errorCallback,
                                                offlineCallback:offlineCallback,
												accountName:params.accountName,
                                                timeout: ( ( params.isDraft && this.attId ) ? 0 : null )
                                                });
	}
};

ZmMailMsg.prototype._handleResponseSendMessage =
function(params, result) {
	var response = result.getResponse();
	if (params.isInvite) {
		result.set(response.SendInviteReplyResponse);
	} else if (params.isDraft) {
		result.set(response.SaveDraftResponse);
	} else {
		result.set(response.SendMsgResponse);
	}
	if (params.callback) {
		params.callback.run(result);
	}
};

ZmMailMsg.prototype._handleOfflineResponseSendMessage =
function(params) {

    var jsonObj = $.extend(true, {}, params.jsonObj),//Always clone the object
        methodName = Object.keys(jsonObj)[0],
        msgNode = jsonObj[methodName].m,
        msgNodeAttach = msgNode.attach,
        origMsg = this._origMsg,
        currentTime = new Date().getTime(),
        callback,
        aid = [];
	var folderId = this.getFolderId();

    jsonObj.methodName = methodName;
    msgNode.d = currentTime; //for displaying date and time in the outbox/Drafts folder

    if (msgNodeAttach && msgNodeAttach.aid) {
        var msgNodeAttachIds = msgNodeAttach.aid.split(",");
        for (var i = 0; i < msgNodeAttachIds.length; i++) {
            var msgNodeAttachId = msgNodeAttachIds[i];
            if (msgNodeAttachId) {
                aid.push(msgNodeAttachId);
                msgNodeAttach[msgNodeAttachId] = appCtxt.getById(msgNodeAttachId);
                appCtxt.cacheRemove(msgNodeAttachId);
            }
        }
    }

    if (origMsg && origMsg.hasAttach) {//Always append origMsg attachments for offline handling
        var origMsgAttachments = origMsg.attachments;
        if (msgNodeAttach) {
            delete msgNodeAttach.mp;//Have to rewrite the code for including original attachments
        } else {
            msgNodeAttach = msgNode.attach = {};
        }
        for (var j = 0; j < origMsgAttachments.length; j++) {
            var node = origMsgAttachments[j].node;
            if (node && node.isOfflineUploaded) {
                aid.push(node.aid);
                msgNodeAttach[node.aid] = node;
            }
        }
    }

	if (msgNodeAttach) {
		if (aid.length > 0) {
			msgNodeAttach.aid = aid.join();
		}
		//If msgNodeAttach is an empty object then delete it
		if (Object.keys(msgNodeAttach).length === 0) {
			delete msgNode.attach;
		}
	}

    // Checking for inline Attachment
    if (this.getInlineAttachments().length > 0 || (origMsg && origMsg.getInlineAttachments().length > 0)) {
        msgNode.isInlineAttachment = true;
    }

    callback = this._handleOfflineResponseSendMessageCallback.bind(this, params, jsonObj);

	//For outbox item, message id will be always undefined.
	if (folderId == ZmFolder.ID_OUTBOX) {
		msgNode.id = origMsg && origMsg.id;
	}
    if (msgNode.id) { //Existing drafts created online or offline
        jsonObj.id = msgNode.id;
        var value = {
            update : true,
            methodName : methodName,
            id : msgNode.id,
            value : jsonObj
        };
        ZmOfflineDB.setItemInRequestQueue(value, callback);
    }
    else {
        jsonObj.id = msgNode.id = currentTime.toString(); //Id should be string
        msgNode.f = (msgNode.f || "").replace(ZmItem.FLAG_OFFLINE_CREATED, "").concat(ZmItem.FLAG_OFFLINE_CREATED);
        ZmOfflineDB.setItemInRequestQueue(jsonObj, callback);
    }
};

ZmMailMsg.prototype._handleOfflineResponseSendMessageCallback =
function(params, jsonObj) {

	var m = ZmOffline.generateMsgResponse(jsonObj);
    var data = {},
        header = this._generateOfflineHeader(params, jsonObj, m),
        notify = header.context.notify[0],
        result;
	if (!params.isInvite) {
		// If existing invite message - do not overwrite it.  The online code does not reload
		// the invite msg, it just patches it in-memory.  When the cal item ptst is patched in the db, it will
		// make a call to patch the invite too.
		ZmOfflineDB.setItem(m, ZmApp.MAIL);
	}

    data[jsonObj.methodName.replace("Request", "Response")] = notify.modified;
    result = new ZmCsfeResult(data, false, header);
    this._handleResponseSendMessage(params, result);
    appCtxt.getRequestMgr()._notifyHandler(notify);

    if (!params.isDraft && !params.isInvite) {
        var key = {
            methodName : "SaveDraftRequest",
            id : jsonObj[jsonObj.methodName].m.id
        };
        ZmOfflineDB.deleteItemInRequestQueue(key);//Delete any drafts for this message id
    }
};

ZmMailMsg.prototype._generateOfflineHeader =
function(params, jsonObj, m) {

    var folderArray = [],
        header = {
            context : {
                notify : [{
                    created : {
                        m : m
                    },
                    modified : {
                        folder : folderArray,
                        m : m
                    }
                }]
            }
        };

	if (!params.isInvite) {
		var folderId = this.getFolderId();
		if (params.isDraft || params.isAutoSave) {
			//For new auto save or draft folderId will not be equal to ZmFolder.ID_DRAFTS
			if (folderId != ZmFolder.ID_DRAFTS) {
				folderArray.push({
					id : ZmFolder.ID_DRAFTS,
					n : appCtxt.getById(ZmFolder.ID_DRAFTS).numTotal + 1
				});
			}
		}
		else {
			if (folderId != ZmFolder.ID_OUTBOX) {
				folderArray.push({
					id : ZmFolder.ID_OUTBOX,
					n : appCtxt.getById(ZmFolder.ID_OUTBOX).numTotal + 1
				});
			}
			if (folderId == ZmFolder.ID_DRAFTS) {
				folderArray.push({
					id : ZmFolder.ID_DRAFTS,
					n : appCtxt.getById(ZmFolder.ID_DRAFTS).numTotal - 1
				});
			}
		}
	}
    return header;
};

ZmMailMsg.prototype._notifySendListeners =
function() {
	var flag, msg;
	if (this.isForwarded) {
		flag = ZmItem.FLAG_FORWARDED;
		msg = this._origMsg;
	} else if (this.isReplied) {
		flag = ZmItem.FLAG_REPLIED;
		msg = this._origMsg;
	}

	if (flag && msg) {
		msg[ZmItem.FLAG_PROP[flag]] = true;
		if (msg.list) {
			msg.list._notify(ZmEvent.E_FLAGS, {items: [msg.list], flags: [flag]});
		}
	}
};

/**
 * from a child window - since we clone the message, the cloned message needs to listen to changes on the original (parent window) message.
 * @param ev
 */
ZmMailMsg.prototype.detachedChangeListener =
function(ev) {
	var parentWindowMsg = ev.item;
	//for now I only need it for keeping up with the isUnread and isFlagged status of the detached message. Keep it simple.
	this.isUnread = parentWindowMsg.isUnread;
	this.isFlagged = parentWindowMsg.isFlagged;
};

/**
 * Checks if SMIME feature is enabled or not
 * @returns {boolean}
 */
ZmMailMsg.prototype.hasSMIMEFeature = function() {
	// check for S/MIME license attribute
	var license = appCtxt.getSettings().getInfoResponse.license;

	for (var i = 0; license && i < license.attr.length; i++) {
		var attr = license.attr[i];

		if (attr.name == "SMIME") {
			return attr._content == "TRUE";
		}
	}
	return false;
};

ZmMailMsg.prototype.isRealAttachment =
function(attachment) {
	var type = attachment.contentType;

	// the "isIgnored" check(after this) ignores the .p7s files
	// if SMIME is disabled, attach .p7s file, do not ignore
	if (!this.hasSMIMEFeature() && type === ZmMimeTable.APP_SIGNATURE) {
		return true;
	}
	// bug fix #6374 - ignore if attachment is body unless content type is message/rfc822
	if (ZmMimeTable.isIgnored(type)) {
		return false;
	}

	// bug fix #8751 - dont ignore text/calendar type if msg is not an invite
	if (type == ZmMimeTable.TEXT_CAL && appCtxt.get(ZmSetting.CALENDAR_ENABLED) && this.isInvite()) {
		return false;
	}

	return true;
};

// this is a helper method to get an attachment url for multipart/related content
ZmMailMsg.prototype.getContentPartAttachUrl =
function(contentPartType, contentPart) {
	if (contentPartType != ZmMailMsg.CONTENT_PART_ID &&
		 				contentPartType != ZmMailMsg.CONTENT_PART_LOCATION) {
		return null;
	}
	var url = this._getContentPartAttachUrlFromCollection(this.attachments, contentPartType, contentPart);
	if (url) {
		return url;
	}
	return this._getContentPartAttachUrlFromCollection(this._bodyParts, contentPartType, contentPart);
};

ZmMailMsg.prototype._getContentPartAttachUrlFromCollection =
function(collection, contentPartType, contentPart) {
	if (!collection) {
		return null;
	}
	for (var i = 0; i < collection.length; i++) {
		var attach = collection[i];
		if (attach[contentPartType] == contentPart) {
            return this.getUrlForPart(attach);
		}
	}
	return null;
};


ZmMailMsg.prototype.findAttsFoundInMsgBody =
function() {
	if (this.findAttsFoundInMsgBodyDone) { return; }

	var content = "", cid;
	var bodyParts = this.getBodyParts();
	for (var i = 0; i < bodyParts.length; i++) {
		var bodyPart = bodyParts[i];
		if (bodyPart.contentType == ZmMimeTable.TEXT_HTML) {
			content = bodyPart.getContent();
			var msgRef = this;
			content.replace(/src=([\x27\x22])cid:([^\x27\x22]+)\1/ig, function(s, q, cid) {
				cid=cid.replace(/&#64;/g, "@");
				var attach = msgRef.findInlineAtt("<" + AjxStringUtil.urlComponentDecode(cid)  + ">");
				if (attach) {
					attach.foundInMsgBody = true;
				}
			});
		}
	}
	this.findAttsFoundInMsgBodyDone = true;
};

ZmMailMsg.prototype.hasInlineImagesInMsgBody =
function() {
	var body = this.getBodyContent(ZmMimeTable.TEXT_HTML);
	return (body && body.search(/src=([\x27\x22])cid:([^\x27\x22]+)\1/ig) != -1);
};

/**
 * Returns the number of attachments in this msg.
 * 
 * @param {boolean}		includeInlineAtts
 */
ZmMailMsg.prototype.getAttachmentCount =
function(includeInlineAtts) {
	var attachments = includeInlineAtts ? [].concat(this.attachments, this._getInlineAttachments()) : this.attachments;
	return attachments ? attachments.length : 0;
};

ZmMailMsg.prototype._getInlineAttachments =
function() {
	var atts = [];
	var parts = this.getBodyParts();
	if (parts && parts.length > 1) {
		var part;
		for (var k = 0; k < parts.length; k++) {
			part = parts[k];
			if (part.fileName && part.contentDisposition == "inline") {
				atts.push(part);
			}
		}
	}
	return atts;
};

/**
 * Returns an array of objects containing meta info about attachments
 */
ZmMailMsg.prototype.getAttachmentInfo =
function(findHits, includeInlineImages, includeInlineAtts) {

	this._attInfo = [];

	var attachments = (includeInlineAtts || includeInlineImages) ? [].concat(this.attachments, this._getInlineAttachments()) : this.attachments;
	if (attachments && attachments.length > 0) {
		this.findAttsFoundInMsgBody();

		for (var i = 0; i < attachments.length; i++) {
			var attach = attachments[i];

			if (!this.isRealAttachment(attach) ||
					(attach.contentType.match(/^image/) && attach.contentId && attach.foundInMsgBody && !includeInlineImages) ||
					(attach.contentDisposition == "inline" && attach.fileName && ZmMimeTable.isRenderableText(attach.contentType, attach.isBody) && !includeInlineAtts) ||
					(attach.contentDisposition == "inline" && (attach.contentType === "application/pdf" || attach.contentType === "text/html") && attach.contentId && attach.foundInMsgBody)) {
				continue;
			}

			var props = {};
			props.links = {};	// flags that indicate whether to include a certain type of link
			// set a viable label for this attachment
			props.label = attach.name || attach.fileName || (ZmMsg.unknown + " <" + attach.contentType + ">");

			// use content location instead of built href flag
			var useCL = false;
			// set size info if any
			props.sizeInBytes = attach.s || 0;
			if (attach.size != null && attach.size >= 0) {
				var numFormatter = AjxNumberFormat.getInstance();  
				if (attach.size < 1024) {
					props.size = numFormatter.format(attach.size) + " " + ZmMsg.b;
				}
				else if (attach.size < (1024 * 1024)) {
					props.size = numFormatter.format(Math.round((attach.size / 1024) * 10) / 10) + " " + ZmMsg.kb;
				}
				else {
					props.size = numFormatter.format(Math.round((attach.size / (1024 * 1024)) * 10) / 10) + " " + ZmMsg.mb;
				}
			}

			if (attach.part) {
				useCL = attach.contentLocation && (attach.relativeCl || ZmMailMsg.URL_RE.test(attach.contentLocation));
			} else {
				useCL = attach.contentLocation && true;
			}

			// see if rfc822 is an invite
			if (attach.contentType == ZmMimeTable.MSG_RFC822) {
				props.rfc822Part = attach.part;
				var calPart = (attach.children.size() == 1) && attach.children.get(0);
				if (appCtxt.get(ZmSetting.CALENDAR_ENABLED) && calPart && (calPart.contentType == ZmMimeTable.TEXT_CAL)) {
					props.links.importICS = true;
					props.rfc822CalPart = calPart.part;
				}
			} else {
				// set the anchor html for the link to this attachment on the server
				var url = useCL ? attach.contentLocation : this.getUrlForPart(attach);

				// bug fix #6500 - append filename w/in so "Save As" wont append .html at the end
				if (!useCL) {
					var insertIdx = url.indexOf("?auth=co&");
					var fn = AjxStringUtil.urlComponentEncode(attach.fileName);
					fn = fn.replace(/\x27/g, "%27");
					url = url.substring(0,insertIdx) + fn + url.substring(insertIdx);
				}
				if (!useCL) {
					props.links.download = true;
				}

				var folder = appCtxt.getById(this.folderId);
				if ((attach.name || attach.fileName) && appCtxt.get(ZmSetting.BRIEFCASE_ENABLED)) {
					if (!useCL) {
						props.links.briefcase = true;
					}
				}

				var isICSAttachment = (attach.fileName && attach.fileName.match(/\./) && attach.fileName.replace(/^.*\./, "").toLowerCase() == "ics");

				if (appCtxt.get(ZmSetting.CALENDAR_ENABLED) && ((attach.contentType == ZmMimeTable.TEXT_CAL) || isICSAttachment)) {
					props.links.importICS = true;
				}

				if (!useCL) {
					// check for vcard *first* since we dont care to view it in HTML
					if (ZmMimeTable.isVcard(attach.contentType)) {
						props.links.vcard = true;
					}
					else if (ZmMimeTable.hasHtmlVersion(attach.contentType) && appCtxt.get(ZmSetting.VIEW_ATTACHMENT_AS_HTML)) {
						props.links.html = true;
					}
					else {
						// set the objectify flag
						var contentType = attach.contentType;
						props.objectify = contentType && contentType.match(/^image/) && !contentType.match(/tif/); //see bug 82807 - Tiffs are not really supported by browsers, so don't objectify.
					}
				} else {
					props.url = url;
				}

				if (attach.part) {
					// bug: 233 - remove attachment
					props.links.remove = true;
				}
			}

			// set the link icon
			var mimeInfo = ZmMimeTable.getInfo(attach.contentType);
			props.linkIcon = mimeInfo ? mimeInfo.image : "GenericDoc";
			props.ct = attach.contentType;

			// set other meta info
			props.isHit = findHits && this._isAttInHitList(attach);
			// S/MIME: recognize client-side generated attachments,
			// and stash the cache key for the applet in the part, as
			// it's the only data which we retain later on
			if (attach.part) {
				props.part = attach.part;
			} else {
				props.generated = true;
				props.part = attach.cachekey;
			}
			if (!useCL) {
                if (attach.node && attach.node.isOfflineUploaded) { //for offline upload attachments
                    props.url = attach.node.data;
                } else {
                    props.url = this.getUrlForPart(attach);
    			}
			}
			if (attach.contentId || (includeInlineImages && attach.contentDisposition == "inline")) {  // bug: 28741
				props.ci = true;
			}
            props.mid = this.id;
			props.foundInMsgBody = attach.foundInMsgBody;

			// and finally, add to attLink array
			this._attInfo.push(props);
		}
	}

	return this._attInfo;
};
ZmMailMsg.prototype.getAttachmentLinks = ZmMailMsg.prototype.getAttachmentInfo;

ZmMailMsg.prototype.removeAttachments =
function(partIds, callback) {
	var jsonObj = {RemoveAttachmentsRequest: {_jsns:"urn:zimbraMail"}};
	var request = jsonObj.RemoveAttachmentsRequest;
	request.m = {
		id:		this.id,
		part:	partIds.join(",")
	};

	var params = {
		jsonObj:		jsonObj,
		asyncMode:		true,
		callback:		callback,
		noBusyOverlay:	true
	};
	return appCtxt.getAppController().sendRequest(params);
};


// Private methods

/**
 * Processes a message node, getting attributes and child nodes to fill in the message.
 * This method may be called on an existing msg, since only metadata is returned when a
 * conv is expanded via SearchConvRequest. That is why we check values before setting
 * them, and why we don't clear out all the msg properties here first.
 */
ZmMailMsg.prototype._loadFromDom =
function(msgNode) {
	// this method could potentially be called twice (SearchConvResponse and
	// GetMsgResponse) so always check param before setting!
	if (msgNode.id)		{ this.id = msgNode.id; }
	if (msgNode.part)	{ this.partId = msgNode.part; }
	if (msgNode.cid) 	{ this.cid = msgNode.cid; }
	if (msgNode.s) 		{ this.size = msgNode.s; }
	if (msgNode.d) 		{ this.date = msgNode.d; }
	if (msgNode.sd) 	{ this.sentDate = msgNode.sd; }
	if (msgNode.l) 		{ this.folderId = msgNode.l; }
	if (msgNode.tn)		{ this._parseTagNames(msgNode.tn); }
	if (msgNode.cm) 	{ this.inHitList = msgNode.cm; }
	if (msgNode.su) 	{ this.subject = msgNode.su; }
	if (msgNode.fr) 	{ this.fragment = msgNode.fr; }
	if (msgNode.rt) 	{ this.rt = msgNode.rt; }
	if (msgNode.origid) { this.origId = msgNode.origid; }
	if (msgNode.hp) 	{ this._attHitList = msgNode.hp; }
	if (msgNode.mid)	{ this.messageId = msgNode.mid; }
	if (msgNode.irt)	{ this.irtMessageId = msgNode.irt; }
	if (msgNode._attrs) { this.attrs = msgNode._attrs; }
	if (msgNode.sf) 	{ this.sf = msgNode.sf; }
	if (msgNode.cif) 	{ this.cif = msgNode.cif; }
	if (msgNode.md) 	{ this.md = msgNode.md; }
	if (msgNode.ms) 	{ this.ms = msgNode.ms; }
	if (msgNode.rev) 	{ this.rev = msgNode.rev; }

    if (msgNode.idnt)	{
        var identityColl = appCtxt.getIdentityCollection();
        this.identity = identityColl && identityColl.getById(msgNode.idnt);
    }

    //Copying msg. header's
	if (msgNode.header) {
		this.headers = {};
		for (var i = 0; i < msgNode.header.length; i++) {
			this.headers[msgNode.header[i].n] = msgNode.header[i]._content;
		}
	}

	//Grab the metadata, keyed off the section name
	if (msgNode.meta) {
		this.meta = {};
		for (var i = 0; i < msgNode.meta.length; i++) {
			var section = msgNode.meta[i].section;
			this.meta[section] = {};
			this.meta[section]._attrs = {};
			for (a in msgNode.meta[i]._attrs) {
				this.meta[section]._attrs[a] = msgNode.meta[i]._attrs[a];
			}
		}
	}

	// set the "normalized" Id if this message belongs to a shared folder
	var idx = this.id.indexOf(":");
	this.nId = (idx != -1) ? (this.id.substr(idx + 1)) : this.id;

	if (msgNode._convCreateNode) {
		this._convCreateNode = msgNode._convCreateNode;
	}

	if (msgNode.cid && msgNode.l) {
		var conv = appCtxt.getById(msgNode.cid);
		if (conv) {
			// update conv's folder list
			if (conv.folders) {
				conv.folders[msgNode.l] = true;
			}
			var folders = AjxUtil.keys(conv.folders);
			AjxDebug.println(AjxDebug.NOTIFY, "update conv folder list: conv spans " + folders.length + " folder(s): " + folders.join(" "));
			// update msg list if none exists since we know this conv has at least one msg
			if (!conv.msgIds) {
				conv.msgIds = [this.id];
			}
            
            if(conv.isMute) {
                this.isMute = true;
            }
		}
	}

	// always call parseFlags even if server didn't return any
	this._parseFlags(msgNode.f);

	if (msgNode.mp) {
		// clear all attachments and body data
		this.attachments = [];
		this._bodyParts = [];
		this._contentType = {};
		this.findAttsFoundInMsgBodyDone = false;
		var ctxt = {
			attachments:	this.attachments,
			bodyParts:		this._bodyParts,
			contentTypes:	this._contentType
		};
		this._topPart = ZmMimePart.createFromDom(msgNode.mp[0], ctxt);
		this._loaded = this._bodyParts.length > 0 || this.attachments.length > 0;
		this._cleanupCIds();
	}

	if (msgNode.shr) {
		// TODO: Make server output better msgNode.shr property...
		var shareXmlDoc = AjxXmlDoc.createFromXml(msgNode.shr[0].content);
		try {
			AjxDispatcher.require("Share");
			this.share = ZmShare.createFromDom(shareXmlDoc.getDoc());
			this.share._msgId = msgNode.id;
		} catch (ex) {
			// not a version we support, ignore
		}
	}
	if (msgNode.dlSubs) {
		var dlSubsXmlDoc = AjxXmlDoc.createFromXml(msgNode.dlSubs[0].content);
		try {
			this.subscribeReq = ZmMailMsg.createDlSubFromDom(dlSubsXmlDoc.getDoc());
			this.subscribeReq._msgId = msgNode.id;
		}
		catch (ex) {
			// not a version we support, or missing element, ignore  - Not sure I like this approach but copying Share - Eran
			DBG.println(AjxDebug.DBG1, "createDlSubFromDom failed, content is:" + msgNode.dlSubs[0].content + " ex:" + ex);
		}
	}

	if (msgNode.e && this.participants && this.participants.size() == 0) {
		for (var i = 0; i < msgNode.e.length; i++) {
			this._parseParticipantNode(msgNode.e[i]);
		}
		this.clearAddresses();
		var parts = this.participants.getArray();
		for (var j = 0; j < parts.length; j++ ) {
			this.addAddress(parts[j]);
		}
	}

	if (msgNode.autoSendTime) {
		var timestamp = parseInt(msgNode.autoSendTime) || null;
		if (timestamp) {
			this.setAutoSendTime(new Date(timestamp));
		}
	}

	if (msgNode.inv) {
		try {
			this.invite = ZmInvite.createFromDom(msgNode.inv);
            if (this.invite.isEmpty()) return;
			this.invite.setMessageId(this.id);
			// bug fix #18613
			var desc = this.invite.getComponentDescription();
			var descHtml = this.invite.getComponentDescriptionHtml();
			if (descHtml) {
				this.setHtmlContent(descHtml);
				this.setInviteDescriptionContent(ZmMimeTable.TEXT_HTML, descHtml);
			}

			if (desc) {
				this.setInviteDescriptionContent(ZmMimeTable.TEXT_PLAIN, desc);
			}

			if (!appCtxt.get(ZmSetting.CALENDAR_ENABLED) && this.invite.type == "appt") {
				this.flagLocal(ZmItem.FLAG_ATTACH, true);
			}

		} catch (ex) {
			// do nothing - this means we're trying to load an ZmInvite in new
			// window, which we dont currently load (re: support).
		}
	}
	//S/MIME: Set mail's S/MIME related info
	if (msgNode.certificate) {
		this.certificate = msgNode.certificate;
	}
	if (msgNode.isSigned) {
		this.isSigned = msgNode.isSigned == "true";
	}
	if (msgNode.isEncrypted) {
		this.isEncrypted = msgNode.isEncrypted == "true";
	}
	if (msgNode.decryptionErrorCode) {
		this.decryptionErrorCode = msgNode.decryptionErrorCode;
	}
};

ZmMailMsg.createDlSubFromDom =
function(doc) {
	// NOTE: This code initializes DL subscription info from the Zimbra dlSub format, v0.1
	var sub = {};

	var node = doc.documentElement;
	sub.version = node.getAttribute("version");
	sub.subscribe = node.getAttribute("action") == "subscribe";
	if (sub.version != ZmMailMsg.DL_SUB_VERSION) {
		throw "Zimbra dl sub version must be " + ZmMailMsg.DL_SUB_VERSION;
	}

	for (var child = node.firstChild; child != null; child = child.nextSibling) {
		if (child.nodeName != "dl" && child.nodeName != "user") {
			continue;
		}
		sub[child.nodeName] = {
			id: child.getAttribute("id"),
			email: child.getAttribute("email"),
			name: child.getAttribute("name")
		};
	}
	if (!sub.dl) {
		throw "missing dl element";
	}
	if (!sub.user) {
		throw "missing user element";
	}

	return sub;
};

ZmMailMsg.prototype.hasNoViewableContent =
function() {
	if (this.isRfc822) {
		//this means this message is not the top level one - but rather an attached message.
		return false; //till I can find a working heuristic that is not the fragment - size does not work as it includes probably stuff like subject and email addresses, and it's always bigger than 0.
	}
	var hasInviteContent = this.invite && !this.invite.isEmpty();
	//the general case - use the fragment, so that cases where the text is all white space are taken care of as "no content".
	return !this.fragment && !hasInviteContent && !this.hasInlineImagesInMsgBody() && !this.hasInlineImage()
};

ZmMailMsg.prototype._cleanupCIds =
function(atts) {
	atts = atts || this.attachments;
	if (!atts || atts.length == 0) { return; }

	for (var i = 0; i < atts.length; i++) {
		var att = atts[i];
		if (att.contentId && !/^<.+>$/.test(att.contentId)) {
			att.contentId = '<' + att.contentId + '>';
		}
	}
};

ZmMailMsg.prototype.mute =
function () {
	this.isMute = true;
};

ZmMailMsg.prototype.unmute =
function () {
	this.isMute = false;
};

ZmMailMsg.prototype.isInvite =
function () {
	return (this.invite != null);
};

ZmMailMsg.prototype.forwardAsInvite =
function () {
	if(!this.invite) {
		return false;
	}
	return this.invite.getInviteMethod() == "REQUEST";
};

ZmMailMsg.prototype.needsRsvp =
function () {
	if (!this.isInvite() || this.invite.isOrganizer()) { return false; }

	var needsRsvp = false;
	var accEmail = appCtxt.getActiveAccount().getEmail();
	if (this.isInvite()) {
		var at = this.invite.getAttendees();
		for (var i in at) {
			if (at[i].url == accEmail) {
				return at[i].rsvp;
			}
			if (at[i].rsvp) {
				needsRsvp = true;
			}
		}
		at = this.invite.getResources();
		for (var i in at) {
			if (at[i].url == accEmail) {
				return at[i].rsvp;
			}
			if (at[i].rsvp) {
				needsRsvp = true;
			}
		}
	}

	return needsRsvp;
};

// Adds child address nodes for the given address type.
ZmMailMsg.prototype._addAddressNodes =
function(addrNodes, type, isDraft) {

	var addrs = this._addrs[type];
	var num = addrs.size();
	var contactsApp;
	if (num) {
		if (appCtxt.isOffline) {
            contactsApp = appCtxt.getApp(ZmApp.CONTACTS)
        } else {
		    contactsApp = appCtxt.get(ZmSetting.CONTACTS_ENABLED) && appCtxt.getApp(ZmApp.CONTACTS);
        }
        if (contactsApp && !contactsApp.isContactListLoaded()) {
            contactsApp = null;
        }
		for (var i = 0; i < num; i++) {
			var addr = addrs.get(i);
			addr = addr.isAjxEmailAddress ? addr : AjxEmailAddress.parse(addr);
			if (addr) {
				var email = addr.getAddress();
				var name = addr.getName();
				var addrNode = {t:AjxEmailAddress.toSoapType[type], a:email};
				if (name) {
					addrNode.p = name;
				}
				addrNodes.push(addrNode);
			}
		}
	}
};

ZmMailMsg.prototype._addFrom =
function(addrNodes, parentNode, isDraft, accountName) {
	var ac = window.parentAppCtxt || window.appCtxt;

	// only use account name if we either dont have any identities to choose
	// from or the one we have is the default anyway
	var identity = this.identity;
	var isPrimary = identity == null || identity.isDefault;
	if (this.delegatedSenderAddr && !this.delegatedSenderAddrIsDL) {
		isPrimary = false;
	}

	// If repying to an invite which was addressed to user's alias then accept
	// reply should appear from the alias
	if (this._origMsg && this._origMsg.isInvite() &&
		this.isReplied &&
		(!this._origMsg._customMsg || !identity)) // is default reply or has no identities.
	{
		var origTos =  this._origMsg._getAttendees();
		var size = origTos && origTos.size() > 0 ? origTos.size() : 0;
		var aliazesString = "," + appCtxt.get(ZmSetting.MAIL_ALIASES).join(",") + ",";
		for (var i = 0; i < size; i++) {
			var origTo = origTos.get(i).address;
			if (origTo && aliazesString.indexOf("," + origTo + ",") >= 0) {
				var addrNode = {t:"f", a:origTo};
				addrNodes.push(addrNode);
				return; // We have already added appropriate alias as a "from". return from here.
			}
		}
	}

	//TODO: OPTIMIZE CODE by aggregating the common code.
	if (!appCtxt.isOffline && accountName && isPrimary) {
		var mainAcct = ac.accountList.mainAccount.getEmail();
		var onBehalfOf = false;

		var folder = appCtxt.getById(this.folderId);
		if ((!folder || folder.isRemote()) && (!this._origMsg || !this._origMsg.sendAsMe)) {
			accountName = (folder && folder.getOwner()) || accountName;
			onBehalfOf  = (accountName != mainAcct);
		}

		if (this._origMsg && this._origMsg.isDraft && !this._origMsg.sendAsMe) {
			var from = this._origMsg.getAddresses(AjxEmailAddress.FROM).get(0);
			// this means we're sending a draft msg obo so reset account name
			if (from && from.address.toLowerCase() != mainAcct.toLowerCase()) {
				accountName = from.address;
				onBehalfOf = true;
			}
		}

		// bug #44857 - replies/forwards should save sent message into respective account
		if (!onBehalfOf && appCtxt.isFamilyMbox && this._origMsg && folder) {
			onBehalfOf = (folder.getOwner() != mainAcct);
		}

		var addr, displayName;
		if (this.fromSelectValue) {
			addr = this.fromSelectValue.addr.address;
			displayName = this.fromSelectValue.addr.name;
		} else if (this._origMsg && this._origMsg.isInvite() && appCtxt.multiAccounts) {
			identity = this._origMsg.getAccount().getIdentity();
			addr = identity ? identity.sendFromAddress : this._origMsg.getAccount().name;
			displayName = identity && identity.sendFromDisplay;
		} else {
			if (onBehalfOf) {
				addr = accountName;
			} else {
				addr = identity ? identity.sendFromAddress : (this.delegatedSenderAddr || accountName);
                onBehalfOf = this.isOnBehalfOf;
				displayName = identity && identity.sendFromDisplay;
			}
		}

		var node = {t:"f", a:addr};
		if (displayName) {
			node.p = displayName;
		}
		addrNodes.push(node);
		if (onBehalfOf || !(ac.multiAccounts || isDraft)) {
			// the main account is *always* the sender
			addrNodes.push({t:"s", a:mainAcct});
		}
	} else{

		var mainAcct = ac.accountList.mainAccount.getEmail();
		var onBehalfOf = false;

		var folder = appCtxt.getById(this.folderId);
		if (folder && folder.isRemote() && !this._origMsg.sendAsMe) {
			accountName = folder.getOwner();
			onBehalfOf  = (accountName != mainAcct);
		}

		if (this._origMsg && this._origMsg.isDraft && !this._origMsg.sendAsMe) {
			var from = this._origMsg.getAddresses(AjxEmailAddress.FROM).get(0);
			// this means we're sending a draft msg obo so reset account name
			if (from && from.address.toLowerCase() != mainAcct.toLowerCase() && !appCtxt.isMyAddress(from.address.toLowerCase())) {
				accountName = from.address;
				onBehalfOf = true;
			}
		}

		var addr, displayName;
		if (onBehalfOf) {
			addr = accountName;
		} else if (identity) {
            if (identity.sendFromAddressType == ZmSetting.SEND_ON_BEHALF_OF){
                addr = identity.sendFromAddress.replace(ZmMsg.onBehalfOfMidLabel + " ", "");
                onBehalfOf = true;
            } else {
			    addr = identity.sendFromAddress || mainAcct;
            }
            displayName = identity.sendFromDisplay;

		} else {
           addr = this.delegatedSenderAddr || mainAcct;
           onBehalfOf = this.isOnBehalfOf;
        }

		var addrNode = {t:"f", a:addr};
		if( displayName) {
			addrNode.p = displayName;
		}
		addrNodes.push(addrNode);

		if (onBehalfOf) {
			addrNodes.push({t:"s", a:mainAcct});
		}

		if (identity && identity.isFromDataSource) {
			var dataSource = ac.getDataSourceCollection().getById(identity.id);
			if (dataSource) {
				// mail is "from" external account
				addrNode.t = "f";
				addrNode.a = dataSource.getEmail();
				if (ac.get(ZmSetting.DEFAULT_DISPLAY_NAME)) {
					var dispName = dataSource.identity && dataSource.identity.sendFromDisplay;
					addrNode.p = dispName || dataSource.userName || dataSource.getName();
				}
			}
		}
	}
};

ZmMailMsg.prototype._addReplyTo =
function(addrNodes) {
	if (this.identity) {
		if (this.identity.setReplyTo && this.identity.setReplyToAddress) {
			var addrNode = {t:"r", a:this.identity.setReplyToAddress};
			if (this.identity.setReplyToDisplay) {
				addrNode.p = this.identity.setReplyToDisplay;
			}
			addrNodes.push(addrNode);
		}
	}
};

ZmMailMsg.prototype._addReadReceipt =
function(addrNodes, accountName) {
	var addrNode = {t:"n"};
	var identity = this.identity;
	var ac = window.parentAppCtxt || window.appCtxt;

	if (identity) {
		addrNode.a = identity.readReceiptAddr || identity.sendFromAddress;
		addrNode.p = identity.sendFromDisplay;

		// ZCS-1874, if read receipt is for external POP/IMAP account then set proper email and display name
		if (identity.isFromDataSource) {
			var dataSource = ac.getDataSourceCollection().getById(identity.id);
			if (dataSource) {
				// mail is "from" external account
				addrNode.a = dataSource.getEmail();
				if (ac.get(ZmSetting.DEFAULT_DISPLAY_NAME)) {
					var dispName = dataSource.identity && dataSource.identity.sendFromDisplay;
					addrNode.p = dispName || dataSource.userName || dataSource.getName();
				}
			}
		}
	} else {
		addrNode.a = accountName || appCtxt.getActiveAccount().getEmail();
	}
	addrNodes.push(addrNode);
};

ZmMailMsg.prototype._isAttInHitList =
function(attach) {
	for (var i = 0; i < this._attHitList.length; i++) {
		if (attach.part == this._attHitList[i].part) { return true; }
	}

	return false;
};

ZmMailMsg.prototype._onChange =
function(what, a, b, c) {
	if (this.onChange) {
		this.onChange.run(what, a, b, c);
	}
};

/**
 * Gets the status icon.
 * 
 * @return	{String}	the icon
 */
ZmMailMsg.prototype.getStatusIcon =
function() {

	if (this.isInvite() && appCtxt.get(ZmSetting.CALENDAR_ENABLED)) {
		var method = this.invite.getInviteMethod();
		var status;
		if (method == ZmCalendarApp.METHOD_REPLY) {
			var attendees = this.invite.getAttendees();
			status = attendees && attendees[0] && attendees[0].ptst;
		} else if (method == ZmCalendarApp.METHOD_CANCEL) {
			status = ZmMailMsg.PSTATUS_DECLINED;
		}
		return ZmMailMsg.STATUS_ICON[status] || "Appointment";
	}

	for (var i = 0; i < ZmMailMsg.STATUS_LIST.length; i++) {
		var status = ZmMailMsg.STATUS_LIST[i];
		if (this[status]) {
			return ZmMailMsg.STATUS_ICON[status];
		}
	}

	return "MsgStatusRead";
};

/**
 * Gets the status tool tip.
 * 
 * @return	{String}	the tool tip
 */
ZmMailMsg.prototype.getStatusTooltip =
function() {
	// keep in sync with ZmConv.prototype.getStatusTooltip
	var status = [];
	if (this.isInvite()) {
		var icon = this.getStatusIcon();
		status.push(ZmMailMsg.TOOLTIP[icon]);
	}
	if (this.isScheduled)	{ status.push(ZmMsg.scheduled); }
	if (this.isUnread)		{ status.push(ZmMsg.unread); }
	if (this.isReplied)		{ status.push(ZmMsg.replied); }
	if (this.isForwarded)	{ status.push(ZmMsg.forwarded); }
	if (this.isDraft) {
		status.push(ZmMsg.draft);
	}
	else if (this.isSent) {
		status.push(ZmMsg.sentAt); //sentAt is for some reason "sent", which is what we need.
	}
	if (status.length == 0) {
		status = [ZmMsg.read];
	}

	return status.join(", ");
};

ZmMailMsg.prototype.notifyModify =
function(obj, batchMode) {
	if (obj.cid != null) {
		this.cid = obj.cid;
	}

	return ZmMailItem.prototype.notifyModify.apply(this, arguments);
};

ZmMailMsg.prototype.isResourceInvite =
function() {
	if (!this.cif || !this.invite) { return false; }

	var resources = this.invite.getResources();
	for (var i in resources) {
		if (resources[i] && resources[i].url == this.cif) {
			return true;
		}
	}
	return false;
};

ZmMailMsg.prototype.setAutoSendTime =
function(autoSendTime) {
    this._setAutoSendTime(autoSendTime);
};

ZmMailMsg.prototype._setAutoSendTime =
function(autoSendTime) {
	ZmMailItem.prototype.setAutoSendTime.call(this, autoSendTime);
	var conv = this.cid && appCtxt.getById(this.cid);
	if (Dwt.instanceOf(conv, "ZmConv")) {
		conv.setAutoSendTime(autoSendTime);
	}
};

/**
 * Sends a read receipt.
 * 
 * @param {closure}	callback	response callback
 */
ZmMailMsg.prototype.sendReadReceipt =
function(callback) {

	var jsonObj = {SendDeliveryReportRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.SendDeliveryReportRequest;
	request.mid = this.id;
	var ac = window.parentAppCtxt || window.appCtxt;
	ac.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:callback});
};


// Execute the mail redirect server side call
ZmMailMsg.prototype.redirect =
function(addrs, callback) {

	var jsonObj = {BounceMsgRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.BounceMsgRequest;
	request.m = {id:this.id};
	var e = request.m.e = [];
	for (var iType = 0; iType < ZmMailMsg.COMPOSE_ADDRS.length; iType++) {
		if (addrs[ZmMailMsg.COMPOSE_ADDRS[iType]]) {
			var all =  addrs[ZmMailMsg.COMPOSE_ADDRS[iType]].all;
			for (var i = 0, len = all.size(); i < len; i++) {
				var addr = all.get(i);
				var rType = AjxEmailAddress.toSoapType[addr.type];
				e.push({t:rType, a:addr.address});
			}
		}
	}

    // No Success callback, nothing of interest returned
    var acct = appCtxt.multiAccounts && appCtxt.accountList.mainAccount;
    appCtxt.getAppController().sendRequest({
        jsonObj:       jsonObj,
        asyncMode:     true,
        accountName:   acct,
        callback:      callback
    });
};

ZmMailMsg.prototype.doDelete =
function() {
	var params = {jsonObj:{MsgActionRequest:{_jsns:"urn:zimbraMail",action:{id:this.id, op:"delete"}}}, asyncMode:true};

	// Bug 84549: The params object is a property of the child window, because it
	// was constructed using this window's Object constructor. But when the child
	// window closes immediately after the request is sent, the object would be 
	// garbage-collected by the browser (or otherwise become invalid).
	// Therefore, we need to pass an object that is native to the parent window
	if (appCtxt.isChildWindow && (AjxEnv.isIE || AjxEnv.isModernIE)) {
		var cp = function(from){
			var to = window.opener.Object();
			for (var key in from) {
				var value = from[key];
				to[key] = (AjxUtil.isObject(value)) ? cp(value) : value;
			}
			return to;
		};
		params = cp(params);
	}

	var ac = window.parentAppCtxt || window.appCtxt;
	ac.getRequestMgr().sendRequest(params);
};

/**
 * If message is sent on behalf of returns sender address otherwise returns from address
 * @return {String} email address
 */
ZmMailMsg.prototype.getMsgSender = 
function() {
	var from = this.getAddress(AjxEmailAddress.FROM);
	var sender = this.getAddress(AjxEmailAddress.SENDER);
	if (sender && sender.address != (from && from.address)) {
		return sender.address;
	}
	return from && from.address;
};

/**
 * Return list header id if it exists, otherwise returns null
 * @return {String} list id
 */
ZmMailMsg.prototype.getListIdHeader = 
function() {
	var id = null;
	if (this.attrs && this.attrs[ZmMailMsg.HDR_LISTID]) {
		//extract <ID> from header
		var listId = this.attrs[ZmMailMsg.HDR_LISTID];
		id = listId.match(/<(.*)>/);
		if (AjxUtil.isArray(id)) {
			id = id[id.length-1]; //make it the last match
		}
	}
	return id;
};

/**
 * Return the zimbra DL header if it exists, otherwise return null
 * @return {AjxEmailAddress} AjxEmailAddress object if header exists
**/
ZmMailMsg.prototype.getXZimbraDLHeader = 
function() {
	if (this.attrs && this.attrs[ZmMailMsg.HDR_XZIMBRADL]) {
		return AjxEmailAddress.parseEmailString(this.attrs[ZmMailMsg.HDR_XZIMBRADL]);
	}
	return null;
};

/**
 * Return mime header id if it exists, otherwise returns null
 * @return {String} mime header value
 */
ZmMailMsg.prototype.getMimeHeader =
function(name) {
	var value = null;
	if (this.attrs && this.attrs[name]) {
		value = this.attrs[name];
	}
	return value;
};

/**
 * Adds optional headers to the given request.
 * 
 * @param {object|AjxSoapDoc}	req		SOAP document or JSON parent object (probably a <m> msg object)
 */
ZmMailMsg.addRequestHeaders =
function(req) {
	
	if (!req) { return; }
	if (req.isAjxSoapDoc) {
		for (var hdr in ZmMailMsg.requestHeaders) {
			var headerNode = req.set('header', null, null);
			headerNode.setAttribute('n', ZmMailMsg.requestHeaders[hdr]);
		}
	}
	else {
		var hdrs = ZmMailMsg.requestHeaders;
		if (hdrs) {
			req.header = req.header || [];
			for (var hdr in hdrs) {
				req.header.push({n:hdrs[hdr]});
			}
		}
	}
};

/**
 * Returns a URL that can be used to fetch the given part of this message.
 *
 * @param   {ZmMimePart}    bodyPart        MIME part to fetch
 *
 * @returns {string}    URL to fetch the part
 */
ZmMailMsg.prototype.getUrlForPart = function(bodyPart) {

    return appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI) + "&loc=" + AjxEnv.DEFAULT_LOCALE + "&id=" + this.id + "&part=" + bodyPart.part;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMimePart")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a mime part.
 * @class
 * This class represents a mime part. Note that the content of the node is
 * not copied into this object, for performance reasons. It is typically
 * available via the 'bodyParts' list that is populated during node parsing.
 * 
 * @extends		ZmModel
 */
ZmMimePart = function(parent) {
	
	ZmModel.call(this, ZmEvent.S_ATT);
	
	this.parent = parent;
	this.children = new AjxVector();
};

ZmMimePart.prototype = new ZmModel;
ZmMimePart.prototype.constructor = ZmMimePart;

ZmMimePart.prototype.isZmMimePart = true;
ZmMimePart.prototype.toString = function() { return "ZmMimePart"; };

/**
 * Returns a ZmMimePart constructed from the given JSON object. If a context
 * hash is provided with 'attachments' and 'bodyParts' arrays, and a hash
 * 'contentTypes', those will be populated as the node is recursively parsed.
 * 
 * @param	{object}		node	JSON representation of MIME part
 * @param	{hash}			ctxt	optional context
 * @return	{ZmMimePart}			a MIME part
 */
ZmMimePart.createFromDom =
function(node, ctxt, parent) {
	var mimePart = new ZmMimePart(parent);
	mimePart._loadFromDom(node, ctxt);
	return mimePart;
};

/**
 * Returns this part's content.
 * 
 * @return	{string}	content		the content
 */
ZmMimePart.prototype.getContent = 
function() {
	return this.content || (this.node && this.node.content) || "";
};

/**
 * Returns content of the given type, in or below this part.
 * 
 * @param	{string}	contentType		the content type
 * @return	{string}					the content
 * 
 */
ZmMimePart.prototype.getContentForType = 
function(contentType) {

	if (this.contentType == contentType) {
		return this.getContent();
	}
	else {
		var children = this.children.getArray();
		if (children.length) {
			for (var i = 0; i < children.length; i++) {
				var content = children[i].getContentForType(contentType);
				if (content) {
					return content;
				}
			}
		}
	}
	return "";
};

/**
 * Sets the content, overriding the original content.
 * 
 * @param	{string}	content		the content
 */
ZmMimePart.prototype.setContent = 
function(content) {
	this.content = content;
};

/**
 * Returns the content disposition.
 * 
 * @return	{string}	the content disposition
 */
ZmMimePart.prototype.getContentDisposition =
function() {
	return this.contentDisposition;
};

/**
 * Returns the content type.
 * 
 * @return	{string}	the content type
 */
ZmMimePart.prototype.getContentType =
function() {
	return this.contentType;
};

/**
 * Sets the content type, , overriding the original content type.
 * 
 * @param	{string}	contentType		the content type
 */
ZmMimePart.prototype.setContentType =
function(contentType) {
	this.contentType = contentType;
};

/**
 * Sets the 'is body' flag, overriding the original part's value.
 * 
 * @param	{boolean}	isBody		if true, this part is the body
 */
ZmMimePart.prototype.setIsBody = 
function(isBody) {
	this.isBody = isBody;
};

/**
 * Returns the filename.
 * 
 * @return	{string}	the filename
 */
ZmMimePart.prototype.getFilename =
function() {
	return this.fileName;
};

/**
 * Returns true if this part should not be considered to be an attachment.
 * 
 * @return	{boolean}
 */
ZmMimePart.prototype.isIgnoredPart =
function() {
	// bug fix #5889 - if parent node was multipart/appledouble,
	// ignore all application/applefile attachments - YUCK
	if (this.parent && this.parent.contentType == ZmMimeTable.MULTI_APPLE_DBL &&
		this.contentType == ZmMimeTable.APP_APPLE_DOUBLE)
	{
		return true;
	}

	// bug fix #7271 - dont show renderable body parts as attachments anymore
	if (this.isBody && this.getContent() && 
		(this.contentType == ZmMimeTable.TEXT_HTML || this.contentType == ZmMimeTable.TEXT_PLAIN))
	{
		return true;
	}

	if (this.contentType == ZmMimeTable.MULTI_DIGEST) {
		return true;
	}

	return false;
};

ZmMimePart.prototype._loadFromDom =
function(node, ctxt) {
	
	this._loadProps(node);
	
	if (node.content) {
		this._loaded = true;
	}
	
	if (ctxt.contentTypes) {
		ctxt.contentTypes[node.ct] = true;
	}

	var isAtt = false;
	if (this.contentDisposition == "attachment" || 
		this.contentType == ZmMimeTable.MSG_RFC822 || this.contentType == ZmMimeTable.TEXT_CAL ||            
		this.fileName || this.contentId || this.contentLocation) {

		if (!this.isIgnoredPart()) {
			if (ctxt.attachments) {
				ctxt.attachments.push(this);
			}
			isAtt = true;
		}
	}

	if (this.isBody) {
		var hasContent = AjxUtil.isSpecified(node.content);
		if ((ZmMimeTable.isRenderableImage(this.contentType) || hasContent)) {
			if (ctxt.bodyParts) {
				if (this.contentType == ZmMimeTable.MULTI_ALT) {
					ctxt.bodyParts.push({});
				}
				else if (ZmMimePart._isPartOfMultipartAlternative(this)) {
					var altPart = {};
					altPart[this.contentType] = this;
					ctxt.bodyParts.push(altPart);
				}
				else {
					ctxt.bodyParts.push(this);
				}
			}
			if (isAtt && ctxt.attachments) {
				//To avoid duplication, Remove attachment that was just added as bodypart.
				ctxt.attachments.pop();
			}
		} else if (!isAtt && this.size != 0 && !this.isIgnoredPart()){
			if (ctxt.attachments) {
				ctxt.attachments.push(this);
			}
		}
	}

	// bug fix #4616 - dont add attachments part of a rfc822 msg part
	if (node.mp && this.contentType != ZmMimeTable.MSG_RFC822) {
		for (var i = 0; i < node.mp.length; i++) {
			this.children.add(ZmMimePart.createFromDom(node.mp[i], ctxt, this));
		}
	}
};

ZmMimePart.prototype._loadProps =
function(node) {

	this.node				= node;
	
	// the middle column is for backward compatibility
	this.contentType		= this.ct			= node.ct;
	this.format									= node.format;	// optional arg for text/plain
	this.name									= node.name;
	this.part									= node.part;
	this.cachekey								= node.cachekey;
	this.size				= this.s			= node.s;
	this.contentDisposition	= this.cd			= node.cd;
	var ci = node.ci;
	//in some cases the content ID is not wrapped by angle brackets (mistake by the mail application), so make sure we wrap it if not
	this.contentId			= this.ci			= ci && ci.indexOf("<") !== 0 ? "<" + ci + ">" : ci;
	this.contentLocation	= this.cl			= node.cl;
	this.fileName			= this.filename		= node.filename;
	this.isTruncated		= this.truncated	= !!(node.truncated);
	this.isBody				= this.body			= !!(node.body);
};

/**
 * @param {object}		parentNode
 * @return {true/false}	true if one of the parent in the hierarchy is multipart/alternative otherwise false.
*/
ZmMimePart._isPartOfMultipartAlternative =
function(part){
    if (!part) { return false; }
    if (part.contentType == ZmMimeTable.MULTI_ALT) { return true; }
    return ZmMimePart._isPartOfMultipartAlternative(part.parent);
};

/**
 * Checks within the given node tree for content within a multipart/alternative part that
 * we don't have, and then creates and adds a MIME part for it. Assumes that there will be
 * at most one multipart/alternative.
 * 
 * @param {object}		node			
 * @param {string}		contentType
 * @param {int}			index
 * 
 * @return {ZmMimePart}		the MIME part that was created and added
 */
ZmMimePart.prototype.addAlternativePart =
function(node, contentType, index) {

	// replace this part if we got new content
	if (node.ct == contentType && ZmMimePart._isPartOfMultipartAlternative(this.parent) && node.body &&  !this.getContent()) {
		var mimePart = new ZmMimePart(this);
		mimePart._loadProps(node);
		this.parent.children.replace(index, mimePart);
		return mimePart;
	}
	if (node.mp && node.mp.length) {
		for (var i = 0; i < node.mp.length; i++) {
			var mimePart = this.children.get(i);
			var altPart = mimePart && mimePart.addAlternativePart(node.mp[i], contentType, i);
			if (altPart) {
				return altPart;
			}
		}
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailList")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an empty list of mail items.
 * @constructor
 * @class
 * This class represents a list of mail items (conversations, messages, or
 * attachments). We retain a handle to the search that generated the list for
 * two reasons: so that we can redo the search if necessary, and so that we
 * can get the folder ID if this list represents folder contents.
 *
 * @author Conrad Damon
 * 
 * @param type		type of mail item (see ZmItem for constants)
 * @param search	the search that generated this list
 */
ZmMailList = function(type, search) {

	ZmList.call(this, type, search);

	this.convId = null; // for msg list within a conv

	// mail list can be changed via folder or tag action (eg "Mark All Read")
	var folderTree = appCtxt.getFolderTree();
	if (folderTree) {
		this._folderChangeListener = new AjxListener(this, this._folderTreeChangeListener);
		folderTree.addChangeListener(this._folderChangeListener);
	}
};

ZmMailList.prototype = new ZmList;
ZmMailList.prototype.constructor = ZmMailList;

ZmMailList.prototype.isZmMailList = true;
ZmMailList.prototype.toString = function() { return "ZmMailList"; };

ZmMailList._SPECIAL_FOLDERS = [ZmFolder.ID_DRAFTS, ZmFolder.ID_TRASH, ZmFolder.ID_SPAM, ZmFolder.ID_SENT];
ZmMailList._SPECIAL_FOLDERS_HASH = AjxUtil.arrayAsHash(ZmMailList._SPECIAL_FOLDERS);


/**
 * Override so that we can specify "tcon" attribute for conv move - we don't want
 * to move messages in certain system folders as a side effect. Also, we need to
 * update the UI based on the response if we're moving convs, since the 
 * notifications only tell us about moved messages. This method should be called
 * only in response to explicit action by the user, in which case we want to
 * remove the conv row(s) from the list view (even if the conv still matches the
 * search).
 *
 * @param {Hash}	params		a hash of parameters
 *        items			[array]			a list of items to move
 *        folder		[ZmFolder]		destination folder
 *        attrs			[hash]			additional attrs for SOAP command
 *        callback		[AjxCallback]*	callback to run after each sub-request
 *        finalCallback	[closure]*		callback to run after all items have been processed
 *        count			[int]*			starting count for number of items processed
 *        fromFolderId  [String]*       optional folder to represent when calculating tcon. If unspecified, use current search folder nId
 *        
 * @private
 */
ZmMailList.prototype.moveItems =
function(params) {

	if (this.type != ZmItem.CONV) {
		return ZmList.prototype.moveItems.apply(this, arguments);
	}

	params = Dwt.getParams(arguments, ["items", "folder", "attrs", "callback", "finalCallback", "noUndo", "actionTextKey", "fromFolderId"]);
	params.items = AjxUtil.toArray(params.items);

	var params1 = AjxUtil.hashCopy(params);
	delete params1.fromFolderId;

	params1.attrs = {};
	var tcon = this._getTcon(params.items, params.fromFolderId);
	if (tcon) {
		params1.attrs.tcon = tcon;
	}
	params1.attrs.l = params.folder.id;
	params1.action = (params.folder.id == ZmFolder.ID_TRASH) ? "trash" : "move";
    if (params1.folder.id == ZmFolder.ID_TRASH) {
        params1.actionTextKey = params.actionTextKey || "actionTrash";
    } else {
        params1.actionTextKey = params.actionTextKey || "actionMove";
        params1.actionArg = params1.folder.getName(false, false, true);
    }
	params1.callback = new AjxCallback(this, this._handleResponseMoveItems, [params]);

	if (appCtxt.multiAccounts) {
		// Reset accountName for multi-account to be the respective account if we're
		// moving a draft out of Trash.
		// OR,
		// check if we're moving to or from a shared folder, in which case, always send
		// request on-behalf-of the account the item originally belongs to.
        var folderId = params.items[0].getFolderId && params.items[0].getFolderId();

        // on bulk delete, when the second chunk loads try to get folderId from the item id.
        if (!folderId) {
            var itemId = params.items[0] && params.items[0].id;
            folderId = itemId && appCtxt.getById(itemId) && appCtxt.getById(itemId).folderId;
        }
        var fromFolder = folderId && appCtxt.getById(folderId);
		if ((params.items[0].isDraft && params.folder.id == ZmFolder.ID_DRAFTS) ||
			(params.folder.isRemote()) || (fromFolder && fromFolder.isRemote()))
		{
			params1.accountName = params.items[0].getAccount().name;
		}
	}

	if (this._handleDeleteFromSharedFolder(params, params1)) {
		return;
	}

	params1.safeMove = true; //Move only items currently seen by the client
	this._itemAction(params1);
};

/**
 * Marks items as "spam" or "not spam". If they're marked as "not spam", a target folder
 * may be provided.
 * @param {Hash}	params		a hash of parameters
 *        items			[array]			a list of items
 *        markAsSpam	[boolean]		if true, mark as "spam"
 *        folder		[ZmFolder]		destination folder
 *        childWin		[window]*		the child window this action is happening in
 *        closeChildWin	[boolean]*		is the child window closed at the end of the action?
 *        callback		[AjxCallback]*	callback to run after each sub-request
 *        finalCallback	[closure]*		callback to run after all items have been processed
 *        count			[int]*			starting count for number of items processed
 * @private
 */
ZmMailList.prototype.spamItems = 
function(params) {

	var items = params.items = AjxUtil.toArray(params.items);

	if (appCtxt.multiAccounts) {
		var accounts = this._filterItemsByAccount(items);
		this._spamAccountItems(accounts, params);
	} else {
		this._spamItems(params);
	}
};

ZmMailList.prototype._spamAccountItems =
function(accounts, params) {
	var items;
	for (var i in accounts) {
		items = accounts[i];
		break;
	}

	if (items) {
		delete accounts[i];

		params.accountName = appCtxt.accountList.getAccount(i).name;
		params.items = items;
		params.callback = new AjxCallback(this, this._spamAccountItems, [accounts, params]);

		this._spamItems(params);
	}
};

ZmMailList.prototype._spamItems =
function(params) {
	params = Dwt.getParams(arguments, ["items", "markAsSpam", "folder", "childWin"]);

	var params1 = AjxUtil.hashCopy(params);

	params1.action = params.markAsSpam ? "spam" : "!spam";
	params1.attrs = {};
	if (this.type === ZmItem.CONV) {
		var tcon = this._getTcon(params.items);
		//the reason not to set "" as tcon is from bug 58727. (though I think it should have been a server fix).
		if (tcon) {
			params1.attrs.tcon = tcon;
		}
	}
	if (params.folder) {
		params1.attrs.l = params.folder.id;
	}
	params1.actionTextKey = params.markAsSpam ? 'actionMarkAsJunk' : 'actionMarkAsNotJunk';

	params1.callback = new AjxCallback(this, this._handleResponseSpamItems, params);
	this._itemAction(params1);
};

ZmMailList.prototype._handleResponseSpamItems =
function(params, result) {

	var movedItems = result.getResponse();
	var summary;
	if (movedItems && movedItems.length) {
		var folderId = params.markAsSpam ? ZmFolder.ID_SPAM : (params.folder ? params.folder.id : ZmFolder.ID_INBOX);
		this.moveLocal(movedItems, folderId);
		var convs = {};
		for (var i = 0; i < movedItems.length; i++) {
			var item = movedItems[i];
			if (item.cid) {
				var conv = appCtxt.getById(item.cid);
				if (conv) {
					if (!convs[conv.id])
						convs[conv.id] = {conv:conv,msgs:[]};
					convs[conv.id].msgs.push(item);
				}
			}
			var details = {oldFolderId:item.folderId, fields:{}};
			details.fields[ZmItem.F_FRAGMENT] = true;
			item.moveLocal(folderId);
		}

		for (var id in convs) {
			if (convs.hasOwnProperty(id)) {
				var conv = convs[id].conv;
				var msgs = convs[id].msgs;
				conv.updateFragment(msgs);
			}
		}
		//ZmModel.notifyEach(movedItems, ZmEvent.E_MOVE);
		
		var item = movedItems[0];
		var list = item.list;
		if (list) {
			list._evt.batchMode = true;
			list._evt.item = item;	// placeholder
			list._evt.items = movedItems;
			list._notify(ZmEvent.E_MOVE, details);
		}
		if (params.actionText) {
			summary = ZmList.getActionSummary(params);
		}

		if (params.childWin) {
			params.childWin.close();
		}
	}
	params.actionSummary = summary;
	if (params.callback) {
		params.callback.run(result);
	}
};

/**
 * Override so that delete of a conv in Trash doesn't hard-delete its msgs in
 * other folders. If we're in conv mode in Trash, we add a constraint of "t",
 * meaning that the action is only applied to items (msgs) in the Trash.
 *
 * @param {Hash}		params		a hash of parameters
 * @param  {Array}     params.items			list of items to delete
 * @param {Boolean}      params.hardDelete	whether to force physical removal of items
 * @param {Object}      params.attrs			additional attrs for SOAP command
 * @param {window}       params.childWin		the child window this action is happening in
 * @param	{Boolean}	params.confirmDelete		the user confirmed hard delete
 *
 * @private
 */
ZmMailList.prototype.deleteItems =
function(params) {

	params = Dwt.getParams(arguments, ["items", "hardDelete", "attrs", "childWin"]);

	if (this.type == ZmItem.CONV) {
		var searchFolder = this.search ? appCtxt.getById(this.search.folderId) : null;
		if (searchFolder && searchFolder.isHardDelete()) {

			if (!params.confirmDelete) {
				params.confirmDelete = true;
				var callback = ZmMailList.prototype.deleteItems.bind(this, params);
				this._popupDeleteWarningDialog(callback, false, params.items.length);
				return;
			}

			var instantOn = appCtxt.getAppController().getInstantNotify();
			if (instantOn) {
				// bug fix #32005 - disable instant notify for ops that might take awhile
				appCtxt.getAppController().setInstantNotify(false);
				params.errorCallback = new AjxCallback(this, this._handleErrorDeleteItems);
			}

			params.attrs = params.attrs || {};
			params.attrs.tcon = ZmFolder.TCON_CODE[searchFolder.nId];
			params.action = "delete";
            params.actionTextKey = 'actionDelete';
			params.callback = new AjxCallback(this, this._handleResponseDeleteItems, instantOn);
			return this._itemAction(params);
		}
	}
	ZmList.prototype.deleteItems.call(this, params);
};

ZmMailList.prototype._handleResponseDeleteItems =
function(instantOn, result) {
	var deletedItems = result.getResponse();
	if (deletedItems && deletedItems.length) {
		this.deleteLocal(deletedItems);
		for (var i = 0; i < deletedItems.length; i++) {
			deletedItems[i].deleteLocal();
		}
		// note: this happens before we process real notifications
		ZmModel.notifyEach(deletedItems, ZmEvent.E_DELETE);
	}

	if (instantOn) {
		appCtxt.getAppController().setInstantNotify(true);
	}
};

ZmMailList.prototype._handleErrorDeleteItems =
function() {
	appCtxt.getAppController().setInstantNotify(true);
};

/**
 * Only make the request for items whose state will be changed.
 *
 * @param {Hash}		params		a hash of parameters
 *
 *        items			[array]				a list of items to mark read/unread
 *        value			[boolean]			if true, mark items read
 *        callback		[AjxCallback]*		callback to run after each sub-request
 *        finalCallback	[closure]*			callback to run after all items have been processed
 *        count			[int]*				starting count for number of items processed
 *        
 * @private
 */
ZmMailList.prototype.markRead =
function(params) {

	var items = AjxUtil.toArray(params.items);

	var items1;
	if (items[0] && items[0] instanceof ZmItem) {
		items1 = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if ((item.type == ZmItem.CONV && item.hasFlag(ZmItem.FLAG_UNREAD, params.value)) || (item.isUnread == params.value)) {
				items1.push(item);
			}
		}
	} else {
		items1 = items;
	}

	if (items1.length) {
		params.items = items1;
		params.op = "read";
		if (items1.length > 1) {
        	params.actionTextKey = params.value ? 'actionMarkRead' : 'actionMarkUnread';
		}
		this.flagItems(params);
	}
    else if(params.forceCallback) {
        if (params.callback) {
			params.callback.run(new ZmCsfeResult([]));
		}
		if (params.finalCallback) {
			params.finalCallback(params);
		}
		return;
    }
};

/**
 * Only make the request for items whose state will be changed.
 *
 * @param {Hash}		params		a hash of parameters
 *
 *        items			[array]				a list of items to mark read/unread
 *        value			[boolean]			if true, mark items read
 *        callback		[AjxCallback]*		callback to run after each sub-request
 *        finalCallback	[closure]*			callback to run after all items have been processed
 *        count			[int]*				starting count for number of items processed
 *
 * @private
 */
ZmMailList.prototype.markMute =
function(params) {

	var items = AjxUtil.toArray(params.items);

	var items1;
	if (items[0] && items[0] instanceof ZmItem) {
		items1 = [];
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			if (params.value != item.isMute) {
				items1.push(item);
			}
		}
	} else {
		items1 = items;
	}

	if (items1.length) {
		params.items = items1;
		params.op = "mute";
        params.actionTextKey = params.value ? 'actionMarkMute' : 'actionMarkUnmute';
		this.flagItems(params);
	}
    else if(params.forceCallback) {
        if (params.callback) {
			params.callback.run(new ZmCsfeResult([]));
		}
		if (params.finalCallback) {
			params.finalCallback(params);
		}
		return;
    }
};

// set "force" flag to true on actual hard deletes, so that msgs
// in a conv list are removed
ZmMailList.prototype.deleteLocal =
function(items) {
	for (var i = 0; i < items.length; i++) {
		this.remove(items[i], true);
	}
};

// When a conv or msg is moved to Trash, it is marked read by the server.
ZmMailList.prototype.moveLocal =
function(items, folderId) {
	ZmList.prototype.moveLocal.call(this, items, folderId);
	if (folderId != ZmFolder.ID_TRASH) { return; }

	var flaggedItems = [];
	for (var i = 0; i < items.length; i++) {
		if (items[i].isUnread) {
			items[i].flagLocal(ZmItem.FLAG_UNREAD, false);
			flaggedItems.push(items[i]);
		}
	}
	ZmModel.notifyEach(flaggedItems, ZmEvent.E_FLAGS, {flags:[ZmItem.FLAG_UNREAD]});
};

ZmMailList.prototype.notifyCreate = 
function(convs, msgs) {

	var createdItems = [];
	var newConvs = [];
	var newMsgs = [];
	var flaggedItems = [];
	var modifiedItems = [];
	var newConvId = {};
	var fields = {};
	var sortBy = this.search ? this.search.sortBy : null;
	var sortIndex = {};
	if (this.type == ZmItem.CONV) {
		// handle new convs first so we can set their fragments later from new msgs
		for (var id in convs) {
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: handling conv create " + id);
			if (this.getById(id)) {
				AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: conv already exists " + id);
				continue;
			}
			newConvId[id] = convs[id];
			var conv = convs[id];
			var convMatches =  this.search && this.search.matches(conv) && !conv.ignoreJunkTrash();
			if (convMatches) {
				if (!appCtxt.multiAccounts ||
					(appCtxt.multiAccounts && (this.search.isMultiAccount() || conv.getAccount() == appCtxt.getActiveAccount()))) 
				{
					// a new msg for this conv matches current search
					conv.list = this;
					newConvs.push(conv);
					AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: conv added " + id);
				}
				else {
					AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: conv failed account checks " + id);
				}
			}
			else {
				// debug info for bug 47589
				var query = this.search ? this.search.query : "";
				var ignore = conv.ignoreJunkTrash();
				AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: conv does not match search '" + query + "' or was ignored (" + ignore + "); match function:");
				if (!conv) {
					AjxDebug.println(AjxDebug.NOTIFY, "conv is null!");
				}
				else {
					var folders = AjxUtil.keys(conv.folders) || "";
					AjxDebug.println(AjxDebug.NOTIFY, "conv folders: " + folders.join(" "));
				}
			}
		}

		// a new msg can hand us a new conv, and update a conv's info
		for (var id in msgs) {
			var msg = msgs[id];
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: CLV handling msg create " + id);
			var cid = msg.cid;
			var msgMatches =  this.search && this.search.matches(msg) && !msg.ignoreJunkTrash();
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: CLV msg matches: " + msgMatches);
			var isActiveAccount = (!appCtxt.multiAccounts || (appCtxt.multiAccounts && msg.getAccount() == appCtxt.getActiveAccount()));
			var conv = newConvId[cid] || this.getById(cid);
			var updateConv = false;
			if (msgMatches && isActiveAccount) {
				if (!conv) {
					// msg will have _convCreateNode if it is 2nd msg and caused promotion of virtual conv;
					// the conv node will have proper count and subject
					var args = {list:this};
					if (msg._convCreateNode) {
						if (msg._convCreateNode._newId) {
							msg._convCreateNode.id = msg._convCreateNode._newId;
						}
						//sometimes the conv is already in the app cache. Make sure not to re-create it and with the wrong msgs. This is slight improvement of bug 87861.
						conv = appCtxt.getById(cid);
						if (!conv) {
							conv = ZmConv.createFromDom(msg._convCreateNode, args);
						}
					}
					else {
						conv = appCtxt.getById(cid) || ZmConv.createFromMsg(msg, args);
					}
					newConvId[cid] = conv;
					conv.folders[msg.folderId] = true;
					newConvs.push(conv);
				}
				conv.list = this;
			}
			// make sure conv's msg list is up to date
			if (conv && !(conv.msgs && conv.msgs.getById(id))) {
				if (!conv.msgs) {
					conv.msgs = new ZmMailList(ZmItem.MSG);
					conv.msgs.addChangeListener(conv._listChangeListener);
				}
				msg.list = conv.msgs;
				if (!msg.isSent && msg.isUnread) {
					conv.isUnread = true;
					flaggedItems.push(conv);
				}
				// if the new msg matches current search, update conv date, fragment, and sort order
				if (msgMatches) {
					msg.inHitList = true;
				}
				if (msgMatches || ((msgMatches === null) && !msg.isSent)) {
					if (conv.fragment != msg.fragment) {
						conv.fragment = msg.fragment;
						fields[ZmItem.F_FRAGMENT] = true;
					}
					if (conv.date != msg.date) {
						conv.date = msg.date;
						// recalculate conv's sort position since we changed its date
						fields[ZmItem.F_DATE] = true;
					}
					if (conv.numMsgs === 1) {
						//there is only one message in this conv so set the size of conv to msg size
						conv.size = msg.size;
					}
					else {
						//So it shows the message count, and not the size (see ZmConvListView.prototype._getCellContents)
						//this size is no longer relevant (was set in the above if previously, see bug 87416)
						conv.size = null;
					}
					if (msg._convCreateNode) {
						//in case of single msg virtual conv promoted to a real conv - update the size
						// (in other cases of size it's updated elsewhere - see ZmConv.prototype.notifyModify, the server sends the update notification for the conv size)
						fields[ZmItem.F_SIZE] = true;
					}
					// conv gained a msg, may need to be moved to top/bottom
					if (!newConvId[conv.id] && this._vector.contains(conv)) {
						fields[ZmItem.F_INDEX] = true;
					}
					modifiedItems.push(conv);
				}
				AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: conv list accepted msg " + id);
				newMsgs.push(msg);
			}
		}
	} else if (this.type == ZmItem.MSG) {
		// add new msg to list
		for (var id in msgs) {
			var msg = msgs[id];
			var msgMatches =  this.search && this.search.matches(msg) && !msg.ignoreJunkTrash();
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: handling msg create " + id);
			if (this.getById(id)) {
				if (msgMatches) {
					var query = this.search ? this.search.query : "";
					var ignore = msg.ignoreJunkTrash();
					AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: msg does not match search '" + query + "' or was ignored (" + ignore + ")");
					msg.list = this; // Even though we have the msg in the list, it sometimes has its list wrong.
				}
				continue;
			}
			if (this.convId) { // MLV within CV
				if (msg.cid == this.convId && !this.getById(msg.id)) {
					msg.list = this;
					AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: msg list (CV) accepted msg " + id);
					newMsgs.push(msg);
				}
			} else { // MLV (traditional)
				if (msgMatches) {
					msg.list = this;
					AjxDebug.println(AjxDebug.NOTIFY, "ZmMailList: msg list (TV) accepted msg " + id);
					newMsgs.push(msg);
				}
			}
		}
	}

	// sort item list in reverse so they show up in correct order when processed (oldest appears first)
	if (newConvs.length > 1) {
		ZmMailItem.sortBy = sortBy;
		newConvs.sort(ZmMailItem.sortCompare);
		newConvs.reverse();
	}

	this._sortAndNotify(newConvs, sortBy, ZmEvent.E_CREATE);
	this._sortAndNotify(newMsgs, sortBy, ZmEvent.E_CREATE);
	ZmModel.notifyEach(flaggedItems, ZmEvent.E_FLAGS, {flags:[ZmItem.FLAG_UNREAD]});
	this._sortAndNotify(modifiedItems, sortBy, ZmEvent.E_MODIFY, {fields:fields});
	this._sortAndNotify(newMsgs, sortBy, ZmEvent.E_MODIFY, {fields:fields});
};

/**
* Convenience method for adding messages to a conv on the fly. The specific use case for
* this is when a virtual conv becomes real. We basically add the new message(s) to the
* old (virtual) conv's message list.
*
* @param msgs		hash of messages to add
*/
ZmMailList.prototype.addMsgs =
function(msgs) {
	var addedMsgs = [];
	for (var id in msgs) {
		var msg = msgs[id];
		if (msg.cid == this.convId) {
			this.add(msg, 0);
			msg.list = this;
			addedMsgs.push(msg);
		}
	}
	ZmModel.notifyEach(addedMsgs, ZmEvent.E_CREATE);
};


ZmMailList.prototype.removeAllItems = 
function() {
	this._vector = new AjxVector();
	this._idHash = {};
};


ZmMailList.prototype.remove = 
function(item, force) {
	// Don't really remove an item if this is a list of msgs of a conv b/c a
	// msg is always going to be part of a conv unless it's a hard delete!
	if (!this.convId || force) {
		ZmList.prototype.remove.call(this, item);
	}
};

ZmMailList.prototype.clear =
function() {
	// remove listeners for this list from folder tree and tag list
	if (this._folderChangeListener) {
		var folderTree = appCtxt.getFolderTree();
		if (folderTree) {
			folderTree.removeChangeListener(this._folderChangeListener);
		}
	}
	if (this._tagChangeListener) {
		var tagTree = appCtxt.getTagTree();
		if (tagTree) {
			tagTree.removeChangeListener(this._tagChangeListener);
		}
	}

	ZmList.prototype.clear.call(this);
};

/**
 * Gets the first msg in the list that's not in one of the given folders (if any).
 * 
 * @param {int}	offset	the starting point within list
 * @param {int}	limit		the ending point within list
 * @param {foldersToOmit}	A hash of folders to omit
 * @return	{ZmMailMsg}		the message
 */
ZmMailList.prototype.getFirstHit =
function(offset, limit, foldersToOmit) {

	if (this.type !== ZmItem.MSG) {
		return null;
	}

	var msg = null;	
	offset = offset || 0;
	limit = limit || appCtxt.get(ZmSetting.CONVERSATION_PAGE_SIZE);
	var numMsgs = this.size();

	if (numMsgs > 0 && offset >= 0 && offset < numMsgs) {
		var end = (offset + limit > numMsgs) ? numMsgs : offset + limit;
		var list = this.getArray();
		for (var i = offset; i < end; i++) {
			if (!(foldersToOmit && list[i].folderId && foldersToOmit[list[i].folderId])) {
				msg = list[i];
				break;
			}
		}
		if (!msg) {
			msg = list[0];	// no qualifying messages, use first msg
		}
	}
	
	return msg;
};

/**
 * Returns the insertion point for the given item into this list. If we're not sorting by
 * date, returns 0 (the item will be inserted at the top of the list).
 *
 * @param item		[ZmMailItem]	a mail item
 * @param sortBy	[constant]		sort order
 */
ZmMailList.prototype._getSortIndex =
function(item, sortBy) {
	if (!sortBy || (sortBy != ZmSearch.DATE_DESC && sortBy != ZmSearch.DATE_ASC)) {
		return 0;
	}
	
	var itemDate = parseInt(item.date);
	var a = this.getArray();
	// server always orders conv's msg list as DATE_DESC
	if (this.convId && sortBy == ZmSearch.DATE_ASC) {
		//create a temp array with reverse index and date
		var temp = [];
		for(var j = a.length - 1;j >=0;j--) {
			temp.push({date:a[j].date});
		}
		a = temp;
	}
	for (var i = 0; i < a.length; i++) {
		var date = parseInt(a[i].date);
		if ((sortBy == ZmSearch.DATE_DESC && (itemDate >= date)) ||
			(sortBy == ZmSearch.DATE_ASC && (itemDate <= date))) {
			return i;
		}
	}
	return i;
};

ZmMailList.prototype._sortAndNotify =
function(items, sortBy, event, details) {

	if (!(items && items.length)) { return; }

	var itemType = items[0] && items[0].type;
	if ((this.type == ZmItem.MSG) && (itemType == ZmItem.CONV)) { return; }

	details = details || {};
	var doSort = ((event == ZmEvent.E_CREATE) || (details.fields && details.fields[ZmItem.F_DATE]));
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (doSort) {
			var doAdd = (itemType == this.type);
			var listSortIndex = 0, viewSortIndex = 0;
			if (this.type == ZmItem.CONV && itemType == ZmItem.MSG) {
				//Bug 87861 - we still want to add the message to the conv even if the conv is not in this view. So look for it in appCtxt cache too. (case in point - it's in "sent" folder)
				var conv = this.getById(item.cid) || appCtxt.getById(item.cid);
				if (conv) {
					// server always orders msgs within a conv by DATE_DESC, so maintain that
					listSortIndex = conv.msgs._getSortIndex(item, ZmSearch.DATE_DESC);
					viewSortIndex = conv.msgs._getSortIndex(item, appCtxt.get(ZmSetting.CONVERSATION_ORDER));
					if (event == ZmEvent.E_CREATE) {
						conv.addMsg(item, listSortIndex);
					}
				}
			} else {
				viewSortIndex = listSortIndex = this._getSortIndex(item, sortBy);
			}
			if (event != ZmEvent.E_CREATE) {
				// if date changed, re-insert item into correct slot
				if (listSortIndex != this.indexOf(item)) {
					this.remove(item);
				} else {
					doAdd = false;
				}
			}
			if (doAdd) {
				this.add(item, listSortIndex);
			}
			details.sortIndex = viewSortIndex;
		}
		item._notify(event, details);
	}
};

ZmMailList.prototype._isItemInSpecialFolder =
function(item) {
//	if (item.folderId) { //case of one message in conv, even if not loaded yet, we know the folder.
//		return ZmMailList._SPECIAL_FOLDERS_HASH[item.folderId];
//	}
	var msgs = item.msgs;
	if (!msgs) { //might not be loaded yet. In this case, tough luck - the tcon will be set as usual - based on searched folder, if set
		return false;
	}
	for (var i = 0; i < msgs.size(); i++) {
		var msg = msgs.get(i);
		var msgFolder = appCtxt.getById(msg.folderId);
		var msgFolderId = msgFolder && msgFolder.nId;

		if (!ZmMailList._SPECIAL_FOLDERS_HASH[msgFolderId]) {
			return false;
		}
	}
	return true;
};

ZmMailList.prototype._getTcon =
function(items, nFromFolderId) {

	//if all items are in a special folder (draft/trash/spam/sent) - then just allow the move without any restriction
	var allItemsSpecial = true;
	for (var i = 0; i < items.length; i++) {
		if (!this._isItemInSpecialFolder(items[i])) {
			allItemsSpecial = false;
			break;
		}
	}

	if (allItemsSpecial) {
		return "";
	}

	var fromFolderId = nFromFolderId || (this.search && this.search.folderId);
	var	fromFolder = fromFolderId && appCtxt.getById(fromFolderId);

	fromFolderId = fromFolder && fromFolder.nId;
	var tcon = [];
	for (i = 0; i < ZmMailList._SPECIAL_FOLDERS.length; i++) {
		var specialFolderId = ZmMailList._SPECIAL_FOLDERS[i];
		if (!fromFolder) {
			tcon.push(ZmFolder.TCON_CODE[specialFolderId]);
			continue;
		}
		// == instead of === since we compare numbers to strings and want conversion.
		if (fromFolderId == specialFolderId) {
			continue; //we're moving out of the special folder - allow  items under it
		}
        var specialFolder;
        // get folder object from qualified Ids for multi-account
        if (appCtxt.multiAccounts) {
            var acct  = items && items[0].getAccount && items[0].getAccount();
            var acctId = acct ? acct.id : appCtxt.getActiveAccount().id;
			var fId = [acctId, ":", specialFolderId].join("");
			specialFolder = appCtxt.getById(fId);
        }
		else {
            specialFolder = appCtxt.getById(specialFolderId);
        }

		if (!fromFolder.isChildOf(specialFolder)) {
			//if origin folder (searched folder) not descendant of the special folder - add the tcon code - don't move items from under the special folder.
			tcon.push(ZmFolder.TCON_CODE[specialFolderId]);
		}
	}
	return (tcon.length) ?  ("-" + tcon.join("")) : "";
};

// If this list is the result of a search that is constrained by the read
// status, and the user has marked all read in a folder, redo the search.
ZmMailList.prototype._folderTreeChangeListener = 
function(ev) {
	if (this.size() == 0) { return; }

	var flag = ev.getDetail("flag");
	var view = appCtxt.getCurrentViewId();
	var ctlr = appCtxt.getCurrentController();

	if (ev.event == ZmEvent.E_FLAGS && (flag == ZmItem.FLAG_UNREAD)) {
		if (this.type == ZmItem.CONV) {
			if ((view == ZmId.VIEW_CONVLIST) && ctlr._currentSearch.hasUnreadTerm()) {
				this._redoSearch(ctlr);
			}
		} else if (this.type == ZmItem.MSG) {
			if (view == ZmId.VIEW_TRAD && ctlr._currentSearch.hasUnreadTerm()) {
				this._redoSearch(ctlr);
			} else {
				var on = ev.getDetail("state");
				var organizer = ev.getDetail("item");
				var flaggedItems = [];
				var list = this.getArray();
				for (var i = 0; i < list.length; i++) {
					var msg = list[i];
					if ((organizer.type == ZmOrganizer.FOLDER && msg.folderId == organizer.id) ||
						(organizer.type == ZmOrganizer.TAG && msg.hasTag(organizer.id))) {
						msg.isUnread = on;
						flaggedItems.push(msg);
					}
				}
				ZmModel.notifyEach(flaggedItems, ZmEvent.E_FLAGS, {flags:[flag]});
			}
		}
	} else {
		ZmList.prototype._folderTreeChangeListener.call(this, ev);
	}
};

ZmMailList.prototype._tagTreeChangeListener = 
function(ev) {
	if (this.size() == 0) return;

	var flag = ev.getDetail("flag");
	if (ev.event == ZmEvent.E_FLAGS && (flag == ZmItem.FLAG_UNREAD)) {
		this._folderTreeChangeListener(ev);
	} else {
		ZmList.prototype._tagTreeChangeListener.call(this, ev);
	}
};
}

if (AjxPackage.define("zimbraMail.mail.view.object.ZmImageAttachmentObjectHandler")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmImageAttachmentObjectHandler = function() {
	ZmObjectHandler.call(this, ZmImageAttachmentObjectHandler.TYPE);
	this._imageHash = {};
}

ZmImageAttachmentObjectHandler.prototype = new ZmObjectHandler;
ZmImageAttachmentObjectHandler.prototype.constructor = ZmImageAttachmentObjectHandler;

ZmImageAttachmentObjectHandler.TYPE = "imageAttachemnt";

ZmImageAttachmentObjectHandler.THUMB_SIZE = 'width="320" height="240"';
ZmImageAttachmentObjectHandler.THUMB_SIZE_MAX = 320;
	
// already htmlencoded!!
ZmImageAttachmentObjectHandler.prototype._getHtmlContent =
function(html, idx, obj, context) {
	html[idx++] = obj; //AjxStringUtil.htmlEncode(obj, true);
	return idx;
}

ZmImageAttachmentObjectHandler.prototype.getToolTipText =
function(url, context) {
	var image = this._imageHash[context.url];
	if (!image) {
		image = {id:Dwt.getNextId()};
	}
	if (!image.el || (image.el.src !== context.url)) {
		this._imageHash[context.url] = image;
		this._preload(context.url, image.id);	
	}
	
	var el = document.getElementById(image.id);
	if (el && !image.el) {
		image.el = el;
	}
	if (image.el) {
		return image.el.xml || image.el.outerHTML;
	}
	return '<img id="'+ image.id +'" style="visibility:hidden;"/>';
};

ZmImageAttachmentObjectHandler.prototype.getActionMenu =
function(obj) {
	return null;
};

ZmImageAttachmentObjectHandler.prototype._preload =
function(url, id) {
	var tmpImage = new Image();
	tmpImage.onload = AjxCallback.simpleClosure(this._setSize, this, id, tmpImage);
	tmpImage.src = url;
};

ZmImageAttachmentObjectHandler.prototype._setSize =
function(id, tmpImage) {
	var elm = document.getElementById(id);
	if(elm) {
		var width = tmpImage.width;
		var height = tmpImage.height;
		if(width > ZmImageAttachmentObjectHandler.THUMB_SIZE_MAX && width >= height) {
			elm.width = ZmImageAttachmentObjectHandler.THUMB_SIZE_MAX;
		} else if (height > ZmImageAttachmentObjectHandler.THUMB_SIZE_MAX && height > width) {
			elm.height = ZmImageAttachmentObjectHandler.THUMB_SIZE_MAX;
		} else {
			elm.width = width;
			elm.width = height;
		}
		elm.src = tmpImage.src;
		elm.style.visibility = "visible";
	}
	tmpImage.onload = null;
	tmpImage = null;
};
}
if (AjxPackage.define("zimbraMail.share.zimlet.handler.ZmEmailObjectHandler")) {
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
 * @class
 * Internal handler for email addresses.
 *
 * @author Conrad Damon
 * @extends	ZmObjectHandler
 */
ZmEmailObjectHandler = function() {
	ZmObjectHandler.call(this, 'email');
};

ZmEmailObjectHandler.prototype = new ZmObjectHandler;
ZmEmailObjectHandler.prototype.constructor = ZmEmailObjectHandler;

ZmEmailObjectHandler.prototype.isZmEmailObjectHandler = true;
ZmEmailObjectHandler.prototype.toString = function() {
	return 'ZmEmailObjectHandler';
};

// email regex that recognizes mailto: links as well
// Reference: RFC 2234, 3986 and 6068
ZmEmailObjectHandler.RE = /\b(mailto:[ ]*)?([0-9a-zA-Z\u00C0-\u00ff]+[.&#!$%'*+-\/=?^_`{}|~])*[0-9a-zA-Z_-\u00C0-\u00ff]+@([-0-9a-zA-Z]+[.])+[a-zA-Z]{2,6}([\w\/_\.]*(\?[-0-9a-zA-Z_\.~%!$'\(\)\*\+,;:@=&]+)?)/gi;

ZmEmailObjectHandler.prototype.match = function(content, startIndex, objectMgr) {

	ZmEmailObjectHandler.RE.lastIndex = startIndex;
	var ret = ZmEmailObjectHandler.RE.exec(content);
	if (ret) {
		ret.context = ret;
		ret.objectMgr = objectMgr;  // obj mgr can get us back to containing view
	}
	return ret;
};

// See if a zimlet wants to handle email hover; if not, do the default thing
ZmEmailObjectHandler.prototype.hoverOver = function(object, context, x, y, span) {
	object = AjxStringUtil.parseMailtoLink(object).to;
	if (!appCtxt.notifyZimlets('onEmailHover', [ object, context, x, y, span ])) {
		ZmObjectHandler.prototype.hoverOver.apply(this, arguments);
	}
};

ZmEmailObjectHandler.prototype.getToolTipText = function(obj, context) {

	// Return a callback since we may need to make an async request to get data for the tooltip content.
	return new AjxCallback(this,
		function(callback) {
			appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, { address: AjxStringUtil.parseMailtoLink(obj).to }, callback);
		});
};

// Left-click starts a compose session
ZmEmailObjectHandler.prototype.clicked = function(spanElement, contentObjText, matchContext, ev) {

	var	ctlr = this._getController(matchContext),
		parts = AjxStringUtil.parseMailtoLink(contentObjText);

	var params = {
		action:         ZmOperation.NEW_MESSAGE,
		inNewWindow:    ctlr && ctlr._app && ctlr._app._inNewWindow(ev),
		toOverride:     parts.to,
		subjOverride:   AjxStringUtil.htmlEncode(parts.subject),
		extraBodyText:  AjxStringUtil.htmlEncode(parts.body),
		extraBodyTextIsExternal: Boolean(parts.body)
	};

	AjxDispatcher.run("Compose", params);
};

// Borrow the bubble action menu from the owning controller. Object framework doesn't explicitly call an
// action listener, so we do it here.
ZmEmailObjectHandler.prototype.getActionMenu = function(obj, span, context, ev) {

	var ctlr = this._getController(context);
	if (!ctlr) {
		return null;
	}

	ctlr._actionEv = ev;
	ctlr._actionEv.address = AjxStringUtil.parseMailtoLink(obj).to;
	ctlr._actionEv.handler = this;

	if (!this._actionMenu && ctlr._getBubbleActionMenu) {
		this._actionMenu = ctlr._getBubbleActionMenu();
	}

	ctlr._bubbleActionListener(ev, ctlr._actionEv.address);

	return this._actionMenu;
};

ZmEmailObjectHandler.prototype._getController = function(context) {

	var om = context && context.objectMgr,
		view = om && om.getView();

	return view && view._controller;
};

// Tell the object framework we're here. The 'email' type arg is probably not needed.
ZmObjectManager.registerHandler("ZmEmailObjectHandler", 'email', 4);
}

if (AjxPackage.define("zimbraMail.mail.view.ZmMailListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmMailListView = function(params) {

	if (arguments.length == 0) { return; }

	params.pageless = true;
	ZmListView.call(this, params);

	this._folderId = null;
	this._selectAllEnabled = true;

	this._isMultiColumn = this.isMultiColumn();
	if (!this._isMultiColumn) {
		this._normalClass = ZmMailListView.ROW_DOUBLE_CLASS;
	}

	this._disallowSelection[ZmItem.F_READ] = true;
};

ZmMailListView.prototype = new ZmListView;
ZmMailListView.prototype.constructor = ZmMailListView;

ZmMailListView.prototype.isZmMailListView = true;
ZmMailListView.prototype.toString = function() { return "ZmMailListView"; };

// Consts
ZmMailListView.ROW_DOUBLE_CLASS	= "RowDouble";

ZmMailListView.FIRST_ITEM	= -1;
ZmMailListView.LAST_ITEM	= -2;

ZmMailListView.SINGLE_COLUMN_SORT = [
	{field:ZmItem.F_FROM,	msg:"from"		},
	{field:ZmItem.F_TO,		msg:"to"		},
	{field:ZmItem.F_SUBJECT,msg:"subject"	},
	{field:ZmItem.F_SIZE,	msg:"size"		},
	{field:ZmItem.F_DATE,	msg:"date"		},
    {field:ZmItem.F_ATTACHMENT, msg:"attachment" },
    {field:ZmItem.F_FLAG, msg:"flag" },
    {field:ZmItem.F_PRIORITY, msg:"priority" },
	{field:ZmItem.F_READ, msg:"readUnread" }
];

ZmMailListView.SORTBY_HASH = [];
ZmMailListView.SORTBY_HASH[ZmSearch.NAME_ASC] = {field:ZmItem.F_FROM, msg:"from"};
ZmMailListView.SORTBY_HASH[ZmSearch.NAME_DESC] = {field:ZmItem.F_FROM, msg:"from"};
ZmMailListView.SORTBY_HASH[ZmSearch.SUBJ_ASC] = {field:ZmItem.F_SUBJECT, msg:"subject"};
ZmMailListView.SORTBY_HASH[ZmSearch.SUBJ_DESC] = {field:ZmItem.F_SUBJECT, msg:"subject"};
ZmMailListView.SORTBY_HASH[ZmSearch.SIZE_ASC] = {field:ZmItem.F_SIZE, msg:"size"};
ZmMailListView.SORTBY_HASH[ZmSearch.SIZE_DESC] = {field:ZmItem.F_SIZE, msg:"size"};
ZmMailListView.SORTBY_HASH[ZmSearch.DATE_ASC] = {field:ZmItem.F_DATE, msg:"date"};
ZmMailListView.SORTBY_HASH[ZmSearch.DATE_DESC] = {field:ZmItem.F_DATE, msg:"date"};
ZmMailListView.SORTBY_HASH[ZmSearch.ATTACH_ASC] = {field:ZmItem.F_ATTACHMENT, msg:"attachment"};
ZmMailListView.SORTBY_HASH[ZmSearch.ATTACH_DESC] = {field:ZmItem.F_ATTACHMENT, msg:"attachment"};
ZmMailListView.SORTBY_HASH[ZmSearch.FLAG_ASC] = {field:ZmItem.F_FLAG, msg:"flag"};
ZmMailListView.SORTBY_HASH[ZmSearch.FLAG_DESC] = {field:ZmItem.F_FLAG, msg:"flag"};
ZmMailListView.SORTBY_HASH[ZmSearch.MUTE_ASC] = {field:ZmItem.F_MUTE, msg:"mute"};
ZmMailListView.SORTBY_HASH[ZmSearch.MUTE_DESC] = {field:ZmItem.F_MUTE, msg:"mute"};
ZmMailListView.SORTBY_HASH[ZmSearch.READ_ASC] = {field:ZmItem.F_READ, msg:"readUnread"};
ZmMailListView.SORTBY_HASH[ZmSearch.READ_DESC] = {field:ZmItem.F_READ, msg:"readUnread"};
ZmMailListView.SORTBY_HASH[ZmSearch.PRIORITY_ASC] = {field:ZmItem.F_PRIORITY, msg:"priority"};
ZmMailListView.SORTBY_HASH[ZmSearch.PRIORITY_DESC] = {field:ZmItem.F_PRIORITY, msg:"priority"};
ZmMailListView.SORTBY_HASH[ZmSearch.RCPT_ASC] = {field:ZmItem.F_TO, msg:"to"};
ZmMailListView.SORTBY_HASH[ZmSearch.RCPT_DESC] = {field:ZmItem.F_TO, msg:"to"};


// Public methods


// Reset row style
ZmMailListView.prototype.markUIAsMute =
function(item) {
    //Removed
};

// Reset row style
ZmMailListView.prototype.markUIAsRead =
function(item, oldValue) {
	this._setImage(item, ZmItem.F_READ, item.getReadIcon(), this._getClasses(ZmItem.F_READ));

	var newCssClass = this._getRowClass(item);
	var oldCssClass = this._getRowClassValue(oldValue);
	var oldCssClass = this._getRowClassValue(oldValue);
	var row = this._getElement(item, ZmItem.F_ITEM_ROW);
	if (row) {
		if (oldCssClass) {
			$(row).removeClass(oldCssClass);
		}
		if (newCssClass) {
			$(row).addClass(newCssClass);
		}
	}
	this._controller._checkKeepReading();
};

ZmMailListView.prototype.set =
function(list, sortField) {

	var s = this._controller._activeSearch && this._controller._activeSearch.search;
	this._folderId = s && s.folderId;
    if (this._folderId) {
        this._group = this.getGroup(this._folderId);
    }

	var sortBy = s && s.sortBy;
	if (sortBy) {
		var column;
		if (sortBy == ZmSearch.SUBJ_DESC || sortBy == ZmSearch.SUBJ_ASC) {
			column = ZmItem.F_SUBJECT;
		} else if (sortBy == ZmSearch.DATE_DESC || sortBy == ZmSearch.DATE_ASC) {
			column = ZmItem.F_DATE;
		} else if (sortBy == ZmSearch.NAME_DESC || sortBy == ZmSearch.NAME_ASC) {
			column = ZmItem.F_FROM;
		} else if (sortBy == ZmSearch.SIZE_DESC || sortBy == ZmSearch.SIZE_ASC) {
			column = ZmItem.F_SIZE;
		}
		if (column) {
			var sortByAsc = (sortBy == ZmSearch.SUBJ_ASC || sortBy == ZmSearch.DATE_ASC || sortBy == ZmSearch.NAME_ASC || sortBy == ZmSearch.SIZE_ASC);
			this.setSortByAsc(column, sortByAsc);
		}
	}


    ZmListView.prototype.set.apply(this, arguments);

    this.markDefaultSelection(list);
};


ZmMailListView.prototype.markDefaultSelection =
function(list) {
	if(window.defaultSelection) {
		var sel = [];
		var a = list.getArray();
		for (var i in a) {
			if (window.defaultSelection[a[i].id]) {
				sel.push(a[i]);
			}
		}
		if (sel.length > 0) {
			this.setSelectedItems(sel);
		}
		window.defaultSelection = null;
	}
};

ZmMailListView.prototype.handleKeyAction =
function(actionCode, ev) {

	switch (actionCode) {
		case DwtKeyMap.SELECT_ALL:
			ZmListView.prototype.handleKeyAction.apply(this, arguments);
			var ctlr = this._controller;
			ctlr._resetOperations(ctlr.getCurrentToolbar(), this.getSelectionCount());
			return true;

		case DwtKeyMap.SELECT_NEXT:
		case DwtKeyMap.SELECT_PREV:
			// Block widget shortcut for space since we want to handle it as app shortcut.
			if (ev.charCode === 32) {
				return false;
			}
			this._controller.lastListAction = actionCode;
		
		default:
			return ZmListView.prototype.handleKeyAction.apply(this, arguments);
	}
};

ZmMailListView.prototype.getTitle =
function() {
	var search = this._controller._activeSearch ? this._controller._activeSearch.search : null;
	return search ? search.getTitle() : "";
};

ZmMailListView.prototype.replenish = 
function(list) {
	DwtListView.prototype.replenish.call(this, list);
	this._resetColWidth();
};

ZmMailListView.prototype.resetSize =
function(newWidth, newHeight) {
	this.setSize(newWidth, newHeight);
	var margins = this.getMargins();
	var listInsets = Dwt.getInsets(this._parentEl);

	if (newWidth !== Dwt.DEFAULT) {
		newWidth -= margins.left + margins.right;
		newWidth -= listInsets.left + listInsets.right;
	}

	if (newHeight !== Dwt.DEFAULT) {
		newHeight -= Dwt.getOuterSize(this._listColDiv).y;
		newHeight -= margins.top + margins.bottom;
		newHeight -= listInsets.top + listInsets.bottom;
	}

	Dwt.setSize(this._parentEl, newWidth, newHeight);
};

ZmMailListView.prototype.calculateMaxEntries =
function() {
	return (Math.floor(this._parentEl.clientHeight / (this._isMultiColumn ? 20 : 40)) + 5);
};

/**
 * Returns true if the reading pane is turned off or set to bottom. We use this
 * call to tell the UI whether to re-render the listview with multiple columns
 * or a single column (for right-pane).
 */
ZmMailListView.prototype.isMultiColumn =
function() {
	return !this._controller.isReadingPaneOnRight();
};


ZmMailListView.prototype._getExtraStyle =
function(item,start,end) {
	if (!appCtxt.get(ZmSetting.COLOR_MESSAGES)) {
		return null;
	}
	var color = item.getColor && item.getColor();
	if (!color) {
		return null;
	}
	start = start || 0.75;
	end = end || 0.25;

	return Dwt.createLinearGradientCss(AjxColor.lighten(color, start), AjxColor.lighten(color, end), "v");
};


ZmMailListView.prototype._getAbridgedContent =
function(item, colIdx) {
	// override me
};

ZmMailListView.prototype._getListFlagsWrapper =
function(htmlArr, idx, item) {
	htmlArr[idx++] = "<div class='ZmListFlagsWrapper'";
	//compute the start and end of gradient based on height of this div and its position
	var extraStyle = this._getExtraStyle(item,0.49,0.33);
	if (extraStyle) {
		htmlArr[idx++] = " style='" + extraStyle + ";'>";
	} else {
		htmlArr[idx++] = ">";
	}
	return idx;
};

//apply colors to from and subject cells via zimlet
ZmMailListView.prototype._getStyleViaZimlet =
function(field, item) {
	if (field != "fr" && field != "su" && field != "st")
		return "";

	if (appCtxt.zimletsPresent() && this._ignoreProcessingGetMailCellStyle == undefined) {
		if (!this._zimletMgr) {
			this._zimletMgr = appCtxt.getZimletMgr();//cache zimletMgr
		}
		var style = this._zimletMgr.processARequest("getMailCellStyle", item, field);
		if (style != undefined && style != null) {
			return style;//set style
		} else if (style == null && this._zimletMgr.isLoaded()) {
			//zimlet not available or disabled, set _ignoreProcessingGetMailCellStyle to true
			//to ignore this entire section for this session
			this._ignoreProcessingGetMailCellStyle = true;
		}
	}
	return "";
};


ZmMailListView.prototype._getAbridgedCell =
function(htmlArr, idx, item, field, colIdx, width, attr, classes) {
	var params = {};
	classes = classes || [];

	/* TODO: Find an alternate way for Zimlets to add styles to the field.
	htmlArr[idx++] = this._getStyleViaZimlet(field, item);
	*/

	var className = this._getCellClass(item, field, params);
	if (className) {
		classes.push(className);
	}
	idx = this._getCellContents(htmlArr, idx, item, field, colIdx, params, classes);

	return idx;
};

ZmMailListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params, classes) {
	if (field == ZmItem.F_ACCOUNT) {
		idx = this._getImageHtml(htmlArr, idx, item.getAccount().getIcon(), this._getFieldId(item, field), classes);
	} 
	else if (field == ZmItem.F_DATE) {
		var displayTime = appCtxt.get(ZmSetting.DISPLAY_TIME_IN_MAIL_LIST);
		var date = AjxDateUtil.computeDateStr(params.now || new Date(), item.date, displayTime);
		htmlArr[idx++] = "<div id='";
		htmlArr[idx++] = this._getFieldId(item, field);
		htmlArr[idx++] = "' ";
		if (!this.isMultiColumn()) {
			//compute the start and end of gradient based on height of this div and its position
			var extraStyle = this._getExtraStyle(item,0.69,0.55);
			if (extraStyle) {
				htmlArr[idx++] = " style='" + extraStyle + "'";
			}
		}
		htmlArr[idx++] = AjxUtil.getClassAttr(classes);
		htmlArr[idx++] = ">" + date + "</div>";
	}
	else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}

	return idx;
};

/**
 * Called by the controller whenever the reading pane preference changes
 * 
 * @private
 */
ZmMailListView.prototype.reRenderListView =
function() {
	var isMultiColumn = this.isMultiColumn();
	if (isMultiColumn != this._isMultiColumn) {
		this._saveState({selection:true, focus:true, scroll:true, expansion:true});
		this._isMultiColumn = isMultiColumn;
		this.headerColCreated = false;
		this._headerList = this._getHeaderList();
		this._rowHeight = null;
		this._normalClass = isMultiColumn ? DwtListView.ROW_CLASS : ZmMailListView.ROW_DOUBLE_CLASS;
		var list = this.getList() || (new AjxVector());
        this.clearGroupSections(this._folderId);
		this.set(list.clone());
		this._restoreState();
		this._resetFromColumnLabel();
	}
};

// Private / protected methods

ZmMailListView.prototype._getLabelForField =
function(item, field) {
	switch (field) {
	case ZmItem.F_READ:
		// usually included in the status tooltip
		break;

	case ZmItem.F_FLAG:
		return item.isFlagged ? ZmMsg.flagged : '';

	case ZmItem.F_ATTACHMENT:
		return item.hasAttach && ZmMsg.hasAttachment;

	case ZmItem.F_STATUS:
		return item.getStatusTooltip();

	case ZmItem.F_SUBJECT:
		return item.subject || ZmMsg.noSubject;

	case ZmItem.F_PRIORITY:
		if (item.isLowPriority) {
			return ZmMsg.priorityLow;
		} else if (item.isHighPriority) {
			return ZmMsg.priorityHigh;
		}

		break;

	case ZmItem.F_TAG:
		if (item.tags.length > 0) {
			var tags = item.tags.join(' & ');
			return AjxMessageFormat.format(ZmMsg.taggedAs, [tags]);
		}

		break;

	case ZmItem.F_DATE:
		return AjxDateUtil.computeWordyDateStr(new Date(), item.date);

	case ZmItem.F_FROM:
		var addrtype = this._isOutboundFolder() ?
			AjxEmailAddress.TO : AjxEmailAddress.FROM;
		var participants = item.getAddresses(addrtype) || item.participants || new AjxVector();
		var addrs = []

		if (participants.size() <= 0) {
			return AjxStringUtil.stripTags(ZmMsg.noRecipients);
		}

		for (var i = 0; i < Math.min(participants.size(), 3); i++) {
			addrs.push(participants.get(i).toString(true, true));
		}

		return addrs.join(", ");

	case ZmItem.F_SIZE:
		if (item.size) {
			return AjxUtil.formatSize(item.size);
		}

		break;
	}

	return ZmListView.prototype._getLabelForField.apply(this, arguments);
};

ZmMailListView.prototype._initHeaders =
function() {
	if (!this._headerInit) {
		this._headerInit = {};
		this._headerInit[ZmItem.F_SELECTION]	= {icon:"CheckboxUnchecked", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.selection, precondition:ZmSetting.SHOW_SELECTION_CHECKBOX, cssClass:"ZmMsgListColSelection"};
		this._headerInit[ZmItem.F_FLAG]			= {icon:"FlagRed", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.flag, sortable:ZmItem.F_FLAG, noSortArrow:true, precondition:ZmSetting.FLAGGING_ENABLED, cssClass:"ZmMsgListColFlag"};
		this._headerInit[ZmItem.F_PRIORITY]		= {icon:"PriorityHigh_list", width:ZmListView.COL_WIDTH_NARROW_ICON, name:ZmMsg.priority, sortable:ZmItem.F_PRIORITY, noSortArrow:true, precondition:ZmSetting.MAIL_PRIORITY_ENABLED, cssClass:"ZmMsgListColPriority"};
		this._headerInit[ZmItem.F_TAG]			= {icon:"Tag", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.tag, precondition:ZmSetting.TAGGING_ENABLED, cssClass:"ZmMsgListColTag"};
		this._headerInit[ZmItem.F_ACCOUNT]		= {icon:"AccountAll", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.account, noRemove:true, resizeable:true, cssClass:"ZmMsgListColAccount"};
		this._headerInit[ZmItem.F_STATUS]		= {icon:"MsgStatus", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.status, cssClass:"ZmMsgListColStatus"};
		this._headerInit[ZmItem.F_MUTE]			= {icon:"Mute", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.muteUnmute, sortable: false /*ZmItem.F_MUTE*/, noSortArrow:true, cssClass:"ZmMsgListColMute"}; //todo - once server supports readAsc/readDesc sort orders, uncomment the sortable
		this._headerInit[ZmItem.F_READ]			= {icon:"MsgUnread", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.readUnread, sortable: ZmItem.F_READ, noSortArrow:true, cssClass:"ZmMsgListColRead"};
		this._headerInit[ZmItem.F_FROM]			= {text:ZmMsg.from, width:ZmMsg.COLUMN_WIDTH_FROM_MLV, resizeable:true, sortable:ZmItem.F_FROM, cssClass:"ZmMsgListColFrom"};
		this._headerInit[ZmItem.F_ATTACHMENT]	= {icon:"Attachment", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.attachment, sortable:ZmItem.F_ATTACHMENT, noSortArrow:true, cssClass:"ZmMsgListColAttachment"};
		this._headerInit[ZmItem.F_SUBJECT]		= {text:ZmMsg.subject, sortable:ZmItem.F_SUBJECT, noRemove:true, resizeable:true, cssClass:"ZmMsgListColSubject"};
		this._headerInit[ZmItem.F_FOLDER]		= {text:ZmMsg.folder, width:ZmMsg.COLUMN_WIDTH_FOLDER, resizeable:true, cssClass:"ZmMsgListColFolder"};
		this._headerInit[ZmItem.F_SIZE]			= {text:ZmMsg.size, width:ZmMsg.COLUMN_WIDTH_SIZE, sortable:ZmItem.F_SIZE, resizeable:true, cssClass:"ZmMsgListColSize"};
		var column_width_date = appCtxt.get(ZmSetting.DISPLAY_TIME_IN_MAIL_LIST) ? ZmMsg.COLUMN_WIDTH_DATE_TIME : ZmMsg.COLUMN_WIDTH_DATE;
		this._headerInit[ZmItem.F_DATE]			= {text:ZmMsg.received, width:column_width_date, sortable:ZmItem.F_DATE, resizeable:true, cssClass:"ZmMsgListColDate"};
		this._headerInit[ZmItem.F_SORTED_BY]	= {text:AjxMessageFormat.format(ZmMsg.arrangedBy, ZmMsg.date), sortable:ZmItem.F_SORTED_BY, resizeable:false};
	}
};

ZmMailListView.prototype._getLabelFieldList =
function() {
	var headers = [];
	headers.push(ZmItem.F_SELECTION);
	if (appCtxt.get(ZmSetting.FLAGGING_ENABLED)) {
		headers.push(ZmItem.F_FLAG);
	}
	headers.push(
		ZmItem.F_PRIORITY,
		ZmItem.F_TAG,
		ZmItem.F_READ,
		ZmItem.F_STATUS,
		ZmItem.F_FROM,
		ZmItem.F_ATTACHMENT,
		ZmItem.F_SUBJECT,
		ZmItem.F_FOLDER,
		ZmItem.F_SIZE
	);
	if (appCtxt.accountList.size() > 2) {
		headers.push(ZmItem.F_ACCOUNT);
	}
	headers.push(ZmItem.F_DATE);

	return headers;
}

ZmMailListView.prototype._getHeaderList =
function() {
	var headers;
	if (this.isMultiColumn()) {
		headers = this._getLabelFieldList();
	}
	else {
		headers = [
			ZmItem.F_SELECTION,
			ZmItem.F_SORTED_BY
		];
	}

	return this._getHeaders(this._mode, headers);
};

ZmMailListView.prototype._getHeaders =
function(viewId, headerList) {

	this._initHeaders();
	var hList = [];

	this._defaultCols = headerList.join(ZmListView.COL_JOIN);
	var isMultiColumn = !this._controller.isReadingPaneOnRight();
	var userHeaders = isMultiColumn && appCtxt.get(ZmSetting.LIST_VIEW_COLUMNS, viewId);
	var headers = headerList;
	if (userHeaders && isMultiColumn) {
		headers = userHeaders.split(ZmListView.COL_JOIN);
		//we have to do it regardless of the size of headers and headerList, as items could be added and removed, masking each other as far as length (previous code compared length)
		headers = this._normalizeHeaders(headers, headerList);
	}
    // adding account header in _normalizeHeader method
    // sometimes doesn't work since we check for array length which is bad.

    // in ZD in case of All-Mailbox search always make sure account header is added to header array
    if(appCtxt.isOffline && appCtxt.getSearchController().searchAllAccounts && isMultiColumn) {
        var isAccHdrEnabled = false;
        for (var k=0; k< headers.length; k++) {
            if(headers[k] == ZmItem.F_ACCOUNT) {
                isAccHdrEnabled = true;
            }
        }
        if(!isAccHdrEnabled) {
            headers.splice(headers.length - 1, 0, ZmId.FLD_ACCOUNT);
        }

    }

	for (var i = 0, len = headers.length; i < len; i++) {
		var header = headers[i];
		var field = header.substr(0, 2);
		var hdrParams = this._headerInit[field];
		if (!hdrParams) { continue; }
		var pre = hdrParams.precondition;
		if (!pre || appCtxt.get(pre)) {
			hdrParams.field = field;
			// multi-account, account header is always initially invisible
			// unless user is showing global inbox. Ugh.
			if (appCtxt.multiAccounts &&
				appCtxt.accountList.size() > 2 &&
				appCtxt.get(ZmSetting.OFFLINE_SHOW_ALL_MAILBOXES) &&
				header.indexOf(ZmItem.F_ACCOUNT) != -1)
			{
				hdrParams.visible = true;
				this._showingAccountColumn = true;
			} else {
				var visible = (appCtxt.multiAccounts && header == ZmItem.F_ACCOUNT && !userHeaders)
					? false : (header.indexOf("*") == -1);
                if (!userHeaders && isMultiColumn) {
                    //this is the default header
                    if (typeof hdrParams.visible === "undefined") {
                        //if the visible header is not set than use the computed value
                        hdrParams.visible = visible;
                    }
                } else {
                    hdrParams.visible = visible;
                }
			}
			hList.push(new DwtListHeaderItem(hdrParams));
		}
	}

	return hList;
};

/**
 * Cleans up the list of columns in various ways:
 * 		- Add new fields in penultimate position
 * 		- Remove duplicate fields
 * 		- Remove fields that aren't valid for the view
 *
 * @param userHeaders	[Array]		user-defined set of column headers
 * @param headerList	[Array]		default set of column headers
 */
ZmMailListView.prototype._normalizeHeaders =
function(userHeaders, headerList) {

	// strip duplicates and invalid headers
	var allHeaders = AjxUtil.arrayAsHash(headerList);
	var headers = [], used = {}, starred = {};
	for (var i = 0; i < userHeaders.length; i++) {
		var hdr = userHeaders[i];
		var idx = hdr.indexOf("*");
		if (idx != -1) {
			hdr = hdr.substr(0, idx);
			starred[hdr] = true;
		}
		if (allHeaders[hdr] && !used[hdr]) {
			headers.push(hdr);
			used[hdr] = true;
		}
	}

	// add columns this account doesn't know about
	for (var j = 0; j < headerList.length; j++) {
		var hdr = headerList[j];
		if (!used[hdr]) {
			// if account field, add it but initially invisible
			if (hdr == ZmId.FLD_ACCOUNT) {
				starred[ZmItem.F_ACCOUNT] = true;
			}
			if (hdr == ZmId.FLD_SELECTION) {
				//re-add selection checkbox at the beginning (no idea why the rest is added one before last item, but not gonna change it for now
				headers.unshift(hdr); //unshift adds item at the beginning
			}
			else {
				headers.splice(headers.length - 1, 0, hdr);
			}
		}
	}

	// rebuild the list, preserve invisibility
	var list = AjxUtil.map(headers, function(hdr) {
		return starred[hdr] ? hdr + "*" : hdr; });

	// save implicit pref with newly added column
	appCtxt.set(ZmSetting.LIST_VIEW_COLUMNS, list.join(ZmListView.COL_JOIN), this.view);
	return list;
};

ZmMailListView.prototype.createHeaderHtml =
function(defaultColumnSort) {

	var activeSortBy = this.getActiveSearchSortBy();
	// for multi-account, hide/show Account column header depending on whether
	// user is search across all accounts or not.
	if (appCtxt.multiAccounts) {
		var searchAllAccounts = appCtxt.getSearchController().searchAllAccounts;
		if (this._headerHash &&
			((this._showingAccountColumn && !searchAllAccounts) ||
			(!this._showingAccountColumn && searchAllAccounts)))
		{
			var accountHeader = this._headerHash[ZmItem.F_ACCOUNT];
			if (accountHeader) {
				accountHeader._visible = this._showingAccountColumn = searchAllAccounts;
				this.headerColCreated = false;
			}
		}
	}

	if (this._headerList && !this.headerColCreated) {
		var rpLoc = this._controller._getReadingPanePref();
		if (rpLoc == ZmSetting.RP_RIGHT && this._controller._itemCountText[rpLoc]) {
			this._controller._itemCountText[rpLoc].dispose();
		}

		if (activeSortBy && ZmMailListView.SORTBY_HASH[activeSortBy]) {
			defaultColumnSort = ZmMailListView.SORTBY_HASH[activeSortBy].field;
		}
		DwtListView.prototype.createHeaderHtml.call(this, defaultColumnSort, this._isMultiColumn);

		if (rpLoc == ZmSetting.RP_RIGHT) {
			var td = document.getElementById(this._itemCountTextTdId);
			if (td) {
				var textId = DwtId.makeId(this.view, rpLoc, "text");
				var textDiv = document.getElementById(textId);
				if (!textDiv) {
					var text = this._controller._itemCountText[rpLoc] =
							   new DwtText({parent:this, className:"itemCountText", id:textId});
					td.appendChild(text.getHtmlElement());
				}
			}
		}
	}

	// Setting label on date column
	this._resetFromColumnLabel();
	var col = Dwt.byId(this._currentColId);
    var headerCol = this._isMultiColumn ? this._headerHash[ZmItem.F_DATE] :
		            (col && this.getItemFromElement(col)) || (this._headerHash && this._headerHash[ZmItem.F_SORTED_BY]) || null;
	if (headerCol) {
		var colLabel = "";
		var column;
		if (this._isMultiColumn) {
			// set the received column name based on search folder
			colLabel = ZmMsg.received;
			if (this._isOutboundFolder()) {
				colLabel = (this._folderId == ZmFolder.ID_DRAFTS) ? ZmMsg.lastSaved : ZmMsg.sentAt;
				colLabel = "&nbsp;" + colLabel;
			}
		}
		else if (activeSortBy && ZmMailListView.SORTBY_HASH[activeSortBy]){
			var msg = ZmMailListView.SORTBY_HASH[activeSortBy].msg;
			var field = ZmMailListView.SORTBY_HASH[activeSortBy].field;
			if (msg) {
				colLabel = AjxMessageFormat.format(ZmMsg.arrangedBy, ZmMsg[msg]);
			}
			if (field) {
				headerCol._sortable = field;
			}
		}

		//Set column label; for multi-column this changes the received text. For single column this sets to the sort by text
		var colSpan = document.getElementById(DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, headerCol._field));
		if (colSpan) {
			colSpan.innerHTML = colLabel;
		}
		if (this._colHeaderActionMenu) {
			if (!this._isMultiColumn) {
				var mi = this._colHeaderActionMenu.getMenuItem(field);
				if (mi) {
					mi.setChecked(true, true);
				}
			}
		}

		// Now that we've created headers, we can update the View menu so that it doesn't get created before headers,
		// since we want to know the header IDs when we create the Display submenu
		var ctlr = this._controller,
			viewType = ctlr.getCurrentViewType();
		ctlr._updateViewMenu(viewType);
		ctlr._updateViewMenu(ctlr._getReadingPanePref());
		ctlr._updateViewMenu(appCtxt.get(ZmSetting.CONVERSATION_ORDER));
	}
};

ZmMailListView.prototype._createHeader =
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
		htmlArr[idx++] = "'></td></tr></table></td>";

		return idx;
	} else {
		return DwtListView.prototype._createHeader.apply(this, arguments);
	}
};

ZmMailListView.prototype._resetColWidth =
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

ZmMailListView.prototype._mouseOverAction =
function(mouseEv, div) {

	var type = this._getItemData(div, "type");
	if (type == DwtListView.TYPE_HEADER_ITEM){
		var hdr = this.getItemFromElement(div);
		if (hdr && this.sortingEnabled && hdr._sortable && hdr._sortable == ZmItem.F_FROM) {
			if (this._isOutboundFolder()) {
				div.className = "DwtListView-Column DwtListView-ColumnHover";
				return true;
			}
		}
	}

	return ZmListView.prototype._mouseOverAction.apply(this, arguments);
};

ZmMailListView.prototype._columnClicked =
function(clickedCol, ev) {

	var hdr = this.getItemFromElement(clickedCol);
	var group = this.getGroup(this._folderId);
	if (group && hdr && hdr._sortable) {
        var groupId = ZmMailListGroup.getGroupIdFromSortField(hdr._sortable, this.type);
		if (groupId != group.id) {
            this.setGroup(groupId);
		}
    }

	ZmListView.prototype._columnClicked.call(this, clickedCol, ev);
};

ZmMailListView.prototype._resetFromColumnLabel =
function() {

	// set the from column name based on query string
	var headerCol = this._headerHash[ZmItem.F_FROM];
	if (headerCol) { //this means viewing pane on bottom
		var colLabel = this._isOutboundFolder() ? ZmMsg.to : ZmMsg.from;
        //bug:1108 & 43789#c19 since sort-by-rcpt affects server performance avoid using in convList instead used in outbound folder
        headerCol._sortable = this._isOutboundFolder() ? ZmItem.F_TO : ZmItem.F_FROM;

        var fromColSpan = document.getElementById(DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, headerCol._field));
		if (fromColSpan) {
			fromColSpan.innerHTML = "&nbsp;" + colLabel;
		}
		var item = this._colHeaderActionMenu ? this._colHeaderActionMenu.getItem(headerCol._index) : null;
		if (item) {
			item.setText(colLabel);
		}
	}
};

/**
 * Returns true if the given folder is for outbound mail.
 *
 * @param folder
 *
 * @private
 */
ZmMailListView.prototype._isOutboundFolder =
function(folder) {
	folder = folder || (this._folderId && appCtxt.getById(this._folderId));
	return (folder && folder.isOutbound());
};

/**
 * Returns the current folder
 *
 */
ZmMailListView.prototype.getFolder =
function() {
	return this._folderId && appCtxt.getById(this._folderId);
};

ZmMailListView.prototype.useListElement =
function() {
	return true;
}

ZmMailListView.prototype._getRowClass =
function(item) {
	var classes = this._isMultiColumn ? ["DwtMsgListMultiCol"]:["ZmRowDoubleHeader"];
	var value = this._getRowClassValue(item.isUnread && !item.isMute);
	if (value) {
		classes.push(value);
	}
	return classes.join(" ");
};

ZmMailListView.prototype._getRowClassValue =
	function(value) {
		return value ? "Unread" : null;
	};

ZmMailListView.prototype._getCellId =
function(item, field) {
	if (field == ZmItem.F_DATE) {
		return null;
	}
	else if (field == ZmItem.F_SORTED_BY) {
		return this._getFieldId(item, field);
	}
	else {
		return ZmListView.prototype._getCellId.apply(this, arguments);
	}
};

ZmMailListView.prototype._getHeaderToolTip =
function(field, itemIdx) {

	var isOutboundFolder = this._isOutboundFolder();
	if (field == ZmItem.F_FROM && isOutboundFolder) {
	   return ZmMsg.to;
	}
	if (field == ZmItem.F_STATUS) {
		return ZmMsg.messageStatus;
	}
    if (field == ZmItem.F_MUTE) {
		return ZmMsg.muteUnmute;
	}
	if (field == ZmItem.F_READ) {
		return ZmMsg.readUnread;
	}

	return ZmListView.prototype._getHeaderToolTip.call(this, field, itemIdx, isOutboundFolder);
};

ZmMailListView.prototype._getToolTip =
function(params) {

	var tooltip,
		field = params.field,
		item = params.item,
		matchIndex = params.match && params.match.participant || 0;

	if (!item) {
		return;
	}

	if (field === ZmItem.F_STATUS) {
		tooltip = item.getStatusTooltip();
	}
	else if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) && (field === ZmItem.F_FROM || field === ZmItem.F_PARTICIPANT)) {
		var addr;
		if (!item.getAddress) {
			return;
		}
		if (field === ZmItem.F_FROM) {
			if (this._isOutboundFolder()) {
				// this needs to be in sync with code that sets field IDs in ZmMailMsgListView::_getCellContents
				var addrs = item.getAddresses(AjxEmailAddress.TO).getArray();
				addr = addrs[matchIndex];
			}
			else {
				addr = item.getAddress(AjxEmailAddress.FROM);
			}
		}
		else if (field === ZmItem.F_PARTICIPANT) {
			addr = item.participants && item.participants.get(matchIndex);
		}
		if (!addr) {
			return;
		}
		
		var ttParams = {
			address:	addr,
			ev:			params.ev
		}
		var ttCallback = new AjxCallback(this,
			function(callback) {
				appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, ttParams, callback);
			});
		tooltip = { callback:ttCallback };
	}
	else if (field === ZmItem.F_SUBJECT || field === ZmItem.F_FRAGMENT) {
		var invite = (item.type === ZmItem.MSG) && item.isInvite() && item.invite;
		if (invite && item.needsRsvp()) {
			tooltip = invite.getToolTip();
		}
		else if (invite && !invite.isEmpty()) {
			var bp = item.getBodyPart();
			tooltip = bp && ZmInviteMsgView.truncateBodyContent(bp.getContent(), true);
			tooltip = AjxStringUtil.stripTags(tooltip);
		}
		else {
			tooltip = AjxStringUtil.htmlEncode(item.fragment || (item.hasAttach ? "" : ZmMsg.fragmentIsEmpty));
        }
        // Strip surrounding whitespace from the tooltip
        tooltip = AjxStringUtil.trim(tooltip, false, "\\s");
	}
	else if (field === ZmItem.F_FOLDER) {
		var folder = appCtxt.getById(item.folderId);
		if (folder && folder.parent) {
			var path = folder.getPath();
			if (path !== folder.getName()) {
				tooltip = path;
			}
		}
	}
	else if (field === ZmItem.F_ACCOUNT) {
		tooltip = item.getAccount().getDisplayName();
	}
	else {
		tooltip = ZmListView.prototype._getToolTip.apply(this, arguments);
	}
    return tooltip;
};

/**
 * (override of ZmListView to add hooks to zimletMgr)
 * Creates a TD and its content for a single field of the given item. Subclasses
 * may override several dependent functions to customize the TD and its content.
 *
 * @param htmlArr	[array]		array that holds lines of HTML
 * @param idx		[int]		current line of array
 * @param item		[object]	item to render
 * @param field		[constant]	column identifier
 * @param colIdx	[int]		index of column (starts at 0)
 * @param params	[hash]*		hash of optional params
 * 
 * @private
 */
ZmMailListView.prototype._getCell =
function(htmlArr, idx, item, field, colIdx, params) {
	var className = this._getCellClass(item, field, params, colIdx);

	/* TODO Identify a way for Zimlets to add styles to fields.
	var cellId = this._getCellId(item, field, params);
	var idText = cellId ? [" id=", "'", cellId, "'"].join("") : "";
	var width = this._getCellWidth(colIdx, params);
	var widthText = width ? ([" width=", width].join("")) : (" width='100%'");
	var classText = className ? [" class=", className].join("") : "";
	var alignValue = this._getCellAlign(colIdx, params);
	var alignText = alignValue ? [" align=", alignValue].join("") : "";
	var otherText = (this._getCellAttrText(item, field, params)) || "";
	var attrText = [idText, widthText, classText, alignText, otherText].join(" ");

	htmlArr[idx++] = "<td";
	htmlArr[idx++] = this._getStyleViaZimlet(field, item);
	htmlArr[idx++] = attrText ? (" " + attrText) : "";
	htmlArr[idx++] = ">";

	idx = this._getCellContents(htmlArr, idx, item, field, colIdx, params);
	htmlArr[idx++] = "</td>";*/

	idx = this._getCellContents(htmlArr, idx, item, field, colIdx, params, [className || ""]);

	return idx;
};

ZmMailListView.prototype._getCellClass =
function(item, field, params, colIdx) {
	var classes = null;
	if (!this._isMultiColumn && field == ZmItem.F_SUBJECT) {
		classes = "SubjectDoubleRow ";
	}
	if (colIdx == null) { return classes; }
	var headerList = params.headerList || this._headerList;
	return classes ? classes + headerList[colIdx]._cssClass: headerList[colIdx]._cssClass;
};

ZmMailListView.prototype._getFlagIcon =
function(isFlagged, isMouseover) {
	return (isFlagged || isMouseover)
		? "FlagRed"
		: (this._isMultiColumn ? "Blank_16" : "FlagDis");
};


/**
 * Returns a list of the largest subset of the given participants that will fit within the
 * given width. The participants are assumed to be ordered oldest to most recent. We return
 * as many of the most recent as possible.
 *
 * @private
 * @param {array}		participants		list of AjxEmailAddress
 * @param {ZmMailItem}	item				item that contains the participants
 * @param {int}			width				available space in pixels
 * 
 * @return list of participant objects with 'name' and 'index' fields
 */
ZmMailListView.prototype._fitParticipants =
function(participants, item, availWidth) {

	availWidth -= 15;	// safety margin

	var sepWidth = AjxStringUtil.getWidth(AjxStringUtil.LIST_SEP, item.isUnread);
	var ellWidth = AjxStringUtil.getWidth(AjxStringUtil.ELLIPSIS, item.isUnread);

	// first see if we can fit everyone with their full names
	var list = [];
	var pLen = Math.min(20, participants.length);
	var width = 0;
	for (var i = 0; i < pLen; i++) {
		var p = participants[i];
		var field = p.name || p.address || p.company || "";
		width += AjxStringUtil.getWidth(AjxStringUtil.htmlEncode(field), item.isUnread);
		list.push({name:field, index:i});
	}
	width += (pLen - 1) * sepWidth;
	if (width < availWidth) {
		return list;
	}

	// now try with display (first) names; fit as many of the most recent as we can
	list = [];
	for (var i = 0; i < pLen; i++) {
		var p = participants[i];
		var field = p.dispName || p.address || p.company || "";
		list.push({name:field, index:i});
	}
	while (list.length) {
		var width = 0;
		// total the width of the names
		for (var i = 0; i < list.length; i++) {
			width += AjxStringUtil.getWidth(AjxStringUtil.htmlEncode(list[i].name), item.isUnread);
		}
		// add the width of the separators
		width += (list.length - 1) * sepWidth;
		// add the width of the ellipsis if we've dropped anyone
		if (list.length < pLen) {
			width += ellWidth;
		}
		if (width < availWidth) {
			return list;
		} else {
			list.shift();
		}
	}

	// not enough room for even one participant, just return the last one
	var p = participants[pLen - 1];
	var field = p.dispName || p.address || p.company || "";
	return [{name:field, index:pLen - 1}];
};

ZmMailListView.prototype._getActionMenuForColHeader =
function(force) {

	var menu;
	if (this.isMultiColumn()) {
		var doReset = (!this._colHeaderActionMenu || force);
		menu = ZmListView.prototype._getActionMenuForColHeader.call(this, force, this, "header");
		if (doReset) {
			this._resetFromColumnLabel();
			this._groupByActionMenu = this._getGroupByActionMenu(menu);
		}
		else if (this._groupByActionMenu) {
			this._setGroupByCheck();
		}
	}
	else {
		if (!this._colHeaderActionMenu || force) {
			this._colHeaderActionMenu = this._setupSortMenu(null, true);
		}
		menu = this._colHeaderActionMenu;
	}

	return menu;
};


ZmMailListView.prototype._getSingleColumnSortFields =
function() {
	return ZmMailListView.SINGLE_COLUMN_SORT;
};


ZmMailListView.prototype._setupSortMenu = function(parent, includeGroupByMenu) {

	var activeSortBy = this.getActiveSearchSortBy();
	var defaultSort = activeSortBy && ZmMailListView.SORTBY_HASH[activeSortBy] ?
		ZmMailListView.SORTBY_HASH[activeSortBy].field : ZmItem.F_DATE;
	var sortMenu = this._getSortMenu(this._getSingleColumnSortFields(), defaultSort, parent);
	if (includeGroupByMenu) {
		this._groupByActionMenu = this._getGroupByActionMenu(sortMenu);
		this._setGroupByCheck();
	}
	var mi = sortMenu.getMenuItem(ZmItem.F_FROM);
	if (mi) {
		mi.setVisible(!this._isOutboundFolder());
	}
	mi = sortMenu.getMenuItem(ZmItem.F_TO);
	if (mi) {
		mi.setVisible(this._isOutboundFolder());
	}

	return sortMenu;
};

ZmMailListView.prototype._getNoResultsMessage =
function() {
	if (appCtxt.isOffline && !appCtxt.getSearchController().searchAllAccounts) {
		// offline folders which are "syncable" but currently not syncing should
		// display a different message
		var fid = ZmOrganizer.getSystemId(this._controller._getSearchFolderId());
		var folder = fid && appCtxt.getById(fid);
		if (folder) {
			if (folder.isOfflineSyncable && !folder.isOfflineSyncing) {
				var link = "ZmMailListView.toggleSync('" + folder.id + "', '" + this._htmlElId + "');";
				return AjxMessageFormat.format(ZmMsg.notSyncing, link);
			}
		}
	}

	return DwtListView.prototype._getNoResultsMessage.call(this);
};

ZmMailListView.toggleSync =
function(folderId, htmlElementId) {
	var folder = appCtxt.getById(folderId);
	var htmlEl = folder ? document.getElementById(htmlElementId) : null;
	var listview = htmlEl ? DwtControl.fromElement(htmlEl) : null;
	if (listview) {
		var callback = new AjxCallback(listview, listview._handleToggleSync, [folder]);
		folder.toggleSyncOffline(callback);
	}
};

ZmMailListView.prototype._handleToggleSync =
function(folder) {
	folder.getAccount().sync();
	// bug fix #27846 - just clear the list view and let instant notify populate
	this.removeAll(true);
};


// Listeners

ZmMailListView.prototype.handleUnmuteConv =
function(items) {
    //overridden in ZmConvListView
};

ZmMailListView.prototype._changeListener =
function(ev) {

	var item = this._getItemFromEvent(ev);
	if (!item || ev.handled || !this._handleEventType[item.type]) {
		if (ev && ev.event == ZmEvent.E_CREATE) {
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailListView: initial check failed");
		}
		return;
	}

	if ((!this.isMultiColumn() || appCtxt.get(ZmSetting.COLOR_MESSAGES))
			&& (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL)) {
		DBG.println(AjxDebug.DBG2, "ZmMailListView: TAG");
		this.redrawItem(item);
        ZmListView.prototype._changeListener.call(this, ev);
        ev.handled = true;
	}

	if (ev.event == ZmEvent.E_FLAGS) { // handle "unread" flag
		DBG.println(AjxDebug.DBG2, "ZmMailListView: FLAGS");
		var flags = ev.getDetail("flags");
		for (var j = 0; j < flags.length; j++) {
			var flag = flags[j];
			if (flag == ZmItem.FLAG_MUTE) {
				var on = item[ZmItem.FLAG_PROP[flag]];
				this.markUIAsMute(item, !on);
			}
            else if (flag == ZmItem.FLAG_UNREAD) {
				var on = item[ZmItem.FLAG_PROP[flag]];
				this.markUIAsRead(item, !on);
			}
		}
	}
	
	if (ev.event == ZmEvent.E_CREATE) {
		DBG.println(AjxDebug.DBG2, "ZmMailListView: CREATE");
		AjxDebug.println(AjxDebug.NOTIFY, "ZmMailListView: handle create " + item.id);

		if (this._controller.actionedMsgId) {
			var newMsg = appCtxt.getById(this._controller.actionedMsgId);
			if (newMsg) {
				this._itemToSelect = this._controller.isZmConvListController ? appCtxt.getById(newMsg.cid) : newMsg;
			}
			this._controller.actionedMsgId = null;
		}

		if (this._list && this._list.contains(item)) {
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailListView: list already has item " + item.id);
			return;
		}
		if (!this._handleEventType[item.type]) {
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailListView: list view of type " + this._mode + " does not handle " + item.type);
			return;
		}

		// Check to see if ZmMailList::notifyCreate gave us an index for the item.
		// If not, we assume that the new conv/msg is the most recent one. The only case
		// we handle is where the user is on the first page.
		//
		// TODO: handle other sort orders, arbitrary insertion points
		//about the above - for now we insert new items on top (index would be 0 if not sorted by date).
		// I believe that way the users won't lose new messages if they are sorted by a different order.
		if (this._isPageless || this.offset == 0) {
			var sortIndex = ev.getDetail("sortIndex") || 0;
			AjxDebug.println(AjxDebug.NOTIFY, "ZmMailListView: adding item " + item.id + " at index " + sortIndex);
			this.addItem(item, sortIndex);

			if (appCtxt.isOffline && appCtxt.getActiveAccount().isOfflineInitialSync()) {
				this._controller._app.numEntries++;
			}
		}
		ev.handled = true;
	}

	if (!ev.handled) {
		ZmListView.prototype._changeListener.call(this, ev);
        if (ev.event == ZmEvent.E_MOVE || ev.event == ZmEvent.E_DELETE){
            var cv = this._controller.getItemView();
            var currentItem =  cv && cv.getItem();
            if (currentItem == item){
                cv.set(null, true)
            }
        }
	}
};

/**
 * If we're showing content in the reading pane and there is exactly one item selected,
 * make sure the content is for that selected item. Otherwise, clear the content.
 */
ZmMailListView.prototype._itemClicked =
function(clickedEl, ev) {

    //bug:67455 request permission for desktop notifications
    if(window.webkitNotifications && appCtxt.get(ZmSetting.MAIL_NOTIFY_TOASTER)){
        var perm = webkitNotifications.checkPermission();
        if(perm == 1){
           webkitNotifications.requestPermission(function(){});
        }
        //else if(perm == 2) ){ /*ignore when browser has disabled notifications*/ }
    }

	Dwt.setLoadingTime("ZmMailItem");
	ZmListView.prototype._itemClicked.apply(this, arguments);
	
	var ctlr = this._controller;
	if (ctlr.isReadingPaneOn()) {
		if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX) && ev.button == DwtMouseEvent.LEFT) {
			if (!ev.shiftKey && !ev.ctrlKey) {
				// get the field being clicked
				var target = this._getEventTarget(ev);
				var id = (target && target.id && target.id.indexOf("AjxImg") == -1) ? target.id : clickedEl.id;
				var m = id ? this._parseId(id) : null;
				if (m && m.field == ZmItem.F_SELECTION) {
					if (this.getSelectionCount() == 1) {
						var item = this.getSelection()[0];
						var msg = (item instanceof ZmConv) ? item.getFirstHotMsg() : item;
						if (msg && ctlr._curItem && (msg.id != ctlr._curItem.id)) {
							ctlr.reset();
						}
					}
				}
			}
		}
	}
};

ZmMailListView.prototype._setNextSelection =
function() {

	if (this._itemToSelect) {
		var item = this._getItemToSelect();
		if (item) {
			DBG.println(AjxDebug.DBG1, "ZmMailListView._setNextSelection: select item with ID: " + item.id);
			this.setSelection(item, false);
			this._itemToSelect = null;
		}
	}
};

/**
 * Returns the next item to select, typically set by the controller.
 * 
 * @private
 */
ZmMailListView.prototype._getItemToSelect =
function() {
	var item = this._itemToSelect || (this._list && this._list.get(0));
	var list = this.getList(true);
	if (item == ZmMailListView.FIRST_ITEM) {
		list = list && list.getArray();
		item = list && list[0];
	} else if (item == ZmMailListView.LAST_ITEM) {
		list = list && list.getArray();
		item = list && list[list.length - 1];
	}
	return item;
};

ZmMailListView.prototype._getSearchForSort =
function(sortField, controller) {
	controller = controller || this._controller;
	var query = controller.getSearchString();
	if (!query) { return ""; }
	if (sortField != ZmItem.F_READ) {
		return; //shouldn't happen. READ/Unread is the only current filter
	}

	var str = "is:unread";
	if (query.indexOf(str) != -1) {
		query = AjxStringUtil.trim(query.replace(str, ""));
	} else {
		query = query + " " + str;
	}
	return query;
};

ZmMailListView.prototype._columnHasCustomQuery =
function(columnItem) {
	return columnItem._sortable == ZmItem.F_READ;
};

ZmMailListView.prototype._isDefaultSortAscending =
function(colHeader) {
	// if date, flag, attachment or size fields, sort desc by default - otherwise ascending.
	var sortable = colHeader._sortable;
	var desc = sortable === ZmItem.F_DATE
			|| sortable === ZmItem.F_FLAG
			|| sortable === ZmItem.F_ATTACHMENT
			|| sortable === ZmItem.F_SIZE;
	return !desc;
};

//GROUP SUPPORT
ZmMailListView.prototype.reset =
function() {
	this.clearGroupSections(this.getActiveSearchFolderId());
	ZmListView.prototype.reset.call(this);
};

ZmMailListView.prototype.removeAll =
function() {
	//similar to reset, but can't call reset since it sets _rendered to false and that prevents pagination from working.
	this.clearGroupSections(this.getActiveSearchFolderId());
	ZmListView.prototype.removeAll.call(this);
};


/**
 * Clear groups
 * @param {int} folderId folderId to get group
 */
ZmMailListView.prototype.clearGroupSections =
function(folderId) {
  if (folderId) {
      var group = this.getGroup(folderId);
      if (group) {
          group.clearSections();
      }
  }
  else if (this._group) {
      this._group.clearSections();
  }
};

/**
 * Set the group
 * @param {String} groupId
 */
ZmMailListView.prototype.setGroup =
function(groupId) {
    this._group = ZmMailListGroup.getGroup(groupId);
    if (this._folderId && !this._controller.isSearchResults) {
	    appCtxt.set(ZmSetting.GROUPBY_LIST, groupId || ZmId.GROUPBY_NONE, this._folderId); //persist group Id
	    appCtxt.set(ZmSetting.GROUPBY_HASH, this._group, this._folderId); //local cache for group object
    }
};

/**
 * get the group
 * @param {int} folderId
 * @return {ZmMailListGroup} group object or null
 */
ZmMailListView.prototype.getGroup =
function(folderId) {
    if (folderId) {
	    var group = appCtxt.get(ZmSetting.GROUPBY_HASH, folderId);
	    if (!group) {
			var groupId = appCtxt.get(ZmSetting.GROUPBY_LIST, folderId);
			group = ZmMailListGroup.getGroup(groupId);
			appCtxt.set(ZmSetting.GROUPBY_HASH, group, folderId);
	    }

	    var activeSortBy = this.getActiveSearchSortBy();
	    if (activeSortBy && ZmMailListView.SORTBY_HASH[activeSortBy] && group && group.field != ZmMailListView.SORTBY_HASH[activeSortBy].field) {
		    //switching views can cause problems; make sure the group and sortBy match
		    group = null;
		    appCtxt.set(ZmSetting.GROUPBY_HASH, group, folderId); //clear cache
		    appCtxt.set(ZmSetting.GROUPBY_LIST, ZmId.GROUPBY_NONE, folderId); //persist groupId
	    }


	    return group;
    }
	else {
	    return this._group;
    }
};

ZmMailListView.prototype._getGroupByActionMenu = function(parent, noSeparator, menuItemIsParent) {

    var list = [ ZmOperation.GROUPBY_NONE, ZmOperation.GROUPBY_DATE, ZmOperation.GROUPBY_FROM, ZmOperation.GROUPBY_SIZE ];
    if (this._mode == ZmId.VIEW_CONVLIST || this._isOutboundFolder()) {
        AjxUtil.arrayRemove(list, ZmOperation.GROUPBY_FROM);
    }

    var actionListener = this._groupByActionListener.bind(this);
    var sortActionListener = this._sortByActionListener.bind(this);

	if (!noSeparator) {
	    parent.createSeparator();
	}

	var menuItem = parent.createMenuItem(Dwt.getNextId("GROUP_BY_"), { text: ZmMsg.groupBy, style: DwtMenuItem.NO_STYLE });
	var menu = new ZmPopupMenu(menuItemIsParent ? menuItem : parent);

	var groupById = Dwt.getNextId("GroupByActionMenu_");
    var sortById = Dwt.getNextId("SortByActionMenu_");
    for (var i = 0; i < list.length; i++) {
        var mi = menu.createMenuItem(list[i], {
	        text:           ZmMsg[ZmOperation.getProp(list[i], "textKey")],
	        style:          DwtMenuItem.RADIO_STYLE,
	        radioGroupId:   groupById
        });
        mi.addSelectionListener(actionListener);
        if (this._group && this._group.id === list[i]) {
           mi.setChecked(true, true);
        }
        else if (!this._group && list[i] === ZmOperation.GROUPBY_NONE) {
           mi.setChecked(true, true);
        }
    }

    menu.createSeparator();

    var sortAsc = menu.createMenuItem(ZmOperation.SORT_ASC, {
	    text:           ZmMsg[ZmOperation.getProp(ZmOperation.SORT_ASC, "textKey")],
	    style:          DwtMenuItem.RADIO_STYLE,
	    radioGroupId:   sortById
    });
    sortAsc.addSelectionListener(sortActionListener);

    var sortDesc = menu.createMenuItem(ZmOperation.SORT_DESC, {
	    text:           ZmMsg[ZmOperation.getProp(ZmOperation.SORT_DESC, "textKey")],
	    style:          DwtMenuItem.RADIO_STYLE,
	    radioGroupId:   sortById
    });
    sortDesc.addSelectionListener(sortActionListener);

    if (this._bSortAsc) {
        sortAsc.setChecked(true, true);
    }
    else {
        sortDesc.setChecked(true, true);
    }
    menuItem.setMenu(menu);

    return menu;
};

ZmMailListView.prototype._groupByActionListener = function(ev) {

	var groupId = ev && ev.item && ev.item.getData(ZmOperation.MENUITEM_ID);
	//var oldGroup = this._group ? this._group : this.getGroup(this._folderId);
	var oldGroup = this.getGroup(this._folderId);
	var field = ZmMailListGroup.getHeaderField(groupId, this._isMultiColumn);
	var hdr = this._headerHash[field];
	if (!hdr) {
		if (oldGroup) {
			field = ZmMailListGroup.getHeaderField(oldGroup.id, this._isMultiColumn); //groups turned off, keep sort the same
		}
		else {
		    field = ZmId.FLD_DATE;
		}
		hdr = this._headerHash[field];
		this.setGroup(null);
	}
	else {
		if (!oldGroup || (oldGroup.id != groupId)) {
			hdr._sortable = ZmMailListGroup.getHeaderField(groupId);
			this.setGroup(groupId);
		}
	}

	if (!this._isMultiColumn) {
	    //this sets the "Sort by: Field" for reading pane on right
		var column = ZmMailListGroup.getHeaderField(groupId);
		for (var i = 0; i < ZmMailListView.SINGLE_COLUMN_SORT.length; i++) {
			if (column == ZmMailListView.SINGLE_COLUMN_SORT[i].field) {
				if (this._colHeaderActionMenu) {
					var mi = this._colHeaderActionMenu.getMenuItem(column);
					if (mi) {
						mi.setChecked(true, true);
						var label = AjxMessageFormat.format(ZmMsg.arrangeBy, ZmMsg[ZmMailListView.SINGLE_COLUMN_SORT[i].msg]);
						column = this._headerHash[ZmItem.F_SORTED_BY];
						var cell = document.getElementById(DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, field));
						if (cell) {
							cell.innerHTML = label;
						}
						break;
					}
				}
			}
		}
	}

    if (ev && ev.item) {
        ev.item.setChecked(true, ev, true);
    }
    this._sortColumn(hdr, this._bSortAsc);
    //Hack: we don't re-fetch search results when list is size of 1; but if user changes their group let's re-render
    var list = this.getList();
    if (list && list.size() == 1 && this._sortByString) {
	    this._renderList(list);
    }

	var ctlr = this._controller;
	ctlr._updateViewMenu(groupId, ctlr._groupByViewMenu);
};

ZmMailListView.prototype._sortByActionListener = function(ev) {

    var data = ev && ev.item && ev.item.getData(ZmOperation.MENUITEM_ID);
    var sortAsc = (data === ZmId.OP_SORT_ASC);
    var oldSort = this._bSortAsc;
    if (oldSort != sortAsc) {
        this._bSortAsc = sortAsc;
        var col = Dwt.byId(this._currentColId);
        var hdr = (col && this.getItemFromElement(col)) || (this._headerHash && this._headerHash[ZmItem.F_SORTED_BY]) || null;
        if (hdr) {
            this.clearGroupSections(this._folderId);
            this._sortColumn(hdr, this._bSortAsc);
            if (!this._isMultiColumn) {
                this._setSortedColStyle(hdr._id);
            }
        }
    }

    if (ev && ev.item) {
        ev.item.setChecked(true, ev, true);
    }

	var ctlr = this._controller;
	ctlr._updateViewMenu(data, ctlr._groupByViewMenu);
};

ZmMailListView.prototype._sortMenuListener =
function(ev) {

	if (this._groupByActionMenu) {
	    var mId = this._bSortAsc ? ZmOperation.OP_SORT_DESC : ZmOperation.OP_SORT_ASC;
	    var mi = this._groupByActionMenu.getMenuItem(mId);
	    if (mi) {
	        mi.setChecked(true, true);
	    }
	}
    var sortField = ev && ev.item && ev.item.getData(ZmOperation.MENUITEM_ID);
    if (this._group && sortField) {
        var groupId = ZmMailListGroup.getGroupIdFromSortField(sortField, this.type);
        this.setGroup(groupId);
    }
    this._setGroupByCheck();
    ZmListView.prototype._sortMenuListener.call(this, ev);
};

ZmMailListView.prototype._sortColumn = function(columnItem, bSortAsc, callback) {

	ZmListView.prototype._sortColumn.apply(this, arguments);

	var ctlr = this._controller;
	ctlr._updateViewMenu(columnItem._sortable, ctlr._sortViewMenu);
};

ZmMailListView.prototype._setGroupByCheck =
function() {

	if (this._groupByActionMenu) {
		var mi = this._group && this._group.id ? this._groupByActionMenu.getMenuItem(this._group.id) : this._groupByActionMenu.getMenuItem(ZmOperation.GROUPBY_NONE);
		if (mi) {
			mi.setChecked(true, true);
		}

	    mi = this._bSortAsc ? this._groupByActionMenu.getMenuItem(ZmOperation.SORT_ASC) : this._groupByActionMenu.getMenuItem(ZmOperation.SORT_DESC);
		if (mi) {
			mi.setChecked(true, true);
		}
	}
};

/**
 * Adds a row for the given item to the list view.
 * Supports adding section header when group is set.
 *
 * @param {Object}	item			the data item
 * @param {number}	index			the index at which to add item to list and list view
 * @param {boolean}	skipNotify	if <code>true</code>, do not notify listeners
 * @param {number}	itemIndex		index at which to add item to list, if different
 * 									from the one for the list view
 */
ZmMailListView.prototype.addItem =
function(item, index, skipNotify, itemIndex) {
    var group = this._group;
    if (!group) {
        return ZmListView.prototype.addItem.call(this, item, index, skipNotify, itemIndex);
    }

	if (!this._list) {
		this._list = new AjxVector();
	}

	// clear the "no results" message before adding!
	if (this._list.size() == 0) {
		this._resetList();
	}

    var section;
    var headerDiv;

	this._list.add(item, (itemIndex != null) ? itemIndex : index);
	var div = this._createItemHtml(item);
	if (div) {
		if (div instanceof Array) {
			for (var j = 0; j < div.length; j++) {
                section = group.addMsgToSection(item, div[j]);
                if (group.getSectionSize(section) == 1){
                    headerDiv = this._getSectionHeaderDiv(group, section);
                    this._addRow(headerDiv);
                }
				this._addRow(div[j]);
			}
		}
		else {
            section = group.addMsgToSection(item, div);
            if (group.getSectionSize(section) == 1){
                headerDiv = this._getSectionHeaderDiv(group, section);
                this._addRow(headerDiv, index);
            }
			index = parseInt(index) || 0;  //check for NaN index
			// Set a row offset to 1 for sorting dateDsc to skip first header
			var offset = 1;
			// If sorting is dateAsc then offset by all headers when adding a row
			if (this._sortByString === ZmSearch.DATE_ASC) {
				offset = this._group.getAllSectionHeaders().length;
			}
			this._addRow(div, index + offset); //account for header

		}
	}

	if (!skipNotify && this._evtMgr.isListenerRegistered(DwtEvent.STATE_CHANGE)) {
		this._evtMgr.notifyListeners(DwtEvent.STATE_CHANGE, this._stateChangeEv);
	}
};

/**
 * return the active search sortby value
 * @return {String} sortby value or null
 */
ZmMailListView.prototype.getActiveSearchSortBy =
function() {
	var sortBy = AjxUtil.get(this._controller, "_activeSearch", "search", "sortBy") || null;
	return sortBy;
};

/**
 * return folderId for the active search
 * @return {String} folderId or null
 */
ZmMailListView.prototype.getActiveSearchFolderId =
function() {
	var folderId = AjxUtil.get(this._controller, "_activeSearch", "search", "folderId") || null;
	return folderId;
};

ZmMailListView.prototype._changeFolderName = 
function(msg, oldFolderId) {

	var folder = appCtxt.getById(msg.folderId);

	if (!this._controller.isReadingPaneOn() || !this._controller.isReadingPaneOnRight()) {
		var folderCell = folder ? this._getElement(msg, ZmItem.F_FOLDER) : null;
		if (folderCell) {
			folderCell.innerHTML = folder.getName();
		}
	}

	if (folder && (folder.nId == ZmFolder.ID_TRASH || oldFolderId == ZmFolder.ID_TRASH)) {
		this._changeTrashStatus(msg);
	}
};

ZmMailListView.prototype._changeTrashStatus = 
function(msg) {

	var row = this._getElement(msg, ZmItem.F_ITEM_ROW);
	if (row) {
		if (msg.isUnread) {
			Dwt.addClass(row, "Unread");
		}
		var folder = appCtxt.getById(msg.folderId);
		if (folder && folder.isInTrash()) {
			Dwt.addClass(row, "Trash");
		} else {
			Dwt.delClass(row, "Trash");
		}
		if (msg.isSent) {
			Dwt.addClass(row, "Sent");
		}
	}
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmMailItemView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * Base class for a view displaying a single mail item (msg or conv).
 *
 * @author Conrad Damon
 *
 * @param {string}					id				ID for HTML element
 * @param {ZmListController}		controller		containing controller
 *
 * @extends		DwtComposite
 */
ZmMailItemView = function(params) {

	if (arguments.length == 0) { return; }
	
	DwtComposite.call(this, params);

	this._controller = params.controller;
};

ZmMailItemView.prototype = new DwtComposite;
ZmMailItemView.prototype.constructor = ZmMailItemView;

ZmMailItemView.prototype.isZmMailItemView = true;
ZmMailItemView.prototype.toString = function() { return "ZmMailItemView"; };

ZmMailItemView.prototype.set =
function(item, force) {
};

ZmMailItemView.prototype.getItem =
function() {
};

ZmMailItemView.prototype.reset =
function() {
};

ZmMailItemView.prototype.getMinHeight =
function() {
	return 20;
};

ZmMailItemView.prototype.getMinWidth =
function() {
	return 20;
};

ZmMailItemView.prototype.getHtmlBodyElement =
function() {
};

ZmMailItemView.prototype.hasHtmlBody =
function() {
	return false;
};

ZmMailItemView.prototype.getItem =
function() {
	return this._item;
};

ZmMailItemView.prototype.getTitle =
function() {
	return this._item ? [ZmMsg.zimbraTitle, this._item.subject].join(": ") : ZmMsg.zimbraTitle;
};

ZmMailItemView.prototype.setReadingPane =
function() {
};

ZmMailItemView.prototype.getInviteMsgView =
function() {
	return this._inviteMsgView;
};

// Create the ObjectManager at the last minute just before we scan the message
ZmMailItemView.prototype._lazyCreateObjectManager =
function(view) {
	// objectManager will be 'true' at create time, after that it will be the
	// real object. NOTE: Replaced if (this._objectManager === true) as "==="
	// does deep comparision of objects which might take a while.
	var createObjectMgr = (AjxUtil.isBoolean(this._objectManager) && this._objectManager);
	var firstCallAfterZimletLoading = (!this.zimletLoadFlag && appCtxt.getZimletMgr().isLoaded());

	if (createObjectMgr || firstCallAfterZimletLoading) {
		this.zimletLoadFlag = appCtxt.getZimletMgr().isLoaded();
		// this manages all the detected objects within the view
		this._objectManager = new ZmObjectManager(view || this);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmDoublePaneView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmDoublePaneView = function(params) {

	if (arguments.length == 0) { return; }

	var view = this._view = params.view = params.controller.getCurrentViewId();
	params.id = ZmId.getViewId(view);
	DwtComposite.call(this, params);

	this._controller = params.controller;
	this._initHeader();

	params.className = null;
	params.id = DwtId.getListViewId(view);
	params.parent = this;
	params.posStyle = Dwt.ABSOLUTE_STYLE;
	this._mailListView = this._createMailListView(params);

	// create the item view
	params.className = null;
	this._itemView = this._createMailItemView(params);

    var viewType = appCtxt.getViewTypeFromId(view);
    if (viewType === ZmId.VIEW_TRAD || viewType === ZmId.VIEW_CONVLIST) {
        this._createSashes();
    }
	this.setReadingPane();
};

ZmDoublePaneView.prototype = new DwtComposite;
ZmDoublePaneView.prototype.constructor = ZmDoublePaneView;

ZmDoublePaneView.prototype.isZmDoublePaneView = true;
ZmDoublePaneView.prototype.toString = function() { return "ZmDoublePaneView"; };

// consts

ZmDoublePaneView.SASH_THRESHOLD = 5;
ZmDoublePaneView.MIN_LISTVIEW_WIDTH = 40;

ZmDoublePaneView._TAG_IMG = "TI";


// public methods

ZmDoublePaneView.prototype.getController =
function() {
	return this._controller;
};

ZmDoublePaneView.prototype.getTitle =
function() {
	return this._mailListView.getTitle();
};

/**
 * Displays the reading pane, based on the current settings.
 */
ZmDoublePaneView.prototype.setReadingPane =
function(noSet) {

	var mlv = this._mailListView,
        mv = this._itemView,
        sashesPresent = this._vertSash && this._horizSash;

	var readingPaneEnabled = this._controller.isReadingPaneOn();
	if (!readingPaneEnabled) {
		mv.setVisible(false);
        if (sashesPresent) {
            this._vertSash.setVisible(false);
            this._horizSash.setVisible(false);
        }
	}
    else {
		if (!mv.getVisible()) {
			if (mlv.getSelectionCount() == 1) {
				this._controller._setSelectedItem();
			} else {
				mv.reset();
			}
		}
		var readingPaneOnRight = this._controller.isReadingPaneOnRight();
		mv.setVisible(true, readingPaneOnRight);
        if (sashesPresent) {
            var newSash = readingPaneOnRight ? this._vertSash : this._horizSash;
            var oldSash = readingPaneOnRight ? this._horizSash : this._vertSash;
            oldSash.setVisible(false);
            newSash.setVisible(true);
        }
	}

	mlv.reRenderListView();
    if (!noSet) {
	    mv.setReadingPane();
    }

	mv.noTab = !readingPaneEnabled || AjxEnv.isIE;
	var sz = this.getSize();
	this._resetSize(sz.x, sz.y, true);
};

ZmDoublePaneView.prototype.getMailListView =
function() {
	return this._mailListView;
};

ZmDoublePaneView.prototype.getItemView = 
function() {
	return this._itemView;
};

// back-compatibility
ZmDoublePaneView.prototype.getMsgView = ZmDoublePaneView.prototype.getItemView;

ZmDoublePaneView.prototype.getInviteMsgView =
function() {
	return this._itemView.getInviteMsgView();
};


ZmDoublePaneView.prototype.getSelectionCount = 
function() {
	return this._mailListView.getSelectionCount();
};

ZmDoublePaneView.prototype.getSelection = 
function() {
	return this._mailListView.getSelection();
};

ZmDoublePaneView.prototype.reset =
function() {
	this._mailListView.reset();
	this._itemView.reset();
};

ZmDoublePaneView.prototype.getItem =
function() {
	return this._itemView.getItem();
};

ZmDoublePaneView.prototype.setItem =
function(item, force, dontFocus) {
	this._itemView.set(item, force);
	this._controller._checkKeepReading();
 };

ZmDoublePaneView.prototype.clearItem =
function() {
	this._itemView.set();
};

// TODO: see if we can remove these
ZmDoublePaneView.prototype.getMsg =
function() {
	return (this._controller.getCurrentViewType() == ZmId.VIEW_TRAD) ? this._itemView.getMsg() : null;
};

ZmDoublePaneView.prototype.setMsg =
function(msg) {
	this._itemView.set(msg);
	this._controller._restoreFocus();	// bug 47700
};

ZmDoublePaneView.prototype.addInviteReplyListener =
function (listener){
	this._itemView.addInviteReplyListener(listener);
};

ZmDoublePaneView.prototype.addShareListener =
function (listener){
	this._itemView.addShareListener(listener);
};

ZmDoublePaneView.prototype.addSubscribeListener =
function(listener) {
	this._itemView.addSubscribeListener(listener);
};


ZmDoublePaneView.prototype.resetMsg = 
function(newMsg) {
	this._itemView.resetMsg(newMsg);
};

ZmDoublePaneView.prototype.isReadingPaneVisible =
function() {
	return this._itemView.getVisible();
};

ZmDoublePaneView.prototype.setBounds = 
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	this._resetSize(width, height);
};

ZmDoublePaneView.prototype.setList =
function(list) {
	this._mailListView.set(list, ZmItem.F_DATE);
	this.isStale = false;
};

// Private / Protected methods

ZmDoublePaneView.prototype._initHeader = function() {};
ZmDoublePaneView.prototype._createMailListView = function(params) {};
ZmDoublePaneView.prototype._createMailItemView = function(params) {};

// create a sash for each of the two reading pane locations
ZmDoublePaneView.prototype._createSashes = function() {

    var params = {
        parent:     this,
        style:      DwtSash.HORIZONTAL_STYLE,
        className:  "AppSash-horiz",
        threshold:  ZmDoublePaneView.SASH_THRESHOLD,
        posStyle:   Dwt.ABSOLUTE_STYLE
    };

    this._vertSash = new DwtSash(params);
    this._vertSash.registerCallback(this._sashCallback, this);
    this._vertSash.addListener(DwtEvent.ONMOUSEUP, this._sashVertRelease.bind(this));

    params.style = DwtSash.VERTICAL_STYLE;
    params.className = "AppSash-vert";
    this._horizSash = new DwtSash(params);
    this._horizSash.registerCallback(this._sashCallback, this);
    this._horizSash.addListener(DwtEvent.ONMOUSEUP, this._sashHorizRelease.bind(this));
    this.addListener(DwtEvent.CONTROL, this._controlEventListener.bind(this));
};

ZmDoublePaneView.prototype._resetSize = 
function(newWidth, newHeight, force) {

	if (newWidth <= 0 || newHeight <= 0) { return; }
	if (!force && newWidth == this._lastResetWidth && newHeight == this._lastResetHeight) { return; }

	var readingPaneOnRight = this._controller.isReadingPaneOnRight();

	if (this.isReadingPaneVisible()) {
		var sash = this.getSash();
		var sashSize = sash.getSize();
		var sashThickness = readingPaneOnRight ? sashSize.x : sashSize.y;
		var itemViewMargins = this._itemView.getMargins();
		if (readingPaneOnRight) {
			var listViewWidth = this.getReadingSashPosition(true) || (Number(ZmMsg.LISTVIEW_WIDTH)) || Math.floor(newWidth / 2.5);
			this._mailListView.resetSize(listViewWidth, newHeight);
			sash.setLocation(listViewWidth, 0);
			this._itemView.setBounds(listViewWidth + sashThickness, 0,
									newWidth - (listViewWidth + sashThickness + itemViewMargins.left + itemViewMargins.right), newHeight);
		} else {
			var listViewHeight = this.getReadingSashPosition(false) || (Math.floor(newHeight / 2) - DwtListView.HEADERITEM_HEIGHT);
			this._mailListView.resetSize(newWidth, listViewHeight);
			sash.setLocation(0, listViewHeight);
			this._itemView.setBounds(0, listViewHeight + sashThickness, newWidth - itemViewMargins.left - itemViewMargins.right,
									newHeight - (listViewHeight + sashThickness));
		}
	} else {
		this._mailListView.resetSize(newWidth, newHeight);
	}
	this._mailListView._resetColWidth();

	this._lastResetWidth = newWidth;
	this._lastResetHeight = newHeight;
};

ZmDoublePaneView.prototype._sashCallback =
function(delta) {

	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	var listView = this._mailListView;
	var itemView = this._itemView;
	//See bug 69593 for the reason for "true"
	var itemViewSize = itemView.getSize(true);
	var listViewSize = listView.getSize(true);

	var newListViewSize;
	var newItemViewBounds;

	var absDelta = Math.abs(delta);

	if (readingPaneOnRight) {
		var currentListViewWidth = AjxEnv.isIE ? this._vertSash.getLocation().x : listViewSize.x;
		var currentItemViewWidth = itemViewSize.x;
		delta = this._getLimitedDelta(delta, currentItemViewWidth, itemView.getMinWidth(), currentListViewWidth, ZmDoublePaneView.MIN_LISTVIEW_WIDTH);
		if (!delta) {
			return 0;
		}
		newListViewSize = {width: currentListViewWidth + delta, height: Dwt.DEFAULT};
		newItemViewBounds = {
			left: itemView.getLocation().x + delta,
			top: Dwt.DEFAULT,
			width: currentItemViewWidth - delta,
			height: Dwt.DEFAULT
		};
	}
	else {
		//reading pane on bottom
		var currentListViewHeight = AjxEnv.isIE ? this._horizSash.getLocation().y : listViewSize.y;
		var currentItemViewHeight = itemViewSize.y;
		delta = this._getLimitedDelta(delta, currentItemViewHeight, itemView.getMinHeight(), currentListViewHeight, this._getMinListViewHeight(listView));
		if (!delta) {
			return 0;
		}
		newListViewSize = {width: Dwt.DEFAULT, height: currentListViewHeight + delta};
		newItemViewBounds = {
			left: Dwt.DEFAULT,
			top: itemView.getLocation().y + delta,
			width: Dwt.DEFAULT,
			height: currentItemViewHeight - delta
		};
	}

	listView.resetSize(newListViewSize.width, newListViewSize.height);
	itemView.setBounds(newItemViewBounds.left, newItemViewBounds.top, newItemViewBounds.width, newItemViewBounds.height);

	listView._resetColWidth();
	if (readingPaneOnRight) {
		this._vertSashX = this._vertSash.getLocation().x + delta;
	}
	else {
		this._horizSashY = this._horizSash.getLocation().y + delta;
	}

	return delta;
};

/**
 * returns the delta after limiting it based on minimum view dimension (which is either width/height - this code doesn't care)
 *
 * @param delta
 * @param currentItemViewDimension
 * @param minItemViewDimension
 * @param currentListViewDimension
 * @param minListViewDimension
 * @returns {number}
 * @private
 */
ZmDoublePaneView.prototype._getLimitedDelta =
function(delta, currentItemViewDimension, minItemViewDimension, currentListViewDimension, minListViewDimension) {
	if (delta > 0) {
		// moving sash right or down
		return Math.max(0, Math.min(delta, currentItemViewDimension - minItemViewDimension));
	}
	// moving sash left or up
	var absDelta = Math.abs(delta);
	return -Math.max(0, Math.min(absDelta, currentListViewDimension - minListViewDimension));
};

ZmDoublePaneView.prototype._getMinListViewHeight =
function(listView) {
	if (this._minListViewHeight) {
		return this._minListViewHeight;
	}

	var list = listView.getList();
	if (!list || !list.size()) {
		return DwtListView.HEADERITEM_HEIGHT;
	}
	//only cache it if there's a list, to prevent a subtle bug of setting to just the header height if
	//user first views an empty list.
	var item = list.get(0);
	var div = document.getElementById(listView._getItemId(item));
	this._minListViewHeight = DwtListView.HEADERITEM_HEIGHT + Dwt.getSize(div).y * 2;
	return this._minListViewHeight;
};

ZmDoublePaneView.prototype._selectFirstItem =
function() {
	var list = this._mailListView.getList();
	var selectedItem = list ? list.get(0) : null;
	if (selectedItem) {
		this._mailListView.setSelection(selectedItem, false);
	}
};

ZmDoublePaneView.prototype.getSash =
function() {
	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	return readingPaneOnRight ? this._vertSash : this._horizSash;
};

ZmDoublePaneView.prototype.getLimit =
function(offset) {
	return this._mailListView.getLimit(offset);
};

ZmDoublePaneView.prototype._staleHandler =
function() {

	var search = this._controller._currentSearch;
	if (search) {
		search.lastId = search.lastSortVal = null;
		search.offset = search.limit = 0;
		var params = {isRefresh: true};
		var mlv = this._mailListView
		if (mlv.getSelectionCount() == 1) {
			var sel = mlv.getSelection();
			var selItem = sel && sel[0];
			var curItem = this.getItem();
			if (selItem && curItem && selItem.id == curItem.id) {
				params.selectedItem = selItem;
			}
		}
		appCtxt.getSearchController().redoSearch(search, false, params);
	}
};

ZmDoublePaneView.prototype.handleRemoveAttachment =
function(oldMsgId, newMsg) {
	this._itemView.handleRemoveAttachment(oldMsgId, newMsg);
};

/**
 * Returns the sash location (in pixels) based on reading pane preference.
 * 
 * @param {boolean}		readingPaneOnRight   true if reading pane is on the right
 */
ZmDoublePaneView.prototype.getReadingSashPosition =
function(readingPaneOnRight) {
	if (readingPaneOnRight) {
		if (!this._vertSashX) {
			var value = this._readingPaneSashVertPos || appCtxt.get(ZmSetting.READING_PANE_SASH_VERTICAL);
			var percentWidth = value / 100;
			var screenWidth = this.getSize().x;
			this._vertSashX = Math.round(percentWidth * screenWidth);
		}
		return this._vertSashX;
	}
	else {
		if (!this._horizSashY) {
			var value = this._readingPaneSashHorizPos || appCtxt.get(ZmSetting.READING_PANE_SASH_HORIZONTAL);
			var percentHeight = value / 100;
			var screenHeight = this.getSize().y;
			this._horizSashY = Math.round(percentHeight * screenHeight);
		}
		return this._horizSashY;
	}
};

/**
 * Sets the location of sash (in percentage) depending upon reading pane preference.
 * 
 * @param {boolean}		readingPaneOnRight	true if reading pane is on the right
 * @param {int}			value   			location of sash (in pixels)
 */
ZmDoublePaneView.prototype.setReadingSashPosition =
function(readingPaneOnRight, value) {
	if (readingPaneOnRight) {
		var screenWidth = this.getSize().x;
		var sashWidthPercent = Math.round((value / screenWidth) * 100);
		if (this._controller.isSearchResults) {
			this._readingPaneSashVertPos = sashWidthPercent;
		}
		else {
			appCtxt.set(ZmSetting.READING_PANE_SASH_VERTICAL, sashWidthPercent);
		}
	}
	else {
		var screenHeight = this.getSize().y;
		var sashHeightPercent = Math.round((value/screenHeight) * 100);
		if (this._controller.isSearchResults) {
			this._readingPaneSashHorizPos = sashHeightPercent;
		}
		else {
			appCtxt.set(ZmSetting.READING_PANE_SASH_HORIZONTAL, sashHeightPercent);
		}
	}
};

ZmDoublePaneView.prototype._sashVertRelease =
function() {
	this.setReadingSashPosition(true, this._vertSashX);
};

ZmDoublePaneView.prototype._sashHorizRelease =
function() {
	this.setReadingSashPosition(false, this._horizSashY);
};

ZmDoublePaneView.prototype._controlEventListener =
function(ev) {
	//resize can be called multiple times based on the browser so wait till resizing is complete
	if (ev && (ev.newWidth == ev.requestedWidth) && (ev.newHeight == ev.requestedHeight))  {
		var readingPaneOnRight = this._controller.isReadingPaneOnRight();
		//reset the sash values and resize the pane based on settings
		if (readingPaneOnRight) {
			this._readingPaneSashVertPos = appCtxt.get(ZmSetting.READING_PANE_SASH_VERTICAL);
			delete this._vertSashX;
		} else {
			this._readingPaneSashHorizPos = appCtxt.get(ZmSetting.READING_PANE_SASH_HORIZONTAL);
			delete this._horizSashY;
		}
		var sz = this.getSize();
		this._resetSize(sz.x, sz.y, true);
	}
};

}
if (AjxPackage.define("zimbraMail.mail.view.ZmTradView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmTradView = function(params) {

	params.className = params.className || "ZmTradView";
	params.mode = ZmId.VIEW_TRAD;
	ZmDoublePaneView.call(this, params);
}

ZmTradView.prototype = new ZmDoublePaneView;
ZmTradView.prototype.constructor = ZmTradView;

ZmTradView.prototype.isZmTradView = true;
ZmTradView.prototype.toString = function() { return "ZmTradView"; };

ZmTradView.prototype._createMailListView =
function(params) {
	return new ZmMailMsgListView(params);
};

ZmTradView.prototype._createMailItemView =
function(params) {
	params.id = ZmId.getViewId(ZmId.VIEW_MSG, null, params.view);
	return new ZmMailMsgView(params);
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmInviteMsgView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains an invite mail message singleton class.
 *
 */


/**
 * Default constructor for invite mail message class.
 * @class
 * When a user receives an invite, this class is instatiated to help
 * ZmMailMsgView deal with invite-specific rendering/logic.
 *
 * @author Parag Shah
 */
ZmInviteMsgView = function(params) {
	if (arguments.length == 0) { return; }

	this.parent = params.parent; // back reference to ZmMailMsgView
	this.mode = params.mode;
};

// Consts
ZmInviteMsgView.REPLY_INVITE_EVENT	= "inviteReply";


ZmInviteMsgView.prototype.toString =
function() {
	return "ZmInviteMsgView";
};

ZmInviteMsgView.prototype.reset =
function(cleanupHTML) {
	if (this._inviteToolbar) {
		if (cleanupHTML) {
			this._inviteToolbar.dispose();
			this._inviteToolbar = null;
		} else {
			this._inviteToolbar.setDisplay(Dwt.DISPLAY_NONE);
		}
	}

	if (this._counterToolbar) {
		if (cleanupHTML) {
			this._counterToolbar.dispose();
			this._counterToolbar = null;
		} else {
			this._counterToolbar.setDisplay(Dwt.DISPLAY_NONE);
		}
	}

	if (this._dayView) {
		if (cleanupHTML) {
			this._dayView.dispose();
			this._dayView = null;
		} else {
			this._dayView.setDisplay(Dwt.DISPLAY_NONE);
		}
		Dwt.delClass(this.parent.getHtmlElement(), "RightBorderSeparator");
	}

	this._msg = null;
	this._invite = null;
};

ZmInviteMsgView.prototype.isActive =
function() {
	return ((this._invite && !this._invite.isEmpty()) ||
			(this._inviteToolbar && this._inviteToolbar.getVisible()) ||
			(this._counterToolbar && this._counterToolbar.getVisible()));
};

ZmInviteMsgView.prototype.set =
function(msg) {

	this._msg = msg;
	var invite = this._invite = msg.invite;

	this.parent._lazyCreateObjectManager();

    // Can operate the toolbar if user is the invite recipient, or invite is in a
    // non-trash shared folder with admin/workflow access permissions
    var folder   =  appCtxt.getById(msg.folderId);
    var enabled  = !appCtxt.isExternalAccount();
    if (enabled && folder && folder.isRemote()) {
        var workflow = folder.isPermAllowed(ZmOrganizer.PERM_WORKFLOW);
        var admin    = folder.isPermAllowed(ZmOrganizer.PERM_ADMIN);
        var enabled  = (admin || workflow) &&
                       (ZmOrganizer.normalizeId(msg.folderId) != ZmFolder.ID_TRASH);
    }
	if (invite && invite.hasAcceptableComponents() && msg.folderId != ZmFolder.ID_SENT)	{
		if (msg.isInviteCanceled()) {
			//appointment was canceled (not necessarily on this instance, but by now it is canceled. Do not show the toolbar.
			return;
		}
		if (invite.hasCounterMethod()) {
			if (!this._counterToolbar) {
				this._counterToolbar = this._getCounterToolbar();
			}
			this._counterToolbar.reparentHtmlElement(this.parent.getHtmlElement(), 0);
			this._counterToolbar.setVisible(enabled);
		}
		else if (!invite.isOrganizer() && invite.hasInviteReplyMethod()) {
			var ac = window.parentAppCtxt || window.appCtxt;
			if (AjxEnv.isIE && this._inviteToolbar) {
				//according to fix to bug 52412 reparenting doestn't work on IE. so I don't reparent for IE but also if the toolbar element exists,
				//I remove it from parent since in the case of double-click message view, it appears multiple times without removing it
				this._inviteToolbar.dispose();
				this._inviteToolbar = null;
			}

			var inviteToolbar = this.getInviteToolbar();
			inviteToolbar.setVisible(enabled);

			// show on-behalf-of info?
			this._respondOnBehalfLabel.setContent(msg.cif ? AjxMessageFormat.format(ZmMsg.onBehalfOfText, [AjxStringUtil.htmlEncode(msg.cif)]) : "");
			this._respondOnBehalfLabel.setVisible(!!msg.cif);

			// logic for showing calendar/folder chooser
			var cc = AjxDispatcher.run("GetCalController");
			//note that for a msg from a mountpoint, msgAcct returns the main account, so it's not really msgAcct.
			var msgAcct = msg.getAccount();
			var calendars = ac.get(ZmSetting.CALENDAR_ENABLED, null, msgAcct) && (!msg.cif)
				? cc.getCalendars({includeLinks:true, account:msgAcct, onlyWritable:true}) : [];

			var msgFolder = ac.getById(msg.getFolderId());
			var msgAcctId = msgFolder && msgFolder.isMountpoint ? ZmOrganizer.parseId(msgFolder.id).acctId : msgAcct.id;

			if (appCtxt.multiAccounts) {
				var accounts = ac.accountList.visibleAccounts;
				for (var i = 0; i < accounts.length; i++) {
					var acct = accounts[i];
					if (acct == msgAcct || !ac.get(ZmSetting.CALENDAR_ENABLED, null, acct)) { continue; }
					if (appCtxt.isOffline && acct.isMain) { continue; }

					calendars = calendars.concat(cc.getCalendars({includeLinks:true, account:acct, onlyWritable:true}));
				}

				// always add the local account *last*
				if (appCtxt.isOffline) {
					calendars.push(appCtxt.getById(ZmOrganizer.ID_CALENDAR));
				}
			}

			var visible = (calendars.length > 1 || appCtxt.multiAccounts);
			if (visible) {
				this._inviteMoveSelect.clearOptions();
				for (var i = 0; i < calendars.length; i++) {
					var calendar = calendars[i];
					var calAcct = null;
					var calAcctId;
					if (calendar.isMountpoint) {
						//we can't get account object for mountpoint, just get the ID.
						calAcctId = ZmOrganizer.parseId(calendar.id).acctId;
					}
					else {
						calAcct = calendar.getAccount();
						calAcctId = calAcct.id;
					}
					var icon = (appCtxt.multiAccounts && calAcct) ? calAcct.getIcon() : (calendar.getIcon() + ",color=" + calendar.color);
					var name = (appCtxt.multiAccounts && calAcct)
						? ([calendar.name, " (", calAcct.getDisplayName(), ")"].join(""))
						: calendar.name;
					var isSelected = (calAcctId && msgAcctId)
						? (calAcctId == msgAcctId && calendar.nId == appCtxt.get(ZmSetting.CAL_DEFAULT_ID))
						: calendar.nId == appCtxt.get(ZmSetting.CAL_DEFAULT_ID);
                    //bug: 57538 - this invite is intended for owner of shared calendar which should be selected
                    if(msg.cif && calendar.owner == msg.cif && calendar.rid == appCtxt.get(ZmSetting.CAL_DEFAULT_ID)) isSelected = true;
					var option = new DwtSelectOptionData(calendar.id, name, isSelected, null, icon);
					this._inviteMoveSelect.addOption(option);
				}

				// for accounts that don't support calendar, always set the
				// selected calendar to the Local calendar
				if (!ac.get(ZmSetting.CALENDAR_ENABLED, null, msgAcct)) {
					this._inviteMoveSelect.setSelectedValue(ZmOrganizer.ID_CALENDAR);
				}
			}
			this._inviteMoveSelect.setVisible(visible);
		}
	}
};

/**
 * This method does two things:
 * 1) Checks if invite was responded to with accept/decline/tentative, and if so,
 *    a GetAppointmentRequest is made to get the status for the other attendees.
 *
 * 2) Requests the free/busy status for the start date and renders the day view
 *    with the results returned.
 */
ZmInviteMsgView.prototype.showMoreInfo =
function(callback, dayViewCallback) {
	var apptId = this._invite && this._invite.hasAttendeeResponse() && this._invite.getAppointmentId();

    // Fix for bug: 83785. apptId: 0 is default id for an appointment without any parent.
    // Getting apptId: 0 when external user takes action on appointment and organizer gets reply mail.
	if (apptId !== '0' && apptId) {
		var jsonObj = {GetAppointmentRequest:{_jsns:"urn:zimbraMail"}};
		var request = jsonObj.GetAppointmentRequest;
		var msgId = this._invite.msgId;
		var inx = msgId.indexOf(":");
		if (inx !== -1) {
			apptId = [msgId.substr(0, inx), apptId].join(":");
		}
		request.id = apptId;

		appCtxt.getAppController().sendRequest({
			jsonObj: jsonObj,
			asyncMode: true,
			callback: (new AjxCallback(this, this._handleShowMoreInfo, [callback, dayViewCallback]))
		});
	}
	else {
		this._showFreeBusy(dayViewCallback);
		if (callback) {
			callback.run();
		}
	}
};

ZmInviteMsgView.prototype._handleShowMoreInfo =
function(callback, dayViewCallback, result) {
	var appt = result && result.getResponse().GetAppointmentResponse.appt[0];
	if (appt) {
		var om = this.parent._objectManager;
		var html = [];
		var idx = 0;
		var attendees = appt.inv[0].comp[0].at || [];
        AjxDispatcher.require(["MailCore", "CalendarCore"]);

        var options = {};
	    options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);

		for (var i = 0; i < attendees.length; i++) {
			var at = attendees[i];
			var subs = {
				icon: ZmCalItem.getParticipationStatusIcon(at.ptst),
				attendee: this.parent._getBubbleHtml(new AjxEmailAddress(at.a), options)
			};
			html[idx++] = AjxTemplate.expand("mail.Message#InviteHeaderPtst", subs);
		}

		var ptstEl = document.getElementById(this._ptstId);
        if(ptstEl)
            ptstEl.innerHTML = html.join("");
	}

	if (callback) {
		callback.run();
	}

	this._showFreeBusy(dayViewCallback);
};

ZmInviteMsgView.prototype._showFreeBusy =
function(dayViewCallback) {
	var ac = window.parentAppCtxt || window.appCtxt;

	if (!appCtxt.isChildWindow &&
		(ac.get(ZmSetting.CALENDAR_ENABLED) || ac.multiAccounts) &&
		(this._invite && this._invite.type != "task"))
	{
        var inviteDate = this._getInviteDate();
        if (inviteDate == null) {
            return;
        }

		AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);
		var cc = AjxDispatcher.run("GetCalController");

		if (!this._dayView) {
			// create a new ZmCalDayView under msgview's parent otherwise, we
			// cannot position the day view correctly.
			var dayViewParent = (this.mode && (this.mode == ZmId.VIEW_CONV2)) ?
			    this.parent : this.parent.parent;
			this._dayView = new ZmCalDayView(dayViewParent, DwtControl.ABSOLUTE_STYLE, cc, null,
                this.parent._viewId, null, true, true, this.isRight());
			this._dayView.addSelectionListener(new AjxListener(this, this._apptSelectionListener));
			this._dayView.setZIndex(Dwt.Z_VIEW); // needed by ZmMsgController's msgview
		}

		this._dayView.setDisplay(Dwt.DISPLAY_BLOCK);
		this._dayView.setDate(inviteDate, 0, false);
        this.resize();

        var acctFolderIds = [].concat(cc.getCheckedCalendarFolderIds()); // create a *copy*
        if(this._msg.cif) {
            acctFolderIds = acctFolderIds.concat(cc.getUncheckedCalendarIdsByOwner(this._msg.cif));
        }
		var rt = this._dayView.getTimeRange();
		var params = {
			start: rt.start,
			end: rt.end,
			fanoutAllDay: this._dayView._fanoutAllDay(),
			callback: (new AjxCallback(this, this._dayResultsCallback, [dayViewCallback, inviteDate.getHours()])),
			accountFolderIds: [acctFolderIds] // pass in array of array
		};
		cc.apptCache.batchRequest(params);
	}
};

ZmInviteMsgView.prototype._getInviteDate =
function() {
	if (!this._invite) { return null; }
    var inviteDate = this._invite.getServerStartDate(null, true);
    // Not sure when null inviteDate happens (probably a bug) but this is defensive
    // check for bug 51754
    if (inviteDate != null) {
        var inviteTz = this._invite.getServerStartTimeTz();
        inviteDate = AjxTimezone.convertTimezone(inviteDate,
            AjxTimezone.getClientId(inviteTz), AjxTimezone.DEFAULT);
    }
    return inviteDate;
}

ZmInviteMsgView.prototype.isRight =
function() {
	return this.parent._controller.isReadingPaneOnRight();
};

ZmInviteMsgView.prototype.convResize =
function() {
	var parentSize = this.parent.getSize();
	if (this._dayView) {
		this._dayView.setSize(parentSize.x - 5, 218);
		var el = this._dayView.getHtmlElement();
		el.style.left = el.style.top = "auto";
		this._dayView.layout();
	}
}

/**
 * Resizes the view depending on whether f/b is being shown or not.
 *
 * @param reset		Boolean		If true, day view is not shown and msgview's bounds need to be "reset"
 */
ZmInviteMsgView.prototype.resize =
function(reset) {
	if (appCtxt.isChildWindow) { return; }
	if (this.parent.isZmMailMsgCapsuleView) { return; }

	var isRight = this.isRight();
	var grandParentSize = this.parent.parent.getSize();

	if (reset) {
		if (isRight) {
			this.parent.setSize(Dwt.DEFAULT, grandParentSize.y);
		}
		else {
			this.parent.setSize(grandParentSize.x, Dwt.DEFAULT);
		}
	} else if (this._dayView) {
		// bug: 50412 - fix day view for stand-alone message view which is a parent
		// of DwtShell and needs to be resized manually.
		var padding = 0;
		if (this.parent.getController() instanceof ZmMsgController) {
			// get the bounds for the app content area so we can position the day view
			var appContentBounds = appCtxt.getAppViewMgr()._getContainerBounds(ZmAppViewMgr.C_APP_CONTENT);
            if (!isRight)
			    grandParentSize = {x: appContentBounds.width, y: appContentBounds.height};

			// set padding so we can add it to the day view's x-location since it is a child of the shell
			padding = appContentBounds.x;
		}

		var mvBounds = this.parent.getBounds();

		/* on IE sometimes the value of top and left is "auto", in which case we get a NaN value here due to parseInt in getLocation. */
		/* not sure if 0 is the right value we should use in this case, but it seems to work */
		if (isNaN(mvBounds.x)) {
			mvBounds.x = 0;
		}
		if (isNaN(mvBounds.y)) {
			mvBounds.y = 0;
		}

		if (isRight) {
			var parentHeight = grandParentSize.y;
			var dvHeight = Math.floor(parentHeight / 3);
			var mvHeight = parentHeight - dvHeight;

			this._dayView.setBounds(mvBounds.x, mvHeight, mvBounds.width, dvHeight);
            if (this.parent && this.parent instanceof ZmMailMsgView){
                var el = this.parent.getHtmlElement();
                if (this.mode && this.mode != ZmId.VIEW_MSG) {
                    if (el){
                        el.style.height = mvHeight + "px";
                        Dwt.setScrollStyle(el, Dwt.SCROLL);
                    }
                }
                else {
                    var bodyDiv = this.parent.getMsgBodyElement();
                    if (bodyDiv) Dwt.setScrollStyle(bodyDiv, Dwt.CLIP);
                    if (el) {
                        Dwt.setScrollStyle(el, Dwt.SCROLL);
                        var yOffset = this.parent.getBounds().y || 0;
                        el.style.height = (mvHeight - yOffset) + "px";
                    }
                }
            }

			// don't call DwtControl's setSize() since it triggers control
			// listener and leads to infinite loop

			Dwt.delClass(this.parent.getHtmlElement(), "RightBorderSeparator");
		} else {
			var parentWidth = grandParentSize.x;
			var dvWidth = Math.floor(parentWidth / 3);
			var separatorWidth = 5;
			var mvWidth = parentWidth - dvWidth - separatorWidth; 

			this._dayView.setBounds(mvWidth + padding + separatorWidth, mvBounds.y, dvWidth, mvBounds.height);
			// don't call DwtControl's setSize() since it triggers control
			// listener and leads to infinite loop
			Dwt.setSize(this.parent.getHtmlElement(), mvWidth, Dwt.DEFAULT);
			Dwt.addClass(this.parent.getHtmlElement(), "RightBorderSeparator");
		}
	}
};

/**
 * enables all invite toolbar buttons, except one that matches the current ptst
 * @param ptst participant status
 */
ZmInviteMsgView.prototype.enableToolbarButtons =
function(ptst) {
	var disableButtonIds = {};
	switch (ptst) {
		case ZmCalBaseItem.PSTATUS_ACCEPT:
			disableButtonIds[ZmOperation.REPLY_ACCEPT] = true;
			break;
		case ZmCalBaseItem.PSTATUS_DECLINED:
			disableButtonIds[ZmOperation.REPLY_DECLINE] = true;
			break;
		case ZmCalBaseItem.PSTATUS_TENTATIVE:
			disableButtonIds[ZmOperation.REPLY_TENTATIVE] = true;
			break;
	}
	if (appCtxt.isWebClientOffline()) {
		 disableButtonIds[ ZmOperation.PROPOSE_NEW_TIME] = true;
	}
	var inviteToolbar = this.getInviteToolbar();

	var buttonIds = [ZmOperation.REPLY_ACCEPT, ZmOperation.REPLY_DECLINE, ZmOperation.REPLY_TENTATIVE, ZmOperation.PROPOSE_NEW_TIME];
	for (var i = 0; i < buttonIds.length; i++) {
		var buttonId = buttonIds[i];
		inviteToolbar.getButton(buttonId).setEnabled(appCtxt.isExternalAccount() ? false : !disableButtonIds[buttonId]);
	}
};

/**
 * hide the participant status message (no longer relevant)
 */
ZmInviteMsgView.prototype.updatePtstMsg =
function(ptst) {
	var ptstMsgBannerDiv = document.getElementById(this._ptstMsgBannerId);
	if (!ptstMsgBannerDiv) {
		return;
	}
	ptstMsgBannerDiv.className = ZmInviteMsgView.PTST_MSG[ptst].className;
	ptstMsgBannerDiv.style.display = "block"; // since it might be display none if there's no message to begin with (this is the first time ptst is set by buttons)

	var ptstMsgElement = document.getElementById(this._ptstMsgId);
	ptstMsgElement.innerHTML = ZmInviteMsgView.PTST_MSG[ptst].msg;

	var ptstIconImg = document.getElementById(this._ptstMsgIconId);
	var icon = ZmCalItem.getParticipationStatusIcon(ptst);
	ptstIconImg.innerHTML = AjxImg.getImageHtml(icon)


};


ZmInviteMsgView.PTST_MSG = [];
ZmInviteMsgView.PTST_MSG[ZmCalBaseItem.PSTATUS_ACCEPT] = {msg: AjxMessageFormat.format(ZmMsg.inviteAccepted), className: "InviteStatusAccept"};
ZmInviteMsgView.PTST_MSG[ZmCalBaseItem.PSTATUS_DECLINED] = {msg: AjxMessageFormat.format(ZmMsg.inviteDeclined), className: "InviteStatusDecline"};
ZmInviteMsgView.PTST_MSG[ZmCalBaseItem.PSTATUS_TENTATIVE] = {msg: AjxMessageFormat.format(ZmMsg.inviteAcceptedTentatively), className: "InviteStatusTentative"};
ZmInviteMsgView.PTST_MSG[ZmCalBaseItem.PSTATUS_NEEDS_ACTION] = {msg: AjxMessageFormat.format(ZmMsg.ptstMsgNeedsAction), className: "InviteStatusTentative"};

ZmInviteMsgView.prototype.addSubs =
function(subs, sentBy, sentByAddr, obo) {

    AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);
	subs.invite = this._invite;

	if (!this._msg.isInviteCanceled() && !subs.invite.isOrganizer() && subs.invite.hasInviteReplyMethod()) {
		var yourPtst = this._msg.getPtst();
		this.enableToolbarButtons(yourPtst);
		if (yourPtst) {
			subs.ptstMsg = ZmInviteMsgView.PTST_MSG[yourPtst].msg;
			subs.ptstClassName = ZmInviteMsgView.PTST_MSG[yourPtst].className;
			subs.ptstIcon = ZmCalItem.getParticipationStatusIcon(yourPtst);
		}
	}
	//ids for updating later
	subs.ptstMsgBannerId = this._ptstMsgBannerId = (this.parent._htmlElId + "_ptstMsgBanner");
	subs.ptstMsgId = this._ptstMsgId = (this.parent._htmlElId + "_ptstMsg");
	subs.ptstMsgIconId = this._ptstMsgIconId = (this.parent._htmlElId + "_ptstMsgIcon");

	var isOrganizer = this._invite && this._invite.isOrganizer();
    var isInviteCancelled = this._invite.components && this._invite.components[0].method === ZmId.OP_CANCEL;
	// counter proposal
	if (this._invite.hasCounterMethod() &&
		this._msg.folderId != ZmFolder.ID_SENT)
	{
        var from = this._msg.getAddress(AjxEmailAddress.FROM) && this._msg.getAddress(AjxEmailAddress.FROM).getAddress();
        subs.counterInvMsg =  (!sentByAddr || sentByAddr == from) ?
            AjxMessageFormat.format(ZmMsg.counterInviteMsg, [from]):AjxMessageFormat.format(ZmMsg.counterInviteMsgOnBehalfOf, [sentByAddr, from]);
	}
	// Fix for bug: 88052 and 77237. Display cancellation banner to organizer or attendee
	else if (isInviteCancelled) {
		var organizer = this._invite.getOrganizerName() || this._invite.getOrganizerEmail();
		subs.ptstMsg = AjxMessageFormat.format(ZmMsg.inviteMsgCancelled, organizer.split());
		subs.ptstIcon = ZmCalItem.getParticipationStatusIcon(ZmCalBaseItem.PSTATUS_DECLINED);
		subs.ptstClassName = "InviteStatusDecline";
	}
	// if this an action'ed invite, show the status banner
	else if (isOrganizer && this._invite.hasAttendeeResponse()) {
		var attendee = this._invite.getAttendees()[0];
		var ptst = attendee && attendee.ptst;
		if (ptst) {
            var names = [];
			var dispName = attendee.d || attendee.a;
            var sentBy = attendee.sentBy;
            var ptstStr = null;
            if (sentBy) names.push(attendee.sentBy);
            names.push(dispName);
			subs.ptstIcon = ZmCalItem.getParticipationStatusIcon(ptst);
			switch (ptst) {
				case ZmCalBaseItem.PSTATUS_ACCEPT:
					ptstStr = (!sentBy) ? ZmMsg.inviteMsgAccepted : ZmMsg.inviteMsgOnBehalfOfAccepted;
					subs.ptstClassName = "InviteStatusAccept";
					break;
				case ZmCalBaseItem.PSTATUS_DECLINED:
					ptstStr = (!sentBy) ? ZmMsg.inviteMsgDeclined : ZmMsg.inviteMsgOnBehalfOfDeclined;
					subs.ptstClassName = "InviteStatusDecline";
					break;
				case ZmCalBaseItem.PSTATUS_TENTATIVE:
					ptstStr = (!sentBy) ? ZmMsg.inviteMsgTentative:ZmMsg.inviteMsgOnBehalfOfTentative;
					subs.ptstClassName = "InviteStatusTentative";
					break;
			}
            if (ptstStr){
                subs.ptstMsg = AjxMessageFormat.format(ptstStr, names);
            }
		}
	}

    if (isOrganizer && this._invite && this._invite.hasAttendeeResponse() && this._invite.getAppointmentId()){
        // set an Id for adding more detailed info later
        subs.ptstId = this._ptstId = (this.parent._htmlElId + "_ptst");
    }

    var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);

	var om = this.parent._objectManager;
	// organizer
	var org = new AjxEmailAddress(this._invite.getOrganizerEmail(), null, this._invite.getOrganizerName());
	subs.invOrganizer = this.parent._getBubbleHtml(org, options);

    if (obo) {
	    subs.obo = this.parent._getBubbleHtml(obo, options);
    }

	// sent-by
	var sentBy = this._invite.getSentBy();
	if (sentBy) {
		subs.invSentBy = this.parent._getBubbleHtml(sentBy, options);
	}

    if(this._msg.cif) {
        subs.intendedForMsg = AjxMessageFormat.format(ZmMsg.intendedForInfo, [AjxStringUtil.htmlEncode(this._msg.cif)]);
        subs.intendedForClassName = "InviteIntendedFor";
    }

	// inviteees
	var invitees = [];
    var optInvitees = [];

	var list = this._invite.getAttendees();
	for (var i = 0; i < list.length; i++) {
		var at = list[i];
		var attendee = new AjxEmailAddress(at.a, null, at.d);
        if (at.role == ZmCalItem.ROLE_OPTIONAL) {
            optInvitees.push(attendee);
        }
        else {
            invitees.push(attendee);
        }
	}
    var addressInfo = this.parent.getAddressesFieldInfo(invitees, options, "inv");
    subs.invitees = addressInfo.html;
    addressInfo = this.parent.getAddressesFieldInfo(optInvitees, options, "opt");
    subs.optInvitees = addressInfo.html;

	// convert to local timezone if necessary
	var inviteTz = this._invite.getServerStartTimeTz();
	var defaultTz = AjxTimezone.getServerId(AjxTimezone.DEFAULT);

    if (inviteTz) {
        var sd = AjxTimezone.convertTimezone(this._invite.getServerStartDate(null, true), AjxTimezone.getClientId(inviteTz), AjxTimezone.DEFAULT);
        var ed = AjxTimezone.convertTimezone(this._invite.getServerEndDate(null, true), AjxTimezone.getClientId(inviteTz), AjxTimezone.DEFAULT);

        subs.timezone = AjxTimezone.getMediumName(defaultTz);
    }

	// duration text
	var durText = this._invite.getDurationText(null, null, null, true, sd, ed);
	subs.invDate = durText;

	// recurrence
	if (this._invite.isRecurring()) {
		var recur = new ZmRecurrence();
		recur.setRecurrenceRules(this._invite.getRecurrenceRules(), this._invite.getServerStartDate());
		subs.recur = recur.getBlurb();
	}

	// set changes to the invite
	var changes = this._invite.getChanges();
	if (changes && changes[ZmInvite.CHANGES_LOCATION]) {
		subs.locChangeClass = "InvChanged";
	}
	if (changes && changes[ZmInvite.CHANGES_SUBJECT]) {
		subs.subjChangeClass = "InvChanged";
	}
	if (changes && changes[ZmInvite.CHANGES_TIME]) {
		subs.timeChangeClass = "InvChanged";
	}
};

ZmInviteMsgView.truncateBodyContent =
function(content, isHtml) {
    if (!content) return content;
	var sepIdx = content.indexOf(ZmItem.NOTES_SEPARATOR);
	if (sepIdx == -1) {
		return content;
	}
	if (isHtml) {
		//if it is a html content then just remove the content and preserve the html tags
		//surrounding the content.
        content = content.replace("<div>"+ ZmItem.NOTES_SEPARATOR +"</div>", ZmItem.NOTES_SEPARATOR); // Striping div if ZmItem.NOTES_SEPARATOR is part of div.
        content = content.replace(ZmItem.NOTES_SEPARATOR, "<div id='separatorId'>" + ZmItem.NOTES_SEPARATOR + "</div>");
        var divEle = document.createElement("div");
        divEle.innerHTML = content;
        var node = Dwt.byId("separatorId",divEle) ;
        if (node){
            var parent = node.parentNode
            // Removing all previousSiblings of node that contains ZmItem.NOTES_SEPARATOR
            while(node.previousSibling){
                parent.removeChild(node.previousSibling);
            }
            parent.removeChild(node);
        }
        return divEle.innerHTML;
	}
	return content.substring(sepIdx+ZmItem.NOTES_SEPARATOR.length);
};

ZmInviteMsgView.prototype._getCounterToolbar =
function() {
	var params = {
		parent: this.parent,
		buttons: [ZmOperation.ACCEPT_PROPOSAL, ZmOperation.DECLINE_PROPOSAL],
		posStyle: DwtControl.STATIC_STYLE,
		className: "ZmCounterToolBar",
		buttonClassName: "DwtToolbarButton",
		context: this.mode,
		toolbarType: ZmId.TB_COUNTER
	};
	var tb = new ZmButtonToolBar(params);

	var listener = new AjxListener(this, this._inviteToolBarListener);
	for (var i = 0; i < tb.opList.length; i++) {
		tb.addSelectionListener(tb.opList[i], listener);
	}

	return tb;
};

/**
 * returns the toolbar. Creates a new one only if it's not already set to the internal field
 */
ZmInviteMsgView.prototype.getInviteToolbar =
function() {
	if (!this._inviteToolbar) {
		this._inviteToolbar = this._createInviteToolbar();
		//hide it till needed. Just in case after the fix I submit with this, some future change will call it before needs to be displayed.
		this._inviteToolbar.setDisplay(Dwt.DISPLAY_NONE);
		
	}
	return this._inviteToolbar;
};


ZmInviteMsgView.prototype._createInviteToolbar =
function() {
	var replyButtonIds = [
		ZmOperation.INVITE_REPLY_ACCEPT,
		ZmOperation.INVITE_REPLY_TENTATIVE,
		ZmOperation.INVITE_REPLY_DECLINE
	];
	var notifyOperationButtonIds = [
		ZmOperation.REPLY_ACCEPT_NOTIFY,
		ZmOperation.REPLY_TENTATIVE_NOTIFY,
		ZmOperation.REPLY_DECLINE_NOTIFY
	];
	var ignoreOperationButtonIds = [
		ZmOperation.REPLY_ACCEPT_IGNORE,
		ZmOperation.REPLY_TENTATIVE_IGNORE,
		ZmOperation.REPLY_DECLINE_IGNORE
	];
	var inviteOps = [
		ZmOperation.REPLY_ACCEPT,
		ZmOperation.REPLY_TENTATIVE,
		ZmOperation.REPLY_DECLINE,
		ZmOperation.PROPOSE_NEW_TIME
	];

	var params = {
		parent: this.parent,
		buttons: inviteOps,
		posStyle: DwtControl.STATIC_STYLE,
		className: "ZmInviteToolBar",
		buttonClassName: "DwtToolbarButton",
		context: this.parent.getHTMLElId(),
		toolbarType: ZmId.TB_INVITE
	};
	var tb = new ZmButtonToolBar(params);

	var listener = new AjxListener(this, this._inviteToolBarListener);
	for (var i = 0; i < tb.opList.length; i++) {
		var id = tb.opList[i];

		tb.addSelectionListener(id, listener);

		if (id == ZmOperation.PROPOSE_NEW_TIME) { continue; }

		var button = tb.getButton(id);
		var standardItems = [notifyOperationButtonIds[i], replyButtonIds[i], ignoreOperationButtonIds[i]];
		var menu = new ZmActionMenu({parent:button, menuItems:standardItems});
		standardItems = menu.opList;
		for (var j = 0; j < standardItems.length; j++) {
			var menuItem = menu.getItem(j);
			menuItem.addSelectionListener(listener);
		}
		button.setMenu(menu);
	}

	this._respondOnBehalfLabel = tb.addFiller();
	tb.addFiller();

	// folder picker
	this._inviteMoveSelect = new DwtSelect({parent:tb});
	this._inviteMoveSelect.setVisible(false); //by default hide it. bug 74254

	return tb;
};

ZmInviteMsgView.prototype._inviteToolBarListener =
function(ev) {
	ev._inviteReplyType = ev.item.getData(ZmOperation.KEY_ID);
	ev._inviteReplyFolderId = ((this._inviteMoveSelect && this._inviteMoveSelect.getValue()) || ZmOrganizer.ID_CALENDAR);
	ev._inviteComponentId = null;
	ev._msg = this._msg;
	this.parent.notifyListeners(ZmInviteMsgView.REPLY_INVITE_EVENT, ev);
};

ZmInviteMsgView.prototype._dayResultsCallback =
function(dayViewCallback, invitedHour, list, skipMiniCalUpdate, query) {
	if (this._dayView) {
	    this._dayView.set(list, true);
	    this._dayView._scrollToTime(invitedHour);
	}
    if (dayViewCallback) {
        dayViewCallback.run();
    }
};

ZmInviteMsgView.prototype.getDayView =
function() {
    return this._dayView;
};

ZmInviteMsgView.prototype._apptSelectionListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var appt = ev.item;
		if (appt.isPrivate() && appt.getFolder().isRemote() && !appt.getFolder().hasPrivateAccess()) {
			var msgDialog = appCtxt.getMsgDialog();
			msgDialog.setMessage(ZmMsg.apptIsPrivate, DwtMessageDialog.INFO_STYLE);
			msgDialog.popup();
		} else {
			// open a appointment view
			var cc = AjxDispatcher.run("GetCalController");
			cc._showAppointmentDetails(appt);
		}
	}
};

ZmInviteMsgView.prototype.scrollToInvite =
function() {
    var inviteDate = this._getInviteDate();
    if ((inviteDate != null) && this._dayView) {
        this._dayView._scrollToTime(inviteDate.getHours());
    }
}

ZmInviteMsgView.prototype.repositionCounterToolbar =
function(hdrTableId) {
    if (this._invite && this._invite.hasCounterMethod() && hdrTableId && this._counterToolbar) {
        this._counterToolbar.reparentHtmlElement(hdrTableId + '_counterToolbar', 0);
    }
}
}
if (AjxPackage.define("zimbraMail.mail.view.ZmMailMsgView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmMailMsgView = function(params) {

	if (arguments.length == 0) { return; }

	params.className = params.className || "ZmMailMsgView";
	ZmMailItemView.call(this, params);

	this._mode = params.mode;
	this._controller = params.controller;
	this._viewId = this._getViewId(params.sessionId);

	this._displayImagesId	= ZmId.getViewId(this._viewId, ZmId.MV_DISPLAY_IMAGES, this._mode);
	this._msgTruncatedId	= ZmId.getViewId(this._viewId, ZmId.MV_MSG_TRUNC, this._mode);
	this._infoBarId			= ZmId.getViewId(this._viewId, ZmId.MV_INFO_BAR, this._mode);
	this._tagRowId			= ZmId.getViewId(this._viewId, ZmId.MV_TAG_ROW, this._mode);
	this._tagCellId			= ZmId.getViewId(this._viewId, ZmId.MV_TAG_CELL, this._mode);
	this._attLinksId		= ZmId.getViewId(this._viewId, ZmId.MV_ATT_LINKS, this._mode);

	this._scrollWithIframe = params.scrollWithIframe;
	this._limitAttachments = this._scrollWithIframe ? 3 : 0; //making it local
	this._attcMaxSize = this._limitAttachments * 16 + 8;
	this.setScrollStyle(this._scrollWithIframe ? DwtControl.CLIP : DwtControl.SCROLL);

	ZmTagsHelper.setupListeners(this); //setup tags related listeners.

	this._setMouseEventHdlrs(); // needed by object manager
	this._objectManager = true;

	this._changeListener = this._msgChangeListener.bind(this);
	this.addListener(DwtEvent.ONSELECTSTART, this._selectStartListener.bind(this));
	this.addListener(DwtEvent.CONTROL, this._controlEventListener.bind(this));

	// bug fix #25724 - disable right click selection for offline
	if (!appCtxt.isOffline) {
		this._setAllowSelection();
	}

	this.noTab = true;
    this._attachmentLinkIdToFileNameMap = null;
	this._bubbleParams = {};

	if (this._controller && this._controller._checkKeepReading) {
		Dwt.setHandler(this.getHtmlElement(), DwtEvent.ONSCROLL, ZmDoublePaneController.handleScroll);
	};

	this._tabGroupMember = new DwtTabGroup("ZmMailMsgView");
	this._headerTabGroup = new DwtTabGroup("ZmMailMsgView (header)");
	this._attachmentTabGroup = new DwtTabGroup("ZmMailMsgView (attachments)");
	this._bodyTabGroup = new DwtTabGroup("ZmMailMsgView (body)");
	this._footerTabGroup = new DwtTabGroup("ZmMailMsgView (footer)");

	this._tabGroupMember.addMember([
		this._headerTabGroup, this._bodyTabGroup, this._footerTabGroup
	]);

	if (this._mode === ZmId.VIEW_TRAD) {
		this.setAttribute('role', 'region');
	}
};

ZmMailMsgView.prototype = new ZmMailItemView;
ZmMailMsgView.prototype.constructor = ZmMailMsgView;

ZmMailMsgView.prototype.isZmMailMsgView = true;
ZmMailMsgView.prototype.toString = function() {	return "ZmMailMsgView"; };


// displays any additional headers in messageView
//pass ZmMailMsgView.displayAdditionalHdrsInMsgView[<actualHeaderName>] = <DisplayName>
//pass ZmMailMsgView.displayAdditionalHdrsInMsgView["X-Mailer"] = "Sent Using:"
ZmMailMsgView.displayAdditionalHdrsInMsgView = {};


// Consts

ZmMailMsgView.SCROLL_WITH_IFRAME	= true;
ZmMailMsgView.LIMIT_ATTACHMENTS 	= ZmMailMsgView.SCROLL_WITH_IFRAME ? 3 : 0;
ZmMailMsgView.ATTC_COLUMNS			= 2;
ZmMailMsgView.ATTC_MAX_SIZE			= ZmMailMsgView.LIMIT_ATTACHMENTS * 16 + 8;
ZmMailMsgView.QUOTE_DEPTH_MOD 		= 3;
ZmMailMsgView.MAX_SIG_LINES 		= 8;
ZmMailMsgView.SIG_LINE 				= /^(- ?-+)|(__+)\r?$/;
ZmMailMsgView._inited 				= false;
ZmMailMsgView.SHARE_EVENT 			= "share";
ZmMailMsgView.SUBSCRIBE_EVENT 		= "subscribe";
ZmMailMsgView.IMG_FIX_RE			= new RegExp("(<img\\s+.*dfsrc\\s*=\\s*)[\"']http[^'\"]+part=([\\d\\.]+)[\"']([^>]*>)", "gi");
ZmMailMsgView.FILENAME_INV_CHARS_RE = /[\.\/?*:;{}'\\]/g; // Chars we do not allow in a filename
ZmMailMsgView.SETHEIGHT_MAX_TRIES	= 3;

ZmMailMsgView._URL_RE = /^((https?|ftps?):\x2f\x2f.+)$/;
ZmMailMsgView._MAILTO_RE = /^mailto:[\x27\x22]?([^@?&\x22\x27]+@[^@?&]+\.[^@?&\x22\x27]+)[\x27\x22]?/;

ZmMailMsgView.MAX_ADDRESSES_IN_FIELD = 10;

// tags that are trusted in HTML content that is not displayed in an iframe
ZmMailMsgView.TRUSTED_TAGS = ["#text", "a", "abbr", "acronym", "address", "article", "b", "basefont", "bdo", "big",
	"blockquote", "body", "br", "caption", "center", "cite", "code", "col", "colgroup", "dd", "del", "dfn", "dir",
	"div", "dl", "dt", "em", "font", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "img",
	"ins", "kbd", "li", "mark", "menu", "meter", "nav", "ol", "p", "pre", "q", "s", "samp", "section", "small",
	"span", "strike", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time", "tr", "tt",
	"u", "ul", "var", "wbr"];

// attributes that we don't want to appear in HTML displayed in a div
ZmMailMsgView.UNTRUSTED_ATTRS = ["id", "class", "name", "profile"];

// Public methods

ZmMailMsgView.prototype.getController =
function() {
	return this._controller;
};

ZmMailMsgView.prototype.reset =
function() {
	// Bug 23692: cancel any pending actions
	if (this._resizeAction) {
		AjxTimedAction.cancelAction(this._resizeAction);
		this._resizeAction = null;
	}
	if (this._objectsAction) {
		AjxTimedAction.cancelAction(this._objectsAction);
		this._objectsAction = null;
	}
	this._msg = this._item = null;
	this._htmlBody = null;
	this._containerEl = null;

	// TODO: reuse all these controls that are being disposed here.....
	if (this._ifw) {
		this._ifw.dispose();
		this._ifw = null;
	}
	if (this._inviteMsgView) {
		this._inviteMsgView.reset(true);
	}
	
	var el = this.getHtmlElement();
	if (el) {
		el.innerHTML = "";
	}
	if (this._objectManager && this._objectManager.reset) {
		this._objectManager.reset();
	}
	this.setScrollWithIframe(this._scrollWithIframe);
};

ZmMailMsgView.prototype.dispose =
function() {
	ZmTagsHelper.disposeListeners(this);
	ZmMailItemView.prototype.dispose.apply(this, arguments);
};

ZmMailMsgView.prototype.preventSelection =
function() {
	return false;
};

ZmMailMsgView.prototype.set =
function(msg, force, dayViewCallback) {
	
	if (!force && this._msg && msg && !msg.force && (this._msg == msg)) { return; }

	var oldMsg = this._msg;
	this.reset();
	var contentDiv = this._getContainer();
	this._msg = this._item = msg;

	if (!msg) {
		if (this._inviteMsgView) {
			this._inviteMsgView.resize(true); //make sure the msg preview pane takes the entire area, in case we were viewing an invite. (since then it was resized to allow for day view) - bug 53098
		}
		contentDiv.innerHTML = (this._controller.getList().size()) ? AjxTemplate.expand("mail.Message#viewMessage") : "";
		return;
	}

	msg.force = false;
	var respCallback = this._handleResponseSet.bind(this, msg, oldMsg, dayViewCallback);
	this._renderMessage(msg, contentDiv, respCallback);
};

ZmMailMsgView.prototype._getContainer =
function() {
	return this.getHtmlElement();
};

ZmMailMsgView.prototype.__hasMountpoint =
function(share) {
	var tree = appCtxt.getFolderTree();
	return tree
		? this.__hasMountpoint2(tree.root, share.grantor.id, share.link.id)
		: false;
};

ZmMailMsgView.prototype.__hasMountpoint2 =
function(organizer, zid, rid) {
	if (organizer.zid == zid && organizer.rid == rid)
		return true;

	if (organizer.children) {
		var children = organizer.children.getArray();
		for (var i = 0; i < children.length; i++) {
			var found = this.__hasMountpoint2(children[i], zid, rid);
			if (found) {
				return true;
			}
		}
	}
	return false;
};

ZmMailMsgView.prototype.highlightObjects =
function(origText) {
	if (origText != null) {
		// we get here only for text messages; it's a lot
		// faster to call findObjects on the whole text rather
		// than parsing the DOM.
		DBG.timePt("START - highlight objects on-demand, text msg.");
		this._lazyCreateObjectManager();
		var html = this._objectManager.findObjects(origText, true, null, true);
		html = html.replace(/^ /mg, "&nbsp;")
			.replace(/\t/g, "<pre style='display:inline;'>\t</pre>")
			.replace(/\n/g, "<br>");
		var container = this.getContentContainer();
		container.innerHTML = html;
		DBG.timePt("END - highlight objects on-demand, text msg.");
	} else {
		this._processHtmlDoc();
	}
};

ZmMailMsgView.prototype.resetMsg =
function(newMsg) {
	// Remove listener for current msg if it exists
	if (this._msg) {
		this._msg.removeChangeListener(this._changeListener);
	}
};

ZmMailMsgView.prototype.getMsg =
function() {
	return this._msg;
};

ZmMailMsgView.prototype.getItem = ZmMailMsgView.prototype.getMsg;

// Following two overrides are a hack to allow this view to pretend it's a list view
ZmMailMsgView.prototype.getSelection =
function() {
	return [this._msg];
};

ZmMailMsgView.prototype.getSelectionCount =
function() {
	return 1;
};

ZmMailMsgView.prototype.getMinHeight =
function() {
	if (!this._headerHeight) {
		var headerObj = document.getElementById(this._hdrTableId);
		this._headerHeight = headerObj ? Dwt.getSize(headerObj).y : 0;
	}
	return this._headerHeight;
};

// returns true if the current message was rendered in HTML
ZmMailMsgView.prototype.hasHtmlBody =
function() {
	return this._htmlBody != null;
};

// returns the IFRAME's document if we are using one, or the window document
ZmMailMsgView.prototype.getDocument =
function() {
	return this._usingIframe ? Dwt.getIframeDoc(this.getIframe()) : document;
};

// returns the IFRAME element if we are using one
ZmMailMsgView.prototype.getIframe =
function() {

	if (!this._usingIframe) { return null; }
	
	var iframe = this._iframeId && document.getElementById(this._iframeId);
	iframe = iframe || (this._ifw && this._ifw.getIframe());
	return iframe;
};
ZmMailMsgView.prototype.getIframeElement = ZmMailMsgView.prototype.getIframe;

// Returns a BODY element if we are using an IFRAME, the container DIV if we are not.
ZmMailMsgView.prototype.getContentContainer =
function() {
	if (this._usingIframe) {
		var idoc = this.getDocument();
		var body = idoc && idoc.body;
		return body && body.childNodes.length === 1 ? body.firstChild : body;
	}
	else {
		return this._containerEl;
	}
};

ZmMailMsgView.prototype.getContent =
function() {
	var container = this.getContentContainer();
	return container ? container.innerHTML : "";
};

ZmMailMsgView.prototype.addInviteReplyListener =
function(listener) {
	this.addListener(ZmInviteMsgView.REPLY_INVITE_EVENT, listener);
};

ZmMailMsgView.prototype.addShareListener =
function(listener) {
	this.addListener(ZmMailMsgView.SHARE_EVENT, listener);
};

ZmMailMsgView.prototype.addSubscribeListener =
function(listener) {
	this.addListener(ZmMailMsgView.SUBSCRIBE_EVENT, listener);
};

ZmMailMsgView.prototype.getTabGroupMember =
function() {
	return this._tabGroupMember;
};

ZmMailMsgView.prototype._getMessageTabMember =
function() {
	if (this._usingIframe) {
		return this.getIframe().parentNode;
	} else {
		return Dwt.byId(this._msgBodyDivId);
	}
};

ZmMailMsgView.prototype.setVisible =
function(visible, readingPaneOnRight,msg) {
	DwtComposite.prototype.setVisible.apply(this, arguments);
	var inviteMsgView = this._inviteMsgView;
	if (!inviteMsgView) {
		return;
	}

	if (visible && this._msg) {
		if (this._msg != msg) {
			var dayView = inviteMsgView.getDayView();
			if (!dayView) {
				return;
			}
			dayView.setIsRight(readingPaneOnRight);

			inviteMsgView.set(this._msg);
			inviteMsgView.repositionCounterToolbar(this._hdrTableId);
			inviteMsgView.showMoreInfo(null, null, readingPaneOnRight);
		}
	}
	else {
		inviteMsgView.reset();
	}
};


// Private / protected methods

ZmMailMsgView.prototype._getSubscribeToolbar =
function(req) {
	if (this._subscribeToolbar) {
		if (AjxEnv.isIE) {
			//reparenting on IE does not work. So recreating in this case. (similar to bug 52412 for the invite toolbar)
			this._subscribeToolbar.dispose();
			this._subscribeToolbar = null;
		}
		else {
			return this._subscribeToolbar;
		}
	}

	this._subscribeToolbar = this._getButtonToolbar([ZmOperation.SUBSCRIBE_APPROVE, ZmOperation.SUBSCRIBE_REJECT],
												ZmId.TB_SUBSCRIBE,
												this._subscribeToolBarListener.bind(this, req));

	return this._subscribeToolbar;
};



ZmMailMsgView.prototype._getShareToolbar =
function() {
	if (this._shareToolbar) {
		if (AjxEnv.isIE) {
			//reparenting on IE does not work. So recreating in this case. (similar to bug 52412 for the invite toolbar)
			this._shareToolbar.dispose();
			this._shareToolbar = null;
		}
		else {
			return this._shareToolbar;
		}
	}

	this._shareToolbar = this._getButtonToolbar([ZmOperation.SHARE_ACCEPT, ZmOperation.SHARE_DECLINE],
												ZmId.TB_SHARE,
												this._shareToolBarListener.bind(this));

	return this._shareToolbar;
};

ZmMailMsgView.prototype._getButtonToolbar =
function(buttonIds, toolbarType, listener) {

	var params = {
		parent: this,
		buttons: buttonIds,
		posStyle: DwtControl.STATIC_STYLE,
		className: "ZmShareToolBar",
		buttonClassName: "DwtToolbarButton",
		context: this._mode,
		toolbarType: toolbarType
	};
	var toolbar = new ZmButtonToolBar(params);

	for (var i = 0; i < buttonIds.length; i++) {
		var id = buttonIds[i];

		// HACK: IE doesn't support multiple class names.
		var b = toolbar.getButton(id);
		b._hoverClassName = b._className + "-" + DwtCssStyle.HOVER;
		b._activeClassName = b._className + "-" + DwtCssStyle.ACTIVE;

		toolbar.addSelectionListener(id, listener);
	}

	return toolbar;
};

ZmMailMsgView.prototype._handleResponseSet =
function(msg, oldMsg, dayViewCallback) {

	var bubblesCreated = false;
	if (this._inviteMsgView) {
		// always show F/B view if in stand-alone message view otherwise, check if reading pane is on
		if (this._inviteMsgView.isActive() && (this._controller.isReadingPaneOn() || (this._controller.isZmMsgController))) {
			bubblesCreated = true;
			appCtxt.notifyZimlets("onMsgView", [msg, oldMsg, this]);
			this._inviteMsgView.showMoreInfo(this._createBubbles.bind(this), dayViewCallback);
		}
		else {
			// resize the message view without F/B view
			this._inviteMsgView.resize(true);
		}
    }

	this._setTags(msg);
	// Remove listener for current msg if it exists
	if (oldMsg) {
		oldMsg.removeChangeListener(this._changeListener);
	}
	msg.addChangeListener(this._changeListener);

	if (msg.cloneOf) {
		msg.cloneOf.addChangeListener(this._changeListener);
	}
	if (oldMsg && oldMsg.cloneOf) {
		oldMsg.cloneOf.removeChangeListener(this._changeListener);
	}

	// reset scroll view to top most
	var htmlElement = this.getHtmlElement();
	htmlElement.scrollTop = 0;
	if (htmlElement.scrollTop != 0 && this._usingIframe) {
		/* situation that happens only on Chrome, without repro steps - bug 55775/57090 */
		AjxDebug.println(AjxDebug.SCROLL, "scrollTop not set to 0. scrollTop=" + htmlElement.scrollTop + " offsetHeight=" + htmlElement.offsetHeight + " scrollHeight=" + htmlElement.scrollHeight + " browser=" + navigator.userAgent);
		AjxDebug.dumpObj(AjxDebug.SCROLL, htmlElement.outerHTML);
		/*
			trying this hack for solution -
			explanation: The scroll bar does not appear if the scrollHeight of the div is bigger than the total height of the iframe and header together (i.e. if htmlElement.scrollHeight >= htmlElement.offsetHeight)
			If the scrollbar does not appear it's set to, and stays 0 when the scrollbar reappears due to resizing the iframe in _resetIframeHeight (which is later, I think always on timer).
			So what I do here is set the height of the iframe to very small (since the default is 150px), so the scroll bar disappears.
			it will reappear when we reset the size in _resetIframeHeight. I hope this will solve the issue.
		*/
		var iframe = this.getIframe();
		if (iframe) {
			iframe.style.height = "1px";
			AjxDebug.println(AjxDebug.SCROLL, "scrollTop after resetting it with the hack =" + htmlElement.scrollTop);
		}

	}

	if (!bubblesCreated) {
		this._createBubbles();
		appCtxt.notifyZimlets("onMsgView", [msg, oldMsg, this]);
	}

	if (!msg.isDraft && msg.readReceiptRequested) {
		this._controller.sendReadReceipt(msg);
	}
};

// This is needed for Gecko only: for some reason, clicking on a local link will
// open the full Zimbra chrome in the iframe :-( so we fake a scroll to the link
// target here. (bug 7927)
ZmMailMsgView.__localLinkClicked =
function(msgView, ev) {
	// note that this function is called in the context of the link ('this' is an A element)
	var id = this.getAttribute("href");
	var el = null;
	var doc = this.ownerDocument;

	if (id.substr(0, 1) == "#") {
		id = id.substr(1);
		el = doc.getElementById(id);
		if (!el) {
			try {
				el = doc.getElementsByName(id)[0];
			} catch(ex) {}
		}
		if (!el) {
			id = decodeURIComponent(id);
			el = doc.getElementById(id);
			if (!el) {
				try {
					el = doc.getElementsByName(id)[0];
				} catch(ex) {}
			}
		}
	}

	// attempt #1: doesn't work at all -- we're not scrolling with the IFRAME :-(
	// 		if (el) {
	// 			var pos = Dwt.getLocation(el);
	// 			doc.contentWindow.scrollTo(pos.x, pos.y);
	// 		}

	// attempt #2: works pretty well, but the target node will showup at the bottom of the frame
	// 		var foo = doc.createElement("a");
	// 		foo.href = "#";
	// 		foo.innerHTML = "foo";
	// 		el.parentNode.insertBefore(foo, el);
	// 		foo.focus();

	// the final monstrosity: scroll the containing DIV
	// (that is the whole msgView).  Note we have to take
	// into account the headers, "display images", etc --
	// so we add iframe.offsetTop/Left.
	if (el) {
		var div = msgView.getHtmlElement();
		var iframe = msgView.getIframe();
		var pos = Dwt.getLocation(el);
		div.scrollTop = pos.y + iframe.offsetTop - 20; // fuzz factor necessary for unknown reason :-(
		div.scrollLeft = pos.x + iframe.offsetLeft;
	}
	if (ev) {
		ev.stopPropagation();
		ev.preventDefault();
	}
	return false;
};

ZmMailMsgView.prototype.hasValidHref =
function (node) {
	// Bug 22958: IE can throw when you try and get the href if it doesn't like
	// the value, so we wrap the test in a try/catch.
	// hrefs formatted like http://www.name@domain.com can cause this to happen.
	try {
		var href = node.href;
		return ZmMailMsgView._URL_RE.test(href) || ZmMailMsgView._MAILTO_RE.test(href);
	} catch (e) {
		return false;
	}
};

// Dives recursively into the given DOM node.  Creates ObjectHandlers in text
// nodes and cleans the mess in element nodes.  Discards by default "script",
// "link", "object", "style", "applet" and "iframe" (most of them shouldn't
// even be here since (1) they belong in the <head> and (2) are discarded on
// the server-side, but we check, just in case..).
ZmMailMsgView.prototype._processHtmlDoc =
function() {

	var parent = this._usingIframe ? this.getDocument() : this._containerEl;
	if (!parent) { return; }

	DBG.timePt("Starting ZmMailMsgView.prototype._processHtmlDoc");
	// bug 8632
	var images = parent.getElementsByTagName("img");
	if (images.length > 0) {
		var length = images.length;
		for (var i = 0; i < images.length; i++) {
			this._checkImgInAttachments(images[i]);
		}
	}

	//Find Zimlet Objects lazly
	this.lazyFindMailMsgObjects(500);

	DBG.timePt("-- END _processHtmlDoc");
};

ZmMailMsgView.prototype.lazyFindMailMsgObjects = function(interval) {

    var isSpam = (this._msg && this._msg.folderId == ZmOrganizer.ID_SPAM);
    if (this._objectManager && !this._disposed && !isSpam) {
		this._lazyCreateObjectManager();
		this._objectsAction = new AjxTimedAction(this, this._findMailMsgObjects);
		AjxTimedAction.scheduleAction(this._objectsAction, ( interval || 500 ));
	}
};

ZmMailMsgView.prototype._findMailMsgObjects =
function() {
	var doc = this.getDocument();
	if (doc) {
		var container = this.getContentContainer();
		this._objectManager.processObjectsInNode(doc, container);
	}
};

ZmMailMsgView.prototype._checkImgInAttachments =
function(img) {
    if (!this._msg) { return; }

    if (img.getAttribute("zmforced")){
        img.className = "InlineImage";
        return;
    }

	var attachments = this._msg.attachments;
	var csfeMsgFetch = appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI);
	try {
		var src = img.getAttribute("src") || img.getAttribute("dfsrc");
	}
	catch(e) {
		AjxDebug.println(AjxDebug.DATA_URI, "_checkImgInAttachments: couldn't access attribute src or dfsrc");
	}
	var cid;
	if (/^cid:(.*)/.test(src)) {
		cid = "<" + RegExp.$1 + ">";
	}

	for (var i = 0; i < attachments.length; i++) {
		var att = attachments[i];

		if (att.foundInMsgBody) { continue; }

		if (cid && att.contentId == cid) {
			att.foundInMsgBody = true;
			break;
		} else if (src && src.indexOf(csfeMsgFetch) == 0) {
			var mpId = src.substring(src.lastIndexOf("=") + 1);
			if (mpId == att.part) {
				att.foundInMsgBody = true;
				break;
			}
		} else if (att.contentLocation && src) {
			var filename = src.substring(src.lastIndexOf("/") + 1);
			if (filename == att.fileName) {
				att.foundInMsgBody = true;
				break;
			}
		}
	}
};

ZmMailMsgView.prototype._fixMultipartRelatedImages =
function(msg, parent) {
	// fix <img> tags
	var images = parent.getElementsByTagName("img");
	var hasExternalImages = false;
	if (this._usingIframe) {
		var self = this;
		var onload = function() {
			//resize iframe onload of image
			ZmMailMsgView._resetIframeHeight(self);
			this.onload = null; // *this* is reference to <img> el.
		};
	}
	for (var i = 0; i < images.length; i++) {
		var img = images[i];
		var external = ZmMailMsgView._isExternalImage(img);	// has "dfsrc" attr
		if (!external) { //Inline image
			ZmMailMsgView.__unfangInternalImage(msg, img, "src", false);
			if (onload) {
				img.onload = onload;
			}
		}
        else {
			img.src = "/img/zimbra/1x1-trans.png";
			img.setAttribute('savedDisplayMode', img.style.display);
			img.style.display = 'none';
        }
		hasExternalImages = external || hasExternalImages;
	}
	// fix all elems with "background" attribute
	hasExternalImages = this._fixMultipartRelatedImagesRecurse(msg, this._usingIframe ? parent.body : parent) || hasExternalImages;

	// did we get them all?
	return !hasExternalImages;
};

ZmMailMsgView.prototype._fixMultipartRelatedImagesRecurse =
function(msg, node) {

	var hasExternalImages = false;

	function recurse(node){
		var child = node.firstChild;
		while (child) {
			if (child.nodeType == AjxUtil.ELEMENT_NODE) {
				hasExternalImages = ZmMailMsgView.__unfangInternalImage(msg, child, "background", true) || hasExternalImages;
				recurse(child);
			}
			child = child.nextSibling;
		}
	}

	if (node.innerHTML.indexOf("dfbackground") != -1) {
		recurse(node);
	}
	else if (node.attributes && node.getAttribute("dfbackground") != -1) {
		hasExternalImages = ZmMailMsgView.__unfangInternalImage(msg, node, "background", true);	
	}
	
	if (!hasExternalImages && $(node).find("table[dfbackground], td[dfbackground]").length) {
		hasExternalImages = true;
	}

	return hasExternalImages;
};

/**
 * Determines if an img element references an external image
 * @param elem {HTMLelement}
 * @return {Boolean} true if image is external
 */
ZmMailMsgView._isExternalImage = 
function(elem) {
	if (!elem) {
		return false;
	}
	return Boolean(elem.getAttribute("dfsrc"));
}

/**
 * Reverses the work of the (server-side) defanger, so that images are displayed.
 * 
 * @param {ZmMailMsg}	msg			mail message
 * @param {Element}		elem		element to be checked (img)
 * @param {string}		aname		attribute name
 * @param {boolean}		external	if true, look only for external images
 * 
 * @return	true if the image is external
 */
ZmMailMsgView.__unfangInternalImage =
function(msg, elem, aname, external) {
	
	var avalue, pnsrc;

	if (typeof aname == "undefined") {
		return false;
	}

	try {
		if (external) {
			avalue = elem.getAttribute("df" + aname);
		}
		else {
			pnsrc = avalue = elem.getAttribute("pn" + aname);
			avalue = avalue || elem.getAttribute(aname);
		}
	}
	catch(e) {
		AjxDebug.println(AjxDebug.DATA_URI, "__unfangInternalImage: couldn't access attribute " + aname);
	}

	if (typeof avalue !== "undefined" && avalue) {
		if (avalue.substr(0,4) == "cid:") {
			if (typeof msg == "undefined") {
				return false;
			}

			var cid = "<" + AjxStringUtil.urlComponentDecode(avalue.substr(4)) + ">"; // Parse percent-escaping per bug #52085 (especially %40 to @)
			avalue = msg.getContentPartAttachUrl(ZmMailMsg.CONTENT_PART_ID, cid);
			if (avalue) {
				elem.setAttribute(aname, avalue);
			}
			return false;
		} else if (avalue.substring(0,4) == "doc:") {
			avalue = [appCtxt.get(ZmSetting.REST_URL), ZmFolder.SEP, avalue.substring(4)].join('');
			if (avalue) {
				elem.setAttribute(aname, avalue);
				return false;
			}
		} else if (pnsrc) { // check for content-location verison
			if (typeof msg == "undefined") {
				return false;
			}

			avalue = msg.getContentPartAttachUrl(ZmMailMsg.CONTENT_PART_LOCATION, avalue);
			if (avalue) {
				elem.setAttribute(aname, avalue);
				return false;
			}
		} else if (avalue.substring(0,5) == "data:") {
			return false;
		}
		return true;	// not recognized as inline img
	}
	return false;
};

ZmMailMsgView.prototype._createDisplayImageClickClosure =
function(msg, parent, id) {
	var self = this;
	return function(ev) {
        var target = DwtUiEvent.getTarget(ev),
            targetId = target ? target.id : null,
            addrToAdd = "";
        var diEl = document.getElementById(id);
        
        //This is required in case of the address is marked as trusted, the function is called without any target being set
        var force = (msg && msg.showImages) ||  appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES);

        if (!force) {
            if (!targetId) { return; }
            if (targetId.indexOf("domain") != -1) {
                //clicked on domain
                addrToAdd = msg.sentByDomain;
            }
            else if (targetId.indexOf("email") != -1) {
                //clicked on email
                addrToAdd = msg.sentByAddr;
            }
            else if (targetId.indexOf("dispImgs") != -1) {
               //do nothing here - just load the images
            }
            else if (targetId.indexOf("close") != -1) {
				Dwt.setVisible(diEl, false);
                return;
            }
            else {
                //clicked elsewhere in the info bar - DO NOTHING AND RETURN
                return;
            }
        }
        //Create a modifyprefs req and add the addr to modify
        if (addrToAdd) {
            var trustedList = self.getTrustedSendersList();
            trustedList.add(addrToAdd, null, true);
			var callback = self._addTrustedAddrCallback.bind(self, addrToAdd);
			var errorCallback = self._addTrustedAddrErrorCallback.bind(self, addrToAdd); 
            self._controller.addTrustedAddr(trustedList.getArray(), callback, errorCallback);
        }

		var images = parent.getElementsByTagName("img");
		var onload = null;
		if (self._usingIframe) {
			onload = function() {            
				ZmMailMsgView._resetIframeHeight(self);
				this.onload = null; // *this* is reference to <img> el.
				DBG.println(AjxDebug.DBG3, "external image onload called for  " + this.src);
			};
		}
		for (var i = 0; i < images.length; i++) {
			var dfsrc = images[i].getAttribute("dfsrc");
			if (dfsrc && dfsrc.match(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\_\.]*(\?\S+)?)?)?/)) {
                images[i].onload = onload;
				// Fix for IE: Over HTTPS, http src urls for images might cause an issue.
				try {
					DBG.println(AjxDebug.DBG3, "displaying external images. src = " + images[i].src);
					images[i].src = ''; //unload it first
					images[i].src = images[i].getAttribute("dfsrc");
					DBG.println(AjxDebug.DBG3, "displaying external images. src is now = " + images[i].src);
				} catch (ex) {
					// do nothing
				}
				images[i].style.display = images[i].getAttribute('savedDisplayMode');
			}
		}
		//determine if any tables or table cells have an external background image
		var tableCells = $(parent).find("table[dfbackground], td[dfbackground]");
		for (var i=0; i<tableCells.length; i++) {
			var dfbackground = $(tableCells[i]).attr("dfbackground");
			if (ZmMailMsgView._URL_RE.test(dfbackground)) {
				$(tableCells[i]).attr("background", dfbackground);
			}
		}

		Dwt.setVisible(diEl, false);
		self._htmlBody = self.getContentContainer().innerHTML;
		if (msg) {
			msg.setHtmlContent(self._htmlBody);
			msg.showImages = true;
		}
        //Make sure the link is not followed
        return false;
	};
};

ZmMailMsgView.prototype._resetIframeHeightOnTimer =
function(attempt) {
	
	if (!this._usingIframe) { return; }

	DBG.println(AjxDebug.DBG1, "_resetIframeHeightOnTimer attempt: " + (attempt != null ? attempt : "null"));
	// Because sometimes our view contains images that are slow to download, wait a
	// little while before resizing the iframe.
	var act = this._resizeAction = new AjxTimedAction(this, ZmMailMsgView._resetIframeHeight, [this, attempt]);
	AjxTimedAction.scheduleAction(act, 200);
};

ZmMailMsgView.prototype._makeHighlightObjectsDiv =
function(origText) {
	var self = this;
	function func() {
		var div = document.getElementById(self._highlightObjectsId);
		div.innerHTML = ZmMsg.pleaseWaitHilitingObjects;
		setTimeout(function() {
			self.highlightObjects(origText);
            div.parentNode.removeChild(div);
            ZmMailMsgView._resetIframeHeight(self);
        }, 3);
		return false;
	}
	// avoid closure memory leaks
	(function() {
		var infoBarDiv = document.getElementById(self._infoBarId);
		if (infoBarDiv) {
			self._highlightObjectsId = ZmId.getViewId(self._viewId, ZmId.MV_HIGHLIGHT_OBJ, self._mode);
			var subs = {
				id: self._highlightObjectsId,
				text: ZmMsg.objectsNotDisplayed,
				link: ZmMsg.hiliteObjects
			};
			var html = AjxTemplate.expand("mail.Message#InformationBar", subs);
			infoBarDiv.appendChild(Dwt.parseHtmlFragment(html));

			var div = document.getElementById(subs.id+"_link");
			Dwt.setHandler(div, DwtEvent.ONCLICK, func);
		}
	})();
};

ZmMailMsgView.prototype._stripHtmlComments =
function(html) {
	// bug: 38273 - Remove HTML Comments <!-- -->
	// But make sure not to remove inside style|script tags.
	var regex =  /<(?:!(?:--[\s\S]*?--\s*)?(>)\s*|(?:script|style|SCRIPT|STYLE)[\s\S]*?<\/(?:script|style|SCRIPT|STYLE)>)/g;
	html = html.replace(regex,function(m, $1) {
		return $1 ? '':m;
	});
	return html;
};

// Returns true (the default) if we should display content in an IFRAME as opposed to a DIV.
ZmMailMsgView.prototype._useIframe =
function(isTextMsg, html, isTruncated) {
	return true;
};

// Displays the given content in an IFRAME or a DIV.
ZmMailMsgView.prototype._displayContent =
function(params) {

	var html = params.html || "";
	
	if (!params.isTextMsg) {
		//Microsoft silly smilies
		html = html.replace(/<span style="font-family:Wingdings">J<\/span>/g, "\u263a"); // :)
		html = html.replace(/<span style="font-family:Wingdings">L<\/span>/g, "\u2639"); // :(
	}

	// The info bar allows the user to load external images. We show it if:
	// - msg is HTML
	// - user pref says not to show images up front, or this is Spam folder
	// - we're not already showing images
	// - there are <img> tags OR tags with dfbackground set
	var isSpam = (this._msg && this._msg.folderId == ZmOrganizer.ID_SPAM);
	var imagesNotShown = (!this._msg || !this._msg.showImages);
	
	// As Per ZCS-10127 we need to always show the info bar if its an spam
	this._needToShowInfoBar = isSpam || (!params.isTextMsg &&
		(!appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES)) &&
		imagesNotShown &&
		(/<img/i.test(html) || /<[^>]+dfbackground/.test(html)));

	var displayImages;
	if (this._needToShowInfoBar) {
		displayImages = this._showInfoBar(this._infoBarId);
	}

	var callback;
	var msgSize = (html.length / 1024);
	var maxHighlightSize = appCtxt.get(ZmSetting.HIGHLIGHT_OBJECTS);
	if (params.isTextMsg) {
		if (this._objectManager) {
			if (msgSize <= maxHighlightSize) {
				callback = this.lazyFindMailMsgObjects.bind(this, 500);
			} else {
				this._makeHighlightObjectsDiv(params.origText);
			}
		}
		if (AjxEnv.isSafari) {
			html = "<html><head></head><body>" + html + "</body></html>";
		}
	} else {
		html = this._stripHtmlComments(html);
		if (this._objectManager) {
			var images = html.match(/<img[^>]+>/ig);
			msgSize = (images) ? msgSize - (images.join().length / 1024) : msgSize; // Excluding images in the message
			
			if (msgSize <= maxHighlightSize) {
				callback = this._processHtmlDoc.bind(this);
			} else {
				this._makeHighlightObjectsDiv();
			}
		}
	}

	var msgTruncated;
	this._isMsgTruncated = false;
	if (params.isTruncated) {
		this._isMsgTruncated = true;
		var msgTruncatedDiv = document.getElementById(this._msgTruncatedId);
		if (!msgTruncatedDiv) {
			var infoBarDiv = document.getElementById(this._infoBarId);
			if (infoBarDiv) {
				var subs = {
					id: this._msgTruncatedId,
					text: ZmMsg.messageTooLarge,
					link: ZmMsg.viewEntireMessage
				};
				var msgTruncatedHtml = AjxTemplate.expand("mail.Message#InformationBar", subs);
				msgTruncated = Dwt.parseHtmlFragment(msgTruncatedHtml);
				infoBarDiv.appendChild(msgTruncated);
				Dwt.setHandler(msgTruncated, DwtEvent.ONCLICK, this._handleMsgTruncated.bind(this));
			}
		}
	}

	this._msgBodyDivId = [this._htmlElId, ZmId.MV_MSG_BODY].join("_");
	this._bodyTabGroup.removeAllMembers();
	
	this._usingIframe = this._useIframe(params.isTextMsg, html, params.isTruncated);
	DBG.println(AjxDebug.DBG1, "Use IFRAME: " + this._usingIframe);
	
	if (this._usingIframe) {
		var params1 = {
			parent:					this,
			parentElement:			params.container,
			index:					params.index,
			className:				this._getBodyClass(),
			id:						this._msgBodyDivId,
			hidden:					true,
			html:					"<div>" + (this._cleanedHtml || html) + "</div>",
			noscroll:				!this._scrollWithIframe,
			posStyle:				DwtControl.STATIC_STYLE,
			processHtmlCallback:	callback,
			useKbMgmt:				true,
			title:                  this._getIframeTitle()
		};

		// bug fix #9475 - IE isnt resolving MsgBody class in iframe so set styles explicitly
		if (AjxEnv.isIE) {
			params1.styles = ".MsgBody-text, .MsgBody-text * { font: 10pt monospace; }";
		}

		// TODO: cache iframes
		var ifw = this._ifw = new DwtIframe(params1);
		if (ifw.initFailed) {
			AjxDebug.println(AjxDebug.MSG_DISPLAY, "Message display: IFRAME was not ready");
			appCtxt.setStatusMsg(ZmMsg.messageDisplayProblem);
			return;
		}
		this._iframeId = ifw.getIframe().id;

		var idoc = ifw.getDocument();

		if (AjxEnv.isGeckoBased) {
			// patch local links (pass null as object so it gets called in context of link)
			var geckoScrollCallback = ZmMailMsgView.__localLinkClicked.bind(null, this);
			var links = idoc.getElementsByTagName("a");
			for (var i = links.length; --i >= 0;) {
				var link = links[i];
				if (!link.target) {
					link.onclick = geckoScrollCallback; // has chances to be a local link
				}
			}
		}

		//update root html elment class to reflect user selected font size - so that if we use our relative font size properties in CSS inside (stuff from msgview.css) it would be relative to this and not to the browser default.
		Dwt.addClass(idoc.documentElement, "user_font_size_" + appCtxt.get(ZmSetting.FONT_SIZE));
		Dwt.addClass(idoc.documentElement, "user_font_" + appCtxt.get(ZmSetting.FONT_NAME));

		// assign the right class name to the iframe body
		idoc.body.className = this._getBodyClass() + (params.isTextMsg ? " MsgBody-text" : " MsgBody-html");

		var docOffsetWidth = idoc.body.offsetWidth;

		idoc.body.style.height = "auto"; //see bug 56899 - if the body has height such as 100% or 94%, it causes a problem in FF in calcualting the iframe height. Make sure the height is clear.
		idoc.body.style.width = (docOffsetWidth - 20) + "px";
		idoc.body.style.position = "absolute";

		ifw.getIframe().onload = this._onloadIframe.bind(this, ifw);

		// import the object styles
		var head = idoc.getElementsByTagName("head")[0];
		if (!head) {
			head = idoc.createElement("head");
			idoc.body.parentNode.insertBefore(head, idoc.body);
		}
	
		if (!ZmMailMsgView._CSS) {
			// Make a synchronous request for the CSS. Should we do this earlier?
			var cssUrl = [appContextPath, "/css/msgview.css?v=", cacheKillerVersion, "&locale=", window.appRequestLocaleId, "&skin=", window.appCurrentSkin].join("");
			if (AjxEnv.supported.localstorage) {
				ZmMailMsgView._CSS = localStorage.getItem(cssUrl);
			}
			if (!ZmMailMsgView._CSS) {
				var result = AjxRpc.invoke(null, cssUrl, null, null, true);
				ZmMailMsgView._CSS = result && result.text;
			}
		}
		var style = document.createElement('style');
		var rules = document.createTextNode(ZmMailMsgView._CSS);
		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = rules.nodeValue;
		}
		else {
			style.appendChild(rules);
		}
		head.appendChild(style);
	
		ifw.getIframe().style.visibility = "";

		this._bodyTabGroup.addMember(ifw);

	}
	else {
		var div = this._containerEl = document.createElement("div");
		div.id = this._msgBodyDivId;
		div.className = "MsgBody MsgBody-" + (params.isTextMsg ? "text" : "html");
		var parent = this.getHtmlElement();
		if (!parent) {
			AjxDebug.println(AjxDebug.MSG_DISPLAY, "Message display: DIV was not ready");
			appCtxt.setStatusMsg(ZmMsg.messageDisplayProblem);
			return;
		}
		if (params.index != null) {
			parent.insertBefore(div, parent.childNodes[params.index])
		}
		else {
			parent.appendChild(div);
		}
		div.innerHTML = this._cleanedHtml || html;

		this._makeFocusable(div);
		this._bodyTabGroup.addMember(div);
	}

	if (!params.isTextMsg) {
		this._htmlBody = this.getContentContainer().innerHTML;

		// TODO: only call this if top-level is multipart/related?
		// setup the click handler for the images
		var didAllImages = this._fixMultipartRelatedImages(this._msg, idoc || this._containerEl);
		if (didAllImages) {
			Dwt.setVisible(displayImages, false);
			this._needToShowInfoBar = false;
		} else {
			this._setupInfoBarClicks(displayImages);
		}
	}

	this._resetIframeHeightOnTimer();
	if (callback) {
		callback.run();
	}
};
ZmMailMsgView.prototype._makeIframeProxy = ZmMailMsgView.prototype._displayContent;

ZmMailMsgView.prototype._showInfoBar =
function(parentEl, html, isTextMsg) {

	parentEl = (typeof(parentEl) == "string") ? document.getElementById(parentEl) : parentEl;
	if (!parentEl) { return; }
	
	// prevent appending the "Display Images" info bar more than once
	var displayImages;
	var dispImagesDiv = document.getElementById(this._displayImagesId);
	if (!dispImagesDiv) {
		if (parentEl) {
			var subs = {
				id:			this._displayImagesId,
				text:		ZmMsg.externalImages,
				link:		ZmMsg.displayExternalImages,
				alwaysText:	ZmMsg.alwaysDisplayExternalImages,
				domain:		this._msg.sentByDomain,
				email:		this._msg.sentByAddr,
				or:			ZmMsg.or
			};
			var extImagesHtml = AjxTemplate.expand("mail.Message#ExtImageInformationBar", subs);
			displayImages = Dwt.parseHtmlFragment(extImagesHtml);
			parentEl.appendChild(displayImages);
		}
	}
	return displayImages;
};

ZmMailMsgView.prototype._setupInfoBarClicks =
function(displayImages) {

	var parent = this._usingIframe ? this.getDocument() : this._containerEl;
	var func = this._createDisplayImageClickClosure(this._msg, parent, this._displayImagesId);
	if (displayImages) {
		Dwt.setHandler(displayImages, DwtEvent.ONCLICK, func);
	}
	else if (appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES) ||
			 (this._msg && this._msg.showImages))
	{
		func.call();
	}
};

ZmMailMsgView.prototype._getBodyClass =
function() {
	return "MsgBody";
};

ZmMailMsgView.prototype._addTrustedAddrCallback =
function(addr) {
    this.getTrustedSendersList().add(addr, null, true);
    appCtxt.set(ZmSetting.TRUSTED_ADDR_LIST, this.getTrustedSendersList().getArray());
    var prefApp = appCtxt.getApp(ZmApp.PREFERENCES);
    var func = prefApp && prefApp["refresh"];
    if (func && (typeof(func) == "function")) {
        func.apply(prefApp, [null, addr]);
    }
};

ZmMailMsgView.prototype._addTrustedAddrErrorCallback =
function(addr) {
    this.getTrustedSendersList().remove(addr);
};

ZmMailMsgView.prototype._isTrustedSender =
function(msg) {
    var trustedList = this.getTrustedSendersList();
    if (trustedList.contains(msg.sentByAddr.toLowerCase()) || trustedList.contains(msg.sentByDomain.toLowerCase())){
        return true;
    }
    return false;
};

ZmMailMsgView.prototype.getTrustedSendersList =
function() {
    return this._controller.getApp().getTrustedSendersList();
};

ZmMailMsgView.showMore =
function(elementId, type) {

	var showMore = document.getElementById(this._getShowMoreId(elementId, type));
	if (showMore) {
		Dwt.setVisible(showMore, false);
	}
	var more = document.getElementById(this._getMoreId(elementId, type));
	if (more) {
		more.style.display = "inline";
	}
};

ZmMailMsgView._getShowMoreId =
function(elementId, type) {
	return elementId + 'showmore_' + type;
};

ZmMailMsgView._getMoreId =
function(elementId, type) {
	return elementId + 'more_addrs_' + type;
};

/**
 *
 * formats the array of addresses as HTML with possible "show more" expand link if more than a certain number of addresses are in the field.
 *
 * @param addrs array of addresses
 * @param options
 * @param type some type identifier (one per page)
 * @param om {ZmObjectManager}
 * @param htmlElId - unique view id so it works with multiple views open.
 *
 * returns object with the html and ShowMore link id
 */
ZmMailMsgView.prototype.getAddressesFieldHtmlHelper =
function(addrs, options, type) {

	var addressInfo = {};
	var idx = 0, parts = [];

	for (var i = 0; i < addrs.length; i++) {
		if (i > 0) {
			// no need for separator since we're showing addr bubbles
			parts[idx++] = " ";
		}

		if (i == ZmMailMsgView.MAX_ADDRESSES_IN_FIELD) {
			var showMoreId = ZmMailMsgView._getShowMoreId(this._htmlElId, type);
			addressInfo.showMoreLinkId = showMoreId + "_link";
			var moreId = ZmMailMsgView._getMoreId(this._htmlElId, type);
			parts[idx++] = "<span id='" + showMoreId + "' style='white-space:nowrap'>&nbsp;";
			parts[idx++] = "<a id='" + addressInfo.showMoreLinkId + "' href='' onclick='ZmMailMsgView.showMore(\"" + this._htmlElId + "\", \"" + type + "\"); return false;'>";
			parts[idx++] = ZmMsg.showMore;
			parts[idx++] = "</a></span><span style='display:none;' id='" + moreId + "'>";
		}
		var email = addrs[i];
		if (email.address) {
			parts[idx++] = this._getBubbleHtml(email, options);
		}
		else {
			parts[idx++] = AjxStringUtil.htmlEncode(email.name);
		}
	}
	if (addressInfo.showMoreLinkId) {
		parts[idx++] = "</span>";
	}
	addressInfo.html =  parts.join("");
	return addressInfo;
};

ZmMailMsgView.prototype._getBubbleHtml = function(addr, options) {
	if (!addr) {
		return "";
	}

	options = options || {};

	addr = addr.isAjxEmailAddress ? addr : new AjxEmailAddress(addr);

	var canExpand = addr.isGroup && addr.canExpand && appCtxt.get("EXPAND_DL_ENABLED"),
		ctlr = this._controller;

	if (canExpand && !this._aclv) {
		// create a hidden ZmAutocompleteListView to handle DL expansion
		var aclvParams = {
			dataClass:		    appCtxt.getAutocompleter(),
			matchValue:		    ZmAutocomplete.AC_VALUE_FULL,
			options:		    { massDLComplete:true },
			selectionCallback:	ctlr._dlAddrSelected.bind(ctlr),
			contextId:		    this.toString()
		};
		this._aclv = new ZmAutocompleteListView(aclvParams);
	}

	// We'll be creating controls (bubbles) later, so we provide the tooltip now and let the control manage
	// it instead of the zimlet framework.
	var id = ZmId.create({
		app:            ZmId.APP_MAIL,
		containingView: this._viewId,
		field:          ZmId.FLD_PARTICIPANT
	});

	var bubbleParams = {
		parent:		appCtxt.getShell(),
		parentId:	this._htmlElId,
		addrObj:	addr,
		id:			id,
		canExpand:	canExpand,
		email:		addr.address
	};
	ZmAddressInputField.BUBBLE_OBJ_ID[id] = this._htmlElId;	// pretend to be a ZmAddressInputField for DL expansion
	this._bubbleParams[id] = bubbleParams;

	return "<span id='" + id + "'></span>";
};

ZmMailMsgView.prototype._clearBubbles = function() {

	if (this._bubbleList) {
		this._bubbleList.clear();
	}
	this._bubbleList = new ZmAddressBubbleList();
	var ctlr = this._controller;
	this._bubbleList.addSelectionListener(ctlr._bubbleSelectionListener.bind(ctlr));
	this._bubbleList.addActionListener(ctlr._bubbleActionListener.bind(ctlr));
	this._bubbleParams = {};
};

ZmMailMsgView.prototype._createBubbles = function() {

	for (var id in this._bubbleParams) {
		// make sure SPAN was actually added to DOM (may have been ignored by template, for example)
		if (!document.getElementById(id)) {
			continue;
		}
		var bubbleParams = this._bubbleParams[id];
		if (bubbleParams.created) {
			continue;
		}
		bubbleParams.created = true;
		var bubble = new ZmAddressBubble(bubbleParams);
		bubble.replaceElement(id);
		if (this._bubbleList) {
			this._bubbleList.add(bubble);
			this._headerTabGroup.addMember(bubble);
		}
	}
};

/**
 *
 * formats the array of addresses as HTML with possible "show more" expand link if more than a certain number of addresses are in the field.
 *
 * @param addrs array of addresses
 * @param options
 * @param type some type identifier (one per page)
 *
 * returns object with the html and ShowMore link id
 */
ZmMailMsgView.prototype.getAddressesFieldInfo =
function(addrs, options, type, htmlElId) {
	return this.getAddressesFieldHtmlHelper(addrs, options, type, this._objectManager, htmlElId || this._htmlElId);
};

ZmMailMsgView.prototype._renderMessage =
function(msg, container, callback) {
	
	this._renderMessageHeader(msg, container);
	this._renderMessageBody(msg, container, callback);
	this._renderMessageFooter(msg, container);
	Dwt.setLoadedTime("ZmMailItem");
};

ZmMailMsgView.prototype._renderMessageHeader =
function(msg, container, doNotClearBubbles) {

	if (!doNotClearBubbles) {
		this._clearBubbles();
	}

	this._renderInviteToolbar(msg, container);
	
	var ai = this._getAddrInfo(msg);
	
	var subject = AjxStringUtil.htmlEncode(msg.subject || ZmMsg.noSubject);
	var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
	// bug fix #31512 - if no sent date then display received date
	var date = new Date(msg.sentDate || msg.date);
	var dateString = dateFormatter.format(date);

	var additionalHdrs = [];
	var invite = msg.invite;
	var autoSendTime = AjxUtil.isDate(msg.autoSendTime) ? AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM).format(msg.autoSendTime) : null;

	if (msg.attrs) {
		for (var hdrName in ZmMailMsgView.displayAdditionalHdrsInMsgView) {
			if (msg.attrs[hdrName]) {
				additionalHdrs.push({hdrName:ZmMailMsgView.displayAdditionalHdrsInMsgView[hdrName], hdrVal: msg.attrs[hdrName]});
			}
		}
	}

	var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);
	
	var attachmentsCount = msg.getAttachmentCount(true);

	// do we add a close button in the header section?

	var folder = appCtxt.getById(msg.folderId);
	var isSyncFailureMsg = (folder && folder.nId == ZmOrganizer.ID_SYNC_FAILURES);
    if (!msg.showImages) {
        msg.showImages = folder && folder.isFeed();
    }

	this._hdrTableId		= ZmId.getViewId(this._viewId, ZmId.MV_HDR_TABLE, this._mode);
	var reportBtnCellId		= ZmId.getViewId(this._viewId, ZmId.MV_REPORT_BTN_CELL, this._mode);
	this._expandRowId		= ZmId.getViewId(this._viewId, ZmId.MV_EXPAND_ROW, this._mode);

	// the message view adapts to whatever height the image has, but
	// more than 96 pixels is a bit silly...
	var imageURL = ai.sentByContact && ai.sentByContact.getImageUrl(48, 96),
		imageAltText = imageURL && ai.sentByContact && ai.sentByContact.getFullName();

	var subs = {
		id: 				this._htmlElId,
		hdrTableId: 		this._hdrTableId,
		hdrTableTopRowId:	ZmId.getViewId(this._viewId, ZmId.MV_HDR_TABLE_TOP_ROW, this._mode),
		expandRowId:		this._expandRowId,
		attachId:			this._attLinksId,
		infoBarId:			this._infoBarId,
		subject:			subject,
		imageURL:			imageURL || ZmZimbraMail.DEFAULT_CONTACT_ICON,
		imageAltText:		imageAltText || ZmMsg.noContactImage,
		dateString:			dateString,
		hasAttachments:		(attachmentsCount != 0),
		attachmentsCount:	attachmentsCount,
		bwo:                ai.bwo,
		bwoAddr:            ai.bwoAddr,
		bwoId:              ZmId.getViewId(this._viewId, ZmId.CMP_BWO_SPAN, this._mode)
	};

	if (msg.isHighPriority || msg.isLowPriority) {
		subs.priority =			msg.isHighPriority ? "high" : "low";
		subs.priorityImg =		msg.isHighPriority ? "ImgPriorityHigh_list" : "ImgPriorityLow_list";
		subs.priorityDivId =	ZmId.getViewId(this._view, ZmId.MV_PRIORITY);
	}

	if (invite && !invite.isEmpty() && this._inviteMsgView) {
		this._getInviteSubs(subs, ai.sentBy, ai.sentByAddr, ai.sender ? ai.fromAddr : null);
	}
	else {
		subs.sentBy = ai.sentBy;
		subs.sentByNormal = ai.sentByAddr;
		subs.sentByAddr = ai.sentByAddr;
		subs.obo = ai.obo;
		subs.oboAddr = ai.oboAddr;
		subs.oboId = ZmId.getViewId(this._viewId, ZmId.CMP_OBO_SPAN, this._mode)
		subs.addressTypes = ai.addressTypes;
		subs.participants = ai.participants;
		subs.reportBtnCellId = reportBtnCellId;
		subs.isSyncFailureMsg = isSyncFailureMsg;
		subs.autoSendTime = autoSendTime;
		subs.additionalHdrs = additionalHdrs;
		subs.isOutDated = invite && invite.isEmpty();
	}

	var template = (invite && !invite.isEmpty() && this._inviteMsgView)
		? "mail.Message#InviteHeader" : "mail.Message#MessageHeader";
	var html = AjxTemplate.expand(template, subs);

	var el = container || this.getHtmlElement();
	el.setAttribute('aria-label', subject);
	el.appendChild(Dwt.parseHtmlFragment(html));
	this._headerElement = Dwt.byId(this._htmlElId + "_headerElement");
	this._makeFocusable(this._headerElement);

	this._headerTabGroup.removeAllMembers();
	this._headerTabGroup.addMember(this._headerElement);

    if (this._inviteMsgView) {
        if (this._inviteToolbarCellId && this._inviteToolbarCellId && this._inviteMsgView._inviteToolbar) {
            this._inviteMsgView._inviteToolbar.reparentHtmlElement(this._inviteToolbarCellId, 0);
        }
        if (this._calendarSelectCellId && this._inviteMsgView._inviteMoveSelect) {
            this._inviteMsgView._inviteMoveSelect.reparentHtmlElement(this._calendarSelectCellId, 0);
        }
        this._inviteMsgView.repositionCounterToolbar(this._hdrTableId);
		this._headerTabGroup.addMember(this._inviteMsgView._inviteToolbar);
    }


	/**************************************************************************/
	/* Add to DOM based on Id's used to generate HTML via templates           */
	/**************************************************************************/
	// add the report button if applicable
	var reportBtnCell = document.getElementById(reportBtnCellId);
	if (reportBtnCell) {
		var id = ZmId.getButtonId(this._mode, ZmId.REPORT, ZmId.MSG_VIEW);
		var reportBtn = new DwtButton({parent:this, id:id, parentElement:reportBtnCell});
		reportBtn.setText(ZmMsg.reportSyncFailure);
		reportBtn.addSelectionListener(this._reportButtonListener.bind(this, msg));
	}

	if (this._hasShareToolbar) {
		var topToolbar = this._getShareToolbar();
		topToolbar.reparentHtmlElement(container);
		topToolbar.setVisible(Dwt.DISPLAY_BLOCK);
		this._headerTabGroup.addMember(topToolbar);
	}
};

// Returns a hash with what we need to show the message's address headers
ZmMailMsgView.prototype._getAddrInfo =
function(msg) {
	
	var acctId = appCtxt.getActiveAccount().id;
	var cl;
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) && appCtxt.getApp(ZmApp.CONTACTS).contactsLoaded[acctId]) {
		cl = AjxDispatcher.run("GetContacts");
	}
	var fromAddr = msg.getAddress(AjxEmailAddress.FROM);
	// if we have no FROM address and msg is in an outbound folder, assume current user is the sender
	if (!fromAddr) {
		var folder = msg.folderId && appCtxt.getById(msg.folderId);
		if (folder && folder.isOutbound()) {
			var identity = appCtxt.getIdentityCollection().defaultIdentity;
			if (identity) {
				fromAddr = new AjxEmailAddress(identity.sendFromAddress, AjxEmailAddress.FROM, identity.sendFromDisplay);
			}
		}
	}
	var sender = msg.getAddress(AjxEmailAddress.SENDER); // bug fix #10652 - Sender: header means on-behalf-of
	var sentBy = (sender && sender.address) ? sender : fromAddr;
	var from = AjxStringUtil.htmlEncode(fromAddr ? fromAddr.toString(true) : ZmMsg.unknown);
	var sentByAddr = sentBy && sentBy.getAddress();
    if (sentByAddr) {
        msg.sentByAddr = sentByAddr;
        msg.sentByDomain = sentByAddr.substr(sentByAddr.indexOf("@") + 1);
        msg.showImages = this._isTrustedSender(msg);
    }
	var sentByContact = cl && cl.getContactByEmail(sentBy && sentBy.getAddress()); //bug 78163 originally
	var obo = sender ? fromAddr : null;
	var oboAddr = obo && obo.getAddress();

	var bwo = msg.getAddress(AjxEmailAddress.RESENT_FROM);
	var bwoAddr = bwo ? bwo.getAddress() : null;
	
	// find addresses we may need to search for contacts for, so that we can
	// aggregate them into a single search
	var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
	if (contactsApp) {
		var lookupAddrs = [];
		if (sentBy) { lookupAddrs.push(sentBy); }
		if (obo) { lookupAddrs.push(obo); }
		for (var i = 1; i < ZmMailMsg.ADDRS.length; i++) {
			var type = ZmMailMsg.ADDRS[i];
			if ((type == AjxEmailAddress.SENDER) || (type == AjxEmailAddress.RESENT_FROM)) { continue; }
			var addrs = msg.getAddresses(type).getArray();
			for (var j = 0; j < addrs.length; j++) {
				if (addrs[j]) {
					lookupAddrs.push(addrs[j].address);
				}
			}
		}
		if (lookupAddrs.length > 1) {
			contactsApp.setAddrLookupGroup(lookupAddrs);
		}
	}

	var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);

	if (this._objectManager) {
		this._lazyCreateObjectManager();
		appCtxt.notifyZimlets("onFindMsgObjects", [msg, this._objectManager, this]);
	}

	sentBy = this._getBubbleHtml(sentBy);
	obo = obo && this._getBubbleHtml(fromAddr);
	bwo = bwo && this._getBubbleHtml(bwo);

	var showMoreIds = {};
	var addressTypes = [], participants = {};
	for (var i = 0; i < ZmMailMsg.ADDRS.length; i++) {
		var type = ZmMailMsg.ADDRS[i];
		if ((type == AjxEmailAddress.FROM) || (type == AjxEmailAddress.SENDER) || (type == AjxEmailAddress.RESENT_FROM)) { continue; }

		var addrs = AjxEmailAddress.dedup(msg.getAddresses(type).getArray());

        if (type == AjxEmailAddress.REPLY_TO){  // bug: 79175 - Reply To shouldn't be shown when it matches From
            var k = addrs.length;
            for (var j = 0; j < k;){
                if (addrs[j].address === fromAddr.address){
                    addrs.splice(j,1);
                    k--;
                }
                else {
                    j++;
                }
            }
        }

		if (addrs.length > 0) {
			var prefix = AjxStringUtil.htmlEncode(ZmMsg[AjxEmailAddress.TYPE_STRING[type]]);
			var addressInfo = this.getAddressesFieldInfo(addrs, options, type);
			addressTypes.push(type);
			participants[type] = { prefix: prefix, partStr: addressInfo.html };
			if (addressInfo.showMoreLinkId) {
			    showMoreIds[addressInfo.showMoreLinkId] = true;
			}
		}
	}
	
	return {
		fromAddr:		fromAddr,
		from:			from,
		sender:			sender,
		sentBy:			sentBy,
		sentByAddr:		sentByAddr,
		sentByContact:	sentByContact,
		obo:			obo,
		oboAddr:		oboAddr,
		bwo:			bwo,
		bwoAddr:		bwoAddr,
		addressTypes:	addressTypes,
		participants:	participants,
        showMoreIds:    showMoreIds
	};
};

ZmMailMsgView.prototype._getInviteSubs =
function(subs, sentBy, sentByAddr, sender, addr) {
	this._inviteMsgView.addSubs(subs, sentBy, sentByAddr, sender ? addr : null);
    var imv = this._inviteMsgView;
    if (imv._inviteToolbar && imv._inviteToolbar.getVisible()) {
        subs.toolbarCellId = this._inviteToolbarCellId =
            [this._viewId, "inviteToolbarCell"].join("_");
    }
    if (imv._inviteMoveSelect && imv._inviteMoveSelect.getVisible()) {
        subs.calendarSelectCellId = this._calendarSelectCellId =
            [this._viewId, "calendarSelectToolbarCell"].join("_");
    }
};

ZmMailMsgView.prototype._renderInviteToolbar =
function(msg, container) {

	this._dateObjectHandlerDate = new Date(msg.sentDate || msg.date);
	this._hasShareToolbar = this._hasSubToolbar = false;

	var invite = msg.invite;
	var ac = window.parentAppCtxt || window.appCtxt;

	if ((ac.get(ZmSetting.CALENDAR_ENABLED) || ac.multiAccounts) && 
		(invite && !invite.isEmpty() && invite.type != "task"))
	{
		if (!this._inviteMsgView) {
			this._inviteMsgView = new ZmInviteMsgView({parent:this, mode:this._mode});
		}
		this._inviteMsgView.set(msg);
	}
	else if (appCtxt.get(ZmSetting.SHARING_ENABLED) && msg.share &&
             ZmOrganizer.normalizeId(msg.folderId) != ZmFolder.ID_TRASH &&
             ZmOrganizer.normalizeId(msg.folderId) != ZmFolder.ID_SENT &&
             appCtxt.getActiveAccount().id != msg.share.grantor.id)
	{
		AjxDispatcher.require("Share");
		var action = msg.share.action;
		var isNew = action == ZmShare.NEW;
		var isEdit = action == ZmShare.EDIT;
		var folder = appCtxt.getById(msg.folderId);
		var isDataSource = (folder && folder.isDataSource(null, true) && (msg.folderId != ZmFolder.ID_INBOX));

		if (!isDataSource &&
			(isNew || (isEdit && !this.__hasMountpoint(msg.share))) &&
			msg.share.link.perm)
		{
			this._hasShareToolbar = true;
		}
	}
	else if (msg.subscribeReq && msg.folderId != ZmFolder.ID_TRASH) {
		var topToolbar = this._getSubscribeToolbar(msg.subscribeReq);
		topToolbar.reparentHtmlElement(container);
		topToolbar.setVisible(Dwt.DISPLAY_BLOCK);
		this._hasSubToolbar = true;
	}
};

/**
 * Renders the message body. There is a chance a server call will be made to fetch an alternative part.
 * 
 * @param {ZmMailMsg}	msg
 * @param {Element}		container
 * @param {callback}	callback
 */
ZmMailMsgView.prototype._renderMessageBody =
function(msg, container, callback, index) {

	var htmlMode = appCtxt.get(ZmSetting.VIEW_AS_HTML);
	var contentType = htmlMode ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN;
	msg.getBodyPart(contentType, this._renderMessageBody1.bind(this, {
        msg:        msg,
        container:  container,
        callback:   callback,
        index:      index
    }));
};

// The second argument 'part' is added to the callback by getBodyPart() above. We ignore it
// and just get the body parts from the loaded msg.
ZmMailMsgView.prototype._renderMessageBody1 = function(params, part) {

	var msg = params.msg,
	    htmlMode = appCtxt.get(ZmSetting.VIEW_AS_HTML),
	    preferredContentType = params.forceType || (htmlMode ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN),
        hasHtmlPart = (preferredContentType === ZmMimeTable.TEXT_HTML && msg.hasContentType(ZmMimeTable.TEXT_HTML)) || msg.hasInlineImage(),
        hasMultipleBodyParts = msg.hasMultipleBodyParts(),
        bodyParts = hasMultipleBodyParts ? msg.getBodyParts(preferredContentType) : [ msg.getBodyPart(preferredContentType) || msg.getBodyPart() ],
        invite = msg.invite,
        hasInviteContent = invite && !invite.isEmpty(),
        origText,
        isTextMsg = !hasHtmlPart,
        isTruncated = false,
        hasViewableTextContent = false,
        html = [];

    bodyParts = AjxUtil.collapseList(bodyParts);

    // The server tells us which parts are worth displaying by marking them as body parts. In general,
    // we just append them in order to the output, with some special handling for each based on its content type.

    for (var i = 0; i < bodyParts.length; i++) {

        var bp = bodyParts[i],
            ct = bp.contentType,
            content = this._getBodyContent(bp),
            isImage = ZmMimeTable.isRenderableImage(ct),
            isHtml = (ct === ZmMimeTable.TEXT_HTML),
            isPlain = (ct === ZmMimeTable.TEXT_PLAIN);

        isTruncated = isTruncated || this.isTruncated(bp);

        // first let's check for invite notes and use those as content if present
        if (hasInviteContent && !hasMultipleBodyParts) {
            if (!msg.getMimeHeader(ZmMailMsg.HDR_INREPLYTO)) {
                // Hack - bug 70603 -  Do not truncate the message for forwarded invites
                // The InReplyTo rfc822 header would be present in most of the forwarded invites
                content = ZmInviteMsgView.truncateBodyContent(content, isHtml);
            }
            // if the notes are empty, don't bother rendering them
            var tmp = AjxStringUtil.stripTags(content);
            if (!AjxStringUtil._NON_WHITESPACE.test(tmp)) {
                content = "";
            }
        }

        // Handle the part based on its Content-Type

        // images
        if (isImage) {
            var src = (hasMultipleBodyParts && content.length > 0) ? content : msg.getUrlForPart(bp),
                classAttr = hasMultipleBodyParts ? "class='InlineImage' " : " ";

            content = "<img " + [ "zmforced='1' " + classAttr + "src='" + src + "'>"].join("");
        }

        // calendar part in ICS format
        else if (ct === ZmMimeTable.TEXT_CAL) {
            content = ZmMailMsg.getTextFromCalendarPart(bp);
            content = AjxStringUtil.htmlEncode(content);
        }

        // HTML
        else if (isHtml) {
            if (htmlMode) {
                // fix broken inline images - take one like this: <img dfsrc="http:...part=1.2.2">
                // and make it look like this: <img dfsrc="cid:DWT123"> by looking up the cid for that part
                if (msg._attachments && ZmMailMsgView.IMG_FIX_RE.test(content)) {
                    var partToCid = {};
                    for (var j = 0; j < msg._attachments.length; j++) {
                        var att = msg._attachments[j];
                        if (att.contentId) {
                            partToCid[att.part] = att.contentId.substring(1, att.contentId.length - 1);
                        }
                    }
                    content = content.replace(ZmMailMsgView.IMG_FIX_RE, function(s, p1, p2, p3) {
                        return partToCid[p2] ? [ p1, '"cid:', partToCid[p2], '"', p3 ].join("") : s;
                    });
                }
            }
            else {
                // this can happen if a message only has an HTML part and the user wants to view mail as text
                content = "<div style='white-space:pre-wrap;'>" + AjxStringUtil.htmlEncode(AjxStringUtil.convertHtml2Text(content)) + "</div>"
            }
        }

        // plain text
        else if (isPlain) {
            origText = content;
            if (bp.format === ZmMimeTable.FORMAT_FLOWED) {
                var wrapParams = {
                    text:		content,
                    isFlowed:	true
                }
                content = AjxStringUtil.wordWrap(wrapParams);
            }
            content = AjxStringUtil.convertToHtml(content);
            if (content && hasMultipleBodyParts && hasHtmlPart) {
                content = "<pre>" + content + "</pre>";
            }
        }

        // something else
        else {
            content = AjxStringUtil.convertToHtml(content);
        }

        // wrap it in a DIV to be safe
        if (content && content.length) {
            if (!isImage && AjxStringUtil.trimHtml(content).length > 0) {
                content = "<div>" + content + "</div>";
                hasViewableTextContent = true;
            }
            html.push(content);
        }
    }

    // Handle empty messages
    if (!hasMultipleBodyParts && !hasViewableTextContent && msg.hasNoViewableContent()) {
        // if we got nothing for one alternative type, try the other
        if (msg.hasContentType(ZmMimeTable.MULTI_ALT) && !params.forceType) {
            var otherType = (preferredContentType === ZmMimeTable.TEXT_HTML) ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML;
            params.forceType = otherType;
            msg.getBodyPart(otherType, this._renderMessageBody1.bind(this, params));
            return;
        }
        var empty = AjxTemplate.expand("mail.Message#EmptyMessage");
        html.push(content ? [empty, content].join("<br><br>") : empty);
    }

    if (html.length > 0) {
        this._displayContent({
            container:		params.container || this.getHtmlElement(),
            html:			html.join(""),
            isTextMsg:		isTextMsg,
            isTruncated:	isTruncated,
            index:			params.index,
            origText:		origText
        });
    }

    this._completeMessageBody(params.callback, isTextMsg);
};

ZmMailMsgView.prototype.isTruncated =
function(part) {
	return part.isTruncated;
};

ZmMailMsgView.prototype._completeMessageBody = function(callback, isTextMsg) {

	// Used in ZmConvView2._setExpansion : if false, create the message body (the
	// first time a message is expanded).
	this._msgBodyCreated = true;
	this._setAttachmentLinks(AjxUtil.isBoolean(isTextMsg) ? isTextMsg : appCtxt.get(ZmSetting.VIEW_AS_HTML));

	if (callback) {
        callback.run();
    }
};

ZmMailMsgView.prototype._getBodyContent =
function(bodyPart) {
	return bodyPart ? bodyPart.getContent() : "";
};

ZmMailMsgView.prototype._renderMessageFooter = function(msg, container) {};

ZmMailMsgView.prototype._setTags =
function(msg) {
	if (!msg) {
		msg = this._item;
	}
	if (msg && msg.cloneOf) {
		msg = msg.cloneOf;
	}
	//use the helper to get the tags.
	var tagsHtml = ZmTagsHelper.getTagsHtml(msg, this);

	var table = document.getElementById(this._hdrTableId);
	if (!table) { return; }
	var tagRow = $(table).find(document.getElementById(this._tagRowId));
	
	if (tagRow.length) {
		tagRow.remove();
	}
	if (tagsHtml.length > 0) {
		var cell =  this._insertTagRow(table, this._tagCellId);
		cell.innerHTML = tagsHtml;
	}
};

ZmMailMsgView.prototype._insertTagRow =
function(table, tagCellId) {
	
	if (!table) { return; }
	
	var tagRow = table.insertRow(-1);
	tagRow.id = this._tagRowId;
	var tagLabelCell = tagRow.insertCell(-1);
	tagLabelCell.className = "LabelColName";
	tagLabelCell.innerHTML = ZmMsg.tags + ":";
	tagLabelCell.style.verticalAlign = "middle";
	var tagCell = tagRow.insertCell(-1);
	tagCell.id = tagCellId;
	return tagCell;
};


// Types of links for each attachment
ZmMailMsgView.ATT_LINK_MAIN			= "main";
ZmMailMsgView.ATT_LINK_CALENDAR		= "calendar";
ZmMailMsgView.ATT_LINK_DOWNLOAD		= "download";
ZmMailMsgView.ATT_LINK_BRIEFCASE	= "briefcase";
ZmMailMsgView.ATT_LINK_VCARD		= "vcard";
ZmMailMsgView.ATT_LINK_HTML			= "html";
ZmMailMsgView.ATT_LINK_REMOVE		= "remove";

ZmMailMsgView.prototype._setAttachmentLinks = function(isTextMsg) {

    this._attachmentLinkIdToFileNameMap = null;
	var attInfo = this._msg.getAttachmentInfo(true, false, isTextMsg);
	var el = document.getElementById(this._attLinksId + "_container");
	if (el) {
		el.style.display = (attInfo.length == 0) ? "none" : "";
	}
	if (attInfo.length == 0) { return; }

	// prevent appending attachment links more than once
	var attLinksTable = document.getElementById(this._attLinksId + "_table");
	if (attLinksTable) { return; }

	var htmlArr = [];
	var idx = 0;
	var imageAttsFound = 0;

	var attColumns = (this._controller.isReadingPaneOn() && this._controller.isReadingPaneOnRight()) ? 1 : ZmMailMsgView.ATTC_COLUMNS;
	var dividx = idx;	// we might get back here
	htmlArr[idx++] = "<table id='" + this._attLinksId + "_table' role='presentation' border=0 cellpadding=0 cellspacing=0>";

	var attLinkIds = [];
	var rows = 0;
	for (var i = 0; i < attInfo.length; i++) {
		var att = attInfo[i];
		
		if ((i % attColumns) == 0) {
			if (i != 0) {
				htmlArr[idx++] = "</tr>";
			}
			htmlArr[idx++] = "<tr>";
			++rows;
		}

		htmlArr[idx++] = "<td>";
		htmlArr[idx++] = "<table role='presentation' border=0 cellpadding=0 cellspacing=0 style='margin-right:1em; margin-bottom:1px'><tr>";
		htmlArr[idx++] = "<td style='width:18px'>";
		htmlArr[idx++] = AjxImg.getImageHtml({
			imageName: att.linkIcon,
			styles: "position:relative;",
			altText: ZmMsg.attachment
		});
		htmlArr[idx++] = "</td><td style='white-space:nowrap'>";

		if (appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED)) {
			// if attachments are blocked, just show the label
			htmlArr[idx++] = att.label;
		} else {
			// main link for the att name
			var linkArr = [];
			var j = 0;
            var displayFileName = AjxStringUtil.clipFile(att.label, 30);
			// if name got clipped, set up to show full name in tooltip
            if (displayFileName != att.label) {
                if (!this._attachmentLinkIdToFileNameMap) {
					this._attachmentLinkIdToFileNameMap = {};
				}
                this._attachmentLinkIdToFileNameMap[att.attachmentLinkId] = att.label;
            }
			var params = {
				att:	    att,
				id:		    this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_MAIN),
				text:	    displayFileName,
				mid:        att.mid,
				rfc822Part: att.rfc822Part
			};
			var link = ZmMailMsgView.getMainAttachmentLinkHtml(params);
			link = att.isHit ? "<span class='AttName-matched'>" + link + "</span>" : link;
			// objectify if this attachment is an image
			if (att.objectify && this._objectManager) {
				this._lazyCreateObjectManager();
				var imgHandler = this._objectManager.getImageAttachmentHandler();
				idx = this._objectManager.generateSpan(imgHandler, htmlArr, idx, link, {url:att.url});
			} else {
				htmlArr[idx++] = link;
			}
		}
		
		// add any discretionary links depending on the attachment and what's enabled
		var linkCount = 0;
		var vCardLink = (att.links.vcard && !appCtxt.isWebClientOffline());
		if (!appCtxt.isExternalAccount() && (att.size || att.links.html || vCardLink || att.links.download || att.links.briefcase || att.links.importICS)) {
			// size
			htmlArr[idx++] = "&nbsp;(";
			if (att.size) {
				htmlArr[idx++] = att.size;
				htmlArr[idx++] = ") ";
			}
			// convert to HTML
			if (att.links.html && !appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED)) {
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_HTML),
					blankTarget:	true,
					href:			att.url + "&view=html",
					text:			ZmMsg.preview
				};
				htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}
			// save as vCard
			else if (vCardLink) {
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_VCARD),
					jsHref:			true,
					text:			ZmMsg.addressBook
				};
				htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}
			// save locally
			if (att.links.download && !appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED) && !appCtxt.get(ZmSetting.ATTACHMENTS_VIEW_IN_HTML_ONLY)) {
				htmlArr[idx++] = linkCount ? " | " : "";
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_DOWNLOAD),
                    text:			ZmMsg.download
                };
                if (att.url.indexOf("data:") === -1) {
                    params.href = att.url + "&disp=a";
                } else {
                    params.href = att.url;
                    params.download = true;
                    params.downloadLabel = att.label;
                }
                htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}
			// add as Briefcase file
			if (att.links.briefcase && !appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED) && !appCtxt.isWebClientOffline()) {
				htmlArr[idx++] = linkCount ? " | " : "";
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_BRIEFCASE),
					jsHref:			true,
					text:			ZmMsg.addToBriefcase
				};
				htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}
			// add ICS as calendar event
			if (att.links.importICS) {
				htmlArr[idx++] = linkCount ? " | " : "";
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_CALENDAR),
					jsHref:			true,
					text:			ZmMsg.addToCalendar
				};
				htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}
			// remove attachment from msg
			if (att.links.remove && !appCtxt.isWebClientOffline()) {
				htmlArr[idx++] = linkCount ? " | " : "";
				var params = {
					id:				this._getAttachmentLinkId(att.part, ZmMailMsgView.ATT_LINK_REMOVE),
					jsHref:			true,
					text:			ZmMsg.remove
				};
				htmlArr[idx++] = ZmMailMsgView.getAttachmentLinkHtml(params);
				linkCount++;
				attLinkIds.push(params.id);
			}

			// Attachment Link Handlers (optional)
			if (ZmMailMsgView._attachmentHandlers) {
				var contentHandlers = ZmMailMsgView._attachmentHandlers[att.ct];
				var handlerFunc;
				if (contentHandlers) {
					for (var handlerId in contentHandlers) {
						handlerFunc = contentHandlers[handlerId];
						if (handlerFunc) {
							var customHandlerLinkHTML = handlerFunc.call(this, att);
							if (customHandlerLinkHTML) {
								htmlArr[idx++] = " | " + customHandlerLinkHTML;
							}
						}
					}
				}
			}
		}

		htmlArr[idx++] = "</td></tr></table>";
		htmlArr[idx++] = "</td>";

		if (att.ct.indexOf("image") != -1) {
			++imageAttsFound;
		}
	}

	// limit display size.  seems like an attc. row has exactly 16px; we set it
	// to 56px so that it becomes obvious that there are more attachments.
	if (this._limitAttachments != 0 && rows > ZmMailMsgView._limitAttachments) {
		htmlArr[dividx] = "<div style='height:";
		htmlArr[dividx] = this._attcMaxSize;
		htmlArr[dividx] = "px; overflow:auto;' />";
	}
	htmlArr[idx++] = "</tr></table>";

	var allAttParams;
	var hasGeneratedAttachments = false;

	for (var i = 0; i < attInfo.length; i++) {
		hasGeneratedAttachments = hasGeneratedAttachments || att.generated;
	}

	if (!hasGeneratedAttachments && attInfo.length > 1 && !appCtxt.isWebClientOffline()) {
		allAttParams = this._addAllAttachmentsLinks(attInfo, (imageAttsFound > 1), this._msg.subject);
		htmlArr[idx++] = allAttParams.html;
	}

	// Push all that HTML to the DOM
	var attLinksDiv = document.getElementById(this._attLinksId);
	if (attLinksDiv) {
		attLinksDiv.innerHTML = htmlArr.join("");
	}


	// add handlers for individual attachment links
	for (var i = 0; i < attInfo.length; i++) {
		var att = attInfo[i];
		if (att.ct == ZmMimeTable.MSG_RFC822) {
			this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_MAIN, ZmMailMsgView.rfc822Callback, null, this._msg.id, att.part);
		}
		if (att.links.importICS) {
			this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_CALENDAR, ZmMailMsgView.addToCalendarCallback, null, this._msg.id, att.part);
		}
		if (att.links.briefcase) {
			this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_BRIEFCASE, ZmMailMsgView.briefcaseCallback, null, this._msg.id, att.part, att.label.replace(/\x27/g, "&apos;"));
		}
		if (att.links.download) {
            if (att.url.indexOf("data:") === -1) {
                this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_DOWNLOAD, ZmMailMsgView.downloadCallback, null, att.url + "&disp=a");
            }
		}
		if (att.links.vcard) {
			this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_VCARD, ZmMailMsgView.vcardCallback, null, this._msg.id, att.part);
		}
		if (att.links.remove) {
			this._addClickHandler(att.part, ZmMailMsgView.ATT_LINK_REMOVE, this.removeAttachmentCallback, this, att.part);
		}
	}

	var offlineHandler = appCtxt.webClientOfflineHandler;
	if (offlineHandler) {
		var getLinkIdCallback = this._getAttachmentLinkId.bind(this);
		var linkIds = [ZmMailMsgView.ATT_LINK_MAIN, ZmMailMsgView.ATT_LINK_DOWNLOAD];
		offlineHandler._handleAttachmentsForOfflineMode(attInfo, getLinkIdCallback, linkIds);
	}

    // add handlers for "all attachments" links
	if (allAttParams) {
		var downloadAllLink = document.getElementById(allAttParams.downloadAllLinkId);
		if (downloadAllLink) {
			downloadAllLink.onclick = allAttParams.downloadAllCallback;
		}
		var removeAllLink = document.getElementById(allAttParams.removeAllLinkId);
		if (removeAllLink) {
			removeAllLink.onclick = allAttParams.removeAllCallback;
		}
	}

	// add all links to the header tab order
	var attLinks = attLinksDiv.querySelectorAll('A.AttLink');
	for (var i = 0; i < attLinks.length; i++) {
		this._headerTabGroup.addMember(attLinks[i]);
	}
};

/**
 * Returns the HTML for an attachment-related link (an <a> tag). The link will have an HREF
 * or an ID (so an onclick handler can be added after the element has been created).
 * 
 * @param {hash}	params		a hash of params:
 * @param {string}	id			ID for the link
 * @param {string}	href		link target
 * @param {boolean}	noUnderline	if true, do not include an underline style
 * @param {boolean} blankTarget	if true, set target to _blank
 * @param {boolean}	jsHref		empty link target so browser styles it as a link
 * @param {string}	text		visible link text
 * 
 * @private
 */
ZmMailMsgView.getAttachmentLinkHtml =
function(params) {
	var html = [], i = 0;
	html[i++] = "<a class='AttLink' ";
	html[i++] = params.id ? "id='" + params.id + "' " : "";
	html[i++] = !params.noUnderline ? "style='text-decoration:underline' " : "";
	html[i++] = params.blankTarget ? "target='_blank' " : "";
	var href = params.href || (params.jsHref && "javascript:;");
	html[i++] = href ? "href='" + AjxStringUtil.encodeQuotes(AjxStringUtil.htmlEncode(href)) + "' " : "";
    html[i++] = params.download ? (" download='"+(params.downloadLabel||"") + "'") : "";
	if (params.isRfc822) {
		html[i++] = " onclick='ZmMailMsgView.rfc822Callback(\"";
		html[i++] = params.mid;
		html[i++] = "\",\"";
		html[i++] = params.rfc822Part;
		html[i++] = "\"); return false;'";
	}
	html[i++] = "title='" + AjxStringUtil.encodeQuotes(AjxStringUtil.htmlEncode(params.label || params.text));
	html[i++] = "'>" + AjxStringUtil.htmlEncode(params.text) + "</a>";

	return html.join("");
};

/**
 * Returns the HTML for the link for the attachment name (which usually opens the
 * content in a new browser tab).
 * 
 * @param id
 */
ZmMailMsgView.getMainAttachmentLinkHtml =
function(params) {
	var params1 = {
		id:				params.id,
		noUnderline:	true,
		text:			params.text,
		label:			params.att.label
	}; 
	// handle rfc/822 attachments differently
	if (params.att.ct == ZmMimeTable.MSG_RFC822) {
		params1.jsHref      = true;
		params1.isRfc822    = true;
		params1.mid         = params.mid;
		params1.rfc822Part  = params.rfc822Part;
	}
	else {
		// open non-JavaScript URLs in a blank target
		if (params.att.url && params.att.url.indexOf('javascript:') !== 0) {
			params1.blankTarget = true;
		}
		params1.href = params.att.url;
	}
	return ZmMailMsgView.getAttachmentLinkHtml(params1);
};

ZmMailMsgView.prototype._getAttachmentLinkId =
function(part, type) {
	if (!part)
		return;
	return [this._attLinksId, part, type].join("_");
};

// Adds an onclick handler to the link with the given part and type. I couldn't find an easy
// way to pass and bind a variable number of arguments, so went with three, which is the most
// any of the handlers takes.
ZmMailMsgView.prototype._addClickHandler =
function (part, type, func, obj, arg1, arg2, arg3) {
	var id = this._getAttachmentLinkId(part, type);
	var link = document.getElementById(id);
	if (link) {
		link.onclick = func.bind(obj, arg1, arg2, arg3);
	}
};

ZmMailMsgView.prototype._addAllAttachmentsLinks =
function(attachments, viewAllImages, filename) {

	var itemId = this._msg.id;
	if (AjxUtil.isString(filename)) {
		filename = filename.replace(ZmMailMsgView.FILENAME_INV_CHARS_RE, "");
	} else {
		filename = null;
	}
	filename = AjxStringUtil.urlComponentEncode(filename || ZmMsg.downloadAllDefaultFileName);
	var url = [appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI), "&id=", itemId, "&filename=", filename,"&charset=", appCtxt.getCharset(), "&part="].join("");
	var parts = [];
	for (var j = 0; j < attachments.length; j++) {
		parts.push(attachments[j].part);
	}
	var partsStr = parts.join(",");
	var params = {
		url:				(url + partsStr),
		downloadAllLinkId:	this._viewId + "_downloadAll",
		removeAllLinkId:	this._viewId + "_removeAll"
	}
	if (viewAllImages) {
		params.viewAllUrl = "/h/viewimages?id=" + itemId;
	}
	params.html = AjxTemplate.expand("mail.Message#AllAttachments", params);
	
	params.downloadAllCallback = ZmZimbraMail.unloadHackCallback.bind(null);
	params.removeAllCallback = this.removeAttachmentCallback.bind(this, partsStr);
	return params;
};

ZmMailMsgView.prototype.getToolTipContent =
function(evt) {

	var tgt = DwtUiEvent.getTarget(evt, false);

	//see if this is the priority icon. If so, it has a "priority" attribute high/low.
	if (tgt.id == ZmId.getViewId(this._view, ZmId.MV_PRIORITY)) {
		return tgt.getAttribute('priority') =='high' ? ZmMsg.highPriorityTooltip : ZmMsg.lowPriorityTooltip;
	}
	
    if (!this._attachmentLinkIdToFileNameMap) {return null};

    if (tgt && tgt.nodeName.toLowerCase() == "a") {
        var id = tgt.getAttribute("id");
        if (id) {
            var fileName = this._attachmentLinkIdToFileNameMap[id];
            if (fileName) {
                return AjxStringUtil.htmlEncode(fileName);
            }
        }
    }
    return null;
};

// AttachmentLink Handlers
ZmMailMsgView.prototype.addAttachmentLinkHandler =
function(contentType,handlerId,handlerFunc){
	if (!ZmMailMsgView._attachmentHandlers) {
		ZmMailMsgView._attachmentHandlers = {};
	}

	if (!ZmMailMsgView._attachmentHandlers[contentType]) {
		ZmMailMsgView._attachmentHandlers[contentType] = {};
	}

	ZmMailMsgView._attachmentHandlers[contentType][handlerId] = handlerFunc;
};

// Listeners

ZmMailMsgView.prototype._controlEventListener =
function(ev) {
	// note - we may get here before we have a chance to initialize the IFRAME
	this._resetIframeHeightOnTimer();
	if (this._inviteMsgView && this._inviteMsgView.isActive()) {
		this._inviteMsgView.resize();
	}
};

ZmMailMsgView.prototype._shareToolBarListener =
function(ev) {
	ev._buttonId = ev.item.getData(ZmOperation.KEY_ID);
	ev._share = this._msg.share;
	this.notifyListeners(ZmMailMsgView.SHARE_EVENT, ev);
};

ZmMailMsgView.prototype._subscribeToolBarListener =
function(req, ev) {
	ev._buttonId = ev.item.getData(ZmOperation.KEY_ID);
	ev._subscribeReq = req;
	this.notifyListeners(ZmMailMsgView.SUBSCRIBE_EVENT, ev);
};


ZmMailMsgView.prototype._msgChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_MSG) { return; }
	if (ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE) {
		if (ev.source == this._msg && (appCtxt.getCurrentViewId() == this._viewId)) {
			this._controller._app.popView();
		}
	} else if (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL) {
		this._setTags(this._msg);
	} else if (ev.event == ZmEvent.E_MODIFY) {
		if (ev.source == this._msg) {
			this.set(ev.source, true);
		}
	}
};

ZmMailMsgView.prototype._selectStartListener =
function(ev) {
	// reset mouse event to propagate event to browser (allows text selection)
	ev._stopPropagation = false;
	ev._returnValue = true;
};


ZmMailMsgView.prototype._reportButtonListener =
function(msg, ev) {
	var proxy = AjxUtil.createProxy(msg);

	proxy.clearAddresses();
	var toAddress = new AjxEmailAddress(appCtxt.get(ZmSetting.OFFLINE_REPORT_EMAIL));
	proxy._addrs[AjxEmailAddress.TO] = AjxVector.fromArray([toAddress]);

	var bp = msg.getBodyPart();
	if (bp) {
		var top = new ZmMimePart();
		top.setContentType(bp.ct);
		top.setContent(msg.getBodyPart().getContent());
		proxy.setTopPart(top);
	}

	var respCallback = this._sendReportCallback.bind(this, msg);
	var errorCallback = this._sendReportError.bind(this);
	proxy.send(false, respCallback, errorCallback, null, true);
};

ZmMailMsgView.prototype._sendReportCallback =
function(msg) {
	this._controller._doDelete([msg], true);
};

ZmMailMsgView.prototype._sendReportError =
function() {
	appCtxt.setStatusMsg(ZmMsg.reportSyncError, ZmStatusView.LEVEL_WARNING);
};


// Callbacks


ZmMailMsgView.prototype._handleMsgTruncated =
function() {

	// redo selection to trigger loading and display of entire msg
	this._msg.viewEntireMessage = true;	// remember so we reply to entire msg
	this._msg.force = true;				// make sure view re-renders msg
	if (this._controller._setSelectedItem) {
		// list controller
		this._controller._setSelectedItem({noTruncate: true, forceLoad: true, markRead: false});
	}
	else if (this._controller.show) {
		// msg controller
		this._controller.show(this._msg, this._controller, null, false, false, true, true);
	}
	
	Dwt.setVisible(this._msgTruncatedId, false);
};

// Static methods

ZmMailMsgView._swapIdAndSrc =
function (image, i, len, msg, parent, view) {
	// Fix for IE: Over HTTPS, http src urls for images might cause an issue.
	try {
		image.src = image.getAttribute("dfsrc");
	}
	catch (ex) {
		// do nothing
	}

	if (i == len - 1) {
		if (msg) {
			msg.setHtmlContent(parent.innerHTML);
		}
		view._resetIframeHeightOnTimer();
	}
};

ZmMailMsgView.prototype._onloadIframe =
function(dwtIframe) {
	var iframe = dwtIframe.getIframe();
	try { iframe.onload = null; } catch(ex) {}
	ZmMailMsgView._resetIframeHeight(this);
};

ZmMailMsgView._resetIframeHeight =
function(self, attempt) {

	var iframe = self.getIframe();
	if (!iframe) { return; }

	DBG.println("cv2", "ZmMailMsgView::_resetIframeHeight " + (attempt || "0"));
	var h;
	if (self._scrollWithIframe) {
		h = self.getH();
		function subtract(el) {
			if (el) {
				if (typeof el == "string") {
					el = document.getElementById(el);
				}
				if (el) {
					h -= Dwt.getSize(el).y;
				}
			}
		}
		subtract(self._headerElement);
		subtract(self._displayImagesId);
		subtract(self._highlightObjectsId);
		if (self._isMsgTruncated) {
			subtract(self._msgTruncatedId);
		}
		if (self._inviteMsgView && self._inviteMsgView.isActive()) {
			if (self._inviteMsgView._inviteToolbar) {//if toolbar not created there's nothing to subtract (e.g. sent folder)
				subtract(self._inviteMsgView.getInviteToolbar().getHtmlElement());
			}
			if (self._inviteMsgView._dayView) {
				subtract(self._inviteMsgView._dayView.getHtmlElement());
			}
		}
		if (self._hasShareToolbar && self._shareToolbar) {
			subtract(self._shareToolbar.getHtmlElement());
		}
		iframe.style.height = h + "px";
	} else {
		if (attempt == null) { attempt = 0; }
		try {
			if (!iframe.contentWindow || !iframe.contentWindow.document) {
				if (attempt < ZmMailMsgView.SETHEIGHT_MAX_TRIES) {
					attempt++;
					self._resetIframeHeightOnTimer(attempt);
				}
				return; // give up
			}
		} catch(ex) {
			if (attempt < ZmMailMsgView.SETHEIGHT_MAX_TRIES) {
				attempt++;
				self._resetIframeHeightOnTimer(attempt++); // for IE
			}
			return; // give up
		}

		var doc = iframe.contentWindow.document;
		var origHeight = doc && doc.body && doc.body.scrollHeight || 0;

		// first off, make it wide enough to fill ZmMailMsgView.
		iframe.style.width = "100%"; // *** changes height!

		// remember the current width
		var view_width = iframe.offsetWidth;

		// if there's a long unbreakable string, the scrollWidth of the body
		// element will be bigger--we must make the iframe that wide, or there
		// won't be any scrollbars.
		var w = doc.body.scrollWidth;
		if (w > view_width) {
			iframe.style.width = w + "px"; // *** changes height!

			// Now (bug 20743), by forcing the body a determined width (that of
			// the view) we are making the browser wrap those paragraphs that
			// can be wrapped, even if there's a long unbreakable string in the message.
			doc.body.style.overflow = "visible";
			if (view_width > 20) {
				doc.body.style.width = view_width - 20 + "px"; // *** changes height!
			}
		}

		// we are finally in the right position to determine height.
		h = Math.max(doc.documentElement.scrollHeight, origHeight);

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
	}
};

// note that IE doesn't seem to be able to reset the "scrolling" attribute.
// this function isn't safe to call for IE!
ZmMailMsgView.prototype.setScrollWithIframe =
function(val) {
	
	if (!this._usingIframe && typeof this._usingIframe !== 'undefined') { return; }
	this._scrollWithIframe = val;
	this._limitAttachments = this._scrollWithIframe ? 3 : 0; //making it local
	this._attcMaxSize = this._limitAttachments * 16 + 8;

	this.setScrollStyle(val ? DwtControl.CLIP : DwtControl.SCROLL);
	var iframe = this.getIframe();
	if (iframe) {
		iframe.style.width = "100%";
		iframe.scrolling = val;
		ZmMailMsgView._resetIframeHeight(this);
	}
};




ZmMailMsgView._detachCallback =
function(isRfc822, parentController, result) {
	var msgNode = result.getResponse().GetMsgResponse.m[0];
	var ac = window.parentAppCtxt || window.appCtxt;
	var ctlr = ac.getApp(ZmApp.MAIL).getMailListController();
	var msg = ZmMailMsg.createFromDom(msgNode, {list: ctlr.getList()}, true);
	msg._loaded = true; // bug fix #8868 - force load for rfc822 msgs since they may not return any content
	msg.readReceiptRequested = false; // bug #36247 - never allow read receipt for rfc/822 message
	ZmMailMsgView.detachMsgInNewWindow(msg, isRfc822, parentController);
};

ZmMailMsgView.detachMsgInNewWindow =
function(msg, isRfc822, parentController) {
	var appCtxt = window.parentAppCtxt || window.appCtxt;
	var newWinObj = appCtxt.getNewWindow(true);
	if(newWinObj) {// null check for popup blocker
		newWinObj.command = "msgViewDetach";
		newWinObj.params = { msg:msg, isRfc822:isRfc822, parentController:parentController };
	}
};

// loads a msg and displays it in a new window
ZmMailMsgView.rfc822Callback =
function(msgId, msgPartId, parentController) {
	var isRfc822 = Boolean((msgPartId != null));
	var appCtxt = window.parentAppCtxt || window.appCtxt;
	var params = {
		sender: appCtxt.getAppController(),
		msgId: msgId,
		partId: msgPartId,
		getHtml: appCtxt.get(ZmSetting.VIEW_AS_HTML),
		markRead: appCtxt.isExternalAccount() ? false : true,
		callback: ZmMailMsgView._detachCallback.bind(null, isRfc822, parentController)
	};
	ZmMailMsg.fetchMsg(params);
};

ZmMailMsgView.vcardCallback =
function(msgId, partId) {
	ZmZimbraMail.unloadHackCallback();

	var ac = window.parentAppCtxt || window.appCtxt;
	ac.getApp(ZmApp.CONTACTS).createFromVCard(msgId, partId);
};

ZmMailMsgView.downloadCallback =
function(downloadUrl) {
	ZmZimbraMail.unloadHackCallback();
	location.href = downloadUrl;
};

ZmMailMsgView.prototype.removeAttachmentCallback =
function(partIds) {
	ZmZimbraMail.unloadHackCallback();

	if (!(partIds instanceof Array)) { partIds = partIds.split(","); }

	var msg = (partIds.length > 1)
		? ZmMsg.attachmentConfirmRemoveAll
		: ZmMsg.attachmentConfirmRemove;

	var dlg = appCtxt.getYesNoMsgDialog();
	dlg.registerCallback(DwtDialog.YES_BUTTON, this._removeAttachmentCallback, this, [partIds]);
	dlg.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
	dlg.popup();
};

ZmMailMsgView.prototype._removeAttachmentCallback =
function(partIds) {
	appCtxt.getYesNoMsgDialog().popdown();
	this._msg.removeAttachments(partIds, this._handleRemoveAttachment.bind(this));
};

ZmMailMsgView.prototype._handleRemoveAttachment =
function(result) {
	var msgNode = result.getResponse().RemoveAttachmentsResponse.m[0];
	var ac = window.parentAppCtxt || window.appCtxt;
	var listCtlr = ac.getApp(ZmApp.MAIL).getMailListController(); //todo - getting a list controller from appCtxt always seems suspicious to me (should we get the controller for the current view?)
	var msg = ZmMailMsg.createFromDom(msgNode, {list: listCtlr.getList()}, true);
	this._msg = this._item = null;
	// cache this actioned ID so we can reset selection to it once the CREATE
	// notifications have been processed.
	listCtlr.actionedMsgId = msgNode.id;
	if (this._controller.setMsg) {
		//for the ZmMsgController case. (standalone).
		this._controller.setMsg(msg);
	}
	this.set(msg);
};

ZmMailMsgView.briefcaseCallback =
function(msgId, partId, name) {
	ZmZimbraMail.unloadHackCallback();

	// force create deferred folders if not created
	AjxDispatcher.require("BriefcaseCore");
	var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
	var briefcaseApp = aCtxt.getApp(ZmApp.BRIEFCASE);
	briefcaseApp._createDeferredFolders();

	appCtxt.getApp(ZmApp.BRIEFCASE).createFromAttachment(msgId, partId, name);
};

ZmMailMsgView.prototype.deactivate =
function() {
	this._controller.inactive = true;
};

ZmMailMsgView.addToCalendarCallback =
function(msgId, partId, name) {
	ZmZimbraMail.unloadHackCallback();

	// force create deferred folders if not created
	AjxDispatcher.require(["MailCore", "CalendarCore"]);
	var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
	var calApp = aCtxt.getApp(ZmApp.CALENDAR);
	calApp._createDeferredFolders();

	appCtxt.getApp(ZmApp.CALENDAR).importAppointment(msgId, partId, name);
};

ZmMailMsgView.prototype.getMsgBodyElement =
function(){
    return document.getElementById(this._msgBodyDivId);
};

ZmMailMsgView.prototype._getViewId =
function() {
	var ctlrViewId = this._controller.getCurrentViewId();
	return this._controller.isZmMsgController ? ctlrViewId : [ctlrViewId, ZmId.VIEW_MSG].join("_");
};

ZmMailMsgView.prototype._keepReading =
function(check) {
	var cont = this.getHtmlElement();
	var contHeight = Dwt.getSize(cont).y;
	var canScroll = (cont.scrollHeight > contHeight && (cont.scrollTop + contHeight < cont.scrollHeight));
	if (canScroll) {
		if (!check) {
			cont.scrollTop = cont.scrollTop + contHeight;
		}
		return true;
	}
	return false;
};

ZmMailMsgView.prototype._getIframeTitle = function() {
	return AjxMessageFormat.format(ZmMsg.messageTitle, this._msg.subject);
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmMailMsgListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmMailMsgListView = function(params) {

	this._mode = params.mode;
	this.view = params.view;
	params.type = ZmItem.MSG;
	params.listLabel = ZmMsg.messageList;
	this._controller = params.controller;
	params.headerList = this._getHeaderList();
	ZmMailListView.call(this, params);
};

ZmMailMsgListView.prototype = new ZmMailListView;
ZmMailMsgListView.prototype.constructor = ZmMailMsgListView;

ZmMailMsgListView.prototype.isZmMailMsgListView = true;
ZmMailMsgListView.prototype.toString = function() {	return "ZmMailMsgListView"; };

// Consts

// TODO: move to CV
ZmMailMsgListView.SINGLE_COLUMN_SORT_CV = [
	{field:ZmItem.F_FROM,	msg:"from"		},
	{field:ZmItem.F_SIZE,	msg:"size"		},
	{field:ZmItem.F_DATE,	msg:"date"		}
];

// Public methods


ZmMailMsgListView.prototype.markUIAsRead = 
function(msg) {
	ZmMailListView.prototype.markUIAsRead.apply(this, arguments);
	var classes = this._getClasses(ZmItem.F_STATUS, !this.isMultiColumn() ? ["ZmMsgListBottomRowIcon"]:null);
	this._setImage(msg, ZmItem.F_STATUS, msg.getStatusIcon(), classes);
};

// Private / protected methods

// following _createItemHtml support methods are also used for creating msg
// rows in ZmConvListView

// support for showing which msgs in a conv matched the search
// TODO: move to CV
ZmMailMsgListView.prototype._addParams =
function(msg, params) {
	if (this._mode == ZmId.VIEW_TRAD) {
		return ZmMailListView.prototype._addParams.apply(this, arguments);
	} else {
		var conv = appCtxt.getById(msg.cid);
		var s = this._controller._activeSearch && this._controller._activeSearch.search;
		params.isMatched = (s && s.hasContentTerm() && msg.inHitList);
	}
};

ZmMailMsgListView.prototype._getDivClass =
function(base, item, params) {
	if (params.isMatched && !params.isDragProxy) {
		return base + " " + [base, DwtCssStyle.MATCHED].join("-");			// Row Row-matched
	} else {
		return ZmMailListView.prototype._getDivClass.apply(this, arguments);
	}
};

ZmMailMsgListView.prototype._getRowClass =
function(msg) {
	var classes = this._isMultiColumn ? ["DwtMsgListMultiCol"]:["ZmRowDoubleHeader"];
	if (this._mode != ZmId.VIEW_TRAD) {
		var folder = appCtxt.getById(msg.folderId);
		if (folder && folder.isInTrash()) {
			classes.push("Trash");
		}
	}
	if (msg.isUnread)	{	classes.push("Unread"); }
	if (msg.isSent)		{	classes.push("Sent"); }

	return classes.join(" ");
};

ZmMailMsgListView.prototype._getCellId =
function(item, field) {
	if (field == ZmItem.F_SUBJECT && (this._mode == ZmId.VIEW_CONV ||
									  this._mode == ZmId.VIEW_CONVLIST)) {
		return this._getFieldId(item, field);
	} else {
		return ZmMailListView.prototype._getCellId.apply(this, arguments);
	}
};

ZmMailMsgListView.prototype._getCellContents =
function(htmlArr, idx, msg, field, colIdx, params, classes) {
	var zimletStyle = this._getStyleViaZimlet(field, msg) || "";
	if (field == ZmItem.F_READ) {
		idx = this._getImageHtml(htmlArr, idx, msg.getReadIcon(), this._getFieldId(msg, field), classes);
	}
	else if (field == ZmItem.F_STATUS) {
		idx = this._getImageHtml(htmlArr, idx, msg.getStatusIcon(), this._getFieldId(msg, field), classes);
	} else if (field == ZmItem.F_FROM || field == ZmItem.F_PARTICIPANT) {
		htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) + zimletStyle + ">";
		// setup participants list for Sent/Drafts/Outbox folders
		if (this._isOutboundFolder()) {
			var addrs = msg.getAddresses(AjxEmailAddress.TO).getArray();

			if (addrs && addrs.length) {
				var fieldId = this._getFieldId(msg, ZmItem.F_FROM);
				var origLen = addrs.length;
				var headerCol = this._headerHash[field];
				var partColWidth = headerCol ? headerCol._width : ZmMsg.COLUMN_WIDTH_FROM_CLV;
				var parts = this._fitParticipants(addrs, msg, partColWidth);
				for (var j = 0; j < parts.length; j++) {
					if (j == 0 && (parts.length < origLen)) {
						htmlArr[idx++] = AjxStringUtil.ELLIPSIS;
					} else if (parts.length > 1 && j > 0) {
						htmlArr[idx++] = AjxStringUtil.LIST_SEP;
					}
					htmlArr[idx++] = "<span id='";
					htmlArr[idx++] = [fieldId, parts[j].index].join(DwtId.SEP);
					htmlArr[idx++] = "'>";
					htmlArr[idx++] = AjxStringUtil.htmlEncode(parts[j].name);
					htmlArr[idx++] = "</span>";
				}
			} else {
				htmlArr[idx++] = "&nbsp;";
			}
		} else {
			var fromAddr = msg.getAddress(AjxEmailAddress.FROM);
			var fromText = fromAddr && fromAddr.getText();
			if (fromText) {
				htmlArr[idx++] = "<span id='";
				htmlArr[idx++] = this._getFieldId(msg, ZmItem.F_FROM);
				htmlArr[idx++] = "'>";
				htmlArr[idx++] = AjxStringUtil.htmlEncode(fromText);
				htmlArr[idx++] = "</span>";
			}
			else {
				htmlArr[idx++] = "<span>" + ZmMsg.unknown + "</span>";
			}
		}
		htmlArr[idx++] = "</div>";

	} else if (field == ZmItem.F_SUBJECT) {
		htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) +  zimletStyle + ">";
		if (this._mode == ZmId.VIEW_CONV || this._mode == ZmId.VIEW_CONVLIST) {
			// msg within a conv shows just the fragment
			//originally bug 97510 -  need a span so I can target it via CSS rule, so the margin is within the column content, and doesn't push the other columns
			htmlArr[idx++] = "<span " + (this._isMultiColumn ? "" : "class='ZmConvListFragment'") + " id='" + this._getFieldId(msg, ZmItem.F_FRAGMENT) + "'>";
			htmlArr[idx++] = AjxStringUtil.htmlEncode(msg.fragment, true);
			htmlArr[idx++] = "</span>";
		} else {
			// msg on its own (TV) shows subject and fragment
			var subj = msg.subject || ZmMsg.noSubject;
			htmlArr[idx++] = "<span id='";
			htmlArr[idx++] = this._getFieldId(msg, field);
			htmlArr[idx++] = "'>" + AjxStringUtil.htmlEncode(subj) + "</span>";
			if (appCtxt.get(ZmSetting.SHOW_FRAGMENTS) && msg.fragment) {
				htmlArr[idx++] = this._getFragmentSpan(msg);
			}
		}
		htmlArr[idx++] = "</div>";

	} else if (field == ZmItem.F_FOLDER) {
		htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) + " id='";
		htmlArr[idx++] = this._getFieldId(msg, field);
		htmlArr[idx++] = "'>"; // required for IE bug
		var folder = appCtxt.getById(msg.folderId);
		if (folder) {
			htmlArr[idx++] = folder.getName();
		}
		htmlArr[idx++] = "</div>";

	} else if (field == ZmItem.F_SIZE) {
		htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) + ">";
		htmlArr[idx++] = AjxUtil.formatSize(msg.size);
		htmlArr[idx++] = "</div>";
	} else if (field == ZmItem.F_SORTED_BY) {
		htmlArr[idx++] = this._getAbridgedContent(msg, colIdx);
	} else {
		if (this.isMultiColumn() || field !== ZmItem.F_SELECTION) {
			//do not call this for checkbox in single column layout
			idx = ZmMailListView.prototype._getCellContents.apply(this, arguments);
		}
	}
	
	return idx;
};

ZmMailMsgListView.prototype._getAbridgedContent =
function(item, colIdx) {
	var htmlArr = [];
	var idx = 0;
	var width = (AjxEnv.isIE || AjxEnv.isSafari) ? "22" : "16";

	var selectionCssClass = '';
	for (var i = 0; i < this._headerList.length; i++) {
		if (this._headerList[i]._field == ZmItem.F_SELECTION) {
			selectionCssClass = "ZmMsgListSelection";
			break;
		}
	}
	// first row
	htmlArr[idx++] = "<div class='TopRow " + selectionCssClass + "' ";
	htmlArr[idx++] = "id='";
	htmlArr[idx++] = DwtId.getListViewItemId(DwtId.WIDGET_ITEM_FIELD, this._view, item.id, ZmItem.F_ITEM_ROW_3PANE);
	htmlArr[idx++] = "'>";
	if (selectionCssClass) {
		idx = ZmMailListView.prototype._getCellContents.apply(this, [htmlArr, idx, item, ZmItem.F_SELECTION, colIdx]);
	}
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_READ, colIdx, width);
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_FROM, colIdx);
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_DATE, colIdx, ZmMsg.COLUMN_WIDTH_DATE, "align=right", ["ZmMsgListDate"]);
	htmlArr[idx++] = "</div>";

	// second row
	htmlArr[idx++] = "<div class='BottomRow " + selectionCssClass + "'>";
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_STATUS, colIdx, width,  null, ["ZmMsgListBottomRowIcon"]);
	
	// for multi-account, show the account icon for cross mbox search results
	if (appCtxt.multiAccounts && appCtxt.getSearchController().searchAllAccounts) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_ACCOUNT, colIdx, "16", "align=right");
	}
	if (item.isHighPriority || item.isLowPriority) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_PRIORITY, colIdx, "10", "align=right");
	}
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_SUBJECT, colIdx);
	//add the attach, flag and tags in a wrapping div
	idx = this._getListFlagsWrapper(htmlArr, idx, item);
	if (item.hasAttach) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_ATTACHMENT, colIdx, width);
	}
	var tags = item.getVisibleTags();
	if (tags && tags.length) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_TAG, colIdx, width, null, ["ZmMsgListColTag"]);
	}
	if (appCtxt.get("FLAGGING_ENABLED")) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_FLAG, colIdx, width);
	}
	htmlArr[idx++] = "</div></div>";

	return htmlArr.join("");
};

ZmMailMsgListView.prototype._getToolTip =
function(params) {

	var tooltip, field = params.field, item = params.item;
	if (!item) { return; }

	if (!this._isMultiColumn && (field == ZmItem.F_SUBJECT || field ==  ZmItem.F_FRAGMENT)) {
		var invite = (item.type == ZmItem.MSG) && item.isInvite() && item.invite;
		if (invite && (item.needsRsvp() || !invite.isEmpty())) {
			tooltip = ZmMailListView.prototype._getToolTip.apply(this, arguments);
		}
		else {
			tooltip = AjxStringUtil.htmlEncode(item.fragment || (item.hasAttach ? "" : ZmMsg.fragmentIsEmpty));
			var folderTip = null;
			var folder = appCtxt.getById(item.folderId);
			if (folder && folder.parent) {
				folderTip = AjxMessageFormat.format(ZmMsg.accountDownloadToFolder, folder.getPath());
			}
			tooltip = (tooltip && folderTip) ? [tooltip, folderTip].join("<br>") : tooltip || folderTip;
        }
	}
	else {
		tooltip = ZmMailListView.prototype._getToolTip.apply(this, arguments);
	}
	
	return tooltip;
};

// Listeners

ZmMailMsgListView.prototype._changeListener =
function(ev) {

	var msg = this._getItemFromEvent(ev);
	if (!msg || ev.handled || !this._handleEventType[msg.type]) { return; }

	if ((ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE) && this._mode == ZmId.VIEW_CONV) {
		if (!this._controller.handleDelete()) {
			if (ev.event == ZmEvent.E_DELETE) {
				ZmMailListView.prototype._changeListener.call(this, ev);
			} else {
				// if spam, remove it from listview
				if (msg.folderId == ZmFolder.ID_SPAM) {
					this._controller._list.remove(msg, true);
					ZmMailListView.prototype._changeListener.call(this, ev);
				} else {
					this._changeFolderName(msg, ev.getDetail("oldFolderId"));
					this._checkReplenishOnTimer();
				}
			}
		}
	} else if (this._mode == ZmId.VIEW_CONV && ev.event == ZmEvent.E_CREATE) {
		var conv = AjxDispatcher.run("GetConvController").getConv();
		if (conv && (msg.cid == conv.id)) {
			ZmMailListView.prototype._changeListener.call(this, ev);
		}
	} else if (ev.event == ZmEvent.E_FLAGS) { // handle "replied" and "forwarded" flags
		var flags = ev.getDetail("flags");
		for (var j = 0; j < flags.length; j++) {
			var flag = flags[j];
			var on = msg[ZmItem.FLAG_PROP[flag]];
			if (flag == ZmItem.FLAG_REPLIED && on) {
				this._setImage(msg, ZmItem.F_STATUS, "MsgStatusReply", this._getClasses(ZmItem.F_STATUS));
			} else if (flag == ZmItem.FLAG_FORWARDED && on) {
				this._setImage(msg, ZmItem.F_STATUS, "MsgStatusForward", this._getClasses(ZmItem.F_STATUS));
			}
		}
		ZmMailListView.prototype._changeListener.call(this, ev); // handle other flags
	} else {
		ZmMailListView.prototype._changeListener.call(this, ev);
		if (ev.event == ZmEvent.E_CREATE || ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE)	{
			this._resetColWidth();
		}
	}
};

ZmMailMsgListView.prototype._initHeaders =
function() {

	ZmMailListView.prototype._initHeaders.apply(this, arguments);
	if (this._mode == ZmId.VIEW_CONV) {
		this._headerInit[ZmItem.F_SUBJECT] = {text:ZmMsg.message, noRemove:true, resizeable:true};
	}
};

ZmMailMsgListView.prototype._getHeaderToolTip =
function(field, itemIdx) {
	if (field == ZmItem.F_SUBJECT && this._mode == ZmId.VIEW_CONV) {
		return ZmMsg.message;
	}
	else {
		return ZmMailListView.prototype._getHeaderToolTip.apply(this, arguments);
	}
};

ZmMailMsgListView.prototype._getSingleColumnSortFields =
function() {
	return (this._mode == ZmId.VIEW_CONV) ? ZmMailMsgListView.SINGLE_COLUMN_SORT_CV : ZmMailListView.SINGLE_COLUMN_SORT;
};

ZmMailMsgListView.prototype._sortColumn = 
function(columnItem, bSortAsc, callback) {

	// call base class to save new sorting pref
	ZmMailListView.prototype._sortColumn.call(this, columnItem, bSortAsc);

	var query;
	var list = this.getList();
	if (this._columnHasCustomQuery(columnItem)) {
		query = this._getSearchForSort(columnItem._sortable, this._controller);
	}
	else if (list && list.size() > 1 && this._sortByString) {
		query = this._controller.getSearchString();
	}

	var queryHint = this._controller.getSearchStringHint();

	if (query || queryHint) {
		var params = {
			query:			query,
			queryHint:		queryHint,
			sortBy:			this._sortByString,
			userInitiated:	this._controller._currentSearch.userInitiated,
			sessionId:		this._controller._currentSearch.sessionId
		}
		if (this._mode == ZmId.VIEW_CONV) {
			var conv = this._controller.getConv();
			if (conv) {
				var respCallback = new AjxCallback(this, this._handleResponseSortColumn, [conv, columnItem, this._controller, callback]);
				conv.load(params, respCallback);
			}
		} else {
			params.types = [ZmItem.MSG];
			params.limit = this.getLimit();
			params.callback = callback;
			appCtxt.getSearchController().search(params);
		}
	}
};

ZmMailMsgListView.prototype._handleResponseSortColumn =
function(conv, columnItem, controller, callback, result) {
	var searchResult = result.getResponse();
	var list = searchResult.getResults(ZmItem.MSG);
	controller.setList(list); // set the new list returned
	controller._activeSearch = searchResult;
	this.offset = 0;
	this.set(conv.msgs, columnItem);
	this.setSelection(conv.getFirstHotMsg({offset:this.offset, limit:this.getLimit(this.offset)}));
	if (callback instanceof AjxCallback)
		callback.run();
};

ZmMailMsgListView.prototype._getParentForColResize = 
function() {
	return this.parent;
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmConvListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a new double-pane view, with a list of conversations in the top pane,
 * and a message in the bottom pane.
 * @constructor
 * @class
 * This variation of a double pane view combines a conv list view with a reading
 * pane in which the first msg of a conv is shown. Any conv with more than one
 * message is expandable, and gets an expansion icon in the left column. Clicking on that
 * will display the conv's first page of messages. The icon then becomes a collapse icon and
 * clicking it will collapse the conv (hide the messages).
 * <p>
 * If a conv has more than one page of messages, the last message on the first page
 * will get a + icon, and that message is expandable.</p>
 *
 * @author Conrad Damon
 * 
 * @private
 */
ZmConvDoublePaneView = function(params) {

	this._invitereplylisteners = [];
	this._sharelisteners = [];
	this._subscribelisteners = [];

	params.className = params.className || "ZmConvDoublePaneView";
	params.mode = ZmId.VIEW_CONVLIST;
	ZmDoublePaneView.call(this, params);
};

ZmConvDoublePaneView.prototype = new ZmDoublePaneView;
ZmConvDoublePaneView.prototype.constructor = ZmConvDoublePaneView;

ZmConvDoublePaneView.prototype.isZmConvDoublePaneView = true;
ZmConvDoublePaneView.prototype.toString = function() { return "ZmConvDoublePaneView"; };

ZmConvDoublePaneView.prototype._createMailListView =
function(params) {
	return new ZmConvListView(params);
};

// default to conv item view
ZmConvDoublePaneView.prototype._createMailItemView =
function(params) {
	this._itemViewParams = params;
	return this._getItemView(ZmItem.CONV);
};

// get the item view based on the given type
ZmConvDoublePaneView.prototype._getItemView =
function(type) {
	var newview;
	
	this._itemViewParams.className = null;
	if (type == ZmItem.CONV) {
		if (!this._convView) {
			this._itemViewParams.id = ZmId.getViewId(ZmId.VIEW_CONV, null, this._itemViewParams.view);
			newview = this._convView = new ZmConvView2(this._itemViewParams);
		}
	}
	else if (type == ZmItem.MSG) {
		if (!this._mailMsgView) {
			this._itemViewParams.id = ZmId.getViewId(ZmId.VIEW_MSG, null, this._itemViewParams.view);
			newview = this._mailMsgView = new ZmMailMsgView(this._itemViewParams);
		}
	}

	if (newview) {
		AjxUtil.foreach(this._invitereplylisteners,
		                function(listener) {
		                	newview.addInviteReplyListener(listener);
		                });
		AjxUtil.foreach(this._sharelisteners,
		                function(listener) {
		                	newview.addShareListener(listener);
		                });
		AjxUtil.foreach(this._subscribelisteners,
		                function(listener) {
		                	newview.addSubscribeListener(listener);
		                });
	}

	return (type == ZmItem.CONV) ? this._convView : this._mailMsgView;
};

// set up to display either a conv or a msg in the item view
ZmConvDoublePaneView.prototype.setItem =
function(item, force) {

	if (!force && !this._controller.popShield(null, this.setItem.bind(this, item, true))) {
		return;
	}

	var changed = ((item.type == ZmItem.CONV) != (this._itemView && this._itemView == this._convView));
	var itemView = this._itemView = this._getItemView(item.type);
	var otherView = (item.type == ZmItem.CONV) ? this._mailMsgView : this._convView;
	if (otherView) {
		otherView.setVisible(false);
	}
	// Clear quick reply if going from msg view to conv view in reading pane
	if (changed && itemView && itemView._replyView) {
		itemView._replyView.reset();
	}
	this._itemView.setVisible(true,null,item);
	if (changed) {
		this.setReadingPane(true);	// so that second view gets positioned
	}

	return ZmDoublePaneView.prototype.setItem.apply(this, arguments);
};

ZmConvDoublePaneView.prototype.addInviteReplyListener =
function(listener) {
	this._invitereplylisteners.push(listener);
	ZmDoublePaneView.prototype.addInviteReplyListener.call(this, listener);
};

ZmConvDoublePaneView.prototype.addShareListener =
function(listener) {
	this._sharelisteners.push(listener);
	ZmDoublePaneView.prototype.addShareListener.call(this, listener);
};

ZmConvDoublePaneView.prototype.addSubscribeListener =
function(listener) {
	this._subscribelisteners.push(listener);
	ZmDoublePaneView.prototype.addSubscribeListener.call(this, listener);
};

/**
 * This class is a ZmMailListView which can display both convs and msgs.
 * It handles expanding convs as well as paging additional messages in. Message rows are
 * inserted after the row of the owning conv.
 * 
 * @private
 */
ZmConvListView = function(params) {

	params.type = ZmItem.CONV;
	this._controller = params.controller;
	this._mode = this.view = ZmId.VIEW_CONVLIST;
	params.headerList = this._getHeaderList();
	params.listLabel = ZmMsg.conversationList;
	ZmMailListView.call(this, params);

	// change listener needs to handle both types of events
	this._handleEventType[ZmItem.CONV] = true;
	this._handleEventType[ZmItem.MSG] = true;

	this._hasHiddenRows = true;	// so that up and down arrow keys work
	this._resetExpansion();
};

ZmConvListView.prototype = new ZmMailListView;
ZmConvListView.prototype.constructor = ZmConvListView;

ZmConvListView.prototype.isZmConvListView = true;
ZmConvListView.prototype.toString = function() { return "ZmConvListView"; };

ZmConvListView.prototype.listRole = 'tree';
ZmConvListView.prototype.itemRole = 'treeitem';

// Constants

ZmListView.FIELD_CLASS[ZmItem.F_EXPAND] = "Expand";

ZmConvListView.MSG_STYLE = "ZmConvExpanded";	// for differentiating msg rows


ZmConvListView.prototype.set =
function(list, sortField) {
	if (this.offset == 0) {
		this._resetExpansion();
	}
	ZmMailListView.prototype.set.apply(this, arguments);
};

/**
 * check whether all conversations are checked
 * overrides ZmListView.prototype._isAllChecked since the list here contains both conversations and messages, and we care only about messages
 * @return {Boolean} true if all conversations are checked
 */
ZmConvListView.prototype._isAllChecked =
function() {
	var selection = this.getSelection();
	//let's see how many conversations are checked.
	//ignore checked messages. Sure, if the user selects manually all messages in a conversation, the
	//conversation is not selected automatically too, but that's fine I think.
	//This method returns true if and only if all the conversations (in the conversation layer of the tree) are selected
	var convsSelected = 0;
	for (var i = 0; i < selection.length; i++) {
		if (selection[i].type == ZmItem.CONV) {
			convsSelected++;
		}
	}

	var list = this.getList();
	return (list && convsSelected == list.size());
};


ZmConvListView.prototype.markUIAsMute =
function(item) {
	ZmMailListView.prototype.markUIAsMute.apply(this, arguments);
};

ZmConvListView.prototype.markUIAsRead =
function(item) {
	ZmMailListView.prototype.markUIAsRead.apply(this, arguments);
	if (item.type == ZmItem.MSG) {
		var classes = this._getClasses(ZmItem.F_STATUS, !this.isMultiColumn() ? ["ZmMsgListBottomRowIcon"]:null);
		this._setImage(item, ZmItem.F_STATUS, item.getStatusIcon(), classes);
	}
};

/**
 * Overrides DwtListView.getList to optionally include any visible msgs.
 *
 * @param {Boolean}	allItems	if <code>true</code>, include visible msgs
 */
ZmConvListView.prototype.getList =
function(allItems) {
	if (!allItems) {
		return ZmMailListView.prototype.getList.call(this);
	} else {
		var list = [];
		var childNodes = this._parentEl.childNodes;
		for (var i = 0; i < childNodes.length; i++) {
			var el = childNodes[i];
			if (Dwt.getVisible(el)) {
				var item = this.getItemFromElement(el);
				if (item) {
					list.push(item);
				}
			}
		}
		return AjxVector.fromArray(list);
	}
};

// See if we've been rigged to return a particular msg
ZmConvListView.prototype.getSelection =
function() {
	return this._selectedMsg ? [this._selectedMsg] : ZmMailListView.prototype.getSelection.apply(this, arguments);
};

ZmConvListView.prototype.getItemIndex =
function(item, allItems) {
	var list = this.getList(allItems);
	if (item && list) {
		var len = list.size();
		for (var i = 0; i < len; ++i) {
			var test = list.get(i);
			if (test && test.id == item.id) {
				return i;
			}
		}
	}
	return null;
};

ZmConvListView.prototype._initHeaders =
function() {
	if (!this._headerInit) {
		ZmMailListView.prototype._initHeaders.call(this);
		this._headerInit[ZmItem.F_EXPAND]	= {icon:"NodeCollapsed", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.expand, tooltip: ZmMsg.expandCollapse, cssClass:"ZmMsgListColExpand"};
        //bug:45171 removed sorted from converstaion for FROM field
        this._headerInit[ZmItem.F_FROM]		= {text:ZmMsg.from, width:ZmMsg.COLUMN_WIDTH_FROM_CLV, resizeable:true, cssClass:"ZmMsgListColFrom"};
        this._headerInit[ZmItem.F_FOLDER]		= {text:ZmMsg.folder, width:ZmMsg.COLUMN_WIDTH_FOLDER, resizeable:true, cssClass:"ZmMsgListColFolder",visible:false};
	}
};

ZmConvListView.prototype._getLabelFieldList =
function() {
	var headers = ZmMailListView.prototype._getLabelFieldList.call(this);
	var selectionidx = AjxUtil.indexOf(headers, ZmItem.F_SELECTION);

	if (selectionidx >= 0) {
		headers.splice(selectionidx + 1, 0, ZmItem.F_EXPAND);
	}

	return headers;
}

ZmConvListView.prototype._getDivClass =
function(base, item, params) {
	if (item.type == ZmItem.MSG) {
		if (params.isDragProxy || params.isMatched) {
			return ZmMailMsgListView.prototype._getDivClass.apply(this, arguments);
		} else {
			return [base, ZmConvListView.MSG_STYLE].join(" ");
		}
	} else {
		return ZmMailListView.prototype._getDivClass.apply(this, arguments);
	}
};

ZmConvListView.prototype._getRowClass =
function(item) {
	return (item.type == ZmItem.MSG) ?
		ZmMailMsgListView.prototype._getRowClass.apply(this, arguments) :
		ZmMailListView.prototype._getRowClass.apply(this, arguments);
};

// set isMatched for msgs	
ZmConvListView.prototype._addParams =
function(item, params) {
	if (item.type == ZmItem.MSG) {
		ZmMailMsgListView.prototype._addParams.apply(this, arguments);
	}
};


ZmConvListView.prototype._getCellId =
function(item, field) {
	return ((field == ZmItem.F_FROM || field == ZmItem.F_SUBJECT) && item.type == ZmItem.CONV)
		? this._getFieldId(item, field)
		: ZmMailListView.prototype._getCellId.apply(this, arguments);
};

ZmConvListView.prototype._getCellClass =
function(item, field, params) {
	var cls = ZmMailListView.prototype._getCellClass.apply(this, arguments);
	return item.type === ZmItem.CONV && field === ZmItem.F_SIZE ? "Count " + cls : cls;
};


ZmConvListView.prototype._getCellCollapseExpandImage =
function(item) {
	if (!this._isExpandable(item)) {
		return null;
	}
	return this._expanded[item.id] ? "NodeExpanded" : "NodeCollapsed";
};


ZmConvListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params, classes) {

	var classes = classes || [];
	var zimletStyle = this._getStyleViaZimlet(field, item) || "";
	
	if (field === ZmItem.F_SELECTION) {
		if (this.isMultiColumn()) {
			//add the checkbox only for multicolumn layout. The checkbox for single column layout is added in _getAbridgedContent
			idx = ZmMailListView.prototype._getCellContents.apply(this, arguments);
		}
	}
	else if (field === ZmItem.F_EXPAND) {
		idx = this._getImageHtml(htmlArr, idx, this._getCellCollapseExpandImage(item), this._getFieldId(item, field), classes);
	}
    else if (field === ZmItem.F_READ) {
		idx = this._getImageHtml(htmlArr, idx, item.getReadIcon(), this._getFieldId(item, field), classes);
	}
	else if (item.type === ZmItem.MSG) {
		idx = ZmMailMsgListView.prototype._getCellContents.apply(this, arguments);
	}
	else {
		var visibleMsgCount = this._getDisplayedMsgCount(item);
		if (field === ZmItem.F_STATUS) {
			if (item.type == ZmItem.CONV && item.numMsgs == 1 && item.isScheduled) {
				idx = this._getImageHtml(htmlArr, idx, "SendLater", this._getFieldId(item, field), classes);
			} else {
				htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) + "></div>";
			}
		}
		else if (field === ZmItem.F_FROM) {
			htmlArr[idx++] = "<div id='" + this._getFieldId(item, field) + "' " + AjxUtil.getClassAttr(classes) +  zimletStyle + ">";
			htmlArr[idx++] = this._getParticipantHtml(item, this._getFieldId(item, ZmItem.F_PARTICIPANT));
			if (item.type === ZmItem.CONV && (visibleMsgCount > 1) && !this.isMultiColumn()) {
				htmlArr[idx++] = " - <span class='ZmConvListNumMsgs'>";
				htmlArr[idx++] = visibleMsgCount;
				htmlArr[idx++] = "</span>";
			}
			htmlArr[idx++] = "</div>";
		}
		else if (field === ZmItem.F_SUBJECT) {
			var subj = item.subject || ZmMsg.noSubject;
			if (item.numMsgs > 1) {
				subj = ZmMailMsg.stripSubjectPrefixes(subj);
			}
			htmlArr[idx++] = "<div id='" + this._getFieldId(item, field) + "' " + AjxUtil.getClassAttr(classes) + zimletStyle + ">";
			htmlArr[idx++] = "<span>";
			htmlArr[idx++] = AjxStringUtil.htmlEncode(subj, true) + "</span>";
			if (appCtxt.get(ZmSetting.SHOW_FRAGMENTS) && item.fragment) {
				htmlArr[idx++] = this._getFragmentSpan(item);
			}
			htmlArr[idx++] = "</div>";
		}
		else if (field === ZmItem.F_FOLDER) {
				htmlArr[idx++] = "<div " + AjxUtil.getClassAttr(classes) + " id='";
				htmlArr[idx++] = this._getFieldId(item, field);
				htmlArr[idx++] = "'>"; // required for IE bug
				if (item.folderId) {
					var folder = appCtxt.getById(item.folderId);
					if (folder) {
						htmlArr[idx++] = folder.getName();
					}
				}
				htmlArr[idx++] = "</div>";
		}
		else if (field === ZmItem.F_SIZE) {
			htmlArr[idx++] = "<div id='" + this._getFieldId(item, field) + "' " + AjxUtil.getClassAttr(classes) + ">";
			if (item.size) {
				htmlArr[idx++] = AjxUtil.formatSize(item.size);
			}
			else {
				htmlArr[idx++] = "(";
				htmlArr[idx++] = visibleMsgCount;
				htmlArr[idx++] = ")";
			}
			htmlArr[idx++] = "</div>";
		}
		else if (field === ZmItem.F_SORTED_BY) {
			htmlArr[idx++] = this._getAbridgedContent(item, colIdx);
		}
		else {
			idx = ZmMailListView.prototype._getCellContents.apply(this, arguments);
		}
	}
	
	return idx;
};

ZmConvListView.prototype._getAbridgedContent =
function(item, colIdx) {

	var htmlArr = [];
	var idx = 0;
	var width = (AjxEnv.isIE || AjxEnv.isSafari) ? 22 : 16;

	var isMsg = (item.type === ZmItem.MSG);
	var isConv = (item.type === ZmItem.CONV && this._getDisplayedMsgCount(item) > 1);

	var selectionCssClass = '';
	for (var i = 0; i < this._headerList.length; i++) {
		if (this._headerList[i]._field == ZmItem.F_SELECTION) {
			selectionCssClass = "ZmMsgListSelection";
			break;
		}
	}
	htmlArr[idx++] = "<div class='TopRow " + selectionCssClass + "' ";
	htmlArr[idx++] = "id='";
	htmlArr[idx++] = DwtId.getListViewItemId(DwtId.WIDGET_ITEM_FIELD, this._view, item.id, ZmItem.F_ITEM_ROW_3PANE);
	htmlArr[idx++] = "'>";
	if (selectionCssClass) {
		idx = ZmMailListView.prototype._getCellContents.apply(this, [htmlArr, idx, item, ZmItem.F_SELECTION, colIdx]);
	}
	if (isMsg) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_EXPAND, colIdx);
	}
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_READ, colIdx, width);
	if (isConv) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_EXPAND, colIdx, "16", null, ["ZmMsgListExpand"]);
	}
	
	// for multi-account, show the account icon for cross mbox search results
	if (appCtxt.multiAccounts && !isMsg && appCtxt.getSearchController().searchAllAccounts) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_ACCOUNT, colIdx, "16");
	}
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_FROM, colIdx);
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_DATE, colIdx, ZmMsg.COLUMN_WIDTH_DATE, null, ["ZmMsgListDate"]);
	htmlArr[idx++] = "</div>";

	// second row
	htmlArr[idx++] = "<div class='BottomRow " + selectionCssClass + "'>";
	var bottomRowMargin = ["ZmMsgListBottomRowIcon"];
	if (isMsg) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_STATUS, colIdx, width, null, bottomRowMargin);
		bottomRowMargin = null;
	}
	if (item.isHighPriority || item.isLowPriority) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_PRIORITY, colIdx, "10", null, bottomRowMargin);
		bottomRowMargin = null;
	}
	idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_SUBJECT, colIdx, null, null, bottomRowMargin);

	//add the attach, flag and tags in a wrapping div
	idx = this._getListFlagsWrapper(htmlArr, idx, item);

	if (item.hasAttach) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_ATTACHMENT, colIdx, width);
	}
	var tags = item.getVisibleTags();
	if (tags && tags.length) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_TAG, colIdx, width, null, ["ZmMsgListColTag"]);
	}
	if (appCtxt.get(ZmSetting.FLAGGING_ENABLED)) {
		idx = this._getAbridgedCell(htmlArr, idx, item, ZmItem.F_FLAG, colIdx, width);
	}
	htmlArr[idx++] = "</div></div>";
	
	return htmlArr.join("");
};

ZmConvListView.prototype._getParticipantHtml =
function(conv, fieldId) {

	var html = [];
	var idx = 0;

	var part = conv.participants ? conv.participants.getArray() : [],
		isOutbound = this._isOutboundFolder(),
		part1 = [];

	for (var i = 0; i < part.length; i++) {
		var p = part[i];
		if ((isOutbound && p.type === AjxEmailAddress.TO) || (!isOutbound && p.type === AjxEmailAddress.FROM)) {
			part1.push(p);
		}
	}
	// Workaround for bug 87597: for "sent" folder, when no "to" fields were reported after notification,
	// push all participants to part1 to trick origLen > 0
	// then get recipients from msg.getAddresses below and overwrite part1
	if (part1.length === 0 && isOutbound) {
		part1 = part;
	}
	var origLen = part1 ? part1.length : 0;
	if (origLen > 0) {

		// bug 23832 - create notif for conv in sent gives us sender as participant, we want recip
		if (origLen == 1 && (part1[0].type === AjxEmailAddress.FROM) && conv.isZmConv && isOutbound) {
			var msg = conv.getFirstHotMsg();
			if (msg) {
				var addrs = msg.getAddresses(AjxEmailAddress.TO).getArray();
	            if (addrs && addrs.length) {
					part1 = addrs;
				} else {
					return "&nbsp;"
				}
			}
		}

		var headerCol = this._headerHash[ZmItem.F_FROM];
		var partColWidth = headerCol ? headerCol._width : ZmMsg.COLUMN_WIDTH_FROM_CLV;
		var part2 = this._fitParticipants(part1, conv, partColWidth);
		for (var j = 0; j < part2.length; j++) {
			if (j === 0 && (conv.participantsElided || part2.length < origLen)) {
				html[idx++] = AjxStringUtil.ELLIPSIS;
			}
			else if (part2.length > 1 && j > 0) {
				html[idx++] = AjxStringUtil.LIST_SEP;
			}
			var p2 = (part2 && part2[j] && (part2[j].index != null)) ? part2[j].index : "";
			var spanId = [fieldId, p2].join(DwtId.SEP);
			html[idx++] = "<span id='";
			html[idx++] = spanId;
			html[idx++] = "'>";
			html[idx++] = (part2 && part2[j]) ? AjxStringUtil.htmlEncode(part2[j].name) : "";
			html[idx++] = "</span>";
		}
	} else {
		html[idx++] = isOutbound ? "&nbsp;" : ZmMsg.noRecipients;
	}

	return html.join("");
};

// Returns the actual number of msgs that will be shown on expansion or in
// the reading pane (msgs in Trash/Junk/Drafts are omitted)
ZmConvListView.prototype._getDisplayedMsgCount =
function(conv) {

	var omit = ZmMailApp.getFoldersToOmit(),
		num = 0, id;

	if (AjxUtil.arraySize(conv.msgFolder) < conv.numMsgs) {
		//if msgFolder is empty, or does not include folders for all numMsgs message, for some reason (there are complicated cases like that), assume all messages are displayed.
		// This should not cause too big of a problem, as when the user expands, it will load the conv with the correct msgFolder and display only the relevant messages.
		return conv.numMsgs;
	}
	for (id in conv.msgFolder) {
		if (!omit[conv.msgFolder[id]]) {
			num++;
		}
	}

	return num;
};

ZmConvListView.prototype._getLabelForField =
function(item, field) {
	switch (field) {
	case ZmItem.F_EXPAND:
		if (this._isExpandable(item)) {
			return this.isExpanded(item) ? ZmMsg.expanded : ZmMsg.collapsed;
		}

		break;

	case ZmItem.F_SIZE:
		if (item.numMsgs > 1) {
			var messages =
				AjxMessageFormat.format(ZmMsg.typeMessage, item.numMsgs);
			return AjxMessageFormat.format(ZmMsg.itemCount,
			                               [item.numMsgs, messages]);
		}

		break;
	}

	return ZmMailListView.prototype._getLabelForField.apply(this, arguments);
};

ZmConvListView.prototype._getHeaderToolTip =
function(field, itemIdx) {

	if (field == ZmItem.F_EXPAND) {
		return "";
	}
	if (field == ZmItem.F_FROM) {
		return ZmMsg.from;
	}
	return ZmMailListView.prototype._getHeaderToolTip.call(this, field, itemIdx);
};

ZmConvListView.prototype._getToolTip =
function(params) {

	if (!params.item) { return; }

	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) && (params.field == ZmItem.F_PARTICIPANT)) { 
		var parts = params.item.participants;
		var matchedPart = params.match && params.match.participant;
		var addr = parts && parts.get(matchedPart || 0);
		if (!addr) { return ""; }

		var ttParams = {address:addr, ev:params.ev};
		var ttCallback = new AjxCallback(this,
			function(callback) {
				appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, ttParams, callback);
			});
		return {callback:ttCallback};
	} else if (params.item.type == ZmItem.MSG) {
		return ZmMailMsgListView.prototype._getToolTip.apply(this, arguments);
	} else if (params.field == ZmItem.F_FROM) {
		// do nothing - this is white space in the TD not taken up by participants
	} else {
		return ZmMailListView.prototype._getToolTip.apply(this, arguments);
	}
};

/**
 * @param {ZmConv}		conv	conv that owns the messages we will display
 * @param {ZmMailMsg}	msg		msg that is the anchor for paging in more msgs (optional)
 * @param {boolean}		force	if true, render msg rows		
 * 
 * @private
 */
ZmConvListView.prototype._expand =
function(conv, msg, force) {
	var item = msg || conv;
	var isConv = (item.type == ZmItem.CONV);
	var rowIds = this._msgRowIdList[item.id];
	var lastRow;
	if (rowIds && rowIds.length && this._rowsArePresent(item) && !force) {
		this._showMsgs(rowIds, true);
		lastRow = document.getElementById(rowIds[rowIds.length - 1]);
	} else {
		this._msgRowIdList[item.id] = [];
		var msgList = conv.msgs;
		if (!msgList) { return; }
		if (isConv) {
			// should be here only when the conv is first expanded
			msgList.addChangeListener(this._listChangeListener);
		}

		var ascending = (appCtxt.get(ZmSetting.CONVERSATION_ORDER) == ZmSearch.DATE_ASC);
		var index = this._getRowIndex(item);	// row after which to add rows
		if (ascending && msg) {
			index--;	// for ascending, we want to expand upward (add above expandable msg row)
		}
		var offset = this._msgOffset[item.id] || 0;
		var a = conv.getMsgList(offset, ascending, ZmMailApp.getFoldersToOmit());
		for (var i = 0; i < a.length; i++) {
			var msg = a[i];
			var div = this._createItemHtml(msg);
			this._addRow(div, index + i + 1);
			rowIds = this._msgRowIdList[item.id];
			if (rowIds) {
				rowIds.push(div.id);
			}
			// TODO: we may need to use a group for nested conversations;
			// either as proper DOM nesting or with aria-owns.
			div.setAttribute('aria-level', 2);
			rowIds = this._msgRowIdList[item.id];
			if (i == a.length - 1) {
				lastRow = div;
			}
		}
	}

	this._setImage(item, ZmItem.F_EXPAND, "NodeExpanded", this._getClasses(ZmItem.F_EXPAND));
	this._expanded[item.id] = true;
	
	var cid = isConv ? item.id : item.cid;
	if (!this._expandedItems[cid]) {
		this._expandedItems[cid] = [];
	}
	this._expandedItems[cid].push(item);

	this._resetColWidth();
	if (lastRow) {
		this._scrollList(lastRow);
		if (rowIds) {
			var convHeight = rowIds.length * Dwt.getSize(lastRow).y;
			if (convHeight > Dwt.getSize(lastRow.parentNode).y) {
				this._scrollList(this._getElFromItem(item));
			}
		}
	}

	this._updateLabelForItem(item);
};

ZmConvListView.prototype._collapse =
function(item) {
	var isConv = (item.type == ZmItem.CONV);
	var cid = isConv ? item.id : item.cid;
	var expItems = this._expandedItems[cid];
	// also collapse any expanded sections below us within same conv
	if (expItems && expItems.length) {
		var done = false;
		while (!done) {
			var nextItem = expItems.pop();
			this._doCollapse(nextItem);
			done = ((nextItem.id == item.id) || (expItems.length == 0));
		}
	}

	if (isConv) {
		this._expanded[item.id] = false;
		this._expandedItems[cid] = [];
	}

	this._resetColWidth();
	this._updateLabelForItem(item);
};

ZmConvListView.prototype._updateLabelForItem =
function(item) {
	ZmMailListView.prototype._updateLabelForItem.apply(this, arguments);

	if (item && this._isExpandable(item)) {
		var el = this._getElFromItem(item);
		if (el && el.setAttribute) {
			el.setAttribute('aria-expanded', this.isExpanded(item));
		}
	}
}

ZmConvListView.prototype._doCollapse =
function(item) {
	var rowIds = this._msgRowIdList[item.id];
	if (rowIds && rowIds.length) {
		this._showMsgs(rowIds, false);
	}
	this._setImage(item, ZmItem.F_EXPAND, "NodeCollapsed", this._getClasses(ZmItem.F_EXPAND));
	this._expanded[item.id] = false;
	this._updateLabelForItem(item);
};

ZmConvListView.prototype._showMsgs =
function(ids, show) {
	if (!(ids && ids.length)) { return; }

	for (var i = 0; i < ids.length; i++) {
		var row = document.getElementById(ids[i]);
		if (row) {
			Dwt.setVisible(row, show);
		}
	}
};

/**
 * Make sure that the given item has a set of expanded rows. If you expand an item
 * and then page away and back, the DOM is reset and your rows are gone.
 * 
 * @private
 */
ZmConvListView.prototype._rowsArePresent =
function(item) {
	var rowIds = this._msgRowIdList[item.id];
	if (rowIds && rowIds.length) {
		for (var i = 0; i < rowIds.length; i++) {
			if (document.getElementById(rowIds[i])) {
				return true;
			}
		}
	}
	this._msgRowIdList[item.id] = [];	// start over
	this._expanded[item.id] = false;
	if (item.type == ZmItem.CONV) {
		this._expandedItems[item.id] = [];
	}
	else {
		AjxUtil.arrayRemove(this._expandedItems[item.cid], item);
	}
	return false;
};

/**
 * Returns true if the given conv or msg should have an expansion icon. A conv is
 * expandable if it has 2 or more msgs. A msg is expandable if it's the last on a
 * page and there are more msgs.
 *
 * @param item		[ZmMailItem]	conv or msg to check
 * 
 * @private
 */
ZmConvListView.prototype._isExpandable =
function(item) {
	var expandable = false;
	if (item.type == ZmItem.CONV) {
		expandable = (this._getDisplayedMsgCount(item) > 1);
	} else {
		var conv = appCtxt.getById(item.cid);
		if (!conv) { return false; }
		
		var a = conv.msgs ? conv.msgs.getArray() : null;
		if (a && a.length) {
			var limit = appCtxt.get(ZmSetting.CONVERSATION_PAGE_SIZE);
			var idx = null;
			for (var i = 0; i < a.length; i++) {
				if (a[i].id == item.id) {
					idx = i + 1;	// start with 1
					break;
				}
			}
			if (idx && (idx % limit == 0) && (idx < a.length || conv.msgs._hasMore)) {
				this._msgOffset[item.id] = idx;
				expandable = true;
			}
		}
	}

	return expandable;
};

ZmConvListView.prototype._resetExpansion =
function() {

	// remove change listeners on conv msg lists
	for (var id in this._expandedItems) {
		var item = this._expandedItems[id];
		if (item && item.msgs) {
			item.msgs.removeChangeListener(this._listChangeListener);
		}
	}

	this._expanded		= {};	// current expansion state, by ID
	this._msgRowIdList	= {};	// list of row IDs for a conv ID
	this._msgOffset		= {};	// the offset for a msg ID
	this._expandedItems	= {};	// list of expanded items for a conv ID (inc conv)
};

ZmConvListView.prototype.isExpanded =
function(item) {
	return Boolean(item && this._expanded[item.id]);
};

ZmConvListView.prototype._expandItem =
function(item) {
	if (item && this._isExpandable(item)) {
		this._controller._toggle(item);
	} else if (item.type == ZmItem.MSG && this._expanded[item.cid]) {
		var conv = appCtxt.getById(item.cid);
		this._controller._toggle(conv);
		this.setSelection(conv, true);
	}
};

ZmConvListView.prototype._expandAll = function(expand) {

    if (!this._list) {
        return;
    }

	var a = this._list.getArray();
	for (var i = 0, count = a.length; i < count; i++) {
		var conv = a[i];
		if (!this._isExpandable(conv) || expand === this.isExpanded(conv)) {
            continue;
        }
		if (expand)	{
            if (conv._loaded) {
			    this._expandItem(conv);
            }
		}
        else if (!expand) {
			this._collapse(conv);
		}
	}
};

ZmConvListView.prototype._sortColumn =
function(columnItem, bSortAsc, callback) {

	// call base class to save the new sorting pref
	ZmMailListView.prototype._sortColumn.apply(this, arguments);

	var query;
	var list = this.getList();
	if (this._columnHasCustomQuery(columnItem)) {
		query = this._getSearchForSort(columnItem._sortable);
	}
	else if (list && list.size() > 1 && this._sortByString) {
		query = this._controller.getSearchString();
	}

	var queryHint = this._controller.getSearchStringHint();

	if (query || queryHint) {
		var params = {
			query:			query,
			queryHint:		queryHint,
			types:			[ZmItem.CONV],
			sortBy:			this._sortByString,
			limit:			this.getLimit(),
			callback:		callback,
			userInitiated:	this._controller._currentSearch.userInitiated,
			sessionId:		this._controller._currentSearch.sessionId,
			isViewSwitch:	true
		};
		appCtxt.getSearchController().search(params);
	}
};

ZmConvListView.prototype._changeListener =
function(ev) {

	var item = this._getItemFromEvent(ev);
	if (!item || ev.handled || !this._handleEventType[item.type]) {
		if (ev && ev.event == ZmEvent.E_CREATE) {
			AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: initial check failed");
		}
		return;
	}

	var fields = ev.getDetail("fields");
	var isConv = (item.type == ZmItem.CONV);
    var isMute = item.isMute ? item.isMute : false;
	var sortBy = this._sortByString || ZmSearch.DATE_DESC;
	var handled = false;
	var forceUpdateConvSize = false; //in case of soft delete we don't get notification of size change from server so take care of this case outselves.
	var convToUpdate = null; //in case this is a msg but we want to update the size field for a conv - this is the conv to use.
	
	// msg moved or deleted
	if (!isConv && (ev.event == ZmEvent.E_MOVE || ev.event == ZmEvent.E_DELETE)) {
		var items = ev.batchMode ? this._getItemsFromBatchEvent(ev) : [item];
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			var conv = appCtxt.getById(item.cid);
			handled = true;
			if (conv) {
				if (item.folderId == ZmFolder.ID_SPAM || item.folderId == ZmFolder.ID_TRASH || ev.event == ZmEvent.E_DELETE) {
					if (item.folderId == ZmFolder.ID_TRASH) {
						//only in this case we don't get size notification from server.
						forceUpdateConvSize = true;
						convToUpdate = conv;
					}
					// msg marked as Junk, or hard-deleted
					conv.removeMsg(item);
					this.removeItem(item, true, ev.batchMode);	// remove msg row
					this._controller._app._checkReplenishListView = this;
					this._setNextSelection();
				} else {
					if (!conv.containsMsg(item)) {
						//the message was moved to this conv, most likely by "undo". (not sure if any other ways, probably not).
						sortIndex = conv.msgs && conv.msgs._getSortIndex(item, ZmSearch.DATE_DESC);
						conv.addMsg(item, sortIndex);
						forceUpdateConvSize = true;
						convToUpdate = conv;
						var expanded = this._expanded[conv.id];
						//remove rows so will have to redraw them, reflecting the new item.
						this._removeMsgRows(conv.id);
						if (expanded) {
							//expand if it was expanded before this undo.
							this._expand(conv, null, true);
						}
					}
					else if (!conv.hasMatchingMsg(this._controller._currentSearch, true)) {
						this._list.remove(conv);				// view has sublist of controller list
						this._controller._list.remove(conv);	// complete list
						ev.item = item = conv;
						isConv = true;
						handled = false;
					} else {
						// normal case: just change folder name for msg
						this._changeFolderName(item, ev.getDetail("oldFolderId"));
					}
				}
			}
		}
	}

	// conv moved or deleted	
	if (isConv && (ev.event == ZmEvent.E_MOVE || ev.event == ZmEvent.E_DELETE)) {
		var items = ev.batchMode ? this._getItemsFromBatchEvent(ev) : [item];
		for (var i = 0, len = items.length; i < len; i++) {
			var conv = items[i];
			if (this._itemToSelect && (this._itemToSelect.cid == conv.id  //the item to select is in this conv.
										|| this._itemToSelect.id == conv.id)) { //the item to select IS this conv
				var omit = {};
				if (conv.msgs) { //for some reason, msgs might not be set for the conv.
					var a = conv.msgs.getArray();
					for (var j = 0, len1 = a.length; j < len1; j++) {
						omit[a[j].id] = true;
					}
				}
				//omit the conv too, since if we have ZmSetting.DELETE_SELECT_PREV, going up will get back to this conv, but the conv is gone
				omit[conv.id] = true;
				this._itemToSelect = this._controller._getNextItemToSelect(omit);
			}
			this._removeMsgRows(conv.id);	// conv move: remove msg rows
			this._expanded[conv.id] = false;
			this._expandedItems[conv.id] = [];
			delete this._msgRowIdList[conv.id];
		}
	}

	// if we get a new msg that's part of an expanded conv, insert it into the
	// expanded conv, and don't move that conv
	if (!isConv && (ev.event == ZmEvent.E_CREATE)) {
		AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: handle msg create " + item.id);
		var rowIds = this._msgRowIdList[item.cid];
		var conv = appCtxt.getById(item.cid);
		if (rowIds && rowIds.length && this._rowsArePresent(conv)) {
			var div = this._createItemHtml(item);
			if (!this._expanded[item.cid]) {
				Dwt.setVisible(div, false);
			}
			var convIndex = this._getRowIndex(conv);
			var sortIndex = ev.getDetail("sortIndex");
			var msgIndex = sortIndex || 0;
			AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: add msg row to conv " + item.id + " within " + conv.id);
			this._addRow(div, convIndex + msgIndex + 1);
			rowIds.push(div.id);
		}
		if (conv) { //see bug 91083 for change prior to this "if" wrapper I add here just in case.
			forceUpdateConvSize = true;
			convToUpdate = conv;
			handled = ev.handled = true;
		}
	}

	// The sort index we're given is relative to a list of convs. We want one relative to a list view which may
	// have some msg rows from expanded convs in there.
	if (isConv && (ev.event == ZmEvent.E_CREATE)) {
		ev.setDetail("sortIndex", this._getSortIndex(item, sortBy));
	}
	
	// virtual conv promoted to real conv, got new ID
	if (isConv && (ev.event == ZmEvent.E_MODIFY) && (fields && fields[ZmItem.F_ID])) {
		// a virtual conv has become real, and changed its ID
		var div = document.getElementById(this._getItemId({id:item._oldId}));
		if (div) {
			this._createItemHtml(item, {div:div});
			this.associateItemWithElement(item, div);
			DBG.println(AjxDebug.DBG1, "conv updated from ID " + item._oldId + " to ID " + item.id);
		}
		this._expanded[item.id] = this._expanded[item._oldId];
		this._expandedItems[item.id] = this._expandedItems[item._oldId];
		this._msgRowIdList[item.id] = this._msgRowIdList[item._oldId] || [];
	}

	// when adding a conv (or changing its position within the list), we need to look at its sort order
	// within the list of rows (which may include msg rows) rather than in the ZmList of convs, since
	// those two don't necessarily map to each other
	if (isConv && ((ev.event == ZmEvent.E_MODIFY) && (fields && fields[ZmItem.F_INDEX]))) {
		// INDEX change: a conv has gotten a new msg and may need to be moved within the list of convs
		// if an expanded conv gets a new msg, don't move it to top
		AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: handle conv create " + item.id);
		var sortIndex = this._getSortIndex(item, sortBy);
		var curIndex = this.getItemIndex(item, true);

		if ((sortIndex != null) && (curIndex != null) && (sortIndex != curIndex) &&	!this._expanded[item.id]) {
            AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: change position of conv " + item.id + " to " + sortIndex);
            this._removeMsgRows(item.id);
            this.removeItem(item);
            this.addItem(item, sortIndex);
            // TODO: mark create notif handled?
		}
	}

	// only a conv can change its fragment
	if ((ev.event == ZmEvent.E_MODIFY || ev.event == ZmEvent.E_MOVE) && (fields && fields[ZmItem.F_FRAGMENT])) {
		this._updateField(isConv ? item : appCtxt.getById(item.cid), ZmItem.F_SUBJECT);
	}

	if (ev.event == ZmEvent.E_MODIFY && (fields && (fields[ZmItem.F_PARTICIPANT] || fields[ZmItem.F_FROM] ||
													(fields[ZmItem.F_SIZE] && !this.isMultiColumn())))) {
		this._updateField(item, ZmItem.F_FROM);
	}

	// remember if a conv's unread state changed since it affects how the conv is loaded when displayed
	if (ev.event == ZmEvent.E_FLAGS) {
		var flags = ev.getDetail("flags");
		if (AjxUtil.isArray(flags) && AjxUtil.indexOf(flags, ZmItem.FLAG_UNREAD) != -1) {
			item = item || (items && items[i]);
			var conv = isConv ? item : item && appCtxt.getById(item.cid);
			if (conv) {
				conv.unreadHasChanged = true;
			}
		}
	}

	// msg count in a conv changed - see if we need to add or remove an expand icon
	if (forceUpdateConvSize || (isConv && (ev.event === ZmEvent.E_MODIFY && fields && fields[ZmItem.F_SIZE]))) {
		conv = convToUpdate || item;
		var numDispMsgs = this._getDisplayedMsgCount(conv);
		//redraw the item when redraw is requested or when the new msg count is set to 1(msg deleted) or 2(msg added)
		//redrawConvRow is from bug 75301 - not sure this case is still needed after my fix but keeping it to be safe for now.
		if (conv.redrawConvRow || numDispMsgs === 1 || numDispMsgs === 2) {
			if (numDispMsgs === 1) {
				this._collapse(conv); //collapse since it's only one message.
			}
			//must redraw the line since the ZmItem.F_EXPAND field might not be there when switching from 1 message conv, so updateField does not work. And also we
			//don't want it after deleting message(s) resulting in 1.
			this.redrawItem(conv);
		}
		this._updateField(conv, this.isMultiColumn() ? ZmItem.F_SIZE : ZmItem.F_FROM); //in reading pane on the right, the count appears in the "from".
	}

	if (ev.event == ZmEvent.E_MODIFY && (fields && fields[ZmItem.F_DATE])) {
		this._updateField(item, ZmItem.F_DATE);
	}

	if (!handled) {
		if (isConv) {
			if (ev.event == ZmEvent.E_MODIFY && item.msgs) {
				//bug 79256 - in some cases the listeners gets removed when Conv is moved around.
				//so add the listeners again. If they are already present than this will be a no-op.
				var cv = this.getController()._convView;
				if (cv) {
					item.msgs.addChangeListener(cv._listChangeListener);
				}
				item.msgs.addChangeListener(this._listChangeListener);
			}
			ZmMailListView.prototype._changeListener.apply(this, arguments);
		} else {
			ZmMailMsgListView.prototype._changeListener.apply(this, arguments);
		}
	}
};

ZmConvListView.prototype.handleUnmuteConv =
function(items) {
    for(var i=0; i<items.length; i++) {
        var item = items[i];
        var isConv = (item.type == ZmItem.CONV);
        if (!isConv) { continue; }
        var sortBy = this._sortByString || ZmSearch.DATE_DESC;
        var sortIndex = this._getSortIndex(item, sortBy);
        var curIndex = this.getItemIndex(item, true);

        if ((sortIndex != null) && (curIndex != null) && (sortIndex != curIndex) &&	!this._expanded[item.id]) {
            AjxDebug.println(AjxDebug.NOTIFY, "ZmConvListView: change position of conv " + item.id + " to " + sortIndex);
            this._removeMsgRows(item.id);
            this.removeItem(item);
            this.addItem(item, sortIndex);
        }
    }
};

ZmConvListView.prototype._getSortIndex =
function(conv, sortBy) {

	var itemDate = parseInt(conv.date);
	var list = this.getList(true);
	var a = list && list.getArray();
	if (a && a.length) {
		for (var i = 0; i < a.length; i++) {
			var item = a[i];
			if (!item || (item && item.type == ZmItem.MSG)) { continue; }
			var date = parseInt(item.date);
			if ((sortBy && sortBy.toLowerCase() === ZmSearch.DATE_DESC.toLowerCase() && (itemDate >= date)) ||
				(sortBy && sortBy.toLowerCase() === ZmSearch.DATE_ASC.toLowerCase() && (itemDate <= date))) {
				return i;
			}
		}
		return i;
	}
	else {
		return null;
	}
};

ZmConvListView.prototype._removeMsgRows =
function(convId) {
	var msgRows = this._msgRowIdList[convId];
	if (msgRows && msgRows.length) {
		for (var i = 0; i < msgRows.length; i++) {
			var row = document.getElementById(msgRows[i]);
			if (row) {
				this._selectedItems.remove(row);
				this._parentEl.removeChild(row);
			}
		}
	}
};

/**
 * Override so we can clean up lists of cached rows.
 */
ZmConvListView.prototype.removeItem =
function(item, skipNotify) {
	if (item.type == ZmItem.MSG) {
		AjxUtil.arrayRemove(this._msgRowIdList[item.cid], this._getItemId(item));
	}
	DwtListView.prototype.removeItem.apply(this, arguments);
};

ZmConvListView.prototype._allowFieldSelection =
function(id, field) {
	// allow left selection if clicking on blank icon
	if (field == ZmItem.F_EXPAND) {
		var item = appCtxt.getById(id);
		return (item && !this._isExpandable(item));
	} else {
		return ZmListView.prototype._allowFieldSelection.apply(this, arguments);
	}
};

ZmConvListView.prototype.redoExpansion =
function() {
	var list = [];
	var offsets = {};
	for (var cid in this._expandedItems) {
		var items = this._expandedItems[cid];
		if (items && items.length) {
			for (var i = 0; i < items.length; i++) {
				var id = items[i];
				list.push(id);
				offsets[id] = this._msgOffset[id];
			}
		}
	}
	this._expandAll(false);
	this._resetExpansion();
	for (var i = 0; i < list.length; i++) {
		var id = list[i];
		this._expand(id, offsets[id]);
	}
};

ZmConvListView.prototype._getLastItem =
function() {
	var list = this.getList();
	var a = list && list.getArray();
	if (a && a.length > 1) {
		return a[a.length - 1];
	}
	return null;
};

ZmConvListView.prototype._getActionMenuForColHeader =
function(force) {

	var menu = ZmMailListView.prototype._getActionMenuForColHeader.apply(this, arguments);
	if (!this.isMultiColumn()) {
		var mi = this._colHeaderActionMenu.getMenuItem(ZmItem.F_FROM);
		if (mi) {
			mi.setVisible(false);
		}
		mi = this._colHeaderActionMenu.getMenuItem(ZmItem.F_TO);
		if (mi) {
			mi.setVisible(false);
		}
	}
	return menu;
};

/**
 * @private
 * @param {hash}		params			hash of parameters:
 * @param {boolean}		expansion		if true, preserve expansion
 */
ZmConvListView.prototype._saveState =
function(params) {
	ZmMailListView.prototype._saveState.apply(this, arguments);
	this._state.expanded = params && params.expansion && this._expanded;
};

ZmConvListView.prototype._restoreState =
function(state) {

	var s = state || this._state;
	if (s.expanded) {
		for (var id in s.expanded) {
			if (s.expanded[id]) {
				this._expandItem(s.expanded[id]);
			}
		}
	}
	ZmMailListView.prototype._restoreState.call(this);
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmMailListSectionHeader")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Section header provides a header to divide groups into sections.  The bar supports actions for click, mouseover,
 * mouseout, expand and collapse sections.
 * @param {ZmMailListGroup} group Group object
 * @param {objet} params hash of params for DwtControl
 */
ZmMailListSectionHeader= function(group, params) {
  var params = params || {} ;
  params.parent = params.parent || appCtxt.getShell();
  params.id = this.id = params.id || Dwt.getNextId();
  params.className = params.className || "groupHeader";
  DwtControl.call(this, params);
  this._group = group;
  this.setHtmlElementId(Dwt.getNextId(ZmMailListSectionHeader.HEADER_ID));
  this._createHtml(params);
  this._setEventHdlrs([DwtEvent.ONMOUSEDOWN]);
  this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._groupHeaderMouseClick));

  this._collapsed = false;
};

ZmMailListSectionHeader.prototype = new DwtControl;
ZmMailListSectionHeader.prototype.constructor = ZmMailListSectionHeader;
ZmMailListSectionHeader.HEADER_ID = "GroupHeader_";

/**
 * returns HTML string of header
 * @return {String} html
 */
ZmMailListSectionHeader.prototype.getHeaderHtml =
function() {
    return this._el.innerHTML;
};


ZmMailListSectionHeader.prototype._createHtml =
function(params) {
	this._el = this.getHtmlElement();
	this._el.innerHTML = this._renderGroupHdr(params.headerTitle);
};

ZmMailListSectionHeader.prototype._renderGroupHdr =
function(headerTitle) {
    var id = this._el.id;
    var htmlArr = [];
    var idx = 0;
    var nodeIdStr = "id='" + id + "_imgNode'";
    htmlArr[idx++] = "<div id='" + id +"'>";
    htmlArr[idx++] = "<table role='presentation' cellpadding=0 cellspacing=0 border=0 width=100% class='DwtListView-Column'><tr><td>";
    htmlArr[idx++] =  AjxImg.getImageHtml("NodeExpanded", "float:left;", nodeIdStr);
	htmlArr[idx++] = "<div class='DwtListHeaderItem-label black' style='padding:0px 0px 2px 2px; font-weight:bold; float:left;' id='" + id + "_groupTitle'>";
    htmlArr[idx++] = headerTitle;
    htmlArr[idx++] = "</div>";
    htmlArr[idx++] = "</td></tr></table>"
	htmlArr[idx++] = "</div>";
    return htmlArr.join("");
};

ZmMailListSectionHeader.prototype._groupHeaderMouseClick =
function(ev) {
   if (ev && ev.button == DwtMouseEvent.RIGHT) {
       this._actionMenuListener(ev);
   }
   else {
       if (!this._collapsed) {
           this._doCollapse(ev);
       }
       else {
           this._doExpand(ev);
       }
   }
};

ZmMailListSectionHeader.prototype._doCollapse =
function(ev) {
    var p = document.getElementById(this._el.id);
    while (p) {
        var ns = p.nextSibling;
        if (ns && ns.id.indexOf(ZmMailListSectionHeader.HEADER_ID) == -1) {
            Dwt.setVisible(ns, false);
        }
        else{
            this._setImage(this._el.id + "_imgNode", "NodeCollapsed");
            this._collapsed = true;
            return;
        }
        p = ns;
    }
};

ZmMailListSectionHeader.prototype._doExpand =
function(ev) {
    var p = document.getElementById(this._el.id);
    while (p) {
        var ns = p.nextSibling;
        if (ns && ns.id.indexOf(ZmMailListSectionHeader.HEADER_ID) == -1) {
            Dwt.setVisible(ns, true);
        }
        else {
            this._setImage(this._el.id + "_imgNode", "NodeExpanded");
            this._collapsed = false;
            return;
        }
        p = ns;
    }
};

ZmMailListSectionHeader.prototype._collapseAll =
function(ev) {
  if (this._group) {
      var headers = this._group.getAllSectionHeaders();
      for (var i=0; i<headers.length; i++) {
          headers[i]._doCollapse(ev);
      }
  }
};

ZmMailListSectionHeader.prototype._expandAll =
function(ev) {
  if (this._group) {
      var headers = this._group.getAllSectionHeaders();
      for (var i=0; i<headers.length; i++) {
          headers[i]._doExpand(ev);
      }
  }
};

ZmMailListSectionHeader.prototype._setImage =
function(imgId, imgInfo) {
    var imgNode = document.getElementById(imgId);
    if (imgNode && imgNode.parentNode) {
        AjxImg.setImage(imgNode.parentNode, imgInfo);
    }
};

ZmMailListSectionHeader.prototype._actionMenuListener =
function(ev) {
	if (!this._menu) {
		var menu = new ZmPopupMenu(this);
		var collapseListener = new AjxListener(this, this._collapseAll);
		var expandListener = new AjxListener(this, this._expandAll);
		var mi = menu.createMenuItem("collapse_all", {text:ZmMsg.collapseAllGroups, style:DwtMenuItem.NO_STYLE});
		mi.addSelectionListener(collapseListener);
		mi = menu.createMenuItem("expand_all", {text:ZmMsg.expandAllGroups, style:DwtMenuItem.NO_STYLE});
		mi.addSelectionListener(expandListener);
		this._menu = menu;
	}
    this._menu.popup(0, ev.docX, ev.docY);
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmConvView2")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a view that will later display one conversation at a time.
 * @constructor
 * @class
 * This class displays and manages a conversation.
 *
 * @author Conrad Damon
 * 
 * @param {string}						id				ID for HTML element
 * @param {ZmConvListController}		controller		containing controller
 * 
 * @extends		ZmMailItemView
 */
ZmConvView2 = function(params) {

	params.className = params.className || "ZmConvView2 ZmConvView2FullWidth";
	ZmMailItemView.call(this, params);

	this._mode = params.mode;
	this._controller = params.controller;
	this._convChangeHandler = this._convChangeListener.bind(this);
	this._listChangeListener = this._msgListChangeListener.bind(this);
	this._standalone = params.standalone;
	this._hasBeenExpanded = {};	// track which msgs have been expanded at least once
	this.inviteMsgsExpanded = 0; //track how many invite messages have been expanded.

	this.addControlListener(this._scheduleResize.bind(this));
	this._setAllowSelection();
	this._setEventHdlrs([DwtEvent.ONMOUSEOUT, DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE]); // needed by object manager
	this._objectManager = true;
};

ZmConvView2.prototype = new ZmMailItemView;
ZmConvView2.prototype.constructor = ZmConvView2;

ZmConvView2.prototype.isZmConvView2 = true;
ZmConvView2.prototype.toString = function() { return "ZmConvView2"; };
ZmConvView2.MAX_INVITE_MSG_EXPANDED = 10;

ZmConvView2.prototype.role = 'region';

/**
 * Displays the given conversation.
 * 
 * @param {ZmConv}		conv		the conversation to display
 */
ZmConvView2.prototype.set = function(conv) {

    if (conv && this._item && conv.id === this._item.id && !this._convDirty) {
        return;
    }

	var gotConv = (conv != null);
	this.reset(gotConv);
	this._item = conv;

	this._cleared = this.noTab = !gotConv;
	if (gotConv) {
		this._initialize();
		conv.addChangeListener(this._convChangeHandler);
	
		this._renderConv(conv);
		if (conv.msgs) {
			conv.msgs.addChangeListener(this._listChangeListener);
			var clv = this._controller.getListView();
			if (clv && clv.isZmConvListView) {
				conv.msgs.addChangeListener(clv._listChangeListener);
				if (clv.isExpanded(conv)) {
					// bug 74730 - rerender expanded conv's msg rows
					clv._removeMsgRows(conv.id);
					clv._expand(conv, null, true);
				}
			}
		}
	}
	else {
		this._initializeClear();
		this._clearDiv.innerHTML = (this._controller.getList().size()) ? this._viewConvHtml : "";
	}

    Dwt.setVisible(this._mainDiv, gotConv);
    Dwt.setVisible(this._clearDiv, !gotConv);
};

ZmConvView2.prototype._initialize =
function() {

	if (this._initialized) { return; }
	
	// Create HTML structure
	this._mainDivId			= this._htmlElId + "_main";
	var headerDivId			= this._htmlElId + "_header";
	this._messagesDivId		= this._htmlElId + "_messages";
	
	var subs = {
		mainDivId:			this._mainDivId,
		headerDivId:		headerDivId,
		messagesDivId:		this._messagesDivId
	}

	var html = AjxTemplate.expand("mail.Message#Conv2View", subs);
	this.getHtmlElement().appendChild(Dwt.parseHtmlFragment(html));
	
	this._mainDiv			= document.getElementById(this._mainDivId);
	this._messagesDiv		= document.getElementById(this._messagesDivId);
	
	this._header = new ZmConvView2Header({
		parent: this,
		id:		[this._htmlElId, ZmId.MV_MSG_HEADER].join("_")
	});
	this._header.replaceElement(headerDivId);

	 // label our control after the subject element
	this.setAttribute('aria-labelledby', this._header._convSubjectId);

	if (this._controller && this._controller._checkKeepReading) {
		Dwt.setHandler(this._messagesDiv, DwtEvent.ONSCROLL, ZmDoublePaneController.handleScroll);
	}

	this._initialized = true;
};

ZmConvView2.prototype._initializeClear =
function() {

	if (this._initializedClear) { return; }
	
	this._viewConvHtml = AjxTemplate.expand("mail.Message#viewMessage", {isConv:true});
	var div = this._clearDiv = document.createElement("div");
	div.id = this._htmlElId + "_clear";
	this.getHtmlElement().appendChild(div);
	
	this._initializedClear = true;
};

ZmConvView2.prototype._renderConv =
function(conv) {

	this._now = new Date();
	this._header.set(this._item);
	var firstExpanded = this._renderMessages(conv, this._messagesDiv);
	DBG.println("cv2", "Conv render time: " + ((new Date()).getTime() - this._now.getTime()));

	this._header._setExpandIcon();
	this._scheduleResize(firstExpanded || true);
	this.inviteMsgsExpanded = 0; //reset the inviteMsgExpanded count.
	Dwt.setLoadedTime("ZmConv");
    this._convDirty = false;
};

// Only invoked by doing a saveDraft, from editing a reply in an individual Conversation display
ZmConvView2.prototype.redrawItem = function(item) {
	this._renderConv(this._item);
}
ZmConvView2.prototype.setSelection = function(item, skipNotify, forceSelection) { }

/**
 * Renders this conversation's messages. Each message may be expanded (shows header, body, and footer)
 * or collapsed (shows just the header).
 * 
 * So far the messages are not contained within a ZmListView. Instead, they rely on the controller for
 * the parent CLV to handle actions.
 * 
 * @param conv
 * @param container
 */
ZmConvView2.prototype._renderMessages =
function(conv, container) {

	// clear messages from tabgroup; we'll re-add them later
	this.getTabGroupMember().removeAllMembers();

	this.getTabGroupMember().addMember(this._header);

	this._msgViews = {};
	this._msgViewList = [];
	var msgs = conv.getMsgList(0, false, ZmMailApp.getFoldersToOmit());
	
	// base the ordering off a list of msg IDs
	var idList = [], idHash = {};
	for (var i = 0, len = msgs.length; i < len; i++) {
		idList.push(msgs[i].id);
		idHash[msgs[i].id] = msgs[i];
	}
	
	// figure out which msg views should be expanded; if the msg is loaded and we're viewing it
	// for the first time, it was unread so we expand it; expand the first if there are none to expand
	var toExpand = {}, toCollapse = {};
	// check if conv was opened by selecting "Show Conversation" for a msg
	var launchMsgId = this._controller._relatedMsg && this._controller._relatedMsg.id;
	var gotOne = false;
	for (var i = 0, len = idList.length; i < len; i++) {
		var id = idList[i];
		var msg = idHash[id];
		if (launchMsgId) {
			toExpand[id] = (id == launchMsgId);
			toCollapse[id] = (id != launchMsgId);
		}
		else if (msg && msg.isLoaded() && !this._hasBeenExpanded[id]) {
			toExpand[id] = gotOne = true;
		}
	}
	if (!gotOne && !launchMsgId) {
		toExpand[idList[0]] = true;
	}
	
	// flip the list for display based on user pref
	var oldToNew = (appCtxt.get(ZmSetting.CONVERSATION_ORDER) == ZmSearch.DATE_ASC);
	if (oldToNew) {
		idList.reverse();
	}

	var idx;
	var oldestIndex = oldToNew ? 0 : msgs.length - 1;
	for (var i = 0, len = idList.length; i < len; i++) {
		var id = idList[i];
		var msg = idHash[id];
		var params = {
			parent:			this,
			parentElement:	container,
			controller:		this._controller,
			index:          i
		}
		params.forceExpand = toExpand[id];
		params.forceCollapse = toCollapse[id];
		// don't look for quoted text in oldest msg - it is considered wholly original
		params.forceOriginal = (i == oldestIndex);
		this._renderMessage(msg, params);
		var msgView = this._msgViews[id];
		if (idx == null) {
			idx = msgView._expanded ? i : null;
		}
	}
	
	return idx && this._msgViews[this._msgViewList[idx]];
};

ZmConvView2.prototype._renderMessage =
function(msg, params) {
	
	params = AjxUtil.hashCopy(params) || {};
	params.mode = this._mode;
	params.msgId = msg.id;
	params.sessionId = this._controller.getSessionId();
	params.isDraft = msg.isDraft;

	var container = params.parentElement;
	if (container) {
		// wrap the message element in a DIV with role listitem
		var listitem = params.parentElement = document.createElement('DIV');
		listitem.setAttribute('role', 'listitem');
		if ((params.index != null) && container.childNodes[params.index]) {
			container.insertBefore(listitem, container.childNodes[params.index]);
		}
		else {
			container.appendChild(listitem);
		}

		// this method is called when iterating over messages; hence,
		// the current index is the number of messages processed
		var msgCount = this._item.msgs ? this._item.msgs.size() : 0;
		var msgIdx = (params.index != null) ? params.index + 1 : container.childNodes.length;
		var messages = AjxMessageFormat.format(ZmMsg.typeMessage, [msgCount]);
		var label = AjxMessageFormat.format(ZmMsg.itemCount1, [msgIdx, msgCount, messages]);

		listitem.setAttribute('aria-label', label);

		// TODO: hidden header support
		/* listitem.appendChild(util.createHiddenHeader(label, 2)); */
	}

	AjxUtil.arrayAdd(this._msgViewList, msg.id, params.index);
	var msgView = this._msgViews[msg.id] = new ZmMailMsgCapsuleView(params);

	// add to tabgroup
	this.getTabGroupMember().addMember(msgView.getTabGroupMember());
	msgView.set(msg);
};

ZmConvView2.prototype.clearChangeListeners =
function() {

	if (!this._item) {
		return;
	}
	this._item.removeChangeListener(this._convChangeHandler);
	if (this._item.msgs) {
		this._item.msgs.removeChangeListener(this._listChangeListener);
	}
	this._item = null;
};

ZmConvView2.prototype.reset =
function(noClear) {
	
	this._setSelectedMsg(null);
	this.clearChangeListeners();

	for (var id in this._msgViews) {
		var msgView = this._msgViews[id];
		msgView.reset();
		msgView.dispose();
		msgView = null;
		delete this._msgViews[id];
	}
	this._msgViewList = null;
	this._currentMsgView = null;

	// remove the listitem wrappers around the msg views (see _renderMessage)
	var msgsDiv = this._messagesDiv;
	while (msgsDiv && msgsDiv.lastChild) {
		msgsDiv.removeChild(msgsDiv.lastChild);
	}

	if (this._initialized) {
		this._header.reset();
		Dwt.setVisible(this._headerDiv, noClear);
	}
	
	if (this._replyView) {
		this._replyView.reset();
	}
};

ZmConvView2.prototype.dispose =
function() {
	this.clearChangeListeners();
	ZmMailItemView.prototype.dispose.apply(this, arguments);
};

ZmConvView2.prototype._removeMessageView =
function(msgId) {
	AjxUtil.arrayRemove(this._msgViewList, msgId);
	this._msgViews[msgId] = null;
	delete this._msgViews[msgId];
};

ZmConvView2.prototype._resize =
function(scrollMsgView) {

	this._resizePending = false;
	if (this.isDisposed()) { return; }

	if (this._cleared) { return; }
	if (!this._messagesDiv) { return; }
	
	var ctlr = this._controller, container;
	if (this._isStandalone()) {
		container = this;
	}
	else {
		// height of list view more reliable for reading pane on right
		var rpRight = ctlr.isReadingPaneOnRight();
		container = rpRight ? ctlr.getListView() : ctlr.getItemView();
	}
	var header = this._header;
	if (!container || !header || !this._messagesDiv) { return; }
	
	var mySize = container.getSize(AjxEnv.isIE);
	var scrollbarSizes = Dwt.getScrollbarSizes(this.getHtmlElement());
	var myHeight = mySize ? mySize.y : 0;
	var headerSize = header.getSize();
	var headerHeight = headerSize ? headerSize.y : 0;
	var messagesHeight = myHeight - headerHeight - 1 - scrollbarSizes.y;
	var messagesWidth = this.getSize().x - scrollbarSizes.x;
	Dwt.setSize(this._messagesDiv, messagesWidth, messagesHeight);

	// widen msg views if needed
	if (this._msgViewList && this._msgViewList.length) {
		for (var i = 0; i < this._msgViewList.length; i++) {
			var msgView = this._msgViews[this._msgViewList[i]];
			if (msgView) {
				ZmMailMsgView._resetIframeHeight(msgView);

				var iframe = msgView._usingIframe && msgView.getIframe();
				var width = iframe ? Dwt.getOuterSize(iframe).x : msgView._contentWidth;
				width += msgView.getInsets().left + msgView.getInsets().right;
				if (width && width > Dwt.getSize(this._messagesDiv).x) {
					msgView.setSize(width, Dwt.DEFAULT);
				}
				if (msgView._isCalendarInvite && msgView._inviteMsgView) {
				    msgView._inviteMsgView.convResize();
				    msgView._inviteMsgView.scrollToInvite();

				}
			}
		}
	}
	window.setTimeout(this._resizeMessages.bind(this, scrollMsgView), 0);
};

ZmConvView2.prototype._resizeMessages =
function(scrollMsgView) {
	
	if (this._msgViewList) {
		for (var i = 0; i < this._msgViewList.length; i++) {
			this._msgViews[this._msgViewList[i]]._resetIframeHeightOnTimer();
		}
	}

	// see if we need to scroll to top or a particular msg view
	if (scrollMsgView) {
		if (scrollMsgView === true) {
			this._messagesDiv.scrollTop = 0;
		}
		else if (scrollMsgView.isZmMailMsgCapsuleView) {
			this._scrollToTop(scrollMsgView);
		}
	}
};

ZmConvView2.prototype._scrollToTop =
function(msgView) {
	var msgViewTop = Dwt.toWindow(msgView.getHtmlElement(), 0, 0, null, null, DwtPoint.tmp).y;
	var containerTop = Dwt.toWindow(this._messagesDiv, 0, 0, null, null, DwtPoint.tmp).y;
	var diff = msgViewTop - containerTop;
	this._messagesDiv.scrollTop = (diff > 0) ? diff : 0;
	this._currentMsgView = msgView;
};

// since we may get multiple calls to _resize
ZmConvView2.prototype._scheduleResize =
function(scrollMsgView) {
	if (!this._resizePending) {
		window.setTimeout(this._resize.bind(this, scrollMsgView), 100);
		this._resizePending = true;
	}
};

ZmConvView2.prototype.getTabGroupMember = function() {
	if (!this._tabGroupMember) {
		this._tabGroupMember = new DwtTabGroup(this.toString());
	}
	return this._tabGroupMember;
};

// re-render if reading pane moved between right and bottom
ZmConvView2.prototype.setReadingPane =
function() {
	var rpLoc = this._controller._getReadingPanePref();
	if (this._rpLoc && this._item) {
		if (this._rpLoc != ZmSetting.RP_OFF && rpLoc != ZmSetting.RP_OFF && this._rpLoc != rpLoc) {
			this.set(this._item);
		}
	}
	this._rpLoc = rpLoc;
};

/**
 * Returns a list of IDs for msg views whose expanded state matches the given one.
 * 
 * @param {boolean}		expanded		if true, look for expanded msg views
 */
ZmConvView2.prototype.getExpanded =
function(expanded) {

	var list = [];
	if (this._msgViewList && this._msgViewList.length) {
		for (var i = 0; i < this._msgViewList.length; i++) {
			var id = this._msgViewList[i];
			var msgView = this._msgViews[id];
			if (msgView.isExpanded() == expanded) {
				list.push(id);
			}
		}
	}
	return list;
};

/**
 * Returns a list of IDs for msg views whose msg's loaded state matches the given one.
 * 
 * @param {boolean}		loaded		if true, look for msg views whose msg has been loaded
 */
ZmConvView2.prototype.getLoaded =
function(loaded) {

	var list = [];
	if (this._msgViewList && this._msgViewList.length) {
		for (var i = 0; i < this._msgViewList.length; i++) {
			var id = this._msgViewList[i];
			var msg = this._msgViews[id] && this._msgViews[id]._msg;
			if (msg && (msg.isLoaded() == loaded)) {
				list.push(id);
			}
		}
	}
	return list;
};

/**
 * Expands or collapses the conv view as a whole by expanding or collapsing each of its message views. If
 * at least one message view is collapsed, then expansion is done.
 * 
 * @param {boolean}		expanded		if true, expand message views; otherwise, collapse them
 * @param {boolean}		force			if true, do not check for unsent quick reply content
 */
ZmConvView2.prototype.setExpanded =
function(expanded, force) {
	
	var list = this.getExpanded(!expanded);
	if (list.length && !expanded) {
		if (!force && !this._controller.popShield(null, this.setExpanded.bind(this, expanded, true))) {
			return;
		}
		for (var i = 0; i < this._msgViewList.length; i++) {
			var msgView = this._msgViews[this._msgViewList[i]];
			msgView._setExpansion(false);
		}
		this._header._setExpandIcon();
	}
	else if (list.length && expanded) {
		var unloaded = this.getLoaded(false);
		if (unloaded.length) {
			var respCallback = this._handleResponseSetExpanded.bind(this, list);
			this._item.loadMsgs({fetchAll:true}, respCallback);
		}
		else {
			// no need to load the msgs if we already have them all
			this._handleResponseSetExpanded(list);
		}
	}
};

ZmConvView2.prototype._handleResponseSetExpanded =
function(ids) {
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		var msgView = this._msgViews[id];
		// the msgs that were fetched by GetConvRequest have more info than the ones we got
		// from SearchConvRequest, so update our cached versions
		var newMsg = appCtxt.getById(id);
		if (newMsg) {
			msgView._msg = newMsg;
			if (msgView._header) {
				msgView._header._msg = newMsg;
			}
		}
		msgView._setExpansion(true);
	}
	this._header._setExpandIcon();
};

ZmConvView2.prototype.isDirty =
function() {
	return (this._replyView && (this._replyView.getValue() != ""));
};

// Scrolls to show the user something new. If the current msg view isn't completely visible,
// scroll to show the next page. Otherwise, scroll the next expanded msg view to the top.
// Returns true if scrolling was done.
ZmConvView2.prototype._keepReading =
function(check) {

	if (!(this._msgViewList && this._msgViewList.length)) { return false; }
	
	var firstMsgView = this._msgViews[this._msgViewList[0]];
	if (!firstMsgView) { return false; }
	var startMsgView = this._currentMsgView || firstMsgView;
	var el = startMsgView.getHtmlElement();

	// offsetTop is supposed to be relative to parent, but msgView seems to be relative to conv view rather than
	// messages container, so we figure out an adjustment that also includes margin.
	if (!this._offsetAdjustment) {
		var firstEl = firstMsgView.getHtmlElement();
		this._offsetAdjustment = firstEl.offsetTop - parseInt(DwtCssStyle.getComputedStyleObject(firstEl).marginTop);
	}
	
	var cont = this._messagesDiv;
	var contHeight = Dwt.getSize(cont).y;
	var canScroll = (cont.scrollHeight > contHeight && (cont.scrollTop + contHeight < cont.scrollHeight));

	// first, see if the current msg view could be scrolled
	if (el && canScroll) {
		// if bottom of current msg view is not visible, scroll down a page
		var elHeight = Dwt.getSize(el).y;
		// is bottom of msg view below bottom of container?
		if (((el.offsetTop - this._offsetAdjustment) + elHeight) > (cont.scrollTop + contHeight)) {
			if (!check) {
				cont.scrollTop = cont.scrollTop + contHeight;
			}
			return true;
		}
	}
	
	// next, see if there's an expanded msg view we could bring to the top
	var msgView = this._getSiblingMsgView(startMsgView, true),
		done = false;

	while (msgView && !done) {
		if (msgView && msgView._expanded) {
			done = true;
		}
		else {
			msgView = this._getSiblingMsgView(msgView, true);
		}
	}
	if (msgView && done && canScroll) {
		if (!check) {
			this._scrollToTop(msgView);
			// following also works to bring msg view to top
			// cont.scrollTop = el.offsetTop - this._offsetAdjustment;
		}
		return true;
	}
	
	return false;
};

// Returns the next or previous msg view based on the given msg view.
ZmConvView2.prototype._getSiblingMsgView = function(curMsgView, next) {

	var idList = this._msgViewList,
		index = AjxUtil.indexOf(idList, curMsgView._msgId),
		msgView = null;

	if (index !== -1) {
		var id = next ? idList[index + 1] : idList[index - 1];
		if (id) {
			msgView = this._msgViews[id];
		}
	}

	return msgView;
};

/**
 * returns true if we are under the standalone conv view (double-clicked from conv list view)
 */
ZmConvView2.prototype._isStandalone =
function() {
	return this._standalone;
};

ZmConvView2.prototype._setSelectedMsg =
function(msg) {
	if (this._isStandalone()) {
		this._selectedMsg = msg;
	}
	var mlv = this._controller._mailListView;
	if (mlv) {
		mlv._selectedMsg = msg;
	}
};

ZmConvView2.prototype._sendListener =
function() {
	
	var val = this._replyView.getValue();
	if (val) {
		var params = {
			action:			this._replyView.action,
			sendNow:		true,
			inNewWindow:	false
		};
		this._compose(params);
	}
    this._renderCurMsgFooter();
};

ZmConvView2.prototype._cancelListener =
function() {
	if (this._replyView && this._controller.popShield()) {
		this._replyView.reset();
	}
    this._renderCurMsgFooter();
};

// re-renders the message footer for the current msg view (one that's being replied to) so it has all its links
ZmConvView2.prototype._renderCurMsgFooter = function() {

    var msgView = this._replyView && this._replyView._msgView;
    if (msgView) {
        msgView._renderMessageFooter();
    }
};

// Hands off to a compose view, or takes what's in the quick reply and sends it
ZmConvView2.prototype._compose =
function(params) {
	
	if (!this._item) { return; }
	params = params || {};

	params.action = params.action || ZmOperation.REPLY_ALL;
	var msg = params.msg = params.msg || (this._replyView && this._replyView.getMsg());
	if (!msg) { return; }
	
	params.hideView = params.sendNow;
	var composeCtlr = AjxDispatcher.run("GetComposeController", params.hideView ? ZmApp.HIDDEN_SESSION : null);
	params.composeMode = composeCtlr._getComposeMode(msg, composeCtlr._getIdentity(msg));
	var htmlMode = (params.composeMode == Dwt.HTML);
	params.toOverride = this._replyView.getAddresses(AjxEmailAddress.TO);
	params.ccOverride = this._replyView.getAddresses(AjxEmailAddress.CC);
	var value = this._replyView.getValue();
	if (value) {
		params.extraBodyText = htmlMode ? AjxStringUtil.convertToHtml(value) : value;
	}

	var what = appCtxt.get(ZmSetting.REPLY_INCLUDE_WHAT);
	if (msg && (what == ZmSetting.INC_BODY || what == ZmSetting.INC_SMART)) {
		// make sure we've loaded the part with the type we want to reply in, if it's available
		var desiredPartType = htmlMode ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN;
		msg.getBodyPart(desiredPartType, this._sendMsg.bind(this, params, composeCtlr));
	}
	else {
		this._sendMsg(params, composeCtlr);
	}
};

ZmConvView2.prototype._sendMsg =
function(params, composeCtlr) {
	composeCtlr.doAction(params);
	if (params.sendNow) {
		composeCtlr.sendMsg(null, null, this._handleResponseSendMsg.bind(this));
	}
};

ZmConvView2.prototype._handleResponseSendMsg =
function() {
	this._replyView.reset();
};

ZmConvView2.prototype.addInviteReplyListener =
function(listener) {
	this._inviteReplyListener = listener;
};

ZmConvView2.prototype.addShareListener =
function(listener) {
	this._shareListener = listener;
};

ZmConvView2.prototype.addSubscribeListener =
function(listener) {
	this._subscribeListener = listener;
};

ZmConvView2.prototype._convChangeListener =
function(ev) {

	if (ev.type != ZmEvent.S_CONV) { return; }
	var fields = ev.getDetail("fields");
	if ((ev.event == ZmEvent.E_MODIFY) && (fields && fields[ZmItem.F_SIZE])) {
		this._header._setInfo();
	}
    this._convDirty = true;
};

ZmConvView2.prototype._msgListChangeListener =
function(ev) {
	
	if (ev.type != ZmEvent.S_MSG) { return; }
	
	var msg = ev.item;
	if (!msg) { return; }

	if (ev.event == ZmEvent.E_CREATE && this._item && (msg.cid == this._item.id) && !msg.isDraft) {
		var index = ev.getDetail("sortIndex");
		var replyViewIndex = this.getReplyViewIndex();
		// bump index by one if reply view comes before it
		index = (replyViewIndex != -1 && index > replyViewIndex) ? index + 1 : index; 
		var params = {
			parent:			this,
			parentElement:	document.getElementById(this._messagesDivId),
			controller:		this._controller,
			forceCollapse:	true,
			forceExpand:	msg.isSent,	// trumps forceCollapse
			index:			index
		}
		this._renderMessage(msg, params);
		var msgView = this._msgViews && this._msgViews[msg.id];
		if (msgView) {
			msgView._resetIframeHeightOnTimer();
		}
	}
	else {
		var msgView = this._msgViews && this._msgViews[msg.id];
		if (msgView) {
			return msgView._handleChange(ev);
		}
	}
    this._convDirty = true;
};

ZmConvView2.prototype.resetMsg =
function(newMsg) {
};


ZmConvView2.prototype.isWaitOnMarkRead =
function() {
	return this._item && this._item.waitOnMarkRead;
};

// Following two overrides are a hack to allow this view to pretend it's a list view
ZmConvView2.prototype.getSelection =
function() {
	if (this._selectedMsg) {
		return [this._selectedMsg];
	}
	return [this._item];
};

ZmConvView2.prototype.getSelectionCount =
function() {
	return 1;
};

ZmConvView2.prototype.setReply =
function(msg, msgView, op) {
	
	if (!this._replyView) {
		this._replyView = new ZmConvReplyView({parent: this});
		this.getTabGroupMember().addMember(this._replyView.getTabGroupMember());
	}
	this._replyView.set(msg, msgView, op);
};

/**
 * Returns the index of the given msg view within the other msg views.
 * 
 * @param {ZmMailMsgCapsuleView}	msgView
 * @return {int}
 */
ZmConvView2.prototype.getMsgViewIndex =
function(msgView) {

	var el = msgView && msgView.getHtmlElement();
	if (msgView && this._messagesDiv) {
		for (var i = 0; i < this._messagesDiv.childNodes.length; i++) {
			if (this._messagesDiv.childNodes[i] == el) {
				return i;
			}
		}
	}
	return -1;
};

ZmConvView2.prototype.getReplyViewIndex =
function(msgView) {

	if (this._messagesDiv && this._replyView) {
		var children = this._messagesDiv.childNodes;
		for (var i = 0; i < children.length; i++) {
			if (children[i].id == this._replyView._htmlElId) {
				return i;
			}
		}
	}
	return -1;
};

ZmConvView2.prototype.getController = function() {
    return this._controller;
};

/**
 * is the user actively focused on the quick reply? This is used from ZmConvListController.prototype.getKeyMapName to determine what key mapping we should use
 */
ZmConvView2.prototype.isActiveQuickReply = function() {
	return this._replyView && this._replyView._input == document.activeElement;
};

/**
 * Creates an object manager and returns findObjects content
 * @param view    {Object} the view used by ZmObjectManager to set mouse events
 * @param content {String} content to scan
 * @param htmlEncode {boolean}
 */
ZmConvView2.prototype.renderObjects =
function(view, content, htmlEncode) {
	if (this._objectManager) {
		this._lazyCreateObjectManager(view || this);
		return this._objectManager.findObjects(content, htmlEncode);
	}
	return content;
};

ZmConvView2.prototype._getItemCountType = function() {
	return ZmId.ITEM_MSG;
};


ZmConvView2Header = function(params) {

	params.className = params.className || "Conv2Header";
	DwtComposite.call(this, params);

	this._setEventHdlrs([DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONDBLCLICK]);
	//the following allows selection. See also comment in DwtComposite.prototype._mouseDownListener
	this.setEventPropagation(true, [DwtEvent.ONMOUSEDOWN, DwtEvent.ONSELECTSTART, DwtEvent.ONMOUSEUP, DwtEvent.ONMOUSEMOVE]);

	this._convView = this.parent;
	this._conv = this.parent._item;
	this._controller = this.parent._controller;
	
	if (!this._convView._isStandalone()) {
		this._dblClickIsolation = true;	// ignore single click that is part of dbl click
		this.addListener(DwtEvent.ONDBLCLICK, this._dblClickListener.bind(this));
	}
	this.addListener(DwtEvent.ONMOUSEUP, this._mouseUpListener.bind(this));
	this._createHtml();
	this._setAllowSelection();
};

ZmConvView2Header.prototype = new DwtComposite;
ZmConvView2Header.prototype.constructor = ZmConvView2Header;

ZmConvView2Header.prototype.isZmConvView2Header = true;
ZmConvView2Header.prototype.toString = function() { return "ZmConvView2Header"; };

ZmConvView2Header.prototype.isFocusable = true;

ZmConvView2Header.prototype.set =
function(conv) {

	this._item = conv;
	this._setSubject();
	this._setInfo();
	this.setVisible(true);

	// Clean up minor WebKit-only issue where bottom edge of overflowed subject text is visible in info div
	if (AjxEnv.isWebKitBased && !this._headerSet) {
		Dwt.setSize(this._infoDiv, Dwt.DEFAULT, Dwt.getSize(this._subjectSpan).y);
		this._headerSet = true;
	}
};

ZmConvView2Header.prototype.reset =
function() {
	this.setVisible(false);
	if (this._subjectSpan && this._infoDiv) {
		this._subjectSpan.innerHTML = this._infoDiv.innerHTML = "";
        this._subjectSpan.title = "";
	}
};

ZmConvView2Header.prototype._createHtml =
function() {

	this._convExpandId		= this._htmlElId + "_expand";
	this._convSubjectId		= this._htmlElId + "_subject";
	this._convInfoId		= this._htmlElId + "_info";

	var subs = {
		convExpandId:		this._convExpandId,
		convSubjectId:		this._convSubjectId,
		convInfoId:			this._convInfoId
	}
	this.getHtmlElement().innerHTML = AjxTemplate.expand("mail.Message#Conv2Header", subs);

	this._expandDiv			= document.getElementById(this._convExpandId);
	this._subjectSpan		= document.getElementById(this._convSubjectId);
	this._infoDiv			= document.getElementById(this._convInfoId);

	var convviewel = this._convView.getHtmlElement();
	convviewel.setAttribute('aria-labelledby', this._convSubjectId);
};

ZmConvView2Header.prototype._setExpandIcon =
function() {
	var collapsed = this._convView.getExpanded(false);
	var doExpand = this._doExpand = (collapsed.length > 0);
	var attrs = "title='" + (doExpand ? ZmMsg.expandAllMessages : ZmMsg.collapseAllMessages) + "'";
	this._expandDiv.innerHTML = AjxImg.getImageHtml(doExpand ? "ConvExpand" : "ConvCollapse", "display:inline-block", attrs);
};

ZmConvView2Header.prototype._setSubject =
function() {
	var subject = this._item.subject || ZmMsg.noSubject;
	if (this._item.numMsgs > 1) {
		subject = ZmMailMsg.stripSubjectPrefixes(subject);
	}
	this._subjectSpan.innerHTML = AjxStringUtil.htmlEncode(subject);
	this._subjectSpan.title = this._convView.subject = subject;
};

ZmConvView2Header.prototype._setInfo =
function() {
	var conv = this._item;
	if (!conv) { return; }
	var numMsgs = conv.numMsgs || (conv.msgs && conv.msgs.size());
	if (!numMsgs) { return; }
	var info = AjxMessageFormat.format(ZmMsg.messageCount, numMsgs);
	var numUnread = conv.getNumUnreadMsgs();
	if (numUnread) {
		info = info + ", " + AjxMessageFormat.format(ZmMsg.unreadCount, numUnread).toLowerCase();
	}
	this._infoDiv.innerHTML = info;
};

ZmConvView2Header.prototype._mouseUpListener =
function(ev) {
	var selectedText = false, selectionObj = false, selectedId = false;
	if (typeof window.getSelection != "undefined") {
		selectionObj = window.getSelection();
		selectedText = selectionObj.toString();
		selectedId =  selectionObj.focusNode && selectionObj.focusNode.parentNode && selectionObj.focusNode.parentNode.id
	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
		selectionObj = document.selection.createRange();
		selectedText = selectionObj.text;
		selectedId = selectionObj.parentElement().id;
	}

	if (selectedText && selectedId == this._convSubjectId) {
		return;  //prevent expand/collapse when subject is selected
	}
	if (ev.button == DwtMouseEvent.LEFT) {
		this._convView.setExpanded(this._doExpand);
		this._setExpandIcon();
	}
};

// Open a msg into a tabbed view
ZmConvView2Header.prototype._dblClickListener =
function(ev) {
	if (this._convView._isStandalone()) { return; }
	var conv = ev.dwtObj && ev.dwtObj.parent && ev.dwtObj.parent._item;
	if (conv && ev.target !== this._subjectSpan) {
		AjxDispatcher.run("GetConvController", conv.id).show(conv, this._controller);
	}
};




ZmConvReplyView = function(params) {

	params.className = params.className || "Conv2Reply";
	params.id = params.parent._htmlElId + "_reply";
	DwtComposite.call(this, params);
	
	this._convView = params.parent;
	this._objectManager = new ZmObjectManager(this);

	this.addControlListener(this._resized.bind(this));
};

ZmConvReplyView.prototype = new DwtComposite;
ZmConvReplyView.prototype.constructor = ZmConvReplyView;

ZmConvReplyView.prototype.isZmConvReplyView = true;
ZmConvReplyView.prototype.toString = function() { return "ZmConvReplyView"; };


ZmConvReplyView.prototype.TEMPLATE = "mail.Message#Conv2Reply";
ZmConvReplyView.prototype.TABLE_TEMPLATE = "mail.Message#Conv2ReplyTable";

ZmConvReplyView.ADDR_TYPES = [AjxEmailAddress.TO, AjxEmailAddress.CC];

/**
 * Opens up the quick reply area below the given msg view. Addresses are set as
 * appropriate.
 * 
 * @param {ZmMailMsg}				msg			original msg
 * @param {ZmMailMsgCapsuleView} 	msgView		msg view from which reply was invoked
 * @param {string}					op			REPLY or REPLY_ALL
 */
ZmConvReplyView.prototype.set =
function(msg, msgView, op) {

	this.action = op;
	AjxDispatcher.require("Mail");
	
	var ai = this._addressInfo = this._getReplyAddressInfo(msg, msgView, op);

	if (!this._initialized) {
		var subs = ai;
		subs.replyToDivId = this._htmlElId + "_replyToDiv";
		subs.replyCcDivId = this._htmlElId + "_replyCcDiv";
		subs.replyInputId = this._htmlElId + "_replyInput";
		this._createHtmlFromTemplate(this.TEMPLATE, subs);
		this._initializeToolbar();
		this._replyToDiv = document.getElementById(subs.replyToDivId);
		this._replyCcDiv = document.getElementById(subs.replyCcDivId);
		this._input = document.getElementById(subs.replyInputId);
		this._initialized = true;
	}
	else {
		this.reset();
	}
	this._msg = msg;
	var gotCc = (op == ZmOperation.REPLY_ALL && ai.participants[AjxEmailAddress.CC]);
	this._replyToDiv.innerHTML = AjxTemplate.expand(this.TABLE_TEMPLATE, ai.participants[AjxEmailAddress.TO]);
	this._replyCcDiv.innerHTML = gotCc ? AjxTemplate.expand(this.TABLE_TEMPLATE, ai.participants[AjxEmailAddress.CC]) : "";
	Dwt.setVisible(this._replyCcDiv, gotCc);
	setTimeout(this._resized.bind(this), 0);

	var index = this._convView.getMsgViewIndex(msgView);
	index = this._index = (index != -1) ? index + 1 : null;
	this.reparentHtmlElement(this._convView._messagesDiv, index);
	msgView.addClassName("Reply");
	msgView._createBubbles();
    this._msgView = msgView;

	this.setVisible(true);
	Dwt.scrollIntoView(this.getHtmlElement(), this._convView._messagesDiv);
	appCtxt.getKeyboardMgr().grabFocus(this._input);
};

ZmConvReplyView.prototype.getAddresses =
function(type) {
	return this._addressInfo && this._addressInfo.participants[type] && this._addressInfo.participants[type].addresses;
};

/**
 * Returns the value of the quick reply input box.
 * @return {string}
 */
ZmConvReplyView.prototype.getValue =
function() {
	return this._input ? this._input.value : "";
};

/**
 * Returns the msg associated with this quick reply.
 * @return {ZmMailMsg}
 */
ZmConvReplyView.prototype.getMsg =
function() {
	return this._msg;
};

/**
 * Sets the value of the quick reply input box.
 * 
 * @param {string}	value	new value for input
 */
ZmConvReplyView.prototype.setValue =
function(value) {
	if (this._input) {
		this._input.value = value;
	}
};

/**
 * Clears the quick reply input box and hides the view.
 */
ZmConvReplyView.prototype.reset =
function() {
	var msgView = this._msg && this._convView._msgViews[this._msg.id];
	if (msgView) {
		msgView.delClassName("Reply");
	}
	this.setValue("");
	this.setVisible(false);
	this._msg = null;
};

ZmConvReplyView.prototype._initializeToolbar = function() {
	
	if (!this._replyToolbar) {
		var buttons = [
			ZmOperation.SEND,
            ZmOperation.CANCEL,
			ZmOperation.FILLER
		];
		var overrides = {};
		overrides[ZmOperation.CANCEL] = {
            tooltipKey: "cancel",
            shortcut:   null
        };
		var tbParams = {
			parent:				this,
			buttons:			buttons,
			overrides:			overrides,
			posStyle:			DwtControl.STATIC_STYLE,
			buttonClassName:	"DwtToolbarButton",
			context:			ZmId.VIEW_CONV2,
			toolbarType:		ZmId.TB_REPLY
		};
		var tb = this._replyToolbar = new ZmButtonToolBar(tbParams);
		tb.addSelectionListener(ZmOperation.SEND, this._convView._sendListener.bind(this._convView));
		tb.addSelectionListener(ZmOperation.CANCEL, this._convView._cancelListener.bind(this._convView));
	}
};

// Returns lists of To: and Cc: addresses to reply to, based on the msg
ZmConvReplyView.prototype._getReplyAddressInfo =
function(msg, msgView, op) {
	
	var addresses = ZmComposeView.getReplyAddresses(op, msg, msg);
	
	var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);

	var showMoreIds = {};
	var addressTypes = [], participants = {};
	for (var i = 0; i < ZmConvReplyView.ADDR_TYPES.length; i++) {
		var type = ZmConvReplyView.ADDR_TYPES[i];
		var addrs = addresses[type];
		if (addrs && addrs.length > 0) {
			addressTypes.push(type);
			var prefix = AjxStringUtil.htmlEncode(ZmMsg[AjxEmailAddress.TYPE_STRING[type]]);
			var addressInfo = msgView.getAddressesFieldInfo(addrs, options, type, this._htmlElId);
			participants[type] = {
				addresses:	addrs,
				prefix:		prefix,
				partStr:	addressInfo.html
			};
			if (addressInfo.showMoreLinkId) {
			    showMoreIds[addressInfo.showMoreLinkId] = true;
			}
		}
	}
	
	return {
		addressTypes:	addressTypes,
		participants:	participants,
        showMoreIds:    showMoreIds
	}
};

ZmConvReplyView.prototype._addAddresses =
function(addresses, type, addrs, used) {
	var a = addrs.getArray();
	for (var i = 0; i < a.length; i++) {
		var addr = a[i];
		if (addr && addr.address) {
			if (!used || !used[addr.address]) {
				addresses[type].push(addr);
			}
			if (used) {
				used[addr.address] = true;
			}
		}
	}
};

ZmConvReplyView.prototype._resized =
function() {
	var bounds = this.boundsForChild(this._input);

	Dwt.setSize(this._input, bounds.width, Dwt.CLEAR);
};




/**
 * The capsule view of a message is intended to be brief so that all the messages in a conv
 * can be shown together in a natural way. Quoted content is stripped.
 * 
 * @param {hash}			params			hash of params:
 * @param {string}			className		(optional) defaults to "ZmMailMsgCapsuleView"
 * @param {ZmConvView2}		parent			parent conv view
 * @param {string}			msgId			ID of msg
 * @param {string}			sessionId		ID of containing session (used with above param to create DOM IDs)
 * @param {ZmController}	controller		owning conv list controller
 * @param {ZmActionMenu}	actionsMenu		shared action menu
 * @param {boolean}			forceExpand		if true, show header, body, and footer
 * @param {boolean}			forceCollapse	if true, just show header
 * @param {boolean}			isDraft			is this message a draft
 */
ZmMailMsgCapsuleView = function(params) {

	this._normalClass = "ZmMailMsgCapsuleView";
	params.className = params.className || this._normalClass;
	this._msgId = params.msgId;
	params.id = this._getViewId(params.sessionId);
	ZmMailMsgView.call(this, params);

	this._convView = this.parent;
	this._controller = params.controller;
	//the Boolean is to make sure undefined changes to false as otherwise this leaks down (_expanded becomes undefined) and causes problems (undefined != false in ZmConvView2.prototype.getExpanded)
	this._forceExpand = Boolean(params.forceExpand);
	this._forceCollapse = Boolean(params.forceCollapse);
	this._forceOriginal = params.forceOriginal && !(DBG && DBG.getDebugLevel() == "orig");
	this._isDraft = params.isDraft;
	this._index = params.index;
	this._showingCalendar = false;
	this._infoBarId = this._htmlElId;
	
	this._browserToolTip = appCtxt.get(ZmSetting.BROWSER_TOOLTIPS_ENABLED);
	
	this._linkClass = "Link";

	this.setScrollStyle(Dwt.VISIBLE);
	
	// cache text and HTML versions of original content
	this._origContent = {};

	this.addListener(ZmInviteMsgView.REPLY_INVITE_EVENT, this._convView._inviteReplyListener);
	this.addListener(ZmMailMsgView.SHARE_EVENT, this._convView._shareListener);
	this.addListener(ZmMailMsgView.SUBSCRIBE_EVENT, this._convView._subscribeListener);

	this.addListener(DwtEvent.ONFOCUS,
	                 ZmMailMsgCapsuleView.prototype.__onFocus.bind(this));
	this.addListener(DwtEvent.ONBLUR,
	                 ZmMailMsgCapsuleView.prototype.__onBlur.bind(this));
};

ZmMailMsgCapsuleView.prototype = new ZmMailMsgView;
ZmMailMsgCapsuleView.prototype.constructor = ZmMailMsgCapsuleView;

ZmMailMsgCapsuleView.prototype.isZmMailMsgCapsuleView = true;
ZmMailMsgCapsuleView.prototype.toString = function() { return "ZmMailMsgCapsuleView"; };

ZmMailMsgCapsuleView.prototype._getViewId =
function(sessionId) {
	var prefix = !sessionId ? "" : this._standalone ? ZmId.VIEW_CONV + sessionId + "_" : sessionId + "_";
	return prefix + ZmId.VIEW_MSG_CAPSULE + this._msgId;
};

ZmMailMsgCapsuleView.prototype._getContainer =
function() {
	return this._container;
};

ZmMailMsgCapsuleView.prototype._setHeaderClass =
function() {
	var classes = [this._normalClass];
	classes.push(this._expanded ? "Expanded" : "Collapsed");
	if (this._isDraft) {
		classes.push("draft");
	}
	if (this._lastCollapsed) {
		classes.push("Last");
	}
	this.setClassName(classes.join(" "));
};

ZmMailMsgCapsuleView.prototype.set =
function(msg, force) {
	if (this._controller.isSearchResults) {
		this._expanded = this._isMatchingMsg = msg.inHitList;
	}
	else {
		this._expanded = !this._forceCollapse && msg.isUnread;
	}
	this._isCalendarInvite = appCtxt.get(ZmSetting.CALENDAR_ENABLED) && msg.invite && !msg.invite.isEmpty();
	this._expanded = this._expanded || this._forceExpand;
	if (this._expanded && this._isCalendarInvite && this._convView.inviteMsgsExpanded >= ZmConvView2.MAX_INVITE_MSG_EXPANDED) {
		//do not expand more than MAX_INVITE_MSG_EXPANDED messages.
		this._expanded = false;
		this._forceExpand = false;
	}
	if (this._expanded) {
		this._convView._hasBeenExpanded[msg.id] = true;
	}
	this.setAttribute('aria-expanded', Boolean(this._expanded));
	this._setHeaderClass();

	var dayViewCallback = null;
	var showCalInConv = appCtxt.get(ZmSetting.CONV_SHOW_CALENDAR);
    if (this._expanded) {
		if (this._isCalendarInvite) {
			this._convView.inviteMsgsExpanded++;
		}
		dayViewCallback = this._handleShowCalendarLink.bind(this, ZmOperation.SHOW_ORIG, showCalInConv);
	}
	ZmMailMsgView.prototype.set.apply(this, [msg, force, dayViewCallback]);
};

ZmMailMsgCapsuleView.prototype.reset =
function() {
	ZmMailMsgView.prototype.reset.call(this);
	if (this._header) {
		this._header.dispose();
		this._header = null;
	}
};

/**
 * Resize IFRAME to match its content. IFRAMEs have a default height of 150, so we need to
 * explicitly set the correct height if the content is smaller. The easiest way would be
 * to measure the height of the HTML or BODY element, but some browsers (mainly IE) report
 * that to be 150. So as a backup we sum the height of the BODY element's child nodes. To
 * get the true height of an element we use its computed style object to add together the
 * vertical measurements of height, padding, and margins.
 */
ZmMailMsgCapsuleView.prototype._resize =
function() {

	this._resizePending = false;
	if (!this._expanded || !this._usingIframe) {
		return;
	}
	
	var contentContainer = this.getContentContainer();
	if (!contentContainer) {
		return;
	}

	//todo - combine this with _resetIframeOnTimer that is from the MSG view and also used here somehow in cases the Iframe is taller than 150 pixels.

	// Get height from computed style, which seems to be the most reliable source.
	var height = this._getHeightFromComputedStyle(contentContainer);
	height += 20;	// account for 10px of top and bottom padding for class MsgBody-html - todo adjustment should probably be calculated, not hardcoded?

	// resize the IFRAME to fit content.
	DBG.println(AjxDebug.DBG1, "resizing capsule msg view IFRAME height to " + height);
	Dwt.setSize(this.getIframeElement(), Dwt.DEFAULT, height);
};


// Look in the computed style object for height, padding, and margins.
ZmMailMsgCapsuleView.prototype._getHeightFromComputedStyle =
function(el) {
	// Set the container overflow.  This is insures the proper height calculation.  See W3C Visual
	// Formatting model details, section 10.6.6 and 10.6.7
	el.style.overflow = "hidden";
	var styleObj = DwtCssStyle.getComputedStyleObject(el),
		height = 0;

	if (styleObj && styleObj.height) {
		var props = [ 'height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom' ];
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			var h = parseInt(styleObj[prop]);
			height += isNaN(h) ? 0 : h;
		}
	}

	el.style.overflow = "";

	// Selenium has issues with empty style attributes, specifically in firefox, so remove it
	if (AjxEnv.isGeckoBased && el.style.cssText.length == 0) {
		el.removeAttribute('style');
	}

	return height;
};

/**
 * override from ZmMailMsgView
 */
ZmMailMsgCapsuleView.prototype._resetIframeHeightOnTimer =
function() {
	if (!this._resizePending) {
		window.setTimeout(this._resize.bind(this), 100);
		this._resizePending = true;
	}
};

ZmMailMsgCapsuleView.prototype._renderMessage =
function(msg, container, callback) {
	
	msg = this._msg;
	this._clearBubbles();
	this._createMessageHeader();
	if (this._expanded) {
		this._renderMessageBodyAndFooter(msg, container, callback);
	}
	else {
		this._header.set(ZmMailMsgCapsuleViewHeader.COLLAPSED);
	}
};

/**
 * Renders the header bar for this message. It's a control so that we can drag it to move the message.
 * 
 * @param msg
 * @param container
 */
ZmMailMsgCapsuleView.prototype._createMessageHeader =
function() {
	
	if (this._header) { return; }

	this._header = new ZmMailMsgCapsuleViewHeader({
		parent: this,
		id:		[this._viewId, ZmId.MV_MSG_HEADER].join("_")
	});
	this._headerTabGroup.addMember(this._header);
};

ZmMailMsgCapsuleView.prototype._renderMessageBodyAndFooter =
function(msg, container, callback) {

	if (!msg.isLoaded() || this._showEntireMsg) {
		var params = {
			getHtml:		appCtxt.get(ZmSetting.VIEW_AS_HTML),
			callback:		this._handleResponseLoadMessage.bind(this, msg, container, callback),
			needExp:		true,
			noTruncate:		this._showEntireMsg,
			forceLoad:		this._showEntireMsg,
			markRead:		this._controller._handleMarkRead(msg, true)
		}
		msg.load(params);
		this._showEntireMsg = false;
	}
	else {
		this._handleResponseLoadMessage(msg, container, callback);
	}
};

ZmMailMsgCapsuleView.prototype._handleResponseLoadMessage =
function(msg, container, callback) {

	// Take care of a race condition, where this view may be deleted while
	// a ZmMailMsg.fetch (that references this function via a callback) is
	// still in progress
	if (this.isDisposed()) { return; }

	this._header.set(this._expanded ? ZmMailMsgCapsuleViewHeader.EXPANDED : ZmMailMsgCapsuleViewHeader.COLLAPSED);
	var respCallback = this._handleResponseLoadMessage1.bind(this, msg, container, callback);
	this._renderMessageBody(msg, container, respCallback);
};

// use a callback in case we needed to load an alternative part
ZmMailMsgCapsuleView.prototype._handleResponseLoadMessage1 = function(msg, container, callback) {

	this._renderMessageFooter(msg);
	if (appCtxt.get(ZmSetting.MARK_MSG_READ) !== ZmSetting.MARK_READ_NOW) {
		this._controller._handleMarkRead(msg);	// in case we need to mark read after a delay  bug 73711
	}
	if (callback) {
		callback.run();
	}
};

// Display all text messages and some HTML messages in a DIV rather than in an IFRAME.
ZmMailMsgCapsuleView.prototype._useIframe =
function(isTextMsg, html, isTruncated) {

	this._cleanedHtml = null;

	if (isTruncated)	{ return true; }
	if (isTextMsg)		{ return false; }
	
	// Code below attempts to determine if we can display an HTML msg in a DIV. If there are
	// issues with the msg DOM being part of the window DOM, we may want to just always return
	// true from this function.
	var result = AjxStringUtil.checkForCleanHtml(html, ZmMailMsgView.TRUSTED_TAGS, ZmMailMsgView.UNTRUSTED_ATTRS);
	if (!result.useIframe) {
		this._cleanedHtml = result.html;
		this._contentWidth = result.width;
		return false;
	}
	else {
        this._cleanedHtml = result.html;
		return true;
	}
};

ZmMailMsgCapsuleView.prototype._renderMessageBody =
function(msg, container, callback, index) {

	this._addLine(); //separator between header and message body

	this._msgBodyDivId = [this._htmlElId, ZmId.MV_MSG_BODY].join("_");
	var autoSendTime = AjxUtil.isDate(msg.autoSendTime) ? AjxDateFormat.getDateTimeInstance(AjxDateFormat.FULL, AjxDateFormat.MEDIUM).format(msg.autoSendTime) : null;
	if (autoSendTime) {
		var div = document.createElement("DIV");
		div.id = this._autoSendHeaderId = this._msgBodyDivId + "_autoSend";
		div.innerHTML = AjxTemplate.expand("mail.Message#AutoSend", {autoSendTime: autoSendTime});
		this.getHtmlElement().appendChild(div);
	}

	if (msg.attrs) {
		var additionalHdrs = [];
		for (var hdrName in ZmMailMsgView.displayAdditionalHdrsInMsgView) {
			if (msg.attrs[hdrName]) {
				additionalHdrs.push({hdrName: ZmMailMsgView.displayAdditionalHdrsInMsgView[hdrName], hdrVal: msg.attrs[hdrName]});
			}
		}
		if (additionalHdrs.length) {
			var div = document.createElement("DIV");
			div.id = this._addedHeadersId = this._msgBodyDivId + "_addedHeaders";
			div.innerHTML = AjxTemplate.expand("mail.Message#AddedHeaders", {additionalHdrs: additionalHdrs});
			this.getHtmlElement().appendChild(div);
		}
	}

	var isCalendarInvite = this._isCalendarInvite;
	var isShareInvite = this._isShareInvite = (appCtxt.get(ZmSetting.SHARING_ENABLED) &&
												msg.share && msg.folderId != ZmFolder.ID_TRASH &&
												appCtxt.getActiveAccount().id != msg.share.grantor.id &&
												(msg.share.action == ZmShare.NEW ||
													(msg.share.action == ZmShare.EDIT &&
														!this.__hasMountpoint(msg.share))));
    var isSharePermNone = isShareInvite && msg.share && msg.share.link && !msg.share.link.perm;
	var isSubscribeReq = msg.subscribeReq && msg.folderId != ZmFolder.ID_TRASH;

    if (!isCalendarInvite) {
        var attachmentsCount = this._msg.getAttachmentLinks(true, !appCtxt.get(ZmSetting.VIEW_AS_HTML), true).length;
        if (attachmentsCount > 0) {
            var div = document.createElement("DIV");
            div.id = this._attLinksId;
            div.className = "attachments";
            this.getHtmlElement().appendChild(div);
        }
    }

	if (isCalendarInvite || isSubscribeReq) {
		ZmMailMsgView.prototype._renderMessageHeader.call(this, msg, container, true);
	}
	
	var params = {
		getHtml:		appCtxt.get(ZmSetting.VIEW_AS_HTML),
		callback:		ZmMailMsgView.prototype._renderMessageBody.bind(this, msg, container, callback, index),
		needExp:		true
	}
	msg.load(params);

	if (isCalendarInvite) {
		if (AjxEnv.isIE) {
			// for some reason width=100% on inv header table makes it too wide (bug 65696)
			Dwt.setSize(this._headerElement, this._header.getSize().x, Dwt.DEFAULT);
		}
	}
	
	if ((isShareInvite && !isSharePermNone) || isSubscribeReq) {
		var bodyEl = this.getMsgBodyElement();
		var toolbar = isShareInvite ? this._getShareToolbar() : this._getSubscribeToolbar(msg.subscribeReq);
		if (toolbar) {
			toolbar.reparentHtmlElement(bodyEl, 0);
		}
		// invite header
		if (this._headerElement) {
			bodyEl.insertBefore(this._headerElement.parentNode, bodyEl.firstChild);
		}
	}
	
	this._beenHere = true;
};

ZmMailMsgCapsuleView.prototype._getInviteSubs =
function(subs) {
	ZmMailMsgView.prototype._getInviteSubs.apply(this, arguments);

    subs.noTopHeader = true;
};

ZmMailMsgCapsuleView.prototype._addLine =
function() {
	var div = document.createElement("div");
	div.className = "separator";
	this.getHtmlElement().appendChild(div);
};

ZmMailMsgCapsuleView.prototype._getBodyContent =
function(bodyPart) {

	if (!bodyPart || !bodyPart.getContent()) { return ""; }
	
	var isHtml = (bodyPart.ct == ZmMimeTable.TEXT_HTML);
	var cacheKey = [bodyPart.part, bodyPart.contentType].join("|");
	var origContent = this._origContent[cacheKey];
	if (!origContent && !this._forceOriginal && !this._isMatchingMsg) {
		origContent = AjxStringUtil.getOriginalContent(bodyPart.getContent(), isHtml);
		if (origContent.length != bodyPart.getContent().length) {
			this._origContent[cacheKey] = origContent;
			this._hasOrigContent = true;
		}
	}

	var content = (this._showingQuotedText || this._forceOriginal || this._isMatchingMsg || !origContent) ? bodyPart.getContent() : origContent;
	content = content || "";
	// remove trailing blank lines
	content = isHtml ? AjxStringUtil.trimHtml(content) : AjxStringUtil.trim(content);
	return content;
};

/**
 * Renders the row of links at the bottom of the msg.
 *
 * @param {ZmMailMsg}   msg     msg being displayed
 * @param {string}      op      (optional) operation being performed
 *
 * @private
 */
ZmMailMsgCapsuleView.prototype._renderMessageFooter = function(msg, op) {

    msg = msg || this._msg;
    var div = this._footerId && Dwt.byId(this._footerId);
    if (!div) {
        div = document.createElement("div");
        div.className = "footer";
        div.id = this._footerId = [this.getHTMLElId(), ZmId.MV_MSG_FOOTER].join("_");
    }
	
	var showTextKey, showTextHandler;
	if (this._isCalendarInvite) {
		showTextKey = "showCalendar";
		showTextHandler = this._handleShowCalendarLink;
	}
	else if (this._hasOrigContent) {
		showTextKey = this._showingQuotedText ? "hideQuotedText" : "showQuotedText";
		showTextHandler = this._handleShowTextLink;
	}
	
	var linkInfo = this._linkInfo = {};
    var isExternalAccount = appCtxt.isExternalAccount();
	linkInfo[ZmOperation.SHOW_ORIG] 	    = {key: showTextKey,	        handler: showTextHandler,                                           disabled: isExternalAccount};
	linkInfo[ZmOperation.DRAFT]			    = {key: "editDraft",	        handler: this._handleEditDraftLink,     op: ZmOperation.DRAFT,	    disabled: isExternalAccount};
	linkInfo[ZmOperation.REPLY]			    = {key: "reply",		        handler: this._handleReplyLink, 	    op: ZmOperation.REPLY,	    disabled: isExternalAccount};
	linkInfo[ZmOperation.REPLY_ALL]		    = {key: "replyAll",		        handler: this._handleReplyLink, 	    op: ZmOperation.REPLY_ALL,	disabled: isExternalAccount};
	linkInfo[ZmOperation.FORWARD]		    = {key: "forward",		        handler: this._handleForwardLink,	    op: ZmOperation.FORWARD,    disabled: isExternalAccount};
	linkInfo[ZmOperation.ACTIONS_MENU]	    = {key: "moreActions",	        handler: this._handleMoreActionsLink};
	linkInfo[ZmOperation.COMPOSE_OPTIONS]	= {key: "moreComposeOptions",	handler: this._handleMoreOptionsLink,                               disabled: isExternalAccount};

	var links;
	var folder = appCtxt.getById(msg.folderId);

	if (folder && folder.isFeed()) {
		links = [
			ZmOperation.SHOW_ORIG,
			ZmOperation.FORWARD,
			ZmOperation.ACTIONS_MENU
		];
	}
	else if (msg.isDraft) {
        links = [
			ZmOperation.SHOW_ORIG,
			ZmOperation.ACTIONS_MENU
		];
        if (!folder.isReadOnly()){
            links = [].concat(ZmOperation.DRAFT,links);
        }
	}
	else {
        links = [ ZmOperation.REPLY, ZmOperation.REPLY_ALL ];
        if (op) {
            // if user is doing Reply or Reply All, show the other one
            links = (op === ZmOperation.REPLY) ? [ ZmOperation.REPLY_ALL ] : [ ZmOperation.REPLY ];
        }
        links.unshift(ZmOperation.SHOW_ORIG);
        links.push(ZmOperation.FORWARD, ZmOperation.ACTIONS_MENU);
	}

    if (op) {
        links.push(ZmOperation.COMPOSE_OPTIONS);
    }

	var linkHtml = [];
	for (var i = 0; i < links.length; i++) {
		var html = this._makeLink(links[i]);
		if (html) {
			linkHtml.push(html);
		}
	}
	div.innerHTML = linkHtml.join("&nbsp;-&nbsp;");
	this.getHtmlElement().appendChild(div);

    this._links = [];
    var linkFound = false;
	for (var i = 0; i < links.length; i++) {
		var info = this._linkInfo[links[i]];
		var link = info && document.getElementById(info.linkId);
		if (link) {
			this._makeFocusable(link);
			Dwt.setHandler(link, DwtEvent.ONCLICK, this._linkClicked.bind(this, links[i], info.op));
			this._footerTabGroup.addMember(link);
            // Bit of a hack so we can treat the row of links like a toolbar and move focus
            // between links using left/right arrow buttons.
            link.noTab = linkFound;
            this._links.push(link);
            linkFound = true;
		}
	}

    // Attempt to display the calendar if the preference is to auto-open it
    this._handleShowCalendarLink(ZmOperation.SHOW_ORIG, appCtxt.get(ZmSetting.CONV_SHOW_CALENDAR)); //this is called from here since the _linkInfo is now ready and needed in _handleShowCalendarLink. Might be other reason too.
};

ZmMailMsgCapsuleView.prototype._makeLink =
function(id) {
	var info = this._linkInfo && id && this._linkInfo[id];
	if (!(info && info.key && info.handler)) { return ""; } 
	
	var linkId = info.linkId = [this._footerId, info.key].join("_");
    if (info.disabled) {
        return "<span id='" + linkId + "'>" + ZmMsg[info.key] + "</span>";
    }
	return "<a class='ConvLink Link' id='" + linkId + "'>" + ZmMsg[info.key] + "</a>";
};

ZmMailMsgCapsuleView.prototype._linkClicked =
function(id, op, ev) {

	var info = this._linkInfo && id && this._linkInfo[id];
	var handler = (info && !info.disabled) ? info.handler : null;
	if (handler) {
		handler.apply(this, [id, info.op, ev]);
	}
};

// Moves focus between links in the footer
ZmMailMsgCapsuleView.prototype._focusLink = function(prev, refLink) {

    var link;
    for (var i = 0; i < this._links.length; i++) {
        if (this._links[i] === refLink) {
            link = this._links[prev ? i - 1 : i + 1];
            break;
        }
    }

    if (link) {
        appCtxt.getKeyboardMgr().grabFocus(link);
    }
};

ZmMailMsgCapsuleView.prototype.__onFocus =
function(ev) {
	if (!ev || !ev.target) {
		return;
	}

	Dwt.setOpacity(this._footerId, 100);
};

ZmMailMsgCapsuleView.prototype.__onBlur =
function(ev) {
	if (!ev || !ev.target) {
		return;
	}

	var footer = Dwt.byId(this._footerId);

	if (footer) {
		footer.style.opacity = null;
	}
};

// TODO: something more efficient than a re-render
ZmMailMsgCapsuleView.prototype._handleShowTextLink =
function(id, op, ev) {
	var msg = this._msg;
	this.reset();
	this._showingQuotedText = !this._showingQuotedText;
	this._forceExpand = true;
	this.set(msg, true);
};

ZmMailMsgCapsuleView.prototype._handleShowCalendarLink =
function(id, show) {
    // Allow one of two possible paths to auto display the calendar view
    if (!this._isCalendarInvite) {
		return;
	}

    var showCalendarLink = this._linkInfo && document.getElementById(this._linkInfo[ZmOperation.SHOW_ORIG].linkId);

	if (show !== undefined) {
		this._showingCalendar = show; //force a value
	}
	else {
		this._showingCalendar = !this._showingCalendar; //toggle
		// Track the last show/hide and apply to other invites that are opened.
		appCtxt.set(ZmSetting.CONV_SHOW_CALENDAR, this._showingCalendar);
	}

	var imv = this._inviteMsgView;
	if (!this._inviteCalendarContainer && imv) {
        var dayView = imv && imv._dayView;
        if (dayView && showCalendarLink) {
            // Both components (dayView and footer) have been rendered - can go ahead and
            // attach the dayView.  This is only an issue for the initial auto display

            // Shove it in a relative-positioned container DIV so it can use absolute positioning
            var div = this._inviteCalendarContainer = document.createElement("div");
            var elRef = this.getHtmlElement();
            if (elRef) {
                elRef.appendChild(div);
                Dwt.setSize(div, Dwt.DEFAULT, 220);
                Dwt.setPosition(div, Dwt.RELATIVE_STYLE);
                dayView.reparentHtmlElement(div);
                dayView.setVisible(true);
                imv.convResize();
            }
        }
    }
	if (this._inviteCalendarContainer) {
		Dwt.setVisible(this._inviteCalendarContainer, this._showingCalendar);
	}


    if (imv && this._showingCalendar) {
        imv.scrollToInvite();
    }
    if (showCalendarLink) {
        showCalendarLink.innerHTML = this._showingCalendar ? ZmMsg.hideCalendar : ZmMsg.showCalendar;
    }
	this._resetIframeHeightOnTimer();
};

ZmMailMsgCapsuleView.prototype._handleForwardLink =
function(id, op, ev) {
	var text = "", replyView = this._convView._replyView;
	if (replyView) {
		text = replyView.getValue();
		replyView.reset();
	}
	this._controller._doAction({action:op, msg:this._msg, extraBodyText:text});
};

ZmMailMsgCapsuleView.prototype._handleMoreActionsLink = function(id, op, ev) {

	ev = DwtUiEvent.getEvent(ev);

    // User can focus on link and hit Enter - create a location to pop up the menu
    var x = ev.clientX, y = ev.clientY;
    if (!x || !y) {
        var loc = Dwt.getLocation(DwtUiEvent.getTarget(ev));
        if (loc) {
            x = loc.x;
            y = loc.y;
        }
    }
	ev.docX = x;
	ev.docY = y;
	this._actionListener(ev, true);
};

ZmMailMsgCapsuleView.prototype._handleReplyLink = function(id, op, ev, force) {

	if (!force && !this._controller.popShield(null, this._handleReplyLink.bind(this, id, op, ev, true))) {
		return;
	}
	this._convView.setReply(this._msg, this, op);
    this._renderMessageFooter(this._msg, op);
};

ZmMailMsgCapsuleView.prototype._handleMoreOptionsLink = function(ev) {

    this._convView._compose({
        msg:    this._msg,
        action: this.action
    });
    this._convView._replyView.reset();
    this._renderMessageFooter(this._msg);
};

ZmMailMsgCapsuleView.prototype._handleEditDraftLink =
function(id, op, ev) {
	this._controller._doAction({action:op, msg:this._msg});
};

ZmMailMsgCapsuleView.prototype.isExpanded =
function() {
	return this._expanded;
};

/**
 * Expand the msg view by hiding/showing the body and footer. If the msg hasn't
 * been rendered, we need to render it to expand it.
 */
ZmMailMsgCapsuleView.prototype._toggleExpansion =
function() {
	
	var expanded = !this._expanded;
	if (!expanded && !this._controller.popShield(null, this._setExpansion.bind(this, false))) {
		return;
	}
	this._setExpansion(expanded);
	this._resetIframeHeightOnTimer();
};

ZmMailMsgCapsuleView.prototype._setExpansion =
function(expanded) {

	if (this.isDisposed()) { return; }

	if (Dwt.isAncestor(this.getHtmlElement(), document.activeElement)) {
		this.getHtmlElement().focus();
	}

	var showCalInConv = appCtxt.get(ZmSetting.CONV_SHOW_CALENDAR);
	this._expanded = expanded;
	this.setAttribute('aria-expanded', Boolean(this._expanded));
	if (this._expanded && !this._msgBodyCreated) {
		// Provide a callback to ensure address bubbles are properly set up
		var dayViewCallback = null;
		if (this._isCalendarInvite) {
			dayViewCallback = this._handleShowCalendarLink.bind(this, ZmOperation.SHOW_ORIG, showCalInConv);
		}
		var respCallback = this._handleResponseSetExpansion.bind(this, this._msg, dayViewCallback);
		this._renderMessage(this._msg, null, respCallback);
	}
	else {
		// hide or show everything below the header
        var children = this.getHtmlElement().childNodes;
        for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (child === this._header.getHtmlElement()) {
				//do not collapse the header! (p.s. it might not be the first child - see bug 82989
				continue;
			}
			var show = (child && child.id === this._displayImagesId) ? this._expanded && this._needToShowInfoBar : this._expanded;
			Dwt.setVisible(child, show);
		}
		this._header.set(this._expanded ? ZmMailMsgCapsuleViewHeader.EXPANDED : ZmMailMsgCapsuleViewHeader.COLLAPSED);
		if (this._expanded) {
			this._setTags(this._msg);
			this._controller._handleMarkRead(this._msg);
			appCtxt.notifyZimlets("onMsgExpansion", [this._msg, this]);
		}
		else {
			var replyView = this._convView._replyView;
			if (replyView && replyView._msg == this._msg) {
				replyView.reset();
			}
		}
		this._convView._header._setExpandIcon();
		if (this._expanded && this._isCalendarInvite) {
			this._handleShowCalendarLink(ZmOperation.SHOW_ORIG, showCalInConv);
		}
	}

	if (this._expanded) {
		this._createBubbles();
		if (this._controller._checkKeepReading) {
			this._controller._checkKeepReading();
		}
		this._lastCollapsed = false;
	}

	this._setHeaderClass();
	this._resetIframeHeightOnTimer();
};

ZmMailMsgCapsuleView.prototype._handleResponseSetExpansion =
function(msg, callback) {
	this._handleResponseSet(msg, null, callback);
	this._convView._header._setExpandIcon();
};

ZmMailMsgCapsuleView.prototype._insertTagRow =
function(table, tagCellId) {
	
	if (!table) { return; }
	
	var tagRow = table.insertRow(-1);
	var cell;
	tagRow.id = this._tagRowId;
	cell = tagRow.insertCell(-1);
	cell.className = "LabelColName";
	cell.innerHTML = ZmMsg.tags + ":";
	cell.style.verticalAlign = "middle";
	var tagCell = tagRow.insertCell(-1);
	tagCell.className = "LabelColValue";
	tagCell.id = tagCellId;
	cell = tagRow.insertCell(-1);
	cell.style.align = "right";
	cell.innerHTML = "&nbsp;";
	
	return tagCell;
};

// Msg view header has been left-clicked
ZmMailMsgCapsuleView.prototype._selectionListener =
function(ev) {

	this._toggleExpansion();

	// Remember the last msg view that the user collapsed. Expanding any msg view clears that.
	var convView = this._convView,
		lastCollapsedMsgView = convView._lastCollapsedId && convView._msgViews[convView._lastCollapsedId];

	if (lastCollapsedMsgView) {
		lastCollapsedMsgView._lastCollapsed = false;
		lastCollapsedMsgView._setHeaderClass();
	}
	var isCollapsed = !this.isExpanded();
	this._lastCollapsed = isCollapsed;
	convView._lastCollapsedId = isCollapsed && this._msgId;
	this._setHeaderClass();

	return true;
};

// Msg view header has been right-clicked
ZmMailMsgCapsuleView.prototype._actionListener =
function(ev, force) {

	var hdr = this._header;
	var el = DwtUiEvent.getTargetWithProp(ev, "id", false, hdr._htmlElId);
	if (force || (el == hdr.getHtmlElement())) {
		var target = DwtUiEvent.getTarget(ev);
		var objMgr = this._objectManager;
		if (objMgr && !AjxUtil.isBoolean(objMgr) && objMgr._findObjectSpan(target)) {
			// let zimlet framework handle this; we don't want to popup our action menu
			return;
		}
		this._convView._setSelectedMsg(this._msg);
		this._controller._listActionListener.call(this._controller, ev);
		return true;
	}
	return false;
};

/**
 * returns true if we are under the standalone conv view (double-clicked from conv list view)
 */
ZmMailMsgCapsuleView.prototype._isStandalone =
function() {
	return this.parent._isStandalone();
};

// No-op parent change listener. We rely on list change listener.
ZmMailMsgCapsuleView.prototype._msgChangeListener = function(ev) {};

// Handle changes internally, without using ZmMailMsgView's change listener (it assumes a single
// msg displayed in reading pane).
ZmMailMsgCapsuleView.prototype._handleChange =
function(ev) {

	if (ev.type != ZmEvent.S_MSG) { return; }
	if (this.isDisposed()) { return; }

	if (ev.event == ZmEvent.E_FLAGS) {
		var flags = ev.getDetail("flags");
		for (var j = 0; j < flags.length; j++) {
			var flag = flags[j];
			if (flag == ZmItem.FLAG_UNREAD) {
				this._header._setReadIcon();
				this._header._setHeaderClass();
				this._convView._header._setInfo();
			}
		}
	}
	else if (ev.event == ZmEvent.E_DELETE) {
		this.dispose();
		this._convView._removeMessageView(this._msg.id);
		this._convView._header._setInfo();
	}
	else if (ev.event == ZmEvent.E_MOVE) {
		this._changeFolderName(ev.getDetail("oldFolderId"));
	}
	else if (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL) {
		this._setTags(this._msg);
	}
};

ZmMailMsgCapsuleView.prototype._changeFolderName = 
function(oldFolderId) {

	var msg = this._msg;
	var folder = appCtxt.getById(msg.folderId);
	if (folder && (folder.nId == ZmFolder.ID_TRASH || oldFolderId == ZmFolder.ID_TRASH)) {
		this._header._setHeaderClass(msg);
	}
};

ZmMailMsgCapsuleView.prototype._handleMsgTruncated =
function() {
	this._msg.viewEntireMessage = true;	// remember so we reply to entire msg
	this._showEntireMsg = true;			// set flag to load non-truncated msg
	if (this._inviteMsgView) {
		this._inviteMsgView._dayView = null; // for some reason the DOM of it gets lost so we have to null it so we don't try to access it later - instead of would be re-created.
		this._inviteCalendarContainer = null;
	}
	this._forceExpand = true;
	// redo loading and display of entire msg
	this.set(this._msg, true);
	
	Dwt.setVisible(this._msgTruncatedId, false);
};

ZmMailMsgCapsuleView.prototype.isTruncated =
function(part) {
	/*
	 There are 3 possible cases here
	 1. Message does not have a quoted content - In this case use truncation information from the message part.
	 2. Message has a quoted content which is visible - In this case use the truncation information from message part.
	 3. Message has a quoted content which is hidden - In this case if the truncation happens it will always be in the quoted content which is hidden so return false.
	 */
	return (!this._hasOrigContent || this._showingQuotedText) ? part.isTruncated : false;
};

ZmMailMsgCapsuleView.prototype._getIframeTitle = function() {
	return AjxMessageFormat.format(ZmMsg.messageTitleInConv, this._index + 1);
};

/**
 * The header bar of a capsule message view:
 * 	- shows minimal header info (from, date)
 * 	- has an expansion icon
 * 	- is used to drag the message
 * 	- is the drop target for tags
 * 	
 * @param params
 */
ZmMailMsgCapsuleViewHeader = function(params) {

	this._normalClass = "Conv2MsgHeader";
	params.posStyle = DwtControl.RELATIVE_STYLE;
	params.className = params.className || this._normalClass;
	DwtControl.call(this, params);

	this._setEventHdlrs([DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP, DwtEvent.ONDBLCLICK]);
	
	this._msgView = this.parent;
	this._convView = this.parent._convView;
	this._msg = this.parent._msg;
	this._controller = this.parent._controller;
	this._browserToolTip = this.parent._browserToolTip;
	
	if (this._controller.supportsDnD()) {
		var dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		dragSrc.addDragListener(this._dragListener.bind(this));
		this.setDragSource(dragSrc);
		var dropTgt = this._dropTgt = new DwtDropTarget("ZmTag");
		dropTgt.addDropListener(this._dropListener.bind(this));
		this.setDropTarget(dropTgt);
	}
	
	this.addListener(DwtEvent.ONDBLCLICK, this._dblClickListener);
	this.addListener(DwtEvent.ONMOUSEUP, this._mouseUpListener.bind(this));
	
	this.setScrollStyle(DwtControl.CLIP);
};

ZmMailMsgCapsuleViewHeader.prototype = new DwtControl;
ZmMailMsgCapsuleViewHeader.prototype.constructor = ZmMailMsgCapsuleViewHeader;

ZmMailMsgCapsuleViewHeader.prototype.isZmMailMsgCapsuleViewHeader = true;
ZmMailMsgCapsuleViewHeader.prototype.toString = function() { return "ZmMailMsgCapsuleViewHeader"; };

ZmMailMsgCapsuleViewHeader.prototype.isFocusable = true;
ZmMailMsgCapsuleViewHeader.prototype.role = 'header';

ZmMailMsgCapsuleViewHeader.COLLAPSED	= "Collapsed";
ZmMailMsgCapsuleViewHeader.EXPANDED		= "Expanded";

/**
 * Renders a header in one of two ways:
 * 
 *		collapsed:	from address (full name), fragment, date
 *		expanded:	address headers with bubbles, date, icons for folder, tags, etc
 *	
 * We can't cache the header content because the email zimlet fills in the bubbles after the
 * HTML has been generated (expanded view).
 * 
 * @param {constant}	state	collapsed or expanded
 * @param {boolean}		force	if true, render even if not changing state
 */
ZmMailMsgCapsuleViewHeader.prototype.set =
function(state, force) {

	if (!force && state == this._state) { return; }
	var beenHere = !!this._state;
	state = this._state = state || this._state;
	var isExpanded = (state == ZmMailMsgCapsuleViewHeader.EXPANDED);
	
	var id = this._htmlElId;
	var msg = this._msg;
	var ai = this._msgView._getAddrInfo(msg);
	this._showMoreIds = ai.showMoreIds;

	var folder = appCtxt.getById(msg.folderId);
	msg.showImages = msg.showImages || (folder && folder.isFeed());
	this._idToAddr = {};

	this._dateCellId = id + "_dateCell";
	var date = msg.sentDate || msg.date;
	var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
	var dateString = dateFormatter.format(new Date(date));

	this._readIconId = id + "_read";
	this._readCellId = id + "_readCell";

	var html;

	var subs = {
		readCellId:		this._readCellId,
		date:			dateString,
		dateCellId:		this._dateCellId,
	};

	var imageSize = isExpanded ? 48 : 32,
		imageURL  = ai.sentByContact && ai.sentByContact.getImageUrl(imageSize, imageSize),
		imageAltText = imageURL && ai.sentByContact && ai.sentByContact.getFullName();

	if (!isExpanded) {
		var fromId = id + "_0";
		this._idToAddr[fromId] = ai.fromAddr;

		AjxUtil.hashUpdate(subs, {
			imageURL:	    imageURL || ZmZimbraMail.DEFAULT_CONTACT_ICON_SMALL,
			defaultImageUrl:	ZmZimbraMail.DEFAULT_CONTACT_ICON_SMALL,
			imageAltText:   imageAltText || ZmMsg.unknownPerson,
			from:		    ai.from,
			fromId:		    fromId,
			fragment:	    AjxStringUtil.htmlEncode(msg.fragment),
			isInvite:       this.parent._isCalendarInvite
		});
		html = AjxTemplate.expand("mail.Message#Conv2MsgHeader-collapsed", subs);
	}
	else {

		AjxUtil.hashUpdate(subs, {
			hdrTableId:		this._msgView._hdrTableId = id + "_hdrTable",
			imageURL:		imageURL || ZmZimbraMail.DEFAULT_CONTACT_ICON,
			defaultImageUrl:	ZmZimbraMail.DEFAULT_CONTACT_ICON,
			imageAltText:   imageAltText || ZmMsg.unknownPerson,
			sentBy:			ai.sentBy,
			sentByAddr:		ai.sentByAddr,
			obo:			ai.obo,
			oboAddr:		ai.oboAddr,
			oboId:			id +  ZmId.CMP_OBO_SPAN,
			bwo:			ai.bwo,
			bwoAddr:		ai.bwoAddr,
			bwoId:			id +  ZmId.CMP_BWO_SPAN,
			addressTypes:	ai.addressTypes,
			participants:	ai.participants,
			isOutDated:		msg.invite && msg.invite.isEmpty()
		});
		html = AjxTemplate.expand("mail.Message#Conv2MsgHeader-expanded", subs);
	}

	this.setContent(html);
	this._setHeaderClass();
	
	this._setReadIcon();
	
	for (var id in this._showMoreIds) {
		var showMoreLink = document.getElementById(id);
		if (showMoreLink) {
			showMoreLink.notoggle = 1;
		}
	}
};

/**
 * Gets the tool tip content.
 * 
 * @param	{Object}	ev		the hover event
 * @return	{String}	the tool tip content
 */
ZmMailMsgCapsuleViewHeader.prototype.getToolTipContent =
function(ev) {
	var el = DwtUiEvent.getTargetWithProp(ev, "id");
	if (el && el.id) {
		var id = el.id;
		if (!id) { return ""; }
		var addr = this._idToAddr[id];
		if (addr) {
			var ttParams = {address:addr, ev:ev, noRightClick:true};
			var ttCallback = new AjxCallback(this,
				function(callback) {
					appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, ttParams, callback);
				});
			return {callback:ttCallback};
		}
	}
};

ZmMailMsgCapsuleViewHeader.prototype.getTooltipBase =
function(hoverEv) {
	return hoverEv ? DwtUiEvent.getTargetWithProp(hoverEv.object, "id") : DwtControl.prototype.getTooltipBase.apply(this, arguments);
};

// Indicate unread and/or in Trash
ZmMailMsgCapsuleViewHeader.prototype._setHeaderClass =
function() {

	var msg = this._msg;
	var classes = [this._normalClass];
	var folder = appCtxt.getById(msg.folderId);
	if (folder && folder.isInTrash()) {
		classes.push("Trash");
	}
	if (msg.isUnread && !msg.isMute) {
		classes.push("Unread");
	}
	this.setClassName(classes.join(" "));
};

// Set the ball icon to show read or unread
ZmMailMsgCapsuleViewHeader.prototype._setReadIcon =
function() {
	var readCell = document.getElementById(this._readCellId);
	if (readCell) {
		var isExpanded = (this._state == ZmMailMsgCapsuleViewHeader.EXPANDED);
		var tooltip = this._msg.isUnread ? ZmMsg.markAsRead : ZmMsg.markAsUnread;
		var attrs = "id='" + this._readIconId + "' noToggle=1 title='" + tooltip + "'";
		var iePos = AjxEnv.isIE ? "position:static" : null;
		readCell.innerHTML = AjxImg.getImageHtml(this._msg.getReadIcon(), isExpanded ? iePos : "display:inline-block", attrs);
	}
};

ZmMailMsgCapsuleViewHeader.prototype._mouseUpListener =
function(ev) {
	
	var msgView = this._msgView;
	var convView = msgView._convView;

	var target = DwtUiEvent.getTarget(ev);
	if (target && target.id == this._readIconId) {
		var folder = appCtxt.getById(this._msg.folderId);
		if (!(folder && folder.isReadOnly())) {
			this._controller._doMarkRead([this._msg], this._msg.isUnread);
		}
		return true;
	}
	else if (DwtUiEvent.getTargetWithProp(ev, "notoggle")) {
		// ignore event if an internal control should handle it
		return false;
	}
	
	if (ev.button == DwtMouseEvent.LEFT) {
		return msgView._selectionListener(ev);
	}
	else if (ev.button == DwtMouseEvent.RIGHT) {
		return msgView._actionListener(ev);
	}
};
	
ZmMailMsgCapsuleViewHeader.prototype._dragListener =
function(ev) {
	if (ev.action == DwtDragEvent.SET_DATA) {
		ev.srcData = {data: this._msg, controller: this._controller};
	}
};

ZmMailMsgCapsuleViewHeader.prototype._getDragProxy =
function(dragOp) {
	var view = this._msgView;
	var icon = ZmMailMsgListView.prototype._createItemHtml.call(this._controller._mailListView, view._msg, {now:new Date(), isDragProxy:true});
	Dwt.setPosition(icon, Dwt.ABSOLUTE_STYLE);
	appCtxt.getShell().getHtmlElement().appendChild(icon);
	Dwt.setZIndex(icon, Dwt.Z_DND);
	return icon;
};

// TODO: should we highlight msg header (dragSelect it)?
ZmMailMsgCapsuleViewHeader.prototype._dropListener =
function(ev) {

	var item = this._msg;

	// only tags can be dropped on us
	var data = ev.srcData.data;
	if (ev.action == DwtDropEvent.DRAG_ENTER) {
		ev.doIt = (item && item.isZmItem && !item.isReadOnly() && this._dropTgt.isValidTarget(data));
        // Bug: 44488 - Don't allow dropping tag of one account to other account's item
        if (appCtxt.multiAccounts) {
           var listAcctId = item ? item.getAccount().id : null;
           var tagAcctId = (data.account && data.account.id) || data[0].account.id;
           if (listAcctId != tagAcctId) {
               ev.doIt = false;
           }
        }
		DBG.println(AjxDebug.DBG3, "DRAG_ENTER: doIt = " + ev.doIt);
	} else if (ev.action == DwtDropEvent.DRAG_DROP) {
		this._controller._doTag([item], data, true);
	}
};

// Open a msg into a tabbed view
ZmMailMsgCapsuleViewHeader.prototype._dblClickListener =
function(ev) {
	var msg = ev.dwtObj && ev.dwtObj.parent && ev.dwtObj.parent._msg;
	if (msg) {
		AjxDispatcher.run("GetMsgController", msg.nId).show(msg, this._controller, null, true);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmRecipients")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * This class provides a central area for managing email recipient fields. It is not a control,
 * and does not exist within the widget hierarchy.
 * 
 * @param {hash}		params						a hash of params:
 * @param {function}	resetContainerSizeMethod	callback for when size needs to be adjusted
 * @param {function}	enableContainerInputs		callback for enabling/disabling input fields
 * @param {function}	reenter						callback to enable design mode
 * @param {AjxListener}	contactPopdownListener		listener called when contact picker pops down
 * @param {string}		contextId					ID of owner (used for autocomplete list)
 */
ZmRecipients = function(params) {

	this._divId			    = {};
	this._buttonTdId	    = {};
	this._fieldId		    = {};
	this._using			    = {};
	this._button		    = {};
	this._field			    = {};
	this._divEl			    = {};
	this._addrInputField    = {};

    this._resetContainerSize = params.resetContainerSizeMethod;
    this._enableContainerInputs = params.enableContainerInputs;
    this._reenter = params.reenter;
    this._contactPopdownListener = params.contactPopdownListener;
	this._contextId = params.contextId;

    this._bubbleOps = {};
    this._bubbleOps[AjxEmailAddress.TO]  = ZmOperation.MOVE_TO_TO;
    this._bubbleOps[AjxEmailAddress.CC]  = ZmOperation.MOVE_TO_CC;
    this._bubbleOps[AjxEmailAddress.BCC] = ZmOperation.MOVE_TO_BCC;
    this._opToField = {};
    this._opToField[ZmOperation.MOVE_TO_TO]  = AjxEmailAddress.TO;
    this._opToField[ZmOperation.MOVE_TO_CC] = AjxEmailAddress.CC;
    this._opToField[ZmOperation.MOVE_TO_BCC] = AjxEmailAddress.BCC;
};

ZmRecipients.OP = {};
ZmRecipients.OP[AjxEmailAddress.TO]		= ZmId.CMP_TO;
ZmRecipients.OP[AjxEmailAddress.CC]		= ZmId.CMP_CC;
ZmRecipients.OP[AjxEmailAddress.BCC]	= ZmId.CMP_BCC;

ZmRecipients.BAD = "_bad_addrs_";


ZmRecipients.prototype.attachFromSelect =
function(fromSelect) {
    this._fromSelect = fromSelect;
}

ZmRecipients.prototype.createRecipientIds =
function(htmlElId, typeStr) {
    var ids = {};
    var components = ["row", "picker", "control", "cell"];
    for (var i = 0; i < components.length; i++) {
        ids[components[i]] = [htmlElId, typeStr, components[i]].join("_")
    }
    return ids;
}


ZmRecipients.prototype.createRecipientHtml =
function(parent, viewId, htmlElId, fieldNames) {

    this._fieldNames = fieldNames;
	var contactsEnabled = appCtxt.get(ZmSetting.CONTACTS_ENABLED);
	var galEnabled = appCtxt.get(ZmSetting.GAL_ENABLED);

    	// init autocomplete list
    if (contactsEnabled || galEnabled || appCtxt.isOffline) {
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_FULL,
			keyUpCallback:	this._acKeyupHandler.bind(this),
			contextId:		this._contextId
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
	}

	var isPickerEnabled = contactsEnabled || galEnabled || appCtxt.multiAccounts;	
	
	this._pickerButton = {};

	// process compose fields
	for (var i = 0; i < fieldNames.length; i++) {
		var type = fieldNames[i];
		var typeStr = AjxEmailAddress.TYPE_STRING[type];

		// save identifiers
        var ids = this.createRecipientIds(htmlElId, typeStr);
		this._divId[type] = ids.row;
		this._buttonTdId[type] = ids.picker;
		var inputId = this._fieldId[type] = ids.control;
		var label = AjxMessageFormat.format(ZmMsg.addressFieldLabel, ZmMsg[AjxEmailAddress.TYPE_STRING[this._fieldNames[i]]]);

		// save field elements
		this._divEl[type] = document.getElementById(this._divId[type]);
		var aifId;
		var aifParams = {
			parent:								parent,
			autocompleteListView:				this._acAddrSelectList,
			bubbleAddedCallback:				this._bubblesChangedCallback.bind(this),
			bubbleRemovedCallback:				this._bubblesChangedCallback.bind(this),
			bubbleMenuCreatedCallback:			this._bubbleMenuCreated.bind(this),
			bubbleMenuResetOperationsCallback:	this._bubbleMenuResetOperations.bind(this),
			inputId:							inputId,
			label: 								label,
			type:								type
		}
		var aif = this._addrInputField[type] = new ZmAddressInputField(aifParams);
		aifId = aif._htmlElId;
		aif.reparentHtmlElement(ids.cell);

		// save field control
		var fieldEl = this._field[type] = document.getElementById(this._fieldId[type]);
		if (fieldEl) {
			fieldEl.addrType = type;
			fieldEl.supportsAutoComplete = true;
		}

		// create picker
		if (isPickerEnabled) {

			// bug 78318 - if GAL enabled but not contacts, we need some things defined to handle GAL search
			if (!contactsEnabled) {
				appCtxt.getAppController()._createApp(ZmApp.CONTACTS);
			}

			var pickerId = this._buttonTdId[type];
			var pickerEl = document.getElementById(pickerId);
			if (pickerEl) {
				var buttonId = ZmId.getButtonId(viewId, ZmRecipients.OP[type]);
				var button = this._pickerButton[type] = new DwtButton({parent:parent, id:buttonId});
				button.setText(pickerEl.innerHTML);
				button.replaceElement(pickerEl);

				button.addSelectionListener(this.addressButtonListener.bind(this));
				button.addrType = type;

				// autocomplete-related handlers
				// Enable this even if contacts are not enabled, to provide GAL autoComplete
				this._acAddrSelectList.handle(fieldEl, aifId);

				this._button[type] = button;
			}
		} else {
			// Mark the field, so that it will be sized properly in ZmAddressInputField._resizeInput.
			// Otherwise, it is set to 30px wide, which makes it rather hard to type into.
			fieldEl.supportsAutoComplete = false;
		}
	}
};

ZmRecipients.prototype.reset =
function() {

	// reset To/CC/BCC fields
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];
		var textarea = this._field[type];
		textarea.value = "";
		var addrInput = this._addrInputField[type];
		if (addrInput) {
			addrInput.clear();
		}
	}
};

ZmRecipients.prototype.resetPickerButtons =
function(account) {
	var ac = window.parentAppCtxt || window.appCtxt;
	var isEnabled = ac.get(ZmSetting.CONTACTS_ENABLED, null, account) ||
					ac.get(ZmSetting.GAL_ENABLED, null, account);

	for (var i in this._pickerButton) {
		var button = this._pickerButton[i];
		button.setEnabled(isEnabled);
	}
};

ZmRecipients.prototype.setup =
function() {
    // reset To/Cc/Bcc fields
    if (this._field[AjxEmailAddress.TO]) {
        this._showAddressField(AjxEmailAddress.TO, true, true, true);
    }
    if (this._field[AjxEmailAddress.CC]) {
        this._showAddressField(AjxEmailAddress.CC, true, true, true);
    }
    if (this._field[AjxEmailAddress.BCC]) {
        this._showAddressField(AjxEmailAddress.BCC, false, true, true);
    }
};

ZmRecipients.prototype.getPicker =
function(type) {
    return this._pickerButton[type];
};

ZmRecipients.prototype.getField =
function(type) {
    return document.getElementById(this._fieldId[type]);
};

ZmRecipients.prototype.getUsing =
function(type) {
    return this._using[type];
};

ZmRecipients.prototype.getACAddrSelectList =
function() {
    return this._acAddrSelectList;
};

ZmRecipients.prototype.getTabGroupMember = function() {
	var tg = new DwtTabGroup('ZmRecipients');

	for (var i = 0; i < ZmMailMsg.COMPOSE_ADDRS.length; i++) {
		var type = ZmMailMsg.COMPOSE_ADDRS[i];
		tg.addMember(this.getPicker(type));
		tg.addMember(this.getAddrInputField(type).getTabGroupMember());
	}

	return tg;
};

ZmRecipients.prototype.getAddrInputField =
function(type) {
    return this._addrInputField[type];
};

// Adds the given addresses to the form. We need to add each address separately in case it's a DL.
ZmRecipients.prototype.addAddresses =
function(type, addrVec, used) {

	var addrAdded = false;
	used = used || {};
	var addrList = [];
	var addrs = AjxUtil.toArray(addrVec);
	if (addrs && addrs.length) {
		for (var i = 0, len = addrs.length; i < len; i++) {
			var addr = addrs[i];
			var email = addr.isAjxEmailAddress ? addr && addr.getAddress() : addr;
			if (!email) { continue; }
			email = email.toLowerCase();
			if (!used[email]) {
				this.setAddress(type, addr);	// add the bubble now
				used[email] = true;
				addrAdded = true;
			}
		}
	}
	return addrAdded;
};


/**
 * Sets an address field.
 *
 * @param type	the address type
 * @param addr	the address string
 *
 * XXX: if addr empty, check if should hide field
 *
 * @private
 */
ZmRecipients.prototype.setAddress =
function(type, addr) {

	addr = addr || "";

	var addrStr = addr.isAjxEmailAddress ? addr.toString() : addr;

	//show first, so focus works on IE.
	if (addrStr.length && !this._using[type]) {
		this._using[type] = true;
		this._showAddressField(type, true);
	}

	var addrInput = this._addrInputField[type];
	if (!addrStr) {
		addrInput.clear();
	}
	else {
		if (addr.isAjxEmailAddress) {
			var match = {isDL: addr.isGroup && addr.canExpand, email: addrStr};
			addrInput.addBubble({address:addrStr, match:match, skipNotify:true, noFocus:true});
		}
		else {
			this._setAddrFieldValue(type, addrStr);
		}
	}
};


/**
 * Gets the field values for each of the addr fields.
 *
 * @return	{Array}	an array of addresses
 */
ZmRecipients.prototype.getRawAddrFields =
function() {
	var addrs = {};
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];
		if (this._using[type]) {
			addrs[type] = this.getAddrFieldValue(type);
		}
	}
	return addrs;
};

// returns address fields that are currently visible
ZmRecipients.prototype.getAddrFields =
function() {
	var addrs = [];
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];
		if (this._using[type]) {
			addrs.push(this._field[type]);
		}
	}
	return addrs;
};


// Grab the addresses out of the form. Optionally, they can be returned broken
// out into good and bad addresses, with an aggregate list of the bad ones also
// returned. If the field is hidden, its contents are ignored.
ZmRecipients.prototype.collectAddrs =
function() {

	var addrs = {};
	addrs[ZmRecipients.BAD] = new AjxVector();
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];

		if (!this._field[type]) { //this check is in case we don't have all fields set up (might be configurable. Didn't look deeply).
			continue;
		}

		var val = this.getAddrFieldValue(type);
		if (val.length == 0) { continue; }
		val = val.replace(/[; ,]+$/, "");	// ignore trailing (and possibly extra) separators
		var result = AjxEmailAddress.parseEmailString(val, type, false);
		if (result.all.size() == 0) { continue; }
		addrs.gotAddress = true;
		addrs[type] = result;
		if (result.bad.size()) {
			addrs[ZmRecipients.BAD].addList(result.bad);
			if (!addrs.badType) {
				addrs.badType = type;
			}
		}
	}
	return addrs;
};


ZmRecipients.prototype.getAddrFieldValue =
function(type) {
	var addrInput = this._addrInputField[type];
	return addrInput ? addrInput.getValue() : '';
};

ZmRecipients.prototype.enableInputs =
function(bEnable) {
	// disable input elements so they dont bleed into top zindex'd view
	for (var i = 0; i < this._fieldNames.length; i++) {
		this._field[this._fieldNames[i]].disabled = !bEnable;
	}
};

// Address buttons invoke contact picker
ZmRecipients.prototype.addressButtonListener =
function(ev, addrType) {
	if (appCtxt.isWebClientOffline()) return;

	var obj = ev ? DwtControl.getTargetControl(ev) : null;
	if (this._enableContainerInputs) {
		this._enableContainerInputs(false);
	}

	if (!this._contactPicker) {
		AjxDispatcher.require("ContactsCore");
		var buttonInfo = [];
        for (var i = 0; i < this._fieldNames.length; i++) {
            buttonInfo[i] = { id: this._fieldNames[i],
                              label : ZmMsg[AjxEmailAddress.TYPE_STRING[this._fieldNames[i]]]};
        }
		this._contactPicker = new ZmContactPicker(buttonInfo);
		this._contactPicker.registerCallback(DwtDialog.OK_BUTTON, this._contactPickerOkCallback, this);
		this._contactPicker.registerCallback(DwtDialog.CANCEL_BUTTON, this._contactPickerCancelCallback, this);
	}

	var curType = obj ? obj.addrType : addrType;
	var addrList = {};
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];
		addrList[type] = this._addrInputField[type].getAddresses(true);
	}
	if (this._contactPopdownListener) {
		this._contactPicker.addPopdownListener(this._contactPopdownListener);
	}
	var str = (this._field[curType].value && !(addrList[curType] && addrList[curType].length))
		? this._field[curType].value : "";

	var account;
	if (appCtxt.multiAccounts && this._fromSelect) {
		var addr = this._fromSelect.getSelectedOption().addr;
		account = appCtxt.accountList.getAccountByEmail(addr.address);
	}
	this._contactPicker.popup(curType, addrList, str, account);
};




// Private methods

// Show address field
ZmRecipients.prototype._showAddressField =
function(type, show, skipNotify, skipFocus) {
	this._using[type] = show;
	Dwt.setVisible(this._divEl[type], show);
	this._setAddrFieldValue(type, "");	 // bug fix #750 and #3680
	this._field[type].noTab = !show;
	this._addrInputField[type].noTab = !show;
	if (this._pickerButton[type]) {
		this._pickerButton[type].noTab = !show;
	}
	if (this._resetContainerSize) {
		this._resetContainerSize();
	}
};

ZmRecipients.prototype._acKeyupHandler =
function(ev, acListView, result, element) {
	var key = DwtKeyEvent.getCharCode(ev);
	// process any printable character or enter/backspace/delete keys
	if (result && element && (ev.inputLengthChanged ||
		(DwtKeyEvent.IS_RETURN[key] || key === DwtKeyEvent.KEY_BACKSPACE || key === DwtKeyEvent.KEY_DELETE ||
		(AjxEnv.isMac && key === DwtKeyEvent.KEY_COMMAND)))) // bug fix #24670
	{
		element.value = element.value && element.value.replace(/;([^\s])/g, function(all, group){return "; "+group}) || ""; // Change ";" to "; " if it is not succeeded by a whitespace
	}
};

/**
 * a callback that's called when bubbles are added or removed, since we need to resize the msg body in those cases.
 */
ZmRecipients.prototype._bubblesChangedCallback =
function() {
	if (this._resetContainerSize) {
		this._resetContainerSize(); // body size might change due to change in size of address field (due to new bubbles).
	}
};

ZmRecipients.prototype._bubbleMenuCreated =
function(addrInput, menu) {

	this._bubbleActionMenu = menu;
    if (this._fieldNames.length > 1) {
        menu.addOp(ZmOperation.SEP);
        var listener = new AjxListener(this, this._bubbleMove);

        for (var i = 0; i < this._fieldNames.length; i++) {
            var type = this._fieldNames[i];
            var op = this._bubbleOps[type];
            menu.addOp(op);
            menu.addSelectionListener(op, listener);
        }
    }
};

ZmRecipients.prototype._bubbleMenuResetOperations =
function(addrInput, menu) {
	var sel = addrInput.getSelection();
    for (var i = 0; i < this._fieldNames.length; i++) {
        var type = this._fieldNames[i];
		var op = this._bubbleOps[type];
		menu.enable(op, sel.length > 0 && (type != addrInput.type));
	}
};

ZmRecipients.prototype._bubbleMove =
function(ev) {

	var sourceInput = ZmAddressInputField.menuContext.addrInput;
	var op = ev && ev.item && ev.item.getData(ZmOperation.KEY_ID);
	var type = this._opToField[op];
	var targetInput = this._addrInputField[type];
	if (sourceInput && targetInput) {
		var sel = sourceInput.getSelection();
		if (sel.length) {
			for (var i = 0; i < sel.length; i++) {
				var bubble = sel[i];
				this._showAddressField(type, true);
				targetInput.addBubble({bubble:bubble});
				sourceInput.removeBubble(bubble.id);
			}
		}
	}
};

ZmRecipients.prototype._setAddrFieldValue =
function(type, value) {

	var addrInput = this._addrInputField[type];
	if (addrInput) {
		addrInput.setValue(value, true);
	}
};

// Generic routine for attaching an event handler to a field. Since "this" for the handlers is
// the incoming event, we need a way to get at ZmComposeView, so it's added to the event target.
ZmRecipients.prototype._setEventHandler =
function(id, event, addrType) {
	var field = document.getElementById(id);
	field._recipients = this;
	if (addrType) {
		field._addrType = addrType;
	}
	var lcEvent = event.toLowerCase();
	field[lcEvent] = ZmRecipients["_" + event];
};

// set focus within tab group to element so tabbing works
ZmRecipients._onFocus =
function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	var element = DwtUiEvent.getTargetWithProp(ev, "id");
	if (!element) { return true; }

	var kbMgr = appCtxt.getKeyboardMgr();
	if (kbMgr.__currTabGroup) {
		kbMgr.__currTabGroup.setFocusMember(element);
	}
};

// Transfers addresses from the contact picker to the compose view.
ZmRecipients.prototype._contactPickerOkCallback =
function(addrs) {

	if (this._enableContainerInputs) {
		this._enableContainerInputs(true);
	}
	for (var i = 0; i < this._fieldNames.length; i++) {
		var type = this._fieldNames[i];
		this.setAddress(type, "");
        // If there was only one button, the picker will just return the list of selections,
        // not a list per button type
        var typeAddrs = (this._fieldNames.length == 1) ? addrs :  addrs[type];
		var addrVec = ZmRecipients.expandAddrs(typeAddrs);
		this.addAddresses(type, addrVec);
	}

	// Still need this here since REMOVING stuff with the picker does not call removeBubble in the ZmAddressInputField.
	// Also - it's better to do it once than for every bubble in this case. user might add many addresses with the picker
	this._bubblesChangedCallback();

	if (this._contactPopdownListener) {
		this._contactPicker.removePopdownListener(this._contactPopdownListener);
	}
	this._contactPicker.popdown();
	if (this._reenter) {
		this._reenter();
	}
};

// Expands any addresses that are groups
ZmRecipients.expandAddrs =
function(addrs) {
	var addrsNew = [];
	var addrsArray = (addrs instanceof AjxVector) ? addrs.getArray() : addrs;
	if (addrsArray && addrsArray.length) {
		for (var i = 0; i < addrsArray.length; i++) {
			var addr = addrsArray[i];
			if (addr) {
				if (addr.isGroup && !(addr.__contact && addr.__contact.isDL)) {
					var members = addr.__contact ? addr.__contact.getGroupMembers().good.getArray() :
												   AjxEmailAddress.split(addr.address);
					addrsNew = addrsNew.concat(members);
				}
				else {
					addrsNew.push(addr);
				}
			}
		}
	}
	return AjxVector.fromArray(addrsNew);
};

ZmRecipients.prototype._contactPickerCancelCallback =
function() {
	if (this._enableContainerInputs) {
		this._enableContainerInputs(true);
	}
	if (this._reenter) {
		this._reenter();
	}
};

ZmRecipients.prototype._toggleBccField =
function(show) {
	var visible = AjxUtil.isBoolean(show) ? show : !Dwt.getVisible(this._divEl[AjxEmailAddress.BCC]);
	this._showAddressField(AjxEmailAddress.BCC, visible);
};
}
if (AjxPackage.define("zimbraMail.mail.view.ZmMailRedirectDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a Mail Redirect dialog.
 * @class
 * This class represents a Mail Redirect dialog.
 *
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		DwtDialog
 */
ZmMailRedirectDialog = function(parent, className) {
	className = className || "ZmFolderPropsDialog";

    DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.mailRedirect, id:"RedirectDialog"});

	this.setButtonListener(DwtDialog.CANCEL_BUTTON, this._handleCancelButton.bind(this));

	var recipParams = {};
	recipParams.enableContainerInputs		= this.enableInputs.bind(this);
	recipParams.contactPopdownListener		= this.contactPopdownListener.bind(this);
	recipParams.contextId					= this.toString();
    this._recipients = new ZmRecipients(recipParams);

    this._fieldNames = [AjxEmailAddress.TO];
    var data = { id : this._htmlElId };

    for (var i = 0; i < this._fieldNames.length; i++) {
        var typeStr = AjxEmailAddress.TYPE_STRING[this._fieldNames[i]];
        var ids =  this._recipients.createRecipientIds(this._htmlElId, typeStr)
        data[typeStr + "RowId"]    = ids.row;
        data[typeStr + "PickerId"] = ids.picker;
        data[typeStr + "InputId"]  = ids.control;
        data[typeStr + "CellId"]   = ids.cell;
    }

    var html = AjxTemplate.expand("mail.Message#RedirectDialog", data);
    this.setContent(html);


    this._recipients.createRecipientHtml(this, this._htmlElId, this._htmlElId, this._fieldNames);
    this._tabGroup.addMember(this._recipients.getField(AjxEmailAddress.TO), 0);
};

ZmMailRedirectDialog.prototype = new DwtDialog;
ZmMailRedirectDialog.prototype.constructor = ZmMailRedirectDialog;

ZmMailRedirectDialog.prototype.isZmMailRedirectDialog = true;
ZmMailRedirectDialog.prototype.toString = function() { return "ZmMailRedirectDialog"; };



ZmMailRedirectDialog.prototype.getAddrs =
function() {
	return this._recipients.collectAddrs();
};


/**
 * Pops-up the properties dialog.
 *
 * @param	{ZmOrganizer}	organizer		the organizer
 */
ZmMailRedirectDialog.prototype.popup =
function(mail) {
    this._recipients.setup();

	DwtDialog.prototype.popup.call(this);
};

ZmMailRedirectDialog.prototype._resetTabFocus =
function(){
	this._tabGroup.setFocusMember(this._recipients.getField(AjxEmailAddress.TO), true);
};


ZmMailRedirectDialog.prototype.popdown =
function() {
    this._recipients.reset();
	DwtDialog.prototype.popdown.call(this);
};


// Miscellaneous methods

ZmMailRedirectDialog.prototype.enableInputs =
function(bEnable) {
    this._recipients.enableInputs(bEnable);
};

/**
 * Handles re-enabling inputs if the pop shield is dismissed via
 * Esc. Otherwise, the handling is done explicitly by a callback.
 */
// *** NEEDED??? **** //
ZmMailRedirectDialog.prototype.contactPopdownListener =
function() {
	this.enableInputs(true);
	appCtxt.getAppViewMgr().showPendingView(false);
};

ZmMailRedirectDialog.prototype._handleCancelButton =
function(event) {
	this.popdown();
};
}

if (AjxPackage.define("zimbraMail.mail.controller.ZmMailFolderTreeController")) {
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

ZmMailFolderTreeController = function(type, dropTgt) {
    if (arguments.length == 0) return;
	ZmFolderTreeController.apply(this, arguments);
};
ZmMailFolderTreeController.prototype = new ZmFolderTreeController;
ZmMailFolderTreeController.prototype.constructor = ZmMailFolderTreeController;

ZmMailFolderTreeController.prototype.toString =
function() {
	return "ZmMailFolderTreeController";
};

//
// ZmFolderTreeController methods
//

ZmMailFolderTreeController.prototype._updateOverview = function(params) {

	ZmTreeController.prototype._updateOverview.call(this, params);

	// for multi-account allow account header to update based on Inbox's unread count
	var org = params.organizer, fields = params.fields;
	if (appCtxt.multiAccounts && (fields[ZmOrganizer.F_UNREAD] && org.isSystem()) ||
		(fields[ZmOrganizer.F_TOTAL] && (org.nId == ZmFolder.ID_DRAFTS || org.nId == ZmOrganizer.ID_OUTBOX))) {

		var ovc = appCtxt.getApp(ZmApp.MAIL).getOverviewContainer(true);
		if (ovc) {
			ovc.updateLabel(org);
		}
	}
};

ZmMailFolderTreeController.prototype._deleteListener =
function(ev) {
	// check for associated data source
	if (appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED)) {
		var organizer = this._getActionedOrganizer(ev);
		if (organizer.isDataSource()) {
			var accounts = appCtxt.getDataSourceCollection().getPopAccountsFor(organizer.id);
			var args = [ organizer.getName(), AjxStringUtil.htmlEncode(accounts[0].getName(), true)];
			var message = AjxMessageFormat.format(ZmMsg.errorDeletePopFolder, args);

			var dialog = appCtxt.getMsgDialog();
			dialog.setMessage(message);
			dialog.popup();
			return;
		}
	}

	// perform default action
	ZmFolderTreeController.prototype._deleteListener.apply(this, arguments);
};

ZmMailFolderTreeController.prototype._dropListener =
function(ev) {
	// check for associated data source
	if ((appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED) || appCtxt.get(ZmSetting.IMAP_ACCOUNTS_ENABLED)) && ev.action == DwtDropEvent.DRAG_DROP) {
		var item = ev.srcData.data;
		var organizer = item instanceof ZmOrganizer ? item : null;
		if (organizer && organizer.isDataSource()) {
			var datasources = appCtxt.getDataSourceCollection();
			var popAccounts = appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED) ? datasources.getPopAccountsFor(organizer.id) : [];
			var imapAccounts = appCtxt.get(ZmSetting.IMAP_ACCOUNTS_ENABLED) ? datasources.getImapAccountsFor(organizer.id) : [];
		
			if (popAccounts.length || imapAccounts.length) {
				var args = [ organizer.getName(), popAccounts.length ? popAccounts[0].getName() : imapAccounts[0].getName() ];
				var message = AjxMessageFormat.format(popAccounts.length ? ZmMsg.errorMovePopFolder : ZmMsg.errorMoveImapFolder, args);

				var dialog = appCtxt.getMsgDialog();
				dialog.setMessage(message);
				dialog.popup();
				return;
			}
		}
	}

	// perform default action
	ZmFolderTreeController.prototype._dropListener.apply(this, arguments);
};

ZmMailFolderTreeController.prototype.resetOperations =
function(parent, type, id) {
	// perform default action
	ZmFolderTreeController.prototype.resetOperations.apply(this, arguments);

	// disable move for folders with POP accounts
	if (appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED)) {
		var organizer = appCtxt.getById(id);
		if (organizer.isDataSource()) {
			parent.enable(ZmOperation.MOVE, false);
			parent.enable(ZmOperation.MOVE_MENU, false)
		}
	}
};

ZmMailFolderTreeController.prototype._doMarkAllRead =
function(organizer) {
	// we're not guaranteed mark-all will succeed, so this is a tiny bit risky
	if (appCtxt.isOffline) {
		appCtxt.getApp(ZmApp.MAIL).clearNewMailBadge();
	}

	ZmTreeController.prototype._doMarkAllRead.apply(this, arguments);
};
}
if (AjxPackage.define("zimbraMail.mail.controller.ZmMailListController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a new, empty mail list controller.
 * @constructor
 * @class
 * This class encapsulates controller behavior that is common to lists of mail items.
 * Operations such as replying and marking read/unread are supported.
 *
 * @author Conrad Damon
 *
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						mailApp						the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmListController
 */
ZmMailListController = function(container, mailApp, type, sessionId, searchResultsController) {

	if (arguments.length == 0) { return; }
	ZmListController.apply(this, arguments);

	this._setStatics();

	this._listeners[ZmOperation.SHOW_ORIG] = this._showOrigListener.bind(this);

	this._listeners[ZmOperation.MARK_READ] = this._markReadListener.bind(this);
	this._listeners[ZmOperation.MARK_UNREAD] = this._markUnreadListener.bind(this);
	this._listeners[ZmOperation.FLAG] = this._flagListener.bind(this, true);
	this._listeners[ZmOperation.UNFLAG] = this._flagListener.bind(this, false);
	//fixed bug:15460 removed reply and forward menu.
	if (appCtxt.get(ZmSetting.REPLY_MENU_ENABLED)) {
		this._listeners[ZmOperation.REPLY] = this._replyListener.bind(this);
		this._listeners[ZmOperation.REPLY_ALL] = this._replyListener.bind(this);
	}

	if (appCtxt.get(ZmSetting.FORWARD_MENU_ENABLED)) {
		this._listeners[ZmOperation.FORWARD] = this._forwardListener.bind(this);
		this._listeners[ZmOperation.FORWARD_CONV] = this._forwardConvListener.bind(this);
	}
	this._listeners[ZmOperation.REDIRECT] = new AjxListener(this, this._redirectListener);
	this._listeners[ZmOperation.EDIT] = this._editListener.bind(this, false);
	this._listeners[ZmOperation.EDIT_AS_NEW] = this._editListener.bind(this, true);
	this._listeners[ZmOperation.MUTE_CONV] = this._muteConvListener.bind(this);
	this._listeners[ZmOperation.UNMUTE_CONV] = this._unmuteConvListener.bind(this);

	if (appCtxt.get(ZmSetting.SPAM_ENABLED)) {
		this._listeners[ZmOperation.SPAM] = this._spamListener.bind(this);
	}

	this._listeners[ZmOperation.DETACH] = this._detachListener.bind(this);
	this._inviteReplyListener = this._inviteReplyHandler.bind(this);
	this._shareListener = this._shareHandler.bind(this);
	this._subscribeListener = this._subscribeHandler.bind(this);

	this._acceptShareListener = this._acceptShareHandler.bind(this);
	this._declineShareListener = this._declineShareHandler.bind(this);

	this._listeners[ZmOperation.ADD_FILTER_RULE]	= this._filterListener.bind(this, false, null);
	this._listeners[ZmOperation.CREATE_APPT]		= this._createApptListener.bind(this);
	this._listeners[ZmOperation.CREATE_TASK]		= this._createTaskListener.bind(this);

};

ZmMailListController.prototype = new ZmListController;
ZmMailListController.prototype.constructor = ZmMailListController;

ZmMailListController.prototype.isZmMailListController = true;
ZmMailListController.prototype.toString = function() { return "ZmMailListController"; };

ZmMailListController.GROUP_BY_ITEM		= {};	// item type to search for
ZmMailListController.GROUP_BY_SETTING	= {};	// associated setting on server

// Stuff for the View menu
ZmMailListController.GROUP_BY_ICON		= {};
ZmMailListController.GROUP_BY_MSG_KEY	= {};
ZmMailListController.GROUP_BY_SHORTCUT	= {};
ZmMailListController.GROUP_BY_VIEWS		= [];

// reading pane options
ZmMailListController.READING_PANE_TEXT = {};
ZmMailListController.READING_PANE_TEXT[ZmSetting.RP_OFF]	= ZmMsg.readingPaneOff;
ZmMailListController.READING_PANE_TEXT[ZmSetting.RP_BOTTOM]	= ZmMsg.readingPaneAtBottom;
ZmMailListController.READING_PANE_TEXT[ZmSetting.RP_RIGHT]	= ZmMsg.readingPaneOnRight;

ZmMailListController.READING_PANE_ICON = {};
ZmMailListController.READING_PANE_ICON[ZmSetting.RP_OFF]	= "SplitPaneOff";
ZmMailListController.READING_PANE_ICON[ZmSetting.RP_BOTTOM]	= "SplitPane";
ZmMailListController.READING_PANE_ICON[ZmSetting.RP_RIGHT]	= "SplitPaneVertical";

// conv order options
ZmMailListController.CONV_ORDER_DESC	= ZmSearch.DATE_DESC;
ZmMailListController.CONV_ORDER_ASC		= ZmSearch.DATE_ASC;

ZmMailListController.CONV_ORDER_TEXT = {};
ZmMailListController.CONV_ORDER_TEXT[ZmMailListController.CONV_ORDER_DESC]	= ZmMsg.convOrderDescending;
ZmMailListController.CONV_ORDER_TEXT[ZmMailListController.CONV_ORDER_ASC]	= ZmMsg.convOrderAscending;

// convert key mapping to folder to search
ZmMailListController.ACTION_CODE_TO_FOLDER = {};
ZmMailListController.ACTION_CODE_TO_FOLDER[ZmKeyMap.GOTO_INBOX]		= ZmFolder.ID_INBOX;
ZmMailListController.ACTION_CODE_TO_FOLDER[ZmKeyMap.GOTO_DRAFTS]	= ZmFolder.ID_DRAFTS;
ZmMailListController.ACTION_CODE_TO_FOLDER[ZmKeyMap.GOTO_JUNK]		= ZmFolder.ID_SPAM;
ZmMailListController.ACTION_CODE_TO_FOLDER[ZmKeyMap.GOTO_SENT]		= ZmFolder.ID_SENT;
ZmMailListController.ACTION_CODE_TO_FOLDER[ZmKeyMap.GOTO_TRASH]		= ZmFolder.ID_TRASH;

// convert key mapping to folder to move to
ZmMailListController.ACTION_CODE_TO_FOLDER_MOVE = {};
ZmMailListController.ACTION_CODE_TO_FOLDER_MOVE[ZmKeyMap.MOVE_TO_INBOX]	= ZmFolder.ID_INBOX;
ZmMailListController.ACTION_CODE_TO_FOLDER_MOVE[ZmKeyMap.MOVE_TO_TRASH]	= ZmFolder.ID_TRASH;
ZmMailListController.ACTION_CODE_TO_FOLDER_MOVE[ZmKeyMap.MOVE_TO_JUNK]	= ZmFolder.ID_SPAM;

// convert key mapping to view menu item
ZmMailListController.ACTION_CODE_TO_MENU_ID = {};
ZmMailListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_OFF]		= ZmSetting.RP_OFF;
ZmMailListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_BOTTOM]	= ZmSetting.RP_BOTTOM;
ZmMailListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_RIGHT]	= ZmSetting.RP_RIGHT;

ZmMailListController.ACTION_CODE_WHICH = {};
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.FIRST_UNREAD]	= DwtKeyMap.SELECT_FIRST;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.LAST_UNREAD]	= DwtKeyMap.SELECT_LAST;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.NEXT_UNREAD]	= DwtKeyMap.SELECT_NEXT;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.PREV_UNREAD]	= DwtKeyMap.SELECT_PREV;

ZmMailListController.viewToTab = {};


// Public methods

/**
 * Handles switching views based on action from view menu.
 *
 * @param {constant}	view		the id of the new view
 * @param {Boolean}	force		if <code>true</code>, always redraw view
 */
ZmMailListController.prototype.switchView = function(view, force) {

	if ((view == ZmId.VIEW_TRAD || view == ZmId.VIEW_CONVLIST) && view != this.getCurrentViewType()) {
		if (appCtxt.multiAccounts) {
			delete this._showingAccountColumn;
		}

		var groupBy = ZmMailListController.GROUP_BY_SETTING[view];
		if (this.isSearchResults) {
			appCtxt.getApp(ZmApp.SEARCH).setGroupMailBy(groupBy);
		}
		else {
			this._app.setGroupMailBy(groupBy);
		}

		var folderId = this._currentSearch && this._currentSearch.folderId;
		
		var sortBy = appCtxt.get(ZmSetting.SORTING_PREF, folderId || view);
		if (view == ZmId.VIEW_CONVLIST && (sortBy == ZmSearch.NAME_DESC || sortBy == ZmSearch.NAME_ASC)) {
			sortBy =  appCtxt.get(ZmSetting.SORTING_PREF, view); //go back to sortBy for view
			appCtxt.set(ZmSetting.SORTING_PREF, sortBy, folderId); //force folderId sorting
		}
		if (this._mailListView && !appCtxt.isExternalAccount()) {
			//clear the groups to address "from" grouping for conversation
			if (folderId) {
				var currentGroup = this._mailListView.getGroup(folderId);
				if (currentGroup && currentGroup.id == ZmId.GROUPBY_FROM) {
					this._mailListView.setGroup(ZmId.GROUPBY_NONE);
				}
			}		
		}
		
		this._currentSearch.clearCursor();
		var limit = this._listView[this._currentViewId].getLimit();
		var getHtml = appCtxt.get(ZmSetting.VIEW_AS_HTML);
		var groupByItem = (view == ZmId.VIEW_TRAD) ? ZmItem.MSG : ZmItem.CONV;
		var params = {
			types:			[groupByItem],
			offset:			0,
			limit:			limit,
			sortBy:			sortBy,
			getHtml:		getHtml,
			isViewSwitch:	true
		};
		appCtxt.getSearchController().redoSearch(this._currentSearch, null, params);
	}
};

// override if reading pane is supported
ZmMailListController.prototype._setupReadingPaneMenu = function() {};
ZmMailListController.prototype._setupConvOrderMenu = function() {};

/**
 * Checks if the reading pane is "on".
 * 
 * @return	{Boolean}	<code>true</code> if the reading pane is "on"
 */
ZmMailListController.prototype.isReadingPaneOn =
function() {
	return (this._getReadingPanePref() != ZmSetting.RP_OFF);
};

/**
 * Checks if the reading pane is "on" right.
 * 
 * @return	{Boolean}	<code>true</code> if the reading pane is "on" right.
 */
ZmMailListController.prototype.isReadingPaneOnRight =
function() {
	return (this._getReadingPanePref() == ZmSetting.RP_RIGHT);
};

ZmMailListController.prototype._getReadingPanePref =
function() {
	return (this._readingPaneLoc || appCtxt.get(ZmSetting.READING_PANE_LOCATION));
};

ZmMailListController.prototype._setReadingPanePref =
function(value) {
	if (this.isSearchResults || appCtxt.isExternalAccount()) {
		this._readingPaneLoc = value;
	}
	else {
		appCtxt.set(ZmSetting.READING_PANE_LOCATION, value);
	}
};

ZmMailListController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_MAIL;
};

// We need to stay in sync with what's allowed by _resetOperations
// TODO: we should just find out if an operation was enabled via _resetOperations
ZmMailListController.prototype.handleKeyAction =
function(actionCode, ev) {
	DBG.println(AjxDebug.DBG3, "ZmMailListController.handleKeyAction");

    var lv = this._listView[this._currentViewId];
    var num = lv.getSelectionCount();

    var item;
    if (num == 1 && !this.isDraftsFolder()) {
        var sel = this._listView[this._currentViewId].getSelection();
        if (sel && sel.length) {
            item = sel[0];
        }
    }

    var folder = this._getSearchFolder();
	var isSyncFailures = this.isSyncFailuresFolder();
	var isDrafts = (item && item.isDraft && (item.type != ZmId.ITEM_CONV || item.numMsgs == 1)) || this.isDraftsFolder();
	var isFeed = (folder && folder.isFeed());
    var isExternalAccount = appCtxt.isExternalAccount();

	switch (actionCode) {

		case ZmKeyMap.FORWARD:
			if (!isDrafts && !isExternalAccount) {
				this._doAction({action:ZmOperation.FORWARD, foldersToOmit:ZmMailApp.getFoldersToOmit()});
			}
			break;

		case ZmKeyMap.GET_MAIL:
			this._checkMailListener();
			break;

		case ZmKeyMap.GOTO_INBOX:
		case ZmKeyMap.GOTO_DRAFTS:
		case ZmKeyMap.GOTO_JUNK:
		case ZmKeyMap.GOTO_SENT:
		case ZmKeyMap.GOTO_TRASH:
            if (isExternalAccount) { break; }
			if (actionCode == ZmKeyMap.GOTO_JUNK && !appCtxt.get(ZmSetting.SPAM_ENABLED)) { break; }
			this._folderSearch(ZmMailListController.ACTION_CODE_TO_FOLDER[actionCode]);
			break;

		case ZmKeyMap.MOVE_TO_INBOX:
		case ZmKeyMap.MOVE_TO_TRASH:
		case ZmKeyMap.MOVE_TO_JUNK:
			if (isSyncFailures || isExternalAccount) { break; }
			if (actionCode == ZmKeyMap.MOVE_TO_JUNK && !appCtxt.get(ZmSetting.SPAM_ENABLED)) { break; }
			if (num && !(isDrafts && actionCode != ZmKeyMap.MOVE_TO_TRASH)) {
			 	var folderId = ZmMailListController.ACTION_CODE_TO_FOLDER_MOVE[actionCode];
				folder = appCtxt.getById(folderId);
				var items = lv.getSelection();
				this._doMove(items, folder);
			}
			break;

		case ZmKeyMap.REPLY:
		case ZmKeyMap.REPLY_ALL:
			if (!isDrafts && !isExternalAccount && (num == 1) && !isSyncFailures && !isFeed) {
				this._doAction({action:ZmMailListController.ACTION_CODE_TO_OP[actionCode], foldersToOmit:ZmMailApp.getFoldersToOmit()});
			}
			break;

		case ZmKeyMap.SELECT_ALL:
			lv.selectAll(true);
			this._resetToolbarOperations();
			break;
	
		case ZmKeyMap.SPAM:
            if (isExternalAccount) { break; }
			if (num && !isDrafts && !isExternalAccount && !isSyncFailures && appCtxt.get(ZmSetting.SPAM_ENABLED) && (folder && !folder.isReadOnly())) {
				this._spamListener();
			}
			break;

		case ZmKeyMap.MUTE_UNMUTE_CONV:
            // Mute/Unmute Code removed for IM will be added for JP
			break;

        case ZmKeyMap.MARK_READ:
			if (this._isPermissionDenied(folder)) {
				break;
			}
			this._markReadListener();
			break;

		case ZmKeyMap.MARK_UNREAD:
			if (this._isPermissionDenied(folder)) {
				break;
			}
			this._markUnreadListener();
			break;

		case ZmKeyMap.FLAG:
			if (this._isPermissionDenied(folder)) {
				break;
			}
			this._doFlag(this.getItems());
			break;

		case ZmKeyMap.VIEW_BY_CONV:
			if (!isSyncFailures && appCtxt.get(ZmSetting.CONVERSATIONS_ENABLED)) {
				this.switchView(ZmId.VIEW_CONVLIST);
			}
			break;

		case ZmKeyMap.VIEW_BY_MSG:
			if (!isSyncFailures) {
				this.switchView(ZmId.VIEW_TRAD);
			}
			break;

		case ZmKeyMap.READING_PANE_BOTTOM:
		case ZmKeyMap.READING_PANE_RIGHT:
		case ZmKeyMap.READING_PANE_OFF:
			var menuId = ZmMailListController.ACTION_CODE_TO_MENU_ID[actionCode];
			this.switchView(menuId, true);
			this._updateViewMenu(menuId, this._readingPaneViewMenu);
			break;

		case ZmKeyMap.SHOW_FRAGMENT:
			if (num == 1) {
				var item = lv.getSelection()[0];
                if (!item) { break; }
                var id = lv._getFieldId(item, ZmItem.F_SUBJECT);
                var subjectField = document.getElementById(id);
                if (subjectField) {
                    var loc = Dwt.getLocation(subjectField);
					var frag;
					// TODO: refactor / clean up
					if ((item.type == ZmItem.MSG && item.isInvite() && item.needsRsvp()) ||
                        (item.type == ZmId.ITEM_CONV && this.getMsg() && this.getMsg().isInvite() && this.getMsg().needsRsvp()))
                    {
						frag = item.invite ? item.invite.getToolTip() : this.getMsg().invite.getToolTip();
					} else {
						frag = item.fragment ? item.fragment : ZmMsg.fragmentIsEmpty;
						if (frag != "") {
							frag = AjxStringUtil.htmlEncode(frag);
							lv.setToolTipContent(frag, true);
						}
					}
					var tooltip = this._shell.getToolTip();
					tooltip.popdown();
					if (frag != "") {
						tooltip.setContent(frag);
						tooltip.popup(loc.x, loc.y);
					}
				}
			}
			break;

		case ZmKeyMap.NEXT_UNREAD:
		case ZmKeyMap.PREV_UNREAD:
			this.lastListAction = actionCode;

		case ZmKeyMap.FIRST_UNREAD:
		case ZmKeyMap.LAST_UNREAD:
			var unreadItem = this._getUnreadItem(ZmMailListController.ACTION_CODE_WHICH[actionCode]);
			if (unreadItem) {
				this._selectItem(lv, unreadItem);
			}
			break;
	
		default:
			return ZmListController.prototype.handleKeyAction.apply(this, arguments);
	}
	return true;
};

ZmMailListController.prototype._isPermissionDenied =
function(folder) {
	var isExternalAccount = appCtxt.isExternalAccount();

	if (isExternalAccount || (folder && folder.isReadOnly())) {
		appCtxt.setStatusMsg(ZmMsg.errorPermission);
		return true;
	}
	return false;
};

ZmMailListController.prototype._selectItem =
function(listView, item) {
	listView._unmarkKbAnchorElement(true);
	listView.setSelection(item);
	var el = listView._getElFromItem(item);
	if (el) {
		listView._scrollList(el);
	}
};

ZmMailListController.prototype.mapSupported =
function(map) {
	return (map == "list");
};

/**
 * Sends the read receipt.
 * 
 * @param	{ZmMailMsg}		msg			the message
 */
ZmMailListController.prototype.sendReadReceipt =
function(msg) {

	if (!appCtxt.get(ZmSetting.MAIL_READ_RECEIPT_ENABLED) || msg.readReceiptSent || msg.isSent) {
		return;
	}

	var rrPref = appCtxt.get(ZmSetting.MAIL_SEND_READ_RECEIPTS);

	if (rrPref == ZmMailApp.SEND_RECEIPT_PROMPT) {
		var dlg = appCtxt.getYesNoMsgDialog();
		dlg.registerCallback(DwtDialog.YES_BUTTON, this._sendReadReceipt, this, [msg, dlg]);
		dlg.registerCallback(DwtDialog.NO_BUTTON, this._sendReadReceiptNotified, this, [msg, dlg]);
		dlg.setMessage(ZmMsg.readReceiptSend, DwtMessageDialog.WARNING_STYLE);
		dlg.popup();
	} else if (rrPref == ZmMailApp.SEND_RECEIPT_ALWAYS) {
		msg.readReceiptSent = true;
        this._sendReadReceipt(msg);
	}
};

ZmMailListController.prototype._sendReadReceipt =
function(msg, dlg) {
	if (dlg) {
		dlg.popdown();
	}
	msg.sendReadReceipt(this._handleSendReadReceipt.bind(this, msg));
};

ZmMailListController.prototype._handleSendReadReceipt =
function(msg) {
	appCtxt.setStatusMsg(ZmMsg.readReceiptSent);
    this._sendReadReceiptNotified(msg);
};

ZmMailListController.prototype._sendReadReceiptNotified =
function(msg, dlg) {
	var callback = dlg ? (new AjxCallback(dlg, dlg.popdown)) : null;
	var flags = msg.setFlag(ZmItem.FLAG_READ_RECEIPT_SENT, true);
	msg.list.flagItems({items:[msg], op:"update", value:flags, callback:callback});
};

ZmMailListController.prototype._updateViewMenu = function(id, menu) {

	var viewBtn = this.getCurrentToolbar().getButton(ZmOperation.VIEW_MENU);
	menu = menu || (viewBtn && viewBtn.getMenu());
	if (menu) {
		var mi = menu.getItemById(ZmOperation.MENUITEM_ID, id);
		if (mi) {
			mi.setChecked(true, true);
		}
	}

	// Create "Display" submenu here since it's only needed for multi-column
	if (!this._colHeaderViewMenu && this._mailListView.isMultiColumn()) {
		this._colHeaderViewMenu = this._setupColHeaderViewMenu(this._currentView, this._viewMenu);
	}

	if (this._colHeaderMenuItem && (id === ZmSetting.RP_OFF || id === ZmSetting.RP_BOTTOM || id === ZmSetting.RP_RIGHT)) {
		this._colHeaderMenuItem.setVisible(this._mailListView.isMultiColumn());
	}
};

// Private and protected methods

ZmMailListController.prototype._initialize =
function(view) {
	this._setActiveSearch(view);

	// call base class
	ZmListController.prototype._initialize.call(this, view);
};

ZmMailListController.prototype._initializeParticipantActionMenu =
function() {
	if (!this._participantActionMenu) {
		var menuItems = this._participantOps();
		menuItems.push(ZmOperation.SEP);
		var ops = this._getActionMenuOps();
		if (ops && ops.length) {
			menuItems = menuItems.concat(ops);
		}

		this._participantActionMenu = new ZmActionMenu({parent:this._shell, menuItems:menuItems, controller:this,
														context:this._currentViewId, menuType:ZmId.MENU_PARTICIPANT});
        if (appCtxt.get(ZmSetting.SEARCH_ENABLED)) {
            this._setSearchMenu(this._participantActionMenu);
        }
		this._addMenuListeners(this._participantActionMenu);
		this._participantActionMenu.addPopdownListener(this._menuPopdownListener);
		this._setupTagMenu(this._participantActionMenu);

		//notify Zimlet before showing 
		appCtxt.notifyZimlets("onParticipantActionMenuInitialized", [this, this._participantActionMenu]);
	}
	return this._participantActionMenu;
};

ZmMailListController.prototype._initializeDraftsActionMenu =
function() {
    if (!this._draftsActionMenu) {
		var menuItems = [
			ZmOperation.EDIT,
			ZmOperation.SEP,
			ZmOperation.TAG_MENU, ZmOperation.DELETE, ZmOperation.PRINT,
			ZmOperation.SEP,
			ZmOperation.SHOW_ORIG
		];
		this._draftsActionMenu = new ZmActionMenu({parent:this._shell, menuItems:menuItems,
												   context:this._currentViewId, menuType:ZmId.MENU_DRAFTS});
        if (appCtxt.get(ZmSetting.SEARCH_ENABLED)) {
            this._setSearchMenu(this._draftsActionMenu);
        }
		this._addMenuListeners(this._draftsActionMenu);
		this._draftsActionMenu.addPopdownListener(this._menuPopdownListener);
		this._setupTagMenu(this._draftsActionMenu);
		appCtxt.notifyZimlets("onDraftsActionMenuInitialized", [this, this._draftsActionMenu]);
	}
};

ZmMailListController.prototype._setDraftSearchMenu =
function(address, item, ev){
   if (address && appCtxt.get(ZmSetting.SEARCH_ENABLED) && (ev.field == ZmItem.F_PARTICIPANT || ev.field == ZmItem.F_FROM)){
        if (!this._draftsActionMenu.getOp(ZmOperation.SEARCH_MENU)) {
            ZmOperation.addOperation(this._draftsActionMenu, ZmOperation.SEARCH_MENU, [ZmOperation.SEARCH_MENU, ZmOperation.SEP], 0);
            this._setSearchMenu(this._draftsActionMenu);
        }
        if (item && (item.getAddresses(AjxEmailAddress.TO).getArray().length + item.getAddresses(AjxEmailAddress.CC).getArray().length) > 1){
            ZmOperation.setOperation(this._draftsActionMenu.getSearchMenu(), ZmOperation.SEARCH_TO, ZmOperation.SEARCH_TO, ZmMsg.findEmailToRecipients);
            ZmOperation.setOperation(this._draftsActionMenu.getSearchMenu(), ZmOperation.SEARCH, ZmOperation.SEARCH, ZmMsg.findEmailFromRecipients);
        }
        else{
            ZmOperation.setOperation(this._draftsActionMenu.getSearchMenu(), ZmOperation.SEARCH_TO, ZmOperation.SEARCH_TO, ZmMsg.findEmailToRecipient);
            ZmOperation.setOperation(this._draftsActionMenu.getSearchMenu(), ZmOperation.SEARCH, ZmOperation.SEARCH, ZmMsg.findEmailFromRecipient);
        }
     }
     else if (this._draftsActionMenu.getOp(ZmOperation.SEARCH_MENU)) {
            this._draftsActionMenu = null;
            this._initializeDraftsActionMenu();
     }
};

ZmMailListController.prototype._getToolBarOps =
function() {
	var list = [];
	list.push(ZmOperation.SEP);
	list = list.concat(this._msgOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._deleteOps());
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.MOVE_MENU);
	list.push(ZmOperation.TAG_MENU);
	return list;
};

ZmMailListController.prototype._getRightSideToolBarOps =
function() {
	if (appCtxt.isChildWindow) {
		return [];
	}
	return [ZmOperation.VIEW_MENU];
};


ZmMailListController.prototype._showDetachInSecondary =
function() {
	return true;
};

ZmMailListController.prototype._getSecondaryToolBarOps =
function() {

	var list = [],
		viewType = this.getCurrentViewType();

	list.push(ZmOperation.PRINT);
	list.push(ZmOperation.SEP);
	list = list.concat(this._flagOps());
	list.push(ZmOperation.SEP);
    list.push(ZmOperation.REDIRECT);
    list.push(ZmOperation.EDIT_AS_NEW);
    list.push(ZmOperation.SEP);
	list = list.concat(this._createOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._otherOps(true));
	if (viewType === ZmId.VIEW_TRAD) {
		list.push(ZmOperation.SHOW_CONV);
	}

	return list;
};


ZmMailListController.prototype._initializeToolBar =
function(view, className) {

	if (!this._toolbar[view]) {
		ZmListController.prototype._initializeToolBar.call(this, view, className);
		this._createViewMenu(view);
		this._setReplyText(this._toolbar[view]);
//		this._toolbar[view].addOp(ZmOperation.FILLER);
		if (!appCtxt.isChildWindow) {
			this._initializeNavToolBar(view);
		}
	}

	if (!appCtxt.isChildWindow) {
		this._setupViewMenu(view);
	}
	this._setupDeleteButton(this._toolbar[view]);
	if (appCtxt.get(ZmSetting.SPAM_ENABLED)) {
		this._setupSpamButton(this._toolbar[view]);
	}
    this._setupPrintButton(this._toolbar[view]);
};

ZmMailListController.prototype._getNumTotal =
function(){
	// Yuck, remove "of Total" from Nav toolbar at lower resolutions
	if (AjxEnv.is1024x768orLower) {
		 return null;
	}
	return ZmListController.prototype._getNumTotal.call(this);
};

ZmMailListController.prototype._initializeActionMenu =
function() {
	var isInitialized = (this._actionMenu != null);
	ZmListController.prototype._initializeActionMenu.call(this);

	if (this._actionMenu) {
		this._setupSpamButton(this._actionMenu);
	}
	//notify Zimlet before showing
	appCtxt.notifyZimlets("onActionMenuInitialized", [this, this._actionMenu]);
};

// Groups of mail-related operations

ZmMailListController.prototype._flagOps =
function() {
	return [ZmOperation.MARK_READ, ZmOperation.MARK_UNREAD, ZmOperation.FLAG, ZmOperation.UNFLAG];
};

ZmMailListController.prototype._msgOps =
function() {
	var list = [];

	list.push(ZmOperation.EDIT); // hidden except for Drafts

	if (appCtxt.get(ZmSetting.REPLY_MENU_ENABLED)) {
		list.push(ZmOperation.REPLY, ZmOperation.REPLY_ALL);
	}

	if (appCtxt.get(ZmSetting.FORWARD_MENU_ENABLED)) {
		list.push(ZmOperation.FORWARD);
	}
	return list;
};

ZmMailListController.prototype._deleteOps =
function() {
	return [this.getDeleteOperation(), ZmOperation.SPAM];
};

ZmMailListController.prototype._createOps =
function() {
	var list = [];
	if (appCtxt.get(ZmSetting.FILTERS_ENABLED)) {
		list.push(ZmOperation.ADD_FILTER_RULE);
	}
	if (appCtxt.get(ZmSetting.CALENDAR_ENABLED)) {
		list.push(ZmOperation.CREATE_APPT);
	}
	if (appCtxt.get(ZmSetting.TASKS_ENABLED)) {
		list.push(ZmOperation.CREATE_TASK);
	}
	//list.push(ZmOperation.QUICK_COMMANDS);
	return list;
};

ZmMailListController.prototype._otherOps =
function(isSecondary) {
	var list = [];
	if (!appCtxt.isChildWindow && (!isSecondary || this._showDetachInSecondary()) && appCtxt.get(ZmSetting.DETACH_MAILVIEW_ENABLED) && !appCtxt.isExternalAccount()) {
		list.push(ZmOperation.DETACH);
	}
	list.push(ZmOperation.SHOW_ORIG);
	return list;
};



ZmMailListController.prototype.getDeleteOperation =
function() {
	return ZmOperation.DELETE;
};

ZmMailListController.prototype._setActiveSearch =
function(view) {
	// save info. returned by search result
	if (this._activeSearch) {
		if (this._list) {
			this._list.setHasMore(this._activeSearch.getAttribute("more"));
		}
		if (this._listView[view]) {
			this._listView[view].offset = parseInt(this._activeSearch.getAttribute("offset"));
		}
	}
};


/**
 * checks whether some of the selected messages are read and unread. returns it as a 2 flag object with "hasRead" and "hasUnread" attributes.
 *
 * @private
 */
ZmMailListController.prototype._getReadStatus =
function() {

	var status = {hasRead : false, hasUnread : false}

	// dont bother checking for read/unread state for read-only folders
	var folder = this._getSearchFolder();
	if (folder && folder.isReadOnly()) {
		return status;
	}

	var items = this.getItems();

	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		// TODO: refactor / clean up
		if (item.type == ZmItem.MSG) {
			status[item.isUnread ? "hasUnread" : "hasRead"] = true;
			status[item.isFlagged ? "hasFlagged" : "hasUnflagged"] = true;
		}
		else if (item.type == ZmItem.CONV) {
			status.hasUnread = status.hasUnread || item.hasFlag(ZmItem.FLAG_UNREAD, true);
			status.hasRead = status.hasRead || item.hasFlag(ZmItem.FLAG_UNREAD, false);
			status.hasUnflagged = status.hasUnflagged || item.hasFlag(ZmItem.FLAG_FLAGGED, false);
			status.hasFlagged = status.hasFlagged || item.hasFlag(ZmItem.FLAG_FLAGGED, true);
		}
		if (status.hasUnread && status.hasRead) {
			break;
		}
	}

	return status;
};


ZmMailListController.prototype._getConvMuteStatus =
function() {
	var items = this.getItems();
    var status = {
                    hasMuteConv: false,
                    hasUnmuteConv: false
                },
        item,
        i;
    for (i=0; i<items.length; i++) {
        item = items[i];
        if (item.isMute) {
            status.hasMuteConv = true;
        }
        else {
            status.hasUnmuteConv = true;
        }
    }
    return status;
};

/**
 * Dynamically enable/disable the mark read/unread menu items.
 *
 * @private
 */
ZmMailListController.prototype._enableReadUnreadToolbarActions =
function() {
	var menu = this.getCurrentToolbar().getActionsMenu();
	this._enableFlags(menu);
};

ZmMailListController.prototype._enableMuteUnmuteToolbarActions =
function() {
	var menu = this.getCurrentToolbar().getActionsMenu();
	this._enableMuteUnmute(menu);
};

ZmMailListController.prototype._actionsButtonListener =
function(ev) {
	this._enableReadUnreadToolbarActions();
	this._enableMuteUnmuteToolbarActions();
	ZmBaseController.prototype._actionsButtonListener.call(this, ev);
};

// List listeners

ZmMailListController.prototype._listSelectionListener =
function(ev) {
	// offline: when opening a message in Outbox, move it to the appropriate
	// account's Drafts folder first
	var search = appCtxt.getCurrentSearch();
	if (appCtxt.isOffline &&
		ev.detail == DwtListView.ITEM_DBL_CLICKED &&
		ev.item && ev.item.isDraft &&
		search && search.folderId == ZmFolder.ID_OUTBOX)
	{
		var account = ev.item.account || ZmOrganizer.parseId(ev.item.id).account;
		var folder = appCtxt.getById(ZmOrganizer.getSystemId(ZmFolder.ID_DRAFTS, account));
		this._list.moveItems({items:[ev.item], folder:folder});
		return false;
	}
	var folderId = ev.item.folderId || (search && search.folderId);
	var folder = folderId && appCtxt.getById(folderId);

	if (ev.field === ZmItem.F_FLAG && this._isPermissionDenied(folder)) {
		return true;
	}
	if (ev.field === ZmItem.F_READ) {
		if (!this._isPermissionDenied(folder)) {
			this._doMarkRead([ev.item], ev.item.isUnread);
		}
		return true;
	}
	else {
		return ZmListController.prototype._listSelectionListener.apply(this, arguments);
	}
};

// Based on context, enable read/unread operation, add/edit contact.
ZmMailListController.prototype._listActionListener =
function(ev) {

	ZmListController.prototype._listActionListener.call(this, ev);

	var items = this._listView[this._currentViewId].getSelection();
	var folder = this._getSearchFolder();

	// bug fix #3602
	var address = (appCtxt.get(ZmSetting.CONTACTS_ENABLED) && ev.field == ZmItem.F_PARTICIPANT)
		? ev.detail
		: ((ev.item && ev.item.isZmMailMsg) ? ev.item.getAddress(AjxEmailAddress.FROM) : null);

	var email = address && address.getAddress();

	var item = (items && items.length == 1) ? items[0] : null;
	if (this.isDraftsFolder() || (item && item.isDraft && (item.type != ZmId.ITEM_CONV || item.numMsgs == 1))) { //note that we never treat a conversation as a draft for actions. See also bug 64494
		// show drafts menu
		this._initializeDraftsActionMenu();
        this._setDraftSearchMenu(address, item, ev);
        if (address)
            this._actionEv.address = address;
		this._setTagMenu(this._draftsActionMenu);
        this._resetOperations(this._draftsActionMenu, items.length);
		appCtxt.notifyZimlets("onMailActionMenuResetOperations", [this, this._draftsActionMenu]);
		this._draftsActionMenu.popup(0, ev.docX, ev.docY);
	}
	else if (!appCtxt.isExternalAccount() && email && items.length == 1 &&
			(appCtxt.get(ZmSetting.CONTACTS_ENABLED) && (ev.field == ZmItem.F_PARTICIPANT || ev.field == ZmItem.F_FROM)))
	{
		// show participant menu
		this._initializeParticipantActionMenu();
		this._setTagMenu(this._participantActionMenu);
		this._actionEv.address = address;
		this._setupSpamButton(this._participantActionMenu);
		this._resetOperations(this._participantActionMenu, items.length);
		appCtxt.notifyZimlets("onMailActionMenuResetOperations", [this, this._participantActionMenu]);
		this._enableFlags(this._participantActionMenu);
		this._enableMuteUnmute(this._participantActionMenu);
		var imItem = this._participantActionMenu.getOp(ZmOperation.IM);
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		if (contactsApp) {
			this._loadContactForMenu(this._participantActionMenu, address, ev, imItem);
		}
		else if (imItem) {
			// since contacts app is disabled, we won't be making a server call
			ZmImApp.updateImMenuItemByAddress(imItem, address, true);
			this._participantActionMenu.popup(0, ev.docX, ev.docY);
		}
	}
    else if (this.isOutboxFolder()) {
        // show drafts menu
        //this._initializeOutboxsActionMenu();
    } else {
		var actionMenu = this.getActionMenu();
		this._setupSpamButton(actionMenu);
		this._enableFlags(actionMenu);
		this._enableMuteUnmute(actionMenu);
		appCtxt.notifyZimlets("onMailActionMenuResetOperations", [this, actionMenu]);
		actionMenu.popup(0, ev.docX, ev.docY);
		if (ev.ersatz) {
			// menu popped up via keyboard nav
			actionMenu.setSelectedItem(0);
		}
	}

    if (!folder) {
        //might have come from searching on sent items and want to stay in search sent view (i.e. recipient instead of sender)
        folder = this._getActiveSearchFolder();
    }

    if (folder && (folder.nId == ZmFolder.ID_SENT  &&
                  (this._participantActionMenu && this._participantActionMenu.getOp(ZmOperation.SEARCH_MENU)))) {
        if (item && (item.getAddresses(AjxEmailAddress.TO).getArray().length + item.getAddresses(AjxEmailAddress.CC).getArray().length) > 1){
            ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH_TO, ZmOperation.SEARCH_TO, ZmMsg.findEmailToRecipients);
            ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH, ZmOperation.SEARCH, ZmMsg.findEmailFromRecipients);
        }
        else{
            ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH_TO, ZmOperation.SEARCH_TO, ZmMsg.findEmailToRecipient);
            ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH, ZmOperation.SEARCH, ZmMsg.findEmailFromRecipient);
        }
    }
    else if (this._participantActionMenu && this._participantActionMenu.getOp(ZmOperation.SEARCH_MENU)) {
        ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH_TO, ZmOperation.SEARCH_TO, ZmMsg.findEmailToSender);
        ZmOperation.setOperation(this._participantActionMenu.getSearchMenu(), ZmOperation.SEARCH, ZmOperation.SEARCH, ZmMsg.findEmailFromSender);
    }
};

// Operation listeners

ZmMailListController.prototype._markReadListener =
function(ev) {
	var callback = this._getMarkReadCallback();
	this._doMarkRead(this._listView[this._currentViewId].getSelection(), true, callback);
};

ZmMailListController.prototype._showOrigListener =
function() {
	var msg = this.getMsg();
	if (!msg) { return; }

	setTimeout(this._showMsgSource.bind(this, msg), 100); // Other listeners are focusing the main window, so delay the window opening for just a bit
};

ZmMailListController.prototype._showMsgSource =
function(msg) {
	var msgFetchUrl = appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI) + "&view=text&id=" + msg.id + (msg.partId ? "&part=" + msg.partId : "");

	// create a new window w/ generated msg based on msg id
	window.open(msgFetchUrl, "_blank", "menubar=yes,resizable=yes,scrollbars=yes");
};


/**
 * Per bug #7257, read receipt must be sent if user explicitly marks a message
 * read under the following conditions:
 *
 * 0. read receipt is requested, user agrees to send it
 * 1. reading pane is on
 * 2. mark as read preference is set to "never"
 * 3. the message currently being read in the reading pane is in the list of
 *    convs/msgs selected for mark as read
 *
 * If all these conditions are met, a callback to run sendReadReceipt() is returned.
 * 
 * @private
 */
ZmMailListController.prototype._getMarkReadCallback =
function() {
	var view = this._listView[this._currentViewId];
	var items = view.getSelection();

	if (this.isReadingPaneOn() && appCtxt.get(ZmSetting.MARK_MSG_READ) == -1) {
		// check if current message being read is the message in the selection list
		var msg = view.parent.getItemView && view.parent.getItemView().getItem();
		if (msg && msg.readReceiptRequested) {
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var itemId = (item.id < 0) ? (item.id * (-1)) : item.id;
				if (itemId == msg.id) {
					return this.sendReadReceipt.bind(this, msg);
				}
			}
		}
	}
	return null;
};

ZmMailListController.prototype._markUnreadListener =
function(ev) {

	appCtxt.killMarkReadTimer();

	this._doMarkRead(this._listView[this._currentViewId].getSelection(), false);
};

/**
 * flags or unflags (based on the status of the first item. See doFlag)
 * @param ev
 * @private
 */
ZmMailListController.prototype._flagListener =
function(on) {
	this._doFlag(this._listView[this._currentViewId].getSelection(), on);
};


ZmMailListController.prototype._replyListener =
function(ev) {
	var action = ev.item.getData(ZmOperation.KEY_ID);
	if (!action || action == ZmOperation.REPLY_MENU) {
		action = ZmOperation.REPLY;
	}

	this._doAction({ev: ev, action: action, foldersToOmit: ZmMailApp.getReplyFoldersToOmit()});
};

ZmMailListController.prototype._forwardListener =
function(ev) {
	var action = ev.item.getData(ZmOperation.KEY_ID);
	this._doAction({ev: ev, action: action, foldersToOmit: ZmMailApp.getReplyFoldersToOmit()});
};

ZmMailListController.prototype._forwardConvListener = function(ev) {
	this._doAction({ev: ev, action: ZmOperation.FORWARD_CONV, foldersToOmit: ZmMailApp.getReplyFoldersToOmit()});
};

// This method may be called with a null ev parameter
ZmMailListController.prototype._doAction =
function(params) {

	// get msg w/ addrs to select identity from - don't load it yet (no callback)
	// for special handling of multiple forwarded messages, see _handleResponseDoAction
	var msg = params.msg || this.getMsg(params);
	if (!msg) {
		return;
	}

	// use resolved msg to figure out identity/persona to use for compose
	var collection = appCtxt.getIdentityCollection();
	var identity = collection.selectIdentity(msg);

	var action = params.action;
	if (!action || action == ZmOperation.FORWARD_MENU || action == ZmOperation.FORWARD)	{
		params.origAction = action;
		action = params.action = (appCtxt.get(ZmSetting.FORWARD_INCLUDE_ORIG) == ZmSetting.INC_ATTACH)
			? ZmOperation.FORWARD_ATT : ZmOperation.FORWARD_INLINE;

		if (msg.isInvite()) {
			action = params.action = ZmOperation.FORWARD_ATT;
		}
	}
	if (action === ZmOperation.FORWARD_CONV) {
		params.origAction = action;
		// need to remember conv since a single right-clicked item has its selection cleared when
		// the action menu is popped down during the request to load the conv
		var selection = this.getSelection();
		params.conv = selection && selection.length === 1 ? selection[0] : null;
		action = params.action = ZmOperation.FORWARD_ATT;
	}

	// if html compose is allowed and if opening draft always request html
	//   otherwise check if user prefers html or
	//   msg hasn't been loaded yet and user prefers format of orig msg
	var htmlEnabled = appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED);
	var prefersHtml = (appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT) == ZmSetting.COMPOSE_HTML);
	var sameFormat = appCtxt.get(ZmSetting.COMPOSE_SAME_FORMAT);
	params.getHtml = (htmlEnabled && (action == ZmOperation.DRAFT || (prefersHtml || (!msg._loaded && sameFormat))));
	if (action == ZmOperation.DRAFT) {
		params.listController = this;
		//always reload the draft msg except offline created msg
        if (!msg.isOfflineCreated) {
            params.forceLoad = true;
        }
	}

	// bug: 38928 - if user viewed entire truncated message, fetch the whole
	// thing when replying/forwarding
	if (action != ZmOperation.NEW_MESSAGE && action != ZmOperation.DRAFT && msg.viewEntireMessage) {
		params.noTruncate = true;
		params.forceLoad = true;
	}

	if (action == ZmOperation.DRAFT || action == ZmOperation.FORWARD_INLINE ||
            action == ZmOperation.REPLY || action == ZmOperation.REPLY_ALL) {
		var bp = msg.getBodyPart();
		if ((bp && bp.isTruncated) || !msg._loaded) {
			params.noTruncate = true;
			params.forceLoad = true;
		}
	}

	if (params.msg) {
		this._handleResponseDoAction(params, params.msg);
	}
	else {
		var respCallback = this._handleResponseDoAction.bind(this, params);
		// TODO: pointless to load msg when forwarding as att
		this._getLoadedMsg(params, respCallback);
	}
};

ZmMailListController.prototype._handleResponseDoAction =
function(params, msg, finalChoice) {

	if (!msg) { return; }

	msg._instanceDate = params.instanceDate;

	params.inNewWindow = (!appCtxt.isChildWindow && this._app._inNewWindow(params.ev));

    if (msg.list && msg.isUnread && !appCtxt.getById(msg.folderId).isReadOnly()) {
        msg.list.markRead({items:[msg], value:true});
    }

	// check to see if we're forwarding multiple msgs, in which case we do them as attachments;
	// also check to see if we're forwarding an invite; if so, go to appt compose
	var action = params.action;
	if (action == ZmOperation.FORWARD_ATT || action == ZmOperation.FORWARD_INLINE) {
		var selection, selCount;
		if (params.msg) {
			selCount = 1
		}
		else {
			var cview = this._listView[this._currentViewId];
			if (cview) {
				selection = params.conv ? [ params.conv ] : cview.getSelection();
				selCount = params.conv ? 1 : selection.length;

				/*
					Bug 106342 - Forwarding invite shows html source in the body
					Refer to last selected list item before deciding compose action. Selection is lost when context-menu is destroyed and there is no way
					to find out which list item was selected. By default we fall back to mail compose view but in case of invite we need appt compose view.
				*/
				if (selCount === 0 && msg.isInvite() && cview.getSelection().length === 0) {
					selection = this._lastSelectedListItem;

					// Mutate the selCount only if we find any lastSelectedListItem, else it opens as a regular mail compose view.
					if (selection) {
						selCount = selection.length;
					}
				}
			}
		}
		// bug 43428 - invitation should be forwarded using appt forward view
		if (selCount == 1 && msg.forwardAsInvite()) {
			var ac = window.parentAppCtxt || window.appCtxt;
			if (ac.get(ZmSetting.CALENDAR_ENABLED)) {
				var controller = ac.getApp(ZmApp.CALENDAR).getCalController();
				controller.forwardInvite(msg);
				if (appCtxt.isChildWindow) {
					window.close();
				}
				return;
			}
		}

		// forward multiple msgs as attachments
		if (selCount > 1 || params.origAction === ZmOperation.FORWARD_CONV || action === ZmOperation.FORWARD_ATT) {
			action = params.action = ZmOperation.FORWARD_ATT;
			this._handleLoadMsgs(params, selection);
			return;
		}
	}
	else if (appCtxt.isOffline && action == ZmOperation.DRAFT) {
		var folder = appCtxt.getById(msg.folderId);
		params.accountName = folder && folder.getAccount().name;
	}
	else if (action == ZmOperation.DECLINE_PROPOSAL) {
		params.subjOverride = this._getInviteReplySubject(action) + msg.subject;
	}

	params.msg = msg;
	AjxDispatcher.run("Compose", params);
};


ZmMailListController.prototype._redirectListener =
function(ev) {

    var action = ev.item.getData(ZmOperation.KEY_ID);
    var msg = this.getMsg({ev:ev, action:action});
    if (!msg) return;

    var redirectDialog = appCtxt.getMailRedirectDialog();
    var redirectDialogCB = this._redirectCallback.bind(this, msg);
    ZmController.showDialog(redirectDialog, redirectDialogCB);
};


ZmMailListController.prototype._redirectCallback =
function(msg) {
	if (!msg) return;

	var redirectDialog = appCtxt.getMailRedirectDialog();
	var addrs = redirectDialog.getAddrs();
	// Code copied from ZmComposeView.  Should consolidate along with the
	// ZmRecipient code, i.e. the corresponding recipient controller code.
	if (addrs.gotAddress) {
        if (addrs[ZmRecipients.BAD].size()) {
            // Any bad addresses?  If there are bad ones, ask the user if they want to send anyway.
            var bad = AjxStringUtil.htmlEncode(addrs[ZmRecipients.BAD].toString(AjxEmailAddress.SEPARATOR));
            var badMsg = AjxMessageFormat.format(ZmMsg.compBadAddresses, bad);
            var cd = appCtxt.getOkCancelMsgDialog();
            cd.reset();
            cd.setMessage(badMsg, DwtMessageDialog.WARNING_STYLE);
            cd.registerCallback(DwtDialog.OK_BUTTON, this._badRedirectAddrsOkCallback, this, [addrs, cd, msg]);
            cd.registerCallback(DwtDialog.CANCEL_BUTTON, this._badRedirectAddrsCancelCallback, this, cd);
            cd.setVisible(true); // per fix for bug 3209
            cd.popup();
        } else {
            redirectDialog.popdown();
            msg.redirect(addrs, this._handleSendRedirect.bind(this));
         }
    } else {
        redirectDialog.popdown();
    }
};

// User has agreed to send message with bad addresses
ZmMailListController.prototype._badRedirectAddrsOkCallback =
function(addrs, dialog, msg) {
    dialog.popdown();
    appCtxt.getMailRedirectDialog().popdown();
    msg.redirect(addrs, this._handleSendRedirect.bind(this));
};


// User has declined to send message with bad addresses - popdown the bad addr dialog,
// returning to the redirect dialog
ZmMailListController.prototype._badRedirectAddrsCancelCallback =
function(dialog) {
    dialog.popdown();
};

ZmMailListController.prototype._handleLoadMsgs =
function(params, selection) {

	var msgIds = new AjxVector(),
		foldersToOmit = params.foldersToOmit || {};

	for (var i = 0; i < selection.length; i++) {
		var item = selection[i];
		if (item.type == ZmItem.CONV) {
			for (var j = 0; j < item.msgIds.length; j++) {
				var msgId = item.msgIds[j];
				if (!foldersToOmit[item.msgFolder[msgId]]) {
					msgIds.add(msgId);
				}
			}
		}
		else {
			if (!msgIds.contains(item.id)) {
				msgIds.add(item.id);
			}
		}
	}
	params.msgIds = msgIds.getArray();
    params.selectedMessages = selection;

	AjxDispatcher.run("Compose", params);
};

ZmMailListController.prototype._handleSendRedirect =
function() {
    appCtxt.setStatusMsg(ZmMsg.redirectSent, ZmStatusView.LEVEL_INFO, null);
};

/**
 * Marks a mail item read if appropriate, possibly after a delay. An arg can be passed so that this function
 * just returns whether the item can be marked read now, which typically results in the setting of the "read"
 * flag in a retrieval request to the server. After that, it can be called without that arg in order to mark
 * the item read after a delay if necessary.
 * 
 * @param {ZmMailItem}	item		msg or conv
 * @param {boolean}		check		if true, return true if msg can be marked read now, without marking it read
 */
ZmMailListController.prototype._handleMarkRead =
function(item, check) {

	var convView = this._convView;
	var waitOnMarkRead = convView && convView.isWaitOnMarkRead();
	if (item && item.isUnread && !waitOnMarkRead) {
		if (!item.isReadOnly() && !appCtxt.isExternalAccount()) {
			var markRead = appCtxt.get(ZmSetting.MARK_MSG_READ);
			if (markRead == ZmSetting.MARK_READ_NOW) {
				if (check) {
					return true;
				}
				else {
					// msg was cached as unread, mark it read now
					this._doMarkRead([item], true);
				}
			} else if (markRead > 0) {
				if (!appCtxt.markReadAction) {
					appCtxt.markReadAction = new AjxTimedAction(this, this._markReadAction);
				}
				appCtxt.markReadAction.args = [item];
				appCtxt.markReadActionId = AjxTimedAction.scheduleAction(appCtxt.markReadAction, markRead * 1000);
			}
		}
	}
	return false;
};

ZmMailListController.prototype._markReadAction =
function(msg) {
	this._doMarkRead([msg], true);
};

ZmMailListController.prototype._doMarkRead =
function(items, on, callback, forceCallback) {

	var params = {items:items, value:on, callback:callback, noBusyOverlay: true};
	var list = params.list = this._getList(params.items);
    params.forceCallback = forceCallback;
	this._setupContinuation(this._doMarkRead, [on, callback], params);
	list.markRead(params);
};

ZmMailListController.prototype._doMarkMute =
function(items, on, callback, forceCallback) {

	var params = {items:items, value:on, callback:callback};
	var list = params.list = this._getList(params.items);
    params.forceCallback = forceCallback;
	this._setupContinuation(this._doMarkMute, [on, callback], params);
	list.markMute(params);
};

/**
* Marks the given items as "spam" or "not spam". Items marked as spam are moved to
* the Junk folder. If items are being moved out of the Junk folder, they will be
* marked "not spam", and the destination folder may be provided. It defaults to Inbox
* if not present.
*
* @param items			[Array]			a list of items to move
* @param markAsSpam		[boolean]		spam or not spam
* @param folder			[ZmFolder]		destination folder
*/
ZmMailListController.prototype._doSpam =
function(items, markAsSpam, folder) {

	this._listView[this._currentViewId]._itemToSelect = this._getNextItemToSelect();
	items = AjxUtil.toArray(items);

	var params = {items:items,
					markAsSpam:markAsSpam,
					folder:folder,
					childWin:appCtxt.isChildWindow && window,
					closeChildWin: appCtxt.isChildWindow};

	var allDoneCallback = this._getAllDoneCallback();
	var list = params.list = this._getList(params.items);
	this._setupContinuation(this._doSpam, [markAsSpam, folder], params, allDoneCallback);
	list.spamItems(params);
};

ZmMailListController.prototype._inviteReplyHandler =
function(ev) {
	var ac = window.parentAppCtxt || window.appCtxt;

	this._listView[this._currentViewId]._itemToSelect = this._getNextItemToSelect();
	ac.getAppController().focusContentPane();

	var type = ev._inviteReplyType;
	if (type == ZmOperation.PROPOSE_NEW_TIME ) {
		ac.getApp(ZmApp.CALENDAR).getCalController().proposeNewTime(ev._msg);
		if (appCtxt.isChildWindow) {
			window.close();
		}
	}
	else if (type == ZmOperation.ACCEPT_PROPOSAL) {
		this._acceptProposedTime(ev._inviteComponentId, ev._msg);
	}
	else if (type == ZmOperation.DECLINE_PROPOSAL) {
		this._declineProposedTime(ev._inviteComponentId, ev._msg);
	}
	else if (type == ZmOperation.INVITE_REPLY_ACCEPT ||
			type == ZmOperation.EDIT_REPLY_CANCEL ||
			type == ZmOperation.INVITE_REPLY_DECLINE ||
			type == ZmOperation.INVITE_REPLY_TENTATIVE)
	{
		this._editInviteReply(ZmMailListController.INVITE_REPLY_MAP[type], ev._inviteComponentId, null, null, ev._inviteReplyFolderId);
	}
	else {
		var callback = new AjxCallback(this, this._handleInviteReplySent);
		var accountName = ac.multiAccounts && ac.accountList.mainAccount.name;
		this._sendInviteReply(type, ev._inviteComponentId, null, accountName, null, ev._msg, ev._inviteReplyFolderId, callback);
	}
	return false;
};

ZmMailListController.prototype._handleInviteReplySent =
function(result, newPtst) {
	var inviteMsgView = this.getCurrentView().getInviteMsgView();
	if (!inviteMsgView || !newPtst) {
		return;
	}
	inviteMsgView.enableToolbarButtons(newPtst);
	inviteMsgView.updatePtstMsg(newPtst);
};

ZmMailListController.prototype._shareHandler =
function(ev) {
	var msg = this.getMsg();
	var fromAddr = msg ? msg.getAddress(AjxEmailAddress.FROM).address : null;

	if (ev._buttonId == ZmOperation.SHARE_ACCEPT) {
		var acceptDialog = appCtxt.getAcceptShareDialog();
		acceptDialog.setAcceptListener(this._acceptShareListener);
		acceptDialog.popup(ev._share, fromAddr);
	} else if (ev._buttonId == ZmOperation.SHARE_DECLINE) {
		var declineDialog = appCtxt.getDeclineShareDialog();
		declineDialog.setDeclineListener(this._declineShareListener);
		declineDialog.popup(ev._share, fromAddr);
	}
};

ZmMailListController.prototype._subscribeHandler =
function(ev) {
	var req = ev._subscribeReq;
	var statusMsg;
	var approve = false;
	if (ev._buttonId == ZmOperation.SUBSCRIBE_APPROVE) {
		statusMsg = req.subscribe ? ZmMsg.dlSubscribeRequestApproved : ZmMsg.dlUnsubscribeRequestApproved;
		approve = true;
	}
	else if (ev._buttonId == ZmOperation.SUBSCRIBE_REJECT) {
		statusMsg = req.subscribe ? ZmMsg.dlSubscribeRequestRejected : ZmMsg.dlUnsubscribeRequestRejected;
	}

	var jsonObj = {
		DistributionListActionRequest: {
			_jsns: "urn:zimbraAccount",
			dl: {by: "name",
				 _content: req.dl.email
			},
			action: {op: approve ? "acceptSubsReq" : "rejectSubsReq",
					 subsReq: {op: req.subscribe ? "subscribe" : "unsubscribe",
							   _content: req.user.email
					 		  }
					}
		}
	};
	var respCallback = this._subscribeResponseHandler.bind(this, statusMsg);
	appCtxt.getAppController().sendRequest({jsonObj: jsonObj, asyncMode: true, callback: respCallback});

	

};

ZmMailListController.prototype._subscribeResponseHandler =
function(statusMsg, ev) {
	var msg = this.getMsg();
	this._removeActionMsg(msg);
	appCtxt.setStatusMsg(statusMsg);
};


ZmMailListController.prototype._acceptShareHandler =
function(ev) {
	var msg = appCtxt.getById(ev._share._msgId);
	this._removeActionMsg(msg);
};

ZmMailListController.prototype._removeActionMsg =
function(msg) {
	var folder = appCtxt.getById(ZmFolder.ID_TRASH);

	this._listView[this._currentViewId]._itemToSelect = this._getNextItemToSelect();
	var list = msg.list || this.getList();
	var callback = (appCtxt.isChildWindow)
		? (new AjxCallback(this, this._handleAcceptShareInNewWindow)) : null;
	list.moveItems({items: [msg], folder: folder, callback: callback, closeChildWin: appCtxt.isChildWindow});
};

ZmMailListController.prototype._declineShareHandler = ZmMailListController.prototype._acceptShareHandler;

ZmMailListController.prototype._handleAcceptShareInNewWindow =
function() {
	window.close();
};

ZmMailListController.prototype._createViewMenu =
function(view) {
	var btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
	if (!btn) { return; }

	btn.setMenu(new AjxCallback(this, this._setupViewMenuItems, [view, btn]));
	btn.noMenuBar = true;
};


ZmMailListController.prototype._setupViewMenu =
function(view) {

	// always reset the view menu button icon to reflect the current view
	var btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
	if (btn) {
		var viewType = appCtxt.getViewTypeFromId(view);
		btn.setImage(ZmMailListController.GROUP_BY_ICON[viewType]);
	}
};

ZmMailListController.prototype._setupViewMenuItems =
function(view, btn) {

	var menu = this._viewMenu = new ZmPopupMenu(btn, null, null, this);
	btn.setMenu(menu);
    var isExternalAccount = appCtxt.isExternalAccount(),
	    convsEnabled = appCtxt.get(ZmSetting.CONVERSATIONS_ENABLED);

	if (convsEnabled && this.supportsGrouping()) {
		this._setupGroupByMenuItems(view, menu);
	}
	if (menu.getItemCount() > 0) {
		new DwtMenuItem({
			parent: menu,
			style:  DwtMenuItem.SEPARATOR_STYLE
		});
	}
	this._readingPaneViewMenu = this._setupReadingPaneMenu(view, menu);
	if (!isExternalAccount && convsEnabled) {
		this._convOrderViewMenu = this._setupConvOrderMenu(view, menu);
	}

    // add sort and group by menus only if we have headers (not in standalone conv view)
    if (this.supportsSorting()) {
	    this._sortViewMenu = this._setupSortViewMenu(view, menu);
	    this._groupByViewMenu = this._mailListView._getGroupByActionMenu(menu, true, true);
    }

	return menu;
};

ZmMailListController.prototype._setupSortViewMenu = function(view, menu) {

	var	sortMenuItem = menu.createMenuItem(Dwt.getNextId("SORT_"), {
			text:           ZmMsg.sortBy,
			style:          DwtMenuItem.NO_STYLE
		}),
		sortMenu = this._mailListView._setupSortMenu(sortMenuItem, false);

	sortMenuItem.setMenu(sortMenu);

	return sortMenu;
};

ZmMailListController.prototype._setupColHeaderViewMenu = function(view, menu) {

	var	colHeaderMenuItem = this._colHeaderMenuItem = menu.createMenuItem(Dwt.getNextId("COL_HEADER_"), {
			text:           ZmMsg.display,
			style:          DwtMenuItem.NO_STYLE
		}),
		colHeaderMenu = ZmListView.prototype._getActionMenuForColHeader.call(this._mailListView, true, colHeaderMenuItem, "view");

	colHeaderMenuItem.setMenu(colHeaderMenu);

	return colHeaderMenu;
};

// If we're in the Trash or Junk folder, change the "Delete" button tooltip
ZmMailListController.prototype._setupDeleteButton =
function(parent) {
	var folder = this._getSearchFolder();
	var inTrashFolder = (folder && folder.nId == ZmFolder.ID_TRASH);
    var inJunkFolder =  (folder && folder.nId == ZmFolder.ID_SPAM);
    var deleteButton = parent.getButton(ZmOperation.DELETE);
	var deleteMenuButton = parent.getButton(ZmOperation.DELETE_MENU);
	var tooltip = (inTrashFolder || inJunkFolder) ? ZmMsg.deletePermanentTooltip : ZmMsg.deleteTooltip;
	if (deleteButton) {
		deleteButton.setToolTipContent(ZmOperation.getToolTip(ZmOperation.DELETE, this.getKeyMapName(), tooltip), true);
	}
	if (deleteMenuButton) {
		deleteMenuButton.setToolTipContent(ZmOperation.getToolTip(ZmOperation.DELETE_MENU, this.getKeyMapName(), tooltip), true);
	}
};

// If we're in the Spam folder, the "Spam" button becomes the "Not Spam" button
ZmMailListController.prototype._setupSpamButton =
function(parent) {
	if (!parent) { return; }

	var item = parent.getOp(ZmOperation.SPAM);
	if (item) {
		var folderId = this._getSearchFolderId();
		var folder = appCtxt.getById(folderId);
		var inSpamFolder = ((folder && folder.nId == ZmFolder.ID_SPAM) ||
							(!folder && folderId == ZmFolder.ID_SPAM)  ||
                            (this._currentSearch && this._currentSearch.folderId == ZmFolder.ID_SPAM)); // fall back
		var inPopupMenu = (parent.isZmActionMenu);
		if (parent.isZmButtonToolBar) {
			//might still be in a popup if it's in the Actions menu. That's the case now but I do this generically so it works if one day we move it as a main button (might want to do that in the spam folder at least)
			inPopupMenu = parent.getActionsMenu() && parent.getActionsMenu().getOp(ZmOperation.SPAM);
		}

		if (inPopupMenu) {
			item.setText(inSpamFolder ? ZmMsg.notJunkMarkLabel : ZmMsg.junkMarkLabel);
		} else {
			item.setText(inSpamFolder ? ZmMsg.notJunkLabel : ZmMsg.junkLabel);
		}
		item.setImage(inSpamFolder ? 'NotJunk' : 'JunkMail');
		if (item.setToolTipContent) {
			var tooltip = inSpamFolder ? ZmMsg.notJunkTooltip : ZmMsg.junkTooltip;
			item.setToolTipContent(ZmOperation.getToolTip(ZmOperation.SPAM, this.getKeyMapName(), tooltip), true);
		}
		item.isMarkAsSpam = !inSpamFolder;
	}
};

// set tooltip for print button
ZmMailListController.prototype._setupPrintButton =
function(parent) {
    if (!parent) { return; }

    var item = parent.getOp(ZmOperation.PRINT);
    if (item) {
        item.setToolTipContent(ZmMsg.printMultiTooltip, true);
    }
};



/**
 * Gets the selected message.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @return	{ZmMailMsg|ZmConv}		the selected message
 */
ZmMailListController.prototype.getMsg =
function(params) {
	var sel = this._listView[this._currentViewId].getSelection();
	return (sel && sel.length) ? sel[0] : null;
};

ZmMailListController.prototype._filterListener =
function(isAddress, rule) {

	if (isAddress) {
		this._handleResponseFilterListener(rule, this._actionEv.address);
	}
	else {
		this._getLoadedMsg(null, this._handleResponseFilterListener.bind(this, rule));
	}
};


ZmMailListController.prototype._setAddToFilterMenu =
function(parent) {
	if (this._filterMenu) {
		return;
	}

	var menuItem = parent.getOp(ZmOperation.ADD_TO_FILTER_RULE);
	this._filterMenu = new ZmPopupMenu(menuItem);
	menuItem.setMenu(this._filterMenu);

	this._rules = AjxDispatcher.run("GetFilterRules");
	this._rules.addChangeListener(this._rulesChangeListener.bind(this));
	this._resetFilterMenu();
};

ZmMailListController.prototype._resetFilterMenu =
function() {
	var filterItems = this._filterMenu.getItems();
	while (filterItems.length > 0) {
		this._filterMenu.removeChild(filterItems[0]);
	}
	this._rules.loadRules(false, this._populateFiltersMenu.bind(this));
};

ZmMailListController.prototype._populateFiltersMenu =
function(results){
	var filters = results.getResponse();
	var menu = this._filterMenu;

	var newItem = new DwtMenuItem({parent: menu});
	newItem.setText(ZmMsg.newFilter);
	newItem.setImage("Plus");
	newItem.addSelectionListener(this._filterListener.bind(this, true, null));

	if (!filters.size()) {
		return;
	}
	menu.createSeparator();

	for (var i = 0; i < filters.size(); i++) {
		var rule = filters.get(i);
		var mi = new DwtMenuItem({parent: menu});
		mi.setText(AjxStringUtil.clipByLength(rule.name, 20));
		mi.addSelectionListener(this._filterListener.bind(this, true, rule));
	}
};

ZmMailListController.prototype._rulesChangeListener =
function(ev){
	if (ev.handled || ev.type !== ZmEvent.S_FILTER) {
		return;
	}

	this._resetFilterMenu();
	ev.handled = true;
};

ZmMailListController.prototype._createApptListener =
function() {
	this._getLoadedMsg(null, this._handleResponseNewApptListener.bind(this));
};

ZmMailListController.prototype._createTaskListener =
function() {
	this._getLoadedMsg(null, this._handleResponseNewTaskListener.bind(this));
};

ZmMailListController.prototype._handleResponseNewApptListener =
function(msg) {
	if (!msg) { return; }
	if (msg.cloneOf) {
		msg = msg.cloneOf;
	}
	var w = appCtxt.isChildWindow ? window.opener : window;
    var calController = w.AjxDispatcher.run("GetCalController");
    calController.newApptFromMailItem(msg, new Date());
	if (appCtxt.isChildWindow) {
		window.close();
	}
};

ZmMailListController.prototype._handleResponseNewTaskListener =
function(msg) {
	if (!msg) { return; }
	if (msg.cloneOf) {
		msg = msg.cloneOf;
	}
	var w = appCtxt.isChildWindow ? window.opener : window;
    var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
	w.AjxDispatcher.require(["TasksCore", "Tasks"]);
    aCtxt.getApp(ZmApp.TASKS).newTaskFromMailItem(msg, new Date());
	if (appCtxt.isChildWindow) {
		window.close();
	}
};

ZmMailListController.prototype._handleResponseFilterListener =
function(rule, msgOrAddr) {

	if (!msgOrAddr) {
		return;
	}

	// arg can be ZmMailMsg or String (address)
	var msg = msgOrAddr.isZmMailMsg ? msgOrAddr : null;

	if (msg && msg.cloneOf) {
		msg = msg.cloneOf;
	}
	if (appCtxt.isChildWindow) {
		var mailListController = window.opener.AjxDispatcher.run("GetMailListController");
		mailListController._handleResponseFilterListener(rule, msgOrAddr);
		window.close();
		return;
	}
	
	AjxDispatcher.require(["PreferencesCore", "Preferences"]);
	var editMode = !!rule;
	if (rule) {
		//this is important, without this, in case the user goes to the Filters page, things get messed up and trying to save an
		// edited filter complains about the existence of a filter with the same name.
		rule = this._rules.getRuleByName(rule.name) || rule;
	}
	else {
		rule = new ZmFilterRule();
	}

	if (msg) {
		var listId = msg.getListIdHeader();
		if (listId) {
			rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, listId, ZmMailMsg.HDR_LISTID);
		}
		else {
			var from = msg.getAddress(AjxEmailAddress.FROM);
			if (from) {
				var subjMod = ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_FROM];
				rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, from.address, subjMod);
			}
			var cc = msg.getAddress(AjxEmailAddress.CC);
			if (cc)	{
				var subjMod = ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_CC];
				rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, cc.address, subjMod);
			}
			var xZimbraDL = msg.getXZimbraDLHeader();
			if (xZimbraDL && xZimbraDL.good) {
				var arr = xZimbraDL.good.getArray();
				var max = arr.length < 5 ? arr.length : 5; //limit number of X-Zimbra-DL ids
				for (var i=0; i < max; i++) {
					rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, arr[i].address, ZmMailMsg.HDR_XZIMBRADL);
				}
			}
			var subj = msg.subject;
			if (subj) {
				var subjMod = ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT];
				rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_IS, subj, subjMod);
			}
			rule.setGroupOp(ZmFilterRule.GROUP_ALL);
		}
	}
	else {
		var subjMod = ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_FROM];
		rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, msgOrAddr.isAjxEmailAddress ? msgOrAddr.address : msgOrAddr, subjMod);
	}

	if (!editMode) {
		rule.addAction(ZmFilterRule.A_KEEP);
	}

	var accountName = appCtxt.multiAccounts && msg && msg.getAccount().name,
		folder = msg && appCtxt.getById(msg.getFolderId()),
		outgoing = !!(folder && folder.isOutbound());

	appCtxt.getFilterRuleDialog().popup(rule, editMode, null, accountName, outgoing);
};

/**
 * Returns the selected msg, ensuring that it's loaded.
 * 
 * @private
 */
ZmMailListController.prototype._getLoadedMsg =
function(params, callback) {
	params = params || {};
	var msg = this.getMsg(params);
	if (!msg) {
		callback.run();
	}
	if (msg._loaded && !params.forceLoad) {
		callback.run(msg);
	} else {
		if (msg.id == this._pendingMsg) { return; }

		// Bug: 106342 - Cache the currently selected message list item as it gets de-selected when context-menu is destroyed.
		this._lastSelectedListItem = this._view[this._currentViewId].getSelection();

		msg._loadPending = true;
		this._pendingMsg = msg.id;
		params.markRead = (params.markRead != null) ? params.markRead : this._handleMarkRead(msg, true);
		// use prototype in callback because these functions are overridden by ZmConvListController
		var respCallback = new AjxCallback(this, ZmMailListController.prototype._handleResponseGetLoadedMsg, [callback, msg]);
		msg.load({getHtml:params.getHtml, markRead:params.markRead, callback:respCallback, noBusyOverlay:false, forceLoad: params.forceLoad, noTruncate: params.noTruncate});
	}
};

ZmMailListController.prototype._handleResponseGetLoadedMsg =
function(callback, msg) {
	if (this._pendingMsg && (msg.id != this._pendingMsg)) { return; }
	msg._loadPending = false;
	this._pendingMsg = null;
	callback.run(msg);
};

ZmMailListController.prototype._getInviteReplyBody =
function(type, instanceDate, isResourceInvite) {
	var replyBody;

	if (instanceDate) {
		switch (type) {
			case ZmOperation.REPLY_ACCEPT:		replyBody = ZmMsg.defaultInviteReplyAcceptInstanceMessage; break;
			case ZmOperation.REPLY_CANCEL:		replyBody = ZmMsg.apptInstanceCanceled; break;
			case ZmOperation.REPLY_DECLINE:		replyBody = ZmMsg.defaultInviteReplyDeclineInstanceMessage; break;
			case ZmOperation.REPLY_TENTATIVE: 	replyBody = ZmMsg.defaultInviteReplyTentativeInstanceMessage; break;
		}

		if (isResourceInvite) {
			switch (type) {
				case ZmOperation.REPLY_ACCEPT:		replyBody = ZmMsg.defaultInviteReplyResourceAcceptInstanceMessage; break;
				case ZmOperation.REPLY_CANCEL:		replyBody = ZmMsg.apptInstanceCanceled; break;
				case ZmOperation.REPLY_DECLINE:		replyBody = ZmMsg.defaultInviteReplyResourceDeclineInstanceMessage; break;
				case ZmOperation.REPLY_TENTATIVE: 	replyBody = ZmMsg.defaultInviteReplyResourceTentativeInstanceMessage; break;
			}
		}

		if (replyBody) {
			return AjxMessageFormat.format(replyBody, instanceDate);
		}
	}
	switch (type) {
		case ZmOperation.REPLY_ACCEPT:		replyBody = ZmMsg.defaultInviteReplyAcceptMessage; break;
		case ZmOperation.REPLY_CANCEL:		replyBody = ZmMsg.apptCanceled; break;
		case ZmOperation.DECLINE_PROPOSAL:  replyBody = ""; break;
		case ZmOperation.REPLY_DECLINE:		replyBody = ZmMsg.defaultInviteReplyDeclineMessage; break;
		case ZmOperation.REPLY_TENTATIVE: 	replyBody = ZmMsg.defaultInviteReplyTentativeMessage; break;
		case ZmOperation.REPLY_NEW_TIME: 	replyBody = ZmMsg.defaultInviteReplyNewTimeMessage;	break;
	}

	if (isResourceInvite) {
		switch (type) {
			case ZmOperation.REPLY_ACCEPT:		replyBody = ZmMsg.defaultInviteReplyResourceAcceptMessage; break;
			case ZmOperation.REPLY_CANCEL:		replyBody = ZmMsg.apptCanceled; break;
			case ZmOperation.REPLY_DECLINE:		replyBody = ZmMsg.defaultInviteReplyResourceDeclineMessage; break;
			case ZmOperation.REPLY_TENTATIVE: 	replyBody = ZmMsg.defaultInviteReplyResourceTentativeMessage; break;
			case ZmOperation.REPLY_NEW_TIME: 	replyBody = ZmMsg.defaultInviteReplyNewTimeMessage;	break;
		}
	}

	//format the escaped apostrophe in ZmMsg entry
	if (replyBody) {
		replyBody =  AjxMessageFormat.format(replyBody, []);
	}
	return replyBody;
};

ZmMailListController.prototype._getInviteReplySubject =
function(type) {
	var replySubject = null;
	switch (type) {
		case ZmOperation.REPLY_ACCEPT:		replySubject = ZmMsg.subjectAccept + ": "; break;
		case ZmOperation.DECLINE_PROPOSAL:	replySubject = ZmMsg.subjectDecline + " - "; break;
		case ZmOperation.REPLY_DECLINE:		replySubject = ZmMsg.subjectDecline + ": "; break;
		case ZmOperation.REPLY_TENTATIVE:	replySubject = ZmMsg.subjectTentative + ": "; break;
		case ZmOperation.REPLY_NEW_TIME:	replySubject = ZmMsg.subjectNewTime + ": "; break;
	}
	return replySubject;
};

ZmMailListController.prototype._editInviteReply =
function(action, componentId, instanceDate, accountName, acceptFolderId) {
	var replyBody = this._getInviteReplyBody(action, instanceDate);
	this._doAction({action:action, extraBodyText:replyBody, instanceDate:instanceDate, accountName:accountName, acceptFolderId: acceptFolderId});
};

ZmMailListController.prototype._acceptProposedTime =
function(componentId, origMsg) {
	var invite = origMsg.invite;
	var apptId = invite.getAppointmentId();
	var ac = window.parentAppCtxt || window.appCtxt;
	var controller = ac.getApp(ZmApp.CALENDAR).getCalController();
	var callback = new AjxCallback(this, this._handleAcceptDeclineProposedTime, [origMsg]);
	controller.acceptProposedTime(apptId, invite, appCtxt.isChildWindow ? null : callback);
	if (appCtxt.isChildWindow) {
		window.close();
	}
};

ZmMailListController.prototype._declineProposedTime =
function(componentId, origMsg) {
	var replyBody = this._getInviteReplyBody(ZmOperation.DECLINE_PROPOSAL);
	var callback = new AjxCallback(this, this._handleAcceptDeclineProposedTime, [origMsg]);
	this._doAction({action:ZmOperation.DECLINE_PROPOSAL, extraBodyText:replyBody, instanceDate:null, sendMsgCallback: callback});
};

ZmMailListController.prototype._handleAcceptDeclineProposedTime =
function(origMsg) {
	this._doDelete([origMsg]);
};

ZmMailListController.prototype._sendInviteReply =
function(type, componentId, instanceDate, accountName, ignoreNotify, origMsg, acceptFolderId, callback) {
	var msg = new ZmMailMsg();
	AjxDispatcher.require(["MailCore", "CalendarCore"]);

	msg._origMsg = origMsg || this.getMsg();
	msg.inviteMode = type;
	msg.isReplied = true;
	msg.isForwarded = false;
	msg.isInviteReply = true;
	msg.acceptFolderId = acceptFolderId;
	msg.folderId = msg._origMsg.folderId;

	var replyActionMode = ZmMailListController.REPLY_ACTION_MAP[type] ? ZmMailListController.REPLY_ACTION_MAP[type] : type;
	var replyBody = this._getInviteReplyBody(replyActionMode, instanceDate, msg._origMsg.isResourceInvite());
	if (replyBody != null) {
		var dummyAppt = new ZmAppt();
		dummyAppt.setFromMessage(msg._origMsg);

		var tcontent = dummyAppt.getTextSummary() + "\n" + replyBody;
		var textPart = new ZmMimePart();
		textPart.setContentType(ZmMimeTable.TEXT_PLAIN);
		textPart.setContent(tcontent);

		var hcontent = dummyAppt.getHtmlSummary() + "<p>" + replyBody + "</p>";
		var htmlPart = new ZmMimePart();
		htmlPart.setContentType(ZmMimeTable.TEXT_HTML);
		htmlPart.setContent(hcontent);

		var topPart = new ZmMimePart();
		topPart.setContentType(ZmMimeTable.MULTI_ALT);
		topPart.children.add(textPart);
		topPart.children.add(htmlPart);

		msg.setTopPart(topPart);
	}
	var subject = this._getInviteReplySubject(replyActionMode) + msg._origMsg.invite.getEventName();
	if (subject != null) {
		msg.setSubject(subject);
	}
	var errorCallback = new AjxCallback(this, this._handleErrorInviteReply);
	msg.sendInviteReply(true, componentId, callback, errorCallback, instanceDate, accountName, ignoreNotify);
};

ZmMailListController.prototype._handleErrorInviteReply =
function(result) {
	if (result.code == ZmCsfeException.MAIL_NO_SUCH_ITEM) {
		var dialog = appCtxt.getErrorDialog();
		dialog.setMessage(ZmMsg.inviteOutOfDate);
		dialog.popup(null, true);
		return true;
	}
};

ZmMailListController.prototype._spamListener =
function(ev) {
	var items = this._listView[this._currentViewId].getSelection();
	var button = this.getCurrentToolbar().getButton(ZmOperation.SPAM);

	this._doSpam(items, button.isMarkAsSpam);
};

ZmMailListController.prototype._detachListener =
function(ev, callback) {
	var msg = this.getMsg();
	if (msg) {
		if (msg._loaded) {
			ZmMailMsgView.detachMsgInNewWindow(msg, false, this);
			// always mark a msg read if it is displayed in its own window
			if (msg.isUnread && !appCtxt.getById(msg.folderId).isReadOnly()) {
				msg.list.markRead({items:[msg], value:true});
			}
		} else {
			ZmMailMsgView.rfc822Callback(msg.id, null, this);
		}
	}
	if (callback) { callback.run(); }
};

ZmMailListController.prototype._printListener =
function(ev) {
	var listView = this._listView[this._currentViewId];
	var items = listView.getSelection();
	items = AjxUtil.toArray(items);
	var ids = [];
	var showImages = false;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		// always extract out the msg ids from the conv
		if (item.toString() == "ZmConv") {
			// get msg ID in case of virtual conv.
			// item.msgIds.length is inconsistent, so checking if conv id is negative.
			if (appCtxt.isOffline && item.id.split(":")[1]<0) {
				ids.push(item.msgIds[0]);
			} else {
				ids.push("C:"+item.id);
			}
			if (item.isZmConv) {
				var msgList = item.getMsgList();
				for(var j=0; j<msgList.length; j++) {
					if(msgList[j].showImages) {
						showImages = true;
						break;
					}
				}
			}
		} else {
			ids.push(item.id);
			if (item.showImages) {
				showImages = true;
			}
		}
	}
	var url = ("/h/printmessage?id=" + ids.join(",")) + "&tz=" + AjxTimezone.getServerId(AjxTimezone.DEFAULT);
	if (appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES) || showImages) {
		url = url+"&xim=1";
	}
    if (appCtxt.isOffline) {
        var acctName = items[0].getAccount().name;
        url+="&acct=" + acctName ;
    }
    window.open(appContextPath+url, "_blank");
};

ZmMailListController.prototype._editListener =
function(isEditAsNew, ev) {
    this._doAction({ev:ev, action:ZmOperation.DRAFT, isEditAsNew:isEditAsNew});
};

ZmMailListController.prototype._muteUnmuteConvListener =
function(ev) {
    var status = this._getConvMuteStatus();
    if (status.hasUnmuteConv) {
        this._muteConvListener();
    }
    else {
        this._unmuteConvListener();
    }
};

ZmMailListController.prototype._muteConvListener =
function(ev) {
    var listView = this._listView[this._currentView];
	var items = listView.getSelection();
	items = AjxUtil.toArray(items);
    var markReadcallback = this._getMarkReadCallback();
    var callback = new AjxCallback(this, this._handleMuteUnmuteConvResponse, [markReadcallback, ZmId.OP_MUTE_CONV]);
    this._doMarkMute(items, true, callback, true);
};

ZmMailListController.prototype._unmuteConvListener =
function(ev) {
    var listView = this._listView[this._currentView];
	var items = listView.getSelection();
	items = AjxUtil.toArray(items);
    var convListView = this._mailListView || this._parentController._mailListView;
    //When a conv is unmuted it needs to be rearranged in the list as per its sorting order. convListCallback will handle it.
    var convListCallback = null;
    if(convListView && convListView.toString() == "ZmConvListView") {
        convListCallback = new AjxCallback(convListView, convListView.handleUnmuteConv, items);
    }
    var callback = new AjxCallback(this, this._handleMuteUnmuteConvResponse, [convListCallback, ZmId.OP_UNMUTE_CONV]);
    this._doMarkMute(items, false, callback, true);
};

ZmMailListController.prototype._handleMuteUnmuteConvResponse =
function(callback, actionId, result) {
    if(callback != null) {
        callback.run();
    }
};

ZmMailListController.prototype._checkMailListener =
function() {
	if (appCtxt.isOffline) {
		var callback = new AjxCallback(this, this._handleSyncAll);
		appCtxt.accountList.syncAll(callback);
	}

	var folder = this._getSearchFolder();
	var isFeed = (folder && folder.isFeed());
	if (isFeed) {
		folder.sync();
	} else {
		var hasExternalAccounts = false;
		if (!appCtxt.isOffline) {
			var isEnabled = appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED) || appCtxt.get(ZmSetting.IMAP_ACCOUNTS_ENABLED);
			if (folder && !isFeed && isEnabled) {
				var dataSources = folder.getDataSources(null, true);
				if (dataSources) {
					hasExternalAccounts = true;
					var dsCollection = AjxDispatcher.run("GetDataSourceCollection");
					dsCollection.importMail(dataSources);
				}
			}
		}

		if ((folder && folder.nId == ZmFolder.ID_INBOX) || !hasExternalAccounts) {
			appCtxt.getAppController().sendNoOp();
		}
	}
};

ZmMailListController.prototype._handleSyncAll =
function() {
	//doesn't do anything now after I removed the appCtxt.get(ZmSetting.GET_MAIL_ACTION) == ZmSetting.GETMAIL_ACTION_DEFAULT preference stuff
};

ZmMailListController.prototype.runRefresh =
function() {
	this._checkMailListener();
};

ZmMailListController.prototype._sendReceiveListener =
function(ev) {
	var account = appCtxt.accountList.getAccount(ev.item.getData(ZmOperation.MENUITEM_ID));
	if (account) {
		account.sync();
	}
};

ZmMailListController.prototype._folderSearch =
function(folderId) {
	appCtxt.getSearchController().search({query:"in:" + ZmFolder.QUERY_NAME[folderId]});
};

// Miscellaneous

// Adds "By Conversation" and "By Message" to a view menu
ZmMailListController.prototype._setupGroupByMenuItems =
function(view, menu) {

	for (var i = 0; i < ZmMailListController.GROUP_BY_VIEWS.length; i++) {
		var id = ZmMailListController.GROUP_BY_VIEWS[i];
		var mi = menu.createMenuItem(id, {image:	ZmMailListController.GROUP_BY_ICON[id],
										  text:		ZmMsg[ZmMailListController.GROUP_BY_MSG_KEY[id]],
										  shortcut:	ZmMailListController.GROUP_BY_SHORTCUT[id],
										  style:	DwtMenuItem.RADIO_STYLE});
		mi.setData(ZmOperation.MENUITEM_ID, id);
		mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
		if (id == this.getDefaultViewType()) {
			mi.setChecked(true, true);
		}
	}
};

ZmMailListController.prototype._setReplyText =
function(parent) {
	if (parent && appCtxt.get(ZmSetting.REPLY_MENU_ENABLED)) {
		var op = parent.getOp(ZmOperation.REPLY_MENU);
		if (op) {
			var menu = op.getMenu();
			var replyOp = menu.getOp(ZmOperation.REPLY);
			replyOp.setText(ZmMsg.replySender);
		}
	}
};

ZmMailListController.prototype._resetOperations =
function(parent, num) {

	ZmListController.prototype._resetOperations.call(this, parent, num);

	var isWebClientOffline = appCtxt.isWebClientOffline();
	parent.enable(ZmOperation.PRINT, (num > 0) && !isWebClientOffline );
	parent.enable(ZmOperation.SHOW_ORIG, !isWebClientOffline);

	if (this.isSyncFailuresFolder()) {
		parent.enableAll(false);
		parent.enable([ZmOperation.NEW_MENU], true);
		parent.enable([ZmOperation.DELETE, ZmOperation.FORWARD], num > 0);
		return;
	}

	var item;
	if (num == 1 && !this.isDraftsFolder()) {
		var sel = this._listView[this._currentViewId].getSelection();
		if (sel && sel.length) {
			item = sel[0];
		}
	}
	
	// If one item is selected, use its folder; otherwise check if search was constrained to a folder
	var itemFolder = item && item.folderId && appCtxt.getById(item.folderId);
	var folder = itemFolder;
	if (!folder) {
		var folderId = this._getSearchFolderId(true);
		folder = folderId && appCtxt.getById(folderId);
	}

	var isDrafts = (item && item.isDraft && (item.type != ZmId.ITEM_CONV || item.numMsgs == 1)) || this.isDraftsFolder();
	var isFeed = (folder && folder.isFeed());
	var isReadOnly = (folder && folder.isReadOnly());
    var isOutboxFolder = this.isOutboxFolder();
	parent.setItemVisible(ZmOperation.EDIT, (isDrafts || isOutboxFolder) && (!folder || !folder.isReadOnly()));
	parent.setItemVisible(ZmOperation.EDIT_AS_NEW, !(isDrafts || isOutboxFolder));

	parent.setItemVisible(ZmOperation.REDIRECT, !(isDrafts || isOutboxFolder));
	parent.enable(ZmOperation.REDIRECT, !(isDrafts || isOutboxFolder || isWebClientOffline));

	parent.setItemVisible(ZmOperation.MARK_READ, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.MARK_UNREAD, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.FLAG, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.UNFLAG, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.SPAM, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.DETACH, !(isDrafts || isOutboxFolder));

	parent.enable(ZmOperation.MOVE_MENU, !(isDrafts || isOutboxFolder) && num > 0);

	parent.enable(ZmOperation.DETACH, (appCtxt.get(ZmSetting.DETACH_MAILVIEW_ENABLED) && !(isDrafts || isOutboxFolder || isWebClientOffline) && num == 1));

	/*if (parent.isZmActionMenu) {
		parent.setItemVisible(ZmOperation.QUICK_COMMANDS, !isDrafts && parent._hasQuickCommands);
	} else {
		parent.setItemVisible(ZmOperation.QUICK_COMMANDS, !isDrafts);
	} */

	parent.setItemVisible(ZmOperation.ADD_FILTER_RULE, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.CREATE_APPT, !(isDrafts || isOutboxFolder));
	parent.setItemVisible(ZmOperation.CREATE_TASK, !(isDrafts || isOutboxFolder));
    parent.setItemVisible(ZmOperation.ACTIONS_MENU, !isOutboxFolder);

	// bug fix #37154 - disable non-applicable buttons if rfc/822 message
	var isRfc822 = appCtxt.isChildWindow && window.newWindowParams && window.newWindowParams.isRfc822;
	if (isRfc822 || (isReadOnly && num > 0)) {
		parent.enable([ZmOperation.DELETE, ZmOperation.MOVE, ZmOperation.MOVE_MENU, ZmOperation.SPAM, ZmOperation.TAG_MENU], false);
	} else {
		parent.enable([ZmOperation.REPLY, ZmOperation.REPLY_ALL], (!(isDrafts || isOutboxFolder) && !isFeed && num == 1));
		parent.enable([ZmOperation.VIEW_MENU], true);
		parent.enable([ZmOperation.FORWARD, ZmOperation.SPAM], (!(isDrafts || isOutboxFolder) && num > 0));
	}

	if (this._draftsActionMenu) {
		var editMenu = this._draftsActionMenu.getOp(ZmOperation.EDIT);
		if (editMenu) {
			// Enable|disable 'edit' context menu item based on selection count
			editMenu.setEnabled(num == 1 && (this.isDraftsFolder() || !isReadOnly));
		}
	}

	var search = appCtxt.getCurrentSearch();
	if (appCtxt.multiAccounts && num > 1 && search && search.isMultiAccount()) {
		parent.enable(ZmOperation.TAG_MENU, false);
	}

    if (appCtxt.isExternalAccount()) {
        parent.enable(
                        [
                            ZmOperation.REPLY,
                            ZmOperation.REPLY_ALL,
                            ZmOperation.FORWARD,
                            ZmOperation.EDIT_AS_NEW,
                            ZmOperation.REDIRECT,
                            ZmOperation.MARK_READ,
                            ZmOperation.MARK_UNREAD,
                            ZmOperation.SPAM,
                            ZmOperation.MOVE,
                            ZmOperation.MOVE_MENU,
                            ZmOperation.DELETE,
                            ZmOperation.DETACH,
                            ZmOperation.ADD_FILTER_RULE,
                            ZmOperation.CREATE_APPT,
                            ZmOperation.SEARCH_TO,
                            ZmOperation.SEARCH,
                            ZmOperation.CREATE_TASK
                        ],
                        false
                    );
        parent.setItemVisible(ZmOperation.TAG_MENU, false);
    }

	this._cleanupToolbar(parent);
};

ZmMailListController.prototype._showMailItem =
function() {
	var avm = appCtxt.getAppViewMgr();
	this._setup(this._currentViewId);
	var elements = this.getViewElements(this._currentViewId, this._view[this._currentViewId]);

	var curView = avm.getCurrentViewId();
	var tabId = ZmMailListController.viewToTab[curView] || Dwt.getNextId();
	ZmMailListController.viewToTab[this._currentViewId] = tabId;
	var viewParams = {
		view:		this._currentViewId,
		viewType:	this._currentViewType,
		elements:	elements,
		hide:		this._elementsToHide,
		clear:		appCtxt.isChildWindow,
		tabParams:	this._getTabParams(tabId, this._tabCallback.bind(this))
	};
	var buttonText = (this._conv && this._conv.subject) ? this._conv.subject.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT) : (this._msg && this._msg.subject && this._msg.subject.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT)) ||   ZmMsgController.DEFAULT_TAB_TEXT;

	this._setView(viewParams);
	avm.setTabTitle(this._currentViewId, buttonText);
	this._resetOperations(this._toolbar[this._currentViewId], 1); // enable all buttons
	this._resetNavToolBarButtons();
};


/**
 * if parent is a toolbar, it might have an actionsMenu. If it does, we can clean up the separators in that menu.
 * (to prevent multiple consecutive separators, etc)
 * @param parent
 */
ZmMailListController.prototype._cleanupToolbar =
function(parent) {
	//cleanup the separators of the toolbar Actions menu
	if (!parent.getActionsMenu) {
		return;
	}
	var actionsMenu = parent.getActionsMenu();
	if (!actionsMenu) {
		return;
	}
	actionsMenu.cleanupSeparators();
};



// Enable mark read/unread as appropriate.
ZmMailListController.prototype._enableFlags =
function(menu) {
    if(appCtxt.isExternalAccount()) {
        menu.enable([ZmOperation.MARK_READ, ZmOperation.MARK_UNREAD, ZmOperation.FLAG, ZmOperation.UNFLAG], false);
        return;
    }
	var status = this._getReadStatus();
	menu.enable(ZmOperation.MARK_READ, status.hasUnread);
	menu.enable(ZmOperation.MARK_UNREAD, status.hasRead);
	menu.enable(ZmOperation.FLAG, status.hasUnflagged);
	menu.enable(ZmOperation.UNFLAG, status.hasFlagged);

    if (appCtxt.isWebClientOffline()) {
        menu.enable([ZmOperation.ADD_FILTER_RULE,ZmOperation.CREATE_APPT, ZmOperation.CREATE_TASK], false);
    }
};

// Enable mark read/unread as appropriate.
ZmMailListController.prototype._enableMuteUnmute =
function(menu) {
    menu.enable([ZmOperation.UNMUTE_CONV, ZmOperation.MUTE_CONV], false);
    if (appCtxt.isExternalAccount() || appCtxt.isChildWindow || this._app.getGroupMailBy() === ZmItem.MSG) {
        return;
    }
    var status = this._getConvMuteStatus();
    if (status.hasMuteConv && status.hasUnmuteConv) {
        menu.enable(ZmOperation.UNMUTE_CONV, true);
        menu.enable(ZmOperation.MUTE_CONV, true);
    }
	else if (status.hasMuteConv) {
         menu.enable(ZmOperation.UNMUTE_CONV, true);
    }
    else {
         menu.enable(ZmOperation.MUTE_CONV, true);
    }
};

/**
* This method is actually called by a pushed view's controller when a user
* attempts to page conversations (from CV) or messages (from MV ala TV).
* We want the underlying view (CLV or MLV) to update itself silently as it
* feeds the next/prev conv/msg to its respective controller.
*
* @param {ZmItem}	currentItem	the current item
* @param {Boolean}	forward		if <code>true</code>, get next item rather than previous
* 
* @private
*/
ZmMailListController.prototype.pageItemSilently =
function(currentItem, forward, msgController) {

	var newItem = this._getNextItem(currentItem, forward);
	if (newItem) {
		if (msgController) {
			msgController.inactive = true; //make it inactive so it can be reused instead of creating a new one for each item paged.
		}
		var lv = this._listView[this._currentViewId];
		lv.emulateDblClick(newItem);
	}
};

ZmMailListController.prototype._getNextItem =
function(currentItem, forward) {

	var list = this._list.getArray();
	var len = list.length;
	for (var i = 0; i < len; i++) {
		if (currentItem == list[i]) {
			break;
		}
	}
	if (i == len) { return; }

	var itemIdx = forward ? i + 1 : i - 1;

	if (itemIdx >= len) {
		//we are looking for the next item after the current list, not yet loaded
		if (!this._list.hasMore()) {
			return;
		}
		this._paginate(this._currentViewId, true, itemIdx);
		return;
	}
	return list[itemIdx];
};

/**
 * Selects and displays an item that has been loaded into a page that's
 * not visible (eg getting the next conv from within the last conv on a page).
 *
 * @param view			[constant]		current view
 * @param saveSelection	[boolean]		if true, maintain current selection
 * @param loadIndex		[int]			index of item to show
 * @param result			[ZmCsfeResult]	result of SOAP request
 * 
 * @private
 */
ZmMailListController.prototype._handleResponsePaginate =
function(view, saveSelection, loadIndex, offset, result) {
	ZmListController.prototype._handleResponsePaginate.apply(this, arguments);

	var newItem = loadIndex ? this._list.getVector().get(loadIndex) : null;
	if (newItem) {
		this._listView[this._currentViewId].emulateDblClick(newItem);
	}
};

ZmMailListController.prototype._getMenuContext =
function() {
	return this.getCurrentViewId();
};

// Flag mail items(override ZmListController to add hook to zimletMgr
ZmMailListController.prototype._doFlag =
function(items, on) {
	ZmListController.prototype._doFlag.call(this, items, on);
	appCtxt.notifyZimlets("onMailFlagClick", [items, on]);
};

// Tag/untag items(override ZmListController to add hook to zimletMgr
ZmMailListController.prototype._doTag =
function(items, tag, doTag) {
	ZmListController.prototype._doTag.call(this, items, tag, doTag);
	appCtxt.notifyZimlets("onTagAction", [items, tag, doTag]);
};


/**
 * Returns the next/previous/first/last unread item in the list, based on what's
 * currently selected.
 *
 * @param which		[constant]		DwtKeyMap constant for selecting next/previous/first/last
 * @param type		[constant]*		if present, only return this type of item
 * @param noBump	[boolean]*		if true, start with currently selected item
 * 
 * @private
 */
ZmMailListController.prototype._getUnreadItem =
function(which, type, noBump) {

	var lv = this._listView[this._currentViewId];
	var vec = lv.getList(true);
	var list = vec && vec.getArray();
	var size = list && list.length;
	if (!size) { return; }

	var start, index;
	if (which == DwtKeyMap.SELECT_FIRST) {
		index = 0;
	} else if (which == DwtKeyMap.SELECT_LAST) {
		index = list.length - 1;
	} else {
		var sel = lv.getSelection();
		var start, index;
		if (sel && sel.length) {
			start = (which == DwtKeyMap.SELECT_NEXT) ? sel[sel.length - 1] : sel[0];
		} else {
			start = (which == DwtKeyMap.SELECT_NEXT) ? list[0] : list[list.length - 1];
		}
		if (start) {
			var startIndex = lv.getItemIndex(start, true);
			if (sel && sel.length && !noBump) {
				index = (which == DwtKeyMap.SELECT_NEXT) ? startIndex + 1 : startIndex - 1;
			} else {
				index = startIndex;
			}
		}
	}

	var unreadItem = null;
	while ((index >= 0 && index < size) && !unreadItem) {
		var item = list[index];
		if (item.isUnread && (!type || item.type == type)) {
			unreadItem = item;
		} else {
			index = (which == DwtKeyMap.SELECT_NEXT || which == DwtKeyMap.SELECT_FIRST) ? index + 1 : index - 1;
		}
	}

	return unreadItem;
};

ZmMailListController.prototype._getNextItemToSelect = function() {};

ZmMailListController.prototype.addTrustedAddr =
function(value, callback, errorCallback) {
    var soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount"),
        node,
        i;

    for(i=0; i<value.length;i++) {
        node = soapDoc.set("pref", AjxStringUtil.trim(value[i]));
        node.setAttribute("name", "zimbraPrefMailTrustedSenderList");
    }

    return appCtxt.getAppController().sendRequest({
       soapDoc: soapDoc,
       asyncMode: true,
       callback: callback,
       errorCallback: errorCallback
    });
};

/**
 * @private
 */
ZmMailListController.prototype._getActiveSearchFolderId =
function() {
	var s = this._activeSearch && this._activeSearch.search;
	return s && s.folderId;
};

/**
 * @private
 */
ZmMailListController.prototype._getActiveSearchFolder =
function() {
	var id = this._getActiveSearchFolderId();
	return id && appCtxt.getById(id);
};

/* ZmMailListController.prototype._quickCommandMenuHandler = function(evt, batchCmd) {
    var selectedItems = this.getItems();

    ZmListController.prototype._quickCommandMenuHandler.call(this, evt);

    if (!selectedItems || !selectedItems.length) {return;}

    var menuItem = evt.dwtObj;
    var quickCommand = menuItem.getData(Dwt.KEY_OBJECT);
    if (!quickCommand) {return;}
            
    var actions = quickCommand.actions;
    var len = actions.length;
    for (var i = 0; i < len; i++) {
        var action = actions[i];
        if (!action.isActive) {continue;}
        var actionValue = action.value;
        if (action.type == ZmQuickCommandAction[ZmFilterRule.A_NAME_FLAG]) {
            if (actionValue == "read" || actionValue == "unread") {
                this._doMarkRead(selectedItems, (actionValue == "read"));
            }
        }
    }
};
*/

/**
* Deletes one or more items from the list.
*
* @param items			[Array]			list of items to delete
* @param hardDelete		[boolean]*		if true, physically delete items
* @param attrs			[Object]*		additional attrs for SOAP command
* @param confirmDelete  [Boolean]       user already confirmed hard delete (see ZmBriefcaseController.prototype._doDelete and ZmBriefcaseController.prototype._doDelete2)
*
* @private
*/
ZmMailListController.prototype._doDelete =
function(items, hardDelete, attrs, confirmDelete) {

    var messages = AjxUtil.toArray(items);
    if (!messages.length) { return; }

    // Check if need to warn the user about violating the keep retention policy.  If a warning
    // dialog is displayed, the callback from that dialog allows the user to delete messages
    var warningIssued = this._doRetentionPolicyWarning(messages,
        ZmListController.prototype._doDelete, [hardDelete, attrs, false]);
    if (!warningIssued) {
        // No retention policy, or all the chosen messages fall outside the retention period.
        ZmListController.prototype._doDelete.call(this, messages, hardDelete, attrs, confirmDelete);
    }
};

ZmMailListController.prototype._doMove =
function(items, destinationFolder, attrs, isShiftKey) {
    var messages = AjxUtil.toArray(items);
    if (!messages.length) { return; }

    var warningIssued = false;

    if (destinationFolder && (destinationFolder.nId == ZmFolder.ID_TRASH)) {
        // Check if need to warn the user about violating the keep retention policy.  If a warning
        // dialog is displayed, the callback from that dialog allows the user to trash messages
        warningIssued = this._doRetentionPolicyWarning(messages,
            ZmListController.prototype._doMove, [destinationFolder, attrs, isShiftKey]);
    }
    if (!warningIssued) {
        // No retention policy, or all the chosen messages fall outside the retention period.
        ZmListController.prototype._doMove.call(this, items, destinationFolder, attrs, isShiftKey);
    }
}

ZmMailListController.prototype._doRetentionPolicyWarning =
function(messages, callbackFunc, args) {
    var numWithinRetention = 0;
    var folder;
    var keepPolicy;
    var now = new Date();
    var validMessages = [];
    var policyStartMsec = {};
    for (var i = 0; i < messages.length; i++) {
        var folderId = messages[i].folderId;
        if (!policyStartMsec[folderId]) {
            policyStartMsec[folderId] = -1;
            folder = appCtxt.getById(folderId);
            keepPolicy = (folder ? folder.getRetentionPolicy(ZmOrganizer.RETENTION_KEEP) : null);
            if (keepPolicy) {
                // Calculate the current start of this folder's keep (retention) period
                var keepLifetimeMsec = folder.getRetentionPolicyLifetimeMsec(keepPolicy);
                policyStartMsec[folderId] = now.getTime() - keepLifetimeMsec;
            }
        }
        if (policyStartMsec[folderId] > 0) {
            // Determine which messages are not affected by the retention policy (i.e.
            // their age exceeds that mandated by the policy)
            if (messages[i].date < policyStartMsec[folderId]) {
                validMessages.push(messages[i]);
            }
        } else {
            // The message's folder does not have a retention policy
            validMessages.push(messages[i]);
        }
    }

    numWithinRetention = messages.length - validMessages.length;
    if (numWithinRetention > 0) {
        // Create the base warning text
        var warningMsg = ((numWithinRetention == 1) ?
                            ZmMsg.retentionKeepWarning :
                            AjxMessageFormat.format(ZmMsg.retentionKeepWarnings,[numWithinRetention.toString()])) +
                         "<BR><BR>";

        if (validMessages.length == 0) {
            // All the chosen messages fall within the retention period
            this._showSimpleRetentionWarning(warningMsg, messages, callbackFunc, args);
        } else {
            // A mix of messages - some outside the retention period, some within.
            warningMsg += ZmMsg.retentionDeleteAllExplanation + "<BR><BR>" +
                          ((validMessages.length == 1) ?
                              ZmMsg.retentionDeleteValidExplanation :
                              AjxMessageFormat.format(ZmMsg.retentionDeleteValidExplanations,[validMessages.length.toString()]));
            this._showRetentionWarningDialog(warningMsg, messages, validMessages, callbackFunc, args);
        }
    }

    return numWithinRetention != 0;
}

ZmMailListController.prototype._showSimpleRetentionWarning =
function(warningMsg, messages, callbackFunc, args) {
    warningMsg += (messages.length == 1) ? ZmMsg.retentionDeleteOne :
                                           ZmMsg.retentionDeleteMultiple;
    // This assumes that the first parameter of the OK function is the messages
    // to be processed, followed by other arbitrary parameters
    var okArgs = [messages].concat(args);
    var callback = new AjxCallback(this, callbackFunc,okArgs);

    var okCancelDialog = appCtxt.getOkCancelMsgDialog();
    okCancelDialog.registerCallback(DwtDialog.OK_BUTTON,
        this._handleRetentionWarningOK, this, [okCancelDialog, callback]);
    okCancelDialog.setMessage(warningMsg, DwtMessageDialog.WARNING_STYLE);
    okCancelDialog.setVisible(true);
    okCancelDialog.popup();
}


ZmMailListController.prototype._showRetentionWarningDialog =
function(warningMsg, messages, validMessages, callbackFunc, args) {
    var retentionDialog = appCtxt.getRetentionWarningDialog();
	retentionDialog.reset();

    var callback;
    // This assumes that the first parameter of the OK function is the messages
    // to be processed, followed by other arbitrary parameters
    var allArgs = [messages].concat(args);
    callback = new AjxCallback(this, callbackFunc, allArgs);
    retentionDialog.registerCallback(ZmRetentionWarningDialog.DELETE_ALL_BUTTON,
        this._handleRetentionWarningOK, this, [retentionDialog, callback]);

    var oldArgs = [validMessages].concat(args);
    callback = new AjxCallback(this, callbackFunc, oldArgs);
    retentionDialog.registerCallback(ZmRetentionWarningDialog.DELETE_VALID_BUTTON,
        this._handleRetentionWarningOK, this, [retentionDialog, callback]);

    retentionDialog.setMessage(warningMsg, DwtMessageDialog.WARNING_STYLE);
    retentionDialog.setVisible(true);
    retentionDialog.popup();
};

ZmMailListController.prototype._handleRetentionWarningOK =
function(dialog, callback) {
    dialog.popdown();
    callback.run();
};

// done here since operations may not be defined at parse time
ZmMailListController.prototype._setStatics = function() {

	if (!ZmMailListController.INVITE_REPLY_MAP) {

		ZmMailListController.INVITE_REPLY_MAP = {};
		ZmMailListController.INVITE_REPLY_MAP[ZmOperation.INVITE_REPLY_ACCEPT]		= ZmOperation.REPLY_ACCEPT;
		ZmMailListController.INVITE_REPLY_MAP[ZmOperation.INVITE_REPLY_DECLINE]		= ZmOperation.REPLY_DECLINE;
		ZmMailListController.INVITE_REPLY_MAP[ZmOperation.INVITE_REPLY_TENTATIVE]	= ZmOperation.REPLY_TENTATIVE;

		ZmMailListController.REPLY_ACTION_MAP = {};
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_ACCEPT_NOTIFY]		= ZmOperation.REPLY_ACCEPT;
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_ACCEPT_IGNORE]		= ZmOperation.REPLY_ACCEPT;
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_DECLINE_NOTIFY]		= ZmOperation.REPLY_DECLINE;
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_DECLINE_IGNORE]		= ZmOperation.REPLY_DECLINE;
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_TENTATIVE_NOTIFY]	= ZmOperation.REPLY_TENTATIVE;
		ZmMailListController.REPLY_ACTION_MAP[ZmOperation.REPLY_TENTATIVE_IGNORE]	= ZmOperation.REPLY_TENTATIVE;

		// convert key mapping to operation
		ZmMailListController.ACTION_CODE_TO_OP = {};
		ZmMailListController.ACTION_CODE_TO_OP[ZmKeyMap.REPLY]			= ZmOperation.REPLY;
		ZmMailListController.ACTION_CODE_TO_OP[ZmKeyMap.REPLY_ALL]		= ZmOperation.REPLY_ALL;
		ZmMailListController.ACTION_CODE_TO_OP[ZmKeyMap.FORWARD_INLINE]	= ZmOperation.FORWARD_INLINE;
		ZmMailListController.ACTION_CODE_TO_OP[ZmKeyMap.FORWARD_ATT]	= ZmOperation.FORWARD_ATT;
	}
};

// Mail can be grouped by msg or conv
ZmMailListController.prototype.supportsGrouping = function() {
    return true;
};
}
if (AjxPackage.define("zimbraMail.mail.controller.ZmDoublePaneController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a new, empty double pane controller.
 * @constructor
 * @class
 * This class manages the two-pane view. The top pane contains a list view of 
 * items, and the bottom pane contains the selected item content.
 *
 * @author Parag Shah
 * 
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						mailApp						the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmMailListController
 */
ZmDoublePaneController = function(container, mailApp, type, sessionId, searchResultsController) {

	if (arguments.length == 0) { return; }

	ZmMailListController.apply(this, arguments);

	if (this.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
	}
	
	this._listSelectionShortcutDelayAction = new AjxTimedAction(this, this._listSelectionTimedAction);
	this._listeners[ZmOperation.KEEP_READING] = this._keepReadingListener.bind(this);
};

ZmDoublePaneController.prototype = new ZmMailListController;
ZmDoublePaneController.prototype.constructor = ZmDoublePaneController;

ZmDoublePaneController.prototype.isZmDoublePaneController = true;
ZmDoublePaneController.prototype.toString = function() { return "ZmDoublePaneController"; };

ZmDoublePaneController.LIST_SELECTION_SHORTCUT_DELAY = 300;

ZmDoublePaneController.RP_IDS = [ZmSetting.RP_BOTTOM, ZmSetting.RP_RIGHT, ZmSetting.RP_OFF];

ZmDoublePaneController.DEFAULT_TAB_TEXT = ZmMsg.conversation;

/**
 * Displays the given list of mail items in a two-pane view where one pane shows the list
 * and the other shows the currently selected mail item (msg or conv). This method takes
 * care of displaying the list. Displaying an item is typically handled via selection.
 *
 * @param {ZmSearchResults}	results		the current search results
 * @param {ZmMailList}		mailList	list of mail items
 * @param {AjxCallback}		callback	the client callback
 * @param {Boolean}			markRead	if <code>true</code>, mark msg read
 * 
 */
ZmDoublePaneController.prototype.show =
function(results, mailList, callback, markRead) {

	ZmMailListController.prototype.show.call(this, results);
	
	var mlv = this._listView[this._currentViewId];

	// if search was run as a result of a <refresh> block rather than by the user, preserve
	// what's in the reading pane as long as it's still in the list of results
	var s = results && results.search;
	var isRefresh = s && (s.isRefresh || s.isRedo);
	var refreshSelItem = (isRefresh && mlv && mlv.hasItem(s.selectedItem) && s.selectedItem);
	if (this._doublePaneView) {
		if (!refreshSelItem) {
			this._doublePaneView._itemView.reset();
		}
	}
	this.setList(mailList);
	this._setup(this._currentViewId);
	mlv = this._listView[this._currentViewId]; //might have been created in the _setup call
	mlv.reset(); //called to reset the groups (in case "group by" is used, to clear possible previous items in it - bug 77154

	this._displayResults(this._currentViewId, null, refreshSelItem);

	if (refreshSelItem) {
		mlv.setSelection(refreshSelItem, true);
		this._resetOperations(this._toolbar[this._currentViewId], 1)
	}
	else {
		var dpv = this._doublePaneView;
		var readingPaneOn = this.isReadingPaneOn();
		if (dpv.isReadingPaneVisible() != readingPaneOn) {
			dpv.setReadingPane();
		}
		// clear the item view, unless it's showing something selected
		if (!this._itemViewCurrent()) {
			dpv.clearItem();
		}
	}

	if (callback) {
		callback.run();
	}
};

// returns true if the item shown in the reading pane is selected in the list view
ZmDoublePaneController.prototype._itemViewCurrent =
function() {

	var dpv = this._doublePaneView;
	var mlv = dpv._mailListView;
	mlv._restoreState();
	var item = dpv.getItem();
	if (item) {
		var sel = mlv.getSelection();
		for (var i = 0, len = sel.length; i < len; i++) {
			var listItem = sel[i];
			if (listItem.id == item.id) {
				return true;
			}
		}
	}
	return false;
};

ZmDoublePaneController.prototype.switchView =
function(view, force) {
	if (view === ZmSetting.RP_OFF || view === ZmSetting.RP_BOTTOM || view === ZmSetting.RP_RIGHT) {
		this._mailListView._colHeaderActionMenu = null;
		var oldView = this._getReadingPanePref();
		if (view !== oldView) {
			var convView = this._convView;
			if (convView) {
				var replyView = convView._replyView;
				if (replyView && view === ZmSetting.RP_OFF) {
					// reset the replyView with the warning before turning off the pane
					if (!force && !convView._controller.popShield(null, this.switchView.bind(this, view, true))) {
						// redo setChecked on the oldView menu item if user cancels
						this._readingPaneViewMenu.getMenuItem(oldView)._setChecked(true);
						return;
					}
					this._readingPaneViewMenu.getMenuItem(view)._setChecked(true);
					replyView.reset();
				}
			}
			this._setReadingPanePref(view);
			this._doublePaneView.setReadingPane(true);
			if (replyView && view !== ZmSetting.RP_OFF) {
				replyView._resized();
			}
		}
	} else {
		ZmMailListController.prototype.switchView.apply(this, arguments);
	}
	this._resetNavToolBarButtons();
};

/**
 * Clears the conversation view, which actually just clears the message view.
 */
ZmDoublePaneController.prototype.reset =
function() {
	if (this._doublePaneView) {
		this._doublePaneView.reset();
	}
	var lv = this._listView[this._currentViewId];
	if (lv) {
		lv._itemToSelect = lv._selectedItem = null;
	}
};

ZmDoublePaneController.prototype._handleResponseSwitchView =
function(item) {
	this._doublePaneView.setItem(item);
};

// called after a delete has occurred. 
// Return value indicates whether view was popped as a result of a delete
ZmDoublePaneController.prototype.handleDelete = 
function() {
	return false;
};

ZmDoublePaneController.prototype.handleKeyAction =
function(actionCode, ev) {

	DBG.println(AjxDebug.DBG3, "ZmDoublePaneController.handleKeyAction");
	var lv = this._listView[this._currentViewId];

	switch (actionCode) {

		case DwtKeyMap.SELECT_NEXT:
		case DwtKeyMap.SELECT_PREV:
			if (lv) {
				return lv.handleKeyAction(actionCode, ev);
			}
			break;

		default:
			return ZmMailListController.prototype.handleKeyAction.apply(this, arguments);
	}
	return true;
};

// Private and protected methods

ZmDoublePaneController.prototype._createDoublePaneView = 
function() {
	// overload me
};

// Creates the conv view, which is not a standard list view (it's a two-pane
// sort of thing).
ZmDoublePaneController.prototype._initialize =
function(view) {
	// set up double pane view (which creates the MLV and MV)
	if (!this._doublePaneView){
		var dpv = this._doublePaneView = this._createDoublePaneView();
		this._mailListView = dpv.getMailListView();
		dpv.addInviteReplyListener(this._inviteReplyListener);
		dpv.addShareListener(this._shareListener);
		dpv.addSubscribeListener(this._subscribeListener);
	}

	ZmMailListController.prototype._initialize.call(this, view);
};

ZmDoublePaneController.prototype._initializeNavToolBar =
function(view) {
	var toolbar = this._toolbar[view];
	this._itemCountText[ZmSetting.RP_BOTTOM] = toolbar.getButton(ZmOperation.TEXT);
	if (AjxEnv.isFirefox) {
		this._itemCountText[ZmSetting.RP_BOTTOM].setScrollStyle(Dwt.CLIP);
	}
};

ZmDoublePaneController.prototype._getRightSideToolBarOps =
function() {
	var list = [];
	if (appCtxt.isChildWindow) {
		return list;
	}
	list.push(ZmOperation.KEEP_READING);
	list.push(ZmOperation.VIEW_MENU);
	return list;
};

ZmDoublePaneController.prototype._getActionMenuOps =
function() {
	var list = [];
	list = list.concat(this._msgOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._deleteOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._standardActionMenuOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._flagOps());
	list.push(ZmOperation.SEP);
    list.push(ZmOperation.REDIRECT);
    list.push(ZmOperation.EDIT_AS_NEW);		// bug #28717
	list.push(ZmOperation.SEP);
	list = list.concat(this._createOps());
	list.push(ZmOperation.SEP);
	list = list.concat(this._otherOps());
	if (this.getCurrentViewType() == ZmId.VIEW_TRAD) {
		list.push(ZmOperation.SHOW_CONV);
	}
    //list.push(ZmOperation.QUICK_COMMANDS);
	return list;
};

// Returns the already-created message list view.
ZmDoublePaneController.prototype._createNewView = 
function() {
	if (this._mailListView && this._dragSrc) {
		this._mailListView.setDragSource(this._dragSrc);
	}
	return this._mailListView;
};

/**
 * Returns the double-pane view.
 * 
 * @return {ZmDoublePaneView}	double-pane view
 */
ZmDoublePaneController.prototype.getCurrentView = 
function() {
	return this._doublePaneView;
};
ZmDoublePaneController.prototype.getReferenceView = ZmDoublePaneController.prototype.getCurrentView;

/**
 * Returns the item view.
 * 
 * @return {ZmMailItemView}	item view
 */
ZmDoublePaneController.prototype.getItemView = 
function() {
	return this._doublePaneView && this._doublePaneView._itemView;
};

ZmDoublePaneController.prototype._getTagMenuMsg = 
function(num) {
	return AjxMessageFormat.format(ZmMsg.tagMessages, num);
};

ZmDoublePaneController.prototype._getMoveDialogTitle = 
function(num) {
	return AjxMessageFormat.format(ZmMsg.moveMessages, num);
};

// Add reading pane to focus ring
ZmDoublePaneController.prototype._initializeTabGroup =
function(view) {
	if (this._tabGroups[view]) { return; }

	ZmListController.prototype._initializeTabGroup.apply(this, arguments);

	if (this._view[view] !== this.getItemView()) {
		this._tabGroups[view].addMember(this.getItemView().getTabGroupMember());
	}
};

ZmDoublePaneController.prototype._setViewContents =
function(view) {
	this._doublePaneView.setList(this._list);
};

ZmDoublePaneController.prototype._displayItem =
function(item) {

	if (!item._loaded) { return; }

	// cancel timed mark read action on previous msg
	appCtxt.killMarkReadTimer();

	this._doublePaneView.setItem(item);
	this._handleMarkRead(item);
	this._curItem = item;
};
ZmDoublePaneController.prototype._displayMsg = ZmDoublePaneController.prototype._displayItem;


ZmDoublePaneController.prototype._markReadAction =
function(msg) {
	this._doMarkRead([msg], true);
};

ZmDoublePaneController.prototype._preHideCallback =
function() {
	// cancel timed mark read action on view change
	appCtxt.killMarkReadTimer();
	return ZmController.prototype._preHideCallback.call(this);
};

// Adds a "Reading Pane" menu to the View menu
ZmDoublePaneController.prototype._setupReadingPaneMenu =
function(view, menu) {

	var readingPaneMenuItem = menu.createMenuItem(Dwt.getNextId("READING_PANE_"), {
			text:   ZmMsg.readingPane,
			style:  DwtMenuItem.NO_STYLE
		}),
		readingPaneMenu = new ZmPopupMenu(readingPaneMenuItem);

	var miParams = {
		text:           ZmMsg.readingPaneAtBottom,
		style:          DwtMenuItem.RADIO_STYLE,
		radioGroupId:   "RP"
	};
	var ids = ZmDoublePaneController.RP_IDS;
	var pref = this._getReadingPanePref();
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (!readingPaneMenu._menuItems[id]) {
			miParams.text = ZmMailListController.READING_PANE_TEXT[id];
			miParams.image = ZmMailListController.READING_PANE_ICON[id];
			var mi = readingPaneMenu.createMenuItem(id, miParams);
			mi.setData(ZmOperation.MENUITEM_ID, id);
			mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
			if (id == pref) {
				mi.setChecked(true, true);
			}
		}
	}

	readingPaneMenuItem.setMenu(readingPaneMenu);

	return readingPaneMenu;
};

ZmDoublePaneController.prototype._displayResults =
function(view, newTab, refreshSelItem) {

	var elements = this.getViewElements(view, this._doublePaneView);
	
	if (!refreshSelItem) {
		this._doublePaneView.setReadingPane();
	}

	var tabId = newTab && Dwt.getNextId();
	this._setView({ view:		view,
					noPush:		this.isSearchResults,
					viewType:	this._currentViewType,
					elements:	elements,
					hide:		this._elementsToHide,
					tabParams:	newTab && this._getTabParams(tabId, this._tabCallback.bind(this)),
					isAppView:	this._isTopLevelView()});
	if (this.isSearchResults) {
		// if we are switching views, make sure app view mgr is up to date on search view's components
		appCtxt.getAppViewMgr().setViewComponents(this.searchResultsController.getCurrentViewId(), elements, true);
	}
	this._resetNavToolBarButtons(view);

	if (newTab) {
		var buttonText = (this._conv && this._conv.subject) ? this._conv.subject.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT) : ZmDoublePaneController.DEFAULT_TAB_TEXT;
		var avm = appCtxt.getAppViewMgr();
		avm.setTabTitle(view, buttonText);
	}
				
	// always allow derived classes to reset size after loading
	var sz = this._doublePaneView.getSize();
	this._doublePaneView._resetSize(sz.x, sz.y);
};

ZmDoublePaneController.prototype._getTabParams =
function(tabId, tabCallback) {
	return {
		id:				tabId,
		image:			"ConvView",
		textPrecedence:	85,
		tooltip:		ZmDoublePaneController.DEFAULT_TAB_TEXT,
		tabCallback:	tabCallback
	};
};


/**
 * Loads and displays the given message. If the message was unread, it gets marked as
 * read, and the conversation may be marked as read as well. Note that we request no
 * busy overlay during the SOAP call - that's so that a subsequent click within the
 * double-click threshold can be processed. Otherwise, it's very difficult to generate
 * a double click because the first click triggers a SOAP request and the ensuing busy
 * overlay blocks the receipt of the second click.
 * 
 * @param msg	[ZmMailMsg]		msg to load
 * 
 * @private
 */
ZmDoublePaneController.prototype._doGetMsg =
function(msg) {
	if (!msg) { return; }
	if (msg.id == this._pendingMsg) { return; }

	msg._loadPending = true;
	this._pendingMsg = msg.id;
	var respCallback = new AjxCallback(this, this._handleResponseDoGetMsg, msg);
	msg.load({callback:respCallback, noBusyOverlay:true});
};

ZmDoublePaneController.prototype._handleResponseDoGetMsg =
function(msg) {
	if (this._pendingMsg && (msg.id != this._pendingMsg)) { return; }
	msg._loadPending = false;
	this._pendingMsg = null;
	this._doublePaneView.setItem(msg);
};

ZmDoublePaneController.prototype._resetOperations =
function(parent, num) {
	ZmMailListController.prototype._resetOperations.call(this, parent, num);
	var isDraft = this.isDraftsFolder();
	if (num == 1) {
		var item = this._mailListView.getSelection()[0];
		if (item) {
			isDraft = item.isDraft;
		}
		parent.enable(ZmOperation.SHOW_ORIG, true);
		if (appCtxt.get(ZmSetting.FILTERS_ENABLED)) {
			var isSyncFailuresFolder = this.isSyncFailuresFolder();
			parent.enable(ZmOperation.ADD_FILTER_RULE, !isSyncFailuresFolder);
		}
	}

	parent.enable(ZmOperation.DETACH, (appCtxt.get(ZmSetting.DETACH_MAILVIEW_ENABLED) && num == 1 && !isDraft));
	parent.enable(ZmOperation.TEXT, true);
	parent.enable(ZmOperation.KEEP_READING, this._keepReading(true));

	if (appCtxt.isWebClientOffline()) {
		parent.enable(
			[
				ZmOperation.ACTIONS_MENU,
				ZmOperation.VIEW_MENU,
				ZmOperation.DETACH,
				ZmOperation.SHOW_ORIG,
				ZmOperation.SHOW_CONV,
				ZmOperation.PRINT,
				ZmOperation.ADD_FILTER_RULE,
				ZmOperation.CREATE_APPT,
				ZmOperation.CREATE_TASK,
				ZmOperation.CONTACT,
				ZmOperation.REDIRECT
			],
			false
		);
	}
};

ZmDoublePaneController.prototype._resetOperation = 
function(parent, op, num) {
	if (parent && op == ZmOperation.KEEP_READING) {
		parent.enable(ZmOperation.KEEP_READING, this._keepReading(true));
	}
};

// top level view means this view is allowed to get shown when user clicks on 
// app icon in app toolbar - overload to not allow this.
ZmDoublePaneController.prototype._isTopLevelView = 
function() {
	var sessionId = this.getSessionId();
	return (!sessionId || (sessionId == ZmApp.MAIN_SESSION));
};

// All items in the list view are gone - show "No Results" and clear reading pane
ZmDoublePaneController.prototype._handleEmptyList =
function(listView) {
	this.reset();
	ZmMailListController.prototype._handleEmptyList.apply(this, arguments);
};

// List listeners

// Clicking on a message in the message list loads and displays it.
ZmDoublePaneController.prototype._listSelectionListener =
function(ev) {

	var handled = ZmMailListController.prototype._listSelectionListener.call(this, ev);
	
	var currView = this._listView[this._currentViewId];

	if (!handled && ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var item = ev.item;
		if (!item) { return; }

		var cs = appCtxt.isOffline && appCtxt.getCurrentSearch();
		if (cs && cs.isMultiAccount()) {
			appCtxt.accountList.setActiveAccount(item.getAccount());
		}

		var div = this._mailListView.getTargetItemDiv(ev);
		this._mailListView._itemSelected(div, ev);

		if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
			this._mailListView.setSelectionHdrCbox(false);
		}

		var respCallback = new AjxCallback(this, this._handleResponseListSelectionListener, item);
		var folder = appCtxt.getById(item.getFolderId());
		if (item.isDraft && folder && folder.id == ZmFolder.ID_DRAFTS && (!folder || !folder.isReadOnly())) {
			this._doAction({ev:ev, action:ZmOperation.DRAFT});
			return true;
		} else if (appCtxt.get(ZmSetting.OPEN_MAIL_IN_NEW_WIN)) {
			this._detachListener(null, respCallback);
			return true;
		} else {
			var respCallback =
				this._handleResponseListSelectionListener.bind(this, item);
			var ctlr =
				AjxDispatcher.run(item.type === ZmItem.CONV ?
				                  "GetConvController" : "GetMsgController",
				                  item.nId);
			ctlr.show(item, this, respCallback, true);
			return true;
		}
	} else if (!handled) {
		if (this.isReadingPaneOn()) {
			// Give the user a chance to zip around the list view via shortcuts without having to
			// wait for each successively selected msg to load, by waiting briefly for more list
			// selection shortcut actions. An event will have the 'kbNavEvent' property set if it's
			// the result of a shortcut.
			if (ev.kbNavEvent && ZmDoublePaneController.LIST_SELECTION_SHORTCUT_DELAY) {
				if (this._listSelectionShortcutDelayActionId) {
					AjxTimedAction.cancelAction(this._listSelectionShortcutDelayActionId);
				}
				this._listSelectionShortcutDelayActionId = AjxTimedAction.scheduleAction(this._listSelectionShortcutDelayAction,
																						 ZmDoublePaneController.LIST_SELECTION_SHORTCUT_DELAY);
			} else {
				this._setSelectedItem();
			}
			return true;
		} else {
			var msg = currView.getSelection()[0];
			if (msg) {
				this._doublePaneView.resetMsg(msg);
			}
		}
	}

	return handled;
};

ZmDoublePaneController.prototype._handleResponseListSelectionListener =
function(item) {
	if (item.type == ZmItem.MSG && item._loaded && item.isUnread &&
		(appCtxt.get(ZmSetting.MARK_MSG_READ) == ZmSetting.MARK_READ_NOW)) {

		this._list.markRead([item], true);
	}
	// make sure correct msg is displayed in msg pane when user returns
	this._setSelectedItem();
};

ZmDoublePaneController.prototype._listSelectionTimedAction =
function() {
	if (this._listSelectionShortcutDelayActionId) {
		AjxTimedAction.cancelAction(this._listSelectionShortcutDelayActionId);
	}
	this._setSelectedItem();
};

/**
 * Handles selection of a row by loading the item.
 * 
 * @param {hash}	params		params for loading the item
 * 
 * @private
 */
ZmDoublePaneController.prototype._setSelectedItem =
function(params) {
	var selCnt = this._listView[this._currentViewId].getSelectionCount();
	if (selCnt == 1) {
		var respCallback = this._handleResponseSetSelectedItem.bind(this);
		this._getLoadedMsg(params, respCallback);
	}
};

ZmDoublePaneController.prototype._handleResponseSetSelectedItem =
function(msg) {

	if (msg) {
		// bug 41196
		if (appCtxt.isOffline) {
			// clear the new-mail badge every time user reads a msg regardless
			// of number of unread messages across all accounts
			this._app.clearNewMailBadge();

			// offline mode, reset new mail notifier if user reads a msg from that account
			var acct = msg.getAccount();

			// bug: 46873 - set active account when user clicks on item w/in cross-account search
			var cs = appCtxt.getCurrentSearch();
			if (cs && cs.isMultiAccount()) {
				var active = acct || appCtxt.accountList.defaultAccount
				appCtxt.accountList.setActiveAccount(active);
			}

			if (acct && acct.inNewMailMode) {
				acct.inNewMailMode = false;
				var allContainers = appCtxt.getOverviewController()._overviewContainer;
				for (var i in allContainers) {
					allContainers[i].updateAccountInfo(acct, true, true);
				}
			}
		}

		if (!this.isReadingPaneOn()) {
			return;
		}
		// make sure list view has this msg
		var lv = this._listView[this._currentViewId];
		var id = (lv.type == ZmItem.CONV && msg.type == ZmItem.MSG) ? msg.cid : msg.id;
		if (lv.hasItem(id)) {
			this._displayMsg(msg);
		}
	}
};

ZmDoublePaneController.prototype._listActionListener =
function(ev) {
	ZmMailListController.prototype._listActionListener.call(this, ev);

	if (!this.isReadingPaneOn()) {
		// reset current message
		var msg = this._listView[this._currentViewId].getSelection()[0];
		if (msg) {
			this._doublePaneView.resetMsg(msg);
		}
	}
};

ZmDoublePaneController.prototype._doDelete =
function(items, hardDelete, attrs, confirmDelete) {
	this._listView[this._currentViewId]._itemToSelect = this._getNextItemToSelect();
	ZmMailListController.prototype._doDelete.apply(this, arguments);
};

ZmDoublePaneController.prototype._doMove =
function(items, destinationFolder, attrs, isShiftKey) {

	// if user moves a non-selected item via DnD, don't change selection
	var dndUnselectedItem = false;
	if (items && items.length == 1) {
		var lv = this.getListView();
		var selection = lv && lv.getSelection();
		if (selection && selection.length) {
			dndUnselectedItem = true;
			var moveItem = items[0];
			var id = moveItem.id;
			var msgIdMap = {};
			var numSelectedInConv = 0;
			if ((moveItem.type === ZmId.ITEM_CONV) && moveItem.msgIds) {
				// If the moved item is a conversation, we need to check whether the selected items are all messages
				// within the conversation.  Create a hash for more efficient testing.
				for (var i = 0; i < moveItem.msgIds.length; i++) {
					msgIdMap[moveItem.msgIds[i]] = true;
				}
			}
			// AjxUtil.intersection doesn't work with objects, so check IDs
			for (var i = 0; i < selection.length; i++) {
				if (selection[i].id == id) {
					dndUnselectedItem = false;
				}
				if (msgIdMap[selection[i].id]) {
					numSelectedInConv++;
				}
			}
			if (numSelectedInConv == selection.length) {
				// All the selected items are messages within a moved conversation, use the normal getNextItemToSelect
				dndUnselectedItem = false;
			}
		}
	}		
	if (!dndUnselectedItem) {
		this._listView[this._currentViewId]._itemToSelect = this._getNextItemToSelect();
	}
	ZmMailListController.prototype._doMove.apply(this, arguments);
};

ZmDoublePaneController.prototype._keepReadingListener =
function(ev) {
	this.handleKeyAction(ZmKeyMap.KEEP_READING, ev);
};

ZmDoublePaneController.prototype._keepReading = function(ev) {};

// Set enabled state of the KEEP_READING button
ZmDoublePaneController.prototype._checkKeepReading =
function() {
	// done on timer so item view has had change to lay out and resize
	setTimeout(this._resetOperation.bind(this, this._toolbar[this._currentViewId], ZmOperation.KEEP_READING), 250);
};

ZmDoublePaneController.handleScroll =
function(ev) {
	var target = DwtUiEvent.getTarget(ev);
	var messagesView = DwtControl.findControl(target);
	var controller = messagesView && messagesView._controller;
	if (controller && controller._checkKeepReading) {
		controller._checkKeepReading();
	}
};

ZmDoublePaneController.prototype._dragListener =
function(ev) {
	ZmListController.prototype._dragListener.call(this, ev);
	if (ev.action == DwtDragEvent.DRAG_END) {
		this._resetOperations(this._toolbar[this._currentViewId], this._doublePaneView.getSelection().length);
	}
};

ZmDoublePaneController.prototype._draftSaved =
function(msg, resp) {
	if (resp) {
		if (!msg) {
			msg = new ZmMailMsg();
		}
		msg._loadFromDom(resp);
	}
	appCtxt.cacheSet(msg.id, msg);
	this._redrawDraftItemRows(msg);
	var displayedMsg = this._doublePaneView.getMsg();
	if (displayedMsg && displayedMsg.id == msg.id) {
		this._doublePaneView.reset();
		this._doublePaneView.setItem(msg, null, true);
	}
};

ZmDoublePaneController.prototype._redrawDraftItemRows =
function(msg) {
	this._listView[this._currentViewId].redrawItem(msg);
	this._listView[this._currentViewId].setSelection(msg, true);
};

ZmDoublePaneController.prototype.selectFirstItem =
function() {
	this._doublePaneView._selectFirstItem();
};

ZmDoublePaneController.prototype._getDefaultFocusItem =
function() {
	return this.getListView();
};

/**
 * Returns the item that should be selected after a move/delete. Finds
 * the first non-selected item after the first selected item.
 *
 * @param	{hash}		omit		hash of item IDs to exclude from being next selected item
 */
ZmDoublePaneController.prototype._getNextItemToSelect =
function(omit) {

	omit = omit || {};
	var listView = this._listView[this._currentViewId];
	var numSelected = listView.getSelectionCount();
	if (numSelected) {
		var selection = listView.getSelection();
		var selIds = {};
		for (var i = 0; i < selection.length; i++) {
			selIds[selection[i].id] = true;
		}
		var setting = appCtxt.get(ZmSetting.SELECT_AFTER_DELETE);
		var goingUp = (setting == ZmSetting.DELETE_SELECT_PREV || (setting == ZmSetting.DELETE_SELECT_ADAPT &&
						(this.lastListAction == DwtKeyMap.SELECT_PREV || this.lastListAction == ZmKeyMap.PREV_UNREAD)));
		if (goingUp && (numSelected == 1)) {
			var idx = listView._getRowIndex(selection[selection.length - 1]);
			var childNodes = listView._parentEl.childNodes;
			for (var i = idx - 1; i >= 0; i--) {
				var item = listView.getItemFromElement(childNodes[i]);
				if (item && !selIds[item.id] && !omit[item.id] && !(item.cid && (selIds[item.cid] || omit[item.cid]))) {
					return item;
				}
			}
			return ZmMailListView.FIRST_ITEM;
		} else {
			var idx = listView._getRowIndex(selection[0]);
			var childNodes = listView._parentEl.childNodes;
			for (var i = idx + 1; i < childNodes.length; i++) {
				var item = listView.getItemFromElement(childNodes[i]);
				if (item && !selIds[item.id] && !omit[item.id] && !(item.cid && (selIds[item.cid] || omit[item.cid]))) {
					return item;
				}
			}
			return ZmMailListView.LAST_ITEM;
		}
	}
	return ZmMailListView.FIRST_ITEM;	
};

ZmDoublePaneController.prototype._setItemCountText =
function(text) {

	text = text || this._getItemCountText();

	var rpr = (this._getReadingPanePref() == ZmSetting.RP_RIGHT);
	if (this._itemCountText[ZmSetting.RP_RIGHT]) {
		this._itemCountText[ZmSetting.RP_RIGHT].setText(rpr ? text : "");
	}
	if (this._itemCountText[ZmSetting.RP_BOTTOM]) {
		this._itemCountText[ZmSetting.RP_BOTTOM].setText(rpr ? "" : text);
	}
};

ZmDoublePaneController.prototype._postShowCallback =
function() {

	ZmMailListController.prototype._postShowCallback.apply(this, arguments);
	var dpv = this._doublePaneView;
	if (dpv && dpv.isStale && dpv._staleHandler) {
		dpv._staleHandler();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.controller.ZmConvListController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a new, empty conversation list controller.
 * @constructor
 * @class
 * This class manages the conversations mail view. Conversations are listed, and any
 * conversation with more than one message is expandable. Expanding a conversation
 * shows its messages in the list just below it.
 *
 * @author Conrad Damon
 *
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						mailApp						the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmDoublePaneController
 */
ZmConvListController = function(container, mailApp, type, sessionId, searchResultsController) {
	ZmDoublePaneController.apply(this, arguments);
};

ZmConvListController.prototype = new ZmDoublePaneController;
ZmConvListController.prototype.constructor = ZmConvListController;

ZmConvListController.prototype.isZmConvListController = true;
ZmConvListController.prototype.toString = function() { return "ZmConvListController"; };

ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.FIRST_UNREAD_MSG]	= DwtKeyMap.SELECT_FIRST;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.LAST_UNREAD_MSG]	= DwtKeyMap.SELECT_LAST;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.NEXT_UNREAD_MSG]	= DwtKeyMap.SELECT_NEXT;
ZmMailListController.ACTION_CODE_WHICH[ZmKeyMap.PREV_UNREAD_MSG]	= DwtKeyMap.SELECT_PREV;

ZmMailListController.GROUP_BY_SETTING[ZmId.VIEW_CONVLIST]	= ZmSetting.GROUP_BY_CONV;

// view menu
ZmMailListController.GROUP_BY_ICON[ZmId.VIEW_CONVLIST]		= "ConversationView";
ZmMailListController.GROUP_BY_MSG_KEY[ZmId.VIEW_CONVLIST]	= "byConversation";
ZmMailListController.GROUP_BY_SHORTCUT[ZmId.VIEW_CONVLIST]	= ZmKeyMap.VIEW_BY_CONV;
ZmMailListController.GROUP_BY_VIEWS.push(ZmId.VIEW_CONVLIST);

// Public methods

ZmConvListController.getDefaultViewType =
function() {
	return ZmId.VIEW_CONVLIST;
};
ZmConvListController.prototype.getDefaultViewType = ZmConvListController.getDefaultViewType;

/**
 * Displays the given conversation list in a two-pane view.
 *
 * @param {ZmSearchResult}	searchResults		the current search results
 */
ZmConvListController.prototype.show =
function(searchResults, force) {
	
	if (!force && !this.popShield(null, this.show.bind(this, searchResults, true))) {
		return;
	}
	
	ZmDoublePaneController.prototype.show.call(this, searchResults, searchResults.getResults(ZmItem.CONV));
	if (!appCtxt.isExternalAccount() && !this.isSearchResults && !(searchResults && searchResults.search && searchResults.search.isDefaultToMessageView)) {
		appCtxt.set(ZmSetting.GROUP_MAIL_BY, ZmSetting.GROUP_BY_CONV);
	}
};

/**
 * Handles switching the order of messages within expanded convs.
 *
 * @param view		[constant]*		the id of the new order
 * @param force		[boolean]		if true, always redraw view
 */
ZmConvListController.prototype.switchView =
function(view, force) {

	if (view == ZmSearch.DATE_DESC || view == ZmSearch.DATE_ASC) {
		if (!force && !this.popShield(null, this.switchView.bind(this, view, true))) {
			return;
		}
		if ((appCtxt.get(ZmSetting.CONVERSATION_ORDER) != view) || force) {
			appCtxt.set(ZmSetting.CONVERSATION_ORDER, view);
			if (this._currentViewType == ZmId.VIEW_CONVLIST) {
				this._mailListView.redoExpansion();
			}
			var itemView = this.getItemView();
			var conv = itemView && itemView.getItem();
			if (conv) {
				itemView.set(conv);
			}
		}
	} else {
		ZmDoublePaneController.prototype.switchView.apply(this, arguments);
	}
};

// Internally we manage two maps, one for CLV and one for CV2 (if applicable)
ZmConvListController.prototype.getKeyMapName = function() {
	// if user is quick replying, don't use the mapping of conv/mail list - so Ctrl+Z works
	return this._convView && this._convView.isActiveQuickReply() ? ZmKeyMap.MAP_QUICK_REPLY : ZmKeyMap.MAP_CONVERSATION_LIST;
};

ZmConvListController.prototype.handleKeyAction =
function(actionCode, ev) {

	DBG.println(AjxDebug.DBG3, "ZmConvListController.handleKeyAction");
	
	var mlv = this._mailListView,
	    capsuleEl = DwtUiEvent.getTargetWithClass(ev, 'ZmMailMsgCapsuleView'),
        activeEl = document.activeElement,
        isFooterActionLink = activeEl && activeEl.id.indexOf(ZmId.MV_MSG_FOOTER) !== -1;
	
	switch (actionCode) {

        case DwtKeyMap.DBLCLICK:
            // if link has focus, Enter should be same as click
            if (isFooterActionLink) {
                activeEl.click();
            }
            else {
                return ZmDoublePaneController.prototype.handleKeyAction.apply(this, arguments);
            }
            break;

		case ZmKeyMap.EXPAND:
		case ZmKeyMap.COLLAPSE:
			if (capsuleEl) {
                // if a footer link has focus, move among those links
                if (isFooterActionLink) {
                    var msgView = DwtControl.findControl(activeEl);
                    if (msgView && msgView.isZmMailMsgCapsuleView) {
                        msgView._focusLink(actionCode === ZmKeyMap.COLLAPSE, activeEl);
                    }
                }
                // otherwise expand or collapse the msg view
                else {
                    var capsule = DwtControl.fromElement(capsuleEl);
                    if ((actionCode === ZmKeyMap.EXPAND) !== capsule.isExpanded()) {
                        capsule._toggleExpansion();
                    }
                }

				break;
			}
//			if (mlv.getSelectionCount() != 1) { return false; }
			var item = mlv.getItemFromElement(mlv._kbAnchor);
			if (!item) {
                return false;
            }
			if ((actionCode == ZmKeyMap.EXPAND) != mlv.isExpanded(item)) {
				mlv._expandItem(item);
			}
			break;

		case ZmKeyMap.TOGGLE:
			if (capsuleEl) {
				DwtControl.fromElement(capsuleEl)._toggleExpansion();
				break;
			}
//			if (mlv.getSelectionCount() != 1) { return false; }
			var item = mlv.getItemFromElement(mlv._kbAnchor);
			if (!item) { return false; }
			if (mlv._isExpandable(item)) {
				mlv._expandItem(item);
			}
			break;

		case ZmKeyMap.EXPAND_ALL:
		case ZmKeyMap.COLLAPSE_ALL:
			var expand = (actionCode == ZmKeyMap.EXPAND_ALL);
			if (capsuleEl) {
				DwtControl.fromElement(capsuleEl).parent.setExpanded(expand);
			}
            else {
				mlv._expandAll(expand);
			}
			break;

		case ZmKeyMap.NEXT_UNREAD_MSG:
		case ZmKeyMap.PREV_UNREAD_MSG:
			this.lastListAction = actionCode;
			var selItem, noBump = false;
			if (mlv.getSelectionCount() == 1) {
				var sel = mlv.getSelection();
				selItem = sel[0];
				if (selItem && mlv._isExpandable(selItem)) {
					noBump = true;
				}
			}

		case ZmKeyMap.FIRST_UNREAD_MSG:
		case ZmKeyMap.LAST_UNREAD_MSG:
			var item = (selItem && selItem.type == ZmItem.MSG && noBump) ? selItem :
					   this._getUnreadItem(ZmMailListController.ACTION_CODE_WHICH[actionCode], null, noBump);
			if (!item) { return; }
			if (!mlv.isExpanded(item) && mlv._isExpandable(item)) {
				var callback = new AjxCallback(this, this._handleResponseExpand, [actionCode]);
				if (item.type == ZmItem.MSG) {
					this._expand({conv:appCtxt.getById(item.cid), msg:item, offset:mlv._msgOffset[item.id], callback:callback});
				} else {
					this._expand({conv:item, callback:callback});
				}
			} else if (item) {
				this._selectItem(mlv, item);
			}
			break;
		
		case ZmKeyMap.KEEP_READING:
			return this._keepReading(false, ev);
			break;

		// these are for quick reply
		case ZmKeyMap.SEND:
			if (!appCtxt.get(ZmSetting.USE_SEND_MSG_SHORTCUT)) {
				break;
			}
			var itemView = this.getItemView();
			if (itemView && itemView._sendListener) {
				itemView._sendListener();
			}
			break;

		// do this last since we want CANCEL to bubble up if not handled
		case ZmKeyMap.CANCEL:
			var itemView = this.getItemView();
			if (itemView && itemView._cancelListener && itemView._replyView && itemView._replyView.getVisible()) {
				itemView._cancelListener();
				break;
			}

		default:
			return ZmDoublePaneController.prototype.handleKeyAction.apply(this, arguments);
	}
	return true;
};

ZmConvListController.prototype._handleResponseExpand =
function(actionCode) {
	var unreadItem = this._getUnreadItem(ZmMailListController.ACTION_CODE_WHICH[actionCode], ZmItem.MSG);
	if (unreadItem) {
		this._selectItem(this._mailListView, unreadItem);
	}
};

ZmConvListController.prototype._keepReading =
function(check, ev) {

	if (!this.isReadingPaneOn() || !this._itemViewCurrent()) { return false; }
	var mlv = this._mailListView;
	if (!mlv || mlv.getSelectionCount() != 1) { return false; }
	
	var result = false;
	var itemView = this.getItemView();
	// conv view
	if (itemView && itemView.isZmConvView2) {
		result = itemView._keepReading(check);
		result = result || (check ? !!(this._getUnreadItem(DwtKeyMap.SELECT_NEXT)) :
									   this.handleKeyAction(ZmKeyMap.NEXT_UNREAD, ev));
	}
	// msg view (within an expanded conv)
	else if (itemView && itemView.isZmMailMsgView) {
		var result = itemView._keepReading(check);
		if (!check || !result) {
			// go to next unread msg in this expanded conv, otherwise next unread conv
			var msg = mlv.getSelection()[0];
			var conv = msg && appCtxt.getById(msg.cid);
			var msgList = conv && conv.msgs && conv.msgs.getArray();
			var msgFound, item;
			if (msgList && msgList.length) {
				for (var i = 0; i < msgList.length; i++) {
					var m = msgList[i];
					msgFound = msgFound || (m.id == msg.id);
					if (msgFound && m.isUnread) {
						item = m;
						break;
					}
				}
			}
			if (item) {
				result = true;
				if (!check) {
					this._selectItem(mlv, item);
				}
			}
			else {
				result = check ? !!(this._getUnreadItem(DwtKeyMap.SELECT_NEXT)) :
									this.handleKeyAction(ZmKeyMap.NEXT_UNREAD, ev);
			}
		}
	}
	if (!check && result) {
		this._checkKeepReading();
	}
	return result;
};

/**
 * Override to handle paging among msgs within an expanded conv.
 * 
 * TODO: handle msg paging (current item is expandable msg)
 * 
 * @private
 */
ZmConvListController.prototype.pageItemSilently =
function(currentItem, forward) {
	if (!currentItem) { return; }
	if (currentItem.type == ZmItem.CONV) {
		ZmMailListController.prototype.pageItemSilently.apply(this, arguments);
		return;
	}
	
	var conv = appCtxt.getById(currentItem.cid);
	if (!(conv && conv.msgs)) { return; }
	var found = false;
	var list = conv.msgs.getArray();
	for (var i = 0, count = list.length; i < count; i++) {
		if (list[i] == currentItem) {
			found = true;
			break;
		}
	}
	if (!found) { return; }
	
	var msgIdx = forward ? i + 1 : i - 1;
	if (msgIdx >= 0 && msgIdx < list.length) {
		var msg = list[msgIdx];
		var clv = this._listView[this._currentViewId];
		clv.emulateDblClick(msg);
	}
};

// Private methods

ZmConvListController.prototype._createDoublePaneView = 
function() {
	var dpv = new ZmConvDoublePaneView({
		parent:		this._container,
		posStyle:	Dwt.ABSOLUTE_STYLE,
		controller:	this,
		dropTgt:	this._dropTgt
	});
	this._convView = dpv._itemView;
	return dpv;
};

ZmConvListController.prototype._paginate = 
function(view, bPageForward, convIdx, limit) {
	view = view || this._currentViewId;
	return ZmDoublePaneController.prototype._paginate.call(this, view, bPageForward, convIdx, limit);
};

ZmConvListController.prototype._resetNavToolBarButtons =
function(view) {
	view = view || this.getCurrentViewId();
	ZmDoublePaneController.prototype._resetNavToolBarButtons.call(this, view);
	if (!this._navToolBar[view]) { return; }
	this._navToolBar[view].setToolTip(ZmOperation.PAGE_BACK, ZmMsg.previousPage);
	this._navToolBar[view].setToolTip(ZmOperation.PAGE_FORWARD, ZmMsg.nextPage);
};

ZmConvListController.prototype._setupConvOrderMenu =
function(view, menu) {

	var convOrderMenuItem = menu.createMenuItem(Dwt.getNextId("CONV_ORDER_"), {
			text:   ZmMsg.expandConversations,
			style:  DwtMenuItem.NO_STYLE
		}),
		convOrderMenu = new ZmPopupMenu(convOrderMenuItem);

	var ids = [ ZmMailListController.CONV_ORDER_DESC, ZmMailListController.CONV_ORDER_ASC ];
	var setting = appCtxt.get(ZmSetting.CONVERSATION_ORDER);
	var miParams = {
		style:          DwtMenuItem.RADIO_STYLE,
		radioGroupId:   "CO"
	};
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (!convOrderMenu._menuItems[id]) {
			miParams.text = ZmMailListController.CONV_ORDER_TEXT[id];
			var mi = convOrderMenu.createMenuItem(id, miParams);
			mi.setData(ZmOperation.MENUITEM_ID, id);
			mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
			mi.setChecked((setting == id), true);
		}
	}

	convOrderMenuItem.setMenu(convOrderMenu);

	return convOrderMenu;
};

// no support for showing total items, which are msgs
ZmConvListController.prototype._getNumTotal = function() { return null; }

ZmConvListController.prototype._preUnloadCallback =
function(view) {
	return !(this._convView && this._convView.isDirty());
};

ZmConvListController.prototype._preHideCallback =
function(viewId, force, newViewId) {
	return force ? true : this.popShield(viewId, null, newViewId);
};

ZmConvListController.prototype._getActionMenuOps = function() {

	var list = ZmDoublePaneController.prototype._getActionMenuOps.apply(this, arguments),
		index = AjxUtil.indexOf(list, ZmOperation.FORWARD);

	if (index !== -1) {
		list.splice(index + 1, 0, ZmOperation.FORWARD_CONV);
	}
	return list;
};

ZmConvListController.prototype._getSecondaryToolBarOps = function() {

	var list = ZmDoublePaneController.prototype._getSecondaryToolBarOps.apply(this, arguments),
		index = AjxUtil.indexOf(list, ZmOperation.EDIT_AS_NEW);

	if (index !== -1 && appCtxt.get(ZmSetting.FORWARD_MENU_ENABLED)) {
		list.splice(index + 1, 0, ZmOperation.FORWARD_CONV);
	}
	return list;
};

ZmConvListController.prototype._resetOperations = function(parent, num) {
	ZmDoublePaneController.prototype._resetOperations.apply(this, arguments);
	this._resetForwardConv(parent, num);
};

ZmConvListController.prototype._resetForwardConv = function(parent, num) {

	var doShow = true,      // show if 'forward conv' applies at all
		doEnable = false;   // enable if conv has multiple msgs

	if (num == null || num === 1) {

		var mlv = this._mailListView,
			item = this._conv || mlv.getSelection()[0];

		if (item && item.type === ZmItem.CONV) {
			if (mlv && mlv._getDisplayedMsgCount(item) > 1) {
				doEnable = true;
			}
		}
		else {
			doShow = false;
		}
	}
	var op = parent.getOp(ZmOperation.FORWARD_CONV);
	if (op) {
		op.setVisible(doShow);
		parent.enable(ZmOperation.FORWARD_CONV, doEnable);
	}
};


/**
 * Figure out if the given view change is destructive. If so, put up pop shield.
 * 
 * @param {string}		viewId		ID of view being hidden
 * @param {function}	callback	function to call if user agrees to leave
 * @param {string}		newViewId	ID of view that will be shown
 */
ZmConvListController.prototype.popShield =
function(viewId, callback, newViewId) {

	var newViewType = newViewId && appCtxt.getViewTypeFromId(newViewId);
	var switchingView = (newViewType == ZmId.VIEW_TRAD);
	if (this._convView && this._convView.isDirty() && (!newViewType || switchingView)) {
		var ps = this._popShield = this._popShield || appCtxt.getYesNoMsgDialog();
		ps.reset();
		ps.setMessage(ZmMsg.convViewCancel, DwtMessageDialog.WARNING_STYLE);
		ps.registerCallback(DwtDialog.YES_BUTTON, this._popShieldYesCallback, this, [switchingView, callback]);
		ps.registerCallback(DwtDialog.NO_BUTTON, this._popShieldNoCallback, this, [switchingView, callback]);
		ps.popup();
		return false;
	}
	else {
		return true;
	}
};

// yes, I want to leave even though I've typed some text
ZmConvListController.prototype._popShieldYesCallback =
function(switchingView, callback) {
	this._convView._replyView.reset();
	this._popShield.popdown();
	if (switchingView) {
		// tell app view mgr it's okay to show TV
		appCtxt.getAppViewMgr().showPendingView(true);
	}
	else if (callback) {
		callback();
	}
};

// no, I don't want to leave
ZmConvListController.prototype._popShieldNoCallback =
function(switchingView, callback) {
	this._popShield.popdown();
	if (switchingView) {
		// attempt to switch to TV was canceled - need to undo changes
		this._updateViewMenu(ZmId.VIEW_CONVLIST);
		if (!appCtxt.isExternalAccount() && !this.isSearchResults && !this._currentSearch.isDefaultToMessageView) {
			this._app.setGroupMailBy(ZmMailListController.GROUP_BY_SETTING[ZmId.VIEW_CONVLIST], true);
		}
	}
	//check if this is due to new selected item and it's different than current - if so we need to revert in the list.
	var selection = this.getSelection();
	var listSelectedItem = selection && selection.length && selection[0];
	var conv = this._convView._item;
	if (conv.id !== listSelectedItem.id) {
		this.getListView().setSelection(conv, true); //skip notification so item is not re-set in the reading pane (or infinite pop shield loop :) )
	}
	appCtxt.getKeyboardMgr().grabFocus(this._convView._replyView._input);
};

ZmConvListController.prototype._listSelectionListener =
function(ev) {

	var item = ev.item;
	if (!item) { return; }
	
	this._mailListView._selectedMsg = null;
	if (ev.field == ZmItem.F_EXPAND && this._mailListView._isExpandable(item)) {
		this._toggle(item);
		return true;
	}

	return ZmDoublePaneController.prototype._listSelectionListener.apply(this, arguments);
};

ZmConvListController.prototype._handleConvLoaded =
function(conv) {
	var msg = conv.getFirstHotMsg();
	var item = msg || conv;
	this._showItem(item);
};

ZmConvListController.prototype._showItem =
function(item) {
	if (item.type == ZmItem.MSG) {
		AjxDispatcher.run("GetMsgController", item && item.nId).show(item, this, null, true);
	}
	else {
		AjxDispatcher.run("GetConvController").show(item, this, null, true);
	}

};


ZmConvListController.prototype._menuPopdownActionListener =
function(ev) {
	ZmDoublePaneController.prototype._menuPopdownActionListener.apply(this, arguments);
	this._mailListView._selectedMsg = null;
};

ZmConvListController.prototype._setSelectedItem =
function() {
	
	var selCnt = this._listView[this._currentViewId].getSelectionCount();
	if (selCnt == 1) {
		var sel = this._listView[this._currentViewId].getSelection();
		var item = (sel && sel.length) ? sel[0] : null;
		if (item.type == ZmItem.CONV) {
			Dwt.setLoadingTime("ZmConv", new Date());
			var convParams = {};
			convParams.markRead = this._handleMarkRead(item, true);
			if (this.isSearchResults) {
				convParams.fetch = ZmSetting.CONV_FETCH_MATCHES;
			}
			else {
				convParams.fetch = ZmSetting.CONV_FETCH_UNREAD_OR_FIRST;
				convParams.query = this._currentSearch.query;
			}
			// if the conv's unread state changed, load it again so we get the correct expanded msg bodies
			convParams.forceLoad = item.unreadHasChanged;
			item.load(convParams, this._handleResponseSetSelectedItem.bind(this, item));
		} else {
			ZmDoublePaneController.prototype._setSelectedItem.apply(this, arguments);
		}
	}
};

ZmConvListController.prototype._handleResponseSetSelectedItem =
function(item) {

	if (item.type === ZmItem.CONV && this.isReadingPaneOn()) {
		// make sure list view has this item
		var lv = this._listView[this._currentViewId];
		if (lv.hasItem(item.id)) {
			this._displayItem(item);
		}
		item.unreadHasChanged = false;
	}
	else {
		ZmDoublePaneController.prototype._handleResponseSetSelectedItem.call(this, item);
	}
};

ZmConvListController.prototype._getTagMenuMsg = 
function(num, items) {
	var type = this._getLabelType(items);
	return AjxMessageFormat.format((type == ZmItem.MSG) ? ZmMsg.tagMessages : ZmMsg.tagConversations, num);
};

ZmConvListController.prototype._getMoveDialogTitle = 
function(num, items) {
	var type = this._getLabelType(items);
	return AjxMessageFormat.format((type == ZmItem.MSG) ? ZmMsg.moveMessages : ZmMsg.moveConversations, num);
};

ZmConvListController.prototype._getLabelType = 
function(items) {
	if (!(items && items.length)) { return ZmItem.MSG; }
	for (var i = 0; i < items.length; i++) {
		if (items[i].type == ZmItem.MSG) {
			return ZmItem.MSG;
		}
	}
	return ZmItem.CONV;
};

/**
 * Returns the first matching msg in the conv, if available. No request will
 * be made to the server if the conv has not been loaded.
 */
ZmConvListController.prototype.getMsg =
function(params) {
	
	// First see if action is being performed on a msg in the conv view in the reading pane
	var lv = this._listView[this._currentViewId];
	var msg = lv && lv._selectedMsg;
	if (msg && DwtMenu.menuShowing()) {
		return msg;
	}
	
	var sel = lv.getSelection();
	var item = (sel && sel.length) ? sel[0] : null;
	if (item) {
		if (item.type == ZmItem.CONV) {
			return item.getFirstHotMsg(params);
		} else if (item.type == ZmItem.MSG) {
			return ZmDoublePaneController.prototype.getMsg.apply(this, arguments);
		}
	}
	return null;
};

/**
 * Returns the first matching msg in the conv. The conv will be loaded if necessary.
 */
ZmConvListController.prototype._getLoadedMsg =
function(params, callback) {
	params = params || {};
	var sel = this._listView[this._currentViewId].getSelection();

	// Bug: 106342 - Cache the currently selected conversation list item as it gets de-selected when context-menu is destroyed.
	this._lastSelectedListItem = sel;

	var item = (sel && sel.length) ? sel[0] : null;
	if (item) {
		if (item.type == ZmItem.CONV) {
			params.markRead = (params.markRead != null) ? params.markRead : this._handleMarkRead(item, true);
			var respCallback = new AjxCallback(this, this._handleResponseGetLoadedMsg, callback);
			item.getFirstHotMsg(params, respCallback);
		} else if (item.type == ZmItem.MSG) {
			ZmDoublePaneController.prototype._getLoadedMsg.apply(this, arguments);
		}
	} else {
		callback.run();
	}
};

ZmConvListController.prototype._handleResponseGetLoadedMsg =
function(callback, msg) {
	callback.run(msg);
};

ZmConvListController.prototype._getSelectedMsg =
function(callback) {
	var item = this._listView[this._currentViewId].getSelection()[0];
	if (!item) { return null; }
	
	return (item.type == ZmItem.CONV) ? item.getFirstHotMsg(null, callback) : item;
};

ZmConvListController.prototype._displayItem =
function(item) {

	// cancel timed mark read action on previous conv
	appCtxt.killMarkReadTimer();

	var curItem = this._doublePaneView.getItem();
	item.waitOnMarkRead = true;
	this._doublePaneView.setItem(item);
	item.waitOnMarkRead = false;
	if (!(curItem && item.id == curItem.id)) {
		this._handleMarkRead(item);
	}
};

ZmConvListController.prototype._toggle =
function(item) {
	if (this._mailListView.isExpanded(item)) {
		this._collapse(item);
	} else {
		var conv = item, msg = null, offset = 0;
		if (item.type == ZmItem.MSG) {
			conv = appCtxt.getById(item.cid);
			msg = item;
			offset = this._mailListView._msgOffset[item.id];
		}
		this._expand({
			conv:   conv,
			msg:    msg,
			offset: offset
		});
	}
};

/**
 * Expands the given conv or msg, performing a search to get items if necessary.
 *
 * @param params		[hash]			hash of params:
 *        conv			[ZmConv]		conv to expand
 *        msg			[ZmMailMsg]		msg to expand (get next page of msgs for conv)
 *        offset		[int]			index of msg in conv
 *        callback		[AjxCallback]	callback to run when done
 */
ZmConvListController.prototype._expand =
function(params) {

	var conv = params.conv;
	var offset = params.offset || 0;
	var respCallback = new AjxCallback(this, this._handleResponseLoadItem, [params]);
	var pageWasCached = false;
	if (offset) {
		if (this._paginateConv(conv, offset, respCallback)) {
			// page was cached, callback won't be run
			this._handleResponseLoadItem(params, new ZmCsfeResult(conv.msgs));
		}
	} else if (!conv._loaded) {
		conv.load(null, respCallback);
	} else {
		// re-expanding first page of msgs
		this._handleResponseLoadItem(params, new ZmCsfeResult(conv.msgs));
	}
};

ZmConvListController.prototype._handleResponseLoadItem =
function(params, result) {
	if (result) {
		this._mailListView._expand(params.conv, params.msg);
	}
	if (params.callback) {
		params.callback.run();
	}
};

/**
 * Adapted from ZmListController::_paginate
 */
ZmConvListController.prototype._paginateConv =
function(conv, offset, callback) {

	var list = conv.msgs;
	// see if we're out of msgs and the server has more
	var limit = appCtxt.get(ZmSetting.CONVERSATION_PAGE_SIZE);
	if (offset && list && ((offset + limit > list.size()) && list.hasMore())) {
		// figure out how many items we need to fetch
		var delta = (offset + limit) - list.size();
		var max = delta < limit && delta > 0 ? delta : limit;
		if (max < limit) {
			offset = ((offset + limit) - max) + 1;
		}
		var respCallback = new AjxCallback(this, this._handleResponsePaginateConv, [conv, offset, callback]);
		conv.load({offset:offset, limit:limit}, respCallback);
		return false;
	} else {
		return true;
	}
};

ZmConvListController.prototype._handleResponsePaginateConv =
function(conv, offset, callback, result) {

	if (!conv.msgs) { return; }

	var searchResult = result.getResponse();
	conv.msgs.setHasMore(searchResult.getAttribute("more"));
	var newList = searchResult.getResults(ZmItem.MSG).getVector();
	conv.msgs.cache(offset, newList);
	if (callback) {
		callback.run(result);
	}
};

ZmConvListController.prototype._collapse =
function(item) {
	if (this._mailListView._rowsArePresent(item)) {	
		this._mailListView._collapse(item);
	} else {
		// reset state and expand instead
		this._toggle(item);
	}
};

// Actions
//
// Since a selection might contain both convs and msgs, we need to split them up and
// invoke the action for each type separately.

/**
 * Takes the given list of items (convs and msgs) and splits it into one list of each
 * type. Since an action applied to a conv is also applied to its msgs, we remove any
 * msgs whose owning conv is also in the list.
 */
ZmConvListController.prototype._divvyItems =
function(items) {
	var convs = [], msgs = [];
	var convIds = {};
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.type == ZmItem.CONV) {
			convs.push(item);
			convIds[item.id] = true;
		} else {
			msgs.push(item);
		}
	}
	var msgs1 = [];
	for (var i = 0; i < msgs.length; i++) {
		if (!convIds[msgs[i].cid]) {
			msgs1.push(msgs[i]);
		}
	}
	var lists = {};
	lists[ZmItem.MSG] = msgs1;	
	lists[ZmItem.CONV] = convs;
	
	return lists;
};

/**
 * Need to make sure conv's msg list has current copy of draft.
 * 
 * @param msg	[ZmMailMsg]		saved draft
 */
ZmConvListController.prototype._draftSaved =
function(msg, resp) {

    if (resp) {
        msg = msg || new ZmMailMsg();
        msg._loadFromDom(resp);
    }
    var conv = appCtxt.getById(msg.cid);
	if (conv && conv.msgs && conv.msgs.size()) {
		var a = conv.msgs.getArray();
		for (var i = 0; i < a.length; i++) {
			if (a[i].id == msg.id) {
				a[i] = msg;
			}
		}
	}
	ZmDoublePaneController.prototype._draftSaved.apply(this, [msg]);
};

ZmConvListController.prototype._redrawDraftItemRows =
function(msg) {
	var lv = this._listView[this._currentViewId];
	var conv = appCtxt.getById(msg.cid);
	if (conv) {
		conv._loadFromMsg(msg);	// update conv
		lv.redrawItem(conv);
		lv.setSelection(conv, true);
	}
	// don't think a draft conv is ever expandable, but try anyway
	lv.redrawItem(msg);
};

// override to do nothing if we are deleting/moving a msg within conv view in the reading pane
ZmConvListController.prototype._getNextItemToSelect =
function(omit) {
	var lv = this._listView[this._currentViewId];
	return (lv && lv._selectedMsg) ? null : ZmDoublePaneController.prototype._getNextItemToSelect.apply(this, arguments);
};

/**
 * Splits the given items into two lists, one of convs and one of msgs, and
 * applies the given method and args to each.
 *
 * @param items		[array]			list of convs and/or msgs
 * @param method	[string]		name of function to call in parent class
 * @param args		[array]			additional args to pass to function
 */
ZmConvListController.prototype._applyAction =
function(items, method, args) {
	args = args ? args : [];
	var lists = this._divvyItems(items);
	var hasMsgs = false;
	if (lists[ZmItem.MSG] && lists[ZmItem.MSG].length) {
		args.unshift(lists[ZmItem.MSG]);
		ZmDoublePaneController.prototype[method].apply(this, args);
		hasMsgs = true;
	}
	if (lists[ZmItem.CONV] && lists[ZmItem.CONV].length) {
		if (hasMsgs) {
			args[0] = lists[ZmItem.CONV];
		}
		else {
			args.unshift(lists[ZmItem.CONV]);
		}
		ZmDoublePaneController.prototype[method].apply(this, args);
	}
};

ZmConvListController.prototype._doFlag =
function(items, on) {
	if (on !== true && on !== false) {
		on = !items[0].isFlagged;
	}
	this._applyAction(items, "_doFlag", [on]);
};

ZmConvListController.prototype._doMsgPriority = 
function(items) {
	var on = !items[0].isPriority;
	this._applyAction(items, "_doMsgPriority", [on]);
};

ZmConvListController.prototype._doTag =
function(items, tag, doTag) {
	this._applyAction(items, "_doTag", [tag, doTag]);
};

ZmConvListController.prototype._doRemoveAllTags =
function(items) {
	this._applyAction(items, "_doRemoveAllTags");
};

ZmConvListController.prototype._doDelete =
function(items, hardDelete, attrs) {
	this._applyAction(items, "_doDelete", [hardDelete, attrs]);
};

ZmConvListController.prototype._doMove =
function(items, folder, attrs, isShiftKey) {
	this._applyAction(items, "_doMove", [folder, attrs, isShiftKey]);
};

ZmConvListController.prototype._doMarkRead =
function(items, on, callback, forceCallback) {
	this._applyAction(items, "_doMarkRead", [on, callback, forceCallback]);
};

ZmConvListController.prototype._doMarkMute =
function(items, on, callback, forceCallback) {
	this._applyAction(items, "_doMarkMute", [on, callback, forceCallback]);
};

ZmConvListController.prototype._doSpam =
function(items, markAsSpam, folder) {
	this._applyAction(items, "_doSpam", [markAsSpam, folder]);
};

// Callbacks

ZmConvListController.prototype._handleResponsePaginate = 
function(view, saveSelection, loadIndex, offset, result, ignoreResetSelection) {
	// bug fix #5134 - overload to ignore resetting the selection since it is handled by setView
	ZmListController.prototype._handleResponsePaginate.call(this, view, saveSelection, loadIndex, offset, result, true);
};
}
if (AjxPackage.define("zimbraMail.mail.controller.ZmTradController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a new, empty "traditional view" controller.
 * @constructor
 * @class
 * This class manages the two-pane message view. The top pane contains a list
 * view of the messages in the conversation, and the bottom pane contains the current
 * message.
 *
 * @author Parag Shah
 * 
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						mailApp						the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmDoublePaneController
 * 
 * @private
 */
ZmTradController = function(container, mailApp, type, sessionId, searchResultsController) {
	ZmDoublePaneController.apply(this, arguments);

	this._listeners[ZmOperation.SHOW_CONV] = this._showConvListener.bind(this);
};

ZmTradController.prototype = new ZmDoublePaneController;
ZmTradController.prototype.constructor = ZmTradController;

ZmTradController.prototype.isZmTradController = true;
ZmTradController.prototype.toString = function() { return "ZmTradController"; };

ZmMailListController.GROUP_BY_ITEM[ZmId.VIEW_TRAD]		= ZmItem.MSG;
ZmMailListController.GROUP_BY_SETTING[ZmId.VIEW_TRAD]	= ZmSetting.GROUP_BY_MESSAGE;

// view menu
ZmMailListController.GROUP_BY_ICON[ZmId.VIEW_TRAD]		= "MessageView";
ZmMailListController.GROUP_BY_MSG_KEY[ZmId.VIEW_TRAD]	= "byMessage";
ZmMailListController.GROUP_BY_SHORTCUT[ZmId.VIEW_TRAD]	= ZmKeyMap.VIEW_BY_MSG;
ZmMailListController.GROUP_BY_VIEWS.push(ZmId.VIEW_TRAD);

// Public methods

ZmTradController.getDefaultViewType =
function() {
	return ZmId.VIEW_TRAD;
};
ZmTradController.prototype.getDefaultViewType = ZmTradController.getDefaultViewType;

/**
 * Displays the given message list in a two-pane view.
 *
 * @param {ZmSearchResult}	searchResults		the current search results
 */
ZmTradController.prototype.show =
function(searchResults) {
	ZmDoublePaneController.prototype.show.call(this, searchResults, searchResults.getResults(ZmItem.MSG));
	if (!appCtxt.isExternalAccount() && !this.isSearchResults && !(searchResults && searchResults.search && searchResults.search.isDefaultToMessageView)) {
		appCtxt.set(ZmSetting.GROUP_MAIL_BY, ZmSetting.GROUP_BY_MESSAGE);
	}
	this._resetNavToolBarButtons(ZmId.VIEW_TRAD);
};

ZmTradController.prototype.handleKeyAction =
function(actionCode, ev) {

	DBG.println(AjxDebug.DBG3, "ZmTradController.handleKeyAction");

	switch (actionCode) {
		case ZmKeyMap.KEEP_READING:
			return this._keepReading(false, ev);
			break;

		default:
			return ZmDoublePaneController.prototype.handleKeyAction.apply(this, arguments);
	}
};

// Private methods

ZmTradController.prototype._createDoublePaneView = 
function() {
	return (new ZmTradView({parent:this._container, posStyle:Dwt.ABSOLUTE_STYLE,
							controller:this, dropTgt:this._dropTgt}));
};

ZmTradController.prototype._resetOperations = 
function(parent, num) {
	ZmDoublePaneController.prototype._resetOperations.apply(this, arguments);
	parent.enable(ZmOperation.SHOW_CONV, (num == 1) && !appCtxt.isWebClientOffline());
};

ZmTradController.prototype._paginate = 
function(view, bPageForward, convIdx, limit) {
	view = view || this._currentViewId;
	return ZmDoublePaneController.prototype._paginate.call(this, view, bPageForward, convIdx, limit);
};

ZmTradController.prototype._resetNavToolBarButtons = 
function(view) {

	view = view || this.getCurrentViewId();
	ZmDoublePaneController.prototype._resetNavToolBarButtons.call(this, view);
	if (!this._navToolBar[view]) { return; }

	this._navToolBar[view].setToolTip(ZmOperation.PAGE_BACK, ZmMsg.previousPage);
	this._navToolBar[view].setToolTip(ZmOperation.PAGE_FORWARD, ZmMsg.nextPage);
};

ZmTradController.prototype._keepReading = 
function(check, ev) {
	
	if (!this.isReadingPaneOn() || !this._itemViewCurrent()) { return false; }
	var mlv = this._mailListView;
	if (!mlv || mlv.getSelectionCount() != 1) { return false; }
	
	var itemView = this.getItemView();
	var result = itemView && itemView._keepReading(check);
	if (check) {
		result = result || !!(this._getUnreadItem(DwtKeyMap.SELECT_NEXT));
	}
	else {
		result = result || this.handleKeyAction(ZmKeyMap.NEXT_UNREAD, ev);
		if (result) {
			this._checkKeepReading();
		}
	}
	return result;
};

ZmTradController.prototype._showConvListener =
function() {
	var msg = this.getMsg();
	if (!msg) { return; }

	var list = new ZmMailList(ZmItem.CONV);
	list.search = msg.list.search;
	var conv = ZmConv.createFromMsg(msg, {list: list});
	AjxDispatcher.run("GetConvController").show(conv, this, null, null, msg);
};

// Callbacks

ZmTradController.prototype._handleResponsePaginate = 
function(view, saveSelection, loadIndex, offset, result, ignoreResetSelection) {
	// bug fix #5134 - overload to ignore resetting the selection since it is handled by setView
	ZmMailListController.prototype._handleResponsePaginate.call(this, view, saveSelection, loadIndex, offset, result, true);
};
}
if (AjxPackage.define("zimbraMail.mail.controller.ZmMsgController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an empty message controller.
 * @constructor
 * @class
 * This class controls the display and management of a single message in the content area. Since it
 * needs to handle pretty much the same operations as a list, it extends ZmMailListController.
 *
 * @author Parag Shah
 * @author Conrad Damon
 * 
 * @param {DwtControl}	container		the containing shell
 * @param {constant}	type			type of controller
 * @param {ZmApp}		mailApp			the containing application
 * @param {string}		sessionId		the session id
 * 
 * @extends		ZmMailListController
 */
ZmMsgController = function(container, mailApp, type, sessionId) {

    if (arguments.length == 0) { return; }
	ZmMailListController.apply(this, arguments);
	this._elementsToHide = ZmAppViewMgr.LEFT_NAV;
};

ZmMsgController.prototype = new ZmMailListController;
ZmMsgController.prototype.constructor = ZmMsgController;

ZmMsgController.MODE_TO_CONTROLLER = {};
ZmMsgController.MODE_TO_CONTROLLER[ZmId.VIEW_TRAD]		= "GetTradController";
ZmMsgController.MODE_TO_CONTROLLER[ZmId.VIEW_CONV]		= "GetConvController";
ZmMsgController.MODE_TO_CONTROLLER[ZmId.VIEW_CONVLIST]	= "GetConvListController";

ZmMsgController.DEFAULT_TAB_TEXT = ZmMsg.message;

ZmMsgController.viewToTab = {};

ZmMsgController.prototype.isZmMsgController = true;
ZmMsgController.prototype.toString = function() { return "ZmMsgController"; };

// Public methods

ZmMsgController.getDefaultViewType =
function() {
	return ZmId.VIEW_MSG;
};
ZmMsgController.prototype.getDefaultViewType = ZmMsgController.getDefaultViewType;

/**
 * Displays a message in the single-pane view.
 *
 * @param {ZmMailMsg}			msg					the message to display
 * @param {ZmListController}	parentController	the controller that called this method
 * @param {AjxCallback}			callback			the client callback
 * @param {Boolean}				markRead			if <code>true</code>, mark msg read
 * @param {Boolean}				hidePagination		if <code>true</code>, hide the pagination buttons
 */
ZmMsgController.prototype.show = 
function(msg, parentController, callback, markRead, hidePagination, forceLoad, noTruncate) {
	this.setMsg(msg);
	this._parentController = parentController;
	//if(msg.list) {
        this.setList(msg.list);
    //}
	if (!msg._loaded || forceLoad) {
		var respCallback = new AjxCallback(this, this._handleResponseShow, [callback, hidePagination]);
		if (msg._loadPending) {
			// override any local callback if we're being launched by double-pane view,
			// so that multiple GetMsgRequest's aren't made
			msg._loadCallback = respCallback;
		} else {
			markRead = markRead || (appCtxt.get(ZmSetting.MARK_MSG_READ) == ZmSetting.MARK_READ_NOW);
			msg.load({callback:respCallback, markRead:markRead, forceLoad:forceLoad, noTruncate:noTruncate});
		}
	} else {
		// May have been explicitly marked as unread
		var marked = false;
		if (!msg.isReadOnly() && msg.isUnread && (appCtxt.get(ZmSetting.MARK_MSG_READ) != ZmSetting.MARK_READ_NONE)) {
			if (msg.list) {
				// Need to mark it on the server
				marked = true;
				var markCallback =  this._handleResponseShow.bind(this, callback, hidePagination);
				msg.list.markRead({items: msg, value: true, callback: markCallback, noBusyOverlay: true});
			}  else {
				msg.markRead();
			}
		}
		if (!marked) {
			this._handleResponseShow(callback, hidePagination);
		}
	}
};

ZmMsgController.prototype._handleResponseShow = 
function(callback, hidePagination, result) {
	this._showMsg();
	this._showNavToolBarButtons(this._currentViewId, !hidePagination);
	if (callback && callback.run) {
		callback.run(this, this._view[this._currentViewId]);
	}
};


/**
 * can't repro bug 77538 - but since the exception happens in ZmListController.prototype._setupContinuation if lastItem is not set, let's set it here to be on the safe side.
 */
ZmMsgController.prototype._setupContinuation =
function() {
	this._continuation.lastItem = true; //just a dummy value.  I could use this._msg but afraid that in the case of the bug (77538) - that I can't repro - this._msg might be empty.
	this._continuation.totalItems = 1;
	ZmListController.prototype._setupContinuation.apply(this, arguments);
};


/**
 * Called by ZmNewWindow.unload to remove tag list listener (which resides in 
 * the parent window). Otherwise, after the child window is closed, the parent 
 * window is still referencing the child window's msg controller, which has
 * been unloaded!!
 * 
 * @private
 */
ZmMsgController.prototype.dispose = 
function() {
	this._tagList.removeChangeListener(this._tagChangeListener);
};

ZmMsgController.prototype._showMsg = 
function() {
	this._showMailItem();
};

ZmMsgController.prototype._getTabParams =
function(tabId, tabCallback) {
	return {
		id:				tabId,
		textPrecedence:	85,
        image:          "CloseGray",
        hoverImage:     "Close",
        style:          DwtLabel.IMAGE_RIGHT,
		tooltip:		ZmMsgController.DEFAULT_TAB_TEXT,
		tabCallback:	tabCallback
	};
};

ZmMsgController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_MESSAGE;
};

ZmMsgController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG3, "ZmMsgController.handleKeyAction");
	
	switch (actionCode) {
		case ZmKeyMap.CANCEL:
			this._backListener();
			break;

		case ZmKeyMap.NEXT_PAGE:
			this._goToMsg(this._currentViewId, true);
			break;

		case ZmKeyMap.PREV_PAGE:
			this._goToMsg(this._currentViewId, false);
			break;

		// switching view not supported here
		case ZmKeyMap.VIEW_BY_CONV:
		case ZmKeyMap.VIEW_BY_MSG:
			break;
		
		default:
			if (ZmMsgController.ALLOWED_SHORTCUT[actionCode]) {
				return ZmMailListController.prototype.handleKeyAction.call(this, actionCode);
			}
	}
	return true;
};

ZmMsgController.prototype.mapSupported =
function(map) {
	return false;
};

// Private methods (mostly overrides of ZmListController protected methods)

ZmMsgController.prototype._getToolBarOps = 
function() {
	var list = [ZmOperation.CLOSE, ZmOperation.SEP];
	list = list.concat(ZmMailListController.prototype._getToolBarOps.call(this));
	return list;
};

ZmMsgController.prototype._getRightSideToolBarOps =
function() {
	if (appCtxt.isChildWindow || !appCtxt.get(ZmSetting.DETACH_MAILVIEW_ENABLED) || appCtxt.isExternalAccount()) {
		return [];
	}
	return [ZmOperation.DETACH];
};


ZmMsgController.prototype._showDetachInSecondary =
function() {
	return false;
};

ZmMsgController.prototype._initializeToolBar =
function(view) {
	var className = appCtxt.isChildWindow ? "ZmMsgViewToolBar_cw" : null;

	ZmMailListController.prototype._initializeToolBar.call(this, view, className);
};

ZmMsgController.prototype._navBarListener =
function(ev) {
	var op = ev.item.getData(ZmOperation.KEY_ID);
	if (op == ZmOperation.PAGE_BACK || op == ZmOperation.PAGE_FORWARD) {
		this._goToMsg(this._currentViewId, (op == ZmOperation.PAGE_FORWARD));
	}
};

// message view has no view menu button
ZmMsgController.prototype._setupViewMenu = function(view, firstTime) {};

ZmMsgController.prototype._getActionMenuOps =
function() {
	return null;
};

ZmMsgController.prototype._initializeView =
function(view) {
	if (!this._view[view]) {
		var params = {
			parent:		this._container,
			id:			ZmId.getViewId(ZmId.VIEW_MSG, null, view),
			posStyle:	Dwt.ABSOLUTE_STYLE,
			mode:		ZmId.VIEW_MSG,
			controller:	this
		};
		this._view[view] = new ZmMailMsgView(params);
		this._view[view].addInviteReplyListener(this._inviteReplyListener);
		this._view[view].addShareListener(this._shareListener);
		this._view[view].addSubscribeListener(this._subscribeListener);
	}
};

ZmMsgController.prototype._initializeTabGroup =
function(view) {
	if (this._tabGroups[view]) { return; }

	ZmMailListController.prototype._initializeTabGroup.apply(this, arguments);

	this._tabGroups[view].removeMember(this._view[view]);
};

ZmMsgController.prototype._getSearchFolderId =
function() {
	return this._msg.folderId ? this._msg.folderId : (this._msg.list && this._msg.list.search) ?
		this._msg.list.search.folderId : null;
};

ZmMsgController.prototype._getTagMenuMsg =
function() {
	return ZmMsg.tagMessage;
};

ZmMsgController.prototype._getMoveDialogTitle =
function() {
	return ZmMsg.moveMessage;
};

ZmMsgController.prototype._setViewContents =
function(view) {
	this._view[view].set(this._msg);
};

ZmMsgController.prototype._resetNavToolBarButtons =
function(view) {
	view = view || this.getCurrentViewId();
	if (!this._navToolBar[view]) { return; }
	// NOTE: we purposely do not call base class here!
	if (!appCtxt.isChildWindow) {
		var list = this._msg.list && this._msg.list.getVector();

		this._navToolBar[view].enable(ZmOperation.PAGE_BACK, (list && (list.get(0) != this._msg)));

		var bEnableForw = list && (this._msg.list.hasMore() || (list.getLast() != this._msg));
		this._navToolBar[view].enable(ZmOperation.PAGE_FORWARD, bEnableForw);

		this._navToolBar[view].setToolTip(ZmOperation.PAGE_BACK, ZmMsg.previousMessage);
		this._navToolBar[view].setToolTip(ZmOperation.PAGE_FORWARD, ZmMsg.nextMessage);
	}
};

ZmMsgController.prototype._showNavToolBarButtons =
function(view, show) {
	var toolbar = this._navToolBar[view];
	if (!toolbar) { return; }
	if (!appCtxt.isChildWindow) {
		toolbar.getButton(ZmOperation.PAGE_BACK).setVisible(show);
		toolbar.getButton(ZmOperation.PAGE_FORWARD).setVisible(show);
	}
};

ZmMsgController.prototype._goToMsg =
function(view, next) {
	var controller = this._parentController;
	if (controller && controller.pageItemSilently) {
		controller.pageItemSilently(this._msg, next, this);
	}
};

ZmMsgController.prototype._selectNextItemInParentListView =
function() {
	var controller = this._parentController;
	if (controller && controller._getNextItemToSelect) {
		controller._view[controller._currentViewId]._itemToSelect = controller._getNextItemToSelect();
	}
};

ZmMsgController.prototype._doDelete =
function() {
	this._selectNextItemInParentListView();
	ZmMailListController.prototype._doDelete.apply(this, arguments);
};

ZmMsgController.prototype._doMove =
function() {
	this._selectNextItemInParentListView();
	ZmMailListController.prototype._doMove.apply(this, arguments);
};

ZmMsgController.prototype._doSpam =
function() {
	this._selectNextItemInParentListView();
	ZmMailListController.prototype._doSpam.apply(this, arguments);
};

ZmMsgController.prototype._menuPopdownActionListener =
function(ev) {
	// dont do anything since msg view has no action menus
};

// Miscellaneous

ZmMsgController.prototype.getMsg =
function(params) {
	return this._msg;
};

ZmMsgController.prototype.getItems =
function() {
	return [this._msg];
};

ZmMsgController.prototype._getLoadedMsg =
function(params, callback) {
	callback.run(this._msg);
};

ZmMsgController.prototype._getSelectedMsg =
function() {
	return this._msg;
};

ZmMsgController.prototype.setMsg = function (msg) {
	this._msg = msg;
    msg.refCount++
};

ZmMsgController.prototype.getItemView = function() {
	return this._view[this._currentViewId];
};

// No-op replenishment
ZmMsgController.prototype._checkReplenish =
function(params) {
	// XXX: remove this when replenishment is fixed for msg controller!
	DBG.println(AjxDebug.DBG1, "SORRY. NO REPLENISHMENT FOR YOU.");
};

ZmMsgController.prototype._checkItemCount =
function() {
	if (!appCtxt.isChildWindow) {
		this._backListener();
	}
};

ZmMsgController.prototype._getDefaultFocusItem = 
function() {
	return this._toolbar[this._currentViewId];
};

ZmMsgController.prototype._backListener =
function(ev) {
	// bug fix #30835 - prism triggers this listener twice for some reason :/
	if (appCtxt.isOffline && (this._currentViewId != appCtxt.getCurrentViewId())) {
		return;
	}
	var isChildWindow = appCtxt.isChildWindow;
	if (!this._app.popView() && !isChildWindow) {
		this._app.mailSearch();
	}
};

ZmMsgController.prototype.isTransient =
function(oldView, newView) {
	return (appCtxt.getViewTypeFromId(newView) != ZmId.VIEW_COMPOSE);
};

ZmMsgController.prototype._tabCallback =
function(oldView, newView) {
	return (appCtxt.getViewTypeFromId(oldView) == ZmId.VIEW_MSG);
};

ZmMsgController.prototype._printListener =
function(ev) {
    var ids = [];
    var item = this._msg;
    var id;
    var showImages;
    // always extract out the msg ids from the conv
    if (item.toString() == "ZmConv") {
        // get msg ID in case of virtual conv.
        // item.msgIds.length is inconsistent, so checking if conv id is negative.
        if (appCtxt.isOffline && item.id.split(":")[1]<0) {
            id = item.msgIds[0];
        } else {
            id = "C:" + item.id;
        }
        var msgList = item.getMsgList();
        for(var j=0; j<msgList.length; j++) {
            if(msgList[j].showImages) {
                showImages = true;
                break;
            }
        }
    } else {
        id = item.id;
        // Fix for bug: 84261, bug: 85363. partId is present if original message is present as an attachment.
        var part = item.partId;
        if (part) {
            id += "&part=" + part;
        }

        if (item.showImages) {
            showImages = true;
        }
    }
    var url = "/h/printmessage?id=" + id + "&tz=" + AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    if (appCtxt.get(ZmSetting.DISPLAY_EXTERNAL_IMAGES) || showImages) {
        url += "&xim=1";
    }
    if (appCtxt.isOffline) {
        var acctName = item.getAccount().name;
        url+="&acct=" + acctName ;
    }
    window.open(appContextPath+url, "_blank");
};

ZmMsgController.prototype._subscribeResponseHandler =
function(statusMsg, ev) {
    ZmMailListController.prototype._subscribeResponseHandler.call(this, statusMsg, ev);
    //Close View
    appCtxt.getAppViewMgr().popView();
};

ZmMsgController.prototype._acceptShareHandler =
function(ev) {
    ZmMailListController.prototype._acceptShareHandler.call(this, ev);
	//Close View
	if (!appCtxt.isChildWindow) {
		appCtxt.getAppViewMgr().popView();
	}
};

ZmMsgController.prototype._setStatics = function() {

	if (!ZmMsgController.ALLOWED_SHORTCUT) {
		ZmMsgController.ALLOWED_SHORTCUT = AjxUtil.arrayAsHash([
			ZmKeyMap.FORWARD,
			ZmKeyMap.MOVE,
			ZmKeyMap.PRINT,
			ZmKeyMap.TAG,
			ZmKeyMap.UNTAG,
			ZmKeyMap.REPLY,
			ZmKeyMap.REPLY_ALL,
			ZmKeyMap.SPAM,
			ZmKeyMap.MARK_READ,
			ZmKeyMap.MARK_UNREAD,
			ZmKeyMap.FLAG
		]);
	}

	ZmMailListController.prototype._setStatics();
};

ZmMsgController.prototype._postRemoveCallback = function() {
    this._msg.refCount--;
};
}

if (AjxPackage.define("zimbraMail.mail.model.ZmIdentity")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an identity.
 * @class
 * This class represents an identity.
 * 
 * @param	{String}	name		the identity name
 * 
 */
ZmIdentity = function(name) {

	this.reset();
	this.name = name;
	this.id = "";
};

ZmIdentity.prototype.toString =
function() {
	return "ZmIdentity";
};


// Constants

ZmIdentity.COMPOSE_SAME				= "same";
ZmIdentity.COMPOSE_TEXT 			= "text";
ZmIdentity.COMPOSE_HTML 			= "html";
ZmIdentity.DEFAULT_NAME 			= "DEFAULT";


ZmIdentity.FIELDS	= {};
ZmIdentity._SOAP	= {};

ZmIdentity.SIG_ID_NONE = "11111111-1111-1111-1111-111111111111";

// Static inititialization

ZmIdentity.addField =
function(id, params) {

	ZmIdentity[id] = id;
	ZmIdentity.FIELDS[id] = params;
	ZmIdentity._SOAP[params.soap] = params;
};

// Identity fields. The "name" parameter is used to set a property on this object.

ZmIdentity.addField("NAME",						{ name: "name", soap: "zimbraPrefIdentityName", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_DISPLAY",		{ name: "sendFromDisplay", soap: "zimbraPrefFromDisplay", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_ADDRESS",		{ name: "sendFromAddress", soap: "zimbraPrefFromAddress", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_ADDRESS_TYPE",	{ name: "sendFromAddressType", soap: "zimbraPrefFromAddressType", type: ZmSetting.D_STRING });
ZmIdentity.addField("SET_REPLY_TO",				{ name: "setReplyTo", soap: "zimbraPrefReplyToEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("SET_REPLY_TO_DISPLAY",		{ name: "setReplyToDisplay", soap: "zimbraPrefReplyToDisplay", type: ZmSetting.D_STRING });
ZmIdentity.addField("SET_REPLY_TO_ADDRESS",		{ name: "setReplyToAddress", soap: "zimbraPrefReplyToAddress", type: ZmSetting.D_STRING });
ZmIdentity.addField("SIGNATURE",				{ name: "signature", soap: "zimbraPrefDefaultSignatureId", type: ZmSetting.D_STRING });
ZmIdentity.addField("REPLY_SIGNATURE",			{ name: "replySignature", soap: "zimbraPrefForwardReplySignatureId", type: ZmSetting.D_STRING });

// Used only for Persona
ZmIdentity.addField("USE_WHEN_SENT_TO",			{ name: "useWhenSentTo", soap: "zimbraPrefWhenSentToEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("WHEN_SENT_TO_ADDRESSES",	{ name: "whenSentToAddresses", soap: "zimbraPrefWhenSentToAddresses", type: ZmSetting.D_LIST });
ZmIdentity.addField("USE_WHEN_IN_FOLDER",		{ name: "useWhenInFolder", soap: "zimbraPrefWhenInFoldersEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("WHEN_IN_FOLDERIDS",		{ name: "whenInFolderIds", soap: "zimbraPrefWhenInFolderIds", type: ZmSetting.D_LIST });


// Public methods

/**
 * Gets the field.
 * 
 * @param	{constant}	fieldId		the id
 * @return	{Object}	the value
 */
ZmIdentity.prototype.getField =
function(fieldId) {
	return this[ZmIdentity.FIELDS[fieldId].name];
};

/**
 * Sets the field.
 * 
 * @param	{constant}	fieldId		the id
 * @param	{Object}	value		the value
 */
ZmIdentity.prototype.setField =
function(fieldId, value) {
	this[ZmIdentity.FIELDS[fieldId].name] = value;
};

/**
 * Creates the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.create =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Create", this._handleCreateResponse, callback, errorCallback, batchCmd);
};

/**
 * Saves the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.save =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Modify", this._handleSaveResponse, callback, errorCallback, batchCmd);
};

/**
 * Deletes the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.doDelete =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Delete", this._handleDeleteResponse, callback, errorCallback, batchCmd);
};

/**
 * Clears this identity's fields.
 */
ZmIdentity.prototype.reset =
function() {
	for (var field in ZmIdentity.FIELDS) {
		var props = ZmIdentity.FIELDS[field];
		switch (props.type) {
			case ZmSetting.D_STRING:	this[props.name] = "";		break;
			case ZmSetting.D_BOOLEAN:	this[props.name] = false;	break;
			case ZmSetting.D_LIST:		this[props.name] = [];		break;
		}
	}
};

// Protected methods

ZmIdentity.prototype._doRequest =
function(requestType, respFunction, callback, errorCallback, batchCmd) {

	var soapDoc = AjxSoapDoc.create(requestType + "IdentityRequest", "urn:zimbraAccount");
	var identityNode = soapDoc.set("identity");

	var name = this.isDefault ? ZmIdentity.DEFAULT_NAME : this.name;
	if (requestType != "Create" && this.id !== "") {
		identityNode.setAttribute("id", this.id);
	}
	else {
		identityNode.setAttribute("name", this.name);
	}
	if (requestType != "Delete") {
		for (var i in ZmIdentity.FIELDS) {
			var field = ZmIdentity.FIELDS[i];
			if (this.hasOwnProperty(field.name)) {
				var value = this.getField(i);
				if (field.type == ZmSetting.D_LIST) {
					for (var j = 0, count = value.length; j < count; j++) {
						if (value[j]) {
							var propertyNode = soapDoc.set("a", value[j], identityNode);
							propertyNode.setAttribute("name", field.soap);
						}
					}
				} else {
					if (field.type == ZmSetting.D_BOOLEAN) {
						value = value ? "TRUE" : "FALSE";
					}
					var isSignature = (i == ZmIdentity.SIGNATURE || i == ZmIdentity.REPLY_SIGNATURE);
					var isDisplayName = (i == ZmIdentity.SEND_FROM_DISPLAY || i == ZmIdentity.SET_REPLY_TO_DISPLAY);
					var isEmailAddress = (i == ZmIdentity.SET_REPLY_TO_ADDRESS);
					if (value || isSignature || isDisplayName || isEmailAddress) {
						var propertyNode = soapDoc.set("a", value, identityNode);
						propertyNode.setAttribute("name", field.soap);
					}
				}
			}
		}
	}

	var respCallback = new AjxCallback(this, respFunction, [callback]);
	if (batchCmd) {
		batchCmd.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};

	return appCtxt.getAppController().sendRequest(params);
};

ZmIdentity.prototype._loadFromDom =
function(data) {

	this.id = data.id;

    var props = data._attrs;
	if (props) {
		for (var i in props) {
			var field = ZmIdentity._SOAP[i];
			if (field) {
				var value = props[i];
				if (field.type == ZmSetting.D_BOOLEAN) {
					this[field.name] = (value.toString().toUpperCase() == "TRUE");
				}
				else if (field.type == ZmSetting.D_LIST) {
					this[field.name] = AjxUtil.isArray(value) ? value : [value];
				}
				else {
					this[field.name] = value;
				}
			}
		}
	}

    if (data.name) {
		if (data.name == ZmIdentity.DEFAULT_NAME) {
			this.isDefault = true;
        }
	}
};

ZmIdentity.prototype._handleCreateResponse =
function(callback, result, response) {

	this.id = response.identity[0].id;
	delete this._new;
	delete this._dirty;

	var collection = appCtxt.getIdentityCollection();
	collection.add(this);
	collection._notify(ZmEvent.E_CREATE, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};

ZmIdentity.prototype._handleSaveResponse =
function(callback, result, response) {

	delete this._dirty;

	var collection = appCtxt.getIdentityCollection();
	collection.remove(this);
	collection.add(this);
	collection._notify(ZmEvent.E_MODIFY, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};

ZmIdentity.prototype._handleDeleteResponse =
function(callback, result, response) {

	var collection = appCtxt.getIdentityCollection();
	collection.remove(this);
	collection._notify(ZmEvent.E_DELETE, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmIdentityCollection")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the identity collection.
 * @class
 * This class represents the identity collection
 * 
 * @extends		ZmModel
 */
ZmIdentityCollection = function() {
	ZmModel.call(this, ZmEvent.S_IDENTITY);
	this.defaultIdentity = null;
	this._initialized = false;
	this._idToIdentity = {};
	this._addressToIdentity = {};
	this._folderToIdentity = {};
	this._size = 0;
};

ZmIdentityCollection.prototype = new ZmModel;
ZmIdentityCollection.prototype.constructor = ZmIdentityCollection;

ZmIdentityCollection.prototype.toString =
function() {
	return "ZmIdentityCollection";
};

//
// Public methods
//

/**
 * Gets the count of identities.
 * 
 * @return	{int}		the size
 */
ZmIdentityCollection.prototype.getSize =
function() {
	// bug: 30009
	return this.getIdentities().length;
};

/**
 * Gets the identities.
 * 
 * @param	{Object}	sort		(not used)
 * @return	{Array}		an array of {ZmIdentity} objects
 */
ZmIdentityCollection.prototype.getIdentities =
function(sort) {
	var identity, i = 0, result = [], isOffline = appCtxt.isOffline;
	for (var id in this._idToIdentity) {
		identity = this._idToIdentity[id];
		// bug: 30009
		if (isOffline && identity.isFromDataSource) continue;
		result[i++] = identity;
	}
	if (sort) {
		result.sort(ZmIdentityCollection._comparator);
	}
	return result;
};

/**
 * Gets the identity by id.
 * 
 * @param	{String}	id	the identity id
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype.getById =
function(id) {
	return this._idToIdentity[id];
};

/**
 * Gets the identity by name.
 * 
 * @param	{String}	name		the identity name
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype.getByName =
function(name) {
	name = name.toLowerCase();
	for (var id in this._idToIdentity) {
		var identity = this._idToIdentity[id];
		if (identity.name.toLowerCase() == name) {
			return identity;
		}
	}
	return null;
};

/**
 * Adds the identity to the collection.
 * 
 * @param	{ZmIdentity}	identity		the identity
 */
ZmIdentityCollection.prototype.add =
function(identity) {
	if (!this._idToIdentity[identity.id]) {
		this._idToIdentity[identity.id] = identity;
		if (identity.isDefault) {
			this.defaultIdentity = identity;
		}

		this._addToMaps(identity);
		this._size++;
	}
};

/**
 * Removes the identity from the collection.
 * 
 * @param	{ZmIdentity}	identity		the identity
 */
ZmIdentityCollection.prototype.remove =
function(identity) {
	if (this._idToIdentity[identity.id]) {
		this._removeFromMaps(identity);
		delete this._idToIdentity[identity.id];
		this._size--;
	}
};
/**
 * try to find the persona to use from the rules defined in the accounts settings. Recurse to parent so to apply rules to sub-folders too.
 * @param folderId
 * @returns {*}
 */
ZmIdentityCollection.prototype.selectIdentityFromFolder =
function(folderId) {
	if (!folderId) {
		return this.defaultIdentity;
	}
	var folder = appCtxt.getById(folderId);
	var parent = folder.parent;
	return this._folderToIdentity[folder.getRemoteId()] || this.selectIdentityFromFolder(parent && parent.id);
};

ZmIdentityCollection.prototype.selectIdentity =
function(mailMsg, type) {
	if (!appCtxt.get(ZmSetting.IDENTITIES_ENABLED) || !mailMsg) {
		return this.defaultIdentity;
	}

	// Check if the a identity's address was in the given type field.
	if (type) {
		return this._selectIdentityFromAddresses(mailMsg, type);
	}

	// Check if the a identity's address was in the to field.
	var identity = this._selectIdentityFromAddresses(mailMsg, AjxEmailAddress.TO);
	if (identity) { return identity; }

	// Check if the a identity's address was in the cc field.
	identity = this._selectIdentityFromAddresses(mailMsg, AjxEmailAddress.CC);
	if (identity) { return identity; }

    //Check if a identity's address was in the attendees list
    if(mailMsg.isInvite()) {
        identity = this._selectIdentityFromAttendees(mailMsg);
        if (identity) { return identity; }
    }

	// Check if a identity's folder is the same as where the message lives.
	return this.selectIdentityFromFolder(mailMsg.folderId);
};

ZmIdentityCollection.prototype.initialize =
function(data) {
	// This can be called unnecessarily after auth token expires.
	if (this._initialized || this.getSize() || !data) { return; }

	var identities = data.identity;
	for (var i = 0, count = identities ? identities.length : 0; i < count; i++) {
		var identity = new ZmIdentity('');
		identity._loadFromDom(identities[i]);
		this.add(identity);
	}
	this._initialized = true;
};

//
// Protected methods
//

ZmIdentityCollection.prototype._addToMaps =
function(identity) {
	if (identity.useWhenSentTo) {
		var addresses = identity.whenSentToAddresses;
		for (var i = 0, count = addresses.length; i < count; i++) {
			var address = addresses[i].toLowerCase();
			// External emails are added after other identities, potentially overwriting a persona which should have
			// precedence.  Use the external identity only if the email address has not been assigned an identity.
			if (!this._addressToIdentity[address] || !identity.isFromDataSource) {
				this._addressToIdentity[address] = identity;
			}
		}
	}

	if (identity.useWhenInFolder) {
		var folders = identity.whenInFolderIds;
		for (var i = 0, count = folders.length; i < count; i++) {
			var folder = appCtxt.getById(folders[i]);
			if (folder) {
				var fid = folder.getRemoteId();
				this._folderToIdentity[fid] = identity;
			}
		}
	}
};

ZmIdentityCollection.prototype._removeFromMaps =
function(identity) {
	for (var i = 0, count = identity.whenSentToAddresses.length; i < count; i++) {
		var address = identity.whenSentToAddresses[i];
		delete this._addressToIdentity[address];
	}

	for (var i = 0, count = identity.whenInFolderIds.length; i < count; i++) {
		var folder = appCtxt.getById(identity.whenInFolderIds[i]);
		if (folder) {
			var fid = folder.getRemoteId();
			delete this._folderToIdentity[fid];
		}
	}
};

ZmIdentityCollection._comparator =
function(a, b) {
	if (a.isDefault) {
		return -1;
	} else if (b.isDefault) {
		return 1;
	} else {
		return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
	}
};

ZmIdentityCollection.prototype.getSortIndex =
function(identity) {

	var identities = this.getIdentities(true);
	if (!(identities && identities.length)) { return 0; }

	if (this.getById(identity.id)) {
		// already have the identity, find its current position
		for (var i = 0; i < identities.length; i++) {
			if (identities[i].id == identity.id) {
				return i;
			}
		}
	} else {
		// hasn't been added yet, find where it should go
		for (var i = 0; i < identities.length; i++) {
			var test = ZmIdentityCollection._comparator(identity, identities[i]);
			if (test == -1) {
				return i;
			}
		}
	}
	return identities.length - 1;
};

ZmIdentityCollection.prototype._selectIdentityFromAddresses =
function(mailMsg, type) {
	var identity;
	var addresses = mailMsg.getAddresses(type).getArray();
	for (var i = 0, count = addresses.length; i < count; i++) {
		var address = addresses[i].getAddress();
		if (address) {
			identity = this._addressToIdentity[address.toLowerCase()];
			if(identity) {
				return identity;
			}
		}
	}
	return null;
};

/**
 * Gets the identity based on attendees list
 *
 * @param	{ZmMailMsg}	    mail msg which is an invitation, passing non-invite mail msg will return null
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype._selectIdentityFromAttendees =
function(mailMsg) {

    if(!mailMsg.isInvite()) return null;

	var identity;
    var attendees = mailMsg.invite.getAttendees();

    if(!attendees) return null;
    
	for (var i = 0, count = attendees.length; i < count; i++) {
		var address = attendees[i].url;
		if (address) {
			identity = this._addressToIdentity[address.toLowerCase()];
			if(identity) {
				return identity;
			}
		}
	}
    
	return null;
};

ZmIdentityCollection.prototype.getIdentityBySendAddress =
function(address) {
    for(var id in this._idToIdentity){
        var identity = this._idToIdentity[id];
        if(identity.sendFromAddress == address){
            return identity;
        }
    }
    return null;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmDataSource")) {
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
 * Creates a data source.
 * @class
 * This class represents a data source.
 * 
 * @param	{constant}	type	the account type (see <code>ZmAccount.TYPE_</code> constants)
 * @param	{String}	id		the id
 * 
 * @extends		ZmAccount
 */
ZmDataSource = function(type, id) {
	if (arguments.length == 0) { return; }
	ZmAccount.call(this, type, id);
	this.reset();
};

ZmDataSource.prototype = new ZmAccount;
ZmDataSource.prototype.constructor = ZmDataSource;

ZmDataSource.prototype.toString =
function() {
	return "ZmDataSource";
};

//
// Constants
//
/**
 * Defines the "cleartext" connection type.
 */
ZmDataSource.CONNECT_CLEAR = "cleartext";
/**
 * Defines the "ssl" connection type.
 */
ZmDataSource.CONNECT_SSL = "ssl";
ZmDataSource.CONNECT_DEFAULT = ZmDataSource.CONNECT_CLEAR;

ZmDataSource.POLL_NEVER = "0";

// soap attribute to property maps

ZmDataSource.DATASOURCE_ATTRS = {
	// SOAP attr:		JS property
	"id":				"id",
	"name":				"name",
	"isEnabled":		"enabled",
	"emailAddress":		"email",
	"host":				"mailServer",
	"port":				"port",
	"username":			"userName",
	"password":			"password",
	"l":				"folderId",
	"connectionType":	"connectionType",
	"pollingInterval":	"pollingInterval",
    "smtpEnabled":      "smtpEnabled",
	"leaveOnServer":	"leaveOnServer" // POP only
};

ZmDataSource.IDENTITY_ATTRS = {
	// SOAP attr:					JS property
	"fromDisplay":					"sendFromDisplay",
	"useAddressForForwardReply":	"setReplyTo",
	"replyToAddress":				"setReplyToAddress",
	"replyToDisplay":				"setReplyToDisplay",
	"defaultSignature":				"signature",
	"forwardReplySignature":		"replySignature"
};

//
// Data
//

ZmDataSource.prototype.ELEMENT_NAME = "dsrc";

// data source settings

ZmDataSource.prototype.enabled = true;

// basic settings

ZmDataSource.prototype.mailServer = "";
ZmDataSource.prototype.userName = "";
ZmDataSource.prototype.password = "";
ZmDataSource.prototype.folderId = ZmOrganizer.ID_INBOX;

// advanced settings

ZmDataSource.prototype.leaveOnServer = true;
ZmDataSource.prototype.connectionType = ZmDataSource.CONNECT_DEFAULT;

//
// Public methods
//

/** NOTE: Email is same as the identity's from address. */
ZmDataSource.prototype.setEmail =
function(email) {
	this.email = email;
};

ZmDataSource.prototype.getEmail =
function() {
	var email = this.email != null ? this.email : this.identity.getField(ZmIdentity.SEND_FROM_ADDRESS); // bug: 23042
	if (!email) { // bug: 38175
		var provider = ZmDataSource.getProviderForAccount(this);
		var host = (provider && provider._host) || this.mailServer;
		email = "";
        if (this.userName) {
            if (this.userName.match(/@/)) email = this.userName; // bug: 48186
            else if (host) email = [ this.userName, host].join("@");
        }
	}
	return email;
};

ZmDataSource.prototype.setFolderId =
function(folderId) {
	// TODO: Is there a better way to do this?
	//       I basically need to have the folder selector on the options
	//       page have a value of -1 but allow other code to see that and
	//       fill in the correct folder id. But I don't want it to
	//       overwrite that value once set.
	if (folderId == -1 && this.folderId != ZmOrganizer.ID_INBOX) { return; }
	this.folderId = folderId;
};

ZmDataSource.prototype.getFolderId =
function() {
	return this.folderId;
};

ZmDataSource.prototype.getIdentity =
function() {
	return this.identity;
};

// operations

ZmDataSource.prototype.create =
function(callback, errorCallback, batchCommand) {
	var soapDoc = AjxSoapDoc.create("CreateDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		var pvalue = pname == "folderId"
			? ZmOrganizer.normalizeId(this[pname])
			: this[pname];
		if (pname == "id" || (!pvalue && pname != "enabled" && pname != "leaveOnServer")) continue;

		dsrc.setAttribute(aname, String(pvalue));
	}
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		var pvalue = identity[pname];
		if (!pvalue) continue;

		dsrc.setAttribute(aname, String(pvalue));
	}

	var respCallback = new AjxCallback(this, this._handleCreateResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		batchCommand.setSensitive(Boolean(this.password));
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: Boolean(this.password),
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

ZmDataSource.prototype.save = function(callback, errorCallback, batchCommand, isIdentity) {

	var soapDoc = AjxSoapDoc.create("ModifyDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	// NOTE: If this object is a proxy, we guarantee that the
	//       the id attribute is *always* set.
	dsrc.setAttribute("id", this.id);
    if (!isIdentity) {
        for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
            var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
            if (!this.hasOwnProperty(pname)) {
                continue;
            }
            var avalue = this[pname];
            if (pname === "folderId") {
                avalue = ZmOrganizer.normalizeId(avalue);
            }
            // server sends us pollingInterval in ms, expects it back in seconds (!)
            // since it is not a user-visible value, it's safer to not send it back at all
            else if (pname === "pollingInterval") {
                continue;
            }
            dsrc.setAttribute(aname, String(avalue));
        }
    }
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		if (!identity.hasOwnProperty(pname)) continue;

		var avalue = identity[pname];
		dsrc.setAttribute(aname, String(avalue));
	}

	var respCallback = new AjxCallback(this, this._handleSaveResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		batchCommand.setSensitive(Boolean(this.password));
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: Boolean(this.password),
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

ZmDataSource.prototype.doDelete =
function(callback, errorCallback, batchCommand) {
	var soapDoc = AjxSoapDoc.create("DeleteDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	dsrc.setAttribute("id", this.id);

	var respCallback = new AjxCallback(this, this._handleDeleteResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

/**
 * Tests the data source connection.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCommand		the batch command
 * @param	{Boolean}	noBusyOverlay		if <code>true</code>, do not show busy overlay
 * @return	{Object}	the response
 */
ZmDataSource.prototype.testConnection =
function(callback, errorCallback, batchCommand, noBusyOverlay) {
	var soapDoc = AjxSoapDoc.create("TestDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);

	var attrs = ["host", "port", "username", "password", "connectionType", "leaveOnServer"];
	for (var i = 0; i < attrs.length; i++) {
		var aname = attrs[i];
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		dsrc.setAttribute(aname, this[pname]);
	}

	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, callback, errorCallback);
		batchCommand.setSensitive(true);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: true,
		asyncMode: Boolean(callback),
		noBusyOverlay: noBusyOverlay,
		callback: callback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

/**
 * Gets the port.
 * 
 * @return	{int}	port
 */
ZmDataSource.prototype.getPort =
function() {
	return this.port || this.getDefaultPort();
};

ZmDataSource.prototype.isStatusOk = function() {
	return this.enabled && !this.failingSince;
};

ZmDataSource.prototype.setFromJson =
function(obj) {
	// errors
	if (obj.failingSince) {
		this.failingSince = obj.failingSince;
		this.lastError = (obj.lastError && obj.lastError[0]._content) || ZmMsg.unknownError;
	}
	else {
		delete this.failingSince;
		delete this.lastError;
	}
	// data source fields
	for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
		var avalue = obj[aname];
		if (avalue == null) continue;
		if (aname == "isEnabled" || aname == "leaveOnServer") {
			avalue = avalue == "1" || String(avalue).toLowerCase() == "true";
		}
        // server sends us pollingInterval in ms, expects it back in seconds (!)
        else if (aname === "pollingInterval") {
            avalue = avalue / 1000;
        }
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		this[pname] = avalue;
	}

	// pseudo-identity fields
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var avalue = obj[aname];
		if (avalue == null) continue;
		if (aname == "useAddressForForwardReply") {
			avalue = avalue == "1" || String(avalue).toLowerCase() == "true";
		}

		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		identity[pname] = avalue;
	}
	this._setupIdentity();
};

ZmDataSource.prototype.reset = function() {
	// reset data source properties
	// NOTE: These have default values on the prototype object
	delete this.mailServer;
	delete this.userName;
	delete this.password;
	delete this.folderId;
	delete this.leaveOnServer;
	delete this.connectionType;
	delete this.pollingInterval;
	// other
	this.email = "";
	this.port = this.getDefaultPort();

	// reset identity
	var identity = this.identity = new ZmIdentity();
	identity.id = this.id;
	identity.isFromDataSource = true;
	
	// saving the identity itself won't work; need to save the data source
	var self = this;
	identity.save = function(callback, errorCallback, batchCommand) {
		ZmDataSource.prototype.save.call(self, callback, errorCallback, batchCommand, true);
	};
};

ZmDataSource.prototype.getProvider = function() {
	return ZmDataSource.getProviderForAccount(this);
};

//
// Public functions
//

// data source providers - provides default values

/**
 * Adds a data source provider. The registered providers are objects that
 * specify default values for data sources. This can be used to show the
 * user a list of known email providers (e.g. Yahoo! Mail) to pre-fill the
 * account information.
 *
 * @param {Hash}	provider  a hash of provider information
 * @param	{String}	provider.id		a unique identifier for this provider
 * @param	{String}	provider.name	the name of this provider to display to the user
 * @param	{String}	[provider.type]		the type (see <code>ZmAccount.TYPE_</code> constants)
 * @param	{String}	[provider.connectionType]	the connection type (see <code>ZmDataSource.CONNECT_</code> constants)
 * @param	{String}	[provider.host]	the server
 * @param	{String}	[provider.pollingInterval]		the polling interval
 * @param	{Boolean}	[provider.leaveOnServer]	if <code>true</code>, leave message on server (POP only)
 */
ZmDataSource.addProvider = function(provider) {
	var providers = ZmDataSource.getProviders();
	providers[provider.id] = provider;
	// normalize values -- defensive programming
	if (provider.type) {
		provider.type = provider.type.toLowerCase() == "pop" ? ZmAccount.TYPE_POP : ZmAccount.TYPE_IMAP;
	}
	else {
		provider.type = ZmAccount.TYPE_POP;
	}
	if (provider.connectionType) {
		var isSsl = provider.connectionType.toLowerCase() == "ssl";
		provider.connectionType =  isSsl ? ZmDataSource.CONNECT_SSL : ZmDataSource.CONNECT_CLEAR;
	}
	else {
		provider.connectionType = ZmDataSource.CONNECT_CLEAR;
	}
	if (!provider.port) {
		var isPop = provider.type == ZmAccount.TYPE_POP;
		if (isSsl) {
			provider.port = isPop ? ZmPopAccount.PORT_SSL : ZmImapAccount.PORT_SSL;
		}
		else {
			provider.port = isPop ? ZmPopAccount.PORT_CLEAR : ZmImapAccount.PORT_CLEAR;
		}
	}
};

/**
 * Gets the providers.
 * 
 * @return	{Array}		an array of providers
 */
ZmDataSource.getProviders =
function() {
	if (!ZmDataSource._providers) {
		ZmDataSource._providers = {};
	}
	return ZmDataSource._providers;
};

/**
 * Gets the provider.
 * 
 * @param	{ZmAccount}	account		the account
 * @return	{Hash}		the provider or <code>null</code> for none
 */
ZmDataSource.getProviderForAccount =
function(account) {
	return ZmDataSource.getProviderForHost(account.mailServer);
};

/**
 * Gets the provider.
 * 
 * @param	{String}	host		the host
 * @return	{Hash}		the provider or <code>null</code> for none
 */
ZmDataSource.getProviderForHost =
function(host) {
	var providers = ZmDataSource.getProviders();
	for (var id in providers) {
		hasProviders = true;
		var provider = providers[id];
		if (provider.host == host) {
			return provider;
		}
	}
	return null;
};

/**
 * Removes all providers.
 */
ZmDataSource.removeAllProviders = function() {
	delete ZmDataSource._providers;
};

//
// Protected methods
//


ZmDataSource.prototype._setupIdentity =
function() {
	this.identity.useWhenSentTo = true;
	this.identity.whenSentToAddresses = [ this.getEmail() ];
	this.identity.name = this.name;
};

ZmDataSource.prototype._loadFromDom =
function(data) {
	this.setFromJson(data);
};

ZmDataSource.prototype._handleCreateResponse =
function(callback, result) {
	var resp = result._data.CreateDataSourceResponse;
	this.id = resp[this.ELEMENT_NAME][0].id;
	this.identity.id = this.id;
	this._setupIdentity();
	delete this._new;
	delete this._dirty;

	appCtxt.getDataSourceCollection().add(this);

	var apps = [ZmApp.MAIL, ZmApp.PORTAL];
	for (var i=0; i<apps.length; i++) {
		var app = appCtxt.getApp(apps[i]);
		if (app) {
			var overviewId = app.getOverviewId();
			var treeView = appCtxt.getOverviewController().getTreeView(overviewId, ZmOrganizer.FOLDER);
			var fid = appCtxt.getActiveAccount().isMain ? this.folderId : ZmOrganizer.getSystemId(this.folderId);
			var treeItem = treeView ? treeView.getTreeItemById(fid) : null;
			if (treeItem) {
				// reset the icon in the tree view if POP account since the first time it
				// was created, we didnt know it was a data source
				if (this.type == ZmAccount.TYPE_POP && this.folderId != ZmFolder.ID_INBOX) {
					treeItem.setImage("POPAccount");
				}
				else if (this.type == ZmAccount.TYPE_IMAP) {
					// change imap folder to a tree header since folder is first created
					// without knowing its a datasource
					treeItem.dispose();
					var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
					var parentNode = treeView.getTreeItemById(rootId);
					var organizer = appCtxt.getById(this.folderId);
					treeView._addNew(parentNode, organizer);
				}
			}
		}
	}

	if (callback) {
		callback.run();
	}
};

ZmDataSource.prototype._handleSaveResponse =
function(callback, result) {
	delete this._dirty;

	var collection = appCtxt.getDataSourceCollection();
	// NOTE: By removing and adding it again, we make this proxy the
	//       base datasource object in the collection.
	collection.remove(this);
	collection.add(this);

	if (callback) {
		callback.run();
	}
};

ZmDataSource.prototype._handleDeleteResponse =
function(callback, result) {
	appCtxt.getDataSourceCollection().remove(this);

	var overviewId = appCtxt.getApp(ZmApp.MAIL).getOverviewId();
	var treeView = appCtxt.getOverviewController().getTreeView(overviewId, ZmOrganizer.FOLDER);
	var fid = appCtxt.getActiveAccount().isMain ? this.folderId : ZmOrganizer.getSystemId(this.folderId);
	if(this.folderId == ZmAccountsPage.DOWNLOAD_TO_FOLDER && this._object_ && this._object_.folderId) {
		fid = this._object_.folderId;
	}	
	var treeItem = treeView ? treeView.getTreeItemById(fid) : null;
	if (treeItem) {
		if (this.type == ZmAccount.TYPE_POP && this.folderId != ZmFolder.ID_INBOX) {
			// reset icon since POP folder is no longer hooked up to a datasource
			treeItem.setImage("Folder");
		} else if (this.type == ZmAccount.TYPE_IMAP) {
			// reset the icon in the tree view if POP account since the first time it
			// was created, we didnt know it was a data source
			treeItem.dispose();
			var parentNode = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
			var organizer = appCtxt.getById(fid);
			if (organizer) {
				treeView._addNew(parentNode, organizer);
			}
		}
	}

	if (callback) {
		callback.run();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmDataSourceCollection")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the data source collection.
 * @class
 * This class represents a data source collection.
 * 
 * @extends		ZmModel
 */
ZmDataSourceCollection = function() {
    ZmModel.call(this, ZmEvent.S_DATA_SOURCE);
	this._initialized = false;
	this._itemMap = {};
    this._pop3Map = {};
	this._imapMap = {};
};
ZmDataSourceCollection.prototype = new ZmModel;
ZmDataSourceCollection.prototype.constructor = ZmDataSourceCollection;

//
// Public methods
//

ZmDataSourceCollection.prototype.toString =
function() {
	return "ZmDataSourceCollection";
};

ZmDataSourceCollection.prototype.getItems = function() {
	return AjxUtil.values(this._itemMap);
};

ZmDataSourceCollection.prototype.getItemsFor = function(folderId) {
    var accounts = [];
    for (var id in this._itemMap) {
        var account = this._itemMap[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

/**
 * Gets the POP accounts.
 * 
 * @return	{Array}	an array of {@link ZmPopAccount} objects
 */
ZmDataSourceCollection.prototype.getPopAccounts = function() {
    return AjxUtil.values(this._pop3Map);
};

/**
 * Gets the IMAP accounts.
 * 
 * @return	{Array}	an array of {@link ZmImapAccount} objects
 */
ZmDataSourceCollection.prototype.getImapAccounts = function() {
    return AjxUtil.values(this._imapMap);
};

/**
 * Gets the POP accounts.
 * 
 * @param	{String}	folderId		the folder id
 * @return	{Array}	an array of {@link ZmPopAccount} objects
 */
ZmDataSourceCollection.prototype.getPopAccountsFor = function(folderId) {
    var accounts = [];
    for (var id in this._pop3Map) {
        var account = this._pop3Map[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

/**
 * Gets the IMAP accounts.
 * 
 * @param	{String}	folderId		the folder id
 * @return	{Array}	an array of {@link ZmImapAccount} objects
 */
ZmDataSourceCollection.prototype.getImapAccountsFor = function(folderId) {
    var accounts = [];
    for (var id in this._imapMap) {
        var account = this._imapMap[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

ZmDataSourceCollection.prototype.importMailFor = function(folderId) {
	this.importMail(this.getItemsFor(folderId));
};

ZmDataSourceCollection.prototype.importPopMailFor = function(folderId) {
	this.importMail(this.getPopAccountsFor(folderId));
};

ZmDataSourceCollection.prototype.importImapMailFor = function(folderId) {
	this.importMail(this.getImapAccountsFor(folderId));
};

ZmDataSourceCollection.prototype.importMail = function(accounts) {
    if (accounts && accounts.length > 0) {
        var sourceMap = {};
        var soapDoc = AjxSoapDoc.create("ImportDataRequest", "urn:zimbraMail");
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            sourceMap[account.id] = account;

            var dsrc = soapDoc.set(account.ELEMENT_NAME);
            dsrc.setAttribute("id", account.id);
        }

	    // send import request
        var params = {
            soapDoc: soapDoc,
            asyncMode: true,
	        noBusyOverlay: true,
            callback: null,
            errorCallback: null
        };
        appCtxt.getAppController().sendRequest(params);

	    // kick off check status request because import request
	    // doesn't return for (potentially) a looong time
	    var delayMs = 2000;
	    var action = new AjxTimedAction(this, this.checkStatus, [sourceMap, delayMs]);
	    AjxTimedAction.scheduleAction(action, delayMs);
    }
};

ZmDataSourceCollection.prototype.getById = function(id) {
	return this._itemMap[id];
};

/**
 * Gets a list of data sources associated with the given folder ID.
 *
 * @param {String}	folderId		[String]	the folderId
 * @param {constant}	type			the type of data source (see <code>ZmAccount.TYPE_</code> constants)
 * @return	{Array}	an array of items
 * 
 * @see	ZmAccount
 */
ZmDataSourceCollection.prototype.getByFolderId = function(folderId, type) {
	var list = [];
	for (var id in this._itemMap) {
		var item = this._itemMap[id];
		if (item.folderId == folderId) {
			if (!type || (type && type == item.type))
				list.push(item);
		}
	}
	return list;
};

ZmDataSourceCollection.prototype.add = function(item) {
	this._itemMap[item.id] = item;
	if (item.type == ZmAccount.TYPE_POP) {
		this._pop3Map[item.id] = item;
	}
	else if (item.type == ZmAccount.TYPE_IMAP) {
		this._imapMap[item.id] = item;
	}
	appCtxt.getIdentityCollection().add(item.getIdentity());
	this._notify(ZmEvent.E_CREATE, {item:item});
};

ZmDataSourceCollection.prototype.modify = function(item) {
	appCtxt.getIdentityCollection().notifyModify(item.getIdentity(), true);
    this._notify(ZmEvent.E_MODIFY, {item:item});
};

ZmDataSourceCollection.prototype.remove = function(item) {
    delete this._itemMap[item.id];
	delete this._pop3Map[item.id];
	delete this._imapMap[item.id];
	appCtxt.getIdentityCollection().remove(item.getIdentity());
    this._notify(ZmEvent.E_DELETE, {item:item});
};

ZmDataSourceCollection.prototype.initialize = function(dataSources) {
	if (!dataSources || this._initialized) { return; }

	var errors = [];

	if (appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED)) {
		var popAccounts = dataSources.pop3 || [];
		for (var i = 0; i < popAccounts.length; i++) {
			var object = popAccounts[i];
			var dataSource = new ZmPopAccount(object.id);
			dataSource.setFromJson(object);
			this.add(dataSource);
			if (!dataSource.isStatusOk()) {
				errors.push(dataSource);
			}
		}
	}

	if (appCtxt.get(ZmSetting.IMAP_ACCOUNTS_ENABLED)) {
		var imapAccounts = dataSources.imap || [];
		for (var i = 0; i < imapAccounts.length; i++) {
			var object = imapAccounts[i];
			var dataSource = new ZmImapAccount(object.id);
			dataSource.setFromJson(object);
			this.add(dataSource);
			if (!dataSource.isStatusOk()) {
				errors.push(dataSource);
			}
		}
	}

	this._initialized = true;

	var count = errors.length;
	if (count > 0) {
		// build error message
		var array = [
			AjxMessageFormat.format(ZmMsg.dataSourceFailureDescription, [count])
		];
		for (var i = 0; i < count; i++) {
			var dataSource = errors[i];
			var timestamp = Number(dataSource.failingSince);
			var lastError = dataSource.lastError;
			if (isNaN(timestamp)) {
				var pattern = ZmMsg.dataSourceFailureItem_noDate;
				var params = [AjxStringUtil.htmlEncode(dataSource.getName()), AjxStringUtil.htmlEncode(lastError)];
			} else {
				var pattern = ZmMsg.dataSourceFailureItem;
				var params = [AjxStringUtil.htmlEncode(dataSource.getName()), new Date(timestamp * 1000), AjxStringUtil.htmlEncode(lastError)];
			}
			array.push(AjxMessageFormat.format(pattern, params));
		}
		array.push(ZmMsg.dataSourceFailureInstructions);
		var message = array.join("");

		// show error message
		var shell = DwtShell.getShell(window);
		var dialog = new DwtMessageDialog({parent:shell,buttons:[DwtDialog.OK_BUTTON,DwtDialog.CANCEL_BUTTON]});
		dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE, ZmMsg.dataSourceFailureTitle);
		dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this.__handleErrorDialogOk, [dialog]));
		dialog.popup();
	}
};

ZmDataSourceCollection.prototype.__handleErrorDialogOk = function(dialog) {
	dialog.popdown();

	var callback = new AjxCallback(this, this.__gotoPrefSection, ["ACCOUNTS"]);
	appCtxt.getAppController().activateApp(ZmApp.PREFERENCES, true, callback);
};

ZmDataSourceCollection.prototype.__gotoPrefSection = function(prefSectionId) {
	var controller = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController();
	controller.getPrefsView().selectSection(prefSectionId);
};

/**
 * Periocially check status of the import
 * @param {Object} sourceMap map of accounts
 * @param {int} delayMs delay time between checks
 */
ZmDataSourceCollection.prototype.checkStatus =
function(sourceMap, delayMs) {
	// Slowly back off import status checks but no more than 15 secs.
	if (delayMs && delayMs < 15000) {
		delayMs += 2000;
	}

    var soapDoc = AjxSoapDoc.create("GetImportStatusRequest", "urn:zimbraMail");
    var callback = new AjxCallback(this, this._checkStatusResponse, [sourceMap, delayMs]);
    var params = {
        soapDoc: soapDoc,
        asyncMode: true,
        callback: callback,
        errorCallback: null
    };

    var appController = appCtxt.getAppController();
    var action = new AjxTimedAction(appController, appController.sendRequest, [params]);
    AjxTimedAction.scheduleAction(action, delayMs || 2000);
};

//
// Protected methods
//

ZmDataSourceCollection.prototype._checkStatusResponse =
function(sourceMap, delayMs, result) {
	var dataSources = [];

	// gather sources from the response
	var popSources = result._data.GetImportStatusResponse.pop3;
	if (popSources) {
		for (var i in popSources) {
			dataSources.push(popSources[i]);
		}
	}
	var imapSources = result._data.GetImportStatusResponse.imap;
	if (imapSources) {
		for (var i in imapSources) {
			dataSources.push(imapSources[i]);
		}
	}
	var genericSources = result._data.GetImportStatusResponse.dsrc;
	if (genericSources) {
		for (var i in genericSources) {
			dataSources.push(genericSources[i]);
		}
	}

	// is there anything to do?
	if (dataSources.length == 0) return;

	// report status
	for (var i = 0; i < dataSources.length; i++) {
		var dsrc = dataSources[i];
		// NOTE: Only report the ones we were asked to; forget others
		if (!dsrc.isRunning && sourceMap[dsrc.id]) {
			var source = sourceMap[dsrc.id];
			if (sourceMap[dsrc.id]) {
				delete sourceMap[dsrc.id];
				if (dsrc.success) {
					var message = AjxMessageFormat.format(ZmMsg.dataSourceLoadSuccess, AjxStringUtil.htmlEncode(source.name));
					appCtxt.setStatusMsg(message);
				}
				else {
					var message = AjxMessageFormat.format(ZmMsg.dataSourceLoadFailure, AjxStringUtil.htmlEncode(source.name));
					appCtxt.setStatusMsg(message, ZmStatusView.LEVEL_CRITICAL);
					var dialog = appCtxt.getErrorDialog();
					dialog.setMessage(message, dsrc.error, DwtMessageDialog.CRITICAL_STYLE);
					dialog.popup();
				}
			}
		}
	}

	// continue checking status
	if (AjxUtil.keys(sourceMap).length > 0) {
		this.checkStatus(sourceMap, delayMs);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailListGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * ZmMailListGroup is the base class for creating a mail group to be displayed by the ListView.  A mail group consists of sections and a section header.
 * Each section is an array of HTML strings that divide the group.  For example, ZmMailListSizeGroup has sections to divide
 * the group based on size: Enormous, Huge, Very Large, etc.  Each section consists of an HTML representation of the
 * message and a section header.
 */
ZmMailListGroup = function(){
    this._showEmptySectionHeader = false;
    this._sectionHeaders = [];
    this._init();
};


/**
 *  Overload method; return HTML string for all sections.
 *  @param {boolean} sortAsc    true/false if sort ascending
 *  @return {String} HTML for all sections including section header
 */
ZmMailListGroup.prototype.getAllSections =
function(sortAsc) {

};

/**
 * Adds item to section; Groups should overload
 * @param {ZmMailMsg} msg   mail message
 * @param {String} item  HTML to add to section
 * @return {String} section returns section if successfully added, else returns null
 */
ZmMailListGroup.prototype.addMsgToSection =
function(msg, item) {

};

/**
 * Determines if message is in section/subgroup; Groups should overload
 * @param {String} section ID of section
 * @param {ZmMailMsg} msg
 * @return {boolean} true/false
 */
ZmMailListGroup.prototype.isMsgInSection =
function(section, msg) {

};

/**
 * Clears all sections
 */
ZmMailListGroup.prototype.clearSections =
function() {
    this._init();
};

/**
 * return the section size
 * @param {String} section id
 */
ZmMailListGroup.prototype.getSectionSize =
function(section) {
    if (this._section[section]){
        return this._section[section].length;
    }
    return -1;
};

/**
 * Returns section title
 * @param {String} section
 */
ZmMailListGroup.prototype.getSectionTitle =
function(section) {
    return this._getSectionHeaderTitle(section);
};

ZmMailListGroup.prototype.getSectionHeader =
function(headerTitle) {
    var header = new ZmMailListSectionHeader(this, {headerTitle : headerTitle});
    this._sectionHeaders.push(header);
    return header.getHeaderHtml();
};

ZmMailListGroup.prototype.resetSectionHeaders =
function() {
    for (var i = 0; i < this._sectionHeaders.length; i++) {
        var el = this._sectionHeaders[i].getHtmlElement();
        el.parentNode.removeChild(el);
    }

    this._sectionHeaders = [];
};

/**
 * Returns the sort by for the Group. For example size would be ZmSearch.SIZE_ASC or ZmSearch.SIZE_DESC
 * Groups should overload
 * @param {boolean} sortAsc
 * @return {String} sortBy
 */
ZmMailListGroup.prototype.getSortBy =
function(sortAsc) {
    return null;
};

/**
 * Returns the section headers for the group
 * @return {array} array of section headers
 */
ZmMailListGroup.prototype.getAllSectionHeaders =
function() {
   return this._sectionHeaders;
};

//PROTECTED METHODs

/**
 * initialize sections
 */
ZmMailListGroup.prototype._init =
function() {
    this._section = {};
};

/**
 * Groups should overload
 * @param {String} section
 * @return {String} section title
 */
ZmMailListGroup.prototype._getSectionHeaderTitle =
function(section) {
    return "";
};

//STATIC methods

/**
 * Return Group object based on groupId
 * @param {String} groupId
 * @return {ZmMailListGroup} group object
 */
ZmMailListGroup.getGroup =
function(groupId) {

    switch (groupId){
        case ZmId.GROUPBY_DATE:
            return new ZmMailListDateGroup();

        case ZmId.GROUPBY_SIZE:
            return new ZmMailListSizeGroup();

        case ZmId.GROUPBY_PRIORITY:
            return new ZmMailListPriorityGroup();

        case ZmId.GROUPBY_FROM:
            return new ZmMailListFromGroup();

        default:
            return null;
    }

};

/**
 * Return the header field based on groupId
 * @param {String} groupId
 * @param {boolean} isMultiColumn
 */
ZmMailListGroup.getHeaderField =
function(groupId, isMultiColumn) {

    if (isMultiColumn == false) {
        return ZmId.FLD_SORTED_BY;
    }

    switch (groupId) {
      case ZmId.GROUPBY_SIZE:
        return ZmId.FLD_SIZE;

      case ZmId.GROUPBY_FROM:
        return ZmId.FLD_FROM;

      case ZmId.GROUPBY_DATE:
        return ZmId.FLD_DATE;

      default:
        return null;
    }

};

/**
 * Return the group Id based on the sort field
 * @param {String} sortField
 */
ZmMailListGroup.getGroupIdFromSortField =
function(sortField, type) {
    switch (sortField) {
        case ZmId.FLD_FROM:
			if (type === ZmItem.CONV) {
				return ZmId.GROUPBY_NONE;
			}
            return ZmId.GROUPBY_FROM;

        case ZmId.FLD_SIZE:
            return ZmId.GROUPBY_SIZE;

        case ZmId.FLD_DATE:
            return ZmId.GROUPBY_DATE;

        default:
            return ZmId.GROUPBY_NONE;
    }
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailListDateGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Date group divides messages into the following sections:
 * Today
 * Yesterday
 * Day of week -- not today or yesterday, but still within this week
 * Last Week
 * Two Weeks Ago
 * Three Weeks Ago
 * Earlier this Month
 * Last Month
 * Older
 *
 */
ZmMailListDateGroup = function(){
    this.id = ZmId.GROUPBY_DATE;
	this.field = ZmItem.F_DATE;
	this._weekStartDay = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;
	var dayOfWeek = this._getToday().getDay();
	this._keys = this._sortKeys(dayOfWeek, false);
    ZmMailListGroup.call(this);
};

ZmMailListDateGroup.prototype = new ZmMailListGroup;
ZmMailListDateGroup.prototype.constructor =  ZmMailListDateGroup;

ZmMailListDateGroup.MONDAY = "MONDAY";
ZmMailListDateGroup.TUESDAY = "TUESDAY";
ZmMailListDateGroup.WEDNESDAY = "WEDNESDAY";
ZmMailListDateGroup.THURSDAY = "THURSDAY";
ZmMailListDateGroup.FRIDAY = "FRIDAY";
ZmMailListDateGroup.SATURDAY = "SATURDAY";
ZmMailListDateGroup.SUNDAY = "SUNDAY";
ZmMailListDateGroup.TODAY = "TODAY";
ZmMailListDateGroup.YESTERDAY = "YESTERDAY";
ZmMailListDateGroup.LAST_WEEK = "LAST_WEEK";
ZmMailListDateGroup.TWO_WEEKS_AGO = "TWO_WEEKS_AGO";
ZmMailListDateGroup.THREE_WEEKS_AGO = "THREE_WEEKS_AGO";
ZmMailListDateGroup.EARLIER_THIS_MONTH = "EARLIER_THIS_MONTH";
ZmMailListDateGroup.LAST_MONTH = "LAST_MONTH";
ZmMailListDateGroup.OLDER = "OLDER";

ZmMailListDateGroup.GROUP = [ZmMailListDateGroup.TODAY, ZmMailListDateGroup.YESTERDAY, ZmMailListDateGroup.SUNDAY, ZmMailListDateGroup.MONDAY,
							 ZmMailListDateGroup.TUESDAY, ZmMailListDateGroup.WEDNESDAY, ZmMailListDateGroup.THURSDAY, ZmMailListDateGroup.FRIDAY,
							 ZmMailListDateGroup.SATURDAY, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.THREE_WEEKS_AGO,
							 ZmMailListDateGroup.EARLIER_THIS_MONTH, ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.OLDER];

ZmMailListDateGroup.WEEKDAYS = [ZmMailListDateGroup.SUNDAY, ZmMailListDateGroup.MONDAY, ZmMailListDateGroup.TUESDAY, ZmMailListDateGroup.WEDNESDAY,
							    ZmMailListDateGroup.THURSDAY, ZmMailListDateGroup.FRIDAY, ZmMailListDateGroup.SATURDAY];

ZmMailListDateGroup.SECTION_TITLE = {};
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.TODAY] = ZmMsg.today;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.YESTERDAY] = ZmMsg.yesterday;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.MONDAY] = I18nMsg.weekdayMonLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.TUESDAY] = I18nMsg.weekdayTueLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.WEDNESDAY] = I18nMsg.weekdayWedLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.THURSDAY] = I18nMsg.weekdayThuLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.FRIDAY] = I18nMsg.weekdayFriLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.SATURDAY] = I18nMsg.weekdaySatLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.SUNDAY] = I18nMsg.weekdaySunLong;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.LAST_WEEK] = ZmMsg.lastWeek;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.TWO_WEEKS_AGO] = ZmMsg.twoWeeksAgo;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.THREE_WEEKS_AGO] = ZmMsg.threeWeeksAgo;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.EARLIER_THIS_MONTH] = ZmMsg.earlierThisMonth;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.LAST_MONTH] = ZmMsg.lastMonth;
ZmMailListDateGroup.SECTION_TITLE[ZmMailListDateGroup.OLDER] = ZmMsg.older;

ZmMailListDateGroup.TIME = {};
ZmMailListDateGroup.TIME["YESTERDAY"] = AjxDateUtil.MSEC_PER_DAY;
ZmMailListDateGroup.TIME["LAST_WEEK"] = AjxDateUtil.MSEC_PER_DAY * 7;
ZmMailListDateGroup.TIME["TWO_WEEKS_AGO"] = AjxDateUtil.MSEC_PER_DAY * 14;
ZmMailListDateGroup.TIME["THREE_WEEKS_AGO"] = AjxDateUtil.MSEC_PER_DAY * 21;


/**
 *  returns HTML string for all sections.
 *  @param {boolean} sortAsc    true/false if sort ascending
 *  @return {String} HTML for all sections including section header
 * @param sortAsc
 */
ZmMailListDateGroup.prototype.getAllSections =
function(sortAsc) {
    var htmlArr = [];
	var dayOfWeek = this._getToday().getDay();
    var keys = sortAsc ? this._sortKeys(dayOfWeek, sortAsc) : this._keys; //keys have already been sorted desc
    for (var i=0; i<keys.length; i++) {
        if (this._section[keys[i]].length > 0) {
            htmlArr.push(this.getSectionHeader(ZmMailListDateGroup.SECTION_TITLE[keys[i]]));
            htmlArr.push(this._section[keys[i]].join(""));
        }
        else if (this._showEmptySectionHeader) {
            htmlArr.push(this.getSectionHeader(ZmMailListDateGroup.SECTION_TITLE[keys[i]]));
        }
    }
    return htmlArr.join("");
};

/**
 * Adds item to section
 * @param {ZmMailMsg} msg   mail message
 * @param {String} item  HTML to add to section
 * @return {String} section returns section if successfully added, else returns null
 */
ZmMailListDateGroup.prototype.addMsgToSection =
function(msg, item) {
   for (var i=0; i<this._keys.length; i++) {
       if (this.isMsgInSection(this._keys[i], msg)) {
        this._section[this._keys[i]].push(item);
        return this._keys[i];
       }
   }
};

/**
 * Determines if message is in group
 * @param {String} section ID of section
 * @param {ZmMailMsg} msg
 * @return {boolean} true/false
 */
ZmMailListDateGroup.prototype.isMsgInSection =
function(section, msg) {

   switch(section){
       case ZmMailListDateGroup.TODAY:
         return this._isToday(msg);

       case ZmMailListDateGroup.YESTERDAY:
        return this._isYesterday(msg);

       case ZmMailListDateGroup.MONDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.MONDAY);

       case ZmMailListDateGroup.TUESDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.TUESDAY);

       case ZmMailListDateGroup.WEDNESDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.WEDNESDAY);

       case ZmMailListDateGroup.THURSDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.THURSDAY);

       case ZmMailListDateGroup.FRIDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.FRIDAY);

       case ZmMailListDateGroup.SATURDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.SATURDAY);

       case ZmMailListDateGroup.SUNDAY:
        return this._isDayOfWeek(msg, AjxDateUtil.SUNDAY);

       case ZmMailListDateGroup.LAST_WEEK:
        return this._isWeeksAgo(msg, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.YESTERDAY);

       case ZmMailListDateGroup.TWO_WEEKS_AGO:
        return this._isWeeksAgo(msg, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.LAST_WEEK);

       case ZmMailListDateGroup.THREE_WEEKS_AGO:
        return this._isWeeksAgo(msg, ZmMailListDateGroup.THREE_WEEKS_AGO, ZmMailListDateGroup.TWO_WEEKS_AGO);

       case ZmMailListDateGroup.EARLIER_THIS_MONTH:
        return this._isEarlierThisMonth(msg);

       case ZmMailListDateGroup.LAST_MONTH:
        return this._isLastMonth(msg);

       case ZmMailListDateGroup.OLDER:
        return this._isOlder(msg);

       default:
        return false;
   }
};

/**
 * Returns the sort by (ZmSearch.DATE_ASC or ZmSearch.DATE_DESC)
 * @param {boolean} sortAsc
 * @return {String} sortBy
 */
ZmMailListDateGroup.prototype.getSortBy =
function(sortAsc) {
    if (sortAsc) {
        return ZmSearch.DATE_ASC;
    }
    return ZmSearch.DATE_DESC;
};

ZmMailListDateGroup.prototype._init =
function(){
  this._section = {};
  this._section[ZmMailListDateGroup.TODAY] = [];
  this._section[ZmMailListDateGroup.YESTERDAY] = [];
  this._section[ZmMailListDateGroup.SUNDAY] = [];
  this._section[ZmMailListDateGroup.MONDAY] = [];
  this._section[ZmMailListDateGroup.TUESDAY] = [];
  this._section[ZmMailListDateGroup.WEDNESDAY] = [];
  this._section[ZmMailListDateGroup.THURSDAY] = [];
  this._section[ZmMailListDateGroup.FRIDAY] = [];
  this._section[ZmMailListDateGroup.SATURDAY] = [];
  this._section[ZmMailListDateGroup.LAST_WEEK] = [];
  this._section[ZmMailListDateGroup.TWO_WEEKS_AGO] = [];
  this._section[ZmMailListDateGroup.THREE_WEEKS_AGO] = [];
  this._section[ZmMailListDateGroup.EARLIER_THIS_MONTH] = [];
  this._section[ZmMailListDateGroup.LAST_MONTH] = [];
  this._section[ZmMailListDateGroup.OLDER] = [];
};

/**
 * determines if mail message was received today
 * @param msg {ZmMailMsg} mail msg
 * @return {boolean}
 */
ZmMailListDateGroup.prototype._isToday =
function(msg){
    if(msg){
        var today = this._getToday();
        var d = this._getDateFromMsg(msg, true);
        if (d) {
            return today.getTime() == d.getTime();
        }
    }
    return false;
};

/**
 * determines if msg was received yesterday
 * @param msg {ZmMailMsg} mail msg
 * @return {boolean}
 */
ZmMailListDateGroup.prototype._isYesterday =
function(msg) {
    if (msg) {
        var d = this._getDateFromMsg(msg, true);
        var today = new Date();
        var todayTzOffset = today.getTimezoneOffset();
        var yesterday = new Date();
        yesterday.setTime(today.getTime() - AjxDateUtil.MSEC_PER_DAY);
        var yesterdayTzOffset = yesterday.getTimezoneOffset();
        var deltaTzOffset = todayTzOffset - yesterdayTzOffset;
        yesterday.setTime(yesterday.getTime() - (deltaTzOffset * 60000));
        yesterday.setHours(0, 0, 0, 0);
        if (d) {
            return yesterday.getTime() == d.getTime();
        }
    }

    return false;
};

/**
 * message is this week, but not today or yesterday
 * @param msg {ZmMailMsg} mail msg
 * @param dayOfWeek {integer} the day of the week to check against (e.g. Monday)
 * @return {boolean}
 */
ZmMailListDateGroup.prototype._isDayOfWeek =
function(msg, dayOfWeek) {
    if (msg) {
        var today = this._getToday();
        var thisWeek = AjxDateUtil.getWeekNumber(today);
        var thisYear = today.getYear();

        var d = this._getDateFromMsg(msg, true);
        if (d) {
            return d.getDay() == dayOfWeek && AjxDateUtil.getWeekNumber(d) == thisWeek &&
                   !this._isYesterday(msg) && !this._isToday(msg) && thisYear == d.getYear();
        }
    }
    return false;
};

/**
 * Determines if msg is from X number of weeks ago.
 * @param {ZmMailMsg} msg the mail message to evaluate
 * @param {String} minGroup Group oldest in date  (e.g. three weeks ago)
 * @param {String} maxGroup Group newest in date  (e.g. two weeks ago)
 */
ZmMailListDateGroup.prototype._isWeeksAgo =
function(msg, minGroup, maxGroup) {
	if (msg) {
		var today = this._getToday();
		var max = today.getTime() - ZmMailListDateGroup.TIME[maxGroup];
		var min = today.getTime() - ZmMailListDateGroup.TIME[minGroup];
		var d = this._getDateFromMsg(msg, true);
		if (d) {
			return d.getTime() >= min && d.getTime() < max;
		}
	}

	return false;
};

/**
 * message is earlier this month and also more than 3 weeks ago
 * @param msg {ZmMailMsg} mail msg
 * @return {boolbean}
 */
ZmMailListDateGroup.prototype._isEarlierThisMonth =
function(msg) {
    if (msg) {
        var today = this._getToday();
        var threeWeeksAgo = today.getTime() - ZmMailListDateGroup.TIME[ZmMailListDateGroup.THREE_WEEKS_AGO];
        var thisMonth = today.getMonth();
        var thisYear = today.getYear();
        var d = this._getDateFromMsg(msg, true);
        if (d) {
            return d.getTime() < threeWeeksAgo && (d.getYear() == thisYear && d.getMonth() == thisMonth);
        }
    }
    return false;
};

/**
 * message is last month and also more than 3 weeks ago from today
 * @param msg {ZmMailMsg} mail message
 * @return {boolean}
 */
ZmMailListDateGroup.prototype._isLastMonth =
function(msg) {
    if (msg) {
        var today = this._getToday();
	    var threeWeeksAgo = today.getTime() - ZmMailListDateGroup.TIME[ZmMailListDateGroup.THREE_WEEKS_AGO];
        var thisMonth = today.getMonth();
        var thisYear = today.getYear();
        var lastMonth = this._calculateLastMonth(thisMonth);
        var d = this._getDateFromMsg(msg, true);
        if (d) {
            if(d.getMonth() != thisMonth) {
                if (d.getYear() == thisYear) {
                    return d.getMonth() == lastMonth && d.getTime() < threeWeeksAgo;
                }
				else if (d.getYear() == (thisYear -1) && thisMonth == 0 && lastMonth == 11) {
					//handle the january, december case
					return d.getTime() < threeWeeksAgo;	
				}
            }
        }

    }
    return false;
};

/**
 * message is more than a month old
 * @param msg {ZmMailMsg} mail msg
 * @return {boolean}
 */
ZmMailListDateGroup.prototype._isOlder =
function(msg) {
    if (msg) {
        var today = this._getToday();
        var threeWeeksAgo = today.getTime() - ZmMailListDateGroup.TIME[ZmMailListDateGroup.THREE_WEEKS_AGO];
        var d = this._getDateFromMsg(msg, true);
        if (d) {
            return d.getTime() < threeWeeksAgo && !this._isEarlierThisMonth(msg) && !this._isLastMonth(msg);
        }
    }
    return false;
};

ZmMailListDateGroup.prototype._getDateFromMsg =
function(msg, resetHours) {
    if (msg) {
        var d = msg.sentDate ? new Date(msg.sentDate) : new Date(msg.date);
        if (d && resetHours) {
            d.setHours(0, 0, 0, 0);
        }
        return d;
    }
    return null;
};

/**
 * Sorts sections (e.g. Today, Yesterday, Days, Last Week, etc) by ASC or DESC order.  dayOfWeek is used to sort the week days in ASC/DESC order
 * @param dayOfWeek {integer} day value of today
 * @param sortAsc  {boolean} true if sort ascending
 * @return keys {array} sorted keys
 */
ZmMailListDateGroup.prototype._sortKeys =
function(dayOfWeek, sortAsc) {
    var keys = [];
	var sortedDays = this._sortThisWeek(dayOfWeek);
	sortedDays = sortedDays.slice(2); //account for today & yesterday
	keys = [ZmMailListDateGroup.TODAY, ZmMailListDateGroup.YESTERDAY];
	keys = keys.concat(sortedDays);
	keys = keys.concat([ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.THREE_WEEKS_AGO,
						ZmMailListDateGroup.EARLIER_THIS_MONTH, ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.OLDER]);
    if (sortAsc) {
        keys.reverse();
    }
    return keys;
};

ZmMailListDateGroup.prototype._calculateLastMonth =
function(month) {
    var lastMonth = month -1;
    if (lastMonth == -1){
        lastMonth = 11;
    }
    return lastMonth;
};

ZmMailListDateGroup.prototype._getToday =
function() {
  var today = new Date();
  today.setHours(0,0,0,0);
  return today;
};

ZmMailListDateGroup.prototype._getSectionHeaderTitle =
function(section) {
   if (ZmMailListDateGroup.SECTION_TITLE[section]) {
       return ZmMailListDateGroup.SECTION_TITLE[section];
   }

   return "";
};

/**
 * Sort days for this week.  If today is Monday & preferences is start week with Sunday, result will by [Monday, Sunday]
 * @param firstDay {integer}  day value of today
 * @return sorteDays {array} array of sorted days
 */
ZmMailListDateGroup.prototype._sortThisWeek =
function(firstDay) {
	var sortedDays = [];
	var count = 0;
	var foundStart = false;
	while (count < 7 && !foundStart) {
		if (firstDay == this._weekStartDay) {
			foundStart = true;
		}
		sortedDays[count] = ZmMailListDateGroup.WEEKDAYS[firstDay];
		firstDay--;
		if (firstDay < 0) {
			firstDay = 6;
		}
		count++;
	}

	return sortedDays;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailListFromGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * From Group divides messages into sort by sender.
 */
ZmMailListFromGroup = function() {
    this.id = ZmId.GROUPBY_FROM;
	this.field = ZmItem.F_FROM;
    ZmMailListGroup.call(this);

};

ZmMailListFromGroup.prototype = new ZmMailListGroup;
ZmMailListFromGroup.prototype.constructor =  ZmMailListFromGroup;

/**
 *  returns HTML string for all sections.
 *  @return {String} HTML for all sections including section header
 */
ZmMailListFromGroup.prototype.getAllSections =
function() {
    var htmlArr = [];
	var sections = this._sectionList;

	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		htmlArr.push(this.getSectionHeader(section));
		htmlArr.push(this._section[section].join(""));
	}

    return htmlArr.join("");
};

/**
 * Adds item to section
 * @param {ZmMailMsg} msg   mail message
 * @param {String} itemHtml  HTML to add to section
 * @return {String} section returns section if successfully added, else returns null
 */
ZmMailListFromGroup.prototype.addMsgToSection =
function(msg, itemHtml){
    var fromParticipant =  msg.getAddress(AjxEmailAddress.FROM);
    if (!fromParticipant) {
		return null;
	}
	var section = fromParticipant.getText();
	if (!this._section.hasOwnProperty(section)) {
		this._section[section] = [];
		this._sectionList.push(section);
	}
	this._section[section].push(itemHtml);
	return section;
};

/**
 * Returns the sort by (ZmSearch.NAME_ASC or ZmSearch.NAME_DESC)
 * @param {boolean} sortAsc
 * @return {String} sortBy
 */
ZmMailListFromGroup.prototype.getSortBy =
function(sortAsc) {
    return sortAsc ? ZmSearch.NAME_ASC : ZmSearch.NAME_DESC;
};

ZmMailListFromGroup.prototype._init =
function() {
    this._section = {};
	this._sectionList = [];
};

ZmMailListFromGroup.prototype._getSectionHeaderTitle =
function(section) {
	return section;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailListPriorityGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Priority Group divides a mail list into sections: Important & Unread, Important, Flagged, Everything else
 * This implemenation is experimental and based on Tag which will change in the future.
 * TODO:  Search needs to be batch request based. (implementation outside the scope of this object, but noting here)
 * @param group
 */
ZmMailListPriorityGroup = function(group) {
    this.id = ZmId.GROUPBY_PRIORITY;
    ZmMailListGroup.call(this);
};

ZmMailListPriorityGroup.prototype = new ZmMailListGroup;
ZmMailListPriorityGroup.prototype.constructor =  ZmMailListPriorityGroup;

ZmMailListPriorityGroup.IMPORTANT_UNREAD = "IMPORTANT_UNREAD";
ZmMailListPriorityGroup.IMPORTANT_READ = "IMPORTANT_READ";
ZmMailListPriorityGroup.FLAGGED = "FLAGGED";
ZmMailListPriorityGroup.EVERYTHING_ELSE = "EVERYTHING_ELSE";

ZmMailListPriorityGroup.TAG = "Important";

ZmMailListPriorityGroup.GROUP = [ZmMailListPriorityGroup.IMPORTANT_UNREAD, ZmMailListPriorityGroup.FLAGGED,
                                 ZmMailListPriorityGroup.IMPORTANT_READ, ZmMailListPriorityGroup.EVERYTHING_ELSE];

ZmMailListPriorityGroup.SECTION_TITLE = {};
ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.IMPORTANT_READ] = ZmMsg.mailPriorityImportantRead;
ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.IMPORTANT_UNREAD] = ZmMsg.mailPriorityImportantUnread;
ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.FLAGGED] = ZmMsg.mailPriorityFlagged;
ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.EVERYTHING_ELSE] = ZmMsg.mailPriorityEverythingElse;

ZmMailListPriorityGroup.prototype.getAllSections =
function() {
    var htmlArr = [];
    for (var i = 0; i<ZmMailListPriorityGroup.GROUP.length; i++) {
        if (this._section[ZmMailListPriorityGroup.GROUP[i]].length > 0) {
            htmlArr.push(this.getSectionHeader(ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.GROUP[i]]));
            htmlArr.push(this._section[ZmMailListPriorityGroup.GROUP[i]].join(""));
        }
        else if (this._showEmptySectionHeader) {
            htmlArr.push(this.getSectionHeader(ZmMailListPriorityGroup.SECTION_TITLE[ZmMailListPriorityGroup.GROUP[i]]));
        }
    }
    return htmlArr.join("");
};

ZmMailListPriorityGroup.prototype.addMsgToSection =
function(msg, item){
   for (var i = 0; i<ZmMailListPriorityGroup.GROUP.length; i++) {
       if (this.isMsgInSection(ZmMailListPriorityGroup.GROUP[i], msg)) {
           this._section[ZmMailListPriorityGroup.GROUP[i]].push(item);
           return true;
       }
   }
   return false;
};

ZmMailListPriorityGroup.prototype.isMsgInSection =
function(section, msg) {
    switch(section) {
        case ZmMailListPriorityGroup.IMPORTANT_UNREAD:
            return this._isImportantAndUnread(msg);

        case ZmMailListPriorityGroup.IMPORTANT_READ:
            return this._isImportantAndRead(msg);

        case ZmMailListPriorityGroup.FLAGGED:
            return this._isFlagged(msg);

        case ZmMailListPriorityGroup.EVERYTHING_ELSE:
           return this._noMatchingGroup(msg);

        default:
            return false;
    }
};

ZmMailListPriorityGroup.prototype._init =
function() {
	this._section = {};
    this._section[ZmMailListPriorityGroup.IMPORTANT_UNREAD] = [];
    this._section[ZmMailListPriorityGroup.IMPORTANT_READ] = [];
    this._section[ZmMailListPriorityGroup.FLAGGED] = [];
    this._section[ZmMailListPriorityGroup.EVERYTHING_ELSE] = [];
	if (!this._importantTag) {
		this._importantTag = this._getImportantTag();
	}
};

ZmMailListPriorityGroup.prototype._isImportantAndUnread =
function(msg){
   if (msg && this._importantTag) {
       if (msg.hasTag(this._importantTag.id) && msg.isUnread) {
           return true;
       }
   }
   return false;
};

ZmMailListPriorityGroup.prototype._isImportantAndRead =
function(msg) {
  if (msg && this._importantTag) {
      if (msg.hasTag(this._importantTag.id) && !msg.isUnread) {
          return true;
      }
  }
  return false;
};

ZmMailListPriorityGroup.prototype._isFlagged =
function(msg) {
   if (msg) {
       return msg.isFlagged;
   }
   return false;
};


ZmMailListPriorityGroup.prototype._noMatchingGroup =
function(msg) {
    if (!this._isImportantAndUnread(msg) && !this._isImportantAndRead(msg) &&
        !this._isFlagged(msg)) {
        return true;
    }
    return false;
};

ZmMailListPriorityGroup.prototype._getImportantTag =
function() {
	var tagList = appCtxt.getTagTree();
	if (tagList) {
	   return tagList.getByName("Important");
	}
	return null;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmMailListSizeGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Size group divides messages into the following sections:
 * Enormous > 5MB
 * Huge 1-5MB
 * Very Large 500KB-1MB
 * Large 100KB-500KB
 * Medium 25KB-100KB
 * Small 10KB-25KB
 * Tiny < 10KB
 *
 */
ZmMailListSizeGroup = function(){
    this.id = ZmId.GROUPBY_SIZE;
	this.field = ZmItem.F_SIZE;
    ZmMailListGroup.call(this);
};

ZmMailListSizeGroup.prototype = new ZmMailListGroup;
ZmMailListSizeGroup.prototype.constructor =  ZmMailListSizeGroup;

ZmMailListSizeGroup.ENORMOUS = "ENORMOUS";
ZmMailListSizeGroup.HUGE = "HUGE";
ZmMailListSizeGroup.VERY_LARGE = "VERY_LARGE";
ZmMailListSizeGroup.LARGE = "LARGE";
ZmMailListSizeGroup.MEDIUM = "MEDIUM";
ZmMailListSizeGroup.SMALL = "SMALL";
ZmMailListSizeGroup.TINY = "TINY";

ZmMailListSizeGroup.KILOBYTE = 1024;
ZmMailListSizeGroup.MEGABYTE = 1024 * 1024;

ZmMailListSizeGroup.GROUP = [ZmMailListSizeGroup.ENORMOUS, ZmMailListSizeGroup.HUGE, ZmMailListSizeGroup.VERY_LARGE,
                             ZmMailListSizeGroup.LARGE, ZmMailListSizeGroup.MEDIUM, ZmMailListSizeGroup.SMALL, ZmMailListSizeGroup.TINY];

ZmMailListSizeGroup.SIZE = {};
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.ENORMOUS] = {min: 5 * ZmMailListSizeGroup.MEGABYTE - ZmMailListSizeGroup.MEGABYTE/2}; // > 4.5MB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.HUGE] = {min: (ZmMailListSizeGroup.MEGABYTE) - 512, max: (5 * ZmMailListSizeGroup.MEGABYTE) - ZmMailListSizeGroup.MEGABYTE/2};    //1023.5KB - 4.5MB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.VERY_LARGE] = {min: (500 * ZmMailListSizeGroup.KILOBYTE) - 512, max: ZmMailListSizeGroup.MEGABYTE - 512}; //499.5KB - 1023.5KB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.LARGE] = {min: 100 * ZmMailListSizeGroup.KILOBYTE - 512, max: (500 * ZmMailListSizeGroup.KILOBYTE) - 512};//99.5KB - 499.5KB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.MEDIUM] = {min: 25 * ZmMailListSizeGroup.KILOBYTE -512, max: (100 * ZmMailListSizeGroup.KILOBYTE)- 512};  //24.5KB - 99.5KB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.SMALL] = {min: 10 * ZmMailListSizeGroup.KILOBYTE - 512, max: (25 * ZmMailListSizeGroup.KILOBYTE) - 512}; //9.5KB - 24.5KB
ZmMailListSizeGroup.SIZE[ZmMailListSizeGroup.TINY] = {max: (10 * ZmMailListSizeGroup.KILOBYTE) - 512}; // < 9.5KB

ZmMailListSizeGroup.SECTION_TITLE = {};
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.ENORMOUS] = ZmMsg.mailSizeEnormousTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.HUGE] = ZmMsg.mailSizeHugeTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.VERY_LARGE] = ZmMsg.mailSizeVeryLargeTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.LARGE] = ZmMsg.mailSizeLargeTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.MEDIUM] = ZmMsg.mailSizeMediumTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.SMALL] = ZmMsg.mailSizeSmallTitle;
ZmMailListSizeGroup.SECTION_TITLE[ZmMailListSizeGroup.TINY] =  ZmMsg.mailSizeTinyTitle;

/**
 *  returns HTML string for all sections.
 *  @param {boolean} sortAsc    true/false if sort ascending
 *  @return {String} HTML for all sections including section header
 * @param sortAsc
 */
ZmMailListSizeGroup.prototype.getAllSections =
function(sortAsc) {
    var keys = ZmMailListSizeGroup.GROUP.slice(0); //copy group into keys
    var htmlArr = [];

    if (sortAsc) {
        keys.reverse(); //sort ascending
    }

    for (var i=0; i<keys.length; i++) {
       if (this._section[keys[i]].length > 0) {
            htmlArr.push(this.getSectionHeader(ZmMailListSizeGroup.SECTION_TITLE[keys[i]]));
            htmlArr.push(this._section[keys[i]].join(""));
       }
       else if (this._showEmptySectionHeader) {
            htmlArr.push(this.getSectionHeader(ZmMailListSizeGroup.SECTION_TITLE[keys[i]]));
       }
    }

    return htmlArr.join("");
};

/**
 * Adds item to section
 * @param {ZmMailMsg} msg   mail message
 * @param {String} item  HTML to add to section
 * @return {String} section returns section if successfully added, else returns null
 */
ZmMailListSizeGroup.prototype.addMsgToSection =
function(msg, item){
   for (var i = 0; i<ZmMailListSizeGroup.GROUP.length; i++) {
       if (this.isMsgInSection(ZmMailListSizeGroup.GROUP[i], msg)) {
           this._section[ZmMailListSizeGroup.GROUP[i]].push(item);
           return ZmMailListSizeGroup.GROUP[i];
       }
   }

   return null;
};

/**
 * Determines if message is in group
 * @param {String} section ID of section
 * @param {ZmMailMsg} msg
 * @return {boolean} true/false
 */
ZmMailListSizeGroup.prototype.isMsgInSection =
function(section, msg) {
    var size = msg.size;
    if (!size && msg.type == ZmId.ITEM_CONV) {
        size = msg.sf;
    }
    switch(section) {
        case ZmMailListSizeGroup.ENORMOUS:
            return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.HUGE:
            return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.VERY_LARGE:
            return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.LARGE:
            return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.MEDIUM:
           return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.SMALL:
           return this._isInSizeRange(size, section);

        case ZmMailListSizeGroup.TINY:
            return this._isInSizeRange(size, section);

        default:
            return false;
    }

};

/**
 * Returns the sort by (ZmSearch.SIZE_ASC or ZmSearch.SIZE_DESC)
 * @param {boolean} sortAsc
 * @return {String} sortBy
 */
ZmMailListSizeGroup.prototype.getSortBy =
function(sortAsc) {
    if (sortAsc) {
        return ZmSearch.SIZE_ASC;
    }
    return ZmSearch.SIZE_DESC;
};

//PROTECTED METHODS

ZmMailListSizeGroup.prototype._init =
function() {
    this._section = {};
    this._section[ZmMailListSizeGroup.ENORMOUS] = [];
    this._section[ZmMailListSizeGroup.HUGE] = [];
    this._section[ZmMailListSizeGroup.VERY_LARGE] = [];
    this._section[ZmMailListSizeGroup.LARGE] = [];
    this._section[ZmMailListSizeGroup.MEDIUM] = [];
    this._section[ZmMailListSizeGroup.SMALL] = [];
    this._section[ZmMailListSizeGroup.TINY] = [];
};

ZmMailListSizeGroup.prototype._isInSizeRange =
function(size, section) {
	if (size >= 0 && section) {
		var min = ZmMailListSizeGroup.SIZE[section].min;
		var max = ZmMailListSizeGroup.SIZE[section].max;
		if (min && max) {
			return size >= ZmMailListSizeGroup.SIZE[section].min && size < ZmMailListSizeGroup.SIZE[section].max;
		}
		else if (max) {
			return size < ZmMailListSizeGroup.SIZE[section].max;
		}
		else if (min) {
			return size >= ZmMailListSizeGroup.SIZE[section].min;
		}
	}
	return false;
};

ZmMailListSizeGroup.prototype._getSectionHeaderTitle =
function(section) {
   if (ZmMailListSizeGroup.SECTION_TITLE[section]) {
       return ZmMailListSizeGroup.SECTION_TITLE[section];
   }

   return "";
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmPopAccount")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an POP account.
 * @class
 * This class represents an POP account.
 * 
 * @param	{String}	id		the id
 * 
 * @extends		ZmDataSource
 */ZmPopAccount = function(id) {
	ZmDataSource.call(this, ZmAccount.TYPE_POP, id);
};

ZmPopAccount.prototype = new ZmDataSource;
ZmPopAccount.prototype.constructor = ZmPopAccount;

// Constants
/**
 * Defines the "cleartext" port.
 * 
 * @type	int
 */
ZmPopAccount.PORT_CLEAR 	= 110;
/**
 * Defines the "ssl" port.
 * 
 * @type	int
 */
ZmPopAccount.PORT_SSL 		= 995;
ZmPopAccount.PORT_DEFAULT	= ZmPopAccount.PORT_CLEAR;


// advanced settings
ZmPopAccount.prototype.ELEMENT_NAME = "pop3";
ZmPopAccount.prototype.port = ZmPopAccount.PORT_DEFAULT;


// Public methods

ZmPopAccount.prototype.toString =
function() {
	return "ZmPopAccount";
};

/**
 * Gets the default port.
 * 
 * @return	{int}		the port
 */
ZmPopAccount.prototype.getDefaultPort =
function() {
	return (this.connectionType == ZmDataSource.CONNECT_SSL)
		? ZmPopAccount.PORT_SSL : ZmPopAccount.PORT_DEFAULT;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmImapAccount")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an IMAP account.
 * @class
 * This class represents an IMAP account.
 * 
 * @param	{String}	id		the id
 * 
 * @extends		ZmDataSource
 */
ZmImapAccount = function(id) {
	ZmDataSource.call(this, ZmAccount.TYPE_IMAP, id);
};

ZmImapAccount.prototype = new ZmDataSource;
ZmImapAccount.prototype.constructor = ZmImapAccount;


// Constants
/**
 * Defines the "cleartext" port.
 * 
 * @type	int
 */
ZmImapAccount.PORT_CLEAR	= 143;
/**
 * Defines the "ssl" port.
 * 
 * @type	int
 */
ZmImapAccount.PORT_SSL		= 993;
ZmImapAccount.PORT_DEFAULT	= ZmImapAccount.PORT_CLEAR;


// advanced settings
ZmImapAccount.prototype.ELEMENT_NAME = "imap";
ZmImapAccount.prototype.port = ZmImapAccount.PORT_DEFAULT;


// Public methods

ZmImapAccount.prototype.toString =
function() {
	return "ZmImapAccount";
};

/**
 * Gets the default port.
 * 
 * @return	{int}		the port
 */
ZmImapAccount.prototype.getDefaultPort =
function() {
	return (this.connectionType == ZmDataSource.CONNECT_SSL)
		? ZmImapAccount.PORT_SSL : ZmImapAccount.PORT_DEFAULT;
};

/**
 * Comparison function for *IMAP* folders. Since IMAP folderId's are *not* well-
 * known, we have to compare their names instead of their ID's.
 * 
 * @param	{ZmFolder}	folderA
 * @param	{ZmFolder}	folderB
 * @return	{int}	0 if the folders are the same; 1 if "a" is before "b"; -1 if "b" is before "a"
 */
ZmImapAccount.sortCompare =
function(folderA, folderB) {
	var check = ZmOrganizer.checkSortArgs(folderA, folderB);
	if (check != null) { return check; }

	var aId = ZmFolder.getIdForName(folderA.name);
	var bId = ZmFolder.getIdForName(folderB.name);

	if (ZmFolder.SORT_ORDER[aId] && ZmFolder.SORT_ORDER[bId]) {
		return (ZmFolder.SORT_ORDER[aId] - ZmFolder.SORT_ORDER[bId]);
	}
	if (!ZmFolder.SORT_ORDER[aId] && ZmFolder.SORT_ORDER[bId]) { return 1; }
	if (ZmFolder.SORT_ORDER[aId] && !ZmFolder.SORT_ORDER[bId]) { return -1; }
	if (folderA.name.toLowerCase() > folderB.name.toLowerCase()) { return 1; }
	if (folderA.name.toLowerCase() < folderB.name.toLowerCase()) { return -1; }
	return 0;
};

}
if (AjxPackage.define("zimbraMail.mail.model.ZmSignature")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a signature.
 * @class
 * This class represents a signature.
 * 
 * 
 */
ZmSignature = function(id) {
	this.id = id;
};

ZmSignature.prototype.toString = function() {
	return "ZmSignature";
};

//
// Data
//
/**
 * The name property.
 * @type	String
 */
ZmSignature.prototype.name = "";
/**
 * The content type property.
 * @type	String
 * @see		ZmMimeTable
 */
ZmSignature.prototype.contentType = ZmMimeTable.TEXT_PLAIN;
/**
 * The value property.
 * @type	String
 */
ZmSignature.prototype.value = "";

//
// Static functions
//

ZmSignature.createFromJson =
function(object) {
	var signature = new ZmSignature(object.id);
	signature.setFromJson(object);
	return signature;
};

//
// Public methods
//
/**
 * Creates the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.create =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleCreateResponse, [callback]) : null;
	var resp = this._sendRequest("CreateSignatureRequest", false, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleCreateResponse(callback, resp);
	}
};

/**
 * Saves the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.save =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleModifyResponse, [callback]) : null;
	var resp = this._sendRequest("ModifySignatureRequest", false, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleModifyResponse(callback, resp);
	}
};

/**
 * Deletes the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.doDelete =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleDeleteResponse, [callback]) : null;
	var resp = this._sendRequest("DeleteSignatureRequest", true, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleDeleteResponse(callback, resp);
	}
};

/**
 * Sets the signature from JSON object.
 * 
 * @param	{Object}	object		the object
 */
ZmSignature.prototype.setFromJson =
function(object) {

	this.name = object.name || this.name;
	var c = object.content;
    if (c) {
		var sig = c[0]._content ? c[0] : c[1];
		this.contentType = sig.type || this.contentType;
		this.value = sig._content || this.value;
    }
	if (object.cid) {
		this.contactId = object.cid[0]._content;
	}
};

/**
 * Gets the content type.
 * 
 * @return	{String}	the content type
 */
ZmSignature.prototype.getContentType =
function() {
    return this.contentType;
};

/**
 * Sets the content type.
 * 
 * @param	{String}	ct		the content type
 * @see		ZmMimeTable
 */
ZmSignature.prototype.setContentType =
function(ct){
    this.contentType = ct || ZmMimeTable.TEXT_PLAIN;  
};

/**
 * @param outputType	[string]	(Optional) Formats the resulting
 *									signature text to the specified
 *									content-type. If not specified,
 *									the signature text is returned in
 *									the original format.
 *
 * @private
 */
ZmSignature.prototype.getValue =
function(outputType) {
	
    var isHtml = this.contentType == ZmMimeTable.TEXT_HTML;
	var value = this.value;

	var type = outputType || this.contentType;
	if (type != this.contentType) {
        value = isHtml ? AjxStringUtil.convertHtml2Text(value) : AjxStringUtil.convertToHtml(value);
	}

	if (appCtxt.isWebClientOffline()) {
		value = ZmOffline.modifySignature(value);
	}

    return value;
};


//
// Protected methods
//

ZmSignature.prototype._sendRequest =
function(method, idOnly, respCallback, errorCallback, batchCmd) {

/*
	var jsonObj = {};
	var request = jsonObj[method] = {_jsns:"urn:zimbraAccount"};
	var sig = request.signature = {};
	if (this.id) {
		sig.id = this.id;
	}
	if (!idOnly) {
		sig.name = this.name;
		sig.cid = this.contactId || null;
		sig.content = [];
		sig.content.push({_content:this.value, type:this.contentType});

        // Empty the other content type
        var emptyType = (this.contentType == ZmMimeTable.TEXT_HTML) ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML;
		sig.content.push({_content:"", type:emptyType});
	}
*/

	var soapDoc = AjxSoapDoc.create(method, "urn:zimbraAccount");
	var signatureEl = soapDoc.set("signature");
	if (this.id) {
		signatureEl.setAttribute("id", this.id);
	}
	if (!idOnly) {
		signatureEl.setAttribute("name", this.name);
		if (this.contactId || (method == "ModifySignatureRequest")) {
			soapDoc.set("cid", this.contactId || null, signatureEl);
		}
		var contentEl = soapDoc.set("content", this.value, signatureEl);
		contentEl.setAttribute("type", this.contentType);

        //Empty the other content type
        var emptyType = (this.contentType == ZmMimeTable.TEXT_HTML) ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML;
        contentEl = soapDoc.set("content", "", signatureEl);
		contentEl.setAttribute("type", emptyType);

	}

	if (batchCmd) {
		batchCmd.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var appController = appCtxt.getAppController();
	var params = {
		soapDoc:		soapDoc,
		asyncMode:		Boolean(respCallback),
		callback:		respCallback,
		errorCallback:	errorCallback
	}
	return appController.sendRequest(params);
};

ZmSignature.prototype._handleCreateResponse =
function(callback, resp) {
	// save id
	this.id = resp._data.CreateSignatureResponse.signature[0].id;

	// add to global hash
	var signatures = appCtxt.getSignatureCollection();
	signatures.add(this);

	if (callback) {
		callback.run();
	}
};

ZmSignature.prototype._handleModifyResponse = function(callback, resp) {
	// promote settings to global signature
	var signatures = appCtxt.getSignatureCollection();
	var signature = signatures.getById(this.id);
	signature.name = this.name;
	signature.value = this.value;
    signature.contentType = this.contentType;
	signatures._notify(ZmEvent.E_MODIFY, { item: signature });

	if (callback) {
		callback.run();
	}
};

ZmSignature.prototype._handleDeleteResponse = function(callback, resp) {
	// remove from global hash
	var signatures = appCtxt.getSignatureCollection();
	signatures.remove(this);

	if (callback) {
		callback.run();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmSignatureCollection")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a signature collection.
 * @class
 * This class represents a signature collection.
 * 
 * @extends		ZmModel
 */
ZmSignatureCollection = function() {
	ZmModel.call(this, ZmEvent.S_SIGNATURE);
	this._idMap = {};
	this._nameMap= {};
	this._size = 0;
};

ZmSignatureCollection.prototype = new ZmModel;
ZmSignatureCollection.prototype.constructor = ZmSignatureCollection;

ZmSignatureCollection.prototype.toString =
function() {
	return "ZmSignatureCollection";
};

//
// Public methods
//
/**
 * Adds the signature.
 * 
 * @param	{ZmSignature}	signature		the signature to add
 */
ZmSignatureCollection.prototype.add =
function(signature) {
	if (!this._idMap[signature.id]) {
		this._idMap[signature.id] = signature;
		this._nameMap[signature.name] = signature;
		this._size++;
		this._notify(ZmEvent.E_CREATE, { item: signature });
	}
};

/**
 * Removes the signature.
 * 
 * @param	{ZmSignature}	signature		the signature to remove
 */
ZmSignatureCollection.prototype.remove =
function(signature) {
	if (this._idMap[signature.id]) {
		delete this._idMap[signature.id];
		delete this._nameMap[signature.name];
		this._size--;
		this._notify(ZmEvent.E_DELETE, { item: signature });
	}
};

/**
 * Gets the count of signatures.
 * 
 * @return	{int}		the size
 */
ZmSignatureCollection.prototype.getSize =
function() {
	return this._size;
};

/**
 * Gets the signatures.
 * 
 * @return	{Array}	an array of {@link ZmSignature} objects
 */
ZmSignatureCollection.prototype.getSignatures =
function(sort) {

	var signatures = AjxUtil.values(this._idMap);
	if (sort) {
		signatures.sort(ZmSignatureCollection.BY_NAME);
	}
	return signatures;
};

ZmSignatureCollection.prototype.getSignatureOptions =
function() {
	// collect signatures
	var signatures = [];
	for (var id in this._idMap) {
		signatures.push(this._idMap[id]);
	}
	signatures.sort(ZmSignatureCollection.BY_NAME);

	// create options
	var options = [];
	//In Web Client offline mode signature having vCard will be suppressed
	var isWebClientOffline = appCtxt.isWebClientOffline();
	for (var i = 0; i < signatures.length; i++) {
		var signature = signatures[i];
		if (isWebClientOffline && signature.contactId) {
			continue;
		}
		options.push(new DwtSelectOptionData(signature.id, signature.name));
	}
	options.push(new DwtSelectOptionData("", ZmMsg.signatureDoNotAttach));
	return options;
};

/**
 * Gets the signature by id.
 * 
 * @param	{String}	id		the signature
 * @return	{ZmSignature} the signature
 */
ZmSignatureCollection.prototype.getById =
function(id) {
	return this._idMap[id];
};

/**
 * Gets the signature by name.
 * 
 * @param	{String}	name		the signature
 * @return	{ZmSignature} the signature
 */
ZmSignatureCollection.prototype.getByName =
function(name) {
	var lname = name.toLowerCase();
	for (var key in this._nameMap) {
		if (key.toLowerCase() == lname) {
			return this._nameMap[key];
		}
	}
};

ZmSignatureCollection.prototype.initialize =
function(data) {
	if (this._size) return;

	var signatures = data.signature;
	if (!signatures) return;

	for (var i = 0; i < signatures.length; i++) {
		var signature = ZmSignature.createFromJson(signatures[i]);
		this.add(signature);
	}
};

//
// Static functions
//

ZmSignatureCollection.BY_NAME =
function(a, b) {
	return a.name.localeCompare(b.name);
};
}
}
if (AjxPackage.define("mail.Message")) {
AjxTemplate.register("mail.Message#MessageHeader", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div><!-- empty container DIV here so Dwt.parseHtmlFragment returns the infoBar div below --><table role=\"presentation\" class='MsgHeaderTable' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_headerElement' width=100%><tr><td class='MsgHeaderContactContainer'><img class='MsgHeaderContactImage' src=\"";
	buffer[_i++] = data["imageURL"];
	buffer[_i++] = "\" alt=\"";
	buffer[_i++] = data["imageAltText"];
	buffer[_i++] = "\" onerror=\"this.style.visibility='hidden'\"/></td><td><div><table role=\"presentation\" width=100%><tr id='";
	buffer[_i++] = data["hdrTableTopRowId"];
	buffer[_i++] = "'>";
	 if (data.isSyncFailureMsg) { 
	buffer[_i++] = "<td>&nbsp;</td><td id='";
	buffer[_i++] = data["reportBtnCellId"];
	buffer[_i++] = "'></td><td>&nbsp;</td>";
	 } 
	buffer[_i++] = "<td>&nbsp;</td>";
	 if (data.priorityImg) { 
	buffer[_i++] = "<td><div priority='";
	buffer[_i++] = data.priority;
	buffer[_i++] = "' id='";
	buffer[_i++] = data.priorityDivId;
	buffer[_i++] = "' style='margin-left:4px;' class='";
	buffer[_i++] = data.priorityImg;
	buffer[_i++] = "'></div></td>";
	 } 
	buffer[_i++] = "<td class='LabelColValue SubjectCol' valign=top width=100%>";
	buffer[_i++] =  data.subject ;
	buffer[_i++] = "</td><td class='LabelColValue DateCol' align=right title='";
	buffer[_i++] = data["dateTooltip"];
	buffer[_i++] = "'>";
	buffer[_i++] = data["dateString"];
	buffer[_i++] = "</td><td>&nbsp;</td></tr></table><table id='";
	buffer[_i++] = data["hdrTableId"];
	buffer[_i++] = "' role=\"presentation\" class='ZPropertySheet' cellspacing='6' style='margin:0 7px;'><tr id='";
	buffer[_i++] = data["expandRowId"];
	buffer[_i++] = "'><td><table role=\"presentation\" align=right><tr><td class='LabelColName' style='padding-left:7px;'>";
	buffer[_i++] =  ZmMsg.fromLabel ;
	buffer[_i++] = "</td></tr></table></td><td valign=top colspan=10><table role=\"presentation\"><tr id=\"OBJ_PREFIX_";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] = "_from\"><td id=\"OBJ_PREFIX_";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] = "_from\" class='LabelColValue' style='white-space:nowrap'>";
	buffer[_i++] =  AjxTemplate.expand("#SentBy", data) ;
	buffer[_i++] = "</td></tr></table></td></tr>";
	 for (var i = 0; i < data.addressTypes.length; i++) { 
										var participants = data.participants[data.addressTypes[i]]; 
	buffer[_i++] = "<tr id='OBJ_PREFIX_";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] = "_";
	buffer[_i++] = participants.prefix.toLowerCase();
	buffer[_i++] = "'><td class='LabelColName'>";
	buffer[_i++] =  participants.prefix ? AjxMessageFormat.format(ZmMsg.makeLabel, participants.prefix) : "&nbsp;" ;
	buffer[_i++] = "</td><td class='LabelColValue' colspan='10'>";
	buffer[_i++] =  participants.partStr ;
	buffer[_i++] = "</td></tr>";
	 } 
	buffer[_i++] =  AjxTemplate.expand("#AutoSend", data) ;
	buffer[_i++] =  AjxTemplate.expand("#AddedHeaders", data) ;
	buffer[_i++] = "</table>";
	 if (data.hasAttachments) { 
	buffer[_i++] = "<div class=\"MessageHeaderAttachments\" id=\"";
	buffer[_i++] = data["attachId"];
	buffer[_i++] = "_container\"><div id=\"";
	buffer[_i++] = data["attachId"];
	buffer[_i++] = "\" style='overflow:auto;'></div></div>";
	 } 
	buffer[_i++] = "</div>";
	 if (data.isOutDated) { 
	buffer[_i++] =  AjxTemplate.expand("#InviteNotCurrent", data) ;
	 } 
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_contactArea' class='ContactArea'><!-- Area reserved zimlets to add to message views. --></td></tr></table><div id='";
	buffer[_i++] = data["infoBarId"];
	buffer[_i++] = "'></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#MessageHeader"
}, false);
AjxTemplate.register("mail.Message", AjxTemplate.getTemplate("mail.Message#MessageHeader"), AjxTemplate.getParams("mail.Message#MessageHeader"));

AjxTemplate.register("mail.Message#SentBy", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<span>";
	buffer[_i++] = data["sentBy"];
	buffer[_i++] = "</span>";
	
			var useObo = data.obo && (data.oboAddr != data.sentByAddr);
			var useBwo = data.bwo && (data.bwoAddr != data.sentByAddr);
			if (useObo) {
				
	buffer[_i++] = "<span style='margin:0 .5em;'>";
	buffer[_i++] =  ZmMsg.onBehalfOfMidLabel ;
	buffer[_i++] = "</span><span id=\"";
	buffer[_i++] = data["oboId"];
	buffer[_i++] = "\">";
	buffer[_i++] =  data.obo ;
	buffer[_i++] = "</span>";
	
			}
			if (useBwo) {
				
	buffer[_i++] = "<span style='margin:0 .5em;'>";
	buffer[_i++] =  ZmMsg.byWayOfMidLabel ;
	buffer[_i++] = "</span><span id=\"";
	buffer[_i++] = data["bwoId"];
	buffer[_i++] = "\">";
	buffer[_i++] =  data.bwo ;
	buffer[_i++] = "</span>";
	
			}
		

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#SentBy"
}, false);

AjxTemplate.register("mail.Message#InviteNotCurrent", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class=\"InviteOutDated\"><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td>";
	buffer[_i++] =  AjxImg.getImageHtml("Warning") ;
	buffer[_i++] = "</td><td>";
	buffer[_i++] =  ZmMsg.inviteNotCurrent ;
	buffer[_i++] = "</td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#InviteNotCurrent"
}, false);

AjxTemplate.register("mail.Message#MailAttachmentBubble", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "\" class=\"AttachmentLoading attachmentBubble AttachmentSpan\" name=\"mailAttUploadingSpan\" style=\"max-width:235px; position:static; overflow:visible;padding:0 2px 4px\"><span class=\"AttProgressSpan1\">";
	buffer[_i++] = data["fileName"];
	buffer[_i++] = "</span><span class=\"AttProgressSpan2\">";
	buffer[_i++] = data["fileName"];
	buffer[_i++] = "</span><span onclick=\"window.appCtxt.getCurrentView()._abortUploadFile()\" class=\"ImgBubbleDelete AttachmentClose\"></span></span>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#MailAttachmentBubble"
}, false);

AjxTemplate.register("mail.Message#AutoSend", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 if (data.autoSendTime) { 
	buffer[_i++] = "<tr id='OBJ_PREFIX_";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] = "_scheduled'><td valign='top' class='LabelColName'>";
	buffer[_i++] =  ZmMsg.messageScheduledSendLabel ;
	buffer[_i++] = "</td><td class='LabelColValue' colspan=10>";
	buffer[_i++] =  data.autoSendTime ;
	buffer[_i++] = "</td></tr>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#AutoSend"
}, false);

AjxTemplate.register("mail.Message#AddedHeaders", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 for (var i = 0; i < data.additionalHdrs.length; i++) { 
	buffer[_i++] = "<tr><td valign='top' class='LabelColName'>";
	buffer[_i++] =  data.additionalHdrs[i].hdrName ;
	buffer[_i++] = "</td><td class='LabelColValue' colspan='10'>";
	buffer[_i++] =  data.additionalHdrs[i].hdrVal ;
	buffer[_i++] = "</td></tr>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#AddedHeaders"
}, false);

AjxTemplate.register("mail.Message#InviteHeader", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div><!-- empty container DIV here so Dwt.parseHtmlFragment returns the infoBar div below --><table role=\"presentation\" class='InvHeaderTable' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_headerElement'><tr>";
	 if (!data.noTopHeader) { 
	buffer[_i++] = "<td class='InvHeaderContactContainer'><img class='InvHeaderContactImage' src=\"";
	buffer[_i++] = data["imageURL"];
	buffer[_i++] = "\" onerror=\"this.style.visibility='hidden'\"/></td>";
	 } 
	buffer[_i++] = "<td><div class='InvHeaderDiv'>";
	 if (!data.noTopHeader) { 
	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr id='";
	buffer[_i++] = data["hdrTableTopRowId"];
	buffer[_i++] = "'>";
	 if (data.closeBtnCellId) { 
	buffer[_i++] = "<td id='";
	buffer[_i++] = data["closeBtnCellId"];
	buffer[_i++] = "'></td>";
	 } 
	buffer[_i++] = "<td class='LabelColValue SubjectCol ";
	buffer[_i++] = data["subjChangeClass"];
	buffer[_i++] = "' valign=top width=100%>";
	buffer[_i++] =  data.subject ;
	buffer[_i++] = "</td><td class='LabelColValue DateCol' align=right title='";
	buffer[_i++] = data["dateTooltip"];
	buffer[_i++] = "'>";
	buffer[_i++] = data["dateString"];
	buffer[_i++] = "</td></tr></table>";
	 } 
	buffer[_i++] = "<table role=\"presentation\" id='";
	buffer[_i++] = data["hdrTableId"];
	buffer[_i++] = "' width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (data.counterInvMsg) { 
	buffer[_i++] = "<tr><td class='LabelColValue' colspan=2><div class='InvCounter'><table role=\"presentation\" width='100%' class='ZPropertySheet' cellspacing='6'><tr><td width=20>";
	buffer[_i++] =  AjxImg.getImageHtml("Information") ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.counterInvMsg ;
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["hdrTableId"];
	buffer[_i++] = "_counterToolbar' width=\"1\"></td></tr></table></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='LabelColName ";
	buffer[_i++] = data["timeChangeClass"];
	buffer[_i++] = "'>";
	buffer[_i++] =  data.counterInvMsg ? ZmMsg.proposedTimeLabel : ZmMsg.timeLabel ;
	buffer[_i++] = "</td><td class='LabelColValue ";
	buffer[_i++] = data["timeChangeClass"];
	buffer[_i++] = "'>";
	buffer[_i++] =  data.invDate ;
	buffer[_i++] = "<br />";
	buffer[_i++] =  data.timezone ;
	buffer[_i++] = "</td></tr>";
	 if (data.invite.getLocation()) { 
	buffer[_i++] = "<tr><td class='LabelColName ";
	buffer[_i++] = data["locChangeClass"];
	buffer[_i++] = "'>";
	buffer[_i++] =  ZmMsg.locationLabel ;
	buffer[_i++] = "</td><td class='LabelColValue ";
	buffer[_i++] = data["locChangeClass"];
	buffer[_i++] = "'>";
	buffer[_i++] =  AjxStringUtil.htmlEncode(data.invite.getLocation()) ;
	buffer[_i++] = "</td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.organizerLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.invOrganizer ;
	buffer[_i++] = "</td></tr>";
	 if (data.invSentBy) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.sentByLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.invSentBy ;
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.obo && (AjxStringUtil.stripTags(data.obo) != AjxStringUtil.stripTags(data.invSentBy))) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.onBehalfOfLabel ;
	buffer[_i++] = " </td><td class='LabelColValue'>";
	buffer[_i++] =  data.obo ;
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.bwo) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.byWayOfLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.bwo ;
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.ptstId) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.inviteesLabel ;
	buffer[_i++] = "</td><td class='LabelColValue' id='";
	buffer[_i++] = data["ptstId"];
	buffer[_i++] = "'></td></tr>";
	 } else if (data.invite.hasOtherIndividualAttendees()) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.inviteesLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.invitees ;
	buffer[_i++] = "</td></tr>";
	 if (data.optInvitees) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.optionalLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.optInvitees ;
	buffer[_i++] = "</td></tr>";
	 } 
	 } 
	 if (data.recur) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.repeats ;
	buffer[_i++] = ":</td><td class='LabelColValue'>";
	buffer[_i++] =  data.recur ;
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.toolbarCellId) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.respondLabel ;
	buffer[_i++] = "</td><td class='LabelColValue' id='";
	buffer[_i++] = data["toolbarCellId"];
	buffer[_i++] = "'></td></tr>";
	 } 
	 if (data.calendarSelectCellId) { 
	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.calendarLabel ;
	buffer[_i++] = "</td><td class='LabelColValue' style='padding-left:2px;' id='";
	buffer[_i++] = data["calendarSelectCellId"];
	buffer[_i++] = "'></td></tr>";
	 } 
	buffer[_i++] = "</table>";
	 if (data.hasAttachments) { 
	buffer[_i++] = "<div class=\"MessageHeaderAttachments\" id=\"";
	buffer[_i++] = data["attachId"];
	buffer[_i++] = "_container\"><div id=\"";
	buffer[_i++] = data["attachId"];
	buffer[_i++] = "\" style='overflow:auto;'></div></div>";
	 } 
	buffer[_i++] = "</div>";
	 if (data.intendedForMsg) { 
	buffer[_i++] = "<div class=\"";
	buffer[_i++] = data["intendedForClassName"];
	buffer[_i++] = "\"><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td>";
	buffer[_i++] =  AjxImg.getImageHtml("Information") ;
	buffer[_i++] = "</td><td>";
	buffer[_i++] = data["intendedForMsg"];
	buffer[_i++] = "</td></tr></table></div>";
	 } 
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_contactArea' class='ContactArea'><!-- Area reserved zimlets to add to message views. --></td></tr></table><div id='";
	buffer[_i++] = data["ptstMsgBannerId"];
	buffer[_i++] = "' class='";
	buffer[_i++] = data["ptstClassName"];
	buffer[_i++] = "' ";
	 if (!data.ptstMsg) { 
	buffer[_i++] = " style='display:none;' ";
	 } 
	buffer[_i++] = " ><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id=\"";
	buffer[_i++] = data["ptstMsgIconId"];
	buffer[_i++] = "\">";
	buffer[_i++] =  AjxImg.getImageHtml(data.ptstIcon) ;
	buffer[_i++] = "</td><td id=\"";
	buffer[_i++] = data["ptstMsgId"];
	buffer[_i++] = "\">";
	buffer[_i++] = data["ptstMsg"];
	buffer[_i++] = "</td></tr></table></div><div id='";
	buffer[_i++] = data["infoBarId"];
	buffer[_i++] = "'></div></div><div class='separator'></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#InviteHeader"
}, false);

AjxTemplate.register("mail.Message#InviteHeaderPtst", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td>";
	buffer[_i++] =  AjxImg.getImageHtml(data.icon) ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] = data["attendee"];
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#InviteHeaderPtst"
}, false);

AjxTemplate.register("mail.Message#AttachmentsView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%' height='100%'><tr><td width='20%'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_filters'></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_results'>Loading...</div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#AttachmentsView"
}, false);

AjxTemplate.register("mail.Message#MessageListHeader", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='SubjectBar' width=100%><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_closeBtnCell' width='1%' style='padding-right:10px;'></td><td width='1%'>";
	buffer[_i++] =  AjxImg.getImageHtml("ConversationView") ;
	buffer[_i++] = "</td><td><div class='Subject' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_subjDiv'></div></td></tr>";
	 if (data.tagDivId) { 
	buffer[_i++] = "<tr><td colspan=4><div class='Tags' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tagDiv'></div></td></tr>";
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#MessageListHeader"
}, false);

AjxTemplate.register("mail.Message#InformationBar", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "' class='DisplayImages'><table role=\"presentation\" width='100%'><tr><td width='1%' style='padding:0 1em;'>";
	buffer[_i++] =  AjxImg.getImageHtml("Warning") ;
	buffer[_i++] = "</td><td>";
	buffer[_i++] = data["text"];
	buffer[_i++] = " <span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_link' class='FakeAnchor'>";
	buffer[_i++] = data["link"];
	buffer[_i++] = "</span></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#InformationBar"
}, false);

AjxTemplate.register("mail.Message#ExtImageInformationBar", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "' class='DisplayImages'><table role=\"presentation\" width='100%'><tr><td width='1%' style='padding:0 1em;'>";
	buffer[_i++] =  AjxImg.getImageHtml("Warning") ;
	buffer[_i++] = "</td><td><div><span>";
	buffer[_i++] = data["text"];
	buffer[_i++] = "</span>&nbsp; \n";
	buffer[_i++] = "\t\t\t\t<a href=\"javascript:void(0);\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dispImgs'>";
	buffer[_i++] = data["link"];
	buffer[_i++] = "</a></div>";
	 if (data.domain || data.email){ 
	buffer[_i++] = "<div><span>";
	buffer[_i++] = data["alwaysText"];
	buffer[_i++] = "</span>&nbsp; \n";
	buffer[_i++] = "\t\t\t\t<a href=\"javascript:void(0);\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_domain'>";
	buffer[_i++] = data["domain"];
	buffer[_i++] = "</a> \n";
	buffer[_i++] = "\t\t\t\t";
	buffer[_i++] = data["or"];
	buffer[_i++] = " \n";
	buffer[_i++] = "\t\t\t\t<a href=\"javascript:void(0);\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_email'>";
	buffer[_i++] = data["email"];
	buffer[_i++] = "</a></div>";
	}
	buffer[_i++] = "</td><td width='1%' style='padding:0 1em;'><div class=\"ImgClose\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_close'></div></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#ExtImageInformationBar"
}, false);

AjxTemplate.register("mail.Message#AllAttachments", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" style='margin:5px 0 1px'>";
	 if (data.viewAllUrl && !appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED)) { 
	buffer[_i++] = "<tr><td width='1%' style='padding-right:3px;'>";
	buffer[_i++] =  AjxImg.getImageHtml("ViewAll", "position:relative;") ;
	buffer[_i++] = "</td><td style='white-space:nowrap;'><a style='text-decoration:underline' class='AttLink' href='";
	buffer[_i++] = data["viewAllUrl"];
	buffer[_i++] = "' target=\"_blank\">";
	buffer[_i++] =  ZmMsg.viewAllImages ;
	buffer[_i++] = "</a></td></tr>";
	}
	 if (!appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED) && !appCtxt.get(ZmSetting.ATTACHMENTS_VIEW_IN_HTML_ONLY)) { 
	buffer[_i++] = "<tr><td width='1%' style='padding-right:3px;'>";
	buffer[_i++] =  AjxImg.getImageHtml(ZmMimeTable.getInfo(ZmMimeTable.APP_ZIP).image, "position:relative;") ;
	buffer[_i++] = "</td><td style='white-space:nowrap;'><a style='text-decoration:underline' class='AttLink' id='";
	buffer[_i++] = data["downloadAllLinkId"];
	buffer[_i++] = "' href='";
	buffer[_i++] = data["url"];
	buffer[_i++] = "&disp=a&fmt=zip'>";
	buffer[_i++] =  ZmMsg.downloadAll ;
	buffer[_i++] = "</a></td></tr>";
	 } 
	 if (!appCtxt.isExternalAccount()) { 
	buffer[_i++] = "<tr><td width='1%' style='padding-right:3px;'>";
	buffer[_i++] =  AjxImg.getImageHtml("AttachmentRemove", "position:relative;") ;
	buffer[_i++] = "</td><td style='white-space:nowrap;'><a style='text-decoration:underline' class='AttLink' id='";
	buffer[_i++] = data["removeAllLinkId"];
	buffer[_i++] = "' href=\"javascript:;\">";
	buffer[_i++] =  ZmMsg.removeAllAttachments ;
	buffer[_i++] = "</a></td></tr>";
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#AllAttachments"
}, false);

AjxTemplate.register("mail.Message#To_Recipient", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr id='";
	buffer[_i++] = data["toRowId"];
	buffer[_i++] = "'><td width='1%' align=right valign=top style='";
	buffer[_i++] = data["labelStyle"];
	buffer[_i++] = "'><div id='";
	buffer[_i++] = data["toPickerId"];
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.toLabel;
	buffer[_i++] = "</div></td><td id='";
	buffer[_i++] = data["toCellId"];
	buffer[_i++] = "'></td><td width='1%'></td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#To_Recipient"
}, false);

AjxTemplate.register("mail.Message#CC_Recipient", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr id='";
	buffer[_i++] = data["ccRowId"];
	buffer[_i++] = "' style='display:none;'><td width='1%' align=right valign=top style='";
	buffer[_i++] = data["labelStyle"];
	buffer[_i++] = "'><div id='";
	buffer[_i++] = data["ccPickerId"];
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.ccLabel;
	buffer[_i++] = "</div></td><td id='";
	buffer[_i++] = data["ccCellId"];
	buffer[_i++] = "'></td><td width='1%'></td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#CC_Recipient"
}, false);

AjxTemplate.register("mail.Message#BCC_Recipient", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr id='";
	buffer[_i++] = data["bccRowId"];
	buffer[_i++] = "' style='display:none;'><td width='1%' align=right valign=top style='";
	buffer[_i++] = data["labelStyle"];
	buffer[_i++] = "'><div id='";
	buffer[_i++] = data["bccPickerId"];
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.bccLabel;
	buffer[_i++] = "</div></td><td id='";
	buffer[_i++] = data["bccCellId"];
	buffer[_i++] = "'></td><td width='1%'></td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#BCC_Recipient"
}, false);

AjxTemplate.register("mail.Message#Compose", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 var labelStyle = data.labelStyle = "width:"+(AjxEnv.isIE ? 60 : 64)+"px; overflow:visible; white-space:nowrap"; 
	 var inputStyle = data.inputStyle = AjxEnv.isSafari && !AjxEnv.isSafariNightly ? "height:52px;" : "height:21px; overflow:hidden" 
	buffer[_i++] = "<!-- header --><table id='";
	buffer[_i++] = data["headerId"];
	buffer[_i++] = "' role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (appCtxt.multiAccounts) { 
	buffer[_i++] = "<tr><td width='1%' align=right valign=top style='";
	buffer[_i++] = labelStyle;
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.fromLabel;
	buffer[_i++] = "</td><td><div id='";
	buffer[_i++] = data["fromSelectId"];
	buffer[_i++] = "'></div></td><td width='1%'></td></tr>";
	 } else {
	buffer[_i++] = "<tr id='";
	buffer[_i++] = data["identityRowId"];
	buffer[_i++] = "' style='display:none;'><td width='1%' align=right style='";
	buffer[_i++] = labelStyle;
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.fromLabel;
	buffer[_i++] = "</td><td><div id='";
	buffer[_i++] = data["identitySelectId"];
	buffer[_i++] = "'></div></td><td width='1%'></td></tr>";
	 } 
	buffer[_i++] =  AjxTemplate.expand("#To_Recipient", data) ;
	buffer[_i++] =  AjxTemplate.expand("#CC_Recipient", data) ;
	buffer[_i++] =  AjxTemplate.expand("#BCC_Recipient", data) ;
	buffer[_i++] = "<tr id='";
	buffer[_i++] = data["subjectRowId"];
	buffer[_i++] = "'><td width='1%' align=right style='";
	buffer[_i++] = labelStyle;
	buffer[_i++] = "'>";
	buffer[_i++] = ZmMsg.subjectLabel;
	buffer[_i++] = "</td><td><table role=\"presentation\" width='100%'><tr><td style='padding-right:4px;'><input type='text' id='";
	buffer[_i++] = data["subjectInputId"];
	buffer[_i++] = "' class='subjectField' autocomplete=off aria-label='";
	buffer[_i++] = ZmMsg.subject;
	buffer[_i++] = "'></td></tr></table></td><td nowrap width='1%'></td></tr><tr id='";
	buffer[_i++] = data["attRowId"];
	buffer[_i++] = "'><td width='1%' style='vertical-align:top; ";
	buffer[_i++] = labelStyle;
	buffer[_i++] = "'><table role=\"presentation\" width='100%'><tr><td align=right id='";
	buffer[_i++] = data["attBtnId"];
	buffer[_i++] = "'></td></tr></table></td><td><div id='";
	buffer[_i++] = data["attDivId"];
	buffer[_i++] = "'></div></td><td width='1%'></td></tr><tr id='";
	buffer[_i++] = data["replyAttRowId"];
	buffer[_i++] = "' style='display:none;'><td></td><td colspan=\"2\"><a class='FakeAnchor' onclick=\"window.appCtxt.getCurrentView()._addReplyAttachments()\">";
	buffer[_i++] = ZmMsg.replyAttach;
	buffer[_i++] = "</a></td></tr></table><!-- compose editor is automatically appended below the header -->";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Compose"
}, false);

AjxTemplate.register("mail.Message#RedirectDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 var labelStyle = data.labelStyle = "width:"+(AjxEnv.isIE ? 60 : 64)+"px; overflow:visible; white-space:nowrap;" 
	 var inputStyle = data.inputStyle = AjxEnv.isSafari && !AjxEnv.isSafariNightly ? "height:52px;" : "height:21px; overflow:hidden;" 
	buffer[_i++] = "<table role=\"presentation\" width=500 class=\"ZPropertySheet\" cellspacing=\"6\">";
	buffer[_i++] =  AjxTemplate.expand("#To_Recipient", data) ;
	buffer[_i++] = "<tr><td align=right valign=top colspan=3>";
	buffer[_i++] =  ZmMsg.redirectExplanation ;
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#RedirectDialog"
}, false);

AjxTemplate.register("mail.Message#UploadProgressContainer", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100%><tr style=\"display:table-row;\"><td width=\"96%\" colspan=\"2\"><div class=\"attBubbleContainer\"><div class=\"attBubbleHolder\">";
	buffer[_i++] =  AjxTemplate.expand("mail.Message#MailAttachmentBubble", data) ;
	buffer[_i++] = "</div></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#UploadProgressContainer"
}, false);

AjxTemplate.register("mail.Message#NoAttachments", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100%><tr><td width=\"96%\" colspan=\"2\"><div class=\"attBubbleContainer\"><div class=\"attBubbleHolder attPlaceholderHint\">\n";
	buffer[_i++] = "\t\t\t\t\t\t";
	buffer[_i++] = data["hint"];
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t\t</div></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#NoAttachments"
}, false);

AjxTemplate.register("mail.Message#ForwardAttachments", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100%>";
	 var id = Dwt.getNextId(data.rowId) 
	buffer[_i++] = "<tr '";
	buffer[_i++] =  id ;
	buffer[_i++] = "' style=\"display:table-row;\"><td width=\"96%\" colspan=\"2\"><div class=\"attBubbleContainer\"><div class=\"attBubbleHolder\">";
	 for (var i = 0; i < data.attachments.length; i++) { 
	 var attachment = data.attachments[i]; 
	buffer[_i++] = "<span id='";
	buffer[_i++] =  attachment.spanId ;
	buffer[_i++] = "' class=\"AttachmentLoading attachmentBubble AttachmentSpan\"><span><input type=\"hidden\" mid='";
	buffer[_i++] = attachment.mid;
	buffer[_i++] = "' value='";
	buffer[_i++] = attachment.part;
	buffer[_i++] = "' name='";
	buffer[_i++] =  data.fwdFieldName ;
	buffer[_i++] = "' ></span>";
	 if(appCtxt.get(ZmSetting.ATTACHMENTS_BLOCKED)) { 
	buffer[_i++] =  AjxStringUtil.htmlEncode(AjxStringUtil.clipFile(attachment.label,100)) ;
	 } else { 
	buffer[_i++] = "<!-- The open A element is within the attachment.link string -->";
	buffer[_i++] =  attachment.link ;
	 } 
	 if (attachment.size) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t\t\t\t(";
	buffer[_i++] =  attachment.size ;
	buffer[_i++] = ")\n";
	buffer[_i++] = "\t\t\t\t\t\t";
	 } 
	buffer[_i++] = "<span tabindex=0 onclick=\"";
	buffer[_i++] =  attachment.closeHandler ;
	buffer[_i++] = "\" onkeypress=\"";
	buffer[_i++] =  attachment.closeHandler ;
	buffer[_i++] = "\" class=\"ImgBubbleDelete AttachmentClose\" role=\"button\" aria-label=\"";
	buffer[_i++] =  ZmMsg.remove ;
	buffer[_i++] = "\"></span></span>";
	 } 
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#ForwardAttachments"
}, false);

AjxTemplate.register("mail.Message#ZmMailConfirmView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100%><tr><td valign=top id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_confirm'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_loading'>";
	buffer[_i++] =  ZmMsg.loading ;
	buffer[_i++] = "</div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_notLoading'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_summary' class=\"Summary\"></div><p><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_displayAddresses' class=\"displayAddresses\"><div>";
	buffer[_i++] =  ZmMsg.confirmDisplayAddresss ;
	buffer[_i++] = "</div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_displayAddressBox' class=\"Box DisplayAddressBox\"></div></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_newAddresses' class=\"NewAddresses\"><div>";
	buffer[_i++] =  ZmMsg.confirmNewAddresses ;
	buffer[_i++] = "</div><div>";
	buffer[_i++] =  ZmMsg.confirmNewAddressesCheck ;
	buffer[_i++] = "</div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_newAddressBox' class=\"Box NewAddressBox\"></div></div><div style=\"margin:3px\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_addButton'></div><br /><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_existingContacts' class=\"ExistingContacts\"><div>";
	buffer[_i++] =  ZmMsg.confirmExistingContacts ;
	buffer[_i++] = "</div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_existingContactBox' class=\"Box ExistingContactBox\"></div></div></p></div></td><td valign=top id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ad'>&nbsp;</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#ZmMailConfirmView"
}, false);

AjxTemplate.register("mail.Message#ZmMailConfirmViewNewAddress", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CHECKBOX\" tabindex='10'></div><table role=\"presentation\" style=\"margin-bottom:3px\"><tr><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FIRST\" tabindex='20'></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_LAST\" tabindex='30'></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#ZmMailConfirmViewNewAddress"
}, false);

AjxTemplate.register("mail.Message#ZmMailConfirmViewExistingContact", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style=\"padding:3px\">";
	buffer[_i++] = data["text"];
	buffer[_i++] = "</div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#ZmMailConfirmViewExistingContact"
}, false);

AjxTemplate.register("mail.Message#viewMessage", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%'><tr><td class='NoResults'>";
	buffer[_i++] =  (data && data.isConv) ? ZmMsg.viewConversation : ZmMsg.viewMessage ;
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#viewMessage"
}, false);

AjxTemplate.register("mail.Message#EmptyMessage", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%'><tr><td class='NoResults'>";
	buffer[_i++] =  ZmMsg.messageEmptyTextContent ;
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#EmptyMessage"
}, false);

AjxTemplate.register("mail.Message#Conv2View", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='Conv2View' id=\"";
	buffer[_i++] = data["mainDivId"];
	buffer[_i++] = "\"><div id=\"";
	buffer[_i++] = data["headerDivId"];
	buffer[_i++] = "\"></div><div role='list' id=\"";
	buffer[_i++] = data["messagesDivId"];
	buffer[_i++] = "\" class='Conv2Messages'></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2View"
}, false);

AjxTemplate.register("mail.Message#Conv2Header", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<span class=\"expandIcon\" id='";
	buffer[_i++] = data["convExpandId"];
	buffer[_i++] = "'></span><span class=\"subject\" role=\"heading\" aria-level=\"1\" id='";
	buffer[_i++] = data["convSubjectId"];
	buffer[_i++] = "'></span><span class=\"info\" id='";
	buffer[_i++] = data["convInfoId"];
	buffer[_i++] = "'></span>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2Header"
}, false);

AjxTemplate.register("mail.Message#Conv2Reply", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["replyToDivId"];
	buffer[_i++] = "\"></div><div id=\"";
	buffer[_i++] = data["replyCcDivId"];
	buffer[_i++] = "\" style=\"display:none;\"></div><div><textarea id=\"";
	buffer[_i++] = data["replyInputId"];
	buffer[_i++] = "\" class=\"ReplyTextarea\"></textarea></div><div id=\"";
	buffer[_i++] = data["replyToolbarId"];
	buffer[_i++] = "\"></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2Reply"
}, false);

AjxTemplate.register("mail.Message#Conv2ReplyTable", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class=\"ZPropertySheet\">";
	buffer[_i++] =  AjxTemplate.expand("#Conv2MsgAddressRow", data) ;
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2ReplyTable"
}, false);

AjxTemplate.register("mail.Message#Conv2MsgHeader-collapsed", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='image'><img src=\"";
	buffer[_i++] = data["imageURL"];
	buffer[_i++] = "\" alt=\"";
	buffer[_i++] = data["imageAltText"];
	buffer[_i++] = "\"\n";
	buffer[_i++] = "\t\t";
	 if (data.defaultImageUrl) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\tonerror=\"this.onerror=null;this.src='";
	buffer[_i++] = data["defaultImageUrl"];
	buffer[_i++] = "';\"\n";
	buffer[_i++] = "\t\t";
	 } 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t/></div><div class='info'><div id='";
	buffer[_i++] = data["fromId"];
	buffer[_i++] = "' class='ZmConvListFrom'>";
	buffer[_i++] = data["from"];
	buffer[_i++] = "</div><div class='ZmConvListFragment'>";
	buffer[_i++] =  data.fragment ;
	buffer[_i++] = "</div></div><div id='";
	buffer[_i++] = data["readCellId"];
	buffer[_i++] = "' class='readUnreadDot'></div><div class='date' id='";
	buffer[_i++] = data["dateCellId"];
	buffer[_i++] = "' title='";
	buffer[_i++] = data["dateTooltip"];
	buffer[_i++] = "'>";
	buffer[_i++] = data["date"];
	buffer[_i++] = "</div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2MsgHeader-collapsed"
}, false);

AjxTemplate.register("mail.Message#Conv2MsgHeader-expanded", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='image'><img src=\"";
	buffer[_i++] = data["imageURL"];
	buffer[_i++] = "\" alt=\"";
	buffer[_i++] = data["imageAltText"];
	buffer[_i++] = "\"\n";
	buffer[_i++] = "\t\t";
	 if (data.defaultImageUrl) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\tonerror=\"this.onerror=null;this.src='";
	buffer[_i++] = data["defaultImageUrl"];
	buffer[_i++] = "';\"\n";
	buffer[_i++] = "\t\t";
	 } 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t/></div><div class='info'><table role=\"presentation\" id='";
	buffer[_i++] = data["hdrTableId"];
	buffer[_i++] = "' class='ZPropertySheet' cellspacing='6'><tr><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.fromLabel ;
	buffer[_i++] = "</td><td class='LabelColValue' style='white-space:nowrap'>";
	buffer[_i++] =  AjxTemplate.expand("#SentBy", data) ;
	buffer[_i++] = "</td></tr>";
	 for (var i = 0; i < data.addressTypes.length; i++) { 
	buffer[_i++] =  AjxTemplate.expand("#Conv2MsgAddressRow", data.participants[data.addressTypes[i]]); ;
	 } 
	buffer[_i++] = "</table></div><div id='";
	buffer[_i++] = data["readCellId"];
	buffer[_i++] = "' class='readUnreadDot'></div><div class='date' id='";
	buffer[_i++] = data["dateCellId"];
	buffer[_i++] = "' title='";
	buffer[_i++] = data["dateTooltip"];
	buffer[_i++] = "'>";
	buffer[_i++] = data["date"];
	buffer[_i++] = "</div>";
	 if (data.isOutDated) { 
	buffer[_i++] =  AjxTemplate.expand("#InviteNotCurrent", data) ;
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2MsgHeader-expanded"
}, false);

AjxTemplate.register("mail.Message#Conv2MsgAddressRow", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr><td class='LabelColName'>";
	buffer[_i++] =  data.prefix ? AjxMessageFormat.format(ZmMsg.makeLabel, data.prefix) : "" ;
	buffer[_i++] = "</td><td class='LabelColValue'>";
	buffer[_i++] =  data.partStr ;
	buffer[_i++] = "</td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#Conv2MsgAddressRow"
}, false);

AjxTemplate.register("mail.Message#VacationRemindDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='width:350px;' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_question'><table role=\"presentation\" align='center' cellspacing='6' class=\"ZPropertySheet\"><tr><td>";
	buffer[_i++] =  AjxImg.getImageHtml(DwtMessageDialog.ICON[DwtMessageDialog.INFO_STYLE]) ;
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dontRemindMsg'>";
	buffer[_i++] = ZmMsg.outOfOfficeRemindQuestion;
	buffer[_i++] = "</td></tr></table></div><table role=\"presentation\" align='center'><tr><td><input checked value='0' type='checkbox' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dontRemind' name='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dontRemind'></td><td style='white-space:nowrap'><label id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dontRemindMsg' for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_dontRemind'>";
	buffer[_i++] = ZmMsg.dontRemind;
	buffer[_i++] = "</label></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "mail.Message#VacationRemindDialog"
}, false);

}
