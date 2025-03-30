if (AjxPackage.define("Voicemail")) {
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
/*
 * Package: Voicemail
 * 
 * Supports: The Voicemail application
 * 
 * Loaded:
 * 	- When the user goes to the Voicemail application
 * 	- If a search for voicemails returns results
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

if (AjxPackage.define("ajax.dwt.core.DwtDragTracker")) {
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


/**
 * 
 * @private
 */
DwtDragTracker = function() {}

/**
 * Initializes the tracker.
 * 
 * @param {DwtControl}	control        the control that can be moved/dragged
 * @param {number}	[threshX=1]        the minimum number of X pixels before we move
 * @param {number}	[threshY=1]        the minimum number of Y pixels before we move
 * @param {function}	callbackFunc   callback function
 * @param callbackObj    object for callback
 * @param	userData		the user data
 * 
 */
DwtDragTracker.init = 
function(control, style, threshX, threshY, callbackFunc, callbackObj, userData) {

    var ctxt = control._dragTrackerContext = {};
    var htmlElement = control.getHtmlElement();
    
    if (style) htmlElement.style.cursor = style;
    
   	ctxt.style = style;
	ctxt.threshX = (threshX > 0) ? threshX : 1;
	ctxt.threshY = (threshY > 0) ? threshY : 1;
	ctxt.data = { delta: {}, userData: userData};

	ctxt.captureObj = new DwtMouseEventCapture({
		targetObj:control,
		mouseOverHdlr:DwtDragTracker._mouseOverHdlr,
		mouseDownHdlr:DwtDragTracker._mouseDownHdlr,
		mouseMoveHdlr:DwtDragTracker._mouseMoveHdlr,
		mouseUpHdlr:DwtDragTracker._mouseUpHdlr,
		mouseOutHdlr:DwtDragTracker._mouseOutHdlr
	});

	control.setHandler(DwtEvent.ONMOUSEDOWN, DwtDragTracker._mouseDownHdlr);
	control.setHandler(DwtEvent.ONMOUSEOVER, DwtDragTracker._mouseOverHdlr);
	control.setHandler(DwtEvent.ONMOUSEOUT, DwtDragTracker._mouseOutHdlr);
	ctxt.callbackFunc = callbackFunc;
	ctxt.callbackObj = callbackObj;	
}

DwtDragTracker.STYLE_NONE = "auto";
DwtDragTracker.STYLE_MOVE = "move";
DwtDragTracker.STYLE_RESIZE_NORTHWEST = "nw-resize";
DwtDragTracker.STYLE_RESIZE_NORTH = "n-resize";
DwtDragTracker.STYLE_RESIZE_NORTHEAST = "ne-resize";
DwtDragTracker.STYLE_RESIZE_WEST = "w-resize";
DwtDragTracker.STYLE_RESIZE_EAST = "e-resize";
DwtDragTracker.STYLE_RESIZE_SOUTHWEST = "sw-resize";
DwtDragTracker.STYLE_RESIZE_SOUTH = "s-resize";
DwtDragTracker.STYLE_RESIZE_SOUTHEAST = "se-resize";

DwtDragTracker.STATE_START = 1;
DwtDragTracker.STATE_DRAGGING = 2;
DwtDragTracker.STATE_END = 3;

DwtDragTracker._mouseOverHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;	
}

DwtDragTracker._mouseDownHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, true);	
	if (mouseEv.button != DwtMouseEvent.LEFT) {
		DwtUiEvent.setBehaviour(ev, true, false);
		return false;
	}
	var control = mouseEv.dwtObj;
	if (control && control._dragTrackerContext) {
        var ctxt = control._dragTrackerContext;
        	if (ctxt.callbackFunc != null) {
				ctxt.oldCapture = DwtMouseEventCapture.getCaptureObj();
				if (ctxt.oldCapture) {
					ctxt.oldCapture.release();
				}
        		ctxt.captureObj.capture();
        		ctxt.data.startDoc = {x: mouseEv.docX, y: mouseEv.docY};
        		ctxt.data.state = DwtDragTracker.STATE_START;
             DwtDragTracker._doCallback(ctxt, mouseEv);
        	}
   	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;	
}

DwtDragTracker._doCallback =
function(ctxt, mouseEv) {
	ctxt.data.mouseEv = mouseEv;
	if (ctxt.callbackObj != null)
		ctxt.callbackFunc.call(ctxt.callbackObj, ctxt.data);
	else 
		ctxt.callbackFunc(ctxt.data);
	ctxt.data.mouseEv = null;
}

DwtDragTracker._mouseMoveHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);	
	
	var control = DwtMouseEventCapture.getTargetObj();
    var ctxt = control._dragTrackerContext;
    var data = ctxt.data;
	    
	data.delta.x = mouseEv.docX - data.startDoc.x;
	data.delta.y = mouseEv.docY - data.startDoc.y;
	
	if (Math.abs(data.delta.x) >= ctxt.threshX || Math.abs(data.delta.y) >= ctxt.threshY) {
        data.prevState = data.state;
        data.state = DwtDragTracker.STATE_DRAGGING;
	    DwtDragTracker._doCallback(ctxt, mouseEv);
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;	
}

DwtDragTracker._mouseUpHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);	
	if (mouseEv.button != DwtMouseEvent.LEFT) {
		DwtUiEvent.setBehaviour(ev, true, false);
		return false;
	}
	
	var ctxt = DwtMouseEventCapture.getTargetObj()._dragTrackerContext;
	if (ctxt) {
        	if (ctxt.callbackFunc != null)
        		DwtMouseEventCapture.getCaptureObj().release();
			if (ctxt.oldCapture) {
				ctxt.oldCapture.capture();
				ctxt.oldCapture = null;
			}
        	ctxt.data.state = DwtDragTracker.STATE_END;
        DwtDragTracker._doCallback(ctxt, mouseEv);
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;	
}

DwtDragTracker._mouseOutHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	
	mouseEv.setFromDhtmlEvent(ev);
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;	
}
}

if (AjxPackage.define("ajax.dwt.widgets.DwtBorderlessButton")) {
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
 * Creates a border less button.
 * @constructor
 * @class
 * This class represents a button without a border.
 *
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}      params.parent		the parent widget
 * @param {constant}      params.style			the button style (see {@link DwtButton})
 * @param {string}      params.className		the CSS class
 * @param {constant}      params.posStyle		the positioning style (see {@link Dwt})
 * @param {DwtButton.ACTION_MOUSEUP|DwtButton.ACTION_MOUSEDOWN}      params.actionTiming	if {@link DwtButton.ACTION_MOUSEUP}, then the button is triggered
 *											on mouseup events, else if {@link DwtButton.ACTION_MOUSEDOWN},
 * 											then the button is triggered on mousedown events
 * @param {string}      params.id			the ID to use for the control's HTML element
 * @param {number}      params.index 		the index at which to add this control among parent's children
 * 
 * @extends		DwtButton
 */
DwtBorderlessButton = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtBorderlessButton.PARAMS);

	DwtButton.call(this, params);
}

DwtBorderlessButton.PARAMS = ["parent", "style", "className", "posStyle", "actionTiming", "id", "index"];

DwtBorderlessButton.prototype = new DwtButton;
DwtBorderlessButton.prototype.constructor = DwtBorderlessButton;

DwtBorderlessButton.prototype.toString =
function() {
	return "DwtBorderlessButton";
}

//
// Data
//

DwtBorderlessButton.prototype.TEMPLATE = "dwt.Widgets#ZBorderlessButton"

}
if (AjxPackage.define("ajax.dwt.widgets.DwtSlider")) {
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
 * Creates a slider.
 * @constructor
 * @class
 * This class represents a slider.
 *
 * @param {DwtControl}	parent    the parent widget
 * @param {DwtSlider.HORIZONTAL|DwtSlider.VERTICAL}	orientation		the orientation of the slider
 * @param {string}	[className] 	the CSS class. If not provided defaults to "DwtHorizontalSlider" or "DwtVerticalSlider"
 * @param {constant}	[posStyle=DwtControl.STATIC_STYLE] the positioning style (see {@link DwtControl})
 * 
 * @extends		DwtControl
 */
DwtSlider = function(parent, orientation, className, posStyle) {
    if (arguments.length == 0) return;
    this._orientation = orientation || DwtSlider.HORIZONTAL;
    className = className || (this._orientation == DwtSlider.HORIZONTAL ? "DwtHorizontalSlider" : "DwtVerticalSlider");
    DwtControl.call(this, {parent:parent, className:className, posStyle:posStyle});

    this._size = 0;
    this._buttonSize = 0;

    this._value = 0;
    this._minimum = 0;
    this._maximum = 100;
    
    this._isDragging = false;

	DwtDragTracker.init(this, null, 0, 0, this._dragListener, this);

    this._createHtml();
};

DwtSlider.prototype = new DwtControl;
DwtSlider.prototype.constructor = DwtSlider;

/**
 * Defines the "horizontal" orientation.
 */
DwtSlider.HORIZONTAL = 1;
/**
 * Defines the "vertical" orientation.
 */
DwtSlider.VERTICAL = 2;

DwtSlider.prototype.toString =
function() {
    return "DwtSlider";
};

/**
 * Sets the value of the slider, moving the position button accordingly.
 *
 * @param {number}		value		the value
 * @param {boolean}	notify			if <code>true</code>, to notify change listeners of the new value
 */
DwtSlider.prototype.setValue =
function(value, notify) {
	// Adjust the value into the valid range.
	value = Math.max(this._minimum, value);
	value = Math.min(this._maximum, value);
	this._value = value;

	// Move the button.
	var location = this._valueToLocation(value);
    var property = this._orientation == DwtSlider.HORIZONTAL ? "left" : "top";
    var element = this._getButtonElement();
    element.style[property] = location;
    
	// Send notification.
	if (notify) {
		if (!this._changeEvent) {
			this._changeEvent = new DwtEvent(true);
			this._changeEvent.dwtObj = this;
		}
	    this.notifyListeners(DwtEvent.ONCHANGE, this._changeEvent);
	}
};

/**
 * Gets the slider value.
 * 
 * @return	{number}	the value
 */
DwtSlider.prototype.getValue =
function() {
	return this._value;
};

/**
 * Sets the range and value of the slider.
 *
 * @param {number}	minimum	the minimum allowed value
 * @param {number}	maximum	the maximum allowed value
 * @param {number}	value		the value
 * @param {boolean}	notify	if <code>true</code>, notify change listeners of the new value
 */
DwtSlider.prototype.setRange =
function(minimum, maximum, newValue, notify) {
	if (minimum >= maximum) {
		throw new DwtException("Invalid slider range: [" + minimum + ", " + maximum + "]");
	};

	this._minimum = minimum;
	this._maximum = maximum;
	if (typeof newValue == "undefined") {
		newValue = minimum;
	}
	this.setValue(newValue, notify);
};

/**
 * Gets the minimum allowed value.
 * 
 * @return	{number}		the minimum value
 */
DwtSlider.prototype.getMinimum =
function() {
	return this._minimum;
};

/**
 * Gets the maximum allowed value
 * 
 * @return	{number}		the maximum value
 */
DwtSlider.prototype.getMaximum =
function() {
	return this._maximum;
};

/**
 * Checks if the slider is currently dragging.
 * 
 * @return	{Boolean}	<code>true</code> if the slider is dragging
 */
DwtSlider.prototype.isDragging =
function() {
	return this._isDragging;
};

/**
 * Adds a change listener.
 *
 * @param {AjxListener} listener	the listener
 */
DwtSlider.prototype.addChangeListener = 
function(listener) {
    this.addListener(DwtEvent.ONCHANGE, listener);
};

DwtSlider.prototype._setLocation =
function(location, notify) {
	var value = this._locationToValue(location);
	this.setValue(value, notify);
};

DwtSlider.prototype._getLocation =
function() {
	return this._valueToLocation(this._value);
};

DwtSlider.prototype._valueToLocation =
function(value) {
	if (this._orientation == DwtSlider.HORIZONTAL) {
	    return (value - this._minimum) / (this._maximum - this._minimum) * (this._size - this._buttonSize);
	} else {
	    return this._size - this._buttonSize - (value - this._minimum) / (this._maximum - this._minimum) * (this._size - this._buttonSize);
	}
};

DwtSlider.prototype._locationToValue =
function(location) {
	if (this._orientation == DwtSlider.HORIZONTAL) {
	    return location / (this._size - this._buttonSize) * (this._maximum - this._minimum) + this._minimum;
	} else {
	    return (this._size - this._buttonSize - location) / (this._size - this._buttonSize) * (this._maximum - this._minimum) + this._minimum;
	}
};

DwtSlider.prototype._calculateSizes =
function() {
	var property = this._orientation == DwtSlider.HORIZONTAL ? "x" : "y";
	this._buttonSize = Dwt.getSize(this._getButtonElement())[property];
	this._size = Dwt.getSize(this.getHtmlElement())[property];
	if (this._buttonSize >= this._size) {
		throw new DwtException("Invalid slider sizes");
	}
};

DwtSlider.prototype._getButtonElement =
function() {
	return document.getElementById(this._htmlElId + "_button");
};

DwtSlider.prototype._createHtml =
function() {
    var element = this.getHtmlElement();
    var args = { id:this._htmlElId };
    var template = this._orientation == DwtSlider.HORIZONTAL ? 
    	"dwt.Widgets#DwtHorizontalSlider" : 
    	"dwt.Widgets#DwtVerticalSlider";
    element.innerHTML = AjxTemplate.expand(template, args);
    this._calculateSizes();
};

DwtSlider.prototype._dragListener =
function(obj, a, b) {
	var elementProperty = this._orientation == DwtSlider.HORIZONTAL ? "x" : "y";
	var eventProperty = this._orientation == DwtSlider.HORIZONTAL ? "docX" : "docY";
	if (obj.state == DwtDragTracker.STATE_START) {
		// If clicked outside of button, move button immediately.
		var windowLocation = Dwt.toWindow(this.getHtmlElement(), 0, 0);
		var clickLocation = obj.mouseEv[eventProperty] - windowLocation[elementProperty];
		var buttonLocation = this._getLocation();
		if (clickLocation < buttonLocation || clickLocation > (buttonLocation + this._buttonSize)) {
			this._setLocation(clickLocation - this._buttonSize / 2, true);
		}

		// Save the original position in the tracker's user data.
		obj.userData = { location: this._getLocation(), value: this._value };
		this._isDragging = true;
		this._moved = false;
	} else {
		if (obj.state == DwtDragTracker.STATE_END) {
			this._isDragging = false;
		} else if (obj.state == DwtDragTracker.STATE_DRAGGING) {
			this._moved = true;
		}
		if (this._moved) {
			var location = obj.userData.location + obj.delta[elementProperty];
			this._setLocation(location, true);
		}
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtSoundPlugin")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a sound plugin control.
 * @constructor
 * @class
 * This class represents a widget that plays sounds. It uses a plugin such as Quick Time
 * or Windows Media to play the sounds and to display player controls. Do not invoke the
 * constructor directly. Instead use the create() method, which will choose the right
 * concrete class based on available plugins.
 *
 * @param	{hash}	params		a hash of parameters
 * @param {DwtControl}	params.parent	 the parent widget
 * @param {number}	params.width		the width of player
 * @param {number}	params.height		the height of player
 * @param {number}	params.volume		volume on a scale of 0 - {@link DwtSoundPlugin.MAX_VOLUME}
 * @param {string}	params.url		{String} the sound url
 * @param {boolean}	[params.offscreen]	{Boolean} if <code>true</code>, the player is initially offscreen. Use an appropriate position style
 * 							  if you set this to <code>true</code>. (This reduces flicker, and a tendency for the QT player
 * 							  to float in the wrong place when it's first created)
 * @param {string}	[params.className] the CSS class
 * @param {constant}	[params.posStyle=DwtControl.STATIC_STYLE] 	the positioning style (see {@link DwtControl})
 * 
 * @extends		DwtControl
 */
DwtSoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtControl.call(this, {parent:params.parent, className:params.className, posStyle:params.posStyle});
	this._width = params.width || 200;
	this._height = params.height || 18;
	if (params.offscreen) {
		this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	}
};

DwtSoundPlugin.prototype = new DwtControl;
DwtSoundPlugin.prototype.constructor = DwtSoundPlugin;

/**
 * Defines the "max" volume.
 */
DwtSoundPlugin.MAX_VOLUME = 256;

// Status codes.
DwtSoundPlugin.WAITING = 1;
DwtSoundPlugin.LOADING = 2;
DwtSoundPlugin.PLAYABLE = 3;
DwtSoundPlugin.ERROR = 4;

/**
 * Factory method. Creates an appropriate sound player for whatever plugins are or are not installed.
 *
 * @param	{hash}	params		a hash of parameters
 * @param {DwtControl}	params.parent	 the parent widget
 * @param {number}	params.width		the width of player
 * @param {number}	params.height		the height of player
 * @param {number}	params.volume		volume on a scale of 0 - {@link DwtSoundPlugin.MAX_VOLUME}
 * @param {string}	params.url		{String} the sound url
 * @param {boolean}	[params.offscreen]	{Boolean} if <code>true</code>, the player is initially offscreen. Use an appropriate position style
 * 							  if you set this to <code>true</code>. (This reduces flicker, and a tendency for the QT player
 * 							  to float in the wrong place when it's first created)
 * @param {string}	[params.className] the CSS class
 * @param {constant}	[params.posStyle=DwtControl.STATIC_STYLE] 	the positioning style (see {@link DwtControl})
 */
DwtSoundPlugin.create =
function(params) {
	var pluginClass = this._getPluginClass();
	DBG.println("DwtSoundPlugin.create class= " + pluginClass.prototype.toString() + " url=" + params.url);
	return new pluginClass(params);
};

/**
 * Checks if the plugin is missing.
 * 
 * @return	{boolean}	<code>true</code> if plugin is missing
 */
DwtSoundPlugin.isPluginMissing =
function() {
	var pluginClass = this._getPluginClass();
	return pluginClass._pluginMissing;
};

/**
 * Checks if scripting is broken.
 * 
 * @return	{boolean}	<code>true</code> if scripting is broken
 */
DwtSoundPlugin.isScriptingBroken =
function() {
	var pluginClass = this._getPluginClass();
	return pluginClass._isScriptingBroken;
};

DwtSoundPlugin._getPluginClass =
function() {
	if (!DwtSoundPlugin._pluginClass) {
		if (AjxEnv.isIE && AjxPluginDetector.detectWindowsMedia()) {
            DwtSoundPlugin._pluginClass = DwtWMSoundPlugin;
        }
		else if (AjxEnv.isSafari5up && !AjxEnv.isChrome && !AjxEnv.isWindows) {
			//safari quicktime does not work with httpOnly cookie attribute
			DwtSoundPlugin._pluginClass = DwtHtml5SoundPlugin;
		}
		else {
			var version = AjxPluginDetector.getQuickTimeVersion();
			if (version) {
				DBG.println("DwtSoundPlugin: QuickTime version=" + version);
				if (DwtQTSoundPlugin.checkVersion(version) && DwtQTSoundPlugin.checkScripting()) {
					DwtSoundPlugin._pluginClass = DwtQTSoundPlugin;
				} else {
					DwtSoundPlugin._pluginClass = DwtQTBrokenSoundPlugin;
				}
			} else {
				if (window.DBG && !DBG.isDisabled()) {
					DBG.println("DwtSoundPlugin: unable to get QuickTime version. Checking if QuickTime is installed at all...");
					AjxPluginDetector.detectQuickTime(); // Called only for logging purposes.
				}
			}
		}
		if (!DwtSoundPlugin._pluginClass) {
			DwtSoundPlugin._pluginClass = DwtMissingSoundPlugin;
		}
		DBG.println("DwtSoundPlugin: plugin class = " + DwtSoundPlugin._pluginClass.prototype.toString());
	}
	return DwtSoundPlugin._pluginClass;
};

// "Abstract" methods.
/**
 * Plays the sound.
 * 
 */
DwtSoundPlugin.prototype.play =
function() {
};

/**
 * Pauses the sound.
 * 
 */
DwtSoundPlugin.prototype.pause =
function() {
};

/**
 * Rewinds the sound.
 * 
 */
DwtSoundPlugin.prototype.rewind =
function() {
};

/**
 * Sets the current time in milliseconds.
 * 
 * @param	{number}	time		the time (in milliseconds)
 */
DwtSoundPlugin.prototype.setTime =
function(time) {
};

/**
 * Sets the volume.
 *
 * @param {number}	volume	the volume
 * 
 * @see		DwtSoundPlugin.MAX_VOLUME
 */
DwtSoundPlugin.prototype.setVolume =
function(volume) {
};

/*
 * Fills in the event with the following status information:
 * - status, a constant representing the loaded state of the sound
 * - duration, the length of the sound
 * - time, the current time of the sound
 * Returns true to continue monitoring status
 */
DwtSoundPlugin.prototype._resetEvent =
function(event) {
	return false;
};

DwtSoundPlugin.prototype.dispose =
function() {
	DwtControl.prototype.dispose.call(this);
	this._ignoreStatus();
};

/**
 * Adds a change listener to monitor the status of the sound being played.
 * The listener will be passed an event object with the following fields:
 * <ul>
 * <li>status, a constant representing the loaded state of the sound</li>
 * <li>duration, the length of the sound</li>
 * <li>time, the current time of the sound</li>
 * </ul>
 * 
 * @param {AjxListener}	listener	the listener
 */
DwtSoundPlugin.prototype.addChangeListener =
function(listener) {
    this.addListener(DwtEvent.ONCHANGE, listener);
    this._monitorStatus();
};

DwtSoundPlugin.prototype._monitorStatus =
function() {
	if (this.isListenerRegistered(DwtEvent.ONCHANGE)) {
		if (!this._statusAction) {
			this._statusAction = new AjxTimedAction(this, this._checkStatus);
		}
		this._statusActionId = AjxTimedAction.scheduleAction(this._statusAction, 250);
	}
};

DwtSoundPlugin.prototype._ignoreStatus =
function() {
	if (this._statusActionId) {
		AjxTimedAction.cancelAction(this._statusActionId);
	}
};

DwtSoundPlugin.prototype._checkStatus =
function() {
	this._statusActionId = 0;
	if (!this._changeEvent) {
		this._changeEvent = new DwtEvent(true);
		this._changeEvent.dwtObj = this;
	}
	var keepChecking = this._resetEvent(this._changeEvent);
    this.notifyListeners(DwtEvent.ONCHANGE, this._changeEvent);
    if (keepChecking) {
		this._monitorStatus();
    }
};

DwtSoundPlugin.prototype._createQTHtml =
function(params) {
	// Adjust volume because the html parameter is in [0 - 100], while the
	// javascript method takes [0 - 256].
	var volume = params.volume * 100 / 256;
	var html = [
		"<embed classid='clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B' ",
		"id='", this._playerId,
		"' width='", this._width,
		"' height='", this._height,
		"' src='", params.url,
		"' volume='", volume,
		"' enablejavascript='true' type='audio/wav'/>"
	];
	this.getHtmlElement().innerHTML = html.join("");
};

/**
 * Sound player that goes through the QuickTime (QT) plugin.
 * @class
 * Some useful references when dealing with quick time:
 * <ul>
 * <li>Quick Time script reference
 * <a href="http://developer.apple.com/documentation/QuickTime/Conceptual/QTScripting_JavaScript/bQTScripting_JavaScri_Document/chapter_1000_section_5.html" target="_blank">http://developer.apple.com/documentation/QuickTime/Conceptual/QTScripting_JavaScript/bQTScripting_JavaScri_Document/chapter_1000_section_5.html</a>
 * </li>
 * <li>Quick Time embed tag attributes tutorial
 * <a href="http://www.apple.com/quicktime/tutorials/embed2.html" target="_blank">http://www.apple.com/quicktime/tutorials/embed2.html</a>
 * </li>
 * </ul>
 * 
 * @param	{hash}	params		a hash of parameters
 * 
 * @extends		DwtSoundPlugin
 * 
 * @private
 */
DwtQTSoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtSoundPlugin.call(this, params);

	this._playerId = Dwt.getNextId();
	this._createHtml(params);
};

DwtQTSoundPlugin.prototype = new DwtSoundPlugin;
DwtQTSoundPlugin.prototype.constructor = DwtQTSoundPlugin;

DwtQTSoundPlugin.prototype.toString =
function() {
	return "DwtQTSoundPlugin";
};

/**
 * Checks the QuickTime version.
 * 
 * @param	{array}	version	the version as an array (for example: 7.1.6 is [7, 1, 6] )
 * @return	{boolean}	<code>true</code> if version is OK
 */
DwtQTSoundPlugin.checkVersion =
function(version) {
	if (AjxEnv.isFirefox) {
		// Quicktime 7.1.6 introduced a nasty bug in Firefox that can't be worked around by
		// the checkScripting() routine below. I'm going to disable all QT versions that
		// are greater than 7.1.6. We should change this check when QT is fixed. More info:
		// http://lists.apple.com/archives/quicktime-users/2007/May/msg00016.html
		var badVersion = "716";
		var currentVersion = "";
		for(var i = 0; i < version.length; i++) {
			currentVersion += version[i];
		}
		return currentVersion != badVersion;
	} 
	return true;
};

/**
 * Checks scripting.
 * 
 * @return	{boolean}	<code>true</code> if scripting is OK
 */
DwtQTSoundPlugin.checkScripting =
function() {
	var success = false;
	var shell = DwtControl.fromElementId(window._dwtShellId);
	var args = {
		parent: shell,
		width: 200,
		height: 16,
		offscreen: true,
		posStyle: DwtControl.RELATIVE_STYLE,
		url: "/public/sounds/im/alert.wav", // Not a valid url.
		volume: 0
	};
	var test = new DwtQTSoundPlugin(args);
	try {
		var element = test._getPlayer();
		success = element.GetQuickTimeVersion && element.GetQuickTimeVersion();
		if (!success) {
			DBG.println("The QuickTime plugin in this browser does not support JavaScript.");
		}
	} catch (e) {
		DBG.println("An exception was thrown while checking QuickTime: " + e.toString());
	} finally {
		test.dispose();
	}
	return success;
};

DwtQTSoundPlugin.prototype.play =
function() {
	var player = this._getPlayer();
    try {
	    player.Play();
    }catch(e) {
    }
	this._monitorStatus();
};

DwtQTSoundPlugin.prototype.pause =
function() {
	try {
		var player = this._getPlayer();
		player.Stop();
	} catch (e) {
		// Annoying: QT gets all messed up if you stop it before it's loaded.
		// I could try and do more here...check the status, if it's waiting then
		// set some flag and then if I somehow knew when the sound loaded, I
		// could prevent it from playing.
		DBG.println("Failed to stop QuickTime player.");
	}
};

DwtQTSoundPlugin.prototype.rewind =
function() {
	try {
		var player = this._getPlayer();
		player.Rewind();
	} catch (e) {
		// Grrr. Same problem here as described in pause();
		DBG.println("Failed to rewind QuickTime player.");
	}
};

DwtQTSoundPlugin.prototype.setTime =
function(time) {
	var player = this._getPlayer();
	try {
		var scale = 1000 / player.GetTimeScale(); // Converts to milliseconds.
		player.SetTime(time / scale);
	} catch (e) {
		// Grrr. Same problem here as described in pause();
		DBG.println("Failed to rewind QuickTime player.");
	}
};

DwtQTSoundPlugin.prototype.setVolume =
function(volume) {
	var player = this._getPlayer();
	player.SetVolume(volume);
};

DwtQTSoundPlugin.prototype._resetEvent =
function(event) {
	var keepChecking = true;
	var player = this._getPlayer();
	event.finished = false;
	var valid = false;
	if (player) {
		var status = player.GetPluginStatus();
		switch (status) {
			case "Waiting":
				event.status = DwtSoundPlugin.LOADING;
				break;
			case "Loading":
				event.status = DwtSoundPlugin.LOADING;
				break;
			case "Playable":
			case "Complete":
				valid = true;
				event.status = DwtSoundPlugin.PLAYABLE;
				break;
			default :
				event.status = DwtSoundPlugin.ERROR;
				event.errorDetail = status;
				keepChecking = false;
				break;
		}
	}
	if (valid) {
		var scale = 1000 / player.GetTimeScale(); // Converts to milliseconds.
		event.time = player.GetTime() * scale;
		event.duration = player.GetDuration() * scale;
	} else {
		event.status = DwtSoundPlugin.WAITING;
		event.time = 0;
		event.duration = 100;
	}
	if (event.status == DwtSoundPlugin.PLAYABLE && event.time == event.duration) {
		event.time = 0;
		event.finished = true;
		keepChecking = false;
	}
	return keepChecking;
};

DwtQTSoundPlugin.prototype._createHtml =
function(params) {
	this._createQTHtml(params);
};

DwtQTSoundPlugin.prototype._getPlayer =
function() {
	return document.getElementById(this._playerId);
};

//////////////////////////////////////////////////////////////////////////////
// Sound player that uses the QuickTime (QT) plugin, but does not
// make script calls to the plugin. This handles the bad quicktime
// installs all over the place.
//
//////////////////////////////////////////////////////////////////////////////
DwtQTBrokenSoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtSoundPlugin.call(this, params);

	this._playerId = Dwt.getNextId();
	this._createHtml(params);
};

DwtQTBrokenSoundPlugin.prototype = new DwtSoundPlugin;
DwtQTBrokenSoundPlugin.prototype.constructor = DwtQTBrokenSoundPlugin;

DwtQTBrokenSoundPlugin.prototype.toString =
function() {
	return "DwtQTBrokenSoundPlugin";
};

DwtQTBrokenSoundPlugin._isScriptingBroken = true;

DwtQTBrokenSoundPlugin.prototype._resetEvent =
function(event) {
	// Make up some fake event data
	event.time = 0;
	event.duration = 100;
	event.status = DwtSoundPlugin.PLAYABLE;
	event.finished = true; // Allows messages to be marked as read.
	return false; // Stop checking status.
};

DwtQTBrokenSoundPlugin.prototype._createHtml =
function(params) {
	this._createQTHtml(params);
};

/**
 * Sound player that goes through the HTML5 audio tag
 * @class
 * This class provides and HTML5 audio widget
 *
 * @param	{hash}	params		a hash of parameters
 *
 * @extends		DwtSoundPlugin
 *
 * @private
 */
DwtHtml5SoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtSoundPlugin.call(this, params);

	this._playerId = Dwt.getNextId();
    this._retryLoadAudio = 0;
	this._createHtml(params);	
};

DwtHtml5SoundPlugin.prototype = new DwtSoundPlugin;
DwtHtml5SoundPlugin.prototype.constructor = DwtHtml5SoundPlugin;

DwtHtml5SoundPlugin.prototype.toString = 
function() {
	return "DwtHtml5SoundPlugin";
};

DwtHtml5SoundPlugin.prototype._createHtml = 
function(params) {
    if (AjxEnv.isSafari) {
        AjxRpc.invoke(null, params.url, { 'X-Zimbra-Encoding': 'x-base64' },
            this._setSource.bind(this), AjxRpcRequest.HTTP_GET);
    } else {
        this.getHtmlElement().innerHTML = this._getAudioHtml(params.url);
    }
};

