if (AjxPackage.define("Contacts")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*
 * Package: Contacts
 *
 * Supports: The Contacts (address book) application
 *
 * Loaded:
 * 	- When the user goes to the Contacts application
 * 	- If the user creates a new contact
 * 	- If the user adds a participant or email address to their address book
 */

if (AjxPackage.define("zimbraMail.abook.view.ZmEditContactView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the edit contact view classes.
 */

/**
 * Creates the edit contact view.
 * @class
 * This class represents the edit contact view.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{ZmContactController}		controller		the controller
 * 
 * @extends		DwtForm
 */
ZmEditContactView = function(parent, controller) {
	if (arguments.length == 0) return;

	var form = {
		ondirty: this._handleDirty,
		items: this.getFormItems()
	};

	var params = {
		id: "editcontactform",
		parent: parent,
		className: "ZmEditContactView",
		posStyle: DwtControl.ABSOLUTE_STYLE,
		form: form
	};
	DwtForm.call(this, params);

	// add details menu, if needed
	var details = this.getControl("DETAILS");
	if (details) {
		var menu = this.__getDetailsMenu();
		if (menu) {
			details.setMenu(menu);
			details.addSelectionListener(new AjxListener(details, details.popup, [menu]));
		}
		else {
			this.setVisible("DETAILS", false);
		}
	}

	// save other state
	this._controller = controller;

	ZmTagsHelper.setupListeners(this);

	this._changeListener = new AjxListener(this, this._contactChangeListener);

	this.setScrollStyle(Dwt.SCROLL);
	this.clean = false;

	this._items.FILE_AS.control.setAriaLabel(ZmMsg.fileAsLabel);

	// Override setText method for location field such that screen reader announces as 
	// 'Location: <choosen folder name>' on traversing location field
	this._items.FOLDER.control.setText = function (text) {
		DwtLabel.prototype.setText.call(this, text);
		this._setMinWidth();
		this.setAriaLabel(ZmMsg.locationLabel + " " + text);
	}
};

ZmEditContactView.prototype = new DwtForm;
ZmEditContactView.prototype.constructor = ZmEditContactView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmEditContactView.prototype.toString = function() {
	return "ZmEditContactView";
};

// form information that you can override

/**
 * Gets the form items.
 * 
 * @return	{Hash}	a hash of form items
 */
ZmEditContactView.prototype.getFormItems = function() {
	if (!this._formItems) {
		this._formItems = [
			// debug
	//			{ id: "DEBUG", type: "DwtText", ignore:true },
			// header pseudo-items
			{ id: "FULLNAME", type: "DwtText", className: "contactHeader",
				getter: this._getFullName, ignore: true },
			// contact attribute fields
			{ id: "IMAGE", type: "ZmEditContactViewImage" },
			{ id: "ZIMLET_IMAGE", type: "DwtText" },
			{ id: "PREFIX", type: "DwtInputField", width: 38, tooltip: ZmMsg.namePrefix, hint: ZmMsg.AB_FIELD_prefix, visible: "get('SHOW_PREFIX')" },
			{ id: "FIRST", type: "DwtInputField", width: 95, tooltip: ZmMsg.firstName, hint: ZmMsg.AB_FIELD_firstName, visible: "get('SHOW_FIRST')", onblur: "this._controller.updateTabTitle()" },
			{ id: "MIDDLE", type: "DwtInputField", width: 95, tooltip: ZmMsg.middleName, hint: ZmMsg.AB_FIELD_middleName, visible: "get('SHOW_MIDDLE')" },
			{ id: "MAIDEN", type: "DwtInputField", width: 95, tooltip: ZmMsg.maidenName, hint: ZmMsg.AB_FIELD_maidenName, visible: "get('SHOW_MAIDEN')" },
			{ id: "LAST", type: "DwtInputField", width: 95, tooltip: ZmMsg.lastName, hint: ZmMsg.AB_FIELD_lastName, visible: "get('SHOW_LAST')" , onblur: "this._controller.updateTabTitle()"},
			{ id: "SUFFIX", type: "DwtInputField", width: 38, tooltip: ZmMsg.nameSuffix, hint: ZmMsg.AB_FIELD_suffix, visible: "get('SHOW_SUFFIX')" },
			{ id: "NICKNAME", type: "DwtInputField", width: 66, hint: ZmMsg.AB_FIELD_nickname, visible: "get('SHOW_NICKNAME')" },
			{ id: "COMPANY", type: "DwtInputField", width: 209, hint: ZmMsg.AB_FIELD_company, visible: "get('SHOW_COMPANY')", onblur: "this._controller.updateTabTitle()" },
			{ id: "TITLE", type: "DwtInputField", width: 209, hint: ZmMsg.AB_FIELD_jobTitle, visible: "get('SHOW_TITLE')" },
			{ id: "DEPARTMENT", type: "DwtInputField", width: 209, hint: ZmMsg.AB_FIELD_department, visible: "get('SHOW_DEPARTMENT')" },
			{ id: "NOTES", type: "DwtInputField", hint: ZmMsg.notes, width: "47em", rows:4 },
            // phonetic name fields
            { id: "PHONETIC_PREFIX", visible: "this.isVisible('PREFIX')", ignore:true },
            { id: "PHONETIC_FIRST", type: "DwtInputField", width: 95, hint: ZmMsg.AB_FIELD_phoneticFirstName, visible: "this.isVisible('FIRST')" },
            { id: "PHONETIC_MIDDLE", visible: "this.isVisible('MIDDLE')", ignore:true },
            { id: "PHONETIC_MAIDEN", visible: "this.isVisible('MAIDEN')", ignore:true },
            { id: "PHONETIC_LAST", type: "DwtInputField", width: 95, hint: ZmMsg.AB_FIELD_phoneticLastName, visible: "this.isVisible('LAST')" },
            { id: "PHONETIC_SUFFIX", visible: "this.isVisible('SUFFIX')", ignore:true },
            { id: "PHONETIC_COMPANY", type: "DwtInputField", width: 209, hint: ZmMsg.AB_FIELD_phoneticCompany, visible: "this.isVisible('COMPANY')" },
			// contact list fields
			{ id: "EMAIL", type: "ZmEditContactViewInputSelectRows", rowitem: {
				type: "ZmEditContactViewInputSelect", equals:ZmEditContactViewInputSelect.equals, params: {
					inputWidth: 352, tooltip: ZmMsg.email, hint: ZmMsg.emailAddrHint, options: this.getEmailOptions()
				}
			}, validator: ZmEditContactView.emailValidator },
			{ id: "PHONE", type: "ZmEditContactViewInputSelectRows", rowitem: {
				type: "ZmEditContactViewInputSelect", equals:ZmEditContactViewInputSelect.equals, params: {
					inputWidth: 351, tooltip: ZmMsg.phone, hint: ZmMsg.phoneNumberHint, options: this.getPhoneOptions(),
					ariaDropDownLabel: ZmMsg.phoneType
				}
			} },
			{ id: "IM", type: "ZmEditContactViewInputSelectRows", rowitem: {
				type: "ZmEditContactViewIM", equals: ZmEditContactViewIM.equals, params: {
					inputWidth: 351, tooltip: ZmMsg.imShort, hint: ZmMsg.imScreenNameHint, options: this.getIMOptions(), ariaInputLabel: ZmMsg.instanceMessage,
					ariaDropDownLabel: ZmMsg.instanceMessageType
				}
			} },
			{ id: "ADDRESS", type: "ZmEditContactViewInputSelectRows",
				rowtemplate: "abook.Contacts#ZmEditContactViewAddressRow",
				rowitem: { type: "ZmEditContactViewAddress", equals: ZmEditContactViewAddress.equals,
					params: { options: this.getAddressOptions(), ariaDropDownLabel: ZmMsg.addressType }
				}
			},
			{ id: "URL", type: "ZmEditContactViewInputSelectRows", rowitem: {
				type: "ZmEditContactViewInputSelect", equals:ZmEditContactViewInputSelect.equals, params: {
					inputWidth: 351, hint: ZmMsg.url, options: this.getURLOptions(), ariaDropDownLabel: ZmMsg.urlType
				}
			} },
			{ id: "OTHER", type: "ZmEditContactViewInputSelectRows", rowitem: {
				type: "ZmEditContactViewOther", equals:ZmEditContactViewInputSelect.equals, params: {
					inputWidth: 300,
					selectInputWidth: 112,
					hint: ZmMsg.date,
					options: this.getOtherOptions(),
					ariaInputLabel: ZmMsg.otherLabel
				}
			}, validator: ZmEditContactViewOther.validator },
			// other controls
			{ id: "DETAILS", type: "DwtButton",
				label: "\u00BB", // &raquo;
				tooltip: ZmMsg.chooseFields,
				ignore:true,
				className: "ZmEditContactViewDetailsButton",
				template: "abook.Contacts#ZmEditContactViewDetailsButton",
				onblur: "this._controller.updateTabTitle()"
			},
			{ id: "FILE_AS", type: "DwtSelect", onchange: this._handleFileAsChange, items: this.getFileAsOptions(), tooltip: ZmMsg.fileAs },
			{ id: "FOLDER", type: "DwtButton", image: "ContactsFolder", imageAltText: ZmMsg.location, tooltip: ZmMsg.location,
				enabled: "this._contact && !this._contact.isReadOnly()",
				onclick: this._handleFolderButton
			},
			{ id: "TAG", type: "DwtControl",
				enabled: "this._contact && !this._contact.isShared()",
				visible: "appCtxt.get(ZmSetting.TAGGING_ENABLED)"
			},
			{ id: "ACCOUNT", type: "DwtLabel",
				visible: "appCtxt.multiAccounts"
			},
			// NOTE: Return false onclick to prevent default action
			{ id: "VIEW_IMAGE", ignore: true, onclick: "open(get('IMAGE')) && false", visible: "get('IMAGE')" },
			{ id: "REMOVE_IMAGE", ignore: true, onclick: this._handleRemoveImage, visible: "get('IMAGE')" },
			// pseudo-items
			{ id: "JOB", notab: true, ignore:true, visible: "get('SHOW_TITLE') && get('SHOW_DEPARTMENT')" },
			{ id: "TITLE_DEPARTMENT_SEP", notab: true,
				ignore:true, visible: "get('SHOW_TITLE') && get('SHOW_DEPARTMENT')"
			}
		];
	}
	return this._formItems;
};

/**
 * validate the array of email addresses. (0, 1 or more, each from a row in the edit view)
 * @param {Array} emails
 * @returns {*}
 */
ZmEditContactView.emailValidator = function(emails) {
	for (var i = 0; i < emails.length; i++) {
		var address = emails[i];
		if (address && !AjxEmailAddress.validateAddress(address)) {
			throw ZmMsg.invalidEmailAddress;
		}
	}
	return true;
};

/**
 * Gets the form item with the given id.
 * <p>
 * <strong>Note:</strong>
 * This method is especially useful as a way to modify the default
 * set of form items without redeclaring the entire form declaration.
 *
 * @param {String}	id        [string] Form item identifier.
 * @param {Array}	[formItems] the list of form items. If not
 *                           specified, the form items array returned
 *                           by {@link #getFormItems} is used.
 *                           
 * @return	{Array}	the form items or <code>null</code> for none
 */
ZmEditContactView.prototype.getFormItemById = function(id, formItems) {
	formItems = formItems || this.getFormItems() || [];
	for (var i = 0; i < formItems.length; i++) {
		var item = formItems[i];
		if (item.id == id) return item;
	}
	return null;
};

/**
 * Gets the email options.
 * 
 * @return	{Object}	returns <code>null</code>
 */
ZmEditContactView.prototype.getEmailOptions = function() {
	return null;
};

/**
 * Gets the phone options.
 * 
 * @return	{Array}	an array of phone options
 */
ZmEditContactView.prototype.getPhoneOptions = function() {
	return [
		{ value: ZmContact.F_mobilePhone, label: ZmMsg.phoneLabelMobile },
		{ value: ZmContact.F_workPhone, label: ZmMsg.phoneLabelWork },
		{ value: ZmContact.F_workFax, label: ZmMsg.phoneLabelWorkFax },
//		{ value: "office", label: ZmMsg.office },
		{ value: ZmContact.F_companyPhone, label: ZmMsg.phoneLabelCompany },
		{ value: ZmContact.F_homePhone, label: ZmMsg.phoneLabelHome },
		{ value: ZmContact.F_homeFax, label: ZmMsg.phoneLabelHomeFax },
		{ value: ZmContact.F_pager, label: ZmMsg.phoneLabelPager },
		{ value: ZmContact.F_callbackPhone, label: ZmMsg.phoneLabelCallback },
		{ value: ZmContact.F_assistantPhone, label: ZmMsg.phoneLabelAssistant },
		{ value: ZmContact.F_carPhone, label: ZmMsg.phoneLabelCar },
		{ value: ZmContact.F_otherPhone, label: ZmMsg.phoneLabelOther },
		{ value: ZmContact.F_otherFax, label: ZmMsg.phoneLabelOtherFax }
	];
};

/**
 * Gets the IM options.
 * 
 * @return	{Array}	an array of IM options
 */
ZmEditContactView.prototype.getIMOptions = function() {
	return [
		{ value: "xmpp", label: ZmMsg.imGateway_xmpp },
		{ value: "yahoo", label: ZmMsg.imGateway_yahoo },
		{ value: "aol", label: ZmMsg.imGateway_aol },
		{ value: "msn", label: ZmMsg.imGateway_msn },
		{ value: "im", label: ZmMsg.other }
	];
};

/**
 * Gets the address options.
 * 
 * @return	{Array}	an array of address options
 */
ZmEditContactView.prototype.getAddressOptions = function() {
	return [
		{ value: "home", label: ZmMsg.home },
		{ value: "work", label: ZmMsg.work },
		{ value: "other", label: ZmMsg.other }
	];
};

/**
 * Gets the URL options.
 * 
 * @return	{Array}	an array of URL options
 */
ZmEditContactView.prototype.getURLOptions = function() {
	return [
		{ value: ZmContact.F_homeURL, label: ZmMsg.home },
		{ value: ZmContact.F_workURL, label: ZmMsg.work },
		{ value: ZmContact.F_otherURL, label: ZmMsg.other }
	];
};

/**
 * Gets the other options.
 * 
 * @return	{Array}	an array of other options
 */
ZmEditContactView.prototype.getOtherOptions = function() {
	return [
		{ value: ZmContact.F_birthday, label: ZmMsg.AB_FIELD_birthday },
		{ value: ZmContact.F_anniversary, label: ZmMsg.AB_FIELD_anniversary },
		{ value: "custom", label: ZmMsg.AB_FIELD_custom }
	];
};

/**
 * Gets the "file as" options.
 * 
 * @return	{Array}	an array of "file as" options
 */
ZmEditContactView.prototype.getFileAsOptions = function() {
	return [
		{ id: "FA_LAST_C_FIRST", value: ZmContact.FA_LAST_C_FIRST, label: ZmMsg.AB_FILE_AS_lastFirst },
		{ id: "FA_FIRST_LAST", value: ZmContact.FA_FIRST_LAST, label: ZmMsg.AB_FILE_AS_firstLast },
		{ id: "FA_COMPANY", value: ZmContact.FA_COMPANY, label: ZmMsg.AB_FILE_AS_company },
		{ id: "FA_LAST_C_FIRST_COMPANY", value: ZmContact.FA_LAST_C_FIRST_COMPANY, label: ZmMsg.AB_FILE_AS_lastFirstCompany },
		{ id: "FA_FIRST_LAST_COMPANY", value: ZmContact.FA_FIRST_LAST_COMPANY, label: ZmMsg.AB_FILE_AS_firstLastCompany },
		{ id: "FA_COMPANY_LAST_C_FIRST", value: ZmContact.FA_COMPANY_LAST_C_FIRST, label: ZmMsg.AB_FILE_AS_companyLastFirst },
		{ id: "FA_COMPANY_FIRST_LAST", value: ZmContact.FA_COMPANY_FIRST_LAST, label: ZmMsg.AB_FILE_AS_companyFirstLast }
		// TODO: [Q] ZmContact.FA_CUSTOM ???
	];
};

//
// Constants
//

// Message dialog placement
ZmEditContactView.DIALOG_X = 50;
ZmEditContactView.DIALOG_Y = 100;

ZmEditContactView.SHOW_ID_PREFIXES = [
	"PREFIX","FIRST","MIDDLE","MAIDEN","LAST","SUFFIX","NICKNAME","TITLE","DEPARTMENT","COMPANY"
];
ZmEditContactView.SHOW_ID_LABELS = [
	ZmMsg.AB_FIELD_prefix,
	ZmMsg.AB_FIELD_firstName,
	ZmMsg.AB_FIELD_middleName,
	ZmMsg.AB_FIELD_maidenName,
	ZmMsg.AB_FIELD_lastName,
	ZmMsg.AB_FIELD_suffix,
	ZmMsg.AB_FIELD_nickname,
	ZmMsg.AB_FIELD_jobTitle,
	ZmMsg.AB_FIELD_department,
	ZmMsg.AB_FIELD_company
];

ZmEditContactView.ALWAYS_SHOW = {
	FIRST: true, LAST: true, TITLE: true, COMPANY: true
};

ZmEditContactView.ATTRS = {
	FILE_AS: ZmContact.F_fileAs,
	FOLDER: ZmContact.F_folderId,
	IMAGE: ZmContact.F_image,
	ZIMLET_IMAGE: ZmContact.F_zimletImage,
	PREFIX: ZmContact.F_namePrefix,
	SUFFIX: ZmContact.F_nameSuffix,
	MAIDEN: ZmContact.F_maidenName,
	FIRST: ZmContact.F_firstName,
    PHONETIC_FIRST: ZmContact.F_phoneticFirstName,
	MIDDLE: ZmContact.F_middleName,
	LAST: ZmContact.F_lastName,
    PHONETIC_LAST: ZmContact.F_phoneticLastName,
	NICKNAME: ZmContact.F_nickname,
	TITLE: ZmContact.F_jobTitle,
	DEPARTMENT: ZmContact.F_department,
	COMPANY: ZmContact.F_company,
    PHONETIC_COMPANY: ZmContact.F_phoneticCompany,
	NOTES: ZmContact.F_notes
};

ZmEditContactView.updateFieldLists = function() {

ZmEditContactView.LISTS = {
	ADDRESS: {attrs:ZmContact.ADDRESS_FIELDS}, // NOTE: placeholder for custom handling
	EMAIL: {attrs:ZmContact.EMAIL_FIELDS, onlyvalue:true},
	PHONE: {attrs:ZmContact.PHONE_FIELDS},
	IM: {attrs:ZmContact.IM_FIELDS, onlyvalue:true},
	URL: {attrs:ZmContact.URL_FIELDS},
	OTHER: {attrs:ZmContact.OTHER_FIELDS}
};

}; // updateFieldLists
ZmEditContactView.updateFieldLists();

//
// Data
//

ZmEditContactView.prototype.TEMPLATE = "abook.Contacts#ZmEditContactView";

//
// Public methods
//

/**
 * Sets the contact.
 * 
 * @param	{ZmContact}	contact		the contact
 * @param	{Boolean}	isDirty		<code>true</code> if the contact is dirty
 */
ZmEditContactView.prototype.set = function(contact, isDirty) {
	if (typeof arguments[0] == "string") {
		DwtForm.prototype.set.apply(this, arguments);
		return;
	}

	// save contact
	this._contact = this._item = contact;

	// fill in base fields
	for (var id in ZmEditContactView.ATTRS) {
		var value = contact.getAttr(ZmEditContactView.ATTRS[id]);
		if (id === "FOLDER" || id === "IMAGE") {
			continue;
		}
		if (id === "FILE_AS") {
			value = value || ZmContact.FA_LAST_C_FIRST;
		}
		this.setValue(id, value);
	}
	this.setValue("IMAGE", (contact && contact.getImageUrl(ZmContact.NO_MAX_IMAGE_WIDTH)) || "", true);

	// fill in folder field
	if (this.getControl("FOLDER")) {
		var folderOrId = contact && contact.getAddressBook();
		if (!folderOrId && (appCtxt.getCurrentViewType() == ZmId.VIEW_CONTACT_SIMPLE)) {
			var overview = appCtxt.getApp(ZmApp.CONTACTS).getOverview();
			folderOrId = overview && overview.getSelected();
			if (folderOrId && folderOrId.type != ZmOrganizer.ADDRBOOK) {
				folderOrId = null;
			}
			if (folderOrId && folderOrId.id && folderOrId.id == ZmFolder.ID_DLS) { //can't create under Distribution Lists virtual folder
				folderOrId = null;
			}
		}

        //check introduced to avoid choosing a readonly/shared folder as default folder location 
		this._setFolder((folderOrId && !folderOrId.isReadOnly()) ? folderOrId : ZmOrganizer.ID_ADDRBOOK);

	}

	if (this.getControl("TAG"))
		this._setTags(contact);

	// check show detail items for fields with values
	for (var id in ZmEditContactView.ATTRS) {
		var showId = "SHOW_"+id;
		var control = this.getControl(showId);
		if (control == null) continue;
		var checked = id in ZmEditContactView.ALWAYS_SHOW || (this.getValue(id) || "") != "";
		this.setValue(showId, checked);
		control.setChecked(checked, true); // skip notify
	}

	// populate lists
	this._listAttrs = {};
	var nattrs = contact.getNormalizedAttrs();
	for (var id in ZmEditContactView.LISTS) {
		switch (id) {
			case "ADDRESS": {
				this.__initRowsAddress(nattrs, id, this._listAttrs);
				break;
			}
			case "OTHER": {
				var list = ZmEditContactView.LISTS[id];
				this.__initRowsOther(nattrs, id, list.attrs, list.onlyvalue, this._listAttrs);
				break;
			}
			default: {
				var list = ZmEditContactView.LISTS[id];
				this.__initRowsControl(nattrs, id, list.attrs, list.onlyvalue, this._listAttrs);
			}
		}
	}

	// mark form as clean and update display
	if (!isDirty) {
		this.reset(true);
	}
	this._handleDirty();
	this.update();

	// listen to changes in the contact
	if (contact) {
		contact.removeChangeListener(this._changeListener);
	}
	contact.addChangeListener(this._changeListener);

	// notify zimlets that a new contact is being shown.
	appCtxt.notifyZimlets("onContactEdit", [this, this._contact, this._htmlElId]);
};

/**
 * Gets the contact.
 * 
 * @return	{ZmContact}	the contact
 */
ZmEditContactView.prototype.getContact = function() {
	return this._contact;
};

/**
 * Gets the modified attributes.
 * 
 * @return	{Hash}	a hash of attributes
 */
ZmEditContactView.prototype.getModifiedAttrs = function() {
	var itemIds = this.getDirtyItems();
	var counts = {};
	var attributes = {};

	// get list of modified attributes
	for (var i = 0; i < itemIds.length; i++) {
		var id = itemIds[i];
		if (id == "ACCOUNT") { continue; }
		var value = this.getValue(id);
		if (id in ZmEditContactView.LISTS) {
			var items = value;
			var addressTypeCounts = [];
			for (var j = 0; j < items.length; j++) {
				var item = items[j];
				if (id == "ADDRESS") {
					var type = item.type;
					addressTypeCounts[type] = addressTypeCounts[type] || 1;
					var itemAttributes = {};
					var foundNonEmptyAttr = false;
					for (var prop in item) {
						if (prop === "type") {
							continue;
						}
						var value = item[prop];
						var att = ZmContact.getAttributeName(type + prop, addressTypeCounts[type]);
						itemAttributes[att] = value;
						foundNonEmptyAttr = foundNonEmptyAttr || value;
					}
					if (foundNonEmptyAttr) {
						addressTypeCounts[type]++;
						for (var itemAtt in itemAttributes) {
							attributes[itemAtt] = itemAttributes[itemAtt];
						}
					}
				}
				else {
					var onlyvalue = ZmEditContactView.LISTS[id] && ZmEditContactView.LISTS[id].onlyvalue;
					var v = onlyvalue ? item : item.value;
					if (!v) continue;
					var list = ZmEditContactView.LISTS[id];
					var a = onlyvalue ? list.attrs[0] : item.type;
					if (id === "OTHER" && AjxUtil.arrayContains(AjxUtil.values(ZmEditContactView.ATTRS), a)) {
						//ignore attributes named the same as one of our basic attributes.
						continue;
					}
					if (!counts[a]) counts[a] = 0;
					var count = ++counts[a];
					a = ZmContact.getAttributeName(a, count);
					attributes[a] = v;
				}
			}
		}
		else {
			var a = ZmEditContactView.ATTRS[id];
			attributes[a] = value;
		}
	}

	// compare against existing fields
	var anames = AjxUtil.keys(attributes);
	var listAttrs = this._listAttrs;
	for (var id in listAttrs) {
		if (!this.isDirty(id)) continue;
		var prefixes = AjxUtil.uniq(AjxUtil.map(listAttrs[id], ZmContact.getPrefix));
		for (var i = 0; i < prefixes.length; i++) {
			// clear fields from original contact from normalized attr names
			var attrs = AjxUtil.keys(this._contact.getAttrs(prefixes[i]));
			var complement = AjxUtil.complement(anames, attrs);
			for (var j = 0; j < complement.length; j++) {
				attributes[complement[j]] = "";
			}
		}
	}

	// was anything modified?
	if (AjxUtil.keys(attributes).length == 0) {
		return null;
	}

	// make sure we set the folder (when new)
	if (!attributes[ZmContact.F_folderId] && !this._contact.id) {
		attributes[ZmContact.F_folderId] = this.getValue("FOLDER");
	}

	if (attributes[ZmContact.F_image] && attributes[ZmContact.F_image] === this._contact.getAttr(ZmContact.F_zimletImage)) {
		// Slightly hacky - 2 cases could lead here:
		// 1. user had an uploaded image, and deleted it. The field (which we use to show both cases) reverts to show the Zimlet (external) image.
		// 2. user didn't have an uploaded image. Field was showing the the Zimlet image.
		// In both cases we need to clear the Zimlet URL from F_image. For case 2 we don't really need to set the field at all since it doesn't change, but
		// this way it's simpler.
		attributes[ZmContact.F_image] = "";
	}
	// set the value for IMAGE to just the attachment id
	if (attributes[ZmContact.F_image]) {
		var value = this.getValue("IMAGE");
		var m = /aid=(.*)/.exec(value);
		if (m) {
			// NOTE: ZmContact.modify expects the "aid_" prefix.
			attributes[ZmContact.F_image] = "aid_"+m[1];
		}
	}

	return attributes;
};

/**
 * Checks if the view is empty.
 * 
 * @return	{Boolean}	<code>true</code> if the view is empty
 */
ZmEditContactView.prototype.isEmpty = function(items) {
	items = items || this._items;
	for (var id in items) {
		var item = items[id];
		if (this.isIgnore(id) || id == "FILE_AS") continue;
		var value = this.getValue(id);
		if (value) {
			if (!AjxUtil.isArray(value)) {
				if (id == "FOLDER") {
					if (value != item.ovalue) return false;
				} else {
					if (value !== "") return false;
				}
			} else {
				for (var i=0; i<value.length; i++) {
					var valueitem = value[i];
					if (valueitem) {
						if (id=="ADDRESS") {
							if (!ZmEditContactViewAddress.equals(valueitem, {type: valueitem.type})) return false;
						} else {
							if (!(valueitem.value==="" || valueitem==="")) return false;
						}
					}
				}
			}
		}
	}
	return true;
};

/**
 * @private
 */
ZmEditContactView.prototype.enableInputs = function(bEnable) {
	// ignore
};

/**
 * Cleanup the view.
 * 
 */
ZmEditContactView.prototype.cleanup = function() {
	this._contact = this._item = null;
	this.clean = true;
};

ZmEditContactView.prototype.dispose =
function() {
	ZmTagsHelper.disposeListeners(this);
	DwtComposite.prototype.dispose.apply(this, arguments);
};

ZmEditContactView.prototype._setTags =
function(contact) {
	//use the helper to get the tags.
	var tagsHtml = ZmTagsHelper.getTagsHtml(contact || this._item, this);

	var tagControl = this.getControl("TAG");
	if (!tagControl) {
		return;
	}
	tagControl.clearContent();
	if (tagsHtml.length > 0) {
		tagControl.setContent(tagsHtml);
		tagControl.setVisible(true);
	}
	else {
		tagControl.setVisible(false);
	}
};

ZmEditContactView._onBlur =
function() {
	this._controller._updateTabTitle();
};

//
// ZmListController methods
//

/**
 * Gets the list.
 * 
 * @return	{ZmContactList}	the list	
 */
ZmEditContactView.prototype.getList = function() { return null; };

/**
 * Gets the controller.
 * 
 * @return	{ZmContactController}	the controller
 */
ZmEditContactView.prototype.getController = function() {
	return this._controller;
};

// Following two overrides are a hack to allow this view to pretend it's a list view
ZmEditContactView.prototype.getSelection = function() {
	return this.getContact();
};

ZmEditContactView.prototype.getSelectionCount = function() {
	return 1;
};

/**
 * Gets the title.
 * 
 * @return	{String}	the title
 */
ZmEditContactView.prototype.getTitle = function() {
	return [ZmMsg.zimbraTitle, ZmMsg.contact].join(": ");
};

//
// ZmListView methods
//

ZmEditContactView.prototype._checkItemCount = function() {};
ZmEditContactView.prototype._handleResponseCheckReplenish = function() {};

//
// Protected methods
//

/**
 * @private
 */
ZmEditContactView.prototype._getFullName = function(defaultToNull) {
	var contact = {
		fileAs: this.getValue("FILE_AS"),
		firstName: this.getValue("FIRST"), lastName: this.getValue("LAST"),
		company: this.getValue("COMPANY")
	};
	return ZmContact.computeFileAs(contact) || (defaultToNull ? null : ZmMsg.noName);
};

/**
 * @private
 */
ZmEditContactView.prototype._getDefaultFocusItem = function() {
	return this.getControl(appCtxt.get(ZmSetting.PHONETIC_CONTACT_FIELDS) ? "LAST" : "FIRST");
};

/**
 * @private
 */
ZmEditContactView.prototype._setFolder = function(organizerOrId) {
	var organizer = organizerOrId instanceof ZmOrganizer ? organizerOrId : appCtxt.getById(organizerOrId);
	this.setLabel("FOLDER", organizer.getName());
	this.setValue("FOLDER", organizer.id);
	this.setImage("FOLDER", organizer.getIconWithColor(), ZmMsg.locationLabel);
	if (appCtxt.multiAccounts) {
		this.setValue("ACCOUNT", organizer.getAccount().getDisplayName());
	}
};

/**
 * @private
 */
ZmEditContactView.prototype._getDialogXY =
function() {
	var loc = Dwt.toWindow(this.getHtmlElement(), 0, 0, null, true);
	return new DwtPoint(loc.x + ZmEditContactView.DIALOG_X, loc.y + ZmEditContactView.DIALOG_Y);
};

// listeners

/**
 * @private
 */
ZmEditContactView.prototype._handleDirty = function() {
	var items = this.getDirtyItems();
	// toggle save
	var toolbar = this._controller && this._controller.getCurrentToolbar();
	if (toolbar) {
		var dirty = items.length > 0 ? items.length > 1 || items[0] != "IMAGE" || this._contact.id : false;

		// Creating a new contact with only the folder set should not be saveable until at least one other field has a value
		var needitems = AjxUtil.hashCopy(this._items);
		delete needitems["FOLDER"];
		var empty = this.isEmpty(needitems); // false if one or more fields are set, excluding the folder field

		toolbar.enable(ZmOperation.SAVE, dirty && !empty);
	}
	// debug information
	this.setValue('DEBUG', items.join(', '));
};

/**
 * @private
 */
ZmEditContactView.prototype._handleDetailCheck = function(itemId, id) {
	this.setValue(itemId, !this.getValue(itemId));
	this.update();
	var control = this.getControl(id);
	if (control) {
        control.disableFocusHdlr(); //disable focus handler so hint is displayed
		control.focus();
        control.enableFocusHdlr(); //re-enable
        //Bug fix # 80423 - attach a onKeyDown handler for Firefox.
        if (AjxEnv.isFirefox) {
            control.enableKeyDownHdlr();
        }
	}
};

ZmEditContactView.prototype._handleRemoveImage = function() {
	var image = this.getValue("IMAGE", ""); //could be user uploaded, or zimlet (e.g. LinkedInImage Zimlet) one since we use both in same field.
	var zimletImage = this.getValue("ZIMLET_IMAGE", "");
	if (image !== zimletImage) {
		//user uploaded image - this is the one we remove. Show the zimlet one instead.
		this.set("IMAGE", zimletImage);
		return;
	}
	//otherwise it's the Zimlet image we remove
	this.set("ZIMLET_IMAGE", "");
	this.set("IMAGE", "");  //show the image field empty. Again we use the same field for regular user uploaded and for zimlet provided.
};

/**
 * @private
 */
ZmEditContactView.prototype._handleFileAsChange = function() {
	var fa = this.getValue("FILE_AS");
	var showCompany =
        ZmEditContactView.ALWAYS_SHOW["COMPANY"] ||
		fa == ZmContact.FA_COMPANY ||
		fa == ZmContact.FA_LAST_C_FIRST_COMPANY ||
		fa == ZmContact.FA_FIRST_LAST_COMPANY ||
		fa == ZmContact.FA_COMPANY_LAST_C_FIRST ||
		fa == ZmContact.FA_COMPANY_FIRST_LAST
	;
	var company = this.getValue("COMPANY");
	if (showCompany) {
		this.setValue("SHOW_COMPANY", true);
		this.setVisible("COMPANY", true);
	}
	else if (!company) {
		this.setValue("SHOW_COMPANY", false);
		this.setVisible("COMPANY", false);
	}
};

/**
 * @private
 */
ZmEditContactView.prototype._handleFolderButton = function(ev) {
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleChooseFolder));
	var params = {
		overviewId:		dialog.getOverviewId(ZmApp.CONTACTS),
		title:			ZmMsg.chooseAddrBook,
		treeIds:		[ZmOrganizer.ADDRBOOK],
		skipReadOnly:	true,
		skipRemote:		false,
		noRootSelect:	true,
		appName:		ZmApp.CONTACTS
	};
	params.omit = {};
	params.omit[ZmFolder.ID_TRASH] = true;
	dialog.popup(params);
};

/**
 * @private
 */
ZmEditContactView.prototype._handleChooseFolder = function(organizer) {
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.popdown();
	this._setFolder(organizer);
};

/**
 * @private
 */
ZmEditContactView.prototype._contactChangeListener = function(ev) {
	if (ev.type != ZmEvent.S_CONTACT) return;
	if (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL) {
		this._setTags();
	}
};

//
// Private methods
//

/**
 * @private
 */
ZmEditContactView.prototype.__getDetailsMenu = function() {
	var menu = new DwtMenu({parent: this.getControl("DETAILS"), style: DwtMenu.POPUP_STYLE, id: "ContactDetailsMenu"});
	var ids = ZmEditContactView.SHOW_ID_PREFIXES;
	var labels = ZmEditContactView.SHOW_ID_LABELS;
	var count = 0;
	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		if (this.getControl(id)) {
			var menuitem = new DwtMenuItem({parent: menu, style: DwtMenuItem.CHECK_STYLE, id: "ContactDetailsMenu_" + id});
			menuitem.setText(labels[i]);
			// NOTE: Always show first and last but don't allow to change
			if (id in ZmEditContactView.ALWAYS_SHOW) {
				menuitem.setChecked(true, true);
				menuitem.setEnabled(false);
			}
			var itemId = "SHOW_"+id;
			var listener = new AjxListener(this, this._handleDetailCheck, [itemId, id]);
			menuitem.addSelectionListener(listener);
			this._registerControl({ id: itemId, control: menuitem, ignore: true });
			count++;
		}
	}
	return count > 2 ? menu : null;
};

/**
 * @private
 */
ZmEditContactView.prototype.__initRowsControl =
function(nattrs,id,prefixes,onlyvalue,listAttrs,skipSetValue) {
	var array = [];
	for (var j = 0; j < prefixes.length; j++) {
		var prefix = prefixes[j];
		for (var i = 1; true; i++) {
			var a = ZmContact.getAttributeName(prefix, i);
			if (a != prefix && AjxUtil.indexOf(prefixes, a) != -1) break;
			var value = nattrs[a];
			if (!value) break;
			array.push(onlyvalue ? value : { type:prefix,value:value });
			if (!listAttrs[id]) listAttrs[id] = [];
			listAttrs[id].push(a);
		}
	}
	if (!skipSetValue) {
		this.setValue(id, array);
	}
	return array;
};

/**
 * @private
 */
ZmEditContactView.prototype.__initRowsOther =
function(nattrs,id,prefixes,onlyvalue,listAttrs) {
	var array = this.__initRowsControl.call(this,nattrs,id,prefixes,onlyvalue,listAttrs,true);

	// gather attributes we know about
	var attributes = {};
	for (var attrId in ZmEditContactView.ATTRS) {
		attributes[ZmEditContactView.ATTRS[attrId]] = true;
	}
	for (var listId in ZmEditContactView.LISTS) {
		var list = ZmEditContactView.LISTS[listId];
		if (!list.attrs) continue;
		for (var i = 0; i < list.attrs.length; i++) {
			attributes[list.attrs[i]] = true;
		}
	}
	for (var i = 0; i < ZmContact.ADDR_PREFIXES.length; i++) {
		var prefix = ZmContact.ADDR_PREFIXES[i];
		for (var j = 0; j < ZmContact.ADDR_SUFFIXES.length; j++) {
			var suffix = ZmContact.ADDR_SUFFIXES[j];
			attributes[prefix+suffix] = true;
		}
	}

	// add attributes on contact that we don't know about
	for (var aname in nattrs) {
		var anameNormalized = ZmContact.getPrefix(aname);
		if (ZmContact.IS_IGNORE[anameNormalized]) continue;
		if (!(anameNormalized in attributes)) {
			array.push({type:anameNormalized,value:nattrs[aname]});
			if (!listAttrs[id]) listAttrs[id] = [];
			listAttrs[id].push(aname);
		}
	}

	this.setValue(id, array);
};

/**
 * @private
 */
ZmEditContactView.prototype.__initRowsAddress = function(nattrs,id,listAttrs) {
	var array = [];
	var prefixes = ZmContact.ADDR_PREFIXES;
	var suffixes = ZmContact.ADDR_SUFFIXES;
	for (var k = 0; k < prefixes.length; k++) {
		var prefix = prefixes[k];
		for (var j = 1; true; j++) {
			var address = null;
			for (var i = 0; i < suffixes.length; i++) {
				var suffix = suffixes[i];
				var a = ZmContact.getAttributeName(prefix+suffix, j);
				var value = nattrs[a];
				if (!value) continue;
				if (!address) address = {};
				address[suffix] = value;
				if (!listAttrs[id]) listAttrs[id] = [];
				listAttrs[id].push(a);
			}
			if (!address) break;
			address.type = prefix;
			array.push(address);
		}
	}
	this.setValue("ADDRESS", array);
};

