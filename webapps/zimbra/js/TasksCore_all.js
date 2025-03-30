if (AjxPackage.define("TasksCore")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: TasksCore
 * 
 * Supports: Creation of a tasks folder
 * 
 * Loaded:
 *  - If a task folder arrives in a <refresh> block
 *  - If a search for tasks returns results
 */
if (AjxPackage.define("zimbraMail.tasks.model.ZmTaskFolder")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the task folder class.
 */

/**
 * Creates the task folder.
 * @class
 * This class represents a task folder.
 * 
 * @author Parag Shah
 *
 * @param	{Hash}	params		a hash of parameters
 * @param {int}	params.id			the numeric ID
 * @param {String}	params.name		the name
 * @param {ZmOrganizer}	params.parent		the parent organizer
 * @param {ZmTree}	params.tree		the tree model that contains this organizer
 * @param {String}	params.color	the color
 * @param {String}	params.url		the URL for this organizer's feed
 * @param {String}	params.owner	the owner
 * @param {String}	params.zid		the Zimbra id of owner, if remote share
 * @param {String}	params.rid		the remote id of organizer, if remote share
 * @param {String}	params.restUrl	[the REST URL of this organizer.
 * 
 * @extends		ZmFolder
 */
ZmTaskFolder = function(params) {
	params.type = ZmOrganizer.TASKS;
	ZmFolder.call(this, params);
}

ZmTaskFolder.prototype = new ZmFolder;
ZmTaskFolder.prototype.constructor = ZmTaskFolder;

// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmTaskFolder.prototype.toString =
function() {
	return "ZmTaskFolder";
};

ZmTaskFolder.prototype.getIcon =
function() {
	if (this.id == ZmFolder.ID_ROOT)	{ return null; }
	if (this.link)						{ return "SharedTaskList"; }
	return "TaskList";
};

ZmTaskFolder.prototype.supportsPublicAccess =
function() {
	// Task's can be accessed outside of ZCS (i.e. REST)
	return true;
};

/**
 * Sets the free/busy.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{Boolean}		exclude		checks to exclose free busy
 */
ZmTaskFolder.prototype.setFreeBusy =
function(exclude, callback, errorCallback) {
	if (this.excludeFreeBusy == exclude) return;
	// NOTE: Don't need to store the value since the response will
	//       report that the object was modified.
	this._organizerAction({action: "fb", attrs: {excludeFreeBusy: exclude ? "1" : "0"}, callback: callback, errorCallback: errorCallback});
};

ZmTaskFolder.prototype.mayContain =
function(what) {
	if (!what) return true;

	var invalid = false;

	if (this.id == ZmFolder.ID_ROOT) {
		// cannot drag anything onto root folder
		invalid = true;
	} else if (this.link) {
		// cannot drop anything onto a read-only task folder
		invalid = this.isReadOnly();
	}

	if (!invalid) {
		// An item or an array of items is being moved
		var items = (what instanceof Array) ? what : [what];
		var item = items[0];

		if (item.type != ZmItem.TASK) {
			// only tasks are valid for task folders
			invalid = true;
		} else {
			// can't move items to folder they're already in; we're okay if
			// we have one item from another folder
			if (!invalid && item.folderId) {
				invalid = true;
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					var folder = appCtxt.getById(item.folderId);
					if (folder != this) {
						invalid = false;
						break;
					}
				}
			}
		}
	}

	return !invalid;
};


// Callbacks

ZmTaskFolder.prototype.notifyCreate =
function(obj) {
	var t = ZmFolderTree.createFromJs(this, obj, this.tree);
	var i = ZmOrganizer.getSortIndex(t, ZmFolder.sortCompareNonMail);
	this.children.add(t, i);
	t._notify(ZmEvent.E_CREATE);
};

ZmTaskFolder.prototype.notifyModify =
function(obj) {
	ZmFolder.prototype.notifyModify.call(this, obj);

	if (obj.f != null && !obj._isRemote) {
		this._parseFlags(obj.f);
		// TODO: Should a F_EXCLUDE_FB property be added to ZmOrganizer?
		//       It doesn't make sense to require the base class to know about
		//       all the possible fields in sub-classes. So I'm just using the
		//       modified property name as the key.
		var fields = {};
		fields["excludeFreeBusy"] = true;
		this._notify(ZmEvent.E_MODIFY, {fields: fields});
	}
};


// Static methods

/**
 * Checks the name for validity
 * 
 * @return	{String}	an error message if the name is invalid; <code>null</code> if the name is valid.
 */
ZmTaskFolder.checkName =
function(name) {
	return ZmFolder.checkName(name);
};

}

if (AjxPackage.define("zimbraMail.tasks.controller.ZmTaskListController")) {
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
 * This file contains the task list controller class.
 */

/**
 * Creates the task list controller.
 * @class
 * This class represents the task list controller.
 * 
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						app							the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmListController
 */
ZmTaskListController = function(container, app, type, sessionId, searchResultsController) {

	ZmListController.apply(this, arguments);

	if (this.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
	}

	this._listeners[ZmOperation.EDIT]				= this._editListener.bind(this);
	this._listeners[ZmOperation.PRINT_TASK]			= this._printTaskListener.bind(this);
	this._listeners[ZmOperation.PRINT_TASKFOLDER]	= this._printTaskFolderListener.bind(this);
	this._listeners[ZmOperation.SHOW_ORIG]			= this._showOrigListener.bind(this);
	this._listeners[ZmOperation.MARK_AS_COMPLETED]	= this._markAsCompletedListener.bind(this);
    this._listeners[ZmOperation.DELETE]				= this._deleteListener.bind(this);

	this._listeners[ZmOperation.PRINT]				= null; // override base class to do nothing

    var pref = appCtxt.get(ZmSetting.TASKS_FILTERBY);
	this._currentTaskView = ZmTaskListController.FILTERBY_SETTING_ID[pref];
};

ZmTaskListController.prototype = new ZmListController;
ZmTaskListController.prototype.constructor = ZmTaskListController;

ZmTaskListController.prototype.isZmTaskListController = true;
ZmTaskListController.prototype.toString = function() { return "ZmTaskListController"; };

// Consts
ZmTaskListController.SORT_BY = [
	ZmId.VIEW_TASK_NOT_STARTED,
	ZmId.VIEW_TASK_COMPLETED,
	ZmId.VIEW_TASK_IN_PROGRESS,
	ZmId.VIEW_TASK_WAITING,
	ZmId.VIEW_TASK_DEFERRED,
	ZmId.VIEW_TASK_ALL,
    ZmId.VIEW_TASK_TODO    
];

ZmTaskListController.ICON = {};
ZmTaskListController.ICON[ZmId.VIEW_TASK_NOT_STARTED]		= "TaskViewNotStarted";
ZmTaskListController.ICON[ZmId.VIEW_TASK_COMPLETED]			= "TaskViewCompleted";
ZmTaskListController.ICON[ZmId.VIEW_TASK_IN_PROGRESS]		= "TaskViewInProgress";
ZmTaskListController.ICON[ZmId.VIEW_TASK_WAITING]			= "TaskViewWaiting";
ZmTaskListController.ICON[ZmId.VIEW_TASK_DEFERRED]			= "TaskViewDeferred";
ZmTaskListController.ICON[ZmId.VIEW_TASK_ALL]				= "TaskList";
ZmTaskListController.ICON[ZmId.VIEW_TASK_TODO]				= "TaskViewTodoList";

ZmTaskListController.MSG_KEY = {};
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_NOT_STARTED]	= "notStarted";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_COMPLETED]		= "completed";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_IN_PROGRESS]	= "inProgress";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_WAITING]		= "waitingOn";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_DEFERRED]		= "deferred";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_ALL]			= "all";
ZmTaskListController.MSG_KEY[ZmId.VIEW_TASK_TODO]			= "todoList";

ZmTaskListController.FILTERBY_SETTING = {};
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_NOT_STARTED]	= ZmSetting.TASK_FILTER_NOTSTARTED;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_COMPLETED]		= ZmSetting.TASK_FILTER_COMPLETED;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_IN_PROGRESS]	= ZmSetting.TASK_FILTER_INPROGRESS;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_WAITING]		= ZmSetting.TASK_FILTER_WAITING;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_DEFERRED]		= ZmSetting.TASK_FILTER_DEFERRED;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_ALL]			= ZmSetting.TASK_FILTER_ALL;
ZmTaskListController.FILTERBY_SETTING[ZmId.VIEW_TASK_TODO]			= ZmSetting.TASK_FILTER_TODO;

ZmTaskListController.FILTERBY_SETTING_ID = {};
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_NOTSTARTED]	= ZmId.VIEW_TASK_NOT_STARTED;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_COMPLETED]	= ZmId.VIEW_TASK_COMPLETED;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_INPROGRESS]	= ZmId.VIEW_TASK_IN_PROGRESS;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_WAITING]		= ZmId.VIEW_TASK_WAITING;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_DEFERRED]    = ZmId.VIEW_TASK_DEFERRED;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_ALL]			= ZmId.VIEW_TASK_ALL;
ZmTaskListController.FILTERBY_SETTING_ID[ZmSetting.TASK_FILTER_TODO]		= ZmId.VIEW_TASK_TODO;

/**
 * Defines the status.
 */
ZmTaskListController.SOAP_STATUS = {};
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_NOT_STARTED]= "NEED";
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_COMPLETED]	= "COMP";
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_IN_PROGRESS]= "INPR";
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_WAITING]	= "WAITING";
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_DEFERRED]	= "DEFERRED";
ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_TODO]	= "NEED,INPR,WAITING";


// reading pane options
ZmTaskListController.READING_PANE_TEXT = {};
ZmTaskListController.READING_PANE_TEXT[ZmSetting.RP_OFF]	= ZmMsg.readingPaneOff;
ZmTaskListController.READING_PANE_TEXT[ZmSetting.RP_BOTTOM]	= ZmMsg.readingPaneAtBottom;
ZmTaskListController.READING_PANE_TEXT[ZmSetting.RP_RIGHT]	= ZmMsg.readingPaneOnRight;

// convert key mapping to view menu item
ZmTaskListController.ACTION_CODE_TO_MENU_ID = {};
ZmTaskListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_OFF]		= ZmSetting.RP_OFF;
ZmTaskListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_BOTTOM]	= ZmSetting.RP_BOTTOM;
ZmTaskListController.ACTION_CODE_TO_MENU_ID[ZmKeyMap.READING_PANE_RIGHT]	= ZmSetting.RP_RIGHT;

ZmTaskListController.READING_PANE_ICON = {};
ZmTaskListController.READING_PANE_ICON[ZmSetting.RP_OFF]	= "SplitPaneOff";
ZmTaskListController.READING_PANE_ICON[ZmSetting.RP_BOTTOM]	= "SplitPane";
ZmTaskListController.READING_PANE_ICON[ZmSetting.RP_RIGHT]	= "SplitPaneVertical";

ZmTaskListController.RP_IDS = [ZmSetting.RP_BOTTOM, ZmSetting.RP_RIGHT, ZmSetting.RP_OFF];

// Public methods