DwtHtml5SoundPlugin.prototype._getAudioHtml =
function(source) {
    var html = [
     "<audio autoplay='yes' ",
     "id='", this._playerId,
     "' preload ",
     "><source src='", source,
     "' type='", ZmVoiceApp.audioType, "' />",
     "</audio>"
     ];
    return html.join("");
};

DwtHtml5SoundPlugin.prototype._setSource =
function(response) {
    if(response.success){
        this.getHtmlElement().innerHTML = this._getAudioHtml('data:' + ZmVoiceApp.audioType +';base64,' + response.text);
    }
};

DwtHtml5SoundPlugin.prototype.play =
function() {
	var player = this._getPlayer();
    if (player && player.readyState){
        try {
	        this._monitorStatus();
            player.play();
        } catch (ex){
            DBG.println("Exception in DwtHtml5SoundPlugin.prototype.play: "+ ex);
        }
    }
};

DwtHtml5SoundPlugin.prototype.pause =
function() {
	var player = this._getPlayer();
    if (player && player.readyState){
        try {
            player.pause();
        } catch (ex){
            DBG.println("Exception in DwtHtml5SoundPlugin.prototype.pause: "+ ex);
        }
    }
};

DwtHtml5SoundPlugin.prototype._getPlayer =
function() {
	return document.getElementById(this._playerId);
};


DwtHtml5SoundPlugin.prototype.rewind =
function() {
	this.setTime(0);
};

DwtHtml5SoundPlugin.prototype.setTime =
function(time) {
    if (isNaN(time)){
        time = 0;
    }
    time = (time > 0) ?  (time / 1000) : 0;
	var player = this._getPlayer();
    try {
        if (player && player.readyState && player.currentTime != time ){
            player.currentTime = time;
            if (player.controls){
                player.controls.currentPosition =  time;
            }
        }
    } catch(ex){
        DBG.println("Exception in DwtHtml5SoundPlugin.prototype.setTime: "+ ex);
    }
};

DwtHtml5SoundPlugin.prototype._resetEvent =
function(event) {
	var keepChecking = true;
	var player = this._getPlayer();
	event.finished = false;
	/*
	use HTML5 canPlay event instead
	var valid = false;
	if (player) {
		var status = player.duration;
		switch (status) {
			case "NaN":
				event.status = DwtSoundPlugin.LOADING;
				break;
			default :
				event.status = DwtSoundPlugin.PLAYABLE;
				valid = true;
				keepChecking = false;
				break;
		}
	} */
	/*if (valid) {
		var scale = 1000; // Converts to milliseconds.
		event.time = player.currentTime * scale;
		event.duration = player.duration * scale;
	} */
	if(!valid) {
		event.status = DwtSoundPlugin.WAITING;
		event.time = 0;
		event.duration = 100;
	}
	if (event.status == DwtSoundPlugin.PLAYABLE && event.time == event.duration) {
		event.time = 0;
		event.finished = true;
		keepChecking = false;
	}
	return keepChecking;
};

/**
 * Adds a change listener to monitor the status of the sound being played.
 * Handles the HTML5 event timeupdate 
 * The listener will be passed an event object with the following fields:
 * <ul>
 * <li>status, a constant representing the loaded state of the sound</li>
 * <li>duration, the length of the sound</li>
 * <li>time, the current time of the sound</li>
 * </ul>
 *
 * @param {AjxListener}	listener	the listener
 */
DwtHtml5SoundPlugin.prototype.addChangeListener =
function(listener) {
	var player = this._getPlayer();
    if (!player){
        if (this._retryLoadAudio < 10){
            setTimeout(this.addChangeListener.bind(this,listener), 1000);
        }
        this._retryLoadAudio++;
        return;
    }
	var obj = this;
	player.addEventListener("timeupdate", function(e) { 
			listener.handleEvent({time: player.currentTime * 1000, duration: player.duration * 1000, status: DwtSoundPlugin.PLAYABLE});}, false);
	player.addEventListener("ended", function(e) {
			player.pause(); 
			obj.setTime(0);
			listener.obj.setFinished();
	});
	player.addEventListener("canplay", function(event) {
		var scale = 1000; // Converts to milliseconds.
		event.time = player.currentTime * scale;
		event.duration = player.duration * scale;
		player.play();
	});
	this._monitorStatus();
};
//////////////////////////////////////////////////////////////////////////////
// Sound player that goes through the Windows Media (WM) plugin.
//
// Some useful references when dealing with wmp:
// Adding Windows Media to Web Pages - Adding Scripting
//   http://msdn2.microsoft.com/en-us/library/ms983653.aspx#adding_scripting__yhbx
// Parameters supported by Windows Media Player
//   http://www.mioplanet.com/rsc/embed_mediaplayer.htm
// WM Object Model Reference:
//   http://msdn2.microsoft.com/en-us/library/bb249259.aspx
//////////////////////////////////////////////////////////////////////////////
DwtWMSoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtSoundPlugin.call(this, params);

	this._playerId = Dwt.getNextId();
	this._createHtml(params);
};

DwtWMSoundPlugin.prototype = new DwtSoundPlugin;
DwtWMSoundPlugin.prototype.constructor = DwtWMSoundPlugin;

DwtWMSoundPlugin.prototype.toString =
function() {
	return "DwtWMSoundPlugin";
};

DwtWMSoundPlugin.prototype.play =
function() {
	var player = this._getPlayer();
	player.controls.play();
	this._monitorStatus();
};

DwtWMSoundPlugin.prototype.pause =
function() {
	var player = this._getPlayer();
	player.controls.pause();
};

DwtWMSoundPlugin.prototype.rewind =
function() {
	this.setTime(0);
};

DwtWMSoundPlugin.prototype.setTime =
function(time) {
	var player = this._getPlayer();
	player.controls.currentPosition = time / 1000;
};

DwtWMSoundPlugin.prototype.setVolume =
function(volume) {
	var volume = volume * 100 / 256;
	var player = this._getPlayer();
	player.settings.volume = volume;
};

DwtWMSoundPlugin.prototype._resetEvent =
function(event) {
	var keepChecking = true;
	var player = this._getPlayer();
	var error = player.currentMedia.error;
	if (error) {
		event.status = DwtSoundPlugin.ERROR;
		event.errorDetail = error.errorDescription;
		keepChecking = false;
	} else if (!player.controls.isAvailable("currentPosition")) { // if (!is loaded)
		// Whatever....fake data.
		event.status = DwtSoundPlugin.LOADING;
		event.time = 0;
		event.duration = 100;
	} else {
		event.status = DwtSoundPlugin.PLAYABLE;
		event.time = player.controls.currentPosition * 1000;
		event.duration = player.currentMedia.duration * 1000 || event.time + 100; // Make sure max > min in slider
		if (!event.time) {
			event.finished = true;
			keepChecking = false;
			player.close();
		}
	}
	return keepChecking;
};

//TODO: Take out all the AjxEnv stuff in here, unless we find a way to use WMP in Firefox.
DwtWMSoundPlugin.prototype._createHtml =
function(params) {
	var volume = params.volume * 100 / 256;

	var html = [];
	var i = 0;
	if (AjxEnv.isIE) {
		html[i++] = "<object classid='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6' id='";
		html[i++] = this._playerId;
		html[i++] = "'>";
	} else {
		html[i++] = "<embed classid='CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6' id='";
		html[i++] = this._playerId;
		html[i++] = "' ";
	}
	var pluginArgs = {
		width: this._width,
		height: this._height,
		url: params.url,
		volume: volume,
		enablejavascript: "true" };
	for (var name in pluginArgs) {
		if (AjxEnv.isIE) {
			html[i++] = "<param name='";
			html[i++] = name;
			html[i++] = "' value='";
			html[i++] = pluginArgs[name];
			html[i++] = "'/>";
		} else {
			html[i++] = name;
			html[i++] = "='";
			html[i++] = pluginArgs[name];
			html[i++] = "' ";
		}
	}
	if (AjxEnv.isIE) {
		html[i++] = "</object>";
	} else {
		html[i++] = " type='application/x-mplayer2'/>";
	}

	this.getHtmlElement().innerHTML = html.join("");
	DBG.printRaw(html.join(""));
};

DwtWMSoundPlugin.prototype._getPlayer =
function() {
	return document.getElementById(this._playerId);
};

//////////////////////////////////////////////////////////////////////////////
// Sound player for browsers without a known sound plugin.
//////////////////////////////////////////////////////////////////////////////
DwtMissingSoundPlugin = function(params) {
	if (arguments.length == 0) return;
	params.className = params.className || "DwtSoundPlugin";
	DwtSoundPlugin.call(this, params);

    var args = { };
    this.getHtmlElement().innerHTML = AjxTemplate.expand("dwt.Widgets#DwtMissingSoundPlayer", args);

    this._setMouseEventHdlrs();
};

DwtMissingSoundPlugin.prototype = new DwtSoundPlugin;
DwtMissingSoundPlugin.prototype.constructor = DwtMissingSoundPlugin;

DwtMissingSoundPlugin.prototype.toString =
function() {
	return "DwtMissingSoundPlugin";
};

DwtMissingSoundPlugin._pluginMissing = true;

DwtMissingSoundPlugin.prototype.addHelpListener =
function(listener) {
	this.addListener(DwtEvent.ONMOUSEDOWN, listener);
};
}

if (AjxPackage.define("zimbraMail.abook.model.ZmContact")) {
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
 * This file contains the contact class.
 */

if (!window.ZmContact) {
/**
 * Creates an empty contact.
 * @class
 * This class represents a contact (typically a person) with all its associated versions
 * of email address, home and work addresses, phone numbers, etc. Contacts can be filed/sorted
 * in different ways, with the default being Last, First. A contact is an item, so
 * it has tagging and flagging support, and belongs to a list.
 * <p>
 * Most of a contact's data is kept in attributes. These include name, phone, etc. Meta-data and
 * data common to items are not kept in attributes. These include flags, tags, folder, and
 * modified/created dates. Since the attribute data for contacts is loaded only once, a contact
 * gets its attribute values from that canonical list.
 * </p>
 *
 * @param {int}	id		the unique ID
 * @param {ZmContactList}	list		the list that contains this contact
 * @param {constant}	type		the item type
 * @param {object}	newDl		true if this is a new DL
 *
 * @extends		ZmItem
 */
ZmContact = function(id, list, type, newDl) {
	if (arguments.length == 0) { return; }

	type = type || ZmItem.CONTACT;
	ZmItem.call(this, type, id, list);

	this.attr = {};
	this.isGal = (this.list && this.list.isGal) || newDl;
	if (newDl) {
		this.folderId = ZmFolder.ID_DLS;
		this.dlInfo = {	isMember: false,
						isOwner: true,
						subscriptionPolicy: null,
						unsubscriptionPolicy: null,
						description: "",
						displayName: "",
						notes: "",
						hideInGal: false,
						mailPolicy: null,
						owners: [appCtxt.get(ZmSetting.USERNAME)]
		};

	}

	this.participants = new AjxVector(); // XXX: need to populate this guy (see ZmConv)
};

ZmContact.prototype = new ZmItem;
ZmContact.prototype.constructor = ZmContact;
ZmContact.prototype.isZmContact = true;

// fields
ZmContact.F_anniversary				= "anniversary";
ZmContact.F_assistantPhone			= "assistantPhone";
ZmContact.F_attachment				= "attachment";
ZmContact.F_birthday				= "birthday";
ZmContact.F_callbackPhone			= "callbackPhone";
ZmContact.F_carPhone				= "carPhone";
ZmContact.F_company					= "company";
ZmContact.F_companyPhone			= "companyPhone";
ZmContact.F_custom					= "custom";
ZmContact.F_description				= "description";
ZmContact.F_department				= "department";
ZmContact.F_dlist					= "dlist";				// Group fields
ZmContact.F_dlDisplayName			= "dldisplayname"; //DL
ZmContact.F_dlDesc					= "dldesc";  //DL
ZmContact.F_dlHideInGal				= "dlhideingal";  //DL
ZmContact.F_dlNotes					= "dlnotes";  //DL
ZmContact.F_dlSubscriptionPolicy	= "dlsubspolicy";  //DL
ZmContact.F_dlMailPolicy			= "dlmailpolicy";  //DL
ZmContact.F_dlMailPolicySpecificMailers	= "dlmailpolicyspecificmailers";  //DL
ZmContact.F_dlUnsubscriptionPolicy	= "dlunsubspolicy";  //DL
ZmContact.F_dlListOwners			= "dllistowners";  //DL
ZmContact.F_email					= "email";
ZmContact.F_email2					= "email2";
ZmContact.F_email3					= "email3";
ZmContact.F_email4					= "email4";
ZmContact.F_email5					= "email5";
ZmContact.F_email6					= "email6";
ZmContact.F_email7					= "email7";
ZmContact.F_email8					= "email8";
ZmContact.F_email9					= "email9";
ZmContact.F_email10					= "email10";
ZmContact.F_email11					= "email11";
ZmContact.F_email12					= "email12";
ZmContact.F_email13					= "email13";
ZmContact.F_email14					= "email14";
ZmContact.F_email15					= "email15";
ZmContact.F_email16					= "email16";
ZmContact.F_fileAs					= "fileAs";
ZmContact.F_firstName				= "firstName";
ZmContact.F_folderId				= "folderId";
ZmContact.F_groups                  = "groups";         //group members
ZmContact.F_homeCity				= "homeCity";
ZmContact.F_homeCountry				= "homeCountry";
ZmContact.F_homeFax					= "homeFax";
ZmContact.F_homePhone				= "homePhone";
ZmContact.F_homePhone2				= "homePhone2";
ZmContact.F_homePostalCode			= "homePostalCode";
ZmContact.F_homeState				= "homeState";
ZmContact.F_homeStreet				= "homeStreet";
ZmContact.F_homeURL					= "homeURL";
ZmContact.F_image					= "image";				// contact photo
ZmContact.F_imAddress 				= "imAddress";			// IM addresses
ZmContact.F_imAddress1 				= "imAddress1";			// IM addresses
ZmContact.F_imAddress2 				= "imAddress2";
ZmContact.F_imAddress3				= "imAddress3";
ZmContact.F_jobTitle				= "jobTitle";
ZmContact.F_lastName				= "lastName";
ZmContact.F_maidenName				= "maidenName";
ZmContact.F_memberC                 = "memberC";
ZmContact.F_memberG                 = "memberG";
ZmContact.F_memberI                 = "memberI";
ZmContact.F_middleName				= "middleName";
ZmContact.F_mobilePhone				= "mobilePhone";
ZmContact.F_namePrefix				= "namePrefix";
ZmContact.F_nameSuffix				= "nameSuffix";
ZmContact.F_nickname				= "nickname";
ZmContact.F_notes					= "notes";
ZmContact.F_otherCity				= "otherCity";
ZmContact.F_otherCountry			= "otherCountry";
ZmContact.F_otherFax				= "otherFax";
ZmContact.F_otherPhone				= "otherPhone";
ZmContact.F_otherPostalCode			= "otherPostalCode";
ZmContact.F_otherState				= "otherState";
ZmContact.F_otherStreet				= "otherStreet";
ZmContact.F_otherURL				= "otherURL";
ZmContact.F_pager					= "pager";
ZmContact.F_phoneticFirstName       = "phoneticFirstName";
ZmContact.F_phoneticLastName        = "phoneticLastName";
ZmContact.F_phoneticCompany         = "phoneticCompany";
ZmContact.F_type					= "type";
ZmContact.F_workAltPhone			= "workAltPhone";
ZmContact.F_workCity				= "workCity";
ZmContact.F_workCountry				= "workCountry";
ZmContact.F_workEmail1				= "workEmail1";
ZmContact.F_workEmail2				= "workEmail2";
ZmContact.F_workEmail3				= "workEmail3";
ZmContact.F_workFax					= "workFax";
ZmContact.F_workMobile				= "workMobile";
ZmContact.F_workPhone				= "workPhone";
ZmContact.F_workPhone2				= "workPhone2";
ZmContact.F_workPostalCode			= "workPostalCode";
ZmContact.F_workState				= "workState";
ZmContact.F_workStreet				= "workStreet";
ZmContact.F_workURL					= "workURL";
ZmContact.F_imagepart               = "imagepart";          // New field for bug 73146 - Contacts call does not return the image information
ZmContact.F_thumbnailPhoto          = "thumbnailPhoto";
ZmContact.F_zimletImage				= "zimletImage";
ZmContact.X_fileAs					= "fileAs";				// extra fields
ZmContact.X_firstLast				= "firstLast";
ZmContact.X_fullName				= "fullName";
ZmContact.X_vcardXProps             = "vcardXProps";
ZmContact.X_outlookUserField        = "outlookUserField";
ZmContact.MC_cardOwner				= "cardOwner";			// My card fields
ZmContact.MC_workCardMessage		= "workCardMessage";
ZmContact.MC_homeCardMessage		= "homeCardMessage";
ZmContact.MC_homePhotoURL			= "homePhotoURL";
ZmContact.MC_workPhotoURL			= "workPhotoURL";
ZmContact.GAL_MODIFY_TIMESTAMP		= "modifyTimeStamp";	// GAL fields
ZmContact.GAL_CREATE_TIMESTAMP		= "createTimeStamp";
ZmContact.GAL_ZIMBRA_ID				= "zimbraId";
ZmContact.GAL_OBJECT_CLASS			= "objectClass";
ZmContact.GAL_MAIL_FORWARD_ADDRESS	= "zimbraMailForwardingAddress";
ZmContact.GAL_CAL_RES_TYPE			= "zimbraCalResType";
ZmContact.GAL_CAL_RES_LOC_NAME		= "zimbraCalResLocationDisplayName";

// file as
(function() {
	var i = 1;
	ZmContact.FA_LAST_C_FIRST			= i++;
	ZmContact.FA_FIRST_LAST 			= i++;
	ZmContact.FA_COMPANY 				= i++;
	ZmContact.FA_LAST_C_FIRST_COMPANY	= i++;
	ZmContact.FA_FIRST_LAST_COMPANY		= i++;
	ZmContact.FA_COMPANY_LAST_C_FIRST	= i++;
	ZmContact.FA_COMPANY_FIRST_LAST		= i++;
	ZmContact.FA_CUSTOM					= i++;
})();

// Field information

ZmContact.ADDRESS_FIELDS = [
    // NOTE: sync with field order in ZmEditContactView's templates
	ZmContact.F_homeCity,
	ZmContact.F_homeCountry,
	ZmContact.F_homePostalCode,
	ZmContact.F_homeState,
	ZmContact.F_homeStreet,
	ZmContact.F_workCity,
	ZmContact.F_workCountry,
	ZmContact.F_workPostalCode,
	ZmContact.F_workState,
	ZmContact.F_workStreet,
    ZmContact.F_otherCity,
    ZmContact.F_otherCountry,
    ZmContact.F_otherPostalCode,
    ZmContact.F_otherState,
    ZmContact.F_otherStreet
];
ZmContact.EMAIL_FIELDS = [
	ZmContact.F_email,
	ZmContact.F_workEmail1,
	ZmContact.F_workEmail2,
	ZmContact.F_workEmail3
];
ZmContact.IM_FIELDS = [
	ZmContact.F_imAddress
];
ZmContact.OTHER_FIELDS = [
    // NOTE: sync with field order in ZmEditContactView's templates
	ZmContact.F_birthday,
    ZmContact.F_anniversary,
	ZmContact.F_custom
];
ZmContact.PHONE_FIELDS = [
    // NOTE: sync with field order in ZmEditContactView's templates
    ZmContact.F_mobilePhone,
    ZmContact.F_workPhone,
    ZmContact.F_workFax,
    ZmContact.F_companyPhone,
    ZmContact.F_homePhone,
    ZmContact.F_homeFax,
    ZmContact.F_pager,
    ZmContact.F_callbackPhone,
	ZmContact.F_assistantPhone,
	ZmContact.F_carPhone,
	ZmContact.F_otherPhone,
    ZmContact.F_otherFax,
	ZmContact.F_workAltPhone,
	ZmContact.F_workMobile
];
ZmContact.PRIMARY_FIELDS = [
    // NOTE: sync with field order in ZmEditContactView's templates
    ZmContact.F_image,
    ZmContact.F_namePrefix,
    ZmContact.F_firstName,
    ZmContact.F_phoneticFirstName,
    ZmContact.F_middleName,
	ZmContact.F_maidenName,
    ZmContact.F_lastName,
    ZmContact.F_phoneticLastName,
    ZmContact.F_nameSuffix,
    ZmContact.F_nickname,
    ZmContact.F_jobTitle,
    ZmContact.F_department,
	ZmContact.F_company,
    ZmContact.F_phoneticCompany,
	ZmContact.F_fileAs,
	ZmContact.F_folderId,
	ZmContact.F_notes
];
ZmContact.URL_FIELDS = [
    // NOTE: sync with field order in ZmEditContactView's templates
	ZmContact.F_homeURL,
	ZmContact.F_workURL,
	ZmContact.F_otherURL
];
ZmContact.GAL_FIELDS = [
	ZmContact.GAL_MODIFY_TIMESTAMP,
	ZmContact.GAL_CREATE_TIMESTAMP,
	ZmContact.GAL_ZIMBRA_ID,
	ZmContact.GAL_OBJECT_CLASS,
	ZmContact.GAL_MAIL_FORWARD_ADDRESS,
	ZmContact.GAL_CAL_RES_TYPE,
	ZmContact.GAL_CAL_RES_LOC_NAME,
	ZmContact.F_type
];
ZmContact.MYCARD_FIELDS = [
	ZmContact.MC_cardOwner,
	ZmContact.MC_homeCardMessage,
	ZmContact.MC_homePhotoURL,
	ZmContact.MC_workCardMessage,
	ZmContact.MC_workPhotoURL
];
ZmContact.X_FIELDS = [
	ZmContact.X_firstLast,
	ZmContact.X_fullName,
    ZmContact.X_vcardXProps
];


ZmContact.IGNORE_NORMALIZATION = [];

ZmContact.ADDR_PREFIXES = ["work","home","other"];
ZmContact.ADDR_SUFFIXES = ["Street","City","State","PostalCode","Country"];

ZmContact.updateFieldConstants = function() {

	for (var i = 0; i < ZmContact.ADDR_PREFIXES.length; i++) {
		for (var j = 0; j < ZmContact.ADDR_SUFFIXES.length; j++) {
			ZmContact.IGNORE_NORMALIZATION.push(ZmContact.ADDR_PREFIXES[i] + ZmContact.ADDR_SUFFIXES[j]);
		}
	}

ZmContact.DISPLAY_FIELDS = [].concat(
	ZmContact.ADDRESS_FIELDS,
	ZmContact.EMAIL_FIELDS,
	ZmContact.IM_FIELDS,
	ZmContact.OTHER_FIELDS,
	ZmContact.PHONE_FIELDS,
	ZmContact.PRIMARY_FIELDS,
	ZmContact.URL_FIELDS
);

ZmContact.IGNORE_FIELDS = [].concat(
	ZmContact.GAL_FIELDS,
	ZmContact.MYCARD_FIELDS,
	ZmContact.X_FIELDS,
	[ZmContact.F_imagepart, ZmContact.F_thumbnailPhoto]
);

ZmContact.ALL_FIELDS = [].concat(
	ZmContact.DISPLAY_FIELDS, ZmContact.IGNORE_FIELDS
);

ZmContact.IS_DATE = {};
ZmContact.IS_DATE[ZmContact.F_birthday] = true;
ZmContact.IS_DATE[ZmContact.F_anniversary] = true;

ZmContact.IS_IGNORE = AjxUtil.arrayAsHash(ZmContact.IGNORE_FIELDS);

// number of distribution list members to fetch at a time
ZmContact.DL_PAGE_SIZE = 100;

ZmContact.GROUP_CONTACT_REF = "C";
ZmContact.GROUP_GAL_REF = "G";
ZmContact.GROUP_INLINE_REF = "I";	
}; // updateFieldConstants()
ZmContact.updateFieldConstants();

/**
 * This structure can be queried to determine if the first
 * entry in a multi-value entry is suffixed with "1". Most
 * attributes add a numerical suffix to all but the first
 * entry.
 * <p>
 * <strong>Note:</strong>
 * In most cases, {@link ZmContact#getAttributeName} is a better choice.
 */
ZmContact.IS_ADDONE = {};
ZmContact.IS_ADDONE[ZmContact.F_custom] = true;
ZmContact.IS_ADDONE[ZmContact.F_imAddress] = true;
ZmContact.IS_ADDONE[ZmContact.X_outlookUserField] = true;

/**
 * Gets an indexed attribute name taking into account if the field
 * with index 1 should append the "1" or not. Code should call this
 * function in lieu of accessing {@link ZmContact.IS_ADDONE} directly.
 */
ZmContact.getAttributeName = function(name, index) {
	index = index || 1;
	return index > 1 || ZmContact.IS_ADDONE[name] ? name+index : name;
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmContact.prototype.toString =
function() {
	return "ZmContact";
};

// Class methods

/**
 * Creates a contact from an XML node.
 *
 * @param {Object}	node		a "cn" XML node
 * @param {Hash}	args		args to pass to the constructor
 * @return	{ZmContact}	the contact
 */
ZmContact.createFromDom =
function(node, args) {
	// check global cache for this item first
	var contact = appCtxt.cacheGet(node.id);

	// make sure the revision hasnt changed, otherwise contact is out of date
	if (contact == null || (contact && contact.rev != node.rev)) {
		contact = new ZmContact(node.id, args.list);
		if (args.isGal) {
			contact.isGal = args.isGal;
		}
		contact._loadFromDom(node);
		//update the canonical list
		appCtxt.getApp(ZmApp.CONTACTS).getContactList().add(contact);
	} else {
		if (node.m) {
			contact.attr[ZmContact.F_groups] = node.m;
		}
		if (node.ref) {
			contact.ref = node.ref;
		}
		if (node.tn) {
			contact._parseTagNames(node.tn);
		}
		AjxUtil.hashUpdate(contact.attr, node._attrs);	// merge new attrs just in case we don't have them
		contact.list = args.list || new ZmContactList(null);
		contact._list = contact._list || {}; // We need to add new contact list in contact._list array which contains lists in which contact is present.
		contact._list[contact.list.id] = true;
	}
	//S/MIME: If user certificate is present, include it into contact's object
	if (node.certificate) {
		contact.certificate = node.certificate;
	}

	return contact;
};

/**
 * Compares two contacts based on how they are filed. Intended for use by
 * sort methods.
 *
 * @param {ZmContact}		a		a contact
 * @param {ZmContact}		b		a contact
 * @return	{int}	0 if the contacts are the same; 1 if "a" is before "b"; -1 if "b" is before "a"
 */
ZmContact.compareByFileAs =
function(a, b) {
	var aFileAs = (a instanceof ZmContact) ? a.getFileAs(true) : ZmContact.computeFileAs(a._attrs).toLowerCase();
	var bFileAs = (b instanceof ZmContact) ? b.getFileAs(true) : ZmContact.computeFileAs(b._attrs).toLowerCase();

	if (!bFileAs || (aFileAs > bFileAs)) return 1;
	if (aFileAs < bFileAs) return -1;
	return 0;
};

/**
 * Figures out the filing string for the contact according to the chosen method.
 *
 * @param {ZmContact|Hash}	contact		a contact or a hash of contact attributes
 */
ZmContact.computeFileAs =
function(contact) {
	/*
	 * Bug 98176: To keep the same logic of generating the FileAs contact
	 *    label string between the Ajax client, and HTML client, when the
	 *    computeFileAs(), and fileAs*() functions are modified, please
	 *    change the corresponding functions defined in the autoComplete.tag
	 */
	var attr = (contact instanceof ZmContact) ? contact.getAttrs() : contact;
	if (!attr) return;

	if (attr[ZmContact.F_dlDisplayName]) {
		//this is only DL case. But since this is sometimes just the attrs,
		//I can't always use isDistributionList method.
		return attr[ZmContact.F_dlDisplayName];
	}

	var val = parseInt(attr.fileAs);
	var fa;
	var idx = 0;

	switch (val) {
		case ZmContact.FA_LAST_C_FIRST: 										// Last, First
		default: {
			// if GAL contact, use full name instead (bug fix #4850,4009)
			if (contact && contact.isGal) {
				if (attr.fullName) { // bug fix #27428 - if fullName is Array, return first
					return (attr.fullName instanceof Array) ? attr.fullName[0] : attr.fullName;
				}
				return ((attr.email instanceof Array) ? attr.email[0] : attr.email);
			}
			fa = ZmContact.fileAsLastFirst(attr.firstName, attr.lastName, attr.fullName, attr.nickname);
		}
		break;

		case ZmContact.FA_FIRST_LAST: { 										// First Last
			fa = ZmContact.fileAsFirstLast(attr.firstName, attr.lastName, attr.fullName, attr.nickname);
		}
		break;

		case ZmContact.FA_COMPANY: {											// Company
			if (attr.company) fa = attr.company;
		}
		break;

		case ZmContact.FA_LAST_C_FIRST_COMPANY: {								// Last, First (Company)
			var name = ZmContact.fileAsLastFirst(attr.firstName, attr.lastName, attr.fullName, attr.nickname);
			fa = ZmContact.fileAsNameCompany(name, attr.company);
		}
		break;

		case ZmContact.FA_FIRST_LAST_COMPANY: {									// First Last (Company)
			var name = ZmContact.fileAsFirstLast(attr.firstName, attr.lastName, attr.fullName, attr.nickname);
			fa = ZmContact.fileAsNameCompany(name, attr.company);
		}
		break;

		case ZmContact.FA_COMPANY_LAST_C_FIRST: {								// Company (Last, First)
			var name = ZmContact.fileAsLastFirst(attr.firstName, attr.lastName);
			fa = ZmContact.fileAsCompanyName(name, attr.company);
		}
		break;

		case ZmContact.FA_COMPANY_FIRST_LAST: {									// Company (First Last)
			var name = ZmContact.fileAsFirstLast(attr.firstName, attr.lastName);
			fa = ZmContact.fileAsCompanyName(name, attr.company);
		}
		break;

		case ZmContact.FA_CUSTOM: {												// custom looks like this: "8:foobar"
			return attr.fileAs.substring(2);
		}
		break;
	}
	return fa || attr.fullName || "";
};

/**
 * Name printing helper "First Last".
 * 
 * @param	{String}	first		the first name
 * @param	{String}	last		the last name
 * @param	{String}	fullname		the fullname
 * @param	{String}	nickname		the nickname
 * @return	{String}	the name format
 */
ZmContact.fileAsFirstLast =
function(first, last, fullname, nickname) {
	if (first && last)
		return AjxMessageFormat.format(ZmMsg.fileAsFirstLast, [first, last]);
	return first || last || fullname || nickname || "";
};

/**
 * Name printing helper "Last, First".
 * 
 * @param	{String}	first		the first name
 * @param	{String}	last		the last name
 * @param	{String}	fullname		the fullname
 * @param	{String}	nickname		the nickname
 * @return	{String}	the name format
 */
ZmContact.fileAsLastFirst =
function(first, last, fullname, nickname) {
	if (first && last)
		return AjxMessageFormat.format(ZmMsg.fileAsLastFirst, [first, last]);
	return last || first || fullname || nickname || "";
};

/**
 * Name printing helper "Name (Company)".
 *
 * @param	{String}	name		the contact name
 * @param	{String}	company		the company
 * @return	{String}	the name format
 */
ZmContact.fileAsNameCompany =
function(name, company) {
	if (name && company)
		return AjxMessageFormat.format(ZmMsg.fileAsNameCompany, [name, company]);
	if (company)
		return AjxMessageFormat.format(ZmMsg.fileAsCompanyAsSecondaryOnly, [company]);
	return name;
};

/**
 * Name printing helper "Company (Name)".
 * 
 * @param	{String}	name		the contact name
 * @param	{String}	company		the company
 * @return	{String}	the name format
 */
ZmContact.fileAsCompanyName =
function(name, company) {
	if (company && name)
		return AjxMessageFormat.format(ZmMsg.fileAsCompanyName, [name, company]);
	if (name)
		return AjxMessageFormat.format(ZmMsg.fileAsNameAsSecondaryOnly, [name]);
	return company;
};

/**
 * Computes the custom file as string by prepending "8:" to the given custom fileAs string.
 * 
 * @param {Hash}	customFileAs	a set of contact attributes
 * @return	{String}	the name format
 */
ZmContact.computeCustomFileAs =
function(customFileAs) {
	return [ZmContact.FA_CUSTOM, ":", customFileAs].join("");
};

/*
 * 
 * These next few static methods handle a contact that is either an anonymous
 * object or an actual ZmContact. The former is used to optimize loading. The
 * anonymous object is upgraded to a ZmContact when needed.
 *  
 */

/**
 * Gets an attribute.
 * 
 * @param	{ZmContact}	contact		the contact
 * @param	{String}	attr		the attribute
 * @return	{Object}	the attribute value or <code>null</code> for none
 */
ZmContact.getAttr =
function(contact, attr) {
	return (contact instanceof ZmContact)
		? contact.getAttr(attr)
		: (contact && contact._attrs) ? contact._attrs[attr] : null;
};

/**
 * returns the prefix of a string in the format "abc123". (would return "abc"). If the string is all number, it's a special case and returns the string itself. e.g. "234" would return "234".
 */
ZmContact.getPrefix = function(s) {
	var trimmed = s.replace(/\d+$/, "");
	if (trimmed === "") {
		//number only - don't trim. The number is the prefix.
		return s;
	}
	return trimmed;
};

/**
 * Normalizes the numbering of the given attribute names and
 * returns a new object with the re-numbered attributes. For
 * example, if the attributes contains a "foo2" but no "foo",
 * then the "foo2" attribute will be renamed to "foo" in the
 * returned object.
 *
 * @param {Hash}	attrs  a hash of attributes to normalize.
 * @param {String}	[prefix] if specified, only the the attributes that match the given prefix will be returned
 * @param {Array}	[ignore] if specified, the attributes that are present in the array will not be normalized
 * @return	{Hash}	a hash of normalized attributes
 */
ZmContact.getNormalizedAttrs = function(attrs, prefix, ignore) {
	var nattrs = {};
	if (attrs) {
		// normalize attribute numbering
		var names = AjxUtil.keys(attrs);
		names.sort(ZmContact.__BY_ATTRIBUTE);
		var a = {};
		for (var i = 0; i < names.length; i++) {
			var name = names[i];
			// get current count
			var nprefix = ZmContact.getPrefix(name);
			if (prefix && prefix != nprefix) continue;
			if (AjxUtil.isArray(ignore) && AjxUtil.indexOf(ignore, nprefix)!=-1) {
				nattrs[name] = attrs[name];
			} else {
				if (!a[nprefix]) a[nprefix] = 0;
				// normalize, if needed
				var nname = ZmContact.getAttributeName(nprefix, ++a[nprefix]);
				nattrs[nname] = attrs[name];
			}
		}
	}
	return nattrs;
};

ZmContact.__RE_ATTRIBUTE = /^(.*?)(\d+)$/;
ZmContact.__BY_ATTRIBUTE = function(a, b) {
	var aa = a.match(ZmContact.__RE_ATTRIBUTE) || [a,a,1];
	var bb = b.match(ZmContact.__RE_ATTRIBUTE) || [b,b,1];
	return aa[1] == bb[1] ? Number(aa[2]) - Number(bb[2]) : aa[1].localeCompare(bb[1]);
};

/**
 * Sets the attribute.
 * 
 * @param	{ZmContact}	contact		the contact
 * @param	{String}	attr		the attribute
 * @param	{Object}	value		the attribute value
 */
ZmContact.setAttr =
function(contact, attr, value) {
	if (contact instanceof ZmContact)
		contact.setAttr(attr, value);
	else
		contact._attrs[attr] = value;
};

/**
 * Checks if the contact is in the trash.
 * 
 * @param	{ZmContact}	contact		the contact
 * @return	{Boolean}	<code>true</code> if in trash
 */
ZmContact.isInTrash =
function(contact) {
	var folderId = (contact instanceof ZmContact) ? contact.folderId : contact.l;
	var folder = appCtxt.getById(folderId);
	return (folder && folder.isInTrash());
};

/**
 * @private
 */
ZmContact.prototype.load =
function(callback, errorCallback, batchCmd, deref) {
	var jsonObj = {GetContactsRequest:{_jsns:"urn:zimbraMail"}};
	if (deref) {
		jsonObj.GetContactsRequest.derefGroupMember = "1";
	}
	jsonObj.GetContactsRequest.returnCertInfo = "1"; //Fix for: ZCS-999 and ZCS-991
	var request = jsonObj.GetContactsRequest;
	request.cn = [{id:this.id}];

	var respCallback = new AjxCallback(this, this._handleLoadResponse, [callback]);

	if (batchCmd) {
		var jsonObj = {GetContactsRequest:{_jsns:"urn:zimbraMail"}};
		if (deref) {
			jsonObj.GetContactsRequest.derefGroupMember = "1";
		}
		jsonObj.GetContactsRequest.returnCertInfo = "1"; //Fix for: ZCS-999 and ZCS-991
		jsonObj.GetContactsRequest.cn = {id:this.id};
		batchCmd.addRequestParams(jsonObj, respCallback, errorCallback);
	} else {
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj,
												asyncMode:true,
												callback:respCallback,
												errorCallback:errorCallback});
	}
};

/**
 * @private
 */
ZmContact.prototype._handleLoadResponse =
function(callback, result) {
	var resp = result.getResponse().GetContactsResponse;

	// for now, we just assume only one contact was requested at a time
	var contact = resp.cn[0];
	this.attr = contact._attrs;
	if (contact.m) {
		for (var i = 0; i < contact.m.length; i++) {
			//cache contacts from contact groups (e.g. GAL contacts, shared contacts have not already been cached)
			var member = contact.m[i];
			var isGal = false;
			if (member.type == ZmContact.GROUP_GAL_REF) {
				isGal = true;
			}
			if (member.cn && member.cn.length > 0) {
				var memberContact = member.cn[0];
				memberContact.ref = memberContact.ref || (isGal && member.value); //we sometimes don't get "ref" but the "value" for GAL is the ref.
				var loadMember = ZmContact.createFromDom(memberContact, {list: this.list, isGal: isGal}); //pass GAL so fileAS gets set correctly
				loadMember.isDL = isGal && loadMember.attr[ZmContact.F_type] == "group";
				appCtxt.cacheSet(member.value, loadMember);
			}
			
		}
		this._loadFromDom(contact); //load group
	}
	this.isLoaded = true;
	if (callback) {
		callback.run(contact, this);
	}
};

/**
 * @private
 */
ZmContact.prototype.clear =
function() {
	// bug fix #41666 - override base class method and do nothing
};

/**
 * Checks if the contact attributes are empty.
 * 
 * @return	{Boolean}	<code>true</code> if empty
 */
ZmContact.prototype.isEmpty =
function() {
	for (var i in this.attr) {
		return false;
	}
	return true;
};

/**
 * Checks if the contact is shared.
 * 
 * @return	{Boolean}	<code>true</code> if shared
 */
ZmContact.prototype.isShared =
function() {
	return this.addrbook && this.addrbook.link;
};

/**
 * Checks if the contact is read-only.
 * 
 * @return	{Boolean}	<code>true</code> if read-only
 */
ZmContact.prototype.isReadOnly =
function() {
	if (this.isGal) { return true; }

	return this.isShared()
		? this.addrbook && this.addrbook.isReadOnly()
		: false;
};

/**
 * Checks if the contact is locked. This is different for DLs than read-only.
 *
 * @return	{Boolean}	<code>true</code> if read-only
 */
ZmContact.prototype.isLocked =
function() {
	if (!this.isDistributionList()) {
		return this.isReadOnly();
	}
	if (!this.dlInfo) {
		return false; //rare case after editing by an owner if the fileAsChanged, the new dl Info still not read, and the layout re-done. So don't show the lock.
	}
	var dlInfo = this.dlInfo;
	if (dlInfo.isOwner) {
		return false;
	}
	if (dlInfo.isMember) {
    	return dlInfo.unsubscriptionPolicy == ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT;
	}
	return dlInfo.subscriptionPolicy == ZmContactSplitView.SUBSCRIPTION_POLICY_REJECT;
};

/**
 * Checks if the contact is a group.
 * 
 * @return	{Boolean}	<code>true</code> if a group
 */
ZmContact.prototype.isGroup =
function() {
	return this.getAttr(ZmContact.F_type) == "group" || this.type == ZmItem.GROUP;
};

/**
 * Checks if the contact is a DL.
 *
 * @return	{Boolean}	<code>true</code> if a group
 */
ZmContact.prototype.isDistributionList =
function() {
	return this.isGal && this.isGroup();
};


// parses "groups" attr into AjxEmailAddress objects stored in 3 vectors (all, good, and bad)
/**
 * Gets the group members.
 *
 * @return	{AjxVector}		the group members or <code>null</code> if not group
 */
ZmContact.prototype.getGroupMembers =
function() {
	var allMembers = this.getAllGroupMembers();
	var addrs = [];
	for (var i = 0; i < allMembers.length; i++) {
		addrs.push(allMembers[i].toString());
	}
	return AjxEmailAddress.parseEmailString(addrs.join(", "));
};	

/**
 * parses "groups" attr into an AjxEmailAddress with a few extra attributes (see ZmContactsHelper._wrapInlineContact)
 * 
 * @return	{AjxVector}		the group members or <code>null</code> if not group
 */
ZmContact.prototype.getAllGroupMembers =
function() {

	if (this.isDistributionList()) {
		return this.dlMembers;
	}

	var addrs = [];

	var groupMembers = this.attr[ZmContact.F_groups];
	if (!groupMembers){
		return AjxEmailAddress.parseEmailString(this.attr[ZmContact.F_email]);  //I doubt this is needed or works correctly, but I keep this logic from before. If we don't have the group members, how can we return the group email instead?
	}
	for (var i = 0; i < groupMembers.length; i++) {
		var member = groupMembers[i];
		var type = member.type;
		var value = member.value;
		if (type == ZmContact.GROUP_INLINE_REF) {
			addrs.push(ZmContactsHelper._wrapInlineContact(value));
		}
		else {
			var contact = ZmContact.getContactFromCache(value);	 //TODO: handle contacts not cached?
			if (!contact) {
				DBG.println(AjxDebug.DBG1, "Disregarding uncached contact: " + value);
				continue;
			}
			var ajxEmailAddress = ZmContactsHelper._wrapContact(contact);
			if (ajxEmailAddress && type === ZmContact.GROUP_CONTACT_REF) {
				ajxEmailAddress.groupRefValue = value; //don't normalize value
			}
			if (ajxEmailAddress) {
				addrs.push(ajxEmailAddress);
			}
		}
	}
	return addrs;
};


ZmContact.prototype.gatherExtraDlStuff =
function(callback) {
	if (this.dlInfo && !this.dlInfo.isMinimal) {
		//already there, skip to next step, loading DL Members
		this.loadDlMembers(callback);
		return;
	}
	var callbackFromGettingInfo = this._handleGetDlInfoResponse.bind(this, callback);
	this.loadDlInfo(callbackFromGettingInfo);
};


ZmContact.prototype._handleGetDlInfoResponse =
function(callback, result) {
	var response = result._data.GetDistributionListResponse;
	var dl = response.dl[0];
	var attrs = dl._attrs;
	var isMember = dl.isMember;
	var isOwner = dl.isOwner;
	var mailPolicySpecificMailers = [];
	this.dlInfo = {	isMember: isMember,
						isOwner: isOwner,
						subscriptionPolicy: attrs.zimbraDistributionListSubscriptionPolicy,
						unsubscriptionPolicy: attrs.zimbraDistributionListUnsubscriptionPolicy,
						description: attrs.description || "",
						displayName: attrs.displayName || "",
						notes: attrs.zimbraNotes || "",
						hideInGal: attrs.zimbraHideInGal == "TRUE",
						mailPolicy: isOwner && this._getMailPolicy(dl, mailPolicySpecificMailers),
						owners: isOwner && this._getOwners(dl)};
	this.dlInfo.mailPolicySpecificMailers = mailPolicySpecificMailers;

	this.loadDlMembers(callback);
};

ZmContact.prototype.loadDlMembers =
function(callback) {
	if ((!appCtxt.get("EXPAND_DL_ENABLED") || this.dlInfo.hideInGal) && !this.dlInfo.isOwner) {
		// can't get members if dl has zimbraHideInGal true, and not owner
		//also, if zimbraFeatureDistributionListExpandMembersEnabled is false - also do not show the members (again unless it's the owner)
		this.dlMembers = [];
		if (callback) {
			callback();
		}
		return;
	}
	if (this.dlMembers) {
		//already there - just callback
		if (callback) {
			callback();
		}
		return;
	}
	var respCallback = this._handleGetDlMembersResponse.bind(this, callback);
	this.getAllDLMembers(respCallback);
};


ZmContact.prototype._handleGetDlMembersResponse =
function(callback, result) {
	var list = result.list;
	if (!list) {
		this.dlMembers = [];
		callback();
		return;
	}
	var members = [];
	for (var i = 0; i < list.length; i++) {
		members.push({type: ZmContact.GROUP_INLINE_REF,
						value: list[i],
						address: list[i]});
	}

	this.dlMembers = members;
	callback();
};

ZmContact.prototype._getOwners =
function(dl) {
	var owners = dl.owners[0].owner;
	var ownersArray = [];
	for (var i = 0; i < owners.length; i++) {
		var owner = owners[i].name;
		ownersArray.push(owner); //just the email address, I think and hope.
	}
	return ownersArray;
};

ZmContact.prototype._getMailPolicy =
function(dl, specificMailers) {
	var mailPolicy;

	var rights = dl.rights[0].right;
	var right = rights[0];
	var grantees = right.grantee;
	if (!grantees) {
		return ZmGroupView.MAIL_POLICY_ANYONE;
	}
	for (var i = 0; i < grantees.length; i++) {
		var grantee = grantees[i];

		mailPolicy = ZmGroupView.GRANTEE_TYPE_TO_MAIL_POLICY_MAP[grantee.type];

		if (mailPolicy == ZmGroupView.MAIL_POLICY_SPECIFIC) {
			specificMailers.push(grantee.name);
		}
		else if (mailPolicy == ZmGroupView.MAIL_POLICY_ANYONE) {
			break;
		}
		else if (mailPolicy == ZmGroupView.MAIL_POLICY_INTERNAL) {
			break;
		}
		else if (mailPolicy == ZmGroupView.MAIL_POLICY_MEMBERS) {
			if (grantee.name == this.getEmail()) {
				//this means only members of this DL can send.
				break;
			}
			else {
				//must be another DL, and we do allow it, so treat it as regular user.
				specificMailers.push(grantee.name);
				mailPolicy = ZmGroupView.MAIL_POLICY_SPECIFIC;
			}
		}
	}
	mailPolicy = mailPolicy || ZmGroupView.MAIL_POLICY_ANYONE;

	return mailPolicy;
};


ZmContact.prototype.loadDlInfo =
function(callback) {
	var soapDoc = AjxSoapDoc.create("GetDistributionListRequest", "urn:zimbraAccount", null);
	soapDoc.setMethodAttribute("needOwners", "1");
	soapDoc.setMethodAttribute("needRights", "sendToDistList");
	var elBy = soapDoc.set("dl", this.getEmail());
	elBy.setAttribute("by", "name");

	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback});
};