// functions


//
// Class: ZmEditContactViewImage
//
/**
 * Creates the contact view image.
 * @class
 * This class represents a contact view image.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		DwtControl
 * 
 * @private
 */
ZmEditContactViewImage = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "ZmEditContactViewImage";
	params.posStyle = Dwt.RELATIVE_STYLE;
	params.id = params.parent.getHTMLElId()+"_IMAGE";
	DwtControl.apply(this, arguments);

	var el = this.getHtmlElement();
	el.innerHTML = [
		"<div style='width:48;height:48'>",
			"<img id='",this._htmlElId,"_img' width='48' height='48'>",
		"</div>",
		"<div id='",this._htmlElId,"_badge' style='position:absolute;"
        ,"bottom:",(AjxEnv.isMozilla ? -4 : 0), ";right:", (AjxEnv.isMozilla ? 3 : 0),"px'>"
	].join("");
	el.style.cursor = "pointer";

	this._src = "";
	this._imgEl = document.getElementById(this._htmlElId+"_img");
	this._imgEl.onload = AjxCallback.simpleClosure(this._imageLoaded, this);
	this._badgeEl = document.getElementById(this._htmlElId+"_badge");

	this._setMouseEvents();

	this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(Dwt.addClass, [el,DwtControl.HOVER]));
	this.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(Dwt.delClass, [el,DwtControl.HOVER]));
	this.addListener(DwtEvent.ONMOUSEUP, new AjxListener(this, this._chooseImage));

	this.setToolTipContent(ZmMsg.addImg);
};
ZmEditContactViewImage.prototype = new DwtControl;
ZmEditContactViewImage.prototype.constructor = ZmEditContactViewImage;
ZmEditContactViewImage.prototype.isFocusable = true;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewImage.prototype.toString = function() {
	return "ZmEditContactViewImage";
};

// Constants

ZmEditContactViewImage.IMAGE_URL = "/service/content/proxy?aid=@aid@";

// Public methods

/**
 * Sets the image value.
 * 
 * @param	{String}	value	the image src value
 * @private
 */
ZmEditContactViewImage.prototype.setValue = function(value, promptOnError) {
	// Save current image source to display in case user picks an improper file.
	this._currentSrc = this._src;
	// Save original image source to know if "Do you want to save..." prompt is needed
	if (typeof this._originalSrc === "undefined") {
		this._originalSrc = this._src;
	}
	this._src = value;
	if (!value) {
		this._imgEl.src = ZmZimbraMail.DEFAULT_CONTACT_ICON;
		this._badgeEl.className = "ImgAdd";
		this.setToolTipContent(ZmMsg.addImg);
		this._imgEl.alt = ZmMsg.addImg;
	}
	else {
		this._imgEl.src = value;
		this._badgeEl.className = "ImgEditBadge";
		this.setToolTipContent(ZmMsg.editImg);
		this._imgEl.alt = ZmMsg.editImg;
	}
	this.parent.setDirty("IMAGE", true);
    this._imgEl.onerror = this._handleCorruptImageError.bind(this, promptOnError);
};

/**
 * Gets the value.
 * 
 * @return	{String}	the image src value
 * @private
 */
ZmEditContactViewImage.prototype.getValue = function() {
	return this._src;
};

// Protected methods

ZmEditContactViewImage.prototype._focus = function() {
    Dwt.addClass(this.getHtmlElement(), DwtControl.FOCUSED);
};
ZmEditContactViewImage.prototype._blur = function() {
    Dwt.delClass(this.getHtmlElement(), DwtControl.FOCUSED);
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._imageLoaded = function() {
	this._imgEl.removeAttribute("width");
	this._imgEl.removeAttribute("height");
	var w = this._imgEl.width;
	var h = this._imgEl.height;
    this._imgEl.setAttribute(w>h ? 'width' : 'height', 48);
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._chooseImage = function() {
	var dialog = appCtxt.getUploadDialog();
	dialog.setAllowedExtensions(["png","jpg","jpeg","gif"]);
	var folder = null;
	var callback = new AjxCallback(this, this._handleImageSaved);
	var title = ZmMsg.uploadImage;
	var location = null;
	var oneFileOnly = true;
	var noResolveAction = true;
    var showNotes = false;
    var isImage = true;
	dialog.popup(null, folder, callback, title, location, oneFileOnly, noResolveAction, showNotes ,isImage);
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._handleImageSaved = function(folder, filenames, files) {
	var dialog = appCtxt.getUploadDialog();
	dialog.popdown();
	this.setValue(ZmEditContactViewImage.IMAGE_URL.replace(/@aid@/, files[0].guid), true);
	this.parent.update();
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._createElement = function() {
	return document.createElement("FIELDSET");
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._handleCorruptImageError = function(promptOnError) {
	// display current image if exists, otherwise will set default contact image
    this.setValue(this._currentSrc);
	if (this._originalSrc == this._currentSrc) {
		// == not === to acount for null and "" which should satisfy the condition
		this.parent.setDirty("IMAGE", false);
	}
	if (promptOnError) {
		// Don't display this dialog in cases where image is missing not due to user input.
		// E.g. LinkedIn changed their url schema which led to broken links. In such cases
		// don't obtrusively prompt the user to select an image, but pretend it was never set.
		this._popupCorruptImageErrorDialog();
	}
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._popupCorruptImageErrorDialog = function() {
    var dlg = this.corruptImageErrorDlg;
    if(dlg){
       dlg.popup();
    }
    else{
        dlg = appCtxt.getMsgDialog();
        this.corruptImageErrorDlg = dlg;
	    dlg.setMessage(ZmMsg.errorCorruptImageFile, DwtMessageDialog.CRITICAL_STYLE, ZmMsg.corruptFile);
        dlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._corruptImageErrorDialogOkListener));
        dlg.popup();
    }
};

/**
 * @private
 */
ZmEditContactViewImage.prototype._corruptImageErrorDialogOkListener = function() {
    this.corruptImageErrorDlg.popdown();
    this._chooseImage();
};

//
// Class: ZmEditContactViewRows
//

/**
 * Creates the contact view rows.
 * @class
 * This class represents the contact view rows.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		DwtFormRows
 * 
 * @private
 */
ZmEditContactViewRows = function(params) {
	if (arguments.length == 0) return;
	if (!params.formItemDef) params.formItemDef = {};
	// keep track of maximums
	var rowitem = params.formItemDef.rowitem;
	var rowparams = rowitem && rowitem.params;
	var rowoptions = this._options = (rowparams && rowparams.options) || [];
	for (var i = 0; i < rowoptions.length; i++) {
		var option = rowoptions[i];
		if (option.max) {
			if (!this._maximums) this._maximums = {};
			this._maximums[option.value] = { max: option.max, count: 0 };
		}
	}
	// create rows control
	params.formItemDef.id = params.formItemDef.id || Dwt.getNextId();
	params.formItemDef.onremoverow = "this.setDirty(true)";
	params.className = params.className || "ZmEditContactViewRows";
	params.id = [params.parent.getHTMLElId(),params.formItemDef.id].join("_");
	DwtFormRows.apply(this, arguments);
    this.setScrollStyle(Dwt.VISIBLE);
};
ZmEditContactViewRows.prototype = new DwtFormRows;
ZmEditContactViewRows.prototype.constructor = ZmEditContactViewRows;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewRows.prototype.toString = function() {
	return "ZmEditContactViewRows";
};

ZmEditContactViewRows.prototype.TEMPLATE = "abook.Contacts#ZmEditContactViewRows";

// Public methods

ZmEditContactViewRows.prototype.setDirty = function() {
	DwtFormRows.prototype.setDirty.apply(this, arguments);
	this.parent.setDirty(this._itemDef.id, this.isDirty());
};

/**
 * Checks if the row of the given type is at maximum.
 * 
 * @param	{constant}	type		the type
 * @return	{Boolean}	<code>true</code> if at maximum
 * @private
 */
ZmEditContactViewRows.prototype.isMaxedOut = function(type) {
	var maximums = this._maximums && this._maximums[type];
	return maximums != null && maximums.count >= maximums.max;
};

/**
 * Checks if all rows are at maximum.
 * 
 * @return	{Boolean}	<code>true</code> if at maximum
 * @private
 */
ZmEditContactViewRows.prototype.isAllMaxedOut = function() {
	if (!this._options || this._options.length == 0) return false;
	// determine which ones are maxed out
	var count = 0;
	for (var i = 0; i < this._options.length; i++) {
		var type = this._options[i].value;
		count += this.isMaxedOut(type) ? 1 : 0;
	}
	// are all of the options maxed out?
	return count >= this._options.length;
};

//
// Class: ZmEditContactViewInputSelectRows
//

/**
 * Creates the input select rows.
 * @class
 * This class represents the input select rows for the contact view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewRows
 * 
 * @private
 */
ZmEditContactViewInputSelectRows = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewRows.apply(this, arguments);
};
ZmEditContactViewInputSelectRows.prototype = new ZmEditContactViewRows;
ZmEditContactViewInputSelectRows.prototype.constructor = ZmEditContactViewInputSelectRows;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewInputSelectRows.prototype.toString = function() {
	return "ZmEditContactViewInputSelectRows";
};

// DwtFormRows methods

/**
 * Gets the max rows.
 * 
 * @return	{int}	the maximum rows
 * @private
 */
ZmEditContactViewInputSelectRows.prototype.getMaxRows = function() {
	return this.isAllMaxedOut() ? this.getRowCount() : ZmEditContactViewRows.prototype.getMaxRows.call(this);
};

/**
 * Sets the value.
 * 
 * @param	{Array|String}		array		an array of {String} values
 * @private
 */
ZmEditContactViewInputSelectRows.prototype.setValue = function(array) {
	if (arguments[0] instanceof Array) {
		DwtFormRows.prototype.setValue.apply(this, arguments);
		this._resetMaximums();
	}
	else {
		var id = String(arguments[0]);
		var adjust1 = id && this._subtract(id);
		DwtFormRows.prototype.setValue.apply(this, arguments);
		var adjust2 = id && this._add(id);
		if (adjust1 || adjust2) this._adjustMaximums();
	}
};

/**
 * Adds a row.
 * 
 * @param		{ZmItem}	itemDef		the item definition (not used)
 * @param	{int}	index		the index to add the row at
 * @private
 */
ZmEditContactViewInputSelectRows.prototype.addRow = function(itemDef, index) {
	DwtFormRows.prototype.addRow.apply(this, arguments);
	index = index != null ? index : this.getRowCount() - 1;
	var adjust = this._add(index);
	if (adjust) this._adjustMaximums();
	var value = this.getValue(index);
	// select first one that is not maxed out
	if (value && this.isMaxedOut(value.type) && this._options.length > 0 && 
	    this._maximums[value.type].count > this._maximums[value.type].max) {
		var options = this._options;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			if (!this.isMaxedOut(option.value)) {
				value.type = option.value;
				this.setValue(index, value);
				break;
			}
		}
	}
	
	if (this._rowCount >= this._maxRows) {
		for (var i = 0; i < this._rowCount; i++) {
			this.setVisible(this._items[i]._addId, false);
		}
	}
	if (AjxEnv.isFirefox) this._updateLayout();
};

/**
 * Removes a row.
 * 
 * @param	{String}		indexOrId	the row index or item id
 * @private
 */
ZmEditContactViewInputSelectRows.prototype.removeRow = function(indexOrId) {
	var adjust = this._subtract(indexOrId);
	DwtFormRows.prototype.removeRow.apply(this, arguments);
	if (adjust) this._adjustMaximums();
	if (AjxEnv.isFirefox) this._updateLayout();
};

/**
 * @private
 */
ZmEditContactViewInputSelectRows.prototype._setControlIds = function(rowId, index) {
	DwtFormRows.prototype._setControlIds.call(this, rowId, index);
	var item = this._items[rowId];
	var control = item && item.control;
	if (control && control._setControlIds) {
		control._setControlIds(rowId, index);
	}
};

// Protected methods

/**
 * @private
 */
ZmEditContactViewInputSelectRows.prototype._subtract = function(indexOrId) {
	var value = this.getValue(indexOrId);
	return this._subtractType(value && value.type);
};
ZmEditContactViewInputSelectRows.prototype._subtractType = function(type) {
	if (!this._maximums || !this._maximums[type]) return false;
	this._maximums[type].count--;
	return true;
};
ZmEditContactViewInputSelectRows.prototype._add = function(indexOrId) {
	var value = this.getValue(indexOrId);
	return this._addType(value && value.type);
};
ZmEditContactViewInputSelectRows.prototype._addType = function(type) {
	if (!this._maximums || !this._maximums[type]) return false;
	this._maximums[type].count++;
	return true;
};

ZmEditContactViewInputSelectRows.prototype._adjustMaximums = function() {
	if (!this._maximums || !this._options) return;
	// determine which ones are maxed out
	var enabled = {};
	var count = 0;
	for (var i = 0; i < this._options.length; i++) {
		var type = this._options[i].value;
		var maxed = this.isMaxedOut(type);
		enabled[type] = !maxed;
		count += maxed ? 1 : 0;
	}
	// are all of the options maxed out?
	var allMaxed = count == this._options.length;
	// en/disable controls as needed
	var rowCount = this.getRowCount();
	for (var i = 0; i < rowCount; i++) {
		var control = this.getControl(i);
		if (control.enableOptions) {
			control.enableOptions(enabled);
		}
		// TODO: Will this override the max rows add button visibility?
		this.setVisible(this._items[i]._addId, !allMaxed);
	}
};

// TODO: This is a hack to avoid bad counting error. Should
// TODO: really find the cause of the error.
ZmEditContactViewInputSelectRows.prototype._resetMaximums = function() {
	if (!this._maximums) return;
	for (var type in this._maximums) {
		this._maximums[type].count = 0;
	}
	var rowCount = this.getRowCount();
	for (var i = 0; i < rowCount; i++) {
		var value = this.getValue(i);
		var maximum = this._maximums[value && value.type];
		if (maximum) {
			maximum.count++;
		}
	}
};

// On FF, the selects are sometimes rendered incorrectly.
ZmEditContactViewInputSelectRows.prototype._updateLayout = function() {
	for (var i = 0, cnt = this.getRowCount(); i < cnt; i++) {
		this.getControl(i).reRenderSelect();
		this.getControl(i).reRenderInput();
	}
};

//
// Class: ZmEditContactViewInputSelect
//

/**
 * Creates the contact view input select.
 * @class
 * This class represents an input select.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		DwtComposite
 * 
 * @private
 */
ZmEditContactViewInputSelect = function(params) {
	if (arguments.length == 0) return;
	this._formItemId = params.formItemDef.id;
	this._options = params.options || [];
	this._ariaDropDownLabel = params.ariaDropDownLabel;
	this._cols = params.cols;
	this._rows = params.rows;
	this._hint = params.hint;
	DwtComposite.apply(this, arguments);
	this._tabGroup = new DwtTabGroup(this._htmlElId);
	this._createHtml(params.template);
	if (this._input) {
		if (params.inputWidth || params.inputHeight) {
			Dwt.setSize(this._input.getInputElement(), params.inputWidth, params.inputHeight);
		}
		if (params.ariaInputLabel) {
			this._input.getInputElement().setAttribute('aria-label', params.ariaInputLabel);
		}
	}
};
ZmEditContactViewInputSelect.prototype = new DwtComposite;
ZmEditContactViewInputSelect.prototype.constructor = ZmEditContactViewInputSelect;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewInputSelect.prototype.toString = function() {
	return "ZmEditContactViewInputSelect";
};

// Data

ZmEditContactViewInputSelect.prototype.TEMPLATE = "abook.Contacts#ZmEditContactViewInputSelect";

// Public methods

/**
 * Sets the value.
 * 
 * @param	{Object}	value		the value
 * @private
 */
ZmEditContactViewInputSelect.prototype.setValue = function(value) {
	var hasOptions = this._options.length > 0;
	var inputValue = hasOptions ? value && value.value : value;
	if (hasOptions && this._select) {
		this._select.setSelectedValue((value && value.type) || this._options[0].value);
	}
	if (this._input) {
		if (this._select)
			this._input.setEnabled(this._select.getValue() != "_NONE");
		this._input.setValue(inputValue || "");
	}
};

/**
 * Gets the value.
 * 
 * @return	{Object}		the value
 * @private
 */
ZmEditContactViewInputSelect.prototype.getValue = function() {
	var hasOptions = this._options.length > 0;
	var inputValue = this._input ? this._input.getValue() : "";
	return hasOptions ? {
		type:  this._select ? this._select.getValue() : "",
		value: inputValue
	} : inputValue;
};

/**
 * Sets the dirty flag.
 * 
 * @param	{Boolean}	dirty		(not used)
 * @private
 */
ZmEditContactViewInputSelect.prototype.setDirty = function(dirty) {
	if (this.parent instanceof DwtForm) {
		this.parent.setDirty(true);
	}
};

/**
 * Checks if the two items are equal.
 * 
 * @param	{Object}	a		item a
 * @param	{Object}	b		item b
 * 
 * @private
 */
ZmEditContactViewInputSelect.equals = function(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	var hasOptions = this._options.length > 0;
	return hasOptions ? a.type == b.type && a.value == b.value : a == b;
};

// Hooks

ZmEditContactViewInputSelect.prototype.enableOptions = function(enabled) {
	if (!this._select || !this._select.enableOption) return;
	var type = this.getValue().type;
	for (var id in enabled) {
		this._select.enableOption(id, id == type || enabled[id]);
	}
};

// Protected methods

ZmEditContactViewInputSelect.prototype._focus =
function() {
	this._input.focus();
};

ZmEditContactViewInputSelect.prototype._setControlIds = function(rowId, index) {
	var id = this.getHTMLElId();
	this._setControlId(this, id+"_value");
	this._setControlId(this._input, id);
	this._setControlId(this._select, id+"_select");
};

ZmEditContactViewInputSelect.prototype._setControlId = DwtFormRows.prototype._setControlId;

ZmEditContactViewInputSelect.prototype._createHtml = function(templateId) {
	var tabIndexes = this._tabIndexes = [];
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, {id:this._htmlElId});
	tabIndexes.sort(DwtForm.__byTabIndex);
	for (var i = 0; i < tabIndexes.length; i++) {
		var control = tabIndexes[i].control;
		this._tabGroup.addMember(control.getTabGroupMember() || control);
	}
};

ZmEditContactViewInputSelect.prototype._createHtmlFromTemplate = function(templateId, data) {
	DwtComposite.prototype._createHtmlFromTemplate.apply(this, arguments);

	var tabIndexes = this._tabIndexes;
	var inputEl = document.getElementById(data.id+"_input");
	if (inputEl) {
		this._input = this._createInput();
		this._input.replaceElement(inputEl);
		if (inputEl.getAttribute("notab") != "true") {
			tabIndexes.push({
				tabindex: inputEl.getAttribute("tabindex") || Number.MAX_VALUE,
				control: this._input
			});
		}
	}

	var selectEl = document.getElementById(data.id+"_select");
	var hasOptions = this._options.length > 0;
	if (hasOptions && selectEl) {
		this._select = this._createSelect(this._options);
		this._select.addChangeListener(new AjxListener(this, this._handleSelectChange));
		this._select.replaceElement(selectEl);
		if (selectEl.getAttribute("notab") != "true") {
			tabIndexes.push({
				tabindex: selectEl.getAttribute("tabindex") || Number.MAX_VALUE,
				control: this._select
			});
		}
		this._select.setVisible(this._options.length > 1);
		if (this._input)
			this._input.setEnabled(this._select.getValue() != "_NONE");
	}
};

ZmEditContactViewInputSelect.prototype._createInput = function() {
	var input = new DwtInputField({parent:this,size:this._cols,rows:this._rows});
	input.setHint(this._hint);
	input.setHandler(DwtEvent.ONKEYDOWN, AjxCallback.simpleClosure(this._handleInputKeyDown, this, input));
	input.setHandler(DwtEvent.ONKEYUP, AjxCallback.simpleClosure(this._handleInputKeyUp, this, input));
	input.setHandler(DwtEvent.ONMOUSEDOWN, AjxCallback.simpleClosure(this._handleMouseDown, this, input));
	if (AjxEnv.isIE  && !AjxEnv.isIE9) {
		// Add a handler to account for IE's 'clear an input field' X control. IE10+
		input.setHandler(DwtEvent.ONMOUSEUP,   this._handleMouseUp.bind(this, input));
	}
	input.setHandler(DwtEvent.ONPASTE, AjxCallback.simpleClosure(this._onPaste, this, input));
	return input;
};

ZmEditContactViewInputSelect.prototype._createSelect = function(options) {
	var id = [this.getHTMLElId(),"select"].join("_");
	var select = new DwtSelect({parent:this,id:id});
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		var maxedOut = this.parent.isMaxedOut(option.value);
		select.addOption(option.label || option.value, i == 0 && !maxedOut, option.value);
		if (maxedOut) {
			select.enableOption(option.value, false);
		}
	}

	if (this._ariaDropDownLabel) {
		select.setAriaLabel(this._ariaDropDownLabel);
	}
	return select;
};

ZmEditContactViewInputSelect.prototype.reRenderSelect = function() {
	if (this._select && this._select.updateRendering)
		this._select.updateRendering();
};

ZmEditContactViewInputSelect.prototype.reRenderInput = function() {
	if (this._input) {
		var value = this._input.getValue();
		if (value && value != "") {
			this._input.setValue(value+" ");
			this._input.setValue(value);
		}
	}
};

ZmEditContactViewInputSelect.prototype._handleInputKeyDown = function(input, evt) {
	var value = input.getValue();
	input.setData("OLD_VALUE", value);
	return true;
};

ZmEditContactViewInputSelect.prototype._handleInputKeyUp = function(input, evt) {
	var ovalue = input.getData("OLD_VALUE");
	var nvalue = input.getValue();
	if (ovalue != null && ovalue != nvalue) {
		this.setDirty(true);
	}
	return true;
};

ZmEditContactViewInputSelect.prototype._handleMouseDown =
function(input, evt) {
	var value = input.getValue();
	input.setData("OLD_VALUE", value);
	return true;
};

ZmEditContactViewInputSelect.prototype._handleMouseUp = function(input, evt) {
	// Handle IE's 'clear the input field' X - Delay testing until its had a chance to
	// clear the field
	setTimeout(this._checkCleared.bind(this, input), 0);
	return true;
};
ZmEditContactViewInputSelect.prototype._checkCleared = function(input) {
	// Check for a change in input
	var ovalue = input.getData("OLD_VALUE");
	var nvalue = input.getValue();
	if (ovalue != null && ovalue != nvalue) {
		this.setDirty(true);
	}
};

ZmEditContactViewInputSelect.prototype._onPaste =
function(input, evt) {
	var ovalue = input.getData("OLD_VALUE");
	if (ovalue != null) {
		AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._checkInput, [input]), 100);
	}
};

ZmEditContactViewInputSelect.prototype._checkInput =
function(input) {
	var ovalue = input.getData("OLD_VALUE");
	var nvalue = input.getValue();
	if (ovalue != null && ovalue != nvalue) {
		this.setDirty(true);
	}
	return true;
};


ZmEditContactViewInputSelect.prototype._handleSelectChange = function(evt, skipFocus) {
	var args = evt._args;
	var adjust1 = this.parent._subtractType(args.oldValue);
	var adjust2 = this.parent._addType(args.newValue);
	if (adjust1 || adjust2) {
		this.parent._adjustMaximums();
	}
	this.setDirty(true);
	if (this._input && this._select) {
		var enabled = this._select.getValue() != "_NONE";
		this._input.setEnabled(enabled);
		if (enabled && !skipFocus)
			this._input.focus();
	}
};

// DwtControl methods

ZmEditContactViewInputSelect.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * Creates the input select rows.
 * @class
 * This class represents the input double select rows for the contact view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewRows
 * 
 * @private
 */
ZmEditContactViewInputDoubleSelectRows = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewInputSelectRows.apply(this, arguments);

	var rowitem = params.formItemDef.rowitem;
	var rowparams = rowitem && rowitem.params;
	var rowoptions2 = this._options2 = (rowparams && rowparams.options2) || [];
	for (var i = 0; i < rowoptions2.length; i++) {
		var option = rowoptions2[i];
		if (option.max) {
			if (!this._maximums2) this._maximums2 = {};
			this._maximums2[option.value] = { max: option.max, count: 0 };
		}
	}

};
ZmEditContactViewInputDoubleSelectRows.prototype = new ZmEditContactViewInputSelectRows;
ZmEditContactViewInputDoubleSelectRows.prototype.constructor = ZmEditContactViewInputDoubleSelectRows;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewInputDoubleSelectRows.prototype.toString = function() {
	return "ZmEditContactViewInputDoubleSelectRows";
};

ZmEditContactViewInputDoubleSelectRows.prototype._subtract = function(indexOrId) {
	var value = this.getValue(indexOrId);
	var a = this._subtractType(value && value.type);
	var b = this._subtractType2(value && value.type2);
	return a && b;
};
ZmEditContactViewInputDoubleSelectRows.prototype._subtractType2 = function(type) {
	if (!this._maximums2 || !this._maximums2[type]) return false;
	this._maximums2[type].count--;
	return true;
};
ZmEditContactViewInputDoubleSelectRows.prototype._add = function(indexOrId) {
	var value = this.getValue(indexOrId);
	var a = this._addType(value && value.type);
	var b = this._addType2(value && value.type2);
	return a || b;
};
ZmEditContactViewInputDoubleSelectRows.prototype._addType2 = function(type) {
	if (!this._maximums2 || !this._maximums2[type]) return false;
	this._maximums2[type].count++;
	return true;
};

ZmEditContactViewInputDoubleSelectRows.prototype._adjustMaximums = function() {
	ZmEditContactViewInputSelectRows.prototype._adjustMaximums.call(this);
	if (!this._maximums2 || !this._options2) return;
	// determine which ones are maxed out
	var enabled = {};
	var count = 0;
	for (var i = 0; i < this._options2.length; i++) {
		var type = this._options2[i].value;
		var maxed = this.isMaxedOut2(type);
		enabled[type] = !maxed;
		count += maxed ? 1 : 0;
	}
	// are all of the options maxed out?
	var allMaxed = count == this._options2.length;
	// en/disable controls as needed
	var rowCount = this.getRowCount();
	for (var i = 0; i < rowCount; i++) {
		var control = this.getControl(i);
		if (control.enableOptions) {
			control.enableOptions(enabled);
		}
		// TODO: Will this override the max rows add button visibility?
		this.setVisible(this._items[i]._addId, !allMaxed);
	}
};

// TODO: This is a hack to avoid bad counting error. Should
// TODO: really find the cause of the error.
ZmEditContactViewInputDoubleSelectRows.prototype._resetMaximums = function() {
	ZmEditContactViewInputSelectRows.prototype._resetMaximums.call(this);
	if (!this._maximums2) return;
	for (var type in this._maximums2) {
		this._maximums2[type].count = 0;
	}
	var rowCount = this.getRowCount();
	for (var i = 0; i < rowCount; i++) {
		var value = this.getValue(i);
		var maximum = this._maximums2[value && value.type2];
		if (maximum) {
			maximum.count++;
		}
	}
};

ZmEditContactViewInputDoubleSelectRows.prototype.addRow = function(itemDef, index) {
	DwtFormRows.prototype.addRow.apply(this, arguments);
	index = index != null ? index : this.getRowCount() - 1;
	var adjust = this._add(index);
	if (adjust) this._adjustMaximums();
	var value = this.getValue(index);
	// select first one that is not maxed out

	var typeChanged = false;
	if (value && this.isMaxedOut(value.type) && this._options.length > 0 && 
	    this._maximums[value.type].count > this._maximums[value.type].max) {
		var options = this._options;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			if (!this.isMaxedOut(option.value)) {
				value.type = option.value;
				typeChanged = true;
				break;
			}
		}
	}

	if (value && this.isMaxedOut2(value.type2) && this._options2.length > 0 && 
	    this._maximums2[value.type2].count > this._maximums2[value.type2].max) {
		var options = this._options2;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			if (!this.isMaxedOut2(option.value)) {
				value.type2 = option.value;
				typeChanged = true;
				break;
			}
		}
	}
	if (typeChanged)
		this.setValue(index, value);

	if (this._rowCount >= this._maxRows) {
		for (var i = 0; i < this._rowCount; i++) {
			this.setVisible(this._items[i]._addId, false);
		}
	}
};

ZmEditContactViewInputDoubleSelectRows.prototype.isMaxedOut2 = function(type) {
	var maximums = this._maximums2 && this._maximums2[type];
	return maximums != null && maximums.count >= maximums.max;
};

/**
 * Checks if all rows are at maximum.
 * 
 * @return	{Boolean}	<code>true</code> if at maximum
 * @private
 */
ZmEditContactViewInputDoubleSelectRows.prototype.isAllMaxedOut = function() {
	if (ZmEditContactViewInputSelectRows.prototype.isAllMaxedOut.call(this)) return true;
	if (!this._options2 || this._options2.length == 0) return false;
	// determine which ones are maxed out
	var count = 0;
	for (var i = 0; i < this._options2.length; i++) {
		var type = this._options2[i].value;
		count += this.isMaxedOut2(type) ? 1 : 0;
	}
	// are all of the options maxed out?
	return count >= this._options2.length;
};

//
// Class: ZmEditContactViewInputDoubleSelect
//

/**
 * Creates the contact view input double select.
 * @class
 * This class represents an input with two selects.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewInputSelect
 * 
 * @private
 */

ZmEditContactViewInputDoubleSelect = function(params) {
	if (arguments.length == 0) return;
	this._options2 = params.options2 || [];
	ZmEditContactViewInputSelect.apply(this, arguments);
};
ZmEditContactViewInputDoubleSelect.prototype = new ZmEditContactViewInputSelect;
ZmEditContactViewInputDoubleSelect.prototype.constructor = ZmEditContactViewInputDoubleSelect;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewInputDoubleSelect.prototype.toString = function() {
	return "ZmEditContactViewInputDoubleSelect";
};

// Data

ZmEditContactViewInputDoubleSelect.prototype.TEMPLATE = "abook.Contacts#ZmEditContactViewInputDoubleSelect";

// Public methods

/**
 * Sets the value.
 * 
 * @param	{Object}	value		the value
 * @private
 */
ZmEditContactViewInputDoubleSelect.prototype.setValue = function(value) {
	var hasOptions = this._options.length > 0;
	var hasOptions2 = this._options2.length > 0;
	var inputValue = hasOptions || hasOptions2 ? value && value.value : value;
	if (hasOptions && this._select) {
		this._select.setSelectedValue((value && value.type) || this._options[0].value);
	}
	if (hasOptions2 && this._select2) {
		this._select2.setSelectedValue((value && value.type2) || this._options2[0].value);
	}
	if (this._input) {
		if (this._select || this._select2)
			this._input.setEnabled((this._select && this._select.getValue() != "_NONE") && (this._select2 && this._select2.getValue() != "_NONE"));
		this._input.setValue(inputValue || "");
	}
};

/**
 * Gets the value.
 * 
 * @return	{Object}		the value
 * @private
 */
ZmEditContactViewInputDoubleSelect.prototype.getValue = function() {
	var hasOptions = this._options.length > 0;
	var hasOptions2 = this._options2.length > 0;
	var inputValue = this._input ? this._input.getValue() : "";
	return hasOptions || hasOptions2 ? {
		type: this._select ? this._select.getValue() : "",
		type2: this._select2 ? this._select2.getValue() : "",
		value: inputValue
	} : inputValue;
};

/**
 * Checks if the two items are equal.
 * 
 * @param	{Object}	a		item a
 * @param	{Object}	b		item b
 * 
 * @private
 */
ZmEditContactViewInputDoubleSelect.equals = function(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	var hasOptions = this._options.length > 0;
	var hasOptions2 = this._options2.length > 0;
	if (hasOptions) {
		if (a.type != b.type || a.value != b.value)
			return false;
	}
	if (hasOptions2) {
		if (a.type2 != b.type2 || a.value != b.value)
			return false;
	}
	if (!hasOptions && !hasOptions2)
		if (a != b)
			return false;
	return true;
};

// Hooks

ZmEditContactViewInputDoubleSelect.prototype.enableOptions = function(enabled, enabled2) {
	if (this._select && this._select.enableOption) {
		var type = this.getValue().type;
		for (var id in enabled) {
			this._select.enableOption(id, id == type || enabled[id]);
		}
	}
	if (this._select2 && this._select2.enableOption) {
		var type = this.getValue().type2;
		for (var id in enabled2) {
			this._select2.enableOption(id, id == type || enabled2[id]);
		}
	}
};

// Protected methods

ZmEditContactViewInputDoubleSelect.prototype._setControlIds = function(rowId, index) {
	var id = this.getHTMLElId();
	this._setControlId(this, id+"_value");
	this._setControlId(this._input, id);
	this._setControlId(this._select, id+"_select");
	this._setControlId(this._select2, id+"_select2");
};

ZmEditContactViewInputDoubleSelect.prototype._setControlId = DwtFormRows.prototype._setControlId;


ZmEditContactViewInputDoubleSelect.prototype._createHtmlFromTemplate = function(templateId, data) {
	DwtComposite.prototype._createHtmlFromTemplate.apply(this, arguments);

	var tabIndexes = this._tabIndexes;
	var inputEl = document.getElementById(data.id+"_input");
	if (inputEl) {
		this._input = this._createInput();
		this._input.replaceElement(inputEl);
		if (inputEl.getAttribute("notab") != "true") {
			tabIndexes.push({
				tabindex: inputEl.getAttribute("tabindex") || Number.MAX_VALUE,
				control: this._input
			});
		}
	}

	var selectEl = document.getElementById(data.id+"_select");
	var hasOptions = this._options.length > 0;
	if (hasOptions && selectEl) {
		this._select = this._createSelect(this._options);
		this._select.addChangeListener(new AjxListener(this, this._handleSelectChange));
		this._select.replaceElement(selectEl);
		if (selectEl.getAttribute("notab") != "true") {
			tabIndexes.push({
				tabindex: selectEl.getAttribute("tabindex") || Number.MAX_VALUE,
				control: this._select
			});
		}
		this._select.setVisible(this._options.length > 1);
	}

	var selectEl2 = document.getElementById(data.id+"_select2");
	var hasOptions2 = this._options2.length > 0;
	if (hasOptions2 && selectEl2) {
		this._select2 = this._createSelect2(this._options2);
		this._select2.addChangeListener(new AjxListener(this, this._handleSelectChange2));
		this._select2.replaceElement(selectEl2);
		if (selectEl2.getAttribute("notab") != "true") {
			tabIndexes.push({
				tabindex: selectEl.getAttribute("tabindex") || Number.MAX_VALUE,
				control: this._select2
			});
		}
		this._select2.setVisible(this._options2.length > 1);
	}

	if (this._input) {
		if (this._select || this._select2)
			this._input.setEnabled((this._select && this._select.getValue() != "_NONE") && (this._select2 && this._select2.getValue() != "_NONE"));
	}
};

ZmEditContactViewInputDoubleSelect.prototype._createSelect2 = function(options) {
	var id = [this.getHTMLElId(),"select2"].join("_");
	var select = new DwtSelect({parent:this,id:id});
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		select.addOption(option.label || option.value, i == 0, option.value);
	}
	return select;
};

ZmEditContactViewInputDoubleSelect.prototype.reRenderSelect = function() {
	ZmEditContactViewInputSelect.prototype.reRenderSelect.call(this);
	this._select2.updateRendering();
};

ZmEditContactViewInputDoubleSelect.prototype._handleSelectChange = function(evt, skipFocus) {
	var args = evt._args;
	var adjust1 = this.parent._subtractType(args.oldValue);
	var adjust2 = this.parent._addType(args.newValue);
	if (adjust1 || adjust2) {
		this.parent._adjustMaximums();
	}
	this.setDirty(true);
	if (this._input) {
		var enabled = this._select.getValue() != "_NONE" && this._select2.getValue() != "_NONE";
		this._input.setEnabled(enabled);
		if (enabled && !skipFocus)
			this._input.focus();
	}
};

ZmEditContactViewInputDoubleSelect.prototype._handleSelectChange2 = function(evt, skipFocus) {
	var args = evt._args;
	var adjust1 = this.parent._subtractType2(args.oldValue);
	var adjust2 = this.parent._addType2(args.newValue);
	if (adjust1 || adjust2) {
		this.parent._adjustMaximums();
	}
	this.setDirty(true);
	if (this._input) {
		var enabled = this._select.getValue() != "_NONE" && this._select2.getValue() != "_NONE";
		this._input.setEnabled(enabled);
		if (enabled && !skipFocus)
			this._input.focus();
	}
};

//
// Class: ZmEditContactViewOther
//

/**
 * Creates the contact view other.
 * @class
 * This class represents the contact view other field.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewInputSelect
 * 
 * @private
 */
ZmEditContactViewOther = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewInputSelect.apply(this, arguments);
	var option = params.options && params.options[0];
	this.setValue({type:option && option.value});
    if (this._select && (params.selectInputWidth || params.selectInputHeight)) {
        Dwt.setSize(this._select.input, params.selectInputWidth, params.selectInputHeight);
    }
};
ZmEditContactViewOther.prototype = new ZmEditContactViewInputSelect;
ZmEditContactViewOther.prototype.constructor = ZmEditContactViewOther;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewOther.prototype.toString = function() {
	return "ZmEditContactViewOther";
};

// Data

ZmEditContactViewOther.prototype.TEMPLATE = "abook.Contacts#ZmEditContactViewOther";

ZmEditContactViewOther.prototype.DATE_ATTRS = { "birthday": true, "anniversary": true };

ZmEditContactViewOther.validator = function(item) {
	if (AjxUtil.isArray(item)) {
		if (!item.length) return true;
		var result = [];
		for (var i=0; i<item.length; i++) {
			var value = ZmEditContactViewOther.validator(item[i]);
			if (value || value==="")
				result.push({type: item[i].type, value: value});
			else
				return false;
		}
		return result;
	} else {
		if (item.type in ZmEditContactViewOther.prototype.DATE_ATTRS || item.type.replace(/^other/,"").toLowerCase() in ZmEditContactViewOther.prototype.DATE_ATTRS) {
			var dateStr = AjxStringUtil.trim(item.value);
			if (dateStr.length) {
                var aDate = ZmEditContactViewOther.parseDate(dateStr);
				if (isNaN(aDate) || aDate == null) {
					throw ZmMsg.errorDate;
				}
				return ZmEditContactViewOther.formatDate(aDate);
			}
			return dateStr;
		}
		if (/\d+$/.test(item.type)) {
			throw AjxMessageFormat.format(ZmMsg.errorInvalidContactOtherFieldName, item.type);
		}
		return item.value;
	}
};

