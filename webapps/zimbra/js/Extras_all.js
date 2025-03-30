if (AjxPackage.define("Extras")) {
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
/*
 * Package: Extras
 * 
 * Supports: Miscellaneous rarely-used functionality
 *  - ZmClientCmdHandler: handles special search cmds
 * 	- ZmChooseFolderDialog: export contacts, tie identity to folder,
 *							pop mail to folder, move mail or folder,
 *							create a filter, create a folder shortcut
 * 	- ZmRenameFolderDialog: rename a folder
 * 	- ZmRenameTagDialog: rename a tag
 * 	- ZmPickTagDialog: create a filter, create a tag shortcut
 * 	- ZmSpellChecker: spell check a composed message
 */

if (AjxPackage.define("ajax.util.AjxDlgUtil")) {
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
 * 
 * @private
 */
AjxDlgUtil = {

	cache : {},

	getDialogLayout : function(name, url, msg) {
		var time = new Date().getTime();

		var txt, cache = AjxDlgUtil.cache;
		if (cache[name]) {
			txt = cache[name];
		} else {
			// WARNING: synchronous request!
			// Also we don't treat errors at this point >-) so you better
			// know what you're doing.
			var res = AjxRpc.invoke(null, url + "?v=" + time, null, null, true, 5000);
			cache[name] = txt = res.text;
		}

		var ids = {};

		// get rid of the comments
		txt = txt.replace(/<!--.*?-->/, "");

		// replace $msg and $id fields
		txt = txt.replace(/\$([a-zA-Z0-9_.]+)/g, function(str, p1) {
			if (/^([^.]+)\.(.*)$/.test(p1)) {
				var prefix = RegExp.$1;
				var name = RegExp.$2;
				switch (prefix) {
				    case "id":
					var id = ids[name];
					if (!id)
						id = ids[name] = Dwt.getNextId();
					return id;
				    case "msg":
					return msg[name];
				}
			}
			return str;
		});

		return { ids: ids, html: txt };
	}

};
}

if (AjxPackage.define("zimbraMail.core.ZmClientCmdHandler")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the command handler class. The following commands are supported:
 *
 * 		$set:debug {1,2,3}					set debug level to 1, 2, or 3
 * 		$set:debug t						toggle debug timing on/off
 * 		$set:debugtrace {on,off}			turn offline debug trace on/off
 * 		$set:instant_notify					show whether instant notify is on or off
 * 		$set:instant_notify {on,off}		turn instant notify on/off
 *		$set:poll [N]						set poll interval to N seconds (unless doing instant notify)
 * 		$set:noop							send a poll (get notifications)
 * 		$set:rr								refresh reminders
 * 		$set:rh								run reminder housekeeping
 * 		$set:toast							show sample toast messages
 * 		$set:get version					show client version
 * 		$set:expire							expire session; refresh block will come on next response
 * 		$set:refresh						force immediate return of a refresh block
 * 		$set:relogin						logout the user
 * 		$set:alert							issue a test sound alert
 * 		$set:alert {browser,desktop,app} N	issue a test alert in given context in N seconds
 * 		$set:leak {begin,report,end}		manage leak detection
 * 		$set:tabs							show tab groups (in debug window)
 * 		$set:ymid [id]						set Yahoo IM user to id
 * 		$set:log [type]						dump log contents for type
 * 		$set:log [type]	[size]				set number of msgs to keep for type
 * 		$set:compose						compose msg based on mailto: in query string
 * 		$set:error							show error dialog
 * 		$set:modify [setting] [value]		set setting to value, then optionally restart
 * 		$set:clearAutocompleteCache			clear contacts autocomplete cache
 *
 * TODO: should probably I18N the alert messages
 */

/**
 * Creates the client. command handler
 * @class
 * This class represents a client command handler.
 */
ZmClientCmdHandler = function() {
	this._settings = {};
	this._dbg = window.DBG;	// trick to fool minimizer regex
};

/**
 * Executes the command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute =
function(cmdStr, searchController) {

	if (!cmdStr) { return; }

	cmdStr = AjxStringUtil.trim(cmdStr, true);
	
	if (cmdStr == "") { return; }
	
	var argv = cmdStr.split(/\s/);
	var arg0 = argv[0];

	if (arg0 != "modify") {
		cmdStr = cmdStr.toLowerCase();
	}

	var func = this["execute_" + arg0];
	if (func) {
		var args = [].concat(cmdStr, searchController, argv);
		return func.apply(this, args);
	}
};

/**
 * @private
 */
ZmClientCmdHandler.prototype._alert =
function(msg, level) {
	appCtxt.setStatusMsg(msg, level);
};

/**
 * Executes the command with debug.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_debug =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	if (!cmdArg1 || !this._dbg) { return; }
	if (cmdArg1 == "t") {
		var on = this._dbg._showTiming;
		var newState = on ? "off" : "on";
		this._alert("Turning timing info " + newState);
		this._dbg.showTiming(!on);
	} else {
		this._dbg.setDebugLevel(cmdArg1);
		this._alert("Setting debug level to: " + cmdArg1);
	}
};

/**
 * Executes the command with debug trace.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_debugtrace =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	if (!cmdArg1) return;

	var val;
	if (cmdArg1 == "on") {
		val = true;
	} else if (cmdArg1 == "off") {
		val = false;
	}

	if (val != undefined) {
		appCtxt.set(ZmSetting.OFFLINE_DEBUG_TRACE, val, null, null, true);
		this._alert("Debug trace is " + cmdArg1);
	}
};

/**
 * Executes the instant notify "ON" command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_instant_notify =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	if (typeof cmdArg1 == "undefined") {
		this._alert("Instant notify is "+ (appCtxt.getAppController().getInstantNotify() ? "ON" : "OFF"));
	} else {
		var on = cmdArg1 && (cmdArg1.toLowerCase() == "on");
		this._alert("Set instant notify to "+ (on ? "ON" : "OFF"));
		appCtxt.getAppController().setInstantNotify(on);
	}
};

/**
 * Executes the poll interval command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_poll =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	if (!cmdArg1) return;
	appCtxt.set(ZmSetting.POLLING_INTERVAL, cmdArg1);
	var pi = appCtxt.get(ZmSetting.POLLING_INTERVAL); // LDAP time format converted to seconds
	if (appCtxt.getAppController().setPollInterval(true)) {
		this._alert("Set polling interval to " + pi + " seconds");
	} else {
		this._alert("Ignoring polling interval b/c we are in Instant_Polling mode ($set:instant_notify 0|1)");
	}
};

/**
 * Executes the no op command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_noop =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	appCtxt.getAppController().sendNoOp();
	this._alert("Sent NoOpRequest");
};

/**
 * Executes the reminder refresh command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_rr =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	appCtxt.getApp(ZmApp.CALENDAR).getReminderController().refresh();
};

/**
 * Executes the reminder housekeeping command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_rh =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	appCtxt.getApp(ZmApp.CALENDAR).getReminderController()._housekeepingAction();
};

/**
 * Executes the toast command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_toast =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	appCtxt.setStatusMsg("Your options have been saved.", ZmStatusView.LEVEL_INFO);
	appCtxt.setStatusMsg("Unable to save options.", ZmStatusView.LEVEL_WARNING);
	appCtxt.setStatusMsg("Message not sent.", ZmStatusView.LEVEL_CRITICAL);
};

/**
 * Executes the get version/release/date command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_get =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	if (cmdArg1 && cmdArg1 == "version") {
		alert("Client Information\n\n" +
			  "Client Version: " + appCtxt.get(ZmSetting.CLIENT_VERSION) + "\n" +
			  "Client Release: " + appCtxt.get(ZmSetting.CLIENT_RELEASE) + "\n" +
			  "    Build Date: " + appCtxt.get(ZmSetting.CLIENT_DATETIME));
	}
};

/**
 * Executes the expire command.
 *
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_expire =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	ZmCsfeCommand.clearSessionId();
	this._alert("Session expired");
};

/**
 * Executes the refresh command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_refresh = 
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	ZmCsfeCommand.clearSessionId();
	appCtxt.getAppController().sendNoOp();
};

/**
 * Executes the re-login command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_relogin =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	ZmCsfeCommand.clearAuthToken();
	appCtxt.getAppController().sendNoOp();
};

/**
 * Executes the alert command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_alert =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	//  $set:alert [sound/browser/app] [delay in seconds]
	function doIt() {
		if (cmdArg1 == "browser") {
			AjxDispatcher.require("Alert");
			ZmBrowserAlert.getInstance().start("Alert Test!");
		} else if (cmdArg1 == "desktop") {
			AjxDispatcher.require("Alert");
			ZmDesktopAlert.getInstance().start("Title!", "Message!");
		} else if (cmdArg1 == "app") {
			appCtxt.getApp(ZmApp.MAIL).startAlert();
		} else {
			AjxDispatcher.require("Alert");
			ZmSoundAlert.getInstance().start();
		}
	}
	setTimeout(doIt, Number(cmdArg2) * 1000);
};

/**
 * Executes the leak detector command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_leak =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	AjxPackage.require("ajax.debug.AjxLeakDetector");
	if (!window.AjxLeakDetector) {
		this._alert("AjxLeakDetector could not be loaded", ZmStatusView.LEVEL_WARNING);
	} else {
		var leakResult = AjxLeakDetector.execute(cmdArg1);
		this._alert(leakResult.message, leakResult.success ? ZmStatusView.LEVEL_INFO : ZmStatusView.LEVEL_WARNING);
	}
};

/**
 * Executes the tabs command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_tabs =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	appCtxt.getRootTabGroup().dump(AjxDebug.DBG1);
};

/**
 * Executes the Yahoo! IM command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_ymid =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	var settings = appCtxt.getSettings(),
		setting = settings.getSetting(ZmSetting.IM_YAHOO_ID);
	setting.setValue(cmdArg1 || "");
	settings.save([setting]);
	this._alert("Done");
};

/**
 * Executes the log command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_log =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {

	var type = cmdArg1;
	if (cmdArg2 != null) {
		var size = parseInt(cmdArg2);
		if (!isNaN(size)) {
			AjxDebug.BUFFER_MAX[type] = size;
			this._alert("Debug log size for '" + type + "' set to " + size);
		}
	}
	else {
		appCtxt.getDebugLogDialog().popup(AjxDebug.getDebugLog(type), type);
	}
};

/**
 * Executes the compose command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 */
ZmClientCmdHandler.prototype.execute_compose =
function(cmdStr, searchController, cmdName, cmdArg1 /* ..., cmdArgN */) {
	var mailApp = appCtxt.getApp(ZmApp.MAIL);
	var idx = (location.search.indexOf("mailto"));
	if (idx >= 0) {
		var query = "to=" + decodeURIComponent(location.search.substring(idx+7));
		query = query.replace(/\?/g, "&");

		mailApp._showComposeView(null, query);
		return true;
	}
};

/**
 * Executes the error command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_error =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	var errDialog = appCtxt.getErrorDialog();
	errDialog.setMessage("Error Message!", "Details!!", DwtMessageDialog.WARNING_STYLE);
	errDialog.popup();

};

/**
 * Executes the modify command.
 * 
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_modify =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	var settings = appCtxt.getSettings();
	var id = cmdArg1 && settings.getSettingByName(cmdArg1);
	if (id) {
		var setting = settings.getSetting(id);
		setting.setValue(cmdArg2 || setting.getDefaultValue());
		if (ZmSetting.IS_IMPLICIT[setting.id]) {
			appCtxt.accountList.saveImplicitPrefs();
		} else {
			settings.save([setting]);
		}
	}

	settings._showConfirmDialog(ZmMsg.accountChangeRestart, settings._refreshBrowserCallback.bind(settings));
};

/**
 * Executes the clearAutocompleteCache command.
 *
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_clearAutocompleteCache =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	appCtxt.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
	this._alert("Contacts autocomplete cache cleared");
};

/**
 * Executes the getCharWidth command.
 *
 * @param	{String}	cmdStr		the command
 * @param	{ZmSearchController}	searchController	the search controller
 * @param	{Object}	[cmdArg1]		command arguments
 * @param	{Object}	[cmdArg2]		command arguments
 */
ZmClientCmdHandler.prototype.execute_getCharWidth =
function(cmdStr, searchController, cmdName, cmdArg1, cmdArg2 /* ..., cmdArgN */) {
	var cla = appCtxt.getApp(ZmApp.CONTACTS).getContactList().getArray();
	for (var i = 0; i < cla.length; i++) {
		ZmClientCmdHandler._testWidth(cla[i]._attrs["firstLast"] || cla[i]._attrs["company"] || "");
	}
	var text = [];
	text.push("Avg char width: " + ZmClientCmdHandler.WIDTH / ZmClientCmdHandler.CHARS);
	text.push("Avg bold char width: " + ZmClientCmdHandler.BWIDTH / ZmClientCmdHandler.CHARS);
	var w = ZmClientCmdHandler._testWidth(AjxStringUtil.ELLIPSIS);
	text.push("Ellipsis width: " + w.w);
	w = ZmClientCmdHandler._testWidth(", ");
	text.push("Comma + space width: " + w.w);
	alert(text.join("\n"));
};

ZmClientCmdHandler.CHARS = 0;
ZmClientCmdHandler.WIDTH = 0;
ZmClientCmdHandler.BWIDTH = 0;

ZmClientCmdHandler._testWidth =
function(str) {
	var div = document.createElement("DIV");
	div.style.position = Dwt.ABSOLUTE_STYLE;
	var shellEl = appCtxt.getShell().getHtmlElement();
	shellEl.appendChild(div);
	Dwt.setLocation(div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	div.innerHTML = str;
	var size = Dwt.getSize(div);
	ZmClientCmdHandler.CHARS += str.length;
	ZmClientCmdHandler.WIDTH += size.x;
	div.style.fontWeight = "bold";
	var bsize = Dwt.getSize(div);
	ZmClientCmdHandler.BWIDTH += bsize.x;
	shellEl.removeChild(div);
	return {w:size.x, bw:bsize.x};
};
}

if (AjxPackage.define("zimbraMail.share.ZmUploadManager")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * Provides a framework for uploading multiple files; the callbacks allow the upload to be stored as an
 * attachment or saved document.
 *
 */

/**
 * Creates the ZmUploadManager
 * @class
 * This class represents the file uploading, with document creation
 *
 */
ZmUploadManager = function() {
};


ZmUploadManager.prototype.constructor = ZmUploadManager;

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmUploadManager.prototype.toString =
function() {
    return "ZmUploadManager";
};

// Constants

ZmUploadManager.ERROR_INVALID_SIZE      = "invalidSize";
ZmUploadManager.ERROR_INVALID_EXTENSION = "invalidExtension";
ZmUploadManager.ERROR_INVALID_FILENAME  = "invalidFilename";

/**
 * uploadMyComputerFile serializes a set of files uploads.  The responses are accumulated, and progress is provided to the
 * current view, if any.  Once all files are uploaded, a custom callback is run (if provided) to finish the upload.
 *
 * @param	{object}	params		params to customize the upload flow:
 *      attachment				    True => Mail msg attachment, False => File Upload
 *      uploadFolder                Folder to save associated document into
 *      files:                      raw File object from the external HTML5 drag and drop
 *      notes:                      Notes associated with each of the files being added
 *      allResponses:               Placeholder, initialized here and passed to the chained calls, accumulating responses
 *      start:                      current index into files
 *      curView:                    target view for the drag and drop
 *      url							url to use (optional, currently only from ZmImportExportController)
 *      stateChangeCallback			callback to use from _handleUploadResponse which is the onreadystatechange listener, instead of the normal code here. (optiona, see ZmImportExportController)
 *      preAllCallback:             Run prior to All uploads
 *      initOneUploadCallback:      Run prior to a single upload
 *      progressCallback:           Run by the upload code to provide upload progress
 *      errorCallback:              Run upon an error
 *      completeOneCallback:        Run when a single upload completes
 *      completeAllCallback:        Run when the last file has completed its upload
 *
 */
ZmUploadManager.prototype.upload =
function(params) {
    if (!params.files) {
        return;
    }
	params.start = params.start || 0;

    try {
        this.upLoadC = this.upLoadC + 1;
		var file     = params.files[params.start];
		var fileName = file.name || file.fileName;

		if (!params.allResponses) {
            // First file to upload.  Do an preparation prior to uploading the files
            params.allResponses = [];
            if (params.preAllCallback) {
                params.preAllCallback.run(fileName);
            }
			// Determine the total number of bytes to be upload across all the files
			params.totalSize = this._getTotalUploadSize(params);
			params.uploadedSize = 0;
		}

		if (params.start > 0) {
			// Increment the total number of bytes upload with the previous file that completed.
			params.uploadedSize += params.currentFileSize;
		}
		// Set the upload size of the current file
		params.currentFileSize = file.size || file.fileSize || 0;

        // Initiate the first upload
        var req = new XMLHttpRequest(); // we do not call this function in IE
		var uri = params.url || (params.attachment ? (appCtxt.get(ZmSetting.CSFE_ATTACHMENT_UPLOAD_URI) + "?fmt=extended,raw") : appCtxt.get(ZmSetting.CSFE_UPLOAD_URI));
        req.open("POST", uri, true);
        req.setRequestHeader("Cache-Control", "no-cache");
        req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        req.setRequestHeader("Content-Type",  (file.type || "application/octet-stream") + ";");
        req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ AjxUtil.convertToEntities(fileName) + '"');
		if (window.csrfToken) {
			req.setRequestHeader("X-Zimbra-Csrf-Token", window.csrfToken);
		}

        if (params.initOneUploadCallback) {
            params.initOneUploadCallback.run();
        }

        DBG.println(AjxDebug.DBG1,"Uploading file: "  + fileName + " file type" + (file.type || "application/octet-stream") );
        this._uploadAttReq = req;
        if (AjxEnv.supportsHTML5File) {
            if (params.progressCallback) {
                req.upload.addEventListener("progress", params.progressCallback, false);
            }
        }
        else {
            if (params.curView) {
                var progress = function (obj) {
                    var viewObj = obj;
                    viewObj.si = window.setInterval (function(){viewObj._progress();}, 500);
                };
                progress(params.curView);
            }
        }

        req.onreadystatechange = this._handleUploadResponse.bind(this, req, fileName, params);
        req.send(file);
        delete req;
    } catch(exp) {
        DBG.println("Error while uploading file: "  + fileName);
        DBG.println("Exception: "  + exp);

        if (params.errorCallback) {
            params.errorCallback.run();
        }
        this._popupErrorDialog(ZmMsg.importErrorUpload);
        this.upLoadC = this.upLoadC - 1;
        return false;
    }

};

ZmUploadManager.prototype._getTotalUploadSize = function(params) {
	// Determine the total number of bytes to be upload across all the files
	var totalSize = 0;
	for (var i = 0; i < params.files.length; i++) {
		var file = params.files[i];
		var size = file.size || file.fileSize || 0; // fileSize: Safari
		totalSize += size;
	}
	return totalSize;
}

ZmUploadManager.prototype._handleUploadResponse =
function(req, fileName, params){
	if (params.stateChangeCallback) {
		return params.stateChangeCallback(req);
	}
    var curView      = params.curView;
    var files        = params.files;
    var start        = params.start;
    var allResponses = params.allResponses;
    if (req.readyState === 4) {
		var response = null;
		var aid      = null;
		var status   = req.status;
		if (status === 200) {
			if (params.attachment) {
				// Sent via CSFE_ATTACHMENT_UPLOAD_URI
				var resp = eval("["+req.responseText+"]");
				response = resp.length && resp[2];
				if (response) {
					response = response[0];
					if (response) {
						aid = response.aid;
					}
				}
			} else {
				// Sent via CSFE_UPLOAD_URI
				// <UGLY> - the server assumes the javascript object/function it will communicate with - AjxPost.  It invokes it with:
				// function doit() { window.parent._uploadManager.loaded(200,'null','<uploadId>'); }  and then <body onload='doit()'>
				// We need to extract the uploadId param from the function call
				var functionStr = "loaded(";
				var response    = req.responseText;
				if (response) {
					// Get the parameter text between 'loaded('  and  ')';
					var paramText    = response.substr(response.indexOf(functionStr) + functionStr.length);
					paramText        = paramText.substr(0, paramText.indexOf(")"));
					// Convert to an array of params.  Third one is the upload id
					var serverParams = paramText.split(',');
					var serverParamArray =  eval( "["+ serverParams +"]" );
					status = serverParamArray[0];
					aid = serverParamArray && serverParamArray.length && serverParamArray[2];
					response = { aid: aid };
				}
				// </UGLY>
			}
		}
        if (response || this._uploadAttReq.aborted) {
			allResponses.push(response  || null);
            if (aid) {
                DBG.println(AjxDebug.DBG1,"Uploaded file: "  + fileName + "Successfully.");
            }
            if (start < files.length - 1) {
                // Still some file uploads to perform
                if (params.completeOneCallback) {
                    params.completeOneCallback.run(files, start + 1, aid);
                }
                // Start the next upload
                params.start++;
                this.upload(params);
            }
            else {
                // Uploads are all done
                this._completeAll(params, allResponses, status);
            }
        }
        else {
            DBG.println("Error while uploading file: "  + fileName + " response is null.");

            // Uploads are all done
            this._completeAll(params, allResponses, status);

            var msgDlg = appCtxt.getMsgDialog();
            this.upLoadC = this.upLoadC - 1;
			msgDlg.setMessage(ZmMsg.importErrorUpload, DwtMessageDialog.CRITICAL_STYLE);
            msgDlg.popup();
            return false;
        }
    }

};

ZmUploadManager.prototype._completeAll =
function(params, allResponses, status) {
    if (params.completeAllCallback) {
        // Run a custom callback (like for mail ComposeView, which is doing attachment handling)
        params.completeAllCallback.run(allResponses, params, status)
    }
}

ZmUploadManager.prototype._popupErrorDialog = function(message) {
    var dialog = appCtxt.getMsgDialog();
    dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE);
    dialog.popup();
};


// --- Upload File Validation -------------------------------------------
ZmUploadManager.prototype.getErrors = function(file, maxSize, errors, extensions){
	var error = { errorCodes:[], filename: AjxStringUtil.htmlEncode(file.name) };
    var valid = true;
    var size = file.size || file.fileSize || 0;  // fileSize: Safari
    if (size && (size > maxSize)) {
		valid = false;
		error.errorCodes.push( ZmUploadManager.ERROR_INVALID_SIZE );
    }
    if (!this._checkExtension(file.name, extensions)) {
		valid = false;
		error.errorCodes.push( ZmUploadManager.ERROR_INVALID_EXTENSION );
    }
	if (ZmAppCtxt.INVALID_NAME_CHARS_RE.test(file.name)) {
		valid = false;
		error.errorCodes.push( ZmUploadManager.ERROR_INVALID_FILENAME );
    }

    return valid ? null : error;
};

ZmUploadManager.prototype._checkExtension =
function(filename, extensions) {
    if (!extensions) return true;
    var ext = filename.replace(/^.*\./,"").toUpperCase();
    for (var i = 0; i < extensions.length; i++) {
        if (extensions[i] == ext) {
            return true;
        }
    }
    return false;
};

ZmUploadManager.prototype.createUploadErrorMsg =
function(errors, maxSize, lineBreak) {
	var errorSummary = {};
	var errorCodes;
	var errorCode;
	for (var i = 0; i < errors.length; i++) {
		errorCodes = errors[i].errorCodes;
		for (var j = 0; j < errorCodes.length; j++) {
			errorCode = errorCodes[j];
			if (!errorSummary[errorCode])  {
				errorSummary[errorCode] = [];
			}
			errorSummary[errorCode].push(errors[i].filename);
		}
	}

    var errorMsg = [ZmMsg.uploadFailed];
    if (errorSummary.invalidExtension) {
        var extensions = this._formatUploadErrorList(this._extensions);
        errorMsg.push("* " + AjxMessageFormat.format(ZmMsg.errorNotAllowedFile, [ extensions ]));
    }
	var msgFormat, errorFilenames;
    if (errorSummary.invalidFilename) {
        msgFormat =  (errorSummary.invalidFilename.length > 1) ? ZmMsg.uploadInvalidNames : ZmMsg.uploadInvalidName;
        errorFilenames = this._formatUploadErrorList(errorSummary.invalidFilename);
        errorMsg.push("* " + AjxMessageFormat.format(msgFormat, [ errorFilenames ] ));
    }
    if (errorSummary.invalidSize) {
        msgFormat =  (errorSummary.invalidSize.length > 1) ? ZmMsg.uploadSizeError : ZmMsg.singleUploadSizeError;
        errorFilenames = this._formatUploadErrorList(errorSummary.invalidSize);
        errorMsg.push("* " + AjxMessageFormat.format(msgFormat, [ errorFilenames, AjxUtil.formatSize(maxSize)] ));
    }
    return errorMsg.join(lineBreak);
};

ZmUploadManager.prototype._formatUploadErrorList =
function(errorObjList) {
    var errorObjText = "";
    if (errorObjList) {
        if (!errorObjList.length) {
            errorObjText = errorObjList;
        } else {
            if (errorObjList.length == 1) {
                errorObjText = errorObjList[0];
            } else {
                var lastObj = errorObjList.slice(-1);
                errorObjList = errorObjList.slice(0, errorObjList.length - 1);
                var initialErrorObjs = errorObjList.join(", ");
                errorObjText = AjxMessageFormat.format(ZmMsg.pluralList, [ initialErrorObjs, lastObj] );
            }
        }
    }
    return errorObjText;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmChooseFolderDialog")) {
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
 */

/**
 * Creates a dialog with various trees so a user can select a folder.
 * @class
 * This class represents choose folder dialog.
 * 
 * @param	{DwtControl}	shell		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		ZmDialog
 */
ZmChooseFolderDialog = function(parent, className) {
	var newButton = new DwtDialog_ButtonDescriptor(ZmChooseFolderDialog.NEW_BUTTON, ZmMsg._new, DwtDialog.ALIGN_LEFT);
	var params = {parent:parent, className:className, extraButtons:[newButton], id:"ChooseFolderDialog"};
	ZmDialog.call(this, params);

	this._createControls();
	this._setNameField(this._inputDivId);
	this.registerCallback(ZmChooseFolderDialog.NEW_BUTTON, this._showNewDialog, this);
	this._changeListener = new AjxListener(this, this._folderTreeChangeListener);

	this._treeView = {};
	this._creatingFolder = false;
	this._treeViewListener = new AjxListener(this, this._treeViewSelectionListener);

	this._multiAcctOverviews = {};
};

ZmChooseFolderDialog.prototype = new ZmDialog;
ZmChooseFolderDialog.prototype.constructor = ZmChooseFolderDialog;

ZmChooseFolderDialog.prototype.isZmChooseFolderDialog = true;
ZmChooseFolderDialog.prototype.toString = function() { return "ZmChooseFolderDialog"; };

ZmChooseFolderDialog.NEW_BUTTON = ++DwtDialog.LAST_BUTTON;


/**
 * Since this dialog is intended for use in a variety of situations, we need to be
 * able to create different sorts of overviews based on what the calling function
 * wants. By default, we show the folder tree view.
 * 
 * @param {Hash}	params				a hash of parameters
 * @param	{Object}	params.data					a array of items, a folder, an item or <code>null</code>
 * @param	{Array}	params.treeIds				a list of trees to show
 * @param	{String}	params.overviewId			the overview ID
 * @param	{Hash}	params.omit					a list IDs to not show
 * @param	{String}	params.title					the dialog title
 * @param	{String}	params.description			the description of what the user is selecting
 * @param	{Boolean}	params.skipReadOnly		if <code>true</code>, read-only folders will not be displayed
 * @param	{Boolean}	params.skipRemote			if <code>true</code>, remote folders (mountpoints) will not be displayed
 * @param	{Boolean}	params.hideNewButton 		if <code>true</code>, new button will not be shown
 * @param	{Boolean}	params.noRootSelect			if <code>true</code>, do not make root tree item(s) selectable
 * @params  {Boolean}   params.showDrafts			if <code>true</code>, drafts folder will not be omited
 */
ZmChooseFolderDialog.prototype.popup =
function(params) {

	this._keyPressedInField = false; //see comment in _handleKeyUp

	// use reasonable defaults
	params = params || {};

	// create an omit list for each account
	// XXX: does this need to happen more then once???
	var omitPerAcct = {};
	var accounts = appCtxt.accountList.visibleAccounts;
	for (var i = 0; i < accounts.length; i++) {
		var acct = accounts[i];

		if (params.forceSingle && acct != appCtxt.getActiveAccount()) {
			continue;
		}

		var omit = omitPerAcct[acct.id] = params.omit || {};
		
		omit[ZmFolder.ID_DRAFTS] = !params.showDrafts;
		omit[ZmFolder.ID_OUTBOX] = true;
		omit[ZmFolder.ID_SYNC_FAILURES] = true;
		omit[ZmFolder.ID_DLS] = true;

		var folderTree = appCtxt.getFolderTree(acct);

		// omit any folders that are read only
		if (params.skipReadOnly || params.skipRemote || appCtxt.isOffline) {
			var folders = folderTree.asList({includeRemote : true});
			for (var i = 0; i < folders.length; i++) {
				var folder = folders[i];

				// if skipping read-only,
				if (params.skipReadOnly && folder.link && folder.isReadOnly()) {
					omit[folder.id] = true;
					continue;
				}

				// if skipping remote folders,
				if (params.skipRemote && folder.isRemote()) {
					omit[folders[i].id] = true;
				}
			}
		}
	}

	if (this.setTitle) {
		this.setTitle(params.title || ZmMsg.chooseFolder);
	}
	var descCell = document.getElementById(this._folderDescDivId);
	if (descCell) {
		descCell.innerHTML = params.description || "";
	}

	var treeIds = this._treeIds = (params.treeIds && params.treeIds.length)
		? params.treeIds : [ZmOrganizer.FOLDER];

	// New button doesn't make sense if we're only showing saved searches
	var searchOnly = (treeIds.length == 1 && treeIds[0] == ZmOrganizer.SEARCH);
	var newButton = this._getNewButton();
	if (newButton) {
		newButton.setVisible(!searchOnly && !params.hideNewButton && !appCtxt.isExternalAccount() && !appCtxt.isWebClientOffline());
	}

	this._data = params.data;

	var omitParam = {};
	if (appCtxt.multiAccounts) {
		omitParam[ZmOrganizer.ID_ZIMLET] = true;
		omitParam[ZmOrganizer.ID_ALL_MAILBOXES] = true;
	} else {
		omitParam = omitPerAcct[appCtxt.accountList.mainAccount.id];
	}
	
	var popupParams = {
		treeIds:		treeIds,
		omit:			omitParam,
		omitPerAcct:	omitPerAcct,
		fieldId:		this._folderTreeDivId,
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

	this._acceptFolderMatch = params.acceptFolderMatch;

	// TODO: Refactor packages so that we don't have to bring in so much
	// TODO: code just do make sure this dialog works.
	// TODO: I opened bug 34447 for this performance enhancement.
	var pkg = [];
	if (treeIdMap[ZmOrganizer.BRIEFCASE]) pkg.push("BriefcaseCore","Briefcase");
	if (treeIdMap[ZmOrganizer.CALENDAR]) pkg.push("MailCore","CalendarCore","Calendar");
	if (treeIdMap[ZmOrganizer.ADDRBOOK]) pkg.push("ContactsCore","Contacts");
	if (treeIdMap[ZmOrganizer.FOLDER]) pkg.push("MailCore","Mail");
	if (treeIdMap[ZmOrganizer.TASKS]) pkg.push("TasksCore","Tasks");
	
	AjxDispatcher.require(pkg, true, new AjxCallback(this, this._doPopup, [popupParams]));
};

ZmChooseFolderDialog.prototype._getNewButton =
function () {
	return this.getButton(ZmChooseFolderDialog.NEW_BUTTON);
};

ZmChooseFolderDialog.prototype._doPopup =
function(params) {
	var ov = this._setOverview(params, params.forceSingle);

	if (appCtxt.multiAccounts && !params.forceSingle) {
		// ov is an overview container, and overviewId is the containerId
		this._multiAcctOverviews[params.overviewId] = ov;
		for (var i in this._multiAcctOverviews) {
			this._multiAcctOverviews[i].setVisible(i == params.overviewId);
		}

		var overviews = ov.getOverviews();
		for (var i in overviews) {
			var overview = overviews[i];
            // zimlet overview resets folder list
            // need to stop resetting folder list for each overview
            if (overview._treeIds[0].toLowerCase() != "zimlet") {
                this._resetTree(params.treeIds, overview);
            }
		}

		ov.expandAccountOnly(appCtxt.getActiveAccount());

	} else {
		this._resetTree(params.treeIds, ov);
	}

	if (this.isZmDialog) {
		this._focusElement = this._inputField;
		this._inputField.setValue("");
		ZmDialog.prototype.popup.call(this);
	}
};


ZmChooseFolderDialog.prototype.getOverviewId =
function(part, appName) {
	return appCtxt.getOverviewId([this.toString(), part, appName], null);
};

ZmChooseFolderDialog.prototype.getOverviewId = function(appName) {

	return appCtxt.getOverviewId([this.toString(), appName], null);
};

ZmChooseFolderDialog.prototype._resetTree =
function(treeIds, overview) {

	var account = overview.account || appCtxt.getActiveAccount() || appCtxt.accountList.mainAccount;
	var acctTreeView = this._treeView[account.id] = {};
	var folderTree = appCtxt.getFolderTree(account);

	for (var i = 0; i < treeIds.length; i++) {
		var treeId = treeIds[i];
		var treeView = acctTreeView[treeId] = overview.getTreeView(treeId, true);
		if (!treeView) { continue; }

		// bug #18533 - always make sure header item is visible in "MoveTo" dialog
		var headerItem = treeView.getHeaderItem();
		if (treeIds.length > 1) {
			if (treeId == ZmId.ORG_FOLDER) {
				headerItem.setText(ZmMsg.mailFolders);
			}
			else if (treeId == ZmId.ORG_BRIEFCASE) {
				headerItem.setText(ZmMsg.briefcaseFolders);
			}
		}
		headerItem.setVisible(true, true);

		// expand root item
		var ti = treeView.getTreeItemById(folderTree.root.id);
		ti.setExpanded(true);

		// bug fix #13159 (regression of #10676)
		// - small hack to get selecting Trash folder working again
		var trashId = ZmOrganizer.getSystemId(ZmOrganizer.ID_TRASH, account);
		var ti = treeView.getTreeItemById(trashId);
		if (ti) {
			ti.setData(ZmTreeView.KEY_TYPE, treeId);
		}

		// Do not show "Files shared with me" folder on Move dialog.
		var tiFileShareWithMe = treeView.getTreeItemById(ZmFolder.ID_FILE_SHARED_WITH_ME);
		if (tiFileShareWithMe) {
			tiFileShareWithMe.setVisible(false);
		}

		treeView.removeSelectionListener(this._treeViewListener);
		treeView.addSelectionListener(this._treeViewListener);
	}

	folderTree.removeChangeListener(this._changeListener);
	// this listener has to be added after folder tree view is set
	// (so that it comes after the view's standard change listener)
	folderTree.addChangeListener(this._changeListener);

	this._loadFolders();
	this._resetTreeView(true);
};

ZmChooseFolderDialog.prototype.reset =
function() {
	var descCell = document.getElementById(this._folderDescDivId);
	descCell.innerHTML = "";
	ZmDialog.prototype.reset.call(this);
	this._data = this._treeIds = null;
	this._creatingFolder = false;
};

ZmChooseFolderDialog.prototype._contentHtml =
function() {
	this._inputDivId = this._htmlElId + "_inputDivId";
	this._folderDescDivId = this._htmlElId + "_folderDescDivId";
	this._folderTreeDivId = this._htmlElId + "_folderTreeDivId";

	return AjxTemplate.expand("share.Widgets#ZmChooseFolderDialog", {id:this._htmlElId});
};

ZmChooseFolderDialog.prototype._createControls =
function() {
	this._inputField = new DwtInputField({parent: this});
	document.getElementById(this._inputDivId).appendChild(this._inputField.getHtmlElement());
	this._inputField.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleKeyUp));
	//this._inputField.addListener(DwtEvent.ONKEYDOWN, new AjxListener(this, this._handleKeyDown));
	// unfortunately there's no onkeydown generally set for input fields so above line does not work
	this._inputField.setHandler(DwtEvent.ONKEYDOWN, AjxCallback.simpleClosure(this._handleKeyDown, this));
	this._inputField._inputField.setAttribute('aria-label', ZmMsg.search);
};

ZmChooseFolderDialog.prototype._showNewDialog =
function() {
	var itemType = this._getOverview().getSelected(true);
	var newType = itemType || this._treeIds[0];
	var ftc = this._opc.getTreeController(newType);
	var dialog = ftc._getNewDialog();
	dialog.reset();
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._newCallback, this, [ftc, dialog]);
	dialog.popup();
};

