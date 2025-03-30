if (AjxPackage.define("PreferencesCore")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: PreferencesCore
 * 
 * Supports: Loading of identities and data sources
 * 
 * Loaded: When identities and/or data sources arrive in a GetInfoResponse
 */
if (AjxPackage.define("zimbraMail.prefs.model.ZmPrefPage")) {
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
 * Creates a preferences section. This is a "pseudo" organizer for
 * the preferences application tree view.
 * @constructor
 * @class
 * This class represents the preference page in the preferences application.
 * 
 * @param {Hash}	params    a hash of parameters
 * @param	{int}	     params.id			the numeric ID
 * @param	{String}	params.name		the name
 * @param	{ZmOrganizer}	params.parent		the parent folder
 * @param	{ZmTree}	params.tree		the tree model that contains this folder
 * @param	{String}	params.pageId		the ID of pref page
 * @param	{String}	params.icon		the icon name
 * @param	{String}	params.tooltip		the tool tip text
 * 
 * @extends		ZmOrganizer
 */
ZmPrefPage = function(params) {
	if (arguments.length == 0) { return; }
	params.type = params.type || ZmOrganizer.PREF_PAGE;
	ZmOrganizer.call(this, params);
	this.pageId = params.pageId;
	this.icon = params.icon;
	this.tooltip = params.tooltip;
};

ZmPrefPage.prototype = new ZmOrganizer;
ZmPrefPage.prototype.constructor = ZmPrefPage;

ZmPrefPage.prototype.toString = function() {
	return "ZmPrefPage";
};

//
// Constants
//

ZmOrganizer.ORG_CLASS[ZmId.ORG_PREF_PAGE] = "ZmPrefPage";

//
// Static functions
//

ZmPrefPage.createFromSection = function(section) {
	var overviewController = appCtxt.getOverviewController(); 
	var treeController = overviewController.getTreeController(ZmOrganizer.PREF_PAGE);
	var params = {
		id: ZmId.getPrefPageId(section.id),
		name: section.title,
		parent: null,
		tree: treeController.getDataTree(),
		icon: section.icon,
		tooltip: section.description
	};
	return new ZmPrefPage(params);
};

//
// Public methods
//

// ZmOrganizer methods

ZmPrefPage.prototype.getIcon = function() {
	return this.icon || "Preferences";
};

ZmPrefPage.prototype.getToolTip = function(force) {
	return this.tooltip || "";
};

}
if (AjxPackage.define("zimbraMail.prefs.model.ZmPersona")) {
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
 * Creates a personna.
 * @class
 * This class represents a personna.
 * 
 * @param	{ZmIdentity}		identity		the identity
 * @param	{Object}		list		the list
 * @extends		ZmAccount
 */
ZmPersona = function(identity, list) {
	if (arguments.length == 0) { return; }
	
	ZmAccount.call(this, ZmAccount.TYPE_PERSONA, identity.id, null, list);

	identity.sendFromDisplay = identity.sendFromDisplay || appCtxt.get(ZmSetting.DISPLAY_NAME);
	identity.sendFromAddress = identity.sendFromAddress || appCtxt.get(ZmSetting.USERNAME);
    identity.sendFromAddressType = identity.sendFromAddressType || ZmSetting.SEND_AS;
	this.identity = identity;
};
ZmPersona.prototype = new ZmAccount;
ZmPersona.prototype.constructor = ZmPersona;

ZmPersona.prototype.toString =
function() {
	return "ZmPersona";
};


//
// Public methods
//

ZmPersona.prototype.setName =
function(name) {
	this.getIdentity().name = AjxStringUtil.htmlEncode(name);
};

ZmPersona.prototype.getName =
function() {
	return AjxStringUtil.htmlDecode(this.getIdentity().name);
};

ZmPersona.prototype.setEmail =
function(email) {
	this.getIdentity().sendFromAddress = email;
};

ZmPersona.prototype.getEmail =
function() {
	return this.getIdentity().sendFromAddress;
};

ZmPersona.prototype.getIdentity =
function() {
	return this.identity;
};

ZmPersona.prototype.create =
function(callback, errorCallback, batchCmd) {
	return this.getIdentity().create(callback, errorCallback, batchCmd);
};

ZmPersona.prototype.save =
function(callback, errorCallback, batchCmd) {
	return this.getIdentity().save(callback, errorCallback, batchCmd);
};

ZmPersona.prototype.doDelete = 
function(callback, errorCallback, batchCmd) {
	return this.getIdentity().doDelete(callback, errorCallback, batchCmd);
};
}

if (AjxPackage.define("zimbraMail.prefs.controller.ZmPrefPageTreeController")) {
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

/**
 * Creates a preferences page tree controller.
 * @class
 * This class represents the preferences page tree controller.
 * 
 * @extends		ZmTreeController
 */
ZmPrefPageTreeController = function() {
	ZmTreeController.apply(this, arguments);
};
ZmPrefPageTreeController.prototype = new ZmTreeController;
ZmPrefPageTreeController.prototype.constructor = ZmPrefPageTreeController;

ZmPrefPageTreeController.prototype.toString =
function() {
	return "ZmPrefPageTreeController";
};

//
// Public methods
//

ZmPrefPageTreeController.prototype.show =
function(params) {
	// populate tree
	var app = appCtxt.getApp(ZmApp.PREFERENCES);
	var view = app.getPrefController().getPrefsView();
	var account = params.account;

	if (appCtxt.multiAccounts && !this._currentAccount) {
		this._currentAccount = account;
	}

	var tree = new ZmTree(ZmOrganizer.PREF_PAGE);
	var root = tree.root = new ZmPrefPage({id:ZmId.getPrefPageId(0), name:"", tree:tree});
	appCtxt.cacheSet(root.id, root);

	// create pseudo-organizers
	var organizers = [];
	var count = view.getNumTabs();
	for (var i = 0; i < count; i++) {
		var tabKey = i+1;
		var name = view.getTabTitle(tabKey);
		var section = view.getSectionForTab(tabKey);
		if (!account || this._showSection(account, section.id)) {
			// for multi-account mbox, child accounts only show a select few pref options
			var organizer = ZmPrefPage.createFromSection(section);
			organizer.pageId = tabKey;
			organizer.account = account;
			organizers.push(organizer);
		}
	}

	// order pages
	for (var i = 0; i < organizers.length; i++) {
		var organizer = organizers[i];
		var section = view.getSectionForTab(organizer.pageId);
		var parentId = section.parentId;
		if (appCtxt.isOffline &&
			(section.id == "SIGNATURES" ||
			 section.id == "ACCOUNTS" ||
			 section.id == "COMPOSING" ||
			 section.id == "FILTERS"))
		{
			parentId = null;
		}
		var parent = (parentId && tree.getById(ZmId.getPrefPageId(parentId))) || root;
		parent.children.add(organizer);

		organizer.parent = parent;
		organizer.icon = section.icon || parent.getIcon();
	}

	appCtxt.setTree(tree.type, tree, account);

	// setup tree view
	var treeView = ZmTreeController.prototype.show.apply(this, arguments);

	if (!appCtxt.multiAccounts || (appCtxt.multiAccounts && account.isMain)) {
		var page1 = root.children.get(0);
		if (page1) {
			treeView.setSelected(page1, true);
		}
	}
	if (!appCtxt.isOffline) {
		var hi = treeView.getHeaderItem();
		if (hi) {
			hi.setExpanded(true, true);
		}
	}
	treeView.addSelectionListener(new AjxListener(this, this._handleTreeItemSelection, view));

	return treeView;
};

ZmPrefPageTreeController.prototype._showSection =
function(account, sectionId) {

	if (appCtxt.isOffline) {
		if (sectionId == "MOBILE") {
			return false;
		}

		if (account.isMain) {
			if (sectionId == "FILTERS" ||
				sectionId == "SHARING" ||
				sectionId == "SIGNATURES" ||
				sectionId == "ACCOUNTS" ||
                sectionId == "NOTIFICATIONS" ||
                sectionId == "TRUSTED_ADDR")
			{
				return false;
			}
		}
		else {
			if (sectionId == "COMPOSING") {
				return false;
			}
			if (!account.isZimbraAccount &&
				(sectionId == "MAIL" ||
				 sectionId == "SHARING" ||
				 sectionId == "CALENDAR" ||
                 sectionId == "NOTIFICATIONS" ||
                 sectionId == "TRUSTED_ADDR" ))
			{
				return false;
			}
		}

	}

	return (account.isMain ||
			(!account.isMain && (sectionId != "GENERAL" &&
								 sectionId != "SHORTCUTS" &&
								 sectionId != "PREF_ZIMLETS" &&
                                 sectionId != "BACKUP" &&
								 sectionId != "COMPOSING")
			));
};

//
// Protected methods
//

// ZmTreeController methods

ZmPrefPageTreeController.prototype._dragListener =
function(ev) {
	ev.operation = Dwt.DND_DROP_NONE;
};

ZmPrefPageTreeController.prototype._dropListener =
function(ev) {
	ev.doIt = false;
};

// handlers

ZmPrefPageTreeController.prototype._handleTreeItemSelection =
function(tabView, ev) {
	if (ev.detail != DwtTree.ITEM_SELECTED || ev.handled) { return; }

	var organizer = ev.item.getData(Dwt.KEY_OBJECT);
	tabView.switchToTab(organizer && organizer.pageId);
};

ZmPrefPageTreeController.prototype._handleMultiAccountItemSelection =
function(ev, overview, treeItem, item) {
	if (this._currentAccount != item.account) {
		var prefsController = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController();
		var prefsView = prefsController.getPrefsView();

		this._currentAccount = prefsController._activeAccount = item.account;

		if (prefsView.getChangedPrefs(true, true)) {
			ev.handled = true;

			var dialog = appCtxt.getYesNoCancelMsgDialog();
			var args = [ev, overview, treeItem, item, prefsController, dialog];
			var yesCallback = new AjxCallback(this, this._savePrefsYes, args);
			var noCallback = new AjxCallback(this, this._savePrefsNo, args);
			var cancelCallback = new AjxCallback(this, this._savePrefsCancel, dialog);

			dialog.reset();
			dialog.setMessage(ZmMsg.confirmExitPreferencesChangeAcct, DwtMessageDialog.WARNING_STYLE);
			dialog.registerCallback(DwtDialog.YES_BUTTON, yesCallback, this);
			dialog.registerCallback(DwtDialog.NO_BUTTON, noCallback, this);
			dialog.registerCallback(DwtDialog.CANCEL_BUTTON, cancelCallback, this);
			dialog.popup();
			return;
		}
		else {
			prefsView.resetOnAccountChange();
		}
	}

	ev.handled = false;
	this._handleItemSelection(ev, overview, treeItem, item);
};

ZmPrefPageTreeController.prototype._savePrefsYes =
function(ev, overview, treeItem, item, prefsController, dialog) {
	dialog.popdown();

	var callback = new AjxCallback(this, this._continueTreeItemSelection, [ev, overview, treeItem, item, prefsController]);
	prefsController.save(callback, true);
};

ZmPrefPageTreeController.prototype._savePrefsNo =
function(ev, overview, treeItem, item, prefsController, dialog) {
	dialog.popdown();

	prefsController.getPrefsView().reset();
	this._continueTreeItemSelection(ev, overview, treeItem, item, prefsController);
};

ZmPrefPageTreeController.prototype._savePrefsCancel =
function(dialog) {
	dialog.popdown();
};

ZmPrefPageTreeController.prototype._continueTreeItemSelection =
function(ev, overview, treeItem, item, prefsController) {
	prefsController.getPrefsView().resetOnAccountChange();

	this._handleItemSelection(ev, overview, treeItem, item);
	prefsController.getPrefsView().switchToTab(item.pageId);
};
}

if (AjxPackage.define("ajax.dwt.widgets.DwtCalendar")) {
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
 * Creates a calendar widget
 * @constructor
 * @class
 * This class provides a calendar view.
 *
 * @author Ross Dargahi
 * @author Roland Schemers
 *
 * @param {hash}		params			a hash of parameters
 * @param {DwtComposite}      params.parent			the parent widget
 * @param {string}      params.className			the CSS class
 * @param {constant}      params.posStyle			the positioning style (see {@link Dwt})
 * @param {constant}     [params.firstDayOfWeek=DwtCalendar.SUN]		the first day of the week
 * @param {boolean}	[params.forceRollOver=true] 	if <code>true</code>, then clicking on (or setting) the widget to a 
 *												date that is not part of the current month (i.e. one of 
 *												the grey prev or next month days) will result in the 
 *												widget rolling 	the date to that month.
 * @param {array}      params.workingDays		a list of days that are work days. This array assumes that
 * 												index 0 is Sunday. Defaults to Mon-Fri being work days.
 * @param {boolean}      params.hidePrevNextMo 	a flag indicating whether widget should hide days of the 
 *												previous/next month
 * @param {boolean}      params.readOnly 		a flag indicating that this widget is read-only (should not 
 *												process events such as mouse clicks)
 * @param {boolean}      params.showWeekNumber	a flag indicating whether widget should show week number
 *        
 * @extends		DwtComposite
 */
DwtCalendar = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtCalendar.PARAMS);
	params.className = params.className || "DwtCalendar";
	DwtComposite.call(this, params);

	this._skipNotifyOnPage = false;
	this._hidePrevNextMo = params.hidePrevNextMo;
	this._readOnly = params.readOnly;
	this._showWeekNumber = params.showWeekNumber;
	this._uuid = Dwt.getNextId();
	var cn = this._origDayClassName = params.className + "Day";
	this._todayClassName = " " + params.className + "Day-today";
	this._selectedDayClassName = " " + cn + "-" + DwtCssStyle.SELECTED;
	this._hoveredDayClassName = " " + cn + "-" + DwtCssStyle.HOVER;
	this._activeDayClassName = " " + cn + "-" + DwtCssStyle.ACTIVE;
	this._hiliteClassName = " " + cn + "-hilited";
	this._greyClassName = " " + cn + "-grey";
	
	if (!this._readOnly) {
		this._installListeners();
	}

	this._selectionMode = DwtCalendar.DAY;
	
	this._init();

	this._weekDays = new Array(7);
	this._workingDays = params.workingDays || DwtCalendar._DEF_WORKING_DAYS;
    this._useISO8601WeekNo = params.useISO8601WeekNo;
	this.setFirstDayOfWeek(params.firstDayOfWeek || DwtCalendar.SUN);
	
	this._forceRollOver = (params.forceRollOver !== false);
};

DwtCalendar.PARAMS = ["parent", "className", "posStyle", "firstDayOfWeek", "forceRollOver",
					  "workingDaysArray", "hidePrevNextMo", "readOnly"];

DwtCalendar.prototype = new DwtComposite;
DwtCalendar.prototype.constructor = DwtCalendar;

/**
 * Sunday.
 */
DwtCalendar.SUN = 0;
/**
 * Monday.
 */
DwtCalendar.MON = 1;
/**
 * Tuesday.
 */
DwtCalendar.TUE = 2;
/**
 * Wednesday.
 */
DwtCalendar.WED = 3;
/**
 * Thursday.
 */
DwtCalendar.THU = 4;
/**
 * Friday.
 */
DwtCalendar.FRI = 5;
/**
 * Saturday.
 */
DwtCalendar.SAT = 6;

// Selection modes
/**
 * Defines the "day" selection mode.
 */
DwtCalendar.DAY = 1;
/**
 * Defines the "week" selection mode.
 */
DwtCalendar.WEEK = 2;
/**
 * Defines the "work week" selection mode.
 */
DwtCalendar.WORK_WEEK = 3;
/**
 * Defines the "month" selection mode.
 */
DwtCalendar.MONTH = 4;

DwtCalendar.RANGE_CHANGE = "DwtCalendar.RANGE_CHANGE";

DwtCalendar._FULL_WEEK = [1, 1, 1, 1, 1, 1, 1];
DwtCalendar._DEF_WORKING_DAYS = [0, 1, 1, 1, 1, 1, 0];
DwtCalendar._DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

DwtCalendar._NO_MONTH = -2;
DwtCalendar._PREV_MONTH = -1;
DwtCalendar._THIS_MONTH = 0;
DwtCalendar._NEXT_MONTH = 1;

DwtCalendar._NORMAL = 1;
DwtCalendar._HOVERED = 2;
DwtCalendar._ACTIVE = 3;
DwtCalendar._SELECTED = 4;
DwtCalendar._DESELECTED = 5;

DwtCalendar.DATE_SELECTED 		= 1;
DwtCalendar.DATE_DESELECTED 	= 2;
DwtCalendar.DATE_DBL_CLICKED 	= 3;

DwtCalendar._LAST_DAY_CELL_IDX = 41;

