if (AjxPackage.define("ImportExport")) {
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

if (AjxPackage.define("zimbraMail.share.controller.ZmImportExportController")) {
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

/**
 * @overview
 * This file defines the import/export controller.
 *
 */

/**
 * Creates an import/export controller.
 * @class
 * This class represents an import/export controller.
 * 
 * @extends		ZmController
 */
ZmImportExportController = function() {
	ZmController.call(this, null);
};

ZmImportExportController.prototype = new ZmController;
ZmImportExportController.prototype.constructor = ZmImportExportController;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmImportExportController.prototype.toString = function() {
	return "ZmImportExportController";
};

//
// Constants
//

ZmImportExportController.IMPORT_TIMEOUT = 300;

/**
 * Defines the "CSV" type.
 * @type {String}
 */
ZmImportExportController.TYPE_CSV = "csv";
/**
 * Defines the "ICS" type.
 * @type {String}
 */
ZmImportExportController.TYPE_ICS = "ics";
/**
 * Defines the "TGZ" type.
 * @type {String}
 */
ZmImportExportController.TYPE_TGZ = "tgz";

/**
 * Defines the default type.
 * 
 * @see		ZmImportExportController.TYPE_TGZ
 */
ZmImportExportController.TYPE_DEFAULT = ZmImportExportController.TYPE_TGZ;

/**
 * Defines the sub-type default array
 */
ZmImportExportController.SUBTYPE_DEFAULT = {};
ZmImportExportController.SUBTYPE_DEFAULT[ZmImportExportController.TYPE_TGZ] = ZmImportExportController.SUBTYPE_ZIMBRA_TGZ;
ZmImportExportController.SUBTYPE_DEFAULT[ZmImportExportController.TYPE_CSV] = ZmImportExportController.SUBTYPE_ZIMBRA_CSV;
ZmImportExportController.SUBTYPE_DEFAULT[ZmImportExportController.TYPE_ICS] = ZmImportExportController.SUBTYPE_ZIMBRA_ICS;

ZmImportExportController.TYPE_EXTS = {};
ZmImportExportController.TYPE_EXTS[ZmImportExportController.TYPE_CSV] = [ "csv", "vcf" ];
ZmImportExportController.TYPE_EXTS[ZmImportExportController.TYPE_ICS] = [ "ics" ];
ZmImportExportController.TYPE_EXTS[ZmImportExportController.TYPE_TGZ] = [ "tgz", "zip", "tar" ];

ZmImportExportController.EXTS_TYPE = {};
AjxUtil.foreach(ZmImportExportController.TYPE_EXTS, function(exts, p) {
	for (var i = 0; i < exts.length; i++) {
		ZmImportExportController.EXTS_TYPE[exts[i]] = p;
	}
});

ZmImportExportController.__FAULT_ARGS_MAPPING = {
	"formatter.INVALID_FORMAT": [ "filename" ],
	"formatter.INVALID_TYPE": [ "view", "path" ],
	"formatter.MISMATCHED_META": [ "path" ],
	"formatter.MISMATCHED_SIZE": [ "path" ],
	"formatter.MISMATCHED_TYPE": [ "path" ],
	"formatter.MISSING_BLOB": [ "path" ],
	"formatter.MISSING_META": [ "path" ],
	"formatter.MISSING_VCARD_FIELDS": [ "path" ],
	"formatter.UNKNOWN_ERROR": [ "path", "message" ],
	"mail.EXPORT_PERIOD_TOO_LONG": [ "limit" ]
};


ZmImportExportController.CSRF_TOKEN_HIDDEN_INPUT_ID = "ZmImportExportCsrfToken";
//
// Public methods
//

/**
 * Imports user data as specified in the <code>params</code> object.
 * 
 * @param {Hash}	params			a hash of parameters
 * @param {Element}	params.form		the form containing file input field
 * @param {String}	params.folderId	the folder id for import. If not specified, assumes import to root folder.
 * @param {String}	params.type		the type (defaults to {@link TYPE_TGZ})
 * @param {String}	params.subType	the sub-type (defaults to <code>SUBTYPE_DEFAULT[type]</code>)
 * @param {String}	params.resolve	resolve duplicates: "" (ignore), "modify", "replace", "reset" (defaults to ignore).
 * @param {String}	params.views	a comma-separated list of views
 * @param {AjxCallback}	callback	the callback for success
 * @param {AjxCallback}	errorCallback	the callback for errors
 *        
 * @return	{Boolean}	<code>true</code> if the import is successful
 */
ZmImportExportController.prototype.importData =
function(params) {
	// error checking
	params = params || {};
	var folderId = params.folderId || -1;
	if (folderId == -1) {
		var params = {
			msg:	ZmMsg.importErrorMissingFolder,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
		return false;
	}

	params.filename = params.form && params.form.elements["file"].value;
	if (!params.filename) {
		var params = {
			msg:	ZmMsg.importErrorMissingFile,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
		return false;
	}

	params.ext = params.filename.replace(/^.*\./,"").toLowerCase();
    if (!ZmImportExportController.EXTS_TYPE[params.ext]) {
        var params = {
            msg:	AjxMessageFormat.format(ZmMsg.importErrorTypeNotSupported, AjxStringUtil.htmlEncode(params.ext)),
            level:	ZmStatusView.LEVEL_CRITICAL
        };
        appCtxt.setStatusMsg(params);
        return false;
    }
	params.defaultType = params.type || ZmImportExportController.EXTS_TYPE[params.ext] || ZmImportExportController.TYPE_DEFAULT;
	var isZimbra = ZmImportExportController.EXTS_TYPE[params.defaultType] == ZmImportExportController.TYPE_TGZ;
	var folder = appCtxt.getById(folderId);
	if (!isZimbra && folder && folder.nId == ZmOrganizer.ID_ROOT) {
		var params = {
			msg:	ZmMsg.importErrorRootNotAllowed,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
		return false;
	}

	if (params.resolve == "reset") {
		var dialog = appCtxt.getOkCancelMsgDialog();
		dialog.registerCallback(DwtDialog.OK_BUTTON, this._confirmImportReset, this, [params]);
		dialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._cancelImportReset, this);
		var msg = ZmMsg.importResetWarning;
		var style = DwtMessageDialog.WARNING_STYLE;
		dialog.setMessage(msg, style);
		dialog.popup();
		return false;
	}

	// import
	return this._doImportData(params);
};

/**
 * Exports user data as specified in the <code>params</code> object.
 *
 * @param {Hash}	params		a hash of parameters
 * @param {String}	params.folderId		the folder id for export. If not specified, all folders want to be exported.
 * @param {String}	params.type			the type (defaults to {@link TYPE_TGZ})
 * @param {String}	params.subType		the sub-type (defaults to <code>SUBTYPE_DEFAULT[type]</code>)
 * @param {String}	params.views		a comma-separated list of views
 * @param {String}	params.filename		the filename for exported file
 * @param {String}	params.searchFilter	the search filter
 * @param {Boolean} params.skipMeta		if <code>true</code>, skip export of meta-data
 * @param {AjxCallback}	callback	the callback for success
 * @param {AjxCallback}	errorCallback	the callback for errors
 *        
 * @return	{Boolean}	<code>true</code> if the export is successful
 */
ZmImportExportController.prototype.exportData = function(params) {
	// error checking
	params = params || {};
	var folderId = params.folderId || -1;
	if (folderId == -1) {
		var params = {
			msg:	ZmMsg.exportErrorMissingFolder,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
		return false;
	}

	var type = params.type = params.type || ZmImportExportController.TYPE_DEFAULT;
	var isZimbra = ZmImportExportController.EXTS_TYPE[type] == ZmImportExportController.TYPE_TGZ;
	var folder = appCtxt.getById(folderId);
	if (!isZimbra && folder && folder.nId == ZmOrganizer.ID_ROOT) {
		var params = {
			msg:	ZmMsg.exportErrorRootNotAllowed,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
		return false;
	}

	// export
	return this._doExportData(params);
};

//
// Protected methods
//

/**
 * @private
 */
ZmImportExportController.prototype._doImportData =
function(params) {
	if (params.folderId == -1 && params.defaultType != ZmImportExportController.TYPE_TGZ) {
		return this._doImportSelectFolder(params);
	}
	return this._doImport(params);
};

/**
 * @private
 */
ZmImportExportController.prototype._doImportSelectFolder =
function(params) {
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.reset();
	dialog.setTitle(ZmMsg._import);
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._doImportSelectFolderDone, this, [params]);

	var overviewId = dialog.getOverviewId(ZmSetting.IMPORT);
	var omit = {};
	omit[ZmFolder.ID_TRASH] = true;
	var type = params.defaultType;
	if (type == ZmImportExportController.TYPE_CSV) {
		AjxDispatcher.require(["ContactsCore", "Contacts"]);
		var noNew = !appCtxt.get(ZmSetting.NEW_ADDR_BOOK_ENABLED);
		dialog.popup({
			treeIds:		[ZmOrganizer.ADDRBOOK],
			title:			ZmMsg.chooseAddrBook,
			overviewId:		overviewId,
			description:	ZmMsg.chooseAddrBookToImport,
			skipReadOnly:	true,
			hideNewButton:	noNew,
			omit:			omit,
			appName:		ZmApp.CONTACTS
		});
	}
	else if (type == ZmImportExportController.TYPE_ICS) {
		AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);
		dialog.popup({
			treeIds: [ZmOrganizer.CALENDAR],
			title: ZmMsg.chooseCalendar,
			overviewId: overviewId,
			description: ZmMsg.chooseCalendarToImport,
			skipReadOnly: true,
			omit:omit,
			appName:ZmApp.CALENDAR
		});
	}
};

/**
 * @private
 */
ZmImportExportController.prototype._doImportSelectFolderDone =
function(params, organizer) {
	params.folderId = organizer.id;
	this._doImport(params);
};

/**
 * @private
 */
ZmImportExportController.prototype._doImport =
function(params) {
	// create custom callback function for this import request
	var funcName = "ZmImportExportController__callback__"+Dwt.getNextId("import");
	window[funcName] = AjxCallback.simpleClosure(this._handleImportResponse, this, funcName, params);

	// generate request url
	var folder = params.folderId && appCtxt.getById(params.folderId);
	if (folder && folder.nId == ZmOrganizer.ID_ROOT) folder = null;
	var path = folder ? folder.getPath(null, null, null, true, true) : "";
	var type = params.type || params.ext;
	var url = [
		"/home/",
		encodeURIComponent(appCtxt.get(ZmSetting.USERNAME)),
		"/",
		encodeURIComponent(path),
		"?",
		type ? "fmt="+encodeURIComponent(type) : "",
		params.views ? "&types="+encodeURIComponent(params.views) : "",
		params.resolve ? "&resolve="+encodeURIComponent(params.resolve) : "",
		"&callback="+funcName,
		"&charset="+appCtxt.getCharset()
	].join("");

	// initialize form
	var form = params.form;
	form.action = url;
	form.method = "POST";
	form.enctype = "multipart/form-data";

	this._setCsrfTokenInput(form);

	// destination iframe
	var onload = null;
	var onerror = AjxCallback.simpleClosure(this._importError, this, params.errorCallback);
	params.iframe = ZmImportExportController.__createIframe(form, onload, onerror);

	// import
	form.submit();
	return true;
};

/**
 * lazily generate the hidden csrf token input field for the form.
 */
ZmImportExportController.prototype._setCsrfTokenInput =
function(form) {
	var csrfTokenInput = document.getElementById(ZmImportExportController.CSRF_TOKEN_HIDDEN_INPUT_ID);
	if (csrfTokenInput) {
		return;
	}
	csrfTokenInput = document.createElement("input");
	csrfTokenInput.type  = "hidden";
	csrfTokenInput.name  = "csrfToken";
	csrfTokenInput.id    = ZmImportExportController.CSRF_TOKEN_HIDDEN_INPUT_ID;
	csrfTokenInput.value = window.csrfToken;

	var firstChildEl = form.firstChild;
	form.insertBefore(csrfTokenInput, firstChildEl);
};

/**
 * @private
 */
ZmImportExportController.prototype._handleImportResponse =
function(funcName, params, type, fault1 /* , ... , faultN */) {
	// gather error/warning messages
	var messages = [];
	if (fault1) {
		for (var j = 3; j < arguments.length; j++) {
			var fault = arguments[j];
			var code = fault.Detail.Error.Code;
			var message = fault.Reason.Text;
			var args = ZmImportExportController.__faultArgs(fault.Detail.Error.a);
			if (code == "formatter.UNKNOWN_ERROR") {
				args.path = args.path || ["(",ZmMsg.unknown,")"].join("");
				args.message = message;
			}
			var mappings = ZmImportExportController.__FAULT_ARGS_MAPPING[code];
			var formatArgs = new Array(mappings ? mappings.length : 0);
			for (var i = 0; i < formatArgs.length; i++) {
				formatArgs[i] = args[mappings[i]];
			}
			var errorMsg = ZMsg[code] ? AjxMessageFormat.format(ZMsg[code], formatArgs) : "";
			// be a little more verbose if there was a failure
			if (type == "fail") {
				errorMsg = message ? errorMsg + '<br><br>' + AjxStringUtil.htmlEncode(message) : errorMsg;
			}
			else if (type == "warn") {
				errorMsg = errorMsg || message;
			}
			messages.push(errorMsg);
		}
	}
	// show success or failure
	if (type == "fail") {
		this._importError(params.errorCallback, messages[0]);
	}
	else if (type == "warn") {
		this._importWarnings(params.callback, messages);
	}
	else {
		this._importSuccess(params.callback);
		appCtxt.getAppController().sendNoOp(); //send no-op to refresh
	}

	// cleanup
	try {
		delete window[funcName]; // IE fails on this one (bug #57952)
	} catch (e) {
		if (window[funcName]) {
			window[funcName] = undefined;
		}
	}
	var iframe = params.iframe;
	setTimeout(function() { // Right now we are actually in the iframe's onload handler, so we defer killing the iframe until we're out of it
		iframe.parentNode.removeChild(iframe);
	}, 0);
};

/**
 * @private
 */
ZmImportExportController.__faultArgs =
function(array) {
	var args = {};
	for (var i = 0; array && i < array.length; i++) {
		args[array[i].n] = array[i]._content;
	}
	return args;
};

/**
 * @private
 */
ZmImportExportController.prototype._confirmImportReset =
function(params) {
	this._cancelImportReset();
	this._doImportData(params);
};

/**
 * @private
 */
ZmImportExportController.prototype._cancelImportReset =
function() {
	var dialog = appCtxt.getOkCancelMsgDialog();
	dialog.reset();
	dialog.popdown();
};

/**
 * @private
 */
ZmImportExportController.prototype._doExportData =
function(params) {
	// create custom error callback function for this export request
	var funcName = "exportErrorCallback__" + Dwt.getNextId("export");
	ZmImportExportController[funcName] = this._handleExportErrorResponse.bind(this, funcName, params);

	var type = params.type;
	var isTGZ = type == ZmImportExportController.TYPE_TGZ;
	var isCSV = type == ZmImportExportController.TYPE_CSV;
	var subType = params.subType || ZmImportExportController.SUBTYPE_DEFAULT[type];

	var folder = params.folderId && appCtxt.getById(params.folderId);
	if (folder && folder.nId == ZmOrganizer.ID_ROOT) folder = null;
	var path = folder ? folder.getPath(null, null, null, true, true) : "";

	// generate request URL
	var url = [
		"/home/",
		encodeURIComponent(appCtxt.get(ZmSetting.USERNAME)),
		"/",
		encodeURIComponent(path)
	].join("");

	var formParams = { "fmt" : type };
	if (isCSV) {
        formParams[type+"fmt"] = subType;
    }
	var startDate = params.start ? AjxDateUtil.simpleParseDateStr(params.start) : null;
	var endDate = params.end ? AjxDateUtil.simpleParseDateStr(params.end) : null;
	if (isTGZ && params.views) { formParams["types"] = params.views; }
    if (type == ZmImportExportController.TYPE_ICS) {
        formParams["icalAttach"] = "inline";
    }
    if(startDate) {
        formParams["start"] = startDate.getTime();
    }
    if(endDate) {
        endDate = AjxDateUtil.roll(endDate, AjxDateUtil.DAY, 1);
        formParams["end"] = endDate.getTime();
    }
	if (isTGZ && params.searchFilter) { formParams["query"] = params.searchFilter; }
	if (params.skipMeta) { formParams["meta"] = "0"; }
	if (params.filename) { formParams["filename"] = params.filename; }
	formParams.emptyname = ZmMsg.exportEmptyName;
    formParams["charset"] = (subType === "windows-live-mail-csv" || subType === "thunderbird-csv") ? "UTF-8" : appCtxt.getCharset();
	formParams["callback"] = "ZmImportExportController." + funcName;

	// initialize form
	var form = ZmImportExportController.__createForm(url, formParams);

	// destination form
	var onload = null;
	var onerror = this._exportError.bind(this, params.errorCallback);
	params.iframe = ZmImportExportController.__createIframe(form, onload, onerror);
	params.form = form;
	// export
	form.submit();
};

/**
 * @private
 */
ZmImportExportController.prototype._importSuccess =
function(callback) {
	if (callback) {
		callback.run(true);
	}
	ZmImportExportController.__showMessage(ZmMsg.importSuccess, DwtMessageDialog.INFO_STYLE);
	return true;
};

/**
 * @private
 */
ZmImportExportController.prototype._importWarnings =
function(callback, messages) {
	if (callback) {
		callback.run(false);
	}
	// remove duplicates
	var msgmap = {};
	for (var i = 0; i < messages.length; i++) {
		msgmap[messages[i]] = true;
	}
	messages = AjxUtil.map(AjxUtil.keys(msgmap), AjxStringUtil.htmlEncode);
	if (messages.length > 5) {
		var count = messages.length - 5;
		messages.splice(5, count, AjxMessageFormat.format(ZmMsg.importAdditionalWarnings, [count]));
	}
	// show warnings
	var msglist = [];
	for (var i = 0; i < messages.length; i++) {
		msglist.push("<li>", messages[i]);
	}
	var msg = AjxMessageFormat.format(ZmMsg.importSuccessWithWarnings, [ messages.length, msglist.join("") ]);
	ZmImportExportController.__showMessage(msg, DwtMessageDialog.WARNING_STYLE);
	return true;
};

/**
 * @private
 */
ZmImportExportController.prototype._importError =
function(errorCallback, message) {
	if (errorCallback) {
		errorCallback.run(false);
	}
	var msg = message || ZmMsg.importFailed;
	ZmImportExportController.__showMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
	return true;
};

/**
 * @private
 */
ZmImportExportController.prototype._handleExportErrorResponse =
function(funcName, params, type, fault1 /* , ... , faultN */) {
	// gather error messages
	var messages = [];
	if (fault1) {
		for (var j = 3; j < arguments.length; j++) {
			var fault = arguments[j];
			var code = fault.Detail.Error.Code;
			var message = fault.Reason.Text;
			var args = ZmImportExportController.__faultArgs(fault.Detail.Error.a);
			if (code == "mail.EXPORT_PERIOD_NOT_SPECIFIED" || code == "mail.EXPORT_PERIOD_TOO_LONG") {
				message = "";
			} else if (code == "formatter.UNKNOWN_ERROR") {
				args.path = args.path || ["(",ZmMsg.unknown,")"].join("");
				args.message = message;
			}
			var mappings = ZmImportExportController.__FAULT_ARGS_MAPPING[code];
			var formatArgs = new Array(mappings ? mappings.length : 0);
			for (var i = 0; i < formatArgs.length; i++) {
				formatArgs[i] = args[mappings[i]];
			}
			var errorMsg = ZMsg[code] ? AjxMessageFormat.format(ZMsg[code], formatArgs) : "";
			if (type == "fail") {
				errorMsg = message ? errorMsg + '<br><br>' + AjxStringUtil.htmlEncode(message) : errorMsg;
			}
			messages.push(errorMsg);
		}
	}
	if (type == "fail") {
		this._exportError(params.errorCallback, messages[0]);
	}
	// cleanup
	try {
		delete ZmImportExportController[funcName]; // IE fails on this one (bug #57952)
	} catch (e) {
		if (ZmImportExportController[funcName]) {
			ZmImportExportController[funcName] = undefined;
		}
	}
	var iframe = params.iframe;
	var form = params.form;
	setTimeout(function() { // Right now we are actually in the iframe's onload handler, so we defer killing the iframe until we're out of it
		iframe.parentNode.removeChild(iframe);
		form.parentNode.removeChild(form);
	}, 0);
};

/**
 * @private
 */
ZmImportExportController.prototype._exportError =
function(errorCallback, message) {
	if (errorCallback) {
		errorCallback.run(false);
	}
	var msg = message || ZmMsg.exportFailed;
	ZmImportExportController.__showMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
	return true;
};

//
// Private methods
//

/**
 * @private
 */
ZmImportExportController.__showMessage =
function(msg, level) {
	var dialog = appCtxt.getErrorDialog();
	dialog.setMessage(msg, null, level);
	dialog.popup(null, true);
};

/**
 * @private
 */
ZmImportExportController.__createForm =
function(action, params, method) {
	var form = document.createElement("FORM");
	form.action = action;
	form.method = method || "GET";
	for (var name in params) {
		var value = params[name];
		if (!value) continue;
		var input = document.createElement("INPUT");
		input.type = "hidden";
		input.name = name;
		input.value = value;
		form.appendChild(input);
	}
	form.style.display = "none";
	document.body.appendChild(form);
	return form;
};

/**
 * @private
 */
ZmImportExportController.__createIframe =
function(form, onload, onerror) {
	var id = Dwt.getNextId() + "_iframe";
	var iframe;
	if (AjxEnv.isIE) {
        try {
            // NOTE: This has to be done because IE doesn't recognize the name
            //       attribute if set programmatically. And without that, the
            //       form target will cause it to return in a new window which
            //       breaks the callback.
            var html = [ "<IFRAME id='",id,"' name='",id,"'>" ].join("");
            iframe = document.createElement(html);
        } catch (e) {
            // Unless its IE9+ in non-quirks mode, then the above throws an exception
            iframe = document.createElement("IFRAME");
            iframe.name = iframe.id = id;
        }
	}
	else {
		iframe = document.createElement("IFRAME");
		iframe.name = iframe.id = id;
	}
	// NOTE: Event handlers won't be called when iframe hidden.
//	iframe.style.display = "none";
	iframe.style.position = "absolute";
	iframe.style.width = 1;
	iframe.style.height = 1;
	iframe.style.top = 10;
	iframe.style.left = -10;
	document.body.appendChild(iframe);
	form.target = iframe.name;

	iframe.onload = onload;
	iframe.onerror = onerror;

	return iframe;
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmImportExportBaseView")) {
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
 * This class represents the export base view.
 * 
 * @extends		DwtForm
 * @private
 */
ZmImportExportBaseView = function(params) {
	if (arguments.length == 0) return;
	DwtForm.call(this, params);
	this.setScrollStyle(DwtControl.VISIBLE);
	this._initSubType(ZmImportExportController.TYPE_CSV);
	this._setFolderButton(appCtxt.getById(ZmOrganizer.ID_ROOT));
};
ZmImportExportBaseView.prototype = new DwtForm;
ZmImportExportBaseView.prototype.constructor = ZmImportExportBaseView;

ZmImportExportBaseView.prototype.toString = function() {
	return "ZmImportExportBaseView";
};

//
// Data
//

ZmImportExportBaseView.prototype._folderId = -1;

//
// Public methods
//

ZmImportExportBaseView.prototype.getFolderId = function() {
	return this._folderId;
};

// DwtForm methods

ZmImportExportBaseView.prototype.update = function() {
	DwtForm.prototype.update.apply(this, arguments);

	// update type hint
	var type = this.getValue("TYPE", ZmImportExportController.TYPE_TGZ);
	this.setValue("TYPE_HINT", this.TYPE_HINTS[type]);
};

ZmImportExportBaseView.prototype.setValue = function(name, value) {
    var ovalue = this.getValue(name);
	DwtForm.prototype.setValue.apply(this, arguments);
	if (name == "TYPE" && value != ovalue) {
		var type = value;
		this._initSubType(type);
		var isTgz = type == ZmImportExportController.TYPE_TGZ;
		this.setEnabled("ADVANCED", isTgz);
		if (this.getValue("ADVANCED") && !isTgz) {
			this.setValue("ADVANCED", false);
			this.update();
		}
		var folder;
		switch (type) {
			case ZmImportExportController.TYPE_CSV: {
				// TODO: Does this work for child accounts w/ fully-qualified ids?
				folder = appCtxt.getById(ZmOrganizer.ID_ADDRBOOK);
				break;
			}
			case ZmImportExportController.TYPE_ICS: {
				folder = appCtxt.getById(ZmOrganizer.ID_CALENDAR);
				break;
			}
			case ZmImportExportController.TYPE_TGZ: {
				folder = appCtxt.getById(ZmOrganizer.ID_ROOT);
				break;
			}
		}
		this._setFolderButton(folder);
	}
};

//
// Protected methods
//

// initializers

ZmImportExportBaseView.prototype._initSubType = function(type) {
	var select = this.getControl("SUBTYPE");
	if (!select) return;

	var options = this._getSubTypeOptions(type);
	if (!options || options.length == 0) return;

	select.clearOptions();
	for (var i = 0; i < options.length; i++) {
		select.addOption(options[i]);
	}
	select.setSelectedValue(options[0].value);
};

ZmImportExportBaseView.prototype._getSubTypeOptions = function(type) {
	if (!ZmImportExportBaseView.prototype.TGZ_OPTIONS) {
		ZmImportExportBaseView.prototype.TGZ_OPTIONS = [
			{ displayValue: ZmMsg["zimbra-tgz"],			value: "zimbra-tgz" }
		];
		ZmImportExportBaseView.prototype.CSV_OPTIONS = [];
		var formats = appCtxt.get(ZmSetting.AVAILABLE_CSVFORMATS);
		for (var i = 0; i < formats.length; i++) {
			var format = formats[i];
			if (format) {
				ZmImportExportBaseView.prototype.CSV_OPTIONS.push(
					{ displayValue: ZmMsg[format] || format, value: format }
				);
			}
		}
		ZmImportExportBaseView.prototype.ICS_OPTIONS = [
			{ displayValue: ZmMsg["zimbra-ics"],			value: "zimbra-ics" }
		];
	}
	var options;
	switch (type) {
		case ZmImportExportController.TYPE_TGZ: {
			options = this.TGZ_OPTIONS;
			break;
		}
		case ZmImportExportController.TYPE_CSV: {
			options = this.CSV_OPTIONS;
			break;
		}
		case ZmImportExportController.TYPE_ICS: {
			options = this.ICS_OPTIONS;
			break;
		}
	}
	return options;
};

// handlers

ZmImportExportBaseView.prototype._type_onclick = function(radioId, groupId) {
	// enable advanced options
	var type = this.getValue("TYPE");
	this.setValue("TYPE", type);
};

ZmImportExportBaseView.prototype._folderButton_onclick = function() {
	// init state
	if (!this._handleFolderDialogOkCallback) {
		this._handleFolderDialogOkCallback = new AjxCallback(this, this._handleFolderDialogOk);
	}

	if (!this._TREES) {
		this._TREES = {};
		this._TREES[ZmImportExportController.TYPE_TGZ] = [];
        for (var org in ZmOrganizer.VIEWS) {
            if (org == ZmId.APP_VOICE){
                continue;  //Skip voice folders for import/export (Bug: 72269)
            }
            var settingId = ZmApp.SETTING[ZmOrganizer.APP2ORGANIZER_R[org]];
            if (settingId == null || appCtxt.get(settingId)) {
                this._TREES[ZmImportExportController.TYPE_TGZ].push(org);
            }
        }
		this._TREES[ZmImportExportController.TYPE_CSV] = appCtxt.get(ZmSetting.CONTACTS_ENABLED) ? [ZmOrganizer.ADDRBOOK] : [];
		this._TREES[ZmImportExportController.TYPE_ICS] = appCtxt.get(ZmSetting.CALENDAR_ENABLED) ? [ZmOrganizer.CALENDAR] : [];
	}

	// pop-up dialog
	var dialog = appCtxt.getChooseFolderDialog();
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._handleFolderDialogOkCallback);
	var type = this.getValue("TYPE") || ZmImportExportController.TYPE_TGZ;
	var acctName = appCtxt.multiAccounts ? appCtxt.getActiveAccount().name : "";
	var params = {
		treeIds:		this._TREES[type],
		overviewId:		dialog.getOverviewId([this.toString(), type, acctName].join("_")),
		description:	"",
		skipReadOnly:	true,
		omit:			{},
		forceSingle:	true,
		showDrafts:		(this instanceof ZmExportView),
		hideNewButton:	(this instanceof ZmExportView)
	};
	params.omit[ZmOrganizer.ID_TRASH] = true;
	dialog.popup(params);
};

ZmImportExportBaseView.prototype._handleFolderDialogOk = function(folder) {
	appCtxt.getChooseFolderDialog().popdown();
	this._setFolderButton(folder);
	return true;
};

ZmImportExportBaseView.prototype._setFolderButton = function(folder) {
	// NOTE: Selecting a header is the same as "all folders"
	this._folderId = folder ? folder.id : -1;
	if (folder) {
		var isRoot = folder.nId == ZmOrganizer.ID_ROOT;
		this.setLabel("FOLDER_BUTTON", isRoot ? ZmMsg.allFolders : AjxStringUtil.htmlEncode(folder.name));
	}
	else {
		this.setLabel("FOLDER_BUTTON", ZmMsg.browse);
	}
};

//
// Class
//

ZmImportExportDataTypes = function(params) {
	if (arguments.length == 0) return;
	DwtComposite.apply(this, arguments);
	this._tabGroup = new DwtTabGroup(this._htmlElId);
	this._createHtml();
};
ZmImportExportDataTypes.prototype = new DwtComposite;
ZmImportExportDataTypes.prototype.constructor = ZmImportExportDataTypes;

ZmImportExportDataTypes.prototype.toString = function() {
	return "ZmImportExportDataTypes";
};

// Data

ZmImportExportDataTypes.prototype.TEMPLATE = "data.ImportExport#DataTypes";

// Public methods

ZmImportExportDataTypes.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

ZmImportExportDataTypes.prototype.setValue = function(value) {
	// NOTE: Special case "" as *all* types -- this will include things
	//       like conversations, etc, that are implicitly added if no
	//       data types are specified for import/export.
	if (value == "") {
		var children = this.getChildren();
		for (var i = 0; i < children.length; i++) {
			var checkbox = children[i];
			checkbox.setSelected(true);
		}
		return;
	}

	// return only those types that are checked
	var types = value ? value.split(",") : [];
	var type = {};
	for (var i = 0; i < types.length; i++) {
		type[types[i]] = true;
	}
	var children = this.getChildren();
	for (var i = 0; i < children.length; i++) {
		var checkbox = children[i];
		var selected = true;
		var types = checkbox.getValue().split(",");
		for (var j = 0; j < types.length; j++) {
			if (!type[types[j]]) {
				selected = false;
				break;
			}
		}
		checkbox.setSelected(selected);
	}
};

ZmImportExportDataTypes.prototype.getValue = function() {
	// NOTE: Special case "" as *all* types. 
	if (this.isAllSelected()) {
		return "";
	}

	var types = [];
	var children = this.getChildren();
	for (var i = 0; i < children.length; i++) {
		var checkbox = children[i];
		if (checkbox.isSelected()) {
			types.push(checkbox.getValue());
		}
	}
	return types.join(",");
};

/**
 * Checks if "all" is selected.
 * 
 * @return	{Boolean}	<code>true</code> if all is selected
 */
ZmImportExportDataTypes.prototype.isAllSelected = function() {
	var children = this.getChildren();
	for (var i = 0; i < children.length; i++) {
		var checkbox = children[i];
		if (!checkbox.isSelected()) {
			return false;
		}
	}
	return true;
};

ZmImportExportDataTypes.prototype.setEnabled = function(enabled) {
	DwtComposite.prototype.setEnabled.apply(this, arguments);
	var children = this.getChildren();
	for (var i = 0; i < children.length; i++) {
		var checkbox = children[i];
		checkbox.setEnabled(enabled);
	}
};

// Protected methods

ZmImportExportDataTypes.prototype._createHtml = function(templateId) {
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, {id:this._htmlElId});
};

ZmImportExportDataTypes.prototype._createHtmlFromTemplate =
function(templateId, data) {
	// get number of checkboxes
	data.count = 0;
	for (var appName in ZmApp.ORGANIZER) {
		var orgType = ZmApp.ORGANIZER[appName];
		var views = ZmOrganizer.VIEWS[orgType];
		if (!views || views.length == 0) continue;
		data.count++;
	}

	// create cells
	DwtComposite.prototype._createHtmlFromTemplate.call(this, templateId, data);

	// create checkboxes and place in cells
	var i = 0;
	for (var appName in ZmApp.ORGANIZER) {
		var orgType = ZmApp.ORGANIZER[appName];
		var views = ZmOrganizer.VIEWS[orgType];
		if (!views || views.length == 0) continue;

		var checkbox = new ZmImportExportDataTypeCheckbox({parent:this,checked:true});
		checkbox.setImage(ZmApp.ICON[appName]);
		checkbox.setText(ZmMsg[ZmApp.NAME[appName]] || ZmApp.NAME[appName] || appName);
		// NOTE: I know it's the default join string but I prefer
		//       explicit behavior.
		checkbox.setValue(views.join(","));
		checkbox.replaceElement(data.id+"_cell_"+i);

		this._tabGroup.addMember(checkbox);

		i++;
	}
};

//
// Class
//

ZmImportExportDataTypeCheckbox = function(params) {
	if (arguments.length == 0) return;
	DwtCheckbox.apply(this, arguments);
};
ZmImportExportDataTypeCheckbox.prototype = new DwtCheckbox;
ZmImportExportDataTypeCheckbox.prototype.constructor = ZmImportExportDataTypeCheckbox;

// Data

ZmImportExportDataTypeCheckbox.prototype.TEMPLATE = "data.ImportExport#DataTypeCheckbox";

// Public methods

ZmImportExportDataTypeCheckbox.prototype.setTextPosition = function(position) {
	DwtCheckbox.prototype.setTextPosition.call(this, DwtCheckbox.TEXT_RIGHT);
};

ZmImportExportDataTypeCheckbox.prototype.setImage = function(imageName) {
	if (this._imageEl) {
		this._imageEl.className = AjxImg.getClassForImage(imageName);
	}
};

// Protected methods

ZmImportExportDataTypeCheckbox.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtCheckbox.prototype._createHtmlFromTemplate.apply(this, arguments);
	this._imageEl = document.getElementById(data.id+"_image");
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmExportView")) {
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

/**
 * This class represents the export view.
 * 
 * @extends		ZmImportExportBaseView
 * @class
 * @private
 */
ZmExportView = function(params) {
	if (arguments.length == 0) { return; }
	var today = AjxDateUtil.simpleComputeDateStr(new Date());
	var isExportPeriodLimited = (appCtxt.get(ZmSetting.EXPORT_MAX_DAYS) > 0);
	// setup form
	params.form = {
		items: [
			// default items
			{ id: "TYPE", type: "DwtRadioButtonGroup", value: ZmImportExportController.TYPE_TGZ,
				items: [
					{ id: "TYPE_TGZ", label: ZmMsg.importExportTypeTGZ, value: ZmImportExportController.TYPE_TGZ },
					{ id: "TYPE_ICS", label: ZmMsg.importExportTypeICS, value: ZmImportExportController.TYPE_ICS },
					{ id: "TYPE_CSV", label: ZmMsg.importExportTypeCSV, value: ZmImportExportController.TYPE_CSV }
				],
				onclick: this._type_onclick
			},
			{ id: "TYPE_HINT", type: "DwtText" },
			{ id: "SUBTYPE", type: "DwtSelect",
				visible: "get('TYPE') == ZmImportExportController.TYPE_CSV"
			},
			{ id: "FOLDER_BUTTON", type: "DwtButton", label: ZmMsg.browse,
				onclick: this._folderButton_onclick
			},
			{ id: "ADVANCED", type: "DwtCheckbox", label: ZmMsg.advancedSettings,
				visible: "get('TYPE') == ZmImportExportController.TYPE_TGZ",
				checked: isExportPeriodLimited,
				enabled: !isExportPeriodLimited
			},
			// advanced
			{ id: "DATA_TYPES", type: "ZmImportExportDataTypes",
				visible: "get('ADVANCED')"
			},
			{ id: "SEARCH_FILTER", type: "DwtInputField", hint: ZmMsg.searchFilterHint,
				visible: "get('ADVANCED')"
			},
			{ id: "DATE_row", visible: "get('ADVANCED')"
			},
			{ id: "startDateField", type: "DwtInputField", visible: "get('ADVANCED')", onblur: AjxCallback.simpleClosure(this._dateFieldChangeListener, this, true),
				value: isExportPeriodLimited ? today : null
			},
			{ id :"startMiniCalBtn", type: "DwtButton", visible: "get('ADVANCED')", ariaLabel: ZmMsg.startDate,
				menu: {type: "DwtCalendar", id: "startMiniCal", onselect: new AjxListener(this, this._dateCalSelectionListener, [true])}
			},
			{ id: "endDateField", type: "DwtInputField", visible: "get('ADVANCED')", onblur: AjxCallback.simpleClosure(this._dateFieldChangeListener, this, false),
				value: isExportPeriodLimited ? today : null
			},
			{ id :"endMiniCalBtn", type: "DwtButton", visible: "get('ADVANCED')", ariaLabel: ZmMsg.endDate,
				menu: {type: "DwtCalendar", id: "endMiniCal", onselect: new AjxListener(this, this._dateCalSelectionListener, [false])}
			},
			{ id: "SKIP_META", type: "DwtCheckbox", label: ZmMsg.exportSkipMeta,
				visible: "get('ADVANCED')"
			}
		]
	};
	params.id = "ZmExportView";
	ZmImportExportBaseView.call(this, params);
};
ZmExportView.prototype = new ZmImportExportBaseView;
ZmExportView.prototype.constructor = ZmExportView;

ZmExportView.prototype.toString = function() {
	return "ZmExportView";
};

//
// Data
//

ZmExportView.prototype.TYPE_HINTS = {};
ZmExportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_CSV] = ZmMsg.exportToCSVHint;
ZmExportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_ICS] = ZmMsg.exportToICSHint;
ZmExportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_TGZ] = ZmMsg.exportToTGZHint;