ZmChooseFolderDialog.prototype._newCallback =
function(ftc, dialog, params) {
	ftc._doCreate(params);
	dialog.popdown();
	this._creatingFolder = true;
};

// After the user creates a folder, select it and optionally move items to it.
ZmChooseFolderDialog.prototype._folderTreeChangeListener =
function(ev) {
	if (ev.event == ZmEvent.E_CREATE && this._creatingFolder) {
		var organizers = ev.getDetail("organizers") || (ev.source && [ev.source]);
		var org = organizers[0];
		if (org) {
			var tv = this._treeView[org.getAccount().id][org.type];
			tv.setSelected(org, true);
			if (this._moveOnFolderCreate && !ev.shiftKey && !ev.ctrlKey) {
				tv._itemClicked(tv.getTreeItemById(org.id), ev);
			}
		}
		this._creatingFolder = false;
	}
	this._loadFolders();
};

ZmChooseFolderDialog.prototype._okButtonListener =
function(ev) {
    var tgtFolder = this._getOverview().getSelected(false);
    var tgtType   = this._getOverview().getSelected(true);
    var folderList = (tgtFolder && (!(tgtFolder instanceof Array)))
		? [tgtFolder] : tgtFolder;

	var msg = (!folderList || (folderList && folderList.length == 0))
		? ZmMsg.noTargetFolder : null;

	// check for valid target
	if (!msg && this._data) {
		for (var i = 0; i < folderList.length; i++) {
			var folder = folderList[i];
			//Note - although this case is checked in mayContain, I do not change mayContain since mayContain is complicated and returns a boolean and used from DnD and is overridden a bunch of times.
			//Only here we need the special message (see bug 82064) so I settle for that for now.
			if (this._data.isZmFolder && !folder.isInTrash() && folder.hasChild(this._data.name) && !this._acceptFolderMatch) {
				msg = ZmMsg.folderAlreadyExistsInDestination;
				break;
			}
			else if (folder.mayContain && !folder.mayContain(this._data, tgtType, this._acceptFolderMatch)) {
				if (this._data.isZmFolder) {
					msg = ZmMsg.badTargetFolder; 
				} else {
					var items = AjxUtil.toArray(this._data);
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if (!item) {
							continue;
						}
						if (item.isDraft && (folder.nId != ZmFolder.ID_TRASH && folder.nId != ZmFolder.ID_DRAFTS && folder.rid != ZmFolder.ID_DRAFTS)) {
							// can move drafts into Trash or Drafts
							msg = ZmMsg.badTargetFolderForDraftItem;
							break;
						} else if ((folder.nId == ZmFolder.ID_DRAFTS || folder.rid == ZmFolder.ID_DRAFTS) && !item.isDraft)	{
							// only drafts can be moved into Drafts
							msg = ZmMsg.badItemForDraftsFolder;
							break;
						}
					}	
					if(!msg) {
						msg = ZmMsg.badTargetFolderItems; 
					}
				}
				break;
			}
		}
	}

	if (msg) {
		this._showError(msg);
	} else {
		DwtDialog.prototype._buttonListener.call(this, ev, [tgtFolder]);
	}
};