ZmContact.prototype.toggleSubscription =
function(callback) {
	var soapDoc = AjxSoapDoc.create("SubscribeDistributionListRequest", "urn:zimbraAccount", null);
	soapDoc.setMethodAttribute("op", this.dlInfo.isMember ? "unsubscribe" : "subscribe");
	var elBy = soapDoc.set("dl", this.getEmail());
	elBy.setAttribute("by", "name");
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback});
};



/**
 *  Returns the contact id.  If includeUserZid is true it will return the format zid:id
 * @param includeUserZid {boolean} true to include the zid prefix for the contact id
 * @return {String} contact id string
 */
ZmContact.prototype.getId = 
function(includeUserZid) {

	if (includeUserZid) {
		return this.isShared() ? this.id : appCtxt.accountList.mainAccount.id + ":" + this.id; 
	}
	
	return this.id;
};
/**
 * Gets the icon.
 * @param 	{ZmAddrBook} addrBook	address book of contact 
 * @return	{String}	the icon
 */
ZmContact.prototype.getIcon =
function(addrBook) {
	if (this.isDistributionList()) 						{ return "DistributionList"; }
	if (this.isGal)										{ return "GALContact"; }
	if (this.isShared() || (addrBook && addrBook.link))	{ return "SharedContact"; }
	if (this.isGroup())									{ return "Group"; }
	return "Contact";
};

ZmContact.prototype.getIconLarge =
function() {
	if (this.isDistributionList()) {
		return "Group_48";
	}
	//todo - get a big version of ImgGalContact.png
//	if (this.isGal) {
//	}
	return "Person_48";
};

/**
 * Gets the folder id.
 * 
 * @return	{String}		the folder id	
 */
ZmContact.prototype.getFolderId =
function() {
	return this.isShared()
		? this.folderId.split(":")[0]
		: this.folderId;
};

/**
 * Gets the attribute.
 * 
 * @param	{String}	name		the attribute name
 * @return	{String}	the value
 */
ZmContact.prototype.getAttr =
function(name) {
	var val = this.attr[name];
	return val ? ((val instanceof Array) ? val[0] : val) : "";
};

/**
 * Sets the attribute.
 * 
 * @param	{String}	name		the attribute name
 * @param	{String}	value		the attribute value
 */
ZmContact.prototype.setAttr =
function(name, value) {
	this.attr[name] = value;
};

/**
 * Sets the participant status.
 *
 * @param	{String}	value the participant status value
 */
ZmContact.prototype.setParticipantStatus =
function(ptst) {
	this.participantStatus = ptst;
};

/**
 * gets the participant status.
 *
 * @return	{String}    the value
 */
ZmContact.prototype.getParticipantStatus =
function() {
	return this.participantStatus;
};

/**
 * Sets the participant role.
 *
 * @param	{String}	value the participant role value
 */
ZmContact.prototype.setParticipantRole =
function(role) {
	this.participantRole = role;
};

/**
 * gets the participant role.
 *
 * @return	{String}    the value
 */
ZmContact.prototype.getParticipantRole =
function() {
	return this.participantRole;
};

/**
 * Removes the attribute.
 * 
 * @param	{String}	name		the attribute name
 */
ZmContact.prototype.removeAttr =
function(name) {
	delete this.attr[name];
};

/**
 * Gets the contact attributes.
 *
 * @param {String}	[prefix] if specified, only the the attributes that match the given prefix will be returned
 * @return	{Hash}	a hash of attribute/value pairs
 */
ZmContact.prototype.getAttrs = function(prefix) {
	var attrs = this.attr;
	if (prefix) {
		attrs = {};
		for (var aname in this.attr) {
			var namePrefix = ZmContact.getPrefix(aname);
			if (namePrefix === prefix) {
				attrs[aname] = this.attr[aname];
			}
		}
	}
	return attrs;
};

/**
 * Gets a normalized set of attributes where the attribute
 * names have been re-numbered as needed. For example, if the
 * attributes contains a "foo2" but no "foo", then the "foo2"
 * attribute will be renamed to "foo" in the returned object.
 * <p>
 * <strong>Note:</strong>
 * This method is expensive so should be called once and
 * cached temporarily as needed instead of being called
 * for each normalized attribute that is needed.
 * 
 * @param {String}	[prefix]		if specified, only the
 *                        the attributes that match the given
 *                        prefix will be returned.
 * @return	{Hash}	a hash of attribute/value pairs
 */
ZmContact.prototype.getNormalizedAttrs = function(prefix) {
	return ZmContact.getNormalizedAttrs(this.attr, prefix, ZmContact.IGNORE_NORMALIZATION);
};

/**
* Creates a contact from the given set of attributes. Used to create contacts on
* the fly (rather than by loading them). This method is called by a list's <code>create()</code>
* method.
* <p>
* If this is a GAL contact, we assume it is being added to the contact list.</p>
*
* @param {Hash}	attr			the attribute/value pairs for this contact
* @param {ZmBatchCommand}	batchCmd	the batch command that contains this request
* @param {boolean} isAutoCreate true if this is a auto create and toast message should not be shown
*/
ZmContact.prototype.create =
function(attr, batchCmd, isAutoCreate) {

	if (this.isDistributionList()) {
		this._createDl(attr);
		return;
	}

	var jsonObj = {CreateContactRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.CreateContactRequest;
	var cn = request.cn = {};

	var folderId = attr[ZmContact.F_folderId] || ZmFolder.ID_CONTACTS;
	var folder = appCtxt.getById(folderId);
	if (folder && folder.isRemote()) {
		folderId = folder.getRemoteId();
	}
	cn.l = folderId;
	cn.a = [];
	cn.m = [];

	for (var name in attr) {
		if (name == ZmContact.F_folderId ||
			name == "objectClass" ||
			name == "zimbraId" ||
			name == "createTimeStamp" ||
			name == "modifyTimeStamp") { continue; }

		if (name == ZmContact.F_groups) {
			this._addContactGroupAttr(cn, attr);
		}
		else {
			this._addRequestAttr(cn, name, attr[name]);
		}
	}

	this._addRequestAttr(cn, ZmContact.X_fullName, ZmContact.computeFileAs(attr));

	var respCallback = new AjxCallback(this, this._handleResponseCreate, [attr, batchCmd != null, isAutoCreate]);

	if (batchCmd) {
		batchCmd.addRequestParams(jsonObj, respCallback);
	} else {
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	}
};

/**
 * @private
 */
ZmContact.prototype._handleResponseCreate =
function(attr, isBatchMode, isAutoCreate, result) {
	// dont bother processing creates when in batch mode (just let create
	// notifications handle them)
	if (isBatchMode) { return; }

	var resp = result.getResponse().CreateContactResponse;
	cn = resp ? resp.cn[0] : null;
	var id = cn ? cn.id : null;
	if (id) {
		this._fileAs = null;
		this._fullName = null;
		this.id = id;
		this.modified = cn.md;
		this.folderId = cn.l || ZmOrganizer.ID_ADDRBOOK;
		for (var a in attr) {
			if (!(attr[a] == undefined || attr[a] == ''))
				this.setAttr(a, attr[a]);
		}
		var groupMembers = cn ? cn.m : null;
		if (groupMembers) {
			this.attr[ZmContact.F_groups] = groupMembers;
			cn._attrs[ZmContact.F_groups] = groupMembers;
		}
		if (!isAutoCreate) {
			var msg = this.isGroup() ? ZmMsg.groupCreated : ZmMsg.contactCreated;
			appCtxt.getAppController().setStatusMsg(msg);
		}
		//update the canonical list. (this includes adding to the _idHash like before (bug 44132) calling updateIdHash. But calling that left the list inconcistant.
		appCtxt.getApp(ZmApp.CONTACTS).getContactList().add(cn);
	} else {
		var msg = this.isGroup() ? ZmMsg.errorCreateGroup : ZmMsg.errorCreateContact;
		var detail = ZmMsg.errorTryAgain + "\n" + ZmMsg.errorContact;
		appCtxt.getAppController().setStatusMsg(msg, ZmStatusView.LEVEL_CRITICAL, detail);
	}
};

/**
 * Creates a contct from a VCF part of a message.
 * 
 * @param	{String}	msgId		the message
 * @param	{String}	vcardPartId	the vcard part id
 */
ZmContact.prototype.createFromVCard =
function(msgId, vcardPartId) {
	var jsonObj = {CreateContactRequest:{_jsns:"urn:zimbraMail"}};
	var cn = jsonObj.CreateContactRequest.cn = {l:ZmFolder.ID_CONTACTS};
	cn.vcard = {mid:msgId, part:vcardPartId};

	var params = {
		jsonObj: jsonObj,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleResponseCreateVCard)),
		errorCallback: (new AjxCallback(this, this._handleErrorCreateVCard))
	};

	appCtxt.getAppController().sendRequest(params);
};

/**
 * @private
 */
ZmContact.prototype._handleResponseCreateVCard =
function(result) {
	appCtxt.getAppController().setStatusMsg(ZmMsg.contactCreated);
};

/**
 * @private
 */
ZmContact.prototype._handleErrorCreateVCard =
function(ex) {
	appCtxt.getAppController().setStatusMsg(ZmMsg.errorCreateContact, ZmStatusView.LEVEL_CRITICAL);
};

/**
 * Updates contact attributes.
 *
 * @param {Hash}	attr		a set of attributes and new values
 * @param {AjxCallback}	callback	the callback
 * @param {boolean} isAutoSave  true if it is a auto save and toast should not be displayed.
 */
ZmContact.prototype.modify =
function(attr, callback, isAutoSave, batchCmd) {
	if (this.isDistributionList()) {
		this._modifyDl(attr);
		return;
	}
	if (this.list.isGal) { return; }

	// change force to 0 and put up dialog if we get a MODIFY_CONFLICT fault?
	var jsonObj = {ModifyContactRequest:{_jsns:"urn:zimbraMail", replace:"0", force:"1"}};
	var cn = jsonObj.ModifyContactRequest.cn = {id:this.id};
	cn.a = [];
	cn.m = [];
	var continueRequest = false;
	
	for (var name in attr) {
		if (name == ZmContact.F_folderId) { continue; }
		if (name == ZmContact.F_groups) {
			this._addContactGroupAttr(cn, attr);	
		}
		else {
			this._addRequestAttr(cn, name, (attr[name] && attr[name].value) || attr[name]);
		}
		continueRequest = true;
	}

    // bug: 45026
    if (ZmContact.F_firstName in attr || ZmContact.F_lastName in attr || ZmContact.F_company in attr || ZmContact.X_fileAs in attr) {
        var contact = {};
        var fields = [ZmContact.F_firstName, ZmContact.F_lastName, ZmContact.F_company, ZmContact.X_fileAs];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var value = attr[field];
            contact[field] = value != null ? value : this.getAttr(field);
        }
        var fullName = ZmContact.computeFileAs(contact); 
        this._addRequestAttr(cn, ZmContact.X_fullName, fullName);
    }

	if (continueRequest) {
		if (batchCmd) {
			batchCmd.addRequestParams(jsonObj, null, null); //no need for response callback for current use-case (batch modifying zimlet image)
		}
		else {
			var respCallback = this._handleResponseModify.bind(this, attr, callback, isAutoSave);
			appCtxt.getAppController().sendRequest({jsonObj: jsonObj, asyncMode: true, callback: respCallback});
		}

	} else {
		if (attr[ZmContact.F_folderId]) {
			this._setFolder(attr[ZmContact.F_folderId]);
		}
	}
};

ZmContact.prototype._createDl =
function(attr) {

	this.attr = attr; //this is mainly important for the email. attr is not set before this.

	var createDlReq = this._getCreateDlReq(attr);

	var reqs = [];

	this._addMemberModsReqs(reqs, attr);

	this._addMailPolicyAndOwnersReqs(reqs, attr);

	var jsonObj = {
		BatchRequest: {
			_jsns: "urn:zimbra",
			CreateDistributionListRequest: createDlReq,
			DistributionListActionRequest: reqs
		}
	};
	var respCallback = this._createDlResponseHandler.bind(this);
	appCtxt.getAppController().sendRequest({jsonObj: jsonObj, asyncMode: true, callback: respCallback});
	
};

ZmContact.prototype._addMailPolicyAndOwnersReqs =
function(reqs, attr) {

	var mailPolicy = attr[ZmContact.F_dlMailPolicy];
	if (mailPolicy) {
		reqs.push(this._getSetMailPolicyReq(mailPolicy, attr[ZmContact.F_dlMailPolicySpecificMailers]));
	}

	var listOwners = attr[ZmContact.F_dlListOwners];
	if (listOwners) {
		reqs.push(this._getSetOwnersReq(listOwners));
	}


};



ZmContact.prototype._addMemberModsReqs =
function(reqs, attr) {
	var memberModifications = attr[ZmContact.F_groups];
	var adds = [];
	var removes = [];
	if (memberModifications) {
		for (var i = 0; i < memberModifications.length; i++) {
			var mod = memberModifications[i];
			var col = (mod.op == "+" ? adds : removes);
			col.push(mod);
		}
	}

	if (adds.length > 0) {
		reqs.push(this._getAddOrRemoveReq(adds, true));
	}
	if (removes.length > 0) {
		reqs.push(this._getAddOrRemoveReq(removes, false));
	}
};

ZmContact.prototype._modifyDl =
function(attr) {
	var reqs = [];

	var newEmail = attr[ZmContact.F_email];

	var emailChanged = false;
	if (newEmail !== undefined) {
		emailChanged = true;
		reqs.push(this._getRenameDlReq(newEmail));
		this.setAttr(ZmContact.F_email, newEmail);
	}

	var modDlReq = this._getModifyDlAttributesReq(attr);
	if (modDlReq) {
		reqs.push(modDlReq);
	}

	var displayName = attr[ZmContact.F_dlDisplayName];
	if (displayName !== undefined) {
		this.setAttr(ZmContact.F_dlDisplayName, displayName);
	}

	var oldFileAs = this.getFileAs();
	this._resetCachedFields();
	var fileAsChanged = oldFileAs != this.getFileAs();

	this._addMemberModsReqs(reqs, attr);

	this._addMailPolicyAndOwnersReqs(reqs, attr);

	if (reqs.length == 0) {
		this._modifyDlResponseHandler(false, null); //pretend it was saved
		return;
	}
	var jsonObj = {
		BatchRequest: {
			_jsns: "urn:zimbra",
			DistributionListActionRequest: reqs
		}
	};
	var respCallback = this._modifyDlResponseHandler.bind(this, fileAsChanged || emailChanged); //there's some issue with fileAsChanged so adding the emailChanged to be on safe side
	appCtxt.getAppController().sendRequest({jsonObj: jsonObj, asyncMode: true, callback: respCallback});

};