ZmExportView.prototype.TEMPLATE = "data.ImportExport#ExportView";

//
// Data
//

ZmExportView.prototype._type = ZmImportExportController.TYPE_TGZ;

//
// Public methods
//

/**
 * Returns a params object that can be used to directly call
 * ZmImportExportController#exportData.
 */
ZmExportView.prototype.getParams = function() {
	// export parameters
	var params = {
		// required
		type:			this.getValue("TYPE", ZmImportExportController.TYPE_TGZ),
		subType:		this.getValue("SUBTYPE"),
		// optional -- ignore if not relevant
		views:			this.isRelevant("DATA_TYPES") ? this.getValue("DATA_TYPES") : null,
		folderId:		this._folderId,
		searchFilter:		this.isRelevant("SEARCH_FILTER") ? this.getValue("SEARCH_FILTER") : null ,
		start:			this.isRelevant("startDateField") ? this.getValue("startDateField"): null,
		end:			this.isRelevant("endDateField") ? this.getValue("endDateField"): null,
		skipMeta:		this.isRelevant("SKIP_META") ? this.getValue("SKIP_META") : null
	};

	// generate filename
	if (this._folderId != -1) {
		var folder = appCtxt.getById(params.folderId);
		var isRoot = folder && folder.nId == ZmOrganizer.ID_ROOT;
		params.filename = [
			isRoot ? ZmMsg.exportFilenamePrefixAllFolders : folder.name,
			"-",
			AjxDateFormat.format("yyyy-MM-dd-HHmmss", new Date())
		].join("");
		params.filename = params.filename;
	}

	return params;
};