// Public methods

/**
 * Sets the value.
 * 
 * @param	{Object}	value		the value
 * @private
 */
ZmEditContactViewOther.prototype.setValue = function(value) {
	ZmEditContactViewInputSelect.prototype.setValue.apply(this, arguments);
	this._resetPicker();
};

/**
 * Gets the value.
 * 
 * @return	{Object}	the value
 * @private
 */
ZmEditContactViewOther.prototype.getValue = function() {
	return {
		type: this._select.getValue() || this._select.getText(),
		value: this._input.getValue()
	};
};

// Protected methods

ZmEditContactViewOther.prototype._setControlIds = function(rowId, index) {
	var id = this.getHTMLElId();
	ZmEditContactViewInputSelect.prototype._setControlIds.apply(this, arguments);
	this._setControlId(this._picker, id+"_picker");
};

ZmEditContactViewOther.prototype._createHtmlFromTemplate = function(templateId, data) {
	ZmEditContactViewInputSelect.prototype._createHtmlFromTemplate.apply(this, arguments);

	var tabIndexes = this._tabIndexes;
	var pickerEl = document.getElementById(data.id+"_picker");
	if (pickerEl) {
		var id = [this.getHTMLElId(),"picker"].join("_");
		this._picker = new DwtButton({parent:this,id:id});
		this._picker.setImage("CalendarApp", null, ZmMsg.chooseDate);
        this._picker.popup = ZmEditContactViewOther.__DwtButton_popup; // HACK

        var menu = new DwtMenu({parent:this._picker,style:DwtMenu.GENERIC_WIDGET_STYLE});
        this._picker.getHtmlElement().className += " ZmEditContactViewOtherCalendar";
		this._picker.setAriaLabel(ZmMsg.calendarPicker);
		this._picker.setMenu(menu);
		this._picker.replaceElement(pickerEl);

        var listener = new AjxListener(this, this._handleDropDown);
        this._picker.addSelectionListener(listener);
        this._picker.addDropDownSelectionListener(listener);

        var container = new DwtComposite({parent:menu});
        // TODO: use template?

		var calendar = new DwtCalendar({parent:container});
        calendar.setSkipNotifyOnPage(true);
		calendar.setDate(new Date());
		calendar.setFirstDayOfWeek(appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0);
		calendar.addSelectionListener(new AjxListener(this,this._handleDateSelection,[calendar]));
		tabIndexes.push({
			tabindex: pickerEl.getAttribute("tabindex") || Number.MAX_VALUE,
			control: this._picker
		});
        this._calendar = calendar;

        var checkbox = new DwtCheckbox({parent:container});
        checkbox.setText(ZmMsg.includeYear);
		checkbox.addSelectionListener(new AjxListener(this, this._handleDateSelection,[calendar]));
        this._calendarIncludeYear = checkbox;
	}                                                        
};

// HACK: This function executes in the scope of the calendar picker
// HACK: button. It avoids the calendar being resized and scrolled
// HACK: when there's not enough room to display the menu below the
// HACK: button.
ZmEditContactViewOther.__DwtButton_popup = function() {
    var button = this;
    var size = button.getSize();
    var location = Dwt.toWindow(button.getHtmlElement(), 0, 0);
    var menu = button.getMenu();
    var menuSize = menu.getSize();
    var windowSize = DwtShell.getShell(window).getSize();
	if ((location.y + size.y) + menuSize.y > windowSize.y) {
		button._menuPopupStyle = DwtButton.MENU_POPUP_STYLE_ABOVE;
	}
    if (AjxEnv.isIE) {
        menu.getHtmlElement().style.width = "150px";
    }
    DwtButton.prototype.popup.call(button, menu);
};

ZmEditContactViewOther.prototype._createSelect = function() {
	var id = [this.getHTMLElId(),"select"].join("_");
	var select = new DwtComboBox({parent:this,inputParams:{size:14},id:id});
	var options = this._options || [];
	for (var i = 0; i < options.length; i++) {
		var option = options[i];
		select.add(option.label || option.value, option.value, i == 0);
	}
	select.addChangeListener(new AjxListener(this, this._resetPicker));
	// HACK: Make it look like a DwtSelect.
	select.setSelectedValue = select.setValue;
	select.setAriaLabel(select.getValue());
	return select;
};

ZmEditContactViewOther.prototype._resetPicker = function() {
	if (this._picker) {
		var type = this.getValue().type;
		this._picker.setVisible(type in this.DATE_ATTRS);
		this._select.setAriaLabel(type);
	}
};

ZmEditContactViewOther.parseDate = function(dateStr) {
    // NOTE: Still try to parse date string in locale-specific
    // NOTE: format for backwards compatibility.
    var noYear = dateStr.match(/^--/);
    var pattern = noYear ? "--MM-dd" : "yyyy-MM-dd";
    var aDate = AjxDateFormat.parse(pattern, dateStr);

    if (isNaN(aDate) || aDate == null) {
        aDate = AjxDateUtil.simpleParseDateStr(dateStr);
    }
    else if (noYear) {
        aDate.setFullYear(0);
    }
    return aDate;
};

ZmEditContactViewOther.formatDate = function(date) {
    var pattern = date.getFullYear() == 0 ? "--MM-dd" : "yyyy-MM-dd";
    return AjxDateFormat.format(pattern, date);
};

ZmEditContactViewOther._getDateFormatter = function() {
    if (!ZmEditContactViewOther._formatter) {
        ZmEditContactViewOther._formatter = new AjxDateFormat("yyyy-MM-dd");
    }
    return ZmEditContactViewOther._formatter;
};

ZmEditContactViewOther.prototype._handleDropDown = function(evt) {
    var value = this.getValue().value;
    var date = ZmEditContactViewOther.parseDate(value) || new Date();
    var includeYear = date.getFullYear() !== 0;
    // NOTE: Temporarilly set the year to the current year in the
    // NOTE: case of a date without a year set (i.e. full year == 0).
    // NOTE: This is done so that the calendar doesn't show the
    // NOTE: wrong year.
	if (!includeYear) {
		date.setFullYear(new Date().getFullYear());
	}
	this._calendarIncludeYear.setSelected(includeYear); //see bug 46952 and bug 83177
    this._calendar.setDate(date);
    this._picker.popup();
};

ZmEditContactViewOther.prototype._handleDateSelection = function(calendar) {
    this._picker.getMenu().popdown();

	if (!calendar) calendar = this._calendar;
    var date = calendar.getDate();
    if (!this._calendarIncludeYear.isSelected()) {
        date = new Date(date.getTime());
        date.setFullYear(0);
    }

	var value = this.getValue();
	value.value = ZmEditContactViewOther.formatDate(date);
	this.setValue(value);
	this.parent.setDirty(true);
};

ZmEditContactViewOther.prototype._handleSelectChange = function(evt) {
    ZmEditContactViewInputSelect.prototype._handleSelectChange.call(this, evt, true);
};

//
// Class: ZmEditContactViewIM
//
/**
 * Creates the contact view IM field.
 * @class
 * This class represents the contact view IM field.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewInputSelect
 * 
 * @private
 */
ZmEditContactViewIM = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewInputSelect.apply(this, arguments);
};
ZmEditContactViewIM.prototype = new ZmEditContactViewInputSelect;
ZmEditContactViewIM.prototype.constructor = ZmEditContactViewIM;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewIM.prototype.toString = function() {
	return "ZmEditContactViewIM";
};

// constants

ZmEditContactViewIM.RE_VALUE = /^(.*?):\/\/(.*)$/;

// Public methods

ZmEditContactViewIM.prototype.setValue = function(value) {
	var m = ZmEditContactViewIM.RE_VALUE.exec(value);
	value = m ? { type:m[1],value:m[2] } : { type:"xmpp",value:value };
	ZmEditContactViewInputSelect.prototype.setValue.call(this, value);
};
ZmEditContactViewIM.prototype.getValue = function() {
	var value = ZmEditContactViewInputSelect.prototype.getValue.call(this);
	return value.value ? [value.type, value.value].join("://") : "";
};

//
// Class: ZmEditContactViewIMDouble
//
/**
 * Creates the contact view IM field.
 * @class
 * This class represents the contact view IM field.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewInputSelect
 * 
 * @private
 */
ZmEditContactViewIMDouble = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewInputDoubleSelect.apply(this, arguments);
};
ZmEditContactViewIMDouble.prototype = new ZmEditContactViewInputDoubleSelect;
ZmEditContactViewIMDouble.prototype.constructor = ZmEditContactViewIMDouble;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewIMDouble.prototype.toString = function() {
	return "ZmEditContactViewIMDouble";
};

// constants

ZmEditContactViewIMDouble.RE_VALUE = /^(.*?):\/\/(.*)$/;

// Public methods

ZmEditContactViewIMDouble.prototype.setValue = function(value) {
	var obj;
	if (!value || value == "") {
		obj = { type2:"_NONE", value:"", type: null };
	} else {
		var url = value.type ? value.value : value;
		var m = ZmEditContactViewIMDouble.RE_VALUE.exec(url);
		obj = m ? { type2:m[1], value:m[2], type: value.type?value.type:null } : { type2: value.type2 || "other", value: url, type: value.type ? value.type : null };
	}
	ZmEditContactViewInputDoubleSelect.prototype.setValue.call(this, obj);
};

ZmEditContactViewIMDouble.prototype.getValue = function() {
	var value = ZmEditContactViewInputDoubleSelect.prototype.getValue.call(this);
	var url = (value.type2=="_NONE" || value.value=="") ? "" : [value.type2, value.value].join("://");
	var obj = value.type2 ? {
		type: value.type,
		type2: value.type2,
		value: url
	} : url;
	return obj;
};

ZmEditContactViewIMDouble.equals = function(a,b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.type == b.type &&
           a.type2 == b.type2 &&
           a.value == b.value;
};

//
// Class: ZmEditContactViewAddress
//
/**
 * Creates the contact view address input field.
 * @class
 * This class represents the address input field.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmEditContactViewInputSelect
 * 
 * @private
 */
ZmEditContactViewAddress = function(params) {
	if (arguments.length == 0) return;
	ZmEditContactViewInputSelect.call(this, params);
};
ZmEditContactViewAddress.prototype = new ZmEditContactViewInputSelect;
ZmEditContactViewAddress.prototype.constructor = ZmEditContactViewAddress;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmEditContactViewAddress.prototype.toString = function() {
	return "ZmEditContactViewAddress";  
};

// Data

ZmEditContactViewAddress.prototype.TEMPLATE = "abook.Contacts#ZmEditContactViewAddressSelect";

// Public methods

ZmEditContactViewAddress.prototype.setValue = function(value) {
	ZmEditContactViewInputSelect.prototype.setValue.apply(this, arguments);
	value = value || {};
	this._select.setSelectedValue(value.type);
	this._input.setValue("STREET", value.Street);
	this._input.setValue("CITY", value.City);
	this._input.setValue("STATE", value.State);
	this._input.setValue("ZIP", value.PostalCode);
	this._input.setValue("COUNTRY", value.Country);
	this._input.setDirty(false);
	this._input.update();
};

ZmEditContactViewAddress.prototype.getValue = function() {
	return {
		type: this._select.getValue(),
		Street: this._input.getValue("STREET"),
		City: this._input.getValue("CITY"),
		State: this._input.getValue("STATE"),
		PostalCode: this._input.getValue("ZIP"),
		Country: this._input.getValue("COUNTRY")
	};
};

ZmEditContactViewAddress.equals = function(a,b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.type == b.type &&
           a.Street == b.Street && a.City == b.City && a.State == b.State &&
           a.PostalCode == b.PostalCode && a.Country == b.Country;
};

// Protected methods

ZmEditContactViewAddress.prototype._setControlIds = function(rowId, index) {
	var id = this.getHTMLElId();
	ZmEditContactViewInputSelect.prototype._setControlIds.apply(this, arguments);
	var fieldIds = ["STREET", "CITY", "STATE", "ZIP", "COUNTRY"];
	for (var i = 0; i < fieldIds.length; i++) {
		var fieldId = fieldIds[i];
		var form = this._input.getControl(fieldId);
		this._setControlId.call(form, form, [id,fieldId].join("_"));
	}
};

ZmEditContactViewAddress.prototype._createInput = function() {
	var form = {
		template: "abook.Contacts#ZmEditContactViewAddress",
		// NOTE: The parent is a ZmEditContactViewInputSelect which knows
		// NOTE: its item ID and will set the dirty state on the main
		// NOTE: form appropriately.
		ondirty: "this.parent._handleDirty()",
		items: [
			{ id: "STREET", type: "DwtInputField", width: 343, rows: 2,
				hint: ZmMsg.AB_FIELD_street, params: { forceMultiRow: true }
			},
			{ id: "CITY", type: "DwtInputField", width: 160, hint: ZmMsg.AB_FIELD_city },
			{ id: "STATE", type: "DwtInputField", width: 90, hint: ZmMsg.AB_FIELD_state },
			{ id: "ZIP", type: "DwtInputField", width: 80, hint: ZmMsg.AB_FIELD_postalCode },
			{ id: "COUNTRY", type: "DwtInputField", width: 343, hint: ZmMsg.AB_FIELD_country }
		]
	};
	return new DwtForm({parent:this,form:form});
};

ZmEditContactViewAddress.prototype._handleDirty = function() {
	if (this._input && this._input.isDirty()) {
		this.parent.setDirty(true);
	}
};
}
if (AjxPackage.define("zimbraMail.abook.view.ZmGroupView")) {
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
 * This file contains the contact group view classes.
 */

/**
 * Creates the group view.
 * @class
 * This class represents the contact group view.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{ZmContactController}		controller		the controller
 *
 * @constructor
 * 
 * @extends		DwtComposite
 */
ZmGroupView = function(parent, controller) {
	if (arguments.length == 0) return;
	DwtComposite.call(this, {parent:parent, className:"ZmContactView", posStyle:DwtControl.ABSOLUTE_STYLE});
	this.setScrollStyle(Dwt.CLIP); //default is clip, for regular group it's fine. (otherwise there's always a scroll for no reason, not sure why). For DL we change in "set"

	this._controller = controller;

	this._view = ZmId.VIEW_GROUP;

	this._tagList = appCtxt.getTagTree();
	this._tagList.addChangeListener(new AjxListener(this, this._tagChangeListener));

	this._changeListener = new AjxListener(this, this._groupChangeListener);
	this._detailedSearch = appCtxt.get(ZmSetting.DETAILED_CONTACT_SEARCH_ENABLED);

	/* following few are used in ZmContactPicker methods we delegate to from here */
	this._ascending = true; 
	this._emailList = new AjxVector();
	this._includeContactsWithNoEmail = true;

	this._groupMemberMods = {};
	this._tabGroup = new DwtTabGroup(this._htmlElId);
	
};

ZmGroupView.prototype = new DwtComposite;
ZmGroupView.prototype.constructor = ZmGroupView;
ZmGroupView.prototype.isZmGroupView = true;


/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmGroupView.prototype.toString =
function() {
	return "ZmGroupView";
};

ZmGroupView.DIALOG_X = 50;
ZmGroupView.DIALOG_Y = 100;

ZmGroupView.MAIL_POLICY_ANYONE = "ANYONE";
ZmGroupView.MAIL_POLICY_MEMBERS = "MEMBERS";
ZmGroupView.MAIL_POLICY_INTERNAL = "INTERNAL";
ZmGroupView.MAIL_POLICY_SPECIFIC = "SPECIFIC";

ZmGroupView.GRANTEE_TYPE_USER = "usr";
ZmGroupView.GRANTEE_TYPE_GUEST = "gst"; // an external user. This is returned by GetDistributionListResponse for a non-internal user. Could be a mix of this and "usr"
ZmGroupView.GRANTEE_TYPE_EMAIL = "email"; //this covers both guest and user when setting rights via the setRights op of DistributionListActionRequest
ZmGroupView.GRANTEE_TYPE_GROUP = "grp";
ZmGroupView.GRANTEE_TYPE_ALL = "all";
ZmGroupView.GRANTEE_TYPE_PUBLIC = "pub";

ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP = [];
ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[ZmGroupView.GRANTEE_TYPE_USER] = ZmGroupView.MAIL_POLICY_SPECIFIC;
ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[ZmGroupView.GRANTEE_TYPE_GUEST] = ZmGroupView.MAIL_POLICY_SPECIFIC;
ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[ZmGroupView.GRANTEE_TYPE_GROUP] = ZmGroupView.MAIL_POLICY_MEMBERS;
ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[ZmGroupView.GRANTEE_TYPE_ALL] = ZmGroupView.MAIL_POLICY_INTERNAL;
ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[ZmGroupView.GRANTEE_TYPE_PUBLIC] = ZmGroupView.MAIL_POLICY_ANYONE;

//
// Public methods
//

// need this since contact view now derives from list controller
ZmGroupView.prototype.getList = function() { return null; }

/**
 * Gets the contact.
 * 
 * @return	{ZmContact}	the contact
 */
ZmGroupView.prototype.getContact =
function() {
	return this._contact;
};

/**
 * Gets the controller.
 * 
 * @return	{ZmContactController}	the controller
 */
ZmGroupView.prototype.getController =
function() {
	return this._controller;
};

// Following two overrides are a hack to allow this view to pretend it's a list view
ZmGroupView.prototype.getSelection = function() {
	return this.getContact();
};

ZmGroupView.prototype.getSelectionCount = function() {
	return 1;
};

ZmGroupView.prototype.isDistributionList =
function() {
	return this._contact.isDistributionList();
};

ZmGroupView.prototype.set =
function(contact, isDirty) {
	this._attr = {};

	if (this._contact) {
		this._contact.removeChangeListener(this._changeListener);
	}
	contact.addChangeListener(this._changeListener);
	this._contact = this._item = contact;

	if (!this._htmlInitialized) {
		this._createHtml();
		this._addWidgets();
		this._installKeyHandlers();
		this._tabGroup.addMember(this._getTabGroupMembers());
	}
	
	this._setFields();
	this._emailListOffset = 0;
	this._isDirty = isDirty;

	if (contact.isDistributionList()) {
		if (this._usernameEditable) {
			this._groupNameInput.addListener(DwtEvent.ONBLUR, this._controller.updateTabTitle.bind(this._controller));
		}
		if (this._domainEditable) {
			document.getElementById(this._groupNameDomainId).onblur = this._controller.updateTabTitle.bind(this._controller);
		}
	}
	else {
		this._groupNameInput.addListener(DwtEvent.ONBLUR, this._controller.updateTabTitle.bind(this._controller));
	}

	this.search(null, null, true);
};

/**
 * this is called from ZmContactController.prototype._postShowCallback
 */
ZmGroupView.prototype.postShow =
function() {
	if (this._contact.isDistributionList()) {
		this._dlMembersTabView.showMe(); //have to call it now so it's sized correctly.
	}
};

ZmGroupView.prototype.getModifiedAttrs =
function() {
	if (!this.isDirty()) return null;

	var mods = this._attr = [];

	// get field values
	var groupName = this._getGroupName();
	var folderId = this._getFolderId();

	if (this.isDistributionList()) {
		var dlInfo = this._contact.dlInfo;
		if (groupName != this._contact.getEmail()) {
			mods[ZmContact.F_email] = groupName;
		}
		if (dlInfo.displayName != this._getDlDisplayName()) {
			mods[ZmContact.F_dlDisplayName] = this._getDlDisplayName();
		}
		if (dlInfo.description != this._getDlDesc()) {
			mods[ZmContact.F_dlDesc] = this._getDlDesc();
		}
		if (dlInfo.hideInGal != this._getDlHideInGal()) {
			mods[ZmContact.F_dlHideInGal] = this._getDlHideInGal() ? "TRUE" : "FALSE";
		}
		if (dlInfo.notes != this._getDlNotes()) {
			mods[ZmContact.F_dlNotes] = this._getDlNotes();
		}
		if (dlInfo.subscriptionPolicy != this._getDlSubscriptionPolicy()) {
			mods[ZmContact.F_dlSubscriptionPolicy] = this._getDlSubscriptionPolicy();
		}
		if (dlInfo.unsubscriptionPolicy != this._getDlUnsubscriptionPolicy()) {
			mods[ZmContact.F_dlUnsubscriptionPolicy] = this._getDlUnsubscriptionPolicy();
		}
		if (!AjxUtil.arrayCompare(dlInfo.owners, this._getDlOwners())) {
			mods[ZmContact.F_dlListOwners] = this._getDlOwners();
		}
		if (dlInfo.mailPolicy != this._getDlMailPolicy()
				|| (this._getDlMailPolicy() == ZmGroupView.MAIL_POLICY_SPECIFIC
					&& !AjxUtil.arrayCompare(dlInfo.mailPolicySpecificMailers, this._getDlSpecificMailers()))) {
			mods[ZmContact.F_dlMailPolicy] = this._getDlMailPolicy();
			mods[ZmContact.F_dlMailPolicySpecificMailers] = this._getDlSpecificMailers();
		}

		if (this._groupMemberMods) {
			mods[ZmContact.F_groups] = this._getModifiedMembers();
			this._groupMemberMods = {}; //empty the mods
		}

		return mods;
	}

	// creating new contact (possibly some fields - but not ID - prepopulated)
	if (this._contact.id == null || (this._contact.isGal && !this.isDistributionList())) {
		mods[ZmContact.F_folderId] = folderId;
		mods[ZmContact.F_fileAs] = ZmContact.computeCustomFileAs(groupName);
		mods[ZmContact.F_nickname] = groupName;
		mods[ZmContact.F_groups] = this._getGroupMembers();
		mods[ZmContact.F_type] = "group";
	}
	else {
		// modifying existing contact
		if (!this.isDistributionList() && this._contact.getFileAs() != groupName) {
			mods[ZmContact.F_fileAs] = ZmContact.computeCustomFileAs(groupName);
			mods[ZmContact.F_nickname] = groupName;
		}

		if (this._groupMemberMods) {
			mods[ZmContact.F_groups] = this._getModifiedMembers();
			this._groupMemberMods = {}; //empty the mods
		} 
		
		var oldFolderId = this._contact.addrbook ? this._contact.addrbook.id : ZmFolder.ID_CONTACTS;
		if (folderId != oldFolderId) {
			mods[ZmContact.F_folderId] = folderId;
		}
	}

	return mods;
};

ZmGroupView.prototype._getModifiedMembers =
function() {
	var modifiedMembers = [];
	for (var id in this._groupMemberMods) {
		if (this._groupMemberMods[id].op) {
			modifiedMembers.push(this._groupMemberMods[id]);
		}
	}
	return modifiedMembers;
};


ZmGroupView.prototype._getFullName =
function() {
	return this._getGroupName();
};

ZmGroupView.prototype._getGroupDomainName =
function() {
	if (this.isDistributionList()) {
		return this._domainEditable
			? AjxStringUtil.trim(document.getElementById(this._groupNameDomainId).value)
			: this._emailDomain;
	}
	return AjxStringUtil.trim(document.getElementById(this._groupNameDomainId).value);
};

ZmGroupView.prototype._getGroupName =
function() {
	if (this.isDistributionList()) {
		var username = this._getDlAddressLocalPart();
		return username + "@" + this._getGroupDomainName();
	}
	return AjxStringUtil.trim(this._groupNameInput.getValue());
};

ZmGroupView.prototype._getDlAddressLocalPart =
function() {
	return this._usernameEditable ? AjxStringUtil.trim(this._groupNameInput.getValue()) : this._emailUsername;
};

ZmGroupView.prototype._getDlDisplayName =
function() {
	return AjxStringUtil.trim(document.getElementById(this._dlDisplayNameId).value);
};

ZmGroupView.prototype._getDlDesc =
function() {
	return AjxStringUtil.trim(document.getElementById(this._dlDescId).value);
};

ZmGroupView.prototype._getDlNotes =
function() {
	return AjxStringUtil.trim(document.getElementById(this._dlNotesId).value);
};

ZmGroupView.prototype._getDlHideInGal =
function() {
	return document.getElementById(this._dlHideInGalId).checked;
};

ZmGroupView.prototype._getDlSpecificMailers =
function() {
	return this._getUserList(this._dlListSpecificMailersId);
};

ZmGroupView.prototype._getDlOwners =
function() {
	return this._getUserList(this._dlListOwnersId);
};

ZmGroupView.prototype._getUserList =
function(fldId) {
	var users = AjxStringUtil.trim(document.getElementById(fldId).value).split(";");
	var retUsers = [];
	for (var i = 0; i < users.length; i++) {
		var user = AjxStringUtil.trim(users[i]);
		if (user != "") {
			retUsers.push(user);
		}
	}
	return retUsers;
};


ZmGroupView.prototype._getDlSubscriptionPolicy =
function() {
	return this._getDlPolicy(this._dlSubscriptionPolicyId, this._subsPolicyOpts);
};

ZmGroupView.prototype._getDlUnsubscriptionPolicy =
function() {
	return this._getDlPolicy(this._dlUnsubscriptionPolicyId, this._subsPolicyOpts);
};

ZmGroupView.prototype._getDlMailPolicy =
function() {
	return this._getDlPolicy(this._dlMailPolicyId, this._mailPolicyOpts);
};

ZmGroupView.prototype._getDlPolicy =
function(fldId, opts) {
	for (var i = 0; i < opts.length; i++) {
		var opt = opts[i];
		if (document.getElementById(fldId[opt]).checked) {
			return opt;
		}
	}
};


ZmGroupView.prototype.isEmpty =
function(checkEither) {
	var groupName = this._getGroupName();
	var members = ( this._groupMembersListView.getList() && this._groupMembersListView.getList().size() > 0 );

	return checkEither
		? (groupName == "" || !members )
		: (groupName == "" && !members );
};


ZmGroupView.prototype.isValidDlName =
function() {
	if (!this.isDistributionList()) {
		return true;
	}
	if (!this._usernameEditable) {
		return true; //to be on the safe and clear side. no need to check.
	}
	var account = this._getDlAddressLocalPart();
	return AjxEmailAddress.accountPat.test(account);
};

ZmGroupView.prototype.isValidDlDomainName =
function() {
	if (!this.isDistributionList()) {
		return true;
	}
	if (!this._domainEditable) {
		return true; //this takes care of a "vanilla" owner with no create rights.
	}

	var domain = this._getGroupDomainName();
	return this._allowedDomains[domain];
};

ZmGroupView.prototype.isValidOwners =
function() {
	if (!this.isDistributionList()) {
		return true;
	}
	return this._getDlOwners().length > 0
};


ZmGroupView.prototype.isValidMailPolicy =
function() {
	if (!this.isDistributionList()) {
		return true;
	}
	return this._getDlMailPolicy() != ZmGroupView.MAIL_POLICY_SPECIFIC || this._getDlSpecificMailers().length > 0;
};



ZmGroupView.prototype.isValid =
function() {
	// check for required group name
	if (this.isDirty() && this.isEmpty(true)) {
		return false;
	}
	if (!this.isValidDlName()) {
		return false;
	}
	if (!this.isValidDlDomainName()) {
		return false;
	}
	if (!this.isValidOwners()) {
		return false;
	}
	if (!this.isValidMailPolicy()) {
		return false;
	}
	return true;
};

//todo - really not sure why this way of having 3 methods with parallel values conditions is used here this way. I just continued to build on what was there, but should check if it can be simplified.
ZmGroupView.prototype.getInvalidItems =
function() {
	if (this.isValid()) {
		return [];
	}
	var items = [];
	if (!this.isValidDlName()) {
		items.push("dlName");
	}
	if (this.isEmpty(true)) {
		items.push("members");
	}
	if (!this.isValidDlDomainName()) {
		items.push("dlDomainName");
	}
	if (!this.isValidOwners()) {
		items.push("owners");
	}
	if (!this.isValidMailPolicy()) {
		items.push("mailPolicy");
	}
	return items;
};

ZmGroupView.prototype.getErrorMessage = function(id) {
	if (this.isValid()) {
		return null;
	}
	if (id == "members") {
		return this.isDistributionList() ? ZmMsg.errorMissingDlMembers : ZmMsg.errorMissingGroup;
	}
	if (id == "dlName") { 
		return ZmMsg.dlInvalidName; 
	}
	if (id == "dlDomainName") {
		return ZmMsg.dlInvalidDomainName; 
	}
	if (id == "owners") {
		return ZmMsg.dlInvalidOwners; 
	}
	if (id == "mailPolicy") {
		return ZmMsg.dlInvalidMailPolicy;
	}

};

ZmGroupView.prototype.enableInputs =
function(bEnable) {
	if (this.isDistributionList()) {
		if (this._usernameEditable) {
			document.getElementById(this._groupNameId).disabled = !bEnable;
		}
		if (this._domainEditable) {
			document.getElementById(this._groupNameDomainId).disabled = !bEnable;
		}
		document.getElementById(this._dlDisplayNameId).disabled = !bEnable;
		document.getElementById(this._dlDescId).disabled = !bEnable;
		document.getElementById(this._dlHideInGalId).disabled = !bEnable;
		document.getElementById(this._dlNotesId).disabled = !bEnable;
		for (var i = 0; i < this._subsPolicyOpts.length; i++) {
			var opt = this._subsPolicyOpts[i];
			document.getElementById(this._dlSubscriptionPolicyId[opt]).disabled = !bEnable;
			document.getElementById(this._dlUnsubscriptionPolicyId[opt]).disabled = !bEnable;
		}
		document.getElementById(this._dlListOwnersId).disabled = !bEnable;
	}
	else {
		document.getElementById(this._groupNameId).disabled = !bEnable;
	}
	if (!this._noManualEntry) {
		this._groupMembers.disabled = !bEnable;
	}
	for (var fieldId in this._searchField) {
		this._searchField[fieldId].disabled = !bEnable;
	}
};

ZmGroupView.prototype.isDirty =
function() {
	return this._isDirty;
};

ZmGroupView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this.isDistributionList() ? ZmMsg.distributionList : ZmMsg.group].join(": ");
};

ZmGroupView.prototype.setSize =
function(width, height) {
	// overloaded since base class calls sizeChildren which we dont care about
	DwtComposite.prototype.setSize.call(this, width, height);
};

ZmGroupView.prototype.setBounds =
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	if(this._addNewField){
		Dwt.setSize(this._addNewField, Dwt.DEFAULT, 50);
	}
	this._groupMembersListView.setSize(Dwt.DEFAULT, height-150);

	var headerTableHeight = Dwt.getSize(this._headerRow).y;
	var tabBarHeight = this._tabBar ? Dwt.getSize(this._tabBar).y : 0; //only DL
	var searchFieldsRowHeight = Dwt.getSize(this._searchFieldsRow).y;
	var manualAddRowHeight = Dwt.getSize(this._manualAddRow).y;
	var navButtonsRowHeight = Dwt.getSize(this._navButtonsRow).y;
	var listHeight = height - headerTableHeight - tabBarHeight - searchFieldsRowHeight - manualAddRowHeight - navButtonsRowHeight - 40;
	this._listview.setSize(Dwt.DEFAULT, listHeight);
};

ZmGroupView.prototype.cleanup  =
function() {
	for (var fieldId in this._searchField) {
		this._searchField[fieldId].value = "";
	}
	this._listview.removeAll(true);
	this._groupMembersListView.removeAll(true);
	this._addButton.setEnabled(false);
	this._addAllButton.setEnabled(false);
	this._prevButton.setEnabled(false);
	this._nextButton.setEnabled(false);
	if (this._addNewField) {
		this._addNewField.value = '';
	}
};


// Private methods

ZmGroupView.prototype._setFields =
function() {
	// bug fix #35059 - always reset search-in select since non-zimbra accounts don't support GAL
	if (appCtxt.isOffline && appCtxt.accountList.size() > 1 && this._searchInSelect) {
		this._searchInSelect.clearOptions();
		this._resetSearchInSelect();
	}

	this._setGroupName();
	if (this.isDistributionList()) {
		this._setDlFields();
	}
	this._setGroupMembers();
	this._setTags();
};

ZmGroupView.prototype._setTitle =
function(title) {
	var div = document.getElementById(this._titleId);
	var fileAs = title || this._contact.getFileAs();
	div.innerHTML = AjxStringUtil.htmlEncode(fileAs) || (this._contact.id ? "&nbsp;" : ZmMsg.newGroup);
};

ZmGroupView.prototype._getTagCell =
function() {
	return document.getElementById(this._tagsId);
};

ZmGroupView.prototype.getSearchFieldValue =
function(fieldId) {
	if (!fieldId && !this._detailedSearch) {
		fieldId = ZmContactPicker.SEARCH_BASIC;
	}
	var field = this._searchField[fieldId];
	return field && AjxStringUtil.trim(field.value) || "";
};

ZmGroupView.prototype._createHtml =
function() {
	this._headerRowId = 		this._htmlElId + "_headerRow";
	this._titleId = 			this._htmlElId + "_title";
	this._tagsId = 				this._htmlElId + "_tags";
	this._groupNameId = 		this._htmlElId + "_groupName";
	
	if (this.isDistributionList()) {
		this._groupNameDomainId = 		this._htmlElId + "_groupNameDomain";
		this._allowedDomains = appCtxt.createDistListAllowedDomainsMap;
		this._emailDomain = appCtxt.createDistListAllowedDomains[0];
		this._emailUsername = "";
		var email = this._contact.getEmail();
		if (email) {
			var temp = email.split("@");
			this._emailUsername = temp[0];
			this._emailDomain = temp[1];
		}
		var isCreatingNew = !email;
		var domainCount = appCtxt.createDistListAllowedDomains.length;
		this._domainEditable = (domainCount > 1) && (isCreatingNew || this._allowedDomains[this._emailDomain]); //since a rename from one domain to another is like deleting on one and creating on other, both require createDistList right on the domains
		this._usernameEditable = isCreatingNew || this._allowedDomains[this._emailDomain];

		this._dlDisplayNameId = 	this._htmlElId + "_dlDisplayName";
		this._dlDescId = 			this._htmlElId + "_dlDesc";
		this._dlHideInGalId = 	this._htmlElId + "_dlHideInGal";
		this._dlNotesId = 			this._htmlElId + "_dlNotes";
		this._subsPolicyOpts = [ZmContactSplitView.SUBSCRIPTION_POLICY_ACCEPT,
							ZmContactSplitView.SUBSCRIPTION_POLICY_APPROVAL,
							ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT];
		this._dlSubscriptionPolicyId = {};
		this._dlUnsubscriptionPolicyId = {};
		for (var i = 0; i < this._subsPolicyOpts.length; i++) {
			var opt = this._subsPolicyOpts[i];
			this._dlSubscriptionPolicyId[opt] = this._htmlElId + "_dlSubscriptionPolicy" + opt; //_dlSubscriptionPolicyACCEPT / APPROVAL / REJECT
			this._dlUnsubscriptionPolicyId[opt] = this._htmlElId + "_dlUnsubscriptionPolicy" + opt; //_dlUnsubscriptionPolicyACCEPT / APPROVAL / REJECT
		}
		this._mailPolicyOpts = [ZmGroupView.MAIL_POLICY_ANYONE,
								ZmGroupView.MAIL_POLICY_MEMBERS,
								ZmGroupView.MAIL_POLICY_INTERNAL,
								ZmGroupView.MAIL_POLICY_SPECIFIC];
		this._dlMailPolicyId = {};
		for (i = 0; i < this._mailPolicyOpts.length; i++) {
			opt = this._mailPolicyOpts[i];
			this._dlMailPolicyId[opt] = this._htmlElId + "_dlMailPolicy" + opt; //_dlMailPolicyANYONE / etc
		}
		this._dlListSpecificMailersId = 	this._htmlElId + "_dlListSpecificMailers";

		this._dlListOwnersId = 	this._htmlElId + "_dlListOwners";

		// create auto-completer
		var params = {
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_EMAIL,
			keyUpCallback:	ZmGroupView._onKeyUp, 
			contextId:		this.toString()
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		if (appCtxt.multiAccounts) {
			var acct = object.account || appCtxt.accountList.mainAccount;
			this._acAddrSelectList.setActiveAccount(acct);
		}
	}
	this._searchFieldId = 		this._htmlElId + "_searchField";

	var showSearchIn = false;
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		if (appCtxt.get(ZmSetting.GAL_ENABLED) || appCtxt.get(ZmSetting.SHARING_ENABLED))
			showSearchIn = true;
	}
	var params = this._templateParams = {
		id: this._htmlElId,
		showSearchIn: showSearchIn,
		detailed: this._detailedSearch,
		contact: this._contact,
		isEdit: true,
		usernameEditable: this._usernameEditable,
		domainEditable: this._domainEditable,
		username: this._emailUsername,
		domain: this._emailDomain,
		addrbook: this._contact.getAddressBook()
	};

	if (this.isDistributionList()) {
		this.getHtmlElement().innerHTML = AjxTemplate.expand("abook.Contacts#DlView", params);
		this._tabViewContainerId = this._htmlElId + "_tabViewContainer";
		var tabViewContainer = document.getElementById(this._tabViewContainerId);
		this._tabView = new DwtTabView({parent: this, posStyle: Dwt.STATIC_STYLE, id: this._htmlElId + "_tabView"});
		this._tabView.reparentHtmlElement(tabViewContainer);
		this._dlMembersTabView = new ZmDlMembersTabView(this);
		this._tabView.addTab(ZmMsg.dlMembers, this._dlMembersTabView);
		this._dlPropertiesTabView = new ZmDlPropertiesTabView(this);
		this._tabView.addTab(ZmMsg.dlProperties, this._dlPropertiesTabView);
	}
	else {
		this.getHtmlElement().innerHTML = AjxTemplate.expand("abook.Contacts#GroupView", params);
	}

	this._headerRow = document.getElementById(this._headerRowId);
	this._tabBar = document.getElementById(this._htmlElId + "_tabView_tabbar"); //only for DLs
	this._searchFieldsRow = document.getElementById(this._htmlElId + "_searchFieldsRow");
	this._manualAddRow = document.getElementById(this._htmlElId + "_manualAddRow");
	this._navButtonsRow = document.getElementById(this._htmlElId + "_navButtonsRow");

	this._htmlInitialized = true;
};