ZmContact.prototype._getAddOrRemoveReq =
function(members, add) {
	var req = {
		_jsns: "urn:zimbraAccount",
		dl: {by: "name",
			 _content: this.getEmail()
		},
		action: {
			op: add ? "addMembers" : "removeMembers",
			dlm: []
		}
	};
	for (var i = 0; i < members.length; i++) {
		var member = members[i];
		req.action.dlm.push({_content: member.email});
	}
	return req;

};


ZmContact.prototype._getRenameDlReq =
function(name) {
	return {
		_jsns: "urn:zimbraAccount",
		dl: {by: "name",
			 _content: this.getEmail()
		},
		action: {
			op: "rename",
			newName: {_content: name}
		}
	};
};

ZmContact.prototype._getSetOwnersReq =
function(owners) {
	var ownersPart = [];
	for (var i = 0; i < owners.length; i++) {
		ownersPart.push({
			type: ZmGroupView.GRANTEE_TYPE_USER,
			by: "name",
			_content: owners[i]
		});
	}
	return {
		_jsns: "urn:zimbraAccount",
		dl: {by: "name",
			 _content: this.getEmail()
		},
		action: {
			op: "setOwners",
			owner: ownersPart
		}
	};
};

ZmContact.prototype._getSetMailPolicyReq =
function(mailPolicy, specificMailers) {
	var grantees = [];
	if (mailPolicy == ZmGroupView.MAIL_POLICY_SPECIFIC) {
		for (var i = 0; i < specificMailers.length; i++) {
			grantees.push({
				type: ZmGroupView.GRANTEE_TYPE_EMAIL,
				by: "name",
				_content: specificMailers[i]
			});
		}
	}
	else if (mailPolicy == ZmGroupView.MAIL_POLICY_ANYONE) {
		grantees.push({
			type: ZmGroupView.GRANTEE_TYPE_PUBLIC
		});
	}
	else if (mailPolicy == ZmGroupView.MAIL_POLICY_INTERNAL) {
		grantees.push({
			type: ZmGroupView.GRANTEE_TYPE_ALL
		});
	}
	else if (mailPolicy == ZmGroupView.MAIL_POLICY_MEMBERS) {
		grantees.push({
			type: ZmGroupView.GRANTEE_TYPE_GROUP,
			by: "name",
			_content: this.getEmail()
		});
	}
	else {
		throw "invalid mailPolicy value " + mailPolicy;
	}

	return {
		_jsns: "urn:zimbraAccount",
		dl: {by: "name",
			 _content: this.getEmail()
		},
		action: {
			op: "setRights",
			right: {
				right: "sendToDistList",
				grantee: grantees
			}
		}
	};

};

ZmContact.prototype._addDlAttribute =
function(attrs, mods, name, soapAttrName) {
	var attr = mods[name];
	if (attr === undefined) {
		return;
	}
	attrs.push({n: soapAttrName, _content: attr});
};

ZmContact.prototype._getDlAttributes =
function(mods) {
	var attrs = [];
	this._addDlAttribute(attrs, mods, ZmContact.F_dlDisplayName, "displayName");
	this._addDlAttribute(attrs, mods, ZmContact.F_dlDesc, "description");
	this._addDlAttribute(attrs, mods, ZmContact.F_dlNotes, "zimbraNotes");
	this._addDlAttribute(attrs, mods, ZmContact.F_dlHideInGal, "zimbraHideInGal");
	this._addDlAttribute(attrs, mods, ZmContact.F_dlSubscriptionPolicy, "zimbraDistributionListSubscriptionPolicy");
	this._addDlAttribute(attrs, mods, ZmContact.F_dlUnsubscriptionPolicy, "zimbraDistributionListUnsubscriptionPolicy");

	return attrs;
};


ZmContact.prototype._getCreateDlReq =
function(attr) {
	return {
		_jsns: "urn:zimbraAccount",
		name: attr[ZmContact.F_email],
		a: this._getDlAttributes(attr),
		dynamic: false
	};
};

ZmContact.prototype._getModifyDlAttributesReq =
function(attr) {
	var modAttrs = this._getDlAttributes(attr);
	if (modAttrs.length == 0) {
		return null;
	}
	return {
		_jsns: "urn:zimbraAccount",
		dl: {by: "name",
			 _content: this.getEmail()
		},
		action: {
			op: "modify",
			a: modAttrs
		}
	};
};

ZmContact.prototype._modifyDlResponseHandler =
function(fileAsChanged, result) {
	if (this._handleErrorDl(result)) {
		return;
	}
	appCtxt.setStatusMsg(ZmMsg.dlSaved);

	//for DLs we reload from the server since the server does not send notifications.
	this.clearDlInfo();

	var details = {
		fileAsChanged: fileAsChanged
	};

	this._popView(fileAsChanged);

	this._notify(ZmEvent.E_MODIFY, details);
};

ZmContact.prototype._createDlResponseHandler =
function(result) {
	if (this._handleErrorDl(result, true)) {
		this.attr = {}; //since above in _createDl, we set it to new values prematurely. which would affect next gathering of modified attributes.
		return;
	}
	appCtxt.setStatusMsg(ZmMsg.distributionListCreated);

	this._popView(true);
};

ZmContact.prototype._popView =
function(updateDlList) {
	var controller = AjxDispatcher.run("GetContactController");
	controller.popView(true);
	if (!updateDlList) {
		return;
	}
	var clc = AjxDispatcher.run("GetContactListController");
	if (clc.getFolderId() != ZmFolder.ID_DLS) {
		return;
	}
	ZmAddrBookTreeController.dlFolderClicked(); //This is important in case of new DL created OR a renamed DL, so it would reflect in the list.
};

ZmContact.prototype._handleErrorDl =
function(result, creation) {
	if (!result) {
		return false;
	}
	var batchResp = result.getResponse().BatchResponse;
	var faults = batchResp.Fault;
	if (!faults) {
		return false;
	}
	var ex = ZmCsfeCommand.faultToEx(faults[0]);
	var controller = AjxDispatcher.run("GetContactController");
	controller.popupErrorDialog(creation ? ZmMsg.dlCreateFailed : ZmMsg.dlModifyFailed, ex);
	return true;

};

ZmContact.prototype.clearDlInfo =
function () {
	this.dlMembers = null;
	this.dlInfo = null;
	var app = appCtxt.getApp(ZmApp.CONTACTS);
	app.cacheDL(this.getEmail(), null); //clear the cache for this DL.
	appCtxt.cacheRemove(this.getId()); //also some other cache.
};

/**
 * @private
 */
ZmContact.prototype._handleResponseModify =
function(attr, callback, isAutoSave, result) {
	var resp = result.getResponse().ModifyContactResponse;
	var cn = resp ? resp.cn[0] : null;
	var id = cn ? cn.id : null;
	var groupMembers = cn ? cn.m : null;
	if (groupMembers) {
		this.attr[ZmContact.F_groups] = groupMembers;
		cn._attrs[ZmContact.F_groups] = groupMembers;	
	}

	if (id && id == this.id) {
		if (!isAutoSave) {
			appCtxt.setStatusMsg(this.isGroup() ? ZmMsg.groupSaved : ZmMsg.contactSaved);
		}
		// was this contact moved to another folder?
		if (attr[ZmContact.F_folderId] && this.folderId != attr[ZmContact.F_folderId]) {
			this._setFolder(attr[ZmContact.F_folderId]);
		}
		appCtxt.getApp(ZmApp.CONTACTS).updateIdHash(cn, false);
	} else {
        var detail = ZmMsg.errorTryAgain + "\n" + ZmMsg.errorContact;
        appCtxt.getAppController().setStatusMsg(ZmMsg.errorModifyContact, ZmStatusView.LEVEL_CRITICAL, detail);
	}
	// NOTE: we no longer process callbacks here since notification handling
	//       takes care of everything
};

/**
 * @private
 */
ZmContact.prototype._handleResponseMove =
function(newFolderId, resp) {
	var newFolder = newFolderId && appCtxt.getById(newFolderId);
	var count = 1;
	if (newFolder) {
		appCtxt.setStatusMsg(ZmList.getActionSummary({
			actionTextKey:  'actionMove',
			numItems:       count,
			type:           ZmItem.CONTACT,
			actionArg:      newFolder.name
		}));
	}

	this._notify(ZmEvent.E_MODIFY, resp);
};

/**
 * @private
 */
ZmContact.prototype._setFolder =
function(newFolderId) {
	var folder = appCtxt.getById(this.folderId);
	var fId = folder ? folder.nId : null;
	if (fId == newFolderId) { return; }

	// moving out of a share or into one is handled differently (create then hard delete)
	var newFolder = appCtxt.getById(newFolderId);
	if (this.isShared() || (newFolder && newFolder.link)) {
		if (this.list) {
			this.list.moveItems({items:[this], folder:newFolder});
		}
	} else {
		var jsonObj = {ContactActionRequest:{_jsns:"urn:zimbraMail"}};
		jsonObj.ContactActionRequest.action = {id:this.id, op:"move", l:newFolderId};
		var respCallback = new AjxCallback(this, this._handleResponseMove, [newFolderId]);
		var accountName = appCtxt.multiAccounts && appCtxt.accountList.mainAccount.name;
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback, accountName:accountName});
	}
};

/**
 * @private
 */
ZmContact.prototype.notifyModify =
function(obj, batchMode) {

	var result = ZmItem.prototype.notifyModify.apply(this, arguments);

	var context = window.parentAppCtxt || window.appCtxt;
	context.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);

	if (result) {
		return result;
	}

	// cache old fileAs/fullName before resetting them
	var oldFileAs = this.getFileAs();
	var oldFullName = this.getFullName();
	this._resetCachedFields();

	var oldAttrCache = {};
	if (obj._attrs) {
		// remove attrs that were not returned back from the server
		var oldAttrs = this.getAttrs();
		for (var a in oldAttrs) {
			oldAttrCache[a] = oldAttrs[a];
			if (obj._attrs[a] == null)
				this.removeAttr(a);
		}

		// set attrs returned by server
		for (var a in obj._attrs) {
			this.setAttr(a, obj._attrs[a]);
		}
		if (obj.m) {
			this.setAttr(ZmContact.F_groups, obj.m);
		}
	}

	var details = {
		attr: obj._attrs,
		oldAttr: oldAttrCache,
		fullNameChanged: (this.getFullName() != oldFullName),
		fileAsChanged: (this.getFileAs() != oldFileAs),
		contact: this
	};

	// update this contact's list per old/new attrs
	for (var listId in this._list) {
		var list = listId && appCtxt.getById(listId);
		if (!list) { continue; }
		list.modifyLocal(obj, details);
	}

	this._notify(ZmEvent.E_MODIFY, obj);
};

/**
 * @private
 */
ZmContact.prototype.notifyDelete =
function() {
	ZmItem.prototype.notifyDelete.call(this);
	var context = window.parentAppCtxt || window.appCtxt;
	context.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
};

/**
 * Initializes this contact using an email address.
 *
 * @param {AjxEmailAddress|String}	email		an email address or an email string
 * @param {Boolean}	strictName	if <code>true</code>, do not try to set name from user portion of address
 */
ZmContact.prototype.initFromEmail =
function(email, strictName) {
	if (email instanceof AjxEmailAddress) {
		this.setAttr(ZmContact.F_email, email.getAddress());
		this._initFullName(email, strictName);
	} else {
		this.setAttr(ZmContact.F_email, email);
	}
};

/**
 * Initializes this contact using a phone number.
 *
 * @param {String}	phone		the phone string
 * @param {String}	field		the field or company phone if <code>null</code>
 */
ZmContact.prototype.initFromPhone =
function(phone, field) {
	this.setAttr(field || ZmContact.F_companyPhone, phone);
};

/**
 * Gets the email address.
 * 
 * @param {boolean}		asObj	if true, return an AjxEmailAddress
 * 
 * @return	the email address
 */
ZmContact.prototype.getEmail =
function(asObj) {

	var email = (this.getAttr(ZmContact.F_email) ||
				 this.getAttr(ZmContact.F_workEmail1) ||
				 this.getAttr(ZmContact.F_email2) ||
				 this.getAttr(ZmContact.F_workEmail2) ||
				 this.getAttr(ZmContact.F_email3) ||
				 this.getAttr(ZmContact.F_workEmail3));
	
	if (asObj) {
		email = AjxEmailAddress.parse(email);
        if(email){
		    email.isGroup = this.isGroup();
		    email.canExpand = this.canExpand;
        }
	}
	
	return email;
};

/**
 * Returns user's phone number
 * @return {String} phone number
 */
ZmContact.prototype.getPhone = 
function() {
	var phone = (this.getAttr(ZmContact.F_mobilePhone) ||
				this.getAttr(ZmContact.F_workPhone) || 
				this.getAttr(ZmContact.F_homePhone) ||
				this.getAttr(ZmContact.F_otherPhone));
	return phone;
};

    
/**
 * Gets the lookup email address, when an contact object is located using email address we store
 * the referred email address in this variable for easy lookup
 *
 * @param {boolean}		asObj	if true, return an AjxEmailAddress
 *
 * @return	the lookup address
 */
ZmContact.prototype.getLookupEmail =
function(asObj) {
    var email = this._lookupEmail;

    if (asObj && email) {
        email = AjxEmailAddress.parse(email);
        email.isGroup = this.isGroup();
        email.canExpand = this.canExpand;
    }

	return  email;
};

/**
 * Gets the emails.
 * 
 * @return	{Array}	 an array of all valid emails for this contact
 */
ZmContact.prototype.getEmails =
function() {
	var emails = [];
	var attrs = this.getAttrs();
	for (var index = 0; index < ZmContact.EMAIL_FIELDS.length; index++) {
		var field = ZmContact.EMAIL_FIELDS[index];
		for (var i = 1; true; i++) {
			var aname = ZmContact.getAttributeName(field, i);
			if (!attrs[aname]) break;
			emails.push(attrs[aname]);
		}
	}
	return emails;
};

/**
 * Gets the full name.
 * 
 * @return	{String}	the full name
 */
ZmContact.prototype.getFullName =
function(html) {
    var fullNameHtml = null;
	if (!this._fullName || html) {
		var fullName = this.getAttr(ZmContact.X_fullName); // present if GAL contact
		if (fullName) {
			this._fullName = (fullName instanceof Array) ? fullName[0] : fullName;
		}
        else {
            this._fullName = this.getFullNameForDisplay(false);
        }

        if (html) {
            fullNameHtml = this.getFullNameForDisplay(html);
        }
	}

	// as a last resort, set it to fileAs
	if (!this._fullName) {
		this._fullName = this.getFileAs();
	}

	return fullNameHtml || this._fullName;
};

/*
* Gets the fullname for display -- includes (if applicable): prefix, first, middle, maiden, last, suffix
*
* @param {boolean}  if phonetic fields should be used
* @return {String}  the fullname for display
*/
ZmContact.prototype.getFullNameForDisplay =
function(html){
	if (this.isDistributionList()) {
		//I'm not sure where that fullName is set sometime to the display name. This is so complicated
		// I'm trying to set attr[ZmContact.F_dlDisplayName] to the display name but in soem cases it's not.
		return this.getAttr(ZmContact.F_dlDisplayName) || this.getAttr("fullName");
	}
    var prefix = this.getAttr(ZmContact.F_namePrefix);
    var first = this.getAttr(ZmContact.F_firstName);
    var middle = this.getAttr(ZmContact.F_middleName);
    var maiden = this.getAttr(ZmContact.F_maidenName);
    var last = this.getAttr(ZmContact.F_lastName);
    var suffix = this.getAttr(ZmContact.F_nameSuffix);
    var pattern = ZmMsg.fullname;
    if (suffix) {
        pattern = maiden ? ZmMsg.fullnameMaidenSuffix : ZmMsg.fullnameSuffix;
    }
    else if (maiden) {
        pattern = ZmMsg.fullnameMaiden;
    }
    if (appCtxt.get(ZmSetting.LOCALE_NAME) === "ja") {
        var fileAsId = this.getAttr(ZmContact.F_fileAs);
        if (!AjxUtil.isEmpty(fileAsId) && fileAsId !== "1" && fileAsId !== "4" && fileAsId !== "6" && fileAsId.slice(0, 1) !== "8") {
            /* When Japanese locale is selected, in the most every case, the name should be
             * displayed as "Last First" which is set by the default pattern (ZmMsg_ja.fullname).
             * But if the contact entry's fileAs field explicitly specifies the display
             * format as "First Last", we should override the pattern to lay it out so.
             * For other locales, it is not necessary to override the pattern: The default pattern is
             * already set as "First Last", and even the FileAs specifies as "Last, First", the display
             * name is always expected to be displayed as "First Last".
             */
            pattern = "{0} {1} {2} {4}";
        }
    }
    var formatter = new AjxMessageFormat(pattern);
    var args = [prefix,first,middle,maiden,last,suffix];
    if (!html){
        return AjxStringUtil.trim(formatter.format(args), true);
    }

    return this._getFullNameHtml(formatter, args);
};

/**
 * @param formatter
 * @param parts {Array} Name parts: [prefix,first,middle,maiden,last,suffix]
 */
ZmContact.prototype._getFullNameHtml = function(formatter, parts) {
    var a = [];
    var segments = formatter.getSegments();
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        if (segment instanceof AjxFormat.TextSegment) {
            a.push(segment.format());
            continue;
        }
        // NOTE: Assume that it's a AjxMessageFormat.MessageSegment
        // NOTE: if not a AjxFormat.TextSegment.
        var index = segment.getIndex();
        var base = parts[index];
        var text = ZmContact.__RUBY_FIELDS[index] && this.getAttr(ZmContact.__RUBY_FIELDS[index]);
        a.push(AjxStringUtil.htmlRubyEncode(base, text));
    }
    return a.join("");
};
ZmContact.__RUBY_FIELDS = [
    null, ZmContact.F_phoneticFirstName, null, null,
    ZmContact.F_phoneticLastName, null
];

/**
 * Gets the tool tip for this contact.
 * 
 * @param	{String}	email		the email address
 * @param	{Boolean}	isGal		(not used)
 * @param	{String}	hint		the hint text
 * @return	{String}	the tool tip in HTML
 */
ZmContact.prototype.getToolTip =
function(email, isGal, hint) {
	// XXX: we dont cache tooltip info anymore since its too dynamic :/
	// i.e. IM status can change anytime so always rebuild tooltip and bug 13834
	var subs = {
		contact: this,
		entryTitle: this.getFileAs(),
		hint: hint
	};

	return (AjxTemplate.expand("abook.Contacts#Tooltip", subs));
};

/**
 * Gets the filing string for this contact, computing it if necessary.
 * 
 * @param	{Boolean}	lower		<code>true</code> to use lower case
 * @return	{String}	the file as string
 */
ZmContact.prototype.getFileAs =
function(lower) {
	// update/null if modified
	if (!this._fileAs) {
		this._fileAs = ZmContact.computeFileAs(this);
		this._fileAsLC = this._fileAs ? this._fileAs.toLowerCase() : null;
	}
	// if for some reason fileAsLC is not set even though fileAs is, reset it
	if (lower && !this._fileAsLC) {
		this._fileAsLC = this._fileAs.toLowerCase();
	}
	return lower ? this._fileAsLC : this._fileAs;
};

/**
 * Gets the filing string for this contact, from the email address (used in case no name exists).
 * todo - maybe return this from getFileAs, but there are a lot of callers to getFileAs, and not sure
 * of the implications on all the use-cases.
 *
 * @return	{String}	the file as string
 */
ZmContact.prototype.getFileAsNoName = function() {
	return [ZmMsg.noName, this.getEmail()].join(" ");
};

/**
 * Gets the header.
 * 
 * @return	{String}	the header
 */
ZmContact.prototype.getHeader =
function() {
	return this.id ? this.getFileAs() : ZmMsg.newContact;
};

ZmContact.NO_MAX_IMAGE_WIDTH = ZmContact.NO_MAX_IMAGE_HEIGHT = - 1;

/**
 * Get the image URL.
 *
 * Please note that maxWidth and maxHeight are hints, as they have no
 * effect on Zimlet-supplied images.
 *
 * maxWidth {int} max pixel width (optional - default 48, or pass ZmContact.NO_MAX_IMAGE_WIDTH if full size image is required)
 * maxHeight {int} max pixel height (optional - default to maxWidth, or pass ZmContact.NO_MAX_IMAGE_HEIGHT if full size image is required)
 * @return	{String}	the image URL
 */
ZmContact.prototype.getImageUrl =
function(maxWidth, maxHeight) {
	if (this.getAttr(ZmContact.F_thumbnailPhoto)) {
		return "data:;base64," + this.getAttr(ZmContact.F_thumbnailPhoto);
	}

  	var image = this.getAttr(ZmContact.F_image);
	var imagePart  = image && image.part || this.getAttr(ZmContact.F_imagepart); //see bug 73146

	if (!imagePart) {
		return this.getAttr(ZmContact.F_zimletImage);  //return zimlet populated image only if user-uploaded image is not there.
	}
  	var msgFetchUrl = appCtxt.get(ZmSetting.CSFE_MSG_FETCHER_URI);
	var maxWidthStyle = "";
	if (maxWidth !== ZmContact.NO_MAX_IMAGE_WIDTH) {
		maxWidth = maxWidth || 48;
		maxWidthStyle = ["&max_width=", maxWidth].join("");
	}
	var maxHeightStyle = "";
	if (maxHeight !== ZmContact.NO_MAX_IMAGE_HEIGHT) {
		maxHeight = maxHeight ||
			(maxWidth !== ZmContact.NO_MAX_IMAGE_WIDTH ? maxWidth : 48);
		maxHeightStyle = ["&max_height=", maxHeight].join("");
	}
  	return  [msgFetchUrl, "&id=", this.id, "&part=", imagePart, maxWidthStyle, maxHeightStyle, "&t=", (new Date()).getTime()].join("");
};

ZmContact.prototype.addModifyZimletImageToBatch =
function(batchCmd, image) {
	var attr = {};
	if (this.getAttr(ZmContact.F_zimletImage) === image) {
		return; //no need to update if same
	}
	attr[ZmContact.F_zimletImage] = image;
	batchCmd.add(this.modify.bind(this, attr, null, true));
};

/**
 * Gets the company field. Company field has a getter b/c fileAs may be the Company name so
 * company field should return "last, first" name instead *or* prepend the title
 * if fileAs is not Company (assuming it exists).
 * 
 * @return	{String}	the company
 */
ZmContact.prototype.getCompanyField =
function() {

	var attrs = this.getAttrs();
	if (attrs == null) return null;

	var fa = parseInt(attrs.fileAs);
	var val = [];
	var idx = 0;

	if (fa == ZmContact.FA_LAST_C_FIRST || fa == ZmContact.FA_FIRST_LAST) {
		// return the title, company name
		if (attrs.jobTitle) {
			val[idx++] = attrs.jobTitle;
			if (attrs.company)
				val[idx++] = ", ";
		}
		if (attrs.company)
			val[idx++] = attrs.company;

	} else if (fa == ZmContact.FA_COMPANY) {
		// return the first/last name
		if (attrs.lastName) {
			val[idx++] = attrs.lastName;
			if (attrs.firstName)
				val[idx++] = ", ";
		}

		if (attrs.firstName)
			val[idx++] = attrs.firstName;

		if (attrs.jobTitle)
			val[idx++] = " (" + attrs.jobTitle + ")";

	} else {
		// just return the title
		if (attrs.jobTitle) {
			val[idx++] = attrs.jobTitle;
			// and/or company name if applicable
			if (attrs.company && (attrs.fileAs == null || fa == ZmContact.FA_LAST_C_FIRST || fa == ZmContact.FA_FIRST_LAST))
				val[idx++] = ", ";
		}
		if (attrs.company && (attrs.fileAs == null || fa == ZmContact.FA_LAST_C_FIRST || fa == ZmContact.FA_FIRST_LAST))
			 val[idx++] = attrs.company;
	}
	if (val.length == 0) return null;
	return val.join("");
};

/**
 * Gets the work address.
 * 
 * @param	{Object}	instance		(not used)
 * @return	{String}	the work address
 */
ZmContact.prototype.getWorkAddrField =
function(instance) {
	var attrs = this.getAttrs();
	return this._getAddressField(attrs.workStreet, attrs.workCity, attrs.workState, attrs.workPostalCode, attrs.workCountry);
};

/**
 * Gets the home address.
 * 
 * @param	{Object}	instance		(not used)
 * @return	{String}	the home address
 */
ZmContact.prototype.getHomeAddrField =
function(instance) {
	var attrs = this.getAttrs();
	return this._getAddressField(attrs.homeStreet, attrs.homeCity, attrs.homeState, attrs.homePostalCode, attrs.homeCountry);
};

/**
 * Gets the other address.
 * 
 * @param	{Object}	instance		(not used)
 * @return	{String}	the other address
 */
ZmContact.prototype.getOtherAddrField =
function(instance) {
	var attrs = this.getAttrs();
	return this._getAddressField(attrs.otherStreet, attrs.otherCity, attrs.otherState, attrs.otherPostalCode, attrs.otherCountry);
};

/**
 * Gets the address book.
 * 
 * @return	{ZmAddrBook}	the address book
 */
ZmContact.prototype.getAddressBook =
function() {
	if (!this.addrbook) {
		this.addrbook = appCtxt.getById(this.folderId);
	}
	return this.addrbook;
};

/**
 * @private
 */
ZmContact.prototype._getAddressField =
function(street, city, state, zipcode, country) {
	if (street == null && city == null && state == null && zipcode == null && country == null) return null;

	var html = [];
	var idx = 0;

	if (street) {
		html[idx++] = street;
		if (city || state || zipcode)
			html[idx++] = "\n";
	}

	if (city) {
		html[idx++] = city;
		if (state)
			html[idx++] = ", ";
		else if (zipcode)
			html[idx++] = " ";
	}

	if (state) {
		html[idx++] = state;
		if (zipcode)
			html[idx++] = " ";
	}

	if (zipcode)
		html[idx++] = zipcode;

	if (country)
		html[idx++] = "\n" + country;

	return html.join("");
};

/**
 * Sets the full name based on an email address.
 * 
 * @private
 */
ZmContact.prototype._initFullName =
function(email, strictName) {
	var name = email.getName();
	name = AjxStringUtil.trim(name.replace(AjxEmailAddress.commentPat, '')); // strip comment (text in parens)

	if (name && name.length) {
		this._setFullName(name, [" "]);
	} else if (!strictName) {
		name = email.getAddress();
		if (name && name.length) {
			var i = name.indexOf("@");
			if (i == -1) return;
			name = name.substr(0, i);
			this._setFullName(name, [".", "_"]);
		}
	}
};

/**
 * Tries to extract a set of name components from the given text, with the
 * given list of possible delimiters. The first delimiter contained in the
 * text will be used. If none are found, the first delimiter in the list is used.
 * 
 * @private
 */
ZmContact.prototype._setFullName =
function(text, delims) {
	var delim = delims[0];
	for (var i = 0; i < delims.length; i++) {
		if (text.indexOf(delims[i]) != -1) {
			delim = delims[i];
			break;
		}
	}
    var parts = text.split(delim);
    var func = this["__setFullName_"+AjxEnv.DEFAULT_LOCALE] || this.__setFullName;
    func.call(this, parts, text, delims);
};

ZmContact.prototype.__setFullName = function(parts, text, delims) {
    this.setAttr(ZmContact.F_firstName, parts[0]);
    if (parts.length == 2) {
        this.setAttr(ZmContact.F_lastName, parts[1]);
    } else if (parts.length == 3) {
        this.setAttr(ZmContact.F_middleName, parts[1]);
        this.setAttr(ZmContact.F_lastName, parts[2]);
    }
};
ZmContact.prototype.__setFullName_ja = function(parts, text, delims) {
    if (parts.length > 2) {
        this.__setFullName(parts, text, delims);
        return;
    }
    // TODO: Perhaps do some analysis to auto-detect Japanese vs.
    // TODO: non-Japanese names. For example, if the name text is
    // TODO: comprised of kanji, treat it as "last first"; else if
    // TODO: first part is all uppercase, treat it as "last first";
    // TODO: else treat it as "first last".
    this.setAttr(ZmContact.F_lastName, parts[0]);
    if (parts.length > 1) {
        this.setAttr(ZmContact.F_firstName, parts[1]);
    }
};
ZmContact.prototype.__setFullName_ja_JP = ZmContact.prototype.__setFullName_ja;

/**
 * @private
 */
ZmContact.prototype._addRequestAttr =
function(cn, name, value) {
	var a = {n:name};
	if (name == ZmContact.F_image && AjxUtil.isString(value) && value.length) {
		// handle contact photo
		if (value.indexOf("aid_") != -1) {
			a.aid = value.substring(4);
		} else {
			a.part = value.substring(5);
		}
	} else {
		a._content = value || "";
	}

    if (value instanceof Array) {
        if (!cn._attrs)
            cn._attrs = {};
        cn._attrs[name] = value || "";
    }
    else  {
        if (!cn.a)
            cn.a = [];
        cn.a.push(a);
    }
};
	
ZmContact.prototype._addContactGroupAttr = 
function(cn, group) {
	var groupMembers = group[ZmContact.F_groups];
	for (var i = 0; i < groupMembers.length; i++) {
		var member = groupMembers[i];
		if (!cn.m) {
			cn.m = [];
		}

		var m = {type: member.type,	value: member.value}; //for the JSON object this is all we need.
		if (member.op) {
			m.op = member.op; //this is only for modify, not for create.
		}
		cn.m.push(m);
	}
};

/**
 * Reset computed fields.
 * 
 * @private
 */
ZmContact.prototype._resetCachedFields =
function() {
	this._fileAs = this._fileAsLC = this._fullName = null;
};

/**
 * Parse contact node.
 * 
 * @private
 */