ZmChooseFolderDialog.prototype._getTabGroupMembers =
function() {
	return AjxUtil.collapseList([this._inputField, this._overview[this._curOverviewId]]);
};

ZmChooseFolderDialog.prototype._loadFolders =
function() {
	this._folders = [];

	for (var accountId in this._treeView) {
		var treeViews = this._treeView[accountId];

		for (var type in treeViews) {
			var treeView = treeViews[type];
			if (!treeView) { continue; }

			var items = treeView.getTreeItemList();
			for (var i = 0, len = items.length; i < len; i++) {
				var ti = items[i];
				if (!ti.getData) {  //not sure if this could happen but it was here before my refactoring.
					continue;
				}
				var folder = items[i].getData(Dwt.KEY_OBJECT);
				if (!folder || folder.nId == ZmOrganizer.ID_ROOT || folder.nId == ZmOrganizer.ID_FILE_SHARED_WITH_ME) {
					continue;
				}
				var name = folder.getName(false, null, true, true).toLowerCase();
				var path = "/" + folder.getPath(false, false, null, true).toLowerCase();
				this._folders.push({id: folder.id, type: type, name: name, path: path, accountId: accountId});
			}
		}
	}
};

ZmChooseFolderDialog.prototype._handleKeyDown =
function(ev) {
	this._keyPressedInField = true; //see comment in _handleKeyUp
};

