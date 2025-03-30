if (AjxPackage.define("Zimlet")) {
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
/*
 * Package: Zimlet
 * 
 * Supports: Zimlet instantiation and use
 * 
 * Loaded: When zimlets arrive in the <refresh> block
 */

if (AjxPackage.define("zimbraMail.share.model.ZmZimletBase")) {
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
 * 
 * This file defines the Zimlet Handler Object.
 *
 */

/**
 * @class
 *
 * This class provides the default implementation for Zimlet functions. A Zimlet developer may
 * wish to override some functions in order to provide custom functionality. All Zimlet Handler Objects should extend this base class.
 * <br />
 * <br />
 * <code>function com_zimbra_myZimlet_HandlerObject() { };</code>
 * <br />
 * <br />
 * <code>
 * com_zimbra_myZimlet_HandlerObject.prototype = new ZmZimletBase();
 * com_zimbra_myZimlet_HandlerObject.prototype.constructor = com_zimbra_myZimlet_HandlerObject;
 * </code>
 * 
 * @extends	ZmObjectHandler
 * @see		#init
 */
ZmZimletBase = function() {
	// do nothing
};

/**
 * This defines the Panel Menu.
 * 
 * @see #menuItemSelected}
 */
ZmZimletBase.PANEL_MENU = 1;
/**
 * This defines the Content Object Menu.
 * 
 * @see		#menuItemSelected}
 */
ZmZimletBase.CONTENTOBJECT_MENU = 2;

ZmZimletBase.PROXY = "/service/proxy?target=";

ZmZimletBase.prototype = new ZmObjectHandler();

/**
 * @private
 */
ZmZimletBase.prototype._init =
function(zimletContext, shell) {
	DBG.println(AjxDebug.ZIMLET, "Creating zimlet " + zimletContext.name);
	this._passRpcErrors = false;
	this._zimletContext = zimletContext;
	this._dwtShell = shell;
	this._origIcon = this.xmlObj().icon;
	this.__zimletEnabled = true;
	this.name = this.xmlObj().name;

	var contentObj = this.xmlObj("contentObject");
	if (contentObj && contentObj.matchOn) {
		var regExInfo = contentObj.matchOn.regex;
		if(!regExInfo.attrs) {regExInfo.attrs = "ig";}
		this.RE = new RegExp(regExInfo._content, regExInfo.attrs);
		if (contentObj.type) {
			this.type = contentObj.type;
		}
		ZmObjectHandler.prototype.init.call(this, this.type, contentObj["class"]);
	}
};

/**
 * This method is called by the Zimlet framework to indicate that
 * the zimlet it being initialized. This method can be overridden to initialize the zimlet.
 * 
 */
ZmZimletBase.prototype.init = function() {};

/**
 * Returns a string representation of the zimlet.
 * 
 * @return		{string}		a string representation of the zimlet
 */
ZmZimletBase.prototype.toString =
function() {
	return this.name;
};

/**
 * Gets the shell for the zimlet.
 * 
 * @return	{DwtShell}		the shell
 */
ZmZimletBase.prototype.getShell =
function() {
	return this._dwtShell;
};

/**
 * Adds an item to the search toolbar drop-down. A listener (if specified)
 * will be called when the item is selected.
 * 
 * @param	{string}	icon		the icon (style class) to use or <code>null</code> for no icon
 * @param	{string}	label		the label for the item
 * @param	{AjxListener}	listener		the listener or <code>null</code> for none
 * @param	{string}	id			the unique id of the item to add
 * @return	{ZmButtonToolBar}	<code>null</code> if item not created
 */
ZmZimletBase.prototype.addSearchDomainItem =
function(icon, label, listener, id) {
	var searchToolbar = appCtxt.getSearchController().getSearchToolbar();
	return searchToolbar ? searchToolbar.createCustomSearchBtn(icon, label, listener, id) : null;
};

/**
 * Gets the text field value entered in the search bar.
 * 
 * @return	{string}		the search field value or <code>null</code> for none
 */ 
ZmZimletBase.prototype.getSearchQuery =
function() {
	var searchToolbar = appCtxt.getSearchController().getSearchToolbar();
	return searchToolbar ? searchToolbar.getSearchFieldValue() : null;
};

/**
 * Gets the zimlet manager.
 * 
 * @return	{ZmZimletMgr}		the zimlet manager
 */
ZmZimletBase.prototype.getZimletManager =
function() {
	return appCtxt.getZimletMgr();
};

/**
 * @private
 */
ZmZimletBase.prototype.xmlObj =
function(key) {
	return !key ? this._zimletContext : this._zimletContext.getVal(key);
};

/**
 * Gets the zimlet context.
 * 
 * @return	{ZimletContext}	the context
 */
ZmZimletBase.prototype.getZimletContext =
function() {
	return	this._zimletContext;
}

/*
 * 
 *  Panel Item Methods
 *  
 */

/**
 * This method is called when an item is dragged on the Zimlet drop target
 * in the panel. This method is only called for the valid types that the
 * Zimlet accepts as defined by the <code>&lt;dragSource&gt;</code> Zimlet Definition File XML.
 *
 * @param	{ZmAppt|ZmConv|ZmContact|ZmFolder|ZmMailMsg|ZmTask}	zmObject		the dragged object
 * @return	{boolean}	<code>true</code> if the drag should be allowed; otherwise, <code>false</code>
 */
ZmZimletBase.prototype.doDrag =
function(zmObject) {
	return true;
};

/**
 * This method is called when an item is dropped on the Zimlet in the panel.
 * 
 * @param	{ZmAppt|ZmConv|ZmContact|ZmFolder|ZmMailMsg|ZmTask}	zmObject		the dropped object
 */
ZmZimletBase.prototype.doDrop =
function(zmObject) {};

/**
 * @private
 */
ZmZimletBase.prototype._dispatch =
function(handlerName) {
	var params = [];
	var obj;
	var url;
	for (var i = 1; i < arguments.length; ++i) {
		params[i-1] = arguments[i];
	}
	// create a canvas if so was specified
	var canvas;
	switch (handlerName) {
	    case "singleClicked":
	    case "doubleClicked":
		// the panel item was clicked
		obj = this.xmlObj("zimletPanelItem")
			[handlerName == "singleClicked" ? "onClick" : "onDoubleClick"];
		if (!obj) {
			break;
		}
		url = obj.actionUrl;
		if (url) {
			url = this.xmlObj().makeURL(url);
		}
		if (obj && (obj.canvas || url)) {
			canvas = this.makeCanvas(obj.canvas, url);
		}
		break;

	    case "doDrop":
		obj = params[1]; // the dragSrc that matched
		if (!obj)
			break;
		if (obj.canvas) {
			canvas = obj.canvas[0];
		}
		url = obj.actionUrl;
		if (url && canvas) {
			// params[0] is the dropped object
			url = this.xmlObj().makeURL(url[0], params[0]);
			canvas = this.makeCanvas(canvas, url);
			return "";
		}
		break;
	}
	if (canvas) {
		params.push(canvas);
	}
	return this.xmlObj().callHandler(handlerName, params);
};

/**
 * This method gets called when a single-click is performed.
 *
 * @param	{Object}	canvas		the canvas
 * @see		#doubleClicked
 */
ZmZimletBase.prototype.singleClicked = function(canvas) {};

/**
 * This method gets called when a double-click is performed. By default, this method
 * will create the default property editor for editing user properties.
 * 
 * @param	{Object}	canvas		the canvas
 * @see		#singleClicked
 * @see		#createPropertyEditor
 */
ZmZimletBase.prototype.doubleClicked =
function(canvas) {
	this.createPropertyEditor();
};

/*
 *
 * Application hook methods.
 * 
 */

/**
 * This method is called by the Zimlet framework when a user clicks-on a message in the mail application.
 * 
 * @param	{ZmMailMsg}		msg		the clicked message
 * @param	{ZmMailMsg}		oldMsg	the previous clicked message or <code>null</code> if this is the first message clicked
 * @param   {ZmMailMsgView} msgView the view that displays the message
 */
ZmZimletBase.prototype.onMsgView = function(msg, oldMsg, msgView) {};

/**
 * This method is called by the Zimlet framework when a user clicks-on a message in either the message or conversation view).
 * 
 * @param	{ZmMailMsg}			msg			the clicked message
 * @param	{ZmObjectManager}	objMgr		the object manager
 */
ZmZimletBase.prototype.onFindMsgObjects = function(msg, objMgr) {};

/**
 * This method is called by the Zimlet framework when a contact is clicked-on in the contact list view.
 * 
 * @param	{ZmContact}		contact		the contact being viewed
 * @param	{string}		elementId	the element Id
 */
ZmZimletBase.prototype.onContactView = function(contact, elementId) {};

/**
 * This method is called by the Zimlet framework when a contact is edited.
 * 
 * @param	{ZmEditContactView}	view	the edit contact view
 * @param	{ZmContact}		contact		the contact being edited
 * @param	{string}		elementId	the element Id
 */
ZmZimletBase.prototype.onContactEdit = function(view, contact, elementId) {};

/**
 * This method is called by the Zimlet framework when application toolbars are initialized.
 * 
 * @param	{ZmApp}				app				the application
 * @param	{ZmButtonToolBar}	toolbar			the toolbar
 * @param	{ZmController}		controller		the application controller
 * @param	{string}			viewId			the view Id
 */
ZmZimletBase.prototype.initializeToolbar = function(app, toolbar, controller, viewId) {};

/**
 * This method is called by the Zimlet framework when showing an application view.
 * 
 * @param	{string}		view		the name of the view
 */
ZmZimletBase.prototype.onShowView = function(view) {};

/**
 * This method is called by the Zimlet framework when a search is performed.
 * 
 * @param	{string}		queryStr		the search query string
 */
ZmZimletBase.prototype.onSearch = function(queryStr) {};

/**
 * This method is called by the Zimlet framework when the search button is clicked.
 * 
 * @param	{string}		queryStr		the search query string
 * @see		#onKeyPressSearchField
 */
ZmZimletBase.prototype.onSearchButtonClick = function(queryStr) {};

/**
 * This method is called by the Zimlet framework when enter is pressed in the search field.
 * 
 * @param	{string}		queryStr		the search query string
 * @see		#onSearchButtonClick
 */
ZmZimletBase.prototype.onKeyPressSearchField = function(queryStr) {};

/**
 * This method gets called by the Zimlet framework when the action menu is initialized on the from/sender of an email message.
 * 
 * @param	{ZmController}		controller		the controller
 * @param	{ZmActionMenu}		actionMenu		the action menu
 */
ZmZimletBase.prototype.onParticipantActionMenuInitialized = function(controller, actionMenu) {};

/**
 * This method gets called by the Zimlet framework when the action menu is initialized
 * on the subject/fragment of an email message.
 * 
 * <p>
 * This method is called twice:
 * <ul>
 * <li>The first-time a right-click is performed on a message in Conversation View.</li>
 * <li>The first-time a right-click is performed on a message in Message View.</li>
 * </ul>
 * </p>
 * 
 * @param	{ZmController}		controller		the controller
 * @param	{ZmActionMenu}		actionMenu		the action menu
 */
ZmZimletBase.prototype.onActionMenuInitialized = function(controller, actionMenu) {};

/**
 * This method gets called by the Zimlet framework when the action menu is initialized
 * on the briefcase item.
 * 
 * 
 * @param	{ZmController}		controller		the controller
 * @param	{ZmActionMenu}		actionMenu		the action menu
 */
ZmZimletBase.prototype.onBriefcaseActionMenuInitialized = function(controller, actionMenu) {};

/**
 * This method is called by the Zimlet framework when an email message is flagged.
 * 
 * @param	{ZmMailMsg[]|ZmConv[]}		items		an array of items
 * @param	{boolean}		on		<code>true</code> if the flag is being set; <code>false</code> if the flag is being unset
 */
ZmZimletBase.prototype.onMailFlagClick = function(items, on) {};

/**
 * This method is called by the Zimlet framework when an email message is tagged.
 * 
 * @param	{ZmMailMsg[]|ZmConv[]}		items		an array of items
 * @param	{ZmTag}			tag			the tag
 * @param	{boolean}		doTag		<code>true</code> if the tag is being set; <code>false</code> if the tag is being removed
 */
ZmZimletBase.prototype.onTagAction = function(items, tag, doTag) {};

/**
 * This method is called by the Zimlet framework when a message is about to be sent.
 * 
 * <p>
 * To fail the error check, the zimlet must return a <code>boolAndErrorMsgArray</code> array
 * with the following syntax:
 * <br />
 * <br />
 * <code>{hasError:&lt;true or false&gt;, errorMsg:&lt;error msg&gt;, zimletName:&lt;zimlet name&gt;}</code>
 *</p>
 *
 * @param	{ZmMailMsg}		msg		the message
 * @param	{array}		boolAndErrorMsgArray	an array of error messages, if any
 */
ZmZimletBase.prototype.emailErrorCheck = function(msg, boolAndErrorMsgArray) {};

/**
 * This method is called by the Zimlet framework when adding a signature to an email message.
 * 
 * <p>
 * To append extra signature information, the zimlet should push text into the <code>bufferArray</code>.
 * 
 * <pre>
 * bufferArray.push("Have fun, write a Zimlet!");
 * </pre>
 * </p>
 * 
 * @param	{ZmMailMsg}		contact		the clicked message
 * @param	{ZmMailMsg}		oldMsg	the previous clicked message or <code>null</code> if this is the first message clicked
 */
ZmZimletBase.prototype.appendExtraSignature = function(bufferArray) {};

/**
 * This method is called by the Zimlet framework when the message confirmation dialog is presented.
 * 
 * @param	{ZmMailConfirmView}		confirmView		the confirm view
 * @param	{ZmMailMsg}		msg		the message
 */
ZmZimletBase.prototype.onMailConfirm = function(confirmView, msg) {};

/*
 * 
 * Portlet methods
 */

/**
 * This method is called by the Zimlet framework when the portlet is created.
 * 
 * @param	{ZmPortlet}	portlet		the portlet
 */
ZmZimletBase.prototype.portletCreated =
function(portlet) {
    DBG.println("portlet created: " + portlet.id);
};

/**
 * This method is called by the Zimlet framework when the portlet is refreshed.
 * 
 * @param	{ZmPortlet}	portlet		the portlet
 */
ZmZimletBase.prototype.portletRefreshed =
function(portlet) {
	DBG.println("portlet refreshed: " + portlet.id);
};

/*
 * 
 * Content Object methods
 * 
 */

/**
 * This method is called when content (e.g. a mail message) is being parsed.
 * The match method may be called multiple times for a given piece of content and
 * should apply the pattern matching as defined for a given zimlet <code>&lt;regex&gt;</code>.
 * Zimlets should also use the "g" option when constructing their <code>&lt;regex&gt;</code>.
 *
 * <p>
 * The return should be an array in the form:
 *  
 * <pre>
 * result[0...n] // should be matched string(s)
 * result.index // should be location within line where match occurred
 * result.input // should be the input parameter content
 * </pre>
 * </p>
 * 
 * @param	{string}	content		the content line to perform a match against
 * @param	{number}	startIndex	the start index (i.e. where to begin the search)
 * @return	{array}	the matching content object from the <code>startIndex</code> if the content matched the specified zimlet handler regular expression; otherwise <code>null</code>
 */
ZmZimletBase.prototype.match =
function(content, startIndex) {
	if(!this.RE) {return null;}
	this.RE.lastIndex = startIndex;
	var ret = this.RE.exec(content);
	if (ret) {
		ret.context = ret;
	}
	return ret;
};

/**
 * This method is called when a zimlet content object is clicked.
 *
 * @param	{Object}		spanElement		the enclosing span element
 * @param	{string}		contentObjText	the content object text
 * @param	{array}		matchContent	the match content
 * @param	{DwtMouseEvent}	event			the mouse click event
 */
ZmZimletBase.prototype.clicked =
function(spanElement, contentObjText, matchContext, event) {
	var c = this.xmlObj("contentObject.onClick");
	if (c && c.actionUrl) {
		var obj = this._createContentObj(contentObjText, matchContext);
        var x = event.docX;
        var y = event.docY;
        this.xmlObj().handleActionUrl(c.actionUrl, c.canvas, obj, null, x, y);
	}
};

/**
 * This method is called when the tool tip is popping-up.
 *
 * @param	{Object}	spanElement		the enclosing span element
 * @param	{string}	contentObjText	the content object text
 * @param	{array}		matchContent	the matched content
 * @param	{Object}	canvas			the canvas
 */
ZmZimletBase.prototype.toolTipPoppedUp =
function(spanElement, contentObjText, matchContext, canvas) {
	var c = this.xmlObj("contentObject");
	if (c && c.toolTip) {
		var obj = this._createContentObj(contentObjText, matchContext);

		var txt;
		if (c.toolTip instanceof Object && c.toolTip.actionUrl) {
		    this.xmlObj().handleActionUrl(c.toolTip.actionUrl, [{type:"tooltip"}], obj, canvas);
		    // XXX the tooltip needs "some" text on it initially, otherwise it wouldn't resize afterwards.
		    txt = ZmMsg.zimletFetchingTooltipData;
		} else {
			// If it's an email address just use the address value.
			if (obj.objectContent instanceof AjxEmailAddress) {obj.objectContent = obj.objectContent.address;}
			txt = this.xmlObj().process(c.toolTip, obj);
		}
		canvas.innerHTML = txt;

		Dwt.setSize(canvas, parseInt(c.toolTip.width) || Dwt.DEFAULT, parseInt(c.toolTip.height) || Dwt.DEFAULT);
		
		if (this._isTooltipSticky()) {
			Dwt.setHandler(canvas, DwtEvent.ONCLICK, AjxCallback.simpleClosure(this.setTooltipSticky, this, [true]));

			var omem = DwtOutsideMouseEventMgr.INSTANCE;
			omem.startListening({
				id: "ZimletTooltip",
				elementId: canvas.id,
				outsideListener: new AjxListener(this, this.setTooltipSticky, [false, true])
			});

		}
	}
};

/**
 * This method is called when a sticky tooltip is clicked, when clicking outside
 * a sticky tooltip, or when a zimlet wants to stick or unstick a tooltip.
 * To explicitly dismiss a sticky tooltip, this method should be called with parameters (false, true)
 *
 * @param	{boolean}	sticky		Whether stickiness should be applied or removed
 * @param	{boolean}	popdown		(Optional) Pop down the tooltip after removing stickiness
 */
ZmZimletBase.prototype.setTooltipSticky =
function(sticky, popdown) {
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setSticky(sticky);
	if (!sticky && popdown) {
		tooltip.popdown();
	}
};

/**
 * This method is called when the tool tip is popping-down.
 *
 * @param	{Object}		spanElement		the enclosing span element
 * @param	{string}		contentObjText	the content object text
 * @param	{array}		matchContent	the matched content
 * @param	{Object}	canvas			the canvas
 * @return	{string}	<code>null</code> if the tool tip may be popped-down; otherwise, a string indicating why the tool tip should not be popped-down
 */
ZmZimletBase.prototype.toolTipPoppedDown =
function(spanElement, contentObjText, matchContext, canvas) {
	var omem = DwtOutsideMouseEventMgr.INSTANCE;
	omem.stopListening({
		id: "ZimletTooltip",
		elementId: canvas ? canvas.id : ""
	});
};

/**
 * @private
 */
ZmZimletBase.prototype.getActionMenu =
function(obj, span, context) {
	if (this._zimletContext._contentActionMenu instanceof AjxCallback) {
		this._zimletContext._contentActionMenu = this._zimletContext._contentActionMenu.run();
	}
	this._actionObject = obj;
	this._actionSpan = span;
	this._actionContext = context;
	return this._zimletContext._contentActionMenu;
};

/*
 *
 * Common methods
 * 
 */

/**
 * This method is called when a context menu item is selected.
 * 
 * @param	{ZmZimletBase.PANEL_MENU|ZmZimletBase.CONTENTOBJECT_MENU}	contextMenu		the context menu
 * @param	{string}		menuItemId		the selected menu item Id
 * @param	{Object}		spanElement		the enclosing span element
 * @param	{string}		contentObjText	the content object text
 * @param	{Object}		canvas		the canvas
 */
ZmZimletBase.prototype.menuItemSelected =
function(contextMenu, menuItemId, spanElement, contentObjText, canvas) {};

/**
 * This method is called if there are <code>&lt;userProperties&gt;</code> elements specified in the
 * Zimlet Definition File. When the zimlet panel item is double-clicked, the property
 * editor will be presented to the user.
 * 
 * <p>
 * This method creates the property editor for the set of <code>&lt;property&gt;</code> elements defined
 * in the <code>&lt;userProperties&gt;</code> element. The default implementation of this
 * method will auto-create a property editor based on the attributes of the user properties.
 * </p>
 * <p>
 * Override this method if a custom property editor is required.
 * </p>
 * 
 * @param	{AjxCallback}	callback	the callback method for saving user properties
 */
ZmZimletBase.prototype.createPropertyEditor =
function(callback) {
	var userprop = this.xmlObj().userProperties;

	if (!userprop || !userprop.length) {return;}

    for (var i = 0; i < userprop.length; ++i) {
        userprop[i].label = this._zimletContext.processMessage(userprop[i].label);
        if (userprop[i].type == "enum") {
        	var items = userprop[i].item;
        	for (var j=0; items != null && j < items.length; j++) {
        		if (items[j] == null)
        			continue;
        		var item = items[j];
        		item.label = this._zimletContext.processMessage(item.label);
        	}
        }
	}

	if (!this._dlg_propertyEditor) {
		var view = new DwtComposite(this.getShell());
		var pe = this._propertyEditor = new DwtPropertyEditor(view, true);
		pe.initProperties(userprop);
		var dialog_args = {
			title : this._zimletContext.processMessage(this.xmlObj("description")) + " preferences",
			view  : view
		};
		var dlg = this._dlg_propertyEditor = this._createDialog(dialog_args);
		pe.setFixedLabelWidth();
		pe.setFixedFieldWidth();
		dlg.setButtonListener(DwtDialog.OK_BUTTON,
				      new AjxListener(this, function() {
					      this.saveUserProperties(callback);
				      }));
	}
	this._dlg_propertyEditor.popup();
};


/*
 *
 * Helper methods
 * 
 */


/**
 * Displays the specified error message in the standard error dialog.
 * 
 * @param	{string}	msg		the error message to display
 * @param	{string}	data	the error message details
 * @param	{string}	title	the error message dialog title
 */
ZmZimletBase.prototype.displayErrorMessage = function(msg, data, title) {

    appCtxt.showError({
        errMsg:     msg,
        details:    data,
        title:      title || AjxMessageFormat.format(ZmMsg.zimletErrorTitle, this.xmlObj().label)
    });
};

/**
 * Displays the specified status message.
 * 
 * @param	{string}	msg		the status message to display
 */
ZmZimletBase.prototype.displayStatusMessage =
function(msg) {
	appCtxt.setStatusMsg(msg);
};

/**
 * Gets the fully qualified resource Url.
 *
 * @param	{string}	resourceName	the resource name
 * @return	{string}	the fully qualified resource Url
 */
ZmZimletBase.prototype.getResource =
function(resourceName) {
	return this.xmlObj().getUrl() + resourceName;
};

/**
 * @private
 */
ZmZimletBase.prototype.getType =
function() {
	return this.type;
};

/**
 * This method is called when a request finishes.
 * 
 * @param	{AjxCallback}	callback	the callback method or <code>null</code> for none
 * @param	{boolean}	passErrors	<code>true</code> to pass errors to the error display; <code>null</code> or <code>false</code> otherwise
 * @see		#sendRequest()
 * @private
 */
ZmZimletBase.prototype.requestFinished =
function(callback, passErrors, xmlargs) {
	this.resetIcon();
	if (!(passErrors || this._passRpcErrors) && !xmlargs.success) {
		this.displayErrorMessage("We could not connect to the remote server, or an error was returned.<br />Error code: " + xmlargs.status, xmlargs.text);
	} else if (callback)
		// Since we don't know for sure if we got an XML in return, it
		// wouldn't be too wise to create an AjxXmlDoc here.  Let's
		// just report the text and the Zimlet should know what to do
		callback.run(xmlargs);
};

/**
 * Sends the request content (via Ajax) to the specified server.
 * 
 * @param	{string}	requestStr		the request content to send
 * @param	{string}	serverURL		the server url
 * @param	{string[]}	requestHeaders	the request headers (may be <code>null</code>)
 * @param	{AjxCallback}	callback	the callback for asynchronous requests or <code>null</code> for none
 * @param	{boolean}	useGet		<code>true</code> to use HTTP GET; <code>null</code> or <code>false</code> otherwise
 * @param	{boolean}	passErrors	<code>true</code> to pass errors; <code>null</code> or <code>false</code> otherwise
 * @return	{Object}	the return value
 */
ZmZimletBase.prototype.sendRequest =
function(requestStr, serverURL, requestHeaders, callback, useGet, passErrors) {
	if (passErrors == null)
		passErrors = false;
	if (requestStr instanceof AjxSoapDoc)
		requestStr = [ '<?xml version="1.0" encoding="utf-8" ?>',
			       requestStr.getXml() ].join("");
	this.setBusyIcon();
	serverURL = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(serverURL);
	var our_callback = new AjxCallback(this, this.requestFinished, [ callback, passErrors ]);
	return AjxRpc.invoke(requestStr, serverURL, requestHeaders, our_callback, useGet);
};

/**
 * Enables the specified context menu item.
 * 
 * @param	{ZmZimletBase.PANEL_MENU|ZmZimletBase.CONTENTOBJECT_MENU}	contextMenu		the context menu
 * @param	{string}		menuItemId		the menu item Id
 * @param	{boolean}		enabled			<code>true</code> to enable the menu item; <code>false</code> to disable the menu item
 */
ZmZimletBase.prototype.enableContextMenuItem =
function(contextMenu, menuItemId, enabled) {};

/**
 * Gets the configuration property.
 * 
 * @param	{string}		propertyName	the name of the property to retrieve
 * @return	{string}	the value of the property or <code>null</code> if no such property exists
 */
ZmZimletBase.prototype.getConfigProperty =
function(propertyName) {};

/**
 * Gets the user property.
 * 
 * @param	{string}	propertyName the name of the property to retrieve
 * @return	{string}	the value of the property or <code>null</code> if no such property exists 
 */
ZmZimletBase.prototype.getUserProperty =
function(propertyName) {
	return this.xmlObj().getPropValue(propertyName);
};

/**
 * Sets the value of a given user property
 * 
 * @param	{string}	propertyName	the name of the property
 * @param	{string}	value			the property value
 * @param	{boolean}	save			if <code>true</code>, the property will be saved (along with any other modified properties) 
 * @param	{AjxCallback}	callback	the callback to invoke after the user properties save
 * @throws	ZimletException		if no such property exists or if the value is not valid for the property type
 * @see		#saveUserProperties
 */
ZmZimletBase.prototype.setUserProperty =
function(propertyName, value, save, callback) {
	this.xmlObj().setPropValue(propertyName, value);
	if (save)
		this.saveUserProperties(callback);
};

/**
 * This method is called by the zimlet framework prior to user properties being saved.
 *
 * @param	{array}	props		an array of objects with the following properties:
 * <ul>
 * <li>props[...].label {string} the property label</li>
 * <li>props[...].name {string} the property name</li>
 * <li>props[...].type {string} the property type</li>
 * <li>props[...].value {string} the property value</li>
 * </ul>
 * @return	{boolean}	<code>true</code> if properties are valid; otherwise, <code>false</code> or {String} if an error message will be displayed in the standard error dialog.
 */
ZmZimletBase.prototype.checkProperties =
function(props) {
	return true;
};

/**
 * Sets the busy icon. The Zimlet framework usually calls this method during SOAP
 * calls to provide some end-user feedback.
 * 
 * The default is a animated icon.
 * 
 * @private
 */
ZmZimletBase.prototype.setBusyIcon =
function() {
	this.setIcon("ZimbraIcon DwtWait16Icon");
};

/**
 * This Zimlet hook allows Zimlets to set custom headers to outgoing emails.
 * To set a custom header, they need to push header name and header value to
 * customMimeHeaders array.
 *  Example:
 *  customHeaders.push({name:"header1", _content:"headerValue"});
 *
 *  Note: Header name ("header1" in this case) MUST be one of the valid/allowed values of
 *  zimbraCustomMimeHeaderNameAllowed global-config property (set by admin)
 * @param {array} customMimeHeaders The array containing all custom headers
 *
 */
ZmZimletBase.prototype.addCustomMimeHeaders =
function(customMimeHeaders) {
	//Example:
	//customMimeHeaders.push({name:"header1", _content:"headerValue"});
};

/**
 * Sets the zimlet icon in the panel.
 * 
 * @param	{string}	icon		the icon (style class) for the zimlet
 * @private
 */
ZmZimletBase.prototype.setIcon =
function(icon) {
	if (!this.xmlObj("zimletPanelItem"))
		return;
	this.xmlObj().icon = icon;
    var treeItem;
    if (appCtxt.multiAccounts) {
        //get overview from the overview container
        var container = appCtxt.getCurrentApp().getOverviewContainer();
        var overviewId = appCtxt.getOverviewId([container.containerId, ZmOrganizer.LABEL[ZmOrganizer.ZIMLET]], null);
        var ov = container.getOverview(overviewId);
        treeItem = ov && ov.getTreeItemById && ov.getTreeItemById(this.xmlObj().getOrganizer().id);
    } else {
        var treeView = appCtxt.getAppViewMgr().getViewComponent(ZmAppViewMgr.C_TREE);
        treeItem = treeView && treeView.getTreeItemById && treeView.getTreeItemById(this.xmlObj().getOrganizer().id);
    }

	if (treeItem) {
		treeItem.setImage(icon);
	}
};

/**
 * Resets the zimlet icon to the one specified in the Zimlet Definition File (if originally set).
 * 
 * @private
 */
ZmZimletBase.prototype.resetIcon =
function() {
	this.setIcon(this._origIcon);
};


/**
 * Reset the toolbar
 *
 * @param	{ZmButtonToolBar|ZmActionMenu}  parent  the toolbar or action menu
 * @param	{int}   enable  number of items selected
 */
ZmZimletBase.prototype.resetToolbarOperations =
function(parent, num){};


/**
 * Saves the user properties.
 * 
 * @param	{AjxCallback}	callback		the callback to invoke after the save
 * @return	{string}		an empty string or an error message
 */
ZmZimletBase.prototype.saveUserProperties =
function(callback) {
	var soapDoc = AjxSoapDoc.create("ModifyPropertiesRequest", "urn:zimbraAccount");

	var props = this.xmlObj().userProperties;
	var check = this.checkProperties(props);

	if (!check)
		return "";
	if (typeof check == "string")
		return this.displayErrorMessage(check);

	if (this._propertyEditor)
		if (!this._propertyEditor.validateData())
			return "";

	// note that DwtPropertyEditor actually works on the original
	// properties object, which means that we already have the edited data
	// in the xmlObj :-) However, the props. dialog will be dismissed if
	// present.
	for (var i = 0; i < props.length; ++i) {
		var p = soapDoc.set("prop", props[i].value);
		p.setAttribute("zimlet", this.xmlObj("name"));
		p.setAttribute("name", props[i].name);
	}

	var ajxcallback = null;
	if (callback)
		ajxcallback = new AjxCallback(this, function(result) {
			// TODO: handle errors
			callback.run();
		});
	var params = { soapDoc: soapDoc, callback: ajxcallback, asyncMode: true, sensitive:true};
	appCtxt.getAppController().sendRequest(params);
	if (this._dlg_propertyEditor) {
		this._dlg_propertyEditor.popdown();
		// force the dialog to be reconstructed next time
		this._dlg_propertyEditor.dispose();
		this._propertyEditor = null;
		this._dlg_propertyEditor = null;
	}
	return "";
};

/**
 * Gets the user property info for the specified property.
 * 
 * @param	{string}	propertyName		the property
 * @return	{string}	the value of the user property
 */
ZmZimletBase.prototype.getUserPropertyInfo =
function(propertyName) {
	return this.xmlObj().getProp(propertyName);
};

/**
 * Gets the message property.
 * 
 * @param	{string}	msg		the message
 * @return	{string}	the message property or <code>"???" + msg + "???"</code> if not found
 */
ZmZimletBase.prototype.getMessage =
function(msg) {
	//Missing properties should not be catastrophic.
	var p = window[this.xmlObj().name];
	return p ? p[msg] : '???'+msg+'???';
};

/**
 * Gets the message properties.
 * 
 * @return	{string[]}		an array of message properties
 */
ZmZimletBase.prototype.getMessages =
function() {
	return window[this.xmlObj().name] || {};
};

/**
 * @private
 */
ZmZimletBase.prototype.getConfig =
function(configName) {
	return this.xmlObj().getConfig(configName);
};

/**
 * @private
 */
ZmZimletBase.prototype.getBoolConfig =
function(key, defaultValue) {
	var val = AjxStringUtil.trim(this.getConfig(key));
	if (val != null) {
		if (arguments.length < 2)
			defaultValue = false;
		if (defaultValue) {
			// the default is TRUE, check if explicitely disabled
			val = !/^(0|false|off|no)$/i.test(val);
		} else {
			// default FALSE, check if explicitely enabled
			val = /^(1|true|on|yes)$/i.test(val);
		}
	} else {
		val = defaultValue;
	}
	return val;
};

/**
 * @private
 */
ZmZimletBase.prototype.setEnabled =
function(enabled) {
	if (arguments.length == 0)
		enabled = true;
	this.__zimletEnabled = enabled;
};

/**
 * @private
 */
ZmZimletBase.prototype.getEnabled =
function() {
	return this.__zimletEnabled;
};

/**
 * Gets the current username.
 *
 * @return	{string}		the current username
 */
ZmZimletBase.prototype.getUsername =
function() {
	return appCtxt.get(ZmSetting.USERNAME);
};

/**
 * Gets the current user id.
 *
 * @return	{string}	the current user id
 */
ZmZimletBase.prototype.getUserID =
function() {
	return appCtxt.get(ZmSetting.USERID);
};

/**
 * Creates DOM safe ids.
 * 
 * @private
 */
ZmZimletBase.encodeId =
function(s) {
	return s.replace(/[^A-Za-z0-9]/g, "");
};

/**
 * @private
 */
ZmZimletBase.prototype.hoverOver =
function(object, context, x, y, span) {
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setContent('<div id="zimletTooltipDiv"/>', true);
	this.toolTipPoppedUp(span, object, context, document.getElementById("zimletTooltipDiv"), tooltip);
	tooltip.popup(x, y, true, !this._isTooltipSticky(), null, null, new AjxCallback(this, this.hoverOut, object, context, span));
};

/**
 * @private
 */
ZmZimletBase.prototype.hoverOut =
function(object, context, span) {
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	if (!tooltip.getHovered()) {
		tooltip.popdown();
		this.toolTipPoppedDown(span, object, context, document.getElementById("zimletTooltipDiv"));
	}
};

/**
 * @private
 */
ZmZimletBase.prototype.makeCanvas =
function(canvasData, url, x, y) {
	if(canvasData && canvasData.length)
        canvasData = canvasData[0];    
    var canvas = null;
	var div;

	div = document.createElement("div");
	div.id = "zimletCanvasDiv";

	// HACK #1: if an actionUrl was specified and there's no <canvas>, we
	// assume a <canvas type="window">
	if (!canvasData && url)
		canvasData = { type: "window" };

	// HACK #2: some folks insist on using "style" instead of "type". ;-)
	if (canvasData.style && !canvasData.type)
		canvasData.type = canvasData.style;

	switch (canvasData.type) {
	    case "window":
		var browserUrl = url;
		if (browserUrl == null)
			browserUrl = appContextPath+"/public/blank.html";
		var contentObject = this.xmlObj("contentObject");
        if(contentObject && !canvasData.width && contentObject.onClick ) {
            if(contentObject.onClick.canvas.props == "")
                canvas = window.open(browserUrl);
            else if(contentObject.onClick.canvas.props != "")
                canvas = window.open(browserUrl, this.xmlObj("name"), contentObject.onClick.canvas.props);
        }
        else{
            var props = canvasData.props ? [ canvasData.props ] : [ "toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes"];
            if (canvasData.width)
                props.push("width=" + canvasData.width);
            if (canvasData.height)
                props.push("height=" + canvasData.height);
            props = props.join(",");
            canvas = window.open(browserUrl, this.xmlObj("name"), props);
        }
        if (!url) {
			// TODO: add div element in the window.
			//canvas.document.getHtmlElement().appendChild(div);
		}
		break;

	    case "dialog":
		var view = new DwtComposite(this.getShell());
		if (canvasData.width)
			view.setSize(canvasData.width, Dwt.DEFAULT);
		if (canvasData.height)
			view.setSize(Dwt.DEFAULT, canvasData.height);
		var title = canvasData.title || ("Zimlet dialog (" + this.xmlObj("description") + ")");
		title = this._zimletContext.processMessage(title);
		canvas = this._createDialog({ view: view, title: title });
		canvas.view = view;
		if (url) {
			// create an IFRAME here to open the given URL
			var el = document.createElement("iframe");
			el.src = url;
			var sz = view.getSize();
			if (!AjxEnv.isIE) {
				// substract default frame borders
				sz.x -= 4;
				sz.y -= 4;
			}
			el.style.width = sz.x + "px";
			el.style.height = sz.y + "px";
			view.getHtmlElement().appendChild(el);
			canvas.iframe = el;
		} else {
			view.getHtmlElement().appendChild(div);
		}
		canvas.popup();
		break;

        case "tooltip":
        var shell = DwtShell.getShell(window);
	    var canvas = shell.getToolTip();
	    canvas.setContent('<div id="zimletTooltipDiv" />', true);
        var el = document.createElement("iframe");
        el.setAttribute("width",canvasData.width);
        el.setAttribute("height",canvasData.height);
        el.setAttribute("style","border:0px");        
        el.src = url;
        document.getElementById("zimletTooltipDiv").appendChild(el);
        canvas.popup(x, y, true);
        break;
    }
	return canvas;
};

/**
 * This method will apply and XSL transformation to an XML document. For example, content
 * returned from a services call.
 * 
 * @param	{string}	xsltUrl		the URL to the XSLT style sheet
 * @param	{string|AjxXmlDoc}	doc		the XML document to apply the style sheet
 * @return	{AjxXmlDoc}	the XML document representing the transformed document
 */
ZmZimletBase.prototype.applyXslt =
function(xsltUrl, doc) {
	var xslt = this.xmlObj().getXslt(xsltUrl);
	if (!xslt) {
		throw new Error("Cannot create XSLT engine: "+xsltUrl);
	}
	if (doc instanceof AjxXmlDoc) {
		doc = doc.getDoc();
	}
	var ret = xslt.transformToDom(doc);
	return AjxXmlDoc.createFromDom(ret);
};

/**
 * Creates a "tab" application and registers this zimlet to
 * receive {@link #appActive} and {@link #appLaunch} events.
 * 
 * @param	{string}	label	the label to use on the application tab
 * @param	{string}	image	the image (style class) to use on the application tab
 * @param	{string}	tooltip	the tool tip to display when hover-over the application tab
 * @param	{number}		[index]	the index to insert the tab (must be > 0). 0 is first location. Default is last location.
 * @param	{constant}	style	the button positioning style (see {@link DwtControl})
 * @return	{string}	the name of the newly created application
 */
ZmZimletBase.prototype.createApp =
function(label, image, tooltip, index, style) {

	AjxDispatcher.require("ZimletApp");

	var appName = [this.name, Dwt.getNextId()].join("_");
	var controller = appCtxt.getAppController();

	var params = {
			text:label,
			image:image,
			tooltip:tooltip,
			style: style
		};
	
	if (index != null && index >= 0)
		params.index = index;

	controller.getAppChooser().addButton(appName, params);

	// TODO: Do we have to call ZmApp.registerApp?

	var app = new ZmZimletApp(appName, this, DwtShell.getShell(window));
	controller.addApp(app);

	return appName;
};

/**
 * This method gets called each time the "tab" application is opened or closed.
 * 
 * @param	{string} appName        the application name
 * @param	{boolean} active        if <code>true</code>, the application status is open; otherwise, <code>false</code>
 * @see		#createApp
 */
ZmZimletBase.prototype.appActive = function(appName, active) { };

/**
 * This method gets called when the "tab" application is opened for the first time.
 * 
 * @param    {string} appName        the application name
 * @see		#createApp
 */
ZmZimletBase.prototype.appLaunch = function(appName) { };

/**
 * This method by the Zimlet framework when an application button is pressed.
 * 
 * @param	{string} id        the id of the application button
 */
ZmZimletBase.prototype.onSelectApp = function(id) { };

/**
 * This method by the Zimlet framework when an application action occurs.
 * 
 * @param	{string}	type        the type of action (for example: "app", "menuitem", "treeitem")
 * @param	{string}	action		the action
 * @param	{string}	currentViewId		the current view Id
 * @param	{string}	lastViewId		the last view Id
 */
ZmZimletBase.prototype.onAction = function(id, action, currentViewId, lastViewId) { };

/*
 *
 * Internal functions -- overriding is not recommended
 * 
 */

/**
 * Creates the object that describes the match, and is passed around to url generation routines
 * 
 * @private
 */
ZmZimletBase.prototype._createContentObj =
function(contentObjText, matchContext) {
	var obj = { objectContent: contentObjText };
	if (matchContext && (matchContext instanceof Array)) {
		for (var i = 0; i < matchContext.length; ++i) {
			obj["$"+i] = matchContext[i];
		}
	}
	return obj;
};

/**
 * @private
 */
ZmZimletBase.prototype._createDialog =
function(params) {
	params.parent = this.getShell();
	return new ZmDialog(params);
};

/**
 * Overrides default ZmObjectHandler methods for Zimlet API compat
 * 
 * @private
 */
ZmZimletBase.prototype._getHtmlContent =
function(html, idx, obj, context) {
	if (obj instanceof AjxEmailAddress) {
		obj = obj.address;
	}
	var contentObj = this.xmlObj().getVal("contentObject");
	if(contentObj && contentObj.onClick) {
 		html[idx++] = AjxStringUtil.htmlEncode(obj);
	} else {
		html[idx++] = AjxStringUtil.htmlEncode(obj, true);
	}
	return idx;
};

/**
 * Gets the mail messages for the conversation.
 * 
 * @param	{AjxCallback}		callback		the callback method
 * @param	{ZmConv}		conv			the conversation
 */
ZmZimletBase.prototype.getMsgsForConv =
function(callback, convObj){

	if (convObj instanceof Array) {
		convObj = convObj[0];
	}
	var convListController = AjxDispatcher.run("GetConvListController");
	var convList = convListController.getList();
	var conv = convList.getById(convObj.id);
	
	var ajxCallback = new AjxCallback(this, this._handleTranslatedConv, [callback, conv]);
	conv.loadMsgs({fetchAll:true}, ajxCallback);
};

/**
 * @private
 */
ZmZimletBase.prototype._handleTranslatedConv =
function(callback, conv) {
	if (callback) {
		callback.run(ZmZimletContext._translateZMObject(conv.msgs.getArray()));
	}
};

/**
 * @private
 *
 * Does the config say the tooltip should be sticky?
 */
ZmZimletBase.prototype._isTooltipSticky =
function() {
	var c = this.xmlObj("contentObject");
	return (c && c.toolTip && c.toolTip.sticky && c.toolTip.sticky.toLowerCase() === "true");
};

}
if (AjxPackage.define("zimbraMail.share.model.ZmZimletContext")) {
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
 * This file contains the Zimlet context class.
 */

/**
 * Creates the Zimlet context.
 * @class
 * This class represents the Zimlet context.
 * 
 * @param	{String}	id		the id
 * @param	{ZmZimletBase}	zimlet	the Zimlet
 * 
 */
ZmZimletContext = function(id, zimlet) {

	// sanitize JSON here
	this.json = ZmZimletContext.sanitize(zimlet, "zimlet", ZmZimletContext.RE_ARRAY_ELEMENTS);

	this.id = id;
	this.icon = "ZimbraIcon";
	this.ctxt = zimlet.zimletContext;
	this.config = zimlet.zimletConfig;
	zimlet = zimlet.zimlet[0];
	/**
	 * The zimlet name.
	 * @type String
	 */
	this.name = zimlet.name;
	this._url = this.ctxt[0].baseUrl;
	this.priority = this.ctxt[0].priority;
	/**
	 * The zimlet description.
	 * @type String
	 */
	this.description = zimlet.description;
	/**
	 * The zimlet version.
	 * @type String
	 */
	this.version = zimlet.version;
	this.label = zimlet.label;
	this.includes = this.json.zimlet.include || [];
	this.includes.push([appContextPath, "/messages/", this.name, ".js?v=", cacheKillerVersion].join(""));
	this.includeCSS = this.json.zimlet.includeCSS;

	if (zimlet.serverExtension && zimlet.serverExtension[0].hasKeyword) {
		this.keyword = zimlet.serverExtension[0].hasKeyword;
	}

	DBG.println(AjxDebug.DBG2, "Zimlets - context: " + this.name);

	this.targets = {};
	var targets = (zimlet.target || "main").split(" ");
	for (var i = 0; i < targets.length; i++) {
		this.targets[targets[i]] = true;
	}

	this._contentActionMenu = null;
	if (zimlet.contentObject) {
		this.contentObject = zimlet.contentObject[0];
		if (this.contentObject.type) {
			this.type = this.contentObject.type;
		}
		if (this.contentObject.contextMenu) {
			if (this.contentObject.contextMenu instanceof Array) {
				this.contentObject.contextMenu = this.contentObject.contextMenu[0];
			}
			this._contentActionMenu = new AjxCallback(this, this._makeMenu,[this.contentObject.contextMenu.menuItem]);
		}
	}

	this._panelActionMenu = null;
	if (zimlet.zimletPanelItem && !appCtxt.isChildWindow) {
		this.zimletPanelItem = zimlet.zimletPanelItem[0];
		if (this.zimletPanelItem.label) {
			this.zimletPanelItem.label = this.process(this.zimletPanelItem.label);
		}
		if (this.zimletPanelItem.toolTipText && this.zimletPanelItem.toolTipText[0]) {
			this.zimletPanelItem.toolTipText = this.process(this.zimletPanelItem.toolTipText[0]._content);
		}
		if (this.zimletPanelItem.icon) {
			this.icon = this.zimletPanelItem.icon;
		}
		if (this.zimletPanelItem.contextMenu) {
			if (this.zimletPanelItem.contextMenu instanceof Array) {
				this.zimletPanelItem.contextMenu = this.zimletPanelItem.contextMenu[0];
			}
			this._panelActionMenu = new AjxCallback(this, this._makeMenu, [this.zimletPanelItem.contextMenu.menuItem]);
		}
		if (this.zimletPanelItem.onClick instanceof Array) {
			this.zimletPanelItem.onClick = this.zimletPanelItem.onClick[0];
		}
		if (this.zimletPanelItem.onDoubleClick instanceof Array) {
			this.zimletPanelItem.onDoubleClick = this.zimletPanelItem.onDoubleClick[0];
		}
	}

	if (zimlet.handlerObject) {
		this.handlerObject = zimlet.handlerObject[0]._content;
	}

	var portlet = zimlet.portlet && zimlet.portlet[0];
	if (portlet) {
		portlet = ZmZimletContext.sanitize(portlet);
		portlet.portletProperties = (portlet.portletProperties && portlet.portletProperties.property) || {};
		this.portlet = portlet;
	}

	this.userProperties = zimlet.userProperties ? zimlet.userProperties[0] : [];
	this._propsById = {};
	if (zimlet.userProperties) {
		this._translateUserProp();
	}

	if (this.config) {
		if (this.config instanceof Array ||
			(appCtxt.isChildWindow && this.config.length && this.config[0])) {

			this.config = this.config[0];
		}
		this._translateConfig();
	}

	this._handleMenuItemSelected = new AjxListener(this, this._handleMenuItemSelected);
};

ZmZimletContext.prototype.constructor = ZmZimletContext;


//
// Consts
//
ZmZimletContext.RE_ARRAY_ELEMENTS = /^(dragSource|include|includeCSS|menuItem|param|property|resource|portlet)$/;
ZmZimletContext.APP = {
	contextPath: appContextPath,
	currentSkin: appCurrentSkin
};

// NOTE: I have no idea why these regexes start with (^|[^\\]). But
//       since they have always been public, I can't change them now.
ZmZimletContext.RE_SCAN_APP = /(^|[^\\])\$\{app\.([\$a-zA-Z0-9_]+)\}/g;
ZmZimletContext.RE_SCAN_OBJ = /(^|[^\\])\$\{(?:obj|src)\.([\$a-zA-Z0-9_]+)\}/g;
ZmZimletContext.RE_SCAN_PROP = /(^|[^\\])\$\{prop\.([\$a-zA-Z0-9_]+)\}/g;
ZmZimletContext.RE_SCAN_MSG = /(^|[^\\])\$\{msg\.([\$a-zA-Z0-9_]+)\}/g;

ZmZimletContext.__RE_SCAN_SETTING = /\$\{setting\.([\$a-zA-Z0-9_]+)\}/g;

/**
 * This function creates a 'sane' JSON object, given one returned by the
 * Zimbra server.
 *<p>
 * It will basically remove unnecessary arrays and create String objects for
 * those tags that have text data, so that we don't need to dereference lots of
 * arrays and use _content. It does the job that the server should do.  *grin*
 * </p>
 * <b>WARNING</b>: usage of an attribute named "length" may give sporadic
 * results, since we convert tags that have text content to Strings.
 *
 * @param obj -- array or object, whatever was given by server
 * @param tag -- the tag of this object, if it's an array
 * @param wantarray_re -- RegExp that matches tags that must remain an array
 *
 * @return -- sanitized object
 * 
 * @private
 */
ZmZimletContext.sanitize =
function(obj, tag, wantarray_re) {
	function doit(obj, tag) {
		var cool_json, val, i;
		if (obj instanceof DwtControl) { //Don't recurse into DwtControls, causes too much recursion
			return obj;
		}
		else if (obj instanceof Array || AjxUtil.isArray1(obj)) {
			if (obj.length == 1 && !(wantarray_re && wantarray_re.test(tag))) {
				cool_json = doit(obj[0], tag);
			} else {
				cool_json = [];
				for (i = 0; i < obj.length; ++i) {
					cool_json[i] = doit(obj[i], tag);
				}
			}
		}
		else if (obj && typeof obj == "object") {
			if (obj._content) {
				cool_json = new String(obj._content);
			} else {
				cool_json = {};
			}
			for (i in obj) {
				cool_json[i] = doit(obj[i], i);
			}
		} else {
			cool_json = obj;
		}
		return cool_json;
	}
	return doit(obj, tag);
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmZimletContext.prototype.toString =
function() {
	return "ZmZimletContext - " + this.name;
};

/**
 * <strong>Note:</strong>
 * This method is called by ZmZimletMgr#_finished_loadIncludes.
 * 
 * @private
 */
ZmZimletContext.prototype._finished_loadIncludes =
function() {
    // localize messages
    this.label = this.label && this.processMessage(this.label);
    this.description = this.description && this.processMessage(this.description);

	var CTOR = this.handlerObject ? window[this.handlerObject] : ZmZimletBase;
	if (!CTOR) {
		DBG.println("zimlet handler not defined ("+this.handlerObject+")");
		return;
	}
	this.handlerObject = new CTOR();
	if (!this.handlerObject._init) {
		var msg = [
			"ERROR - Zimlet handler (",
			this.name,
			") not defined. ",
			"Make sure the Zimlet name and handlerObject defined in ",
			this.name,
			".xml are different."
		].join("");
		DBG.println(AjxDebug.DBG1, msg);
	}
	this.handlerObject._init(this, DwtShell.getShell(window));
	if (this.contentObject) {
		appCtxt.getZimletMgr().registerContentZimlet(this.handlerObject, this.type, this.priority);
	}
	this.handlerObject.init();
	this.handlerObject._zimletContext = this;
	// If it has an _id then we need to make sure the treeItem is up-to-date now
	// that the i18n files have loaded.
	if (this._id) {
		var acct = appCtxt.isOffline ? appCtxt.accountList.mainAccount : null;
		var tree = appCtxt.getZimletTree(acct);
		if (tree) {
			var zimletItem = tree.getById(this._id);
			zimletItem.resetNames();
		}
	}

	// initialize portlets
	if (appCtxt.get(ZmSetting.PORTAL_ENABLED) && !appCtxt.isChildWindow) {
		var params = {
			name: "Portal",
			callback: new AjxCallback(this, this._finished_loadIncludes2)
		};
		DBG.println("------------------- REQUIRING Portal (ZmZimletContext)");
		AjxPackage.require(params);
	}

	DBG.println(AjxDebug.DBG2, "Zimlets - init() complete: " + this.name);
};

/**
 * @private
 */
ZmZimletContext.prototype._finished_loadIncludes2 =
function() {
	appCtxt.getApp(ZmApp.PORTAL).getPortletMgr().zimletLoaded(this);
};

/**
 * Gets the organizer.
 * 
 * @return	{ZmOrganizer}	the organizer
 */
ZmZimletContext.prototype.getOrganizer =
function() {
	// this._organizer is a ZmZimlet and is set in ZmZimlet.createFromJs
	return this._organizer;
};

/**
 * Gets the URL.
 * 
 * @return	{String}	the URL
 */
ZmZimletContext.prototype.getUrl =
function() {
	return this._url;
};

/**
 * Gets the value.
 * 
 * @param	{String}	key		the key
 * @return	{Object}	the value
 */
ZmZimletContext.prototype.getVal =
function(key) {
	var ret = this.json.zimlet;
	var keyParts = key.split('.');
	for (var i = 0; i < keyParts.length; i++) {
		ret = ret[keyParts[i]];
	}
	return ret;
};

/**
 * Calls the handler.
 * 
 * @param	{String}	funcname		the function
 * @param	{Hash}		args			the arguments
 * @return	{Object}	the results or <code>null</code> for none
 * 
 * @private
 */
ZmZimletContext.prototype.callHandler =
function(funcname, args) {
	if (this.handlerObject) {
		var f = this.handlerObject[funcname];
		if (typeof f == "function") {
			if (typeof args == "undefined") {
				args = [];
			}
			else if (!(args instanceof Array)) {
				args = [args];
			}
			return f.apply(this.handlerObject, args);
		}
	}
	return null;
};

/**
 * @private
 */
ZmZimletContext.prototype._translateUserProp =
function() {
	var a = this.userProperties = this.userProperties.property;
	for (var i = 0; i < a.length; ++i) {
		this._propsById[a[i].name] = a[i];
	}
};

/**
 * Sets the property.
 * 
 * @param	{String}	name		the name
 * @param	{Object}	val			the value
 * 
 */
ZmZimletContext.prototype.setPropValue =
function(name, val) {
	if (!this._propsById[name]) {
		var prop = { name: name };
		this.userProperties.push(prop);
		this._propsById[name] = prop;
	}
	this._propsById[name].value = val;
};

/**
 * Gets the property.
 * 
 * @param	{String}	name		the name
 * @return	{Object}	value
 */
ZmZimletContext.prototype.getPropValue =
function(name) {
	return this._propsById[name] && this._propsById[name].value;
};

/**
 * Gets the property.
 * 
 * @param	{String}	name		the name
 * @return	{Object}	the property
 */
ZmZimletContext.prototype.getProp =
function(name) {
	return this._propsById[name];
};

/**
 * @private
 */
ZmZimletContext.prototype._translateConfig =
function() {
	if (!this.config) { return; }

	if (this.config.global && this.config.global[0]) {
		var prop = this.config.global[0].property;
		this.config.global = {};
		for (var i in prop) {
			this.config.global[prop[i].name] = prop[i]._content;
		}
	}
	if (this.config.local && this.config.local[0]) {
		var propLocal = this.config.local[0].property;
		this.config.local = {};
		for (var j in propLocal) {
			this.config.local[propLocal[j].name] = propLocal[j]._content;
		}
	}
};

/**
 * Gets the configuration value.
 * 
 * @param	{String}	name		the config key name
 * @return	{Object}	the config value or <code>null</code> if not set
 */
ZmZimletContext.prototype.getConfig =
function(name) {

	var config = (this.config && this.config.length && this.config[0]) ? this.config[0] : this.config;
	if (!config) { return; }

	if (config.local && config.local[name]) {
		return config.local[name];
	}

	if (config.global && config.global[name]) {
		return config.global[name];
	}

	return null;
};

/**
 * Gets the panel action menu.
 * 
 * @return	{ZmActionMenu}	the menu
 */
ZmZimletContext.prototype.getPanelActionMenu =
function() {
	if (this._panelActionMenu instanceof AjxCallback) {
		this._panelActionMenu = this._panelActionMenu.run();
	}
	return this._panelActionMenu;
};

/**
 * Sets the panel action menu.
 * 
 * @param	{ZmActionMenu}	menu		the menu
 */
ZmZimletContext.prototype.setPanelActionMenu =
function(menu) {
	if (menu == null || (menu instanceof ZmActionMenu) == false)
		return;
	
	var items = menu.getMenuItems();
	for (menuId in items) {
		var item = items[menuId];
		if (item.id != null || item.id != "")
			item.addSelectionListener(this._handleMenuItemSelected);
	}
	
	this._panelActionMenu = menu;
};

/**
 * @private
 */
ZmZimletContext.prototype._makeMenu =
function(obj) {
	var menu = new ZmActionMenu({parent:DwtShell.getShell(window), menuItems:ZmOperation.NONE});
	for (var i = 0; i < obj.length; ++i) {
		var data = obj[i];
		if (!data.id) {
			menu.createSeparator();
		} else {
			var params = {image:data.icon, text:this.process(data.label),disImage:data.disabledIcon};
			var item = menu.createMenuItem(data.id, params);
			item.setData("xmlMenuItem", data);
			item.addSelectionListener(this._handleMenuItemSelected);
			if (data.menuItem) {
				item.setMenu(this._makeMenu(data.menuItem));
			}
		}
	}
	return menu;
};

/**
 * @private
 */
ZmZimletContext.prototype._handleMenuItemSelected =
function(ev) {
	var data = ev.item.getData("xmlMenuItem");
	if (data.actionUrl) {
		this.handleActionUrl(data.actionUrl[0], data.canvas);
	} else {
		this.callHandler("menuItemSelected", [data.id, data, ev]);
	}
};

/**
 * @private
 */
ZmZimletContext.prototype.process =
function(str, obj, props) {
	if (obj) {
		str = this.processString(str, obj);
	}
	str = this.processMessage(str); 
	str = this.replaceObj(ZmZimletContext.RE_SCAN_PROP, str, props || this._propsById);
	str = this.replaceObj(ZmZimletContext.RE_SCAN_APP, str, ZmZimletContext.APP);
	str = str.replace(ZmZimletContext.__RE_SCAN_SETTING, ZmZimletContext.__replaceSetting);
	return str;
};

/**
 * @private
 */
ZmZimletContext.prototype.processString =
function(str, obj) {
	return this.replaceObj(ZmZimletContext.RE_SCAN_OBJ, str, obj);
};

/**
 * @private
 */
ZmZimletContext.processMessage = function(name, str) {
	// i18n files load async so if not defined skip translation
	if (!window[name]) {
		DBG.println(AjxDebug.DBG2, "processMessage no messages: " + str);
		return str;
	}
	var props = window[name];
	return ZmZimletContext.replaceObj(ZmZimletContext.RE_SCAN_MSG, str, props);
};

/**
 * @private
 */
ZmZimletContext.replaceObj = function(re, str, obj) {
	return String(str).replace(re,
		function(str, p1, prop) {
			var txt = p1;
			if (obj instanceof Array && obj.length > 1) {
				for(var i=0; i < obj.length; i++) {
					if(txt) {txt += ",";}
					var o = obj[i];
					if (o[prop] instanceof Object) {
						txt += o[prop].value;  // user prop
					} else {
						txt += o[prop];   // string
					}
				}
			} else {
				if (typeof obj[prop] != "undefined") {
					if (obj[prop] instanceof Object) {
						txt += obj[prop].value;  // user prop
					} else {
						txt += obj[prop];   // string
					}
				} else {
					txt += "(UNDEFINED - str '" + str + "' obj '" + obj + "')";
				}
			}
			return txt;
		});
};

/**
 * Kept for backwards compatibility.
 * @private
 */
ZmZimletContext.prototype.processMessage = function(str) {
    return ZmZimletContext.processMessage(this.name, str);
};

/**
 * Kept for backwards compatibility.
 * @private
 */
ZmZimletContext.prototype.replaceObj = ZmZimletContext.replaceObj;

/**
 * @private
 */
ZmZimletContext.__replaceSetting =
function($0, name) {
	return appCtxt.get(name);
};

/**
 * @private
 */
ZmZimletContext.prototype.makeURL =
function(actionUrl, obj, props) {
	// All URL's to have REST substitutions
	var url = this.process(actionUrl.target, obj, props);
	var param = [];
	if (actionUrl.param) {
		var a = actionUrl.param;
		for (var i = 0; i < a.length; ++i) {
			// trim whitespace as it's almost certain that the
			// developer didn't intend it.
			var val = AjxStringUtil.trim(a[i]._content || a[i]);
			val = this.process(val, obj, props);
			param.push([ AjxStringUtil.urlEncode(a[i].name),
				     "=",
				     AjxStringUtil.urlEncode(val) ].join(""));
		}
		var startChar = actionUrl.paramStart || '?';
		var joinChar = actionUrl.paramJoin || '&';
		url = [ url, startChar, param.join(joinChar) ].join("");
	}
	return url;
};

/**
 * If there already is a paintable canvas to use, as in the case of tooltip,
 * pass it to 'div' parameter.  otherwise a canvas (window, popup, dialog) will
 * be created to display the contents from the url.
 *
 * @param actionUrl
 * @param canvas
 * @param obj
 * @param div
 * @param x
 * @param y
 * 
 * @private
 */
ZmZimletContext.prototype.handleActionUrl =
function(actionUrl, canvas, obj, div, x, y) {
	var url = this.makeURL(actionUrl, obj);
	var xslt = actionUrl.xslt && this.getXslt(actionUrl.xslt);

	// need to use callback if the paintable canvas already exists, or if it
	// needs xslt transformation.
	if (div || xslt) {
		if (!div) {
			canvas = this.handlerObject.makeCanvas(canvas, null, x, y);
			div = document.getElementById("zimletCanvasDiv");
		}
		url = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);
		AjxRpc.invoke(null, url, null, new AjxCallback(this, this._rpcCallback, [xslt, div]), true);
	} else {
		this.handlerObject.makeCanvas(canvas, url, x, y);
	}
};

/**
 * @private
 */
ZmZimletContext._translateZMObject =
function(obj) {
   var messages = [].concat(obj);
   var transformedObjects = [];
   
   for(x = 0; x < messages.length; x++) {
       var type = messages[x].toString();
       transformedObjects[x] = (ZmZimletContext._zmObjectTransformers[type]) ? ZmZimletContext._zmObjectTransformers[type](messages[x]) : messages[x];
   }
   
   return transformedObjects;
};

/**
 * @private
 */
ZmZimletContext._zmObjectTransformers = {

	"ZmMailMsg" : function(o) {
		var all = [];
		o = (o instanceof Array) ? o : [o];
		for (var i = 0; i < o.length; i++) {
			var ret = { TYPE: "ZmMailMsg" };
			var oi = o[i];
			ret.id			= oi.id;
			ret.convId		= oi.cid;
			ret.from		= oi.getAddresses(AjxEmailAddress.FROM).getArray();
			ret.to			= oi.getAddresses(AjxEmailAddress.TO).getArray();
			ret.cc			= oi.getAddresses(AjxEmailAddress.CC).getArray();
			ret.subject		= oi.subject;
			ret.date		= oi.date;
			ret.size		= oi.size;
			ret.fragment	= oi.fragment;
			ret.tags		= oi.tags;
			ret.unread		= oi.isUnread;
			ret.attachment	= oi.attachments.length > 0;
			ret.attlinks	= oi._attLinks || oi.getAttachmentLinks();
			ret.sent		= oi.isSent;
			ret.replied		= oi.isReplied;
			ret.draft		= oi.isDraft;
			ret.body		= ZmZimletContext._getMsgBody(oi);
			ret.srcObj		= oi;
			all[i] = ret;
		}
		if (all.length == 1) {
			return all[0];
		} else {
			all["TYPE"] = "ZmMailMsg";
			return all;
		}
	},

	"ZmConv" : function(o) {
		var all = [];
		o = (o instanceof Array) ? o : [o];
		for (var i = 0; i < o.length; i++) {
			var oi = o[i];
			var ret = { TYPE: "ZmConv" };
			ret.id				= oi.id;
			ret.subject			= oi.subject;
			ret.date			= oi.date;
			ret.fragment		= oi.fragment;
			ret.participants	= oi.participants.getArray();
			ret.numMsgs			= oi.numMsgs;
			ret.tags			= oi.tags;
			ret.unread			= oi.isUnread;
			ret.body			= ZmZimletContext._getMsgBody(oi.getFirstHotMsg());
			ret.srcObj			= oi;
			all[i] = ret;
		}
		if (all.length == 1) {
			return all[0];
		} else {
			all["TYPE"] = "ZmConv";
			return all;
		}
	},

	ZmContact_fields : function() {
		return [
			ZmContact.F_assistantPhone,
			ZmContact.F_callbackPhone,
			ZmContact.F_carPhone,
			ZmContact.F_company,
			ZmContact.F_companyPhone,
			ZmContact.F_email,
			ZmContact.F_email2,
			ZmContact.F_email3,
			ZmContact.F_fileAs,
			ZmContact.F_firstName,
			ZmContact.F_homeCity,
			ZmContact.F_homeCountry,
			ZmContact.F_homeFax,
			ZmContact.F_homePhone,
			ZmContact.F_homePhone2,
			ZmContact.F_homePostalCode,
			ZmContact.F_homeState,
			ZmContact.F_homeStreet,
			ZmContact.F_homeURL,
			ZmContact.F_jobTitle,
			ZmContact.F_lastName,
			ZmContact.F_middleName,
			ZmContact.F_mobilePhone,
			ZmContact.F_namePrefix,
			ZmContact.F_nameSuffix,
			ZmContact.F_notes,
			ZmContact.F_otherCity,
			ZmContact.F_otherCountry,
			ZmContact.F_otherFax,
			ZmContact.F_otherPhone,
			ZmContact.F_otherPostalCode,
			ZmContact.F_otherState,
			ZmContact.F_otherStreet,
			ZmContact.F_otherURL,
			ZmContact.F_pager,
			ZmContact.F_workCity,
			ZmContact.F_workCountry,
			ZmContact.F_workFax,
			ZmContact.F_workPhone,
			ZmContact.F_workPhone2,
			ZmContact.F_workPostalCode,
			ZmContact.F_workState,
			ZmContact.F_workStreet,
			ZmContact.F_workURL
			];
	},

	"ZmContact" : function(o) {
		o = (o instanceof Array) ? o : [o];
		var all = new Array();
		for (var i = 0; i < o.length; i++) {
			var ret = { TYPE: "ZmContact" };
			var a = this.ZmContact_fields;
			if (typeof a == "function") {
				a = this.ZmContact_fields = a();
			}
			var attr = o[i].getAttrs();
			for (var j = 0; j < a.length; ++j) {
				ret[a[j]] = attr[a[j]];
			}
			ret.id = o[i].id;
			all[i] = ret;
		}
		if (all.length == 1) {
			return all[0];
		} else {
			all["TYPE"] = "ZmContact";
			return all;
		}
	},

	"ZmFolder" : function(o) {
		var oi = o[0] ? o[0] : o;
		var ret = { TYPE: "ZmFolder" };
		ret.id			= oi.id;
		ret.name		= oi.getName();
		ret.path		= oi.getPath();
		ret.isInTrash	= oi.isInTrash();
		ret.unread		= oi.numUnread;
		ret.total		= oi.numTotal;
		ret.url			= oi.getRestUrl();
		ret.srcObj		= oi;
		return ret;
	},

	"ZmAppt" : function(o) {
		var oi = o[0] ? o[0] : o;
		oi.getDetails();
		var ret = { TYPE: "ZmAppt" };
		ret.id				= oi.id;
		ret.uid				= oi.uid;
		ret.subject			= oi.getName();
		ret.startDate		= oi.startDate;
		ret.endDate			= oi.endDate;
		ret.allDayEvent		= oi.isAllDayEvent();
		ret.exception		= oi.isException;
		ret.alarm			= oi.alarm;
		ret.otherAttendees	= oi.otherAttendees;
		ret.attendees		= oi.getAttendeesText(ZmCalBaseItem.PERSON);
		ret.resources		= oi.getAttendeesText(ZmCalBaseItem.EQUIPMENT);
		ret.location		= oi.getLocation();
		ret.notes			= oi.getNotesPart();
		ret.isRecurring		= oi.isRecurring();
		ret.timeZone		= oi.timezone;
		ret.srcObj			= oi;
		return ret;
	}
};

/**
 * Gets the xslt.
 * 
 * @param	{String}	url		the URL
 * @return	{AjxXslt}	the xslt
 */
ZmZimletContext.prototype.getXslt =
function(url) {
	if (!this._xslt) {
		this._xslt = {};
	}
	var realurl = this.getUrl() + url;
	if (!this._xslt[realurl]) {
		this._xslt[realurl] = AjxXslt.createFromUrl(realurl);
	}
	return this._xslt[realurl];
};

/**
 * @private
 */
ZmZimletContext.prototype._rpcCallback =
function(xslt, canvas, result) {
	var html, resp = result.xml;
	if (!resp) {
		var doc = AjxXmlDoc.createFromXml(result.text);
		resp = doc.getDoc();
	}
	// TODO:  instead of changing innerHTML, maybe append
	// the dom tree to the canvas.
	if (xslt) {
		html = xslt.transformToString(resp);
		// If we don't have HTML at this point, we probably have a HTML fragment.
		if (!html) {
			html = result.text;
		}
		
	} else {
		html = resp.innerHTML;
	}
	canvas.innerHTML = html;
};

/**
 * @private
 */
ZmZimletContext._getMsgBody =
function(o) {
	//If message is not loaded let developer take care of it
	if (!o._loaded) {
		return "";
	}
	var part = o.getBodyPart(ZmMimeTable.TEXT_PLAIN) || o.getBodyPart(ZmMimeTable.TEXT_HTML);
	var content = part && part.getContent();
	if (content && (part.contentType == ZmMimeTable.TEXT_HTML)) {
		var div = document.createElement("div");
		div.innerHTML = content;
		content = AjxStringUtil.convertHtml2Text(div);
	}
	return content || "";
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmZimletMgr")) {
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
 * This file contains the Zimlet manager class.
 */

/**
 * Creates the Zimlet manager.
 * @class
 * This class represents the Zimlet manager.
 * 
 */
ZmZimletMgr = function() {
	this._ZIMLETS = [];
	this._ZIMLETS_BY_ID = {};
	this._CONTENT_ZIMLETS = [];
	this._serviceZimlets = [];
	this._requestNotHandledByAnyZimlet = [];
	this.loaded = false;
};

ZmZimletMgr.prototype.constructor = ZmZimletMgr;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmZimletMgr.prototype.toString =
function() {
	return "ZmZimletMgr";
};

//
// Constants
//

ZmZimletMgr._RE_REMOTE = /^((https?|ftps?):\x2f\x2f|\x2f)/;

/**
* List of Core Zimlets.
* com_zimbra_apptsummary|com_zimbra_date|com_zimbra_dnd|com_zimbra_email|com_zimbra_linkedin|com_zimbra_phone|com_zimbra_webex|com_zimbra_social|com_zimbra_srchhighlighter|com_zimbra_url
*/
ZmZimletMgr.CORE_ZIMLETS = /com_zimbra_apptsummary|com_zimbra_date|com_zimbra_dnd|com_zimbra_email|com_zimbra_linkedin|com_zimbra_phone|com_zimbra_webex|com_zimbra_social|com_zimbra_srchhighlighter|com_zimbra_url/;

/**
 * If the Zimlet's config_template has  hasSensitiveData = true, it will be considered as sensitive Zimlet
 * and such zimlets are disabled (by-default) in mixed-mode.
 * System admin can set: mcf zimbraZimletDataSensitiveInMixedModeDisabled FALSE (instead of TRUE), to enable
 */
ZmZimletMgr.HAS_SENSITIVE_DATA_CONFIG_NAME = "hasSensitiveData";

//
// Public methods
//

/**
 * Checks if the manager is loaded.
 * 
 * @return	{Boolean}	<code>true</code> if loaded; <code>false</code> otherwise
 */
ZmZimletMgr.prototype.isLoaded =
function() {
	return this.loaded;
};

/**
 * Loads the zimlets.
 * 
 * @param	{Array}	zimletArray		an array of {@link ZmZimlet} objects
 * @param	{Array}	userProps		an array of properties
 * @param	{String}	target		the target
 * @param	{AjxCallback}	callback	the callback
 * @param	{Boolean}	sync		<code>true</code> for synchronous
 * 
 * @private
 */
ZmZimletMgr.prototype.loadZimlets =
function(zimletArray, userProps, target, callback, sync) {
	var href = window.location.href.toLowerCase();
	if(href.indexOf("zimlets=none") > 0 || appCtxt.isWebClientOffline()) {
		return;
	} else if(href.indexOf("zimlets=core") > 0) {
		zimletArray = this._getCoreZimlets(zimletArray);
	}
	var isHttp = document.location.protocol == ZmSetting.PROTO_HTTP;
	var isMixedMode = appCtxt.get(ZmSetting.PROTOCOL_MODE) == ZmSetting.PROTO_MIXED;
	var showAllZimlets = href.indexOf("zimlets=all") > 0;
	if(isMixedMode && !appCtxt.isOffline && !showAllZimlets && isHttp
			&& appCtxt.get(ZmSetting.DISABLE_SENSITIVE_ZIMLETS_IN_MIXED_MODE) == "TRUE") {
		zimletArray = this._getNonSensitiveZimlets(zimletArray);
	}
	var packageCallback = callback ? new AjxCallback(this, this._loadZimlets, [zimletArray, userProps, target, callback, sync]) : null;
	AjxPackage.require({ name: "Zimlet", callback: packageCallback });
	if (!callback) {
		this._loadZimlets(zimletArray, userProps, target, callback, sync);
	}
};


/**
 * Returns non-sensitive Zimlets whose config_template.xml file does not contain "hasSensitiveData=true"
 * @param	{Array}	zimletArray	an array of {@link ZmZimlet} objects
 *
 * @private
 */
ZmZimletMgr.prototype._getNonSensitiveZimlets =
function(zimletArray) {
	if (!zimletArray || !zimletArray.length) {
		return;
	}
	var nonSensitiveZimlets = [];
	var len = zimletArray.length;
	for(var i = 0; i < len; i++) {
		var configProps = [];
		var zimletObj = zimletArray[i];
		var isSensitiveZimlet = false;
		var zimletName = zimletObj.zimlet && zimletObj.zimlet[0] ? zimletObj.zimlet[0].name : "";
		var zimletConfig = zimletObj.zimletConfig;

		if(zimletConfig)  {
			if(zimletConfig[0]
					&& zimletConfig[0].global
					&& zimletConfig[0].global[0]
					&& zimletConfig[0].global[0].property) {

				configProps = zimletConfig[0].global[0].property;
				for(var j = 0; j < configProps.length; j++) {
					var property = configProps[j];
					if(property.name == ZmZimletMgr.HAS_SENSITIVE_DATA_CONFIG_NAME && property._content == "true") {
						isSensitiveZimlet = true;
						break;
					}
				}
			}
		}
		if(!isSensitiveZimlet) {
			nonSensitiveZimlets.push(zimletObj);
		}
	}
	return nonSensitiveZimlets;
};

/**
 * Returng an array with only core-Zimlets. This is used when we want to debug with only core-zimlets (?zimlets=core)
 * @param	{Array}	zimletArray		an array of {@link ZmZimlet} objects
 *
 * @private
 */
ZmZimletMgr.prototype._getCoreZimlets =
function(zimletArray) {
	if (!zimletArray || !zimletArray.length) {
		return;
	}
	var coreZimlets = [];
	var len = zimletArray.length;
	for(var i = 0; i < len; i++) {			
		var zimletObj = zimletArray[i].zimlet;
		var zimletName = zimletObj && zimletObj[0] ? zimletObj[0].name : "";
		if(ZmZimletMgr.CORE_ZIMLETS.test(zimletName)) {
			coreZimlets.push(zimletArray[i]);
		}		
	}
	return coreZimlets;
};

/**
 * @private
 */
ZmZimletMgr.prototype._loadZimlets =
function(zimletArray, userProps, target, callback, sync) {
	var z;
	var loadZimletArray = [];
	var targetRe = new RegExp("\\b"+(target || "main")+"\\b");
	for (var i=0; i < zimletArray.length; i++) {
		var zimletObj = zimletArray[i];
		var zimlet0 = zimletObj.zimlet[0];
		// NOTE: Only instantiate zimlet context for specified target
		if (!targetRe.test(zimlet0.target || "main")) { continue; }
		z = new ZmZimletContext(i, zimletObj);
		this._ZIMLETS_BY_ID[z.name] = z;
		this._ZIMLETS.push(z);
		loadZimletArray.push(zimletObj);
	}
	if (userProps) {
		for (i = 0; i < userProps.length; ++i) {
			var p = userProps[i];
			z = this._ZIMLETS_BY_ID[p.zimlet];
			if (z) {
				z.setPropValue(p.name, p._content);
			}
		}
	}
	if (!appCtxt.isChildWindow) {
		var panelZimlets = this.getPanelZimlets();
		if (panelZimlets && panelZimlets.length > 0) {
			var zimletTree = appCtxt.getZimletTree();
			if (!zimletTree) {
				zimletTree = new ZmFolderTree(ZmOrganizer.ZIMLET);
				var account = appCtxt.multiAccounts && appCtxt.accountList.mainAccount;
				appCtxt.setTree(ZmOrganizer.ZIMLET, zimletTree, account);
			}
			zimletTree.reset();
			zimletTree.loadFromJs(panelZimlets, "zimlet");
		} else { // reset overview tree accordingly
			this._resetOverviewTree();
		}
	}

	// load zimlet code/CSS
	var zimletNames = this._getZimletNames(loadZimletArray);
	this._loadIncludes(loadZimletArray, zimletNames, (sync ? callback : null) );
	this._loadStyles(loadZimletArray, zimletNames);

	if (callback && !sync) {
		callback.run();
	}
};

/**
 * @private
 */
ZmZimletMgr.prototype._resetOverviewTree =
function() {
	var zimletTree = appCtxt.getZimletTree();
	if (zimletTree) {
		var panelZimlets = this.getPanelZimlets();
		zimletTree.loadFromJs(panelZimlets, "zimlet");
		var overview = appCtxt.getCurrentApp().getOverview();
		if (overview) {
			var treeView =  overview.getTreeView(ZmOrganizer.ZIMLET);
			if (treeView && (!panelZimlets || !panelZimlets.length)) {
				treeView.clear(); //Clear the tree if thr are no panel zimlets
			}
		}
	}
};

/**
 * Gets the panel zimlets.
 * 
 * @return	{Array}	an array of objects
 */
ZmZimletMgr.prototype.getPanelZimlets =
function() {
	var panelZimlets = [];
	for (var i = 0; i < this._ZIMLETS.length; i++) {
		if (this._ZIMLETS[i].zimletPanelItem) {
			DBG.println(AjxDebug.DBG2, "Zimlets - add to panel " + this._ZIMLETS[i].name);
			panelZimlets.push(this._ZIMLETS[i]);
		}
	}
	return panelZimlets;
};

/**
 * Gets the indexed zimlets.
 * 
 * @return	{Array}	an array of objects
 */
ZmZimletMgr.prototype.getIndexedZimlets =
function() {
	var indexedZimlets = [];
	for (var i=0; i < this._ZIMLETS.length; i++) {
		if (this._ZIMLETS[i].keyword) {
			DBG.println(AjxDebug.DBG2, "Zimlets - add to indexed " + this._ZIMLETS[i].name);
			indexedZimlets.push(this._ZIMLETS[i]);
		}
	}
	return indexedZimlets;
};

/**
 * Gets the portlet zimlets.
 * 
 * @return	{Array}	an array of objects
 */
ZmZimletMgr.prototype.getPortletZimlets =
function() {
	if (!this._portletArray) {
		this._portletArray = [];
		this._portletMap = {};
		for (var i = 0; i < this._ZIMLETS.length; i++) {
			var zimlet = this._ZIMLETS[i];
			if (zimlet.portlet) {
				this._portletArray.push(zimlet);
				this._portletMap[zimlet.name] = zimlet;
			}
		}
	}
	return this._portletArray;
};

/**
 * Gets the portlets hash.
 * 
 * @return	{Hash}	the portlets hash
 */
ZmZimletMgr.prototype.getPortletZimletsHash =
function() {
	this.getPortletZimlets();
	return this._portletMap;
};

/**
 * Registers the content zimlet.
 * 
 * @param	{ZmZimlet}	zimletObj		the zimlet
 * @param	{constant}	type			the type
 * @param	{constant}	priority		the priority
 * 
 * @private
 */
ZmZimletMgr.prototype.registerContentZimlet =
function(zimletObj, type, priority) {
	var i = this._CONTENT_ZIMLETS.length;
	this._CONTENT_ZIMLETS[i] = zimletObj;
	this._CONTENT_ZIMLETS[i].type = type;
	this._CONTENT_ZIMLETS[i].prio = priority;
	DBG.println(AjxDebug.DBG2, "Zimlets - registerContentZimlet(): " + this._CONTENT_ZIMLETS[i]._zimletContext.name);
};

/**
 * Gets the content zimlets.
 * 
 * @return	{Array}	an array of objects
 */
ZmZimletMgr.prototype.getContentZimlets =
function() {
	return this._CONTENT_ZIMLETS;
};

/**
 * Gets the zimlets.
 * 
 * @return	{Array}	an array of {@link ZmZimletContext} objects
 */
ZmZimletMgr.prototype.getZimlets =
function() {
	return this._ZIMLETS;
};

/**
 * Gets the zimlets hash.
 * 
 * @return	{Hash}	as hash of zimlets
 */
ZmZimletMgr.prototype.getZimletsHash =
function() {
	return this._ZIMLETS_BY_ID;
};

/**
 * Checks if the zimlet exists.
 * 
 * @param	{String}	name		the name
 * @return	{ZmZimletContext}	the zimlet or <code>null</code> if not found
 */
ZmZimletMgr.prototype.zimletExists =
function(name) {
	return this._ZIMLETS_BY_ID[name];
};

/**
 * Gets the zimlet.
 * 
 * @param	{String}	name		the name
 * @return	{ZmZimletContext}	the zimlet or <code>null</code> if not found
 */
ZmZimletMgr.prototype.getZimletByName =
function(name) {
	for (var i = 0; i < this._ZIMLETS.length; i++) {
		var z = this._ZIMLETS[i];
		if (z && (z.name == name))
		{
			return z;
		}
	}
    return null;
};

/**
 * Handles zimlet notification.
 * 
 * @param	{Object}	event	the event
 * @param	{Object}	args	the arguments
 * 
 * @return true if any zimlet handled the notification
 * 
 * @private
 */
ZmZimletMgr.prototype.notifyZimlets =
function(event, args) {
	
	args = AjxUtil.toArray(args);

	var handled = false;
	for (var i = 0; i < this._ZIMLETS.length; ++i) {
		var z = this._ZIMLETS[i].handlerObject;
		if (z && z.isZmObjectHandler && z.getEnabled() && (typeof z[event] == "function")) {
			var result = args ? z[event].apply(z, args) : z[event].apply(z);	// IE cannot handle empty args
			handled = handled || result;
		}
	}
	
	return handled;
};

ZmZimletMgr.prototype.notifyZimlet =
function(zimletName, event, args) {
	var zimlet = this.getZimletByName(zimletName);
	var z = zimlet && zimlet.handlerObject;
	if (z && z.isZmObjectHandler && z.getEnabled() && (typeof z[event] == "function")) {
		return (args ? z[event].apply(z, args) : z[event].apply(z));	// IE cannot handle empty args
	}
};

/**
 * Processes a request (from core-zcs to zimlets) and returns value of the
 * first zimlet that serves the request.
 * PS: 
 * - Requestor must handle 'null' value
 * - stores/caches the zimlet for a given request to improve performance.
 * - also stores _requestNotHandledByAnyZimlet if no zimlet handles this
 *	request(in the current session), again to improve performance.
 * e.g: appCtxt.getZimletMgr().processARequest("getMailCellStyle", item, field)
 * 
 * @private
 */
ZmZimletMgr.prototype.processARequest =
function(request) {
	if (this._requestNotHandledByAnyZimlet[request]) { return null; }

	var args = new Array(arguments.length - 1);
	for (var i = 0; i < args.length;) {
		args[i] = arguments[++i];
	}
	var sz = this._serviceZimlets[request];
	if (sz) { // if we already know a zimlet that serves this request, use it.
		return sz[request].apply(sz, args);
	}

	var a = this._ZIMLETS;
	for (var i = 0; i < a.length; ++i) {
		var z = a[i].handlerObject;
		if (z && (z instanceof ZmZimletBase) && z.getEnabled() &&
			(typeof z[request] == "function"))
		{
			 this._serviceZimlets[request] = z;//store 
			 return z[request].apply(z, args);
		}
	}
	if (this.isLoaded()) { // add to an array to indicate that no zimlet implements this request
		this._requestNotHandledByAnyZimlet[request]=request;
	}
	return null;
};

//
// Protected methods
//

/**
 * @private
 */
ZmZimletMgr.prototype._getZimletNames =
function(zimletArray) {
	var array = new Array(zimletArray ? zimletArray.length : 0);
	for (var i = 0; i < zimletArray.length; i++) {
		array[i] = zimletArray[i].zimlet[0].name;
	}
	return array;
};

/**
 * @private
 */
ZmZimletMgr.prototype._loadIncludes =
function(zimletArray, zimletNames, callback) {
	var includes = this.__getIncludes(zimletArray, zimletNames, true);
	var includesCallback = new AjxCallback(this, this._finished_loadIncludes, [zimletNames, callback]);

	AjxInclude(includes, null, includesCallback, ZmZimletBase.PROXY);
};

/**
 * @private
 */
ZmZimletMgr.prototype._finished_loadIncludes =
function(zimletNames, callback) {
	if (!appCtxt.isChildWindow) {
		this.renameZimletsLabel();
	}
	this.loaded = true;
	var zimlets = this.getZimletsHash();
	for (var i = 0; i < zimletNames.length; i++) {
		var showedDialog = false;
		var name = zimletNames[i];
		try {
			zimlets[name]._finished_loadIncludes();
		} catch (e) {
			if (!showedDialog) {
				var dialog = appCtxt.getErrorDialog();
				var message = AjxMessageFormat.format(ZmMsg.zimletInitError, name);
				dialog.setMessage(message, e.toString(), DwtMessageDialog.CRITICAL_STYLE);
				dialog.popup();
				showedDialog = true;
			}
			DBG.println(AjxDebug.DBG1, "Error initializing zimlet '" + name + "': " + e);
		}
	}
	if (appCtxt.get(ZmSetting.PORTAL_ENABLED) && !appCtxt.isChildWindow) {
		var params = {
			name: "Portal",
			callback: (new AjxCallback(this, this._finished_loadIncludes2, [callback]))
		};
		AjxPackage.require(params);
	} else {
		this._finished_loadIncludes2(callback);
	}
};

/**
 * @private
 */
ZmZimletMgr.prototype._finished_loadIncludes2 =
function(callback) {
	appCtxt.allZimletsLoaded();

	if (callback) {
		callback.run();
	}
};

/**
 * @private
 */
ZmZimletMgr.prototype._loadStyles =
function(zimletArray, zimletNames) {
	var head = document.getElementsByTagName("head")[0];
	var includes = this.__getIncludes(zimletArray, zimletNames, false);
	for (var i = 0; i < includes.length; i++) {
		var style = document.createElement("link");
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = includes[i];

		head.appendChild(style);

		// XXX: say what?!
		style.disabled = true;
		style.disabled = false;
	}
};

//
// Private methods
//

/**
 * @private
 */
ZmZimletMgr.prototype.__getIncludes =
function(zimletArray, zimletNames, isJS) {
    // get language info
    var languageId = null;
    var countryId = null;
    if (appCtxt.get(ZmSetting.LOCALE_NAME)) {
        var locale = appCtxt.get(ZmSetting.LOCALE_NAME) || "";
        var parts = locale.split("_");
        languageId = parts[0];
        countryId = parts[1];
    }
    var locid = "";
    if (languageId) locid += "&language="+languageId;
    if (countryId) locid += "&country="+countryId;

    // add cache killer to each url
    var query = [
        "?v=", window.cacheKillerVersion
//        window.appDevMode ? new Date().getTime() : window.cacheKillerVersion
    ].join("");

    // add messages for all zimlets
    var includes = [];
    if (window.appDevMode && isJS) {
        var zimlets = appCtxt.get(ZmSetting.ZIMLETS) || [];
        if(appCtxt.isChildWindow) {
            var winOpener = window.opener || window;
            zimlets = winOpener.appCtxt.get(ZmSetting.ZIMLETS) || []
        }
        for (var i = 0; i < zimlets.length; i++) {
            var zimlet = zimlets[i].zimlet[0];
            includes.push([appContextPath, "/res/", zimlet.name, ".js", query, locid].join(""));
        }
    }

	// add remote urls
	for (var i = 0; i < zimletArray.length; i++) {
		var zimlet = zimletArray[i].zimlet[0];
		var baseUrl = zimletArray[i].zimletContext[0].baseUrl;
		var isDevZimlet = baseUrl.match("/_dev/");

		// include links
		var links = (isJS ? zimlet.include : zimlet.includeCSS) || [];
		for (var j = 0; j < links.length; j++) {
			var url = links[j]._content;
			if (ZmZimletMgr._RE_REMOTE.test(url)) {
				var fullurl = [ ZmZimletBase.PROXY, AjxStringUtil.urlComponentEncode(url) ].join("");
				includes.push(fullurl);
				continue;
			}
			if (window.appDevMode || isDevZimlet) {
                var debug = isDevZimlet ? "&debug=1" : "";
				includes.push([baseUrl, url, query, locid, debug].join(""));
			}
		}
	}

	// add link to aggregated files
	if (!window.appDevMode) {
		var cosId = null;
		if (appCtxt.getSettings() && appCtxt.getSettings().getInfoResponse && appCtxt.getSettings().getInfoResponse.cos) {
			cosId = appCtxt.getSettings().getInfoResponse.cos.id;
		}
		includes.unshift([
			"/service/zimlet/res/Zimlets-nodev_all",
			(isJS ? (".js" + appExtension) : ".css"),
			(languageId ? "?language=" + languageId : ""),
			(countryId ? "&country=" + countryId : ""),
			(cosId ? "&cosId=" + cosId : "")  // For an explanation of why we add cosId here, please see bug #58979
		].join(""));
	}

	return includes;
};

/**
 * Renames the zimlets label.
 * 
 * @private
 */
ZmZimletMgr.prototype.renameZimletsLabel =
function() {
	var treeController = appCtxt.getOverviewController().getTreeController("ZIMLET");
	var treeView = (treeController) ? treeController.getTreeView("Mail") : null;
	var root = (treeView) ? treeView.getItems()[0] : null;
	if (root) {
		var items = root.getItems();
		for (var i = 0; i < items.length; i++) {
			this.changeZimletLabel(items[i]);
		}
	}
};

/**
 * Changes the zimlet label.
 * 
 * @param	{Object}	item		the item
 */
ZmZimletMgr.prototype.changeZimletLabel =
function(item) {
	var zimlet = item.getData(Dwt.KEY_OBJECT);
	if (zimlet) {
		var currentLabel = zimlet.getName();
		var regEx = /\$/;
		if (currentLabel.match(regEx)) {
			var replaceLabel = currentLabel.replace(/\${msg./,'').replace(/}/,'');
			var zimletContextName = zimlet.getZimletContext().name;
			if (window[zimletContextName]) {
				var str = window[zimletContextName][replaceLabel];
				if (str) {
					item.setText(str);
					zimlet.setName(str);
				}
			}
		}
	}
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmZimlet")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the zimlet class.
 */

/**
 * Creates the zimlet
 * @class
 * This class represents a zimlet.
 * 
 * @param	{String}	id		the id
 * @param	{String}	name	the name
 * @param	{Object}	parent	the parent
 * @param	{ZmTree}	tree	the tree
 * @param	{String}	color	the color
 * @extends		ZmOrganizer
 */
ZmZimlet = function(id, name, parent, tree, color) {
	ZmOrganizer.call(this, {type: ZmOrganizer.ZIMLET, id: id, name: name, parent: parent, tree: tree});
};

ZmZimlet.prototype = new ZmOrganizer();
ZmZimlet.prototype.constructor = ZmZimlet;

// test hack 
ZmZimlet.actionMenus = {};
ZmZimlet.actionMenus["ZmCalViewController"] = [];
ZmZimlet.listeners = {};
ZmZimlet.listeners["ZmCalViewController"] = {};

// Constants
ZmZimlet.ID_ZIMLET = ZmOrganizer.ID_ZIMLET;
ZmZimlet.ID_ZIMLET_ROOT = ZmZimlet.ID_ZIMLET + "_root";

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmZimlet.prototype.toString =
function() {
	return "ZmZimlet - " + this.name;
};

/**
 * Sets the name
 * 
 * @param	{String}	name		the name
 */
ZmZimlet.prototype.setName =
function(name) {
	this.name = name;
};

// Static methods
/**
 * @private
 */
ZmZimlet.createFromJs =
function(parent, obj, tree, link) {
	if (!obj && obj.length < 1) {return null;}

	// create zimlet root
	var zimletRoot = new ZmZimlet(ZmZimlet.ID_ZIMLET_ROOT, ZmMsg.zimlets, parent, tree, null, null);
	if (obj && obj.length) {
		var id = ZmZimlet.ID_ZIMLET;
		for (var i = 0; i < obj.length; i++) {
			var lbl = obj[i].processMessage(obj[i].zimletPanelItem.label);
			// bug fix #23860 - unique-ify zimlet ID's so they dont conflict!
			var zimletId = (++id) + "_z";
			var childZimlet = new ZmZimlet(zimletId, lbl, zimletRoot, tree, null, null);
			zimletRoot.children.add(childZimlet);
			// WARNING: it's a bit unorthodox to do this linkage
			// here, but we really do need these objects know about
			// each other.
			childZimlet._zimletContext = obj[i];
			childZimlet._zimletContext._id = zimletId;
			childZimlet._toolTip = obj[i].zimletPanelItem.toolTipText;
			obj[i]._organizer = childZimlet;
		}
	}
	return zimletRoot;
};

/**
 * Compares and sorts the zimlets by name (case-insensitive).
 * 
 * @param	{ZmZimlet}	zimletA		the zimlet
 * @param	{ZmZimlet}	zimletB		the zimlet
 * @return	{int}	0 if the zimlets match; 1 if "a" is before "b"; -1 if "b" is before "a"
 */
ZmZimlet.sortCompare =
function(zimletA, zimletB) {
	var check = ZmOrganizer.checkSortArgs(zimletA, zimletB);
	if (!check) {return check;}

	// sort by name
	var zimletAName = zimletA.name.toLowerCase();
	var zimletBName = zimletB.name.toLowerCase();
	if (zimletAName < zimletBName) {return -1;}
	if (zimletAName > zimletBName) {return 1;}
	return 0;
};

/**
 * Checks the name.
 * 
 * @param	{String}	name		the name
 * @return	{String}	the name
 * @see		ZmOrganizer.checkName()
 */
ZmZimlet.checkName =
function(name) {
	return ZmOrganizer.checkName(name);
};

// Public methods
/**
 * Resets the names.
 * 
 */
ZmZimlet.prototype.resetNames =
function() {
	var oldName = this.name;
	var oldToolTip = this._toolTip;
	if(this._zimletContext && this._toolTip) {
		this._toolTip = this._zimletContext.processMessage(this._toolTip);
	}
	if(this._zimletContext && this.name) {
		this.name = this._zimletContext.processMessage(this.name);
	}
	// Update only if there was a change
	if((oldName != this.name) || (oldToolTip != this._toolTip)) {
		var fields = {};
		fields[ZmOrganizer.F_NAME] = true;
		var details = {};
		details.fields = fields;
		this._notify(ZmEvent.E_MODIFY, details);
	}
};

/**
 * Sets the tool tip text on the control.
 * 
 * @param	{DwtControl}	control		the control
 */
ZmZimlet.prototype.setToolTipText =
function(control) {
	control.setToolTipContent(this._toolTip);
};

/**
 * Gets the icon.
 * 
 * @return	{String}	the icon
 */
ZmZimlet.prototype.getIcon =
function() {
	return (this.id == ZmZimlet.ID_ZIMLET_ROOT) ? null : this._zimletContext.icon;
};

/**
 * Gets the zimlet context.
 * 
 * @return	{ZmZimletContext}	the context
 */
ZmZimlet.prototype.getZimletContext =
function() {
	return this._zimletContext;
};

/**
 * Checks if the tag supports sharing.
 * 
 * @return	{Boolean}	always returns <code>false</code>. Zimlets cannot be shared.
 */
ZmZimlet.prototype.supportsSharing =
function() {
	// zimlets cannot be shared
	return false;
};
}

if (AjxPackage.define("zimbraMail.share.controller.ZmZimletTreeController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * @overview
 * This file defines a Zimlet tree controller.
 *
 */

/**
 * Creates a Zimlet tree controller.
 * @class
 * This class represents a Zimlet tree controller.
 * 
 * @extends		ZmTreeController
 */
ZmZimletTreeController = function() {

	ZmTreeController.call(this, ZmOrganizer.ZIMLET);

    this._eventMgrs = {};

	// don't select zimlet items via arrow shortcut since selection pops up dialog
	this._treeSelectionShortcutDelay = 0;
};

ZmZimletTreeController.prototype = new ZmTreeController;
ZmZimletTreeController.prototype.constructor = ZmZimletTreeController;

ZmZimletTreeController.prototype.isZmZimletTreeController = true;
ZmZimletTreeController.prototype.toString = function() { return "ZmZimletTreeController"; };

// Public methods

/**
 * Adds a selection listener.
 * 
 * @param	{constant}	overviewId	the overview id
 * @param	{AjxListener}	listener		the listener to add
 */
ZmZimletTreeController.prototype.addSelectionListener =
function(overviewId, listener) {
	// Each overview gets its own event manager
	if (!this._eventMgrs[overviewId]) {
		this._eventMgrs[overviewId] = new AjxEventMgr;
		// Each event manager has its own selection event to avoid
		// multi-threaded collisions
		this._eventMgrs[overviewId]._selEv = new DwtSelectionEvent(true);
	}
	this._eventMgrs[overviewId].addListener(DwtEvent.SELECTION, listener);
};

ZmZimletTreeController.prototype._createTreeView =
function(params) {
	params.actionSupported = false;
	return new ZmTreeView(params);
};

/**
 * Removes the selection listener.
 * 
 * @param	{constant}	overviewId	the overview id
 * @param	{AjxListener}	listener		the listener to remove
 */
ZmZimletTreeController.prototype.removeSelectionListener =
function(overviewId, listener) {
	if (this._eventMgrs[overviewId]) {
		this._eventMgrs[overviewId].removeListener(DwtEvent.SELECTION, listener);
	}
};

// Protected methods

/**
 * @private
 */
ZmZimletTreeController.prototype._postSetup =
function(overviewId) {
	var treeView = this.getTreeView(overviewId);
	var root = treeView.getItems()[0];
	if (root) {
		var items = root.getItems();
		for (var i = 0; i < items.length; i++) {
			this.setToolTipText(items[i]);
		}
	}
};

/**
 * Sets the tool tip text.
 * 
 * @param	{object}	item		the item
 */
ZmZimletTreeController.prototype.setToolTipText =
function (item) {
	var zimlet = item.getData(Dwt.KEY_OBJECT);
	if (zimlet) zimlet.setToolTipText(item);
};

/**
 * ZmTreeController removes existing DwtTreeItem object then add a new one on ZmEvent.E_MODIFY,
 * wiping out any properties set on the object.
 * 
 * @private
 */
ZmZimletTreeController.prototype._changeListener =
function(ev, treeView, overviewId) {
	ZmTreeController.prototype._changeListener.call(this, ev, treeView, overviewId);
	var organizers = ev.getDetail("organizers");
	if (!organizers && ev.source)
		organizers = [ev.source];

	for (var i = 0; i < organizers.length; i++) {
		var organizer = organizers[i];
		var id = organizer.id;
		var item = treeView.getTreeItemById(id);
		this.setToolTipText(item);
	}
};

/**
 * @private
 */
ZmZimletTreeController.prototype._getDataTree =
function() {
	return appCtxt.getZimletTree();
};

/**
 * Returns a list of desired header action menu operations.
 * 
 * @private
 */
ZmZimletTreeController.prototype._getHeaderActionMenuOps = function() {
	return null;
};

/**
 * Returns a list of desired action menu operations.
 * 
 * @private
 */
ZmZimletTreeController.prototype._getActionMenuOps = function() {
	return null;
};

/**
 * @private
 */
ZmZimletTreeController.prototype._getActionMenu = function(ev) {
	var z = ev.item.getData(Dwt.KEY_OBJECT);
	// z is here a ZmZimlet
	z = z.getZimletContext();
	if(z) {
		return z.getPanelActionMenu();
	}
};

/**
 * Gets the tree style.
 * 
 * @return	{constant}	the style
 * @see		DwtTree.SINGLE_STYLE
 */
ZmZimletTreeController.prototype.getTreeStyle = function() {
	return DwtTree.SINGLE_STYLE;
};

/**
 * Method that is run when a tree item is left-clicked.
 * 
 * @private
 */
ZmZimletTreeController.prototype._itemClicked = function(z) {
	if (z.id == ZmZimlet.ID_ZIMLET_ROOT) { return; }

	// to allow both click and dbl-click, we should use a timeout here, as
	// this function gets called twice in the case of a dbl-click.  If the
	// timeout already exists, we do nothing since _itemDblClicked will be
	// called (the timeout is cleared there).
	if (!z.__dbl_click_timeout) {
		z.__dbl_click_timeout = setTimeout(function() {
			z.__dbl_click_timeout = null;
			z.getZimletContext().callHandler("_dispatch", [ "singleClicked" ]);
		}, 350);
	}
};

/**
 * @private
 */
ZmZimletTreeController.prototype._itemDblClicked = function(z) {
	if (z.id == ZmZimlet.ID_ZIMLET_ROOT) { return; }

	if (z.__dbl_click_timeout) {
		// click will never happen
		clearTimeout(z.__dbl_click_timeout);
		z.__dbl_click_timeout = null;
	}
	z.getZimletContext().callHandler("_dispatch", [ "doubleClicked" ]);
};

/**
 * Handles a drop event.
 * 
 * @private
 */
ZmZimletTreeController.prototype._dropListener = function(ev) {
	var z = ev.targetControl.getData(Dwt.KEY_OBJECT);
	if (!z) {
		ev.doIt = false;
		return;
	}
	if (z.id == ZmZimlet.ID_ZIMLET_ROOT) {
		ev.doIt = false;
		return;
	}
	if (z.getZimletContext) {
		try {
			z = z.getZimletContext();
		} catch(ex) {
			ev.doIt = false;
			return;
		}
	} else {
		ev.doIt = false;
		return;
	}
	var srcData = ev.srcData.data;
	if (!z || !srcData) {
		ev.doIt = false;
		return;
	}
	var dragSrc = z.zimletPanelItem.dragSource;
 	if (dragSrc && ev.action == DwtDropEvent.DRAG_DROP) {
		z.callHandler("_dispatch",
			[ "doDrop",
				ZmZimletContext._translateZMObject(srcData),
			dragSrc ]);
	}
};

/**
 * Handles a drag event.
 * 
 * @private
 */
ZmZimletTreeController.prototype._dragListener = function(ev) {
	// for now there's nothing defined in the spec to allow this
	ev.operation = Dwt.DND_DROP_NONE;
};
}
}
