if (AjxPackage.define("CalendarAppt")) {
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
 * Package: CalendarAppt
 * 
 * Supports: The Calendar application
 * 
 * Loaded:
 * 	- When the user creates/edits an appointment
 * 	- If the user uses a date object to create an appointment
 * 
 * Any user of this package will need to load CalendarCore first.
 */

// for creating and handling invites

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

if (AjxPackage.define("zimbraMail.calendar.view.ZmCalItemTypeDialog")) {
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
 * Simple dialog allowing user to choose between an Instance or Series for an appointment
 * @constructor
 * @class
 *
 * @author Dan Villiom Podlaski Christiansen
 * @param parent			the element that created this view
 * 
 * @extends		DwtOptionDialog
 * 
 * @private
 */
ZmCalItemTypeDialog = function() {
	var params = Dwt.getParams(arguments, ZmCalItemTypeDialog.PARAMS);

	params.options = [
		{
			name: ZmCalItemTypeDialog.INSTANCE
		},
		{
			name: ZmCalItemTypeDialog.SERIES
		}
	];
	DwtOptionDialog.call(this, params);
};

ZmCalItemTypeDialog.PARAMS = ["parent"];

ZmCalItemTypeDialog.prototype = new DwtOptionDialog;
ZmCalItemTypeDialog.prototype.constructor = ZmCalItemTypeDialog;
ZmCalItemTypeDialog.prototype.isZmCalItemTypeDialog = true;

ZmCalItemTypeDialog.prototype.role = 'alertdialog';

ZmCalItemTypeDialog.INSTANCE = 'INSTANCE';
ZmCalItemTypeDialog.SERIES = 'SERIES';

// Public methods

ZmCalItemTypeDialog.prototype.toString =
function() {
	return "ZmCalItemTypeDialog";
};

ZmCalItemTypeDialog.prototype.initialize =
function(calItem, mode, type) {
	this.calItem = calItem;
	this.mode = mode;

	var m;
	if (type == ZmItem.APPT) {
		m = (calItem instanceof Array)
			? ZmMsg.isRecurringApptList
			: AjxMessageFormat.format(ZmMsg.isRecurringAppt, [AjxStringUtil.htmlEncode(calItem.getName())]);
	} else {
		m = AjxMessageFormat.format(ZmMsg.isRecurringTask, [AjxStringUtil.htmlEncode(calItem.getName())]);
	}

	var title, question, seriesMsg, instanceMsg;

	if (mode == ZmCalItem.MODE_EDIT) {
		title = ZmMsg.openRecurringItem;
		question = m + " " + ZmMsg.editApptQuestion;
		instanceMsg = ZmMsg.openInstance;
		seriesMsg = ZmMsg.openSeries;
	} else if (mode == ZmAppt.MODE_DRAG_OR_SASH) {
		title = ZmMsg.modifyRecurringItem;
		question = m + " " + ZmMsg.modifyApptQuestion;
		instanceMsg = ZmMsg.modifyInstance;
		seriesMsg = ZmMsg.modifySeries;
	} else {
		title = ZmMsg.deleteRecurringItem;
		seriesMsg = ZmMsg.deleteSeries;
		if (calItem instanceof Array) {
			question = m + " " + ZmMsg.deleteApptListQuestion;
			instanceMsg = ZmMsg.deleteInstances;
		} else {
			question = m + " " + ZmMsg.deleteApptQuestion;
			instanceMsg = ZmMsg.deleteInstance;
		}
	}

	this.setMessage(question, null, title);

	this.getButton(ZmCalItemTypeDialog.INSTANCE).setText(instanceMsg);
	this.getButton(ZmCalItemTypeDialog.SERIES).setText(seriesMsg);

	this.setSelection(ZmCalItemTypeDialog.INSTANCE);
};

ZmCalItemTypeDialog.prototype.isInstance =
function() {
	return this.getSelection() === ZmCalItemTypeDialog.INSTANCE;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptComposeView")) {
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
 * Creates a new appointment view. The view does not display itself on construction.
 * @constructor
 * @class
 * This class provides a form for creating/editing appointments. It is a tab view with
 * five tabs: the appt form, a scheduling page, and three pickers (one each for finding
 * attendees, locations, and equipment). The attendee data (people, locations, and
 * equipment are all attendees) is maintained here centrally, since it is presented and
 * can be modified in each of the five tabs.
 *
 * @author Parag Shah
 *
 * @param {DwtShell}	parent			the element that created this view
 * @param {String}	className 		class name for this view
 * @param {ZmCalendarApp}	calApp			a handle to the owning calendar application
 * @param {ZmApptComposeController}	controller		the controller for this view
 * 
 * @extends		DwtTabView
 */
ZmApptComposeView = function(parent, className, calApp, controller) {

	className = className ? className : "ZmApptComposeView";
    var params = {parent:parent, className:className, posStyle:Dwt.ABSOLUTE_STYLE, id:Dwt.getNextId("APPT_COMPOSE_")};
	DwtComposite.call(this, params);

	this.setScrollStyle(DwtControl.CLIP);
	this._app = calApp;
	this._controller = controller;
	
	// centralized date info
	this._dateInfo = {};

	// centralized attendee data
	this._attendees = {};
	this._attendees[ZmCalBaseItem.PERSON]	= new AjxVector();	// list of ZmContact
	this._attendees[ZmCalBaseItem.LOCATION]	= new AjxVector();	// list of ZmResource
	this._attendees[ZmCalBaseItem.EQUIPMENT]= new AjxVector();	// list of ZmResource

	// set of attendee keys (for preventing duplicates)
	this._attendeeKeys = {};
	this._attendeeKeys[ZmCalBaseItem.PERSON]	= {};
	this._attendeeKeys[ZmCalBaseItem.LOCATION]	= {};
	this._attendeeKeys[ZmCalBaseItem.EQUIPMENT]	= {};

	// Email to type map
	this._attendeeType = {};

	// for attendees change events
	this._evt = new ZmEvent(ZmEvent.S_CONTACT);
	this._evtMgr = new AjxEventMgr();
	
	this._initialize();
};

// attendee operations
ZmApptComposeView.MODE_ADD		= 1;
ZmApptComposeView.MODE_REMOVE	= 2;
ZmApptComposeView.MODE_REPLACE	= 3;

ZmApptComposeView.prototype = new DwtComposite;
ZmApptComposeView.prototype.constructor = ZmApptComposeView;

// Consts

// Message dialog placement
ZmApptComposeView.DIALOG_X = 50;
ZmApptComposeView.DIALOG_Y = 100;

//compose mode
ZmApptComposeView.CREATE       = 1;
ZmApptComposeView.EDIT         = 2;
ZmApptComposeView.FORWARD      = 3;
ZmApptComposeView.PROPOSE_TIME = 4;

// Public methods

ZmApptComposeView.prototype.toString = 
function() {
	return "ZmApptComposeView";
};

ZmApptComposeView.prototype.getController =
function() {
	return this._controller;
};

ZmApptComposeView.prototype.set =
function(appt, mode, isDirty) {

    var isForward = false;

    //decides whether appt is being edited/forwarded/proposed new time
    var apptComposeMode = ZmApptComposeView.EDIT;


    //"mode" should always be set to one of ZmCalItem.MODE_EDIT/ZmCalItem.MODE_EDIT_INSTANCE/ZmCalItem.MODE_EDIT_SERIES/ZmCalItem.MODE_NEW
    if(ZmCalItem.FORWARD_MAPPING[mode]) {
        isForward = true;
        this._forwardMode = mode;
        mode = ZmCalItem.FORWARD_MAPPING[mode];
        apptComposeMode = ZmApptComposeView.FORWARD; 
    } else {
        this._forwardMode = undefined;        
    }

    this._proposeNewTime = (mode == ZmCalItem.MODE_PROPOSE_TIME);

    if (this._proposeNewTime) {
        mode = appt.viewMode || ZmCalItem.MODE_EDIT;
        apptComposeMode = ZmApptComposeView.PROPOSE_TIME;
    }

	this._setData = [appt, mode, isDirty];
	this._dateInfo.timezone = appt.getTimezone();
    this._apptEditView.initialize(appt, mode, isDirty, apptComposeMode);
    this._apptEditView.show();

    var editMode = !Boolean(this._forwardMode) && !this._proposeNewTime;
    this._apptEditView.enableInputs(editMode);
    this._apptEditView.enableSubjectField(!this._proposeNewTime);

    var toolbar = this._controller.getToolbar();
    toolbar.enableAll(true);    
    toolbar.enable([ZmOperation.ATTACHMENT], editMode);
};

ZmApptComposeView.prototype.cleanup = 
function() {
	// clear attendees lists
	this._attendees[ZmCalBaseItem.PERSON]		= new AjxVector();
	this._attendees[ZmCalBaseItem.LOCATION]		= new AjxVector();
	this._attendees[ZmCalBaseItem.EQUIPMENT]	= new AjxVector();

	this._attendeeKeys[ZmCalBaseItem.PERSON]	= {};
	this._attendeeKeys[ZmCalBaseItem.LOCATION]	= {};
	this._attendeeKeys[ZmCalBaseItem.EQUIPMENT]	= {};

    this._apptEditView.cleanup();
};

ZmApptComposeView.prototype.preload = 
function() {
    this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
    this._apptEditView.createHtml();
};

ZmApptComposeView.prototype.getComposeMode = 
function() {
	return this._apptEditView.getComposeMode();
};

// Sets the mode the editor should be in.
ZmApptComposeView.prototype.setComposeMode = 
function(composeMode) {
	if (composeMode == Dwt.TEXT ||
		(composeMode == Dwt.HTML && appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED)))
	{
		this._apptEditView.setComposeMode(composeMode);
	}
};

ZmApptComposeView.prototype.reEnableDesignMode = 
function() {
	this._apptEditView.reEnableDesignMode();
};

ZmApptComposeView.prototype.isDirty =
function() {
    //if view is inactive or closed return false
    if(this._controller.inactive) {
        return false;
    }
	//drag and drop changed appts will be dirty even if nothing is changed
	var apptEditView = this._apptEditView;
	if( apptEditView && apptEditView._calItem && apptEditView._calItem.dndUpdate){
			return true;
	}    
    return apptEditView.isDirty();
};

ZmApptComposeView.prototype.isReminderOnlyChanged =
function() {
	return this._apptEditView ? this._apptEditView.isReminderOnlyChanged() : false;
};

ZmApptComposeView.prototype.isValid = 
function() {
    return this._apptEditView.isValid();
};

/**
 * Adds an attachment file upload field to the compose form.
 * 
 */
ZmApptComposeView.prototype.addAttachmentField =
function() {
	this._apptEditView.addAttachmentField();
};

ZmApptComposeView.prototype.getAppt = 
function(attId) {
	return this.getCalItem(attId);
};

ZmApptComposeView.prototype.getCalItem =
function(attId) {
	return this._apptEditView.getCalItem(attId);
};

ZmApptComposeView.prototype.getForwardAddress =
function() {
    return this._apptEditView.getForwardAddress();
};

ZmApptComposeView.prototype.gotNewAttachments =
function() {
    return this._apptEditView.gotNewAttachments();
};

ZmApptComposeView.prototype.getHtmlEditor =
function() {
	return this._apptEditView.getHtmlEditor();
};

ZmApptComposeView.prototype.getNumLocationConflictRecurrence =
function() {
    return this._apptEditView.getNumLocationConflictRecurrence();
}

ZmApptComposeView.prototype.cancelLocationRequest =
function() {
    return this._apptEditView.cancelLocationRequest();
}

ZmApptComposeView.prototype.setLocationConflictCallback =
function(locationConflictCallback) {
    this._locationConflictCallback   = locationConflictCallback;
};

/**
 * Updates the set of attendees for this appointment, by adding attendees or by
 * replacing the current list (with a clone of the one passed in).
 *
 * @param attendees	[object]		attendee(s) as string, array, or AjxVector
 * @param type		[constant]		attendee type (attendee/location/equipment)
 * @param mode		[constant]*		replace (default) or add
 * @param index		[int]*			index at which to add attendee
 * 
 * @private
 */
ZmApptComposeView.prototype.updateAttendees =
function(attendees, type, mode, index) {
	attendees = (attendees instanceof AjxVector) ? attendees.getArray() :
				(attendees instanceof Array) ? attendees : [attendees];
	mode = mode || ZmApptComposeView.MODE_REPLACE;
	// Note whether any of the attendees changed.  Needed to decide
	// for Locations whether or not to check for conflicts
	var changed = false;
	var key;
	if (mode == ZmApptComposeView.MODE_REPLACE) {
		this._attendees[type] = new AjxVector();
		var oldKeys = this._attendeeKeys[type];
		this._attendeeKeys[type] = {};
		for (var i = 0; i < attendees.length; i++) {
			var attendee = attendees[i];
			this._attendees[type].add(attendee);
			key = this._addAttendeeKey(attendee, type);
			this._attendeeType[key] = type;
			if (key && !oldKeys[key]) {
				// New key that was not in the old set
				changed = true;
			}
		}
		if ((type == ZmCalBaseItem.LOCATION) && this._locationConflictCallback) {
			for (key in oldKeys) {
				if (key && !this._attendeeKeys[type][key]) {
					// Old location key that is not in the new set
					changed = true;
					break;
				}
			}
		}
	} else if (mode == ZmApptComposeView.MODE_ADD) {
		for (var i = 0; i < attendees.length; i++) {
			var attendee = attendees[i];
			key = this._getAttendeeKey(attendee);
			this._attendeeType[key] = type;
			if (!this._attendeeKeys[type][key] === true) {
				this._attendees[type].add(attendee, index);
				this._addAttendeeKey(attendee, type);
				changed = true;
			}
		}
	} else if (mode == ZmApptComposeView.MODE_REMOVE) {
		for (var i = 0; i < attendees.length; i++) {
			var attendee = attendees[i];
			key = this._removeAttendeeKey(attendee, type);
			delete this._attendeeType[key];
			this._attendees[type].remove(attendee);
			if (key) {
				changed = true;
			}
		}
	}

    if (changed && (type == ZmCalBaseItem.LOCATION) && this._locationConflictCallback) {
        this._locationConflictCallback.run(this._attendees[ZmCalBaseItem.LOCATION]);
    }
};


ZmApptComposeView.prototype.setApptMessage =
function(msg){
    this._apptEditView.setApptMessage(msg);  
};

ZmApptComposeView.prototype.isAttendeesEmpty =
function() {
    return this._apptEditView.isAttendeesEmpty();
};

ZmApptComposeView.prototype.isOrganizer =
function() {
    return this._apptEditView.isOrganizer();
};

ZmApptComposeView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, ZmMsg.appointment].join(": ");
};

ZmApptComposeView.prototype._getAttendeeKey =
function(attendee) {
	var email = attendee.getLookupEmail() || attendee.getEmail();
	var name = attendee.getFullName();
	return email ? email : name;
};

ZmApptComposeView.prototype._addAttendeeKey =
function(attendee, type) {
	var key = this._getAttendeeKey(attendee);
	if (key) {
		this._attendeeKeys[type][key] = true;
	}
	return key;
};

ZmApptComposeView.prototype._removeAttendeeKey =
function(attendee, type) {
	var key = this._getAttendeeKey(attendee);
	if (key) {
		delete this._attendeeKeys[type][key];
	}
	return key;
};

ZmApptComposeView.prototype.getAttendeeType =
function(email) {
    return this._attendeeType[email];
}

/**
* Adds a change listener.
*
* @param {AjxListener}	listener	a listener
*/
ZmApptComposeView.prototype.addChangeListener = 
function(listener) {
	return this._evtMgr.addListener(ZmEvent.L_MODIFY, listener);
};

/**
* Removes the given change listener.
*
* @param {AjxListener}	listener	a listener
*/
ZmApptComposeView.prototype.removeChangeListener = 
function(listener) {
	return this._evtMgr.removeListener(ZmEvent.L_MODIFY, listener);    	
};

ZmApptComposeView.prototype.showErrorMessage = 
function(msg, style, cb, cbObj, cbArgs) {
	var msgDialog = appCtxt.getMsgDialog();
	msgDialog.reset();
	style = style ? style : DwtMessageDialog.CRITICAL_STYLE
	msgDialog.setMessage(msg, style);
	msgDialog.popup(this._getDialogXY());
    msgDialog.registerCallback(DwtDialog.OK_BUTTON, cb, cbObj, cbArgs);
};

ZmApptComposeView.prototype.showInvalidDurationMsg =
function(msg, style, cb, cbObj, cbArgs) {
        var msgDlg = appCtxt.getMsgDialog(true);
        msgDlg.setMessage(ZmMsg.timezoneConflictMsg,DwtMessageDialog.WARNING_STYLE);
        msgDlg.setTitle(ZmMsg.timezoneConflictTitle);
        msgDlg.popup();
}
ZmApptComposeView.prototype.showInvalidDurationRecurrenceMsg =
	function() {
		var msgDlg = appCtxt.getMsgDialog(true);
		msgDlg.setMessage(ZmMsg.durationRecurrenceError, DwtMessageDialog.WARNING_STYLE);
		msgDlg.setTitle(ZmMsg.durationRecurrenceErrorTitle);
		msgDlg.popup();
	}

// Private / Protected methods

ZmApptComposeView.prototype._initialize =
function() {
    this._apptEditView = new ZmApptEditView(this, this._attendees, this._controller, this._dateInfo);
	this._apptEditView.addRepeatChangeListener(new AjxListener(this, this._repeatChangeListener));
	this.addControlListener(new AjxListener(this, this._controlListener));

	// make the appointment edit view take up the full size of this view
	var bounds = this.getInsetBounds();
	this._apptEditView.setSize(bounds.width, bounds.height);
};

ZmApptComposeView.prototype.getApptEditView =
function() {
    return this._apptEditView;
};

ZmApptComposeView.prototype.getAttendees =
function(type) {
    return this._attendees[type];
};

ZmApptComposeView.prototype._repeatChangeListener =
function(ev) {

};

// Consistent spot to locate various dialogs
ZmApptComposeView.prototype._getDialogXY =
function() {
	var loc = Dwt.toWindow(this.getHtmlElement(), 0, 0);
	return new DwtPoint(loc.x + ZmApptComposeView.DIALOG_X, loc.y + ZmApptComposeView.DIALOG_Y);
};

// Listeners

ZmApptComposeView.prototype._controlListener =
function(ev) {
	if (ev && ev.type === DwtControlEvent.RESIZE) {
	    // make the appointment edit view take up the full size of this view
	    var bounds = this.getInsetBounds();
	    this._apptEditView.setSize(bounds.width, bounds.height);
	}
};

ZmApptComposeView.prototype.deactivate =
function() {
	this._controller.inactive = true;

    //clear the free busy cache if the last tabbed compose view session is closed
    //var activeComposeSesions = this._app.getNumSessionControllers(ZmId.VIEW_APPOINTMENT);
    //if(activeComposeSesions == 0) this._app.getFreeBusyCache().clearCache();

};

ZmApptComposeView.prototype.checkIsDirty =
function(type, attribs){
    return this._apptEditView.checkIsDirty(type, attribs);  
};

ZmApptComposeView.prototype.areRecurringChangesDirty = function() {
    return this._apptEditView.areRecurringChangesDirty();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptEditView")) {
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
 * This is the main screen for creating/editing an appointment. It provides
 * inputs for the various appointment details.
 *
 * @author Parag Shah
 *
 * @param {DwtControl}	parent			some container
 * @param {Hash}	attendees			attendees/locations/equipment
 * @param {Object}	dateInfo			a hash of date info
 * @param {ZmController}	controller		the compose controller for this view
 * 
 * @extends		ZmCalItemEditView
 * 
 * @private
 */
ZmApptEditView = function(parent, attendees, controller, dateInfo) {

	var idParams = {
		skinComponent:  ZmId.SKIN_APP_MAIN,
		app:            ZmId.APP_CALENDAR,
		componentType:  ZmId.WIDGET_VIEW,
		componentName:  ZmId.VIEW_APPOINTMENT
	};

	var domId = ZmId.create(idParams, "An appointment editing view");

	ZmCalItemEditView.call(this, parent, attendees, controller, dateInfo, null, "ZmApptEditView", domId);

	// cache so we dont keep calling appCtxt
	this.GROUP_CALENDAR_ENABLED = appCtxt.get(ZmSetting.GROUP_CALENDAR_ENABLED);

	this._attTypes = [];
	if (this.GROUP_CALENDAR_ENABLED) {
		this._attTypes.push(ZmCalBaseItem.PERSON);
	}
	this._attTypes.push(ZmCalBaseItem.LOCATION);
	if (appCtxt.get(ZmSetting.GAL_ENABLED) && this.GROUP_CALENDAR_ENABLED) {
		this._attTypes.push(ZmCalBaseItem.EQUIPMENT);
	}
    this._locationTextMap = {};
    this._attendeePicker = {};
    this._pickerButton = {};

    //used to preserve original attendees while forwarding appt
    this._fwdApptOrigAttendees = [];
    this._attendeesHashMap = {};

    // Store Appt form values.
    this._apptFormValue = {};
    this._showAsValueChanged  = false;

    this._locationExceptions  = null;
    this._alteredLocations    = null;
    this._enableResolveDialog = true;

    this._locationConflict    = false;
    this._locationStatusMode = ZmApptEditView.LOCATION_STATUS_NONE;

    var app = appCtxt.getApp(ZmApp.CALENDAR);
    // Each ApptEditView must now have its own copy of the FreeBusyCache.  The cache will
    // now hold FreeBusy info that is unique to an appointment, in that the Server provides
    // Free busy info that excludes the current appointment.  So the cache information cannot
    // be shared across appointments.
    //this._fbCache = app.getFreeBusyCache();
    AjxDispatcher.require(["MailCore", "CalendarCore"]);
    this._fbCache = new ZmFreeBusyCache(app);

    this._customRecurDialogCallback = this._recurChangeForLocationConflict.bind(this);
};

ZmApptEditView.prototype = new ZmCalItemEditView;
ZmApptEditView.prototype.constructor = ZmApptEditView;

// Consts


ZmApptEditView.PRIVACY_OPTION_PUBLIC = "PUB";
ZmApptEditView.PRIVACY_OPTION_PRIVATE = "PRI";

ZmApptEditView.PRIVACY_OPTIONS = [
	{ label: ZmMsg._public,				value: "PUB",	selected: true	},
	{ label: ZmMsg._private,			value: "PRI"					}
//	{ label: ZmMsg.confidential,		value: "CON"					}		// see bug #21205
];

ZmApptEditView.BAD						= "_bad_addrs_";

ZmApptEditView.REMINDER_MAX_VALUE		= {};
ZmApptEditView.REMINDER_MAX_VALUE[ZmCalItem.REMINDER_UNIT_DAYS]		    = 14;
ZmApptEditView.REMINDER_MAX_VALUE[ZmCalItem.REMINDER_UNIT_MINUTES]		= 20160;
ZmApptEditView.REMINDER_MAX_VALUE[ZmCalItem.REMINDER_UNIT_HOURS]		= 336;
ZmApptEditView.REMINDER_MAX_VALUE[ZmCalItem.REMINDER_UNIT_WEEKS]		= 2;

ZmApptEditView.TIMEZONE_TYPE = "TZ_TYPE";

ZmApptEditView.START_TIMEZONE = 1;
ZmApptEditView.END_TIMEZONE = 2;

ZmApptEditView.LOCATION_STATUS_UNDEFINED  = -1;
ZmApptEditView.LOCATION_STATUS_NONE       =  0;
ZmApptEditView.LOCATION_STATUS_VALIDATING =  1;
ZmApptEditView.LOCATION_STATUS_CONFLICT   =  2;
ZmApptEditView.LOCATION_STATUS_RESOLVED   =  3;


// Public Methods

ZmApptEditView.prototype.toString =
function() {
	return "ZmApptEditView";
};

ZmApptEditView.prototype.isLocationConflictEnabled =
function() {
    return ((this._mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) &&
            !this._isForward && !this._isProposeTime &&
             this.getRepeatType() != "NON");
}

ZmApptEditView.prototype.getFreeBusyCache =
function() {
    return this._fbCache;
}


ZmLocationAppt = function() { };
ZmLocationRecurrence = function() { };

ZmApptEditView.prototype.show =
function() {
	ZmCalItemEditView.prototype.show.call(this);

    if (this.parent.setLocationConflictCallback) {
        var appt = this.parent.getAppt();
        this.initializeLocationConflictCheck(appt);
    }

    Dwt.setVisible(this._attendeeStatus, false);
    Dwt.setVisible(this._suggestTime, !this._isForward);
    Dwt.setVisible(this._suggestLocation, !this._isForward && !this._isProposeTime && appCtxt.get(ZmSetting.GAL_ENABLED));
    this._scheduleAssistant.close();

    if(!this.GROUP_CALENDAR_ENABLED) {
        this.setSchedulerVisibility(false);
    }

    if (!appCtxt.get(ZmSetting.GAL_ENABLED)) {
        Dwt.setSize(this._attInputField[ZmCalBaseItem.LOCATION]._input, "100%");
    }

    //bug:48189 Hide schedule tab for non-ZCS acct
    if (appCtxt.isOffline) {
        var currAcct = appCtxt.getActiveAccount();
        this.setSchedulerVisibility(currAcct.isZimbraAccount && !currAcct.isMain);
    }

    this._editViewInitialized = true;
    if(this._expandInlineScheduler) {
        this._pickAttendeesInfo(ZmCalBaseItem.PERSON);
        this._pickAttendeesInfo(ZmCalBaseItem.LOCATION);
    }

    this.resize();
};

ZmApptEditView.prototype.initializeLocationConflictCheck =
function(appt) {
    // Create a 'Location-only' clone of the appt, for use with the
    // resource conflict calls
    ZmLocationAppt.prototype = appt;
    ZmLocationRecurrence.prototype = appt.getRecurrence();
    this._locationConflictAppt = new ZmLocationAppt();
    this._locationConflictAppt._recurrence = new ZmLocationRecurrence();
    this._locationConflictAppt._attendees[ZmCalBaseItem.LOCATION] =
        appt._attendees[ZmCalBaseItem.LOCATION];
    this._locationConflictAppt._attendees[ZmCalBaseItem.PERSON]	  = [];
    this._locationConflictAppt._attendees[ZmCalBaseItem.EQUIPMENT]= [];

    this._processLocationCallback = this.processLocationConflicts.bind(this);
    this._noLocationCallback =
        this.setLocationStatus.bind(this, ZmApptEditView.LOCATION_STATUS_NONE);
    this.parent.setLocationConflictCallback(this.updatedLocationsConflictChecker.bind(this));

    this._getRecurrenceSearchResponseCallback =
        this._getExceptionSearchResponse.bind(this, this._locationConflictAppt);
    this._getRecurrenceSearchErrorCallback =
        this._getExceptionSearchError.bind(this, this._locationConflictAppt);

    if (!this._pendingLocationRequest &&
         this._scheduleAssistant && this._scheduleAssistant.isInitialized()) {
        // Trigger an initial location check - the appt may have been saved
        // with a location that has conflicts.  Only do it if no pending
        // request and the assistant is initialized (location preferences
        // are loaded). If !initialized, the locationConflictChecker will
        // be run when preferences are loaded.
        this.locationConflictChecker();
    }
}

ZmApptEditView.prototype.cancelLocationRequest =
function() {
    if (this._pendingLocationRequest) {
        appCtxt.getRequestMgr().cancelRequest(this._pendingLocationRequest, null, true);
        this._pendingLocationRequest = null;
    }
}

ZmApptEditView.prototype.locationConflictChecker =
function() {
    // Cancel any pending requests
    this.cancelLocationRequest();
    if (this.isLocationConflictEnabled() &&
        this._locationConflictAppt.hasAttendeeForType(ZmCalBaseItem.LOCATION)) {
        // Send a request to the server to get location conflicts

        // DISABLED until Bug 56464 completed - server side CreateAppointment/ModifyAppointment
        // SOAP API changes.  When done, add code in ZmCalItemComposeController to add the
        // altered locations as a list of exceptions to the SOAP call.
        //if (this._apptExceptionList) {
        //    this._runLocationConflictChecker();
        //} else {
        //    // Get the existing exceptions, then runLocationConflictChecker
        //    this._doExceptionSearchRequest();
        //}

        // Once bug 56464 completed, remove the following and enable the disabled code above
        this._runLocationConflictChecker();

    } else {
        if (this._noLocationCallback) {
            // Restore the 'Suggest Location' line to its default
            this._noLocationCallback.run();
        }
    }
}

ZmApptEditView.prototype.updatedLocationsConflictChecker =
function(locations){
    // Update locations in the appt clone, then run the conflict checker
    this._locationConflictAppt.setAttendees(locations.getArray(), ZmCalBaseItem.LOCATION);
    this.locationConflictChecker();
}

ZmApptEditView.prototype.getNumLocationConflictRecurrence =
function() {
    var numRecurrence = ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE;
    if (this._scheduleAssistant) {
        numRecurrence = this._scheduleAssistant.getLocationConflictNumRecurrence();
    }
    return numRecurrence;
}

ZmApptEditView.prototype._runLocationConflictChecker =
function() {
    var numRecurrence = this.getNumLocationConflictRecurrence();
    var locationCallback = this._controller.getCheckResourceConflicts(
        this._locationConflictAppt, numRecurrence, this._processLocationCallback, false);
    this.setLocationStatus(ZmApptEditView.LOCATION_STATUS_VALIDATING);
    this._pendingLocationRequest = locationCallback.run();
}


ZmApptEditView.prototype._doExceptionSearchRequest =
function() {
    var numRecurrence = this.getNumLocationConflictRecurrence();
    var startDate = new Date(this._calItem.startDate);
    var endTime = ZmApptComposeController.getCheckResourceConflictEndTime(
        this._locationConflictAppt, startDate, numRecurrence);

    var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
    var request = jsonObj.SearchRequest;

    request.sortBy = "dateasc";
    request.limit = numRecurrence.toString();
    // AjxEnv.DEFAULT_LOCALE is set to the browser's locale setting in the case
    // when the user's (or their COS) locale is not set.
    request.locale = { _content: AjxEnv.DEFAULT_LOCALE };
    request.calExpandInstStart = startDate.getTime();
    request.calExpandInstEnd   = endTime;
    request.types = ZmSearch.TYPE[ZmItem.APPT];
    request.query = {_content:'item:"' + this._calItem.id.toString() + '"'};
    var accountName = appCtxt.multiAccounts ? appCtxt.accountList.mainAccount.name : null;

    var params = {
        jsonObj:       jsonObj,
        asyncMode:     true,
        callback:      this._getExceptionSearchResponse.bind(this),
        errorCallback: this._getExceptionSearchError.bind(this),
        noBusyOverlay: true,
        accountName:   accountName
    };
    appCtxt.getAppController().sendRequest(params);
}

ZmApptEditView.prototype._getExceptionSearchResponse =
function(result) {
	if (!result) { return; }

	var resp;
    var appt;
	try {
		resp = result.getResponse();
	} catch (ex) {
		return;
	}

    // See ZmApptCache.prototype.processSearchResponse
    var rawAppts = resp.SearchResponse.appt;
    this._apptExceptionList = new ZmApptList();
    this._apptExceptionList.loadFromSummaryJs(rawAppts);
    this._apptExceptionLookup = {};

    this._locationExceptions = {}
    for (var i = 0; i < this._apptExceptionList.size(); i++) {
        appt = this._apptExceptionList.get(i);
        this._apptExceptionLookup[appt.startDate.getTime()] = appt;
        if (appt.isException) {
            // Found an exception, store its location info, using its start date as the key
            var location = appt._attendees[ZmCalBaseItem.LOCATION];
            if (!location || (location.length == 0)) {
                location = this.getAttendeesFromString(ZmCalBaseItem.LOCATION, appt.location, false);
                location = location.getArray();
            }
            this._locationExceptions[appt.startDate.getTime()] = location;
        }
    }
    this._enableResolveDialog = true;

    // Now find the conflicts
    this._runLocationConflictChecker();
};

ZmApptEditView.prototype._getExceptionSearchError =
function(ex) {
    // Disallow use of the resolve dialog if can't read the exceptions
    this._enableResolveDialog = false;
}

// Callback executed when the CheckResourceConflictRequest completes.
// Store the conflict instances (if any) and update the status field
ZmApptEditView.prototype.processLocationConflicts =
function(inst) {
    this._inst = inst;
    var len = inst ? inst.length : 0,
    locationStatus = ZmApptEditView.LOCATION_STATUS_NONE;
    for (var i = 0; i < len; i++) {
        if (this._inst[i].usr) {
            // Conflict exists for this instance
            if (this._locationExceptions && this._locationExceptions[this._inst[i].s]) {
                // Assume that an existing exception (either persisted to the DB, or set via
                // the current use of the resolve dialog) means that the instance conflict is resolved
                locationStatus = ZmApptEditView.LOCATION_STATUS_RESOLVED;
            } else {
                // No exception for the instance, using default location which has a conflict
                locationStatus = ZmApptEditView.LOCATION_STATUS_CONFLICT;
                break;
            }
        }
    }

    this.setLocationStatus(locationStatus);
}

ZmApptEditView.prototype.setLocationStatus =
function(locationStatus, currentLocationConflict) {
    var className = "";
    var statusMessage = "";
    var linkMessage = "";
    var msgVisible = false;
    var linkVisible = false;
    var statusText = "";

    if (locationStatus != ZmApptEditView.LOCATION_STATUS_UNDEFINED) {
        this._locationStatusMode = locationStatus;
    }
    if (currentLocationConflict !== undefined) {
        this._locationConflict  = currentLocationConflict;
    }

    // Manage the location suggestion line beneath the location field.
    switch (this._locationStatusMode) {
        case ZmApptEditView.LOCATION_STATUS_NONE:
             // No recurrence conflicts or nothing to check - display based on current conflict flag
             if (this._locationConflict) {
                 statusMessage = AjxImg.getImageHtml("Warning_12", "display:inline-block;padding-right:4px;") +
                                 ZmMsg.locationCurrentConflicts;
                 className     = "ZmLocationStatusConflict";
                 msgVisible    = true;
             } else {
                 msgVisible    = false;
             }
             break;
        case ZmApptEditView.LOCATION_STATUS_VALIDATING:
             // The conflict resource check is in progress, show a busy spinner
             className     = "ZmLocationStatusValidating";
             // Don't incorporate currentConflict flag - just show validating; It will update upon completion
             statusMessage = AjxImg.getImageHtml("Wait_16", "display:inline-block;padding-right:4px;") +
                             ZmMsg.validateLocation;
             msgVisible    = true;
             linkVisible   = false;
             break;
        case ZmApptEditView.LOCATION_STATUS_CONFLICT:
             // Unresolved recurrence conflicts - show the 'Resolve Conflicts' link
             className     = "ZmLocationStatusConflict";
             statusText    = this._locationConflict ? ZmMsg.locationCurrentAndRecurrenceConflicts :
                                                      ZmMsg.locationRecurrenceConflicts;
             statusMessage = AjxImg.getImageHtml("Warning_12", "display:inline-block;padding-right:4px;") +
                             statusText;
             linkMessage   = ZmMsg.resolveConflicts;
             msgVisible    = true;
             linkVisible   = true;
             break;
        case ZmApptEditView.LOCATION_STATUS_RESOLVED:
             // Resolved conflicts - show the 'View Resolutions' link
             className     = "ZmLocationStatusResolved";
             statusMessage = this._locationConflict ? ZmMsg.locationRecurrenceResolvedButCurrentConflict :
                             ZmMsg.locationRecurrenceConflictsResolved;
             linkMessage   = ZmMsg.viewResolutions;
             msgVisible    = true;
             linkVisible   = true;
             break;
        default: break;
    }

    Dwt.setVisible(this._locationStatus, msgVisible);
    if (!this._enableResolveDialog) {
        // Unable to read the exeptions, prevent the use of the resolve dialog
        linkVisible = false;
    }

    // NOTE: Once CreateAppt/ModifyAppt SOAP API changes are completed (Bug 56464), enable
    //       the display of the resolve links and the use of the resolve dialog
    // *** NOT DONE ***
    linkVisible = false;

    Dwt.setVisible(this._locationStatusAction, linkVisible);
    Dwt.setInnerHtml(this._locationStatus, statusMessage);
    Dwt.setInnerHtml(this._locationStatusAction, linkMessage);
    this._locationStatus.className = className;
}

ZmApptEditView.prototype.blur =
function(useException) {
	if (this._activeInputField) {
		this._handleAttendeeField(this._activeInputField, useException);
		// bug: 15251 - to avoid race condition, active field will anyway be
		// cleared by onblur handler for input field this._activeInputField = null;
	}
};

ZmApptEditView.prototype.cleanup =
function() {
	ZmCalItemEditView.prototype.cleanup.call(this);


    this._attendeesInputField.clear();
    this._optAttendeesInputField.clear();
    this._forwardToField.clear();

    this._attInputField[ZmCalBaseItem.LOCATION].clear();
	this._locationTextMap = {};

	if (this._resourcesContainer) {
        this.showResourceField(false);
        this._resourceInputField.clear();
        this._resourcesShown = false;
	}

	this._allDayCheckbox.checked = false;
	this._showTimeFields(true);
	this._isKnownLocation = false;

	// reset autocomplete lists
	if (this._acContactsList) {
		this._acContactsList.reset();
		this._acContactsList.show(false);
	}
	if (this._acLocationsList) {
		this._acLocationsList.reset();
		this._acLocationsList.show(false);
	}

	if (this.GROUP_CALENDAR_ENABLED) {
		for (var attType in this._attInputField) {
			this._attInputField[attType].clear();
		}
	}

    this._attendeesHashMap = {};
    this._showAsValueChanged = false;

    Dwt.setVisible(this._attendeeStatus, false);
    this.setLocationStatus(ZmApptEditView.LOCATION_STATUS_NONE, false);

    //Default Persona
    this.setIdentity();
    if(this._scheduleAssistant) this._scheduleAssistant.cleanup();

    this._apptExceptionList  = null;
    this._locationExceptions = null;
    this._alteredLocations   = null;

};

// Acceptable hack needed to prevent cursor from bleeding thru higher z-index'd views
ZmApptEditView.prototype.enableInputs =
function(bEnableInputs) {
	ZmCalItemEditView.prototype.enableInputs.call(this, bEnableInputs);
	if (this.GROUP_CALENDAR_ENABLED) {
		var bEnableAttendees = bEnableInputs;
		if (appCtxt.isOffline && bEnableAttendees &&
			this._calItem && this._calItem.getFolder().getAccount().isMain)
		{
			bEnableAttendees = false;
		}
		this._attendeesInputField.setEnabled(bEnableAttendees);
		this._optAttendeesInputField.setEnabled(bEnableAttendees);
		this._locationInputField.setEnabled(bEnableAttendees); //this was a small bug - the text field of that was not disabled!
        this.enablePickers(bEnableAttendees);
	}else {
        //bug 57083 - disabling group calendar should disable attendee pickers
        this.enablePickers(false);
    }
	this._attInputField[ZmCalBaseItem.LOCATION].setEnabled(bEnableInputs);
};

ZmApptEditView.prototype.isOrganizer =
function() {
    return Boolean(this._isOrganizer);
};

ZmApptEditView.prototype.enablePickers =
function(bEnablePicker) {
    for (var t = 0; t < this._attTypes.length; t++) {
        var type = this._attTypes[t];
        if(this._pickerButton[type]) this._pickerButton[type].setEnabled(bEnablePicker);
    }

    if(this._pickerButton[ZmCalBaseItem.OPTIONAL_PERSON]) this._pickerButton[ZmCalBaseItem.OPTIONAL_PERSON].setEnabled(bEnablePicker);

};

ZmApptEditView.prototype.isValid =
function() {
	var errorMsg = [];

	// check for required subject
	var subj = AjxStringUtil.trim(this._subjectField.getValue());

    //bug: 49990 subject can be empty while proposing new time
	if ((subj && subj.length) || this._isProposeTime) {
		var allDay = this._allDayCheckbox.checked;
		if (!DwtTimeInput.validStartEnd(this._startDateField, this._endDateField, (allDay ? null : this._startTimeSelect), (allDay ? null : this._endTimeSelect))) {
				errorMsg.push(ZmMsg.errorInvalidDates);
		}

	} else {
		errorMsg.push(ZmMsg.errorMissingSubject);
	}
    if (this._reminderSelectInput) {
        var reminderString = this._reminderSelectInput.getValue();
        var reminderInfo = ZmCalendarApp.parseReminderString(reminderString);
        if (reminderInfo.reminderValue > ZmApptEditView.REMINDER_MAX_VALUE[reminderInfo.reminderUnits]) {
            errorMsg.push(ZmMsg.errorInvalidReminderValue);
        }
    }

    var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
    if (startDate && startDate.getFullYear() < 1900) {
        errorMsg.push(ZmMsg.errorInvalidStartDate);
    }

	if (errorMsg.length > 0) {
		throw errorMsg.join("<br>");
	}

	return true;
};

// called by schedule tab view when user changes start date field
ZmApptEditView.prototype.updateDateField =
function(newStartDate, newEndDate) {
	var oldTimeInfo = this._getDateTimeText();

	this._startDateField.value = newStartDate;
	this._endDateField.value = newEndDate;

	this._dateTimeChangeForLocationConflict(oldTimeInfo);
};

ZmApptEditView.prototype.updateAllDayField =
function(isAllDay) {
	var oldAllDay = this._allDayCheckbox.checked;
	this._allDayCheckbox.checked = isAllDay;
	this._showTimeFields(!isAllDay);
	if (oldAllDay != isAllDay) {
		var durationInfo = this.getDurationInfo();
		this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
		this._locationConflictAppt.endDate = new Date(durationInfo.endTime);
		this._locationConflictAppt.allDayEvent = isAllDay ? "1" : "0";
		this.locationConflictChecker();
	}
};

ZmApptEditView.prototype.toggleAllDayField =
function() {
	this.updateAllDayField(!this._allDayCheckbox.checked);
};

ZmApptEditView.prototype.updateShowAsField =
function(isAllDay) {
    if(!this._showAsValueChanged) {
        if(isAllDay) {
            this._showAsSelect.setSelectedValue("F");
        }
        else {
            this._showAsSelect.setSelectedValue("B");
        }
    }
};

ZmApptEditView.prototype.setShowAsFlag =
function(flag) {
    this._showAsValueChanged = flag;
};

ZmApptEditView.prototype.updateTimeField =
function(dateInfo) {
     this._startTimeSelect.setValue(dateInfo.startTimeStr);
     this._endTimeSelect.setValue(dateInfo.endTimeStr);
};


ZmApptEditView.prototype.setDate =
function(startDate, endDate, ignoreTimeUpdate) {
    var oldTimeInfo = this._getDateTimeText();
    this._startDateField.value = AjxDateUtil.simpleComputeDateStr(startDate);
    this._endDateField.value = AjxDateUtil.simpleComputeDateStr(endDate);
    if(!ignoreTimeUpdate) {
        this._startTimeSelect.set(startDate);
        this._endTimeSelect.set(endDate);
    }

    if(this._schedulerOpened) {
        this._scheduleView.handleTimeChange();
    }
    appCtxt.notifyZimlets("onEditAppt_updateTime", [this, {startDate:startDate, endDate:endDate}]);//notify Zimlets    

    this._dateTimeChangeForLocationConflict(oldTimeInfo);
};

// ?? Not used - and not setting this._dateInfo.  If used,
// need to check change in timezone in caller and then update location conflict
ZmApptEditView.prototype.updateTimezone =
function(dateInfo) {
	this._tzoneSelectStart.setSelectedValue(dateInfo.timezone);
	this._tzoneSelectEnd.setSelectedValue(dateInfo.timezone);
    this.handleTimezoneOverflow();
};

ZmApptEditView.prototype.updateLocation =
function(location, locationStr) {
    this._updateAttendeeFieldValues(ZmCalBaseItem.LOCATION, [location]);
    locationStr = locationStr || location.getAttendeeText(ZmCalBaseItem.LOCATION);
    this.setApptLocation(locationStr);
};

// Private / protected methods

ZmApptEditView.prototype._initTzSelect =
function() {
	var options = AjxTimezone.getAbbreviatedZoneChoices();
	if (options.length != this._tzCount) {
		this._tzCount = options.length;
		this._tzoneSelectStart.clearOptions();
		this._tzoneSelectEnd.clearOptions();
		for (var i = 0; i < options.length; i++) {
			this._tzoneSelectStart.addOption(options[i]);
			this._tzoneSelectEnd.addOption(options[i]);
		}
	}
};

ZmApptEditView.prototype._addTabGroupMembers =
function(tabGroup) {
    tabGroup.addMember(this._subjectField);
    if(this.GROUP_CALENDAR_ENABLED) {
        tabGroup.addMember([this._pickerButton[ZmCalBaseItem.PERSON],
                            this._attInputField[ZmCalBaseItem.PERSON],
                            this._showOptional,
                            this._pickerButton[ZmCalBaseItem.OPTIONAL_PERSON],
                            this._attInputField[ZmCalBaseItem.OPTIONAL_PERSON]]);
    }    
    tabGroup.addMember([this._suggestTime,
                        this._pickerButton[ZmCalBaseItem.LOCATION],
                        this._attInputField[ZmCalBaseItem.LOCATION]]);
    if(this.GROUP_CALENDAR_ENABLED && appCtxt.get(ZmSetting.GAL_ENABLED)) {
        tabGroup.addMember([this._pickerButton[ZmCalBaseItem.EQUIPMENT],
                            this._attInputField[ZmCalBaseItem.EQUIPMENT],
                            this._showResources,
                            this._suggestLocation]);
    }
    tabGroup.addMember([this._startDateField,
                        this._startDateButton,
                        this._startTimeSelect.getTabGroupMember(),
                        this._endDateField,
                        this._endDateButton,
                        this._endTimeSelect.getTabGroupMember(),
                        this._allDayCheckbox,

                        this._repeatSelect,
                        this._reminderSelectInput,
                        this._reminderButton,
                        this._reminderConfigure,

                        this._showAsSelect,
                        this._folderSelect,
                        this._privateCheckbox,

                        this._schButton,
                        this._scheduleView,
                        this.getHtmlEditor(),

                        this._suggestTime,
                        this._suggestLocation]);
};

ZmApptEditView.prototype._finishReset =
function() {
    ZmCalItemEditView.prototype._finishReset.call(this);

    this._apptFormValue = {};
    this._apptFormValue[ZmApptEditView.CHANGES_SIGNIFICANT]      = this._getFormValue(ZmApptEditView.CHANGES_SIGNIFICANT);
    this._apptFormValue[ZmApptEditView.CHANGES_INSIGNIFICANT]    = this._getFormValue(ZmApptEditView.CHANGES_INSIGNIFICANT);
    this._apptFormValue[ZmApptEditView.CHANGES_LOCAL]            = this._getFormValue(ZmApptEditView.CHANGES_LOCAL);
    this._apptFormValue[ZmApptEditView.CHANGES_TIME_RECURRENCE]  = this._getFormValue(ZmApptEditView.CHANGES_TIME_RECURRENCE);

    var newMode = (this._mode == ZmCalItem.MODE_NEW);        

    // save the original form data in its initialized state
	this._origFormValueMinusAttendees = newMode ? "" : this._formValue(true);
	if (this._hasReminderSupport) {
		this._origFormValueMinusReminder = newMode ? "" : this._formValue(false, true);
		this._origReminderValue = this._reminderSelectInput.getValue();
	}
    this._keyInfoValue = newMode ? "" : this._keyValue();
};

/**
 * Checks if location/time/recurrence only are changed.
 *
 * @return	{Boolean}	<code>true</code> if location/time/recurrence only are changed
 */
ZmApptEditView.prototype.isKeyInfoChanged =
function() {
	var formValue = this._keyInfoValue;
	return (this._keyValue() != formValue);
};

ZmApptEditView.prototype._getClone =
function() {
    if (!this._calItem) {
        return null;
    }
	return ZmAppt.quickClone(this._calItem);
};

ZmApptEditView.prototype.getDurationInfo =
function() {
    var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate   = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
	if (!this._allDayCheckbox.checked) {
		startDate = this._startTimeSelect.getValue(startDate);
		endDate   = this._endTimeSelect.getValue(endDate);
	}
    var durationInfo = {};
    durationInfo.startTime = startDate.getTime();
    durationInfo.endTime   = endDate.getTime();
    durationInfo.duration  = durationInfo.endTime - durationInfo.startTime;
    return durationInfo;
};

ZmApptEditView.prototype.getDuration =
function() {
    var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
    var duration = AjxDateUtil.MSEC_PER_DAY;
	if (!this._allDayCheckbox.checked) {
		startDate = this._startTimeSelect.getValue(startDate);
		endDate = this._endTimeSelect.getValue(endDate);
        duration = endDate.getTime() - startDate.getTime();
	}
    return duration;
};

ZmApptEditView.prototype._populateForSave =
function(calItem) {

    if (!calItem) {
        return null;
    }

    ZmCalItemEditView.prototype._populateForSave.call(this, calItem);

    //Handle Persona's
    var identity = this.getIdentity();
    if(identity){
       calItem.identity = identity; 
       calItem.sentBy = (identity && identity.getField(ZmIdentity.SEND_FROM_ADDRESS));
    }

	calItem.freeBusy = this._showAsSelect.getValue();
	calItem.privacy = this._privateCheckbox.checked ? ZmApptEditView.PRIVACY_OPTION_PRIVATE : ZmApptEditView.PRIVACY_OPTION_PUBLIC;

	// set the start date by aggregating start date/time fields
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
	if (this._allDayCheckbox.checked) {
		calItem.setAllDayEvent(true);
        if(AjxDateUtil.isDayShifted(startDate)) {
            AjxDateUtil.rollToNextDay(startDate);
            AjxDateUtil.rollToNextDay(endDate);
        }
	} else {
		calItem.setAllDayEvent(false);
		startDate = this._startTimeSelect.getValue(startDate);
		endDate = this._endTimeSelect.getValue(endDate);
	}
	calItem.setStartDate(startDate, true);
	calItem.setEndDate(endDate, true);
	if (Dwt.getVisibility(this._tzoneSelectStartElement)) {
		calItem.timezone = this._tzoneSelectStart.getValue();
	}
	if (Dwt.getVisibility(this._tzoneSelectEndElement)) {
		calItem.setEndTimezone(this._tzoneSelectEnd.getValue());
	}
	else {
		calItem.setEndTimezone(calItem.timezone); //it's not necessarily set correctly before. Might be still set to the original end time zone. I think here is the safeset place to make sure.
	}

    // set attendees
    for (var t = 0; t < this._attTypes.length; t++) {
        var type = this._attTypes[t];
        calItem.setAttendees(this._attendees[type].getArray(), type);
    }

    var calLoc = AjxStringUtil.trim(this._attInputField[ZmCalBaseItem.LOCATION].getValue());
     //bug 44858, trimming ';' so that ;; does not appears in outlook, 
	calItem.location = AjxStringUtil.trim(calLoc, false, ';');

	// set any recurrence rules LAST
	this._getRecurrence(calItem);

    calItem.isForward = this._isForward;
    calItem.isProposeTime = this._isProposeTime;

    if(this._isForward)  {
        var addrs = this._collectForwardAddrs();
        var a = {};
        if (addrs[AjxEmailAddress.TO] && addrs[AjxEmailAddress.TO].good) {
            a[AjxEmailAddress.TO] = addrs[AjxEmailAddress.TO].good.getArray();
        }        
        calItem.setForwardAddress(a[AjxEmailAddress.TO]);
    }

    // Only used for the save
    calItem.alteredLocations   = this._alteredLocations;

	return calItem;
};


ZmApptEditView.prototype.getRsvp =
function() {
  return this.GROUP_CALENDAR_ENABLED ? this._controller.getRequestResponses() : false;  
};

ZmApptEditView.prototype.updateToolbarOps =
function(){
    this._controller.updateToolbarOps((this.isAttendeesEmpty() || !this.isOrganizer()) ? ZmCalItemComposeController.APPT_MODE : ZmCalItemComposeController.MEETING_MODE, this._calItem);
};

ZmApptEditView.prototype.isAttendeesEmpty =
function() {

    if(!this.GROUP_CALENDAR_ENABLED) return true;

    var locations = this._attendees[ZmCalBaseItem.LOCATION];
    //non-resource location labels also contributes to empty attendee
    var isLocationResource =(locations && locations.size() > 0);
	var isAttendeesNotEmpty = AjxStringUtil.trim(this._attendeesInputField.getValue()) || AjxStringUtil.trim(this._optAttendeesInputField.getValue()) || (this._resourceInputField ? AjxStringUtil.trim(this._resourceInputField.getValue()) : "") || isLocationResource;
    return !isAttendeesNotEmpty;
    
};

ZmApptEditView.prototype._populateForEdit =
function(calItem, mode) {

	ZmCalItemEditView.prototype._populateForEdit.call(this, calItem, mode);

    var enableTimeSelection = !this._isForward;
    var enableApptDetails = !this._isForward && !this._isProposeTime;

	this._showAsSelect.setSelectedValue(calItem.freeBusy);
    this._showAsSelect.setEnabled(enableApptDetails);

	// reset the date/time values based on current time
	var sd = new Date(calItem.startDate.getTime());
	var ed = new Date(calItem.endDate.getTime());

    var isNew = (mode == ZmCalItem.MODE_NEW || mode == ZmCalItem.MODE_NEW_FROM_QUICKADD);
	var isAllDayAppt = calItem.isAllDayEvent();
	if (isAllDayAppt) {
		this._allDayCheckbox.checked = true;
		this._showTimeFields(false);
        this.updateShowAsField(true);
        this._showAsSelect.setSelectedValue(calItem.freeBusy);
        this._showAsSelect.setEnabled(enableApptDetails);

		// set time anyway to current time and default duration (in case user changes mind)
		var now = AjxDateUtil.roundTimeMins(new Date(), 30);
		this._startTimeSelect.set(now);

		now.setTime(now.getTime() + ZmCalViewController.DEFAULT_APPOINTMENT_DURATION);
		this._endTimeSelect.set(now);

		// bug 9969: HACK - remove the all day durtion for display
		if (!isNew && !calItem.draftUpdated && ed.getHours() == 0 && ed.getMinutes() == 0 && ed.getSeconds() == 0 && sd.getTime() != ed.getTime()) {
			ed.setHours(-12);
		}
	} else {
		this._showTimeFields(true);
		this._startTimeSelect.set(calItem.startDate);
		this._endTimeSelect.set(calItem.endDate);
	}
	this._startDateField.value = AjxDateUtil.simpleComputeDateStr(sd);
	this._endDateField.value = AjxDateUtil.simpleComputeDateStr(ed);

	this._initTzSelect();
	this._resetTimezoneSelect(calItem, isAllDayAppt);

    //need to capture initial time set while composing/editing appt
    ZmApptViewHelper.getDateInfo(this, this._dateInfo);

    this._startTimeSelect.setEnabled(enableTimeSelection);
    this._endTimeSelect.setEnabled(enableTimeSelection);
    this._startDateButton.setEnabled(enableTimeSelection);
    this._endDateButton.setEnabled(enableTimeSelection);

    this._fwdApptOrigAttendees = [];

    //editing an appt should exclude the original appt time for FB calculation
    this._fbExcludeInfo = {};

    var showScheduleView = false;
	// attendees
	var attendees = calItem.getAttendees(ZmCalBaseItem.PERSON);
	if (attendees && attendees.length) {
		if (this.GROUP_CALENDAR_ENABLED) {
			var people = calItem.getAttendees(ZmCalBaseItem.PERSON);
			var reqAttendees = ZmApptViewHelper.filterAttendeesByRole(people, ZmCalItem.ROLE_REQUIRED);
			this._setAddresses(this._attendeesInputField, reqAttendees, ZmCalBaseItem.PERSON);
			var optAttendees = ZmApptViewHelper.filterAttendeesByRole(people, ZmCalItem.ROLE_OPTIONAL);
			this._setAddresses(this._optAttendeesInputField, optAttendees, ZmCalBaseItem.PERSON);
            if (optAttendees.length) {
                this._toggleOptionalAttendees(true);
            }
		}
        if(this._isForward) {
        	this._attInputField[ZmCalBaseItem.FORWARD] = this._forwardToField;
        }
    	this._attendees[ZmCalBaseItem.PERSON] = AjxVector.fromArray(attendees);
        for(var a=0;a<attendees.length;a++){
            this._attendeesHashMap[attendees[a].getEmail()+"-"+ZmCalBaseItem.PERSON]=attendees[a];
            if(!isNew) this.addFreeBusyExcludeInfo(attendees[a].getEmail(), calItem.startDate.getTime(), calItem.endDate.getTime());
        }
    	this._attInputField[ZmCalBaseItem.PERSON] = this._attendeesInputField;
    	this._fwdApptOrigAttendees = [];
        showScheduleView = true;
	} else {
        if (this.GROUP_CALENDAR_ENABLED) {
            this._attendeesInputField.clear();
            this._optAttendeesInputField.clear();
        }
        this._attendees[ZmCalBaseItem.PERSON] = new AjxVector();
    }

	// set the location attendee(s)
	// Always get the information from the location string.  There may be non-attendee information included such
	// as conference call phone numbers, etc.
	var nonAttendeeLocationInfo = [];
	var locations = this.getAttendeesFromString(ZmCalBaseItem.LOCATION, calItem.getLocation(), false, nonAttendeeLocationInfo);
	if (locations) {
		locations = locations.getArray();
	}
	if (locations && locations.length) {
        this.updateAttendeesCache(ZmCalBaseItem.LOCATION, locations);
		this._attendees[ZmCalBaseItem.LOCATION] = AjxVector.fromArray(locations);
        var locStr = ZmApptViewHelper.getAttendeesString(locations, ZmCalBaseItem.LOCATION);
        this._setAddresses(this._attInputField[ZmCalBaseItem.LOCATION], locStr);
		// Set the non-attendee info without bubbles
		var nonAttendeeStr = nonAttendeeLocationInfo.join(AjxEmailAddress.DELIMS[0]);
		this._attInputField[ZmCalBaseItem.LOCATION].setValue(nonAttendeeStr, true, true, false);
		showScheduleView = true;
	}else{
	    // set the location - Only non-attendee information was provided, if that
	    this._attInputField[ZmCalBaseItem.LOCATION].setValue(calItem.getLocation());
    }

    // set the equipment attendee(s)
	var equipment = calItem.getAttendees(ZmCalBaseItem.EQUIPMENT);
	if (equipment && equipment.length) {
        this._toggleResourcesField(true);
		this._attendees[ZmCalBaseItem.EQUIPMENT] = AjxVector.fromArray(equipment);
        this.updateAttendeesCache(ZmCalBaseItem.EQUIPMENT, equipment);
        var equipStr = ZmApptViewHelper.getAttendeesString(equipment, ZmCalBaseItem.EQUIPMENT);
        this._setAddresses(this._attInputField[ZmCalBaseItem.EQUIPMENT], equipStr);
        showScheduleView = true;
	}

	// privacy
    var isRemote = calItem.isShared();
    var cal = isRemote ? appCtxt.getById(calItem.folderId) : null;
    var isPrivacyEnabled = ((!isRemote || (cal && cal.hasPrivateAccess())) && enableApptDetails);
    var defaultPrivacyOption = (appCtxt.get(ZmSetting.CAL_APPT_VISIBILITY) == ZmSetting.CAL_VISIBILITY_PRIV);

    this._privateCheckbox.checked = (calItem.privacy == ZmApptEditView.PRIVACY_OPTION_PRIVATE);
    this._privateCheckbox.disabled = !isPrivacyEnabled;

	if (this.GROUP_CALENDAR_ENABLED) {
        this._controller.setRequestResponses((attendees && attendees.length) ? calItem.shouldRsvp() : true);

		this._isOrganizer = calItem.isOrganizer();
		//this._attInputField[ZmCalBaseItem.PERSON].setEnabled(calItem.isOrganizer() || this._isForward);

        //todo: disable notification for attendee
        
        if(this._organizerData) {
            this._organizerData.innerHTML = calItem.getOrganizer() || "";
        }
        this._calItemOrganizer =  calItem.getOrganizer() || "";

        if(!isNew) this.addFreeBusyExcludeInfo(this.getOrganizerEmail(), calItem.startDate.getTime(), calItem.endDate.getTime());

        //enable forward field/picker if its not propose time view
        this._setAddresses(this._forwardToField, this._isProposeTime ? calItem.getOrganizer() : "");
        this._forwardToField.setEnabled(!this._isProposeTime);
        if (this._forwardPicker) {
            this._forwardPicker.setEnabled(!this._isProposeTime);
        }

        for (var t = 0; t < this._attTypes.length; t++) {
		    var type = this._attTypes[t];
		    if(this._pickerButton[type]) this._pickerButton[type].setEnabled(enableApptDetails);
	    }

        if(this._pickerButton[ZmCalBaseItem.OPTIONAL_PERSON]) this._pickerButton[ZmCalBaseItem.OPTIONAL_PERSON].setEnabled(enableApptDetails);
	}


    this._folderSelect.setEnabled(enableApptDetails);
    if (this._reminderSelect) {
		this._reminderSelect.setEnabled(enableTimeSelection);
	}

    this._allDayCheckbox.disabled = !enableTimeSelection;

    if(calItem.isAcceptingProposal) this._isDirty = true;

    //Persona's   [ Should select Persona as combination of both DisplayName, FromAddress ]
    if(calItem.identity){
        this.setIdentity(calItem.identity);
    }else{
        var sentBy = calItem.sentBy;
        sentBy = sentBy || (calItem.organizer != calItem.getFolder().getOwner() ? calItem.organizer : null);
        if(sentBy){
            var ic = appCtxt.getIdentityCollection();
            if (ic) {
                this.setIdentity(ic.getIdentityBySendAddress(sentBy));
            }
        }
    }

    this.setApptMessage(this._getMeetingStatusMsg(calItem));

    this.updateToolbarOps();
    if(this._isProposeTime) {
        this._controller.setRequestResponses(false);
    }
    else if (this._isForward) {
        this._controller.setRequestResponses(calItem.rsvp);
        this._controller.setRequestResponsesEnabled(false);
    }
    else {
        this._controller.setRequestResponses(calItem && calItem.hasAttendees() ? calItem.shouldRsvp() : true);
    }

    showScheduleView = showScheduleView && !this._isForward;

    if(this._controller.isSave() && showScheduleView){
        this._toggleInlineScheduler(true);
    }else{
        this._schedulerOpened = null;
        this._closeScheduler();
    }

    this._expandInlineScheduler = (showScheduleView && !isNew);

};

ZmApptEditView.prototype.getFreeBusyExcludeInfo =
function(emailAddr){
    return this._fbExcludeInfo ? this._fbExcludeInfo[emailAddr] : null;
};

ZmApptEditView.prototype.excludeLocationFBSlots =
function(locations, startTime, endTime){
    for(var i=0; i < locations.length; i++){
        var location = locations[i];
        if(!location) continue;
        this.addFreeBusyExcludeInfo(location.getEmail(), startTime, endTime);
    }
};

ZmApptEditView.prototype.addFreeBusyExcludeInfo =
function(emailAddr, startTime, endTime){
    if(!this._fbExcludeInfo) this._fbExcludeInfo = {};
    // DISABLE client side exclude info usage.  Now using the GetFreeBusyInfo
    // call with ExcludeId, where the server performs the exclusion of the
    // current appt.
    //
    //this._fbExcludeInfo[emailAddr] = {
    //    s: startTime,
    //    e: endTime
    //};
};

ZmApptEditView.prototype._getMeetingStatusMsg =
function(calItem){
    var statusMsg = null;
    if(!this.isAttendeesEmpty() && calItem.isDraft){
        if(calItem.inviteNeverSent){
            statusMsg = ZmMsg.inviteNotSent;
        }else{
            statusMsg = ZmMsg.updatedInviteNotSent;
        }
    }
    return statusMsg;
};

ZmApptEditView.prototype.setApptMessage =
function(msg, icon){
    if(msg){
        Dwt.setVisible(this._inviteMsgContainer, true);
        this._inviteMsg.innerHTML = msg;
    }else{
        Dwt.setVisible(this._inviteMsgContainer, false);
    }
};

ZmApptEditView.prototype.getCalItemOrganizer =
function() {
	var folderId = this._folderSelect.getValue();
	var organizer = new ZmContact(null);
	organizer.initFromEmail(this._calItemOrganizer, true);
	return organizer;
};

ZmApptEditView.prototype._createHTML =
function() {
	// cache these Id's since we use them more than once
	this._allDayCheckboxId 	= this._htmlElId + "_allDayCheckbox";
	this._repeatDescId 		= this._htmlElId + "_repeatDesc";
	this._startTimeAtLblId  = this._htmlElId + "_startTimeAtLbl";
	this._endTimeAtLblId	= this._htmlElId + "_endTimeAtLbl";
    this._isAppt = true; 

	var subs = {
		id: this._htmlElId,
		height: (this.parent.getSize().y - 30),
		currDate: (AjxDateUtil.simpleComputeDateStr(new Date())),
		isGalEnabled: appCtxt.get(ZmSetting.GAL_ENABLED),
		isAppt: true,
		isGroupCalEnabled: this.GROUP_CALENDAR_ENABLED
	};

	this.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Appointment#ComposeView", subs);
};

ZmApptEditView.prototype._createWidgets =
function(width) {
	ZmCalItemEditView.prototype._createWidgets.call(this, width);

	this._attInputField = {};

    this._attendeesInputField = this._createInputField("_person", ZmCalBaseItem.PERSON, {
        label: ZmMsg.attendees,
        bubbleAddedCallback: new AjxCallback(this, this._handleAddedAttendees, [ZmCalBaseItem.PERSON]),
        bubbleRemovedCallback: new AjxCallback(this, this._handleRemovedAttendees, [ZmCalBaseItem.PERSON])
    });
    this._optAttendeesInputField = this._createInputField("_optional", ZmCalBaseItem.OPTIONAL_PERSON, {
        label: ZmMsg.optionalAttendees,
        bubbleAddedCallback: new AjxCallback(this, this._handleAddedAttendees, [ZmCalBaseItem.OPTIONAL_PERSON]),
        bubbleRemovedCallback: new AjxCallback(this, this._handleRemovedAttendees, [ZmCalBaseItem.OPTIONAL_PERSON])
    });
	//add Resources Field
	if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
		this._resourceInputField = this._createInputField("_resourcesData", ZmCalBaseItem.EQUIPMENT, {
			strictMode:false,
			label: ZmMsg.equipmentAttendee,
			bubbleAddedCallback: this._handleAddedAttendees.bind(this, ZmCalBaseItem.EQUIPMENT),
			bubbleRemovedCallback: this._handleRemovedAttendees.bind(this, ZmCalBaseItem.EQUIPMENT)
		});
	}

    // add location input field
	this._locationInputField = this._createInputField("_location", ZmCalBaseItem.LOCATION, {
		strictMode:            false,
		noAddrBubbles:         !appCtxt.get(ZmSetting.GAL_ENABLED),
		bubbleAddedCallback:   this._handleAddedAttendees.bind(this, ZmCalBaseItem.LOCATION),
		bubbleRemovedCallback: this._handleRemovedAttendees.bind(this, ZmCalBaseItem.LOCATION),
		label: ZmMsg.location
	});

    this._mainId = this._htmlElId + "_main";
    this._main   = document.getElementById(this._mainId);

    this._mainTableId = this._htmlElId + "_table";
    this._mainTable   = document.getElementById(this._mainTableId);

    var edvId = AjxCore.assignId(this);
    this._schButtonId = this._htmlElId + "_scheduleButton";
    this._showOptionalId = this._htmlElId + "_show_optional";
    this._showResourcesId = this._htmlElId + "_show_resources";
    
    this._showOptional = document.getElementById(this._showOptionalId);
    this._showResources = document.getElementById(this._showResourcesId);

    this._schButton = document.getElementById(this._schButtonId);
    this._schButton._editViewId = edvId;
    this._schImage = document.getElementById(this._htmlElId + "_scheduleImage");
    this._schImage._editViewId = edvId;
    this._makeFocusable(this._schButton);
    this._makeFocusable(this._schImage);
    Dwt.setHandler(this._schButton, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
    Dwt.setHandler(this._schImage, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);

	this._resourcesContainer = document.getElementById(this._htmlElId + "_resourcesContainer");

	this._resourcesData = document.getElementById(this._htmlElId + "_resourcesData");
    this._schedulerContainer = document.getElementById(this._htmlElId + "_scheduler");
    this._suggestions = document.getElementById(this._htmlElId + "_suggestions");
    Dwt.setVisible(this._suggestions, false);

    this._attendeeStatusId = this._htmlElId + "_attendee_status";
    this._attendeeStatus   = document.getElementById(this._attendeeStatusId);
    Dwt.setVisible(this._attendeeStatus, false);

    this._suggestTimeId = this._htmlElId + "_suggest_time";
    this._suggestTime = document.getElementById(this._suggestTimeId);
    Dwt.setVisible(this._suggestTime, !this._isForward);
    this._suggestLocationId = this._htmlElId + "_suggest_location";
    this._suggestLocation   = document.getElementById(this._suggestLocationId);
    Dwt.setVisible(this._suggestLocation, !this._isForward && !this._isProposeTime);

    this._locationStatusId = this._htmlElId + "_location_status";
    this._locationStatus   = document.getElementById(this._locationStatusId);
    Dwt.setVisible(this._locationStatus, false);
    this._locationStatusMode = ZmApptEditView.LOCATION_STATUS_NONE;

    this._locationStatusActionId = this._htmlElId + "_location_status_action";
    this._locationStatusAction   = document.getElementById(this._locationStatusActionId);
    Dwt.setVisible(this._locationStatusAction, false);

	this._schedulerOptions = document.getElementById(this._htmlElId + "_scheduler_option");

	// show-as DwtSelect
	this._showAsSelect = new DwtSelect({parent:this, parentElement: (this._htmlElId + "_showAsSelect")});
	this._showAsSelect.setAttribute('aria-label', ZmMsg.showAs);
	for (var i = 0; i < ZmApptViewHelper.SHOWAS_OPTIONS.length; i++) {
		var option = ZmApptViewHelper.SHOWAS_OPTIONS[i];
		this._showAsSelect.addOption(option.label, option.selected, option.value, "ShowAs" + option.value);
	}

	this._showAsSelect.addChangeListener(new AjxListener(this, this.setShowAsFlag, [true]));
	this._folderSelect.addChangeListener(new AjxListener(this, this._folderListener));
	this._showAsSelect.setAttribute('aria-label', ZmMsg.showAs);

    this._privateCheckbox = document.getElementById(this._htmlElId + "_privateCheckbox");

	// time DwtTimeSelect
	var timeSelectListener = new AjxListener(this, this._timeChangeListener);
	this._startTimeSelect = new DwtTimeInput(this, DwtTimeInput.START);
	this._startTimeSelect.reparentHtmlElement(this._htmlElId + "_startTimeSelect");
	this._startTimeSelect.addChangeListener(timeSelectListener);

	this._endTimeSelect = new DwtTimeInput(this, DwtTimeInput.END);
	this._endTimeSelect.reparentHtmlElement(this._htmlElId + "_endTimeSelect");
	this._endTimeSelect.addChangeListener(timeSelectListener);

	// create without saving in this._attInputField (will overwrite attendee input)
	this._forwardToField = this._createInputField("_to_control",ZmCalBaseItem.FORWARD);

	// timezone DwtSelect
    var timezoneListener = new AjxListener(this, this._timezoneListener);
    this._tzoneSelectStartElement = document.getElementById(this._htmlElId + "_tzoneSelectStart");
	this._tzoneSelectStart = new DwtSelect({parent:this, parentElement:this._tzoneSelectStartElement, layout:DwtMenu.LAYOUT_SCROLL, maxRows:7});
	this._tzoneSelectStart.addChangeListener(timezoneListener);
    this._tzoneSelectStart.setData(ZmApptEditView.TIMEZONE_TYPE, ZmApptEditView.START_TIMEZONE);
    this._tzoneSelectStart.dynamicButtonWidth();

    this._tzoneSelectEndElement = document.getElementById(this._htmlElId + "_tzoneSelectEnd");
	this._tzoneSelectEnd = new DwtSelect({parent:this, parentElement:this._tzoneSelectEndElement, layout:DwtMenu.LAYOUT_SCROLL, maxRows:7});
	this._tzoneSelectEnd.addChangeListener(timezoneListener);
    this._tzoneSelectEnd.setData(ZmApptEditView.TIMEZONE_TYPE, ZmApptEditView.END_TIMEZONE);
    this._tzoneSelectEnd.dynamicButtonWidth();

	// NOTE: tzone select is initialized later

	// init auto-complete widget if contacts app enabled
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		this._initAutocomplete();
	}

    this._organizerOptions = document.getElementById(this._htmlElId + "_organizer_options");
    this._organizerData = document.getElementById(this._htmlElId + "_organizer");
    this._optionalAttendeesContainer = document.getElementById(this._htmlElId + "_optionalContainer");

    this._maxPickerWidth = 0;    
    var isPickerEnabled = (appCtxt.get(ZmSetting.CONTACTS_ENABLED) ||
						   appCtxt.get(ZmSetting.GAL_ENABLED) ||
						   appCtxt.multiAccounts);
    if (isPickerEnabled) {
        this._createContactPicker(this._htmlElId + "_picker", new AjxListener(this, this._addressButtonListener), ZmCalBaseItem.PERSON, true);
        this._createContactPicker(this._htmlElId + "_req_att_picker", new AjxListener(this, this._attendeesButtonListener, ZmCalBaseItem.PERSON), ZmCalBaseItem.PERSON);
        this._createContactPicker(this._htmlElId + "_opt_att_picker", new AjxListener(this, this._attendeesButtonListener, ZmCalBaseItem.OPTIONAL_PERSON), ZmCalBaseItem.OPTIONAL_PERSON);
        if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
			//do not create picker if GAL is disabled.
			this._createContactPicker(this._htmlElId + "_loc_picker", new AjxListener(this, this._locationButtonListener, ZmCalBaseItem.LOCATION), ZmCalBaseItem.LOCATION);
		}
        this._createContactPicker(this._htmlElId + "_res_btn", new AjxListener(this, this._locationButtonListener, ZmCalBaseItem.EQUIPMENT), ZmCalBaseItem.EQUIPMENT);
    }

    //Personas
    //TODO: Remove size check once we add identityCollection change listener.
    if (appCtxt.get(ZmSetting.IDENTITIES_ENABLED) && !appCtxt.multiAccounts){
        var identityOptions = this._getIdentityOptions();
        this.identitySelect = new DwtSelect({parent:this, options:identityOptions, parentElement: (this._htmlElId + "_identity")});
        this.identitySelect.setToolTipContent(ZmMsg.chooseIdentity);
    }

    this._setIdentityVisible();
    this.updateToolbarOps();

    if (this._resourcesContainer) {
        Dwt.setVisible(this._resourcesContainer, false);
    }

    if(this.GROUP_CALENDAR_ENABLED) {
        Dwt.setVisible(this._optionalAttendeesContainer, false);
        Dwt.setVisible(this._optAttendeesInputField.getInputElement(), false);
        if(this._resourceInputField) { Dwt.setVisible(this._resourceInputField.getInputElement(), false); }
    }

    this._inviteMsgContainer = document.getElementById(this._htmlElId + "_invitemsg_container");
    this._inviteMsg = document.getElementById(this._htmlElId + "_invitemsg");

    this.resize();
};

ZmApptEditView.prototype._createInputField =
function(idTag, attType, params) {

    params = params || {};

    var height = AjxEnv.isSafari && !AjxEnv.isSafariNightly ? "52px;" : "21px";
    var overflow = AjxEnv.isSafari && !AjxEnv.isSafariNightly ? false : true;
    
	var inputId = this.parent._htmlElId + idTag + "_input";
	var cellId = this._htmlElId + idTag;
	var input;
	var contactsEnabled = appCtxt.get(ZmSetting.CONTACTS_ENABLED);

	if (!params.noAddrBubbles) {
		var aifParams = {
			label:					params.label,
			autocompleteListView:	this._acAddrSelectList,
			inputId:				inputId,
            bubbleAddedCallback:	params.bubbleAddedCallback,
            bubbleRemovedCallback:  params.bubbleRemovedCallback,
			type:					attType,
			strictMode:				params.strictMode
		}
		var input = this._attInputField[attType] = new ZmAddressInputField(aifParams);
		if (!contactsEnabled && input._input) {
			input._input.supportsAutoComplete = false;
		}
		input.reparentHtmlElement(cellId);
	} else {
		var params = {
			parent:			this,
			parentElement:	cellId,
			label:			params.label,
			inputId:		inputId
		};
        if (idTag == '_person' ||
            idTag == '_optional' ||
            idTag == '_to_control') {
            params.forceMultiRow = true;
        }
		input = this._attInputField[attType] = new DwtInputField(params);
	}

	var inputEl = input.getInputElement();
	Dwt.setSize(inputEl, "100%", height);
	inputEl._attType = attType;

	return input;
};

ZmApptEditView.prototype._createContactPicker =
function(pickerId, listener, addrType, isForwardPicker) {
    var pickerEl = document.getElementById(pickerId);
    if (pickerEl) {
        var buttonId = Dwt.getNextId();
        var button = new DwtButton({parent:this, id:buttonId, className: "ZButton ZPicker"});
        if(isForwardPicker) {
            this._forwardPicker = button;
        }else {
            this._pickerButton[addrType] = button;            
        }
        button.setText(pickerEl.innerHTML);
        button.replaceElement(pickerEl);

        button.addSelectionListener(listener);
        button.addrType = addrType;

        var btnWidth = button.getSize().x;
        if(btnWidth > this._maxPickerWidth) this._maxPickerWidth = btnWidth;
    }
};


ZmApptEditView.prototype._onSuggestionClose =
function() {
    // Make the trigger links visible and resize now that the suggestion panel is hidden
    Dwt.setVisible(this._suggestTime, !this._isForward);
    Dwt.setVisible(this._suggestLocation, !this._isForward && !this._isProposeTime && appCtxt.get(ZmSetting.GAL_ENABLED));
    this.resize();
}

ZmApptEditView.prototype._showTimeSuggestions =
function() {
    // Display the time suggestion panel.
    Dwt.setVisible(this._suggestions, true);
    Dwt.setVisible(this._suggestTime, false);
    Dwt.setVisible(this._suggestLocation, !this._isProposeTime && appCtxt.get(ZmSetting.GAL_ENABLED));
    this._scheduleAssistant.show(true);
    this._scheduleAssistant.suggestAction(true, false);

    this.resize();
};

ZmApptEditView.prototype._showLocationSuggestions =
function() {
    // Display the location suggestion panel
    Dwt.setVisible(this._suggestions, true);
    Dwt.setVisible(this._suggestLocation, false);
    Dwt.setVisible(this._suggestTime, true);
    this._scheduleAssistant.show(false);
    this._scheduleAssistant.suggestAction(true, false);

    this.resize();
};

ZmApptEditView.prototype._showLocationStatusAction =
function() {
    if (!this._resolveLocationDialog) {
        this._resolveLocationDialog = new ZmResolveLocationConflictDialog(
            this._controller, this,
            this._locationConflictOKCallback.bind(this),
            this._scheduleAssistant);
    } else {
        this._resolveLocationDialog.cleanup();
    }

    this._resolveLocationDialog.popup(this._calItem, this._inst, this._locationExceptions);
};

// Invoked from 'OK' button of location conflict resolve dialog
ZmApptEditView.prototype._locationConflictOKCallback =
function(locationExceptions, alteredLocations) {
    this._locationExceptions = locationExceptions;
    this._alteredLocations   = alteredLocations;
    this.locationConflictChecker();
};

ZmApptEditView.prototype._toggleOptionalAttendees =
function(forceShow) {
    this._optionalAttendeesShown = ! this._optionalAttendeesShown || forceShow;
    this._showOptional.innerHTML = this._optionalAttendeesShown ? ZmMsg.hideOptional : ZmMsg.showOptional;
    Dwt.setVisible(this._optionalAttendeesContainer, Boolean(this._optionalAttendeesShown))

    var inputEl = this._attInputField[ZmCalBaseItem.OPTIONAL_PERSON].getInputElement();
    Dwt.setVisible(inputEl, Boolean(this._optionalAttendeesShown));
    this.resize();
};

ZmApptEditView.prototype._toggleResourcesField =
function(forceShow) {
    this._resourcesShown = ! this._resourcesShown || forceShow;
    this.showResourceField(this._resourcesShown);

    var inputEl = this._attInputField[ZmCalBaseItem.EQUIPMENT].getInputElement();
    Dwt.setVisible(inputEl, Boolean(this._resourcesShown));
    this.resize();
};

ZmApptEditView.prototype.showResourceField =
function(show){
    this._showResources.innerHTML = show ? ZmMsg.hideEquipment : ZmMsg.showEquipment;
    Dwt.setVisible(this._resourcesContainer, Boolean(show))
    this.resize();
};


ZmApptEditView.prototype.showOptional =
function() {
    this._toggleOptionalAttendees(true);
};

ZmApptEditView.prototype._closeScheduler =
function() {
    this._schButton.innerHTML = ZmMsg.show;
    this._schImage.className = "ImgSelectPullDownArrow";
    if(this._scheduleView) {
        this._scheduleView.setVisible(false);
        this.resize();
    }
};

ZmApptEditView.prototype._toggleInlineScheduler =
function(forceShow) {

    if(this._schedulerOpened && !forceShow) {
        this._schedulerOpened = false;        
        this._closeScheduler();
        return;
    }

    this._schedulerOpened = true;
    this._schButton.innerHTML = ZmMsg.hide;
    this._schImage.className = "ImgSelectPullUpArrow";

    var scheduleView = this.getScheduleView();

    //todo: scheduler auto complete
    Dwt.setVisible(this._schedulerContainer, true);
    scheduleView.setVisible(true);
    scheduleView.resetPagelessMode(true);
    scheduleView.showMe();

    this.resize();
};

ZmApptEditView.prototype.getScheduleView =
function() {
    if(!this._scheduleView) {
        var appt = this.parent.getAppt();
        this._scheduleView = new ZmFreeBusySchedulerView(this, this._attendees, this._controller,
            this._dateInfo, appt, this.showConflicts.bind(this));
        this._scheduleView.reparentHtmlElement(this._schedulerContainer);
        this._scheduleView.setScrollStyle(Dwt.SCROLL_Y);

        var closeCallback = this._onSuggestionClose.bind(this);
        this._scheduleAssistant = new ZmScheduleAssistantView(this, this._controller, this, closeCallback);
        this._scheduleAssistant.reparentHtmlElement(this._suggestions);
        AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.loadPreference), 300);
    }
    return this._scheduleView;    
};

ZmApptEditView.prototype._resetAttendeeCount =
function() {
	for (var i = 0; i < ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS; i++) {
		this._allAttendees[i] = 0;
		delete this._allAttendeesStatus[i];
	}
};


//TODO:
    // 1. Organizer/From is always Persona  - Done
    // 2. Remote Cals -  sentBy is Persona  - Done
    // 3. Appt. Summary body needs Persona details - Needs Action
    // 4. No Persona's Case  - Done

ZmApptEditView.prototype.setIdentity =
function(identity){
    if (this.identitySelect) {
        identity = identity || appCtxt.getIdentityCollection().defaultIdentity;
        this.identitySelect.setSelectedValue(identity.id);
    }
};

ZmApptEditView.prototype.getIdentity =
function() {

	if (this.identitySelect) {
		var collection = appCtxt.getIdentityCollection();
		var val = this.identitySelect.getValue();
		var identity = collection.getById(val);
		return identity ? identity : collection.defaultIdentity;
	}
};

ZmApptEditView.prototype._setIdentityVisible =
function() {
	var div = document.getElementById(this._htmlElId + "_identityContainer");
	if (!div) return;

	var visible = this.identitySelect && appCtxt.get(ZmSetting.IDENTITIES_ENABLED) ? this.identitySelect.getOptionCount() > 1 : false;
    Dwt.setVisible(div, visible);
};

ZmApptEditView.prototype._getIdentityOptions =
function() {
	var options = [];
	var identityCollection = appCtxt.getIdentityCollection();
	var identities = identityCollection.getIdentities();
    var defaultIdentity = identityCollection.defaultIdentity;
	for (var i = 0, count = identities.length; i < count; i++) {
		var identity = identities[i];
		options.push(new DwtSelectOptionData(identity.id, this._getIdentityText(identity), (identity.id == defaultIdentity.id)));
	}
	return options;
};

ZmApptEditView.prototype._getIdentityText =
function(identity, account) {
	var name = identity.name;
	if (identity.isDefault && name == ZmIdentity.DEFAULT_NAME) {
		name = account ? account.getDisplayName() : ZmMsg.accountDefault;
	}

	// default replacement parameters
	var defaultIdentity = appCtxt.getIdentityCollection().defaultIdentity;
	var params = [
		name,
		(identity.sendFromDisplay || ''),
		identity.sendFromAddress,
		ZmMsg.accountDefault,
		appCtxt.get(ZmSetting.DISPLAY_NAME),
		defaultIdentity.sendFromAddress
	];

	// get appropriate pattern
	var pattern;
	if (identity.isDefault) {
		pattern = ZmMsg.identityTextPrimary;
	}
	else if (identity.isFromDataSource) {
		var ds = appCtxt.getDataSourceCollection().getById(identity.id);
		params[1] = ds.userName || '';
		params[2] = ds.getEmail();
		var provider = ZmDataSource.getProviderForAccount(ds);
		pattern = (provider && ZmMsg["identityText-"+provider.id]) || ZmMsg.identityTextExternal;
	}
	else {
		pattern = ZmMsg.identityTextPersona;
	}

	// format text
	return AjxMessageFormat.format(pattern, params);
};

ZmApptEditView.prototype._addressButtonListener =
function(ev) {
	var obj = ev ? DwtControl.getTargetControl(ev) : null;
    this._forwardToField.setEnabled(false);
	if (!this._contactPicker) {
		AjxDispatcher.require("ContactsCore");
		if (!appCtxt.getApp(ZmApp.CONTACTS)) {
			appCtxt.getAppController()._createApp(ZmApp.CONTACTS);
		}
		var buttonInfo = [
			{ id: AjxEmailAddress.TO,	label: ZmMsg.toLabel }
		];
		this._contactPicker = new ZmContactPicker(buttonInfo);
		this._contactPicker.registerCallback(DwtDialog.OK_BUTTON, this._contactPickerOkCallback, this);
		this._contactPicker.registerCallback(DwtDialog.CANCEL_BUTTON, this._contactPickerCancelCallback, this);
	}

	var addrList = {};
	var type = AjxEmailAddress.TO;
	addrList[type] = this._forwardToField.getAddresses(true);

    var str = (this._forwardToField.getValue() && !(addrList[type] && addrList[type].length)) ? this._forwardToField.getValue() : "";
	this._contactPicker.popup(type, addrList, str);
};

ZmApptEditView.prototype._attendeesButtonListener =
function(addrType, ev) {
	var obj = ev ? DwtControl.getTargetControl(ev) : null;
    var inputObj = this._attInputField[addrType]; 
    inputObj.setEnabled(false);
    var contactPicker = this._attendeePicker[addrType];
	if (!contactPicker) {
		AjxDispatcher.require("ContactsCore");
		if (!appCtxt.getApp(ZmApp.CONTACTS)) {
			appCtxt.getAppController()._createApp(ZmApp.CONTACTS);
		}
		var buttonInfo = [
			{ id: AjxEmailAddress.TO,	label: ZmMsg.toLabel }
		];
		contactPicker = this._attendeePicker[addrType] = new ZmContactPicker(buttonInfo);
		contactPicker.registerCallback(DwtDialog.OK_BUTTON, this._attendeePickerOkCallback, this, [addrType]);
		contactPicker.registerCallback(DwtDialog.CANCEL_BUTTON, this._attendeePickerCancelCallback, this, [addrType]);
	}

	var addrList = {};
	var type = AjxEmailAddress.TO;
	addrList[type] = this._attInputField[addrType].getAddresses(true);

    var str = (inputObj.getValue() && !(addrList[type] && addrList[type].length)) ? inputObj.getValue() : "";
	contactPicker.popup(type, addrList, str);
};

ZmApptEditView.prototype._locationButtonListener =
function(addrType, ev) {
	var obj = ev ? DwtControl.getTargetControl(ev) : null;
    var inputObj = this._attInputField[addrType];
    if(inputObj) inputObj.setEnabled(false);
    var locationPicker = this.getAttendeePicker(addrType);
	locationPicker.popup();
};

ZmApptEditView.prototype.getAttendeePicker =
function(addrType) {
    var attendeePicker = this._attendeePicker[addrType];
	if (!attendeePicker) {
		attendeePicker = this._attendeePicker[addrType] = new ZmAttendeePicker(this, this._attendees, this._controller, addrType, this._dateInfo);
		attendeePicker.registerCallback(DwtDialog.OK_BUTTON, this._locationPickerOkCallback, this, [addrType]);
		attendeePicker.registerCallback(DwtDialog.CANCEL_BUTTON, this._attendeePickerCancelCallback, this, [addrType]);
        attendeePicker.initialize(this._calItem, this._mode, this._isDirty, this._apptComposeMode);
	}
    return attendeePicker;
};

// Transfers addresses from the contact picker to the appt compose view.
ZmApptEditView.prototype._attendeePickerOkCallback =
function(addrType, addrs) {

    this._attInputField[addrType].setEnabled(true);
    var vec = (addrs instanceof AjxVector) ? addrs : addrs[AjxEmailAddress.TO];
	this._setAddresses(this._attInputField[addrType], vec);

    this._activeInputField = addrType; 
    this._handleAttendeeField(addrType);
	this._attendeePicker[addrType].popdown();
};

/**
 * One-stop shop for setting address field content. The input may be either a DwtInputField or a
 * ZmAddressInputField. The address(es) passed in may be a string, an array, or an AjxVector. The
 * latter two types may have a member type of string, AjxEmailAddress, or ZmContact/ZmResource.
 * 
 * @param addrInput
 * @param addrs
 * @param type
 * @param shortForm
 * 
 * @private
 */
ZmApptEditView.prototype._setAddresses =
function(addrInput, addrs, type, shortForm) {

	// non-person attendees are shown in short form by default
	shortForm = (shortForm || (type && type != ZmCalBaseItem.PERSON));

	// if we get a string with multiple email addresses, split it
	if (typeof addrs == "string" && (addrs.indexOf(ZmAppt.ATTENDEES_SEPARATOR) != -1)) {
		var result = AjxEmailAddress.parseEmailString(addrs, type);
		addrs = result.good;
	}

	if (addrs.isAjxVector) {
		//todo - why aren't we using ZmRecipients way more here? We probably could use a refactoring to unite this code with the
		//mail compose recipients case - same thing as attendees, more or less.
		addrs = ZmRecipients.expandAddrs(addrs);  //expand groups to their individual emails (not DLs).
	}

	// make sure we have an array to deal with
	addrs = (addrs instanceof AjxVector) ? addrs.getArray() : (typeof addrs == "string") ? [addrs] : addrs;

	addrInput.clear();
	if (addrs && addrs.length) {
        var len = addrs.length;
		for (var i = 0; i < len; i++) {
			var addr = addrs[i];
			if (addr) {
				var addrStr, email, match;
				if (typeof addr == "string") {
					addrStr = addr;
				}
				else if (addr.isAjxEmailAddress) {
					addrStr = addr.toString(shortForm);
					match = {isDL: addr.isGroup && addr.canExpand, email: addrStr};
				}
				else if (addr instanceof ZmContact) {
					email = addr.getEmail(true);
                    //bug: 57858 - give preference to lookup email address if its present
                    //bug:60427 to show display name format the lookupemail
                    addrStr = addr.getLookupEmail() ? (new AjxEmailAddress(addr.getLookupEmail(),null,addr.getFullNameForDisplay())).toString() : ZmApptViewHelper.getAttendeesText(addr, type);
                    match = {isDL: addr.isGroup() && addr.canExpand, email: addrStr};
				}
				addrInput.addBubble({address:addrStr, match:match, skipNotify:true});
			}
		}
	}
};

// Transfers addresses from the location/resource picker to the appt compose view.
ZmApptEditView.prototype._locationPickerOkCallback =
function(addrType, attendees) {

    this.parent.updateAttendees(attendees, addrType);

    if(this._attInputField[addrType]) {
        this._attInputField[addrType].setEnabled(true);
        this._activeInputField = addrType;        
    }

    if(addrType == ZmCalBaseItem.LOCATION || addrType == ZmCalBaseItem.EQUIPMENT) {
        this.updateAttendeesCache(addrType, this._attendees[addrType].getArray());
        var attendeeStr = ZmApptViewHelper.getAttendeesString(this._attendees[addrType].getArray(), addrType);
        this.setAttendeesField(addrType, attendeeStr);        
    }
    
	this._attendeePicker[addrType].popdown();
};

// Updates the local cache with attendee objects
ZmApptEditView.prototype.updateAttendeesCache =
function(addrType, attendees){

    if (!(attendees && attendees.length)) return "";

    var a = [];
    for (var i = 0; i < attendees.length; i++) {
        var attendee = attendees[i];
        var addr = attendee.getLookupEmail() || attendee.getEmail();
        var key = addr + "-" + addrType;
        this._attendeesHashMap[key] = attendee;
    }
};

ZmApptEditView.prototype.setAttendeesField =
function(addrType, attendees){
    this._setAddresses(this._attInputField[addrType], attendees);
    this._handleAttendeeField(addrType);
};


ZmApptEditView.prototype._attendeePickerCancelCallback =
function(addrType) {
    if(this._attInputField[addrType]) {
        this._handleAttendeeField(addrType);
        this._attInputField[addrType].setEnabled(true);
    }
};

// Transfers addresses from the contact picker to the appt compose view.
ZmApptEditView.prototype._contactPickerOkCallback =
function(addrs) {
    this._forwardToField.setEnabled(true);
    var vec = (addrs instanceof AjxVector) ? addrs : addrs[AjxEmailAddress.TO];
	this._setAddresses(this._forwardToField, vec);
    this._activeInputField = ZmCalBaseItem.PERSON;
    this._handleAttendeeField(ZmCalBaseItem.PERSON);
	//this._contactPicker.removePopdownListener(this._controller._dialogPopdownListener);
	this._contactPicker.popdown();
};

ZmApptEditView.prototype._contactPickerCancelCallback =
function() {
    this._handleAttendeeField(ZmCalBaseItem.PERSON);
    this._forwardToField.setEnabled(true);
};

ZmApptEditView.prototype.getForwardAddress =
function() {
    return this._collectForwardAddrs();
};

// Grab the good addresses out of the forward to field
ZmApptEditView.prototype._collectForwardAddrs =
function() {
    return this._collectAddrs(this._forwardToField.getValue());
};

// Grab the good addresses out of the forward to field
ZmApptEditView.prototype._collectAddrs =
function(addrStr) {
    var addrs = {};
    addrs[ZmApptEditView.BAD] = new AjxVector();
    var val = AjxStringUtil.trim(addrStr);
    if (val.length == 0) return addrs;
    var result = AjxEmailAddress.parseEmailString(val, AjxEmailAddress.TO, false);
    if (result.all.size() == 0) return addrs;
    addrs.gotAddress = true;
    addrs[AjxEmailAddress.TO] = result;
    if (result.bad.size()) {
        addrs[ZmApptEditView.BAD].addList(result.bad);
        addrs.badType = AjxEmailAddress.TO;
    }
    return addrs;
};


ZmApptEditView.prototype.initialize =
function(calItem, mode, isDirty, apptComposeMode) {
    this._fbCache.clearCache();
    this._editViewInitialized = false;
    this._isForward = (apptComposeMode == ZmApptComposeView.FORWARD);
    this._isProposeTime = (apptComposeMode == ZmApptComposeView.PROPOSE_TIME);
    this._apptComposeMode = apptComposeMode;

    ZmCalItemEditView.prototype.initialize.call(this, calItem, mode, isDirty, apptComposeMode);

    var scheduleView = this.getScheduleView();
    scheduleView.initialize(calItem, mode, isDirty, apptComposeMode);
};

ZmApptEditView.prototype.isSuggestionsNeeded =
function() {
    if (appCtxt.isOffline) {
        var ac = window["appCtxt"].getAppController();
        return !this._isForward && this.GROUP_CALENDAR_ENABLED && ac._isPrismOnline && ac._isUserOnline;
    } else {
        return !this._isForward && this.GROUP_CALENDAR_ENABLED;
    }
};

ZmApptEditView.prototype.getCalendarAccount =
function() {
	var cal = appCtxt.getById(this._folderSelect.getValue());
	return cal && cal.getAccount();
};

ZmApptEditView.prototype._folderListener =
function() {
	var calId = this._folderSelect.getValue();
	var cal = appCtxt.getById(calId);

	// bug: 48189 - Hide schedule tab for non-ZCS acct
	if (appCtxt.isOffline) {
        var currAcct = cal.getAccount();
        appCtxt.accountList.setActiveAccount(currAcct);
		this.setSchedulerVisibility(currAcct.isZimbraAccount && !currAcct.isMain);
	}

	var isEnabled = !appCtxt.isRemoteId(cal.id) || cal.hasPrivateAccess();

    this._privateCheckbox.disabled = !isEnabled;

    if(this._schedulerOpened) {
        var organizer = this._isProposeTime ? this.getCalItemOrganizer() : this.getOrganizer();
        this._scheduleView.update(this._dateInfo, organizer, this._attendees);
        this._scheduleView.updateFreeBusy();
    }
	if (appCtxt.isOffline) {
        this._calItem.setFolderId(calId);
		this.enableInputs(true); //enableInputs enables or disables the attendees/location/etc inputs based on the selected folder (calendar) - if it's local it will be disabled, and if remote - enabled.
	}
};

ZmApptEditView.prototype.setSchedulerVisibility =
function(visible) {
    Dwt.setVisible(this._schedulerOptions, visible);
    Dwt.setVisible(this._schedulerContainer, visible);
    this.resize();
};

ZmApptEditView.prototype._resetFolderSelect =
function(calItem, mode) {
	ZmCalItemEditView.prototype._resetFolderSelect.call(this, calItem, mode);
	this._resetAutocompleteListView(appCtxt.getById(calItem.folderId));
};

ZmApptEditView.prototype._resetAttendeesField =
function(enabled) {
	var attField = this._attInputField[ZmCalBaseItem.PERSON];
	if (attField) {
		attField.setEnabled(enabled);
	}

	attField = this._attInputField[ZmCalBaseItem.OPTIONAL_PERSON];
	if (attField) {
		attField.setEnabled(enabled);
	}
};

ZmApptEditView.prototype._folderPickerCallback =
function(dlg, folder) {
	ZmCalItemEditView.prototype._folderPickerCallback.call(this, dlg, folder);
	this._resetAutocompleteListView(folder);
	if (appCtxt.isOffline) {
		this._resetAttendeesField(!folder.getAccount().isMain);
	}
};

ZmApptEditView.prototype._resetAutocompleteListView =
function(folder) {
	if (appCtxt.multiAccounts && this._acContactsList) {
		this._acContactsList.setActiveAccount(folder.getAccount());
	}
};

ZmApptEditView.prototype._initAutocomplete =
function() {

	var acCallback = this._autocompleteCallback.bind(this);
	var keyPressCallback = this._onAttendeesChange.bind(this);
	this._acList = {};

	var params = {
		dataClass:			appCtxt.getAutocompleter(),
		matchValue:			ZmAutocomplete.AC_VALUE_FULL,
		compCallback:		acCallback,
		keyPressCallback:	keyPressCallback
	};

	// autocomplete for attendees (required and optional) and forward recipients
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED))	{
		params.contextId = [this._controller.getCurrentViewId(), ZmCalBaseItem.PERSON].join("-");
		var aclv = this._acContactsList = new ZmAutocompleteListView(params);
		this._setAutocompleteHandler(aclv, ZmCalBaseItem.PERSON);
		this._setAutocompleteHandler(aclv, ZmCalBaseItem.OPTIONAL_PERSON);
        if (this._forwardToField) {
			this._setAutocompleteHandler(aclv, ZmCalBaseItem.FORWARD, this._forwardToField);
        }
	}

	if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
		// autocomplete for locations		
		params.keyUpCallback = this._handleLocationChange.bind(this);
        //params.matchValue = ZmAutocomplete.AC_VALUE_NAME;
		params.options = { type: ZmAutocomplete.AC_TYPE_LOCATION };
		if (AjxEnv.isIE) {
			params.keyDownCallback = this._resetKnownLocation.bind(this);
		}
		params.contextId = [this._controller.getCurrentViewId(), ZmCalBaseItem.LOCATION].join("-");
		var aclv = this._acLocationsList = new ZmAutocompleteListView(params);
		this._setAutocompleteHandler(aclv, ZmCalBaseItem.LOCATION);
	}

    if (appCtxt.get(ZmSetting.GAL_ENABLED) && this.GROUP_CALENDAR_ENABLED) {
		// autocomplete for locations
		var app = appCtxt.getApp(ZmApp.CALENDAR);
        params.keyUpCallback = this._handleResourceChange.bind(this);
        //params.matchValue = ZmAutocomplete.AC_VALUE_NAME;
        params.options = { type:ZmAutocomplete.AC_TYPE_EQUIPMENT };
		params.contextId = [this._controller.getCurrentViewId(), ZmCalBaseItem.EQUIPMENT].join("-");
		var aclv = this._acResourcesList = new ZmAutocompleteListView(params);
        this._setAutocompleteHandler(aclv, ZmCalBaseItem.EQUIPMENT);
	}
};

ZmApptEditView.prototype._handleResourceChange =
function(event, aclv, result) {
	var val = this._attInputField[ZmCalBaseItem.EQUIPMENT].getValue();
	if (val == "") {
		this.parent.updateAttendees([], ZmCalBaseItem.EQUIPMENT);
		this._isKnownResource = false;
	}
};


ZmApptEditView.prototype._setAutocompleteHandler =
function(aclv, attType, input) {

	input = input || this._attInputField[attType];
	input.setAutocompleteListView(aclv);
	aclv.handle(input.getInputElement(), input._htmlElId);

	this._acList[attType] = aclv;
};

ZmApptEditView.prototype._handleLocationChange =
function(event, aclv, result) {
	var val = this._attInputField[ZmCalBaseItem.LOCATION].getValue();
	if (val == "") {
		this.parent.updateAttendees([], ZmCalBaseItem.LOCATION);
		this._isKnownLocation = false;
	}
};

ZmApptEditView.prototype._autocompleteCallback =
function(text, el, match) {
	if (!match) {
		DBG.println(AjxDebug.DBG1, "ZmApptEditView: match empty in autocomplete callback; text: " + text);
		return;
	}
	var attendee = match.item;
    var type = el && el._attType;
	if (attendee) {
		if (type == ZmCalBaseItem.FORWARD) {
            DBG.println("forward auto complete match : " + match)
            return;
        }
		if (type == ZmCalBaseItem.LOCATION || type == ZmCalBaseItem.EQUIPMENT) {
			var name = ZmApptViewHelper.getAttendeesText(attendee);
			if(name) {
				this._locationTextMap[name] = attendee;
			}
			var locations = text.split(/[\n,;]/);
			var newAttendees = [];
			for(var i = 0; i < locations.length; i++) {
				var l = AjxStringUtil.trim(locations[i]);
				if(this._locationTextMap[l]) {
					newAttendees.push(this._locationTextMap[l]);
				}
			}
			attendee = newAttendees;
		}

        //controller tracks both optional & required attendees in common var
        if (type == ZmCalBaseItem.OPTIONAL_PERSON) {
            this.setAttendeesRole(attendee, ZmCalItem.ROLE_OPTIONAL);
            type = ZmCalBaseItem.PERSON;
        }

		this.parent.updateAttendees(attendee, type, (type == ZmCalBaseItem.LOCATION || type == ZmCalBaseItem.EQUIPMENT )?ZmApptComposeView.MODE_REPLACE : ZmApptComposeView.MODE_ADD);

		if (type == ZmCalBaseItem.LOCATION) {
			this._isKnownLocation = true;
		}else if(type == ZmCalBaseItem.EQUIPMENT){
            this._isKnownResource = true;
        }

        this._updateScheduler(type, attendee);

	}else if(match.email){
        if((type == ZmCalBaseItem.PERSON || type == ZmCalBaseItem.OPTIONAL_PERSON) && this._scheduleAssistant) {
            var attendees = this.getAttendeesFromString(ZmCalBaseItem.PERSON, this._attInputField[type].getValue());
            this.setAttendeesRole(attendees, (type == ZmCalBaseItem.OPTIONAL_PERSON) ? ZmCalItem.ROLE_OPTIONAL : ZmCalItem.ROLE_REQUIRED);
            if (type == ZmCalBaseItem.OPTIONAL_PERSON) {
                type = ZmCalBaseItem.PERSON;
            }
            this.parent.updateAttendees(attendees, type, (type == ZmCalBaseItem.LOCATION )?ZmApptComposeView.MODE_REPLACE : ZmApptComposeView.MODE_ADD);
            this._updateScheduler(type, attendees);
        }
    }

    this.updateToolbarOps();
};

ZmApptEditView.prototype._handleAddedAttendees =
function(addrType) {
	this._activeInputField = addrType;
    this.handleAttendeeChange();
};

ZmApptEditView.prototype._handleRemovedAttendees =
function(addrType) {
    this._activeInputField = addrType;
    this.handleAttendeeChange();
};

ZmApptEditView.prototype._addEventHandlers =
function() {
	var edvId = AjxCore.assignId(this);

	// add event listeners where necessary
	Dwt.setHandler(this._allDayCheckbox, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
	Dwt.setHandler(this._repeatDescField, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
	if (this._showOptional) {
		this._makeFocusable(this._showOptional);
		Dwt.setHandler(this._showOptional, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
	}
	if (this._showResources) {
		this._makeFocusable(this._showResources);
		Dwt.setHandler(this._showResources, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
	}
	Dwt.setHandler(this._repeatDescField, DwtEvent.ONMOUSEOVER, ZmCalItemEditView._onMouseOver);
	Dwt.setHandler(this._repeatDescField, DwtEvent.ONMOUSEOUT, ZmCalItemEditView._onMouseOut);
	Dwt.setHandler(this._startDateField, DwtEvent.ONCHANGE, ZmCalItemEditView._onChange);
	Dwt.setHandler(this._endDateField, DwtEvent.ONCHANGE, ZmCalItemEditView._onChange);
	Dwt.setHandler(this._startDateField, DwtEvent.ONFOCUS, ZmCalItemEditView._onFocus);
	Dwt.setHandler(this._endDateField, DwtEvent.ONFOCUS, ZmCalItemEditView._onFocus);
    if (this.GROUP_CALENDAR_ENABLED) {
        this._makeFocusable(this._suggestTime);
        Dwt.setHandler(this._suggestTime, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
    }
    this._makeFocusable(this._suggestLocation);
    Dwt.setHandler(this._suggestLocation, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);
    this._makeFocusable(this._locationStatusAction);
    Dwt.setHandler(this._locationStatusAction, DwtEvent.ONCLICK, ZmCalItemEditView._onClick);

	this._allDayCheckbox._editViewId = this._repeatDescField._editViewId = edvId;
	this._startDateField._editViewId = this._endDateField._editViewId = edvId;
    if(this._showOptional) this._showOptional._editViewId = edvId;
    if(this._showResources) this._showResources._editViewId = edvId;
    if (this.GROUP_CALENDAR_ENABLED) {
        this._suggestTime._editViewId = edvId;
    }
    this._suggestLocation._editViewId = edvId;
    this._locationStatusAction._editViewId = edvId;

	var inputFields = [this._attendeesInputField, this._optAttendeesInputField,
					   this._locationInputField, this._forwardToField, this._resourceInputField];
	for (var i = 0; i < inputFields.length; i++) {
        if(!inputFields[i]) continue;
		var inputField = inputFields[i];
		var inputEl = inputField.getInputElement();
        inputEl._editViewId = edvId;
		inputField.addListener(DwtEvent.ONFOCUS, this._handleOnFocus.bind(this, inputEl));
		inputField.addListener(DwtEvent.ONBLUR, this._handleOnBlur.bind(this, inputEl));
        inputEl.onkeyup = AjxCallback.simpleClosure(this._onAttendeesChange, this);
	}

    if (this._subjectField) {
        this._subjectField.addListener(DwtEvent.ONBLUR, this._handleSubjectOnBlur.bind(this));
    }
};

// cache all input fields so we dont waste time traversing DOM each time
ZmApptEditView.prototype._cacheFields =
function() {
	ZmCalItemEditView.prototype._cacheFields.call(this);
	this._allDayCheckbox = document.getElementById(this._allDayCheckboxId);
};

ZmApptEditView.prototype._resetTimezoneSelect =
function(calItem, isAllDayAppt) {
	this._tzoneSelectStart.setSelectedValue(calItem.timezone);
	this._tzoneSelectEnd.setSelectedValue(calItem.endTimezone || calItem.timezone);
    this.handleTimezoneOverflow();
};

ZmApptEditView.prototype._setTimezoneVisible =
function(dateInfo) {
    var showTimezones = appCtxt.get(ZmSetting.CAL_SHOW_TIMEZONE) || dateInfo.timezone != AjxTimezone.getServerId(AjxTimezone.DEFAULT);
	var showStartTimezone = showTimezones && !dateInfo.isAllDay;
	var showEndTimezone = showStartTimezone && this._repeatSelect && this._repeatSelect.getValue()=="NON";

    if (this._tzoneSelectStartElement) {
        Dwt.setVisible(this._tzoneSelectStartElement, showStartTimezone);
        Dwt.setVisibility(this._tzoneSelectStartElement, showStartTimezone);
    }

    if (this._tzoneSelectEndElement) {
        Dwt.setVisible(this._tzoneSelectEndElement, showEndTimezone);
        Dwt.setVisibility(this._tzoneSelectEndElement, showEndTimezone);
    }
};

ZmApptEditView.prototype._showTimeFields =
function(show) {
	Dwt.setVisibility(this._startTimeSelect.getHtmlElement(), show);
	Dwt.setVisibility(this._endTimeSelect.getHtmlElement(), show);
	this._setTimezoneVisible(this._dateInfo);
};

ZmApptEditView.CHANGES_LOCAL            = 1;
ZmApptEditView.CHANGES_SIGNIFICANT      = 2;
ZmApptEditView.CHANGES_INSIGNIFICANT    = 3;
ZmApptEditView.CHANGES_TIME_RECURRENCE  = 4;


ZmApptEditView.prototype._getFormValue =
function(type, attribs){

   var vals = [];
   attribs = attribs || {};
    
   switch(type){

       case ZmApptEditView.CHANGES_LOCAL:
            vals.push(this._folderSelect.getValue());           // Folder
            vals.push(this._showAsSelect.getValue());           // Busy Status
            if(!attribs.excludeReminder){                       // Reminder
                vals.push(this._reminderSelectInput.getValue());
                vals.push(this._reminderEmailCheckbox.isSelected());
                vals.push(this._reminderDeviceEmailCheckbox.isSelected());
            }
            break;

       case ZmApptEditView.CHANGES_SIGNIFICANT:

           vals = this._getTimeAndRecurrenceChanges();

           if (!attribs.excludeAttendees) {                    //Attendees
               vals.push(ZmApptViewHelper.getAttendeesString(this._attendees[ZmCalBaseItem.PERSON].getArray(), ZmCalBaseItem.PERSON, false, true));
           }
           if(!attribs.excludeLocation) {
               vals.push(ZmApptViewHelper.getAttendeesString(this._attendees[ZmCalBaseItem.LOCATION].getArray(), ZmCalBaseItem.LOCATION, false, true));
               //location can even be a normal label text
               vals.push(this._locationInputField.getValue());
           }
           if(!attribs.excludeEquipment) {
               vals.push(ZmApptViewHelper.getAttendeesString(this._attendees[ZmCalBaseItem.EQUIPMENT].getArray(), ZmCalBaseItem.EQUIPMENT, false, true));
           }

           if(this._isForward && !attribs.excludeAttendees) {
               vals.push(this._forwardToField.getValue()); //ForwardTo
           }
           if(this.identitySelect){
               vals.push(this.getIdentity().id);            //Identity Select
           }
           break;

       case ZmApptEditView.CHANGES_INSIGNIFICANT:
           vals.push(this._subjectField.getValue());
           vals.push(this._notesHtmlEditor.getContent());
           vals.push(this._privateCheckbox.checked ? ZmApptEditView.PRIVACY_OPTION_PRIVATE : ZmApptEditView.PRIVACY_OPTION_PUBLIC);
           //TODO: Attachments, Priority    
           break;

       case ZmApptEditView.CHANGES_TIME_RECURRENCE:
           vals = this._getTimeAndRecurrenceChanges();
           break;
   }

   vals = vals.join("|").replace(/\|+/, "|");

   return vals;
};

ZmApptEditView.prototype._getTimeAndRecurrenceChanges = function(){
           var vals = [];
           var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
           var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
           startDate = this._startTimeSelect.getValue(startDate);
           endDate = this._endTimeSelect.getValue(endDate);
           vals.push(
                   AjxDateUtil.getServerDateTime(startDate),       // Start DateTime
                   AjxDateUtil.getServerDateTime(endDate)          // End DateTime
                   );
           if (Dwt.getDisplay(this._tzoneSelectStart.getHtmlElement()) != Dwt.DISPLAY_NONE) {
               vals.push(this._tzoneSelectStart.getValue());    // Start timezone
               vals.push(this._tzoneSelectEnd.getValue());      // End timezone
           }
           vals.push("" + this._allDayCheckbox.checked);       // All Day Appt.
           //TODO: Detailed Recurrence, Repeat support
           vals.push(this._repeatSelect.getValue());        //Recurrence

           return vals;
}

// Returns a string representing the form content
ZmApptEditView.prototype._formValue =
function(excludeAttendees, excludeReminder) {

    var attribs = {
        excludeAttendees: excludeAttendees,
        excludeReminder: excludeReminder
    };

    var sigFormValue      = this._getFormValue(ZmApptEditView.CHANGES_SIGNIFICANT, attribs);
    var insigFormValue    = this._getFormValue(ZmApptEditView.CHANGES_INSIGNIFICANT, attribs);
    var localFormValue    = this._getFormValue(ZmApptEditView.CHANGES_LOCAL, attribs);

    var formVals = [];
    formVals.push(sigFormValue, insigFormValue, localFormValue);
    formVals = formVals.join('|').replace(/\|+/, "|");
    return formVals;
};


ZmApptEditView.prototype.checkIsDirty =
function(type, attribs){
    return (this._apptFormValue[type] != this._getFormValue(type, attribs))
};

ZmApptEditView.prototype._keyValue =
function() {

    return this._getFormValue(ZmApptEditView.CHANGES_SIGNIFICANT,
                              {excludeAttendees: true, excludeEquipment: true});
};

// Listeners

ZmApptEditView.prototype._getDateTimeText =
function() {
    return this._dateInfo.startDate + "-" + this._dateInfo.startTimeStr + "_" +
           this._dateInfo.endDate   + "_" + this._dateInfo.endTimeStr;

}

ZmApptEditView.prototype._timeChangeListener =
function(ev, id) {
	DwtTimeInput.adjustStartEnd(ev, this._startTimeSelect, this._endTimeSelect, this._startDateField, this._endDateField, this._dateInfo, id);
	var oldTimeInfo = this._getDateTimeText();

    ZmApptViewHelper.getDateInfo(this, this._dateInfo);
    var newTimeInfo = this._getDateTimeText();
    if (oldTimeInfo != newTimeInfo) {

        this._dateInfo.isTimeModified = true;

        if(this._schedulerOpened) {
            this._scheduleView._timeChangeListener(ev, id);
        }

        if(this._scheduleAssistant) this._scheduleAssistant.updateTime(true, true);

        var durationInfo = this.getDurationInfo();
        this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
        this._locationConflictAppt.endDate   = new Date(durationInfo.endTime);

        // Warn the user if trying to schedule an appointment in the past.
        ZmApptViewHelper.warnIfApptStartingInPast(this._locationConflictAppt.startDate, this._htmlElId);

        this.locationConflictChecker();
    }
};

ZmApptEditView.prototype._recurChangeForLocationConflict =
function() {
    this._getRecurrence(this._locationConflictAppt);
    this.locationConflictChecker();
}

ZmApptEditView.prototype._dateTimeChangeForLocationConflict =
function(oldTimeInfo) {
    var newTimeInfo = this._getDateTimeText();
    if (oldTimeInfo != newTimeInfo) {
        var durationInfo = this.getDurationInfo();
        this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
        this._locationConflictAppt.endDate   = new Date(durationInfo.endTime);
        this.locationConflictChecker();
    }
}

ZmApptEditView.prototype._dateCalSelectionListener =
function(ev) {
    var oldTimeInfo = this._getDateTimeText();

    ZmCalItemEditView.prototype._dateCalSelectionListener.call(this, ev);
    if(this._schedulerOpened) {
        ZmApptViewHelper.getDateInfo(this, this._dateInfo);
        this._scheduleView._updateFreeBusy();
    }
    
    if(this._scheduleAssistant) this._scheduleAssistant.updateTime(true, true);

    this._dateTimeChangeForLocationConflict(oldTimeInfo);
};


ZmApptEditView.prototype.handleTimezoneOverflow =
function() {
    var timezoneTxt = this._tzoneSelectStart.getText();
    var limit = AjxEnv.isIE ? 25 : 30;
    if(timezoneTxt.length > limit) {
        var newTimezoneTxt = timezoneTxt.substring(0, limit) + '...';
        this._tzoneSelectStart.setText(newTimezoneTxt);
    }
    var option = this._tzoneSelectStart.getSelectedOption();
    this._tzoneSelectStart.setToolTipContent(option ? option.getDisplayValue() : timezoneTxt);
    timezoneTxt = this._tzoneSelectEnd.getText();
    if(timezoneTxt.length > limit) {
        var newTimezoneTxt = timezoneTxt.substring(0, limit) + '...';
        this._tzoneSelectEnd.setText(newTimezoneTxt);
    }
    option = this._tzoneSelectEnd.getSelectedOption();
    this._tzoneSelectEnd.setToolTipContent(option ? option.getDisplayValue() : timezoneTxt);
};

ZmApptEditView.prototype._timezoneListener =
function(ev) {
    var oldTZ = this._dateInfo.timezone;
    var dwtSelect = ev.item.parent.parent;
    var type = dwtSelect ? dwtSelect.getData(ZmApptEditView.TIMEZONE_TYPE) : ZmApptEditView.START_TIMEZONE;
    //bug: 55256 - Changing start timezone should auto-change end timezone
    if(type == ZmApptEditView.START_TIMEZONE) {
        var tzValue = dwtSelect.getValue();
        this._tzoneSelectEnd.setSelectedValue(tzValue);
    }
    this.handleTimezoneOverflow();
	ZmApptViewHelper.getDateInfo(this, this._dateInfo);
    if(this._schedulerOpened) {
        //this._controller.getApp().getFreeBusyCache().clearCache();
        this._scheduleView._timeChangeListener(ev);
    }

    if (oldTZ != this._dateInfo.timezone) {
        this._locationConflictAppt.timezone = this._dateInfo.timezone;
        this.locationConflictChecker();
    }
};


ZmApptEditView.prototype._repeatChangeListener =
function(ev) {
    ZmCalItemEditView.prototype._repeatChangeListener.call(this, ev);
    this._setTimezoneVisible(this._dateInfo);
    var newSelectVal = ev._args.newValue;
    if (newSelectVal != "CUS") {
        // CUS (Custom) launches a dialog. Otherwise act upon the change here
        this._resetRecurrence(this._calItem);
        this._resetRecurrence(this._locationConflictAppt);

        this._locationConflictAppt.setRecurType(newSelectVal);
        this.locationConflictChecker();
    }
    if (newSelectVal === "WEE") {
        this._calItem._recurrence.repeatCustom =1;
    }
};

ZmApptEditView.prototype._resetRecurrence =
function(calItem) {
    // see ZmRecurrence
    var recur = calItem._recurrence;
    var startDate = recur._startDate || calItem.startDate;
    recur.repeatBySetPos = 1;
    recur.repeatCustom = 0;
    recur.repeatCustomCount = 1;
    recur.repeatCustomDayOfWeek = ZmCalItem.SERVER_WEEK_DAYS[startDate.getDay()];
    recur.repeatCustomDays = null;
    recur.repeatCustomMonthDay = startDate.getDate();
    recur.repeatCustomOrdinal = null;
    recur.repeatCustomType = "S";
    recur.repeatEndCount = 1;
    recur.repeatEndDate = null;
    recur.repeatEndType = "N";
    recur.repeatMonthlyDayList = [startDate.getDate()];
    recur.repeatWeekday = false;
    recur.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[startDate.getDay()]];
    recur.repeatYearlyMonthsList = startDate.getMonth()+1;
};

/**
 * Sets the values of the attendees input fields to reflect the current lists of
 * attendees.
 */
ZmApptEditView.prototype._setAttendees =
	function() {

		for (var t = 0; t < this._attTypes.length; t++) {
			var type = this._attTypes[t];
			var attendees = this._attendees[type].getArray();
			var numAttendees = attendees.length;
			var addrInput = this._attInputField[type];
			var curVal = AjxStringUtil.trim(this._attInputField[type].getValue());
			if (type == ZmCalBaseItem.PERSON) {
				var reqAttendees = ZmApptViewHelper.filterAttendeesByRole(attendees, ZmCalItem.ROLE_REQUIRED);
				var optAttendees = ZmApptViewHelper.filterAttendeesByRole(attendees, ZmCalItem.ROLE_OPTIONAL);
				//bug: 62008 - always compute all the required/optional arrays before setting them to avoid race condition
				//_setAddress is a costly operation which will trigger focus listeners and change the state of attendees
				this._setAddresses(addrInput, reqAttendees, type);
				this._setAddresses(this._attInputField[ZmCalBaseItem.OPTIONAL_PERSON], optAttendees, type);
			}
			else if (type == ZmCalBaseItem.LOCATION) {
				if (!curVal || numAttendees || this._isKnownLocation) {
					var nonAttendeeLocationInfo = this.getNonAttendeeLocationFromString(curVal);
					this._setAddresses(addrInput, attendees, type);
					this._attInputField[ZmCalBaseItem.LOCATION].setValue(nonAttendeeLocationInfo, true, true, false);
					this._isKnownLocation = true;
				}
			}
			else if (type == ZmCalBaseItem.EQUIPMENT) {
				if (!curVal || numAttendees) {
					if (numAttendees) {
						this._toggleResourcesField(true);
					}
					this._setAddresses(addrInput, attendees, type);
				}
			}
		}
	};

ZmApptEditView.prototype.removeAttendees =
function(attendees, type) {
    attendees = (attendees instanceof AjxVector) ? attendees.getArray() :
				(attendees instanceof Array) ? attendees : [attendees];

    for (var i = 0; i < attendees.length; i++) {
        var attendee = attendees[i];
        var idx = -1;
        if (attendee instanceof ZmContact) {
            idx = this._attendees[type].indexOfLike(attendee, attendee.getAttendeeKey);
            if (idx !== -1) {
                this._attendees[type].removeAt(idx);
            }
        }
        else {
            this._attendees[type].remove(attendee);
        }
    }
};

ZmApptEditView.prototype.setApptLocation =
function(val) {
    this._setAddresses(this._attInputField[ZmCalBaseItem.LOCATION], val);
};

ZmApptEditView.prototype.getAttendees =
function(type) {
    return this.getAttendeesFromString(type, this._attInputField[type].getValue());
};

ZmApptEditView.prototype.getMode =
function(type) {
    return this._mode;
};

ZmApptEditView.prototype.getRequiredAttendeeEmails =
function() {
    var attendees = [];
    var inputField = this._attInputField[ZmCalBaseItem.PERSON];
    if(!inputField) { return attendees; } // input field can be null if zimbraFeatureGroupCalendarEnabled is FALSE

    var requiredEmails = inputField.getValue();
    var items = AjxEmailAddress.split(requiredEmails);
    for (var i = 0; i < items.length; i++) {

        var item = AjxStringUtil.trim(items[i]);
        if (!item) { continue; }

        var contact = AjxEmailAddress.parse(item);
        if (!contact) { continue; }        

        var email = contact.getAddress();
        if(email instanceof Array) email = email[0];

        attendees.push(email)
    }
    return attendees;
};

ZmApptEditView.prototype.getOrganizerEmail =
function() {
    var organizer = this.getOrganizer();
    var email = organizer.getEmail();
    if (email instanceof Array) {
        email = email[0];
    }
    return email;
};

ZmApptEditView.prototype._handleAttendeeField =
function(type, useException) {
	if (!this._activeInputField || !this.GROUP_CALENDAR_ENABLED) { return; }
	if (type != ZmCalBaseItem.LOCATION) {
		this._controller.clearInvalidAttendees();
	}

    return this._pickAttendeesInfo(type, useException);
};

ZmApptEditView.prototype._pickAttendeesInfo =
function(type, useException) {
    var attendees = new AjxVector();

    if(type == ZmCalBaseItem.OPTIONAL_PERSON || type == ZmCalBaseItem.PERSON || type == ZmCalBaseItem.FORWARD) {
        attendees = this.getAttendeesFromString(ZmCalBaseItem.PERSON, this._attInputField[ZmCalBaseItem.PERSON].getValue());
        this.setAttendeesRole(attendees, ZmCalItem.ROLE_REQUIRED);
        
        var optionalAttendees = this.getAttendeesFromString(ZmCalBaseItem.PERSON, this._attInputField[ZmCalBaseItem.OPTIONAL_PERSON].getValue(), true);
        this.setAttendeesRole(optionalAttendees, ZmCalItem.ROLE_OPTIONAL);
        
        var forwardAttendees = this.getAttendeesFromString(ZmCalBaseItem.PERSON, this._attInputField[ZmCalBaseItem.FORWARD].getValue(), false);
        this.setAttendeesRole(forwardAttendees, ZmCalItem.ROLE_REQUIRED);

        //merge optional & required attendees to update parent controller
        attendees.addList(optionalAttendees);
        attendees.addList(forwardAttendees);
        type = ZmCalBaseItem.PERSON;
    }else {
        var value = this._attInputField[type].getValue();        
        attendees = this.getAttendeesFromString(type, value);
    }
    return this._updateAttendeeFieldValues(type, attendees);
};

ZmApptEditView.prototype.setAttendeesRole =
function(attendees, role) {

    var personalAttendees = (attendees instanceof AjxVector) ? attendees.getArray() :
                (attendees instanceof Array) ? attendees : [attendees];

    for (var i = 0; i < personalAttendees.length; i++) {
        var attendee = personalAttendees[i];
        if(attendee) attendee.setParticipantRole(role);
    }
};

ZmApptEditView.prototype.resetParticipantStatus =
function() {
    if (this.isOrganizer() && this.isKeyInfoChanged()) {
        var personalAttendees = this._attendees[ZmCalBaseItem.PERSON].getArray();
        for (var i = 0; i < personalAttendees.length; i++) {
            var attendee = personalAttendees[i];
            if(attendee) attendee.setParticipantStatus(ZmCalBaseItem.PSTATUS_NEEDS_ACTION);
        }
    }
};

ZmApptEditView.prototype.getAttendeesFromString =
function(type, value, markAsOptional, nonAttendeeLocationInfo) {
	var attendees = new AjxVector();
	var items = AjxEmailAddress.split(value);

	for (var i = 0; i < items.length; i++) {
		var item = AjxStringUtil.trim(items[i]);
		if (!item) { continue; }

        var contact = AjxEmailAddress.parse(item);
        if (!contact) {
            if(type != ZmCalBaseItem.LOCATION) {
                this._controller.addInvalidAttendee(item);
            } else if (nonAttendeeLocationInfo) {
                nonAttendeeLocationInfo.push(item);
            }
            continue;
        }

        var addr = contact.getAddress();
        var key = addr + "-" + type;
        if(!this._attendeesHashMap[key]) {
            this._attendeesHashMap[key] = ZmApptViewHelper.getAttendeeFromItem(item, type);
        }
        var attendee = this._attendeesHashMap[key];
		if (attendee) {
            if(markAsOptional) attendee.setParticipantRole(ZmCalItem.ROLE_OPTIONAL);
			attendees.add(attendee);
		} else if (type != ZmCalBaseItem.LOCATION) {
			this._controller.addInvalidAttendee(item);
		}
	}

    return attendees;
};


ZmApptEditView.prototype.getNonAttendeeLocationFromString = function(value) {
	var items = AjxEmailAddress.split(value);
	var nonAttendeeLocationInfo = [];

	for (var i = 0; i < items.length; i++) {
		var item = AjxStringUtil.trim(items[i]);
		if (item) {
			if (!AjxEmailAddress.parse(item)) {
				// No contact found
				nonAttendeeLocationInfo.push(item);
			}
		}
	}
	return nonAttendeeLocationInfo.join(AjxEmailAddress.DELIMS[0]);
};


ZmApptEditView.prototype._updateAttendeeFieldValues =
function(type, attendees) {
	// *always* force replace of attendees list with what we've found
	this.parent.updateAttendees(attendees, type);
    this._updateScheduler(type, attendees);
   appCtxt.notifyZimlets("onEditAppt_updateAttendees", [this]);//notify Zimlets
};

ZmApptEditView.prototype._updateScheduler =
function(type, attendees) {
        // *always* force replace of attendees list with what we've found

    attendees = (attendees instanceof AjxVector) ? attendees.getArray() :
                (attendees instanceof Array) ? attendees : [attendees];

    if (appCtxt.isOffline && !appCtxt.isZDOnline()) { return; }
    //avoid duplicate freebusy request by updating the view in sequence
    if(type == ZmCalBaseItem.PERSON) {
        this._scheduleView.setUpdateCallback(new AjxCallback(this, this.updateScheduleAssistant, [attendees, type]))
    }

    var organizer = this._isProposeTime ? this.getCalItemOrganizer() : this.getOrganizer();
    if(this._schedulerOpened) {
        this._scheduleView.update(this._dateInfo, organizer, this._attendees);
        this.resize();
    }else {
        this._toggleInlineScheduler(true);
    };

    this.updateToolbarOps();
    this.resize();

	//After everything gets rendered, run the resize method again to make the height calculations for individual components using the correct height value
	var self = this;
	setTimeout(function(){
		self.resize();
	}, 0);
};

ZmApptEditView.prototype.updateScheduleAssistant =
function(attendees, type) {
    if(this._scheduleAssistant && type == ZmCalBaseItem.PERSON) this._scheduleAssistant.updateAttendees(attendees);
};

ZmApptEditView.prototype._getAttendeeByName =
function(type, name) {
	if(!this._attendees[type]) {
		return null;
	}
	var a = this._attendees[type].getArray();
	for (var i = 0; i < a.length; i++) {
		if (a[i].getFullName() == name) {
			return a[i];
		}
	}
	return null;
};

ZmApptEditView.prototype._getAttendeeByItem =
function(item, type) {
	if(!this._attendees[type]) {
		return null;
	}
	var attendees = this._attendees[type].getArray();
	for (var i = 0; i < attendees.length; i++) {
		var value = (type == ZmCalBaseItem.PERSON) ? attendees[i].getEmail() : attendees[i].getFullName();
		if (item == value) {
			return attendees[i];
		}
	}
	return null;
};


// Callbacks

ZmApptEditView.prototype._emailValidator =
function(value) {
	// first parse the value string based on separator
	var attendees = AjxStringUtil.trim(value);
	if (attendees.length > 0) {
		var addrs = AjxEmailAddress.parseEmailString(attendees);
		if (addrs.bad.size() > 0) {
			throw ZmMsg.errorInvalidEmail2;
		}
	}

	return value;
};

ZmApptEditView.prototype._handleOnClick =
function(el) {
	if (el.id == this._allDayCheckboxId) {
		var edv = AjxCore.objectWithId(el._editViewId);
		ZmApptViewHelper.getDateInfo(edv, edv._dateInfo);
		this._showTimeFields(!el.checked);
        this.updateShowAsField(el.checked);
		if (el.checked && this._reminderSelect) {
			this._reminderSelect.setSelectedValue(1080);
		}
        this._scheduleView.handleTimeChange();
        if(this._scheduleAssistant) this._scheduleAssistant.updateTime(true, true);

        var durationInfo = this.getDurationInfo();
        this._locationConflictAppt.startDate = new Date(durationInfo.startTime);
        this._locationConflictAppt.endDate = new Date(durationInfo.endTime);
        this._locationConflictAppt.allDayEvent = el.checked ? "1" : "0";
        this.locationConflictChecker();

	} else if(el.id == this._schButtonId || el.id == this._htmlElId + "_scheduleImage") {
        this._toggleInlineScheduler();
	} else if(el.id == this._showOptionalId) {
        this._toggleOptionalAttendees();
    }else if(el.id == this._showResourcesId){
        this._toggleResourcesField();
    }else if(el.id == this._suggestTimeId){
        this._showTimeSuggestions();
    }else if(el.id == this._suggestLocationId){
        this._showLocationSuggestions();
    }else if(el.id == this._locationStatusActionId){
        this._showLocationStatusAction();
    }else{
		ZmCalItemEditView.prototype._handleOnClick.call(this, el);
	}

    // Warn the user if trying to schedule an appointment in the past.
    var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
    if (!this._allDayCheckbox.checked) {
        startDate.setHours(this._startTimeSelect.getHours(), this._startTimeSelect.getMinutes(), 0);
    }
    ZmApptViewHelper.warnIfApptStartingInPast(startDate, this._htmlElId, this._allDayCheckbox.checked);
};

ZmApptEditView.prototype._handleOnFocus =
function(inputEl) {
    if(!this._editViewInitialized) return;
	this._activeInputField = inputEl._attType;
    this.setFocusMember(inputEl);
};

ZmApptEditView.prototype.setFocusMember =
function(member) {
    var kbMgr = appCtxt.getKeyboardMgr();
    var tabGroup = kbMgr.getCurrentTabGroup();
    if (tabGroup) {
        tabGroup.setFocusMember(member);
    }
};

ZmApptEditView.prototype._handleOnBlur =
function(inputEl) {
    if(!this._editViewInitialized) return;
    this._handleAttendeeField(inputEl._attType);
	this._activeInputField = null;
};

ZmApptEditView.prototype._handleSubjectOnBlur =
function() {
	var subject = AjxStringUtil.trim(this._subjectField.getValue());
    if(subject) {
        var buttonText = subject.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT);
        appCtxt.getAppViewMgr().setTabTitle(this._controller.getCurrentViewId(), buttonText);
    }
};

ZmApptEditView.prototype._resetKnownLocation =
function() {
	this._isKnownLocation = false;
};

ZmApptEditView._switchTab =
function(type) {
	var appCtxt = window.parentAppCtxt || window.appCtxt;
	var tabView = appCtxt.getApp(ZmApp.CALENDAR).getApptComposeController().getTabView();
	var key = (type == ZmCalBaseItem.LOCATION)
		? tabView._tabKeys[ZmApptComposeView.TAB_LOCATIONS]
		: tabView._tabKeys[ZmApptComposeView.TAB_EQUIPMENT];
	tabView.switchToTab(key);
};

ZmApptEditView._showNotificationWarning =
function(ev) {
	ev = ev || window.event;
	var el = DwtUiEvent.getTarget(ev);
	if (el && !el.checked) {
		var dialog = appCtxt.getMsgDialog();
		dialog.setMessage(ZmMsg.sendNotificationMailWarning, DwtMessageDialog.WARNING_STYLE);
		dialog.popup();
	}
};

ZmApptEditView.prototype._getComponents =
function() {
	var components =
		ZmCalItemEditView.prototype._getComponents.call(this);

	components.aside.push(this._suggestions);

	return components;
};

ZmApptEditView.prototype.resize =
function() {
	ZmCalItemEditView.prototype.resize.apply(this, arguments);

	if (this._scheduleAssistant) {
		var bounds = this.boundsForChild(this._scheduleAssistant);
		this._scheduleAssistant.setSize(Dwt.CLEAR, bounds.height);
	}
};

ZmApptEditView.prototype._initAttachContainer =
function() {

	this._attachmentRow = document.getElementById(this._htmlElId + "_attachment_container");
    this._attachmentRow.style.display="";
	var cell = this._attachmentRow.insertCell(-1);
	cell.colSpan = 5;

	this._uploadFormId = Dwt.getNextId();
	this._attachDivId = Dwt.getNextId();

	var subs = {
		uploadFormId: this._uploadFormId,
		attachDivId: this._attachDivId,
		url: appCtxt.get(ZmSetting.CSFE_UPLOAD_URI)+"&fmt=extended"
	};

	cell.innerHTML = AjxTemplate.expand("calendar.Appointment#AttachContainer", subs);
};

// if user presses space or semicolon, add attendee
ZmApptEditView.prototype._onAttendeesChange =
function(ev) {

	var el = DwtUiEvent.getTarget(ev);
	// forward recipient is not an attendee

    var key = DwtKeyEvent.getCharCode(ev);
    var _nodeName = el.nodeName;
    if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) ){
        ZmAutocompleteListView.onKeyUp(ev);
    }
    if (key === DwtKeyEvent.KEY_SPACE || key === DwtKeyEvent.KEY_SEMICOLON || key === DwtKeyEvent.KEY_SEMICOLON_1) {
		this._activeInputField = el._attType;
        this.handleAttendeeChange();
    }else {
        this.updateToolbarOps();
    }

	if (el._attType == ZmCalBaseItem.LOCATION) {
		this._resetKnownLocation();
	}
};

ZmApptEditView.prototype.handleAttendeeChange =
function(ev) {
    if (this._schedActionId) {
        AjxTimedAction.cancelAction(this._schedActionId);
    }
	var attType = this._activeInputField || ZmCalBaseItem.PERSON;
    this._schedActionId = AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._handleAttendeeField, attType), 300);

    // attendee changes may cause our input fields to change their height
    this.resize();
};

ZmApptEditView.prototype.loadPreference =
function() {
    var prefDlg = appCtxt.getSuggestionPreferenceDialog();
    prefDlg.setCallback(new AjxCallback(this, this._prefChangeListener));
    // Trigger an initial location check - the appt may have been saved
    // with a location that has conflicts.  Need to do from here, so that
    // the user's numRecurrence preference is loaded
    var locationConflictCheckCallback = this.locationConflictChecker.bind(this);
    prefDlg.getSearchPreference(appCtxt.getActiveAccount(),
        locationConflictCheckCallback);
};

ZmApptEditView.prototype._prefChangeListener =
function() {
    // Preference Dialog is only displayed when the suggestions panel is visible - so update suggestions
    this._scheduleAssistant.clearResources();
    this._scheduleAssistant.suggestAction(true);

    var newNumRecurrence = this.getNumLocationConflictRecurrence();
    if (newNumRecurrence != this._scheduleAssistant.numRecurrence) {
        // Trigger Location Conflict test if enabled
        this.locationConflictChecker();
    }
};

// Show/Hide the conflict warning beneath the attendee and location input fields, and
// color any attendee or location that conflicts with the current appointment time.  If
// the appointment is recurring, the conflict status and coloration only apply for the
// current instance of the series.
ZmApptEditView.prototype.showConflicts =
function() {
    var conflictColor = "#F08080";
    var color, isFree, type, addressElId, addressEl;
    var attendeeConflict = false;
    var locationConflict = false;
    var conflictEmails = this._scheduleView.getConflicts();
    var orgEmail = this.getOrganizerEmail();
    for (var email in conflictEmails) {
        type = this.parent.getAttendeeType(email);
        if ((type == ZmCalBaseItem.PERSON) || (type == ZmCalBaseItem.LOCATION)) {
            isFree = orgEmail == email ? true : conflictEmails[email];
            if (!isFree) {
                // Record attendee or location conflict
                if (type == ZmCalBaseItem.PERSON) {
                    attendeeConflict = true
                } else {
                    locationConflict = true;
                }
            }

            // Color the address bubble or reset to default
            color = isFree ? "" : conflictColor;
            addressElId = this._attInputField[type].getAddressBubble(email);
            if (addressElId) {
                addressEl = document.getElementById(addressElId);
                if (addressEl) {
                    addressEl.style.backgroundColor = color;
                }
            }
        }
    }
    Dwt.setVisible(this._attendeeStatus, attendeeConflict);
    this.setLocationStatus(ZmApptEditView.LOCATION_STATUS_UNDEFINED, locationConflict);
}

}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptNotifyDialog")) {
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
* Simple dialog allowing user to choose between an Instance or Series for an appointment
* @constructor
* @class
*
* @author Parag Shah
* @param parent			the element that created this view
* 
* 
* @extends		DwtDialog
* @private
*/
ZmApptNotifyDialog = function(parent) {

	DwtDialog.call(this, {parent:parent, id:"SEND_NOTIFY_DIALOG"});

	this.setTitle(ZmMsg.sendUpdateTitle);
	this.setContent(this._setHtml());
	this._cacheFields();
};

ZmApptNotifyDialog.prototype = new DwtDialog;
ZmApptNotifyDialog.prototype.constructor = ZmApptNotifyDialog;

// Public methods

ZmApptNotifyDialog.prototype.toString = 
function() {
	return "ZmApptNotifyDialog";
};

ZmApptNotifyDialog.prototype.initialize = 
function(appt, attId, addedAttendees, removedAttendees) {
	this._appt = appt;
	this._attId = attId;
	this._defaultRadio.checked = true;

    var aCount = addedAttendees.length;
    var rCount = removedAttendees.length;    
    Dwt.setSize(Dwt.byId(this._containerId), 275, Dwt.CLEAR);

	this._addedList.innerHTML = this._getAttedeeHtml(addedAttendees, ZmMsg.added);
	this._removedList.innerHTML = this._getAttedeeHtml(removedAttendees, ZmMsg.removed);
};

// helper method - has no use for this dialog
ZmApptNotifyDialog.prototype.getAppt = 
function() {
	return this._appt;
};

// helper method - has no use for this dialog
ZmApptNotifyDialog.prototype.getAttId = 
function() {
	return this._attId;
};

ZmApptNotifyDialog.prototype.notifyNew = 
function() {
	return this._defaultRadio.checked;
};

ZmApptNotifyDialog.prototype.addSelectionListener = 
function(buttonId, listener) {
	this._button[buttonId].addSelectionListener(listener);
};


// Private / protected methods

ZmApptNotifyDialog.prototype._setHtml = 
function() {
	this._defaultRadioId	= Dwt.getNextId();
	this._notifyChoiceName	= Dwt.getNextId();
	this._addedListId		= Dwt.getNextId();
	this._removedListId		= Dwt.getNextId();
    this._containerId       = Dwt.getNextId();

	var html = new Array();
	var i = 0;

	html[i++] = "<div style='width:275px; overflow: auto;' id='"+this._containerId+"'>";
	html[i++] = ZmMsg.attendeeListChanged;
	html[i++] = "<br><div id='";
	html[i++] = this._addedListId;
	html[i++] = "'></div>";
	html[i++] = "<div id='";
	html[i++] = this._removedListId;
	html[i++] = "'></div>";
	html[i++] = "</div><p>";
	html[i++] = "<table role='presentation' align=center border=0 width=1%>";
	html[i++] = "<tr><td width=1%><input checked value='1' type='radio' id='";
	html[i++] = this._defaultRadioId;
	html[i++] = "' name='";
	html[i++] = this._notifyChoiceName;
	html[i++] = "'></td><td style='white-space:nowrap'>";
	html[i++] = "<label for='" + this._defaultRadioId + "'>";
	html[i++] = ZmMsg.sendUpdatesNew;
	html[i++] = "</label>";
	html[i++] = "</td></tr>";
	html[i++] = "<tr><td width=1%><input value='2' type='radio'" + "id='" + this._defaultRadioId + this._notifyChoiceName + "' name='"; // Applying unique Id. Fix for bug: 77590 & bug: 76533
	html[i++] = this._notifyChoiceName;
	html[i++] = "'></td><td style='white-space:nowrap'>";
	html[i++] = "<label for='" + this._defaultRadioId + this._notifyChoiceName + "'>"; // Applying unique Id. Fix for bug: 77590 & bug: 76533
	html[i++] = ZmMsg.sendUpdatesAll;
	html[i++] = "</label>";
	html[i++] = "</td></tr>";
	html[i++] = "</table>";

	return html.join("");
};

ZmApptNotifyDialog.prototype._getAttedeeHtml = 
function(attendeeList, attendeeLabel) {
	var html = new Array();
	var j = 0;

	if (attendeeList.length) {
		html[j++] = "<table role='presentation' border=0><tr>";
		html[j++] = "<td valign=top>&nbsp;&nbsp;<b>";
		html[j++] = attendeeLabel;
		html[j++] = "</b></td><td>";
		html[j++] = AjxStringUtil.htmlEncode(attendeeList.join(", "));
		html[j++] = "</td></tr></table>";
	}
	return html.join("");
};

ZmApptNotifyDialog.prototype._cacheFields = 
function() {
	this._defaultRadio = document.getElementById(this._defaultRadioId); 		delete this._defaultRadioId;
	this._addedList = document.getElementById(this._addedListId); 				delete this._addedListId;
	this._removedList = document.getElementById(this._removedListId); 			delete this._removedListId;
	
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmResourceConflictDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* show history of the status window
* @param parent			the element that created this view
 * @private
*/
ZmResourceConflictDialog = function(parent) {
	var selectId = Dwt.getNextId();

    var saveButton = new DwtDialog_ButtonDescriptor(ZmResourceConflictDialog.SAVE_BUTTON, ZmMsg.save, DwtDialog.ALIGN_RIGHT, null);
    var cancelButton = new DwtDialog_ButtonDescriptor(ZmResourceConflictDialog.CANCEL_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT, null);

    //Bug fix # 80490 - Added an ID handler to the dialog
	DwtDialog.call(this, {parent:parent, id:"RESC_CONFLICT_DLG", standardButtons: DwtDialog.NO_BUTTONS, extraButtons: [saveButton, cancelButton]});

	this.setContent(this._contentHtml(selectId));
	this.setTitle(ZmMsg.resourceConflictLabel);
	
	this._freeBusyStatusMap = {
		"F" : "free",
		"B" : "busy",
		"T" : "tentative",
		"O" : "outOfOffice",
		"U" : "unknown"
	};

    this.registerCallback(ZmResourceConflictDialog.SAVE_BUTTON, this._handleSaveButton, this);
    this.registerCallback(ZmResourceConflictDialog.CANCEL_BUTTON, this._handleCancelButton, this);
};

ZmResourceConflictDialog.prototype = new DwtDialog;
ZmResourceConflictDialog.prototype.constructor = ZmResourceConflictDialog;

ZmResourceConflictDialog.HEIGHT = 150;
ZmResourceConflictDialog.MAX_HEIGHT = 300;


ZmResourceConflictDialog.SAVE_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmResourceConflictDialog.CANCEL_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmResourceConflictDialog.IGNORE_SAVE_BUTTON = ++DwtDialog.LAST_BUTTON;

// Public methods

ZmResourceConflictDialog.prototype.toString =
function() {
	return "ZmResourceConflictDialog";
};

ZmResourceConflictDialog.prototype._contentHtml =
function(selectId) {
	this._listId = Dwt.getNextId();
	return [ "<div class='ResourceConflictMsg'>", ZmMsg.resourceConflictInfo, "</div>", 
	"<div class='ZmResourceConflictDialog' id='", this._listId, "' style='overflow:auto;height:", ZmResourceConflictDialog.HEIGHT ,"px;'></div>"].join("");
};

ZmResourceConflictDialog.prototype._addAttr =
function(html, title, value, data) {
	if (value) {
		html.append("<tr width=100% id='", this._rowId(data), "'>");
		html.append("<td align=right style='Zwidth:60px;' class='ZmReminderField'>", title, ":&nbsp;</td>");
		html.append("<td>",AjxStringUtil.htmlEncode(value), "</td>");
		html.append("</tr>");	
	}
};

ZmResourceConflictDialog.prototype._rowId =
function(data) {
	var id = Dwt.getNextId();
	data.rowIds.push(id);
	return id;
};

ZmResourceConflictDialog.prototype._addConflictInst =
function(html, inst, data, attendeeMap, needSep) {

	data.buttonId = Dwt.getNextId();
	data.deltaId = Dwt.getNextId();
	data.cancelButtonId = Dwt.getNextId();
	data.rowIds = [];
	
	if (needSep) html.append("<tr id='", inst.ridZ, "_sep'><td colspan=4><div class=horizSep></div></td></tr>");
    
	html.append("<tr width=100% id='conflict_row_", inst.ridZ, "'>");
	html.append("<td colspan=2 valign='top'>");
	html.append("<table  id='", inst.ridZ, "_conflictInstTxt' role='presentation' cellpadding=1 width='95%' cellspacing=0 border=0><tr>");
    html.append("<td width=25px>", AjxImg.getImageHtml("Appointment"), "</td>");
	html.append("<td><b>", this.getDurationText(inst), "</b></td>");
    html.append("</tr><tr>");
    html.append("<td align='left' colspan='2'>");
    html.append("<div class='ResourceConflictResolver'>");
    html.append("<span id='" + data.cancelButtonId + "'></span> <span id='" + data.deltaId + "'></span>");
    html.append("</div>");
    html.append("</td>");
	html.append("</tr></table>");
	html.append("</td>");
    //html.append("<td align=right valign='top' id='", data.cancelButtonId, "'>");
    //html.append("</td>");
	html.append("<td align=right valign='top' id='", data.buttonId, "'>");
	html.append("<table role='presentation' cellpadding=1 cellspacing=0 border=0>");
	
    var usr = inst.usr;
    if(usr) {
        if(!(usr instanceof Array)) {
            usr = [usr];
        }
        for(var i = 0; i < usr.length; i++) {
			var fbStatusStr = "";

            var name = usr[i].name;			
			if(attendeeMap[name]) {
				var at = attendeeMap[name];
				name = at.getFullName() || at.getEmail();		
			}
			var fbStatus = ZmMsg[this.getFreeBusyStatus(usr[i])];
			html.append("<tr>");
			html.append("<td>" +  this.getAttendeeImgHtml(at) + "</td>");
			html.append("<td>" + name +  "</td>");
			html.append("<td>(" + fbStatus +  ")</td>");
			html.append("</tr>");			
        }
    }

    html.append("</table>");
    html.append("</td>");
	html.append("</tr>");
	//this._addAttr(html, ZmMsg.location, appt.getReminderLocation(), data);
};

ZmResourceConflictDialog.prototype.getAttendeeImgHtml =
function(at) {
	var img = "Person";
	if(at.resType) {
		img = (at.resType == ZmCalBaseItem.LOCATION) ? "Location" : "Resource";
	}
	return AjxImg.getImageSpanHtml(img);
};

ZmResourceConflictDialog.prototype.getFreeBusyStatus =
function(usr) {
	return this._freeBusyStatusMap[usr.fb] ? this._freeBusyStatusMap[usr.fb] : "free";
};


ZmResourceConflictDialog.prototype.getDurationText =
function(inst) {
    var hourMinOffset = 0,
        start = new Date(),
        userTimeZone = appCtxt.get(ZmSetting.DEFAULT_TIMEZONE),
        currentTimeZone = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    if(this._appt.isAllDayEvent() && userTimeZone != currentTimeZone) {
        var offset1 = AjxTimezone.getOffset(AjxTimezone.getClientId(currentTimeZone), start);
        var offset2 = AjxTimezone.getOffset(AjxTimezone.getClientId(userTimeZone), start);
        hourMinOffset = (offset2 - offset1) * 60 * 1000;    //offset is in minutes convert to miliseconds
    }
    start = new Date(inst.s + hourMinOffset);
	var endTime = start.getTime() + inst.dur;
	var end = new Date(endTime);

    var pattern =  ZmMsg.apptTimeInstance;
    if(this._appt.isAllDayEvent()) {
        pattern =  ZmMsg.apptTimeAllDay;
        if(end.getDate() != start.getDate()) {
            pattern =  ZmMsg.apptTimeAllDayMulti;
        }
    }

	return AjxMessageFormat.format(pattern, [start, end, ""]);
};

ZmResourceConflictDialog.prototype.initialize =
function(list, appt, callback, cancelCallback) {
	this._list = list;
	this._appt = appt;
	this._instData = {};
    this._callback = callback;
    this._cancelCallback = cancelCallback;
	this._canceledInstanceCount = 0;
	
	var attendeeMap = {};
	var types = [ZmCalBaseItem.PERSON, ZmCalBaseItem.LOCATION, ZmCalBaseItem.EQUIPMENT];
	
	for(var i = 0; i < types.length; i++) {
		var attendees = appt.getAttendees(types[i]);
		for(var j = 0; j < attendees.length; j++) {
			var at = attendees[j];
			var email = at ? at.getEmail() : null;
			if(email) {
				attendeeMap[email] = at;
			}
		}
	}
	
	
	var html = new AjxBuffer();

	var formatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.SHORT, AjxDateFormat.MEDIUM);
	
	var size = this._conflictSize = list.length;

    var dlgC = document.getElementById(this._listId);
    Dwt.setSize(dlgC, Dwt.DEFAULT, size > 5 ? ZmResourceConflictDialog.MAX_HEIGHT : ZmResourceConflictDialog.HEIGHT);

	html.append("<table role='presentation' cellpadding=2 cellspacing=0 border=0 width=100%>");
	for (var i=0; i < size; i++) {
		var inst = list[i];
		var data = this._instData[i] = {inst: inst};
		this._addConflictInst(html, inst, data, attendeeMap, i > 0);
	}
	html.append("</table>");

	if (this._cancelButtons) {
		for (var buttonId in this._cancelButtons) {
			this._cancelButtons[buttonId].dispose();
		}
	}
	this._cancelButtons = {};
    
	var div = document.getElementById(this._listId);
	div.innerHTML = html.toString();

    if(appt.getRecurType() == ZmRecurrence.NONE && size==1) {
        return;
    }

    var recurrence = appt.getRecurrence();

    for (var i = 0; i < size; i++) {
        var data = this._instData[i];
        var cancelButtonContainer = document.getElementById(data.cancelButtonId);
        cancelButtonContainer.innerHTML = this.getCancelHTML(recurrence.isInstanceCanceled(data.inst.ridZ));
        Dwt.setHandler(cancelButtonContainer, DwtEvent.ONCLICK, AjxCallback.simpleClosure(this._handleCancelInstance, this, data.inst.ridZ, data.cancelButtonId, data.deltaId));
    }
};

ZmResourceConflictDialog._onClick =
function(ev) {
	ev = ev || window.event;
	var el = DwtUiEvent.getTarget(ev);
	var edv = AjxCore.objectWithId(el._editViewId);
	if (edv) {
		edv._handleOnClick(el);
	}
};

ZmResourceConflictDialog.prototype._handleCancelInstance =
function(ridZ, cancelButtonId, deltaId) {
    var instEl = document.getElementById(ridZ + "_conflictInstTxt");
    var deltaEl = document.getElementById(deltaId);
    var cancelEl = document.getElementById(cancelButtonId);
    if(instEl) {
        var appt = this._appt;
        var recurrence = appt.getRecurrence();
        if(recurrence) {
            var cancelInstance = !recurrence.isInstanceCanceled(ridZ);
            if(cancelInstance) {
                recurrence.addCancelRecurId(ridZ);
                this._canceledInstanceCount++;
            }else {
                recurrence.removeCancelRecurId(ridZ);
                this._canceledInstanceCount--;
            }
            if(cancelEl) {
                cancelEl.innerHTML =  this.getCancelHTML(cancelInstance);
            }            
        }
    }
};

ZmResourceConflictDialog.prototype.getCancelHTML =
function(isCanceled) {
    return isCanceled ? ZmMsg.cancelled + " - <span class='FakeAnchor'>" + ZmMsg.restorePage + "</span>" : "<span class='FakeAnchor'>" + ZmMsg.cancelInstance + "</span>";    
};

ZmResourceConflictDialog.prototype.popup =
function() {
	DwtDialog.prototype.popup.call(this);
	var dblBookingAllowed = appCtxt.get(ZmSetting.CAL_RESOURCE_DBL_BOOKING_ALLOWED);
	this._button[ZmResourceConflictDialog.SAVE_BUTTON].setEnabled(dblBookingAllowed);	
};

ZmResourceConflictDialog.prototype._handleSaveButton =
function() {
    if(this._callback) this._callback.run();
    this.popdown();
};

ZmResourceConflictDialog.prototype._handleCancelButton =
function() {
    if(this._cancelCallback) this._cancelCallback.run();
    if(this._appt) this._appt.getRecurrence().resetCancelRecurIds();
    this.popdown();
};

ZmResourceConflictDialog.prototype._handleIgnoreAllAndSaveButton =
function() {
    var size = this._list ? this._list.length : 0;
    var appt = this._appt;
    for (var i = 0; i < size; i++) {
        var data = this._instData[i];
        if(appt && data.inst) {
            appt._recurrence.addCancelRecurId(data.inst.ridZ);
        }
    }
    this._handleSaveButton();
};
}

if (AjxPackage.define("zimbraMail.calendar.view.ZmApptQuickAddDialog")) {
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
 * Creates a generic quick add dialog (which basically mean it has different 
 * than regular dialogs). See "DwtSemiModalDialog" in Ajax widget templates
 * for cosmetics.
 * @constructor
 * @class
 * This class represents a modal dialog which has at least a title and the 
 * standard buttons (OK/Cancel).
 * widgets (i.e. buttons, etc) as necessary.
 * <p>
 * Dialogs always hang off the main shell since their stacking order is managed 
 * through z-index.
 *
 * @author Parag Shah
 * 
 * @param {ZmShell}		parent				parent widget (the shell)
 * 
 * @extends		ZmQuickAddDialog
 * 
 */
ZmApptQuickAddDialog = function(parent) {
	// create extra "more details" button to be added at the footer of DwtDialog
    var moreDetailsButton = new DwtDialog_ButtonDescriptor(ZmApptQuickAddDialog.MORE_DETAILS_BUTTON,
                                                           ZmMsg.moreDetails, DwtDialog.ALIGN_LEFT);
    ZmQuickAddDialog.call(this, parent, null, null, [moreDetailsButton]);
	DBG.timePt("ZmQuickAddDialog constructor", true);

	AjxDispatcher.run("GetResources");
    AjxDispatcher.require(["MailCore", "CalendarCore"]);

    var app = appCtxt.getApp(ZmApp.CALENDAR);
    this._fbCache = new ZmFreeBusyCache(app);

	var html = AjxTemplate.expand("calendar.Appointment#ZmApptQuickAddDialog", {id: this._htmlElId});
	this.setContent(html);

	this.setTitle(ZmMsg.quickAddAppt);
	DBG.timePt("create content");
	this._locations = [];
	this._calendarOrgs = {};

	this._createDwtObjects();
	this._cacheFields();
	this._addEventHandlers();
	this._button[ZmApptQuickAddDialog.MORE_DETAILS_BUTTON].setSize("100");
    this._dateInfo = {};

	DBG.timePt("create dwt controls, fields; register handlers");
};

ZmApptQuickAddDialog.prototype = new ZmQuickAddDialog;
ZmApptQuickAddDialog.prototype.constructor = ZmApptQuickAddDialog;


// Consts

ZmApptQuickAddDialog.MORE_DETAILS_BUTTON = ++DwtDialog.LAST_BUTTON;

// Public

ZmApptQuickAddDialog.prototype.toString = 
function() {
	return "ZmApptQuickAddDialog";
};


ZmApptQuickAddDialog.prototype.getFreeBusyCache =
function() {
    return this._fbCache;
}

ZmApptQuickAddDialog.prototype.initialize = 
function(appt) {
	this._appt = appt;

	// reset fields...
	this._subjectField.setValue(appt.getName() ? appt.getName() : "");
	this._locationField.setValue(appt.getLocation() ? appt.getLocation() : "");
	this._startDateField.value = AjxDateUtil.simpleComputeDateStr(appt.startDate);
	this._endDateField.value = AjxDateUtil.simpleComputeDateStr(appt.endDate);
	var isAllDay = appt.isAllDayEvent();
	this._showTimeFields(!isAllDay);
    this._showAsSelect.setSelectedValue("B");
	if (!isAllDay) {
		this._startTimeSelect.set(appt.startDate);
		this._endTimeSelect.set(appt.endDate);
        //need to capture initial time set while composing/editing appt
        ZmApptViewHelper.getDateInfo(this, this._dateInfo);        
	} else {
        this._dateInfo = {};
        this._showAsSelect.setSelectedValue("F");
    }

    this._privacySelect.enable();
	this._privacySelect.setSelectedValue("PUB");
    this._calendarOrgs = {};
	ZmApptViewHelper.populateFolderSelect(this._folderSelect, this._folderRow, this._calendarOrgs, appt);
	this._repeatSelect.setSelectedValue("NON");
	this._repeatDescField.innerHTML = "";
	this._origFormValue = this._formValue();
	this._locations = [];

	// Warn the user if trying to schedule an appointment in the past.
	ZmApptViewHelper.warnIfApptStartingInPast(appt.startDate, this._htmlElId);
};

/**
 * Gets the appointment.
 * 
 * @return	{ZmAppt}	the appointment
 */
ZmApptQuickAddDialog.prototype.getAppt = 
function() {
	// create a copy of the appointment so we dont muck w/ the original
	var appt = ZmAppt.quickClone(this._appt);
	appt.setViewMode(ZmCalItem.MODE_NEW);

	// save field values of this view w/in given appt
	appt.setName(this._subjectField.getValue());
	appt.freeBusy = this._showAsSelect.getValue();
	appt.privacy = this._privacySelect.getValue();
	var calId = this._folderSelect.getValue();
	appt.setFolderId(calId);
	appt.setOrganizer(this._calendarOrgs[calId]);

	// set the start date by aggregating start date/time fields
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
	if (this._appt.isAllDayEvent()) {
		appt.setAllDayEvent(true);
        if(AjxDateUtil.isDayShifted(startDate)) {
            AjxDateUtil.rollToNextDay(startDate);
            AjxDateUtil.rollToNextDay(endDate);
        }
	} else {
		appt.setAllDayEvent(false);
		startDate = this._startTimeSelect.getValue(startDate);
		endDate = this._endTimeSelect.getValue(endDate);
	}
	appt.setStartDate(startDate);
	appt.setEndDate(endDate);
	appt.setRecurType(this._repeatSelect.getValue());
	appt.location = this._locationField.getValue();
	appt.setAttendees(this._locations, ZmCalBaseItem.LOCATION);

	//set alarm for reminders
    if (this._hasReminderSupport) {
        appt.setReminderMinutes(this._reminderSelect.getValue());
        if (this._reminderEmailCheckbox && this._reminderEmailCheckbox.isSelected()) {
            appt.addReminderAction(ZmCalItem.ALARM_EMAIL);
        }
        if (this._reminderDeviceEmailCheckbox && this._reminderDeviceEmailCheckbox.isSelected()) {
            appt.addReminderAction(ZmCalItem.ALARM_DEVICE_EMAIL);
        }
    }

	return appt;
};

ZmApptQuickAddDialog.prototype.isValid = 
function() {
	var subj = AjxStringUtil.trim(this._subjectField.getValue());
	var errorMsg = [];
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);

	if (subj && subj.length) {
		var isValidStartEnd = DwtTimeInput.validStartEnd(this._startDateField, this._endDateField, this._startTimeSelect, this._endTimeSelect);

		if (!isValidStartEnd) {
			if (!startDate || !endDate) {
				errorMsg.push(ZmMsg.errorInvalidDatesFormat);
			}
			else {
				// Shows error if end date is less than start date.
				errorMsg.push(ZmMsg.errorInvalidDates);
			}
		}
	} else {
		errorMsg.push(ZmMsg.errorMissingSubject);
	}

	if (startDate && startDate.getFullYear() < 1900) {
		errorMsg.push(ZmMsg.errorInvalidStartDate);
	}

    if (errorMsg.length > 0) {
        var dlg = appCtxt.getMsgDialog();
		dlg.setMessage(errorMsg.join("<br>"), DwtMessageDialog.WARNING_STYLE);
		dlg.popup();
    }

	return errorMsg.length == 0;
};

ZmApptQuickAddDialog.prototype.isDirty = 
function() {
	return this._formValue() != this._origFormValue;
};

ZmApptQuickAddDialog.prototype._setFocusToSubjectFeild =
function(){
    this._tabGroup.setFocusMember(this._subjectField);
};

ZmApptQuickAddDialog.prototype.popup =
function(loc) {
	ZmQuickAddDialog.prototype.popup.call(this, loc);
    this._fbCache.clearCache();
	if (!this._tabGroupComplete) {
		// tab group filled in here rather than in the constructor b/c we need
		// all the content fields to have been created
		this._tabGroup.addMember([
			this._subjectField, this._locationField, this._showAsSelect,
			this._privacySelect, this._folderSelect,
			this._startDateField, this._startDateButton, this._startTimeSelect.getTabGroupMember(),
			this._endDateField, this._endDateButton, this._endTimeSelect.getTabGroupMember(),
			this._repeatSelect, this._reminderSelect
		]);
		this._tabGroupComplete = true;
	}
    //bug:68208 Focus must be in the Subject of QuickAdd Appointment dialog after double-click in calendar
    this._focusAction = new AjxTimedAction(this, this._setFocusToSubjectFeild);
    AjxTimedAction.scheduleAction(this._focusAction, 300);

    if (this._hasReminderSupport) {
        var defaultWarningTime = appCtxt.get(ZmSetting.CAL_REMINDER_WARNING_TIME);
        this._reminderSelect.setSelectedValue(defaultWarningTime);
        this._setEmailReminderControls();
    }

	var defaultPrivacyOption = appCtxt.get(ZmSetting.CAL_APPT_VISIBILITY);
	this._privacySelect.setSelectedValue((defaultPrivacyOption == ZmSetting.CAL_VISIBILITY_PRIV) ?  "PRI" : "PUB");

    Dwt.setVisible(this._suggestions, false);
    Dwt.setVisible(this._suggestLocation, false);

	DBG.timePt("ZmQuickAddDialog#popup", true);
};

ZmApptQuickAddDialog.prototype._autoCompCallback =
function(text, el, match) {
	if (match.item) {
		this._locationField.setValue(match.item.getFullName());
	}
};

// Private / protected methods

ZmApptQuickAddDialog.prototype._createDwtObjects =
function() {

	// create DwtInputField's
	this._subjectField = new DwtInputField({parent:this, type:DwtInputField.STRING,
											initialValue:null, size:null, maxLen:null,
											errorIconStyle:DwtInputField.ERROR_ICON_NONE,
											validationStyle:DwtInputField.CONTINUAL_VALIDATION,
											hint: ZmMsg.subject,
											parentElement:(this._htmlElId + "_subject")});
	this._subjectField.getInputElement().setAttribute('aria-labelledby', this._htmlElId + "_subject_label");
	this._subjectField.setRequired(true);
	Dwt.setSize(this._subjectField.getInputElement(), "100%", "2rem");


    this._locationField = new DwtInputField({parent:this, type:DwtInputField.STRING,
											initialValue:null, size:null, maxLen:null,
											errorIconStyle:DwtInputField.ERROR_ICON_NONE,
											validationStyle:DwtInputField.ONEXIT_VALIDATION,
											label: ZmMsg.location, hint: ZmMsg.location,
											parentElement:(this._htmlElId + "_location")});
	this._locationField.getInputElement().setAttribute('aria-labelledby', this._htmlElId + "_location_label");
	Dwt.setSize(this._locationField.getInputElement(), "100%", "2rem");

    // create DwtSelects
	this._showAsSelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_showAs")});
	this._showAsSelect.setAttribute('aria-labelledby', this._htmlElId + '_showAs_label');
	for (var i = 0; i < ZmApptViewHelper.SHOWAS_OPTIONS.length; i++) {
		var option = ZmApptViewHelper.SHOWAS_OPTIONS[i];
		this._showAsSelect.addOption(option.label, option.selected, option.value, "ShowAs" + option.value);
	}

	this._privacySelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_privacy")});
	this._privacySelect.setAttribute('aria-labelledby', this._htmlElId + "_privacy_label");
	for (var j = 0; j < ZmApptEditView.PRIVACY_OPTIONS.length; j++) {
		var option = ZmApptEditView.PRIVACY_OPTIONS[j];
		this._privacySelect.addOption(option.label, option.selected, option.value);
	}
	this._privacySelect.addChangeListener(new AjxListener(this, this._privacyListener));

	this._folderSelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_calendar"), label: ZmMsg.calendar});
	this._folderSelect.setAttribute('aria-labelledby', this._htmlElId + "_calendar_label");
	this._folderSelect.addChangeListener(new AjxListener(this, this._privacyListener));

	var dateButtonListener = new AjxListener(this, this._dateButtonListener);
	var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);

	var startMiniCalId = this._htmlElId + "_startMiniCal";
	this._startDateButton = ZmCalendarApp.createMiniCalButton(this, startMiniCalId, dateButtonListener, dateCalSelectionListener, ZmMsg.startDate);
	var endMiniCalId = this._htmlElId + "_endMiniCal";
	this._endDateButton = ZmCalendarApp.createMiniCalButton(this, endMiniCalId, dateButtonListener, dateCalSelectionListener, ZmMsg.endDate);

	// create selects for Time section
	var timeSelectListener = new AjxListener(this, this._timeChangeListener);
	
	this._startTimeSelect = new DwtTimeInput(this, DwtTimeInput.START);
	this._startTimeSelect.addChangeListener(timeSelectListener);
	this._startTimeSelect.reparentHtmlElement(this._htmlElId + "_startTime");

	this._endTimeSelect = new DwtTimeInput(this, DwtTimeInput.END);
	this._endTimeSelect.addChangeListener(timeSelectListener);
	this._endTimeSelect.reparentHtmlElement(this._htmlElId + "_endTime");

	this._repeatSelect = new DwtSelect({parent:this, parentElement:(this._htmlElId + "_repeat"), label: ZmMsg.repeat});
	this._repeatSelect.addChangeListener(new AjxListener(this, this._repeatChangeListener));
	for (var i = 0; i < ZmApptViewHelper.REPEAT_OPTIONS.length-1; i++) {
		var option = ZmApptViewHelper.REPEAT_OPTIONS[i];
		this._repeatSelect.addOption(option.label, option.selected, option.value);
	}

	//reminder DwtSelect
    var	displayOptions = [
		ZmMsg.apptRemindNever,
        ZmMsg.apptRemindAtEventTime,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNMinutesBefore,
		ZmMsg.apptRemindNHoursBefore,
		ZmMsg.apptRemindNHoursBefore,
		ZmMsg.apptRemindNHoursBefore,
		ZmMsg.apptRemindNHoursBefore,
		ZmMsg.apptRemindNHoursBefore,
		ZmMsg.apptRemindNDaysBefore,
		ZmMsg.apptRemindNDaysBefore,
		ZmMsg.apptRemindNDaysBefore,
		ZmMsg.apptRemindNDaysBefore,
		ZmMsg.apptRemindNWeeksBefore,
		ZmMsg.apptRemindNWeeksBefore
	];

    var	options = [-1, 0, 1, 5, 10, 15, 30, 45, 60, 120, 180, 240, 300, 1080, 1440, 2880, 4320, 5760, 10080, 20160];
    var	labels =  [-1, 0, 1, 5, 10, 15, 30, 45, 60, 2, 3, 4, 5, 18, 1, 2, 3, 4, 1, 2];
	var defaultWarningTime = appCtxt.get(ZmSetting.CAL_REMINDER_WARNING_TIME);

    this._hasReminderSupport = Dwt.byId(this._htmlElId + "_reminderSelect") != null;

    if (this._hasReminderSupport) {
        this._reminderSelect = new DwtSelect({parent:this, label: ZmMsg.reminder});
        this._reminderSelect.addChangeListener(new AjxListener(this, this._setEmailReminderControls));
        for (var j = 0; j < options.length; j++) {
            var optLabel = ZmCalendarApp.__formatLabel(displayOptions[j], labels[j]);
            this._reminderSelect.addOption(optLabel, (defaultWarningTime == options[j]), options[j]);
        }
        this._reminderSelect.reparentHtmlElement(this._htmlElId + "_reminderSelect");

        this._reminderEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderEmailCheckbox"));
        this._reminderEmailCheckbox.setText(ZmMsg.email);
        this._reminderDeviceEmailCheckbox = new DwtCheckbox({parent: this});
        this._reminderDeviceEmailCheckbox.replaceElement(document.getElementById(this._htmlElId + "_reminderDeviceEmailCheckbox"));
        this._reminderDeviceEmailCheckbox.setText(ZmMsg.deviceEmail);
        this._setEmailReminderControls();

        var settings = appCtxt.getSettings();
        var listener = new AjxListener(this, this._settingChangeListener);
        settings.getSetting(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
        settings.getSetting(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS).addChangeListener(listener);
    }

	// init auto-complete widget if contacts app enabled
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		this._initAutocomplete();
	}

	this._suggestLocationId = this._htmlElId + "_suggest_location";
	this._suggestLocation   = document.getElementById(this._suggestLocationId);

	this._suggestions = document.getElementById(this._htmlElId + "_suggestions");
	Dwt.setVisible(this._suggestions, false);

	var closeCallback = this._onSuggestionClose.bind(this);
	var dialogContentEl = document.getElementById(this._htmlElId + "_content");
	this._containerSize = Dwt.getSize(dialogContentEl);
	if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
		this._locationAssistant = new ZmLocationAssistantView(this, appCtxt.getCurrentController(), this, closeCallback);
		this._locationAssistant.reparentHtmlElement(this._suggestions);
	}
	AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.loadPreference), 300);
};

ZmApptQuickAddDialog.prototype.loadPreference =
function() {
    var prefDlg = appCtxt.getSuggestionPreferenceDialog();
    prefDlg.setCallback(new AjxCallback(this, this._prefChangeListener));
    prefDlg.getSearchPreference(appCtxt.getActiveAccount());
};

ZmApptQuickAddDialog.prototype._prefChangeListener =
function() {
    // Preference Dialog is only displayed when the suggestions panel is visible - so update suggestions
    if (this._locationAssistant) {
		this._locationAssistant.clearResources();
		this._locationAssistant.suggestAction();
	}
};

ZmApptQuickAddDialog.prototype._handleConfigureClick = function() {
    // transfer settings to new appt compose tab
    var button = this._button[ZmApptQuickAddDialog.MORE_DETAILS_BUTTON];
    if (button) {
        button._emulateSingleClick(); // HACK: should be public method on DwtButton
    }

    // or just get rid of this modal dialog
    else {
        this.popdown();
    }

    // go to reminders prefs page
    // NOTE: We can't query the section name based on the pref id
    // NOTE: because that info won't be available until the first time
    // NOTE: prefs app is launched.
    skin.gotoPrefs("NOTIFICATIONS");
};

ZmApptQuickAddDialog.prototype._initAutocomplete =
function() {
	var acCallback = new AjxCallback(this, this._autocompleteCallback);
	this._acList = null;

	if (appCtxt.get(ZmSetting.GAL_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		// autocomplete for locations
		var app = appCtxt.getApp(ZmApp.CALENDAR);
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_FULL,
			compCallback:	acCallback,
            keyUpCallback:	this._handleLocationChange.bind(this),
			options:		{type:ZmAutocomplete.AC_TYPE_LOCATION},
			contextId:		[this.toString(), ZmCalBaseItem.LOCATION].join("-")
		};
		this._acLocationsList = new ZmAutocompleteListView(params);
		this._acLocationsList.handle(this._locationField.getInputElement());
		this._acList = this._acLocationsList;
	}
};

ZmApptQuickAddDialog.prototype._autocompleteCallback =
function(text, el, match) {
	if (!match) {
		DBG.println(AjxDebug.DBG1, "ZmApptQuickAddDialog: match empty in autocomplete callback; text: " + text);
		return;
	}
	var attendee = match.item;
	if (attendee) {
		var type = el._attType;
		this._isKnownLocation = true;
		attendee = (attendee instanceof AjxVector) ? attendee.getArray() :
				   (attendee instanceof Array) ? attendee : [attendee];
		for (var i = 0; i < attendee.length; i++) {
			this._locations.push(attendee[i]);
		}
	}
};

//monitor location field change and reset location resources array
ZmApptQuickAddDialog.prototype._handleLocationChange =
function(event, aclv, result) {
	var val = this._locationField.getValue();
    if (val.length <= 1) {
        // This is only called onKeyUp, so a length 1 string means typing just started
        this._locations = [];
		this._isKnownLocation = false;
	}
};

ZmApptQuickAddDialog.prototype._privacyListener =
function() {
	if (!this._privacySelect) { return; }

	var value = this._privacySelect.getValue();
	var calId = this._folderSelect.getValue();
	var cal = calId && appCtxt.getById(calId);

    if (appCtxt.isOffline) {
        var currAcct = cal.getAccount();
        appCtxt.accountList.setActiveAccount(currAcct);
    }

	if (cal) {
        var isRemote = cal.isRemote();        
		if (value == "PRI" && isRemote && !cal.hasPrivateAccess()) {
			this._privacySelect.setSelectedValue("PUB");
			this._privacySelect.disable();
		} else {
			this._privacySelect.enable();
		}
	}
};

ZmApptQuickAddDialog.prototype._cacheFields =
function() {
	this._folderRow			= document.getElementById(this._htmlElId + "_folderRow");
	this._startDateField 	= document.getElementById(this._htmlElId + "_startDate");
	this._endDateField 		= document.getElementById(this._htmlElId + "_endDate");
	this._repeatDescField 	= document.getElementById(this._htmlElId + "_repeatDesc");
};

ZmApptQuickAddDialog.prototype._addEventHandlers = 
function() {
	var qadId = AjxCore.assignId(this);
	var dateSelectListener = this._dateChangeListener.bind(this);

	Dwt.setHandler(this._startDateField, DwtEvent.ONCHANGE, dateSelectListener);
	Dwt.setHandler(this._endDateField,   DwtEvent.ONCHANGE, dateSelectListener);
	Dwt.setHandler(this._suggestLocation, DwtEvent.ONCLICK, this._showLocationSuggestions.bind(this));

	this._startDateField._qadId = this._endDateField._qadId =  qadId;
};

ZmApptQuickAddDialog.prototype._showTimeFields = 
function(show) {
	Dwt.setVisibility(this._startTimeSelect.getHtmlElement(), show);
	Dwt.setVisibility(this._endTimeSelect.getHtmlElement(), show);
	if (this._supportTimeZones)
		Dwt.setVisibility(this._endTZoneSelect.getHtmlElement(), show);
	// also show/hide the "@" text
	Dwt.setVisibility(document.getElementById(this._htmlElId + "_startTimeAt"), show);
	Dwt.setVisibility(document.getElementById(this._htmlElId + "_endTimeAt"), show);
};



ZmApptQuickAddDialog.prototype._onSuggestionClose =
function() {
    // Make the trigger link visible
    Dwt.setVisible(this._suggestLocation, true);
}

ZmApptQuickAddDialog.prototype._showLocationSuggestions =
function() {
    // Hide the trigger link and display the location suggestion panel
    Dwt.setVisible(this._suggestLocation, false);
    Dwt.setVisible(this._suggestions, true);
    this._locationAssistant.show(this._containerSize);
    this._locationAssistant.suggestAction();
};

ZmApptQuickAddDialog.prototype._formValue =
function() {
	var vals = [];

	vals.push(this._subjectField.getValue());
	vals.push(this._locationField.getValue());
	vals.push(this._startDateField.value);
	vals.push(this._endDateField.value);
    if (this._hasReminderSupport) {
        vals.push(this._reminderSelect.getValue());
        vals.push(this._reminderEmailCheckbox.isSelected());
        vals.push(this._reminderDeviceEmailCheckbox.isSelected());
    }
	if (!this._appt.isAllDayEvent()) {
		vals.push(
			AjxDateUtil.getServerDateTime(this._startTimeSelect.getValue()),
			AjxDateUtil.getServerDateTime(this._endTimeSelect.getValue())
		);
	}
	vals.push(this._repeatSelect.getValue());

	var str = vals.join("|");
	str = str.replace(/\|+/, "|");
	return str;
};

// Listeners

ZmApptQuickAddDialog.prototype._dateButtonListener = 
function(ev) {
	var calDate = ev.item == this._startDateButton
		? AjxDateUtil.simpleParseDateStr(this._startDateField.value)
		: AjxDateUtil.simpleParseDateStr(this._endDateField.value);

	// if date was input by user and its foobar, reset to today's date
	if (isNaN(calDate)) {
		calDate = new Date();
		var field = ev.item == this._startDateButton
			? this._startDateField : this._endDateField;
		field.value = AjxDateUtil.simpleComputeDateStr(calDate);
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

ZmApptQuickAddDialog.prototype._dateCalSelectionListener = 
function(ev) {
	var parentButton = ev.item.parent.parent;

	// do some error correction... maybe we can optimize this?
	var sd = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	var ed = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

	// change the start/end date if they mismatch
	if (parentButton == this._startDateButton) {
		if (ed && ed.valueOf() < ev.detail.valueOf())
			this._endDateField.value = newDate;
		this._startDateField.value = newDate;
	} else {
		if (sd && sd.valueOf() > ev.detail.valueOf())
			this._startDateField.value = newDate;
		this._endDateField.value = newDate;
	}

	// Warn the user if trying to schedule an appointment in the past.
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	startDate && ZmApptViewHelper.warnIfApptStartingInPast(startDate, this._htmlElId);

	this._dateChangeListener();
};

ZmApptQuickAddDialog.prototype._repeatChangeListener = 
function(ev) {
	this._repeatDescField.innerHTML = ev._args.newValue != "NON" ? AjxStringUtil.htmlEncode(ZmMsg.recurEndNone) : "";
    if (this._repeatSelect._selectedValue === "WEE") {
        this._appt._recurrence.repeatCustom = 1;
    }
};

ZmApptQuickAddDialog.prototype._timeChangeListener =
function(ev, id) {
	DwtTimeInput.adjustStartEnd(ev, this._startTimeSelect, this._endTimeSelect, this._startDateField, this._endDateField, this._dateInfo, id);
    if (!this._appt.isAllDayEvent()) {
        ZmApptViewHelper.getDateInfo(this, this._dateInfo);
    }

	// Warn the user if trying to schedule an appointment in the past.
	var startDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
	if (startDate) {
		startDate.setHours(this._startTimeSelect.getHours(), this._startTimeSelect.getMinutes(), 0);
		ZmApptViewHelper.warnIfApptStartingInPast(startDate, this._htmlElId);
	}

	this._locationAssistant && this._locationAssistant.updateTime();
};

ZmApptQuickAddDialog.prototype._dateChangeListener =
function(ev, id) {
    if (!this._appt.isAllDayEvent()) {
        ZmApptViewHelper.getDateInfo(this, this._dateInfo);

		var el = DwtUiEvent.getTarget(ev);
		//handle date change if user change's it manually.
		if(ev && el){
			var qad = AjxCore.objectWithId(el._qadId);
			// Auto-corrects start/end date just like appt compose view
			ZmApptViewHelper.handleDateChange(qad._startDateField, qad._endDateField, el == qad._startDateField);
		}
    }
	this._locationAssistant && this._locationAssistant.updateTime();
};

ZmApptQuickAddDialog.prototype.getDurationInfo =
function() {
    var startDate = AjxDateUtil.simpleParseDateStr(this._dateInfo.startDate);
    var endDate   = AjxDateUtil.simpleParseDateStr(this._dateInfo.endDate);
    startDate = this._startTimeSelect.getValue(startDate);
    endDate   = this._endTimeSelect.getValue(endDate);

    var durationInfo = {};
    durationInfo.startTime = startDate.getTime();
    durationInfo.endTime   = endDate.getTime();
    durationInfo.duration  = durationInfo.endTime - durationInfo.startTime;
    return durationInfo;
};

ZmApptQuickAddDialog.prototype._setEmailReminderControls =
function() {
    var enabled = this._reminderSelect.getValue() != 0;

    var email = appCtxt.get(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS);
    var emailEnabled = Boolean(email);
    this._reminderEmailCheckbox.setEnabled(enabled && emailEnabled);
    this._reminderEmailCheckbox.setToolTipContent(emailEnabled ? email : null);

    var deviceEmail = appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS);
    var deviceEmailEnabled = Boolean(deviceEmail);
    this._reminderDeviceEmailCheckbox.setEnabled(enabled && deviceEmailEnabled);
    this._reminderDeviceEmailCheckbox.setToolTipContent(deviceEmailEnabled ? deviceEmail : null);

    var configureEnabled = !emailEnabled && !deviceEmailEnabled;
    this._reminderEmailCheckbox.setVisible(!configureEnabled);
    this._reminderDeviceEmailCheckbox.setVisible((!configureEnabled && appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ENABLED)));
};

ZmApptQuickAddDialog.prototype._settingChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_SETTING) { return; }
	var id = ev.source.id;
	if (id == ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS || id == ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS) {
		this._setEmailReminderControls();
	}
};

// Static methods
ZmApptQuickAddDialog._onChange = 
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var qad = AjxCore.objectWithId(el._qadId);
	ZmApptViewHelper.handleDateChange(qad._startDateField, qad._endDateField, el == qad._startDateField);
};

ZmApptQuickAddDialog.prototype.updateLocation =
function(location, locationStr) {
    this._locationField.setValue(locationStr);
    if (this._useAcAddrBubbles) {
        this._locationField.clear();
        this._locationField.addBubble({address:locationStr, match:match, skipNotify:true});
    }
    this._locations.push(location);
};

// Stub for the location picker and ZmScheduleAssistant
ZmApptQuickAddDialog.prototype.getCalendarAccount =
function() {
    var cal = appCtxt.getById(this._folderSelect.getValue());
    return cal && cal.getAccount();
};

ZmApptQuickAddDialog.prototype.getFreeBusyExcludeInfo =
function(emailAddr){
    return null;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmFreeBusySchedulerView")) {
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
 * Creates a new tab view for scheduling appointment attendees.
 * @constructor
 * @class
 * This class displays free/busy information for an appointment's attendees. An
 * attendee may be a person, a location, or equipment.
 *
 *  @author Sathishkumar Sugumaran
 *
 * @param parent			[ZmApptComposeView]			the appt compose view
 * @param attendees			[hash]						attendees/locations/equipment
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param dateInfo			[object]					hash of date info
 */
ZmFreeBusySchedulerView = function(parent, attendees, controller, dateInfo, appt, fbParentCallback) {

	DwtComposite.call(this, {
		parent: parent,
		posStyle: DwtControl.RELATIVE_STYLE,
		className: 'ZmFreeBusySchedulerView'
	});

	this._attendees  = attendees;
	this._controller = controller;
	this._dateInfo   = dateInfo;
	this._appt       = appt;
	this._fbParentCallback = fbParentCallback;

	this._editView = parent;

	this._rendered = false;
	this._emailToIdx = {};
	this._schedTable = [];
	this._autoCompleteHandled = {};
	this._allAttendees = [];
	this._allAttendeesStatus = [];
	this._allAttendeesSlot = null;
    this._sharedCalIds = {};
    
	this._attTypes = [ZmCalBaseItem.PERSON];
	if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
		this._attTypes.push(ZmCalBaseItem.LOCATION);
		this._attTypes.push(ZmCalBaseItem.EQUIPMENT);
	}

	this._fbCallback = new AjxCallback(this, this._handleResponseFreeBusy);
	this._workCallback = new AjxCallback(this, this._handleResponseWorking);
	this._kbMgr = appCtxt.getKeyboardMgr();
    this._emailAliasMap = {};

    this.addListener(DwtEvent.ONMOUSEDOWN, parent._listenerMouseDown);

    this.isComposeMode = true;
    this._resultsPaginated = true;
    this._isPageless = false;

    this._fbConflict = {};

    //this._fbCache = controller.getApp().getFreeBusyCache();
    this._fbCache = parent.getFreeBusyCache();
};

ZmFreeBusySchedulerView.prototype = new DwtComposite;
ZmFreeBusySchedulerView.prototype.constructor = ZmFreeBusySchedulerView;

ZmFreeBusySchedulerView.prototype.isZmFreeBusySchedulerView = true;
ZmFreeBusySchedulerView.prototype.toString = function() { return "ZmFreeBusySchedulerView"; };


// Consts

ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS		= 48;

/**
 * Defines the "free" status.
 */
ZmFreeBusySchedulerView.STATUS_FREE				= 1;
/**
 * Defines the "busy" status.
 */
ZmFreeBusySchedulerView.STATUS_BUSY				= 2;
/**
 * Defines the "tentative" status.
 */
ZmFreeBusySchedulerView.STATUS_TENTATIVE			= 3;
/**
 * Defines the "out" status.
 */
ZmFreeBusySchedulerView.STATUS_OUT				= 4;
/**
 * Defines the "unknown" status.
 */
ZmFreeBusySchedulerView.STATUS_UNKNOWN			= 5;
ZmFreeBusySchedulerView.STATUS_WORKING			= 6;
// Pre-cache the status css class names
ZmFreeBusySchedulerView.STATUS_CLASSES = [];
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_FREE]		= "ZmScheduler-free";
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_BUSY]		= "ZmScheduler-busy";
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_TENTATIVE]	= "ZmScheduler-tentative";
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_OUT]		= "ZmScheduler-outOfOffice";
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_UNKNOWN]	= "ZmScheduler-unknown";
ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_WORKING]	= "ZmScheduler-working";

ZmFreeBusySchedulerView.PSTATUS_CLASSES = [];
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_DECLINED]      = "ZmSchedulerPTST-declined";
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_DEFERRED]      = "ZmSchedulerPTST-deferred";
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_DELEGATED]     = "ZmSchedulerPTST-delegated";
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_NEEDS_ACTION]  = "ZmSchedulerPTST-needsaction";
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_TENTATIVE]     = "ZmSchedulerPTST-tentative";
ZmFreeBusySchedulerView.PSTATUS_CLASSES[ZmCalBaseItem.PSTATUS_WAITING]       = "ZmSchedulerPTST-waiting";

ZmFreeBusySchedulerView.ROLE_OPTIONS = {};

ZmFreeBusySchedulerView.ROLE_OPTIONS[ZmCalBaseItem.PERSON]          = { label: ZmMsg.requiredAttendee, 			value: ZmCalBaseItem.PERSON, 	        image: "AttendeesRequired" };
ZmFreeBusySchedulerView.ROLE_OPTIONS[ZmCalItem.ROLE_OPTIONAL]       = { label: ZmMsg.optionalAttendee, 			value: ZmCalItem.ROLE_OPTIONAL, 	image: "AttendeesOptional" };
ZmFreeBusySchedulerView.ROLE_OPTIONS[ZmCalBaseItem.LOCATION]        = { label: ZmMsg.location, 			        value: ZmCalBaseItem.LOCATION, 	        image: "Location" };
ZmFreeBusySchedulerView.ROLE_OPTIONS[ZmCalBaseItem.EQUIPMENT]       = { label: ZmMsg.equipmentAttendee, 			value: ZmCalBaseItem.EQUIPMENT, 	    image: "Resource" };

// Hold on to this one separately because we use it often
ZmFreeBusySchedulerView.FREE_CLASS = ZmFreeBusySchedulerView.STATUS_CLASSES[ZmFreeBusySchedulerView.STATUS_FREE];

ZmFreeBusySchedulerView.DELAY = 200;
ZmFreeBusySchedulerView.BATCH_SIZE = 25;

ZmFreeBusySchedulerView._VALUE = "value";

// Public methods

ZmFreeBusySchedulerView.prototype.setComposeMode =
function(isComposeMode) {
	this.isComposeMode = isComposeMode;
};

ZmFreeBusySchedulerView.prototype.showMe =
function() {

    if(this.composeMode) ZmApptViewHelper.getDateInfo(this._editView, this._dateInfo);

	this._dateBorder = this._getBordersFromDateInfo();

	if (!this._rendered) {
		this._initialize();
	}

    var organizer;
    if(this.isComposeMode) {
        organizer = this._isProposeTime ? this._editView.getCalItemOrganizer() : this._editView.getOrganizer();
    }else {
        organizer = this._editView.getOrganizer();
    }

	this.set(this._dateInfo, organizer, this._attendees);
    this.enablePartcipantStatusColumn(this.isComposeMode ? this._editView.getRsvp() : true);
};

ZmFreeBusySchedulerView.prototype.initialize =
function(appt, mode, isDirty, apptComposeMode) {
	this._appt = appt;
	this._mode = mode;
    this._isForward = (apptComposeMode == ZmApptComposeView.FORWARD);
    this._isProposeTime = (apptComposeMode == ZmApptComposeView.PROPOSE_TIME);
};

ZmFreeBusySchedulerView.prototype.set =
function(dateInfo, organizer, attendees) {

    //need to capture initial time set while composing/editing appt
    if(this.isComposeMode) ZmApptViewHelper.getDateInfo(this._editView, this._dateInfo);

	this._setAttendees(organizer, attendees);
};

ZmFreeBusySchedulerView.prototype.update =
function(dateInfo, organizer, attendees) {
	this._updateAttendees(organizer, attendees);
    this.updateFreeBusy();
	this._outlineAppt();
};

ZmFreeBusySchedulerView.prototype.cleanup =
function() {
	if (!this._rendered) return;

    if(this._timedActionId)  {
        AjxTimedAction.cancelAction(this._timedActionId);
        this._timedActionId = null;
    }

	// remove all but first two rows (header and All Attendees)
	while (this._attendeesTable.rows.length > 2) {
		this._removeAttendeeRow(2);
	}
	this._activeInputIdx = null;

	// cleanup all attendees row
	var allAttCells = this._allAttendeesSlot._coloredCells;
	while (allAttCells.length > 0) {
		allAttCells[0].className = ZmFreeBusySchedulerView.FREE_CLASS;
		allAttCells.shift();
	}

	for (var i in this._emailToIdx) {
		delete this._emailToIdx[i];
	}

	this._curValStartDate = "";
	this._curValEndDate = "";

	this._resetAttendeeCount();

	// reset autocomplete lists
	if (this._acContactsList) {
		this._acContactsList.reset();
		this._acContactsList.show(false);
	}
	if (this._acEquipmentList) {
		this._acEquipmentList.reset();
		this._acEquipmentList.show(false);
	}

    this._emailAliasMap = {};
    this._emptyRowIndex = null;
    this._autoCompleteHandled = {}

    this._fbConflict = {};
};

// Private / protected methods

ZmFreeBusySchedulerView.prototype._initialize =
function() {
	this._createHTML();
	this._initAutocomplete();
	this._createDwtObjects();
	this._resetAttendeeCount();

    //intialize a single common event mouseover/out handler for optimization
    Dwt.setHandler(this.getHtmlElement(), DwtEvent.ONMOUSEOVER, ZmFreeBusySchedulerView._onFreeBusyMouseOver);
    Dwt.setHandler(this.getHtmlElement(), DwtEvent.ONMOUSEOUT, ZmFreeBusySchedulerView._onFreeBusyMouseOut);


    Dwt.setHandler(this._showMoreLink, DwtEvent.ONCLICK, ZmFreeBusySchedulerView._onShowMore);


	this._rendered = true;
};

ZmFreeBusySchedulerView.prototype._createHTML =
function() {
	this._navToolbarId		= this._htmlElId + "_navToolbar";
	this._attendeesTableId	= this._htmlElId + "_attendeesTable";
	this._showMoreLinkId	= this._htmlElId + "_showMoreLink";

	this._schedTable[0] = null;	// header row has no attendee data

	var subs = { id:this._htmlElId, isAppt: true, showTZSelector: appCtxt.get(ZmSetting.CAL_SHOW_TIMEZONE) };
	this.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Appointment#InlineScheduleView", subs);
};

ZmFreeBusySchedulerView.prototype._initAutocomplete =
function() {

	var acCallback = this._autocompleteCallback.bind(this);
	var keyUpCallback = this._autocompleteKeyUpCallback.bind(this);
	this._acList = {};

	// autocomplete for attendees
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			separator:		"",
			options:		{needItem: true},
			matchValue:		[ZmAutocomplete.AC_VALUE_NAME, ZmAutocomplete.AC_VALUE_EMAIL],
			keyUpCallback:	keyUpCallback,
			compCallback:	acCallback
		};
		params.contextId = [this._controller.getCurrentViewId(), this.toString(), ZmCalBaseItem.PERSON].join("-");
		this._acContactsList = new ZmAutocompleteListView(params);
		this._acList[ZmCalBaseItem.PERSON] = this._acContactsList;

		// autocomplete for locations/equipment
		if (appCtxt.get(ZmSetting.GAL_ENABLED)) {
			params.options = {type:ZmAutocomplete.AC_TYPE_LOCATION};
			params.contextId = [this._controller.getCurrentViewId(), this.toString(), ZmCalBaseItem.LOCATION].join("-");
			this._acLocationsList = new ZmAutocompleteListView(params);
			this._acList[ZmCalBaseItem.LOCATION] = this._acLocationsList;

			params.options = {type:ZmAutocomplete.AC_TYPE_EQUIPMENT};
			params.contextId = [this._controller.getCurrentViewId(), this.toString(), ZmCalBaseItem.EQUIPMENT].join("-");
			this._acEquipmentList = new ZmAutocompleteListView(params);
			this._acList[ZmCalBaseItem.EQUIPMENT] = this._acEquipmentList;
		}
	}
};

// Add the attendee, then create a new empty slot since we've now filled one.
ZmFreeBusySchedulerView.prototype._autocompleteCallback =
function(text, el, match) {
    if(match && match.fullAddress) {
        el.value = match.fullAddress;
    }
	if (match && match.item) {
		if (match.item.isGroup && match.item.isGroup()) {
			var members = match.item.getGroupMembers().good.getArray();
			for (var i = 0; i < members.length; i++) {
				el.value = members[i].address;

                if(el._acHandlerInProgress) { return; }
                el._acHandlerInProgress = true;
				var index = this._handleAttendeeField(el);
                this._editView.showConflicts();
                el._acHandlerInProgress = false;

				if (index && ((i+1) < members.length)) {
					el = this._schedTable[index].inputObj.getInputElement();
				}
			}
		} else {
            if(el._acHandlerInProgress) { return; }
            el._acHandlerInProgress = true;
			this._handleAttendeeField(el, match.item);
            this._editView.showConflicts();
            el._acHandlerInProgress = false;
		}
	}
};

// Enter listener. If the user types a return when no autocomplete list is showing,
// then go ahead and add a new empty slot.
ZmFreeBusySchedulerView.prototype._autocompleteKeyUpCallback =
function(ev, aclv, result) {
	var key = DwtKeyEvent.getCharCode(ev);
	if (DwtKeyEvent.IS_RETURN[key] && !aclv.getVisible()) {
		var el = DwtUiEvent.getTargetWithProp(ev, "id");
        if(el._acHandlerInProgress) { return; }
        el._acHandlerInProgress = true;
        this._handleAttendeeField(el);
        this._editView.showConflicts();
        el._acHandlerInProgress = false;
	}
};

ZmFreeBusySchedulerView.prototype._addTabGroupMembers =
function(tabGroup) {
	for (var i = 0; i < this._schedTable.length; i++) {
		var sched = this._schedTable[i];
		if (sched && sched.inputObj) {
			tabGroup.addMember(sched.inputObj);
		}
	}
};

ZmFreeBusySchedulerView.prototype._deleteAttendeeEntry =
function(email) {
    var index = this._emailToIdx[email];
    if(!index) {
        return;
    }
    delete this._emailToIdx[email];
    Dwt.setDisplay(this._attendeesTable.rows[index], 'none');
    this._schedTable[index] = null;
};

ZmFreeBusySchedulerView.prototype._hideRow =
function(index) {
    Dwt.setDisplay(this._attendeesTable.rows[index], 'none');
};

ZmFreeBusySchedulerView.prototype._deleteAttendeeRow =
function(email) {
    this._deleteAttendeeEntry(email);

    //remove appt divs created for attendee/calendar
    this._editView.removeApptByEmail(email);

    this._updateFreeBusy();
    this._editView.removeMetadataAttendees(this._schedTable[this._organizerIndex].attendee, email);
}

/**
 * Adds a new, empty slot with a select for the attendee type, an input field,
 * and cells for free/busy info.
 *
 * @param isAllAttendees	[boolean]*	if true, this is the "All Attendees" row
 * @param organizer			[string]*	organizer
 * @param drawBorder		[boolean]*	if true, draw borders to indicate appt time
 * @param index				[int]*		index at which to add the row
 * @param updateTabGroup	[boolean]*	if true, add this row to the tab group
 * @param setFocus			[boolean]*	if true, set focus to this row's input field
 */
ZmFreeBusySchedulerView.prototype._addAttendeeRow =
function(isAllAttendees, organizer, drawBorder, index, updateTabGroup, setFocus) {
	index = index || this._attendeesTable.rows.length;

	// store some meta data about this table row
	var sched = {};
	var dwtId = Dwt.getNextId();	// container for input
	sched.dwtNameId		= dwtId + "_NAME_";			// TD that contains name
	sched.dwtTableId	= dwtId + "_TABLE_";		// TABLE with free/busy cells
	sched.dwtSelectId	= dwtId + "_SELECT_";		// TD that contains select menu
	sched.dwtInputId	= dwtId + "_INPUT_";		// input field
	sched.idx = index;
	sched._coloredCells = [];
	this._schedTable[index] = sched;

	this._dateBorder = this._getBordersFromDateInfo();

	var data = {
		id: dwtId,
		sched: sched,
		isAllAttendees: isAllAttendees,
		organizer: organizer,
		cellCount: ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS,
        isComposeMode: this.isComposeMode,
        dateBorder: this._dateBorder
	};

	var tr = this._attendeesTable.insertRow(index);
	var td = tr.insertCell(-1);
    if(isAllAttendees) {
        td.className = "ZmSchedulerAllTd";
    }
	td.innerHTML = AjxTemplate.expand("calendar.Appointment#AttendeeName", data);

	var td = tr.insertCell(-1);
	td.innerHTML = AjxTemplate.expand("calendar.Appointment#AttendeeFreeBusy", data);
    td.style.padding = "0";

	for (var k = 0; k < data.cellCount; k++) {
		var id = sched.dwtTableId + "_" + k;
		var fbDiv = document.getElementById(id);
		if (fbDiv) {
			fbDiv._freeBusyCellIndex = k;
			fbDiv._schedTableIdx = index;
			fbDiv._schedViewPageId = this._svpId;
		}
	}

	// create DwtInputField and DwtSelect for the attendee slots, add handlers
	if (!isAllAttendees && !organizer) {
		// add DwtSelect
		var button;
		var btnId = sched.dwtSelectId;
		var btnDiv = document.getElementById(btnId);
		if (this.isComposeMode && btnDiv) {
            button  = new DwtButton({parent: this, parentElement: btnId, className: 'ZAttRole'});
            button.setText("");
            button.setAriaLabel(ZmMsg.attendeeRole);
            button.setImage("AttendeesRequired");
            button.setMenu(new AjxListener(this, this._getAttendeeRoleMenu, [index]));
            sched.btnObj = button;
		}
		// add DwtInputField
		var nameDiv = document.getElementById(sched.dwtNameId);
		if (nameDiv) {
			var dwtInputField = new DwtInputField({parent: this, type: DwtInputField.STRING, maxLen: 256});
			dwtInputField.setDisplay(Dwt.DISPLAY_INLINE);
			var inputEl = dwtInputField.getInputElement();
            Dwt.setSize(inputEl, Dwt.DEFAULT, "2rem")
			inputEl.className = "ZmSchedulerInput";
			inputEl.id = sched.dwtInputId;
            inputEl.style.border = "0px";
			sched.attType = inputEl._attType = ZmCalBaseItem.PERSON;
			sched.inputObj = dwtInputField;
			if (button) {
				button.dwtInputField = dwtInputField;
			}
			dwtInputField.reparentHtmlElement(sched.dwtNameId);
		}

		sched.ptstObj = document.getElementById(sched.dwtNameId+"_ptst");

        Dwt.setVisible(sched.ptstObj, this.isComposeMode ? this._editView.getRsvp() : true);

		// set handlers
		var attendeeInput = document.getElementById(sched.dwtInputId);
		if (attendeeInput) {
			this._activeInputIdx = index;
			// handle focus moving to/from an enabled input
			Dwt.setHandler(attendeeInput, DwtEvent.ONFOCUS, ZmFreeBusySchedulerView._onFocus);
			Dwt.setHandler(attendeeInput, DwtEvent.ONBLUR, ZmFreeBusySchedulerView._onBlur);
			attendeeInput._schedViewPageId = this._svpId;
			attendeeInput._schedTableIdx = index;
		}
	}

	if (drawBorder) {
		this._updateBorders(sched, isAllAttendees);
	}
    
	if (setFocus && sched.inputObj) {
		this._kbMgr.grabFocus(sched.inputObj);
	}
	return index;
};

ZmFreeBusySchedulerView.prototype._getAttendeeRoleMenu =
function(index) {
    var sched = this._schedTable[index];
    var listener = new AjxListener(this, this._attendeeRoleListener, [index]);
    var menu = new DwtMenu({parent:sched.btnObj});
    for(var i in ZmFreeBusySchedulerView.ROLE_OPTIONS) {
        var info = ZmFreeBusySchedulerView.ROLE_OPTIONS[i];
        var menuItem = new DwtMenuItem({parent:menu, style:DwtMenuItem.CASCADE_STYLE});
        menuItem.setImage(info.image);
        menuItem.setText(info.label);
        menuItem.setData(ZmOperation.MENUITEM_ID, i);
        menuItem.addSelectionListener(listener);
    }
    return menu;
};

ZmFreeBusySchedulerView.prototype._attendeeRoleListener =
function(index, ev) {
    var item = ev.dwtObj;
    var data = item.getData(ZmOperation.MENUITEM_ID);
    var sched = this._schedTable[index];
    sched.btnObj.setImage(ZmFreeBusySchedulerView.ROLE_OPTIONS[data].image);
    sched.btnObj.getMenu().popdown();
    this._handleRoleChange(sched, data, this);
};

ZmFreeBusySchedulerView.prototype._removeAttendeeRow =
function(index, updateTabGroup) {
	this._attendeesTable.deleteRow(index);
	this._schedTable.splice(index, 1);
	if (updateTabGroup) {
		this._controller._setComposeTabGroup(true);
	}
};

ZmFreeBusySchedulerView.prototype._hideAttendeeRow =
function(index, updateTabGroup) {
    var row = this._attendeesTable.rows[index];
    if(row){
        row.style.display="none";
    }
    if (updateTabGroup) {
        this._controller._setComposeTabGroup(true);
    }

};

ZmFreeBusySchedulerView.prototype._createDwtObjects =
function() {

    //todo: use time selection listener when appt time is changed
	//var timeSelectListener = new AjxListener(this, this._timeChangeListener);

	this._curValStartDate = "";
	this._curValEndDate = "";

	// add All Attendees row
	this._svpId = AjxCore.assignId(this);
	this._attendeesTable = document.getElementById(this._attendeesTableId);
	this._allAttendeesIndex = this._addAttendeeRow(true, null, false);
	this._allAttendeesSlot = this._schedTable[this._allAttendeesIndex];
	this._allAttendeesTable = document.getElementById(this._allAttendeesSlot.dwtTableId);
	this._showMoreLink = document.getElementById(this._showMoreLinkId);
    this._showMoreLink._schedViewPageId = this._svpId;
};

ZmFreeBusySchedulerView.prototype._showTimeFields =
function(show) {
	Dwt.setVisibility(this._startTimeSelect.getHtmlElement(), show);
	Dwt.setVisibility(this._endTimeSelect.getHtmlElement(), show);
	this._setTimezoneVisible(this._dateInfo);

	// also show/hide the "@" text
	Dwt.setVisibility(document.getElementById(this._startTimeAtLblId), show);
	Dwt.setVisibility(document.getElementById(this._endTimeAtLblId), show);
};

ZmFreeBusySchedulerView.prototype._isDuplicate =
function(email) {
    return this._emailToIdx[email] ? true : false;
}

/**
 * Called by ONBLUR handler for attendee input field.
 *
 * @param inputEl
 * @param attendee
 * @param useException
 */
ZmFreeBusySchedulerView.prototype._handleAttendeeField =
function(inputEl, attendee, useException) {

	var idx = inputEl._schedTableIdx;
	if (idx != this._activeInputIdx) return;

	var sched = this._schedTable[idx];
	if (!sched) return;
	var input = sched.inputObj;
	if (!input) return;

	var value = input.getValue();
	if (value) {
		value = AjxStringUtil.trim(value.replace(/[;,]$/, ""));	// trim separator, white space
	}
	var curAttendee = sched.attendee;
	var type = sched.attType;

	if (value) {
		if (curAttendee) {
			// user edited slot with an attendee in it
            var lookupEmail = this.getEmail(curAttendee);
            var emailTextShortForm = ZmApptViewHelper.getAttendeesText(curAttendee, type, true);
            //parse the email id to separate the name and email address
            var emailAddrObj = AjxEmailAddress.parse(value);
            var emailAddr = emailAddrObj ? emailAddrObj.getAddress() : "";
			if (emailAddr == lookupEmail || emailAddr == emailTextShortForm) {
				return;
			} else {
				this._resetRow(sched, false, type, true);
			}
		}
		attendee = attendee ? attendee : ZmApptViewHelper.getAttendeeFromItem(value, type, true);
		if (attendee) {
			var email = this.getEmail(attendee);


			if (email instanceof Array) {
				for (var i in email) {
                    if(this._isDuplicate(email[i])) {
                        //if duplicate - do nothing
                        return;
                    }
					this._emailToIdx[email[i]] = idx;
				}
			} else {
                if(this._isDuplicate(email)) {
                    //if duplicate - do nothing
                    return;
                }
				this._emailToIdx[email] = idx;
			}

			// go get this attendee's free/busy info if we haven't already
			if (sched.uid != email) {
				this._getFreeBusyInfo(this._getStartTime(), email);
			}
            var attendeeType = sched.btnObj ? sched.btnObj.getData(ZmFreeBusySchedulerView._VALUE) : null;
            var isOptionalAttendee = (attendeeType == ZmCalItem.ROLE_OPTIONAL);
            if(type != ZmCalBaseItem.LOCATION && type != ZmCalBaseItem.EQUIPMENT) {
                attendee.setParticipantRole( isOptionalAttendee ? ZmCalItem.ROLE_OPTIONAL : ZmCalItem.ROLE_REQUIRED);
            }
			sched.attendee = attendee;
            this._setParticipantStatus(sched, attendee, idx);
			this._setAttendeeToolTip(sched, attendee);
            //directly update attendees
			if(this.isComposeMode) {
                this._editView.parent.updateAttendees(attendee, type, ZmApptComposeView.MODE_ADD);
                if(isOptionalAttendee) this._editView.showOptional();
                this._editView._setAttendees();
            }
            else {
                this._editView.setMetadataAttendees(this._schedTable[this._organizerIndex].attendee, email);
                this._editView.refreshAppts();
            }
            if (!curAttendee) {
				// user added attendee in empty slot
				var value = this._emptyRowIndex = this._addAttendeeRow(false, null, true, null, true, true); // add new empty slot
                if (this.isComposeMode) {
                    this._editView.resize();
                }
                return value;
			}
		} else {
			this._activeInputIdx = null;
		}
	} else if (curAttendee) {

        if(this.isComposeMode) {
            this._editView.parent.updateAttendees(curAttendee, type, ZmApptComposeView.MODE_REMOVE);
            this._editView.removeAttendees(curAttendee, type);
            this._editView._setAttendees();
        }
		// user erased an attendee
		this._resetRow(sched, false, type);
        // bug:43660 removing row (splicing array) causes index mismatch.
        //this._removeAttendeeRow(idx, true);
		this._hideAttendeeRow(idx, true);
	}
};

ZmFreeBusySchedulerView.prototype._setAttendeeToolTip =
function(sched, attendee, type) {
	if (type != ZmCalBaseItem.PERSON) { return; }

	var name = attendee.getFullName();
	var email = this.getEmail(attendee);
	if (name && email) {
		var ptst = ZmMsg.attendeeStatusLabel + ZmCalItem.getLabelForParticipationStatus(attendee.getParticipantStatus() || "NE");
		sched.inputObj.setToolTipContent(email + (this.isComposeMode && this._editView.getRsvp()) ? ("<br>"+ ptst) : "");
	}
};

ZmFreeBusySchedulerView.prototype._getStartTime =
function() {
	return this._getStartDate().getTime();
};

ZmFreeBusySchedulerView.prototype._getEndTime =
function() {
	return this._getEndDate().getTime();
};

ZmFreeBusySchedulerView.prototype._getStartDate =
function() {
    var startDate = AjxDateUtil.simpleParseDateStr(this._dateInfo.startDate);
    return AjxTimezone.convertTimezone(startDate, this._dateInfo.timezone, AjxTimezone.DEFAULT);
};

ZmFreeBusySchedulerView.prototype._getEndDate =
function() {
    var endDate = AjxDateUtil.simpleParseDateStr(this._dateInfo.endDate);
    return AjxTimezone.convertTimezone(endDate, this._dateInfo.timezone, AjxTimezone.DEFAULT);
};

ZmFreeBusySchedulerView.prototype._setDateInfo =
function(dateInfo) {
	this._dateInfo = dateInfo;
};

ZmFreeBusySchedulerView.prototype._colorAllAttendees =
function() {
	var row = this._allAttendeesTable.rows[0];

	for (var i = 0; i < this._allAttendees.length; i++) {
		//if (this._allAttendees[i] > 0) {
			// TODO: opacity...
			var status = this.getAllAttendeeStatus(i);
			row.cells[i].className = this._getClassForStatus(status);
			this._allAttendeesSlot._coloredCells.push(row.cells[i]);
		//}
	}
};

ZmFreeBusySchedulerView.prototype.updateFreeBusy =
function(onlyUpdateTable) {
    this._updateFreeBusy();
};

ZmFreeBusySchedulerView.prototype._updateFreeBusy =
function() {
	// update the full date field
	this._resetFullDateField();

	// clear the schedules for existing attendees
	for (var i = 0; i < this._schedTable.length; i++) {
		var sched = this._schedTable[i];
		if (!sched) continue;
		while (sched._coloredCells && sched._coloredCells.length > 0) {
			sched._coloredCells[0].className = ZmFreeBusySchedulerView.FREE_CLASS;
			sched._coloredCells.shift();
		}

	}

	this._resetAttendeeCount();

    // Set in updateAttendees
	if (this._allAttendeeEmails && this._allAttendeeEmails.length) {
        //all attendees status need to be update even for unshown attendees
		var emails = this._allAttendeeEmails.join(",");
		this._getFreeBusyInfo(this._getStartTime(), emails);
	}
};

// XXX: optimize later - currently we always update the f/b view :(
ZmFreeBusySchedulerView.prototype._setAttendees =
function(organizer, attendees) {
	this.cleanup();

    //sync with date info from schedule view
    if(this.isComposeMode) ZmApptViewHelper.getDateInfo(this._editView, this._dateInfo);

    var emails = [], email, showMoreLink = false;

	// create a slot for the organizer
	this._organizerIndex = this._addAttendeeRow(false, ZmApptViewHelper.getAttendeesText(organizer, ZmCalBaseItem.PERSON, true), false);
	emails.push(this._setAttendee(this._organizerIndex, organizer, ZmCalBaseItem.PERSON, true));

    var list = [], totalAttendeesCount = 0;
    for (var t = 0; t < this._attTypes.length; t++) {
        var type = this._attTypes[t];
        if(attendees[type]) {
            var att = attendees[type].getArray ? attendees[type].getArray() : attendees[type];
            var attLength = att.length;
            totalAttendeesCount += att.length;
            if(this.isComposeMode && !this._isPageless && att.length > 10) {
                attLength = 10;
                showMoreLink = true;
            }

            for (var i = 0; i < attLength; i++) {
                list.push(att[i]);
                email = att[i] ? this.getEmail(att[i]) : null;
                emails.push(email);
            }
        }
    }

    Dwt.setDisplay(this._showMoreLink, showMoreLink ? Dwt.DISPLAY_INLINE : Dwt.DISPLAY_NONE);
    //exclude organizer while reporting no of attendees remaining
    this.updateNMoreAttendeesLabel(totalAttendeesCount - (emails.length - 1));

    this._updateBorders(this._allAttendeesSlot, true);
    
    //chunk processing of UI rendering
    this.batchUpdate(list);

    if (emails.length) {
        //all attendees status need to be update even for unshown attendees
        var allAttendeeEmails = this._allAttendeeEmails = this.getAllAttendeeEmails(attendees, organizer);
        this._getFreeBusyInfo(this._getStartTime(), allAttendeeEmails.join(","));
	}
};

ZmFreeBusySchedulerView.prototype.batchUpdate =
function(list, updateCycle) {

    if(list.length == 0) {
        // make sure there's always an empty slot
        this._emptyRowIndex = this._addAttendeeRow(false, null, false, null, true, false);
        this._colorAllAttendees();
        this.resizeKeySpacer();
        return;
    }

    if(!updateCycle) updateCycle = 0;

    var isOrganizer = this.isComposeMode ? this._appt.isOrganizer() : null;
    var emails = [], type;

    for(var i=0; i < ZmFreeBusySchedulerView.BATCH_SIZE; i++) {
        if(list.length == 0) break;
        var att = list.shift();
        type = (att instanceof ZmResource) ? att.resType : ZmCalBaseItem.PERSON;
        this.addAttendee(att, type, isOrganizer, emails);
    }
    
    if (this.isComposeMode) {
        this._editView.resize();
    }
    this.batchUpdateSequence(list, updateCycle+1);
};

ZmFreeBusySchedulerView.prototype.batchUpdateSequence =
function(list,updateCycle) {
    this._timedAction = new AjxTimedAction(this, this.batchUpdate, [list, updateCycle]);
    this._timedActionId = AjxTimedAction.scheduleAction(this._timedAction, ZmFreeBusySchedulerView.DELAY);
};

ZmFreeBusySchedulerView.prototype.addAttendee =
function(att, type, isOrganizer, emails) {
    var email = att ? this.getEmail(att) : null;
    if (email && !this._emailToIdx[email]) {
        var index = this._addAttendeeRow(false, null, false); // create a slot for this attendee
        emails.push(this._setAttendee(index, att, type, false));

        var sched = this._schedTable[index];
        if(this._appt && sched) {
            if(sched.inputObj) sched.inputObj.setEnabled(isOrganizer);
            if(sched.btnObj) sched.btnObj.setEnabled(isOrganizer);
        }
    }
};

ZmFreeBusySchedulerView.prototype.setUpdateCallback =
function(callback) {
    this._updateCallback = callback;
};

ZmFreeBusySchedulerView.prototype.postUpdateHandler =
function() {
    this._colorAllAttendees();
    if(this._updateCallback) {
        this._updateCallback.run();
        this._updateCallback = null;
    }
};


ZmFreeBusySchedulerView.prototype.getAllAttendeeEmails =
function(attendees, organizer) {
    var emails = [];
    for (var t = 0; t < this._attTypes.length; t++) {
        var type = this._attTypes[t];
        var att = attendees[type].getArray ? attendees[type].getArray() : attendees[type];
        var attLength = att.length;
        for (var i = 0; i < attLength; i++) {
            var email = att[i] ? this.getEmail(att[i]) : null;
            if (email) emails.push(email);
        }
    }
    if(organizer) {
        var organizerEmail =  this.getEmail(organizer);
        emails.push(organizerEmail);
    }
    return emails;
};

ZmFreeBusySchedulerView.prototype._updateAttendees =
function(organizer, attendees) {

    var emails = [], newEmails = {}, showMoreLink = false, totalAttendeesCount = 0, attendeesRendered = 0;

    //update newly added attendee
	for (var t = 0; t < this._attTypes.length; t++) {
		var type = this._attTypes[t];
        if(attendees[type]) {
            var att = attendees[type].getArray ? attendees[type].getArray() : attendees[type];

            //debug: remove this limitation
            var attLengthLimit = att.length;
            totalAttendeesCount += att.length;
            if(this.isComposeMode && !this._isPageless && att.length > 10) {
                attLengthLimit = 10;
                showMoreLink = true;
            }

            for (var i = 0; i < att.length; i++) {
                var email = att[i] ? this.getEmail(att[i]) : null;
                if(email) newEmails[email] = true;
                if (i < attLengthLimit && email && !this._emailToIdx[email]) {
                    var index;
                    if(this._emptyRowIndex != null) {
                        emails.push(this._setAttendee(this._emptyRowIndex, att[i], type, false));
                        this._emptyRowIndex = null;
                    }else {
                        index = this._addAttendeeRow(false, null, false); // create a slot for this attendee
                        emails.push(this._setAttendee(index, att[i], type, false));
                    }
                }

                //keep track of total attendees rendered
                if (this._emailToIdx[email]) attendeesRendered++;
            }
        }
	}

    Dwt.setDisplay(this._showMoreLink, showMoreLink ? Dwt.DISPLAY_INLINE : Dwt.DISPLAY_NONE);
    this.updateNMoreAttendeesLabel(totalAttendeesCount - attendeesRendered);

    //update deleted attendee
    for(var id in this._emailToIdx) {
        if(!newEmails[id]) {
            var idx = this._emailToIdx[id];
            if(this._organizerIndex == idx) continue;
            var sched = this._schedTable[idx];
            if(!sched) continue;
            this._resetRow(sched, false, sched.attType, false, true);
            this._hideRow(idx);
            this._schedTable[idx] = null;
        }
    }

    this._setAttendee(this._organizerIndex, organizer, ZmCalBaseItem.PERSON, true);

    if(emails.length > 0) {
	    // make sure there's always an empty slot
	    this._emptyRowIndex = this._addAttendeeRow(false, null, false, null, true, false);
    }

    // Update the attendee list
    this._allAttendeeEmails = this.getAllAttendeeEmails(attendees, organizer);
	if (emails.length) {
        //all attendees status need to be update even for unshown attendees
        var allAttendeeEmails =  this._allAttendeeEmails;
		this._getFreeBusyInfo(this._getStartTime(), allAttendeeEmails.join(","));
	}else {
        this.postUpdateHandler();
    }
};

ZmFreeBusySchedulerView.prototype.updateNMoreAttendeesLabel =
function(count) {
    this._showMoreLink.innerHTML = AjxMessageFormat.format(ZmMsg.moreAttendees, count);
};

ZmFreeBusySchedulerView.prototype._setAttendee =
function(index, attendee, type, isOrganizer) {
	var sched = this._schedTable[index];
	if (!sched) { return; }

	sched.attendee = attendee;
	sched.attType = type;
	var input = sched.inputObj;
	if (input) {
		input.setValue(ZmApptViewHelper.getAttendeesText(attendee, type, false), true);
		this._setAttendeeToolTip(sched, attendee, type);
	}

    var nameDiv = document.getElementById(sched.dwtNameId);
    if(isOrganizer && nameDiv) {
        nameDiv.innerHTML = '<div class="ZmSchedulerInputDisabled">' + ZmApptViewHelper.getAttendeesText(attendee, type, true) + '</div>';
    }

    var button = sched.btnObj;
    var role = attendee.getParticipantRole() || ZmCalItem.ROLE_REQUIRED;

    if(type == ZmCalBaseItem.PERSON && role == ZmCalItem.ROLE_OPTIONAL) {
        type = ZmCalItem.ROLE_OPTIONAL;
    }

	if (button) {
        var info = ZmFreeBusySchedulerView.ROLE_OPTIONS[type];
        button.setImage(info.image);
        button.setData(ZmFreeBusySchedulerView._VALUE, type);
	}

    this._setParticipantStatus(sched, attendee, index);
    
	var email = this.getEmail(attendee);
	if (email instanceof Array) {
        sched.uid = email[0];
		for (var i in email) {
			this._emailToIdx[email[i]] = index;
		}
	} else {
        sched.uid = email;
		this._emailToIdx[email] = index;
	}

	return email;
};

ZmFreeBusySchedulerView.prototype.getAttendees =
function() {
    var attendees = [];
    for (var i=0; i < this._schedTable.length; i++) {
        var sched = this._schedTable[i];
        if(!sched) {
            continue;
        }
        if(sched.attendee) {
            attendees.push(sched.attendee);
        }
    }
    return AjxVector.fromArray(attendees);
};

/**
 * sets participant status for an attendee
 *
 * @param sched 		[object]		scedule object which contains info related to this attendee row
 * @param attendee		[object]		attendee object ZmContact/ZmResource
 * @param index 		[Integer]		index of the schedule
 */
ZmFreeBusySchedulerView.prototype._setParticipantStatus =
function(sched, attendee, index) {
    var ptst = attendee.getParticipantStatus() || "NE";
    var ptstCont = sched.ptstObj;
    if (ptstCont) {
        if(this.isComposeMode) {
            var ptstIcon = ZmCalItem.getParticipationStatusIcon(ptst);
            if (ptstIcon != "") {
                var ptstLabel = ZmMsg.attendeeStatusLabel + " " + ZmCalItem.getLabelForParticipationStatus(ptst);
                ptstCont.innerHTML = AjxImg.getImageHtml(ptstIcon);
                var imgDiv = ptstCont.firstChild;
                if(imgDiv && !imgDiv._schedViewPageId ){
                    Dwt.setHandler(imgDiv, DwtEvent.ONMOUSEOVER, ZmFreeBusySchedulerView._onPTSTMouseOver);
                    Dwt.setHandler(imgDiv, DwtEvent.ONMOUSEOUT, ZmFreeBusySchedulerView._onPTSTMouseOut);
                    imgDiv._ptstLabel = ptstLabel;
                    imgDiv._schedViewPageId = this._svpId;
                    imgDiv._schedTableIdx = index;
                }
            }
        }
        else {
            var deleteButton = new DwtBorderlessButton({parent:this, className:"Label"});
            deleteButton.setImage("Disable");
            deleteButton.setText("");
            deleteButton.addSelectionListener(new AjxListener(this, this._deleteAttendeeRow, [attendee.getEmail()]));
            deleteButton.getHtmlElement().style.cursor = 'pointer';
            deleteButton.replaceElement(ptstCont.firstChild, false, false);
        }
    }
};

/**
 * Resets a row to its starting state. The input is cleared and removed, and
 * the free/busy blocks are set back to their default color. Optionally, the
 * select is set back to person.
 *
 * @param sched			[object]		info for this row
 * @param resetSelect	[boolean]*		if true, set select to PERSON
 * @param type			[constant]*		attendee type
 * @param noClear		[boolean]*		if true, don't clear input field
 * @param noUpdate		[boolean]*		if true, don't update parent view
 */
ZmFreeBusySchedulerView.prototype._resetRow =
function(sched, resetRole, type, noClear, noUpdate) {

	var input = sched.inputObj;
	if (sched.attendee && type) {

        if(this.isComposeMode && !noUpdate) {
            this._editView.parent.updateAttendees(sched.attendee, type, ZmApptComposeView.MODE_REMOVE);
            this._editView._setAttendees();
        }

        if (input) {
			input.setToolTipContent(null);
		}

        var email = this.getEmail(sched.attendee);
        delete this._fbConflict[email];

        if (email instanceof Array) {
            for (var i in email) {
                var m = email[i];
                this._emailToIdx[m] = null;
                delete this._emailToIdx[m];
            }
        } else {
            this._emailToIdx[email] = null;
            delete this._emailToIdx[email];
        }

		sched.attendee = null;
	}

	// clear input field
	if (input && !noClear) {
		input.setValue("", true);
	}

	// reset the row color to non-white
	var table = document.getElementById(sched.dwtTableId);
	if (table) {
		table.rows[0].className = "ZmSchedulerDisabledRow";
	}

	// remove the bgcolor from the cells that were colored
	this._clearColoredCells(sched);

	// reset the select to person
	if (resetRole) {
		var button = sched.btnObj;
		if (button) {
            var info = ZmFreeBusySchedulerView.ROLE_OPTIONS[ZmCalBaseItem.PERSON];
			button.setImage(info.image);
		}
	}

	sched.uid = null;
	this._activeInputIdx = null;

};

ZmFreeBusySchedulerView.prototype._resetTimezoneSelect =
function(dateInfo) {
	this._tzoneSelect.setSelectedValue(dateInfo.timezone);
};

ZmFreeBusySchedulerView.prototype._setTimezoneVisible =
function(dateInfo) {
	var showTimezone = !dateInfo.isAllDay;
	if (showTimezone) {
		showTimezone = appCtxt.get(ZmSetting.CAL_SHOW_TIMEZONE) ||
					   dateInfo.timezone != AjxTimezone.getServerId(AjxTimezone.DEFAULT);
	}
	Dwt.setVisibility(this._tzoneSelect.getHtmlElement(), showTimezone);
};

ZmFreeBusySchedulerView.prototype._clearColoredCells =
function(sched) {
	while (sched._coloredCells.length > 0) {
		// decrement cell count in all attendees row
		var idx = sched._coloredCells[0].cellIndex;
		if (this._allAttendees[idx] > 0) {
			this._allAttendees[idx] = this._allAttendees[idx] - 1;
		}

		sched._coloredCells[0].className = ZmFreeBusySchedulerView.FREE_CLASS;
		sched._coloredCells.shift();
	}
	var allAttColors = this._allAttendeesSlot._coloredCells;
	while (allAttColors.length > 0) {
		var idx = allAttColors[0].cellIndex;
		// clear all attendees cell if it's now free
		if (this._allAttendees[idx] == 0) {
			allAttColors[0].className = ZmFreeBusySchedulerView.FREE_CLASS;
		}
		allAttColors.shift();
	}
};

ZmFreeBusySchedulerView.prototype._resetAttendeeCount =
function() {
	for (var i = 0; i < ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS; i++) {
		this._allAttendees[i] = 0;
		delete this._allAttendeesStatus[i];
	}
};

ZmFreeBusySchedulerView.prototype._resetFullDateField =
function() {
};

// Listeners

ZmFreeBusySchedulerView.prototype._navBarListener =
function(ev) {
	var op = ev.item.getData(ZmOperation.KEY_ID);

	var sd = AjxDateUtil.simpleParseDateStr(this._dateInfo.startDate);
	var ed = AjxDateUtil.simpleParseDateStr(this._dateInfo.endDate);

	var newSd = op == ZmOperation.PAGE_BACK ? sd.getDate()-1 : sd.getDate()+1;
	var newEd = op == ZmOperation.PAGE_BACK ? ed.getDate()-1 : ed.getDate()+1;

	sd.setDate(newSd);
	ed.setDate(newEd);

	this._updateFreeBusy();

	// finally, update the appt tab view page w/ new date(s)
	if(this.isComposeMode) this._editView.updateDateField(AjxDateUtil.simpleComputeDateStr(sd), AjxDateUtil.simpleComputeDateStr(ed));
};



ZmFreeBusySchedulerView.prototype.changeDate =
function(dateInfo) {

    this._setDateInfo(dateInfo);
	this._updateFreeBusy();

	// finally, update the appt tab view page w/ new date(s)
	if(this.isComposeMode) this._editView.updateDateField(AjxDateUtil.simpleComputeDateStr(sd), AjxDateUtil.simpleComputeDateStr(ed));
};

ZmFreeBusySchedulerView.prototype.setDateBorder =
function(dateBorder) {
    this._dateBorder = dateBorder;
};
ZmFreeBusySchedulerView.prototype._timeChangeListener =
function(ev, id) {
    this.handleTimeChange();
};

ZmFreeBusySchedulerView.prototype.handleTimeChange =
function() {
    if(this.isComposeMode) ZmApptViewHelper.getDateInfo(this._editView, this._dateInfo);
	this._dateBorder = this._getBordersFromDateInfo();
	this._outlineAppt();
    this._updateFreeBusy();
};

ZmFreeBusySchedulerView.prototype._handleRoleChange =
function(sched, type, svp) {

    if(type == ZmCalBaseItem.PERSON || type == ZmCalItem.ROLE_REQUIRED || type == ZmCalItem.ROLE_OPTIONAL) {
        if(sched.attendee) {
            sched.attendee.setParticipantRole((type == ZmCalItem.ROLE_OPTIONAL) ? ZmCalItem.ROLE_OPTIONAL : ZmCalItem.ROLE_REQUIRED);
            if(this.isComposeMode) {
                this._editView._setAttendees();
                this._editView.updateScheduleAssistant(this._attendees[ZmCalBaseItem.PERSON], ZmCalBaseItem.PERSON);
                if(type == ZmCalItem.ROLE_OPTIONAL) this._editView.showOptional();  
            }
        }
        type = ZmCalBaseItem.PERSON;
    }

	if (sched.attType == type) return;

    var attendee = sched.attendee;

	// if we wiped out an attendee, make sure it's reflected in master list
	if (attendee) {

        var email = this.getEmail(attendee);
        delete this._emailToIdx[email];
        delete this._fbConflict[email];
        this._editView.showConflicts();

		if(this.isComposeMode) {
            this._editView.parent.updateAttendees(attendee, sched.attType, ZmApptComposeView.MODE_REMOVE);
            this._editView._setAttendees();
            if(type == ZmCalBaseItem.PERSON) this._editView.updateScheduleAssistant(this._attendees[ZmCalBaseItem.PERSON], ZmCalBaseItem.PERSON);
        }
		sched.attendee = null;
	}
	sched.attType = type;

	// reset row
	var input = sched.inputObj;
	input.setValue("", true);
    input.focus();
	svp._clearColoredCells(sched);

	// reset autocomplete handler
	var inputEl = input.getInputElement();
	if (type == ZmCalBaseItem.PERSON && svp._acContactsList) {
		svp._acContactsList.handle(inputEl);
	} else if (type == ZmCalBaseItem.LOCATION && svp._acLocationsList) {
		svp._acLocationsList.handle(inputEl);
	} else if (type == ZmCalBaseItem.EQUIPMENT && svp._acEquipmentList) {
		svp._acEquipmentList.handle(inputEl);
	}
};

ZmFreeBusySchedulerView.prototype.getEmail =
function(attendee) {
    return attendee.getLookupEmail() || attendee.getEmail();
};

ZmFreeBusySchedulerView.prototype._colorSchedule =
function(status, slots, table, sched) {
	var row = table.rows[0];
	var className = this._getClassForStatus(status);

    var currentDate = this._getStartDate();

	if (row && className) {
		// figure out the table cell that needs to be colored
		for (var i = 0; i < slots.length; i++) {
            if(status == ZmFreeBusySchedulerView.STATUS_WORKING) {
                this._fbCache.convertWorkingHours(slots[i], currentDate);
            }
			var startIdx = this._getIndexFromTime(slots[i].s);
			var endIdx = this._getIndexFromTime(slots[i].e, true);

            if(slots[i].s <= currentDate.getTime()) {
                startIdx = 0;
            }

            if(slots[i].e >= currentDate.getTime() + AjxDateUtil.MSEC_PER_DAY) {
                endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
            }

            //bug:45623 assume start index is zero if its negative
            if(startIdx < 0) {startIdx = 0;}
            //bug:45623 skip the slot that has negative end index.
            if(endIdx < 0) { continue; }

			// normalize
			if (endIdx < startIdx) {
				endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
			}

			for (j = startIdx; j <= endIdx; j++) {
				if (row.cells[j]) {
					if (status != ZmFreeBusySchedulerView.STATUS_UNKNOWN) {
						this._allAttendees[j] = this._allAttendees[j] + 1;
						this.updateAllAttendeeCellStatus(j, status);
					}
                    if(row.cells[j].className != ZmFreeBusySchedulerView.FREE_CLASS && status == ZmFreeBusySchedulerView.STATUS_WORKING) {
                        // do not update anything if the status is already changed
                        continue;
                    }
                    sched._coloredCells.push(row.cells[j]);
                    row.cells[j].className = className;
                    row.cells[j]._fbStatus = status;

				}
			}
		}
	}
};

ZmFreeBusySchedulerView.prototype._updateAllAttendees =
function(status, slots) {

    var currentDate = this._getStartDate();

    for (var i = 0; i < slots.length; i++) {
        if(status == ZmFreeBusySchedulerView.STATUS_WORKING) {
            this._fbCache.convertWorkingHours(slots[i], currentDate);
        }
        var startIdx = this._getIndexFromTime(slots[i].s);
        var endIdx = this._getIndexFromTime(slots[i].e, true);

        if(slots[i].s <= currentDate.getTime()) {
            startIdx = 0;
        }

        if(slots[i].e >= currentDate.getTime() + AjxDateUtil.MSEC_PER_DAY) {
            endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
        }

        //bug:45623 assume start index is zero if its negative
        if(startIdx < 0) {startIdx = 0;}
        //bug:45623 skip the slot that has negative end index.
        if(endIdx < 0) { continue; }

        // normalize
        if (endIdx < startIdx) {
            endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
        }

        for (j = startIdx; j <= endIdx; j++) {
            if (status != ZmFreeBusySchedulerView.STATUS_UNKNOWN) {
                this._allAttendees[j] = this._allAttendees[j] + 1;
                this.updateAllAttendeeCellStatus(j, status);
            }
        }
    }
};

/**
 * Draws a dark border for the appt's start and end times.
 */
ZmFreeBusySchedulerView.prototype._outlineAppt =
function() {
	this._updateBorders(this._allAttendeesSlot, true);
	for (var j = 1; j < this._schedTable.length; j++) {
		this._updateBorders(this._schedTable[j]);
	}
    this.resizeKeySpacer();
};

ZmFreeBusySchedulerView.prototype.resizeKeySpacer =
function() {
    var graphKeySpacer = document.getElementById(this._htmlElId + '_graphKeySpacer');
    if(graphKeySpacer) {
        var size = Dwt.getSize(document.getElementById(this._navToolbarId));
        Dwt.setSize(graphKeySpacer, size.x - 6, Dwt.DEFAULT);
    }
};

/**
 * Outlines the times of the current appt for the given row.
 *
 * @param sched				[sched]			info for this row
 * @param isAllAttendees	[boolean]*		if true, this is the All Attendees row
 */
ZmFreeBusySchedulerView.prototype._updateBorders =
function(sched, isAllAttendees) {
	if (!sched) { return; }

	var td, div, curClass, newClass;

	// mark right borders of appropriate f/b table cells
	var normalClassName = "ZmSchedulerGridDiv";
	var halfHourClassName = normalClassName + "-halfHour";
	var startClassName = normalClassName + "-start";
	var endClassName = normalClassName + "-end";

	var table = document.getElementById(sched.dwtTableId);
	var row = table.rows[0];
	if (row) {
		for (var i = 0; i < ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS; i++) {
		    td = row.cells[i];
			div = td ? td.getElementsByTagName("*")[0] : null;
			if (div) {
				curClass = div.className;
				newClass = normalClassName;
				if (i == this._dateBorder.start) {
					newClass = startClassName;
				} else if (i == this._dateBorder.end) {
					newClass = endClassName;
				} else if (i % 2 == 0) {
					newClass = halfHourClassName;
				}
				if (curClass != newClass) {
					div.className = newClass;
				}
			}
		}
		td = row.cells[0];
		div = td ? td.getElementsByTagName("*")[0] : null;
		if (div && (this._dateBorder.start == -1)) {
		    div.className += " " + normalClassName + "-leftStart";
		}
	}
};

/**
 * Calculate index of the cell that covers the given time. A start time on a
 * half-hour border covers the corresponding time block, whereas an end time
 * does not. For example, an appt with a start time of 5:00 causes the 5:00 -
 * 5:30 block to be marked. The end time of 5:30 does not cause the 5:30 - 6:00
 * block to be marked.
 *
 * @param time		[Date or int]		time
 * @param isEnd		[boolean]*			if true, this is an appt end time
 * @param adjust	[boolean]*			Specify whether the time should be
 * 										adjusted based on timezone selector. If
 * 										not specified, assumed to be true.
 */
ZmFreeBusySchedulerView.prototype._getIndexFromTime =
function(time, isEnd, adjust) {
    var hourmin,
        seconds;
    adjust = adjust != null ? adjust : true;
    if(adjust) {
        var dayStartTime = this._getStartTime();
        var indexTime = (time instanceof Date) ? time.getTime() : time;
        hourmin = (indexTime - dayStartTime)/60000; //60000 = 1000(msec) * 60 (sec) - hence, dividing by 60000 means calculating the minutes and
        seconds = (indexTime - dayStartTime)%60000; //mod by 60000 means calculating the seconds remaining
    }
    else {
        var d = (time instanceof Date) ? time : new Date(time);
        hourmin = d.getHours() * 60 + d.getMinutes();
        seconds = d.getSeconds();
    }
    var idx = Math.floor(hourmin / 60) * 2;
	var minutes = hourmin % 60;
	if (minutes >= 30) {
		idx++;
	}
	// end times don't mark blocks on half-hour boundary
	if (isEnd && (minutes == 0 || minutes == 30)) {
		// block even if it exceeds 1 second
		//var s = d.getSeconds();
		if (seconds == 0) {
			idx--;
		}
	}

	return idx;
};

ZmFreeBusySchedulerView.prototype._getBordersFromDateInfo =
function() {
	// Setup the start/end for an all day appt
	var index = {start: -1, end: ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS-1};
	if (this._dateInfo.showTime) {
		// Not an all day appt, determine the appts start and end
		var idx = AjxDateUtil.isLocale24Hour() ? 0 : 1;
		this._processDateInfo(this._dateInfo);

		// subtract 1 from index since we're marking right borders
		index.start = this._getIndexFromTime(this._startDate, null, false) - 1;
		if (this._dateInfo.endDate == this._dateInfo.startDate) {
			index.end = this._getIndexFromTime(this._endDate, true, false);
		}
	}
	return index;
};

ZmFreeBusySchedulerView.prototype._processDateInfo =
function(dateInfo) {
    var startDate = AjxDateUtil.simpleParseDateStr(dateInfo.startDate);
    var endDate   = AjxDateUtil.simpleParseDateStr(dateInfo.endDate);
    if (dateInfo.isAllDay) {
        startDate.setHours(0,0,0,0);
        this._startDate = startDate;
        endDate.setHours(23,59,59,999);
        this._endDate   = endDate;
    } else {
        this._startDate = DwtTimeInput.getDateFromFields(dateInfo.startTimeStr,startDate);
        this._endDate   = DwtTimeInput.getDateFromFields(dateInfo.endTimeStr,  endDate);
    }
}

ZmFreeBusySchedulerView.prototype._getClassForStatus =
function(status) {
	return ZmFreeBusySchedulerView.STATUS_CLASSES[status];
};

ZmFreeBusySchedulerView.prototype._getClassForParticipationStatus =
function(status) {
	return ZmFreeBusySchedulerView.PSTATUS_CLASSES[status];
};

ZmFreeBusySchedulerView.prototype._getFreeBusyInfo =
function(startTime, emailList, callback) {

    var endTime = startTime + AjxDateUtil.MSEC_PER_DAY;
    var emails = emailList.split(",");
    var freeBusyParams  = {
        emails: emails,
        startTime: startTime,
        endTime: endTime,
        callback: callback
    };

    var callback = new AjxCallback(this, this._handleResponseFreeBusy, [freeBusyParams]);    
	var errorCallback = new AjxCallback(this, this._handleErrorFreeBusy, [freeBusyParams]);

    var acct = (appCtxt.multiAccounts)
        ? this._editView.getCalendarAccount() : null;


    var params = {
        startTime: startTime,
        endTime: endTime,
        emails: emails,
        callback: callback,
        errorCallback: errorCallback,
        noBusyOverlay: true,
        account: acct
    };

    var appt = this._editView.parent.getAppt ? this._editView.parent.getAppt(true) : null;
    if (appt) {
        params.excludedId = appt.uid;

    }
    this._freeBusyRequest = this._fbCache.getFreeBusyInfo(params);
};

// Callbacks

ZmFreeBusySchedulerView.prototype._handleResponseFreeBusy =
function(params, result) {

    this._freeBusyRequest = null;
    var dateInfo = this._dateInfo;
    this._processDateInfo(dateInfo);
    // Adjust start and end time by 1 msec, to avoid fencepost problems when detecting conflicts
    var apptStartTime = this._startDate.getTime(),
        apptEndTime = this._endDate.getTime(),
        apptConflictStartTime = apptStartTime+ 1,
        apptConflictEndTime   = apptEndTime-1,
        appt = this._appt,
        orgEmail = appt && !appt.inviteNeverSent ? appt.organizer : null,
        apptOrigStartTime = appt ? appt.getOrigStartTime() : null,
        apptOrigEndTime = appt ? (dateInfo.isAllDay ? appt.getOrigEndTime() - 1 : appt.getOrigEndTime()) : null,
        apptTimeChanged = appt ? !(apptOrigStartTime == apptStartTime && apptOrigEndTime == apptEndTime) : false;

    for (var i = 0; i < params.emails.length; i++) {
		var email = params.emails[i];

		this._detectConflict(email, apptConflictStartTime, apptConflictEndTime);

		// first clear out the whole row for this email id
		var sched = this._schedTable[this._emailToIdx[email]],
            attendee = sched ? sched.attendee : null,
            ptst = attendee ? attendee.getParticipantStatus() : null,
            usr = this._fbCache.getFreeBusySlot(params.startTime, params.endTime, email),
            table = sched ? document.getElementById(sched.dwtTableId) : null;

        if (usr && (ptst == ZmCalBaseItem.PSTATUS_ACCEPT || email == orgEmail)) {
            if (!usr.b) {
                usr.b = [];
            }
            if (apptTimeChanged) {
                usr.b.push({s:apptOrigStartTime, e: apptOrigEndTime});
            }
            else {
                usr.b.push({s:apptStartTime, e: apptEndTime});
            }
        }

		if (table) {
			table.rows[0].className = "ZmSchedulerNormalRow";
			this._clearColoredCells(sched);

            if(!usr) continue;
			sched.uid = usr.id;

            // next, for each free/busy status, color the row for given start/end times
			if (usr.n) this._colorSchedule(ZmFreeBusySchedulerView.STATUS_UNKNOWN, usr.n, table, sched);
			if (usr.t) this._colorSchedule(ZmFreeBusySchedulerView.STATUS_TENTATIVE, usr.t, table, sched);
			if (usr.b) this._colorSchedule(ZmFreeBusySchedulerView.STATUS_BUSY, usr.b, table, sched);
			if (usr.u) this._colorSchedule(ZmFreeBusySchedulerView.STATUS_OUT, usr.u, table, sched);
		}else {

            //update all attendee status - we update all attendee status correctly even if we have slight
            if(!usr) continue;

            if (usr.n) this._updateAllAttendees(ZmFreeBusySchedulerView.STATUS_UNKNOWN, usr.n);
            if (usr.t) this._updateAllAttendees(ZmFreeBusySchedulerView.STATUS_TENTATIVE, usr.t);
            if (usr.b) this._updateAllAttendees(ZmFreeBusySchedulerView.STATUS_BUSY, usr.b);
            if (usr.u) this._updateAllAttendees(ZmFreeBusySchedulerView.STATUS_OUT, usr.u);

        }
	}

    if (this._fbParentCallback) {
        this._fbParentCallback.run();
    }

    var acct = (appCtxt.multiAccounts)
        ? this._editView.getCalendarAccount() : null;
    
    var workingHrsCallback = new AjxCallback(this, this._handleResponseWorking, [params]);
    var errorCallback = new AjxCallback(this, this._handleErrorFreeBusy, [params]);

    //optimization: fetch working hrs for a week - wrking hrs pattern repeat everyweek
    var weekStartDate = new Date(params.startTime);
    var dow = weekStartDate.getDay();
    weekStartDate.setDate(weekStartDate.getDate()-((dow+7))%7);


    var whrsParams = {
        startTime: weekStartDate.getTime(),
        endTime: weekStartDate.getTime() + 7*AjxDateUtil.MSEC_PER_DAY,
        emails: params.emails,
        callback: workingHrsCallback,
        errorCallback: errorCallback,
        noBusyOverlay: true,
        account: acct
    };

    this._workingHoursRequest = this._fbCache.getWorkingHours(whrsParams);
};

ZmFreeBusySchedulerView.prototype._detectConflict =
function(email, startTime, endTime) {
    var sched = this._fbCache.getFreeBusySlot(startTime, endTime, email);
    var isFree = true;
    if(sched.b) isFree = isFree && ZmApptAssistantView.isBooked(sched.b, startTime, endTime);
    if(sched.t) isFree = isFree && ZmApptAssistantView.isBooked(sched.t, startTime, endTime);
    if(sched.u) isFree = isFree && ZmApptAssistantView.isBooked(sched.u, startTime, endTime);

    this._fbConflict[email] = isFree;
}

ZmFreeBusySchedulerView.prototype.getConflicts =
function() {
    return this._fbConflict;
}



ZmFreeBusySchedulerView.prototype._handleResponseWorking =
function(params, result) {

    this._workingHoursRequest = null;

	for (var i = 0; i < params.emails.length; i++) {
		var email = params.emails[i];
        var usr = this._fbCache.getWorkingHrsSlot(params.startTime, params.endTime, email);

        if(!usr) continue;

		// first clear out the whole row for this email id
		var sched = this._schedTable[this._emailToIdx[usr.id]];
		var table = sched ? document.getElementById(sched.dwtTableId) : null;
		if (table) {
            sched.uid = usr.id;
            // next, for each free/busy status, color the row for given start/end times
			if (usr.f) this._colorSchedule(ZmFreeBusySchedulerView.STATUS_WORKING, usr.f, table, sched);
            //show entire day as working hours if the information is not available (e.g. external accounts)
            if (usr.n) {
                var currentDay = this._getStartDate();
                var entireDaySlot = {
                    s: currentDay.getTime(),
                    e: currentDay.getTime() + AjxDateUtil.MSEC_PER_DAY
                };
                this._colorSchedule(ZmFreeBusySchedulerView.STATUS_WORKING, [entireDaySlot], table, sched);
            }
		}
	}

    if(params.callback) {
        params.callback.run();
    }

    this.postUpdateHandler();    
};

ZmFreeBusySchedulerView.prototype.colorAppt =
function(appt, div) {
    var idx = this._emailToIdx[appt.getFolder().getOwner()];
    var sched = this._schedTable[idx];
    var table = sched ? document.getElementById(sched.dwtTableId) : null;
    if (table) {
        table.rows[0].className = "ZmSchedulerNormalRow";

        //this._clearColoredCells(sched);

        var row = table.rows[0];

        var currentDate = this._getStartDate();

        if (row) {
            // figure out the table cell that needs to be colored

            var startIdx = this._getIndexFromTime(appt.startDate);
            var endIdx = this._getIndexFromTime(appt.endDate, true);

            if(appt.startDate <= currentDate.getTime()) {
                startIdx = 0;
            }

            if(appt.endDate >= currentDate.getTime() + AjxDateUtil.MSEC_PER_DAY) {
                endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
            }

            //bug:45623 assume start index is zero if its negative
            if(startIdx < 0) {startIdx = 0;}
            //bug:45623 skip the slot that has negative end index.
            if(endIdx < 0) { return; }

            // normalize
            if (endIdx < startIdx) {
                endIdx = ZmFreeBusySchedulerView.FREEBUSY_NUM_CELLS - 1;
            }

            var cb = Dwt.getBounds(row.cells[startIdx]),
                pb = Dwt.toWindow(div.parentNode, 0, 0, null, null, new DwtPoint(0, 0)),
                width = (endIdx-startIdx+1)*cb.width;

            Dwt.setBounds(div, cb.x - pb.x + 1, cb.y - pb.y-1, width-2, cb.height-1);            
        }

    }
};

ZmFreeBusySchedulerView.prototype._handleErrorFreeBusy =
function(params, result) {

    this._freeBusyRequest = null;
    this._workingHoursRequest = null;

    if (result.code == ZmCsfeException.OFFLINE_ONLINE_ONLY_OP) {
		var emails = params.emails;
		for (var i = 0; i < emails.length; i++) {
			var e = emails[i];
			var sched = this._schedTable[this._emailToIdx[e]];
			var table = sched ? document.getElementById(sched.dwtTableId) : null;
			if (table) {
				table.rows[0].className = "ZmSchedulerNormalRow";
				this._clearColoredCells(sched);
				sched.uid = e;
				var now = new Date();
				var obj = [{s: now.setHours(0,0,0), e:now.setHours(24,0,0)}];
				this._colorSchedule(ZmFreeBusySchedulerView.STATUS_UNKNOWN, obj, table, sched);
			}
		}
	}
	return false;
};

ZmFreeBusySchedulerView.prototype._emailValidator =
function(value) {
	var str = AjxStringUtil.trim(value);
	if (str.length > 0 && !AjxEmailAddress.isValid(value)) {
		throw ZmMsg.errorInvalidEmail;
	}

	return value;
};

ZmFreeBusySchedulerView.prototype._getDefaultFocusItem =
function() {
	for (var i = 0; i < this._schedTable.length; i++) {
		var sched = this._schedTable[i];
		if (sched && sched.inputObj && !sched.inputObj.disabled) {
			return sched.inputObj;
		}
	}
	return null;
};

ZmFreeBusySchedulerView.prototype.showFreeBusyToolTip =
function() {
	var fbInfo = this._fbToolTipInfo;
	if (!fbInfo) { return; }

	var sched = fbInfo.sched;
	var cellIndex = fbInfo.index;
	var tableIndex = fbInfo.tableIndex;
	var x = fbInfo.x;
	var y = fbInfo.y;

	var attendee = sched.attendee;
	var table = sched ? document.getElementById(sched.dwtTableId) : null;
	if (attendee) {
		var email = this.getEmail(attendee);

		var startDate  = new Date(this._getStartTime());
		var startTime = startDate.getTime() +  cellIndex*30*60*1000;
		startDate = new Date(startTime);
		var endTime = startTime + 30*60*1000;
		var endDate = new Date(endTime);

        var row = table.rows[0];
        var cell = row.cells[cellIndex];
        //resolve alias before doing owner mounted calendars search
        var params = {
            startDate: startDate,
            endDate: endDate,
            x: x,
            y: y,
            email: email,
            status: cell._fbStatus
        };
        this.getAccountEmail(params);
	}
	this._fbToolTipInfo = null;
};

ZmFreeBusySchedulerView.prototype.popupFreeBusyToolTop =
function(params) {
    var cc = AjxDispatcher.run("GetCalController"),
        treeController =  cc.getCalTreeController(),
        calendars = treeController ? treeController.getOwnedCalendars(appCtxt.getApp(ZmApp.CALENDAR).getOverviewId(), params.email) : [],
        tooltipContent = "",
        i,
        length;
    if(!params.status) params.status = ZmFreeBusySchedulerView.STATUS_FREE;

    var fbStatusMsg = [];
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_FREE]     = ZmMsg.nonWorking;
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_BUSY]     = ZmMsg.busy;
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_TENTATIVE]= ZmMsg.tentative;
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_OUT]      = ZmMsg.outOfOffice;
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_UNKNOWN]  = ZmMsg.unknown;
    fbStatusMsg[ZmFreeBusySchedulerView.STATUS_WORKING]  = ZmMsg.free;

    var calIds = [];
    var calRemoteIds = new AjxVector();
    for (i = 0, length = calendars.length; i < length; i++) {
        var cal = calendars[i];
        if (cal && (cal.nId != ZmFolder.ID_TRASH)) {
            calIds.push(appCtxt.multiAccounts ? cal.id : cal.nId);
            calRemoteIds.add(cal.getRemoteId(), null, true);
        }
    }
    var sharedCalIds = this.getUserSharedCalIds(params.email);
    var id;
    // Check and remove the duplicates
    // otherwise results will be duplicated
    if(sharedCalIds) {
        for(i=0, length = sharedCalIds.length; i<length; i++) {
            id = sharedCalIds[i];
            if(id && !calRemoteIds.contains(id)) {
                calIds.push(id);
            }
        }
    }
    tooltipContent = "<b>" + ZmMsg.statusLabel + " " + fbStatusMsg[params.status] + "</b>";
    if(calIds.length > 0) {
        var acct = this._editView.getCalendarAccount();
        var emptyMsg = tooltipContent || (acct && (acct.name == params.email) ? fbStatusMsg[params.status] : ZmMsg.unknown);
        tooltipContent = cc.getUserStatusToolTipText(params.startDate, params.endDate, true, params.email, emptyMsg, calIds);
    }
    var shell = DwtShell.getShell(window);
    var tooltip = shell.getToolTip();
    tooltip.setContent(tooltipContent, true);
    tooltip.popup(params.x, params.y, true);
};

ZmFreeBusySchedulerView.prototype.getUserSharedCalIds =
function(email) {
    var organizer = this._schedTable[this._organizerIndex] ? this._schedTable[this._organizerIndex].attendee : null,
        organizerEmail = organizer ? this.getEmail(organizer) : "",
        activeAcct = appCtxt.getActiveAccount(),
        acctEmail = activeAcct ? activeAcct.getEmail() : "";

    if(!email || email == organizerEmail || email == acctEmail) {
        return [];
    }
    if(this._sharedCalIds && this._sharedCalIds[email]) {
        return this._sharedCalIds[email];
    }
    var jsonObj = {GetShareInfoRequest:{_jsns:"urn:zimbraAccount"}};
	var request = jsonObj.GetShareInfoRequest;
	if (email) {
		request.owner = {by:"name", _content:email};
	}
	var result = appCtxt.getAppController().sendRequest({jsonObj:	jsonObj});

    //parse the response
    var resp = result && result.GetShareInfoResponse;
    var share = (resp && resp.share) ? resp.share : null;
    var ids = [];
    if(share) {
        for(var i=0; i<share.length; i++) {
            if(share[i].ownerId && share[i].folderId) {
                var folderId = share[i].ownerId + ":" + share[i].folderId;
                ids.push(folderId);
            }
        }
        if(!this._sharedCalIds) {
            this._sharedCalIds = {};
        }
    }
    this._sharedCalIds[email] = ids;
    return ids;
};

//bug: 30989 - getting proper email address from alias
ZmFreeBusySchedulerView.prototype.getAccountEmail =
function(params) {

    if(this._emailAliasMap[params.email]) {
        params.email = this._emailAliasMap[params.email];
        this.popupFreeBusyToolTop(params);
        return;
    }

    var soapDoc = AjxSoapDoc.create("GetAccountInfoRequest", "urn:zimbraAccount", null);
    var elBy = soapDoc.set("account", params.email);
    elBy.setAttribute("by", "name");

    var callback = new AjxCallback(this, this._handleGetAccountInfo, [params]);
    var errorCallback = new AjxCallback(this, this._handleGetAccountInfoError, [params]);
    appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true, callback: callback, errorCallback:errorCallback});
};

ZmFreeBusySchedulerView.prototype._handleGetAccountInfo =
function(params, result) {
    var response = result.getResponse();
    var getAccInfoResponse = response.GetAccountInfoResponse;
    var accountName = (getAccInfoResponse && getAccInfoResponse.name) ? getAccInfoResponse.name : null;
    if(accountName) {
        this._emailAliasMap[params.email] = accountName;
    }
    params.email = accountName || params.email;
    this.popupFreeBusyToolTop(params);
};

ZmFreeBusySchedulerView.prototype._handleGetAccountInfoError =
function(params, result) {
    var email = params.email;
	//ignore the error : thrown for external email ids
	this._emailAliasMap[email] = email;
	this.popupFreeBusyToolTop(params);
	return true;
};

ZmFreeBusySchedulerView.prototype.initAutoCompleteOnFocus =
function(inputElement) {
    if (this._acContactsList && !this._autoCompleteHandled[inputElement._schedTableIdx]) {
        this._acContactsList.handle(inputElement);
        this._autoCompleteHandled[inputElement._schedTableIdx] = true;
    }
};

// Static methods

ZmFreeBusySchedulerView._onClick =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var svp = AjxCore.objectWithId(el._schedViewPageId);
	if (!svp) { return; }
};

ZmFreeBusySchedulerView._onFocus =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var svp = AjxCore.objectWithId(el._schedViewPageId);
	if (!svp) { return; }

	var sched = svp._schedTable[el._schedTableIdx];
	if (sched) {
		svp._activeInputIdx = el._schedTableIdx;
        svp.initAutoCompleteOnFocus(el);
	}
};

ZmFreeBusySchedulerView._onBlur =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
    if(el._acHandlerInProgress) { return; }
	var svp = AjxCore.objectWithId(el._schedViewPageId);
	if (!svp) { return; }
    el._acHandlerInProgress = true;
    svp._handleAttendeeField(el);
    el._acHandlerInProgress = false;
    if (svp._editView) { svp._editView.showConflicts(); }
};

ZmFreeBusySchedulerView._onPTSTMouseOver =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var el = DwtUiEvent.getTarget(ev);
	var svp = AjxCore.objectWithId(el._schedViewPageId);
	if (!svp) return;
	var sched = svp._schedTable[el._schedTableIdx];
	if (sched) {
		var shell = DwtShell.getShell(window);
		var tooltip = shell.getToolTip();
		tooltip.setContent(el._ptstLabel, true);
		tooltip.popup((ev.pageX || ev.clientX), (ev.pageY || ev.clientY), true);
	}
};

ZmFreeBusySchedulerView._onPTSTMouseOut =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var el = DwtUiEvent.getTarget(ev);
	var svp = AjxCore.objectWithId(el._schedViewPageId);
	if (!svp) { return; }

	var sched = svp._schedTable[el._schedTableIdx];
	if (sched) {
		var shell = DwtShell.getShell(window);
		var tooltip = shell.getToolTip();
		tooltip.popdown();
	}
};

ZmFreeBusySchedulerView._onFreeBusyMouseOver =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var fbDiv = DwtUiEvent.getTarget(ev);
	if (!fbDiv || fbDiv._freeBusyCellIndex == undefined) { return; }

	var svp = AjxCore.objectWithId(fbDiv._schedViewPageId);
	if (!svp) { return; }

	var sched = svp._schedTable[fbDiv._schedTableIdx];
	var cellIndex = fbDiv._freeBusyCellIndex;

	if (svp && sched) {
		svp._fbToolTipInfo = {
			x: (ev.pageX || ev.clientX),
			y: (ev.pageY || ev.clientY),
			el: fbDiv,
			sched: sched,
			index: cellIndex,
			tableIndex: fbDiv._schedTableIdx
		};
		//avoid redundant request to server
		AjxTimedAction.scheduleAction(new AjxTimedAction(svp, svp.showFreeBusyToolTip), 1000);
	}
};

/**
 * Called when "Show more" link is clicked, this module shows all the attendees without pagination
 * @param ev click event
 */
ZmFreeBusySchedulerView._onShowMore =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
    var showMoreLink = DwtUiEvent.getTarget(ev);
    var svp = AjxCore.objectWithId(showMoreLink._schedViewPageId);
    if (!svp) { return; }
    svp.showMoreResults();
};

ZmFreeBusySchedulerView._onFreeBusyMouseOut =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);

	var el = DwtUiEvent.getTarget(ev);
	var svp = el && el._schedViewPageId ? AjxCore.objectWithId(el._schedViewPageId) : null;
	if (!svp) { return; }

	svp._fbToolTipInfo = null;
	var sched = svp._schedTable[el._schedTableIdx];
	if (sched) {
		var shell = DwtShell.getShell(window);
		var tooltip = shell.getToolTip();
		tooltip.popdown();
	}
};

ZmFreeBusySchedulerView.prototype.updateAllAttendeeCellStatus =
function(idx, status) {

    if(status == ZmFreeBusySchedulerView.STATUS_WORKING) return;

	if (!this._allAttendeesStatus[idx]) {
		this._allAttendeesStatus[idx] = status;
	} else if (status!= this._allAttendeesStatus[idx]) {
		if (status != ZmFreeBusySchedulerView.STATUS_UNKNOWN &&
			status != ZmFreeBusySchedulerView.STATUS_FREE)
		{
            if(status == ZmFreeBusySchedulerView.STATUS_OUT || this._allAttendeesStatus[idx] == ZmFreeBusySchedulerView.STATUS_OUT) {
    			this._allAttendeesStatus[idx] = ZmFreeBusySchedulerView.STATUS_OUT;
            }else {
            	this._allAttendeesStatus[idx] = ZmFreeBusySchedulerView.STATUS_BUSY;
            }
		}
	}
};

ZmFreeBusySchedulerView.prototype.getAllAttendeeStatus =
function(idx) {
	return this._allAttendeesStatus[idx] ? this._allAttendeesStatus[idx] : ZmFreeBusySchedulerView.STATUS_FREE;
};


ZmFreeBusySchedulerView.prototype.enablePartcipantStatusColumn =
function(show) {
    for(var i in this._schedTable) {
        var sched = this._schedTable[i];
        if(sched && sched.ptstObj) {
            Dwt.setVisible(sched.ptstObj, show);
        }else if(i == this._organizerIndex) {
            var ptstObj = document.getElementById(sched.dwtNameId+"_ptst");
            Dwt.setVisible(ptstObj, show);
        }
    }
};

ZmFreeBusySchedulerView.prototype.enableAttendees =
function(enable) {
  for(var i in this._schedTable) {
      var sched = this._schedTable[i];
      if(sched) {
          if(sched.inputObj) {
            sched.inputObj.setEnabled(enable);
          }
          if(sched.btnObj) {
            sched.btnObj.setEnabled(enable);
          }
      }
  }
};


/**
 * Resets pageless mode while rendering attendees list, when pageless mode is enabled all attendees will be shown in
 * single list without 'Show more' controls
 *
 * @param enable	[boolean]*		if true, enable pageless mode
 */
ZmFreeBusySchedulerView.prototype.resetPagelessMode =
function(enable) {
    this._isPageless = enable;
};

ZmFreeBusySchedulerView.prototype.showMoreResults =
function() {
    //enable pageless mode and render entire list
    this.resetPagelessMode(true);
    Dwt.setDisplay(this._showMoreLink, Dwt.DISPLAY_NONE);
    this.showMe();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmNewCalendarDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmNewCalendarDialog = function(parent, className) {
    if (arguments.length == 0) { return; }
	var title = ZmMsg.createNewCalendar;
	var type = ZmOrganizer.CALENDAR;
    var back = new DwtDialog_ButtonDescriptor(ZmNewCalendarDialog.BACK_BUTTON, ZmMsg.back , DwtDialog.ALIGN_LEFT);
	ZmNewOrganizerDialog.call(this, parent, className, title, type, [back]);
    this.setButtonListener(ZmNewCalendarDialog.BACK_BUTTON, this._backButtonListener.bind(this));
    this.getButton(ZmNewCalendarDialog.BACK_BUTTON).setVisibility(false);
};

ZmNewCalendarDialog.prototype = new ZmNewOrganizerDialog;
ZmNewCalendarDialog.prototype.constructor = ZmNewCalendarDialog;




ZmNewCalendarDialog.BACK_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmNewCalendarDialog.prototype.toString = 
function() {
	return "ZmNewCalendarDialog";
};

// Public methods


ZmNewCalendarDialog.prototype.reset =
function(account) {
	ZmNewOrganizerDialog.prototype.reset.apply(this, arguments);
	this._excludeFbCheckbox.checked = false;
};

// Protected methods

ZmNewCalendarDialog.prototype._getRemoteLabel =
function() {
	return ZmMsg.addRemoteAppts;
};

ZmNewCalendarDialog.prototype._createExtraContentHtml =
function(html, idx) {
	idx = this._createFreeBusyContentHtml(html, idx);
	return ZmNewOrganizerDialog.prototype._createExtraContentHtml.call(this, html, idx);
};

ZmNewCalendarDialog.prototype._createFreeBusyContentHtml =
function(html, idx) {
	this._excludeFbCheckboxId = this._htmlElId + "_excludeFbCheckbox";
	html[idx++] = AjxTemplate.expand("share.Dialogs#ZmNewCalDialogFreeBusy", {id:this._htmlElId});
	return idx;
};

// NOTE: new calendar dialog doesn't show overview
ZmNewCalendarDialog.prototype._createFolderContentHtml =
function(html, idx) {
	return idx;
};

ZmNewCalendarDialog.prototype._setupExtraControls =
function() {
	ZmNewOrganizerDialog.prototype._setupExtraControls.call(this);
	this._setupFreeBusyControl();
};

ZmNewCalendarDialog.prototype._setupFreeBusyControl =
function() {
	this._excludeFbCheckbox = document.getElementById(this._excludeFbCheckboxId);
};

/*
*   Overwritten the parent class method to include application specific params.
*/
ZmNewCalendarDialog.prototype._setupColorControl =
function() {
    var el = document.getElementById(this._colorSelectId);
	this._colorSelect = new ZmColorButton({parent:this,parentElement:el,hideNone:true});
};

/** 
 * Checks the input for validity and returns the following array of values:
 * <ul>
 * <li> parentFolder
 * <li> name
 * <li> color
 * <li> URL
 * <li> excludeFB
 * </ul>
 * 
 * @private
 */
ZmNewCalendarDialog.prototype._getFolderData =
function() {
	var data = ZmNewOrganizerDialog.prototype._getFolderData.call(this);
	if (data) {
		data.f = this._excludeFbCheckbox.checked ? "b#" : "#";
        var url =  this._iCalData ? this._iCalData.url : "";
        if(url) {
            data.url = url;
            this._iCalData = null;
            delete this._iCalData;
        }
	}
	return data;
};

ZmNewCalendarDialog.prototype._createRemoteContentHtml =
function(html, idx) {
	return idx;
};

ZmNewCalendarDialog.prototype.setICalData =
function(iCalData) {
	this._iCalData = iCalData;
};


/**
 * @Override Added for tabindexing checkboxes.
 * 
 * @private
 */
//For bug 21985
ZmNewCalendarDialog.prototype._getTabGroupMembers =
function() {
	var list = ZmNewOrganizerDialog.prototype._getTabGroupMembers.call(this);
    if (this._excludeFbCheckbox) {
		list.push(this._excludeFbCheckbox);
	}
    if (this._remoteCheckboxField) {
		list.push(this._remoteCheckboxField);
	}
    return list;
};

ZmNewCalendarDialog.prototype._backButtonListener =
function() {
    this.popdown();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmExternalCalendarDialog")) {
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

ZmExternalCalendarDialog = function(params) {
    var back = new DwtDialog_ButtonDescriptor(ZmExternalCalendarDialog.BACK_BUTTON, ZmMsg.back , DwtDialog.ALIGN_LEFT);
    var next = new DwtDialog_ButtonDescriptor(ZmExternalCalendarDialog.NEXT_BUTTON, ZmMsg.next, DwtDialog.ALIGN_RIGHT);
    var cancel = new DwtDialog_ButtonDescriptor(ZmExternalCalendarDialog.SHARE_CANCEL_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT);
    var parent = params.parent || appCtxt.getShell();
    this._controller = params.controller;
    this._isGoogleAuthConfigured = params.isGoogleAuthConfigured;
    ZmDialog.call(this, {parent:parent, className:"ZmExternalCalendarDialog", standardButtons:[DwtDialog.NO_BUTTONS], extraButtons: [back, next, cancel], id:'ADD_EXTERNAL_CAL_DIALOG'});

	this.setButtonListener(ZmExternalCalendarDialog.BACK_BUTTON, new AjxListener(this, this._backButtonListener));
	this.setButtonListener(ZmExternalCalendarDialog.NEXT_BUTTON, new AjxListener(this, this._nextButtonListener));
	this.setButtonListener(ZmExternalCalendarDialog.SHARE_CANCEL_BUTTON, new AjxListener(this, this._cancelButtonListener));

    this.getButton(ZmExternalCalendarDialog.BACK_BUTTON).setVisibility(false);
	//var title = ZmMsg.addSharedCalendar;
	var type = ZmOrganizer.CALENDAR;
    this.setTitle(ZmMsg.addSharedCalendar);
	this.setContent(this.getDefaultContent());
    this._viewsLoaded = {};
    //this._viewsLoaded[ZmExternalCalendarDialog.FIRST_VIEW] = true;
    this.currentView = ZmExternalCalendarDialog.FIRST_VIEW;
    this.getViews();
};

ZmExternalCalendarDialog.prototype = new ZmDialog;
ZmExternalCalendarDialog.prototype.constructor = ZmExternalCalendarDialog;

ZmExternalCalendarDialog.FIRST_VIEW = 1;
ZmExternalCalendarDialog.SECOND_VIEW = 2;
ZmExternalCalendarDialog.THIRD_VIEW = 3;

ZmExternalCalendarDialog.FIRST_VIEW_ID = "_shareCalendarView1";
ZmExternalCalendarDialog.SECOND_VIEW_ID = "_shareCalendarView2";
ZmExternalCalendarDialog.THIRD_VIEW_ID = "_shareCalendarView3";

ZmExternalCalendarDialog.SYNC_TYPE_ICAL = "EXT_CAL_SYNCTYPE_DIALOG_ical";
ZmExternalCalendarDialog.SYNC_TYPE_CALDAV = "EXT_CAL_DIALOG_SYNCTYPE_caldav";

ZmExternalCalendarDialog.TYPE_YAHOO = "Yahoo";
ZmExternalCalendarDialog.TYPE_OTHER = "Other";

ZmExternalCalendarDialog.TEMPLATE = "calendar.Calendar#SharedCalendarDialog";
ZmExternalCalendarDialog.BACK_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmExternalCalendarDialog.NEXT_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmExternalCalendarDialog.SHARE_CANCEL_BUTTON = ++DwtDialog.LAST_BUTTON;


ZmExternalCalendarDialog.prototype.toString =
function() {
	return "ZmExternalCalendarDialog";
};

ZmExternalCalendarDialog.prototype.getDefaultContent =
function() {
    var html = AjxTemplate.expand(ZmExternalCalendarDialog.TEMPLATE, {id: this._htmlElId, isGoogleAuthConfigured: this._isGoogleAuthConfigured});
    return html;
};

ZmExternalCalendarDialog.prototype.popup =
function() {
    this.showView(ZmExternalCalendarDialog.FIRST_VIEW, ZmExternalCalendarDialog.TYPE_YAHOO);
    ZmDialog.prototype.popup.call(this);
};

ZmExternalCalendarDialog.prototype.popdown =
function() {
    this.clearControls();
    ZmDialog.prototype.popdown.call(this);
};

ZmExternalCalendarDialog.prototype._nextButtonListener =
function(ev) {
    var id = this._htmlElId;
    switch(this.currentView) {
        case ZmExternalCalendarDialog.FIRST_VIEW :
            /*var _shareRadioPublic = document.getElementById(id + '_shareRadioPublic');
            if(_shareRadioPublic && _shareRadioPublic.checked) {
                this._showSharePublicView();
            }*/
            var shareRadioYahoo  = document.getElementById(id + '_shareRadioYahoo'),
                shareRadioOther  = document.getElementById(id + '_shareRadioOther'),
                shareRadioGoogle = document.getElementById(id + '_shareRadioGoogle');

            if(shareRadioGoogle && shareRadioGoogle.checked) {
                var hostname = window.location.origin;
                this.popdown();
                window.location.href = hostname + "/service/extension/oauth2/authorize/google?type=caldav&state=/%3Fclient%3Dadvanced%26app%3Dcalendar";
            } else {
                if(shareRadioYahoo && shareRadioYahoo.checked) {
                    this.showView(ZmExternalCalendarDialog.SECOND_VIEW, ZmExternalCalendarDialog.TYPE_YAHOO);
                }
                if(shareRadioOther && shareRadioOther.checked) {
                    this.showView(ZmExternalCalendarDialog.SECOND_VIEW, ZmExternalCalendarDialog.TYPE_OTHER);
                }
                this.showIcalView(false);
                this._syncTypeSelect.setSelectedValue(ZmExternalCalendarDialog.SYNC_TYPE_CALDAV);
            }
        break;

        case ZmExternalCalendarDialog.SECOND_VIEW :
            var syncType = this._syncTypeSelect.getValue();
            if (!this.validate(syncType)) {
                return false;
            }
            var extCalData = {};
            if(syncType == ZmExternalCalendarDialog.SYNC_TYPE_CALDAV) {
                extCalData = {
                    calDav : {
                        userName : this._userNameInput.getValue(),
                        password : this._passwordInput.getValue(),
                        hostUrl : this._urlInput.getValue()
                    },
                    iCal : null
                };
            }
            else {
                extCalData = {
                    calDav : null,
                    iCal : {
                        url : this._icsUrlInput.getValue()
                    }
                };
            }
            this._controller.setExternalCalendarData(extCalData);
            // Fix for Bug: 85158 and regression due to Bug: 82811. Passing isExternalCalendar => true
            this._controller._newListener(ev, null, true);
        break;

        case ZmExternalCalendarDialog.THIRD_VIEW :
        break;
    }
};
ZmExternalCalendarDialog.prototype._backButtonListener =
function() {
    var id = this._htmlElId;
    switch(this.currentView) {
        case ZmExternalCalendarDialog.FIRST_VIEW :
            //this.showView(ZmExternalCalendarDialog.FIRST_VIEW);
        break;

        case ZmExternalCalendarDialog.SECOND_VIEW :
            this.showView(ZmExternalCalendarDialog.FIRST_VIEW);
        break;

        case ZmExternalCalendarDialog.THIRD_VIEW :
            this.showView(ZmExternalCalendarDialog.SECOND_VIEW);
        break;
    }
};

ZmExternalCalendarDialog.prototype.validate =
function(syncType) {
    var msg = "";
    if(syncType == ZmExternalCalendarDialog.SYNC_TYPE_CALDAV) {
        var userName = this._userNameInput.getValue(),
            password = this._passwordInput.getValue(),
            hostUrl = AjxStringUtil.trim(this._urlInput.getValue()),
            url;
        if(userName.indexOf('@') === -1) {
            if (hostUrl.indexOf(ZmMsg.sharedCalCalDAVServerYahoo) !== -1){
                //yahoo selected
                userName += "@yahoo.com";
            }
        }
        if(!AjxEmailAddress.isValid(userName)) {
            msg = ZmMsg.errorInvalidEmail2;
        }
        if(!msg && AjxStringUtil.trim(password) == "") {
            msg = ZmMsg.errorMissingPass;
        }
        if(!msg && !hostUrl) {
            msg = ZmMsg.errorMissingUrl;
        }
    }
    else {
        url = this._icsUrlInput.getValue();
        msg = ZmOrganizer.checkUrl(url);
    }
    if(msg) {
        this._showError(msg);
        return false;
    }
    return true;
};

ZmExternalCalendarDialog.prototype._showSharePublicView =
function() {
    //var psd = this._publichShareDialog || this.createPublicShareDialog();
    //psd.popup();
};

ZmExternalCalendarDialog.prototype.getViews =
function() {
    var id = this._htmlElId;
    this._views = {};
    this._views[ZmExternalCalendarDialog.FIRST_VIEW] = document.getElementById(id + ZmExternalCalendarDialog.FIRST_VIEW_ID);
    this._views[ZmExternalCalendarDialog.SECOND_VIEW] = document.getElementById(id + ZmExternalCalendarDialog.SECOND_VIEW_ID);
    this._views[ZmExternalCalendarDialog.THIRD_VIEW] = document.getElementById(id + ZmExternalCalendarDialog.THIRD_VIEW_ID);
};

ZmExternalCalendarDialog.prototype.hideAllViews =
function() {
    for (var id in this._views) {
        var view = this._views[id];
        if(view) {
            Dwt.setDisplay(view, Dwt.DISPLAY_NONE);
        }
    }
};

ZmExternalCalendarDialog.prototype._changeCalType =
function() {
    if(this.currentView != ZmExternalCalendarDialog.SECOND_VIEW) {
        return;
    }
    var calType = this._syncTypeSelect.getValue();
    this.showIcalView(ZmExternalCalendarDialog.SYNC_TYPE_ICAL == calType);
};

ZmExternalCalendarDialog.prototype.showIcalView =
function(isIcal) {
    var id = this._htmlElId,
        el,
        syncUserNameContainer = document.getElementById(id + "_syncUserNameContainer"),
        syncPasswordContainer = document.getElementById(id + "_syncPasswordContainer"),
        syncUrlContainer = document.getElementById(id + "_syncUrlContainer"),
        syncIcsUrlContainer = document.getElementById(id + "_syncIcsUrlContainer"),
        syncMsgContainer = document.getElementById(id + "_syncMsgContainer");

    Dwt.setVisible(syncUserNameContainer, !isIcal);
    Dwt.setVisible(syncPasswordContainer, !isIcal);
    Dwt.setVisible(syncUrlContainer, !isIcal);
    //Dwt.setVisible(syncMsgContainer, !isIcal);
    Dwt.setVisible(syncIcsUrlContainer, isIcal);
    /*el = isIcal ? this._icsUrlInput.getInputElement() : this._userNameInput.getInputElement();
    if(el) {
        el.focus();
    }*/
};

ZmExternalCalendarDialog.prototype.showView =
function(viewId, type) {
    viewId = viewId || ZmExternalCalendarDialog.FIRST_VIEW;
    this.hideAllViews();
    this.currentView = viewId;

    if(!this.isViewLoaded(viewId)) {
        this.loadView(viewId);
    }

    switch(viewId) {
        case ZmExternalCalendarDialog.FIRST_VIEW :
            this.getButton(ZmExternalCalendarDialog.BACK_BUTTON).setVisibility(false);
            this.setTitle(ZmMsg.addExternalCalendar);
        break;

        case ZmExternalCalendarDialog.SECOND_VIEW :
            this.getButton(ZmExternalCalendarDialog.BACK_BUTTON).setVisibility(true);
            if(type == ZmExternalCalendarDialog.TYPE_YAHOO) {
                this._userNameInput.setHint(ZmMsg.sharedCalUserNameYahooHint);
                this._urlInput._hideHint(ZmMsg.sharedCalCalDAVServerYahoo);
                this._urlInput.setEnabled(false);
                this._syncMsg.innerHTML = ZmMsg.sharedCalSyncMsgYahoo;
                this.setTitle(ZmMsg.sharedCalTitleYahoo);
            }
            else {
                this._userNameInput.setHint(ZmMsg.sharedCalUserNameHint);
                this._urlInput.setEnabled(true);
                this._urlInput.setValue("");
                this._urlInput._showHint();
                this._syncMsg.innerHTML = "";
                this.setTitle(ZmMsg.sharedCalTitleOther);
            }
        break;

        case ZmExternalCalendarDialog.THIRD_VIEW :
            this.getButton(ZmExternalCalendarDialog.BACK_BUTTON).setVisibility(true);
        break;

    }
    Dwt.setDisplay(this._views[viewId], Dwt.DISPLAY_BLOCK);
    this._setSecondViewTabGroup();
};

ZmExternalCalendarDialog.prototype.loadView =
function(viewId) {
    var id = this._htmlElId;

    switch(viewId) {
        case ZmExternalCalendarDialog.FIRST_VIEW :
            this._viewsLoaded[ZmExternalCalendarDialog.FIRST_VIEW] = true;
        break;

        case ZmExternalCalendarDialog.SECOND_VIEW :
            var syncTypeSelect = new DwtSelect({parent:this, parentElement: id + '_syncType'});
            syncTypeSelect.addOption(ZmMsg.sharedCalTypeCalDAV, true, ZmExternalCalendarDialog.SYNC_TYPE_CALDAV);
            syncTypeSelect.addOption(ZmMsg.sharedCalTypeICal, false, ZmExternalCalendarDialog.SYNC_TYPE_ICAL);
            syncTypeSelect.addChangeListener(new AjxListener(this, this._changeCalType));
            this._syncTypeSelect = syncTypeSelect;

            this._userNameInput = new DwtInputField({parent:this, parentElement: id + '_syncUserName', hint: ZmMsg.sharedCalUserNameHint, inputId:id + '_syncUserNameInput'});
            this._passwordInput = new DwtInputField({parent:this, parentElement: id + '_syncPassword', type: DwtInputField.PASSWORD, inputId: id + '_syncPasswordInput'});
            this._urlInput = new DwtInputField({parent:this, parentElement: id + '_syncUrl', hint: ZmMsg.sharedCalCalDAVServerHint, inputId: id+ 'syncUrlInput'});
            this._icsUrlInput = new DwtInputField({parent:this, parentElement: id + '_syncIcsUrl', hint: ZmMsg.sharedCalIcsUrlHint, inputId: id+ '_syncIcsUrlInput'});
            this._syncMsg = document.getElementById(id + '_syncMsg');
            this._viewsLoaded[ZmExternalCalendarDialog.SECOND_VIEW] = true;

            this._userNameInput._showHint();
            this._icsUrlInput._showHint();
        break;

        case ZmExternalCalendarDialog.THIRD_VIEW :
            this.getButton(ZmExternalCalendarDialog.BACK_BUTTON).setVisibility(true);
            this._viewsLoaded[ZmExternalCalendarDialog.THIRD_VIEW] = true;
        break;

    }
};

ZmExternalCalendarDialog.prototype._setSecondViewTabGroup =
function() {
    if(!this.isViewLoaded(ZmExternalCalendarDialog.SECOND_VIEW)) {
        return false;
    }
    var members = [this._syncTypeSelect, this._userNameInput, this._passwordInput, this._urlInput, this._icsUrlInput];
    for (var i = 0; i < members.length; i++) {
        this._tabGroup.addMember(members[i], i);
    }
	this._tabGroup.setFocusMember(this._syncTypeSelect);
};

ZmExternalCalendarDialog.prototype.isViewLoaded =
function(viewId) {
    return this._viewsLoaded[viewId] ? this._viewsLoaded[viewId] : false;
};

ZmExternalCalendarDialog.prototype.clearControls =
function() {
    if(this.isViewLoaded(ZmExternalCalendarDialog.SECOND_VIEW)) {
        this._userNameInput.setValue("");
        this._passwordInput.setValue("");
        this._urlInput.setValue("");
        this._icsUrlInput.setValue("");
    }
};

ZmExternalCalendarDialog.prototype.createPublicShareDialog =
function() {
    /*var dialog = new ZmSharedCalendarSearchDialog({id:"ZmSharedCalendarSearchDialog"});
    this._publichShareDialog = dialog;
    return dialog;*/
};

ZmExternalCalendarDialog.prototype._cancelButtonListener =
function() {
    // reset the caldav object
    this._controller.setExternalCalendarData(null);
    this.popdown();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmApptAssistantView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a left pane view for suggesting locations
 * @constructor
 * @class
 * This class displays suggested free locations for a new appointment
 *
 *  @author Vince Bellows
 *
 * @param apptEditView		[ZmApptQuickAddDialog or
 *                           ZmApptComposeView]         View containing the suggestions
 * @param container  		[DOM Element]	            The dialog's content Element
 * @param controller		[ZmApptComposeController]	The appt compose controller
 * @param closeCallback 	[Callback Function]			Function to invoke upon close
 */
ZmApptAssistantView = function(parent, controller, apptView, closeCallback) {
    if (arguments.length == 0) { return; }

	DwtComposite.call(this, {parent: parent, posStyle: DwtControl.RELATIVE_STYLE, className: "ZmScheduleAssistantView"});

	this.setScrollStyle(Dwt.SCROLL_Y);

	this._controller    = controller;
	this._apptView      = apptView;
    this._prefDialog    = appCtxt.getSuggestionPreferenceDialog();
    this._closeCallback = closeCallback;

    // For bug 68531
    //var app = appCtxt.getApp(ZmApp.CALENDAR);
    //this._fbCache       = app.getFreeBusyCache();
    this._fbCache       = apptView.getFreeBusyCache();

	this._rendered      = false;
    this.type           = ZmCalBaseItem.LOCATION;
    this._resources     = [];

    this._enabled       = false;

    this.numRecurrence  = this.getLocationConflictNumRecurrence();

    this.initialize();
};

ZmApptAssistantView.prototype = new DwtComposite;
ZmApptAssistantView.prototype.constructor = ZmApptAssistantView;


ZmApptAssistantView.prototype.toString =
function() {
	return "ZmApptAssistantView";
}

ZmApptAssistantView.ATTRS = {};
ZmApptAssistantView.ATTRS[ZmCalBaseItem.LOCATION] =
	["fullName", "email", "zimbraCalResLocationDisplayName",
	 "zimbraCalResCapacity", "zimbraCalResContactEmail", "description", "zimbraCalResType"];

ZmApptAssistantView.prototype.initialize =
function() {
    this._createHTML();
    this._createWidgets();
    this.addControlListener(this._resetSize.bind(this));
    this._resetSize();
};

ZmApptAssistantView.prototype.isInitialized =
function() {
    var prefInitialized = this._prefDialog ? this._prefDialog.getPrefLoaded() : false;
    // Only checking pref Dialog initialization for now
    return prefInitialized;
};

ZmApptAssistantView.prototype.cleanup =
function() {
};

ZmApptAssistantView.prototype._createHTML =
function() {
	var subs = {
		id: this._htmlElId
	};
	this.getHtmlElement().innerHTML = AjxTemplate.expand("calendar.Appointment#SuggestionsView", subs);
};

ZmApptAssistantView.prototype._createWidgets =
function() {

    this._closeId = this._htmlElId + "_suggest_close";
    this._closeBtn = document.getElementById(this._closeId);
    Dwt.setHandler(this._closeBtn, DwtEvent.ONCLICK, this._closeListener.bind(this));

    this._suggestionContainerElId = this._htmlElId + "_suggest_container";
    this._suggestionsContainer = document.getElementById(this._suggestionContainerElId);

    this._suggestionNameElId = this._htmlElId + "_suggestion_name"
    this._suggestionName = document.getElementById(this._suggestionNameElId);

    this._suggestionViewElId = this._htmlElId + "_suggest_view";
    this._suggestionsView = document.getElementById(this._suggestionViewElId);

    this._createMiniCalendar();
    this._suggestMinicalElId = this._htmlElId + "_suggest_minical";
    this._suggestMinical = document.getElementById(this._suggestMinicalElId);

    this._optionsBtnId = this._htmlElId + "_suggest_options_image";
    this._optionsBtn = document.getElementById(this._optionsBtnId);
    Dwt.setHandler(this._optionsBtn, DwtEvent.ONCLICK, this._prefListener.bind(this));

    this._configureSuggestionWidgets();
};

ZmApptAssistantView.prototype._configureSuggestionWidgets =
function() {
};

ZmApptAssistantView.prototype._createMiniCalendar =
function(date) {
}

ZmApptAssistantView.prototype.clearResources =
function() {
    this._resources = [];
};


ZmApptAssistantView.prototype.getLocationConflictNumRecurrence =
function() {
    return this._prefDialog ?
        parseInt(this._prefDialog.getPreference(ZmTimeSuggestionPrefDialog.RECURRENCE)) :
        ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE;
};

ZmApptAssistantView.prototype._prefListener =
function(ev) {
    // Record the current numRecurrence value, for detecting changes upon
    // completion of the preferences dialog
    this.numRecurrence = this.getLocationConflictNumRecurrence();
    this._prefDialog.popup(this._apptView.getCalendarAccount());
};


ZmApptAssistantView.prototype._closeListener =
function(ev) {
    this.close();
};
ZmApptAssistantView.prototype.close =
function() {
    var parentEl = this.getHtmlElement().parentNode;
    Dwt.setVisible(parentEl, false);
    this._enabled = false;
    if (this._closeCallback) {
        this._closeCallback.run();
    }
};

ZmApptAssistantView.prototype.suggestAction =
function() {
};

ZmApptAssistantView.prototype._getTimeFrame =
function() {
};

ZmApptAssistantView.prototype.updateTime =
function() {
};

ZmApptAssistantView.prototype.reset =
function(date) {
};

//smart scheduler suggestion modules

ZmApptAssistantView.prototype.searchCalendarResources =
function(callback, sortBy) {
	var currAcct = this._apptView.getCalendarAccount();
	var value = (this.type == ZmCalBaseItem.LOCATION) ? "Location" : "Equipment";

    var conds = [{attr: "zimbraCalResType", op: "eq", value: value}];
    if(this._prefDialog) {
        for (var i = 0; i < ZmTimeSuggestionPrefDialog.PREF_FIELDS.length; i++) {
            var sf = ZmTimeSuggestionPrefDialog.PREF_FIELDS[i];

            if(!ZmTimeSuggestionPrefDialog.isSearchCondition(sf)) continue;

            value = AjxStringUtil.trim(this._prefDialog.getPreference(sf));

            if (value.length) {
                var attr = ZmTimeSuggestionPrefDialog.SF_ATTR[sf];
                var op = ZmTimeSuggestionPrefDialog.SF_OP[sf] ? ZmTimeSuggestionPrefDialog.SF_OP[sf] : "has";
                conds.push({attr: attr, op: op, value: value});
            }
        }
    }
    
	var params = {
		sortBy: sortBy,
		offset: 0,
		limit: ZmContactsApp.SEARCHFOR_MAX,
		conds: conds,
		attrs: ZmApptAssistantView.ATTRS[this.type],
		accountName: appCtxt.isOffline ? currAcct.name : null
	};
	var search = new ZmSearch(params);
	search.execute({callback: new AjxCallback(this, this._handleResponseSearchCalendarResources, callback)});
};

ZmApptAssistantView.prototype._handleResponseSearchCalendarResources =
function(callback, result) {
	var resp = result.getResponse();
	var items = resp.getResults(ZmItem.RESOURCE).getVector();
    	if (items)
    		this._resources = (items instanceof AjxVector) ? items.getArray() : (items instanceof Array) ? items : [items];
    if(callback) callback.run();
};

// This should only be called for time suggestions
ZmApptAssistantView.prototype._findFreeBusyInfo =
function(params) {
};

ZmApptAssistantView.prototype._copyResourcesToParams =
function(params, emails) {
    var list = this._resources;
	for (var i = list.length; --i >= 0;) {
		var item = list[i];
		var email = item.getEmail();

		// bug: 30824 - Don't list all addresses/aliases of a resource in
		// GetFreeBusyRequest.  One should suffice.
		if (email instanceof Array) {
			email = email[0];
		}
		emails.push(email);

        params.items.push(email);
        params.itemIndex[email] = params.items.length-1;
	}
}

ZmApptAssistantView.prototype.suggestLocations =
function(params) {
    var emails = [];
    this._copyResourcesToParams(params, emails);
    this._duration  = this._apptView.getDurationInfo();
    params.emails   = emails;
    params.duration = this._duration.duration;
    params.locationInfo = this.computeLocationAvailability(this._duration, params);
    this.renderSuggestions(params);
};

// For a single given time slot, determine the available rooms
ZmApptAssistantView.prototype.computeLocationAvailability =
function(durationInfo, params) {

    var locationInfo = {
            startTime: durationInfo.startTime,
            endTime:   durationInfo.endTime,
            locations: new AjxVector()
        };

    var list = this._resources;
    for (var i = list.length; --i >= 0;) {
        var email = list[i].getEmail();

        if (email instanceof Array) {
            email = email[0];
        }

        var excludeTimeSlots = this._apptView.getFreeBusyExcludeInfo(email);

        // Adjust start and end time by 1 msec, to avoid fencepost problems
        sched = this._fbCache.getFreeBusySlot(durationInfo.startTime+1,
            durationInfo.endTime-1, email, excludeTimeSlots);
        isFree = true;
        if(sched.b) isFree = isFree && ZmApptAssistantView.isBooked(sched.b, durationInfo.startTime, durationInfo.endTime);
        if(sched.t) isFree = isFree && ZmApptAssistantView.isBooked(sched.t, durationInfo.startTime, durationInfo.endTime);
        if(sched.u) isFree = isFree && ZmApptAssistantView.isBooked(sched.u, durationInfo.startTime, durationInfo.endTime);

        //collect all the item indexes of the locations available at this slot
        if(isFree) {
            var displayInfo = this._createLocationDisplayInfo(email);
            locationInfo.locations.add(displayInfo);
        }
    }
    locationInfo.locations.sort(this._compareItems.bind(this));
    return locationInfo;
};


ZmApptAssistantView.isBooked =
function(slots, startTime, endTime) {
    for (var i = 0; i < slots.length; i++) {
        var startConflict = startTime >= slots[i].s && startTime < slots[i].e;
        var endConflict = endTime > slots[i].s && endTime <= slots[i].e;
        var inlineSlotConflict = slots[i].s >= startTime && slots[i].e <= endTime;
        if(startConflict || endConflict || inlineSlotConflict) {
            return false;
        }
    };
    return true;
};

ZmApptAssistantView.prototype._createLocationDisplayInfo =
function (email) {
    var info = { email: email };
    info.locationObj = this.getLocationByEmail(email);
    info.name = email;
    info.description = '';
    if(info.locationObj) {
        info.name = info.locationObj._fileAs;
        info.description = info.locationObj.getAttr(ZmResource.F_locationName) ||
                           info.locationObj.getAttr(ZmResource.F_name);
        if (info.description == info.name) {
            info.description = '';
        }
        info.contactMail = info.locationObj.getAttr(ZmResource.F_contactMail)
        info.capacity    = info.locationObj.getAttr(ZmResource.F_capacity)
    }
    return info;
}

ZmApptAssistantView.prototype._sortLocation = function(list) {
	if (list) {
		list.sort(this._compareItems.bind(this));
	}
};
ZmApptAssistantView.prototype._compareItems = function(item1, item2) {
	var aVal = item1.name.toLowerCase();
	var bVal = item2.name.toLowerCase();

	if (aVal < bVal) {
        return -1;
    } else if (aVal > bVal)	{
        return 1; }
	else {
        return 0;
    }

};

ZmApptAssistantView.prototype.renderSuggestions =
function(params) {
};

ZmApptAssistantView.prototype.getLocationByEmail =
function(item) {
	var locations = this._resources;
	for (var i = 0; i < locations.length; i++) {
		var value = locations[i].getEmail();

        if(value instanceof Array) {
            for(var j = 0; j < value.length; j++) {
                if(item == value[j]) return locations[i];
            }
        }
		if (item == value) {
			return locations[i];
		}
	}
	return null;
};

ZmApptAssistantView.prototype._resetSize = function() {
    if (!this._suggestionsView) {
        return;
    }

    var header = this._suggestionsContainer.firstChild;
    var bounds = this.boundsForChild(this._suggestionsView);
    var insets = Dwt.getInsets(this._suggestionsView);

    var width = bounds.width - insets.left - insets.right;
    var height = (bounds.height - Dwt.getOuterSize(this._suggestMinical).y -
                  Dwt.getOuterSize(header).y);

    Dwt.setSize(this._suggestionsView, width, height);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmScheduleAssistantView")) {
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
 * Creates a left pane view for suggesting time/locations
 * @constructor
 * @class
 * This class displays suggested free time/location for sending invites to attendees
 *
 *  @author Sathishkumar Sugumaran
 *
 * @param parent			[ZmApptComposeView]			the appt compose view
 * @param controller		[ZmApptComposeController]	the appt compose controller
 */
ZmScheduleAssistantView = function(parent, controller, apptEditView, closeCallback) {
    this._kbMgr = appCtxt.getKeyboardMgr();
    this._attendees = [];
    this._workingHours = {};
    this._fbStat = new AjxVector();
    this._fbStatMap = {};
    this._schedule = {};

	ZmApptAssistantView.call(this, parent, controller, apptEditView, closeCallback);
};

ZmScheduleAssistantView.prototype = new ZmApptAssistantView;
ZmScheduleAssistantView.prototype.constructor = ZmScheduleAssistantView;


ZmScheduleAssistantView.prototype.toString =
function() {
	return "ZmScheduleAssistantView";
}

ZmScheduleAssistantView.prototype.cleanup =
function() {
    this._attendees = [];
    this._schedule = {};

    this._manualOverrideFlag = false;
    if(this._currentSuggestions) this._currentSuggestions.removeAll();
    if(this._miniCalendar) this.clearMiniCal();

};

ZmScheduleAssistantView.prototype._createMiniCalendar =
function(date) {
	date = date ? date : new Date();

	var firstDayOfWeek = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;

    //todo: need to use server setting to decide the weekno standard
    var serverId = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    var useISO8601WeekNo = (serverId && serverId.indexOf("Europe")==0 && serverId != "Europe/London");

	this._miniCalendar = new ZmMiniCalendar({parent: this, posStyle:DwtControl.RELATIVE_STYLE,
	    firstDayOfWeek: firstDayOfWeek, showWeekNumber: appCtxt.get(ZmSetting.CAL_SHOW_CALENDAR_WEEK),
        useISO8601WeekNo: useISO8601WeekNo});
    this._miniCalendar.setDate(date);
	this._miniCalendar.setScrollStyle(Dwt.CLIP);
	this._miniCalendar.addSelectionListener(new AjxListener(this, this._miniCalSelectionListener));
	this._miniCalendar.addDateRangeListener(new AjxListener(this, this._miniCalDateRangeListener));
	this._miniCalendar.setMouseOverDayCallback(new AjxCallback(this, this._miniCalMouseOverDayCallback));
	this._miniCalendar.setMouseOutDayCallback(new AjxCallback(this, this._miniCalMouseOutDayCallback));

	var workingWeek = [];
	for (var i = 0; i < 7; i++) {
		var d = (i + firstDayOfWeek) % 7;
		workingWeek[i] = (d > 0 && d < 6);
	}
	this._miniCalendar.setWorkingWeek(workingWeek);

	var app = appCtxt.getApp(ZmApp.CALENDAR);
	var show = app._active || appCtxt.get(ZmSetting.CAL_ALWAYS_SHOW_MINI_CAL);
	this._miniCalendar.setSkipNotifyOnPage(show && !app._active);
	if (!app._active) {
		this._miniCalendar.setSelectionMode(DwtCalendar.DAY);
	}

    this._miniCalendar.reparentHtmlElement(this._htmlElId + "_suggest_minical");
};

ZmScheduleAssistantView.prototype._configureSuggestionWidgets =
function() {
    this._timeSuggestions = new ZmTimeSuggestionView(this, this._controller, this._apptView);
    this._timeSuggestions.reparentHtmlElement(this._suggestionsView);
    this._suggestTime = true;
    this._currentSuggestions = this._timeSuggestions;

    this._locationSuggestions = new ZmLocationSuggestionView(this, this._controller, this._apptView);
    this._locationSuggestions.reparentHtmlElement(this._suggestionsView);

    this._resetSize();
}

ZmScheduleAssistantView.prototype.show =
function(suggestTime) {
    this._enabled = true;

    this._suggestTime = suggestTime;
    if (this._suggestTime) {
        this.updateTime(true, true);
        Dwt.setInnerHtml(this._suggestionName, ZmMsg.suggestedTimes);
        this._locationSuggestions.setVisible(false);
        this._timeSuggestions.setVisible(true);
        Dwt.setVisible(this._suggestMinical, true);
        this._currentSuggestions = this._timeSuggestions;
    } else {
        Dwt.setInnerHtml(this._suggestionName, ZmMsg.suggestedLocations);
        this._timeSuggestions.setVisible(false);
        Dwt.setVisible(this._suggestMinical, false);
        this._locationSuggestions.setVisible(true);
        this._currentSuggestions = this._locationSuggestions;
    }

    this._resetSize();
};

ZmScheduleAssistantView.prototype.suggestAction =
function(focusOnSuggestion, showAllSuggestions) {

    if(appCtxt.isOffline && !appCtxt.isZDOnline()) { return; }

    var params = {
        items: [],        
        itemIndex: {},
        focus: focusOnSuggestion,
        showOnlyGreenSuggestions: !showAllSuggestions
    };

    this._currentSuggestions.setLoadingHtml();
	// Location information is required even for a time search, since the time display indicates locations available
	// at that time.  Use isSuggestRooms to only do so when GAL_ENABLED is true.
    if ((this._resources.length == 0) && this.isSuggestRooms()) {
        this.searchCalendarResources(new AjxCallback(this, this._findFreeBusyInfo, [params]));
    } else {
        this._findFreeBusyInfo(params);
    }    
};


ZmScheduleAssistantView.prototype.getLocationFBInfo =
function(fbCallback, fbCallbackObj, endTime) {

    if(appCtxt.isOffline && !appCtxt.isZDOnline()) { return; }

    var params = {
        items: [],
        itemIndex: {},
        focus: false,
        fbEndTime: endTime,
        showOnlyGreenSuggestions: true
    };
    params.fbCallback = fbCallback.bind(fbCallbackObj, params);

    if(this._resources.length == 0) {
        this.searchCalendarResources(new AjxCallback(this, this._findFreeBusyInfo, [params]));
    } else {
        this._findFreeBusyInfo(params);
    }
};



ZmScheduleAssistantView.prototype._getTimeFrame =
function() {
	var di = {};
	ZmApptViewHelper.getDateInfo(this._apptView, di);
    var startDate = this._date;
    if (!this._date || !this._suggestTime) {
        startDate = AjxDateUtil.simpleParseDateStr(di.startDate);
    }
    var endDate = new Date(startDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setTime(startDate.getTime() + AjxDateUtil.MSEC_PER_DAY);
	return {start:startDate, end:endDate};
};

ZmScheduleAssistantView.prototype._miniCalSelectionListener =
function(ev) {
	if (ev.item instanceof ZmMiniCalendar) {
        var date = ev.detail;

        // *** Separate Suggestions pane, only invoked to show suggestions, so changing
        //     force refresh to True
        this.reset(date, this._attendees, true);

        //set edit view start/end date
        var duration = this._apptView.getDurationInfo().duration;
        var endDate = new Date(date.getTime() + duration);
        this._apptView.setDate(date, endDate, true);
	}
};

ZmScheduleAssistantView.prototype.updateTime =
function(clearSelection, forceRefresh) {
    if(clearSelection) this._date = null;
    var tf = this._getTimeFrame();
    this._miniCalendar.setDate(tf.start, true);
    this.reset(tf.start, this._attendees, forceRefresh);
    appCtxt.notifyZimlets("onEditAppt_updateTime", [this._apptView, tf]);//notify Zimlets
};

ZmScheduleAssistantView.prototype.getOrganizer =
function() {
    return this._apptView._isProposeTime ? this._apptView.getCalItemOrganizer() : this._apptView.getOrganizer();
};

ZmScheduleAssistantView.prototype.addOrganizer =
function() {
    //include organizer in the scheduler suggestions
    var organizer = this._apptView.getOrganizer();
    this._attendees.push(organizer.getEmail());
};

ZmScheduleAssistantView.prototype.updateAttendees =
function(attendees) {

    if(attendees instanceof AjxVector) attendees = attendees.getArray();

    this._attendees = [];

    this.addOrganizer();

    var attendee;
    for (var i = attendees.length; --i >= 0;) {
            attendee = attendees[i].getEmail();
            if (attendee instanceof Array) {
                attendee = attendee[i][0];
            }
            this._attendees.push(attendee);
    }

    // *** Separate Suggestions pane, only invoked to show suggestions, so changing
    //     force refresh to True
    this.reset(this._date, this._attendees, true);
};

ZmScheduleAssistantView.prototype.updateAttendee =
function(attendee) {

    var email = (typeof attendee == 'string') ? attendee : attendee.getEmail();
    if(this._attendees.length == 0) {
        this.addOrganizer();
        this._attendees.push(email);
    }else {
        var found = false;
        for (var i = this._attendees.length; --i >= 0;) {
            if(email == this._attendees[i]) {
                found = true;
                break;
            }
        }
        if(!found) this._attendees.push(email);
    }

    // *** Separate Suggestions pane, only invoked to show suggestions, so changing
    //     force refresh to True
    this.reset(this._date, this._attendees, true);
};


ZmScheduleAssistantView.prototype.reset =
function(date, attendees, forceRefresh) {
    this._date = date || this._miniCalendar.getDate();
    if(!this._apptView.isSuggestionsNeeded() || !this.isSuggestionsEnabled()) {
        var isGalEnabled = appCtxt.get(ZmSetting.GROUP_CALENDAR_ENABLED) && appCtxt.get(ZmSetting.GAL_ENABLED);
        if(this._timeSuggestions && !isGalEnabled) this._timeSuggestions.removeAll();
        this.clearMiniCal();
        if(!this.isSuggestionsEnabled()) {
           if(isGalEnabled) this._timeSuggestions.setShowSuggestionsHTML(this._date);
        }
        this._resetSize();
        return;
    }

    var newDuration = this._apptView.getDurationInfo().duration;
    var newKey = this.getFormKey(this._date, attendees);
    if(newKey != this._key || newDuration != this._duration) {
        if(this._currentSuggestions){
            this._currentSuggestions.removeAll();
            this.clearMiniCal();
        }
        if(forceRefresh) this.suggestAction(false, false);
    }

    this._resetSize();
};

ZmScheduleAssistantView.prototype._miniCalDateRangeListener =
function(ev) {
    //clear current mini calendar suggestions
    this._miniCalendar.setColor({}, true, {});
    if(!this._apptView.isSuggestionsNeeded()) return;
    this.highlightMiniCal();
};

ZmScheduleAssistantView.prototype._miniCalMouseOverDayCallback =
function(control, day) {
	this._currentMouseOverDay = day;
    //todo: add code if tooltip needs to be supported
};

ZmScheduleAssistantView.prototype._miniCalMouseOutDayCallback =
function(control) {
	this._currentMouseOverDay = null;
};


//smart scheduler suggestion modules

// This should only be called for time suggestions
ZmScheduleAssistantView.prototype._findFreeBusyInfo =
function(params) {

    var currAcct = this._apptView.getCalendarAccount();
	// Bug: 48189 Don't send GetFreeBusyRequest for non-ZCS accounts.
	if (appCtxt.isOffline && (!currAcct.isZimbraAccount || currAcct.isMain)) {
        //todo: avoid showing smart scheduler button for non-ZCS accounts - offline client
        return;
	}

	var tf = this._timeFrame = this._getTimeFrame();
    if (params.fbEndTime) {
        // Override the time frame.  Used for checking location
        // recurrence collisions
        tf.end = new Date(params.fbEndTime);
    }
	var emails = [], attendeeEmails = [], email;

    params.itemIndex = {};
    params.items = [];
    params.timeFrame = tf;

    this._copyResourcesToParams(params, emails);

    var attendees = this._apptView.getRequiredAttendeeEmails();
    this._attendees = [];


    var attendee;
    for (var i = attendees.length; --i >= 0;) {
        this._addAttendee(attendees[i], params, emails, attendeeEmails);
    }
    params._nonOrganizerAttendeeEmails = attendeeEmails.slice();
    //include organizer in the scheduler suggestions
    var organizer = this.getOrganizer();
    this._addAttendee(organizer.getEmail(), params, emails, attendeeEmails);

    params.emails = emails;
    params.attendeeEmails = attendeeEmails;

    this._key = this.getFormKey(tf.start, this._attendees);

    if((this._attendees.length == 0) && this._suggestTime) {
        this._timeSuggestions.setNoAttendeesHtml();
        return;
    }

	if (this._freeBusyRequest) {
		appCtxt.getRequestMgr().cancelRequest(this._freeBusyRequest, null, true);
	}

    var callback;
    if (params.fbCallback) {
        // Custom FB processing
        callback = params.fbCallback;
    } else {
        if (this._suggestTime) {
            callback = new AjxCallback(this, this.getWorkingHours, [params]);
        } else {
            callback = new AjxCallback(this, this.suggestLocations, [params]);
        }
    }

    var acct = (appCtxt.multiAccounts) ? this._apptView.getCalendarAccount() : null;
    var fbParams = {
                    startTime: tf.start.getTime(),
                    endTime: tf.end.getTime(),
                    emails: emails,
                    callback: callback,
                    errorCallback: callback,
                    noBusyOverlay: true,
                    account: acct
    };

    this._freeBusyRequest = this._fbCache.getFreeBusyInfo(fbParams);
};

ZmScheduleAssistantView.prototype._addAttendee =
function(attendee, params, emails, attendeeEmails) {
    params.items.push(attendee);
    params.itemIndex[attendee] = params.items.length-1;
    emails.push(attendee);
    attendeeEmails.push(attendee);
    this._attendees.push(attendee);
};


ZmScheduleAssistantView.prototype.getFormKey =
function(startDate, attendees) {
    return startDate.getTime() + "-" + attendees.join(",");
};

ZmScheduleAssistantView.prototype.clearCache =
function() {
    this._organizerEmail = null;
    this._workingHours = {};    
};

ZmScheduleAssistantView.prototype.getFreeBusyKey =
function(timeFrame, id) {
    return timeFrame.start.getTime() + "-" + timeFrame.end.getTime() + "-" + id;
};

ZmScheduleAssistantView.prototype.getWorkingHours =
function(params) {

    //clear fb request info
    this._freeBusyRequest = null;

    if (this._workingHoursRequest) {
        appCtxt.getRequestMgr().cancelRequest(this._workingHoursRequest, null, true);
    }

    var onlyIncludeMyWorkingHours     = params.onlyIncludeMyWorkingHours     = this.isOnlyMyWorkingHoursIncluded();
    var onlyIncludeOthersWorkingHours = params.onlyIncludeOthersWorkingHours = this.isOnlyOthersWorkingHoursIncluded();

    if(!onlyIncludeMyWorkingHours && !onlyIncludeOthersWorkingHours) {
         // Non-working hours can be used for the organizer and all attendees
         this.suggestTimeSlots(params);
         return;   
    }

    var organizer = this.getOrganizer();
    this._organizerEmail = organizer.getEmail();

    var emails =  [];
    if (onlyIncludeOthersWorkingHours) {
        emails = params._nonOrganizerAttendeeEmails;
    }
    if (onlyIncludeMyWorkingHours) {
        emails = emails.concat([this._organizerEmail]);
    }

    var acct = (appCtxt.multiAccounts) ? this._apptView.getCalendarAccount() : null;

    //optimization: fetch working hrs for a week - wrking hrs pattern repeat everyweek
    var weekStartDate = new Date(params.timeFrame.start.getTime());
    var dow = weekStartDate.getDay();
    weekStartDate.setDate(weekStartDate.getDate()-((dow+7))%7);


    var whrsParams = {
        startTime: weekStartDate.getTime(),
        endTime: weekStartDate.getTime() + 7*AjxDateUtil.MSEC_PER_DAY,
        emails: emails,
        callback: new AjxCallback(this, this._handleWorkingHoursResponse, [params]),
        errorCallback: new AjxCallback(this, this._handleWorkingHoursError, [params]),
        noBusyOverlay: true,
        account: acct
    };

    this._workingHoursRequest = this._fbCache.getWorkingHours(whrsParams);
};

ZmScheduleAssistantView.prototype.isOnlyMyWorkingHoursIncluded =
function() {
    return this._prefDialog ?
        (this._prefDialog.getPreference(ZmTimeSuggestionPrefDialog.MY_WORKING_HOURS_FIELD) == "true") : false;
};
ZmScheduleAssistantView.prototype.isOnlyOthersWorkingHoursIncluded =
function() {
    return this._prefDialog ?
        (this._prefDialog.getPreference(ZmTimeSuggestionPrefDialog.OTHERS_WORKING_HOURS_FIELD) == "true") : false;
};

ZmScheduleAssistantView.prototype._handleWorkingHoursResponse =
function(params, result) {

    this._workingHoursRequest = null;
    this._workingHours = {};

    if(this._organizerEmail) {
        this._workingHours[this._organizerEmail] =
            this._fbCache.getWorkingHrsSlot(params.timeFrame.start.getTime(),
                                            params.timeFrame.end.getTime(), this._organizerEmail);
    }
    if(this.isSuggestionsEnabled()) {
        this.suggestTimeSlots(params);
    }
};

ZmScheduleAssistantView.prototype._handleWorkingHoursError =
function(params, result) {

    this._workingHoursRequest = null;
    this._workingHours = {};
    this.suggestTimeSlots(params);

};

ZmScheduleAssistantView.prototype.suggestTimeSlots =
function(params) {

    var startDate = this._timeFrame.start;
    startDate.setHours(0, 0, 0, 0);
    var startTime = startDate.getTime();

    var cDate = new Date();

    //ignore suggestions that are in past
    if(startTime == cDate.setHours(0, 0, 0, 0)) {
        startDate = new Date();
        startTime = startDate.setHours(startDate.getHours(), ((startDate.getMinutes() >=30) ? 60 : 30), 0, 0);
    }

    var endDate = new Date(startTime);
    endDate.setHours(23, 59, 0, 0);
    var endTime = endDate.getTime();
    var durationInfo = this._duration = this._apptView.getDurationInfo();

    params.duration = durationInfo.duration;

    this._fbStat = new AjxVector();
    this._fbStatMap = {};
    this._totalUsers = this._attendees.length;
    this._totalLocations =  this._resources.length;

    while(startTime < endTime) {
        this.computeAvailability(startTime, startTime + durationInfo.duration, params);
        startTime += AjxDateUtil.MSEC_PER_HALF_HOUR;
    }

    params.locationInfo = this.computeLocationAvailability(durationInfo, params);

    this._fbStat.sort(ZmScheduleAssistantView._slotComparator);
    //DBG.dumpObj(this._fbStat);
    this.renderSuggestions(params);

    //highlight minicalendar to mark suggested days in month
    this.highlightMiniCal();
};

ZmScheduleAssistantView.prototype.isSuggestionsEnabled =
function() {
    if(!this._suggestTime && (!appCtxt.get(ZmSetting.GROUP_CALENDAR_ENABLED) || !appCtxt.get(ZmSetting.GAL_ENABLED))) {
		//disable suggest locations when GAL is disabled.
		return false;
	}
    // Enabled when visible
    return this._enabled;
};

ZmScheduleAssistantView.prototype.overrideManualSuggestion =
function(enable) {
    this._manualOverrideFlag = enable;
};

ZmScheduleAssistantView.prototype.isSuggestRooms =
function() {
    // Assume desire room checking if it is possible
    return appCtxt.get(ZmSetting.GAL_ENABLED);
};

ZmScheduleAssistantView.prototype.getAttendees =
function() {
    return this._attendees;
};

ZmScheduleAssistantView.prototype.computeAvailability =
function(startTime, endTime, params) {
    
    var dayStartTime = (new Date(startTime)).setHours(0,0,0,0);
    var dayEndTime = dayStartTime + AjxDateUtil.MSEC_PER_DAY;

    var key = this.getKey(startTime, endTime);
    var fbInfo;

    if(!params.miniCalSuggestions && this._fbStatMap[key]) {
        fbInfo = this._fbStatMap[key];
    }else {
        fbInfo = {
            startTime: startTime,
            endTime: endTime,
            availableUsers: 0,
            availableLocations: 0,
            attendees: [],
            locations: []
        };
    }

    var attendee, sched, isFree;
    for(var i = this._attendees.length; --i >= 0;) {
        attendee = this._attendees[i];

        var excludeTimeSlots = this._apptView.getFreeBusyExcludeInfo(attendee);
        sched = this._fbCache.getFreeBusySlot(dayStartTime, dayEndTime, attendee, excludeTimeSlots);

        // Last entry will be the organizer, all others are attendees
        // Organizer and Attendees have separate checkboxes indicating whether to apply non-working hours to them.
        var isOrganizer = (i == (this._attendees.length-1));
        var onlyUseWorkingHours = isOrganizer ?
            params.onlyIncludeMyWorkingHours :  params.onlyIncludeOthersWorkingHours;
        isFree = onlyUseWorkingHours ?  this.isWithinWorkingHour(attendee, startTime, endTime) : true;

        //ignore time slots for non-working hours of this user
        if(!isFree) continue;

        if(sched.b) isFree = isFree && ZmApptAssistantView.isBooked(sched.b, startTime, endTime);
        if(sched.t) isFree = isFree && ZmApptAssistantView.isBooked(sched.t, startTime, endTime);
        if(sched.u) isFree = isFree && ZmApptAssistantView.isBooked(sched.u, startTime, endTime);

        //collect all the item indexes of the attendees available at this slot
        if(isFree) {
            if(!params.miniCalSuggestions) fbInfo.attendees.push(params.itemIndex[attendee]);
            fbInfo.availableUsers++;
        }
    }

    if (this.isSuggestRooms()) {

        var list = this._resources, resource;
        for (var i = list.length; --i >= 0;) {
            attendee = list[i];
            resource = attendee.getEmail();

            if (resource instanceof Array) {
                resource = resource[0];
            }

            var excludeTimeSlots = this._apptView.getFreeBusyExcludeInfo(resource);
            sched = this._fbCache.getFreeBusySlot(dayStartTime, dayEndTime, resource, excludeTimeSlots);
            isFree = true;
            if(sched.b) isFree = isFree && ZmApptAssistantView.isBooked(sched.b, startTime, endTime);
            if(sched.t) isFree = isFree && ZmApptAssistantView.isBooked(sched.t, startTime, endTime);
            if(sched.u) isFree = isFree && ZmApptAssistantView.isBooked(sched.u, startTime, endTime);

            //collect all the item indexes of the locations available at this slot
            if(isFree) {
                if(!params.miniCalSuggestions) fbInfo.locations.push(params.itemIndex[resource]);
                fbInfo.availableLocations++;
            }
        }
    }

    //mini calendar suggestions should avoid collecting all computed information in array for optimiziation
    if (!params.miniCalSuggestions) {
        var showOnlyGreenSuggestions = params.showOnlyGreenSuggestions;
        if(!showOnlyGreenSuggestions || (fbInfo.availableUsers == this._totalUsers)) {
            this._fbStat.add(fbInfo);
            this._fbStatMap[key] = fbInfo;            
        }
    }

    return fbInfo;
};

//module to sort the computed time slots in order of 1)available users 2)time
ZmScheduleAssistantView._slotComparator =
function(slot1, slot2) {
	if(slot1.availableUsers < slot2.availableUsers) {
        return 1;
    }else if(slot1.availableUsers > slot2.availableUsers) {
        return -1;
    }else {
        return slot1.startTime < slot2.startTime ? -1 : (slot1.startTime > slot2.startTime ? 1 : 0);
    }
};

ZmScheduleAssistantView.prototype.getKey =
function(startTime, endTime) {
    return startTime + "-" + endTime;
};

//working hours pattern repeats every week - fetch it for just one week 
ZmScheduleAssistantView.prototype.getWorkingHoursKey =
function() {

    if(!this._timeFrame) return;

    var weekStartDate = new Date(this._timeFrame.start.getTime());
    var dow = weekStartDate.getDay();
    weekStartDate.setDate(weekStartDate.getDate()-((dow+7))%7);
    return [weekStartDate.getTime(), weekStartDate.getTime() + 7*AjxDateUtil.MSEC_PER_DAY, this._organizerEmail].join("-");
};

ZmScheduleAssistantView.prototype.isWithinWorkingHour =
function(attendee, startTime, endTime) {

    var dayStartTime = (new Date(startTime)).setHours(0,0,0,0);
    var dayEndTime = dayStartTime + AjxDateUtil.MSEC_PER_DAY;

    var workingHours = this._fbCache.getWorkingHrsSlot(dayStartTime, dayEndTime, attendee);

    //if working hours could not be retrieved consider all time slots for suggestion
    if(workingHours && workingHours.n) {
        workingHours = this._fbCache.getWorkingHrsSlot(dayStartTime, dayEndTime, this._organizerEmail);
        if(workingHours && workingHours.n) return true;
    }

    if(!workingHours) return false;

    var slots = workingHours.f;

    //working hours are indicated as free slots
    if(!slots) return false;

    //convert working hrs relative to the searching time before comparing
    var slotStartDate, slotEndDate, slotStartTime, slotEndTime;
    for (var i = 0; i < slots.length; i++) {
        slotStartDate = new Date(slots[i].s);
        slotEndDate = new Date(slots[i].e);
        slotStartTime = (new Date(startTime)).setHours(slotStartDate.getHours(), slotStartDate.getMinutes(), 0, 0);
        slotEndTime = slotStartTime + (slots[i].e - slots[i].s);
        if(startTime >= slotStartTime && endTime <= slotEndTime) {
            return true;
        }
    };
    return false;
};

ZmScheduleAssistantView.prototype.renderSuggestions =
function(params) {

    if (this._suggestTime) {
        params.list = this._fbStat;
    } else {
        params.list = params.locationInfo.locations;
        var warning = false;
        if (params.list.size() >= ZmContactsApp.SEARCHFOR_MAX) {
            // Problem: the locations search returned the Limit, implying there may
            // be even more - and the location suggestion pane does not have a 'Next'
            // button to get the next dollop, since large numbers of suggestions are
            // not useful. Include a warning that the user should set their location prefs.
            warning = true;
        }
        this._locationSuggestions.setWarning(warning);
    }
    params.totalUsers = this._totalUsers;
    params.totalLocations = this._totalLocations;

    this._currentSuggestions.set(params);
    if(params.focus) this._currentSuggestions.focus();
    this._resetSize();
};

//modules for handling mini calendar suggestions

ZmScheduleAssistantView.prototype.highlightMiniCal =
function() {
    this.getMonthFreeBusyInfo();
};

ZmScheduleAssistantView.prototype.clearMiniCal =
function() {
    this._miniCalendar.setColor({}, true, {});
};

ZmScheduleAssistantView.prototype.getMonthFreeBusyInfo =
function() {
    var range = this._miniCalendar.getDateRange();
    var startDate = range.start;
    var endDate = range.end;

    var params = {
        items: [],
        itemIndex: {},
        focus: false,
        timeFrame: {
            start: startDate,
            end: endDate
        },
        miniCalSuggestions: true
    };

    //avoid suggestions for past date
    var currentDayTime = (new Date()).setHours(0,0,0,0);
    if(currentDayTime >= startDate.getTime() && currentDayTime <= endDate.getTime()) {
        //reset start date if the current date falls within the month date range - to ignore free busy info from the past
        startDate = params.timeFrame.start = new Date(currentDayTime);
        if(endDate.getTime() == currentDayTime) {
            endDate = params.timeFrame.end = new Date(currentDayTime + AjxDateUtil.MSEC_PER_DAY);
        }
    }else if(endDate.getTime() < currentDayTime) {
        //avoid fetching free busy info for dates in the past
        return;
    }

    var list = this._resources;
    var emails = [], attendeeEmails = [];


    for (var i = list.length; --i >= 0;) {
        var item = list[i];
        var email = item.getEmail();
        if (email instanceof Array) {
            email = email[0];
        }
        emails.push(email);

        params.items.push(email);
		params.itemIndex[email] = params.items.length -1;

    }

    var attendees = this._apptView.getRequiredAttendeeEmails();

    var attendee;
    for (var i = attendees.length; --i >= 0;) {
        attendee = attendees[i];
        params.items.push(attendee);
        params.itemIndex[attendee] = params.items.length-1;
        emails.push(attendee);
        attendeeEmails.push(attendee);        
    }

    params._nonOrganizerAttendeeEmails = attendeeEmails.slice();

    //include organizer in the scheduler suggestions
    var organizer = this.getOrganizer();
    var organizerEmail = organizer.getEmail();
    params.items.push(organizerEmail);
    params.itemIndex[organizerEmail] = params.items.length-1;
    emails.push(organizerEmail);
    attendeeEmails.push(organizerEmail);

    params.emails = emails;
    params.attendeeEmails = attendeeEmails;

    var callback = new AjxCallback(this, this._handleMonthFreeBusyInfo, [params]);
    var acct = (appCtxt.multiAccounts)
            ? this._apptView.getCalendarAccount() : null;


    var fbParams = {
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        emails: emails,
        callback: callback,
        errorCallback: callback,
        noBusyOverlay: true,
        account: acct
    };

    this._monthFreeBusyRequest = this._fbCache.getFreeBusyInfo(fbParams);
};

ZmScheduleAssistantView.prototype._handleMonthFreeBusyInfo =
function(params) {

    //clear fb request info
    this._monthFreeBusyRequest = null;

    if (this._monthWorkingHrsReq) {
        appCtxt.getRequestMgr().cancelRequest(this._monthWorkingHrsReq, null, true);
    }

    var onlyIncludeMyWorkingHours     = this.isOnlyMyWorkingHoursIncluded();
    var onlyIncludeOthersWorkingHours = this.isOnlyOthersWorkingHoursIncluded();

    if(!onlyIncludeMyWorkingHours && !onlyIncludeOthersWorkingHours) {
        this.suggestMonthTimeSlots(params);
        return;
    }

    var organizer = this.getOrganizer();
    this._organizerEmail = organizer.getEmail();

    this._workingHoursKey = this.getWorkingHoursKey();

    var acct = (appCtxt.multiAccounts) ? this._apptView.getCalendarAccount() : null;

    //optimization: fetch working hrs for a week - wrking hrs pattern repeat everyweek
    var weekStartDate = new Date(params.timeFrame.start.getTime());
    var dow = weekStartDate.getDay();
    weekStartDate.setDate(weekStartDate.getDate()-((dow+7))%7);

    var emails = onlyIncludeOthersWorkingHours ? params._nonOrganizerAttendeeEmails : null;

    if (onlyIncludeMyWorkingHours) {
        emails = emails && emails.concat([this._organizerEmail]);
    }

    var whrsParams = {
        startTime: weekStartDate.getTime(),
        endTime: weekStartDate.getTime() + 7*AjxDateUtil.MSEC_PER_DAY,
        emails: emails,
        callback: new AjxCallback(this, this._handleMonthWorkingHoursResponse, [params]),
        errorCallback: new AjxCallback(this, this._handleMonthWorkingHoursError, [params]),
        noBusyOverlay: true,
        account: acct
    };

    this._monthWorkingHrsReq = this._fbCache.getWorkingHours(whrsParams);
};


ZmScheduleAssistantView.prototype._handleMonthWorkingHoursResponse =
function(params, result) {

    this._monthWorkingHrsReq = null;
    this.suggestMonthTimeSlots(params);
};

ZmScheduleAssistantView.prototype._handleMonthWorkingHoursError =
function(params, result) {

    this._monthWorkingHrsReq = null;
    this.suggestMonthTimeSlots(params);
};


ZmScheduleAssistantView.prototype.suggestMonthTimeSlots =
function(params) {

    var startDate = params.timeFrame.start;
    startDate.setHours(0, 0, 0, 0);
    var startTime = startDate.getTime();
    var endTime = params.timeFrame.end.getTime();
    var duration = this._duration = this._apptView.getDurationInfo().duration;

    params.duration = duration;

    this._fbStat = new AjxVector();
    this._fbStatMap = {};
    this._totalUsers = this._attendees.length;
    this._totalLocations =  this._resources.length;

    params.dates = {};
    params.colors = {};

    var key, fbStat, freeSlotFound = false, dayStartTime, dayEndTime;

    //suggest for entire minicalendar range
    while(startTime < endTime) {

        dayStartTime = startTime;
        dayEndTime = dayStartTime + AjxDateUtil.MSEC_PER_DAY;

        freeSlotFound = false;

        while(dayStartTime < dayEndTime) {
            fbStat = this.computeAvailability(dayStartTime, dayStartTime + duration, params);
            dayStartTime += AjxDateUtil.MSEC_PER_HALF_HOUR;

            if(fbStat && fbStat.availableUsers == this._totalUsers) {
                this._addColorCode(params, startTime, ZmMiniCalendar.COLOR_GREEN);
                freeSlotFound = true;
                //found atleast one free slot that can accomodate all attendees and atleast one recources
                break;
            }
        }

        if(!freeSlotFound) {                        
            this._addColorCode(params, startTime, ZmMiniCalendar.COLOR_RED); 
        }

        startTime += AjxDateUtil.MSEC_PER_DAY;
    }

    this._miniCalendar.setColor(params.dates, true, params.colors);
};

ZmScheduleAssistantView.prototype._addColorCode =
function(params, startTime, code) {
    var sd = new Date(startTime);
    var str = AjxDateFormat.format("yyyyMMdd", sd);
    params.dates[str] = sd;
    params.colors[str] = code;
};

ZmScheduleAssistantView.prototype._resetSize = function() {
	ZmApptAssistantView.prototype._resetSize.call(this);

    if (!this._currentSuggestions) {
        return;
    }

    var width = this.boundsForChild(this._currentSuggestions).width;
    width -= Dwt.getScrollbarSizes(this._suggestionsView).x;

    if (AjxEnv.isIE || AjxEnv.isModernIE) {
        var insets = this._currentSuggestions.getInsets();
        width -= insets.left + insets.right;
    }

    this._currentSuggestions.setSize(width);
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmLocationAssistantView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a left pane view for suggesting locations
 * @constructor
 * @class
 * This class displays suggested free locations for a new appointment
 *
 *  @author Vince Bellows
 *
 * @param newApptDialog     [ZmApptQuickAddDialog]	    the new appt dialog
 * @param container         [DOM Element]	            the dialog's content Element
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param closeCallback     [Callback Function]			Function to invoke upon close
 */
ZmLocationAssistantView = function(parent, controller, newApptDialog, closeCallback) {
	ZmApptAssistantView.call(this, parent, controller, newApptDialog, closeCallback);
};

ZmLocationAssistantView.prototype = new ZmApptAssistantView;
ZmLocationAssistantView.prototype.constructor = ZmLocationAssistantView;


ZmLocationAssistantView.prototype.toString =
function() {
	return "ZmLocationAssistantView";
}

ZmLocationAssistantView.prototype.cleanup =
function() {
    if(this._locationSuggestions) this._locationSuggestions.removeAll();
};


ZmLocationAssistantView.prototype._configureSuggestionWidgets =
function() {
    var locClassName = "DwtListView ZmSuggestLocationList";
    this._locationSuggestions = new ZmLocationSuggestionView(this, this._controller,
                                    this._apptView, locClassName);
    this._locationSuggestions.reparentHtmlElement(this._suggestionsView);

    Dwt.setInnerHtml(this._suggestionName, ZmMsg.suggestedLocations);

    this._suggestionsView.style.overflow = 'auto';
    Dwt.setVisible(this._suggestMinical, false);
};

ZmLocationAssistantView.prototype.show =
function(containerSize) {
    this._enabled = true;
    if (!this._containerHeight) {
        this._containerHeight = containerSize.y;

        var nameSize        = Dwt.getSize(this._suggestionName);
        this._yAdjustment   = nameSize.y + 20;
    }
};

ZmLocationAssistantView.prototype.suggestAction =
function(freeBusyCallback) {

    if(appCtxt.isOffline && !appCtxt.isZDOnline()) { return; }

    var params = {
        items: [],
        itemIndex: {},
        focus: true,
        showOnlyGreenSuggestions: true,
        fbCallback: freeBusyCallback
    };

    this._locationSuggestions.setLoadingHtml();
    if(this._resources.length == 0) {
        this.searchCalendarResources(new AjxCallback(this, this._findFreeBusyInfo, [params]));
    } else {
        this._findFreeBusyInfo(params);
    }
};

ZmLocationAssistantView.prototype._getTimeFrame =
function() {
    var di = {};
    ZmApptViewHelper.getDateInfo(this._apptView, di);
    var startDate = AjxDateUtil.simpleParseDateStr(di.startDate);
    startDate && startDate.setHours(0, 0, 0, 0);
    var endDate = AjxDateUtil.simpleParseDateStr(di.endDate);
    endDate && endDate.setHours(23, 59, 59, 9999);
    return {start:startDate, end:endDate};
};

ZmLocationAssistantView.prototype.updateTime =
function() {
    var tf = this._getTimeFrame();
    this.reset(tf.start);
};

ZmLocationAssistantView.prototype.reset =
function(date) {
    var newDurationInfo = this._apptView.getDurationInfo();
    if(!this._duration ||
       ((newDurationInfo.startTime != this._duration.startTime) ||
        (newDurationInfo.endTime   != this._duration.endTime))) {
        this._duration = newDurationInfo;
        if(this._locationSuggestions){
            this._locationSuggestions.removeAll();
        }
        this.suggestAction();
    }
};

ZmLocationAssistantView.prototype._findFreeBusyInfo =
function(params) {

    if (this._apptView instanceof ZmApptQuickAddDialog) {
        if (AjxUtil.isEmpty(this._apptView._locationField.getValue())) {
            return;
        }
    }

    var currAcct = this._apptView.getCalendarAccount();
	// Bug: 48189 Don't send GetFreeBusyRequest for non-ZCS accounts.
	if (appCtxt.isOffline && (!currAcct.isZimbraAccount || currAcct.isMain)) {
        //todo: avoid showing smart scheduler button for non-ZCS accounts - offline client
        return;
    }

    var tf = this._getTimeFrame();

    if (!tf.start || !tf.end) {
        return;
    }

    params.itemIndex = {};
    params.items = [];
    params.timeFrame = tf;
    params.attendeeEmails = [];

    var emails = [];
    this._copyResourcesToParams(params, emails);
    params.emails = emails;

    if (this._freeBusyRequest) {
        appCtxt.getRequestMgr().cancelRequest(this._freeBusyRequest, null, true);
    }

    var callback = params.fbCallback ? params.fbCallback :
        new AjxCallback(this, this.suggestLocations, [params]);
    var acct = (appCtxt.multiAccounts) ? this._apptView.getCalendarAccount() : null;
    var fbParams = {
                    startTime:     tf.start.getTime(),
                    endTime:       tf.end.getTime(),
                    emails:        emails,
                    callback:      callback,
                    errorCallback: callback,
                    noBusyOverlay: true,
                    account:       acct
    };

    this._freeBusyRequest = this._fbCache.getFreeBusyInfo(fbParams);
};


ZmLocationAssistantView.prototype.suggestLocations =
function(params) {
    ZmApptAssistantView.prototype.suggestLocations.call(this, params);
    Dwt.setSize(this._suggestionsView, Dwt.DEFAULT, this._containerHeight - this._yAdjustment);
};

ZmLocationAssistantView.prototype.renderSuggestions =
function(params) {
    params.list = params.locationInfo.locations;
    params.totalLocations = this._totalLocations;
    var warning = false;
    if (params.list.size() >= ZmContactsApp.SEARCHFOR_MAX) {
        // Problem: the locations search returned the Limit, implying there may
        // be even more - and the location suggestion pane does not have a 'Next'
        // button to get the next dollop, since large numbers of suggestions are
        // not useful. Include a warning that the user should set their location prefs.
        warning = true;
    }
    this._locationSuggestions.setWarning(warning);

    this._locationSuggestions.set(params);
    if(params.focus) this._locationSuggestions.focus();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmSuggestionsView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a list view for time or location suggestions
 * @constructor
 * @class
 *
 *  @author Vince Bellows
 *
 * @param parent			[ZmScheduleAssistantView]	the smart scheduler view
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param apptEditView		[ZmApptEditView]	        the appt edit view
 */
ZmSuggestionsView = function(parent, controller, apptEditView, id, showHeaders, className) {
    if (arguments.length == 0) { return; }

    var params = {parent: parent, posStyle: DwtControl.RELATIVE_STYLE, view: id};
    if (className) {
        params.className = className;
    }
	ZmListView.call(this, params);

	this._controller = controller;
	this._editView = apptEditView;

	this._rendered = false;
	this._kbMgr = appCtxt.getKeyboardMgr();
    this._normalClass = DwtListView.ROW_CLASS;
    this._selectedClass = [DwtListView.ROW_CLASS, DwtCssStyle.SELECTED].join("-");
    this.setMultiSelect(false);

    this._showHeaders = showHeaders;
};

ZmSuggestionsView.prototype = new ZmListView;
ZmSuggestionsView.prototype.constructor = ZmSuggestionsView;

ZmSuggestionsView.prototype.toString =
function() {
	return "ZmSuggestionsView";
}

ZmSuggestionsView.prototype.set =
function(params) {
    this._items = params.items;
    this._itemIndex = params.itemIndex;
    ZmListView.prototype.set.call(this, params.list);
};

ZmSuggestionsView.prototype._setNoResultsHtml =
function() {};

ZmSuggestionsView.prototype.setShowSuggestionsHTML =
function(date) {};

ZmSuggestionsView.prototype.setLoadingHtml =
function() {
    this.removeAll();
    var	div = document.createElement("div");
    div.innerHTML = AjxTemplate.expand("calendar.Appointment#TimeSuggestion-Loading");
    this._addRow(div);
};

ZmSuggestionsView.prototype._getHeaderKey =
function(item) {
    return '';
}

ZmSuggestionsView.prototype._renderList =
function(list, noResultsOk, doAdd, prefixHtml) {
	if (list instanceof AjxVector && list.size()) {
		var now = new Date();
		var size = list.size();
		var htmlArr = [], hdrKey, hdrListed = {};
		if (prefixHtml) {
		    htmlArr.push(prefixHtml);
		}
		var nonZeroAvailableFound = false;
		for (var i = 0; i < size; i++) {
			var item = list.get(i);
			nonZeroAvailableFound = nonZeroAvailableFound || item.availableUsers > 0;
			//Note that this works since it's sorted from higher available down, so first we'll get the non zero.
			if (item.availableUsers === 0 && nonZeroAvailableFound) {
				break; //ignore 0 available if we got items with more than 0 available.
			}

            if (this._showHeaders) {
                hdrKey = this._getHeaderKey(item);
                if(!hdrListed[hdrKey]) {
                    var sectionHeaderHtml = this._renderListSectionHdr(hdrKey, item);
                    if(sectionHeaderHtml) htmlArr.push(sectionHeaderHtml);
                    hdrListed[hdrKey] = true;
                }
            }

			var div = this._createItemHtml(item, {now:now}, !doAdd, i);
			if (div) {
				if (div instanceof Array) {
					for (var j = 0; j < div.length; j++){
						this._addRow(div[j]);
					}
				} else if (div.tagName || doAdd) {
					this._addRow(div);
				} else {
					htmlArr.push(div);
				}
			}
		}
		if (htmlArr.length) {
			this._parentEl.innerHTML = htmlArr.join("");
		}
	} else if (!noResultsOk) {
		this._setNoResultsHtml();
	}
};



}
if (AjxPackage.define("zimbraMail.calendar.view.ZmTimeSuggestionView")) {
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
 * Creates a list view for time suggestions
 * @constructor
 * @class
 *
 *  @author Sathishkumar Sugumaran
 *
 * @param parent			[ZmScheduleAssistantView]	the smart scheduler view
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param apptEditView		[ZmApptEditView]	        the appt edit view
 */
ZmTimeSuggestionView = function(parent, controller, apptEditView) {
    ZmSuggestionsView.call(this, parent, controller, apptEditView, ZmId.VIEW_SUGGEST_TIME_PANE, true);
    this._sectionHeaderHtml = {};
}
ZmTimeSuggestionView.prototype = new ZmSuggestionsView;
ZmTimeSuggestionView.prototype.constructor = ZmTimeSuggestionView;

ZmTimeSuggestionView.prototype.toString =
function() {
	return "ZmTimeSuggestionView";
}

ZmTimeSuggestionView._VALUE = 'value';
ZmTimeSuggestionView._ITEM_INFO = 'iteminfo';
ZmTimeSuggestionView.SHOW_MORE_VALUE = '-1';
ZmTimeSuggestionView.F_LABEL = 'ts';
ZmTimeSuggestionView.COL_NAME	= "t";

ZmTimeSuggestionView.prototype.set =
function(params) {
    this._totalUsers = params.totalUsers;
    this._totalLocations = params.totalLocations;
    this._duration = params.duration;
    this._startDate = params.timeFrame.start;

    ZmSuggestionsView.prototype.set.call(this, params);
};

ZmTimeSuggestionView.prototype._createItemHtml =
function (item) {
    var id = this.associateItemWithElement(item, null, null, null);

    var attendeeImage = "AttendeeOrange";
    var locationImage = "LocationRed";

    if(item.availableUsers == this._totalUsers) attendeeImage = "AttendeeGreen";

    if(item.availableUsers < Math.ceil(this._totalUsers/2)) attendeeImage = "AttendeeRed";
    if(item.availableLocations >0) locationImage = "LocationGreen";

    var params = {
        id: id,
        item: item,
        timeLabel: AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT).format(new Date(item.startTime)),
        locationCountStr: item.availableLocations,
        attendeeImage: attendeeImage,
        locationImage: locationImage,
        totalUsers: this._totalUsers, 
        totalLocations: this._totalLocations
    };
    return AjxTemplate.expand("calendar.Appointment#TimeSuggestion", params);
};

ZmTimeSuggestionView.prototype._getHeaderList =
function() {
    this._headerItem = (new DwtListHeaderItem({field:ZmTimeSuggestionView.COL_NAME, text:'&nbsp;'}));
	return [
	    this._headerItem	
	];
};

ZmTimeSuggestionView.prototype._itemSelected =
function(itemDiv, ev) {
    ZmListView.prototype._itemSelected.call(this, itemDiv, ev);

    var item = this.getItemFromElement(itemDiv);
    if(item) {
        this._editView.setDate(new Date(item.startTime), new Date(item.endTime));
        //user clicked the link directly
        if (ev.target && (ev.target.className == "FakeAnchor" || ev.target.className == "ImgLocationGreen" || ev.target.className == "ImgLocationRed")) {
            var menu = this._createLocationsMenu(item);
            menu.popup(0, ev.docX, ev.docY);
        }
    }
};

ZmTimeSuggestionView.prototype.getToolTipContent =
function(ev) {
	var div = this.getTargetItemDiv(ev);
	if (!div) { return; }
	var id = ev.target.id || div.id;
	if (!id) { return ""; }

    var tooltip;
    var item = this.getItemFromElement(div);
    if(item) {
        var params = {item:item, ev:ev, div:div};
        tooltip = this._getToolTip(params);
    }
    return tooltip;
};

ZmTimeSuggestionView.prototype._getToolTip =
function(params) {
    var tooltip, target = params.ev.target, item = params.item;

    if(!item) return;

    //show all unavailable attendees on tooltip
    if(item.availableUsers < this._totalUsers) {

        //get unavailable attendees from available & total attendees list
        var freeUsers = [], busyUsers = [], attendee;
        for (var i = item.attendees.length; --i >=0;) {
            attendee = this._items[item.attendees[i]];
            freeUsers[attendee] = true;
        }

        var attendees = this._editView.getAttendees(ZmCalBaseItem.PERSON).getArray();
        var attEmail;

        var organizer = this._editView.getOrganizer();
        var orgEmail = organizer.getEmail();
        if (orgEmail instanceof Array) {
            orgEmail = orgEmail[0];
        }
        if(!freeUsers[orgEmail]) {
            busyUsers.push(organizer.getAttendeeText());
        }

        for (var i = 0; i < attendees.length; i++) {
            attendee = attendees[i];
            attEmail = attendees[i].getEmail();
            if (attEmail instanceof Array) {
                attEmail = attEmail[0];
            }
            if(!freeUsers[attEmail]) {
                busyUsers.push(attendee.getAttendeeText());
            }
        }

        if(busyUsers.length) tooltip = AjxTemplate.expand("calendar.Appointment#SuggestionTooltip", {attendees: busyUsers})
    }
    return tooltip;
};

//obsolete - will be removed as a part of clean up process
ZmTimeSuggestionView.prototype.switchLocationSelect =
function(item, id, ev) {
    var locId = id + "_loc";

    var locationC = document.getElementById(locId);
    if(!locationC) return;

    var roomsAvailable = (item.locations.length > 0);

    if(!this._locSelect && !roomsAvailable) {
        return;
    }

    if(roomsAvailable) locationC.innerHTML = "";

    if(!this._locSelect) {
        this._locSelect = new DwtSelect({parent:this, parentElement: locId});
        this._locSelect.addChangeListener(new AjxListener(this, this._locationListener));
        this._locSelect.dynamicButtonWidth();
    }else {
        if(roomsAvailable) this._locSelect.reparentHtmlElement(locId);
        this._locSelect.clearOptions();
        if(this._locSelect.itemId != id) this._restorePrevLocationInfo();
    }

    this._locSelect.itemId = id;
    this._locSelect.itemInfo = item;

    var location, name, locationObj;
    for (var i = item.locations.length; --i >=0;) {
        location = this._items[item.locations[i]];
        locationObj = this.parent.getLocationByEmail(location);
        name = location;
        if(locationObj) {
            name = locationObj.getAttr(ZmResource.F_locationName) || locationObj.getAttr(ZmResource.F_name);
        }
        this._locSelect.addOption(name, false, location);

        if(item.locations.length - i > 20) {
            this._locSelect.addOption(ZmMsg.showMore, false, ZmTimeSuggestionView.SHOW_MORE_VALUE);
            break;
        }
    }

    //user clicked the link directly
    if (ev.target && (ev.target.className == "FakeAnchor")) {
        this._locSelect.popup();        
    }

    this.handleLocationOverflow();
};

ZmTimeSuggestionView.prototype._createLocationsMenu =
function(item) {
    var menu = this._locationsMenu = new ZmPopupMenu(this, null, null, this._controller);  
    var listener = new AjxListener(this, this._locationsMenuListener);

    var location, name, locationObj;
    for (var i = item.locations.length; --i >=0;) {
        location = this._items[item.locations[i]];
        locationObj = this.parent.getLocationByEmail(location);
        name = location;
        if(locationObj) {
            name = locationObj.getAttr(ZmResource.F_name) || locationObj.getAttr(ZmResource.F_locationName);
        }

        var mi = menu.createMenuItem(location, {style:DwtMenuItem.RADIO_STYLE, text: name});
        mi.addSelectionListener(listener);
        mi.setData(ZmTimeSuggestionView._VALUE, location);

        if(item.locations.length - i > 20) {
            mi = menu.createMenuItem(ZmTimeSuggestionView.SHOW_MORE_VALUE, {style:DwtMenuItem.RADIO_STYLE, text: ZmMsg.showMore});
            mi.addSelectionListener(listener);
            mi.setData(ZmTimeSuggestionView._VALUE, ZmTimeSuggestionView.SHOW_MORE_VALUE);
            mi.setData(ZmTimeSuggestionView._ITEM_INFO, item);
            break;
        }
    }

    return menu;
};

ZmTimeSuggestionView.prototype._locationsMenuListener =
function(ev) {

    var id = ev.item.getData(ZmTimeSuggestionView._VALUE)

    if(id == ZmTimeSuggestionView.SHOW_MORE_VALUE) {
        var itemInfo = ev.item.getData(ZmTimeSuggestionView._ITEM_INFO);
        if(itemInfo) this.showMore(itemInfo);
        return;
    }

    var itemIndex = this._itemIndex[id];
    var location = this._items[itemIndex];
    if(location) {
        var locationObj = this.parent.getLocationByEmail(location);
        this._editView.updateLocation(locationObj);
    }
};

ZmTimeSuggestionView.prototype.handleLocationOverflow =
function() {
    var locTxt = this._locSelect.getText();
    if(locTxt && locTxt.length > 15) {
        locTxt = locTxt.substring(0, 15) + '...';
        this._locSelect.setText(locTxt);
    }
};

//obsolete - will be removed as a part of clean up process
ZmTimeSuggestionView.prototype._restorePrevLocationInfo =
function() {
    var prevId = this._locSelect.itemId;
    var prevItemDiv = document.getElementById(prevId);
    var prevItem = prevItemDiv ? this.getItemFromElement(prevItemDiv) : null;
    if(prevItem) {
        var prevLoc = document.getElementById(prevId + '_loc');
        prevLoc.innerHTML = '<span class="FakeAnchor">' + AjxMessageFormat.format(ZmMsg.availableRoomsCount, [prevItem.availableLocations]) + '</span>';
    }
};

ZmTimeSuggestionView.prototype._locationListener =
function() {
    var id = this._locSelect.getValue();

    if(id == ZmTimeSuggestionView.SHOW_MORE_VALUE) {
        this.showMore(this._locSelect.itemInfo);
        return;
    }

    var itemIndex = this._itemIndex[id];
    var location = this._items[itemIndex];
    if(location) {
        var locationObj = this.parent.getLocationByEmail(location);
        this._editView.updateLocation(locationObj);
    }
    this.handleLocationOverflow();
};

ZmTimeSuggestionView.prototype.setNoAttendeesHtml =
function() {
    this.removeAll();
    var	div = document.createElement("div");
    div.innerHTML = AjxTemplate.expand("calendar.Appointment#TimeSuggestion-NoAttendees");
    this._addRow(div);
};

ZmTimeSuggestionView.prototype._setNoResultsHtml =
function() {
	var	div = document.createElement("div");
	var subs = {
		message: this._getNoResultsMessage(),
		type: this.type,
        id: this.getHTMLElId()
	};
	div.innerHTML = AjxTemplate.expand("calendar.Appointment#TimeSuggestion-NoSuggestions", subs);
	this._addRow(div);

    //add event handlers for no results action link
    this._searchAllId = this.getHTMLElId() + "_showall";
    this._searchAllLink = document.getElementById(this._searchAllId);
    if(this._searchAllLink) {
        this._searchAllLink._viewId = AjxCore.assignId(this);
        Dwt.setHandler(this._searchAllLink, DwtEvent.ONCLICK, AjxCallback.simpleClosure(ZmTimeSuggestionView._onClick, this, this._searchAllLink));
    }
};

ZmTimeSuggestionView.prototype.setShowSuggestionsHTML =
function(date) {
    if(this._date && this._date == date) {
        return;
    }
    this._date = date;
    this.removeAll();
	var	div = document.createElement("div");
    var params = [
        '<span class="FakeAnchor" id="' + this.getHTMLElId() + '_showsuggestions">',
        '</span>',
        date
    ];
	var subs = {
		message: AjxMessageFormat.format(ZmMsg.showSuggestionsFor, params),
        id: this.getHTMLElId()
	};
	div.innerHTML = AjxTemplate.expand("calendar.Appointment#TimeSuggestion-ShowSuggestions", subs);
	this._addRow(div);

    //add event handlers for showing link
    this._suggestId = this.getHTMLElId() + "_showsuggestions";
    this._suggestLink = document.getElementById(this._suggestId);
    if(this._suggestLink) {
        this._suggestLink._viewId = AjxCore.assignId(this);
        Dwt.setHandler(this._suggestLink, DwtEvent.ONCLICK, AjxCallback.simpleClosure(ZmTimeSuggestionView._onClick, this, this._suggestLink));
    }
};

ZmTimeSuggestionView.prototype._getNoResultsMessage =
function() {
    var durationStr = AjxDateUtil.computeDuration(this._duration);
    return AjxMessageFormat.format(this._showOnlyGreenSuggestions ? ZmMsg.noGreenSuggestionsFound : ZmMsg.noSuggestionsFound, [this._startDate, durationStr]);
};

ZmTimeSuggestionView.prototype.showMore =
function(locationInfo) {

    var location, name, locationObj, items = new AjxVector();
    for (var i = locationInfo.locations.length; --i >=0;) {
        location = this._items[locationInfo.locations[i]];
        locationObj = this.parent.getLocationByEmail(location);
        if(locationObj) items.add(locationObj)
    }

    var attendeePicker = this._editView.getAttendeePicker(ZmCalBaseItem.LOCATION);
    attendeePicker.showSuggestedItems(items);    
};

ZmTimeSuggestionView.prototype._getHeaderColor = 
function(item) {
    var className = (item.availableUsers == this._totalUsers) ? "GreenLight" : "OrangeLight";
    if(item.availableUsers < Math.ceil(this._totalUsers/2)) className = "RedLight";
    return className;
};

ZmTimeSuggestionView.prototype._renderListSectionHdr =
function(hdrKey, item) {
    if(!this._sectionHeaderHtml[hdrKey]) {
        var htmlArr = [];
        var idx = 0;
        htmlArr[idx++] = "<table role='presentation' width=100% class='ZmTimeSuggestionView-Column ";
        htmlArr[idx++] =  this._getHeaderColor(item);        
        htmlArr[idx++] = "'><tr>";
        htmlArr[idx++] = "<td><div class='DwtListHeaderItem-label'>";
        htmlArr[idx++] = AjxMessageFormat.format(ZmMsg.availableCount, [item.availableUsers, this._totalUsers]);
        htmlArr[idx++] = "</div></td>";
        htmlArr[idx++] = "</tr></table>";
        this._sectionHeaderHtml[hdrKey] = htmlArr.join("");
   }

   return this._sectionHeaderHtml[hdrKey];
};

ZmTimeSuggestionView.prototype._getHeaderKey =
function(item) {
    return item.availableUsers + '-' + this._totalUsers;
}

ZmTimeSuggestionView._onClick =
function(el, ev) {
	var edv = AjxCore.objectWithId(el._viewId);
	if (edv) {
		edv._handleOnClick(el);
	}
};

ZmTimeSuggestionView.prototype._handleOnClick =
function(el) {
    if(!el || !el.id) return;
	// figure out which input field was clicked
	if (el.id == this._searchAllId) {
         this.parent.suggestAction(true, true);
	}else if (el.id == this._suggestId) {
         this.parent.overrideManualSuggestion(true);
         this.parent.suggestAction(true, false);
	}
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmLocationSuggestionView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a list view for location suggestions
 * @constructor
 * @class
 *
 *  @author Vince Bellows
 *
 * @param parent			[ZmScheduleAssistantView]	the smart scheduler view
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param apptEditView		[ZmApptEditView]	        the appt edit view
 */
ZmLocationSuggestionView = function(parent, controller, apptEditView, className) {
    ZmSuggestionsView.call(this, parent, controller, apptEditView, ZmId.VIEW_SUGGEST_LOCATION_PANE, false, className);
    this._warning = false;
    this._emailToDivIdMap = {};
};

ZmLocationSuggestionView.prototype = new ZmSuggestionsView;
ZmLocationSuggestionView.prototype.constuctor = ZmLocationSuggestionView;

ZmLocationSuggestionView.prototype.toString =
function() {
	return "ZmLocationSuggestionView";
}

ZmLocationSuggestionView.prototype._createItemHtml =
function (item) {
    var id = this.associateItemWithElement(item, null, null, null);

    var params = {
        id: id,
        locationName: item.name,
        locationDescription: item.description
    };
    return AjxTemplate.expand("calendar.Appointment#LocationSuggestion", params);
};

ZmLocationSuggestionView.prototype._getItemId =
function(item) {
    var id;
    if (item && item.email) {
        id = this._emailToDivIdMap[item.email];
        if (!id) {
            // No email->id mapping - first time accessed, so generate an id and create a mapping.
            // Return the id, which will be used as the id of the containing div.
            id = ZmListView.prototype._getItemId.call(this, item);
            this._emailToDivIdMap[item.email] = id;
        }
    }
    return id;
};

ZmLocationSuggestionView.prototype.set =
function(params) {
    this._emailToDivIdMap = {};
    this._items = params.locationInfo.locations;
    ZmListView.prototype.set.call(this, params.locationInfo.locations);
};

ZmLocationSuggestionView.prototype.handleLocationOverflow =
function() {
    var locTxt = this._locSelect.getText();
    if(locTxt && locTxt.length > 15) {
        locTxt = locTxt.substring(0, 15) + '...';
        this._locSelect.setText(locTxt);
    }
};

ZmLocationSuggestionView.prototype._itemSelected =
function(itemDiv, ev) {
    ZmListView.prototype._itemSelected.call(this, itemDiv, ev);

    var locationInfo = this.getItemFromElement(itemDiv);
    if(locationInfo != null) {
        var locationObj = locationInfo.locationObj;
        var locationStr = locationInfo.email;
        this._editView.updateLocation(locationObj, locationStr);
        this.setToolTipContent(null);
    }
};

ZmLocationSuggestionView.prototype._setNoResultsHtml =
function() {
    var	div = document.createElement("div");
    var elText = document.createTextNode(ZmMsg.noLocations);
    div.appendChild(elText);
    this._addRow(div);
};

ZmLocationSuggestionView.prototype.setWarning =
function(warning) {
    this._warning = warning;
}


ZmLocationSuggestionView.prototype._renderList =
function(list, noResultsOk, doAdd) {
    var warningHtml = "";
    if (this._warning) {
        warningHtml = AjxTemplate.expand("calendar.Appointment#LocationSuggestion-Warning");
    }
    ZmSuggestionsView.prototype._renderList.call(this, list, noResultsOk, doAdd, warningHtml);
}

ZmLocationSuggestionView.prototype.getToolTipContent =
function(ev) {
    var tooltip = "";
    var div = this.getTargetItemDiv(ev);
    if (div) {
        var item = this.getItemFromElement(div);
        if(item) {
            tooltip = AjxTemplate.expand("calendar.Appointment#LocationSuggestionTooltip",
                        {name:        item.name,
                         description: item.description,
                         contactMail: item.contactMail,
                         capacity:    item.capacity
                        });
        }
    }
    var consoleText = tooltip;
    if (!consoleText) {
        consoleText = "None";
    } else if(consoleText.length > 15) {
        consoleText = consoleText.substring(0, 15) + '...';
    }
    console.log("getToolTipContent, div = " + (div ? div.id : "null") + ", text = " + consoleText);
    return tooltip;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmTimeSuggestionPrefDialog")) {
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
 * @overview
 */

/**
 * Creates a time/location suggestion preference  dialog.
 * @class
 * This class represents a time/location preference dialog.
 *
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		DwtDialog
 */
ZmTimeSuggestionPrefDialog = function(parent, className) {

    this._prefs = {};
    this._prefFields = {};
    this._prefLoaded = false;

	className = className || "ZmTimeSuggestionPrefDialog";
	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.suggestionPreferences});

	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));

};

ZmTimeSuggestionPrefDialog.prototype = new DwtDialog;
ZmTimeSuggestionPrefDialog.prototype.constructor = ZmTimeSuggestionPrefDialog;

// Constants

ZmTimeSuggestionPrefDialog.META_DATA_KEY = "MD_LOCATION_SEARCH_PREF";
ZmTimeSuggestionPrefDialog.PREF_FIELDS = ["name", "site", "capacity", "building", "desc", "floor",
                                          "my_working_hrs_pref", "others_working_hrs_pref",
                                          "recurrenceSelect"];

// corresponding attributes for search command
ZmTimeSuggestionPrefDialog.SF_ATTR = {};
ZmTimeSuggestionPrefDialog.SF_ATTR["name"]		  = "fullName";
ZmTimeSuggestionPrefDialog.SF_ATTR["capacity"]	  = "zimbraCalResCapacity";
ZmTimeSuggestionPrefDialog.SF_ATTR["desc"]        = "description";
ZmTimeSuggestionPrefDialog.SF_ATTR["site"]		  = "zimbraCalResSite";
ZmTimeSuggestionPrefDialog.SF_ATTR["building"]	  = "zimbraCalResBuilding";
ZmTimeSuggestionPrefDialog.SF_ATTR["floor"]		  = "zimbraCalResFloor";

// search field compares ops - listed here if not substring ("has")
ZmTimeSuggestionPrefDialog.SF_OP = {};
ZmTimeSuggestionPrefDialog.SF_OP["capacity"]	= "ge";
ZmTimeSuggestionPrefDialog.SF_OP["floor"]		= "eq";

ZmTimeSuggestionPrefDialog.MY_WORKING_HOURS_FIELD = 'my_working_hrs_pref';
ZmTimeSuggestionPrefDialog.OTHERS_WORKING_HOURS_FIELD = 'others_working_hrs_pref';
ZmTimeSuggestionPrefDialog.RECURRENCE = 'recurrenceSelect';

ZmTimeSuggestionPrefDialog.CHECKBOX_FIELDS = {};
ZmTimeSuggestionPrefDialog.CHECKBOX_FIELDS[ZmTimeSuggestionPrefDialog.MY_WORKING_HOURS_FIELD]      = true;
ZmTimeSuggestionPrefDialog.CHECKBOX_FIELDS[ZmTimeSuggestionPrefDialog.OTHERS_WORKING_HOURS_FIELD]   = true;

ZmTimeSuggestionPrefDialog.DEFAULT_VAL = {};
ZmTimeSuggestionPrefDialog.DEFAULT_VAL[ZmTimeSuggestionPrefDialog.MY_WORKING_HOURS_FIELD]    = 'true';
ZmTimeSuggestionPrefDialog.DEFAULT_VAL[ZmTimeSuggestionPrefDialog.OTHERS_WORKING_HOURS_FIELD] = 'true';
ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE = 4;
ZmTimeSuggestionPrefDialog.MAX_NUM_RECURRENCE = 10;
ZmTimeSuggestionPrefDialog.DEFAULT_VAL[ZmTimeSuggestionPrefDialog.RECURRENCE] =
    ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE.toString();


// Public methods

ZmTimeSuggestionPrefDialog.prototype.toString =
function() {
	return "ZmTimeSuggestionPrefDialog";
};

ZmTimeSuggestionPrefDialog.prototype._handleOkButton =
function(event) {
    this.readPrefs();
    this.setSearchPreference();
    this.popdown();
    if(this._callback) this._callback.run();
};

ZmTimeSuggestionPrefDialog.prototype._handleCancelButton =
function(event) {
	this.popdown();
};



/**
 * Pops-up the properties dialog.
 *
 */
ZmTimeSuggestionPrefDialog.prototype.popup =
function(account) {
    this._account = account;
	DwtDialog.prototype.popup.call(this);
    this.getSearchPreference();

	var el = document.getElementById(this._htmlElId);
	var loc = Dwt.getLocation(el);
	if (loc.x < 0) {
		// For Bug 94520.  Japanese text is not getting formatted properly (it stays one very long string), until the
		// dialog was dragged.  Dragging runs the next line in its code (which places the left of the dialog on screen)
		// and it triggers the reformatting.
		// Don't try setting the location via the loc var to DwtDialog.popup - the DwtBaseDialog positioning 'corrects'
		// it and resets it to an offscreen value.
		el.style.left = "0px";
	}
};

ZmTimeSuggestionPrefDialog.prototype.popdown =
function() {
	DwtDialog.prototype.popdown.call(this);
};

ZmTimeSuggestionPrefDialog.prototype.getPrefLoaded =
function() {
    return this._prefLoaded;
}

ZmTimeSuggestionPrefDialog.prototype._getContentHtml =
function() {
    return AjxTemplate.expand("calendar.Appointment#TimeLocationPreference", {id: this.getHTMLElId()});
};

ZmTimeSuggestionPrefDialog.prototype.setContent =
function(text) {
	var d = this._getContentDiv();
	if (d) {
		d.innerHTML = text || "";
	}

    this._recurrenceSelect = new DwtSelect({id:this._htmlElId + "_recurrenceSelect",
                                parent:this, parentElement:(this._htmlElId + "_recurrence")});
    for (var i = 1; i <= ZmTimeSuggestionPrefDialog.MAX_NUM_RECURRENCE; i++) {
        this._recurrenceSelect.addOption(i.toString(), (i == 1), i);
    }


    this._dlgId = AjxCore.assignId(this);

    var element, id;
    for(var i=0; i<ZmTimeSuggestionPrefDialog.PREF_FIELDS.length; i++) {
        id = ZmTimeSuggestionPrefDialog.PREF_FIELDS[i];
        element = document.getElementById(this.getHTMLElId() + "_" + id);
        if (element) {
            this._prefFields[id] = element;
            this._prefs[id] = this.getPreferenceFieldValue(id);
        }
    }
};

ZmTimeSuggestionPrefDialog.prototype.getPreference =
function(id) {
    return (this._prefs[id] != null) ? this._prefs[id] : ZmTimeSuggestionPrefDialog.DEFAULT_VAL[id];
};

ZmTimeSuggestionPrefDialog.prototype.setCallback =
function(callback) {
    this._callback = callback;
};

ZmTimeSuggestionPrefDialog.prototype.readPrefs =
function(text) {
    var field;
    for(var id in this._prefFields) {
        this._prefs[id] = this.getPreferenceFieldValue(id)
    }
};

ZmTimeSuggestionPrefDialog.prototype.getPreferenceFieldValue =
function(id) {
    if (id == "recurrenceSelect") {
        return this._recurrenceSelect.getValue();
    } else {
        var field = this._prefFields[id];
        if(!field) return;

        if(ZmTimeSuggestionPrefDialog.CHECKBOX_FIELDS[id]){
            return field.checked ? 'true' : 'false';
        }else {
            return field.value;
        }
    }
};

ZmTimeSuggestionPrefDialog.prototype.setPreferenceFieldValue =
function(id, value) {
    if (id == "recurrenceSelect") {
       this._recurrenceSelect.setSelectedValue(value);
    } else {
        var field = this._prefFields[id];
        if(!field) return;

        if(ZmTimeSuggestionPrefDialog.CHECKBOX_FIELDS[id]){
            field.checked = (value == 'true');
        }else {
            field.value = value || "";
        }
    }
};

ZmTimeSuggestionPrefDialog.prototype.getSearchPreference =
function(account, prefSearchCallback) {
    var md = new ZmMetaData(account || this._account);
    var callback = new AjxCallback(this, this.processSearchPreference, [prefSearchCallback]);
    md.get(ZmTimeSuggestionPrefDialog.META_DATA_KEY, null, callback);
};

ZmTimeSuggestionPrefDialog.prototype.processSearchPreference =
function(prefSearchCallback, metadataResponse) {
    this._prefs = {};

    var objPrefs = metadataResponse.getResponse().BatchResponse.GetMailboxMetadataResponse[0].meta[0]._attrs;
    for (name in objPrefs) {
        if(name && objPrefs[name]) {
            this._prefs[name] = objPrefs[name];
            this.setPreferenceFieldValue(name, this._prefs[name]);
        }
    }

    //set default value for the preferences
    for(var id in ZmTimeSuggestionPrefDialog.DEFAULT_VAL) {
        if(!this._prefs[id]) {
            this.setPreferenceFieldValue(id, ZmTimeSuggestionPrefDialog.DEFAULT_VAL[id]);            
        }
    }

    this._prefLoaded = true;
    if(prefSearchCallback) prefSearchCallback.run();
};

ZmTimeSuggestionPrefDialog.prototype.setSearchPreference =
function() {
    var md = new ZmMetaData(this._account);
    var newPrefs = {};
    for(var id in this._prefs) {
        if(this._prefs[id] != "") newPrefs[id] = this._prefs[id];
    }
    return md.set(ZmTimeSuggestionPrefDialog.META_DATA_KEY, newPrefs);
};

ZmTimeSuggestionPrefDialog.isSearchCondition =
function(id) {
    return Boolean(ZmTimeSuggestionPrefDialog.SF_ATTR[id]);
};

ZmTimeSuggestionPrefDialog.prototype.handleRoomCheckbox =
function() {
    this.enableLocationFields(true);
};

ZmTimeSuggestionPrefDialog.prototype.enableLocationFields =
function(enable) {
    for(var id in ZmTimeSuggestionPrefDialog.SF_ATTR) {
        if(!this._prefFields[id]) continue;
        this._prefFields[id].disabled = !enable;
    }
};

ZmTimeSuggestionPrefDialog._handleRoomCheckbox =
function(ev) {
	var el = DwtUiEvent.getTarget(ev);
	var dlg = AjxCore.objectWithId(el._dlgId);
	if (!dlg) { return; }
    dlg.handleRoomCheckbox();
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmResolveLocationConflictDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Dialog containing the ZmResolveLocationView list.
 * @constructor
 * @class
 *
 *  @author Vince Bellows
 *
 * @param controller		[ZmApptComposeController]	the appt compose controller
 * @param composeView		[ZmApptEditView]	        the appt edit view
 * @param okCallback		[function]	                callback upon OK
 * @param assistantView		[ZmScheduleAssistantView]	Assistant that provides location FB info
 *
 */

ZmResolveLocationConflictDialog = function(controller, composeView, okCallback, assistantView) {
    this._controller = controller;
    this._composeView = composeView;

    this._okCallback = okCallback;
    // The location assistant view associated with the parent appt view will
    // provide the set of viable locations for each conflict date
    this._assistantView = assistantView;

	DwtDialog.call(this, {parent:appCtxt.getShell(),
        title:ZmMsg.resolveLocationConflicts});

	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));
};

ZmResolveLocationConflictDialog.prototype = new DwtDialog;
ZmResolveLocationConflictDialog.prototype.constructor = ZmResolveLocationConflictDialog;


ZmResolveLocationConflictDialog.prototype.toString =
function() {
	return "ZmResolveLocationConflictDialog";
};

// For each conflict dateTime, find the set of available locations.  These will be used to
// populate the alternate location pulldowns
ZmResolveLocationConflictDialog.prototype._determineAlternateLocations =
function(params) {
    var addr;
    var durationInfo;
    var locInfo;
    var resolveLocInfo;

    this._resolveLocList = new AjxVector();

    for (var i = 0; i < this._inst.length; i++) {
        if (this._inst[i].usr) {
            // A Conflict exists - add an entry to the resolution list
            resolveLocInfo = {};
            resolveLocInfo.originalLocation = ZmResolveLocationView.NO_SELECTION;
            resolveLocInfo.enabled = true;
            var exceptionLoc = this._locationExceptions[this._inst[i].s];
            if (exceptionLoc) {
                // Stored value (from either an existing exception in the DB or a
                // previous use of this dialog).  Save it to use for indicating the
                // selected location in the alternate locations pulldown.
                var locationEmails = [];
                for (var j = 0; j < exceptionLoc.length; j++) {
                    locationEmails.push(exceptionLoc[j].getEmail());
                }
                if (locationEmails.length > 1) {
                    // Multi select not currently supported.  If an exception was created
                    // outside this dialog specifying multiple locations, just display it
                    // (i.e. do not create a pulldown, just create a label)
                    resolveLocInfo.originalLocation  = locationEmails.join(',');
                    resolveLocInfo.enabled = false;
                } else if (locationEmails.length == 1) {
                    resolveLocInfo.originalLocation = locationEmails[0];
                }
             }

            durationInfo = {};
            durationInfo.startTime = this._inst[i].s;
            durationInfo.endTime   = this._inst[i].s + this._inst[i].dur;
            durationInfo.duration  = this._inst[i].dur;

            params.duration = durationInfo
            resolveLocInfo.inst = this._inst[i];

            // Get locations that are available for this conflict's startTime to endTime
            locInfo = this._assistantView.computeLocationAvailability(durationInfo, params);
            resolveLocInfo.alternateLocationInfo = locInfo.locations;
            // Add to the list for display by the ZmResolveLocationView
            this._resolveLocList.add(resolveLocInfo);
        }
    }
    params.list = this._resolveLocList;
    this._resolveLocationView.set(params);

};

ZmResolveLocationConflictDialog.prototype._handleOkButton =
function(event) {
    var alteredLocations   = {};
    var locationExceptions = {};
    var location;
    var newLocation;
    var resolveInfo;

    for (var i = 0; i < this._resolveLocList.size(); i++) {
        resolveInfo = this._resolveLocList.get(i);
        if (resolveInfo.enabled) {
            // Get the selected alternate (if any)
            newLocation = this._resolveLocationView.getAlternateLocation(i);
        } else {
            // Pulldown was not used due to multiple locations already set for entry
            newLocation = resolveInfo.originalLocation;
        }
        if (newLocation != ZmResolveLocationView.NO_SELECTION) {
            location = this._composeView.getAttendeesFromString(ZmCalBaseItem.LOCATION, newLocation, false);
            if (location) {
                locationExceptions[resolveInfo.inst.s] = location.getArray();
            }
            if (newLocation != resolveInfo.originalLocation) {
                // Location changed - pass to caller to apply upon Save
                alteredLocations[resolveInfo.inst.s] = locationExceptions[resolveInfo.inst.s];
            }
        }

    }

    this.popdown();
    if(this._okCallback) this._okCallback.run(locationExceptions, alteredLocations);

};

ZmResolveLocationConflictDialog.prototype._handleCancelButton =
function(event) {
	this.popdown();
};

ZmResolveLocationConflictDialog.prototype.popup =
function(appt, inst, locationExceptions) {
    this._appt = appt;
    this._inst = inst ? inst : [];

    // Existing set of location exceptions - either persisted to the DB, or specified
    // by a previous use of this dialog.
    this._locationExceptions = locationExceptions ? locationExceptions : {};

    DwtDialog.prototype.popup.call(this);
    this._resolveLocationView.setLoadingHtml();

    // Use the assistantView to get sets of locations for each conflict date.
    // These will be used to populate the alternative location dropdown.
    var fbEndTime = 0;
    if (this._inst.length > 0) {
        var inst = this._inst[this._inst.length-1];
        fbEndTime = inst.s + inst.dur;
        this._assistantView.getLocationFBInfo(
            this._determineAlternateLocations, this, fbEndTime);
    }
};

ZmResolveLocationConflictDialog.prototype.setContent =
function(text) {
	var contentDiv = this._getContentDiv();

    this._resolveLocationView = new ZmResolveLocationView(
        this, this._controller, this._apptView);
    this._resolveLocationView.reparentHtmlElement(contentDiv);


};

ZmResolveLocationConflictDialog.prototype.cleanup =
function() {
    if(this._resolveLocationView) this._resolveLocationView.removeAll();
};



}
if (AjxPackage.define("zimbraMail.calendar.view.ZmResolveLocationView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * View that displays the location conflicts and possible alternate locations
 * @constructor
 * @class
 *
 *  @author Vince Bellows
 *
 * @param parent        [ZmResolveLocationConflictDialog]   parent dialog
 * @param controller	[ZmApptComposeController]	        compose controller
 * @param apptEditView	[ZmApptEditView]	                the appt edit view
 * @param id		    [string]	                        id for the view
 *
 */
ZmResolveLocationView = function(parent, controller, apptEditView, id ) {
    if (arguments.length == 0) { return; }


    var headerList = [{_field:"date",     _width:150, _label:ZmMsg.date},
                      {_field:"location", _width:200, _label:ZmMsg.location}];

    var params = {parent: parent, posStyle: DwtControl.RELATIVE_STYLE, view: id,
                  className:"ZmResolveConflictList DwtListView"};
	DwtListView.call(this, params);

	this._controller = controller;
	this._editView = apptEditView;

	this._rendered = false;
    this._normalClass = DwtListView.ROW_CLASS;
    this.setMultiSelect(false);

};

ZmResolveLocationView.prototype = new DwtListView;
ZmResolveLocationView.prototype.constructor = ZmResolveLocationView;

ZmResolveLocationView.NO_SELECTION = "NONE";

ZmResolveLocationView.prototype.toString =
function() {
	return "ZmResolveLocationView";
}

ZmResolveLocationView.prototype.set =
function(params) {
    DwtListView.prototype.set.call(this, params.list);
};

ZmResolveLocationView.prototype._setNoResultsHtml =
function() {
    var	div = document.createElement("div");
    var elText = document.createTextNode(ZmMsg.noConflicts);
    div.appendChild(elText);
    this._addRow(div);
};

ZmResolveLocationView.prototype.setLoadingHtml =
function() {
    this.removeAll();
    var	div = document.createElement("div");
    div.innerHTML = AjxTemplate.expand("calendar.Appointment#AlternateLocation-Loading");
    this._addRow(div);
};

ZmResolveLocationView.prototype._renderList =
function(list, noResultsOk, doAdd) {
    var params = {};
    var htmlArr = [];
    // Add the header
    htmlArr.push(AjxTemplate.expand("calendar.Appointment#ResolveLocationConflictHeader", params));
    var item;

    // Add the list items, consisting of the date of the conflict, and a select dropdown
    // showing the alternate location suggestions
    this._selectLocation = [];
	if (list instanceof AjxVector && list.size()) {
		var size = list.size();
        var ids = [];
        var even = true;
        // Add the rows, one per conflict date
		for (var i = 0; i < size; i++) {
			item = list.get(i);

            var id = this.associateItemWithElement(item, null, null, null);
            ids.push(id);

            var dateStr = AjxDateUtil.simpleComputeDateStr(new Date(item.inst.s));
            params = {
                id:        id,
                date:      dateStr,
                className: even ? "ZmResolveLocationConflictEven" : "ZmResolveLocationConflictOdd"
            };
            even = !even;
            htmlArr.push(AjxTemplate.expand("calendar.Appointment#ResolveLocationConflict", params));
		}
		if (htmlArr.length) {
			this._parentEl.innerHTML = htmlArr.join("");
		}

        // Create the pulldowns that provide the possible valid alternate locations
        for (var i = 0; i < ids.length; i++) {
            item = list.get(i);
            var el = document.getElementById(ids[i] + "_alternatives");
            if (item.enabled) {
                var select = this._createSelectionDropdown(el, item);
                this._selectLocation.push(select);
            } else {
                // Multiple locations already specified - not supported for now, just display
                el.innerHTML = AjxStringUtil.htmlEncode(item.originalLocation);
            }
        }

	} else if (!noResultsOk) {
		this._setNoResultsHtml();
	}
};

ZmResolveLocationView.prototype._createSelectionDropdown =
function(el, listItem) {
    var select = new DwtSelect({parent:this, congruent:true,
        posStyle:DwtControl.RELATIVE_STYLE});
    select.reparentHtmlElement(el);
    var options = listItem.alternateLocationInfo;
    select.addOption(ZmMsg.selectAlternateLocation, false,
        ZmResolveLocationView.NO_SELECTION);
    // Add each of the valid alternate locations
    for (var i = 0; i < options.size(); i++) {
        var locInfo = options.get(i);
        var name = this.formatLocation(locInfo.name);
        select.addOption(name, (listItem.originalLocation == locInfo.email), locInfo.email);
    }
    // Add <HR> and 'No Location'
    select.addHR();
    select.addOption(ZmMsg.noLocation, (listItem.originalLocation == ZmMsg.noLocation),
        null, null, "ZmResolveNoLocationSelect ZWidgetTitle");
    return select;
}

ZmResolveLocationView.prototype.formatLocation =
function(name) {
    // Limit the alternate location text to 40 characters
    if(name && name.length > 40) {
        name = name.substring(0, 40) + '...';
    }
    return name;
};

ZmResolveLocationView.prototype.getAlternateLocation =
function(index) {
    var location = null;
    var select = this._selectLocation[index];
    if (select) {
        location = select.getValue();
    }
    return location;
}

ZmResolveLocationView.prototype._itemSelected =
function(itemDiv, ev) {
}
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmAttendeePicker")) {
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
 * Creates a new dialog that can be used to choose attendees, locations, or equipment.
 * @constructor
 * @class
 * This class allows the user to search for attendees, locations, or
 * equipment. It presents a chooser which allows the user to select items from
 * the search results.
 *
 * @author Sathishkumar
 *
 * @param {DwtComposite}	editView		the edit view that pops up this dialog
 * @param {Hash}	attendees		the attendees/locations/equipment
 * @param {ZmApptComposeController}	controller	the appt compose controller
 * @param {constant}	type			the chooser page type
 * 
 * @extends		DwtTabViewPage
 */
ZmAttendeePicker = function(editView, attendees, controller, type, dateInfo) {

    DwtDialog.call(this, {
        parent: appCtxt.getShell(),
        title:  ZmAttendeePicker.TOP_LEGEND[type],
        id:     [ 'ZmAttendeePicker', type ].join('_')
    });

	this._attendees = attendees;
	this._controller = controller;
	this._editView = editView;
	this.type = type;
	this._dateInfo = dateInfo;

	this._offset = 0;
	this._rendered = false;
	this._isClean = true;
	this._searchFields = {};
	this._searchFieldIds = {};
	this._keyPressCallback = new AjxCallback(this, this._searchButtonListener);
	this._kbMgr = appCtxt.getKeyboardMgr();    
    this._list = new AjxVector();
    this.showSelect = false;
};

ZmAttendeePicker.COL_LABEL = {};
ZmAttendeePicker.COL_LABEL[ZmItem.F_FOLDER]		= "folder";
ZmAttendeePicker.COL_LABEL[ZmItem.F_NAME]		= "_name";
ZmAttendeePicker.COL_LABEL[ZmItem.F_EMAIL]		= "email";
ZmAttendeePicker.COL_LABEL[ZmItem.F_WORK_PHONE]	= "AB_FIELD_workPhone";
ZmAttendeePicker.COL_LABEL[ZmItem.F_HOME_PHONE]	= "AB_FIELD_homePhone";
ZmAttendeePicker.COL_LABEL[ZmItem.F_LOCATION]	= "location";
ZmAttendeePicker.COL_LABEL[ZmItem.F_CONTACT]	= "contact";
ZmAttendeePicker.COL_LABEL[ZmItem.F_CAPACITY]	= "capacity";
ZmAttendeePicker.COL_LABEL["FBSTATUS"]          = "status";

ZmAttendeePicker.COL_IMAGE = {};
ZmAttendeePicker.COL_IMAGE[ZmItem.F_NOTES]		= "Page";

ZmAttendeePicker.COL_WIDTH = {};
ZmAttendeePicker.COL_WIDTH[ZmItem.F_FOLDER]		= ZmMsg.COLUMN_WIDTH_FOLDER_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_NAME]		= ZmMsg.COLUMN_WIDTH_NAME_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_EMAIL]		= null;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_WORK_PHONE]	= ZmMsg.COLUMN_WIDTH_WORK_PHONE_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_HOME_PHONE]	= ZmMsg.COLUMN_WIDTH_HOME_PHONE_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_LOCATION]	= null;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_CONTACT]	= ZmMsg.COLUMN_WIDTH_CONTACT_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_CAPACITY]	= ZmMsg.COLUMN_WIDTH_CAPACITY_NA;
ZmAttendeePicker.COL_WIDTH[ZmItem.F_NOTES]		= ZmMsg.COLUMN_WIDTH_NOTES_NA;
ZmAttendeePicker.COL_WIDTH["FBSTATUS"]			= ZmMsg.COLUMN_WIDTH_FBSTATUS_NA;

ZmAttendeePicker.COLS = {};
ZmAttendeePicker.COLS[ZmCalBaseItem.PERSON]		= [ZmItem.F_FOLDER, ZmItem.F_NAME, ZmItem.F_EMAIL, ZmItem.F_WORK_PHONE, ZmItem.F_HOME_PHONE, "FBSTATUS"];
ZmAttendeePicker.COLS[ZmCalBaseItem.LOCATION]	= [ZmItem.F_NAME, ZmItem.F_LOCATION, ZmItem.F_CONTACT, ZmItem.F_CAPACITY, "FBSTATUS", ZmItem.F_NOTES];
ZmAttendeePicker.COLS[ZmCalBaseItem.EQUIPMENT]	= [ZmItem.F_NAME, ZmItem.F_LOCATION, ZmItem.F_CONTACT, "FBSTATUS", ZmItem.F_NOTES];

// search fields
(function () {
	var i = 1;
	ZmAttendeePicker.SF_ATT_NAME	= i++;
	ZmAttendeePicker.SF_NAME		= i++;
	ZmAttendeePicker.SF_SOURCE		= i++;
	ZmAttendeePicker.SF_CAPACITY	= i++;
	ZmAttendeePicker.SF_DESCRIPTION	= i++;
	ZmAttendeePicker.SF_SITE		= i++;
	ZmAttendeePicker.SF_BUILDING	= i++;
	ZmAttendeePicker.SF_FLOOR		= i++;
})();

// search field labels
ZmAttendeePicker.SF_LABEL = {};
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_ATT_NAME]	= "find";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_NAME]		= "_name";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_SOURCE]	= "source";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_CAPACITY]	= "minimumCapacity";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_DESCRIPTION]	= "description";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_CONTACT]	= "contact";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_SITE]		= "site";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_BUILDING]	= "building";
ZmAttendeePicker.SF_LABEL[ZmAttendeePicker.SF_FLOOR]	= "floor";

// corresponding attributes for search command
ZmAttendeePicker.SF_ATTR = {};
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_NAME]		  = "fullName";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_CAPACITY]	  = "zimbraCalResCapacity";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_DESCRIPTION] = "description";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_CONTACT]	  = "zimbraCalResContactName";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_SITE]		  = "zimbraCalResSite";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_BUILDING]	  = "zimbraCalResBuilding";
ZmAttendeePicker.SF_ATTR[ZmAttendeePicker.SF_FLOOR]		  = "zimbraCalResFloor";

// search field compares ops - listed here if not substring ("has")
ZmAttendeePicker.SF_OP = {};
ZmAttendeePicker.SF_OP[ZmAttendeePicker.SF_CAPACITY]	= "ge";
ZmAttendeePicker.SF_OP[ZmAttendeePicker.SF_FLOOR]		= "eq";

ZmAttendeePicker.ATTRS = {};
ZmAttendeePicker.ATTRS[ZmCalBaseItem.LOCATION] =
	["fullName", "email", "zimbraCalResLocationDisplayName",
	 "zimbraCalResCapacity", "zimbraCalResContactEmail", "description", "zimbraCalResType"];
ZmAttendeePicker.ATTRS[ZmCalBaseItem.EQUIPMENT] =
	["fullName", "email", "zimbraCalResLocationDisplayName",
	 "zimbraCalResContactEmail", "description", "zimbraCalResType"];

ZmAttendeePicker.SEARCH_FIELDS = {};
ZmAttendeePicker.SEARCH_FIELDS[ZmCalBaseItem.PERSON] =
	[ZmAttendeePicker.SF_ATT_NAME, ZmAttendeePicker.SF_SOURCE];
ZmAttendeePicker.SEARCH_FIELDS[ZmCalBaseItem.LOCATION] =
	[ZmAttendeePicker.SF_NAME, ZmAttendeePicker.SF_SITE,
	 ZmAttendeePicker.SF_CAPACITY, ZmAttendeePicker.SF_BUILDING,
	 ZmAttendeePicker.SF_DESCRIPTION, ZmAttendeePicker.SF_FLOOR];
ZmAttendeePicker.SEARCH_FIELDS[ZmCalBaseItem.EQUIPMENT] =
	[ZmAttendeePicker.SF_NAME, ZmAttendeePicker.SF_SITE,
	 ZmAttendeePicker.SF_DESCRIPTION, ZmAttendeePicker.SF_BUILDING,
	 ZmAttendeePicker.SF_CONTACT, ZmAttendeePicker.SF_FLOOR];

ZmAttendeePicker.SETTINGS_SEARCH_FIELDS = {};

ZmAttendeePicker.SORT_BY = {};
ZmAttendeePicker.SORT_BY[ZmCalBaseItem.PERSON]				= ZmSearch.NAME_ASC;
ZmAttendeePicker.SORT_BY[ZmCalBaseItem.LOCATION]			= ZmSearch.NAME_ASC;
ZmAttendeePicker.SORT_BY[ZmCalBaseItem.EQUIPMENT]			= ZmSearch.NAME_ASC;

ZmAttendeePicker.TOP_LEGEND = {};
ZmAttendeePicker.TOP_LEGEND[ZmCalBaseItem.PERSON]			= ZmMsg.findAttendees;
ZmAttendeePicker.TOP_LEGEND[ZmCalBaseItem.LOCATION]			= ZmMsg.findLocations;
ZmAttendeePicker.TOP_LEGEND[ZmCalBaseItem.EQUIPMENT]		= ZmMsg.findEquipment;

ZmAttendeePicker.SUGGEST_LEGEND = {};
ZmAttendeePicker.SUGGEST_LEGEND[ZmCalBaseItem.PERSON]			= ZmMsg.suggestedAttendees;
ZmAttendeePicker.SUGGEST_LEGEND[ZmCalBaseItem.LOCATION]			= ZmMsg.suggestedLocations;
ZmAttendeePicker.SUGGEST_LEGEND[ZmCalBaseItem.EQUIPMENT]		= ZmMsg.suggestedResources;

ZmAttendeePicker.BOTTOM_LEGEND = {};
ZmAttendeePicker.BOTTOM_LEGEND[ZmCalBaseItem.PERSON]		= ZmMsg.apptAttendees;
ZmAttendeePicker.BOTTOM_LEGEND[ZmCalBaseItem.LOCATION]		= ZmMsg.apptLocations;
ZmAttendeePicker.BOTTOM_LEGEND[ZmCalBaseItem.EQUIPMENT]		= ZmMsg.apptEquipment;

// images for the bottom fieldset legend
ZmAttendeePicker.ICON = {};
ZmAttendeePicker.ICON[ZmCalBaseItem.PERSON]					= appContextPath+"/img/hiRes/calendar/ApptMeeting.gif";
ZmAttendeePicker.ICON[ZmCalBaseItem.LOCATION]				= appContextPath+"/img/hiRes/calendar/Location.gif";
ZmAttendeePicker.ICON[ZmCalBaseItem.EQUIPMENT]				= appContextPath+"/img/hiRes/calendar/Resource.gif";

ZmAttendeePicker.CHOOSER_HEIGHT = 300;


ZmAttendeePicker.prototype = new DwtDialog;
ZmAttendeePicker.prototype.constructor = ZmAttendeePicker;

ZmAttendeePicker.prototype.toString =
function() {
	return "ZmAttendeePicker";
};

/**
 * Done choosing addresses, add them to the appt compose view.
 *
 * @private
 */
ZmAttendeePicker.prototype._okButtonListener =
function(ev) {
	var data = this._chooser.getItems();
	DwtDialog.prototype._buttonListener.call(this, ev, [data]);
};

/**
 * Call custom popdown method.
 *
 * @private
 */
ZmAttendeePicker.prototype._cancelButtonListener =
function(ev) {
	DwtDialog.prototype._buttonListener.call(this, ev);
	this.popdown();
};

ZmAttendeePicker.prototype.showSuggestedItems =
function(items) {
    this.popup(true);
    this._fillFreeBusy(items, AjxCallback.simpleClosure(function(items) {
		this._chooser.setItems(items);
	}, this));
};

ZmAttendeePicker.prototype.setLabel =
function(title) {
    this.setTitle(title);
    var sourceTitle = document.getElementById(this._searchTableId + '_legend');
    if(sourceTitle) sourceTitle.innerHTML = title;
};

ZmAttendeePicker.prototype.popup =
function(showSuggestions) {

    this.setLabel(showSuggestions ? ZmAttendeePicker.SUGGEST_LEGEND[this.type] : ZmAttendeePicker.TOP_LEGEND[this.type]);    

    DwtDialog.prototype.popup.call(this);
    
	// Update FB status if the time is changed
    this._setAttendees();

	if (this.type == ZmCalBaseItem.EQUIPMENT && this._dateInfo.isTimeModified) {
		this.refreshResourcesFBStatus();
		this._dateInfo.isTimeModified = false;
	}


};

ZmAttendeePicker.prototype.refreshResourcesFBStatus =
function() {
	var items = this._chooser.getItems();
	this._fillFreeBusy(items, AjxCallback.simpleClosure(function(items) {
		this._chooser.setItems(items);
	}, this));
};

ZmAttendeePicker.prototype.initialize =
function(appt, mode, isDirty, apptComposeMode) {
	this._appt = appt;
	this._isDirty = isDirty;
	this._isForward = (apptComposeMode == ZmApptComposeView.FORWARD);
	this._isProposeTime = (apptComposeMode == ZmApptComposeView.PROPOSE_TIME);
	this._list.removeAll();

	if (this._rendered) {
		this._chooser.reset();
	} else {
        this._loadSettings();
		this._createPageHtml();
		this._addDwtObjects();
		this._rendered = true;
	}
    if (appCtxt.isOffline && this.type == ZmCalBaseItem.PERSON) {
        this.setSelectVisibility();
    }
	this._resetSelectDiv();

    // init listeners
    this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
    this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._cancelButtonListener));    
};

ZmAttendeePicker.prototype.resize =
function() {
	if (!this._rendered) { return; }
    this._chooser.resize(Dwt.DEFAULT, ZmAttendeePicker.CHOOSER_HEIGHT);
};

ZmAttendeePicker.prototype.cleanup =
function() {
	this._chooser.reset();

	if (this._prevButton && this._nextButton) {
		this._prevButton.setEnabled(false);
		this._nextButton.setEnabled(false);
	}
	this._isClean = true;
	this._offset = 0;

	for (var i in this._searchFieldIds) {
		var id = this._searchFieldIds[i];
		var el = document.getElementById(id);
		if (el && el.value) {
			el.value = "";
		}
	}
};

ZmAttendeePicker.prototype.isValid =
function() {
	return true;
};

/**
 * Enables/disables multiple locations.
 *
 * @param {Boolean}	enable		if <code>true</code>, allow multiple locations
 */
ZmAttendeePicker.prototype.enableMultipleLocations =
function(enable) {
	if (this._multLocsCheckboxId) {
		var cb = document.getElementById(this._multLocsCheckboxId);
		if (cb.checked != enable) {
			cb.checked = enable;
			this._chooser.setSelectStyle(cb.checked ? DwtChooser.MULTI_SELECT : DwtChooser.SINGLE_SELECT, true);
            this.resize(); // force resize to adjust chooser layout
		}
	}
};

ZmAttendeePicker.prototype._loadSettings = function(){

    if (!appCtxt.get(ZmSetting.CAL_SHOW_RESOURCE_TABS)) {
		ZmAttendeePicker.TOP_LEGEND[ZmCalBaseItem.PERSON]			= ZmMsg.findAttendeesRooms;
		ZmAttendeePicker.BOTTOM_LEGEND[ZmCalBaseItem.PERSON]		= ZmMsg.apptAttendeesRooms;
	}

    if (this.type === ZmCalBaseItem.LOCATION) {
        var fields_disabled = appCtxt.get(ZmSetting.CAL_LOCATION_FIELDS_DISABLED);
        if (fields_disabled) {
            fields_disabled = fields_disabled.split(",");
            var fields_disabled_mapping = {
                CAPACITY : ZmAttendeePicker["SF_CAPACITY"],
                DESCRIPTION : ZmAttendeePicker["SF_DESCRIPTION"],
                SITE : ZmAttendeePicker["SF_SITE"],
                BUILDING : ZmAttendeePicker["SF_BUILDING"],
                FLOOR : ZmAttendeePicker["SF_FLOOR"]
            };
            ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] = [];
            //hash map of disabled fields
            var isFieldDisabled = {};
            for ( var i = 0; i < fields_disabled.length; i++ ) {
                if ( fields_disabled_mapping.hasOwnProperty(fields_disabled[i]) ) {
                    isFieldDisabled[ fields_disabled_mapping[fields_disabled[i]] ] = true;
                }
            }
            var fields = ZmAttendeePicker.SEARCH_FIELDS[this.type];
            for ( var i = 0; i < fields.length; i++ ) {
                if(!isFieldDisabled[fields[i]]) {
		            ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type].push(fields[i]);
    	        }
            }
        }
    }
};

ZmAttendeePicker.prototype._createPageHtml =
function() {
	this._searchTableId	= Dwt.getNextId();

	this._chooserSourceListViewDivId	= Dwt.getNextId();
	this._chooserButtonsDivId	= Dwt.getNextId();
	this._chooserTargetListViewDivId	= Dwt.getNextId();

	var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
	for (var i = 0; i < fields.length; i++) {
		this._searchFieldIds[fields[i]] = Dwt.getNextId();
	}

	var html = [];
	var i = 0;

	html[i++] = "<fieldset";
	if (AjxEnv.isMozilla) {
		html[i++] = " style='border:1px dotted #555'";
	}
	html[i++] = "><legend style='color:#555555' id='" + this._searchTableId + "_legend'>";
	html[i++] = ZmAttendeePicker.TOP_LEGEND[this.type];
	html[i++] = "</legend>";

	html[i++] = "<div style='margin-top:10px' id='";
	html[i++] = this._searchTableId;
	html[i++] = "'>";

	html[i++] = "<table role='presentation' class='ZPropertySheet' cellspacing='6'><tr>";

	for (var j = 0; j < fields.length; j++) {
		var isEven = ((j % 2) == 0);
		if (isEven) {
			html[i++] = "<tr>";
		}
		var sf = fields[j];
        var addButton = (j == 1 || (this.type == ZmCalBaseItem.LOCATION && j === 0 && j === fields.length-1 ) );
		var addMultLocsCheckbox = (this.type == ZmCalBaseItem.LOCATION && j == fields.length - 1);
		i = this._getSearchFieldHtml(sf, html, i, addButton, addMultLocsCheckbox);
		if (!isEven || j == fields.length - 1) {
            this._prevButtonId = Dwt.getNextId();
            this._nextButtonId = Dwt.getNextId();
            html[i++] = "<td>&nbsp;</td>";
            html[i++] = "<td id='";
            html[i++] = this._prevButtonId;
            html[i++] = "'></td><td id='";
            html[i++] = this._nextButtonId;
            html[i++] = "'></td>";
			html[i++] = "</tr>";
		}
	}

	html[i++] = "</table></div>";

	// placeholder for the chooser's source list view
	html[i++] = "<div id='";
	html[i++] = this._chooserSourceListViewDivId;
	html[i++] = "'></div>";
	html[i++] = "</fieldset>";

	// placeholder for the chooser's buttons
	html[i++] = "<div id='";
	html[i++] = this._chooserButtonsDivId;
	html[i++] = "'></div>";

	html[i++] = "<fieldset";
	if (AjxEnv.isMozilla) {
		html[i++] = " style='border: 1px dotted #555555'";
	}
	html[i++] = "><legend style='color:#555555'>";
	html[i++] = ZmAttendeePicker.BOTTOM_LEGEND[this.type];
	html[i++] = "</legend>";

	// placeholder for the chooser's target list view
	html[i++] = "<div id='";
	html[i++] = this._chooserTargetListViewDivId;
	html[i++] = "'></div>";
	html[i++] = "</fieldset>";

	this.setContent(html.join(""));
};

ZmAttendeePicker.prototype._getSearchFieldHtml =
function(id, html, i, addButton, addMultLocsCheckbox) {
	if (id == ZmAttendeePicker.SF_SOURCE) {
		// no need for source select if not more than one choice to choose from
		this.showSelect = false;
		if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
			if (appCtxt.get(ZmSetting.GAL_ENABLED) || appCtxt.get(ZmSetting.SHARING_ENABLED))
				this.showSelect = true;
		}

		if (this.showSelect || appCtxt.isOffline) {
            this._listSelectId = this._searchFieldIds[id];
			html[i++] = "<td class='ZmFieldLabelRight' id='";
            html[i++] = this._listSelectId+"_label";
            html[i++] = "'>";
			html[i++] = ZmMsg[ZmAttendeePicker.SF_LABEL[id]];
			html[i++] = ":</td><td id='";
			html[i++] = this._listSelectId;
			html[i++] = "' width='130'></td>";
		} else {
			html[i++] = "<td>&nbsp;</td>";
		}
	} else {
		html[i++] = "<td class='ZmFieldLabelRight'>";
		html[i++] = ZmMsg[ZmAttendeePicker.SF_LABEL[id]];
		html[i++] = ":</td><td>";
		html[i++] = "<input type='text' autocomplete='off' size=30 nowrap id='";
		html[i++] = this._searchFieldIds[id];
		html[i++] = "' />";
		html[i++] = "</td>";
	}

	if (addButton) {
		this._searchBtnTdId	= Dwt.getNextId();
		html[i++] = "<td id='";
		html[i++] = this._searchBtnTdId;
		html[i++] = "'></td>";
	}
	if (addMultLocsCheckbox) {
		this._multLocsCheckboxId = Dwt.getNextId();
        var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
        if (fields.length === 1) {
            html[i++] = "<tr>";
        }
        else if (fields.length === 2) {
            html[i++] = "<tr>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
        }
        if (fields.length % 2 === 1) {
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
            html[i++] = "<td></td>";
        }
		html[i++] = "<td><table role='presentation'><tr><td>";
		html[i++] = "<input type='checkbox' id='";
		html[i++] = this._multLocsCheckboxId;
		html[i++] = "' /></td><td class='ZmFieldLabelLeft'><label for='";
		html[i++] = this._multLocsCheckboxId;
		html[i++] = "'>";
		html[i++] = ZmMsg.allowMultipleLocations;
		html[i++] = "</label></td></tr></table></td>";
	}

    if (appCtxt.isOffline && this.type == ZmCalBaseItem.PERSON) {
        this.setSelectVisibility(this.showSelect);
    }
	return i;
};

ZmAttendeePicker.prototype._addDwtObjects =
function() {
	// add search button
	if (this._searchBtnTdId) {
		var element = document.getElementById(this._searchBtnTdId);
		var searchButton = this._searchButton = new DwtButton({parent:this});
		searchButton.setText(ZmMsg.search);
		searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));
		element.appendChild(searchButton.getHtmlElement());
		// attendees tab: search button enabled only if there is search field input
		if (this.type == ZmCalBaseItem.PERSON) {
			searchButton.setEnabled(false);
		}
	}

	// add select menu for contact source if we need one
	if (this.showSelect) {
		var listSelect = document.getElementById(this._listSelectId);
		this._selectDiv = new DwtSelect({parent:this});
		this._resetSelectDiv();
		listSelect.appendChild(this._selectDiv.getHtmlElement());
		this._selectDiv.addChangeListener(new AjxListener(this, this._searchTypeListener));
	}

	// add paging buttons
	if (this._prevButtonId && this._nextButtonId) {
		var pageListener = new AjxListener(this, this._pageListener);

		this._prevButton = new DwtButton({parent:this});
		this._prevButton.setImage("LeftArrow");
		this._prevButton.addSelectionListener(pageListener);
		this._prevButton.reparentHtmlElement(this._prevButtonId);
		this._prevButton.setEnabled(false);

		this._nextButton = new DwtButton({parent:this});
		this._nextButton.setImage("RightArrow");
		this._nextButton.addSelectionListener(pageListener);
		this._nextButton.reparentHtmlElement(this._nextButtonId);
		this._nextButton.setEnabled(false);
	}

    var width = this.getSize().x;
	// add chooser
	this._chooser = new ZmApptChooser(this);
    this._chooserWidth = width - 50;
    this._chooser.resize(this._chooserWidth, ZmAttendeePicker.CHOOSER_HEIGHT);
    
	var chooserSourceListViewDiv = document.getElementById(this._chooserSourceListViewDivId);
	var sourceListView = this._chooser.getSourceListView();
	chooserSourceListViewDiv.appendChild(sourceListView);
	var chooserButtonsDiv = document.getElementById(this._chooserButtonsDivId);
	var buttons = this._chooser.getButtons();
	chooserButtonsDiv.appendChild(buttons);
	var chooserTargetListViewDiv = document.getElementById(this._chooserTargetListViewDivId);
	var targetListView = this._chooser.getTargetListView();
	chooserTargetListViewDiv.appendChild(targetListView);

	// save search fields, and add handler for Return key to them
	var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
	for (var i = 0; i < fields.length; i++) {
		var sf = fields[i];
		var searchField = this._searchFields[sf] = document.getElementById(this._searchFieldIds[sf]);
		if (searchField) {
			searchField.onkeypress = AjxCallback.simpleClosure(this._handleKeyPress, this);
			searchField.onkeyup = AjxCallback.simpleClosure(this._handleKeyUp, this);
		}
	}

	if (this._multLocsCheckboxId) {
		var cb = document.getElementById(this._multLocsCheckboxId);
		cb.onclick = AjxCallback.simpleClosure(this._handleMultiLocsCheckbox, this);
	}
};

ZmAttendeePicker.prototype._addTabGroupMembers =
function(tabGroup) {
	var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
	for (var i = 0; i < fields.length; i++) {
		if (fields[i] != ZmAttendeePicker.SF_SOURCE) {
			tabGroup.addMember(this._searchFields[fields[i]]);
		}
	}
};

ZmAttendeePicker.prototype._searchButtonListener =
function(ev) {
    this._list.removeAll();
    this._offset = 0;    
	this.searchCalendarResources();
};

ZmAttendeePicker.prototype._searchTypeListener =
function(ev) {
	var oldValue = ev._args.oldValue;
	var newValue = ev._args.newValue;

	if (oldValue != newValue) {
		this._searchButtonListener();
	}
};

ZmAttendeePicker.prototype._pageListener =
function(ev) {
	if (ev.item == this._prevButton) {
		this._offset -= ZmContactsApp.SEARCHFOR_MAX;
		this._showResults(true, true, this.getSubList()); // show cached results
	}
	else {
		var lastId;
		var lastSortVal;
		this._offset += ZmContactsApp.SEARCHFOR_MAX;
		var list = this.getSubList();
		if (!list) {
			list = this._chooser.sourceListView.getList();
			var contact = (list.size() > 0) ? list.getLast() : null;
			if (contact) {
				lastId = contact.id;
				lastSortVal = contact.sf;
			}
            this.searchCalendarResources(false, null, lastId, lastSortVal);
		} else {
			var more = this._list.hasMore;
			if (!more) {
				more = (this._offset+ZmContactsApp.SEARCHFOR_MAX) < this._list.size();
			}
			this._showResults(true, more, list); // show cached results
		}
	}
};

ZmAttendeePicker.prototype.getSubList =
function() {
	var size = this._list.size();

	var end = (this._offset + ZmContactsApp.SEARCHFOR_MAX > size)
		? size : (this._offset + ZmContactsApp.SEARCHFOR_MAX);

	return (this._offset < end)
		? (AjxVector.fromArray(this._list.getArray().slice(this._offset, end))) : null;
};

/*
* Sets the target list to the current set of attendees.
*/
ZmAttendeePicker.prototype._setAttendees =
function() {
	var attendees = this._attendees[this.type].getArray();
	if (attendees.length) {
		if (this.type == ZmCalBaseItem.LOCATION && attendees.length > 1) {
			this.enableMultipleLocations(true);
			this.resize();
		}
		this._chooser.setItems(attendees, DwtChooserListView.TARGET);
	}
	else {
		this._chooser.reset(DwtChooserListView.TARGET);
	}
};

ZmAttendeePicker.prototype._resetSelectDiv =
function() {
	if (this._selectDiv) {
		var currAcct = this._editView.getCalendarAccount();

		this._selectDiv.clearOptions();
		this._selectDiv.addOption(ZmMsg.contacts, false, ZmContactsApp.SEARCHFOR_CONTACTS);
		if (appCtxt.get(ZmSetting.SHARING_ENABLED, null, currAcct))
			this._selectDiv.addOption(ZmMsg.searchPersonalSharedContacts, false, ZmContactsApp.SEARCHFOR_PAS);
		if (appCtxt.get(ZmSetting.GAL_ENABLED, null, currAcct))
			this._selectDiv.addOption(ZmMsg.GAL, true, ZmContactsApp.SEARCHFOR_GAL);
		if (!appCtxt.get(ZmSetting.INITIALLY_SEARCH_GAL, null, currAcct) || !appCtxt.get(ZmSetting.GAL_ENABLED, null, currAcct)) {
			this._selectDiv.setSelectedValue(ZmContactsApp.SEARCHFOR_CONTACTS);
		}
	}
};

ZmAttendeePicker.prototype.setSelectVisibility =
function(showSelect) {
    if(typeof(showSelect) == "undefined") {
        showSelect = false;
        if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
            if (appCtxt.get(ZmSetting.GAL_ENABLED) || appCtxt.get(ZmSetting.SHARING_ENABLED)) {
                showSelect = true;
            }
        }
    }
    var listSelect = document.getElementById(this._listSelectId);
    var selectLabel = document.getElementById(this._listSelectId+"_label");
    if(listSelect && selectLabel) {
        Dwt.setDisplay(selectLabel, showSelect ? Dwt.DISPLAY_TABLE_CELL : Dwt.DISPLAY_NONE);
        Dwt.setDisplay(listSelect, showSelect ? Dwt.DISPLAY_TABLE_CELL : Dwt.DISPLAY_NONE);        
    }
};


ZmAttendeePicker.prototype._showResults =
function(isPagingSupported, more, list) {
	if (this._prevButton && this._nextButton) {
		// if offset is returned, then this account support gal paging
		if (this._contactSource == ZmId.SEARCH_GAL && !isPagingSupported) {
			this._prevButton.setEnabled(false);
			this._nextButton.setEnabled(false);
		} else {
			this._prevButton.setEnabled(this._offset > 0);
			this._nextButton.setEnabled(more);
		}
	}

	var list1 = [];
	var contactList = list ? list : [];
	if (!(contactList instanceof Array)) {
		contactList = contactList.getArray();
	}

	for (var i = 0; i < contactList.length; i++) {
		if (!contactList[i]) { continue; }
		var contact = (contactList[i] && contactList[i].__contact) ? contactList[i].__contact : contactList[i];
		var emails = contact.isGal ? [contact.getEmail()] : contact.getEmails();
		if (emails && emails.length > 1) {
			var workPhone = contact.getAttr(ZmContact.F_workPhone);
			var homePhone = contact.getAttr(ZmContact.F_homePhone);
			for (var j = 0; j < emails.length; j++) {
				var clone = new ZmContact(null);
				clone._fullName = contact.getFullName();
				clone.folderId = contact.folderId;
				clone.setAttr(ZmContact.F_workPhone, workPhone);
				clone.setAttr(ZmContact.F_homePhone, homePhone);
				clone.setAttr(ZmContact.F_email, emails[j]);
				list1.push(clone);
			}
		} else {
			list1.push(contact);
		}
	}

	this._fillFreeBusy(list1, AjxCallback.simpleClosure(function(list1) { this._chooser.setItems(list1); }, this));
	this._chooser.sourceListView.focus();
};

ZmAttendeePicker.prototype.searchCalendarResources =
function(defaultSearch, sortBy, lastId, lastSortVal) {
	var currAcct = this._editView.getCalendarAccount();
	var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
	var conds = [];
	var value = (this.type == ZmCalBaseItem.LOCATION) ? "Location" : "Equipment";
	conds.push({attr: "zimbraCalResType", op: "eq", value: value});
	var gotValue = false;
	for (var i = 0; i < fields.length; i++) {
		var sf = fields[i];
		var searchField = document.getElementById(this._searchFieldIds[sf]);
		value = AjxStringUtil.trim(searchField.value);
		if (value.length) {
			gotValue = true;
			var attr = ZmAttendeePicker.SF_ATTR[sf];
			var op = ZmAttendeePicker.SF_OP[sf] ? ZmAttendeePicker.SF_OP[sf] : "has";
			conds.push({attr: attr, op: op, value: value});
		}
	}
	var params = {
		sortBy: sortBy,
		offset: this._offset,
		limit: ZmContactsApp.SEARCHFOR_MAX,
		conds: conds,
		attrs: ZmAttendeePicker.ATTRS[this.type],
        lastId: lastId,
        lastSortVal: lastSortVal,        
		accountName: appCtxt.isOffline ? currAcct.name : null
	};
	var search = new ZmSearch(params);
	search.execute({callback: new AjxCallback(this, this._handleResponseSearchCalendarResources, [defaultSearch])});
};

ZmAttendeePicker.prototype._getTimeFrame =
function() {
	var di = {};
	ZmApptViewHelper.getDateInfo(this._editView, di);
	var startDate = AjxDateUtil.simpleParseDateStr(di.startDate);
	var endDate;
	if (di.isAllDay) {
		startDate.setHours(0, 0, 0, 0);
        endDate = AjxDateUtil.simpleParseDateStr(di.endDate);
        endDate.setHours(23, 59, 0, 0);
	} else {
		endDate = AjxDateUtil.simpleParseDateStr(di.endDate);
		startDate = this._editView._startTimeSelect.getValue(startDate);
		endDate = this._editView._endTimeSelect.getValue(endDate);
	}

	return {start:startDate, end:endDate};
};

ZmAttendeePicker.prototype._fillFreeBusy =
function(items, callback) {

	var currAcct = this._editView.getCalendarAccount();
	// Bug: 48189 Don't send GetFreeBusyRequest for non-ZCS accounts.
	if (appCtxt.isOffline && (!currAcct.isZimbraAccount || currAcct.isMain)) {
		if (callback) {
			callback(items);
		}
		return;
	}

	var tf = this._getTimeFrame();
	var list = (items instanceof AjxVector) ? items.getArray() : (items instanceof Array) ? items : [items];
	var emails = [];
	var itemsById = {};
	for (var i = list.length; --i >= 0;) {
		var item = list[i];
		emails[i] = item.getEmail();

		// bug: 30824 - Don't list all addresses/aliases of a resource in
		// GetFreeBusyRequest.  One should suffice.
		if (emails[i] instanceof Array) {
			emails[i] = emails[i][0];
		}

		itemsById[emails[i]] = item;
		item.__fbStatus = { txt: ZmMsg.unknown };
	}
	callback(items);

	if (this._freeBusyRequest) {
		appCtxt.getRequestMgr().cancelRequest(this._freeBusyRequest, null, true);
	}
	this._freeBusyRequest = this._controller.getFreeBusyInfo(tf.start.getTime(),
															 tf.end.getTime(),
															 emails.join(","),
															 new AjxCallback(this, this._handleResponseFreeBusy, [itemsById]),
															 null,
															 true);
};

ZmAttendeePicker.prototype._handleResponseFreeBusy =
function(itemsById, result) {
	this._freeBusyRequest = null;

	var args = result.getResponse().GetFreeBusyResponse.usr;
	for (var i = args.length; --i >= 0;) {
		var el = args[i];
		var id = el.id;
		if (!id) {
			continue;
		}
		var item = itemsById[id];
		if (!item) {
			continue;
		}
		var status = ZmMsg.free;
		item.__fbStatus.status = 0;
		if (el.b) {
			status = "<b style='color: red'>" + ZmMsg.busy + "</b>";
			item.__fbStatus.status = 1;
		} else if (el.u) {
			status = "<b style='color: red'>" + ZmMsg.outOfOffice + "</b>";
			item.__fbStatus.status = 2;
		} else if (el.t) {
			status = "<b style='color: orange'>" + ZmMsg.tentative + "</b>";
			item.__fbStatus.status = 3;
		}
		item.__fbStatus.txt = status;
		this._updateStatus(item, this._chooser.sourceListView);
		this._updateStatus(item, this._chooser.targetListView);
	}
};

ZmAttendeePicker.prototype._updateStatus =
function(item, view) {
	var id = view._getFieldId(item, "FBSTATUS"),
		element = document.getElementById(id);
	
	if (element) {
		element.innerHTML = item.__fbStatus.txt;
	}
};

ZmAttendeePicker.prototype._handleResponseSearchCalendarResources =
function(defaultSearch, result) {
	var resp = result.getResponse();
    var offset = resp.getAttribute("offset");
    var isPagingSupported = resp.getAttribute("paginationSupported");
    var more = resp.getAttribute("more");
    var info = resp.getAttribute("info");
    var expanded = info && info[0].wildcard[0].expanded == "0";

    var list = resp.getResults(ZmItem.RESOURCE).getVector();
    if (isPagingSupported) {
        this._list.merge(offset, list);
        this._list.hasMore = more;
    }

    this._showResults(isPagingSupported, more, list.getArray());    
};

ZmAttendeePicker.prototype._getDefaultFocusItem =
function() {
	var fields = ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this.type] || ZmAttendeePicker.SEARCH_FIELDS[this.type];
	return this._searchFields[fields[0]];
};

ZmAttendeePicker.prototype._handleKeyPress =
function(ev) {
	var charCode = DwtKeyEvent.getCharCode(ev);
	if (this._keyPressCallback && (charCode == 13 || charCode == 3)) {
		this._keyPressCallback.run();
	    return false;
	}
	return true;
};

ZmAttendeePicker.prototype._handleKeyUp =
function(ev) {
	var field = DwtUiEvent.getTarget(ev);

	return true;
};

ZmAttendeePicker.prototype._handleMultiLocsCheckbox =
function(ev) {
	var cb = DwtUiEvent.getTarget(ev);
	this._chooser.setSelectStyle(cb.checked ? DwtChooser.MULTI_SELECT : DwtChooser.SINGLE_SELECT, true);

	this.resize(); // force resize to adjust chooser layout
};

// *********************

/**
 * @class
 * This class creates a specialized chooser for the attendee picker.
 *
 * @param {DwtComposite}	parent			the attendee tab view
 * @param {Array}		buttonInfo		transfer button IDs and labels
 * 
 * @extends		DwtChooser
 * 
 * @private
 */
ZmApptChooser = function(parent, buttonInfo) {
	var selectStyle = (parent.type == ZmCalBaseItem.LOCATION) ? DwtChooser.SINGLE_SELECT : null;
	DwtChooser.call(this, {parent: parent, buttonInfo: buttonInfo, layoutStyle: DwtChooser.VERT_STYLE,
						   mode: DwtChooser.MODE_MOVE, selectStyle: selectStyle, allButtons: true});
};

ZmApptChooser.prototype = new DwtChooser;
ZmApptChooser.prototype.constructor = ZmApptChooser;

ZmApptChooser.prototype.toString =
function() {
	return "ZmApptChooser";
};

// overload to handle contact groups - see bug 28398
ZmApptChooser.prototype.addItems =
function(items, view, skipNotify, id) {
	var newList;

	if (view == DwtChooserListView.TARGET) {
		newList = [];
		var list = (items instanceof AjxVector) ? items.getArray() : (items instanceof Array) ? items : [items];

		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			if (item instanceof ZmContact && item.isGroup()) {
				var addrs = item.getGroupMembers().good.getArray();
				for (var j = 0; j < addrs.length; j++) {
					var contact = new ZmContact(null);
					contact.initFromEmail(addrs[j]);
					newList.push(contact);
				}
			} else {
				newList.push(item);
			}
		}
	} else {
		newList = items;
	}
    if(this.parent.type == ZmCalBaseItem.LOCATION && newList.length <= 0) {
        this.sourceListView.setUI(null, false);
    }
    DwtChooser.prototype.addItems.call(this, newList, view, skipNotify, id);
};

ZmApptChooser.prototype._createSourceListView =
function() {
	return new ZmApptChooserListView(this, DwtChooserListView.SOURCE, this.parent.type);
};

ZmApptChooser.prototype._createTargetListView =
function() {
	return new ZmApptChooserListView(this, DwtChooserListView.TARGET, this.parent.type);
};

ZmApptChooser.prototype._notify =
function(event, details) {
	details.type = this.parent.type;
	DwtChooser.prototype._notify.call(this, event, details);
};

/**
 * The item is a {@link ZmContact} or {@link ZmResource}. Its address is used for comparison.
 *
 * @param {ZmContact}	item	the ZmContact or ZmResource
 * @param {AjxVector}	list	list to check against
 * 
 * @private
 */
ZmApptChooser.prototype._isDuplicate =
function(item, list) {
	return list.containsLike(item, item.getEmail);
};

ZmApptChooser.prototype._reset =
function(view) {
	if (appCtxt.isOffline && appCtxt.accountList.size() > 1 && !view) {
		this.parent._resetSelectDiv();
	}
	DwtChooser.prototype._reset.apply(this, arguments);
};

/**
 * Removes items from target list, paying attention to current mode. Also handles button state.
 *
 * @param {AjxVector|array|Object|hash}	list			a list of items or hash of lists
 * @param {boolean}	skipNotify	if <code>true</code>, do not notify listeners
 */
ZmApptChooser.prototype.remove =
function(list, skipNotify) {
	list = (list instanceof AjxVector) ? list.getArray() : (list instanceof Array) ? list : [list];
	if (this._mode == DwtChooser.MODE_MOVE) {
		for (var i = 0; i < list.length; i++) {
            var itemIndex = this.sourceListView.getItemIndex(list[i]);
            //avoid adding duplicate entries
            if(itemIndex == null) {
			    var index = this._getInsertionIndex(this.sourceListView, list[i]);
			    this.sourceListView.addItem(list[i], index, true);
            }
		}
		this._sourceSize = list ? list.length : 0;
	}
	this.removeItems(list, DwtChooserListView.TARGET);
};


/**
 * This class creates a specialized source list view for the contact chooser. The items
 * it manages are of type ZmContact or its subclass ZmResource.
 *
 * @param {DwtChooser}	parent		chooser that owns this list view
 * @param {constant}	type			list view type (source or target)
 * @param {constant}	chooserType		type of owning chooser (attendee/location/resource)
 * 
 * @extends		DwtChooserListView
 * 
 * @private
 */
ZmApptChooserListView = function(parent, type, chooserType) {

	this._chooserType = chooserType;
	DwtChooserListView.call(this, {parent:parent, type:type});

	this._notes = {};
};

ZmApptChooserListView.prototype = new DwtChooserListView;
ZmApptChooserListView.prototype.constructor = ZmApptChooserListView;

ZmApptChooserListView.prototype.toString =
function() {
	return "ZmApptChooserListView";
};

ZmApptChooserListView.prototype._getHeaderList =
function() {
	var headerList = [];
	var cols = ZmAttendeePicker.COLS[this._chooserType];
    if ( ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this._chooserType] && ZmAttendeePicker.SETTINGS_SEARCH_FIELDS[this._chooserType].length === 1 ){
        var auto_width = true;
    }
	for (var i = 0; i < cols.length; i++) {
		var id = cols[i];
		var text = ZmMsg[ZmAttendeePicker.COL_LABEL[id]];
		var image = ZmAttendeePicker.COL_IMAGE[id];
        var width = ( auto_width ) ? null : ZmAttendeePicker.COL_WIDTH[id];
		headerList.push(new DwtListHeaderItem({field:id, text:text, icon:image, width:width,
											   resizeable:(id == ZmItem.F_NAME)}));
	}

	return headerList;
};

ZmApptChooserListView.prototype._getCellId =
function(item, field) {
	return field == "FBSTATUS" ? this._getFieldId(item, field) : null;
};

ZmApptChooserListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
	if (field != ZmItem.F_NOTES) {
		html[idx++] = "&nbsp;";
	}
	if (field == ZmItem.F_FOLDER) {
		var name = "";
		if (item.isGal) {
			name = ZmMsg.GAL;
		} else {
			var folder = appCtxt.getById(item.folderId);
			name = folder ? folder.name : "";
		}
		html[idx++] = AjxStringUtil.htmlEncode(name);
	} else if (field == ZmItem.F_NAME) {
		var name = (this._chooserType == ZmCalBaseItem.PERSON) ? item.getFullName() : item.getAttr(ZmResource.F_name);
		if (this._chooserType != ZmCalBaseItem.PERSON && item instanceof ZmContact) {
			name = item.getFullName() || item.getAttr(ZmResource.F_locationName);
		}
		html[idx++] = AjxStringUtil.htmlEncode(name);
	} else if (field == ZmItem.F_EMAIL) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getEmail());
	} else if (field == ZmItem.F_WORK_PHONE) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getAttr(ZmContact.F_workPhone));
	} else if (field == ZmItem.F_HOME_PHONE) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getAttr(ZmContact.F_homePhone));
	} else if (field == ZmItem.F_LOCATION) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getAttr(ZmResource.F_locationName) || item.getFullName());
	} else if (field == ZmItem.F_CONTACT) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getAttr(ZmResource.F_contactMail));
	} else if (field == ZmItem.F_CAPACITY) {
		html[idx++] = AjxStringUtil.htmlEncode(item.getAttr(ZmResource.F_capacity));
	} else if (field == ZmItem.F_NOTES) {
		var notes = item.getAttr(ZmContact.F_description);
		if (notes) {
			var notesId = this._getFieldId(item, field);
			this._notes[notesId] = notes;
			html[idx++] = AjxImg.getImageHtml("Page", null, ["id='", notesId, "'"].join(""));
		}
	} else if (field == "FBSTATUS" && item.__fbStatus) {
		html[idx++] = item.__fbStatus.txt;
	}
	return idx;
};

ZmApptChooserListView.prototype._mouseOverAction =
function(ev, div) {
	DwtListView.prototype._mouseOverAction.call(this, ev, div);
	var id = ev.target.id || div.id;
	if (!id) { return true; }

	// check if we're hovering over a column header
	var type = Dwt.getAttr(div, "_type");
	if (type && type == DwtListView.TYPE_HEADER_ITEM) {
		var hdr = this.getItemFromElement(div);
		if (hdr) {
			if (hdr._field == ZmItem.F_NOTES) {
				this.setToolTipContent(ZmMsg.notes);
			}
		}
	} else {
		var note = this._notes[id];
		if (!note) {
			var item = this.getItemFromElement(div);
			if (item) {
				var notesId = this._getFieldId(item, ZmItem.F_NOTES);
				note = this._notes[notesId];
			}
		}
		if (note) {
			this.setToolTipContent(AjxStringUtil.htmlEncode(note));
		}
	}

	return true;
};
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmMiniCalendar")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmMiniCalendar = function(params) {
	if (arguments.length == 0) { return; }
    DwtCalendar.call(this, params);
};

ZmMiniCalendar.prototype = new DwtCalendar;
ZmMiniCalendar.prototype.constructor = ZmMiniCalendar;

ZmMiniCalendar.COLOR_GREEN   = 'green';
ZmMiniCalendar.COLOR_RED     = 'red';
ZmMiniCalendar.COLOR_ORANGE  = 'orange';

//override class name selection to include color code into consideration
ZmMiniCalendar.prototype._setCellClassName =
function(cell, className, mode) {
    var className = DwtCalendar.prototype._setCellClassName.call(this, cell, className, mode);
    if(cell._colorCode) {
        className += this._getSuggestionClassName(cell._colorCode);
    }
    return className;
};

ZmMiniCalendar.prototype._getSuggestionClassName =
function(colorCode) {
    return " " + this._origDayClassName + "-" + colorCode;        
};

/**
 * Enables/disables the highlight (i.e. "bolding") on the dates in <code>&lt;dates&gt;</code>.
 *
 * @param {array}	dates	an array of {@link Date} objects for which to enable/disable highlighting
 * @param {boolean}	clear 	if <code>true</code>, clear current highlighting 
 * @param {array}	string  an array of strings representing color codes array ZmMiniCalendar.COLOR_GREEN, ZmMiniCalendar.COLOR_RED, ZmMiniCalendar.COLOR_ORANGE
 */
ZmMiniCalendar.prototype.setColor =
function(dates, clear, color) {
	if (this._date2CellId == null) { return; }

	var cell;
	var aDate;
	if (clear) {
		for (aDate in this._date2CellId) {
			cell = document.getElementById(this._date2CellId[aDate]);
			if (cell._colorCode) {
                cell._colorCode = null;
				this._setClassName(cell, DwtCalendar._NORMAL);
			}
		}
	}

	var cellId;
	for (var i in dates) {
		aDate = dates[i];
		cellId = this._date2CellId[aDate.getFullYear() * 10000 + aDate.getMonth() * 100 + aDate.getDate()];

		if (cellId) {
			cell = document.getElementById(cellId);
			if (color[i]) {
                cell._colorCode = color[i];
				this._setClassName(cell, DwtCalendar._NORMAL);
			}
		}
	}
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
if (AjxPackage.define("zimbraMail.calendar.controller.ZmApptComposeController")) {
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
 * @extends		ZmCalItemComposeController
 */
ZmApptComposeController = function(container, app, type, sessionId) {
    if (arguments.length == 0) { return; }

	ZmCalItemComposeController.apply(this, arguments);

	this._addedAttendees = [];
	this._removedAttendees = [];
	this._kbMgr = appCtxt.getKeyboardMgr();
};

ZmApptComposeController.prototype = new ZmCalItemComposeController;
ZmApptComposeController.prototype.constructor = ZmApptComposeController;

ZmApptComposeController.prototype.isZmApptComposeController = true;
ZmApptComposeController.prototype.toString = function() { return "ZmApptComposeController"; };

ZmApptComposeController._VALUE = "value";

ZmApptComposeController._DIALOG_OPTIONS = {
	SEND: 'SEND',
	CANCEL: 'CANCEL',
	DISCARD: 'DISCARD'
};

// Public methods

ZmApptComposeController.getDefaultViewType =
function() {
	return ZmId.VIEW_APPOINTMENT;
};
ZmApptComposeController.prototype.getDefaultViewType = ZmApptComposeController.getDefaultViewType;

ZmApptComposeController.prototype.show =
function(calItem, mode, isDirty) {
	ZmCalItemComposeController.prototype.show.call(this, calItem, mode, isDirty);

	this._addedAttendees.length = this._removedAttendees.length = 0;
	this._setComposeTabGroup();
};

/**
 * Forwards the calendar item.
 * 
 * @param	{ZmAppt}	appt		the appointment
 * @return	{Boolean}	<code>true</code> indicates the forward is executed
 */
ZmApptComposeController.prototype.forwardCalItem =
function(appt, forwardCallback) {
	// todo: to address input validation
	var callback = new AjxCallback(this, this._handleForwardInvite, forwardCallback);
	appt.forward(callback);
	return true;
};

/**
 * Propose new time for an appointment
 *
 * @param	{ZmAppt}	    appt		            the appointment
 * @param	{AjxCallback}	proposeTimeCallback		callback executed  after proposing time
 * @return	{Boolean}	    <code>true</code>       indicates that propose time is executed
 */
ZmApptComposeController.prototype.sendCounterAppointmentRequest =
function(appt, proposeTimeCallback) {
	var callback = new AjxCallback(this, this._handleCounterAppointmentRequest, proposeTimeCallback);
    var apptEditView = this._composeView ? this._composeView.getApptEditView() : null;
    var viewMode = apptEditView ? apptEditView.getMode() : null;
	appt.sendCounterAppointmentRequest(callback, null, viewMode);
	return true;
};

ZmApptComposeController.prototype._handleCounterAppointmentRequest =
function(proposeTimeCallback) {
	appCtxt.setStatusMsg(ZmMsg.newTimeProposed);
	if (proposeTimeCallback instanceof AjxCallback) {
		proposeTimeCallback.run();
	}
};

ZmApptComposeController.prototype._handleForwardInvite =
function(forwardCallback) {
	appCtxt.setStatusMsg(ZmMsg.forwardInviteSent);
	if (forwardCallback instanceof AjxCallback) {
		forwardCallback.run();
	}
};

ZmApptComposeController.prototype._badAddrsOkCallback =
function(dialog, appt) {
	dialog.popdown();
	this.forwardCalItem(appt, new AjxCallback(this, this._apptForwardCallback));
};

ZmApptComposeController.prototype._apptForwardCallback =
function() {
	this.closeView();
};

ZmApptComposeController.prototype._checkIsDirty =
function(type, attribs){
    return this._composeView.checkIsDirty(type, attribs)
};

ZmApptComposeController.prototype._getChangesDialog =
function(){
    var id,
        dlg,
        isOrganizer = this._composeView.isOrganizer();
    if(isOrganizer) {
        dlg = this._changesDialog;
        if (!dlg) {
			dlg = this._changesDialog = new DwtOptionDialog({
				parent: appCtxt.getShell(),
				id: Dwt.getNextId("CHNG_DLG_ORG_"),
				title: ZmMsg.apptSave,
				message: ZmMsg.apptSignificantChanges,
				options: [
					{
						name: ZmApptComposeController._DIALOG_OPTIONS.SEND,
						text: ZmMsg.apptSaveChanges
					},
					{
						name: ZmApptComposeController._DIALOG_OPTIONS.CANCEL,
						text: ZmMsg.apptSaveCancel
					},
					{
						name: ZmApptComposeController._DIALOG_OPTIONS.DISCARD,
						text: ZmMsg.apptSaveDiscard
					}
				]
			});
			dlg.registerCallback(DwtDialog.OK_BUTTON,
			                     this._changesDialogListener.bind(this));
        }
    }
    else {
        dlg = this._attendeeChangesDialog;
        if (!dlg) {
            dlg = this._attendeeChangesDialog = new DwtDialog({parent:appCtxt.getShell(), id:Dwt.getNextId("CHNG_DLG_ATTNDE_")});
            id = this._attendeeChangesDialogId = Dwt.getNextId();
            dlg.setContent(AjxTemplate.expand("calendar.Appointment#ChangesDialogAttendee", {id: id}));
            dlg.setTitle(ZmMsg.apptSave);
            dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._attendeeChangesDialogListener, id));
        }
    }
    return dlg;
};

ZmApptComposeController.prototype._changesDialogListener =
function(){

    this.clearInvalidAttendees();
    delete this._invalidAttendees;

	switch (this._changesDialog.getSelection()) {
	case ZmApptComposeController._DIALOG_OPTIONS.SEND:
        this._sendListener();
		break;

	case ZmApptComposeController._DIALOG_OPTIONS.CANCEL:
		break;

	case ZmApptComposeController._DIALOG_OPTIONS.DISCARD:
        this.closeView();
		break;
	}

	this._changesDialog.popdown();
};

ZmApptComposeController.prototype._attendeeChangesDialogListener =
function(id){
    this.clearInvalidAttendees();
    delete this._invalidAttendees;
    this.closeView();
    this._attendeeChangesDialog.popdown();
};

ZmApptComposeController.prototype.saveCalItem =
function(attId) {
	this._composeView.cancelLocationRequest();
	var appt = this._composeView.getAppt(attId);
    var numRecurrence = this._composeView.getNumLocationConflictRecurrence ?
        this._composeView.getNumLocationConflictRecurrence() :
        ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE;

	if (appt) {

		if (!appt.isValidDuration()) {
			this._composeView.showInvalidDurationMsg();
			this.enableToolbar(true);
			return false;
		}
		if (!appt.isValidDurationRecurrence()) {
			this._composeView.showInvalidDurationRecurrenceMsg();
			this.enableToolbar(true);
			return false;
		}

        if (appCtxt.get(ZmSetting.GROUP_CALENDAR_ENABLED)) {
            if (this._requestResponses)
            	appt.setRsvp(this._requestResponses.getChecked());
            appt.setMailNotificationOption(true);
        }

        if(appt.isProposeTime && !appt.isOrganizer()) {
            return this.sendCounterAppointmentRequest(appt);
        }

		if (appt.isForward) {
			var addrs = this._composeView.getForwardAddress();

			// validate empty forward address
			if (!addrs.gotAddress) {
				var msgDialog = appCtxt.getMsgDialog();
				msgDialog.setMessage(ZmMsg.noForwardAddresses, DwtMessageDialog.CRITICAL_STYLE);
				msgDialog.popup();
                this.enableToolbar(true);
				return false;
			}

			if (addrs[ZmApptEditView.BAD] && addrs[ZmApptEditView.BAD].size()) {
				var cd = appCtxt.getOkCancelMsgDialog();
				cd.reset();
				var bad = AjxStringUtil.htmlEncode(addrs[ZmApptEditView.BAD].toString(AjxEmailAddress.SEPARATOR));
				var msg = AjxMessageFormat.format(ZmMsg.compBadAddresses, bad);
				cd.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
				cd.registerCallback(DwtDialog.OK_BUTTON, this._badAddrsOkCallback, this, [cd,appt]);
				cd.setVisible(true); // per fix for bug 3209
				cd.popup();
                this.enableToolbar(true);
				return false;
			}

            //attendee forwarding an appt
            /* if(!appt.isOrganizer()) */ return this.forwardCalItem(appt);
		}

		if (!this._attendeeValidated && this._invalidAttendees && this._invalidAttendees.length > 0) {
			var dlg = appCtxt.getYesNoMsgDialog();
			dlg.registerCallback(DwtDialog.YES_BUTTON, this._clearInvalidAttendeesCallback, this, [appt, attId, dlg]);
			var msg = "";
            if(this._action == ZmCalItemComposeController.SAVE){
               msg = AjxMessageFormat.format(ZmMsg.compSaveBadAttendees, AjxStringUtil.htmlEncode(this._invalidAttendees.join(",")));
            }
            else{
                msg = AjxMessageFormat.format(ZmMsg.compBadAttendees, AjxStringUtil.htmlEncode(this._invalidAttendees.join(",")));
            }
			dlg.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
			dlg.popup();
            this.enableToolbar(true);
            this._attendeeValidated = true;
			return false;
		}

        //Validation Check for Significant / Insignificant / Local changes
        if(this._action == ZmCalItemComposeController.SAVE && !appt.inviteNeverSent){
            //Check for Significant Changes
            if(this._checkIsDirty(ZmApptEditView.CHANGES_SIGNIFICANT)){
                this._getChangesDialog().popup();
                this.enableToolbar(true);
                return false;
            }
        }

		var origAttendees = appt.origAttendees;						// bug fix #4160
		if (origAttendees && origAttendees.length > 0 && 			// make sure we're not u/l'ing a file
			attId == null) 											// make sure we are editing an existing appt w/ attendees
		{
			if (!appt.inviteNeverSent && !this._composeView.getApptEditView().isDirty(true)) {	// make sure other fields (besides attendees field) have not changed
				var attendees = appt.getAttendees(ZmCalBaseItem.PERSON);
				if (attendees.length > 0) {
					// check whether organizer has added/removed any attendees
					if (this._action == ZmCalItemComposeController.SEND && this._attendeesUpdated(appt, attId, attendees, origAttendees))
						return false;
				}
			}

			// check whether moving appt from local to remote folder with attendees
			var cc = AjxDispatcher.run("GetCalController");
			if (cc.isMovingBetwAccounts(appt, appt.__newFolderId)) {
				var dlg = appCtxt.getMsgDialog();
                dlg.setMessage(ZmMsg.orgChange, DwtMessageDialog.WARNING_STYLE);
                dlg.popup();
                this.enableToolbar(true);
                return false;
			}
		}

        var ret = this._initiateSaveWithChecks(appt, attId, numRecurrence);
		return ret;
	}

	return false;
};

ZmApptComposeController.prototype._initiateSaveWithChecks =
function(appt, attId, numRecurrence) {
    var resources = appt.getAttendees(ZmCalBaseItem.EQUIPMENT);
    var locations = appt.getAttendees(ZmCalBaseItem.LOCATION);
    var attendees = appt.getAttendees(ZmCalBaseItem.PERSON);

    var notifyList;

    var needsPermissionCheck = (attendees && attendees.length > 0) ||
                               (resources && resources.length > 0) ||
                               (locations && locations.length > 0);

    var needsConflictCheck = !appt.isForward &&
         ((resources && resources.length > 0) ||
         // If alteredLocations specified, it implies the user
         // has already examined and modified the location conflicts
         // that they want - so issue no further warnings.

         // NOTE: appt.alteredLocations is disabled (and hence undefined)
         //       for now.  It will be set once CreateAppt/ModifyAppt
         //       SOAP API changes are completed (Bug 56464)
          (!appt.alteredLocations && locations && locations.length > 0));

    if (needsConflictCheck) {
        this.checkConflicts(appt, numRecurrence, attId, notifyList);
        return false;
    } else if (needsPermissionCheck) {
        this.checkAttendeePermissions(appt, attId, notifyList);
        return false;
    } else {
        this._saveCalItemFoRealz(appt, attId, notifyList);
    }
    return true;
};

ZmApptComposeController.prototype.updateToolbarOps =
function(mode, appt) {

    var saveButton = this._toolbar.getButton(ZmOperation.SAVE);
    var sendButton = this._toolbar.getButton(ZmOperation.SEND_INVITE);

    if (mode == ZmCalItemComposeController.APPT_MODE) {
        saveButton.setText(ZmMsg.saveClose);
        saveButton.setVisible(true);
        sendButton.setVisible(false);
    } else {
        sendButton.setVisible(true);
        saveButton.setVisible(true);
        saveButton.setText(ZmMsg.save);

        //change cancel button's text/icon to close
        var cancelButton = this._toolbar.getButton(ZmOperation.CANCEL);
        cancelButton.setText(ZmMsg.close);
    }
	if (this._requestResponses) {
		this._requestResponses.setEnabled(mode !== ZmCalItemComposeController.APPT_MODE);
	}

    if ((this._mode == ZmCalItem.MODE_PROPOSE_TIME) || ZmCalItem.FORWARD_MAPPING[this._mode]) {
        sendButton.setVisible(true);
        saveButton.setVisible(false);
        // Enable the RequestResponse when Forwarding
		if (this._requestResponses) {
			this._requestResponses.setEnabled(this._mode !== ZmCalItem.MODE_PROPOSE_TIME);
		}
    }

};

ZmApptComposeController.prototype._initToolbar =
function(mode) {

    ZmCalItemComposeController.prototype._initToolbar.call(this, mode);

    //use send button for forward appt view
    //Switch Save Btn label n listeners 
    var saveButton = this._toolbar.getButton(ZmOperation.SAVE);
    saveButton.removeSelectionListeners();
    if(ZmCalItem.FORWARD_MAPPING[mode]) {
        saveButton.addSelectionListener(new AjxListener(this, this._sendBtnListener));
    }else {
        saveButton.addSelectionListener(new AjxListener(this, this._saveBtnListener));
    }

    var sendButton = this._toolbar.getButton(ZmOperation.SEND_INVITE);
    sendButton.removeSelectionListeners();
    sendButton.addSelectionListener(new AjxListener(this, this._sendBtnListener));

	var saveButton = this._toolbar.getButton(ZmOperation.SAVE);
	saveButton.setToolTipContent(ZmMsg.saveToCalendar);
	
    var btn = this._toolbar.getButton(ZmOperation.ATTACHMENT);
    if(btn)
        btn.setEnabled(!(this._mode == ZmCalItem.MODE_PROPOSE_TIME || ZmCalItem.FORWARD_MAPPING[mode]));
};

ZmApptComposeController.prototype._sendListener =
function(ev){

     var appt = this._composeView.getApptEditView()._calItem;

     if(!appt.inviteNeverSent){
        this._sendAfterExceptionCheck();
     }
     else{this._sendContinue();}

     return true;
};

ZmApptComposeController.prototype._sendAfterExceptionCheck =
function(){
     var appt = this._composeView.getApptEditView()._calItem;
     var isExceptionAllowed = appCtxt.get(ZmSetting.CAL_EXCEPTION_ON_SERIES_TIME_CHANGE);
     var isEditingSeries = (this._mode == ZmCalItem.MODE_EDIT_SERIES);
     var showWarning = appt.isRecurring() && appt.hasEx && isEditingSeries && appt.getAttendees(ZmCalBaseItem.PERSON) && !isExceptionAllowed && this._checkIsDirty(ZmApptEditView.CHANGES_TIME_RECURRENCE);
     if(showWarning){
          var dialog = appCtxt.getYesNoCancelMsgDialog();
		  dialog.setMessage(ZmMsg.recurrenceUpdateWarning, DwtMessageDialog.WARNING_STYLE);
          dialog.registerCallback(DwtDialog.YES_BUTTON, this._sendContinue, this,[dialog]);
          dialog.registerCallback(DwtDialog.NO_BUTTON, this._dontSend,this,[dialog]);
          dialog.getButton(DwtDialog.CANCEL_BUTTON).setText(ZmMsg.discard);
		  dialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._dontSendAndClose,this,[dialog]);
		  dialog.popup();
    }
    else{
        this._sendContinue();
    }
}

ZmApptComposeController.prototype._dontSend =
function(dialog){
    this._revertWarningDialog(dialog);
}

ZmApptComposeController.prototype._dontSendAndClose =
function(dialog){
this._revertWarningDialog(dialog);
this.closeView();
}

ZmApptComposeController.prototype._revertWarningDialog =
function(dialog){
    if(dialog){
        dialog.popdown();
        dialog.getButton(DwtDialog.CANCEL_BUTTON).setText(ZmMsg.cancel);
    }
}

ZmApptComposeController.prototype._sendContinue =
function(dialog){
    this._revertWarningDialog(dialog);
    this._action = ZmCalItemComposeController.SEND;
    this.enableToolbar(false);
	if (this._doSave() === false) {
		return;
    }
	this.closeView();
}

ZmApptComposeController.prototype.isSave =
function(){
    return (this._action == ZmCalItemComposeController.SAVE); 
};

ZmApptComposeController.prototype._saveBtnListener =
function(ev) {
    delete this._attendeeValidated;
    return this._saveListener(ev, true);
};

ZmApptComposeController.prototype._sendBtnListener =
function(ev) {
    delete this._attendeeValidated;
    return this._sendListener(ev);
};

ZmApptComposeController.prototype._saveListener =
function(ev, force) {
    var isMeeting = !this._composeView.isAttendeesEmpty();

    this._action = isMeeting ? ZmCalItemComposeController.SAVE : ZmCalItemComposeController.SAVE_CLOSE;

    //attendee should not have send/save option
    if(!this._composeView.isOrganizer()) {
        this._action = ZmCalItemComposeController.SAVE_CLOSE;
    }
    this.enableToolbar(false);

    var dlg = appCtxt.getOkCancelMsgDialog();
    if(dlg.isPoppedUp()){
        dlg.popdown();
    }

    if(!force && this._action == ZmCalItemComposeController.SAVE){
        var appt = this._composeView.getApptEditView()._calItem;
        var inviteNeverSent = (appt && appt.inviteNeverSent);
        var showDlg = true;
        if(appt.isDraft){
            showDlg = false;
        }
        if(showDlg && !inviteNeverSent && (this._checkIsDirty(ZmApptEditView.CHANGES_SIGNIFICANT)
                ||  this._checkIsDirty(ZmApptEditView.CHANGES_LOCAL))){
            showDlg = false;
        }
        if(showDlg){
            dlg.setMessage(ZmMsg.saveApptInfoMsg);
            dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._saveListener, [ev, true]));
            dlg.popup();
            this.enableToolbar(true);
            return;
        }
    }

	if (this._doSave() === false) {
		return;
    }
};

ZmApptComposeController.prototype._createToolBar =
function() {

    ZmCalItemComposeController.prototype._createToolBar.call(this);

	var optionsButton = this._toolbar.getButton(ZmOperation.COMPOSE_OPTIONS);
	if (optionsButton){
        optionsButton.setVisible(true); //might be invisible if not ZmSetting.HTML_COMPOSE_ENABLED (see ZmCalItemComposeController._createToolBar)

        var m = optionsButton.getMenu();
        if (m) {
            var sepMi = new DwtMenuItem({parent:m, style:DwtMenuItem.SEPARATOR_STYLE});
        }
        else {
            m = new DwtMenu({parent:optionsButton});
            optionsButton.setMenu(m);
        }

        var mi = this._requestResponses = new DwtMenuItem({parent:m, style:DwtMenuItem.CHECK_STYLE});
        mi.setText(ZmMsg.requestResponses);
        mi.setChecked(true, true);

        sepMi = new DwtMenuItem({parent:m, style:DwtMenuItem.SEPARATOR_STYLE});
        mi = new DwtMenuItem({parent:m, style:DwtMenuItem.NO_STYLE});
        mi.setText(ZmMsg.suggestionPreferences);
        mi.addSelectionListener(this._prefListener.bind(this));
    }

	this._toolbar.addSelectionListener(ZmOperation.SPELL_CHECK, new AjxListener(this, this._spellCheckListener));
};

ZmApptComposeController.prototype._prefListener =
function(ev) {
    this._prefDialog = appCtxt.getSuggestionPreferenceDialog();
    this._prefDialog.popup(this.getCalendarAccount());
};

ZmApptComposeController.prototype.setRequestResponsesEnabled =
function(enabled) {
   if (this._requestResponses)
   this._requestResponses.setEnabled(enabled);
};

ZmApptComposeController.prototype.setRequestResponses =
function(requestResponses) {
   if (this._requestResponses)
   this._requestResponses.setChecked(requestResponses);
};

ZmApptComposeController.prototype.getRequestResponses =
function() {
    if (this._requestResponses)
    return this._requestResponses.getEnabled() ? this._requestResponses.getChecked() : true;
};

ZmApptComposeController.prototype.getNotifyList =
function(addrs) {
    var notifyList = [];
    for(var i = 0; i < addrs.length; i++) {
        notifyList.push(addrs[i]._inviteAddress || addrs[i].address || addrs[i].getEmail());
    }

    return notifyList;
}; 

ZmApptComposeController.prototype.isAttendeesEmpty =
function(appt) {
    var resources = appt.getAttendees(ZmCalBaseItem.EQUIPMENT);
	var locations = appt.getAttendees(ZmCalBaseItem.LOCATION);
	var attendees = appt.getAttendees(ZmCalBaseItem.PERSON);

	var isAttendeesNotEmpty = (attendees && attendees.length > 0) ||
							   (resources && resources.length > 0) ||
							   (locations && locations.length > 0);
    return !isAttendeesNotEmpty
};

ZmApptComposeController.prototype.checkConflicts =
function(appt, numRecurrence, attId, notifyList) {
	var resources = appt.getAttendees(ZmCalBaseItem.EQUIPMENT);
	var locations = appt.getAttendees(ZmCalBaseItem.LOCATION);
	var attendees = appt.getAttendees(ZmCalBaseItem.PERSON);

	var needsPermissionCheck = (attendees && attendees.length > 0) ||
							   (resources && resources.length > 0) ||
							   (locations && locations.length > 0);

	var callback = needsPermissionCheck
		? (new AjxCallback(this, this.checkAttendeePermissions, [appt, attId, notifyList]))
		: (new AjxCallback(this, this.saveCalItemContinue, [appt, attId, notifyList]));

	this._checkResourceConflicts(appt, numRecurrence, callback, false, true, false);
};

ZmApptComposeController.prototype.checkAttendeePermissions =
function(appt, attId, notifyList) {
	var newEmails = [];

	var attendees = appt.getAttendees(ZmCalBaseItem.PERSON);
	if (attendees && attendees.length > 0) {
		for (var i = 0; i < attendees.length; i++) {
			newEmails.push(attendees[i].getEmail());
		}
	}

	var locations = appt.getAttendees(ZmCalBaseItem.LOCATION);
	if (locations && locations.length > 0) {
		for (var i = 0; i < locations.length; i++) {
			newEmails.push(locations[i].getEmail());
		}
	}

	var resources = appt.getAttendees(ZmCalBaseItem.EQUIPMENT);
	if (resources && resources.length > 0) {
		for (var i = 0; i < resources.length; i++) {
			newEmails.push(resources[i].getEmail());
		}
	}

	if (newEmails.length) {
		this.checkPermissionRequest(newEmails, appt, attId, notifyList);
		return false;
	}

	// otherwise, just save the appointment
	this._saveCalItemFoRealz(appt, attId, notifyList);
};

// Expose the resource conflict check call to allow the ApptEditView to
// trigger a location conflict check
ZmApptComposeController.prototype.getCheckResourceConflicts =
function(appt, numRecurrence, callback, displayConflictDialog) {
    return this.checkResourceConflicts.bind(this, appt, numRecurrence, callback, displayConflictDialog);
}

ZmApptComposeController.prototype.checkResourceConflicts =
function(appt, numRecurrence, callback, displayConflictDialog) {
	return this._checkResourceConflicts(appt, numRecurrence, callback,
        true, displayConflictDialog, true);
};

ZmApptComposeController.prototype._checkResourceConflicts =
function(appt, numRecurrence, callback, showAll, displayConflictDialog, conflictCallbackOverride) {
	var mode = appt.viewMode;
	var reqId;
	if (mode!=ZmCalItem.MODE_NEW_FROM_QUICKADD && mode!= ZmCalItem.MODE_NEW) {
		if(appt.isRecurring() && mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {
			// for recurring appt - user GetRecurRequest to get full recurrence
			// information and use the component in CheckRecurConflictRequest
			var recurInfoCallback = this._checkResourceConflicts.bind(this,
                appt, numRecurrence, callback, showAll, displayConflictDialog, conflictCallbackOverride);
			reqId = this.getRecurInfo(appt, recurInfoCallback);
		}
        else {
			reqId = this._checkResourceConflicts(appt, numRecurrence, callback,
                showAll, displayConflictDialog, conflictCallbackOverride);
		}
	}
    else {
		reqId = this._checkResourceConflicts(appt, numRecurrence, callback,
            showAll, displayConflictDialog, conflictCallbackOverride);
	}
	return reqId;
};

/**
 * JSON request is used to make easy re-use of "comp" elements from GetRecurResponse.
 * 
 * @private
 */
ZmApptComposeController.prototype._checkResourceConflicts =
function(appt, numRecurrence, callback, showAll, displayConflictDialog,
         conflictCallbackOverride, recurInfo) {
	var mode = appt.viewMode,
	    jsonObj = {
            CheckRecurConflictsRequest: {
                _jsns:"urn:zimbraMail"
            }
        },
	    request = jsonObj.CheckRecurConflictsRequest,
        startDate = new Date(appt.startDate),
        comps = request.comp = [],
        comp = request.comp[0] = {},
        recurrence,
        recur;

    startDate.setHours(0,0,0,0);
	request.s = startDate.getTime();
	request.e = ZmApptComposeController.getCheckResourceConflictEndTime(
	        appt, startDate, numRecurrence);

    if (showAll) {
        request.all = "1";
    }

	if (mode!=ZmCalItem.MODE_NEW_FROM_QUICKADD && mode!= ZmCalItem.MODE_NEW) {
		request.excludeUid = appt.uid;
	}


    appt._addDateTimeToRequest(request, comp, true);

    //preserve the EXDATE (exclude recur) information
    if(recurInfo) {
        recurrence = appt.getRecurrence();
        recur = (recurInfo && recurInfo.comp) ? recurInfo.comp[0].recur : null;
        recurrence.parseExcludeInfo(recur);
    }

    if(mode != ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {
        appt._recurrence.setJson(comp);
    }

    this.setExceptFromRecurInfo(request, recurInfo);

    appt.addAttendeesToChckConflictsRequest(request);

    return appCtxt.getAppController().sendRequest({
        jsonObj: jsonObj,
        asyncMode: true,
        callback: (new AjxCallback(this, this._handleResourceConflict, [appt, callback,
            displayConflictDialog, conflictCallbackOverride])),
        errorCallback: (new AjxCallback(this, this._handleResourceConflictError, [appt, callback])),
        noBusyOverlay: true
    });
};

ZmApptComposeController.prototype.setExceptFromRecurInfo =
function(request, recurInfo) {
	var exceptInfo = recurInfo && recurInfo.except,
        i,
        s,
        e,
        exceptId,
        except,
        sNode,
        eNode,
        exceptIdNode;
	if (!exceptInfo) { return; }

	for (i in exceptInfo) {
		s = exceptInfo[i].s ? exceptInfo[i].s[0] : null;
		e = exceptInfo[i].e ? exceptInfo[i].e[0] : null;
		exceptId = exceptInfo[i].exceptId ? exceptInfo[i].exceptId[0] : null;

		except = request.except = {};
		if (s) {
			sNode = except.s = {};
			sNode.d = s.d;
			if (s.tz) {
				sNode.tz = s.tz;
			}
		}

		if (e) {
			eNode = except.e = {};
			eNode.d = e.d;
			if (e.tz) {
				eNode.tz = e.tz;
			}
		}

		if (exceptId) {
			exceptIdNode = except.exceptId = {};
			exceptIdNode.d = exceptId.d;
			if (exceptId.tz) {
				exceptIdNode.tz = exceptId.tz;
			}
		}
	}
};

// Use the (numRecurrences * the recurrence period * repeat.customCount)
// time interval to determine the endDate of the resourceConflict check
ZmApptComposeController.getCheckResourceConflictEndTime =
function(appt, originalStartDate, numRecurrence) {
    var startDate = new Date(originalStartDate.getTime());
    var recurrence = appt.getRecurrence();
    var endDate;
    var range = recurrence.repeatCustomCount * numRecurrence;
    if (recurrence.repeatType == ZmRecurrence.NONE) {
        if (appt.allDayEvent === "1") {
            endDate = new Date(appt.endDate.getTime() + AjxDateUtil.MSEC_PER_DAY);
        } else {
            endDate = appt.endDate;
        }
    } else if (recurrence.repeatType == ZmRecurrence.DAILY) {
        endDate = AjxDateUtil.roll(startDate, AjxDateUtil.DAY, range);
    } else if (recurrence.repeatType == ZmRecurrence.WEEKLY) {
        endDate = AjxDateUtil.roll(startDate, AjxDateUtil.WEEK, range);
    } else if (recurrence.repeatType == ZmRecurrence.MONTHLY) {
        endDate = AjxDateUtil.roll(startDate, AjxDateUtil.MONTH, range);
    } else if (recurrence.repeatType == ZmRecurrence.YEARLY) {
        endDate = AjxDateUtil.roll(startDate, AjxDateUtil.YEAR, range);
    }
    var endTime = endDate.getTime();
    if (recurrence.repeatEndDate) {
        var repeatEndTime = recurrence.repeatEndDate.getTime() + AjxDateUtil.MSEC_PER_DAY;
        if (endTime > repeatEndTime) {
            endTime = repeatEndTime;
        }
    }
    return endTime;
}

/**
 * Gets the recurrence definition of an appointment.
 * 
 * @param {ZmAppt}	appt 	the appointment
 * @param {AjxCallback}	recurInfoCallback 		the callback module after getting recurrence info
 */
ZmApptComposeController.prototype.getRecurInfo =
function(appt, recurInfoCallback) {
	var soapDoc = AjxSoapDoc.create("GetRecurRequest", "urn:zimbraMail");
	soapDoc.setMethodAttribute("id", appt.id);

	return appCtxt.getAppController().sendRequest({
		soapDoc: soapDoc,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleRecurInfo, [appt, recurInfoCallback])),
		errorCallback: (new AjxCallback(this, this._handleRecurInfoError, [appt, recurInfoCallback])),
		noBusyOverlay: true
	});
};

/**
 * Handle Response for GetRecurRequest call
 * 
 * @private
 */
ZmApptComposeController.prototype._handleRecurInfo =
function(appt, callback, result) {
	var recurResponse = result.getResponse().GetRecurResponse;
	if (callback) {
		callback.run(recurResponse);
	}
};

ZmApptComposeController.prototype._handleRecurInfoError =
function(appt, callback, result) {
	if (callback) {
		callback.run();
	}
};

ZmApptComposeController.prototype.checkPermissionRequest =
function(names, appt, attId, notifyList) {
    // CheckPermissions to be retired after IronMaiden.  Replaced with CheckRights
    var jsonObj = {CheckRightsRequest:{_jsns:"urn:zimbraAccount"}};
    var request = jsonObj.CheckRightsRequest;

    request.target = [];
    for (var i = 0; i < names.length; i++) {
        var targetInstance = {
            type: "account",
            by:   "name",
            key:   names[i]
        };
        targetInstance.right = [{_content: "invite"}];
        request.target.push(targetInstance);
    }

    var respCallback  = new AjxCallback(this, this.handleCheckRightsResponse, [appt, attId, names, notifyList]);
    var errorCallback = new AjxCallback(this, this.handleCheckRightsResponse, [appt, attId, names, notifyList]);
    appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback, errorCallback: errorCallback, noBusyOverlay:true});
};

ZmApptComposeController.prototype.handleCheckRightsResponse =
function(appt, attId, names, notifyList, response) {
	var checkRightsResponse = response && response._data && response._data.CheckRightsResponse;
	if (checkRightsResponse && checkRightsResponse.target) {
		var deniedAttendees = [];
		for (var i in checkRightsResponse.target) {
			if (!checkRightsResponse.target[i].allow) {
				deniedAttendees.push(names[i]);
			}
		}
		if (deniedAttendees.length > 0) {
			var msg =  AjxMessageFormat.format(ZmMsg.invitePermissionDenied, [deniedAttendees.join(",")]);
			var msgDialog = appCtxt.getMsgDialog();
			msgDialog.reset();
			msgDialog.setMessage(msg, DwtMessageDialog.INFO_STYLE);
			msgDialog.popup();
            this.enableToolbar(true);
			return;
		}
	}
	this.saveCalItemContinue(appt, attId, notifyList);
};

ZmApptComposeController.prototype._saveAfterPermissionCheck =
function(appt, attId, notifyList, msgDialog) {
	msgDialog.popdown();
	this.saveCalItemContinue(appt, attId, notifyList);
};

ZmApptComposeController.prototype.saveCalItemContinue =
function(appt, attId, notifyList) {
	this._saveCalItemFoRealz(appt, attId, notifyList);
};

ZmApptComposeController.prototype.handleCheckPermissionResponseError =
function(appt, attId, names, notifyList, response) {
	var resp = response && response._data && response._data.BatchResponse;
	this.saveCalItemContinue(appt, attId, notifyList);
};

ZmApptComposeController.prototype._handleResourceConflict =
function(appt, callback, displayConflictDialog, conflictCallbackOverride, result) {
	var conflictExist = false;
    var inst = null;
	if (result) {
		var conflictResponse = result.getResponse().CheckRecurConflictsResponse;
		inst = this._conflictingInstances = conflictResponse.inst;
		if (inst && inst.length > 0) {
			if (displayConflictDialog) {
				this.showConflictDialog(appt, callback, inst);
			}
			conflictExist = true;
			this.enableToolbar(true);
		}
	}

	if ((conflictCallbackOverride || !conflictExist) && callback) {
		callback.run(inst);
	}
};

ZmApptComposeController.prototype.showConflictDialog =
function(appt, callback, inst) {
	DBG.println("conflict instances :" + inst.length);

	var conflictDialog = this.getConflictDialog();
	conflictDialog.initialize(inst, appt, callback);
	conflictDialog.popup();
};

ZmApptComposeController.prototype.getConflictDialog =
function() {
	if (!this._resConflictDialog) {
		this._resConflictDialog = new ZmResourceConflictDialog(this._shell);
	}
	return this._resConflictDialog;
};

ZmApptComposeController.prototype._handleResourceConflictError =
function(appt, callback) {
	// continue with normal saving process via callback
	if (callback) {
		callback.run();
	}
};

ZmApptComposeController.prototype.getFreeBusyInfo =
function(startTime, endTime, emailList, callback, errorCallback, noBusyOverlay) {
	var soapDoc = AjxSoapDoc.create("GetFreeBusyRequest", "urn:zimbraMail");
	soapDoc.setMethodAttribute("s", startTime);
	soapDoc.setMethodAttribute("e", endTime);
	soapDoc.setMethodAttribute("uid", emailList);

	var acct = (appCtxt.multiAccounts)
		? this._composeView.getApptEditView().getCalendarAccount() : null;

	return appCtxt.getAppController().sendRequest({
		soapDoc: soapDoc,
		asyncMode: true,
		callback: callback,
		errorCallback: errorCallback,
		noBusyOverlay: noBusyOverlay,
		accountName: (acct ? acct.name : null)
	});
};

ZmApptComposeController.prototype._createComposeView =
function() {
	return (new ZmApptComposeView(this._container, null, this._app, this));
};

ZmApptComposeController.prototype._setComposeTabGroup =
function(setFocus) {
	DBG.println(AjxDebug.DBG2, "_setComposeTabGroup");
	var tg = this._createTabGroup();
	var rootTg = appCtxt.getRootTabGroup();
	tg.newParent(rootTg);
	tg.addMember(this._toolbar);
	var editView = this._composeView.getApptEditView();
	editView._addTabGroupMembers(tg);

	var focusItem = editView._savedFocusMember || editView._getDefaultFocusItem() || tg.getFirstMember(true);
	var ta = new AjxTimedAction(this, this._setFocus, [focusItem, !setFocus]);
	AjxTimedAction.scheduleAction(ta, 10);
};

ZmApptComposeController.prototype._getDefaultFocusItem =
function() {
    return this._composeView.getApptEditView()._getDefaultFocusItem();	
};

ZmApptComposeController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_EDIT_APPOINTMENT;
};


// Private / Protected methods

ZmApptComposeController.prototype._attendeesUpdated =
function(appt, attId, attendees, origAttendees) {
	// create hashes of emails for comparison
	var origEmails = {};
	for (var i = 0; i < origAttendees.length; i++) {
		var email = origAttendees[i].getEmail();
		origEmails[email] = true;
	}
	var fwdEmails = {};
	var fwdAddrs = appt.getForwardAddress();
	for(var i=0;i<fwdAddrs.length;i++) {
		var email = fwdAddrs[i].getAddress();
		fwdEmails[email] = true;
	}
	var curEmails = {};
	for (var i = 0; i < attendees.length; i++) {
		var email = attendees[i].getEmail();
		curEmails[email] = true;
	}

	// walk the current list of attendees and check if there any new ones
	for (var i = 0 ; i < attendees.length; i++) {
		var email = attendees[i].getEmail();
		if (!origEmails[email] && !fwdEmails[email]) {
			this._addedAttendees.push(email);
		}
	}
    
	for (var i = 0 ; i < origAttendees.length; i++) {
		var email = origAttendees[i].getEmail();
		if (!curEmails[email]) {
			this._removedAttendees.push(email);
		}
	}

	if (this._addedAttendees.length > 0 || this._removedAttendees.length > 0) {
		if (!this._notifyDialog) {
			this._notifyDialog = new ZmApptNotifyDialog(this._shell);
			this._notifyDialog.addSelectionListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._notifyDlgOkListener));
			this._notifyDialog.addSelectionListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._notifyDlgCancelListener));
		}
		appt.setMailNotificationOption(true);
		this._notifyDialog.initialize(appt, attId, this._addedAttendees, this._removedAttendees);
		this._notifyDialog.popup();
        this.enableToolbar(true);
		return true;
	}

	return false;
};


// Listeners

// Cancel button was pressed
ZmApptComposeController.prototype._cancelListener =
function(ev) {

    var isDirty = false;

    if(this._composeView.gotNewAttachments()) {
        isDirty = true;
    }else {
        var appt = this._composeView.getAppt(this._attId);
        if (appt && !appt.inviteNeverSent){
           //Check for Significant Changes
            isDirty = this._checkIsDirty(ZmApptEditView.CHANGES_SIGNIFICANT)
        }
    }

    if(isDirty){
        this._getChangesDialog().popup();
        this.enableToolbar(true);
        return;
    }

	this._app.getCalController().setNeedsRefresh(true);

	ZmCalItemComposeController.prototype._cancelListener.call(this, ev);
};

ZmApptComposeController.prototype._printListener =
function() {
	var calItem = this._composeView._apptEditView._calItem;
	var url = ["/h/printappointments?id=", calItem.invId, "&tz=", AjxTimezone.getServerId(AjxTimezone.DEFAULT)]; //bug:53493
    if (appCtxt.isOffline) {
        url.push("&zd=true", "&acct=", this._composeView.getApptEditView().getCalendarAccount().name);
    }
	window.open(appContextPath + url.join(""), "_blank");
};


// Callbacks

ZmApptComposeController.prototype._notifyDlgOkListener =
function(ev) {
	var notifyList = this._notifyDialog.notifyNew() ? this._addedAttendees : null;
	this._saveCalItemFoRealz(this._notifyDialog.getAppt(), this._notifyDialog.getAttId(), notifyList);
};

ZmApptComposeController.prototype._notifyDlgCancelListener =
function(ev) {
	this._addedAttendees.length = this._removedAttendees.length = 0;
};

ZmApptComposeController.prototype._changeOrgCallback =
function(appt, attId, dlg) {
	dlg.popdown();
	this._saveCalItemFoRealz(appt, attId);
};

ZmApptComposeController.prototype._saveCalItemFoRealz =
function(calItem, attId, notifyList, force){
    force = force || ( this._action == ZmCalItemComposeController.SEND );

    //organizer forwarding an appt is same as organizer editing appt while adding new attendees
    if(calItem.isForward) {
        notifyList = this.getForwardNotifyList(calItem);
    }

    this._composeView.getApptEditView().resetParticipantStatus();

    // NOTE: Once CreateAppt/ModifyAppt SOAP API changes are completed (Bug 56464), pass to
    // the base _saveCalItemFoRealz appt.alteredLocations, to create a set of location
    // exceptions along with creation/modification of the underlying appt
    // *** NOT DONE ***
    ZmCalItemComposeController.prototype._saveCalItemFoRealz.call(this, calItem, attId, notifyList, force);
};

/**
 * To get the array of forward email addresses
 *
 * @param	{ZmAppt}	appt		the appointment
 * @return	{Array}	an array of email addresses
 */
ZmApptComposeController.prototype.getForwardNotifyList =
function(calItem){
    var fwdAddrs = calItem.getForwardAddress();
    var notifyList = [];
    for(var i=0;i<fwdAddrs.length;i++) {
        var email = fwdAddrs[i].getAddress();
        notifyList.push(email);
    }
    return notifyList;
};

ZmApptComposeController.prototype._doSaveCalItem =
function(appt, attId, callback, errorCallback, notifyList){
    delete this._attendeeValidated;
    if(this._action == ZmCalItemComposeController.SEND){
        appt.send(attId, callback, errorCallback, notifyList);
    }else{
        var isMeeting = appt.hasAttendees();
        if(isMeeting){
            this._draftFlag = appt.isDraft || appt.inviteNeverSent || this._checkIsDirty(ZmApptEditView.CHANGES_INSIGNIFICANT);
        }else{
            this._draftFlag = false;
        }
        appt.save(attId, callback, errorCallback, notifyList, this._draftFlag);
    }
};

ZmApptComposeController.prototype._handleResponseSave =
function(calItem, result) {
	if (calItem.__newFolderId) {
		var folder = appCtxt.getById(calItem.__newFolderId);
		calItem.__newFolderId = null;
		this._app.getListController()._doMove(calItem, folder, null, false);
	}

    var isNewAppt;
    var viewMode = calItem.getViewMode();
    if(viewMode == ZmCalItem.MODE_NEW || viewMode == ZmCalItem.MODE_NEW_FROM_QUICKADD || viewMode == ZmAppt.MODE_DRAG_OR_SASH) {
        isNewAppt = true;
    }

    if(this.isCloseAction()) {
        calItem.handlePostSaveCallbacks();
        this.closeView();	    
    }else {
        this.enableToolbar(true);
        if(isNewAppt) {
            viewMode = calItem.isRecurring() ? ZmCalItem.MODE_EDIT_SERIES : ZmCalItem.MODE_EDIT;
        }
        calItem.setFromSavedResponse(result);
        if(this._action == ZmCalItemComposeController.SAVE){
            calItem.isDraft = this._draftFlag;
            calItem.draftUpdated = true;
        }
        this._composeView.set(calItem, viewMode);        
    }

    var msg = isNewAppt ? ZmMsg.apptCreated : ZmMsg.apptSaved;
    if(calItem.hasAttendees()){
        if(this._action == ZmCalItemComposeController.SAVE || this._action == ZmCalItemComposeController.SAVE_CLOSE){
            msg = ZmMsg.apptSaved;
        }else{
            if(viewMode != ZmCalItem.MODE_NEW){
                msg = ZmMsg.apptSent;
            }
        }              
    }
    appCtxt.setStatusMsg(msg);
    
    appCtxt.notifyZimlets("onSaveApptSuccess", [this, calItem, result]);//notify Zimlets on success
};

ZmApptComposeController.prototype._resetNavToolBarButtons =
function(view) {
	//do nothing
};

ZmApptComposeController.prototype._clearInvalidAttendeesCallback =
function(appt, attId, dlg) {
	dlg.popdown();
    this.clearInvalidAttendees();
	delete this._invalidAttendees;
    if(this._action == ZmCalItemComposeController.SAVE){
	    this._saveListener();
    }else{
        this._sendListener();
    }
};

ZmApptComposeController.prototype.clearInvalidAttendees =
function() {
	this._invalidAttendees = [];
};

ZmApptComposeController.prototype.addInvalidAttendee =
function(item) {
	if (AjxUtil.indexOf(this._invalidAttendees, item)==-1) {
		this._invalidAttendees.push(item);
	}
};

ZmApptComposeController.prototype.closeView =
function() {
	this._closeView();
};

ZmApptComposeController.prototype.forwardInvite =
function(newAppt) {
	this.show(newAppt, ZmCalItem.MODE_FORWARD_INVITE);
};

ZmApptComposeController.prototype.proposeNewTime =
function(newAppt) {
	this.show(newAppt, ZmCalItem.MODE_PROPOSE_TIME);
};

ZmApptComposeController.prototype.initComposeView =
function(initHide) {
    
	if (!this._composeView) {
		this._composeView = this._createComposeView();
        var appEditView = this._composeView.getApptEditView();
        this._savedFocusMember = appEditView._getDefaultFocusItem();

		var callbacks = {};
		callbacks[ZmAppViewMgr.CB_PRE_HIDE] = new AjxCallback(this, this._preHideCallback);
		callbacks[ZmAppViewMgr.CB_PRE_UNLOAD] = new AjxCallback(this, this._preUnloadCallback);
		callbacks[ZmAppViewMgr.CB_POST_SHOW] = new AjxCallback(this, this._postShowCallback);
		callbacks[ZmAppViewMgr.CB_PRE_SHOW] = new AjxCallback(this, this._preShowCallback);
		callbacks[ZmAppViewMgr.CB_POST_HIDE] = new AjxCallback(this, this._postHideCallback);
		if (!this._toolbar)
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
    else{
        this._savedFocusMember = this._composeView.getApptEditView()._getDefaultFocusItem();
    }
	return false;
};

ZmApptComposeController.prototype.getCalendarAccount =
function() {
    return (appCtxt.multiAccounts)
        ? this._composeView.getApptEditView().getCalendarAccount() : null;

};

ZmApptComposeController.prototype.getAttendees =
function(type) {
    return this._composeView.getAttendees(type);
};

ZmApptComposeController.prototype._postHideCallback =
function() {

	ZmCalItemComposeController.prototype._postHideCallback(); 

    if (appCtxt.getCurrentAppName() == ZmApp.CALENDAR || appCtxt.get(ZmSetting.CAL_ALWAYS_SHOW_MINI_CAL)) {
		appCtxt.getAppViewMgr().displayComponent(ZmAppViewMgr.C_TREE_FOOTER, true);
    }
};

ZmApptComposeController.prototype._postShowCallback =
function(view, force) {
	var ta = new AjxTimedAction(this, this._setFocus);
	AjxTimedAction.scheduleAction(ta, 10);
};

ZmApptComposeController.prototype.getWorkingInfo =
function(startTime, endTime, emailList, callback, errorCallback, noBusyOverlay) {
   var soapDoc = AjxSoapDoc.create("GetWorkingHoursRequest", "urn:zimbraMail");
   soapDoc.setMethodAttribute("s", startTime);
   soapDoc.setMethodAttribute("e", endTime);
   soapDoc.setMethodAttribute("name", emailList);

   var acct = (appCtxt.multiAccounts)
       ? this._composeView.getApptEditView().getCalendarAccount() : null;

   return appCtxt.getAppController().sendRequest({
       soapDoc: soapDoc,
       asyncMode: true,
       callback: callback,
       errorCallback: errorCallback,
       noBusyOverlay: noBusyOverlay,
       accountName: (acct ? acct.name : null)
   });
};

ZmApptComposeController.prototype._resetToolbarOperations =
function() {
    //do nothing - this  gets called when this controller handles a list view
};

// --- Subclass the ApptComposeController for saving Quick Add dialog appointments, and doing a
//     save when the CalColView drag and drop is used
ZmSimpleApptComposeController = function(container, app, type, sessionId) {
    ZmApptComposeController.apply(this, arguments);
    this._closeCallback = null;
    // Initialize a static/dummy compose view.  It is never actually used
    // for display (only for the function calls made to it during the save),
    // so it can be setup here.
    this.initComposeView();
};

ZmSimpleApptComposeController.prototype = new ZmApptComposeController;
ZmSimpleApptComposeController.prototype.constructor = ZmSimpleApptComposeController;

ZmSimpleApptComposeController.prototype.toString = function() { return "ZmSimpleApptComposeController"; };

ZmSimpleApptComposeController.getDefaultViewType =
function() {
	return ZmId.VIEW_SIMPLE_ADD_APPOINTMENT;
};

ZmSimpleApptComposeController.prototype.doSimpleSave =
function(appt, action, closeCallback, errorCallback, cancelCallback) {
    var ret = false;
    this._action = action;
    this._closeCallback = null;
    if(!appt.isValidDuration()){
        this._composeView.showInvalidDurationMsg();
    } else if (appt) {
        this._simpleCloseCallback  = closeCallback;
        this._simpleErrorCallback  = errorCallback;
        this._simpleCancelCallback = cancelCallback;
        ret = this._initiateSaveWithChecks(appt, null, ZmTimeSuggestionPrefDialog.DEFAULT_NUM_RECURRENCE);
    }
    return ret;
};

ZmSimpleApptComposeController.prototype._handleResponseSave =
function(calItem, result) {
    if (this._simpleCloseCallback) {
        this._simpleCloseCallback.run();
    }
    appCtxt.notifyZimlets("onSaveApptSuccess", [this, calItem, result]);//notify Zimlets on success
};

ZmSimpleApptComposeController.prototype._getErrorSaveStatus =
function(calItem, ex) {
    var status = ZmCalItemComposeController.prototype._getErrorSaveStatus.call(this, calItem, ex);
    if (!status.continueSave && this._simpleErrorCallback) {
        this._simpleErrorCallback.run(this);
    }

    return status;
};

ZmSimpleApptComposeController.prototype.initComposeView =
function() {
	if (!this._composeView) {
		// Create an empty compose view and make it always return isDirty == true
		this._composeView = this._createComposeView();
		this._composeView.isDirty = function() { return true; };
		return true;
    }
	return false;
};

ZmSimpleApptComposeController.prototype.enableToolbar =
function(enabled) { }


ZmSimpleApptComposeController.prototype.showConflictDialog =
function(appt, callback, inst) {
	DBG.println("conflict instances :" + inst.length);

	var conflictDialog = this.getConflictDialog();
	conflictDialog.initialize(inst, appt, callback, this._simpleCancelCallback);
	conflictDialog.popup();
};
}
if (AjxPackage.define("zimbraMail.calendar.controller.ZmApptController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a new appointment controller to manage read-only appointment viewing.
 * @constructor
 * @class
 *
 * @author Vince Bellows
 *
 * @param {DwtShell}	container	the containing shell
 * @param {ZmApp}		app			the containing app
 * @param {constant}	type		controller type
 * @param {string}		sessionId	the session id
 *
 * @extends		ZmCalItemComposeController
 */
ZmApptController = function(container, app, type, sessionId) {
    ZmCalItemComposeController.apply(this, arguments);
};

ZmApptController.prototype = new ZmCalItemComposeController;
ZmApptController.prototype.constructor = ZmApptController;

ZmApptController.prototype.isZmApptController = true;
ZmApptController.prototype.toString = function() { return "ZmApptController"; };

ZmApptController.DEFAULT_TAB_TEXT = ZmMsg.message;

ZmApptController.viewToTab = {};

ZmApptController.getDefaultViewType =
function() {
	return ZmId.VIEW_APPOINTMENT_READONLY;
};
ZmApptController.prototype.getDefaultViewType = ZmApptController.getDefaultViewType;

ZmApptController.prototype._createComposeView =
function() {
	// override
    return new ZmApptView(this._container,  DwtControl.ABSOLUTE_STYLE, this);
};

ZmApptController.prototype._createToolBar =
function() {

	var buttons = [ ZmOperation.SEND_INVITE, ZmOperation.SAVE, ZmOperation.CANCEL, ZmOperation.SEP,
                    ZmOperation.TAG_MENU
                    ];
    var secondaryButtons = [ZmOperation.EDIT, ZmOperation.DUPLICATE_APPT, ZmOperation.SEP,
                            ZmOperation.REPLY, ZmOperation.REPLY_ALL, ZmOperation.FORWARD_APPT, ZmOperation.PROPOSE_NEW_TIME, ZmOperation.DELETE, ZmOperation.SEP,
                            ZmOperation.SHOW_ORIG
                            ];
    if (appCtxt.get(ZmSetting.PRINT_ENABLED)) {
		buttons.push(ZmOperation.PRINT);
	}

	this._toolbar = new ZmButtonToolBar({parent:this._container, buttons:buttons, context:this._currentViewId, controller:this, secondaryButtons:secondaryButtons});
	this._toolbar.addSelectionListener(ZmOperation.SAVE, this._saveListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.CANCEL, this._cancelListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.REPLY, this._replyListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.REPLY_ALL, this._replyAllListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.FORWARD_APPT, this._forwardListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.EDIT, this._editListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.PROPOSE_NEW_TIME, this._proposeTimeListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.DELETE, this._deleteListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.DUPLICATE_APPT, this._duplicateApptListener.bind(this));
	this._toolbar.addSelectionListener(ZmOperation.SHOW_ORIG, this._showOrigListener.bind(this));

	if (appCtxt.get(ZmSetting.PRINT_ENABLED)) {
		this._toolbar.addSelectionListener(ZmOperation.PRINT, this._printListener.bind(this));
	}

    var sendButton = this._toolbar.getButton(ZmOperation.SEND_INVITE);
    sendButton.setVisible(false);


    var tagButton = this._toolbar.getButton(ZmOperation.TAG_MENU);
	if (tagButton) {
		tagButton.noMenuBar = true;
		this._setupTagMenu(this._toolbar);
	}
	// change default button style to toggle for spell check button
	var spellCheckButton = this._toolbar.getButton(ZmOperation.SPELL_CHECK);
	if (spellCheckButton) {
		spellCheckButton.setAlign(DwtLabel.IMAGE_LEFT | DwtButton.TOGGLE_STYLE);
	}

};

ZmApptController.prototype._initToolbar =
function(mode) {
    ZmCalItemComposeController.prototype._initToolbar.call(this, mode);
    var saveButton = this._toolbar.getButton(ZmOperation.SAVE);
    saveButton.setEnabled(false);

    var editButton = this._toolbar.getButton(ZmOperation.EDIT),
        forwardApptButton,
        deleteButton;

    if (editButton) {
        if (mode === ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) {
            if (editButton.getText() !== ZmMsg.editInstance) {
                editButton.setText(ZmMsg.editInstance);
                forwardApptButton = this._toolbar.getButton(ZmOperation.FORWARD_APPT);
                deleteButton = this._toolbar.getButton(ZmOperation.DELETE);
                forwardApptButton && forwardApptButton.setText(ZmMsg.forwardInstance);
                deleteButton && deleteButton.setText(ZmMsg.deleteApptInstance);
            }
        }
        else if (mode === ZmCalItem.MODE_EDIT_SERIES) {
            if (editButton.getText() !== ZmMsg.editSeries) {
                editButton.setText(ZmMsg.editSeries);
                forwardApptButton = this._toolbar.getButton(ZmOperation.FORWARD_APPT);
                deleteButton = this._toolbar.getButton(ZmOperation.DELETE);
                forwardApptButton && forwardApptButton.setText(ZmMsg.forwardSeries);
                deleteButton && deleteButton.setText(ZmMsg.deleteApptSeries);
            }
        }
        else {
            if (editButton.getText() !== ZmMsg.edit) {
                editButton.setText(ZmMsg.edit);
                forwardApptButton = this._toolbar.getButton(ZmOperation.FORWARD_APPT);
                deleteButton = this._toolbar.getButton(ZmOperation.DELETE);
                forwardApptButton && forwardApptButton.setText(ZmMsg.forward);
                deleteButton && deleteButton.setText(ZmMsg.del);
            }
        }
    }

    // bug 68451: disabling edit options for trashed appointments
    var calItem = this.getCalItem();
    var calendar = calItem && calItem.getFolder();
    var isTrash = calendar && calendar.nId==ZmOrganizer.ID_TRASH;
    var isReadOnly = calendar && calendar.isReadOnly();

    if(isTrash){
        this._disableEditForTrashedItems();
    }

    if (appCtxt.isWebClientOffline()) {
        this._disableEditForOffline();
    }
    if (isReadOnly) {
        this._disableActionsForReadOnlyAppt();
    }
    if (appCtxt.isExternalAccount()) {
        this._disableActionsForExternalAccount();
    }
};

ZmApptController.prototype._disableEditForOffline =
function() {
    var actionMenu = this._toolbar.getActionsMenu();
    if(actionMenu){
        actionMenu.enable([
            ZmOperation.EDIT,
            ZmOperation.TAG,
            ZmOperation.TAG_MENU,
            ZmOperation.REPLY,
            ZmOperation.REPLY_ALL,
            ZmOperation.PROPOSE_NEW_TIME,
            ZmOperation.DUPLICATE_APPT,
            ZmOperation.FORWARD_APPT,
            ZmOperation.DELETE,
            ZmOperation.SHOW_ORIG
        ], false);
    }
    var tagButton = this._toolbar.getButton(ZmOperation.TAG_MENU);
    if (tagButton) {
        tagButton.setEnabled(false);
    }
    var printButton = this._toolbar.getButton(ZmOperation.PRINT);
    if (printButton) {
        printButton.setEnabled(false);
    }
}

ZmApptController.prototype._disableEditForTrashedItems =
function() {
    var actionMenu = this._toolbar.getActionsMenu();
    if(actionMenu){
        actionMenu.enable([
                            ZmOperation.EDIT,
                            ZmOperation.REPLY,
                            ZmOperation.REPLY_ALL,
                            ZmOperation.PROPOSE_NEW_TIME,
                            ZmOperation.FORWARD_APPT
                            ], false);
    }
};

ZmApptController.prototype._disableActionsForReadOnlyAppt =
function() {
    var actionMenu = this._toolbar.getActionsMenu();
    if(actionMenu){
        actionMenu.enable([
                        ZmOperation.EDIT,
                        ZmOperation.TAG,
                        ZmOperation.TAG_MENU,
                        ZmOperation.FORWARD_APPT,
                        ZmOperation.PROPOSE_NEW_TIME,
                        ZmOperation.DELETE
                        ], false);
    }
    var tagButton = this._toolbar.getButton(ZmOperation.TAG_MENU);
	if (tagButton) {
        tagButton.setEnabled(false);
    }
};

ZmApptController.prototype._disableActionsForExternalAccount =
function() {
    var actionMenu = this._toolbar.getActionsMenu();
    if(actionMenu){
        actionMenu.enable([
                        ZmOperation.EDIT,
                        ZmOperation.TAG,
                        ZmOperation.TAG_MENU,
                        ZmOperation.REPLY,
                        ZmOperation.REPLY_ALL,
                        ZmOperation.PROPOSE_NEW_TIME,
                        ZmOperation.DUPLICATE_APPT,
                        ZmOperation.FORWARD_APPT,
                        ZmOperation.DELETE
                        ], false);
    }
    var tagButton = this._toolbar.getButton(ZmOperation.TAG_MENU);
	if (tagButton) {
        tagButton.setEnabled(false);
    }
};

ZmApptController.prototype._deleteListener =
function(ev) {
	var op = this.getMode();
    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }

    if (calItem.isRecurring()) {
        var mode = (op == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE)
            ? ZmCalItem.MODE_DELETE_INSTANCE
            : ZmCalItem.MODE_DELETE_SERIES;
        this._app.getCalController()._promptDeleteAppt(calItem, mode);
    }
    else {
        this._app.getCalController()._deleteAppointment(calItem);
    }
};

ZmApptController.prototype._editListener =
function(ev) {
	var op = (ev && ev.item instanceof DwtMenuItem)
		? ev.item.getData(ZmOperation.KEY_ID) : null;
    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
    this._composeView.edit(ev);
};

ZmApptController.prototype._replyListener =
function(ev) {
	var op = (ev && ev.item instanceof DwtMenuItem)
		? ev.item.getData(ZmOperation.KEY_ID) : null;
    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
    this._app.getCalController()._replyAppointment(calItem, false);
};

ZmApptController.prototype._replyAllListener =
function(ev) {
	var op = (ev && ev.item instanceof DwtMenuItem)
		? ev.item.getData(ZmOperation.KEY_ID) : null;
    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
    this._app.getCalController()._replyAppointment(calItem, true);
};

ZmApptController.prototype._saveListener =
function(ev) {
    if(!this.isDirty() || !this.getOpValue()) {
        return;
    }
	var op = (ev && ev.item instanceof DwtMenuItem)
		? ev.item.getData(ZmOperation.KEY_ID) : null;


    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
    if (calItem.isRecurring() && !op) {
        var mode = this.getMode();
        op = (mode == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE) ? ZmOperation.VIEW_APPT_INSTANCE : ZmOperation.VIEW_APPT_SERIES;
    }

	this._action =  ZmCalItemComposeController.SAVE_CLOSE;
    var saveCallback = new AjxCallback(this, this._handleSaveResponse);
    var calViewCtrl = this._app.getCalController();
	// This will trigger a call to  ZmMailMsg.sendInviteReply, which updates the offline appointment ptst field
	// and the invite mail msg.
    var respCallback = new AjxCallback(calViewCtrl, calViewCtrl._handleResponseHandleApptRespondAction, [calItem, this.getOpValue(), op, saveCallback]);
	calItem.getDetails(null, respCallback, this._errorCallback);

    //this._app.getCalController()._replyAppointment(calItem, true);
};

ZmApptController.prototype._duplicateApptListener =
function(ev) {
	var op = this.getMode();
	var appt = this.getCalItem();
	var isException = (appt.isRecurring() && op == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE);
    var calViewCtrl = this._app.getCalController();
	calViewCtrl.duplicateAppt(appt, {isException: isException});
};

ZmApptController.prototype._showOrigListener =
function(ev) {
	var appt = this.getCalItem();
    var calViewCtrl = this._app.getCalController();
	if (appt)
		calViewCtrl._showApptSource(appt);
};

ZmApptController.prototype._handleSaveResponse =
function(result, value) {
    if (appCtxt.isWebClientOffline()) {
        // Set the value of the appt stored in-memory in the list.  Normally, this would be updated
        // by a notification, but not offline.
        //var appt = this.getCalItem();
        //appt.ptst = value;

        // Update the version currently in use.  It may get updated again below, but it doesn't matter
        this.getCurrentView().setOrigPtst(value);
    }
    if (this.isCloseAction()) {
        this._closeView();
    } else {
        this.getCurrentView().setOrigPtst(value);
    }
};

ZmApptController.prototype.isCloseAction =
function() {
    return this._action == ZmCalItemComposeController.SAVE_CLOSE || this._action == ZmCalItemComposeController.SAVE;
};

ZmApptController.prototype._forwardListener =
function(ev) {
	var op = this.getMode();
    var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }

    var mode = ZmCalItem.MODE_FORWARD;
    if (calItem.isRecurring()) {
		mode = (op == ZmCalItem.MODE_EDIT_SINGLE_INSTANCE)
			? ZmCalItem.MODE_FORWARD_SINGLE_INSTANCE
			: ZmCalItem.MODE_FORWARD_SERIES;
	}

    this._app.getCalController()._forwardAppointment(calItem, mode);
};

ZmApptController.prototype._printListener =
function() {
	var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
	var url = ["/h/printappointments?id=", calItem.invId, "&tz=", AjxTimezone.getServerId(AjxTimezone.DEFAULT)]; //bug:53493
    if (appCtxt.isOffline) {
        url.push("&zd=true", "&acct=", this._composeView.getApptEditView().getCalendarAccount().name);
    }
	window.open(appContextPath + url.join(""), "_blank");
};

ZmApptController.prototype._tagButtonListener =
function(ev) {
	var toolbar = this.getCurrentToolbar();
	if (ev.item.parent == toolbar) {
		this._setTagMenu(toolbar);
	}
};

ZmApptController.prototype._setupTagMenu =
function(parent) {
	if (!parent) return;
	var tagMenu = parent.getTagMenu();
	if (tagMenu) {
		tagMenu.addSelectionListener(new AjxListener(this, this._tagListener));
	}
	if (parent instanceof ZmButtonToolBar) {
		var tagButton = parent.getOp(ZmOperation.TAG_MENU);
		if (tagButton) {
			tagButton.addDropDownSelectionListener(new AjxListener(this, this._tagButtonListener));
		}
	}
};

ZmApptController.prototype._proposeTimeListener =
function(ev) {
	var calItem = this.getCalItem();
    if(!calItem) {
        return;
    }
    //Pass mode edit to open the appt in edit mode. The mode 'propose new time' will be added later.
	var mode = ZmCalItem.MODE_EDIT;
	if (calItem.isRecurring()) {
		mode = this.getMode();
	}
	var appt = calItem;
	var clone = ZmAppt.quickClone(appt);
	clone.setProposeTimeMode(true);
	clone.getDetails(mode, new AjxCallback(this, this._proposeTimeContinue, [clone, mode]));
};

ZmApptController.prototype._proposeTimeContinue =
function(appt, mode) {
	appt.setViewMode(mode);
	AjxDispatcher.run("GetApptComposeController").proposeNewTime(appt);
};

ZmApptController.prototype._doTag =
function(items, tag, doTag) {

	var list = this._getTaggableItems(items);

	if (doTag) {
		if (list.length > 0 && list.length == items.length) {
			// there are items to tag, and all are taggable
			ZmBaseController.prototype._doTag.call(this, list, tag, doTag);
		} else {
			var msg;
			var dlg = appCtxt.getMsgDialog();
			if (list.length > 0 && list.length < items.length) {
				// there are taggable and nontaggable items
				var listener = new AjxListener(this, this._handleDoTag, [dlg, list, tag, doTag]);
				dlg.setButtonListener(DwtDialog.OK_BUTTON, listener);
				msg = ZmMsg.tagReadonly;
			} else if (list.length == 0) {
				// no taggable items
				msg = ZmMsg.nothingToTag;
			}
			dlg.setMessage(msg);
			dlg.popup();
		}
	} else if (list.length > 0) {
		ZmBaseController.prototype._doTag.call(this, list, tag, doTag);
	}
};

ZmApptController.prototype._doRemoveAllTags =
function(items) {
	var list = this._getTaggableItems(items);
	ZmBaseController.prototype._doRemoveAllTags.call(this, list);
};

ZmApptController.prototype._handleDoTag =
function(dlg, list, tag, doTag) {
	dlg.popdown();
	ZmBaseController.prototype._doTag.call(this, list, tag, doTag);
};

ZmApptController.prototype._getTaggableItems =
function(items) {
	var calItem = this.getCalItem();
    items = [];
    items.push(calItem);
	return items;
};

ZmApptController.prototype.getItems =
function() {
	return this._getTaggableItems([]);
};

ZmApptController.prototype.getCalItem =
function() {
    var ci = this._composeView ? this._composeView._calItem : null;
    return ci;
};

ZmApptController.prototype.getOpValue =
function() {
    var s = this._composeView ? this._composeView.getOpValue() : null;
    return s;
};

ZmApptController.prototype.isDirty =
function() {
    var dirty = this._composeView ? this._composeView.isDirty() : false;
    return dirty;
};

ZmApptController.prototype.getMode =
function() {
    var m = this._composeView ? this._composeView._mode : null;
    return m;
};

ZmApptController.prototype.getCurrentView =
function() {
	return this._composeView;
};

ZmApptController.prototype.getCurrentToolbar =
function() {
	return this._toolbar;
};

ZmApptController.prototype._postShowCallback =
function() {
	ZmCalItemComposeController.prototype._postShowCallback.call(this);
    this._app.setOverviewPanelContent();
};

ZmApptController.prototype.saveCalItem =
function(attId) {
    var done = true;
    if (this.isDirty()) {
        var calItem = this.getCalItem();
        if(calItem) {
            var saveCallback = new AjxCallback(this, this._handleSaveResponse);
            var calViewCtrl = this._app.getCalController();
            var respCallback =
                new AjxCallback(calViewCtrl, calViewCtrl._handleResponseHandleApptRespondAction,
                    [calItem, this.getOpValue(), null, saveCallback]);
            calItem.getDetails(null, respCallback, this._errorCallback);
            done = false;
        }
    }
    if(done && this.isCloseAction()) {
        this._closeView();
    }

};

ZmApptController.prototype._closeView =
function() {
	this._app.popView(true, this.getCurrentViewId());
    this._composeView.cleanup();
};

ZmApptController.prototype.getKeyMapName = function() {
	return "viewAppointment";
};
}
}