ZmChooseFolderDialog.prototype._handleKeyUp =
function(ev) {

	// this happens in the case of SearchFolder when the keyboard shortcut "s" was released when this
	// field was in focus but it does not affect the field since it was not pressed here.
	// (Bug 52983)
	// in other words, the sequence that caused the bug is:
	// 1. "s" keyDown triggering ZmDialog.prototype.popup()
	// 2. ZmDialog.prototype.popup setting focus on the input field
	// 3. "s" keyUp called triggering ZmChooseFolderDialog.prototype._handleKeyUp.
	// Note that this is reset to false in the popup only, since only one time we need this protection, and it's the simplest.
	if (!this._keyPressedInField) {
		return;
	}

	var key = DwtKeyEvent.getCharCode(ev);
	if (key === DwtKeyEvent.KEY_TAB) {
		return;
	}
    else if (key === DwtKeyEvent.KEY_ARROW_DOWN) {
		this._overview[this._curOverviewId].focus();
		return;
	}

	var num = 0, firstMatch, matches = [];
	var value = this._inputField.getValue().toLowerCase();
	for (var i = 0, len = this._folders.length; i < len; i++) {
		var folderInfo = this._folders[i];
		var treeView = this._treeView[folderInfo.accountId][folderInfo.type];
		var ti = treeView.getTreeItemById(folderInfo.id);
		if (ti) {
			var testPath = "/" + value.replace(/^\//, "");
			var path = folderInfo.path;
			if (folderInfo.name.indexOf(value) == 0 ||
				(path.indexOf(testPath) == 0 && (path.substr(testPath.length).indexOf("/") == -1))) {

				matches.push(ti);
				var activeAccountId = appCtxt.getActiveAccount().id;
				//choose the FIRST of active account folders. 
				if (!firstMatch || (folderInfo.accountId == activeAccountId
								&&	firstMatch.accountId != activeAccountId)) {
                    firstMatch = folderInfo;
                }
			}
		}
	}

	// now that we know which folders match, hide all items and then show
	// the matches, expanding their parent chains as needed
	this._resetTreeView(false);

	for (var i = 0, len = matches.length; i < len; i++) {
		var ti = matches[i];
		ti._tree._expandUp(ti);
		ti.setVisible(true);
	}

	if (firstMatch) {
		var tv = this._treeView[firstMatch.accountId][firstMatch.type];
		var ov = this._getOverview();
		if (ov) {
			ov.deselectAllTreeViews();
		}
		tv.setSelected(appCtxt.getById(firstMatch.id), true, true);
		if (appCtxt.multiAccounts) {
		    var ov = this._getOverview();
		    for (var h in ov._headerItems) {
			ov._headerItems[h].setExpanded((h == firstMatch.accountId), false, false);
		    }
		}
	}
};

ZmChooseFolderDialog.prototype._resetTreeView =
    function(visible) {
	for (var i = 0, len = this._folders.length; i < len; i++) {
		var folderInfo = this._folders[i];
		var tv = this._treeView[folderInfo.accountId][folderInfo.type];
		var ti = tv.getTreeItemById(folderInfo.id);
		if (ti) {
			ti.setVisible(visible);
			ti.setChecked(false, true);
		}
	}
};

ZmChooseFolderDialog.prototype._getOverview =
function() {
	var ov;
	if (appCtxt.multiAccounts) {
		ov = this._opc.getOverviewContainer(this._curOverviewId);
	}

	// this covers the case where we're in multi-account mode, but dialog was
	// popped up in "forceSingle" mode
	return (ov || ZmDialog.prototype._getOverview.call(this));
};

ZmChooseFolderDialog.prototype._treeViewSelectionListener =
function(ev) {
	if (ev.detail != DwtTree.ITEM_SELECTED &&
		ev.detail != DwtTree.ITEM_DBL_CLICKED)
	{
		return;
	}
	var treeItem = ev.item;
	if (treeItem && !treeItem.isSelectionEnabled()) {
		// Selection should have been blocked, but only allow a double click if the item can be selected
		return;
	}

	if (this._getOverview() instanceof ZmAccountOverviewContainer) {
		if (ev.detail == DwtTree.ITEM_DBL_CLICKED &&
			ev.item instanceof DwtHeaderTreeItem)
		{
			return;
		}

		var oc = this._opc.getOverviewContainer(this._curOverviewId);
		var overview = oc.getOverview(ev.item.getData(ZmTreeView.KEY_ID));
		oc.deselectAll(overview);
	}

	var organizer = ev.item && ev.item.getData(Dwt.KEY_OBJECT);
	if (organizer.id == ZmFolder.ID_LOAD_FOLDERS) {
		return;
	}
	var value = organizer ? organizer.getName(null, null, true) : ev.item.getText();
	this._inputField.setValue(value);
	if (ev.detail == DwtTree.ITEM_DBL_CLICKED || ev.enter) {
		this._okButtonListener();
	}
};

ZmChooseFolderDialog.prototype._enterListener =
function(ev) {
	this._okButtonListener.call(this, ev);
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmChooseAccountDialog")) {
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

/**
 * Creates a dialog with a list of visible accounts to choose from
 * @class
 * This class represents choose account dialog.
 *
 * @param	{DwtControl}	parent		the parent, usually the global DwtShell
 *
 * @extends		ZmDialog
 */
ZmChooseAccountDialog = function(parent) {
	ZmDialog.call(this, {parent:parent});
	this._createControls();
};

ZmChooseAccountDialog.prototype = new ZmDialog;
ZmChooseAccountDialog.prototype.constructor = ZmChooseAccountDialog;

ZmChooseAccountDialog.prototype.toString =
function() {
	return "ZmChooseAccountDialog";
};

/**
 * Pops up this dialog
 *
 * @param selectedAccount	{ZmZimbraAccount}	Optional. The account to have initially "selected". Otherwise, the active account is selected.
 * @param accountType		{String}			Optional. Only offer accounts of this type. Otherwise, all visible accounts are offered.
 * @param chooserMessage	{String}			Optional. The message to prompt user with. A default message is used if none provided.
 * @param title				{String}			Optional. Dialog title.
 */
ZmChooseAccountDialog.prototype.popup =
function(selectedAccount, accountType, chooserMessage, title) {
	this.setTitle(title || ZmMsg.chooseAccount);

	this._chooseMessageEl.innerHTML = chooserMessage || ZmMsg.chooseAccount;

	var activeAcct = selectedAccount || appCtxt.getActiveAccount();
	var accounts = appCtxt.accountList.visibleAccounts;

	var html = [];
	var idx = 0;

	html[idx++] = "<table role='presentation' border=0 cellpadding=1 cellspacing=1>";
	for (var i = 0; i < accounts.length; i++) {
		var acct = accounts[i];
		if (appCtxt.isOffline && acct.isMain) { continue; }
		if (accountType && acct.type != accountType) { continue; }

		var icon = appCtxt.isOffline ? acct.getIcon() : null;
		var inputId = Dwt.getNextId();

		html[idx++] = "<tr><td><input type='checkbox' name='";
		html[idx++] = this._inputName;
		html[idx++] = "'";
		if (acct == activeAcct) {
			html[idx++] = " checked";
		}
		html[idx++] = " _acctId='";
		html[idx++] = acct.id;
		html[idx++] = "' id='";
		html[idx++] = inputId;
		html[idx++] = "'></td>";
		if (icon) {
			html[idx++] = "<td>";
			html[idx++] = AjxImg.getImageHtml(icon);
			html[idx++] = "</td>";
		}
		html[idx++] = "<td><label for='";
		html[idx++] = inputId;
		html[idx++] = "'>";
		html[idx++] = acct.getDisplayName();
		html[idx++] = "</label></td></tr>";
	}
	html[idx++] = "</table>";
	this._accountSelectEl.innerHTML = html.join("");

	ZmDialog.prototype.popup.call(this);
};

ZmChooseAccountDialog.prototype._okButtonListener =
function(ev) {
	var selected = document.getElementsByName(this._inputName);
	var accountIds = [];
	for (var i = 0; i < selected.length; i++) {
		if (selected[i].checked) {
			accountIds.push(selected[i].getAttribute("_acctId"));
		}
	}
	DwtDialog.prototype._buttonListener.call(this, ev, [accountIds]);
};

ZmChooseAccountDialog.prototype._enterListener =
function(ev) {
	this._okButtonListener.call(this, ev);
};

ZmChooseAccountDialog.prototype._contentHtml =
function() {
	return AjxTemplate.expand("share.Widgets#ZmChooseAccountDialog", {id:this._htmlElId});
};

ZmChooseAccountDialog.prototype._createControls =
function() {
	this._accountSelectEl = document.getElementById(this._htmlElId+"_accountSelectId");
	this._chooseMessageEl = document.getElementById(this._htmlElId+"_chooseAccountMsg");
	this._inputName = this._htmlElId + "_accountCheckbox";
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmDumpsterDialog")) {
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
 * Creates a dialog containing a listview of items that were (hard) deleted by
 * the user.
 * @class
 * This class represents a dumpster dialog.
 *
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		ZmDialog
 */
ZmDumpsterDialog = function(parent, className) {

	var params = {
		parent: parent,
		className: (className || "ZmDumpsterDialog"),
		title: ZmMsg.recoverDeletedItems,
		standardButtons: [DwtDialog.CANCEL_BUTTON]
	};
	ZmDialog.call(this, params);

	this.getButton(DwtDialog.CANCEL_BUTTON).setText(ZmMsg.close);

	this._controller = new ZmDumpsterListController(this);
};

ZmDumpsterDialog.prototype = new ZmDialog;
ZmDumpsterDialog.prototype.constructor = ZmDumpsterDialog;

ZmDumpsterDialog.prototype.toString =
function() {
	return "ZmDumpsterDialog";
};

ZmDumpsterDialog.prototype.popup =
function(searchFor, types) {
	this._searchTypes = types ? AjxUtil.toArray(types) : [ZmItem.MSG];
	this._searchFor = searchFor;
	this.runSearchQuery("");

	ZmDialog.prototype.popup.call(this);
};


ZmDumpsterDialog.prototype.runSearchQuery =
function(query) {
	var types = this._searchTypes;
	var searchFor = this._searchFor;
	var params = {
		query: "-in:/Junk " + query, // Users don't want/need to recover deleted spam.
		searchFor: searchFor,
		types: types,
		sortBy: ZmSearch.DATE_DESC,
		noRender: true,
		inDumpster: true,
		skipUpdateSearchToolbar: true, //don't update the main app search toolbar. Otherwise the main app is updated to weird stuff like the mixed view of everything.
		callback: this._controller.show.bind(this._controller, [types])
	};
	this._controller.show(types, null); // Clear the list & set headers
	appCtxt.getSearchController().search(params);

};

ZmDumpsterDialog.prototype.popdown =
function() {
	ZmDialog.prototype.popdown.call(this);
	if (this._inputField) {
		this._inputField.clear(); //clear for next time
	}

	this._controller.cleanup();
};

ZmDumpsterDialog.prototype._contentHtml =
function() {
	this._inputContainerId = this._htmlElId + "_inputContainerId";
	this._searchButtonContainerId = this._htmlElId + "_searchButtonContainerId";
	return AjxTemplate.expand("share.Widgets#ZmDumpsterDialog", {id:this._htmlElId});
};

ZmDumpsterDialog.prototype._listSelectionListener =
function(ev) {
	var sel = this._listview.getSelection() || [];
	this._toolbar.enableAll((sel.length > 0));
};

ZmDumpsterDialog.prototype._handleInputFieldKeyDown =
function(ev) {
	if (ev.keyCode == 13 || ev.keyCode == 3) {
		this._controller._searchListener();
	}
};



ZmDumpsterDialog.prototype._resetTabFocus =
function(){
	this._tabGroup.setFocusMember(this._inputField, true);
};

/**
 * adds non-standard elements to tab group.
 */
ZmDumpsterDialog.prototype._updateTabGroup =
function() {
	this._tabGroup.addMember(this._inputField);
	this._tabGroup.addMember(this._searchButton);
};

ZmDumpsterDialog.prototype._initializeSearchBar =
function(listener) {

	this._inputField = new DwtInputField({parent: this});
	this._inputField.addListener(DwtEvent.ONKEYUP, this._handleInputFieldKeyDown.bind(this));//this._controller._searchListener.bind(this._controller));

	document.getElementById(this._inputContainerId).appendChild(this._inputField.getHtmlElement());

	var el = document.getElementById(this._searchButtonContainerId);
	var params = {parent:this, parentElement:el, id: "searchDumpsterButton"};

	var button = this._searchButton = new DwtButton(params);
	el.style.paddingLeft="4px";

	button.setText(ZmMsg.search);
	button.addSelectionListener(listener);
};

ZmDumpsterDialog.prototype.getSearchText =
function() {
	return this._inputField.getValue();
};


/**
 * Listview showing deleted items
 *
 * @param parent
 */
ZmDumpsterListView = function(parent, controller) {
	if (!arguments.length) return;
	this._controller = controller;
	var params = {
		parent: parent,
		controller: controller,
		pageless: true,
		view: this._getViewId(),
		headerList: this._getHeaderList(),
		type: this._getType(),
		parentElement: (parent._htmlElId + "_listview")
	};
	this._type = this._getType();

	ZmListView.call(this, params);

	this._listChangeListener = new AjxListener(this, this._changeListener);
};

ZmDumpsterListView.prototype = new ZmListView;
ZmDumpsterListView.prototype.constructor = ZmDumpsterListView;

ZmDumpsterListView.prototype.toString =
function() {
	return "ZmDumpsterListView";
};
ZmDumpsterListView.prototype._getViewId =
function() {
	var type = this._getType();
	var appName = ZmItem.APP[type];
	return "dumpster" + appName;
};

ZmDumpsterListView.prototype._getCellId =
function(item, field) {
	return this._getFieldId(item, field);
};

ZmDumpsterListView.prototype._getType =
function() {
	throw "ZmDumpsterListView.prototype._getType must be overridden by all inheriting classes";
};

ZmDumpsterListView.createView = function(view, parent, controller) {
	var app = view.replace(/^dumpster/,"");
	switch (app) {
		case ZmApp.MAIL:
			return new ZmDumpsterMailListView(parent, controller);
		case ZmApp.CONTACTS:
			return new ZmDumpsterContactListView(parent, controller);
		case ZmApp.CALENDAR:
			return new ZmDumpsterCalendarListView(parent, controller);
		case ZmApp.TASKS:
			return new ZmDumpsterTaskListView(parent, controller);
		case ZmApp.BRIEFCASE:
			return new ZmDumpsterBriefcaseListView(parent, controller);
	}
};


/**
 * Listview showing deleted mail items
 *
 * @param parent
 * @param controller
 */
ZmDumpsterMailListView = function(parent, controller) {
	ZmDumpsterListView.call(this, parent, controller);
};

ZmDumpsterMailListView.prototype = new ZmDumpsterListView;
ZmDumpsterMailListView.prototype.constructor = ZmDumpsterMailListView;
ZmDumpsterMailListView.prototype.toString =
function() {
	return "ZmDumpsterMailListView";
};

ZmDumpsterMailListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_FROM, text:ZmMsg.from, width:ZmMsg.COLUMN_WIDTH_FROM_MLV})),
		(new DwtListHeaderItem({field:ZmItem.F_SUBJECT, text:ZmMsg.subject})),
		(new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.received, width:ZmMsg.COLUMN_WIDTH_DATE}))
	];
};

ZmDumpsterMailListView.prototype._getType =
function() {
	return ZmItem.MSG;
};

ZmDumpsterMailListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {
	var content;
	if (field == ZmItem.F_FROM) {
		var fromAddr = item.getAddress(AjxEmailAddress.FROM);
		if (fromAddr) {
			content = "<span style='white-space:nowrap'>";
			var name = fromAddr.getName() || fromAddr.getDispName() || fromAddr.getAddress();
			content += AjxStringUtil.htmlEncode(name);
			content += "</span>";
		}
	}
	else if (field == ZmItem.F_SUBJECT) {
		var subj = item.subject || ZmMsg.noSubject;
	
		content = AjxStringUtil.htmlEncode(subj);
	}
	if (content) {
		htmlArr[idx++] = content;
	} else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};

ZmDumpsterMailListView.prototype._getToolTip =
function(params) {
	return AjxStringUtil.htmlEncode(params.item.getFragment());
};


/**
 * Listview showing deleted contact items
 *
 * @param parent
 * @param controller
 */
ZmDumpsterContactListView = function(parent, controller) {
	ZmDumpsterListView.call(this, parent, controller);
};

ZmDumpsterContactListView.prototype = new ZmDumpsterListView;
ZmDumpsterContactListView.prototype.constructor = ZmDumpsterContactListView;
ZmDumpsterContactListView.prototype.toString =
function() {
	return "ZmDumpsterContactListView";
};

ZmDumpsterContactListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg.name})),
		(new DwtListHeaderItem({field:ZmItem.F_EMAIL, text:ZmMsg.email, width: 200}))
	];
};

ZmDumpsterContactListView.prototype._getType =
function() {
	return ZmItem.CONTACT;
};

ZmDumpsterContactListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {
	var content;
	if (field == ZmItem.F_NAME) {
		var name = ZmContact.computeFileAs(item);
		content = AjxStringUtil.htmlEncode(name);
	}
	else if (field == ZmItem.F_EMAIL) {
		var email = item.getEmail();
		content = email && AjxStringUtil.htmlEncode(email) || "&nbsp;";
	}
	if (content) {
		htmlArr[idx++] = content;
	} else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};


/**
 * Listview showing deleted calendar items
 *
 * @param parent
 * @param controller
 */
ZmDumpsterCalendarListView = function(parent, controller) {
	ZmDumpsterListView.call(this, parent, controller);
};

ZmDumpsterCalendarListView.prototype = new ZmDumpsterListView;
ZmDumpsterCalendarListView.prototype.constructor = ZmDumpsterCalendarListView;
ZmDumpsterCalendarListView.prototype.toString =
function() {
	return "ZmDumpsterCalendarListView";
};

ZmDumpsterCalendarListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_SUBJECT, text:ZmMsg.subject})),
		(new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.date, width:ZmMsg.COLUMN_WIDTH_DATE_CAL}))
	];
};

ZmDumpsterCalendarListView.prototype._getType =
function() {
	return ZmItem.APPT;
};

ZmDumpsterCalendarListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {
	var content;
	if (field == ZmItem.F_SUBJECT) {
		var subj = item.name;
		content = AjxStringUtil.htmlEncode(subj);
	}
	else if (field == ZmItem.F_DATE) {
		content = item.startDate != null
			? AjxDateUtil.simpleComputeDateStr(item.startDate)
			: "&nbsp;";
	}
	if (content) {
		htmlArr[idx++] = content;
	} else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};

ZmDumpsterCalendarListView.prototype._getToolTip =
function(params) {
	return params.item.fragment;
};


/**
 * Listview showing deleted task items
 *
 * @param parent
 * @param controller
 */
ZmDumpsterTaskListView = function(parent, controller) {
	ZmDumpsterListView.call(this, parent, controller);
};

ZmDumpsterTaskListView.prototype = new ZmDumpsterListView;
ZmDumpsterTaskListView.prototype.constructor = ZmDumpsterTaskListView;
ZmDumpsterTaskListView.prototype.toString =
function() {
	return "ZmDumpsterTaskListView";
};

ZmDumpsterTaskListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_SUBJECT, text:ZmMsg.subject})),
		(new DwtListHeaderItem({field:ZmItem.F_STATUS, text:ZmMsg.status, width:ZmMsg.COLUMN_WIDTH_STATUS_TLV})),
		(new DwtListHeaderItem({field:ZmItem.F_DATE, text:ZmMsg.date, width:ZmMsg.COLUMN_WIDTH_DATE_DUE_TLV}))
	];
};

ZmDumpsterTaskListView.prototype._getType =
function() {
	return ZmItem.TASK;
};

ZmDumpsterTaskListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {
	var content;
	if (field == ZmItem.F_SUBJECT) {
		var subj = item.name;
		content = AjxStringUtil.htmlEncode(subj);
	}
	else if (field == ZmItem.F_STATUS) {
		var status = item.status;
		content = ZmCalItem.getLabelForStatus(item.status);
	}
	else if (field == ZmItem.F_DATE) {
		content = item.endDate != null
			? AjxDateUtil.simpleComputeDateStr(item.endDate)
			: "&nbsp;";
	}
	if (content) {
		htmlArr[idx++] = content;
	} else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};

ZmDumpsterTaskListView.prototype._getToolTip =
function(params) {
	return params.item.fragment;
};


/**
 * Listview showing deleted briefcase items
 *
 * @param parent
 * @param controller
 */
ZmDumpsterBriefcaseListView = function(parent, controller) {
	ZmDumpsterListView.call(this, parent, controller);
};

ZmDumpsterBriefcaseListView.prototype = new ZmDumpsterListView;
ZmDumpsterBriefcaseListView.prototype.constructor = ZmDumpsterBriefcaseListView;
ZmDumpsterBriefcaseListView.prototype.toString =
function() {
	return "ZmDumpsterBriefcaseListView";
};

ZmDumpsterBriefcaseListView.prototype._getHeaderList =
function() {
	return [
		(new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg.name})),
		(new DwtListHeaderItem({field:ZmItem.F_FILE_TYPE, text:ZmMsg.type, width:ZmMsg.COLUMN_WIDTH_TYPE_DLV})),
		(new DwtListHeaderItem({field:ZmItem.F_SIZE, text:ZmMsg.size, width:ZmMsg.COLUMN_WIDTH_SIZE_DLV}))
	];
};

ZmDumpsterBriefcaseListView.prototype._getType =
function() {
	return ZmItem.BRIEFCASE_ITEM;
};

ZmDumpsterBriefcaseListView.prototype._getCellContents =
function(htmlArr, idx, item, field, colIdx, params) {
	var content;
	if (field == ZmItem.F_NAME) {
		var name = item.name;
		content = AjxStringUtil.htmlEncode(name);
	}
	else if (field == ZmItem.F_FILE_TYPE) {
		if (item.isFolder) {
		    content = ZmMsg.folder;
		} else {
		    var mimeInfo = item.contentType ? ZmMimeTable.getInfo(item.contentType) : null;
		    content = mimeInfo ? mimeInfo.desc : "&nbsp;";
		}
	}
	else if (field == ZmItem.F_SIZE) {
		var size = item.size;
		content = AjxUtil.formatSize(size);
	}
	
	if (content) {
		htmlArr[idx++] = content;
	} else {
		idx = ZmListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};


/**
 * Controller for the ZmDumpsterListView
 *
 * @param container		[DwtControl]	container this controller "controls"
 */
ZmDumpsterListController = function(container) {
	ZmListController.call(this, container, appCtxt.getApp(ZmApp.MAIL));
};

ZmDumpsterListController.prototype = new ZmListController;
ZmDumpsterListController.prototype.constructor = ZmDumpsterListController;

ZmDumpsterListController.prototype.toString =
function() {
	return "ZmDumpsterListController";
};

ZmDumpsterListController.prototype.show =
function(types, results) {

	this._appName = ZmItem.APP[types[0]]; // All types should be in the same app
	var view = "dumpster" + this._appName;
	this.setCurrentViewId(view);
	for (var id in this._toolbar) {
		this._toolbar[id].setVisible(id == view);
	}
	for (var id in this._listView) {
		this._listView[id].setVisible(id == view);
	}
	if (results) {
		var searchResults = results.getResponse();
	
		// call base class
		ZmListController.prototype.show.call(this, searchResults, view);

		this._setup(view);
		this._initializeSearchBar();
		this._container._updateTabGroup();
		this._container._inputField.getInputElement().focus(); //this is the only focus way I could get it to focus on the input element.

		var list = searchResults.getResults(searchResults.type);

		this.setList(list);
		this.setHasMore(searchResults.getAttribute("more"));
		this.getCurrentView().set(list);
	} else {
		this.cleanup();
	}
};

ZmDumpsterListController.prototype.cleanup =
function() {
	var currentView = this.getCurrentView();
	if (currentView) {
		currentView.removeAll();
	}
};

ZmDumpsterListController.prototype._createNewView =
function(view) {
	return ZmDumpsterListView.createView(view, this._container, this);
};

ZmDumpsterListController.prototype._setViewContents	=
function(view) {
	this._listView[view].set(this._list);
};

ZmDumpsterListController.prototype._searchListener =
function() {
	var dialog = this._container;
	var keywords = dialog.getSearchText();
	dialog.runSearchQuery(keywords);
};

ZmDumpsterListController.prototype._initializeSearchBar =
function() {
	if (this._searchBarInitialized) {
		return;
	}
	this._searchBarInitialized = true;
	var dialog = this._container;
	dialog._initializeSearchBar(this._searchListener.bind(this));
};


ZmDumpsterListController.prototype._initializeToolBar =
function(view) {
	if (this._toolbar[view]) { return; }

	var overrides = {};
	overrides[ZmOperation.MOVE] = {showImageInToolbar: false,
								   showTextInToolbar : true,
								   textKey: "recoverTo"};
	var tbParams = {
		parent:        this._container,
		className:     "ZmDumpsterDialog-toolbar",
		buttons:       [ZmOperation.MOVE],
		overrides:     overrides,
		posStyle:      Dwt.RELATIVE_STYLE,
		context:       view,
		controller:    this,
		parentElement: (this._container._htmlElId + "_toolbar")
	};
	var tb = this._toolbar[view] = new ZmButtonToolBar(tbParams);
	tb.addSelectionListener(ZmOperation.MOVE, new AjxListener(this, this._moveListener));

};

ZmDumpsterListController.prototype._doMove =
function(items, folder, attrs, isShiftKey) {
	if (!attrs) {
		attrs = {};
	}
	attrs.op = "recover";
	attrs.l = folder.id;
	                                                                                                                                              		
	ZmListController.prototype._doMove.call(this, items, folder, attrs, isShiftKey, true);
};

ZmDumpsterListController.prototype._getMoreSearchParams =
function(params) {
	params.inDumpster = true;
};

ZmDumpsterListController.prototype._getMoveParams =
function(dlg) {
	var params = ZmListController.prototype._getMoveParams.call(this, dlg);
	params.appName = this._appName;
	params.overviewId = dlg.getOverviewId(this._appName);
	params.treeIds = [ZmApp.ORGANIZER[this._appName]];
	params.acceptFolderMatch = true;
	params.showDrafts =	true;
	var omit = {};
	omit[ZmFolder.ID_SPAM] = true;
	//bug:60237 remote folders should be excluded from the recovery folder selection
    var folderTree = appCtxt.getFolderTree();
	if (!folderTree) { return params; }
	var folders = folderTree.getByType(ZmApp.ORGANIZER[this._appName]);
	for (var i = 0; i < folders.length; i++) {
		var folder = folders[i];
        if(folder.link && folder.isRemote()) {
          omit[folder.id] = true;
        }
	}
	params.omit = omit;
	return params;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmRenameFolderDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a rename folder dialog.
 * @class
 * This class represents a rename folder dialog.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		ZmDialog
 */
ZmRenameFolderDialog = function(parent, className) {

	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.renameFolder, id:"RenameFolderDialog"});

	this._setNameField(this._nameFieldId);
};

ZmRenameFolderDialog.prototype = new ZmDialog;
ZmRenameFolderDialog.prototype.constructor = ZmRenameFolderDialog;

ZmRenameFolderDialog.prototype.toString = 
function() {
	return "ZmRenameFolderDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmFolder}		folder		the folder
 * @param	{Object}		[source]	(not used)
 */
ZmRenameFolderDialog.prototype.popup =
function(folder, source) {
	ZmDialog.prototype.popup.call(this);
	var title = (folder.type == ZmOrganizer.SEARCH) ? ZmMsg.renameSearch : ZmMsg.renameFolder;
	this.setTitle(title + ': ' + folder.getName(false, ZmOrganizer.MAX_DISPLAY_NAME_LENGTH));
	this._nameField.value = folder.getName(false, null, true);
	this._folder = folder;
};

ZmRenameFolderDialog.prototype._contentHtml = 
function() {
	this._nameFieldId = this._htmlElId + "_name";
	var subs = {id:this._htmlElId, newLabel:ZmMsg.newName};
	return AjxTemplate.expand("share.Dialogs#ZmRenameDialog", subs);
};

ZmRenameFolderDialog.prototype._okButtonListener =
function(ev) {
	var results = this._getFolderData();
	if (results) {
		DwtDialog.prototype._buttonListener.call(this, ev, results);
	}
};

ZmRenameFolderDialog.prototype._getFolderData =
function() {
	// check name for presence and validity
	var name = AjxStringUtil.trim(this._nameField.value);
	var msg = ZmFolder.checkName(name, this._folder.parent);

	// make sure another folder with this name doesn't already exist at this level
	if (!msg) {
		var folder = this._folder.parent.getByName(name);
        var folderType = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getFolderTypeByName(name);
        if (folder && (folder.id != this._folder.id)) {
			msg = AjxMessageFormat.format(ZmMsg.errorAlreadyExists, [name,ZmMsg[folderType.toLowerCase()]]);
		}
	}

	return (msg ? this._showError(msg) : [this._folder, name]);
};

ZmRenameFolderDialog.prototype._enterListener =
function(ev) {
	var results = this._getFolderData();
	if (results) {
		this._runEnterCallback(results);
	}
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmRenameTagDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates a rename tag dialog.
 * @class
 * This class represents a rename tag dialog.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		ZmDialog
 */
ZmRenameTagDialog = function(parent, className) {

	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.renameTag, id:"RenameTagDialog"});

	this._setNameField(this._nameFieldId);
};

ZmRenameTagDialog.prototype = new ZmDialog;
ZmRenameTagDialog.prototype.constructor = ZmRenameTagDialog;

ZmRenameTagDialog.prototype.toString = 
function() {
	return "ZmRenameTagDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmTag}		tag		the tag
 * @param	{Object}		[source]	(not used)
 */
ZmRenameTagDialog.prototype.popup =
function(tag, source) {
	ZmDialog.prototype.popup.call(this);
	this.setTitle(ZmMsg.renameTag + ': ' + tag.getName(false, ZmOrganizer.MAX_DISPLAY_NAME_LENGTH));
	this._nameField.value = tag.getName(false, null, true);
	this._tag = tag;
};

ZmRenameTagDialog.prototype._contentHtml = 
function() {
	this._nameFieldId = this._htmlElId + "_name";
	var subs = {id:this._htmlElId, newLabel:ZmMsg.newTagName};
	return AjxTemplate.expand("share.Dialogs#ZmRenameDialog", subs);
};

ZmRenameTagDialog.prototype._okButtonListener =
function(ev) {
	var results = this._getTagData();
	if (results) {
		DwtDialog.prototype._buttonListener.call(this, ev, results);
	}
};

ZmRenameTagDialog.prototype._getTagData =
function() {
	// check name for presence and validity
	var name = AjxStringUtil.trim(this._nameField.value);
	var msg = ZmTag.checkName(name);
	
	// make sure tag name doesn't already exist
	if (!msg) {
		var tagTree = appCtxt.getTagTree();
		if (tagTree) {
			var t = tagTree.getByName(name);
			if (t && (t.id != this._tag.id)) {
				msg = ZmMsg.tagNameExists;
			}
		}
	}

	return (msg ? this._showError(msg) : [this._tag, name]);
};

ZmRenameTagDialog.prototype._enterListener =
function(ev) {
	var results = this._getTagData();
	if (results) {
		this._runEnterCallback(results);
	}
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmPasswordUpdateDialog")) {
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
 * Creates a password update dialog.
 * @class
 * This class represents a password update dialog.
 *
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		ZmDialog
 */
ZmPasswordUpdateDialog = function(parent, className) {

	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.changePassword, id:"PasswdChangeDialog"});
	this._setNameField(this._nameFieldId);
    this._createControls();
};