DwtCalendar._BUTTON_CLASS = "DwtCalendarButton";
DwtCalendar._BUTTON_HOVERED_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.HOVER;
DwtCalendar._BUTTON_ACTIVE_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.ACTIVE;

DwtCalendar._TITLE_CLASS = "DwtCalendarTitle";
DwtCalendar._TITLE_HOVERED_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.HOVER;
DwtCalendar._TITLE_ACTIVE_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.ACTIVE;

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtCalendar.prototype.toString = 
function() {
	return "DwtCalendar";
};

/**
 * Adds a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.addSelectionListener = 
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.removeSelectionListener = 
function(listener) { 
	this.removeListener(DwtEvent.SELECTION, listener);
};

/**
 * Adds an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.addActionListener = 
function(listener) {
	this.addListener(DwtEvent.ACTION, listener);
};

/**
 * Removes an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.removeActionListener = 
function(listener) { 
	this.removeListener(DwtEvent.ACTION, listener);
};

/**
 * Adds a date range listener. Date range listeners are called whenever the date range of the calendar
 * changes (i.e. when it rolls over due to a programatic action via {@link #setDate} or
 * via user selection).
 *
 * @param 	{AjxListener}		listener		the listener
 */
DwtCalendar.prototype.addDateRangeListener = 
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
};

/**
 * Removes a date range listener.
 * 
 * @param 	{AjxListener}		listener		the listener
 */
DwtCalendar.prototype.removeDateRangeListener = 
function(listener) { 
	this.removeListener(DwtEvent.DATE_RANGE, listener);
};

/**
 * Sets the skip notify on page. This method notify (or not) selection when paging arrow buttons
 * are clicked.
 *
 * @param	{boolean}	skip		if <code>true</code>, do not notify selection
 */
DwtCalendar.prototype.setSkipNotifyOnPage = 
function(skip) {
	this._skipNotifyOnPage = skip;
};

/**
 * Gets the skip notify on page setting.
 * 
 * @return	{boolean}	<code>true</code>, do not notify selection
 */
DwtCalendar.prototype.getSkipNotifyOnPage = 
function() {
	return this._skipNotifyOnPage;
};

/**
 * Sets the date.
 * 
 * @param	{Date}	date	the date
 * @param	{boolean}	skipNotify		if <code>true</code>, do not notify selection
 * @param {boolean}	forceRollOver 	if <code>true</code>, then clicking on (or setting) the widget to a 
 *												date that is not part of the current month (i.e. one of 
 *												the grey prev or next month days) will result in the 
 *												widget rolling 	the date to that month.
 * @param	{boolean}	dblClick		if <code>true</code>, require a double click
 */
DwtCalendar.prototype.setDate =
function(date, skipNotify, forceRollOver, dblClick) {

	forceRollOver = (forceRollOver == null) ? this._forceRollOver : forceRollOver;
	
	// Check if the date is available for selection. Basically it is unless we are in
	// work week selection mode and <date> is not a working day
	//if (this._selectionMode == DwtCalendar.WORK_WEEK && !this._currWorkingDays[date.getDay()])
	//	return false;

	if(!date) {
		date = new Date();
	}
	var newDate = new Date(date.getTime());
	var oldDate = this._date;

	var layout = false;
	var notify = false;
	var cellId;

	if (this._date2CellId != null) {
		var idx = (newDate.getFullYear() * 10000) + (newDate.getMonth() * 100) + newDate.getDate();
		var cellId = this._date2CellId[idx];
		
		if (cellId) {
		 	if (cellId == this._selectedCellId)
		 		notify = true;

			var cell = document.getElementById(cellId);
			if (cell._dayType == DwtCalendar._THIS_MONTH)
				notify = true;
			else if (forceRollOver)
				notify = layout = true;
			else
				notify = true;
		} else {
			 notify = layout = true;
		}
	} else {
		notify = layout = true;
	}

	// update before layout, notify after layout
	if (notify) {
		if (this._date){
			// 5/13/2005 EMC -- I'm not sure why this was setting the hours to 0.
			// I think it should respect what the user passed in, and only change
			// the parts of the date that it is responsible for.
			//newDate.setHours(0,0,0,0);
			//handle daylight saving
			if(AjxDateUtil.isDayShifted(newDate)) {
				AjxDateUtil.rollToNextDay(newDate);
			}
			newDate.setHours(this._date.getHours(), this._date.getMinutes(), this._date.getSeconds(), 0);            
		}

		this._date = newDate;
		if (!layout && !this._readOnly) {
			this._setSelectedDate();
			this._setToday();
		}
	}

	if (layout) {
		this._layout();
	}

	if (notify && !skipNotify) {
		var type = dblClick ? DwtCalendar.DATE_DBL_CLICKED : DwtCalendar.DATE_SELECTED;
		this._notifyListeners(DwtEvent.SELECTION, type, this._date);
	}
	
	return true;
};

/**
 * Checks if the cell is selected.
 * 
 * @param	{string}	cellId			the cell id	
 * @return	{boolean}	<code>true</code> if the cell is the selected day
 */
DwtCalendar.prototype.isSelected =
function(cellId) {
	// if cellId is the selected day, then return true, else if we are NOT in
	// day selection mode (i.e. week/work week) then compute the row and index
	// of cellId and look it up in the week array to see if it is a selectable day
	if (cellId == this._selectedDayElId) {
		return true;
	} else if (this._selectionMode != DwtCalendar.DAY) {
		// If the cell is in the same row as the currently selected cell and it
		// is a selectable day (i.e. a working day in the case of work week),
		// then say it is selected
		var cellIdx = this._getDayCellIndex(cellId);
		if (Math.floor(cellIdx / 7) == Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7)
			&& this._currWorkingDays[cellIdx % 7])
			return true;
	}
	return false;
};

/**
 * Gets the force roll over setting. Force roll over is occurs when a date that
 * is not part of the current month (i.e. one of the grey prev or next month
 * days) will result in the widget rolling 	the date to that month.
 * 
 * @return	{boolean}	<code>true</code> if force roll over is set
 */
DwtCalendar.prototype.getForceRollOver =
function() {
	return this._forceRollOver;
};

/**
 * Sets the force roll over setting. Force roll over is occurs when a date that
 * is not part of the current month (i.e. one of the grey prev or next month
 * days) will result in the widget rolling 	the date to that month.
 * 
 * @param	{boolean}	force		if <code>true</code>, force roll over
 */
DwtCalendar.prototype.setForceRollOver =
function(force) {
	if (force == null) { return; }
	
	if (this._forceRollOver != force) {
		this._forceRollOver = force;
		this._layout();
	}
};

/**
 * Gets the selection mode.
 * 
 * @return	{constant}		the selection mode
 */
DwtCalendar.prototype.getSelectionMode =
function() {
	return this._selectionMode;
};

/**
 * Sets the selection mode.
 * 
 * @return	{constant}		selectionMode		the selection mode
 */
DwtCalendar.prototype.setSelectionMode =
function(selectionMode) {
	if (this._selectionMode == selectionMode) { return; }

	this._selectionMode = selectionMode;
	if (selectionMode == DwtCalendar.WEEK) {
		this._currWorkingDays = DwtCalendar._FULL_WEEK;
	} else if (selectionMode == DwtCalendar.WORK_WEEK) {
		this._currWorkingDays = this._workingDays;
	}

	this._layout();
};

/**
 * Sets the working week.
 * 
 * @param	{array}	workingDaysArray		an array of days
 */
DwtCalendar.prototype.setWorkingWeek =
function(workingDaysArray) {
	// TODO Should really create a copy of workingDaysArray
	this._workingDays = this._currWorkingDays = workingDaysArray;
	
	if (this._selectionMode == DwtCalendar.WORK_WEEK) {
		DBG.println("FOO!!!");
		this._layout();
	}
};

/**
 * Enables/disables the highlight (i.e. "bolding") on the dates in <code>&lt;dates&gt;</code>.
 *
 * @param {object} dates associative array of {@link Date} objects for
 * which to enable/disable highlighting
 * @param {boolean}	enable 	if <code>true</code>, enable highlighting
 * @param {boolean}	clear 	if <code>true</code>, clear current highlighting
 */
DwtCalendar.prototype.setHilite =
function(dates, enable, clear) {
	if (this._date2CellId == null) { return; }

	var cell;
	var aDate;
	if (clear) {
		for (aDate in this._date2CellId) {
			cell = document.getElementById(this._date2CellId[aDate]);
			if (cell._isHilited) {
				cell._isHilited = false;
				this._setClassName(cell, DwtCalendar._NORMAL);
			}	
		}
	}

	var cellId;
	for (var i in dates) {
        // NOTE: Protect from prototype extensions.
        if (dates.hasOwnProperty(i)) {
            aDate = dates[i];
            cellId = this._date2CellId[aDate.getFullYear() * 10000 + aDate.getMonth() * 100 + aDate.getDate()];

            if (cellId) {
                cell = document.getElementById(cellId);
                if (cell._isHilited != enable) {
                    cell._isHilited = enable;
                    this._setClassName(cell, DwtCalendar._NORMAL);
                }
            }
        }
	}
};

/**
 * Gets the date.
 * 
 * @return	{Date}	the date
 */
DwtCalendar.prototype.getDate =
function() {
	return this._date;
};

/**
 * Sets the first date of week.
 * 
 * @param	{constant}		firstDayOfWeek		the first day of week
 */
DwtCalendar.prototype.setFirstDayOfWeek =
function(firstDayOfWeek) {
	for (var i = 0; i < 7; i++) {
		this._weekDays[i] = (i < firstDayOfWeek)
			? (6 - (firstDayOfWeek -i - 1))
			: (i - firstDayOfWeek);

		var dowCell = document.getElementById(this._getDOWCellId(i));
		dowCell.innerHTML = AjxDateUtil.WEEKDAY_SHORT[(firstDayOfWeek + i) % 7];
	}
    this._firstDayOfWeek = firstDayOfWeek
	this._layout();
};

/**
 * Gets the date range.
 * 
 * @return	{Object}		the range (<code>range.start</code> and <code>range.end</code>)
 */
DwtCalendar.prototype.getDateRange =
function () {
	return this._range;
};

DwtCalendar.prototype._getDayCellId =
function(cellId) {
	return ("c:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getDayCellIndex =
function(cellId) {
	return cellId.substring(2, cellId.indexOf(":", 3));
};

DwtCalendar.prototype._getDOWCellId =
function(cellId) {
	return ("w:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getWeekNumberCellId =
function(cellId) {
	return ("k:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getDaysInMonth =
function(mo, yr) {
	/* If we are not dealing with Feb, then simple lookup
	 * Leap year rules
	 *  1. Every year divisible by 4 is a leap year.
	 *  2. But every year divisible by 100 is NOT a leap year
	 *  3. Unless the year is also divisible by 400, then it is still a leap year.*/
	if (mo != 1) {
		return DwtCalendar._DAYS_IN_MONTH[mo];
	}

	if (yr % 4 != 0 || (yr % 100 == 0 && yr % 400 != 0)) {
		return 28;
	}

	return 29;
};

DwtCalendar.prototype._installListeners =
function() {
	this._setMouseEventHdlrs();
	this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));
	this.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this._mouseOutListener));
	this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
	this.addListener(DwtEvent.ONMOUSEUP, new AjxListener(this, this._mouseUpListener));
	this.addListener(DwtEvent.ONDBLCLICK, new AjxListener(this, this._doubleClickListener));
};

DwtCalendar.prototype._notifyListeners =
function(eventType, type, detail, ev) {
	if (!this.isListenerRegistered(eventType)) { return; }

	var selEv = DwtShell.selectionEvent;
	if (ev) {
		DwtUiEvent.copy(selEv, ev);
	} else {
		selEv.reset();
	}
	selEv.item = this;
	selEv.detail = detail;
	selEv.type = type;
	this.notifyListeners(eventType, selEv);
};

DwtCalendar.prototype._layout =
function() {
	if (this._date == null) { this._date = new Date(); }

	if (!this._calWidgetInited) {
		this._init();
	}

	var date = new Date(this._date.getTime());
	date.setDate(1);
	var year = date.getFullYear();
	var month  = date.getMonth();
	var firstDay = date.getDay();
	var daysInMonth = this._getDaysInMonth(month, year);
	var day = 1;
	var nextMoDay = 1;

	this._date2CellId = new Object();
	this._selectedDayElId = null;

	// Figure out how many days from the previous month we have to fill in
	// (see comment below)
	var lastMoDay, lastMoYear, lastMoMonth, nextMoMonth, nextMoYear;
	if (!this._hidePrevNextMo) {
		if (month != 0) {
			lastMoDay = this._getDaysInMonth(month - 1, year) - this._weekDays[firstDay] + 1;
			lastMoYear = year;
			lastMoMonth = month - 1;
			if (month != 11) {
				nextMoMonth = month + 1;
				nextMoYear = year;
			} else {
				nextMoMonth = 0;
				nextMoYear = year + 1;
			}
		} else {
			lastMoDay = this._getDaysInMonth(11, year - 1) - this._weekDays[firstDay] + 1;
			lastMoYear = year - 1;
			lastMoMonth = 11;
			nextMoMonth = 1;
			nextMoYear = year;
		}
	}

	for (var i = 0; i < 6; i++) {
		for (var j = 0; j < 7; j++) {
			var dayCell = document.getElementById(this._getDayCellId(i * 7 + j));

			if (dayCell._isHilited == null) {
				dayCell._isHilited = false;
			}

			if (day <= daysInMonth) {
				/* The following if statement deals with the first day of this month not being
				 * the first day of the week. In this case we must fill the preceding days with
				 * the final days of the previous month */
				if (i != 0 || j >= this._weekDays[firstDay]) {
					this._date2CellId[(year * 10000) + (month * 100) + day] = dayCell.id;
					dayCell._day = day;
					dayCell._month = month;
					dayCell._year = year;
					dayCell.innerHTML = day++;
					dayCell._dayType = DwtCalendar._THIS_MONTH;
					if (this._readOnly) {
						dayCell.style.fontFamily = "Arial";
						dayCell.style.fontSize = "10px";
					}
				} else {
					if (this._hidePrevNextMo) {
						dayCell.innerHTML = "";
					} else {
						this._date2CellId[(lastMoYear * 10000) + (lastMoMonth * 100) + lastMoDay] = dayCell.id;
						dayCell._day = lastMoDay;
						dayCell._month = lastMoMonth;
						dayCell._year = lastMoYear;
						dayCell.innerHTML = lastMoDay++;
						dayCell._dayType = DwtCalendar._PREV_MONTH;
					}
				}
			} else if (!this._hidePrevNextMo) {
				// Fill any remaining slots with days from next month
				this._date2CellId[(nextMoYear * 10000) + (nextMoMonth * 100) + nextMoDay] = dayCell.id;
				dayCell._day = nextMoDay;
				dayCell._month = nextMoMonth;
				dayCell._year = nextMoYear;
				dayCell.innerHTML = nextMoDay++;
				dayCell._dayType = DwtCalendar._NEXT_MONTH;
			}
			this._setClassName(dayCell, DwtCalendar._NORMAL);
		}

		if (this._showWeekNumber) {
			var kwCellId = this._getWeekNumberCellId('kw' + i * 7);
			var kwCell = document.getElementById(kwCellId);
			if (kwCell) {
				var firstDayCell = document.getElementById(this._getDayCellId(i * 7));
				kwCell.innerHTML = AjxDateUtil.getWeekNumber(new Date(firstDayCell._year, firstDayCell._month, firstDayCell._day), this._firstDayOfWeek, null, this._useISO8601WeekNo);
			}
		}
	}

	this._setTitle(month, year);

	// Compute the currently selected day
	if (!this._readOnly) {
		this._setSelectedDate();
		this._setToday();
	}
	
	this._setRange();
};

DwtCalendar.prototype._setRange =
function() {
	var cell = document.getElementById(this._getDayCellId(0));
	var start = new Date(cell._year, cell._month, cell._day, 0, 0, 0, 0);

	cell = document.getElementById(this._getDayCellId(DwtCalendar._LAST_DAY_CELL_IDX));
	
	var daysInMo = this._getDaysInMonth(cell._month, cell._year);
	var end;
	if (cell._day < daysInMo) {
		end = new Date(cell._year, cell._month, cell._day + 1, 0, 0, 0, 0);
	} else if (cell._month < 11) {
		end = new Date(cell._year, cell._month + 1, 1, 0, 0, 0, 0);
	} else {
		end = new Date(cell._year + 1, 0, 1, 0, 0, 0, 0);
	}

	if (this._range == null) {
		this._range = {};
	} else if (this._range.start.getTime() == start.getTime() && this._range.end.getTime() == end.getTime()) {
		return false;
	}

	this._range.start = start;
	this._range.end = end;

	// Notify any listeners
	if (!this.isListenerRegistered(DwtEvent.DATE_RANGE)) { return; }

	if (!this._dateRangeEvent) {
		this._dateRangeEvent = new DwtDateRangeEvent(true);
	}

	this._dateRangeEvent.item = this;
	this._dateRangeEvent.start = start;
	this._dateRangeEvent.end = end;
	this.notifyListeners(DwtEvent.DATE_RANGE, this._dateRangeEvent);
};

DwtCalendar.prototype._setToday =
function() {
	var cell;
	var today = new Date();
	var todayDay = today.getDate();

	if (!this._todayDay || this._todayDay != todayDay) {
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = false;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}

		this._todayCellId = this._date2CellId[(today.getFullYear() * 10000) + (today.getMonth() * 100) + todayDay];
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = true;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}
	}
};