ZmTaskListController.prototype.show =
function(results, folderId) {

	this._folderId = folderId;

	this.setList(results.getResults(ZmItem.TASK));

	// XXX: WHY?
	// find out if we just searched for a shared tasks folder
	var folder = appCtxt.getById(folderId);
	this._list._isShared = folder ? folder.link : false;
	this._list.setHasMore(results.getAttribute("more"));

	ZmListController.prototype.show.call(this, results);

    if (this._taskMultiView) {
		var tlv = this._taskMultiView._taskListView;
		tlv._saveState({selection:true});
		tlv.reset();
	}
    //Generate view Id again as loading the read only view changes the viewId of the TaskListView
    var viewId = [this.getCurrentViewType(), this.getSessionId()].join(ZmController.SESSION_ID_SEP);

	this._setup(viewId);

	// reset offset if list view has been created
	var lv = this.getListView();
	if (lv) { lv.offset = 0; }

	var elements = this.getViewElements(viewId, this._taskMultiView);
	
	this._setView({ view:		viewId,
					viewType:	this._currentViewType,
					noPush:		this.isSearchResults,
					elements:	elements,
					isAppView:	true});
	if (this.isSearchResults) {
		// if we are switching views, make sure app view mgr is up to date on search view's components
		appCtxt.getAppViewMgr().setViewComponents(this.searchResultsController.getCurrentViewId(), elements, true);
	}

	this._setTabGroup(this._tabGroups[viewId]);
	this._resetNavToolBarButtons(viewId);

    // do this last
	if (!this._taskTreeController) {
		this._taskTreeController = appCtxt.getOverviewController().getTreeController(ZmOrganizer.TASKS);
		DBG.timePt("getting tree controller", true);
	}

	var origin = results && results.search && results.search.origin;
	this.getListView().setTaskInputVisible((folderId != ZmOrganizer.ID_TRASH) && (origin !== "Search") &&  (origin !== "SearchResults"));
};

ZmTaskListController.prototype.getCurrentView = 
function() {
	return this._taskMultiView;
};

ZmTaskListController.prototype.getListView =
function() {
	return this._taskListView;
};

ZmTaskListController.prototype._getDefaultFocusItem =
function() {
	return this.getListView();
};

/**
 * Switches the view.
 * 
 * @param	{DwtComposite}		view		the view
 */
ZmTaskListController.prototype.switchView =
function(view) {
	if (this._currentTaskView == view) { return; }
	this._currentTaskView = view;
    if (view == ZmSetting.RP_OFF ||	view == ZmSetting.RP_BOTTOM || view == ZmSetting.RP_RIGHT) {
		this._taskListView._colHeaderActionMenu = null;
		if (view != this._getReadingPanePref()) {
			this._setReadingPanePref(view);
			this._taskMultiView.setReadingPane();
		}
        // always reset the view menu button icon to reflect the current view
        var btn = this._toolbar[this._currentViewId].getButton(ZmOperation.VIEW_MENU);
        btn.setImage(ZmTaskListController.READING_PANE_ICON[view]);
	} else {
        if(view != this._getFilterByPref() && !appCtxt.isExternalAccount()) {
            this._setFilterByPref(ZmTaskListController.FILTERBY_SETTING[view]);
        }
	}
	var sc = appCtxt.getSearchController();
	var soapStatus = ZmTaskListController.SOAP_STATUS[view];
    var currentSearch =  appCtxt.getCurrentSearch();
    if (currentSearch) sc.redoSearch(currentSearch, false, {allowableTaskStatus:soapStatus});
};

/**
 * Gets the task status.
 * 
 * @return	{constant}	the status (see {@link ZmTaskListController.SOAP_STATUS})
 */
ZmTaskListController.prototype.getAllowableTaskStatus =
function() {
    var prefFilter = this._getFilterByPref();
	var id = ZmTaskListController.FILTERBY_SETTING_ID[prefFilter];
	return ZmTaskListController.SOAP_STATUS[id];
};

ZmTaskListController.prototype._updateViewMenu =
function(id) {
	var viewBtn = this._toolbar[this._currentViewId].getButton(ZmOperation.VIEW_MENU);
	var menu = viewBtn && viewBtn.getMenu();
	if (menu) {
		var mi = menu.getItemById(ZmOperation.MENUITEM_ID, id);
		if (mi) {
			mi.setChecked(true, true);
		}
	}
};

ZmTaskListController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_TASKS;
};

ZmTaskListController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG3, "ZmTaskListController.handleKeyAction");

    var lv = this._listView[this._currentViewId];
    var num = lv.getSelectionCount();
    var isExternalAccount = appCtxt.isExternalAccount();

    switch(actionCode) {

        case ZmKeyMap.MARK_COMPLETE:
        case ZmKeyMap.MARK_UNCOMPLETE:
            if (isExternalAccount) { break; }
            var task = this._listView[this._currentViewId].getSelection()[0];
            if ((task.isComplete() && actionCode == ZmKeyMap.MARK_UNCOMPLETE) ||
                    (!task.isComplete() && actionCode == ZmKeyMap.MARK_COMPLETE))
            {
                this._doCheckCompleted(task);
            }
            break;

        case ZmKeyMap.READING_PANE_BOTTOM:
		case ZmKeyMap.READING_PANE_RIGHT:
		case ZmKeyMap.READING_PANE_OFF:
			var menuId = ZmTaskListController.ACTION_CODE_TO_MENU_ID[actionCode];
			this._updateViewMenu(menuId);
            this.switchView(menuId);
			break;
        case ZmKeyMap.MOVE_TO_TRASH:
            if (isExternalAccount) { break; }
            if(num) {
                var tasks = lv.getSelection();
                var nId = ZmOrganizer.normalizeId(tasks[0].folderId);
                var isTrash = nId == ZmOrganizer.ID_TRASH;
                if(!isTrash){
                    this._handleCancel(tasks);
                }
            }
            break;

        case ZmKeyMap.CANCEL:
            if (lv && lv.isZmTaskView) {
                lv.close();
                break;
            }
        default:
            return ZmListController.prototype.handleKeyAction.call(this, actionCode);
    }

    return true;
};

ZmTaskListController.prototype.mapSupported =
function(map) {
	return (map == "list");
};

// override if reading pane is supported
ZmTaskListController.prototype._setupReadingPaneMenuItems = function() {};

/**
 * Checks if the reading pane is "on".
 *
 * @return	{Boolean}	<code>true</code> if the reading pane is "on"
 */
ZmTaskListController.prototype.isReadingPaneOn =
function() {
	return (this._getReadingPanePref() != ZmSetting.RP_OFF);
};

/**
 * Checks if the reading pane is "on" right.
 *
 * @return	{Boolean}	<code>true</code> if the reading pane is "on" right.
 */
ZmTaskListController.prototype.isReadingPaneOnRight =
function() {
	return (this._getReadingPanePref() == ZmSetting.RP_RIGHT);
};

ZmTaskListController.prototype._getReadingPanePref =
function() {
	return (this._readingPaneLoc || appCtxt.get(ZmSetting.READING_PANE_LOCATION_TASKS));
};

ZmTaskListController.prototype._setReadingPanePref =
function(value) {
	if (this.isSearchResults || appCtxt.isExternalAccount()) {
		this._readingPaneLoc = value;
	}
	else {
		appCtxt.set(ZmSetting.READING_PANE_LOCATION_TASKS, value);
	}
};

ZmTaskListController.prototype._getFilterByPref =
function() {
	return appCtxt.get(ZmSetting.TASKS_FILTERBY);
};

ZmTaskListController.prototype._setFilterByPref =
function(value) {
	appCtxt.set(ZmSetting.TASKS_FILTERBY, value);
};

/**
 * Saves the task.
 * 
 * @param		{String}	name		the task name
 * @param		{AjxCallback}	callback	the save callback
 * 
 * @see	ZmTask
 */
ZmTaskListController.prototype.quickSave =
function(name, callback, errCallback) {
	var folderId = (this._activeSearch && this._activeSearch.search) ? this._activeSearch.search.folderId : null;

	var folder = appCtxt.getById(folderId);
	if (folder && folder.link) {
		folderId = folder.getRemoteId();
	}

	var task = new ZmTask(this._list, null, folderId);

	if (folder && folder.link) {
		// A share may not be direct - it may be via the root for a full mailbox share
		while (folder && !folder.owner) {
			folder = folder.parent;
		}
		task.setOrganizer(folder.owner);
		task._orig = new ZmTask(this._list);
	}

	task.setName(name);
	task.setViewMode(ZmCalItem.MODE_NEW);
	task.location = "";
	task.setAllDayEvent(true);

	task.save(null, callback, errCallback);
};

ZmTaskListController.getDefaultViewType =
function() {
	return ZmId.VIEW_TASKLIST;
};
ZmTaskListController.prototype.getDefaultViewType = ZmTaskListController.getDefaultViewType;

ZmTaskListController.prototype._createNewView =
function() {

    if (this._taskListView && this._dragSrc) {
		this._taskListView.setDragSource(this._dragSrc);
	}
	return this._taskListView;
};

ZmTaskListController.prototype._getToolBarOps =
function() {
	var toolbarOps =  [];
	toolbarOps.push(ZmOperation.EDIT,
			ZmOperation.SEP,
			ZmOperation.DELETE, ZmOperation.MOVE_MENU, ZmOperation.TAG_MENU,
			ZmOperation.SEP,
			ZmOperation.PRINT,
			ZmOperation.SEP,
            ZmOperation.MARK_AS_COMPLETED,
            ZmOperation.SEP,
            ZmOperation.CLOSE
            );
	
	return toolbarOps;
};

ZmTaskListController.prototype._getButtonOverrides =
function(buttons) {

	if (!(buttons && buttons.length)) { return; }

	var overrides = {};
	var idParams = {
		skinComponent:  ZmId.SKIN_APP_TOP_TOOLBAR,
		componentType:  ZmId.WIDGET_BUTTON,
		app:            ZmId.APP_TASKS,
		containingView: ZmId.VIEW_TASKLIST
	};
	for (var i = 0; i < buttons.length; i++) {
		var buttonId = buttons[i];
		overrides[buttonId] = {};
		idParams.componentName = buttonId;
		var item = (buttonId === ZmOperation.SEP) ? "Separator" : buttonId + " button";
		var description = item + " on top toolbar for task list view";
		overrides[buttonId].domId = ZmId.create(idParams, description);
	}
	return overrides;
};

ZmTaskListController.prototype._getRightSideToolBarOps =
function(noViewMenu) {
	return [ZmOperation.VIEW_MENU];
};


ZmTaskListController.prototype._initialize =
function(view) {
	// set up double pane view (which creates the TLV and TV)
	if (!this._taskMultiView){
		var dpv = this._taskMultiView = new ZmTaskMultiView({parent:this._container, posStyle:Dwt.ABSOLUTE_STYLE, controller:this, dropTgt:this._dropTgt});
        this._taskListView = dpv.getTaskListView();
	}
    
    if(view == ZmId.VIEW_TASK) {
        this._listView[view] = new ZmTaskView(this._container, DwtControl.ABSOLUTE_STYLE, this);
    }

    ZmListController.prototype._initialize.call(this, view);
};

ZmTaskListController.prototype.getTaskMultiView = 
function() {
		return this._taskMultiView;	
};

ZmTaskListController.prototype._initializeToolBar =
function(view) {
	if (this._toolbar[view]) { return; }

	ZmListController.prototype._initializeToolBar.call(this, view);

	this._setupPrintMenu(view);
    this._setupViewMenu(view);
	this._setupMarkAsCompletedMenu(view);
	
	this._toolbar[view].getButton(ZmOperation.DELETE).setToolTipContent(ZmMsg.hardDeleteTooltip);

	this._toolbar[view].addFiller();
	this._initializeNavToolBar(view);
};

ZmTaskListController.prototype._handleSyncAll =
function() {
	//doesn't do anything now after I removed the appCtxt.get(ZmSetting.GET_MAIL_ACTION) == ZmSetting.GETMAIL_ACTION_DEFAULT preference stuff
};

ZmTaskListController.prototype.runRefresh =
function() {
	if (!appCtxt.isOffline) {
		return;
	}
	//should only happen in ZD

	this._syncAllListener();
};


ZmTaskListController.prototype._syncAllListener =
function(view) {
	var callback = new AjxCallback(this, this._handleSyncAll);
	appCtxt.accountList.syncAll(callback);
};