ZmContact.prototype._loadFromDom =
function(node) {
	this.isLoaded = true;
	this.rev = node.rev;
	this.sf = node.sf || node._attrs.sf;
	if (!this.isGal) {
		this.folderId = node.l;
	}
	this.created = node.cd;
	this.modified = node.md;

	this.attr = node._attrs || {};
	if (node.m) {
		this.attr[ZmContact.F_groups] = node.m;
	}

	this.ref = node.ref || this.attr.dn; //bug 78425
	
	// for shared contacts, we get these fields outside of the attr part
	if (node.email)		{ this.attr[ZmContact.F_email] = node.email; }
	if (node.email2)	{ this.attr[ZmContact.F_email2] = node.email2; }
	if (node.email3)	{ this.attr[ZmContact.F_email3] = node.email3; }

	// in case attrs are coming in from an external GAL, make an effort to map them, including multivalued ones
	this.attr = ZmContact.mapAttrs(this.attr);

    //the attr groups is returned as [] so check both null and empty array to set the type
    var groups = this.attr[ZmContact.F_groups];
    if(!groups || (groups instanceof Array && groups.length == 0)) {
        this.type = ZmItem.CONTACT;
    }
    else {
        this.type = ZmItem.GROUP;
    }

	// check if the folderId is found in our address book (otherwise, we assume
	// this contact to be a shared contact)
	var ac = window.parentAppCtxt || window.appCtxt;
	this.addrbook = ac.getById(this.folderId);

	this._parseTagNames(node.tn);

	// dont process flags for shared contacts until we get server support
	if (!this.isShared()) {
		this._parseFlags(node.f);
	} else {
		// shared contacts are never fully loaded since we never cache them
		this.isLoaded = false;
	}

	// bug: 22174
	// We ignore the server's computed file-as property and instead
	// format it based on the user's locale.
	this._fileAs = ZmContact.computeFileAs(this);

	// Is this a distribution list?
	this.isDL = this.isDistributionList();
	if (this.isDL) {
		this.dlInfo = { //this is minimal DL info, available mainly to allow to know whether to show the lock or not.
			isMinimal: true,
			isMember: node.isMember,
			isOwner: node.isOwner,
			subscriptionPolicy: this.attr.zimbraDistributionListSubscriptionPolicy,
			unsubscriptionPolicy: this.attr.zimbraDistributionListUnsubscriptionPolicy,
			displayName: node.d || "",
			hideInGal: this.attr.zimbraHideInGal == "TRUE"
		};

		this.canExpand = node.exp !== false; //default to true, since most cases this is implicitly true if not returned. See bug 94867
		var emails = this.getEmails();
		var ac = window.parentAppCtxt || window.appCtxt;
		for (var i = 0; i < emails.length; i++) {
			ac.setIsExpandableDL(emails[i], this.canExpand);
		}
	}
	//S/MIME: If user certificate is present, include it into contact's object
	if (node.certificate) {
		this.certificate = node.certificate;
	}
};

/**
 * Gets display text for an attendee. Prefers name over email.
 *
 * @param {constant}	type		the attendee type
 * @param {Boolean}	shortForm		if <code>true</code>, return only name or email
 * @return	{String}	the attendee
 */
ZmContact.prototype.getAttendeeText =
function(type, shortForm) {
	var email = this.getEmail(true);
	return (email?email.toString(shortForm || (type && type != ZmCalBaseItem.PERSON)):"");
};

/**
 * Gets display text for an attendee. Prefers name over email.
 *
 * @param {constant}	type		the attendee type
 * @param {Boolean}	shortForm		if <code>true</code>, return only name or email
 * @return	{String}	the attendee
 */
ZmContact.prototype.getAttendeeKey =
function() {
	var email = this.getLookupEmail() || this.getEmail();
	var name = this.getFullName();
	return email ? email : name;
};

/**
 * Gets the unknown fields.
 * 
 * @param	{function}	[sortByNameFunc]	sort by function
 * @return	{Array}	an array of field name/value pairs
 */
ZmContact.prototype.getUnknownFields = function(sortByNameFunc) {
	var map = ZmContact.__FIELD_MAP;
	if (!map) {
		map = ZmContact.__FIELD_MAP = {};
		for (var i = 0; i < ZmContact.DISPLAY_FIELDS; i++) {
			map[ZmContact.DISPLAY_FIELDS[i]] = true;
		}
	}
	var fields = [];
	var attrs = this.getAttrs();
	for (var aname in attrs) {
		var field = ZmContact.getPrefix(aname);
		if (map[aname]) continue;
		fields.push(field);
	}
	return this.getFields(fields, sortByNameFunc);
};

/**
 * Gets the fields.
 * 
 * @param	{Array}	field		the fields
 * @param	{function}	[sortByNameFunc]	sort by function
 * @return	{Array}	an array of field name/value pairs
 */
ZmContact.prototype.getFields =
function(fields, sortByNameFunc) {
	// TODO: [Q] Should sort function handle just the field names or the attribute names?
	var selection;
	var attrs = this.getAttrs();
	for (var index = 0; index < fields.length; index++) {
		for (var i = 1; true; i++) {
			var aname = ZmContact.getAttributeName(fields[index], i);
			if (!attrs[aname]) break;
			if (!selection) selection = {};
			selection[aname] = attrs[aname];
		}
	}
	if (sortByNameFunc && selection) {
		var keys = AjxUtil.keys(selection);
		keys.sort(sortByNameFunc);
		var nfields = {};
		for (var i = 0; i < keys; i++) {
			var key = keys[i];
			nfields[key] = fields[key];
		}
		selection = nfields;
	}
	return selection;
};

/**
 * Returns a list of distribution list members for this contact. Only the
 * requested range is returned.
 *
 * @param offset	{int}			offset into list to start at
 * @param limit		{int}			number of members to fetch and return
 * @param callback	{AjxCallback}	callback to run with results
 */
ZmContact.prototype.getDLMembers =
function(offset, limit, callback) {

	var result = {list:[], more:false, isDL:{}};
	if (!this.isDL) { return result; }

	var email = this.getEmail();
	var app = appCtxt.getApp(ZmApp.CONTACTS);
	var dl = app.getDL(email);
	if (!dl) {
		dl = result;
		dl.more = true;
		app.cacheDL(email, dl);
	}

	limit = limit || ZmContact.DL_PAGE_SIZE;
	var start = offset || 0;
	var end = (offset + limit) - 1;

	// see if we already have the requested members, or know that we don't
	if (dl.list.length >= end + 1 || !dl.more) {
		var list = dl.list.slice(offset, end + 1);
		result = {list:list, more:dl.more || (dl.list.length > end + 1), isDL:dl.isDL};
		DBG.println("dl", "found cached DL members");
		this._handleResponseGetDLMembers(start, limit, callback, result);
		return;
	}

	DBG.println("dl", "server call " + offset + " / " + limit);
	if (!dl.total || (offset < dl.total)) {
		var jsonObj = {GetDistributionListMembersRequest:{_jsns:"urn:zimbraAccount", offset:offset, limit:limit}};
		var request = jsonObj.GetDistributionListMembersRequest;
		request.dl = {_content: this.getEmail()};
		var respCallback = new AjxCallback(this, this._handleResponseGetDLMembers, [offset, limit, callback]);
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	} else {
		this._handleResponseGetDLMembers(start, limit, callback, result);
	}
};

ZmContact.prototype._handleResponseGetDLMembers =
function(offset, limit, callback, result, resp) {

	if (resp || !result.list) {
		var list = [];
		resp = resp || result.getResponse();  //if response is passed, take it. Otherwise get it from result
		resp = resp.GetDistributionListMembersResponse;
		var dl = appCtxt.getApp(ZmApp.CONTACTS).getDL(this.getEmail());
		var more = dl.more = resp.more;
		var isDL = {};
		var members = resp.dlm;
		if (members && members.length) {
			for (var i = 0, len = members.length; i < len; i++) {
				var member = members[i]._content;
				list.push(member);
				dl.list[offset + i] = member;
				if (members[i].isDL) {
					isDL[member] = dl.isDL[member] = true;
				}
			}
		}
		dl.total = resp.total;
		DBG.println("dl", list.join("<br>"));
		var result = {list:list, more:more, isDL:isDL};
	}
	DBG.println("dl", "returning list of " + result.list.length + ", more is " + result.more);
	if (callback) {
		callback.run(result);
	}
	else { //synchronized case - see ZmContact.prototype.getDLMembers above
		return result;
	}
};

/**
 * Returns a list of all the distribution list members for this contact.
 *
 * @param callback	{AjxCallback}	callback to run with results
 */
ZmContact.prototype.getAllDLMembers =
function(callback) {

	var result = {list:[], more:false, isDL:{}};
	if (!this.isDL) { return result; }

	var dl = appCtxt.getApp(ZmApp.CONTACTS).getDL(this.getEmail());
	if (dl && !dl.more) {
		result = {list:dl.list.slice(), more:false, isDL:dl.isDL};
		callback.run(result);
		return;
	}

	var nextCallback = new AjxCallback(this, this._getNextDLChunk, [callback]);
	this.getDLMembers(dl ? dl.list.length : 0, null, nextCallback);
};

ZmContact.prototype._getNextDLChunk =
function(callback, result) {

	var dl = appCtxt.getApp(ZmApp.CONTACTS).getDL(this.getEmail());
	if (result.more) {
		var nextCallback = new AjxCallback(this, this._getNextDLChunk, [callback]);
		this.getDLMembers(dl.list.length, null, nextCallback);
	} else {
		result.list = dl.list.slice();
		callback.run(result);
	}
};

/**
 * Gets the contact from cache handling parsing of contactId
 * 
 * @param contactId {String} contact id
 * @return contact {ZmContact} contact or null
 * @private
 */
ZmContact.getContactFromCache =
function(contactId) {
	var userZid = appCtxt.accountList.mainAccount.id;
	var contact = null;
	if (contactId && contactId.indexOf(userZid + ":") !=-1) {
		//strip off the usersZid to pull from cache
		var arr = contactId.split(userZid + ":");
		contact = arr && arr.length > 1 ? appCtxt.cacheGet(arr[1]) : appCtxt.cacheGet(contactId);
	}
	else {
		contact = appCtxt.cacheGet(contactId);
	}
	if (contact instanceof ZmContact) {
		return contact;
	}
	return null;
};

// For mapAttrs(), prepare a hash where each key is the base name of an attr (without an ending number and lowercased),
// and the value is a numerically sorted list of attr names in their original form.
ZmContact.ATTR_VARIANTS = {};
ZmContact.IGNORE_ATTR_VARIANT = {};
ZmContact.IGNORE_ATTR_VARIANT[ZmContact.F_groups] = true;

ZmContact.initAttrVariants = function(attrClass) {
	var keys = Object.keys(attrClass),
		len = keys.length, key, i, attr,
		attrs = [];

	// first, grab all the attr names
	var ignoreVariant = attrClass.IGNORE_ATTR_VARIANT || {};
	for (i = 0; i < len; i++) {
		key = keys[i];
		if (key.indexOf('F_') === 0) {
			attr = attrClass[key];
			if (!ignoreVariant[attr]) {
				attrs.push(attr);
			}
		}
	}

	// sort numerically, eg so that we get ['email', 'email2', 'email10'] in right order
	var numRegex = /^([a-zA-Z]+)(\d+)$/;
	attrs.sort(function(a, b) {
		var aMatch = a.match(numRegex),
			bMatch = b.match(numRegex);
		// check if both are numbered attrs with same base
		if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
			return aMatch[2] - bMatch[2];
		}
		else {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
	});

	// construct hash mapping generic base name to its iterated attr names
	var attr, base;
	for (i = 0; i < attrs.length; i++) {
		attr = attrs[i];
		base = attr.replace(/\d+$/, '').toLowerCase();
		if (!ZmContact.ATTR_VARIANTS[base]) {
			ZmContact.ATTR_VARIANTS[base] = [];
		}
		ZmContact.ATTR_VARIANTS[base].push(attr);
	}
};
ZmContact.initAttrVariants(ZmContact);

/**
 * Takes a hash of attrs and values and maps it to our attr names as best as it can. Scalar attrs will map if they
 * have the same name or only differ by case. A multivalued attr will map to a set of our attributes that share the
 * same case-insensitive base name. Some examples:
 *
 *      FIRSTNAME: "Mildred"    =>      firstName: "Mildred"
 *      email: ['a', 'b']       =>      email: 'a',
 *                                      email2: 'b'
 *      WorkEmail: ['y', 'z']   =>      workEmail1: 'y',
 *                                      workEmail2: 'z'
 *      IMaddress: ['f', 'g']   =>      imAddress1: 'f',
 *                                      imAddress2: 'g'
 *
 * @param   {Object}    attrs       hash of attr names/values
 *
 * @returns {Object}    hash of attr names/values using known attr names ZmContact.F_*
 */
ZmContact.mapAttrs = function(attrs) {

	var attr, value, baseAttrs, newAttrs = {};
	for (attr in attrs) {
		value = attrs[attr];
		if (value) {
			baseAttrs = ZmContact.ATTR_VARIANTS[attr.toLowerCase()];
			if (baseAttrs) {
				value = AjxUtil.toArray(value);
				var len = Math.min(value.length, baseAttrs.length), i;
				for (i = 0; i < len; i++) {
					newAttrs[baseAttrs[i]] = value[i];
				}
			} else {
				// Any overlooked/ignored attributes are simply passed along
				newAttrs[attr] = value;
			}
		}
	}
	return newAttrs;
};

// these need to be kept in sync with ZmContact.F_*
ZmContact._AB_FIELD = {
	firstName:				ZmMsg.AB_FIELD_firstName,		// file as info
	lastName:				ZmMsg.AB_FIELD_lastName,
	middleName:				ZmMsg.AB_FIELD_middleName,
	fullName:				ZmMsg.AB_FIELD_fullName,
	jobTitle:				ZmMsg.AB_FIELD_jobTitle,
	company:				ZmMsg.AB_FIELD_company,
	department:				ZmMsg.AB_FIELD_department,
	email:					ZmMsg.AB_FIELD_email,			// email addresses
	email2:					ZmMsg.AB_FIELD_email2,
	email3:					ZmMsg.AB_FIELD_email3,
	imAddress1:				ZmMsg.AB_FIELD_imAddress1,		// IM addresses
	imAddress2:				ZmMsg.AB_FIELD_imAddress2,
	imAddress3:				ZmMsg.AB_FIELD_imAddress3,
	image: 					ZmMsg.AB_FIELD_image,			// contact photo
	attachment:				ZmMsg.AB_FIELD_attachment,
	workStreet:				ZmMsg.AB_FIELD_street,			// work address info
	workCity:				ZmMsg.AB_FIELD_city,
	workState:				ZmMsg.AB_FIELD_state,
	workPostalCode:			ZmMsg.AB_FIELD_postalCode,
	workCountry:			ZmMsg.AB_FIELD_country,
	workURL:				ZmMsg.AB_FIELD_URL,
	workPhone:				ZmMsg.AB_FIELD_workPhone,
	workPhone2:				ZmMsg.AB_FIELD_workPhone2,
	workFax:				ZmMsg.AB_FIELD_workFax,
	assistantPhone:			ZmMsg.AB_FIELD_assistantPhone,
	companyPhone:			ZmMsg.AB_FIELD_companyPhone,
	callbackPhone:			ZmMsg.AB_FIELD_callbackPhone,
	homeStreet:				ZmMsg.AB_FIELD_street,			// home address info
	homeCity:				ZmMsg.AB_FIELD_city,
	homeState:				ZmMsg.AB_FIELD_state,
	homePostalCode:			ZmMsg.AB_FIELD_postalCode,
	homeCountry:			ZmMsg.AB_FIELD_country,
	homeURL:				ZmMsg.AB_FIELD_URL,
	homePhone:				ZmMsg.AB_FIELD_homePhone,
	homePhone2:				ZmMsg.AB_FIELD_homePhone2,
	homeFax:				ZmMsg.AB_FIELD_homeFax,
	mobilePhone:			ZmMsg.AB_FIELD_mobilePhone,
	pager:					ZmMsg.AB_FIELD_pager,
	carPhone:				ZmMsg.AB_FIELD_carPhone,
	otherStreet:			ZmMsg.AB_FIELD_street,			// other info
	otherCity:				ZmMsg.AB_FIELD_city,
	otherState:				ZmMsg.AB_FIELD_state,
	otherPostalCode:		ZmMsg.AB_FIELD_postalCode,
	otherCountry:			ZmMsg.AB_FIELD_country,
	otherURL:				ZmMsg.AB_FIELD_URL,
	otherPhone:				ZmMsg.AB_FIELD_otherPhone,
	otherFax:				ZmMsg.AB_FIELD_otherFax,
	notes:					ZmMsg.notes,					// misc fields
	birthday:				ZmMsg.AB_FIELD_birthday
};

ZmContact._AB_FILE_AS = {
	1:						ZmMsg.AB_FILE_AS_lastFirst,
	2:						ZmMsg.AB_FILE_AS_firstLast,
	3:						ZmMsg.AB_FILE_AS_company,
	4:						ZmMsg.AB_FILE_AS_lastFirstCompany,
	5:						ZmMsg.AB_FILE_AS_firstLastCompany,
	6:						ZmMsg.AB_FILE_AS_companyLastFirst,
	7:						ZmMsg.AB_FILE_AS_companyFirstLast
};

} // if (!window.ZmContact)
}

if (AjxPackage.define("zimbraMail.voicemail.model.ZmCallFeature")) {
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
* Creates a call feature.
* @constructor
* @class
* This class represents a call feature. Each feature can be active or subscribed. Other than
* that each feature has different data, which is stored in the data member, as just copies of
* the JSON data. Whoever uses this class just has to know how to deal with the data.
*
*/
ZmCallFeature = function(name, isVoicemailPref, isSubscribed) {
	
	this.name = name;
	this.isSubscribed = isSubscribed;
	this.isActive = false;
	this.data = {};
	this.isVoicemailPref = isVoicemailPref;
	if (isVoicemailPref) {
		this.data.value = "";
	}
}

ZmCallFeature.prototype.toString = 
function() {
	return "ZmCallFeature";
}

// Calling preferences
ZmCallFeature.ANONYMOUS_REJECTION = "anoncallrejection";
ZmCallFeature.CALL_FORWARDING = "callforward";
ZmCallFeature.SELECTIVE_CALL_FORWARDING = "selectivecallforward";
ZmCallFeature.VOICEMAIL_PREFS = "voicemailprefs"
ZmCallFeature.CALL_FORWARD_NO_ANSWER = "callforwardnoanswer";
ZmCallFeature.SELECTIVE_CALL_REJECTION = "selectivecallrejection";
ZmCallFeature.SELECTIVE_CALL_ACCEPTANCE = "selectivecallacceptance";

ZmCallFeature.CALL_FEATURES = [ZmCallFeature.ANONYMOUS_REJECTION, ZmCallFeature.CALL_FORWARDING, ZmCallFeature.VOICEMAIL_PREFS, ZmCallFeature.CALL_FORWARD_NO_ANSWER, ZmCallFeature.SELECTIVE_CALL_FORWARDING, ZmCallFeature.SELECTIVE_CALL_REJECTION, ZmCallFeature.SELECTIVE_CALL_ACCEPTANCE];


// Voicemail preferences.
ZmCallFeature.EMAIL_NOTIFICATION = "vmPrefEmailNotifAddress";
ZmCallFeature.VOICE_FEATURES = [ZmCallFeature.EMAIL_NOTIFICATION];


ZmCallFeature.prototype.createProxy = 
function() {
	var result = AjxUtil.createProxy(this);
	result.data = AjxUtil.createProxy(this.data);
	return result;
};

ZmCallFeature.prototype.addVoicemailChangeNode = 
function(soapDoc, parentNode) {
	var value = this.isActive ? this.data.value : "";
	var child = soapDoc.set("pref", value, parentNode);
	child.setAttribute("name", this.name);
};

ZmCallFeature.prototype.addChangeNode = 
function(soapDoc, phoneNode) {
	var child = soapDoc.set(this.name, null, phoneNode);
	this._setBooleanAttrubute(child, "s", this.isSubscribed);
	this._setBooleanAttrubute(child, "a", this.isActive);
	this._addNode(soapDoc, child, this.data);
};

ZmCallFeature.prototype._setBooleanAttrubute =
function(node, name, value) {
	node.setAttribute(name, value ? "true" : "false");
};

ZmCallFeature.prototype._addNode =
function(soapDoc, parentNode, data) {
	for (var i in data) {
		if (i != "_object_") { // Ignore proxy field.
			var obj = data[i]
			if (obj instanceof Array) {
				this._addArrayNode(soapDoc, parentNode, i, obj);
			} else if (typeof obj == "object") {
				var child = soapDoc.set(i, null, parentNode);
				this._addNode(soapDoc, child, obj);
			} else {
				if ((typeof obj) == 'boolean') {
					this._setBooleanAttrubute(parentNode, i, obj)
				} else {
					parentNode.setAttribute(i, obj);
				}
			}
		}
	}
};

ZmCallFeature.prototype._addArrayNode = 
function(soapDoc, parentNode, name, array) {
	for (var i = 0, count = array.length; i < count; i++) {
		var child = soapDoc.set(name, null, parentNode);
		this._addNode(soapDoc, child, array[i]);
	}
};

ZmCallFeature.prototype.assignFrom = 
function(feature) {
	this.isSubscribed = feature.isSubscribed;
	this.isActive = feature.isActive;
	this.data = {};
	for (var i in feature.data) {
		if (i != "_object_") { // Ignore proxy field.
			this.data[i] = feature.data[i];
		}
	}
};

ZmCallFeature.prototype._loadCallFeature = 
function(node) {
	for (var i in node) {
		if (i == "s") {
			this.isSubscribed = node.s.toString().toLowerCase() == "true";
		} else if (i == "a") {
			this.isActive = node.a.toString().toLowerCase() == "true";
		} else {
			this.data[i] = node[i];
		}
	}
};

ZmCallFeature.prototype._loadVoicemailPref = 
function(node) {
	this.isVoicemailPref = true;
	this.data.value = node._content;
	this.isSubscribed = true;
	this.isActive = Boolean(this.data.value);
};

}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmPhone")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* Creates a phone.
* @constructor
* @class
* This class represents a phone.
*
*/
ZmPhone = function() {
	this.name = null;				// The internal representation of the phone.
	this.used = null;				// Amount of quota used.
	this.limit = null;				// Quota size.
	this.folderTree = null;			// Folders
};

ZmPhone.prototype.toString = 
function() {
	return "ZmPhone";
};

ZmPhone.calculateDisplay =
function(name) {
	if (!name) {
		return "";
	}
	var offset = 0;
	var doIt = false;
	if (name.length == 10) {
		doIt = true;
	} else if ((name.length == 11) && (name.charAt(0) == '1')) {
		doIt = true;
		offset = 1;
	}
	if (doIt) {
		var array = [
			"(",
			name.substring(offset, offset + 3),
			") ",
			name.substring(offset + 3, offset + 6),
			"-",
			name.substring(offset + 6, offset + 10)
		];
		return array.join("");
	} else {
		return name;
	}
};

ZmPhone.calculateName =
function(display) {
	return display.replace(/[^\d]/g, '');
};

ZmPhone.isValid =
function(str) {
	var nameLength = ZmPhone.calculateName(str).length;
	return (7 <= nameLength) && (nameLength <= 20) && !/[^0-9()\-\s\+]/.exec(str);
};

ZmPhone.prototype.getDisplay =
function() {
	this._display = ZmPhone.calculateDisplay(this.name);
	if(this.label) {
		this._display = [this.label, " - ", this._display].join("");
	}
	if(this._display == "") {
		this._display = ZmMsg.phoneNotConfigured;
	}
	return this._display;
};

ZmPhone.prototype.getCallUrl = 
function() {
	return "callto:+1" + this.name;
};

ZmPhone.prototype._loadFromDom = 
function(node) {
	this.name =  node.name;
	this.id = node.id;
	this.label = node.label;
	this.hasVoiceMail = node.vm;
	this.allProps = node;
	this.phoneType = node.type;
	
	if (node.used && node.used.length) this.used =  node.used[0]._content;
	if (this.limit && this.limit.length) this.limit = node.limit[0]._content;
	this._initializeFeatures();
	var features = node.callfeatures[0].callfeature;
	this._featuresDefined = true;
	if (features) {
		for (var i = 0, count = features.length; i < count; i++) {
			var name = features[i].name;
			var feature = this._features[name];
			if (feature) {
				feature.isSubscribed = true;
				this._featuresDefined = false;
			}
		}
	}
};

/////////////////////////////////////////////////////
// Make a subclass for this stuff?
/////////////////////////////////////////////////////

ZmPhone.prototype.getCallFeatures = 
function(callback, errorCallback) {
	if (this._featuresDefined) {
		if (callback) {
			callback.run(this._features, this);
		}
	} else {
		this._initializeFeatures();
		var soapDoc = AjxSoapDoc.create("GetVoiceFeaturesRequest", "urn:zimbraVoice");
		appCtxt.getApp(ZmApp.VOICE).setStorePrincipal(soapDoc);
		var node = soapDoc.set("phone");
		node.setAttribute("name", this.name);
		for (var i in this._features) {
			var feature = this._features[i];
			if (feature.isSubscribed && !feature.isVoicemailPref) {
				soapDoc.set(feature.name, null, node);
			}
		}
		var respCallback = new AjxCallback(this, this._handleResponseGetVoiceFeatures, callback);
		var params = {
			soapDoc: soapDoc,
			asyncMode: true,
			callback: respCallback,
			errorCallback: errorCallback
		};
		appCtxt.getAppController().sendRequest(params);
	}
};

ZmPhone.prototype._handleResponseGetVoiceFeatures = 
function(callback, response) {
	this._initializeFeatures();
	var features = response._data.GetVoiceFeaturesResponse.phone[0];
	for (var i in features) {
		if (i == ZmCallFeature.VOICEMAIL_PREFS) {
			var voicemailPrefs = features[i][0].pref;
			this._loadVoicemailPrefs(voicemailPrefs);
		} else {
			var feature = this._features[i];
			if (feature) {
				feature._loadCallFeature(features[i][0]);
			}
		}
	}
	this._featuresDefined = true;
	if (callback) {
		callback.run(this._features, this);
	}
};

ZmPhone.prototype._loadVoicemailPrefs = 
function(voicemailPrefs) {
	for (var i = 0, count = voicemailPrefs.length; i < count; i++) {
		var obj = voicemailPrefs[i];
		var feature = this._features[obj.name];
		if (feature) {
			feature._loadVoicemailPref(obj);
		}
	}
};

ZmPhone.prototype._initializeFeatures = 
function() {
	if (!this._features)
		this._features = {};
	for(var i = 0, count = ZmCallFeature.CALL_FEATURES.length; i < count; i++) {
		var name = ZmCallFeature.CALL_FEATURES[i];
		if (!this._features[name])
			this._features[name] = new ZmCallFeature(name, false, false);
	}
	for(var i = 0, count = ZmCallFeature.VOICE_FEATURES.length; i < count; i++) {
		var name = ZmCallFeature.VOICE_FEATURES[i];
		if (!this._features[name])
			this._features[name] = new ZmCallFeature(name, true, this.hasVoiceMail);
	}
};

ZmPhone.prototype.modifyCallFeatures = 
function(batchCommand, newFeatures, callback) {
	var soapDoc = AjxSoapDoc.create("ModifyVoiceFeaturesRequest", "urn:zimbraVoice");
	appCtxt.getApp(ZmApp.VOICE).setStorePrincipal(soapDoc);
	var node = soapDoc.set("phone");
	node.setAttribute("name", this.name);
	var voicemailPrefsNode = null;
	for (var i = 0, count = newFeatures.length; i < count; i++) {
		if (newFeatures[i].isVoicemailPref) {
			if (!voicemailPrefsNode) {
				voicemailPrefsNode = soapDoc.set(ZmCallFeature.VOICEMAIL_PREFS, null, node);
			}
			newFeatures[i].addVoicemailChangeNode(soapDoc, voicemailPrefsNode);
		} else {
			newFeatures[i].addChangeNode(soapDoc, node);
		}
	}
	var respCallback = new AjxCallback(this, this._handleResponseModifyVoiceFeatures, [newFeatures, callback]);
	batchCommand.addNewRequestParams(soapDoc, respCallback);
};

ZmPhone.prototype._handleResponseModifyVoiceFeatures = 
function(newFeatures, callback) {
	for(var i = 0, count = newFeatures.length; i < count; i++) {
		var feature = this._features[newFeatures[i].name];
		feature.assignFrom(newFeatures[i]);
	}
	if (callback) {
		callback.run();
	}
};

}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmCallingParty")) {
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
* Creates a calling party.
* @constructor
* @class  ZmCallingParty
* This class represents a calling party. Should be treated as immutable.
*
*/
ZmCallingParty = function() {
	ZmPhone.call(this);

	this.type = null;
	this.city = null;
	this.state = null;
	this.country = null;
	this.callerId = null;
};

ZmCallingParty.prototype = new ZmPhone;
ZmCallingParty.prototype.constructor = ZmCallingParty;

ZmCallingParty.prototype.toString = 
function() {
	return "ZmCallingParty";
};

ZmCallingParty.prototype.getPhoneNumber = 
function() {
	return this.name;
};

ZmCallingParty.prototype._loadFromDom =
function(node) {
	if (node.n) this.name = node.n;
	if (node.p) this.callerId = node.p == node.n ? null : this._getDisplayString(node.p);
	if (node.t) this.type = node.t == "f" ? ZmVoiceItem.FROM : ZmVoiceItem.TO;
	if (node.ci) this.city = this._getDisplayString(node.ci);
	if (node.st) this.state = this._getDisplayString(node.st);
	if (node.co) this.country = node.co == "null" ? null : node.co;
};

ZmCallingParty.prototype._getDisplayString =
function(str) {
	return (str.toUpperCase() != "UNAVAILABLE") ? str : null;
};
}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmVoiceItem")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a voice item.
 * @constructor
 * @class ZmVoiceItem
 * This abstract class represents a voicemail or phone call.
 *
 * @param id		[int]			unique ID
 * @param list		[ZmVoiceList]	list that contains this item
 */
ZmVoiceItem = function(type, id, list) {

	if (arguments.length == 0) { return; }
	ZmItem.call(this, type, id, list, true);

	this.id = null;
	this.date = 0;
	this.duration = 0;
	this._callingParties = {};
	this.participants = new AjxVector();
};

ZmVoiceItem.prototype = new ZmItem;
ZmVoiceItem.prototype.constructor = ZmVoiceItem;

ZmVoiceItem.prototype.toString = 
function() {
	return "ZmVoiceItem";
};

ZmVoiceItem.FROM		= 1;
ZmVoiceItem.TO			= 2;

ZmVoiceItem.prototype.getFolder = 
function() {
	return this.list ? this.list.folder : null;
};

ZmVoiceItem.prototype.getPhone = 
function() {
	return this.list && this.list.folder ? this.list.folder.phone : null;
};

ZmVoiceItem.prototype.isInTrash = 
function() {
	if (this.list && this.list.folder) {
		return this.list.folder.isInTrash();
	} else {
		return false;
	}
};

ZmVoiceItem.prototype.getCallingParty =
function(type) {
	return this._callingParties[type];
};

ZmVoiceItem.prototype._loadFromDom =
function(node) {
	if (node.id) this.id = node.id;
	if (node.cp) {
		for(var i = 0, count = node.cp.length; i < count; i++) {
			var callingParty = new ZmCallingParty();
			callingParty._loadFromDom(node.cp[i]);
			this._callingParties[callingParty.type] = callingParty;
		}
	}
	if (node.d) this.date = new Date(node.d);
	if (node.du) this.duration = new Date(node.du * 1000);
};

}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmCall")) {
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
 * Creates a phone call.
 * @constructor
 * @class
 * This class represents a phone call.
 *
 * @param id		[int]			unique ID
 * @param list		[ZmVoiceList]	list that contains this item 
 */
ZmCall = function(id, list) {
	ZmVoiceItem.call(this, ZmItem.VOICEMAIL, id, list);
}

ZmCall.prototype = new ZmVoiceItem;
ZmCall.prototype.constructor = ZmCall;