//
// Protected methods
//

ZmExportView.prototype.update = function() {
	var type = this.getValue("TYPE", ZmImportExportController.TYPE_TGZ);
	var isTGZ = type == ZmImportExportController.TYPE_TGZ;
	var advanced = this.getControl("ADVANCED");
	if (advanced) {
		advanced.setEnabled(isTGZ);
		if (!isTGZ) {
			this.setValue("ADVANCED", false);
		} else if(appCtxt.get(ZmSetting.EXPORT_MAX_DAYS) > 0) {
			this.setValue("ADVANCED", true);
		}
	}
	ZmImportExportBaseView.prototype.update.apply(this, arguments);
};

// handlers
ZmExportView.prototype._folder_onclick = function() {
	var isAll = this.getValue("FOLDER") == "all";
	var type = isAll ? ZmImportExportController.TYPE_TGZ : null;
	type = type || this._getTypeFromFolder(appCtxt.getById(this._folderId));
	this.setValue("TYPE", type);
	this._initSubType(type);
	this.update();
};

ZmExportView.prototype._dateFieldChangeListener = 
function(isStart, ev) {
	var field = isStart ? "startDateField" : "endDateField";
	var calId = isStart ? "startMiniCal" : "endMiniCal";
	var cal = this.getControl(calId);
	var calDate = AjxDateUtil.simpleParseDateStr(this.getValue(field));
	
	if (isNaN(calDate)) {
		calDate = cal.getDate() || new Date();
		this.setValue(field, AjxDateUtil.simpleComputeDateStr(calDate));
	} else {
                if (calDate)
                        cal.setDate(calDate);
                else
                        this.setValue(field, null);
	}
};

