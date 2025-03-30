if (AjxPackage.define("Tasks")) {
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
/*
 * Package: Tasks
 * 
 * Supports: The Tasks application
 * 
 * Loaded: When the user goes to the Tasks application
 */

// base class for ZmApptView
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

if (AjxPackage.define("zimbraMail.calendar.controller.ZmCalItemComposeController")) {

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
 * Creates a new appointment controller to manage appointment creation/editing.
 * @constructor
 * @class
 * This class manages appointment creation/editing.
 *
 * @author Parag Shah
 *
 * @param {DwtShell}	container	the containing shell
 * @param {ZmApp}		app			the containing app
 * @param {constant}	type		controller type
 * @param {string}		sessionId	the session id
 * 
 * @extends		ZmBaseController
 */
ZmCalItemComposeController = function(container, app, type, sessionId) {
	if (arguments.length == 0) { return; }
	ZmBaseController.apply(this, arguments);
	this._elementsToHide = ZmAppViewMgr.LEFT_NAV;

	this._onAuthTokenWarningListener = this._onAuthTokenWarningListener.bind(this);
	appCtxt.addAuthTokenWarningListener(this._onAuthTokenWarningListener);
};

ZmCalItemComposeController.prototype = new ZmBaseController;
ZmCalItemComposeController.prototype.constructor = ZmCalItemComposeController;

ZmCalItemComposeController.prototype.isZmCalItemComposeController = true;
ZmCalItemComposeController.prototype.toString = function() { return "ZmCalItemComposeController"; };

ZmCalItemComposeController.DEFAULT_TAB_TEXT = ZmMsg.appointment;

ZmCalItemComposeController.SAVE_CLOSE 	= "SAVE_CLOSE";
ZmCalItemComposeController.SEND 		= "SEND";
ZmCalItemComposeController.SAVE  		= "SAVE";
ZmCalItemComposeController.APPT_MODE  	= "APPT";
ZmCalItemComposeController.MEETING_MODE	= "MEETING";

// Public methods

ZmCalItemComposeController.prototype.show =
function(calItem, mode, isDirty) {

    this._mode = mode;
	if (this._toolbar.toString() != "ZmButtonToolBar") {
		this._createToolBar();
	}
	var initial = this.initComposeView();
	this._app.pushView(this._currentViewId);
	this._composeView.set(calItem, mode, isDirty);
	this._composeView.reEnableDesignMode();
    this._initToolbar(mode);
	if (initial) {
		this._setComposeTabGroup();
	}
};

ZmCalItemComposeController.prototype._preHideCallback =
function(view, force) {

	ZmController.prototype._preHideCallback.call(this);
	return force ? true : this.popShield();
};

ZmCalItemComposeController.prototype._preUnloadCallback =
function(view) {
	return !this._composeView.isDirty();
};


ZmCalItemComposeController.prototype._preShowCallback =
function() {
	return true;
};

ZmCalItemComposeController.prototype._postShowCallback =
function(view, force) {
	var ta = new AjxTimedAction(this, this._setFocus);
	AjxTimedAction.scheduleAction(ta, 10);
};

ZmCalItemComposeController.prototype._postHideCallback =
function() {
	// overload me
};

ZmCalItemComposeController.prototype.popShield =
function() {
	if (!this._composeView.isDirty()) {
		this._composeView.cleanup();
		return true;
	}

	var ps = this._popShield = appCtxt.getYesNoCancelMsgDialog();
	ps.reset();
	ps.setMessage(ZmMsg.askToSave, DwtMessageDialog.WARNING_STYLE);
	ps.registerCallback(DwtDialog.YES_BUTTON, this._popShieldYesCallback, this);
	ps.registerCallback(DwtDialog.NO_BUTTON, this._popShieldNoCallback, this);
	ps.popup(this._composeView._getDialogXY());

	return false;
};

ZmCalItemComposeController.prototype._onAuthTokenWarningListener =
function() {
	// The auth token will expire in less than five minutes, so we must issue
	// issue a last, hard save. This method is typically called more than once.
	try {
		if (this._composeView && this._composeView.isDirty()) {
			// bypass most of the validity checking logic
			var calItem = this._composeView.getCalItem();
			return this._saveCalItemFoRealz(calItem, null, null, true);
		}
	} catch(ex) {
		var msg = AjxUtil.isString(ex) ?
			AjxMessageFormat.format(ZmMsg.errorSavingWithMessage, errorMsg) :
			ZmMsg.errorSaving;

		appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_CRITICAL);
	}
};

/**
 * Gets the appt view.
 * 
 * @return	{ZmApptView}	the appt view
 */
ZmCalItemComposeController.prototype.getItemView = function() {
	return this._composeView;
};

/**
 * Gets the toolbar.
 *
 * @return	{ZmButtonToolBar}	the toolbar
 */
ZmCalItemComposeController.prototype.getToolbar =
function() {
	return this._toolbar;
};

/**
 * Saves the calendar item.
 * 
 * @param	{String}	attId		the item id
 */
ZmCalItemComposeController.prototype.saveCalItem =
function(attId) {
	// override
};

/**
 * Toggles the spell check button.
 * 
 * @param	{Boolean}	toggled		if <code>true</code>, select the spell check button 
 */
ZmCalItemComposeController.prototype.toggleSpellCheckButton =
function(toggled) {
	var spellCheckButton = this._toolbar.getButton(ZmOperation.SPELL_CHECK);
	if (spellCheckButton) {
		spellCheckButton.setSelected((toggled || false));
	}
};

ZmCalItemComposeController.prototype.initComposeView =
function(initHide) {
	if (!this._composeView) {
		this._composeView = this._createComposeView();
		var callbacks = {};
		callbacks[ZmAppViewMgr.CB_PRE_HIDE] = new AjxCallback(this, this._preHideCallback);
		callbacks[ZmAppViewMgr.CB_PRE_UNLOAD] = new AjxCallback(this, this._preUnloadCallback);
		callbacks[ZmAppViewMgr.CB_POST_SHOW] = new AjxCallback(this, this._postShowCallback);
		callbacks[ZmAppViewMgr.CB_PRE_SHOW] = new AjxCallback(this, this._preShowCallback);
		callbacks[ZmAppViewMgr.CB_POST_HIDE] = new AjxCallback(this, this._postHideCallback);
		if (this._toolbar.toString() != "ZmButtonToolBar")
			this._createToolBar();
		var elements = this.getViewElements(null, this._composeView, this._toolbar);

		this._app.createView({	viewId:		this._currentViewId,
								viewType:	this._currentViewType,
								elements:	elements,
								hide:		this._elementsToHide,
								controller:	this,
								callbacks:	callbacks,
								tabParams:	this._getTabParams()});
		if (initHide) {
			this._composeView.preload();
		}
		return true;
	}
	return false;
};

ZmCalItemComposeController.prototype._getTabParams =
function() {
	return {id:this.tabId, image:"CloseGray", hoverImage:"Close", text:ZmCalItemComposeController.DEFAULT_TAB_TEXT, textPrecedence:76,
			tooltip:ZmCalItemComposeController.DEFAULT_TAB_TEXT, style: DwtLabel.IMAGE_RIGHT};
};

ZmCalItemComposeController.prototype._createComposeView =
function() {
	// override
};

ZmCalItemComposeController.prototype._setComposeTabGroup =
function(setFocus) {
	// override
};

ZmCalItemComposeController.prototype._setFocus =
function(focusItem, noFocus) {
	DBG.println(AjxDebug.KEYBOARD, "timed action restoring focus to " + focusItem + "; noFocus = " + noFocus);
	this._restoreFocus(focusItem, noFocus);
};

ZmCalItemComposeController.prototype.getKeyMapName =
function() {
	// override
};

ZmCalItemComposeController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG2, "ZmCalItemComposeController.handleKeyAction");
	switch (actionCode) {
		case ZmKeyMap.SAVE:
			this._saveListener();
			break;

		case ZmKeyMap.CANCEL:
			this._cancelListener();
			break;


		case ZmKeyMap.HTML_FORMAT:
			if (appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED)) {
				var mode = this._composeView.getComposeMode();
				var newMode = (mode == Dwt.TEXT) ? Dwt.HTML : Dwt.TEXT;
				this._formatListener(null, newMode);
				// reset the radio button for the format button menu
				var formatBtn = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
				if (formatBtn) {
					formatBtn.getMenu().checkItem(ZmHtmlEditor.VALUE, newMode, true);
				}
			}
			break;

		default:
			return ZmController.prototype.handleKeyAction.call(this, actionCode);
			break;
	}
	return true;
};

ZmCalItemComposeController.prototype.mapSupported =
function(map) {
	return (map == "editor");
};

ZmCalItemComposeController.prototype.getTabView =
function() {
	return this._composeView;
};

/**
 * inits check mark for menu item depending on compose mode preference.
 * 
 * @private
 */
ZmCalItemComposeController.prototype.setFormatBtnItem =
function(skipNotify, composeMode) {
	var mode;
	if (composeMode) {
		mode = composeMode;
	} else {
		var bComposeEnabled = appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED);
		var composeFormat = appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT);
		mode = (bComposeEnabled && composeFormat == ZmSetting.COMPOSE_HTML)
			? Dwt.HTML : Dwt.TEXT;
	}

	var formatBtn = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
	if (formatBtn) {
        var menu = formatBtn.getMenu ? formatBtn.getMenu() : null;
        if(menu) {
		    menu.checkItem(ZmHtmlEditor.VALUE, mode, skipNotify);
        }
	}
};

ZmCalItemComposeController.prototype.setOptionsBtnItem =
function(skipNotify, composeMode) {
	var mode;
	if (composeMode) {
		mode = composeMode;
	} else {
		var bComposeEnabled = appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED);
		var composeFormat = appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT);
		mode = (bComposeEnabled && composeFormat == ZmSetting.COMPOSE_HTML)
			? Dwt.HTML : Dwt.TEXT;
	}

	var formatBtn = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
	if (formatBtn) {
		formatBtn.getMenu().checkItem(ZmHtmlEditor.VALUE, mode, skipNotify);
	}
};

// Private / Protected methods


ZmCalItemComposeController.prototype._initToolbar =
function(mode) {
	if (this._toolbar.toString() != "ZmButtonToolBar") {
		this._createToolBar();
	}

    this.enableToolbar(true);

	var isNew = (mode == null || mode == ZmCalItem.MODE_NEW || mode == ZmCalItem.MODE_NEW_FROM_QUICKADD);

	var cancelButton = this._toolbar.getButton(ZmOperation.CANCEL);
	if (isNew) {
		cancelButton.setText(ZmMsg.cancel);
	} else {
		cancelButton.setText(ZmMsg.close);
	}

    var saveButton = this._toolbar.getButton(ZmOperation.SAVE);
    //use send button for forward appt view
    if(ZmCalItem.FORWARD_MAPPING[mode]) {
        saveButton.setText(ZmMsg.send);
    }

	var printButton = this._toolbar.getButton(ZmOperation.PRINT);
	if (printButton) {
		printButton.setEnabled(!isNew);
	}

	appCtxt.notifyZimlets("initializeToolbar", [this._app, this._toolbar, this, this._currentViewId], {waitUntilLoaded:true});
};


ZmCalItemComposeController.prototype._createToolBar =
function() {

	var buttons = [ZmOperation.SEND_INVITE, ZmOperation.SAVE, ZmOperation.CANCEL, ZmOperation.SEP];

	if (appCtxt.get(ZmSetting.ATTACHMENT_ENABLED)) {
		buttons.push(ZmOperation.ATTACHMENT);
	}

    if (appCtxt.get(ZmSetting.PRINT_ENABLED)) {
		buttons.push(ZmOperation.PRINT);
	}

	if (appCtxt.isSpellCheckerAvailable()) {
		buttons.push(ZmOperation.SPELL_CHECK);
	}
	buttons.push(ZmOperation.SEP, ZmOperation.COMPOSE_OPTIONS);

	this._toolbar = new ZmButtonToolBar({
		parent:     this._container,
		buttons:    buttons,
		overrides:  this._getButtonOverrides(buttons),
		context:    this._currentViewId,
		controller: this
	});
	this._toolbar.addSelectionListener(ZmOperation.SAVE, new AjxListener(this, this._saveListener));
	this._toolbar.addSelectionListener(ZmOperation.CANCEL, new AjxListener(this, this._cancelListener));

	if (appCtxt.get(ZmSetting.PRINT_ENABLED)) {
		this._toolbar.addSelectionListener(ZmOperation.PRINT, new AjxListener(this, this._printListener));
	}

	if (appCtxt.get(ZmSetting.ATTACHMENT_ENABLED)) {
		this._toolbar.addSelectionListener(ZmOperation.ATTACHMENT, new AjxListener(this, this._attachmentListener));
	}

    var sendButton = this._toolbar.getButton(ZmOperation.SEND_INVITE);
    sendButton.setVisible(false);

	// change default button style to toggle for spell check button
	var spellCheckButton = this._toolbar.getButton(ZmOperation.SPELL_CHECK);
	if (spellCheckButton) {
		spellCheckButton.setAlign(DwtLabel.IMAGE_LEFT | DwtButton.TOGGLE_STYLE);
	}

	var optionsButton = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
	if (optionsButton) {
		optionsButton.setVisible(false); //start it hidden, and show in case it's needed.
	}

	if (optionsButton && appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED)) {
		optionsButton.setVisible(true); 

		var m = new DwtMenu({parent:optionsButton});
		optionsButton.setMenu(m);

		var mi = new DwtMenuItem({parent:m, style:DwtMenuItem.RADIO_STYLE, id:[ZmId.WIDGET_MENU_ITEM,this._currentViewId,ZmOperation.FORMAT_HTML].join("_")});
		mi.setImage("HtmlDoc");
		mi.setText(ZmMsg.formatAsHtml);
		mi.setData(ZmHtmlEditor.VALUE, Dwt.HTML);
        mi.addSelectionListener(new AjxListener(this, this._formatListener));

		mi = new DwtMenuItem({parent:m, style:DwtMenuItem.RADIO_STYLE, id:[ZmId.WIDGET_MENU_ITEM,this._currentViewId,ZmOperation.FORMAT_TEXT].join("_")});
		mi.setImage("GenericDoc");
		mi.setText(ZmMsg.formatAsText);
		mi.setData(ZmHtmlEditor.VALUE, Dwt.TEXT);
        mi.addSelectionListener(new AjxListener(this, this._formatListener));
	}

	this._toolbar.addSelectionListener(ZmOperation.SPELL_CHECK, new AjxListener(this, this._spellCheckListener));
};

ZmCalItemComposeController.prototype.showErrorMessage =
function(errorMsg) {
	var dialog = appCtxt.getMsgDialog();
    dialog.reset();
	//var msg = ZmMsg.errorSaving + (errorMsg ? (":<p>" + errorMsg) : ".");
	var msg = errorMsg ? AjxMessageFormat.format(ZmMsg.errorSavingWithMessage, errorMsg) : ZmMsg.errorSaving;
	dialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
	dialog.popup();
    this.enableToolbar(true);
};

ZmCalItemComposeController.prototype._saveCalItemFoRealz = function(calItem, attId, notifyList, force) {

    var recurringChanges = this._composeView.areRecurringChangesDirty();

	if (this._composeView.isDirty() || recurringChanges || force) {
		// bug: 16112 - check for folder existance
		if (calItem.getFolder() && calItem.getFolder().noSuchFolder) {
			var msg = AjxMessageFormat.format(ZmMsg.errorInvalidFolder, calItem.getFolder().name);
			this.showErrorMessage(msg);
			return false;
		}
        if(this._composeView.isReminderOnlyChanged()) {
            calItem.setMailNotificationOption(false);
        }
        var callback = new AjxCallback(this, this._handleResponseSave, calItem);
		var errorCallback = new AjxCallback(this, this._handleErrorSave, calItem);
        this._doSaveCalItem(calItem, attId, callback, errorCallback, notifyList);
	} else {
        if (this._action == ZmCalItemComposeController.SAVE && !this._composeView.isDirty()) {
            this.enableToolbar(true);
        }
        
        if (this.isCloseAction()){
            this._composeView.cleanup();  // bug: 27600 clean up edit view to avoid stagnant attendees
            this.closeView();
        }
	}
};

ZmCalItemComposeController.prototype._doSaveCalItem =
function(calItem, attId, callback, errorCallback, notifyList){
    if(this._action == ZmCalItemComposeController.SEND)
        calItem.send(attId, callback, errorCallback, notifyList);
    else
        calItem.save(attId, callback, errorCallback, notifyList);
};

ZmCalItemComposeController.prototype.isCloseAction =
function() {
    return ( this._action == ZmCalItemComposeController.SEND ||  this._action == ZmCalItemComposeController.SAVE_CLOSE );
};

ZmCalItemComposeController.prototype._handleResponseSave =
function(calItem, result) {
    try {
        if (calItem.__newFolderId) {
            var folder = appCtxt.getById(calItem.__newFolderId);
            calItem.__newFolderId = null;
            this._app.getListController()._doMove(calItem, folder, null, false);
        }

        calItem.handlePostSaveCallbacks();
        if(this.isCloseAction()) {
        	this.closeView();
        }
        appCtxt.notifyZimlets("onSaveApptSuccess", [this, calItem, result]);//notify Zimlets on success
    } catch (ex) {
        DBG.println(ex);
    } finally {
        this._composeView.cleanup();
    }
};

ZmCalItemComposeController.prototype._handleErrorSave =
function(calItem, ex) {
	var status = this._getErrorSaveStatus(calItem, ex);
	return status.handled;
};

ZmCalItemComposeController.prototype._getErrorSaveStatus =
function(calItem, ex) {
	// TODO: generalize error message for calItem instead of just Appt
	var status = calItem.processErrorSave(ex);
	status.handled = false;

    if (status.continueSave) {
        this.saveCalItemContinue(calItem);
        status.handled = true;
    } else {
        // Enable toolbar if not attempting to continue the Save
        this.enableToolbar(true);
        if (status.errorMessage) {
            // Handled the error, display the error message
            status.handled = true;
            var dialog = appCtxt.getMsgDialog();
            dialog.setMessage(status.errorMessage, DwtMessageDialog.CRITICAL_STYLE);
            dialog.popup();
        }
        appCtxt.notifyZimlets("onSaveApptFailure", [this, calItem, ex]);
    }

    return status;
};

// Spell check methods

ZmCalItemComposeController.prototype._spellCheckAgain =
function() {
	this._composeView.getHtmlEditor().discardMisspelledWords();
	this._doSpellCheck();
	return false;
};

ZmCalItemComposeController.prototype.enableToolbar =
function(enabled) {
    this._toolbar.enableAll(enabled);
};

// Listeners

// Save button was pressed
ZmCalItemComposeController.prototype._saveListener =
function(ev) {
    this._action = ZmCalItemComposeController.SAVE;
    this.enableToolbar(false);
	if (this._doSave() === false) {
		return;
    }
};

// Cancel button was pressed
ZmCalItemComposeController.prototype._cancelListener =
function(ev) {
	this._action = ZmCalItemComposeController.SAVE_CLOSE;
	this._app.popView();
};

ZmCalItemComposeController.prototype._printListener =
function() {
	// overload me.
};

// Attachment button was pressed
ZmCalItemComposeController.prototype._attachmentListener =
function(ev) {
	this._composeView.addAttachmentField();
};

ZmCalItemComposeController.prototype._formatListener =
function(ev, mode) {
	if (!mode && !(ev && ev.item.getChecked())) return;

	mode = mode || ev.item.getData(ZmHtmlEditor.VALUE);
	if (mode == this._composeView.getComposeMode()) return;

	if (mode == Dwt.TEXT) {
		// if formatting from html to text, confirm w/ user!
		if (!this._textModeOkCancel) {
			var dlgId = this._composeView.getHTMLElId() + "_formatWarning";
			this._textModeOkCancel = new DwtMessageDialog({id: dlgId, parent:this._shell, buttons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
			this._textModeOkCancel.setMessage(ZmMsg.switchToText, DwtMessageDialog.WARNING_STYLE);
			this._textModeOkCancel.registerCallback(DwtDialog.OK_BUTTON, this._textModeOkCallback, this);
			this._textModeOkCancel.registerCallback(DwtDialog.CANCEL_BUTTON, this._textModeCancelCallback, this);
		}
		this._textModeOkCancel.popup(this._composeView._getDialogXY());
	} else {
		this._composeView.setComposeMode(mode);
	}
};

ZmCalItemComposeController.prototype._spellCheckListener =
function(ev) {
	var spellCheckButton = this._toolbar.getButton(ZmOperation.SPELL_CHECK);
	var htmlEditor = this._composeView.getHtmlEditor();

	if (spellCheckButton.isToggled()) {
		var callback = new AjxCallback(this, this.toggleSpellCheckButton)
		if (!htmlEditor.spellCheck(callback))
			this.toggleSpellCheckButton(false);
	} else {
		htmlEditor.discardMisspelledWords();
	}
};

ZmCalItemComposeController.prototype._doSave =
function() {
	// check if all fields are populated w/ valid values
	try {
		if (this._composeView.isValid()) {
			return this.saveCalItem();
		}
	} catch(ex) {
		if (AjxUtil.isString(ex)) {
			this.showErrorMessage(ex);
		} else {
			DBG.dumpObj(AjxDebug.DBG1, ex);
		}

		return false;
	}
};


// Callbacks

ZmCalItemComposeController.prototype._doSpellCheck =
function() {
	var text = this._composeView.getHtmlEditor().getTextVersion();
	var soap = AjxSoapDoc.create("CheckSpellingRequest", "urn:zimbraMail");
	soap.getMethod().appendChild(soap.getDoc().createTextNode(text));
	var cmd = new ZmCsfeCommand();
	var callback = new AjxCallback(this, this._spellCheckCallback);
	cmd.invoke({soapDoc:soap, asyncMode:true, callback:callback});
};

ZmCalItemComposeController.prototype._popShieldYesCallback =
function() {
	this._popShield.popdown();
	this._action = ZmCalItemComposeController.SAVE_CLOSE;
	if (this._doSave()) {
		appCtxt.getAppViewMgr().showPendingView(true);
	}
};

ZmCalItemComposeController.prototype._popShieldNoCallback =
function() {
	this._popShield.popdown();
    this.enableToolbar(true);
	try {
		// bug fix #33001 - prism throws exception with this method:
		appCtxt.getAppViewMgr().showPendingView(true);
	} catch(ex) {
		// so do nothing
	} finally {
		// but make sure cleanup is *always* called
		this._composeView.cleanup();
	}
};

ZmCalItemComposeController.prototype._closeView =
function() {
	this._app.popView(true,this._currentViewId);
    this._composeView.cleanup();
};

ZmCalItemComposeController.prototype._textModeOkCallback =
function(ev) {
	this._textModeOkCancel.popdown();
	this._composeView.setComposeMode(Dwt.TEXT);
};

ZmCalItemComposeController.prototype._textModeCancelCallback =
function(ev) {
	this._textModeOkCancel.popdown();
	// reset the radio button for the format button menu
	var formatBtn = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
	if (formatBtn) {
		formatBtn.getMenu().checkItem(ZmHtmlEditor.VALUE, Dwt.HTML, true);
	}
	this._composeView.reEnableDesignMode();
};
}

if (AjxPackage.define("zimbraMail.calendar.model.ZmRecurrence")) {
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
 * Creates a recurrence object.
 * @class
 * This class represents a recurrence pattern.
 * 
 * @param	{ZmCalItem}	calItem		the calendar item
 * 
 */
ZmRecurrence = function(calItem) {
	this._startDate 			= (calItem && calItem.startDate) ? calItem.startDate : (new Date());

	// initialize all params (listed alphabetically)
	this.repeatCustom			= "0";  										// 1|0
	this.repeatCustomCount		= 1; 											// ival
	this.repeatCustomDayOfWeek	= "SU"; 										// (DAY|WEEKDAY|WEEKEND) | (SU|MO|TU|WE|TH|FR|SA)
	this.repeatBySetPos	= "1";
	this.repeatCustomMonthDay	= this._startDate.getDate();
	this.repeatCustomType		= "S"; 											// (S)pecific, (O)rdinal
	this.repeatEnd				= null;
	this.repeatEndCount			= 1; 											// maps to "count" (when there is no end date specified)
	this.repeatEndDate			= null; 										// maps to "until"
	this.repeatEndType			= "N";
	this.repeatMonthlyDayList	= null; 										// list of numbers representing days (usually, just one day)
	this.repeatType				= ZmRecurrence.NONE;							// maps to "freq"
	this.repeatWeekday			= false; 										// set to true if freq = "DAI" and custom repeats every weekday
	this.repeatWeeklyDays		= [];	 										// SU|MO|TU|WE|TH|FR|SA
	this.repeatYearlyMonthsList	= 1; 											// list of numbers representing months (usually, just one month)

    this._cancelRecurIds        = {};                                           //list of recurIds to be excluded
};

ZmRecurrence.prototype.toString =
function() {
	return "ZmRecurrence";
};

/**
 * Defines the "none" recurrence.
 */
ZmRecurrence.NONE		= "NON";
/**
 * Defines the "daily" recurrence.
 */
ZmRecurrence.DAILY		= "DAI";
/**
 * Defines the "weekly" recurrence.
 */
ZmRecurrence.WEEKLY		= "WEE";
/**
 * Defines the "monthly" recurrence.
 */
ZmRecurrence.MONTHLY	= "MON";
/**
 * Defines the "yearly" recurrence.
 */
ZmRecurrence.YEARLY		= "YEA";

/**
 * Defines the "day" week day selection.
 */
ZmRecurrence.RECURRENCE_DAY = -1;
/**
 * Defines the "weekend" week day selection.
 */
ZmRecurrence.RECURRENCE_WEEKEND = -2;
/**
 * Defines the "weekday" week day selection.
 */
ZmRecurrence.RECURRENCE_WEEKDAY = -3

ZmRecurrence.prototype.setJson =
function(inv) {
	if (this.repeatType == ZmRecurrence.NONE) {
        return;
    }

	var recur = inv.recur = {},
        add = recur.add = {},
        rule = add.rule = {},
        interval = rule.interval = {},
        until,
        bwd,
        bmd,
        c,
        i,
        day,
        wkDay,
        bysetpos,
        bm;

	rule.freq = this.repeatType;
	interval.ival = this.repeatCustomCount;

	if (this.repeatEndDate != null && this.repeatEndType == "D") {
		until = rule.until = {};
		until.d = AjxDateUtil.getServerDate(this.repeatEndDate);
	}
    else if (this.repeatEndType == "A"){
		c = rule.count = {};
		c.num = this.repeatEndCount;
	}

	if (this.repeatCustom != "1") {
        this.setExcludes(recur);
		return;
    }

	if (this.repeatType == ZmRecurrence.DAILY) {
        if (this.repeatWeekday) {
			// TODO: for now, handle "every weekday" as M-F
			//       eventually, needs to be localized work week days
			bwd = rule.byday = {};
            wkDay = bwd.wkday = [];
			for (i = 0; i < ZmCalItem.SERVER_WEEK_DAYS.length; i++) {
				day = ZmCalItem.SERVER_WEEK_DAYS[i];
				if (day == "SA" || day == "SU") {
					continue;
                }
				wkDay.push({
                    day : day
                });
			}
		}
	}
    else if (this.repeatType == ZmRecurrence.WEEKLY) {
        bwd = rule.byday = {};
        wkDay = bwd.wkday = [];
		for (i = 0; i < this.repeatWeeklyDays.length; ++i) {
            wkDay.push({
                day : this.repeatWeeklyDays[i]
            });
		}
	}
	else if (this.repeatType == ZmRecurrence.MONTHLY) {
		if (this.repeatCustomType == "S") {
			bmd = rule.bymonthday = {};
			bmd.modaylist = this.repeatMonthlyDayList.join(",");
		}
        else {
			bwd = rule.byday = {};
            bwd.wkday = [];
            if (this.repeatCustomDays) {
                for (i=0; i < this.repeatCustomDays.length; i++) {
                    wkDay = {};
                    wkDay.day = this.repeatCustomDays[i];
                    if (this.repeatCustomOrdinal) {
                        wkDay.ordwk = this.repeatCustomOrdinal;
                    }
                    bwd.wkday.push(wkDay);
                }
            }

            if (this.repeatCustomOrdinal == null) {
                bysetpos = rule.bysetpos = {};
                bysetpos.poslist = this.repeatBySetPos;
            }
        }
    }
	else if (this.repeatType == ZmRecurrence.YEARLY) {
		bm = rule.bymonth = {};
		bm.molist = this.repeatYearlyMonthsList;
		if (this.repeatCustomType == "O") {
			bwd = rule.byday = {};
            bwd.wkday = [];
            if(this.repeatCustomDays) {
                for(i=0; i < this.repeatCustomDays.length; i++) {
                    wkDay = {};
                    wkDay.day = this.repeatCustomDays[i];
                    if (this.repeatCustomOrdinal) {
                        wkDay.ordwk = this.repeatCustomOrdinal;
                    }
                    bwd.wkday.push(wkDay);
                }
            }

            if(this.repeatCustomOrdinal == null) {
                bysetpos = rule.bysetpos = {};
                bysetpos.poslist = this.repeatBySetPos;
            }

        } else {
			bmd = rule.bymonthday = {};
			bmd.modaylist = this.repeatCustomMonthDay;
		}

	}

    this.setExcludes(recur);
};

ZmRecurrence.prototype.setExcludes =
function(recur) {
    if (!this._cancelRecurIds) {
        return;
    }

    var exclude,
        dates,
        i,
        ridZ,
        dtval,
        s;

    for (i in this._cancelRecurIds) {

        if (!this._cancelRecurIds[i]) {
            continue;
        }

        if (!exclude && !dates) {
            exclude = recur.exclude = {};
            dates = exclude.dates = {};
            // Fix for bug: 77998, 84054. Object was missing child element dtval as per soap doc.
            dates.dtval = [];
        }

        ridZ = i;
        dtval = {};
        s = dtval.s = {};
        s.d = ridZ;
        // dtval should hold list of timestamps for conflicting appointments.
        dates.dtval.push(dtval);
    }
};

/**
 * Gets the recurrence blurb.
 * 
 * @return	{String}	the blurb text
 */
ZmRecurrence.prototype.getBlurb =
function() {
	if (this.repeatType == ZmRecurrence.NONE)
		return "";

	var every = [];
	switch (this.repeatType) {
		case ZmRecurrence.DAILY: {
			if (this.repeatCustom == "1" && this.repeatWeekday) {
				every.push(ZmMsg.recurDailyEveryWeekday);
			} else if (this.repeatCustomCount == 1) {
				every.push(ZmMsg.recurDailyEveryDay);
			} else {
				var formatter = new AjxMessageFormat(ZmMsg.recurDailyEveryNumDays);
				every.push(formatter.format(this.repeatCustomCount));
			}
			break;
		}
		case ZmRecurrence.WEEKLY: {
			if (this.repeatCustomCount == 1 && this.repeatWeeklyDays.length == 1) {
				var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatWeeklyDays[0]);
				var date = new Date();
				date.setDate(date.getDate() - date.getDay() + dayofweek);

				var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
				every.push(formatter.format(date));
			} else {
				var weekdays = [];
				for (var i = 0; i < this.repeatWeeklyDays.length; i++) {
					var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatWeeklyDays[i]);
					var date = new Date();
					date.setDate(date.getDate() - date.getDay() + dayofweek);
					weekdays.push(date);
				}

				var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryNumWeeksDate);
				every.push(formatter.format([ this.repeatCustomCount, weekdays, "" ]));
			}
			break;
		}
		case ZmRecurrence.MONTHLY: {
			if (this.repeatCustomType == "S") {
				var count = Number(this.repeatCustomCount);
				var date = Number(this.repeatMonthlyDayList[0]);

				var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsDate);
				every.push(formatter.format([ date, count ]));
			} else {
				var ordinal = Number(this.repeatCustomOrdinal);
                var bysetpos = Number(this.repeatBySetPos);                                
                var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatCustomDayOfWeek);
				var day = new Date();
				day.setDate(day.getDate() - day.getDay() + dayofweek);
                var count = Number(this.repeatCustomCount);

                var days = this.repeatCustomDays.join(",");
                var workWeekDays = ZmCalItem.SERVER_WEEK_DAYS.slice(1,6).join(","); 
                var weekEndDays = [ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SUNDAY], ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SATURDAY]].join(",");

                //if both values are present and unequal give preference to repeatBySetPos
                if (this.repeatCustomOrdinal != null &&
                    this.repeatBySetPos != null &&
                    this.repeatCustomOrdinal != this.repeatBySetPos) {
                    this.repeatCustomOrdinal = this.repeatBySetPos;
                }

                if((ZmCalItem.SERVER_WEEK_DAYS.join(",") == days) || (workWeekDays == days) || (weekEndDays == days)) {
                    var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsWeekDays);
                    var dayType = -1;
                    if(workWeekDays == days) {
                        dayType = 1;
                    }else if(weekEndDays == days) {
                        dayType = 0;
                    }
                    every.push(formatter.format([ bysetpos || ordinal, dayType, count ]));
                }else {
                    var day = new Date();
                    day.setDate(day.getDate() - day.getDay() + dayofweek);
                    var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsNumDay);
                    every.push(formatter.format([ bysetpos || ordinal, day, count ]));
                }
			}
			break;
		}
		case ZmRecurrence.YEARLY: {
			if (this.repeatCustomType == "S") {
				var month = new Date();
				month.setMonth(Number(this.repeatYearlyMonthsList) - 1);
				var day = Number(this.repeatCustomMonthDay);

				var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryDate);
				every.push(formatter.format([ month, day ]));
			} else {
				var ordinal = Number(this.repeatCustomOrdinal);
                var bysetpos = Number(this.repeatBySetPos);                
                var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatCustomDayOfWeek);
                var month = new Date();
                month.setMonth(Number(this.repeatYearlyMonthsList)-1);

                var days = this.repeatCustomDays.join(",");
                var workWeekDays = ZmCalItem.SERVER_WEEK_DAYS.slice(1,6).join(",");
                var weekEndDays = [ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SUNDAY], ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SATURDAY]].join(",");

                if((ZmCalItem.SERVER_WEEK_DAYS.join(",") == days) || (workWeekDays == days) || (weekEndDays == days)) {
                    var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthWeekDays);
                    var dayType = -1;
                    if(workWeekDays == days) {
                        dayType = 1;
                    }else if(weekEndDays == days) {
                        dayType = 0;
                    }
                    every.push(formatter.format([ bysetpos || ordinal, dayType, month ]));
                }else {

                    var day = new Date();
                    day.setDate(day.getDate() - day.getDay() + dayofweek);
                    var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthNumDay);
                    every.push(formatter.format([ bysetpos || ordinal, day, month ]));
                }
            }
			break;
		}
	}

	// start
	var start = [];
	var formatter = new AjxMessageFormat(ZmMsg.recurStart);
	start.push(formatter.format(this._startDate));

	// end
	var end = [];
	switch (this.repeatEndType) {
		case "N": {
			end.push(ZmMsg.recurEndNone);
			break;
		}
		case "A": {
			formatter = new AjxMessageFormat(ZmMsg.recurEndNumber);
			end.push(formatter.format(this.repeatEndCount));
			break;
		}
		case "D": {
			formatter = new AjxMessageFormat(ZmMsg.recurEndByDate);
			end.push(formatter.format(this.repeatEndDate));
			break;
		}
	}

	// join all three together
	if (every.length > 0) {
		every.push(".  ");
	}
	if (end.length > 0) {
		end.push(".  ");
	}
	formatter = new AjxMessageFormat(ZmMsg.recurBlurb);
	return formatter.format([ every.join(""), end.join(""), start.join("") ]);
};

ZmRecurrence.prototype.parse =
function(recurRules) {
	// bug 16513: This array never gets cleaned.
	// TODO: Maybe this needs a flag so it doesn't reparse?
	this.repeatWeeklyDays = [];

	for (var k = 0; k < recurRules.length ; ++k) {
		var adds = recurRules[k].add;
		if (!adds) continue;

		this.repeatYearlyMonthsList = this._startDate.getMonth() + 1;
		for (var i = 0; i < adds.length; ++i) {
			var rules = adds[i].rule;
			if (!rules) continue;

			for (var j = 0; j < rules.length; ++j) {
				var rule = rules[j];
				if (rule.freq) {
					this.repeatType = rule.freq.substring(0,3);
					if (rule.interval && rule.interval[0].ival) {
						this.repeatCustomCount = parseInt(rule.interval[0].ival);
						this.repeatCustom = "1";
					}
				}
				if (rule.bymonth) {
					this.repeatYearlyMonthsList = rule.bymonth[0].molist;
					this.repeatCustom = "1";
				}
				if (rule.bymonthday) {
					if (this.repeatType == ZmRecurrence.YEARLY) {
						this.repeatCustomMonthDay = rule.bymonthday[0].modaylist;
						this.repeatCustomType = "S";
					} else if (this.repeatType == ZmRecurrence.MONTHLY){
						this.repeatMonthlyDayList = rule.bymonthday[0].modaylist.split(",");
					}
					this.repeatCustom = "1";
				}
				if (rule.byday && rule.byday[0] && rule.byday[0].wkday) {
					this.repeatCustom = "1";
					var wkday = rule.byday[0].wkday;
					if (this.repeatType == ZmRecurrence.WEEKLY || (this.repeatType == ZmRecurrence.DAILY && wkday.length == 5)) {
						this.repeatWeekday = this.repeatType == ZmRecurrence.DAILY;
						for (var x = 0; x < wkday.length; ++x) {
							this.repeatWeeklyDays.push(wkday[x].day);
						}
					} else {
						this.repeatCustomDayOfWeek = wkday[0].day;
                        var days = [];
                        for(var i = 0; i < wkday.length; i++) {
                            days.push(wkday[i].day);
                        }
                        this.repeatCustomDays = days;                        
                        this.repeatCustomOrdinal = wkday[0].ordwk;
                        this.repeatBySetPos  = (rule.bysetpos && (rule.bysetpos.length > 0)) ? rule.bysetpos[0].poslist : null;
                        //ical sends only ordwk in recurrence rule, we follow outlook behavior in setting repeatbysetpos instead of ordwk
                        if(this.repeatBySetPos == null && this.repeatCustomOrdinal) {
                            this.repeatBySetPos  = this.repeatCustomOrdinal; 
                        }
                        this.repeatCustomType = "O";
					}
				}
				if (rule.until) {
					this.repeatEndType = "D";
					this.repeatEndDate = AjxDateUtil.parseServerDateTime(rule.until[0].d);
				} else if (rule.count) {
					this.repeatEndType = "A";
					this.repeatEndCount = rule.count[0].num;
				}
			}
		}
	}
};

ZmRecurrence.prototype.setRecurrenceStartTime =
function(startTime) {
	
	this._startDate.setTime(startTime);
    this.repeatCustomMonthDay	= this._startDate.getDate();    
	
	if (this.repeatType == ZmRecurrence.NONE) return;

	//if (this.repeatCustom != "0")
		//return;

 	if (this.repeatType == ZmRecurrence.WEEKLY) {
		this.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[this._startDate.getDay()]];
	} else if (this.repeatType == ZmRecurrence.MONTHLY) {
		this.repeatMonthlyDayList = [this._startDate.getDate()];
    } else if (this.repeatType == ZmRecurrence.YEARLY) {
		this.repeatYearlyMonthsList = this._startDate.getMonth() + 1;	
	}
};

ZmRecurrence.prototype.setRecurrenceRules =
function(recurRules, startDate) {

    if (recurRules)
        this.parse(recurRules);    

    if(!startDate) return;

    if (this.repeatWeeklyDays == null) {
        this.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[startDate.getDay()]];
    }
    if (this.repeatMonthlyDayList == null) {
        this.repeatMonthlyDayList = [startDate.getDate()];
    }

};

ZmRecurrence.prototype.addCancelRecurId =
function(ridZ) {
    this._cancelRecurIds[ridZ] = true;        
};

ZmRecurrence.prototype.resetCancelRecurIds =
function(   ) {
    this._cancelRecurIds = {};
};

ZmRecurrence.prototype.isInstanceCanceled =
function(ridZ) {
    return this._cancelRecurIds[ridZ];
};

ZmRecurrence.prototype.removeCancelRecurId =
function(ridZ) {
    this._cancelRecurIds[ridZ] = null;
};

ZmRecurrence.prototype.parseExcludeInfo =
function(recurInfo) {

    if (!recurInfo) { return; }

    for(var i=0; i < recurInfo.length; i++) {
        var excludeInfo = (recurInfo[i] && recurInfo[i].exclude) ? recurInfo[i].exclude : null;
        if(!excludeInfo) continue;
        for(var j=0; j < excludeInfo.length; j++) {
            var datesInfo = excludeInfo[j].dates;
            if(datesInfo) this._parseExcludeDates(datesInfo);
        }
    }

};

ZmRecurrence.prototype._parseExcludeDates =
function(datesInfo) {
    for(var j=0; j < datesInfo.length; j++) {

        var dtval = datesInfo[j].dtval;
        if(!dtval) continue;

        for(var k=0; k < dtval.length; k++) {
            var dinfo = dtval[k];
            var excludeDate = (dinfo && dinfo.s) ? dinfo.s[0].d : null;
            if(excludeDate) this.addCancelRecurId(excludeDate);
        }
    }
};

}
if (AjxPackage.define("zimbraMail.calendar.model.ZmCalItem")) {
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
 * This file defines a Zimbra calendar item.
 *
 */

/**
 * @class
 * This class represents a calendar item.
 *
 * @param	{constant}	type		the item type
 * @param	{ZmList}	list		the list
 * @param	{int}	id				the task id
 * @param	{String}	folderId	the folder id
 *
 * @extends ZmCalBaseItem
 */
ZmCalItem = function(type, list, id, folderId) {
	if (arguments.length == 0) { return; }

	ZmCalBaseItem.call(this, type, list, id, folderId);

	this.notesTopPart = null; // ZmMimePart containing children w/ message parts
	this.attachments = null;
	this.viewMode = ZmCalItem.MODE_NEW;
	this._recurrence = new ZmRecurrence(this);
	this._noBusyOverlay = null;
    this._sendNotificationMail = true;
    this.identity = null;
    this.isProposeTimeMode = false;
    this.isForwardMode = false;
	this.alarmActions = new AjxVector();
	this.alarmActions.add(ZmCalItem.ALARM_DISPLAY);
	this._useAbsoluteReminder = false;
    this._ignoreVersion=false; //to ignore revision related attributes(ms & rev) during version conflict
};

ZmCalItem.prototype = new ZmCalBaseItem;
ZmCalItem.prototype.constructor = ZmCalItem;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmCalItem.prototype.toString =
function() {
	return "ZmCalItem";
};

// Consts

/**
 * Defines the "new" mode.
 */
ZmCalItem.MODE_NEW					    = "NEW"; // Changing those constants from numbers to strings to be easier for debugging. I could not deal with 2,3 etc anymore.
/**
 * Defines the "edit" mode.
 */
ZmCalItem.MODE_EDIT					    = "EDIT";

/**
 * Defines the "copy single instance" mode.
 */
ZmCalItem.MODE_COPY_SINGLE_INSTANCE	    = "COPY_INST";

/**
 * Defines the "edit single instance" mode.
 */
ZmCalItem.MODE_EDIT_SINGLE_INSTANCE	    = "EDIT_INST";
/**
 * Defines the "edit series" mode.
 */
ZmCalItem.MODE_EDIT_SERIES			    = "EDIT_SER";
/**
 * Defines the "delete" mode.
 */
ZmCalItem.MODE_DELETE				    = "DELETE";
/**
 * Defines the "delete instance" mode.
 */
ZmCalItem.MODE_DELETE_INSTANCE		    = "DELETE_INST";
/**
 * Defines the "delete series" mode.
 */
ZmCalItem.MODE_DELETE_SERIES		    = "DELETE_SER";
/**
 * Defines the "new from quick" mode.
 */
ZmCalItem.MODE_NEW_FROM_QUICKADD 	    = "NEW_FROM_QUICK";
/**
 * Defines the "get" mode.
 */
ZmCalItem.MODE_GET					    = "GET";
/**
 * Defines the "forward" mode.
 */
ZmCalItem.MODE_FORWARD				    = "FORWARD";
/**
 * Defines the "forward single instance" mode.
 */
ZmCalItem.MODE_FORWARD_SINGLE_INSTANCE	= "FORWARD_INST";
/**
 * Defines the "forward series" mode.
 */
ZmCalItem.MODE_FORWARD_SERIES			= "FORWARD_SER";
/**
 * Defines the "forward" mode.
 */
ZmCalItem.MODE_FORWARD_INVITE			= "FORWARD_INV";
/**
 * Defines the "propose" mode.
 */
ZmCalItem.MODE_PROPOSE_TIME 			= "PROPOSE_TIME";

/**
 * Defines the "purge" (delete from trash) mode.
 */
ZmCalItem.MODE_PURGE 					= 15; //keeping this and the last one as 15 as I am not sure if it's a bug or intentional that they are the same

/**
 * Defines the "last" mode index constant.
 */
ZmCalItem.MODE_LAST					    = 15;

ZmCalItem.FORWARD_MAPPING = {};
ZmCalItem.FORWARD_MAPPING[ZmCalItem.MODE_FORWARD]                   = ZmCalItem.MODE_EDIT;
ZmCalItem.FORWARD_MAPPING[ZmCalItem.MODE_FORWARD_SINGLE_INSTANCE]   = ZmCalItem.MODE_EDIT_SINGLE_INSTANCE;
ZmCalItem.FORWARD_MAPPING[ZmCalItem.MODE_FORWARD_SERIES]            = ZmCalItem.MODE_EDIT_SERIES;
ZmCalItem.FORWARD_MAPPING[ZmCalItem.MODE_FORWARD_INVITE]            = ZmCalItem.MODE_EDIT;

/**
 * Defines the "low" priority.
 */
ZmCalItem.PRIORITY_LOW				= 9;
ZmCalItem.PRIORITY_LOW_RANGE		= [6,7,8,9];

/**
 * Defines the "normal" priority.
 */
ZmCalItem.PRIORITY_NORMAL			= 5;
ZmCalItem.PRIORITY_NORMAL_RANGE		= [0,5];
/**
 * Defines the "high" priority.
 */
ZmCalItem.PRIORITY_HIGH				= 1;
ZmCalItem.PRIORITY_HIGH_RANGE		= [1,2,3,4];

/**
 * Defines the "chair" role.
 */
ZmCalItem.ROLE_CHAIR				= "CHA";
/**
 * Defines the "required" role.
 */
ZmCalItem.ROLE_REQUIRED				= "REQ";
/**
 * Defines the "optional" role.
 */
ZmCalItem.ROLE_OPTIONAL				= "OPT";
/**
 * Defines the "non-participant" role.
 */
ZmCalItem.ROLE_NON_PARTICIPANT		= "NON";

ZmCalItem.SERVER_WEEK_DAYS			= ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

ZmCalItem.ATTACHMENT_CHECKBOX_NAME	= "__calAttCbox__";
ZmCalItem.ATT_LINK_IMAGE            = "mainImage";
ZmCalItem.ATT_LINK_MAIN			    = "main";
ZmCalItem.ATT_LINK_DOWNLOAD		    = "download";

/**
 * Defines "minutes "reminder units.
 */
ZmCalItem.REMINDER_UNIT_MINUTES     = "minutes";
/**
 * Defines "hours" reminder units.
 */
ZmCalItem.REMINDER_UNIT_HOURS       = "hours";
/**
 * Defines "days" reminder units.
 */
ZmCalItem.REMINDER_UNIT_DAYS        = "days";
/**
 * Defines "weeks" reminder units.
 */
ZmCalItem.REMINDER_UNIT_WEEKS       = "weeks";
/**
 * Defines "none" reminder.
 */
ZmCalItem.REMINDER_NONE             = "none";

// Alarm actions
ZmCalItem.ALARM_DISPLAY	= "DISPLAY";
ZmCalItem.ALARM_EMAIL	= "EMAIL";
ZmCalItem.ALARM_DEVICE_EMAIL = "DEVICE_EMAIL"; // SMS

// Duration Checks
ZmCalItem.MSEC_LIMIT_PER_WEEK  = AjxDateUtil.MSEC_PER_DAY * 7;
// Because recurrences can be on the first (or 2nd, 3rd...) Day-of-week of a
// month, play it safe and make the limit 5 weeks
ZmCalItem.MSEC_LIMIT_PER_MONTH = AjxDateUtil.MSEC_PER_DAY * 7 * 5;
ZmCalItem.MSEC_LIMIT_PER_YEAR  = AjxDateUtil.MSEC_PER_DAY * 366;


// Getters

/**
 * @private
 */
ZmCalItem.prototype.getCompNum			= function() { return this.compNum || "0"; };

/**
 * Gets the folder.
 * 
 * @return	{Object}	the folder
 */
ZmCalItem.prototype.getFolder			= function() { };						// override if necessary

/**
 * Gets the organizer.
 * 
 * @return	{String}	the organizer
 */
ZmCalItem.prototype.getOrganizer 		= function() { return this.organizer || ""; };

/**
 * Gets the organizer name.
 *
 * @return	{String}	the organizer name
 */
ZmCalItem.prototype.getOrganizerName 	= function() { return this.organizerName; };


/**
 * Gets the sent by.
 * 
 * @return	{String}	the sent by
 */
ZmCalItem.prototype.getSentBy           = function() { return this.sentBy || ""; };

/**
 * Gets the original start date.
 * 
 * @return	{Date}	the original start date
 */
ZmCalItem.prototype.getOrigStartDate 	= function() { return this._origStartDate || this.startDate; };

/**
 * Gets the original start time.
 * 
 * @return	{Date}	the original start time
 */
ZmCalItem.prototype.getOrigStartTime 	= function() { return this.getOrigStartDate().getTime(); };

/**
 * Gets the original end date.
 *
 * @return	{Date}	the original end date
 */
ZmCalItem.prototype.getOrigEndDate 	= function() { return this._origEndDate || this.endDate; };

/**
 * Gets the original end time.
 *
 * @return	{Date}	the original end time
 */
ZmCalItem.prototype.getOrigEndTime 	= function() { return this.getOrigEndDate().getTime(); };

/**
 * Gets the original calendar item.
 *
 * @return	{ZmCalItem}	the original calendar item
 */
ZmCalItem.prototype.getOrig 	        = function() { return this._orig; };

/**
 * Gets the original timezone.
 * 
 * @return	{Date}	the original timezone
 */
ZmCalItem.prototype.getOrigTimezone     = function() { return this._origTimezone || this.timezone; };

/**
 * Gets the recurrence "blurb".
 * 
 * @return	{String}	the recurrence blurb
 * @see		ZmRecurrence
 */
ZmCalItem.prototype.getRecurBlurb		= function() { return this._recurrence.getBlurb(); };

/**
 * Gets the recurrence.
 * 
 * @return	{ZmRecurrence}	the recurrence
 */
ZmCalItem.prototype.getRecurrence		= function() { return this._recurrence; };

/**
 * Gets the recurrence "type".
 * 
 * @return	{String}	the recurrence type
 * @see		ZmRecurrence
 */
ZmCalItem.prototype.getRecurType		= function() { return this._recurrence.repeatType; };

/**
 * Gets the timezone.
 * 
 * @return	{AjxTimezone}	the timezone
 */
ZmCalItem.prototype.getTimezone         = function() { return this.timezone; };

/**
 * Gets the summary.
 * 
 * @param	{Boolean}	isHtml		<code>true</code> to return as html
 * @return	{String}	the summary
 */
ZmCalItem.prototype.getSummary			= function(isHtml) { };					// override if necessary

/**
 * Gets the tool tip.
 * 
 * @param	{ZmController}		controller		the controller
 * @return	{String}	the tool tip
 */
ZmCalItem.prototype.getToolTip			= function(controller) { };				// override if necessary
/**
 * Checks if this item has a custom recurrence.
 * 
 * @return	{Boolean}	<code>true</code> for a custom recurrence
 */
ZmCalItem.prototype.isCustomRecurrence 	= function() { return this._recurrence.repeatCustom == "1" || this._recurrence.repeatEndType != "N"; };
/**
 * Checks if this item is an organizer.
 * 
 * @return	{Boolean}	<code>true</code> for an organizer
 */
ZmCalItem.prototype.isOrganizer 		= function() { return (typeof(this.isOrg) === 'undefined') || (this.isOrg == true); };
/**
 * Checks if this item is recurring.
 * 
 * @return	{Boolean}	<code>true</code> for recurrence
 */
ZmCalItem.prototype.isRecurring 		= function() { return (this.recurring || (this._rawRecurrences != null)); };
/**
 * Checks if this item has attachments.
 * 
 * @return	{Boolean}	<code>true</code> if this item has attachments
 */
ZmCalItem.prototype.hasAttachments 		= function() { return this.getAttachments() != null; };
/**
 * Checks if this item has attendee type.
 * 
 * @return	{Boolean}	always returns <code>false</code>; override if necessary
 */
ZmCalItem.prototype.hasAttendeeForType	= function(type) { return false; };		// override if necessary
/**
 * Checks if this item has attendees.
 * 
 * @return	{Boolean}	always returns <code>false</code>; override if necessary
 */
ZmCalItem.prototype.hasAttendees    	= function() { return false; }; 		// override if necessary
/**
 * Checks if this item has person attendees.
 * 
 * @return	{Boolean}	always returns <code>false</code>; override if necessary
 */
ZmCalItem.prototype.hasPersonAttendees	= function() { return false; };			// override if necessary

// Setters
/**
 * Sets all day event.
 * 
 * @param	{Boolean}	isAllDay	<code>true</code> for an all day event
 */
ZmCalItem.prototype.setAllDayEvent 		= function(isAllDay) 	{ this.allDayEvent = isAllDay ? "1" : "0"; };
/**
 * Sets the name.
 * 
 * @param	{String}	newName			the name
 */
ZmCalItem.prototype.setName 			= function(newName) 	{ this.name = newName; };
/**
 * Sets the organizer.
 * 
 * @param	{String}	organizer			the organizer
 */
ZmCalItem.prototype.setOrganizer 		= function(organizer) 	{ this.organizer = organizer != "" ? organizer : null; };
/**
 * Sets the repeat type.
 * 
 * @param	{constant}	repeatType			the repeat type
 */
ZmCalItem.prototype.setRecurType		= function(repeatType)	{ this._recurrence.repeatType = repeatType; };
/**
 * Sets the item type.
 * 
 * @param	{constant}	newType			the item type
 */
ZmCalItem.prototype.setType 			= function(newType) 	{ this.type = newType; };
/**
 * Sets the original timezone.
 * 
 * @param	{Object}	timezone		the timezone
 */
ZmCalItem.prototype.setOrigTimezone     = function(timezone)    { this._origTimezone = timezone; };

/**
 * Sets the folder id.
 * 
 * @param	{String}	folderId		the folder id
 */
ZmCalItem.prototype.setFolderId =
function(folderId) {
	this.folderId = folderId || ZmOrganizer.ID_CALENDAR;
};

/**
 * Gets the "local" folder id even for remote folders. Otherwise, just use <code>this.folderId</code>.
 * 
 * @return	{ZmFolder|String}		the folder or folder id
 */
ZmCalItem.prototype.getLocalFolderId =
function() {
	var fid = this.folderId;
	if (this.isShared()) {
		var folder = appCtxt.getById(this.folderId);
		if (folder)
			fid = folder.id;
	}
	return fid;
};

/**
 * Sets the end date.
 * 
 * @param	{Date}	endDate		the end date
 * @param	{Boolean}	keepCache	if <code>true</code>, keep the cache; <code>false</code> to reset the cache
 */
ZmCalItem.prototype.setEndDate =
function(endDate, keepCache) {
    if (this._origEndDate == null && this.endDate != null && this.endDate != "") {
        this._origEndDate = new Date(this.endDate.getTime());
    }
	this.endDate = new Date(endDate instanceof Date ? endDate.getTime(): endDate);
	if (!keepCache)
		this._resetCached();
};

/**
 * Sets the start date.
 * 
 * @param	{Date}	startDate		the start date
 * @param	{Boolean}	keepCache	if <code>true</code>, keep the cache; <code>false</code> to reset the cache
 */
ZmCalItem.prototype.setStartDate =
function(startDate, keepCache) {
	if (this._origStartDate == null && this.startDate != null && this.startDate != "") {
		this._origStartDate = new Date(this.startDate.getTime());
	}
	this.startDate = new Date(startDate instanceof Date ? startDate.getTime() : startDate);

	if (!keepCache) {
		this._resetCached();
	}

	// recurrence should reflect start date
	if (this.recurring && this._recurrence) {
		this._recurrence.setRecurrenceStartTime(this.startDate.getTime());
	}
};

/**
 * Sets the timezone.
 * 
 * @param	{AjxTimezone}	timezone	the timezone
 * @param	{Boolean}	keepCache	if <code>true</code>, keep the cache; <code>false</code> to reset the cache
 */
ZmCalItem.prototype.setTimezone =
function(timezone, keepCache) {
	if (this._origTimezone == null) {
		this._origTimezone = timezone;
	}
	this.timezone = timezone;
	if (!keepCache) {
		this._resetCached();
	}
};

/**
 * Sets the end timezone.
 *
 * @param	{AjxTimezone}	timezone	the timezone
 */
ZmCalItem.prototype.setEndTimezone =
function(timezone) {
	if (this._origEndTimezone == null) {
		this._origEndTimezone = timezone;
	}
	this.endTimezone = timezone;
};

/**
 * Sets the view mode, and resets any other fields that should not be set for that view mode.
 * 
 * @param	{constant}	mode		the mode (see <code>ZmCalItem.MODE_</code> constants)
 */
ZmCalItem.prototype.setViewMode =
function(mode) {
	this.viewMode = mode || ZmCalItem.MODE_NEW;

	if (this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE)
		this._recurrence.repeatType = "NON";
};

/**
 * Gets the view mode
 */
ZmCalItem.prototype.getViewMode =
function(mode) {
	return this.viewMode;
};

/**
 * Gets the notes part. This method will walk the notesParts array looking for
 * the first part that matches given content type.
 * 
 * @param	{constant}	contentType		the content type (see {@link ZmMimeTable.TEXT_PLAIN})	
 * @return	{String}	the content
 * 
 * @see	ZmMimeTable
 */
ZmCalItem.prototype.getNotesPart =
function(contentType) {
	if (this.notesTopPart) {
		var ct = contentType || ZmMimeTable.TEXT_PLAIN;
		var content = this.notesTopPart.getContentForType(ct);

		// if requested content type not found, try the other
		if (!content) {
			if (ct == ZmMimeTable.TEXT_PLAIN) {
				var div = document.createElement("div");
				content = this.notesTopPart.getContentForType(ZmMimeTable.TEXT_HTML);
				div.innerHTML = content || "";
				var text = AjxStringUtil.convertHtml2Text(div);
				return text.substring(1); // above func prepends \n due to div
			} else if (ct == ZmMimeTable.TEXT_HTML) {
				content = AjxStringUtil.convertToHtml(this.notesTopPart.getContentForType(ZmMimeTable.TEXT_PLAIN));
			}
		}
		return content;
	} else {
		return this.fragment;
	}
};

/**
 * Gets the remote folder owner.
 * 
 * @return {String}	the "owner" of remote/shared item folder this item belongs to
 */
ZmCalItem.prototype.getRemoteFolderOwner =
function() {
	// bug fix #18855 - dont return the folder owner if moving betw. accounts
	var controller = AjxDispatcher.run("GetCalController");
	if (controller.isMovingBetwAccounts(this, this.folderId)) {
		return null;
	}

	var folder = this.getFolder();
	var owner = folder && folder.link && folder.owner;

    var acct = (!owner && appCtxt.multiAccounts && folder.getAccount());
	if (acct) {
		owner = acct.name;
	}
	return owner;
};

/**
 * Checks if the item is read-only.
 * 
 * @return	{Boolean}	<code>true</code> if the item is read-only
 */
ZmCalItem.prototype.isReadOnly =
function() {
	var folder = this.getFolder();

	if (appCtxt.multiAccounts) {
		var orgAcct = appCtxt.accountList.getAccountByEmail(this.organizer);
		var calAcct = appCtxt.accountList.getAccountByEmail(folder.getAccount().getEmail());
		if (orgAcct == calAcct) {
			return false;
		}
	}
   // TODO: Correct this method in order to return fasle for users with manager/admin rights
	return (!this.isOrganizer() || (folder.link && folder.isReadOnly()));
};

/**
 * Checks if the folder containing the item is read-only by the .
 *
 * @return	{Boolean}	<code>true</code> if the folder is read-only
 */
ZmCalItem.prototype.isFolderReadOnly =
function() {
	var folder = this.getFolder();
    return (folder && folder.isReadOnly());
};

/*
*   To check whether version has been ignored
* */
ZmCalItem.prototype.isVersionIgnored=function(){
    return this._ignoreVersion;
}

/*
*   Method to set _ignoreVersion as true when conflict arises and false otherwise.
*   If true, the next soap request wont be sent with revision related attributes like ms&rev.
* */
ZmCalItem.prototype.setIgnoreVersion=function(isIgnorable){
    this._ignoreVersion=isIgnorable;
}

/**
 * Resets the repeat weekly days.
 */
ZmCalItem.prototype.resetRepeatWeeklyDays =
function() {
	if (this.startDate) {
		this._recurrence.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[this.startDate.getDay()]];
	}
};

/**
 * Resets the repeat monthly day months list.
 */
ZmCalItem.prototype.resetRepeatMonthlyDayList =
function() {
	if (this.startDate) {
		this._recurrence.repeatMonthlyDayList = [this.startDate.getDate()];
	}
};

/**
 * Resets the repeat yearly months list.
 */
ZmCalItem.prototype.resetRepeatYearlyMonthsList =
function(mo) {
	this._recurrence.repeatYearlyMonthsList = mo;
};

/**
 * Resets the repeat custom day of week.
 */
ZmCalItem.prototype.resetRepeatCustomDayOfWeek =
function() {
	if (this.startDate) {
		this._recurrence.repeatCustomDayOfWeek = ZmCalItem.SERVER_WEEK_DAYS[this.startDate.getDay()];
	}
};

/**
 * Checks if the item is overlapping.
 * 
 * @param	{ZmCalItem}	other		the other item to check
 * @param	{Boolean}	checkFolder	<code>true</code> to check the folder id
 * @return	{Boolean}	<code>true</code> if the items overlap; <code>false</code> if the items do not overlap or the item folder ids do not match
 */
ZmCalItem.prototype.isOverlapping =
function(other, checkFolder) {
	if (checkFolder && this.folderId != other.folderId) { return false; }

	var tst = this.getStartTime();
	var tet = this.getEndTime();
	var ost = other.getStartTime();
	var oet = other.getEndTime();

	return (tst < oet) && (tet > ost);
};

/**
 * Checks if this item is in range.
 * 
 * @param	{Date}	startTime	the start range
 * @param	{Date}	endTime	the end range
 * @return	{Boolean}	<code>true</code> if the item is in range
 */
ZmCalItem.prototype.isInRange =
function(startTime, endTime) {
	var tst = this.getStartTime();
	var tet = this.getEndTime();
	return (tst < endTime && tet > startTime);
};

/**
 * Checks whether the duration of this item is valid.
 *
 * @return	{Boolean}	<code>true</code> if the item possess valid duration.
 */
ZmCalItem.prototype.isValidDuration =
function(){

    var startTime = this.getStartTime();
    var endTime = this.getEndTime();

    if(this.endTimezone && this.endTimezone!=this.timezone){
      var startOffset = AjxTimezone.getRule(this.timezone).standard.offset;
      var endOffset = AjxTimezone.getRule(this.endTimezone).standard.offset;

      startTime = startTime - (startOffset*60000);
      endTime = endTime - (endOffset*60000);
    }

    return (startTime<=endTime);

}
/**
 * Checks whether the duration of this item is valid with respect to the
 * recurrence period.  For example, if the item repeats daily, its duration
 * should not be longer than a day.
 *
 * This can get very complicated due to custom repeat rules.  So the
 * limitation is just set on the repeat type.  The purpose is to prevent
 * (as has happened) someone creating a repeating appt where they set the
 * duration to be the span the appt is in effect over a year instead of its
 * duration during the day.  For example, repeat daily, start = Jan 1 2014,
 * end = July 1 2014.   See Bug 87993.
 *
 * @return	{Boolean}	<code>true</code> if the item possess valid duration.
 */
ZmCalItem.prototype.isValidDurationRecurrence = function() {
	var valid     = true;
	var recurType = this.getRecurType();
	var duration  = this.getDuration();
	switch (recurType) {
		case ZmRecurrence.DAILY:   valid = duration <= AjxDateUtil.MSEC_PER_DAY;       break;
		case ZmRecurrence.WEEKLY:  valid = duration <= ZmCalItem.MSEC_LIMIT_PER_WEEK;  break;
		case ZmRecurrence.MONTHLY: valid = duration <= ZmCalItem.MSEC_LIMIT_PER_MONTH; break;
		case ZmRecurrence.YEARLY:  valid = duration <= ZmCalItem.MSEC_LIMIT_PER_YEAR;  break;
		default: break;
	}
	return valid;
}

/**
 * @private
 */
ZmCalItem.prototype.parseAlarmData =
function() {
	if (!this.alarmData) { return; }

	for (var i = 0; i < this.alarmData.length; i++) {
		var alarm = this.alarmData[i].alarm;
		if (alarm) {
			for (var j = 0; j < alarm.length; j++) {
				this.parseAlarm(alarm[j]);
			}
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype.parseAlarm =
function(tmp) {
	if (!tmp) { return; }

	var s, m, h, d, w;
	var trigger = tmp.trigger;
	var rel = (trigger && (trigger.length > 0)) ? trigger[0].rel : null;
    s = (rel && (rel.length > 0)) ? rel[0].s : null;
	m = (rel && (rel.length > 0)) ? rel[0].m : null;
	d = (rel && (rel.length > 0)) ? rel[0].d : null;
	h = (rel && (rel.length > 0)) ? rel[0].h : null;
	w = (rel && (rel.length > 0)) ? rel[0].w : null;

    this._reminderMinutes = -1;
	if (tmp.action == ZmCalItem.ALARM_DISPLAY) {
        if (s == 0) { // at time of event
            this._reminderMinutes = 0;
        }
		if (m != null) {
			this._reminderMinutes = m;
            this._origReminderUnits = ZmCalItem.REMINDER_UNIT_MINUTES;
		}
		if (h != null) {
			h = parseInt(h);
			this._reminderMinutes = h * 60;
            this._origReminderUnits = ZmCalItem.REMINDER_UNIT_HOURS;
		}
		if (d != null) {
			d = parseInt(d);
			this._reminderMinutes = d * 24 * 60;
            this._origReminderUnits = ZmCalItem.REMINDER_UNIT_DAYS;
		}
        if (w != null) {
			w = parseInt(w);
			this._reminderMinutes = w * 7 * 24 * 60;
            this._origReminderUnits = ZmCalItem.REMINDER_UNIT_WEEKS;
		}
	}
};

/**
 * Checks if the start date is in range.
 * 
 * @param	{Date}	startTime	the start time of the range
 * @param	{Date}	endTime		the end time of the range
 * @return {Boolean}	<code>true</code> if the start date of this item is within range
 */
ZmCalItem.prototype.isStartInRange =
function(startTime, endTime) {
	var tst = this.getStartTime();
	return (tst < endTime && tst >= startTime);
};

/**
 * Checks if the end date is in range.
 * 
 * @param	{Date}	startTime	the start time of the range
 * @param	{Date}	endTime		the end time of the range
 * @return {Boolean}	<code>true</code> if the end date of this item is within range
 */
ZmCalItem.prototype.isEndInRange =
function(startTime, endTime) {
	var tet = this.getEndTime();
	return (tet <= endTime && tet > startTime);
};

/**
 * Sets the date range.
 * 
 * @param	{Hash}	rangeObject		a hash of <code>startDate</code> and <code>endDate</code>
 * @param	{Object}	instance	not used
 * @param	{Object}	parentValue	not used
 * @param	{Object}	refPath	not used
 */
ZmCalItem.prototype.setDateRange =
function (rangeObject, instance, parentValue, refPath) {
	var s = rangeObject.startDate;
	var e = rangeObject.endDate;
	this.endDate.setTime(rangeObject.endDate.getTime());
	this.startDate.setTime(rangeObject.startDate.getTime());
};

/**
 * Gets the date range.
 * 
 * @param	{Object}	instance	not used
 * @param	{Object}	current		not used
 * @param	{Object}	refPath		not used
 * @return	{Hash}	a hash of <code>startDate</code> and <code>endDate</code>
 */
ZmCalItem.prototype.getDateRange =
function(instance, current, refPath) {
	return { startDate:this.startDate, endDate: this.endDate };
};

/**
 * Sets the attachments.
 * 
 * @param	{String}	ids		a comma delimited string of ids
 */
ZmCalItem.prototype.setAttachments =
function(ids) {
	this.attachments = [];

	if (ids && ids.length > 0) {
		var split = ids.split(',');
		for (var i = 0 ; i < split.length; i++) {
			this.attachments[i] = { id:split[i] };
		}
	}
};

/**
 * Gets the attachments.
 * 
 * @return	{Array}	an array of attachments or <code>null</code> for none
 */
ZmCalItem.prototype.getAttachments =
function() {
	var attachs = this.message ? this.message.attachments : null;
	if (attachs) {
		if (this._validAttachments == null) {
			this._validAttachments = [];
			for (var i = 0; i < attachs.length; ++i) {
				if (this.message.isRealAttachment(attachs[i]) || attachs[i].contentType == ZmMimeTable.TEXT_CAL) {
					this._validAttachments.push(attachs[i]);
				}
			}
		}
		return this._validAttachments.length > 0 ? this._validAttachments : null;
	}
	return null;
};

/**
 * Removes an attachment.
 * 
 * @param	{Object}	part	the attachment part to remove
 */
ZmCalItem.prototype.removeAttachment =
function(part) {
	if (this._validAttachments && this._validAttachments.length > 0) {
		for (var i = 0; i < this._validAttachments.length; i++) {
			if (this._validAttachments[i].part == part) {
				this._validAttachments.splice(i,1);
				break;
			}
		}
	}
};

/**
 * Gets the start hour in short date format.
 * 
 * @return	{String}	the start hour
 */
ZmCalItem.prototype.getShortStartHour =
function() {
	var formatter = AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT);
	return formatter.format(this.startDate);
};

/**
 * Gets the unique start date.
 * 
 * @return	{Date}	the start date
 */
ZmCalItem.prototype.getUniqueStartDate =
function() {
	if (this._uniqueStartDate == null && this.uniqStartTime) {
		this._uniqueStartDate = new Date(this.uniqStartTime);
	}
	return this._uniqueStartDate;
};

/**
 * Gets the unique end date.
 * 
 * @return	{Date}	the end date
 */
ZmCalItem.prototype.getUniqueEndDate =
function() {
	if (this._uniqueEndDate == null && this.uniqStartTime) {
		this._uniqueEndDate = new Date(this.uniqStartTime + this.getDuration());
	}
	return this._uniqueEndDate;
};

/**
 * Gets the details.
 * 
 * @param	{constant}	viewMode	the view mode
 * @param	{AjxCallback}	callback	the callback
 * @param	{AjxCallback}	errorCallback	the callback on error
 * @param	{Boolean}	ignoreOutOfDate		if <code>true</code>, ignore out of date items
 * @param	{Boolean}	noBusyOverlay		if <code>true</code>, no busy overlay
 * @param	{ZmBatchCommand}	batchCmd			set if part of a batch operation
 */
ZmCalItem.prototype.getDetails =
function(viewMode, callback, errorCallback, ignoreOutOfDate, noBusyOverlay, batchCmd) {
	var mode = viewMode || this.viewMode;

	var seriesMode = mode == ZmCalItem.MODE_EDIT_SERIES;
    var fetchSeriesMsg = (seriesMode && this.message && !this.message.seriesMode);
	if (this.message == null || fetchSeriesMsg) {
		var id = seriesMode ? (this.seriesInvId || this.invId || this.id) : this.invId;
		this.message = new ZmMailMsg(id);
		if (this._orig) {
			this._orig.message = this.message;
		}
		var respCallback = new AjxCallback(this, this._handleResponseGetDetails, [mode, this.message, callback]);
		var respErrorCallback = (!ignoreOutOfDate)
			? (new AjxCallback(this, this._handleErrorGetDetails, [mode, callback, errorCallback]))
			: errorCallback;

		var acct = appCtxt.isOffline && this.getFolder().getAccount();
		var params = {
			callback: respCallback,
			errorCallback: respErrorCallback,
			noBusyOverlay: noBusyOverlay,
			ridZ: (seriesMode ? null : this.ridZ),
			batchCmd: batchCmd,
			accountName: (acct && acct.name)
		};
		this.message.load(params);
	} else {
		this.setFromMessage(this.message, mode);
		if (callback) {
			callback.run();
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype.convertToLocalTimezone =
function() {
    var apptTZ = this.getTimezone();
    var localTZ = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    var sd = this.startDate;
    var ed = this.endDate;
    if(apptTZ != localTZ) {
        var offset1 = AjxTimezone.getOffset(AjxTimezone.DEFAULT, sd);
        var offset2 = AjxTimezone.getOffset(AjxTimezone.getClientId(apptTZ), sd);
        sd.setTime(sd.getTime() + (offset1 - offset2)*60*1000);
        ed.setTime(ed.getTime() + (offset1 - offset2)*60*1000);
        this.setTimezone(localTZ);
        this.setEndTimezone(localTZ);
    }
};


/**
 * @private
 */
ZmCalItem.prototype._handleResponseGetDetails =
function(mode, message, callback, result) {
	// msg content should be text, so no need to pass callback to setFromMessage()
	this.setFromMessage(message, mode);
    message.seriesMode = (mode == ZmCalItem.MODE_EDIT_SERIES);

    //overwrite proposed time
    if(this._orig && this._orig.proposedInvite) {
        var invite = this._orig.proposedInvite;
        var start = invite.getServerStartTime();
        var end = invite.getServerEndTime();
        if (start) this.setStartDate(AjxDateUtil.parseServerDateTime(start, true));
        if (end) this.setEndDate(AjxDateUtil.parseServerDateTime(end, true));

        //set timezone from proposed invite
        var tz = invite.getServerStartTimeTz();
        this.setTimezone(tz || AjxTimezone.getServerId(AjxTimezone.DEFAULT));

        // record whether the start/end dates are in UTC
        this.startsInUTC = start ? start.charAt(start.length-1) == "Z" : null;
        this.endsInUTC = end && start ? end.charAt(start.length-1) == "Z" : null;

        //set all the fields that are not generated in GetAppointmentResponse - accept proposal mode
        this.status = invite.components[0].status;

        //convert proposed invite timezone to local timezone
        this.convertToLocalTimezone();
        this.isAcceptingProposal = true;
    }
	if (callback) callback.run(result);
};

/**
 * @private
 */
ZmCalItem.prototype._handleErrorGetDetails =
function(mode, callback, errorCallback, ex) {
	if (ex.code == "mail.INVITE_OUT_OF_DATE") {
        var jsonObj = {},
            requestName = this._getRequestNameForMode(ZmCalItem.MODE_GET),
            request = jsonObj[requestName] = {
                _jsns : "urn:zimbraMail"
            },
            respCallback = new AjxCallback(this, this._handleErrorGetDetails2, [mode, callback, errorCallback]),
            params;

        request.id = this.id;
		params = {
			jsonObj: jsonObj,
			asyncMode: true,
			callback: respCallback,
			errorCallback: errorCallback
		};
		appCtxt.getAppController().sendRequest(params);
		return true;
	}
	if (ex.code == "account.ACCOUNT_INACTIVE") {
        var msg = ex.msg ? ex.msg.split(':') : null,
            acctEmailId = msg ? msg[1] : '',
            msgDlg = appCtxt.getMsgDialog();
        msgDlg.setMessage(AjxMessageFormat.format(ZmMsg.accountInactiveError, acctEmailId), DwtMessageDialog.CRITICAL_STYLE);
        msgDlg.popup();
		return true;
	}
	if (errorCallback) {
		return errorCallback.run(ex);
	}
	return false;
};

/**
 * @private
 */
ZmCalItem.prototype._handleErrorGetDetails2 =
function(mode, callback, errorCallback, result) {
	// Update invId and force a message reload
	var invite = this._getInviteFromError(result);
	this.invId = [this.id, invite.id].join("-");
	this.message = null;
	var ignoreOutOfDate = true;
	this.getDetails(mode, callback, errorCallback, ignoreOutOfDate);
};

/**
 * Sets the from message.
 * 
 * @param	{String}	message		the message
 * @param	{constant}	viewMode	the view mode
 * 
 * @private
 */
ZmCalItem.prototype.setFromMessage =
function(message, viewMode) {
	if (message == this._currentlyLoaded) { return; }

	if (message.invite) {
		this.isOrg = message.invite.isOrganizer();
		this.organizer = message.invite.getOrganizerEmail();
		this.organizerName = message.invite.getOrganizerName();
		this.sentBy = message.invite.getSentBy();
		this.name = message.invite.getName() || message.subject;
		this.isException = message.invite.isException();
        this.recurring =  message.invite.isRecurring();
        this.location = message.invite.getLocation();
        this.seq = message.invite.getSequenceNo();
        this.allDayEvent = message.invite.isAllDayEvent();
        if(message.invite.id) {
            this.invId = this.id + "-" + message.invite.id;
        }
		this._setTimeFromMessage(message, viewMode);
		this._setExtrasFromMessage(message);
		this._setRecurrence(message);
	}
	this._setNotes(message);
	this.getAttachments();

	this._currentlyLoaded = message;
};

/**
 * Sets the required data from saved response
 *
 * @param	{Object} result create/moify appt response
 */
ZmCalItem.prototype.setFromSavedResponse =
function(result) {
    this.invId = result.invId;
    if(this.message) {
        this.message.rev = result.rev;
        this.message.ms = result.ms;
    }

    if(this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE && !this.isException) {
        this.isException = true;
    }
};

/**
 * Sets the from mail message. This method gets called when a mail item
 * is dragged onto the item and we
 * need to load the mail item and parse the right parts to show in {@link ZmCalItemEditView}.
 * 
 * @param	{String}	message		the message
 * @param	{String}	subject		the subject
 * 
 * @private
 */
ZmCalItem.prototype.setFromMailMessage =
function(message, subject) {
	this.name = subject;
	this._setNotes(message);
	// set up message so attachments work
	this.message = message;
	this.invId = message.id;
};

/**
 * Sets the notes (text/plain).
 * 
 * @param	{String}	notes		the notes
 */
ZmCalItem.prototype.setTextNotes =
function(notes) {
	this.notesTopPart = new ZmMimePart();
	this.notesTopPart.setContentType(ZmMimeTable.TEXT_PLAIN);
	this.notesTopPart.setContent(notes);
};

/**
 * @private
 */
ZmCalItem.prototype._setTimeFromMessage =
function(message, viewMode) {
	// For instance of recurring appointment, start date is generated from unique
	// start time sent in appointment summaries. Associated message will contain
	// only the original start time.
	var start = message.invite.getServerStartTime();
	var end = message.invite.getServerEndTime();
	if (viewMode === ZmCalItem.MODE_EDIT_SINGLE_INSTANCE || viewMode === ZmCalItem.MODE_FORWARD_SINGLE_INSTANCE
			|| viewMode === ZmCalItem.MODE_COPY_SINGLE_INSTANCE) {
		var usd = this.getUniqueStartDate();
		if (usd) {
			this.setStartDate(usd);
		}

		var ued = this.getUniqueEndDate();
		if (ued) {
			if (this.isAllDayEvent() && viewMode === ZmCalItem.MODE_COPY_SINGLE_INSTANCE) {
				//special case - copying and all day event. The day it ends is a one too many days. Creating a copy gets confused otherwise and adds that day.
				ued.setDate(ued.getDate() - 1);
			}
			this.setEndDate(ued);
		}
		if (viewMode === ZmCalItem.MODE_COPY_SINGLE_INSTANCE) {
			viewMode = ZmCalItem.MODE_EDIT_SINGLE_INSTANCE; // kinda hacky - the copy mode has run its course. Now treat it like edit mode. Would be less impact.
		}
	}
	else {
		if (start) this.setStartDate(AjxDateUtil.parseServerDateTime(start));
		if (end) this.setEndDate(AjxDateUtil.parseServerDateTime(end));
	}

	// record whether the start/end dates are in UTC
	this.startsInUTC = start ? start.charAt(start.length-1) == "Z" : null;
	this.endsInUTC = end && start ? end.charAt(start.length-1) == "Z" : null;

	// record timezone
    var timezone;
	if (viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE || viewMode == ZmCalItem.MODE_DELETE_INSTANCE || viewMode == ZmCalItem.MODE_FORWARD_SINGLE_INSTANCE) {
        timezone = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
		this.setTimezone(timezone);
		this.setEndTimezone(timezone);
	}
	else {
		var serverId = !this.startsInUTC && message.invite.getServerStartTimeTz();
        timezone = serverId || AjxTimezone.getServerId(AjxTimezone.DEFAULT);
		this.setTimezone(timezone);
        var endServerId = !this.endsInUTC && message.invite.getServerEndTimeTz();
		this.setEndTimezone(endServerId || AjxTimezone.getServerId(AjxTimezone.DEFAULT));
		if(!this.startsInUTC && message.invite.getServerEndTimeTz()) this.setEndTimezone(message.invite.getServerEndTimeTz());
	}

	var tzrule = AjxTimezone.getRule(AjxTimezone.getClientId(this.getTimezone()));
	if (tzrule) {
		if (tzrule.aliasId) {
			tzrule = AjxTimezone.getRule(tzrule.aliasId) || tzrule;
		}
		this.setTimezone(tzrule.serverId);
	}

    tzrule = AjxTimezone.getRule(AjxTimezone.getClientId(this.endTimezone));
    if (tzrule) {
        if (tzrule.aliasId) {
            tzrule = AjxTimezone.getRule(tzrule.aliasId) || tzrule;
        }
        this.setEndTimezone(tzrule.serverId);
    }
};

/**
 * Override to add specific initialization but remember to call
 * the base implementation.
 *
 * @private
 */
ZmCalItem.prototype._setExtrasFromMessage =
function(message) {
    this._setAlarmFromMessage(message);
};

ZmCalItem.prototype._setAlarmFromMessage =
function(message) {
    this._reminderMinutes = -1;
	var alarm = message.invite.getAlarm();
	if (alarm) {
		for (var i = 0; i < alarm.length; i++) {
            var alarmInst = alarm[i];
            if (!alarmInst) continue;

            var action = alarmInst.action;
			if (action == ZmCalItem.ALARM_DISPLAY) {
				this.parseAlarm(alarmInst);
                // NOTE: No need to add a display alarm because it's
                // NOTE: added by default in the constructor.
                continue;
			}

            // NOTE: Both email and device-email/sms reminders appear
            // NOTE: as "EMAIL" alarms but we distinguish between them
            // NOTE: upon loading.
            if (action == ZmCalItem.ALARM_EMAIL) {
                var emails = alarmInst.at;
                if (!emails) continue;
                for (var j = 0; j < emails.length; j++) {
                    var email = emails[j].a;
                    if (email == appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS)) {
                        action = ZmCalItem.ALARM_DEVICE_EMAIL;
                    }
                    this.addReminderAction(action);
                }
            }
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype._setRecurrence =
function(message) {
	var recurRules = message.invite.getRecurrenceRules();

	if (recurRules)
		this._recurrence.parse(recurRules);

	if (this._recurrence.repeatWeeklyDays == null)
		this.resetRepeatWeeklyDays();

	if (this._recurrence.repeatMonthlyDayList == null)
		this.resetRepeatMonthlyDayList();
};

/**
 * We are removing starting 2 \n's for the bug 21823
 * XXX - this does not look very efficient
 * 
 * @private
 */
ZmCalItem.prototype._getCleanHtml2Text = 
function(dwtIframe) {
	var textContent;
	var idoc = dwtIframe ? dwtIframe.getDocument() : null;
	var body = idoc ? idoc.body : null;
	if (body) {
		var html = body.innerHTML.replace(/\n/ig, "");
		body.innerHTML = html.replace(/<!--.*-->/ig, "");
		var firstChild = body.firstChild;
		var removeN = (firstChild && firstChild.tagName && firstChild.tagName.toLocaleLowerCase() == "p");
		textContent = AjxStringUtil.convertHtml2Text(body);
		if (removeN) {
			textContent = textContent.replace(/\n\n/i, "");
		}
	}
	return textContent;
};

/**
 * @private
 */
ZmCalItem.prototype._setNotes =
function(message) {

    if(!(message.isZmMailMsg)) { return; }
	this.notesTopPart = new ZmMimePart();

	var htmlContent = message.getBodyContent(ZmMimeTable.TEXT_HTML);
	if (htmlContent) {
		htmlContent = htmlContent.replace(/<title\s*>.*\/title>/ig,"");
		if (!this._includeEditReply) {
			htmlContent = this._trimNotesSummary(htmlContent, true);
		}
	}

	if (htmlContent) {
		// create a temp iframe to create a proper DOM tree
		var params = {parent:appCtxt.getShell(), hidden:true, html:htmlContent};
		var textContent = message.getInviteDescriptionContentValue(ZmMimeTable.TEXT_PLAIN);
		if (!textContent) { //only go through this pain if textContent is somehow not available from getInviteDescriptionContentValue (no idea if this could happen).
			var dwtIframe = new DwtIframe(params);
			textContent = this._getCleanHtml2Text(dwtIframe);
			// bug: 23034 this hidden iframe under shell is adding more space
			// which breaks calendar column view
			var iframe = dwtIframe.getIframe();
			if (iframe && iframe.parentNode) {
				iframe.parentNode.removeChild(iframe);
			}
			delete dwtIframe;
		}

        // create two more mp's for text and html content types
		var textPart = new ZmMimePart();
		textPart.setContentType(ZmMimeTable.TEXT_PLAIN);
		textPart.setContent(textContent);

		var htmlPart = new ZmMimePart();
		htmlPart.setContentType(ZmMimeTable.TEXT_HTML);
		htmlPart.setContent(htmlContent);

		this.notesTopPart.setContentType(ZmMimeTable.MULTI_ALT);
		this.notesTopPart.children.add(textPart);
		this.notesTopPart.children.add(htmlPart);
	} else {
		var textContent = message.getBodyContent(ZmMimeTable.TEXT_PLAIN);
		if (!this._includeEditReply) {
			textContent = this._trimNotesSummary(textContent);
		}

        // The last content type is updated based on message's content type, it takes care of text/plain or text/html based on their availability
        var mimeContentType = this.isTextPartPresent(message) ? ZmMimeTable.TEXT_PLAIN : message._lastContentType;

		this.notesTopPart.setContentType(mimeContentType);
		this.notesTopPart.setContent(textContent);
	}
};

/**
 * Gets the mail notification option.
 * 
 * @return	{Boolean}	<code>true</code> if the mail notification is set; <code>false</code> otherwise
 */
ZmCalItem.prototype.getMailNotificationOption =
function() {
    return this._sendNotificationMail;
};

/**
 * Sets the mail notification option.
 * 
 * @param	{Boolean}	sendNotificationMail	<code>true</code> to set the mail notification
 */
ZmCalItem.prototype.setMailNotificationOption =
function(sendNotificationMail) {
    this._sendNotificationMail = sendNotificationMail;    
};

/**
 * Sets the exception details to request
 *
 * @param	{Element}	comp	comp element of request object
 */
ZmCalItem.prototype.addExceptionDetails =
function(comp) {
    var exceptId = comp.exceptId = {},
        allDay = this._orig ? this._orig.allDayEvent : this.allDayEvent,
        timezone,
        sd;

    if (allDay != "1") {
        sd = AjxDateUtil.getServerDateTime(this.getOrigStartDate(), this.startsInUTC);
        // bug fix #4697 (part 2)
        timezone = this.getOrigTimezone();
        if (!this.startsInUTC && timezone) {
            exceptId.tz = timezone;
        }
        exceptId.d = sd;
    }
    else {
        sd = AjxDateUtil.getServerDate(this.getOrigStartDate());
        exceptId.d = sd;
    }
};

/**
 * Saves the item.
 * 
 * @param {String}	attachmentId 		the id of the already uploaded attachment
 * @param {AjxCallback}		callback 			the callback triggered once request for appointment save is complete
 * @param {AjxCallback}		errorCallback		the callback triggered if error during appointment save request
 * @param {Array}	notifyList 		the optional sublist of attendees to be notified (if different from original list of attendees)
*/
ZmCalItem.prototype.save =
function(attachmentId, callback, errorCallback, notifyList) {
	var needsExceptionId = false,
        jsonObj = {},
        requestName = this._getRequestNameForMode(this.viewMode, this.isException),
        request = jsonObj[requestName] = {
            _jsns : "urn:zimbraMail"
        },
        accountName,
        invAndMsg,
        comp;

	if (this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE &&
		!this.isException)
	{
		this._addInviteAndCompNum(request);
		needsExceptionId = true;
	}
	else if (this.viewMode == ZmCalItem.MODE_EDIT ||
			 this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE || 
			 this.viewMode == ZmCalItem.MODE_EDIT_SERIES)
	{
		this._addInviteAndCompNum(request);
		needsExceptionId = this.isException;
	}

	accountName = this.getRemoteFolderOwner();
	invAndMsg = this._setRequestAttributes(request, attachmentId, notifyList, accountName);

	comp = invAndMsg.inv.comp[0];
	if (needsExceptionId) {
        this.addExceptionDetails(comp);
	} else {
		// set recurrence rules for appointment (but not for exceptions!)
		this._recurrence.setJson(comp);
	}

	//set alarm data
	this._setAlarmData(comp);

	this._sendRequest(null, accountName, callback, errorCallback, jsonObj, requestName);
};

ZmCalItem.prototype._setAlarmData =
function(comp) {

	var useAbs = this._useAbsoluteReminder,
        time = useAbs ? this._reminderAbs : this._reminderMinutes;

    if (time == null || time === -1) {
        return;
    }

    for (var i = 0, len = this.alarmActions.size(); i < len; i++) {
		var email = null;
		var action = this.alarmActions.get(i);
		if (action == ZmCalItem.ALARM_EMAIL) {
			email = appCtxt.get(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS);
			if (!email) {
                continue;
            }
		}
        if (action == ZmCalItem.ALARM_DEVICE_EMAIL) {
            email = appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS);
            if (!email) {
                continue;
            }
            // NOTE: treat device email alarm as a standard email alarm
            action = ZmCalItem.ALARM_EMAIL;
        }
		var alarms = comp.alarm = comp.alarm || [];
		var alarm = {action: action};
		alarms.push(alarm);
		var trigger = alarm.trigger = {};
		this._setReminderUnits(trigger, time);
		this._addXPropsToAlarm(alarm);
		if (email) {
			alarm.at = {a: email};
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype._setReminderUnits =
function(trigger, time) {
	time = time || 0;
	var useAbs = this._useAbsoluteReminder,
        rel = trigger[useAbs ? "abs" : "rel"] = {};
	if (useAbs) {
		rel.d = time;
	}
	else {
		rel.m = time;
		//default option is to remind before appt start
		rel.related = "START";
		rel.neg = "1";
	}
};

/**
 * @private
 */
ZmCalItem.prototype._addXPropsToAlarm =
function(alarmNode) {
	if (!this.alarmData) {
        return;
    }
	var alarmData = (this.alarmData && this.alarmData.length > 0)? this.alarmData[0] : null,
	    alarm = alarmData ? alarmData.alarm : null,
	    alarmInst = (alarm && alarm.length > 0) ? alarm[0] : null;

    this._setAlarmXProps(alarmInst, alarmNode);
};

/**
 * @private
 */
ZmCalItem.prototype._setAlarmXProps =
function(alarmInst, alarmNode)  {
    var xprops = (alarmInst && alarmInst.xprop) ? alarmInst.xprop : null,
        i,
        x,
        xprop;

    if (!xprops) {
        return;
    }
    // bug 28924: preserve x props
    xprops = (xprops instanceof Array) ? xprops : [xprops];

    for (i = 0; i < xprops.length; i++) {
        xprop = xprops[i];
        if (xprop && xprop.name) {
            x = alarmNode.xprop = {};
            x.name = xprop.name;
            if (xprop.value != null) {
                x.value = xprop.value;
            }
            this._addXParamToRequest(x, xprop.xparam);
        }
    }
};

/**
 * Sets reminder minutes.
 * 
 * @param	{int}	minutes		the minutes
 */
ZmCalItem.prototype.setReminderMinutes =
function(minutes) {
	this._reminderMinutes = minutes;
};

/**
 * Sets the reminder units
 * 
 * @param	{int}	reminderValue		the reminder value
 * @param	{int}	reminderUnits		the reminder units
 */
ZmCalItem.prototype.setReminderUnits =
function(reminderValue, reminderUnits, sendEmail) {
    if (!reminderValue) {
        this._reminderMinutes = 0;
        return;
    }
    reminderValue = parseInt(reminderValue + "");
	this._reminderMinutes = ZmCalendarApp.convertReminderUnits(reminderValue, reminderUnits);
	this._reminderSendEmail = sendEmail;
};

/**
 * Adds the given action to this appt's reminders. A type of action can only be added once.
 *
 * @param {constant}	action		alarm action
 */
ZmCalItem.prototype.addReminderAction =
function(action) {
	this.alarmActions.add(action, null, true);
};

/**
 * Removes the given action from this appt's reminders.
 *
 * @param {constant}	action		alarm action
 */
ZmCalItem.prototype.removeReminderAction =
function(action) {
	this.alarmActions.remove(action);
};

/**
 * Deletes/cancels appointment/invite
 *
 * @param {int}	mode		designated what kind of delete op is this?
 * @param {ZmMailMsg}		msg				the message to be sent in lieu of delete
 * @param {AjxCallback}		callback			the callback to trigger after delete
 * @param {AjxCallback}		errorCallback	the error callback to trigger
 * @param {ZmBatchCommand}	batchCmd		set if part of a batch operation
 */
ZmCalItem.prototype.cancel =
function(mode, msg, callback, errorCallback, batchCmd) {
	this.setViewMode(mode);
	if (msg) {
		// REVISIT: We explicitly set the bodyParts of the message b/c
		// ZmComposeView#getMsg only sets topPart on new message that's returned.
		// And ZmCalItem#_setNotes calls ZmMailMsg#getBodyPart.
		var bodyParts = [];
		var childParts = (msg._topPart.contentType == ZmMimeTable.MULTI_ALT)
			? msg._topPart.children.getArray()
			: [msg._topPart];
		for (var i = 0; i < childParts.length; i++) {
			bodyParts.push(childParts[i]);
		}
		msg.setBodyParts(bodyParts);
		this._setNotes(msg);
		this._doCancel(mode, callback, msg, batchCmd);
	} else {
		// To get the attendees for this appointment, we have to get the message.
		var respCallback = new AjxCallback(this, this._doCancel, [mode, callback, null, batchCmd]);
		var cancelErrorCallback = new AjxCallback(this, this._handleCancelError, [mode, callback, errorCallback]);
		if (this._blobInfoMissing && mode != ZmCalItem.MODE_DELETE_SERIES) {
			this.showBlobMissingDlg();		
		} else {
			this.getDetails(null, respCallback, cancelErrorCallback);
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype.showBlobMissingDlg =
function() {
	var msgDialog = appCtxt.getMsgDialog();
	msgDialog.setMessage(ZmMsg.apptBlobMissing, DwtMessageDialog.INFO_STYLE);
	msgDialog.popup();
};

/**
 * @private
 */
ZmCalItem.prototype._handleCancelError = 
function(mode, callback, errorCallback, ex) {

	if (ex.code == "mail.NO_SUCH_BLOB") {
 		//bug: 19033, cannot delete instance of appt with missing blob info
 		if (this.isRecurring() && mode != ZmCalItem.MODE_DELETE_SERIES) {
			this._blobInfoMissing = true;
			this.showBlobMissingDlg();
			return true;
 		} else {
	 		this._doCancel(mode, callback, this.message);
 		}
 		return true;
 	}
	
	if (errorCallback) {
		return errorCallback.run(ex);
	}

	return false;
};

/**
 * @private
 */
ZmCalItem.prototype.setCancelFutureInstances =
function(cancelFutureInstances) {
    this._cancelFutureInstances = cancelFutureInstances;    
};

ZmCalItem.prototype._sendCancelMsg =
function(callback){
    this.save(null, callback);
};

/**
 * @private
 */
ZmCalItem.prototype._doCancel =
function(mode, callback, msg, batchCmd, result) {
    var folderId = this.getFolder().nId,
        jsonObj = {},
        requestName,
        request,
        action,
        accountName = this.getRemoteFolderOwner(),
        recurrence,
        untilDate,
        inst,
        allDay,
        format,
        clientId,
        m,
        e,
        i,
        j,
        type,
        vector,
        count,
        addr,
        subject,
        mailFromAddress,
        isOrganizer;

    if (folderId == ZmOrganizer.ID_TRASH) {
		mode = ZmCalItem.MODE_PURGE;
        requestName = this._getRequestNameForMode(mode);
        request = jsonObj[requestName] = {
            _jsns : "urn:zimbraMail"
        };
        action = request.action = {};
		action.op = "delete";
		action.id = this.id;
		if (batchCmd) {
			batchCmd.addRequestParams(jsonObj, callback);
		} else {
			this._sendRequest(null, accountName, callback, null, jsonObj, requestName);
		}
	}
    else {
	    if (mode == ZmCalItem.MODE_DELETE_SERIES && this._cancelFutureInstances && this.getOrigStartDate().getTime() != this.getStartTime()) {
	
	        recurrence = this._recurrence;
	        untilDate = new Date(this.getOrigStartDate().getTime());
	        untilDate.setTime(untilDate.getTime() - AjxDateUtil.MSEC_PER_DAY);
	        recurrence.repeatEndDate = untilDate;
	        recurrence.repeatEndType = "D";
	
	        this.viewMode = ZmCalItem.MODE_EDIT_SERIES;
	        this._sendCancelMsg(callback);
	        return;
	    }
		
		if (mode == ZmCalItem.MODE_DELETE ||
			mode == ZmCalItem.MODE_DELETE_SERIES ||
			mode == ZmCalItem.MODE_DELETE_INSTANCE)
		{
            requestName = this._getRequestNameForMode(mode);
            request = jsonObj[requestName] = {
                _jsns : "urn:zimbraMail"
            };

			this._addInviteAndCompNum(request);

			// Exceptions should be treated as instances (bug 15817)
			if (mode == ZmCalItem.MODE_DELETE_INSTANCE || this.isException) {
                request.s = this.getOrigStartTime();
				inst = request.inst = {};
				allDay = this.isAllDayEvent();
				format = allDay ? AjxDateUtil.getServerDate : AjxDateUtil.getServerDateTime;
				inst.d = format(this.getOrigStartDate());
				if (!allDay && this.timezone) {
					inst.tz = this.timezone;

					clientId = AjxTimezone.getClientId(this.timezone);
					ZmTimezone.set(request, clientId, null, true);
				}
			}
            m = request.m = {};
            e = m.e = [];
            isOrganizer = this.isOrganizer();
            if (isOrganizer) {
                if (!this.inviteNeverSent) {
                    // NOTE: We only use the explicit list of addresses if sending via
                    //       a message compose.
                    if (msg) {
                        for (i = 0; i < ZmMailMsg.ADDRS.length; i++) {
                            type = ZmMailMsg.ADDRS[i];

                            // if on-behalf-of, dont set the from address and
                            // don't set the reset-from (only valid when receiving a message)
                            if ((accountName && type == AjxEmailAddress.FROM) ||
                                (type == AjxEmailAddress.RESENT_FROM)) {
                                continue;
                            }

                            vector = msg.getAddresses(type);
                            count = vector.size();
                            for (j = 0; j < count; j++) {
                                addr = vector.get(j);
                                e.push({
                                    a: addr.getAddress(),
                                    t: AjxEmailAddress.toSoapType[type]
                                });
                            }
                        }

                        // set from address to on-behalf-of if applicable
                        if (accountName) {
                            e.push({
                                a: accountName,
                                t: AjxEmailAddress.toSoapType[AjxEmailAddress.FROM]
                            });
                        }
                    }
                    else {
                        this._addAttendeesToRequest(null, m, null, accountName);
                    }
                }
                mailFromAddress = this.getMailFromAddress();
                if (mailFromAddress) {
                    e.push({
                        a : mailFromAddress,
                        t : AjxEmailAddress.toSoapType[AjxEmailAddress.FROM]
                    });
                }
            }
	        subject = (msg && msg.subject) ? msg.subject : ([ZmMsg.cancelled, ": ", this.name].join(""));
            m.su = subject;
			this._addNotesToRequest(m, true);

			if (batchCmd) {
				batchCmd.addRequestParams(jsonObj, callback);
			}
            else {
				this._sendRequest(null, accountName, callback, null, jsonObj, requestName);
			}
		}
        else {
			if (callback) callback.run();
		}
	}
};

/**
 * Gets the mail from address.
 * 
 * @return	{String}	the address
 */
ZmCalItem.prototype.getMailFromAddress =
function() {
    var mailFromAddress = appCtxt.get(ZmSetting.MAIL_FROM_ADDRESS);
    if(mailFromAddress) {
        return (mailFromAddress instanceof Array) ? mailFromAddress[0] : mailFromAddress;
    }
};

// Returns canned text for meeting invites.
// - Instances of recurring meetings should send out information that looks very
//   much like a simple appointment.
/**
 * Gets the summary as text.
 * 
 * @return	{String}	the summary
 */
ZmCalItem.prototype.getTextSummary =
function() {
	return this.getSummary(false);
};

/**
 * Gets the summary as HTML.
 * 
 * @return	{String}	the summary
 */
ZmCalItem.prototype.getHtmlSummary =
function() {
	return this.getSummary(true);
};



// Private / Protected methods

/**
 * @private
 */
ZmCalItem.prototype._getTextSummaryTime =
function(isEdit, fieldstr, extDate, start, end, hasTime) {
	var showingTimezone = appCtxt.get(ZmSetting.CAL_SHOW_TIMEZONE);

	var buf = [];
	var i = 0;

	if (extDate) {
		buf[i++] = AjxDateUtil.longComputeDateStr(extDate);
		buf[i++] = ", ";
	}
	if (this.isAllDayEvent()) {
		buf[i++] = ZmMsg.allDay;
	} else {
		var formatter = AjxDateFormat.getTimeInstance();
		if (start)
			buf[i++] = formatter.format(start);
		if (start && end)
			buf[i++] = " - ";
		if (end)
			buf[i++] = formatter.format(end);

		if (showingTimezone) {
			buf[i++] = " ";
			buf[i++] = AjxTimezone.getLongName(AjxTimezone.getClientId(this.timezone));
		}
	}
	// NOTE: This relies on the fact that setModel creates a clone of the
	//		 appointment object and that the original object is saved in
	//		 the clone as the _orig property.
	if (isEdit && ((this._orig && this._orig.isAllDayEvent() != this.isAllDayEvent()) || hasTime)) {
		buf[i++] = " ";
		buf[i++] = ZmMsg.apptModifiedStamp;
	}
	buf[i++] = "\n";

	return buf.join("");
};

/**
 * Uses indexOf() rather than a regex since IE didn't split on the regex correctly.
 * 
 * @private
 */
ZmCalItem.prototype._trimNotesSummary =
function(notes, isHtml) {
	if (notes) {
		var idx = notes.indexOf(ZmItem.NOTES_SEPARATOR);
		if (idx != -1) {
			notes = notes.substr(idx + ZmItem.NOTES_SEPARATOR.length);
            if (isHtml) {
                // If HTML content is generated from text content \n are replaced with br
                // Remove the leading <br> added
                notes = notes.replace(/^<br><br>/i, "");
				notes = notes.replace(/^<\/div><br>/i, "");
				// Removes </body></html> if that is all that is left.  Reduces the html to "" in that case,
				// so that later checks don't detect HTML notes.
				notes = notes.replace(/^<\/body><\/html>/i, "");
			}
            else {
                notes = notes.replace(/^\n\n/i, "");
            }
		}
	}
	return AjxStringUtil.trim(notes);
};

/**
 * @private
 */
ZmCalItem.prototype._resetCached =
function() {
	delete this._startTimeUniqId; this._startTimeUniqId = null;
	delete this._validAttachments; this._validAttachments = null;
	delete this.tooltip; this.tooltip = null;
};

/**
 * @private
 */
ZmCalItem.prototype._getTTDay =
function(d) {
	return DwtCalendar.getDayFormatter().format(d);
};

/**
 * @private
 */
ZmCalItem.prototype._addInviteAndCompNum =
function(request) {
    var id;
    if(this.message && !this.isVersionIgnored()){
        request.ms = this.message.ms;
        request.rev = this.message.rev;

    }
	if (this.viewMode == ZmCalItem.MODE_EDIT_SERIES || this.viewMode == ZmCalItem.MODE_DELETE_SERIES) {
		if (this.recurring && this.seriesInvId != null) {
            request.id = this.seriesInvId;
            request.comp = this.getCompNum();
		}
	} else {
		if (this.invId != null && this.invId != -1) {
			id =  this.invId;

			// bug: 41530 - for offline, make sure id is fully qualified if moving across accounts
			if (appCtxt.multiAccounts &&
				this._orig &&
				this._orig.getFolder().getAccount() != this.getFolder().getAccount())
			{
				id = ZmOrganizer.getSystemId(this.invId, this._orig.getFolder().getAccount(), true);
			}

            request.id = id;
            request.comp = this.getCompNum();
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype._getDefaultBlurb =
function(cancel, isHtml) {
	var buf = [];
	var i = 0;
	var singleInstance = this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE ||
						 this.viewMode == ZmCalItem.MODE_DELETE_INSTANCE;

	if (isHtml) buf[i++] = "<h3>";

    if(this.isProposeTimeMode) {
        buf[i++] =  ZmMsg.subjectNewTime;
    }else if (cancel) {
		buf[i++] = singleInstance ? ZmMsg.apptInstanceCanceled : ZmMsg.apptCanceled;
	} else if(!this.isForwardMode || this.isOrganizer()){
		if (!this.inviteNeverSent && ( this.viewMode == ZmCalItem.MODE_EDIT ||
			this.viewMode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE ||
			this.viewMode == ZmCalItem.MODE_EDIT_SERIES ) )
		{
			buf[i++] = singleInstance ? ZmMsg.apptInstanceModified : ZmMsg.apptModified;
		}
		else
		{
			buf[i++] = ZmMsg.apptNew;
		}
	}else {
        buf[i++] =  ZmMsg.apptForwarded;
    }

	if (isHtml) buf[i++] = "</h3>";

	buf[i++] = "\n\n";
	buf[i++] = this.getSummary(isHtml);

	return buf.join("");
};

// Server request calls

/**
 * @private
 */
ZmCalItem.prototype._getRequestNameForMode =
function(mode, isException) {
	// override
};

/**
 * @private
 */
ZmCalItem.prototype._getInviteFromError =
function(result) {
	// override
};

/**
 * @private
 */
ZmCalItem.prototype._setRequestAttributes =
function(request, attachmentId, notifyList, accountName) {

	var m = request.m = {},
	    calendar = this.getFolder(),
        acct = calendar.getAccount(),
        isOnBehalfOf = accountName && acct && acct.name != accountName,
        mailFromAddress,
        identityUser,
        displayName,
        validAttLen,
        attachNode,
        organizer,
        isPrimary,
        identityC,
        identity,
        isRemote,
        addrObj,
        orgName,
        comps,
        comp,
        user,
        addr,
        inv,
        org,
        mid,
        me,
        e,
        i;
	//m.setAttribute("l", (isOnBehalfOf ? this.getFolder().rid : this.folderId));
    m.l = (isOnBehalfOf ? this.getFolder().rid : this.folderId);
    inv = m.inv = {};
    e = m.e = [];
	if (this.uid != null && this.uid != -1 && !this.isSharedCopy) {
        inv.uid = this.uid;
	}

    comps = inv.comp = [];
    comp = comps[0] = {};
    comp.at = [];
	// attendees
	this._addAttendeesToRequest(comp, m, notifyList, accountName);

    identity = this.identity;
    isPrimary = identity == null || identity.isDefault;
    isRemote = calendar.isRemote();

    //FROM Address
	mailFromAddress = this.getMailFromAddress();
	if (this.isOrganizer() && !accountName && (mailFromAddress || isRemote || !isPrimary)) {
        if(mailFromAddress){
            addr = mailFromAddress;
        }else{
            if(isRemote){
                addr = this.organizer;
            }else if(identity){
                addr = identity.sendFromAddress;
                displayName = identity.sendFromDisplay;
            }
        }
        addrObj = {
            a : addr,
            t : AjxEmailAddress.toSoapType[AjxEmailAddress.FROM]
        };
        if(!displayName && addr == appCtxt.get(ZmSetting.USERNAME)){
             displayName = appCtxt.get(ZmSetting.DISPLAY_NAME);
        }
        if(displayName){
            addrObj.p = displayName;
        }
        e.push(addrObj);
        if (identity && identity.isFromDataSource && !isRemote) {
            this._addIdentityFrom(identity, e, m);
        }
	}

    //SENDER Address
    if (isRemote) {
        if (!identity) {
            identityC = appCtxt.getIdentityCollection();
            identity = identityC && identityC.defaultIdentity;
        }
        if (identity) {
            addr = identity.sendFromAddress;
            displayName = identity.sendFromDisplay;
        }
        else {
            addr = appCtxt.get(ZmSetting.USERNAME);
            displayName = appCtxt.get(ZmSetting.DISPLAY_NAME);
        }
        addrObj = {
            a : addr,
            t : AjxEmailAddress.toSoapType[AjxEmailAddress.SENDER]
        };
        if (displayName) {
            addrObj.p = displayName;
        }
        e.push(addrObj);
    }

	this._addExtrasToRequest(request, comp);
	this._addDateTimeToRequest(request, comp);
	this._addXPropsToRequest(comp);
	
	// subject/location
    m.su = this.name;
    comp.name = this.name;
	this._addLocationToRequest(comp);

	// notes
	this._addNotesToRequest(m);

	// set organizer - but not for local account
	if (!(appCtxt.isOffline && acct.isMain)) {
		me = (appCtxt.multiAccounts) ? acct.getEmail() : appCtxt.get(ZmSetting.USERNAME);
        if (!identity) {
            identityC = appCtxt.getIdentityCollection(acct);
            identity = identityC && identityC.defaultIdentity;
        }        
        if (identity) { //If !Identity then consider the default identity
            identityUser = identity.sendFromAddress;
            displayName = identity.sendFromDisplay;
        }
		user = mailFromAddress || identityUser || me;
		organizer = this.organizer || user;
        org = comp.or = {};
        org.a = organizer;
		if (isRemote) {
			org.sentBy = user;  // if on-behalf of, set sentBy
		}
        orgName = (organizer == identityUser) ? displayName : (ZmApptViewHelper.getAddressEmail(organizer)).getName();
		if (orgName) {
            org.d = orgName;
        }
	}

	// handle attachments
	this.flagLocal(ZmItem.FLAG_ATTACH, false);
	this.getAttachments(); // bug 22874: make sure to populate _validAttachments
	if (attachmentId != null ||
		(this._validAttachments != null && this._validAttachments.length))
	{
        attachNode = request.m.attach = {};
		if (attachmentId){
            attachNode.aid = attachmentId;
			this.flagLocal(ZmItem.FLAG_ATTACH, true);
		}

		if (this._validAttachments) {
			validAttLen = this._validAttachments.length;
            attachNode.mp = [];
			for (i = 0; i < validAttLen; i++) {

				mid = (this.invId || this.message.id);
				if ((mid.indexOf(":") < 0) && calendar.isRemote()) {
					mid = (appCtxt.getActiveAccount().id + ":" + mid);
				}
                attachNode.mp.push({
                    mid : mid,
                    part : this._validAttachments[i].part
                });
			}
			if (validAttLen > 0) {
				this.flagLocal(ZmItem.FLAG_ATTACH, true);
			}
		}
	}

	return {'inv': inv, 'm': m };
};

ZmCalItem.prototype._addIdentityFrom =
function(identity, e, m) {
    var dataSource = appCtxt.getDataSourceCollection().getById(identity.id),
        provider,
        doNotAddSender,
        addrObj,
        displayName;

    if (dataSource) {
        provider = ZmDataSource.getProviderForAccount(dataSource);
        doNotAddSender = provider && provider._nosender;
        // main account is "sender"
        if (!doNotAddSender) {
            e.push({
                t : AjxEmailAddress.toSoapType[AjxEmailAddress.SENDER],
                p : appCtxt.get(ZmSetting.DISPLAY_NAME) || ""
            });
        }
        // mail is "from" external account
        addrObj = {
            t : AjxEmailAddress.toSoapType[AjxEmailAddress.SENDER],
            a : dataSource.getEmail()
        };
        if (appCtxt.get(ZmSetting.DEFAULT_DISPLAY_NAME)) {
            displayName = dataSource.identity && dataSource.identity.sendFromDisplay;
            displayName = displayName || dataSource.userName || dataSource.getName();
            if(displayName) {
                addrObj.p = displayName;
            }
        }
        e.push(addrObj);
    }
};

/**
 * @private
 */
ZmCalItem.prototype._addExtrasToRequest =
function(request, comp) {
	if (this.priority) {
		comp.priority = this.priority;
	}
    comp.status = this.status;
};

/**
 * @private
 */
ZmCalItem.prototype._addXPropsToRequest =
function(comp) {
	var message = this.message ? this.message : null,
	    invite = (message && message.invite) ? message.invite : null,
        xprops = invite ? invite.getXProp() : null,
        xprop,
        x,
        i;
	if (!xprops) { return; }
    comp.xprop = [];
	// bug 16024: preserve x props
	xprops = (xprops instanceof Array) ? xprops : [xprops];

	for (i = 0; i < xprops.length; i++) {
		xprop = xprops[i],
        x = {};
		if (xprop && xprop.name) {
            x.name = xprop.name;
			if (xprop.value != null) {
                x.value = xprop.value;
			}
			this._addXParamToRequest(x, xprop.xparam);
            comp.xprop.push(x);
		}		
	}
};

/**
 * @private
 */
ZmCalItem.prototype._addXParamToRequest =
function(xprop, xparams) {
	if (!xparams) {
        return;
    }

	xparams = (xparams instanceof Array) ? xparams : [xparams];
    var xparam = xprop.xparam = [],
        xObj = {},
        j,
        x;

	for (j = 0; j < xparams.length; j++) {
		x = xparams[j];
        xObj = {};
		if (x && x.name) {
            xObj.name = x.name;
			if (x.value != null) {
                xObj.value = x.value;
			}
            xparam.push(xObj);
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype._addDateTimeToRequest =
function(request, comp, extractAllDay) {
	// always(?) set all day
    comp.allDay = this.allDayEvent + "";
	// timezone
	var tz,
        clientId,
        s,
        sd,
        e,
        ed;
	if (this.timezone) {
		clientId = AjxTimezone.getClientId(this.timezone);
		ZmTimezone.set(request, clientId, null, true);
		tz = this.timezone;
	}

	// start date
	if (this.startDate) {
        s = comp.s = {};
		if (!this.isAllDayEvent() || extractAllDay) {
			sd = AjxDateUtil.getServerDateTime(this.startDate, this.startsInUTC);

			// set timezone if not utc date/time
			if (!this.startsInUTC && tz && tz.length) {
                s.tz = tz;
            }
            s.d = sd;
		}
        else {
            s.d = AjxDateUtil.getServerDate(this.startDate);
		}
	}


    if(this.endTimezone) {
        tz = this.endTimezone;
    }

	// end date
	if (this.endDate) {
        e = comp.e = {};
		if (!this.isAllDayEvent()) {
			ed = AjxDateUtil.getServerDateTime(this.endDate, this.endsInUTC);

			// set timezone if not utc date/time
			if (!this.endsInUTC && tz && tz.length) {
				e.tz = tz;
            }
            e.d = ed;
		} else if (extractAllDay) {
			var ed = new Date(this.endDate.getTime() + AjxDateUtil.MSEC_PER_DAY);
			e.d = AjxDateUtil.getServerDateTime(ed, this.endsInUTC);
			if (!this.endsInUTC && tz && tz.length) {
				e.tz = tz;
			}
		} else {
			e.d = AjxDateUtil.getServerDate(this.endDate);
		}
	}
};

/**
 * @private
 */
ZmCalItem.prototype._addAttendeesToRequest =
function(inv, m, notifyList, accountName) {
	// if this appt is on-behalf-of, set the from address to that person
    if (this.isOrganizer() && accountName) {
        m.e.push({
            a : accountName,
            t : AjxEmailAddress.toSoapType[AjxEmailAddress.FROM]
        });
    }
};

/**
 * @private
 */
ZmCalItem.prototype._addNotesToRequest =
function(m, cancel) {

	var hasAttendees = this.hasAttendees(),
        tprefix = hasAttendees ? this._getDefaultBlurb(cancel) : "",
        hprefix = hasAttendees ? this._getDefaultBlurb(cancel, true) : "",
        mp = m.mp = {"mp" : []},
        numSubParts,
        part,
        pct,
        content,
        ntp,
        tcontent,
        hcontent,
        html,
        i;

    mp.ct = ZmMimeTable.MULTI_ALT;
	numSubParts = this.notesTopPart ? this.notesTopPart.children.size() : 0;
	if (numSubParts > 0) {
		for (i = 0; i < numSubParts; i++) {
			part = this.notesTopPart.children.get(i);
            pct = part.getContentType();

			if (pct == ZmMimeTable.TEXT_HTML) {
                var htmlContent = part.getContent();
                htmlContent = AjxStringUtil.defangHtmlContent(htmlContent);
                content = "<html><body id='htmlmode'>" + (this._includeEditReply ? htmlContent : AjxBuffer.concat(hprefix, htmlContent)) + "</body></html>";
			} else {
				content = this._includeEditReply ? part.getContent() : AjxBuffer.concat(tprefix, part.getContent());
			}
            mp.mp.push({
                ct : pct,
                content : content
            });
		}
	} else {
        ntp = this.notesTopPart;
		tcontent = ntp ? ntp.getContent() : "";
        pct = ntp ? ntp.getContentType() : ZmMimeTable.TEXT_PLAIN;
        mp.mp.push({
            ct : pct
        });
        if (pct == ZmMimeTable.TEXT_HTML) {
            //bug fix #9592 - html encode the text before setting it as the "HTML" part
            hcontent = AjxStringUtil.nl2br(AjxStringUtil.htmlEncode(tcontent));
            html = "<html><body>" + (this._includeEditReply ? hcontent : AjxBuffer.concat(hprefix, hcontent)) + "</body></html>";
            mp.mp[0].content = html;
        }
        else {
            mp.mp[0].content = (this._includeEditReply ? tcontent : AjxBuffer.concat(tprefix, tcontent));
        }
	}
};


/**
 * Gets a string representation of the invite content.
 * 
 * @param       {Boolean}		isHtml	if <code>true</code>, get HTML content
 * @return		{String}		a string representation of the invite
 */
ZmCalItem.prototype.getInviteDescription =
function(isHtml) {
	var hasAttendees = this.hasAttendees();
	var tprefix = hasAttendees ? this.getSummary(false) : "";
	var hprefix = hasAttendees ? this.getSummary(true) : "";

    var notes = this.getNotesPart(isHtml ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN);
    return AjxBuffer.concat(isHtml ? hprefix : tprefix, notes)    
};

/**
 * @private
 */
ZmCalItem.prototype.setIncludeEditReply =
function(includeEditReply) {
	this._includeEditReply = includeEditReply;
};

/**
 * @private
 */
ZmCalItem.prototype._sendRequest =
function(soapDoc, accountName, callback, errorCallback, jsonObj, requestName) {
	var responseName = soapDoc ? soapDoc.getMethod().nodeName.replace("Request", "Response") : requestName.replace("Request", "Response");
	var respCallback = new AjxCallback(this, this._handleResponseSend, [responseName, callback]);
    if (!jsonObj) {
	    appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true, accountName:accountName, callback:respCallback, errorCallback:errorCallback});
    }
    else {
        appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, accountName:accountName, callback:respCallback, errorCallback:errorCallback});
    }
};

/**
 * @private
 */
ZmCalItem.prototype._loadFromDom =
function(calItemNode, instNode) {
	ZmCalBaseItem.prototype._loadFromDom.call(this, calItemNode, instNode);

	this.isOrg 			= this._getAttr(calItemNode, instNode, "isOrg");
	var org				= calItemNode.or;
	this.organizer		= org && org.a;
	this.sentBy			= org && org.sentBy;
	this.invId 			= this._getAttr(calItemNode, instNode, "invId");
	this.compNum 		= this._getAttr(calItemNode, instNode, "compNum") || "0";
	this.parseAlarmData(this.alarmData);
	this.seriesInvId	= this.recurring ? calItemNode.invId : null;
	this.ridZ 			= instNode && instNode.ridZ;

	if (calItemNode.tn) {
		this._parseTagNames(calItemNode.tn);
	}
	if (calItemNode.f) {
		this._parseFlags(calItemNode.f);
	}
};

// Callbacks

/**
 * @private
 */
ZmCalItem.prototype._handleResponseSend =
function(respName, callback, result) {
	var resp = result.getResponse();

	// branch for different responses
	var response = resp[respName];
	if (response.uid != null) {
		this.uid = response.uid;
	}

    var msgNode;
    //echo=1 sends back echo response node, process it
    if(response.echo){
        msgNode = response.echo;
        if(msgNode.length > 0){
            msgNode = msgNode[0];
        }
    }
    msgNode = msgNode ? msgNode.m : response.m;
	if (msgNode != null) {
        if(msgNode.length > 0){
            msgNode = msgNode[0];
        }
		var oldInvId = this.invId;
		this.invId = msgNode.id;
		if (AjxUtil.isSpecified(oldInvId) && oldInvId != this.invId){
			this.message = null;
        }else if(msgNode){
            this.message = new ZmMailMsg(msgNode.id);
            this.message._loadFromDom(msgNode);
            delete this._validAttachments;
            this._validAttachments = null;
            this.getAttachments();
        }
	}

	this._messageNode = null;

	if (callback) {
		callback.run(response);
	}
};

ZmCalItem.prototype.processErrorSave =
function(ex) {
	// TODO: generalize error message for calItem instead of just Appt
    var status = {
        continueSave: false,
        errorMessage: ""
    };
	if (ex.code == ZmCsfeException.MAIL_SEND_ABORTED_ADDRESS_FAILURE) {
		var invalid = ex.getData(ZmCsfeException.MAIL_SEND_ADDRESS_FAILURE_INVALID);
		var invalidMsg = (invalid && invalid.length)
			? AjxMessageFormat.format(ZmMsg.apptSendErrorInvalidAddresses, AjxStringUtil.htmlEncode(invalid.join(", "))) : null;
		status.errorMessage = ZmMsg.apptSendErrorAbort + "<br/>" + invalidMsg;
	} else if (ex.code == ZmCsfeException.MAIL_SEND_PARTIAL_ADDRESS_FAILURE) {
		var invalid = ex.getData(ZmCsfeException.MAIL_SEND_ADDRESS_FAILURE_INVALID);
		status.errorMessage = (invalid && invalid.length)
			? AjxMessageFormat.format(ZmMsg.apptSendErrorPartial, AjxStringUtil.htmlEncode(invalid.join(", ")))
			: ZmMsg.apptSendErrorAbort;
	} else if(ex.code == ZmCsfeException.MAIL_MESSAGE_TOO_BIG) {
        status.errorMessage = (this.type == ZmItem.TASK) ? ZmMsg.taskSaveErrorToobig : ZmMsg.apptSaveErrorToobig;
    } else if (ex.code == ZmCsfeException.MAIL_INVITE_OUT_OF_DATE) {
        if(!this.isVersionIgnored()){
            this.setIgnoreVersion(true);
            status.continueSave = true;
        }
        else{
            status.errorMessage = ZmMsg.inviteOutOfDate;
            this.setIgnoreVersion(false);
        }
    } else if (ex.code == ZmCsfeException.MAIL_NO_SUCH_CALITEM) {
        status.errorMessage = ex.getErrorMsg([ex.getData("itemId")]);
    } else if (ex.code == ZmCsfeException.MAIL_QUOTA_EXCEEDED) {
    		if(this.type == ZmItem.APPT){
                status.errorMessage=ZmMsg.errorQuotaExceededAppt;
            } else if(this.type == ZmItem.TASK){
                status.errorMessage=ZmMsg.errorQuotaExceededTask;
            }
    }
	else if (ex.code === ZmCsfeException.MUST_BE_ORGANIZER) {
		status.errorMessage = ZmMsg.mustBeOrganizer;
	}

    return status;
};

ZmCalItem.prototype.setProposedTimeCallback =
function(callback) {
    this._proposedTimeCallback = callback;
};

ZmCalItem.prototype.handlePostSaveCallbacks =
function() {
    if(this._proposedTimeCallback) this._proposedTimeCallback.run(this);
    this.setIgnoreVersion(false);
};

// Static methods

ZmCalItem.isPriorityHigh = function(priority) {
	return AjxUtil.arrayContains(ZmCalItem.PRIORITY_HIGH_RANGE, priority);
};
ZmCalItem.isPriorityLow = function(priority) {
	return AjxUtil.arrayContains(ZmCalItem.PRIORITY_LOW_RANGE, priority);
};
ZmCalItem.isPriorityNormal = function(priority) {
	return AjxUtil.arrayContains(ZmCalItem.PRIORITY_NORMAL_RANGE, priority);
};

/**
 * Gets the priority label.
 * 
 * @param	{int}	priority		the priority (see <code>ZmCalItem.PRIORITY_</code> constants)
 * @return	{String}	the priority label
 * 
 */
ZmCalItem.getLabelForPriority =
function(priority) {
	if (ZmCalItem.isPriorityLow(priority)) {
		return ZmMsg.low;
	}
	if (ZmCalItem.isPriorityNormal(priority)) {
		return ZmMsg.normal;
	}
	if (ZmCalItem.isPriorityHigh(priority)) {
		return ZmMsg.high;
	}
	return "";
};

/**
 * Gets the priority image.
 * 
 * @param	{ZmTask}	task	the task
 * @param	{int}	id		the id
 * @return	{String}	the priority image
 */
ZmCalItem.getImageForPriority =
function(task, id) {
	if (ZmCalItem.isPriorityLow(task.priority)) {
			return id
				? AjxImg.getImageHtml("PriorityLow_list", null, ["id='", id, "'"].join(""))
				: AjxImg.getImageHtml("PriorityLow_list");
	} else if (ZmCalItem.isPriorityHigh(task.priority)) {
			return id
				? AjxImg.getImageHtml("PriorityHigh_list", null, ["id='", id, "'"].join(""))
				: AjxImg.getImageHtml("PriorityHigh_list");
	}
	return "";
};

/**
 * Gets the status label.
 * 
 * @param	{int}	status		the status (see <code>ZmCalendarApp.STATUS_</code> constants)
 * @return	{String}	the status label
 * 
 * @see	ZmCalendarApp
 */
ZmCalItem.getLabelForStatus =
function(status) {
	switch (status) {
		case ZmCalendarApp.STATUS_CANC: return ZmMsg.cancelled;
		case ZmCalendarApp.STATUS_COMP: return ZmMsg.completed;
		case ZmCalendarApp.STATUS_DEFR: return ZmMsg.deferred;
		case ZmCalendarApp.STATUS_INPR: return ZmMsg.inProgress;
		case ZmCalendarApp.STATUS_NEED: return ZmMsg.notStarted;
		case ZmCalendarApp.STATUS_WAIT: return ZmMsg.waitingOn;
	}
	return "";
};

/**
 * Gets the participation status label.
 * 
 * @param	{int}	status		the status (see <code>ZmCalBaseItem.PSTATUS_</code> constants)
 * @return	{String}	the status label
 * 
 * @see	ZmCalBaseItem
 */
ZmCalItem.getLabelForParticipationStatus =
function(status) {
	switch (status) {
		case ZmCalBaseItem.PSTATUS_ACCEPT:		return ZmMsg.ptstAccept;
		case ZmCalBaseItem.PSTATUS_DECLINED:	return ZmMsg.ptstDeclined;
		case ZmCalBaseItem.PSTATUS_DEFERRED:	return ZmMsg.ptstDeferred;
		case ZmCalBaseItem.PSTATUS_DELEGATED:	return ZmMsg.ptstDelegated;
		case ZmCalBaseItem.PSTATUS_NEEDS_ACTION:return ZmMsg.ptstNeedsAction;
		case ZmCalBaseItem.PSTATUS_COMPLETED:	return ZmMsg.completed;
		case ZmCalBaseItem.PSTATUS_TENTATIVE:	return ZmMsg.ptstTentative;
		case ZmCalBaseItem.PSTATUS_WAITING:		return ZmMsg.ptstWaiting;
	}
	return "";
};

/**
 * Gets the participation status icon.
 * 
 * @param	{int}	status		the status (see <code>ZmCalBaseItem.PSTATUS_</code> constants)
 * @return	{String}	the status icon or an empty string if status not set
 * 
 * @see	ZmCalBaseItem
 */
ZmCalItem.getParticipationStatusIcon =
function(status) {
	switch (status) {
		case ZmCalBaseItem.PSTATUS_ACCEPT:		return "Check";
		case ZmCalBaseItem.PSTATUS_DECLINED:	return "Cancel";
		case ZmCalBaseItem.PSTATUS_DEFERRED:	return "QuestionMark";
		case ZmCalBaseItem.PSTATUS_DELEGATED:	return "Plus";
		case ZmCalBaseItem.PSTATUS_NEEDS_ACTION:return "NeedsAction";
		case ZmCalBaseItem.PSTATUS_COMPLETED:	return "Completed";
		case ZmCalBaseItem.PSTATUS_TENTATIVE:	return "QuestionMark";
		case ZmCalBaseItem.PSTATUS_WAITING:		return "Minus";
	}
	return "";
};

/**
 * @private
 */
ZmCalItem._getTTDay =
function(d, format) {
	format = format || AjxDateFormat.SHORT;
	var formatter = AjxDateFormat.getDateInstance();
	return formatter.format(d);
};

/*
 * Returns the status of text part from the message. If the message doesn't contain text body part then we convert html body part to text.
 * This function helps in determining if we use text/plain or last content type to process the notes top part's body.
 *
 * @param	{ZmMailMsg}	message	the message object received for setting notes section
 * @return {Boolean}
 */
ZmCalItem.prototype.isTextPartPresent =
function(message) {
    var textMimePart = message._topPart && message._topPart.children.getArray().filter(function(item) {
        return item.contentType === ZmMimeTable.TEXT_PLAIN;
    });

    var textContent = textMimePart && textMimePart.length && textMimePart[0].getContent();

    if (textContent && textContent.length) {
        // The text part is available, set contenttype to text/plain
        return true;
    }
    else {
        // The text part is missing, set contenttype to text/html
        return false;
    }
};
}

if (AjxPackage.define("zimbraMail.calendar.view.ZmApptRecurDialog")) {
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
 * Creates a new appointment recurrence dialog. The view displays itself on construction.
 * @constructor
 * @class
 * This class provides a dialog for creating/editing recurrences for an appointment
 *
 * @author Parag Shah
 * 
 * @param {ZmControl}	parent			the element that created this view
 * @param {String}	className 		optional class name for this view
 * 
 * @extends		DwtDialog
 */
ZmApptRecurDialog = function(parent, uid, className) {
	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.customRepeat});

	// set html content once (hence, in ctor)
	this.setContent(this._setHtml(uid));
	this._createRepeatSections(uid);
	this._createDwtObjects(uid);
	this._cacheFields();
	this._addEventHandlers();
	this._createTabGroup();

	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okListener));
	this.addSelectionListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._cancelListener));
};

ZmApptRecurDialog.prototype = new DwtDialog;
ZmApptRecurDialog.prototype.constructor = ZmApptRecurDialog;


// Consts

ZmApptRecurDialog.REPEAT_OPTIONS = [
	{ label: ZmMsg.none, 			value: ZmRecurrence.NONE,		selected: true 	},
	{ label: ZmMsg.daily, 			value: ZmRecurrence.DAILY,		selected: false },
	{ label: ZmMsg.weekly, 			value: ZmRecurrence.WEEKLY,		selected: false },
	{ label: ZmMsg.monthly, 		value: ZmRecurrence.MONTHLY,	selected: false },
	{ label: ZmMsg.yearly, 			value: ZmRecurrence.YEARLY,		selected: false }];


// Public methods

ZmApptRecurDialog.prototype.toString = 
function() {
	return "ZmApptRecurDialog";
};

ZmApptRecurDialog.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

ZmApptRecurDialog.prototype.initialize = 
function(startDate, endDate, repeatType, appt) {
    this._startDate = new Date(startDate.getTime());
	this._endDate = new Date(endDate.getTime());
    this._origRefDate = startDate;
    // based on repeat type, setup the repeat type values
	var repeatType = repeatType || ZmRecurrence.DAILY;
	this._repeatSelect.setSelectedValue(repeatType);
	this._setRepeatSection(repeatType);

	// dont bother initializing if user is still mucking around
	if (this._saveState)
		return;

	var startDay = this._startDate.getDay();
	var startDate = this._startDate.getDate();
	var startMonth = this._startDate.getMonth();

	// reset time based fields
	this._endByField.setValue(AjxDateUtil.simpleComputeDateStr(this._startDate));
    this._weeklySelectButton._selected = startDay;
    this._weeklySelectButton.setDisplayState(DwtControl.SELECTED);

    var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
    var dayFormatter = formatter.getFormatsByArgumentIndex()[0];
    this._weeklySelectButton.setText(dayFormatter.format(this._origRefDate));

    this._weeklyCheckboxes[startDay].checked = true;
	this._monthlyDayField.setValue(startDate);
	this._monthlyWeekdaySelect.setSelected(startDay);
	this._yearlyDayField.setValue(startDate);
	this._yearlyMonthSelect.setSelected(startMonth);
	this._yearlyWeekdaySelect.setSelected(startDay);
	this._yearlyMonthSelectEx.setSelected(startMonth);

	this._isDirty = false;

	// if given appt object, means user is editing existing appointment's recur rules
	if (appt) {
		this._populateForEdit(appt);
	}
};

ZmApptRecurDialog.prototype.isDirty =
function() {
	return this._isDirty;
};

/**
 * Gets the selected repeat value.
 * 
 * @return	{constant}	the repeat value
 */
ZmApptRecurDialog.prototype.getSelectedRepeatValue = 
function() {
	return this._repeatSelect.getValue();
};

/**
 * Sets repeat end values.
 * 
 * @param	{ZmAppt}	appt		the appointment
 */
ZmApptRecurDialog.prototype.setRepeatEndValues = 
function(appt) {
    var recur = appt._recurrence;
	recur.repeatEndType = this._getRadioOptionValue(this._repeatEndName);
	recur.repeatEndDate = null;
	recur.repeatEndCount = null;

	// add any details for the select option
	if (recur.repeatEndType == "A")
		recur.repeatEndCount = this._endIntervalField.getValue();
	else if (recur.repeatEndType == "D")
		recur.repeatEndDate = AjxDateUtil.simpleParseDateStr(this._endByField.getValue());
};

/**
 * Sets custom daily values.
 * 
 * @param	{ZmAppt}	appt		the appointment
 */
ZmApptRecurDialog.prototype.setCustomDailyValues = 
function(appt) {
	var recur = appt._recurrence;
	var value = this._getRadioOptionValue(this._dailyRadioName);
    recur._startDate = new Date(this._origRefDate);	
	recur.repeatCustom = "1";
	recur.repeatWeekday = false;
	
	if (value == "2") {
		recur.repeatWeekday = true;
        //Let's check if it is sat/sunday today
        var d = new Date(this._origRefDate); //Using the start date specified...can be in the past
        if(d.getDay()==AjxDateUtil.SUNDAY || d.getDay()==AjxDateUtil.SATURDAY){
            recur._startDate = AjxDateUtil.getDateForNextDay(d,AjxDateUtil.MONDAY); // get subsequent monday, weekday
        }
   		recur.repeatCustomCount = 1;
    } else {
		recur.repeatCustomCount = value == "3" ? (Number(this._dailyField.getValue())) : 1;
	}
};

/**
 * Sets custom weekly values.
 * 
 * @param	{ZmAppt}	appt		the appointment
 */
ZmApptRecurDialog.prototype.setCustomWeeklyValues =
function(appt) {
    var recur = appt._recurrence;
	recur.repeatWeeklyDays = []
	recur.repeatCustom = "1";
    recur._startDate = new Date(this._origRefDate);
	var value = this._getRadioOptionValue(this._weeklyRadioName);
    var currentDay = recur._startDate.getDay();
	if (value == "1") {
		recur.repeatCustomCount = 1;
        var startDay = this._weeklySelectButton._selected;
        switch(startDay){
            case 7: //Separator
                    break;
            case 8: //Mon, wed, Fri
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.MONDAY]);
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.WEDNESDAY]);
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.FRIDAY]);
                    startDay = AjxDateUtil.MONDAY;
                    while(startDay < currentDay){
                        startDay += 2;
                    }
                    break;
            case 9: //Tue, Thu
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.TUESDAY]);
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.THURSDAY]);
                    startDay = AjxDateUtil.TUESDAY;
                    while(startDay < currentDay){
                        startDay += 2;
                    }
                    break;
            case 10: //Sat, Sunday
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SATURDAY]);
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SUNDAY]);
                    startDay = currentDay == AjxDateUtil.SUNDAY? currentDay:AjxDateUtil.SATURDAY;
                    break;
            default:
                    recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[this._weeklySelectButton._selected/*getValue()*/]);
                    break;
        }
        recur._startDate = AjxDateUtil.getDateForNextDay(new Date(this._origRefDate),startDay);
        //recur._endDate = recur._startDate;
    } else {
		recur.repeatCustomCount = Number(this._weeklyField.getValue());
        var selectedDays = [];
        for (var i = 0; i < this._weeklyCheckboxes.length; i++) {
			if (this._weeklyCheckboxes[i].checked){
                selectedDays.push(i);
                recur.repeatWeeklyDays.push(ZmCalItem.SERVER_WEEK_DAYS[i]);
            }
        }
        var startDay = currentDay;
        for(var i =0; i < selectedDays.length;i++){
            var startDay = selectedDays[i];
            if(startDay >= currentDay) { //In past
                break;
            }
        }
        recur._startDate = AjxDateUtil.getDateForNextDay(new Date(this._origRefDate),startDay);
    }
};

/**
 * Sets custom monthly values.
 * 
 * @param	{ZmAppt}	appt		the appointment
 */
ZmApptRecurDialog.prototype.setCustomMonthlyValues =
function(appt) {
	var recur = appt._recurrence;
	recur.repeatCustom = "1";
   	var value = this._getRadioOptionValue(this._monthlyRadioName);
    recur._startDate = new Date(this._origRefDate);
	if (value == "1") {
		recur.repeatCustomType = "S";
		recur.repeatCustomCount = this._monthlyMonthField.getValue();
		recur.repeatMonthlyDayList = [this._monthlyDayField.getValue()];
        recur.repeatCustomMonthDay = this._monthlyDayField.getValue();
        recur._startDate.setDate(recur.repeatCustomMonthDay);
        var today = new Date(this._origRefDate); //Reference date...
        var diff = (today - recur._startDate);
        if(diff >= AjxDateUtil.MSEC_PER_DAY || today.getDate() > recur._startDate.getDate()){ // was in the past, so let's use the next date
            recur._startDate.setMonth(recur._startDate.getMonth()+1);
        }

    } else {
		recur.repeatCustomType = "O";
		recur.repeatCustomCount = this._monthlyMonthFieldEx.getValue();
		recur.repeatBySetPos = this._monthlyDaySelect.getValue();
		recur.repeatCustomDayOfWeek = ZmCalItem.SERVER_WEEK_DAYS[this._monthlyWeekdaySelect.getValue()];
        recur.repeatCustomDays = this.getWeekdaySelectValue(this._monthlyWeekdaySelect);

        if(recur.repeatBySetPos==-1){ // Last day
            var lastDate = new Date(this._origRefDate);
            lastDate.setDate(AjxDateUtil.daysInMonth(lastDate.getFullYear(),lastDate.getMonth())); //Date is now last date of this month
            var lastDayDate = this.getPossibleStartDate(this._monthlyWeekdaySelect.getValue(), lastDate, recur.repeatBySetPos);

            //Check if it is already paased
            var today = new Date(this._origRefDate);
            var diff = (today - lastDayDate);
            var isInPast = today.getTime() > lastDayDate.getTime();
            if(diff >= AjxDateUtil.MSEC_PER_DAY || isInPast ){ //In the past
                // Go for next month
                lastDate.setMonth(lastDate.getMonth()+1);
                recur._startDate = this.getPossibleStartDate(this._monthlyWeekdaySelect.getValue(), lastDate, recur.repeatBySetPos);                              
            }else{
                 recur._startDate = lastDayDate;
            }
        }else{
            var first = new Date(this._origRefDate);
            first.setDate(1);  
            recur._startDate = this.getPossibleStartDate(this._monthlyWeekdaySelect.getValue(), first, recur.repeatBySetPos); //AjxDateUtil.getDateForNextDay(first,this.getFirstWeekDayOffset(this._monthlyWeekdaySelect),recur.repeatBySetPos);
             //Check if it is already paased
            var today = new Date(this._origRefDate);
            var diff = (today - recur._startDate);
            var isInPast = today.getTime() > recur._startDate.getTime();
            if(diff >= AjxDateUtil.MSEC_PER_DAY || isInPast){ //In the past
                // Go for next month, find the date as per rule
                first.setMonth(first.getMonth() + 1);//Next month
                recur._startDate = this.getPossibleStartDate(this._monthlyWeekdaySelect.getValue(), first, recur.repeatBySetPos, true);
            }
        }
    }
};

/**
 * Sets custom yearly values.
 * 
 * @param	{ZmAppt}	appt		the appointment
 */
ZmApptRecurDialog.prototype.setCustomYearlyValues =
function(appt) {
	appt._recurrence.repeatCustom = "1";
    var recur = appt._recurrence;
    recur._startDate = new Date(this._origRefDate);
	var value = this._getRadioOptionValue(this._yearlyRadioName);

	if (value == "1") {
		appt._recurrence.repeatCustomType = "S";
		appt._recurrence.repeatCustomMonthDay = this._yearlyDayField.getValue();
		appt._recurrence.repeatYearlyMonthsList = this._yearlyMonthSelect.getValue() + 1;
        //Create date out of it
        var d  = new Date(this._origRefDate);
        d.setDate(appt._recurrence.repeatCustomMonthDay);
        d.setMonth(this._yearlyMonthSelect.getValue());
        //Try to judge, if this date is in future
        var today = new Date(this._origRefDate);
        var diff = (today - d);
        var isInPast = today.getTime() > d.getTime();
        if( diff >= AjxDateUtil.MSEC_PER_DAY || isInPast){ //In the past
            d.setFullYear(d.getFullYear()+1);
        }
        appt._recurrence._startDate = d;
        appt._recurrence._endDate = d;
    } else {
		appt._recurrence.repeatCustomType = "O";
		appt._recurrence.repeatBySetPos = this._yearlyDaySelect.getValue();
		appt._recurrence.repeatCustomDayOfWeek = ZmCalItem.SERVER_WEEK_DAYS[this._yearlyWeekdaySelect.getValue()];
        appt._recurrence.repeatCustomDays = this.getWeekdaySelectValue(this._yearlyWeekdaySelect);

        appt._recurrence.repeatYearlyMonthsList = this._yearlyMonthSelectEx.getValue() + 1;
        var d = new Date(this._origRefDate);
        d.setMonth(this._yearlyMonthSelectEx.getValue());
        //Check if date is in past
        if(appt._recurrence.repeatBySetPos < 0){ // we want last day
            d.setDate(AjxDateUtil.daysInMonth(d.getFullYear(),d.getMonth()));
        }else{
            d.setDate(1);
        }
        var dt = this.getPossibleStartDate(this._yearlyWeekdaySelect.getValue(), d, appt._recurrence.repeatBySetPos);

        var today = new Date(this._origRefDate);
        var diff = (today -dt);
        var isInPast = today.getTime() > dt.getTime();
        var ignoreOffset = true;
        if(diff >= AjxDateUtil.MSEC_PER_DAY || isInPast){ // In the past
            d.setFullYear(d.getFullYear()+1);
            if(appt._recurrence.repeatBySetPos < 0){ // we want last day
                d.setDate(AjxDateUtil.daysInMonth(d.getFullYear(),d.getMonth()));
            }else{
                d.setDate(1);
                ignoreOffset = false;
            }
        }
        appt._recurrence._startDate = this.getPossibleStartDate(this._yearlyWeekdaySelect.getValue(), d, appt._recurrence.repeatBySetPos, ignoreOffset);
        appt._recurrence._endDate = appt._recurrence._startDate;
    }
};

ZmApptRecurDialog.prototype.addSelectionListener = 
function(buttonId, listener) {
	this._button[buttonId].addSelectionListener(listener);
};

ZmApptRecurDialog.prototype.clearState = 
function() {
	this._saveState = false;
	this._cleanup();
};

ZmApptRecurDialog.prototype.isValid = 
function() {
	var valid = true;

	// ONLY for the selected options, check if their fields are valid
	var repeatValue = this._repeatSelect.getValue();

	if (repeatValue == ZmRecurrence.DAILY) {
		if (this._dailyFieldRadio.checked)
			valid = this._dailyField.isValid();
		if (!valid)
			this._dailyField.blur();
	} else if (repeatValue == ZmRecurrence.WEEKLY) {
		if (this._weeklyFieldRadio.checked) {
			valid = this._weeklyField.isValid();
			if (valid) {
				valid = false;
				for (var i=0; i<this._weeklyCheckboxes.length; i++) {
					if (this._weeklyCheckboxes[i].checked) {
						valid = true;
						break;
					}
				}
			}
			// weekly section is special - force a focus if valid to clear out error
			this._weeklyField.focus();
			this._weeklyField.blur();
		}
	} else if (repeatValue == ZmRecurrence.MONTHLY) {
		if (this._monthlyDefaultRadio.checked) {
			valid = this._monthlyMonthField.isValid() && this._monthlyDayField.isValid();
			if (!valid) {
				this._monthlyMonthField.blur();
				this._monthlyDayField.blur();
			}
		} else {
			valid = this._monthlyMonthFieldEx.isValid();
			if (!valid)
				this._monthlyMonthFieldEx.blur();
		}
	} else if (repeatValue == ZmRecurrence.YEARLY) {
		if (this._yearlyDefaultRadio.checked)
			valid = this._yearlyDayField.isValid();
		if (!valid)
			this._yearlyDayField.blur();
	}

	// check end section
	if (valid) {
		if (this._endAfterRadio.checked) {
			valid = this._endIntervalField.isValid();
			if (!valid)
				this._endIntervalField.blur();
		} else if (this._endByRadio.checked) {
			valid = this._endByField.isValid();
			if (!valid)
				this._endByField.blur();
		}
	}

	return valid;
};


// Private / protected methods
 
ZmApptRecurDialog.prototype._setHtml = 
function(uid) {
	this._repeatSelectId = Dwt.getNextId();
	this._repeatSectionId = Dwt.getNextId();
	this._repeatEndDivId = Dwt.getNextId();
	var html = new Array();
	var i = 0;
	
	html[i++] = "<table role='presentation' width=450>";
	html[i++] = "<tr><td><fieldset";
	if (AjxEnv.isMozilla)
		html[i++] = " style='border:1px dotted #555'";
	html[i++] = "><legend style='color:#555555'>";
	html[i++] = ZmMsg.repeat;
	html[i++] = "</legend><div style='height:110px'>";
	html[i++] = "<div id='";
	html[i++] = this._repeatSelectId;
	html[i++] = "' style='margin-bottom:.25em;'></div><div id='";
	html[i++] = this._repeatSectionId;
	html[i++] = "'></div>";
	html[i++] = "</div></fieldset></td></tr>";
	html[i++] = "<tr><td><div id='";
	html[i++] = this._repeatEndDivId;
	html[i++] = "'><fieldset";
	if (AjxEnv.isMozilla)
		html[i++] = " style='border:1px dotted #555'";
	html[i++] = "><legend style='color:#555'>";
	html[i++] = ZmMsg.end;
	html[i++] = "</legend>";
	html[i++] = this._getEndHtml(uid);
	html[i++] = "</fieldset></div></td></tr>";
	html[i++] = "</table>";

	return html.join("");
};

ZmApptRecurDialog.prototype._getEndHtml = 
function(uid) {
	this._repeatEndName = Dwt.getNextId();
	this._noEndDateRadioId = "NO_END_DATE_RADIO_" + uid; // Dwt.getNextId();
	this._endByRadioId = "END_BY_RADIO_" + uid; // Dwt.getNextId();
	this._endAfterRadioId = "END_AFTER_RADIO_" + uid; // Dwt.getNextId();
    // unique ids for endIntervalFieldId and endByField
    this._endIntervalFieldId = "END_INTERVAL_FIELD_" + uid; // Dwt.getNextId();
	this._endByFieldId = "END_BY_FIELD_" + uid; // Dwt.getNextId();
	this._endByButtonId = "END_BY_BUTTON_" + uid; // Dwt.getNextId();

	var html = new Array();
	var i = 0;

	// start table
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	// no end date
	html[i++] = "<tr><td width=1%><input checked value='N' type='radio' name='";
	html[i++] = this._repeatEndName;
	html[i++] = "' id='";
	html[i++] = this._noEndDateRadioId;
	html[i++] = "'></td><td colspan=2>";
	html[i++] = "<label for='";
	html[i++] = this._noEndDateRadioId;
	html[i++] = "'>"
	html[i++] = ZmMsg.recurEndNone;
	html[i++] = "</label>"
	html[i++] = "</td></tr>";
	// end after <num> occurrences
	html[i++] = "<tr><td><input type='radio' value='A' name='";
	html[i++] = this._repeatEndName;
	html[i++] = "' id='";
	html[i++] = this._endAfterRadioId;
	html[i++] = "'></td><td colspan=2>";
	html[i++] = "<table role='presentation'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurEndNumber);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		html[i++] = "<td>";
		var segment = segments[s];
		if (segment instanceof AjxMessageFormat.MessageSegment && 
			segment.getIndex() == 0) {
			html[i++] = "<span id='";
			html[i++] = this._endIntervalFieldId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else {
			html[i++] = "<label for='";
			html[i++] = this._endAfterRadioId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end by <date>
	html[i++] = "<tr><td><input type='radio' value='D' name='";
	html[i++] = this._repeatEndName;
	html[i++] = "' id='";
	html[i++] = this._endByRadioId;
	html[i++] = "'></td><td>";
	html[i++] = "<table role='presentation'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurEndByDate);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		if (segment instanceof AjxMessageFormat.MessageSegment && 
			segment.getIndex() == 0) {
			html[i++] = "<td id='";
			html[i++] = this._endByFieldId;
			html[i++] = "' style='padding:0 0 0 .5em'></td><td id='";
			html[i++] = this._endByButtonId;
			html[i++] = "' style='padding:0 .5em 0 0'></td>";
		}
		else {
			html[i++] = "<td style='padding-left:2px;padding-right:2px'>";
			html[i++] = "<label for='";
                        html[i++] = this._endByRadioId;
                        html[i++] = "'>";
			html[i++] = segment.toSubPattern();
                        html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end table
	html[i++] = "</table>";
	return html.join("");
};

ZmApptRecurDialog.prototype._createRepeatSections = 
function(uid) {
	var sectionDiv = document.getElementById(this._repeatSectionId);
	if (sectionDiv) {
		var div = document.createElement("div");
		div.style.position = "relative";
		div.style.display = "none";
		div.id = this._repeatDailyId = "REPEAT_DAILY_DIV_" + uid; //Dwt.getNextId();
		div.innerHTML = this._createRepeatDaily(uid);
		sectionDiv.appendChild(div);

		var div = document.createElement("div");
		div.style.position = "relative";
		div.style.display = "none";
		div.id = this._repeatWeeklyId = "REPEAT_WEEKLY_DIV_" + uid; // Dwt.getNextId();
		div.innerHTML = this._createRepeatWeekly(uid);
		sectionDiv.appendChild(div);
	
		var div = document.createElement("div");
		div.style.position = "relative";
		div.style.display = "none";
		div.id = this._repeatMonthlyId = "REPEAT_MONTHLY_DIV_" + uid; // Dwt.getNextId();
		div.innerHTML = this._createRepeatMonthly(uid);
		sectionDiv.appendChild(div);
	
		var div = document.createElement("div");
		div.style.position = "relative";
		div.style.display = "none";
		div.id = this._repeatYearlyId = "REPEAT_YEARLY_DIV_" + uid; // Dwt.getNextId();
		div.innerHTML = this._createRepeatYearly(uid);
		sectionDiv.appendChild(div);
	}
};

ZmApptRecurDialog.prototype._createRepeatDaily = 
function(uid) {
	this._dailyRadioName = "DAILY_RADIO_" + uid; // Dwt.getNextId();
	this._dailyDefaultId = "DAILY_DEFAULT_" + uid; // Dwt.getNextId();
	this._dailyWeekdayId = "DAILY_WEEKDAY_" + uid; // Dwt.getNextId();
	this._dailyFieldRadioId = "DAILY_FIELD_RADIO_" + uid; // Dwt.getNextId();
	this._dailyFieldId = "DAILY_FIELD_" + uid; // Dwt.getNextId();

	var html = new Array();
	var i = 0;

	// start table
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	// every day
	html[i++] = "<tr><td><input checked value='1' type='radio' name='";
	html[i++] = this._dailyRadioName;
	html[i++] = "' id='";
	html[i++] = this._dailyDefaultId;
	html[i++] = "'></td>";
	html[i++] = "<td>";
	html[i++] = "<label for='";
	html[i++] = this._dailyDefaultId;
	html[i++] = "'>";
	html[i++] = ZmMsg.recurDailyEveryDay;
	html[i++] = "</label>"
	html[i++] = "</td></tr>";
	// every weekday
	html[i++] = "<tr><td><input value='2' type='radio' name='";
	html[i++] = this._dailyRadioName;
	html[i++] = "' id='";
	html[i++] = this._dailyWeekdayId;
	html[i++] = "'></td>";
	html[i++] = "<td>";
	html[i++] = "<label for='";
	html[i++] = this._dailyWeekdayId;
	html[i++] = "'>";
	html[i++] = ZmMsg.recurDailyEveryWeekday;
	html[i++] = "</label>";
	html[i++] = "</td></tr>";
	// every <num> days
	html[i++] = "<tr><td><input value='3' type='radio' name='";
	html[i++] = this._dailyRadioName;
	html[i++] = "' id='";
	html[i++] = this._dailyFieldRadioId;
	html[i++] = "'></td><td>";
	html[i++] = "<table role='presentation'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurDailyEveryNumDays);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		html[i++] = "<td>";
		var segment = segments[s];
		if (segment instanceof AjxMessageFormat.MessageSegment &&
			segment.getIndex() == 0) {
			html[i++] = "<span id='";
			html[i++] = this._dailyFieldId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else {
			html[i++] = "<label for='";
                        html[i++] = this._dailyFieldRadioId;
                        html[i++] = "'>";
			html[i++] = segment.toSubPattern();
                        html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end table
	html[i++] = "</table>";
	return html.join("");
};

ZmApptRecurDialog.prototype._createRepeatWeekly = 
function(uid) {
	this._weeklyRadioName = "WEEKLY_RADIO_" + uid; //Dwt.getNextId();
	this._weeklyCheckboxName = "WEEKLY_CHECKBOX_NAME_" + uid ;//Dwt.getNextId();
	this._weeklyDefaultId = "WEEKLY_DEFAULT_" + uid ; //Dwt.getNextId();
	this._weeklySelectId = "WEEKLY_SELECT_" + uid ;//Dwt.getNextId();
	this._weeklyFieldRadioId = "WEEKLY_FIELD_RADIO_" + uid //Dwt.getNextId();
	this._weeklyFieldId = "WEEKLY_FIELD_" + uid ;//Dwt.getNextId();

	var html = new Array();
	var i = 0;

	// start table
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	// every <weekday>
	html[i++] = "<tr><td><input checked value='1' type='radio' name='";
	html[i++] = this._weeklyRadioName;
	html[i++] = "' id='";
	html[i++] = this._weeklyDefaultId;
	html[i++] = "'></td><td>";
	html[i++] = "<table role='presentation'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<td id='";
			html[i++] = this._weeklySelectId;
			html[i++] = "' style='padding:0 .5em'>";
		}
		else {
			html[i++] = "<td>";
			html[i++] = "<label for='";
			html[i++] = this._weeklyDefaultId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// every <num> weeks on <days of week>
	html[i++] = "<tr valign='top'><td><input value='2' type='radio' name='";
	html[i++] = this._weeklyRadioName;
	html[i++] = "' id='";
	html[i++] = this._weeklyFieldRadioId;
	html[i++] = "'></td>";
	html[i++] = "<td>";
	html[i++] = "<table role='presentation'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryNumWeeksDate);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<td id='";
			html[i++] = this._weeklyFieldId;
			html[i++] = "' style='padding:0 .5em'>";
		}
		else if (index == 1) {
			html[i++] = "<td>";
			html[i++] = "<table role='presentation' style='margin-top:.25em;'><tr>";
			for (var j = 0; j < AjxDateUtil.WEEKDAY_MEDIUM.length; j++) {
				var checkBoxId = Dwt.getNextId(this._weeklyCheckboxName + "_");
				html[i++] = "<td><input type='checkbox' name='";
				html[i++] = this._weeklyCheckboxName;
				html[i++] = "' id='"
				html[i++] = checkBoxId;
				html[i++] = "'></td><td style='padding-right:.75em;'>";
				html[i++] = "<label for='";
				html[i++] = checkBoxId;
				html[i++] = "'>";
				html[i++] = AjxDateUtil.WEEKDAY_MEDIUM[j];
				html[i++] = "</label>";
				html[i++] = "</td>";
			}
			html[i++] = "</tr></table>";
		}
		else if (index == 2) {
			html[i++] = "</td></tr></table>";
			html[i++] = "<table role='presentation'><tr>";
			continue;
		}
		else {
			html[i++] = "<td>";
			html[i++] = "<label for='";
			html[i++] = this._weeklyFieldRadioId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end table
	html[i++] = "</table>";

	return html.join("");
};

ZmApptRecurDialog.prototype._createRepeatMonthly = 
function(uid) {
	this._monthlyRadioName = "MONTHLY_RADIO_" + uid ;//Dwt.getNextId();
	this._monthlyDefaultId = "MONTHLY_DEFAULT_" + uid;// Dwt.getNextId();
	this._monthlyDayFieldId = "MONTHLY_DAY_FIELD_ID_" + uid; // Dwt.getNextId();
	this._monthlyMonthFieldId = "MONTHLY_MONTH_FIELD_" + uid; //Dwt.getNextId();
	this._monthlyFieldRadioId = "MONTHLY_FIELD_RADIO_" + uid; //Dwt.getNextId();
	this._monthlyDaySelectId = "MONTHLY_DAY_SELECT_" + uid; // Dwt.getNextId();
	this._monthlyWeekdaySelectId = "MONTHLY_WEEKDAY_SELECT_" + uid;// Dwt.getNextId();
	this._monthlyMonthFieldExId = "MONTHLY_MONTH_FIELD_EX_" + uid; // Dwt.getNextId();

	var html = new Array();
	var i = 0;

	// start table
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	// every <num> months on the <day>
	html[i++] = "<tr><td><input checked value='1' type='radio' name='";
	html[i++] = this._monthlyRadioName;
	html[i++] = "' id='";
	html[i++] = this._monthlyDefaultId;
	html[i++] = "'></td>";
	html[i++] = "<td>";
	html[i++] = "<table role='presentation' class='ZPropertySheet' cellspacing='6'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsDate);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		html[i++] = "<td>";
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<span id='";
			html[i++] = this._monthlyDayFieldId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else if (index == 1) {
			html[i++] = "<span id='";
			html[i++] = this._monthlyMonthFieldId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else {
			html[i++] = "<label for='";
			html[i++] = this._monthlyDefaultId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// every <num> months on the <ordinal> <weekday>
	html[i++] = "<tr><td><input value='2' type='radio' name='";
	html[i++] = this._monthlyRadioName;
	html[i++] = "' id='";
	html[i++] = this._monthlyFieldRadioId;
	html[i++] = "'></td>";
	html[i++] = "<td>";
	html[i++] = "<table role='presentation' class='ZPropertySheet' cellspacing='6'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsNumDay);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<td id='";
			html[i++] = this._monthlyDaySelectId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else if (index == 1) {
			html[i++] = "<td id='";
			html[i++] = this._monthlyWeekdaySelectId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else if (index == 2) {
			html[i++] = "<td><span id='";
			html[i++] = this._monthlyMonthFieldExId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else {
			html[i++] = "<td>";
			html[i++] = "<label for='";
			html[i++] = this._monthlyFieldRadioId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end table
	html[i++] = "</table>";

	return html.join("");
};

ZmApptRecurDialog.prototype._createRepeatYearly =
function(uid) {
	this._yearlyDefaultId = "YEALY_DEFAULT_" + uid ; //Dwt.getNextId();
	this._yearlyRadioName = "YEARLY_RADIO_" + uid; //Dwt.getNextId();
	this._yearlyMonthSelectId = "YEARLY_MONTH_SELECT_" + uid; // Dwt.getNextId();
	this._yearlyDayFieldId = "YEARLY_DAY_FIELD_" + uid; // Dwt.getNextId();
	this._yearlyDaySelectId = "YEARLY_DAY_SELECT_" + uid; // Dwt.getNextId();
	this._yearlyWeekdaySelectId ="YEARLY_WEEKDAY_SELECT_" + uid; //Dwt.getNextId();
	this._yearlyMonthSelectExId ="YEARLY_MONTH_SELECT_EX_" + uid; // Dwt.getNextId();
	this._yearlyFieldRadioId = "YEARLY_FIELD_RADIO_" + uid;// Dwt.getNextId();

	var html = new Array();
	var i = 0;

	// start table
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	// every year on <month> <day>
	html[i++] = "<tr><td><input checked value='1' type='radio' name='";
	html[i++] = this._yearlyRadioName;
	html[i++] = "' id='";
	html[i++] = this._yearlyDefaultId;
	html[i++] = "'></td><td>";
	html[i++] = "<table role='presentation' class='ZPropertySheet' cellspacing='6'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryDate);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<td id='";
			html[i++] = this._yearlyMonthSelectId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else if (index == 1) {
			html[i++] = "<td><span id='";
			html[i++] = this._yearlyDayFieldId;
			html[i++] = "' class='ZInlineInput'></span>";
		}
		else {
			html[i++] = "<td>";
			html[i++] = "<label for='";
			html[i++] = this._yearlyDefaultId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// every year on <ordinal> <weekday> of <month>
	html[i++] = "<tr><td><input value='2' type='radio' name='";
	html[i++] = this._yearlyRadioName;
	html[i++] = "' id='";
	html[i++] = this._yearlyFieldRadioId;
	html[i++] = "'></td><td>";
	html[i++] = "<table role='presentation' class='ZPropertySheet' cellspacing='6'><tr>";
	var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthNumDay);
	var segments = formatter.getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index == 0) {
			html[i++] = "<td id='";
			html[i++] = this._yearlyDaySelectId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else if (index == 1) {
			html[i++] = "<td id='";
			html[i++] = this._yearlyWeekdaySelectId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else if (index == 2) {
			html[i++] = "<td id='";
			html[i++] = this._yearlyMonthSelectExId;
			html[i++] = "' style='overflow:hidden;'>";
		}
		else {
			html[i++] = "<td>";
			html[i++] = "<label for='";
			html[i++] = this._yearlyFieldRadioId;
			html[i++] = "'>";
			html[i++] = segment.toSubPattern();
			html[i++] = "</label>";
		}
		html[i++] = "</td>";
	}
	html[i++] = "</tr></table>";
	html[i++] = "</td></tr>";
	// end table
	html[i++] = "</table>";
	return html.join("");
};

ZmApptRecurDialog.prototype._createDwtObjects =
function(uid) {
	// create all DwtSelect's
	this._createSelects();

	// create mini calendar button for end by field
	var dateButtonListener = new AjxListener(this, this._endByButtonListener);
	var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);
	ZmCalendarApp.createMiniCalButton(this, this._endByButtonId, dateButtonListener, dateCalSelectionListener, ZmMsg.endDate);

	// create all DwtInputField's
	this._createInputs(uid);
};

ZmApptRecurDialog.prototype._createSelects = 
function() {
	this._repeatSelect = new DwtSelect({parent:this});
	this._repeatSelect.addChangeListener(new AjxListener(this, this._repeatChangeListener));
	for (var i = 0; i < ZmApptRecurDialog.REPEAT_OPTIONS.length; i++) {
		var option = ZmApptRecurDialog.REPEAT_OPTIONS[i];
		this._repeatSelect.addOption(option.label, option.selected, option.value);
	}
	this._repeatSelect.reparentHtmlElement(this._repeatSelectId);
	delete this._repeatSelectId;

	var selectChangeListener = new AjxListener(this, this._selectChangeListener);
	this._weeklySelectButton = new DwtButton({parent:this});//new DwtSelect({parent:this});
    var wMenu = new ZmPopupMenu(this._weeklySelectButton);
    this._weeklySelectButton.setMenu(wMenu);
    //this._weeklySelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
	var dayFormatter = formatter.getFormatsByArgumentIndex()[0];
	var day = new Date();
	day.setDate(day.getDate() - day.getDay());
    var monwedfri = new Array();
    var tuethu = new Array();
    var satsun = new Array();
    for (var i = 0; i < 7; i++) {
		//this._weeklySelect.addOption(dayFormatter.format(day), false, i);
        var mi = new DwtMenuItem({parent:wMenu, radioGroupId:i});
        mi.setText(dayFormatter.format(day));
        mi.addSelectionListener(selectChangeListener);
        mi.setData("index",i);
        switch(day.getDay()){
            case AjxDateUtil.SUNDAY:
            case AjxDateUtil.SATURDAY: satsun.push(dayFormatter.format(day)); break;

            case AjxDateUtil.MONDAY:
            case AjxDateUtil.WEDNESDAY:
            case AjxDateUtil.FRIDAY: monwedfri.push(dayFormatter.format(day)); break;

            case AjxDateUtil.TUESDAY:
            case AjxDateUtil.THURSDAY: tuethu.push(dayFormatter.format(day)); break;
        }
        day.setDate(day.getDate() + 1);
	}
    //Separator
    new DwtMenuItem({parent:wMenu, style:DwtMenuItem.SEPARATOR_STYLE, radioGroupId:i++});  //Pos 7 is separator
    //Add some custom pattern options too
    //this._weeklySelect.addOption(monwedfri.join(", "), false, i++);
    var mi = new DwtMenuItem({parent:wMenu, radioGroupId:i});
    mi.setText(monwedfri.join(", "));
    mi.addSelectionListener(selectChangeListener);
    mi.setData("index",i++);
    //this._weeklySelect.addOption(tuethu.join(", "), false, i++);
    mi = new DwtMenuItem({parent:wMenu, radioGroupId:i});
    mi.setText(tuethu.join(", "));
    mi.addSelectionListener(selectChangeListener);
    mi.setData("index",i++);
    //Let's correct the sequence
    var satsun1 = [satsun[1],satsun[0]];
    //this._weeklySelect.addOption(satsun1.join(", "), false, i++);
    mi = new DwtMenuItem({parent:wMenu, radioGroupId:i});
    mi.setText(satsun1.join(", "));
    mi.addSelectionListener(selectChangeListener);
    mi.setData("index",i++);
    wMenu.setSelectedItem(new Date().getDay());
    this._weeklySelectButton.setText(wMenu.getItem(new Date().getDay()).getText());
    
    //this._weeklySelect.setv
    this._weeklySelectButton.reparentHtmlElement(this._weeklySelectId);
	delete this._weeklySelectId;

	this._monthlyDaySelect = new DwtSelect({parent:this});
	this._monthlyDaySelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsNumDay);
	var ordinalFormatter = formatter.getFormatsByArgumentIndex()[0];
	var limits = ordinalFormatter.getLimits();
	var formats = ordinalFormatter.getFormats();
	for (var i = 0; i < limits.length; i++) {
		var index = (i + 1) % limits.length;
		var label = formats[index].format();
		var value = Math.floor(limits[index]);
		this._monthlyDaySelect.addOption(label, false, value);
	}
	this._monthlyDaySelect.reparentHtmlElement(this._monthlyDaySelectId);
	delete this._monthlyDaySelectId;

	this._monthlyWeekdaySelect = new DwtSelect({parent:this});
	this._monthlyWeekdaySelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsNumDay);
	var dayFormatter = formatter.getFormatsByArgumentIndex()[1];
	var day = new Date();
	day.setDate(day.getDate() - day.getDay());

    this._monthlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleDay, false, ZmRecurrence.RECURRENCE_DAY);
    this._monthlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleWeekend, false, ZmRecurrence.RECURRENCE_WEEKEND);
    this._monthlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleWeekday, false, ZmRecurrence.RECURRENCE_WEEKDAY);

    for (var i = 0; i < 7; i++) {
		this._monthlyWeekdaySelect.addOption(dayFormatter.format(day), false, i);
		day.setDate(day.getDate() + 1);
	}
	this._monthlyWeekdaySelect.reparentHtmlElement(this._monthlyWeekdaySelectId);
	delete this._monthlyWeekdaySelectId;

	this._yearlyMonthSelect = new DwtSelect({parent:this});
	this._yearlyMonthSelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryDate);
	var monthFormatter = formatter.getFormatsByArgumentIndex()[0];
	var month = new Date();
	month.setDate(1);
	for (var i = 0; i < 12; i++) {
		month.setMonth(i);
		this._yearlyMonthSelect.addOption(monthFormatter.format(month), false, i);
	}
	this._yearlyMonthSelect.reparentHtmlElement(this._yearlyMonthSelectId);
	delete this._yearlyMonthSelectId;

	this._yearlyDaySelect = new DwtSelect({parent:this});
	this._yearlyDaySelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthNumDay);
	var ordinalFormatter = formatter.getFormatsByArgumentIndex()[0];
	var limits = ordinalFormatter.getLimits();
	var formats = ordinalFormatter.getFormats();
	for (var i = 0; i < limits.length; i++) {
		var index = (i + 1) % limits.length;
		var label = formats[index].format();
		var value = Math.floor(limits[index]);
		this._yearlyDaySelect.addOption(label, false, value);
	}
	this._yearlyDaySelect.reparentHtmlElement(this._yearlyDaySelectId);
	delete this._yearlyDaySelectId;

	this._yearlyWeekdaySelect = new DwtSelect({parent:this});
	this._yearlyWeekdaySelect.addChangeListener(selectChangeListener);
	var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthNumDay);
	var dayFormatter = formatter.getFormatsByArgumentIndex()[1];
	var day = new Date();
	day.setDate(day.getDate() - day.getDay());

    this._yearlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleDay, false, ZmRecurrence.RECURRENCE_DAY);
    this._yearlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleWeekend, false, ZmRecurrence.RECURRENCE_WEEKEND);
    this._yearlyWeekdaySelect.addOption(ZmMsg.recurrenceRuleWeekday, false, ZmRecurrence.RECURRENCE_WEEKDAY);

	for (var i = 0; i < 7; i++) {
		this._yearlyWeekdaySelect.addOption(dayFormatter.format(day), false, i);
		day.setDate(day.getDate() + 1);
	}
	this._yearlyWeekdaySelect.reparentHtmlElement(this._yearlyWeekdaySelectId);
	delete this._yearlyWeekdaySelectId;

	this._yearlyMonthSelectEx = new DwtSelect({parent:this});
	this._yearlyMonthSelectEx.addChangeListener(selectChangeListener);
	for (var i = 0; i < AjxDateUtil.MONTH_LONG.length; i++)
		this._yearlyMonthSelectEx.addOption(AjxDateUtil.MONTH_LONG[i], false, i);
	this._yearlyMonthSelectEx.reparentHtmlElement(this._yearlyMonthSelectExId);
	delete this._yearlyMonthSelectExId;
};

ZmApptRecurDialog.prototype._createInputs = 
function(uid) {
	// create inputs for end fields
	this._endIntervalField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
												initialValue: "1", size: 3, maxLen: 3,
												errorIconStyle: DwtInputField.ERROR_ICON_NONE, 
												validationStyle: DwtInputField.ONEXIT_VALIDATION, 
												validator: this._positiveIntValidator, 
												validatorCtxtObj: this, inputId:"RECUR_END_INTERVAL_FIELD_" + uid});
	this._endIntervalField.setDisplay(Dwt.DISPLAY_INLINE);
	this._endIntervalField.reparentHtmlElement(this._endIntervalFieldId);
	delete this._endIntervalFieldId;

	this._endByField = new DwtInputField({parent: this, type: DwtInputField.DATE,
										  size: 10, maxLen: 10,
										  errorIconStyle: DwtInputField.ERROR_ICON_NONE,
										  validationStyle: DwtInputField.ONEXIT_VALIDATION,
										  validator: this._endByDateValidator, 
										  validatorCtxtObj: this, inputId:"RECUR_END_BY_FIELD_" + uid});
	this._endByField.setDisplay(Dwt.DISPLAY_INLINE);
	this._endByField.reparentHtmlElement(this._endByFieldId);
	Dwt.setSize(this._endByField.getInputElement(), Dwt.DEFAULT, "22");
	delete this._endByFieldId;

	// create inputs for day fields
	this._dailyField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
										  initialValue: "2", size: 3, maxLen: 2,
										  errorIconStyle: DwtInputField.ERROR_ICON_NONE,
										  validationStyle: DwtInputField.ONEXIT_VALIDATION,
										  validator: this._positiveIntValidator,
										  validatorCtxtObj: this, inputId: "RECUR_DAILY_FIELD_" + uid});
	this._dailyField.setDisplay(Dwt.DISPLAY_INLINE);
	this._dailyField.reparentHtmlElement(this._dailyFieldId);
	delete this._dailyFieldId;

	// create inputs for week fields
	this._weeklyField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
										   initialValue: "1", size: 2, maxLen: 2,
										   errorIconStyle: DwtInputField.ERROR_ICON_NONE,
										   validationStyle: DwtInputField.ONEXIT_VALIDATION,
										   validator: this._weeklyValidator,
										   validatorCtxtObj: this, inputId:"RECUR_WEEKLY_FIELD_" + uid});
	this._weeklyField.setDisplay(Dwt.DISPLAY_INLINE);
	this._weeklyField.reparentHtmlElement(this._weeklyFieldId);
	delete this._weeklyFieldId;

	// create inputs for month fields
	this._monthlyDayField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
											   initialValue: "1", size: 2, maxLen: 2,
											   errorIconStyle: DwtInputField.ERROR_ICON_NONE,
											   validationStyle: DwtInputField.ONEXIT_VALIDATION,
											   validatorCtxtObj: this, inputId:"RECUR_MONTHLY_DAY_FIELD_" + uid});
	this._monthlyDayField.setDisplay(Dwt.DISPLAY_INLINE);
	this._monthlyDayField.reparentHtmlElement(this._monthlyDayFieldId);
	this._monthlyDayField.setValidNumberRange(1, 31);
	delete this._monthlyDayFieldId;

	this._monthlyMonthField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
											   initialValue: "1", size: 2, maxLen: 2,
											   errorIconStyle: DwtInputField.ERROR_ICON_NONE,
											   validationStyle: DwtInputField.ONEXIT_VALIDATION,
											   validator: this._positiveIntValidator,
											   validatorCtxtObj: this, inputId:"RECUR_MONTHLY_MONTH_FIELD_" + uid});
	this._monthlyMonthField.setDisplay(Dwt.DISPLAY_INLINE);
	this._monthlyMonthField.reparentHtmlElement(this._monthlyMonthFieldId);
	delete this._monthlyMonthFieldId;

	this._monthlyMonthFieldEx = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
												   initialValue: "1", size: 2, maxLen: 2,
												   errorIconStyle: DwtInputField.ERROR_ICON_NONE,
												   validationStyle: DwtInputField.ONEXIT_VALIDATION,
												   validator: this._positiveIntValidator,
												   validatorCtxtObj: this, inputId:"RECUR_MONTHLY_MONTH_FIELD_EX_" + uid});
	this._monthlyMonthFieldEx.setDisplay(Dwt.DISPLAY_INLINE);
	this._monthlyMonthFieldEx.reparentHtmlElement(this._monthlyMonthFieldExId);
	delete this._monthlyMonthFieldExId;

	// create inputs for year fields
	this._yearlyDayField = new DwtInputField({parent: this, type: DwtInputField.INTEGER,
											  initialValue: "1", size: 2, maxLen: 2,
											  errorIconStyle: DwtInputField.ERROR_ICON_NONE,
											  validationStyle: DwtInputField.ONEXIT_VALIDATION,
											  validator: this._yearlyDayValidator,
											  validatorCtxtObj: this, inputId:"RECUR_YEARLY_DAY_FIELD_" + uid});
	this._yearlyDayField.setDisplay(Dwt.DISPLAY_INLINE);
	this._yearlyDayField.reparentHtmlElement(this._yearlyDayFieldId);
	delete this._yearlyDayFieldId;
};

ZmApptRecurDialog.prototype._cacheFields = 
function() {
	this._noEndDateRadio = document.getElementById(this._noEndDateRadioId);			delete this._noEndDateRadioId;
	this._endByRadio = document.getElementById(this._endByRadioId); 				delete this._endByRadioId;
	this._endAfterRadio = document.getElementById(this._endAfterRadioId); 			delete this._endAfterRadioId;
	this._repeatSectionDiv = document.getElementById(this._repeatSectionId); 		delete this._repeatSectionId;
	this._repeatEndDiv = document.getElementById(this._repeatEndDivId);				delete this._repeatEndDivId;
	this._repeatDailyDiv = document.getElementById(this._repeatDailyId); 			delete this._repeatDailyId;
	this._repeatWeeklyDiv = document.getElementById(this._repeatWeeklyId); 			delete this._repeatWeeklyId;
	this._repeatMonthlyDiv = document.getElementById(this._repeatMonthlyId); 		delete this._repeatMonthlyId;
	this._repeatYearlyDiv = document.getElementById(this._repeatYearlyId); 			delete this._repeatYearlyId;
	this._dailyDefaultRadio = document.getElementById(this._dailyDefaultId); 		delete this._dailyDefaultId;
	this._dailyWeekdayRadio = document.getElementById(this._dailyWeekdayId);		delete this._dailyWeekdayId;
	this._dailyFieldRadio = document.getElementById(this._dailyFieldRadioId); 		delete this._dailyFieldRadioId;
	this._weeklyDefaultRadio = document.getElementById(this._weeklyDefaultId); 		delete this._weeklyDefaultId;
	this._weeklyFieldRadio = document.getElementById(this._weeklyFieldRadioId);		delete this._weeklyFieldRadioId;
	this._weeklyCheckboxes = document.getElementsByName(this._weeklyCheckboxName);
	this._monthlyDefaultRadio = document.getElementById(this._monthlyDefaultId); 	delete this._monthlyDefaultId;
	this._monthlyFieldRadio = document.getElementById(this._monthlyFieldRadioId); 	delete this._monthlyFieldRadioId;
	this._yearlyDefaultRadio = document.getElementById(this._yearlyDefaultId); 		delete this._yearlyDefaultId;
	this._yearlyFieldRadio = document.getElementById(this._yearlyFieldRadioId); 	delete this._yearlyFieldRadioId;
};

ZmApptRecurDialog.prototype._addEventHandlers = 
function() {
	var ardId = AjxCore.assignId(this);

	// add event listeners where necessary
	this._setFocusHandler(this._endIntervalField, ardId);
	this._setFocusHandler(this._endByField, ardId);
	this._setFocusHandler(this._dailyField, ardId);
	this._setFocusHandler(this._weeklyField, ardId);
	this._setFocusHandler(this._monthlyDayField, ardId);
	this._setFocusHandler(this._monthlyMonthField, ardId);
	this._setFocusHandler(this._monthlyMonthFieldEx, ardId);
	this._setFocusHandler(this._yearlyDayField, ardId);

	var cboxCount = this._weeklyCheckboxes.length;
	for (var i = 0; i < cboxCount; i++) {
		var checkbox = this._weeklyCheckboxes[i]; 
		Dwt.setHandler(checkbox, DwtEvent.ONFOCUS, ZmApptRecurDialog._onCheckboxFocus);
		checkbox._recurDialogId = ardId;
	}
};

ZmApptRecurDialog.prototype._createTabGroup = function() {
	var allId		= this._htmlElId;
	var repeatId	= allId+"_repeat";
	var endId		= allId+"_end";
	var controlsId	= allId+"_controls";

	// section tab groups
	this._sectionTabGroups = {};
	for (var i = 0; i < ZmApptRecurDialog.REPEAT_OPTIONS.length; i++) {
		var type = ZmApptRecurDialog.REPEAT_OPTIONS[i].value;
		this._sectionTabGroups[type] = new DwtTabGroup(repeatId+"_"+type);
	}

	// section: daily
	var daily = this._sectionTabGroups[ZmRecurrence.DAILY];
	daily.addMember(this._dailyDefaultRadio); // radio: every day
	daily.addMember(this._dailyWeekdayRadio); // radio: every weekday
	daily.addMember(this._dailyFieldRadio); // radio: every {# days}
	daily.addMember(this._dailyField); // input: # days
	// section: weekly
	var weekly = this._sectionTabGroups[ZmRecurrence.WEEKLY];
	weekly.addMember(this._weeklyDefaultRadio); // radio: every {day}
	weekly.addMember(this._weeklySelectButton); // select: day
	weekly.addMember(this._weeklyFieldRadio); // radio: every {# weeks} on {days}
	var checkboxes = new Array(this._weeklyCheckboxes.length);
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i] = this._weeklyCheckboxes[i];
	}
	this.__addTabMembers(
		weekly, ZmMsg.recurWeeklyEveryNumWeeksDate,
		this._weeklyField, // input: # weeks
		checkboxes // checkboxes: weekdays
	);

	// section: monthly
	var monthly = this._sectionTabGroups[ZmRecurrence.MONTHLY];
	monthly.addMember(this._monthlyDefaultRadio); // radio: day {date} of every {# months}
	this.__addTabMembers(
		monthly, ZmMsg.recurMonthlyEveryNumMonthsDate,
		this._monthlyDayField, // input: date
		this._monthlyMonthField // input: # months
	);
	monthly.addMember(this._monthlyFieldRadio); // radio: {ordinal} {weekday} of every {# months}
	this.__addTabMembers(
		monthly, ZmMsg.recurMonthlyEveryNumMonthsNumDay,
		this._monthlyDaySelect, // select: ordinal
		this._monthlyWeekdaySelect, // select: weekday
		this._monthlyMonthFieldEx // input: # months
	);

	// section: yearly
	var yearly = this._sectionTabGroups[ZmRecurrence.YEARLY];
	yearly.addMember(this._yearlyDefaultRadio); // radio: every year on {month} {date}
	this.__addTabMembers(
		yearly, ZmMsg.recurYearlyEveryDate,
		this._yearlyMonthSelect, // select: month
		this._yearlyDayField // input: date
	);
	yearly.addMember(this._yearlyFieldRadio); // radio: {ordinal} {weekday} of every {month}
	this.__addTabMembers(
		yearly, ZmMsg.recurYearlyEveryMonthNumDay,
		this._yearlyDaySelect, // select: ordinal
		this._yearlyWeekdaySelect, // select: weekday
		this._yearlyMonthSelectEx // select: month
	);

	// misc. tab groups
	this._repeatTabGroup = new DwtTabGroup(repeatId);
	this._endTabGroup = new DwtTabGroup(endId);
	this._endTabGroup.addMember(this._noEndDateRadio); // radio: none
	this._endTabGroup.addMember(this._endAfterRadio); // radio: after {# occurrences}
	this._endTabGroup.addMember(this._endIntervalField); // input: # occurrences
	this._endTabGroup.addMember(this._endByRadio); // radio: end by {date}
	this._endTabGroup.addMember(this._endByField); // input: date
	this._endTabGroup.addMember(); // button: date picker

	this._controlsTabGroup = new DwtTabGroup(controlsId);

	// primary tab group
	this._tabGroup = new DwtTabGroup(allId);
	this._tabGroup.addMember(this._repeatSelect);
	this._tabGroup.addMember(this._controlsTabGroup);
	this._tabGroup.addMember(this.getButton(DwtDialog.OK_BUTTON));
	this._tabGroup.addMember(this.getButton(DwtDialog.CANCEL_BUTTON));
};

ZmApptRecurDialog.prototype.__addTabMembers =
function(tabGroup, pattern, member1 /*, ..., memberN */) {
	var segments = new AjxMessageFormat(pattern).getSegments();
	for (var s = 0; s < segments.length; s++) {
		var segment = segments[s];
		var index = segment instanceof AjxMessageFormat.MessageSegment
				  ? segment.getIndex() : -1;
		if (index != -1) {
			var member = arguments[2 + index];
			if (member instanceof Array) {
				for (var i = 0; i < member.length; i++) {
					tabGroup.addMember(member[i]);
				}
			}
			else {
				tabGroup.addMember(member);
			}
		}
	}
};

ZmApptRecurDialog.prototype._setFocusHandler = 
function(dwtObj, ardId) {
	var inputEl = dwtObj.getInputElement();
	Dwt.setHandler(inputEl, DwtEvent.ONFOCUS, ZmApptRecurDialog._onFocus);
	inputEl._recurDialogId = ardId;
}

ZmApptRecurDialog.prototype._setRepeatSection = 
function(repeatType) {
	var isNone = repeatType == ZmRecurrence.NONE;

    Dwt.setVisible(this._repeatSectionDiv, !isNone);
    Dwt.setVisible(this._repeatEndDiv, !isNone);

	var newSection = null;
	switch (repeatType) {
		case ZmRecurrence.DAILY:	newSection = this._repeatDailyDiv; break;
		case ZmRecurrence.WEEKLY:	newSection = this._repeatWeeklyDiv; break;
		case ZmRecurrence.MONTHLY:	newSection = this._repeatMonthlyDiv; break;
		case ZmRecurrence.YEARLY:	newSection = this._repeatYearlyDiv; break;
	}

	this._controlsTabGroup.removeAllMembers();
	if (newSection) {
		if (this._currentSection) {
			Dwt.setVisible(this._currentSection, false);
		}
        Dwt.setVisible(newSection, true);
        this._currentSection = newSection;

        this._repeatTabGroup.removeAllMembers();
        this._repeatTabGroup.addMember(this._sectionTabGroups[repeatType]);

        this._controlsTabGroup.addMember(this._repeatTabGroup);
        this._controlsTabGroup.addMember(this._endTabGroup);

        this.resizeSelect(repeatType);
	}
};

ZmApptRecurDialog.prototype.resizeSelect =
function(repeatType) {
    if(repeatType = ZmRecurrence.MONTHLY) {
        this._resizeSelect(this._monthlyDaySelect);
        this._resizeSelect(this._monthlyWeekdaySelect);
    }

    if(repeatType = ZmRecurrence.YEARLY) {
        this._resizeSelect(this._yearlyMonthSelect);
        this._resizeSelect(this._yearlyDaySelect);
        this._resizeSelect(this._yearlyWeekdaySelect);
        this._resizeSelect(this._yearlyMonthSelectEx);
    }
};

ZmApptRecurDialog.prototype._resizeSelect =
function(selectObj) {
    if(!selectObj) return;
    selectObj.autoResize();
};


ZmApptRecurDialog.prototype._cleanup =
function() {
	// dont bother cleaning up if user is still mucking around
	if (this._saveState) return;

	// TODO: 
	// - dont cleanup for section that was picked if user clicks OK
	
	// reset end section
	this._noEndDateRadio.checked = true;
	this._endIntervalField.setValue("1");
	// reset daily section
	this._dailyDefaultRadio.checked = true;
	this._dailyField.setValue("2");
	// reset weekly section
	this._weeklyDefaultRadio.checked = true;
	this._weeklyField.setValue("2");
	for (var i = 0; i < this._weeklyCheckboxes.length; i++)
		this._weeklyCheckboxes[i].checked = false;
	// reset monthly section
	this._monthlyDefaultRadio.checked = true;
	this._monthlyMonthField.setValue("1");
	this._monthlyMonthFieldEx.setValue("1");
	this._monthlyDaySelect.setSelected(0);
	// reset yearly section
	this._yearlyDefaultRadio.checked = true;
	this._yearlyDaySelect.setSelected(0);
};

ZmApptRecurDialog.prototype._getRadioOptionValue = 
function(radioName) {	
	var options = document.getElementsByName(radioName);
	if (options) {
		for (var i = 0; i < options.length; i++) {
			if (options[i].checked)
				return options[i].value;
		}
	}
	return null;
};

// depending on the repeat type, populates repeat section as necessary
ZmApptRecurDialog.prototype._populateForEdit = 
function(appt) {
    var recur = appt._recurrence;
	if (recur.repeatType == ZmRecurrence.NONE) return;

	if (recur.repeatType == ZmRecurrence.DAILY) {
		var dailyRadioOptions = document.getElementsByName(this._dailyRadioName);
		if (recur.repeatWeekday) {
			dailyRadioOptions[1].checked = true;
		} else if (recur.repeatCustomCount > 1) {
			this._dailyField.setValue(recur.repeatCustomCount);
			dailyRadioOptions[2].checked = true;
		}
	} else if (recur.repeatType == ZmRecurrence.WEEKLY) {
		var weeklyRadioOptions = document.getElementsByName(this._weeklyRadioName);
		if (recur.repeatCustomCount == 1 && recur.repeatWeeklyDays.length == 1) {
			weeklyRadioOptions[0].checked = true;
            //Do not check the custom checkboxes if every weekday option is selected
            this._weeklyCheckboxes[this._startDate.getDay()].checked = false;
			for (var j = 0; j < ZmCalItem.SERVER_WEEK_DAYS.length; j++) {
				if (recur.repeatWeeklyDays[0] == ZmCalItem.SERVER_WEEK_DAYS[j]) {
					this._weeklySelectButton._selected = j;
                    this._weeklySelectButton.setDisplayState(DwtControl.SELECTED);

                    var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
                    var dayFormatter = formatter.getFormatsByArgumentIndex()[0];
                    this._weeklySelectButton.setText(dayFormatter.format(this._startDate));

                    break;
				}
			}
		} else {
			weeklyRadioOptions[1].checked = true;
			this._weeklyField.setValue(recur.repeatCustomCount);
			// xxx: minor hack-- uncheck this since we init'd it earlier
			// Check if we have repeatWeeklyDays set
			if (recur.repeatWeeklyDays.length) {
                this._weeklyCheckboxes[this._startDate.getDay()].checked = false;
            }
			for (var i = 0; i < recur.repeatWeeklyDays.length; i++) {
				for (var j = 0; j < ZmCalItem.SERVER_WEEK_DAYS.length; j++) {
					if (recur.repeatWeeklyDays[i] == ZmCalItem.SERVER_WEEK_DAYS[j]) {
						this._weeklyCheckboxes[j].checked = true;
						break;
					}
				}
			}
		}
	} else if (recur.repeatType == ZmRecurrence.MONTHLY) {
		var monthlyRadioOptions = document.getElementsByName(this._monthlyRadioName);
		if (recur.repeatCustomType == "S") {
			monthlyRadioOptions[0].checked = true;
			this._monthlyDayField.setValue(recur.repeatMonthlyDayList[0]);
			this._monthlyMonthField.setValue(recur.repeatCustomCount);
		} else {
			monthlyRadioOptions[1].checked = true;
			this._monthlyDaySelect.setSelectedValue(recur.repeatBySetPos);

            if(recur.repeatCustomDays) {
                var monthlyDay = this.getRecurrenceWeekDaySelection(recur.repeatCustomDays);
                this._monthlyWeekdaySelect.setSelectedValue(monthlyDay);
            }
			this._monthlyMonthFieldEx.setValue(recur.repeatCustomCount);
		}
	} else if (recur.repeatType == ZmRecurrence.YEARLY) {
		var yearlyRadioOptions = document.getElementsByName(this._yearlyRadioName);
		if (recur.repeatCustomType == "S") {
			yearlyRadioOptions[0].checked = true;
			this._yearlyDayField.setValue(recur.repeatCustomMonthDay);
			this._yearlyMonthSelect.setSelectedValue(Number(recur.repeatYearlyMonthsList)-1);
		} else {
			yearlyRadioOptions[1].checked = true;
			this._yearlyDaySelect.setSelectedValue(recur.repeatBySetPos);

            if(recur.repeatCustomDays) {
                var weekDayVal = this.getRecurrenceWeekDaySelection(recur.repeatCustomDays);
                this._yearlyWeekdaySelect.setSelectedValue(weekDayVal);
            }
			this._yearlyMonthSelectEx.setSelectedValue(Number(recur.repeatYearlyMonthsList)-1);
		}
	}

	// populate recurrence ending rules
	if (recur.repeatEndType != "N") {
		var endRadioOptions = document.getElementsByName(this._repeatEndName);
		if (recur.repeatEndType == "A") {
			endRadioOptions[1].checked = true;
			this._endIntervalField.setValue(recur.repeatEndCount);
		} else {
			endRadioOptions[2].checked = true;
			this._endByField.setValue(AjxDateUtil.simpleComputeDateStr(recur.repeatEndDate));
		}
	}
};

/**
 * Gets the week day selection.
 * 
 * @param	{String}	repeatCustomDays		the repeat custom days
 * 
 * @return	{constant}	the week day selection (see <code>ZmRecurrence.RECURRENCE_</code> constants
 * @see	ZmRecurrence
 */
ZmApptRecurDialog.prototype.getRecurrenceWeekDaySelection =
function(repeatCustomDays) {

    if(repeatCustomDays instanceof Array) {
        repeatCustomDays = repeatCustomDays.join(",");
    }

    if(repeatCustomDays == ZmCalItem.SERVER_WEEK_DAYS.join(",")) {
        return ZmRecurrence.RECURRENCE_DAY;
    }

    var weekDays = ZmCalItem.SERVER_WEEK_DAYS.slice(1,6);
    if(repeatCustomDays == weekDays.join(",")) {
        return ZmRecurrence.RECURRENCE_WEEKDAY;
    }

    var weekEndDays = [ZmCalItem.SERVER_WEEK_DAYS[0], ZmCalItem.SERVER_WEEK_DAYS[6]];
    if(repeatCustomDays == weekEndDays.join(",")) {
        return ZmRecurrence.RECURRENCE_WEEKEND;
    }


    for (var i = 0; i < ZmCalItem.SERVER_WEEK_DAYS.length; i++) {
        if (ZmCalItem.SERVER_WEEK_DAYS[i] == repeatCustomDays) {
            return i;
            break;
        }
    }

};

ZmApptRecurDialog.prototype.getWeekdaySelectValue =
function(weekdaySelect) {

    var day = weekdaySelect.getValue();

    if(ZmCalItem.SERVER_WEEK_DAYS[day]) {
        return [ZmCalItem.SERVER_WEEK_DAYS[day]];        
    }

    if(day == ZmRecurrence.RECURRENCE_DAY) {
        return ZmCalItem.SERVER_WEEK_DAYS;
    }else if(day == ZmRecurrence.RECURRENCE_WEEKDAY) {
        return ZmCalItem.SERVER_WEEK_DAYS.slice(1,6);
    }else if(day == ZmRecurrence.RECURRENCE_WEEKEND) {
        return [ZmCalItem.SERVER_WEEK_DAYS[0], ZmCalItem.SERVER_WEEK_DAYS[6]];
    }

};

ZmApptRecurDialog.prototype.getFirstWeekDayOffset =
function(weekDaySelect) {
    var weekDayVal = weekDaySelect.getValue();
    var dayVal = 0;
    if(ZmCalItem.SERVER_WEEK_DAYS[weekDayVal]) {
       dayVal = weekDayVal;
    }else if(weekDayVal == ZmRecurrence.RECURRENCE_DAY || weekDayVal == ZmRecurrence.RECURRENCE_WEEKEND) {
        //if the selection is just the day or weekend than first day (Sunday) is selected
        dayVal = 0;
    }else if(weekDayVal == ZmRecurrence.RECURRENCE_WEEKDAY) {
        dayVal = 1;
    }
    return dayVal;
};

ZmApptRecurDialog.prototype.getPossibleStartDate =
function(weekDayVal, lastDate, repeatBySetPos, ignoreOffset) {
    //weekday select might contain normal weekdays, day, weekend values also
    if(ZmCalItem.SERVER_WEEK_DAYS[weekDayVal]) {
        return AjxDateUtil.getDateForThisDay(lastDate, weekDayVal, repeatBySetPos); //Last day of next month/year
    }else if(weekDayVal == ZmRecurrence.RECURRENCE_DAY) {
        var dayOffset = ((repeatBySetPos==-1 || ignoreOffset) ? 0 : (repeatBySetPos-1));
        lastDate.setDate(lastDate.getDate() + dayOffset);
        return lastDate;
    }else if(weekDayVal == ZmRecurrence.RECURRENCE_WEEKDAY) {
        return AjxDateUtil.getDateForThisWorkWeekDay(lastDate, repeatBySetPos);
    }else if(weekDayVal == ZmRecurrence.RECURRENCE_WEEKEND) {
        var lastSunday = AjxDateUtil.getDateForThisDay(lastDate, AjxDateUtil.SUNDAY, repeatBySetPos);
        var lastSaturday = AjxDateUtil.getDateForThisDay(lastDate, AjxDateUtil.SATURDAY, repeatBySetPos);
        //nearest possible weekend
        if(repeatBySetPos < 0) {
            return (lastSaturday.getTime() > lastSunday.getTime()) ? lastSaturday : lastSunday;
        }else {
            return (lastSaturday.getTime() > lastSunday.getTime()) ? lastSunday : lastSaturday;                        
        }
    }
}
// Listeners

ZmApptRecurDialog.prototype._repeatChangeListener =
function(ev) {
	var newValue = ev._args.newValue;
	this._setRepeatSection(newValue);
};

ZmApptRecurDialog.prototype._selectChangeListener = 
function(ev) {
    if(ev.item && ev.item instanceof DwtMenuItem && this.getSelectedRepeatValue() == ZmRecurrence.WEEKLY){
       this._weeklyDefaultRadio.checked = true;
       this._weeklySelectButton.setText(ev.item.getText());
       this._weeklySelectButton._selected = ev.item.getData("index");
       this._weeklySelectButton.setDisplayState(DwtControl.SELECTED);
       return;
    }
    switch (ev._args.selectObj) {
		case this._weeklySelectButton:			this._weeklyDefaultRadio.checked = true; break;
		case this._monthlyDaySelect:
		case this._monthlyWeekdaySelect:	this._monthlyFieldRadio.checked = true; break;
		case this._yearlyMonthSelect:
			this._yearlyDefaultRadio.checked = true;
			this._yearlyDayField.validate();
			break;
		case this._yearlyDaySelect:
		case this._yearlyWeekdaySelect:
		case this._yearlyMonthSelectEx: 	this._yearlyFieldRadio.checked = true; break;
	}
};

ZmApptRecurDialog.prototype._endByButtonListener = 
function(ev) {
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	var initDate = this._endByField.isValid()
		? new Date(AjxDateUtil.simpleParseDateStr(this._endByField.getValue()))
		: new Date();
	cal.setDate(initDate, true);
	ev.item.popup();
};

ZmApptRecurDialog.prototype._dateCalSelectionListener = 
function(ev) {
	this._endByField.setValue(AjxDateUtil.simpleComputeDateStr(ev.detail));
	this._endByRadio.checked = true;
};

ZmApptRecurDialog.prototype._okListener = 
function() {
	this._saveState = true;
	this._isDirty = true;
};

ZmApptRecurDialog.prototype._cancelListener = 
function() {
	this._cleanup();
};


// Callbacks

ZmApptRecurDialog.prototype._positiveIntValidator =
function(value) {
	DwtInputField.validateInteger(value);
	if (parseInt(value) < 1) {
		throw ZmMsg.errorLessThanOne;
	}
	return value;
};

ZmApptRecurDialog.prototype._yearlyDayValidator =
function(value) {
	DwtInputField.validateInteger(value);
	var dpm = AjxDateUtil._daysPerMonth[this._yearlyMonthSelect.getValue()];
	if (value < 1)
		throw AjxMessageFormat.format(AjxMsg.numberLessThanMin, 1);
	if (value > dpm) {
		throw AjxMessageFormat.format(AjxMsg.numberMoreThanMax, dpm);
	}
	return value;
};

ZmApptRecurDialog.prototype._endByDateValidator =
function(value) {
	DwtInputField.validateDate(value);
	var endByDate = AjxDateUtil.simpleParseDateStr(value);
	if (endByDate == null || endByDate.valueOf() < this._startDate.valueOf()) {
		throw ZmMsg.errorEndByDate;
	}
	return value;
};

ZmApptRecurDialog.prototype._weeklyValidator =
function(value) {
	value = this._positiveIntValidator(value);
	// make sure at least one day of the week is selected
	var checked = false;
	for (var i=0; i<this._weeklyCheckboxes.length; i++) {
		if (this._weeklyCheckboxes[i].checked) {
			checked = true;
			break;
		}
	}
	if (!checked) {
		throw ZmMsg.errorNoWeekdayChecked;
	}
	return value;
};


// Static methods

ZmApptRecurDialog._onCheckboxFocus = function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var ard = AjxCore.objectWithId(el._recurDialogId);
	ard._weeklyFieldRadio.checked = true;
};

ZmApptRecurDialog._onFocus =
function(ev) {
	ev || (ev = window.event);

	var el = DwtUiEvent.getTarget(ev);
	var ard = AjxCore.objectWithId(el._recurDialogId);
	var dwtObj = DwtControl.findControl(el);
	switch (dwtObj) {
		case ard._endIntervalField: 	ard._endAfterRadio.checked = true; break;
		case ard._endByField: 			ard._endByRadio.checked = true; break;
		case ard._dailyField: 			ard._dailyFieldRadio.checked = true; break;
		case ard._weeklyField: 			ard._weeklyFieldRadio.checked = true; break;
		case ard._monthlyMonthField:
		case ard._monthlyDayField: 		ard._monthlyDefaultRadio.checked = true; break;
		case ard._monthlyMonthFieldEx: 	ard._monthlyFieldRadio.checked = true; break;
		case ard._yearlyDayField: 		ard._yearlyDefaultRadio.checked = true; break;
	}

	appCtxt.getKeyboardMgr().grabFocus(dwtObj);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptViewHelper")) {
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
 * Does nothing.
 * @constructor
 * @class
 * This static class provides utility functions for dealing with appointments
 * and their related forms and views.
 *
 * @author Parag Shah
 * @author Conrad Damon
 *
 * - Helper methods shared by several views associated w/ creating new appointments.
 *   XXX: move to new files when fully baked!
 *   
 * @private
 */
ZmApptViewHelper = function() {
};

ZmApptViewHelper.REPEAT_OPTIONS = [
	{ label: ZmMsg.none, 				value: "NON", 	selected: true 	},
	{ label: ZmMsg.everyDay, 			value: "DAI", 	selected: false },
	{ label: ZmMsg.everyWeek, 			value: "WEE", 	selected: false },
	{ label: ZmMsg.everyMonth, 			value: "MON", 	selected: false },
	{ label: ZmMsg.everyYear, 			value: "YEA", 	selected: false },
	{ label: ZmMsg.custom, 				value: "CUS", 	selected: false }];


ZmApptViewHelper.SHOWAS_OPTIONS = [
	{ label: ZmMsg.free, 				value: "F", 	selected: false },
	{ label: ZmMsg.organizerTentative, 		value: "T", 	selected: false },
	{ label: ZmMsg.busy, 				value: "B", 	selected: true  },
	{ label: ZmMsg.outOfOffice,			value: "O", 	selected: false }
];

/**
 * returns the label of the option specified by it's value. This is used in calendar.Appointment#Tooltip template
 *
 * @param value
 * returns the label
 */
ZmApptViewHelper.getShowAsOptionLabel =
function(value) {

	for (var i = 0; i < ZmApptViewHelper.SHOWAS_OPTIONS.length; i++) {
		var option = ZmApptViewHelper.SHOWAS_OPTIONS[i];
		if (option.value == value) {
			return option.label;
		}
	}
};


/**
 * Gets an object with the indices of the currently selected time fields.
 *
 * @param {ZmApptEditView}	tabView		the edit/tab view containing time widgets
 * @param {Hash}	dateInfo	a hash of date info to fill in
 */
ZmApptViewHelper.getDateInfo =
function(tabView, dateInfo) {
	dateInfo.startDate = tabView._startDateField.value;
	dateInfo.endDate = tabView._endDateField.value;
    var tzoneSelect = tabView._tzoneSelect || tabView._tzoneSelectStart;
    dateInfo.timezone = tzoneSelect ? tzoneSelect.getValue() : "";
    if (tabView._allDayCheckbox && tabView._allDayCheckbox.checked) {
		dateInfo.showTime = false;

        //used by DwtTimeInput - advanced time picker
        dateInfo.startTimeStr = dateInfo.endTimeStr = null;

        //used by DwtTimeSelect
        dateInfo.startHourIdx = dateInfo.startMinuteIdx = dateInfo.startAmPmIdx =
		dateInfo.endHourIdx = dateInfo.endMinuteIdx = dateInfo.endAmPmIdx = null;

        dateInfo.isAllDay = true;
    } else {
		dateInfo.showTime = true;

        if(tabView._startTimeSelect instanceof DwtTimeSelect) {
            dateInfo.startHourIdx = tabView._startTimeSelect.getSelectedHourIdx();
            dateInfo.startMinuteIdx = tabView._startTimeSelect.getSelectedMinuteIdx();
            dateInfo.startAmPmIdx = tabView._startTimeSelect.getSelectedAmPmIdx();
            dateInfo.endHourIdx = tabView._endTimeSelect.getSelectedHourIdx();
            dateInfo.endMinuteIdx = tabView._endTimeSelect.getSelectedMinuteIdx();
            dateInfo.endAmPmIdx = tabView._endTimeSelect.getSelectedAmPmIdx();
        }else {
            dateInfo.startHourIdx = dateInfo.startMinuteIdx = dateInfo.startAmPmIdx =
            dateInfo.endHourIdx = dateInfo.endMinuteIdx = dateInfo.endAmPmIdx = null;            
        }

        if(tabView._startTimeSelect instanceof DwtTimeInput) {
            dateInfo.startTimeStr = tabView._startTimeSelect.getTimeString();
            dateInfo.endTimeStr = tabView._endTimeSelect.getTimeString();
        }else {
            dateInfo.startTimeStr = dateInfo.endTimeStr = null;
        }

        dateInfo.isAllDay = false;
	}
};

ZmApptViewHelper.handleDateChange = 
function(startDateField, endDateField, isStartDate, skipCheck, oldStartDate) {
	var needsUpdate = false;
	var sd = AjxDateUtil.simpleParseDateStr(startDateField.value);
	var ed = AjxDateUtil.simpleParseDateStr(endDateField.value);

	// if start date changed, reset end date if necessary
	if (isStartDate) {
		// if date was input by user and it's foobar, reset to today's date
		if (!skipCheck) {
			// Bug fix for https://jira.corp.synacor.com/browse/ZCS-207. Do not allow past appointments less than year 1900
			if (sd == null || isNaN(sd)) {
				sd = new Date();
			}
			// always reset the field value in case user entered date in wrong format
			startDateField.value = AjxDateUtil.simpleComputeDateStr(sd);
		}

		if (ed.valueOf() < sd.valueOf()) {
			endDateField.value = startDateField.value;
        }else if(oldStartDate != null) {
            var delta = ed.getTime() - oldStartDate.getTime();
            var newEndDate = new Date(sd.getTime() + delta);
            endDateField.value = AjxDateUtil.simpleComputeDateStr(newEndDate);
        }
		needsUpdate = true;
	} else {
		// if date was input by user and it's foobar, reset to today's date
		if (!skipCheck) {
			if (ed == null || isNaN(ed)) {
				ed = new Date();
			}
			// always reset the field value in case user entered date in wrong format
			endDateField.value = AjxDateUtil.simpleComputeDateStr(ed);
		}

		// otherwise, reset start date if necessary
		if (sd.valueOf() > ed.valueOf()) {
			startDateField.value = endDateField.value;
			needsUpdate = true;
		}
	}

	return needsUpdate;
};

ZmApptViewHelper.getApptToolTipText =
function(origAppt, controller) {
    if(origAppt._toolTip) {
        return origAppt._toolTip;
    }
    var appt = ZmAppt.quickClone(origAppt);
    var organizer = appt.getOrganizer();
	var sentBy = appt.getSentBy();
	var userName = appCtxt.get(ZmSetting.USERNAME);
	if (sentBy || (organizer && organizer != userName)) {
		organizer = (appt.message && appt.message.invite && appt.message.invite.getOrganizerName()) || organizer;
		if (sentBy) {
			var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
			var contact = contactsApp && contactsApp.getContactByEmail(sentBy);
			sentBy = (contact && contact.getFullName()) || sentBy;
		}
	} else {
		organizer = null;
		sentBy = null;
	}

	var params = {
		appt: appt,
		cal: (appt.folderId != ZmOrganizer.ID_CALENDAR && controller) ? controller.getCalendar() : null,
		organizer: organizer,
		sentBy: sentBy,
		when: appt.getDurationText(false, false),
		location: appt.getLocation(),
		width: "250",
        hideAttendees: true
	};

	var toolTip = origAppt._toolTip = AjxTemplate.expand("calendar.Appointment#Tooltip", params);
    return toolTip;
};


ZmApptViewHelper.getDayToolTipText =
function(date, list, controller, noheader, emptyMsg, isMinical, getSimpleToolTip) {
	
	if (!emptyMsg) {
		emptyMsg = ZmMsg.noAppts;
	}

	var html = new AjxBuffer();

	var formatter = DwtCalendar.getDateFullFormatter();	
	var title = formatter.format(date);
	
	html.append("<div>");

	html.append("<table role='presentation' cellpadding='0' cellspacing='0' border='0'>");
	if (!noheader) html.append("<tr><td><div class='calendar_tooltip_month_day_label'>", title, "</div></td></tr>");
	html.append("<tr><td>");
	html.append("<table role='presentation' cellpadding='1' cellspacing='0' border='0'>");
	
	var size = list ? list.size() : 0;

	var useEmptyMsg = true;
	var dateTime = date.getTime();
	for (var i = 0; i < size; i++) {
		var ao = list.get(i);
		var isAllDay = ao.isAllDayEvent();
		if (isAllDay || getSimpleToolTip) {
			// Multi-day "appts/all day events" will be broken up into one sub-appt per day, so only show
			// the one that matches the selected date
			var apptDate = new Date(ao.startDate.getTime());
			apptDate.setHours(0,0,0,0);
			if (apptDate.getTime() != dateTime) continue;
		}

		if (isAllDay && !getSimpleToolTip) {
			useEmptyMsg = false;
			if(!isMinical && ao.toString() == "ZmAppt") {
				html.append("<tr><td><div class=appt>");
				html.append(ZmApptViewHelper.getApptToolTipText(ao, controller));
				html.append("</div></td></tr>");
			}
			else {
				//DBG.println("AO    "+ao);
				var widthField = AjxEnv.isIE ? "width:500px;" : "min-width:300px;";
				html.append("<tr><td><div style='" + widthField + "' class=appt>");
				html.append(ZmApptViewHelper._allDayItemHtml(ao, Dwt.getNextId(), controller, true, true));
				html.append("</div></td></tr>");
			}
		}
		else {
			useEmptyMsg = false;
			if (!isMinical && ao.toString() == "ZmAppt") {
				html.append("<tr><td><div class=appt>");
				html.append(ZmApptViewHelper.getApptToolTipText(ao, controller));
				html.append("</div></td></tr>");
			}
			else {
				var color = ZmCalendarApp.COLORS[controller.getCalendarColor(ao.folderId)];
				var isNew = ao.status == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
				html.append("<tr><td class='calendar_month_day_item'><div class='", color, isNew ? "DarkC" : "C", "'>");
				if (isNew) html.append("<b>");
				
				var dur; 
				if (isAllDay) {
					dur = ao._orig.getDurationText(false, false, true)
				} 
				else {
					//html.append("&bull;&nbsp;");
					//var dur = ao.getShortStartHour();
					dur = getSimpleToolTip ? ao._orig.getDurationText(false,false,true) : ao.getDurationText(false,false);
				}
				html.append(dur);
				if (dur != "") {
					html.append("&nbsp;");
					if (isAllDay) { 
						html.append("-&nbsp"); 
					}
				}   
				html.append(AjxStringUtil.htmlEncode(ao.getName()));
				
				if (isNew) html.append("</b>");
				html.append("</div>");
				html.append("</td></tr>");
			}
		}
	}
	if (useEmptyMsg) {
		html.append("<tr><td>"+emptyMsg+"</td></tr>");
	}
	html.append("</table>");
	html.append("</td></tr></table>");
	html.append("</div>");

	return html.toString();
};

/**
 * Returns a list of calendars based on certain conditions. Especially useful
 * for multi-account
 *
 * @param folderSelect	[DwtSelect]		DwtSelect object to populate
 * @param folderRow		[HTMLElement]	Table row element to show/hide
 * @param calendarOrgs	[Object]		Hash map of calendar ID to calendar owner
 * @param calItem		[ZmCalItem]		a ZmAppt or ZmTask object
 */
ZmApptViewHelper.populateFolderSelect =
function(folderSelect, folderRow, calendarOrgs, calItem) {
	// get calendar folders (across all accounts)
	var org = ZmOrganizer.ITEM_ORGANIZER[calItem.type];
	var data = [];
	var folderTree;
	var accounts = appCtxt.accountList.visibleAccounts;
	for (var i = 0; i < accounts.length; i++) {
		var acct = accounts[i];

		var appEnabled = ZmApp.SETTING[ZmItem.APP[calItem.type]];
		if ((appCtxt.isOffline && acct.isMain) ||
			!appCtxt.get(appEnabled, null, acct))
		{
			continue;
		}

		folderTree = appCtxt.getFolderTree(acct);
		data = data.concat(folderTree.getByType(org));
	}

	// add the local account last for multi-account
	if (appCtxt.isOffline) {
		folderTree = appCtxt.getFolderTree(appCtxt.accountList.mainAccount);
		data = data.concat(folderTree.getByType(org));
	}

	folderSelect.clearOptions();
    
	for (var i = 0; i < data.length; i++) {
		var cal = data[i];
		var acct = cal.getAccount();

		if (cal.noSuchFolder || cal.isFeed() || (cal.link && cal.isReadOnly()) || cal.isInTrash()) { continue; }

		if (appCtxt.multiAccounts &&
			cal.nId == ZmOrganizer.ID_CALENDAR &&
			acct.isCalDavBased())
		{
			continue;
		}

        var id = cal.link ? cal.getRemoteId() : cal.id;
		calendarOrgs[id] = cal.owner;

		// bug: 28363 - owner attribute is not available for shared sub folders
		if (cal.isRemote() && !cal.owner && cal.parent && cal.parent.isRemote()) {
			calendarOrgs[id] = cal.parent.getOwner();
		}

		var selected = ((calItem.folderId == cal.id) || (calItem.folderId == id));
		var icon = appCtxt.multiAccounts ? acct.getIcon() : cal.getIconWithColor();
		var name = AjxStringUtil.htmlDecode(appCtxt.multiAccounts
			? ([cal.getName(), " (", acct.getDisplayName(), ")"].join(""))
			: cal.getName());
		var option = new DwtSelectOption(id, selected, name, null, null, icon);
		folderSelect.addOption(option, selected);
	}

    ZmApptViewHelper.folderSelectResize(folderSelect);
    //todo: new ui hide folder select if there is only one folder
};

/**
 * Takes a string, AjxEmailAddress, or contact/resource and returns
 * a ZmContact or a ZmResource. If the attendee cannot be found in
 * contacts, locations, or equipment, a new contact or
 * resource is created and initialized.
 *
 * @param item			[object]		string, AjxEmailAddress, ZmContact, or ZmResource
 * @param type			[constant]*		attendee type
 * @param strictText	[boolean]*		if true, new location will not be created from free text
 * @param strictEmail	[boolean]*		if true, new attendee will not be created from email address
 */
ZmApptViewHelper.getAttendeeFromItem =
function(item, type, strictText, strictEmail, checkForAvailability) {

	if (!item || !type) return null;

	if (type == ZmCalBaseItem.LOCATION && !ZmApptViewHelper._locations) {
		if (!appCtxt.get(ZmSetting.GAL_ENABLED)) {
			//if GAL is disabled then user does not have permission to load locations.
			return null;
		}
		var locations = ZmApptViewHelper._locations = appCtxt.getApp(ZmApp.CALENDAR).getLocations();
        if(!locations.isLoaded) {
            locations.load();
        }

	}
	if (type == ZmCalBaseItem.EQUIPMENT && !ZmApptViewHelper._equipment) {
		if (!appCtxt.get(ZmSetting.GAL_ENABLED)) {
			//if GAL is disabled then user does not have permission to load equipment.
			return null;
		}
		var equipment = ZmApptViewHelper._equipment = appCtxt.getApp(ZmApp.CALENDAR).getEquipment();
        if(!equipment.isLoaded) {
            equipment.load();
        }                
	}
	
	var attendee = null;
	if (item.type == ZmItem.CONTACT || item.type == ZmItem.GROUP || item.type == ZmItem.RESOURCE) {
		// it's already a contact or resource, return it as is
		attendee = item;
	} else if (item instanceof AjxEmailAddress) {
		var addr = item.getAddress();
		// see if we have this contact/resource by checking email address
		attendee = ZmApptViewHelper._getAttendeeFromAddr(addr, type);

		// Bug 7837: preserve the email address as it was typed
		//           instead of using the contact's primary email.
		if (attendee && (type === ZmCalBaseItem.PERSON || type === ZmCalBaseItem.GROUP)) {
			attendee = AjxUtil.createProxy(attendee);
			attendee._inviteAddress = addr;
			attendee.getEmail = function() {
				return this._inviteAddress || this.constructor.prototype.getEmail.apply(this);
			};
		}

		if (!checkForAvailability && !attendee && !strictEmail) {
			// AjxEmailAddress has name and email, init a new contact/resource from those
			if (type === ZmCalBaseItem.PERSON) {
				attendee = new ZmContact(null, null, ZmItem.CONTACT);
			}
			else if (type === ZmCalBaseItem.GROUP) {
				attendee = new ZmContact(null, null, ZmItem.GROUP);
			}
			else {
				attendee = new ZmResource(type);
			}
			attendee.initFromEmail(item, true);
		}
		attendee.canExpand = item.canExpand;
		var ac = window.parentAppCtxt || window.appCtxt;
		ac.setIsExpandableDL(addr, attendee.canExpand);
	} else if (typeof item == "string") {
		item = AjxStringUtil.trim(item);	// trim white space
		item = item.replace(/;$/, "");		// trim separator
		// see if it's an email we can use for lookup
	 	var email = AjxEmailAddress.parse(item);
	 	if (email) {
	 		var addr = email.getAddress();
	 		// is it a contact/resource we already know about?
			attendee = ZmApptViewHelper._getAttendeeFromAddr(addr, type);
			if (!checkForAvailability && !attendee && !strictEmail) {
				if (type === ZmCalBaseItem.PERSON || type === ZmCalBaseItem.FORWARD) {
					attendee = new ZmContact(null, null, ZmItem.CONTACT);
				}
				else if (type === ZmCalBaseItem.GROUP) {
					attendee = new ZmContact(null, null, ZmItem.GROUP);
				}
				else if (type === ZmCalBaseItem.LOCATION) {
					attendee = new ZmResource(null, ZmApptViewHelper._locations, ZmCalBaseItem.LOCATION);
				}
				else if (type === ZmCalBaseItem.EQUIPMENT) {
					attendee = new ZmResource(null, ZmApptViewHelper._equipment, ZmCalBaseItem.EQUIPMENT);
				}
				attendee.initFromEmail(email, true);
			} else if (attendee && (type === ZmCalBaseItem.PERSON || type === ZmCalBaseItem.GROUP)) {
				// remember actual address (in case it's email2 or email3)
				attendee._inviteAddress = addr;
                attendee.getEmail = function() {
				    return this._inviteAddress || this.constructor.prototype.getEmail.apply(this);
			    };
			}
		}
	}
	return attendee;
};

ZmApptViewHelper._getAttendeeFromAddr =
function(addr, type) {

	var attendee = null;
	if (type === ZmCalBaseItem.PERSON || type === ZmCalBaseItem.GROUP || type === ZmCalBaseItem.FORWARD) {
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		attendee = contactsApp && contactsApp.getContactByEmail(addr);
	} else if (type == ZmCalBaseItem.LOCATION) {
        attendee = ZmApptViewHelper._locations.getResourceByEmail(addr);
	} else if (type == ZmCalBaseItem.EQUIPMENT) {
		attendee = ZmApptViewHelper._equipment.getResourceByEmail(addr);
	}
	return attendee;
};

/**
 * Returns a AjxEmailAddress for the organizer.
 *
 * @param organizer	[string]*		organizer's email address
 * @param account	[ZmAccount]*	organizer's account
 */
ZmApptViewHelper.getOrganizerEmail =
function(organizer, account) {
	var orgAddress = organizer ? organizer : appCtxt.get(ZmSetting.USERNAME, null, account);
	var orgName = (orgAddress == appCtxt.get(ZmSetting.USERNAME, null, account))
		? appCtxt.get(ZmSetting.DISPLAY_NAME, null, account) : null;
	return new AjxEmailAddress(orgAddress, null, orgName);
};

ZmApptViewHelper.getAddressEmail =
function(email, isIdentity) {
	var orgAddress = email ? email : appCtxt.get(ZmSetting.USERNAME);
	var orgName;
    if(email == appCtxt.get(ZmSetting.USERNAME)){
        orgName = appCtxt.get(ZmSetting.DISPLAY_NAME);
    }else{
        //Identity
        var iCol = appCtxt.getIdentityCollection(),
            identity = iCol ? iCol.getIdentityBySendAddress(orgAddress) : "";
        if(identity){
            orgName = identity.sendFromDisplay;
        }
    }
    return new AjxEmailAddress(orgAddress, null, orgName);    
};

/**
* Creates a string from a list of attendees/locations/resources. If an item
* doesn't have a name, its address is used.
*
* @param list					[array]			list of attendees (ZmContact or ZmResource)
* @param type					[constant]		attendee type
* @param includeDisplayName		[boolean]*		if true, include location info in parens (ZmResource)
* @param includeRole		    [boolean]*		if true, include attendee role
*/
ZmApptViewHelper.getAttendeesString = 
function(list, type, includeDisplayName, includeRole) {
	if (!(list && list.length)) return "";

	var a = [];
	for (var i = 0; i < list.length; i++) {
		var attendee = list[i];
		var text = ZmApptViewHelper.getAttendeesText(attendee, type);
		if (includeDisplayName && list.length == 1) {
			var displayName = attendee.getAttr(ZmResource.F_locationName);
			if (displayName) {
				text = [text, " (", displayName, ")"].join("");
			}
		}
        if(includeRole) {
            text += " " + (attendee.getParticipantRole() || ZmCalItem.ROLE_REQUIRED);
        }
		a.push(text);
	}

	return a.join(ZmAppt.ATTENDEES_SEPARATOR);
};

ZmApptViewHelper.getAttendeesText =
function(attendee, type, shortForm) {

    //give preference to lookup email is the attendee object is located by looking up email address
    var lookupEmailObj = attendee.getLookupEmail(true);
    if(lookupEmailObj) {
		return lookupEmailObj.toString(shortForm || (type && type !== ZmCalBaseItem.PERSON && type !== ZmCalBaseItem.GROUP));
	}

    return attendee.getAttendeeText(type, shortForm);
};

/**
* Creates a string of attendees by role. If an item
* doesn't have a name, its address is used.
*
* calls common code from mail msg view to get the collapse/expand "show more" funcitonality for large lists.
*
* @param list					[array]			list of attendees (ZmContact or ZmResource)
* @param type					[constant]		attendee type
* @param role      		        [constant]      attendee role
* @param count                  [number]        number of attendees to be returned
*/
ZmApptViewHelper.getAttendeesByRoleCollapsed =
function(list, type, role, objectManager, htmlElId) {
    if (!(list && list.length)) return "";
	var attendees = ZmApptViewHelper.getAttendeesArrayByRole(list, role);

	var emails = [];
	for (var i = 0; i < attendees.length; i++) {
		var att = attendees[i];
		emails.push(new AjxEmailAddress(att.getEmail(), type, att.getFullName(), att.getFullName()));
	}

	var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);
	var addressInfo = ZmMailMsgView.getAddressesFieldHtmlHelper(emails, options,
		role, objectManager, htmlElId);
	return addressInfo.html;
};

/**
* Creates a string of attendees by role. this allows to show only count elements, with "..." appended.
*
* @param list					[array]			list of attendees (ZmContact or ZmResource)
* @param type					[constant]		attendee type
* @param role      		        [constant]      attendee role
* @param count                  [number]        number of attendees to be returned
*/
ZmApptViewHelper.getAttendeesByRole =
function(list, type, role, count) {
    if (!(list && list.length)) return "";

	var res = [];

	var attendees = ZmApptViewHelper.getAttendeesArrayByRole(list, role);
	for (var i = 0; i < attendees.length; i++) {
		if (count && i > count) {
			res.push(" ...");
			break;
		}
		if (i > 0) {
			res.push(ZmAppt.ATTENDEES_SEPARATOR);
		}
		res.push(attendees[i].getAttendeeText(type));
	}
	return res.join("");
};



/**
* returns array of attendees by role.
*
* @param list					[array]			list of attendees (ZmContact or ZmResource)
* @param role      		        [constant]      attendee role
*/
ZmApptViewHelper.getAttendeesArrayByRole =
function(list, role, count) {

    if (!(list && list.length)) {
	    return [];
    }

    var a = [];
    for (var i = 0; i < list.length; i++) {
        var attendee = list[i];
        var attendeeRole = attendee.getParticipantRole() || ZmCalItem.ROLE_REQUIRED;
        if (attendeeRole === role){
            a.push(attendee);
        }
    }
	return a;
};

ZmApptViewHelper._allDayItemHtml =
function(appt, id, controller, first, last) {
	var isNew = appt.ptst == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
	var isAccepted = appt.ptst == ZmCalBaseItem.PSTATUS_ACCEPT;
	var calendar = appt.getFolder();
    AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);

    var tagNames  = appt.getVisibleTags();
    var tagIcon = last ? appt.getTagImageFromNames(tagNames) : null;

    var fba = isNew ? ZmCalBaseItem.PSTATUS_NEEDS_ACTION : appt.fba;
    var headerColors = ZmApptViewHelper.getApptColor(isNew, calendar, tagNames, "header");
    var headerStyle  = ZmCalBaseView._toColorsCss(headerColors.appt);
    var bodyColors   = ZmApptViewHelper.getApptColor(isNew, calendar, tagNames, "body");
    var bodyStyle    = ZmCalBaseView._toColorsCss(bodyColors.appt);

    var borderLeft  = first ? "" : "border-left:0;";
    var borderRight = last  ? "" : "border-right:0;";

    var newState = isNew ? "_new" : "";
	var subs = {
		id:           id,
		headerStyle:  headerStyle,
		bodyStyle:    bodyStyle,
		newState:     newState,
		name:         first ? AjxStringUtil.htmlEncode(appt.getName()) : "&nbsp;",
//		tag: isNew ? "NEW" : "",		//  HACK: i18n
		starttime:    appt.getDurationText(true, true),
		endtime:      (!appt._fanoutLast && (appt._fanoutFirst || (appt._fanoutNum > 0))) ? "" : ZmCalBaseItem._getTTHour(appt.endDate),
		location:     AjxStringUtil.htmlEncode(appt.getLocation()),
		status:       appt.isOrganizer() ? "" : appt.getParticipantStatusStr(),
		icon:         first && appt.isPrivate() ? "ReadOnly" : null,
        showAsColor:  first ? ZmApptViewHelper._getShowAsColorFromId(fba) : "",
        showAsClass:  first ? "" : "appt_allday" + newState + "_name",
        boxBorder:    ZmApptViewHelper.getBoxBorderFromId(fba),
        borderLeft:   borderLeft,
        borderRight:  borderRight,
        tagIcon:      tagIcon
	};
    ZmApptViewHelper.setupCalendarColor(last, headerColors, tagNames, subs, "headerStyle", null, 1, 1);
    return AjxTemplate.expand("calendar.Calendar#calendar_appt_allday", subs);
};

ZmApptViewHelper._getShowAsColorFromId =
function(id) {
    var color = "#4AA6F1";
	switch(id) {
        case ZmCalBaseItem.PSTATUS_NEEDS_ACTION: color = "#FF3300"; break;
		case "F": color = "#FFFFFF"; break;
		case "B": color = "#4AA6F1"; break;
		case "T": color = "#BAE0E3"; break;
		case "O": color = "#7B5BAC"; break;
	}
    var colorCss = Dwt.createLinearGradientCss("#FFFFFF", color, "v");
    if (!colorCss) {
        colorCss = "background-color: " + color + ";";
    }
    return colorCss;
};

ZmApptViewHelper.getBoxBorderFromId =
function(id) {
	switch(id) {
		case "F": return "ZmSchedulerApptBorder-free";
        case ZmCalBaseItem.PSTATUS_NEEDS_ACTION:
		case "B": return "ZmSchedulerApptBorder-busy";
		case "T": return "ZmSchedulerApptBorder-tentative";
		case "O": return "ZmSchedulerApptBorder-outOfOffice";
	}
	return "ZmSchedulerApptBorder-busy";
};

/**
 * Returns a list of attendees with the given role.
 *
 * @param	{array}		list		list of attendees
 * @param	{constant}	role		defines the role of the attendee (required/optional)
 *
 * @return	{array}	a list of attendees
 */
ZmApptViewHelper.filterAttendeesByRole =
function(list, role) {

	var result = [];
	for (var i = 0; i < list.length; i++) {
		var attendee = list[i];
		var attRole = attendee.getParticipantRole() || ZmCalItem.ROLE_REQUIRED;
		if (attRole == role){
			result.push(attendee);
		}
	}
	return result;
};

ZmApptViewHelper.getApptColor =
function(deeper, calendar, tagNames, segment) {
    var colors = ZmCalBaseView._getColors(calendar.rgb || ZmOrganizer.COLOR_VALUES[calendar.color]);
    var calColor = deeper ? colors.deeper[segment] : colors.standard[segment];
    var apptColor = calColor;
    if (tagNames && (tagNames.length == 1)) {
		var tagList = appCtxt.getAccountTagList(calendar);

        var tag = tagList.getByNameOrRemote(tagNames[0]);
        if(tag){apptColor = { bgcolor: tag.getColor() };}
    }
    return {calendar:calColor, appt:apptColor};
};

ZmApptViewHelper.setupCalendarColor =
function(last, colors, tagNames, templateData, colorParam, clearParam, peelTopOffset, peelRightOffset, div) {
    var colorCss = Dwt.createLinearGradientCss("#FFFFFF", colors.appt.bgcolor, "v");
    if (colorCss) {
        templateData[colorParam] = colorCss;
        if (clearParam) {
            templateData[clearParam] = null;
        }
    }
    if (last && tagNames && (tagNames.length == 1)) {
        if (!colorCss) {
            // Can't use the gradient color.  IE masking doesn't work properly for tags on appts;
            // Since the color is already set in the background, just print the overlay image
            var match = templateData.tagIcon.match(AjxImg.RE_COLOR);
            if (match) {
                templateData.tagIcon = (match && match[1]) + "Overlay";
            }
        }
        // Tag color has been applied to the appt.  Add the calendar peel image
        templateData.peelIcon  = "Peel,color=" + colors.calendar.bgcolor;
        templateData.peelTop   = peelTopOffset;
        templateData.peelRight = peelRightOffset;
    }
};

/**
 * Gets the attach list as HTML.
 * 
 * @param {ZmCalItem}	calItem			calendar item
 * @param {Object}		attach			a generic Object contain meta info about the attachment
 * @param {Boolean}		hasCheckbox		<code>true</code> to insert a checkbox prior to the attachment
 * @return	{String}	the HTML
 * 
 * TODO: replace string onclick handlers with funcs
 */
ZmApptViewHelper.getAttachListHtml =
function(calItem, attach, hasCheckbox, getLinkIdCallback) {
	var msgFetchUrl = appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI);

	// gather meta data for this attachment
	var mimeInfo = ZmMimeTable.getInfo(attach.ct);
	var icon = mimeInfo ? mimeInfo.image : "GenericDoc";
	var size = attach.s;
	var sizeText;
	if (size != null) {
		if (size < 1024)		sizeText = size + " B";
		else if (size < 1024^2)	sizeText = Math.round((size/1024) * 10) / 10 + " KB";
		else 					sizeText = Math.round((size / (1024*1024)) * 10) / 10 + " MB";
	}

	var html = [];
	var i = 0;

	// start building html for this attachment
	html[i++] = "<table role='presentation' border=0 cellpadding=0 cellspacing=0><tr>";
	if (hasCheckbox) {
		html[i++] = "<td width=1%><input type='checkbox' checked value='";
		html[i++] = attach.part;
		html[i++] = "' name='";
		html[i++] = ZmCalItem.ATTACHMENT_CHECKBOX_NAME;
		html[i++] = "'></td>";
	}

	var hrefRoot = ["href='", msgFetchUrl, "&id=", calItem.invId, "&amp;part=", attach.part].join("");
	html[i++] = "<td width=20><a target='_blank' class='AttLink' ";
	if (getLinkIdCallback) {
		var imageLinkId = getLinkIdCallback(attach.part, ZmCalItem.ATT_LINK_IMAGE);
		html[i++] = "id='";
		html[i++] = imageLinkId;
		html[i++] = "' ";
	}
	html[i++] = hrefRoot;
	html[i++] = "'>";
	html[i++] = AjxImg.getImageHtml(icon);

	html[i++] = "</a></td><td><a target='_blank' class='AttLink' ";

	if (appCtxt.get(ZmSetting.MAIL_ENABLED) && attach.ct == ZmMimeTable.MSG_RFC822) {
		html[i++] = " href='javascript:;' onclick='ZmCalItemView.rfc822Callback(";
		html[i++] = '"';
		html[i++] = calItem.invId;
		html[i++] = '"';
		html[i++] = ",\"";
		html[i++] = attach.part;
		html[i++] = "\"); return false;'";
	} else {
		html[i++] = hrefRoot;
		html[i++] = "'";
	}
	if (getLinkIdCallback) {
		var mainLinkId = getLinkIdCallback(attach.part, ZmCalItem.ATT_LINK_MAIN);
		html[i++] = " id='";
		html[i++] = mainLinkId;
		html[i++] = "'";
	}
	html[i++] = ">";
	html[i++] = AjxStringUtil.htmlEncode(attach.filename);
	html[i++] = "</a>";

	var addHtmlLink = (appCtxt.get(ZmSetting.VIEW_ATTACHMENT_AS_HTML) &&
					   attach.body == null && ZmMimeTable.hasHtmlVersion(attach.ct));

	if (sizeText || addHtmlLink) {
		html[i++] = "&nbsp;(";
		if (sizeText) {
			html[i++] = sizeText;
			html[i++] = ") ";
		}
		var downloadLinkId = "";
		if (getLinkIdCallback) {
			downloadLinkId = getLinkIdCallback(attach.part, ZmCalItem.ATT_LINK_DOWNLOAD);
		}
		if (addHtmlLink) {
			html[i++] = "<a style='text-decoration:underline' target='_blank' class='AttLink' ";
			if (getLinkIdCallback) {
				html[i++] = "id='";
				html[i++] = downloadLinkId;
				html[i++] = "' ";
			}
			html[i++] = hrefRoot;
			html[i++] = "&view=html'>";
			html[i++] = ZmMsg.preview;
			html[i++] = "</a>&nbsp;";
		}
		if (attach.ct != ZmMimeTable.MSG_RFC822) {
			html[i++] = "<a style='text-decoration:underline' class='AttLink' onclick='ZmZimbraMail.unloadHackCallback();' ";
			if (getLinkIdCallback) {
				html[i++] = " id='";
				html[i++] = downloadLinkId;
				html[i++] = "' ";
			}
			html[i++] = hrefRoot;
			html[i++] = "&disp=a'>";
			html[i++] = ZmMsg.download;
			html[i++] = "</a>";
		}
	}

	html[i++] = "</td></tr></table>";

	// Provide lookup id and label for offline mode
	if (!attach.mid) {
		attach.mid = calItem.invId;
		attach.label = attach.filename;
	}

	return html.join("");
};

/**
 * @param {DwtSelect} folderSelect
 *
 * TODO: set the width for folderSelect once the image icon gets loaded if any
 */
ZmApptViewHelper.folderSelectResize =
function(folderSelect) {

    var divEl = folderSelect._containerEl,
        childNodes,
        img;

    if (divEl) {
        childNodes = divEl.childNodes[0];
        if (childNodes) {
            img = childNodes.getElementsByTagName("img")[0];
            if (img) {
                img.onload = function() {
                    divEl.style.width = childNodes.offsetWidth || "auto";// offsetWidth doesn't work in IE if the element or one of its parents has display:none
                    img.onload = "";
                }
            }
        }
    }
};

/**
 * Compute start date and time and decide which warning message to show.
 *
 * @param {Date}		startDate		start date of the appointment
 * @param {String}		htmlElId		currently referenced HTML Id
 * @param {Boolean}		isAllDay		check for all day event
 *
 */
ZmApptViewHelper.warnIfApptStartingInPast =
function (startDate, htmlElId, isAllDay) {
	var todaysDateTime = new Date(),
		todaysDate = new Date(new Date().setHours(0, 0, 0)),
		apptStartDate = new Date(new Date(startDate).setHours(0, 0, 0)),
		apptStartDateTime = new Date(startDate),
		isApptDateInPast = false,
		isApptTimeInPast = false;

	if (apptStartDate !== null || !isNaN(apptStartDate)) {
		if (Date.parse(apptStartDate) - Date.parse(todaysDate) < 0) {
			isApptDateInPast = true;
		}

		if (!isAllDay) {
			var secondsElapsed = (apptStartDateTime.getTime() - todaysDateTime.getTime()) / 1000;
			if (secondsElapsed <  0) {
				isApptTimeInPast = true;
			}
		}
	}

	if (isApptDateInPast && isApptTimeInPast) {
		ZmApptViewHelper._toggleMeetingInPastWarning(true, htmlElId, ZmMsg.meetingInPastWarning);
	}
	else if (isApptDateInPast) {
		ZmApptViewHelper._toggleMeetingInPastWarning(true, htmlElId, ZmMsg.meetingDateInPastWarning);
	}
	else if (isApptTimeInPast) {
		ZmApptViewHelper._toggleMeetingInPastWarning(true, htmlElId, ZmMsg.meetingTimeInPastWarning);
	}
	else {
		ZmApptViewHelper._toggleMeetingInPastWarning(false, htmlElId, '');
	}
};

/**
 * Show/hide warning message in case the user is trying to schedule an appointment in past.
 *
 * @param {Boolean}		toggleFlag			state to hide/show warning message
 * @param {String}		htmlElId			currently referenced HTML Id
 * @param {String}		warningMessage		message to display as warning
 *
 */
ZmApptViewHelper._toggleMeetingInPastWarning =
function(toggleFlag, htmlElId, warningMessage) {
	var warningTemplateElement = document.getElementById(htmlElId + '_meetingInPastWarning');
	var warningTemplateTextElement = document.getElementById(htmlElId + '_meetingInPastWarningMessageText');
	warningTemplateTextElement.innerHTML = warningMessage;

	warningTemplateElement.style.display = toggleFlag ? "" : Dwt.DISPLAY_NONE;
	warningTemplateTextElement.style.display = toggleFlag? "" : Dwt.DISPLAY_NONE;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalItemEditView")) {
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
 * Creates a new calendar item edit view.
 * @constructor
 * @class
 * This is the main screen for creating/editing a calendar item. It provides
 * inputs for the various appointment/task details.
 *
 * @author Parag Shah
 *
 * @param {DwtControl}	parent			the container
 * @param {Hash}	attendees			the attendees/locations/equipment
 * @param {ZmController}	controller		the compose controller for this view
 * @param {Object}	dateInfo			a hash of date info
 * @param {static|relative|absolute}	posStyle			the position style
 * @param {string}  className   Class name
 * 
 * @extends	DwtComposite
 * 
 * @private
 */
ZmCalItemEditView = function(parent, attendees, controller, dateInfo, posStyle, className, uid) {
	if (arguments.length == 0) { return; }

	DwtComposite.call(this, {parent:parent, posStyle:posStyle, className:className, id:uid});

    this.uid = uid;
	this._attendees = attendees;
	this._controller = controller;
	this._dateInfo = dateInfo;

	this.setScrollStyle(DwtControl.SCROLL);
	this._rendered = false;

	this._repeatSelectDisabled = false;
	this._attachCount = 0;
	this._calendarOrgs = {};

	this._kbMgr = appCtxt.getKeyboardMgr();
    this._isForward = false;
    this._isProposeTime = false;

    this._customRecurDialogCallback = null;
    this._enableCustomRecurCallback = true;

	this.addControlListener(this._controlListener.bind(this));
};

ZmCalItemEditView.prototype = new DwtComposite;
ZmCalItemEditView.prototype.constructor = ZmCalItemEditView;

ZmCalItemEditView.prototype.toString =
function() {
	return "ZmCalItemEditView";
};

// Consts

ZmCalItemEditView.UPLOAD_FIELD_NAME = "__calAttUpload__";
ZmCalItemEditView.SHOW_MAX_ATTACHMENTS = AjxEnv.is800x600orLower ? 2 : 3;

ZmCalItemEditView._REPEAT_CHANGE = "REPEAT_CHANGE";

// Public

ZmCalItemEditView.prototype.show =
function() {
	this.resize();
};

ZmCalItemEditView.prototype.isRendered =
function() {
	return this._rendered;
};

/**
 * Gets the calendar item.
 * 
 * @return	{ZmCalItem}	the item
 */
ZmCalItemEditView.prototype.getCalItem =
function(attId) {
	// attempt to submit attachments first!
	if (!attId && this._gotAttachments()) {
		this._submitAttachments();
		return null;
	}

	return this._populateForSave(this._getClone());
};

ZmCalItemEditView.prototype.initialize =
function(calItem, mode, isDirty, apptComposeMode) {

    this._calItem = calItem;
	this._isDirty = isDirty;

	var isSavedinHTML = false,
		notesHtmlPart = calItem.getNotesPart(ZmMimeTable.TEXT_HTML);

	if (calItem.notesTopPart) { //Already existing appointment
		var pattern = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/ig; // improved regex to parse html tags
		if (notesHtmlPart && notesHtmlPart.match(pattern)) {
			isSavedinHTML = true;
		}
	}
	else if (appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED) && (appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT) === ZmSetting.COMPOSE_HTML)) {
		isSavedinHTML = true;
	}

	this.setComposeMode(isSavedinHTML ? Dwt.HTML : Dwt.TEXT);

	var firstTime = !this._rendered;
	this.createHtml();

	this._mode = (mode == ZmCalItem.MODE_NEW_FROM_QUICKADD || !mode) ? ZmCalItem.MODE_NEW : mode;
	this._reset(calItem, mode || ZmCalItem.MODE_NEW, firstTime);
};

ZmCalItemEditView.prototype.cleanup =
function() {
	if (this._recurDialog) {
		this._recurDialog.clearState();
		this._recurDialogRepeatValue = null;
	}

	delete this._calItem;
	this._calItem = null;

	// clear out all input fields
	this._subjectField.setValue("");
    this._notesHtmlEditor.clear();

    if(this._hasRepeatSupport) {
        this._repeatDescField.innerHTML = "";
        // reinit non-time sensitive selects option values
        this._repeatSelect.setSelectedValue(ZmApptViewHelper.REPEAT_OPTIONS[0].value);
    }

	// remove attachments if any were added
	this._removeAllAttachments();

	// disable all input fields
	this.enableInputs(false);
};

ZmCalItemEditView.prototype.addRepeatChangeListener =
function(listener) {
	this.addListener(ZmCalItemEditView._REPEAT_CHANGE, listener);
};

// Acceptable hack needed to prevent cursor from bleeding thru higher z-index'd views
ZmCalItemEditView.prototype.enableInputs =
function(bEnableInputs) {
	this._subjectField.setEnabled(bEnableInputs);
	this._startDateField.disabled = !(bEnableInputs || this._isProposeTime);
	this._endDateField.disabled = !(bEnableInputs || this._isProposeTime);
};

ZmCalItemEditView.prototype.enableSubjectField =
function(bEnableInputs) {
	this._subjectField.setEnabled(bEnableInputs);
};

/**
 * Checks to see if the recurring (repeat custom - CUS) changes dialog was edited.
 *
 */
ZmCalItemEditView.prototype.areRecurringChangesDirty =
function() {
	if (this._recurDialog)
		return this._recurDialog.isDirty();
	else
		return false;
};

/**
 * Checks for dirty fields.
 * 
 * @param {Boolean}	excludeAttendees		if <code>true</code> check for dirty fields excluding the attendees field
 */
ZmCalItemEditView.prototype.isDirty =
function(excludeAttendees) {
    if(this._controller.inactive) {
        return false;
    }
	var formValue = excludeAttendees && this._origFormValueMinusAttendees
		? this._origFormValueMinusAttendees
		: this._origFormValue;

	return (this._gotAttachments() || this._removedAttachments()) ||
			this._isDirty ||
		   (this._formValue(excludeAttendees) != formValue);
};

/**
 * Checks if reminder only is changed.
 * 
 * @return	{Boolean}	<code>true</code> if reminder only changed
 */
ZmCalItemEditView.prototype.isReminderOnlyChanged =
function() {

	if (!this._hasReminderSupport) { return false; }

	var formValue = this._origFormValueMinusReminder;

	var isDirty = (this._gotAttachments() || this._removedAttachments()) ||
			this._isDirty ||
		   (this._formValue(false, true) != formValue);

	var isReminderChanged = this._reminderSelectInput && (this._origReminderValue != this._reminderSelectInput.getValue());

	return isReminderChanged && !isDirty;
};

ZmCalItemEditView.prototype.isValid =
function() {
	// override
};

ZmCalItemEditView.prototype.getComposeMode =
function() {
	return this._composeMode;
};

ZmCalItemEditView.prototype.setComposeMode =
function(composeMode) {
	this._composeMode = composeMode || this._composeMode;

	if(this._notesHtmlEditor) {
		this._notesHtmlEditor.setMode(this._composeMode, true);
		this.resize();
	}
};

ZmCalItemEditView.prototype.reEnableDesignMode =
function() {
	if (this._composeMode == Dwt.HTML)
		this._notesHtmlEditor.reEnableDesignMode();
};

ZmCalItemEditView.prototype.createHtml =
function() {
	if (!this._rendered) {
		var width = AjxEnv.is800x600orLower ? "150" : "250";

		this._createHTML();
		this._createWidgets(width);
		this._cacheFields();
		this._addEventHandlers();
		this._rendered = true;
	}
};

/**
 * Adds an attachment (file input field) to the appointment view. If none
 * already exist, creates the attachments container. If <code>attach</code> parameters is
 * provided, user is opening an existing appointment w/ an attachment and therefore
 * display differently.
 * 
 * @param	{ZmCalItem}	calItem		the calendar item
 * @param	{Object}	attach		the attachment
 * 
 * @private
 */
ZmCalItemEditView.prototype.addAttachmentField =
function(calItem, attach) {
	if (this._attachCount == 0) {
		this._initAttachContainer();
	}

	this._attachCount++;

	// add file input field
	var div = document.createElement("div");
    var id = this._htmlElId;
	var attachRemoveId = id + "_att_" + Dwt.getNextId();
	var attachInputId = id + "_att_" + Dwt.getNextId();
    var sizeContId = id + "_att_" + Dwt.getNextId();

	if (attach) {
		div.innerHTML = ZmApptViewHelper.getAttachListHtml(calItem, attach, true);
	} else {
		var subs = {
			id: id,
			attachInputId: attachInputId,
			attachRemoveId: attachRemoveId,
            sizeId: sizeContId,
			uploadFieldName: ZmCalItemEditView.UPLOAD_FIELD_NAME
		};
		div.innerHTML = AjxTemplate.expand("calendar.Appointment#AttachAdd", subs);
	}

	if (this._attachDiv == null) {
		this._attachDiv = document.getElementById(this._attachDivId);
	}
	this._attachDiv.appendChild(div);

	if (attach == null) {
		// add event handlers as necessary
		var tvpId = AjxCore.assignId(this);
		var attachRemoveSpan = document.getElementById(attachRemoveId);
		attachRemoveSpan._editViewId = tvpId;
		attachRemoveSpan._parentDiv = div;
		Dwt.setHandler(attachRemoveSpan, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);

        var attachInputEl = document.getElementById(attachInputId);
		// trap key presses in IE for input field so we can ignore ENTER key (bug 961)
		if (AjxEnv.isIE) {
			//var attachInputEl = document.getElementById(attachInputId);
			attachInputEl._editViewId = tvpId;
			Dwt.setHandler(attachInputEl, DwtEvent.ONKEYDOWN, ZmCalItemEditView._onKeyDown);
        }

        //HTML5
        if(AjxEnv.supportsHTML5File){
            var sizeEl = document.getElementById(sizeContId);
            Dwt.setHandler(attachInputEl, "onchange", AjxCallback.simpleClosure(this._handleFileSize, this, attachInputEl, sizeEl));
        }
    }

    this.resize();
};

ZmCalItemEditView.prototype._handleFileSize =
function(inputEl, sizeEl){

    var files = inputEl.files;
    if(!files) return;

    var sizeStr = [], className, totalSize =0;
    for(var i=0; i<files.length;i++){
        var file = files[i];
        var size = file.size || file.fileSize /*Safari*/ || 0;
        if ((-1 /* means unlimited */ != appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT)) &&
            (size > appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT))) {
            className = "RedC";
        }
        totalSize += size;
    }

    if(sizeEl) {
        sizeEl.innerHTML = "  ("+AjxUtil.formatSize(totalSize, true)+")";
        if(className)
            Dwt.addClass(sizeEl, "RedC");
        else
            Dwt.delClass(sizeEl, "RedC");
    }
};

ZmCalItemEditView.prototype.resize =
function() {
	if (!this._rendered) { return; }

    this._resizeNotes();

	var subjectContainer = this._subjectField.getHtmlElement().parentNode;
	this._subjectField.setSize(0, Dwt.DEFAULT);
	var containerBounds = Dwt.getInsetBounds(subjectContainer);
	this._subjectField.setSize(containerBounds.width - 20, Dwt.DEFAULT);
};

ZmCalItemEditView.prototype.getHtmlEditor =
function() {
	return this._notesHtmlEditor;
};

ZmCalItemEditView.prototype.getOrganizer =
function() {
	var folderId = this._folderSelect.getValue();
	var organizer = new ZmContact(null);
	var acct = appCtxt.multiAccounts && appCtxt.getById(folderId).getAccount();
	organizer.initFromEmail(ZmApptViewHelper.getOrganizerEmail(this._calendarOrgs[folderId], acct), true);

	return organizer;
};


// Private / protected methods

ZmCalItemEditView.prototype._addTabGroupMembers =
function(tabGroup) {
	// override
};

ZmCalItemEditView.prototype._reset =
function(calItem, mode, firstTime) {
    this._calendarOrgs = {};
	ZmApptViewHelper.populateFolderSelect(this._folderSelect, this._folderRow, this._calendarOrgs, calItem);

	this.enableInputs(true);

    var enableTimeSelection = !this._isForward;

	// lets always attempt to populate even if we're dealing w/ a "new" calItem
	this._populateForEdit(calItem, mode);

	// disable the recurrence select object for editing single instance
    var enableRepeat = ((mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) && enableTimeSelection && !this._isProposeTime);
    var repeatOptions = document.getElementById(this._htmlElId + "_repeat_options");
	if(repeatOptions) this._enableRepeat(enableRepeat);

    //show 'to' fields for forward action
    var forwardOptions = document.getElementById(this._htmlElId + "_forward_options");
    if(forwardOptions) Dwt.setVisible(forwardOptions, this._isForward || this._isProposeTime);

    this._resetReminders();

    // Delay of 500ms to call the finishReset
    // It should be called only when all the items are loaded properly including the scheduler
    var ta = new AjxTimedAction(this, this._finishReset);
    AjxTimedAction.scheduleAction(ta, 500);
};

ZmCalItemEditView.prototype._resetReminders = function() {
    if (!this._hasReminderSupport) return;
    
    var reminderOptions = document.getElementById(this._htmlElId + "_reminder_options");
    if(reminderOptions) {
        var enableReminder = !this._isForward && !this._isProposeTime;
        this._reminderSelectInput.setEnabled(enableReminder);
        this._reminderButton.setEnabled(enableReminder);
    }
};

ZmCalItemEditView.prototype._finishReset =
function() {
    // save the original form data in its initialized state
    this._origFormValue = this._formValue(false);
};

ZmCalItemEditView.prototype._getClone =
function() {
	// override
};

ZmCalItemEditView.prototype._populateForSave =
function(calItem) {
	// create a copy of the appointment so we don't muck w/ the original
	calItem.setViewMode(this._mode);

	// bug fix #5617 - check if there are any existing attachments that were unchecked
	var attCheckboxes = document.getElementsByName(ZmCalItem.ATTACHMENT_CHECKBOX_NAME);
	if (attCheckboxes && attCheckboxes.length > 0) {
		for (var i = 0; i < attCheckboxes.length; i++) {
			if (!attCheckboxes[i].checked)
				calItem.removeAttachment(attCheckboxes[i].value);
		}
	}

	// save field values of this view w/in given appt
	calItem.setName(this._subjectField.getValue());

	var folderId = this._folderSelect.getValue();
	if (this._mode != ZmCalItem.MODE_NEW && this._calItem.folderId != folderId) {
		// if moving existing calitem across mail boxes, cache the new folderId
		// so we can save it as a separate request
		var origFolder = appCtxt.getById(this._calItem.folderId);
		var newFolder = appCtxt.getById(folderId);
		if (origFolder.isRemote() || newFolder.isRemote()) {
			calItem.__newFolderId = folderId;
			folderId = this._calItem.folderId;
		}
	}

	calItem.setFolderId(folderId);
	calItem.setOrganizer(this._calItem.organizer || this._calendarOrgs[folderId]);

	// set the notes parts (always add text part)
	var top = new ZmMimePart();
	if (this._composeMode == Dwt.HTML) {
		top.setContentType(ZmMimeTable.MULTI_ALT);

		// create two more mp's for text and html content types
		var textPart = new ZmMimePart();
		textPart.setContentType(ZmMimeTable.TEXT_PLAIN);
		textPart.setContent(this._notesHtmlEditor.getTextVersion());
		top.children.add(textPart);

		var htmlPart = new ZmMimePart();
		htmlPart.setContentType(ZmMimeTable.TEXT_HTML);
        htmlPart.setContent(this._notesHtmlEditor.getContent(true, true));
		top.children.add(htmlPart);
	} else {
		top.setContentType(ZmMimeTable.TEXT_PLAIN);
		top.setContent(this._notesHtmlEditor.getContent());
	}

	calItem.notesTopPart = top;

	//set the reminder time for alarm
	if (this._hasReminderSupport) {
		//calItem.setReminderMinutes(this._reminderSelect.getValue());
        var reminderString = this._reminderSelectInput && this._reminderSelectInput.getValue();
        if (!reminderString || reminderString == ZmMsg.apptRemindNever) {
            calItem.setReminderMinutes(-1);
        } else {
            var reminderInfo = ZmCalendarApp.parseReminderString(reminderString);
            var reminders = [
                { control: this._reminderEmailCheckbox,       action: ZmCalItem.ALARM_EMAIL        },
                { control: this._reminderDeviceEmailCheckbox, action: ZmCalItem.ALARM_DEVICE_EMAIL }
            ];
            for (var i = 0; i < reminders.length; i++) {
                var reminder = reminders[i];
                if (reminder.control.getEnabled() && reminder.control.isSelected()) {
                    calItem.addReminderAction(reminder.action);
                }
                else {
                    calItem.removeReminderAction(reminder.action);
                }
            }
            calItem.setReminderUnits(reminderInfo.reminderValue,  reminderInfo.reminderUnits);
        }
	}
	return calItem;
};

ZmCalItemEditView.prototype._populateForEdit =
function(calItem, mode) {
	// set subject
    var subject = calItem.getName(),
        buttonText;
    
	this._subjectField.setValue(subject);
    if(subject) {
        buttonText = subject.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT);
        appCtxt.getAppViewMgr().setTabTitle(this._controller.getCurrentViewId(), buttonText);
    }
    if (this._hasRepeatSupport) {
        this._repeatSelect.setSelectedValue(calItem.isCustomRecurrence() ? "CUS" : calItem.getRecurType());
        this._initRecurDialog(calItem.getRecurType());
        // recurrence string
	    this._setRepeatDesc(calItem);
    }

    if (this._hasReminderSupport) {
        this._setEmailReminderControls();
    }

	// attachments
	this._attachDiv = document.getElementById(this._attachDivId);
	if (this._attachDiv) {
		// Bug 19993: clear out the attachments to prevent duplicates in the display.
		this._attachDiv.innerHTML = "";
	}
	var attachList = calItem.getAttachments();
	if (attachList) {
		for (var i = 0; i < attachList.length; i++)
			this.addAttachmentField(calItem, attachList[i]);
	}

	this._setContent(calItem, mode);
	if (this._hasReminderSupport) {
		this.adjustReminderValue(calItem);
        var actions = calItem.alarmActions;
        this._reminderEmailCheckbox.setSelected(actions.contains(ZmCalItem.ALARM_EMAIL));
        this._reminderDeviceEmailCheckbox.setSelected(actions.contains(ZmCalItem.ALARM_DEVICE_EMAIL));
	}

	// Warn the user if trying to schedule an appointment in the past.
	if (calItem instanceof ZmAppt) {
		// We show warning for past meeting creation only when the application calendar. Task also uses the same function.
		ZmApptViewHelper.warnIfApptStartingInPast(calItem.startDate, this._htmlElId, this._allDayCheckbox.checked);
	}
};

ZmCalItemEditView.prototype.adjustReminderValue =
function(calItem) {
    this._reminderSelectInput.setValue(ZmCalendarApp.getReminderSummary(calItem._reminderMinutes));
};

ZmCalItemEditView.prototype._setRepeatDesc =
function(calItem) {
	if (calItem.isCustomRecurrence()) {
        //Bug fix # 58493 - Set the classname if for the first time directly custom weekly/monthly/yearly repetition is selected
        this._repeatDescField.className = "FakeAnchor";
		this._repeatDescField.innerHTML = calItem.getRecurBlurb();
	} else {
		this._repeatDescField.innerHTML = (calItem.getRecurType() != "NON")
			? AjxStringUtil.htmlEncode(ZmMsg.customize) : "";
	}
};

ZmCalItemEditView.prototype._setContent =
function(calItem, mode) {

    var isSavedinHTML = false,
        notesHtmlPart = calItem.getNotesPart(ZmMimeTable.TEXT_HTML),
        notesPart;

    if (calItem.notesTopPart) { //Already existing appointment
        var pattern = /<([A-Z][A-Z0-9]*)\b[^>]*>(.*?)<\/\1>/ig; // improved regex to parse html tags
        if (notesHtmlPart && notesHtmlPart.match(pattern)) {
            isSavedinHTML = true;
        }
    }
    else if (appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED) && (appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT) === ZmSetting.COMPOSE_HTML)) {
        isSavedinHTML = true;
    }

    if( !isSavedinHTML ){
        notesPart = calItem.getNotesPart(ZmMimeTable.TEXT_PLAIN);
    }

    this._controller.setFormatBtnItem(true, isSavedinHTML ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN);
    this.setComposeMode(isSavedinHTML ? Dwt.HTML : Dwt.TEXT);

    if(this._isForward /* && !calItem.isOrganizer() */) {
        var preface = [ZmMsg.DASHES, " ", ZmMsg.originalAppointment, " ", ZmMsg.DASHES].join("");
        if(isSavedinHTML) {
            var crlf2 = "<br><br>";
            var crlf = "<br>";
            notesHtmlPart = crlf2 + preface + crlf + calItem.getInviteDescription(true);
            notesHtmlPart = this.formatContent(notesHtmlPart, true);
        } else {
            var crlf2 = AjxStringUtil.CRLF2;
            var crlf = AjxStringUtil.CRLF;
            notesPart = crlf2 + preface + crlf + calItem.getInviteDescription(false);
            notesPart = this.formatContent(notesPart, false);
        }
    }
    if (isSavedinHTML && notesHtmlPart) notesHtmlPart = AjxStringUtil.defangHtmlContent(notesHtmlPart);

    this._notesHtmlEditor.setContent(isSavedinHTML ? notesHtmlPart : notesPart);
};

ZmCalItemEditView.prototype.formatContent =
function(body, composingHtml) {

    var includePref = appCtxt.get(ZmSetting.FORWARD_INCLUDE_ORIG);
    if (includePref == ZmSetting.INCLUDE_PREFIX || includePref == ZmSetting.INCLUDE_PREFIX_FULL) {
        var preface = (composingHtml ? '<br>' : '\n');
		var wrapParams = {
			text:				body,
			htmlMode:			composingHtml,
			preserveReturns:	true
		}
        body = preface + AjxStringUtil.wordWrap(wrapParams);
    }
    return body;
};

ZmCalItemEditView.prototype.getRepeatType =
function() {
    return this._repeatSelectDisabled ? "NON" : this._repeatSelect.getValue();
}

/**
 * sets any recurrence rules w/in given ZmCalItem object
*/
ZmCalItemEditView.prototype._getRecurrence =
function(calItem) {
	var repeatType = this._repeatSelect.getValue();

	if (this._recurDialog && repeatType == "CUS") {
		calItem.setRecurType(this._recurDialog.getSelectedRepeatValue());

		switch (calItem.getRecurType()) {
			case "DAI": this._recurDialog.setCustomDailyValues(calItem); break;
			case "WEE": this._recurDialog.setCustomWeeklyValues(calItem); break;
			case "MON": this._recurDialog.setCustomMonthlyValues(calItem); break;
			case "YEA": this._recurDialog.setCustomYearlyValues(calItem); break;
		}

		// set the end recur values
		this._recurDialog.setRepeatEndValues(calItem);
	} else {
		calItem.setRecurType(repeatType != "CUS" ? repeatType : "NON");
		this._resetRecurrence(calItem);
	}
};

ZmCalItemEditView.prototype._enableRepeat =
function(enable) {
	if (enable) {
		this._repeatSelect.enable();
		this._repeatDescField.className = (this._repeatSelect.getValue() == "NON") ? "DisabledText" : "FakeAnchor";
	}  else {
		this._repeatSelect.disable();
		this._repeatDescField.className = "DisabledText";
	}
	this._repeatSelectDisabled = !enable;
	this._repeatSelect.setAlign(DwtLabel.ALIGN_LEFT); // XXX: hack b/c bug w/ DwtSelect
};

ZmCalItemEditView.prototype._createHTML =
function() {
	// override
};

ZmCalItemEditView.prototype._createWidgets =
function(width) {
	// subject DwtInputField
	var params = {
		parent: this,
		parentElement: (this._htmlElId + "_subject"),
		inputId: this._htmlElId + "_subject_input",
		type: DwtInputField.STRING,
		label: ZmMsg.subject,
		errorIconStyle: DwtInputField.ERROR_ICON_NONE,
		validationStyle: DwtInputField.CONTINUAL_VALIDATION
	};
	this._subjectField = new DwtInputField(params);
	Dwt.setSize(this._subjectField.getInputElement(), "100%", "2rem");

	// CalItem folder DwtSelect
	this._folderSelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_folderSelect")});
	this._folderSelect.setAttribute('aria-label', ZmMsg.folder);

    this._hasRepeatSupport = Boolean(Dwt.byId(this._htmlElId + "_repeatSelect") != null);

    if(this._hasRepeatSupport) {
        // recurrence DwtSelect
        this._repeatSelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_repeatSelect")});
		this._repeatSelect.setAttribute('aria-label', ZmMsg.repeat);
        this._repeatSelect.addChangeListener(new AjxListener(this, this._repeatChangeListener));
        for (var i = 0; i < ZmApptViewHelper.REPEAT_OPTIONS.length; i++) {
            var option = ZmApptViewHelper.REPEAT_OPTIONS[i];
            this._repeatSelect.addOption(option.label, option.selected, option.value);
        }
    }

	this._hasReminderSupport = Dwt.byId(this._htmlElId + "_reminderSelect") != null;

	// start/end date DwtButton's
	var dateButtonListener = new AjxListener(this, this._dateButtonListener);
	var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);

	// start/end date DwtCalendar's
	this._startDateButton = ZmCalendarApp.createMiniCalButton(this, this._htmlElId + "_startMiniCalBtn", dateButtonListener, dateCalSelectionListener, ZmMsg.startDate);
	this._endDateButton = ZmCalendarApp.createMiniCalButton(this, this._htmlElId + "_endMiniCalBtn", dateButtonListener, dateCalSelectionListener, ZmMsg.endDate);
	this._startDateButton.setSize("20");
	this._startDateButton.setAttribute('aria-label', ZmMsg.startDate);
	this._endDateButton.setSize("20");
	this._endDateButton.setAttribute('aria-label', ZmMsg.endDate);

	if (this._hasReminderSupport) {
		var params = {
			parent: this,
			parentElement: (this._htmlElId + "_reminderSelectInput"),
			type: DwtInputField.STRING,
			label: ZmMsg.reminder,
			errorIconStyle: DwtInputField.ERROR_ICON_NONE,
			validationStyle: DwtInputField.CONTINUAL_VALIDATION,
			className: "DwtInputField ReminderInput"
		};
		this._reminderSelectInput = new DwtInputField(params);
		var reminderInputEl = this._reminderSelectInput.getInputElement();
        // Fix for bug: 83100. Fix adapted from ZmReminderDialog::_createButtons
		Dwt.setSize(reminderInputEl, "120px", "2rem");
		reminderInputEl.onblur = AjxCallback.simpleClosure(this._handleReminderOnBlur, this, reminderInputEl);

		var reminderButtonListener = new AjxListener(this, this._reminderButtonListener);
		var reminderSelectionListener = new AjxListener(this, this._reminderSelectionListener);
		this._reminderButton = ZmCalendarApp.createReminderButton(this, this._htmlElId + "_reminderSelect", reminderButtonListener, reminderSelectionListener);
		this._reminderButton.setSize("20");
		this._reminderButton.setAttribute('aria-label', ZmMsg.reminder);
        this._reminderEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderEmailCheckbox"));
        this._reminderEmailCheckbox.setText(ZmMsg.email);
        this._reminderDeviceEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderDeviceEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderDeviceEmailCheckbox"));
        this._reminderDeviceEmailCheckbox.setText(ZmMsg.deviceEmail);
        this._reminderConfigure = new DwtText({parent:this,className:"FakeAnchor"});
        this._reminderConfigure.setText(ZmMsg.remindersConfigure);
        // NOTE: We can't query the section name based on the pref id
        // NOTE: because that info won't be available until the first time
        // NOTE: prefs app is launched.
        this._reminderConfigure.getHtmlElement().onclick = AjxCallback.simpleClosure(skin.gotoPrefs, skin, "NOTIFICATIONS");
        this._reminderConfigure.replaceElement(document.getElementById(this._htmlElId+"_reminderConfigure"));
		this._setEmailReminderControls();
	    var settings = appCtxt.getSettings();
        var listener = new AjxListener(this, this._settingChangeListener);
        settings.getSetting(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
        settings.getSetting(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
	}

    this._notesContainer = document.getElementById(this._htmlElId + "_notes");
    this._topContainer = document.getElementById(this._htmlElId + "_top");

    this._notesHtmlEditor = new ZmHtmlEditor(this, null, null, this._composeMode, null, this._htmlElId + "_notes");
    this._notesHtmlEditor.addOnContentInitializedListener(new AjxCallback(this,this.resize));
};

ZmCalItemEditView.prototype._handleReminderOnBlur =
function(inputEl) {
	var reminderString = inputEl.value;

	if (!reminderString) {
		inputEl.value = ZmMsg.apptRemindNever;
		return;
	}

	var reminderInfo = ZmCalendarApp.parseReminderString(reminderString);
	var reminderMinutes = ZmCalendarApp.convertReminderUnits(reminderInfo.reminderValue, reminderInfo.reminderUnits);
	inputEl.value = ZmCalendarApp.getReminderSummary(reminderMinutes);
};

ZmCalItemEditView.prototype._addEventHandlers =
function() {
	// override
};

// cache all input fields so we dont waste time traversing DOM each time
ZmCalItemEditView.prototype._cacheFields =
function() {
	this._folderRow			= document.getElementById(this._htmlElId + "_folderRow");
	this._startDateField 	= document.getElementById(this._htmlElId + "_startDateField");
	this._endDateField 		= document.getElementById(this._htmlElId + "_endDateField");
	this._repeatDescField 	= document.getElementById(this._repeatDescId); 		// dont delete!
};

ZmCalItemEditView.prototype._initAttachContainer =
function() {
	// create new table row which will contain parent fieldset
	var table = document.getElementById(this._htmlElId + "_table");
    this._attachmentRow = document.getElementById(this._htmlElId + "_attachment_container");
    if (!this._attachmentRow){
       this._attachmentRow = table.insertRow(-1);
       this._attachmentRow.id = this._htmlElId + "_attachment_container";
    }
	var cell = this._attachmentRow.insertCell(-1);
	cell.colSpan = 2;

	this._uploadFormId = Dwt.getNextId();
	this._attachDivId = Dwt.getNextId();

	var subs = {
		uploadFormId: this._uploadFormId,
		attachDivId: this._attachDivId,
		url: appCtxt.get(ZmSetting.CSFE_UPLOAD_URI)+"&fmt=extended"
	};

	cell.innerHTML = AjxTemplate.expand("calendar.Appointment#AttachContainer", subs);
};

// Returns true if any of the attachment fields are populated
ZmCalItemEditView.prototype._gotAttachments =
function() {
    var id = this._htmlElId;
    if(!this._attachCount || !this._attachDiv) {
        return false;
    }
	var atts = document.getElementsByName(ZmCalItemEditView.UPLOAD_FIELD_NAME);

	for (var i = 0; i < atts.length; i++) {
		if (atts[i].id.indexOf(id) === 0 && atts[i].value.length)
			return true;
	}

	return false;
};

ZmCalItemEditView.prototype.gotNewAttachments =
function() {
    return this._gotAttachments();
};

ZmCalItemEditView.prototype._removedAttachments =
function(){
    var attCheckboxes = document.getElementsByName(ZmCalItem.ATTACHMENT_CHECKBOX_NAME);
	if (attCheckboxes && attCheckboxes.length > 0) {
		for (var i = 0; i < attCheckboxes.length; i++) {
			if (!attCheckboxes[i].checked) {
				return true;
			}
		}
	}
    return false;
};

ZmCalItemEditView.prototype._removeAttachment =
function(removeId) {
	// get document of attachment's iframe
	var removeSpan = document.getElementById(removeId);
	if (removeSpan) {
		// have my parent kill me
		removeSpan._parentDiv.parentNode.removeChild(removeSpan._parentDiv);
		if ((this._attachCount-1) == 0) {
			this._removeAllAttachments();
		} else {
			this._attachCount--;
		}
		if (this._attachCount == ZmCalItemEditView.SHOW_MAX_ATTACHMENTS) {
			this._attachDiv.style.height = "";
		}

        this.resize();
	}
};

ZmCalItemEditView.prototype._removeAllAttachments =
function() {
	if (this._attachCount == 0) { return; }
    var attachRow = document.getElementById(this._htmlElId + "_attachment_container");
    if (attachRow)  Dwt.removeChildren(attachRow);

	// let's be paranoid and really cleanup
	delete this._uploadFormId;
	delete this._attachDivId;
	delete this._attachRemoveId;
	delete this._attachDiv;
	this._attachDiv = this._attachRemoveId = this._attachDivId = this._uploadFormId = null;

	if (this._attachmentRow) delete this._attachmentRow;
	this._attachmentRow = null;
	// reset any attachment related vars
	this._attachCount = 0;
};

ZmCalItemEditView.prototype._submitAttachments =
function() {
	var callback = new AjxCallback(this, this._attsDoneCallback);
	var um = appCtxt.getUploadManager();
	window._uploadManager = um;
	um.execute(callback, document.getElementById(this._uploadFormId));
};

ZmCalItemEditView.prototype._showRecurDialog =
function(repeatType) {
	if (!this._repeatSelectDisabled) {
		this._initRecurDialog(repeatType);
		this._recurDialog.popup();
	}
};

ZmCalItemEditView.prototype._initRecurDialog =
function(repeatType) {
	if (!this._recurDialog) {
		this._recurDialog = new ZmApptRecurDialog(appCtxt.getShell(), this.uid);
		this._recurDialog.addSelectionListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._recurOkListener));
		this._recurDialog.addSelectionListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._recurCancelListener));
	}
	var type = repeatType || this._recurDialogRepeatValue;
	var sd = (AjxDateUtil.simpleParseDateStr(this._startDateField.value)) || (new Date());
	var ed = (AjxDateUtil.simpleParseDateStr(this._endDateField.value)) || (new Date());
	this._recurDialog.initialize(sd, ed, type, this._calItem);
};

ZmCalItemEditView.prototype._showTimeFields =
function(show) {
	// override if applicable
};

// Returns a string representing the form content
ZmCalItemEditView.prototype._formValue =
function(excludeAttendees) {
	// override
};

ZmCalItemEditView.prototype._getComponents =
function() {
	return { above: [this._topContainer], aside: [] };
};

ZmCalItemEditView.prototype._resizeNotes =
function() {
	var bodyFieldId = this._notesHtmlEditor.getBodyFieldId();
	if (this._bodyFieldId != bodyFieldId) {
		this._bodyFieldId = bodyFieldId;
		this._bodyField = document.getElementById(this._bodyFieldId);
	}

	var editorBounds = this.boundsForChild(this._notesHtmlEditor);

	var rowWidth = editorBounds.width;
	var rowHeight = editorBounds.height;

	var components = this._getComponents();

	AjxUtil.foreach(components.above, function(c) {
		rowHeight -= Dwt.getOuterSize(c).y || 0;
	});

	AjxUtil.foreach(components.aside, function(c) {
		rowWidth -= Dwt.getOuterSize(c).x || 0;
	});

	if (rowWidth > 0) {
		// ensure a sensible minimum height
		rowHeight = Math.max(rowHeight, DwtCssStyle.asPixelCount('20rem'));
		this._notesHtmlEditor.setSize(rowWidth, rowHeight);
	}

	Dwt.setSize(this._topContainer, rowWidth, Dwt.CLEAR);
};

ZmCalItemEditView.prototype._handleRepeatDescFieldHover =
function(ev, isHover) {
	if (isHover) {
		var html = this._repeatDescField.innerHTML;
		if (html && html.length > 0) {
			this._repeatDescField.style.cursor = (this._repeatSelectDisabled || this._repeatSelect.getValue() == "NON")
				? "default" : "pointer";

			if (this._rdfTooltip == null) {
				this._rdfTooltip = appCtxt.getShell().getToolTip();
			}

			var content = ["<div style='width:300px'>", html, "</div>"].join("");
			this._rdfTooltip.setContent(content);
			this._rdfTooltip.popup((ev.pageX || ev.clientX), (ev.pageY || ev.clientY));
		}
	} else {
		if (this._rdfTooltip) {
			this._rdfTooltip.popdown();
		}

        this._repeatDescField.style.cursor = (this._repeatSelectDisabled || this._repeatSelect.getValue() == "NON")
            ? "default" : "pointer";

	}
};


// Listeners

ZmCalItemEditView.prototype._dateButtonListener =
function(ev) {
	var calDate = ev.item == this._startDateButton
		? AjxDateUtil.simpleParseDateStr(this._startDateField.value)
		: AjxDateUtil.simpleParseDateStr(this._endDateField.value);

	// if date was input by user and its foobar, reset to today's date
	if (calDate == null || isNaN(calDate)) {
		calDate = new Date();
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
    if (AjxEnv.isIE) {
        menu.getHtmlElement().style.width = "180px";
    }        
};

ZmCalItemEditView.prototype._reminderButtonListener =
function(ev) {
	var menu = ev.item.getMenu();
	var reminderItem = menu.getItem(0);
	ev.item.popup();
};

ZmCalItemEditView.prototype._reminderSelectionListener =
function(ev) {
    if(ev.item && ev.item instanceof DwtMenuItem){
        this._reminderSelectInput.setValue(ev.item.getText());
        this._reminderValue = ev.item.getData("value");

        var enabled = this._reminderValue != 0;
        this._reminderEmailCheckbox.setEnabled(enabled);
        this._reminderDeviceEmailCheckbox.setEnabled(enabled);

        // make sure that we're really allowed to enable these controls!
        if (enabled) {
            this._setEmailReminderControls();
        }
        return;
    }    
};

ZmCalItemEditView.prototype._dateCalSelectionListener =
function(ev) {
	var parentButton = ev.item.parent.parent;
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

	this._oldStartDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	this._oldEndDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);	

	// change the start/end date if they mismatch
    var calItem = this._calItem;
	if (parentButton == this._startDateButton) {
		var ed = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
		if (ed && (ed.valueOf() < ev.detail.valueOf())) {
			this._endDateField.value = newDate;
        } else if (this._oldEndDate && this._endDateField.value != newDate && (calItem.type === ZmItem.APPT)) {
            // Only preserve duration for Appts
            var delta = this._oldEndDate.getTime() - this._oldStartDate.getTime();
            this._endDateField.value = AjxDateUtil.simpleComputeDateStr(new Date(ev.detail.getTime() + delta));
        }
		this._startDateField.value = newDate;
	} else if(parentButton == this._endDateButton) {
		var sd = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
		if (sd && (sd.valueOf() > ev.detail.valueOf()))
			this._startDateField.value = newDate;
		this._endDateField.value = newDate;
	}

    if(this._hasRepeatSupport) {
        var repeatType = this._repeatSelect.getValue();

        if (calItem.isCustomRecurrence() &&
            this._mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE)
        {
            this._checkRecurrenceValidity = true;
            this._initRecurDialog(repeatType);
            // Internal call of the custom recurrence dialog code -
            // Suppress the callback function
            this._enableCustomRecurCallback = false;
            this._recurOkListener();
            this._enableCustomRecurCallback = true;
        }
        else
        {
            var sd = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
            if(sd) {
                this._calItem._recurrence.setRecurrenceStartTime(sd.getTime());
                this._setRepeatDesc(this._calItem);
            }
        }
    }

	// Warn the user if trying to schedule an appointment in the past.
	if (calItem instanceof ZmAppt) {
		// We show warning for past meeting creation only when the application calendar. Task also uses the same function.
		var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
		if (startDate && !this._allDayCheckbox.checked) {
			startDate.setHours(this._startTimeSelect.getHours(), this._startTimeSelect.getMinutes(), 0);
		}
		startDate && ZmApptViewHelper.warnIfApptStartingInPast(startDate, this._htmlElId, this._allDayCheckbox.checked);
	}
};

ZmCalItemEditView.prototype._resetRecurrence =
function(calItem) {
	var recur = calItem._recurrence;
	if(!recur) { return; }
	var startTime = calItem.getStartTime();
	recur.setRecurrenceStartTime(startTime);
};

ZmCalItemEditView.prototype._repeatChangeListener =
function(ev) {
	var newSelectVal = ev._args.newValue;
	if (newSelectVal == "CUS") {
		this._oldRepeatValue = ev._args.oldValue;
		this._showRecurDialog();
	} else {
		this._repeatDescField.innerHTML = newSelectVal != "NON" ? AjxStringUtil.htmlEncode(ZmMsg.customize) : "";
		this._repeatDescField.className = newSelectVal != "NON" ? "FakeAnchor" : "";
	}
	this.notifyListeners(ZmCalItemEditView._REPEAT_CHANGE, ev);
};

ZmCalItemEditView.prototype._recurOkListener =
function(ev) {
	var popdown = true;
	this._recurDialogRepeatValue = this._recurDialog.getSelectedRepeatValue();
	if (this._recurDialogRepeatValue == "NON") {
        this._repeatSelect.setSelectedValue(this._recurDialogRepeatValue);
        this._repeatDescField.innerHTML = "";
	} else {
		if (this._recurDialog.isValid()) {
			this._repeatSelect.setSelectedValue("CUS");
			// update the recur language
			var temp = this._getClone(this._calItem);
			this._getRecurrence(temp);
			var sd = (AjxDateUtil.simpleParseDateStr(this._startDateField.value));
			// If date changed...chnage the values
			if (temp._recurrence._startDate.getDate() != sd.getDate() ||
				temp._recurrence._startDate.getMonth() != sd.getMonth() ||
				temp._recurrence._startDate.getFullYear() != sd.getFullYear())
			{
				if (this._checkRecurrenceValidity) {
					this.validateRecurrence(temp._recurrence._startDate, temp._recurrence._startDate, sd, temp);
					this._checkRecurrenceValidity = false;
				} else {
					this._startDateField.value = AjxDateUtil.simpleComputeDateStr(temp._recurrence._startDate);
					this._endDateField.value = AjxDateUtil.simpleComputeDateStr(temp._recurrence._startDate);
					this.startDate = temp._recurrence._startDate;
					this.endDate = temp._recurrence._startDate;

					var durationInfo = this.getDurationInfo();
					this._calItem.startDate = new Date(durationInfo.startTime);
					this._calItem.endDate = new Date(durationInfo.endTime);
					ZmApptViewHelper.getDateInfo(this, this._dateInfo);
					if (this._locationConflictAppt) {
						this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
						this._locationConflictAppt.endDate = new Date(durationInfo.endTime);
					}
					this._setRepeatDesc(temp);
				}

			} else {
				this._setRepeatDesc(temp);
			}
		} else {
			// give feedback to user about errors in recur dialog
			popdown = false;
		}
	}

	if (popdown) {
		this._recurDialog.popdown();
	}
    if (this._customRecurDialogCallback && this._enableCustomRecurCallback) {
        this._customRecurDialogCallback.run();
    }
};

ZmCalItemEditView.prototype.validateRecurrence =
function(startDate,  endDate, sd, temp) {
	this._newRecurrenceStartDate = startDate;
	this._newRecurrenceEndDate = endDate;	

	var ps = this._dateResetWarningDlg = appCtxt.getYesNoMsgDialog();
	ps.reset();
	ps.setMessage(ZmMsg.validateRecurrence, DwtMessageDialog.WARNING_STYLE);

	ps.registerCallback(DwtDialog.YES_BUTTON, this._dateChangeCallback, this, [startDate, endDate, sd, temp]);
	ps.registerCallback(DwtDialog.NO_BUTTON, this._ignoreDateChangeCallback, this, [startDate, endDate, sd, temp]);
	ps.popup();
};

ZmCalItemEditView.prototype._dateChangeCallback =
function(startDate,  endDate, sd, temp) {
	this._dateResetWarningDlg .popdown();
	this._startDateField.value = AjxDateUtil.simpleComputeDateStr(temp._recurrence._startDate);
	this._endDateField.value = AjxDateUtil.simpleComputeDateStr(temp._recurrence._startDate);
	this.startDate = temp._recurrence._startDate;
	this.endDate = temp._recurrence._startDate;

	var durationInfo = this.getDurationInfo();
	this._calItem.startDate = new Date(durationInfo.startTime);
	this._calItem.endDate = new Date(durationInfo.endTime);
	ZmApptViewHelper.getDateInfo(this, this._dateInfo);
	if (this._locationConflictAppt) {
		this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
		this._locationConflictAppt.endDate = new Date(durationInfo.endTime);
	}
	this._setRepeatDesc(temp);
	this.locationConflictChecker && this.locationConflictChecker();
};

ZmCalItemEditView.prototype._ignoreDateChangeCallback =
function(startDate,  endDate, sd, temp) {
	this._dateResetWarningDlg.popdown();
	if (this._oldStartDate && this._oldEndDate) {
		this._startDateField.value = AjxDateUtil.simpleComputeDateStr(this._oldStartDate);
		this._endDateField.value = AjxDateUtil.simpleComputeDateStr(this._oldEndDate);
		this.startDate = this._oldStartDate;
		this.endDate = this._oldEndDate;
	}

	var durationInfo = this.getDurationInfo();
	this._calItem.startDate = new Date(durationInfo.startTime);
	this._calItem.endDate = new Date(durationInfo.endTime);
	ZmApptViewHelper.getDateInfo(this, this._dateInfo);
	if (this._locationConflictAppt) {
		this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
		this._locationConflictAppt.endDate = new Date(durationInfo.endTime);
	}
	if (this._calItem._recurrence) {
		this._calItem._recurrence._startDate.setTime(this.startDate.getTime());
	}
	this._setRepeatDesc(this._calItem);
	this.locationConflictChecker && this.locationConflictChecker();
};

ZmCalItemEditView.prototype._recurCancelListener =
function(ev) {
	// reset the selected option to whatever it was before user canceled
	this._repeatSelect.setSelectedValue(this._oldRepeatValue);
	this._recurDialog.popdown();
};

ZmCalItemEditView.prototype._controlListener =
function(ev) {
	this.resize();
};


// Callbacks

ZmCalItemEditView.prototype._attsDoneCallback = function(status, attId) {
	DBG.println(AjxDebug.DBG1, "Attachments: status = " + status + ", attId = " + attId);
	if (status == AjxPost.SC_OK) {
		//Checking for Zero sized/wrong path attachments
		var zeroSizedAttachments = false;
		if (typeof attId != "string") {
			var attachmentIds = [];
			for (var i = 0; i < attId.length; i++) {
				var att = attId[i];
				if (att.s == 0) {
					zeroSizedAttachments = true;
					continue;
				}
				attachmentIds.push(att.aid);
			}
			attId = attachmentIds.length > 0 ? attachmentIds.join(",") : null;
		}
		if (zeroSizedAttachments){
			appCtxt.setStatusMsg(ZmMsg.zeroSizedAtts);
		}
		this._controller.saveCalItem(attId);

	} else if (status == AjxPost.SC_UNAUTHORIZED) {
		// It looks like the re-login code was copied from mail's ZmComposeView, and it never worked here.
		// Just let it present the login screen.
		var ex = new AjxException("Authorization Error during attachment upload", ZmCsfeException.SVC_AUTH_EXPIRED);
		this._controller._handleException(ex);
	} else {
		// bug fix #2131 - handle errors during attachment upload.
		this._controller.popupUploadErrorDialog(ZmItem.APPT, status, ZmMsg.errorTryAgain);
		this._controller.enableToolbar(true);
	}
};


ZmCalItemEditView.prototype._getDefaultFocusItem =
function() {
	return this._subjectField;
};

ZmCalItemEditView.prototype._handleOnClick =
function(el) {
	// figure out which input field was clicked
	if (el.id == this._repeatDescId) {
        this._oldRepeatValue = this._repeatSelect.getValue();
        if(this._oldRepeatValue != "NON") {
		    this._showRecurDialog(this._oldRepeatValue);
        }
	} else if (el.id.indexOf("_att_") != -1) {
		this._removeAttachment(el.id);
	}
};

ZmCalItemEditView.prototype.handleDateFocus =
function(el) {
    var isStartDate = (el == this._startDateField);
    if(isStartDate) {
        this._oldStartDateValue = el.value;
    }else {
        this._oldEndDateValue = el.value;
    }
};

ZmCalItemEditView.prototype.handleDateFieldChange =
function(el) {
    var sdField = this._startDateField;
    var edField = this._endDateField;
    var oldStartDate = this._oldStartDateValue ? AjxDateUtil.simpleParseDateStr(this._oldStartDateValue) : null;
    ZmApptViewHelper.handleDateChange(sdField, edField, (el == sdField), false, oldStartDate);

	// Warn the user if trying to schedule an appointment in the past.
	var startDate = AjxDateUtil.simpleParseDateStr(sdField.value);
	if (!this._allDayCheckbox.checked) {
		startDate && startDate.setHours(this._calItem.startDate.getHours(), this._calItem.startDate.getMinutes(), 0);
	}
	startDate && ZmApptViewHelper.warnIfApptStartingInPast(startDate, this._htmlElId, this._allDayCheckbox.checked);
};

ZmCalItemEditView.prototype.handleStartDateChange =
function(sd) {
	var calItem = this._calItem;
	var repeatType = this._repeatSelect.getValue();
	if (calItem.isCustomRecurrence() &&
		this._mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE)
	{
		var temp = this._getClone(this._calItem);		
		this._oldStartDate = temp._startDate;
		this._oldEndDate = temp._endDate;
		this._checkRecurrenceValidity = true;
		this._initRecurDialog(repeatType);
		// Internal call of the custom recurrence dialog code -
		// Suppress the callback function
		this._enableCustomRecurCallback = false;
		this._recurOkListener();
		this._enableCustomRecurCallback = true;
	}
	else
	{
		calItem._recurrence.setRecurrenceStartTime(sd.getTime());
		this._setRepeatDesc(calItem);
	}
};

ZmCalItemEditView.prototype._setEmailReminderControls =
function() {
    var email = appCtxt.get(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS);
    var emailText = ZmCalItemEditView.__getReminderCheckboxText(ZmMsg.emailWithAddress, AjxStringUtil.htmlEncode(email));
    var emailEnabled = Boolean(email);
    this._reminderEmailCheckbox.setEnabled(emailEnabled);
    this._reminderEmailCheckbox.setText(emailText);

    var deviceEmail = appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS);
    var deviceEmailText = ZmCalItemEditView.__getReminderCheckboxText(ZmMsg.deviceEmailWithAddress, AjxStringUtil.htmlEncode(deviceEmail));
    var deviceEmailEnabled = appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ENABLED) && Boolean(deviceEmail);
    this._reminderDeviceEmailCheckbox.setEnabled(deviceEmailEnabled);
    this._reminderDeviceEmailCheckbox.setText(deviceEmailText);

    var configureEnabled = !emailEnabled && !deviceEmailEnabled;
    this._reminderEmailCheckbox.setVisible(!configureEnabled);
    this._reminderDeviceEmailCheckbox.setVisible((!configureEnabled && appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ENABLED)));
};

ZmCalItemEditView.__getReminderCheckboxText = function(pattern, email) {
    if (!email) {
        var onclick = 'skin.gotoPrefs("NOTIFICATIONS");return false;';
        email = [
            "<a href='#notifications' onclick='",onclick,"'>",
                ZmMsg.remindersConfigureNow,
            "</a>"
        ].join("");
    }
    return AjxMessageFormat.format(pattern,[email]);
};

ZmCalItemEditView.prototype._settingChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_SETTING) { return; }
	var id = ev.source.id;
	if (id == ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS || id == ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS) {
		this._setEmailReminderControls();
	}
};

ZmCalItemEditView.prototype.deactivate =
function() {
	this._controller.inactive = true;
};

// Static methods

ZmCalItemEditView._onClick =
function(ev) {
	ev = ev || window.event;
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	if (edv) {
		edv._handleOnClick(el);
	}
};

ZmCalItemEditView._onKeyDown =
function(ev) {
	ev = ev || window.event;
	var el = DwtUiEvent.getTarget(ev);
	if (el.id.indexOf("_att_") != -1) {
		// ignore enter key press in IE otherwise it tries to send the attachment!
		var key = DwtKeyEvent.getCharCode(ev);
		return !DwtKeyEvent.IS_RETURN[key];
	}
};

ZmCalItemEditView._onMouseOver =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	if (el == edv._repeatDescField) {
		edv._handleRepeatDescFieldHover(ev, true);
	}
};

ZmCalItemEditView._onMouseOut =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	if (el == edv._repeatDescField) {
		edv._handleRepeatDescFieldHover(ev, false);
	}
};

ZmCalItemEditView._onChange =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	var sdField = edv._startDateField;
    edv.handleDateFieldChange(el);

	var calItem = edv._calItem;
	var sd = AjxDateUtil.simpleParseDateStr(sdField.value);
	edv.handleStartDateChange(sd);
};

ZmCalItemEditView._onFocus =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	edv.handleDateFocus(el);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalItemView")) {
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
 * Creates an empty calItem view used to display read-only calendar items.
 * @constructor
 * @class
 * Simple read-only view of an appointment or task. It looks more or less like a
 * message - the notes have their own area at the bottom, and everything else
 * goes into a header section at the top.
 *
 * @author Parag Shah
 * @author Conrad Damon
 *
 * @param {DwtComposite}	parent		the parent widget
 * @param {constant}	posStyle	the positioning style
 * @param {ZmController}	controller	the owning controller
 * 
 * @extends		ZmMailMsgView
 * 
 * @private
 */
ZmCalItemView = function(parent, posStyle, controller, id) {
	if (arguments.length == 0) return;

	params = {parent: parent, posStyle: posStyle, controller: controller};
	if (id) {
		params.id = id;
	}
	ZmMailMsgView.call(this, params);
};

ZmCalItemView.prototype = new ZmMailMsgView;
ZmCalItemView.prototype.constructor = ZmCalItemView;

// Public methods

ZmCalItemView.prototype.isZmCalItemView = true;
ZmCalItemView.prototype.toString = function() { return "ZmCalItemView"; };

ZmCalItemView.prototype.getController =
function() {
	return this._controller;
};

// Following public overrides are a hack to allow this view to pretend it's a list view,
// as well as a calendar view
ZmCalItemView.prototype.getSelection =
function() {
	return [this._calItem];
};

ZmCalItemView.prototype.getSelectionCount =
function() {
	return 1;
};

ZmCalItemView.prototype.needsRefresh =
function() {
	return false;
};

ZmCalItemView.prototype.addSelectionListener = function() {};
ZmCalItemView.prototype.addActionListener = function() {};
ZmCalItemView.prototype.handleActionPopdown = function(ev) {};

ZmCalItemView.prototype.getTitle =
function() {
	// override
};

ZmCalItemView.prototype.set =
function(calItem, prevView, mode) {
	if (this._calItem == calItem) { return; }

	// So that Close button knows which view to go to
    // condition introduced to avoid irrelevant view being persisted as previous view
	var viewMgr = this._controller._viewMgr;
	this._prevView = prevView || (viewMgr && (calItem.folderId != ZmFolder.ID_TRASH) ?
	                              viewMgr.getCurrentViewName() : this._prevView);

	this.reset();
	this._calItem = this._item = calItem;
	this._mode = mode;
	this._renderCalItem(calItem, true);
};

ZmCalItemView.prototype.reset =
function() {
	ZmMailMsgView.prototype.reset.call(this);
	this._calItem = this._item = null;
};

ZmCalItemView.prototype.close = function() {}; // override
ZmCalItemView.prototype.move = function() {}; // override
ZmCalItemView.prototype.changeReminder = function() {}; // override


// Private / protected methods

ZmCalItemView.prototype._renderCalItem =
function(calItem, renderButtons) {
	this._lazyCreateObjectManager();

	var subs = this._getSubs(calItem);
	var closeBtnCellId = this._htmlElId + "_closeBtnCell";
	var editBtnCellId = this._htmlElId + "_editBtnCell";
	this._hdrTableId = this._htmlElId + "_hdrTable";

    var calendar = calItem.getFolder();
    var isReadOnly = calendar.isReadOnly();
    subs.allowEdit = !isReadOnly && (appCtxt.get(ZmSetting.CAL_APPT_ALLOW_ATTENDEE_EDIT) || calItem.isOrg);

	var el = this.getHtmlElement();
	el.innerHTML = AjxTemplate.expand("calendar.Appointment#ReadOnlyView", subs);
	var offlineHandler = appCtxt.webClientOfflineHandler;
	if (offlineHandler) {
		var linkIds = [ZmCalItem.ATT_LINK_IMAGE, ZmCalItem.ATT_LINK_MAIN, ZmCalItem.ATT_LINK_DOWNLOAD];
		var getLinkIdCallback = this._getAttachmentLinkId.bind(this);
		offlineHandler._handleAttachmentsForOfflineMode(calItem.getAttachments(), getLinkIdCallback, linkIds);
	}

    if (renderButtons) {
        // add the close button
        this._closeButton = new DwtButton({parent:this, className:"DwtToolbarButton"});
        this._closeButton.setImage("Close");
        this._closeButton.setText(ZmMsg.close);
        this._closeButton.addSelectionListener(new AjxListener(this, this.close));
        this._closeButton.reparentHtmlElement(closeBtnCellId);

        if (document.getElementById(editBtnCellId)) {
            // add the save button for reminders and  move select
            this._editButton = new DwtButton({parent:this, className:"DwtToolbarButton"});
            this._editButton.setImage("Edit");
            this._editButton.setText(ZmMsg.edit);
            this._editButton.addSelectionListener(new AjxListener(this, this.edit));
            var calendar = calItem && appCtxt.getById(calItem.folderId);
            var isTrash = calendar && calendar.id == ZmOrganizer.ID_TRASH;
            this._editButton.setEnabled(!isTrash);
            this._editButton.reparentHtmlElement(editBtnCellId);
        }
    }

	// content/body
	var hasHtmlPart = (calItem.notesTopPart && calItem.notesTopPart.getContentType() == ZmMimeTable.MULTI_ALT);
	var mode = (hasHtmlPart && appCtxt.get(ZmSetting.VIEW_AS_HTML))
		? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN;

	var bodyPart = calItem.getNotesPart(mode);
	if (bodyPart) {
		this._msg = this._msg || this._calItem._currentlyLoaded;
        if (mode === ZmMimeTable.TEXT_PLAIN) {
            bodyPart = AjxStringUtil.convertToHtml(bodyPart);
        }
		this._makeIframeProxy({container: el, html:bodyPart, isTextMsg:(mode == ZmMimeTable.TEXT_PLAIN)});
	}
};

ZmCalItemView.prototype._getSubs =
function(calItem) {
	// override
};

ZmCalItemView.prototype._getTimeString =
function(calItem) {
	// override
};

ZmCalItemView.prototype._setAttachmentLinks =
function() {
	// do nothing since calItem view renders attachments differently
};

// returns true if given dates are w/in a single day
ZmCalItemView.prototype._isOneDayAppt =
function(sd, ed) {
	var start = new Date(sd.getTime());
	var end = new Date(ed.getTime());

	start.setHours(0, 0, 0, 0);
	end.setHours(0, 0, 0, 0);

	return start.valueOf() == end.valueOf();
};



ZmCalItemView.prototype._getAttachString =
function(calItem) {
	var str = [];
	var j = 0;

	var attachList = calItem.getAttachments();
	if (attachList) {
		var getLinkIdCallback = this._getAttachmentLinkId.bind(this);
		for (var i = 0; i < attachList.length; i++) {
			str[j++] = ZmApptViewHelper.getAttachListHtml(calItem, attachList[i], false, getLinkIdCallback);
		}
	}

	return str.join("");
};

ZmCalItemView.rfc822Callback =
function(invId, partId) {
	AjxDispatcher.require("MailCore", false);
	ZmMailMsgView.rfc822Callback(invId, partId);
};

/**
 * Creates an empty appointment view.
 * @constructor
 * @class
 * Simple read-only view of an appointment. It looks more or less like a message -
 * the notes have their own area at the bottom, and everything else goes into a
 * header section at the top.
 *
 * @author Parag Shah
 * @author Conrad Damon
 *
 * @param {DwtComposite}	parent		the parent widget
 * @param {constant}	posStyle	the positioning style
 * @param {ZmController}	controller	the owning controller
 * 
 * @extends		ZmCalItemView
 * 
 * @private
 */
ZmApptView = function(parent, posStyle, controller) {

	ZmCalItemView.call(this, parent, posStyle, controller);
};

ZmApptView.prototype = new ZmCalItemView;
ZmApptView.prototype.constructor = ZmApptView;

ZmApptView.prototype.isZmApptView = true;
ZmApptView.prototype.toString = function() { return "ZmApptView"; };

// Public methods

ZmApptView.prototype.getTitle =
function() {
    return [ZmMsg.zimbraTitle, ZmMsg.appointment].join(": ");
};

ZmApptView.prototype.edit =
function(ev) {
	var item = this._calItem;

    if(!item.isOrg && !(this._editWarningDialog && this._editWarningDialog.isPoppedUp())){
        var msgDialog = this._editWarningDialog = appCtxt.getMsgDialog();
        msgDialog.setMessage(ZmMsg.attendeeEditWarning, DwtMessageDialog.WARNING_STYLE);
        msgDialog.popup();
        msgDialog.registerCallback(DwtDialog.OK_BUTTON, this.edit, this);
        return;
    }else if(this._editWarningDialog){
        this._editWarningDialog.popdown();
		this._editWarningDialog.reset();
    }
    
	var mode = ZmCalItem.MODE_EDIT;
	if (item.isRecurring()) {
		mode = this._mode || ZmCalItem.MODE_EDIT_SINGLE_INSTANCE;
	}
	item.setViewMode(mode);
	var app = this._controller._app;
	app.getApptComposeController().show(item, mode);
};

ZmApptView.prototype.setBounds =
function(x, y, width, height) {
	// dont reset the width!
	ZmMailMsgView.prototype.setBounds.call(this, x, y, Dwt.DEFAULT, height);
};

ZmApptView.prototype._renderCalItem =
function(calItem) {

	this._lazyCreateObjectManager();

	var subs = this._getSubs(calItem);
	subs.subject = AjxStringUtil.htmlEncode(subs.subject);
	subs.location = AjxStringUtil.htmlEncode(subs.location);

	this._hdrTableId = this._htmlElId + "_hdrTable";

    var calendar = calItem.getFolder();
    var isReadOnly = calendar.isReadOnly() || calendar.isInTrash();
    subs.allowEdit = !isReadOnly && (appCtxt.get(ZmSetting.CAL_APPT_ALLOW_ATTENDEE_EDIT) || calItem.isOrg);

	var el = this.getHtmlElement();
	el.innerHTML = AjxTemplate.expand("calendar.Appointment#ReadOnlyView", subs);
	var offlineHandler = appCtxt.webClientOfflineHandler;
	if (offlineHandler) {
		var linkIds = [ZmCalItem.ATT_LINK_IMAGE, ZmCalItem.ATT_LINK_MAIN, ZmCalItem.ATT_LINK_DOWNLOAD];
		var getLinkIdCallback = this._getAttachmentLinkId.bind(this);
		offlineHandler._handleAttachmentsForOfflineMode(calItem.getAttachments(), getLinkIdCallback, linkIds);
	}

	// Set tab name as Appointment subject
	var subject = AjxStringUtil.trim(calItem.getName());
	if (subject) {
		var tabButtonText = subject.substring(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT);
		appCtxt.getAppViewMgr().setTabTitle(this._controller.getCurrentViewId(), tabButtonText);
	}

	this._createBubbles();

    var selParams = {parent: this, id: Dwt.getNextId('ZmNeedActionSelect_')};
    var statusSelect = new DwtSelect(selParams);

    var ptst = {};
    ptst[ZmCalBaseItem.PSTATUS_NEEDS_ACTION] = ZmMsg.ptstMsgNeedsAction;
    ptst[ZmCalBaseItem.PSTATUS_ACCEPT] = ZmMsg.ptstMsgAccepted;
    ptst[ZmCalBaseItem.PSTATUS_TENTATIVE] = ZmMsg.ptstMsgTentative;
    ptst[ZmCalBaseItem.PSTATUS_DECLINED] = ZmMsg.ptstMsgDeclined;

    this._ptst = ptst;
    //var statusMsgs = {};
    var calItemPtst = calItem.ptst || ZmCalBaseItem.PSTATUS_ACCEPT;

    var data = null;
    for (var stat in ptst) {
        //stat = ptst[index];
        if (stat === ZmCalBaseItem.PSTATUS_NEEDS_ACTION && calItemPtst !== ZmCalBaseItem.PSTATUS_NEEDS_ACTION) { continue; }
        data = new DwtSelectOptionData(stat, ZmCalItem.getLabelForParticipationStatus(stat), false, null, ZmCalItem.getParticipationStatusIcon(stat), Dwt.getNextId('ZmNeedActionOption_' + stat + '_'));
        statusSelect.addOption(data);
        if (stat == calItemPtst){
            statusSelect.setSelectedValue(stat);
        }
    }
    if (isReadOnly) { statusSelect.setEnabled(false); }

    this._statusSelect = statusSelect;
    this._origPtst = calItemPtst;
    statusSelect.reparentHtmlElement(this._htmlElId + "_responseActionSelectCell");
    statusSelect.addChangeListener(new AjxListener(this, this._statusSelectListener));

    this._statusMsgEl = document.getElementById(this._htmlElId + "_responseActionMsgCell");
    this._statusMsgEl.innerHTML = ptst[calItemPtst];

	// content/body
	var hasHtmlPart = (calItem.notesTopPart && calItem.notesTopPart.getContentType() == ZmMimeTable.MULTI_ALT);
	var mode = (hasHtmlPart && appCtxt.get(ZmSetting.VIEW_AS_HTML))
		? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN;

	var bodyPart = calItem.getNotesPart(mode);
	if (bodyPart) {
		this._msg = this._msg || this._calItem._currentlyLoaded;
        if (mode === ZmMimeTable.TEXT_PLAIN) {
            bodyPart = AjxStringUtil.convertToHtml(bodyPart);
        }
		this._makeIframeProxy({container: el, html:bodyPart, isTextMsg:(mode == ZmMimeTable.TEXT_PLAIN)});
	}
};

ZmApptView.prototype._getSubs =
function(calItem) {
	var subject   = calItem.getName();
	var location  = calItem.location;
	var equipment = calItem.getAttendeesText(ZmCalBaseItem.EQUIPMENT, true);
	var isException = calItem._orig.isException;
	var dateStr = this._getTimeString(calItem);

	this._clearBubbles();
	var reqAttendees = this._getAttendeesByRoleCollapsed(calItem.getAttendees(ZmCalBaseItem.PERSON), ZmCalBaseItem.PERSON, ZmCalItem.ROLE_REQUIRED);
	var optAttendees = this._getAttendeesByRoleCollapsed(calItem.getAttendees(ZmCalBaseItem.PERSON), ZmCalBaseItem.PERSON, ZmCalItem.ROLE_OPTIONAL);
	var hasAttendees = reqAttendees || optAttendees;

	var organizer, obo;
	var recurStr = calItem.isRecurring() ? calItem.getRecurBlurb() : null;
	var attachStr = this._getAttachString(calItem);

	if (hasAttendees) { // I really don't know why this check here but it's the way it was before so keeping it. (I just renamed the var)
		organizer = new AjxEmailAddress(calItem.getOrganizer(), null, calItem.getOrganizerName());

		var sender = calItem.message.getAddress(AjxEmailAddress.SENDER);
		var from = calItem.message.getAddress(AjxEmailAddress.FROM);
		var address = sender || from;
		if (!organizer && address)	{
			organizer = address.toString();
		}
		if (sender && organizer) {
			obo = from ? new AjxEmailAddress(from.toString()) : organizer;
		}
	}

	organizer = organizer && this._getBubbleHtml(organizer);
	obo = obo && this._getBubbleHtml(obo);

	return {
		id:             this._htmlElId,
		subject:        subject,
		location:       location,
		equipment:      equipment,
		isException:    isException,
		dateStr:        dateStr,
        isAttendees:    hasAttendees,
        reqAttendees:   reqAttendees,
		optAttendees:   optAttendees,
		org:            organizer,
		obo:            obo,
		recurStr:       recurStr,
		attachStr:      attachStr,
		folder:         appCtxt.getTree(ZmOrganizer.CALENDAR).getById(calItem.folderId),
		folderLabel:    ZmMsg.calendar,
		reminderLabel:  ZmMsg.reminder,
		alarm:          calItem.alarm,
		isAppt:         true,
        _infoBarId:     this._infoBarId
	};
};

/**
 * Creates a string of attendees by role. If an item doesn't have a name, its address is used.
 *
 * calls common code from mail msg view to get the collapse/expand "show more" funcitonality for large lists.
 *
 * @param list					[array]			list of attendees (ZmContact or ZmResource)
 * @param type					[constant]		attendee type
 * @param role      		        [constant]      attendee role
 */
ZmApptView.prototype._getAttendeesByRoleCollapsed = function(list, type, role) {

	if (!(list && list.length)) {
		return "";
	}
	var attendees = ZmApptViewHelper.getAttendeesArrayByRole(list, role);

	var emails = [];
	for (var i = 0; i < attendees.length; i++) {
		var att = attendees[i];
		emails.push(new AjxEmailAddress(att.getEmail(), type, att.getFullName(), att.getFullName(), att.isGroup(), att.canExpand));
	}

	var options = {};
	options.shortAddress = appCtxt.get(ZmSetting.SHORT_ADDRESS);
	var addressInfo = this.getAddressesFieldHtmlHelper(emails, options, role);
	return addressInfo.html;
};

ZmApptView.prototype._getTimeString =
function(calItem) {
	var sd = calItem._orig.startDate;
	var ed = calItem._orig.endDate;
    var tz = TzMsg[AjxTimezone.DEFAULT] || AjxTimezone.getServerId(AjxTimezone.DEFAULT)

	if (calItem.isRecurring() && this._mode == ZmCalItem.MODE_EDIT_SERIES) {
		sd = calItem.startDate;
		ed = calItem.endDate;
        var seriesTZ = calItem.getTimezone();

        //convert to client timezone if appt's timezone differs
        if(seriesTZ != AjxTimezone.getServerId(AjxTimezone.DEFAULT)) {
            var offset1 = AjxTimezone.getOffset(AjxTimezone.DEFAULT, sd);
		    var offset2 = AjxTimezone.getOffset(AjxTimezone.getClientId(seriesTZ), sd);
            sd.setTime(sd.getTime() + (offset1 - offset2)*60*1000);
            ed.setTime(ed.getTime() + (offset1 - offset2)*60*1000);
            calItem.setTimezone(AjxTimezone.getServerId(AjxTimezone.DEFAULT));
        }
	}

	var isAllDay = calItem.isAllDayEvent();
	var isMultiDay = calItem.isMultiDay();
	if (isAllDay && isMultiDay) {
		ed.setDate(calItem.endDate.getDate());
	}

	var pattern = isAllDay ?
				  (isMultiDay ? ZmMsg.apptTimeAllDayMulti   : ZmMsg.apptTimeAllDay) :
				  (isMultiDay ? ZmMsg.apptTimeInstanceMulti : ZmMsg.apptTimeInstance);
	var params = [sd, ed, tz];

	return AjxMessageFormat.format(pattern, params);
};

ZmApptView.prototype.set =
function(appt, mode) {
	this.reset();
	this._calItem = this._item = appt;
	this._mode = mode;
	this._renderCalItem(appt, false);
};

ZmApptView.prototype.reEnableDesignMode =
function() {

};

ZmApptView.prototype.isDirty =
function() {
    var retVal = false,
        value = this._statusSelect.getValue();
    if(this._origPtst != value) {
        retVal = true;
    }
    return retVal;
};

ZmApptView.prototype.isValid =
function() {
    // No fields to validate
    return true;
}

ZmApptView.prototype.setOrigPtst =
function(value) {
    this._origPtst = value;
    this._statusSelectListener();
};

ZmApptView.prototype.cleanup =
function() {
    return false;
};

ZmApptView.prototype.close =
function() {
    this._controller._closeView();
};

ZmApptView.prototype.getOpValue =
function() {
    var value = this._statusSelect.getValue(),
        statusToOp = {};
    statusToOp[ZmCalBaseItem.PSTATUS_NEEDS_ACTION] = null;
    statusToOp[ZmCalBaseItem.PSTATUS_ACCEPT] = ZmOperation.REPLY_ACCEPT;
    statusToOp[ZmCalBaseItem.PSTATUS_TENTATIVE] = ZmOperation.REPLY_TENTATIVE;
    statusToOp[ZmCalBaseItem.PSTATUS_DECLINED] = ZmOperation.REPLY_DECLINE;
    return statusToOp[value];
};

ZmApptView.prototype._statusSelectListener =
function() {
    var saveButton = this.getController().getCurrentToolbar().getButton(ZmOperation.SAVE),
        value = this._statusSelect.getValue();
    saveButton.setEnabled(this._origPtst != value);
    this._statusMsgEl.innerHTML = this._ptst[value];
};

ZmApptView.prototype._getDialogXY =
function() {
	var loc = Dwt.toWindow(this.getHtmlElement(), 0, 0);
	return new DwtPoint(loc.x + ZmApptComposeView.DIALOG_X, loc.y + ZmApptComposeView.DIALOG_Y);
};
}

if (AjxPackage.define("zimbraMail.calendar.controller.ZmCalendarTreeController")) {
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
 * Creates a calendar tree controller.
 * @constructor
 * @class
 * This class manages the calendar tree controller.
 *
 * @author Parag Shah
 *
 * @extends		ZmTreeController
 */
ZmCalendarTreeController = function() {

	ZmTreeController.call(this, ZmOrganizer.CALENDAR);

	this._listeners[ZmOperation.NEW_CALENDAR]			= this._newListener.bind(this);
	this._listeners[ZmOperation.ADD_EXTERNAL_CALENDAR]	= this._addExternalCalendarListener.bind(this);
	this._listeners[ZmOperation.CHECK_ALL]				= this._checkAllListener.bind(this);
	this._listeners[ZmOperation.CLEAR_ALL]				= this._clearAllListener.bind(this);
	this._listeners[ZmOperation.DETACH_WIN]				= this._detachListener.bind(this);
	this._listeners[ZmOperation.SHARE_CALENDAR]			= this._shareCalListener.bind(this);
    this._listeners[ZmOperation.MOVE]					= this._moveListener.bind(this);
	this._listeners[ZmOperation.RECOVER_DELETED_ITEMS]	= this._recoverListener.bind(this);

	this._eventMgrs = {};
};

ZmCalendarTreeController.prototype = new ZmTreeController;
ZmCalendarTreeController.prototype.constructor = ZmCalendarTreeController;

ZmCalendarTreeController.prototype.isZmCalendarTreeController = true;
ZmCalendarTreeController.prototype.toString = function() { return "ZmCalendarTreeController"; };

ZmCalendarTreeController.prototype._initializeActionMenus = function() {
	ZmTreeController.prototype._initializeActionMenus.call(this);

	var ops = this._getRemoteActionMenuOps();
	if (!this._remoteActionMenu && ops) {
		var args = [this._shell, ops];
		this._remoteActionMenu = new AjxCallback(this, this._createActionMenu, args);
	}

}

ZmCalendarTreeController.prototype._treeListener =
function(ev) {

    ZmTreeController.prototype._treeListener.call(this, ev);

	if(ev.detail == DwtTree.ITEM_EXPANDED){
        var calItem = ev.item;
        var calendar = calItem.getData(Dwt.KEY_OBJECT);
        if(calendar && calendar.isRemote() && calendar.isMountpoint){
            this._fixupTreeNode(calItem, calendar, calItem._tree);
        }
	}
};

// Public methods

/**
 * Displays the tree of this type.
 *
 * @param {Hash}	params		a hash of parameters
 * @param	{constant}	params.overviewId		the overview ID
 * @param	{Boolean}	params.showUnread		if <code>true</code>, unread counts will be shown
 * @param	{Object}	params.omit				a hash of organizer IDs to ignore
 * @param	{Object}	params.include			a hash of organizer IDs to include
 * @param	{Boolean}	params.forceCreate		if <code>true</code>, tree view will be created
 * @param	{String}	params.app				the app that owns the overview
 * @param	{Boolean}	params.hideEmpty		if <code>true</code>, don't show header if there is no data
 * @param	{Boolean}	params.noTooltips	if <code>true</code>, don't show tooltips for tree items
 */
ZmCalendarTreeController.prototype.show = function(params) {
	params.include = params.include || {};
    params.include[ZmFolder.ID_TRASH] = true;
    params.showUnread = false;
    return ZmFolderTreeController.prototype.show.call(this, params);
};

/**
 * Gets all calendars.
 * 
 * @param	{String}	overviewId		the overview id
 * @param   {boolean}   includeTrash    True to include trash, if checked.
 * @return	{Array}		an array of {@link ZmCalendar} objects
 */
ZmCalendarTreeController.prototype.getCalendars =
function(overviewId, includeTrash) {
	var calendars = [];
	var items = this._getItems(overviewId);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item._isSeparator) { continue; }
	    var calendar = item.getData(Dwt.KEY_OBJECT);
        if (calendar) {
            if (calendar.id == ZmOrganizer.ID_TRASH && !includeTrash) continue;
			calendars.push(calendar);
        }
	}

	return calendars;
};

/**
 * Gets the owned calendars.
 * 
 * @param	{String}	overviewId		the overview id
 * @param	{String}	owner		the owner
 * @return	{Array}		an array of {@link ZmCalendar} objects
 */
ZmCalendarTreeController.prototype.getOwnedCalendars =
function(overviewId, owner) {
	var calendars = [];
	var items = this._getItems(overviewId);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (!item || item._isSeparator) { continue; }
		var calendar = item.getData(Dwt.KEY_OBJECT);
		if (calendar && calendar.getOwner() == owner) {
			calendars.push(calendar);
		}
	}

	return calendars;
};

ZmCalendarTreeController.prototype.addSelectionListener =
function(overviewId, listener) {
	// Each overview gets its own event manager
	if (!this._eventMgrs[overviewId]) {
		this._eventMgrs[overviewId] = new AjxEventMgr;
		// Each event manager has its own selection event to avoid multi-threaded
		// collisions
		this._eventMgrs[overviewId]._selEv = new DwtSelectionEvent(true);
	}
	this._eventMgrs[overviewId].addListener(DwtEvent.SELECTION, listener);
};

ZmCalendarTreeController.prototype.removeSelectionListener =
function(overviewId, listener) {
	if (this._eventMgrs[overviewId]) {
		this._eventMgrs[overviewId].removeListener(DwtEvent.SELECTION, listener);
	}
};

// Protected methods

ZmCalendarTreeController.prototype.resetOperations = 
function(actionMenu, type, id) {
	if (actionMenu && !appCtxt.isWebClientOffline()) {
		var calendar = appCtxt.getById(id);
		var nId;
		if (calendar) {
			nId = calendar.nId;
            var isShareVisible = (!calendar.link || calendar.isAdmin()) && nId != ZmFolder.ID_TRASH;
            if (appCtxt.isOffline) {
                var acct = calendar.getAccount();
                isShareVisible = !acct.isMain && acct.isZimbraAccount;
            }
			actionMenu.enable(ZmOperation.SHARE_CALENDAR, isShareVisible);
			actionMenu.enable(ZmOperation.SYNC, calendar.isFeed());
		} else {
			nId = ZmOrganizer.normalizeId(id);
		}
		var isTrash = (nId == ZmFolder.ID_TRASH);
		actionMenu.enable(ZmOperation.DELETE_WITHOUT_SHORTCUT, (nId != ZmOrganizer.ID_CALENDAR && nId != ZmOrganizer.ID_TRASH));
		this.setVisibleIfExists(actionMenu, ZmOperation.EMPTY_FOLDER, nId == ZmFolder.ID_TRASH);
		var hasContent = ((calendar.numTotal > 0) || (calendar.children && (calendar.children.size() > 0)));
		actionMenu.enable(ZmOperation.EMPTY_FOLDER,hasContent);

        var moveItem = actionMenu.getItemById(ZmOperation.KEY_ID,ZmOperation.MOVE);

		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
		if (id == rootId) {
			var items = this._getItems(this._actionedOverviewId);
			var foundChecked = false;
			var foundUnchecked = false;
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (item._isSeparator) continue;
				item.getChecked() ? foundChecked = true : foundUnchecked = true;
			}
			actionMenu.enable(ZmOperation.CHECK_ALL, foundUnchecked);
			actionMenu.enable(ZmOperation.CLEAR_ALL, foundChecked);
		}

		this._enableRecoverDeleted(actionMenu, isTrash);

		// we always enable sharing in case we're in multi-mbox mode
		this._resetButtonPerSetting(actionMenu, ZmOperation.SHARE_CALENDAR, appCtxt.get(ZmSetting.SHARING_ENABLED));
		this._resetButtonPerSetting(actionMenu, ZmOperation.FREE_BUSY_LINK, appCtxt.getActiveAccount().isZimbraAccount);

        var fbLinkMenuItem = actionMenu.getMenuItem(ZmOperation.FREE_BUSY_LINK);
        if (fbLinkMenuItem){
            //setting up free busy link submenu
            actionMenu._fbLinkSubMenu = actionMenu._fbLinkSubMenu || this._getFreeBusySubMenu(actionMenu, calendar.restUrl);

            fbLinkMenuItem.setMenu(actionMenu._fbLinkSubMenu);
        }

        actionMenu.enable(ZmOperation.NEW_CALENDAR, !isTrash && !appCtxt.isExternalAccount() && !appCtxt.isWebClientOffline());

    }
};

ZmCalendarTreeController.prototype._getFreeBusySubMenu =
function(actionMenu, restUrl){
        var subMenuItems = [ZmOperation.SEND_FB_HTML,ZmOperation.SEND_FB_ICS,ZmOperation.SEND_FB_ICS_EVENT];
        var params = {parent:actionMenu, menuItems:subMenuItems};
	    var subMenu = new ZmActionMenu(params);
        for(var s=0;s<subMenuItems.length;s++){
            subMenu.addSelectionListener(subMenuItems[s], this._freeBusyLinkListener.bind(this, subMenuItems[s], restUrl) );
        }
        return subMenu;
}

ZmCalendarTreeController.prototype._detachListener =
function(ev){
	var folder = this._getActionedOrganizer(ev);
    if (!folder){
        return;
    }
    var acct = folder.getAccount();
    var noRemote = true;  // noRemote is to achieve a restUrl that points to user's mailbox instead of the shared calendar owner's mailbox
    var url = folder.getRestUrl(acct, noRemote);
    if (url) {
		window.open(url+".html?tz=" + AjxTimezone.DEFAULT, "_blank");
	}
};

ZmCalendarTreeController.prototype._freeBusyLinkListener =
function(op, restUrl, ev){
	var inNewWindow = false;
	var app = appCtxt.getApp(ZmApp.CALENDAR);
	if (app) {
		inNewWindow = app._inNewWindow(ev);
	}
	restUrl = restUrl || appCtxt.get(ZmSetting.REST_URL);
	if (restUrl) {
	   restUrl += op === ZmOperation.SEND_FB_ICS_EVENT ? "?fmt=ifb&fbfmt=event" : op === ZmOperation.SEND_FB_ICS ? "?fmt=ifb" : "?fmt=freebusy";
	}
	var params = {
		action: ZmOperation.NEW_MESSAGE, 
		inNewWindow: inNewWindow,
		msg: (new ZmMailMsg()),
		extraBodyText: restUrl
	};
	AjxDispatcher.run("Compose", params);
};

ZmCalendarTreeController.prototype._recoverListener =
function(ev) {
	appCtxt.getDumpsterDialog().popup(this._getSearchFor(), this._getSearchTypes());
};

ZmCalendarTreeController.prototype._getSearchFor =
function(ev) {
	return ZmItem.APPT;
};

ZmCalendarTreeController.prototype._getSearchTypes =
function(ev) {
	return [ZmItem.APPT];
};

// Returns a list of desired header action menu operations
ZmCalendarTreeController.prototype._getHeaderActionMenuOps =
function() {
    var ops = [];
    if (appCtxt.getCurrentApp().containsWritableFolder()) {
        ops.push(ZmOperation.NEW_CALENDAR,
                    ZmOperation.ADD_EXTERNAL_CALENDAR,
                    ZmOperation.CHECK_ALL,
                    ZmOperation.CLEAR_ALL,
                    ZmOperation.SEP,
                    ZmOperation.FREE_BUSY_LINK);
    }
    else {
        ops.push(ZmOperation.CHECK_ALL,
                ZmOperation.CLEAR_ALL);
    }

	ops.push(ZmOperation.FIND_SHARES);

	return ops;
};


// Returns a list of desired remote shared mailbox action menu operations
ZmCalendarTreeController.prototype._getRemoteActionMenuOps = function() {
	return [ZmOperation.NEW_CALENDAR,
			ZmOperation.ADD_EXTERNAL_CALENDAR,
			ZmOperation.FREE_BUSY_LINK];
};

// Returns a list of desired action menu operations
ZmCalendarTreeController.prototype._getActionMenuOps = function() {

    if (appCtxt.getCurrentApp().containsWritableFolder()) {
        return [
            ZmOperation.NEW_CALENDAR,
	        ZmOperation.SYNC,
	        ZmOperation.EMPTY_FOLDER,
	        ZmOperation.RECOVER_DELETED_ITEMS,
            ZmOperation.SHARE_CALENDAR,
	        ZmOperation.MOVE,
            ZmOperation.DELETE_WITHOUT_SHORTCUT,
            ZmOperation.EDIT_PROPS,
            ZmOperation.DETACH_WIN
        ];
    }
    else {
        return [
            ZmOperation.EDIT_PROPS,
            ZmOperation.DETACH_WIN
        ];
    }
};

ZmCalendarTreeController.prototype.getItemActionMenu = function(ev, item) {
	var actionMenu = null;
	if (item.isRemoteRoot()) {
		actionMenu = this._getRemoteActionMenu();
	} else {
		actionMenu = ZmTreeController.prototype.getItemActionMenu.apply(this, arguments);
	}
	return actionMenu;
}

ZmCalendarTreeController.prototype._getRemoteActionMenu = function() {
	if (this._remoteActionMenu instanceof AjxCallback) {
		var callback = this._remoteActionMenu;
		this._remoteActionMenu = callback.run();
	}
	return this._remoteActionMenu;
};

ZmCalendarTreeController.prototype._getActionMenu =
function(ev) {
	var organizer = ev.item.getData(Dwt.KEY_OBJECT);
	if (organizer.type != this.type &&
        organizer.nId != ZmOrganizer.ID_TRASH) {
        return null;
    }
	var menu = ZmTreeController.prototype._getActionMenu.apply(this, arguments);
    if (appCtxt.isWebClientOffline())  {
        menu.enableAll(false);
    } else {
        var isTrash = organizer.nId == ZmOrganizer.ID_TRASH;
        //bug 67531: "Move" Option should be disabled for the default calendar
        var isCalendar = organizer.nId == ZmOrganizer.ID_CALENDAR;
        menu.enableAll(!isTrash);
        menu.enable(ZmOperation.MOVE, !isCalendar && !isTrash);
        menu.enable(ZmOperation.EMPTY_FOLDER, isTrash);
        var menuItem = menu.getMenuItem(ZmOperation.EMPTY_FOLDER);
        if (menuItem) {
            menuItem.setText(isTrash ? ZmMsg.emptyTrash : ZmMsg.emptyFolder);
        }
    }
    return menu;
};

// Method that is run when a tree item is left-clicked
ZmCalendarTreeController.prototype._itemClicked =
function(organizer) {
	if ((organizer.type != ZmOrganizer.CALENDAR) && !organizer.isRemoteRoot()) {
        if (organizer._showFoldersCallback) {
            organizer._showFoldersCallback.run();
            return;
        }

        if (organizer.nId == ZmOrganizer.ID_TRASH) {
			return;
		}

		var appId = ZmOrganizer.APP[organizer.type];
		var app = appId && appCtxt.getApp(appId);
		if (app) {
			var callback = new AjxCallback(this, this._postActivateApp, [organizer, app]);
			appCtxt.getAppController().activateApp(appId, null, callback);
		}
		else {
			appCtxt.setStatusMsg({
				msg:	AjxMessageFormat.format(ZmMsg.appUnknown, [appId]),
				level:	ZmStatusView.LEVEL_WARNING
			});
		}
	}
};

ZmCalendarTreeController.prototype._postActivateApp =
function(organizer, app) {
	var controller = appCtxt.getOverviewController();
	var overviewId = app.getOverviewId();
	var treeId = organizer.type;
	var treeView = controller.getTreeView(overviewId, treeId);
	if (treeView) {
		treeView.setSelected(organizer);
	}
};

// Handles a drop event
ZmCalendarTreeController.prototype._dropListener =
function(ev) {
	var data = ev.srcData.data;
    var dropFolder = ev.targetControl.getData(Dwt.KEY_OBJECT);

	var appts = (!(data instanceof Array)) ? [data] : data;
	var isShiftKey = (ev.shiftKey || ev.uiEvent.shiftKey);

	if (ev.action == DwtDropEvent.DRAG_ENTER) {

        var type = ev.targetControl.getData(ZmTreeView.KEY_TYPE);

        if(data instanceof ZmCalendar){
             ev.doIt = dropFolder.mayContain(data, type) && !data.isSystem();
        }
		else if (!(appts[0] instanceof ZmAppt)) {
			ev.doIt = false;
		}
		else if (this._dropTgt.isValidTarget(data)) {
			var type = ev.targetControl.getData(ZmTreeView.KEY_TYPE);
			ev.doIt = dropFolder.mayContain(data, type);

			var action;
			// walk thru the array and find out what action is allowed
			for (var i = 0; i < appts.length; i++) {
				if (appts[i] instanceof ZmItem) {
					action |= appts[i].getDefaultDndAction(isShiftKey);
				}
			}

			if (((action & ZmItem.DND_ACTION_COPY) != 0)) {
				var plusDiv = (appts.length == 1)
					? ev.dndProxy.firstChild.nextSibling
					: ev.dndProxy.firstChild.nextSibling.nextSibling;

				Dwt.setVisibility(plusDiv, true);
			}
		}
	}
	else if (ev.action == DwtDropEvent.DRAG_DROP) {
		var ctlr = ev.srcData.controller;
		var cc = AjxDispatcher.run("GetCalController");
        if (!isShiftKey && cc.isMovingBetwAccounts(appts, dropFolder.id)) {
            var dlg = appCtxt.getMsgDialog();
            dlg.setMessage(ZmMsg.orgChange, DwtMessageDialog.WARNING_STYLE);
            dlg.popup();
		} else {
            if (data instanceof ZmCalendar) {
                this._doMove(data, dropFolder);
            } else {
                ctlr._doMove(appts, dropFolder, null, isShiftKey);
            }
		}
	}
};

ZmCalendarTreeController.prototype._dropToRemoteFolder =
function(name) {
    appCtxt.setStatusMsg(AjxMessageFormat.format(ZmMsg.calStatusUpdate, name));
}

ZmCalendarTreeController.prototype._changeOrgCallback =
function(controller, dialog, appts, dropFolder) {
	dialog.popdown();
    if(!dropFolder.noSuchFolder){
	    controller._doMove(appts, dropFolder, null, false);
    }
    else{
        var dialog = appCtxt.getMsgDialog();
        var msg = AjxMessageFormat.format(ZmMsg.noFolderExists, dropFolder.name);
        dialog.setMessage(msg);
        dialog.popup();
    }
};

/*
* Returns a "New Calendar" dialog.
*/
ZmCalendarTreeController.prototype._getNewDialog =
function() {
    return appCtxt.getNewCalendarDialog();
};

ZmCalendarTreeController.prototype._newCallback =
function(params) {
    // For a calendar, set the parent folder (params.l) if specified
    var folder = this._pendingActionData instanceof ZmOrganizer ? this._pendingActionData :
        (this._pendingActionData && this._pendingActionData.organizer);
    if (folder) {
        params.l = folder.id;
    }
    ZmTreeController.prototype._newCallback.call(this, params);
};



/*
* Returns an "External Calendar" dialog.
*/
ZmCalendarTreeController.prototype.getExternalCalendarDialog =
function(isGoogleAuthConfigured) {
    if(!this._externalCalendarDialog) {
        AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar", "CalendarAppt"]);
	    this._externalCalendarDialog = new ZmExternalCalendarDialog({parent: this._shell, controller: this, isGoogleAuthConfigured: isGoogleAuthConfigured});
    }
    return this._externalCalendarDialog;
};

// Listener callbacks

/*
* Listener to handle new external calendar.
*/
ZmCalendarTreeController.prototype._addExternalCalendarListener =
function() {
	return AjxRpc.invoke(null, "/service/extension/oauth2/info/google", null, new AjxCallback(this, this._handleGoogleConfig), true);
};

ZmCalendarTreeController.prototype._handleGoogleConfig =
function(response){
	try {
		var responseJson = JSON.parse(response.text);
	} catch(e) {
		console.error("unable to handle Google Config get info response => ", e);
	}

	var dialog = this.getExternalCalendarDialog(responseJson && responseJson.data && responseJson.data.client_id);
	dialog.popup();
};

ZmCalendarTreeController.prototype._changeListener =
function(ev, treeView, overviewId) {
	ZmTreeController.prototype._changeListener.call(this, ev, treeView, overviewId);

	if (ev.type != this.type || ev.handled) { return; }

	var fields = ev.getDetail("fields") || {};
	if (ev.event == ZmEvent.E_CREATE ||
		ev.event == ZmEvent.E_DELETE ||
		(ev.event == ZmEvent.E_MODIFY && fields[ZmOrganizer.F_FLAGS]))
	{
		var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
		var controller = aCtxt.getApp(ZmApp.CALENDAR).getCalController();
		controller._updateCheckedCalendars();

		// if calendar is deleted, notify will initiate the refresh action
		if (ev.event != ZmEvent.E_DELETE) {
            var calIds = controller.getCheckedCalendarFolderIds();
            AjxDebug.println(AjxDebug.CALENDAR, "tree change listener refreshing calendar event '" + ev.event + "' with checked folder ids " + calIds.join(","));
			controller._refreshAction(true);
			ev.handled = true;
		}
    }
};

ZmCalendarTreeController.prototype._treeViewListener =
function(ev) {
	// handle item(s) clicked
	if (ev.detail == DwtTree.ITEM_CHECKED) {
		var overviewId = ev.item.getData(ZmTreeView.KEY_ID);
		var calendar = ev.item.getData(Dwt.KEY_OBJECT);

		//checkbox event may not be propagated to close action menu
		if (this._getActionMenu(ev)) {
			this._getActionMenu(ev).popdown();
		}

		// notify listeners of selection
		if (this._eventMgrs[overviewId]) {
			this._eventMgrs[overviewId].notifyListeners(DwtEvent.SELECTION, ev);
		}
		return;
	}

	// default processing
	ZmTreeController.prototype._treeViewListener.call(this, ev);
};

ZmCalendarTreeController.prototype._checkAllListener =
function(ev) {
	this._setAllChecked(ev, true);
};

ZmCalendarTreeController.prototype._clearAllListener =
function(ev) {
	this._setAllChecked(ev, false);
};

ZmCalendarTreeController.prototype._shareCalListener =
function(ev) {
	this._pendingActionData = this._getActionedOrganizer(ev);
	
	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (this._pendingActionData.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	appCtxt.getSharePropsDialog().popup(ZmSharePropsDialog.NEW, this._pendingActionData);
};

ZmCalendarTreeController.prototype._deleteListener =
function(ev) {
	var organizer = this._getActionedOrganizer(ev);
    if (organizer.isInTrash()) {
        var callback = new AjxCallback(this, this._deleteListener2, [organizer]);
        var message = AjxMessageFormat.format(ZmMsg.confirmDeleteCalendar, AjxStringUtil.htmlEncode(organizer.name));

        appCtxt.getConfirmationDialog().popup(message, callback);
    }
    else {
        this._doMove(organizer, appCtxt.getById(ZmFolder.ID_TRASH));
    }
};

ZmCalendarTreeController.prototype._deleteListener2 =
function(organizer) {
	this._doDelete(organizer);
};

/**
 * Empties a folder.
 * It removes all the items in the folder except sub-folders.
 * If the folder is Trash, it empties even the sub-folders.
 * A warning dialog will be shown before any folder is emptied.
 *
 * @param {DwtUiEvent}		ev		the UI event
 *
 * @private
 */
ZmCalendarTreeController.prototype._emptyListener =
function(ev) {
	this._getEmptyShieldWarning(ev);
};

ZmCalendarTreeController.prototype._notifyListeners =
function(overviewId, type, items, detail, srcEv, destEv) {
	if (this._eventMgrs[overviewId] &&
		this._eventMgrs[overviewId].isListenerRegistered(type))
	{
		if (srcEv) DwtUiEvent.copy(destEv, srcEv);
		destEv.items = items;
		if (items.length == 1) destEv.item = items[0];
		destEv.detail = detail;
		this._eventMgrs[overviewId].notifyListeners(type, destEv);
	}
};

ZmCalendarTreeController.prototype._getItems =
function(overviewId) {
	var treeView = this.getTreeView(overviewId);
	if (treeView) {
		var account = appCtxt.multiAccounts ? treeView._overview.account : null;
		if (!appCtxt.get(ZmSetting.CALENDAR_ENABLED, null, account)) { return []; }

		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT, account);
		var root = treeView.getTreeItemById(rootId);
		if (root) {
			var totalItems = [];
			this._getSubItems(root, totalItems);
			return totalItems;
		}
	}
	return [];
};

ZmCalendarTreeController.prototype._getSubItems =
function(root, totalItems) {
	if (!root || (root && root._isSeparator)) { return; }

	var items = root.getItems();
    //items is an array
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item && !item._isSeparator) {
			totalItems.push(item);
			this._getSubItems(item, totalItems);
		}
	}
};

ZmCalendarTreeController.prototype._setAllChecked =
function(ev, checked) {
	var overviewId = this._actionedOverviewId;
	var items = this._getItems(overviewId);
	var checkedItems = [];
	var item, organizer;
	for (var i = 0;  i < items.length; i++) {
		item = items[i];
		if (item._isSeparator) { continue; }
		organizer = item.getData(Dwt.KEY_OBJECT);
		if (!organizer || organizer.type != ZmOrganizer.CALENDAR) { continue; }
		item.setChecked(checked);
		checkedItems.push(item);
	}

	// notify listeners of selection
	if (checkedItems.length && this._eventMgrs[overviewId]) {
		this._notifyListeners(overviewId, DwtEvent.SELECTION, checkedItems, DwtTree.ITEM_CHECKED, ev, this._eventMgrs[overviewId]._selEv);
	}
};

ZmCalendarTreeController.prototype._createTreeView =
function(params) {
	if (params.treeStyle == null) {
		params.treeStyle = DwtTree.CHECKEDITEM_STYLE;
	}
    params.showUnread = false;
	return new ZmTreeView(params);
};

ZmCalendarTreeController.prototype._postSetup =
function(overviewId, account) {
	ZmTreeController.prototype._postSetup.apply(this, arguments);

	// bug: 43067 - remove the default calendar since its only a place holder
	// for caldav based accounts
	if (account && account.isCalDavBased()) {
		var treeView = this.getTreeView(overviewId);
		var calendarId = ZmOrganizer.getSystemId(ZmOrganizer.ID_CALENDAR, account);
		var treeItem = treeView.getTreeItemById(calendarId);
		treeItem.dispose();
	}
};

/**
 * Pops up the appropriate "New ..." dialog.
 *
 * @param {DwtUiEvent}	ev		the UI event
 * @param {ZmZimbraAccount}	account	used by multi-account mailbox (optional)
 *
 * @private
 */
ZmCalendarTreeController.prototype._newListener =
function(ev, account, isExternalCalendar) {
	this._pendingActionData = this._getActionedOrganizer(ev);
	var newDialog = this._getNewDialog();

    // Fix for Bug: 85158 and regression due to Bug: 82811
    // Pass a flag isExternalCalendar from ZmExternalCalendarDialog::_nextButtonListener to help decide creating external calendar or local calendar
    if (isExternalCalendar && this._extCalData) {
        var iCalData = this._extCalData.iCal;
        newDialog.setICalData(iCalData);
        newDialog.setTitle(ZmMsg.addExternalCalendar);
        newDialog.getButton(ZmNewCalendarDialog.BACK_BUTTON).setVisibility(true);
    }
    else {
        newDialog.setTitle(ZmMsg.createNewCalendar);
        newDialog.getButton(ZmNewCalendarDialog.BACK_BUTTON).setVisibility(false);
    }
	if (!this._newCb) {
		this._newCb = new AjxCallback(this, this._newCallback);
	}
	if (this._pendingActionData && !appCtxt.getById(this._pendingActionData.id)) {
		this._pendingActionData = appCtxt.getFolderTree(account).root;
	}

	if (!account && appCtxt.multiAccounts) {
		var ov = this._opc.getOverview(this._actionedOverviewId);
		account = ov && ov.account;
	}

	ZmController.showDialog(newDialog, this._newCb, this._pendingActionData, account);

	newDialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._clearDialog, this, newDialog);
};

ZmCalendarTreeController.prototype.setExternalCalendarData =
function(extCalData) {
    this._extCalData = extCalData;
};

ZmCalendarTreeController.prototype._clearDialog =
function(dialog) {
    ZmTreeController.prototype._clearDialog.apply(this, arguments);
    if(this._externalCalendarDialog) {
        this._externalCalendarDialog.popdown();
    }
};

ZmCalendarTreeController.prototype.createDataSourceErrorCallback =
function(response) {
    appCtxt.setStatusMsg(ZmMsg.addExternalCalendarError);
};

ZmCalendarTreeController.prototype.createDataSourceCallback =
function(response) {
    var dsResponse = response.getResponse(),
        sourceId =  dsResponse && dsResponse.caldav ? dsResponse.caldav[0].id : "",
        jsonObj,
        params;
    if(sourceId) {
        jsonObj = {
            ImportDataRequest : {
                _jsns : "urn:zimbraMail",
                caldav : {
                    id : sourceId
                }
            }
        };
        params = {
              soapDoc: jsonObj,
              asyncMode: false
            };
        appCtxt.getAppController().sendRequest(params);
    }

    appCtxt.setStatusMsg(ZmMsg.addExternalCalendarSuccess);
    return response;
};

ZmCalendarTreeController.POLLING_INTERVAL = "1m";
ZmCalendarTreeController.CONN_TYPE_CLEARTEXT = "cleartext";
ZmCalendarTreeController.CONN_TYPE_SSL = "ssl";
ZmCalendarTreeController.SSL_PORT = "443";
ZmCalendarTreeController.GOOGLE_CALDAV_SERVER = "www.google.com";
ZmCalendarTreeController.ALT_GOOGLE_CALDAV_SERVER = "apidata.googleusercontent.com";
ZmCalendarTreeController.DATA_SOURCE_ATTR_YAHOO = "p:/principals/users/_USERNAME_";
ZmCalendarTreeController.DATA_SOURCE_ATTR = "p:/calendar/dav/_USERNAME_/user";

ZmCalendarTreeController.prototype.createDataSource =
function(organizer, errorCallback) {
    var calDav = this._extCalData && this._extCalData.calDav ? this._extCalData.calDav : null;
    if(!calDav) { return; }

    var url,
        port,
        urlComponents,
        hostUrl,
        jsonObj,
        connType = ZmCalendarTreeController.CONN_TYPE_CLEARTEXT,
        dsa = ZmCalendarTreeController.DATA_SOURCE_ATTR;


    hostUrl = calDav.hostUrl;
    urlComponents = AjxStringUtil.parseURL(hostUrl);
	url = urlComponents.domain;
	port = urlComponents.port || ZmCalendarTreeController.SSL_PORT;    	
	dsa = urlComponents.path ? "p:" + urlComponents.path : ZmCalendarTreeController.DATA_SOURCE_ATTR;
    

    if(port == ZmCalendarTreeController.SSL_PORT) {
        connType = ZmCalendarTreeController.CONN_TYPE_SSL;
    }

    if (calDav.hostUrl.indexOf(ZmCalendarTreeController.GOOGLE_CALDAV_SERVER) === -1 
    	&& calDav.hostUrl.indexOf(ZmCalendarTreeController.ALT_GOOGLE_CALDAV_SERVER) === -1) { // Not google url
        dsa = ZmCalendarTreeController.DATA_SOURCE_ATTR_YAHOO;
    }

    jsonObj = {
        CreateDataSourceRequest : {
            _jsns : "urn:zimbraMail",
            caldav : {
                name : organizer.name,
                pollingInterval : ZmCalendarTreeController.POLLING_INTERVAL,
                isEnabled : "1",
                l : organizer.nId,
                host : url,
                port : port,
                connectionType : connType,
                username : calDav.userName,
                password : calDav.password,
                a : {
                    n : "zimbraDataSourceAttribute",
                    _content : dsa
                }
            }
        }
    };

    this._extCalData = null;
    delete this._extCalData;
    var accountName = (appCtxt.multiAccounts ? appCtxt.accountList.mainAccount.name : null);

    var params = {
            jsonObj: jsonObj,
            asyncMode: true,
            sensitive: true,
            callback: new AjxCallback(this, this.createDataSourceCallback),
            errorCallback: new AjxCallback(this, this.createDataSourceErrorCallback),
            accountName: accountName
        };
    appCtxt.getAppController().sendRequest(params);
};
}


if (AjxPackage.define("zimbraMail.tasks.view.ZmTaskView")) {
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

/**
* Creates an empty task view.
* @constructor
* @class
* Simple read-only view of a task. It looks more or less like a message -
* the notes have their own area at the bottom, and everything else goes into a
* header section at the top.
*
* @author Parag Shah
*
* @param parent		[DwtComposite]	parent widget
* @param posStyle	[constant]		positioning style
* @param controller	[ZmController]	owning controller
*/
ZmTaskView = function(parent, posStyle, controller) {

	var id = ZmId.getViewId(ZmId.VIEW_TASK, null, parent._htmlElId);
	ZmCalItemView.call(this, parent, posStyle, controller, id);
};

ZmTaskView.prototype = new ZmCalItemView;
ZmTaskView.prototype.constructor = ZmTaskView;
ZmTaskView.prototype.isZmTaskView = true;

// Public methods

ZmTaskView.prototype.toString =
function() {
	return "ZmTaskView";
};

ZmTaskView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, (this._calItem && this._calItem.getName()) || ''].join(": ");
};

ZmTaskView.prototype.close =
function() {
	this._controller._app.popView();
};

ZmTaskView.prototype.setSelectionHdrCbox = function(check) {};

ZmTaskView.prototype._getSubs =
function(calItem) {
	var subject = calItem.getName();
	var location = calItem.location;
	var isException = calItem._orig ? calItem._orig.isException : calItem.isException;
	var startDate = calItem.startDate ? AjxDateFormat.getDateInstance().format(calItem.startDate) : null;
	var dueDate = calItem.endDate ? AjxDateFormat.getDateInstance().format(calItem.endDate) : null;
	var priority = calItem.priority ? ZmCalItem.getLabelForPriority(calItem.priority) : null;
	var status = calItem.status ? ZmCalItem.getLabelForStatus(calItem.status) : null;
	var pComplete = calItem.pComplete;
	var recurStr = calItem.isRecurring() ? calItem.getRecurBlurb() : null;
	var attachStr = this._getAttachString(calItem);
    var alarm = calItem.alarm;
    var remindDate = calItem.remindDate ? AjxDateFormat.getDateInstance().format(calItem.remindDate) : null;
    var remindTime = calItem.remindDate ? AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT).format(calItem.remindDate) : "";

	if (this._objectManager) {
		this._objectManager.setHandlerAttr(ZmObjectManager.DATE,
											ZmObjectManager.ATTR_CURRENT_DATE,
											calItem.startDate);

		subject = this._objectManager.findObjects(subject, true);
		if (location) location = this._objectManager.findObjects(location, true);
		if (startDate) startDate = this._objectManager.findObjects(startDate, true);
		if (dueDate) dueDate = this._objectManager.findObjects(dueDate, true);
	}

	return {
		id: this._htmlElId,
		subject: subject,
		location: location,
		isException: isException,
		startDate: startDate,
		dueDate: dueDate,
		priority: priority,
		status: status,
		pComplete: pComplete,
		recurStr: recurStr,
		attachStr: attachStr,
        remindDate: remindDate,
        remindTime: remindTime,
        alarm: alarm,
		folder: appCtxt.getTree(ZmOrganizer.TASKS).getById(calItem.folderId),
		folderLabel: ZmMsg.folder,
        isTask:true,
        _infoBarId:this._infoBarId
	};
};

// Private / protected methods

ZmTaskView.prototype._renderCalItem =
function(calItem) {

   if(this._controller.isReadingPaneOn() && !this._newTab) {
	this._lazyCreateObjectManager();

	var subs = this._getSubs(calItem);
	var editBtnCellId = this._htmlElId + "_editBtnCell";
	this._hdrTableId = this._htmlElId + "_hdrTable";

    var el = this.getHtmlElement();
	el.innerHTML = AjxTemplate.expand("tasks.Tasks#ReadOnlyView", subs);
    this._setTags(calItem);

	// content/body
	var hasHtmlPart = (calItem.notesTopPart && calItem.notesTopPart.getContentType() == ZmMimeTable.MULTI_ALT);
	var mode = (hasHtmlPart && appCtxt.get(ZmSetting.VIEW_AS_HTML))
		? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN;

	var bodyPart = calItem.getNotesPart(mode);

    if (!bodyPart && calItem.message){
        bodyPart = calItem.message.getInviteDescriptionContentValue(ZmMimeTable.TEXT_PLAIN);
    }

	if (bodyPart) {
		this._msg = this._msg || this._calItem._currentlyLoaded;
        if (mode === ZmMimeTable.TEXT_PLAIN) {
            bodyPart = AjxStringUtil.convertToHtml(bodyPart);
        }
        this._makeIframeProxy({container: el, html:bodyPart, isTextMsg:(mode == ZmMimeTable.TEXT_PLAIN)});
	}
   } else {
     ZmCalItemView.prototype._renderCalItem.call(this, calItem);
   }
   Dwt.setLoadedTime("ZmTaskItem");
   calItem.addChangeListener(this._taskChangeListener.bind(this));

};

ZmTaskView.prototype._taskChangeListener =
function(ev){
    if(ev.event == ZmEvent.E_TAGS || ev.type == ZmEvent.S_TAG) {
        this._setTags(this._calItem);
    }
};

ZmTaskView.prototype._getItemCountType = function() {
	return ZmId.ITEM_TASK;
};
}
if (AjxPackage.define("zimbraMail.tasks.view.ZmTaskMultiView")) {
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

ZmTaskMultiView = function(params) {

	if (arguments.length == 0) { return; }

    params.className = params.className || "ZmTaskMultiView";
    params.mode = ZmId.VIEW_TASKMULTI;

	var view = params.controller.getCurrentViewId();
	params.id = ZmId.getViewId(view);
	DwtComposite.call(this, params);

	this._controller = params.controller;

    this._taskListView = this._createTaskListView(params);

	this._vertMsgSash = new DwtSash({parent:this, style:DwtSash.HORIZONTAL_STYLE, className:"AppSash-horiz",
									 threshold:ZmTaskMultiView.SASH_THRESHOLD, posStyle:Dwt.ABSOLUTE_STYLE});
	this._vertMsgSash.registerCallback(this._sashCallback, this);

	this._horizMsgSash = new DwtSash({parent:this, style:DwtSash.VERTICAL_STYLE, className:"AppSash-vert",
									  threshold:ZmTaskMultiView.SASH_THRESHOLD, posStyle:Dwt.ABSOLUTE_STYLE});
	this._horizMsgSash.registerCallback(this._sashCallback, this);

	this._taskView = new ZmTaskView(this, DwtControl.ABSOLUTE_STYLE, this._controller);

	this.setReadingPane();
}

ZmTaskMultiView.prototype = new DwtComposite;
ZmTaskMultiView.prototype.constructor = ZmTaskMultiView;
ZmTaskMultiView.MIN_LISTVIEW_WIDTH = 200;

ZmTaskMultiView.prototype.toString =
function() {
	return "ZmTaskMultiView";
};

// consts

ZmTaskMultiView.SASH_THRESHOLD = 5;
ZmTaskMultiView._TAG_IMG = "TI";

// public methods

ZmTaskMultiView.prototype.getController =
function() {
	return this._controller;
};

ZmTaskMultiView.prototype.getTitle =
function() {
	return this._taskListView.getTitle();
};

/**
 * Displays the reading pane, based on the current settings.
 */
ZmTaskMultiView.prototype.setReadingPane =
function() {

	var tlv = this._taskListView, tv = this._taskView;
	var readingPaneEnabled = this._controller.isReadingPaneOn();
    var readingPaneOnRight = this._controller.isReadingPaneOnRight();

    if (!readingPaneEnabled) {
		tv.setVisible(false);
		this._vertMsgSash.setVisible(false);
		this._horizMsgSash.setVisible(false);
	} else {
		if (!tv.getVisible()) {
			if (tlv.getSelectionCount() == 1) {
				this._controller._setSelectedItem();
			} else {
				tv.reset();
			}
		}
		tv.setVisible(true);
		var newSash = readingPaneOnRight ? this._vertMsgSash : this._horizMsgSash;
		var oldSash = readingPaneOnRight ? this._horizMsgSash : this._vertMsgSash;
		oldSash.setVisible(false);
		newSash.setVisible(true);
	}

	tlv.reRenderListView();
    if(readingPaneOnRight) {
        tlv.setSortByAsc(ZmItem.F_SORTED_BY, true);
    } else {
        tlv.setSortByAsc(ZmItem.F_DATE, true);
    }

    tv.noTab = !readingPaneEnabled || AjxEnv.isIE;
	var sz = this.getSize();
	this._resetSize(sz.x, sz.y, true);
};

ZmTaskMultiView.prototype._createTaskListView =
function(params) {
	params.parent = this;
	params.posStyle = Dwt.ABSOLUTE_STYLE;
	params.id = DwtId.getListViewId(this._controller.getCurrentViewType());
	return new ZmTaskListView(this, this._controller, this._controller._dropTgt );
};

ZmTaskMultiView.prototype.getTaskListView =
function() {
	return this._taskListView;
};

ZmTaskMultiView.prototype.getTaskView =
function() {
	return this._taskView;
};

ZmTaskMultiView.prototype.getSelectionCount =
function() {
	return this._taskListView.getSelectionCount();
};

ZmTaskMultiView.prototype.getSelection =
function() {
	return this._taskListView.getSelection();
};

ZmTaskMultiView.prototype.reset =
function() {
	this._taskListView.reset();
	this._taskView.reset();
};

ZmTaskMultiView.prototype.getTask =
function() {
	return this._taskView.getTask();
};

ZmTaskMultiView.prototype.setTask =
function(task) {
	this._taskView.set(task, ZmId.VIEW_TASK);
};

ZmTaskMultiView.prototype.resetTask =
function(newTask) {
	this._taskView.resetMsg(newTask);
};

ZmTaskMultiView.prototype.isTaskViewVisible =
function() {
	return this._taskView.getVisible();
};

ZmTaskMultiView.prototype.setBounds =
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	this._resetSize(width, height);
};

ZmTaskMultiView.prototype._resetSize =
function(newWidth, newHeight, force) {


	if (newWidth <= 0 || newHeight <= 0) { return; }
	if (!force && newWidth == this._lastResetWidth && newHeight == this._lastResetHeight) { return; }

	var readingPaneOnRight = this._controller.isReadingPaneOnRight();

	if (this.isTaskViewVisible()) {
		var sash = this.getSash();
		var sashSize = sash.getSize();
		var sashThickness = readingPaneOnRight ? sashSize.x : sashSize.y;
		if (readingPaneOnRight) {
			var listViewWidth = this._vertSashX || (Number(ZmMsg.LISTVIEW_WIDTH)) || Math.floor(newWidth / 2.5);
			this._taskListView.resetSize(listViewWidth, newHeight);
			sash.setLocation(listViewWidth, 0);
			this._taskView.setBounds(listViewWidth + sashThickness, 0,
									newWidth - (listViewWidth + sashThickness), newHeight);
		} else {
			var listViewHeight = this._horizSashY || (Math.floor(newHeight / 2) - DwtListView.HEADERITEM_HEIGHT);
			this._taskListView.resetSize(newWidth, listViewHeight);
			sash.setLocation(0, listViewHeight);
			this._taskView.setBounds(0, listViewHeight + sashThickness, newWidth,
									newHeight - (listViewHeight + sashThickness));
		}
	} else {
		this._taskListView.resetSize(newWidth, newHeight);
	}
	this._taskListView._resetColWidth();

	this._lastResetWidth = newWidth;
	this._lastResetHeight = newHeight;
};

ZmTaskMultiView.prototype._sashCallback =
function(delta) {
	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	var listView = this._taskListView;
	var itemView = this._taskView;
	var itemViewSize = itemView.getSize(true);
	var listViewSize = listView.getSize(true);

	var newListViewSize;
	var newItemViewBounds;

	var absDelta = Math.abs(delta);

	if (readingPaneOnRight) {
		var currentListViewWidth = AjxEnv.isIE ? this._vertMsgSash.getLocation().x : listViewSize.x;
		var currentItemViewWidth = itemViewSize.x;
		delta = this._getLimitedDelta(delta, currentItemViewWidth, itemView.getMinWidth(), currentListViewWidth, ZmTaskMultiView.MIN_LISTVIEW_WIDTH);
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
		var currentListViewHeight = AjxEnv.isIE ? this._horizMsgSash.getLocation().y : listViewSize.y;
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
		this._vertMsgSashX = this._vertMsgSash.getLocation().x + delta;
	}
	else {
		this._horizSashY = this._horizMsgSash.getLocation().y + delta;
	}

	return delta;
};

ZmTaskMultiView.prototype._selectFirstItem =
function() {
	var list = this._taskListView.getList();
	var selectedItem = list ? list.get(0) : null;
	if (selectedItem) {
		this._taskListView.setSelection(selectedItem, false);
	}
};

ZmTaskMultiView.prototype.getSash =
function() {
	var readingPaneOnRight = this._controller.isReadingPaneOnRight();
	return readingPaneOnRight ? this._vertMsgSash : this._horizMsgSash;
};

ZmTaskMultiView.prototype.getLimit =
function(offset) {
	return this._taskListView.getLimit(offset);
};

ZmTaskMultiView.prototype.set =
function(list, sortField) { 
	this._taskListView.set(list, sortField);
	this.isStale = false;
};

/* Get minimum heiht of list */
ZmTaskMultiView.prototype._getMinListViewHeight =
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
ZmTaskMultiView.prototype._getLimitedDelta =
function(delta, currentItemViewDimension, minItemViewDimension, currentListViewDimension, minListViewDimension) {
	if (delta > 0) {
		// moving sash right or down
		return Math.max(0, Math.min(delta, currentItemViewDimension - minItemViewDimension));
	}
	// moving sash left or up
	var absDelta = Math.abs(delta);
	return -Math.max(0, Math.min(absDelta, currentListViewDimension - minListViewDimension));
};
}
if (AjxPackage.define("zimbraMail.tasks.view.ZmTaskEditView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the edit task view classes.
 */

/**
 * Creates the edit task view.
 * @class
 * This class represents the edit task view.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{ZmTaskController}		controller		the controller
 * 
 * @extends		ZmCalItemEditView
 */
ZmTaskEditView = function(parent, controller) {

    this._view = controller.getCurrentViewId();
	this._sessionId = controller.getSessionId();

	var idParams = {
		skinComponent:  ZmId.SKIN_APP_MAIN,
		app:            ZmId.APP_TASKS,
		componentType:  ZmId.WIDGET_VIEW,
		componentName:  ZmId.VIEW_TASKEDIT
	};

	var domId = ZmId.create(idParams, "A task editing view");
    ZmCalItemEditView.call(this, parent, null, controller, null, DwtControl.ABSOLUTE_STYLE, "ZmTaskEditView", domId);
};

ZmTaskEditView.prototype = new ZmCalItemEditView;
ZmTaskEditView.prototype.constructor = ZmTaskEditView;


// Consts

/**
 * Defines the priority values.
 * 
 * @see		ZmCalItem
 */
ZmTaskEditView.PRIORITY_VALUES = [
	ZmCalItem.PRIORITY_LOW,
	ZmCalItem.PRIORITY_NORMAL,
	ZmCalItem.PRIORITY_HIGH ];

/**
 * Defines the status values.
 * 
 * @see		ZmCalendarApp
 */
ZmTaskEditView.STATUS_VALUES = [
	ZmCalendarApp.STATUS_NEED,
	ZmCalendarApp.STATUS_COMP,
	ZmCalendarApp.STATUS_INPR,
	ZmCalendarApp.STATUS_WAIT,
	ZmCalendarApp.STATUS_DEFR ];

// Message dialog placement
ZmTaskEditView.DIALOG_X = 50;
ZmTaskEditView.DIALOG_Y = 100;

// Public Methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmTaskEditView.prototype.toString =
function() {
	return "ZmTaskEditView";
};

/**
 * @private
 */
ZmTaskEditView.prototype.set =
function(calItem, mode, isDirty) {
	this.initialize(calItem, mode, isDirty);

	// HACK: TEV takes too long to init so design mode never gets set properly
	if (AjxEnv.isGeckoBased) {
		var ta = new AjxTimedAction(this, this.reEnableDesignMode);
		AjxTimedAction.scheduleAction(ta, 500);
	}
};

/**
 * Gets the controller.
 * 
 * @return	{ZmTaskController}		the controller
 */
ZmTaskEditView.prototype.getController =
function() {
	return this._controller;
};

ZmTaskEditView.prototype._getClone =
function() {
	return ZmTask.quickClone(this._calItem);
};

ZmTaskEditView.prototype._populateForEdit =
function(calItem, mode) {
	ZmCalItemEditView.prototype._populateForEdit.call(this, calItem, mode);

	if (calItem.startDate) {
		var sd = new Date(calItem.startDate.getTime());
		this._startDateField.value = AjxDateUtil.simpleComputeDateStr(sd);
	}
	if (calItem.endDate) {
		var ed = new Date(calItem.endDate.getTime());
		this._endDateField.value = AjxDateUtil.simpleComputeDateStr(ed);
	}


    var rd = new Date(calItem.remindDate.getTime());

    if (calItem.alarm) {
        if (calItem.remindDate && calItem._reminderAbs) {
            this._remindTimeSelect.set(calItem.remindDate);
        }
    } else {
        var now = AjxDateUtil.roundTimeMins(new Date(), 30);
        this._remindTimeSelect.set(now);        
    }

    if (this._hasReminderSupport) {
        this._remindDateField.value = AjxDateUtil.simpleComputeDateStr(rd);
        this._reminderCheckbox.setSelected(calItem.alarm);
        this._setRemindersEnabled(calItem.alarm);
		
        if (calItem.alarmActions.contains(ZmCalItem.ALARM_EMAIL)) {
            this._reminderEmailCheckbox.setSelected(true);
        }
        if (calItem.alarmActions.contains(ZmCalItem.ALARM_DEVICE_EMAIL)) {
            this._reminderDeviceEmailCheckbox.setSelected(true);
        }
    }

	this._location.setValue(calItem.getLocation());
	this._setPriority(calItem.priority);
	this._statusSelect.setSelectedValue(calItem.status);
	this._pCompleteSelectInput.setValue(this.formatPercentComplete(calItem.pComplete));
	var notesHtmlEditorcontent = this._notesHtmlEditor.getContent();
	if (!notesHtmlEditorcontent && notesHtmlEditorcontent != "" && calItem.message){
		this._notesHtmlEditor.setContent(calItem.message.getInviteDescriptionContentValue(ZmMimeTable.TEXT_PLAIN) || "");
	}
	this._setEmailReminderControls();
};

ZmTaskEditView.prototype._populateForSave =
function(calItem) {

	ZmCalItemEditView.prototype._populateForSave.call(this, calItem);

	calItem.location = this._location.getValue();
	// TODO - normalize
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);

	if (startDate) {
		calItem.setStartDate(startDate, true);
	} else {
		calItem.startDate = null;	// explicitly null out in case item has old data
	}

	if (endDate) {
		calItem.setEndDate(endDate, true);
	} else {
		calItem.endDate = null;		// explicitly null out in case item has old data
	}

    //set reminder
    var reminders = [
        { control: this._reminderEmailCheckbox,       action: ZmCalItem.ALARM_EMAIL        },
        { control: this._reminderDeviceEmailCheckbox, action: ZmCalItem.ALARM_DEVICE_EMAIL }
    ];
    if (this._hasReminderSupport && this._reminderCheckbox.isSelected()) {
        var remindDate = AjxDateUtil.simpleParseDateStr(this._remindDateField.value);
        calItem.alarm = true;
        calItem.remindDate = remindDate;
        remindDate = this._remindTimeSelect.getValue(remindDate);
        var remindFmtStr = AjxDateUtil.getServerDateTime(remindDate,true);
        calItem.setTaskReminder(remindFmtStr);
        for (var i = 0; i < reminders.length; i++) {
            var reminder = reminders[i];
            if (reminder.control && reminder.control.isSelected()) {
                calItem.addReminderAction(reminder.action);
            }
            else {
                calItem.removeReminderAction(reminder.action);
            }
        }
    } else {
       calItem.alarm = false;
       calItem.remindDate = new Date();
       calItem.setTaskReminder(null);
    }
    
	calItem.setAllDayEvent(true);
    var completion = this.getpCompleteInputValue();
    // Should always be valid at this point - made it past isValid
    calItem.pComplete = completion.valid ? completion.percent : 0;
	calItem.priority = this._getPriority();
	calItem.status = this._statusSelect.getValue();

    //bug:51913 disable alarm when stats is completed
    if (calItem.pComplete === 100 && this._statusSelect.getValue() === ZmCalendarApp.STATUS_COMP) {
       calItem.alarm = false;
       calItem.remindDate = new Date();
       calItem.setTaskReminder(null);
       for (var i = 0; i < reminders.length; i++) {
           var reminder = reminders[i];
           if (reminder.control && reminder.control.isSelected()) {
               calItem.removeReminderAction(reminder.action);
           }
       }
    }

//	XXX: uncomment when supported
//	this._getRecurrence(calItem);	// set any recurrence rules LAST

	return calItem;
};

ZmTaskEditView.prototype.isValid =
function() {
	var errorMsg;
	var subj = AjxStringUtil.trim(this._subjectField.getValue());
    if (subj && subj.length) {
		var startDate = AjxStringUtil.trim(this._startDateField.value);
		var endDate =   AjxStringUtil.trim(this._endDateField.value);
		if (startDate.length > 0 && (!DwtTimeSelect.validStartEnd(this._startDateField, this._endDateField))) {
			if(endDate.length <= 0) {
				errorMsg = ZmMsg.errorEmptyTaskDueDate;
			} else {
				errorMsg = ZmMsg.errorInvalidDates;
			}
		}
		var remindTime =  DwtTimeSelect.parse(this._remindTimeSelect.getInputField().getValue());
		if (!remindTime) {
			errorMsg = AjxMsg.invalidTimeString;
		}
		var completion =  this.getpCompleteInputValue();
		if (!completion.valid) {
			errorMsg = ZmMsg.errorInvalidPercentage;
		} else if ((completion.percent < 0) || (completion.percent > 100)) {
			errorMsg = ZmMsg.errorInvalidPercentage;
		}
    } else {
		errorMsg = ZmMsg.errorMissingSubject;
	}

	if (errorMsg) {
		throw errorMsg;
	}

	return true;
};

ZmTaskEditView.prototype.cleanup =
function() {
	ZmCalItemEditView.prototype.cleanup.call(this);

	this._startDateField.value = "";
	this._endDateField.value = "";
};


// Private/protected Methods

ZmTaskEditView.prototype._createHTML =
function() {
	//this._repeatDescId		= this._htmlElId + "_repeatDesc";
    this._isAppt = false;
	var subs = {
		id: this._htmlElId,
		height: (this.parent.getSize().y - 30),
		locationId: (this._htmlElId + "_location"),
		isGalEnabled: appCtxt.get(ZmSetting.GAL_ENABLED),
		isAppt: false
	};

	// XXX: rename template name to CalItem#CalItemEdit
	this.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Appointment#EditView", subs);
};

ZmTaskEditView.prototype._getPriorityImage =
function(flag) {
	if (ZmCalItem.isPriorityHigh(flag))	{ return "PriorityHigh_list"; }
	if (ZmCalItem.isPriorityLow(flag))	{ return "PriorityLow_list"; }
	return "PriorityNormal_list";
};

ZmTaskEditView.prototype._getPriorityText =
function(flag) {
	if (ZmCalItem.isPriorityHigh(flag))	{ return ZmMsg.high; }
	if (ZmCalItem.isPriorityLow(flag))	{ return ZmMsg.low; }
	return ZmMsg.normal;
};

ZmTaskEditView.prototype._createPriorityMenuItem =
function(menu, text, flag) {
	// I prefer a readable ID part for the priority, over the 1, 5 and 9 that those constants are set to.
	var priorityId = ZmCalItem.isPriorityHigh(flag) ? "high" : ZmCalItem.isPriorityLow(flag) ? "low" : "normal";
	var item = DwtMenuItem.create({parent: menu, imageInfo: this._getPriorityImage(flag), text: text, id: Dwt.getNextId("EditTaskPriorityMenu_" + priorityId + "_")});
	item._priorityFlag = flag;
	item.addSelectionListener(this._priorityMenuListnerObj);
};

ZmTaskEditView.prototype._priorityButtonMenuCallback =
function() {
	var menu = new DwtMenu({parent: this._prioritySelect, id: Dwt.getNextId("EditTaskPriorityMenu_")});
	this._priorityMenuListnerObj = new AjxListener(this, this._priorityMenuListner);
	this._createPriorityMenuItem(menu, ZmMsg.high, ZmCalItem.PRIORITY_HIGH);
	this._createPriorityMenuItem(menu, ZmMsg.normal, ZmCalItem.PRIORITY_NORMAL);
	this._createPriorityMenuItem(menu, ZmMsg.low, ZmCalItem.PRIORITY_LOW);
	return menu;
};

ZmTaskEditView.prototype._priorityMenuListner =
function(ev) {
	this._setPriority(ev.dwtObj._priorityFlag);
};

ZmTaskEditView.prototype._getPriority =
function() {
	return (this._prioritySelect)
		? (this._prioritySelect._priorityFlag || "") : "";
};

ZmTaskEditView.prototype._setPriority =
function(flag) {
	if (this._prioritySelect) {
		flag = flag || "";
		this._prioritySelect.setImage(this._getPriorityImage(flag));
        this._prioritySelect.setText(this._getPriorityText(flag))
		this._prioritySelect._priorityFlag = flag;
	}
};

ZmTaskEditView.prototype.getpCompleteInputValue = function() {
    var pValue  = this._pCompleteSelectInput.getValue();
    pValue      = pValue.replace(/[%\u066A]/g,"");  // also check for Arabic % character
	pValue      = pValue.trim();
    var valid = /^\d*$/.test(pValue);
    var percent = 0;
    if (valid) {
        percent = Math.round(pValue);
    }

  return { valid: valid, percent: percent};
};

ZmTaskEditView.prototype._unSelectRemindersCheckbox = function() {
    var reminders = [
        { control: this._reminderEmailCheckbox},
        { control: this._reminderDeviceEmailCheckbox},
        { control: this._reminderCheckbox}
    ];
    for (var i = 0; i < reminders.length; i++) {
        var reminder = reminders[i];
        if (reminder.control) {
            reminder.control.setSelected(false);
        }
    }
};

ZmTaskEditView.prototype.formatPercentComplete = function(pValue) {

   var formatter = new AjxMessageFormat(AjxMsg.percentageString);
   if(AjxUtil.isString(pValue) && pValue.indexOf("%") != -1) {
       return formatter.format(Math.round(pValue.replace(/[%\u066A]/g,"")));  // also check for Arabic % character
   } else {
       return formatter.format(Math.round(pValue));
   }
};

ZmTaskEditView.prototype._createWidgets =
function(width) {
	ZmCalItemEditView.prototype._createWidgets.call(this, width);

	// add location
	var params = {parent: this, type: DwtInputField.STRING};
	this._location = new DwtInputField(params);
	Dwt.setSize(this._location.getInputElement(), width, "2rem");
	this._location.reparentHtmlElement(this._htmlElId + "_location");

	// add priority DwtButton
	this._prioritySelect = new DwtButton({parent:this});
    this._prioritySelect.setSize(60, Dwt.DEFAULT);
	this._prioritySelect.setMenu(new AjxCallback(this, this._priorityButtonMenuCallback));
	this._prioritySelect.reparentHtmlElement(this._htmlElId + "_priority");

	var listener = new AjxListener(this, this._selectListener);
	// add status DwtSelect
	this._statusSelect = new DwtSelect({parent:this});
	for (var i = 0; i < ZmTaskEditView.STATUS_VALUES.length; i++) {
		var v = ZmTaskEditView.STATUS_VALUES[i];
		this._statusSelect.addOption(ZmCalItem.getLabelForStatus(v), i==0, v);
	}
	this._statusSelect.addChangeListener(listener);
	this._statusSelect.reparentHtmlElement(this._htmlElId + "_status");

    var params = {
        parent: this,
        parentElement: (this._htmlElId + "_pCompleteSelectInput"),
        type: DwtInputField.STRING,
        errorIconStyle: DwtInputField.ERROR_ICON_NONE,
        validationStyle: DwtInputField.CONTINUAL_VALIDATION
    };
    this._pCompleteSelectInput = new DwtInputField(params);
    var pCompleteInputEl = this._pCompleteSelectInput.getInputElement();
    Dwt.setSize(pCompleteInputEl, Dwt.DEFAULT, "2rem");
    pCompleteInputEl.onblur = AjxCallback.simpleClosure(this._handleCompleteOnBlur, this, pCompleteInputEl);

    var pCompleteButtonListener = new AjxListener(this, this._pCompleteButtonListener);
    var pCompleteSelectListener = new AjxListener(this, this._pCompleteSelectListener);
    this._pCompleteButton = ZmTasksApp.createpCompleteButton(this, this._htmlElId + "_pCompleteSelect", pCompleteButtonListener, pCompleteSelectListener);
    this._pCompleteButton.setAriaLabel(ZmMsg.progressSelect);

	this._hasReminderSupport = Dwt.byId(this._htmlElId + "_reminderCheckbox") != null;

    if (this._hasReminderSupport) {
        // reminder date DwtButton's
        var remindDateBtnListener = new AjxListener(this, this._remindDateBtnListener);
        var remindDateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);

        this._reminderLabel = Dwt.byId(this._htmlElId+"_reminderLabel");

        this._reminderCheckbox = new DwtCheckbox({parent:this});
        this._reminderCheckbox.replaceElement(this._htmlElId+"_reminderCheckbox");
        this._reminderCheckbox.addSelectionListener(new AjxListener(this, this._setEmailReminderControls));

        this._remindDateField = document.getElementById(this._htmlElId + "_remindDateField");
        this._remindDateButton = ZmCalendarApp.createMiniCalButton(this, this._htmlElId + "_remindMiniCalBtn", remindDateBtnListener, remindDateCalSelectionListener, ZmMsg.startDate);
        this._remindDateButton.reparentHtmlElement(this._htmlElId + "_remindMiniCalBtn");

        // time DwtTimeSelect
        this._remindTimeSelect = new DwtTimeInput(this, DwtTimeInput.START);
        this._remindTimeSelect.reparentHtmlElement(this._htmlElId + "_remindTimeSelect");

        this._reminderEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderEmailCheckbox"));
        this._reminderEmailCheckbox.setText(ZmMsg.email);
        this._reminderDeviceEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderDeviceEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderDeviceEmailCheckbox"));
        this._reminderDeviceEmailCheckbox.setText(ZmMsg.deviceEmail);
        this._reminderConfigure = new DwtText({parent:this,className:"FakeAnchor"});
        this._reminderConfigure.setText(ZmMsg.remindersConfigure);
        this._reminderConfigure.replaceElement(document.getElementById(this._htmlElId+"_reminderConfigure"));
        this._setEmailReminderControls();
        
        var settings = appCtxt.getSettings();
        var listener = new AjxListener(this, this._settingChangeListener);
        settings.getSetting(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
        settings.getSetting(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
    }
};

ZmTaskEditView.prototype._remindDateBtnListener =
function(ev) {
	var calDate = ev.item == this._remindDateButton
		? AjxDateUtil.simpleParseDateStr(this._remindDateField.value)
		: null;

	// if date was input by user and its foobar, reset to today's date
	if (calDate == null || isNaN(calDate)) {
		calDate = new Date();
		var field = ev.item == this._remindDateButton ? this._remindDateField : null;

        var calEndDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
        if (calEndDate != null || isNaN(calEndDate)) {
            calDate = calEndDate;
        }
        
        field.value = AjxDateUtil.simpleComputeDateStr(calDate);
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

ZmTaskEditView.prototype._checkReminderDate =
function(){
    var currDate = new Date();
    var rd = AjxDateUtil.simpleParseDateStr(this._remindDateField.value);
    if (rd.valueOf() < currDate.valueOf()){
        this._remindDateField.value = AjxDateFormat.getDateInstance(AjxDateFormat.SHORT).format(currDate);
    }
};

ZmTaskEditView.prototype._dateCalSelectionListener = function(ev) {

    ZmCalItemEditView.prototype._dateCalSelectionListener.call(this,ev);

    var parentButton = ev.item.parent.parent;
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

    var ed = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
    var sd = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
    var rd = AjxDateUtil.simpleParseDateStr(this._remindDateField.value);

	// change the start/end date if they mismatch
	if (parentButton == this._endDateButton) {
		if(rd && (rd.valueOf() > ev.detail.valueOf())) {
            this._remindDateField.value = newDate;
        }
		//this._endDateField.value = newDate;
	} else if(parentButton == this._remindDateButton) {
        if (ed && (ed.valueOf() < ev.detail.valueOf())) {
			this._endDateField.value = newDate;
        }
        if (ed == null && sd && (sd.valueOf() < ev.detail.valueOf())) {
			this._startDateField.value = newDate;
        }
		this._remindDateField.value = newDate;
	} else if(parentButton == this._startDateButton) {
        if (ed == null && rd && (rd.valueOf() > ev.detail.valueOf())) {
              this._remindDateField.value = newDate;
        }
    }
    this._checkReminderDate();
};


ZmTaskEditView.prototype._addEventHandlers =
function() {
	var edvId = AjxCore.assignId(this);

	// add event listeners where necessary
	//Dwt.setHandler(this._repeatDescField, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
	//Dwt.setHandler(this._repeatDescField, DwtEvent.ONMOUSEOVER, ZmCalItemEditView._onMouseOver);
	//Dwt.setHandler(this._repeatDescField, DwtEvent.ONMOUSEOUT, ZmCalItemEditView._onMouseOut);

	//this._repeatDescField._editViewId =
    if (this._hasReminderSupport) {
        // TODO: What is this for?
        this._reminderCheckbox._editViewId = edvId;
    }
};

// cache all input fields so we dont waste time traversing DOM each time
ZmTaskEditView.prototype._cacheFields =
function() {
	ZmCalItemEditView.prototype._cacheFields.call(this);
	// HACK: hide all recurrence-related fields until tasks supports it
	//this._repeatSelect.setVisibility(false);
	//var repeatLabel = document.getElementById(this._htmlElId + "_repeatLabel");
	//Dwt.setVisibility(repeatLabel, false);
	//Dwt.setVisibility(this._repeatDescField, false);
    this._setRemindersEnabled(false);
};

// Returns a string representing the form content
ZmTaskEditView.prototype._formValue =
function(excludeAttendees) {
	var vals = [];

	vals.push(this._subjectField.getValue());
	vals.push(this._location.getValue());
	vals.push(this._getPriority());
	vals.push(this._folderSelect.getValue());
    var completion = this.getpCompleteInputValue();
	vals.push(completion.valid ? completion.percent : 0);
	vals.push(this._statusSelect.getValue());
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	if (startDate) vals.push(AjxDateUtil.getServerDateTime(startDate));
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
	if (endDate) vals.push(AjxDateUtil.getServerDateTime(endDate));

    if (this._hasReminderSupport) {
        var hasReminder = this._reminderCheckbox.isSelected();
        vals.push(hasReminder);
        if (hasReminder) {
            var remindDate = AjxDateUtil.simpleParseDateStr(this._remindDateField.value);
            remindDate = this._remindTimeSelect.getValue(remindDate);
            if(remindDate) {
                vals.push(
                    AjxDateUtil.getServerDateTime(remindDate)
                );
            }
            vals.push(this._reminderEmailCheckbox.isSelected());
            vals.push(this._reminderDeviceEmailCheckbox.isSelected());
        }
    }

	//vals.push(this._repeatSelect.getValue());
	vals.push(this._notesHtmlEditor.getContent());

	var str = vals.join("|");
	str = str.replace(/\|+/, "|");
	return str;
};

ZmTaskEditView.prototype._addTabGroupMembers =
function(tabGroup) {
	tabGroup.addMember(this._subjectField);
	tabGroup.addMember(this._location);

	var bodyFieldId = this._notesHtmlEditor.getBodyFieldId();
	tabGroup.addMember(document.getElementById(bodyFieldId));
};

// Consistent spot to locate various dialogs
ZmTaskEditView.prototype._getDialogXY =
function() {
	var loc = Dwt.toWindow(this.getHtmlElement(), 0, 0);
	return new DwtPoint(loc.x + ZmTaskEditView.DIALOG_X, loc.y + ZmTaskEditView.DIALOG_Y);
};

ZmTaskEditView.prototype._setPercentCompleteFields =
function(isComplete) {
	var val = isComplete
		? ZmTaskEditView.STATUS_VALUES[1]
		: ZmTaskEditView.STATUS_VALUES[0];
	this._statusSelect.setSelectedValue(val);
    this._pCompleteSelectInput.setValue(this.formatPercentComplete(isComplete ? 100 : 0));
};

// Listeners
ZmTaskEditView.prototype._handleCompleteOnBlur =
function(inputEl) {
	var pCompleteString = inputEl.value;
    if (!pCompleteString) {
		inputEl.value = this.formatPercentComplete(0);
		return;
	}
    var newVal = this.getpCompleteInputValue();
    if (newVal.valid) {
        if (newVal.percent == 100) {
            this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_COMP);
            this._unSelectRemindersCheckbox();   //bug:51913 disable alarm when stats is completed
        } else if (newVal.percent == 0) {
            this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_NEED);
        } else if ((newVal.percent > 0 || newVal.percent < 100) && (this._statusSelect.getValue() != ZmCalendarApp.STATUS_COMP ||
                    this._statusSelect.getValue() != ZmCalendarApp.STATUS_NEED)) {
            this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_INPR);
        }
        inputEl.value = this.formatPercentComplete(pCompleteString);
    }
};

ZmTaskEditView.prototype._pCompleteButtonListener =
function(ev) {
	var menu = ev.item.getMenu();
	ev.item.popup();
};

ZmTaskEditView.prototype._pCompleteSelectListener =
function(ev) {
	if(ev.item && ev.item instanceof DwtMenuItem){
        var newVal = ev.item.getData("value");
        this._pCompleteSelectInput.setValue(ev.item.getText());

        if (newVal == 100) {
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_COMP);
            this._unSelectRemindersCheckbox();  //bug:51913 disable alarm when stats is completed
		} else if (newVal == 0) {
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_NEED);
		} else if ((newVal > 0 || newVal < 100) && (this._statusSelect.getValue() != ZmCalendarApp.STATUS_COMP || this._statusSelect.getValue() != ZmCalendarApp.STATUS_NEED))
		{
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_INPR);
		}
		this._setEmailReminderControls();
        return;
    }
};

ZmTaskEditView.prototype._selectListener =
function(ev) {
	var newVal = ev._args.newValue;
	var oldVal = ev._args.oldValue;

	if (newVal == oldVal) { return; }

	var selObj = ev._args.selectObj;

	if (selObj == this._statusSelect) {
		if (newVal == ZmCalendarApp.STATUS_COMP) {
			this._pCompleteSelectInput.setValue(this.formatPercentComplete(100));
            this._unSelectRemindersCheckbox();    //bug:51913 disable alarm when stats is completed
		} else if (newVal == ZmCalendarApp.STATUS_NEED) {
			this._pCompleteSelectInput.setValue(this.formatPercentComplete(0));
		} else if (newVal == ZmCalendarApp.STATUS_INPR) {
            var completion = this.getpCompleteInputValue();
            if (completion.valid && (completion.percent == 100)) {
				this._pCompleteSelectInput.setValue(this.formatPercentComplete(0));
			}
		}
	} else {
		if (newVal == 100) {
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_COMP);
            this._unSelectRemindersCheckbox();
		} else if (newVal == 0) {
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_NEED);
		} else if ((oldVal == 0 || oldVal == 100) &&
			 		(newVal > 0 || newVal < 100) &&
					(this._statusSelect.getValue() == ZmCalendarApp.STATUS_COMP ||
					 this._statusSelect.getValue() == ZmCalendarApp.STATUS_NEED))
		{
			this._statusSelect.setSelectedValue(ZmCalendarApp.STATUS_INPR);
		}
	}
	this._setEmailReminderControls();
};


// Callbacks

ZmTaskEditView.prototype._handleOnClick =
function(el) {
		ZmCalItemEditView.prototype._handleOnClick.call(this, el);
};


ZmTaskEditView.prototype._setRemindersEnabled =
function(isEnabled) {
    if (this._hasReminderSupport) {
        this._remindDateButton.setEnabled(isEnabled);
        this._remindTimeSelect.setEnabled(isEnabled);
        Dwt.addClass(this._remindDateField.parentNode, !isEnabled ? 'DWTInputField-disabled' : 'DWTInputField', !isEnabled ? 'DWTInputField' : 'DWTInputField-disabled');
        this._remindDateField.disabled = !isEnabled;
    }
};

ZmTaskEditView.prototype._setRemindersConfigureEnabled = function(enabled) {
	this._reminderConfigure.setEnabled(enabled);
    this._reminderConfigure.getHtmlElement().onclick = enabled ? AjxCallback.simpleClosure(skin.gotoPrefs, skin, "NOTIFICATIONS") : null;
};

//
// ZmCalItemEditView methods
//

ZmTaskEditView.prototype._setEmailReminderControls = function() {
    if (this._hasReminderSupport) {

		ZmCalItemEditView.prototype._setEmailReminderControls.apply(this, arguments);

		// Bug 55392: Disable reminders altogether when task is completed
		var remindersEnabled = (this._statusSelect.getValue() != ZmCalendarApp.STATUS_COMP);
		Dwt.condClass(this._reminderLabel, remindersEnabled, "", "ZDisabled");
		this._reminderCheckbox.setEnabled(remindersEnabled);

		// primary reminder checkbox overrides other values
		var isSelected = this._reminderCheckbox.isSelected();
		this._setRemindersEnabled(isSelected);
		if (!isSelected) {
		    this._reminderEmailCheckbox.setEnabled(false);
		    this._reminderDeviceEmailCheckbox.setEnabled(false);
		}
		this._setRemindersConfigureEnabled(isSelected);
		this._reminderDeviceEmailCheckbox.setVisible(appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ENABLED));
	}
};

ZmTaskEditView.prototype.adjustReminderValue = function(calItem) {
    // no-op
};

ZmTaskEditView.prototype._resetReminders = function() {
    // no-op
};
}
if (AjxPackage.define("zimbraMail.tasks.view.ZmNewTaskFolderDialog")) {
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
 * @overview
 * This file contains the new task folder dialog.
 * 
 */

/**
 * Creates the new task folder dialog.
 * @class
 * This class represents the new task folder dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		ZmNewOrganizerDialog
 */
ZmNewTaskFolderDialog = function(parent, className) {
	ZmNewOrganizerDialog.call(this, parent, className, ZmMsg.createNewTaskFolder, ZmOrganizer.TASKS);
};

ZmNewTaskFolderDialog.prototype = new ZmNewOrganizerDialog;
ZmNewTaskFolderDialog.prototype.constructor = ZmNewTaskFolderDialog;


// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmNewTaskFolderDialog.prototype.toString =
function() {
	return "ZmNewTaskFolderDialog";
};


// Protected methods

// overload since we always want to init the color to grey
ZmNewTaskFolderDialog.prototype._initColorSelect =
function() {
	var option = this._colorSelect.getOptionWithValue(ZmOrganizer.C_ORANGE);
	this._colorSelect.setSelectedOption(option);
};

ZmNewTaskFolderDialog.prototype._getRemoteLabel =
function() {
	return ZmMsg.addRemoteTasks;
};

// overload so we dont show this
ZmNewTaskFolderDialog.prototype._createFolderContentHtml =
function(html, idx) {
	return idx;
};
}

if (AjxPackage.define("zimbraMail.tasks.controller.ZmTaskController")) {
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
 * @overview
 * This file contains the task controller class.
 * 
 */

/**
 * Creates a new task controller to manage task creation/editing.
 * @class
 * This class manages task creation/editing.
 *
 * @author Parag Shah
 *
 * @param {DwtShell}	container	the containing shell
 * @param {ZmApp}		app			the containing app
 * @param {constant}	type		controller type
 * @param {string}		sessionId	the session id
 * 
 * @extends		ZmCalItemComposeController
 */
ZmTaskController = function(container, app, type, sessionId) {
	if (arguments.length == 0) { return; }
	ZmCalItemComposeController.apply(this, arguments);
};

ZmTaskController.prototype = new ZmCalItemComposeController;
ZmTaskController.prototype.constructor = ZmTaskController;

ZmTaskController.prototype.isZmTaskController = true;
ZmTaskController.prototype.toString = function() { return "ZmTaskController"; };

ZmTaskController.DEFAULT_TAB_TEXT = ZmMsg.task;


// Public methods

ZmTaskController.getDefaultViewType =
function() {
	return ZmId.VIEW_TASKEDIT;
};
ZmTaskController.prototype.getDefaultViewType = ZmTaskController.getDefaultViewType;

ZmTaskController.prototype.saveCalItem =
function(attId) {
	var calItem = this._composeView.getCalItem(attId);
	if (calItem) {
		this._saveCalItemFoRealz(calItem, attId);
		return true;
	}
	return false;
};

ZmTaskController.prototype.isCloseAction =
function() {
    return this._action == ZmCalItemComposeController.SAVE;
};

ZmTaskController.prototype._handleResponseSave =
function(calItem, result) {
	ZmCalItemComposeController.prototype._handleResponseSave.call(this, calItem);
	if(this._action == ZmCalItemComposeController.SAVE) {
		this.closeView();	
	}
	// XXX: null out message so we re-fetch task next time its opened
	// To optimize, we should save the modified contents into cache'd task item
	if (calItem && calItem._orig)
		calItem._orig.message = null;

    //Cache the item for further processing
    calItem.cache();
    //need to set rev,ms for next soap request
    calItem.setFromSavedResponse(result);
    
	appCtxt.setStatusMsg(ZmMsg.taskSaved);
    if(calItem.alarm == true || calItem.isAlarmModified()) {
        this._app.getReminderController().refresh();
    }    
};

ZmTaskController.prototype._createComposeView =
function() {
	return (new ZmTaskEditView(this._container, this));
};

ZmTaskController.prototype._getDefaultFocusItem =
function() {
    return this._composeView._getDefaultFocusItem();	
};

ZmTaskController.prototype._getButtonOverrides =
function(buttons) {

	if (!(buttons && buttons.length)) { return; }

	var overrides = {};
	var idParams = {
		skinComponent:  ZmId.SKIN_APP_TOP_TOOLBAR,
		componentType:  ZmId.WIDGET_BUTTON,
		app:            ZmId.APP_TASKS,
		containingView: ZmId.VIEW_TASKEDIT
	};
	for (var i = 0; i < buttons.length; i++) {
		var buttonId = buttons[i];
		overrides[buttonId] = {};
		idParams.componentName = buttonId;
		var item = (buttonId === ZmOperation.SEP) ? "Separator" : buttonId + " button";
		var description = item + " on top toolbar for task edit view";
		overrides[buttonId].domId = ZmId.create(idParams, description);
	}
	return overrides;
};

ZmTaskController.prototype._setComposeTabGroup =
function(setFocus) {
	var tg = this._createTabGroup();
	var rootTg = appCtxt.getRootTabGroup();
	tg.newParent(rootTg);
	tg.addMember(this._toolbar);
	this._composeView._addTabGroupMembers(tg);

	var focusItem = this._composeView || this._composeView._getDefaultFocusItem() || tg.getFirstMember(true);
	var ta = new AjxTimedAction(this, this._setFocus, [focusItem, !setFocus]);
	AjxTimedAction.scheduleAction(ta, 10);
};

ZmTaskController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_EDIT_TASK;
};

/**
 * Checks if the tasks is moving from local to remote folder (or vice versa).
 * 
 * @param	{ZmTask}	task			the task
 * @param	{String}	newFolderId		the folder id
 * @return	{Boolean}	<code>true</code> if moving from local to remote folder
 */
ZmTaskController.prototype.isMovingBetwAccounts =
function(task, newFolderId) {
	var isMovingBetw = false;
	if (task._orig) {
		var origFolder = task._orig.getFolder();
		var newFolder = appCtxt.getById(newFolderId);
		if (origFolder && newFolder) {
			if ((origFolder.id != newFolderId) &&
				((origFolder.link && !newFolder.link) || (!origFolder.link && newFolder.link)))
			{
				isMovingBetw = true;
			}
		}
	}
	return isMovingBetw;
};

// Private / Protected methods

ZmTaskController.prototype._getTabParams =
function() {
	return {id:this.tabId, image:"CloseGray", hoverImage:"Close", text:ZmTaskController.DEFAULT_TAB_TEXT, textPrecedence:77,
			tooltip:ZmTaskController.DEFAULT_TAB_TEXT, style: DwtLabel.IMAGE_RIGHT};
};

// Callbacks

ZmTaskController.prototype._printListener =
function() {
	var url = ["/h/printtasks?id=", this._composeView._calItem.invId];
    
    if (appCtxt.isOffline) {
        var acctName = this._composeView._calItem.getAccount().name;
        url.push("&acct=", acctName);
    }
	window.open([appContextPath, url.join(""), "&tz=", AjxTimezone.getServerId(AjxTimezone.DEFAULT)].join(""), "_blank");
};

ZmTaskController.prototype.closeView = function() {
   this._closeView();
};

}
if (AjxPackage.define("zimbraMail.tasks.controller.ZmTaskTreeController")) {
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
 * @overview
 * This file contains the task tree controller class.
 */

/**
 * Creates the task tree controller.
 * @class
 * This class represents the task tree controller.
 * 
 * @extends		ZmFolderTreeController
 */
ZmTaskTreeController = function() {

	ZmFolderTreeController.call(this, ZmOrganizer.TASKS);

	this._listeners[ZmOperation.NEW_TASK_FOLDER] = new AjxListener(this, this._newListener);
	this._listeners[ZmOperation.SHARE_TASKFOLDER] = new AjxListener(this, this._shareTaskFolderListener);

	this._eventMgrs = {};
};

ZmTaskTreeController.prototype = new ZmFolderTreeController;
ZmTaskTreeController.prototype.constructor = ZmTaskTreeController;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmTaskTreeController.prototype.toString =
function() {
	return "ZmTaskTreeController";
};

// Public methods

/**
 * Displays the tree of this type.
 *
 * @param {Hash}	params		a hash of parameters
 * @param	{constant}	params.overviewId		the overview ID
 * @param	{Boolean}	params.showUnread		if <code>true</code>, unread counts will be shown
 * @param	{Object}	params.omit				a hash of organizer IDs to ignore
 * @param	{Object}	params.include			a hash of organizer IDs to include
 * @param	{Boolean}	params.forceCreate		if <code>true</code>, tree view will be created
 * @param	{String}	params.app				the app that owns the overview
 * @param	{Boolean}	params.hideEmpty		if <code>true</code>, don't show header if there is no data
 * @param	{Boolean}	params.noTooltips	if <code>true</code>, don't show tooltips for tree items
 */
ZmTaskTreeController.prototype.show = function(params) {
	params.include = params.include || {};
    params.include[ZmFolder.ID_TRASH] = true;
    params.showUnread = false;
    return ZmFolderTreeController.prototype.show.call(this, params);
};

ZmTaskTreeController.prototype.resetOperations =
function(parent, type, id) {
	var deleteText = ZmMsg.del;
	var folder = appCtxt.getById(id);
    var isShareVisible = true;

	parent.enableAll(true);
	if (folder) {
        if (folder.isSystem() || appCtxt.isExternalAccount()) {
            parent.enable([ZmOperation.DELETE_WITHOUT_SHORTCUT, ZmOperation.RENAME_FOLDER], false);
        } else if (folder.link && !folder.isAdmin()) {
            isShareVisible = false;
        }
        if (appCtxt.isOffline) {
            var acct = folder.getAccount();
            isShareVisible = !acct.isMain && acct.isZimbraAccount;
        }
        parent.enable([ZmOperation.SHARE_TASKFOLDER], isShareVisible);
        parent.enable(ZmOperation.SYNC, folder.isFeed());
	}

    parent.enable(ZmOperation.EMPTY_FOLDER,((folder.numTotal > 0) || (folder.children && (folder.children.size() > 0))));
    var nId = ZmOrganizer.normalizeId(id);
    var isTrash = nId == ZmOrganizer.ID_TRASH;
	this.setVisibleIfExists(parent, ZmOperation.EMPTY_FOLDER, isTrash);

	parent.enable(ZmOperation.EDIT_PROPS, !isTrash);
	var emptyFolderOp = parent.getOp(ZmOperation.EMPTY_FOLDER);
	if (emptyFolderOp) {
		emptyFolderOp.setText(ZmMsg.emptyTrash);
	}

	this._enableRecoverDeleted(parent, isTrash);

	var op = parent.getOp(ZmOperation.DELETE_WITHOUT_SHORTCUT);
	if (op) {
		op.setText(deleteText);
	}

    parent.enable(ZmOperation.NEW_TASK_FOLDER, !isTrash && !appCtxt.isExternalAccount());


	// we always enable sharing in case we're in multi-mbox mode
	// But no sharing for trash folder
	this._resetButtonPerSetting(parent, ZmOperation.SHARE_TASKFOLDER, !isTrash && appCtxt.get(ZmSetting.SHARING_ENABLED));
};

ZmTaskTreeController.prototype._getAllowedSubTypes =
function() {
	return ZmTreeController.prototype._getAllowedSubTypes.call(this);
};

ZmTaskTreeController.prototype._getSearchTypes =
function(ev) {
	return [ZmItem.TASK];
};
/*
* Returns a "New Task Folder" dialog.
*/
ZmTaskTreeController.prototype._getNewDialog =
function() {
	return appCtxt.getNewTaskFolderDialog();
};

ZmTaskTreeController.prototype._newCallback =
function(params) {
    // For a task, set the parent folder (params.l) if specified
    var folder = this._pendingActionData instanceof ZmOrganizer ? this._pendingActionData :
                    (this._pendingActionData && this._pendingActionData.organizer);
    if (folder) {
        params.l = folder.id;
    }
    ZmTreeController.prototype._newCallback.call(this, params);
};

// Returns a list of desired header action menu operations
ZmTaskTreeController.prototype._getHeaderActionMenuOps =
function() {
    if (appCtxt.isExternalAccount()) {
        return [];
    }
	return [ZmOperation.NEW_TASK_FOLDER, ZmOperation.FIND_SHARES];
};

// Returns a list of desired action menu operations
ZmTaskTreeController.prototype._getActionMenuOps = function() {

	return [
        ZmOperation.NEW_TASK_FOLDER,
		ZmOperation.SYNC,
		ZmOperation.EMPTY_FOLDER,
		ZmOperation.RECOVER_DELETED_ITEMS,
		ZmOperation.SHARE_TASKFOLDER,
		ZmOperation.DELETE_WITHOUT_SHORTCUT,
		ZmOperation.RENAME_FOLDER,
		ZmOperation.EDIT_PROPS
	];
};


// Listeners

ZmTaskTreeController.prototype._shareTaskFolderListener =
function(ev) {
	this._pendingActionData = this._getActionedOrganizer(ev);

	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (this._pendingActionData.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	appCtxt.getSharePropsDialog().popup(ZmSharePropsDialog.NEW, this._pendingActionData);
};

ZmTaskTreeController.prototype._deleteListener =
function(ev) {
    var organizer = this._getActionedOrganizer(ev);
    if (organizer.isInTrash()) {
        var callback = new AjxCallback(this, this._deleteListener2, [organizer]);
        var message = AjxMessageFormat.format(ZmMsg.confirmDeleteTaskFolder, AjxStringUtil.htmlEncode(organizer.name));

        appCtxt.getConfirmationDialog().popup(message, callback);
    }
    else {
        this._doMove(organizer, appCtxt.getById(ZmOrganizer.ID_TRASH));
    }
};

ZmTaskTreeController.prototype._deleteListener2 =
function(organizer) {
    this._doDelete(organizer);
};

/**
 * Called when a left click occurs (by the tree view listener). The folder that
 * was clicked may be a search, since those can appear in the folder tree. The
 * appropriate search will be performed.
 *
 * @param {ZmOrganizer}		folder		folder or search that was clicked
 * 
 * @private
 */
ZmTaskTreeController.prototype._itemClicked =
function(folder) {
	appCtxt.getApp(ZmApp.TASKS).search(folder);
};

/**
 * Gets the task Folders.
 *
 * @param	{String}	overviewId		the overview id
 * @param   {boolean}   includeTrash    True to include trash, if checked.
 * @return	{Array}		an array of {@link ZmCalendar} objects
 */
ZmTaskTreeController.prototype.getTaskFolders =
function(overviewId, includeTrash) {
	var tasks = [];
	var items = this._getItems(overviewId);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item._isSeparator) { continue; }
		var task = item.getData(Dwt.KEY_OBJECT);
        if (task && task.id == ZmOrganizer.ID_TRASH && !includeTrash && task.type) continue;
		if (task) tasks.push(task);
	}

	return tasks;
};


ZmTaskTreeController.prototype._getItems =
function(overviewId) {
	var treeView = this.getTreeView(overviewId);
	if (treeView) {
		var account = appCtxt.multiAccounts ? treeView._overview.account : null;
		if (!appCtxt.get(ZmSetting.TASKS_ENABLED, null, account)) { return []; }

		var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT, account);
		var root = treeView.getTreeItemById(rootId);
		if (root) {
			var totalItems = [];
			this._getSubItems(root, totalItems);
			return totalItems;
		}
	}
	return [];
};

ZmTaskTreeController.prototype._getSubItems =
function(root, totalItems) {
	if (!root || (root && root._isSeparator)) { return; }

	var items = root.getItems();
	for (var i in items) {
		var item = items[i];
		if (item && !item._isSeparator) {
			totalItems.push(item);
			this._getSubItems(item, totalItems);
		}
	}
};
}
}