ZmGroupView.prototype._addWidgets =
function() {
	if (!this.isDistributionList() || this._usernameEditable) {
		this._groupNameInput = new DwtInputField({parent:this, size: this.isDistributionList() ? 20: 40, inputId: this._htmlElId + "_groupName"});
		this._groupNameInput.setHint(this.isDistributionList() ? ZmMsg.distributionList : ZmMsg.groupNameLabel);
		this._groupNameInput.reparentHtmlElement(this._htmlElId + "_groupNameParent");
	}
	
	this._groupMembers = document.getElementById(this._htmlElId + "_groupMembers");
	this._noManualEntry = this._groupMembers.disabled; // see bug 23858

	// add select menu
	var selectId = this._htmlElId + "_listSelect";
	var selectCell = document.getElementById(selectId);
	if (selectCell) {
		this._searchInSelect = new DwtSelect({parent:this});
		this._resetSearchInSelect();
		this._searchInSelect.reparentHtmlElement(selectId);
		this._searchInSelect.addChangeListener(new AjxListener(this, this._searchTypeListener));
	}

	// add "Search" button
	this._searchButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_searchButton")});
	this._searchButton.setText(ZmMsg.search);
	this._searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));

	// add list view for search results
	this._listview = new ZmGroupListView(this);
	this._listview.reparentHtmlElement(this._htmlElId + "_listView");
	this._listview.addSelectionListener(new AjxListener(this, this._selectionListener));
	this._listview.setUI(null, true); // renders headers and empty list
	this._listview._initialized = true;

	// add list view for group memebers
	this._groupMembersListView = new ZmGroupMembersListView(this);
	this._groupMembersListView.reparentHtmlElement(this._htmlElId + "_groupMembers");
	this._groupMembersListView.addSelectionListener(new AjxListener(this, this._groupMembersSelectionListener));
	this._groupMembersListView.setUI(null, true);
	this._groupMembersListView._initialized = true;
			
	var addListener = new AjxListener(this, this._addListener);
	// add "Add" button
	this._addButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_addButton")});
	this._addButton.setText(ZmMsg.add);
	this._addButton.addSelectionListener(addListener);
	this._addButton.setEnabled(false);
	this._addButton.setImage("LeftArrow");

	// add "Add All" button
	this._addAllButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_addAllButton")});
	this._addAllButton.setText(ZmMsg.addAll);
	this._addAllButton.addSelectionListener(addListener);
	this._addAllButton.setEnabled(false);
	this._addAllButton.setImage("LeftArrow");

	var pageListener = new AjxListener(this, this._pageListener);
	// add paging buttons
	this._prevButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_prevButton")});
	this._prevButton.setImage("LeftArrow");
	this._prevButton.addSelectionListener(pageListener);
	this._prevButton.setEnabled(false);

	this._nextButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_nextButton")});
	this._nextButton.setImage("RightArrow");
	this._nextButton.addSelectionListener(pageListener);
	this._nextButton.setEnabled(false);

	this._locationButton = new DwtButton({parent:this, parentElement: (this._htmlElId + "_LOCATION_FOLDER")});
	this._locationButton.setImage("ContactsFolder");
	this._locationButton.setEnabled(this._contact && !this._contact.isShared() && !this._contact.isDistributionList());
	this._locationButton.addSelectionListener(new AjxListener(this, this._handleFolderButton));
	var folderOrId = this._contact && this._contact.getAddressBook();
	if (!folderOrId) {
		var overview = appCtxt.getApp(ZmApp.CONTACTS).getOverview();
		folderOrId = overview && overview.getSelected();
		if (folderOrId && folderOrId.type != ZmOrganizer.ADDRBOOK) {
			folderOrId = null;
		}
		if (!this.isDistributionList() && folderOrId && folderOrId.id && folderOrId.id == ZmFolder.ID_DLS) { //can't create under Distribution Lists virtual folder
			folderOrId = null;
		}
	}

	this._setLocationFolder(folderOrId);
	
	
	// add New Button
	this._addNewField = document.getElementById(this._htmlElId + "_addNewField");
	if (this._addNewField) {
		this._addNewButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_addNewButton")});
		this._addNewButton.setText(ZmMsg.add);
		this._addNewButton.addSelectionListener(new AjxListener(this, this._addNewListener));
		this._addNewButton.setImage("LeftArrow");
	}

	var fieldMap = {};
	var rowMap = {};
	ZmContactPicker.prototype.mapFields.call(this, fieldMap, rowMap);

	this._searchField = {};
	for (var fieldId in fieldMap) {
		var field = Dwt.byId(fieldMap[fieldId]);
		if (field) this._searchField[fieldId] = field;
	}
	
	this._searchRow = {};
	for (var rowId in rowMap) {
		row = Dwt.byId(rowMap[rowId]);
		if (row) this._searchRow[rowId] = row;
	}
	this._updateSearchRows(this._searchInSelect && this._searchInSelect.getValue() || ZmContactsApp.SEARCHFOR_CONTACTS);
};

ZmGroupView.prototype._installKeyHandlers =
function() {

	if (this.isDistributionList()) {
		if (this._usernameEditable) {
			var groupName = document.getElementById(this._groupNameId);
			Dwt.setHandler(groupName, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
			Dwt.associateElementWithObject(groupName, this);
		}
		if (this._domainEditable) {
			var groupNameDomain = document.getElementById(this._groupNameDomainId);
			Dwt.setHandler(groupNameDomain, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
			Dwt.associateElementWithObject(groupNameDomain, this);
		}

		var dlDisplayName = document.getElementById(this._dlDisplayNameId);
		Dwt.setHandler(dlDisplayName, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		Dwt.associateElementWithObject(dlDisplayName, this);

		var dlDesc = document.getElementById(this._dlDescId);
		Dwt.setHandler(dlDesc, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		Dwt.associateElementWithObject(dlDesc, this);

		var dlHideInGal = document.getElementById(this._dlHideInGalId);
		Dwt.setHandler(dlHideInGal, DwtEvent.ONCHANGE, ZmGroupView._onChange);
		Dwt.associateElementWithObject(dlHideInGal, this);

		var dlNotes = document.getElementById(this._dlNotesId);
		Dwt.setHandler(dlNotes, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		Dwt.associateElementWithObject(dlNotes, this);

		for (var i = 0; i < this._subsPolicyOpts.length; i++) {
			var opt =  this._subsPolicyOpts[i];
			var policy = document.getElementById(this._dlSubscriptionPolicyId[opt]);
			Dwt.setHandler(policy, DwtEvent.ONCHANGE, ZmGroupView._onChange);
			Dwt.associateElementWithObject(policy, this);

			policy = document.getElementById(this._dlUnsubscriptionPolicyId[opt]);
			Dwt.setHandler(policy, DwtEvent.ONCHANGE, ZmGroupView._onChange);
			Dwt.associateElementWithObject(policy, this);
		}

		var dlListOwners = document.getElementById(this._dlListOwnersId);
		Dwt.associateElementWithObject(dlListOwners, this);
		if (this._acAddrSelectList) {
			this._acAddrSelectList.handle(dlListOwners);
		}
		else {
			Dwt.setHandler(dlListOwners, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		}

		for (i = 0; i < this._mailPolicyOpts.length; i++) {
			opt =  this._mailPolicyOpts[i];
			policy = document.getElementById(this._dlMailPolicyId[opt]);
			Dwt.setHandler(policy, DwtEvent.ONCHANGE, ZmGroupView._onChange);
			Dwt.associateElementWithObject(policy, this);
		}
		var dlListSpecificMailers = document.getElementById(this._dlListSpecificMailersId);
		Dwt.associateElementWithObject(dlListSpecificMailers, this);
		if (this._acAddrSelectList) {
			this._acAddrSelectList.handle(dlListSpecificMailers);
		}
		else {
			Dwt.setHandler(dlListSpecificMailers, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		}

	}
	else {
		var groupName = document.getElementById(this._groupNameId);
		Dwt.setHandler(groupName, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		Dwt.associateElementWithObject(groupName, this);
	}

	if (!this._noManualEntry) {
		Dwt.setHandler(this._groupMembers, DwtEvent.ONKEYUP, ZmGroupView._onKeyUp);
		Dwt.associateElementWithObject(this._groupMembers, this);
	}

	for (var fieldId in this._searchField) {
		var searchField = this._searchField[fieldId];
		Dwt.setHandler(searchField, DwtEvent.ONKEYPRESS, ZmGroupView._keyPressHdlr);
		Dwt.associateElementWithObject(searchField, this);
	}
};

/**
 * very important method to have in order for the tab group (and tabbing) to be set up correctly (called from ZmBaseController.prototype._initializeTabGroup)
 */
ZmGroupView.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

ZmGroupView.prototype._getTabGroupMembers =
function() {
	var fields = [];
	if (this.isDistributionList()) {
		if (this._usernameEditable) {
			fields.push(document.getElementById(this._groupNameId));
		}
		if (this._domainEditable) {
			fields.push(document.getElementById(this._groupNameDomainId));
		}
		fields.push(document.getElementById(this._dlDisplayNameId));
		fields.push(document.getElementById(this._dlDescId));
		fields.push(document.getElementById(this._dlHideInGalId));
		for (var i = 0; i < this._mailPolicyOpts.length; i++) {
			var opt = this._mailPolicyOpts[i];
			fields.push(document.getElementById(this._dlMailPolicyId[opt]));
		}

		for (var i = 0; i < this._subsPolicyOpts.length; i++) {
			var opt = this._subsPolicyOpts[i];
			fields.push(document.getElementById(this._dlSubscriptionPolicyId[opt]));
		}
		for (i = 0; i < this._subsPolicyOpts.length; i++) {
			opt = this._subsPolicyOpts[i];
			fields.push(document.getElementById(this._dlUnsubscriptionPolicyId[opt]));
		}
		fields.push(document.getElementById(this._dlNotesId));
	}
	else {
		fields.push(document.getElementById(this._groupNameId));
	}
	if (!this._noManualEntry) {
		fields.push(this._groupMembers);
	}
	for (var fieldId in this._searchField) {
		fields.push(this._searchField[fieldId]);
	}
	fields.push(this._searchButton);
	fields.push(this._searchInSelect);

	return fields;
};

ZmGroupView.prototype._getDefaultFocusItem =
function() {
	if (this.isDistributionList()) {
		if (this._usernameEditable) {
			return document.getElementById(this._groupNameId);
		}
		if (this._domainEditable) {
			return document.getElementById(this._groupNameDomainId);
		}
		return document.getElementById(this._dlDisplayNameId);
	}
	return document.getElementById(this._groupNameId);
};

ZmGroupView.prototype._getGroupMembers =
function() {
	return this._groupMembersListView.getList().getArray();
};

ZmGroupView.prototype._getFolderId =
function() {
	return this._folderId || ZmFolder.ID_CONTACTS;
};

ZmGroupView.prototype._setGroupMembers =
function() {
	var members = this._contact.getAllGroupMembers();
	if (!members) {
		return;
	}
	this._groupMembersListView.set(AjxVector.fromArray(members)); //todo?
};

ZmGroupView.prototype._setGroupName =
function() {
	if (this.isDistributionList()) {
		if (this._domainEditable) {
			var groupNameDomain = document.getElementById(this._groupNameDomainId);
			groupNameDomain.value = this._emailDomain;
		}
		if (this._usernameEditable) {
			this._groupNameInput.setValue(this._emailUsername);
		}
		return;
	}
	var groupName = document.getElementById(this._groupNameId);
	if (!groupName) {
		return;
	}

	this._groupNameInput.setValue(this._contact.getFileAs());
};

ZmGroupView.prototype._setDlFields =
function() {
	var displayName = document.getElementById(this._dlDisplayNameId);
	var dlInfo = this._contact.dlInfo;
	displayName.value = dlInfo.displayName || "";

	var desc = document.getElementById(this._dlDescId);
	desc.value = dlInfo.description || "";

	var hideInGal = document.getElementById(this._dlHideInGalId);
	hideInGal.checked = dlInfo.hideInGal;

	//set the default only in temporary var so it will be saved later as modification, even if user doesn't change.
	//this is for the new DL case
	var subsPolicy = dlInfo.subscriptionPolicy || ZmContactSplitView.SUBSCRIPTION_POLICY_ACCEPT;
	var unsubsPolicy = dlInfo.unsubscriptionPolicy || ZmContactSplitView.SUBSCRIPTION_POLICY_ACCEPT;
	for (var i = 0; i < this._subsPolicyOpts.length; i++) {
		var opt = this._subsPolicyOpts[i];
		var subsPolicyOpt = document.getElementById(this._dlSubscriptionPolicyId[opt]);
		subsPolicyOpt.checked = subsPolicy == opt;

		var unsubsPolicyOpt = document.getElementById(this._dlUnsubscriptionPolicyId[opt]);
		unsubsPolicyOpt.checked = unsubsPolicy == opt;
	}
	var mailPolicy = dlInfo.mailPolicy || ZmGroupView.MAIL_POLICY_ANYONE;
	for (i = 0; i < this._mailPolicyOpts.length; i++) {
		opt = this._mailPolicyOpts[i];
		var mailPolicyOpt = document.getElementById(this._dlMailPolicyId[opt]);
		mailPolicyOpt.checked = mailPolicy == opt;
	}
	if (dlInfo.mailPolicy == ZmGroupView.MAIL_POLICY_SPECIFIC) {
		var listSpecificMailers = document.getElementById(this._dlListSpecificMailersId);
		listSpecificMailers.value = dlInfo.mailPolicySpecificMailers.join("; ");
		if (listSpecificMailers.value.length > 0) {
			listSpecificMailers.value += ";"; //so it's ready to add more by user.
		}
	}

	var listOwners = document.getElementById(this._dlListOwnersId);
	listOwners.value = dlInfo.owners.join("; ");
	if (listOwners.value.length > 0) {
		listOwners.value += ";"; //so it's ready to add more by user.
	}

	var notes = document.getElementById(this._dlNotesId);
	notes.value = dlInfo.notes || "";

};


ZmGroupView.prototype._resetSearchInSelect =
function() {
	this._searchInSelect.addOption(ZmMsg.contacts, true, ZmContactsApp.SEARCHFOR_CONTACTS);
	if (appCtxt.get(ZmSetting.SHARING_ENABLED)) {
		this._searchInSelect.addOption(ZmMsg.searchPersonalSharedContacts, false, ZmContactsApp.SEARCHFOR_PAS);
	}
	if (appCtxt.get(ZmSetting.GAL_ENABLED) && appCtxt.getActiveAccount().isZimbraAccount) {
		this._searchInSelect.addOption(ZmMsg.GAL, true, ZmContactsApp.SEARCHFOR_GAL);
	}
	if (!appCtxt.get(ZmSetting.INITIALLY_SEARCH_GAL) || !appCtxt.get(ZmSetting.GAL_ENABLED)) {
		this._searchInSelect.setSelectedValue(ZmContactsApp.SEARCHFOR_CONTACTS);
	}
};

ZmGroupView.prototype._setLocationFolder = function(organizerOrId) {
	if (organizerOrId) {
		var organizer = organizerOrId instanceof ZmOrganizer ? organizerOrId : appCtxt.getById(organizerOrId);
	}
	if (!organizer || organizer.isReadOnly()) {
		//default to the main contacts folder
		organizer = appCtxt.getById(ZmOrganizer.ID_ADDRBOOK);
	}

	this._locationButton.setText(organizer.getName());
	this._folderId = organizer.id;
};

ZmGroupView.prototype._handleFolderButton = function(ev) {
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.registerCallback(DwtDialog.OK_BUTTON, new AjxCallback(this, this._handleChooseFolder));
	var params = {
		overviewId:		dialog.getOverviewId(ZmApp.CONTACTS),
		title:			ZmMsg.chooseAddrBook,
		treeIds:		[ZmOrganizer.ADDRBOOK],
		skipReadOnly:	true,
		skipRemote:		false,
		noRootSelect:	true,
		appName:		ZmApp.CONTACTS
	};
	params.omit = {};
	params.omit[ZmFolder.ID_TRASH] = true;
	dialog.popup(params);
};

/**
 * @private
 */
ZmGroupView.prototype._handleChooseFolder = function(organizer) {
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.popdown();
	this._isDirty = true;
	this._setLocationFolder(organizer);
};

ZmGroupView.prototype._setTags =
function() {
	var tagCell = this._getTagCell();
	if (!tagCell) { return; }

	tagCell.innerHTML = ZmTagsHelper.getTagsHtml(this._contact, this);
};

// Consistent spot to locate various dialogs
ZmGroupView.prototype._getDialogXY =
function() {
	if (this.isDistributionList()) {
		// the scrolling messes up the calculation of Dwt.toWindow. This however seems to work fine, the dialog is just a little higher than other cases
		return new DwtPoint(ZmGroupView.DIALOG_X, ZmGroupView.DIALOG_Y);
	}
	var loc = Dwt.toWindow(this.getHtmlElement(), 0, 0);
	return new DwtPoint(loc.x + ZmGroupView.DIALOG_X, loc.y + ZmGroupView.DIALOG_Y);
};

// Listeners

ZmGroupView.prototype._groupMembersSelectionListener =
function(ev){
	var selection = this._groupMembersListView.getSelection();
	if (ev && ev.target && this._groupMembersListView.delButtons[ev.target.id]) {
		this._delListener(ev);	
	}
	else if (ev && ev.target && this._groupMembersListView.quickAddButtons[ev.target.id]) {
		if (AjxUtil.isArray(selection)) {
			var address = selection[0].address || selection[0];
			this.quickAddContact(address);
		}
	}
		
};

ZmGroupView.prototype._selectionListener =
function(ev) {
	var selection = this._listview.getSelection();

	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		this._addItems(selection);
	} else {
		this._addButton.setEnabled(selection.length > 0);
	}
};

ZmGroupView.prototype._selectChangeListener =
function(ev) {
	this._attr[ZmContact.F_folderId] = ev._args.newValue;
	this._isDirty = true;
};

ZmGroupView.prototype._searchTypeListener =
function(ev) {
	var oldValue = ev._args.oldValue;
	var newValue = ev._args.newValue;

	if (oldValue != newValue) {
		this._updateSearchRows(newValue);
		this._searchButtonListener();
	}
};

ZmGroupView.prototype._delListener =
function(ev){

	var items = this._groupMembersListView.getSelection();
	var selectedDomItems = this._groupMembersListView.getSelectedItems();

	while (selectedDomItems.get(0)) {
		this._groupMembersListView.removeItem(selectedDomItems.get(0));
	}

	for (var i = 0;  i < items.length; i++) {
		var item = items[i];
		this._groupMembersListView.getList().remove(item);
		var contact = item.__contact;
		var type = item.type;
		var value = item.groupRefValue || item.value;

		//var value = item.value || (contact ? contact.getId(!contact.isGal) : item);

		if (!this._groupMemberMods[value]) {
			this._groupMemberMods[value] = {op : "-", value : value, email: item.address, type : type};
		}
		else {
			this._groupMemberMods[value] = {};
		}
	}

	this._groupMembersSelectionListener();
	this._isDirty = true;
};

ZmGroupView.prototype._addNewListener =
function(ev){
	var emailStr = this._addNewField.value;
	if (!emailStr || emailStr == '') { return; }

	var allArray = AjxEmailAddress.parseEmailString(emailStr).all.getArray(); //in bug 38907 it was changed to "all" instead of "good". No idea why. So we can now add bad email addresses. Is that on purpose?
	var addrs = [];
	for (var i = 0; i < allArray.length; i++) {
		addrs.push(ZmContactsHelper._wrapInlineContact(allArray[i].address)); //might be better way to do this, we recreate the AjxEmailAddress just to add the "value" and "type" and maybe "id" attributes.
	}

	addrs = ZmGroupView._dedupe(addrs, this._groupMembersListView.getList().getArray());
	this._addToMembers(addrs);

	this._addNewField.value = '';
};

ZmGroupView.prototype._addListener =
function(ev) {
	var list = (ev.dwtObj == this._addButton)
		? this._listview.getSelection()
		: this._listview.getList().getArray();

	this._addItems(list);
};

ZmGroupView.prototype._addItems =
function(list) {
	if (list.length == 0) { return; }

	// we have to walk the results in case we hit a group which needs to be split
	var items = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var contact = item.__contact;
		if (item.isGroup && !contact.isDistributionList()) {
			var groupMembers = contact.attr[ZmContact.F_groups];
			for (var j = 0; j < groupMembers.length; j++) {
				var value = groupMembers[j].value;
				var memberContact = ZmContact.getContactFromCache(value);
				var obj;
				if (memberContact) {
					obj = ZmContactsHelper._wrapContact(memberContact);
				}
				else {
					obj = ZmContactsHelper._wrapInlineContact(value);
				}
				if (obj) {
					items.push(obj);
				}
			}
		}
		else {
			items.push(list[i]);
            if (contact.isGal) {
                appCtxt.cacheSet(contact.ref, contact); //not sure why we do this. just seems like maybe we should do this elsewhere in more consistent way. 
            }
		}
	}

	items = ZmGroupView._dedupe(items, this._groupMembersListView.getList().getArray());
	if (items.length > 0) {
		this._addToMembers(items);
	}
};

ZmGroupView.prototype._addToMembers =
function(items){
	var userZid = appCtxt.accountList.mainAccount.id;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var type = item.type;
		var value = item.value;
		var email = item.address;
		var obj = this._groupMemberMods[value];
		if (!obj) {
			if (type === ZmContact.GROUP_CONTACT_REF && value && value.indexOf(":") === -1 ) {
				value = userZid + ":" + value;
			}
			this._groupMemberMods[value] = {op : "+", value : value, type : type, email: email};
		}
		else if (obj.op == "-") {
			//contact is already in the group, clear the value
			this._groupMemberMods[value] = {};
		}
	}
	var membersList = this._groupMembersListView.getList();
	items = items.concat(membersList ? membersList.getArray() : []);
	this._isDirty = true;

	this._groupMembersListView.set(AjxVector.fromArray(items));
};

/**
 * Returns the items from newItems that are not in list, and also not duplicates within newItems (i.e. returns one of each)
 *
 * @param newItems {Array} array of items to be added to the target list
 * @param list {Array} the target list as an array of items
 * @return {Array} uniqueNewItems the unique new items (items that are not in the list or duplicates in the newItems)
 * @private
 */
ZmGroupView._dedupe =
function(newItems, list) {

	AjxUtil.dedup(newItems, function(item) {
		return item.type + "$" + item.value;
	});

	var uniqueNewItems = [];

	for (var i = 0; i < newItems.length; i++) {
		var newItem = newItems[i];
		var found = false;
		for (var j = 0; j < list.length; j++) {
			var item = list[j];
			if (newItem.type == item.type && newItem.value == item.value) {
				found = true;
				break;
			}
		}
		if (!found) {
			uniqueNewItems.push(newItem);
		}
	}

	return uniqueNewItems;
};

ZmGroupView.prototype._setGroupMemberValue =
function(value, append) {
	if (this._noManualEntry) {
		this._groupMembers.disabled = false;
	}

	if (append) {
		this._groupMembers.value += value;
	} else {
		this._groupMembers.value = value;
	}

	if (this._noManualEntry) {
		this._groupMembers.disabled = true;
	}
};


/**
 * called from ZmContactPicker.prototype._showResults
 * @param list
 */
ZmGroupView.prototype._setResultsInView =
function(list) {
	var arr = list.getArray();
	this._listview.setItems(arr);
	this._addButton.setEnabled(arr.length > 0);
	this._addAllButton.setEnabled(arr.length > 0);
};

/**
 * called from ZmContactPicker.prototype._showResults
 */
ZmGroupView.prototype._setNoResultsHtml =
function(list) {
	//no need to do anything here. the setItems called from _setResultsInView sets the "no results found" if list is empty. (via call to addItems)
};

/**
 * reuse functions from ZmContactPicker, some called from ZmContactPicker code we re-use here.
 */
ZmGroupView.prototype.search = ZmContactPicker.prototype.search;
ZmGroupView.prototype._handleResponseSearch = ZmContactPicker.prototype._handleResponseSearch;
ZmGroupView.prototype._resetResults = ZmContactPicker.prototype._resetResults;
ZmGroupView.prototype._searchButtonListener = ZmContactPicker.prototype._searchButtonListener;
ZmGroupView.prototype._pageListener = ZmContactPicker.prototype._pageListener;
ZmGroupView.prototype._showResults = ZmContactPicker.prototype._showResults;
ZmGroupView.prototype.getSubList = ZmContactPicker.prototype.getSubList;


ZmGroupView.prototype._tagChangeListener = function(ev) {
	if (ev.type != ZmEvent.S_TAG) { return; }

	var fields = ev.getDetail("fields");
	var changed = fields && (fields[ZmOrganizer.F_COLOR] || fields[ZmOrganizer.F_NAME]);
	if ((ev.event == ZmEvent.E_MODIFY && changed) || ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.MODIFY) {
		this._setTags();
	}
};

ZmGroupView.prototype._groupChangeListener = function(ev) {
	if (ev.type != ZmEvent.S_CONTACT) return;
	if (ev.event == ZmEvent.E_TAGS || ev.event == ZmEvent.E_REMOVE_ALL) {
		this._setTags();
	}
};

ZmGroupView.prototype._updateSearchRows =
function(searchFor) {
	var fieldIds = (searchFor == ZmContactsApp.SEARCHFOR_GAL) ? ZmContactPicker.SHOW_ON_GAL : ZmContactPicker.SHOW_ON_NONGAL;
	for (var fieldId in this._searchRow) {
		Dwt.setVisible(this._searchRow[fieldId], AjxUtil.indexOf(fieldIds, fieldId)!=-1);
	}
};

ZmGroupView.prototype._resetSearchColHeaders =
function() {
	var lv = this._listview;
	lv.headerColCreated = false;
	var isGal = this._searchInSelect && (this._searchInSelect.getValue() == ZmContactsApp.SEARCHFOR_GAL);

	for (var i = 0; i < lv._headerList.length; i++) {
		var field = lv._headerList[i]._field;
		if (field == ZmItem.F_DEPARTMENT) {
			lv._headerList[i]._visible = isGal && this._detailedSearch;
		}
	}

	var sortable = isGal ? null : ZmItem.F_NAME;
	lv.createHeaderHtml(sortable);
};

ZmGroupView.prototype._checkItemCount =
function() {
	this._listview._checkItemCount();
};

ZmGroupView.prototype._handleResponseCheckReplenish =
function(skipSelection) {
	this._listview._handleResponseCheckReplenish(skipSelection);
};

// Static methods

ZmGroupView._onKeyUp =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);

	var key = DwtKeyEvent.getCharCode(ev);
	if (DwtKeyMapMgr.hasModifier(ev) || DwtKeyMap.IS_MODIFIER[key] ||	key === DwtKeyEvent.KEY_TAB) { return; }

	var e = DwtUiEvent.getTarget(ev);
	var view = e ? Dwt.getObjectFromElement(e) : null;
	if (view) {
		view._isDirty = true;
	}

	return true;
};

ZmGroupView._onChange =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);

	var e = DwtUiEvent.getTarget(ev);
	var view = e ? Dwt.getObjectFromElement(e) : null;
	if (view) {
		view._isDirty = true;
	}

	return true;
};

ZmGroupView._keyPressHdlr =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	if (DwtKeyMapMgr.hasModifier(ev)) { return; }

	var e = DwtUiEvent.getTarget(ev);
	var view = e ? Dwt.getObjectFromElement(e) : null;
	if (view) {
		var charCode = DwtKeyEvent.getCharCode(ev);
		if (charCode == 13 || charCode == 3) {
			view._searchButtonListener(ev);
			return false;
		}
	}
	return true;
};

ZmGroupView.prototype.quickAddContact = 
function(email) {
	var quickAdd = appCtxt.getContactQuickAddDialog();
	quickAdd.setFields(email);
	var saveCallback = new AjxCallback(this, this._handleQuickAddContact);
	quickAdd.popup(saveCallback);
};

ZmGroupView.prototype._handleQuickAddContact = 
function(result) {
	var resp = AjxUtil.get(result, "_data", "BatchResponse", "CreateContactResponse");
	var contact = resp ? ZmContact.createFromDom(resp[0].cn[0], {}) : null;
	if (!contact) {
		return;
	}
	var selection = this._groupMembersListView.getSelection();
	var selectedItem = selection[0];
	var value = selectedItem.value;
	if (!this._groupMemberMods[value]) {
		this._groupMemberMods[value] = {op : "-", value : value, type : selectedItem.type};
	}
	else {
		this._groupMemberMods[value] = {};
	}
	var domList = this._groupMembersListView.getSelectedItems();
	this._groupMembersListView.removeItem(domList.get(0));
	this._groupMembersListView.getList().remove(selectedItem);

	var obj = ZmContactsHelper._wrapContact(contact);
	if (obj) {
		this._addItems([obj]);
	}
};

/**
 * Creates a group list view for search results
 * @constructor
 * @class
 *
 * @param {ZmGroupView}		parent			containing widget
 * 
 * @extends		DwtListView
 * 
 * @private
*/
ZmGroupListView = function(parent) {
	if (arguments.length == 0) { return; }
	DwtListView.call(this, {parent:parent, className:"DwtChooserListView ZmEditGroupContact",
							headerList:this._getHeaderList(parent), view:this._view, posStyle: Dwt.RELATIVE_STYLE,
							listLabel: ZmMsg.memberList});
	Dwt.setScrollStyle(this._elRef, Dwt.CLIP);
};

ZmGroupListView.prototype = new DwtListView;
ZmGroupListView.prototype.constructor = ZmGroupListView;

ZmGroupListView.prototype.setItems =
function(items) {
	this._resetList();
	this.addItems(items);
	var list = this.getList();
	if (list && list.size() > 0) {
		this.setSelection(list.get(0));
	}
};

ZmGroupListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_TYPE,	icon:"Contact",		width:ZmMsg.COLUMN_WIDTH_TYPE_CN})),
		(new DwtListHeaderItem({field:ZmItem.F_NAME,	text:ZmMsg._name,	width:ZmMsg.COLUMN_WIDTH_NAME_CN, resizeable: true})),
		(new DwtListHeaderItem({field:ZmItem.F_EMAIL,	text:ZmMsg.email}))
	];
};

ZmGroupListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
	return ZmContactsHelper._getEmailField(html, idx, item, field, colIdx, params);
};

ZmGroupListView.prototype._itemClicked =
function(clickedEl, ev) {
	// Ignore right-clicks, we don't support action menus
	if (!ev.shiftKey && !ev.ctrlKey && ev.button == DwtMouseEvent.RIGHT) { return; }

	DwtListView.prototype._itemClicked.call(this, clickedEl, ev);
};

ZmGroupListView.prototype._mouseDownAction =
function(ev, div) {
	return !Dwt.ffScrollbarCheck(ev);
};

ZmGroupListView.prototype._mouseUpAction =
function(ev, div) {
	return !Dwt.ffScrollbarCheck(ev);
};

//stub method
ZmGroupListView.prototype._checkItemCount =
function() {
	return true;
};

//stub method
ZmGroupListView.prototype._handleResponseCheckReplenish =
function() {
	return true;
};

/**
 * Creates a group members list view
 * @constructor
 * @class
 *
 * @param {ZmGroupView}	parent			containing widget
 * 
 * @extends		ZmGroupListView
 * 
 * 
 * @private
 */
ZmGroupMembersListView = function (parent) {
	if (arguments.length == 0) { return; }
	ZmGroupListView.call(this, parent);
	this._list = new AjxVector();
	// hash of delete icon IDs
	this.delButtons = {};
	this.quickAddButtons = {};
};

ZmGroupMembersListView.prototype = new ZmGroupListView;
ZmGroupMembersListView.prototype.constructor = ZmGroupMembersListView;

ZmGroupMembersListView.prototype._getHeaderList =
function() {
	return [(new DwtListHeaderItem({field:ZmItem.F_EMAIL, text:ZmMsg.membersLabel, view:this._view}))];
};

ZmGroupMembersListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
	if (field == ZmItem.F_EMAIL) {
		var data = {};
		data.isEdit = true;
		data.delButtonId = Dwt.getNextId("DelContact_");
		this.delButtons[data.delButtonId] = true;
		var contact = item.__contact;
		var addr = item.address;

		if (contact && !this.parent.isDistributionList()) {
			data.imageUrl = contact.getImageUrl();
			data.email = AjxStringUtil.htmlEncode(contact.getEmail());
			data.title = AjxStringUtil.htmlEncode(contact.getAttr(ZmContact.F_jobTitle));
			data.phone = AjxStringUtil.htmlEncode(contact.getPhone());
			data.imgClassName = contact.getIconLarge(); 
			var isPhonetic  = appCtxt.get(ZmSetting.PHONETIC_CONTACT_FIELDS);
			var fullnameHtml= contact.getFullNameForDisplay(isPhonetic);
			if (!isPhonetic) {
				fullnameHtml = AjxStringUtil.htmlEncode(fullnameHtml);
			}
			data.fullName = fullnameHtml;
		}
		else {
			data.imgClassName = "PersonInline_48";
			data.email = AjxStringUtil.htmlEncode(addr);
			if (!this.parent.isDistributionList()) {
				data.isInline = true;
				data.quickAddId = Dwt.getNextId("QuickAdd_");
				this.quickAddButtons[data.quickAddId] = true;
			}
		}
		html[idx++] = AjxTemplate.expand("abook.Contacts#SplitView_group", data);

	}
	return idx;
};


// override from base class since it is handled differently
ZmGroupMembersListView.prototype._getItemId =
function(item) {
	return (item && item.id) ? item.id : Dwt.getNextId();
};

/**
 * @class
 *
 * @param	{DwtControl}	parent		    the parent (dialog)
 * @param	{String}	    className		the class name
 *
 * @extends		DwtTabViewPage
 */
ZmDlPropertiesTabView = function(parent, className) {
    if (arguments.length == 0) return;

    DwtTabViewPage.call(this, parent, className, Dwt.ABSOLUTE_STYLE);

	this.setScrollStyle(Dwt.SCROLL);

	var htmlEl = this.getHtmlElement();
	htmlEl.style.top = this.parent._tabView.getY() + this.parent._tabView._tabBar.getH() + "px";
	htmlEl.style.bottom = 0;

};

ZmDlPropertiesTabView.prototype = new DwtTabViewPage;

ZmDlPropertiesTabView.prototype.toString = function() {
	return "ZmDlPropertiesTabView";
};

ZmDlPropertiesTabView.prototype._createHtml =
function () {
	DwtTabViewPage.prototype._createHtml.call(this);
	this.getHtmlElement().innerHTML = AjxTemplate.expand("abook.Contacts#DlPropertiesView", this.parent._templateParams);
};

/**
 * @class
 *
 * @param	{DwtControl}	parent		    the parent (dialog)
 * @param	{String}	    className		the class name
 *
 * @extends		DwtTabViewPage
 */
ZmDlMembersTabView = function(parent, className) {
    if (arguments.length == 0) return;

    DwtTabViewPage.call(this, parent, className, Dwt.RELATIVE_STYLE);

};

ZmDlMembersTabView.prototype = new DwtTabViewPage;

ZmDlMembersTabView.prototype.toString = function() {
	return "ZmDlMembersTabView";
};

ZmDlMembersTabView.prototype._createHtml =
function () {
	DwtTabViewPage.prototype._createHtml.call(this);
	this.getHtmlElement().innerHTML = AjxTemplate.expand("abook.Contacts#GroupViewMembers", this.parent._templateParams);
};

}
if (AjxPackage.define("zimbraMail.abook.view.ZmContactsBaseView")) {
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
 * This file contains the contacts base view classes.
 */

/**
 * Creates the base view.
 * @class
 * This class represents the base view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * 
 * @extends		ZmListView
 */
ZmContactsBaseView = function(params) {

	if (arguments.length == 0) { return; }

	params.posStyle = params.posStyle || Dwt.ABSOLUTE_STYLE;
	params.type = ZmItem.CONTACT;
	params.pageless = true;
	ZmListView.call(this, params);

	this._handleEventType[ZmItem.GROUP] = true;
};

ZmContactsBaseView.prototype = new ZmListView;
ZmContactsBaseView.prototype.constructor = ZmContactsBaseView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmContactsBaseView.prototype.toString =
function() {
	return "ZmContactsBaseView";
};

/**
 * Sets the list.
 * 
 * @param	{ZmContactList}		list		the list
 * @param	{String}	sortField		the sort field
 * @param	{String}	folderId		the folder id
 */
ZmContactsBaseView.prototype.set =
function(list, sortField, folderId) {

	if (this._itemsToAdd) {
		this.addItems(this._itemsToAdd);
		this._itemsToAdd = null;
	} else {
		var subList;
		if (list instanceof ZmContactList) {
			// compute the sublist based on the folderId if applicable
			list.addChangeListener(this._listChangeListener);
			// for accounts where gal paging is not supported, show *all* results
			subList = (list.isGal && !list.isGalPagingSupported)
				? list.getVector().clone()
				: list.getSubList(this.offset, this.getLimit(this.offset), folderId);
		} else {
			subList = list;
		}
		this._folderId = folderId;
		DwtListView.prototype.set.call(this, subList, sortField);
	}
	this._setRowHeight();
	this._rendered = true;
};

/**
 * @private
 */
ZmContactsBaseView.prototype._setParticipantToolTip =
function(address) {
	// XXX: OVERLOADED TO SUPPRESS JS ERRORS..
	// XXX: REMOVE WHEN IMPLEMENTED - SEE BASE CLASS ZmListView
};

/**
 * Gets the list view.
 * 
 * @return	{ZmContactsBaseView}	the list view
 */
ZmContactsBaseView.prototype.getListView =
function() {
	return this;
};

/**
 * Gets the title.
 * 
 * @return	{String}	the view title
 */
ZmContactsBaseView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this._controller.getApp().getDisplayName()].join(": ");
};

/**
 * @private
 */
ZmContactsBaseView.prototype._changeListener =
function(ev) {
	var folderId = this._controller.getFolderId();

	// if we dont have a folder, then assume user did a search of contacts
	if (folderId != null || ev.event != ZmEvent.E_MOVE) {
		ZmListView.prototype._changeListener.call(this, ev);

		if (ev.event == ZmEvent.E_MODIFY) {
			this._modifyContact(ev);
			var contact = ev.item || ev._details.items[0];
			if (contact instanceof ZmContact) {
				this.setSelection(contact, false, true);
			}
		} else if (ev.event == ZmEvent.E_CREATE) {
			var newContact = ev._details.items[0];
			var newFolder = appCtxt.getById(newContact.folderId);
			var newFolderId = newFolder && (appCtxt.getActiveAccount().isMain ? newFolder.nId : newFolder.id);
			var visible = ev.getDetail("visible");

			// only add this new contact to the listview if this is a simple
			// folder search and it belongs!
			if (folderId && newFolder && folderId == newFolderId && visible) {
				var index = ev.getDetail("sortIndex");
				var alphaBar = this.parent ? this.parent.getAlphabetBar() : null;
				var inAlphaBar = alphaBar ? alphaBar.isItemInAlphabetLetter(newContact) : true;
				if (index != null && inAlphaBar) {
					this.addItem(newContact, index);
				}

				// always select newly added contact if its been added to the
				// current page of contacts
				if (inAlphaBar) {
					this.setSelection(newContact, false, true);
				}
			}
		} else if (ev.event == ZmEvent.E_DELETE) {
			// bug fix #19308 - do house-keeping on controller's list so
			// replenishment works as it should
			var list = this._controller.getList();
			if (list) {
				list.remove(ev.item);
			}
		}
	}
};

