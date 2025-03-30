if (AjxPackage.define("Portal")) {
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

if (AjxPackage.define("zimbraMail.portal.controller.ZmPortalController")) {
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
 * This file contains the portal controller class.
 */

/**
 * Creates the portal controller.
 * @class
 * This class represents the portal controller.
 * 
 * @param	{DwtComposite}	container	the containing element
 * @param	{ZmPortalApp}	app			the application
 * @param	{constant}		type		controller type
 * @param	{string}		sessionId	the session id
 * 
 * @extends		ZmListController
 */
ZmPortalController = function(container, app, type, sessionId) {
	if (arguments.length == 0) { return; }
	ZmListController.apply(this, arguments);

    // TODO: Where does this really belong? Answer: in ZmPortalApp
    ZmOperation.registerOp(ZmId.OP_PAUSE_TOGGLE, {textKey:"pause", image:"Pause", style: DwtButton.TOGGLE_STYLE});

    this._listeners[ZmOperation.REFRESH] = new AjxListener(this, this._refreshListener);
    this._listeners[ZmOperation.PAUSE_TOGGLE] = new AjxListener(this, this._pauseListener);
}
ZmPortalController.prototype = new ZmListController;
ZmPortalController.prototype.constructor = ZmPortalController;

ZmPortalController.prototype.isZmPortalController = true;
ZmPortalController.prototype.toString = function() { return "ZmPortalController"; };

//
// Public methods
//

ZmPortalController.prototype.getDefaultViewType = function() {
	return ZmId.VIEW_PORTAL;
};

ZmPortalController.prototype.show = function() {
	ZmListController.prototype.show.call(this);
	this._setup(this._currentViewId);

	var elements = this.getViewElements(this._currentViewId, this._listView[this._currentViewId]);

	this._setView({ view:		this._currentViewId,
					viewType:	this._currentViewType,
					elements:	elements,
					isAppView:	true});
};

/**
 * Sets the paused flag for the portlets.
 * 
 * @param	{Boolean}	paused		if <code>true</code>, pause the portlets
 */
ZmPortalController.prototype.setPaused = function(paused) {
    var view = this._listView[this._currentViewId];
    var portletIds = view && view.getPortletIds();
    if (portletIds && portletIds.length > 0) {
        var portletMgr = appCtxt.getApp(ZmApp.PORTAL).getPortletMgr();
        for (var i = 0; i < portletIds.length; i++) {
            var portlet = portletMgr.getPortletById(portletIds[i]);
            portlet.setPaused(paused);
        }
    }
};

//
// Protected methods
//

ZmPortalController.prototype._getToolBarOps = function() {
	return [ ZmOperation.REFRESH /*, ZmOperation.PAUSE_TOGGLE*/ ];
};

ZmPortalController.prototype._createNewView = function(view) {
	return new ZmPortalView(this._container, this, this._dropTgt);
};

ZmPortalController.prototype._setViewContents = function(view) {
	this._listView[view].set();
};

// listeners

ZmPortalController.prototype._refreshListener = function() {
    this._app.refreshPortlets();
};

ZmPortalController.prototype._pauseListener = function(event) {
    var toolbar = this._toolbar[this._currentViewId];

    // en/disable refresh button
    var button = toolbar && toolbar.getButton(ZmOperation.REFRESH);
    var paused = event.item.isToggled();
    if (button) {
        button.setEnabled(!paused);
    }

    // pause portlets appearing on portal page
    this.setPaused(paused);
};

ZmPortalController.prototype._resetOperations = function(parent, num) {
//    ZmListController.prototype._resetOperations.call(parent, num);
    parent.enable(this._getToolBarOps(), true);
};
}
if (AjxPackage.define("zimbraMail.portal.model.ZmPortlet")) {
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
 * This file defines the portlet.
 */

/**
 * @class
 * This class provides the implementation for portlet for use in the portal application.
 * 
 * @param	{ZmList}	list	the list that contains this item (may be <code>null</code>)
 * @param	{String}	id		the portlet id
 * @param	{Object}	def		the portlet definition
 *
 * @extends	ZmItem
 * 
 * @see		ZmPortalApp
 */
ZmPortlet = function(list, id, def) {
    ZmItem.call(this, ZmItem.PORTLET, id, list);

    // save zimlet
    var zimletMgr = appCtxt.getZimletMgr();
    this.zimletName = def.zimlet;
    this.zimletCtxt = zimletMgr.getZimletsHash()[this.zimletName];
    this.zimlet = this.zimletCtxt && this.zimletCtxt.handlerObject;

    // save data
	this.global = /^true|on|yes$/i.test(def.global);
    this.icon = def.icon;
    this.title = def.title;
    if (this.title) {
        this.title = this.zimletCtxt ? this.zimletCtxt.processMessage(def.title) : def.zimlet;
    }
    var portlet = this.zimletCtxt && this.zimletCtxt.portlet;
    this.actionUrl = portlet && portlet.actionUrl;

    // merge default and specified properties
    this.properties = {};
    var defaultProps = portlet && portlet.portletProperties;
    for (var i in defaultProps) {
        var prop = defaultProps[i];
        this.properties[prop.name] = prop.value;
    }
    if (def.properties) {
        for (var i = 0; i < def.properties.length; i++) {
            var prop = def.properties[i];
            this.properties[prop.name] = prop._content;
        }
    }

	// string replacement
	if (this.zimletCtxt) {
		for (var pname in this.properties) {
			this.properties[pname] = this.zimletCtxt.replaceObj(ZmZimletContext.RE_SCAN_APP, this.properties[pname], ZmZimletContext.APP);
			// TODO: replace msg,obj,etc...
		}
	}

    // setup refresh interval
    if (this.actionUrl) {
        this.setRefreshInterval(this.actionUrl.refresh);
    }
}
ZmPortlet.prototype = new ZmItem;
ZmPortlet.prototype.constructor = ZmPortlet;

ZmPortlet.prototype.toString = function() { return "ZmPortlet"; }

//
// Data
//

/**
 * The view associated to this portlet. Type is ZmPortletView.
 *
 * @private
 */
ZmPortlet.prototype.view;

/**
 * @private
 */
ZmPortlet.prototype._refreshActionId = -1;

//
// Public methods
//

/**
 * Refreshes the portlet.
 * 
 */
ZmPortlet.prototype.refresh = function() {
    if (this.view) {
        this._refreshTime = new Date().getTime();
        if (this.actionUrl) {
            this.view.setContentUrl(this.actionUrl.target);
        }
        else if (this.zimlet instanceof ZmZimletBase) {
            this.zimlet.portletRefreshed(this);
        }
        else if (this.zimlet) {
            var text = AjxMessageFormat.format(ZmMsg.zimletNotLoaded, this.zimletName);
            this.setContent(text);
        }
        else {
            var text = AjxMessageFormat.format(ZmMsg.zimletUnknown, this.zimletName);
            this.setContent(text);
        }
    }
};

/**
 * Sets the refresh interval.
 * 
 * @param	{int}		interval		the refresh interval (in milliseconds)
 */
ZmPortlet.prototype.setRefreshInterval = function(interval) {
    if (this._refreshActionId != -1) {
        clearInterval(this._refreshActionId);
        this._refreshActionId = -1;
    }
    this._refreshInterval = interval;
    if (interval) {
        if (!this._refreshAction) {
            this._refreshAction = AjxCallback.simpleClosure(this.refresh, this);
        }
        this._refreshActionId = setInterval(this._refreshAction, interval);
    }
};

/**
 * Sets the content.
 * 
 * @param	{String}	content		the content
 */
ZmPortlet.prototype.setContent = function(content) {
    if (this.view) {
        this.view.setContent(content);
    }
    else {
        DBG.println("no view to set content ("+this.id+")");
    }
};

/**
 * Sets the content url.
 * 
 * @param	{String}	url		the content url
 */
ZmPortlet.prototype.setContentUrl = function(url) {
    if (this.view) {
        this.view.setContentUrl(url);
    }
    else {
        DBG.println("no view to set content url ("+this.id+")");
    }
};

/**
 * Sets the portlet to "paused".
 * 
 * @param	{Boolean}	paused		if <code>true</code>, pause the portlet
 */
ZmPortlet.prototype.setPaused = function(paused) {
    if (this._refreshActionId != -1 && paused) {
        this._pauseTime = new Date().getTime();
        clearInterval(this._refreshActionId);
        this._refreshActionId = -1;
    }
    else if (this._refreshInterval && !paused) {
        var delta = this._refreshInterval - (this._pauseTime - this._refreshTime);
        var delay = delta < this._refreshInterval ? delta : 0;
        var resumeAction = AjxCallback.simpleClosure(this._resumeRefresh, this);
        setTimeout(resumeAction, delay);
    }
};

//
// Protected methods
//

/**
 * @private
 */
ZmPortlet.prototype._resumeRefresh = function() {
    this.refresh();
    this._refreshActionId = setInterval(this._refreshAction, this._refreshInterval);
};
}
if (AjxPackage.define("zimbraMail.portal.model.ZmPortletMgr")) {
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
 * Creates the portlet manager.
 * @class
 * This class represents the portlet manager.
 * 
 * @see		ZmPortalApp
 * @see		ZmPortlet
 */
ZmPortletMgr = function() {
    this._portlets = {};
    this._loadedZimlets = {};
    this._delayedPortlets = {};
};

//
// Public methods
//

/**
 * Creates the portlets.
 * 
 * @param	{Boolean}	global			if <code>true</code>, create global portlets
 * @param	{Object}	manifest		the portal manifest
 */
ZmPortletMgr.prototype.createPortlets = function(global, manifest) {
	global = global != null ? global : false;
	var portletsCreated = [];
    manifest = manifest || appCtxt.getApp(ZmApp.PORTAL).getManifest();
    if (manifest) {
        var portalDef = manifest.portal;
        var portletDefs = portalDef && portalDef.portlets;
        if (portletDefs) {
            for (var i = 0; i < portletDefs.length; i++) {
                var portletDef = portletDefs[i];
				var portletGlobal = portletDef.global == "true";
				if (portletGlobal != global) continue;
                
                var id = portletDef.panel && portletDef.panel.id;
                if (id && !this._portlets[id] && document.getElementById(id)) {
                    this.createPortlet(id, portletDef);
                    portletsCreated.push(id);
                }
            }
        }
    }
    return portletsCreated;
};

/**
 * Creates the portlet.
 * 
 * @param	{String}	id		the portlet id
 * @param	{Object}	portletDef		the portlet definition
 * 
 * @return	{ZmPortlet}	the newly created portlet
 */
ZmPortletMgr.prototype.createPortlet = function(id, portletDef) {
    // create portlet
    var portlet = new ZmPortlet(null, id, portletDef);
    this._portlets[id] = portlet;

    // notify portlet creation or add to list to notify later
	var name = portlet.zimletName;
	if (this._loadedZimlets[name]) {
		this._portletCreated(portlet);
	}
	else if (name) {
		if (!this._delayedPortlets[name]) {
			this._delayedPortlets[name] = [];
		}
		this._delayedPortlets[name].push(portlet);
	}

    return portlet;
};

/**
 * Gets the portlets.
 * 
 * @return	{Array}		an array of {@link ZmPortlet} objects
 */
ZmPortletMgr.prototype.getPortlets = function() {
    return this._portlets;
};

/**
 * Gets the portlet by id.
 * 
 * @param	{String}	id		the portlet id
 * @return	{ZmPortlet}	the portlet
 */
ZmPortletMgr.prototype.getPortletById = function(id) {
    return this._portlets[id];
};

/**
 * This method is called by ZmZimletContext after the source code for
 * the zimlet is loaded.
 * 
 * @private
 */
ZmPortletMgr.prototype.zimletLoaded = function(zimletCtxt) {
    this._loadedZimlets[zimletCtxt.name] = true;

    var delayedPortlets = this._delayedPortlets[zimletCtxt.name];
    if (delayedPortlets) {
        for (var i = 0; i < delayedPortlets.length; i++) {
            var portlet = delayedPortlets[i];
            this._portletCreated(portlet, zimletCtxt);
        }
    }
    delete this._delayedPortlets[zimletCtxt.name];
};

/**
 * This method is called after all of the zimlets have been loaded. It is
 * a way for the portlet manager to know that there are no more zimlets
 * expected.
 * 
 * @private
 */
ZmPortletMgr.prototype.allZimletsLoaded = function() {
	for (var name in this._portlets) {
		var portlet = this._portlets[name];
		if (!this._loadedZimlets[portlet.zimletName]) {
			// NOTE: We don't call setContent because there is no view object
			//       if no zimlet code was loaded.
			var el = document.getElementById(portlet.id);
			if (el) {
				el.innerHTML = "";
			}
		}
	}
};

//
// Protected methods
//

ZmPortletMgr.prototype._portletCreated = function(portlet, zimletCtxt) {
    // get zimlet context, if needed
    if (!zimletCtxt) {
        zimletCtxt = appCtxt.getZimletMgr().getZimletsHash()[portlet.zimletName];
    }

    // create view
    var parentEl = document.getElementById(portlet.id);
    var view = new ZmPortletView(parentEl, portlet);

    // call portlet handler
    var handler = zimletCtxt.handlerObject;
    portlet.zimlet = handler;
    if (handler) {
        handler.portletCreated(portlet);
    }
};
}
if (AjxPackage.define("zimbraMail.portal.view.ZmPortalView")) {
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
 * Creates the portal view.
 * @class
 * This class represents the portal view.
 * 
 * @param {DwtComposite}	container	the containing element
 * @param	{ZmPortalApp}	app			the application
 * @param	{DwtDropTarget}	dropTgt		the drop target
 * 
 * @extends		ZmListView
 */
ZmPortalView = function(parent, controller, dropTgt) {
	var headerList = this._getHeaderList();
	ZmListView.call(this, {parent:parent, className:"ZmPortalView",
						   posStyle:Dwt.ABSOLUTE_STYLE, view:ZmId.VIEW_PORTAL,
						   controller:controller, headerList:headerList, dropTgt:dropTgt});
    this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	this.setScrollStyle(Dwt.SCROLL);
}
ZmPortalView.prototype = new ZmListView;
ZmPortalView.prototype.constructor = ZmPortalView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmPortalView.prototype.toString = function() {
	return "ZmPortalView";
};

//
// Public methods
//

/**
 * Gets the portlet ids.
 * 
 * @return	{Array}		an array of portlet ids
 */
ZmPortalView.prototype.getPortletIds = function() {
    return this._portletIds || [];
};

//
// Protected methods
//

ZmPortalView.prototype._getHeaderList = function() {
    return [];
};

//ZmPortalView.prototype._initializeView = function() {
ZmPortalView.prototype.set = function() {
	if (this._rendered)  { 
		Dwt.setTitle(this.getTitle()); //bug:24787
		return;
	}
	var callback = new AjxCallback(this, this._initializeView2);
    appCtxt.getApp(ZmApp.PORTAL).getManifest(callback);
};

ZmPortalView.prototype._initializeView2 = function(manifest) {
    // layout view
    var portalDef = manifest && manifest.portal;
    if (portalDef) {
        this.getHtmlElement().innerHTML = portalDef.html || "";
    }

    // create portlets
    var portletMgr = appCtxt.getApp(ZmApp.PORTAL).getPortletMgr();
    this._portletIds = portletMgr.createPortlets();

	this._rendered = true;
};

/**
 * Gets the view title.
 * 
 * @return	{String}	the title
 */
ZmPortalView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this._controller.getApp().getDisplayName()].join(": ");
};
}
if (AjxPackage.define("zimbraMail.portal.view.ZmPortletView")) {
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
 * Creates the portlet view.
 * @class
 * This class represents the portlet view.
 * 
 * @param	{Element}		parentEl		the parent element
 * @param	{ZmPortlet}		portlet			the portlet
 * @param	{String}		className		the class name
 * 
 * @extends		DwtComposite
 */
ZmPortletView = function(parentEl, portlet, className) {
    className = className || "ZmPortlet";
    DwtComposite.call(this, {parent:DwtShell.getShell(window), className:className, posStyle:DwtControl.STATIC_STYLE});

    // save data
    this._portlet = portlet;
    this._portlet.view = this;

    this._contentsEl = this.getHtmlElement();
    if (parentEl) {
        parentEl.portlet = "loaded";
        parentEl.innerHTML = "";
        parentEl.appendChild(this._contentsEl);
    }

    // setup display
    this.setIcon(portlet.icon);
    this.setTitle(portlet.title);
    this.setContentUrl(portlet.actionUrl && portlet.actionUrl.target);
}
ZmPortletView.prototype = new DwtComposite;
ZmPortletView.prototype.constructor = ZmPortletView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmPortletView.prototype.toString = function() {
    return "ZmPortletView";
};

//
// Public methods
//

/**
 * Sets the icon.
 * 
 * @param	{String}	icon		the icon
 * 
 * @see		AjxImg.setImage
 */
ZmPortletView.prototype.setIcon = function(icon) {
    if (icon == null || !this._iconEl) return;
    AjxImg.setImage(this._iconEl, icon);
};

/**
 * Sets the title.
 * 
 * @param	{String}		title		the title
 */
ZmPortletView.prototype.setTitle = function(title) {
    if (title == null || !this._titleEl) return;
    this._titleEl.innerHTML = title;
};

ZmPortletView.prototype.setContent = function(content) {
    if (AjxUtil.isString(content)) {
        this._contentsEl.innerHTML = content;
    }
    else if (AjxUtil.ELEMENT_NODE) {
        this._contentsEl.innerHTML = "";
        this._contentsEl.appendChild(content);
    }
    else {
        this._contentsEl.innerHTML = AjxStringUtil.htmlEncode(String(content));
    }
};

/**
 * Sets the content URL as an iframe.
 * 
 * @param	{String}	url		the url
 */
ZmPortletView.prototype.setContentUrl = function(url) {
    if (!url) return;

    var props = this._portlet.properties;
    var func = AjxCallback.simpleClosure(ZmPortletView.__replaceProp, null, props);
    url = url.replace(ZmZimletContext.RE_SCAN_PROP, func);
    url = this._portlet.zimletCtxt ? this._portlet.zimletCtxt.makeURL({ target: url }, null, props) : url;
    var html = [
        "<iframe style='border:none;width:100%;height:100%' ",
            "src='",url,"'>",
        "</iframe>"
    ].join("");
    this.setContent(html);
};

//
// Private methods
//

ZmPortletView.__replaceProp = function(props, $0, $1, $2) {
    return props[$2];
};
}
}
