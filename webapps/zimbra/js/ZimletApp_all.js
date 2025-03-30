if (AjxPackage.define("ZimletApp")) {
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

if (AjxPackage.define("zimbraMail.share.controller.ZmZimletAppController")) {
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
 * @overview
 * This file defines a zimlet app controller.
 *
 */

/**
 * Creates a zimlet app controller.
 * @class
 * This class represents a zimlet application controller.
 * 
 * @param	{String}	name		the application name
 * @param	{DwtShell}	container	the container
 * @param	{ZmApp}		app			the app
 * 
 * @extends		ZmController
 */
ZmZimletAppController = function(name, container, app) {
	if (arguments.length == 0) { return; }
	ZmController.call(this, container, app);
	this._name = name;
};

ZmZimletAppController.prototype = new ZmController;
ZmZimletAppController.prototype.constructor = ZmZimletAppController;

ZmZimletAppController.prototype.isZmZimletAppController = true;
ZmZimletAppController.prototype.toString = function() { return "ZmZimletAppController"; };

//
// Public methods
//

// Note: If there's ever a need to make this a session controller (unlikely), we'll have to figure
// out some way to return an appropriate view type in a static context.
ZmZimletAppController.getDefaultViewType =
function() {
	return "zimlet";
};

ZmZimletAppController.prototype.getDefaultViewType =
function() {
	return this._name;
};

/**
 * Gets the view.
 * 
 * @return	{ZmZimletAppView}	the view
 */
ZmZimletAppController.prototype.getView =
function() {
	if (!this._view) {
		// create components
		this._view = new ZmZimletAppView(this._container, this);
		this._toolbar = new ZmToolBar({parent:DwtShell.getShell(window)});

		// setup app elements
		var elements = this.getViewElements(null, this._view, this._toolbar);


		// create callbacks
		var callbacks = {};
//		callbacks[ZmAppViewMgr.CB_PRE_HIDE] = new AjxCallback(this, this._preHideCallback);
//		callbacks[ZmAppViewMgr.CB_PRE_UNLOAD] = new AjxCallback(this, this._preUnloadCallback);
//		callbacks[ZmAppViewMgr.CB_POST_SHOW] = new AjxCallback(this, this._postShowCallback);
//		callbacks[ZmAppViewMgr.CB_POST_HIDE] = new AjxCallback(this, this._postHideCallback);

		// create app view
	    this._app.createView({	viewId:			this.getDefaultViewType(),
								elements:		elements,
								controller:		this,
								callbacks:		callbacks,
								isAppView:		true,
								isTransient:		false});
	}
	return this._view;
};

/**
 * Gets the toolbar.
 * 
 * @return	{ZmToolBar}	the tool bar
 */
ZmZimletAppController.prototype.getToolbar = function() {
	this.getView();
	return this._toolbar;
};

/**
 * Shows the controller.
 * 
 *@return boolean <code>true</code> if previous view was not dirty and hence could swap it with new view; else <code>false</code>
 */
ZmZimletAppController.prototype.show = function() {
	this.getView();
	return this._app.pushView(this.getDefaultViewType());
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmZimletAppView")) {
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
 * @extends		DwtComposite
 * @private
 */
ZmZimletAppView = function(parent, controller) {
	DwtComposite.call(this, {parent:parent, posStyle:DwtControl.ABSOLUTE_STYLE });
};
ZmZimletAppView.prototype = new DwtComposite;
ZmZimletAppView.prototype.constructor = ZmZimletAppView;

ZmZimletAppView.prototype.toString = function() {
	return "ZmZimletAppView";
};

//
// Public methods
//

ZmZimletAppView.prototype.setContent = function(html) {
	var el = this.getHtmlElement();
	el.innerHTML = html;
};

ZmZimletAppView.prototype.setView = function(view) {
	var el = this.getHtmlElement();
	el.innerHTML = "";
	view.reparent(this);
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmZimletApp")) {
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
 * @overview
 * This file defines a Zimlet Application.
 *
 */

/**
 * @class
 * This object represents a Zimlet Application.
 * 
 * @param	{String}	name		the application name
 * @param	{ZmZimlet}	zimlet		the zimlet
 * @param	{DwtControl}	container	the container
 * 
 * @extends	ZmApp
 */
ZmZimletApp = function(name, zimlet, container) {
	ZmApp.call(this, name, container);
	this._zimlet = zimlet;
};

ZmZimletApp.prototype = new ZmApp;
ZmZimletApp.prototype.constructor = ZmZimletApp;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmZimletApp.prototype.toString =
function() {
	return "ZmZimletApp";
};

//
// Public methods
//

/**
 * Gets the controller.
 * 
 * @return	{ZmZimletAppController}		the controller
 */
ZmZimletApp.prototype.getController =
function() {
	if (!this._controller) {
		this._controller = new ZmZimletAppController(this.getName(), this._container, this);
	}
	return this._controller;
};

/**
 * Gets the toolbar.
 * 
 * @return	{ZmToolbar}		the toolbar
 */
ZmZimletApp.prototype.getToolbar =
function() {
	return this.getController().getToolbar();
};

// convenience methods

/**
 * Sets the content on the view.
 * 
 * @param	{String}	html	the HTML content
 */
ZmZimletApp.prototype.setContent =
function(html) {
	this.getController().getView().setContent(html);
};

/**
 * Sets the view.
 * 
 * @param	{DwtComposite}	view	the view
 */
ZmZimletApp.prototype.setView =
function(view) {
	this.getController().getView().setView(view);
};

// ZmApp methods

/**
 * Launches the application.
 * 
 * @param	{Hash}			params			a hash of parameters
 * @param	{AjxCallback}	callback		the callback
 */
ZmZimletApp.prototype.launch =
function(params, callback) {
	var isNewViewShown = this.getController().show();
	if(!isNewViewShown) {
		return;
	}
	ZmApp.prototype.launch.call(this, params);
	if (this._zimlet.appLaunch) {
		this._zimlet.appLaunch(this.getName(), params);
	}
	if (callback) {
		callback.run();
	}
};

/**
 * Activates the application.
 * 
 * @param	{Boolean}	active	if <code>true</code>, active; <code>false</code> otherwise
 * @param	{String}	viewId	the view id
 */
ZmZimletApp.prototype.activate =
function(active, viewId) {
	ZmApp.prototype.activate.apply(this, arguments);
	if (this._zimlet.appActive) {
		this._zimlet.appActive(this.getName(), active);
	}
};

/**
 * Sets the overview tree to display overview content for this application.
 *
 * @param {Boolean}	reset		if <code>true</code>, clear the content first
 */
ZmZimletApp.prototype.setOverviewPanelContent =
function(reset) {
	if (reset) {
		this._overviewPanelContent = null;
		this._overviewContainer = null;
	}

	// only set overview panel content if not in full screen mode
	var avm = appCtxt.getAppViewMgr();
	if (!avm.isFullScreen()) {
		var components = {};
		components[ZmAppViewMgr.C_TREE] = this.getOverviewPanelContent();
		avm.setViewComponents(ZmAppViewMgr.APP, components, true, this.getName());
	}
};

}
}