ZmTaskListController.prototype._sendReceiveListener =
function(ev) {
	var account = appCtxt.accountList.getAccount(ev.item.getData(ZmOperation.MENUITEM_ID));
	if (account) {
		account.sync();
	}
};

ZmTaskListController.prototype._setupMarkAsCompletedMenu = 
function(view) {
	var markAsCompButton = this._toolbar[view].getButton(ZmOperation.MARK_AS_COMPLETED);
	if(!markAsCompButton) { return; }
	
	markAsCompButton.setToolTipContent(ZmMsg.markAsCompleted);
	markAsCompButton.addSelectionListener(this._listeners[ZmOperation.MARK_AS_COMPLETED]);
	//markAsCompButton.noMenuBar = true;
}

ZmTaskListController.prototype._setupPrintMenu =
function(view) {
	var printButton = this._toolbar[view].getButton(ZmOperation.PRINT);
	if (!printButton) { return; }

	printButton.setToolTipContent(ZmMsg.printMultiTooltip);
	printButton.noMenuBar = true;
	var menu = new ZmPopupMenu(printButton);
	printButton.setMenu(menu);

	var id = ZmOperation.PRINT_TASK;
	var mi = menu.createMenuItem(id, {image:ZmOperation.getProp(id, "image"), text:ZmMsg[ZmOperation.getProp(id, "textKey")]});
	mi.setData(ZmOperation.MENUITEM_ID, id);
	mi.addSelectionListener(this._listeners[ZmOperation.PRINT_TASK]);

	id = ZmOperation.PRINT_TASKFOLDER;
	mi = menu.createMenuItem(id, {image:ZmOperation.getProp(id, "image"), text:ZmMsg[ZmOperation.getProp(id, "textKey")]});
	mi.setData(ZmOperation.MENUITEM_ID, id);
	mi.addSelectionListener(this._listeners[ZmOperation.PRINT_TASKFOLDER]);
};

ZmTaskListController.prototype._setupViewMenu =
function(view) {
    var btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
    var menu = btn.getMenu();
    if (!menu) {
		menu = new ZmPopupMenu(btn);
		btn.setMenu(menu);


        var pref = this._getFilterByPref();
        for (var i = 0; i < ZmTaskListController.SORT_BY.length; i++) {
			var id = ZmTaskListController.SORT_BY[i];
			var params = {
				image:ZmTaskListController.ICON[id],
				text:ZmMsg[ZmTaskListController.MSG_KEY[id]],
				style:DwtMenuItem.RADIO_STYLE,
                radioGroupId:"TAKS_FILTER_BY"
			};
			var mi = menu.createMenuItem(id, params);
			mi.setData(ZmOperation.MENUITEM_ID, id);
			mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
            if (id == ZmTaskListController.FILTERBY_SETTING_ID[pref]) { // "all" is the default
            	mi.setChecked(true, true);
			}
		}
        new DwtMenuItem({parent:menu, style:DwtMenuItem.SEPARATOR_STYLE});
        btn.setImage(ZmTaskListController.READING_PANE_ICON[pref]);
        pref = this._getReadingPanePref();
        for (var i = 0; i < ZmTaskListController.RP_IDS.length; i++) {
			var id = ZmTaskListController.RP_IDS[i];
			var params = {
				image:ZmTaskListController.READING_PANE_ICON[id],
				text:ZmTaskListController.READING_PANE_TEXT[id],
				style:DwtMenuItem.RADIO_STYLE,
                radioGroupId:"TASKS_READING_PANE"
			};
			var mi = menu.createMenuItem(id, params);
			mi.setData(ZmOperation.MENUITEM_ID, id);
			mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
			if (id == pref) {
				mi.setChecked(true, true);
			}
		}
	}
};

ZmTaskListController.prototype._getActionMenuOps =
function() {
	return [
		ZmOperation.EDIT,
		ZmOperation.MARK_AS_COMPLETED,
		ZmOperation.SEP,
		ZmOperation.TAG_MENU,
		ZmOperation.DELETE,
		ZmOperation.MOVE,
		ZmOperation.PRINT_TASK,
		ZmOperation.SHOW_ORIG
	];
};

ZmTaskListController.prototype._getTagMenuMsg =
function(num) {
	return AjxMessageFormat.format(ZmMsg.tagTasks, num);
};

ZmTaskListController.prototype._resetOperations =
function(parent, num) {
	ZmListController.prototype._resetOperations.call(this, parent, num);
    
	// a valid folderId means user clicked on a task list
	var folderId = (this._activeSearch && this._activeSearch.search) ? this._activeSearch.search.folderId : null;
	if (folderId) {
		var folder = appCtxt.getById(folderId);
		var isShare = folder && folder.link;
        var isTrash = folder && folder.id == ZmOrganizer.ID_TRASH;
		var canEdit = !(folder && (folder.isReadOnly() || folder.isFeed()));
		var task = this._listView[this._currentViewId].getSelection()[0];

		parent.enable([ZmOperation.MOVE, ZmOperation.MOVE_MENU, ZmOperation.DELETE], canEdit && num > 0);
		parent.enable(ZmOperation.EDIT, !isTrash && canEdit && num == 1);
		parent.enable(ZmOperation.MARK_AS_COMPLETED, !isTrash && canEdit && num > 0 && task && !task.isComplete());
		parent.enable(ZmOperation.TAG_MENU, (canEdit && num > 0));
	} else {
      	var task = this._listView[this._currentViewId].getSelection()[0];
		var canEdit = (num == 1 && !task.isReadOnly() && !ZmTask.isInTrash(task));
		parent.enable([ZmOperation.DELETE, ZmOperation.MOVE, ZmOperation.MOVE_MENU, ZmOperation.TAG_MENU], num > 0);
		parent.enable(ZmOperation.EDIT, canEdit);
        parent.enable(ZmOperation.MARK_AS_COMPLETED, canEdit && !task.isComplete())
    }
    parent.setItemVisible(ZmOperation.CLOSE, false);
    var printButton = (parent instanceof ZmButtonToolBar) ? parent.getButton(ZmOperation.PRINT) : null;
	var printMenu = printMenu && printButton.getMenu();
	var printMenuItem = printMenu && printMenu.getItem(1);
	if (printMenuItem) {
		var text = (folderId != null) ? ZmMsg.printTaskFolder : ZmMsg.printResults;
		printMenuItem.setText(text);
	}

	var printOp = (parent instanceof ZmActionMenu) ? ZmOperation.PRINT_TASK : ZmOperation.PRINT;
	parent.enable(printOp, num > 0);
    parent.enable(ZmOperation.VIEW_MENU, true)
    parent.enable(ZmOperation.TEXT, true);

    if (parent.getOp(ZmOperation.SHOW_ORIG)){
        var tasks = this._taskListView.getSelection();
        parent.enable(ZmOperation.SHOW_ORIG, num == 1 && tasks && tasks.length && tasks[0].getRestUrl() != null);
    }

    if(appCtxt.isExternalAccount()) {
        parent.enable ([
                        ZmOperation.EDIT,
                        ZmOperation.MARK_AS_COMPLETED,
                        ZmOperation.MOVE,
                        ZmOperation.MOVE_MENU,
                        ZmOperation.TAG_MENU,
                        ZmOperation.DELETE
                        ], false);
        parent.setItemVisible(ZmOperation.TAG_MENU, false);
    }
};

ZmTaskListController.prototype._deleteListener =
function(ev) {

    var tasks = this._listView[this._currentViewId].getSelection();

    if (!tasks || tasks.length == 0) return;
    
    this._doDelete(this._listView[this._currentViewId].getSelection());
};

ZmTaskListController.prototype._deleteCallback =
function(dialog) {
	dialog.popdown();
	// hard delete
	this._doDelete(this._listView[this._currentViewId].getSelection());
};

ZmTaskListController.prototype._doDelete = function(tasks, hardDelete) {

	/*
	 * XXX: Recurrence is not yet supported by tasks
	 *
	if (task.isRecurring() && !task.isException) {
		// prompt user to edit instance vs. series if recurring but not exception
		this._showTypeDialog(task, ZmCalItem.MODE_DELETE);
	}
	*/
    if (!tasks || tasks.length == 0) {
        return;
    }

    // check to see if this is a cancel or delete
    var nId = ZmOrganizer.normalizeId(tasks[0].folderId);
    var isTrash = nId == ZmOrganizer.ID_TRASH;

    if (isTrash || hardDelete) {
        this._handleDelete(tasks);
    }
    else {
        this._handleCancel(tasks);
    }
};

ZmTaskListController.prototype._handleDelete =
function(tasks) {
    var params = {
        items:			tasks,
        hardDelete:		true,
        finalCallback:	this._handleDeleteResponse.bind(this, tasks)
    };
    // NOTE: This makes the assumption that the task items to be deleted are
    // NOTE: always in a list (which knows how to hard delete items). But since
    // NOTE: this is the task *list* controller, I think that's a fair bet. ;)
    tasks[0].list.deleteItems(params);
};

ZmTaskListController.prototype._handleDeleteResponse = function(tasks, resp) {
    var summary = ZmList.getActionSummary({
	    actionTextKey:  'actionDelete',
	    numItems:       tasks.length,
	    type:           ZmItem.TASK
    });
    appCtxt.setStatusMsg(summary);
};

ZmTaskListController.prototype._doCheckCompleted =
function(task,ftask) {
    var clone = ZmTask.quickClone(task);
    clone.message = null;
	var callback = new AjxCallback(this, this._doCheckCompletedResponse, [clone,ftask]);
	clone.getDetails(ZmCalItem.MODE_EDIT, callback);
};

ZmTaskListController.prototype._doCheckCompletedResponse =
function(task,ftask) {
	var clone = ZmTask.quickClone(task);
	clone.pComplete = task.isComplete() ? 0 : 100;
	clone.status = task.isComplete() ? ZmCalendarApp.STATUS_NEED : ZmCalendarApp.STATUS_COMP;
    if(!task.isComplete()) {  //bug:51913 disable alarm when stats is completed
        clone.alarm = false;
        clone.setTaskReminder(null);
    }
	clone.setViewMode(ZmCalItem.MODE_EDIT);
	var callback = new AjxCallback(this, this._markAsCompletedResponse, [clone,ftask]);
	clone.save(null, callback);
};

ZmTaskListController.prototype.isHiddenTask  =
function(task) {
    var pref = this._getFilterByPref();
	if (task.isComplete() && !(pref == ZmSetting.TASK_FILTER_ALL || pref == ZmSetting.TASK_FILTER_COMPLETED))
      return true;

    if (task.pComplete != 0 && (pref == ZmSetting.TASK_FILTER_NOTSTARTED))
        return true;

    return false;

};

ZmTaskListController.prototype._markAsCompletedResponse = 
function(task,ftask) {
	if (task && task._orig) {
		task._orig.message = null;
	}
	//Cache the item for further processing
	task.cache();
	this._taskListView.updateListViewEl(task);
	if(ftask && this.isReadingPaneOn() && !this.isHiddenTask(task)) {
		this._taskMultiView.setTask(task);
	}
};

	
ZmTaskListController.prototype._handleCancel =
function(tasks) {
	var batchCmd = new ZmBatchCommand(true, null, true);
	var actionController = appCtxt.getActionController();
	var idList = [];
	for (var i = 0; i < tasks.length; i++) {
		var t = tasks[i];
		var cmd = new AjxCallback(t, t.cancel, [ZmCalItem.MODE_DELETE]);
		batchCmd.add(cmd);
		idList.push(t.id);
	}
	var actionLogItem = (actionController && actionController.actionPerformed({op: "trash", ids: idList, attrs: {l: ZmOrganizer.ID_TRASH}})) || null;
	batchCmd.run();

    // Mark the action as complete, so that the undo in the toast message will work
	if (actionLogItem) {
		actionLogItem.setComplete();
	}

    var summary = ZmList.getActionSummary({type:ZmItem.TASK, actionTextKey:"actionTrash", numItems:tasks.length});
	
	var undoLink = actionLogItem && actionController && actionController.getUndoLink(actionLogItem);
	if (undoLink && actionController) {
		actionController.onPopup();
		appCtxt.setStatusMsg({msg: summary+undoLink, transitions: actionController.getStatusTransitions()});
	} else {
		appCtxt.setStatusMsg(summary);
	}
};
ZmTaskListController.prototype.isReadOnly =
function() {
    var folder = appCtxt.getById(this._folderId);
    return (folder && (folder.id == ZmOrganizer.ID_TRASH || folder.isReadOnly() || folder.isFeed()));
};

