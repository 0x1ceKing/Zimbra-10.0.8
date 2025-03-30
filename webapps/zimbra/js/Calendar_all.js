if (AjxPackage.define("Calendar")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: Calendar
 * 
 * Supports: The Calendar application
 * 
 * Loaded:
 * 	- When the user goes to the Calendar application
 * 	- If the user creates an appointment
 * 	- If the user uses a date object to create an appointment
 * 	- If the user uses a date object to view a certain day
 * 
 * Any user of this package will need to load CalendarCore first.
 */

if (AjxPackage.define("zimbraMail.calendar.view.ZmApptListView")) {
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
 * Appointment list view.
 */
ZmApptListView = function(parent, posStyle, controller, dropTgt) {
    if (arguments.length == 0) return;
    var params = Dwt.getParams(arguments, ZmApptListView.PARAMS);
    params.headerList = this._getHeaderList();
    params.view = params.view || ZmId.VIEW_CAL_TRASH;
    ZmListView.call(this, params);
    this._bSortAsc = true;
    this._defaultSortField = ZmItem.F_DATE;
    this.setDragSource(params.controller._dragSrc);
};
ZmApptListView.prototype = new ZmListView;
ZmApptListView.prototype.constructor = ZmApptListView;

ZmApptListView.prototype.toString = function() {
    return "ZmApptListView";
};

ZmApptListView.PARAMS = ["parent","posStyle","controller","dropTgt"];

//
// Constants
//

ZmApptListView.COL_WIDTH_DATE			= ZmMsg.COLUMN_WIDTH_DATE_CAL;
ZmApptListView.COL_WIDTH_LOCATION		= ZmMsg.COLUMN_WIDTH_LOCATION_CAL;
ZmApptListView.COL_WIDTH_STATUS			= ZmMsg.COLUMN_WIDTH_STATUS_CAL;
ZmApptListView.COL_WIDTH_FOLDER			= ZmMsg.COLUMN_WIDTH_FOLDER_CAL;

//
// Public methods
//

ZmApptListView.prototype.getApptList = function() {
    return this._apptList;
};

ZmApptListView.prototype.refresh = function() {
    if (this.needsRefresh()) {
        var selection = this.getSelection();
        this.set(this.getApptList());
        if (selection) {
            this.setSelectedItems(selection);
        }
        this.setNeedsRefresh(false);
    }
};

ZmApptListView.prototype.needsRefresh = function() {
    var controller = this._controller;
    return controller.getCurrentView().needsRefresh();
};

ZmApptListView.prototype.setNeedsRefresh = function(needsRefresh) {
    var controller = this._controller;
    if(controller.getCurrentView().setNeedsRefresh){
        return controller.getCurrentView().setNeedsRefresh(needsRefresh);
    }
    return null;
};

//to override
ZmApptListView.prototype.getAtttendees = function() {
    return null;
};

ZmApptListView.prototype.updateTimeIndicator=function(force){
    //override
};

ZmApptListView.prototype.startIndicatorTimer=function(force){
    //override
};

ZmApptListView.prototype.checkIndicatorNeed=function(viewId,startDate){
    //override
};

//
// Protected methods
//

ZmApptListView.prototype._getToolTip =
function(params) {
	var tooltip, field = params.field, item = params.item;
	if (field && (field == ZmItem.F_SELECTION || field == ZmItem.F_TAG)) {
		tooltip = ZmListView.prototype._getToolTip.apply(this, arguments);
	} else if (item.getToolTip) {
		tooltip = item.getToolTip(this._controller);
	}
	return tooltip;
};

ZmApptListView.prototype._sortList = function(list, column) {
	ZmApptListView.sortByAsc = this._bSortAsc;

	switch (column) {
		case ZmItem.F_SUBJECT:	list.sort(ZmApptListView._sortSubject); break;
		case ZmItem.F_STATUS:	list.sort(ZmApptListView._sortStatus); break;
		case ZmItem.F_FOLDER:	list.sort(ZmApptListView._sortFolder); break;
		case ZmItem.F_DATE:		list.sort(ZmApptListView._sortDate); break;
	}
};

ZmApptListView.prototype._sortColumn = function(columnItem, bSortAsc) {
	this._defaultSortField = columnItem._field;

	var list = this.getList();
	list = list && list.clone();
	if (list) {
		this._sortList(list, columnItem._field);
		this.set(list, null, true);
	}
};

ZmApptListView.prototype._getHeaderToolTip = function(field, itemIdx) {
	switch (field) {
		case ZmItem.F_LOCATION: return ZmMsg.location;
		case ZmItem.F_FOLDER:	return ZmMsg.calendar;
		case ZmItem.F_DATE:		return ZmMsg.date;
        case ZmItem.F_RECURRENCE:return ZmMsg.recurrence;       
	}
	return ZmListView.prototype._getHeaderToolTip.call(this, field, itemIdx);
};

ZmApptListView.prototype._getHeaderList = function() {
	var hList = [];

	if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
		hList.push(new DwtListHeaderItem({field:ZmItem.F_SELECTION, icon:"CheckboxUnchecked", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.selection}));
	}
	if (appCtxt.get(ZmSetting.TAGGING_ENABLED)) {
		hList.push(new DwtListHeaderItem({field:ZmItem.F_TAG, icon:"Tag", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.tag}));
	}
	hList.push(new DwtListHeaderItem({field:ZmItem.F_ATTACHMENT, icon:"Attachment", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.attachment}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_SUBJECT, text:ZmMsg.subject, noRemove:true, sortable:ZmItem.F_SUBJECT}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_LOCATION, text:ZmMsg.location, width:ZmApptListView.COL_WIDTH_LOCATION, resizeable:true}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_STATUS, text:ZmMsg.status, width:ZmApptListView.COL_WIDTH_STATUS, resizeable:true, sortable:ZmItem.F_STATUS}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_FOLDER, text:ZmMsg.calendar, width:ZmApptListView.COL_WIDTH_FOLDER, resizeable:true, sortable:ZmItem.F_FOLDER}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_RECURRENCE, icon:"ApptRecur", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.recurrence}));
	hList.push(new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.startDate, width:ZmApptListView.COL_WIDTH_DATE, sortable:ZmItem.F_DATE}));

	return hList;
};

//
// DwtListView methods
//

ZmApptListView.prototype._itemClicked = function() {
    ZmListView.prototype._itemClicked.apply(this, arguments);
    this._controller.setCurrentListView(this);
};

ZmApptListView.prototype.set = function(apptList, skipMiniCalUpdate, skipSort) {
    this._apptList = apptList;
	if (!skipSort) {
		if ((this._defaultSortField != ZmItem.F_DATE) ||
			(this._defaultSortField == ZmItem.F_DATE && !this._bSortAsc))
		{
			this._sortList(apptList, this._defaultSortField);
		}
	}
	ZmListView.prototype.set.call(this, apptList, this._defaultSortField);
    this._resetColWidth();
    //Does not make sense but required to make the scrollbar appear
    var size = this.getSize();
    this._listDiv.style.height = (size.y - DwtListView.HEADERITEM_HEIGHT)+"px";
};

ZmApptListView.prototype._getItemId = function(item) {
	var itemId = (item && item.id) ? item.getUniqueId(true) : Dwt.getNextId();
	return DwtId.getListViewItemId(DwtId.WIDGET_ITEM, this._view, itemId);
};

ZmApptListView.prototype._getFieldId = function(item, field) {
	var itemId = (item && item.getUniqueId) ? item.getUniqueId(true) : item.id;
	return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_FIELD, this._view, itemId, field);
};

ZmApptListView.prototype._getCellId = function(item, field) {
	if (field == ZmItem.F_SUBJECT || field == ZmItem.F_DATE || field == ZmItem.F_LOCATION || field == ZmItem.F_STATUS || field == ZmItem.F_FOLDER) {
		return this._getFieldId(item, field);
	}
};

ZmApptListView.prototype._getCellContents = function(htmlArr, idx, appt, field, colIdx, params) {
	if (field == ZmItem.F_RECURRENCE) {
		var icon;
		if (appt.isException) {
			icon = "ApptExceptionIndicator";
		}
        else if (appt.isRecurring()) {
			icon = "ApptRecur";
		}
		idx = this._getImageHtml(htmlArr, idx, icon, this._getFieldId(appt, field));

	}
    else if (field == ZmItem.F_SUBJECT) {
		htmlArr[idx++] = AjxStringUtil.htmlEncode(appt.getName(), true);
		if (appCtxt.get(ZmSetting.SHOW_FRAGMENTS) && appt.fragment) {
			htmlArr[idx++] = this._getFragmentSpan(appt);
		}

	}
    else if (field == ZmItem.F_LOCATION) {
		htmlArr[idx++] = AjxStringUtil.htmlEncode(appt.getLocation(), true);

	}
    else if (field == ZmItem.F_STATUS) {
		if (appt.otherAttendees) {
			htmlArr[idx++] = appt.getParticipantStatusStr();
		}

	}
    else if (field == ZmItem.F_FOLDER) {
		var calendar = appt.getFolder();
        var rgb = calendar.rgb || ZmOrganizer.COLOR_VALUES[calendar.color||ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.CALENDAR]]; 
		var colors = ZmCalBaseView._getColors(rgb);
		var subs = {
            folder: calendar,
			folderColor: colors.standard.header.bgcolor,
			folderName: calendar.getName(),
            id: Dwt.getNextId()
		};
		htmlArr[idx++] = AjxTemplate.expand("calendar.Calendar#ListViewFolder", subs);

	}
    else if (field == ZmItem.F_DATE) {
		htmlArr[idx++] = (appt.isAllDayEvent())
			? AjxMessageFormat.format(ZmMsg.apptDateTimeAllDay, [appt.startDate])
			: AjxMessageFormat.format(ZmMsg.apptDateTime, [appt.startDate, appt.startDate]);

	}
    else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}

	return idx;
};

ZmApptListView.prototype._getLabelForField =
function(appt, field) {
    switch (field) {
    case ZmItem.F_RECURRENCE:
        if (appt.isException) {
            return ZmMsg.recurrenceException;
        } else if (appt.isRecurring()) {
            return ZmMsg.recurrence;
        } else {
            return '';
        }

    case ZmItem.F_SUBJECT:
        return appt.getName() || ZmMsg.noSubject;

    case ZmItem.F_LOCATION:
        return appt.location || ZmMsg.noLocation;

    case ZmItem.F_STATUS:
        return appt.otherAttendees && appt.getParticipantStatusStr();

    case ZmItem.F_FOLDER:
        return appt.getFolder().getName();

    case ZmItem.F_ATTACHMENT:
        return appt.hasAttach && ZmMsg.hasAttachment;

    case ZmItem.F_TAG:
        if (appt.tags.length > 0) {
            var tags = appt.tags.join(' & ');
            return AjxMessageFormat.format(ZmMsg.taggedAs, [tags]);
        }

        break;

    case ZmItem.F_DATE:
        if (appt.isAllDayEvent()) {
            return AjxMessageFormat.format(ZmMsg.apptDateTimeAllDay,
                                           [appt.startDate]);
        } else {
            return AjxMessageFormat.format(ZmMsg.apptDateTime,
                                           [appt.startDate, appt.startDate]);
        }
    }

    return ZmListView.prototype._getLabelForField.apply(this, arguments);
};

//
// Private methods
//

ZmApptListView._sortSubject = function(a, b) {
    // Bug fix # 80458 - Convert the subject line to lower case and compare
    var aVal = a.getName().toLowerCase();
    var bVal = b.getName().toLowerCase();

	if (aVal < bVal)		{ return ZmApptListView.sortByAsc ? -1 : 1; }
	else if (aVal > bVal)	{ return ZmApptListView.sortByAsc ? 1 : -1; }
	else 					{ return 0; }
};

ZmApptListView._sortStatus = function(a, b) {
	if (!a.otherAttendees)	{ return ZmApptListView.sortByAsc ? -1 : 1; }
	if (!b.otherAttendees)	{ return ZmApptListView.sortByAsc ? 1 : -1; }

	var aVal = a.getParticipantStatusStr();
	var bVal = b.getParticipantStatusStr();

	if (aVal < bVal)		{ return ZmApptListView.sortByAsc ? -1 : 1; }
	else if (aVal > bVal)	{ return ZmApptListView.sortByAsc ? 1 : -1; }
	else 					{ return 0; }
};

ZmApptListView._sortFolder = function(a, b) {
	var aVal = a.getFolder().getName();
	var bVal = b.getFolder().getName();

	if (aVal < bVal)		{ return ZmApptListView.sortByAsc ? -1 : 1; }
	else if (aVal > bVal)	{ return ZmApptListView.sortByAsc ? 1 : -1; }
	else 					{ return 0; }
};

ZmApptListView._sortDate = function(a, b) {
	var aVal = a.startDate.getTime();
	var bVal = b.startDate.getTime();

	if (aVal < bVal)		{ return ZmApptListView.sortByAsc ? -1 : 1; }
	else if (aVal > bVal)	{ return ZmApptListView.sortByAsc ? 1 : -1; }
	else 					{ return 0; }
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalViewMgr")) {
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
 * Creates the calendar view manager.
 * @class
 * This class represents the calendar view manager.
 * 
 * @param {DwtShell}	parent			the element that created this view
 * @param {ZmController}		controller		the controller
 * @param {DwtDropTarget}	dropTgt			the drop target
 * 
 * @extends		DwtComposite
 */
ZmCalViewMgr = function(parent, controller, dropTgt) {

	DwtComposite.call(this, {parent:parent, className:"ZmCalViewMgr", posStyle:Dwt.ABSOLUTE_STYLE});
	this.addControlListener(new AjxListener(this, this._controlListener));

	this._controller = controller;
	this._dropTgt = dropTgt;
    this._showNewScheduleView = appCtxt.get(ZmSetting.FREE_BUSY_VIEW_ENABLED);
	// View hash. Holds the various views e.g. day, month, week, etc...
	this._views = {};
	this._date = new Date();
	this._viewFactory = {};
	this._viewFactory[ZmId.VIEW_CAL_DAY]		= ZmCalDayTabView;
	this._viewFactory[ZmId.VIEW_CAL_WORK_WEEK]	= ZmCalWorkWeekView;
	this._viewFactory[ZmId.VIEW_CAL_WEEK]		= ZmCalWeekView;
	this._viewFactory[ZmId.VIEW_CAL_MONTH]		= ZmCalMonthView;
	this._viewFactory[ZmId.VIEW_CAL_LIST]		= ZmCalListView;
    this._viewFactory[ZmId.VIEW_CAL_FB]	        = ZmCalNewScheduleView;

    this._viewFactory[ZmId.VIEW_CAL_TRASH]		= ZmApptListView;
};

ZmCalViewMgr.prototype = new DwtComposite;
ZmCalViewMgr.prototype.constructor = ZmCalViewMgr;

ZmCalViewMgr._SEP = 5;

ZmCalViewMgr.MIN_CONTENT_SIZE = 100;

ZmCalViewMgr.prototype.toString = 
function() {
	return "ZmCalViewMgr";
};

ZmCalViewMgr.prototype.TEMPLATE = "calendar.Calendar#ZmCalViewMgr";

ZmCalViewMgr.prototype._subContentShown = false;
ZmCalViewMgr.prototype._subContentInitialized = false;

ZmCalViewMgr.prototype.getController =
function() {
	return this._controller;
};

// sets need refresh on all views
ZmCalViewMgr.prototype.setNeedsRefresh = 
function() {
	for (var name in this._views) {
		this._views[name].setNeedsRefresh(true);
    }
};

ZmCalViewMgr.prototype.layoutWorkingHours =
function() {
	for (var name in this._views) {
		if (name == ZmId.VIEW_CAL_DAY ||
            name == ZmId.VIEW_CAL_WORK_WEEK ||
            name == ZmId.VIEW_CAL_WEEK ||
            name == ZmId.VIEW_CAL_FB
            )
			this._views[name].layoutWorkingHours();
	}
};

ZmCalViewMgr.prototype.needsRefresh =
function(viewId) {
	viewId = viewId || this._currentViewName;
	var view = this._views[viewId];
	return view.needsRefresh ? view.needsRefresh() : false;
};

ZmCalViewMgr.prototype.getCurrentView =
function() {
	return this._views[this._currentViewName];
};

ZmCalViewMgr.prototype.getCurrentViewName =
function() {
	return this._currentViewName;
};

ZmCalViewMgr.prototype.getView =
function(viewName) {
	return this._views[viewName];
};

ZmCalViewMgr.prototype.getTitle =
function() {
	return this.getCurrentView().getTitle();
};

ZmCalViewMgr.prototype.getDate =
function() {
	return this._date;
};

ZmCalViewMgr.prototype.setDate =
function(date, duration, roll) {
	this._date = new Date(date.getTime());
	this._duration = duration;
	if (this._currentViewName) {
		var view = this._views[this._currentViewName];
		view.setDate(date, duration, roll);
	}
};

ZmCalViewMgr.prototype.createView =
function(viewName) {
	var view = new this._viewFactory[viewName](this, DwtControl.ABSOLUTE_STYLE, this._controller, this._dropTgt);

	if (viewName != ZmId.VIEW_CAL_TRASH) {
		view.addTimeSelectionListener(new AjxListener(this, this._viewTimeSelectionListener));
		view.addDateRangeListener(new AjxListener(this, this._viewDateRangeListener));
		view.addViewActionListener(new AjxListener(this, this._viewActionListener));
	}
	this._views[viewName] = view;
    if (viewName == ZmId.VIEW_CAL_TRASH) {
        var controller = this._controller;
        view.addSelectionListener(new AjxListener(controller, controller._listSelectionListener));
        view.addActionListener(new AjxListener(controller, controller._listActionListener));
    }
	return view;
};

ZmCalViewMgr.prototype.getSubContentView = function() {
    return this._list || this._createSubContent();
};

ZmCalViewMgr.prototype.getSelTrashCount = function() {

    var folders  = this._controller.getCheckedCalendars(true);
    this._multiAccTrashQuery = [];
    for (var i=0; i< folders.length; i++) {
        if (folders[i].nId == ZmOrganizer.ID_TRASH) {
            this._multiAccTrashQuery.push(['inid:', '"', folders[i].getAccount().id, ':', ZmOrganizer.ID_TRASH, '"'].join(""));
        }
    }
    return this._multiAccTrashQuery.length;
};

ZmCalViewMgr.prototype.setSubContentVisible = function(visible) {

    if (appCtxt.multiAccounts) {
        var selCount = this.getSelTrashCount();
        // if no trash is checked
        if (selCount < 1) {
            this._subContentShown = false;
            this._subContentInitialized = true;
            this._controller.setCurrentListView(null);
        } else {
        // if more one or more trash is checked
            this._subContentShown = true;
        }
    } else if (this._subContentShown != visible) {
        this._subContentShown = visible;
        if (!visible) {
            this._controller.setCurrentListView(null);
        }
    }
    this._layout();
};

ZmCalViewMgr.prototype._createSubContent = function() {
    if (!this._subContentShown) return null;
    if (this._subContentInitialized) return this._list;

    this._subContentInitialized = true;

    this._sash = new DwtSash({parent:this,posStyle:Dwt.ABSOLUTE_STYLE,style:DwtSash.VERTICAL_STYLE});
    this._sash.registerCallback(this._handleSashAdjustment, this);
    this._list = this.createView(ZmId.VIEW_CAL_TRASH);
    this._list.set(new AjxVector([]));

    this._populateTrashListView(this._list);
    return this._list;
};

ZmCalViewMgr.prototype._handleSashAdjustment = function(delta) {
    // sash moved too far up
    var sashLocation = this._sash.getLocation();
    if (sashLocation.y + delta < ZmCalViewMgr.MIN_CONTENT_SIZE) {
        delta = ZmCalViewMgr.MIN_CONTENT_SIZE - sashLocation.y;
    }

    // sash moved to0 far down
    else {
        var size = this.getSize();
        if (sashLocation.y + delta > size.y - ZmCalViewMgr.MIN_CONTENT_SIZE) {
            delta = size.y - ZmCalViewMgr.MIN_CONTENT_SIZE - sashLocation.y;
        }
    }

    // adjust sub-content
    if (delta != 0) {
        var listSize = this._list.getSize();
        this._list.setSize(listSize.x, listSize.y - delta);
        this._layoutControls(true);
    }

    return delta;
};

ZmCalViewMgr.prototype._populateTrashListView = function(listView) {
    var params = {
        searchFor:ZmItem.APPT,
        limit:20,
        types:AjxVector.fromArray([ZmId.ITEM_APPOINTMENT]),
        forceSearch: true,
//        noRender: true,
        callback: new AjxCallback(this, this._populateTrashListViewResults, [listView])
    };

    if (appCtxt.multiAccounts) {
        params.query = this._multiAccTrashQuery.join(" OR ");
        params.account = appCtxt.accountList.mainAccount.name;
    } else {
        params.query = "inid:"+ZmOrganizer.ID_TRASH;
    }
    var search = new ZmSearch(params);
    search.execute(params);
};

ZmCalViewMgr.prototype._populateTrashListViewResults = function(listView, results) {
    var data = results && results._data;
    var apptList = data && data._results && data._results.APPT;
    listView.set(apptList || new AjxVector([]));
};

ZmCalViewMgr.prototype.addViewActionListener =
function(listener) {
	this.addListener(ZmCalBaseView.VIEW_ACTION, listener);
};

ZmCalViewMgr.prototype.removeViewActionListener = 
function(listener) {
	this.removeListener(ZmCalBaseView.VIEW_ACTION, listener);
};

ZmCalViewMgr.prototype.addTimeSelectionListener = 
function(listener) {
	this.addListener(ZmCalBaseView.TIME_SELECTION, listener);
};

ZmCalViewMgr.prototype.removeTimeSelectionListener = 
function(listener) {
	this.removeListener(ZmCalBaseView.TIME_SELECTION, listener);
};

ZmCalViewMgr.prototype.addDateRangeListener = 
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
};

ZmCalViewMgr.prototype.removeDateRangeListener = 
function(listener) {
	this.removeListener(DwtEvent.DATE_RANGE, listener);
};

ZmCalViewMgr.prototype.setView =
function(viewName) {
	if (viewName != this._currentViewName) {
		if (this._currentViewName) {
			this._views[this._currentViewName].setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		}
		var view = this._views[viewName];
		this._currentViewName = viewName;

		var vd = view.getDate();
		if (vd == null || (view.getDate().getTime() != this._date.getTime())) {
			view.setDate(this._date, this._duration, true);
		}
		this._layout();
	}
};

ZmCalViewMgr.prototype._layout =
function() {
    // create sub-content, if needed
    var showSubContent = this._subContentShown;
    if (showSubContent && !this._subContentInitialized) {
        this._createSubContent();

        // NOTE: The list maintains its size so we can toggle back and forth
        var size = this.getSize();
        this._list.setSize(null, size.y / 3);
    }
    // Always re-populate trash list for multi-accounts
    if (appCtxt.multiAccounts && this._subContentInitialized) {
        this._populateTrashListView(this._list);
    }

    // show sub-content
    if (this._sash) {
        this._sash.setVisible(showSubContent);
        this._list.setVisible(showSubContent);
    }

    // layout the controls
    this._layoutControls();
};

ZmCalViewMgr.prototype._layoutControls = function(skipSash) {
    // size sub-content
    var size = this.getSize();
    var contentHeight = size.y;
    if (this._subContentShown) {
        var listSize = this._list.getSize();
        var sashSize = this._sash.getSize();
        var subContentHeight = listSize.y + sashSize.y;

        contentHeight -= subContentHeight;

        if (!skipSash) {
            this._sash.setBounds(0, contentHeight, size.x, sashSize.y);
        }
        this._list.setBounds(0, contentHeight+sashSize.y, size.x, listSize.y);
    }

    // size content
    var view = this._views[this._currentViewName];
    view.setBounds(0, 0, size.x, contentHeight);

    //need to reset layout for time view renderings
    if (view instanceof ZmCalBaseView) view.layoutView();
};

ZmCalViewMgr.prototype._controlListener =
function(ev) {
	if (ev.oldHeight != ev.newHeight ||
		ev.oldWidth != ev.newWidth)
	{
		this._layout();
	}
};

ZmCalViewMgr.prototype._viewTimeSelectionListener =
function(ev) {
	this.notifyListeners(ZmCalBaseView.TIME_SELECTION, ev);
};


ZmCalViewMgr.prototype._viewActionListener =
function(ev) {
	this.notifyListeners(ZmCalBaseView.VIEW_ACTION, ev);
};

ZmCalViewMgr.prototype._viewSelectionListener =
function(ev) {
	//this.notifyListeners(ZmCalBaseView.TIME_SELECTION, ev);
};

ZmCalViewMgr.prototype._viewDateRangeListener =
function(ev) {
	// Notify any listeners
	if (this.isListenerRegistered(DwtEvent.DATE_RANGE)) {
		this.notifyListeners(DwtEvent.DATE_RANGE, ev);
	}
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalBaseView")) {
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

ZmCalBaseView = function(parent, className, posStyle, controller, view, readonly) {
	if (arguments.length == 0) { return; }

	DwtComposite.call(this, {parent:parent, className:className, posStyle:posStyle, id:ZmId.getViewId(view)});

	this._isReadOnly = readonly;

	// BEGIN LIST-RELATED
	this._setMouseEventHdlrs();
	this.setCursor("default");

	this.addListener(DwtEvent.ONMOUSEOUT, this._mouseOutListener.bind(this));
	this.addListener(DwtEvent.ONDBLCLICK, this._doubleClickListener.bind(this));
	this.addListener(DwtEvent.ONMOUSEDOWN, this._mouseDownListener.bind(this));
	this.addListener(DwtEvent.ONMOUSEUP, this._mouseUpListener.bind(this));
	this.addListener(DwtEvent.ONMOUSEMOVE, this._mouseMoveListener.bind(this));
	this.addListener(DwtEvent.ONFOCUS, this._focusListener.bind(this));

	this._controller = controller;
	this.view = view;	
	this._evtMgr = new AjxEventMgr();	 
	this._selectedItems = new AjxVector();
	this._selEv = new DwtSelectionEvent(true);
	this._actionEv = new DwtListViewActionEvent(true);
	this._focusFirstAppt = true;

	this._normalClass = "appt";
	this._selectedClass = [this._normalClass, DwtCssStyle.SELECTED].join('-');
	this._disabledSelectedClass = [this._selectedClass, DwtCssStyle.DISABLED].join("-");

	// the key is the HTML ID of the item's associated DIV; the value is an object
	// with information about that row
	this._data = {};

	// END LIST-RELATED
		
	this._timeRangeStart = 0;
	this._timeRangeEnd = 0;
	this.addControlListener(this._controlListener.bind(this));
	this._createHtml();
	this._needsRefresh = true;
};

ZmCalBaseView.prototype = new DwtComposite;
ZmCalBaseView.prototype.constructor = ZmCalBaseView;

ZmCalBaseView.TIME_SELECTION = "ZmCalTimeSelection";
ZmCalBaseView.VIEW_ACTION = "ZmCalViewAction";

ZmCalBaseView.TYPE_APPTS_DAYGRID = 1; // grid holding days, for example
ZmCalBaseView.TYPE_APPT = 2; // an appt
ZmCalBaseView.TYPE_HOURS_COL = 3; // hours on lefthand side
ZmCalBaseView.TYPE_APPT_BOTTOM_SASH = 4; // a sash for appt duration
ZmCalBaseView.TYPE_APPT_TOP_SASH = 5; // a sash for appt duration
ZmCalBaseView.TYPE_DAY_HEADER = 6; // over date header for a day
ZmCalBaseView.TYPE_MONTH_DAY = 7; // over a day in month view
ZmCalBaseView.TYPE_ALL_DAY = 8; // all day div area in day view
ZmCalBaseView.TYPE_SCHED_FREEBUSY = 9; // free/busy union
ZmCalBaseView.TYPE_DAY_SEP = 10;//allday separator

ZmCalBaseView.headerColorDelta = 0;
ZmCalBaseView.bodyColorDelta = .5;
ZmCalBaseView.deepenColorAdjustment = .9;
ZmCalBaseView.darkThreshold = (256 * 3) / 2;
ZmCalBaseView.deepenThreshold = .3;
ZmCalBaseView.WORK_HOURS_TIME_FORMAT = "HHmm";

ZmCalBaseView._getColors = function(color) {
	// generate header and body colors
    color = color || ZmOrganizer.COLOR_VALUES[ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.CALENDAR]];
	var hs = { bgcolor: AjxColor.darken(color, ZmCalBaseView.headerColorDelta) };
	var hd = { bgcolor: AjxColor.deepen(hs.bgcolor, ZmCalBaseView.deepenColorAdjustment) };
	var bs = { bgcolor: AjxColor.lighten(color, ZmCalBaseView.bodyColorDelta)  };
	var bd = { bgcolor: AjxColor.deepen(bs.bgcolor, ZmCalBaseView.deepenColorAdjustment) };

	// ensure enough difference between background and deeper colors
	var cs = AjxColor.components(hs.bgcolor);
	var cd = AjxColor.components(hd.bgcolor);
	var ss = cs[0]+cs[1]+cs[2];
	var sd = cd[0]+cd[1]+cd[2];
	if (ss/sd > 1 - ZmCalBaseView.deepenThreshold) {
		hs.bgcolor = AjxColor.lighten(hd.bgcolor, ZmCalBaseView.deepenThreshold);
		bs.bgcolor = AjxColor.lighten(bd.bgcolor, ZmCalBaseView.deepenThreshold);
	}

	// use light text color for dark backgrounds
	hs.color = ZmCalBaseView._isDark(hs.bgcolor) && "#ffffff";
	hd.color = ZmCalBaseView._isDark(hd.bgcolor) && "#ffffff";
	bs.color = ZmCalBaseView._isDark(bs.bgcolor) && "#ffffff";
	bd.color = ZmCalBaseView._isDark(bd.bgcolor) && "#ffffff";

	return { standard: { header: hs, body: bs }, deeper: { header: hd, body: bd } };
};

/**
 * Gets the key map name.
 *
 * @return	{String}	the key map name
 */
ZmCalBaseView.prototype.getKeyMapName =
    function() {
        return ZmKeyMap.MAP_CALENDAR;
    };

/**
 * Handles the key action.
 *
 * @param	{constant}		actionCode		the action code
 * @param	{Object}	ev		the event
 * @see		ZmApp.ACTION_CODES_R
 * @see		ZmKeyMap
 * @see     DwtControl
 */
ZmCalBaseView.prototype.handleKeyAction = function(actionCode, ev) {
    switch (actionCode) {
    // the next/prev appointment just iterate over all appointments in
    // view in a chronological order
    case ZmKeyMap.NEXT_APPT:
    case ZmKeyMap.PREV_APPT:
        this._iterateSelection(actionCode === ZmKeyMap.NEXT_APPT);
        return true;

    // the next/prev appointment whose start day differs from the
    // current selection
    case ZmKeyMap.NEXT_DAY:
    case ZmKeyMap.PREV_DAY:
        this._iterateSelection(actionCode === ZmKeyMap.NEXT_DAY, function(appt) {
            return appt.startDate.toDateString();
        });
        return true;

    // pagination
    case ZmKeyMap.PREV_PAGE:
    case ZmKeyMap.NEXT_PAGE:
        this._paginate(actionCode === ZmKeyMap.NEXT_PAGE);
        return true;

    //Gets the Esc key handle
    case DwtKeyMap.CANCEL:
        this.deselectAll();
        return true;

    case DwtKeyMap.SELECT:
        return this._doubleClickListener(ev);

    case DwtKeyMap.SUBMENU:
        // notify action listeners so we pop up a context menu --
        // however, 'ev' is a keyboard event and has no position, so
        // we create one for positioning the menu over the appointment
        var rect = this.getTargetItemDiv(ev).getBoundingClientRect();
        ev.item = this.getTargetItem(ev);
        ev.docX = rect.left + rect.width / 2;
        ev.docY = rect.top + rect.height / 2;

        this._evtMgr.notifyListeners(DwtEvent.ACTION, ev);

        return true;
    }

    return DwtComposite.prototype.handleKeyAction.apply(this, arguments);
};

ZmCalBaseView.prototype._paginate = function(forward) {
    this._focusFirstAppt = forward;
    this._controller._paginate(this.view, forward);
};

/**
 * Iterate the selection over appoinments; if no next/previous
 * appointment found, switch pages.
 *
 * @param forward	[Boolean]*		whether to iterate forwards or backwards
 *
 * @param keyFunc	[Function]		function to map appointments to values;
 *									select the first appointnment with a value
 *									different from the current selection
 *
 * @private
 */
ZmCalBaseView.prototype._iterateSelection = function(forward, keyFunc) {
    var list = this.getList();

    if (!list.size()) {
        this._paginate(forward);
        return;
    }

    if (this.getSelectionCount() == 0) {
        this.setSelection(forward ? list.get(0) : list.getLast());
    }

    if (!keyFunc) {
        keyFunc = function(x) { return x; }
    }

    var selappt = this.getSelection()[0]
    var selIdx = list.indexOf(selappt);
    var selKey = keyFunc(selappt);

    for (var i = selIdx; i < list.size() && i >= 0; i += (forward ? 1 : -1)) {
        var appt = list.get(i);

        if (keyFunc(appt) != selKey) {
            this.setSelection(appt);
            return;
        }
    }

    this._paginate(forward);
};

ZmCalBaseView._toColorsCss =
function(object) {
	var a = [ "background-color:",object.bgcolor,";" ];
	if (object.color) {
		a.push("color:",object.color,";");
	}
	return a.join("");
};

ZmCalBaseView._isDark =
function(color) {
	var c = AjxColor.components(color);
	return c[0]+c[1]+c[2] < ZmCalBaseView.darkThreshold;
};

ZmCalBaseView.prototype.getController =
function() {
	return this._controller;
};

ZmCalBaseView.prototype.firstDayOfWeek =
function() {
	return appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;
};


ZmCalBaseView.getWorkingHours =
function() {
	return appCtxt.get(ZmSetting.CAL_WORKING_HOURS) || 0;
};

ZmCalBaseView.parseWorkingHours =
function(wHrsString) {
    if(wHrsString === 0) {
        return [];
    }
	var userTimeZone = appCtxt.get(ZmSetting.DEFAULT_TIMEZONE),
        currentTimeZone = AjxTimezone.getServerId(AjxTimezone.DEFAULT),
        wHrsPerDay = wHrsString.split(','),
        i,
        wHrs = [],
        wDay,
        w,
        offset1,
        offset2,
        hourMinOffset = 0,
        idx,
        startDate = new Date(),
        endDate = new Date(),
        hourMin,
        startDayIdx,
        endDayIdx,
        curDayIdx = endDate.getDay(),
        tf = new AjxDateFormat(ZmCalBaseView.WORK_HOURS_TIME_FORMAT);

    //Helper inner functions, these functions takes the advantage of the fact that wHrs is available in local scope
    function isWorkingDay(idx) {
        return wHrs[idx] && wHrs[idx].isWorkingDay;
    }

    function setWorkingDay(idx, startTime, endTime) {
        if(isWorkingDay(idx)) {
            addWorkingTime(idx, startTime, endTime);
        }
        else {
            addWorkingDay(idx, startTime, endTime);
        }
    }

    function setNonWorkingDay(idx) {
        wHrs[idx] = {};
        wHrs[idx].isWorkingDay = false;
        wHrs[idx].startTime = ["0000"];
        wHrs[idx].endTime = ["0000"];
    }

    function addWorkingDay(idx, startTime, endTime) {
        wHrs[idx] = {};
        wHrs[idx].isWorkingDay = true;
        wHrs[idx].startTime = [startTime];
        wHrs[idx].endTime = [endTime];
    }

    function addWorkingTime(idx, startTime, endTime) {
        wHrs[idx].startTime.push(startTime);
        wHrs[idx].endTime.push(endTime);
    }
    
    if(userTimeZone != currentTimeZone) {
        offset1 = AjxTimezone.getOffset(AjxTimezone.getClientId(currentTimeZone), startDate);
        offset2 = AjxTimezone.getOffset(AjxTimezone.getClientId(userTimeZone), startDate);
        hourMinOffset = offset2 - offset1;
    }
    for(i=0; i<wHrsPerDay.length; i++) {
        wDay = wHrsPerDay[i].split(':');
        w = {};
        idx = wDay[0]-1;
        if(wDay[1] === "N") {
            if(!isWorkingDay(idx)) {
                setNonWorkingDay(idx);
            }
            continue;
        }

        if(hourMinOffset) {
            endDate = new Date();
            startDate = new Date();
            
            endDate.setHours(wDay[3]/100, wDay[3]%100);
            hourMin = endDate.getHours() * 60 + endDate.getMinutes() - hourMinOffset;
            endDate.setHours(hourMin/60, hourMin%60);
            endDayIdx = endDate.getDay();

            startDate.setHours(wDay[2]/100, wDay[2]%100);
            hourMin = startDate.getHours() * 60 + startDate.getMinutes() - hourMinOffset;
            startDate.setHours(hourMin/60, hourMin%60);
            startDayIdx = startDate.getDay();

            if(startDayIdx == curDayIdx && endDayIdx == curDayIdx) {
                //Case 1 working time starts current day and ends on the current day -- IDEAL one :)
                setWorkingDay(idx, tf.format(startDate), tf.format(endDate));
            }
            else if((endDayIdx == 0 && startDayIdx == 6) ||
                    (startDayIdx < curDayIdx  && endDayIdx == curDayIdx)) {
                //Case 2 working time starts prev day and ends on current day
                startDayIdx = idx-1;
                if(startDayIdx < 0) {
                   startDayIdx = 6;
                }
                setWorkingDay(startDayIdx, tf.format(startDate), "2400");
                setWorkingDay(idx, "0000", tf.format(endDate));
            }
            else if((startDayIdx == 6 && endDayIdx == 0) || 
                    (startDayIdx == curDayIdx  && endDayIdx > curDayIdx)) {
                //Case 3 working time starts current day and ends on next day
                endDayIdx = idx+1;
                if(endDayIdx > 6) {
                   endDayIdx = 0; 
                }
                setWorkingDay(endDayIdx, "0000", tf.format(endDate));
                setWorkingDay(idx, tf.format(startDate), "2400");
            }
            else if(startDayIdx < curDayIdx &&
                    endDayIdx < curDayIdx &&
                    startDayIdx == endDayIdx) {
                //EDGE CASE 1: working time starts and ends on the prev day
                startDayIdx = idx-1;
                setWorkingDay(startDayIdx, tf.format(startDate), tf.format(endDate));
                if(!isWorkingDay(idx)) {
                    setNonWorkingDay(idx);
                }
            }

            else if(startDayIdx > curDayIdx &&
                    endDayIdx > curDayIdx &&
                    startDayIdx == endDayIdx) {
                //EDGE CASE 2: working time starts and ends on the next day
                endDayIdx = idx+1;
                setWorkingDay(endDayIdx, tf.format(startDate), tf.format(endDate));
                if(!isWorkingDay(idx)) {
                    setNonWorkingDay(idx);
                }
            }            
        }
        else {
            //There is no timezone diff, client and server are in the same timezone
            setWorkingDay(idx, wDay[2], wDay[3]);
        }

    }
    return wHrs;
};

ZmCalBaseView.prototype.addViewActionListener =
function(listener) {
	this._evtMgr.addListener(ZmCalBaseView.VIEW_ACTION, listener);
};

ZmCalBaseView.prototype.removeViewActionListener =
function(listener) {
	this._evtMgr.removeListener(ZmCalBaseView.VIEW_ACTION, listener);
};

// BEGIN LIST-RELATED

ZmCalBaseView.prototype.addSelectionListener = 
function(listener) {
	this._evtMgr.addListener(DwtEvent.SELECTION, listener);
};

ZmCalBaseView.prototype.removeSelectionListener = 
function(listener) {
	this._evtMgr.removeListener(DwtEvent.SELECTION, listener);    	
};

ZmCalBaseView.prototype.addActionListener = 
function(listener) {
	this._evtMgr.addListener(DwtEvent.ACTION, listener);
};

ZmCalBaseView.prototype.removeActionListener = 
function(listener) {
	this._evtMgr.removeListener(DwtEvent.ACTION, listener);    	
};

ZmCalBaseView.prototype.getList = 
function() {
	return this._list;
};

ZmCalBaseView.prototype.associateItemWithElement =
function (item, element, type, optionalId) {
	DwtListView.prototype.associateItemWithElement.apply(this, arguments);
};

ZmCalBaseView.prototype.getItemFromElement =
function(el) {
	return DwtListView.prototype.getItemFromElement.apply(this, arguments);
};

ZmCalBaseView.prototype.getTargetItemDiv =
function(ev)  {
	return this.findItemDiv(DwtUiEvent.getTarget(ev));
};

ZmCalBaseView.prototype.getTargetItem =
function(ev)  {
	return this.findItem(DwtUiEvent.getTarget(ev));
};

ZmCalBaseView.prototype.findItem =
function(el) {
	return DwtListView.prototype.findItem.apply(this, arguments);
};

ZmCalBaseView.prototype.findItemDiv =
function(el) {
	return DwtListView.prototype.findItemDiv.apply(this, arguments);
};

ZmCalBaseView.prototype._getItemData =
function(el, field, id) {
	return DwtListView.prototype._getItemData.apply(this, arguments);
};

ZmCalBaseView.prototype._setItemData =
function(id, field, value) {
	DwtListView.prototype._setItemData.apply(this, arguments);
};

ZmCalBaseView.prototype.deselectAll =
function() {
    this.deselectAppt(this._selectedItems);
};

/**
 * Returns a style appropriate to the given item type. Subclasses should override to return
 * styles for different item types. This implementation does not consider the type.
 * 
 * @param type		[constant]*		a type constant
 * @param selected	[boolean]*		if true, return a style for an item that has been selected
 * @param disabled	[boolean]*		if true, return a style for an item that has been disabled
 * @param item		[object]*		item behind the div
 * 
 * @private
 */
ZmCalBaseView.prototype._getStyle =
function(type, selected, disabled, item) {
	return (!selected)
		? this._normalClass
		: (disabled ? this._disabledSelectedClass : this._selectedClass);
};

ZmCalBaseView.prototype.getToolTipContent =
function(ev) {
	var div = this.getTargetItemDiv(ev);
	if (!div) { return null; }
	if (this._getItemData(div, "type") != ZmCalBaseView.TYPE_APPT) { return null; }

	var item = this.getItemFromElement(div);
	return item.getToolTip(this._controller);
};

// tooltip position will be based on cursor
ZmCalBaseView.prototype.getTooltipBase =
function(hoverEv) {
	return null;
};

ZmCalBaseView.prototype.getApptDetails =
function(appt, callback, uid) {
	if (this._currentMouseOverApptId &&
		this._currentMouseOverApptId == uid)
	{
		this._currentMouseOverApptId = null;
		appt.getDetails(null, callback, null, null, true);
	}
};

ZmCalBaseView.prototype._mouseOutListener = 
function(ev) {
	var div = this.getTargetItemDiv(ev);
	if (!div) { return; }

	// NOTE: The DwtListView handles the mouse events on the list items
	//		 that have associated tooltip text. Therefore, we must
	//		 explicitly null out the tooltip content whenever we handle
	//		 a mouse out event. This will prevent the tooltip from
	//		 being displayed when we re-enter the listview even though
	//		 we're not over a list item.
	if (this._getItemData(div, "type") == ZmCalBaseView.TYPE_APPT) {
		this.setToolTipContent(null);
	}
	this._mouseOutAction(ev, div);
};

ZmCalBaseView.prototype._mouseOutAction = 
function(ev, div) {
	return true;
};


ZmCalBaseView.prototype._mouseMoveListener = 
function(ev) {
	// do nothing
};

ZmCalBaseView.prototype._focusListener =
function(ev) {
    var item = this.getTargetItem(ev);

    if (item) {
        this.setSelection(item);
    }
};

// XXX: why not use Dwt.findAncestor?
ZmCalBaseView.prototype._findAncestor =
function(elem, attr) {
	while (elem && (elem[attr] == null)) {
		elem = elem.parentNode;
	}
	return elem;
};

ZmCalBaseView.prototype._mouseDownListener = 
function(ev) {
	if (this._isReadOnly) { return; }

	var div = this.getTargetItemDiv(ev);
	if (!div) {
		return this._mouseDownAction(ev, div);
	}

	this._clickDiv = div;
	if (this._getItemData(div, "type") == ZmCalBaseView.TYPE_APPT) {
		if (ev.button == DwtMouseEvent.LEFT || ev.button == DwtMouseEvent.RIGHT) {
			this._itemClicked(div, ev);
            this._controller.setCurrentListView(this);
		}
	}
	return this._mouseDownAction(ev, div);
};

ZmCalBaseView.prototype._mouseDownAction = 
function(ev, div) {
	return !Dwt.ffScrollbarCheck(ev);
};

ZmCalBaseView.prototype._mouseUpListener = 
function(ev) {
	delete this._clickDiv;
	return this._mouseUpAction(ev, this.getTargetItemDiv(ev));
};

ZmCalBaseView.prototype._mouseUpAction = 
function(ev, div) {
	return !Dwt.ffScrollbarCheck(ev);
};

ZmCalBaseView.prototype._doubleClickAction = 
function(ev, div) { return true; };

ZmCalBaseView.prototype._doubleClickListener =
function(ev) {
	var div = this.getTargetItemDiv(ev);
	if (!div) { return;	}

	var handled = false;

	if (this._getItemData(div, "type") == ZmCalBaseView.TYPE_APPT) {
		if (this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
			DwtUiEvent.copy(this._selEv, ev);
			var item = this.getItemFromElement(div);
            var orig = item.getOrig();
            item = orig && orig.isMultiDay() ? orig : item;
			this._selEv.item = item;
			this._selEv.detail = DwtListView.ITEM_DBL_CLICKED;
			this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);

			handled = true;
		}
	}
	return this._doubleClickAction(ev, div) || handled;
};

ZmCalBaseView.prototype._itemClicked =
function(clickedEl, ev) {
	var i;
	var selected = this._selectedItems.contains(clickedEl);
	var item = this.getItemFromElement(clickedEl);
	var type = this._getItemData(clickedEl, "type");

	if (ev.shiftKey && selected) {
        //Deselect the current selected appointment
        this.deselectAppt([clickedEl]);
	} else if (!selected) {
		this.setSelection(item);
	}

	if (ev.button == DwtMouseEvent.RIGHT) {
		DwtUiEvent.copy(this._actionEv, ev);
		this._actionEv.item = item;
		this._evtMgr.notifyListeners(DwtEvent.ACTION, this._actionEv);
	}
};

// YUCK: ZmListView overloads b/c ZmListController thinks its always dealing w/ ZmListView's
ZmCalBaseView.prototype.setSelectionCbox = function(obj, bContained) {};
ZmCalBaseView.prototype.setSelectionHdrCbox = function(check) {};

ZmCalBaseView.prototype.setSelection =
function(item, skipNotify) {
	var el = this._getElFromItem(item);

	if (el) {
		var i;
		var a = this._selectedItems.getArray();
		var sz = this._selectedItems.size();
		for (i = 0; i < sz; i++) {
			a[i].className = this._getStyle(this._getItemData(a[i], "type"));
		}
		this._selectedItems.removeAll();
		this._selectedItems.add(el);

		el.className = this._getStyle(this._getItemData(el, "type"), true, !this.getEnabled(), item);

		this.setFocusElement(el);
		Dwt.clearHandler(el, DwtEvent.ONCLICK);

		if (!skipNotify && this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
			var selEv = new DwtSelectionEvent(true);
			selEv.button = DwtMouseEvent.LEFT;
			selEv.target = el;
			selEv.item = item;
			selEv.detail = DwtListView.ITEM_SELECTED;
			this._evtMgr.notifyListeners(DwtEvent.SELECTION, selEv);
		}	
	}
};

ZmCalBaseView.prototype._getItemCountType = function() {
	return ZmId.ITEM_APPOINTMENT;
};

ZmCalBaseView.prototype.getSelectionCount =
function() {
	return this._selectedItems.size();
};

ZmCalBaseView.prototype.getSelection =
function() {
	var a = new Array();
	var sa = this._selectedItems.getArray();
	var saLen = this._selectedItems.size();
	for (var i = 0; i < saLen; i++) {
		a[i] = this.getItemFromElement(sa[i]);
	}
	return a;
};

ZmCalBaseView.prototype.getSelectedItems =
function() {
	return this._selectedItems;
};

ZmCalBaseView.prototype.handleActionPopdown = 
function(ev) {
	// clear out old right click selection
    ZmCalViewController._contextMenuOpened = false;

    if(ev && ev._ev && ev._ev.type === "mousedown"){//Only check for mouse events
        var htmlEl = DwtUiEvent.getTarget(ev._ev),
            element = document.getElementById(this._bodyDivId) || document.getElementById(this._daysId);

        if(element){
            while (htmlEl !== null) {
                if(htmlEl === element){
                    ZmCalViewController._contextMenuOpened = true;
                    break;
                }
                htmlEl = htmlEl.parentNode;
            }
        }
    }
};

// END LIST-RELATED

ZmCalBaseView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this.getCalTitle()].join(": ");
};

ZmCalBaseView.prototype.needsRefresh = 
function() {
	return this._needsRefresh;
};

ZmCalBaseView.prototype.setNeedsRefresh = 
function(refresh) {
	 this._needsRefresh = refresh;
};

ZmCalBaseView.prototype._getItemId =
function(item) {
	return item ? (DwtId.getListViewItemId(DwtId.WIDGET_ITEM, this.view, item.getUniqueId())) : null;
};

ZmCalBaseView.prototype.addTimeSelectionListener = 
function(listener) {
	this.addListener(ZmCalBaseView.TIME_SELECTION, listener);
};

ZmCalBaseView.prototype.removeTimeSelectionListener = 
function(listener) { 
	this.removeListener(ZmCalBaseView.TIME_SELECTION, listener);
};

ZmCalBaseView.prototype.addDateRangeListener = 
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
};

ZmCalBaseView.prototype.removeDateRangeListener = 
function(listener) { 
	this.removeListener(DwtEvent.DATE_RANGE, listener);
};

ZmCalBaseView.prototype.getRollField =
function() {
	// override.
	return 0;
};

ZmCalBaseView.prototype.getDate =
function() {
	return this._date;
};
//to override
ZmCalBaseView.prototype.getAtttendees =
function() {
    return null;
};

ZmCalBaseView.prototype.getTimeRange =
function() {
	return { start: this._timeRangeStart, end: this._timeRangeEnd };
};

ZmCalBaseView.prototype.isInView =
function(appt) {
	return appt.isInRange(this._timeRangeStart, this._timeRangeEnd);
};

ZmCalBaseView.prototype.isStartInView =
function(appt) {
	return appt.isStartInRange(this._timeRangeStart, this._timeRangeEnd);
};

ZmCalBaseView.prototype.isEndInView =
function(appt) {
	return appt.isEndInRange(this._timeRangeStart, this._timeRangeEnd);
};

ZmCalBaseView.prototype._dayKey =
function(date) {
	return (date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate());
};

ZmCalBaseView.prototype.setDate =
function(date, duration, roll) {
	this._duration = duration;
	this._date = new Date(date.getTime());
	var d = new Date(date.getTime());
	d.setHours(0, 0, 0, 0);
	var t = d.getTime();
	if (roll || t < this._timeRangeStart || t >= this._timeRangeEnd) {
		this._resetList();
		this._updateRange();		
		this._dateUpdate(true);
		this._updateTitle();
		
		// Notify any listeners
		if (this.isListenerRegistered(DwtEvent.DATE_RANGE)) {
			if (!this._dateRangeEvent)
				this._dateRangeEvent = new DwtDateRangeEvent(true);
			this._dateRangeEvent.item = this;
			this._dateRangeEvent.start = new Date(this._timeRangeStart);
			this._dateRangeEvent.end = new Date(this._timeRangeEnd);
			this.notifyListeners(DwtEvent.DATE_RANGE, this._dateRangeEvent);
		}
	} else {
		this._dateUpdate(false);
	}
};

ZmCalBaseView.prototype._dateUpdate =
function(rangeChanged) {
	// override: responsible for updating any view-specific data when the date
	// changes during a setDate call.
};

ZmCalBaseView.prototype._apptSelected =
function() {
	// override: called when an appointment is clicked to see if the view should
	// de-select a selected time range. For example, in day view if you have
	// selected the 8:00 AM row and then click on an appt, the 8:00 AM row
	// should be de-selected. If you are in month view though and have a day
	// selected, thne day should still be selected if the appt you clicked on is
	// in the same day.
};

// override
ZmCalBaseView.prototype._updateRange =
function() { 
	this._updateDays();
	this._timeRangeStart = this._days[0].date.getTime();
	//this._timeRangeEnd = this._days[this.numDays-1].date.getTime() + AjxDateUtil.MSEC_PER_DAY;
    var endDate = this._days[this.numDays-1].date;
    endDate.setHours(23, 59, 59, 999);
	this._timeRangeEnd = endDate.getTime();
};

// override 
ZmCalBaseView.prototype._updateTitle =
function() { };

ZmCalBaseView.prototype.addAppt = 
function(ao) {
	var item = this._createItemHtml(ao);
    if (!item) {
        return;
    }
	var div = this._getDivForAppt(ao);
	if (div) div.appendChild(item);

	this._postApptCreate(ao,div);	
};

// override
ZmCalBaseView.prototype._postApptCreate =
function(appt,div) {
};

ZmCalBaseView.prototype.set = 
function(list) {
	this._preSet();
	this.deselectAll();
	list = list.filter(this.isInView.bind(this));
	this._resetList();
	this._list = list;
    var showDeclined = appCtxt.get(ZmSetting.CAL_SHOW_DECLINED_MEETINGS);
    if (list) {
		var size = list.size();
		if (size != 0) {
			for (var i=0; i < size; i++) {
				var ao = list.get(i);
                if (showDeclined || (ao.ptst != ZmCalBaseItem.PSTATUS_DECLINED)) {
				    this.addAppt(ao);
                }
			}
		}
	}

	this._postSet(list);

	// the calendar itself may have focus; this re-focuses any items
	// within it
	var selappt = this._focusFirstAppt ? this._list.get(0) : this._list.getLast();
	this._focusFirstAppt = true;

	if (selappt) {
		this.setSelection(selappt);
	}
};

// override
ZmCalBaseView.prototype._fanoutAllDay =
function(appt) {
	return true;
};

// override
ZmCalBaseView.prototype._postSet =
function(appt) {};

// override
ZmCalBaseView.prototype._preSet =
function(appt) {};

// override
ZmCalBaseView.prototype._getDivForAppt =
function(appt) {};

ZmCalBaseView.prototype._addApptIcons =
function(appt, html, idx) {
	html[idx++] = "<table role='presentation' border=0 cellpadding=0 cellspacing=0 style='display:inline'><tr>";

	if (appt.otherAttendees) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptMeeting");
		html[idx++] = "</td>";
	}

	if (appt.isException) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptException");
		html[idx++] = "</td>";
	} else if (appt.isRecurring()) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptRecur");
		html[idx++] = "</td>";
	}

	if (appt.alarm) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptReminder");
		html[idx++] = "</td>";
	}
	html[idx++] = "</tr></table>";

	return idx;
};

ZmCalBaseView.prototype._getElFromItem = 
function(item) {
	return document.getElementById(this._getItemId(item));
};

ZmCalBaseView.prototype._resetList =
function() {
	var list = this.getList();
	var size = list ? list.size() : 0;
	if (size == 0) return;

	this.setFocusElement(this.getHtmlElement());

	for (var i=0; i < size; i++) {
		var ao = list.get(i);
		var id = this._getItemId(ao);
		var appt = document.getElementById(id);
		if (appt) {
			appt.parentNode.removeChild(appt);
			this._data[id] = null;
		}
	}
	list.removeAll();
	this.removeAll();
};

ZmCalBaseView.prototype.removeAll =
function() {
	this._selectedItems.removeAll();
};

ZmCalBaseView.prototype.layoutView =
function() {
    this._layout();
};

ZmCalBaseView.prototype.getCalTitle = 
function() {
	return this._title;
};

ZmCalBaseView.prototype._getStartDate =
function() {
	var timeRange = this.getTimeRange();
	return new Date(timeRange.start);
};

// override
ZmCalBaseView.prototype._createItemHtml =
function(appt) {};

// override
ZmCalBaseView.prototype._createHtml =
function() {};

// override
ZmCalBaseView.prototype.checkIndicatorNeed =
function(viewId, startDate) {};

ZmCalBaseView.prototype._controlListener =
function(ev) {
	if ((ev.oldWidth != ev.newWidth) ||
		(ev.oldHeight != ev.newHeight))
	{
		this._layout();
	}
};

// override
ZmCalBaseView.prototype._layout =
function() {};

ZmCalBaseView.prototype._timeSelectionEvent =
function(date, duration, isDblClick, allDay, folderId, shiftKey) {
	if (!this._selectionEvent) this._selectionEvent = new DwtSelectionEvent(true);
	var sev = this._selectionEvent;
	sev._isDblClick = isDblClick;
	sev.item = this;
	sev.detail = date;
	sev.duration = duration;
	sev.isAllDay = allDay;
	sev.folderId = folderId;
	sev.force = false;
	sev.shiftKey = shiftKey;
	this.notifyListeners(ZmCalBaseView.TIME_SELECTION, this._selectionEvent);
	sev._isDblClick = false;
};


ZmCalBaseView._setApptOpacity =
function(appt, div) {
    var opacity = this.getApptOpacity(appt);
	Dwt.setOpacity(div, opacity);
};

ZmCalBaseView.getApptOpacity =
function(appt) {
    var opacity = 100;

    switch (appt.ptst) {
		case ZmCalBaseItem.PSTATUS_DECLINED:	opacity = ZmCalColView._OPACITY_APPT_DECLINED;  break;
		case ZmCalBaseItem.PSTATUS_TENTATIVE:	opacity = ZmCalColView._OPACITY_APPT_TENTATIVE; break;
		default:								opacity = ZmCalColView._OPACITY_APPT_NORMAL;    break;
	}

	// obey free busy status for organizer's appts
	if (appt.fba && appt.isOrganizer()) {
		 switch (appt.fba) {
			case "F":	opacity = ZmCalColView._OPACITY_APPT_FREE; break;
			case "B":	opacity = ZmCalColView._OPACITY_APPT_BUSY; break;
			case "T":	opacity = ZmCalColView._OPACITY_APPT_TENTATIVE; break;
		 }
	}
    return opacity;
};

ZmCalBaseView._emptyHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};


ZmCalBaseView.prototype._apptMouseDownAction =
function(ev, apptEl, appt) {
	if (ev.button != DwtMouseEvent.LEFT) { return false; }

    if (!appt) {
        appt = this.getItemFromElement(apptEl);
    }
	var calendar = appCtxt.getById(appt.folderId);
	var isRemote = Boolean(calendar.url);
    if (appt.isReadOnly() || isRemote || appCtxt.isWebClientOffline()) return false;

	var apptOffset = Dwt.toWindow(ev.target, ev.elementX, ev.elementY, apptEl, false);

	var data = {
		dndStarted: false,
		appt: appt,
		view: this,
		apptEl: apptEl,
		apptOffset: apptOffset,
		docX: ev.docX,
		docY: ev.docY
	};

	var capture = new DwtMouseEventCapture({
		targetObj:data,
		mouseOverHdlr:ZmCalBaseView._emptyHdlr,
		mouseDownHdlr:ZmCalBaseView._emptyHdlr, // mouse down (already handled by action)
		mouseMoveHdlr:ZmCalBaseView._apptMouseMoveHdlr,
		mouseUpHdlr:  ZmCalBaseView._apptMouseUpHdlr,
		mouseOutHdlr: ZmCalBaseView._emptyHdlr
	});
    DBG.println(AjxDebug.DBG3,"data.docX,Y: " + data.docX + "," + data.docY);

    this._createContainerRect(data);
    // Problem with Month View ??
    this._controller.setCurrentListView(this);

	capture.capture();
	return false;
};



ZmCalBaseView.prototype._getApptDragProxy =
function(data) {
	// set icon
	var icon;
	if (this._apptDragProxyDivId == null) {
		icon = document.createElement("div");
		icon.id = this._apptDragProxyDivId = Dwt.getNextId();
		Dwt.setPosition(icon, Dwt.ABSOLUTE_STYLE);
		this.shell.getHtmlElement().appendChild(icon);
		Dwt.setZIndex(icon, Dwt.Z_DND);
	} else {
		icon = document.getElementById(this._apptDragProxyDivId);
	}
	icon.className = DwtCssStyle.NOT_DROPPABLE;

	var appt = data.appt;
	var formatter = AjxDateFormat.getDateInstance(AjxDateFormat.SHORT);
	var color = ZmCalendarApp.COLORS[this._controller.getCalendarColor(appt.folderId)];
	if (appt.ptst != ZmCalBaseItem.PSTATUS_NEEDS_ACTION) {
		color += "Bg";
	}

	var proxyData = {
		shortDate: formatter.format(appt.startDate),
		dur: appt.getShortStartHour(),
		color: color,
		apptName: AjxStringUtil.htmlEncode(appt.getName())
	};

	icon.innerHTML = AjxTemplate.expand("calendar.Calendar#ApptDragProxy", proxyData);

	var imgHtml = AjxImg.getImageHtml("RoundPlus", "position:absolute; top:30; left:-11; visibility:hidden");
	icon.appendChild(Dwt.parseHtmlFragment(imgHtml));

	return icon;
};



ZmCalBaseView._apptMouseMoveHdlr =
function(ev) {
    var data = DwtMouseEventCapture.getTargetObj();
    if (!data) return false;

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, true);
    var view = data.view;

	var deltaX = mouseEv.docX - data.docX;
	var deltaY = mouseEv.docY - data.docY;
    DBG.println(AjxDebug.DBG3,"_apptMouseMoveHdlr mouseEv.docY: " + mouseEv.docY + ",   data.docY: " + data.docY);

	if (!data.dndStarted) {
		var withinThreshold = (Math.abs(deltaX) < ZmCalColView.DRAG_THRESHOLD && Math.abs(deltaY) < ZmCalColView.DRAG_THRESHOLD);
		if (withinThreshold || !view._apptDndBegin(data)) {
			mouseEv._stopPropagation = true;
			mouseEv._returnValue = false;
			mouseEv.setToDhtmlEvent(ev);
			return false;
		}
	}

	if (view._apptDraggedOut(mouseEv.docX, mouseEv.docY)) {
		// simulate DND
        DBG.println(AjxDebug.DBG3,"MouseMove DragOut");
        view._dragOut(mouseEv, data);
	}
	else
	{
		if (data._lastDraggedOut) {
			data._lastDraggedOut = false;
			if (data.icon) {
				Dwt.setVisible(data.icon, false);
			}
            view._restoreHighlight(data);
		}
        var obj = data.dndObj;
		obj._lastDestDwtObj = null;
        if (!data.disableScroll) {
            var scrollOffset = view._handleApptScrollRegion(mouseEv.docX, mouseEv.docY, ZmCalColView._HOUR_HEIGHT, data);
            if (scrollOffset != 0) {
                deltaY += scrollOffset;
            }
        }

		// snap new location to grid
        view._doApptMove(data, deltaX, deltaY);
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};



ZmCalBaseView.prototype._dragOut =
function(mouseEv, data) {
    // simulate DND
    var obj = data.dndObj;
    if (!data._lastDraggedOut) {
        data._lastDraggedOut = true;
        this._clearSnap(data.snap);
        data.startDate = new Date(data.appt.getStartTime());
        this._restoreApptLoc(data);
        if (!data.icon) {
            data.icon = this._getApptDragProxy(data);
        }
        Dwt.setVisible(data.icon, true);
    }
    Dwt.setLocation(data.icon, mouseEv.docX+5, mouseEv.docY+5);
    var destDwtObj = mouseEv.dwtObj;
    var obj = data.dndObj;

    if (destDwtObj && destDwtObj._dropTarget)
    {
        if (destDwtObj != obj._lastDestDwtObj ||
            destDwtObj._dropTarget.hasMultipleTargets())
        {
            //DBG.println("dwtObj = "+destDwtObj._dropTarget);
            if (destDwtObj._dropTarget._dragEnter(Dwt.DND_DROP_MOVE, destDwtObj, {data: data.appt}, mouseEv, data.icon)) {
                //obj._setDragProxyState(true);
                data.icon.className = DwtCssStyle.DROPPABLE;
                obj._dropAllowed = true;
                destDwtObj._dragEnter(mouseEv);
            } else {
                //obj._setDragProxyState(false);
                data.icon.className = DwtCssStyle.NOT_DROPPABLE;
                obj._dropAllowed = false;
            }
        } else if (obj._dropAllowed) {
            destDwtObj._dragOver(mouseEv);
        }
    } else {
        data.icon.className = DwtCssStyle.NOT_DROPPABLE;
        //obj._setDragProxyState(false);
    }

    if (obj._lastDestDwtObj &&
        obj._lastDestDwtObj != destDwtObj &&
        obj._lastDestDwtObj._dropTarget &&
        obj._lastDestDwtObj != obj)
    {
        obj._lastDestDwtObj._dragLeave(mouseEv);
        obj._lastDestDwtObj._dropTarget._dragLeave();
    }
    obj._lastDestDwtObj = destDwtObj;

}

ZmCalBaseView.prototype._apptDraggedOut =
function(docX, docY) {
    var draggedOut = this._containerRect ? true : false;
    return draggedOut &&
           ((docY < this._containerRect.y) ||
            (docY > (this._containerRect.y + this._containerRect.height)) ||
            (docX < this._containerRect.x) ||
            (docX > (this._containerRect.x + this._containerRect.width)));
};

ZmCalBaseView._apptMouseUpHdlr =
function(ev) {
	//DBG.println("ZmCalBaseView._apptMouseUpHdlr: "+ev.shiftKey);
	var data = DwtMouseEventCapture.getTargetObj();


	var mouseEv = DwtShell.mouseEvent;
    if (ev && mouseEv) {
	    mouseEv.setFromDhtmlEvent(ev, true);
    }
	DwtMouseEventCapture.getCaptureObj().release();

	var draggedOut = data.view._apptDraggedOut(mouseEv.docX, mouseEv.docY);

	if (data.dndStarted && data.appt) {
        data.view._deselectDnDHighlight(data);
		//notify Zimlet when an appt is dragged.
 		appCtxt.notifyZimlets("onApptDrag", [data]);
		if (data.startDate.getTime() != data.appt._orig.getStartTime() && !draggedOut) {
			if (data.icon) Dwt.setVisible(data.icon, false);
			// save before we muck with start/end dates
			var origDuration = data.appt._orig.getDuration();
			data.view._autoScrollDisabled = true;
			var cc = appCtxt.getCurrentController();
			var endDate = new Date(data.startDate.getTime() + origDuration);
			var errorCallback = new AjxCallback(null, ZmCalColView._handleDnDError, data);
			var sdOffset = data.startDate ? (data.startDate.getTime() - data.appt._orig.getStartTime()) : null;
			var edOffset = endDate ? (endDate.getTime() - data.appt._orig.getEndTime() ) : null;
			cc.dndUpdateApptDate(data.appt._orig, sdOffset, edOffset, null, errorCallback, mouseEv);
		} else {
            data.view._restoreAppt(data);
		}

		if (draggedOut) {
			var obj = data.dndObj;
			obj._lastDestDwtObj = null;
			var destDwtObj = mouseEv.dwtObj;
			if (destDwtObj != null &&
				destDwtObj._dropTarget != null &&
				obj._dropAllowed &&
				destDwtObj != obj)
			{
				destDwtObj._drop(mouseEv);
				var srcData = {
					data: data.appt,
					controller: data.view._controller
				};
				destDwtObj._dropTarget._drop(srcData, mouseEv);
				obj._dragging = DwtControl._NO_DRAG;
				if (data.icon) Dwt.setVisible(data.icon, false);
			}
			else {
				// The following code sets up the drop effect for when an
				// item is dropped onto an invalid target. Basically the
				// drag icon will spring back to its starting location.
				var bd = data.view._badDrop = { dragEndX: mouseEv.docX, dragEndY: mouseEv.docY, dragStartX: data.docX, dragStartY: data.docY };
				bd.icon = data.icon;
				if (data.view._badDropAction == null) {
					data.view._badDropAction = new AjxTimedAction(data.view, data.view._apptBadDropEffect);
				}

				// Line equation is y = mx + c. Solve for c, and set up d (direction)
				var m = (bd.dragEndY - bd.dragStartY) / (bd.dragEndX - bd.dragStartX);
				data.view._badDropAction.args = [m, bd.dragStartY - (m * bd.dragStartX), (bd.dragStartX - bd.dragEndX < 0) ? -1 : 1];
				AjxTimedAction.scheduleAction(data.view._badDropAction, 0);
			}
		}
	}

    if (mouseEv) {
        mouseEv._stopPropagation = true;
        mouseEv._returnValue = false;
        if (ev) {
            mouseEv.setToDhtmlEvent(ev);
        }
    }
	return false;
};

ZmCalBaseView.prototype._deselectDnDHighlight =
function(data) {
}
ZmCalBaseView.prototype._restoreAppt =
function(data) {
}


ZmCalBaseView.prototype._apptBadDropEffect =
function(m, c, d) {
	var usingX = (Math.abs(m) <= 1);
	// Use the bigger delta to control the snap effect
	var bd = this._badDrop;
	var delta = usingX ? bd.dragStartX - bd.dragEndX : bd.dragStartY - bd.dragEndY;
	if (delta * d > 0) {
		if (usingX) {
			bd.dragEndX += (30 * d);
			bd.icon.style.top = m * bd.dragEndX + c;
			bd.icon.style.left = bd.dragEndX;
		} else {
			bd.dragEndY += (30 * d);
			bd.icon.style.top = bd.dragEndY;
			bd.icon.style.left = (bd.dragEndY - c) / m;
		}
		AjxTimedAction.scheduleAction(this._badDropAction, 0);
	} else {
		Dwt.setVisible(bd.icon, false);
		bd.icon = null;
	}
};

// --- Functions to be overridden for DnD
ZmCalBaseView.prototype._createContainerRect =
function(data) {
    this._containerRect = new DwtRectangle(0,0,0,0);
}

ZmCalBaseView.prototype._clearSnap =
function(snap) { }

ZmCalBaseView.prototype._apptDndBegin =
function(data) {
    return  false;
}

ZmCalBaseView.prototype._restoreHighlight =
function(data) { }

ZmCalBaseView.prototype._doApptMove =
function(data, deltaX, deltaY) { }

ZmCalBaseView.prototype._restoreApptLoc =
function(data) { }

ZmCalBaseView.prototype._cancelNewApptDrag =
function(data) {
    if (data && data.newApptDivEl) {
        // ESC key is pressed while dragging the mouse
        // Undo the drag event and hide the new appt div
        data.gridEl.style.cursor = 'auto';
        var col = data.view._getColFromX(data.gridX);
	    data.folderId = col ? (col.cal ? col.cal.id : null) : null;
		Dwt.setVisible(data.newApptDivEl, false);
    }
};

ZmCalBaseView.prototype._handleApptScrollRegion =
function(docX, docY, incr, data) {  }

ZmCalBaseView.prototype.startIndicatorTimer=function() { };

ZmCalBaseView.prototype.setTimer=function(min){
    var period = min*60*1000;
    return AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.updateTimeIndicator), period);
};

ZmCalBaseView.prototype.updateTimeIndicator=function() { };

/**
 * De-selects a selected appointment
 *
 * @param   {array}  appts an array of appointments
 */
ZmCalBaseView.prototype.deselectAppt =
function (appts) {
    appts = AjxUtil.toArray(appts);

    var type = this._getItemData(appts, "type");

    for(var i = 0; i < appts.length; i++) {
        var selIdx = this._selectedItems.indexOf(appts[i]);

        if (selIdx < 0) {
            continue;
        }

        // despite their code and general architecture, calendar
        // views never have more than one selected item, so just
        // switch to focus to the view itself
        this.setFocusElement(this.getHtmlElement());

        appts[i].className = this._getStyle(type);
        this._selectedItems.remove(appts[i]);
        this._selEv.detail = DwtListView.ITEM_DESELECTED;
        this._selEv.item = appts[i];
        this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);
    }
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalColView")) {
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

ZmCalColView = function(parent, posStyle, controller, dropTgt, view, numDays, scheduleMode, readonly, isInviteMessage, isRight) {
	if (arguments.length == 0) { return; }

	if (appCtxt.get(ZmSetting.CAL_SCALING) == "10") {
		ZmCalColView._MINIMUM_APPT_HEIGHT = 10;
		ZmCalColView._SNAP_MINUTES = 10;
		ZmCalColView._HOUR_HEIGHT = 126;
		ZmCalColView._MSEC_DURATION = AjxDateUtil.MSEC_PER_MINUTE*10;
	} else if (appCtxt.get(ZmSetting.CAL_SCALING) == "15") {
		ZmCalColView._MINIMUM_APPT_HEIGHT = 15;
		ZmCalColView._SNAP_MINUTES = 15;
		ZmCalColView._HOUR_HEIGHT = 84;
		ZmCalColView._MSEC_DURATION = AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES;
	} else {
		ZmCalColView._MINIMUM_APPT_HEIGHT = 22;
		ZmCalColView._SNAP_MINUTES = 30;
		ZmCalColView._HOUR_HEIGHT = 42;
		ZmCalColView._MSEC_DURATION = AjxDateUtil.MSEC_PER_HALF_HOUR;
	}

	ZmCalColView._HALF_HOUR_HEIGHT = ZmCalColView._HOUR_HEIGHT/2;
	ZmCalColView._15_MINUTE_HEIGHT = ZmCalColView._HOUR_HEIGHT/4;
	ZmCalColView._DAY_HEIGHT = ZmCalColView._HOUR_HEIGHT*24;

	view = view || ZmId.VIEW_CAL_DAY;
	// set before call to parent
	this._scheduleMode = scheduleMode;
    var workingHours = ZmCalBaseView.parseWorkingHours(ZmCalBaseView.getWorkingHours());
    if (!numDays && view === ZmId.VIEW_CAL_WORK_WEEK) {
        // Edge Case:   Work week is selected but all the days are configured as non working days,
        //              Fall back to week view by faking all the days are working days with same start and end time
        for (var i=0; i<workingHours.length; i++) {
            if (!workingHours[i].isWorkingDay) {
                workingHours[i].isWorkingDay = true;
            }
        }
        numDays = 7;
        var msgDlg = appCtxt.getMsgDialog();
        msgDlg.setMessage(ZmMsg.emptyWorkingHoursWarning, DwtMessageDialog.WARNING_STYLE);
        msgDlg.popup();
        var listener = msgDlg.popdown.bind(msgDlg);
        msgDlg.setButtonListener(DwtDialog.OK_BUTTON, listener);
    }
    this.workingHours = workingHours;

	this.numDays = numDays || 1;
	this._daySepWidth = 2;														// width of separator between days
	this._columns = [];
	this._layoutMap = [];
	this._unionBusyDivIds = [];													// div ids for layingout union
    this._fbBarEnabled = this.fbStatusBarEnabled();

	//we need special alignment for this case.
	this._isInviteMessage = isInviteMessage;
	this._isRight = isRight;

	ZmCalBaseView.call(this, parent, "calendar_view", posStyle, controller, view, readonly);
	var element = this.getHtmlElement();
	// clear the onClick event handler.  Otherwise accessibility code will
	// generate spurious mouse up/down events
	this._setEventHdlrs([DwtEvent.ONCLICK], true, element);

	this.setDropTarget(dropTgt);
	this.setScrollStyle(DwtControl.CLIP);
	this._needFirstLayout = true;

    this._isValidIndicatorDuration = true;
};

ZmCalColView.prototype = new ZmCalBaseView;
ZmCalColView.prototype.constructor = ZmCalColView;

ZmCalColView.DRAG_THRESHOLD = 4;

// min width before we'll turn on horizontal scrollbars
ZmCalColView.MIN_COLUMN_WIDTH = 120;
// max number of all day appts before we turn on vertical scrollbars
ZmCalColView.MAX_ALLDAY_APPTS = 4;

ZmCalColView._OPACITY_APPT_NORMAL = 100;
ZmCalColView._OPACITY_APPT_DECLINED = 20;
ZmCalColView._OPACITY_APPT_TENTATIVE = 60;
ZmCalColView._OPACITY_APPT_DND = 70;

ZmCalColView._OPACITY_APPT_FREE = 40;
ZmCalColView._OPACITY_APPT_BUSY = 100;
ZmCalColView._OPACITY_APPT_TENTATIVE = 60;

ZmCalColView._HOURS_DIV_WIDTH = parseInt(ZmMsg.COLUMN_WIDTH_HOURS); // width of div holding hours text (1:00am, etc); defaults to 55
ZmCalColView._UNION_DIV_WIDTH = 40; // width of div holding union in sched view
ZmCalColView._FBBAR_DIV_WIDTH = 10;

ZmCalColView._ALL_DAY_SEP_HEIGHT = 5; // height of separator between all day appts and body

ZmCalColView._SCROLL_PRESSURE_FUDGE = 10; // pixels for scroll pressure around top/bottom

ZmCalColView._DAY_HEADING_HEIGHT = 20;
ZmCalColView._ALL_DAY_APPT_HEIGHT = 20;
ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD = 3; // space between all day appt rows
ZmCalColView._APPT_X_FUDGE = 0; // due to border stuff
ZmCalColView._APPT_Y_FUDGE = -1; // ditto
ZmCalColView._APPT_WIDTH_FUDGE = (AjxEnv.isIE ? 0 : 0); // due to border stuff
ZmCalColView._APPT_HEIGHT_FUDGE = (AjxEnv.isIE ? 0 : 0); // ditto

ZmCalColView._STATUS_FREE       = "F";
ZmCalColView._STATUS_TENTATIVE  = "T";
ZmCalColView._STATUS_BUSY       = "B";
ZmCalColView._STATUS_OOO        = "O";

ZmCalColView.prototype.toString =
function() {
	return "ZmCalColView";
};

ZmCalColView.prototype.fbStatusBarEnabled =
function(){
    return false;
};

ZmCalColView.prototype.getRollField =
function() {
	switch(this.view) {
		case ZmId.VIEW_CAL_WORK_WEEK:
		case ZmId.VIEW_CAL_WEEK:
			return AjxDateUtil.WEEK;
			break;
		case ZmId.VIEW_CAL_DAY:
		default:
			return AjxDateUtil.DAY;
			break;
	}
};

ZmCalColView.prototype.dragSelect =
function(div) {
	// do nothing
};

ZmCalColView.prototype.dragDeselect =
function(div) {
	// do nothing
};

ZmCalColView.prototype.setIsRight =
function(isRight) {
	this._isRight = isRight;
};

ZmCalColView.prototype._dateUpdate =
function(rangeChanged) {
	this._selectDay(this._date);
	this._clearSelectedTime();
	this._updateSelectedTime();
};

ZmCalColView.prototype._selectDay =
function(date) {
	if (this._numDays == 1 || this._scheduleMode) return;
	var day = this._getDayForDate(date);
	if (day != null) {
		var col = this._columns[day.index];
		if (this._selectedDay) {
	 		var te = document.getElementById(this._selectedCol.titleId);
	 		te.className = this._selectedDay.isToday ? 'calendar_heading_day_today' : 'calendar_heading_day';
		}
		this._selectedDay = day;
		this._selectedCol = col;
		var te = document.getElementById(col.titleId);
 		te.className = day.isToday ? 'calendar_heading_day_today-selected' : 'calendar_heading_day-selected';
	}
};

ZmCalColView.prototype._clearSelectedTime =
function() {
	var e = document.getElementById(this._timeSelectionDivId);
	if (e) Dwt.setVisible(e, false);
};

ZmCalColView.prototype._updateSelectedTime =
function() {
	var t = this._date.getTime();
	if (t < this._timeRangeStart || t >= this._timeRangeEnd)
		return;

	var e = document.getElementById(this._timeSelectionDivId);
	if (!e) return;

	var bounds = this._getBoundsForDate(this._date, ZmCalColView._MSEC_DURATION);
	if (bounds == null) return;
	var snap = this._snapXY(bounds.x, bounds.y, ZmCalColView._SNAP_MINUTES);
	if (snap == null) return;

	Dwt.setLocation(e, snap.x, snap.y);
	Dwt.setSize(e, bounds.width, bounds.height);
	Dwt.setOpacity(e, 40);
	Dwt.setVisible(e, true);
};

ZmCalColView.prototype._removeNode =
function(id) {
	var node = document.getElementById(id);
	if (node) node.parentNode.removeChild(node);
};

ZmCalColView.prototype._updateUnionDataHash =
function(index, folderId) {
	var hash = this._unionBusyData[index];
	if (!hash) hash = this._unionBusyData[index] = {};
	hash[folderId] = 1;
};

ZmCalColView.prototype._updateUnionData =
function(appt) {
	if (appt.isAllDayEvent()) {
		this._updateUnionDataHash(48, appt.folderId);
	} else {
		var em = appt.endDate.getMinutes();
		var eh = appt.endDate.getHours();
		var startIndex = (appt.startDate.getHours()*2) + (appt.startDate.getMinutes() < 30 ? 0 : 1);
		var endIndex = ((eh ? eh : 24) *2) + (em == 0 ? 0 : (em <= 30 ? 1 : 2));
		if (startIndex == endIndex) endIndex++;
		for (var i=startIndex; i < endIndex; i++) {
			this._updateUnionDataHash(i, appt.folderId);
		}
	}
};

ZmCalColView.prototype.addAppt =
function(appt) {
	ZmCalBaseView.prototype.addAppt.call(this, appt);
	if (this._scheduleMode) {
		this._updateUnionData(appt);
	}
};

ZmCalColView.prototype._resetCalendarData =
function() {
	// TODO: optimize: if calendar list is same, skip!

	// remove existing
	// TODO: optimize, add/remove depending on new calendar length
	if (this._numCalendars > 0) {
		for (var i = 0; i < this._numCalendars; i++) {
			var col = this._columns[i];
			this._removeNode(col.titleId);
			this._removeNode(col.headingDaySepDivId);
			this._removeNode(col.daySepDivId);
		}
	}

	this._calendars = this._controller.getCheckedCalendars();
	this._calendars.sort(ZmFolder.sortCompareNonMail);
	this._folderIdToColIndex = {};
	this._columns = [];
	this._numCalendars = this._calendars.length;

	this._layoutMap = [];
	this._unionBusyData = []; 			//  0-47, one slot per half hour, 48 all day
	this._unionBusyDataToolTip = [];	// tool tips

	var titleParentEl = document.getElementById(this._allDayHeadingDivId);
	var headingParentEl = document.getElementById(this._allDayScrollDivId);
	var dayParentEl = document.getElementById(this._apptBodyDivId);

	for (var i = 0; i < this._numCalendars; i++) {
		var col = this._columns[i] = {
			index: i,
			dayIndex: 0,
			cal: this._calendars[i],
			titleId: Dwt.getNextId(),
			headingDaySepDivId: Dwt.getNextId(),
			daySepDivId: Dwt.getNextId(),
            workingHrsFirstDivId: Dwt.getNextId(),
            workingHrsSecondDivId: Dwt.getNextId(),
			apptX: 0, 		// computed in layout
			apptWidth: 0,	// computed in layout
			allDayX: 0, 	// computed in layout
			allDayWidth: 0	// computed in layout
		};
		var cal = this._calendars[i];
		this._folderIdToColIndex[cal.id] = col;
		if (cal.isRemote() && cal.rid && cal.zid) {
			this._folderIdToColIndex[cal.zid + ":" + cal.rid] = col;
		}

		var div = document.createElement("div");
		div.style.position = 'absolute';
		div.className = "calendar_heading_day";
		div.id = col.titleId;
		var calName = AjxStringUtil.htmlEncode(cal.getName());
		if (appCtxt.multiAccounts) {
			var acct = cal.getAccount();
			div.innerHTML = [
				"<center><table role='presentation' border=0><tr><td>",
				calName,
				"</td><td>[",
				"<td>",
				AjxImg.getImageSpanHtml(acct.getIcon(), "width:18px"),
				"</td><td>",
				AjxStringUtil.htmlEncode(acct.getDisplayName()),
				"]</td></tr></table></center>"
			].join("");
		} else {
			div.innerHTML = calName;
		}
        if(titleParentEl) {
		    titleParentEl.appendChild(div);
        }
		div = document.createElement("div");
		div.className = "calendar_day_separator";
		div.style.position = 'absolute';
		div.id = col.headingDaySepDivId;
        if(headingParentEl) {
		    headingParentEl.appendChild(div);
        }

		div = document.createElement("div");
		div.className = "calendar_day_separator";
		div.style.position = 'absolute';
		div.id = col.daySepDivId;
        if(dayParentEl) {
		    dayParentEl.appendChild(div);
        }
	}
};

ZmCalColView.prototype._preSet =
function() {
	if (this._scheduleMode) {
		this._resetCalendarData(); // cal must be first
	}
	this._layoutMap = [];
	this._resetAllDayData();
};

ZmCalColView.prototype._postSet =
function() {
	this._computeApptLayout();
	this._computeAllDayApptLayout();
	if (!this._needFirstLayout) {
		this._layoutAppts();
	}
	this._layout();
	this._scrollToTime(8);

	if(this._list && this._list.size() > 0) {
		AjxDebug.println(AjxDebug.CALENDAR, " ---------------- ZmCalColView::set - calendar is blank");
		AjxDebug.println(AjxDebug.CALENDAR, " list size :" + this._list.size());
	}

	if(this._fbBarEnabled){
		this._layoutFBBar();
	}

	this._checkForOffscreenAppt();
	Dwt.setLoadedTime("ZmCalItemView");
};

ZmCalColView._inSyncScroll = false;

ZmCalColView.prototype._syncScroll =
function(resetLeft) {
	if (ZmCalColView._inSyncScroll) { return; }

	ZmCalColView._inSyncScroll = true;
	try {
		var bodyElement = document.getElementById(this._bodyDivId),
		    hourElement = document.getElementById(this._hoursScrollDivId),
		    alldayElement = document.getElementById(this._allDayScrollDivId),
		    unionGridScrollElement = document.getElementById(this._unionGridScrollDivId),
			alldayApptElement = document.getElementById(this._allDayApptScrollDivId),
			tabContainerElement = document.getElementById(this._tabsContainerDivId);

		hourElement.scrollTop = bodyElement.scrollTop;
		hourElement.scrollLeft = bodyElement.scrollLeft;
		if (resetLeft) bodyElement.scrollLeft = 0;
		bodyElement.scrollLeft = tabContainerElement.scrollLeft;
		alldayElement.scrollLeft = bodyElement.scrollLeft;
		alldayApptElement.scrollLeft = bodyElement.scrollLeft;
		if (unionGridScrollElement) unionGridScrollElement.scrollTop = bodyElement.scrollTop;
        this._checkForOffscreenAppt(bodyElement);
	} catch (ex) {
		 ZmController.handleScriptError(ex, true);
	} finally {
		 ZmCalColView._inSyncScroll = false;
	}
};

ZmCalColView.prototype._horizontalScrollbar =
function(enable) {
	var bodyElement = document.getElementById(this._bodyDivId);
	bodyElement.className = enable ? "calendar_body_hscroll" : "calendar_body";
	if (enable != this._horzEnabled) {
		this._horzEnabled = enable;
		this._syncScroll(true);
	}
};

ZmCalColView.prototype._allDayVerticalScrollbar =
function(enable) {
	var el = document.getElementById(this._allDayApptScrollDivId);
	el.className = enable ? "calendar_allday_appt_vert" : "calendar_allday_appt";
	if (enable != this._vertEnabled) {
		this._vertEnabled = enable;
		this._syncScroll(true);
	}
};

ZmCalColView.prototype._allDayScrollToBottom =
function() {
	var el = document.getElementById(this._allDayApptScrollDivId);
	el.scrollTop = this._allDayFullDivHeight;
};

ZmCalColView.prototype._scrollToTime =
function(hour) {
	hour = hour || 8; // default to 8am

	if (!this._autoScrollDisabled) {
		var bodyElement = document.getElementById(this._bodyDivId);
        if (!bodyElement) { return; }
		bodyElement.scrollTop = ZmCalColView._HOUR_HEIGHT*hour - 10;
		this._syncScroll();
	} else {
		this._autoScrollDisabled = false;
	}
};

ZmCalColView.prototype._updateTitle =
function() {
	var dayFormatter = DwtCalendar.getDayFormatter();

	if (this.numDays == 1) {
		var colFormatter = DwtCalendar.getDateFormatter();
		var date = this._date;
		this._title = this._scheduleMode
			? colFormatter.format(date)
			: dayFormatter.format(date);
	} else {
		var first = this._days[0].date;
		var last = this._days[this.numDays-1].date;
		this._title = [
			dayFormatter.format(first), " - ", dayFormatter.format(last)
		].join("");
	}
};

ZmCalColView.prototype._dayTitle =
function(date) {
	var formatter = this.numDays == 1
		? DwtCalendar.getDateLongFormatter()
		: DwtCalendar.getDateFormatter();
	return formatter.format(date);
};

ZmCalColView.prototype._updateDays =
function() {
	var d = new Date(this._date.getTime());
    d.setHours(0,0,0,0);

    //counter to track DST adjustments
    var daylightAdjustment = false;

    //handle daylight shifting the day e.g. Santiago  Oct 10, 2010 00:00 shifted to Oct 9 2010 23:00
    if(d.getHours() != 0) {
        AjxDateUtil.rollToNextDay(d);
        daylightAdjustment = true;
    }

	var dow;

	switch(this.view) {
		case ZmId.VIEW_CAL_WORK_WEEK:
			/*dow = d.getDay();
			if (dow == 0)
				d.setDate(d.getDate()+1);
			else if (dow != 1)
				d.setDate(d.getDate()-(dow-1));
			break; */
		case ZmId.VIEW_CAL_WEEK:
			var fdow = this.firstDayOfWeek();
			dow = d.getDay();
			if (dow != fdow) {
				d.setDate(d.getDate()-((dow+(7-fdow))%7));
			}
			break;
		case ZmId.VIEW_CAL_DAY:
		default:
			/* nothing */
			break;
	}

    //handling the case where start day of week shifted due to DST
    if(d.getHours() != 0 && !daylightAdjustment) {
        AjxDateUtil.rollToNextDay(d);
        daylightAdjustment = true;
    }

	this._dateToDayIndex = new Object();

	var today = new Date();
	today.setHours(0,0,0,0);

	var lastDay = this.numDays - 1;
    var j = 0;
	for (var i=0; i < 7; i++) {
        var wHrs = this.workingHours[d.getDay()];
        var isWorkingDay = wHrs && wHrs.isWorkingDay ? wHrs.isWorkingDay : false;
        if (this.view === ZmId.VIEW_CAL_WEEK    ||
            this.view === ZmId.VIEW_CAL_DAY     ||
            this._scheduleMode === true         ||
            isWorkingDay === true ) {

            var day = this._days[j] = {};
            day.index = j;
            day.date = new Date(d);
            day.endDate = new Date(d);
            day.endDate.setHours(23,59,59,999);
            day.isToday = day.date.getTime() == today.getTime();
            day.isWorkingDay = isWorkingDay;
            this._dateToDayIndex[this._dayKey(day.date)] = day;
            if (!this._scheduleMode && this._columns[j]) {
                var id = this._columns[j].titleId;
                this._calendarTodayHeaderDivId=day.isToday?id:this._calendarTodayHeaderDivId;
                var te = document.getElementById(id);
                if (te) {
                    te.innerHTML = this._dayTitle(d);
                    this.associateItemWithElement(null, te, ZmCalBaseView.TYPE_DAY_HEADER, id, {dayIndex:j});
                    te.className = day.isToday ? 'calendar_heading_day_today' : 'calendar_heading_day';
                }
            }
            j++;
        }
		var oldDate = d.getDate();
		d.setDate(d.getDate() + 1);
		if (oldDate == d.getDate()) {
			// daylight saving problem
			d.setHours(0,0,0,0);
			d.setTime(d.getTime() + AjxDateUtil.MSEC_PER_DAY);
		}

        //handling the case where first day got shifted due to DST
        if(daylightAdjustment) {
            d.setHours(0,0,0,0);
            daylightAdjustment = false;
        }
	}
	var te = document.getElementById(this._headerYearId);
    if(te) {
	    te.innerHTML = this._days[0].date.getFullYear();
    }
};

ZmCalColView.prototype._resetAllDayData =
function() {
	this._allDayAppts = {};
	this._allDayApptsList = [];
	this._allDayApptsRowLayouts = [];
	this._addAllDayApptRowLayout();
};

/**
 * we don't want allday appts that span days to be fanned out
 */
ZmCalColView.prototype._fanoutAllDay =
function(appt) {
	return false;
};

ZmCalColView.prototype._getDivForAppt =
function(appt) {
	return document.getElementById(appt.isAllDayEvent() ? this._allDayDivId : this._apptBodyDivId);
};



// for the new appt when drag selecting time grid
ZmCalColView.prototype._populateNewApptHtml =
function(div, allDay, folderId) {
	if (folderId == null) {
		folderId = this._controller.getDefaultCalendarFolderId();
	}
	var color = ZmCalendarApp.COLORS[this._controller.getCalendarColor(folderId)];
	var prop = allDay ? "_newAllDayApptColor" : "_newApptColor";
	if (this[prop] && this[prop] == color) {
		return div;
	}

	this[prop] = color;
	div.style.position = 'absolute';
	Dwt.setSize(div, 10, 10);// will be resized
	div.className = this._getStyle(null, true);
	Dwt.setOpacity(div, ZmCalColView._OPACITY_APPT_DND);
	var calendar = appCtxt.getById(folderId);
	//var headerColor = calendar.rgb ? AjxColor.deepen(AjxColor.darken(calendar.rgb,ZmCalBaseView.headerColorDelta)) : "";
	var bodyColor = calendar.rgb ? AjxColor.deepen(AjxColor.lighten(calendar.rgb,ZmCalBaseView.bodyColorDelta)) : "";
	var subs = {
		id: div.id,
		newState: "",
		headerColor: calendar.rgb ? "" : (color + "Light"),
		bodyColor: calendar.rgb ? "" : (color + "Bg"),
		headerStyle: calendar.rgb ? "background-color: "+bodyColor+";" : "",
		name: AjxStringUtil.htmlEncode(ZmMsg.newAppt),
		starttime: "",
		endtime: "",
		location: "",
		status: ""
	};
    var template;
    var gradient = Dwt.createLinearGradientCss("#FFFFFF", bodyColor, "v");
    if (allDay) {
        template = "calendar_appt_allday";
        if (gradient) {
            subs.headerStyle = gradient;
        }
    } else {
        template = "calendar_appt";
        if (gradient) {
            subs.bodyStyle   = gradient;
            subs.headerStyle = null;
        }
    }
	div.innerHTML = AjxTemplate.expand("calendar.Calendar#"+template, subs);
	return div;
};

ZmCalColView.prototype._createItemHtml = function(appt) {

	if (this.view === ZmId.VIEW_CAL_WORK_WEEK) {
		var availableStartTime = this.getAvailableStartTime(appt);
		if (!availableStartTime) {
			return;
		}
	}

    var isAllDay = appt.isAllDayEvent();
	if (isAllDay) {
		var dataId = appt.getUniqueId();
		var startTime = availableStartTime || Math.max(appt.getStartTime(), this._timeRangeStart);

		this._allDayAppts[dataId] = {
		    appt:       appt,
			startTime:  startTime
		};
		this._allDayApptsList.push(appt);
	}

	var apptWidth = 10,
	    apptHeight = 10,
	    apptX = 0,
	    apptY = 0,
	    layout = this._layoutMap[this._getItemId(appt)];

	// set up DIV
	var div = document.createElement("div");

    Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
    Dwt.setCursor(div, 'default');
	Dwt.setSize(div, apptWidth, apptHeight);
	if (layout) {
		div.style.left = apptX + 'px';
		div.style.top = apptY + 'px';
	}
	div.className = this._getStyle();
    if (this.view === ZmId.VIEW_CAL_FB) {
        Dwt.setScrollStyle(div, Dwt.CLIP);
    }

	this.associateItemWithElement(appt, div, ZmCalBaseView.TYPE_APPT);

	var isNew = (appt.ptst === ZmCalBaseItem.PSTATUS_NEEDS_ACTION),
	    id = this._getItemId(appt),
	    calendar = appCtxt.getById(appt.folderId),
	    isRemote = Boolean(calendar.url),
	    is30 = appt._orig.getDuration() <= ZmCalColView._MSEC_DURATION,
	    is60 = appt._orig.getDuration() <= ZmCalColView._MSEC_DURATION * 2,
		apptName = AjxStringUtil.htmlEncode(appt.getName());

	// normalize location
	var location = appt.getLocation();
	location = location && location.length && !is60 ? "<div class='appt_location'>" + AjxStringUtil.htmlEncode(appt.getLocation()) + "</div>" : null;

	if ((is30 || isAllDay) && this.view !== ZmId.VIEW_CAL_DAY) {
        // fit as much of appt name as we can in one row, use ... if we have to truncate
        apptName = isAllDay ? apptName : appt.getDurationText(true, true) + " - " + apptName;
        var apptBounds = this._getBoundsForAppt(appt),
            apptWidth = apptBounds && apptBounds.width;

        if (apptWidth > 30) {
            apptName = AjxStringUtil.fitString(apptName, apptWidth - 15);
        }
	}

    var tagNames  = appt.getVisibleTags(),
        tagIcon = appt.getTagImageFromNames(tagNames);

    // If the tag icon is returned blank image reset the tag icon
    if (tagIcon === "Blank_16") {
        tagIcon = "";
    }

    var colors = ZmApptViewHelper.getApptColor(isNew, calendar, tagNames, "body"),
	    bodyStyle = ZmCalBaseView._toColorsCss(colors.appt),
        fba = isNew ? ZmCalBaseItem.PSTATUS_NEEDS_ACTION : appt.fba;

	var subs = {
		id:             id,
		newState:       isNew ? "_new" : "",
		headerStyle:    bodyStyle,
		name:           apptName,
		starttime:      appt.getDurationText(true, true),
		endtime:        !appt._fanoutLast && (appt._fanoutFirst || appt._fanoutNum > 0) ? "" : ZmCalBaseItem._getTTHour(appt.endDate),
		location:       location,
		status:         appt.isOrganizer() ? "" : appt.getParticipantStatusStr(),
		icon:           appt.isPrivate() ? "ReadOnly" : null,
		tagIcon:        tagIcon,
		hideTime:       is60,
		showAsColor :   ZmApptViewHelper._getShowAsColorFromId(fba),
        boxBorder:      ZmApptViewHelper.getBoxBorderFromId(fba),
        isDraft:        appt.isDraft,
        otherAttendees: appt.otherAttendees,
        isException:    appt.isException,
        isRecurring:    appt.isRecurring()
	};

	var template,
        colorParam,
        clearParam,
        bs;

	if (appt.isAllDayEvent()) {
        colorParam = "headerStyle";
		template = "calendar_appt_allday";
		if (!this.isStartInView(appt._orig)) {
            bs = "border-left:none;";
        }
		if (!this.isEndInView(appt._orig)) {
            bs += "border-right:none;";
        }
		if (bs) {
            subs.bodyStyle = bs;
        }
	}
    else if (this.view == ZmId.VIEW_CAL_FB) {
        template = "calendar_fb_appt";
    }
    else if (is30) {
        colorParam = "headerStyle";
		template = "calendar_appt_30";
	}
    else if (appt._fanoutNum > 0) {
        colorParam = "bodyStyle";
		template   = "calendar_appt_bottom_only";
	}
    else {
        colorParam = "bodyStyle";
        clearParam = "headerStyle";
		template   = "calendar_appt";
	}
    // Currently header/bodyStyles are only used for coloring.  Replace with a gradient
    // if supported by the browser
    ZmApptViewHelper.setupCalendarColor(true, colors, tagNames, subs, colorParam, clearParam, 1, 1);

	div.innerHTML = AjxTemplate.expand("calendar.Calendar#" + template, subs);

    // Set opacity on the table element that is colored with the gradient.  Needed for IE
    var tableEl = Dwt.getDescendant(div, id + "_tableBody"),
        opacity = ZmCalBaseView.getApptOpacity(appt);
    if (tableEl) {
        Dwt.setOpacity(tableEl, opacity);
    }
    else {
        Dwt.setOpacity(div, opacity);
    }

	// if (we can edit this appt) then create sash....
	if (!appt.isReadOnly() && !appt.isAllDayEvent() && !isRemote && this.view !== ZmId.VIEW_CAL_FB) {
		if (appt._fanoutLast || (!appt._fanoutFirst && (!appt._fanoutNum))) {
			var bottom = document.createElement("div");
			this.associateItemWithElement(null, bottom, ZmCalBaseView.TYPE_APPT_BOTTOM_SASH, appt.id + "-bs");
			bottom.className = 'appt_bottom_sash';
			div.appendChild(bottom);
		}

		if (appt._fanoutFirst || (!appt._fanoutLast && (!appt._fanoutNum))) {
			var top = document.createElement("div");
			this.associateItemWithElement(null, top, ZmCalBaseView.TYPE_APPT_TOP_SASH, appt.id + "-ts");
			top.className = 'appt_top_sash';
			div.appendChild(top);
		}
	}

	return div;
};


// TODO: i18n
ZmCalColView.prototype._createHoursHtml =
function(html) {

	html.append("<div style='position:absolute; top:-8; width:", ZmCalColView._HOURS_DIV_WIDTH, "px;' id='", this._bodyHourDivId, "'>");

	var formatter = DwtCalendar.getHourFormatter();
    var curDate = new Date();
	var date = new Date();
	date.setHours(0, 0, 0, 0);
    var timeTDWidth = ZmCalColView._HOURS_DIV_WIDTH - (this._fbBarEnabled ? ZmCalColView._FBBAR_DIV_WIDTH : 0 );
    html.append("<table role='presentation' class=calendar_grid_day_table>");
	for (var h=0; h < 25; h++) {
		html.append("<tr><td class=calendar_grid_body_time_td style='height:",
		ZmCalColView._HOUR_HEIGHT ,"px; width:", timeTDWidth, "px'><div id='"+this._hourColDivId+"_"+h+"' class=calendar_grid_body_time_text>");
		date.setHours(h);
		html.append(h > 0 && h < 24 ? AjxStringUtil.htmlEncode(formatter.format([h, date])) : "&nbsp;");
		html.append("</div>");
        html.append("</td>");
        if(this._fbBarEnabled){
            html.append("<td class=calendar_grid_body_fbbar_td style='height:",ZmCalColView._HOUR_HEIGHT ,"px; width:", ZmCalColView._FBBAR_DIV_WIDTH,"px; border-left:1px solid #A7A194;'>&nbsp;</td>");
        }
        html.append("</tr>");
	}
	html.append("</table>");
    html.append("<div id='"+this._curTimeIndicatorHourDivId+"' class='calendar_cur_time_indicator_arr'><div class='calendar_hour_arrow_indicator'>&rarr;</div></div>");
    html.append( "</div>");
};


ZmCalColView.prototype._createHtml =
function(abook) {
	this._days = {};
	this._columns = [];
	this._hours = {};
	this._layouts = [];
	this._allDayAppts = [];

	var html = new AjxBuffer();

	this._headerYearId = Dwt.getNextId();
	this._yearHeadingDivId = Dwt.getNextId();
	this._yearAllDayDivId = Dwt.getNextId();
	this._leftAllDaySepDivId = Dwt.getNextId();
	this._leftApptSepDivId = Dwt.getNextId();

	this._allDayScrollDivId = Dwt.getNextId();
	this._allDayHeadingDivId = Dwt.getNextId();
	this._allDayApptScrollDivId = Dwt.getNextId();
	this._allDayDivId = Dwt.getNextId();
	this._hoursScrollDivId = Dwt.getNextId();
	this._bodyHourDivId = Dwt.getNextId();
	this._allDaySepDivId = Dwt.getNextId();
	this._allDaySepSashDivId = Dwt.getNextId();
	this._bodyDivId = Dwt.getNextId();
	this._apptBodyDivId = Dwt.getNextId();
	this._newApptDivId = Dwt.getNextId();
	this._newAllDayApptDivId = Dwt.getNextId();
	this._timeSelectionDivId = Dwt.getNextId();
    this._curTimeIndicatorHourDivId = Dwt.getNextId();
    this._curTimeIndicatorGridDivId = Dwt.getNextId();
    this._hourColDivId = Dwt.getNextId();
    this._startLimitIndicatorDivId = Dwt.getNextId();
    this._endLimitIndicatorDivId = Dwt.getNextId();
    // Fix for bug: 66603. Reference to parent container of _allDayHeadingDivId
    this._tabsContainerDivId = Dwt.getNextId();


	if (this._scheduleMode) {
		this._unionHeadingDivId = Dwt.getNextId();
		this._unionAllDayDivId = Dwt.getNextId();
		this._unionHeadingSepDivId = Dwt.getNextId();
		this._unionGridScrollDivId = Dwt.getNextId();
		this._unionGridDivId = Dwt.getNextId();
		this._unionGridSepDivId = Dwt.getNextId();
        this._workingHrsFirstDivId = Dwt.getNextId();
        this._workingHrsFirstChildDivId = Dwt.getNextId();
        this._workingHrsSecondDivId = Dwt.getNextId();
        this._workingHrsSecondChildDivId = Dwt.getNextId();
	}

	this._allDayRows = [];

	if (!this._scheduleMode) {
		for (var i =0; i < this.numDays; i++) {
			this._columns[i] = {
				index: i,
				dayIndex: i,
				titleId: Dwt.getNextId(),
				headingDaySepDivId: Dwt.getNextId(),
				daySepDivId: Dwt.getNextId(),
                workingHrsFirstDivId: Dwt.getNextId(),
                workingHrsFirstChildDivId: Dwt.getNextId(),
                workingHrsSecondDivId: Dwt.getNextId(),
                workingHrsSecondChildDivId: Dwt.getNextId(),
				apptX: 0, // computed in layout
				apptWidth: 0,// computed in layout
				allDayX: 0, // computed in layout
				allDayWidth: 0// computed in layout
			};
		}
	}

	// year heading
	var inviteMessageHeaderStyle = (this._isInviteMessage && !this._isRight ? "height:26px;" : ""); //override class css in this case, so the header height aligns with the message view on the left
	var headerStyle = "position:absolute;" + inviteMessageHeaderStyle;
	
	html.append("<div id='", this._yearHeadingDivId, "' class='calendar_heading' style='", headerStyle,	"'>");
	html.append("<div id='", this._headerYearId,
		"' class=calendar_heading_year_text style='position:absolute; width:", ZmCalColView._HOURS_DIV_WIDTH,"px;'></div>");
	html.append("</div>");

	// div under year
	html.append("<div id='", this._yearAllDayDivId, "' style='position:absolute'></div>");

	// sep between year and headings
	html.append("<div id='", this._leftAllDaySepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");

	if (this._scheduleMode) {
		// "All" heading
		html.append("<div id='", this._unionHeadingDivId, "' class=calendar_heading style='position:absolute'>");
		html.append("<div class=calendar_heading_year_text style='position:absolute; width:", ZmCalColView._UNION_DIV_WIDTH,"px;'>",ZmMsg.all,"</div>");
		html.append("</div>");

		// div in all day space
		html.append("<div id='", this._unionAllDayDivId, "' style='position:absolute'></div>");

		// sep between year and headings
		html.append("<div id='", this._unionHeadingSepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");
	}

	// all day scroll	=============
	html.append("<div id='", this._allDayScrollDivId, "' style='position:absolute; overflow:hidden;'>");

	// all day headings
    // Fix for bug: 66603. Adding a container to calendar headings
    html.append("<div id='", this._tabsContainerDivId, "' name='_tabsContainerDivId' style='position:absolute;height:25px;bottom:0px;top:0px'>");
	html.append("<div id='", this._allDayHeadingDivId, "' class='calendar_heading' style='", headerStyle,	"'>");
	if (!this._scheduleMode) {
		for (var i =0; i < this.numDays; i++) {
			html.append("<div id='", this._columns[i].titleId, "' class='calendar_heading_day' style='position:absolute;'></div>");
		}
	}
	html.append("</div>");
    // Fix for bug: 66603
    html.append("</div>");

	// divs to separate day headings
	if (!this._scheduleMode) {
		for (var i =0; i < this.numDays; i++) {
			html.append("<div id='", this._columns[i].headingDaySepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");
		}
	}
	html.append("</div>");
	// end of all day scroll ===========

	// div holding all day appts
	html.append("<div id='", this._allDayApptScrollDivId, "' class='calendar_allday_appt' style='position:absolute'>");
	html.append("<div id='", this._allDayDivId, "' style='position:absolute'>");
	html.append("<div id='", this._newAllDayApptDivId, "' class='appt-selected' style='position:absolute; display:none;'></div>");
	html.append("</div>");
	html.append("</div>");

	// sep betwen all day and normal appts
	html.append("<div id='", this._allDaySepDivId, "' class=calendar_header_allday_separator style='overflow:hidden;position:absolute;'><div id='", this._allDaySepSashDivId, "' class='calendar_header_allday_separator_sash open'></div></div>");

	// div to hold hours
	html.append("<div id='", this._hoursScrollDivId, "' class=calendar_hour_scroll style='position:absolute;'>");
	this._createHoursHtml(html);
	html.append("</div>");

	// sep between hours and grid
	html.append("<div id='", this._leftApptSepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");

	// union grid
	if (this._scheduleMode) {
		html.append("<div id='", this._unionGridScrollDivId, "' class=calendar_union_scroll style='position:absolute'>");
		html.append("<div id='", this._unionGridDivId, "' class='ImgCalendarDayGrid' style='width:100%; height:1008px; position:absolute;'>");
		html.append("</div></div>");
		// sep between union grid and appt grid
		html.append("<div id='", this._unionGridSepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");
	}

	// grid body
	html.append("<div id='", this._bodyDivId, "' class=calendar_body style='position:absolute'>");
    html.append("<div id='", this._apptBodyDivId, "' class='ImgCalendarDayGrid' style='width:100%; height:1008px; position:absolute;background-color:#E3E3DC;'>");
	html.append("<div id='", this._timeSelectionDivId, "' class='calendar_time_selection' style='position:absolute; display:none;z-index:10;'></div>");
	html.append("<div id='", this._newApptDivId, "' class='appt-selected' style='position:absolute; display:none;'></div>");
	if (!this._scheduleMode) {
		for (var i =0; i < this.numDays; i++) {
		  html.append("<div id='", this._columns[i].daySepDivId, "' class='calendar_day_separator' style='position:absolute'></div>");
		  html.append("<div id='", this._columns[i].workingHrsFirstDivId, "' style='position:absolute;background-color:#FFFFFF;'><div id='", this._columns[i].workingHrsFirstChildDivId, "' class='ImgCalendarDayGrid' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");
		  html.append("<div id='", this._columns[i].workingHrsSecondDivId, "' style='position:absolute;background-color:#FFFFFF;'><div id='", this._columns[i].workingHrsSecondChildDivId, "' class='ImgCalendarDayGrid' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");
		}
	}
    else {
        html.append("<div id='", this._workingHrsFirstDivId, "' style='position:absolute;background-color:#FFFFFF;'><div class='ImgCalendarDayGrid' id='", this._workingHrsFirstChildDivId, "' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");
        html.append("<div id='", this._workingHrsSecondDivId, "' style='position:absolute;background-color:#FFFFFF;'><div class='ImgCalendarDayGrid' id='", this._workingHrsSecondChildDivId, "' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");
    }


	html.append("</div>");
    //Strip to indicate the current time
    html.append("<div id='"+this._curTimeIndicatorGridDivId+"' class='calendar_cur_time_indicator_container'><div class='calendar_cur_time_indicator_strip'></div></div>");
    html.append("<div id='"+this._startLimitIndicatorDivId+"' class='calendar_start_limit_indicator'><div class='ImgArrowMoreUp'></div></div>");
    html.append("<div id='"+this._endLimitIndicatorDivId+"' class='calendar_end_limit_indicator'><div class='ImgArrowMoreDown'></div></div>");
	html.append("</div>");

	this.getHtmlElement().innerHTML = html.toString();

    var func = AjxCallback.simpleClosure(ZmCalColView.__onScroll, ZmCalColView, this);
	document.getElementById(this._bodyDivId).onscroll = func;
	document.getElementById(this._allDayApptScrollDivId).onscroll = func;
    // Fix for bug: 66603. Adding a handler to enable scrolling.
    document.getElementById(this._tabsContainerDivId).onscroll = func;

	var ids = [this._apptBodyDivId, this._bodyHourDivId, this._allDayDivId, this._allDaySepDivId];
	var types = [ZmCalBaseView.TYPE_APPTS_DAYGRID, ZmCalBaseView.TYPE_HOURS_COL, ZmCalBaseView.TYPE_ALL_DAY, ZmCalBaseView.TYPE_DAY_SEP];
	for (var i = 0; i < ids.length; i++) {
		this.associateItemWithElement(null, document.getElementById(ids[i]), types[i], ids[i]);
	}
	this._scrollToTime(8);
};

ZmCalColView.prototype.updateTimeIndicator = function(force) {
	this._updateTimeIndicator(force);
	return this.setTimer(1);
}


ZmCalColView.prototype._updateTimeIndicator = function(force) {
    var curDate = new Date();
    var hr  = curDate.getHours();
    var min = curDate.getMinutes();
    var curHourDiv = document.getElementById(this._hourColDivId + "_" + hr);
    if (!curHourDiv) {
        return;
    }

    var curTimeHourIndicator = document.getElementById(this._curTimeIndicatorHourDivId);
	var currentTopPosition = Math.round((ZmCalColView._HOUR_HEIGHT/60)*min)+parseInt(curHourDiv.offsetParent.offsetTop);
    Dwt.setLocation(curTimeHourIndicator, curHourDiv.offsetParent.offsetLeft, currentTopPosition - 5);
    var calendarStrip = document.getElementById(this._curTimeIndicatorGridDivId);
    Dwt.setVisibility(calendarStrip,true);
    var todayColDiv = document.getElementById(this._calendarTodayHeaderDivId);
    if (todayColDiv && (force || this._isValidIndicatorDuration)) {
        Dwt.setBounds(calendarStrip, todayColDiv.offsetLeft, currentTopPosition, todayColDiv.offsetWidth, null);
    } else {
		Dwt.setVisibility(calendarStrip,false);
	}
};


ZmCalColView.prototype.startIndicatorTimer=function(force){
   if(force || !this._indicatorTimer){
    this._indicatorTimer = this.updateTimeIndicator(force);
   }
};

ZmCalColView.prototype.checkIndicatorNeed=function(viewId,startDate){
   var isValidView = (viewId == ZmId.VIEW_CAL_WORK_WEEK || viewId == ZmId.VIEW_CAL_WEEK || viewId == ZmId.VIEW_CAL_DAY);
   if(startDate!=null && isValidView){
        var today = new Date();
        var todayTime = today.getTime();
        startDate.setHours(0,0,0,0);
        var sTime = startDate.getTime();
        var endDate = AjxDateUtil.roll(startDate,AjxDateUtil.DAY,1);
        endDate.setHours(23,59,59,999);
        var endTime = endDate.getTime();
        if(!(todayTime>=sTime && todayTime<=endTime)){
            this._isValidIndicatorDuration = false;
            var calendarStrip = document.getElementById(this._curTimeIndicatorGridDivId);
            Dwt.setVisibility(calendarStrip,false);
        }else{
            this._isValidIndicatorDuration = true;
            this.updateTimeIndicator();
        }
   }else{
       this._isValidIndicatorDuration = true;
   }
};

/*
*   Checks whether any offscreen appointment exists, and indicates according to the direction it gets hidden.
 */
ZmCalColView.prototype._checkForOffscreenAppt=function(bodyElement){
    var topExceeds = false;
    var bottomExceeds = false;
    if(!bodyElement){bodyElement = document.getElementById(this._bodyDivId);}
    if(!bodyElement) { return; }
    var height = bodyElement.offsetHeight;
    var top = bodyElement.scrollTop;
    var appt;

    if(this._list && this._list.size()>0){
        var apptArray = this._list.getArray();
        for(var i=0;i<apptArray.length;i++){
            appt = apptArray[i];
            if (!appt) { continue; }
            var layoutParams = apptArray[i].getLayoutInfo();
            if(!topExceeds){topExceeds=(layoutParams && layoutParams.y<(top));}
            if(!bottomExceeds){bottomExceeds=(layoutParams && layoutParams.y>(height+top));}
            if(topExceeds && bottomExceeds){break;}
        }
    }

    var topIndicator = document.getElementById(this._startLimitIndicatorDivId);
    Dwt.setVisibility(topIndicator,topExceeds);
    var bottomIndicator = document.getElementById(this._endLimitIndicatorDivId);
    Dwt.setVisibility(bottomIndicator,bottomExceeds);

    if(topExceeds){
        topIndicator.style.top=bodyElement.scrollTop+"px";
    }

    if(bottomExceeds){
        bottomIndicator.style.top = ((bodyElement.offsetHeight+bodyElement.scrollTop+8)-(bottomIndicator.offsetHeight))+"px";
    }
};

ZmCalColView.__onScroll = 
function(myView) {
    if(this.__scrollActionId) {  // Fix for Bug 84928
	AjxTimedAction.cancelAction(this.__scrollActionId);
	delete this.__scrollActionId;
    } 
    this.__scrollActionId = AjxTimedAction.scheduleAction(new AjxTimedAction(myView,myView._syncScroll), 30); 
};

ZmCalColView.prototype._computeMaxCols =
function(layout, max) {
	//DBG.println("compute max cols for "+layout.appt.id+" col="+layout.col);
	if (layout.maxDone) return layout.maxcol;
	layout.maxcol = Math.max(layout.col, layout.maxcol, max);
	if (layout.right) {
		for (var r = 0; r < layout.right.length; r++) {
			layout.maxcol = Math.max(layout.col, this._computeMaxCols(layout.right[r], layout.maxcol));
		}
	}
	//DBG.println("max cols for "+layout.appt.id+" was: "+layout.maxcol);
	layout.maxDone = true;
	return layout.maxcol;
};

/*
 * compute appt layout for appts that aren't all day
 */
ZmCalColView.prototype._computeApptLayout =
function() {
//	DBG.println("_computeApptLayout");
//	DBG.timePt("_computeApptLayout: start", true);
	var layouts = this._layouts = new Array();
	var layoutsDayMap = [];
	var layoutsAllDay = [];
	var list = this.getList();
	if (!list) return;

	var size = list.size();
	if (size == 0) { return; }

	var overlap = null;
	var overlappingCol = null;

	for (var i=0; i < size; i++) {
		var ao = list.get(i);

		if (!ao || ao.isAllDayEvent()) {
			continue;
		}

		var newLayout = { appt: ao, col: 0, maxcol: -1};

		overlap = null;
		overlappingCol = null;

		var asd = ao.startDate;
		var aed = ao.endDate;

		var asdDate = asd.getDate();
		var aedDate = aed.getDate();

		var checkAllLayouts = (asdDate != aedDate);
		var layoutCheck = [];

		// if a appt starts n end in same day, it should be compared only with
		// other appts on same day and with those which span multiple days
		if (checkAllLayouts) {
			layoutCheck.push(layouts);
		} else {
			layoutCheck.push(layoutsAllDay);
			if (layoutsDayMap[asdDate]!=null) {
				layoutCheck.push(layoutsDayMap[asdDate]);
			}
		}

		// look for overlapping appts
		for (var k = 0; k < layoutCheck.length; k++) {
			for (var j=0; j < layoutCheck[k].length; j++) {
				var layout = layoutCheck[k][j];
				if (ao.isOverlapping(layout.appt, this._scheduleMode)) {
					if (overlap == null) {
						overlap = [];
						overlappingCol = [];
					}
					overlap.push(layout);
					overlappingCol[layout.col] = true;
					// while we overlap, update our col
					while (overlappingCol[newLayout.col]) {
						newLayout.col++;
					}
				}
			}
		}

		// figure out who is on our right
		if (overlap != null) {
			for (var c = 0; c < overlap.length; c++) {
				var l = overlap[c];
				if (newLayout.col < l.col) {
					if (!newLayout.right) newLayout.right = [l];
					else newLayout.right.push(l);
				} else {
					if (!l.right) l.right = [newLayout];
					else l.right.push(newLayout);
				}
			}
		}
		layouts.push(newLayout);
		if (asdDate == aedDate) {
			if(!layoutsDayMap[asdDate]) {
				layoutsDayMap[asdDate] = [];
			}
			layoutsDayMap[asdDate].push(newLayout);
		} else {
			layoutsAllDay.push(newLayout);
		}
	}

	// compute maxcols
	for (var i=0; i < layouts.length; i++) {
		this._computeMaxCols(layouts[i], -1);
		this._layoutMap[this._getItemId(layouts[i].appt)]  = layouts[i];
//		DBG.timePt("_computeApptLayout: computeMaxCol "+i, false);
	}
	
	delete layoutsAllDay;
	delete layoutsDayMap;
	delete layoutCheck;
	//DBG.timePt("_computeApptLayout: end", false);
};

/*
 * add a new all day appt row layout slot and return it
 */
ZmCalColView.prototype._addAllDayApptRowLayout =
function() {
	var data = [];
	var num = this._columns.length;
	for (var i=0; i < num; i++) {
		// free is set to true if slot is available, false otherwise
		// appt is set to the _allDayAppts data in the first slot only (if appt spans days)
		data[i] = { free: true, data: null };
	}
	this._allDayApptsRowLayouts.push(data);
	return data;
};

/**
 * take the appt data in reserve the slots
 */
ZmCalColView.prototype._fillAllDaySlot =
function(row, colIndex, data) {
	for (var j=0; j < data.numDays; j++) {
		var col = colIndex + j;
		if (col == row.length) break;
		row[col].data = j==0 ? data : null;
		row[col].free = false;
	}
};

/**
 * find a slot and fill it in, adding new rows if needed
 */
ZmCalColView.prototype._findAllDaySlot =
function(colIndex, data) {
	if (data.appt) {
		var appt = data.appt;
		var startTime = appt.getStartTime();
		var endTime = appt.getEndTime();
		data.numDays = 1;
        if (startTime != endTime) {
            data.numDays = this._calcNumDays(startTime, endTime);
        }
        if (startTime < data.startTime) {
            data.numDays -= this._calcNumDays(startTime, data.startTime);
        }
	}
	var rows = this._allDayApptsRowLayouts;
	var row = null;
	for (var i=0; i < rows.length; i++) {
		row = rows[i];
		for (var j=0; j < data.numDays; j++) {
			var col = colIndex + j;
			if (col == row.length) break;
			if (!row[col].free) {
				row = null;
				break;
			}
		}
		if (row != null)	break;
	}
	if (row == null) {
		row = this._addAllDayApptRowLayout();
	}

	this._fillAllDaySlot(row, colIndex, data);
};

ZmCalColView.prototype._calcNumDays =
function(startTime, endTime) {
    return Math.round((endTime-startTime) / AjxDateUtil.MSEC_PER_DAY);
}
// Calculate the offset in days from the 0th column date.  Used for
// multi-day appt dragging.
ZmCalColView.prototype._calcOffsetFromZeroColumn =
function(time) {
    var dayIndex = this._columns[0].dayIndex;
    var day = this._days[dayIndex];
    return Math.round((time-day.date.getTime()) / AjxDateUtil.MSEC_PER_DAY);
}

/*
 * compute layout info for all day appts
 */
ZmCalColView.prototype._computeAllDayApptLayout =
function() {
	var adlist = this._allDayApptsList;
	adlist.sort(ZmCalBaseItem.compareByTimeAndDuration);

	for (var i=0; i < adlist.length; i++) {
		var appt = adlist[i];
		var data = this._allDayAppts[appt.getUniqueId()];
		if (data) {
			var col = this._scheduleMode ? this._getColForFolderId(data.appt.folderId) : this._getDayForDate(new Date(data.startTime));
			if (col)	 this._findAllDaySlot(col.index, data);
		}
	}
};

ZmCalColView.prototype._layoutAllDayAppts =
function() {
	var rows = this._allDayApptsRowLayouts;
	if (!rows) { return; }

	var rowY = ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD + 2;
	for (var i=0; i < rows.length; i++) {
		var row = rows[i];
		var num = this._scheduleMode ? this._numCalendars : this.numDays;
		for (var j=0; j < num; j++) {
			var slot = row[j];
			if (slot.data) {
				var appt = slot.data.appt;
                var div = document.getElementById(this._getItemId(appt));
                if(div) {
                    if (this._scheduleMode) {
                        var cal = this._getColForFolderId(appt.folderId);
                        this._positionAppt(div, cal.allDayX+0, rowY);
                        this._sizeAppt(div, ((cal.allDayWidth + this._daySepWidth) * slot.data.numDays) - this._daySepWidth - 1,
                                     ZmCalColView._ALL_DAY_APPT_HEIGHT);
                    } else {
                        this._positionAppt(div, this._columns[j].allDayX+0, rowY);
                        this._sizeAppt(div, ((this._columns[j].allDayWidth + this._daySepWidth) * slot.data.numDays) - this._daySepWidth - 1,
                                     ZmCalColView._ALL_DAY_APPT_HEIGHT);
                    }
                }
			}
		}
		rowY += ZmCalColView._ALL_DAY_APPT_HEIGHT + ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD;
	}
};


ZmCalColView._getApptWidthPercent =
function(numCols) {
	switch(numCols) {
		case 1: return 1;
		case 2: return 0.8;
		case 3: return 0.6;
		case 4: return 0.4;
		default: return 0.4;
	}
};

ZmCalColView.prototype._positionAppt =
function(apptDiv, x, y) {
    if(!apptDiv) { return; }
	// position overall div
	Dwt.setLocation(apptDiv, x + ZmCalColView._APPT_X_FUDGE, y + ZmCalColView._APPT_Y_FUDGE);
};

ZmCalColView.prototype._sizeAppt =
function(apptDiv, w, h) {
    if(!apptDiv) { return; }
	// set outer as well as inner
	var fw = w + ZmCalColView._APPT_WIDTH_FUDGE; // no fudge for you
	var fh = h;
	Dwt.setSize(apptDiv, fw >= 0 ? fw : 0, fh >= 0 ? fh : 0);

	// get the inner div that should be sized and set its width/height
	var apptBodyDiv = document.getElementById(apptDiv.id + "_body");
	if (apptBodyDiv != null) {
		fw = w + ZmCalColView._APPT_WIDTH_FUDGE;
		fh = h + ZmCalColView._APPT_HEIGHT_FUDGE;
		Dwt.setSize(	apptBodyDiv, fw >= 0 ? fw : 0, fh >= 0 ? fh : 0);
	}
};

ZmCalColView.prototype._layoutAppt =
function(ao, apptDiv, x, y, w, h) {
	// record to restore after dnd/sash
	if (ao) ao._layout = {x: x, y: y, w: w, h: h};
	this._positionAppt(apptDiv, x, y);
	this._sizeAppt(apptDiv, w, h);
};

ZmCalColView.prototype._layoutAppts =
function() {
	// for starting x and width
	var data = this._hours[0];

	for (var i=0; i < this._layouts.length; i++) {
		var layout = this._layouts[i];
		var apptDiv = document.getElementById(this._getItemId(layout.appt));
		if (apptDiv) {
			layout.bounds = this._getBoundsForAppt(layout.appt);
            if (!layout.bounds) { continue; }
			var w = Math.floor(layout.bounds.width*ZmCalColView._getApptWidthPercent(layout.maxcol+1));
			var xinc = layout.maxcol ? ((layout.bounds.width - w) / layout.maxcol) : 0; // n-1
			var x = xinc * layout.col + (layout.bounds.x);
			this._layoutAppt(layout.appt, apptDiv, x, layout.bounds.y, w, layout.bounds.height);
		}
	}
};

ZmCalColView.prototype._getDayForDate =
function(d) {
	return this._dateToDayIndex[this._dayKey(d)];
};

ZmCalColView.prototype._getColForFolderId =
function(folderId) {
	return this._folderIdToColIndex[folderId];
};

ZmCalColView.prototype._getColFromX =
function(x) {
	var num = this._columns.length;
	for (var i =0; i < num; i++) {
		var col = this._columns[i];
		if (x >= col.apptX && x <= col.apptX+col.apptWidth) return col;
	}
	return null;
};

ZmCalColView.prototype._getLocationForDate =
function(d) {
	var h = d.getHours();
	var m = d.getMinutes();
	var day = this._getDayForDate(d);
	if (day == null) return null;
	return new DwtPoint(day.apptX, Math.floor(((h+m/60) * ZmCalColView._HOUR_HEIGHT))+1);
};

ZmCalColView.prototype._getBoundsForAppt =
function(appt) {
	var sd = appt.startDate;
	var endOfDay = new Date(sd);
	endOfDay.setHours(23,59,59,999);
    var endDate = new Date(appt.endDate);
    endDate.setHours(0,0,0,0);
    var endTime = appt.getEndTime();
    if(appt.startDate.getTime()==endDate.getTime()){
        var diffOffset = appt.checkDSTChangeOnEndDate();
        endTime = endTime + (diffOffset*60*1000);
    }
	var et = Math.min(endTime, endOfDay.getTime());

	if (this._scheduleMode)
		return this._getBoundsForCalendar(sd, et - sd.getTime(), appt.folderId);
	else
		return this._getBoundsForDate(sd, et - sd.getTime());
};

ZmCalColView.prototype._getBoundsForDate =
function(d, duration, col) {
	var durationMinutes = duration / 1000 / 60;
	durationMinutes = Math.max(durationMinutes, ZmCalColView._MINIMUM_APPT_HEIGHT);
	var h = d.getHours();
	var m = d.getMinutes();
	if (col == null && !this._scheduleMode) {
		var day = this._getDayForDate(d);
		col = day ? this._columns[day.index] : null;
	}
	if (col == null) return null;
	return new DwtRectangle(col.apptX, ((h+m/60) * ZmCalColView._HOUR_HEIGHT),
					col.apptWidth, (ZmCalColView._HOUR_HEIGHT / 60) * durationMinutes);
};

ZmCalColView.prototype._getBoundsForCalendar =
function(d, duration, folderId) {
	var durationMinutes = duration / 1000 / 60;
	durationMinutes = Math.max(durationMinutes, ZmCalColView._MINIMUM_APPT_HEIGHT);
	var h = d.getHours();
	var m = d.getMinutes();
	var col= this._getColForFolderId(folderId);
	if (col == null) return null;
	return new DwtRectangle(col.apptX, ((h+m/60) * ZmCalColView._HOUR_HEIGHT),
					col.apptWidth, (ZmCalColView._HOUR_HEIGHT / 60) * durationMinutes);
};

ZmCalColView.prototype._getBoundsForAllDayDate =
function(startSnap, endSnap, useYPadding) {
	if (startSnap == null || endSnap == null) return null;
    var yOffset = useYPadding ? ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD + 2 : 0;
	return new DwtRectangle(startSnap.col.allDayX, yOffset,
			(endSnap.col.allDayX + endSnap.col.allDayWidth) - startSnap.col.allDayX - this._daySepWidth-1,
			ZmCalColView._ALL_DAY_APPT_HEIGHT);
};

// snapXY coord to specified minute boundary (15,30)
// return x, y, col
ZmCalColView.prototype._snapXY =
function(x, y, snapMinutes, roundUp) {
	// snap it to grid
	var col = this._getColFromX(x);
	if (col == null) return null;
	x = col.apptX;
	var height = (snapMinutes/60) * ZmCalColView._HOUR_HEIGHT;
	y = Math.floor(y/height) * height;
	if (roundUp) y += height;
	return {x:x, y:y, col:col};
};

// snapXY coord to specified minute boundary (15,30)
// return x, y, col
ZmCalColView.prototype._snapAllDayXY =
function(x, y) {
	// snap it to grid
	var col = this._getColFromX(x);
	if (col == null) return null;
	x = col.allDayX;
	return {x:x, y:0, col:col};
};

ZmCalColView.prototype._snapAllDayOutsideGrid =
function(x) {
    var colWidth = this._columns[0].allDayWidth + this._daySepWidth;
    var colIndex = Math.floor(x/colWidth);
    var colX = (colIndex * colWidth) + 2;
    return {x:colX, y:0, col:{index:colIndex}};
}

// Generate a date (time hour/min/sec == 0) from an arbitrary index
// i.e. an index that may not have a col object
ZmCalColView.prototype._createAllDayDateFromIndex =
function(colIndex) {
    var dayIndex =  this._columns[0].dayIndex;
    var day = this._days[dayIndex];
    return new Date(day.date.getTime() + (AjxDateUtil.MSEC_PER_DAY * colIndex));
}

ZmCalColView.prototype._getDateFromXY =
function(x, y, snapMinutes, roundUp) {
	var col = this._getColFromX(x);
	if (col == null) return null;
	var minutes = Math.floor((y / ZmCalColView._HOUR_HEIGHT) * 60);
	if (snapMinutes != null && snapMinutes > 1)	{
		minutes = Math.floor(minutes/snapMinutes) * snapMinutes;
		if (roundUp) minutes += snapMinutes;
	}
	var day = this._days[col.dayIndex];
	if (day == null) return null;
	return new Date(day.date.getTime() + (minutes * 60 * 1000));
};

ZmCalColView.prototype._getAllDayDateFromXY =
function(x, y) {
	var col = this._getColFromX(x);
	if (col == null) return null;
	var day = this._days[col.dayIndex];
	if (day == null) return null;
	return new Date(day.date.getTime());
};

// helper function to minimize code and catch errors
ZmCalColView.prototype._setBounds =
function(id, x, y, w, h) {
	var el = typeof id === 'string' ? document.getElementById(id) : id;
	if (el == null) {
		DBG.println("ZmCalColView._setBounds null element for id: "+id);
	} else {
		Dwt.setBounds(el, x, y, w, h);
	}
};

ZmCalColView.prototype._calcColWidth =
function(bodyWidth, numCols, horzScroll) {
//	var sbwfudge = (AjxEnv.isIE ? 1 : 0) + (horzScroll ? 0 : Dwt.SCROLLBAR_WIDTH);
	var sbwfudge = 0;
	return dayWidth = Math.floor((bodyWidth-sbwfudge)/numCols) - (this._daySepWidth == 1 ? 0 : 1);
};

ZmCalColView.prototype._calcMinBodyWidth =
function(width, numCols) {
	//return minWidth = (ZmCalColView.MIN_COLUMN_WIDTH * numCols) + (this._daySepWidth == 1 ? 0 : 1);
	return minWidth = (ZmCalColView.MIN_COLUMN_WIDTH  + (this._daySepWidth == 1 ? 0 : 1)) * numCols;
};

ZmCalColView.prototype._layout =
function(refreshApptLayout) {
	DBG.println(AjxDebug.DBG2, "ZmCalColView in layout!");
	this._updateDays();

	var numCols = this._columns.length;

	var sz = this.getSize(true); //get the size from the style - it's more accurate as it's exactly what it was set for
    if (!sz) {
        return;
    }

	var width = sz.x + (this._isRight ? -2 : 0); // -2 is an adjustment due to some problem I can't figure out exactly. bug 75115
	var height = sz.y;

	if (width == 0 || height == 0) { return; }

	this._needFirstLayout = false;

	var hoursWidth = ZmCalColView._HOURS_DIV_WIDTH;

	var bodyX = hoursWidth + this._daySepWidth;
	var unionX = bodyX;
	if (this._scheduleMode) {
		bodyX += ZmCalColView._UNION_DIV_WIDTH + this._daySepWidth;
	}

	// compute height for hours/grid
	this._bodyDivWidth = width - bodyX;

	// size appts divs
	this._apptBodyDivHeight = ZmCalColView._DAY_HEIGHT + 1; // extra for midnight to show up
	this._apptBodyDivWidth = Math.max(this._bodyDivWidth, this._calcMinBodyWidth(this._bodyDivWidth, numCols));
	var needHorzScroll = this._apptBodyDivWidth > this._bodyDivWidth;


	this._horizontalScrollbar(needHorzScroll);
	var sbwfudge = AjxEnv.isIE ? 1 : 0;
	var dayWidth = this._calcColWidth(this._apptBodyDivWidth - Dwt.SCROLLBAR_WIDTH, numCols);

	if (needHorzScroll) this._apptBodyDivWidth -= 18;
	var scrollFudge = needHorzScroll ? 20 : 0; // need all day to be a little wider then grid

	// year heading
	this._setBounds(this._yearHeadingDivId, 0, 0, hoursWidth, Dwt.DEFAULT);

	// column headings
	var allDayHeadingDiv = document.getElementById(this._allDayHeadingDivId);
	Dwt.setBounds(allDayHeadingDiv, 0, 0, this._apptBodyDivWidth + scrollFudge, Dwt.DEFAULT);
	var allDayHeadingDivHeight = Dwt.getSize(allDayHeadingDiv).y;

	// div for all day appts
	var numRows = this._allDayApptsRowLayouts ? (this._allDayApptsRowLayouts.length) : 1;
	if (this._allDayApptsList && this._allDayApptsList.length > 0) numRows++;
	this._allDayFullDivHeight = (ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD) * numRows + ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD;

	var percentageHeight = (this._allDayFullDivHeight/height)*100;
	this._allDayDivHeight = this._allDayFullDivHeight;
	
	// if height overflows more than 50% of full height set its height
	// to nearest no of rows which occupies less than 50% of total height
	if (percentageHeight > 50) {
		var nearestNoOfRows = Math.floor((0.50*height-ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD)/(ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD));
		this._allDayDivHeight = (ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD) * nearestNoOfRows + ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD;
	}

	this._setBounds(this._allDayApptScrollDivId, bodyX, allDayHeadingDivHeight, this._bodyDivWidth, this._allDayDivHeight);
	this._setBounds(this._allDayDivId, 0, 0, this._apptBodyDivWidth + scrollFudge, this._allDayFullDivHeight);

	this._allDayVerticalScrollbar(this._allDayDivHeight != this._allDayFullDivHeight);

	// div under year
	this._setBounds(this._yearAllDayDivId, 0, allDayHeadingDivHeight, hoursWidth, this._allDayDivHeight);

	// all day scroll
	var allDayScrollHeight = allDayHeadingDivHeight + this._allDayDivHeight;
	this._setBounds(this._allDayScrollDivId, bodyX, 0, this._bodyDivWidth, allDayScrollHeight);

	// vert sep between year and all day headings
	this._setBounds(this._leftAllDaySepDivId, hoursWidth, 0, this._daySepWidth, allDayScrollHeight);

	// horiz separator between all day appts and grid
	this._setBounds(this._allDaySepDivId, 0, (this._hideAllDayAppt ? ZmCalColView._DAY_HEADING_HEIGHT : allDayScrollHeight), width, ZmCalColView._ALL_DAY_SEP_HEIGHT);

	var bodyY =  (this._hideAllDayAppt ? ZmCalColView._DAY_HEADING_HEIGHT : allDayScrollHeight) + ZmCalColView._ALL_DAY_SEP_HEIGHT +  (AjxEnv.isIE ? 0 : 2);

	this._bodyDivHeight = height - bodyY;

	// hours
	this._setBounds(this._hoursScrollDivId, 0, bodyY, hoursWidth, this._bodyDivHeight);

	// vert sep between hours and grid
	this._setBounds(this._leftApptSepDivId, hoursWidth, bodyY, this._daySepWidth, ZmCalColView._DAY_HEIGHT);

	// div for scrolling grid
	this._setBounds(this._bodyDivId, bodyX, bodyY, this._bodyDivWidth, this._bodyDivHeight);

	this._setBounds(this._apptBodyDivId, 0, -1, this._apptBodyDivWidth, this._apptBodyDivHeight);

	if (this._scheduleMode) {
		//heading
		this._setBounds(this._unionHeadingDivId, unionX, 0, ZmCalColView._UNION_DIV_WIDTH, Dwt.DEFAULT);

		//div under heading
		this._setBounds(this._unionAllDayDivId, unionX, allDayHeadingDivHeight, ZmCalColView._UNION_DIV_WIDTH, this._allDayDivHeight);

		// sep in all day area
		var unionSepX = unionX + ZmCalColView._UNION_DIV_WIDTH;
		this._setBounds(this._unionHeadingSepDivId, unionSepX, 0, this._daySepWidth, allDayScrollHeight);

		// div for scrolling union
		this._setBounds(this._unionGridScrollDivId, unionX, bodyY, ZmCalColView._UNION_DIV_WIDTH, this._bodyDivHeight);
		this._setBounds(this._unionGridDivId, 0, -1, ZmCalColView._UNION_DIV_WIDTH, this._apptBodyDivHeight+ZmCalColView._HOUR_HEIGHT);

		// sep in grid area
		this._setBounds(this._unionGridSepDivId, unionSepX, bodyY, this._daySepWidth, this._apptBodyDivHeight);
	}

    this.layoutWorkingHours(this.workingHours);
	this._layoutAllDayAppts();

    this._apptBodyDivOffset   = Dwt.toWindow(document.getElementById(this._apptBodyDivId), 0, 0, null, true);
    this._apptAllDayDivOffset = Dwt.toWindow(document.getElementById(this._allDayDivId), 0, 0, null, true);

	if (this._scheduleMode || refreshApptLayout) {
		this._layoutAppts();
		this._checkForOffscreenAppt(document.getElementById(this._bodyDivId));
		if (this._scheduleMode) {
			this._layoutUnionData();
		}
	}
};

ZmCalColView.prototype.getPostionForWorkingHourDiv =
function(dayIndex, workingHourIndex){
    dayIndex = dayIndex || 0;
    workingHourIndex = workingHourIndex || 0;
    var workingHrs = this.workingHours[dayIndex],
        startTime = workingHrs.startTime[workingHourIndex],
        endTime = workingHrs.endTime[workingHourIndex],
        startMin = (startTime%100)/15,
        endMin = (endTime%100)/15,
        startWorkingHour = 2 * Math.floor(startTime/100),
        endWorkingHour = 2 * Math.floor(endTime/100),
        fifteenMinHeight = ZmCalColView._HALF_HOUR_HEIGHT/2,
        topPosition = startWorkingHour*ZmCalColView._HALF_HOUR_HEIGHT,
        bottomPosition = endWorkingHour*ZmCalColView._HALF_HOUR_HEIGHT,
        workingDivHeight = bottomPosition - topPosition;//duration*halfHourHeight;
    return {
        topPosition : topPosition,
        workingDivHeight: workingDivHeight,
        startMinAdjust : startMin * fifteenMinHeight,
        endMinAdjust : endMin * fifteenMinHeight
    };
};

ZmCalColView.prototype.layoutWorkingHoursDiv =
function(divId, pos, currentX, dayWidth){
    this._setBounds(divId, currentX, pos.topPosition+pos.startMinAdjust, dayWidth, pos.workingDivHeight+pos.endMinAdjust-pos.startMinAdjust);
    this._setBounds(document.getElementById(divId).firstChild, 0, -pos.startMinAdjust, dayWidth, pos.workingDivHeight+pos.endMinAdjust);
};

ZmCalColView.prototype.layoutWorkingHours =
function(workingHours){
    if(!workingHours) {
        workingHours = ZmCalBaseView.parseWorkingHours(ZmCalBaseView.getWorkingHours());
        this.workingHours = workingHours;
    }
    var numCols = this._columns.length;
    var dayWidth = this._calcColWidth(this._apptBodyDivWidth - Dwt.SCROLLBAR_WIDTH, numCols);

    var allDayHeadingDiv = document.getElementById(this._allDayHeadingDivId);
	var allDayHeadingDivHeight = Dwt.getSize(allDayHeadingDiv).y;

    var currentX = 0;

	for (var i = 0; i < numCols; i++) {
		var col = this._columns[i];

		// position day heading
		var day = this._days[col.dayIndex];
		this._setBounds(col.titleId, currentX+1, Dwt.DEFAULT, dayWidth, ZmCalColView._DAY_HEADING_HEIGHT);
		col.apptX = currentX + 2 ; //ZZZ
		col.apptWidth = dayWidth - this._daySepWidth - 3;  //ZZZZ
		col.allDayX = col.apptX;
		col.allDayWidth = dayWidth; // doesn't include sep

        //split into half hrs sections
        var dayIndex = day.date.getDay(),
            workingHrs = this.workingHours[dayIndex],
            pos = this.getPostionForWorkingHourDiv(dayIndex, 0);

        if(day.isWorkingDay) {
            if(!this._scheduleMode) {
                this.layoutWorkingHoursDiv(col.workingHrsFirstDivId, pos, currentX, dayWidth);

                if( workingHrs.startTime.length >= 2 &&
                    workingHrs.endTime.length >= 2) {

                    pos = this.getPostionForWorkingHourDiv(dayIndex, 1);
                    this.layoutWorkingHoursDiv(col.workingHrsSecondDivId, pos, currentX, dayWidth);
                }
            }
            if(this._scheduleMode) {
                this.layoutWorkingHoursDiv(this._workingHrsFirstDivId, pos, 0, dayWidth);

                if( workingHrs.startTime.length >= 2 &&
                    workingHrs.endTime.length >= 2) {

                    pos = this.getPostionForWorkingHourDiv(dayIndex, 1);
                    this.layoutWorkingHoursDiv(this._workingHrsSecondDivId, pos, 0, dayWidth);

                }
            }
        }
        currentX += dayWidth;

		this._setBounds(col.headingDaySepDivId, currentX, 0, this._daySepWidth, allDayHeadingDivHeight + this._allDayDivHeight);
		this._setBounds(col.daySepDivId, currentX, 0, this._daySepWidth, this._apptBodyDivHeight);
		currentX += this._daySepWidth;
	}
};

// Must remain in sync with layoutWorkingHours
ZmCalColView.prototype._calculateColumnApptLeft =
function(index, dayWidth, numDays) {
    if (index < 0) {
        numDays = 0;
    }  else {
        numDays -= 1;
    }
    return (dayWidth * index) + (this._daySepWidth * numDays) + 2;
}


//Free Busy Bar

ZmCalColView.prototype._layoutFBBar =
function(){
    //Fetch FB Data from GetFreeBusyRequest
    var date = this._getDayForDate(this._date);
    var startDate = date ? date.date : this._date;
    var endDate = date ? date.endDate : null;
    this.getFreeBusyInfo(startDate, endDate, new AjxCallback(this, this._handleFBResponse));
};

ZmCalColView.prototype._handleFBResponse =
function(result){
    var statusSlots = result.getResponse().GetFreeBusyResponse.usr;
    statusSlots = statusSlots[0]; // 1 User for Calendar View


    //Prepare UI
    var hoursDiv = document.getElementById(this._hoursScrollDivId);
    if(!this._fbBarSlots){
        var div = document.createElement("DIV");
        //div.style.backgroundColor = "#EFE7D4";
		if (hoursDiv) {
			hoursDiv.appendChild(div);
			Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
			this._fbBarSlots = div;
			this._fbBarSlotsId = div.id = Dwt.getNextId();
		}
    }

    //Calculate X, Y
    if (hoursDiv) {
        var hourScrollDivLoc = Dwt.getLocation(hoursDiv);
        var x = hourScrollDivLoc.x;
        x = x + (ZmCalColView._HOURS_DIV_WIDTH - ZmCalColView._FBBAR_DIV_WIDTH + 1);
        Dwt.setLocation(this._fbBarSlots, x, 0);

        //Set Ht./ Width
        var calBodyHt = document.getElementById(this._bodyDivId).scrollHeight;
        Dwt.setSize(this._fbBarSlots, ZmCalColView._FBBAR_DIV_WIDTH - 2, calBodyHt);

        //Cleanup Existing Slots
        this._fbBarSlots.innerHTML = "";

        //Handle Slots
        if(statusSlots.t) this._drawSlots(ZmCalColView._STATUS_TENTATIVE, statusSlots.t);
        if(statusSlots.b) this._drawSlots(ZmCalColView._STATUS_BUSY, statusSlots.b);
        if(statusSlots.o) this._drawSlots(ZmCalColView._STATUS_OOO, statusSlots.o);
        if(statusSlots.u) this._drawSlots(ZmCalColView._STATUS_OOO, statusSlots.u);
        //non tentative/busy/ooo are all free, dont handle them
        //if(statusSlots.f) this._drawSlots(ZmCalColView._STATUS_FREE, statusSlots.f);
    }
};

ZmCalColView.prototype._drawSlots =
function(status, slots){

    //Slots
    var currDate = this._timeRangeStart;
    var calBodyHt = document.getElementById(this._bodyDivId).scrollHeight;
    
    for(var i=0; i<slots.length; i++){
        var slot = slots[i];
        var start = slot.s;
        var end = slot.e;
        if(end > currDate + AjxDateUtil.MSEC_PER_DAY){
            end = currDate + AjxDateUtil.MSEC_PER_DAY;
        }
        if(start < currDate){
            start = currDate;
        }

        start = new Date(start);
        end = new Date(end);

        start = start.getHours()*60 + start.getMinutes();
        end   = end.getHours()*60 + end.getMinutes();

        var startPx = Math.floor(start * (calBodyHt / ( 24 * 60)));
        var endPx =  Math.floor(end * ( calBodyHt / (24 * 60)));

        var div = document.createElement("DIV");
        div.className = this._getFBBarSlotColor(status);
        Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
        this._fbBarSlots.appendChild(div);
        div.style.top = ( startPx - 2 ) + "px";
        div.style.height = ( endPx - startPx) + "px";
        div.style.width = ZmCalColView._FBBAR_DIV_WIDTH - 2;
    }
    
};

ZmCalColView.prototype._getFBBarSlotColor =
function(status){
    switch(status){
        case ZmCalColView._STATUS_FREE:         return "ZmFBBar-free";
        case ZmCalColView._STATUS_TENTATIVE:    return "ZmFBBar-tentative";
        case ZmCalColView._STATUS_BUSY:         return "ZmFBBar-busy";
        case ZmCalColView._STATUS_OOO:          return "ZmFBBar-ooo";
    }
    return "ZmFBBar-busy";
};

ZmCalColView.prototype.getFreeBusyInfo =
function(startTime, endTime , callback, errorCallback) {

    if(startTime instanceof Date)
       startTime = startTime.getTime();

    if(endTime instanceof Date)
        endTime = endTime.getTime();
    
    endTime = endTime || (startTime + AjxDateUtil.MSEC_PER_DAY );
    var email = appCtxt.getActiveAccount().getEmail();
    
	var soapDoc = AjxSoapDoc.create("GetFreeBusyRequest", "urn:zimbraMail");
	soapDoc.setMethodAttribute("s", startTime);
	soapDoc.setMethodAttribute("e", endTime);
	soapDoc.setMethodAttribute("uid", email);

	return appCtxt.getAppController().sendRequest({
		soapDoc: soapDoc,
		asyncMode: true,
		callback: callback,
		errorCallback: errorCallback,
		noBusyOverlay: true
	});
};

ZmCalColView.prototype._isFBBarDiv =
function(ev){
    var target = DwtUiEvent.getTargetWithProp(ev, "id");
    if(target.id == this._fbBarSlotsId){
        return true;
    }   
    return false;
};

ZmCalColView.prototype._getFBBarToolTipContent =
function(ev){
    var target = DwtUiEvent.getTarget(ev);
    var className = target.className;    
    if(/-busy$/.test(className))
        return ZmMsg.busy;
    if(/-tentative$/.test(className))
        return ZmMsg.tentative;
    if(/-ooo$/.test(className))
        return ZmMsg.outOfOffice;
    return ZmMsg.free;
};

ZmCalColView.prototype._getUnionToolTip =
function(i) {
	// cache it...
	var tooltip = this._unionBusyDataToolTip[i];
	if (tooltip) { return tooltip; }

	var data = this._unionBusyData[i];
	if (!data instanceof Object) return null;

	var html = new AjxBuffer();
	html.append("<table role='presentation' cellpadding=2 cellspacing=0 border=0>");
	var checkedCals = this._controller.getCheckedCalendarFolderIds();
	for (var i = 0; i < checkedCals.length; i++) {
		var fid = checkedCals[i];
		if (data[fid]) {
			var cal = this._controller.getCalendar(fid);
			if (cal) {
				var color = ZmCalendarApp.COLORS[cal.color];
				html.append("<tr valign='center' class='", color, "Bg'><td>", AjxImg.getImageHtml(cal.getIcon()), "</td>");
				html.append("<td>", AjxStringUtil.htmlEncode(cal.getName()), "</td></tr>");
			}
		}
	}
	html.append("</table>");
	tooltip = this._unionBusyDataToolTip[i] = html.toString();
	return tooltip;
};

ZmCalColView.prototype._layoutUnionDataDiv =
function(gridEl, allDayEl, i, data, numCols) {
	var enable = data instanceof Object;
	var id = this._unionBusyDivIds[i];
	var divEl = null;

	if (id == null) {
		if (!enable) { return; }
		id = this._unionBusyDivIds[i] = Dwt.getNextId();
		var divEl = document.createElement("div");
		divEl.style.position = 'absolute';
		divEl.className = "calendar_sched_union_div";
		this.associateItemWithElement(null, divEl, ZmCalBaseView.TYPE_SCHED_FREEBUSY, id, {index:i});

		Dwt.setOpacity(divEl, 40);

		if (i == 48) {
			//have to resize every layout, since all day div height might change
			allDayEl.appendChild(divEl);
		} else {
			// position/size once right here!
			gridEl.appendChild(divEl);
			Dwt.setBounds(divEl, 2, ZmCalColView._HALF_HOUR_HEIGHT*i+1, ZmCalColView._UNION_DIV_WIDTH-4 , ZmCalColView._HALF_HOUR_HEIGHT-2);
		}

	} else {
		divEl =  document.getElementById(id);
	}
	// have to relayout each time
	if (i == 48)	Dwt.setBounds(divEl, 1, 1, ZmCalColView._UNION_DIV_WIDTH-2, this._allDayDivHeight-2);

	var num = 0;
	for (var key in data) num++;

	Dwt.setOpacity(divEl, 20 + (60 * (num/numCols)));
	Dwt.setVisibility(divEl, enable);
};

ZmCalColView.prototype._layoutUnionData =
function() {
	if (!this._unionBusyData) { return; }

	var gridEl = document.getElementById(this._unionGridDivId);
	var allDayEl = document.getElementById(this._unionAllDayDivId);
	var numCols = this._columns.length;
	for (var i=0; i < 49; i++) {
		this._layoutUnionDataDiv(gridEl, allDayEl, i, this._unionBusyData[i], numCols);
	}
};

ZmCalColView.prototype._handleApptScrollRegion =
function(docX, docY, incr, data) {
	var offset = 0;
	var upper = docY < this._apptBodyDivOffset.y;
    // Trigger scroll when scroll is within 8 px of the bottom
	var lower = docY > this._apptBodyDivOffset.y+this._bodyDivHeight - 8;
	if (upper || lower) {
		var div = document.getElementById(this._bodyDivId);
		var sTop = div.scrollTop;
		if (upper && sTop > 0) {
			offset = -(sTop > incr ? incr : sTop);
		} else if (lower) {
			var sVisibleTop = this._apptBodyDivHeight - this._bodyDivHeight;
			if (sTop < sVisibleTop) {
				var spaceLeft = sVisibleTop - sTop;
				offset = spaceLeft  > incr ?incr : spaceLeft;
			}
		}
		if (offset != 0) {
			div.scrollTop += offset;
			this._syncScroll();
		}
        if (data) {
            data.docY -= offset;
        }
	}
	return offset;
};

ZmCalColView.prototype._controlListener =
function(ev) {
	if (ev.newWidth == Dwt.DEFAULT && ev.newHeight == Dwt.DEFAULT) return;
	try {
		if ((ev.oldWidth != ev.newWidth) || (ev.oldHeight != ev.newHeight)) {
			this._layout(true);
			this._updateTimeIndicator();
	 	}
	} catch(ex) {
		DBG.dumpObj(ex);
	}
};

ZmCalColView.prototype._apptSelected =
function() {
	//
};

ZmCalColView._ondblclickHandler =
function (ev){
	ev = DwtUiEvent.getEvent(ev);
	ev._isDblClick = true;
	ZmCalColView._onclickHandler(ev);
};

ZmCalColView.prototype._mouseOverAction =
function(ev, div) {
	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_DAY_HEADER) {
		div.style.textDecoration = "underline";
	}
};

ZmCalColView.prototype.getToolTipContent =
function(ev) {
    if(this._fbBarEnabled && this._isFBBarDiv(ev)){
        return this._getFBBarToolTipContent(ev);        
    }
	var div = this.getTargetItemDiv(ev);
	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_SCHED_FREEBUSY) {
		var index = this._getItemData(div, "index");
		return this._getUnionToolTip(index);
	}
	return ZmCalBaseView.prototype.getToolTipContent.apply(this, arguments);
};

ZmCalColView.prototype._mouseOutAction =
function(ev, div) {
	ZmCalBaseView.prototype._mouseOutAction.call(this, ev, div);
	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_DAY_HEADER) {
		div.style.textDecoration = "none";
	} else if (type == ZmCalBaseView.TYPE_SCHED_FREEBUSY) {
		this.setToolTipContent(null);
	}
};

ZmCalColView.prototype._mouseUpAction =
function(ev, div) {

	if (Dwt.ffScrollbarCheck(ev)) { return false; }

	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_DAY_HEADER && !this._scheduleMode && ! this._isInviteMessage) {
		var dayIndex = this._getItemData(div, "dayIndex");
		var date = this._days[dayIndex].date;
		var cc = appCtxt.getCurrentController();

		if (this.numDays > 1) {
			cc.setDate(date);
			cc.show(ZmId.VIEW_CAL_DAY);
		} else {
			// TODO: use pref for work week
			if (date.getDay() > 0 && date.getDay() < 6)
				cc.show(ZmId.VIEW_CAL_WORK_WEEK);
			else
				cc.show(ZmId.VIEW_CAL_WEEK);
		}
	} else if (type == ZmCalBaseView.TYPE_DAY_SEP) {
		this.toggleAllDayAppt(!this._hideAllDayAppt);
	}
};

ZmCalColView.prototype._doubleClickAction =
function(ev, div) {
	ZmCalBaseView.prototype._doubleClickAction.call(this, ev, div);
	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_APPTS_DAYGRID ||
		type == ZmCalBaseView.TYPE_ALL_DAY)
	{
		this._timeSelectionAction(ev, div, true);
	}
};

ZmCalColView.prototype._timeSelectionAction =
function(ev, div, dblclick) {
	var date;
	var duration = ZmCalColView._MSEC_DURATION;
	var isAllDay = false;
	var gridLoc;
	var type = this._getItemData(div, "type");
	switch (type) {
		case ZmCalBaseView.TYPE_APPTS_DAYGRID:
			gridLoc = Dwt.toWindow(ev.target, ev.elementX, ev.elementY, div, true);
			date = this._getDateFromXY(gridLoc.x, gridLoc.y, ZmCalColView._SNAP_MINUTES);
			break;
		case ZmCalBaseView.TYPE_ALL_DAY:
			gridLoc = Dwt.toWindow(ev.target, ev.elementX, ev.elementY, div, true);
			date = this._getAllDayDateFromXY(gridLoc.x, gridLoc.y);
			isAllDay = true;
			break;
		default:
			return;
	}

	if (date == null) { return false; }
	var col = this._getColFromX(gridLoc.x);

	this._timeSelectionEvent(date, duration, dblclick, isAllDay, null, ev.shiftKey);
};

ZmCalColView.prototype._mouseDownAction =
function(ev, div) {

	//ZmCalBaseView.prototype._mouseDownAction.call(this, ev, div);
    //bug: 57755 - avoid scroll check hack for appt related mouse events
    //todo: disable ffScrollbarCheck for 3.6.4+ versions of firefox ( bug 55342 )
    var type = this._getItemData(div, "type");
	if (type != ZmCalBaseView.TYPE_APPT && Dwt.ffScrollbarCheck(ev)) { return false; }

	switch (type) {
		case ZmCalBaseView.TYPE_APPT_BOTTOM_SASH:
		case ZmCalBaseView.TYPE_APPT_TOP_SASH:
			this.setToolTipContent(null);
			return this._sashMouseDownAction(ev, div);
			break;
		case ZmCalBaseView.TYPE_APPT:
			this.setToolTipContent(null);
			return this._apptMouseDownAction(ev, div);
			break;
		case ZmCalBaseView.TYPE_HOURS_COL:
			if (ev.button == DwtMouseEvent.LEFT) {
				var gridLoc = AjxEnv.isIE ? Dwt.toWindow(ev.target, ev.elementX, ev.elementY, div, true) : {x: ev.elementX, y: ev.elementY};
				var fakeLoc = this._getLocationForDate(this.getDate());
				if (fakeLoc) {
					gridLoc.x = fakeLoc.x;
					var gridDiv = document.getElementById(this._apptBodyDivId);
					return this._gridMouseDownAction(ev, gridDiv, gridLoc);
				}
			} else if (ev.button == DwtMouseEvent.RIGHT) {
				DwtUiEvent.copy(this._actionEv, ev);
				this._actionEv.item = this;
				this._evtMgr.notifyListeners(ZmCalBaseView.VIEW_ACTION, this._actionEv);
			}
			break;
		case ZmCalBaseView.TYPE_APPTS_DAYGRID:
            if (!appCtxt.isWebClientOffline()) {
                this._timeSelectionAction(ev, div, false);
                if (ev.button == DwtMouseEvent.LEFT) {
                    // save grid location here, since timeSelection might move the time selection div
                    var gridLoc = Dwt.toWindow(ev.target, ev.elementX, ev.elementY, div, true);
                    return this._gridMouseDownAction(ev, div, gridLoc);
                } else if (ev.button == DwtMouseEvent.RIGHT) {
                    DwtUiEvent.copy(this._actionEv, ev);
                    this._actionEv.item = this;
                    this._evtMgr.notifyListeners(ZmCalBaseView.VIEW_ACTION, this._actionEv);
                }
            }
			break;
		case ZmCalBaseView.TYPE_ALL_DAY:
			this._timeSelectionAction(ev, div, false);
			if (ev.button == DwtMouseEvent.LEFT) {
				var gridLoc = Dwt.toWindow(ev.target, ev.elementX, ev.elementY, div, true);
				return this._gridMouseDownAction(ev, div, gridLoc, true);
			} else if (ev.button == DwtMouseEvent.RIGHT) {
				DwtUiEvent.copy(this._actionEv, ev);
				this._actionEv.item = this;
				this._evtMgr.notifyListeners(ZmCalBaseView.VIEW_ACTION, this._actionEv);
			}
			break;
	}
	return false;
};

// BEGIN APPT ACTION HANDLERS


// called when DND is confirmed after threshold
ZmCalColView.prototype._apptDndBegin =
function(data) {
	var loc = Dwt.getLocation(data.apptEl);
	data.dndObj = {};
	data.apptX = loc.x;
	data.apptY = loc.y;

	data.apptsDiv    = document.getElementById(this._apptBodyDivId);
	data.bodyDivEl   = document.getElementById(this._bodyDivId);
	data.apptBodyEl  = document.getElementById(data.apptEl.id + "_body");

	data.startDate   = new Date(data.appt.getStartTime());
	data.startTimeEl = document.getElementById(data.apptEl.id +"_st");
	data.endTimeEl   = document.getElementById(data.apptEl.id +"_et");

    if (data.appt.isAllDayEvent()) {
        data.saveHTML  = data.apptEl.innerHTML;
        data.saveLoc  = loc;

        // Adjust apptOffset.x to be the offset from the clicked on column.  Then create the
        // start snap using this offset (so that start column of a multi-day is tracked).
        var leftSnap = this._snapXY(data.apptX, data.apptY, 15);
        var colSnap  = this._snapXY(data.apptX + data.apptOffset.x, data.apptY, 15);
        data.apptOffset.x = data.apptOffset.x - colSnap.x + leftSnap.x;

        // Multi day appt may have its start off the grid.  It's will be truncated
        // by the layout code, so calculate the true start
        var dayOffset = this._calcOffsetFromZeroColumn(data.appt.getStartTime());
        // All columns should be the same width. Choose the 0th
        var colWidth = this._columns[0].allDayWidth + this._daySepWidth;

        var endTime = data.appt.getEndTime();
        var numDays = this._calcNumDays(data.startDate, endTime);
        data.apptX = this._calculateColumnApptLeft(dayOffset, colWidth, numDays);
        data.snap = this._snapAllDayOutsideGrid(data.apptX + data.apptOffset.x);
        data.apptWidth = (colWidth * numDays) - this._daySepWidth - 1;

        // Offset the y fudge that is applied in _layout, _positionAppt
        data.apptY -= ZmCalColView._APPT_Y_FUDGE;
        var bounds = new DwtRectangle(data.apptX, data.apptY,
            data.apptWidth, ZmCalColView._ALL_DAY_APPT_HEIGHT);

        this._layoutAppt(data.appt, data.apptEl, bounds.x, bounds.y, bounds.width, bounds.height);

        data.disableScroll = true;
     } else {
        data.snap = this._snapXY(data.apptX + data.apptOffset.x, data.apptY, 15); 	// get orig grid snap
    }

    if (data.snap == null) return false;

	this.deselectAll();
	this.setSelection(data.appt);
    Dwt.addClass(data.apptBodyEl, DwtCssStyle.DROPPABLE);
	Dwt.setOpacity(data.apptEl, ZmCalColView._OPACITY_APPT_DND);
	data.dndStarted = true;
	return true;
};


ZmCalColView.prototype._restoreApptLoc =
function(data) {
    if (data && data.appt) {
        //Appt move by drag cancelled
        var lo = data.appt._layout;
        data.view._layoutAppt(null, data.apptEl, lo.x, lo.y, lo.w, lo.h);
        if (data.startTimeEl) {
            data.startTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.appt.startDate);
        }
        if (data.endTimeEl) {
            data.endTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.appt.endDate);
        }
        ZmCalBaseView._setApptOpacity(data.appt, data.apptEl);
    }
    else if (data.newApptDivEl) {
        // ESC key is pressed while dragging the mouse
        // Undo the drag event and hide the new appt div
        data.gridEl.style.cursor = 'auto';
        var col = data.view._getColFromX(data.gridX);
		Dwt.setVisible(data.newApptDivEl, false);
    }
};


ZmCalColView.prototype._restoreAppt =
function(data) {
   if (data.appt.isAllDayEvent()) {
       Dwt.setLocation(data.apptEl, data.saveLoc.x, data.saveLoc.y);
       data.apptEl.innerHTML = data.saveHTML;
    }
};


ZmCalColView.prototype._createContainerRect =
function(data) {
     this._containerRect = null;
    if (data.appt.isAllDayEvent()) {
        this._containerRect = new DwtRectangle(this._apptAllDayDivOffset.x,
                this._apptAllDayDivOffset.y,
                this._bodyDivWidth,
                this._allDayDivHeight + this._bodyDivHeight + ZmCalColView._SCROLL_PRESSURE_FUDGE);
    } else {
        this._containerRect = new DwtRectangle(this._apptAllDayDivOffset.x,
                this._apptBodyDivOffset.y - ZmCalColView._SCROLL_PRESSURE_FUDGE,
                this._bodyDivWidth,
                this._bodyDivHeight + ZmCalColView._SCROLL_PRESSURE_FUDGE);
    }
}

ZmCalColView.prototype._clearSnap =
function(snap) {
    snap.x = null;
    snap.y = null;
}


ZmCalColView.prototype._restoreHighlight =
function(data) {
    Dwt.setOpacity(data.apptEl, ZmCalColView._OPACITY_APPT_DND);
    Dwt.addClass(data.apptBodyEl, DwtCssStyle.DROPPABLE);
}

ZmCalColView.prototype._doApptMove =
function(data, deltaX, deltaY) {
    // snap new location to grid
    var newDate = null;
    var snap = data.view._snapXY(data.apptX + data.apptOffset.x + deltaX, data.apptY + deltaY, 15);
    if (snap == null) {
        if (data.appt.isAllDayEvent()) {
            // For a multi day appt , the start snap may have started or be pushed off the grid.
            // Create a snap with a pseudo column.
            snap = data.view._snapAllDayOutsideGrid(data.apptX + data.apptOffset.x + deltaX);
            newDate = data.view._createAllDayDateFromIndex(snap.col.index);
        }
    } else {
        newDate = data.view._getDateFromXY(snap.x, snap.y, 15);
    }

    //DBG.println("mouseMove new snap: "+snap.x+","+snap.y+ " data snap: "+data.snap.x+","+data.snap.y);
    if (snap != null && ((snap.x != data.snap.x || snap.y != data.snap.y))) {
        if (newDate != null &&
            (!(data.view._scheduleMode && snap.col != data.snap.col)) && // don't allow col moves in sched view
            (newDate.getTime() != data.startDate.getTime()))
        {
            var bounds = null;
            if (data.appt.isAllDayEvent()) {
                // Not using snapXY and GeBoundsForAllDayDate - snap requires that a date
                // fall within one of its columns, which may not be so for a multi day appt.
                var bounds = new DwtRectangle(snap.x, data.apptY,
                    data.apptWidth, ZmCalColView._ALL_DAY_APPT_HEIGHT);
            } else {
                bounds = data.view._getBoundsForDate(newDate, data.appt._orig.getDuration(), snap.col);
            }
            data.view._layoutAppt(null, data.apptEl, bounds.x, bounds.y, bounds.width, bounds.height);
            data.startDate = newDate;
            data.snap = snap;
            if (data.startTimeEl) data.startTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.startDate);
            if (data.endTimeEl) data.endTimeEl.innerHTML = ZmCalBaseItem._getTTHour(new Date(data.startDate.getTime()+data.appt.getDuration()));
        }
    }
}



ZmCalColView.prototype._deselectDnDHighlight =
function(data) {
    Dwt.delClass(data.apptBodyEl, DwtCssStyle.DROPPABLE);
    ZmCalBaseView._setApptOpacity(data.appt, data.apptEl);
}

// END APPT ACTION HANDLERS

// BEGIN SASH ACTION HANDLERS

ZmCalColView.prototype._sashMouseDownAction =
function(ev, sash) {
//	DBG.println("ZmCalColView._sashMouseDownHdlr");
	if (ev.button != DwtMouseEvent.LEFT) {
		return false;
	}

	var apptEl = sash.parentNode;
	var apptBodyEl = document.getElementById(apptEl.id + "_body");

	var appt = this.getItemFromElement(apptEl);
	var origHeight = Dwt.getSize(apptBodyEl).y;
	var origLoc = Dwt.getLocation(apptEl);
	var parentOrigHeight = Dwt.getSize(apptEl).y;
	var type = this._getItemData(sash, "type");
	var isTop = (type == ZmCalBaseView.TYPE_APPT_TOP_SASH);
	var data = {
		sash: sash,
		isTop: isTop,
		appt:appt,
		view:this,
		apptEl: apptEl,
		endTimeEl: document.getElementById(apptEl.id +"_et"),
		startTimeEl: document.getElementById(apptEl.id +"_st"),
		apptBodyEl: apptBodyEl,
		origHeight: origHeight,
		apptX: origLoc.x,
		apptY: origLoc.y,
		parentOrigHeight: parentOrigHeight,
		startY: ev.docY
	};

	if (isTop) {
		data.startDate = new Date(appt.getStartTime());
	} else {
		data.endDate = new Date(appt.getEndTime());
	}

	//TODO: only create one of these and change data each time...
	var capture = new DwtMouseEventCapture({
		targetObj:data,
		mouseOverHdlr:ZmCalColView._emptyHdlr,
		mouseDownHdlr:ZmCalColView._emptyHdlr, // mouse down (already handled by action)
		mouseMoveHdlr:ZmCalColView._sashMouseMoveHdlr,
		mouseUpHdlr:ZmCalColView._sashMouseUpHdlr,
		mouseOutHdlr:ZmCalColView._emptyHdlr
	});
	capture.capture();
	this.deselectAll();
	this.setSelection(data.appt);
	Dwt.setOpacity(apptEl, ZmCalColView._OPACITY_APPT_DND);
	return false;
};

ZmCalColView._sashMouseMoveHdlr =
function(ev) {
//	DBG.println("ZmCalColView._sashMouseMoveHdlr");
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	var delta = 0;
	var data = DwtMouseEventCapture.getTargetObj();

	if (mouseEv.docY > 0 && mouseEv.docY != data.startY) {
		delta = mouseEv.docY - data.startY;
	}

	var draggedOut = data.view._apptDraggedOut(mouseEv.docX, mouseEv.docY);

	if (draggedOut) {
		if (!data._lastDraggedOut) {
			data._lastDraggedOut = true;
			data.view._restoreApptLoc(data);
		}
	} else {
		if (data._lastDraggedOut) {
			data._lastDraggedOut = false;
			data.lastDelta = 0;
			Dwt.setOpacity(data.apptEl, ZmCalColView._OPACITY_APPT_DND);
		}
		var scrollOffset = data.view._handleApptScrollRegion(mouseEv.docX, mouseEv.docY, ZmCalColView._HOUR_HEIGHT, null);
		if (scrollOffset != 0) {
			data.startY -= scrollOffset;
		}

		var delta15 = Math.floor(delta/ZmCalColView._15_MINUTE_HEIGHT);
		delta = delta15 * ZmCalColView._15_MINUTE_HEIGHT;

		if (delta != data.lastDelta) {
			if (data.isTop) {
				var newY = data.apptY + delta;
				var newHeight = data.origHeight - delta;
				if (newHeight >= ZmCalColView._15_MINUTE_HEIGHT) {
					Dwt.setLocation(data.apptEl, Dwt.DEFAULT, newY);
					Dwt.setSize(data.apptEl, Dwt.DEFAULT, data.parentOrigHeight - delta);
					Dwt.setSize(data.apptBodyEl, Dwt.DEFAULT, Math.floor(newHeight));
					data.lastDelta = delta;
					data.startDate.setTime(data.appt.getStartTime() + (delta15 * AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES)); // num msecs in 15 minutes
					if (data.startTimeEl) data.startTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.startDate);
				}
			} else {
				var newHeight = data.origHeight + delta;
				if (newHeight >= ZmCalColView._15_MINUTE_HEIGHT) {
					var parentNewHeight = data.parentOrigHeight + delta;
					//DBG.println("delta = " + delta);
					Dwt.setSize(data.apptEl, Dwt.DEFAULT, parentNewHeight);
					Dwt.setSize(data.apptBodyEl, Dwt.DEFAULT, newHeight + ZmCalColView._APPT_HEIGHT_FUDGE);

					data.lastDelta = delta;
					data.endDate.setTime(data.appt.getEndTime() + (delta15 * AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES)); // num msecs in 15 minutes
					if (data.endTimeEl) data.endTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.endDate);
				}
			}
		}
	}

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

ZmCalColView._sashMouseUpHdlr =
function(ev) {
//	DBG.println("ZmCalColView._sashMouseUpHdlr");
	var data = DwtMouseEventCapture.getTargetObj();
	ZmCalBaseView._setApptOpacity(data.appt, data.apptEl);
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	if (mouseEv.button != DwtMouseEvent.LEFT) {
		DwtUiEvent.setBehaviour(ev, true, false);
		return false;
	}

	DwtMouseEventCapture.getCaptureObj().release();

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);

	var draggedOut = data.view._apptDraggedOut(mouseEv.docX, mouseEv.docY);
	if (draggedOut) {
		data.view._restoreApptLoc(data);
		return false;
	}

	var needUpdate = false;
	var startDate = null, endDate = null;
	if (data.isTop && data.startDate.getTime() != data.appt.getStartTime()) {
		needUpdate = true;
		startDate = data.startDate;
	} else if (!data.isTop && data.endDate.getTime() != data.appt.getEndTime()) {
		needUpdate = true;
		endDate = data.endDate;
	}
	if (needUpdate) {
		data.view._autoScrollDisabled = true;
		var cc = data.view.getController();
		var errorCallback = new AjxCallback(null, ZmCalColView._handleDnDError, data);
		var sdOffset = startDate ? (startDate.getTime() - data.appt.getStartTime()) : null;
		var edOffset = endDate ? (endDate.getTime() - data.appt.getEndTime()) : null;
		cc.dndUpdateApptDate(data.appt._orig, sdOffset, edOffset, null, errorCallback, mouseEv);
	}

	return false;
};

// END SASH ACTION HANDLERS


// BEGIN GRID ACTION HANDLERS

ZmCalColView.prototype._gridMouseDownAction =
function(ev, gridEl, gridLoc, isAllDay) {
	if (ev.button != DwtMouseEvent.LEFT) { return false; }

    if(ZmCalViewController._contextMenuOpened){
        ZmCalViewController._contextMenuOpened = false;
        return false;
    }

	var data = {
		dndStarted: false,
		view: this,
		gridEl: gridEl,
		gridX: gridLoc.x, // ev.elementX,
		gridY: gridLoc.y,  //ev.elementY,
		docX: ev.docX,
		docY: ev.docY,
		isAllDay: isAllDay
	};

	var capture = new DwtMouseEventCapture({
		targetObj:data,
		mouseOverHdlr:ZmCalColView._emptyHdlr,
		mouseDownHdlr:ZmCalColView._emptyHdlr, // mouse down (already handled by action)
		mouseMoveHdlr: isAllDay ? ZmCalColView._gridAllDayMouseMoveHdlr : ZmCalColView._gridMouseMoveHdlr,
		mouseUpHdlr:ZmCalColView._gridMouseUpHdlr,
		mouseOutHdlr:ZmCalColView._emptyHdlr
	});
	capture.capture();
	return false;
};

// called when DND is confirmed after threshold
ZmCalColView.prototype._gridDndBegin =
function(data) {
    if(appCtxt.isExternalAccount()) { return false; }
	var col = data.view._getColFromX(data.gridX);
	if (data.isAllDay) {
		data.gridEl.style.cursor = 'e-resize';
		data.newApptDivEl = document.getElementById(data.view._newAllDayApptDivId);
		data.view._populateNewApptHtml(data.newApptDivEl, true, null);
		data.apptBodyEl = document.getElementById(data.newApptDivEl.id + "_body");
		data.view._allDayScrollToBottom();
		//zzzzz
	} else {
		data.gridEl.style.cursor = 's-resize';
		data.newApptDivEl = document.getElementById(data.view._newApptDivId);
		data.view._populateNewApptHtml(data.newApptDivEl, false, null);
		data.apptBodyEl = document.getElementById(data.newApptDivEl.id + "_body");
		data.endTimeEl = document.getElementById(data.newApptDivEl.id +"_et");
		data.startTimeEl = document.getElementById(data.newApptDivEl.id +"_st");
	}
	this.deselectAll();
	return true;
};

/*
*   Initializes the vertical scrollbar of the body element to 8AM.
 */
ZmCalColView.prototype.initializeTimeScroll = function(){
    this._scrollToTime(8);
}

ZmCalColView._gridMouseMoveHdlr =
function(ev) {

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	var data = DwtMouseEventCapture.getTargetObj();

	var deltaX = mouseEv.docX - data.docX;
	var deltaY = mouseEv.docY - data.docY;

	if (!data.dndStarted) {
		var withinThreshold =  (Math.abs(deltaX) < ZmCalColView.DRAG_THRESHOLD && Math.abs(deltaY) < ZmCalColView.DRAG_THRESHOLD);
		if (withinThreshold || !data.view._gridDndBegin(data)) {
			mouseEv._stopPropagation = true;
			mouseEv._returnValue = false;
			mouseEv.setToDhtmlEvent(ev);
			return false;
		}
	}

	var scrollOffset = data.view._handleApptScrollRegion(mouseEv.docX, mouseEv.docY, ZmCalColView._HOUR_HEIGHT, null);
	if (scrollOffset != 0) {
		data.docY -= scrollOffset;
		deltaY += scrollOffset;
	}

	// snap new location to grid
	var snap = data.view._snapXY(data.gridX + deltaX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES);
	if (snap == null) return false;

	var newStart, newEnd;

	if (deltaY >= 0) { // dragging down
		newStart = data.view._snapXY(data.gridX, data.gridY, ZmCalColView._SNAP_MINUTES);
		newEnd = data.view._snapXY(data.gridX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES, true);
	} else { // dragging up
		newEnd = data.view._snapXY(data.gridX, data.gridY, ZmCalColView._SNAP_MINUTES);
		newStart = data.view._snapXY(data.gridX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES);
	}

	if (newStart == null || newEnd == null) return false;

	if ((data.start == null) || (data.start.y != newStart.y) || (data.end.y != newEnd.y)) {

		if (!data.dndStarted) data.dndStarted = true;

		data.start = newStart;
		data.end = newEnd;

		data.startDate = data.view._getDateFromXY(data.start.x, data.start.y, ZmCalColView._SNAP_MINUTES, false);
		data.endDate = data.view._getDateFromXY(data.end.x, data.end.y, ZmCalColView._SNAP_MINUTES, false);

		var e = data.newApptDivEl;
		if (!e) return;
		var duration = (data.endDate.getTime() - data.startDate.getTime());
		if (duration < ZmCalColView._MSEC_DURATION) duration = ZmCalColView._MSEC_DURATION;

		var bounds = data.view._getBoundsForDate(data.startDate, duration, newStart.col);
		if (bounds == null) return false;
		data.view._layoutAppt(null, e, newStart.x, newStart.y, bounds.width, bounds.height);
		Dwt.setVisible(e, true);
		if (data.startTimeEl) data.startTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.startDate);
		if (data.endTimeEl) data.endTimeEl.innerHTML = ZmCalBaseItem._getTTHour(data.endDate);
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

ZmCalColView._gridMouseUpHdlr =
function(ev) {
	var data = DwtMouseEventCapture.getTargetObj();
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);

	DwtMouseEventCapture.getCaptureObj().release();

    if (!data.dndStarted && appCtxt.get(ZmSetting.CAL_USE_QUICK_ADD)) {
        var newStart, newEnd;
        var deltaY = mouseEv.docY - data.docY;

        if (deltaY >= 0) { // dragging down
            newStart = data.view._snapXY(data.gridX, data.gridY, ZmCalColView._SNAP_MINUTES);
            newEnd = data.view._snapXY(data.gridX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES, true);
        } else { // dragging up
            newEnd = data.view._snapXY(data.gridX, data.gridY, ZmCalColView._SNAP_MINUTES);
            newStart = data.view._snapXY(data.gridX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES);
        }

        if (newStart == null || newEnd == null) return false;

        if ((data.start == null) || (data.start.y != newStart.y) || (data.end.y != newEnd.y)) {

            if (!data.dndStarted){
                data.dndStarted = true;
            }

            data.start = newStart;
            data.end = newEnd;

            data.startDate = data.view._getDateFromXY(data.start.x, data.start.y, ZmCalColView._SNAP_MINUTES, false);
            data.endDate = data.view._getDateFromXY(data.end.x, data.end.y, ZmCalColView._SNAP_MINUTES, false);
        }

        if (data.isAllDay) {
		    data.newApptDivEl = document.getElementById(data.view._newAllDayApptDivId);
        } else {
            data.newApptDivEl = document.getElementById(data.view._newApptDivId);
        }
    }

	if (data.dndStarted) {
		data.gridEl.style.cursor = 'auto';
        var col = data.view._getColFromX(data.gridX);
		var folderId = col && col.cal && col.cal.id;
		Dwt.setVisible(data.newApptDivEl, false);
		if (data.isAllDay) {
			appCtxt.getCurrentController().newAllDayAppointmentHelper(data.startDate, data.endDate, folderId, mouseEv.shiftKey);
		} else {
			var duration = (data.endDate.getTime() - data.startDate.getTime());
			if (duration < ZmCalColView._MSEC_DURATION) duration = ZmCalColView._MSEC_DURATION;
			appCtxt.getCurrentController().newAppointmentHelper(data.startDate, duration, folderId, mouseEv.shiftKey);
		}
	}

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);

	return false;
};

// END GRID ACTION HANDLERS

// BEGIN ALLDAY GRID ACTION HANDLERS

ZmCalColView._gridAllDayMouseMoveHdlr =
function(ev) {

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	var data = DwtMouseEventCapture.getTargetObj();

	var deltaX = mouseEv.docX - data.docX;
	var deltaY = mouseEv.docY - data.docY;

	if (!data.dndStarted) {
		var withinThreshold =  (Math.abs(deltaX) < ZmCalColView.DRAG_THRESHOLD && Math.abs(deltaY) < ZmCalColView.DRAG_THRESHOLD);
		if (withinThreshold || !data.view._gridDndBegin(data)) {
			mouseEv._stopPropagation = true;
			mouseEv._returnValue = false;
			mouseEv.setToDhtmlEvent(ev);
			return false;
		}
	}

	// snap new location to grid
	var snap = data.view._snapXY(data.gridX + deltaX, data.gridY + deltaY, ZmCalColView._SNAP_MINUTES);
	if (snap == null) return false;

	var newStart, newEnd;

	if (deltaX >= 0) { // dragging right
		newStart = data.view._snapAllDayXY(data.gridX, data.gridY);
		newEnd = data.view._snapAllDayXY(data.gridX + deltaX, data.gridY);
	} else { // dragging left
		newEnd = data.view._snapAllDayXY(data.gridX, data.gridY);
		newStart = data.view._snapAllDayXY(data.gridX + deltaX, data.gridY);
	}

	if (newStart == null || newEnd == null) return false;

	if ((data.start == null) || (!data.view._scheduleMode && ((data.start.x != newStart.x) || (data.end.x != newEnd.x)))) {

		if (!data.dndStarted) data.dndStarted = true;

		data.start = newStart;
		data.end = newEnd;

		data.startDate = data.view._getAllDayDateFromXY(data.start.x, data.start.y);
		data.endDate = data.view._getAllDayDateFromXY(data.end.x, data.end.y);

		var e = data.newApptDivEl;
		if (!e) return;

		var bounds = data.view._getBoundsForAllDayDate(data.start, data.end);
		if (bounds == null) return false;
		// blank row at the bottom
		var y = data.view._allDayFullDivHeight - (ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD);
		Dwt.setLocation(e, newStart.x, y);
		Dwt.setSize(e, bounds.width, bounds.height);
		Dwt.setSize(data.apptBodyEl, bounds.width, bounds.height);
		Dwt.setVisible(e, true);
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

// END ALLDAY GRID ACTION HANDLERS

ZmCalColView._emptyHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

ZmCalColView._handleError =
function(data) {
	data.view.getController()._refreshAction(true);
	return false;
};

ZmCalColView._handleDnDError =
function(data) {
	// Redraw the grid to reposition whatever DnD failed
	data.view._layout(true);
	return false;
};


ZmCalColView.prototype.toggleAllDayAppt =
function(hide) {
	var apptScroll = document.getElementById(this._allDayApptScrollDivId);
	Dwt.setVisible(apptScroll, !hide);
    var sash = document.getElementById(this._allDaySepSashDivId);
    if(hide) {
        Dwt.addClass(sash, 'closed');
    }
    else {
        Dwt.delClass(sash, 'closed');
    }
	if (this._scheduleMode) {
		var unionAllDayDiv = document.getElementById(this._unionAllDayDivId);
		Dwt.setVisible(unionAllDayDiv, !hide);
	}

	this._hideAllDayAppt = ! this._hideAllDayAppt;
	this._layout();
};

ZmCalColView.prototype._postApptCreate =
function(appt,div) {
	var layout = this._layoutMap[this._getItemId(appt)];
	if (layout){
		layout.bounds = this._getBoundsForAppt(layout.appt);
		if (!layout.bounds) { return; }

		apptWidthPercent = ZmCalColView._getApptWidthPercent(layout.maxcol+1);
		var w = Math.floor(layout.bounds.width*apptWidthPercent);
		var xinc = layout.maxcol ? ((layout.bounds.width - w) / layout.maxcol) : 0; // n-1
		var x = xinc * layout.col + (layout.bounds.x);
		if (appt) appt._layout = {x: x, y: layout.bounds.y, w: w, h: layout.bounds.height};
		var apptHeight = layout.bounds.height;
		var apptY = layout.bounds.y;
		var apptDiv = document.getElementById(this._getItemId(layout.appt));
		this._layoutAppt(layout.appt, apptDiv, x, apptY, w, apptHeight);
	}
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalDayView")) {
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

ZmCalDayView = function(parent, posStyle, controller, dropTgt, view, numDays, readonly, isInviteMessage, isRight) {
	// Usage in ZmInviteMsgView requires a unique id - used in the conversation view,
	// so multiple simultaneous instances
    var id = isInviteMessage ? ZmId.getViewId(ZmId.VIEW_CAL_DAY, null, view) : ZmId.VIEW_CAL_DAY;
	ZmCalColView.call(this, parent, posStyle, controller, dropTgt, id, 1, false, readonly, isInviteMessage, isRight);
	this._compactMode = false;
};

ZmCalDayView.prototype = new ZmCalColView;
ZmCalDayView.prototype.constructor = ZmCalDayView;

ZmCalDayView.prototype.toString =
function() {
	return "ZmCalDayView";
};

ZmCalDayView.prototype.setCompactMode =
function(compactMode) {
	this._compactMode = compactMode;
};

ZmCalDayView.prototype.isCompactMode =
function() {
	return this._compactMode;
};

ZmCalDayView.prototype.fbStatusBarEnabled =
function(){
    return true;
};

ZmCalDayView.prototype._layout =
function(refreshApptLayout) {
	ZmCalColView.prototype._layout.call(this, refreshApptLayout);

	if (this._compactMode && !this._closeButton) {
		var btn = this._closeButton = new DwtButton({
			parent:this,
			style: DwtLabel.ALIGN_RIGHT | DwtButton.ALWAYS_FLAT,
			posStyle: DwtControl.ABSOLUTE_STYLE,
			className:"DwtToolbarButton cal_day_expand"
		});
		this._closeButton.setImage("Close");
		this._closeButton.setToolTipContent(ZmMsg.close);
		this._closeButton.setSize(16,16);
		var size= this.getSize();
		this._closeButton.setLocation(size.x-22, 0); // close button at top right corner for compact mode alone
		this._closeButton.addSelectionListener(new AjxListener(this, this._closeDayViewListener));
	}
};

ZmCalDayView.prototype._closeDayViewListener =
function() {
	if (this._closeDayViewCallback) {
		this._closeDayViewCallback.run();
	}
};

ZmCalDayView.prototype.setCloseDayViewCallback =
function(callback) {
	this._closeDayViewCallback = callback;
};

ZmCalDayView.prototype.setSize =
function(width, height) {
	ZmCalColView.prototype.setSize.call(this, width, height);
	if (this._closeButton) {
		this._closeButton.setLocation(width-22, 0);
	}
};

ZmCalDayView.prototype.layout =
function() {
    this._layout(true);
}

ZmCalDayView.prototype._controlListener =
function(ev) {
	if (!this._compactMode) {
		ZmCalColView.prototype._controlListener.call(this, ev);
	}
};


ZmCalDayView.prototype._apptMouseDownAction =
function(ev, apptEl) {
    appt = this.getItemFromElement(apptEl);
    if (appt.isAllDayEvent()) {
        return false;
    } else {
        return ZmCalBaseView.prototype._apptMouseDownAction.call(this, ev, apptEl, appt);
    }
};

ZmCalDayView.prototype._updateDays =
function() {
    // When used from the ZmInviteMsgView, the day view requires a unique id - but
    // underlying views count on the id being the standard ZmId.VIEW_CAL_DAY.  Since
    // the use from ZmInviteMsgView is read-only, _updateDays is the only superclass
    // function that we have to fool by using the standard id.
    var viewId = this.view;
    this.view = ZmId.VIEW_CAL_DAY;
    ZmCalColView.prototype._updateDays.call(this);
    this.view = viewId;
}

ZmCalDayTabView = function(parent, posStyle, controller, dropTgt, view, numDays, readonly, isInviteMessage, isRight) {
	//ZmCalColView.call(this, parent, posStyle, controller, dropTgt, ZmId.VIEW_CAL_DAY_TAB, 1, false, readonly, isInviteMessage, isRight);
    ZmCalColView.call(this, parent, posStyle, controller, dropTgt, ZmId.VIEW_CAL_DAY, 1, true);
	this._compactMode = false;
};

ZmCalDayTabView.prototype = new ZmCalColView;
ZmCalDayTabView.prototype.constructor = ZmCalDayTabView;

ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD = 3;
ZmCalDayTabView._UNION_DIV_WIDTH = 0;

ZmCalDayTabView._TAB_BORDER_WIDTH = 1;
ZmCalDayTabView._TAB_BORDER_MARGIN = 4;
ZmCalDayTabView._TAB_SEP_WIDTH = 8;
ZmCalDayTabView._TAB_TITLE_MAX_LENGTH = 15;

ZmCalDayTabView.ATTR_CAL_ID = "_calid";

ZmCalDayTabView.prototype.toString =
function() {
	return "ZmCalDayTabView";
};

ZmCalDayTabView.prototype.fbStatusBarEnabled =
function(){
    return true;
};

ZmCalDayTabView.prototype._createHtml =
function(abook) {
	this._days = {};
	this._columns = [];
	this._hours = {};
	this._layouts = [];
	this._allDayAppts = [];
    this._allDayRows = [];

	this._headerYearId = Dwt.getNextId();
	this._yearHeadingDivId = Dwt.getNextId();
	this._yearAllDayDivId = Dwt.getNextId();
	this._yearAllDayTopBorderId = Dwt.getNextId();
	this._yearAllDayBottomBorderId = Dwt.getNextId();
	this._leftAllDaySepDivId = Dwt.getNextId();
	this._leftApptSepDivId = Dwt.getNextId();

	this._allDayScrollDivId = Dwt.getNextId();
	this._allDayHeadingDivId = Dwt.getNextId();
	this._allDayApptScrollDivId = Dwt.getNextId();
	this._allDayDivId = Dwt.getNextId();
	this._hoursScrollDivId = Dwt.getNextId();
	this._bodyHourDivId = Dwt.getNextId();
	this._allDaySepDivId = Dwt.getNextId();
	this._bodyDivId = Dwt.getNextId();
	this._apptBodyDivId = Dwt.getNextId();
	this._newApptDivId = Dwt.getNextId();
	this._newAllDayApptDivId = Dwt.getNextId();
	this._timeSelectionDivId = Dwt.getNextId();
    this._curTimeIndicatorHourDivId = Dwt.getNextId();
    this._curTimeIndicatorGridDivId = Dwt.getNextId();
    this._startLimitIndicatorDivId = Dwt.getNextId();
    this._endLimitIndicatorDivId = Dwt.getNextId();
    this._hourColDivId = Dwt.getNextId();

    this._unionHeadingDivId = Dwt.getNextId();
    this._unionAllDayDivId = Dwt.getNextId();
    this._unionHeadingSepDivId = Dwt.getNextId();
    this._unionGridScrollDivId = Dwt.getNextId();
    this._unionGridDivId = Dwt.getNextId();
    this._unionGridSepDivId = Dwt.getNextId();
    this._workingHrsFirstDivId = Dwt.getNextId();
    this._workingHrsSecondDivId = Dwt.getNextId();

    this._tabsContainerDivId = Dwt.getNextId();
    this._toggleBtnContainerId = Dwt.getNextId();

    this._borderLeftDivId = Dwt.getNextId();
    this._borderRightDivId = Dwt.getNextId();
    this._borderTopDivId = Dwt.getNextId();
    this._borderBottomDivId = Dwt.getNextId();
    this._startLimitIndicatorDivId = Dwt.getNextId();
    this._endLimitIndicatorDivId = Dwt.getNextId();

    var html = new AjxBuffer(),
        // year heading
	    inviteMessageHeaderStyle = (this._isInviteMessage && !this._isRight ? "height:26px;" : ""), //override class css in this case, so the header height aligns with the message view on the left
	    headerStyle = "position:absolute;" + inviteMessageHeaderStyle,
        func,
        ids,
        types,
        i;

	// div under year
	html.append("<div id='", this._yearAllDayDivId, "' name='_yearAllDayDivId' style='position:absolute;'>");
    html.append("<div id='", this._yearHeadingDivId, "' class='calendar_heading_day_tab' name='_yearHeadingDivId' style='width:100%;height:100%;'>");
	html.append("<div id='", this._headerYearId,
		"' name='_headerYearId' class=calendar_heading_year_text style='position:absolute; width:", ZmCalColView._HOURS_DIV_WIDTH,"px;'></div>");
	html.append("</div>");
    html.append("</div>");

	// sep between year and headings
	html.append("<div id='", this._leftAllDaySepDivId, "' name='_leftAllDaySepDivId' class='calendar_day_separator' style='position:absolute'></div>");

    if (this._scheduleMode) {

		// div in all day space
		html.append("<div id='", this._unionAllDayDivId, "' name='_unionAllDayDivId' style='position:absolute'>");
        html.append("<div id='", this._unionHeadingDivId, "' name='_unionHeadingDivId' class=calendar_heading style='position:absolute'>");
		html.append("<div class=calendar_heading_year_text style='position:absolute; width:", ZmCalDayTabView._UNION_DIV_WIDTH,"px;'>",ZmMsg.allDay,"</div>");
		html.append("</div>");
        html.append("</div>");

		// sep between year and headings
		html.append("<div id='", this._unionHeadingSepDivId, "' name='_unionHeadingSepDivId' class='calendar_day_separator' style='position:absolute'></div>");
	}

	// all day scroll	=============
	html.append("<div id='", this._allDayScrollDivId, "' name='_allDayScrollDivId' style='position:absolute; overflow:hidden;'>");
	html.append("</div>");
	// end of all day scroll ===========

	// div holding all day appts
	html.append("<div id='", this._allDayApptScrollDivId, "' name='_allDayApptScrollDivId' class='calendar_allday_appt' style='position:absolute'>");
	html.append("<div id='", this._allDayDivId, "' name='_allDayDivId' style='position:absolute'>");
	html.append("<div id='", this._newAllDayApptDivId, "' name='_newAllDayApptDivId' class='appt-selected' style='position:absolute; display:none;'></div>");
	html.append("</div>");
	html.append("</div>");
    // end of div holding all day appts

	// sep betwen all day and normal appts
	html.append("<div id='", this._allDaySepDivId, "' name='_allDaySepDivId' style='overflow:hidden;position:absolute;'></div>");

	// div to hold hours
	html.append("<div id='", this._hoursScrollDivId, "' name='_hoursScrollDivId' class=calendar_hour_scroll style='position:absolute;'>");
	this._createHoursHtml(html);
	html.append("</div>");
    // end of div to hold hours

	// sep between hours and grid
	html.append("<div id='", this._leftApptSepDivId, "' name='_leftApptSepDivId' class='calendar_day_separator' style='position:absolute'></div>");

	// union grid
	if (this._scheduleMode) {
		html.append("<div id='", this._unionGridScrollDivId, "' name='_unionGridScrollDivId' class=calendar_union_scroll style='position:absolute;display:none;'>");
		html.append("<div id='", this._unionGridDivId, "' name='_unionGridDivId' class='ImgCalendarDayGrid' style='width:100%; height:1008px; position:absolute;'>");
		html.append("</div></div>");
		// sep between union grid and appt grid
		html.append("<div id='", this._unionGridSepDivId, "' name='_unionGridSepDivId' class='calendar_day_separator' style='position:absolute;display:none;'></div>");
	}

	// grid body
    // Fix for bug: 66603. Removed horizontal scroll bar from grid body
	html.append("<div id='", this._bodyDivId, "' name='_bodyDivId' class=calendar_body style='position:absolute; overflow-x:hidden;'>");
    html.append("<div id='", this._apptBodyDivId, "' name='_apptBodyDivId' class='ImgCalendarDayGrid' style='width:100%; height:1008px; position:absolute;background-color:#E3E3DC;'>");
	html.append("<div id='", this._timeSelectionDivId, "' name='_timeSelectionDivId' class='calendar_time_selection' style='position:absolute; display:none;z-index:10;'></div>");
	html.append("<div id='", this._newApptDivId, "' name='_newApptDivId' class='appt-selected' style='position:absolute; display:none;'></div>");

    html.append("<div id='", this._workingHrsFirstDivId, "' style='position:absolute;background-color:#FFFFFF;'><div class='ImgCalendarDayGrid' id='", this._workingHrsFirstChildDivId, "' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");
    html.append("<div id='", this._workingHrsSecondDivId, "' style='position:absolute;background-color:#FFFFFF;'><div class='ImgCalendarDayGrid' id='", this._workingHrsSecondChildDivId, "' style='position:absolute;top:0px;left:0px;overflow:hidden;'></div></div>");

    html.append("<div id='", this._borderLeftDivId, "' name='_borderLeftDivId' class='ZmDayTabSeparator' style='background-color:#FFFFFF;position:absolute;'></div>");
    html.append("<div id='", this._borderRightDivId, "' name='_borderRightDivId' class='ZmDayTabSeparator' style='background-color:#FFFFFF;position:absolute;'></div>");
    html.append("<div id='", this._borderTopDivId, "' name='_borderTopDivId' class='ZmDayTabSeparator' style='background-color:#FFFFFF;position:absolute;'></div>");
    html.append("<div id='", this._borderBottomDivId, "' name='_borderBottomDivId' class='ZmDayTabSeparator' style='background-color:#FFFFFF;position:absolute;'></div>");
	html.append("</div>");
    // end of grid body

    //Strip to indicate the current time
    html.append("<div id='"+this._curTimeIndicatorGridDivId+"' name='_curTimeIndicatorGridDivId' class='calendar_cur_time_indicator_strip' style='position:absolute;background-color:#F16426; height: 1px;'></div>");
    //arrow to indicate the off-screen appointments
    html.append("<div id='"+this._startLimitIndicatorDivId+"' class='calendar_start_limit_indicator'><div class='ImgArrowMoreUp'></div></div>");
    html.append("<div id='"+this._endLimitIndicatorDivId+"' class='calendar_end_limit_indicator'><div class='ImgArrowMoreDown'></div></div>");

    //html.append("<div id='"+this._curTimeIndicatorGridDivId+"' name='_curTimeIndicatorGridDivId' class='calendar_cur_time_indicator_strip' style='position:absolute;background-color:#F16426; height: 1px;'></div>");
	html.append("</div>");

    // all day headings
    // Fix for bug: 66603. Separating merge/split button from tab container
    html.append("<div id='", this._toggleBtnContainerId, "' name='_toggleBtnContainerId' style='position:absolute;bottom:0px;'></div>");
    // Fix for bug: 66603. Hide the overflow
	html.append("<div id='", this._tabsContainerDivId, "' name='_tabsContainerDivId' style='position:absolute;height:45px;bottom:0px;overflow-y:hidden;'>");
	html.append("<div id='", this._allDayHeadingDivId, "' name='_allDayHeadingDivId' style='", headerStyle,	"'></div>");
	html.append("</div>");
    // end of all day headings

	this.getHtmlElement().innerHTML = html.toString();
    func = AjxCallback.simpleClosure(ZmCalColView.__onScroll, ZmCalColView, this);
	document.getElementById(this._bodyDivId).onscroll = func;
	document.getElementById(this._allDayApptScrollDivId).onscroll = func;
    // Fix for bug: 66603. Attaching a scroll function.
    document.getElementById(this._tabsContainerDivId).onscroll = func;

	if (AjxEnv.isModernIE) {
		func = AjxCallback.simpleClosure(ZmCalDayView.__onMouseWheel, this, this._bodyDivId);
		document.getElementById(this._bodyDivId).onmousewheel = func;
		func = AjxCallback.simpleClosure(ZmCalDayView.__onMouseWheel, this, this._allDayApptScrollDivId);
		document.getElementById(this._allDayApptScrollDivId).onmousewheel = func;
	}

	ids = [this._apptBodyDivId, this._bodyHourDivId, this._allDayDivId, this._allDaySepDivId];
	types = [ZmCalBaseView.TYPE_APPTS_DAYGRID, ZmCalBaseView.TYPE_HOURS_COL, ZmCalBaseView.TYPE_ALL_DAY, ZmCalBaseView.TYPE_DAY_SEP];
	for (i = 0; i < ids.length; i++) {
		this.associateItemWithElement(null, document.getElementById(ids[i]), types[i], ids[i]);
	}
	this._scrollToTime(8);
};

ZmCalDayView.__onMouseWheel =
function(elementId, event) {
	// stop smooth scrolling
	event.preventDefault();
	var elm = document.getElementById(elementId);
	elm.scrollTop -= event.wheelDelta / 2;
};

ZmCalDayTabView.prototype._layout =
function(refreshApptLayout) {
	DBG.println(AjxDebug.DBG2, "ZmCalColView in layout!");
	this._updateDays();

	var numCols = this._columns.length,
        sz = this.getSize(),
        width = sz.x,
        height = sz.y,
        hoursWidth = ZmCalColView._HOURS_DIV_WIDTH-1,
        bodyX = hoursWidth + this._daySepWidth,
        bodyY,
        unionX = ZmCalColView._HOURS_DIV_WIDTH,
        needHorzScroll,
        scrollFudge,
        allDayHeadingDiv = document.getElementById(this._allDayHeadingDivId),
        allDayHeadingDivHeight = Dwt.getSize(allDayHeadingDiv).y,
        numRows = this._allDayApptsRowLayouts ? (this._allDayApptsRowLayouts.length) : 1,
        percentageHeight,
        nearestNoOfRows,
        allDayScrollHeight,
        unionSepX;

	if (width == 0 || height == 0) { return; }

    height -= 25;
	this._needFirstLayout = false;
	bodyX += this._daySepWidth + ZmCalDayTabView._TAB_SEP_WIDTH;

	// compute height for hours/grid
	this._bodyDivWidth = width - bodyX - ZmCalDayTabView._TAB_SEP_WIDTH;

	// size appts divs
	this._apptBodyDivHeight = ZmCalColView._DAY_HEIGHT + 1; // extra for midnight to show up
	this._apptBodyDivWidth = Math.max(this._bodyDivWidth, this._calcMinBodyWidth(this._bodyDivWidth, numCols));
	needHorzScroll = this._apptBodyDivWidth > this._bodyDivWidth;

	this._horizontalScrollbar(needHorzScroll);

	if (needHorzScroll) this._apptBodyDivWidth -= 18;
	scrollFudge = needHorzScroll ? 20 : 0; // need all day to be a little wider then grid

    if(!this._toggleBtn) {
        this._setBounds(this._toggleBtnContainerId, 0, Dwt.DEFAULT, hoursWidth+ZmCalDayTabView._UNION_DIV_WIDTH+this._daySepWidth, Dwt.DEFAULT);
        this._toggleBtn = new DwtButton({parent:this, parentElement: this._toggleBtnContainerId, className: "ZButton ZPicker ZCalToggleBtn"});
        this._toggleBtn.setText(ZmMsg.calTabsMerge);
        this._toggleBtn.addListener(DwtEvent.ONCLICK, new AjxListener(this, this._toggleView));
    }

	// column headings
    // Fix for bug: 66603. Position - X set to 0 to adjust the scrolling and Position - Y to 2px.
	Dwt.setBounds(allDayHeadingDiv, 0, 2, this._apptBodyDivWidth, Dwt.DEFAULT);
	// div for all day appts
	if (this._allDayApptsList && this._allDayApptsList.length > 0) {
        numRows++;
    }
	this._allDayFullDivHeight = (ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD) * numRows + ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD;

	percentageHeight = (this._allDayFullDivHeight/height)*100;
	this._allDayDivHeight = this._allDayFullDivHeight;

	// if height overflows more than 50% of full height set its height
	// to nearest no of rows which occupies less than 50% of total height
	if (percentageHeight > 50) {
		nearestNoOfRows = Math.floor((0.50*height-ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD)/(ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD));
		this._allDayDivHeight = (ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD) * nearestNoOfRows + ZmCalDayTabView._ALL_DAY_APPT_HEIGHT_PAD;
	}

	this._setBounds(this._allDayApptScrollDivId, bodyX, allDayHeadingDivHeight+ZmCalDayTabView._TAB_BORDER_MARGIN, this._bodyDivWidth, this._allDayDivHeight+ZmCalDayTabView._TAB_BORDER_MARGIN);
	this._setBounds(this._allDayDivId, 0, 0, this._apptBodyDivWidth + scrollFudge, this._allDayFullDivHeight+ZmCalDayTabView._TAB_BORDER_MARGIN);

    // Fix for bug: 66603. Set the position-X, width and height for heading container.
    this._setBounds(this._tabsContainerDivId, bodyX, Dwt.DEFAULT, this._bodyDivWidth, scrollFudge !== 0 ? 45 : 25);

	this._allDayVerticalScrollbar(this._allDayDivHeight != this._allDayFullDivHeight);

	// div under year
	this._setBounds(this._yearAllDayDivId, 0, ZmCalDayTabView._TAB_BORDER_MARGIN, hoursWidth + ZmCalDayTabView._UNION_DIV_WIDTH + this._daySepWidth-1, this._allDayDivHeight);
    //this._setBounds(this._yearHeadingDivId, 0, this._daySepWidth-1, hoursWidth + ZmCalDayTabView._UNION_DIV_WIDTH + this._daySepWidth, ZmCalColView._ALL_DAY_APPT_HEIGHT+ZmCalDayTabView._TAB_BORDER_MARGIN+1);
	// all day scroll
	allDayScrollHeight =  this._allDayDivHeight;
	this._setBounds(this._allDayScrollDivId, bodyX, 0, this._bodyDivWidth, allDayScrollHeight);

	// horiz separator between all day appts and grid
	this._setBounds(this._allDaySepDivId, 0, (this._hideAllDayAppt ? ZmCalColView._DAY_HEADING_HEIGHT : allDayScrollHeight)+2, width, ZmCalColView._ALL_DAY_SEP_HEIGHT);

	bodyY =  (this._hideAllDayAppt ? ZmCalColView._DAY_HEADING_HEIGHT : allDayScrollHeight) + ZmCalColView._ALL_DAY_SEP_HEIGHT +  (AjxEnv.isIE ? 0 : 2);

    // Fix for bug: 66603. Adjusts the height of grid body.
	this._bodyDivHeight = height - bodyY - scrollFudge;

	// hours
	this._setBounds(this._hoursScrollDivId, 0, bodyY, hoursWidth, this._bodyDivHeight);

	// vert sep between hours and grid
	this._setBounds(this._leftApptSepDivId, hoursWidth, bodyY-ZmCalDayTabView._TAB_BORDER_WIDTH, this._daySepWidth, ZmCalColView._DAY_HEIGHT);

	// div for scrolling grid
	this._setBounds(this._bodyDivId, bodyX, bodyY, this._bodyDivWidth, this._bodyDivHeight);

	this._setBounds(this._apptBodyDivId, 0, -1, this._apptBodyDivWidth, this._apptBodyDivHeight);

    // sep in all day area
    unionSepX = unionX + ZmCalDayTabView._UNION_DIV_WIDTH;
    this._setBounds(this._unionHeadingSepDivId, unionSepX, ZmCalDayTabView._TAB_BORDER_MARGIN, this._daySepWidth-1, allDayScrollHeight+1);

    // div for scrolling union
    this._setBounds(this._unionGridScrollDivId, unionX, bodyY, ZmCalDayTabView._UNION_DIV_WIDTH, this._bodyDivHeight);
    this._setBounds(this._unionGridDivId, 0, -1, ZmCalDayTabView._UNION_DIV_WIDTH, this._apptBodyDivHeight+ZmCalColView._HOUR_HEIGHT);

    // sep in grid area
    this._setBounds(this._unionGridSepDivId, unionSepX, bodyY-ZmCalDayTabView._TAB_BORDER_MARGIN, this._daySepWidth, this._apptBodyDivHeight);

    this._bodyX = bodyX;
    this.layoutWorkingHours(this.workingHours);
	this._layoutAllDayAppts();

    this._apptBodyDivOffset   = Dwt.toWindow(document.getElementById(this._apptBodyDivId), 0, 0, null, true);
    this._apptAllDayDivOffset = Dwt.toWindow(document.getElementById(this._allDayDivId), 0, 0, null, true);


	this._layoutAppts();
    this._layoutUnionData();

};

ZmCalDayTabView.prototype.layoutWorkingHours =
function(workingHours){
    if(!workingHours) {
        workingHours = ZmCalBaseView.parseWorkingHours(ZmCalBaseView.getWorkingHours());
        this.workingHours = workingHours;
    }
    var numCols = this._columns.length;
    var dayWidth = this._calcColWidth(this._apptBodyDivWidth - Dwt.SCROLLBAR_WIDTH, numCols);

    var allDayHeadingDiv = document.getElementById(this._allDayHeadingDivId);
	var allDayHeadingDivHeight = Dwt.getSize(allDayHeadingDiv).y;

    var currentX = 0;
    var topBorderYPos = AjxEnv.isIE ? ZmCalDayTabView._TAB_BORDER_WIDTH : ZmCalColView._ALL_DAY_SEP_HEIGHT-ZmCalDayTabView._TAB_BORDER_WIDTH;

	for (var i = 0; i < numCols; i++) {
		var col = this._columns[i];

		// position day heading
		var day = this._days[col.dayIndex];
        // Fix for bug: 66603. Adjust position X & Y calendar title bubble
		this._setBounds(col.titleId, currentX, Dwt.DEFAULT, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN, ZmCalColView._DAY_HEADING_HEIGHT);
		col.apptX = currentX + 2 ; //ZZZ
		col.apptWidth = dayWidth - 3*this._daySepWidth - ZmCalDayTabView._TAB_SEP_WIDTH;  //ZZZZ
		col.allDayX = col.apptX;
		col.allDayWidth = dayWidth - ZmCalDayTabView._TAB_SEP_WIDTH; // doesn't include sep

        //split into half hrs sections
        var dayIndex = day.date.getDay(),
            workingHrs = this.workingHours[dayIndex],
            pos = this.getPostionForWorkingHourDiv(dayIndex, 0);

        if(this._scheduleMode && day.isWorkingDay) {
            this.layoutWorkingHoursDiv(col.workingHrsFirstDivId, pos, currentX, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN);
            if( workingHrs.startTime.length >= 2 &&
                workingHrs.endTime.length >= 2) {

                pos = this.getPostionForWorkingHourDiv(dayIndex, 1);
                this.layoutWorkingHoursDiv(col.workingHrsSecondDivId, pos, currentX, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN);

            }
        }
        //set tab borders
        this._setBounds(col.borderTopDivId, currentX+this._bodyX, topBorderYPos, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN, Dwt.CLEAR);
        // Fix for bug: 66603. Adjust position X of title border separator
        this._setBounds(col.borderBottomDivId, currentX, 0, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN, Dwt.CLEAR);
        this._setBounds(col.borderLeftDivId, currentX, 0, ZmCalDayTabView._TAB_BORDER_WIDTH, this._apptBodyDivHeight);
        this._setBounds(col.borderRightDivId, currentX+dayWidth-ZmCalDayTabView._TAB_BORDER_WIDTH-ZmCalDayTabView._TAB_BORDER_MARGIN, 0, ZmCalDayTabView._TAB_BORDER_WIDTH, this._apptBodyDivHeight);

        this._setBounds(col.borderLeftAllDayDivId, currentX, 0, ZmCalDayTabView._TAB_BORDER_WIDTH, this._allDayDivHeight+ZmCalDayTabView._TAB_BORDER_WIDTH+1);
        this._setBounds(col.borderTopAllDayDivId, currentX, 0, dayWidth-ZmCalDayTabView._TAB_BORDER_MARGIN, Dwt.CLEAR);
        this._setBounds(col.borderRightAllDayDivId, currentX+dayWidth-ZmCalDayTabView._TAB_BORDER_WIDTH-ZmCalDayTabView._TAB_BORDER_MARGIN, 0, ZmCalDayTabView._TAB_BORDER_WIDTH, this._allDayDivHeight+ZmCalDayTabView._TAB_BORDER_WIDTH+1);

        currentX += dayWidth;

        if (i == numCols-1) {
            //If the border div is last border div add 6 to the width
            this._setBounds(col.daySepDivId, currentX-ZmCalDayTabView._TAB_BORDER_MARGIN, 0, ZmCalDayTabView._TAB_SEP_WIDTH+6, this._apptBodyDivHeight);
        }
        else {
		    this._setBounds(col.daySepDivId, currentX-ZmCalDayTabView._TAB_BORDER_MARGIN, 0, ZmCalDayTabView._TAB_SEP_WIDTH-1, this._apptBodyDivHeight);
        }

		currentX += this._daySepWidth;
	}
};

ZmCalDayTabView.prototype._toggleView =
function() {
    if(!this._mergedView) {
        this._mergedView = true;
        this._toggleBtn.setText(ZmMsg.calTabsSplit);
    }
    else {
        this._mergedView = false;
        this._toggleBtn.setText(ZmMsg.calTabsMerge);
    }
    this.set(this._list, null, true);
};

ZmCalDayTabView.prototype._resetCalendarData =
function() {
	// TODO: optimize: if calendar list is same, skip!
    var titleParentEl = document.getElementById(this._allDayHeadingDivId),
        dayParentEl = document.getElementById(this._apptBodyDivId),
        allDaySepEl = document.getElementById(this._allDaySepDivId),
        allDayDivEl = document.getElementById(this._allDayDivId),
        cal,
         calColor,
        mergedCal,
        calMergerdTabColor,
        col,
        html,
        calId,
        div,
        i,
        k;
	// remove existing
	// TODO: optimize, add/remove depending on new calendar length
	if (this._numCalendars > 0) {
		for (i = 0; i < this._numCalendars; i++) {
			col = this._columns[i];
			this._removeNode(col.titleId);
			//this._removeNode(col.headingDaySepDivId);
			this._removeNode(col.daySepDivId);
			this._removeNode(col.borderBottomDivId);
			this._removeNode(col.borderLeftDivId);
			this._removeNode(col.borderRightDivId);
			this._removeNode(col.borderTopDivId);
			this._removeNode(col.borderLeftAllDayDivId);
			this._removeNode(col.borderTopAllDayDivId);
			this._removeNode(col.borderRightAllDayDivId);
            this._removeNode(col.workingHrsFirstChildDivId);
			this._removeNode(col.workingHrsSecondChildDivId);
            this._removeNode(col.workingHrsFirstDivId);
			this._removeNode(col.workingHrsSecondDivId);
		}
	}

	this._calendars = this._controller.getCheckedCalendars();
	this._calendars.sort(ZmFolder.sortCompareNonMail);
	this._folderIdToColIndex = {};
	this._columns = [];
	this._numCalendars = this._mergedView ? 1 : this._calendars.length;

	this._layoutMap = [];
	this._unionBusyData = []; 			//  0-47, one slot per half hour, 48 all day
	this._unionBusyDataToolTip = [];	// tool tips

	for (i = 0; i < this._numCalendars; i++) {
        cal = this._calendars[i];
        calId = cal.id ? cal.id : "";
		col = this._columns[i] = {
			index: i,
			dayIndex: 0,
			cal: cal,
			titleId: Dwt.getNextId(),
			headingDaySepDivId: Dwt.getNextId(),
			daySepDivId: Dwt.getNextId(),
            workingHrsFirstDivId: Dwt.getNextId(),
            workingHrsSecondDivId: Dwt.getNextId(),
			apptX: 0, 		// computed in layout
			apptWidth: 0,	// computed in layout
			allDayX: 0, 	// computed in layout
			allDayWidth: 0,	// computed in layout
            borderLeftDivId: Dwt.getNextId(),
            borderRightDivId: Dwt.getNextId(),
            borderTopDivId: Dwt.getNextId(),
            borderBottomDivId: Dwt.getNextId(),
            borderLeftAllDayDivId: Dwt.getNextId(),
            borderTopAllDayDivId: Dwt.getNextId(),
            borderRightAllDayDivId: Dwt.getNextId(),
            workingHrsFirstChildDivId: Dwt.getNextId(),
            workingHrsSecondChildDivId: Dwt.getNextId()
		};
        calColor = this._mergedView ? "" : cal.rgb;
		this._folderIdToColIndex[cal.id] = col;
		if (cal.isRemote() && cal.rid && cal.zid) {
			this._folderIdToColIndex[cal.zid + ":" + cal.rid] = col;
		}

        this._createDivForColumn(col.workingHrsFirstDivId, dayParentEl, "", "#FFFFFF");
        div = this._createDivForColumn(col.workingHrsFirstChildDivId, col.workingHrsFirstDivId, "ImgCalendarDayGrid");
        div.setAttribute(ZmCalDayTabView.ATTR_CAL_ID, calId);
        this._createDivForColumn(col.workingHrsSecondDivId, dayParentEl, "", "#FFFFFF");
        div = this._createDivForColumn(col.workingHrsSecondChildDivId, col.workingHrsSecondDivId, "ImgCalendarDayGrid");
        div.setAttribute(ZmCalDayTabView.ATTR_CAL_ID, calId);
        this._createDivForColumn(col.borderBottomDivId, titleParentEl, "ZmDayTabSeparator", calColor, calColor);

        // Fix for bug: 66603. The class adjusts width of calendar title bubbles
        div = this._createDivForColumn(col.titleId, titleParentEl, this._mergedView ? "" : "ZmCalDayTab ZmCalDayMerged", calColor, calColor);
        div.style.top = ZmCalDayTabView._TAB_BORDER_WIDTH + 'px';

        // Fix for bug: 84268. Removed calendar titles from the merged view.
        if (!this._mergedView) {
            div.style.top = ZmCalDayTabView._TAB_BORDER_WIDTH + 'px';
			div.style.color = AjxUtil.getForegroundColor(calColor);
            div.innerHTML = cal.getName();
        }

        this._createDivForColumn(col.borderLeftAllDayDivId, allDayDivEl, "ZmDayTabSeparator", calColor, calColor);
        this._createDivForColumn(col.borderTopAllDayDivId, allDayDivEl, "ZmDayTabSeparator", calColor, calColor);
        this._createDivForColumn(col.borderRightAllDayDivId, allDayDivEl, "ZmDayTabSeparator", calColor, calColor);
        this._createDivForColumn(col.daySepDivId, dayParentEl, "ZmDayTabMarginDiv");
		this._createDivForColumn(col.borderLeftDivId, dayParentEl, "ZmDayTabSeparator", calColor, calColor);
        this._createDivForColumn(col.borderRightDivId, dayParentEl, "ZmDayTabSeparator", calColor, calColor);
        this._createDivForColumn(col.borderTopDivId, allDaySepEl, "ZmDayTabSeparator", calColor, calColor);

	}
};

ZmCalDayTabView.prototype._createDivForColumn =
function(id, parentEl, className, bgColor, borderColor, position, isSpan, calId) {
    var div = document.createElement(isSpan ? "span" : "div");
    div.className = className ? className : "";
    div.id = id;
    div.style.position = position ? position : 'absolute';
    if(bgColor) { div.style.backgroundColor = bgColor; }
    if(borderColor) { div.style.borderColor = borderColor; }
    if(parentEl) {
        parentEl = typeof parentEl === "string" ? document.getElementById(parentEl) : parentEl;
        parentEl.appendChild(div);
    }
    return div;
};


ZmCalDayTabView.prototype._layoutAllDayAppts =
function() {
	var rows = this._allDayApptsRowLayouts;
	if (!rows) { return; }

	var rowY = ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD + 2;
	for (var i=0; i < rows.length; i++) {
		var row = rows[i];
		var num = this._mergedView ? 1 : this._numCalendars;
		for (var j=0; j < num; j++) {
			var slot = row[j];
			if (slot.data) {
				var appt = slot.data.appt;
                var div = document.getElementById(this._getItemId(appt));
                if(div) {
                    if (!this._mergedView) {
                        var cal = this._getColForFolderId(appt.folderId);
                        this._positionAppt(div, cal.allDayX+0, rowY);
                        this._sizeAppt(div, (cal.allDayWidth + this._daySepWidth) - this._daySepWidth - 1 - ZmCalDayTabView._TAB_SEP_WIDTH,
                                     ZmCalColView._ALL_DAY_APPT_HEIGHT);
                    } else {
                        this._positionAppt(div, this._columns[j].allDayX+0, rowY);
                        this._sizeAppt(div, ((this._columns[j].allDayWidth + this._daySepWidth) * slot.data.numDays) - this._daySepWidth - 1 - ZmCalDayTabView._TAB_SEP_WIDTH,
                                     ZmCalColView._ALL_DAY_APPT_HEIGHT);
                    }
                }
			}
		}
		rowY += ZmCalColView._ALL_DAY_APPT_HEIGHT + ZmCalColView._ALL_DAY_APPT_HEIGHT_PAD;
	}
};

ZmCalDayTabView.prototype._getBoundsForAppt =
function(appt) {
	var sd = appt.startDate;
	var endOfDay = new Date(sd);
	endOfDay.setHours(23,59,59,999);
	var et = Math.min(appt.getEndTime(), endOfDay.getTime());
	if (!this._mergedView)
		return this._getBoundsForCalendar(sd, et - sd.getTime(), appt.folderId);
	else
		return this._getBoundsForDate(sd, et - sd.getTime());
};

ZmCalDayTabView.prototype._getBoundsForDate =
function(d, duration, col) {
	var durationMinutes = duration / 1000 / 60;
	durationMinutes = Math.max(durationMinutes, ZmCalColView._MINIMUM_APPT_HEIGHT);
	var h = d.getHours();
	var m = d.getMinutes();
	if (col == null) {
		var day = this._getDayForDate(d);
		col = day ? this._columns[day.index] : null;
	}
	if (col == null) return null;
	return new DwtRectangle(col.apptX, ((h+m/60) * ZmCalColView._HOUR_HEIGHT),
					col.apptWidth, (ZmCalColView._HOUR_HEIGHT / 60) * durationMinutes);
};

ZmCalDayTabView.prototype._resetList =
function() {
	var list = this.getList();
	var size = list ? list.size() : 0;
	if (size == 0) return;

	for (var i=0; i < size; i++) {
		var ao = list.get(i);
		var id = this._getItemId(ao);
		var appt = document.getElementById(id);
		if (appt) {
			appt.parentNode.removeChild(appt);
			this._data[id] = null;
		}
	}
	//list.removeAll();
	this.removeAll();
};

ZmCalDayTabView.prototype._computeAllDayApptLayout =
function() {
	var adlist = this._allDayApptsList;
	adlist.sort(ZmCalBaseItem.compareByTimeAndDuration);

	for (var i=0; i < adlist.length; i++) {
		var appt = adlist[i];
		var data = this._allDayAppts[appt.getUniqueId()];
		if (data) {
			var col = this._mergedView ? this._columns[0] : this._getColForFolderId(data.appt.folderId);
			if (col)	 this._findAllDaySlot(col.index, data);
		}
	}
};

ZmCalDayTabView.prototype._layoutUnionDataDiv =
function(gridEl, allDayEl, i, data, numCols) {
	var enable = data instanceof Object;
	var id = this._unionBusyDivIds[i];
	var divEl = null;

	if (id == null) {
		if (!enable) { return; }
		id = this._unionBusyDivIds[i] = Dwt.getNextId();
		var divEl = document.createElement("div");
		divEl.style.position = 'absolute';
		divEl.className = "calendar_sched_union_div";
		this.associateItemWithElement(null, divEl, ZmCalBaseView.TYPE_SCHED_FREEBUSY, id, {index:i});

		Dwt.setOpacity(divEl, 40);

		if (i == 48) {
			//have to resize every layout, since all day div height might change
			allDayEl.appendChild(divEl);
		} else {
			// position/size once right here!
			gridEl.appendChild(divEl);
			Dwt.setBounds(divEl, 1, ZmCalColView._HALF_HOUR_HEIGHT*i+1, ZmCalDayTabView._UNION_DIV_WIDTH-2 , ZmCalColView._HALF_HOUR_HEIGHT-2);
		}

	} else {
		divEl =  document.getElementById(id);
	}
	// have to relayout each time
	//if (i == 48)	Dwt.setBounds(divEl, 1, 1, ZmCalColView._UNION_DIV_WIDTH-2, this._allDayDivHeight-2);

	var num = 0;
	for (var key in data) num++;

	Dwt.setOpacity(divEl, 20 + (60 * (num/numCols)));
	Dwt.setVisibility(divEl, enable);
};

/*
 * compute appt layout for appts that aren't all day
 */
ZmCalDayTabView.prototype._computeApptLayout =
function() {
//	DBG.println("_computeApptLayout");
//	DBG.timePt("_computeApptLayout: start", true);
	var layouts = this._layouts = new Array();
	var layoutsDayMap = [];
	var layoutsAllDay = [];
	var list = this.getList();
	if (!list) return;

	var size = list.size();
	if (size == 0) { return; }

	var overlap = null;
	var overlappingCol = null;

	for (var i=0; i < size; i++) {
		var ao = list.get(i);

		if (ao.isAllDayEvent()) {
			continue;
		}

		var newLayout = { appt: ao, col: 0, maxcol: -1};

		overlap = null;
		overlappingCol = null;

		var asd = ao.startDate;
		var aed = ao.endDate;

		var asdDate = asd.getDate();
		var aedDate = aed.getDate();

		var checkAllLayouts = (asdDate != aedDate);
		var layoutCheck = [];

		// if a appt starts n end in same day, it should be compared only with
		// other appts on same day and with those which span multiple days
		if (checkAllLayouts) {
			layoutCheck.push(layouts);
		} else {
			layoutCheck.push(layoutsAllDay);
			if (layoutsDayMap[asdDate]!=null) {
				layoutCheck.push(layoutsDayMap[asdDate]);
			}
		}

		// look for overlapping appts
		for (var k = 0; k < layoutCheck.length; k++) {
			for (var j=0; j < layoutCheck[k].length; j++) {
				var layout = layoutCheck[k][j];
				if (ao.isOverlapping(layout.appt, !this._mergedView)) {
					if (overlap == null) {
						overlap = [];
						overlappingCol = [];
					}
					overlap.push(layout);
					overlappingCol[layout.col] = true;
					// while we overlap, update our col
					while (overlappingCol[newLayout.col]) {
						newLayout.col++;
					}
				}
			}
		}

		// figure out who is on our right
		if (overlap != null) {
			for (var c in overlap) {
				var l = overlap[c];
				if (newLayout.col < l.col) {
					if (!newLayout.right) newLayout.right = [l];
					else newLayout.right.push(l);
				} else {
					if (!l.right) l.right = [newLayout];
					else l.right.push(newLayout);
				}
			}
		}
		layouts.push(newLayout);
		if (asdDate == aedDate) {
			if(!layoutsDayMap[asdDate]) {
				layoutsDayMap[asdDate] = [];
			}
			layoutsDayMap[asdDate].push(newLayout);
		} else {
			layoutsAllDay.push(newLayout);
		}
	}

	// compute maxcols
	for (var i=0; i < layouts.length; i++) {
		this._computeMaxCols(layouts[i], -1);
		this._layoutMap[this._getItemId(layouts[i].appt)]  = layouts[i];
//		DBG.timePt("_computeApptLayout: computeMaxCol "+i, false);
	}

	delete layoutsAllDay;
	delete layoutsDayMap;
	delete layoutCheck;
	//DBG.timePt("_computeApptLayout: end", false);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalWorkWeekView")) {
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

ZmCalWorkWeekView = function(parent, posStyle, controller, dropTgt) {
    var workingDays = ZmCalBaseView.parseWorkingHours(ZmCalBaseView.getWorkingHours()),
        numOfWorkingDays = 0,
        i;
    for(i=0; i<workingDays.length; i++) {
        if(workingDays[i].isWorkingDay) {
            numOfWorkingDays++;    
        }
    }
	ZmCalColView.call(this, parent, posStyle, controller, dropTgt, ZmId.VIEW_CAL_WORK_WEEK, numOfWorkingDays, false);
}

ZmCalWorkWeekView.prototype = new ZmCalColView;
ZmCalWorkWeekView.prototype.constructor = ZmCalWorkWeekView;

ZmCalWorkWeekView.prototype.toString = 
function() {
	return "ZmCalWorkWeekView";
}

/**
 * Returns the available start time in work week view
 *
 * @param   {ZmAppt} appt
 *
 * @return	{Time} or <code>null</code> if start time is not available
 */
ZmCalWorkWeekView.prototype.getAvailableStartTime = function(appt) {
	// If appointment start date is available in the view then just return start time
	if (this._getDayForDate(appt.startDate)) {
		return appt.getStartTime();
	}
	if (appt.isMultiDay()) {
		//If multi-day appointment start date is not available in the view then try to find the next available day by rolling the start date to next day.
		var startTime = Math.max(appt.getStartTime(), this._timeRangeStart);
		var endTime = Math.min(appt.getEndTime(), this._timeRangeEnd);
		while (startTime < endTime) {
			var startDate = new Date(startTime);
			if (this._getDayForDate(startDate)) {
				return startTime;
			}
			AjxDateUtil.rollToNextDay(startDate);
			startTime = startDate.getTime();
		}
	}
	return null;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalWeekView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmCalWeekView = function(parent, posStyle, controller, dropTgt) {
	ZmCalColView.call(this, parent, posStyle, controller, dropTgt, ZmId.VIEW_CAL_WEEK, 7, false);
}

ZmCalWeekView.prototype = new ZmCalColView;
ZmCalWeekView.prototype.constructor = ZmCalWeekView;

ZmCalWeekView.prototype.toString = 
function() {
	return "ZmCalWeekView";
}
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalMonthView")) {
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

ZmCalMonthView = function(parent, posStyle, controller, dropTgt) {
	ZmCalBaseView.call(this, parent, "calendar_view", posStyle, controller, ZmId.VIEW_CAL_MONTH, false);
	var element = this.getHtmlElement();
	// clear the onClick event handler.  Otherwise accessibility code will
	// generate spurious mouse up/down events
	this._setEventHdlrs([DwtEvent.ONCLICK], true, element);

	this.setScrollStyle(DwtControl.CLIP);
	this._needFirstLayout = true;
	this.numDays = 42;
};

ZmCalMonthView.prototype = new ZmCalBaseView;
ZmCalMonthView.prototype.constructor = ZmCalMonthView;

ZmCalMonthView._DaySpacer = 1; 			// space between days
ZmCalMonthView.FIRST_WORKWEEK_DAY = 1; 	// hard code to monday until we get real prefs
ZmCalMonthView.NUM_DAYS_IN_WORKWEEK = 5;// hard code to 5 days until we get real prefs

ZmCalMonthView.EXPANDED_HEIGHT_PERCENT = 70;
ZmCalMonthView.EXPANDED_WIDTH_PERCENT = 50;
ZmCalMonthView.ANIMATE_INTERVAL = 1000 / 30;
ZmCalMonthView.ANIMATE_DURATION = 250;

ZmCalMonthView.OUT_OF_BOUNDS_SNAP = -1000;

ZmCalMonthView.ALL_DAY_DIV_BODY   = "_body";

ZmCalMonthView.prototype.toString = 
function() {
	return "ZmCalMonthView";
};

ZmCalMonthView.prototype.getRollField =
function() {
	return AjxDateUtil.MONTH;
};

ZmCalMonthView.prototype._dateUpdate =
function(rangeChanged) {
	this._clearSelectedDay();
	this._updateSelectedDay();
};

ZmCalMonthView.prototype._updateTitle =
function()  {	
	// updated in updateDays
};

ZmCalMonthView.prototype._clearSelectedDay =
function() {
	if (this._selectedData != null) {
		var te = document.getElementById(this._selectedData.tdId);
		te.className = 'calendar_month_cells_td';			
		this._selectedData = null;
	}
};

ZmCalMonthView.prototype._updateSelectedDay =
function() {
	var day = this._dateToDayIndex[this._dayKey(this._date)];
	if (day) {
		var te = document.getElementById( day.tdId);
		te.className = 'calendar_month_cells_td-selected';
		this._selectedData = day;
	}
};

ZmCalMonthView.prototype._apptSelected =
function() {
	this._clearSelectedDay();
};


ZmCalMonthView.prototype._getDayForAppt =
function(appt) {
	return this._getDayForDate(appt.startDate);
};

ZmCalMonthView.prototype._getDayForDate =
function(date) {
	return this._dateToDayIndex[this._dayKey(date)];
};

ZmCalMonthView.prototype._getDivForAppt =
function(appt) {
	var day = this._getDayForAppt(appt);
	return day ? document.getElementById( day.dayId) : null;
};

ZmCalMonthView.prototype._getStartDate = 
function() {
	return new Date(this.getDate());
};

ZmCalMonthView.prototype._dayTitle =
function(date) {
	if (this._shortMonInDay != date.getMonth()) {
		this._shortMonInDay = date.getMonth();
		var formatter = DwtCalendar.getDayFormatter();
		return formatter.format(date);
	}
	return date.getDate();
};

ZmCalMonthView.prototype._getApptUniqueId =
function(appt) {
    return (appt._orig) ? appt._orig.getUniqueId() : appt.getUniqueId();
}

ZmCalMonthView.prototype._reserveRow = 
function(day, apptSet, appt) {
	var appts = day.allDayAppts;
    var row = -1;

    if (apptSet.rows[day.week] === undefined) {
        // New apptSet, or another week in the set.  Find a free slot or add to the end
        row = this._allocateRow(day, apptSet);
    } else {
        // Use the existing row for the apptSet
        row = apptSet.rows[day.week];
    }
    var apptToMove = appts[row];
    appts[row] = appt;

    if (apptToMove) {
        // The row was in use, need to move to free slot or end
        var uniqId = this._getApptUniqueId(apptToMove);
        var apptSetToMove = this._apptSets[uniqId];
        row = this._allocateRow(day, apptSetToMove);
        appts[row] = apptToMove;
        apptSetToMove.rows[day.week] = row;
    }
};

ZmCalMonthView.prototype._allocateRow =
function(day, apptSet) {
    var appts = day.allDayAppts;
    apptSet.rows[day.week] = appts.length;
    for (var i=0; i < appts.length; i++) {
        if (appts[i] == null) {
            apptSet.rows[day.week] = i;
            break;
        }
    }
    return apptSet.rows[day.week];
}

ZmCalMonthView.prototype.addAppt = 
function(appt) {
    var day = this._getDayForAppt(appt);

    if (appt._orig.isAllDayEvent() || appt._orig.isMultiDay()) {
        var uniqueId = this._getApptUniqueId(appt);
        var apptSet = this._apptSets[uniqueId];
        if (apptSet == null) {
            apptSet = this._createApptSet(appt, uniqueId);
        }
        apptSet.appts.push(appt);
    }

    if (day) {
        if (appt._orig.isAllDayEvent(appt)) {
            // make sure multi-day all day appts line up
            // Assuming sliced up appts passed in chronological order (first is start) - verify
            if (!day.allDayAppts) {
                day.allDayAppts = [];
            }  else {

            }
            // Reserve a row if its onscreen
            this._reserveRow(day, apptSet, appt);
        } else {
            if (!day.appts) {
                day.appts = [];
            }
            day.appts.push(appt);
        }
    }

};


// Multi-day appts have been sliced into a set of single day appts.  Accumulate
// the appts into an apptSet, so that when DnD is performed we can update the
// position of each appt slice that comprises the full appt.
ZmCalMonthView.prototype._createApptSet =
function(appt, uniqueId, day) {
    var dow;
    var apptSet = null;
    if (day) {
        dow = day.dow;
    } else {
        // DayIndex should be < 0 (no corresponding day, and assuming sliced appts
        // passed in from earliest to last)
        var dayIndex = this._createDayIndexFromDate(appt.startDate);
        var zeroDay = this._days[0]
        dow = (zeroDay.dow + dayIndex + 7) % 7;
    }
    // The set tracks the starting dow of the full appt, whether or not it is
    // an all-day event (note that there can be multi-day non-all-day appts),
    // the appt slices (one per day) that comprise the full appt, and the row
    // position of each slice  (in case the full appt spans multiple weeks).
    apptSet = { appts: [], rows: {}, dow: dow, allDay: appt.isAllDayEvent()};
    this._apptSets[uniqueId] = apptSet;
    return apptSet;
}

ZmCalMonthView.prototype._postSet = 
function() {
	// now go through each day and create appts in correct order to line things up
	var day;
	if(this._expandedDayInfo) {
		var row = this._expandedDayInfo.week;
		var col = this._expandedDayInfo.dow;
		var day = this._days[row*7+col];
		var d = new Date(this._date.getTime());
		d.setHours(0,0,0);
		if(d.getTime() == day.date.getTime()) {
			this.setDayView(day);
		}else {
			this.createApptItems();
		}
	}else {
		this.createApptItems();
	}
};


ZmCalMonthView.prototype.createApptItems =
function() {
	var allDayParent = document.getElementById( this._daysId);
    var day;
    // Create the all-day divs
    this._apptAllDayDiv = {};
    for (var uniqueId in this._apptSets) {
        var apptSet = this._apptSets[uniqueId];
        if (!apptSet.allDay) continue;

        var currentWeek = -1;
        var first = true;
        var last = false;
        var startDayIndex = this._createDayIndexFromDate(apptSet.appts[0]._orig.startDate);
        // Set first (header div) if offscreen and first div, or first on the grid,
        //   starting a new week.
        // Set last if in last day (41) or last in appt sequence
        for (var iAppt = 0; iAppt < apptSet.appts.length; iAppt++) {
            var appt = apptSet.appts[iAppt];
            day = this._getDayForAppt(appt);
            first = (iAppt == 0);
            last = (iAppt == (apptSet.appts.length - 1));
            if (day) {
                if (((startDayIndex + iAppt) == (this.numDays -1))) {
                    last = true;
                }
                if (day.week != currentWeek) {
                    // Catches 1st on-screen appt (0th or not)
                    first = true;
                    currentWeek = day.week;
                }
            }
            var allDayDiv = this._createAllDayApptDiv(allDayParent, appt, iAppt, first, last);
            if (!day) {
                Dwt.setVisible(allDayDiv, false);
            }
            first = false;
            last = false;

            if (day) {
                var date = DwtCalendar.getDateFormatter().format(day.date);
                allDayDiv.setAttribute('aria-label', date + ' ' + appt.getName());
            }
        }
    }

	for (var i=0; i < 6; i++)	 {
		for (var j=0; j < 7; j++)	 {
            var dayIndex = i*7+j;
			day = this._days[dayIndex];
			if (day.allDayAppts) {
				for (var k=0; k < day.allDayAppts.length; k++) {
					var appt = day.allDayAppts[k];			
					var div = this._attachAllDayFillerHtml(appt, dayIndex);
					this._fillers.push(div);
				}
			}
			if (day.appts) {
				for (var k=0; k < day.appts.length; k++)
					var div = this._createItemHtml(day.appts[k], null);
			}
		}
	}
	
	if (!this._needFirstLayout)
		this._layout();
		
	if(this._dayView) {
		this._dayView.setVisible(false);
		this.clearExpandedDay();
	}
};

ZmCalMonthView.prototype._preSet = 
function() {
    // reset all layout data
	// cleanup any filler
	if (this._fillers.length > 0) {
		for (var i=0; i < this._fillers.length; i++) {
			var f = 	this._fillers[i];
			this._fillers[i] = null;
			f.parentNode.removeChild(f);
		}
		this._fillers = [];
	}
    this._apptSets = new Object();;
	for (var i=0; i < 6; i++)	 {
		for (var j=0; j < 7; j++)	 {
			day = this._days[i*7+j];
			if (day.allDayAppts)	delete day.allDayAppts;
			if (day.appts) delete day.appts;
		}
	}
};


ZmCalMonthView.prototype._createAllDayApptDiv =
function(allDayParent, appt, iAppt, first, last) {
    var allDayDiv = this._createAllDayItemHtml(appt, first, last);
    allDayParent.appendChild(allDayDiv);
    var divKey = appt.invId + "_" + iAppt.toString();
    if (!this._apptAllDayDiv[divKey]) {
        this._apptAllDayDiv[divKey] = allDayDiv.id;
    }
    return allDayDiv;
}


ZmCalMonthView.prototype._createAllDayItemHtml =
function(appt, first, last) {
	//DBG.println("---- createItem ---- "+appt);
	
	// set up DIV
	var div = document.createElement("div");	

	div.style.position = 'absolute';
	Dwt.setSize(div, 10, 10);
	div.className = this._getStyle();

    div.style.overflow = "hidden";
    div.style.paddingBottom = "4px"
    div.head = first;
    div.tail = last;

	this.associateItemWithElement(appt, div, ZmCalBaseView.TYPE_APPT);
    var id = this._getItemId(appt);
	div.innerHTML = ZmApptViewHelper._allDayItemHtml(appt, id, this._controller, first, last);
    var apptBodyDiv = div.firstChild;

    if (!first) {
        apptBodyDiv.style.cssText += "border-left: 0px none black !important;";
    }
    if (!last) {
        apptBodyDiv.style.cssText += "border-right: 0px none black !important;";
    }
    // Set opacity on the table that is colored with the gradient - needed by IE
    var tableEl = Dwt.getDescendant(apptBodyDiv, id + "_tableBody");
    ZmCalBaseView._setApptOpacity(appt, tableEl);

	return div;
};


ZmCalMonthView.prototype._attachAllDayFillerHtml =
function(appt, dayIndex) {
    var day = this._days[dayIndex];
    var dayTable = document.getElementById(day.dayId);
    return this._createAllDayFillerHtml(appt, dayIndex, dayTable);
}

ZmCalMonthView.prototype._createAllDayFillerHtml =
function(appt, dayIndex, dayTable) {
    var targetTable = null;
    var remove = false;
    if (!dayTable) {
        if (!this._fillerGenTableBody) {
            var table = document.createElement("table");
            this._fillerGenTableBody = document.createElement("tbody");
            table.appendChild(this._fillerGenTableBody);
        }
        targetTable = this._fillerGenTableBody;
        remove = true;
    } else {
        targetTable = dayTable;
    }
	var	result = targetTable.insertRow(-1);
    if (appt) {
        result.id = appt.invId + ":" + dayIndex;
    }
	result.className = "allday";
    this._createAllDayFillerContent(result, true);
    if (remove) {
        result.parentNode.removeChild(result);
    }
	return result;
};


ZmCalMonthView.prototype._createAllDayFillerContent =
function(tr, createCell) {
    var cell;
    if (createCell) {
        cell = tr.insertCell(-1);
    } else {
        cell = tr.firstChild;
    }
    cell.innerHTML = "<table role='presentation' class=allday><tr><td><div class=allday_item_filler></div></td></tr></table>";
    cell.className = "calendar_month_day_item";
}



ZmCalMonthView.prototype._createItemHtml =	
function(appt) {
	var result = this._getDivForAppt(appt).insertRow(-1);
	result.className = this._getStyle(ZmCalBaseView.TYPE_APPT);
    result.apptStartTimeOffset  = this._getTimeOffset(appt.getStartTime());

	this.associateItemWithElement(appt, result, ZmCalBaseView.TYPE_APPT);

    this._createItemHtmlContents(appt, result);

	return result;
};

ZmCalMonthView.prototype._createItemHtmlContents =
function(appt, tr) {
    var needsAction = appt.ptst == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
    var calendar = appCtxt.getById(appt.folderId);
    var fba = needsAction ? ZmCalBaseItem.PSTATUS_NEEDS_ACTION : appt.fba;

    var tagNames  = appt.getVisibleTags();
    var tagIcon = appt.getTagImageFromNames(tagNames);

    var headerColors = ZmApptViewHelper.getApptColor(needsAction, calendar, tagNames, "header");
    var headerStyle  = ZmCalBaseView._toColorsCss(headerColors.appt);
    var bodyColors   = ZmApptViewHelper.getApptColor(needsAction, calendar, tagNames, "body");
    var bodyStyle    = ZmCalBaseView._toColorsCss(bodyColors.appt);


    var data = {
        id: this._getItemId(appt),
        appt: appt,
        duration: appt.getShortStartHour(),
        headerStyle: headerStyle,
        bodyStyle: bodyStyle,
        multiday: appt._fanoutFirst != null,
        first: appt._fanoutFirst,
        last: appt._fanoutLast,
        showAsColor : ZmApptViewHelper._getShowAsColorFromId(fba),
        tagIcon: tagIcon
    };
    ZmApptViewHelper.setupCalendarColor(true, bodyColors, tagNames, data, "headerStyle", null, 0, 0);

    var cell = tr.insertCell(-1);
    cell.className = "calendar_month_day_item";
    cell.innerHTML = AjxTemplate.expand("calendar.Calendar#month_appt", data);
    // Hack for IE - it doesn't display the tag and peel unless you  alter a containing className.
    // The month template div does not have any classNames, so this is safe.
    cell.firstChild.className = "";
}

ZmCalMonthView.prototype._createDay =
function(html, loc, week, dow) {
	var tdid = Dwt.getNextId();
	var did = Dwt.getNextId();
	var tid = Dwt.getNextId();	

	html.append("<td class='calendar_month_cells_td' id='", tdid, "'>");
	html.append("<div style='width:100%;height:100%;'>");
	html.append("<table role='presentation' class='calendar_month_day_table'>");
	html.append("<tr><td colspan=2 id='", tid, "'></td></tr></table>");
	html.append("<table role='presentation' class='calendar_month_day_table'><tbody id='", did, "'>");
	html.append("</tbody></table>");
	html.append("</div>");
	html.append("</td>");

	var data = { dayId: did, titleId: tid, tdId: tdid, week: week, dow: dow, view: this};
	this._days[loc] = data;
};

ZmCalMonthView.prototype._createHtml =
function() {
    this._showWeekNumber = appCtxt.get(ZmSetting.CAL_SHOW_CALENDAR_WEEK);    
	this._days = new Object();	
	this._rowIds = new Object();		
    this._apptSets = new Object();
	this._dayInfo = new Object();
	this._fillers = [];
	this._headerId = Dwt.getNextId();
	this._titleId = Dwt.getNextId();	
	this._daysId = Dwt.getNextId();	
	this._bodyId = Dwt.getNextId();
	this._weekNumBodyId = Dwt.getNextId();
    this._monthViewTable = Dwt.getNextId();
	this._headerColId = [];
	this._dayNameId = [];
	this._bodyColId = [];
    this._weekNumberIds = {};

	var html = new AjxBuffer();
			
	html.append("<table role='presentation' class=calendar_view_table cellpadding=0 cellspacing=0 id='",this._monthViewTable,"'>");
	html.append("<tr>");

	html.append("<td>");
	html.append("<div id='", this._headerId, "' style='position:relative;'>");
	html.append("<table id=calendar_month_header_table role='presentation' class=calendar_month_header_table>");
	html.append("<colgroup>");

    // Add column group to adjust week title heading.
    if (this._showWeekNumber) {
        html.append("<col id='", Dwt.getNextId(), "'/>");
    }

	for (var i=0; i < 7; i++) {
		this._headerColId[i] = Dwt.getNextId();
		html.append("<col id='", this._headerColId[i], "'/>");
	}
	html.append("</colgroup>");
	html.append("<tr>");
	html.append("<td colspan=7 class=calendar_month_header_month id='", this._titleId, "'></td>");
	html.append("</tr>");
	html.append("<tr>");

    // Week title to heading.
    if (this._showWeekNumber) {
        html.append("<td width=10 valign='bottom' class='calendar_month_header_cells_text'>");
        html.append(AjxMsg.calendarWeekTitle);
        html.append("</td>");
    }
	
	for (var day=0; day < 7; day++) {
		this._dayNameId[day] = Dwt.getNextId();
		html.append("<td class=calendar_month_header_cells_text id='",this._dayNameId[day],"'></td>");
	}

	html.append("</tr>");
	html.append("</table>");
	html.append("</div>");
	html.append("</td></tr>");
	html.append("<tr>");

    html.append("<td class='calendar_month_body_container'>");
	html.append("<div id='", this._daysId, "' class=calendar_month_body>");
	
	html.append("<table id='", this._bodyId, "' role='presentation' class=calendar_month_table>");
	html.append("<colgroup>");

    // Add column group to adjust week number.
    if (this._showWeekNumber) {
        html.append("<col id='"+ this._weekNumBodyId + "'></col>");
    }

	for (var i=0; i < 7; i++) {
		this._bodyColId[i] = Dwt.getNextId();
		html.append("<col id='", this._bodyColId[i], "'/>");
	}
	html.append("</colgroup>");
								
	for (var i=0; i < 6; i++)	 {
		var weekId = Dwt.getNextId();
		html.append("<tr id='" +  weekId + "'>");

        // Holds week number per row.
        if (this._showWeekNumber) {
            var weekNumberId = Dwt.getNextId();
            html.append("<td id='" + weekNumberId + "' class='calendar_month_weekno_td'></td>");
            this._weekNumberIds[i] = weekNumberId;
        }

		for (var j=0; j < 7; j++)	 {
			this._createDay(html, i*7+j, i, j);
		}
		html.append("</tr>");	
		this._rowIds[i] = weekId;
	}
	
	html.append("</table>");
	html.append("</div>");
	html.append("</td></tr>");
	html.append("</table>");
	this.getHtmlElement().innerHTML = html.toString();
    
};

ZmCalMonthView.prototype._updateWeekNumber =
function(i) {
    if(!this._showWeekNumber) return;

    var day = this._days[i*7 + 0];
	if(day && day.date) {
        
        //todo: need to use server setting to decide the weekno standard
        var serverId = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
        var useISO8601WeekNo = (serverId && serverId.indexOf("Europe")==0 && serverId != "Europe/London");

        // AjxDateUtil alters the date.  Make a copy
        var date = new Date(day.date.getTime());
        var weekNumber = AjxDateUtil.getWeekNumber(date, this.firstDayOfWeek(), null, useISO8601WeekNo);

        var wkId = this._weekNumberIds[i];
        var wkCell = wkId ? document.getElementById(wkId) : null;
        if(wkCell) {
            wkCell.innerHTML = weekNumber;   
        }
    }
};

ZmCalMonthView.prototype._updateDays =
function() {
	var d = new Date(this._date.getTime());
	this._month = d.getMonth();
	
	d.setHours(0,0,0,0);
	d.setDate(1)	
	var dow = d.getDay();
	var fdow = this.firstDayOfWeek();
	if (dow != fdow) {
		d.setDate(d.getDate()-((dow+(7-fdow))%7));
	}

	this._dateToDayIndex = new Object();

	var today = new Date();
	today.setHours(0,0,0, 0);
	
	for (var i=0; i < 6; i++) {
		for (var j=0; j < 7; j++) {
			var loc = this._calcDayIndex(i, j);
			var day = this._days[loc];
			day.date = new Date(d.getTime());
			this._dateToDayIndex[this._dayKey(day.date)] = day;
			var thisMonth = day.date.getMonth() == this._month;
	 		var te = document.getElementById(day.titleId);
	 		var isToday = d.getTime() == today.getTime();
			//te.innerHTML = d.getTime() == today.getTime() ? ("<div class=calendar_month_day_today>" + this._dayTitle(d) + "</div>") : this._dayTitle(d);
			te.innerHTML = this._dayTitle(d);			
			te.className = (thisMonth ? 'calendar_month_day_label' : 'calendar_month_day_label_off_month') + (isToday ? "_today" : "");
            day.dayClassName = te.className;
			var id = day.tdId;
	 		var de = document.getElementById(id);			
			de.className = 'calendar_month_cells_td';
			this.associateItemWithElement(null, de, ZmCalBaseView.TYPE_MONTH_DAY, id, {loc:loc});
            //d.setTime(d.getTime() + AjxDateUtil.MSEC_PER_DAY);
            var oldDate = d.getDate();
            d.setDate(d.getDate() + 1);
            if(oldDate == d.getDate()) {
                //daylight saving problem
                d.setHours(0,0,0,0);
                d.setTime(d.getTime() + AjxDateUtil.MSEC_PER_DAY);
            }
        }
        this._updateWeekNumber(i);
	}
	
	var formatter = DwtCalendar.getMonthFormatter();
	this._title = formatter.format(this._date);
	var titleEl = document.getElementById(this._titleId);
	titleEl.innerHTML = this._title;
};

ZmCalMonthView.prototype._calcDayIndex =
function(rowIndex, colIndex) {
    return (rowIndex * 7) + colIndex;
}

ZmCalMonthView.prototype.getShortCalTitle = function(){
	var formatter = DwtCalendar.getShortMonthFormatter();
	return formatter.format(this._date);
};

ZmCalMonthView.prototype._setAllDayDivSize =
function(allDayDiv, width) {
    Dwt.setSize(allDayDiv, width, 16 + 4); //Dwt.DEFAULT);
    var apptBodyDiv = document.getElementById(allDayDiv.id + ZmCalMonthView.ALL_DAY_DIV_BODY);
    Dwt.setSize(apptBodyDiv, width, 16); //Dwt.DEFAULT);
}

ZmCalMonthView.prototype._layoutAllDay = 
function() {
	var dayY = [];
	var sum = 0;
	for (var i=0; i < 6; i++)  {
		dayY[i] = sum;
		var sz = Dwt.getSize(document.getElementById( this._days[7*i].tdId));
		if (i == 0)
			this.dayWidth = sz.x;
		sum += sz.y;
	}

    var apptWidth = this.dayWidth;
    for (var uniqueId in this._apptSets) {
        var apptSet = this._apptSets[uniqueId];
        if (!apptSet.allDay) continue;

        for (var iAppt = 0; iAppt < apptSet.appts.length; iAppt++) {
            var appt = apptSet.appts[iAppt];
            var ae = document.getElementById( this._getItemId(appt));
            if (ae) {
                var width = this._calculateAllDayWidth(apptWidth, ae.head, ae.tail);
                this._setAllDayDivSize(ae, width);

                var day = this._getDayForAppt(appt);
                if (day) {
					var dow = (apptSet.dow + iAppt) % 7;
                    var apptX = this._calculateAllDayX(dow, ae.head) + (this._showWeekNumber ? 15 : 0); // Add week number width
                    var apptY = dayY[day.week] + (21*apptSet.rows[day.week]) + 18 + 3; //first 17, each appt + 1, second 17, day heading
                    Dwt.setLocation(ae, apptX, apptY);
                }
            }
        }
    }

};

// Week = week integer index, row = row index within cell, dow = day of week,
// iAppt = appt slice of a multi-day appt, 0 .. (numDays-1)
ZmCalMonthView.prototype._calculateAllDayX =
function(dow, head) {
    var apptX = 0;
    if (head) {
        apptX = (this.dayWidth * dow) + 3;
    } else {
        apptX = this.dayWidth * dow;
    }
    return apptX;
}


ZmCalMonthView.prototype._calculateAllDayWidth =
function(baseWidth, head, tail) {
    var apptWidth = baseWidth;
    if (head) {
        apptWidth -= 3;
     }
    //return (this.dayWidth * (dow + iAppt)) + 3;
    // +1 for overlap to make box-shadow on the bottom be seamless
    return apptWidth + (tail ? -3 : 1);
}


ZmCalMonthView.prototype._layout =
function() {

	DBG.println("ZmCalMonthView _layout!");

	var sz = this.getSize();
	var width = sz.x;
	var height = sz.y;

	if (width == 0 || height == 0) {
		return;
	}

	this._needFirstLayout = false;
		
	var he = document.getElementById(this._headerId);
	var headingHeight = Dwt.getSize(he).y;

	var w = width - 5; // No need to subtract week number column width.
	var h = height - headingHeight - 10;
	
	var de = document.getElementById(this._daysId);
	Dwt.setSize(de, w, h);

	var be = document.getElementById(this._bodyId);
    if(h < Dwt.getSize(be).y){
        w = w - 15; //Less Scroll bar width
    }
	Dwt.setSize(be, w, h);

    // Set the width to 15px fixed.
    if (this._showWeekNumber) {
        var wk = document.getElementById(this._weekNumBodyId);
        Dwt.setSize(wk, 15, Dwt.DEFAULT);
    }

	colWidth = Math.floor(w / (this._showWeekNumber ? 8 : 7)) - 1; // Divide by 8 columns.

	var fdow = this.firstDayOfWeek();
	for (var i=0; i < 7; i++) {
        var col = document.getElementById(this._headerColId[i]);
        Dwt.setSize(col, colWidth, Dwt.DEFAULT);
        col = document.getElementById(this._bodyColId[i]);
        Dwt.setSize(col, colWidth, Dwt.DEFAULT);

		var dayName = document.getElementById(this._dayNameId[i]);
		dayName.innerHTML = AjxDateUtil.WEEKDAY_LONG[(i+fdow)%7];
	}

	for (var i=0; i < 6; i++) {
		var row = document.getElementById(this._rowIds[i]);
		Dwt.setSize(row, Dwt.DEFAULT, Math.floor(100/6) + '%');
	}

	this._layoutAllDay(h);
	if(this._expandedDayInfo) {
        this.resizeCalendarGrid();
	}
    this.resizeAllWeekNumberCell();
};

ZmCalMonthView.getDayToolTipText =
function(date, list, controller, noheader) {
	var html = [];
	var idx = 0;

	html[idx++] = "<div><table role='presentation' cellpadding=0 cellspacing=0 border=0>";
	if (!noheader) {
		html[idx++] = "<tr><td><div class='calendar_tooltip_month_day_label'>";
		html[idx++] = DwtCalendar.getDateFullFormatter().format(date);
		html[idx++] = "</div></td></tr>";
	}
	html[idx++] = "<tr><td><table role='presentation' cellpadding=1 cellspacing=0 border=0 width=100%>";

	var size = list ? list.size() : 0;

	for (var i=0; i < size; i++) {
		var ao = list.get(i);
		if (ao.isAllDayEvent()) {
			var bs = "";
			//if (!ao._fanoutFirst) bs = "border-left:none;";
			//if (!ao._fanoutLast) bs += "border-right:none;";
			//var bodyStyle = bs != "" ? ("style='" + bs + "'") : "";
			html[idx++] = "<tr><td><div class='appt'>";
			html[idx++] = ZmApptViewHelper._allDayItemHtml(ao, this._getItemId(ao),
                controller, true, true);
			html[idx++] = "</div></td></tr>";
		}
	}

	for (var i=0; i < size; i++) {
		var ao = list.get(i);
		if (!ao.isAllDayEvent()) {
			var isNew = ao.ptst == ZmCalBaseItem.PSTATUS_NEEDS_ACTION;
			var dur = ao.getDurationText(false, false);

			html[idx++] = "<tr><td class='calendar_month_day_item'><div class='";
			html[idx++] = ZmCalendarApp.COLORS[controller.getCalendarColor(ao.folderId)];
			html[idx++] = isNew ? "DarkC" : "C";
			html[idx++] = "'>";
			if (isNew) html[idx++] = "<b>";
			html[idx++] = dur;
			if (dur != "") html[idx++] = "&nbsp;";
			html[idx++] = AjxStringUtil.htmlEncode(ao.getName());
			if (isNew) html[idx++] = "</b>";
			html[idx++] = "</div></td></tr>";
		}
	}
	if ( size == 0) {
		html[idx++] = "<tr><td>";
		html[idx++] = ZmMsg.noAppts;
		html[idx++] = "</td></tr>";
	}
	html[idx++] = "</table></tr></td></table></div>";

	return html.join("");
};

ZmCalMonthView.prototype._mouseDownAction = 
function(ev, div) {

	//if (Dwt.ffScrollbarCheck(ev)) { return false; }

	var type = this._getItemData(div, "type");
	switch (type) {
		case ZmCalBaseView.TYPE_MONTH_DAY:
            if (!appCtxt.isWebClientOffline()) {
                this._timeSelectionAction(ev, div, false);
                if (ev.button == DwtMouseEvent.RIGHT) {
                    DwtUiEvent.copy(this._actionEv, ev);
                    this._actionEv.item = this;
                    this._evtMgr.notifyListeners(ZmCalBaseView.VIEW_ACTION, this._actionEv);
                }
            }
			break;
        case ZmCalBaseView.TYPE_APPT:
            this.setToolTipContent(null);
            this._apptMouseDownAction(ev, div);
            break;
        case ZmCalBaseView.TYPE_ALL_DAY:
            this.setToolTipContent(null);
            this._apptMouseDownAction(ev, div);
            break;
	}
	return false;
};


ZmCalMonthView.prototype._doubleClickAction =
function(ev, div) {
	ZmCalBaseView.prototype._doubleClickAction.call(this, ev, div);
	var type = this._getItemData(div, "type");
	if (type == ZmCalBaseView.TYPE_MONTH_DAY) {
		this._timeSelectionAction(ev, div, true);
	}
};

ZmCalMonthView.prototype._timeSelectionAction =
function(ev, div, dblclick) {

    var date;

    var type = this._getItemData(div, "type");
    switch (type) {
        case ZmCalBaseView.TYPE_MONTH_DAY:
            var loc = this._getItemData(div, "loc");
            date = new Date(this._days[loc].date.getTime());
            var now = new Date();
            date.setHours(now.getHours(), now.getMinutes());
			if(ev.button == DwtMouseEvent.LEFT) {
                if(ZmCalViewController._contextMenuOpened){
                    ZmCalViewController._contextMenuOpened = false;
                    break;
                }
                AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.expandDay, [this._days[loc]]), 200);
			}
            break;
        default:
            return;
    }
    this._timeSelectionEvent(date, AjxDateUtil.MSEC_PER_HOUR, dblclick);
};

ZmCalMonthView.prototype.setDayView =
function(dayInfo) {
    var tdCell = document.getElementById(dayInfo.tdId);
    var size = Dwt.getSize(tdCell);
    var view = this._dayView ;
    var isDirty = !view || !view.getVisible() || !view.getDate() || view.getDate().getTime() !== dayInfo.date.getTime();

    if(!view) {
        view = this._dayView = new ZmCalDayView(this, DwtControl.ABSOLUTE_STYLE, this._controller, this._dropTgt);
        view.setCompactMode(true);
        view.setCloseDayViewCallback(new AjxCallback(this, this._closeDayView));
        //listener changes
        view.addViewActionListener(new AjxListener(this._controller, this._controller._viewActionListener));
        view.addTimeSelectionListener(new AjxListener(this._controller, this._controller._timeSelectionListener));
        view.addSelectionListener(new AjxListener(this, this._dayListSelectionListener));
        view.addActionListener(new AjxListener(this._controller, this._controller._listActionListener));

    }else {
        view.setVisible(true);
    }

    if (isDirty) {
        view.setDate(dayInfo.date, 0, true);

        var subList = new AjxVector();
        var appts = dayInfo.appts;

        if(appts) {
            for(var i = 0; i < appts.length; i++) {
                subList.add(appts[i]);
            }
        }

        var allDayAppts = dayInfo.allDayAppts;

        if(allDayAppts) {
            for(var i = 0; i < allDayAppts.length; i++) {
                subList.add(allDayAppts[i])
            }
        }

        view._preSet();
        view.set(subList, true);
    }

    view.setSize(size.x - 10, size.y - 12);
    view._syncScroll();

    var loc = Dwt.toWindow(tdCell, 0, 0, this.getHtmlElement(), true);
    view.setLocation(loc.x+5, loc.y+5);

    view._layout(true);
};

ZmCalMonthView.prototype.expandDay =
function(dayInfo) {
    this.clearCalendarGrid(true);
    this.startExpand(dayInfo);
};


ZmCalMonthView.prototype.clearCalendarGrid =
function(markApptDays) {
    for (var i=0; i < 6; i++) {

        //clear all day appts
        for (var uniqueId in this._apptSets) {
            var apptSet = this._apptSets[uniqueId];
            if (!apptSet.allDay) continue;

            for (var iAppt = 0; iAppt < apptSet.appts.length; iAppt++) {
                var appt = apptSet.appts[iAppt];
                var ae = document.getElementById( this._getItemId(appt));
                if(ae) {
                    ae.parentNode.removeChild(ae);
                }
            }
        }

        for (var j=0; j < 7; j++) {
            var loc = i*7+j;
            var day = this._days[loc];
            if(day && day.dayId) {
                var node = document.getElementById(day.dayId);
                while(node && node.firstChild) {
                    node.firstChild.parentNode.removeChild(node.firstChild);
                }
            }
            if(day && day.titleId) {
                var te = document.getElementById(day.titleId);
                te.className = day.dayClassName?day.dayClassName : '';
                Dwt.setOpacity(te, 100);
                if(markApptDays) {
                    var apptAvailable = (day.appts && day.appts.length > 0) || (day.allDayAppts && day.allDayAppts.length > 0);
                    te.className = te.className + (apptAvailable ? ' calendar_month_day_label_bold' : '');
                }
            }            
        }
    }

    //clear all day fillers
    if (this._fillers.length > 0) {
        for (var i=0; i < this._fillers.length; i++) {
            var f = 	this._fillers[i];
            this._fillers[i] = null;
            if(f.parentNode) {
                f.parentNode.removeChild(f);
            }
        }
        this._fillers = [];
    }
};

ZmCalMonthView.prototype.resizeWeekNumberCell =
function(row, height) {

    if(!this._showWeekNumber) return;
    
    var weekNumCell = document.getElementById(this._weekNumberIds[row]);
    if (weekNumCell) {
        Dwt.setSize(weekNumCell, 15, Dwt.DEFAULT); // No need to set fixed height to rows.
    }
};

ZmCalMonthView.prototype.resizeCalendarGrid =
function() {
    var grid = document.getElementById(this._daysId)
    var size = Dwt.getSize(grid);

    var avgHeight = size.y/6;
    var avgWidth = size.x/7;

    for (var i=0; i < 6; i++) {
        var row = document.getElementById(this._rowIds[i]);
        if(i==5) {
            avgHeight = avgHeight-1;
        }
        Dwt.setSize(row, Dwt.DEFAULT, avgHeight);

        if(AjxEnv.isSafari) {
            Dwt.setSize(this.getCell(i, 0), Dwt.DEFAULT, avgHeight);            
        }
    }

    for (var j=0; j < 7; j++) {
        var hdrCol = document.getElementById(this._headerColId[j]);
        var bdyCol = document.getElementById(this._bodyColId[j]);
        if(j==6) {
            avgWidth = avgWidth-1;
        }
        Dwt.setSize(hdrCol, avgWidth, Dwt.DEFAULT);
        Dwt.setSize(bdyCol, avgWidth, Dwt.DEFAULT);
        if(AjxEnv.isSafari) {
            Dwt.setSize(this.getCell(0, j), avgWidth, Dwt.DEFAULT);            
        }
    }
};

ZmCalMonthView.prototype.resizeAllWeekNumberCell =
function() {
    // Calculate the row heights and apply to the week number cells
    var previousY = 0;
    for (var iRow=0; iRow < 6; iRow++) {
        var row = document.getElementById(this._rowIds[iRow]);
        // Use location to calculate y size - getSize may get off by one
        // due to rounding errors.
        var location = Dwt.getLocation(row);
        if (iRow > 0) {
            var ySize = location.y - previousY;
            this.resizeWeekNumberCell(iRow-1, ySize);
        }
        previousY = location.y;
    }
}

ZmCalMonthView.prototype._closeDayView =
function() {
    if(this._dayView) {
        this._dayView.setVisible(false);
        this._needFirstLayout = false;
        this.clearExpandedDay();
        this.clearCalendarGrid();
        var newList = new AjxVector();
        newList.addList(this._list || [])
        this.set(newList, true);
    }
};

ZmCalMonthView.prototype.resizeCol =
function(colIdx, params) {
    var dayInfo = params.dayInfo;
    var hdrCol = document.getElementById(this._headerColId[colIdx]);
    var bdyCol = document.getElementById(this._bodyColId[colIdx]);
    var newWidth = params.avgWidth;

    if(dayInfo.dow == colIdx) {
        newWidth = params.expandedWidth;
    }else if( params.collapseColId == colIdx) {
        newWidth = params.collapsedWidth;
    }

    if(bdyCol && hdrCol) {
        newWidth = (colIdx==6) ? newWidth-1 : newWidth;
        Dwt.setSize(bdyCol, newWidth, Dwt.DEFAULT);
        Dwt.setSize(hdrCol, newWidth, Dwt.DEFAULT);

        if(AjxEnv.isSafari || AjxEnv.isChrome || (AjxEnv.isFirefox2_0up && !AjxEnv.isFirefox3up)) {
            //change first column cell
            Dwt.setSize(this.getCell(0, colIdx), newWidth, Dwt.DEFAULT);
        }

    }
};

ZmCalMonthView.prototype.resizeRow =
function(rowIdx, params) {

    if(rowIdx==null) return;

    var dayInfo = params.dayInfo;
    var height = params.avgHeight;

    var colId = null;

    if(dayInfo.week == rowIdx) {
        height = params.expandedHeight;
        colId = dayInfo.dow;
    }else if( params.collapseRowId == rowIdx) {
        height = params.collapsedHeight;
    }

    height = (rowIdx==5) ? height-1 : height;

    var row = document.getElementById(this._rowIds[rowIdx]);
    Dwt.setSize(row, Dwt.DEFAULT, height);

    //change first row cell
    if(AjxEnv.isSafari || AjxEnv.isChrome) {
        Dwt.setSize(this.getCell(rowIdx,0), Dwt.DEFAULT, height);
    }

    //IE needs direct cell expansion
    if(AjxEnv.isIE && colId!=null && rowIdx!=null) {
        var day = this.getCell(rowIdx, colId);
        Dwt.setSize(day, Dwt.DEFAULT, height);
    }

    this.resizeWeekNumberCell(rowIdx, height);
};

ZmCalMonthView.prototype.resizeCell =
function(dayInfo, height) {
    var day = this.getCell(dayInfo.week, dayInfo.dow);
    Dwt.setSize(day, Dwt.DEFAULT, height);
    this.resizeWeekNumberCell(dayInfo.week, height);
};

ZmCalMonthView.prototype.clearCellHeight =
function(dayInfo) {
    if(!dayInfo) return;
    var day = this.getCell(dayInfo.week, dayInfo.dow);
    Dwt.setSize(day, Dwt.DEFAULT, Dwt.CLEAR);
    this.resizeWeekNumberCell(dayInfo.week, Dwt.CLEAR);
};

ZmCalMonthView.prototype.getCell =
function(row, col) {
    var loc = row*7+col;
    var cellId = this._days[loc].tdId
    return document.getElementById(cellId);
};

ZmCalMonthView.prototype.startExpand =
function(dayInfo) {

    var grid = document.getElementById(this._daysId)
    var size = Dwt.getSize(grid);

    var expandedHeight = size.y*ZmCalMonthView.EXPANDED_HEIGHT_PERCENT/100;
    var expandedWidth = size.x*ZmCalMonthView.EXPANDED_WIDTH_PERCENT/100;
    var avgHeight = (size.y-expandedHeight)/5;
    var avgWidth = (size.x-expandedWidth)/6;

    var param = {
        dayInfo: dayInfo,
        avgWidth: avgWidth,
        avgHeight: avgHeight,
        maxWidth: expandedWidth,
        maxHeight: expandedHeight,
        changeCol: true,
        changeRow: true,
        startTime: new Date().getTime()
    };

    //old expanded day needs to be collapsed
    if(this._expandedDayInfo) {
        var oldDayInfo = this._expandedDayInfo;

        param.collapseRowId = oldDayInfo.week;
        param.collapseColId = oldDayInfo.dow;

        if(oldDayInfo.week == dayInfo.week) {
            param.changeRow = false;
        }
        if(oldDayInfo.dow == dayInfo.dow) {
            param.changeCol = false;
        }
    }

    if(this._dayView) {
        this._dayView.setVisible(false);
    }

    clearInterval(this._animationInterval);
    this._animationFrames = 0;
    this._animationInterval =
        setInterval(this.animateExpansion.bind(this, param),
                    ZmCalMonthView.ANIMATE_INTERVAL);

    this.animateExpansion(param);
};


ZmCalMonthView.prototype.animateExpansion =
function(param) {
    var diffWidth = param.maxWidth - param.avgWidth;
    var diffHeight = param.maxHeight - param.avgHeight;

    var passed = new Date().getTime() - param.startTime;
    var progressFraction =
        Math.min(passed / ZmCalMonthView.ANIMATE_DURATION, 1);
    var opacity = 100 * progressFraction;

    if(param.changeCol) {
        param.expandedWidth = param.avgWidth + diffWidth * progressFraction;
        param.collapsedWidth = param.maxWidth - diffWidth * progressFraction;
    }else {
        param.expandedWidth = param.collapsedWidth = param.maxWidth;
    }

    if(param.changeRow) {
        param.expandedHeight = param.avgHeight + diffHeight * progressFraction;
        param.collapsedHeight = param.maxHeight - diffHeight * progressFraction;
    }else {
        param.expandedHeight = param.collapsedHeight = param.maxHeight;
    }

    this._expandDayGrid(param);
    this.setDayView(param.dayInfo);

    this._dayView.setOpacity(opacity);
    Dwt.setOpacity(Dwt.byId(param.dayInfo.titleId), 100 - opacity);

    this._animationFrames += 1;

    // are we done?
    if (progressFraction === 1) {
        clearInterval(this._animationInterval);

        var dayInfo = param.dayInfo;
        this._expandedDayInfo = {
            week: dayInfo.week,
            dow: dayInfo.dow,
            date: dayInfo.date
        };

        var fps = Math.round(this._animationFrames / passed * 1000);
        DBG.println(AjxDebug.DBG1, "fisheye animation speed: " + fps + "FPS");
    }
};

ZmCalMonthView.prototype._expandDayGrid =
function(params) {

    var dayInfo = params.dayInfo;

    if(!this._expandedDayInfo) {
        for (var i=0; i < 6; i++) {
            this.resizeRow(i, params);
        }
        for (var j=0; j < 7; j++) {
            this.resizeCol(j, params);
        }
    }else {
        if(params.changeRow) {
            this.resizeRow(params.collapseRowId, params);
            this.resizeRow(dayInfo.week, params);
        }

        if(params.changeCol) {
            this.resizeCol(params.collapseColId, params);
            this.resizeCol(dayInfo.dow, params);
        }

        if(AjxEnv.isIE){
            if(!params.changeRow) {
                this.resizeCell(dayInfo, params.maxHeight);
            }
            this.clearCellHeight(this._expandedDayInfo);
        }

    }
};

ZmCalMonthView.prototype.clearExpandedDay =
function() {
    if(!this._expandedDayInfo) return;
    this.clearCellHeight(this._expandedDayInfo);
    this.resizeCalendarGrid();
    this.resizeAllWeekNumberCell();
    this._expandedDayInfo = null;
};

ZmCalMonthView.prototype._controlListener =
function(ev) {
    if(!this._expandedDayInfo) {
        ZmCalBaseView.prototype._controlListener.call(this, ev);
        var mvTable = document.getElementById(this._monthViewTable);
        var s = Dwt.getSize(mvTable);
        if(s.y != ev.newHeight || s.x != ev.newWidth){
            this._layout();
        }                
    }else {
        this._closeDayView();
    }
};

ZmCalMonthView.prototype._viewActionListener =
function(ev) {
    this.notifyListeners(ZmCalBaseView.VIEW_ACTION, ev);
};

ZmCalMonthView.prototype._dayListSelectionListener =
function(ev) {
    this._evtMgr.notifyListeners(DwtEvent.SELECTION, ev);
};

ZmCalMonthView.prototype.getSelection =
function() {
    if(this._expandedDayInfo) {
        return this._dayView.getSelection();
    }else {
        return ZmCalBaseView.prototype.getSelection.call(this);
    }
};

ZmCalMonthView.prototype.resizeDayCell =
function(rowId, colId) {
    var sz = this.getSize();
    var width = sz.x;
    var height = sz.y;

    var he = document.getElementById(this._headerId);
    var headingHeight = Dwt.getSize(he).y;

    var w = width - 5;
    var h = height - headingHeight - 10;

    var de = document.getElementById(this._daysId);
    Dwt.setSize(de, w, h);

    var be = document.getElementById(this._bodyId);
    Dwt.setSize(be, w, h);

    var grid = document.getElementById(this._daysId)
    var size = Dwt.getSize(grid);
    var height = size.y*ZmCalMonthView.EXPANDED_HEIGHT_PERCENT/100;
    var width = size.x*ZmCalMonthView.EXPANDED_WIDTH_PERCENT/100;


    var row = document.getElementById(this._rowIds[rowId]);
    var bodyCol = document.getElementById(this._bodyColId[colId]);
    var headerCol = document.getElementById(this._headerColId[colId]);
    if(row) {
        Dwt.setSize(row, Dwt.DEFAULT, height);
        Dwt.setSize(row.firstChild, Dwt.DEFAULT, height);
        Dwt.setSize(document.getElementById(this._days[rowId*7+colId].tdId), Dwt.DEFAULT, height);
    }
    if(bodyCol && headerCol) {
        Dwt.setSize(bodyCol, width, Dwt.DEFAULT);
        Dwt.setSize(headerCol, width, Dwt.DEFAULT);
    }

};

// --- Overrides of ZmCalBaseView Appt DnD, and custom DnD functions
ZmCalMonthView.prototype._createContainerRect =
function(data) {
    var calendarBody = document.getElementById(this._bodyId);
    var calPt = Dwt.getLocation(calendarBody);
    var calSize = Dwt.getSize(calendarBody);
    this._containerRect = new DwtRectangle(calPt.x, calPt.y, calSize.x, calSize.y);
    data.originX = calPt.x;
    data.originY = calPt.y;
    DBG.println(AjxDebug.DBG3,"_createContainerRect containerRect.y: " + calPt.y);
}


// called when DND is confirmed after threshold
ZmCalMonthView.prototype._apptDndBegin =
function(data) {
	var loc = Dwt.getLocation(data.apptEl);
    data.dndObj = {};
    data.apptX = loc.x;
    data.apptY = loc.y;
    //DBG.println(AjxDebug.DBG3,"MouseMove Begin apptOffset.x,y: " + data.apptOffset.x + "," + data.apptOffset.y +
    //    ", originX, originY: " + data.originX + "," + data.originY);

    this._colWidth = this.dayWidth;

    data.snap = this._snapXYToDate(data.docX - data.originX, data.docY - data.originY);
    if (data.snap == null) return false;

    var originalAppt = data.appt._orig;
    data.startDate   = new Date(originalAppt.getStartTime());
    var date = new Date(data.startDate);
    date.setHours(0,0,0,0);
    data.startDayIndex = this._createDayIndexFromDate(date);
    data.offsetDayIndex = data.snap.dayIndex - data.startDayIndex;
    data.startDateOffset  = -(data.offsetDayIndex * AjxDateUtil.MSEC_PER_DAY);
    data.timeOffset  = [];

    if (data.appt.isAllDayEvent()) {
        // All day, possibly multi-day appt
        data.timeOffset.push(0);
        data.numDays = this._createDayIndexFromDate(originalAppt.endDate) - data.startDayIndex;
        data.offsetY  = [];
        var allDayDiv = null;
        var blankHtml = null;

        // Offscreen divs are already setup, merely not positioned and made visible.
        // Alter the display html of onscreen divs from 2nd to last-1 to be blank (!head and !tail)
        for (var i = 0; i < data.numDays; i++) {
            var iDay = data.startDayIndex + i;
            allDayDiv = data.apptEl || this._getAllDayDiv(data.appt, i);
            if ((iDay >= 0) && (iDay < this.numDays)) {
                // Initially onscreen div
                day = this._days[iDay];
                this._calculateOffsetY(data, allDayDiv, day.week);
                if (data.numDays > 1) {
                    if (i == 0) {
                        allDayDiv.saveHtml  = allDayDiv.innerHTML;
                        this._clearIcon(allDayDiv.id, "tag");
                        this._clearIcon(allDayDiv.id, "peel");
                    } else {
                        if (allDayDiv.head || (allDayDiv.tail  && (i < (data.numDays - 1)))) {
                            allDayDiv.saveHtml  = allDayDiv.innerHTML;
                            if (!blankHtml) {
                                var itemId = this._getItemId(data.appt);
                                blankHtml = ZmApptViewHelper._allDayItemHtml(data.appt, itemId, this._controller, false, false);
                            }
                            allDayDiv.innerHTML = blankHtml;
                            allDayDiv.firstChild.id = allDayDiv.id + ZmCalMonthView.ALL_DAY_DIV_BODY;

                            allDayDiv.firstChild.style.cssText += "border-left: 0px none black !important;";
                            allDayDiv.firstChild.style.cssText += "border-right: 0px none black !important;";
                            this._setAllDayDnDSize(allDayDiv, false, false);
                         }
                    }
                }

            }
            //this._setAllDayDnDSize(data, i, allDayDiv);
            this._highlightAllDayDiv(allDayDiv, data.appt, true);
        }

    } else {
        // Non-all day appt - It could be a multi-day non-all-day appt
        var uniqueId = this._getApptUniqueId(data.appt);
        var apptSet = this._apptSets[uniqueId];
        if (!apptSet) {
             // Non-multiday, Non-all-day
            var apptDay = this._getDayForAppt(data.appt);
            apptSet = this._createApptSet(data.appt, uniqueId, apptDay);
            apptSet.appts.push(data.appt);
        }
        data.trEl = [];
        data.tableEl = [];
        for (var iAppt = 0; iAppt < apptSet.appts.length; iAppt++) {
            var appt = apptSet.appts[iAppt];
            var trId = this._getItemId(appt);
            var trEl = document.getElementById(trId);
            if (trEl == null) {
                // Offscreen ,create a tr for DnD
                trEl = document.createElement("tr");
                trEl.className = "appt-selected";
                this._createItemHtmlContents(appt, trEl);
                this.associateItemWithElement(appt, trEl, ZmCalBaseView.TYPE_APPT);
            }
            data.tableEl[iAppt] = Dwt.getDescendant(trEl, this._getItemId(appt) + "_tableBody");
            data.trEl.push(trEl);
            data.timeOffset.push(this._getTimeOffset(appt.getStartTime()));
        }
        this._calculateWeekY(data);
        data.apptDiv = {};
    }

	data.dndStarted = true;
	return true;
};

ZmCalMonthView.prototype._clearIcon =
function(allDayDivId, iconName) {
    var td = document.getElementById(allDayDivId + "_" + iconName);
    if (td) {
        td.innerHTML = "";
    }
}


ZmCalMonthView.prototype._highlightAllDayDiv =
function(allDayDiv, appt, highlight) {
    var apptBodyDiv = document.getElementById(allDayDiv.id + ZmCalMonthView.ALL_DAY_DIV_BODY);
    var tableEl = document.getElementById(this._getItemId(appt) + "_tableBody");
    // Not altering opacity - it was setting it to 0.7 for DnD, but the base opacity for all day is 0.4
    if (highlight) {
        Dwt.addClass(apptBodyDiv, DwtCssStyle.DROPPABLE);
        Dwt.setZIndex(allDayDiv, "1000000000");
    } else {
        Dwt.delClass(apptBodyDiv, DwtCssStyle.DROPPABLE);
        Dwt.setZIndex(allDayDiv, "");
    }
}

ZmCalMonthView.prototype._setAllDayDnDSize =
function(allDayDiv, first, last) {
    var width = this._calculateAllDayWidth(this.dayWidth, first, last);
    this._setAllDayDivSize(allDayDiv, width);
}

ZmCalMonthView.prototype._getAllDayDiv =
function(appt, iSlice) {
    var divKey = appt.invId + "_" + iSlice.toString();
    var allDayDivId = this._apptAllDayDiv[divKey];
    return document.getElementById(allDayDivId);

}


// Generate a dayIndex that may be < 0 or > (number of days-1), using this._days[0] as
// the 0 reference
ZmCalMonthView.prototype._createDayIndexFromDate =
function(dayDate) {
    // Bug 68507: all-day appointments don't appear correctly in month view
    // Round it.  If the dayDate is has a daylight savings time transition between itself
    // and the current day, the day index may be off by +/- 1/24.  The DayIndex needs
    // to be an integer value, otherwise we get incorrect dayOfWeek values (dayIndex % 7)
    return Math.round((dayDate.getTime() -
        this._days[0].date.getTime())/AjxDateUtil.MSEC_PER_DAY);
}


// Calculate the y position of each week
ZmCalMonthView.prototype._calculateWeekY =
function(data) {
	data.weekY = [];
	var y = 0;
	for (var iWeek=0; iWeek < 6; iWeek++)  {
		data.weekY[iWeek] = y;
		var size = Dwt.getSize(document.getElementById( this._days[7*iWeek].tdId));
		y += size.y;
	}
    data.weekY[6] = y;
}

ZmCalMonthView.prototype._calculateOffsetY =
function(data, allDayDiv, week) {
    // Record the y offset within the start cell for a particular week
    if (!data.weekY) {
        this._calculateWeekY(data);
    }
    if (data.offsetY[week] === undefined) {
        var allDayDivPt = Dwt.getLocation(allDayDiv);
        data.offsetY[week] = (allDayDivPt.y - data.weekY[week]);
    }
}

ZmCalMonthView.prototype._getTimeOffset =
function(time) {
    var date = new Date(time);
    date.setHours(0,0,0,0);
    return time - date.getTime();
}


ZmCalMonthView.prototype._snapXYToDate =
function(x, y) {
    var colIndex = Math.floor(x/this._colWidth);
    var rowIndex = 5;

    // Recheck the row heights each time - these can change as an DnD element
    // moves and out, potentially expanding or contracting a cell
    var height = 0;
    for (var iRow=0; iRow < 6; iRow++) {
        var row = document.getElementById(this._rowIds[iRow]);
        var rowSize = Dwt.getSize(row);
        height += rowSize.y;
        if (y < height) {
            rowIndex = iRow;
            break;
        }
    }
    // containerRect should aways have constrained this to be 0 <= index < numDays
    var dayIndex = this._calcDayIndex(rowIndex, colIndex);
    var dayOffset = 0;
    if (dayIndex < 0) {
        dayOffset = -dayIndex;
        dayIndex = 0;
    } else if (dayIndex >= this.numDays) {
        dayOffset = dayIndex - this.numDays + 1;
        dayIndex = this.numDays - 1;
    }
    var day = this._days[dayIndex];
    var dayDate = new Date(this._days[dayIndex].date.getTime());
    // Set to zero hours/min/sec/msec - the last day has a time set to 23:59:59:999
    dayDate.setHours(0,0,0,0);

    var snapDate = null;
    if(day && dayDate) {
         snapDate = new Date(dayDate.getTime() + (AjxDateUtil.MSEC_PER_DAY * dayOffset));
    }
    DBG.println(AjxDebug.DBG3,"mouseMove colIndex: " + colIndex + ", rowIndex: " + rowIndex + ", dayIndex: " + dayIndex + ", snapDate: " + snapDate);

    return {date:snapDate, dayIndex:dayIndex};
}


ZmCalMonthView.prototype._clearSnap =
function(snap) {
    snap.dayIndex = ZmCalMonthView.OUT_OF_BOUNDS_SNAP;
}


ZmCalMonthView.prototype._doApptMove =
function(data, deltaX, deltaY) {
    var x = data.docX - data.originX + deltaX;
    var y = data.docY - data.originY + deltaY;
    //DBG.println(AjxDebug.DBG3,"_doApptMove docY: " + data.docY + ",  originY: " + data.originY + ",  deltaY: " + deltaY + ",  y: " + y);
    var snap = this._snapXYToDate(x, y);
    if ((snap != null) && (snap.dayIndex != data.snap.dayIndex)) {
        DBG.println(AjxDebug.DBG3,"mouseMove new snap: " + snap.date + " (" + snap.dayIndex + ")   data snap: " +
                     data.snap.date+ " (" + data.snap.dayIndex + ")");

        if (data.appt.isAllDayEvent()) {
            // Map the dayIndex to the start of the (potentially) multi-day appt
            this._moveAllDayAppt(data, snap.dayIndex- data.offsetDayIndex);
        } else {
            this._moveApptRow(data, snap.dayIndex);
        }
        data.startDate = new Date(snap.date.getTime() + data.startDateOffset + data.timeOffset[0]);
        data.snap = snap;
    }

}

ZmCalMonthView.prototype._moveAllDayAppt =
function(data, newDayIndex) {
    var currentWeek = -1;
    var firstDow = this.firstDayOfWeek();
    for (var i = 0; i < data.numDays; i++) {
        var iDay = newDayIndex + i;
        var allDayDiv = data.apptEl || this._getAllDayDiv(data.appt, i);
        if ((iDay < 0) || (iDay >= this.numDays)) {
            Dwt.setVisible(allDayDiv, false);
        } else {
            var dow = (newDayIndex + i) % 7;
            var first = (i== 0) || (firstDow == dow);
            var last  = ((i == (data.numDays-1) || (iDay == (this.numDays-1)) || (dow == (firstDow + 6))));
            var apptX = this._calculateAllDayX(dow, first);
            var day = this._days[iDay];
            var apptY = 0;
            Dwt.setVisible(allDayDiv, true);
            this._setAllDayDnDSize(allDayDiv, first, last);
            var size = Dwt.getSize(allDayDiv);
            var halfHeight = size.y/2;
            if (data.offsetY[day.week] !== undefined) {
                apptY = data.weekY[day.week] + data.offsetY[day.week];
            } else {
                apptY = (data.weekY[day.week] + data.weekY[day.week + 1])/2 - halfHeight;
            }
            Dwt.setLocation(allDayDiv, apptX, apptY);
        }
    }
}


// Move a non-all-day appt
ZmCalMonthView.prototype._moveApptRow =
function(data, newDayIndex) {
    newDayIndex = newDayIndex - data.offsetDayIndex;
    var allDayParent = null;
    for (var i = 0; i < data.trEl.length; i++) {
        var day = this._days[newDayIndex + i];
        if (day) {
            if (!data.apptDiv[i]) {
                // TR -> TD -> TemplateApptDiv.
                var td =  data.trEl[i].firstChild;
                var templateApptDiv = td.firstChild;
                td.saveHTML = td.innerHTML;
                // Replace the templateApptDiv with filler content
                td.removeChild(templateApptDiv);
                // Create a spacer row - changes in height invalidates the all day div positioning
                this._createAllDayFillerContent(data.trEl[i], false);
                if (!allDayParent) {
                    allDayParent = document.getElementById( this._daysId);
                }
                data.apptDiv[i] = this._createDnDApptDiv(data, i, allDayParent, templateApptDiv);
            }
            Dwt.setVisible(data.apptDiv[i], true);
            var apptTable = data.apptDiv[i].firstChild;
            var apptSize = Dwt.getSize(apptTable);
            var apptX = (this.dayWidth * day.dow) + this.dayWidth/2 - apptSize.x/2 + (this._showWeekNumber ? 15 : 0); // Adjust week number width while dragging
            var apptY = (data.weekY[day.week] + data.weekY[day.week + 1])/2 - apptSize.y/2;
            Dwt.setLocation(data.apptDiv[i], apptX, apptY);

        }  else if (data.apptDiv[i]) {
            Dwt.setVisible(data.apptDiv[i], false);
        }
    }
}

ZmCalMonthView.prototype._createDnDApptDiv =
function(data, iAppt, allDayParent, templateApptDiv) {
    var div = document.createElement("div");
    var subs = { apptSlice:iAppt};
    div.style.position = "absolute";
    // Attach month appt to DnD proxy div
    div.appendChild(templateApptDiv);

    var trSize  = Dwt.getSize(data.trEl[iAppt]);
    Dwt.setSize(div, trSize.x, Dwt.CLEAR);
    Dwt.setZIndex(div, '100000000');
    allDayParent.appendChild(div);

    // Set the opacity on the table that has the gradient coloring; Needed for IE
    Dwt.setOpacity(data.tableEl[iAppt], ZmCalColView._OPACITY_APPT_DND);
    Dwt.addClass(div, DwtCssStyle.DROPPABLE);

    return div;
}


ZmCalMonthView.prototype._reattachApptDnDHtml =
function(data, startIndex, deselect) {
     for (var i = 0; i < data.trEl.length; i++) {
         var day = this._days[startIndex + i];
         if (data.apptDiv[i]) {
             // Detach the Appt DnD Proxy Div from the allDayParent
             data.apptDiv[i].parentNode.removeChild(data.apptDiv[i]);
         }

         if (day && data.trEl[i]) {
             // TD that originally contained the appt
             var td = data.trEl[i].firstChild;
             if (td.saveHTML) {
                 if (startIndex == data.startDayIndex) {
                     // Remove the filler
                     td.removeChild(td.firstChild);
                 } else {
                     // Dropped in a new cell - find the correct position within the appts of the current day
                     var tBody = document.getElementById(day.dayId);
                     var insertIndex = 0;
                     for (insertIndex = 0; insertIndex < tBody.childNodes.length; insertIndex++) {
                         var targetTR = tBody.childNodes[insertIndex];
                         if ((targetTR.apptStartTimeOffset !== undefined) && (targetTR.apptStartTimeOffset > data.timeOffset[i])) {
                              break;
                        }
                     }
                     // Remove the original TR from its day div
                     if (data.trEl[i].parentNode) {
                         data.trEl[i].parentNode.removeChild(data.trEl[i]);
                     }
                     data.trEl[i].removeChild(td);

                     // Create a new TR in the new day div
                     var tr = tBody.insertRow(insertIndex);
                     tr.appendChild(td);
                     tr.id = data.trEl[i].id;
                     tr.className = data.trEl[i].className;
                 }
                 // Set the td with the original appt content.  Do via innerHTML since IE
                 // does not handle the gradient coloring properly if the appt's div is simply moved
                 td.innerHTML = td.saveHTML;
                 // Hack for IE - it doesn't display the tag and peel unless you  alter a containing className.
                 // The month template div does not have any classNames, so this is safe.
                 td.firstChild.className = "";
             }
         }
     }
     data.apptDiv = {};
}

ZmCalMonthView.prototype._removeDnDApptDiv =
function(data) {
    if (data.apptDiv) {
        for (var iAppt in data.apptDiv) {
            data.apptDiv[iAppt].parentNode.removeChild(data.apptDiv[iAppt]);
        }
        data.apptDiv = null;
    }
}

ZmCalMonthView.prototype._restoreApptLoc =
function(data) {
    if(data && data.appt) {
        if (data.appt.isAllDayEvent()) {
            this._moveAllDayAppt(data, data.startDayIndex);
        } else {
            this._reattachApptDnDHtml(data, data.startDayIndex, false);
        }
        data.snap.dayIndex = data.startDayIndex;
    }
};

ZmCalMonthView.prototype._deselectDnDHighlight =
function(data) {
    if (data.appt.isAllDayEvent()) {
        for (var i = 0; i < data.numDays; i++) {
            var allDayDiv = data.apptEl || this._getAllDayDiv(data.appt, i);
            if (allDayDiv) {
                this._highlightAllDayDiv(allDayDiv, data.appt, false);
            }
        }
    } else {
        if (data.snap.dayIndex == ZmCalMonthView.OUT_OF_BOUNDS_SNAP) {
            for (var i = 0; i < data.trEl.length; i++) {
                var day = this._days[data.startDayIndex + i];
                if (day) {
                    var td = data.trEl[i].firstChild;
                    // Set the opacity on the table containing the gradient coloring; needed for IE
                    ZmCalBaseView._setApptOpacity(data.appt, data.tableEl[i]);
                }
            }
        } else {
            this._reattachApptDnDHtml(data, data.snap.dayIndex - data.offsetDayIndex, true);
        }
    }
};

ZmCalMonthView.prototype._restoreAppt =
function(data) {
   if (data.appt.isAllDayEvent()) {
        for (var i = 0; i < data.numDays; i++) {
            var allDayDiv = data.apptEl || this._getAllDayDiv(data.appt, i);
            if (allDayDiv.saveHtml !== undefined) {
                allDayDiv.innerHTML = allDayDiv.saveHtml;
                allDayDiv.saveHtml = undefined;
            }
        }
    }
};

ZmCalMonthView.prototype._handleApptScrollRegion =
function(docX, docY, incr, data) {
	var offset = 0;
    var div = document.getElementById(this._daysId);
    var fullDiv = document.getElementById(this._bodyId);
    var originPt = Dwt.getLocation(div);
    var size = Dwt.getSize(div);
    var he = document.getElementById(this._headerId);
    var headingHeight = Dwt.getSize(he).y;
    var headingBaseY  = Dwt.getLocation(he).y;

    DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion mouseY: " + docY + "    headingHeight:" + headingHeight +
        "    headingBaseY: " + headingBaseY +  "    sizeY:" + size.y);

	var upper = docY < headingBaseY + headingHeight + 4;;
	var lower = docY > originPt.y + size.y - 8; // - 8;

	if (upper || lower) {
		var sTop = div.scrollTop;
		if (upper && sTop > 0) {
            DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion sTop: " + sTop);
			offset = -(sTop > incr ? incr : sTop);
		} else if (lower) {
            var fullSize = Dwt.getSize(fullDiv);
            var sVisibleTop = fullSize.y - size.y;
            DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion sTop: " + sTop + ", sVisibleTop: " + sVisibleTop);
			if (sTop < sVisibleTop) {
				var spaceLeft = sVisibleTop - sTop;
				offset = spaceLeft  > incr ?incr : spaceLeft;
                DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion spaceLeft: " + spaceLeft);
			}
		}
		if (offset != 0) {
			div.scrollTop += offset;
            DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion offset: " + offset);
            this._containerRect.set(this._containerRect.x, this._containerRect.y - offset);
            data.originY -= offset;
            //DBG.println(AjxDebug.DBG3,"_handleApptScrollRegion new containerRect.y = " + this._containerRect.y + ",   originY = " + data.originY);
		}

	}
	return offset;
};

ZmCalMonthView.prototype.startIndicatorTimer=function(){
   if(!this._indicatorTimer){
    this._indicatorTimer = this.updateTimeIndicator();
   }
};

ZmCalMonthView.prototype.updateTimeIndicator=function(){
    // For the monthView, the indicator is the highlighting for the current day
    if (this._selectedData) {
        var today = new Date();
        today.setHours(0,0,0, 0);
        if (this._selectedData.date.getTime() != today.getTime()) {
            // Current date has changed
            this._date = today;
            this._dateUpdate();
        }
    }
    return this.setTimer(1);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalScheduleView")) {
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
/****************** OLD VERSION OF SCHEDULE VIEW *********************/
ZmCalScheduleView = function(parent, posStyle, controller, dropTgt) {
	ZmCalColView.call(this, parent, posStyle, controller, dropTgt, null, 1, true);
};

ZmCalScheduleView.prototype = new ZmCalColView;
ZmCalScheduleView.prototype.constructor = ZmCalScheduleView;

ZmCalScheduleView.prototype.toString =
function() {
	return "ZmCalScheduleView";
};

ZmCalScheduleView.prototype._apptMouseDownAction =
function(ev, apptEl) {
    appt = this.getItemFromElement(apptEl);
    if (appt.isAllDayEvent()) {
        return false;
    } else {
        return ZmCalBaseView.prototype._apptMouseDownAction.call(this, ev, apptEl, appt);
    }
}





/****************** NEW VERSION OF SCHEDULE VIEW *********************/
ZmCalNewScheduleView = function(parent, posStyle, controller, dropTgt) {
	ZmCalColView.call(this, parent, posStyle, controller, dropTgt, ZmId.VIEW_CAL_FB, 1, true);
    var app = appCtxt.getApp(ZmApp.CALENDAR);
    this._fbCache = new ZmFreeBusyCache(app);
};

ZmCalNewScheduleView.prototype = new ZmCalColView;
ZmCalNewScheduleView.prototype.constructor = ZmCalNewScheduleView;

ZmCalNewScheduleView.prototype.toString = 
function() {
	return "ZmCalNewScheduleView";
};

ZmCalNewScheduleView.ATTENDEES_METADATA = 'MD_SCHED_VIEW_ATTENDEES';

ZmCalNewScheduleView.prototype.getFreeBusyCache =
function() {
    return this._fbCache;
}

ZmCalNewScheduleView.prototype._createHtml =
function(abook) {
	DBG.println(AjxDebug.DBG2, "ZmCalNewScheduleView in _createHtml!");
    //TODO: Check and remove unnecessary instance vars
    this._days = {};
	this._columns = [];
	this._hours = {};
	this._layouts = [];
	this._allDayAppts = [];
    this._calendarOwners = {};

	this._headerYearId = Dwt.getNextId();
	this._yearHeadingDivId = Dwt.getNextId();
	this._yearAllDayDivId = Dwt.getNextId();
	this._leftAllDaySepDivId = Dwt.getNextId();
	this._leftApptSepDivId = Dwt.getNextId();

	this._allDayScrollDivId = Dwt.getNextId();
	this._allDayHeadingDivId = Dwt.getNextId();
	this._allDayApptScrollDivId = Dwt.getNextId();
	this._allDayDivId = Dwt.getNextId();
	this._hoursScrollDivId = Dwt.getNextId();
	this._bodyHourDivId = Dwt.getNextId();
	this._allDaySepDivId = Dwt.getNextId();
	this._bodyDivId = Dwt.getNextId();
	this._apptBodyDivId = Dwt.getNextId();
	this._newApptDivId = Dwt.getNextId();
	this._newAllDayApptDivId = Dwt.getNextId();
	this._timeSelectionDivId = Dwt.getNextId();


    this._unionHeadingDivId = Dwt.getNextId();
    this._unionAllDayDivId = Dwt.getNextId();
    this._unionHeadingSepDivId = Dwt.getNextId();
    this._unionGridScrollDivId = Dwt.getNextId();
    this._unionGridDivId = Dwt.getNextId();
    this._unionGridSepDivId = Dwt.getNextId();
    this._workingHrsFirstDivId = Dwt.getNextId();
    this._workingHrsSecondDivId = Dwt.getNextId();
	

	this._allDayRows = [];
    this._attendees = {};
    this._attendees[ZmCalBaseItem.PERSON] = {};
    this._attendees[ZmCalBaseItem.LOCATION] = {};
    this._attendees[ZmCalBaseItem.EQUIPMENT] = {};

    var html = new AjxBuffer();
    html.append("<div id='", this._bodyDivId, "' class=calendar_body style='position:absolute'>");
    html.append("<div id='", this._apptBodyDivId, "' style='width:100%;position:absolute;'>","</div>");
    html.append("</div>");
    this.getHtmlElement().innerHTML = html.toString();
    
};


ZmCalNewScheduleView.prototype._layout =
function(refreshApptLayout) {
	DBG.println(AjxDebug.DBG2, "ZmCalNewScheduleView in layout!");

    var sz = this.getSize();
	var width = sz.x;
	var height = sz.y;
    if (width == 0 || height == 0) { return; }
    this._setBounds(this._bodyDivId, 0, 0, width, height);
    this._setBounds(this._apptBodyDivId, 0, 0, width-Dwt.SCROLLBAR_WIDTH, height);
    //this._layoutAllDayAppts();
	
};

ZmCalNewScheduleView.prototype.getCalendarAccount =
function() {
	return null;
};

//mouse actions removed for now
ZmCalNewScheduleView.prototype._apptMouseDownAction =
function(ev, apptEl) {
    DBG.println(AjxDebug.DBG2,  "mouse listeners");    
};

ZmCalNewScheduleView.prototype._doubleClickAction =
function(ev, div) {
    this._mouseDownAction(ev, div, true);
};

ZmCalNewScheduleView.prototype._mouseDownAction =
function(ev, div, isDblClick) {
    DBG.println(AjxDebug.DBG2,  "mouse down action");
    var target = DwtUiEvent.getTarget(ev),
        targetId,
        tmp,
        index = {},
        apptDate,
        duration = 30,
        folderId = null,
        isAllDay = false;
    isDblClick = isDblClick || false;
    if(target && target.className.indexOf("ZmSchedulerGridDiv") != -1) {
        targetId = target.id;
        tmp = targetId.split("__");
        index.start = tmp[1] - 1;
        index.end = tmp[1];

        if(this._scheduleView) {
            this._scheduleView.setDateBorder(index);
            this._scheduleView._outlineAppt();
            if(!this._date) {
                this._date = new Date();
            }
            apptDate = new Date(this._date);
            apptDate.setHours(0, index.end*30, 0);

            this._timeSelectionEvent(apptDate, duration, isDblClick, isAllDay, folderId, ev.shiftKey);
        }
    }
};

ZmCalNewScheduleView.prototype.getOrganizer =
function() {
    var organizer = new ZmContact(null);
	organizer.initFromEmail(appCtxt.getUsername(), true);
    return organizer;
};
//overridden method - do not remove
ZmCalNewScheduleView.prototype.getRsvp =
function() {
    return false;
};
//overridden method - do not remove
ZmCalNewScheduleView.prototype._scrollToTime =
function(hour) {
};

ZmCalNewScheduleView.prototype.getDateInfo =
function(date) {
    var dateInfo = {},
        d = date || new Date();
	dateInfo.startDate = AjxDateUtil.simpleComputeDateStr(d);
	dateInfo.endDate = AjxDateUtil.simpleComputeDateStr(d);
	dateInfo.timezone = AjxDateFormat.format("z", d);
    dateInfo.isAllDay = true;
    return dateInfo;
};

ZmCalNewScheduleView.prototype._navDateChangeListener =
function(date) {
    this._date = date;
    this._scheduleView.changeDate(this.getDateInfo(date));
};
//overridden method - do not remove
ZmCalNewScheduleView.prototype._dateUpdate =
function(rangeChanged) {
};

ZmCalNewScheduleView.prototype.set =
function(list, skipMiniCalUpdate) {
    this._preSet();
    //Check added for sync issue - not sure if schedule view is ready by this time
    if(!this._scheduleView) {
        this._calNotRenderedList = list;
        return;
    }
    this.resetListItems(list);
    this.renderAppts(list);
};

ZmCalNewScheduleView.prototype.resetListItems =
function(list) {
    this._selectedItems.removeAll();
    var newList = list;
    if (list && (list == this._list)) {
        newList = list.clone();
    }
    this._resetList();
    this._list = newList;
};

ZmCalNewScheduleView.prototype.renderAppts =
function(list) {
    var timeRange = this.getTimeRange();
	if (list) {
		var size = list.size();
		DBG.println(AjxDebug.DBG2,"list.size:"+size);
		if (size != 0) {
            var showDeclined = appCtxt.get(ZmSetting.CAL_SHOW_DECLINED_MEETINGS);
            this._computeApptLayout();
			for (var i=0; i < size; i++) {
				var ao = list.get(i);
				if (ao && ao.isInRange(timeRange.start, timeRange.end) &&
				    (showDeclined || (ao.ptst != ZmCalBaseItem.PSTATUS_DECLINED))) {
                    this.addAppt(ao);
				}
			}
		}
	}
};

ZmCalNewScheduleView.prototype.addAppt =
function(appt) {
    if(this._scheduleView) {
        var item = this._createItemHtml(appt),
            div = this._getDivForAppt(appt);

	    if (div) {
            div.appendChild(item);
        }
        this._scheduleView.colorAppt(appt, item);
    }
};

ZmCalNewScheduleView.prototype.removeAppt =
function(appt) {
    if(this._scheduleView) {
        var itemId = this._getItemId(appt),
            item = document.getElementById(itemId),
            div = this._getDivForAppt(appt);

	    if (div && item) {
            div.removeChild(item);
        }
    }
};

ZmCalNewScheduleView.prototype.removeApptByEmail =
function(email) {
    if(this._scheduleView) {
        for (var i = 0; i<this._list.size(); i++) {
            var appt = this._list.get(i);
            if(appt && appt.getFolder().getOwner() == email) {
                var itemId = this._getItemId(appt),
                    item = document.getElementById(itemId),
                    div = this._getDivForAppt(appt);

                if (div && item) {
                    div.removeChild(item);
                }
            }
        }
    }
};

ZmCalNewScheduleView.prototype.refreshAppts =
function() {
    this._selectedItems.removeAll();
    var newList = this._list.clone();
    this._resetList();
    this._list = newList;
    this.renderAppts(newList);
};

//overridden method - do not remove
ZmCalNewScheduleView.prototype._layoutAllDayAppts =
function() {
};

ZmCalNewScheduleView.prototype.getAtttendees =
function() {
    return this._attendees[ZmCalBaseItem.PERSON].getArray();
};

ZmCalNewScheduleView.prototype.getMetadataAttendees =
function(organizer) {
    var md = new ZmMetaData(organizer.getAccount());
    var callback = new AjxCallback(this, this.processMetadataAttendees);
    md.get('MD_SCHED_VIEW_ATTENDEES', null, callback);
};

ZmCalNewScheduleView.prototype.processMetadataAttendees =
function(metadataResponse) {
    var objAttendees = metadataResponse.getResponse().BatchResponse.GetMailboxMetadataResponse[0].meta[0]._attrs,
        emails = [],
        email,
        acct,
        i;

    for (email in objAttendees) {
        if(email && objAttendees[email]) {
            emails.push(objAttendees[email]);
        }
    }
    this._mdAttendees = AjxVector.fromArray(emails);
    for (i=0; i<this._mdAttendees.size(); i++) {
        acct = ZmApptViewHelper.getAttendeeFromItem(this._mdAttendees.get(i), ZmCalBaseItem.PERSON);
        this._attendees[ZmCalBaseItem.PERSON].add(acct, null, true);
    }

    AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar", "CalendarAppt"]);
    this._scheduleView = new ZmFreeBusySchedulerView(this, this._attendees, this._controller, this.getDateInfo());
    this._scheduleView.setComposeMode(false);
    this._scheduleView.setVisible(true);
    this._scheduleView.showMe();
    this._scheduleView.reparentHtmlElement(this._apptBodyDivId);

    //Called to handle the sync issue
    this.resetListItems(this._calNotRenderedList);
    this.renderAppts(this._calNotRenderedList);
    delete this._calNotRenderedList;
};

ZmCalNewScheduleView.prototype.setMetadataAttendees =
function(organizer, email) {
    if(!organizer) {
        organizer = this.getOrganizer();
    }
    if (email instanceof Array) {
        email = email.join(',');
    }
    var md = new ZmMetaData(organizer.getAccount());
    this._mdAttendees.add(email, null, true);
    return md.set(ZmCalNewScheduleView.ATTENDEES_METADATA, this._mdAttendees.getArray());
};

ZmCalNewScheduleView.prototype.removeMetadataAttendees =
function(organizer, email) {
    if(!organizer) {
        organizer = this.getOrganizer();
    }
    if (email instanceof Array) {
        email = email.join(',');
    }
    var md = new ZmMetaData(organizer.getAccount());
    this._mdAttendees.remove(email, null, true);
    return md.set(ZmCalNewScheduleView.ATTENDEES_METADATA, this._mdAttendees.getArray());
};

ZmCalNewScheduleView.prototype._resetCalendarData =
function() {
    var i,
        tb,
        acct,
        acctEmail,
        strAttendees,
        mdAttendees,
        organizer = this.getOrganizer();
	this._calendars = this._controller.getCheckedCalendars();
	this._calendars.sort(ZmFolder.sortCompareNonMail);
	this._folderIdToColIndex = {};
	this._columns = [];
	this._numCalendars = this._calendars.length;
    this._attendees[ZmCalBaseItem.PERSON] = new AjxVector();

    for (i=0; i<this._numCalendars; i++) {
        acctEmail = this._calendars[i].getOwner();
        if(organizer.getEmail() != acctEmail) {
            //if not organizer add to the attendee list
            acct = ZmApptViewHelper.getAttendeeFromItem(acctEmail, ZmCalBaseItem.PERSON);
            this._attendees[ZmCalBaseItem.PERSON].add(acct, null, true);
        }
    }

    if(this._scheduleView) {
        //this._attendees[ZmCalBaseItem.PERSON] = this._scheduleView.getAttendees();

        for (i=0; i<this._mdAttendees.size(); i++) {
            acct = ZmApptViewHelper.getAttendeeFromItem(this._mdAttendees.get(i), ZmCalBaseItem.PERSON);
            this._attendees[ZmCalBaseItem.PERSON].add(acct, null, true);
        }

        this._scheduleView.cleanup();
        this._scheduleView.setComposeMode(false);
        this._scheduleView.set(this.getDate(), organizer, this._attendees);
        this._scheduleView.enablePartcipantStatusColumn(true);
    }
    else {
        this._mdAttendees = new AjxVector();
        this.getMetadataAttendees(organizer);        
    }    
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmCalListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmCalListView = function(parent, posStyle, controller, dropTgt) {
	if (arguments.length == 0) { return; }

	var params = {
		parent: parent,
		posStyle: posStyle,
		controller: controller,
		dropTgt: dropTgt,
		view: ZmId.VIEW_CAL_LIST,
		headerList: this._getHeaderList(parent),
		pageless: true
	};
	ZmApptListView.call(this, params);

	this._dateSearchBar = this._createSearchBar(parent);

	this._needsRefresh = true;
	this._timeRangeStart = 0;
	this._timeRangeEnd = 0;
	this._title = "";
};

ZmCalListView.prototype = new ZmApptListView;
ZmCalListView.prototype.constructor = ZmCalListView;


// Consts
ZmCalListView.DEFAULT_CALENDAR_PERIOD	= AjxDateUtil.MSEC_PER_DAY * 14;			// 2 weeks
ZmCalListView.DEFAULT_SEARCH_PERIOD		= AjxDateUtil.MSEC_PER_DAY * 400;			// 400 days (maximum supported by the server)


// Public methods

ZmCalListView.prototype.toString =
function() {
	return "ZmCalListView";
};


// ZmCalBaseView methods

ZmCalListView.prototype.getTimeRange =
function() {
	return { start:this._timeRangeStart, end:this._timeRangeEnd };
};

ZmCalListView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this.getCalTitle()].join(": ");
};

ZmCalListView.prototype.getCalTitle =
function() {
	return this._title;
};

ZmCalListView.prototype.needsRefresh =
function() {
	return this._needsRefresh;
};

ZmCalListView.prototype.setNeedsRefresh =
function(needsRefresh) {
	this._needsRefresh = needsRefresh;
};

ZmCalListView.prototype.createHeaderHtml =
function(defaultColumnSort) {
	DwtListView.prototype.createHeaderHtml.call(this, defaultColumnSort, true);
};

ZmCalListView.prototype.getDate =
function() {
	return this._date;
};

ZmCalListView.prototype.setDate =
function(date, duration, roll) {
	this._date = new Date(date.getTime());

	var d = new Date(date.getTime());
	d.setHours(0, 0, 0, 0);
	this._timeRangeStart = d.getTime();
	this._timeRangeEnd = this._timeRangeStart + ZmCalListView.DEFAULT_CALENDAR_PERIOD;

	this._updateTitle();
	this._segmentedDates = [];

	// update widgets
	var startDate = new Date(this._timeRangeStart);
	var endDate = new Date(this._timeRangeEnd);
	this._startDateField.setValue(AjxDateUtil.simpleComputeDateStr(startDate));
	this._endDateField.setValue(AjxDateUtil.simpleComputeDateStr(endDate));

	this._updateDateRange(startDate, endDate);

	// Notify any listeners
	if (this.isListenerRegistered(DwtEvent.DATE_RANGE)) {
		if (!this._dateRangeEvent) {
			this._dateRangeEvent = new DwtDateRangeEvent(true);
		}
		this._dateRangeEvent.item = this;
		this._dateRangeEvent.start = new Date(this._timeRangeStart);
		this._dateRangeEvent.end = new Date(this._timeRangeEnd);
		this.notifyListeners(DwtEvent.DATE_RANGE, this._dateRangeEvent);
	}
};

ZmCalListView.prototype.getRollField =
function() {
	return AjxDateUtil.TWO_WEEKS;
};

ZmCalListView.prototype._fanoutAllDay =
function(appt) {
	return false;
};

ZmCalListView.prototype._apptSelected =
function() {
	// do nothing
};

ZmCalListView.prototype._updateTitle =
function() {
	var dayFormatter = DwtCalendar.getDayFormatter();
	var start = new Date(this._timeRangeStart);
	var end = new Date(this._timeRangeEnd);

	this._title = [
		dayFormatter.format(start), " - ", dayFormatter.format(end)
	].join("");
};

ZmCalListView.prototype._updateDateRange =
function(startDate, endDate) {
	var params = [
		AjxDateUtil._getMonthName(startDate, true),
		startDate.getDate(),
		AjxDateUtil._getMonthName(endDate, true),
		endDate.getDate()
	];
	this._dateRangeField.innerHTML = AjxMessageFormat.format(ZmMsg.viewCalListDateRange, params);
};

ZmCalListView.prototype.addTimeSelectionListener =
function(listener) {
	// do nothing
};

ZmCalListView.prototype.addDateRangeListener =
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
};

ZmCalListView.prototype.addViewActionListener =
function(listener) {
	// do nothing
};


// DwtListView methods

ZmCalListView.prototype.setBounds =
function(x, y, width, height) {
	// set height to 32px (plus 1px for bottom border) to adjust for the new date-range toolbar
    if (this._dateSearchBar) {
        this._dateSearchBar.setBounds(x, y, width, 33);
        ZmListView.prototype.setBounds.call(this, x, y+33, width, height-33);
    }
    else {
        ZmListView.prototype.setBounds.apply(this, arguments);
    }
};

ZmCalListView.prototype.setLocation = function(x, y) {
    // HACK: setBounds calls setLocation so only relocate date search bar
    // HACK: when the location is NOWHERE
    if (this._dateSearchBar && x == Dwt.LOC_NOWHERE) {
        this._dateSearchBar.setLocation(x, y);
    }
    ZmApptListView.prototype.setLocation.call(this, x, y);
};

// NOTE: Currently setLocation is called with values of NOWHERE when they
// NOTE: want the control to disappear. But I'm adding an override for
// NOTE: setVisible as well to be defensive against future changes.
ZmCalListView.prototype.setVisible = function(visible) {
    if (this._dateSearchBar) {
        this._dateSearchBar.setVisible(visible);
    }
    ZmApptListView.prototype.setVisible.apply(this, arguments);
};

ZmCalListView.prototype._mouseOverAction =
function(ev, div) {
	DwtListView.prototype._mouseOverAction.call(this, ev, div);
	var id = ev.target.id || div.id;
	if (!id) { return true; }

	// check if we're hovering over a column header
	var data = this._data[div.id];
	var type = data.type;
	if (type && type == DwtListView.TYPE_HEADER_ITEM) {
		var itemIdx = data.index;
		var field = this._headerList[itemIdx]._field;
        // Bug: 76489 - Added <span> as workaround to show tooltip as HTML
        // The ideal fix should add a method in DwtControl to remove the tooltip
		this.setToolTipContent('<span>'+this._getHeaderToolTip(field, itemIdx)+'</span>');
	} else {
		var item = this.getItemFromElement(div);
		if (item) {
			var match = this._parseId(id);
			if (!match) { return; }
			this.setToolTipContent(this._getToolTip({field:match.field, item:item, ev:ev, div:div, match:match}));
			if (match.field != ZmItem.F_SELECTION && match.field != ZmItem.F_TAG && item.getToolTip) {
				// load attendee status if necessary
				if (item.otherAttendees && (item.ptstHashMap == null)) {
					var clone = ZmAppt.quickClone(item);
					var uid = this._currentMouseOverApptId = clone.getUniqueId();
					var callback = new AjxCallback(null, ZmApptViewHelper.refreshApptTooltip, [clone, this]);
					AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.getApptDetails, [clone, callback, uid]), 2000);
				}
			}
		}
	}
	return true;
};

ZmCalListView.prototype.getApptDetails =
function(appt, callback, uid) {
	if (this._currentMouseOverApptId &&
		this._currentMouseOverApptId == uid)
	{
		this._currentMouseOverApptId = null;
		appt.getDetails(null, callback, null, null, true);
	}
};

ZmCalListView.prototype._createSearchBar = function(parent) {
    var id = this._htmlElId;

    var searchBar = new DwtComposite({parent:parent, className:"ZmCalListViewSearchBar", posStyle:DwtControl.ABSOLUTE_STYLE});
    searchBar.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Calendar#ListViewSearchBar",id);

    var controls = new DwtMessageComposite({
        parent: searchBar,
        parentElement: Dwt.byId(id+"_searchBarControls"),
        format: ZmMsg.showApptsFromThrough,
        controlCallback: this._createSearchBarComponent.bind(this),
    });

    this._dateRangeField = document.getElementById(id+"_searchBarDate");
    this._makeFocusable(this._dateRangeField);

    return searchBar;
};

ZmCalListView.prototype._getSearchBarTabGroup = function() {
	if (!this._dateSearchBarTabGroup) {
		var tg = this._dateSearchBarTabGroup =
			new DwtTabGroup('ZmCalListView search');

		tg.addMember([
			this._dateSearchBar.getChild(0).getTabGroupMember(),
			this._dateRangeField
		]);
	}

	return this._dateSearchBarTabGroup;
}

ZmCalListView.prototype._createSearchBarComponent = function(searchBar, segment, i) {
    var isStart = segment.getIndex() == 0;
    var id = this._htmlElId;
    var prefix = isStart ? "_start" : "_end";

    var component = new DwtToolBar({parent:searchBar});

    var inputId = [id,prefix,"DateInput"].join("");
    var input = new DwtInputField({id: inputId, parent: component});
    Dwt.setHandler(input.getInputElement(), DwtEvent.ONCHANGE,
                   this._onDatesChange.bind(this, isStart));

    var dateButtonListener = new AjxListener(this, this._dateButtonListener);
    var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);
    var buttonId = [id,prefix,"MiniCal"].join("");
    var button = ZmCalendarApp.createMiniCalButton(component, buttonId, dateButtonListener, dateCalSelectionListener, isStart ? ZmMsg.startDate : ZmMsg.endDate, false);

    // this.getTabGroupMember().addMember([inputEl, button]);

    if (isStart) {
        this._startDateField = input;
        this._startDateField.setToolTipContent(ZmMsg.startDate);
        this._startDateButton = button;
    }
    else {
        this._endDateField = input;
        this._endDateField.setToolTipContent(ZmMsg.endDate);
        this._endDateButton = button;
    }

    return component;
};

/**
 * Event listener triggered when user clicks on the down arrow button to bring
 * up the date picker.
 *
 * @param ev		[Event]		Browser event
 * @private
 */
ZmCalListView.prototype._dateButtonListener =
function(ev) {
	var calDate = ev.item == this._startDateButton
		? AjxDateUtil.simpleParseDateStr(this._startDateField.getValue())
		: AjxDateUtil.simpleParseDateStr(this._endDateField.getValue());

	// if date was input by user and its foobar, reset to today's date
	if (isNaN(calDate)) {
		calDate = new Date();
		var field = ev.item == this._startDateButton
			? this._startDateField : this._endDateField;
		field.setValue(AjxDateUtil.simpleComputeDateStr(calDate));
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();

    if(AjxEnv.isIE) {
        //DwtMenu adds padding of 6px each side
        //IE has to add 12px to width and height to adjust the calendar
        var menuSize = menu.getSize();
        menu.setSize(menuSize.x+12, menuSize.y+12);
        menu.getHtmlElement().style.width = "180px";
    }
};

/**
 * Event listener triggered when user selects date in the date-picker.
 *
 * @param ev		[Event]		Browser event
 * @private
 */
ZmCalListView.prototype._dateCalSelectionListener =
function(ev) {
	var parentButton = ev.item.parent.parent;

	// update the appropriate field w/ the chosen date
	var field = (parentButton == this._startDateButton)
		? this._startDateField : this._endDateField;
	field.setValue(AjxDateUtil.simpleComputeDateStr(ev.detail));

	// change the start/end date if they mismatch
	this._handleDateChange(parentButton == this._startDateButton);
};

/**
 * Called when user selects a new date from the date-picker. Normalizes the
 * start/end dates if user chose start date to be after end date or vice versa.
 * Also updates the UI with the new date ranges and initiates SearchRequest.
 *
 * @param isStartDate
 * @private
 */
ZmCalListView.prototype._handleDateChange =
function(isStartDate) {
	var start = AjxDateUtil.simpleParseDateStr(this._startDateField.getValue());
	var end = AjxDateUtil.simpleParseDateStr(this._endDateField.getValue());

	var startTime = start.getTime();
	var endTime = end.getTime() + AjxDateUtil.MSEC_PER_DAY;

	// normalize dates
	if (isStartDate && startTime >= endTime) {
		endTime = startTime + AjxDateUtil.MSEC_PER_DAY;
		end = new Date(endTime);
		this._endDateField.setValue(AjxDateUtil.simpleComputeDateStr(end));
	}
	else if (endTime <= startTime) {
		startTime = end.getTime() - AjxDateUtil.MSEC_PER_DAY;
		start = new Date(startTime);
		this._startDateField.setValue(AjxDateUtil.simpleComputeDateStr(start));
	}

	this._timeRangeStart = startTime;
	this._timeRangeEnd = endTime;

	this._updateDateRange(start, end);
	this._updateTitle();

	this._segmentedDates = [];

	this._segmentDates(startTime, endTime);
	this.set((new AjxVector()), null, true); // clear the current list
	this._search();
};

/**
 * Chunks the date range into intervals per the default search period. We do
 * this to avoid taxing the server with a large date range.
 *
 * @param startTime		[String]	start time in ms
 * @param endTime		[String]	end time in ms
 * @private
 */
ZmCalListView.prototype._segmentDates =
function(startTime, endTime) {
	var startPeriod = startTime;
	var endPeriod = startTime + ZmCalListView.DEFAULT_SEARCH_PERIOD;

	// reset back to end time if we're search less than next block (e.g. two weeks)
	if (endPeriod > endTime) {
		endPeriod = endTime;
	}

	do {
		this._segmentedDates.push({startTime: startPeriod, endTime: endPeriod});

		startPeriod += ZmCalListView.DEFAULT_SEARCH_PERIOD;

		var newEndPeriod = endPeriod + ZmCalListView.DEFAULT_SEARCH_PERIOD;
		endPeriod = (newEndPeriod > endTime) ? endTime : newEndPeriod;
	}
	while (startPeriod < endTime);
};

/**
 * Makes a SearchRequest for the first chunk of appointments
 *
 * @private
 */
ZmCalListView.prototype._search =
function() {
	var dates = this._segmentedDates.shift();

	var params = {
		start: dates.startTime,
		end: dates.endTime,
		folderIds: this._controller.getCheckedCalendarFolderIds(),
		callback: (new AjxCallback(this, this._handleSearchResponse)),
		noBusyOverlay: true,
		query: this._controller._userQuery
	};

	this._controller.apptCache.getApptSummaries(params);
};

/**
 * Appends the SearchResponse results to the listview. Attempts to request the
 * next chunk of appointments if the user's scrollbar isn't shown.
 *
 * @param list		[AjxVector]		list returned by ZmApptCache
 * @private
 */
ZmCalListView.prototype._handleSearchResponse =
function(list) {

	this.addItems(list.getArray());
    Dwt.setTitle(this.getTitle());
	// if we have more days to fetch, search again for the next set
	if (this._segmentedDates.length > 0 && this._getItemsNeeded(true) > 0) {
		this._search();
	}
};

/**
 * Method overridden to hnadle action popdown - left it blank coz DwtListView.prototype.handleActionPopdown is clearing
 * the this._rightSelItem.
 *
 * @param	{array}		itemArray		an array of items
 */
ZmCalListView.prototype.handleActionPopdown =
function(ev) {
    //kept empty to avoid clearing of this._rightSelItem.
};

/**
 * Adds the items.
 * The function is overridden to not to show the "No results found" if anything is present in the list.
 *
 * @param	{array}		itemArray		an array of items
 */
ZmCalListView.prototype.addItems =
function(itemArray) {
	if (AjxUtil.isArray(itemArray)) {
		if (!this._list) {
			this._list = new AjxVector();
		}

		// clear the "no results" message before adding!
		if (this._list.size() == 0) {
			this._resetList();
		}

		// Prune the appts before passing to the underlying ListView
		var showDeclined = appCtxt.get(ZmSetting.CAL_SHOW_DECLINED_MEETINGS);
		var filterV = new AjxVector();
		for (var i = 0; i < itemArray.length; i++) {
            var appt = itemArray[i];
            if (showDeclined || (appt.ptst != ZmCalBaseItem.PSTATUS_DECLINED)) {
                filterV.add(appt);
            }
		}

        //Bug fix# 80459. Since ZmCalListView inherits from ZmApptListView, make use of the sorting function and use the sorted list to render
        //By default the list is sorted on date and thereafter we use the changed sort field if any
        this._sortList(filterV, this._defaultSortField);

		this._renderList(filterV, this._list.size() != 0, true);
		this._list.addList(filterV.getArray());
        this._resetColWidth();
        //Does not make sense but required to make the scrollbar appear
        var size = this.getSize();
        this._listDiv.style.height = (size.y - DwtListView.HEADERITEM_HEIGHT)+"px";
	}
};

/**
 * This method gets called when the user scrolls up/down. If there are more
 * appointments to request, it does so.
 *
 * @private
 */
ZmCalListView.prototype._checkItemCount =
function() {
	if (this._segmentedDates.length > 0) {
		this._search();
	}
};

/**
 * Called when the date input field loses focus.
 *
 * @param isStartDate		[Boolean]	If true, the start date field is what changed.
 * @private
 */
ZmCalListView.prototype._onDatesChange =
function(isStartDate) {
	if (this._startDateField instanceof DwtInputField) { // Fix for Bug 103534, called when user modifies date from input field.
		this.validStartEnd();
		this._handleDateChange(isStartDate);
		return;
	}
	if (ZmApptViewHelper.handleDateChange(this._startDateField, this._endDateField, isStartDate)) {
		this._handleDateChange(isStartDate);
	}
};

ZmCalListView.prototype.validStartEnd =  function() {

		var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.getValue());
		var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.getValue());
	    var date = new Date();

			if (startDate == null || isNaN(startDate)) {
				startDate =  date;
				this._startDateField.setValue(AjxDateUtil.simpleComputeDateStr(startDate));
			}

			if (endDate == null || isNaN(endDate)) {
				endDate = date;
				this._endDateField.setValue(AjxDateUtil.simpleComputeDateStr(endDate));
			}

			if((startDate.valueOf() > endDate.valueOf())) {
				this._endDateField.setValue(AjxDateUtil.simpleComputeDateStr(startDate));
			}

};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptDeleteNotifyDialog")) {
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
 * Creates a dialog allowing user to choose between an Instance or Series for an appointment.
 * @constructor
 * @class
 *
 * @author Parag Shah
 * @param {Hash}	params			a hash of parameters
 * @param {DwtComposite}      params.parent			a parent widget (the shell)
 * @param {String}	params.title			a title of dialog
 * @param {String}	params.confirmMsg 	a dialog confirmation message 
 * @param {String}	params.choiceLabel1	a label value for choice 1
 * @param {String}	params.choiceLabel2	a label value for choice 2
 * 
 * @extends	DwtDialog
 */
ZmApptDeleteNotifyDialog = function(params) {

    params = Dwt.getParams(arguments, ZmApptDeleteNotifyDialog.PARAMS);
    var buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON, DwtDialog.CANCEL_BUTTON ];
    DwtDialog.call(this, {parent: params.parent, standardButtons:buttons, id:"CONFIRM_DELETE_APPT_DIALOG"});

    this._choiceLabel1 = params.choiceLabel1;
    this._choiceLabel2 = params.choiceLabel2;
    this._confirmMsg   = params.confirmMsg;
    this._choice2WarningMsg = params.choice2WarningMsg;

	this.setTitle(params.title || AjxMsg.confirmTitle);
	this.setContent(this._setHtml());
	this._cacheFields();
    this.registerCallback(DwtDialog.YES_BUTTON, new AjxCallback(this, this._handleYesButton));
    this.registerCallback(DwtDialog.NO_BUTTON, new AjxCallback(this, this._handleNoButton));
};

ZmApptDeleteNotifyDialog.PARAMS = ["parent", "title", "confirmMsg", "choiceLabel1", "choiceLabel2"];

ZmApptDeleteNotifyDialog.prototype = new DwtDialog;
ZmApptDeleteNotifyDialog.prototype.constructor = ZmApptDeleteNotifyDialog;

// Public methods

ZmApptDeleteNotifyDialog.prototype.toString =
function() {
	return "ZmApptDeleteNotifyDialog";
};

/**
 * Initializes the dialog.
 * 
 * @param	{ZmAppt}	appt		the appointment
 * @param	{String}	attId		the id
 */
ZmApptDeleteNotifyDialog.prototype.initialize =
function(appt, attId) {
	this._appt = appt;
	this._attId = attId;
	this._defaultRadio.checked = true;
};

// helper method - has no use for this dialog
ZmApptDeleteNotifyDialog.prototype.getAppt =
function() {
	return this._appt;
};

// helper method - has no use for this dialog
ZmApptDeleteNotifyDialog.prototype.getAttId =
function() {
	return this._attId;
};

/**
 * Checks if the default option is checked.
 * 
 * @return	{Boolean}	<code>true</code> if the default option is checked
 */
ZmApptDeleteNotifyDialog.prototype.isDefaultOptionChecked =
function() {
	return this._defaultRadio.checked;
};

ZmApptDeleteNotifyDialog.prototype.addSelectionListener =
function(buttonId, listener) {
	this._button[buttonId].addSelectionListener(listener);
};


// Private / protected methods

ZmApptDeleteNotifyDialog.prototype._setHtml =
function() {
    this._confirmMessageDivId = Dwt.getNextId();
	this._defaultRadioId	= Dwt.getNextId();
	this._notifyChoiceName	= Dwt.getNextId();

	var html = new Array();
	var i = 0;

	html[i++] = "<div style='width:300px;' id='";
    html[i++] = this._confirmMessageDivId;
    html[i++] = "'>";
	html[i++] = this._confirmMsg;
	html[i++] = "</div><div style='margin:1em;width:300px;'>";
	html[i++] = "<table role='presentation' class='ZRadioButtonTable'>";
	html[i++] = "<tr><td width=1%><input checked value='1' type='radio' id='";
	html[i++] = this._defaultRadioId;
	html[i++] = "' name='";
	html[i++] = this._notifyChoiceName;
	html[i++] = "'></td><td>";
	html[i++] = "<label for='" + this._defaultRadioId + "'>";
	html[i++] = this._choiceLabel1;
	html[i++] = "</label>";
	html[i++] = "</td></tr>";
	html[i++] = "<tr><td width=1%><input value='2' type='radio' id='";
	html[i++] = this._defaultRadioId + this._notifyChoiceName;
	html[i++] = "' name='";
	html[i++] = this._notifyChoiceName;
	html[i++] = "'></td><td>";
	html[i++] = "<label for='" + this._defaultRadioId + this._notifyChoiceName + "'>"
	html[i++] = this._choiceLabel2;
	html[i++] = "</label>";
	html[i++] = "</td></tr>";
    if (this._choice2WarningMsg) {
        html[i++] = "<tr><td></td><td style='font-style:italic'>" + this._choice2WarningMsg + "</td></tr>";
    }
	html[i++] = "</table></div>";

	return html.join("");
};

ZmApptDeleteNotifyDialog.prototype._cacheFields =
function() {
	this._defaultRadio = document.getElementById(this._defaultRadioId); 		delete this._defaultRadioId;	
};

ZmApptDeleteNotifyDialog.prototype.popup = 
function(yesCallback, noCallback) {

	this._yesCallback = yesCallback;
	this._noCallback = noCallback;

	this.setButtonVisible(DwtDialog.CANCEL_BUTTON, Boolean(noCallback));

	DwtDialog.prototype.popup.call(this);
};

ZmApptDeleteNotifyDialog.prototype._handleYesButton =
function(ev) {
	if (this._yesCallback) this._yesCallback.run(ev);
	this.popdown();
};

ZmApptDeleteNotifyDialog.prototype._handleNoButton =
function(ev) {
	if (this._noCallback) this._noCallback.run(ev);
	this.popdown();
};
}

if (AjxPackage.define("zimbraMail.calendar.view.ZmCalPrintDialog")) {
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
* Simple dialog allowing user to choose between an Instance or Series for an appointment
* @constructor
* @class
*
* @author Santosh Sutar
* @param parent			the element that created this view
* 
* 
* @extends		DwtDialog
* @private
*/
ZmCalPrintDialog = function(params) {

    var print = new DwtDialog_ButtonDescriptor(ZmCalPrintDialog.PRINT_BUTTON, ZmMsg.print, DwtDialog.ALIGN_RIGHT);
    var cancel = new DwtDialog_ButtonDescriptor(ZmCalPrintDialog.PRINT_CANCEL_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT);
    var parent = params.parent || appCtxt.getShell();
	ZmDialog.call(this, {parent:parent, standardButtons:[DwtDialog.NO_BUTTONS], extraButtons: [print, cancel]});

	this.setButtonListener(ZmCalPrintDialog.PRINT_BUTTON, new AjxListener(this, this._printButtonListener));
	this.setButtonListener(ZmCalPrintDialog.PRINT_CANCEL_BUTTON, new AjxListener(this, this._printCancelButtonListener));
    this.setTitle(ZmMsg.printCalendar);
	this.setContent(this._setHtml());
    this._createControls();
    this._setViewOptions();
};

ZmCalPrintDialog.prototype = new ZmDialog;
ZmCalPrintDialog.prototype.constructor = ZmCalPrintDialog;

ZmCalPrintDialog.PRINT_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmCalPrintDialog.PRINT_CANCEL_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmCalPrintDialog.DATE_FORMAT = "yyyyMMddTHHmmss";
ZmCalPrintDialog.TIME_FORMAT = "HH:mm";

// Public methods

ZmCalPrintDialog.prototype.toString =
function() {
	return "ZmCalPrintDialog";
};

ZmCalPrintDialog.prototype.popup =
function(params) {
    //this._keyPressedInField = false; //see comment in _handleKeyUp

	// use reasonable defaults
	params = params || {};

	var treeIds = this._treeIds = (params.treeIds && params.treeIds.length)
		? params.treeIds : [ZmOrganizer.FOLDER];

    //Omit the trash form the tree view
	var omitParam = {};
    omitParam[ZmOrganizer.ID_TRASH] = true;

	var popupParams = {
		treeIds:		treeIds,
		omit:			omitParam,
		fieldId:		this._htmlElId + "_calTreeContainer",
		overviewId:		params.overviewId,
		noRootSelect:	params.noRootSelect,
		treeStyle:		params.treeStyle || DwtTree.SINGLE_STYLE,	// we don't want checkboxes!
		appName:		params.appName,
		selectable:		false,
		forceSingle:	params.forceSingle
	};

	// make sure the requisite packages are loaded
	var treeIdMap = {};
	for (var i = 0; i < treeIds.length; i++) {
		treeIdMap[treeIds[i]] = true;
	}
	var ov = this._setOverview(popupParams, popupParams.forceSingle);
	ZmDialog.prototype.popup.call(this);

    this.currentViewId = params.currentViewId;
    var cv = ZmCalViewController.VIEW_TO_OP[params.currentViewId];
    if(cv == ZmOperation.WORK_WEEK_VIEW) {
        cv = ZmOperation.WEEK_VIEW;
    }
    else if (cv == ZmOperation.FB_VIEW) {
        cv = ZmOperation.DAY_VIEW;
    }
    this._viewSelect.setSelectedValue(cv);
    this._setViewOptions();
    this.setWorkingHours(params.workHours);
    this._selDate.setValue(params.currentDate);
    this._dateRangeFrom.setValue(new Date(params.timeRange.start));
    this._dateRangeTo.setValue(new Date(params.timeRange.end));
    if(ZmId.VIEW_CAL_WORK_WEEK == this.currentViewId) {
        document.getElementById(this._htmlElId + "_workDaysOnly").checked = true;
    }
};

ZmCalPrintDialog.prototype.setWorkingHours =
function(wHrs) {
    var fromTime = new Date(),
        toTime = new Date();
    fromTime.setHours(wHrs.startTime[0]/100, wHrs.startTime[0]%100, 0, 0);
    toTime.setHours(wHrs.endTime[0]/100, wHrs.endTime[0]%100, 0, 0);
    this._fromTimeSelect.set(fromTime);
    this._toTimeSelect.set(toTime);
};

// Private / protected methods

ZmCalPrintDialog.prototype._setHtml =
function() {
	var html = AjxTemplate.expand("calendar.Calendar#PrintDialog", {id: this._htmlElId});
    return html;
};

ZmCalPrintDialog.prototype._createControls =
function() {
    var i,
        op,
        list,
        dateRangeRadio = document.getElementById(this._htmlElId + "_dateRangeRadio"),
        selDateRadio = document.getElementById(this._htmlElId + "_selDateRadio"),
        radioListener = AjxCallback.simpleClosure(this._setSelectedDateRadioListener, this);
    this._selDate = new ZmDateInput(this, this._htmlElId + "_selDate", this._htmlElId + "_selDateContainer");

    this._todayButton = new DwtButton({parent:this, parentElement:this._htmlElId + "_todayButtonContainer"});
    this._todayButton.setText(ZmMsg.today);
    this._todayButton.addSelectionListener(new AjxListener(this, this._setDateToToday))

    this._dateRangeFrom = new ZmDateInput(this, this._htmlElId + "_dateRangeFrom", this._htmlElId + "_dateRangeFromContainer");
    this._dateRangeTo = new ZmDateInput(this, this._htmlElId + "_dateRangeTo", this._htmlElId + "_dateRangeToContainer");

    this._viewSelect = new DwtSelect({parent:this, parentElement:this._htmlElId + "_printViewContainer"});
    list = [
		ZmOperation.DAY_VIEW, ZmOperation.WEEK_VIEW,
		ZmOperation.MONTH_VIEW, ZmOperation.CAL_LIST_VIEW
	];
    for(i=0; i<list.length; i++) {
        op = ZmOperation.defineOperation(list[i]);
        this._viewSelect.addOption(op.text, false, op.id, op.image);
    }

    this._viewSelect.addChangeListener(new AjxListener(this, this._setViewOptions));

    this._fromTimeSelect = new DwtTimeInput(this, DwtTimeInput.START, this._htmlElId + "_fromHoursContainer");
	this._toTimeSelect = new DwtTimeInput(this, DwtTimeInput.END, this._htmlElId + "_toHoursContainer");
    this._printErrorMsgContainer = document.getElementById(this._htmlElId + "_printErrorMsgContainer");

    dateRangeRadio.onclick = radioListener;
    selDateRadio.onclick = radioListener;
};

ZmCalPrintDialog.prototype._setSelectedDateRadioListener =
function(ev) {
    var target = DwtUiEvent.getTarget(ev);
    if(target.id == this._htmlElId + "_selDateRadio") {
        this._setSelectedDateEnabled(true);
    }
    else {
        this._setSelectedDateEnabled(false);
    }
};

ZmCalPrintDialog.prototype._setDateToToday =
function(ev) {
    var d = new Date();
    this._selDate.setValue(d);
};

ZmCalPrintDialog.prototype._setSelectedDateEnabled =
function(enabled) {
    var dateRangeRadio = document.getElementById(this._htmlElId + "_dateRangeRadio"),
        selDateRadio = document.getElementById(this._htmlElId + "_selDateRadio");
    if(enabled) {
        //Disable the date range controls
        this._dateRangeFrom.setEnabled(false);
        this._dateRangeTo.setEnabled(false);
        dateRangeRadio.checked = false;
        //dateRangeRadio.disabled = true;

        //Enable selected date controls
        this._selDate.setEnabled(true);
        this._todayButton.setEnabled(true);
        selDateRadio.checked = true;
        //selDateRadio.disabled = false;
    }
    else {
        //Enable date range controls
        this._dateRangeFrom.setEnabled(true);
        this._dateRangeTo.setEnabled(true);
        dateRangeRadio.checked = true;
        //dateRangeRadio.disabled = false;

        //Disable selected date controls
        this._selDate.setEnabled(false);
        this._todayButton.setEnabled(false);
        selDateRadio.checked = false;
        //selDateRadio.disabled = true;
    }
};

ZmCalPrintDialog.prototype._validateDateTime =
function(ev) {
    var hoursContainer = document.getElementById(this._htmlElId + "_hoursContainer"),
        isValid = false;

    if (this._selDate.getEnabled()) { //If we have choosen "Selected Date"
        isValid = this._selDate.getValue();
    }
    else if (this._dateRangeFrom.getEnabled() &&
        this._dateRangeTo.getEnabled()) {  //If we have choosen "Date Range"
        var startDate = this._dateRangeFrom.getTimeValue();
        var endDate = this._dateRangeTo.getTimeValue();
        isValid = startDate && endDate && endDate >= startDate;
    }

    if(isValid //If either "Selected Date" or "Date Range" is correct then we go for time validation
            && Dwt.getVisible(hoursContainer)) {
        // Fix for bug:103456 - Validating that endTime  is after startTime.
        var startTime = this._fromTimeSelect.getValue();
        var endTime = this._toTimeSelect.getValue();

        if(endTime < startTime) {
            isValid = false;
        }
    }

    if(!isValid) {
        Dwt.setDisplay(this._printErrorMsgContainer, Dwt.DISPLAY_BLOCK);
        this._printErrorMsgContainer.innerHTML = ZmMsg.errorInvalidDates;
    }
    return isValid;
};

ZmCalPrintDialog.prototype._setViewOptions =
function(ev) {
    var val = this._viewSelect.getValue();

    var workDaysOnlyContainer = document.getElementById(this._htmlElId + "_workDaysOnlyContainer");
    var oneWeekPerPageContainer = document.getElementById(this._htmlElId + "_oneWeekPerPageContainer");
    var oneDayPerPageContainer = document.getElementById(this._htmlElId + "_oneDayPerPageContainer");
    var includeMiniCalContainer = document.getElementById(this._htmlElId + "_includeMiniCalContainer");
    var hoursContainer = document.getElementById(this._htmlElId + "_hoursContainer");


    Dwt.setDisplay(includeMiniCalContainer, Dwt.DISPLAY_BLOCK);
    Dwt.setDisplay(hoursContainer, Dwt.DISPLAY_BLOCK);
    this._resetCheckboxes(false);

    switch(val) {
        case ZmOperation.FB_VIEW:
        case ZmOperation.DAY_VIEW:
            Dwt.setDisplay(workDaysOnlyContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(oneWeekPerPageContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(oneDayPerPageContainer, Dwt.DISPLAY_BLOCK);

            this._setSelectedDateEnabled(true);
            break;

        case ZmOperation.WORK_WEEK_VIEW:
        case ZmOperation.WEEK_VIEW:
            Dwt.setDisplay(workDaysOnlyContainer, Dwt.DISPLAY_BLOCK);
            Dwt.setDisplay(oneWeekPerPageContainer, Dwt.DISPLAY_BLOCK);
            Dwt.setDisplay(oneDayPerPageContainer, Dwt.DISPLAY_NONE);

            this._setSelectedDateEnabled(false);
            break;

        case ZmOperation.MONTH_VIEW:
            Dwt.setDisplay(workDaysOnlyContainer, Dwt.DISPLAY_BLOCK);
            Dwt.setDisplay(oneWeekPerPageContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(oneDayPerPageContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(hoursContainer, Dwt.DISPLAY_NONE);

            this._setSelectedDateEnabled(false);
            break;

        case ZmOperation.CAL_LIST_VIEW:
            Dwt.setDisplay(workDaysOnlyContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(oneWeekPerPageContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(oneDayPerPageContainer, Dwt.DISPLAY_NONE);
            Dwt.setDisplay(hoursContainer, Dwt.DISPLAY_NONE);

            this._setSelectedDateEnabled(false);
            break;
    }
};


ZmCalPrintDialog.prototype._printCancelButtonListener =
function() {
    this.popdown();
};

ZmCalPrintDialog.prototype._printButtonListener =
function() {
    if(!this._validateDateTime()) {
        return false;
    }
    var url = this._getPrintOptions();
    this.popdown();
    window.open(url, "_blank");
};

ZmCalPrintDialog.prototype.popdown =
function() {
    Dwt.setDisplay(this._printErrorMsgContainer, Dwt.DISPLAY_NONE);
    this._resetCheckboxes(false);
    DwtDialog.prototype.popdown.call(this);
};

ZmCalPrintDialog.prototype._resetCheckboxes =
function(value) {
    document.getElementById(this._htmlElId + "_workDaysOnly").checked = value;
    document.getElementById(this._htmlElId + "_oneWeekPerPage").checked = value;
    document.getElementById(this._htmlElId + "_oneDayPerPage").checked = value;
    document.getElementById(this._htmlElId + "_includeMiniCal").checked = value;
};

ZmCalPrintDialog.prototype._getPrintViewName =
function(view) {
    var viewStyle;
    switch (view) {
        case ZmId.VIEW_CAL_DAY: 		viewStyle = "day"; break;
        case ZmId.VIEW_CAL_WORK_WEEK:	viewStyle = "workWeek"; break;
        case ZmId.VIEW_CAL_WEEK:		viewStyle = "week"; break;
        case ZmId.VIEW_CAL_LIST:	    viewStyle = "list"; break;
        default:						viewStyle = "month"; break;				// default is month
    }
    return viewStyle;
};

ZmCalPrintDialog.prototype._getPrintOptions =
function() {
    var cals,
        calIds = [],
        treeView,
        i=0,
        j=0,
        params = [],
        printURL = "",
        selDate = this._selDate.getEnabled() ? this._selDate.getValue() : "",
        dateRangeFrom = this._dateRangeFrom.getEnabled() ? this._dateRangeFrom.getValue() : new Date(selDate.getTime()),
        dateRangeTo = this._dateRangeTo.getEnabled() ? this._dateRangeTo.getValue() : new Date(selDate.getTime()),
        fromTime = AjxDateFormat.format(ZmCalPrintDialog.TIME_FORMAT, this._fromTimeSelect.getValue()),
        toTime = AjxDateFormat.format(ZmCalPrintDialog.TIME_FORMAT, this._toTimeSelect.getValue()),
        viewSelected = ZmCalViewController.OP_TO_VIEW[this._viewSelect.getValue()],
        viewStyle = this._getPrintViewName(viewSelected),
        workDaysOnly = document.getElementById(this._htmlElId + "_workDaysOnly").checked,
        oneWeekPerPage = document.getElementById(this._htmlElId + "_oneWeekPerPage").checked,
        oneDayPerPage = document.getElementById(this._htmlElId + "_oneDayPerPage").checked,
        includeMiniCal = document.getElementById(this._htmlElId + "_includeMiniCal").checked,

    //Create the string and pass it to the URL
    treeView = this._opc.getOverview(this._curOverviewId).getTreeView(ZmOrganizer.CALENDAR);
    cals = treeView.getSelected();

    for(j=0; j<cals.length; j++) {
        calIds.push(cals[j].id);
    }

    if(viewSelected == ZmId.VIEW_CAL_MONTH) {
        var endMonthDate = AjxDateUtil._daysPerMonth[dateRangeTo.getMonth()];
        if (dateRangeTo.getMonth() == '1' && !AjxDateUtil.isLeapYear(dateRangeTo.getYear())) {
            //By default,_daysPerMonth sets number of days for Feb as 29.
            //If it's not a leap year, set it to 28.
            endMonthDate = '28';
        }
        dateRangeTo.setDate(endMonthDate);
        dateRangeFrom.setDate(1);
    }
    else if(viewSelected == ZmId.VIEW_CAL_WEEK ||
            viewSelected == ZmId.VIEW_CAL_WORK_WEEK) {
        var fdow = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;
        dateRangeFrom = AjxDateUtil.getFirstDayOfWeek(dateRangeFrom, fdow);
        dateRangeTo = AjxDateUtil.getLastDayOfWeek(dateRangeTo, fdow);
    }

    dateRangeTo.setHours(23, 59, 59, 999);
    dateRangeFrom = AjxDateFormat.format(ZmCalPrintDialog.DATE_FORMAT, dateRangeFrom);
    dateRangeTo = AjxDateFormat.format(ZmCalPrintDialog.DATE_FORMAT, dateRangeTo);

    params[i++] = "/h/printcalendar?";
    params[i++] = "l=";
    params[i++] = calIds.join(',');
    params[i++] = "&origView=";
    params[i++] = this._getPrintViewName(this.currentViewId);
    params[i++] = "&view=";
    params[i++] = viewStyle;
    params[i++] = "&date=";
    params[i++] = dateRangeFrom;
    params[i++] = "&endDate=";
    params[i++] = dateRangeTo;
    params[i++] = "&ft=";
    params[i++] = fromTime;
    params[i++] = "&tt=";
    params[i++] = toTime;
    params[i++] = "&wd=";
    params[i++] = workDaysOnly;
    params[i++] = "&ow=";
    params[i++] = oneWeekPerPage;
    params[i++] = "&od=";
    params[i++] = oneDayPerPage;
    params[i++] = "&imc=";
    params[i++] = includeMiniCal;
    params[i++] = "&wdays=";
    params[i++] = workDaysOnly ? ZmCalPrintDialog.encodeWorkingDays() : "";
    params[i++] = "&tz=";
    params[i++] = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    params[i++] = "&skin=";
    params[i++] = appCurrentSkin;

    printURL = appContextPath + params.join("");
    return printURL;
};

ZmCalPrintDialog.encodeWorkingDays = function () {
    var wHrs = ZmCalBaseView.parseWorkingHours(ZmCalBaseView.getWorkingHours()),
        wDays = [];
    for (var i=0; i<wHrs.length; i++) {
        if(wHrs[i].isWorkingDay) {
            wDays.push(i);
        }
    }
    return wDays.join(",");
};


ZmDateInput = function(parent, id, parentElement) {
	if (arguments.length == 0) return;
	DwtComposite.call(this, {parent:parent, className:"ZmDateInput", parentElement: parentElement});
    this.id = id || Dwt.getNextId();
    this._setHtml(id);
};

ZmDateInput.prototype = new DwtComposite;
ZmDateInput.prototype.constructor = ZmDateInput;

ZmDateInput.prototype.getValue =
function() {
    var date = "";
    if(this.getEnabled()) {
        date = AjxDateUtil.simpleParseDateStr(this._dateInputField.getValue());
        //date.setHours(23, 59, 59, 999);
    }
    return date;
};

ZmDateInput.prototype.getTimeValue =
function() {
    var dateObj = this.getEnabled() && AjxDateUtil.simpleParseDateStr(this._dateInputField.getValue());
    return dateObj ? dateObj.getTime() : null;
};

ZmDateInput.prototype.setValue =
function(date) {
    this._dateInputField.setValue(AjxDateUtil.simpleComputeDateStr(date));
};

ZmDateInput.prototype.setEnabled =
function(enabled) {
    this._dateInputField.setEnabled(enabled);
    this._dateButton.setEnabled(enabled);
};

ZmDateInput.prototype.getEnabled =
function(enabled) {
    return this._dateInputField.getEnabled() && this._dateButton.getEnabled();
};


// Private / protected methods

ZmDateInput.prototype._setHtml =
function(id) {
    var dateButtonListener = new AjxListener(this, this._dateButtonListener),
	    dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);

    this.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Appointment#ApptTimeInput", {id: this._htmlElId});
    this._dateButton = ZmCalendarApp.createMiniCalButton(this.parent, this._htmlElId + "_timeSelectBtn", dateButtonListener, dateCalSelectionListener, id.indexOf("From") > 0 ? ZmMsg.startDate : ZmMsg.endDate);
    this._dateButton.setSize("20");

    //create time select input field
    var params = {
        parent: this,
        parentElement: (this._htmlElId + "_timeSelectInput"),
        type: DwtInputField.STRING,
        errorIconStyle: DwtInputField.ERROR_ICON_NONE,
        validationStyle: DwtInputField.CONTINUAL_VALIDATION,
        inputId: id
    };

    this._dateInputField = new DwtInputField(params);
    var timeInputEl = this._dateInputField.getInputElement();
    Dwt.setSize(timeInputEl, "80px", "2rem");
    timeInputEl.typeId = this.id;
};

ZmDateInput.prototype._dateButtonListener =
function(ev) {
    var cal,
        menu,
        calDate = AjxDateUtil.simpleParseDateStr(this._dateInputField.getValue());

	// if date was input by user and its foobar, reset to today's date
	if (isNaN(calDate)) {
		calDate = new Date();
		this._dateInputField.setValue(AjxDateUtil.simpleComputeDateStr(calDate));
	}

	// always reset the date to current field's date
	menu = ev.item.getMenu();
	cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

ZmDateInput.prototype._dateCalSelectionListener =
function(ev) {
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);
    this._dateInputField.setValue(newDate);

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
}