ZmExportView.prototype._dateCalSelectionListener = 
function(isStart, ev) {
	var sd = AjxDateUtil.simpleParseDateStr(this.getValue("startDateField"));
	var ed = AjxDateUtil.simpleParseDateStr(this.getValue("endDateField"));
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);
	// change the start/end date if they mismatch
	if (isStart) {
		if (ed && (ed.valueOf() < ev.detail.valueOf())) {
			this.setValue("endDateField", newDate);
			this.getControl("endMiniCal").setDate(ev.detail);
		}
		this.setValue("startDateField", newDate);
	} else {
		if (sd && (sd.valueOf() > ev.detail.valueOf())) {
			this.setValue("startDateField", newDate);
			this.getControl("startMiniCal").setDate(ev.detail);
		}
		this.setValue("endDateField", newDate);
	}
};

}
if (AjxPackage.define("zimbraMail.share.view.ZmImportView")) {
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
 * This class represents the import view.
 * 
 * @extends		ZmImportExportBaseView
 * @private
 */
ZmImportView = function(params) {
	if (arguments.length == 0) { return; }

	// setup form
	params.form = {
		items: [
			// default items
			{ id: "TYPE", type: "DwtRadioButtonGroup", value: ZmImportExportController.TYPE_TGZ,
				items: [
					{ id: "TYPE_TGZ", label: ZmMsg.importExportTypeTGZ, value: ZmImportExportController.TYPE_TGZ },
					{ id: "TYPE_ICS", label: ZmMsg.importExportTypeICS, value: ZmImportExportController.TYPE_ICS },
					{ id: "TYPE_CSV", label: ZmMsg.importExportTypeCSV, value: ZmImportExportController.TYPE_CSV }
				],
				onclick: this._type_onclick
			},
			{ id: "TYPE_HINT", type: "DwtText" },
			{ id: "SUBTYPE", type: "DwtSelect",
				visible: "get('TYPE') == ZmImportExportController.TYPE_CSV && String(get('FILE')).match(/\\.csv$/i)"
			},
			{ id: "FOLDER_BUTTON", type: "DwtButton", label: ZmMsg.browse,
				enabled: "get('FILE')",
				onclick: this._folderButton_onclick
			},
			{ id: "FORM" },
			{ id: "FILE",
				setter: new Function() // no-op -- can't set a file value
			},
			{ id: "RESOLVE", type: "DwtRadioButtonGroup", value: "ignore",
				items: [
					{ id: "RESOLVE_IGNORE", label: ZmMsg.resolveDuplicateIgnore, value: "ignore" },
					{ id: "RESOLVE_MODIFY", label: ZmMsg.resolveDuplicateModify, value: "modify" },
					{ id: "RESOLVE_REPLACE", label: ZmMsg.resolveDuplicateReplace, value: "replace" },
					{ id: "RESOLVE_RESET", label: ZmMsg.resolveDuplicateReset, value: "reset" }
				],
				visible: "get('FILE') && get('TYPE') == ZmImportExportController.TYPE_TGZ"
			},
			{ id: "ADVANCED", type: "DwtCheckbox", label: ZmMsg.advancedSettings,
				visible: "get('FILE') && get('TYPE') == ZmImportExportController.TYPE_TGZ"
			},
			// advanced
			{ id: "DATA_TYPES", type: "ZmImportExportDataTypes",
				visible: "get('ADVANCED')"
			}
		]
	};
	params.id = "ZmImportView";
	ZmImportExportBaseView.call(this, params);

	// add change listener to file input
	var form = this.getControl("FORM");
	var file = form && form.elements["file"];
	if (file) {
		file.onchange = AjxCallback.simpleClosure(this._handleFileChange, this, file);
	}
};
ZmImportView.prototype = new ZmImportExportBaseView;
ZmImportView.prototype.constructor = ZmImportView;

ZmImportView.prototype.toString = function() {
	return "ZmImportView";
};

//
// Constants
//

ZmImportView.prototype.TYPE_HINTS = {};
ZmImportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_CSV] = ZmMsg.importFromCSVHint;
ZmImportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_ICS] = ZmMsg.importFromICSHint;
ZmImportView.prototype.TYPE_HINTS[ZmImportExportController.TYPE_TGZ] = ZmMsg.importFromTGZHint;