ZmContactsBaseView.prototype.setSelection =
function(item, skipNotify, setPending) {
	if (!item) { return; }

	var el = this._getElFromItem(item);
	if (el) {
		ZmListView.prototype.setSelection.call(this, item, skipNotify);
		this._pendingSelection = null;
	} else if (setPending) {
		this._pendingSelection = {item: item, skipNotify: skipNotify};
	}
};

ZmContactsBaseView.prototype.addItems =
function(itemArray) {
	ZmListView.prototype.addItems.call(this, itemArray);
	if (this._pendingSelection && AjxUtil.indexOf(itemArray, this._pendingSelection.item)!=-1) {
		this.setSelection(this._pendingSelection.item, this._pendingSelection.skipNotify);
	}
}


/**
 * @private
 */
ZmContactsBaseView.prototype._modifyContact =
function(ev) {
	var list = this.getList();
	//the item was updated - the list might be "old" (not pointing to the latest items,
	// since we refreshed the items in the appCtxt cache by a different view. see bug 84226)
	//therefor let's make sure the modified contact replaces the old one in the list.
	var contact = ev.item;
	if (contact) {
		var arr = list.getArray();
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id === contact.id) {
				if (arr[i] === contact) {
					//nothing changed, still points to same object
					break;
				}
				arr[i] = contact;
				//update the viewed contact
				this.parent.setContact(contact);
				break;
			}
		}
	}
	// if fileAs changed, resort the internal list
	// XXX: this is somewhat inefficient. We should just remove this contact and reinsert
	if (ev.getDetail("fileAsChanged")) {
		if (list) {
			list.sort(ZmContact.compareByFileAs);
		}
	}
};

/**
 * @private
 */
ZmContactsBaseView.prototype._setNextSelection =
function() {
	// set the next appropriate selected item
	if (this.firstSelIndex < 0) {
		this.firstSelIndex = 0;
	}

	// get first valid item to select
	var item;
	if (this._list) {
		item = this._list.get(this.firstSelIndex);

		// only get the first non-trash contact to select if we're not in Trash
		if (this._controller.getFolderId() == ZmFolder.ID_TRASH) {
			if (!item) {
				item = this._list.get(0);
			}
		} else if (item == null || (item && item.folderId == ZmFolder.ID_TRASH)) {
			item = null;
			var list = this._list.getArray();

			if (this.firstSelIndex > 0 && this.firstSelIndex == list.length) {
				item = list[list.length-1];
			} else {
				for (var i=0; i < list.length; i++) {
					if (list[i].folderId != ZmFolder.ID_TRASH) {
						item = list[i];
						break;
					}
				}
			}

			// reset first sel index
			if (item) {
				var div = document.getElementById(this._getItemId(item));
				if (div) {
					var data = this._data[div.id];
					this.firstSelIndex = this._list ? this._list.indexOf(data.item) : -1;
				}
			}
		}
	}

	this.setSelection(item);
};

/**
 * Creates the alphabet bar.
 * @class
 * This class represents the contact alphabet bar.
 * 
 * @param {DwtComposite}	parent			the parent
 * 
 * @extends		DwtComposite
 */
ZmContactAlphabetBar = function(parent) {

	DwtComposite.call(this, {parent:parent});

	this._createHtml();

	this._all = this._current = document.getElementById(this._alphabetBarId).rows[0].cells[0];
	this._currentLetter = null;
	this.setSelected(this._all, true);
	this._enabled = true;
	this.addListener(DwtEvent.ONCLICK, this._onClick.bind(this));
};

ZmContactAlphabetBar.prototype = new DwtComposite;
ZmContactAlphabetBar.prototype.constructor = ZmContactAlphabetBar;
ZmContactAlphabetBar.prototype.role = 'toolbar';

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmContactAlphabetBar.prototype.toString =
function() {
	return "ZmContactAlphabetBar";
};

/**
 * Enables the bar.
 * 
 * @param	{Boolean}	enable		if <code>true</code>, enable the bar
 */
ZmContactAlphabetBar.prototype.enable =
function(enable) {
	this._enabled = enable;

	var alphabetBarEl = document.getElementById(this._alphabetBarId);
	if (alphabetBarEl) {
		alphabetBarEl.className = enable ? "AlphabetBarTable" : "AlphabetBarTable AlphabetBarDisabled";
	}
};

/**
 * Checks if the bar is enabled.
 * 
 * @return	{Boolean}	<code>true</code> if enabled
 */
ZmContactAlphabetBar.prototype.enabled =
function() {
	return this._enabled;
};

/**
 * Resets the bar.
 * 
 * @param	{Object}	useCell		the cell or <code>null</code>
 * @return	{Boolean}				Whether the cell was changed (false if it was already set to useCell)
 */
ZmContactAlphabetBar.prototype.reset =
function(useCell) {
	var cell = useCell || this._all;
	if (cell != this._current) {
		this.setSelected(this._current, false);
		this._current = cell;
		this._currentLetter = useCell && useCell != this._all ? useCell.innerHTML : null;
		this.setSelected(cell, true);
		return true;
	}
	return false;
};

/**
 * Sets the button index.
 * 
 * @param	{int}	index		the index
 */
ZmContactAlphabetBar.prototype.setButtonByIndex =
function(index) {
	var table = document.getElementById(this._alphabetBarId);
	var cell = table.rows[0].cells[index];
	if (cell) {
		this.reset(cell);
	}
};

/**
 * Gets the current cell.
 * 
 * @return	{Object}	the cell
 */
ZmContactAlphabetBar.prototype.getCurrent =
function() {
	return this._current;
};

/**
 * Gets the current cell letter.
 * 
 * @return	{String}	the cell letter, or null for "all"
 */
ZmContactAlphabetBar.prototype.getCurrentLetter =
function() {
	return this._currentLetter;
};

/**
 * Sets the cell as selected.
 * 
 * @param	{Object}	cell	the cell
 * @param	{Boolean}	selected	if <code>true</code>, set as selected
 */
ZmContactAlphabetBar.prototype.setSelected =
function(cell, selected) {
	cell.className = selected
		? "DwtButton-active AlphabetBarCell"
		: "DwtButton AlphabetBarCell";
	cell.setAttribute('aria-selected', selected);
	if (selected) {
		this.getHtmlElement().setAttribute('aria-activedescendant', cell.id);
		this.setFocusElement(cell);
	}
};

/**
 * Sets the cell as selected and performs a new search based on the selection.
 * 
 * @param	{Object}	cell		the cell
 * @param	{String}	letter		the letter to begin the search with
 * @param	{String}	endLetter	the letter to end the search with
 */
ZmContactAlphabetBar.alphabetClicked =
function(cell, letter, endLetter) {
	// get reference to alphabet bar - ugh
	var clc = AjxDispatcher.run("GetContactListController");
	var alphabetBar = clc && clc.getCurrentView() && clc.getCurrentView().getAlphabetBar();
	if (alphabetBar && alphabetBar.enabled()) {
		if (alphabetBar.reset(cell)) {
            letter = letter && String(letter).substr(0,1);
            endLetter = endLetter && String(endLetter).substr(0,1);
			clc.searchAlphabet(letter, endLetter);
        }
	}
};

/**
 * determine if contact belongs in the current alphabet bar.  Used when creating a new contact and not doing a reload --
 * such as new contact group from action menu.
 * @param item  {ZmContact}
 * @return {boolean} true/false if item belongs in alphabet selection
 */
ZmContactAlphabetBar.prototype.isItemInAlphabetLetter =
function(item) {
    var inCurrentBar = false;
	if (item) {
	  if (ZmMsg.alphabet && ZmMsg.alphabet.length > 0) {
		  var all = ZmMsg.alphabet.split(",")[0]; //get "All" for locale
	  }
	  var fileAs = item.getFileAs();
	  var currentLetter = this.getCurrentLetter();
	  if (!currentLetter || currentLetter.toLowerCase() == all) {
		  inCurrentBar = true; //All is selected
	  }
	  else if (currentLetter && fileAs) {
		var itemLetter = String(fileAs).substr(0,1).toLowerCase();
		var cellLetter = currentLetter.substr(0,1).toLowerCase();
		if (itemLetter == cellLetter) {
			inCurrentBar = true;
		}
		else if(AjxStringUtil.isDigit(cellLetter) && AjxStringUtil.isDigit(itemLetter)) {
			//handles "123" in alphabet bar
			inCurrentBar = true;
		}
		else if (currentLetter.toLowerCase() == "a-z" && itemLetter.match("[a-z]")) {
			//handle A-Z cases for certain locales
			inCurrentBar = true;
		}
	  }
  }
  return inCurrentBar;
};

/**
 * @private
 */
ZmContactAlphabetBar.prototype._createHtml =
function() {
	this._alphabetBarId = this._htmlElId + "_alphabet";
	var alphabet = ZmMsg.alphabet.split(",");

	this.startSortMap =
		ZmContactAlphabetBar._parseSortVal(ZmMsg.alphabetSortValue);

	this.endSortMap =
		ZmContactAlphabetBar._parseSortVal(ZmMsg.alphabetEndSortValue);

	var subs = {
		id: 			this._htmlElId,
		alphabet: 		alphabet,
		numLetters: 		alphabet.length,
		ariaLabel:		ZmMsg.alphabetLabel
	};

	var element = this.getHtmlElement();
	element.innerHTML = AjxTemplate.expand("abook.Contacts#ZmAlphabetBar", subs);
	this.setAttribute('aria-label', ZmMsg.alphabetLabel);

	AjxUtil.foreach(Dwt.byClassName('AlphabetBarCell', element), (function(cell) {
        this._makeFocusable(cell, true);
        this._setEventHdlrs([ DwtEvent.ONCLICK ], false, cell);
    }).bind(this));
};

ZmContactAlphabetBar.prototype.getInputElement =
function() {
	return this._current;
};

ZmContactAlphabetBar.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_TOOLBAR_HORIZ;
};

ZmContactAlphabetBar.prototype.handleKeyAction =
function(actionCode, ev) {
	var target =
		Dwt.hasClass(ev.target, 'AlphabetBarCell') ? ev.target : this._current;

	switch (actionCode) {
	case DwtKeyMap.PREV:
		var previous = Dwt.getPreviousElementSibling(target);
		if (previous) {
			this.setFocusElement(previous);
		}
		return true;

	case DwtKeyMap.NEXT:
		var next = Dwt.getNextElementSibling(target);
		if (next) {
			this.setFocusElement(next);
		}
		return true;

	case DwtKeyMap.SELECT:
		target.click();
		return true;
	}
};

ZmContactAlphabetBar._parseSortVal =
function(sortVal) {
	if (!sortVal) {
		return {};
	}
	var sortMap = {};
	var values = sortVal.split(",");
	if (values && values.length) {
		for (var i = 0; i < values.length; i++) {
			var parts = values[i].split(":");
			sortMap[parts[0]] = parts[1];
		}
	}
	return sortMap;
};

/**
 * @private
 */
ZmContactAlphabetBar.prototype._onClick =
function(ev) {
	var cell = DwtUiEvent.getTarget(ev);

	if (!Dwt.hasClass(cell, 'AlphabetBarCell') ||
	    !this.enabled() || !this.reset(cell)) {
		return;
	}

	var idx = AjxUtil.indexOf(cell.parentNode.children, cell);
	var alphabet = ZmMsg.alphabet.split(",");

	var startLetter = null, endLetter = null;

	if (idx > 0) {
		startLetter = this.startSortMap[alphabet[idx]] || alphabet[idx].substr(0, 1);

		if (idx < alphabet.length - 1) {
			endLetter = this.endSortMap[alphabet[idx]] || alphabet[idx + 1].substr(0, 1);
		}
	}

	var clc = AjxDispatcher.run("GetContactListController");
	clc.searchAlphabet(startLetter, endLetter);
};


}
if (AjxPackage.define("zimbraMail.abook.view.ZmContactGroupMenu")) {
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
 * @overview
 */

/**
 * Creates an empty contact menu.
 * @class
 * This class represents a menu structure of contact groups that to which
 * contacts can be added. It also provides ability for user to create a new
 * contact group.
 *
 * @param {DwtControl}	parent		the parent widget
 * @param {ZmController}	controller	the owning controller
 * 
 * @extends		ZmPopupMenu
 */
ZmContactGroupMenu = function(parent, controller) {

	// create a menu (though we don't put anything in it yet) so that parent widget shows it has one
	ZmPopupMenu.call(this, parent, null, parent.getHTMLElId() + "|GROUP_MENU", controller);

	parent.setMenu(this);
	this._addHash = {};
	this._removeHash = {};
	this._evtMgr = new AjxEventMgr();
	this._desiredState = true;
	this._items = null;
	this._dirty = true;

	// Use a delay to make sure our slow popup operation isn't called when someone
	// is just rolling over a menu item to get somewhere else.
	if (parent instanceof DwtMenuItem) {
		parent.setHoverDelay(ZmContactGroupMenu._HOVER_TIME);
	}
};

ZmContactGroupMenu.prototype = new ZmPopupMenu;
ZmContactGroupMenu.prototype.constructor = ZmContactGroupMenu;

ZmContactGroupMenu.KEY_GROUP_EVENT		= "_contactGroupEvent_";
ZmContactGroupMenu.KEY_GROUP_ADDED		= "_contactGroupAdded_";
ZmContactGroupMenu.MENU_ITEM_ADD_ID	    = "group_add";

ZmContactGroupMenu._HOVER_TIME = 200;

ZmContactGroupMenu.prototype.toString =
function() {
	return "ZmContactGroupMenu";
};

ZmContactGroupMenu.prototype.addSelectionListener = 
function(listener) {
	this._evtMgr.addListener(DwtEvent.SELECTION, listener);
};

ZmContactGroupMenu.prototype.removeSelectionListener = 
function(listener) {
	this._evtMgr.removeListener(DwtEvent.SELECTION, listener);    	
};

ZmContactGroupMenu.prototype.setEnabled =
function(enabled) {
	this._desiredState = enabled;
	if (enabled && !this._contactGroupList) { return; }

	this.parent.setEnabled(enabled);
};

// Dynamically set the list of contact groups that can be added/removed based on the given list of items.
ZmContactGroupMenu.prototype.set =
function(items, contactGroupList, newDisabled) {
	DBG.println(AjxDebug.DBG3, "set contact group menu");
	this._contactGroupList = contactGroupList;
	this._items = items;
	this._dirty = true;
	this._newDisabled = newDisabled;

	this.parent.setEnabled(true);

	// Turn on the hover delay.
	if (this.parent instanceof DwtMenuItem) {
		this.parent.setHoverDelay(ZmContactGroupMenu._HOVER_TIME);
	}
};

ZmContactGroupMenu.prototype._doPopup =
function(x, y, kbGenerated) {
	if (this._dirty) {
		// reset the menu
		this.removeChildren();

		if (this._contactGroupList) {
			var groupNames = [];
			for (var i=0; i<this._contactGroupList.length; i++) {
				var contact = ZmContact.getContactFromCache(this._contactGroupList[i].id);
				if (contact && !ZmContact.isInTrash(contact)) {
					groupNames.push(ZmContact.getAttr(this._contactGroupList[i], "nickname"));
				}
				else {
					this._contactGroupList[i] = {id: false};
				}
			}
			this._render(groupNames);
		}
		this._dirty = false;

		// Remove the hover delay to prevent flicker when mousing around.
		if (this.parent instanceof DwtMenuItem) {
			this.parent.setHoverDelay(0);
		}
	}
	ZmPopupMenu.prototype._doPopup.call(this, x, y, kbGenerated);
};

ZmContactGroupMenu.prototype._render =
function(groupNames, addRemove) {

	for (var i = 0; i < this._contactGroupList.length; i++) {
		this._addNewGroup(this, this._contactGroupList[i], true, null, this._addHash);
	}

	if (this._contactGroupList.length) {
		new DwtMenuItem({parent:this, style:DwtMenuItem.SEPARATOR_STYLE});
	}

	// add static "New Contact Group" menu item
	var miNew = this._menuItems[ZmContactGroupMenu.MENU_ITEM_ADD_ID] = new DwtMenuItem({parent:this, id: this._htmlElId + "|NEWGROUP"});
	miNew.setText(ZmMsg.newGroup);
	miNew.setImage("NewGroup");
	if (this._newDisabled) {
		miNew.setEnabled(false);
	}
	else {
		miNew.setData(ZmContactGroupMenu.KEY_GROUP_EVENT, ZmEvent.E_CREATE);
		miNew.addSelectionListener(this._menuItemSelectionListener.bind(this), 0);
	}
};

ZmContactGroupMenu.groupNameLength = 20;
ZmContactGroupMenu.prototype._addNewGroup =
function(menu, group, add, index, groupHash) {
	var nickName = ZmContact.getAttr(group, "nickname") || group.fileAsStr;
	if (nickName) {
		var mi = new DwtMenuItem({parent:menu, index:index});
		var groupName = AjxStringUtil.clipByLength(nickName, ZmContactGroupMenu.groupNameLength);
		mi.setText(groupName);
		mi.setImage("Group");
		mi.addSelectionListener(this._menuItemSelectionListener.bind(this), 0);
		mi.setData(ZmContactGroupMenu.KEY_GROUP_EVENT, ZmEvent.E_MODIFY);
		mi.setData(ZmContactGroupMenu.KEY_GROUP_ADDED, add);
		mi.setData(Dwt.KEY_OBJECT, group);
	}
};

ZmContactGroupMenu.prototype._menuItemSelectionListener =
function(ev) {
	// Only notify if the node is one of our nodes
	if (ev.item.getData(ZmContactGroupMenu.KEY_GROUP_EVENT)) {
		this._evtMgr.notifyListeners(DwtEvent.SELECTION, ev.item);
	}
};

/**
 * Sets "New Contact Group" to be enabled/disabled
 * @param {Boolean} disabled true to set disabled
 */
ZmContactGroupMenu.prototype.setNewDisabled = 
function(disabled) {
	this._newDisabled = disabled;	
};
}
if (AjxPackage.define("zimbraMail.abook.view.ZmContactSplitView")) {
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
 * This file contains the contact split view class.
 */

/**
 * Creates a contact split view.
 * @class
 * This class represents the contact split view.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @extends	DwtComposite
 */
ZmContactSplitView = function(params) {
	if (arguments.length == 0) { return; }

	params.className = params.className || "ZmContactSplitView";
	params.posStyle = params.posStyle || Dwt.ABSOLUTE_STYLE;
	params.id = Dwt.getNextId('ZmContactSplitView_');
	DwtComposite.call(this, params);

	this._controller = params.controller;
	this.setScrollStyle(Dwt.CLIP);

	this._changeListener = new AjxListener(this, this._contactChangeListener);

	this._initialize(params.controller, params.dropTgt);

	var folderTree = appCtxt.getFolderTree();
	if (folderTree) {
		folderTree.addChangeListener(new AjxListener(this, this._addrbookTreeListener));
	}

	ZmTagsHelper.setupListeners(this);

};

ZmContactSplitView.prototype = new DwtComposite;
ZmContactSplitView.prototype.constructor = ZmContactSplitView;

ZmContactSplitView.prototype.isZmContactSplitView = true
ZmContactSplitView.prototype.toString = function() { return "ZmContactSplitView"; };

// Consts
ZmContactSplitView.ALPHABET_HEIGHT = 35;

ZmContactSplitView.NUM_DL_MEMBERS = 10;	// number of distribution list members to show initially

ZmContactSplitView.LIST_MIN_WIDTH = 100;
ZmContactSplitView.CONTENT_MIN_WIDTH = 200;

ZmContactSplitView.SUBSCRIPTION_POLICY_ACCEPT = "ACCEPT";
ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT = "REJECT";
ZmContactSplitView.SUBSCRIPTION_POLICY_APPROVAL = "APPROVAL";

/**
 * Gets the list view.
 * 
 * @return	{ZmContactSimpleView}	the list view
 */
ZmContactSplitView.prototype.getListView =
function() {
	return this._listPart;
};

/**
 * Gets the controller.
 * 
 * @return	{ZmContactController}	the controller
 */
ZmContactSplitView.prototype.getController =
function() {
	return this._controller;
};

/**
 * Gets the alphabet bar.
 * 
 * @return	{ZmContactAlphabetBar}	the alphabet bar
 */
ZmContactSplitView.prototype.getAlphabetBar =
function() {
	return this._alphabetBar;
};

/**
 * Sets the view size.
 * 
 * @param	{int}	width		the width (in pixels)
 * @param	{int}	height		the height (in pixels)
 */
ZmContactSplitView.prototype.setSize =
function(width, height) {
	DwtComposite.prototype.setSize.call(this, width, height);
	this._sizeChildren(width, height);
};

/**
 * Gets the title.
 * 
 * @return	{String}	the title
 */
ZmContactSplitView.prototype.getTitle =
function() {
	return [ZmMsg.zimbraTitle, this._controller.getApp().getDisplayName()].join(": ");
};

/**
 * Gets the size limit.
 * 
 * @param	{int}	offset		the offset
 * @return	{int}	the size
 */
ZmContactSplitView.prototype.getLimit =
function(offset) {
	return this._listPart.getLimit(offset);
};

/**
 * Sets the contact.
 * 
 * @param	{ZmContact}	contact		the contact
 * @param	{Boolean}	isGal		<code>true</code> if is GAL
 * 
 */
ZmContactSplitView.prototype.setContact =
function(contact, isGal) {
	if (contact.isDistributionList() || !isGal) {
		// Remove and re-add listeners for current contact if exists
		if (this._contact) {
			this._contact.removeChangeListener(this._changeListener);
		}
		contact.addChangeListener(this._changeListener);
	}

	var oldContact = this._contact;
	this._contact = this._item = contact;

	if (this._contact.isLoaded) {
		this._setContact(contact, isGal, oldContact);
	} else {
		var callback = new AjxCallback(this, this._handleResponseLoad, [isGal, oldContact]);
		var errorCallback = new AjxCallback(this, this._handleErrorLoad);
		this._contact.load(callback, errorCallback, null, contact.isGroup());
	}
};

ZmContactSplitView.expandDL =
function(viewId, expand) {
	var view = DwtControl.fromElementId(viewId);
	if (view) {
		view._setContact(view._contact, true, null, expand);
	}
};

ZmContactSplitView.handleDLScroll =
function(ev) {

	var target = DwtUiEvent.getTarget(ev);
	var view = DwtControl.findControl(target);
	if (!view) { return; }
	var div = view._dlScrollDiv;
	if (div.clientHeight == div.scrollHeight) { return; }
	var contactDL = appCtxt.getApp(ZmApp.CONTACTS).getDL(view._dlContact.getEmail());
	var listSize = view.getDLSize();
	if (contactDL && (contactDL.more || (listSize < contactDL.list.length))) {
		var params = {scrollDiv:	div,
					  rowHeight:	view._rowHeight,
					  threshold:	10,
					  limit:		ZmContact.DL_PAGE_SIZE,
					  listSize:		listSize};
		var needed = ZmListView.getRowsNeeded(params);
		DBG.println("dl", "scroll, items needed: " + needed);
		if (needed) {
			DBG.println("dl", "new offset: " + listSize);
			var respCallback = new AjxCallback(null, ZmContactSplitView._handleResponseDLScroll, [view]);
			view._dlContact.getDLMembers(listSize, null, respCallback);
		}
	}
};

ZmContactSplitView._handleResponseDLScroll =
function(view, result) {

	var list = result.list;
	if (!(list && list.length)) { return; }

	var html = [];
	view._listPart._getImageHtml(html, 0, null);
	var subs = {first: false, html: html};
	var row = document.getElementById(view._dlLastRowId);
	var table = row && document.getElementById(view._detailsId);
	if (row) {
		var rowIndex = row.rowIndex + 1;
		for (var i = 0, len = list.length; i < len; i++) {
			view._distributionList.list.push(list[i]);
			subs.value = view._objectManager.findObjects(list[i], false, ZmObjectManager.EMAIL);
			var rowIdText = "";
			var newRow = table.insertRow(rowIndex + i);
			if (i == len - 1) {
				newRow.id = view._dlLastRowId = Dwt.getNextId();
			}
			newRow.valign = "top";
			newRow.innerHTML = AjxTemplate.expand("abook.Contacts#SplitView_dlmember-expanded", subs);
		}
//		view._dlScrollDiv.scrollTop = 0;
	}
	DBG.println("dl", table.rows.length + " rows");
};

ZmContactSplitView.prototype.getDLSize =
function() {
	return this._distributionList && this._distributionList.list.length;

};

/**
 * @private
 */
ZmContactSplitView.prototype._handleResponseLoad =
function(isGal, oldContact, resp, contact) {
	if (contact.id == this._contact.id) {
		this._setContact(this._contact, isGal, oldContact);
	}
};

/**
 * @private
 */
ZmContactSplitView.prototype._handleErrorLoad =
function(ex) {
	this.clear();
	// TODO - maybe display some kind of error?
};

/**
 * Clears the view.
 * 
 */
ZmContactSplitView.prototype.clear =
function() {
	var groupDiv = document.getElementById(this._contactBodyId);
	if (groupDiv) {
		groupDiv.innerHTML = "";
	}

	this._contactView.clear();
	this._clearTags();
};

/**
 * Enables the alphabet bar.
 * 
 * @param	{Boolean}	enable		if <code>true</code>, enable the alphabet bar
 */
ZmContactSplitView.prototype.enableAlphabetBar =
function(enable) {
	if (this._alphabetBar)
		this._alphabetBar.enable(enable);
};

/**
 * shows/hides the alphabet bar.
 *
 * @param	{Boolean}	visible		if <code>true</code>, show the alphabet bar
 */
ZmContactSplitView.prototype.showAlphabetBar =
function(visible) {
	if (this._alphabetBar) {
		this._alphabetBar.setVisible(visible);
	}
};


/**
 * @private
 */
ZmContactSplitView.prototype._initialize =
function(controller, dropTgt) {
	this.getHtmlElement().innerHTML = AjxTemplate.expand("abook.Contacts#SplitView", {id:this._htmlElId});

	// alphabet bar based on *optional* existence in template and msg properties
	var alphaDivId = this._htmlElId + "_alphabetbar";
	var alphaDiv = document.getElementById(alphaDivId);
	if (alphaDiv && ZmMsg.alphabet && ZmMsg.alphabet.length>0) {
		this._alphabetBar = new ZmContactAlphabetBar(this);
		this._alphabetBar.reparentHtmlElement(alphaDivId);
	}

	var splitviewCellId = this._htmlElId + "_splitview";
	this._splitviewCell = document.getElementById(splitviewCellId);

	// create listview based on *required* existence in template
	var listviewCellId = this._htmlElId + "_listview";
	this._listviewCell = document.getElementById(listviewCellId);
	this._listPart = new ZmContactSimpleView({parent:this, controller:controller, dropTgt:dropTgt});
	this._listPart.reparentHtmlElement(listviewCellId);

	var sashCellId = this._htmlElId + "_sash";
	this._sash = new DwtSash(this, DwtSash.HORIZONTAL_STYLE, null, 5, Dwt.ABSOLUTE_STYLE);
	this._sash.registerCallback(this._sashCallback, this);
	this._sash.replaceElement(sashCellId, false, true);

	var contentCellId = this._htmlElId + "_contentCell";
	this._contentCell = document.getElementById(contentCellId);

	// define well-known Id's
	this._iconCellId	= this._htmlElId + "_icon";
	this._titleCellId	= this._htmlElId + "_title";
	this._tagCellId		= this._htmlElId + "_tags_contact";
	this._contactBodyId = this._htmlElId + "_body";
	this._contentId		= this._htmlElId + "_content";
	this._detailsId		= this._htmlElId + "_details";

	// create an empty slate
	this._contactView = new ZmContactView({ parent: this, controller: this._controller });
	this._contactView.reparentHtmlElement(this._contentId);
	this._objectManager = new ZmObjectManager(this._contactView);
	this._contentCell.style.right = "0px";

	this._tabGroup = new DwtTabGroup('ZmContactSplitView');
	this._tabGroup.addMember(this._contactView.getTabGroupMember());
};

ZmContactSplitView.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * @private
 */
ZmContactSplitView.prototype._tabStateChangeListener =
function(ev) {
	this._setContact(this._contact, this._isGalSearch);
};

/**
 * @private
 */
ZmContactSplitView.prototype._sizeChildren =
function(width, height) {

	// Using toWindow instead of getY because getY calls Dwt.getLocation
	// which returns NaN if "top" is not set or is "auto"
	var listPartOffset = Dwt.toWindow(this._listPart.getHtmlElement(), 0, 0);
	var fudge = listPartOffset.y - this.getY();

	this._listPart.setSize(Dwt.DEFAULT, height - fudge);

	fudge = this._contactView.getY() - this.getY();
	this._contactView.setSize(Dwt.DEFAULT, height - fudge);
};

/**
 * @private
 */
ZmContactSplitView.prototype._contactChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_CONTACT ||
		ev.source != this._contact ||
		ev.event == ZmEvent.E_DELETE)
	{
		return;
	}

	this._setContact(ev.source);
};

/**
 * @private
 */
ZmContactSplitView.prototype._addrbookTreeListener =
function(ev, treeView) {
	if (!this._contact) { return; }

	var fields = ev.getDetail("fields");
	if (ev.event == ZmEvent.E_MODIFY && fields && fields[ZmOrganizer.F_COLOR]) {
		var organizers = ev.getDetail("organizers");
		if (!organizers && ev.source) {
			organizers = [ev.source];
		}

		for (var i = 0; i < organizers.length; i++) {
			var organizer = organizers[i];
			var folderId = this._contact.isShared()
				? appCtxt.getById(this._contact.folderId).id
				: this._contact.folderId;

			if (organizer.id == folderId) {
				this._setTags();
			}
		}
	}
};

/**
 * @private
 */
ZmContactSplitView.prototype._setContact =
function(contact, isGal, oldContact, expandDL, isBack) {

	//first gather the dl info and dl members. Those are async requests so calling back here after
	//it is done with isBack set to true.
	if (contact.isDistributionList() && !isBack) {
		var callbackHere = this._setContact.bind(this, contact, isGal, oldContact, expandDL, true);
		contact.gatherExtraDlStuff(callbackHere);
		return;
	}

	var addrBook = contact.getAddressBook();
	var color = addrBook ? addrBook.color : ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.ADDRBOOK];
	var subs = {
		id: this._htmlElId,
		contact: contact,
		addrbook: addrBook,
		contactHdrClass: (ZmOrganizer.COLOR_TEXT[color] + "Bg"),
		isInTrash: (addrBook && addrBook.isInTrash())
	};

	if (contact.isGroup()) {
		this._objectManager.reset();

		if (addrBook) {
			subs.folderIcon = addrBook.getIcon();
			subs.folderName = addrBook.getName();
		}

		if (contact.isDistributionList()) {
			var dlInfo = subs.dlInfo = contact.dlInfo;
		}
		subs.groupMembers = contact.getAllGroupMembers();
		subs.findObjects = this._objectManager.findObjects.bind(this._objectManager);

		this._resetVisibility(true);

		this._contactView.createHtml("abook.Contacts#SplitViewGroup", subs);

		if (contact.isDistributionList()) {
			if (this._subscriptionButton) {
				this._subscriptionButton.dispose();
			}
			this._subscriptionButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_subscriptionButton")});
			this._subscriptionButton.setEnabled(true);
			this._subscriptionMsg = document.getElementById(this._htmlElId + "_subscriptionMsg");
			this._updateSubscriptionButtonAndMsg(contact);
			var subListener = new AjxListener(this, this._subscriptionListener, contact);
			this._subscriptionButton.addSelectionListener(subListener);
		}

		var size = this.getSize();
		this._sizeChildren(size.x, size.y);
	} else {
		subs.view = this;
		subs.isGal = isGal;
		subs.findObjects = this._objectManager.findObjects.bind(this._objectManager);
		subs.attrs = contact.getNormalizedAttrs();
		subs.expandDL = expandDL;

		if (contact.isDL && contact.canExpand) {
			this._dlContact = contact;
			this._dlScrollDiv = this._dlScrollDiv || document.getElementById(this._contentId);
			var respCallback = new AjxCallback(this, this._showDL, [subs]);
			contact.getDLMembers(0, null, respCallback);
			return;
		}
		this._showContact(subs);
	}

	this._setTags();
	Dwt.setLoadedTime("ZmContactItem");
};

ZmContactSplitView.prototype.dispose =
function() {
	ZmTagsHelper.disposeListeners(this);
	DwtComposite.prototype.dispose.apply(this, arguments);
};


ZmContactSplitView.prototype._showContact =
function(subs) {
	this._objectManager.reset();
	this._resetVisibility(false);

	subs.defaultImageUrl = ZmZimbraMail.DEFAULT_CONTACT_ICON;

	this._contactView.createHtml("abook.Contacts#SplitView_content", subs);

	// notify zimlets that a new contact is being shown.
	appCtxt.notifyZimlets("onContactView", [subs.contact, this._htmlElId]);
};

ZmContactSplitView.prototype._subscriptionListener =
function(contact, ev) {
	var subscribe = !contact.dlInfo.isMember;
	this._subscriptionButton.setEnabled(false);
	var respHandler = this._handleSubscriptionResponse.bind(this, contact, subscribe);
	contact.toggleSubscription(respHandler);
};

ZmContactSplitView.prototype._handleSubscriptionResponse =
function(contact, subscribe, result) {
	var status = result._data.SubscribeDistributionListResponse.status;
	var subscribed = status == "subscribed";
	var unsubscribed = status == "unsubscribed";
	var awaitingApproval = status == "awaiting_approval";
	this._subscriptionButton.setEnabled(!awaitingApproval);
	if (!awaitingApproval) {
		contact.dlInfo.isMember = subscribed;
	}
	if (subscribed || unsubscribed) {
		contact.clearDlInfo();
		contact._notify(ZmEvent.E_MODIFY);
	}
	var msg = subscribed ? ZmMsg.dlSubscribed
			: unsubscribed ? ZmMsg.dlUnsubscribed
			: awaitingApproval && subscribe ? ZmMsg.dlSubscriptionRequested
			: awaitingApproval && !subscribe ? ZmMsg.dlUnsubscriptionRequested
			: ""; //should not happen. Keep this as separate case for ease of debug when it does happen somehow.
	var dlg = appCtxt.getMsgDialog();
	var name = contact.getEmail();
	dlg.setMessage(AjxMessageFormat.format(msg, name), DwtMessageDialog.INFO_STYLE);
	dlg.popup();

};

ZmContactSplitView.prototype._updateSubscriptionButtonAndMsg =
function(contact) {
	var dlInfo = contact.dlInfo;
	var policy = dlInfo.isMember ? dlInfo.unsubscriptionPolicy : dlInfo.subscriptionPolicy;
	if (policy == ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT) {
		this._subscriptionButton.setVisible(false);
	}
	else {
		this._subscriptionButton.setVisible(true);
		this._subscriptionButton.setText(dlInfo.isMember ? ZmMsg.dlUnsubscribe: ZmMsg.dlSubscribe);
	}
	var statusMsg = dlInfo.isOwner && dlInfo.isMember ? ZmMsg.youAreOwnerAndMember
			: dlInfo.isOwner ? ZmMsg.youAreOwner
			: dlInfo.isMember ? ZmMsg.youAreMember
			: "";
	if (statusMsg != '') {
		statusMsg = "<li>" + statusMsg + "</li>";
	}
	var actionMsg;
	if (!dlInfo.isMember) {
		actionMsg =	policy == ZmContactSplitView.SUBSCRIPTION_POLICY_APPROVAL ? ZmMsg.dlSubscriptionRequiresApproval
			: policy == ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT ? ZmMsg.dlSubscriptionNotAllowed
			: "";
	}
	else {
		actionMsg =	policy == ZmContactSplitView.SUBSCRIPTION_POLICY_APPROVAL ? ZmMsg.dlUnsubscriptionRequiresApproval
			: policy == ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT ? ZmMsg.dlUnsubscriptionNotAllowed
			: "";

	}
	if (actionMsg != '') {
		actionMsg = "<li>" + actionMsg + "</li>";
	}
	this._subscriptionMsg.innerHTML = statusMsg + actionMsg;

};

// returns an object with common properties used for displaying a contact field
ZmContactSplitView._getListData =
function(data, label, objectType) {
	var itemListData = {
		id: data.id,
		attrs: data.attrs,
		labelId: data.id + '_' + label.replace(/[^\w]/g,""),
		label: label,
		first: true
	};
	if (objectType) {
		itemListData.findObjects = data.findObjects;
		itemListData.objectType = objectType;
	}
	itemListData.isDL = data.contact.isDL;

	return itemListData;
};

ZmContactSplitView._showContactList =
function(data, names, typeFunc, hideType) {

	data.names = names;
	var html = [];
	for (var i = 0; i < names.length; i++) {
		var name = names[i];
		data.name = name;
		data.type = (typeFunc && typeFunc(data, name)) || ZmMsg["AB_FIELD_" + name];
		data.type = hideType ? "" : data.type;
		html.push(ZmContactSplitView._showContactListItem(data));
	}

	return html.join("");
};

ZmContactSplitView._showContactListItem =
function(data) {

	var isEmail = (data.objectType == ZmObjectManager.EMAIL);
	var i = 0;
	var html = [];
	while (true) {
		data.name1 = ++i > 1 || ZmContact.IS_ADDONE[data.name] ? data.name + i : data.name;
		var values = data.attrs[data.name1];
		if (!values) { break; }
		data.name1 = AjxStringUtil.htmlEncode(data.name1);
		data.type = AjxStringUtil.htmlEncode(data.type);
		values = AjxUtil.toArray(values);
		for (var j=0; j<values.length; j++) {
			var value = values[j];
			if (!isEmail) {
				value = AjxStringUtil.htmlEncode(value);
			}
			if (ZmContact.IS_DATE[data.name]) {
				var date = ZmEditContactViewOther.parseDate(value);
				if (date) {
					var includeYear = date.getFullYear() != 0;
					var formatter = includeYear ?
					    AjxDateFormat.getDateInstance(AjxDateFormat.LONG) : new AjxDateFormat(ZmMsg.formatDateLongNoYear);
					value = formatter.format(date);
		        	}
			}
			if (data.findObjects) {
				value = data.findObjects(value, data.objectType);
			}
			if (data.encode) {
				value = data.encode(value);
			}
			data.value = value;

			html.push(AjxTemplate.expand("#SplitView_list_item", data));
		}
		data.first = false;
	}

	return html.join("");
};

ZmContactSplitView.showContactEmails =
function(data) {
	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.emailLabel, ZmObjectManager.EMAIL);
	var typeFunc = function(data, name) { return data.isDL && ZmMsg.distributionList; };
	return ZmContactSplitView._showContactList(itemListData, ZmEditContactView.LISTS.EMAIL.attrs, typeFunc, !data.isDL);
};

