if (AjxPackage.define("Alert")) {
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
/*
 * Package: Alert
 * 
 * A few classes for flashing titles, icons, etc. 
 */
if (AjxPackage.define("ajax.util.AjxPluginDetector")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Does nothing (static class).
 * @constructor
 * @class
 * 
 * This class provides static methods to determine which standard plugins are
 * installed in the browser.
 *
 * @private
 */
AjxPluginDetector = function() {
}

AjxPluginDetector.canDetectPlugins =
function() {
	return AjxEnv.isIE || (navigator.plugins && navigator.plugins.length > 0);
};

AjxPluginDetector.detectFlash =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('ShockwaveFlash.ShockwaveFlash.1');
	} else {
		return AjxPluginDetector.detectPlugin('Shockwave','Flash'); 
	}
};

AjxPluginDetector.detectPDFReader =
function(){
    if(AjxEnv.isIE){
        return  ( AjxPluginDetector.detectActiveXControl('PDF.PdfCtrl.5')
                || AjxPluginDetector.detectActiveXControl('AcroExch.Document') );
    }else{
        var hasPDFReader = false;
        if(AjxEnv.isChrome){
            hasPDFReader = AjxPluginDetector.detectPlugin('Chrome PDF Viewer');
        }else if(AjxEnv.isFirefox){
            hasPDFReader = AjxPluginDetector.detectPlugin('Firefox PDF Plugin for Mac OS X');
        }
        if(!hasPDFReader){
            hasPDFReader = AjxPluginDetector.detectPlugin('Adobe Acrobat');
        }
        return hasPDFReader;
    }
};

AjxPluginDetector.detectDirector =
function() { 
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('SWCtl.SWCtl.1');
	} else {
		return AjxPluginDetector.detectPlugin('Shockwave','Director');
	}
};

AjxPluginDetector.detectQuickTime =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectQuickTimeActiveXControl();
	} else {
		return AjxPluginDetector.detectPlugin('QuickTime');
	}
};

// If quicktime is installed, returns the version as an array: [major, minor, build]
AjxPluginDetector.getQuickTimeVersion =
function() {
	if(AjxEnv.isIE) {
		var object = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1");
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Quicktime is " + object.IsQuickTimeAvailable(0) ? "available" : "not available");
		if (object.IsQuickTimeAvailable(0)) {
			try {
				var version = Number(object.QuickTimeVersion).toString(16);
				var result = [];
				for(var i = 0; i < 3; i++) {
					result[i] = Number(version.charAt(i));
				}
				return result;
			} catch(e) {
				DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Error while checking QuickTimeVersion: " + e);
			}
		}
		return null;
	} else {
		var match = AjxPluginDetector.matchPluginName(/QuickTime Plug-in (\d+)\.?(\d+)?\.?(\d+)?/);
		if (match) {
			DBG.println("AjxPluginDetector: able to find match for QuickTime plugin with version: " + match);
			var result = [];
			for(var i = 0; i < 3; i++) {
				result[i] = Number(match[i + 1] || 0);
			}
			return result;
		} else {
			DBG.println("AjxPluginDetector: unable to find match for QuickTime plugin with version");
			return null;
		}
	}
};

/**
 * This code is part of JQuery's Flash plugin.
 * http://jquery.lukelutman.com/plugins/flash/
 *
 * @return Flash plugin version
 */
AjxPluginDetector.getFlashVersion =
function() {
    var flashVersion = "0,0,0";
    // ie
    try {
        try {
            // avoid fp6 minor version lookup issues
            // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
            var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
            try {
                axo.AllowScriptAccess = 'always';
            }
            catch(e) {
                return '6,0,0';
            }
        } catch(e) {
            }
        flashVersion = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        // other browsers
    } catch(e) {
        try {
            if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) {
                flashVersion = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
            }
        } catch(e) {
        }
    }
	return flashVersion;
};

AjxPluginDetector.detectReal =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('rmocx.RealPlayer G2 Control') ||
		       AjxPluginDetector.detectActiveXControl('RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)') ||
		       AjxPluginDetector.detectActiveXControl('RealVideo.RealVideo(tm) ActiveX Control (32-bit)');
	} else {
		return AjxPluginDetector.detectPlugin('RealPlayer');
	}
};

AjxPluginDetector.detectWindowsMedia =
function() {
	if(AjxEnv.isIE) {
		return AjxPluginDetector.detectActiveXControl('MediaPlayer.MediaPlayer.1');
	} else {
		return AjxPluginDetector.detectPlugin('Windows Media');
	}
};