//
// Data
//

ZmImportView.prototype.TEMPLATE = "data.ImportExport#ImportView";

//
// Public methods
//

/**
 * Returns a params object that can be used to directly call
 * ZmImportExportController#exportData.
 */
ZmImportView.prototype.getParams = function() {
	var form = this.getControl("FORM");
	var filename = form && form.elements["file"].value;
	var ext = filename && filename.replace(/^.*\./,"").toLowerCase();
	var type = ext || this.getValue("TYPE") || ZmImportExportController.TYPE_TGZ;
	var isTGZ = type == ZmImportExportController.TYPE_TGZ;
	var params = {
		// required
		form:		form,
		// optional -- ignore if not relevant
		type:		type,
		subType:	this.isRelevant("SUBTYPE") ? this.getValue("SUBTYPE") : null,
		views:		this.isRelevant("DATA_TYPES") ? this.getValue("DATA_TYPES") : null,
		resolve:	this.isRelevant("RESOLVE") && isTGZ ? this.getValue("RESOLVE") : null,
		folderId:	this._folderId,
		dataTypes:	this.isRelevant("DATA_TYPES") ? this.getValue("DATA_TYPES") : null
	};
	if (params.resolve == "ignore") {
		delete params.resolve;
	}
	return params;
};

//
// Protected methods
//