ZmCall.prototype.toString = 
function() {
	return "ZmCall";
}

/**
* Fills in the voicemail from the given message node.
*
* @param node		a message node
* @param args		hash of input args
*/
ZmCall.createFromDom =
function(node, args) {
	var result = new ZmCall(node.id, args.list);
	result._loadFromDom(node);
	return result;
};

ZmCall.prototype._loadFromDom =
function(node) {
	ZmVoiceItem.prototype._loadFromDom.call(this, node);
};

}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmVoicemail")) {
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
 * Creates a voicemail.
 * @constructor
 * @class
 * This class represents a voiemail.
 *
 * @param id		[int]			unique ID
 * @param list		[ZmVoiceList]	list that contains this item
 */
ZmVoicemail = function(id, list) {

	ZmVoiceItem.call(this, ZmItem.VOICEMAIL, id, list);

	this.isUnheard = false;
	this.soundUrl = null;
}

ZmVoicemail.prototype = new ZmVoiceItem;
ZmVoicemail.prototype.constructor = ZmVoicemail;

ZmVoicemail.prototype.toString = 
function() {
	return "ZmVoicemail";
}

/**
* Fills in the voicemail from the given message node.
*
* @param node		a message node
* @param args		hash of input args
*/
ZmVoicemail.createFromDom =
function(node, args) {
	var result = new ZmVoicemail(node.id, args.list);
	result._loadFromDom(node);
	return result;
};

ZmVoicemail.prototype._loadFromDom =
function(node) {
	ZmVoiceItem.prototype._loadFromDom.call(this, node);
	if (node.f) {
		this.isUnheard = node.f.indexOf("u") >= 0;
		this.isHighPriority = node.f.indexOf("!") >= 0;
		this.isPrivate = node.f.indexOf("p") >= 0;
	}
	if (node.content) this.soundUrl = node.content[0].url;
};

}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmVoiceFolder")) {
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
*
* @constructor
* @class
*
* @author Dave Comfort
*
* @param id			[int]			numeric ID
* @param name		[string]		name
* @param parent		[ZmOrganizer]	parent organizer
* @param tree		[ZmTree]		tree model that contains this organizer
* @param color
* @param url		[string]*		URL for this organizer's feed
* @param owner
* @param zid		[string]*		Zimbra id of owner, if remote share
* @param rid		[string]*		Remote id of organizer, if remote share
* @param restUrl	[string]*		The REST URL of this organizer.
*/
ZmVoiceFolder = function(params) {
	params.type = ZmOrganizer.VOICE;
	ZmOrganizer.call(this, params);
	this.phone = params.phone;
	this.callType = params.name; // A constant...ACCOUNT, PLACED, etc.
	this.view = params.view;
}

ZmVoiceFolder.prototype = new ZmOrganizer;
ZmVoiceFolder.prototype.constructor = ZmVoiceFolder;

ZmVoiceFolder.ACCOUNT = "USER_ROOT";
ZmVoiceFolder.PLACED_CALL = "Placed Calls";
ZmVoiceFolder.ANSWERED_CALL = "Answered Calls";
ZmVoiceFolder.MISSED_CALL = "Missed Calls";
ZmVoiceFolder.VOICEMAIL = "Voicemail Inbox";
ZmVoiceFolder.TRASH = "Trash";

ZmVoiceFolder.ACCOUNT_ID = "1";
ZmVoiceFolder.PLACED_CALL_ID = "1027";
ZmVoiceFolder.ANSWERED_CALL_ID = "1026";
ZmVoiceFolder.MISSED_CALL_ID = "1025";
ZmVoiceFolder.VOICEMAIL_ID = "1024";
ZmVoiceFolder.TRASH_ID = "1028";

ZmVoiceFolder.SORT_ORDER = {};
ZmVoiceFolder.SORT_ORDER[ZmVoiceFolder.PLACED_CALL] = 5;
ZmVoiceFolder.SORT_ORDER[ZmVoiceFolder.ANSWERED_CALL] = 4;
ZmVoiceFolder.SORT_ORDER[ZmVoiceFolder.MISSED_CALL] = 3;
ZmVoiceFolder.SORT_ORDER[ZmVoiceFolder.VOICEMAIL] = 1;
ZmVoiceFolder.SORT_ORDER[ZmVoiceFolder.TRASH] = 2;

// Public methods

ZmVoiceFolder.prototype.toString =
function() {
	return "ZmVoiceFolder";
};

ZmVoiceFolder.prototype.getName =
function(showUnread, maxLength, noMarkup) {
	var name;
	switch (this.callType) {
		case ZmVoiceFolder.ACCOUNT: name = this.phone.getDisplay(); break;
		case ZmVoiceFolder.PLACED_CALL: name = ZmMsg.placedCalls; break;
		case ZmVoiceFolder.ANSWERED_CALL: name = ZmMsg.answeredCalls; break;
		case ZmVoiceFolder.MISSED_CALL: name = ZmMsg.missedCalls; break;
		case ZmVoiceFolder.VOICEMAIL: name = ZmMsg.voiceMail; break;
		case ZmVoiceFolder.TRASH: name = ZmMsg.trash; break;
	}
	return this._markupName(name, showUnread && (this.callType != ZmVoiceFolder.TRASH), noMarkup);
};

ZmVoiceFolder.prototype.getIcon =
function() {
	switch (this.callType) {
		case ZmVoiceFolder.ACCOUNT:			{ return null; }
		case ZmVoiceFolder.PLACED_CALL:		{ return "PlacedCalls"; }
		case ZmVoiceFolder.ANSWERED_CALL:	{ return "AnsweredCalls"; }
		case ZmVoiceFolder.MISSED_CALL:		{ return "MissedCalls"; }
		case ZmVoiceFolder.VOICEMAIL:		{ return "Voicemail"; }
		case ZmVoiceFolder.TRASH:			{ return "Trash"; }
		default:							{ return null; }
	}
};

ZmVoiceFolder.prototype.getSearchType =
function() {
	return (this.callType == ZmVoiceFolder.VOICEMAIL) ||
		   (this.callType == ZmVoiceFolder.TRASH) ? ZmItem.VOICEMAIL : ZmItem.CALL;
};

ZmVoiceFolder.prototype.getSearchQuery =
function() {
	var query = [ "phone:", this.phone.name ];
	if (this.callType != ZmVoiceFolder.VOICEMAIL) {
		query.push(" in:\"");
		query.push(this.callType);
		query.push("\"");
	}
	return query.join("");
};

ZmVoiceFolder.prototype.isInTrash =
function() {
	var folder = this;
	while (folder) {
		if (this.callType == ZmVoiceFolder.TRASH) {
			return true;
		}
		folder = folder.parent;
	}
	return false;
};

ZmVoiceFolder.prototype.mayContain =
function(what, folderType) {
	var items = (what instanceof Array) ? what : [what];
	for (var i = 0, count = items.length; i < count; i++) {
		var voicemail = items[i];
		if (!(voicemail instanceof ZmVoicemail)) {
			return false;
		}
		if ((this.callType != ZmVoiceFolder.VOICEMAIL) && 
			(this.callType !== ZmVoiceFolder.TRASH)) {
			return false;
		}
		var folder = voicemail.getFolder();
		if (folder == this) {
			return false;
		}
		if (folder.phone != this.phone) {
			return false;
		}
	}
	return true;
};

ZmVoiceFolder.prototype.changeNumUnheardBy =
function(delta) {
	var newValue = (this.numUnread || 0) + delta;
	this.notifyModify( { u: newValue } );
};

/**
 * This updates the num total in the folder 
 * @param delta {int} value to change num total by
 */
ZmVoiceFolder.prototype.changeNumTotal = 
function(delta) {
	var newValue = (this.numTotal || 0 ) + delta;
	this.notifyModify( {n: newValue});
};

ZmVoiceFolder.get =
function(phone, folderType) {
	var folderId = [folderType, "-", phone.name].join("");
	return phone.folderTree.getById(folderId);
};

ZmVoiceFolder.sortCompare =
function(folderA, folderB) {
	if ((folderA instanceof ZmVoiceFolder) && (folderB instanceof ZmVoiceFolder)) {
		var sortA = ZmVoiceFolder.SORT_ORDER[folderA.callType];
		var sortB = ZmVoiceFolder.SORT_ORDER[folderB.callType];
		if (sortA && sortB) {
			return sortA - sortB;
		}
	}
	return 0;
};

ZmVoiceFolder.prototype.getToolTip =
function (force) {
     return ZmOrganizer.prototype.getToolTip.call(this, force);
};

ZmVoiceFolder.prototype._getItemsText =
function() {
    switch (this.callType){
        case ZmVoiceFolder.VOICEMAIL:
        case ZmVoiceFolder.TRASH:
            return ZmMsg.voicemailMessages;
        case ZmVoiceFolder.ANSWERED_CALL:
            return ZmMsg.answeredCalls;
        case ZmVoiceFolder.MISSED_CALL:
            return ZmMsg.missedCalls;
        case ZmVoiceFolder.PLACED_CALL:
            return ZmMsg.placedCalls;
        default:
            return ZmMsg.calls;
    }
};

ZmVoiceFolder.prototype._getUnreadLabel = 
function() {
	return ZmMsg.unheard;	
};

ZmVoiceFolder.prototype.empty =
function(){
	DBG.println(AjxDebug.DBG1, "emptying: " + this.name + ", ID: " + this.id);

	var soapDoc = AjxSoapDoc.create("VoiceMsgActionRequest", "urn:zimbraVoice");
	var node = soapDoc.set("action");
	node.setAttribute("op", "empty");
	node.setAttribute("id", this.id);
	node.setAttribute("phone", this.phone.name);
	this._handleResponseEmptyObj = this._handleResponseEmptyObj || new AjxCallback(this, this._handleResponseEmpty);
	var params = {
		soapDoc: soapDoc,
		asyncMode: true,
		callback: this._handleResponseEmptyObj
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmVoiceFolder.prototype._handleResponseEmpty =
function() {
	// If this folder is visible, clear the contents of the view. 
	var controller = AjxDispatcher.run("GetVoiceController");
	if (controller.getFolder() == this) {
		controller.getListView().removeAll();
	}
};
}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmVoiceFolderTree")) {
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
 * Creates an empty voicemail folder tree.
 * @constructor
 * @class
 * This class represents a tree of voicemail folders.
 * 
 * @author Dave Comfort
 */
ZmVoiceFolderTree = function() {
	ZmTree.call(this, ZmOrganizer.VOICE);
};

ZmVoiceFolderTree.prototype = new ZmTree;
ZmVoiceFolderTree.prototype.constructor = ZmFolderTree;

// Public Methods

ZmVoiceFolderTree.prototype.toString =
function() {
	return "ZmVoiceFolderTree";
};

/**
 * Loads the folder or the zimlet tree.
 */
ZmVoiceFolderTree.prototype.loadFromJs =
function(rootObj, phone) {
	this.root = ZmVoiceFolderTree.createFromJs(null, rootObj, this, phone);
};

/**
 * Generic function for creating an organizer. Handles any organizer type that comes
 * in the folder list.
 * 
 * @param parent		[ZmFolder]		parent folder
 * @param obj			[object]		JSON with folder data
 * @param tree			[ZmFolderTree]	containing tree
 */
ZmVoiceFolderTree.createFromJs =
function(parent, obj, tree, phone) {
	if (!(obj && obj.id)) return;

	var params = {
		id: obj.id,
		name: obj.name,
		phone: phone,
		callType: obj.name || ZmVoiceFolder.ACCOUNT,
		view: obj.view,
		numUnread: obj.u,
		numTotal: obj.n,
		parent: parent,
		tree: tree
	};
	var folder = new ZmVoiceFolder(params);
	if (parent) {
		parent.children.add(folder);
	}

	if (obj.folder) {
		for (var i = 0, count = obj.folder.length; i < count; i++) {
			ZmVoiceFolderTree.createFromJs(folder, obj.folder[i], tree, phone);
		}
	}

	return folder;
};
}
if (AjxPackage.define("zimbraMail.voicemail.model.ZmVoiceList")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an empty list of voicemails.
 * @constructor
 * @class
 * This class represents a list of voicemails.
 *
 * @author Dave Comfort
 * 
 * @param type		type of thing in the list
 * @param search	the search that generated this list
 */
ZmVoiceList = function(type, search) {
	ZmList.call(this, type, search);
	this.folder = null;
};

ZmVoiceList.prototype = new ZmList;
ZmVoiceList.prototype.constructor = ZmVoiceList;

ZmVoiceList.prototype.toString = 
function() {
	return "ZmVoiceList";
};

/**
 * Moves items from one voice folder to another (typically Trash)
 * @param params		[hash]			hash of params:
 *        items			[array]			a list of items to move
 *        folder		[ZmFolder]		destination folder
 *        attrs			[hash]			additional attrs for SOAP command
 */
ZmVoiceList.prototype.moveItems =
function(params) {

	params = Dwt.getParams(arguments, ["items", "folder", "attrs"]);

	var params1 = AjxUtil.hashCopy(params);
	params1.items = AjxUtil.toArray(params.items);
	params1.attrs = params.attrs || {};
	params1.attrs.phone = this.folder.phone.name;
	params1.attrs.l = params.folder.id;
	params1.action = "move";
    if (params1.folder.id == ZmFolder.ID_TRASH) {
		if (params1.items.length > 1) {
	        params1.actionTextKey = 'actionTrash';
		}
    } else {
        params1.actionTextKey = 'actionMove';
        params1.actionArg = params.folder.getName(false, false, true);
    }
	params1.callback = new AjxCallback(this, this._handleResponseMoveItems, params);

	this._itemAction(params1);
};

/**
 * Does a hard (permanent) delete
 * @param params		[hash]			hash of params:
 *        items			[array]			a list of items to delete
 *        attrs			[hash]			additional attrs for SOAP command
 */
ZmVoiceList.prototype.deleteItems =
    function(params) {

        params = Dwt.getParams(arguments, ["items", "attrs"]);

        var params1 = AjxUtil.hashCopy(params);
        params1.items = AjxUtil.toArray(params.items);
        params1.attrs = params.attrs || {};
        params1.attrs.phone = this.folder.phone.name;
        //params1.attrs.l = params.folder.id;
        var plen = params1.items && params1.items.length || 0;
        if ( plen && !params.confirmDelete) {
            params.confirmDelete = true;
            var callback = ZmVoiceList.prototype.deleteItems.bind(this, params);
            this._popupDeleteWarningDialog(callback, 0, plen);
            return;
        }
        params.confirmDelete=false;
        params1.action = "delete";
        params1.callback = new AjxCallback(this, this._handleResponseMoveItems, params);    // Post processing for soft/hard delete is the same

        this._itemAction(params1);
    };

// The voice server isn't sending notifications. This callback updates
// folders and such after a move.
ZmVoiceList.prototype._handleResponseMoveItems =
function(params) {

	// Remove the items.
	for (var i = 0, count = params.items.length; i < count; i++) {
		this.remove(params.items[i]);
	}
	
	// Update the unread counts in the folders.
	var numUnheard = 0;
	for (var i = 0, count = params.items.length; i < count; i++) {
		if (params.items[i].isUnheard) {
			numUnheard++;
		}
	}
	var sourceFolder = params.items[0].getFolder();
	if (numUnheard) {
		sourceFolder.changeNumUnheardBy(-numUnheard);
        if (sourceFolder != params.folder){    // For hard delete, the source & destination folders are the same
		    params.folder.changeNumUnheardBy(numUnheard);
        }
	}
	
	// Replenish the list view.
	//
	// This is sort of a hack having the model call back to the controller, but without notifications
	// this seems like the best approach.
	var controller = AjxDispatcher.run("GetVoiceController");
	controller._handleResponseMoveItems(params);
};

ZmVoiceList.prototype._getActionNamespace =
function() {
	return "urn:zimbraVoice";
};

}

if (AjxPackage.define("zimbraMail.voicemail.view.ZmSoundPlayer")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * This class represents a widget that plays sounds.
 *
 * @param parent	{DwtControl} Parent widget (required)
 * @param voicemail	{ZmVoicemail} The voicemail this player is showing
 * @param className {string} CSS class. If not provided defaults to the class name (optional)
 * @param posStyle {string} Positioning style (absolute, static, or relative). If
 * 		not provided defaults to DwtControl.STATIC_STYLE (optional)
 */
ZmSoundPlayer = function(parent, voicemail, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "ZmSoundPlayer";
	DwtComposite.call(this, {parent:parent, className:className, posStyle:posStyle});

	this.voicemail = voicemail;
	this._isCompact = false;
	this._playButton = null;
	this._pauseButton = null;
	this._timeSlider = null;

	this._pluginMissing = DwtSoundPlugin.isPluginMissing();
    this._isScriptable = !DwtSoundPlugin.isScriptingBroken();
	this._createHtml();
	
	this._pluginChangeListenerObj = new AjxListener(this, this._pluginChangeListener);
};

ZmSoundPlayer.prototype = new DwtComposite;
ZmSoundPlayer.prototype.constructor = ZmSoundPlayer;

ZmSoundPlayer.prototype.toString =
function() {
	return "ZmSoundPlayer";
};

ZmSoundPlayer.COMPACT_EVENT = "Compact"
ZmSoundPlayer.HELP_EVENT = "Help"

ZmSoundPlayer._PLAYING	= "Playing";
ZmSoundPlayer._PAUSED	= "Paused";
ZmSoundPlayer._NONE 	= "None";

/**
 * Plays the currently loaded sound.
 */
ZmSoundPlayer.prototype.play =
function() {
	if (this._pluginMissing) {
		// Fire help event.
		if (this.isListenerRegistered(ZmSoundPlayer.HELP_EVENT)) {
			if (!this._helpEvent) {
				this._helpEvent = new DwtEvent(true);
				this._helpEvent.dwtObj = this;
			}
		    this.notifyListeners(ZmSoundPlayer.HELP_EVENT, this._helpEvent);
		}
	} else if (this._isScriptable) {
		this.setCompact(false);
		if (this._soundPlugin) {
			this._soundPlugin.play();
		} else {
			// Will start playing automatically.
			this._getPlugin();
		}
		this._setPlayState(ZmSoundPlayer._PLAYING);
	} else {
		this.setCompact(!this._isCompact);
	}

	// Select this row in the parent view.
	if (this.parent instanceof DwtListView) {
		this.parent.setSelection(this.voicemail);
	}
};

/**
 * Pauses the currently loaded sound.
 */
ZmSoundPlayer.prototype.pause =
function() {
	if (this._soundPlugin && this._isScriptable) {
		this._soundPlugin.pause();
		this._setPlayState(ZmSoundPlayer._PAUSED);
	}
};


/**
 * Stops the currently loaded sound.
 */
ZmSoundPlayer.prototype.stop =
function() {
	if (this._soundPlugin) {
		if (this._isScriptable) {
			this._soundPlugin.pause();
			this._setPlayState(ZmSoundPlayer._NONE);
			this._soundPlugin.rewind();
			this._timeSlider.setValue(this._timeSlider.getMinimum());
		} else {
			this._soundPlugin.dispose();
			this._soundPlugin = null;
		}
	}
};

/**
 * Sets the compactness of the player.
 *
 * @param compact if true, then only the play button is displayed
 */
ZmSoundPlayer.prototype.setCompact =
function(compact) {
	if (compact != this._isCompact) {
		// Set visiblity.
		if (this._isScriptable) {
			this._timeSlider.setVisible(!compact);
			this._pauseButton.setVisible(!compact);
		} else {
			if (compact) {
				if (this._soundPlugin) {
					this._soundPlugin.dispose();
					this._soundPlugin = null;
				}
			} else {
				this._getPlugin();
			}
			if (this._isScriptable) {
				this._playButton.setSelected(!compact);
			}
		}
		this._isCompact = compact;

		// Update status.
		this._setStatus(0);

		// Fire event.
		if (this.isListenerRegistered(ZmSoundPlayer.COMPACT_EVENT)) {
			if (!this._compactEvent) {
				this._compactEvent = new DwtEvent(true);
				this._compactEvent.dwtObj = this;
			}
			this._compactEvent.isCompact = compact;
		    this.notifyListeners(ZmSoundPlayer.COMPACT_EVENT, this._compactEvent);
		}
	}
};

/**
 * Returns true if the sound plugin is missing.
 */
ZmSoundPlayer.prototype.isPluginMissing =
function() {
	return this._pluginMissing;
};

ZmSoundPlayer.prototype.addHelpListener =
function(listener) {
    this.addListener(ZmSoundPlayer.HELP_EVENT, listener);
};

ZmSoundPlayer.prototype.addChangeListener =
function(listener) {
    this.addListener(DwtEvent.ONCHANGE, listener);
};

ZmSoundPlayer.prototype.addCompactListener =
function(listener) {
    this.addListener(ZmSoundPlayer.COMPACT_EVENT, listener);
};

/**
* Sets the enabled/disabled state of the player.
*
* @param enabled	whether to enable the player
*
*/
ZmSoundPlayer.prototype.setEnabled =
function(enabled) {
	if (enabled != this.getEnabled()) {
		DwtComposite.prototype.setEnabled.call(this, enabled);
		if (!this._pluginMissing) {
			this._playButton.setEnabled(enabled);
			this._pauseButton.setEnabled(enabled);
			this._timeSlider.setEnabled(enabled);
		}
	}
};

ZmSoundPlayer.prototype.dispose =
function() {
	if (this._soundPlugin) {
		this._soundPlugin.dispose();
	}
	DwtControl.prototype.dispose.call(this);
};

ZmSoundPlayer.prototype._setPlayState =
function(state) {
	if (this._isScriptable) {
		this._playButton.setVisible(state != ZmSoundPlayer._PLAYING)
		this._pauseButton.setVisible(state == ZmSoundPlayer._PLAYING);
		
	}
};

ZmSoundPlayer.prototype._setStatus =
function(time) {
	if (!this._durationStr) {
		this._durationStr = AjxDateUtil.computeDuration(this.voicemail.duration, true);
	}
	var status;
	if (this._isCompact || !this._isScriptable) {
		status = this._durationStr;
	} else {
		status = AjxDateUtil.computeDuration(time, true) + " / " + this._durationStr;
	}
	document.getElementById(this._statusId).innerHTML = status;
};

ZmSoundPlayer.prototype._timeSliderListener =
function(event) {
	if (this._soundPlugin) {
		var value = this._timeSlider.getValue();
		if (!this._timeSlider.isDragging()) {
			this._soundPlugin.setTime(value);
		}
		this._setStatus(value);
	}
};

ZmSoundPlayer.prototype._pluginChangeListener =
function(event) {
	if (event.status != DwtSoundPlugin.ERROR) {
		if (this._timeSlider && !this._timeSlider.isDragging()) {
			if (event.duration != this._timeSlider.getMaximum()) {
				this._timeSlider.setRange(0, event.duration, event.time);
			} else if (event.status != DwtSoundPlugin.ERROR) {
				this._timeSlider.setValue(event.time);
			}
			this._setStatus(event.time);
		}
		if (event.finished) {
			this._setPlayState(ZmSoundPlayer._NONE);
		}
	}
	this.notifyListeners(DwtEvent.ONCHANGE, event);
};

/**
 * Set player to finished state
 */
ZmSoundPlayer.prototype.setFinished = 
function() {
	this._setPlayState(ZmSoundPlayer._NONE);	
};

ZmSoundPlayer.prototype._getPlugin =
function() {
	if (this._pluginMissing) {
		return;
	}
	if (!this._soundPlugin) {
		var args = {
			parent: this._isScriptable ? this.shell : this,
			width: 200,
			height: 16,
			offscreen: this._isScriptable, 
			posStyle: DwtControl.RELATIVE_STYLE,
			url: this.voicemail.soundUrl,
			volume: DwtSoundPlugin.MAX_VOLUME
		};
		this._soundPlugin = DwtSoundPlugin.create(args);
		this._soundPlugin.addChangeListener(this._pluginChangeListenerObj);
		if (!this._isScriptable) {
			this._soundPlugin.reparentHtmlElement(this._htmlElId + "_player");
		}
	}
	return this._soundPlugin;
};

ZmSoundPlayer.prototype._createHtml =
function() {
	var element = this.getHtmlElement();
    var id = this._htmlElId;
    var template = this._isScriptable ? 
    	"voicemail.Voicemail#ZmSoundPlayer" : 
    	"voicemail.Voicemail#ZmSoundPlayerNoScript";

    element.innerHTML = AjxTemplate.expand(template, id);
	this._playButton = new DwtBorderlessButton({parent:this});
	this._playButton.replaceElement(id + "_play");
	this._playButton.setImage("Play");
	this._playButton.setToolTipContent(ZmMsg.play);
	this._playButton.addSelectionListener(new AjxListener(this, this.play));

    if (this._isScriptable) {
		this._pauseButton = new DwtBorderlessButton({parent:this});
		this._pauseButton.replaceElement(id + "_pause");
		this._pauseButton.setImage("Pause");
		this._pauseButton.setToolTipContent(ZmMsg.pause);
		this._pauseButton.addSelectionListener(new AjxListener(this, this.pause));
	
		this._statusId = id + "_status";
	
		this._timeSlider = new DwtSlider(this, null, "ZmHorizontalSlider", Dwt.RELATIVE_STYLE);
		this._timeSlider.setScrollStyle(Dwt.CLIP);
		this._timeSlider.replaceElement(id + "_postition");
		var el = this._timeSlider.getHtmlElement();
		if (el) {
			el.style.marginTop = "-3px";
		}
		this._timeSlider.addChangeListener(new AjxListener(this, this._timeSliderListener));
    } else {
		this._statusId = id + "_status";
    }
	this.setCompact(true);
	this.setSize(1, Dwt.DEFAULT); // Allows mouse events to go to parent control.
};


}
if (AjxPackage.define("zimbraMail.voicemail.view.ZmFlashAudioPlayer")) {
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
 * Creates a (singleton) Flash audio player. It plays  This is used by ZmVoicemailListView
 * @class
 *
 * @author Raja Rao DV
 *
 * @extends		DwtComposite
 */
ZmFlashAudioPlayer = function() {
    //singleton
    if (appCtxt._ZmFlashAudioPlayer) {
        return appCtxt._ZmFlashAudioPlayer;
    }
    className = "ZmFlashAudioPlayer";
    DwtComposite.call(this, {
        parent: appCtxt.getShell(),
        className: className
    });
    appCtxt._ZmFlashAudioPlayer = this;
    this.hasFlash = this._alertIfFlashNotInstalledOrIsOlderVersion();
};

ZmFlashAudioPlayer.prototype = new DwtComposite;
ZmFlashAudioPlayer.prototype.constructor = ZmFlashAudioPlayer;

ZmFlashAudioPlayer.MINIMUM_FLASH_VERSION = 9;

ZmFlashAudioPlayer.prototype.toString =
function() {
    return "ZmFlashAudioPlayer";
};

/**
 * Checks for Flash plugin and its version. If its not available or less than v9,
 * it throws an alert asking people to install the plugin.
 *
 * @returns <code>false<code> if plugin is not installed or less than v9

 */
ZmFlashAudioPlayer.prototype._alertIfFlashNotInstalledOrIsOlderVersion =
function() {
	var flashVersion = AjxPluginDetector.getFlashVersion();
    var majorVersion = flashVersion.split(',').shift();
    if (majorVersion < ZmFlashAudioPlayer.MINIMUM_FLASH_VERSION) {
        var dlg = appCtxt.getMsgDialog();
        dlg.reset();
        dlg.setMessage(ZmMsg.missingOrOldFlashPlugin, DwtMessageDialog.CRITICAL_STYLE);
        dlg.popup();
        return false;
    }
    return true;
};

/**
 * This creates a Flash player and moves it to Duration("du") column of the Voice Mail
 *
 * @param dwtPoint {DwtPoint} A DwtPoint with x & y co-ordinates that shows where to display this player
 * @param voicemail {ZmVoiceMail} A Voicemail object
 * @param autoPlay {Boolean} If <code>true</code>, automatically starts playing voicemail
 */
ZmFlashAudioPlayer.prototype.playAt =
function(dwtPoint, voicemail, autoPlay) {
    this._embedPlayer(voicemail.soundUrl, autoPlay);
    var el = this.getHtmlElement();
    el.style.position = "absolute";
    el.style.zIndex = "300";
    Dwt.setLocation(el, dwtPoint.x, dwtPoint.y);
};

ZmFlashAudioPlayer.prototype.hide =
function() {
    this.getHtmlElement().innerHTML = "";
    this.getHtmlElement().style.zIndex = "100";
};

ZmFlashAudioPlayer.prototype._embedPlayer =
function(soundUrl, autoPlay) {
    if (!soundUrl) {
        return;
    }
    var autoPlayStr = autoPlay ? "&amp;autoplay=1": "";
    var html = ["<object id= 'zm_flash_player' type=\"application/x-shockwave-flash\" ",
    "data=" + appContextPath + "/public/flash/player_mp3_maxi.swf ",
    "width=\"200\" height=\"17\">",
    "<param name=\"movie\" ",
    "value=" + appContextPath + "\"/public/flash/player_mp3_maxi.swf\" />",
    "<param name=\"bgcolor\" value=\"#ffffff\" />",
    "<param name=\"FlashVars\" value=\"mp3=",
    AjxStringUtil.urlComponentEncode(soundUrl),
    , "&amp;showvolume=1&amp;height=17",
    autoPlayStr,
    "\" />",
    "</object>"];

    this.getHtmlElement().innerHTML = html.join("");
};
}

if (AjxPackage.define("zimbraMail.voicemail.view.ZmVoiceListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmVoiceListView = function(params) {

	if (arguments.length == 0) { return; }
	
	params.pageless = true;
	ZmListView.call(this, params);

	this._contactToItem = {}; // Map of contact ids to the items we draw them in.

	var contactList = AjxDispatcher.run("GetContacts");
	if (contactList) {
		contactList.addChangeListener(new AjxListener(this, this._contactsChangeListener));
	}
};


ZmVoiceListView.prototype = new ZmListView;
ZmVoiceListView.prototype.constructor = ZmVoiceListView;

ZmVoiceListView.prototype.toString = function() {
	return "ZmVoiceListView";
};

ZmVoiceListView.PHONE_FIELDS_LABEL = { };
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_callbackPhone] = ZmMsg.phoneLabelCallback;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_carPhone] = ZmMsg.phoneLabelCar;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_assistantPhone] = ZmMsg.phoneLabelAssistant;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_companyPhone] = ZmMsg.phoneLabelCompany;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_homeFax] = ZmMsg.phoneLabelHomeFax;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_homePhone] = ZmMsg.phoneLabelHome;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_homePhone2] = ZmMsg.phoneLabelHome2;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_mobilePhone] = ZmMsg.phoneLabelMobile;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_otherPhone] = ZmMsg.phoneLabelHomeAlternate;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_workPhone] = ZmMsg.phoneLabelWork;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_workPhone2] = ZmMsg.phoneLabelWork2;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_otherFax] = ZmMsg.AB_FIELD_otherFax;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_workAltPhone] = ZmMsg.AB_FIELD_workAltPhone;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_workFax] = ZmMsg.AB_FIELD_workFax;
ZmVoiceListView.PHONE_FIELDS_LABEL[ZmContact.F_workMobile] = ZmMsg.AB_FIELD_workMobile;