DwtCalendar.prototype._setSelectedDate =
function() {
	var day = this._date.getDate();
	var month = this._date.getMonth();
	var year = this._date.getFullYear();
	var cell;

	if (this._selectedDayElId) {
		cell = document.getElementById(this._selectedDayElId);
		this._setClassName(cell, DwtCalendar._DESELECTED);
	}

	var cellId = this._date2CellId[(year * 10000) + (month * 100) + day];
	cell = document.getElementById(cellId);
	this._selectedDayElId = cellId;
	this._setClassName(cell, DwtCalendar._SELECTED);
};

DwtCalendar.prototype._setCellClassName = 
function(cell, className, mode) {
	if (cell._dayType != DwtCalendar._THIS_MONTH) {
		className += this._greyClassName;
	}

	if (this._selectionMode == DwtCalendar.DAY &&
		cell.id == this._selectedDayElId &&
		mode != DwtCalendar._DESELECTED)
	{
		className += this._selectedDayClassName;
	}
	else if (this._selectionMode != DwtCalendar.DAY &&
			 mode != DwtCalendar._DESELECTED &&
			 this._selectedDayElId != null)
	{
		var idx = this._getDayCellIndex(cell.id);
		if (Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) == Math.floor(idx / 7) &&
			this._currWorkingDays[idx % 7])
		{
			className += this._selectedDayClassName;
		}
	}

	if (cell._isHilited) {
		className += this._hiliteClassName;
	}

	if (cell._isToday) {
		className += this._todayClassName;
	}

	return className;
};

DwtCalendar.prototype._setClassName = 
function(cell, mode) {
	var className = "";
	
	if (mode == DwtCalendar._NORMAL) {
		className = this._origDayClassName;
	} else if (mode == DwtCalendar._HOVERED) {
		className = this._hoveredDayClassName;
	} else if (mode == DwtCalendar._ACTIVE) {
		className = this._activeDayClassName;
	} else if (mode == DwtCalendar._DESELECTED && this._selectionMode == DwtCalendar.DAY) {
		className = this._origDayClassName;
	} else if (this._selectionMode != DwtCalendar.DAY &&
			(mode == DwtCalendar._SELECTED || mode == DwtCalendar._DESELECTED))
	{
		// If we are not in day mode, then we need to highlite multiple cells
		// e.g. the whole week if we are in week mode
		var firstCellIdx = Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) * 7;

		for (var i = 0; i < 7; i++) {
			className = this._origDayClassName;
			var aCell = document.getElementById(this._getDayCellId(firstCellIdx++));
			aCell.className = this._setCellClassName(aCell, className, mode);
		}
		return;
	}

	cell.className = this._setCellClassName(cell, className, mode);
};

DwtCalendar.prototype._setTitle =
function(month, year) {
	var cell = document.getElementById(this._monthCell);
	var formatter = DwtCalendar.getMonthFormatter();
	var date = new Date(year, month);
	cell.innerHTML = formatter.format(date);
};

DwtCalendar.prototype._init =
function() {
	var html = new Array(100);
	var idx = 0;
	this._monthCell = "t:" + this._uuid;

	// Construct the header row with the prev/next year and prev/next month
	// icons as well as the month/year title cell
	html[idx++] =	"<table role='presentation' width=100%>";
	html[idx++] =		"<tr><td class='DwtCalendarTitlebar'>";
	html[idx++] =			"<table role='presentation'>";
	html[idx++] =				"<tr>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:py:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FastRevArrowSmall", null, ["id='b:py:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:pm:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("RevArrowSmall", null, ["id='b:pm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td class='DwtCalendarTitleCell' 'nowrap' style='width: 60%'><span class='";
	html[idx++] =						DwtCalendar._TITLE_CLASS;
	html[idx++] = 						"' id='";
	html[idx++] =						this._monthCell;
	html[idx++] =					"'></span></td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:nm:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FwdArrowSmall", null, ["id='b:nm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:ny:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FastFwdArrowSmall", null, ["id='b:ny:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =				"</tr>";
	html[idx++] =			"</table>";
	html[idx++] =		"</td></tr>";
	html[idx++] =	"<tr><td class='DwtCalendarBody'>";
	html[idx++] =		"<table role='presentation' width='100%' style='border-collapse:separate;' cellspacing='0'>";
	html[idx++] =			"<tr>";

	if (this._showWeekNumber) {
		html[idx++] = "<td class='DwtCalendarWeekNoTitle' width='14%' id='";
		html[idx++] = this._getWeekNumberCellId('kw');
		html[idx++] = "'>";
		html[idx++] = AjxMsg.calendarWeekTitle;
		html[idx++] = "</td>";
	}

	for (var i = 0; i < 7; i++) {
		html[idx++] = "<td class='DwtCalendarDow' width='";
		html[idx++] = (i < 5 ? "14%" : "15%");
		html[idx++] = "' id='";
		html[idx++] = this._getDOWCellId(i);
		html[idx++] = "'>&nbsp;</td>";
	}
	html[idx++] = "</tr>";

	for (var i = 0; i < 6; i++) {
		html[idx++] = "<tr>";
		if (this._showWeekNumber) {
			html[idx++] = "<td class='DwtCalendarWeekNo' id='" + this._getWeekNumberCellId('kw' + i * 7) + "'>&nbsp;</td>";
		}
		for (var j = 0; j < 7; j++) {
			html[idx++] = "<td id='";
			html[idx++] = this._getDayCellId(i * 7 + j);
			html[idx++] = "'>&nbsp;</td>";
		}
		html[idx++] ="</tr>";
	}

	html[idx++] = "</td></tr></table></table>";

	this.getHtmlElement().innerHTML = html.join("");
	if (!this._readOnly) {
		document.getElementById("b:py:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastRevArrowSmall");
		document.getElementById("b:pm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("RevArrowSmall");
		document.getElementById("b:nm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FwdArrowSmall");
		document.getElementById("b:ny:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastFwdArrowSmall");
	}

	this._calWidgetInited = true;
};

/**
 * Sets the mouse over day callback.
 * 
 * @param	{AjxCallback}		callback		the callback
 */
DwtCalendar.prototype.setMouseOverDayCallback =
function(callback) {
	this._mouseOverDayCB = callback;
};

/**
 * Sets the mouse out day callback.
 * 
 * @param	{AjxCallback}		callback		the callback
 */
DwtCalendar.prototype.setMouseOutDayCallback =
function(callback) {
	this._mouseOutDayCB = callback;
};

/**
 * Gets the date value for the last cell that the most recent
 * Drag-and-drop operation occurred over. Typically it will be called by a DwtDropTarget
 * listener when an item is dropped onto the mini calendar
 * 
 * @return	{Date}		the date or <code>null</code> for none
 */
DwtCalendar.prototype.getDndDate =
function() {
	var dayCell = this._lastDndCell;
	if (dayCell) {
		return new Date(dayCell._year, dayCell._month, dayCell._day);
	}

	return null;
};

// Temp date used for callback in mouseOverListener
DwtCalendar._tmpDate = new Date();
DwtCalendar._tmpDate.setHours(0, 0, 0, 0);

DwtCalendar.prototype._mouseOverListener = 
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._HOVERED);
		// If a mouse over callback has been registered, then call it to give it
		// chance do work like setting the tooltip content
		if (this._mouseOverDayCB) {
			DwtCalendar._tmpDate.setFullYear(target._year, target._month, target._day);
			this._mouseOverDayCB.run(this, DwtCalendar._tmpDate);
		}
	} else if (target.id.charAt(0) == 't') {
		// Dont activate title for now
		return;
	} else if (target.id.charAt(0) == 'b') {
		var img;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_HOVERED_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_HOVERED_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = img._origClassName;
	}

	ev._stopPropagation = true;
};

DwtCalendar.prototype._mouseOutListener = 
function(ev) {
	this.setToolTipContent(null);
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._NORMAL);
		if (this._mouseOutDayCB) {
			this._mouseOutDayCB.run(this);
		}
	} else if (target.id.charAt(0) == 'b') {
		var img;
		target.className = DwtCalendar._BUTTON_CLASS;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = img._origClassName;
	}
};

DwtCalendar.prototype._mouseDownListener = 
function(ev) {
	if (ev.button == DwtMouseEvent.LEFT) {
		var target = ev.target;
		if (target.id.charAt(0) == 'c') {
			this._setClassName(target, DwtCalendar._ACTIVE);
		} else if (target.id.charAt(0) == 't') {
			target.className = DwtCalendar._TITLE_ACTIVE_CLASS;
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_ACTIVE_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_ACTIVE_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
		} else if (target.id.charAt(0) == 'w') {
		}
	}
};

DwtCalendar.prototype._mouseUpListener = 
function(ev) {
	var target = ev.target;
	if (ev.button == DwtMouseEvent.LEFT) {
		if (target.id.charAt(0) == 'c') {
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu)
				DwtMenu.closeActiveMenu();

            var sDate = new Date(target._year, target._month, target._day);
            if(sDate.getDate() != target._day) {
                sDate.setDate(target._day);                 
            }
			if (this.setDate(sDate)) { return; }

			this._setClassName(target, DwtCalendar._HOVERED);
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_HOVERED_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_HOVERED_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
			
			if (img.id.indexOf("py") != -1) {
				this._prevYear();
			} else if (img.id.indexOf("pm") != -1) {
				this._prevMonth();
			} else if (img.id.indexOf("nm") != -1) {
				this._nextMonth();
			} else {
				this._nextYear();
			}
		} else if (target.id.charAt(0) == 't') {
			// TODO POPUP MENU
			target.className = DwtCalendar._TITLE_HOVERED_CLASS;
			this.setDate(new Date(), this._skipNotifyOnPage);
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu) {
				DwtMenu.closeActiveMenu();
			}
		}
	} else if (ev.button == DwtMouseEvent.RIGHT && target.id.charAt(0) == 'c') {
		this._notifyListeners(DwtEvent.ACTION, 0, new Date(target._year, target._month, target._day), ev);
	}
};

DwtCalendar.prototype._doubleClickListener =
function(ev) {
	var target = ev.target;
	if (this._selectionEvent) {
		this._selectionEvent.type = DwtCalendar.DATE_DBL_CLICKED;
	}
	if (target.id.charAt(0) == 'c') {
		// If our parent is a menu then we need to have it close
		if (this.parent instanceof DwtMenu) {
			DwtMenu.closeActiveMenu();
		}
		this.setDate(new Date(target._year, target._month, target._day), false, false, true)
	}
};

DwtCalendar.prototype._prevMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, -1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._nextMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, 1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._prevYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, -1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._nextYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, 1), this._skipNotifyOnPage);
};