ZmPasswordUpdateDialog.prototype = new ZmDialog;
ZmPasswordUpdateDialog.prototype.constructor = ZmPasswordUpdateDialog;

ZmPasswordUpdateDialog.prototype.toString =
function() {
	return "ZmPasswordUpdateDialog";
};

/**
 * Pops-up the dialog.
 */
ZmPasswordUpdateDialog.prototype.popup =
function(acct) {
   	ZmDialog.prototype.popup.call(this);
    this.acct = acct;
    var desc  = document.getElementById(this._htmlElId + "_desc");
    this._toggleOKButton(false);
    desc.innerHTML = AjxMessageFormat.format(ZmMsg.offlinePasswordUpdate, this.acct.name);
    var acctTd  = document.getElementById(this._htmlElId + "_acct");
    acctTd.innerHTML = this.acct.name;
	this._nameField.value = "";
};

ZmPasswordUpdateDialog.prototype._createControls =
function() {
    this.setTitle(ZmMsg.offlineAccountAuth);
    this._toggleOKButton(false);
    var cancelBtn = this.getButton(DwtDialog.CANCEL_BUTTON);
    cancelBtn.setText(ZmMsg.dismiss);
    var okBtn = this.getButton(DwtDialog.OK_BUTTON);
	okBtn.setText(ZmMsg.save);
    this._nameField._dlgEl = this._htmlElId;
    Dwt.setHandler(this._nameField, DwtEvent.ONKEYUP, this._handleKeyUp);

};


ZmPasswordUpdateDialog.prototype._contentHtml =
function() {
	this._nameFieldId = this._htmlElId + "_name";
	var subs = {id:this._htmlElId, labelAcct:ZmMsg.account, labelPasswd:ZmMsg.password};
	return AjxTemplate.expand("share.Dialogs#ZmPasswordUpdateDialog", subs);
};

ZmPasswordUpdateDialog.prototype._okButtonListener =
function(ev) {
    var pwd = AjxStringUtil.trim(this._nameField.value);
    if (pwd && pwd.length > 0 ) {
        var soapDoc = AjxSoapDoc.create("ChangePasswordRequest", "urn:zimbraOffline");
        soapDoc.setMethodAttribute("id", this.acct.id);
        soapDoc.set("password", pwd);

        appCtxt.getAppController().sendRequest({
            soapDoc:soapDoc,
            asyncMode:true,
            noBusyOverlay:true,
            callback: new AjxCallback(this, this._handlePasswordUpdateResult),
            accountName:this.name
        });
    }
};


/**
 *  Updates password for specified account
 *
 */

ZmPasswordUpdateDialog.prototype._handlePasswordUpdateResult =
function(result) {
    var resp = result.getResponse();
    resp = resp.ChangePasswordResponse;
    if (resp && resp.status == "success") {
        this.popdown();
        var msg = AjxMessageFormat.format(ZmMsg.offlinePasswordUpdateSuccess, this.acct.name);
        appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_INFO);
    } else {
        appCtxt.setStatusMsg(ZmMsg.offlinePasswordUpdateFailure, ZmStatusView.LEVEL_WARNING);
        this._nameField.value = "";
        this._toggleOKButton(false);
    }
};

ZmPasswordUpdateDialog.prototype._enterListener =
function(ev) {
	var pwd = AjxStringUtil.trim(this._nameField.value);
    if (pwd && pwd.length > 0 ) {
	    this._okButtonListener();
	}
};

ZmPasswordUpdateDialog.prototype._handleKeyUp =
function(ev) {

    var key = DwtKeyEvent.getCharCode(ev);
	if (key === DwtKeyEvent.KEY_TAB) {
		return;
	}
    var el = DwtUiEvent.getTarget(ev);
    var val = el && el.value;
    var dlgEl  = el && el._dlgEl && DwtControl.ALL_BY_ID[el._dlgEl];
    dlgEl._toggleOKButton(val.length > 0);
};

ZmPasswordUpdateDialog.prototype._toggleOKButton =
function(enable) {
    var okBtn = this.getButton(DwtDialog.OK_BUTTON);
	okBtn.setEnabled(enable);
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmPickTagDialog")) {
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
 */

/**
 * Creates a dialog for choosing a tag.
 * @class
 * This class presents the user with their list of tags in a tree view so that they
 * can choose one. There is a text input that can be used to filter the list.
 *
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends	ZmDialog
 */
ZmPickTagDialog = function(parent, className) {

	var newButton = new DwtDialog_ButtonDescriptor(ZmPickTagDialog.NEW_BUTTON, ZmMsg._new, DwtDialog.ALIGN_LEFT);
	var params = {parent:parent, className:className, title:ZmMsg.pickATag, extraButtons:[newButton], id: "ZmPickTagDialog"};
	ZmDialog.call(this, params);

	this._createControls();
	this._setNameField(this._inputDivId);
	this._tagTreeChangeListener = new AjxListener(this, this._handleTagTreeChange);
	appCtxt.getTagTree().addChangeListener(this._tagTreeChangeListener);
	this.registerCallback(ZmPickTagDialog.NEW_BUTTON, this._showNewDialog, this);
	this._creatingTag = false;
	this._treeViewListener = new AjxListener(this, this._treeViewSelectionListener);
	this._lastVal = "";
};

ZmPickTagDialog.prototype = new ZmDialog;
ZmPickTagDialog.prototype.constructor = ZmPickTagDialog;

ZmPickTagDialog.NEW_BUTTON = DwtDialog.LAST_BUTTON + 1;

ZmPickTagDialog.prototype.toString = 
function() {
	return "ZmPickTagDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @param	{ZmAccount}	params.account		the account
 */
ZmPickTagDialog.prototype.popup = 
function(params) {

	if (appCtxt.isChildWindow) {
		return; //disable for now.
	}

	params = params || {};
	this._account = params.account;

	if (appCtxt.multiAccounts && params.account) {
		appCtxt.getTagTree().removeChangeListener(this._tagTreeChangeListener);
		appCtxt.getTagTree(params.account).addChangeListener(this._tagTreeChangeListener);
	}

	// all this is done here instead of in the constructor due to multi-account issues
	var overviewId = (appCtxt.multiAccounts && params.account)
		? ([this.toString(), "-", params.account.name].join("")) : this.toString();

	var ovParams = {
		overviewId:			overviewId,
		treeIds:			[ZmOrganizer.TAG],
		fieldId:			this._tagTreeDivId,
		account:			params.account
	};
	this._setOverview(ovParams, true);
	this._tagTreeView = this._getOverview().getTreeView(ZmOrganizer.TAG);
	this._tagTreeView.removeSelectionListener(this._treeViewListener);
	this._tagTreeView.addSelectionListener(this._treeViewListener);
	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
	var root = this._tagTreeView.getTreeItemById(rootId);
	if (root) {
		root.enableSelection(false);
	}

	this._loadTags();	// item list for this account's tree view will be cached after the first time
	this._resetTreeView();
	this._focusElement = this._inputField;
	this._inputField.setValue("");
	var tags = appCtxt.getTagTree(this._account).asList();
	if (tags.length == 1) {
		this._tagTreeView.setSelected(tags[0], true, true);
	}
	this.setButtonEnabled(DwtDialog.OK_BUTTON, this._tagTreeView.getSelected());

	ZmDialog.prototype.popup.apply(this, arguments);
};

ZmPickTagDialog.prototype._contentHtml = 
function() {
	this._tagTreeDivId = this._htmlElId + "_tagTreeDivId";
	this._inputDivId = this._htmlElId + "_inputDivId";

	return AjxTemplate.expand("share.Widgets#ZmPickTagDialog", {id:this._htmlElId});
};

ZmPickTagDialog.prototype._createControls =
function() {
	this._inputField = new DwtInputField({parent: this});
	document.getElementById(this._inputDivId).appendChild(this._inputField.getHtmlElement());
	this._inputField.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleKeyUp));
};

ZmPickTagDialog.prototype._showNewDialog = 
function() {
	var dialog = appCtxt.getNewTagDialog();
	dialog.reset();
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._newCallback, this);
	dialog.popup(null, this._account);
};

ZmPickTagDialog.prototype._newCallback = 
function(parent, name) {
	appCtxt.getNewTagDialog().popdown();
	var ttc = this._opc.getTreeController(ZmOrganizer.TAG);
	ttc._doCreate(parent, name);
	this._creatingTag = true;
};

ZmPickTagDialog.prototype._loadTags =
function() {
	this._tags = [];
	var items = this._tagTreeView.getTreeItemList();
	for (var i = 0, len = items.length; i < len; i++) {
		var tag = items[i].getData(Dwt.KEY_OBJECT);
		if (tag.id != ZmOrganizer.ID_ROOT) {
			this._tags.push({id:tag.id, name:tag.getName(false, null, true, true).toLowerCase()});
		}
	}
};

ZmPickTagDialog.prototype._handleTagTreeChange =
function(ev) {
	// TODO - listener for changing tags
	if (ev.event == ZmEvent.E_CREATE && this._creatingTag) {
		var tag = ev.getDetail("organizers")[0];
		this._tagTreeView.setSelected(tag, true);
		this._creatingTag = false;
	}
	this._loadTags();
};

ZmPickTagDialog.prototype._okButtonListener = 
function(ev) {
	var selectedTag = this._tagTreeView.getSelected();
	if (!selectedTag) {
		return;
	}
	DwtDialog.prototype._buttonListener.call(this, ev, [selectedTag]);
};

ZmPickTagDialog.prototype._handleKeyUp =
function(ev) {

	var key = DwtKeyEvent.getCharCode(ev);
	if (key === DwtKeyEvent.KEY_TAB) {
		return;
	}
    else if (key === DwtKeyEvent.KEY_ARROW_DOWN) {
		this._overview[this._curOverviewId].focus();
		return;
	}
	
	var num = 0, firstMatch;
	var value = this._inputField.getValue().toLowerCase();
	if (value == this._lastVal) { return; }
	for (var i = 0, len = this._tags.length; i < len; i++) {
		var tagInfo = this._tags[i];
		var ti = this._tagTreeView.getTreeItemById(tagInfo.id);
		if (ti) {
			var matches = (tagInfo.name.indexOf(value) == 0);
			ti.setVisible(matches);
			if (matches && !firstMatch) {
				firstMatch = tagInfo.id;
			}
		}
	}

	if (firstMatch) {
		this._tagTreeView.setSelected(appCtxt.getById(firstMatch), true, true);
	}
	else {
		this._tagTreeView.deselectAll();
	}
	this.setButtonEnabled(DwtDialog.OK_BUTTON, firstMatch);

	this._lastVal = value;
};

ZmPickTagDialog.prototype._resetTreeView =
function() {
	// make all tree items visible (in case there was prior filtering)
	for (var i = 0, len = this._tags.length; i < len; i++) {
		var ti = this._tagTreeView.getTreeItemById(this._tags[i].id);
		if (ti) {
			ti.setVisible(true);
		}
	}

	this._tagTreeView.getHeaderItem().setExpanded(true, false, true);
};

ZmPickTagDialog.prototype._treeViewSelectionListener =
function(ev) {

	if (ev.detail === DwtTree.ITEM_DESELECTED) {
		this._inputField.setValue("");
		this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
		return;
	}

	if (ev.detail !== DwtTree.ITEM_SELECTED && ev.detail !== DwtTree.ITEM_DBL_CLICKED){
		return;
	}

	if (!ev.item.isSelectionEnabled()) {
		return;
	}

	var tag = ev.item.getData(Dwt.KEY_OBJECT);
	if (tag) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
		var value = tag.getName(false, null, true, true);
		this._lastVal = value.toLowerCase();
		this._inputField.setValue(value);
		if (ev.detail == DwtTree.ITEM_DBL_CLICKED || ev.enter) {
			this._okButtonListener();
		}
	}
};

ZmPickTagDialog.prototype._getTabGroupMembers =
function() {
	return [this._inputField, this._overview[this._curOverviewId]];
};

ZmPickTagDialog.prototype._enterListener =
function(ev) {
	this._okButtonListener.call(this, ev);
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmUploadDialog")) {
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
 */

/**
 * Creates an upload dialog.
 * @class
 * This class represents an upload dialog.
 * 
 * @param	{DwtComposite}	shell		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		DwtDialog
 */
ZmUploadDialog = function(shell, className) {
	className = className || "ZmUploadDialog";
	var title = ZmMsg.uploadDocs;
	DwtDialog.call(this, {parent:shell, className:className, title:title});
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._upload));
	this._createUploadHtml();
    this._showLinkTitleText = false;
    this._linkText = {};
	this._controller = null;

	this._inprogress = false;
}

ZmUploadDialog.prototype = new DwtDialog;
ZmUploadDialog.prototype.constructor = ZmUploadDialog;

// Constants

ZmUploadDialog.UPLOAD_FIELD_NAME = "uploadFile";
ZmUploadDialog.UPLOAD_TITLE_FIELD_NAME = "uploadFileTitle";

// Data

ZmUploadDialog.prototype._selector;

ZmUploadDialog.prototype._uploadFolder;
ZmUploadDialog.prototype._uploadCallback;

ZmUploadDialog.prototype._extensions;

// Public methods
/**
 * Enables the link title option.
 * 
 * @param	{Boolean}	enabled		if <code>true</code>, to enbled the link title option
 */
ZmUploadDialog.prototype.enableLinkTitleOption =
function(enabled) {
    this._showLinkTitleText = enabled;    
};

/**
 * Sets allowed extensions.
 * 
 * @param	{Array}		array		an array of extensions
 */
ZmUploadDialog.prototype.setAllowedExtensions =
function(array) {
	this._extensions = array;
	if (array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = array[i].toUpperCase();
		}
	}
};

ZmUploadDialog.prototype.getNotes =
function(){
    return (this._notes ? this._notes.value : "");
};

ZmUploadDialog.prototype.setNotes =
function(notes){
    if(this._notes){
        this._notes.value = (notes || "");
    }
};

ZmUploadDialog.prototype.warnInProgress = function() {
	var msgDlg = appCtxt.getMsgDialog();
	msgDlg.setMessage(ZmMsg.uploadDisabledInProgress, DwtMessageDialog.WARNING_STYLE);
	msgDlg.popup();
}