ZmContactSplitView.showContactPhones =
function(data) {
	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.phoneLabel, ZmObjectManager.PHONE);
	return ZmContactSplitView._showContactList(itemListData, ZmEditContactView.LISTS.PHONE.attrs);
};

ZmContactSplitView.showContactIMs =
function(data) {

	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.imLabel);
	return ZmContactSplitView._showContactList(itemListData, ZmEditContactView.LISTS.IM.attrs);
};

ZmContactSplitView.showContactAddresses =
function(data) {

	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.addressLabel);
	var types = {"work":ZmMsg.work, "home":ZmMsg.home, "other":ZmMsg.other};
	var prefixes = ZmContact.ADDR_PREFIXES;
	var suffixes = ZmContact.ADDR_SUFFIXES;
	var html = [];
	for (var i = 0; i < prefixes.length; i++) {
		var count = 0;
		var prefix = prefixes[i];
		itemListData.type = types[prefix] || prefix;
		while (true) {
			count++;
			itemListData.address = null;
			for (var j = 0; j < suffixes.length; j++) {
				var suffix = suffixes[j];
				var name = [prefix, suffix, count > 1 ? count : ""].join("");
				var value = data.attrs[name];
				if (!value) { continue; }
				value = AjxStringUtil.htmlEncode(value);
				if (!itemListData.address)  {
					itemListData.address = {};
				}
				itemListData.address[suffix] = value.replace(/\n/g,"<br/>");
			}
			if (!itemListData.address) { break; }
			itemListData.name = [prefix, "Address", count > 1 ? count : ""].join("");
			html.push(AjxTemplate.expand("#SplitView_address_value", itemListData));
			itemListData.first = false;
		}
	}

	return html.join("");
};

ZmContactSplitView.showContactUrls =
function(data) {
	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.urlLabel, ZmObjectManager.URL);
	var typeFunc = function(data, name) { return ZmMsg["AB_FIELD_" + name.replace("URL", "")]; };
	return ZmContactSplitView._showContactList(itemListData, ZmEditContactView.LISTS.URL.attrs, typeFunc);
};

ZmContactSplitView.showContactOther =
function(data) {

	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.otherLabel);
	itemListData.findObjects = data.findObjects;
	var html = [];
	html.push(ZmContactSplitView._showContactList(itemListData, ZmEditContactView.LISTS.OTHER.attrs));

	// find unknown attributes
	var attrs = {};
	for (var a in itemListData.attrs) {
		var aname = ZmContact.getPrefix(a);
		if (aname in ZmContact.IS_IGNORE) { continue; }
		attrs[aname] = true;
	}
	for (var id in ZmEditContactView.ATTRS) {
		delete attrs[ZmEditContactView.ATTRS[id]];
	}
	for (var id in ZmEditContactView.LISTS) {
		var list = ZmEditContactView.LISTS[id];
		if (!list.attrs) { continue; }
		for (var i = 0; i < list.attrs.length; i++) {
			delete attrs[list.attrs[i]];
		}
	}
	var prefixes = ZmContact.ADDR_PREFIXES;
	var suffixes = ZmContact.ADDR_SUFFIXES;
	for (var i = 0; i < prefixes.length; i++) {
		for (var j = 0; j < suffixes.length; j++) {
			delete attrs[prefixes[i] + suffixes[j]];
		}
	}

	// display custom
	for (var a in attrs) {
		if (a === "notesHtml") { continue; }
		itemListData.name = a;
		itemListData.type = AjxStringUtil.capitalizeWords(AjxStringUtil.fromMixed(a));
		html.push(ZmContactSplitView._showContactListItem(itemListData));
	}

	return html.join("");
};

ZmContactSplitView.showContactNotes =
function(data) {

	var itemListData = ZmContactSplitView._getListData(data, ZmMsg.notesLabel);
	itemListData.encode = AjxStringUtil.nl2br;
	itemListData.name = ZmContact.F_notes;
	itemListData.names = [ZmContact.F_notes];
	return ZmContactSplitView._showContactListItem(itemListData);
};

ZmContactSplitView.showContactDLMembers =
function(data) {

	var html = [];
	var itemData = {contact:data.contact};
	if (data.dl) {
		var list = data.dl.list;
		var canExpand = data.contact.canExpand && (list.length > ZmContactSplitView.NUM_DL_MEMBERS || data.dl.more);
		var lv = data.view._listPart;
		var id = lv._expandId = Dwt.getNextId();
		var tdStyle = "", onclick = "";
		var list1 = [];
		var len = Math.min(list.length, ZmContactSplitView.NUM_DL_MEMBERS);
		for (var i = 0; i < len; i++) {
			list1.push(data.findObjects ? data.findObjects(list[i], true, ZmObjectManager.EMAIL) : list[i]);
		}
		if (canExpand) {
			if (!data.expandDL) {
				list1.push(" ... ");
			}
			tdStyle = "style='cursor:pointer;'";
			var viewId = '"' + data.id + '"';
			var doExpand = data.expandDL ? "false" : "true";
			onclick = "onclick='ZmContactSplitView.expandDL(" + viewId + ", " + doExpand + ");'";
		}
		itemData.value = list1.join(", ");
		itemData.expandTdText = [tdStyle, onclick].join(" ");
		if (!data.expandDL) {
			itemData.html = [];
			lv._getImageHtml(itemData.html, 0, canExpand ? "NodeCollapsed" : null, id);
			html.push("<tr valign='top'>");
			html.push(AjxTemplate.expand("abook.Contacts#SplitView_dlmember-collapsed", itemData));
			html.push("</tr>");
		} else {
			itemData.first = true;
			for (var i = 0, len = list.length; i < len; i++) {
				itemData.value = list[i];
				if (data.findObjects) {
					itemData.value = data.findObjects(itemData.value, true, ZmObjectManager.EMAIL);
				}
				itemData.html = [];
				lv._getImageHtml(itemData.html, 0, itemData.first ? "NodeExpanded" : null, id);
				var rowIdText = "";
				if (i == len - 1) {
					var rowId = data.view._dlLastRowId = Dwt.getNextId();
					rowIdText = "id='" + rowId + "'";
				}
				html.push("<tr valign='top' " + rowIdText + ">");
				html.push(AjxTemplate.expand("abook.Contacts#SplitView_dlmember-expanded", itemData));
				html.push("</tr>");
				itemData.first = false;
			}
		}
	}

	return html.join("");
};

/**
 * Displays contact group
 * @param data  {object}
 * @return html {String} html representation of group
 */
ZmContactSplitView.showContactGroup =
function(data) {
	var html = []; 
	if (!AjxUtil.isArray(data.groupMembers)) {
		return "";
	}
	for (var i = 0; i < data.groupMembers.length; i++) {
		var member = data.groupMembers[i];
		var itemListData = {};
		var contact = member.__contact;
		if (contact) {
			itemListData.imageUrl = contact.getImageUrl();
			itemListData.defaultImageUrl = ZmZimbraMail.DEFAULT_CONTACT_ICON;
			itemListData.imgClassName = contact.getIconLarge();
			itemListData.email = data.findObjects(contact.getEmail(), true, ZmObjectManager.EMAIL);
			itemListData.title = data.findObjects(contact.getAttr(ZmContact.F_jobTitle), true, ZmObjectManager.TITLE);
			itemListData.phone = data.findObjects(contact.getPhone(), true, ZmObjectManager.PHONE);
			var isPhonetic = appCtxt.get(ZmSetting.PHONETIC_CONTACT_FIELDS);
			var fullnameHtml = contact.getFullNameForDisplay(isPhonetic);
			if (!isPhonetic) {
				fullnameHtml = AjxStringUtil.htmlEncode(fullnameHtml);
			}
			itemListData.fullName = fullnameHtml;
		}
		else {
			itemListData.imgClassName = "PersonInline_48";
			itemListData.email = data.findObjects(member.value, true, ZmObjectManager.EMAIL);
		}
		html.push(AjxTemplate.expand("abook.Contacts#SplitView_group", itemListData));
	}
	return html.join("");
	
};

ZmContactSplitView.prototype._showDL =
function(subs, result) {

	subs.dl = this._distributionList = result;
	this._showContact(subs);
	this._setTags();
	if (!this._rowHeight) {
		var table = document.getElementById(this._detailsId);
		if (table) {
			this._rowHeight = Dwt.getSize(table.rows[0]).y;
		}
	}

	if (subs.expandDL) {
		Dwt.setHandler(this._dlScrollDiv, DwtEvent.ONSCROLL, ZmContactSplitView.handleDLScroll);
	}
};

/**
 * @private
 */
ZmContactSplitView.prototype._resetVisibility =
function(isGroup) {
};

/**
 * @private
 */
ZmContactSplitView.prototype._setTags =
function() {
	//use the helper to get the tags.
	var tagsHtml = ZmTagsHelper.getTagsHtml(this._item, this);
	this._setTagsHtml(tagsHtml);
};

/**
 * @private
 */
ZmContactSplitView.prototype._clearTags =
function() {
	this._setTagsHtml("");
};

/**
 * note this is called from ZmTagsHelper
 * @param html
 */
ZmContactSplitView.prototype._setTagsHtml =
function(html) {
	var tagCell = document.getElementById(this._tagCellId);
	if (!tagCell) { return; }
	tagCell.innerHTML = html;
};


ZmContactSplitView.prototype._sashCallback = function(delta) {
	var sashWidth = this._sash.getSize().x;
	var totalWidth = Dwt.getSize(this._splitviewCell).x;

	var origListWidth = this._listPart.getSize().x;
	var newListWidth = origListWidth + delta;
	var newContentPos = newListWidth + sashWidth;
	var newContentWidth = totalWidth - newContentPos;

	if (delta < 0 && newListWidth <= ZmContactSplitView.LIST_MIN_WIDTH) {
		newListWidth = ZmContactSplitView.LIST_MIN_WIDTH;
		newContentPos = newListWidth + sashWidth;
		newContentWidth = totalWidth - newContentPos;
	} else if (delta > 0 && newContentWidth <= ZmContactSplitView.CONTENT_MIN_WIDTH) {
		newContentWidth = ZmContactSplitView.CONTENT_MIN_WIDTH;
		newContentPos = totalWidth - newContentWidth;
		newListWidth = newContentPos - sashWidth;
	}
		
	delta = newListWidth - origListWidth;
	
	this._listPart.setSize(newListWidth, Dwt.DEFAULT);
	Dwt.setBounds(this._contentCell, newContentPos, Dwt.DEFAULT, newContentWidth, Dwt.DEFAULT);

	return delta;
};

/**
 * View for displaying the contact information. Provides events for enabling text selection.
 * @param {Object}  params      hash of params:
 *                  parent      parent control
 *                  controller  owning controller
 */
ZmContactView = function(params) {
	DwtComposite.call(this, {parent:params.parent});
	this._controller = params.controller;
	this._tabGroup = new DwtTabGroup('ZmContactView');
	this.addListener(DwtEvent.ONSELECTSTART, this._selectStartListener.bind(this));
	this._setMouseEventHdlrs();
};
ZmContactView.prototype = new DwtControl;
ZmContactView.prototype.constructor = ZmContactView;
ZmContactView.prototype.isZmContactView = true;
ZmContactView.prototype.role = 'document';
ZmContactView.prototype.toString = function() { return "ZmContactView"; };

ZmContactView.prototype.getTabGroupMember = 
function() {
	return this._tabGroup;
};

ZmContactView.prototype._selectStartListener =
function(ev) {
	// reset mouse event to propagate event to browser (allows text selection)
	ev._stopPropagation = false;
	ev._returnValue = true;
};

ZmContactView.prototype.clear = function() {
	this.getTabGroupMember().removeAllMembers();
	Dwt.removeChildren(this.getHtmlElement());
};

ZmContactView.prototype.createHtml = function(templateid, subs) {
	this._createHtmlFromTemplate(templateid, subs);

	// add the header row and all objects to the tab order
	var rows = Dwt.byClassName('rowValue', this.getHtmlElement());

	this.getTabGroupMember().removeAllMembers();
	this.getTabGroupMember().addMember(rows[0]);

	AjxUtil.foreach(rows, this._makeRowFocusable.bind(this));
};

ZmContactView.prototype._makeRowFocusable = function(row) {
	this._makeFocusable(row);

	var objects = Dwt.byClassName('Object', row);

	for (var i = 0; i < objects.length; i++) {
		this._makeFocusable(objects[i]);
		this.getTabGroupMember().addMember(objects[i]);

		objects[i].setAttribute('aria-describedby', row.getAttribute('aria-labelledby'));
	}
};

/**
 * Creates a simple view.
 * @class
 * This class represents a simple contact list view (contains only full name).
 * 
 * @param	{Hash}	params		a hash of parameters
 * @extends		ZmContactsBaseView
 */
ZmContactSimpleView = function(params) {

	if (arguments.length == 0) { return; }

	this._view = params.view = params.controller.getCurrentViewId();
	params.className = "ZmContactSimpleView";
	ZmContactsBaseView.call(this, params);

	this._normalClass = DwtListView.ROW_CLASS + " SimpleContact";
	this._selectedClass = [DwtListView.ROW_CLASS, DwtCssStyle.SELECTED].join("-");
};

ZmContactSimpleView.prototype = new ZmContactsBaseView;
ZmContactSimpleView.prototype.constructor = ZmContactSimpleView;

ZmContactSimpleView.prototype.isZmContactSimpleView = true;
ZmContactSimpleView.prototype.toString = function() { return "ZmContactSimpleView"; };

/**
 * Sets the list.
 * 
 * @param	{ZmContactList}		list		the list
 * @param	{String}	defaultColumnSort		the sort field
 * @param	{String}	folderId		the folder id
 * @param	{Boolean}	isSearchResults	is this a search tab?
 */
ZmContactSimpleView.prototype.set =
function(list, defaultColumnSort, folderId, isSearchResults) {
	var fid = folderId || this._controller.getFolderId();
	ZmContactsBaseView.prototype.set.call(this, list, defaultColumnSort, fid);

	if (!(this._list instanceof AjxVector) || this._list.size() == 0) {
		this.parent.clear();
	}

	this.parent.showAlphabetBar(!isSearchResults);
	this.parent.enableAlphabetBar(fid != ZmOrganizer.ID_DLS);
};

/**
 * Sets the selection.
 * 
 * @param	{Object}	item		the item
 * @param	{Boolean}	skipNotify	<code>true</code> to skip notification
 */
ZmContactSimpleView.prototype.setSelection =
function(item, skipNotify) {
	// clear the right, content pane if no item to select
	if (!item) {
		this.parent.clear();
	}

	ZmContactsBaseView.prototype.setSelection.call(this, item, skipNotify);
};

/**
 * @private
 */
ZmContactSimpleView.prototype._setNoResultsHtml =
function() {

	var	div = document.createElement("div");

	var isSearch = this._controller._contactSearchResults;
	if (isSearch){
		isSearch = !(this._controller._currentSearch && this._controller._currentSearch.folderId);
	}
	//bug:28365  Show custom "No Results" for Search.
	if ((isSearch || this._folderId == ZmFolder.ID_TRASH) && AjxTemplate.getTemplate("abook.Contacts#SimpleView-NoResults-Search")) {
		div.innerHTML = AjxTemplate.expand("abook.Contacts#SimpleView-NoResults-Search");
	} else {
		// Shows "No Results", unless the skin has overridden to show links to plaxo.
		div.innerHTML = AjxTemplate.expand("abook.Contacts#SimpleView-NoResults");
	}
	this._addRow(div);

	this.parent.clear();
};

/**
 * @private
 */
ZmContactSimpleView.prototype._changeListener =
function(ev) {
	ZmContactsBaseView.prototype._changeListener.call(this, ev);

	// bug fix #14874 - if moved to trash, show strike-thru
	var folderId = this._controller.getFolderId();
	if (!folderId && ev.event == ZmEvent.E_MOVE) {
		if(!ev._details.items) {
			ev._details.items = ev.items;
		}
		var contact = ev._details.items[0];
		var folder = appCtxt.getById(contact.folderId);
		var row = this._getElement(contact, ZmItem.F_ITEM_ROW);
		if (row) {
			row.className = (folder && folder.isInTrash()) ? "Trash" : "";
		}
	}
};

/**
 * @private
 */
ZmContactSimpleView.prototype._modifyContact =
function(ev) {
	ZmContactsBaseView.prototype._modifyContact.call(this, ev);

	if (ev.getDetail("fileAsChanged")) {
		var selected = this.getSelection()[0];
		this._layout();
		this.setSelection(selected, true);
	}
};

/**
 * @private
 */
ZmContactSimpleView.prototype._layout =
function() {
	// explicitly remove each child (setting innerHTML causes mem leak)
	while (this._parentEl.hasChildNodes()) {
		cDiv = this._parentEl.removeChild(this._parentEl.firstChild);
		this._data[cDiv.id] = null;
	}

	var now = new Date();
	var size = this._list.size();
	for (var i = 0; i < size; i++) {
		var item = this._list.get(i);
		var div = item ? this._createItemHtml(item, {now:now}) : null;
		if (div) {
			this._addRow(div);
		}
	}
};

ZmContactSimpleView.prototype.useListElement =
function() {
	return true;
}

/**
 * A contact is normally displayed in a list view with no headers, and shows
 * just an icon and name.
 *
 * @param {ZmContact}	contact	the contact to display
 * @param {Hash}	params	a hash of optional parameters
 * 
 * @private
 */
ZmContactSimpleView.prototype._createItemHtml =
function(contact, params, asHtml, count) {

	params = params || {};

	var htmlArr = [];
	var idx = 0;
	if (!params.isDragProxy) {
		params.divClass = this._normalClass;
	}
	if (asHtml) {
		idx = this._getDivHtml(contact, params, htmlArr, idx, count);
	} else {
		var div = this._getDiv(contact, params);
	}
	var folder = this._folderId && appCtxt.getById(this._folderId);
	if (div) {
		if (params.isDragProxy) {
			div.style.width = "175px";
			div.style.padding = "4px";
		}
	}

	idx = this._getRow(htmlArr, idx, contact, params);

	// checkbox selection
	if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
		idx = this._getImageHtml(htmlArr, idx, "CheckboxUnchecked", this._getFieldId(contact, ZmItem.F_SELECTION));
	}

	// icon
	htmlArr[idx++] = AjxImg.getImageHtml(contact.getIcon(folder), null, "id=" + this._getFieldId(contact, "type"),null, null, ["ZmContactIcon"]);

	// file as
	htmlArr[idx++] = "<div id='" + this._getFieldId(contact, "fileas") + "'>";
	htmlArr[idx++] = AjxStringUtil.htmlEncode(contact.getFileAs() || contact.getFileAsNoName());
	htmlArr[idx++] = "</div>";
	htmlArr[idx++] = "<div class='ZmListFlagsWrapper'>";

	if (!params.isDragProxy) {
		// if read only, show lock icon in place of the tag column since we dont
		// currently support tags for "read-only" contacts (i.e. shares)
		var isLocked = folder ? folder.link && folder.isReadOnly() : contact.isLocked();
		if (isLocked) {
			htmlArr[idx++] = AjxImg.getImageHtml("ReadOnly");
		} else if (!contact.isReadOnly() && appCtxt.get(ZmSetting.TAGGING_ENABLED)) {
			// otherwise, show tag if there is one
			idx = this._getImageHtml(htmlArr, idx, contact.getTagImageInfo(), this._getFieldId(contact, ZmItem.F_TAG), ["Tag"]);
		}
	}

	htmlArr[idx++] = "</div></div></li>";

	if (div) {
		div.innerHTML = htmlArr.join("");
		return div;
	} else {
		return htmlArr.join("");
	}
};

/**
 * @private
 */
ZmContactSimpleView.prototype._getToolTip =
function(params) {

	var ttParams = {
		contact:		params.item,
		ev:				params.ev
	};
	var ttCallback = new AjxCallback(this,
		function(callback) {
			appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, ttParams, callback);
		});
	return {callback:ttCallback};
};

/**
 * @private
 */
ZmContactSimpleView.prototype._getDateToolTip =
function(item, div) {
	div._dateStr = div._dateStr || this._getDateToolTipText(item.modified, ["<b>", ZmMsg.lastModified, "</b><br>"].join(""));
	return div._dateStr;
};
}
if (AjxPackage.define("zimbraMail.abook.view.ZmNewAddrBookDialog")) {
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
 * @overview
 * This file contains the address book dialog class.
 */

/**
 * Creates an address book dialog.
 * @class
 * This class represents the address book dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * @param	{String}	title		the dialog title
 * @param	{constant}	type		the type
 * 
 * @extends		ZmNewOrganizerDialog
 */
ZmNewAddrBookDialog = function(parent, className) {
	var title = ZmMsg.createNewAddrBook;
	var type = ZmOrganizer.ADDRBOOK;
	ZmNewOrganizerDialog.call(this, parent, className, title, type);
}

ZmNewAddrBookDialog.prototype = new ZmNewOrganizerDialog;
ZmNewAddrBookDialog.prototype.constructor = ZmNewAddrBookDialog;


// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmNewAddrBookDialog.prototype.toString =
function() {
	return "ZmNewAddrBookDialog";
};


// Protected methods

/**
 * overload since we always want to init the color to grey.
 * 
 * @private
 */
ZmNewAddrBookDialog.prototype._initColorSelect =
function() {
	var option = this._colorSelect.getOptionWithValue(ZmOrganizer.DEFAULT_COLOR[this._organizerType]);
	this._colorSelect.setSelectedOption(option);
};

/**
 * overload so we dont show this.
 * 
 * @private
 */
ZmNewAddrBookDialog.prototype._createRemoteContentHtml =
function(html, idx) {
	return idx;
};

/**
 * @private
 */
ZmNewAddrBookDialog.prototype._setupFolderControl =
function(){
    ZmNewOrganizerDialog.prototype._setupFolderControl.call(this);
    if (this._omit) {
		this._omit[ZmFolder.ID_TRASH] = true;
		this._omit[ZmFolder.ID_DLS] = true;
	}
	var folderTree = appCtxt.getFolderTree();
	if (!folderTree) { return; }
	var folders = folderTree.getByType(this._organizerType);
	for (var i = 0; i < folders.length; i++) {
		var folder = folders[i];
		if (folder.isReadOnly()) {
			this._omit[folder.id] = true;
		}
	}
};
}
if (AjxPackage.define("zimbraMail.abook.view.ZmNewContactGroupDialog")) {
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
 * @overview
 */

/**
 * Creates a new contact group dialog.
 * @class
 * This class represents a new contact group dialog.
 *
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		ZmDialog
 */
ZmNewContactGroupDialog = function(parent, className) {
	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.createNewContactGroup, id:"CreateContactGroupDialog"});

	this._setNameField(this._htmlElId+"_name");
	DBG.timePt("set content");
};

ZmNewContactGroupDialog.prototype = new ZmDialog;
ZmNewContactGroupDialog.prototype.constructor = ZmNewContactGroupDialog;

ZmNewContactGroupDialog.prototype.toString =
function() {
	return "ZmNewContactGroupDialog";
};

/**
 * Pops-up the dialog.
 *
 * @param	{ZmOrganizer}	org		the organizer
 * @param	{ZmAccount}		account	the account
 */
ZmNewContactGroupDialog.prototype.popup =
function(org, account) {
	if (this._accountSelect) {
		var acct = account || appCtxt.getActiveAccount();
		this._accountSelect.setSelectedValue(acct.id);
	}

	ZmDialog.prototype.popup.call(this);
};

ZmNewContactGroupDialog.prototype.cleanup =
function(bPoppedUp) {
	DwtDialog.prototype.cleanup.call(this, bPoppedUp);
};


ZmNewContactGroupDialog.prototype._contentHtml =
function() {
	return AjxTemplate.expand("share.Dialogs#ZmContactGroupDialog", {id:this._htmlElId});
};

ZmNewContactGroupDialog.prototype._okButtonListener =
function(ev) {
	var results = this._getContactGroupData();
	if (results) {
		DwtDialog.prototype._buttonListener.call(this, ev, results);
	}
};

ZmNewContactGroupDialog.prototype._getContactGroupData =
function() {
	// check name for presence
	var name = AjxStringUtil.trim(this._nameField.value);
	if (name == "") {
		return this._showError(ZmMsg.errorGroupName);
	}

    var data = {name:name};
    return data;
};

ZmNewContactGroupDialog.prototype._enterListener =
function(ev) {
	var results = this._getContactGroupData();
	if (results) {
		this._runEnterCallback(results);
	}
};

ZmNewContactGroupDialog.prototype._getTabGroupMembers =
function() {
	return [this._nameField];
};
}
if (AjxPackage.define("zimbraMail.abook.view.ZmContactQuickAddDialog")) {
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

ZmContactQuickAddDialog = function() {
	ZmDialog.call(this, {parent:appCtxt.getShell(), className:"ZmContactQuickAddDialog", title:ZmMsg.quickAddContact,
						  standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});

	// set content
	this.setContent(this._contentHtml());
	this._initialize();
	
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._saveListener));
};

ZmContactQuickAddDialog.prototype = new ZmDialog;
ZmContactQuickAddDialog.prototype.constructor = ZmContactQuickAddDialog;

ZmContactQuickAddDialog.prototype._contentHtml = 
function() {   
	var html = "<div style='width: 350px' id='CONTACT_QUICKADD_FORM'></div>";	
	return html;			
};

ZmContactQuickAddDialog.prototype._initialize = 
function() {
	var params = {};
	params.parent = this;
	params.template = "abook.Contacts#QuickAddPrompt";
	params.id = "ZmContactQuickAddDialog";
	params.form = {
		items: [
			{ id: "FIRST_NAME", type: "DwtInputField", label: "First Name", value: "", cols: 35},
			{ id: "LAST_NAME", type: "DwtInputField", label: "Last Name", value: "", cols: 35},
			{ id: "EMAIL", type: "DwtInputField", label: "Email", value: "", cols: 35},
			{ id: "ADDR_BOOK", type: "DwtSelect", items: []}
		]
	};
	this._quickAddForm = new DwtForm(params);
	var quickAddForm = document.getElementById("CONTACT_QUICKADD_FORM");
	this._quickAddForm.appendElement(quickAddForm);
	
};

/**
 * Popup quick add dialog
 */
ZmContactQuickAddDialog.prototype.popup = 
function(saveCallback) {
	this._saveCallback = saveCallback;
	this._updateAddressBooks();
	ZmDialog.prototype.popup.call(this);
	this._quickAddForm.getControl("FIRST_NAME").focus();
};


ZmContactQuickAddDialog.prototype.setFields = 
function(email) {
	if (this._quickAddForm) {
		var emailField = this._quickAddForm.getControl("EMAIL");
		emailField.setValue(email);
		
		var fnameField = this._quickAddForm.getControl("FIRST_NAME");
		fnameField.setValue("");
		
		var lnameField = this._quickAddForm.getControl("LAST_NAME");
		lnameField.setValue("");
	}
};

ZmContactQuickAddDialog.prototype._saveListener =
function() {
	var firstName = this._quickAddForm.getControl("FIRST_NAME");
	var lastName = this._quickAddForm.getControl("LAST_NAME");
	var email = this._quickAddForm.getControl("EMAIL");
	var addrBook = this._quickAddForm.getControl("ADDR_BOOK");
	
	var contact = new ZmContact(null, null, ZmItem.CONTACT);
	var attr = {};
	attr[ZmContact.F_firstName] = firstName.getValue();
	attr[ZmContact.F_lastName] = lastName.getValue();
	attr[ZmContact.F_email] = email.getValue();
	attr[ZmContact.F_folderId] = addrBook.getValue();
	var batchCommand = new ZmBatchCommand(false, null, true);
	batchCommand.add(new AjxCallback(contact, contact.create, [attr]));
	if (this._saveCallback) {
		batchCommand.run(this._saveCallback, [contact]);
	}
	this.popdown();
};

ZmContactQuickAddDialog.prototype._getAddressBooks = 
function() {
	var folderTree = appCtxt.getFolderTree();
	var addrBooks = folderTree.getByType(ZmOrganizer.ADDRBOOK);
	for (var i=0; i<addrBooks.length; i++) {
		if (addrBooks[i].isReadOnly()) {
			addrBooks.splice(i,1); //if addrBook is read only do not add it to list
		}
	}
	return addrBooks;
};

ZmContactQuickAddDialog.prototype._updateAddressBooks = 
function() {
	var select = this._quickAddForm.getControl("ADDR_BOOK");
	select.clearOptions();
	
	var addrBooks = this._getAddressBooks();
	for (var i=0; i<addrBooks.length; i++) {
		if (addrBooks[i].id == ZmFolder.ID_DLS) {
			continue;
		}
		var selectOption = new DwtSelectOption(addrBooks[i].nId, false, addrBooks[i].name);
		select.addOption(selectOption);	
	}
};

ZmContactQuickAddDialog.prototype._getTabGroupMembers =
function() {
	var firstName = this._quickAddForm.getControl("FIRST_NAME");
	var lastName = this._quickAddForm.getControl("LAST_NAME");
	var email = this._quickAddForm.getControl("EMAIL");
	var addrBook = this._quickAddForm.getControl("ADDR_BOOK");
	return [firstName, lastName, email, addrBook];
};
}

if (AjxPackage.define("zimbraMail.abook.controller.ZmContactListController")) {
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
 * This file contains the contact list controller class.
 */

/**
 * Creates an empty contact list controller.
 * @class
 * This class manages list views of contacts. So far there are two different list
 * views, one that shows the contacts in a traditional list format, and the other
 * which shows them as business cards. Since there are two views, we need to keep
 * track of which is the current view.
 *
 * @author Roland Schemers
 * @author Conrad Damon
 * 
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						app							the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends	ZmListController
 */
ZmContactListController = function(container, contactsApp, type, sessionId, searchResultsController) {

	if (arguments.length == 0) { return; }
	ZmListController.apply(this, arguments);

	this._viewFactory = {};
	this._viewFactory[ZmId.VIEW_CONTACT_SIMPLE] = ZmContactSplitView;

	if (this.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
	}

	this._listChangeListener = this._handleListChange.bind(this);

	this._listeners[ZmOperation.EDIT]			= this._editListener.bind(this);
	this._listeners[ZmOperation.PRINT]			= null; // override base class to do nothing
	this._listeners[ZmOperation.PRINT_CONTACT]	= this._printListener.bind(this);
	this._listeners[ZmOperation.PRINT_ADDRBOOK]	= this._printAddrBookListener.bind(this);
	this._listeners[ZmOperation.NEW_GROUP]		= this._groupListener.bind(this);

	this._parentView = {};
};

ZmContactListController.prototype = new ZmListController;
ZmContactListController.prototype.constructor = ZmContactListController;

ZmContactListController.prototype.isZmContactListController = true;
ZmContactListController.prototype.toString = function() { return "ZmContactListController"; };

ZmContactListController.ICON = {};
ZmContactListController.ICON[ZmId.VIEW_CONTACT_SIMPLE]		= "ListView";

ZmContactListController.MSG_KEY = {};
ZmContactListController.MSG_KEY[ZmId.VIEW_CONTACT_SIMPLE]	= "contactList";

ZmContactListController.SEARCH_TYPE_CANONICAL	= 1 << 0;
ZmContactListController.SEARCH_TYPE_GAL			= 1 << 1;
ZmContactListController.SEARCH_TYPE_NEW			= 1 << 2;
ZmContactListController.SEARCH_TYPE_ANYWHERE	= 1 << 3;

ZmContactListController.VIEWS = [ZmId.VIEW_CONTACT_SIMPLE];

// Public methods

/**
 * Shows the search results.
 * 
 * @param	{Object}	searchResult		the search results
 * @param	{Boolean}	isGalSearch		<code>true</code> if results from GAL search
 * @param	{String}	folderId		the folder id
 */
ZmContactListController.prototype.show =
function(searchResult, isGalSearch, folderId) {

	this._searchType = isGalSearch
		? ZmContactListController.SEARCH_TYPE_GAL
		: ZmContactListController.SEARCH_TYPE_CANONICAL;

	this._folderId = folderId;
	var selectedContacts;
	
	if (searchResult.isZmContactList) {
		this.setList(searchResult);			// set as canonical list of contacts
		this._list._isShared = false;		// this list is not a search of shared items
		selectedContacts = this._listView[this._currentViewId] && this._listView[this._currentViewId].getSelection();
		this._contactSearchResults = false;
    }
	else if (searchResult.isZmSearchResult) {
		this._searchType |= ZmContactListController.SEARCH_TYPE_NEW;
		this.setList(searchResult.getResults(ZmItem.CONTACT));

		// HACK - find out if user did a "is:anywhere" search (for printing)
		if (searchResult.search && searchResult.search.isAnywhere()) {
			this._searchType |= ZmContactListController.SEARCH_TYPE_ANYWHERE;
		}

		if (searchResult.search && searchResult.search.userText && this.getCurrentView()) {
			this.getCurrentView().getAlphabetBar().reset();
		}

		if (isGalSearch) {
			this._list = this._list || new ZmContactList(searchResult.search, true);
			this._list._isShared = false;
			this._list.isGalPagingSupported = AjxUtil.isSpecified(searchResult.getAttribute("offset"));
		} else {
			// find out if we just searched for a shared address book
			var addrbook = folderId ? appCtxt.getById(folderId) : null;
			this._list._isShared = addrbook ? addrbook.link : false;
		}

		this._list.setHasMore(searchResult.getAttribute("more"));

		selectedContacts = this._listView[this._currentViewId] && this._listView[this._currentViewId].getSelection();
		ZmListController.prototype.show.apply(this, [searchResult, this._currentViewId]);
		this._contactSearchResults = true;
	}

	// reset offset if list view has been created
	var view = this._currentViewId;
	if (this._listView[view]) {
		this._listView[view].offset = 0;
	}
	this.switchView(view, true);

	if (selectedContacts && selectedContacts.length && this._listView[view]) {
		this._listView[view].setSelection(selectedContacts[0]);
	}
};



/**
 * Change how contacts are displayed. There are two views: the "simple" view
 * shows a list of contacts on the left and the selected contact on the right;
 * the "cards" view shows contacts as business cards.
 * 
 * @param {constant}	view			the view to show
 * @param {Boolean}	force			if <code>true</code>, render view even if it's the current view
 * @param {Boolean}	initialized		if <code>true</code>, app has been initialized
 * @param {Boolean}	stageView		if <code>true</code>, stage the view but don't push it
 */
ZmContactListController.prototype.switchView =
function(view, force, initialized, stageView) {
	if (view && ((view != this._currentViewId) || force)) {
		this._currentViewId = view;
		DBG.timePt("setting up view", true);
		this._setup(view);
		DBG.timePt("done setting up view");

		var elements = this.getViewElements(view, this._parentView[view]);

		// call initialize before _setView since we havent set the new view yet
		if (!initialized) {
			this._initializeAlphabetBar(view);
		}

		this._setView({ view:		view,
						viewType:	this._currentViewType,
						noPush:		this.isSearchResults,
						elements:	elements,
						isAppView:	true,
						stageView:	stageView});
		if (this.isSearchResults) {
			// if we are switching views, make sure app view mgr is up to date on search view's components
			appCtxt.getAppViewMgr().setViewComponents(this.searchResultsController.getCurrentViewId(), elements, true);
		}
		this._resetNavToolBarButtons();

		// HACK: reset search toolbar icon (its a hack we're willing to live with)
		if (this.isGalSearch() && !this._list.isGalPagingSupported) {
			appCtxt.getSearchController().setDefaultSearchType(ZmId.SEARCH_GAL);
			if (this._list.hasMore()) {
				var d = appCtxt.getMsgDialog();
				d.setMessage(ZmMsg.errorSearchNotExpanded);
				d.popup();
			}
		}

		this._setTabGroup(this._tabGroups[view]);

		if (!initialized) {
			var list = this._listView[view].getList();
			if (list) {
				this._listView[view].setSelection(list.get(0));
			}
		}
	}
};

/**
 * Gets the folder id.
 * 
 * @return	{String}	the folder id
 */
ZmContactListController.prototype.getFolderId =
function() {
	return this._folderId;
};

/**
 * Checks if the search is a GAL search.
 * 
 * @return	{Boolean}	<code>true</code> if GAL search
 */
ZmContactListController.prototype.isGalSearch =
function() {
	return ((this._searchType & ZmContactListController.SEARCH_TYPE_GAL) != 0);
};

/**
 * Returns the split view.
 * 
 * @return	{ZmContactSplitView}	the split view
 */
ZmContactListController.prototype.getCurrentView =
function() {
	return this._parentView[this._currentViewId];
};
ZmContactListController.prototype.getParentView = ZmContactListController.prototype.getCurrentView;

/**
 * Search the alphabet.
 * 
 * @param	{String}	letter		the letter
 * @param	{String}	endLetter	the end letter
 */
ZmContactListController.prototype.searchAlphabet =
function(letter, endLetter) {
	var folderId = this._folderId || ZmFolder.ID_CONTACTS;
	var folder = appCtxt.getById(folderId);
	var query = folder ? folder.createQuery() : null;

	if (query) {
		var params = {
			query: query,
			types: [ZmItem.CONTACT],
			offset: 0,
			limit: (this._listView[this._currentViewId].getLimit()),
			lastId: 0,
			lastSortVal: letter,
			endSortVal: endLetter
		};
		appCtxt.getSearchController().search(params);
	}
};

/**
 * @private
 */
ZmContactListController.prototype._getMoreSearchParams =
function(params) {
	params.endSortVal = this._activeSearch && this._activeSearch.search && this._activeSearch.search.endSortVal; 
};

ZmContactListController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_CONTACTS;
};

ZmContactListController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG3, "ZmContactListController.handleKeyAction");
    var isExternalAccount = appCtxt.isExternalAccount();
	var isWebClientOffline = appCtxt.isWebClientOffline();
	switch (actionCode) {

		case ZmKeyMap.EDIT:
            if (isExternalAccount || isWebClientOffline) { break; }
			this._editListener();
			break;

		case ZmKeyMap.PRINT:
			if (appCtxt.get(ZmSetting.PRINT_ENABLED) && !isWebClientOffline) {
				this._printListener();
			}
			break;

		case ZmKeyMap.PRINT_ALL:
			if (appCtxt.get(ZmSetting.PRINT_ENABLED) && !isWebClientOffline) {
				this._printAddrBookListener();
			}
			break;

		case ZmKeyMap.NEW_MESSAGE:
			if (isExternalAccount) { break; }
			this._composeListener();
			break;

		default:
			return ZmListController.prototype.handleKeyAction.call(this, actionCode);
	}
	return true;
};

/**
 * @private
 */
ZmContactListController.prototype.mapSupported =
function(map) {
	return (map == "list");
};