AjxPluginDetector.detectPlugin =
function() {
	DBG.println(AjxDebug.DBG1, "-----------------------<br>AjxPluginDetector: Looking for plugin: [" + AjxPluginDetector._argumentsToString(AjxPluginDetector.detectPlugin.arguments) + "]");
	var names = AjxPluginDetector.detectPlugin.arguments;
	var allPlugins = navigator.plugins;
	var pluginsArrayLength = allPlugins.length;
	for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
	    // loop through all desired names and check each against the current plugin name
	    var numFound = 0;
	    for(var namesCounter=0; namesCounter < names.length; namesCounter++) {
			// if desired plugin name is found in either plugin name or description
			if (allPlugins[pluginsArrayCounter]) {
				if( (allPlugins[pluginsArrayCounter].name.indexOf(names[namesCounter]) >= 0)) {
					// this name was found
					DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found name match '" + allPlugins[pluginsArrayCounter].name + "'");
					numFound++;
				} else if (allPlugins[pluginsArrayCounter].description.indexOf(names[namesCounter]) >= 0) {
					// this name was found
					DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found description match '" + allPlugins[pluginsArrayCounter].description + "'");
					numFound++;
				}
			}
	    }
	    // now that we have checked all the required names against this one plugin,
	    // if the number we found matches the total number provided then we were successful
	    if(numFound == names.length) {
			DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Found plugin!<br>-----------------------");
			return true;
	    } else if (numFound) {
			DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Found partial plugin match, numFound=" + numFound);
		}
	}
	DBG.println(AjxDebug.DBG1, "AjxPluginDetector: Failed to find plugin.<br>-----------------------");
	return false;
};

AjxPluginDetector.matchPluginName =
function(regExp) {
	var allPlugins = navigator.plugins;
	var pluginsArrayLength = allPlugins.length;
	for (var pluginsArrayCounter=0; pluginsArrayCounter < pluginsArrayLength; pluginsArrayCounter++ ) {
		var match = allPlugins[pluginsArrayCounter].name.match(regExp);
		if (match) {
			return match;
		}
	}
	return null;
};

AjxPluginDetector.detectActiveXControl =
function(progId) {
	try {
		new ActiveXObject(progId);
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: found ActiveXObject '" + progId + "'");
		return true;
	} catch (e) {
		DBG.println(AjxDebug.DBG1, "AjxPluginDetector: unable to find ActiveXObject '" + progId + "'");
		return false;
	}
};

AjxPluginDetector.detectQuickTimeActiveXControl =
function(progId) {
	try {
		var object = new ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1");
		return object.IsQuickTimeAvailable(0);
	} catch (e) {
		return false;
	}
};

// Util method to log arguments, which to my surprise are not actually an array.
AjxPluginDetector._argumentsToString =
function(args) {
	var array = [];
	for (var i = 0, count = args.length; i < count; i++) {
		array[i] = args[i];
	}
	return array.join(',')
};
}