ZmImportView.prototype._getSubTypeOptions = function(type) {
	var options = ZmImportExportBaseView.prototype._getSubTypeOptions.apply(this, arguments);
	if (type == ZmImportExportController.TYPE_CSV) {
		options = [].concat({ displayValue: ZmMsg.importAutoDetect, value: "" }, options);
	}
	return options;
};

ZmImportView.prototype._handleFileChange = function(file) {
	var filename = file.value;
	var ext = filename.replace(/^.*\./,"").toLowerCase();
	var type = ZmImportExportController.EXTS_TYPE[ext];
	if (type) {
		this.set("TYPE", type);
	}
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmImportExportPage")) {
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
 * Creates the import/export page.
 * @class
 * This class represents the import/export page.
 * 
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends	ZmPreferencesPage
 * 
 * @private
 */
ZmImportExportPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);
};

ZmImportExportPage.prototype = new ZmPreferencesPage;
ZmImportExportPage.prototype.constructor = ZmImportExportPage;

ZmImportExportPage.prototype.toString =
function () {
    return "ZmImportExportPage";
};

//
// ZmPreferencesPage methods
//

ZmImportExportPage.prototype.reset =
function(useDefaults) {
	ZmPreferencesPage.prototype.reset.apply(this, arguments);
	var button = this.getFormObject("IMPORT_BUTTON");
	if (button) {
		button.setEnabled(true);
	}
};