ZmVoiceListView.F_DATE = ZmItem.F_DATE;
ZmVoiceListView.F_CALLER = "cl";
ZmVoiceListView.F_DURATION = "du";

ZmVoiceListView.prototype.getTitle =
function() {
	var text = this._folder ? this._folder.getName(false, 0, true) : ZmMsg.voice;
	return [ZmMsg.zimbraTitle, text].join(": ");
};

ZmVoiceListView.prototype.setFolder =
function(folder) {
	this._folder = folder;	
};

// Returns whichever calling party is shown in the view for the given item.
ZmVoiceListView.prototype.getCallingParty =
function(item) {
	var type = this._getCallType() == ZmVoiceFolder.PLACED_CALL ? 
		ZmVoiceItem.TO : ZmVoiceItem.FROM;
	return item.getCallingParty(type);
};

ZmVoiceListView.prototype._getCallType =
function() {
	return this._folder ? this._folder.callType : ZmVoiceFolder.VOICEMAIL;
};

ZmVoiceListView.prototype.set =
function(list, sortField) {
	ZmListView.prototype.set.call(this, list, sortField);
	var contactList = AjxDispatcher.run("GetContacts");
	if (contactList && !contactList.isLoaded) {
		this._contactsLoadedCallbackObj = this._contactsLoadedCallbackObj || new AjxCallback(this, this._contactsLoadedCallback);
		contactList.addLoadedCallback(this._contactsLoadedCallbackObj);
	}
};

ZmVoiceListView.prototype._contactsLoadedCallback =
function() {
	var list = this.getList();
	if (list) {
		var array = list.getArray();
		for (var i = 0, count = array.length; i < count; i++) {
			var item = array[i];
			var element = this._getElement(item, ZmVoiceListView.F_CALLER);
			element.innerHTML = this._getCallerNameHtml(item);
		}
	}
	delete this._contactsLoadedCallbackObj;
};

ZmVoiceListView.prototype._getRowClass =
function(voicemail, params) {
	return voicemail.isUnheard ? "Unread" : "";
};

ZmVoiceListView.prototype._getCellId =
function(item, field) {
	if (field == ZmVoiceListView.F_CALLER) {
		return this._getFieldId(item, field);
	} else {
		return ZmListView.prototype._getCellId.apply(this, arguments);
	}
};

ZmVoiceListView.prototype._getCellContents =
function(htmlArr, idx, voicemail, field, colIdx, params) {
	if (field == ZmVoiceListView.F_CALLER) {
		htmlArr[idx++] = this._getCallerNameHtml(voicemail);
	} else if (field == ZmVoiceListView.F_DATE) {
		params.now = params.now || new Date();
		htmlArr[idx++] = AjxDateUtil.computeWordyDateStr(params.now, voicemail.date);
	} else {
		idx = ZmListView.prototype._getCellContents.call(this, htmlArr, idx, voicemail, field, colIdx, params); 
	}
	
	return idx;
};

ZmVoiceListView.prototype._getCallerNameHtml =
function(voicemail) {
	var callingParty = this.getCallingParty(voicemail);

	// Check if the calling party's number is in the contact list.
	var contactList = AjxDispatcher.run("GetContacts");
	var data = contactList ? contactList.getContactByPhone(callingParty.name) : null;
	var fileAs = data ? data.contact.getFileAs() : null;
	if (fileAs) {
		this._addToContactMap(data.contact, voicemail);
		voicemail.participants.getArray()[0] = data.contact;
		ZmVoiceListView._callerFormat = ZmVoiceListView._callerFormat || new AjxMessageFormat(ZmMsg.callingPartyFormat);
		var args = [
			AjxStringUtil.htmlEncode(fileAs),
			ZmVoiceListView.PHONE_FIELDS_LABEL[data.field],
			this._getCallerHtml(voicemail)
		];
		return ZmVoiceListView._callerFormat.format(args);
	}

	// Check if the calling party has callerId info.
	if (callingParty.callerId) {
		ZmVoiceListView._callerIdFormat = ZmVoiceListView._callerIdFormat || new AjxMessageFormat(ZmMsg.callingPartyCallerIdFormat);
		var args = [
			AjxStringUtil.htmlEncode(callingParty.callerId),
			this._getCallerHtml(voicemail)
		];
		return ZmVoiceListView._callerIdFormat.format(args);
	}
	return this._getCallerHtml(voicemail);
};

ZmVoiceListView.prototype._addToContactMap =
function(contact, voicemail) {
	var items = this._contactToItem[contact.id];
	if (!items) {
		this._contactToItem[contact.id] = [voicemail];
	} else {
		var found = false;
		for(var i = 0, count = items.length; i < count; i++) {
			if (items[i] == voicemail) {
				found = true;
				break;
			}
		}
		if (!found) {
			items.push(voicemail);
		}
	}
};

ZmVoiceListView.prototype._getCallerHtml =
function(voicemail) {
	var callingParty = this.getCallingParty(voicemail);
	var display = callingParty.getDisplay();
	return AjxStringUtil.htmlEncode(display);
};

ZmVoiceListView.prototype.removeItem =
function(item, skipNotify) {
	ZmListView.prototype.removeItem.call(this, item, skipNotify);
	
	var contact = item.participants.getArray()[0];
	if (contact) {
		item.participants.removeAll();
		var items = this._contactToItem[contact.id];
		for(var i = 0, count = items.length; i < count; i++) {
			if (items[i] == item) {
				items.splice(i,1);
				break;
			}
		}
	}
};

ZmVoiceListView.prototype.removeAll =
function(skipNotify) {
	this._contactToItem = {};
	ZmListView.prototype.removeAll.call(this, skipNotify);
};

ZmVoiceListView.prototype.getReplenishThreshold =
function() {
	return 0;
};

ZmVoiceListView.prototype.setBounds =
function(x, y, width, height) {
	ZmListView.prototype.setBounds.call(this, x, y, width, height);
	this._resetColWidth();
};

ZmVoiceListView.prototype._resetList =
function() {
	this._contactToItem = {};
	ZmListView.prototype._resetList.call(this);
};

ZmVoiceListView.prototype._contactsChangeListener =
function(ev) {
	// The implementation of this method just redraws the entire list when any
	// contact in the view changes. This is a little brute-force-ish. I tried
	// just redrawing individual items, but because of reconnecting the sound
	// players and all the styles that are set on each item, it seemed like I
	// was going to end up with an unmaintainable mess. So redraw everything...
	var redraw = false;
	if ((ev.event == ZmEvent.E_MODIFY) || (ev.event == ZmEvent.E_DELETE)) {
		var contacts = ev.getDetails().items;
		if (contacts) {
			redraw = true;
			if (ev.event == ZmEvent.E_DELETE) {
				for(var i = 0, count = contacts.length; i < count; i++) {
					var contact = contacts[i];
					var items = this._contactToItem[contact.id];
					if (items) {
						for(var j = 0; j < items.length; j++) {
							items[j].participants.removeAll();
						}
						delete this._contactToItem[contact.id];
					}
				}
			}
		}
	} else if (ev.event == ZmEvent.E_CREATE) {
		var contacts = ev.getDetails().items;
		if (contacts) {
			redraw = true;
		}
	}
	if (redraw) {
		this.setUI();
	}
};

ZmVoiceListView.prototype._sortColumn =
function(columnItem, bSortAsc) {
	var sortBy;
	switch (columnItem._sortable) {
		case ZmVoiceListView.F_DURATION: sortBy = bSortAsc ? ZmSearch.DURATION_ASC : ZmSearch.DURATION_DESC; break;
		case ZmVoiceListView.F_DATE: sortBy = bSortAsc ? ZmSearch.DATE_ASC : ZmSearch.DATE_DESC; break;
		default: break;
	}
	appCtxt.getApp(ZmApp.VOICE).search(this._controller._folder, null, sortBy)
	appCtxt.set(ZmSetting.SORTING_PREF, sortBy, this.view);
};

}
if (AjxPackage.define("zimbraMail.voicemail.view.ZmCallListView")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmCallListView = function(parent, controller, dropTgt) {
	var headerList = this._getHeaderList();
	ZmVoiceListView.call(this, {parent:parent, posStyle:Dwt.ABSOLUTE_STYLE,
								view:ZmId.VIEW_CALL_LIST, type:ZmItem.CALL, controller:controller,
								headerList:headerList, dropTgt:dropTgt});
}
ZmCallListView.prototype = new ZmVoiceListView;
ZmCallListView.prototype.constructor = ZmCallListView;

ZmCallListView.prototype.toString = function() {
	return "ZmCallListView";
};

ZmCallListView.FROM_WIDTH = ZmMsg.COLUMN_WIDTH_FROM_CALL;
ZmCallListView.DURATION_WIDTH = null; // Auto
ZmCallListView.DATE_WIDTH = ZmMsg.COLUMN_WIDTH_DATE_CALL;

ZmCallListView.prototype.createHeaderHtml = 
function(defaultColumnSort) {
	ZmVoiceListView.prototype.createHeaderHtml.call(this, defaultColumnSort);
	var isPlaced = this._getCallType() == ZmVoiceFolder.PLACED_CALL;
	this._setColumnHeader(ZmVoiceListView.F_CALLER, isPlaced ? ZmMsg.to : ZmMsg.from);
	this._setColumnHeader(ZmVoiceListView.F_DATE, isPlaced ? ZmMsg.timePlaced : ZmMsg.received);
};

ZmCallListView.prototype._setColumnHeader = 
function(fieldId, label) {
	var headerCol = this._headerHash[fieldId];
	var index = headerCol._index;
	var fromColSpan = document.getElementById(DwtId.getListViewHdrId(DwtId.WIDGET_HDR_LABEL, this._view, headerCol._field));
	if (fromColSpan) {
		fromColSpan.innerHTML = "&nbsp;" + label;
	}
	if (this._colHeaderActionMenu && !AjxUtil.isUndefined(index)) this._colHeaderActionMenu.getItem(index).setText(label);
};

ZmCallListView.prototype._getHeaderList =
function() {

	var headerList = [];
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_CALLER, text:ZmMsg.from, width:ZmCallListView.FROM_WIDTH, resizeable:true}));
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_DURATION, text:ZmMsg.duration, width:ZmCallListView.DURATION_WIDTH, sortable:ZmVoiceListView.F_DURATION, resizeable:true}));
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_DATE, text:ZmMsg.received, width:ZmCallListView.DATE_WIDTH, sortable:ZmVoiceListView.F_DATE, resizeable:true}));

	return headerList;
};

ZmCallListView.prototype._getCellContents =
function(htmlArr, idx, voicemail, field, colIdx, params) {
	if (field == ZmVoiceListView.F_DURATION) {
		htmlArr[idx++] = AjxDateUtil.computeDuration(voicemail.duration);
	} else {
		idx = ZmVoiceListView.prototype._getCellContents.apply(this, arguments);
	}
	
	return idx;
};

ZmCallListView.prototype._getHeaderToolTip =
function(prefix) {
	if (prefix == ZmVoiceListView.F_CALLER) {
		var isPlaced = this._getCallType() == ZmVoiceFolder.PLACED_CALL;
		return isPlaced ? ZmMsg.to : ZmMsg.from;
	} else if (prefix == ZmVoiceListView.F_DURATION) {
		return ZmMsg.sortByDuration;
	} else if (prefix == ZmVoiceListView.F_DATE) {
		return this._getCallType() == ZmVoiceFolder.PLACED_CALL ? ZmMsg.sortByTimePlaced : ZmMsg.sortByReceived;
	}
	return null;
};

ZmCallListView.prototype._getItemTooltip =
function(call) {
	var location;
	var party = this.getCallingParty(call);
	if (party.city && party.state && party.country) {
		if (!this._locationFormatterCityStateCountry) {
			this._locationFormatterCityStateCountry = new AjxMessageFormat(ZmMsg.locationFormatCityStateCountry);
		}
		location = this._locationFormatterCityStateCountry.format([party.city, party.state, party.country]);
	} else 	if (party.city && party.country) {
		if (!this._locationFormatterCityCountry) {
			this._locationFormatterCityCountry = new AjxMessageFormat(ZmMsg.locationFormatCityCountry);
		}
		location = this._locationFormatterCityCountry.format([party.city, party.country]);
	} else {
		location = ZmMsg.unknown;
	}
	var callerLabel = (this._getCallType() == ZmVoiceFolder.PLACED_CALL) ? ZmMsg.toLabel : ZmMsg.fromLabel;
	var data = { 
		image: "Img" + this._controller._folder.getIcon(), 
		callerLabel: callerLabel, 
		caller: this._getCallerHtml(call), 
		duration: AjxDateUtil.computeDuration(call.duration),
		date: AjxDateUtil.computeDateTimeString(call.date),
		location: location
	};
	var html = AjxTemplate.expand("voicemail.Voicemail#CallTooltip", data);
	return html;
};

ZmCallListView.prototype._getNoResultsMessage =
function() {
	return ZmMsg.noCallResults;
};


}

if (AjxPackage.define("zimbraMail.voicemail.view.ZmVoicemailListView")) {
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

ZmVoicemailListView = function(parent, controller, dropTgt) {
	if(!parent) {
		return;
	}
	var headerList = this._getHeaderList(parent);
	ZmVoiceListView.call(this, {parent:parent, className:"DwtListView ZmVoicemailListView",
								posStyle:Dwt.ABSOLUTE_STYLE, view:ZmId.VIEW_VOICEMAIL,
								type:ZmItem.VOICEMAIL, controller:controller,
								headerList:headerList, dropTgt:dropTgt});

	this._playing = null;	// The voicemail currently loaded in the player.
	this._players = {}; 	// Map of voicemail.id to sound player
	this._soundChangeListeners = [];
	this._reconnect = null; // Structure to help reconnect a voicemail to the currently
							// playing sound when resorting or redraing the list.
}
ZmVoicemailListView.prototype = new ZmVoiceListView;
ZmVoicemailListView.prototype.constructor = ZmVoicemailListView;

ZmVoicemailListView.prototype.toString =
function() {
	return "ZmVoicemailListView";
};

ZmVoicemailListView.FROM_WIDTH		= ZmMsg.COLUMN_WIDTH_FROM_CALL;
ZmVoicemailListView.PLAYING_WIDTH	= null; // Auto
ZmVoicemailListView.DATE_WIDTH		= ZmMsg.COLUMN_WIDTH_DATE_CALL;

ZmVoicemailListView.prototype.setPlaying =
function(voicemail) {
	var player = this._players[voicemail.id];
	if (player) {
		player.play();
	}
};	

ZmVoicemailListView.prototype.getPlaying =
function() {
	return this._playing;
};

ZmVoicemailListView.prototype.addSoundChangeListener =
function(listener) {
	this._soundChangeListeners.push(listener);
};

ZmVoicemailListView.prototype.markUIAsRead =
function(items, on) {
	var className = on ? "" : "Unread";
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var row = this._getElement(item, ZmItem.F_ITEM_ROW);
		if (row) {
			row.className = className;
		}
	}
};

ZmVoicemailListView.prototype.stopPlaying =
function(compact) {
	if (this._playing) {
		var player = this._players[this._playing.id];
		if (compact) {
			player.setCompact(true);
		}
		player.stop();
	}
};

ZmVoicemailListView.prototype._getHeaderList =
function(parent) {
	var headerList = [];

	if (appCtxt.get(ZmSetting.SHOW_SELECTION_CHECKBOX)) {
		headerList.push(new DwtListHeaderItem({field:ZmItem.F_SELECTION, icon:"CheckboxUnchecked", width:ZmListView.COL_WIDTH_ICON, name:ZmMsg.selection}));
	}
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_CALLER, text:ZmMsg.from, width:ZmVoicemailListView.FROM_WIDTH, resizeable:true}));
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_DURATION, text:ZmMsg.message, width:ZmVoicemailListView.PLAYING_WIDTH, sortable:ZmVoiceListView.F_DURATION, resizeable:true}));
	headerList.push(new DwtListHeaderItem({field:ZmVoiceListView.F_DATE, text:ZmMsg.received, width:ZmVoicemailListView.DATE_WIDTH, sortable:ZmVoiceListView.F_DATE, resizeable:true}));

	return headerList;
};

ZmVoicemailListView.prototype._getCellId =
function(item, field) {
	if (field == ZmVoiceListView.F_DURATION) {
		return this._getFieldId(item, field);
	} else {
		return ZmVoiceListView.prototype._getCellId.apply(this, arguments);
	}
};

ZmVoicemailListView.prototype._getCellContents =
function(htmlArr, idx, voicemail, field, colIdx, params) {
	if (field == ZmVoiceListView.F_DURATION) {
		// No-op. This is handled in _addRow()
	} else {
		idx = ZmVoiceListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};

ZmVoicemailListView.prototype.removeItem =
function(item, skipNotify) {
	ZmVoiceListView.prototype.removeItem.call(this, item, skipNotify);
	var player = this._players[item.id];
	if (player) {
		player.dispose();
	}
	if (this._playing == item) {
		this._playing = null;
	}
	delete this._players[item.id];
};

ZmVoicemailListView.prototype.set =
function(list, sortField) {
	ZmVoiceListView.prototype.set.call(this, list, sortField);

	// If we were unable to reconnect the player, dispose it.
	if (this._reconnect) {
		this._reconnect.player.dispose();
		this._reconnect = null;
	}
};

ZmVoicemailListView.prototype.removeAll =
function(skipNotify) {
	this._clearPlayers();
	ZmVoiceListView.prototype.removeAll.call(this, skipNotify);
};

ZmVoicemailListView.prototype._getNoResultsMessage =
function() {
	return this._folder && !this._folder.phone.hasVoiceMail ? ZmMsg.noVoiceMail : AjxMsg.noResults;
};

ZmVoicemailListView.prototype._resetList =
function() {
	this._clearPlayers();
	ZmVoiceListView.prototype._resetList.call(this);
};

ZmVoicemailListView.prototype._clearPlayers =
function() {
	if (this._playing && !DwtSoundPlugin.isScriptingBroken()) { // Can't reuse the quicktime noscript player.
		// Save data to be able to reconnect to the player.
		this._reconnect = {
			id: this._playing.id,
			player: this._players[this._playing.id]
		};
		
		// Hide the player
		var hidden;
		if (!this._hiddenDivId) {
			hidden = document.createElement("div");
			this._hiddenDivId = Dwt.getNextId();
			hidden.id = this._hiddenDivId;
			Dwt.setZIndex(hidden, Dwt.Z_HIDDEN);
			this.shell.getHtmlElement().appendChild(hidden);
		} else {
			hidden = document.getElementById(this._hiddenDivId);
		}
		this._reconnect.player.reparentHtmlElement(hidden);
		
		// Remove this offscreen player from our player list.
		delete this._players[this._playing.id];
		this._playing = null;
	}
	for (var i in this._players) {
		this._players[i].dispose();
	}
	this._players = {};
};

ZmVoicemailListView.prototype._renderList =
function(list, noResultsOk, doAdd) {
	ZmVoiceListView.prototype._renderList.apply(this, arguments);

	if (list && !doAdd) {
		for (var i = 0, count = list.size(); i < count; i++) {
			var voicemail = list.get(i);
			var row = this._getElFromItem(voicemail);
			this._addPlayerToRow(row, voicemail);
		}
	}
};

ZmVoicemailListView.prototype._addPlayerToRow =
function(row, voicemail) {
	var list = this.getList();
	if (!list || !list.size()) {
		return;
	}
	if (this._getCallType() != ZmVoiceFolder.VOICEMAIL) {
		return;
	}
	
	var cell = this._getElement(voicemail, ZmVoiceListView.F_DURATION);
	
	var player;
	if (this._reconnect && (this._reconnect.id == voicemail.id)) {
		player = this._reconnect.player;
		this._reconnect = null;
		this._playing = voicemail;
	} else {
		player = new ZmSoundPlayer(this, voicemail);
		if (!this._compactListenerObj) {
			this._compactListenerObj = new AjxListener(this, this._compactListener);
		}
		player.addCompactListener(this._compactListenerObj);
		for (var i = 0, count = this._soundChangeListeners.length; i < count; i++) {
			player.addChangeListener(this._soundChangeListeners[i]);
		}
		if (player.isPluginMissing()) {
			if (!this._helpListenerObj) {
				this._helpListenerObj = new AjxListener(this, this._helpListener);
			}
			player.addHelpListener(this._helpListenerObj);
		}
	}
	player.reparentHtmlElement(cell);
	this._players[voicemail.id] = player;
};

ZmVoicemailListView.prototype._helpListener =
function(ev) {
	var dialog = appCtxt.getMsgDialog();
	var message = AjxEnv.isIE ? ZmMsg.missingPluginHelpIE : ZmMsg.missingPluginHelp;
	dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE);
	dialog.popup();
};

ZmVoicemailListView.prototype._compactListener =
function(ev) {
	if (!ev.isCompact) {
		this.stopPlaying(true);
		this._playing = ev.dwtObj.voicemail;
	} else if (this._playing && (ev.dwtObj == this._players[this._playing.id])){
		this._playing = null;
	}
};

ZmVoicemailListView.prototype._getHeaderToolTip =
function(prefix) {
	switch (prefix) {
		case ZmVoiceListView.F_CALLER:			return ZmMsg.from; break;
		case ZmVoiceListView.F_DURATION:		return ZmMsg.sortByDuration; break;
		case ZmVoiceListView.F_DATE:			return ZmMsg.sortByReceived; break;
	}
	return null;
};

ZmVoicemailListView.prototype._getItemTooltip =
function(voicemail) {
	var data = { 
		caller: this._getCallerHtml(voicemail), 
		duration: AjxDateUtil.computeDuration(voicemail.duration),
		date: AjxDateUtil.computeDateTimeString(voicemail.date)
	};
	return (AjxTemplate.expand("voicemail.Voicemail#VoicemailTooltip", data));
};
}
if (AjxPackage.define("zimbraMail.voicemail.view.ZmMP3VoicemailListView")) {
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

ZmMP3VoicemailListView = function(parent, controller, dropTgt) {
	ZmVoicemailListView.call(this, parent, controller, dropTgt);
	this.player = new ZmFlashAudioPlayer();
}

ZmMP3VoicemailListView.prototype = new ZmVoicemailListView;
ZmMP3VoicemailListView.prototype.constructor = ZmMP3VoicemailListView;

ZmMP3VoicemailListView.prototype.toString =
function() {
	return "ZmMP3VoicemailListView";
};

ZmMP3VoicemailListView.FROM_WIDTH		= ZmMsg.COLUMN_WIDTH_FROM_CALL;
ZmMP3VoicemailListView.PLAYING_WIDTH	= null; // Auto
ZmMP3VoicemailListView.DATE_WIDTH		= ZmMsg.COLUMN_WIDTH_DATE_CALL;


ZmMP3VoicemailListView.DURATION_SUFFIX = "_duration";

ZmMP3VoicemailListView._durationCellIds = [];


ZmMP3VoicemailListView.prototype._getCellContents =
function(htmlArr, idx, voicemail, field, colIdx, params) {
	if (field == ZmVoiceListView.F_DURATION) {
		htmlArr[idx++] = this._getDurationHtml(voicemail);
	} else {
		idx = ZmVoicemailListView.prototype._getCellContents.apply(this, arguments);
	}
	return idx;
};

ZmMP3VoicemailListView.prototype._renderList =
function(list, noResultsOk, doAdd) {
	ZmVoiceListView.prototype._renderList.apply(this, arguments);
};

ZmMP3VoicemailListView.prototype.displayPlayer =
function(ev) {
	if(!this.player.hasFlash) {
		return false;
	}
	var selection = this.getSelection();
	if (selection.length == 1) {
		var voicemail = selection[0];
		var row = this._getElement(voicemail, ZmItem.F_ITEM_ROW);
		var cellId = row.id.replace(ZmItem.F_ITEM_ROW, ZmVoiceListView.F_DURATION);
		var cell = document.getElementById(cellId);
		if(cell && (this.clickedOnPlayBtn(ev) || ev.detail == DwtListView.ITEM_DBL_CLICKED)) {
			this.player.playAt(Dwt.toWindow(cell), voicemail, true);
			this._hideDurationCell(voicemail.id);
			return true;
		}
	}
	return false;
};

ZmMP3VoicemailListView.prototype.clickedOnPlayBtn =
function(ev) {
		return ev && ev.target && ev.target.className == "ImgPlay" ? true : false;
};

ZmMP3VoicemailListView.prototype._hideDurationCell =
function(vId) {
	this._displayAllDurationCells();
	var durationFieldId = vId + ZmMP3VoicemailListView.DURATION_SUFFIX;
	var dObj = document.getElementById(durationFieldId);
	if(dObj) {
		dObj.style.display = "none";
	}
	ZmMP3VoicemailListView._durationCellIds[durationFieldId] = true;
};

ZmMP3VoicemailListView.prototype._displayAllDurationCells =
function() {
	for(var id in ZmMP3VoicemailListView._durationCellIds) {
		var dObj = document.getElementById(id);
		if(dObj) {
			dObj.style.display = "block";
		}
		delete ZmMP3VoicemailListView._durationCellIds[id];
	}
};

ZmMP3VoicemailListView.prototype._getNoResultsMessage =
function() {
	return this._folder && !this._folder.phone.hasVoiceMail ? ZmMsg.noVoiceMail : AjxMsg.noResults;
};

ZmMP3VoicemailListView.prototype._getDurationHtml =
function(voicemail) {
	var html = [];
	html.push("<table role='presentation' id='", voicemail.id, ZmMP3VoicemailListView.DURATION_SUFFIX, "'><tr><td>",AjxDateUtil.computeDuration(voicemail.duration, true), "</td><td><div class='ImgPlay'></div></td></tr></table>");
	return html.join("");
};

ZmMP3VoicemailListView.prototype.stopPlaying =
function() {
	this.player.hide();
	this._displayAllDurationCells();
};

ZmMP3VoicemailListView.prototype.removeItem =
function(item, skipNotify) {
	this.player.hide();
	ZmVoicemailListView.prototype.removeItem.call(this, item, skipNotify);
};
}

if (AjxPackage.define("zimbraMail.voicemail.view.ZmVoiceOverviewContainer")) {
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
 * Creates an overview container for the voice app.
 * @constructor
 * @class
 * Creates a header tree item for a phone number. For each phone, a ZmOverview 
 * is added as a child. 
 *
 * @author Parag Shah
 */
ZmVoiceOverviewContainer = function(params) {
	if (arguments.length == 0) { return; }

	params.className = "ZmVoiceOverviewContainer";
	ZmOverviewContainer.call(this, params);

	this.initialized = false;
};

ZmVoiceOverviewContainer.prototype = new ZmOverviewContainer;
ZmVoiceOverviewContainer.prototype.constructor = ZmVoiceOverviewContainer;


// Public methods

ZmVoiceOverviewContainer.prototype.toString = 
function() {
	return "ZmVoiceOverviewContainer";
};

ZmVoiceOverviewContainer.prototype.initialize =
function(params) {
	if (this.initialized) { return; }

	var deskPhone = false;
	var phones = params.phones;
	
	for (var i=0; i<phones.length; i++) {
		if (phones[i].phoneType == "DeskPhone") {
			deskPhone = phones[i];
		}
	}
	for (var i = 0; i < phones.length; i++) {
		var phone = phones[i];
		if(!phone.hasVoiceMail) {
			continue;
		}
		// create a top-level section header
		var headerLabel = deskPhone && deskPhone.name != phone.name ? deskPhone.getDisplay() : phone.getDisplay();
		var headerParams = {
			parent: this,
			text: headerLabel,
			className: "overviewHeader",
			imageInfo: "VoiceMailApp"
		};

		var header = this._headerItems[phone.id] = new DwtTreeItem(headerParams);
		header.setData(Dwt.KEY_ID, phone.id);
		header.setScrollStyle(Dwt.CLIP);
		header._initialize(null, true);

		// reset some params for child overviews
		var overviewId = appCtxt.getOverviewId([this.containerId, headerLabel].join(""));
		var overviewParams = {
			overviewId: overviewId,
			id: ZmId.getOverviewId(overviewId),
			parent: header,
			scroll: Dwt.CLIP,
			posStyle: Dwt.STATIC_STYLE,
			selectionSupported: true,
			actionSupported: true,
			dndSupported: true,
			showUnread: true
		};

		// next, create an overview for this account and add it to the account header
		var ov = this._controller._overview[overviewParams.overviewId] =
				 this._overview[overviewParams.overviewId] =
				 new ZmOverview(overviewParams, this._controller);

		ov.phone = ov.account = phone; // this is important! otherwise we can't differentiate overviews

		header._addItem(ov, null, true);
		header.addNodeIconListeners();
		header.setExpanded(true);

		// finally set treeviews for this overview
		ov.set(params.overviewTrees);
	}

	this.initialized = true;
};
}
if (AjxPackage.define("zimbraMail.voicemail.view.ZmVoiceTreeView")) {
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
* Creates an empty tree view.
* @constructor
* @class
* This class displays voicemail data in a tree structure. It overrides some of the rendering
* done in the base class, drawing the top-level account items as headers.
*
*/
ZmVoiceTreeView = function(params) {
	if (arguments.length == 0) return;

	params.headerClass = params.headerClass || "ZmVoiceTreeHeader";
	ZmTreeView.call(this, params);
};

ZmVoiceTreeView.prototype = new ZmTreeView;
ZmVoiceTreeView.prototype.constructor = ZmVoiceTreeView;

ZmTreeView.COMPARE_FUNC[ZmOrganizer.VOICE] = ZmVoiceFolder.sortCompare;

// Public methods

ZmVoiceTreeView.prototype.toString = 
function() {
	return "ZmVoiceTreeView";
};

// Creates a tree item for the organizer, and recurslively renders its children.
ZmVoiceTreeView.prototype._addNew =
function(parentNode, organizer, index) {
	if (organizer.callType == ZmVoiceFolder.ACCOUNT) {
		var item = this._createAccountItem(organizer, organizer.getName());
		this._render({treeNode:item, organizer:organizer});
	} else {
		ZmTreeView.prototype._addNew.call(this, parentNode, organizer, index);
	}
};

ZmVoiceTreeView.prototype._createAccountItem =
function(organizer) {
	var item = new DwtTreeItem({parent:this, className:"overviewHeader"});
	item.enableSelection(false);
	item.showExpansionIcon(false);
	item.setData(Dwt.KEY_ID, organizer.id);
	item.setData(Dwt.KEY_OBJECT, organizer);
	item.setData(ZmTreeView.KEY_ID, this.overviewId);
	item.setData(ZmTreeView.KEY_TYPE, this.type);

	this._treeItemHash[organizer.id] = item;
	return item;
};
}