ZmTaskListController.prototype._editTask =
function(task) {
	var mode = ZmCalItem.MODE_EDIT;

    var folder = appCtxt.getById(task.folderId);
    var canEdit = null;

    if(folder) {
        canEdit = folder.id != ZmOrganizer.ID_TRASH && !folder.isReadOnly() && !folder.isFeed();
    }
    
    if (!canEdit) {
		if (task.isException) mode = ZmCalItem.MODE_EDIT_SINGLE_INSTANCE;
        var clone = ZmTask.quickClone(task);
		clone.getDetails(mode, new AjxCallback(this, this._showTaskReadOnlyView, [clone, true]));
	} else {
		if (task.isRecurring()) {
			/*recurring tasks not yet supported bug 23454
			// prompt user to edit instance vs. series if recurring but not exception
			//if (task.isException) {
			//	mode = ZmCalItem.MODE_EDIT_SINGLE_INSTANCE;
			//} else {
			//	this._showTypeDialog(task, ZmCalItem.MODE_EDIT);
			//	return;
			/}*/
			mode = ZmCalItem.MODE_EDIT_SINGLE_INSTANCE;
		}
        task.message = null; //null out message so we re-fetch task next time its opened
		task.getDetails(mode, new AjxCallback(this, this._showTaskEditView, [task, mode]));
	}
};

// All items in the list view are gone - show "No Results"
ZmTaskListController.prototype._handleEmptyList =
function(listView) {
	listView._resetListView();
	listView._setNoResultsHtml();
};

ZmTaskListController.prototype._setSelectedItem =
function() {
	var selCnt = this._listView[this._currentViewId].getSelectionCount();
	if (selCnt == 1) {
		var task = this._listView[this._currentViewId].getSelection();
	}
};

ZmTaskListController.prototype._showTaskReadOnlyView =
function(task, newTab) {
	var viewId = ZmId.VIEW_TASK;
    newTab = newTab || !this.isReadingPaneOn();
    if(newTab) {
        var calItemView = this._listView[viewId];

        if (!calItemView) {
            this._setup(viewId);
            calItemView = this._listView[viewId];
        }
        calItemView._newTab = true;
        calItemView.set(task, ZmId.VIEW_TASKLIST);

        this._resetOperations(this._toolbar[viewId], 1); // enable all buttons

		var elements = this.getViewElements(viewId, this._listView[viewId]);
		
        this._setView({	view:		viewId,
						elements:	elements,
						pushOnly:	true});
    } else {
        var calItemView = this._taskMultiView._taskView;
        calItemView._newTab = false;
        if(calItemView) {
            calItemView.set(task, ZmId.VIEW_TASK);
        }
    }
    if (this._toolbar[viewId])
        this._toolbar[viewId].setItemVisible(ZmOperation.CLOSE, newTab );
};

ZmTaskListController.prototype._showTaskEditView =
function(task, mode) {
	this._app.getTaskController().show(task, mode);
};

ZmTaskListController.prototype._showTypeDialog =
function(task, mode) {
	if (!this._typeDialog) {
		this._typeDialog = new ZmCalItemTypeDialog(this._shell);
		this._typeDialog.addSelectionListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._typeOkListener, [task, mode]));
	}
	this._typeDialog.initialize(task, mode, ZmItem.TASK);
	this._typeDialog.popup();
};

ZmTaskListController.prototype._typeOkListener =
function(task, mode, ev) {
	var isInstance = this._typeDialog.isInstance();

	if (mode == ZmCalItem.MODE_DELETE) {
		var delMode = isInstance
			? ZmCalItem.MODE_DELETE_INSTANCE
			: ZmCalItem.MODE_DELETE_SERIES;
		// TODO
	} else {
		var editMode = isInstance
			? ZmCalItem.MODE_EDIT_SINGLE_INSTANCE
			: ZmCalItem.MODE_EDIT_SERIES;

		task.getDetails(mode, new AjxCallback(this, this._showTaskEditView, [task, editMode]));
	}
};

ZmTaskListController.prototype._newListener =
function(ev, op, params) {
	params = params || {};
	params.folderId = this._list.search.folderId;
	ZmListController.prototype._newListener.call(this, ev, op, params);
};

ZmTaskListController.prototype._listSelectionListener =
function(ev) {
	Dwt.setLoadingTime("ZmTaskItem");
    ZmListController.prototype._listSelectionListener.call(this, ev);

	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		this._editTask(ev.item);
	} else if(this.isReadingPaneOn()) {
        var task = ev.item;
        var mode = ZmCalItem.MODE_EDIT;
        var clone = ZmTask.quickClone(task);
        clone.getDetails(mode, new AjxCallback(this, this._showTaskReadOnlyView, [clone, false]));
    }
};

ZmTaskListController.prototype._listActionListener =
function(ev) {
	ZmListController.prototype._listActionListener.call(this, ev);
	var actionMenu = this.getActionMenu();
	actionMenu.popup(0, ev.docX, ev.docY);
};

ZmTaskListController.prototype._editListener =
function(ev) {
	var task = this._listView[this._currentViewId].getSelection()[0];
	this._editTask(task);
};

ZmTaskListController.prototype._printTaskListener =
function(ev) {
	var listView = this._listView[this._currentViewId];
	var items = listView.getSelection();
	var taskIds = [];
	for (var i = 0; i < items.length; i++) {
		taskIds.push(items[i].invId);
	}

	var url = ["/h/printtasks?id=", taskIds.join(",")];
	if (appCtxt.isOffline) {
		var folderId = this._folderId || ZmFolder.ID_CONTACTS;
		var acctName = appCtxt.getById(folderId).getAccount().name;
		url.push("&acct=", acctName);
	}
	window.open([appContextPath, url.join(""), "&tz=", AjxTimezone.getServerId(AjxTimezone.DEFAULT)].join(""), "_blank");
};

ZmTaskListController.prototype._markAsCompletedListener = 
function(ev) {
	var listView = this._listView[this._currentViewId];
	var items = listView.getSelection();
	var fItem = null;
	for (var i = 0; i < items.length; i++) {
		var task = items[i];
		if (!task.isComplete()) {
			if(!fItem) fItem = true;
			this._doCheckCompleted(items[i],fItem);
		}	
	}
    var summary = ZmList.getActionSummary({
        actionTextKey:  'actionCompleted',
        numItems:       items.length,
        type:           ZmItem.TASK
    });
    appCtxt.setStatusMsg(summary);
};

ZmTaskListController.prototype._printListener =
function(ev) {
    this._printTaskListener(ev);
};

ZmTaskListController.prototype._printTaskFolderListener =
function(ev) {
	var url = ["/h/printtasks?"];
	if (this._folderId) {
		url.push("st=task&sfi=", this._folderId);
	} else {
		var taskIds = [];
		var list = this._list.getArray();
		for (var i = 0; i < list.length; i++) {
			taskIds.push(list[i].invId);
		}
        url.push("id=", taskIds.join(","));
	}
	if (appCtxt.isOffline) {
		var folderId = this._folderId || ZmFolder.ID_CONTACTS;
		var acctName = appCtxt.getById(folderId).getAccount().name;
		url.push("&acct=", acctName);
	}
	window.open([appContextPath, url.join(""), "&tz=", AjxTimezone.getServerId(AjxTimezone.DEFAULT)].join(""), "_blank");
};

ZmTaskListController.prototype._setViewContents =
function(view) {
	// load tasks into the given view and perform layout.
	var lv = this._taskListView;
	lv.set(this._list, lv._getPrefSortField());

	if (lv.offset == 0) {
		var list = this._list.getVector();
		if (list.size()) {
            this._taskListView.setSelection(list.get(0));
        } else {
            this._taskMultiView._taskView.reset();
        }    
	}
};

ZmTaskListController.prototype._getMoveDialogTitle =
function(num) {
	return AjxMessageFormat.format(ZmMsg.moveTasks, num);
};

// Move stuff to a new folder.
ZmTaskListController.prototype._moveCallback =
function(folder) {
	this._doMove(this._pendingActionData, folder);
	this._clearDialog(appCtxt.getChooseFolderDialog());
	this._pendingActionData = null;
};

ZmTaskListController.prototype._showOrigListener =
function(ev) {
	var tasks = this._listView[this._currentViewId].getSelection();
	if (tasks && tasks.length > 0) {
		setTimeout(this._showTaskSource.bind(this, tasks[0]), 100); // Other listeners are focusing the main window, so delay the window opening for just a bit
	}
};

ZmTaskListController.prototype._showTaskSource =
function(task) {
    var apptFetchUrl = appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI)
                        + "&id=" + AjxStringUtil.urlComponentEncode(task.id || task.invId)
                        +"&mime=text/plain&noAttach=1&icalAttach=none";
    // create a new window w/ generated msg based on msg id
    window.open(apptFetchUrl, "_blank", "menubar=yes,resizable=yes,scrollbars=yes");
};

/**
 * Gets the checked calendar folder ids.
 *
 * @param	{Boolean}	localOnly		if <code>true</code>, include local calendars only
 * @return	{Array}		an array of folder ids
 */
ZmTaskListController.prototype.getTaskFolderIds =
function(localOnly) {
    var cc = [];
    if(localOnly) {
        if(this._taskTreeController) {
            if (appCtxt.multiAccounts) {
                var overviews = this._app.getOverviewContainer().getOverviews();
                for (var i in overviews) {
                    cc = cc.concat(this._taskTreeController.getTaskFolders(i, false));
                }
            } else {
                // bug fix #25512 - avoid race condition
                if (!this._app._overviewPanelContent) {
                    this._app.setOverviewPanelContent(true);
                }
                cc = this._taskTreeController.getTaskFolders(this._app.getOverviewId(), false);
            }
        } else {
            this._app._createDeferredFolders(ZmApp.TASKS);
            var list = appCtxt.accountList.visibleAccounts;
            for (var i = 0; i < list.length; i++) {
                var acct = list[i];
                if (!appCtxt.get(ZmSetting.TASKS_ENABLED, null, acct)) { continue; }

                var tasks = appCtxt.getFolderTree(acct).getByType(ZmOrganizer.TASKS);
                for (var j = 0; j < tasks.length; j++) {
                    if (tasks[j].nId == ZmOrganizer.ID_TRASH) {
                        continue;
                    }
                    cc.push(tasks[j]);
                }
            }

        }

        this._taskLocalFolderIds = [];

        for (var i = 0; i < cc.length; i++) {
            var cal = cc[i];
            if (cal.noSuchFolder) { continue; }

            if (cal.isRemote && !cal.isRemote()) {
                this._taskLocalFolderIds.push(cal.id);
            }
        }

        // return list of checked calendars
        return this._taskLocalFolderIds;
    }
};
}