ZmImportExportPage.prototype.hasResetButton =
function() {
	return false;
};

//
// Protected methods
//

ZmImportExportPage.prototype._setupCustom = function(id, setup, value) {
	if (id == "EXPORT_FOLDER") {
		var view = new ZmExportView({parent:this});
		this.setFormObject(id, view);
		return view;
	}
	if (id == "EXPORT_BUTTON") {
		var button = new DwtButton({parent:this, id: id});
		button.setText(setup.displayName);
		button.addSelectionListener(new AjxListener(this, this._handleExportButton));
		this.setFormObject(id, button);
		return button;
	}
	if (id == "IMPORT_FOLDER") {
		var view = new ZmImportView({parent:this});
		this.setFormObject(id, view);
		return view;
	}
	if (id == "IMPORT_BUTTON") {
		var button = new DwtButton({parent:this, id: id});
		button.setText(setup.displayName);
		button.addSelectionListener(new AjxListener(this, this._handleImportButton));
		this.setFormObject(id, button);
		return button;
	}
	return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

// handlers

ZmImportExportPage.prototype._handleImportButton = function() {
	var button = this.getFormObject("IMPORT_BUTTON");
	if (button) {
		button.setEnabled(false);
	}

	// get import params
	var importView = this.getFormObject("IMPORT_FOLDER");
	var params = {};
    params = importView && importView.getParams();
	params.callback = params.errorCallback = new AjxCallback(this, this._handleImportComplete);

	// import
	var controller = appCtxt.getImportExportController();
	if (controller.importData(params)) {
		var params = {
			msg:	ZmMsg.importStarted,
			level:	ZmStatusView.LEVEL_INFO
		};
		appCtxt.setStatusMsg(params);
	}
	else if (button) {
		button.setEnabled(true);
	}
};

ZmImportExportPage.prototype._handleExportButton = function() {
	// get export params
	var exportView = this.getFormObject("EXPORT_FOLDER");
	var params = exportView.getParams();

	// export
	var controller = appCtxt.getImportExportController();
	controller.exportData(params);
};

ZmImportExportPage.prototype._handleImportComplete = function() {
	var button = this.getFormObject("IMPORT_BUTTON");
	if (button) {
		button.setEnabled(true);
	}
};
}

}
if (AjxPackage.define("data.ImportExport")) {
AjxTemplate.register("data.ImportExport#ImportExportPrefPage", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	 if (appCtxt.get(ZmSetting.IMPORT_ENABLED)) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg._import;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=\"100%\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_IMPORT_FOLDER' tabindex=\"100\"></div></td></tr><tr><td align=\"right\"><button id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_IMPORT_BUTTON\" tabindex=\"200\" style=\"display:inline-block;\"></button></td></tr></table></td></tr></table>";
	 } 
	 if (appCtxt.get(ZmSetting.EXPORT_ENABLED)) { 
	buffer[_i++] = "<div class='prefHeader'>";
	buffer[_i++] = ZmMsg._export;
	buffer[_i++] = "</div><table role=\"presentation\" class='ZOptionsSectionTable' width=100%><tr><td class='ZOptionsSectionMain'><table role=\"presentation\" width=\"100%\" ><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXPORT_FOLDER' tabindex=\"300\"></div></td></tr><tr><td align=\"right\"><button id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_EXPORT_BUTTON\" tabindex=\"400\" style=\"display:inline-block;\"></button></td></tr></table></td></tr></table>";
	 } 

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#ImportExportPrefPage"
}, false);
AjxTemplate.register("data.ImportExport", AjxTemplate.getTemplate("data.ImportExport#ImportExportPrefPage"), AjxTemplate.getParams("data.ImportExport#ImportExportPrefPage"));