// Private and protected methods


/**
 * @private
 */
ZmContactListController.prototype._getToolBarOps =
function() {
    var toolbarOps =  [];
    toolbarOps.push(ZmOperation.EDIT,
            ZmOperation.SEP,
            ZmOperation.DELETE, ZmOperation.SEP,
			ZmOperation.MOVE_MENU, ZmOperation.TAG_MENU, ZmOperation.SEP,
			ZmOperation.PRINT);
    return toolbarOps;
};

/**
 * @private
 */
ZmContactListController.prototype._getSecondaryToolBarOps =
function() {
    if (appCtxt.isExternalAccount()) { return []; }
	var list = [ZmOperation.SEARCH_MENU];

	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		list.push(ZmOperation.NEW_MESSAGE);
	}

	list.push(ZmOperation.SEP, ZmOperation.CONTACTGROUP_MENU);
//    list.push(ZmOperation.QUICK_COMMANDS);

	return list;
};

/**
 * @private
 */
ZmContactListController.prototype._getActionMenuOps =
function() {
	var list = this._participantOps();
	list.push(ZmOperation.SEP,
				ZmOperation.CONTACTGROUP_MENU,
				ZmOperation.TAG_MENU,
				ZmOperation.DELETE,
				ZmOperation.MOVE,
				ZmOperation.PRINT_CONTACT);
//    list.push(ZmOperation.QUICK_COMMANDS);

	return list;
};

ZmContactListController.getDefaultViewType =
function() {
	return ZmId.VIEW_CONTACT_SIMPLE;
};
ZmContactListController.prototype.getDefaultViewType = ZmContactListController.getDefaultViewType;

/**
 * @private
 */
ZmContactListController.prototype._createNewView =
function(view) {
	var params = {parent:this._container, posStyle:Dwt.ABSOLUTE_STYLE,
				  controller:this, dropTgt:this._dropTgt};
	var viewType = this.getCurrentViewType();
	this._parentView[view] = new this._viewFactory[viewType](params);
	var listView = this._parentView[view].getListView();
	if (this._dragSrc) {
		listView.setDragSource(this._dragSrc);
	}

	return listView;
};

/**
 * @private
 */
ZmContactListController.prototype._getTagMenuMsg =
function(num) {
	return AjxMessageFormat.format(ZmMsg.AB_TAG_CONTACTS, num);
};

/**
 * @private
 */
ZmContactListController.prototype._getMoveDialogTitle =
function(num) {
	return AjxMessageFormat.format(ZmMsg.AB_MOVE_CONTACTS, num);
};

/**
 * @private
 */
ZmContactListController.prototype._getMoveParams =
function(dlg) {
	var params = ZmListController.prototype._getMoveParams.apply(this, arguments);
    params.hideNewButton = !appCtxt.get(ZmSetting.NEW_ADDR_BOOK_ENABLED);
    var omit = {};
	var folderTree = appCtxt.getFolderTree();
	if (!folderTree) { return params; }
	var folders = folderTree.getByType(ZmOrganizer.ADDRBOOK);
	for (var i = 0; i < folders.length; i++) {
		var folder = folders[i];
		if (folder.link && folder.isReadOnly()) {
			omit[folder.id] = true;
		}
	}
	params.omit = omit;
	params.description = ZmMsg.targetAddressBook;

	return params;
};

/**
 * @private
 */
ZmContactListController.prototype._getSearchFolderId = 
function() {
	return this._folderId;
};

/**
 * @private
 */
ZmContactListController.prototype._initializeToolBar =
function(view) {
	if (!this._toolbar[view]) {
		ZmListController.prototype._initializeToolBar.call(this, view);
		var tb = this._toolbar[view];
//		this._setupViewMenu(view, true);
		this._setupPrintMenu(view);
		tb.addFiller();
		this._initializeNavToolBar(view);
		this._setupContactGroupMenu(tb);
		appCtxt.notifyZimlets("initializeToolbar", [this._app, this._toolbar[view], this, view], {waitUntilLoaded:true});
	} else {
//		this._setupViewMenu(view, false);
		this._setupDeleteButton(this._toolbar[view]);
	}
};

ZmContactListController.prototype._initializeTabGroup =
function(view) {
	if (this._tabGroups[view]) { return; }

	ZmListController.prototype._initializeTabGroup.call(this, view);

	var tg = this._tabGroups[view];

	tg.addMemberBefore(this._parentView[view].getAlphabetBar(),
	                   this._view[view].getTabGroupMember());

	tg.addMember(this._parentView[view].getTabGroupMember());
}

// If we're in the Trash folder, change the "Delete" button tooltip
ZmContactListController.prototype._setupDeleteButton = function(parent) {
	var folder = this._getSearchFolder();
	var inTrashFolder = (folder && folder.nId == ZmFolder.ID_TRASH);
	var tooltip = inTrashFolder ? ZmMsg.deletePermanentTooltip : ZmMsg.deleteTooltip;
	var deleteButton = parent.getButton(ZmOperation.DELETE);
	if(deleteButton){
		deleteButton.setToolTipContent(ZmOperation.getToolTip(ZmOperation.DELETE, this.getKeyMapName(), tooltip));
	}
};


/**
 * @private
 */
ZmContactListController.prototype._initializeNavToolBar =
function(view) {
	this._toolbar[view].addOp(ZmOperation.TEXT);
	var text = this._itemCountText[view] = this._toolbar[view].getButton(ZmOperation.TEXT);
	text.addClassName("itemCountText");
};

/**
 * @private
 */
ZmContactListController.prototype._initializeActionMenu =
function(view) {
	ZmListController.prototype._initializeActionMenu.call(this);

	var mi = this._actionMenu.getItemById(ZmOperation.KEY_ID, ZmOperation.PRINT_CONTACT);
	if (mi) {
		mi.setText(ZmMsg.print);
	}

	ZmOperation.setOperation(this._actionMenu, ZmOperation.CONTACT, ZmOperation.EDIT_CONTACT);
	this._setupContactGroupMenu(this._actionMenu);

};

ZmContactListController.prototype.getSearchFromText =
function() {
	return ZmMsg.findEmailFromContact;
};

ZmContactListController.prototype.getSearchToText =
function() {
	return ZmMsg.findEmailToContact;
};

/**
 * @private
 */
ZmContactListController.prototype._initializeAlphabetBar =
function(view) {
	if (view == this._currentViewId) { return; }

	var pv = this._parentView[this._currentViewId];
	var alphaBar = pv ? pv.getAlphabetBar() : null;
	var current = alphaBar ? alphaBar.getCurrent() : null;
	var idx = current ? current.getAttribute("_idx") : null;
	if (idx) {
		var newAlphaBar = this._parentView[view].getAlphabetBar();
		if (newAlphaBar)
			newAlphaBar.setButtonByIndex(idx);
	}
};

/**
 * Load contacts into the given view and perform layout.
 * 
 * @private
 */
ZmContactListController.prototype._setViewContents =
function(view) {
	DBG.timePt("setting list");
	this._list.removeChangeListener(this._listChangeListener);
	this._list.addChangeListener(this._listChangeListener);
	this._listView[view].set(this._list, null, this._folderId, this.isSearchResults);
	DBG.timePt("done setting list");
};

ZmContactListController.prototype._handleSyncAll =
function() {
	//doesn't do anything now after I removed the appCtxt.get(ZmSetting.GET_MAIL_ACTION) == ZmSetting.GETMAIL_ACTION_DEFAULT preference stuff
};

ZmContactListController.prototype._syncAllListener =
function(view) {
    var callback = new AjxCallback(this, this._handleSyncAll);
    appCtxt.accountList.syncAll(callback);
};

ZmContactListController.prototype.runRefresh =
function() {
	
	if (!appCtxt.isOffline) {
		return;
	}
	//should only happen in ZD

	this._syncAllListener();
};


ZmContactListController.prototype._sendReceiveListener =
function(ev) {
    var account = appCtxt.accountList.getAccount(ev.item.getData(ZmOperation.MENUITEM_ID));
    if (account) {
        account.sync();
    }
};

ZmContactListController.prototype._handleListChange =
function(ev) {
	if (ev.event == ZmEvent.E_MODIFY || ev.event == ZmEvent.E_CREATE) {
		if (!ev.getDetail("visible")) {
			return;
		}
		var items = ev.getDetail("items");
		var item = items && items.length && items[0];
		if (item instanceof ZmContact && this._currentViewType == ZmId.VIEW_CONTACT_SIMPLE && item.folderId == this._folderId) {
			var alphaBar = this._parentView[this._currentViewId].getAlphabetBar();
			//only set the view if the contact is in the list
			if(!alphaBar || alphaBar.isItemInAlphabetLetter(item)) {
				this._parentView[this._currentViewId].setContact(item, this.isGalSearch());
			}
		}
	}
};

/**
 * Create menu for View button and add listeners.
 * 
 * @private
 */
ZmContactListController.prototype._setupViewMenu =
function(view, firstTime) {
	var btn;

	if (firstTime) {
		btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
		var menu = btn.getMenu();
		if (!menu) {
			menu = new ZmPopupMenu(btn);
			btn.setMenu(menu);
			for (var i = 0; i < ZmContactListController.VIEWS.length; i++) {
				var id = ZmContactListController.VIEWS[i];
				var mi = menu.createMenuItem(id, {image:ZmContactListController.ICON[id],
													text:ZmMsg[ZmContactListController.MSG_KEY[id]],
													style:DwtMenuItem.RADIO_STYLE});
				mi.setData(ZmOperation.MENUITEM_ID, id);
				mi.addSelectionListener(this._listeners[ZmOperation.VIEW]);
				if (id == view)
					mi.setChecked(true, true);
			}
		}
	} else {
		// always set the switched view to be the checked menu item
		btn = this._toolbar[view].getButton(ZmOperation.VIEW_MENU);
		var menu = btn ? btn.getMenu() : null;
		var mi = menu ? menu.getItemById(ZmOperation.MENUITEM_ID, view) : null;
		if (mi) { mi.setChecked(true, true); }
	}

	// always reset the view menu button icon to reflect the current view
	btn.setImage(ZmContactListController.ICON[view]);
};

/**
 * @private
 */
ZmContactListController.prototype._setupPrintMenu =
function(view) {
	var printButton = this._toolbar[view].getButton(ZmOperation.PRINT);
	if (!printButton) { return; }

	printButton.setToolTipContent(ZmMsg.printMultiTooltip);
	printButton.noMenuBar = true;
	var menu = new ZmPopupMenu(printButton);
	printButton.setMenu(menu);

	var id = ZmOperation.PRINT_CONTACT;
	var mi = menu.createMenuItem(id, {image:ZmOperation.getProp(id, "image"), text:ZmMsg[ZmOperation.getProp(id, "textKey")]});
	mi.setData(ZmOperation.MENUITEM_ID, id);
	mi.addSelectionListener(this._listeners[ZmOperation.PRINT_CONTACT]);

	id = ZmOperation.PRINT_ADDRBOOK;
	mi = menu.createMenuItem(id, {image:ZmOperation.getProp(id, "image"), text:ZmMsg[ZmOperation.getProp(id, "textKey")]});
	mi.setData(ZmOperation.MENUITEM_ID, id);
	mi.addSelectionListener(this._listeners[ZmOperation.PRINT_ADDRBOOK]);
};

/**
 * Resets the available options on a toolbar or action menu.
 * 
 * @private
 */
ZmContactListController.prototype._resetOperations =
function(parent, num) {

	ZmBaseController.prototype._resetOperations.call(this, parent, num);

	var printMenuItem;
	if (parent instanceof ZmButtonToolBar) {
		var printButton = parent.getButton(ZmOperation.PRINT);
		var printMenu = printButton && printButton.getMenu();
		if (printMenu) {
			printMenuItem = printMenu.getItem(1);
			printMenuItem.setText(ZmMsg.printResults);
		}
	}

	this._setContactGroupMenu(parent);

	var printOp = (parent instanceof ZmActionMenu) ? ZmOperation.PRINT_CONTACT : ZmOperation.PRINT;


	var isDl = this._folderId  == ZmFolder.ID_DLS ||
			num == 1 && this._listView[this._currentViewId].getSelection()[0].isDistributionList();

	parent.enable(printOp, !isDl);

	parent.enable(ZmOperation.NEW_MESSAGE, num > 0 && !appCtxt.isExternalAccount());

	var folder = this._folderId && appCtxt.getById(this._folderId);

	parent.enable([ZmOperation.CONTACTGROUP_MENU], num > 0 && !isDl && !appCtxt.isExternalAccount());
	var contactGroupMenu = this._getContactGroupMenu(parent);
	if (contactGroupMenu) {
		contactGroupMenu.setNewDisabled(folder && folder.isReadOnly());
	}
	appCtxt.notifyZimlets("resetContactListToolbarOperations",[parent, num]);
	if (!this.isGalSearch()) {
		parent.enable([ZmOperation.SEARCH_MENU, ZmOperation.BROWSE, ZmOperation.NEW_MENU, ZmOperation.VIEW_MENU], true);

		// a valid folderId means user clicked on an addrbook
		if (folder) {
			var isShare = folder.link;
			var isInTrash = folder.isInTrash();
			var canEdit = !folder.isReadOnly();

			parent.enable([ZmOperation.TAG_MENU], canEdit && num > 0);
			parent.enable([ZmOperation.DELETE, ZmOperation.MOVE, ZmOperation.MOVE_MENU], canEdit && num > 0);
			parent.enable([ZmOperation.EDIT, ZmOperation.CONTACT], canEdit && num == 1 && !isInTrash);


			if (printMenuItem) {
				var text = isShare ? ZmMsg.printResults : ZmMsg.printAddrBook;
				printMenuItem.setText(text);
			}
		} else {
			// otherwise, must be a search
			var contact = this._listView[this._currentViewId].getSelection()[0];
			var canEdit = (num == 1 && !contact.isReadOnly() && !ZmContact.isInTrash(contact));
			parent.enable([ZmOperation.DELETE, ZmOperation.MOVE, ZmOperation.MOVE_MENU, ZmOperation.TAG_MENU], num > 0);
			parent.enable([ZmOperation.EDIT, ZmOperation.CONTACT], canEdit);
		}
	} else {
		// gal contacts cannot be tagged/moved/deleted
		parent.enable([ZmOperation.PRINT, ZmOperation.PRINT_CONTACT, ZmOperation.MOVE, ZmOperation.MOVE_MENU, ZmOperation.TAG_MENU], false);
		parent.enable([ZmOperation.SEARCH_MENU, ZmOperation.BROWSE, ZmOperation.NEW_MENU, ZmOperation.VIEW_MENU], true);
		parent.enable(ZmOperation.CONTACT, num == 1);
		var selection = this._listView[this._currentViewId].getSelection();
		var canEdit = false;
		if (num == 1) {
			var contact = selection[0];
			var isDL = contact && contact.isDistributionList();
			canEdit = isDL && contact.dlInfo && contact.dlInfo.isOwner;
		}
		parent.enable([ZmOperation.EDIT], canEdit);  //not sure what is this ZmOperation.CONTACT exactly, but it's used as the "edit group" below. 
		parent.enable([ZmOperation.CONTACT], isDL ? canEdit : num == 1);
		var canDelete = ZmContactList.deleteGalItemsAllowed(selection);

		parent.enable([ZmOperation.DELETE], canDelete);
	}

    //this._resetQuickCommandOperations(parent);

	var selection = this._listView[this._currentViewId].getSelection();
	var contact = (selection.length == 1) ? selection[0] : null;

	var searchEnabled = num === 1 && !appCtxt.isExternalAccount() && !contact.isGroup() && contact.getEmail(); //contact.getEmail() comes from bug 72446. I had to refactor but want to keep reference to bug in this comment
	parent.enable([ZmOperation.SEARCH_MENU, ZmOperation.BROWSE], searchEnabled);

	if (parent instanceof ZmPopupMenu) {
		this._setContactText(contact);

		var tagMenu = parent.getMenuItem(ZmOperation.TAG_MENU);
		if (tagMenu) {
			tagMenu.setText(contact && contact.isGroup() ? ZmMsg.AB_TAG_GROUP : ZmMsg.AB_TAG_CONTACT);
		}
	}

    if (appCtxt.isExternalAccount()) {
        parent.enable(
                        [
                            ZmOperation.MOVE,
                            ZmOperation.EDIT,
                            ZmOperation.CONTACT,
                            ZmOperation.MOVE_MENU,
                            ZmOperation.CONTACTGROUP_MENU,
                            ZmOperation.DELETE,
                            ZmOperation.SEARCH_MENU,
                            ZmOperation.NEW_MESSAGE
                        ],
                        false
                    );
        parent.setItemVisible(ZmOperation.TAG_MENU, false);
    }

	if (appCtxt.isWebClientOffline()) {
		parent.enable(
			[
				ZmOperation.ACTIONS_MENU,
				ZmOperation.MOVE,
				ZmOperation.EDIT,
				ZmOperation.CONTACT,
				ZmOperation.MOVE_MENU,
				ZmOperation.CONTACTGROUP_MENU,
				ZmOperation.DELETE,
				ZmOperation.TAG_MENU,
				ZmOperation.PRINT,
				ZmOperation.PRINT_CONTACT,
				ZmOperation.SEND_CONTACTS_IN_EMAIL
			],
			false
		);
	}
};


// List listeners


/**
 * @private
 * return the contact for which to do the action
 * @param {Boolean} isToolbar - true if the action is from the toolbar.  false/null if it's from right-click action
 */
ZmContactListController.prototype._getActionContact = function(isToolbar) {

	/*
	if you read this and don't understand why I don't do the same as in _composeListener. It's because
	in DwtListView.prototype.getSelection, the _rightSelItem is not set for a submenu, so the right clicked item is not the selection returned.
	This approach of specifically specifying if it's from the toolbar (isToolbar) is more explicit, less fragile and works.
	 */
	if (isToolbar) {
		var selection = this._listView[this._currentViewId].getSelection();
		if (selection.length != 1) {
			return null;
		}
		return selection[0];
	}
	if (this._actionEv) {
		return this._actionEv.contact;
	}
};


/**
 * From Search based on email address
 *
 * @private
 */
ZmContactListController.prototype._searchListener = function(addrType, isToolbar, ev) {

	var contact = this._getActionContact(isToolbar);
	if (!contact) {
		return;
	}

	var addresses = contact.getEmails(),
		srchCtlr = appCtxt.getSearchController();

	if (addrType === AjxEmailAddress.FROM) {
		srchCtlr.fromSearch(addresses);
	}
	else if (addrType === AjxEmailAddress.TO) {
		srchCtlr.toSearch(addresses);
	}
};

/**
 * Double click displays a contact.
 * 
 * @private
 */
ZmContactListController.prototype._listSelectionListener =
function(ev) {
	Dwt.setLoadingTime("ZmContactItem");
	ZmListController.prototype._listSelectionListener.call(this, ev);

	if (ev.detail == DwtListView.ITEM_SELECTED)	{
//		this._resetNavToolBarButtons();
		if (this._currentViewType == ZmId.VIEW_CONTACT_SIMPLE) {
			this._parentView[this._currentViewId].setContact(ev.item, this.isGalSearch());
		}	
	} else if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var folder = appCtxt.getById(ev.item.folderId);
		if (ev.item.isDistributionList() && ev.item.dlInfo.isOwner) {
			this._editListener.call(this, ev);
			return;
		}
		if (!this.isGalSearch() && (!folder || (!folder.isReadOnly() && !folder.isInTrash())) && !appCtxt.isWebClientOffline()) {
			AjxDispatcher.run("GetContactController").show(ev.item);
		}
	}
};

/**
 * @private
 */
ZmContactListController.prototype._newListener =
function(ev, op, params) {
	if (!ev && !op) { return; }
	op = op || ev.item.getData(ZmOperation.KEY_ID);
	if (op == ZmOperation.NEW_MESSAGE) {
		this._composeListener(ev);
	}else{
        ZmListController.prototype._newListener.call(this, ev, op, params);
    }
};

/**
 * Compose message to participant.
 * 
 * @private
 */
ZmContactListController.prototype._composeListener =
function(ev) {

    var selection = this._listView[this._currentViewId].getSelection();
    if (selection.length == 0 && this._actionEv) {
        selection.push(this._actionEv.contact);
    }
    var emailStr = '', contact, email;
    for (var i = 0; i < selection.length; i++){
        contact = selection[i];
		if (contact.isGroup() && !contact.isDistributionList()) {
			var members = contact.getGroupMembers().good;
			if (members.size()) {
				emailStr += members.toString(AjxEmailAddress.SEPARATOR) + AjxEmailAddress.SEPARATOR;
			}
		}
		else {
			var addr = new AjxEmailAddress(contact.getEmail(), AjxEmailAddress.TO, contact.getFullName());
			emailStr += addr.toString() + AjxEmailAddress.SEPARATOR;
		}
    }

	AjxDispatcher.run("Compose", {action: ZmOperation.NEW_MESSAGE, inNewWindow: this._app._inNewWindow(ev),
								  toOverride: emailStr});
};

/**
 * Get info on selected contact to provide context for action menu.
 * 
 * @private
 */
ZmContactListController.prototype._listActionListener =
function(ev) {
	ZmListController.prototype._listActionListener.call(this, ev);
	this._actionEv.contact = ev.item;
	var actionMenu = this.getActionMenu();
	if (!this._actionEv.contact.getEmail()  && actionMenu) {
		var menuItem = actionMenu.getMenuItem(ZmOperation.SEARCH_MENU);
		if (menuItem) {
			menuItem.setEnabled(false);
		}
	}
	actionMenu.popup(0, ev.docX, ev.docY);
	if (ev.ersatz) {
		// menu popped up via keyboard nav
		actionMenu.setSelectedItem(0);
	}
};


/**
 * @private
 */
ZmContactListController.prototype._dropListener =
function(ev) {
	var view = this._listView[this._currentViewId];
	//var item = view.getTargetItem(ev); - this didn't seem to return any item in my tests, while the below (copied from ZmListController.prototype._dropListener) does, and thus solves the gal issue for DLs as well.
	var div = view.getTargetItemDiv(ev.uiEvent);
	var item = view.getItemFromElement(div);

	// only tags can be dropped on us
	if (ev.action == DwtDropEvent.DRAG_ENTER) {
		if (item && (item.type == ZmItem.CONTACT) && (item.isGal || item.isShared())) {
			ev.doIt = false; // can't tag a GAL or shared contact
			view.dragSelect(div);
			return;
		}
	}
	ZmListController.prototype._dropListener.call(this, ev);
};

/**
 * @private
 */
ZmContactListController.prototype._editListener =
function(ev, contact) {
	contact = contact || this._listView[this._currentViewId].getSelection()[0];
	AjxDispatcher.run("GetContactController").show(contact, false);
};

/**
 * @private
 */
ZmContactListController.prototype._printListener =
function(ev) {

	var contacts = this._listView[this._currentViewId].getSelection();
	var ids = [];
	for (var i = 0; i < contacts.length; i++) {
		if (contacts[i].isDistributionList()) {
			continue; //don't print DLs
		}
		ids.push(contacts[i].id);
	}
	if (ids.length == 0) {
		return;
	}

	var url = "/h/printcontacts?id=" + ids.join(",");
	if (this.isGalSearch()) {
		url = "/h/printcontacts?id=" + ids.join("&id=");
		url = url + "&st=gal";
		var query = this._currentSearch && this._currentSearch.query;
		if (query && contacts.length > 1)
			url += "&sq="+query;
        else if(contacts.length==1)
            url += "&sq=" + contacts[0].getFileAs();
	}
	if (appCtxt.isOffline) {
		var folderId = this._folderId || ZmFolder.ID_CONTACTS;
		var acctName = appCtxt.getById(folderId).getAccount().name;
		url += "&acct=" + acctName ;
	}
	window.open(appContextPath+url, "_blank");
};

/**
 * @private
 */
ZmContactListController.prototype._printAddrBookListener =
function(ev) {
	var url;
	if (this._folderId && !this._list._isShared) {
		url = "/h/printcontacts?sfi=" + this._folderId;
	} else {
		var contacts = ((this._searchType & ZmContactListController.SEARCH_TYPE_ANYWHERE) != 0)
			? AjxDispatcher.run("GetContacts")
			: this._list;

		var ids = [];
		var list = contacts.getArray();
		for (var i = 0; i < list.length; i++) {
			ids.push(list[i].id);
		}
		// XXX: won't this run into GET limits for large addrbooks? would be better to have
		// URL that prints all contacts (maybe "id=all")
		url = "/h/printcontacts";
		if (this.isGalSearch()) {
			url += "?id=" + ids.join("&id=");
		} else {
			url += "?id=" + ids.join(",");
		}
	}
	if (this.isGalSearch()) {
		url = url + "&st=gal";
		var query = this._currentSearch && this._currentSearch.query;
		if (query && list && list.length > 1)
			url += "&sq="+query;
        else if (list && list.length == 1)
            url += "&sq="+list[0].getFileAs();
	}
	if (appCtxt.isOffline) {
		var folderId = this._folderId || ZmFolder.ID_CONTACTS;
		var acctName = appCtxt.getById(folderId).getAccount().name;
		url += "&acct=" + acctName ;
	}
	window.open(appContextPath+url, "_blank");
};


// Callbacks

/**
 * @private
 */
ZmContactListController.prototype._preShowCallback =
function(view) {
	if ((this._searchType & ZmContactListController.SEARCH_TYPE_NEW) != 0) {
		this._searchType &= ~ZmContactListController.SEARCH_TYPE_NEW;
	} else {
		this._resetNavToolBarButtons(view);
	}

	return true;
};

/**
 * @private
 */
ZmContactListController.prototype._doMove =
function(items, folder, attrs, isShiftKey) {

	items = AjxUtil.toArray(items);

	var move = [];
	var copy = [];
	var moveFromGal = [];
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.isGal) {
			moveFromGal.push(item);
		} else if (!item.folderId || item.folderId != folder.id) {
			if (!this._isItemMovable(item, isShiftKey, folder)) {
				copy.push(item);
			} else {
				move.push(item);
			}
		}
	}

	var moveOutFolder = appCtxt.getById(this.getFolderId());
	var outOfTrash = (moveOutFolder && moveOutFolder.isInTrash() && !folder.isInTrash());

    var allDoneCallback = this._getAllDoneCallback();
	if (move.length) {
        var params = {items:move, folder:folder, attrs:attrs, outOfTrash:outOfTrash};
		var list = params.list = this._getList(params.items);
        this._setupContinuation(this._doMove, [folder, attrs, isShiftKey], params, allDoneCallback);
        list = outOfTrash ? this._list : list;
		list.moveItems(params);
	}

	if (copy.length) {
        var params = {items:copy, folder:folder, attrs:attrs};
		var list = params.list = this._getList(params.items);
        this._setupContinuation(this._doMove, [folder, attrs, isShiftKey], params, allDoneCallback);
        list = outOfTrash ? this._list : list;
		list.copyItems(params);
	}

	if (moveFromGal.length) {
		var batchCmd = new ZmBatchCommand(true, null, true);
		for (var j = 0; j < moveFromGal.length; j++) {
			var contact = moveFromGal[j];
			contact.attr[ZmContact.F_folderId] = folder.id;
			batchCmd.add(new AjxCallback(contact, contact.create, [contact.attr]));
		}
		batchCmd.run(new AjxCallback(this, this._handleMoveFromGal));
	}
};

/**
 * @private
 */
ZmContactListController.prototype._handleMoveFromGal =
function(result) {
	var resp = result.getResponse().BatchResponse.CreateContactResponse;
	if (resp != null && resp.length > 0) {
		var msg = AjxMessageFormat.format(ZmMsg.itemCopied, resp.length);
		appCtxt.getAppController().setStatusMsg(msg);
	}
};

/**
 * @private
 */
ZmContactListController.prototype._doDelete =
function(items, hardDelete, attrs) {
	ZmListController.prototype._doDelete.call(this, items, hardDelete, attrs);
	for (var i=0; i<items.length; i++) {
		appCtxt.getApp(ZmApp.CONTACTS).updateIdHash(items[i], true);
	}
	// if more contacts to show,
	var size = this._listView[this._currentViewId].getSelectedItems().size();
	if (size == 0) {
		// and if in split view allow split view to clear
		if (this._currentViewType == ZmId.VIEW_CONTACT_SIMPLE)
			this._listView[this._currentViewId].parent.clear();

		this._resetOperations(this._toolbar[this._currentViewId], 0);
	}
};

/**
 * @private
 */
ZmContactListController.prototype._moveListener =
function(ev) {
	ZmListController.prototype._moveListener.call(this, ev);
};

/**
 * @private
 */
ZmContactListController.prototype._checkReplenish =
function() {
	// reset the listview
	var lv = this._listView[this._currentViewId];
	lv.set(this._list);
	lv._setNextSelection();
};


ZmContactListController.prototype._getContactGroupMenu =
function(parent) {
	var menu = parent instanceof ZmButtonToolBar ? parent.getActionsMenu() : parent;
	return menu ? menu.getContactGroupMenu() : null;
};


ZmContactListController.prototype._setContactGroupMenu =
function(parent) {
	if (!parent || appCtxt.isExternalAccount()) { return; }

	var groupMenu = this._getContactGroupMenu(parent);
	if (!groupMenu) {
		return;
	}
	var items = this.getItems();
	items = AjxUtil.toArray(items);
	var contacts = this._getContactsFromCache();
	var contactGroups = this._filterGroups(contacts);
	var sortedGroups = this._sortContactGroups(contactGroups);
	groupMenu.set(items, sortedGroups, this._folderId == ZmFolder.ID_DLS); //disabled "new" from this for DLs folder.
};

ZmContactListController.prototype._setupContactGroupMenu =
function(parent) {
	if (!parent) return;
	var groupMenu = this._getContactGroupMenu(parent);
	if (groupMenu) {
		groupMenu.addSelectionListener(this._listeners[ZmOperation.NEW_GROUP]);
	}
};

/**
 * handles updating the group item data
 * @param ev
 */
ZmContactListController.prototype._contactListChange =
function(ev) {
	if (ev && ev.source && ev.type == ZmId.ITEM_CONTACT) {
			var item = ev.source;
			var id = DwtId.WIDGET_ITEM + "__" + this._currentViewId + "__" + ev.source.id;
			var view = this._listView[this._currentViewId];
			view._setItemData(null, "item", item, id);
	}


};

ZmContactListController.prototype._groupListener =
function(ev, items) {

	if (this.isCurrent()) {
		var groupEvent = ev.getData(ZmContactGroupMenu.KEY_GROUP_EVENT);
		var groupAdded = ev.getData(ZmContactGroupMenu.KEY_GROUP_ADDED);
		items = items || this.getItems();
		if (groupEvent == ZmEvent.E_MODIFY) {
			var mods = {};
			var groupId = ev.getData(Dwt.KEY_OBJECT).id;
			var group = appCtxt.getApp(ZmApp.CONTACTS).getContactList().getById(groupId);
			if (group) {
				group.addChangeListener(this._contactListChange.bind(this), 0);//update the group data
				var modifiedGroups = this._getGroupMembers(items, group);
				if (modifiedGroups) {
					mods[ZmContact.F_groups] = modifiedGroups;
				}
				this._doModify(group, mods);
				this._menuPopdownActionListener();
				var idx = this._list.getIndexById(group.id);
				if (idx != null) {
					this._resetSelection(idx);
				}
			}
		}
		else if (groupEvent == ZmEvent.E_CREATE) {
			this._pendingActionData = items;
			var newContactGroupDialog = appCtxt.getNewContactGroupDialog();
			if (!this._newContactGroupCb) {
				this._newContactGroupCb = new AjxCallback(this, this._newContactGroupCallback);
			}
			ZmController.showDialog(newContactGroupDialog, this._newContactGroupCb);
			newContactGroupDialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._clearDialog, this, newContactGroupDialog);
		}
	}
};

ZmContactListController.prototype._newContactGroupCallback =
function(params) {
	var groupName = params.name;
	appCtxt.getNewContactGroupDialog().popdown();
	var items = this.getItems();
	var mods = {};
	mods[ZmContact.F_groups] = this._getGroupMembers(items);
	mods[ZmContact.F_folderId] = this._folderId;
	mods[ZmContact.F_fileAs] = ZmContact.computeCustomFileAs(groupName);
	mods[ZmContact.F_nickname] = groupName;
	mods[ZmContact.F_type] = "group";
	this._doCreate(this._list, mods);
	this._pendingActionData = null;
	this._menuPopdownActionListener();
};

//methods for dealing with contact groups
ZmContactListController.prototype._getGroupMembers =
function(items, group) {
	var mods = {};
	var newMembers = {};
	var groupId = [];
	var memberType;
	var obj = {};
	var id, contact;
	
	for (var i=0; i<items.length; i++) {
		if (items[i].isDistributionList() || !items[i].isGroup()) {
			obj = this._createContactRefObj(items[i], group);
			if (obj.value) {
				newMembers[obj.value] = obj;
			}		
		}
		else {
			var groups = items[i].attr[ZmContact.F_groups];  //getAttr only returns first value in array
			if (!groups) {
				obj = this._createContactRefObj(items[i], group);
				if (obj.value) {
					newMembers[obj.value] = obj;
				}
			}
			else {
				for (var j=0; j <groups.length; j++) {
					id = groups[j].value;
					contact = ZmContact.getContactFromCache(id);
					if (contact) {
						memberType = contact.isGal ? ZmContact.GROUP_GAL_REF : ZmContact.GROUP_CONTACT_REF;
						obj = {value : contact.isGal ? contact.ref : id, type : memberType};
						if (group) {
							obj.op = "+";
						} 
						newMembers[id] = obj;
					}
					else if (groups[j].type == ZmContact.GROUP_INLINE_REF) {
						obj = {value: groups[j].value, type : ZmContact.GROUP_INLINE_REF};
						if (group) {
							obj.op = "+";
						}
						newMembers[id] = obj;				
					}
				}
			}
		}
	}
	var newMembersArr = [];
	for (var id in newMembers) {
		newMembersArr.push(newMembers[id]);
	}
	if (group) {
		//handle potential duplicates
		var groupArr = group.attr[ZmContact.F_groups];
		var noDups = [];
		var found = false;
		for (var i=0; i<newMembersArr.length; i++) {
			found = false;
			for (var j=0; j<groupArr.length && !found; j++) {				
				if (newMembersArr[i].value == groupArr[j].value) {
					found = true;	
				}
			}
			if (!found) {
				noDups.push(newMembersArr[i]);
			}
		}
		return noDups;
	}
	else {
		return newMembersArr;
	}
};

ZmContactListController.prototype._createContactRefObj = 
function(contactToAdd, group) {
	var obj = {};
	var memberType = contactToAdd.isGal ? ZmContact.GROUP_GAL_REF : ZmContact.GROUP_CONTACT_REF;
	var id = memberType == ZmContact.GROUP_CONTACT_REF ? contactToAdd.getId(true) : (contactToAdd.ref || contactToAdd.id);
	if (id) {
		var obj = {value: id, type: memberType};
		if (group) {
			obj.op = "+"; //modifying group with new member	
		}
	}
	return obj;
	
};

ZmContactListController.prototype._getContactsFromCache =
function() {
	var contactList = appCtxt.getApp(ZmApp.CONTACTS).getContactList();
	if (contactList){
		return contactList.getIdHash();
	}
	return {};
};

ZmContactListController.prototype._sortContactGroups =
function(contactGroups) {
	var sortByNickname = function(a, b) {
		var aNickname = ZmContact.getAttr(a, "nickname");
		var bNickname = ZmContact.getAttr(b, "nickname");

		if (!aNickname || !bNickname) {
			return 0;
		}

		if (aNickname.toLowerCase() > bNickname.toLowerCase())
			return 1;
		if (aNickname.toLowerCase() < bNickname.toLowerCase())
			return -1;

		return 0;
	};

	return contactGroups.sort(sortByNickname);
};

ZmContactListController.prototype._filterGroups =
function(contacts) {
	var groups = [];
	for (var id in contacts) {
		var typeAttr = ZmContact.getAttr(contacts[id], "type");
		if (typeAttr && typeAttr.toUpperCase() == ZmItem.GROUP.toUpperCase()) {
			groups.push(contacts[id]);
		}
	}
	return groups;
};

/**
 * @private
 */
ZmContactListController.prototype._paginate =
function(view, forward, loadIndex, limit) {
	if (this._list.isGal && !this._list.isGalPAgingSupported) {
		return;
	}
	ZmListController.prototype._paginate.call(this, view, forward, loadIndex, limit);
};

/**
 * @private
 */