if (AjxPackage.define("zimbraMail.tasks.view.ZmTaskListView")) {
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
 * This file contains the task list view classes.
 */

/**
 * Creates the task list view.
 * @class
 * This class represents the task list view.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{ZmTaskController}		controller		the controller
 * @param	{DwtDropTarget}	dropTgt		the drop target	
 * 
 * @extends		ZmListView
 */
ZmTaskListView = function(parent, controller, dropTgt) {

    this._controller = controller;
    
	var headerList = this._getHeaderList(parent);

	var idParams = {
		skinComponent:  ZmId.SKIN_APP_MAIN,
		app:            ZmId.APP_TASKS,
		componentType:  ZmId.WIDGET_VIEW,
		componentName:  ZmId.VIEW_TASKLIST
	};
    var params = {
	    parent:     parent,
        posStyle:   Dwt.ABSOLUTE_STYLE,
	    view:       this._controller.getCurrentViewId(),
	    id:         ZmId.create(idParams, "The main task list view"),
	    pageless:   false,
		type:       ZmItem.TASK,
	    controller: controller,
	    headerList: headerList,
	    dropTgt:    dropTgt
    };

	ZmListView.call(this, params);
};

ZmTaskListView.prototype = new ZmListView;
ZmTaskListView.prototype.constructor = ZmTaskListView;

ZmTaskListView.prototype.isZmTaskListView = true;
ZmTaskListView.prototype.toString = function() { return "ZmTaskListView"; };



ZmTaskListView.SASH_THRESHOLD = 5;

// Consts
ZmTaskListView.COL_WIDTH_STATUS		= ZmMsg.COLUMN_WIDTH_STATUS_TLV;
ZmTaskListView.COL_WIDTH_PCOMPLETE	= ZmMsg.COLUMN_WIDTH_PCOMPLETE_TLV;
ZmTaskListView.COL_WIDTH_DATE_DUE	= ZmMsg.COLUMN_WIDTH_DATE_DUE_TLV;

//Consts
ZmTaskListView.SEC_UPCOMING = "UPCOMING";
ZmTaskListView.SEC_PASTDUE = "PASTDUE";
ZmTaskListView.SEC_TODAY = "TODAY";
ZmTaskListView.SEC_NODUEDATE = "NODUEDATE";

ZmTaskListView.SEC_MSG_KEY = {};
ZmTaskListView.SEC_MSG_KEY[ZmTaskListView.SEC_UPCOMING] = ZmMsg.taskSecUpcoming;
ZmTaskListView.SEC_MSG_KEY[ZmTaskListView.SEC_PASTDUE] = ZmMsg.taskSecPastDue;
ZmTaskListView.SEC_MSG_KEY[ZmTaskListView.SEC_TODAY] = ZmMsg.taskSecToday;
ZmTaskListView.SEC_MSG_KEY[ZmTaskListView.SEC_NODUEDATE] = ZmMsg.taskSecNoDuedate;

ZmTaskListView.SEC_COLOR = {};
ZmTaskListView.SEC_COLOR[ZmTaskListView.SEC_UPCOMING] = "OrangeC";
ZmTaskListView.SEC_COLOR[ZmTaskListView.SEC_PASTDUE] = "RedC";
ZmTaskListView.SEC_COLOR[ZmTaskListView.SEC_TODAY] = "GreenC";
ZmTaskListView.SEC_COLOR[ZmTaskListView.SEC_NODUEDATE] = "GrayDarkC";

ZmTaskListView.SINGLE_COLUMN_SORT = [
    {field:ZmItem.F_SUBJECT,msg:"subject"},
    {field:ZmItem.F_DATE,	msg:"date"},
    {field:ZmItem.F_PRIORITY, msg:"priority" },
    {field:ZmItem.F_STATUS, msg:"status" },
    {field:ZmItem.F_PCOMPLETE, msg:"pComplete" },
    {field:ZmItem.F_ATTACHMENT, msg:"attachment" }
];

ZmTaskListView.SORTBY_HASH = [];
ZmTaskListView.SORTBY_HASH[ZmSearch.SUBJ_ASC] = {field:ZmItem.F_SUBJECT, msg:"subject"};
ZmTaskListView.SORTBY_HASH[ZmSearch.SUBJ_DESC] = {field:ZmItem.F_SUBJECT, msg:"subject"};
ZmTaskListView.SORTBY_HASH[ZmSearch.DUE_DATE_ASC ] = {field:ZmItem.F_DATE, msg:"date"};
ZmTaskListView.SORTBY_HASH[ZmSearch.DUE_DATE_DESC ] = {field:ZmItem.F_DATE, msg:"date"};
ZmTaskListView.SORTBY_HASH[ZmSearch.PCOMPLETE_ASC] = {field:ZmItem.F_PCOMPLETE, msg:"pComplete"};
ZmTaskListView.SORTBY_HASH[ZmSearch.PCOMPLETE_DESC] = {field:ZmItem.F_PCOMPLETE, msg:"pComplete"};
ZmTaskListView.SORTBY_HASH[ZmSearch.STATUS_ASC] = {field:ZmItem.F_STATUS, msg:"status"};
ZmTaskListView.SORTBY_HASH[ZmSearch.STATUS_DESC] = {field:ZmItem.F_STATUS, msg:"status"};
ZmTaskListView.SORTBY_HASH[ZmSearch.PRIORITY_ASC] = {field:ZmItem.F_PRIORITY, msg:"priority"};
ZmTaskListView.SORTBY_HASH[ZmSearch.PRIORITY_DESC] = {field:ZmItem.F_PRIORITY, msg:"priority"};
ZmTaskListView.SORTBY_HASH[ZmSearch.ATTACH_ASC] = {field:ZmItem.F_ATTACHMENT, msg:"attachment"};
ZmTaskListView.SORTBY_HASH[ZmSearch.ATTACH_DESC] = {field:ZmItem.F_ATTACHMENT, msg:"attachment"};
ZmTaskListView.SORTBY_HASH[ZmSearch.FLAG_ASC] = {field:ZmItem.F_TAG, msg:"tag"};
ZmTaskListView.SORTBY_HASH[ZmSearch.FLAG_DESC] = {field:ZmItem.F_TAG, msg:"tag"};

// Consts
ZmTaskListView.ROW_DOUBLE_CLASS	= "RowDouble";

ZmTaskListView._NEW_TASK_ROW_ID = "_newTaskBannerId";

// Public Methods

ZmTaskListView.prototype.getNewTaskRowId = function() {
	  return this._htmlElId + ZmTaskListView._NEW_TASK_ROW_ID;
};


ZmTaskListView.prototype.setSize =
function(width, height) {
	ZmListView.prototype.setSize.call(this, width, height);
	this._resetColWidth();
};

ZmTaskListView.prototype.hideNewTask =
    function() {
        if (this._newTaskInputEl && Dwt.getVisibility(this._newTaskInputEl)) {
            Dwt.setVisibility(this._newTaskInputEl, false);
        }
    };

/**
 * Saves the new task.
 * 
 * @param	{Boolean}	keepFocus		if <code>true</code>, keep focus after the save
 */
ZmTaskListView.prototype.saveNewTask =
function(keepFocus) {
	if (this._newTaskInputEl && Dwt.getVisibility(this._newTaskInputEl)) {
		var name = AjxStringUtil.trim(this._newTaskInputEl.value);
		if (name != "") {
			var respCallback = new AjxCallback(this, this._saveNewTaskResponse, [keepFocus]);
			var errorCallback = new AjxCallback(this, this._handleNewTaskError);
			this._controller.quickSave(name, respCallback, errorCallback);
 		} else {
			this._saveNewTaskResponse(keepFocus);
		}
	}
};

ZmTaskListView.prototype.showErrorMessage =
    function(errorMsg) {
        var dialog = appCtxt.getMsgDialog();
        dialog.reset();
        var msg = errorMsg ? AjxMessageFormat.format(ZmMsg.errorSavingWithMessage, errorMsg) : ZmMsg.errorSaving;
        dialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
        dialog.popup();
        dialog.registerCallback(DwtDialog.OK_BUTTON, function() {
                dialog.popdown();
                this._newTaskInputEl.focus();
            },this);
        this.enableToolbar(true);
    };

ZmTaskListView.prototype._saveNewTaskResponse =
function(keepFocus) {
    this._newTaskInputEl.value = "";
	if (keepFocus) {
		this._newTaskInputEl.focus();
	} else {
		Dwt.setVisibility(this._newTaskInputEl, false);
	}
};

ZmTaskListView.prototype._handleNewTaskError =
function(ex) {
    if(ex) {
        this.discardNewTask();   
    }
};

ZmTaskListView.prototype.handleKeyAction =
function(actionCode, ev) {
	if (this._editing) {
		switch (actionCode) {
			case DwtKeyMap.DBLCLICK:		break;
			default: DwtListView.prototype.handleKeyAction.call(this,actionCode,ev);
		}
	} else {
		DwtListView.prototype.handleKeyAction.call(this,actionCode,ev);
	}
};

/**
 * Discards the task.
 * 
 */
ZmTaskListView.prototype.discardNewTask =
function() {
	if (this._newTaskInputEl && Dwt.getVisibility(this._newTaskInputEl)) {
		this._newTaskInputEl.value = "";
		Dwt.setVisibility(this._newTaskInputEl, false);
		this.focus();
		this._editing =  false;
	}
};

/**
 * Gets the title.
 * 
 * @return	{String}		the title
 */
ZmTaskListView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this._controller.getApp().getDisplayName()].join(": ");
};

ZmTaskListView.prototype._renderTaskListItemHdr = 
function(sechdr) {
    if(!this._newSecHdrHtml[sechdr]) {

        var htmlArr = [];
        var idx = 0;

        htmlArr[idx++] = "<div id='_upComingTaskListHdr'>";
        htmlArr[idx++] = "<table role='presentation' width=100% class='DwtListView-Column'><tr>";
        this.dId = Dwt.getNextId();
        htmlArr[idx++] = "<td><div class='DwtListHeaderItem-label ";
        htmlArr[idx++] = ZmTaskListView.SEC_COLOR[sechdr];
        htmlArr[idx++] = "' style='padding:0px 0px 2px 2px; font-weight:bold;' id='";
        htmlArr[idx++] = this.dId;	// bug: 17653 - for QA
        htmlArr[idx++] = "'>";
        htmlArr[idx++] = ZmTaskListView.SEC_MSG_KEY[sechdr];
        htmlArr[idx++] = "</div></td>";
        htmlArr[idx++] = "</tr></table></div>";
        return this._newSecHdrHtml[sechdr] = htmlArr.join("");
   } else {
        return null;     
   }
};

ZmTaskListView.prototype.setTaskInputVisible = function(visible) {
    var el = document.getElementById(this.getNewTaskRowId());
    if (el) {
        Dwt.setVisible(el, visible);
    }
};