if (AjxPackage.define("zimbraMail.share.view.ZmAlert")) {
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
 * Abstract base class of flashing alerts.
 * @class
 * This is an abstract base class of flashing alerts.
 * 
 */
ZmAlert = function() {
	this._isLooping = false;
};

// Abstract methods.
ZmAlert.prototype.start = null; // function ()
ZmAlert.prototype.stop = null; // function ()
ZmAlert.prototype._update = null; // function(status)

ZmAlert.prototype._startLoop =
function() {
	if (!ZmAlertLoop.INSTANCE) {
		ZmAlertLoop.INSTANCE = new ZmAlertLoop();
	}
	ZmAlertLoop.INSTANCE._add(this);
	this._isLooping = true;
};

ZmAlert.prototype._stopLoop =
function() {
	//no need to do anything if already not looping
	if (!this._isLooping) {
		return;
	}
	if (ZmAlertLoop.INSTANCE) {
		ZmAlertLoop.INSTANCE._remove(this);
	}
	this._isLooping = false;
	this._update(false);
};

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Private class only used by ZmAlert.
 * Manages an interval that tells alerts when to flash icons and titles and such.
 * @class
 * @private 
 */
ZmAlertLoop = function() {
	this._alerts = new AjxVector();
	this._flashOn = false;
	if (appCtxt.multiAccounts) {
		appCtxt.accountList.addActiveAcountListener(new AjxListener(this, this._accountChangeListener), 0);
	}
};

ZmAlertLoop.prototype._add =
function(alert) {
	this._alerts.add(alert, 0, true);
	if (!this._alertInterval) {
		this._alertInterval = setInterval(AjxCallback.simpleClosure(this._alertTimerCallback, this), 1500);
	}
};

ZmAlertLoop.prototype._remove =
function(alert) {
	this._alerts.remove(alert);
	if (this._alertInterval && !this._alerts.size()) {
		clearInterval(this._alertInterval);
		this._alertInterval = 0;
	}
};

ZmAlertLoop.prototype._alertTimerCallback =
function() {
	this._flashOn = !this._flashOn;
	for (var i = 0, count = this._alerts.size(); i < count; i++) {
	    this._alerts.get(i)._update(this._flashOn);
	}
};

ZmAlertLoop.prototype._accountChangeListener =
function() {
	// Stop all flashing alerts.
	var array = this._alerts.getArray();
	var alert;
	while (alert = array.unshift()) {
		alert.stop();
	}
};

}
if (AjxPackage.define("zimbraMail.share.view.ZmAccountAlert")) {
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
 * @overview
 */

/**
 * Creates the account alert.
 * @class
 * This class represents an alert that highlights and flashes an account accordion item.
 *
 * @param {ZmAccount}		account		the account
 * 
 * @extends		ZmAlert
 */
ZmAccountAlert = function(account) {
	ZmAlert.call(this);
	this.account = account;
	this._alertApps = {};
	appCtxt.accountList.addActiveAcountListener(new AjxListener(this, this._accountListener));
};

ZmAccountAlert.prototype = new ZmAlert;
ZmAccountAlert.prototype.constructor = ZmAccountAlert;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmAccountAlert.prototype.toString =
function() {
	return "ZmAccountAlert";
};

/**
 * Gets the alert by account. If the alert does not exist for the specified account, a new 
 * alert is created
 * 
 * @param	{ZmAccount}	account		the account
 * @return	{ZmAccountAlert}		the alert
 */
ZmAccountAlert.get =
function(account) {
	ZmAccountAlert.INSTANCES = ZmAccountAlert.INSTANCES || {};
	if (!ZmAccountAlert.INSTANCES[account.id]) {
		ZmAccountAlert.INSTANCES[account.id] = new ZmAccountAlert(account);
	}
	return ZmAccountAlert.INSTANCES[account.id];
};

/**
 * Starts the alert.
 * 
 * @param		{ZmApp}		app		the application
 */
ZmAccountAlert.prototype.start =
function(app) {
	if (this.account != appCtxt.getActiveAccount()) {
		this._started = true;
		if (app) {
			this._alertApps[app.getName()] = app;
		}
	}
};

/**
 * Stops the alert.
 * 
 */
ZmAccountAlert.prototype.stop =
function() {
	this._started = false;
};

ZmAccountAlert.prototype._accountListener =
function(evt) {
	if (evt.account == this.account) {
		this.stop();
		for (var appName in this._alertApps) {
			this._alertApps[appName].startAlert();
		}
		this._alertApps = {};
	}
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmAppAlert")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * This class represents an alert that highlights and flashes an application tab.
 *
 * @param {ZmApp}		app 		the application
 * @class
 * @private
 */
ZmAppAlert = function(app) {
	this.app = app;
};

ZmAppAlert.prototype.isZmAppAlert = true;
ZmAppAlert.prototype.toString = function() { return "ZmAppAlert"; };

/**
 * Starts the alert.
 */
ZmAppAlert.prototype.start =
function() {
	var appButton = this._getAppButton();
	if (!appButton) { return; }
	
    if (!appButton.isSelected) {
		appButton.showAlert(true);
        //add a stop alert listener
        if (!this._stopAlertListenerObj) {
           this._stopAlertListenerObj = new AjxListener(this, this.stop);
           appButton.addSelectionListener(this._stopAlertListenerObj);
        }
    }
};

/**
 * Stops the alert.
 */
ZmAppAlert.prototype.stop =
function() {
	var appButton = this._getAppButton();
	if (!appButton) { return; }
    if (appButton.isSelected) {
        appButton.showAlert(false);
    }
};

ZmAppAlert.prototype._getAppButton =
function() {
	return appCtxt.getAppController().getAppChooserButton(this.app.getName());
};

}
if (AjxPackage.define("zimbraMail.share.view.ZmBrowserAlert")) {
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
 * Creates the browser alert.
 * @class
 * Singleton alert class that alerts the user by flashing the favicon and document title.
 * 
 * @extends		ZmAlert
 */
ZmBrowserAlert = function() {
	ZmAlert.call(this);

	this._originalTitle = null;
	this.altTitle = null;   // Title to show when flashing.

	// Keep track of focus on the app.
	var focusListener = new AjxListener(this, this._focusListener);
	DwtShell.getShell(window).addFocusListener(focusListener);
	DwtShell.getShell(window).addBlurListener(focusListener);

	// Use key & mouse down events to handle focus.
	var globalEventListener = new AjxListener(this, this._globalEventListener);
	DwtEventManager.addListener(DwtEvent.ONMOUSEDOWN, globalEventListener);
	DwtEventManager.addListener(DwtEvent.ONKEYDOWN, globalEventListener);
};

ZmBrowserAlert.prototype = new ZmAlert;
ZmBrowserAlert.prototype.constructor = ZmBrowserAlert;

ZmBrowserAlert.prototype.toString =
function() {
	return "ZmBrowserAlert";
};

/**
 * Gets an instance of the browser alert.
 * 
 * @return	{ZmBrowserAlert}	the browser alert
 */
ZmBrowserAlert.getInstance =
function() {
	return ZmBrowserAlert.INSTANCE = ZmBrowserAlert.INSTANCE || new ZmBrowserAlert();
};

/**
 * Starts the alert.
 * 
 * @param	{String}	altTitle		the alternate title
 */
ZmBrowserAlert.prototype.start =
function(altTitle) {
	if (this._isLooping) {
		return;
	}
	this.altTitle = altTitle || ZmMsg.newMessage;
	if (!this._clientHasFocus) {
		if (!this._favIcon) {
			this._favIcon = appContextPath + "/img/logo/favicon.ico";
			this._blankIcon = appContextPath + "/img/logo/blank.ico";
		}
		this._startLoop();
	}
};

/**
 * Stops the alert.
 * 
 */
ZmBrowserAlert.prototype.stop =
function() {
	this._stopLoop();
};

ZmBrowserAlert.prototype._update =
function(status) {
	// Update the favicon.
    // bug: 52080 - disable flashing of favicon
	//Dwt.setFavIcon(status ? this._blankIcon : this._favIcon);

	// Update the title.
	var doc = document;
	if (status) {
		this._origTitle = doc.title;
		doc.title = this.altTitle;
	} else {
		if (doc.title == this.altTitle) {
			doc.title = this._origTitle;
		}
		// else if someone else changed the title, just leave it.
	}
};

ZmBrowserAlert.prototype._focusListener =
function(ev) {
	this._clientHasFocus = ev.state == DwtFocusEvent.FOCUS;
	if (this._clientHasFocus) {
		this.stop();
	}
};

ZmBrowserAlert.prototype._globalEventListener =
function() {
	this._clientHasFocus = true;
	this.stop();
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmDesktopAlert")) {
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
 * Singleton alert class that alerts the user by popping up a message on the desktop.
 * @class
 * @private
 */
ZmDesktopAlert = function() {
    if (window.webkitNotifications) {
        this.useWebkit = true;
	} else if (window.Notification) {
		this.useNotification = true;
    } else if (appCtxt.isOffline && window.platform && (AjxEnv.isWindows || AjxEnv.isMac)) {
        this.usePrism = true;
    }
};

ZmDesktopAlert.prototype = new ZmAlert;
ZmDesktopAlert.prototype.constructor = ZmDesktopAlert;

ZmDesktopAlert.prototype.toString =
function() {
	return "ZmDesktopAlert";
};

ZmDesktopAlert.getInstance =
function() {
	return ZmDesktopAlert.INSTANCE = ZmDesktopAlert.INSTANCE || new ZmDesktopAlert();
};

/**
 * Returns text to show in a prefs page next to the checkbox to enable this type of alert.
 */
ZmDesktopAlert.prototype.getDisplayText =
function() {
    if (this.useWebkit || this.useNotification) {
       return ZmMsg.showPopup;
    } else if (this.usePrism) {
		return AjxEnv.isMac ? ZmMsg.showPopupMac : ZmMsg.showPopup;
	}
};

ZmDesktopAlert.prototype.start =
function(title, message, sticky) {
    if (this.useWebkit) {
        var allowedCallback = this._showWebkitNotification.bind(this, title, message, sticky);
        this._checkWebkitPermission(allowedCallback);
	} else if (this.useNotification) {
		var notificationCallback = this._showNotification.bind(this, title, message, sticky);
		this._checkNotificationPermission(notificationCallback);
    } else if (this.usePrism) {
		if (AjxEnv.isMac) {
			try {
				window.platform.showNotification(title, message, "resource://webapp/icons/default/launcher.icns");
			} catch (err) {}
		}
		else if (AjxEnv.isWindows) {
			try {
				window.platform.icon().showNotification(title, message, 5);
			} catch (err) {}
		}
	}
};

/* Checks if we have permission to use webkit notifications. If so, or when the user
 * grants permission, allowedCallback is called.
 */
ZmDesktopAlert.prototype._checkWebkitPermission =
function(allowedCallback) {
    var allowed = window.webkitNotifications.checkPermission() == 0;
    if (allowed) {
        allowedCallback();
    } else if (!ZmDesktopAlert.requestedPermission) {
        ZmDesktopAlert.requestedPermission = true; // Prevents multiple permission requests in one session.
        window.webkitNotifications.requestPermission(this._checkWebkitPermission.bind(this, allowedCallback));
    }
};

ZmDesktopAlert.prototype._showWebkitNotification =
function(title, message, sticky) {
	sticky = sticky || false;
    // Icon: I chose to use the favIcon because it's already overridable by skins.
    // It's a little ugly though.
    // change for bug#67359: Broken notification image in chrome browser
    // //var icon = window.favIconUrl;
	var icon = skin.hints.notificationBanner;
    var popup = window.webkitNotifications.createNotification(icon, title, message);
    popup.show();
	popup.onclick = function() {popup.cancel();};
    if (sticky) {
        if (!ZmDesktopAlert.notificationArray) {
            ZmDesktopAlert.notificationArray = [];
        }
        ZmDesktopAlert.notificationArray.push(popup);
    }
    else {
        // Close the popup after 5 seconds.
        setTimeout(popup.cancel.bind(popup), 5000);
    }
};

/* Checks if we have permission to use the notification api. If so, or when the user
 * grants permission, allowedCallback is called.
 */
ZmDesktopAlert.prototype._checkNotificationPermission = function(allowedCallback) {
	var allowed = window.Notification.permission === 'granted';
	if (allowed) {
		allowedCallback();
	} else if (!ZmDesktopAlert.requestedPermission) {
		ZmDesktopAlert.requestedPermission = true; // Prevents multiple permission requests in one session.
		// Currently, cannot directly call requestPermission.  Re-test when Chrome 37 is released
		//window.Notification.requestPermission(this._checkNotificationPermission.bind(this, allowedCallback));
		var requestCallback = this._checkNotificationPermission.bind(this, allowedCallback);
		this.requestRequestPermission(requestCallback);
	}
};

// Chrome Notification only allows requesting permission in response to a user action, not a programmatic call.
// The issue may be fixed in Chrome 37, whenever that comes out.  See:
//   https://code.google.com/p/chromium/issues/detail?id=274284
ZmDesktopAlert.prototype.requestRequestPermission = function(requestCallback) {
	var msgDialog = appCtxt.getYesNoMsgDialog();
	var callback = 	this._doRequestPermission.bind(this, msgDialog, requestCallback);
	msgDialog.registerCallback(DwtDialog.YES_BUTTON, callback);
	msgDialog.setMessage(ZmMsg.notificationPermission, DwtMessageDialog.INFO_STYLE);
	msgDialog.popup();
};

ZmDesktopAlert.prototype._doRequestPermission = function(msgDialog, requestCallback) {
	msgDialog.popdown();
	window.Notification.requestPermission(requestCallback);
}

ZmDesktopAlert.prototype._showNotification = function(title, message, sticky) {
	var icon = skin.hints.notificationBanner;

	var popup = new Notification(title, { body: message, icon: icon});
	//popup.show();
	popup.onclick = function() {popup.close();};
	if (sticky) {
		if (!ZmDesktopAlert.notificationArray) {
			ZmDesktopAlert.notificationArray = [];
		}
		ZmDesktopAlert.notificationArray.push(popup);
	}
	else {
		// Close the popup after 5 seconds.
		setTimeout(popup.close.bind(popup), 5000);
	}
};

ZmDesktopAlert.prototype._notifyServiceCallback =
function(title, message, service) {
	try {
		service.show({ title: title, message: message }, function(){});
	} catch (err) {}
};

/**
 * Closes desktop notification if any during onbeforeunload event
 */
ZmDesktopAlert.closeNotification =
function() {
    var notificationArray = ZmDesktopAlert.notificationArray,
        popup;

    if (notificationArray) {
        while (popup = notificationArray.pop()) {
            //notifications may be already closed by the user go for try catch
            try {
                popup.cancel();
            }
            catch (e) {
            }
        }
    }
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmSoundAlert")) {
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
 * Alerts of an event by playing a sound.
 * @private
 */
ZmSoundAlert = function() {
	this.html5AudioEnabled = ZmSoundAlert.isHtml5AudioEnabled();
	this.enabled = this.html5AudioEnabled || AjxPluginDetector.detectQuickTime() || AjxPluginDetector.detectWindowsMedia();
	if (this.enabled) {
		var element = this._element = document.createElement("DIV");
		element.style.position = 'relative';
		element.style.top = '-1000px';
		element.style.left = '-1000px';
		document.body.appendChild(this._element);
	} else {
		DBG.println("No QuickTime or Windows Media plugin detected. Sound alerts are disabled.")
	}
};

//this tests for wav file support. we might want to refactor it for various file types if needed later
ZmSoundAlert.isHtml5AudioEnabled =
function() {

	try {
		var audio = new Audio("");
		if (!audio.canPlayType) {
			return false;
		}
	}
	catch (e) {
		return false;
	}

	// canPlayType(type) returns: "", "no", "maybe" or "probably"
	var canPlayWav = audio.canPlayType("audio/wav");
	return (canPlayWav !== "no" && canPlayWav !== "");

}

ZmSoundAlert.prototype.toString =
function() {
	return "ZmSoundAlert";
};

ZmSoundAlert.getInstance =
function() {
	return ZmSoundAlert.INSTANCE = ZmSoundAlert.INSTANCE || new ZmSoundAlert();
};

ZmSoundAlert.prototype.start =
function(soundFile) {
	if (!this.enabled) {
		return;
	}

	var time = new Date().getTime();
	if (this._lastTime && ((time - this._lastTime) < 5000)) {
		return;
	}
	this._lastTime = time;

	soundFile = soundFile || "/public/sounds/im/alert.wav";
	var url = appContextPath + soundFile;

	var html;
	if (this.html5AudioEnabled) {
		html = '<audio src="' + url + '" autoplay="yes"></audio>';
	}
	else {
		var embedId = Dwt.getNextId();
		var htmlArr = [
			"<object CLASSID='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6' type='audio/wav'>",
			"<param name='url' value='", url, "'>",
			"<param name='autostart' value='true'>",
			"<param name='controller' value='true'>",
			"<embed id='", embedId, "' src='", url, "' controller='false' autostart='true' type='audio/wav'/>",
			"</object>"
		];
		html = htmlArr.join("");
	}
	this._element.innerHTML = html;

	if (!this.html5AudioEnabled && AjxEnv.isFirefox && AjxEnv.isWindows) {
		// The quicktime plugin steals focus and breaks our keyboard nav.
		// The best workaround I've found for this is to blur the embed
		// element, and that only works after the sound plays.
		//
		// Unfortunately it seems that on a slow connection this prevents
		// the sound from playing. I'm hoping this is less bad than killing
		// keyboard focus.
		//
		// Mozilla bug: https://bugzilla.mozilla.org/show_bug.cgi?id=78414
		if (this._blurActionId) {
			AjxTimedAction.cancelAction(this._blurActionId);
			this._blurActionId = null;
		}
		this._blurEmbedTimer(embedId, 0);
	}
};

ZmSoundAlert.prototype._blurEmbedTimer =
function(embedId, tries) {
	var action = new AjxTimedAction(this, this._blurEmbed, [embedId, tries]);
	this._blurActionId = AjxTimedAction.scheduleAction(action, 500);
};

ZmSoundAlert.prototype._blurEmbed =
function(embedId, tries) {
	this._blurActionId = null;

	// Take focus from the embed.
	var embedEl = document.getElementById(embedId);
	if (embedEl && embedEl.blur) {
		embedEl.blur();
	}

	// Force focus to the keyboard manager's focus obj.
	var focusObj = appCtxt.getKeyboardMgr().getFocusObj();
	if (focusObj && focusObj.focus) {
		focusObj.focus();
	}

	// Repeat hack.
	if (tries < 2) {
		this._blurEmbedTimer(embedId, tries + 1);
	}
};
}
}