ZmContactListController.prototype._getDefaultFocusItem =
function() {
	return this.getCurrentView().getListView();
};
}
if (AjxPackage.define("zimbraMail.abook.controller.ZmContactController")) {
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
 * This file contains the contact controller class.
 * 
 */

/**
 * Creates the contact controller.
 * @class
 * This class represents the contact controller.
 *
 * @param {DwtShell}	container	the containing shell
 * @param {ZmApp}		abApp		the containing app
 * @param {constant}	type		controller type
 * @param {string}		sessionId	the session id
 *
 * @extends		ZmListController
 */
ZmContactController = function(container, abApp, type, sessionId) {

	ZmListController.apply(this, arguments);

	this._listeners[ZmOperation.SAVE]	= this._saveListener.bind(this);
	this._listeners[ZmOperation.CANCEL]	= this._cancelListener.bind(this);

	this._tabGroupDone = {};
	this._elementsToHide = ZmAppViewMgr.LEFT_NAV;
};

ZmContactController.prototype = new ZmListController();
ZmContactController.prototype.constructor = ZmContactController;

ZmContactController.prototype.isZmContactController = true;
ZmContactController.prototype.toString = function() { return "ZmContactController"; };


ZmContactController.getDefaultViewType =
function() {
	return ZmId.VIEW_CONTACT;
};
ZmContactController.prototype.getDefaultViewType = ZmContactController.getDefaultViewType;

/**
 * Shows the contact.
 *
 * @param	{ZmContact}	contact		the contact
 * @param	{Boolean}	isDirty		<code>true</code> to mark the contact as dirty
 * @param	{Boolean}	isBack		<code>true</code> in case of DL, we load (or reload) all the DL info, so we have to call back here. isBack indicates this is after the reload so we can continue.
 */
ZmContactController.prototype.show =
function(contact, isDirty, isBack) {
	if (contact.id && contact.isDistributionList() && !isBack) {
		//load the full DL info available for the owner, for edit.
		var callback = this.show.bind(this, contact, isDirty, true); //callback HERE
		contact.clearDlInfo();
		contact.gatherExtraDlStuff(callback);
		return;
	}

	this._contact = contact;
	if (isDirty) {
		this._contactDirty = true;
	}
	this.setList(contact.list);

	if (!this.getCurrentToolbar()) {
		this._initializeToolBar(this._currentViewId);
	}
	this._resetOperations(this.getCurrentToolbar(), 1); // enable all buttons

	this._createView(this._currentViewId);

	this._setViewContents();
	this._initializeTabGroup(this._currentViewId);
	this._app.pushView(this._currentViewId);
	this.updateTabTitle();
};

ZmContactController.prototype._createView =
function(viewId) {
	if (this._contactView) {
		return;
	}
	var view = this._contactView = this._createContactView();
	//Note - I store this in this._view just to be consistent with certain calls such as for ZmBaseController.prototype._initializeTabGroup. Even though there's no real reason to keep an array of views per type since each controller would only have one view and therefor one type
	this._view[viewId] = view;

	var callbacks = {};
		callbacks[ZmAppViewMgr.CB_PRE_HIDE] = this._preHideCallback.bind(this);
		callbacks[ZmAppViewMgr.CB_PRE_UNLOAD] = this._preUnloadCallback.bind(this);
		callbacks[ZmAppViewMgr.CB_POST_SHOW] = this._postShowCallback.bind(this);
	var elements = this.getViewElements(null, view, this._toolbar[viewId]);

	this._app.createView({	viewId:		viewId,
							viewType:	this._currentViewType,
							elements:	elements, 
							hide:		this._elementsToHide,
							controller:	this,
							callbacks:	callbacks,
							tabParams:	this._getTabParams()});
};

ZmContactController.prototype._postShowCallback =
function() {
	//have to call it since it's overridden in ZmBaseController to do nothing.
	ZmController.prototype._postShowCallback.call(this);
	if (this._contactView.postShow) {
		this._contactView.postShow();
	}
};

ZmContactController.prototype._getDefaultTabText=
function() {
	return this._contact.isDistributionList()
			? ZmMsg.distributionList
				: this._isGroup()
			? ZmMsg.group
				: ZmMsg.contact;
};

ZmContactController.prototype._getTabParams =
function() {
	var text = this._isGroup() ? ZmMsg.group : ZmMsg.contact;
	return {id:this.tabId,
			image:"CloseGray",
            hoverImage:"Close",
			text: null, //we update it using updateTabTitle since before calling _setViewContents _getFullName does not return the name
			textPrecedence:77,
			tooltip: text,
            style: DwtLabel.IMAGE_RIGHT};
};

ZmContactController.prototype.updateTabTitle =
function() {
	var	tabTitle = this._contactView._getFullName(true);
	if (!tabTitle) {
		tabTitle = this._getDefaultTabText();
	}
	tabTitle = 	tabTitle.substr(0, ZmAppViewMgr.TAB_BUTTON_MAX_TEXT);

	appCtxt.getAppViewMgr().setTabTitle(this._currentViewId, tabTitle);
};



ZmContactController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_EDIT_CONTACT;
};

ZmContactController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println("ZmContactController.handleKeyAction");
	switch (actionCode) {

		case ZmKeyMap.SAVE:
			var tb = this.getCurrentToolbar();
			var saveButton = tb.getButton(ZmOperation.SAVE);
			if (!saveButton.getEnabled()) {
				break;
			}
			this._saveListener();
			break;

		case ZmKeyMap.CANCEL:
			this._cancelListener();
			break;
	}
	return true;
};

/**
 * Enables the toolbar.
 *
 * @param	{Boolean}	enable	<code>true</code> to enable
 */
ZmContactController.prototype.enableToolbar =
function(enable) {
	if (enable) {
		this._resetOperations(this.getCurrentToolbar(), 1);
	} else {
		this.getCurrentToolbar().enableAll(enable);
	}
};

// Private methods (mostly overrides of ZmListController protected methods)

/**
 * @private
 */
ZmContactController.prototype._getToolBarOps =
function() {
	return [ZmOperation.SAVE, ZmOperation.CANCEL,
			ZmOperation.SEP,
			ZmOperation.PRINT, ZmOperation.DELETE,
			ZmOperation.SEP,
			ZmOperation.TAG_MENU];
};

/**
 * @private
 */
ZmContactController.prototype._getActionMenuOps =
function() {
	return null;
};

/**
 * @private
 */
ZmContactController.prototype._isGroup =
function() {
	return this._contact.isGroup();
};


ZmContactController.prototype._createContactView =
function() {
	return this._isGroup()
			? new ZmGroupView(this._container, this)
			: new ZmEditContactView(this._container, this);
};

/**
 * @private
 */
ZmContactController.prototype._initializeToolBar =
function(view) {
	ZmListController.prototype._initializeToolBar.call(this, view);

	var tb = this._toolbar[view];

	// change the cancel button to "close" if editing existing contact
	var cancelButton = tb.getButton(ZmOperation.CANCEL);
	if (this._contact.id == undefined || (this._contact.isGal && !this._contact.isDistributionList())) {
		cancelButton.setText(ZmMsg.cancel);
	} else {
		cancelButton.setText(ZmMsg.close);
	}

	var saveButton = tb.getButton(ZmOperation.SAVE);
	if (saveButton) {
		saveButton.setToolTipContent(ZmMsg.saveContactTooltip);
	}

	appCtxt.notifyZimlets("initializeToolbar", [this._app, tb, this, view], {waitUntilLoaded:true});
};

/**
 * @private
 */
ZmContactController.prototype._getTagMenuMsg =
function() {
	return ZmMsg.AB_TAG_CONTACT;
};

/**
 * @private
 */
ZmContactController.prototype._setViewContents =
function() {
	var cv = this._contactView;
	// We need to extract current i.e editing contact list and keep in this object while setting edit view, Because contact list of editing contact group can get changed from cache while changing contact lists in edit view.
	this.editingContactList = this._contact.list;
	cv.set(this._contact, this._contactDirty);
	if (this._contactDirty) {
		delete this._contactDirty;
	}

};

/**
 * @private
 */
ZmContactController.prototype._paginate =
function(view, bPageForward) {
	// TODO? - page to next/previous contact
};

/**
 * @private
 */
ZmContactController.prototype._resetOperations =
function(parent, num) {
	if (!parent) return;
	if (!this._contact.id) {
		// disble all buttons except SAVE and CANCEL
		parent.enableAll(false);
		parent.enable([ZmOperation.SAVE, ZmOperation.CANCEL], true);
	}
	else if (this._contact.isGal) {
		//GAL item or DL.
		parent.enableAll(false);
		parent.enable([ZmOperation.SAVE, ZmOperation.CANCEL], true);
		//for editing a GAL contact - need to check special case for DLs that are owned by current user and if current user has permission to delete on this domain.
		var deleteAllowed = ZmContactList.deleteGalItemsAllowed([this._contact]);
		parent.enable(ZmOperation.DELETE, deleteAllowed);
	} else if (this._contact.isReadOnly()) {
		parent.enableAll(true);
		parent.enable(ZmOperation.TAG_MENU, false);
	} else {
		ZmListController.prototype._resetOperations.call(this, parent, num);
	}
};

/**
 * @private
 */
ZmContactController.prototype._saveListener = function(ev, bIsPopCallback) {

	var fileAsChanged = false;
	var view = this._contactView;
	if (view instanceof DwtForm) {
		view.validate();
    }

	if (!view.isValid()) {
		var invalidItems = view.getInvalidItems();
		// This flag will be set to false when the view.validate() detects some invalid fields (other than EMAIL) which does not have an error message.  If the EMAIL field is the only invalid one, ignore the error and move on.
		var onlyEmailInvalid = true;
		for (var i = 0; i < invalidItems.length; i++) {
			msg = view.getErrorMessage(invalidItems[i]);
			var isInvalidEmailAddr = (invalidItems[i].indexOf("EMAIL") != -1);
			if (AjxUtil.isString(msg) && !isInvalidEmailAddr) {
				msg = msg ? AjxMessageFormat.format(ZmMsg.errorSavingWithMessage, msg) : ZmMsg.errorSaving;
				var msgDlg = appCtxt.getMsgDialog();
				msgDlg.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
				msgDlg.popup();
				return;
			}
			onlyEmailInvalid = onlyEmailInvalid && isInvalidEmailAddr;
		}
		if (!onlyEmailInvalid) {
			return;
		}
	}

	var mods = view.getModifiedAttrs();
	view.enableInputs(false);

	var contact = view.getContact();
	if(this.editingContactList) {
		contact.list = this.editingContactList;
	}
	if (mods && AjxUtil.arraySize(mods) > 0) {

		// bug fix #22041 - when moving betw. shared/local folders, dont modify
		// the contact since it will be created/deleted into the new folder
		var newFolderId = mods[ZmContact.F_folderId];
		var newFolder = newFolderId ? appCtxt.getById(newFolderId) : null;
		if (contact.id != null && newFolderId && (contact.isShared() || (newFolder && newFolder.link)) && !contact.isGal) {
			// update existing contact with new attrs
			for (var a in mods) {
				if (a != ZmContact.F_folderId && a != ZmContact.F_groups) {
					contact.attr[a] = mods[a];
				}
			}
			// set folder will do the right thing for this shared contact
			contact._setFolder(newFolderId);
		}
		else {
			if (contact.id && (!contact.isGal || contact.isDistributionList())) {
				if (view.isEmpty()) { //If contact empty, alert the user
					var ed = appCtxt.getMsgDialog();
					ed.setMessage(ZmMsg.emptyContactSave, DwtMessageDialog.CRITICAL_STYLE);
					ed.popup();
					view.enableInputs(true);
					bIsPopCallback = true;
				}
                else {
					var contactFileAsBefore = ZmContact.computeFileAs(contact),
					    contactFileAsAfter = ZmContact.computeFileAs(AjxUtil.hashUpdate(AjxUtil.hashCopy(contact.getAttrs()), mods, true)),
                        fileAsBefore = contactFileAsBefore ? contactFileAsBefore.toLowerCase()[0] : null,
                        fileAsAfter = contactFileAsAfter ? contactFileAsAfter.toLowerCase()[0] : null;
					this._doModify(contact, mods);
					if (fileAsBefore !== fileAsAfter) {
						fileAsChanged = true;
					}
				}
			}
            else {
				var isEmpty = true;
				for (var a in mods) {
					if (mods[a]) {
						isEmpty = false;
						break;
					}
				}
				if (isEmpty) {
					var msg = this._isGroup() ? ZmMsg.emptyGroup : ZmMsg.emptyContact;
					appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_WARNING);
				}
				else {
					if (contact.isDistributionList()) {
						contact.create(mods);
					}
					else {
						var clc = AjxDispatcher.run("GetContactListController");
						var list = (clc && clc.getList()) || new ZmContactList(null);
						fileAsChanged = true;
						this._doCreate(list, mods);
					}
				}
			}
		}
	}
    else {
		if (contact.isDistributionList()) {
			//in this case, we need to pop the view since we did not call the server to modify the DL.
			this.popView();
		}
		// bug fix #5829 - differentiate betw. an empty contact and saving
		//                 an existing contact w/o editing
		if (view.isEmpty()) {
			var msg = this._isGroup()
				? ZmMsg.emptyGroup
				: ZmMsg.emptyContact;
			appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_WARNING);
		}
        else {
			var msg = contact.isDistributionList()
				? ZmMsg.dlSaved
				: this._isGroup()
				? ZmMsg.groupSaved
				: ZmMsg.contactSaved;
			appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_INFO);
		}
	}

	if (!bIsPopCallback && !contact.isDistributionList()) {
		//in the DL case it might fail so wait to pop the view when we receive success from server.
		this.popView();
	}
	else {
		view.enableInputs(true);
	}
	if (fileAsChanged) // bug fix #45069 - if the contact is new, change the search to "all" instead of displaying contacts beginning with a specific letter
		ZmContactAlphabetBar.alphabetClicked(null);

    return true;
};

ZmContactController.prototype.popView =
function() {
	this._app.popView(true);
	if (this._contactView) { //not sure why _contactView is undefined sometimes. Maybe it's a different instance of ZmContactController.
		this._contactView.cleanup();
	}
};


/**
 * @private
 */
ZmContactController.prototype._cancelListener =
function(ev) {
	this._app.popView();
};

/**
 * @private
 */
ZmContactController.prototype._printListener =
function(ev) {
	var url = "/h/printcontacts?id=" + this._contact.id;
    if (appCtxt.isOffline) {
        var acctName = this._contact.getAccount().name;
        url+="&acct=" + acctName ;
    }
	window.open(appContextPath+url, "_blank");
};

/**
 * @private
 */
ZmContactController.prototype._doDelete =
function(items, hardDelete, attrs, skipPostProcessing) {
	ZmListController.prototype._doDelete.call(this, items, hardDelete, attrs);
	if (items.isDistributionList()) { //items === this._contact here
		//do not pop the view as we are not sure the user will confirm the hard delete
		return;
	}
	appCtxt.getApp(ZmApp.CONTACTS).updateIdHash(items, true);

	if (!skipPostProcessing) {
		// disable input fields (to prevent blinking cursor from bleeding through)
		this._contactView.enableInputs(false);
		this._app.popView(true);
	}
};

/**
 * @private
 */
ZmContactController.prototype._preHideCallback =
function(view, force) {
	ZmController.prototype._preHideCallback.call(this);

	if (force) return true;

	var view = this._contactView;
	if (!view.isDirty()) {
		view.cleanup();
		return true;
	}

	var ps = this._popShield = appCtxt.getYesNoCancelMsgDialog();
	ps.reset();
	ps.setMessage(ZmMsg.askToSave, DwtMessageDialog.WARNING_STYLE);
	ps.registerCallback(DwtDialog.YES_BUTTON, this._popShieldYesCallback, this);
	ps.registerCallback(DwtDialog.NO_BUTTON, this._popShieldNoCallback, this);
	ps.popup(view._getDialogXY());

	return false;
};

/**
 * @private
 */
ZmContactController.prototype._preUnloadCallback =
function(view) {
	return this._contactView.clean || !this._contactView.isDirty();
};

/**
 * @private
 */
ZmContactController.prototype._popShieldYesCallback =
function() {
    this._popShield.popdown();
	if (this._saveListener(null, true)) {
        this._popShieldCallback();
    }
};

/**
 * @private
 */
ZmContactController.prototype._popShieldNoCallback =
function() {
    this._popShield.popdown();
    this._popShieldCallback();
};

/**
 * @private
 */
ZmContactController.prototype._popShieldCallback = function() {
    appCtxt.getAppViewMgr().showPendingView(true);
    this._contactView.cleanup();
};

/**
 * @private
 */
ZmContactController.prototype._menuPopdownActionListener =
function(ev) {
	// bug fix #3719 - do nothing
};

/**
 * @private
 */
ZmContactController.prototype._getDefaultFocusItem =
function() {
	return this._contactView._getDefaultFocusItem();
};
}
if (AjxPackage.define("zimbraMail.abook.controller.ZmAddrBookTreeController")) {
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
 * This file contains the address book tree controller class.
 * 
 */

/**
 * Creates an address book tree controller.
 * @class
 * This class is a controller for the tree view used by the address book 
 * application. This class uses the support provided by {@link ZmOperation}. 
 *
 * @author Parag Shah
 * 
 * @extends		ZmFolderTreeController
 */
ZmAddrBookTreeController = function() {

	ZmFolderTreeController.call(this, ZmOrganizer.ADDRBOOK);

	this._listeners[ZmOperation.NEW_ADDRBOOK]	= this._newListener.bind(this);
	this._listeners[ZmOperation.SHARE_ADDRBOOK]	= this._shareAddrBookListener.bind(this);

	this._app = appCtxt.getApp(ZmApp.CONTACTS);
};

ZmAddrBookTreeController.prototype = new ZmFolderTreeController;
ZmAddrBookTreeController.prototype.constructor = ZmAddrBookTreeController;

ZmAddrBookTreeController.prototype.isZmAddrBookTreeController = true;
ZmAddrBookTreeController.prototype.toString = function() { return "ZmAddrBookTreeController"; };

// Public methods

/**
 * Shows the controller and returns the resulting tree view.
 * 
 * @param	{Hash}	params		 a hash of parameters
 * @return	{ZmTreeView}	the tree view
 */
ZmAddrBookTreeController.prototype.show =
function(params) {
	params.include = {};
	params.include[ZmFolder.ID_TRASH] = true;
    params.showUnread = false;
    var treeView = ZmFolderTreeController.prototype.show.call(this, params);

	// contacts app has its own Trash folder so listen for change events
	var trash = this.getDataTree().getById(ZmFolder.ID_TRASH);
	if (trash) {
		trash.addChangeListener(new AjxListener(this, this._trashChangeListener, treeView));
	}

	return treeView;
};

/**
 * @private
 */
ZmAddrBookTreeController.prototype._trashChangeListener =
function(treeView, ev) {
	var organizers = ev.getDetail("organizers");
	if (!organizers && ev.source) {
		organizers = [ev.source];
	}

	// handle one organizer at a time
	for (var i = 0; i < organizers.length; i++) {
		var organizer = organizers[i];

		if (organizer.id == ZmFolder.ID_TRASH &&
			ev.event == ZmEvent.E_MODIFY)
		{
			var fields = ev.getDetail("fields");
			if (fields && (fields[ZmOrganizer.F_TOTAL] || fields[ZmOrganizer.F_SIZE])) {
				var ti = treeView.getTreeItemById(organizer.id);
				if (ti) ti.setToolTipContent(organizer.getToolTip(true));
			}
		}
	}
};

/**
 * Enables/disables operations based on the given organizer ID.
 * 
 * @private
 */
ZmAddrBookTreeController.prototype.resetOperations =
function(parent, type, id) {
	var deleteText = ZmMsg.del;
	var addrBook = appCtxt.getById(id);
	var nId = addrBook ? addrBook.nId : ZmOrganizer.normalizeId(id);
	var isTrash = (nId == ZmFolder.ID_TRASH);

	var isDLs = (nId == ZmFolder.ID_DLS);

	this.setVisibleIfExists(parent, ZmOperation.EMPTY_FOLDER, nId == ZmFolder.ID_TRASH);

	if (isTrash) {
		parent.enableAll(false);
		parent.enable(ZmOperation.DELETE_WITHOUT_SHORTCUT, false);
		var hasContent = ((addrBook.numTotal > 0) || (addrBook.children && (addrBook.children.size() > 0)));
		parent.enable(ZmOperation.EMPTY_FOLDER,hasContent);
		parent.getOp(ZmOperation.EMPTY_FOLDER).setText(ZmMsg.emptyTrash);
	}
	else if (isDLs) {
		parent.enableAll(false);
	}
	else {
		parent.enableAll(true);        
		if (addrBook) {

			parent.enable([ZmOperation.NEW_ADDRBOOK], !addrBook.isReadOnly());

			if (addrBook.isSystem() || appCtxt.isExternalAccount()) {
				parent.enable([ZmOperation.DELETE_WITHOUT_SHORTCUT, ZmOperation.RENAME_FOLDER], false);
			} else if (addrBook.link) {
				parent.enable([ZmOperation.SHARE_ADDRBOOK], !addrBook.link || addrBook.isAdmin());
			}
			if (appCtxt.isOffline) {
				var acct = addrBook.getAccount();
				parent.enable([ZmOperation.SHARE_ADDRBOOK], !acct.isMain && acct.isZimbraAccount);
			}
		}
	}

	if (addrBook) {
		parent.enable(ZmOperation.EXPAND_ALL, (addrBook.size() > 0));
	}

	var op = parent.getOp(ZmOperation.DELETE_WITHOUT_SHORTCUT);
	if (op) {
		op.setText(deleteText);
	}
	this._enableRecoverDeleted(parent, isTrash);

	// we always enable sharing in case we're in multi-mbox mode
	this._resetButtonPerSetting(parent, ZmOperation.SHARE_ADDRBOOK, appCtxt.get(ZmSetting.SHARING_ENABLED));
};

/**
 * override to take care of not allowing dropping DLs do folders
 * @param ev
 * @private
 */
ZmAddrBookTreeController.prototype._dropListener =
function(ev) {
	var items = AjxUtil.toArray(ev.srcData.data);
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (!item.isZmContact) {
			continue;
		}
		if (item.isDistributionList()) {
			ev.doIt = false;
			return;
		}
	}
	// perform default action
	ZmFolderTreeController.prototype._dropListener.apply(this, arguments);
};


// Protected methods

/**
 * @private
 */
ZmAddrBookTreeController.prototype._getAllowedSubTypes =
function() {
	var types = {};
	types[ZmOrganizer.SEARCH] = true;
	types[this.type] = true;
	return types;
};

ZmAddrBookTreeController.prototype._getSearchTypes =
function(ev) {
	return [ZmItem.CONTACT];
};

/**
 * Returns a list of desired header action menu operations.
 * 
 * @private
 */
ZmAddrBookTreeController.prototype._getHeaderActionMenuOps =
function() {
	var ops = null;
	if (appCtxt.get(ZmSetting.NEW_ADDR_BOOK_ENABLED)) {
		ops = [ZmOperation.NEW_ADDRBOOK, ZmOperation.FIND_SHARES];
	}
	return ops;
};

/**
 * Returns a list of desired action menu operations.
 * 
 * @private
 */
ZmAddrBookTreeController.prototype._getActionMenuOps = function() {

	var ops = [];
	if (appCtxt.get(ZmSetting.NEW_ADDR_BOOK_ENABLED)) {
		ops.push(ZmOperation.NEW_ADDRBOOK);
	}
	ops.push(
		ZmOperation.EMPTY_FOLDER,
		ZmOperation.RECOVER_DELETED_ITEMS,
		ZmOperation.SHARE_ADDRBOOK,
		ZmOperation.DELETE_WITHOUT_SHORTCUT,
		ZmOperation.RENAME_FOLDER,
		ZmOperation.EDIT_PROPS,
		ZmOperation.EXPAND_ALL
	);

	return ops;
};

/**
 * Returns a title for moving a folder.
 * 
 * @private
 */
ZmAddrBookTreeController.prototype._getMoveDialogTitle =
function() {
	return AjxMessageFormat.format(ZmMsg.moveAddrBook, this._pendingActionData.name);
};

/**
 * Returns the dialog for organizer creation.
 * 
 * @private
 */
ZmAddrBookTreeController.prototype._getNewDialog =
function() {
	return appCtxt.getNewAddrBookDialog();
};


// Listeners

/**
 * @private
 */
ZmAddrBookTreeController.prototype._shareAddrBookListener = 
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

ZmAddrBookTreeController.dlFolderClicked =
function() {
	var request = {
		_jsns: "urn:zimbraAccount",
		"ownerOf": 1,
		attrs: "zimbraDistributionListUnsubscriptionPolicy,zimbraDistributionListSubscriptionPolicy,zimbraHideInGal"
	};

	var jsonObj = {GetAccountDistributionListsRequest: request};
	var respCallback = ZmAddrBookTreeController._handleAccountDistributionListResponse;
	appCtxt.getAppController().sendRequest({jsonObj: jsonObj, asyncMode: true, callback: respCallback});
};

/**
 * Called when a left click occurs (by the tree view listener). The folder that
 * was clicked may be a search, since those can appear in the folder tree. The
 * appropriate search will be performed.
 *
 * @param {ZmOrganizer}	folder		the folder or search that was clicked
 * 
 * @private
 */
ZmAddrBookTreeController.prototype._itemClicked =
function(folder) {
	if (folder.id == ZmFolder.ID_DLS) {
		ZmAddrBookTreeController.dlFolderClicked();
	}
	else if (folder.type == ZmOrganizer.SEARCH) {
		// if the clicked item is a search (within the folder tree), hand
		// it off to the search tree controller
		var stc = this._opc.getTreeController(ZmOrganizer.SEARCH);
		stc._itemClicked(folder);
	}
	else {
		var capp = appCtxt.getApp(ZmApp.CONTACTS);
		capp.currentSearch = null;
		var query = capp.currentQuery = folder.createQuery();
		var sc = appCtxt.getSearchController();
		sc.setDefaultSearchType(ZmItem.CONTACT);
		var acct = folder.getAccount();
		var params = {
			query: query,
			searchFor: ZmItem.CONTACT,
			fetch: true,
			sortBy: ZmSearch.NAME_ASC,
			callback: new AjxCallback(this, this._handleSearchResponse, [folder]),
			accountName: (acct && acct.name)
		};
		sc.search(params);

		if (folder.id != ZmFolder.ID_TRASH) {
			var clc = AjxDispatcher.run("GetContactListController");
			var view = clc.getCurrentView();
			if (view) {
				view.getAlphabetBar().reset();
			}
		}
	}
};

/**
 * @private
 */
ZmAddrBookTreeController.prototype._handleSearchResponse =
function(folder, result) {
	// bug fix #19307 - Trash is special when in Contacts app since it
	// is a FOLDER type in ADDRBOOK tree. So reset selection if clicked
	if (folder.nId == ZmFolder.ID_TRASH) {
		this._treeView[this._app.getOverviewId()].setSelected(folder, true);
	}
};

/**
 * @private
 */
ZmAddrBookTreeController._handleAccountDistributionListResponse =
function(result) {

	var contactList = new ZmContactList(null, true, ZmItem.CONTACT);
	var dls = result._data.GetAccountDistributionListsResponse.dl;
	if (dls) {
		for (var i = 0; i < dls.length; i++) {
			var dl = dls[i];
			var attrs = dl._attrs;
			attrs.email = dl.name; // in this case the email comes in the "name" property.
			attrs.type = "group";
			
			attrs[ZmContact.F_dlDisplayName] = dl.d || dl.name;
			contactList.addFromDom(dl);
		}
	}
	var clc = AjxDispatcher.run("GetContactListController");
	clc.show(contactList, true, ZmFolder.ID_DLS);
};
}

if (AjxPackage.define("zimbraMail.abook.view.ZmContactSearch")) {
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
 * This file contains the contact search class.
 *
 */

/**
 * Creates a component that lets the user search for and select one or more contacts.
 * @constructor
 * @class
 * This class creates and manages a component that lets the user search for and
 * select one or more contacts. It is intended to be plugged into a larger
 * component such as a dialog or a tab view.
 *
 * @author Conrad Damon
 *
 * @param {hash}			params				hash of parameters:
 * @param {DwtComposite}		parent			the containing widget
 * @param {string}				className		the CSS class
 * @param {hash}				options			hash of options:
 * @param {string}					preamble	explanatory text
 * @param {array}					searchFor	list of ZmContactsApp.SEARCHFOR_*
 * @param {boolean}					showEmails	if true, show each email in results
 *
 * @extends		DwtComposite
 *
 * TODO: scroll-based paging
 * TODO: adapt for contact picker and attachcontacts zimlet
 */
ZmContactSearch = function(params) {

	params = params || {};
	params.parent = params.parent || appCtxt.getShell();
	params.className = params.className || "ZmContactSearch";
	DwtComposite.call(this, params);

	this._options = params.options;
	this._initialized = false;
	this._searchErrorCallback = new AjxCallback(this, this._handleErrorSearch);
	if (!ZmContactSearch._controller) {
		ZmContactSearch._controller = new ZmContactSearchController();
	}
	this._controller = ZmContactSearch._controller;
	this._initialize();
};

ZmContactSearch.prototype = new DwtComposite;
ZmContactSearch.prototype.constructor = ZmContactSearch;

ZmContactSearch.SEARCHFOR_SETTING = {};
ZmContactSearch.SEARCHFOR_SETTING[ZmContactsApp.SEARCHFOR_CONTACTS]	= ZmSetting.CONTACTS_ENABLED;
ZmContactSearch.SEARCHFOR_SETTING[ZmContactsApp.SEARCHFOR_GAL]		= ZmSetting.GAL_ENABLED;
ZmContactSearch.SEARCHFOR_SETTING[ZmContactsApp.SEARCHFOR_PAS]		= ZmSetting.SHARING_ENABLED;
ZmContactSearch.SEARCHFOR_SETTING[ZmContactsApp.SEARCHFOR_FOLDERS]	= ZmSetting.CONTACTS_ENABLED;

// Public methods

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmContactSearch.prototype.toString =
function() {
	return "ZmContactSearch";
};

/**
 * Performs a search.
 *
 */
ZmContactSearch.prototype.search =
function(ascending, firstTime, lastId, lastSortVal) {

	if (!AjxUtil.isSpecified(ascending)) {
		ascending = true;
	}

	var query = this._searchCleared ? AjxStringUtil.trim(this._searchField.value) : "";

	var queryHint;
	if (this._selectDiv) {
		var searchFor = this._selectDiv.getValue();
		this._contactSource = (searchFor == ZmContactsApp.SEARCHFOR_CONTACTS || searchFor == ZmContactsApp.SEARCHFOR_PAS)
			? ZmItem.CONTACT
			: ZmId.SEARCH_GAL;

		if (searchFor == ZmContactsApp.SEARCHFOR_PAS) {
			queryHint = ZmSearchController.generateQueryForShares(ZmId.ITEM_CONTACT) || "is:local";
		} else if (searchFor == ZmContactsApp.SEARCHFOR_CONTACTS) {
			queryHint = "is:local";
		} else if (searchFor == ZmContactsApp.SEARCHFOR_GAL) {
            ascending = true;
        }
	} else {
		this._contactSource = appCtxt.get(ZmSetting.CONTACTS_ENABLED, null, this._account)
			? ZmItem.CONTACT
			: ZmId.SEARCH_GAL;

		if (this._contactSource == ZmItem.CONTACT) {
			queryHint = "is:local";
		}
	}

	this._searchIcon.className = "DwtWait16Icon";

	// XXX: line below doesn't have intended effect (turn off column sorting for GAL search)
//	this._chooser.sourceListView.sortingEnabled = (this._contactSource == ZmItem.CONTACT);

	var params = {
		obj: this,
		ascending: ascending,
		query: query,
		queryHint: queryHint,
		offset: this._list.size(),
		lastId: lastId,
		lastSortVal: lastSortVal,
		respCallback: (new AjxCallback(this, this._handleResponseSearch, [firstTime])),
		errorCallback: this._searchErrorCallback,
		accountName: (this._account && this._account.name)
	};
	ZmContactsHelper.search(params);
};

ZmContactSearch.prototype._handleResponseSearch =
function(firstTime, result) {

	this._controller.show(result.getResponse(), firstTime);
	var list = this._controller._list;
	if (list) {
		this._list = list.getVector();
		if (list && list.size() == 1) {
			this._listView.setSelection(list.get(0));
		}
	}

	this._searchIcon.className = "ImgSearch";
	this._searchButton.setEnabled(true);
};

ZmContactSearch.prototype.getContacts =
function() {
	return this._listView.getSelection();
};

ZmContactSearch.prototype.setAccount =
function(account) {
	if (this._account != account) {
		this._account = account;
		this._resetSelectDiv();
	}
};

ZmContactSearch.prototype.reset =
function(query, account) {

	this._offset = 0;
	if (this._list) {
		this._list.removeAll();
	}
	this._list = new AjxVector();

	// reset search field
	this._searchField.disabled = false;
	this._searchField.focus();
	query = query || this._searchField.value;
	if (query) {
		this._searchField.className = "";
		this._searchField.value = query;
		this._searchCleared = true;
	} else {
		this._searchField.className = "searchFieldHint";
		this._searchField.value = ZmMsg.contactPickerHint;
		this._searchCleared = false;
	}

	this.setAccount(account || this._account);
};


// Private and protected methods

ZmContactSearch.prototype._initialize =
function() {

	this._searchForHash = this._options.searchFor ? AjxUtil.arrayAsHash(this._options.searchFor) : {};

	this.getHtmlElement().innerHTML = this._contentHtml();

	if (this._options.preamble) {
		var div = document.getElementById(this._htmlElId + "_preamble");
		div.innerHTML = this._options.preamble;
	}

	this._searchIcon = document.getElementById(this._htmlElId + "_searchIcon");

	// add search button
	this._searchButton = new DwtButton({parent:this, parentElement:(this._htmlElId + "_searchButton")});
	this._searchButton.setText(ZmMsg.search);
	this._searchButton.addSelectionListener(new AjxListener(this, this._searchButtonListener));

	// add select menu, if needed
	var selectCellId = this._htmlElId + "_folders";
	var selectCell = document.getElementById(selectCellId);
	if (selectCell) {
		this._selectDiv = new DwtSelect({parent:this, parentElement:selectCellId});
		this._resetSelectDiv();
		this._selectDiv.addChangeListener(new AjxListener(this, this._searchTypeListener));
	}

	this._searchField = document.getElementById(this._htmlElId + "_searchField");
	Dwt.setHandler(this._searchField, DwtEvent.ONKEYUP, ZmContactSearch._keyPressHdlr);
	Dwt.setHandler(this._searchField, DwtEvent.ONCLICK, ZmContactSearch._onclickHdlr);
	this._keyPressCallback = new AjxCallback(this, this._searchButtonListener);

	var listDiv = document.getElementById(this._htmlElId + "_results");
	if (listDiv) {
		params = {parent:this, parentElement:listDiv, options:this._options};
		this._listView = this._controller._listView = new ZmContactSearchListView(params);
	}

	this._initialized = true;
};

/**
 * @private
 */
ZmContactSearch.prototype._contentHtml =
function() {

	var showSelect;
	if (appCtxt.multiAccounts) {
		var list = appCtxt.accountList.visibleAccounts;
		for (var i = 0; i < list.length; i++) {
			this._setSearchFor(list[i]);
			if (this._searchFor.length > 1) {
				showSelect = true;
				break;
			}
		}
	} else {
		this._setSearchFor();
		showSelect = (this._searchFor.length > 1);
	}

	var subs = {
		id: this._htmlElId,
		showSelect: showSelect
	};

	return (AjxTemplate.expand("abook.Contacts#ZmContactSearch", subs));
};

ZmContactSearch.prototype._setSearchFor =
function(account) {

	account = account || this._account;
	this._searchFor = [];
	if (this._options.searchFor && this._options.searchFor.length) {
		for (var i = 0; i < this._options.searchFor.length; i++) {
			var searchFor = this._options.searchFor[i];
			if (appCtxt.get(ZmContactSearch.SEARCHFOR_SETTING[searchFor], null, account)) {
				this._searchFor.push(searchFor);
			}
		}
	}
	this._searchForHash = AjxUtil.arrayAsHash(this._searchFor);
};

/**
 * @private
 */
ZmContactSearch.prototype._resetSelectDiv =
function() {

	if (!this._selectDiv) { return; }
	
	this._selectDiv.clearOptions();
	this._setSearchFor();

	var sfh = this._searchForHash;
	if (sfh[ZmContactsApp.SEARCHFOR_CONTACTS]) {
		this._selectDiv.addOption(ZmMsg.contacts, false, ZmContactsApp.SEARCHFOR_CONTACTS);

		if (sfh[ZmContactsApp.SEARCHFOR_PAS]) {
			this._selectDiv.addOption(ZmMsg.searchPersonalSharedContacts, false, ZmContactsApp.SEARCHFOR_PAS);
		}
	}

	if (sfh[ZmContactsApp.SEARCHFOR_GAL]) {
		this._selectDiv.addOption(ZmMsg.GAL, true, ZmContactsApp.SEARCHFOR_GAL);
	}

	if (!appCtxt.get(ZmSetting.INITIALLY_SEARCH_GAL, null, this._account) ||
		!appCtxt.get(ZmSetting.GAL_ENABLED, null, this._account))
	{
		this._selectDiv.setSelectedValue(ZmContactsApp.SEARCHFOR_CONTACTS);
	}

	// TODO
//	if (sfh[ZmContactsApp.SEARCHFOR_FOLDERS]) {
//	}
};

/**
 * @private
 */
ZmContactSearch.prototype._searchButtonListener =
function(ev) {
	this._offset = 0;
	this._list.removeAll();
	this.search();
};

/**
 * @private
 */
ZmContactSearch._keyPressHdlr =
function(ev) {
	var stb = DwtControl.getTargetControl(ev);
	var charCode = DwtKeyEvent.getCharCode(ev);
	if (!stb._searchCleared) {
		stb._searchField.className = stb._searchField.value = "";
		stb._searchCleared = true;
	}
	if (stb._keyPressCallback && (charCode == 13 || charCode == 3)) {
		stb._keyPressCallback.run();
		return false;
	}
	return true;
};

/**
 * @private
 */
ZmContactSearch._onclickHdlr =
function(ev) {
	var stb = DwtControl.getTargetControl(ev);
	if (!stb._searchCleared) {
		stb._searchField.className = stb._searchField.value = "";
		stb._searchCleared = true;
	}
};


// ZmContactSearchController

ZmContactSearchController = function(params) {

	ZmContactListController.call(this, appCtxt.getShell(), appCtxt.getApp(ZmApp.CONTACTS));
};

ZmContactSearchController.prototype = new ZmContactListController;
ZmContactSearchController.prototype.constructor = ZmContactSearchController;

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmContactSearchController.prototype.toString =
function() {
	return "ZmContactSearchController";
};

ZmContactSearchController.prototype.show =
function(searchResult, firstTime) {

	var more = searchResult.getAttribute("more");
	var list = this._list = searchResult.getResults(ZmItem.CONTACT);
	if (list.size() == 0 && firstTime) {
		this._listView._setNoResultsHtml();
	}

	more = more || (this._offset + ZmContactsApp.SEARCHFOR_MAX) < this._list.size();
	this._listView.set(list);
};

// ZmContactSearchListView

ZmContactSearchListView = function(params) {

	params = params || {};
	params.posStyle = Dwt.STATIC_STYLE;
	params.className = params.className || "ZmContactSearchListView";
	params.headerList = this._getHeaderList();
	ZmContactsBaseView.call(this, params);
	this._options = params.options;
}

ZmContactSearchListView.prototype = new ZmContactsBaseView;
ZmContactSearchListView.prototype.constructor = ZmContactSearchListView;

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmContactSearchListView.prototype.toString =
function() {
	return "ZmContactSearchListView";
};

ZmContactSearchListView.prototype._getHeaderList =
function() {
	var headerList = [];
	headerList.push(new DwtListHeaderItem({field:ZmItem.F_TYPE, width:ZmMsg.COLUMN_WIDTH_FOLDER_CN}));
	headerList.push(new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg._name, width:ZmMsg.COLUMN_WIDTH_NAME_CN}));
	headerList.push(new DwtListHeaderItem({field:ZmItem.F_EMAIL, text:ZmMsg.email}));

	return headerList;
};

/**
 * @private
 */
ZmContactSearchListView.prototype._getCellContents =
function(htmlArr, idx, contact, field, colIdx, params) {
	if (field == ZmItem.F_TYPE) {
		htmlArr[idx++] = AjxImg.getImageHtml(contact.getIcon());
	} else if (field == ZmItem.F_NAME) {
		htmlArr[idx++] = AjxStringUtil.htmlEncode(contact.getFileAs());
	} else if (field == ZmItem.F_EMAIL) {
		htmlArr[idx++] = AjxStringUtil.htmlEncode(contact.getEmail());
	}
	return idx;
};
}
}