// Private Methods
ZmTaskListView.prototype._renderList =
function(list, noResultsOk, doAdd) {
	// call base class first
	//ZmListView.prototype._renderList.apply(this, arguments);
    this._newSecHdrHtml = {};

    if (list instanceof AjxVector && list.size()) {
		var now = new Date();
		var size = list.size();
		var htmlArr = [];
        var currentSec = null;

        var htmlUpcomingArr = [];
        var htmlPastDueArr = [];
        var htmlTodayArr = [];
        var htmlNoDueArr = [];
        
		for (var i = 0; i < size; i++) {
			var item = list.get(i);

            var today = new Date();
            today.setHours(0,0,0,0);
            today = today.getTime();

            var dueDate = item.endDate;
            if(dueDate != null) {
                dueDate.setHours(0,0,0,0);
                dueDate = dueDate.getTime();
            } else {
                dueDate = null;
            }
            
            if(dueDate != null && dueDate > today) {
               var newSecHdrHtml = this._renderTaskListItemHdr(ZmTaskListView.SEC_UPCOMING);
               if(newSecHdrHtml) htmlUpcomingArr.push(newSecHdrHtml);
                currentSec = ZmTaskListView.SEC_UPCOMING;
            } else if(dueDate != null && dueDate == today) {
                var newSecHdrHtml = this._renderTaskListItemHdr(ZmTaskListView.SEC_TODAY);
                if(newSecHdrHtml) htmlTodayArr.push(newSecHdrHtml);
                currentSec = ZmTaskListView.SEC_TODAY;
            } else if(dueDate != null && dueDate < today) {
                var newSecHdrHtml = this._renderTaskListItemHdr(ZmTaskListView.SEC_PASTDUE);
                if(newSecHdrHtml) htmlPastDueArr.push(newSecHdrHtml);
                currentSec = ZmTaskListView.SEC_PASTDUE; 
            } else if(dueDate == null) {
                var newSecHdrHtml = this._renderTaskListItemHdr(ZmTaskListView.SEC_NODUEDATE);
                if(newSecHdrHtml) htmlNoDueArr.push(newSecHdrHtml);
                currentSec = ZmTaskListView.SEC_NODUEDATE;
            } else {
                currentSec = null;
            }

            var taskStatusClass = this._normalClass;

            if(item.status == ZmCalendarApp.STATUS_COMP) {
               taskStatusClass += " ZmCompletedtask";
            } else if(item.status != ZmCalendarApp.STATUS_COMP && currentSec == ZmTaskListView.SEC_PASTDUE) {
               taskStatusClass += " ZmOverduetask";
            }

			var div = this._createItemHtml(item, { now: now, divClass: taskStatusClass, role: this.itemRole }, true, i);
            if (div) {
				if (div instanceof Array) {
					for (var j = 0; j < div.length; j++){
						this._addRow(div[j]);
					}
				} else if (div.tagName || doAdd) {
					this._addRow(div);
				} else {
                    //bug:47781
					if(this._controller.getAllowableTaskStatus() == ZmTaskListController.SOAP_STATUS[ZmId.VIEW_TASK_TODO] && item.status == ZmCalendarApp.STATUS_WAIT) {
							if(currentSec == ZmTaskListView.SEC_PASTDUE) {
								htmlPastDueArr.push(div);
							}
							continue;
					}
					
                    if(currentSec == ZmTaskListView.SEC_UPCOMING) {
					    htmlUpcomingArr.push(div);
                    } else if(currentSec == ZmTaskListView.SEC_TODAY) {
                        htmlTodayArr.push(div);
                    } else if(currentSec == ZmTaskListView.SEC_PASTDUE) {
                        htmlPastDueArr.push(div);
                    } else if(currentSec == ZmTaskListView.SEC_NODUEDATE) {
                        htmlNoDueArr.push(div); 
                    } else {
                        htmlArr.push(div);
                    }
				}
			}
		}
        
        //bug:50890 in chronological order
        var sortBy = appCtxt.get(ZmSetting.SORTING_PREF, this.view);

        if(sortBy == ZmSearch.DUE_DATE_DESC) {
            if(htmlUpcomingArr.length) htmlArr.push(htmlUpcomingArr.join(""));
            if(htmlTodayArr.length) htmlArr.push(htmlTodayArr.join(""));
            if(htmlPastDueArr.length) htmlArr.push(htmlPastDueArr.join(""));
            if(htmlNoDueArr.length) htmlArr.push(htmlNoDueArr.join(""));
        } else {
            if(htmlPastDueArr.length) htmlArr.push(htmlPastDueArr.join(""));
            if(htmlTodayArr.length) htmlArr.push(htmlTodayArr.join(""));
            if(htmlUpcomingArr.length) htmlArr.push(htmlUpcomingArr.join(""));
            if(htmlNoDueArr.length) htmlArr.push(htmlNoDueArr.join(""));
        }

		if (htmlArr.length) {
			this._parentEl.innerHTML = htmlArr.join("");
		}
	} else if (!noResultsOk) {
		this._setNoResultsHtml();
	}

    if (doAdd || (this._controller && this._controller.isReadOnly())) { return; }

	// add custom row to allow user to quickly enter tasks from w/in listview
	div = document.createElement("DIV");
	div.id = this.getNewTaskRowId();

	htmlArr = [];
	var idx = 0;

	htmlArr[idx++] = "<table role='presentation' width=100% class='newTaskBannerSep'><tr>";
	for (var i = 0; i < this._headerList.length; i++) {
		var hdr = this._headerList[i];
		if (!hdr._visible) { continue; }

		if (hdr._field == ZmItem.F_SUBJECT || hdr._field == ZmItem.F_SORTED_BY) {
			this.dId = Dwt.getNextId();
			htmlArr[idx++] = "<td><div class='newTaskBanner' onclick='ZmTaskListView._handleOnClick(this)' id='";
			htmlArr[idx++] = this.dId;	// bug: 17653 - for QA
			htmlArr[idx++] = "'>";
			htmlArr[idx++] = ZmMsg.createNewTaskHint;
			htmlArr[idx++] = "</div></td>";
		} else {
			htmlArr[idx++] = "<td width=";
			htmlArr[idx++] = hdr._width;
			htmlArr[idx++] = ">&nbsp;</td>";
		}
	}
	htmlArr[idx++] = "</tr></table>";
	div.innerHTML = htmlArr.join("");
	this._addRow(div, 0);
    //this._renderTaskListItemHdr();
};

ZmTaskListView.prototype._resetListView =
function() {
	// explicitly remove each child (setting innerHTML causes mem leak)
	var cDiv;
	var newTaskRowId = this.getNewTaskRowId();
	while (this._parentEl.hasChildNodes()) {
		if (this._parentEl.lastChild.id === newTaskRowId) { break; }
		cDiv = this._parentEl.removeChild(this._parentEl.lastChild);
		this._data[cDiv.id] = null;
	}
	this._selectedItems.removeAll();
	this._rightSelItems = null;
};

ZmTaskListView.prototype._getCellId =
function(item, field) {
    if(field == ZmItem.F_PRIORITY || field == ZmItem.F_SUBJECT || field == ZmItem.F_STATUS || field == ZmItem.F_PCOMPLETE || field == ZmItem.F_DATE) {
	    return this._getFieldId(item, field)
    } else if (field == ZmItem.F_SELECTION) {
		return this._getFieldId(item, ZmItem.F_SELECTION_CELL);
	} else {
		return DwtListView.prototype._getCellId.apply(this, arguments);
	}
};

ZmTaskListView.prototype.setTask =
function(task) {
	this._taskReadOnlyView.set(task);
};

ZmTaskListView.prototype._getAbridgedCell =
function(htmlArr, idx, item, field, colIdx, width, attr) {
	var params = {};

	htmlArr[idx++] = "<td";
	if (width) {
		htmlArr[idx++] = " width='";
		htmlArr[idx++] = width;
		htmlArr[idx++] = "'";
	}
	htmlArr[idx++] = " id='";
	htmlArr[idx++] = this._getCellId(item, field, params);
	htmlArr[idx++] = "'";
	var className = this._getCellClass(item, field, params);
	if (className) {
		htmlArr[idx++] = " class='";
		htmlArr[idx++] = className;
		htmlArr[idx++] = "'";
	}
	if (attr) {
		htmlArr[idx++] = " ";
		htmlArr[idx++] = attr;
	}
	htmlArr[idx++] = ">";
	idx = this._getCellContents(htmlArr, idx, item, field, colIdx, params);
	htmlArr[idx++] = "</td>";

	return idx;
};

ZmTaskListView.prototype.getColorForStatus =
function(status) {
    switch (status) {
		case ZmCalendarApp.STATUS_CANC: return "YellowDark";
		case ZmCalendarApp.STATUS_COMP: return "Green";
		case ZmCalendarApp.STATUS_DEFR: return "Red";
		case ZmCalendarApp.STATUS_INPR: return "Blue";
		case ZmCalendarApp.STATUS_NEED: return "";
		case ZmCalendarApp.STATUS_WAIT: return "Orange";
	}
	return "";
};

ZmTaskListView.prototype._getAbridgedContent =
function(task, colIdx) {
	var htmlArr = [];
	var idx = 0;
	var width = (AjxEnv.isIE || AjxEnv.isSafari) ? "22" : "16";

	// first row
	htmlArr[idx++] = "<table role='presentation' width=100% class='TopRow'>";
	htmlArr[idx++] = "<tr id='";
	htmlArr[idx++] = DwtId.getListViewItemId(DwtId.WIDGET_ITEM_FIELD, this._view, task.id, ZmItem.F_ITEM_ROW_3PANE);
	htmlArr[idx++] = "'>";

    idx = this._getAbridgedCell(htmlArr, idx, task, ZmItem.F_SUBJECT, colIdx);

    idx = this._getAbridgedCell(htmlArr, idx, task, ZmItem.F_DATE, colIdx, ZmMsg.COLUMN_WIDTH_DATE, "align=right");

	htmlArr[idx++] = "</tr></table>";

    // second row
    htmlArr[idx++] = "<table role='presentation' width=100% class='BottomRow'><tr><td>";
	if (task.pComplete) {
		htmlArr[idx++] = "<div class='ZmTaskProgress'><div";
		htmlArr[idx++] = " class='";
		htmlArr[idx++] = this.getColorForStatus(task.status);
		htmlArr[idx++] = "' style='width:"+ task.pComplete + "%;'></div></div>";
	}
    htmlArr[idx++] = "</td><td width=75 align=right><table role='presentation'><tr>";

    idx = this._getAbridgedCell(htmlArr, idx, task, ZmItem.F_TAG, colIdx, width);
    if(task.priority == ZmCalItem.PRIORITY_HIGH || task.priority == ZmCalItem.PRIORITY_LOW) {
        idx = this._getAbridgedCell(htmlArr, idx, task, ZmItem.F_PRIORITY, colIdx, width, "align=right");
    }
    if (task.hasAttach) {
        idx = this._getAbridgedCell(htmlArr, idx, task, ZmItem.F_ATTACHMENT, colIdx, width);
    }
    htmlArr[idx++] = "</tr></table></td>";
    htmlArr[idx++] = "</tr></table>";

	return htmlArr.join("");

};


ZmTaskListView.prototype._getCellContents =
function(htmlArr, idx, task, field, colIdx, params) {

	if (field == ZmItem.F_SELECTION) {
		var icon = params.bContained ? "CheckboxChecked" : "CheckboxUnchecked";
		idx = this._getImageHtml(htmlArr, idx, icon, this._getFieldId(task, field));

	} else if (field == ZmItem.F_PRIORITY) {
		htmlArr[idx++] = "<center>";
		htmlArr[idx++] = ZmCalItem.getImageForPriority(task, params.fieldId);
		htmlArr[idx++] = "</center>";

	} else if (field == ZmItem.F_SUBJECT) {
		htmlArr[idx++] = AjxStringUtil.htmlEncode(task.getName(), true);

	} else if (field == ZmItem.F_STATUS) {
		htmlArr[idx++] = ZmCalItem.getLabelForStatus(task.status);

	} else if (field == ZmItem.F_PCOMPLETE) {	// percent complete
        var formatter = new AjxMessageFormat(AjxMsg.percentageString);
		htmlArr[idx++] = formatter.format(task.pComplete || 0);
	} else if (field == ZmItem.F_DATE) {
		// due date - dont call base class since we *always* want to show date (not time)
		htmlArr[idx++] = task.endDate != null
			? AjxDateUtil.simpleComputeDateStr(task.endDate)
			: "&nbsp;";
	} else if (field == ZmItem.F_SORTED_BY) {
        htmlArr[idx++] = this._getAbridgedContent(task, colIdx);
    } else if (field == ZmItem.F_TAG) {
        idx = this._getImageHtml(htmlArr, idx, task.getTagImageInfo(), this._getFieldId(task, field));
    } else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	
	return idx;
};