/**
 * Gets the date formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateFormatter =
function() {
	if (!DwtCalendar._dateFormatter) {
		DwtCalendar._dateFormatter = new AjxDateFormat(AjxMsg.formatCalDate);
	}
	return DwtCalendar._dateFormatter;
};

/**
 * Gets the date long formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateLongFormatter =
function() {
	if (!DwtCalendar._dateLongFormatter) {
		DwtCalendar._dateLongFormatter = new AjxDateFormat(AjxMsg.formatCalDateLong);
	}
	return DwtCalendar._dateLongFormatter;
};

/**
 * Gets the date full formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateFullFormatter =
function() {
	if (!DwtCalendar._dateFullFormatter) {
		DwtCalendar._dateFullFormatter = new AjxDateFormat(AjxMsg.formatCalDateFull);
	}
	return DwtCalendar._dateFullFormatter;
};

/**
 * Gets the hour formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getHourFormatter =
function() {
	if (!DwtCalendar._hourFormatter) {
		DwtCalendar._hourFormatter = new AjxMessageFormat(AjxMsg.formatCalHour);
	}
	return DwtCalendar._hourFormatter;
};

/**
 * Gets the day formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDayFormatter =
function() {
	if (!DwtCalendar._dayFormatter) {
		DwtCalendar._dayFormatter = new AjxDateFormat(AjxMsg.formatCalDay);
	}
	return DwtCalendar._dayFormatter;
};

/**
 * Gets the month formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getMonthFormatter =
function() {
	if (!DwtCalendar._monthFormatter) {
		DwtCalendar._monthFormatter = new AjxDateFormat(AjxMsg.formatCalMonth);
	}
	return DwtCalendar._monthFormatter;
};

/**
 * Gets the short month formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getShortMonthFormatter =
function() {
	if (!DwtCalendar._shortMonthFormatter) {
		DwtCalendar._shortMonthFormatter = new AjxDateFormat(AjxMsg.formatShortCalMonth);
	}
	return DwtCalendar._shortMonthFormatter;
};

DwtCalendar.prototype._dragEnter =
function(ev) {
};

DwtCalendar.prototype._dragHover =
function(ev) {
};

DwtCalendar.prototype._dragOver =
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._HOVERED);
		this._lastDndCell = target;
	} else {
		this._lastDndCell = null;
	}
};

DwtCalendar.prototype._dragLeave =
function(ev) {
};
}
}
if (AjxPackage.define("prefs.Options")) {
AjxTemplate.register("prefs.Options#OptionsOuter", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" id='' class='fullSize'><tr><td><ul id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs\" class='ZTabList'><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_general' class='ZTab' onclick='controller.showPage(\"general\")'>General</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_mail' class='ZTab'>Mail</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_identity' class='ZTab' onclick='controller.showPage(\"identity\")'>Mail Identities</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_pop' class='ZTab' onclick='controller.showPage(\"pop\")'>Pop Accounts</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_filters' class='ZTab'>Mail Filters</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_addressBook' class='ZTab'>Address Book</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_calendar' class='ZTab'>Calendar</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_outer_tabs_shortcuts' class='ZTab'>Shortcuts</li></ul></td></tr><tr><td colspan=2 style='padding:0px'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_page_title' class='ZmPanelHead'></div></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_page_container' style='height:100%' valign=top ><!--\t\t<div class='ZScrollContainerOuter'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_page_container' class='ZScrollContainerInner'></div></div>\n";
	buffer[_i++] = "--></td><tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#OptionsOuter"
}, false);
AjxTemplate.register("prefs.Options", AjxTemplate.getTemplate("prefs.Options#OptionsOuter"), AjxTemplate.getParams("prefs.Options#OptionsOuter"));

AjxTemplate.register("prefs.Options#PopForm", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<!--<div class='ZScrollContainerInner'>\t--><table role=\"presentation\" class=\"ZFormTable ZFixedTable\" class=\"ZPropertySheet\" cellspacing=\"6\"><colgroup><col width=30%><col width=70%></colgroup><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.popAccountNameLabel ;
	buffer[_i++] = "</td><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name\" type=text class='ZFieldSizeMedium'></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.popAccountFolderLabel ;
	buffer[_i++] = "</td><td><button id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_location\" type=text  class='DwtButtton' style='width:200px'>Inbox</button></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.popAccountDownloadLabel ;
	buffer[_i++] = "</td><td><select id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_download\" class='ZFieldSizeMedium'><option>";
	buffer[_i++] =  ZmMsg.popAccountDownloadLeave ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.popAccountDownloadRemove ;
	buffer[_i++] = "</option></select></td></tr><tr><td colspan=2><div class=ZLineDivider><span class=ZLineDividerTitle>";
	buffer[_i++] =  ZmMsg.accountSettings ;
	buffer[_i++] = "</span></div></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.popAccountServerLabel ;
	buffer[_i++] = "</td><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_server\" type=text class='ZFieldSizeHusky'></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.usernameLabel ;
	buffer[_i++] = "</td><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_username\" type=text class='ZFieldSizeHusky'></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.passwordLabel ;
	buffer[_i++] = "</td><td><table role=\"presentation\"><tr><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_password\" type='password' class='ZFieldSizeSmall'></td><td>&nbsp;<input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_show_password' type='checkbox' class='ZCheckbox'></td><td><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_show_password' class='ZCheckboxLabelInline'>";
	buffer[_i++] =  ZmMsg.showPassword ;
	buffer[_i++] = "</label></td></tr></table></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ssl_row'><td class='ZCheckboxCell'><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ssl\" type=checkbox></td><td><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ssl' class='ZCheckboxLabel'>";
	buffer[_i++] =  ZmMsg.popAccountUseSSL ;
	buffer[_i++] = "</label></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_port_row'><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.portLabel ;
	buffer[_i++] = "</td><td><table role=\"presentation\"><tr><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_port\" type=text style='width:6em'></td><td>&nbsp;<span class='ZHelpLabel' id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_port_label\">";
	buffer[_i++] =  ZmMsg.defaultPort ;
	buffer[_i++] = "</span></td></tr></table></td></tr><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td></td><td><div class='ZFieldSizeHusky'><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_testButton'>";
	buffer[_i++] =  ZmMsg.popAccountTest ;
	buffer[_i++] = "</button></div></td></tr><tr><td colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_title_row' class=ZLineDivider><span class=ZLineDividerTitle>";
	buffer[_i++] =  ZmMsg.identitiesTab ;
	buffer[_i++] = "</span></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_help_row'><td colspan=2><div class='ZHelpLabelIndent'>";
	buffer[_i++] =  ZmMsg.popAccountIdentityHelp ;
	buffer[_i++] = "<div class='ZSmallSpacer'></div></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_create_row'><td class='ZCheckboxLabelCell' colspan=2 style='padding-left:50px;'><table role=\"presentation\"><tr><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_create_identity\" type=checkbox onchange='pageController.toggleIdentityFields(this.checked)'></td><td width=100%><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_create_identity' class='ZCheckboxLabelInline'>";
	buffer[_i++] =  ZmMsg.popAccountCreateNewIdentity ;
	buffer[_i++] = "</label></td></tr></table></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_spacer_row'><td><div class='ZSmallSpacer'></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_name_row'><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.identityNameLabel ;
	buffer[_i++] = "</td><td id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_name\" class='ZLabelCellLeft'>New Account 1</td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_email_row'><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.emailAddrLabel ;
	buffer[_i++] = "</td><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_email\" type=text  class='ZFieldSizeHusky'></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_address_row'><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.linkToNewIdentity ;
	buffer[_i++] = "</td><td><table role=\"presentation\"><tr><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_address\" type=checkbox></td><td><label for=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_address\" class='ZCheckboxLabel'>";
	buffer[_i++] =  ZmMsg.whenReplyingToAddress ;
	buffer[_i++] = "</label></td></tr></table></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_folder_row'><td></td><td><table role=\"presentation\"><tr><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_folder\" type=checkbox></td><td><label for=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_identity_use_folder\" class='ZCheckboxLabel'>";
	buffer[_i++] =  ZmMsg.whenReplyingToFolder ;
	buffer[_i++] = "</label></td></tr></table></td></tr><tr><td><div class='ZSmallSpacer'></div></td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#PopForm"
}, false);

AjxTemplate.register("prefs.Options#IdentityForm", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class=\"ZFormTable ZFixedTable ZPropertySheet\" cellspacing=\"6\" style='height:100%'><colgroup><col width=103><col width='100%'></colgroup><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.identityNameLabel ;
	buffer[_i++] = "</td><td><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name\" type=text class='ZFieldSizeMedium'></td></tr><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td colspan=2><ul id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tabs\" class='ZTabList'><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tabs_options' class='ZTab' onclick='pageController.showPage(\"options\")'>Identity Options</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tabs_signature' class='ZTab' onclick='pageController.showPage(\"signature\")'>Signature</li><li id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tabs_advanced' class='ZTab' onclick='pageController.showPage(\"advanced\")'>Advanced</li></ul></td></tr><tr><td style='height:100%' valign=top colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_subFormContainer' style='width:95%;position:relative;'></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#IdentityForm"
}, false);

AjxTemplate.register("prefs.Options#IdentityForm_options", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<fieldset class='ZFieldset' style='width:auto'><legend class='ZLegend'>";
	buffer[_i++] =  ZmMsg.sendWithIdentity ;
	buffer[_i++] = "</legend><table role=\"presentation\" class='ZFormTable XZFixedTable ZPropertySheet' cellspacing='6' width='99%'><colgroup><col width=20><col width=60><col width='50%'><col width='50%'></colgroup><tr><td class='ZLabelCell' colspan=2>";
	buffer[_i++] =  ZmMsg.sendFrom ;
	buffer[_i++] = "</td><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendFromName' style='width:100%'></td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendFromAddress' style='width:90%'><option>bob@zimbra.com</option></select></td></tr><tr><td class='ZCheckboxCell'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_setReplyToCheckbox' type='checkbox'></td><td class='ZCheckboxLabelCell'><span style='white-space:nowrap'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_setReplyToCheckbox'>";
	buffer[_i++] =  ZmMsg.setReplyTo ;
	buffer[_i++] = "</label></span></td><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_setReplyToName' style='width:100%'></td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_setReplyToAddress' style='width:90%'><option>bob@zimbra.com</option></select></td></tr></table></fieldset>";
	 if (AjxEnv.isIE) { 
	buffer[_i++] = "<br />";
	 } 
	buffer[_i++] = "<fieldset class='ZFieldset' style='width:auto'><legend class='ZLegend'>";
	buffer[_i++] =  ZmMsg.selectIdentityWhen ;
	buffer[_i++] = "</legend><table role=\"presentation\" class='ZFormTable ZFixedTable ZPropertySheet' cellspacing='6' width='99%'><colgroup><col width=20><col width='100%'><col width=40></colgroup><tr><td class='ZCheckboxCell'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenSentToCheckbox' type='checkbox'></td><td class='ZCheckboxLabelCell'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenSentToCheckbox'>";
	buffer[_i++] =  ZmMsg.whenSentTo ;
	buffer[_i++] = "</label></td></tr><tr><td></td><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenSentToInput' style='width:100%'></td></tr><tr><td></td><td class='ZHelpLabel'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenSentToInput'>";
	buffer[_i++] =  ZmMsg.enterEmailAddresses ;
	buffer[_i++] = "</label></td></tr><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td class='ZCheckboxCell'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenInFolderCheckbox' type='checkbox'></td><td class='ZCheckboxLabelCell'><label for=";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenInFolderCheckbox'>";
	buffer[_i++] =  ZmMsg.whenInFolder ;
	buffer[_i++] = "</label></td></tr><tr><td></td><td><table role=\"presentation\" style='width:100%'><tr><td style='width:100%'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_whenInFolderInput' style='width:100%'></td><td style='padding-left:10px;'><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_folderBrowseButton' style='width:30px'><div class='ImgFolder'></div></button></td></tr></table></td></tr><tr><td></td><td class='ZHelpLabel'>";
	buffer[_i++] =  ZmMsg.whenInFolderHint ;
	buffer[_i++] = "</td></tr></table></fieldset>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#IdentityForm_options"
}, false);

AjxTemplate.register("prefs.Options#IdentityForm_signature", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZFormTable ZFixedTable ZPropertySheet' cellspacing='6' style='width:95%;'><colgroup><col width=103><col width='100%'><col width=20></colgroup><tr><td><div class='ZSmallSpacer'></div></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.placeSignature ;
	buffer[_i++] = "</td><td colspan=2><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_signatureStyleSelect'><option>";
	buffer[_i++] =  ZmMsg.aboveQuotedText ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.atBottomOfMessage ;
	buffer[_i++] = "</option></select></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.applySignature ;
	buffer[_i++] = "</td><td colspan=2><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_signatureEnabledSelect'><option>";
	buffer[_i++] =  ZmMsg.automaticSignature ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.manualSignature ;
	buffer[_i++] = "</option></select></td></tr><tr><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.mailSignature ;
	buffer[_i++] = "</td><td><textarea id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_signature' style='width:100%;height:120px'></textarea></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#IdentityForm_signature"
}, false);

AjxTemplate.register("prefs.Options#IdentityForm_advanced", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZFormTable ZFixedTable ZPropertySheet' cellspacing='6' width='99%'><colgroup><col width='200'><col width='100%'</colgroup><tr><td><div class='ZSmallSpacer'></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_useDefaultsRadios'><td class='ZLabelCell'>";
	buffer[_i++] =  ZmMsg.replyWithIdentity ;
	buffer[_i++] = "</td><td style='padding:0px'><table role=\"presentation\"><tr><td class='ZCheckboxCell'><input  name='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_group' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_useDefaultsCheckbox_default' class='ZRadioButton' type='radio' onclick='";
	buffer[_i++] = data["controller"];
	buffer[_i++] = "._toggleAdvancedSettings(false)'></td><td class='ZCheckboxLabelCell' colspan='2'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_useDefaultsCheckbox_default' class='ZCheckboxLabel'>";
	buffer[_i++] =  ZmMsg.identitiesUseDefault ;
	buffer[_i++] = "</label></td></tr><tr><td class='ZCheckboxCell'><input  name='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_group' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_useDefaultsCheckbox_custom' class='ZRadioButton' type='radio' onclick='";
	buffer[_i++] = data["controller"];
	buffer[_i++] = "._toggleAdvancedSettings(true)'></td><td class='ZCheckboxLabelCell' colspan='2'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_useDefaultsCheckbox_custom' class='ZCheckboxLabel'>";
	buffer[_i++] =  ZmMsg.customizeSettings ;
	buffer[_i++] = "</label></td></tr></table></td></tr><tr><td><div class='ZSmallSpacer'></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyForwardSelect_row'><td class='ZLabelCell' ><label id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyForwardSelect_label' for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyForwardSelect'>";
	buffer[_i++] =  ZmMsg.replyForwardFormat ;
	buffer[_i++] = "</label></td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyForwardSelect' class='ZFieldSizeLarge'><option>";
	buffer[_i++] =  ZmMsg.originalFormat ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.text ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.htmlDocument ;
	buffer[_i++] = "</option></select></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyIncludeSelect_row'><td class='ZLabelCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyIncludeSelect_label' >";
	buffer[_i++] =  ZmMsg.replyInclude ;
	buffer[_i++] = "</td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_replyIncludeSelect' class='ZFieldSizeLarge'><option>";
	buffer[_i++] =  ZmMsg.dontIncludeMessage ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.includeInBody ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.includePrefix ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.includeOriginalAsAttach ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.smartInclude ;
	buffer[_i++] = "</option></select></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_forwardIncludeSelect_row'><td class='ZLabelCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_forwardIncludeSelect_label' >";
	buffer[_i++] =  ZmMsg.forwardInclude ;
	buffer[_i++] = "</td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_forwardIncludeSelect' class='ZFieldSizeLarge'><option>";
	buffer[_i++] =  ZmMsg.includeOriginalInBody ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.includePrefix ;
	buffer[_i++] = "</option><option>";
	buffer[_i++] =  ZmMsg.includeOriginalAsAttach ;
	buffer[_i++] = "</option></select></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_prefixSelect_row'><td class='ZLabelCell' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_prefixSelect_label' >";
	buffer[_i++] =  ZmMsg.prefixTextWith ;
	buffer[_i++] = "</td><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_prefixSelect' class='ZFieldSizeSmall'><option>&gt;</option><option>|</option></select></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#IdentityForm_advanced"
}, false);

AjxTemplate.register("prefs.Options#GeneralForm", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "General Options";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Options#GeneralForm"
}, false);

}
if (AjxPackage.define("prefs.Pages")) {
AjxTemplate.register("prefs.Pages#General", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.loginOptions;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (!appCtxt.isOffline) { 
	 if (data.isEnabled(ZmSetting.CHANGE_PASSWORD_ENABLED)) { 
	buffer[_i++] = "<tr id='prefs.Pages#General_PASSWORD_LABEL'><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.password;
	buffer[_i++] = ":</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PASSWORD' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.loginLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CLIENT_TYPE' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.appearance;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (data.isEnabled(ZmSetting.SKIN_CHANGE_ENABLED) && appCtxt.get(ZmSetting.AVAILABLE_SKINS).length > 1) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.themeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SKIN_NAME' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fontLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FONT_NAME' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fontSizeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FONT_SIZE' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.printFontSizeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEFAULT_PRINTFONTSIZE' tabindex=0></select></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.timezoneLanguage;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.defaultTimezone;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEFAULT_TIMEZONE' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.languageLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_LOCALE_NAME' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.composeDirectionLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tbody><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_INIT_DIRECTION' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHOW_COMPOSE_DIRECTION_BUTTONS' tabindex=0></div></td></tr></tbody></table></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.searchOptions;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (data.isEnabled(ZmSetting.SEARCH_INCLUDES_SPAM, ZmSetting.SEARCH_INCLUDES_TRASH, ZmSetting.SHARING_ENABLED)) {
							var labelShown = false;
						
	 if (data.isEnabled(ZmSetting.SEARCH_INCLUDES_SPAM)) { 
	buffer[_i++] = "<tr>";
	 var settingsLabel = labelShown ? "&nbsp;" : ZmMsg.searchSettingsLabel; labelShown = true; 
	buffer[_i++] = "<td class='ZOptionsLabel'>";
	buffer[_i++] = settingsLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SEARCH_INCLUDES_SPAM' tabindex=0></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.SEARCH_INCLUDES_TRASH)) { 
	buffer[_i++] = "<tr>";
	 var settingsLabel = labelShown ? "&nbsp;" : ZmMsg.searchSettingsLabel; labelShown = true; 
	buffer[_i++] = "<td class='ZOptionsLabel'>";
	buffer[_i++] = settingsLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SEARCH_INCLUDES_TRASH' tabindex=0></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.SHARING_ENABLED)) { 
	buffer[_i++] = "<tr>";
	 var settingsLabel = labelShown ? "&nbsp;" : ZmMsg.searchSettingsLabel; labelShown = true; 
	buffer[_i++] = "<td class='ZOptionsLabel'>";
	buffer[_i++] = settingsLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SEARCH_INCLUDES_SHARED' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.searchLanguageLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHOW_SEARCH_STRING' tabindex=0></div></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.otherSettings;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.selectionLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHOW_SELECTION_CHECKBOX' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.emailAddrs;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHORT_ADDRESS' tabindex=0></div></td></tr><!-- The following 3 items are specific to Zimbra Desktop -->";
	 if (appCtxt.isOffline) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.offlineUpdateNotifyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_UPDATE_NOTIFY' tabindex=0></select></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.OFFLINE_SUPPORTS_MAILTO)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.systemDefaults;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_IS_MAILTO_HANDLER' tabindex=0></div></td></tr>";
	 } 
	 if (appCtxt.isOffline && appCtxt.accountList.size() > 2) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_SHOW_ALL_MAILBOXES' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#General"
}, false);
AjxTemplate.register("prefs.Pages", AjxTemplate.getTemplate("prefs.Pages#General"), AjxTemplate.getParams("prefs.Pages#General"));

AjxTemplate.register("prefs.Pages#Mail", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 if (!appCtxt.multiAccounts || data.activeAccount.isMain) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.displayMessages;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (!appCtxt.isOffline && data.isEnabled(ZmSetting.POLLING_INTERVAL_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.pollingIntervalLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_POLLING_INTERVAL' tabindex=0 size='3'></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.displayMail;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VIEW_AS_HTML' tabindex=0></div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.messagePreviewLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHOW_FRAGMENTS' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OPEN_MAIL_IN_NEW_WIN' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DISPLAY_TIME_IN_MAIL_LIST' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.imagesLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DISPLAY_EXTERNAL_IMAGES' tabindex=0></div></td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.messageReadLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MARK_MSG_READ' tabindex=0></div></td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.selectAfterDeleteLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SELECT_AFTER_DELETE' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.messageColorLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COLOR_MESSAGES' tabindex=0></div></td></tr>";
	 if (!appCtxt.isOffline) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.initialMailSearchLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_INITIAL_SEARCH' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table>";
	 } 
	
			if (appCtxt.isOffline && data.activeAccount == appCtxt.accountList.defaultAccount) {
				var size = appCtxt.accountList.size();
				if ((size > 2 && !appCtxt.get(ZmSetting.OFFLINE_SHOW_ALL_MAILBOXES)) || size == 2) {
		
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.displayMessages;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.initialMailSearchLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_INITIAL_SEARCH' tabindex=0></div></td></tr></table></td></tr></table>";
	 } 
	 } 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.messagesReceiving;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'>";
	
						var messageArrivalLabelDisplayed = false;
						var showMessageArrivalLabel = function() {
							var ret = messageArrivalLabelDisplayed ? "&nbsp;" : ZmMsg.messageArrivalLabel;
							messageArrivalLabelDisplayed = true;
							return ret;
						};
					
	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (!appCtxt.multiAccounts || appCtxt.isFamilyMbox || (!data.activeAccount.isMain && data.activeAccount.isZimbraAccount)) { 
	 if (appCtxt.get(ZmSetting.MAIL_FORWARDING_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageArrivalLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.forwardCopyTo;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_FORWARDING_ADDRESS' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_LOCAL_DELIVERY_DISABLED' tabindex=0></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.NOTIF_FEATURE_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageArrivalLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] =  ZmMsg.mailNotifEnabled ;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NOTIF_ADDRESS' tabindex=0></div></td></tr>";
	 } 
	 } 
	 if (messageArrivalLabelDisplayed) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr>";
	 } 
	
							var messageNotificationLabelDisplayed = false;
							var showMessageNotificationLabel = function() {
								var ret = messageNotificationLabelDisplayed ? "&nbsp;" : ZmMsg.messageNotificationLabel;
								messageNotificationLabelDisplayed = true;
								return ret;
							};
						
	 if (!appCtxt.multiAccounts || appCtxt.isFamilyMbox || (!data.activeAccount.isMain && data.activeAccount.isZimbraAccount)) { 
	 if (data.isEnabled(ZmSetting.MAIL_NOTIFY_TOASTER)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageNotificationLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_NOTIFY_TOASTER' tabindex=0></div></td></tr></table></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.MAIL_NOTIFY_APP)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageNotificationLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_NOTIFY_APP' tabindex=0 type=checkbox></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.MAIL_NOTIFY_BROWSER)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageNotificationLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_NOTIFY_BROWSER' tabindex=0 type=checkbox></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.MAIL_NOTIFY_SOUNDS)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = showMessageNotificationLabel() ;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_NOTIFY_SOUNDS' tabindex=0 type=checkbox></div></td></tr>";
	 } 
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] =  ZmMsg.messageNotificationFoldersLabel ;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_NOTIFY_ALL' tabindex=0></div></td></tr>";
	 if (!appCtxt.multiAccounts || appCtxt.isFamilyMbox || (!data.activeAccount.isMain && data.activeAccount.isZimbraAccount)) { 
	 if (data.isEnabled(ZmSetting.MAIL_READ_RECEIPT_ENABLED)) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.readReceipt;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.readReceiptPref;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_SEND_READ_RECEIPTS' tabindex=0></div></td></tr><tr><td colspan=2><hr /></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.removeDupesToSelfLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.removeDupesToSelf;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEDUPE_MSG_TO_SELF' tabindex=0></div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.duplicateMessageLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEDUPE_MSG_ENABLED' tabindex=0 type=checkbox></div></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.composingMessages;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 var isHtmlCompose = data.isEnabled(ZmSetting.HTML_COMPOSE_ENABLED); 
	 if (isHtmlCompose) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabelTop' valign=top>";
	buffer[_i++] = ZmMsg.composeLabel;
	buffer[_i++] = "</td><td class='ZOptionsNestedTable'><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><colgroup><col width=1><col width=1><col> <!-- family --><col width=1><col> <!-- size --><col width=1><col> <!-- color --></colgroup><tr valign=top><td class='ZOptionsFieldTop' style=\"white-space:nowrap\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_AS_FORMAT' tabindex=0></div></td><td class='ZOptionsLabelTop ZOptionsLabelNarrow'>";
	buffer[_i++] = ZmMsg.fFamilyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_INIT_FONT_FAMILY' tabindex=0></select></td><td class='ZOptionsLabelTop ZOptionsLabelNarrow'>";
	buffer[_i++] = ZmMsg.fSizeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_INIT_FONT_SIZE' tabindex=0></select></td><td class='ZOptionsLabelTop ZOptionsLabelNarrow'>";
	buffer[_i++] = ZmMsg.fColorLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_INIT_FONT_COLOR' tabindex=0></select></td></tr></table></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel' valign=top>";
	buffer[_i++] = ZmMsg.settingsLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTO_SAVE_DRAFT_INTERVAL' tabindex=0></div></td></tr>";
	 if (isHtmlCompose) { 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div type=checkbox id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_COMPOSE_SAME_FORMAT\"></div></td></tr>";
	 } 
	 var isNewWindow = data.isEnabled(ZmSetting.NEW_WINDOW_COMPOSE); 
	 if (isNewWindow) { 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NEW_WINDOW_COMPOSE' tabindex=0></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.SAVE_TO_SENT)) { 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SAVE_TO_SENT' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTO_READ_RECEIPT_ENABLED' tabindex=0></div></td></tr>";
	 if (appCtxt.get(ZmSetting.SPELL_CHECK_ENABLED)) { 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_MANDATORY_SPELLCHECK' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_USE_SEND_MSG_SHORTCUT' tabindex=0></div></td></tr><tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TAB_IN_EDITOR' tabindex=0></div></td></tr>";
	 if (data.isEnabled(ZmSetting.MAIL_ENABLED) || data.isEnabled(ZmSetting.ADMIN_DELEGATED)) { 
	 if (isHtmlCompose || isNewWindow ) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.composeReplyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REPLY_INCLUDE_WHAT' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REPLY_USE_PREFIX' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REPLY_INCLUDE_HEADERS' tabindex=0></div></td></tr></table></td></tr><tr><td colspan=2></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.forwardingLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FORWARD_INCLUDE_WHAT' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FORWARD_USE_PREFIX' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FORWARD_INCLUDE_HEADERS' tabindex=0></div></td></tr></table></td></tr><tr><td colspan=2></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.prefixLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.prefixTextWith;
	buffer[_i++] = "</td></tr><tr><td>&nbsp;</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REPLY_PREFIX' tabindex=0></div></td></tr><tr><td>&nbsp;</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.prefixNote;
	buffer[_i++] = "</td></tr>";
	 } 
	 if (!appCtxt.isOffline) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_compose_more' colspan=2><b>";
	buffer[_i++] = ZmMsg.composeMoreOptions;
	buffer[_i++] = "</b></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table>";
	 if (!appCtxt.multiAccounts || appCtxt.isFamilyMbox || (!data.activeAccount.isMain && data.activeAccount.isZimbraAccount)) { 
	 if (appCtxt.get(ZmSetting.MAIL_BLACKLIST_MAX_NUM_ENTRIES) > 0 || appCtxt.get(ZmSetting.MAIL_WHITELIST_MAX_NUM_ENTRIES) > 0) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.junkMailOptions;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td class='ZOptionsLabel' style='text-align:left'>";
	buffer[_i++] = ZmMsg.blackListLabel;
	buffer[_i++] = "</td><td class='ZOptionsLabel' style='text-align:left'>";
	buffer[_i++] = ZmMsg.whiteListLabel;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_BLACKLIST'></div></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MAIL_WHITELIST'></div></td></tr></table></td></tr></table>";
	 } 
	 } 
	 if (data.isEnabled(ZmSetting.POP_ENABLED) || data.isEnabled(ZmSetting.PREF_POP_ENABLED) || data.isEnabled(ZmSetting.PREF_IMAP_ENABLED)) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.externalAccess;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (data.isEnabled(ZmSetting.PREF_IMAP_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.imapAccessLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PREF_IMAP_ENABLED' tabindex=0></div></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.PREF_POP_ENABLED) && appCtxt.get(ZmSetting.PREF_POP_ENABLED) !== null) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.popAccessLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PREF_POP_ENABLED' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "</table>";
	 if (data.isEnabled(ZmSetting.POP_ENABLED) || data.isEnabled(ZmSetting.PREF_POP_ENABLED)) { 
	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.externalAccessPop;
	buffer[_i++] = "</td><td></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.downloadPop;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_POP_DOWNLOAD_SINCE' tabindex=0></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_POP_DOWNLOAD_SINCE_VALUE'></div></td></tr><tr><td colspan=2>&nbsp;</td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.incomingPOPJunk;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_POP_INCLUDE_SPAM' tabindex=0></div></td></tr><tr><td colspan=2>&nbsp;</td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.incomingPOPDeleted;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_POP_DELETE_OPTION' tabindex=0></div></td></tr></table>";
	 } 
	buffer[_i++] = "</td></tr></table>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Mail"
}, false);

AjxTemplate.register("prefs.Pages#BlackList", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EMAIL_ADDRESS' tabindex=0></div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_BUTTON' valign=top tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_LISTVIEW' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REMOVE_BUTTON' valign=top tabindex=0></td></tr></table><div class='ZOptionsInfo' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NUM_USED'></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#BlackList"
}, false);

AjxTemplate.register("prefs.Pages#WhiteList", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EMAIL_ADDRESS' tabindex=0></div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_BUTTON' valign=top tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_LISTVIEW' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REMOVE_BUTTON' valign=top tabindex=0></td></tr></table><div class='ZOptionsInfo' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NUM_USED'></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#WhiteList"
}, false);

AjxTemplate.register("prefs.Pages#TrustedList", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EMAIL_ADDRESS' tabindex=0></div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_BUTTON' valign=top tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_LISTVIEW' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REMOVE_BUTTON' valign=top tabindex=0></td></tr></table><div class='ZOptionsInfo' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NUM_USED'></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#TrustedList"
}, false);

AjxTemplate.register("prefs.Pages#Trusted", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.trustedAddrsDomains;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><div>";
	buffer[_i++] = ZmMsg.trustedAddrHeaderMsg;
	buffer[_i++] = "</div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TRUSTED_ADDR_LIST' tabindex=0></div></td></td></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Trusted"
}, false);

AjxTemplate.register("prefs.Pages#Signatures", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.signatures;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIGNATURES' tabindex=0></div></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.signaturesUsing;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_TABLE' class='ZPropertySheet' cellspacing='6'><tr><td>&nbsp;</td><td>";
	buffer[_i++] = ZmMsg.newMessages;
	buffer[_i++] = "</td><td>";
	buffer[_i++] = ZmMsg.repliesForwards;
	buffer[_i++] = "</td></tr></table><hr /><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.placeSignature;
	buffer[_i++] = "</td><td class='ZOptionsInfo'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIGNATURE_STYLE' tabindex=0></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Signatures"
}, false);

AjxTemplate.register("prefs.Pages#SignatureSplitView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%'><tr><td>&nbsp;</td><td><table role=\"presentation\" width=\"100%\"><tr><td class=\"Label\">";
	buffer[_i++] = ZmMsg.nameLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_NAME' tabindex=0 size=30></td><td width=\"100%\">&nbsp;</td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_FORMAT' tabindex=0></div></td></tr></table></td></tr><tr><td width=180 height=200 valign='top'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_LIST' width='100%' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_EDITOR' tabindex=0></div></td></tr><tr><td><table role=\"presentation\"><tr><td class=\"ZOptionsField\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_NEW' tabindex=0></div></td><td class='ZOptionsField'>&nbsp;</td><td class=\"ZOptionsField\" align='right'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_DELETE' tabindex=0></div></td></tr></table></td><td align='right'><table role=\"presentation\"><tr><td class=\"Label\">";
	buffer[_i++] = ZmMsg.signatureVcardLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_VCARD' tabindex=0 size=30></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_VCARD_BROWSE' style='padding-right:5px; padding-left:5px;' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SIG_VCARD_CLEAR' tabindex=0></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#SignatureSplitView"
}, false);

AjxTemplate.register("prefs.Pages#Contacts", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 if (data.activeAccount.isMain) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.options;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 var settingLabelled = false; 
	 if (!appCtxt.multiAccounts || data.activeAccount.isMain) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  settingLabelled ? "&nbsp;" : ZmMsg.settingsLabel; ;
	  settingLabelled = true; 
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTO_ADD_ADDRESS' tabindex=0 type=checkbox></td></tr>";
	 } 
	 if (!appCtxt.multiAccounts || (appCtxt.isFamilyMbox && data.activeAccount.isMain) || (!data.activeAccount.isMain && data.activeAccount.isZimbraAccount)) { 
	 if (data.isEnabled(ZmSetting.INITIALLY_SEARCH_GAL)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  settingLabelled ? "&nbsp;" : ZmMsg.settingsLabel; ;
	  settingLabelled = true; 
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_INITIALLY_SEARCH_GAL' tabindex=0 type=checkbox></td></tr>";
	 } 
	 } 
	 if (settingLabelled) { 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr>";
	 } 
	 var autocompleteLabelled = false; 
	 var autocompleteLabel = ZmMsg.autocomplete + ":"; 
	 if (!appCtxt.multiAccounts || (appCtxt.isFamilyMbox && data.activeAccount.isMain) || !data.activeAccount.isMain) {
	 if (appCtxt.isOffline && !data.activeAccount.isMain) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  autocompleteLabelled ? "&nbsp;" : autocompleteLabel; ;
	  autocompleteLabelled = true; 
	buffer[_i++] = "</td>";
	 var autocompleteLabelled = true; 
	buffer[_i++] = "<td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTOCOMPLETE_SHARE' tabindex=0 type=checkbox></td></tr>";
	 } 
	 if (data.activeAccount.isZimbraAccount) { 
	 if (data.isEnabled(ZmSetting.GAL_ENABLED) && data.isEnabled(ZmSetting.GAL_AUTOCOMPLETE_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  autocompleteLabelled ? "&nbsp;" : autocompleteLabel; ;
	  autocompleteLabelled = true; 
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_GAL_AUTOCOMPLETE' tabindex=0 type=checkbox></td></tr>";
	 } 
	 if (data.isEnabled(ZmSetting.SHARING_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  autocompleteLabelled ? "&nbsp;" : autocompleteLabel; ;
	  autocompleteLabelled = true; 
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTOCOMPLETE_SHARED_ADDR_BOOKS' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] =  autocompleteLabelled ? "&nbsp;" : autocompleteLabel; ;
	  autocompleteLabelled = true; 
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_AUTOCOMPLETE_ON_COMMA' tabindex=0></div></td></tr>";
	 } 
	 } 
	buffer[_i++] = "</table></td></tr></table>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Contacts"
}, false);

AjxTemplate.register("prefs.Pages#Accounts", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.accounts;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ACCOUNTS' tabindex=0></div></td></tr><tr><td colspan=\"10\"><table role=\"presentation\" class=\"ZPropertySheet\" cellspacing='6' width=100%><tr>";
	 if (!appCtxt.isOffline && (data.isEnabled(ZmSetting.POP_ACCOUNTS_ENABLED) || data.isEnabled(ZmSetting.IMAP_ACCOUNTS_ENABLED))) { 
	buffer[_i++] = "<td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_EXTERNAL' tabindex=0>";
	buffer[_i++] = ZmMsg.addExternalAccount;
	buffer[_i++] = "</button> </td>";
	 } 
	 if (data.isEnabled(ZmSetting.IDENTITIES_ENABLED)) { 
	buffer[_i++] = "<td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_PERSONA' tabindex=0>";
	buffer[_i++] = ZmMsg.addPersona;
	buffer[_i++] = "</button> </td>";
	 } 
	buffer[_i++] = "<td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DELETE' tabindex=0>";
	buffer[_i++] = ZmMsg.del;
	buffer[_i++] = "</button></td><td width=\"100%\"></td></tr></table></td></tr></table></td></tr></table><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY\" class='ZAccountSettings'>";
	buffer[_i++] =  AjxTemplate.expand("#PrimaryAccount", data) ;
	buffer[_i++] = "</div>";
	 if (data.isEnabled(ZmSetting.POP_ACCOUNTS_ENABLED) || data.isEnabled(ZmSetting.IMAP_ACCOUNTS_ENABLED)) { 
	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL\" class='ZAccountSettings' style='display:none;'>";
	buffer[_i++] =  AjxTemplate.expand("#ExternalAccount", data) ;
	buffer[_i++] = "</div>";
	
				var providers = ZmDataSource.getProviders();
				for (var pid in providers) {
					if (!AjxTemplate.getTemplate("prefs.Pages#ExternalAccount-"+pid)) { continue; }
			
	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_";
	buffer[_i++] = pid;
	buffer[_i++] = "\" class='ZAccountSettings' style='display:none;'>";
	buffer[_i++] =  AjxTemplate.expand("#ExternalAccount-"+pid, data) ;
	buffer[_i++] = "</div>";
	 } 
	 } 
	 if (data.isEnabled(ZmSetting.IDENTITIES_ENABLED)) { 
	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA\" class='ZAccountSettings' style='display:none;'>";
	buffer[_i++] =  AjxTemplate.expand("#Persona", data) ;
	buffer[_i++] = "</div>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Accounts"
}, false);

AjxTemplate.register("prefs.Pages#PrimaryAccount", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.accountHeaderPrimary;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.emailAddrLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_EMAIL' tabindex=0></span></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountNameLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_NAME' tabindex=0></td></tr>";
	 if (appCtxt.isFamilyMbox) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.isVisible;
	buffer[_i++] = ":</td><td class='ZOptionsField'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_VISIBLE' tabindex=0></span></td></tr>";
	 } 
	buffer[_i++] = "<tr><td colspan=2><hr /></td></tr><tr><td style='text-align:left' colspan=2><b>";
	buffer[_i++] = ZmMsg.accountFromPrompt;
	buffer[_i++] = "</b></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fromLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.fromDetail;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr>";
	 if (appCtxt.get(ZmSetting.FROM_DISPLAY_ENABLED)) { 
	buffer[_i++] = "<td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_FROM_NAME' tabindex=0 size=30></td>";
	 } 
	buffer[_i++] = "<td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_FROM_EMAIL' tabindex=0 size=40></select></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.setReplyTo;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_REPLY_TO' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr><td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_REPLY_TO_NAME' tabindex=0 size=30></td><td class='ZmSelector'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PRIMARY_REPLY_TO_EMAIL' tabindex=0></select></td></tr></table></td></tr><tr valign=top><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.signatureLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'>";
	buffer[_i++] = ZmMsg.manageSignatures;
	buffer[_i++] = "</td></tr><tr><td colspan=2><hr /></td></tr>";
	 if (appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_AVAILABLE)) { 
	buffer[_i++] = "<tr valign=top><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.twoStepAccountSecurity;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH'>";
	 if (appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_ENABLED)) { 
	buffer[_i++] = ZmMsg.twoStepAuth;
	 } 
	 else { 
	buffer[_i++] = ZmMsg.twoStepStandardAuth;
	 } 
	buffer[_i++] = "</span>";
	 if (!appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_REQUIRED)) { 
	buffer[_i++] = "<a style=\"margin:20px;\" href=\"#\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH_LINK'>";
	 if (appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_ENABLED)) { 
	buffer[_i++] = ZmMsg.twoStepAuthDisableLink;
	 } 
	 else { 
	buffer[_i++] = ZmMsg.twoStepAuthSetupLink;
	 } 
	buffer[_i++] = "</a>";
	 } 
	buffer[_i++] = "</td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH_CODES_CONTAINER' valign=top\n";
	buffer[_i++] = "\t\t\t\t\t\t\t";
	 if (!appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_ENABLED)) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t\t\t\t\tstyle=\"display:none;\"\n";
	buffer[_i++] = "\t\t\t\t\t\t\t";
	 } 
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t\t\t><td colspan=2><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.twoStepAuthOneTimeCodes;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH_CODES'></span><a href=\"#\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH_CODES_VIEW_LINK' style=\"margin:10px;display:none;\">";
	buffer[_i++] = ZmMsg.view;
	buffer[_i++] = "</a><a href=\"#\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TWO_STEP_AUTH_CODES_GENERATE_LINK' style=\"margin:10px;display:none;\">";
	buffer[_i++] = ZmMsg.twoStepAuthOneTimeCodesGenerate;
	buffer[_i++] = "</a></td></tr>";
	 if (appCtxt.get(ZmSetting.TRUSTED_DEVICES_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.trustedDevices;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TRUSTED_DEVICES_COUNT'></span><a href=\"#\" class=\"ZmLinkDisabled\" style=\"margin:10px;\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TRUSTED_DEVICE_REVOKE_LINK'>";
	buffer[_i++] = ZmMsg.trustedDevicesRevoke;
	buffer[_i++] = "</a><a href=\"#\" class=\"ZmLinkDisabled\" style=\"margin:10px;\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TRUSTED_DEVICES_REVOKE_ALL_LINK'>";
	buffer[_i++] = ZmMsg.trustedDevicesRevokeAll;
	buffer[_i++] = "</a></td></tr>";
	 } 
	 if (appCtxt.get(ZmSetting.APP_PASSWORDS_ENABLED)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.twoStepAuthApplications;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'>";
	buffer[_i++] = ZmMsg.twoStepAuthApplicationsDesc;
	buffer[_i++] = "</td></tr><tr><td></td><td><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td colspan='4'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_APPLICATION_CODES'></div></td></tr></table></td></tr><tr><td></td><td><table role=\"presentation\" class=\"ZPropertySheet\" cellspacing=\"6\"><tbody><tr><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_APPLICATION_CODE' tabindex=0>";
	buffer[_i++] = ZmMsg.twoStepAuthAddAppCode;
	buffer[_i++] = "</button></td><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REVOKE_APPLICATION_CODE' tabindex=0>";
	buffer[_i++] = ZmMsg.twoStepAuthRevokeCode;
	buffer[_i++] = "</button></td></tr></tbody></table></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr><tr><td colspan=2><hr /></td></tr>";
	 } 
	 if (appCtxt.get(ZmSetting.RESET_PASSWORD_STATUS) === 'enabled' || appCtxt.get(ZmSetting.RESET_PASSWORD_STATUS) === 'suspended') { 
	buffer[_i++] = "<tr><td style='text-align:left' colspan=2><b>";
	buffer[_i++] = ZmMsg.recoveryEmailPrefTitle;
	buffer[_i++] = "</b></td></tr><tr><td></td><td><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='DwtListView-Column'><div style='padding-left:6px; padding-right:6px; color: #727272'>";
	buffer[_i++] = ZmMsg.account;
	buffer[_i++] = "</div></td><td class='DwtListView-Column'><div style='padding-left:6px; padding-right:6px; color: #727272; width: 200px;'>";
	buffer[_i++] = ZmMsg.status;
	buffer[_i++] = "</div></td></tr><tr><td class='DwtListView-Rows'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_ACCOUNT_DETAIL' style='padding-left:6px; padding-right:6px'></div></td><td class='DwtListView-Rows'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_ACCOUNT_STATUS' style='padding-left:6px; padding-right:6px'></div></td></tr></table></td></tr><tr><td></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_MESSAGE' style='text-align:left'></td></tr><tr><td></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_ERROR_MESSAGE' style='text-align:left; color: red'></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_ACCOUNT_TR'><td class=\"Label\" style=\"padding-right:10px; text-align: right\">";
	buffer[_i++] = ZmMsg.emailLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_ACCOUNT' style='width: 200px' tabindex=0></td><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_RECOVERY_EMAIL' tabindex=0></button></td><td width=\"100%\"></td></tr></table></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_CODE_TR'><td class=\"Label\" style=\"padding-right:10px; text-align: right\">";
	buffer[_i++] = ZmMsg.recoveryEmailCodeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_CODE' style='width: 200px' tabindex=0></td><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VALIDATE_RECOVERY_EMAIL' tabindex=0></button></td><td width=\"100%\"></td></tr></table></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECOVERY_OPTIONS_TITLE' class='ZOptionsLabel' style='font-weight: normal'></td><td style='float: left'><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESET_RECOVERY_EMAIL' style='float: left' tabindex=0></button><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESEND_RECOVERY_EMAIL' style='float: left; margin-left: 5px' tabindex=0></button></td></tr><tr><td colspan=2><hr /></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.delegatesLabel;
	buffer[_i++] = "</td><td style='text-align:left'>";
	buffer[_i++] = ZmMsg.delegateRightsPrompt;
	buffer[_i++] = "</td></tr><tr><td></td><td><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td colspan='4'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DELEGATE_RIGHTS'></div></td></tr></table></td></tr><tr><td></td><td><table role=\"presentation\" class=\"ZPropertySheet\" cellspacing=\"6\"><tbody><tr><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADD_DELEGATE' tabindex=0>";
	buffer[_i++] = ZmMsg.addDelegate;
	buffer[_i++] = "</button></td><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EDIT_DELEGATE' tabindex=0>";
	buffer[_i++] = ZmMsg.editPermissions;
	buffer[_i++] = "</button></td><td><button id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_REMOVE_DELEGATE' tabindex=0>";
	buffer[_i++] = ZmMsg.remove;
	buffer[_i++] = "</button></td><td width='100%'></td></tr></tbody></table></td></tr>";
	 if (data.isEnabled(ZmSetting.SAVE_TO_SENT_DELEGATED_TARGET)) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel' style=\"vertical-align:top\">";
	buffer[_i++] = ZmMsg.delegateSendSettings;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SAVE_TO_SENT_DELEGATED_TARGET' tabindex=0></div></td></tr>";
	 } 
	buffer[_i++] = "</table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#PrimaryAccount"
}, false);

AjxTemplate.register("prefs.Pages#ExternalAccount", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.accountHeaderExternal;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class=\"ZPropertySheet\" cellspacing='6'><tr><td colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_ALERT'></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.emailAddrLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_EMAIL' tabindex=0 size=30></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountNameLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_NAME' tabindex=0 size=30></div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountTypeLabel;
	buffer[_i++] = "</td>";
	 if (data.isEnabled(ZmSetting.POP_ACCOUNTS_ENABLED) && data.isEnabled(ZmSetting.IMAP_ACCOUNTS_ENABLED)) { 
	buffer[_i++] = "<td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_ACCOUNT_TYPE' tabindex=0></div></td>";
	 } else if (data.isEnabled(ZmSetting.POP_ACCOUNTS_ENABLED)) { 
	buffer[_i++] = "<td class='ZOptionsField'>POP3</td>";
	 } else { 
	buffer[_i++] = "<td class='ZOptionsField'>IMAP</td>";
	 } 
	buffer[_i++] = "</tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountUsernameLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_USERNAME' tabindex=0 size=30></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountServerLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_HOST' tabindex=0 size=30></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.passwordLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><!-- NOTE: impossible to set a hint because it will just be turned into ****** --><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_PASSWORD' tabindex=0 type=password></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.advancedSettingsLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_CHANGE_PORT' tabindex=0 type=checkbox></td><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_PORT' tabindex=0 size=4></td><td class='ZOptionsInfo'><span id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_PORT_DEFAULT'></span></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_SSL' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_TEST' tabindex=0></div></td></tr></table></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.accountDownloadToLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_DOWNLOAD_TO' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><hr /></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_DELETE_AFTER_DOWNLOAD' tabindex=0 type=checkbox></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel' style='text-align:left' colspan=2>";
	buffer[_i++] = ZmMsg.accountFromPrompt;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fromLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.fromDetail;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr><td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_FROM_NAME' tabindex=0 size=30></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.setReplyTo;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_REPLY_TO' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr><td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_REPLY_TO_NAME' tabindex=0 size=30></td><td class='ZmSelector'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXTERNAL_REPLY_TO_EMAIL' tabindex=0></select></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.signatureLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'><a id ='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_External_Signatures_Link' href='#Prefs.Signatures'>";
	buffer[_i++] = ZmMsg.manageSignaturesForExternalAccount;
	buffer[_i++] = "</a><span id ='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_External_Signatures_Text'>";
	buffer[_i++] = ZmMsg.manageSignaturesForExternalAccount;
	buffer[_i++] = "</span></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#ExternalAccount"
}, false);

AjxTemplate.register("prefs.Pages#Persona", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.personaSettings;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class=\"ZPropertySheet\" cellspacing='6'><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.accountPersonaInstructions;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountPersonaLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_NAME' tabindex=0></div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel' style='text-align:left' colspan=2>";
	buffer[_i++] = ZmMsg.accountFromPrompt;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fromLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.fromDetail;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr>";
	 if (appCtxt.get(ZmSetting.FROM_DISPLAY_ENABLED)) { 
	buffer[_i++] = "<td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_FROM_NAME' tabindex=0 size=30></td>";
	 } 
	buffer[_i++] = "<td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_FROM_EMAIL' tabindex=0 size=40></select></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.setReplyTo;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_REPLY_TO' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr><td style='padding-right:.5em;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_REPLY_TO_NAME' tabindex=0 size=30></td><td class='ZmSelector'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_REPLY_TO_EMAIL' tabindex=0 size=40></select></td></tr></table></td></tr><tr valign=top><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.signatureLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' valign='middle'>";
	buffer[_i++] = ZmMsg.manageSignatures;
	buffer[_i++] = "</td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.accountPersonaUseLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_WHEN_SENT_TO' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsInfo ZOptionsSubField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_WHEN_SENT_TO_LIST' tabindex=0 size=80></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsInfo ZOptionsSubField'>";
	buffer[_i++] = ZmMsg.whenSentToHint;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_WHEN_IN_FOLDER' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField ZOptionsSubField'><table role=\"presentation\"><tr><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_WHEN_IN_FOLDER_LIST' tabindex=0 size=60></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_PERSONA_WHEN_IN_FOLDER_BUTTON' tabindex=0></div></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsInfo ZOptionsSubField'>";
	buffer[_i++] = ZmMsg.whenInFolderHint;
	buffer[_i++] = "</td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Persona"
}, false);

AjxTemplate.register("prefs.Pages#MailFilters", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class=\"rightAlign\">";
	buffer[_i++] = ZmMsg.filterRuleChangesSavedImmediately;
	buffer[_i++] = "</div>";
	 if (appCtxt.get(ZmSetting.PRIORITY_INBOX_ENABLED)) { 
	buffer[_i++] = "<div><fieldset><legend>";
	buffer[_i++] = ZmMsg.activityStreamFilterTitle;
	buffer[_i++] = "</legend><table role=\"presentation\"><tr><td style='padding:5px'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ACTIVITY_STREAM_BUTTON'></div></td><td>";
	buffer[_i++] = ZmMsg.activityStreamFilterMsg;
	buffer[_i++] = "</td></tr></table></fieldset></div>";
	 }
	buffer[_i++] = "<table role=\"presentation\" width=100%><tr><td class='ZOptionsSectionTabView'><table role=\"presentation\" width=100%><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_tabview' tabindex=0></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MailFilters"
}, false);

AjxTemplate.register("prefs.Pages#MailFilter", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_toolbar' tabindex=0></div></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_list' tabindex=0></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MailFilter"
}, false);

AjxTemplate.register("prefs.Pages#MailFilterRule", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%' style='margin-bottom:.75em; min-width:450px;'><tr><td><table role=\"presentation\" width='100%' class='ZPropertySheet' cellspacing='6'><tr><td width='1%' style='white-space:nowrap;'> ";
	buffer[_i++] = ZmMsg.filterNameLabel;
	buffer[_i++] = " </td><td width='99%'> <input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name' type='text' tabindex=0 style='width:100%;'> </td></tr></table></td><td width='1%'><table role=\"presentation\" class='ZCheckboxTable' style='margin-left:1em;'><tr><td> <input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_active' type='checkbox' name='cbActive' checked tabindex=0> </td><td style='white-space:nowrap;'><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_active'> ";
	buffer[_i++] = ZmMsg.active;
	buffer[_i++] = " </label></td></tr></table></td></tr></table><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_condition' tabindex=0></div><fieldset class='FilterRuleSection' role='form' aria-label='";
	buffer[_i++] = ZmMsg.filterConditions;
	buffer[_i++] = "'><div style='overflow-x:hidden;overflow-y:auto;height:145px;'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_conditions' width='100%' tabindex=0 class='ZPropertySheet' cellspacing='6'><tbody></tbody></table></div></fieldset><div>";
	buffer[_i++] = ZmMsg.filterActions;
	buffer[_i++] = "</div><fieldset class='FilterActionSection' role='form' aria-label='";
	buffer[_i++] = ZmMsg.quickCommandActions;
	buffer[_i++] = "'><div style='overflow-x:hidden;overflow-y:auto;height:82px'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_actions' width='100%' tabindex=0 class='ZPropertySheet' cellspacing='6'><tbody></tbody></table></div></fieldset><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_stop' type='checkbox' name='cbStop' checked tabindex=0>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MailFilterRule"
}, false);

AjxTemplate.register("prefs.Pages#Calendar", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 if (data.activeAccount.isMain) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.general;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class=\"ZPropertySheet\" cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.defaultViewLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CALENDAR_INITIAL_VIEW' tabindex=0></select></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.calendarStartWeekLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_FIRST_DAY_OF_WEEK' tabindex=0></select></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.calendarInitialApptVisibility ;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_APPT_VISIBILITY' tabindex=0></select></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_ALWAYS_SHOW_MINI_CAL' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SHOW_CALENDAR_WEEK' tabindex=0 type=checkbox></td></tr>";
	 if (!appCtxt.multiAccounts) { 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_AUTO_ADD_INVITES' tabindex=0 type=checkbox></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SHOW_DECLINED_MEETINGS' tabindex=0 type=checkbox></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deleteInviteOnReplyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DELETE_INVITE_ON_REPLY' tabindex=0 type=checkbox></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel' id=id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_INV_FORWARDING_ADDRESS_label'>";
	buffer[_i++] = ZmMsg.forwardInvitesToLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.forwardInvitesTo;
	buffer[_i++] = " <input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_INV_FORWARDING_ADDRESS' aria-labelledby='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_INV_FORWARDING_ADDRESS' tabindex=0></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.apptReminderLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_REMINDER_WARNING_TIME' tabindex=0></select></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SHOW_PAST_DUE_REMINDERS' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_REMINDER_NOTIFY_SOUNDS' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_REMINDER_NOTIFY_BROWSER' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_REMINDER_NOTIFY_TOASTER' tabindex=0></div></td></tr></table></td></tr><tr><td colspan=2><hr /></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.defaultApptDuration;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_DEFAULT_APPT_DURATION' tabindex=0></select></td><td style=\"padding-left:4px;\">";
	buffer[_i++] = ZmMsg.minutes;
	buffer[_i++] = "</td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.calendarScaling;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SCALING' tabindex=0></select></td><td style=\"padding-left:4px;\">";
	buffer[_i++] = ZmMsg.minutes;
	buffer[_i++] = "</td></tr></table></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.calendarWorkHoursHeader;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_HOURS'></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.apptCreating;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.defaultCalendar;
	buffer[_i++] = ":</td><td class='ZOptionsField'><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_DEFAULT_ID' tabindex=0></select></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.quickAddPrefLabel;
	buffer[_i++] = ":</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_USE_QUICK_ADD' tabindex=0 type=checkbox></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.timezonePrefLabel;
	buffer[_i++] = ":</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SHOW_TIMEZONE' tabindex=0 type=checkbox></td></tr></table></td></tr></table>";
	
		}
		else if (appCtxt.multiAccounts &&
				data.activeAccount.isZimbraAccount &&
				appCtxt.getSettings(data.activeAccount).attrExists(ZmSetting.CAL_AUTO_ADD_INVITES))
		{
		
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.general;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_AUTO_ADD_INVITES' tabindex=0 type=checkbox></td></tr></table></td></tr></table>";
	 } 
	 if (data.isAclSupported) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.calPerms;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\"><tr><td colspan=2>";
	buffer[_i++] =  AjxMessageFormat.format(ZmMsg.calPermsNote, data.domain) ;
	buffer[_i++] = "</td></tr><tr><td colspan=2>&nbsp;</td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.freeBusyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_FREE_BUSY_ACL' tabindex=0></div></td></tr><tr><td>&nbsp;</td><td><textarea id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_FREE_BUSY_ACL_USERS' tabindex=0 rows=3 cols=70></textarea></td></tr><tr><td class='ZOptionsLabelTop'>";
	buffer[_i++] = ZmMsg.invitesLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_INVITE_ACL' tabindex=0></div></td></tr><tr><td>&nbsp;</td><td><textarea id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_INVITE_ACL_USERS' tabindex=0 rows=3 cols=70></textarea></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_SEND_INV_DENIED_REPLY' tabindex=0 type=checkbox></td></tr></table></td></tr></table>";
	 } 
	buffer[_i++] = "<div class='prefHeader'>Apple iCal</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td colspan=2>";
	buffer[_i++] = ZmMsg.calAppleICalNote ;
	buffer[_i++] = "</td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ENABLE_APPL_ICAL_DELEGATION' tabindex=0 type=checkbox></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Calendar"
}, false);

AjxTemplate.register("prefs.Pages#WorkHours", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100%><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.calendarWorkWeek ;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_0' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_1' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_2' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_3' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_4' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_5' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_6' tabindex=0></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.calendarWorkHours ;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_HOURS_NORMAL'><td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursNormal ;
	buffer[_i++] = " <td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_HOURS_CUSTOM'><td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursCustom ;
	buffer[_i++] = " <td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_CUSTOM_WORK_HOURS'></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsField'>";
	buffer[_i++] = ZmMsg.calendarWorkHoursDisclaimer ;
	buffer[_i++] = " ";
	buffer[_i++] = AjxTimezone.getMediumName(appCtxt.get(ZmSetting.DEFAULT_TIMEZONE)) ;
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#WorkHours"
}, false);

AjxTemplate.register("prefs.Pages#CustomWorkHoursDlg", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6' width=300><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_0' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_0' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_0' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_1' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_1' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_1' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_2' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_2' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_2' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_3' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_3' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_3' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_4' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_4' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_4' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_5' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_5' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_5' tabindex=0></td></tr><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_DAY_6' tabindex=0></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_START_TIME_6' tabindex=0></td><td> ";
	buffer[_i++] = ZmMsg.calendarWorkHoursDelimiter ;
	buffer[_i++] = " </td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CAL_WORKING_END_TIME_6' tabindex=0></td></tr><tr><td colspan=\"4\">";
	buffer[_i++] = ZmMsg.calendarWorkHoursDisclaimer ;
	buffer[_i++] = AjxTimezone.getMediumName(appCtxt.get(ZmSetting.DEFAULT_TIMEZONE)) ;
	buffer[_i++] = "</td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#CustomWorkHoursDlg"
}, false);

AjxTemplate.register("prefs.Pages#Shortcuts", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.keyboardShortcuts;
	buffer[_i++] = "</div><div align=\"right\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHORTCUT_PRINT' style='width:80px;'></div></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SHORTCUT_LIST'></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Shortcuts"
}, false);

AjxTemplate.register("prefs.Pages#AccountTestContent", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_accts' class='ZmDataSourceTestTable ZPropertySheet' cellspacing='6'><tr><th>";
	buffer[_i++] = ZmMsg.account;
	buffer[_i++] = "</th><th>";
	buffer[_i++] = ZmMsg.status;
	buffer[_i++] = "</th></tr>";
	 for (var i = 0; i < data.accounts.length; i++) { 
	buffer[_i++] =  AjxTemplate.expand("#AccountTestItem", { id: data.id, account: data.accounts[i] }) ;
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#AccountTestContent"
}, false);

AjxTemplate.register("prefs.Pages#AccountTestItem", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr><td class='ZmTestItem'>";
	buffer[_i++] = AjxStringUtil.htmlEncode(data.account.name);
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["account"]["id"];
	buffer[_i++] = "_test_status' class='ZmTestStatus'></td></tr><tr id='";
	buffer[_i++] = data["account"]["id"];
	buffer[_i++] = "_test_details' style='display:none'><td><table role=\"presentation\" border='0'><tr valign='top'><td class='ZmTestError'>";
	buffer[_i++] = ZmMsg.errorLabel;
	buffer[_i++] = "</td><td id='";
	buffer[_i++] = data["account"]["id"];
	buffer[_i++] = "_test_error' class='ZmTestError'></td></tr><tr valign='top'><td class='ZmTestNote'>";
	buffer[_i++] = ZmMsg.noteLabel;
	buffer[_i++] = "</td><td class='ZmTestNote'>";
	buffer[_i++] = ZmMsg.popAccountTestNote;
	buffer[_i++] = "</td></tr></table></td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#AccountTestItem"
}, false);

AjxTemplate.register("prefs.Pages#Import", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = data["label"];
	buffer[_i++] = "</td><td class='ZOptionsInfo'><form id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_form'\n";
	buffer[_i++] = "\t\t\t\taction='";
	buffer[_i++] = data["action"];
	buffer[_i++] = "' method='POST' enctype='multipart/form-data'\n";
	buffer[_i++] = "\t\t\t\tstyle='margin:0; padding:0;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_input' tabindex=0\n";
	buffer[_i++] = "\t\t\t\t\t\ttype='file' name='";
	buffer[_i++] = data["name"];
	buffer[_i++] = "'\n";
	buffer[_i++] = "\t\t\t\t\t\tstyle='font-family:Tahoma; font-size:10px'></form></td></tr><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsInfo'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_button' tabindex=0></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Import"
}, false);

AjxTemplate.register("prefs.Pages#Export", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>&nbsp;</td><td class='ZOptionsInfo'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_options' tabindex=\"10\"></div></td><td class='ZOptionsInfo'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_button' tabindex=\"20\"></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Export"
}, false);

AjxTemplate.register("prefs.Pages#Zimlets", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.zimlets;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div style='margin-bottom:1em;'>";
	buffer[_i++] = ZmMsg.zimletsPrefsMsg;
	buffer[_i++] = "</div></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CHECKED_ZIMLETS' tabindex=0></div></td></tr></table></td></tr></table>";
	 if (appCtxt.isOffline) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.zimletInstall;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td><div>";
	buffer[_i++] = ZmMsg.zimletsPrefsUpload;
	buffer[_i++] = "</div><br/></td></tr><tr><td><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.fileLabel;
	buffer[_i++] = "</td><td><form id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_form' action='";
	buffer[_i++] = data["action"];
	buffer[_i++] = "' method='POST' enctype='multipart/form-data' style='margin:0px; padding:0px;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_input' tabindex=0 type='file' name='zimletUpload' style='font-family:Tahoma; font-size:10px'></form></td></tr><tr><td></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_button'></td></tr></table></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.zimletSyncData;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td><select id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_ZIMLET_SYNC_ACCOUNT_ID' tabindex=0></select></td></tr></table></td></tr></table>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Zimlets"
}, false);

AjxTemplate.register("prefs.Pages#BackUp", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.offlineBackupHeader;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'></td><td class='ZOptionsField' colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_button' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.offlineBackUpAccounts;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_BACKUP_ACCOUNT_ID' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.offlineBackUpInterval;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_BACKUP_INTERVAL' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.offlineBackUpPath;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_BACKUP_PATH' tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.offlineBackUpRetention;
	buffer[_i++] = "</td><td class='ZOptionsField' width=\"2%\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_BACKUP_KEEP' tabindex=0></div></td><td>";
	buffer[_i++] = ZmMsg.offlineBackUpKeep;
	buffer[_i++] = "</td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.offlineBackUpRestore;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsField' colspan=2><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_BACKUP_RESTORE' tabindex=0></div></td></tr><tr><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_restore_button' tabindex=0></div></td><td>&nbsp;</td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#BackUp"
}, false);

AjxTemplate.register("prefs.Pages#SharingPrefPage", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class=\"rightAlign prefHeaderComment\">";
	buffer[_i++] = ZmMsg.sharingChangesSavedImmediately;
	buffer[_i++] = "</div><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.pendingSharesTitle;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_shareForm'></div></td></tr></table></td></tr><tr><td class='ZOptionsSectionMain'><div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_pendingShares'></div></div></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.mountedSharesTitle;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_mountedShares'></div></div></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.sharingByMe;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sharesBy'></div></td></tr><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100%><tr><td><div class=\"sharingPageListTitle\">";
	buffer[_i++] = ZmMsg.shareAFolder;
	buffer[_i++] = "</div></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_grantForm'></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#SharingPrefPage"
}, false);

AjxTemplate.register("prefs.Pages#ShareForm", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td colspan=3><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_group\" class=\"ZOptionsInfo\" tabindex=0></div></td></tr><tr><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_user\" class=\"ZOptionsInfo\" tabindex=0></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_owner\" class=\"ZOptionsInfo\" tabindex=0></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_findButton\" tabindex=0></div></td></tr></table><br/>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#ShareForm"
}, false);

AjxTemplate.register("prefs.Pages#GrantForm", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div>";
	buffer[_i++] = ZmMsg.grantFormText;
	buffer[_i++] = "</div><br/><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td>";
	buffer[_i++] = ZmMsg.folderType;
	buffer[_i++] = "</td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_folderType' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_shareButton' tabindex=0></div></td></tr></table><br/>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#GrantForm"
}, false);

AjxTemplate.register("prefs.Pages#MobileDevices", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class=\"rightAlign prefHeaderComment\">";
	buffer[_i++] = ZmMsg.mobileDeviceChangesSavedImmediately;
	buffer[_i++] = "</div><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.mobileDevices;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_deviceList' tabindex=0></div></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_deviceToolbar' tabindex=0></div></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.oAuthAuthorizedApps;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_oauthconsumerapps' tabindex=0></div></td></tr></table></td></tr></table><div class='prefHeader'>";
	buffer[_i++] = ZmMsg.mobileConfiguration;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td><div style=\"margin-bottom:12px\">";
	buffer[_i++] = ZmMsg.mobileConfigurationInstruction;
	buffer[_i++] = "</div><div>";
	buffer[_i++] = ZmMsg.mobileConfigurationOptions;
	buffer[_i++] = "</div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_mobileConfig'></div></td></tr><tr><td colspan=2><hr /></td></tr><tr><td><div>";
	buffer[_i++] = ZmMsg.mobileConfigurationUrls;
	buffer[_i++] = "</div><br/><div><textarea rows='1' cols='100%' class='ZmMobileConfigTextarea' readonly>&bull;&ensp;";
	buffer[_i++] = AjxMessageFormat.format(ZmMsg.mobileConfigurationUrlCalDAV, [location.hostname, appCtxt.get(ZmSetting.USERNAME)]);
	buffer[_i++] = "</textarea></div><div><textarea rows='1' cols='100%' class='ZmMobileConfigTextarea' readonly>&bull;&ensp;";
	buffer[_i++] = AjxMessageFormat.format(ZmMsg.mobileConfigurationUrlCardDAV, [location.hostname, appCtxt.get(ZmSetting.USERNAME)]);
	buffer[_i++] = "</textarea></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MobileDevices"
}, false);

AjxTemplate.register("prefs.Pages#MobileConfig", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div>";
	buffer[_i++] = ZmMsg.mobileConfigurationDownload;
	buffer[_i++] = "</div><br /><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td><div>";
	buffer[_i++] = ZmMsg.mobileConfigurationDownloadList;
	buffer[_i++] = "</div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_configType' tabindex=0></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_downloadButton' tabindex=0></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MobileConfig"
}, false);

AjxTemplate.register("prefs.Pages#MobileDeviceInfo", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td>";
	buffer[_i++] = ZmMsg.mobileDevice;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.type;
	buffer[_i++] = "</td></tr><tr><td>";
	buffer[_i++] = ZmMsg.mobileUserAgent;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.ua;
	buffer[_i++] = "</td></tr><tr><td>";
	buffer[_i++] = ZmMsg.mobileDeviceId;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.id;
	buffer[_i++] = "</td></tr><tr><td>";
	buffer[_i++] = ZmMsg.mobileProtocolVersion;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.protocol;
	buffer[_i++] = "</td></tr><tr><td>";
	buffer[_i++] = ZmMsg.mobileProvisionable;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.provisionable ? AjxMsg.yes : AjxMsg.no ;
	buffer[_i++] = "</td></tr><tr><td>";
	buffer[_i++] = ZmMsg.status;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.getStatusString();
	buffer[_i++] = "</td></tr>";
	 if (data.device.firstReqReceived) { 
	buffer[_i++] = "<tr><td>";
	buffer[_i++] = ZmMsg.mobileFirstReqReceived;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.getFirstReqReceivedString();
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.device.lastPolicyUpdate) { 
	buffer[_i++] = "<tr><td>";
	buffer[_i++] = ZmMsg.mobileLastPolicyUpdate;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.getLastPolicyUpdateString();
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.device.remoteWipeReqTime) { 
	buffer[_i++] = "<tr><td>";
	buffer[_i++] = ZmMsg.mobileRemoteWipeReq;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.getRemoteWipeReqTimeString();
	buffer[_i++] = "</td></tr>";
	 } 
	 if (data.device.remoteWipeAckTime) { 
	buffer[_i++] = "<tr><td>";
	buffer[_i++] = ZmMsg.mobileRemoteWipeAck;
	buffer[_i++] = ":</td><td>";
	buffer[_i++] = data.device.getRemoteWipeAckTimeString();
	buffer[_i++] = "</td></tr>";
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MobileDeviceInfo"
}, false);

AjxTemplate.register("prefs.Pages#Notifications", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.notificationsEmail;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><!--<tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.emailNotificationsLabel;
	buffer[_i++] = "</td>--><!--<td class='ZOptionsField'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EMAIL_ENABLED' tabindex=0 type='checkbox'></td>--><!--</tr>--><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.emailNotificationsDescription;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EMAIL' tabindex=0></div></td></tr></table></td></tr></table>";
	 if (appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ENABLED)) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.notificationsDeviceEmail;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable ZDeviceOptionsTable' width='100%'><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsRegionLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=\"4\"><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_REGION' tabindex=0></div></td></tr></table></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsCarrierLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=\"4\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CARRIER' tabindex=0></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_PHONE_row'><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsPhoneNumberLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=\"3\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_PHONE' tabindex=0></div></td><td class=\"ZOptionsField\"><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_PHONE_SEND_CODE\" tabindex=0></div></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CUSTOM_NUMBER_row\"><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsCustomeEmailLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CUSTOM_NUMBER' tabindex=0></div></td><td class=\"ZOptionsField\">@</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CUSTOM_ADDRESS' tabindex=0></div></td><td class=\"ZOptionsField\"><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CUSTOM_SEND_CODE\" tabindex=0></div></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_PHONE_HINT_row'><td></td><td class=\"ZOptionsInfo\" colspan=\"4\"><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_PHONE_HINT\"></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsVerificationCodeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=\"3\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CODE' tabindex=0></div></td><td class=\"ZOptionsField\"><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CODE_VALIDATE\" tabindex=0></div></td></tr><tr><td class='ZOptionsLabel'>";
	buffer[_i++] = ZmMsg.deviceEmailNotificationsVerificationStatusLabel;
	buffer[_i++] = "</td><td class='ZOptionsField' colspan=\"3\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CODE_STATUS' tabindex=0></div></td><td class=\"ZOptionsField\"><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DEVICE_EMAIL_CODE_INVALIDATE\" tabindex=0></div></td></tr></table></td></tr></table>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#Notifications"
}, false);

AjxTemplate.register("prefs.Pages#QuickCommandList", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.quickCommands;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=100% ><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_toolbar' tabindex=0></div></td></tr><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_list' tabindex=0></div></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#QuickCommandList"
}, false);

AjxTemplate.register("prefs.Pages#QuickCommandDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style=\"height:400px; width:450px\"><table role=\"presentation\" style='width:100%; height:100px'><tr><td width='1%' nowrap>";
	buffer[_i++] = ZmMsg.quickCommandNameLabel;
	buffer[_i++] = "</td><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name' type='text' style=\"width:185px\" tabindex=0 maxlength='25'></td><td width='1%' style='text-align:right; white-space:nowrap;'><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_active' type='checkbox' name='cbActive' tabindex=0><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_active'>";
	buffer[_i++] = ZmMsg.active;
	buffer[_i++] = "</label></td></tr><tr><td width='1%' nowrap>";
	buffer[_i++] = ZmMsg.description;
	buffer[_i++] = "</td><td colspan=\"2\"><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_description' type='text' style=\"width:250px\" tabindex=0maxlength='100'></td></tr><tr><td width='1%' nowrap>";
	buffer[_i++] = ZmMsg.itemType;
	buffer[_i++] = "</td><td colspan=\"2\" id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_itemTypeContainer\"></td></tr></table><div style='height:350px'><div style='margin-bottom:5px; vertical-align:bottom'><p style='color:#555555; float:left'>";
	buffer[_i++] = ZmMsg.quickCommandActions;
	buffer[_i++] = "</p><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_addButtonContainer\" style='float:right'></div></div><fieldset class='FilterRuleSection' style='width:417px; height:250px; clear:both'><div style='overflow-x:hidden; overflow-y:scroll; height:100%'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_actions' width='100%' tabindex=0><tbody id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_actionsTbody\"></tbody></table></div></fieldset></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#QuickCommandDialog"
}, false);

AjxTemplate.register("prefs.Pages#QuickCommandDialogActionRow", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr style='width:100%' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "'><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_activeContainer' style='padding:3px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_typeContainer' style='padding:3px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_valueContainer' style='padding:3px'></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_buttonsContainer' style='padding:3px' nowrap=nowrap'></td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#QuickCommandDialogActionRow"
}, false);

AjxTemplate.register("prefs.Pages#GrantRightsDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name_row'><td class=\"Label\" style=\"padding-right:10px\">";
	buffer[_i++] = ZmMsg.emailLabel;
	buffer[_i++] = "</td><td id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_name_cell\"></td></tr><tr><td class=\"Label\">&nbsp;</td><td><table role=\"presentation\"><tr><td><input type=\"checkbox\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendAs'></td><td><label class=\"Text\" for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendAs'\n";
	buffer[_i++] = "\t\t\t\t\t\t\tstyle=\"text-align:left\">";
	buffer[_i++] = ZmMsg.sendAs;
	buffer[_i++] = "</label></td></tr><tr><td><input type=\"checkbox\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendObo'></td><td><label class=\"Text\" for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_sendObo'\n";
	buffer[_i++] = "\t\t\t\t\t\t\tstyle=\"text-align:left\">";
	buffer[_i++] = ZmMsg.sendOnBehalfOflbl;
	buffer[_i++] = "</label></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#GrantRightsDialog"
}, false);

AjxTemplate.register("prefs.Pages#ActivityStreamPrompt", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td colspan='2'><div class='horizSep'></div></td></tr><tr><td class='ZOptionsLabelLeft'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SENTTO'></div></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TO'></div></td></tr><tr><td class='ZOptionsLabelLeft'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RECEIVED'></div></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FROM'></div></td></tr><tr><td class='ZOptionsLabelLeft'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SUBJECT'></div></td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_CONTAINS'></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#ActivityStreamPrompt"
}, false);

AjxTemplate.register("prefs.Pages#PriorityMessageFilterPrompt", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='width:475px;'>";
	buffer[_i++] = ZmMsg.priorityFilterDescription;
	buffer[_i++] = "</div><div class='horizSep'></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MOVE_MSG_STREAM'></div><div class=\"ZmActivityStreamFilterList\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DL_SUBSCRIBED'></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_MASS_MARKETING'></div><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NOT_TO_ME'></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SELECT_FIELD' style='margin:0 .5em;'></div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NOT_TO_ME_CONT'>";
	buffer[_i++] = ZmMsg.field;
	buffer[_i++] = "</div></td></tr></table><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_NOT_IN_ADDR'></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#PriorityMessageFilterPrompt"
}, false);

AjxTemplate.register("prefs.Pages#PriorityMessageRunNowPrompt", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='width:350px;' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "'><div style='float:left; padding-right:10px; height:50px'>";
	buffer[_i++] = AjxImg.getImageHtml("Warning");
	buffer[_i++] = "</div><div>";
	buffer[_i++] = ZmMsg.runPriorityFilterPrompt;
	buffer[_i++] = "</div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#PriorityMessageRunNowPrompt"
}, false);

AjxTemplate.register("prefs.Pages#MailFilterListView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%' align='center'><tr><td id='";
	buffer[_i++] = data["targetDivId"];
	buffer[_i++] = "' width=\"45%\"></td><td valign='top' id='";
	buffer[_i++] = data["buttonsDivId"];
	buffer[_i++] = "'><div id='";
	buffer[_i++] = data["transferButtonId"];
	buffer[_i++] = "'\tstyle='padding:30px 0 5px'></div><div id='";
	buffer[_i++] = data["removeButtonId"];
	buffer[_i++] = "'\t\tstyle='padding-bottom:20px'></div><div id='";
	buffer[_i++] = data["moveUpButtonId"];
	buffer[_i++] = "'\t\tstyle='padding-bottom:5px'></div><div id='";
	buffer[_i++] = data["moveDownButtonId"];
	buffer[_i++] = "'\tstyle='padding-bottom:20px'></div></td><td id='";
	buffer[_i++] = data["sourceDivId"];
	buffer[_i++] = "' width=\"45%\"></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#MailFilterListView"
}, false);

AjxTemplate.register("prefs.Pages#OutOfOffice", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg.outOfOffice;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width='100%' class='ZPropertySheet' cellspacing='6'><tr><td class=\"ZOptionsLabel\" style=\"vertical-align:top;width:inherit;\">";
	buffer[_i++] = ZmMsg.outOfOfficeLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_MSG_ENABLED' tabindex=0></div></td></tr><tr><td class=\"ZOptionsLabel\" style=\"vertical-align:top;width:inherit;\">";
	buffer[_i++] = ZmMsg.autoReplyLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\" class=\"ZPropertySheet\" cellspacing='6'><tr><td><textarea id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_MSG' tabindex=0 rows=6 cols=70></textarea><span style=\"display:none\"><input type=\"hidden\" name=\"st_dt\" id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_FROM\"/><input type=\"hidden\" name=\"ed_dt\" id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_UNTIL\"/></span></td></tr></table></td><tr><tr><td class=\"ZOptionsLabel\" style=\"vertical-align:top;width:inherit;\">";
	buffer[_i++] = ZmMsg.externalSendersLabel;
	buffer[_i++] = "</td><td class='ZOptionsField'><table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_EXTERNAL_SUPPRESS' tabindex=0 size='3'></div></td></tr></table><textarea id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_EXTERNAL_MSG' tabindex=0 rows=6 cols=70 onfocus=\"this.rows=10;\"></textarea></td></tr><tr><td class=\"ZOptionsLabel\" style=\"vertical-align:top;width:inherit;\">";
	buffer[_i++] = ZmMsg.timePeriodLabel;
	buffer[_i++] = "</td><td><table role=\"presentation\"><tr><td><input type=\"checkbox\" id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_DURATION_ENABLED\" tabindex=0></td></tr><tr><td><table role=\"presentation\" class='ZPropertySheet' cellspacing='6'><tr><td align=\"right\">";
	buffer[_i++] = ZmMsg.startLabel;
	buffer[_i++] = "</td><td class='ZmOOODuration' ><table role=\"presentation\"><tr><td><input style='height:22px;' type='text' autocomplete='off' size=14 maxlength=10 id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_FROM1'></td><td class=\"miniCalendarButton\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_startMiniCal'></td></tr></table></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_FROM_TIME' class='ZmOOODuration' ></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_DURATION_ALL_DAY' class='ZmOOODuration' ></div></td></tr><tr><td align=\"right\">";
	buffer[_i++] = ZmMsg.endLabel;
	buffer[_i++] = "</td><td class='ZmOOODuration'><table role=\"presentation\"><tr><td><input style='height:22px;' type='text' autocomplete='off' size=14 maxlength=10 id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_UNTIL1'></td><td class=\"miniCalendarButton\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_endMiniCal'></td></tr></table></td><td colspan=\"2\" class='ZmOOODuration' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_UNTIL_TIME'></td></tr><tr><td align=\"right\">";
	buffer[_i++] = ZmMsg.vacationCalMsg;
	buffer[_i++] = "</td><td colspan=\"3\"><table role=\"presentation\"><tr><td class='ZmOOOCalendar'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_CALENDAR_ENABLED' tabindex=0></div></td><td class='ZmOOOCalendar'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_VACATION_CALENDAR_TYPE' tabindex=0 size='3'></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#OutOfOffice"
}, false);

AjxTemplate.register("prefs.Pages#OfflineSettings", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='width:475px;'><div>";
	buffer[_i++] = ZmMsg.offlineDescription;
	buffer[_i++] = "</div><div class='horizSep'></div><div class='ZmOfflineItem'><table role=\"presentation\" class='ZRadioButtonTable'><tr><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ENABLE_OFFLINE_RADIO' type=radio name='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_SETTING'\n";
	buffer[_i++] = "                    ";
	 if (data.isWebClientOfflineSupported) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "                        checked\n";
	buffer[_i++] = "                    ";
	 } 
	buffer[_i++] = " ></td><td><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ENABLE_OFFLINE_RADIO' class='Text'>";
	buffer[_i++] = ZmMsg.enableOffline;
	buffer[_i++] = "</label></td></tr></table><div class='ZmOfflineDetails'>";
	buffer[_i++] = ZmMsg.enableOfflineDetails;
	buffer[_i++] = "</div></div><div class='ZmOfflineItem'><table role=\"presentation\" class='ZRadioButtonTable'><tr><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DISABLE_OFFLINE_RADIO' type=radio name='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_OFFLINE_SETTING'\n";
	buffer[_i++] = "                    ";
	 if (!data.isWebClientOfflineSupported) { 
	buffer[_i++] = "\n";
	buffer[_i++] = "                        checked\n";
	buffer[_i++] = "                    ";
	 } 
	buffer[_i++] = " ></td><td><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DISABLE_OFFLINE_RADIO' class='Text'>";
	buffer[_i++] = ZmMsg.disableOffline;
	buffer[_i++] = "</label></td><tr></table><div class='ZmOfflineDetails'>";
	buffer[_i++] = ZmMsg.disableOfflineDetails;
	buffer[_i++] = "</div></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#OfflineSettings"
}, false);

AjxTemplate.register("prefs.Pages#OneTimeCodes", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='ZmOneTimeCodes'>";
	 if (data.oneTimeCodes) {
	buffer[_i++] = "<ol>";
	 for (var i = 0; i < data.oneTimeCodes.length; i++) {
	buffer[_i++] = "<li><span>";
	buffer[_i++] = data.oneTimeCodes[i];
	buffer[_i++] = "</span></li>";
	 } 
	buffer[_i++] = "</ol>";
	 } 
	buffer[_i++] = "</div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#OneTimeCodes"
}, false);

AjxTemplate.register("prefs.Pages#OneTimeCodesPrint", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<!DOCTYPE html><html><head><title>";
	buffer[_i++] = ZmMsg.twoStepAuthOneTimeCodesPrintTitle;
	buffer[_i++] = "</title><style>\n";
	buffer[_i++] = "\t\t\t\t.ZmOneTimeCodes {\n";
	buffer[_i++] = "\t\t\t\t\twidth:450px;\n";
	buffer[_i++] = "\t\t\t\t}\n";
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t.ZmOneTimeCodes LI {\n";
	buffer[_i++] = "\t\t\t\t\tmargin: 15px 15px 15px 45px;\n";
	buffer[_i++] = "\t\t\t\t\twidth: 120px;\n";
	buffer[_i++] = "\t\t\t\t\tfloat: left;\n";
	buffer[_i++] = "\t\t\t\t}\n";
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\t.ZmOneTimeCodes LI SPAN {\n";
	buffer[_i++] = "\t\t\t\t\tletter-spacing: 3px;\n";
	buffer[_i++] = "\t\t\t\t\tfont-weight: bold;\n";
	buffer[_i++] = "\t\t\t\t}\n";
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t\tP {\n";
	buffer[_i++] = "\t\t\t\t\tcolor:#999999;\n";
	buffer[_i++] = "\t\t\t\t\tclear:both;\n";
	buffer[_i++] = "\t\t\t\t\twidth:405px;\n";
	buffer[_i++] = "\t\t\t\t\ttext-align:center;\n";
	buffer[_i++] = "\t\t\t\t}\n";
	buffer[_i++] = "\t\t\t</style><link rel=\"SHORTCUT ICON\" href=\"/img/logo/favicon.ico\"></head><body>";
	buffer[_i++] = data.content;
	buffer[_i++] = "<p>";
	buffer[_i++] = ZmMsg.twoStepAuthOneTimeCodesTip;
	buffer[_i++] = "</p></body></html>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#OneTimeCodesPrint"
}, false);

AjxTemplate.register("prefs.Pages#AddApplicationCode", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div style='width:450px; height:120px;'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_name'><div style=\"padding:7px;\">";
	buffer[_i++] = ZmMsg.twoStepAuthAppCodeDesc1;
	buffer[_i++] = "</div><div style=\"text-align:center; margin:20px;\"><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_name_error' class=\"ZmAppNameError ZmTwoFactorSetupError\"></div><label style=\"margin:10px;\" for=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_name_input\">";
	buffer[_i++] = ZmMsg.twoStepAuthAppName;
	buffer[_i++] = "</label><input type=\"text\" id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_name_input\" autocomplete=\"off\" size=\"30\"/></div></div><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_passcode'><div style=\"padding:7px;\">";
	buffer[_i++] = ZmMsg.twoStepAuthAppCodeDesc2;
	buffer[_i++] = "</div><div style=\"text-align:center; margin:10px;\">";
	buffer[_i++] = ZmMsg.twoStepAuthAppPasscode;
	buffer[_i++] = "<span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_app_passcode_value\" class=\"ZmAppPasscode\"></span></div></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "prefs.Pages#AddApplicationCode"
}, false);

}
if (AjxPackage.define("prefs.Widgets")) {
AjxTemplate.register("prefs.Widgets#infoBox", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_infoBox\" class='ZInfoBox'><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_infoBox_outer' width='100%'><tr><td rowspan=2 style='vertical-align:top'><div class='ImgInformation_32'></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_infoBox_close\" class=\"ZInfoTitleClose\" onclick='Dwt.toggle(\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_infoBox_container\")'>";
	buffer[_i++] =  ZmMsg.close ;
	buffer[_i++] = "</div><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title\" class='ZInfoTitle'>";
	buffer[_i++] = data["_labels"]["infoTitle"];
	buffer[_i++] = "</div></td></tr><tr><td id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_body\">";
	buffer[_i++] = data["_labels"]["infoContents"];
	buffer[_i++] = "</td></tr></table></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"xml:space": "strip",
	"id": "prefs.Widgets#infoBox"
}, false);
AjxTemplate.register("prefs.Widgets", AjxTemplate.getTemplate("prefs.Widgets#infoBox"), AjxTemplate.getParams("prefs.Widgets#infoBox"));

}