ZmUploadDialog.prototype.popup =
function(controller, folder, callback, title, loc, oneFileOnly, noResolveAction, showNotes, isImage, conflictAction) {
	if (this._inprogress) {
		this.warnInProgress();
		return;
	}

	this._controller     = controller;
	this._uploadFolder   = folder;
	this._uploadCallback = callback;
	this._conflictAction = conflictAction;
	var aCtxt = ZmAppCtxt.handleWindowOpener();

    this._supportsHTML5 = AjxEnv.supportsHTML5File && !this._showLinkTitleText && (aCtxt.get(ZmSetting.DOCUMENT_SIZE_LIMIT) != null);

	this.setTitle(title || ZmMsg.uploadDocs);

	// reset input fields
	var table = this._tableEl;
	var rows = table.rows;
	while (rows.length) {
		table.deleteRow(rows.length - 1);
	}
	this._addFileInputRow(oneFileOnly);

	// hide/show elements
    var id = this._htmlElId;
    var labelEl = document.getElementById(id+"_label");
    if (labelEl) {
        if(oneFileOnly && isImage){
            labelEl.innerHTML = ZmMsg.uploadChooseImage;
            Dwt.setVisible(labelEl, true);
        }
        else{
            labelEl.innerHTML = ZmMsg.uploadChoose;
            Dwt.setVisible(labelEl, !oneFileOnly);
        }
    }
    var actionRowEl = document.getElementById(id+"_actionRow");
	if (actionRowEl) {
		Dwt.setVisible(actionRowEl, !noResolveAction);
	}

    var notesEl = document.getElementById(id+"_notesTD");
	if (notesEl) {
		Dwt.setVisible(notesEl, showNotes);
	}
    // In case of a single file upload show proper info message

    var docSizeInfo = document.getElementById((id+"_info"));
    var attSize = AjxUtil.formatSize(aCtxt.get(ZmSetting.DOCUMENT_SIZE_LIMIT) || 0, true);
        if(docSizeInfo){
            if(oneFileOnly){
                docSizeInfo.innerHTML = AjxMessageFormat.format(ZmMsg.attachmentLimitMsgSingleFile, attSize);
            }
            else{
                docSizeInfo.innerHTML = AjxMessageFormat.format(ZmMsg.attachmentLimitMsg, attSize);
            }
        }


	// show
	DwtDialog.prototype.popup.call(this, loc);
};

ZmUploadDialog.prototype.popdown =
function() {
	/***
	// NOTE: Do NOT set these values to null! The conflict dialog will
	//       call back to this dialog after it's hidden to process the
	//       files that should be replaced.
	this._uploadFolder = null;
	this._uploadCallback = null;
	/***/

    this._extensions = null;

    //Cleanup
    this._enableStatus = false;

    this._notes.removeAttribute("disabled");
    this.setNotes("");
    this._msgInfo.innerHTML = "";
	this._conflictAction = null;
    
	DwtDialog.prototype.popdown.call(this);
};

ZmUploadDialog.prototype._popupErrorDialog = function(message) {
	var dialog = appCtxt.getMsgDialog();
	dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE, this._title);
	dialog.popup();
};

//to give explicitly the uploadForm, files to upload and folderId used for briefcase
ZmUploadDialog.prototype.uploadFiles =
function(files, uploadForm, folder) {
	if (this._inprogress) {
		this.warnInProgress();
		return;
	}

    if (files.length == 0) {
		return;
	}
    this._uploadFolder = folder;

    var popDownCallback = this.popdown.bind(this);
    var uploadParams = {
        uploadFolder: folder,
        preResolveConflictCallback: popDownCallback,
        errorCallback: popDownCallback,
        finalCallback: this._finishUpload.bind(this),
        docFiles: files
    }

	var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
	var briefcaseApp = aCtxt.getApp(ZmApp.BRIEFCASE);
    var callback =  briefcaseApp.uploadSaveDocs.bind(briefcaseApp, null, uploadParams);

    var uploadMgr = appCtxt.getUploadManager();
	  window._uploadManager = uploadMgr;

    try {
		uploadMgr.execute(callback, uploadForm);
	} catch (ex) {
		if (ex.msg) {
			this._popupErrorDialog(ex.msg);
		} else {
			this._popupErrorDialog(ZmMsg.unknownError);
		}
	}
};

// Protected methods
ZmUploadDialog.prototype._upload = function(){
    var form         	= this._uploadForm;
    var uploadFiles  	= [];
    var errors       	= {};
    this._linkText   	= {};
    var aCtxt        	= ZmAppCtxt.handleWindowOpener();
    var maxSize      	=  aCtxt.get(ZmSetting.DOCUMENT_SIZE_LIMIT);
    var elements     	= form.elements;
    var notes           = this.getNotes();
	var fileObj 		= [];
	var zmUploadManager = appCtxt.getZmUploadManager();
	var file;
    var msgFormat;
    var errorFilenames;
	var newError;
    for (var i = 0; i < elements.length; i++) {
        var element = form.elements[i];
        if ((element.name != ZmUploadDialog.UPLOAD_FIELD_NAME) || !element.value)  continue;

        this._msgInfo.innerHTML = "";
		var errors = [];
        if(this._supportsHTML5){
            var files = element.files;
			var errors = [];
            for (var j = 0; j < files.length; j++){
                file = files[j];
                fileObj.push(file);
				newError = zmUploadManager.getErrors(file, maxSize);
				if (newError) {
					errors.push(newError);
				} else {
                    uploadFiles.push({name: file.name, fullname: file.name, notes: notes});
                }
            }
        } else {
			var fileName = element.value.replace(/^.*[\\\/:]/, "");
            file = { name: fileName };
			newError = zmUploadManager.getErrors(file, maxSize);
			if (newError) {
				errors.push(newError);
			} else {
                uploadFiles.push({ fullname: element.value, name: fileName, notes: notes});
			}
        }
		if(this._showLinkTitleText) {
			var id = element.id;
			id = id.replace("_input", "") + "_titleinput";
			var txtElement = document.getElementById(id);
			if(txtElement) {
				this._linkText[file.name] = txtElement.value;
			}
		}

    }

	if (errors.length > 0) {
		this._msgInfo.innerHTML = zmUploadManager.createUploadErrorMsg(errors, maxSize, "<br>");
	} else if (uploadFiles.length > 0) {
		var briefcaseApp    = aCtxt.getApp(ZmApp.BRIEFCASE);
		var shutDownCallback = null;
		var uploadButton     = null;
		if (this._controller == null) {
			shutDownCallback = this.popdown.bind(this);
		} else {
			var toolbar = this._controller.getCurrentToolbar();
			if (toolbar) {
				uploadButton = toolbar.getOp(ZmOperation.NEW_FILE);
			}
			this.popdown();
			shutDownCallback = this._enableUpload.bind(this, uploadButton);
		}
        var uploadParams = {
			attachment:                 false,
            files:                      fileObj,
            notes:                      notes,
            allResponses:               null,
            start:                      0,
            uploadFolder:               this._uploadFolder,
			completeAllCallback:        briefcaseApp.uploadSaveDocs.bind(briefcaseApp),
			conflictAction:				this._conflictAction || this._selector.getValue(),
            preResolveConflictCallback: shutDownCallback,
            errorCallback:              shutDownCallback,
            completeDocSaveCallback:    this._finishUpload.bind(this, uploadButton),
            docFiles:                   uploadFiles
        }
		uploadParams.progressCallback = this._uploadFileProgress.bind(this, uploadButton, uploadParams);

        try {
            if (this._supportsHTML5) {
                zmUploadManager.upload(uploadParams);
            } else {
				var callback  = briefcaseApp.uploadSaveDocs.bind(briefcaseApp, null, uploadParams);
                var uploadMgr = appCtxt.getUploadManager();
                window._uploadManager = uploadMgr;
                uploadMgr.execute(callback, this._uploadForm);
            }

			if (uploadButton) {
				// The 16x16 upload image has ImgUpload0 (no fill) .. ImgUpload12 (completely filled) variants to give a
				// gross idea of the progress.
				ZmToolBar._setButtonStyle(uploadButton, null, ZmMsg.uploading, "Upload0");
				this._inprogress = true;
			}
        } catch (ex) {
			this._enableUpload(uploadButton);
            if (ex.msg) {
                this._popupErrorDialog(ex.msg);
            } else {
                this._popupErrorDialog(ZmMsg.unknownError);
            }
        }
    }
};

ZmUploadDialog.prototype._uploadFileProgress =
	function(uploadButton, params, progress) {
		if (!uploadButton || !params || !progress.lengthComputable || !params.totalSize) return;

		// The 16x16 upload image has ImgUpload0 (no fill) .. ImgUpload12 (completely filled) variants to give a
		// gross idea of the progress.  A tooltip indicating the progress will be added too.
		var progressFraction = (progress.loaded / progress.total);
		var uploadedSize = params.uploadedSize + (params.currentFileSize * progressFraction);
		var fractionUploaded = uploadedSize/params.totalSize;
		if (fractionUploaded > 1) {
			fractionUploaded = 1;
		}
		var progressBucket = Math.round(fractionUploaded * 12);
		DBG.println(AjxDebug.DBG3,"Upload Progress: total=" + params.totalSize + ", uploadedSize=" + params.uploadedSize +
					", currentSize="+ params.currentFileSize + ", progressFraction=" +
					progressFraction + ", fractionUploaded=" + fractionUploaded + ", progressBucket=" + progressBucket);
		ZmToolBar._setButtonStyle(uploadButton, null, ZmMsg.uploadNewFile, "Upload" + progressBucket.toString());

		var tooltip = AjxMessageFormat.format(ZmMsg.uploadPercentComplete, [ Math.round(fractionUploaded * 100) ] )
		uploadButton.setToolTipContent(tooltip, true);
	};

ZmUploadDialog.prototype._enableUpload = function(uploadButton) {
	if (!uploadButton) return;

	ZmToolBar._setButtonStyle(uploadButton, null, ZmMsg.uploadNewFile, null);
	uploadButton.setToolTipContent(ZmMsg.uploadNewFile, true);
	this._inprogress = false;
};

ZmUploadDialog.prototype._finishUpload = function(uploadButton, docFiles, uploadFolder) {
    var filenames = [];
    for (var i in docFiles) {
        var name = docFiles[i].name;
        if(this._linkText[name]) {
            docFiles[i].linkText = this._linkText[name];
        }
        filenames.push(name);
    }
	this._enableUpload(uploadButton);

    this._uploadCallback.run(uploadFolder, filenames, docFiles);
};

ZmUploadDialog.prototype._addFileInputRow = function(oneInputOnly) {
	var id = Dwt.getNextId();
	var inputId = id + "_input";
	var removeId = id + "_remove";
	var addId = id + "_add";
    var sizeId = id + "_size";

	var table = this._tableEl;
	var row = table.insertRow(-1);

    var cellLabel = row.insertCell(-1);
    cellLabel.innerHTML = ZmMsg.fileLabel;

	var cell = row.insertCell(-1);
	// bug:53841 allow only one file upload when oneInputOnly is set
	cell.innerHTML = [
		"<input id='",inputId,"' type='file' name='",ZmUploadDialog.UPLOAD_FIELD_NAME,"' size=30 ",(this._supportsHTML5 ? (oneInputOnly ? "" : "multiple") : ""),">"
	].join("");

	var cell = row.insertCell(-1);
    cell.id = sizeId;
	cell.innerHTML = "&nbsp;";

    //HTML5
    if(this._supportsHTML5){
        var inputEl = document.getElementById(inputId);
        var sizeEl = cell;
        Dwt.setHandler(inputEl, "onchange", AjxCallback.simpleClosure(this._handleFileSize, this, inputEl, sizeEl));
    }

    if(oneInputOnly){
        cell.colSpan = 3;
    }else{    
        var cell = row.insertCell(-1);
        cell.innerHTML = [
            "<span ",
            "id='",removeId,"' ",
            "onmouseover='this.style.cursor=\"pointer\"' ",
            "onmouseout='this.style.cursor=\"default\"' ",
            "style='color:blue;text-decoration:underline;'",
            ">", ZmMsg.remove, "</span>"
        ].join("");
        var removeSpan = document.getElementById(removeId);
        Dwt.setHandler(removeSpan, DwtEvent.ONCLICK, ZmUploadDialog._removeHandler);

        var cell = row.insertCell(-1);
        cell.innerHTML = "&nbsp;";
        var cell = row.insertCell(-1);
        cell.innerHTML = [
            "<span ",
            "id='",addId,"' ",
            "onmouseover='this.style.cursor=\"pointer\"' ",
            "onmouseout='this.style.cursor=\"default\"' ",
            "style='color:blue;text-decoration:underline;'",
            ">", ZmMsg.add, "</span>"
        ].join("");
        var addSpan = document.getElementById(addId);
        Dwt.setHandler(addSpan, DwtEvent.ONCLICK, ZmUploadDialog._addHandler);
    }


    if(this._showLinkTitleText) {
        var txtInputId = id + "_titleinput";
        var txtRow = table.insertRow(-1);
        var txtCell = txtRow.insertCell(-1);
        txtCell.innerHTML = [
    		ZmMsg.linkTitleOptionalLabel
    	].join("");

        txtCell = txtRow.insertCell(-1);
	    txtCell.innerHTML = [
    		"<input id='",txtInputId,"' type='text' name='",ZmUploadDialog.UPLOAD_TITLE_FIELD_NAME,"' size=40>"
    	].join("");
        txtCell.colSpan = 3;
    }
};