ZmTaskListView.prototype._getHeaderToolTip =
function(field, itemIdx) {
	switch (field) {
		case ZmItem.F_STATUS:		return ZmMsg.sortByStatus;
		case ZmItem.F_PCOMPLETE:	return ZmMsg.sortByPComplete;
		case ZmItem.F_DATE:			return ZmMsg.sortByDueDate;
        case ZmItem.F_PRIORITY:	    return ZmMsg.sortByPriority;
        case ZmItem.F_ATTACHMENT:	return ZmMsg.sortByAttachment;
        case ZmItem.F_TAG:	        return ZmMsg.sortByTag;
	}
	return ZmListView.prototype._getHeaderToolTip.call(this, field, itemIdx);
};

ZmTaskListView.prototype._sortColumn =
function(columnItem, bSortAsc) {
	// change the sort preference for this view in the settings
	var sortBy;
	switch (columnItem._sortable) {
		case ZmItem.F_SUBJECT:		sortBy = bSortAsc ? ZmSearch.SUBJ_ASC : ZmSearch.SUBJ_DESC; break;
		case ZmItem.F_STATUS:		sortBy = bSortAsc ? ZmSearch.STATUS_ASC : ZmSearch.STATUS_DESC; break;
		case ZmItem.F_PCOMPLETE:	sortBy = bSortAsc ? ZmSearch.PCOMPLETE_ASC : ZmSearch.PCOMPLETE_DESC; break;
		case ZmItem.F_DATE:			sortBy = bSortAsc ? ZmSearch.DUE_DATE_ASC : ZmSearch.DUE_DATE_DESC;	break; //bug:50890 changed the default order
        case ZmItem.F_PRIORITY:     sortBy = bSortAsc ? ZmSearch.PRIORITY_ASC : ZmSearch.PRIORITY_DESC;	break;
        case ZmItem.F_ATTACHMENT:   sortBy = bSortAsc ? ZmSearch.ATTACH_ASC : ZmSearch.ATTACH_DESC;	break;
        case ZmItem.F_TAG:          sortBy = bSortAsc ? ZmSearch.FLAG_ASC : ZmSearch.FLAG_DESC;	break;
        case ZmItem.F_SORTED_BY:    sortBy = bSortAsc ? ZmSearch.DUE_DATE_ASC : ZmSearch.DUE_DATE_DESC;	break;
	}

    if (sortBy) {
		this._sortByString = sortBy;
        if (!appCtxt.isExternalAccount()) {
            appCtxt.set(ZmSetting.SORTING_PREF, sortBy, this._controller._folderId || this.view);
        }
	}

	var list = this.getList();
	var size = list ? list.size() : 0;
	if (size > 0 && this._sortByString) {
		var params = {
			query: this._controller.getSearchString(),
			queryHint: this._controller.getSearchStringHint(),
			types: [ZmItem.TASK],
			sortBy: this._sortByString,
			limit: this.getLimit()
		};
		appCtxt.getSearchController().search(params);
	}
};

ZmTaskListView.prototype._handleNewTaskClick =
function(el) {
    if  (appCtxt.isExternalAccount()) {
        return;
    }
	if (!this._newTaskInputEl) {
		this._newTaskInputEl = document.createElement("INPUT");
		this._newTaskInputEl.type = "text";
		this._newTaskInputEl.className = "InlineWidget";
		this._newTaskInputEl.style.position = "absolute";
		this._newTaskInputEl.id = Dwt.getNextId();								// bug: 17653 - for QA

		Dwt.setHandler(this._newTaskInputEl, DwtEvent.ONBLUR, ZmTaskListView._handleOnBlur);
		Dwt.setHandler(this._newTaskInputEl, DwtEvent.ONKEYPRESS, ZmTaskListView._handleKeyPress);

		// The input field must be a child of the list container, otherwise it will not be shown/hidden properly.
		// However, it cannot be a child of the list itself, since it should have a fixed position.
		var parentEl = document.getElementById(this._htmlElId);
		parentEl.appendChild(this._newTaskInputEl);

		this._newTaskInputEl.style.padding  = "0px";
		this._newTaskInputEl.style.borderWidth  = "0px";

		this._resetInputSize(el);
	} else {
        // Preserve any existing newTask text.  This will be cleared when
        // a task is successfully created, leaving it empty for the next task
		//this._newTaskInputEl.value = "";
	}
	Dwt.setVisibility(this._newTaskInputEl, true);
	this._newTaskInputEl.focus();
	this._editing =  true;
};


ZmTaskListView.prototype._handleColHeaderResize =
function(ev) {
	ZmListView.prototype._handleColHeaderResize.call(this, ev);
	this._newTaskInputEl = null;
};

ZmTaskListView.prototype._getHeaderList =
function(parent) {

	var hList = [];
    var sortBy = "date";
    var field  =  ZmItem.F_DATE;
    var activeSortBy = this.getActiveSearchSortBy();
    if (activeSortBy && ZmTaskListView.SORTBY_HASH[activeSortBy]) {
		sortBy = ZmTaskListView.SORTBY_HASH[activeSortBy].msg;
        field = ZmTaskListView.SORTBY_HASH[activeSortBy].field;
	}

    if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
        hList.push(new DwtListHeaderItem({field:ZmItem.F_SELECTION, icon:"CheckboxUnchecked", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.selection}));
    }
    if (this.isMultiColumn()) {
        if (appCtxt.get(ZmSetting.TAGGING_ENABLED)) {
            hList.push(new DwtListHeaderItem({field:ZmItem.F_TAG, icon:"Tag", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.tag, sortable:ZmItem.F_TAG}));
        }
        hList.push(new DwtListHeaderItem({field:ZmItem.F_PRIORITY, icon:"PriorityHigh_list", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.priority, sortable:ZmItem.F_PRIORITY}));
        hList.push(new DwtListHeaderItem({field:ZmItem.F_ATTACHMENT, icon:"Attachment", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.attachment, sortable:ZmItem.F_ATTACHMENT}));
        hList.push(new DwtListHeaderItem({field:ZmItem.F_SUBJECT, text:ZmMsg.subject, sortable:ZmItem.F_SUBJECT, resizeable:true, noRemove:true}));
        hList.push(new DwtListHeaderItem({field:ZmItem.F_STATUS, text:ZmMsg.status, width:ZmTaskListView.COL_WIDTH_STATUS, resizeable:true, sortable:ZmItem.F_STATUS}));
        hList.push(new DwtListHeaderItem({field:ZmItem.F_PCOMPLETE, text:ZmMsg.pComplete, width:ZmTaskListView.COL_WIDTH_PCOMPLETE, sortable:ZmItem.F_PCOMPLETE}));
        hList.push(new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.dateDue, width:ZmTaskListView.COL_WIDTH_DATE_DUE, sortable:ZmItem.F_DATE}));
    }
	else {
        hList.push(new DwtListHeaderItem({field:ZmItem.F_SORTED_BY, text:AjxMessageFormat.format(ZmMsg.arrangedBy, ZmMsg[sortBy]), sortable:field, resizeable:false}));
	}
	return hList;
};

ZmTaskListView.prototype.createHeaderHtml =
function(defaultColumnSort) {
	DwtListView.prototype.createHeaderHtml.call(this, defaultColumnSort, this._isMultiColumn);

	var activeSortBy = this.getActiveSearchSortBy();
	var col = Dwt.byId(this._currentColId);
    var headerCol = this._isMultiColumn ? this._headerHash[ZmItem.F_DATE] :
		            (col && this.getItemFromElement(col)) || (this._headerHash && this._headerHash[ZmItem.F_SORTED_BY]) || null;
	if (headerCol) {
		var colLabel = "";
		if (activeSortBy && ZmTaskListView.SORTBY_HASH[activeSortBy]){
			var msg = ZmTaskListView.SORTBY_HASH[activeSortBy].msg;
			var field = ZmTaskListView.SORTBY_HASH[activeSortBy].field;
			if (msg) {
				colLabel = AjxMessageFormat.format(ZmMsg.arrangedBy, ZmMsg[msg]);
			}
			if (field) {
				headerCol._sortable = field;
			}

			//Set column label; for multi-column this changes the received text. For single column this sets to the sort by text
			var colSpan = document.getElementById(DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, headerCol._field));
			if (colSpan) {
				colSpan.innerHTML = colLabel;
			}
		}
	}
};

ZmTaskListView.prototype._createHeader =
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


// Listeners
// this method simply appends the given list to this current one
ZmTaskListView.prototype.replenish =
function(list) {
	this._list.addList(list);
	this._renderList(this.getList(),true,false);
};

ZmTaskListView.prototype.checkTaskReplenishListView = function() {
    this._controller._app._checkReplenishListView = this;
};

ZmTaskListView.prototype._changeListener =
function(ev) {
	if (ev.type != this.type)
		return;

    var resort = false;
    var folderId = this._controller.getList().search.folderId;
    if (appCtxt.getById(folderId) &&
        appCtxt.getById(folderId).isRemote())
    {
        folderId = appCtxt.getById(folderId).getRemoteId();
    }

    if (appCtxt.isOffline) {
        folderId = ZmOrganizer.getSystemId(folderId);
    }

    //TODO: Optimize ChangeListener logic
	var items = ev.getDetail("items") || ev.items;
    var filter = this._controller.getAllowableTaskStatus();
    items = AjxUtil.toArray(items);
    if (ev.event == ZmEvent.E_CREATE || (ev.event == ZmEvent.E_MODIFY && !this._getElFromItem(items[0]))) {
		for (var i = 0; i < items.length; i++) {
			var item = items[i];

			// skip if this item does not belong in this list.

			if (!folderId || folderId != item.folderId) { continue; }			// does not belong to this folder
			if (this._list && this._list.contains(item)) { continue; }			// skip if we already have it


			if (!this._list) {
				this._list = new AjxVector();
			}
			// clear the "no results" message before adding!
			if (this._list.size() == 0) {
				this._resetList();
			}
			// Check if the item is part of current view
            if (!filter || filter.indexOf(item.status) != -1){
                // add new item at the beg. of list view's internal list
                this._list.add(item, 0);
                this._renderList(this.getList(),true,false);
                if(this._list && this._list.size() == 1) { this.setSelection(this._list.get(0)); }
				this.checkTaskReplenishListView();
            }
		}
	} else if (ev.event == ZmEvent.E_MODIFY) {
		var task = items[0];
        var div = this._getElFromItem(task);
        if (this._list) {
            var origTaskIndex = this._list.indexOfLike(task, task.getId);
            if (origTaskIndex != -1) this._list.replace(origTaskIndex, task);
        }
		if (div) {
            if (filter && filter.indexOf(task.status) == -1){
                // If task status is modified and item is not part of current view
                var parentNode = div.parentNode;
                parentNode && parentNode.removeChild(div);
                if(this._controller.isReadingPaneOn()) {
                    this._controller.getTaskMultiView().getTaskView().reset();
                }
            } else{
                var bContained = this._selectedItems.contains(div);

				var today = new Date();
		        today.setHours(0,0,0,0);
		        today = today.getTime();

		        var dueDate = task.endDate;
		        if (dueDate != null) {
		            dueDate.setHours(0,0,0,0);
		            dueDate = dueDate.getTime();
                    // May change the section the task is sorted under
                    resort = true;
		        }

				var taskStatusClass = this._normalClass;
				if (task.status == ZmCalendarApp.STATUS_COMP) {
		           taskStatusClass += " ZmCompletedtask";
		        } else if (dueDate != null && dueDate < today) {
		           taskStatusClass += " ZmOverduetask";
		        }

                this._createItemHtml(task, {div:div, bContained:bContained, divClass:taskStatusClass});
                this.associateItemWithElement(task, div);
                if(this._controller.isReadingPaneOn()) {
                    task.message = null;
			        task.getDetails(ZmCalItem.MODE_EDIT, new AjxCallback(this._controller, this._controller._showTaskReadOnlyView, [task, false]))
                }
                this.checkTaskReplenishListView();
            }
		}
	} else if (ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_MOVE) {
        var needsSort = false;
        for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
            var evOp = (ev.event == ZmEvent.E_MOVE) ? ZmEvent.E_MOVE : ZmEvent.E_DELETE;
            var movedHere = (item.type === ZmId.ITEM_CONV) ? item.folders[folderId] : item.folderId === folderId;
			if (movedHere && ev.event == ZmEvent.E_MOVE) {
				// We've moved the item into this folder
				if (this._getRowIndex(item) === null) { // Not already here
					this.addItem(item);
					needsSort = true;
				}
			} else {
				this.removeItem(item, true, ev.batchMode);
				// if we've removed it from the view, we should remove it from the reference
				// list as well so it doesn't get resurrected via replenishment *unless*
				// we're dealing with a canonical list (i.e. contacts)
				var itemList = this.getItemList();
				if (ev.event != ZmEvent.E_MOVE || !itemList.isCanonical) {
					itemList.remove(item);
				}
			}
		}
        if(needsSort) {
            this.checkTaskReplenishListView();
        }
        this._controller._resetNavToolBarButtons();
		if(this._controller.isReadingPaneOn()) {
			this._controller.getTaskMultiView().getTaskView().reset();
		}
	} else {
		ZmListView.prototype._changeListener.call(this, ev);
	}
	this._controller._resetToolbarOperations(this.view);

    //Handle Create Notification
    if(ev.event == ZmEvent.E_MOVE){
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(item && item.folderId == folderId && this._getRowIndex(item) === null){
                this.addItem(item, null, true);
            }
        }
    }

	if (ev.event == ZmEvent.E_CREATE ||
		ev.event == ZmEvent.E_DELETE ||
		ev.event == ZmEvent.E_MOVE)
	{
		this._resetColWidth();
	}

    if (resort) {
       this._renderList(this._list);
    }
    //this.reRenderListView();
};