AjxTemplate.register("data.ImportExport#ImportView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'><tr><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.fileLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\" style='padding-left:0.5em;'><form id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FORM\" method=\"POST\" enctype=\"multipart/form-data\"><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FILE\" name=\"file\" type=\"file\" tabindex=\"100\"></form></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SUBTYPE_row'><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.typeLabel;
	buffer[_i++] = "</td><td><select id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SUBTYPE\" tabindex=\"200\"></select></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FOLDER_row\"><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.destinationLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><table role=\"presentation\"><tr><td><button id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FOLDER_BUTTON\" tabindex=\"300\"></button></td></tr></table></td></tr><tr id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESOLVE_row'><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.resolveDuplicatesLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><table role=\"presentation\"><tr><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESOLVE_IGNORE\" tabindex=\"500\"></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESOLVE_MODIFY\" tabindex=\"501\"></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESOLVE_REPLACE\" tabindex=\"502\"></div></td><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_RESOLVE_RESET\" tabindex=\"503\"></div></td></tr></table></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADVANCED_row\"><td class=\"ZOptionsLabelTop\">&nbsp;</td><td class=\"ZOptionsField\"><hr /><span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADVANCED\" tabindex=\"700\"></span></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DATA_TYPES_row\"><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.dataTypesLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\" style=\"padding-top: 5px;\"><div>";
	buffer[_i++] = ZmMsg.dataTypesHint;
	buffer[_i++] = "</div><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DATA_TYPES\" tabindex=\"800\"></div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#ImportView",
	"class": "ZmImportView"
}, false);

AjxTemplate.register("data.ImportExport#ExportView", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width=100% class='ZPropertySheet' cellspacing='6'>";
	 if (appCtxt.get(ZmSetting.CALENDAR_ENABLED) || appCtxt.get(ZmSetting.CONTACTS_ENABLED)) { 
	buffer[_i++] = "<tr><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.typeLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><table role=\"presentation\"><tr><td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TYPE_TGZ\" tabindex=\"100\"></div></td>";
	 if (appCtxt.get(ZmSetting.CALENDAR_ENABLED)) { 
	buffer[_i++] = "<td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TYPE_ICS\" tabindex=\"101\"></div></td>";
	 } 
	 if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) { 
	buffer[_i++] = "<td><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TYPE_CSV\" tabindex=\"102\"></div></td>";
	 } 
	buffer[_i++] = "<td><select id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SUBTYPE\" tabindex=\"200\"></select></td></tr></table><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_TYPE_HINT\" class=\"ZOptionsInfo\"></div></td></tr>";
	 } 
	buffer[_i++] = "<tr><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.sourceLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><table role=\"presentation\"><tr><td><button id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_FOLDER_BUTTON\" tabindex=\"300\"></button></td></tr></table>";
	 if (appCtxt.get(ZmSetting.OFFLINE_ENABLED)) { 
	buffer[_i++] = "<div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_IGNORE_ARCHIVE\" tabindex=\"400\"></div>";
	 } 
	buffer[_i++] = "</td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADVANCED_row\"><td class=\"ZOptionsLabelTop\">&nbsp;</td><td class=\"ZOptionsField\"><hr /><span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_ADVANCED\" tabindex=\"500\"></span></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DATA_TYPES_row\"><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.dataTypesLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\" style=\"padding-top: 5px;\"><div>";
	buffer[_i++] = ZmMsg.dataTypesHint;
	buffer[_i++] = "</div><div id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DATA_TYPES\" tabindex=\"600\"></div></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_DATE_row\"><td class=\"ZOptionsLabelTop\">";
	buffer[_i++] = ZmMsg.date;
	buffer[_i++] = ":</td>";
	buffer[_i++] =  AjxTemplate.expand("#DatePickers", data) ;
	buffer[_i++] = "</tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SEARCH_FILTER_row\"><td class=\"ZOptionsLabelTop\" style=\"width:inherit;\">";
	buffer[_i++] = ZmMsg.searchFilterLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><input id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SEARCH_FILTER\" length=\"40\" hint=\"";
	buffer[_i++] = ZmMsg.searchFilterHint;
	buffer[_i++] = "\" tabindex=\"700\" size=\"40\"></td></tr><tr id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SKIP_META_row\"><td class=\"ZOptionsLabelTop\" style=\"width:inherit;\">";
	buffer[_i++] = ZmMsg.otherLabel;
	buffer[_i++] = "</td><td class=\"ZOptionsField\"><span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_SKIP_META\" tabindex=\"800\"></span></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#ExportView",
	"class": "ZmExportView"
}, false);

AjxTemplate.register("data.ImportExport#DataTypes", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZPropertySheet' cellspacing='6'>";
	 var count = data.count; 
	 var rows = count / 3; 
	 for (var i = 0; i < count; i++) { 
	 if ((i % 3) == 0) { 
	buffer[_i++] = "<tr>";
	 } 
	buffer[_i++] = "<td><span id=\"";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_cell_";
	buffer[_i++] = i;
	buffer[_i++] = "\"></span></td>";
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#DataTypes"
}, false);

AjxTemplate.register("data.ImportExport#DataTypeCheckbox", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td><input id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_input' name='";
	buffer[_i++] = data["name"];
	buffer[_i++] = "' value='";
	buffer[_i++] = data["value"];
	buffer[_i++] = "' type='checkbox' ";
	buffer[_i++] = data["checked"];
	buffer[_i++] = "></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_image'></div></td><td><label for='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_input' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_text_right' class='Text' style='text-align:left'></label></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#DataTypeCheckbox"
}, false);

AjxTemplate.register("data.ImportExport#DateField", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<td><input autocomplete='off' style='height:22px;' type='text' size=14 id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "' value='";
	buffer[_i++] = data["value"];
	buffer[_i++] = "'></td>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#DateField"
}, false);

AjxTemplate.register("data.ImportExport#DatePickers", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<td><table role=\"presentation\"><tr>";
	buffer[_i++] =  AjxTemplate.expand("#StartDate", data) ;
	buffer[_i++] =  AjxTemplate.expand("#EndDate", data) ;
	buffer[_i++] = "</tr></table></td>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#DatePickers"
}, false);

AjxTemplate.register("data.ImportExport#StartDate", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<td>";
	buffer[_i++] = ZmMsg.startOn;
	buffer[_i++] = "&nbsp;";
	buffer[_i++] = AjxTemplate.expand("#DateField",{id:data.id+"_startDateField"});
	buffer[_i++] = "</td><td class=\"miniCalendarButton\" style='padding-right:10px;'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_startMiniCalBtn'></div></td>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#StartDate"
}, false);

AjxTemplate.register("data.ImportExport#EndDate", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<td>";
	buffer[_i++] = ZmMsg.endOn;
	buffer[_i++] = "&nbsp;";
	buffer[_i++] = AjxTemplate.expand("#DateField",{id:data.id+"_endDateField"});
	buffer[_i++] = "</td><td class=\"miniCalendarButton\" style='padding-right:10px;'><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_endMiniCalBtn'></div></td>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "data.ImportExport#EndDate"
}, false);

}