ZmUploadDialog.prototype._handleFileSize =
function(inputEl, sizeEl){

    var files = inputEl.files;
    if(!files) return;

    var sizeStr = [], className, totalSize =0;
    for(var i=0; i<files.length;i++){
        var file = files[i];
        var size = file.size || file.fileSize /*Safari*/ || 0;
	    var aCtxt = ZmAppCtxt.handleWindowOpener();
        if(size > aCtxt.get(ZmSetting.DOCUMENT_SIZE_LIMIT))
            className = "RedC";
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

ZmUploadDialog._removeHandler = function(event) {
	var span = DwtUiEvent.getTarget(event || window.event);
	var cell = span.parentNode;
	var row = cell.parentNode;

    var endRow = row;

    if(span.id) {
       var id = span.id;
       id = id.replace("_remove", "") + "_titleinput";
       var txtInput = document.getElementById(id);
       if(txtInput) {
           var txtCell = txtInput.parentNode;
           var txtRow = txtCell.parentNode;
           endRow = txtRow;
       }
    }
    
	if (row.previousSibling == null && endRow.nextSibling == null) {
		var comp = DwtControl.findControl(span);
		comp._addFileInputRow();
	}

    if(endRow != row) {
        endRow.parentNode.removeChild(endRow);
    }

	row.parentNode.removeChild(row);
};

ZmUploadDialog._addHandler = function(event) {
	var span = DwtUiEvent.getTarget(event || window.event);
	var comp = DwtControl.findControl(span);
	comp._addFileInputRow();
};

ZmUploadDialog.prototype._createUploadHtml = function() {
	var id = this._htmlElId;
	var aCtxt = ZmAppCtxt.handleWindowOpener();
    var uri = aCtxt.get(ZmSetting.CSFE_UPLOAD_URI);

    var subs = {
        id: id,
        uri: uri
    };
    this.setContent(AjxTemplate.expand("share.Dialogs#UploadDialog", subs));

    //variables
    this._uploadForm = document.getElementById((id+"_form"));
    this._tableEl = document.getElementById((id + "_table"));
    this._msgInfo = document.getElementById((id+"_msg"));
    this._notes = document.getElementById((id+"_notes"));

    //Conflict Selector
	this._selector = new DwtSelect({parent:this});
	this._selector.addOption(ZmMsg.uploadActionKeepMine, false, ZmBriefcaseApp.ACTION_KEEP_MINE);
	this._selector.addOption(ZmMsg.uploadActionKeepTheirs, false, ZmBriefcaseApp.ACTION_KEEP_THEIRS);
	this._selector.addOption(ZmMsg.uploadActionAsk, true, ZmBriefcaseApp.ACTION_ASK);
	this._selector.reparentHtmlElement((id+"_conflict"));
    
    //Info Section
    var docSizeInfo = document.getElementById((id+"_info"));
    if(docSizeInfo){
        var attSize = AjxUtil.formatSize(aCtxt.get(ZmSetting.DOCUMENT_SIZE_LIMIT) || 0, true)
        docSizeInfo.innerHTML = AjxMessageFormat.format(ZmMsg.attachmentLimitMsg, attSize);
    }
    	
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmUploadConflictDialog")) {
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

ZmUploadConflictDialog = function(shell, className) {
	className = className || "ZmUploadConflictDialog";
	var title = ZmMsg.uploadConflict;
	var standardButtons = [ DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON ];
	DwtDialog.call(this, {parent:shell, className:className, title:title, standardButtons:standardButtons});
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._resolve));

	this._mineId = this._htmlElId+"_mine";
	this._theirsId = this._htmlElId+"_theirs";
	this._viewId = this._htmlElId+"_view";

	this._createUploadHtml();
}
ZmUploadConflictDialog.prototype = new DwtDialog;
ZmUploadConflictDialog.prototype.constructor = ZmUploadConflictDialog;

ZmUploadConflictDialog.prototype.toString = function() {
	return "ZmUploadConflictDialog";
};

// Constants

ZmUploadConflictDialog._MINE = "mine";
ZmUploadConflictDialog._THEIRS = "theirs";

// Data

ZmUploadConflictDialog.prototype._mineId;
ZmUploadConflictDialog.prototype._theirsId;
ZmUploadConflictDialog.prototype._viewId;

ZmUploadConflictDialog.prototype._table;

ZmUploadConflictDialog.prototype._conflicts;
ZmUploadConflictDialog.prototype._conflictCallback;

// Public methods

ZmUploadConflictDialog.prototype.popup = function(folder, conflicts, callback, loc) {
	// save data
	this._uploadFolder = folder;
	this._conflicts = conflicts;
	this._conflictCallback = callback;

	// setup dialog
	var table = this._table;
	for (var i = table.rows.length - 1; i > 0; i--) {
		table.deleteRow(i);
	}

	for (var i = 0; i < conflicts.length; i++) {
		var conflict = conflicts[i];
		this.__addFileRow(table, conflict);
	}

	// show
	DwtDialog.prototype.popup.call(this, loc);
};

ZmUploadConflictDialog.prototype.popdown = function() {
	DwtDialog.prototype.popdown.call(this);
	this._conflictCallback = null;
};

// Protected methods

ZmUploadConflictDialog.prototype._resolve = function(){
	var conflicts = this._conflicts;
	var callback = this._conflictCallback;
	this.popdown();
	if (callback) {
		callback.run(conflicts);
	}
};

ZmUploadConflictDialog.prototype._selectAll = function(mineOrTheirs) {
	var element = this.getHtmlElement();
	var radios = element.getElementsByTagName("INPUT");
	for (var i = 0; i < radios.length; i++) {
		var radio = radios[i];
		if (radio.type != "radio") continue;
		radio.checked = radio.value == mineOrTheirs;
		ZmUploadConflictDialog.__setFileDone(radio);
	}
};

// handlers

ZmUploadConflictDialog._handleMine = function(event) {
	var target = DwtUiEvent.getTarget(event);
	var dialog = Dwt.getObjectFromElement(target);
	dialog._selectAll(ZmUploadConflictDialog._MINE);
};

ZmUploadConflictDialog._handleTheirs = function(event) {
	var target = DwtUiEvent.getTarget(event);
	var dialog = Dwt.getObjectFromElement(target);
	dialog._selectAll(ZmUploadConflictDialog._THEIRS);
};

ZmUploadConflictDialog._handleRadio = function(event) {
	var target = DwtUiEvent.getTarget(event);
	ZmUploadConflictDialog.__setFileDone(target);
};
ZmUploadConflictDialog.__setFileDone = function(radio) {
	var file = Dwt.getObjectFromElement(radio);
	file.done = radio.value == ZmUploadConflictDialog._THEIRS;
};

ZmUploadConflictDialog._handleViewTheirs = function(event) {
	var target = DwtUiEvent.getTarget(event);
	var object = Dwt.getObjectFromElement(target);
	var dialog = object.dialog;
	var file = object.file;

    //module shared by docs edited in new window - use restUrl directly
	var winurl = [
		dialog._uploadFolder.restUrl || dialog._uploadFolder.getRestUrl(),
		"/",
		AjxStringUtil.urlComponentEncode(file.name)
	].join("");
	var winname = "_new";
	var winfeatures = [
		"width=",(window.outerWidth || 640),",",
		"height=",(window.outerHeight || 480),",",
		"location,menubar,",
		"resizable,scrollbars,status,toolbar"
	].join("");

	var win = open(winurl, winname, winfeatures);
};

ZmUploadConflictDialog._handleLinkOver = function(event) {
	this.style.cursor= "pointer";
};
ZmUploadConflictDialog._handleLinkOut = function(event) {
	this.style.cursor= "default";
};

// view creation

ZmUploadConflictDialog.prototype._createUploadHtml = function() {
	var div = document.createElement("DIV");
	div.innerHTML = ZmMsg.uploadConflictDesc;
	div.style.marginBottom = "0.5em";

	var table = this._table = document.createElement("TABLE");
	table.setAttribute('role', 'presentation');
	table.border = 0;
	table.cellPadding = 0;
	table.cellSpacing = 3;

	var row = table.insertRow(-1);

	var cell = row.insertCell(-1);
	var id = this._mineId;
	var text = ZmMsg._new;
	var handler = ZmUploadConflictDialog._handleMine;
	cell.appendChild(this.__createLink(id, text, handler));

	var cell = row.insertCell(-1);
	var id = this._theirsId;
	var text = ZmMsg.old;
	var handler = ZmUploadConflictDialog._handleTheirs;
	cell.appendChild(this.__createLink(id, text, handler));

	var element = this._getContentDiv();
	element.appendChild(div);
	element.appendChild(table);
};

// Private methods

ZmUploadConflictDialog.prototype.__addFileRow = function(table, file) {
	var handler = ZmUploadConflictDialog._handleRadio;

	var row = table.insertRow(-1);

	var cell = row.insertCell(-1);
	var value = ZmUploadConflictDialog._MINE;
	cell.appendChild(this.__createRadio(file.name, value, true, handler, file));

	var cell = row.insertCell(-1);
	var value = ZmUploadConflictDialog._THEIRS;
	cell.appendChild(this.__createRadio(file.name, value, false, handler, file));

	var cell = row.insertCell(-1);
	cell.style.paddingLeft = "1em";
	cell.innerHTML = AjxStringUtil.htmlEncode(file.name);

	var cell = row.insertCell(-1);
	cell.style.paddingLeft = "2em";
	var id = this._viewId+(table.rows.length-1);
	var text = ZmMsg.viewOld;
	var handler = ZmUploadConflictDialog._handleViewTheirs;
	var object = { dialog: this, file: file };
	cell.appendChild(this.__createLink(id, text, handler, object));
};

ZmUploadConflictDialog.prototype.__createRadio =
function(name, value, checked, handler, object) {
	var radio;
	if (AjxEnv.isIE) {
        try {
            // NOTE: This has to be done because IE doesn't recognize the name
            //       attribute if set programmatically.
            var html = [];
            var i = 0;
            html[i++] = "<INPUT type=radio name='";
            html[i++] = name;
            html[i++] = "'";
            if (checked) {
                html[i++] = " checked"
            }
            html[i++] = ">";
            radio = document.createElement(html.join(""));
        } catch (e) {
            // But the above throws an exception for IE9+, non-quirks mode
            radio = this.__createRadio1(checked, name);
        }
	}
	else {
		radio = this.__createRadio1(checked, name);
	}
	radio.value = value;

	if (handler) {
		Dwt.setHandler(radio, DwtEvent.ONCLICK, handler);
		Dwt.associateElementWithObject(radio, object || this);
	}

	return radio;
};

ZmUploadConflictDialog.prototype.__createRadio1 =
function(checked, name) {
    var radio     = document.createElement("INPUT");
    radio.type    = 'radio';
    radio.checked = checked;
    radio.name    = name;
    return radio;
}


ZmUploadConflictDialog.prototype.__createLink =
function(id, text, handler, object) {
	var element = document.createElement("SPAN");
	element.id = id;
	element.style.color = "blue";
	element.style.textDecoration = "underline";
	element.style.padding = "3px";
	element.innerHTML = text;

	Dwt.setHandler(element, DwtEvent.ONMOUSEOVER, ZmUploadConflictDialog._handleLinkOver);
	Dwt.setHandler(element, DwtEvent.ONMOUSEOUT, ZmUploadConflictDialog._handleLinkOut);
	Dwt.setHandler(element, DwtEvent.ONCLICK, handler);
	Dwt.associateElementWithObject(element, object || this);

	return element;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmDebugLogDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a dialog for showing debug log messages.
 * @class
 * This class represents a dialog for showing debug log messages.
 *
 * @param	{DwtControl}	shell		the parent
 *
 * @extends		DwtDialog
 */
ZmDebugLogDialog = function(parent) {

	var title = ZmMsg.debugLog;
	var emailButton = new DwtDialog_ButtonDescriptor(ZmDebugLogDialog.EMAIL_BUTTON, ZmMsg.sendAsEmail, DwtDialog.ALIGN_LEFT);
	var clearButton = new DwtDialog_ButtonDescriptor(ZmDebugLogDialog.CLEAR_BUTTON, ZmMsg.clear, DwtDialog.ALIGN_LEFT);
	DwtDialog.call(this, {parent:parent, title:title, standardButtons:[DwtDialog.OK_BUTTON],
						  extraButtons: [emailButton, clearButton]});

	this.setButtonListener(ZmDebugLogDialog.EMAIL_BUTTON, new AjxListener(this, this._handleEmailButton));
	this.setButtonListener(ZmDebugLogDialog.CLEAR_BUTTON, new AjxListener(this, this._handleClearButton));

	this._setAllowSelection();
	this.setContent(this._contentHtml());
};

ZmDebugLogDialog.prototype = new DwtDialog;
ZmDebugLogDialog.prototype.constructor = ZmDebugLogDialog;

ZmDebugLogDialog.EMAIL_BUTTON = "EMAIL";
ZmDebugLogDialog.CLEAR_BUTTON = "CLEAR";

// Public methods

/**
 * Pops-up the dialog.
 *
 * @param	{string}		content		text to display
 * @param	{constant}		type		logging type (see AjxDebug)
 */
ZmDebugLogDialog.prototype.popup =
function(content, type) {

	this._logType = type;
	this.setTitle(AjxMessageFormat.format(ZmMsg.debugLog, [type]));
	var div = document.getElementById(this._descDivId);
	if (div) {
		var size = AjxDebug.BUFFER_MAX[type];
		div.innerHTML = AjxMessageFormat.format(ZmMsg.debugLogDesc, [size, type]);
	}
	div = document.getElementById(this._contentDivId);
	if (div) {
		div.innerHTML = content;
	}

	DwtDialog.prototype.popup.call(this);
};

// Protected methods

ZmDebugLogDialog.prototype._contentHtml =
function() {

	this._descDivId = this._htmlElId + "_desc";
	this._contentDivId = this._htmlElId + "_log";

	return AjxTemplate.expand("share.Widgets#ZmDebugLogDialog", {id:this._htmlElId});
};

ZmDebugLogDialog.prototype._handleEmailButton =
function(event) {
	this.popdown();
	var div = document.getElementById(this._contentDivId);
	var text = AjxStringUtil.convertHtml2Text(div);
	var params = {action:ZmOperation.NEW_MESSAGE, subjOverride:ZmMsg.debugLogEmailSubject,
				  composeMode: Dwt.TEXT, extraBodyText:text};
	appCtxt.getApp(ZmApp.MAIL).compose(params);
};

ZmDebugLogDialog.prototype._handleClearButton =
function(event) {
	AjxDebug.BUFFER[this._logType] = [];
	var div = document.getElementById(this._contentDivId);
	div.innerHTML = "";
};
}

if (AjxPackage.define("zimbraMail.share.view.htmlEditor.ZmSpellChecker")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Makes server request to check spelling of given text.
 * Use this class to check spelling of any text via {@link check} method.
 *
 * @author Mihai Bazon
 * 
 * @param {ZmHtmlEditor}	parent		the parent needing spell checking
 *
 * @class
 * @constructor
 */
ZmSpellChecker = function(parent) {
	this._parent = parent;
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmSpellChecker.prototype.toString =
function() {
	return "ZmSpellChecker";
};

/**
 * Checks the spelling.
 *
 * @param {Object|String}	textOrParams  the text to check or an object with "text" and "ignore" properties
 * @param {AjxCallback}		callback      the callback for success
 * @param {AjxCallback}		errCallback   	the error callback
 */
ZmSpellChecker.prototype.check =
function(textOrParams, callback, errCallback) {
	var params = typeof textOrParams == "string" ? { text: textOrParams } : textOrParams;
	var soapDoc = AjxSoapDoc.create("CheckSpellingRequest", "urn:zimbraMail");
	soapDoc.getMethod().appendChild(soapDoc.getDoc().createTextNode(params.text));
	if (params.ignore) {
		soapDoc.getMethod().setAttribute("ignore", params.ignore);
	}
	var callback = new AjxCallback(this, this._checkCallback, callback);
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback, errorCallback: errCallback});
};

ZmSpellChecker.prototype._checkCallback =
function(callback, result) {
	var words = result._isException ? null : result.getResponse().CheckSpellingResponse;

	if (callback)
		callback.run(words);
};
}
}