if (AjxPackage.define("zimbraMail.voicemail.controller.ZmVoiceListController")) {
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
 * 
 * @param {DwtControl}					container					the containing shell
 * @param {ZmApp}						app							the containing application
 * @param {constant}					type						type of controller
 * @param {string}						sessionId					the session id
 * @param {ZmSearchResultsController}	searchResultsController		containing controller
 * 
 * @extends		ZmListController
 */
ZmVoiceListController = function(container, app, type, sessionId, searchResultsController) {
	if (arguments.length == 0) { return; }
	ZmListController.apply(this, arguments);

	this._folder = null;
}
ZmVoiceListController.prototype = new ZmListController;
ZmVoiceListController.prototype.constructor = ZmVoiceListController;

ZmVoiceListController.prototype.isZmVoiceListController = true;
ZmVoiceListController.prototype.toString = function() { return "ZmVoiceListController"; };

/**
* Displays the given search results.
*
* @param search		search results (which should contain a list of conversations)
* @param folder		The folder being shown
*/
ZmVoiceListController.prototype.show =
function(searchResult, folder) {
	this._folder = folder;
	ZmListController.prototype.show.call(this, searchResult);
	if (searchResult) {
		this.setList(searchResult.getResults(folder.getSearchType()));
		this._list.setHasMore(searchResult.getAttribute("more"));
	}
	else {
		this._list = null;
	}
	this._setup(this._currentViewId);

	var lv = this._listView[this._currentViewId];
	if (lv && this._activeSearch) {
		lv.offset = parseInt(this._activeSearch.getAttribute("offset"));
    }
	var elements = this.getViewElements(this._currentViewId, lv);
	
    this._setView({	view:		this._currentViewId,
					viewType:	this._currentViewType,
					elements:	elements,
					isAppView:	true});
    this._resetNavToolBarButtons();
};

ZmVoiceListController.prototype.getFolder =
function() {
	return this._folder;
};

ZmVoiceListController.prototype.setFolder =
function(folder, skipSearch) {
	if (!skipSearch && this._folder && this._folder != folder) {
		this._app.search(folder);
	}
	this._folder = folder;
}

ZmVoiceListController.prototype._setViewContents =
function(viewId) {
	var view = this._listView[viewId];
	view.setFolder(this._folder);	
	view.set(this._list, ZmItem.F_DATE);
};

ZmVoiceListController.prototype._participantOps =
function() {
	return [ZmOperation.CONTACT];
};

ZmVoiceListController.prototype._initializeToolBar =
function(view) {
	if (!this._toolbar[view]) {
		ZmListController.prototype._initializeToolBar.call(this, view);
		this._toolbar[view].addFiller();
		this._toolbar[view].addOp(ZmOperation.FILLER);
		this._initializeNavToolBar(view);
	};
};

ZmVoiceListController.prototype._initializeNavToolBar =
function(view) {
	this._itemCountText[view] = this._toolbar[view].getButton(ZmOperation.TEXT);
};

ZmVoiceListController.prototype._getView = 
function() {
	return this._listView[this._currentViewId];
};

ZmVoiceListController.prototype._getToolbar = 
function() {
	return this._toolbar[this._currentViewId]
};

ZmVoiceListController.prototype._getMoreSearchParams =
function(params) {
	params.soapInfo = appCtxt.getApp(ZmApp.VOICE).soapInfo;
};

ZmVoiceListController.prototype._createNewContact =
function(ev) {
	var item = ev.item;
	var contact = new ZmContact(null);
	contact.initFromPhone(this._getView().getCallingParty(item).getDisplay(), ZmContact.F_homePhone);
	return contact;
};

ZmVoiceListController.prototype._callbackListener =
function() {
	var view = this._getView();
	var sel = view.getSelection();
	if((sel instanceof Array) && sel.length >= 1) {
		var partyType = view._getCallType() == ZmVoiceFolder.PLACED_CALL ? ZmVoiceItem.TO : ZmVoiceItem.FROM;
		this._app.displayClickToCallDlg(sel[0].getCallingParty(partyType).name);
	}
};

ZmVoiceListController.prototype._printListener =
function(ev) {
	var url;
	var v = this._getView();

	var query = {
		relative: true,
		qsArgs: {
			sq: ['phone:', v._folder.phone.name, ' in:"', v._folder.name, '"'].join(''),
			clientTime: 1
		}
	};

	if (v.view == ZmId.VIEW_VOICEMAIL) {
		query.path = "/h/printvoicemails";
		query.qsArgs.st = "voicemail";
		query.qsArgs.sl = this._activeSearch.getResults("VOICEMAIL").folder.numTotal || this._activeSearch.getResults("VOICEMAIL").size();
	} else if (v.view == ZmId.VIEW_CALL_LIST) {
		query.path = "/h/printcalls";
		query.qsArgs.st = "calllog";
		query.qsArgs.sl = this._activeSearch.getResults("CALL").folder.numTotal || this._activeSearch.getResults("CALL").size();
	}
	url = AjxUtil.formatUrl(query);

	if (url) {
		window.open(appContextPath+AjxStringUtil.urlEncode(url), "_blank");
	}
};

ZmVoiceListController.prototype._handleResponseLaunchPrefs =
function() {
    var app = appCtxt.getAppController().getApp(ZmApp.PREFERENCES);
    var view = app.getPrefController().getPrefsView();
    view.selectSection("VOICE");
};

ZmVoiceListController.prototype._listActionListener =
function(ev) {
	ZmListController.prototype._listActionListener.call(this, ev);

	var view = ev.dwtObj;
	var isParticipant = ev.field == ZmItem.F_PARTICIPANT;
	var actionMenu = this.getActionMenu();
	var item = ev.item;
	
	// Update the add/edit contact item.
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		var contact = item.participants ? item.participants.getArray()[0] : null;
		var newOp = contact ? ZmOperation.EDIT_CONTACT : ZmOperation.NEW_CONTACT;
		var newText = contact? null : ZmMsg.AB_ADD_CONTACT;
		ZmOperation.setOperation(actionMenu, ZmOperation.CONTACT, newOp, newText);
		var contacts = AjxDispatcher.run("GetContacts");
		this._actionEv.contact = contact;
		this._setContactText(contact);
	}

	actionMenu.popup(0, ev.docX, ev.docY);
};
}
if (AjxPackage.define("zimbraMail.voicemail.controller.ZmCallListController")) {
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

ZmCallListController = function(container, app) {
	if (arguments.length == 0) { return; }
	
	ZmVoiceListController.call(this, container, app);
	this._listeners[ZmOperation.CALL_BACK]	= this._callbackListener.bind(this);
}

ZmCallListController.prototype = new ZmVoiceListController;
ZmCallListController.prototype.constructor = ZmCallListController;

ZmCallListController.prototype.isZmCallListController = true;
ZmCallListController.prototype.toString = function() { return "ZmCallListController"; };

ZmCallListController.getDefaultViewType =
function() {
	return ZmId.VIEW_CALL_LIST;
};
ZmCallListController.prototype.getDefaultViewType = ZmCallListController.getDefaultViewType;

ZmCallListController.prototype._createNewView = 
function(view) {
	return new ZmCallListView(this._container, this);
};

ZmCallListController.prototype._getToolBarOps =
function() {
	var list = [];
    list.push(ZmOperation.CALL_BACK);
    list.push(ZmOperation.SEP);
	list.push(ZmOperation.PRINT);
	return list;
};

ZmCallListController.prototype._getActionMenuOps =
function() {
	var list = [];
    list.push(ZmOperation.CALL_BACK);
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		list.push(ZmOperation.CONTACT);
	}
    list.push(ZmOperation.SEP);
	list.push(ZmOperation.PRINT);
	return list;
};

ZmCallListController.prototype._initializeToolBar =
function(view) {
	ZmVoiceListController.prototype._initializeToolBar.call(this, view);
	this._toolbar[view].getButton(ZmOperation.PRINT).setToolTipContent(ZmMsg.printCallTooltip)
};

ZmCallListController.prototype._resetOperations = 
function(parent, num) {
	ZmVoiceListController.prototype._resetOperations.call(this, parent, num);
	if (parent) {
		parent.enableAll(true);
	}
	var list = this.getList();
	parent.enable(ZmOperation.PRINT, list && list.size());
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		parent.enable(ZmOperation.CONTACT, num == 1);
	}
};

ZmCallListController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_CALL;
};

ZmCallListController.prototype.handleKeyAction =
function(actionCode) {
	switch (actionCode) {
		case ZmKeyMap.PRINT:
			this._printListener();
			break;
		default:
			return ZmVoiceListController.prototype.handleKeyAction.call(this, actionCode);
	}
	return true;
};


}
if (AjxPackage.define("zimbraMail.voicemail.controller.ZmVoicemailListController")) {
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

ZmVoicemailListController = function(container, app) {
	if (arguments.length == 0) { return; }
	ZmVoiceListController.call(this, container, app);

	this._listeners[ZmOperation.CALL_BACK]	= this._callbackListener.bind(this);
	this._listeners[ZmOperation.DELETE]	= this._deleteListener.bind(this);
	this._listeners[ZmOperation.DOWNLOAD_VOICEMAIL]	= this._downloadListener.bind(this);
	this._listeners[ZmOperation.REPLY_BY_EMAIL]		= this._replyListener.bind(this);
	this._listeners[ZmOperation.FORWARD_BY_EMAIL]	= this._forwardListener.bind(this);
	this._listeners[ZmOperation.MARK_HEARD]			= this._markHeardListener.bind(this);
	this._listeners[ZmOperation.MARK_UNHEARD]		= this._markUnheardListener.bind(this);

	if (this.supportsDnD()) {
		this._dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		this._dragSrc.addDragListener(this._dragListener.bind(this));
	}

	this._markingHeard = {}; // Prevents repeated markHeard requests during playback.
}
ZmVoicemailListController.prototype = new ZmVoiceListController;
ZmVoicemailListController.prototype.constructor = ZmVoicemailListController;

ZmVoicemailListController.prototype.isZmVoicemailListController = true;
ZmVoicemailListController.prototype.toString = function() {	return "ZmVoicemailListController"; };

ZmVoicemailListController.getDefaultViewType =
function() {
	return ZmId.VIEW_VOICEMAIL;
};
ZmVoicemailListController.prototype.getDefaultViewType = ZmVoicemailListController.getDefaultViewType;

ZmVoicemailListController.prototype.show =
function(searchResult, folder) {
	if (this._folder && (folder != this._folder)) {
		this._getView().stopPlaying(true);
	}
	this._markingHeard = {};
	ZmVoiceListController.prototype.show.call(this, searchResult, folder)
};

ZmVoicemailListController.prototype._createNewView = 
function(view) {
	var result;
	if (ZmVoiceApp.audioType == ZmVoiceApp.AUDIO_MP3_FORMAT) {
		result = new ZmMP3VoicemailListView(this._container, this, this._dropTgt);
	} else {
		result = new ZmVoicemailListView(this._container, this, this._dropTgt);
	}
	result.addSelectionListener(this._selectListener.bind(this));
	if (this._dragSrc) {
		result.setDragSource(this._dragSrc);
	}
	result.addSoundChangeListener(this._soundChangeListener.bind(this));
	return result;
};

ZmVoicemailListController.prototype._getToolBarOps =
function() {
	var list = [];
	list.push(ZmOperation.CALL_BACK);
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.DELETE);
	list.push(ZmOperation.PRINT);
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.REPLY_BY_EMAIL);
	list.push(ZmOperation.FORWARD_BY_EMAIL);
    list.push(ZmOperation.SEP);
    list.push(ZmOperation.DOWNLOAD_VOICEMAIL);
	return list;
};

ZmVoicemailListController.prototype._getActionMenuOps =
function() {
	var list = []
	list.push(ZmOperation.CALL_BACK);
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		list.push(ZmOperation.CONTACT);
	}
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.MARK_HEARD);
	list.push(ZmOperation.MARK_UNHEARD);
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.REPLY_BY_EMAIL);
	list.push(ZmOperation.FORWARD_BY_EMAIL);
	list.push(ZmOperation.SEP);
	list.push(ZmOperation.DOWNLOAD_VOICEMAIL);
	list.push(ZmOperation.DELETE);
	list.push(ZmOperation.DELETE_WITHOUT_SHORTCUT);
	return list;
};

ZmVoicemailListController.prototype._initializeToolBar =
function(view) {
	ZmVoiceListController.prototype._initializeToolBar.call(this, view);

	this._toolbar[view].getButton(ZmOperation.PRINT).setToolTipContent(ZmMsg.printVoicemailTooltip)
};

ZmVoicemailListController.prototype._resetOperations = 
function(parent, num) {
	ZmVoiceListController.prototype._resetOperations.call(this, parent, num);

	var isTrash = this._folder && (this._folder.callType == ZmVoiceFolder.TRASH);
	if (isTrash) {
		parent.enableAll(false);
		if (parent instanceof DwtMenu) {
			ZmOperation.setOperation(parent, ZmOperation.DELETE_WITHOUT_SHORTCUT, ZmOperation.DELETE_WITHOUT_SHORTCUT, ZmMsg.moveToVoiceMail, "MoveToFolder");
			parent.enable(ZmOperation.DELETE_WITHOUT_SHORTCUT, true);
			parent.setItemVisible(ZmOperation.DELETE_WITHOUT_SHORTCUT, true);
			parent.setItemVisible(ZmOperation.DELETE, false);
		} else {
			if(ZmVoiceApp.hasTrashFolder) {
				parent.enable(ZmOperation.DELETE, false);
			}
		}
	}

	parent.enable(ZmOperation.CHECK_VOICEMAIL, true);

	if (!isTrash) {
		var list = this.getList();
		parent.enable(ZmOperation.PRINT, list && list.size());

		var hasHeard = false,
			hasUnheard = false;
		var items = this._listView[this._currentViewId].getSelection();
		for (var i = 0; i < items.length; i++) {
			(items[i].isUnheard) ? hasUnheard = true : hasHeard = true;
			if (hasUnheard && hasHeard) {
				break;
			}
		}
		parent.enable(ZmOperation.MARK_HEARD, hasUnheard);
		parent.enable(ZmOperation.MARK_UNHEARD, hasHeard && !this._isUnReadOpDisabled());

		parent.enable(ZmOperation.DOWNLOAD_VOICEMAIL, (num == 1));

		if (!appCtxt.get(ZmSetting.MAIL_ENABLED)) {
			parent.enable(ZmOperation.REPLY_BY_EMAIL, false);
			parent.enable(ZmOperation.FORWARD_BY_EMAIL, false);
		}

		if (parent instanceof DwtMenu) {
			ZmOperation.setOperation(parent, ZmOperation.DELETE, ZmOperation.DELETE, ZmMsg.del, "Delete");
			parent.setItemVisible(ZmOperation.DELETE, true);
			parent.setItemVisible(ZmOperation.DELETE_WITHOUT_SHORTCUT, false);
		}
	}
};
ZmVoicemailListController.prototype._isUnReadOpDisabled =
function(){
    var voiceApp = appCtxt.getApp(ZmApp.VOICE);
    var UCProvider = voiceApp._UCProvider;
    return UCProvider.disableUnreadOp && UCProvider.disableUnreadOp();
};

ZmVoicemailListController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_VOICEMAIL;
};

ZmVoicemailListController.prototype.handleKeyAction =
function(actionCode) {
	var view = this._getView();
	var num = view.getSelectionCount();
	switch (actionCode) {
		case ZmKeyMap.DOWNLOAD:
			if (num == 1) {
				this._downloadListener();
			}
			break;
		case ZmKeyMap.REPLY:
			if ((num == 1) && appCtxt.get(ZmSetting.MAIL_ENABLED)) {
				this._replyListener();
			}
			break;
		case ZmKeyMap.FORWARD:
			if ((num == 1) && appCtxt.get(ZmSetting.MAIL_ENABLED)) {
				this._forwardListener();
			}
			break;
		case ZmKeyMap.DEL:
			if (num > 0 && !(this._folder && (this._folder.callType == ZmVoiceFolder.TRASH))) {
				this._deleteListener();
			}
			break;
		case ZmKeyMap.PLAY:
			if (num == 1) {
				view.setPlaying(view.getSelection()[0]);
			}
			break;
		case ZmKeyMap.MARK_HEARD:
			this._markHeardListener();
			break;
		case ZmKeyMap.MARK_UNHEARD:
            if (!this._isUnReadOpDisabled()) this._markUnheardListener();
			break;
		default:
			return ZmVoiceListController.prototype.handleKeyAction.call(this, actionCode);
	}
	return true;
};


ZmVoicemailListController.prototype._markHeard = 
function(items, heard) {
	var changeItems = [];
	for (var i = 0, count = items.length; i < count; i++) {
		var item = items[i];
		if (!this._markingHeard[item.id] && (item.isUnheard == heard)) {
			changeItems.push(item);
			this._markingHeard[item.id] = true;
		}
	}
	if (changeItems.length) {
		var callback = new AjxCallback(this, this._handleResponseMarkHeard, [changeItems, heard]);
		var errorCallback = new AjxCallback(this, this._handleErrorMarkHeard, [changeItems]);
		var app = appCtxt.getApp(ZmApp.VOICE);
		app.markItemsHeard(changeItems, heard, callback, errorCallback);
	}
};

ZmVoicemailListController.prototype._handleResponseMarkHeard = 
function(items, heard) {
	var changeItems = [];
	var isUnheard = !heard;
	for (var i = 0, count = items.length; i < count; i++) {
		var item = items[i];
		if (item.isUnheard != isUnheard) {
			item.isUnheard = isUnheard;
			changeItems.push(item);
		}
		delete this._markingHeard[item.id];
	}
	var delta = heard ? -changeItems.length : changeItems.length;
	this._folder.changeNumUnheardBy(delta);
	this._getView().markUIAsRead(changeItems, heard);
	this._resetToolbarOperations();
};

ZmVoicemailListController.prototype._handleErrorMarkHeard =
function(items) {
	for (var i = 0, count = items.length; i < count; i++) {
		delete this._markingHeard[items[i].id];
	}
	return true;
};

ZmVoicemailListController.prototype._deleteListener =
function(ev) {
	var items = this._getView().getSelection();
	if (!items.length) {
		return;
	}

    //If it is in Trash, destination is Voice mail. If it is in Voice mail, destination is Trash.
    var folderType = this._folder && (this._folder.callType == ZmVoiceFolder.TRASH) ? ZmVoiceFolder.VOICEMAIL_ID : ZmVoiceFolder.TRASH_ID;
    var phone = this._folder.phone;
    var folderId = folderType + "-" + phone.name;
    var destination = phone.folderTree.getById(folderId);
    var list = items[0].list;
    if (ZmVoiceApp.hasTrashFolder){
        list.moveItems({items:items, folder:destination});
    }
    else {   // Some voice mail providers (e.g. Mitel) have no support for a Trash folder. Do a hard/permanent delete
       list.deleteItems({items:items, folder:this._folder});
    }
};

// This is being called directly by ZmVoiceList.
ZmVoicemailListController.prototype._handleResponseMoveItems = 
function(params) {
	var view = this._getView();
	for (var i = 0, count = params.items.length; i < count; i++) {
		view.removeItem(params.items[i]);
	}
	var delta = -params.items.length;
	this._folder.changeNumTotal(delta);
	
	if(ZmVoiceApp.hasTrashFolder && params.folder && params.folder.numTotal) {
		params.folder.changeNumTotal(params.items.length);
	}
	this._checkReplenish();
	this._resetToolbarOperations();
};

ZmVoicemailListController.prototype._downloadListener =
function() {
	// This scary looking piece of code does not change the page that the browser is
	// pointing at. Because the server will send back a "Content-Disposition:attachment"
	// header for this url, the browser opens a dialog to let the user save the file.
	ZmZimbraMail.unloadHackCallback();
	var voicemail = this._getView().getSelection()[0];
	document.location = this._getAttachmentUrl(voicemail);
};

ZmVoicemailListController.prototype._getAttachmentUrl = 
function(voicemail) {
	return voicemail.soundUrl + "&disp=a";
};

ZmVoicemailListController.prototype._replyListener = 
function(ev) {
	if (this._checkEmail()) {
		var voicemail = this._getView().getSelection()[0];
		var contact = voicemail.participants.get(0);
		this._sendMail(ev, ZmMsg.voicemailReplySubject, contact ? contact.getEmail() : null);
	}
};

ZmVoicemailListController.prototype._forwardListener = 
function(ev) {
	if (this._checkEmail()) {
		this._sendMail(ev, ZmMsg.voicemailForwardSubject);
	}
};

ZmVoicemailListController.prototype._sendMail = 
function(ev, subject, to) {
	var inNewWindow = this._app._inNewWindow(ev);
	var voicemail = this._getView().getSelection()[0];
    var soapDoc = AjxSoapDoc.create("UploadVoiceMailRequest", "urn:zimbraVoice");
	appCtxt.getApp(ZmApp.VOICE).setStorePrincipal(soapDoc);
	var node = soapDoc.set("vm");
    node.setAttribute("id", voicemail.id);
    node.setAttribute("phone", this._folder.phone.name);
    var params = {
    	soapDoc: soapDoc, 
    	asyncMode: true,
		callback: new AjxCallback(this, this._handleResponseUpload, [voicemail, inNewWindow, subject, to])
	};
	appCtxt.getAppController().sendRequest(params);
   
};

ZmVoicemailListController.prototype._handleResponseUpload = 
function(voicemail, inNewWindow, subject, to, response) {
	// Load the message in the compose view.
	var duration = AjxDateUtil.computeDuration(voicemail.duration);
    var date = AjxDateUtil.computeDateTimeString(voicemail.date);
    var callingParty = voicemail.getCallingParty(ZmVoiceItem.FROM);
    var phoneNumber = callingParty.getDisplay();
    var format = appCtxt.get(ZmSetting.COMPOSE_AS_FORMAT);
    var message = format == ZmSetting.COMPOSE_HTML ? ZmMsg.voicemailBodyHtml : ZmMsg.voicemailBodyText;
    var body = AjxMessageFormat.format(message, [phoneNumber, duration, date]);
	var uploadId = response._data.UploadVoiceMailResponse.upload[0].id;
	var params = {
		action: ZmOperation.NEW_MESSAGE, 
		inNewWindow: inNewWindow, 
		toOverride: to,
		subjOverride: subject,
        extraBodyText: body,
		callback: new AjxCallback(this, this._handleComposeLoaded, [uploadId])
	};
	AjxDispatcher.run("Compose", params);
};

ZmVoicemailListController.prototype._handleComposeLoaded = 
function(uploadId, composeController) {
	// Save the message as a draft to associate it with the upload id.
	composeController.sendMsg(uploadId, ZmComposeController.DRAFT_TYPE_AUTO);
};

ZmVoicemailListController.prototype._checkEmail =
function() {
	var message;
	var voicemail = this._getView().getSelection()[0];
	if (voicemail.isPrivate) {
		message = ZmMsg.errorPrivateVoicemail;
	} else if (!appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		//TODO: Check the contents of this message....		
		message = ZmMsg.sellEmail;
	}
	if (message) {
		var dialog = appCtxt.getMsgDialog();
		dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE);
		dialog.popup();
		return false;
	} else {
		return true;
	}
};

ZmVoicemailListController.prototype._markHeardListener =
function(ev) {
	this._markHeard(this._getView().getSelection(), true);
};

ZmVoicemailListController.prototype._markUnheardListener = 
function(ev) {
	this._markHeard(this._getView().getSelection(), false);
};

ZmVoicemailListController.prototype._play = 
function(voicemail) {
	this._getView().setPlaying(voicemail);
};

ZmVoicemailListController.prototype._selectListener = 
function(ev) {
	if(ZmVoiceApp.audioType == ZmVoiceApp.AUDIO_MP3_FORMAT) {
		var playing = this._getView().displayPlayer(ev);
		if (playing) this._markHeardListener(ev);
		return;
	}
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var selection = this._getView().getSelection();
		if (selection.length == 1) {
			var voicemail = selection[0];
			this._play(voicemail);
		}
	}
};

// Called when user clicks for help with plugins.
ZmVoicemailListController.prototype._pluginHelpListener =
function(event) {
	var dialog = appCtxt.getMsgDialog();
	var message = AjxEnv.isIE ? ZmMsg.missingPluginHelpIE : ZmMsg.missingPluginHelp;
	dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE);
	dialog.popup();
};

ZmVoicemailListController.prototype._preHideCallback =
function(view, force) {
	this._getView().stopPlaying();
	return ZmVoiceListController.prototype._preHideCallback.call(this, view, force);
};

// Called while the sound is playing. The event has information about play status.
ZmVoicemailListController.prototype._soundChangeListener =
function(event) {
	if (event.finished || event.status == DwtSoundPlugin.PLAYABLE) {
		var playing = this._getView().getPlaying();
		if (playing) {
			this._markHeard([playing], true);
		}
	}
	if (event.status == DwtSoundPlugin.ERROR) {
		// Popup error
		// appCtxt.setStatusMsg(event.errorDetail, ZmStatusView.LEVEL_CRITICAL);
	}
};
}
if (AjxPackage.define("zimbraMail.voicemail.controller.ZmVoiceTreeController")) {
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

ZmVoiceTreeController = function() {

	ZmFolderTreeController.call(this, ZmOrganizer.VOICE);
	this._voiceApp = appCtxt.getApp(ZmApp.VOICE);
};

ZmVoiceTreeController.prototype = new ZmFolderTreeController;
ZmVoiceTreeController.prototype.constructor = ZmVoiceTreeController;


// Public Methods
ZmVoiceTreeController.prototype.toString =
function() {
	return "ZmVoiceTreeController";
};

ZmVoiceTreeController.prototype.getDataTree =
function(overviewId) {
	var phone = (overviewId instanceof ZmPhone)
		? overviewId : this._opc.getOverview(overviewId).phone;
	if (phone) {
		var dataTree = this._dataTree[phone.name];
		if (!dataTree) {
			dataTree = this._dataTree[phone.name] = phone.folderTree;
			dataTree.addChangeListener(this._getTreeChangeListener());
		}
		return dataTree;
	}
};

ZmVoiceTreeController.prototype._createTreeView =
function(params) {
	return new ZmVoiceTreeView(params);
};

ZmVoiceTreeController.prototype._postSetup =
function(overviewId) {
	ZmTreeController.prototype._postSetup.call(this, overviewId);

	// expand all root account folders
	var view = this._treeView[overviewId];
	var app = appCtxt.getApp(ZmApp.VOICE);
	for (var i = 0; i < app.phones.length; i++) {
		var root = app.phones[i].folderTree.root;
		var ti = this._treeView[overviewId].getTreeItemById(root.id);
		if (ti) {
			ti.setExpanded(true);
		}
	}

	// show start folder as selected
	var parts = overviewId.split(":");
	if (parts && (parts.length == 2)) {
		var startFolder = this._voiceApp.getStartFolder(parts[1]);
		if (startFolder) {
			var treeItem = view.getTreeItemById(startFolder.id);
			if (treeItem) {
				view.setSelection(treeItem, true);
			}
		}
	}
};

ZmVoiceTreeController.prototype.resetOperations =
function(parent, type, id) {
	var folder = appCtxt.getById(id);
	parent.enable(ZmOperation.EXPAND_ALL, (folder.size() > 0));
};

// Returns a list of desired header action menu operations
ZmVoiceTreeController.prototype._getHeaderActionMenuOps =
function() {
	return null;
};

ZmVoiceTreeController.prototype._getActionMenu =
function(ev) {
	var folder = ev.item.getData(Dwt.KEY_OBJECT);
	if ((folder instanceof ZmVoiceFolder) && (folder.callType == ZmVoiceFolder.TRASH)) {
		return ZmTreeController.prototype._getActionMenu.call(this, ev);
	}

	return null;
};

// Returns a list of desired action menu operations
ZmVoiceTreeController.prototype._getActionMenuOps =
function() {
	return [ZmOperation.EMPTY_FOLDER];
};

ZmVoiceTreeController.prototype._getAllowedSubTypes =
function() {
	var types = {};
	types[ZmOrganizer.VOICE] = true;
	return types;
};

/*
* Called when a left click occurs (by the tree view listener).
*
* @param folder		ZmVoiceFolder		folder that was clicked
*/
ZmVoiceTreeController.prototype._itemClicked =
function(folder) {
	appCtxt.getApp(ZmApp.VOICE).search(folder);
};
}

}
if (AjxPackage.define("voicemail.Voicemail")) {
AjxTemplate.register("voicemail.Voicemail#VoicemailTooltip", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td><div style='border-bottom:solid black 1px; margin-bottom:0.25em'><table role=\"presentation\" width=100%><tr valign=top><td><b>";
	buffer[_i++] =  ZmMsg.voiceMail ;
	buffer[_i++] = "</b></td><td align=right style='padding-left:0.5em'><div class='ImgVoicemail'></div></td></tr></table></div></td></tr><tr><td><table role=\"presentation\"><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.fromLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["caller"];
	buffer[_i++] = "</td></tr><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.durationLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["duration"];
	buffer[_i++] = "</td></tr><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.dateLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["date"];
	buffer[_i++] = "</td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "voicemail.Voicemail#VoicemailTooltip"
}, false);
AjxTemplate.register("voicemail.Voicemail", AjxTemplate.getTemplate("voicemail.Voicemail#VoicemailTooltip"), AjxTemplate.getParams("voicemail.Voicemail#VoicemailTooltip"));

AjxTemplate.register("voicemail.Voicemail#CallTooltip", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td><div style='border-bottom:solid black 1px; margin-bottom:0.25em'><table role=\"presentation\" width=100%><tr valign=top><td><b>";
	buffer[_i++] =  ZmMsg.call ;
	buffer[_i++] = "</b></td><td align=right style='padding-left:0.5em'><div class='";
	buffer[_i++] = data["image"];
	buffer[_i++] = "'></div></td></tr></table></div></td></tr><tr><td><table role=\"presentation\"><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] = data["callerLabel"];
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["caller"];
	buffer[_i++] = "</td></tr><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.durationLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["duration"];
	buffer[_i++] = "</td></tr><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.dateLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["date"];
	buffer[_i++] = "</td></tr><tr valign=top><td class='ZmTooltipLabel'><b>";
	buffer[_i++] =  ZmMsg.locationLabel ;
	buffer[_i++] = "</b></td><td>";
	buffer[_i++] = data["location"];
	buffer[_i++] = "</td></tr></table></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "voicemail.Voicemail#CallTooltip"
}, false);

AjxTemplate.register("voicemail.Voicemail#ZmSoundPlayer", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" style='table-layout:auto;'><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_play' class='ZmPlayButton'>Play</div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_pause' class='ZmPauseButton'>Pause</div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_status' class='ZmSoundStatus'>Time</div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_postition' class='DwtPositionSlider'>...Position...</div></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "voicemail.Voicemail#ZmSoundPlayer",
	"class": "ZmSoundPlayer ZWidget"
}, false);

AjxTemplate.register("voicemail.Voicemail#ZmSoundPlayerNoScript", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\"><tr><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_play' class='ZmPlayButton'>Play</div></td><td><div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_status' class='ZmSoundStatus'>Time</div></td><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_player' style='padding-left:6px'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "voicemail.Voicemail#ZmSoundPlayerNoScript",
	"class": "ZmSoundPlayer ZWidget"
}, false);

}