// Static Methods

ZmTaskListView._handleOnClick =
function(div) {
	var appCtxt = window.parentAppCtxt || window.appCtxt;
	var tlv = appCtxt.getApp(ZmApp.TASKS).getTaskListController().getListView();
	tlv._handleNewTaskClick(div);
};

ZmTaskListView._handleOnBlur = function(ev) {
	
	var appCtxt = window.parentAppCtxt || window.appCtxt,
    	tlv = appCtxt.getApp(ZmApp.TASKS).getTaskListController().getListView(),
		value = AjxStringUtil.trim(tlv._newTaskInputEl.value);
	
	if (!value) {
		tlv.hideNewTask();
	}
};

ZmTaskListView.prototype._selectItem =
function(next, addSelect, kbNavEvent) {
	if (!next) {
		var itemDiv = (this._kbAnchor)
		? this._getSiblingElement(this._kbAnchor, next)
		: this._parentEl.firstChild;
		if (itemDiv && itemDiv.id === this.getNewTaskRowId()) {
			document.getElementById(this.dId).onclick();
			return;
		}
	}
	DwtListView.prototype._selectItem.call(this,next,addSelect,kbNavEvent);
};

ZmTaskListView._handleKeyPress = function(ev) {

	var key = DwtKeyEvent.getCharCode(ev);
	var appCtxt = window.parentAppCtxt || window.appCtxt;
	var tlv = appCtxt.getApp(ZmApp.TASKS).getTaskListController().getListView();

	if (DwtKeyEvent.IS_RETURN[key]) {
		tlv.saveNewTask(true);
	}
};

/**
 * Returns true if the reading pane is turned off or set to bottom. We use this
 * call to tell the UI whether to re-render the listview with multiple columns
 * or a single column (for right-pane).
 */
ZmTaskListView.prototype.isMultiColumn =
function(controller) {
	var ctlr = controller || this._controller;
	return !ctlr.isReadingPaneOnRight();
};


ZmTaskListView.prototype.updateListViewEl = 
function(task) {
	var div = this._getElFromItem(task);
	if (div) {
        if (this._controller.isHiddenTask(task)){
            this.removeItem(task, true);
            if(this._controller.isReadingPaneOn()) {
			    this._controller.getTaskMultiView().getTaskView().reset();
		    }
        }else{
		    var bContained = this._selectedItems.contains(div);
		    this._createItemHtml(task, {div:div, bContained:bContained});
		    this.associateItemWithElement(task, div);
        }

	}
};


/**
 * Called by the controller whenever the reading pane preference changes
 *
 * @private
 */
ZmTaskListView.prototype.reRenderListView =
function() {
	var isMultiColumn = this.isMultiColumn();
	if (isMultiColumn != this._isMultiColumn) {
		this._saveState({selection:true, focus:true, scroll:true, expansion:true});
		this._isMultiColumn = isMultiColumn;
		this.headerColCreated = false;
		this._headerList = this._getHeaderList();
		this._rowHeight = null;
		this._normalClass = isMultiColumn ? DwtListView.ROW_CLASS : ZmTaskListView.ROW_DOUBLE_CLASS;
		var list = this.getList() || (new AjxVector());
		this.set(list.clone(), this.getActiveSearchSortBy());
        this._restoreState();
	}
};

ZmTaskListView.prototype.resetSize =
function(newWidth, newHeight) {
	this.setSize(newWidth, newHeight);
	var height = (newHeight == Dwt.DEFAULT) ? newHeight : newHeight - DwtListView.HEADERITEM_HEIGHT;
	Dwt.setSize(this._parentEl, newWidth, height);
	this._resetInputSize();
};

ZmTaskListView.prototype._resetColWidth =
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

ZmTaskListView.prototype._resetInputSize =
function(el) {

	if (this._newTaskInputEl) {
		el = el || document.getElementById(this.dId);
		if (el) {
			var bounds = Dwt.getBounds(el);
			// Get the container location.  Dwt.getBounds does not work - the container is positioned absolute with
			// no top/left specified.
			var taskListContainerEl = this.getHtmlElement();
			var taskListLocationPt = Dwt.toWindow(taskListContainerEl, 0, 0, null, null);
			// Offset the input field over the 'new Task' text, inside the container.
			Dwt.setBounds(this._newTaskInputEl, bounds.x - taskListLocationPt.x, bounds.y - taskListLocationPt.y, bounds.width, bounds.height);
		}
	}
};

ZmTaskListView.prototype._getSingleColumnSortFields =
function() {
    var sortFields = (appCtxt.get(ZmSetting.TAGGING_ENABLED)) ?
                    ZmTaskListView.SINGLE_COLUMN_SORT.concat({field:ZmItem.F_TAG, msg:"tag" }) : ZmTaskListView.SINGLE_COLUMN_SORT;
	return sortFields;
};

/**
 * return the active search sortby value
 * @return {String} sortby value or null
 */
ZmTaskListView.prototype.getActiveSearchSortBy =
function() {
	var sortBy = AjxUtil.get(this._controller, "_activeSearch", "search", "sortBy") || null;
	return sortBy;
};

ZmTaskListView.prototype._getPrefSortField =
function(){
	var activeSortBy = this.getActiveSearchSortBy();
	return activeSortBy && ZmTaskListView.SORTBY_HASH[activeSortBy] ?
       ZmTaskListView.SORTBY_HASH[activeSortBy].field : ZmItem.F_DATE;
};


ZmTaskListView.prototype._getActionMenuForColHeader =
function(force) {
	if (!this.isMultiColumn()) {
		if (!this._colHeaderActionMenu || force) {
			this._colHeaderActionMenu = this._getSortMenu(this._getSingleColumnSortFields(), this._getPrefSortField());
		}
        return this._colHeaderActionMenu;
	}

	var menu = ZmListView.prototype._getActionMenuForColHeader.call(this, force, null, "header");

	return menu;
};




}
}
if (AjxPackage.define("tasks.Tasks")) {
AjxTemplate.register("tasks.Task#TaskDetailsDialog", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class=\"ZPropertySheet\" cellspacing=\"6\"><tr valign='center'><td class='LabelColName'>";
	buffer[_i++] =  ZmMsg.icsLabel ;
	buffer[_i++] = "</td><td class='LabelColValue'><a href=\"";
	buffer[_i++] =  data.icsUrl ;
	buffer[_i++] = "\" target=\"_blank\">";
	buffer[_i++] =  data.icsUrl ;
	buffer[_i++] = "</a></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "tasks.Task#TaskDetailsDialog"
}, false);
AjxTemplate.register("tasks.Task", AjxTemplate.getTemplate("tasks.Task#TaskDetailsDialog"), AjxTemplate.getParams("tasks.Task#TaskDetailsDialog"));

AjxTemplate.register("tasks.Tasks#ReadOnlyView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div class='MsgHeaderTable'><div class='SubjectCol LabelColValue' style=\"margin-left:5px;\" id='zv__TKV__";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] = "__su'>";
	buffer[_i++] =  data.subject ;
	buffer[_i++] = "</div><table role=\"presentation\" id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_hdrTable' class=\"ZPropertySheet\" cellspacing=\"6\" style=\"margin-left:5px;\">";
	 if (data.location) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.location, val:data.location, id:'__lo'}) ;
	 } 
	 if (data.startDate) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.startDate, val:data.startDate, id:'__sd'}) ;
	 } 
	 if (data.dueDate) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.dueDate, val:data.dueDate, id:'__ed'}) ;
	 } 
	 if (data.priority) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.priority, val:data.priority, id:'__pr'}) ;
	 } 
	 if (data.status) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.status, val:data.status, id:'__st'}) ;
	 } 
	 if (data.pComplete) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.completed, val:data.pComplete+'%', id:'__pc'}) ;
	 } 
	 if (data.alarm) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#ReminderEntry", {lbl:ZmMsg.reminder, val1:data.remindDate, val2:data.remindTime, id:'__al' }) ;
	 } 
	buffer[_i++] = "<!-- exception warning -->";
	 if (data.isException) { 
	buffer[_i++] = "<tr valign='center'><td colspan=100><table role=\"presentation\"><tr><td>";
	buffer[_i++] =  AjxImg.getImageHtml("ApptException") ;
	buffer[_i++] = "</td><td><b>";
	buffer[_i++] =  ZmMsg.apptExceptionNote;
	buffer[_i++] = "</b></td></tr></table></td></tr>";
	 } 
	 if (data.attachStr) { 
	buffer[_i++] =  AjxTemplate.expand("tasks.Tasks#AddEntry", {lbl:ZmMsg.attachments, val:data.attachStr, id:'__at'}) ;
	 } 
	buffer[_i++] = "</table><div id='";
	buffer[_i++] = data["_infoBarId"];
	buffer[_i++] = "'></div></div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "tasks.Tasks#ReadOnlyView"
}, false);

AjxTemplate.register("tasks.Tasks#AddEntry", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr id='zv__TKV__";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] =  data.id ;
	buffer[_i++] = "'><td class='LabelColName' style='padding-left:2px;' >";
	buffer[_i++] =  AjxMessageFormat.format(ZmMsg.makeLabel, AjxStringUtil.htmlEncode(data.lbl)) ;
	buffer[_i++] = " </td><td class='LabelColValue'>";
	buffer[_i++] =  data.val ;
	buffer[_i++] = "</td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "tasks.Tasks#AddEntry"
}, false);

AjxTemplate.register("tasks.Tasks#ReminderEntry", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<tr id='zv__TKV__";
	buffer[_i++] = Dwt.getNextId();
	buffer[_i++] =  data.id ;
	buffer[_i++] = "'><td class='LabelColName' style='padding-left:2px;'>";
	buffer[_i++] =  AjxMessageFormat.format(ZmMsg.makeLabel, AjxStringUtil.htmlEncode(data.lbl)) ;
	buffer[_i++] = " </td><td class='LabelColValue'>";
	buffer[_i++] =  data.val1 ;
	buffer[_i++] = " @ ";
	buffer[_i++] =  data.val2 ;
	buffer[_i++] = "</td></tr>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "tasks.Tasks#ReminderEntry"
}, false);

}
