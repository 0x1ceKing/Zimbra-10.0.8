if (AjxPackage.define("TwoFactor")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 *
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2015, 2016 Synacor, Inc. All Rights Reserved.
 *
 * ***** END LICENSE BLOCK *****
 */
/**
 * Created by administrator on 04/05/15.
 */

if (AjxPackage.define("ajax.core.AjxException")) {
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
 * Creates an exception.
 * @constructor
 * @class
 * This is the base class for all exceptions in the Zimbra Ajax Toolkit.
 * 
 * @author Ross Dargahi
 * 
 * @param {string} 		[msg]		the human readable message
 * @param {constant} 	[code]	any error or fault code
 * @param {string} 		[method] 	the name of the method throwing the exception
 * @param {string} 		[detail]		any additional detail
 */
AjxException = function(msg, code, method, detail) {

	if (arguments.length == 0) { return; }
	
	/** 
	 * Human readable message, if applicable.
	 */
	this.msg = msg;
	
	/** 
	 * Error or fault code, if applicable.
	 */
	this.code = code;
	
	/**
	 * Name of the method throwing the exception, if applicable.
	 */
	this.method = method;
	
	/**
	 * Any additional detail.
	 */
	this.detail = detail;
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
AjxException.prototype.toString = 
function() {
	return "AjxException";
};

/**
 * Dumps the exception.
 * 
 * @return {string}	the state of the exception
 */
AjxException.prototype.dump = 
function() {
	return "AjxException: msg=" + this.msg + " code=" + this.code + " method=" + this.method + " detail=" + this.detail;
};

/**
 * Invalid parent exception code.
 */
AjxException.INVALIDPARENT 			= "AjxException.INVALIDPARENT";

/**
 * Invalid operation exception code.
 */
AjxException.INVALID_OP 			= "AjxException.INVALID_OP";

/**
 * Internal error exception code.
 */
AjxException.INTERNAL_ERROR 		= "AjxException.INTERNAL_ERROR";

/**
 * Invalid parameter to method/operation exception code.
 */
AjxException.INVALID_PARAM 			= "AjxException.INVALID_PARAM";

/**
 * Unimplemented method called exception code.
 */
AjxException.UNIMPLEMENTED_METHOD 	= "AjxException.UNIMPLEMENTED_METHOD";

/**
 * Network error exception code.
 */
AjxException.NETWORK_ERROR 			= "AjxException.NETWORK_ERROR";

/**
 * Out or RPC cache exception code.
 */
AjxException.OUT_OF_RPC_CACHE		= "AjxException.OUT_OF_RPC_CACHE";

/**
 * Unsupported operation code.
 */
AjxException.UNSUPPORTED 			= "AjxException.UNSUPPORTED";

/**
 * Unknown error exception code.
 */
AjxException.UNKNOWN_ERROR 			= "AjxException.UNKNOWN_ERROR";

/**
 * Operation canceled exception code.
 */
AjxException.CANCELED				= "AjxException.CANCELED";

AjxException.defaultScriptErrorHandler =
function(ex) {
	alert(ex);
};

AjxException.setScriptErrorHandler =
function(func) {
	AjxException.scriptErrorHandler = func;
};

AjxException.reportScriptError =
function(ex) {
	if (AjxException.reportScriptErrors && AjxException.scriptErrorHandler && !(ex instanceof AjxException)) {
		AjxException.scriptErrorHandler(ex);
	}
	throw ex;
};

AjxException.reportScriptErrors = false;
AjxException.scriptErrorHandler = AjxException.defaultScriptErrorHandler;
}

if (AjxPackage.define("ajax.events.AjxEventMgr")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * This class represents the event manager.
 * 
 * @private
 */
AjxEventMgr = function() {
	this._listeners = new Object();
}

/**
 * Returns a string representation of the object.
 * 
 * @return	{string}		a string representation of the object
 */
AjxEventMgr.prototype.toString = 
function() {
	return "AjxEventMgr";
}

AjxEventMgr.prototype.addListener =
function(eventType, listener, index) {
	var lv = this._listeners[eventType];
	if (lv == null) {
		lv = this._listeners[eventType] = new AjxVector();
	}         	 
	if (!lv.contains(listener)) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.add(listener, index);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.notifyListeners =
function(eventType, event) {
	this._notifyingListeners = true;
	var lv = this._listeners[eventType];
	if (lv != null) {
		var a = lv.getArray();
		var s = lv.size();
		var retVal = null;
		var c = null;
		for (var i = 0; i < s; i++) {
			c = a[i];
			// listener must be an AjxListener or a function
			if (!(c && ((c instanceof AjxListener) || (typeof c == "function")))) {
				continue;
			}
			retVal = c.handleEvent ? c.handleEvent(event) : c(event);
			if (retVal === false) {
				break;
			}
		}
	}	
	this._notifyingListeners = false;
	return retVal;
}

AjxEventMgr.prototype.isListenerRegistered =
function(eventType) {
	var lv = this._listeners[eventType];
	return (lv != null && lv.size() > 0);
}

AjxEventMgr.prototype.removeListener = 
function(eventType, listener) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.remove(listener);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.removeAll = 
function(eventType) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.removeAll();
		return true;
	}
	return false;
}

AjxEventMgr.prototype.clearAllEvents =
function() {
	var listeners = this._listeners;
    for (var eventType in listeners) {
        this.removeAll(eventType);
    }
};
}
if (AjxPackage.define("ajax.events.AjxListener")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
* Creates a new listener.
* @constructor
* @class
* This class represents a listener, which is a function to be called in response to an event.
* A listener is a slightly specialized callback: it has a {@link #handleEvent} method, and it does not
* return a value.
*
* @author Ross Dargahi
* 
* @param {Object}	obj	the object to call the function from
* @param {function}	func	the listener function
* @param {primative|array}	args   the default arguments
* 
* @extends		AjxCallback
*/
AjxListener = function(obj, method, args) {
	AjxCallback.call(this, obj, method, args);
}

AjxListener.prototype = new AjxCallback();
AjxListener.prototype.constructor = AjxListener;

AjxListener.prototype.isAjxListener = true;
AjxListener.prototype.toString = function() { return "AjxListener"; }

/**
* Invoke the listener function.
*
* @param {AjxEvent}		ev		the event object that gets passed to an event handler
*/
AjxListener.prototype.handleEvent =
function(ev) {
	return this.run(ev);
}
}

if (AjxPackage.define("ajax.dwt.graphics.DwtPoint")) {
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
 * Creates a point.
 * @constructor
 * @class
 * This class represents a point. A point has an x-coordinate and y-coordinate.
 * 
 * @author Ross Dargahi
 * 
 * @param {number} x 	the x coordinate
 * @param {number} y 	the y coordinate
 * 
 */
DwtPoint = function(x, y) {
	/**
	 * The x-coordinate.
	 * @type	number
	 */
	this.x = x || 0;
	/**
	 * The y-coordinate.
	 * @type	number
	 */
	this.y = y || 0;
}

DwtPoint.tmp = new DwtPoint(0, 0);

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtPoint.prototype.toString = 
function() {
	return "DwtPoint";
}

/**
 * Sets the values of a point
 * 
 * @param {number} x 	the x coordinate
 * @param {number} y 	the y coordinate
 */
 DwtPoint.prototype.set =
 function(x, y) {
 	this.x = x;
 	this.y = y;
 }
 
}
if (AjxPackage.define("ajax.dwt.graphics.DwtCssStyle")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Default constructor.
 * @constructor
 * @class
 * This is a static class that defines a number of constants and helper methods that
 * support the working with CSS.
 * 
 * @author Ross Dargahi
 * 
 * @private
 */
DwtCssStyle = function() {
}

// Common class name constants used in Dwt

/**
 * "mouseOver": transitory state while mouse is over the item.
 */
DwtCssStyle.HOVER = "hover";

/**
 * "mouseDown": transitory state while left mouse button is being pressed on the item.
 */
DwtCssStyle.ACTIVE = "active";

/**
 * item is "on", (for example: selected tab, select item(s) in list, or button that stays depressed).
 */
DwtCssStyle.SELECTED = "selected";

/**
 * Currently used for item that is currently viewed, but not selected (other checkboxes are checked, or a right click action is on a different item).
 */
DwtCssStyle.ALT_SELECTED = "altSelected";

/**
 * "disabled": item is not actionable (for example: because not appropriate or some other condition needs to be true).
 */
DwtCssStyle.DISABLED = "disabled";

/**
 * "focused": item has keyboard focus.
 */
DwtCssStyle.FOCUSED = "focused";

/**
 * UI component is target of some external action, for example:
 * <ul>
 * <li>item is the target of right-click (for example: show menu)</li>
 * <li>item is the thing being dragged</li>
 * </ul>
 */
DwtCssStyle.ACTIONED = "actioned";

/**
 * Matched item in a list (for example: in conv list view, items that match the search. NOT used if *all* items match the search).
 */
DwtCssStyle.MATCHED	 = "matched";

/**
 * UI component is the current, valid drop target.
 */
DwtCssStyle.DRAG_OVER = "dragOver";

/**
 * Item being dragged is over a valid drop target.
 */
DwtCssStyle.DROPPABLE = "droppable";

/**
 * Item being dragged is NOT over a valid drop target.
 */
DwtCssStyle.NOT_DROPPABLE = "notDroppable";

/**
 * Represents of an item *as it is being dragged* (for example: thing moving around the screen).
 */
DwtCssStyle.DRAG_PROXY = "dragProxy";

/**
 * Class applies only to linux browsers.
 */
DwtCssStyle.LINUX = "linux";


DwtCssStyle.getProperty = 
function(htmlElement, cssPropName) {
	var doc = htmlElement.ownerDocument;

	if (doc.defaultView && doc.defaultView.getComputedStyle) {
		var cssDecl = doc.defaultView.getComputedStyle(htmlElement, null);
		if (cssDecl && cssDecl.length > 0) { //on Chrome/Safari it returns cssDecl with length 0 for some elements for some reason. (a wild guess could be invisible items, as it happens with invite toolbar when it's invisible) So in that case fall back on the other ways.
			return cssDecl.getPropertyValue(cssPropName);
		}
	}
	
	// Convert CSS -> DOM name for IE etc
	var tokens = cssPropName.split("-");
	// Shift one word off the array and capitalize the rest
	var propName = tokens.shift() + AjxUtil.map(tokens, AjxStringUtil.capitalize).join("");

	if (htmlElement.currentStyle) {
		return htmlElement.currentStyle[propName];
	} else if (htmlElement.style) {
		return htmlElement.style[propName];
	}
};

DwtCssStyle.getComputedStyleObject = 
function(htmlElement) {
	var doc = htmlElement.ownerDocument;
	
	if (doc.defaultView && doc.defaultView.getComputedStyle) {
		var style = doc.defaultView.getComputedStyle(htmlElement, null);
		if (!style && htmlElement.style) {
// TODO: destructive ?
			htmlElement.style.display = "";
			style = doc.defaultView.getComputedStyle(htmlElement, null);
		}
		return style || {};
	} else if (htmlElement.currentStyle)
		return htmlElement.currentStyle;
	else if (htmlElement.style)
		return htmlElement.style;
};

DwtCssStyle.removeProperty = function(el, prop) {
	if (prop instanceof Array) {
		for (var i = prop.length; --i >= 0;)
			DwtCssStyle.removeProperty(el, prop[i]);
	} else {
		if (AjxEnv.isIE) {
			el.style.removeAttribute(prop, true);
		} else {
			prop = prop.replace(/([A-Z])/g, "-$1");
			el.style.removeProperty(prop);
		}
	}
};

/**
 * Adds a rule to a stylesheet.
 * 
 * @param {StyleSheet}	stylesheet		a CSS stylesheet
 * @param {string}		selector		rule selector
 * @param {string}		declaration		styles
 * @param {string}		index			insertion index (optional)
 * 
 * @return	index at which rule was inserted (for later removal)
 */
DwtCssStyle.addRule =
function(stylesheet, selector, declaration, index) {
	if (stylesheet.addRule) {	// IE
		//if index is not specified insert at the end so that new rule takes precedence
		index = index || (stylesheet.rules.length);
		stylesheet.addRule(selector, declaration, index);
	}
	else {
		//if index is not specified insert at the end so that new rule takes precedence
		index = index || (stylesheet.cssRules.length);
		stylesheet.insertRule(selector + "{" + declaration + "}", index);
	}
	return index;
};

/**
 * Removes the rule at the given index.
 * 
 * @param {StyleSheet}	stylesheet		a CSS stylesheet
 * @param {string}		index			insertion index (optional)
 */
DwtCssStyle.removeRule =
function(stylesheet, index) {
	if (stylesheet.removeRule) {	// IE
		stylesheet.removeRule(index);
	}
	else {
		stylesheet.deleteRule(index);
	}
};

DwtCssStyle.__PIXEL_RE = /^(-?[0-9]+(?:\.[0-9]*)?)px$/;
DwtCssStyle.__DIMENSION_RE = /^(-?[0-9]+(?:\.[0-9]*)?)([a-z]*|%)$/;
DwtCssStyle.__NUMBER_RE = /^(-?[0-9]+(?:\.[0-9]*)?)+$/

/**
 * Obtain the font size of the root element in pixels.
 */
DwtCssStyle.__getRootFontSize = function() {

	var fontsize = DwtCssStyle.getProperty(document.documentElement, 'font-size');

	if (!DwtCssStyle.__PIXEL_RE.test(fontsize)) {
		DBG.println(AjxDebug.DBG1, 'font size of root element is not in pixels!');
		return -1;
	}

	return parseInt(fontsize);
};

/**
 * Convert a CSS value to a pixel count; unhandled units raise an error.
 *
 * @param   {String}    val     a font size value in some form
 *
 * @return  {Number}    the size in pixels, or -1 if there is an error
 */
DwtCssStyle.asPixelCount = function(val) {

	if (!val) {
		DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: missing argument');
		return -1;
	}

	var dimension, unit, match;

	// assume pixels if no unit is specified
	if (typeof val === 'number' || DwtCssStyle.__NUMBER_RE.test(val)) {
		dimension = Number(val);
		unit = 'px';
	} else if ((match = DwtCssStyle.__DIMENSION_RE.exec(val))) {
		dimension = Number(match[1]);
		unit = match[2];
	} else {
		DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: unsupported argument: ' + val);
		return -1;
	}

	switch (unit) {
		case 'rem': {
			var rootFontSize = DwtCssStyle.__getRootFontSize();
			return rootFontSize !== -1 ? dimension * rootFontSize : -1;
		}

		// see http://www.w3.org/TR/css3-values/#absolute-lengths
		case 'mm': {
			dimension /= 10;
		}

		case 'cm': {
			dimension /= 2.54;
		}

		case 'in': {
			dimension *= 6;
		}

		case 'pc': {
			dimension *= 12;
		}

		case 'pt': {
			dimension /= 0.75;
		}

		case 'px': {
			return dimension;
		}

		case 'ch':
		case 'em':
		case 'ex': {
			DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: cannot convert context-dependent CSS unit ' + unit);
			return -1;
		}

		default: {
			DBG.println(AjxDebug.DBG1, 'DwtCssStyle.asPixelCount: unrecognized CSS unit ' + unit);
			return -1;
		}
	}
};
}

if (AjxPackage.define("ajax.util.AjxUtil")) {
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
 * AjxUtil - static class with some utility methods. This is where to
 * put things when no other class wants them.
 *
 * 12/3/2004 At this point, it only needs AjxEnv to be loaded.
 * 
 * @private
 */
AjxUtil = function() {
};

AjxUtil.FLOAT_RE = /^[+\-]?((\d+(\.\d*)?)|((\d*\.)?\d+))([eE][+\-]?\d+)?$/;
AjxUtil.NOTFLOAT_RE = /[^\d\.]/;
AjxUtil.NOTINT_RE = /[^0-9]+/;
AjxUtil.LIFETIME_FIELD = /^([0-9])+([dhms]|ms)?$/;
AjxUtil.INT_RE = /^\-?(0|[1-9]\d*)$/;

AjxUtil.isSpecified 		= function(aThing) { return ((aThing !== void 0) && (aThing !== null)); };
AjxUtil.isUndefined 		= function(aThing) { return (aThing === void 0); };
AjxUtil.isNull 				= function(aThing) { return (aThing === null); };
AjxUtil.isBoolean 			= function(aThing) { return (typeof(aThing) === 'boolean'); };
AjxUtil.isString 			= function(aThing) { return (typeof(aThing) === 'string'); };
AjxUtil.isNumber 			= function(aThing) { return (typeof(aThing) === 'number'); };
AjxUtil.isObject 			= function(aThing) { return ((typeof(aThing) === 'object') && (aThing !== null)); };
AjxUtil.isArray 			= function(aThing) { return AjxUtil.isInstance(aThing, Array); };
AjxUtil.isArrayLike			= function(aThing) { return typeof aThing !== 'string' && typeof aThing.length === 'number'; };
AjxUtil.isFunction 			= function(aThing) { return (typeof(aThing) === 'function'); };
AjxUtil.isDate 				= function(aThing) { return AjxUtil.isInstance(aThing, Date); };
AjxUtil.isLifeTime 			= function(aThing) { return AjxUtil.LIFETIME_FIELD.test(aThing); };
AjxUtil.isNumeric 			= function(aThing) { return (!isNaN(parseFloat(aThing)) && AjxUtil.FLOAT_RE.test(aThing) && !AjxUtil.NOTFLOAT_RE.test(aThing)); };
AjxUtil.isInt				= function(aThing) { return AjxUtil.INT_RE.test(aThing); };
AjxUtil.isPositiveInt		= function(aThing) { return AjxUtil.isInt(aThing) && parseInt(aThing, 10) > 0; }; //note - assume 0 is not positive
AjxUtil.isLong = AjxUtil.isInt;
AjxUtil.isNonNegativeLong	= function(aThing) { return AjxUtil.isLong(aThing) && parseInt(aThing, 10) >= 0; };
AjxUtil.isEmpty				= function(aThing) { return ( AjxUtil.isNull(aThing) || AjxUtil.isUndefined(aThing) || (aThing === "") || (AjxUtil.isArray(aThing) && (aThing.length==0))); };
// REVISIT: Should do more precise checking. However, there are names in
//			common use that do not follow the RFC patterns (e.g. domain
//			names that start with digits).
AjxUtil.IPv4_ADDRESS_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?$/;
AjxUtil.IPv4_ADDRESS_WITH_PORT_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?:\d{1,5}$/;
AjxUtil.IPv6_ADDRESS_RE = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|(?:%[-\w.~]+)?$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})(?:%[-\w.~]+)?$/i;
AjxUtil.IPv6_ADDRESS_WITH_PORT_RE = new RegExp(AjxUtil.IPv6_ADDRESS_RE.source.replace('^', '^\\[').replace('$', '\\]:\\d{1,5}$'), 'i');
AjxUtil.SUBNET_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?\/\d{1,2}$/;
AjxUtil.DOMAIN_NAME_SHORT_RE = /^[A-Za-z0-9\-]{2,}$/;
AjxUtil.DOMAIN_NAME_FULL_RE = /^[A-Za-z0-9\-]{1,}(\.[A-Za-z0-9\-]{2,}){1,}$/;
AjxUtil.HOST_NAME_RE = /^[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{1,})*(\.[A-Za-z0-9\-]{2,})*$/;
AjxUtil.HOST_NAME_WITH_PORT_RE = /^[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{2,})*:([0-9])+$/;
AjxUtil.EMAIL_SHORT_RE = /^[^@\s]+$/;
AjxUtil.EMAIL_FULL_RE = /^[^@\s]+@[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{2,})+$/;
AjxUtil.FULL_URL_RE = /^[A-Za-z0-9]{2,}:\/\/[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*(:([0-9])+)?(\/[\w\.\|\^\*\[\]\{\}\(\)\-<>~,'#_;@:!%]+)*(\/)?(\?[\w\.\|\^\*\+\[\]\{\}\(\)\-<>~,'#_;@:!%&=]*)?$/;
AjxUtil.IP_FULL_URL_RE = /^[A-Za-z0-9]{2,}:\/\/\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?(:([0-9])+)?(\/[\w\.\|\^\*\[\]\{\}\(\)\-<>~,'#_;@:!%]+)*(\/)?(\?[\w\.\|\^\*\+\[\]\{\}\(\)\-<>~,'#_;@:!%&=]*)?$/;
AjxUtil.SHORT_URL_RE = /^[A-Za-z0-9]{2,}:\/\/[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*(:([0-9])+)?$/;
AjxUtil.IP_SHORT_URL_RE = /^[A-Za-z0-9]{2,}:\/\/\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?(:([0-9])+)?$/;

AjxUtil.isHostName 			= function(s) { return AjxUtil.HOST_NAME_RE.test(s); };
AjxUtil.isDomainName = 
function(s, shortMatch) {
	return shortMatch 
		? AjxUtil.DOMAIN_NAME_SHORT_RE.test(s) 
		: AjxUtil.DOMAIN_NAME_FULL_RE.test(s);
};

AjxUtil.isEmailAddress = 
function(s, nameOnly) {
	return nameOnly 
		? AjxUtil.EMAIL_SHORT_RE.test(s) 
		: AjxUtil.EMAIL_FULL_RE.test(s);
};

AjxUtil.isValidEmailNonReg = 
function(s) {
	return ((s.indexOf ("@") > 0) && (s.lastIndexOf ("@") == s.indexOf ("@")) && (s.indexOf (".@") < 0));
};

/**
 * Return true if the given object is a plain hash.
 *
 * @param aThing	The object for testing.
 */
AjxUtil.isHash =
function(aThing) {
	// Note: can't just look at prototype since that fails cross-window.
	// See http://stackoverflow.com/questions/10741618/how-to-check-if-argument-is-an-object-and-not-an-array, esp the part with isPlainObject()
	var str = aThing && aThing.toString ? aThing.toString() : Object.prototype.toString.call(aThing);
	return AjxUtil.isObject(aThing) && str === '[object Object]';
};

AjxUtil.SIZE_GIGABYTES = "GB";
AjxUtil.SIZE_MEGABYTES = "MB";
AjxUtil.SIZE_KILOBYTES = "KB";
AjxUtil.SIZE_BYTES = "B";

/**
 * Formats a size (in bytes) to the largest whole unit. For example,
 * AjxUtil.formatSize(302132199) returns "288 MB".
 *
 * @param size      The size (in bytes) to be formatted.
 * @param round     True to round to nearest integer. Default is true.
 * @param fractions Number of fractional digits to display, if not rounding.
 *                  Trailing zeros after the decimal point are trimmed.
 */
AjxUtil.formatSize = 
function(size, round, fractions) {
	if (round == null) round = true;
	if (fractions == null) fractions = 20; // max allowed for toFixed is 20

	var formattedUnits = AjxMsg.sizeBytes;
	var units = AjxMsg.SIZE_BYTES;
	if (size >= 1073741824) {
		formattedUnits = AjxMsg.sizeGigaBytes;
		units = AjxUtil.SIZE_GIGABYTES;
	}
	else if (size >= 1048576) {
		formattedUnits = AjxMsg.sizeMegaBytes;
		units = AjxUtil.SIZE_MEGABYTES;
	}
	else if (size > 1023) {
		formattedUnits = AjxMsg.sizeKiloBytes;
		units = AjxUtil.SIZE_KILOBYTES;
	}


	var formattedSize = AjxUtil.formatSizeForUnits(size, units, round, fractions);
	return AjxMessageFormat.format(AjxMsg.formatSizeAndUnits, [formattedSize, formattedUnits]);
};

/**
 * Formats a size (in bytes) to a specific unit. Since the unit size is
 * known, the unit is not shown in the returned string. For example,
 * AjxUtil.formatSizeForUnit(302132199, AjxUtil.SIZE_MEGABYTES, false, 2) 
 * returns "288.13".
 *
 * @param size      The size (in bytes) to be formatted.
 * @param units     The unit of measure.
 * @param round     True to round to nearest integer. Default is true.
 * @param fractions Number of fractional digits to display, if not rounding.
 *                  Trailing zeros after the decimal point are trimmed.
 */
AjxUtil.formatSizeForUnits = 
function(size, units, round, fractions) {
	if (units == null) units = AjxUtil.SIZE_BYTES;
	if (round == null) round = true;
	if (fractions == null) fractions = 20; // max allowed for toFixed is 20

	switch (units) {
		case AjxUtil.SIZE_GIGABYTES: { size /= 1073741824; break; }
		case AjxUtil.SIZE_MEGABYTES: { size /= 1048576; break; }
		case AjxUtil.SIZE_KILOBYTES: { size /= 1024; break; }
	}
	var dot = I18nMsg.numberSeparatorDecimal !='' ? I18nMsg.numberSeparatorDecimal : '.';
	var pattern = I18nMsg.formatNumber.replace(/\..*$/, ""); // Strip off decimal, we'll be adding one anyway
	pattern = pattern.replace(/,/, "");       // Remove the ,
	if (!round && fractions) {
		pattern = pattern += dot;
		for (var i = 0; i < fractions; i++) {
			pattern += "#";
		}
	}
	return AjxNumberFormat.format(pattern, size);
};

/**
 * Performs the opposite of AjxUtil.formatSize in that this function takes a 
 * formatted size.
 *
 * @param units Unit constant: "GB", "MB", "KB", "B". Must be specified 
 *              unless the formatted size ends with the size marker, in
 *				which case the size marker in the formattedSize param
 *				overrides this parameter.
 */
AjxUtil.parseSize = 
function(formattedSize, units) {
	// NOTE: Take advantage of fact that parseFloat ignores bad chars
	//       after numbers
	if (typeof formattedSize != _STRING_) {
		formattedSize = formattedSize.toString() ;
	}
	var size = parseFloat(formattedSize.replace(/^\s*/,""));

	var marker = /[GMK]?B$/i;
	var result = marker.exec(formattedSize);
	if (result) {
		//alert("units: "+units+", result[0]: '"+result[0]+"'");
		units = result[0].toUpperCase();
	}
	
	switch (units) {
		case AjxUtil.SIZE_GIGABYTES: size *= 1073741824; break;
		case AjxUtil.SIZE_MEGABYTES: size *= 1048576; break; 
		case AjxUtil.SIZE_KILOBYTES: size *= 1024; break;
	}
	
	//alert("AjxUtil#parseSize: formattedSize="+formattedSize+", size="+size);
	return size;
};

AjxUtil.isInstance = 
function(aThing, aClass) { 
	return !!(aThing && aThing.constructor && (aThing.constructor === aClass)); 
};

AjxUtil.assert = 
function(aCondition, aMessage) {
	if (!aCondition && AjxUtil.onassert) AjxUtil.onassert(aMessage);
};

AjxUtil.onassert = 
function(aMessage) {
	// Create an exception object and set the message
	var myException = new Object();
	myException.message = aMessage;
	
	// Compile a stack trace
	var myStack = new Array();
	if (AjxEnv.isIE) {
		// On IE, the caller chain is on the arguments stack
		var myTrace = arguments.callee.caller;
		var i = 0; // stop at 20 since there might be somehow an infinite loop here. Maybe in case of a recursion. 
		while (myTrace && i++ < 20) {
		    myStack[myStack.length] = myTrace;
	    	myTrace = myTrace.caller;
		}
	} else {
		try {
			var myTrace = arguments.callee.caller;
			while (myTrace) {
				myStack[myStack.length] = myTrace;
				if (myStack.length > 2) break;
				myTrace = myTrace.caller;
		    }
		} catch (e) {
		}
	}
	myException.stack = myStack;
	
	// Alert with the message and a description of the stack
	var stackString = '';
	var MAX_LEN = 170;
	for (var i = 1; i < myStack.length; i++) {
		if (i > 1) stackString += '\n';
		if (i < 11) {
			var fs = myStack[i].toString();
			if (fs.length > MAX_LEN) {
				fs = fs.substr(0,MAX_LEN) + '...';
				fs = fs.replace(/\n/g, '');
			}
			stackString += i + ': ' + fs;
		} else {
			stackString += '(' + (myStack.length - 11) + ' frames follow)';
			break;
		}
	}
	alert('assertion:\n\n' + aMessage + '\n\n---- Call Stack ---\n' + stackString);
	
	// Now throw the exception
	throw myException;
};

// IE doesn't define Node type constants
AjxUtil.ELEMENT_NODE		= 1;
AjxUtil.TEXT_NODE			= 3;
AjxUtil.DOCUMENT_NODE		= 9;

AjxUtil.getInnerText = 
function(node) {
 	if (AjxEnv.isIE)
 		return node.innerText;

	function f(n) {
		if (n) {
			if (n.nodeType == 3 /* TEXT_NODE */)
				return n.data;
			if (n.nodeType == 1 /* ELEMENT_NODE */) {
				if (/^br$/i.test(n.tagName))
					return "\r\n";
				var str = "";
				for (var i = n.firstChild; i; i = i.nextSibling)
					str += f(i);
				return str;
			}
		}
		return "";
	};
	return f(node);
};

/**
 * This method returns a proxy for the specified object. This is useful when
 * you want to modify properties of an object and want to keep those values
 * separate from the values in the original object. You can then iterate
 * over the proxy's properties and use the <code>hasOwnProperty</code>
 * method to determine if the property is a new value in the proxy.
 * <p>
 * <strong>Note:</strong>
 * A reference to the original object is stored in the proxy as the "_object_" 
 * property.
 *
 * @param object [object] The object to proxy.
 * @param level  [number] The number of property levels deep to proxy.
 *						  Defaults to zero.
 */
AjxUtil.createProxy = 
function(object, level) {
	var proxy;
	var proxyCtor = function(){}; // bug #6517 (Safari doesnt like 'new Function')
	proxyCtor.prototype = object;
	if (object instanceof Array) {
		proxy  = new Array();
		var cnt  = object.length;
		for(var ix = 0; ix < cnt; ix++) {
			proxy[ix] = object[ix];
		}
	} else {
		proxy = new proxyCtor;
	}
	
	if (level) {
		for (var prop in object) {
			if (typeof object[prop] == "object" && object[prop] !== null)
				proxy[prop] = AjxUtil.createProxy(object[prop], level - 1);
		}
	}	
	
	proxy._object_ = object;
	return proxy;
};

AjxUtil.unProxy =
function(proxy) {
	var object = proxy && proxy._object_;
	if (object) {
		for (var prop in proxy) {
			if (proxy.hasOwnProperty(prop) && prop!="_object_") {
				object[prop] = proxy[prop];
			}
		}
		return object;
	}
	return null;
}

/**
* Returns a copy of a list with empty members removed.
*
* @param list	[array]		original list
*/
AjxUtil.collapseList =
function(list) {
	var newList = [];
	for (var i = 0; i < list.length; i++) {
		if (list[i]) {
			newList.push(list[i]);
		}
	}
	return newList;
};

AjxUtil.arrayAsHash =
function(array, valueOrFunc) {
	array = AjxUtil.toArray(array);
	var hash = {};
	var func = typeof valueOrFunc == "function" && valueOrFunc;
	var value = valueOrFunc || true; 
	for (var i = 0; i < array.length; i++) {
		var key = array[i];
		hash[key] = func ? func(key, hash, i, array) : value;
	}
	return hash;
};

AjxUtil.arrayAdd = function(array, member, index) {

    array = array || [];

	if (index == null || index < 0 || index >= array.length) {
		// index absent or is out of bounds - append object to the end
		array.push(member);
	} else {
		// otherwise, insert object
		array.splice(index, 0, member);
	}
};

AjxUtil.arrayRemove =
function(array, member) {
	if (array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == member) {
				array.splice(i, 1);
				return true;
			}
		}
	}
	return false;
};

AjxUtil.indexOf =
function(array, object, strict) {
	if (array) {
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			if ((strict && item === object) || (!strict && item == object)) {
				return i;
			}
		}
	}
	return -1;
};

AjxUtil.arrayContains =
function(array, object, strict) {
	return AjxUtil.indexOf(array, object, strict) != -1;
};

AjxUtil.keys = function(object, acceptFunc) {
    var keys = [];
    for (var p in object) {
	    if (acceptFunc && !acceptFunc(p, object)) continue;
        keys.push(p);
    }
    return keys;
};
AjxUtil.values = function(object, acceptFunc) {
    var values = [];
    for (var p in object) {
	    if (acceptFunc && !acceptFunc(p, object)) continue;
        values.push(object[p]);
    }
    return values;
};

/**
 * Generate another hash mapping property values to their names. Each value
 * should be unique; otherwise the results are undefined.
 *
 * @param obj                   An object, treated as a hash.
 * @param func [function]       An optional function for filtering properties.
 */
AjxUtil.valueHash = function(obj, acceptFunc) {
    // don't rely on the value in the object itself
    var hasown = Object.prototype.hasOwnProperty.bind(obj);

    var r = {};
    for (var k in obj) {
        var v = obj[k];

        if (!hasown(k) || (acceptFunc && !acceptFunc(k, obj)))
            continue;
        r[v] = k;
    }
    return r;
};
AjxUtil.backMap = AjxUtil.valueHash;

/**
 * Call a function with the the items in the given object, which special logic
 * for handling of arrays.
 *
 * @param obj                   Array or other object
 * @param func [function]       Called with index or key and value.
 */
AjxUtil.foreach = function(obj, func) {

    if (!func || !obj) {
        return;
    }

    if (AjxUtil.isArrayLike(obj)) {
        var array = obj;

        for (var i = 0; i < array.length; i++) {
            func(array[i], i);
        }
    }
    else {
        // don't rely on the value in the object itself
        var hasown = Object.prototype.hasOwnProperty.bind(obj);

        for (var k in obj) {
            if (hasown(k)) {
                func(obj[k], k)
            }
        }
    }
};

AjxUtil.map = function(array, func) {

    if (!array) {
        return [];
    }

	var narray = new Array(array.length);
	for (var i = 0; i < array.length; i++) {
		narray[i] = func ? func(array[i], i) : array[i];
	}

	return narray;
};

AjxUtil.uniq = function(array) {

    if (!array) {
        return [];
    }

    var object = {};
	for (var i = 0; i < array.length; i++) {
		object[array[i]] = true;
	}

	return AjxUtil.keys(object);
};


/**
 * Remove duplicates from the given array,
 * <strong>in-place</strong>. Stable with regards to ordering.
 *
 * Please note that this method is O(n^2) if Array is backed by an
 * array/vector data structure.
 *
 * @param array [array]     array to process
 * @param keyfn [function]  used to extract a comparison key from each
 *                          list element, default is to compare
 *                          elements directly. if the comparison key
 *                          is 'undefined', the element is always
 *                          retained
 */
AjxUtil.dedup = function(array, keyfn) {

    if (!array) {
        return [];
    }

    if (!keyfn) {
		keyfn = function(v) { return v; };
    }

	var seen = {};

	for (var i = 0; i < array.length; i++) {
		var key = keyfn(array[i]);

		if (key !== undefined && seen[key]) {
			array.splice(i, 1);
			i -= 1;
		}

		seen[key] = true;
	}
};


AjxUtil.concat = function(array1 /* ..., arrayN */) {

	var array = [];
	for (var i = 0; i < arguments.length; i++) {
		array.push.apply(array, arguments[i]);
	}
	return array;
};

AjxUtil.union = function(array1 /* ..., arrayN */) {
	var array = [];
	return AjxUtil.uniq(array.concat.apply(array, arguments));
};

AjxUtil.intersection = function(array1 /* ..., arrayN */) {
	var array = AjxUtil.concat.apply(this, arguments);
	var object = AjxUtil.arrayAsHash(array, AjxUtil.__intersection_count);
	for (var p in object) {
		if (object[p] == 1) {
			delete object[p];
		}
	}
	return AjxUtil.keys(object);
};

AjxUtil.__intersection_count = function(key, hash, index, array) {
	return hash[key] != null ? hash[key] + 1 : 1;
};

AjxUtil.complement = function(array1, array2) {
	var object1 = AjxUtil.arrayAsHash(array1);
	var object2 = AjxUtil.arrayAsHash(array2);
	for (var p in object2) {
		if (p in object1) {
			delete object2[p];
		}
	}
	return AjxUtil.keys(object2);
};

/**
 * Returns an array with all the members of the given array for which the filtering function returns true.
 *
 * @param {Array}       array       source array
 * @param {Function}    func        filtering function
 * @param {Object}      context     scope for filtering function
 *
 * @returns {Array} array of members for which the filtering function returns true
 */
AjxUtil.filter = function(array, func, context) {

	var results = [];
	if (array == null) {
		return results;
	}

	var nativeFilter = Array.prototype.filter;
	if (nativeFilter && array.filter === nativeFilter) {
		return array.filter(func, context);
	}

	AjxUtil.foreach(array, function(value, index) {
		if (func.call(context, value, index)) {
			results.push(value);
		}
	});

	return results;
};

AjxUtil.getFirstElement = function(parent, ename, aname, avalue) {
    for (var child = parent.firstChild; child; child = child.nextSibling) {
        if (child.nodeType != AjxUtil.ELEMENT_NODE) continue;
        if (ename && child.nodeName != ename) continue;
        if (aname) {
            var attr = child.getAttributeNode(aname);
            if (attr.nodeName != aname) continue;
            if (avalue && attr.nodeValue != avalue) continue;
        }
        return child;
    }
    return null;
};

/**
 * @param params	[hash]		hash of params:
 *        relative	[boolean]*	if true, return a relative URL
 *        protocol	[string]*	protocol (trailing : is optional)
 *        host		[string]*	server hostname
 *        port		[int]*		server port
 *        path		[string]*	URL path
 *        qsReset	[boolean]*	if true, clear current query string
 *        qsArgs	[hash]*		set of query string names and values
 */
AjxUtil.formatUrl =
function(params) {
	params = params || {};
	var url = [];
	var i = 0;
	if (!params.relative) {
		var proto = params.protocol || location.protocol;
		if (proto.indexOf(":") == -1) {
			proto = proto + ":";
		}
		url[i++] = proto;
		url[i++] = "//";
		url[i++] = params.host || location.hostname;
		var port = Number(params.port || location.port);
		if (port &&
			((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) ||
			 (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT))) {
			url[i++] =  ":";
			url[i++] = port;
		}
	}
	url[i++] = params.path || location.pathname;
	var qs = "";
	if (params.qsArgs) {
		qs = AjxStringUtil.queryStringSet(params.qsArgs, params.qsReset);
	} else {
		qs = params.qsReset ? "" : location.search;
	}
	url[i++] = qs;
	
	return url.join("");
};

AjxUtil.byNumber = function(a, b) {
	return Number(a) - Number(b);
};

/**
 * <strong>Note:</strong>
 * This function <em>must</em> be wrapped in a closure that passes
 * the property name as the first argument.
 *
 * @param {string}  prop    Property name.
 * @param {object}  a       Object A.
 * @param {object}  b       Object B.
 */
AjxUtil.byStringProp = function(prop, a, b) {
    return a[prop].localeCompare(b[prop]);
};

/**
 * returns the size of the given array, i.e. the number of elements in it, regardless of whether the array is associative or not.
 * so for example for array that is set simply by a = []; a[50] = "abc"; arraySize(a) == 1. For b = []; b["abc"] = "def"; arraySize(b) == 1 too.
 * Incredibly JavasCript does not have a built in simple way to get that.
 * @param arr
 */
AjxUtil.arraySize =
function(a) {
	var size = 0;
	for(var e in a) {
		if (a.hasOwnProperty(e)) {
			size ++;
		}
	}
	return size;
};

/**
 * mergesort+dedupe
**/
AjxUtil.mergeArrays =
function(arr1, arr2, orderfunc) {
	if(!orderfunc) {
		orderfunc = AjxUtil.__mergeArrays_orderfunc;
	}
 	var tmpArr1 = [];
 	var cnt1 = arr1.length;
 	for(var i = 0; i < cnt1; i++) {
 		tmpArr1.push(arr1[i]);
 	}

 	var tmpArr2 = [];
 	var cnt2 = arr2.length;
 	for(var i = 0; i < cnt2; i++) {
 		tmpArr2.push(arr2[i]);
 	} 	
	var resArr = [];
	while (tmpArr1.length>0 && tmpArr2.length>0) {
		if (orderfunc(tmpArr1[0],resArr[resArr.length-1])==0) {
			tmpArr1.shift();
			continue;
		}
		
		if (orderfunc(tmpArr2[0],resArr[resArr.length-1])==0) {
			tmpArr2.shift();
			continue;
		}		
			
		if (orderfunc(tmpArr1[0], tmpArr2[0])<0) {
			resArr.push(tmpArr1.shift());
		} else if (orderfunc(tmpArr1[0],tmpArr2[0])==0) {
			resArr.push(tmpArr1.shift());
			tmpArr2.shift();
		} else {
			resArr.push(tmpArr2.shift());
		}
	}
		
	while (tmpArr1.length>0) {
		if (orderfunc(tmpArr1[0],resArr[resArr.length-1])==0) {
			tmpArr1.shift();
			continue;
		}		
		resArr.push(tmpArr1.shift());
	}
		
	while (tmpArr2.length>0) {
		if (orderfunc(tmpArr2[0], resArr[resArr.length-1])==0) {
			tmpArr2.shift();
			continue;
		}			
		resArr.push(tmpArr2.shift());
	}
	return resArr;	
};

AjxUtil.__mergeArrays_orderfunc = function (val1,val2) {
    if(val1>val2)    return  1;
    if (val1 < val2) return -1;
    if(val1 == val2) return  0;
};

AjxUtil.arraySubtract = function (arr1, arr2, orderfunc) {
	if(!orderfunc) {
		orderfunc = function (val1,val2) {
			if(val1>val2)
				return 1;
			if (val1 < val2)
				return -1;
			if(val1 == val2)
				return 0;
		}
	}
 	var tmpArr1 = [];
 	var cnt1 = arr1.length;
 	for(var i = 0; i < cnt1; i++) {
 		tmpArr1.push(arr1[i]);
 	}

 	var tmpArr2 = [];
 	var cnt2 = arr2.length;
 	for(var i = 0; i < cnt2; i++) {
 		tmpArr2.push(arr2[i]);
 	} 	
 	tmpArr2.sort(orderfunc);
 	tmpArr1.sort(orderfunc);
	var resArr = [];
	while(tmpArr1.length > 0 && tmpArr2.length > 0) {
		if(orderfunc(tmpArr1[0],tmpArr2[0])==0) {
			tmpArr1.shift();
			tmpArr2.shift();
			continue;
		}
		
		if(orderfunc(tmpArr1[0],tmpArr2[0]) < 0) {
			resArr.push(tmpArr1.shift());
			continue;
		}
		
		if(orderfunc(tmpArr1[0],tmpArr2[0]) > 0) {
			tmpArr2.shift();
			continue;
		}
	}
	
	while(tmpArr1.length > 0) {
		resArr.push(tmpArr1.shift());
	}
	
	return resArr;
};

// Support deprecated, misspelled version
AjxUtil.arraySubstract = AjxUtil.arraySubtract;

/**
 * Returns the keys of the given hash as a sorted list.
 *
 * @param hash		[hash]
 */
AjxUtil.getHashKeys =
function(hash) {

	var list = [];
	for (var key in hash) {
		list.push(key);
	}
	list.sort();

	return list;
};

/**
 * Does a shallow comparison of two arrays.
 *
 * @param arr1	[array]
 * @param arr2	[array]
 */
AjxUtil.arrayCompare =
function(arr1, arr2) {
	if ((!arr1 || !arr2) && (arr1 != arr2)) {
		return false;
	}
	if (arr1.length != arr2.length) {
		return false;
	}
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}
	return true;
};

/**
 * Does a shallow comparison of two hashes.
 *
 * @param hash1	[hash]
 * @param hash2	[hash]
 */
AjxUtil.hashCompare =
function(hash1, hash2) {

	var keys1 = AjxUtil.getHashKeys(hash1);
	var keys2 = AjxUtil.getHashKeys(hash2);
	if (!AjxUtil.arrayCompare(keys1, keys2)) {
		return false;
	}
	for (var i = 0, len = keys1.length; i < len; i++) {
		var key = keys1[i];
		if (hash1[key] != hash2[key]) {
			return false;
		}
	}
	return true;
};

/**
 * Returns a shallow copy of the given hash.
 *
 * @param {Object}  hash    source hash
 * @param {Array}   omit    Keys to skip (blacklist)
 * @param {Array}   keep 	Keys to keep (whitelist)
 */
AjxUtil.hashCopy = function(hash, omit, keep) {

    omit = omit && AjxUtil.arrayAsHash(omit);
    keep = keep && AjxUtil.arrayAsHash(keep);

	var copy = {};
	for (var key in hash) {
        if ((!omit || !omit[key]) && (!keep || keep[key])) {
    		copy[key] = hash[key];
        }
	}

	return copy;
};

/**
 * Updates one hash with values from another.
 *
 * @param {Object}  hash1		Hash to be updated
 * @param {Object}  hash2 		Hash to update from (values from hash2 will be copied to hash1)
 * @param {Boolean} overwrite 	Set to true if existing values in hash1 should be overwritten when keys match (defaults to false)
 * @param {Array}   omit 	    Keys to skip (blacklist)
 * @param {Array}   keep        Keys to keep (whitelist)
 */
AjxUtil.hashUpdate = function(hash1, hash2, overwrite, omit, keep) {

    omit = omit && AjxUtil.arrayAsHash(omit);
    keep = keep && AjxUtil.arrayAsHash(keep);

    for (var key in hash2) {
		if ((overwrite || !(key in hash1)) && (!omit || !omit[key]) && (!keep || keep[key])) {
			hash1[key] = hash2[key];
		}
	}
};

// array check that doesn't rely on instanceof, since type info
// can get lost in new window
AjxUtil.isArray1 =
function(arg) {
	return !!(arg && (arg.length != null) && arg.splice && arg.slice);
};

// converts the arg to an array if it isn't one
AjxUtil.toArray =
function(arg) {
	if (!arg) {
		return [];
	}
	else if (AjxUtil.isArray1(arg)) {
		return arg;
	}
	else if (AjxUtil.isArrayLike(arg)) {
		return Array.prototype.slice.call(arg);
	}
	else if (arg.isAjxVector) {
        return arg.getArray();
	}
	else {
		return [arg];
	}
};

/**
 * Returns a sub-property of an object. This is useful to avoid code like
 * the following:
 * <pre>
 * resp = resp && resp.BatchResponse;
 * resp = resp && resp.GetShareInfoResponse;
 * resp = resp && resp[0];
 * </pre>
 * <p>
 * The first argument to this function is the source object while the
 * remaining arguments are the property names of the path to follow.
 * This is done instead of as a path string (e.g. "foo/bar[0]") to
 * avoid unnecessary parsing.
 *
 * @param {object}          object  The source object.
 * @param {string|number}   ...     The property of the current context object.
 */
AjxUtil.get = function(object /* , propName1, ... */) {
    for (var i = 1; object && i < arguments.length; i++) {
        object = object[arguments[i]];
    }
    return object;
};


/**
 *  Convert non-ASCII characters to valid HTML UNICODE entities 
 * @param {string}
 * 
*/
AjxUtil.convertToEntities = function (source){
	var result = '';
	var length = 0;
    
    if (!source || !(length = source.length)) return source;
    
	for (var i = 0; i < length; i++) {
		var charCode = source.charCodeAt(i);
		// Encode non-ascii or double quotes
		if ((charCode > 127) || (charCode == 34)) {
			var temp = charCode.toString(10);
			while (temp.length < 4) {
				temp = '0' + temp;
			}
			result += '&#' + temp + ';';
		} else {
			result += source.charAt(i);
		}
	}
	return result;
};

/**
 *  Get the class attribute string from the given class.
 * @param {array} - An array of class names to be converted to a class attribute.
 * returns the attribute string with the class names or empty string if no class is passed.
	*
 */
AjxUtil.getClassAttr = function (classes){
	var attr = [];
	if (classes && classes.length > 0) {
		//remove duplicate css classes
		classes = AjxUtil.uniq(classes);
		return ["class='" , classes.join(" "), "'"].join("");
	}
	return "";
};

/**
 * converts datauri string to blob object used for uploading the image
 * @param {dataURI} - datauri string  data:image/png;base64,iVBORw0
 *
 */
AjxUtil.dataURItoBlob =
function (dataURI) {

    if (!(dataURI && typeof window.atob === "function" && typeof window.Blob === "function")) {
        return;
    }

    var dataURIArray = dataURI.split(",");
    if (dataURIArray.length === 2) {
        if (dataURIArray[0].indexOf('base64') === -1) {
            return;
        }
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        try{
            var byteString = window.atob(dataURIArray[1]);
        }
        catch(e){
            return;
        }
        if (!byteString) {
            return;
        }
        // separate out the mime component
        var mimeString = dataURIArray[0].split(':');
        if (!mimeString[1]) {
            return;
        }
        mimeString = mimeString[1].split(';')[0];
        if (mimeString) {
            // write the bytes of the string to an ArrayBuffer
            var byteStringLength = byteString.length,
                ab = new ArrayBuffer(byteStringLength),
                ia = new Uint8Array(ab);
            for (var i = 0; i < byteStringLength; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {"type" : mimeString});
        }
    }

};

AjxUtil.reduce = function(array, callback, opt_initialValue) {
	/* left-over from IE8 support */
	return Array.prototype.reduce.call(array, callback, opt_initialValue);
};


/**
 * Returns a value for the brightness of the given color.
 *
 * @param   {string}    rgb     RGB value as #RRGGBB
 * @returns {number}    number between 0 and 255 (higher is brighter)
 */
AjxUtil.getBrightness = function(rgb) {

	var r, g, b;

	if (rgb && rgb.length === 7 && rgb.indexOf('#') === 0) {
		rgb = rgb.substr(1);
	}
	else {
		return null;
	}

	r = parseInt(rgb.substr(0, 2), 16);
	g = parseInt(rgb.substr(2, 2), 16);
	b = parseInt(rgb.substr(4, 2), 16);

	// http://alienryderflex.com/hsp.html
	return Math.sqrt(
		r * r * .299 +
			g * g * .587 +
			b * b * .114
	);
};

/**
 * Returns the better foreground color based on contrast with the given background color.
 *
 * @param   {string}    bgColor     RGB value as #RRGGBB
 * @returns {string}    'black' or 'white'
 */
AjxUtil.getForegroundColor = function(bgColor) {
	var brightness = AjxUtil.getBrightness(bgColor);
	return (brightness != null && brightness < 130) ? 'white' : 'black';
};

/**
 * Wrapper function to html encode data, this function handles normal string or array of strings
 * and returns encoded data in same format.
 *
 * @param   {string/array}    obj     array or string to html encode
 * @returns {string/array}    html encoded string or array
 */
AjxUtil.htmlEncode = function(obj) {
	if(AjxUtil.isArray(obj)) {
		obj = obj.map(function(item) {
			return AjxStringUtil.htmlEncode(item);
		});
	} else if (AjxUtil.isString(obj)) {
		obj = AjxStringUtil.htmlEncode(obj);
	}

	return obj;
};

/**
 * Wrapper function to html decode data, this function handles normal string or array of strings
 * and returns decoded data in same format.
 *
 * @param   {string/array}    obj     array or string to html decode
 * @returns {string/array}    html decoded string or array
 */
AjxUtil.htmlDecode = function(obj) {
	if(AjxUtil.isArray(obj)) {
		obj = obj.map(function(item) {
			return AjxStringUtil.htmlDecode(item);
		});
	} else if (AjxUtil.isString(obj)) {
		obj = AjxStringUtil.htmlDecode(obj);
	}

	return obj;
};
}
if (AjxPackage.define("ajax.util.AjxText")) {
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


// NOTE: The API for the classes in this file are inspired by the Java text
//		 formatting classes but the implementation was NOT copied or ported
//		 from the Java sources.

//
// Format class
//

/** 
 * Base class for all formats. To format an object, instantiate the
 * format of your choice and call the <code>format</code> method which
 * returns the formatted string.
 * 
 * @private
 */
AjxFormat = function(pattern) {
    if (arguments.length == 0) { return; }
	this._pattern = pattern;
	this._segments = [];
}

/**
 * Returns a string representation of this object.
 * 
 * @return	{string}	a string representation of this object
 */
AjxFormat.prototype.toString = function() { 
	var s = [];
	s.push("pattern=\"",this._pattern,'"');
	if (this._segments.length > 0) {
		s.push(", segments={ ");
		for (var i = 0; i < this._segments.length; i++) {
			if (i > 0) { s.push(", "); }
			s.push(String(this._segments[i]));
		}
		s.push(" }");
	}
	return s.join("");
};

// Static functions

AjxFormat.initialize = function() {
	AjxDateFormat.initialize();
	AjxNumberFormat.initialize();
};

// Public methods

/** 
 * This method does <em>not</em> need to be overridden unless
 * the subclass doesn't use format segments and takes complete 
 * responsibility for formatting.
 */
AjxFormat.prototype.format = function(object) { 
	var s = [];
	for (var i = 0; i < this._segments.length; i++) {
		s.push(this._segments[i].format(object));
	}
	return s.join("");
};

/** 
 * Parses the given string according to this format's pattern and returns
 * an object.
 * <p>
 * <strong>Note:</strong>
 * The default implementation of this method assumes that the sub-class
 * has implemented the <code>_createParseObject</code> method.
 */
AjxFormat.prototype.parse = function(s) {
	var object = this._createParseObject();
	var index = 0;
	for (var i = 0; i < this._segments.length; i++) {
		var segment = this._segments[i];
		index = segment.parse(object, s, index);
	}
	// REVISIT: Should this return null instead?
	if (index < s.length) {
		throw new AjxFormat.ParsingException(this, null, "input too long"); // I18n
	}
	return object;
};

/** 
 * Returns an array of segments that comprise this format. 
 * <p>
 * <strong>Note:</strong>
 * This method is specific to this implementation and does not follow
 * the format classes found in the <code>java.text</code> package.
 */
AjxFormat.prototype.getSegments = function() {
	return this._segments;
};

/** Returns a string pattern for this format. */
AjxFormat.prototype.toPattern = function() {
	return this._pattern;
};

/** Returns a copy of this format. */
AjxFormat.prototype.clone = function() {
	return new this.constructor(this._pattern);
};

// Protected methods

/**
 * Creates the object that is initialized by parsing
 * <p>
 * <strong>Note:</strong>
 * This must be implemented by sub-classes.
 */
AjxFormat.prototype._createParseObject = function(s) {
	throw new AjxFormat.ParsingException(this, null, "not implemented"); // I18n
};

// Protected static methods

AjxFormat._zeroPad = function(s, length, zeroChar, rightSide) {
	s = typeof s == "string" ? s : String(s);

	if (s.length >= length) return s;

	zeroChar = zeroChar || '0';
	
	var a = [];
	for (var i = s.length; i < length; i++) {
		a.push(zeroChar);
	}
	a[rightSide ? "unshift" : "push"](s);

	return a.join("");
};

//
// Format exception base class
//

AjxFormat.FormatException = function(format, message) {
	this._format = format;
	this._message = message;
};
AjxFormat.FormatException.prototype.toString = function() { 
	return this._message; 
};


//
// Formatting exception class
//

AjxFormat.FormattingException = function(format, segment, message) {
	AjxFormat.FormatException.call(this, format, message);
	this._segment = segment;
};
AjxFormat.FormattingException.prototype = new AjxFormat.FormatException;
AjxFormat.FormattingException.prototype.constructor = AjxFormat.FormattingException;


//
// Parsing exception class
//

AjxFormat.ParsingException = function(format, segment, message) {
	AjxFormat.FormatException.call(this, format, message);
	this._segment = segment;
};
AjxFormat.ParsingException.prototype = new AjxFormat.FormatException;
AjxFormat.ParsingException.prototype.constructor = AjxFormat.ParsingException;

//
// Segment class
//

AjxFormat.Segment = function(format, s) {
    if (arguments.length == 0) return;
	this._parent = format;
	this._s = s;
};

AjxFormat.Segment.prototype.toString = function() { 
	return "segment: \""+this._s+'"'; 
};

// Public methods

AjxFormat.Segment.prototype.format = function(o) { 
	return this._s; 
};

/**
 * Parses the string at the given index, initializes the parse object
 * (as appropriate), and returns the new index within the string for
 * the next parsing step.
 * <p>
 * <strong>Note:</strong>
 * This method must be implemented by sub-classes.
 *
 * @param o     [object] The parse object to be initialized.
 * @param s     [string] The input string to be parsed.
 * @param index [number] The index within the string to start parsing.
 */
AjxFormat.Segment.prototype.parse = function(o, s, i) {
	throw new AjxFormat.ParsingException(this._parent, this, "not implemented"); // I18n
};

AjxFormat.Segment.prototype.getFormat = function() {
	return this._parent;
};
AjxFormat.Segment.prototype.toSubPattern = function() {
	return this._s;
};

// Protected methods

AjxFormat.Segment.prototype._getFixedLength = function() {
	var fixedlen;
	if (this._index + 1 < this._parent._segments.length) {
		var nextSegment = this._parent._segments[this._index + 1];
		if (!(nextSegment instanceof AjxFormat.TextSegment)) {
			fixedlen = this._s.length;
		}
	}
	return fixedlen;
};

// Protected static methods

AjxFormat.Segment._parseLiteral = function(literal, s, index) {
	if (s.length - index < literal.length) {
		throw new AjxFormat.ParsingException(this._parent, this, "input too short"); // I18n
	}
	for (var i = 0; i < literal.length; i++) {
		if (literal.charAt(i) != s.charAt(index + i)) {
			throw new AjxFormat.ParsingException(this._parent, this, "input doesn't match"); // I18n
		}
	}
	return index + literal.length;
};

AjxFormat.Segment._parseLiterals = function(o, f, adjust, literals, s, index) {
	for (var i = 0; i < literals.length; i++) {
		try {
			var literal = literals[i];
			var nindex = AjxFormat.Segment._parseLiteral(literal, s, index);
			if (f) {
				var target = o || window;
				if (typeof f == "function") {
					f.call(target, i + adjust);
				}
				else {
					target[f] = i + adjust;
				}
			}
			return nindex;
		}
		catch (e) {
			// ignore. keep trying to find a match
		}
	}
	return -1;
};

/**
 * Parses an integer at the offset of the given string and calls a
 * method on the specified object.
 *
 * @param o         [object]   The target object.
 * @param f         [function|string] The method to call on the target object.
 *                             If this parameter is a string, then it is used
 *                             as the name of the property to set on the
 *                             target object.
 * @param adjust    [number]   The numeric adjustment to make on the
 *                             value before calling the object method.
 * @param s         [string]   The string to parse.
 * @param index     [number]   The index within the string to start parsing.
 * @param fixedlen  [number]   If specified, specifies the required number
 *                             of digits to be parsed.
 * @param radix     [number]   Optional. Specifies the radix of the parse
 *                             string. Defaults to 10 if not specified.
 */
AjxFormat.Segment._parseInt = function(o, f, adjust, s, index, fixedlen, radix) {
	var len = fixedlen || s.length - index;
	var head = index;
	for (var i = 0; i < len; i++) {
		if (!s.charAt(index++).match(/\d/)) {
			index--;
			break;
		}
	}
	var tail = index;
	if (head == tail) {
		throw new AjxFormat.ParsingException(this._parent, this, "number not present"); // I18n
	}
	if (fixedlen && tail - head != fixedlen) {
		throw new AjxFormat.ParsingException(this._parent, this, "number too short"); // I18n
	}
	var value = parseInt(s.substring(head, tail), radix || 10);
	if (f) {
		var target = o || window;
		if (typeof f == "function") {
			f.call(target, value + adjust);
		}
		else {
			target[f] = value + adjust;
		}
	}
	return tail;
};

//
// Date format class
//

/**
 * The AjxDateFormat class formats Date objects according to a specified 
 * pattern. The patterns are defined the same as the SimpleDateFormat
 * class in the Java libraries. <strong>Note:</strong> <em>Only the
 * Gregorian Calendar is supported at this time.</em> Supporting other
 * calendars would require a lot more information downloaded to the
 * client. Limiting dates to the Gregorian calendar is a trade-off.
 * <p>
 * <strong>Note:</strong>
 * The date format differs from the Java patterns a few ways: the pattern
 * "EEEEE" (5 'E's) denotes a <em>short</em> weekday and the pattern "MMMMM"
 * (5 'M's) denotes a <em>short</em> month name. This matches the extended 
 * pattern found in the Common Locale Data Repository (CLDR) found at: 
 * http://www.unicode.org/cldr/.
 *
 * @param {string} pattern The date format pattern.
 *
 * @class
 * @constructor
 */
AjxDateFormat = function(pattern) {
    if (arguments.length == 0) { return; }
	AjxFormat.call(this, pattern);
	if (pattern == null) { return; }
	if (typeof pattern == "number") {
		switch (pattern) {
			case AjxDateFormat.SHORT: pattern = I18nMsg.formatDateShort; break;
			case AjxDateFormat.MEDIUM: pattern = I18nMsg.formatDateMedium; break;
			case AjxDateFormat.LONG: pattern = I18nMsg.formatDateLong; break;
			case AjxDateFormat.FULL: pattern = I18nMsg.formatDateFull; break;
            case AjxDateFormat.NUMBER: pattern = I18nMsg.formatDateNumber; break;
		}
	}	
	for (var i = 0; i < pattern.length; i++) {
		// literal
		var c = pattern.charAt(i);
		if (c == "'") {
			var head = i + 1;
			for (i++ ; i < pattern.length; i++) {
				var c = pattern.charAt(i);
				if (c == "'") {
					if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
						pattern = pattern.substr(0, i) + pattern.substr(i + 1);
					}
					else {
						break;
					}
				}
			}
//			if (i == pattern.length) {
				// NOTE: try to avoid silent errors
//				throw new FormatException(this, "unterminated string literal"); // I18n
//			}
			var tail = i;
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			continue;
		}

		// non-meta chars
		var head = i;
		while(i < pattern.length) {
			c = pattern.charAt(i);
			if (AjxDateFormat._META_CHARS.indexOf(c) != -1 || c == "'") {
				break;
			}
			i++;
		}
		var tail = i;
		if (head != tail) {
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			i--;
			continue;
		}
		
		// meta char
		var head = i;
		while(++i < pattern.length) {
			if (pattern.charAt(i) != c) {
				break;
			}		
		}
		var tail = i--;
		var count = tail - head;
		var field = pattern.substr(head, count);
		var segment = null;
		switch (c) {
			case 'G': segment = new AjxDateFormat.EraSegment(this, field); break;
			case 'y': segment = new AjxDateFormat.YearSegment(this, field); break;
			case 'M': segment = new AjxDateFormat.MonthSegment(this, field); break;
			case 'w': segment = new AjxDateFormat.WeekSegment(this, field); break;
			case 'W': segment = new AjxDateFormat.WeekSegment(this, field); break;
			case 'D': segment = new AjxDateFormat.DaySegment(this, field); break;
			case 'd': segment = new AjxDateFormat.DaySegment(this, field); break;
			case 'F': segment = new AjxDateFormat.WeekdaySegment(this, field); break;
			case 'E': segment = new AjxDateFormat.WeekdaySegment(this, field); break;
			case 'a': segment = new AjxDateFormat.AmPmSegment(this, field); break;
			case 'H': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'k': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'K': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'h': segment = new AjxDateFormat.HourSegment(this, field); break;
			case 'm': segment = new AjxDateFormat.MinuteSegment(this, field); break;
			case 's': segment = new AjxDateFormat.SecondSegment(this, field); break;
			case 'S': segment = new AjxDateFormat.SecondSegment(this, field); break;
			case 'z': segment = new AjxDateFormat.TimezoneSegment(this, field); break;
			case 'Z': segment = new AjxDateFormat.TimezoneSegment(this, field); break;
		}
		if (segment != null) {
			segment._index = this._segments.length;
			this._segments.push(segment);
		}
	}
}
AjxDateFormat.prototype = new AjxFormat;
AjxDateFormat.prototype.constructor = AjxDateFormat;

AjxDateFormat.prototype.toString = function() {
	return "[AjxDateFormat: "+AjxFormat.prototype.toString.call(this)+"]";
};

// Constants

/** Short date/time format style. */
AjxDateFormat.SHORT = 0;
/** Medium date/time format style. */
AjxDateFormat.MEDIUM = 1;
/** Long date/time format style. */
AjxDateFormat.LONG = 2;
/** Full date/time format style. */
AjxDateFormat.FULL = 3;
/** Default date/time format style. */
AjxDateFormat.DEFAULT = AjxDateFormat.MEDIUM;

AjxDateFormat._META_CHARS = "GyMwWDdFEaHkKhmsSzZ";

/** Number date . */
AjxDateFormat.NUMBER = 4;
// Static methods

/**
 * Get a date formatter.
 *
 * @param style The format style.
 * @return {AjxDateFormat} The date formatter.
 *
 * @see {AjxDateFormat.SHORT}
 * @see {AjxDateFormat.MEDIUM}
 * @see {AjxDateFormat.LONG}
 * @see {AjxDateFormat.FULL}
 */
AjxDateFormat.getDateInstance = function(style) {
	// lazily create formatters
	style = style != null ? style : AjxDateFormat.DEFAULT;
	if (!AjxDateFormat._DATE_FORMATTERS[style]) {
		AjxDateFormat._DATE_FORMATTERS[style] = new AjxDateFormat(AjxDateFormat._dateFormats[style]);
	}
	return AjxDateFormat._DATE_FORMATTERS[style];
};

/**
 * Get a time formatter.
 *
 * @param style The format style.
 * @return {AjxDateFormat} The time formatter.
 *
 * @see {AjxDateFormat.SHORT}
 * @see {AjxDateFormat.MEDIUM}
 * @see {AjxDateFormat.LONG}
 * @see {AjxDateFormat.FULL}
 */
AjxDateFormat.getTimeInstance = function(style) {
	// lazily create formatters
	style = style != null ? style : AjxDateFormat.DEFAULT;
	if (!AjxDateFormat._TIME_FORMATTERS[style]) {
		AjxDateFormat._TIME_FORMATTERS[style] = new AjxDateFormat(AjxDateFormat._timeFormats[style]);
	}
	return AjxDateFormat._TIME_FORMATTERS[style];
};

/**
 * Get a date and time formatter.
 *
 * @param dateStyle The format style for the date.
 * @param timeStyle The format style for the time.
 * @return {AjxDateFormat} The date and time formatter. 
 *
 * @see {AjxDateFormat.SHORT}
 * @see {AjxDateFormat.MEDIUM}
 * @see {AjxDateFormat.LONG}
 * @see {AjxDateFormat.FULL}
 */
AjxDateFormat.getDateTimeInstance = function(dateStyle, timeStyle) {
	// lazily create formatters
	dateStyle = dateStyle != null ? dateStyle : AjxDateFormat.DEFAULT;
	timeStyle = timeStyle != null ? timeStyle : AjxDateFormat.DEFAULT;
	var style = dateStyle * 10 + timeStyle;
	if (!AjxDateFormat._DATETIME_FORMATTERS[style]) {
		var pattern = I18nMsg.formatDateTime;
		var params = [ AjxDateFormat._dateFormats[dateStyle], AjxDateFormat._timeFormats[timeStyle] ];
		
		var dateTimePattern = AjxMessageFormat.format(pattern, params);
		AjxDateFormat._DATETIME_FORMATTERS[style] = new AjxDateFormat(dateTimePattern);
	}
	return AjxDateFormat._DATETIME_FORMATTERS[style];
};

/**
 * Format a date. Equivalent to <code>new AjxDateFormat(pattern).format(date)</code>.
 *
 * @param {string} pattern  The format.
 * @param {Date}   date     The date to format.
 * @return {string} The formatted string.
 */
AjxDateFormat.format = function(pattern, date) {
	return new AjxDateFormat(pattern).format(date);
};

/**
 * Parse a date. Equivalent to <code>new AjxDateFormat(pattern).parse(dateStr)</code>.
 *
 * @param {string} pattern  The format.
 * @param {string} dateStr  The input string to parse.
 * @return {Date} The parsed date object.
 */
AjxDateFormat.parse = function(pattern, dateStr) {
	return new AjxDateFormat(pattern).parse(dateStr);
};

AjxDateFormat.initialize = function() {
	// format
	AjxDateFormat._dateFormats = [
		I18nMsg.formatDateShort, I18nMsg.formatDateMedium,
		I18nMsg.formatDateLong, I18nMsg.formatDateFull,I18nMsg.formatDateNumber
	];
	AjxDateFormat._timeFormats = [
		I18nMsg.formatTimeShort, I18nMsg.formatTimeMedium,
		I18nMsg.formatTimeLong, I18nMsg.formatTimeFull
	];
	AjxDateFormat._timeParsers = [];
	for (var i=1, fmt; fmt = I18nMsg["parseTime"+i]; i++) {
		AjxDateFormat._timeParsers.push(new RegExp(fmt,"i"));
	}
	

	AjxDateFormat._DATE_FORMATTERS = {};
	AjxDateFormat._TIME_FORMATTERS = {};
	AjxDateFormat._DATETIME_FORMATTERS = {};

	// segments
	AjxDateFormat.MonthSegment.initialize();
	AjxDateFormat.WeekdaySegment.initialize();
};

// Public methods

/**
 * Parses the given time using one of the AjxDateFormat._timeParsers, which are regexes defined in the properties
 */
AjxDateFormat.parseTime = function(timeStr) {
	for (var i=0; i<AjxDateFormat._timeParsers.length; i++) {
		var result = AjxDateFormat._timeParsers[i].exec(timeStr);
		if (result) {
			var hours = parseInt(result[1],10) || 0;
			var minutes = parseInt(result[2],10) || 0;
			var ampm = result[3];
			if (ampm) {
				var pmChars = I18nMsg.parseTimePMChars;
				if (hours == 12) {
					hours = 0;
				}
				if (pmChars.indexOf(ampm)!=-1) {
					hours += 12;
				}
			}
			if (hours < 24 && minutes < 60) {
				date = new Date();
				date.setHours(hours);
				date.setMinutes(minutes);
				date.setSeconds(0);
				return date;
			}
		}
	}
};

/** 
 * Parses the given string and returns a date. If the string cannot be
 * parsed as a date, <code>null</code> is returned.
 *
 * @param {string} s The string to parse.
 * @return {Date} The parsed date object.
 */
AjxDateFormat.prototype.parse = function(s) {
	var object = null;
	try {
		object = AjxFormat.prototype.parse.call(this, s);
		
		// set the date components in proper order

		// Use day 2 for the initial date - even if the setFullYear call screws up (see Bugzilla@Mozilla,
		// Bug 1079720), it won't get the wrong year.
		var date = new Date(0, 0, 2, 0, 0, 0, 0);
		if (object.year != null) { date.setFullYear(object.year); }
		if (object.month != null) { date.setMonth(object.month); }
		// To insure the same behavior (if object does not set the day), init the day to 1.
		date.setDate(1);
		if (object.dayofmonth != null) { date.setDate(object.dayofmonth); }
		else if (object.dayofyear != null) { date.setMonth(0, object.dayofyear); }
		if (object.hours != null) { date.setHours(object.hours); }
		if (object.minutes != null) { date.setMinutes(object.minutes); }
		if (object.seconds != null) { date.setSeconds(object.seconds); }
		if (object.milliseconds != null) { date.setMilliseconds(object.milliseconds); }
		if (object.ampm != null) {
			var hours = date.getHours();
			if (hours == 12 && object.ampm == 0) {
				hours = 0;
			}
			else if (hours != 12 && object.ampm == 1) {
				hours += 12;
			}
			date.setHours(hours);
		}
        if (object.timezone != null) { date.setMinutes(date.getMinutes() - object.timezone); }
		// TODO: era

		if (isNaN(date.getTime())) {
			return null; //in some cases (see bug 51266) the date is invalid without throwing an exception. return null in this case 
		}

		object = date;
	}
	catch (e) {
        DBG.println(AjxDebug.DBG3, e);
		// do nothing
	}
	return object;
};

// Protected methods

AjxDateFormat.prototype._createParseObject = function() {
	// NOTE: An object to hold the parsed parts is returned instead of
	//       a Date object because setting the day is dependent on which
	//       year is set. For example, if the user parsed "2/29/2008",
	//       which is a leap year, with the pattern "M/d/yyyy", then the
	//       year must be set before the month and date or else the Date
	//       object will roll it over to Mar 1.
	return { 
		year: null, month: null, dayofmonth: null, dayofyear: null,
		hours: null, minutes: null, seconds: null, milliseconds: null,
		ampm: null, era: null, timezone: null
	};
};

//
// Text segment class
//

AjxFormat.TextSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxFormat.TextSegment.prototype = new AjxFormat.Segment;
AjxFormat.TextSegment.prototype.constructor = AjxFormat.TextSegment;

AjxFormat.TextSegment.prototype.toString = function() { 
	return "text: \""+this._s+'"'; 
};

// Public methods

AjxFormat.TextSegment.prototype.parse = function(o, s, index) {
	return AjxFormat.Segment._parseLiteral(this._s, s, index);
};

//
// Date segment class
//

AjxDateFormat.DateSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
}
AjxDateFormat.DateSegment.prototype = new AjxFormat.Segment;
AjxDateFormat.DateSegment.prototype.constructor = AjxDateFormat.DateSegment;

//
// Date era segment class
//

AjxDateFormat.EraSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.EraSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.EraSegment.prototype.constructor = AjxDateFormat.EraSegment;

AjxDateFormat.EraSegment.prototype.toString = function() { 
	return "dateEra: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.EraSegment.prototype.format = function(date) { 
	// NOTE: Only support current era at the moment...
	return I18nMsg.eraAD;
};

//
// Date year segment class
//

AjxDateFormat.YearSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.YearSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.YearSegment.prototype.constructor = AjxDateFormat.YearSegment;

AjxDateFormat.YearSegment.prototype.toString = function() { 
	return "dateYear: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.YearSegment.prototype.format = function(date) { 
	var year = String(date.getFullYear());
	return this._s.length < 4 ? year.substr(year.length - 2) : AjxFormat._zeroPad(year, this._s.length);
};

AjxDateFormat.YearSegment.prototype.parse = function(object, s, index) {
	var fixedlen = this._getFixedLength();
	var nindex = AjxFormat.Segment._parseInt(object, "year", 0, s, index, fixedlen);
	// adjust 2-digit years
	if (nindex - index == 2) {
		if (!AjxDateFormat._2digitStartYear) {
			AjxDateFormat._2digitStartYear = parseInt(AjxMsg.dateParsing2DigitStartYear);
		}
		var syear = AjxDateFormat._2digitStartYear;
		var pyear = parseInt(s.substr(index,2), 10);
		var century = (Math.floor(syear / 100) + (pyear < (syear % 100) ? 1 : 0)) * 100;
		var year = century + pyear;
		object.year = year;
	}
	return nindex;
};

//
// Date month segment class
//

AjxDateFormat.MonthSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.MonthSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.MonthSegment.prototype.constructor = AjxDateFormat.MonthSegment;

AjxDateFormat.MonthSegment.prototype.toString = function() { 
	return "dateMonth: \""+this._s+'"'; 
};

// Static functions

AjxDateFormat.MonthSegment.initialize = function() {
	AjxDateFormat.MonthSegment.MONTHS = {};
	AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT] = [
		AjxMsg.monthJanShort, AjxMsg.monthFebShort, AjxMsg.monthMarShort,
		AjxMsg.monthAprShort, AjxMsg.monthMayShort, AjxMsg.monthJunShort,
		AjxMsg.monthJulShort, AjxMsg.monthAugShort, AjxMsg.monthSepShort,
		AjxMsg.monthOctShort, AjxMsg.monthNovShort, AjxMsg.monthDecShort
	];
	AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM] = [
		I18nMsg.monthJanMedium, I18nMsg.monthFebMedium, I18nMsg.monthMarMedium,
		I18nMsg.monthAprMedium, I18nMsg.monthMayMedium, I18nMsg.monthJunMedium,
		I18nMsg.monthJulMedium, I18nMsg.monthAugMedium, I18nMsg.monthSepMedium,
		I18nMsg.monthOctMedium, I18nMsg.monthNovMedium, I18nMsg.monthDecMedium
	];
	AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG] = [
		I18nMsg.monthJanLong, I18nMsg.monthFebLong, I18nMsg.monthMarLong,
		I18nMsg.monthAprLong, I18nMsg.monthMayLong, I18nMsg.monthJunLong,
		I18nMsg.monthJulLong, I18nMsg.monthAugLong, I18nMsg.monthSepLong,
		I18nMsg.monthOctLong, I18nMsg.monthNovLong, I18nMsg.monthDecLong
	];
};

// Public methods

AjxDateFormat.MonthSegment.prototype.format = function(date) {
	var month = date.getMonth();
	switch (this._s.length) {
		case 1: return String(month + 1);
		case 2: return AjxFormat._zeroPad(month + 1, 2);
		case 3: return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM][month];
		case 5: return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT][month];
	}
	return AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG][month];
};

AjxDateFormat.MonthSegment.prototype.parse = function(object, s, index) {
	var months;
	switch (this._s.length) {
		case 3: 
			months = AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.MEDIUM];
		case 4: 
			months = months || AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.LONG];
		case 5: {
			months = months || AjxDateFormat.MonthSegment.MONTHS[AjxDateFormat.SHORT];
			var nindex = AjxFormat.Segment._parseLiterals(object, "month", 0, months, s, index);
			if (nindex == -1) {
				throw new AjxFormat.ParsingException(this._parent, this, "no match"); // I18n
			}
			return nindex;
		}
	}
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(object, "month", -1, s, index, fixedlen);
};

//
// Date week segment class
//

AjxDateFormat.WeekSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.WeekSegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.WeekSegment.prototype.constructor = AjxDateFormat.WeekSegment;

AjxDateFormat.WeekSegment.prototype.toString = function() { 
	return "weekMonth: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.WeekSegment.prototype.format = function(date) {
	var year = date.getYear();
	var month = date.getMonth();
	var day = date.getDate();
	
	var ofYear = /w/.test(this._s);
	var date2 = new Date(year, ofYear ? 0 : month, 1);

	var week = 0;
	while (true) {
		week++;
		if (date2.getMonth() > month || (date2.getMonth() == month && date2.getDate() >= day)) {
			break;
		}
		date2.setDate(date2.getDate() + 7);
	}

	return AjxFormat._zeroPad(week, this._s.length);
};

AjxDateFormat.WeekSegment.prototype.parse = function(object, s, index) {
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(null, null, 0, s, index, fixedlen)
};

//
// Date day segment class
//

AjxDateFormat.DaySegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.DaySegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.DaySegment.prototype.constructor = AjxDateFormat.DaySegment;

AjxDateFormat.DaySegment.prototype.toString = function() { 
	return "dateDay: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.DaySegment.prototype.format = function(date) {
	var month = date.getMonth();
	var day = date.getDate();
	if (/D/.test(this._s) && month > 0) {
		var year = date.getYear();
		do {
			// set date to first day of month and then go back one day
			var date2 = new Date(year, month, 1);
			date2.setDate(0); 
			
			day += date2.getDate();
			month--;
		} while (month > 0);
	}
	return AjxFormat._zeroPad(day, this._s.length);
};

AjxDateFormat.DaySegment.prototype.parse = function(object, s, index) {
	var fixedlen = this._getFixedLength();
    var dayofmonth = function(day) {
                      if(day > AjxDateUtil.MAX_DAYS_PER_MONTH) { throw new AjxFormat.ParsingException(this._parent, this, "number too long"); }
                      else { object["dayofmonth"] = day; }
                     };
	var pname = /D/.test(this._s) ? "dayofyear" : dayofmonth;
	return AjxFormat.Segment._parseInt(object, pname, 0, s, index, fixedlen);
};

//
// Date weekday segment class
//

AjxDateFormat.WeekdaySegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxDateFormat.DateSegment.call(this, format, s);
};
AjxDateFormat.WeekdaySegment.prototype = new AjxDateFormat.DateSegment;
AjxDateFormat.WeekdaySegment.prototype.constructor = AjxDateFormat.WeekdaySegment;

AjxDateFormat.DaySegment.prototype.toString = function() { 
	return "dateDay: \""+this._s+'"'; 
};

// Static functions

AjxDateFormat.WeekdaySegment.initialize = function() {
	AjxDateFormat.WeekdaySegment.WEEKDAYS = {};
	// NOTE: The short names aren't available in Java so we have to define them.
	AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.SHORT] = [
		AjxMsg.weekdaySunShort, AjxMsg.weekdayMonShort, AjxMsg.weekdayTueShort,
		AjxMsg.weekdayWedShort, AjxMsg.weekdayThuShort, AjxMsg.weekdayFriShort,
		AjxMsg.weekdaySatShort
	];
	AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.MEDIUM] = [
		I18nMsg.weekdaySunMedium, I18nMsg.weekdayMonMedium, I18nMsg.weekdayTueMedium,
		I18nMsg.weekdayWedMedium, I18nMsg.weekdayThuMedium, I18nMsg.weekdayFriMedium,
		I18nMsg.weekdaySatMedium
	];
	AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.LONG] = [
		I18nMsg.weekdaySunLong, I18nMsg.weekdayMonLong, I18nMsg.weekdayTueLong,
		I18nMsg.weekdayWedLong, I18nMsg.weekdayThuLong, I18nMsg.weekdayFriLong,
		I18nMsg.weekdaySatLong
	];
};

// Public methods

AjxDateFormat.WeekdaySegment.prototype.format = function(date) {
	var weekday = date.getDay();
	if (/E/.test(this._s)) {
		var style;
		switch (this._s.length) {
			case 4: style = AjxDateFormat.LONG; break;
			case 5: style = AjxDateFormat.SHORT; break;
			default: style = AjxDateFormat.MEDIUM;
		}
		return AjxDateFormat.WeekdaySegment.WEEKDAYS[style][weekday];
	}
	return AjxFormat._zeroPad(weekday, this._s.length);
};

AjxDateFormat.WeekdaySegment.prototype.parse = function(object, s, index) {
	var weekdays;
	switch (this._s.length) {
		case 3: 
			weekdays = AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.MEDIUM];
		case 4: 
			weekdays = weekdays || AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.LONG];
		case 5: {
			weekdays = weekdays || AjxDateFormat.WeekdaySegment.WEEKDAYS[AjxDateFormat.SHORT];
			var nindex = AjxFormat.Segment._parseLiterals(null, null, 0, weekdays, s, index);
			if (nindex == -1) {
				throw new AjxFormat.ParsingException(this._parent, this, "no match"); // I18n
			}
			return nindex;
		}
	}
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(null, null, 0, s, index, fixedlen);
};

//
// Time segment class
//

AjxDateFormat.TimeSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.TimeSegment.prototype = new AjxFormat.Segment;
AjxDateFormat.TimeSegment.prototype.constructor = AjxDateFormat.TimeSegment;

//
// Time hour segment class
//

AjxDateFormat.HourSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.HourSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.HourSegment.prototype.constructor = AjxDateFormat.HourSegment;

AjxDateFormat.HourSegment.prototype.toString = function() { 
	return "timeHour: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.HourSegment.prototype.format = function(date) {
	//getHours returns 0-23
	var hours = date.getHours();
    if (hours > 12 && /[hK]/.test(this._s)) {
		//changing 13-23 to 1-11 (pm)
		hours -= 12;
	}
    else if (hours == 0 && /[h]/.test(this._s)) {
		//h: 1-12 am/pm
        hours = 12;
    }
	else if (hours === 12 && /K/.test(this._s)) {
		//K: 0-11 am/pm
		hours = 0;
 	}
	else if (hours === 0 && /k/.test(this._s)) {
		//k: 1-24
		hours = 24;
	}
    /***
	// NOTE: This is commented out to match the Java formatter output
	//       but from the comments for these meta-chars, it doesn't
	//       seem right.
	if (/[Hk]/.test(this._s)) {
		hours--;
	}
	/***/
	return AjxFormat._zeroPad(hours, this._s.length);
};

AjxDateFormat.HourSegment.prototype.parse = function(object, s, index) {
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(object, "hours", 0, s, index, fixedlen);
};

//
// Time minute segment class
//

AjxDateFormat.MinuteSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.MinuteSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.MinuteSegment.prototype.constructor = AjxDateFormat.MinuteSegment;

AjxDateFormat.MinuteSegment.prototype.toString = function() { 
	return "timeMinute: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.MinuteSegment.prototype.format = function(date) {
	var minutes = date.getMinutes();
	return AjxFormat._zeroPad(minutes, this._s.length);
};

AjxDateFormat.MinuteSegment.prototype.parse = function(object, s, index) {
	var fixedlen = this._getFixedLength();
	return AjxFormat.Segment._parseInt(object, "minutes", 0, s, index, fixedlen);
};

//
// Time second segment class
//

AjxDateFormat.SecondSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.SecondSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.SecondSegment.prototype.constructor = AjxDateFormat.SecondSegment;

AjxDateFormat.SecondSegment.prototype.toString = function() { 
	return "timeSecond: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.SecondSegment.prototype.format = function(date) {
	var minutes = /s/.test(this._s) ? date.getSeconds() : date.getMilliseconds();
	return AjxFormat._zeroPad(minutes, this._s.length);
};

AjxDateFormat.SecondSegment.prototype.parse = function(object, s, index) {
    var isSeconds = /s/.test(this._s);
    var pname = isSeconds ? "seconds" : "milliseconds";
	var fixedlen = isSeconds ? this._getFixedLength() : 0;
	return AjxFormat.Segment._parseInt(object, pname, 0, s, index, fixedlen);
};

//
// Time am/pm segment class
//

AjxDateFormat.AmPmSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.AmPmSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.AmPmSegment.prototype.constructor = AjxDateFormat.AmPmSegment;

AjxDateFormat.AmPmSegment.prototype.toString = function() { 
	return "timeAmPm: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.AmPmSegment.prototype.format = function(date) {
	var hours = date.getHours();
	return hours < 12 ? I18nMsg.periodAm : I18nMsg.periodPm;
};

AjxDateFormat.AmPmSegment.prototype.parse = function(object, s, index) {
	var periods = [ 
		I18nMsg.periodAm.toLowerCase(), I18nMsg.periodPm.toLowerCase(),
		I18nMsg.periodAm.toUpperCase(), I18nMsg.periodPm.toUpperCase()
	];
	var nindex = AjxFormat.Segment._parseLiterals(object, "ampm", 0, periods, s, index);
	if (nindex == -1) {
		throw new AjxFormat.ParsingException(this._parent, this, "no match"); // I18n
	}
	object.ampm = object.ampm % 2;
	return nindex;
};

//
// Time timezone segment class
//

AjxDateFormat.TimezoneSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxDateFormat.TimezoneSegment.prototype = new AjxDateFormat.TimeSegment;
AjxDateFormat.TimezoneSegment.prototype.constructor = AjxDateFormat.TimezoneSegment;

AjxDateFormat.TimezoneSegment.prototype.toString = function() { 
	return "timeTimezone: \""+this._s+'"'; 
};

// Public methods

AjxDateFormat.TimezoneSegment.prototype.format = function(date) {
	var clientId = date.timezone || AjxTimezone.DEFAULT;
	if (/Z/.test(this._s)) {
		return AjxTimezone.getShortName(clientId);
	}
	return this._s.length < 4 ? AjxTimezone.getMediumName(clientId) : AjxTimezone.getLongName(clientId);
};

//
// Message format class
//

/**
 * Message formatter based on the Java <code>MessageFormat</code> class. 
 * <p>
 * <strong>Note:</strong>
 * This implementation augments Java's <code>MessageFormat</code> patterns
 * to support list formatting. The following forms differ from the originals
 * defined in the JavaDoc for <code>MessageFormat</code>:
 * <pre>
 * <i>FormatElement</i>:
 *       { <i>ArgumentIndex</i> }
 *       { <i>ArgumentIndex</i> , <i>FormatType</i> }
 *       { <i>ArgumentIndex</i> , <i>ListFormatType</i> , <i>FormatType</i> }
 *       { <i>ArgumentIndex</i> , <i>FormatType</i> , <i>FormatStyle</i> }
 *       { <i>ArgumentIndex</i> , <i>ListFormatType , <i>FormatType</i> , <i>FormatStyle</i> }
 * <i>ListFormatType</i>:
 *       list
 * </pre>
 *
 * @param {string} pattern The message format pattern.
 *
 * @class
 * @constructor
 */
AjxMessageFormat = function(pattern) {
    if (arguments.length == 0) { return; }
	AjxFormat.call(this, pattern);
	if (pattern == null) { return; }
	for (var i = 0; i < pattern.length; i++) {
		// literal
		var c = pattern.charAt(i);
		if (c == "'") {
			if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
				var segment = new AjxFormat.TextSegment(this, "'");
				this._segments.push(segment);
				i++;
				continue;
			}
			var head = i + 1;
			for (i++ ; i < pattern.length; i++) {
				var c = pattern.charAt(i);
				if (c == "'") {
					if (i + 1 < pattern.length && pattern.charAt(i + 1) == "'") {
						pattern = pattern.substr(0, i) + pattern.substr(i + 1);
					}
					else {
						break;
					}
				}
			}
//			if (i == pattern.length) {
				// NOTE: try to avoid silent errors
//				throw new AjxFormat.FormatException(this, "unterminated string literal"); // I18n
//)			}
			var tail = i;
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			continue;
		}
		
		// non-meta chars
		var head = i;
		while(i < pattern.length) {
			c = pattern.charAt(i);
			if (c == '{' || c == "'") {
				break;
			}
			i++;
		}
		var tail = i;
		if (head != tail) {
			var segment = new AjxFormat.TextSegment(this, pattern.substring(head, tail));
			this._segments.push(segment);
			i--;
			continue;
		}
		
		// meta char
		var head = i + 1;
		var depth = 0;
		while(++i < pattern.length) {
			var c = pattern.charAt(i);
			if (c == '{') {
				depth++;
			}
			else if (c == '}') {
				if (depth == 0) {
					break;
				}
				depth--;
			}		
		}
		var tail = i;
		var count = tail - head;
		var field = pattern.substr(head, count);
		var segment = new AjxMessageFormat.MessageSegment(this, field);		
		if (segment != null) {
			this._segments.push(segment);
		}
	}
}
AjxMessageFormat.prototype = new AjxFormat;
AjxMessageFormat.prototype.constructor = AjxMessageFormat;

AjxMessageFormat.prototype.toString = function() {
	return "[AjxMessageFormat: "+AjxFormat.prototype.toString.call(this)+"]";
};

// Static methods

/**
 * Format a message pattern with replacement parameters. Equivalent to
 * <code>new AjxMessageFormat(pattern).format(params)</code>.
 *
 * @param {string} pattern  Message pattern.
 * @param {Array}  params   Replacement parameters.
 * @return {string} Formatted message.
 */
AjxMessageFormat.format = function(pattern, params) {
	return new AjxMessageFormat(pattern).format(params);
};

// Public methods

/**
 * Format with replacement parameters.
 *
 * @param {Array}  params   Replacement parameters.
 * @return {string} Formatted message.
 */
AjxMessageFormat.prototype.format = function(params) {
	if (!(params instanceof Array)) {
		params = [ params ];
	}
	return AjxFormat.prototype.format.call(this, params);
};

AjxMessageFormat.prototype.getFormats = function() {
	var formats = [];
	for (var i = 0; i < this._segments.length; i++) {
		var segment = this._segments[i];
		if (segment instanceof AjxMessageFormat.MessageSegment) {
			formats.push(segment.getSegmentFormat());
		}
	}
	return formats;
};
AjxMessageFormat.prototype.getFormatsByArgumentIndex = function() {
	var formats = [];
	for (var i = 0; i < this._segments.length; i++) {
		var segment = this._segments[i];
		if (segment instanceof AjxMessageFormat.MessageSegment) {
			formats[segment.getIndex()] = segment.getSegmentFormat();
		}
	}
	return formats;
};

//
// AjxMessageFormat.MessageSegment class
//

AjxMessageFormat.MessageSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
	var parts = AjxMessageFormat.MessageSegment._split(s, ',');
	this._index = Number(parts[0]);
	this._type = parts[1] || "string";
	this._style = parts[2];
	if (this._type == "list") {
		this._isList = true;
		this._type = parts[2] || "string";
		this._style = parts[3];
	}
	switch (this._type) {
		case "number": {
			switch (this._style) {
				case "integer": this._formatter = AjxNumberFormat.getIntegerInstance(); break;
				case "currency": this._formatter = AjxNumberFormat.getCurrencyInstance(); break;
				case "percent": this._formatter = AjxNumberFormat.getPercentInstance(); break;
				default: this._formatter = this._style == null ? AjxNumberFormat.getInstance() : new AjxNumberFormat(this._style);
			}
			break;
		}
		case "date": case "time": {
			var func = this._type == "date" ? AjxDateFormat.getDateInstance : AjxDateFormat.getTimeInstance;
			switch (this._style) {
				case "short": this._formatter = func(AjxDateFormat.SHORT); break;
				case "medium": this._formatter = func(AjxDateFormat.MEDIUM); break;
				case "long": this._formatter = func(AjxDateFormat.LONG); break;
				case "full": this._formatter = func(AjxDateFormat.FULL); break;
				default: this._formatter = this._style == null ? func(AjxDateFormat.DEFAULT) : new AjxDateFormat(this._style);
			}
			break;
		}
		case "choice": {
			this._formatter = new AjxChoiceFormat(this._style);
			break;
		}
	}
	if (this._isList) {
		this._formatter = new AjxListFormat(this._formatter);
	}	
};
AjxMessageFormat.MessageSegment.prototype = new AjxFormat.Segment;
AjxMessageFormat.MessageSegment.prototype.constructor = AjxMessageFormat.MessageSegment;

AjxMessageFormat.MessageSegment.prototype.toString = function() {
	var a = [ "message: \"", this._s, "\", index: ", this._index ];
	if (this._isList) a.push(", list: ", this._isList);
	if (this._type) a.push(", type: ", this._type);
	if (this._style) a.push(", style: ", this._style);
	if (this._formatter) a.push(", formatter: ", this._formatter.toString());
	return a.join("");
};

// Data

AjxMessageFormat.MessageSegment.prototype._isList = false;

// Public methods

AjxMessageFormat.MessageSegment.prototype.format = function(args) {
	var object = args[this._index];
	if (this._formatter instanceof AjxChoiceFormat) {
		return this._formatter.format(args, this._index);
	}
	return this._formatter ? this._formatter.format(object) : String(object);
};

AjxMessageFormat.MessageSegment.prototype.getIndex = function() {
	return this._index;
};
AjxMessageFormat.MessageSegment.prototype.getType = function() {
	return this._type;
};
AjxMessageFormat.MessageSegment.prototype.getStyle = function() {
	return this._style;
};
AjxMessageFormat.MessageSegment.prototype.getSegmentFormat = function() {
	return this._formatter;
};

// Protected static functions

AjxMessageFormat.MessageSegment._split = function(s, delimiter) {
	var parts = [];
	var head = 0;
	var tail;
	var depth = 0;
	for (tail = 0; tail < s.length; tail++) {
		var c = s.charAt(tail);
		if (c == '{') {
			depth++;
		}
		else if (c == '}') {
			depth--;
		}
		else if (c == delimiter && depth == 0) {
			parts.push(s.substring(head, tail));
			head = tail + 1;
		}
	}
	if (tail > head) {
		parts.push(s.substring(head, tail));
	}
	return parts;
};


//
// AjxNumberFormat class
//

/**
 * Number formatter based on Java's <code>DecimalFormat</code>.
 *
 * @param {string}  pattern       The number pattern.
 * @param {boolean} skipNegFormat Specifies whether to skip the generation of this
 *                                format's negative value formatter.
 *                                <p>
 *                                <strong>Note:</strong>
 *                                This parameter is only used by the implementation
 *                                and should not be passed by application code
 *                                instantiating a custom number format.
 * @class
 * @constructor
 */
AjxNumberFormat = function(pattern, skipNegFormat) {
    if (arguments.length == 0) { return; }
	AjxFormat.call(this, pattern);
	if (!pattern) { return; }

	var patterns = pattern.split(/;/);
	var pattern = patterns[0];
	
	// parse prefix
	var i = 0;
	var results = this.__parseStatic(pattern, i);
	i = results.offset;
	var hasPrefix = results.text != "";
	if (hasPrefix) {
		this._segments.push(new AjxFormat.TextSegment(this, results.text));
	}
	
	// parse number descriptor
	var start = i;
	while (i < pattern.length &&
	       AjxNumberFormat._META_CHARS.indexOf(pattern.charAt(i)) != -1) {
		i++;
	}
	var end = i;

	var numPattern = pattern.substring(start, end);
	var e = numPattern.indexOf('E');
	var expon = e != -1 ? numPattern.substring(e + 1) : null;
	if (expon) {
		numPattern = numPattern.substring(0, e);
		this._showExponent = true;
	}
	
	var dot = numPattern.indexOf(I18nMsg.numberSeparatorDecimal !='' ? I18nMsg.numberSeparatorDecimal : '.');
	var whole = dot != -1 ? numPattern.substring(0, dot) : numPattern;
	if (whole) {
		var comma = whole.lastIndexOf(I18nMsg.numberSeparatorGrouping !='' ? I18nMsg.numberSeparatorGrouping : ',');
		if (comma != -1) {
			this._groupingOffset = whole.length - comma - 1;
		}
		whole = whole.replace(/[^#0]/g,"");
		var zero = whole.indexOf('0');
		if (zero != -1) {
			this._minIntDigits = whole.length - zero;
		}
		this._maxIntDigits = whole.length;
	}
	
	var fract = dot != -1 ? numPattern.substring(dot + 1) : null;
	if (fract) {
		var zero = fract.lastIndexOf('0');
		if (zero != -1) {
			this._minFracDigits = zero + 1;
		}
		this._maxFracDigits = fract.replace(/[^#0]/g,"").length;
	}
	
	this._segments.push(new AjxNumberFormat.NumberSegment(this, numPattern));
	
	// parse suffix
	var results = this.__parseStatic(pattern, i);
	i = results.offset;
	if (results.text != "") {
		this._segments.push(new AjxFormat.TextSegment(this, results.text));
	}
	
	// add negative formatter
	if (skipNegFormat) return;
	
	if (patterns.length > 1) {
		var pattern = patterns[1];
		this._negativeFormatter = new AjxNumberFormat(pattern, true);
	}
	else {
		// no negative pattern; insert minus sign before number segment
		var formatter = new AjxNumberFormat("");
		formatter._segments = formatter._segments.concat(this._segments);

		var index = hasPrefix ? 1 : 0;
		var minus = new AjxFormat.TextSegment(formatter, I18nMsg.numberSignMinus);
		formatter._segments.splice(index, 0, minus);
		
		this._negativeFormatter = formatter;
	}
}
AjxNumberFormat.prototype = new AjxFormat;
AjxNumberFormat.prototype.constructor = AjxNumberFormat;

AjxNumberFormat.prototype.toString = function() {
	var array = [ 
		"[AjxNumberFormat: ", 
		"formatter=", AjxFormat.prototype.toString.call(this) 
	];
	if (this._negativeFormatter) {
		array.push(", negativeFormatter=", this._negativeFormatter.toString());
	}
	array.push(']');
	return array.join("");
};

// Constants

AjxNumberFormat._NUMBER = "number";
AjxNumberFormat._INTEGER = "integer";
AjxNumberFormat._CURRENCY = "currency";
AjxNumberFormat._PERCENT = "percent";

AjxNumberFormat._META_CHARS = "0#.,E";

// Data

AjxNumberFormat.prototype._groupingOffset = Number.MAX_VALUE;
AjxNumberFormat.prototype._minIntDigits = 1;
AjxNumberFormat.prototype._isCurrency = false;
AjxNumberFormat.prototype._isPercent = false;
AjxNumberFormat.prototype._isPerMille = false;
AjxNumberFormat.prototype._showExponent = false;

// Static functions

/**
 * Get general number formatter.
 *
 * @return {AjxNumberFormat} Number formatter.
 */
AjxNumberFormat.getInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER] = new AjxNumberFormat(I18nMsg.formatNumber);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._NUMBER];
};
/**
 * Get general number formatter.
 * <strong>Note:</strong>
 * Same as <code>AjxNumberFormat.getInstance()</code>.
 *
 * @return {AjxNumberFormat} Number formatter.
 */
AjxNumberFormat.getNumberInstance = AjxNumberFormat.getInstance;
/**
 * Get currency number formatter.
 *
 * @return {AjxNumberFormat} Number formatter.
 */
AjxNumberFormat.getCurrencyInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY] = new AjxNumberFormat(I18nMsg.formatNumberCurrency);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._CURRENCY];
};
/**
 * Get integer number formatter.
 *
 * @return {AjxNumberFormat} Number formatter.
 */
AjxNumberFormat.getIntegerInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER] = new AjxNumberFormat(I18nMsg.formatNumberInteger);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._INTEGER];
};
/**
 * Get percent number formatter.
 *
 * @return {AjxNumberFormat} Number formatter.
 */
AjxNumberFormat.getPercentInstance = function() {
	if (!AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT]) {
		AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT] = new AjxNumberFormat(I18nMsg.formatNumberPercent);
	}
	return AjxNumberFormat._FORMATTERS[AjxNumberFormat._PERCENT];
};

/**
 * Formats a number based on a given pattern. Equivalent to
 * <code>new AjxNumberFormat(pattern).format(number)</code>.
 *
 * @param {string}  pattern The format pattern.
 * @param {number}  number  The number to format.
 * @return {string} The formatted number string.
 */
AjxNumberFormat.format = function(pattern, number) {
	return new AjxNumberFormat(pattern).format(number);
};

AjxNumberFormat.initialize = function() {
	AjxNumberFormat._FORMATTERS = {};
};

// Public methods

/**
 * Formats a number.
 *
 * @param {number}  number  The number to format.
 * @return {string} The formatted number string.
 */
AjxNumberFormat.prototype.format = function(number) {
	if (number < 0 && this._negativeFormatter) {
		return this._negativeFormatter.format(number);
	}
	return AjxFormat.prototype.format.call(this, number);
};

// Private methods

AjxNumberFormat.prototype.__parseStatic = function(s, i) {
	var data = [];
	while (i < s.length) {
		var c = s.charAt(i++);
		if (AjxNumberFormat._META_CHARS.indexOf(c) != -1) {
			i--;
			break;
		}
		switch (c) {
			case "'": {
				var start = i;
				while (i < s.length && s.charAt(i++) != "'") {
					// do nothing
				}
				var end = i;
				c = end - start == 0 ? "'" : s.substring(start, end);
				break;
			}
			case '%': {
				c = I18nMsg.numberSignPercent; 
				this._isPercent = true;
				break;
			}
			case '\u2030': {
				c = I18nMsg.numberSignPerMill; 
				this._isPerMille = true;
				break;
			}
			case '\u00a4': {
				c = s.charAt(i) == '\u00a4'
				  ? I18nMsg.currencyCode : I18nMsg.currencySymbol;
				this._isCurrency = true;
				break;
			}
		}
		data.push(c);
	}
	return { text: data.join(""), offset: i };
};

//
// AjxNumberFormat.NumberSegment class
//

AjxNumberFormat.NumberSegment = function(format, s) {
    if (arguments.length == 0) return;
	AjxFormat.Segment.call(this, format, s);
};
AjxNumberFormat.NumberSegment.prototype = new AjxFormat.Segment;
AjxNumberFormat.NumberSegment.prototype.constructor = AjxNumberFormat.NumberSegment;

AjxNumberFormat.NumberSegment.prototype.toString = function() {
	return "number: \""+this._s+"\"";
};

// Public methods

AjxNumberFormat.NumberSegment.prototype.format = function(number) {
	// special values
	if (isNaN(number)) return I18nMsg.numberNaN;
	if (number === Number.NEGATIVE_INFINITY || number === Number.POSITIVE_INFINITY) {
		return I18nMsg.numberInfinity;
	}

	// adjust value
	if (typeof number != "number") number = Number(number);
	number = Math.abs(number); // NOTE: minus sign is part of pattern
	if (this._parent._isPercent) number *= 100;
	else if (this._parent._isPerMille) number *= 1000;

	// format
	var s = this._parent._showExponent
	      ? number.toExponential(this._parent._maxFracDigits).toUpperCase().replace(/E\+/,"E")
	      : number.toFixed(this._parent._maxFracDigits || 0);
	s = this._normalize(s);
	return s;
};

// Protected methods

AjxNumberFormat.NumberSegment.prototype._normalize = function(s) {
	var match = s.split(/[\.Ee]/);
	
	// normalize whole part
	var whole = match.shift();
	if (whole.length < this._parent._minIntDigits) {
		whole = AjxFormat._zeroPad(whole, this._parent._minIntDigits, I18nMsg.numberZero);
	}
	if (whole.length > this._parent._groupingOffset) {
		var a = [];
		
		var i = whole.length - this._parent._groupingOffset;
		while (i > 0) {
			a.unshift(whole.substr(i, this._parent._groupingOffset));
			a.unshift(I18nMsg.numberSeparatorGrouping);
			i -= this._parent._groupingOffset;
		}
		a.unshift(whole.substring(0, i + this._parent._groupingOffset));
		
		whole = a.join("");
	}
	
	// normalize rest
	var fract = '0';
	var expon;

    if(s.match(/\./))
        fract = match.shift();
    else if(s.match(/\e/) || s.match(/\E/))
        expon = match.shift();

    fract = fract.replace(/0+$/,"");
	if (fract.length < this._parent._minFracDigits) {
		fract = AjxFormat._zeroPad(fract, this._parent._minFracDigits, I18nMsg.numberZero, true);
	}
	
	var a = [ whole ];
	if (fract.length > 0) {
		var decimal = this._parent._isCurrency
		            ? I18nMsg.numberSeparatorMoneyDecimal
		            : I18nMsg.numberSeparatorDecimal;
		a.push(decimal, fract);
	}
	if (expon) {
		a.push('E', expon.replace(/^\+/,""));
	}
	
	// return normalize result
	return a.join("");
};

//
// AjxChoiceFormat class
//

/**
 * Choice formatter typically used to format plurals. This class is
 * modeled after Java's <code>ChoiceFormat</code>.
 * <p>
 * The arguments passed to this constructor can be either:
 * <ul>
 * <li>A single argument that represents a string pattern that specifies the 
 *     limits and formats separated by pipe characters (|).
 * <li>Two arguments, an array of limits and and array of format patterns.
 * </ul>
 * <p>
 * For complete details, see the JavaDoc for java.text.ChoiceFormat.
 *
 * @param {string} pattern Format pattern.
 *
 * @class
 * @constructor
 */
AjxChoiceFormat = function(pattern) {
    if (arguments.length == 0) { return; }
	AjxFormat.call(this, pattern);
	if (pattern == null) { return; }
	var choices = pattern.split("|");
	if (arguments.length == 1) {
		this._limits = new Array(choices.length);
		this._lessThan = new Array(choices.length);
		this._formats = new Array(choices.length);
		var regex = new RegExp("^([^#<\u2264]+)([#<\u2264])(.*)$");
		for (var i = 0; i < choices.length; i++) {
			var choice = choices[i];
			var results = regex.exec(choice);
			var limit = results[1];
			var separator = results[2];
			var message = results[3];
			// set limit
			if (limit == '\u221E') {
				this._limits[i] = Number.POSITIVE_INFINITY;
			}
			else if (limit == '-\u221E') {
				this._limits[i] = Number.NEGATIVE_INFINITY;
			}
			else {
				this._limits[i] = parseFloat(limit);
			}
			// set less-than
			this._lessThan[i] = separator == '#' || separator == '\u2264';
			// set format
			this._formats[i] = new AjxMessageFormat(message);
		}
	}
	else {
		this._limits = arguments[0];
		this._lessThan = new Array(arguments[0].length);
		this._formats = arguments[1];
		this._pattern = [];
		for (var i = 0; i < this._formats.length; i++) {
			if (i > 0) {
				this._pattern.push("|");
			}
			this._pattern.push(this._limits[i], '#', this._formats[i]);
			this._lessThan[i] = false;
			this._formats[i] = new AjxMessageFormat(this._formats[i]);
		}
		this._pattern = this._pattern.join("");
	}
}
AjxChoiceFormat.prototype = new AjxFormat;
AjxChoiceFormat.prototype.constructor = AjxChoiceFormat;

AjxChoiceFormat.prototype.toString = function() {
	return [
		"[AjxChoiceFormat: ",
		"limits={ ", this._limits.join(", "), " }, ",
		"formats={ ", this._formats.join(", "), " }, ",
		"lessThan={ ", this._lessThan.join(", "), " }]"
	].join("");
};

// Public methods

AjxChoiceFormat.prototype.getLimits = function() {
	return this._limits;
};
AjxChoiceFormat.prototype.getFormats = function() {
	return this._formats;
};

/**
 * Format a number based on the choice pattern.
 *
 * @param {number|Array} number Specifies the number to format. If called
 *                              from a message segment, this argument is
 *                              the array of arguments passed to the message
 *                              formatter.
 * @param {number}       index  Optional. If called from a message format,
 *                              this argument is the index into the array that
 *                              is passed as the first argument. The value at
 *                              the index in the array is the number to format.
 * @return {string} The formatted choice.
 */
AjxChoiceFormat.prototype.format = function(number, index) {
	var num = number instanceof Array ? number[index] : number;
	var formatter;
	if (isNaN(num) || num < this._limits[0]) {
		formatter = this._formats[0];
	}
	else {
		for (var i = 0; i < this._limits.length - 1; i++) {
			var a = this._limits[i];
			var b = this._limits[i+1];
			var aGEb = num >= a;
			var aLTb = this._lessThan[i+1] ? num < b : num <= b;
			if (aGEb && aLTb) {
				formatter = this._formats[i];
				break;
			}
		}
		if (!formatter) {
			formatter = this._formats[this._formats.length-1];
		}
	}
	return formatter.format(number);
};

//
// AjxListFormat class
//

/**
 * This class allows the user to format a list by applying a specific 
 * format to each object in an array and joining the results. Each formatted
 * item in the list is separated by a list separator string.
 * <p>
 * <strong>Note:</strong>
 * This format is <em>not</em> one of the standard formatter classes 
 * available in Java. 
 *
 * @param {AjxFormat} formatter     The formatter.
 * @param {string}    separator     Optional. The list separator string. If
 *                                  not specified, <code>AjxMsg.separatorList</code> 
 *                                  is used.
 * @param {string}    lastSeparator Optional. The list separator string for
 *                                  the last item in the list (e.g. " and ").
 *                                  If not specified, <code>AjxMsg.separatorListLast</code>
 *                                  is used.
 * @param {string}    twoSeparator	Optional. Separator used if the list consists of 
 * 									exactly two items. If not specified, <code>AjxMsg.listSeparatorTwo</code>
 * 									is used.	
 */
AjxListFormat = function(formatter, separator, lastSeparator, twoSeparator) {
	AjxFormat.call(this, formatter ? formatter.toPattern() : "");
	this._formatter = formatter;
	this._separator = separator || AjxMsg.listSeparator;
	this._lastSeparator = lastSeparator || AjxMsg.listSeparatorLast;
	this._twoSeparator = twoSeparator || AjxMsg.listSeparatorTwo;
}
AjxListFormat.prototype = new AjxFormat;
AjxListFormat.prototype.constructor = AjxListFormat;

// Public methods

/**
 * Formats a list of items.
 *
 * @param {Array} array Array of objects to be formatted in a list.
 * @return {string} The formatted list string.
 */
AjxListFormat.prototype.format = function(array) {
	array = array instanceof Array ? array : [ array ];
	var list = [];
	var num = array.length;
	for (var i = 0; i < num; i++) {
		if (i > 0) {
			list.push((i < num - 1) ? this._separator : (num == 2) ?
					this._twoSeparator : this._lastSeparator);
		}
		var item = array[i];
		list.push(this._formatter ? this._formatter.format(item) : String(item));
	}
	return list.join("");
};

//
// INITIALIZE
//

AjxFormat.initialize();
}
if (AjxPackage.define("ajax.util.AjxVector")) {
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

// AjxVector class

/**
 * Creates a vector.
 * @class
 * This class represents a vector.
 * 
 */
AjxVector = function(array) {
	this._array = array || [];
};

AjxVector.prototype.isAjxVector = true;

/**
 * Returns a string representation of the object.
 * 
 * @param	{string}	sep		the seperator
 * @param	{boolean}	compress	if <code>true</code>, compress
 * 
 * @return	{string}	a string representation of the object
 */
AjxVector.prototype.toString =
function(sep, compress) {
	if (compress !== true)
		return this._array.join(sep);

	var a = new Array();
	for (var i = 0; i < this._array.length; i++) {
		var x = this._array[i];
		if  (x != undefined && x != null && x != "")
			a.push(x);
	}
	return a.join(sep);
};

/**
 * Creates a vector from a given array.
 * 
 * @param	{array}	list		an array
 * @return	{AjxVector}		the vector
 */
AjxVector.fromArray =
function(list) {
	var vec = new AjxVector();
	if (AjxUtil.isArray1(list)) {
		vec._array = list;
	}
	return vec;
};

/**
 * Gets the size of the vector.
 * 
 * @return	{number}	the size
 */
AjxVector.prototype.size =
function() {
	return this._array.length;
};

/**
 * Adds a object to the vector.
 * 
 * @param	{Object}	obj		the object
 * @param	{number}		index	the index where to add
 * @param	{boolean}	noDuplicates	if <code>true</code>, confirm the object is not in vector before adding
 */
AjxVector.prototype.add =
function(obj, index, noDuplicates) {
	// if no duplicates, search for the obj in list and return if found.
	if (noDuplicates && this.contains(obj)) {
		return;
	}

	AjxUtil.arrayAdd(this._array, obj, index);
};

/**
 * Adds the given array.
 * 
 * @param	{array}		list		an array
 */
AjxVector.prototype.addList =
function(list) {
	if (!list) return;

	if (list.length) {// array
		this._array = this._array.concat(list);
	} else if (list.size && list.size()) {// AjxVector
		// in new window, IE seems to lose its rtti :(
		if (AjxEnv.isIE && (!(list._array instanceof Array))) {
			var newList = [];
			for (var i = 0; i < list._array.length; i++) {
				newList.push(list._array[i]);
			}
			list._array = newList;
		}

		this._array = this._array.concat(list._array);
	}
};

/**
 * Removes the object.
 * 
 * @param	{Object}	obj		the object to remove
 * @return	{boolean}	<code>true</code> if the object is removed
 */
AjxVector.prototype.remove =
function(obj) {
	return AjxUtil.arrayRemove(this._array, obj);
};

/**
 * Removes the object at the given index.
 * 
 * @param	{number}	index		the index
 * @return	{Object}	the object at the index or <code>null</code> if no object at index
 */
AjxVector.prototype.removeAt =
function(index) {
	if (index >= this._array.length || index < 0)
		return null;

	var delArr = this._array.splice(index, 1);
	var ret = null;
	if (delArr) {
		ret = delArr[0];
	}
	return ret;
};

/**
 * Removes all objects from vector.
 * 
 */
AjxVector.prototype.removeAll =
function() {
	// Actually blow away the array items so that garbage
	// collection can take place (XXX: does this really force GC?)
	for (var i = 0; i < this._array.length; i++)
		this._array[i] = null;
	this._array.length = 0;
};

/**
 * Removes the last object in the vector.
 * 
 */
AjxVector.prototype.removeLast =
function() {
	return this._array.length > 0 ? this._array.pop() : null;
};

/**
 * Reverses the order of the objects in the vector.
 * 
 */
AjxVector.prototype.reverse =
function() {
	this._array.reverse();
};

/**
 * Replaces the object at a given index.
 * 
 * @param	{number}	index		the index
 * @param	{Object}	newObj	the new object
 * @return	{Object}	the old object
 */
AjxVector.prototype.replace =
function(index, newObj) {
	var oldObj = this._array[index];
	this._array[index] = newObj;
	return oldObj;
};

/**
 * Replaces an object.
 * 
 * @param	{Object}	obj		the object to replace
 * @param	{Object}	newObj	the new object
 * @return	{Object}	the replaced object or <code>null</code> if not replaced
 */
AjxVector.prototype.replaceObject =
function(obj, newObj) {
	for (var i = 0; i < this._array.length; i++) {
		if (this._array[i] == obj) {
			this._array[i] = newObj;
			return obj;
		}
	}
	return null;
};

/**
 * Returns the index of the obj given w/in vector
 *
 * @param {Object}	    obj			the object being looked for
 * @param {function}	func	    (optional) a function for transforming objects
 *
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.indexOf = function(obj, func) {

	if (obj == null) {
		return -1;
	}
    obj = func ? func.call(obj) : obj;

	for (var i = 0; i < this._array.length; i++) {
        var member = this._array[i],
            test = func ? func.call(member) : member;
		if (test === obj) {
			return i;
		}
	}
	return -1;
};

AjxVector.prototype.indexOfLike = AjxVector.prototype.indexOf;

/**
 * Returns the last index of the obj given w/in vector
 *
 * @param {Object}	    obj			the object being looked for
 * @param {function}	func	    (optional) a function for transforming objects
 *
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.lastIndexOf = function(obj, func) {

	if (obj == null) {
		return -1;
	}
    obj = func ? func.call(obj) : obj;

	for (var i = this._array.length - 1; i >= 0; i--) {
        var member = this._array[i],
            test = func ? func.call(member) : member;
		if (member === obj) {
			return i;
		}
	}
	return -1;
};

AjxVector.prototype.lastIndexOfLike = AjxVector.prototype.lastIndexOf;

/**
 * Returns the last index of the obj given w/in vector
 *
 * @param {Object}	obj			the object being looked for
 * @param {function}	keyFunc	a function for transforming objects
 * @return	{number}	the index or -1 if not found
 */
AjxVector.prototype.lastIndexOfLike =
function(obj, keyFunc) {
	var value = keyFunc.call(obj);

	for (var i = this._array.length - 1; i >= 0; i--) {
		var test = keyFunc.call(this._array[i]);
		if (test == value)
			return i;
	}
	return -1;
};

/**
 * Clones the vector.
 * 
 * @return	{AjxVector}	the new vector
 */
AjxVector.prototype.clone =
function() {
	var vec = new AjxVector();
	vec.addList(this);
	return vec;
};

/**
 * Checks if the vector contains an object.
 * 
 * @param	{Object}	obj		the object
 * @return	{boolean}	<code>true</code> if the object is found
 */
AjxVector.prototype.contains =
function(obj) {
	return AjxUtil.arrayContains(this._array, obj);
};


/**
 * Returns true if the vector contains the given object, using the given
 * function to compare objects. The comparison function should return a
 * type for which the equality test (==) is meaningful, such as a string
 * or a base type.
 *
 * @param {Object}	obj			the object being looked for
 * @param {function}	keyFunc	a function for transforming objects
 * @return	{boolean}	<code>true</code> if the object is found
 */
AjxVector.prototype.containsLike =
function(obj, keyFunc) {
	var value = keyFunc.call(obj);
	for (var i = 0; i < this._array.length; i++) {
		var test = keyFunc.call(this._array[i]);
		if (test == value)
			return true;
	}
	return false;
};

/**
 * Gets the object at a given index.
 * 
 * @param	{number}	index		the index
 * @return	{Object}	the object or <code>null</code> if not found
 */
AjxVector.prototype.get =
function(index) {
	return index >= this._array.length || index < 0
		? null : this._array[index];
};

/**
 * Gets an array of the vector.
 * 
 * @return	{array}	an array
 */
AjxVector.prototype.getArray =
function() {
	return this._array;
};

/**
 * Gets the last object in the vector.
 * 
 * @return	{Object}	the object or <code>null</code> if vector is empty
 */
AjxVector.prototype.getLast =
function() {
	return this._array.length == 0
		? null : this._array[this._array.length-1];
};

/**
 * Gets the next object in the vector after a given object.
 * 
 * @param	{Object}	obj		the object
 * @return	{Object}	the object or <code>null</code> if object not found
 */
AjxVector.prototype.getNext =
function(obj) {
	var idx = this.indexOf(obj);
	if (idx == -1)
		return null;
	return this.get(++idx);
};

/**
 * Gets the previous object in the vector before a given object.
 * 
 * @param	{Object}	obj		the object
 * @return	{Object}	the object or <code>null</code> if object not found
 */
AjxVector.prototype.getPrev =
function(obj) {
	var idx = this.indexOf(obj);
	if (idx == -1)
		return null;
	return this.get(--idx);
};

/**
 * Sorts the vector.
 * 
 * @param	{function}	sortFunc		the function
 */
AjxVector.prototype.sort =
function(sortFunc) {
	if (!sortFunc) {
		sortFunc = AjxVector._defaultArrayComparator;
	}
	this._array.sort(sortFunc);
};

/**
 * Performs a binary search.
 * 
 * @param	{Object}	valueToFind		the value
 * @param	{function}	sortFunc		the sort function
 * @return	{number}	the index
 */
AjxVector.prototype.binarySearch =
function(valueToFind, sortFunc) {
	if (!sortFunc) {
		sortFunc = AjxVector._defaultArrayComparator;
	}

	var l = 0;
	var arr = this._array;
	var u = arr.length - 1;

	while(true) {
		if (u < l) {
			return -1;
		}

		var i = Math.floor((l + u)/ 2);
		var comparisonResult = sortFunc(valueToFind, arr[i]);

		if (comparisonResult < 0) {
			u = i - 1;
		} else if (comparisonResult > 0) {
			l = i + 1;
		} else {
			return i;
		}
	}
};

AjxVector.prototype.merge =
function(offset, list) {

	if (offset < 0)
		return;

	var rawList = list instanceof AjxVector ? list.getArray() : list;

	var limit = this._array.length < (offset+rawList.length)
		? this._array.length
		: offset+rawList.length;

	if (offset < this._array.length) {
		// replace any overlapping items in vector
		var count = 0;
		for (var i=offset; i<limit; i++)
			this._array[i] = rawList[count++];

		// and append the rest
		if (count < rawList.length)
			this._array = this._array.concat(rawList.slice(count));
	} else {
		// otherwise, just append the raw list to the end
		this._array = this._array.concat(rawList);
	}
};


// Static methods

AjxVector._defaultArrayComparator =
function(a, b) {
	return a < b ? -1 : (a > b ? 1 : 0);
};

// Apply function f for each element of the array.  Optionally call it
// in the context of obj object.  If "f" is a string, then for each
// non-null array element call its "f" member function.
AjxVector.prototype.foreach = function(f, obj) {
	var l = this.size(), i = 0, el;
	if (typeof f == "function") {
		while (--l >= 0)
			f.call(obj, this.get(i), i++);
	} else {
		while (--l >= 0) {
			el = this.get(i++);
			if (el != null)
				el[f].call(el); // assuming function
		}
	}
};

/**
 * Return a new AjxVector which contains the results of calling f
 * (optionally in the context obj) for each element of this array.
 * <ul>
 * <li>If "f" is a string, then for each element el:
 * <ul>
 * <li>if el[f] is a function, call el[f] and push the result in the returned array.</li>
 * <li>otherwise push el[f]</li>
 * </ul>
 * </li>
 * </ul>
 * 
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
 * @return	{AjxVector}		the resulting vector
 */
AjxVector.prototype.map = function(f, obj) {
	var a = [], i = this.size(), el;
	if (typeof f == "function") {
		while (--i >= 0)
			a[i] = f.call(obj, this.get(i), i);
	} else if (f instanceof AjxCallback) {
		while (--i >= 0)
			a[i] = f.run(this.get(i), i);
	} else {
		while (--i >= 0) {
			el = this.get(i);
			if (el != null) {
				if (typeof el[f] == "function")
					a.unshift(el[f].call(el));
				else
					a.unshift(el[f]);
			}
		}
	}
	return AjxVector.fromArray(a);
};

/**
 * Returns an AjxVector with all the members of the given array for which the
 * filtering function returns true.
 *
 * @param {Function}    func        filtering function
 * @param {Object}      context     scope for filtering function
 *
 * @returns {Array} array of members for which the filtering function returns true
 */
AjxVector.prototype.filter = function(func, context) {
	return AjxVector.fromArray(AjxUtil.filter(this._array, func, context));
};

/**
 * Joins the vector.
 * 
 * @param	{string}	sep		the string separator
 * @return	{string}	a string representation of the vector
 */
AjxVector.prototype.join = function(sep) {
	return this._array.join(sep);
};

/**
 * Return true if the given function returns true for a member of this vector,
 * otherwise false.
 *
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
*/
AjxVector.prototype.some =
function(f, obj) {
	return this._array.some(f, obj);
};


/**
 * Return a new AjxVector containing the elements from this vector
 * except those for which f(el) returns true.  Otherwise said,
 * "SUBtracts" from this vector those elements for which f(el) returns true.
 *
 * @param	{function}	f 	the function
 * @param	{Object}	obj		the obj context
 * @return	{AjxVector}		the resulting vector
 */
AjxVector.prototype.sub = function(f, obj) {
	var a = [], l = this.size(), i = 0, el;
	while (--l >= 0) {
		el = this.get(i++);
		if (!f.call(obj, el, i))
			a.push(el);
	}
	return AjxVector.fromArray(a);
};

AjxVector.prototype.slice =
function(start, end) {
	return AjxVector.fromArray(this._array.slice(start, end));
};
}
if (AjxPackage.define("ajax.util.AjxStringUtil")) {
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
 * Default constructor does nothing (static class).
 * @constructor
 * @class
 * This class provides static methods to perform miscellaneous string-related utility functions.
 *
 * @author Ross Dargahi
 * @author Roland Schemers
 * @author Conrad Damon
 */
AjxStringUtil = function() {};

AjxStringUtil.TRIM_RE = /^\s+|\s+$/g;
AjxStringUtil.COMPRESS_RE = /\s+/g;
AjxStringUtil.ELLIPSIS = " ... ";
AjxStringUtil.ELLIPSIS_NO_SPACE = "...";
AjxStringUtil.LIST_SEP = ", ";

AjxStringUtil.CRLF = "\r\n";
AjxStringUtil.CRLF2 = "\r\n\r\n";
AjxStringUtil.CRLF_HTML = "<br>";
AjxStringUtil.CRLF2_HTML = "<div><br></div><div><br></div>";

//Regex for image tag having src starting with cid:
AjxStringUtil.IMG_SRC_CID_REGEX = /<img([^>]*)\ssrc=["']cid:/gi;

AjxStringUtil.makeString =
function(val) {
	return val ? String(val) : "";
};

/**
 * Capitalizes the specified string by upper-casing the first character
 * and lower-casing the rest of the string.
 *
 * @param {string} str  The string to capitalize.
 */
AjxStringUtil.capitalize = function(str) {
	return str && str.length > 0 ? str.charAt(0).toUpperCase() + str.substr(1).toLowerCase() : "";
};

/**
 * Capitalizes the specified string by upper-casing the first character.
 * Unlike AjxStringUtil.capitalize - don't change the rest of the letters.
 *
 * @param {string} str  The string to capitalize.
 */
AjxStringUtil.capitalizeFirstLetter = function(str) {
	return str && str.length > 0 ? str.charAt(0).toUpperCase() + str.substr(1) : "";
};


/**
 * Capitalizes all the words in the specified string by upper-casing the first
 * character of each word (does not change following characters, so something like MTV stays MTV
 *
 * @param {string} str  The string to capitalize.
 */
AjxStringUtil.capitalizeWords = function(str) {
    return str ? AjxUtil.map(str.split(/\s+/g), AjxStringUtil.capitalizeFirstLetter).join(" ") : "";
};

/**
 * Converts the given text to mixed-case. The input text is one or more words
 * separated by spaces. The output is a single word in mixed (or camel) case.
 * 
 * @param {string}	text		text to convert
 * @param {string|RegEx}	sep		text separator (defaults to any space)
 * @param {boolean}	camel		if <code>true</code>, first character of result is lower-case
 * @return	{string}	the resulting string
 */
AjxStringUtil.toMixed =
function(text, sep, camel) {
	if (!text || (typeof text != "string")) { return ""; }
	sep = sep || /\s+/;
	var wds = text.split(sep);
	var newText = [];
	newText.push(camel ? wds[0].toLowerCase() : wds[0].substring(0, 1).toUpperCase() + wds[0].substring(1).toLowerCase());
	for (var i = 1; i < wds.length; i++) {
		newText.push(wds[i].substring(0, 1).toUpperCase() + wds[i].substring(1).toLowerCase());
	}
	return newText.join("");
};

/**
 * Converts the given mixed-case text to a string of one or more words
 * separated by spaces.
 *
 * @param {string} text The mixed-case text.
 * @param {string} sep  (Optional) The separator between words. Default
 *                      is a single space.
 */
AjxStringUtil.fromMixed = function(text, sep) {
    sep = ["$1", sep || " ", "$2"].join("");
    return AjxStringUtil.trim(text.replace(/([a-z])([A-Z]+)/g, sep));
};

/**
 * Removes white space from the beginning and end of a string, optionally compressing internal white space. By default, white
 * space is defined as a sequence of  Unicode whitespace characters (\s in regexes). Optionally, the user can define what
 * white space is by passing it as an argument.
 *
 * <p>TODO: add left/right options</p>
 *
 * @param {string}	str      	the string to trim
 * @param {boolean}	compress 	whether to compress internal white space to one space
 * @param {string}	space    	a string that represents a user definition of white space
 * @return	{string}	a trimmed string
 */
AjxStringUtil.trim =
function(str, compress, space) {

	if (!str) {return "";}

	var trim_re = AjxStringUtil.TRIM_RE;

	var compress_re = AjxStringUtil.COMPRESS_RE;
	if (space) {
		trim_re = new RegExp("^" + space + "+|" + space + "+$", "g");
		compress_re = new RegExp(space + "+", "g");
	} else {
		space = " ";
	}
	str = str.replace(trim_re, '');
	if (compress) {
		str = str.replace(compress_re, space);
	}

	return str;
};

/**
 * Returns the string repeated the given number of times.
 *
 * @param {string}	str		a string
 * @param {number}	num		number of times to repeat the string
 * @return	{string}	the string
 */
AjxStringUtil.repeat =
function(str, num) {
	var text = "";
	for (var i = 0; i < num; i++) {
		text += str;
	}
	return text;
};

/**
 * Gets the units from size string.
 * 
 * @param	{string}	sizeString	the size string
 * @return	{string}	the units
 */
AjxStringUtil.getUnitsFromSizeString =
function(sizeString) {
	var units = "px";
	if (typeof(sizeString) == "string") {
		var digitString = Number(parseInt(sizeString,10)).toString();
		if (sizeString.length > digitString.length) {
			units = sizeString.substr(digitString.length, (sizeString.length-digitString.length));
			if (!(units=="em" || units=="ex" || units=="px" || units=="in" || units=="cm" == units=="mm" || units=="pt" || units=="pc" || units=="%")) {
				units = "px";
			}
		}
	}
	return units;
};

/**
* Splits a string, ignoring delimiters that are in quotes or parentheses. Comma
* is the default split character, but the user can pass in a string of multiple
* delimiters. It can handle nested parentheses, but not nested quotes.
*
* <p>TODO: handle escaped quotes</p>
*
* @param {string} str	the string to split
* @param {string}	[dels]	an optional string of delimiter characters
* @return	{array}	an array of strings
*/
AjxStringUtil.split =
function(str, dels) {

	if (!str) {return [];}
	var i = 0;
	dels = dels ? dels : ',';
	var isDel = new Object();
	if (typeof dels == 'string') {
		isDel[dels] = 1;
	} else {
		for (i = 0; i < dels.length; i++) {
			isDel[dels[i]] = 1;
		}
	}

	var q = false;
	var p = 0;
	var start = 0;
	var chunk;
	var chunks = [];
	var j = 0;
	for (i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		if (c == '"') {
			q = !q;
		} else if (c == '(') {
			p++;
		} else if (c == ')') {
			p--;
		} else if (isDel[c]) {
			if (!q && !p) {
				chunk = str.substring(start, i);
				chunks[j++] = chunk;
				start = i + 1;
			}
		}
	}
	chunk = str.substring(start, str.length);
	chunks[j++] = chunk;

	return chunks;
};

AjxStringUtil.SPACE_WORD_RE = new RegExp("\\s*\\S+", "g");
/**
 * Splits the line into words, keeping leading whitespace with each word.
 *
 * @param {string}	line	the text to split
 *
 * @return {array} the array of words
 */
AjxStringUtil.splitKeepLeadingWhitespace =
function(line) {
	var words = [], result;
	while (result = AjxStringUtil.SPACE_WORD_RE.exec(line)) {
		words.push(result[0]);
	}
	return words;
};

AjxStringUtil.WRAP_LENGTH				= 80;
AjxStringUtil.HDR_WRAP_LENGTH			= 120;
AjxStringUtil.MAX_HTMLNODE_COUNT		= 250;

// ID for a BLOCKQUOTE to mark it as ours
AjxStringUtil.HTML_QUOTE_COLOR			= "#1010FF";
AjxStringUtil.HTML_QUOTE_STYLE			= "color:#000;font-weight:normal;font-style:normal;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:12pt;";
AjxStringUtil.HTML_QUOTE_PREFIX_PRE		= '<blockquote style="border-left:2px solid ' +
									 AjxStringUtil.HTML_QUOTE_COLOR +
									 ';margin-left:5px;padding-left:5px;'+
									 AjxStringUtil.HTML_QUOTE_STYLE +
									 '">';
AjxStringUtil.HTML_QUOTE_PREFIX_POST	= '</blockquote>';
AjxStringUtil.HTML_QUOTE_NONPREFIX_PRE	= '<div style="' +
									 AjxStringUtil.HTML_QUOTE_STYLE +
									 '">';
AjxStringUtil.HTML_QUOTE_NONPREFIX_POST	= '</div><br/>';

/**
 * Wraps text to the given length and optionally quotes it. The level of quoting in the
 * source text is preserved based on the prefixes. Special lines such as email headers
 * always start a new line.
 *
 * @param {hash}	params	a hash of parameters
 * @param {string}      text 				the text to be wrapped
 * @param {number}      len					the desired line length of the wrapped text, defaults to 80
 * @param {string}      prefix				an optional string to prepend to each line (useful for quoting)
 * @param {string}      before				text to prepend to final result
 * @param {string}      after				text to append to final result
 * @param {boolean}		preserveReturns		if true, don't combine small lines
 * @param {boolean}		isHeaders			if true, we are wrapping a block of email headers
 * @param {boolean}		isFlowed			format text for display as flowed (RFC 3676)
 * @param {boolean}		htmlMode			if true, surround the content with the before and after
 *
 * @return	{string}	the wrapped/quoted text
 */
AjxStringUtil.wordWrap =
function(params) {

	if (!(params && params.text)) { return ""; }

	var text = params.text;
	var before = params.before || "";
	var after = params.after || "";
	var isFlowed = params.isFlowed;

	// For HTML, just surround the content with the before and after, which is
	// typically a block-level element that puts a border on the left
	if (params.htmlMode) {
		before = params.before || (params.prefix ? AjxStringUtil.HTML_QUOTE_PREFIX_PRE : AjxStringUtil.HTML_QUOTE_NONPREFIX_PRE);
		after = params.after || (params.prefix ? AjxStringUtil.HTML_QUOTE_PREFIX_POST : AjxStringUtil.HTML_QUOTE_NONPREFIX_POST);
		return [before, text, after].join("");
	}

	var max = params.len || (params.isHeaders ? AjxStringUtil.HDR_WRAP_LENGTH : AjxStringUtil.WRAP_LENGTH);
	var prefixChar = params.prefix || "";
	var eol = "\n";

	var lines = text.split(AjxStringUtil.SPLIT_RE);
	var words = [];

	// Divides lines into words. Each word is part of a hash that also has
	// the word's prefix, whether it's a paragraph break, and whether it
	// needs to be preserved at the start or end of a line.
	for (var l = 0, llen = lines.length; l < llen; l++) {
		var line = lines[l];
		// get this line's prefix
		var m = line.match(/^([\s>\|]+)/);
		var prefix = m ? m[1] : "";
		if (prefix) {
			line = line.substr(prefix.length);
		}
		if (AjxStringUtil._NON_WHITESPACE.test(line)) {
			var wds = AjxStringUtil.splitKeepLeadingWhitespace(line);
			if (wds && wds[0] && wds[0].length) {
				var mustStart = AjxStringUtil.MSG_SEP_RE.test(line) || AjxStringUtil.COLON_RE.test(line) ||
								AjxStringUtil.HDR_RE.test(line) || params.isHeaders || AjxStringUtil.SIG_RE.test(line);
				var mustEnd = params.preserveReturns;
				if (isFlowed) {
					var m = line.match(/( +)$/);
					if (m) {
						wds[wds.length - 1] += m[1];	// preserve trailing space at end of line
						mustEnd = false;
					}
					else {
						mustEnd = true;
					}
				}
				for (var w = 0, wlen = wds.length; w < wlen; w++) {
					words.push({
						w:			wds[w],
						prefix:		prefix,
						mustStart:	(w === 0) && mustStart,
						mustEnd:	(w === wlen - 1) && mustEnd
					});
				}
			}
		} else {
			// paragraph marker
			words.push({
				para:	true,
				prefix:	prefix
			});
		}
	}

	// Take the array of words and put them back together. We break for a new line
	// when we hit the max line length, change prefixes, or hit a word that must start a new line.
	var result = "", curLen = 0, wds = [], curPrefix = null;
	for (var i = 0, len = words.length; i < len; i++) {
		var word = words[i];
		var w = word.w, prefix = word.prefix;
		var addPrefix = !prefixChar ? "" : curPrefix ? prefixChar : prefixChar + " ";
		var pl = (curPrefix === null) ? 0 : curPrefix.length;
		pl = 0;
		var newPrefix = addPrefix + (curPrefix || "");
		if (word.para) {
			// paragraph break - output what we have, then add a blank line
			if (wds.length) {
				result += newPrefix + wds.join("").replace(/^ +/, "") + eol;
			}
			if (i < words.length - 1) {
				curPrefix = prefix;
				addPrefix = !prefixChar ? "" : curPrefix ? prefixChar : prefixChar + " ";
				newPrefix = addPrefix + (curPrefix || "");
				result += newPrefix + eol;
			}
			wds = [];
			curLen = 0;
			curPrefix = null;
		} else if ((pl + curLen + w.length <= max) && (prefix === curPrefix || curPrefix === null) && !word.mustStart) {
			// still room left on the current line, add the word
			wds.push(w);
			curLen += w.length;
			curPrefix = prefix;
			if (word.mustEnd && words[i + 1]) {
				words[i + 1].mustStart = true;
			}
		} else {
			// no more room - output what we have and start a new line
			if (wds.length) {
				result += newPrefix + wds.join("").replace(/^ +/, "") + eol;
			}
			wds = [w];
			curLen = w.length;
			curPrefix = prefix;
			if (word.mustEnd && words[i + 1]) {
				words[i + 1].mustStart = true;
			}
		}
	}

	// handle last line
	if (wds.length) {
		var addPrefix = !prefixChar ? "" : wds[0].prefix ? prefixChar : prefixChar + " ";
		var newPrefix = addPrefix + (curPrefix || "");
		result += newPrefix + wds.join("").replace(/^ /, "") + eol;
	}

	return [before, result, after].join("");
};

/**
 * Quotes text with the given quote character. For HTML, surrounds the text with the
 * given strings. Does no wrapping.
 *
 * @param {hash}	params	a hash of parameters
 * @param {string}      params.text 				the text to be wrapped
 * @param {string}      [params.pre]				prefix for quoting
 * @param {string}      [params.before]				text to prepend to final result
 * @param {string}      [params.after]				text to append to final result
 *
 * @return	{string}	the quoted text
 */
AjxStringUtil.quoteText =
function(params) {

	if (!(params && params.text)) { return ""; }

	var text = params.text;
	var before = params.before || "", after = params.after || "";

	// For HTML, just surround the content with the before and after, which is
	// typically a block-level element that puts a border on the left
	if (params.htmlMode || !params.pre) {
		return [before, text, after].join("");
	}

	var len = params.len || 80;
	var pre = params.pre || "";
	var eol = "\n";

	text = AjxStringUtil.trim(text);
	text = text.replace(/\n\r/g, eol);
	var lines = text.split(eol);
	var result = [];

	for (var l = 0, llen = lines.length; l < llen; l++) {
		var line = AjxStringUtil.trim(lines[l]);
		result.push(pre + line + eol);
	}

	return before + result.join("") + after;
};

AjxStringUtil.SHIFT_CHAR = { 48:')', 49:'!', 50:'@', 51:'#', 52:'$', 53:'%', 54:'^', 55:'&', 56:'*', 57:'(',
							59:':', 186:':', 187:'+', 188:'<', 189:'_', 190:'>', 191:'?', 192:'~',
							219:'{', 220:'|', 221:'}', 222:'"' };

/**
* Returns the character for the given key, taking the shift key into consideration.
*
* @param {number}	keycode	a numeric keycode (not a character code)
* @param {boolean}	shifted		whether the shift key is down
* @return	{char}	a character
*/
AjxStringUtil.shiftChar =
function(keycode, shifted) {
	return shifted ? AjxStringUtil.SHIFT_CHAR[keycode] || String.fromCharCode(keycode) : String.fromCharCode(keycode);
};

/**
 * Does a diff between two strings, returning the index of the first differing character.
 *
 * @param {string}	str1	a string
 * @param {string}	str2	another string
 * @return	{number}	the index at which they first differ
 */
AjxStringUtil.diffPoint =
function(str1, str2) {
	if (!(str1 && str2)) {
		return 0;
	}
	var len = Math.min(str1.length, str2.length);
	var i = 0;
	while (i < len && (str1.charAt(i) == str2.charAt(i))) {
		i++;
	}
	return i;
};

/*
* DEPRECATED
*
* Replaces variables in a string with values from a list. The variables are
* denoted by a '$' followed by a number, starting from 0. For example, a string
* of "Hello $0, meet $1" with a list of ["Harry", "Sally"] would result in the
* string "Hello Harry, meet Sally".
*
* @param str		the string to resolve
* @param values	 	an array of values to interpolate
* @returns			a string with the variables replaced
* 
* @deprecated
*/
AjxStringUtil.resolve =
function(str, values) {
	DBG.println(AjxDebug.DBG1, "Call to deprecated function AjxStringUtil.resolve");
	return AjxMessageFormat.format(str, values);
};

/**
 * Encodes a complete URL. Leaves delimiters alone.
 *
 * @param {string}	str	the string to encode
 * @return	{string}	the encoded string
 */
AjxStringUtil.urlEncode =
function(str) {
	if (!str) return "";
	var func = window.encodeURL || window.encodeURI;
	return func(str);
};

/**
 * Encodes a string as if it were a <em>part</em> of a URL. The
 * difference between this function and {@link AjxStringUtil.urlEncode}
 * is that this will also encode the following delimiters:
 *
 * <pre>
 *  			: / ? & =
 * </pre>
 * 
 * @param	{string}	str		the string to encode
 * @return	{string}	the resulting string
 */
AjxStringUtil.urlComponentEncode =
function(str) {
	if (!str) return "";
	var func = window.encodeURLComponent || window.encodeURIComponent;
	return func(str);
};

/**
 * Decodes a complete URL.
 *
 * @param {string}	str	the string to decode
 * @return	{string}	the decoded string
 */
AjxStringUtil.urlDecode =
function(str) {
	if (!str) return "";
	var func = window.decodeURL || window.decodeURI;
	try {
		return func(str);
	}
	catch(e) {
		return "";
	}
};

/**
 * Decodes a string as if it were a <em>part</em> of a URL. Falls back
 * to unescape() if necessary.
 * 
 * @param	{string}	str		the string to decode
 * @return	{string}	the decoded string
 */
AjxStringUtil.urlComponentDecode =
function(str) {
	if (!str) return "";
	var func = window.decodeURLComponent || window.decodeURIComponent;
	var result;
	try {
		result = func(str);
	} catch(e) {
		result = unescape(str);
	}

	return result || str;
};

AjxStringUtil.ENCODE_MAP = { '>' : '&gt;', '<' : '&lt;', '&' : '&amp;' };

/**
 * HTML-encodes a string.
 *
 * @param {string}	str	the string to encode
 * @param	{boolean}	includeSpaces		if <code>true</code>, to include encoding spaces
 * @return	{string}	the encoded string
 */
AjxStringUtil.htmlEncode =
function(str, includeSpaces) {

	if (!str) {return "";}
	if (typeof(str) != "string") {
		str = str.toString ? str.toString() : "";
	}

	if (!AjxEnv.isSafari || AjxEnv.isSafariNightly) {
		if (includeSpaces) {
			return str.replace(/[<>&]/g, function(htmlChar) { return AjxStringUtil.ENCODE_MAP[htmlChar]; }).replace(/  /g, ' &nbsp;');
		} else {
			return str.replace(/[<>&]/g, function(htmlChar) { return AjxStringUtil.ENCODE_MAP[htmlChar]; });
		}
	} else {
		if (includeSpaces) {
			return str.replace(/[&]/g, '&amp;').replace(/  /g, ' &nbsp;').replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');
		} else {
			return str.replace(/[&]/g, '&amp;').replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');
		}
	}
};

/**
 * encode quotes for using in inline JS code, so the text does not end a quoted param prematurely.
 * @param str
 */
AjxStringUtil.encodeQuotes =
function(str) {
	return str.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
};


/**
 * Decodes the string.
 * 
 * @param	{string}	str		the string to decode
 * @param	{boolean}	decodeSpaces	if <code>true</code>, decode spaces
 * @return	{string}	the string
 */
AjxStringUtil.htmlDecode =
function(str, decodeSpaces) {
	 
	 if(decodeSpaces)
	 	str = str.replace(/&nbsp;/g," ");
	 	
     return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

AjxStringUtil.__jsEscapeChar = function(c) {
	var codestr = c.charCodeAt(0).toString(16);

	if (codestr.length == 1)
		return '\\u000' + codestr;
	else if (codestr.length == 2)
		return '\\u00' + codestr;
	else if (codestr.length == 3)
		return '\\u0' + codestr;
	else if (codestr.length == 4)
		return '\\u' + codestr;

	// shouldn't happen -- ECMAscript proscribes that strings are
	// UTF-16 internally
	DBG.println(AjxDebug.NONE, "unexpected condition in " +
	            "AjxStringUtil.__jsEscapeChar -- code point 0x" +
	            codestr + " doesn't fit in 16 bits");
};

/**
 * Encodes non-ASCII and non-printable characters as \uXXXX, suitable
 * for JSON.
 *
 * @param	{string}	str		the string
 * @return	{string}	the encoded string
 */
AjxStringUtil.jsEncode =
function(str) {
	return str.replace(/[^\u0020-\u007e]/g,
	                   AjxStringUtil.__jsEscapeChar);
};

/**
 * Removes HTML tags from the given string.
 * 
 * @param {string}	str			text from which to strip tags
 * @param {boolean}	removeContent	if <code>true</code>, also remove content within tags
 * @return	{string}	the resulting HTML string
 */
AjxStringUtil.stripTags =
function(str, removeContent) {
	if (typeof str !== 'string') {
		return "";
	}
	if (removeContent) {
		str = str.replace(/(<(\w+)[^>]*>).*(<\/\2[^>]*>)/, "$1$3");
	}
	return str.replace(/<\/?[^>]+>/gi, '');
};

/**
 * Converts the string to HTML.
 * 
 * @param	{string}	str		the string
 * @return	{string}	the resulting string
 */
AjxStringUtil.convertToHtml =
function(str, quotePrefix, openTag, closeTag) {

	openTag = openTag || "<blockquote>";
	closeTag = closeTag || "</blockquote>";
	
	if (!str) {return "";}

	str = AjxStringUtil.htmlEncode(str);
	if (quotePrefix) {
		// Convert a section of lines prefixed with > or |
		// to a section encapsuled in <blockquote> tags
		var prefix_re = /^(>|&gt;|\|\s+)/;
		var lines = str.split(/\r?\n/);
		var level = 0;
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line.length > 0) {
				var lineLevel = 0;
				// Remove prefixes while counting how many there are on the line
				while (line.match(prefix_re)) {
					line = line.replace(prefix_re, "");
					lineLevel++;
				}
				// If the lineLevel has changed since the last line, add blockquote start or end tags, and adjust level accordingly
				while (lineLevel > level) {
					line = openTag + line;
					level++;
				}
				while (lineLevel < level) {
					lines[i - 1] = lines[i - 1] + closeTag;
					level--;
				}
			}
			lines[i] = line;
		}
		while (level > 0) {
			lines.push(closeTag);
			level--;
		}

		str = lines.join("\n");
	}

	str = str
		.replace(/  /mg, ' &nbsp;')
		.replace(/^ /mg, '&nbsp;')
		.replace(/\t/mg, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
		.replace(/\r?\n/mg, "<br>");
	return str;
};

AjxStringUtil.SPACE_ENCODE_MAP = { ' ' : '&nbsp;', '>' : '&gt;', '<' : '&lt;', '&' : '&amp;' , '\n': '<br>'};

/**
 * HTML-encodes a string.
 *
 * @param {string}	str	the string to encode
 * 
 * @private
 */
AjxStringUtil.htmlEncodeSpace =
function(str) {
	if (!str) { return ""; }
	return str.replace(/[&]/g, '&amp;').replace(/ /g, '&nbsp;').replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;');
};

/**
 * Encode
 * @param base {string} Ruby base.
 * @param text {string} Ruby text (aka furigana).
 */
AjxStringUtil.htmlRubyEncode = function(base, text) {
    if (base && text) {
        return [
            "<ruby>",
                "<rb>",AjxStringUtil.htmlEncode(base),"</rb> ",
                "<rp>(</rp><rt>",AjxStringUtil.htmlEncode(text),"</rt><rp>)</rp>",
            "</ruby>"
        ].join("");
    }
    return AjxStringUtil.htmlEncode(base || text || "");
};

// this function makes sure a leading space is preservered, takes care of tabs,
// then finally takes replaces newlines with <br>'s
AjxStringUtil.nl2br =
function(str) {
	if (!str) return "";
	return str.replace(/^ /mg, "&nbsp;").
		// replace(/\t/g, "<pre style='display:inline;'>\t</pre>").
		// replace(/\t/mg, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").
		replace(/\t/mg, "<span style='white-space:pre'>\t</span>").
		replace(/\n/g, "<br>");
};

AjxStringUtil.xmlEncode =
function(str) {
	if (str) {
		// bug fix #8779 - safari barfs if "str" is not a String type
		str = "" + str;
		return str.replace(/&/g,"&amp;").replace(/</g,"&lt;");
	}
	return "";
};

AjxStringUtil.xmlDecode =
function(str) {
	return str ? str.replace(/&amp;/g,"&").replace(/&lt;/g,"<") : "";
};

AjxStringUtil.xmlAttrEncode =
function(str) {
	return str ? str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\x22/g, '&quot;').replace(/\x27/g,"&apos;") : "";
};

AjxStringUtil.xmlAttrDecode =
function(str) {
	return str ? str.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&quot;/g, '"').replace(/&apos;/g,"'") : "";
};

AjxStringUtil.__RE_META = { " ":" ", "\n":"\\n", "\r":"\\r", "\t":"\\t" };
AjxStringUtil.__reMetaEscape = function($0, $1) {
	return AjxStringUtil.__RE_META[$1] || "\\"+$1;
};
AjxStringUtil.regExEscape =
function(str) {
	return str.replace(/(\W)/g, AjxStringUtil.__reMetaEscape);
};

AjxStringUtil._calcDIV = null; // used by 'clip()' and 'wrap()' functions

AjxStringUtil.calcDIV =
function() {
	if (AjxStringUtil._calcDIV == null) {
		AjxStringUtil._calcDIV = document.createElement("div");
		AjxStringUtil._calcDIV.style.zIndex = 0;
		AjxStringUtil._calcDIV.style.position = DwtControl.ABSOLUTE_STYLE;
		AjxStringUtil._calcDIV.style.visibility = "hidden";
		document.body.appendChild(AjxStringUtil._calcDIV);
	}
	return AjxStringUtil._calcDIV;
};

/**
 * Clips a string at "pixelWidth" using using "className" on hidden 'AjxStringUtil._calcDIV'.
 * Returns "origString" with "..." appended if clipped.
 *
 * NOTE: The same CSS style ("className") must be assigned to both the intended
 * display area and the hidden 'AjxStringUtil._calcDIV'.  "className" is
 * optional; if supplied, it will be assigned to 'AjxStringUtil._calcDIV' to
 * handle different CSS styles ("className"s) on same page.
 *
 * NOTE2: MSIE Benchmark - clipping an average of 17 characters each over 190
 * iterations averaged 27ms each (5.1 seconds total for 190)
 * 
 * @private
 */
AjxStringUtil.clip =
function(origString, pixelWidth, className) {
	var calcDIV = AjxStringUtil.calcDIV();
	if (arguments.length == 3) calcDIV.className = className;
	//calcDIV.innerHTML = "<div>" + origString + "</div>"; // prevents screen flash in IE?
	calcDIV.innerHTML = origString;
	if (calcDIV.offsetWidth <= pixelWidth) return origString;

	for (var i=origString.length-1; i>0; i--) {
		var newString = origString.substr(0,i);
		calcDIV.innerHTML = newString + AjxStringUtil.ELLIPSIS;
		if (calcDIV.offsetWidth <= pixelWidth) return newString + AjxStringUtil.ELLIPSIS;
	}
	return origString;
};

AjxStringUtil.clipByLength =
function(str,clipLen) {
	var len = str.length;
	return (len <= clipLen)
		?  str
		: [str.substr(0,clipLen/2), '...', str.substring(len - ((clipLen/2) - 3),len)].join("");
};

/**
 * Forces a string to wrap at "pixelWidth" using "className" on hidden 'AjxStringUtil._calcDIV'.
 * Returns "origString" with "&lt;br&gt;" tags inserted to force wrapping.
 * Breaks string on embedded space characters, EOL ("/n") and "&lt;br&gt;" tags when possible.
 *
 * @returns		"origString" with "&lt;br&gt;" tags inserted to force wrapping.
 * 
 * @private
 */
AjxStringUtil.wrap =
function(origString, pixelWidth, className) {
	var calcDIV = AjxStringUtil.calcDIV();
	if (arguments.length == 3) calcDIV.className = className;

	var newString = "";
	var newLine = "";
	var textRows = origString.split("/n");
	for (var trCount = 0; trCount < textRows.length; trCount++) {
		if (trCount != 0) {
			newString += newLine + "<br>";
			newLine = "";
		}
		htmlRows = textRows[trCount].split("<br>");
		for (var hrCount=0; hrCount<htmlRows.length; hrCount++) {
			if (hrCount != 0) {
				newString += newLine + "<br>";
				newLine = "";
			}
			words = htmlRows[hrCount].split(" ");
			var wCount=0;
			while (wCount<words.length) {
				calcDIV.innerHTML = newLine + " " + words[wCount];
				var newLinePixels = calcDIV.offsetWidth;
				if (newLinePixels > pixelWidth) {
					// whole "words[wCount]" won't fit on current "newLine" - insert line break, avoid incrementing "wCount"
					calcDIV.innerHTML = words[wCount];
					newLinePixels = newLinePixels - calcDIV.offsetWidth;
					if ( (newLinePixels >= pixelWidth) || (calcDIV.offsetWidth <= pixelWidth) ) {
						// either a) excess caused by <space> character or b) will fit completely on next line
						// so just break without incrementing "wCount" and append next time
						newString += newLine + "<br>";
						newLine = "";
					}
					else { // must break "words[wCount]"
						var keepLooping = true;
						var atPos = 0;
						while (keepLooping) {
							atPos++;
							calcDIV.innerHTML = newLine + " " + words[wCount].substring(0,atPos);
							keepLooping = (calcDIV.offsetWidth <= pixelWidth);
						}
						atPos--;
						newString += newLine + words[wCount].substring(0,atPos) + "<br>";
						words[wCount] = words[wCount].substr(atPos);
						newLine = "";
					}
				} else { // doesn't exceed pixelWidth, append to "newLine" and increment "wCount"
					newLine += " " + words[wCount];
					wCount++;
				}
			}
		}
	}
	newString += newLine;
	return newString;
};

// Regexes for finding stuff in msg content
AjxStringUtil.MSG_SEP_RE = new RegExp("^\\s*--+\\s*(" + AjxMsg.origMsg + "|" + AjxMsg.forwardedMessage + ")\\s*--+", "i");
AjxStringUtil.SIG_RE = /^(- ?-+)|(__+)\r?$/;
AjxStringUtil.SPLIT_RE = /\r\n|\r|\n/;
AjxStringUtil.HDR_RE = /^\s*\w+:/;
AjxStringUtil.COLON_RE = /\S+:$/;

// Converts a HTML document represented by a DOM tree to text
// XXX: There has got to be a better way of doing this!
AjxStringUtil._NO_LIST = 0;
AjxStringUtil._ORDERED_LIST = 1;
AjxStringUtil._UNORDERED_LIST = 2;
AjxStringUtil._INDENT = "    ";
AjxStringUtil._NON_WHITESPACE = /\S+/;
AjxStringUtil._LF = /\n/;

AjxStringUtil.convertHtml2Text =
function(domRoot, convertor, onlyOneNewLinePerP) {

	if (!domRoot) { return ""; }

	if (convertor && AjxUtil.isFunction(convertor._before)) {
		domRoot = convertor._before(domRoot);
	}

	if (typeof domRoot == "string") {
		var domNode = document.createElement("SPAN");
		domNode.innerHTML = domRoot;
		domRoot = domNode;
	}
	var text = [];
	var idx = 0;
	var ctxt = {};
	AjxStringUtil._traverse(domRoot, text, idx, AjxStringUtil._NO_LIST, 0, 0, ctxt, convertor, onlyOneNewLinePerP);

	var result = text.join("");

	if (convertor && AjxUtil.isFunction(convertor._after)) {
		result = convertor._after(result);
	}

	return result;
};

AjxStringUtil._traverse =
function(el, text, idx, listType, listLevel, bulletNum, ctxt, convertor, onlyOneNewLinePerP) {

	var nodeName = el.nodeName.toLowerCase();

	var result = null;
	if (convertor && convertor[nodeName]) {
		result = convertor[nodeName](el, ctxt);
	}

	if (result != null) {
		text[idx++] = result;
	} else if (nodeName == "#text") {
		if (el.nodeValue.search(AjxStringUtil._NON_WHITESPACE) != -1) {
			if (ctxt.lastNode == "ol" || ctxt.lastNode == "ul") {
				text[idx++] = "\n";
			}
			if (ctxt.isPreformatted) {
				text[idx++] = AjxStringUtil.trim(el.nodeValue) + " ";
			} else {
				text[idx++] = AjxStringUtil.trim(el.nodeValue.replace(AjxStringUtil._LF, " "), true) + " ";
			}
		}
	} else if (nodeName == "p") {
		text[idx++] = onlyOneNewLinePerP ? "\n" : "\n\n";
	} else if (nodeName === "a") {
		if (el.href) {
			//format as [ href | text ] (if no text, format as [ href ]
			text[idx++] = "[ ";
			text[idx++] = el.href;
			if (el.textContent) {
				text[idx++] = " | ";
				text[idx++] = el.textContent;
			}
			text[idx++] = " ] ";
			return idx; // returning since we take care of all the child nodes via the "textContent" above. No need to parse further.
		}
	} else if (listType == AjxStringUtil._NO_LIST && (nodeName == "br" || nodeName == "hr")) {
		text[idx++] = "\n";
	} else if (nodeName == "ol" || nodeName == "ul") {
		text[idx++] = "\n";
		if (el.parentNode.nodeName.toLowerCase() != "li" && ctxt.lastNode != "br" && ctxt.lastNode != "hr") {
			text[idx++] = "\n";
		}
		listType = (nodeName == "ol") ? AjxStringUtil._ORDERED_LIST : AjxStringUtil._UNORDERED_LIST;
		listLevel++;
		bulletNum = 0;
	} else if (nodeName == "li") {
		for (var i = 0; i < listLevel; i++) {
			text[idx++] = AjxStringUtil._INDENT;
		}
		if (listType == AjxStringUtil._ORDERED_LIST) {
			text[idx++] = bulletNum + ". ";
		} else {
			text[idx++] = "\u002A "; // TODO AjxMsg.bullet
		}
	} else if (nodeName == "tr" && el.parentNode.firstChild != el) {
		text[idx++] = "\n";
	} else if (nodeName == "td" && el.parentNode.firstChild != el) {
		text[idx++] = "\t";
	} else if (nodeName == "div" || nodeName == "address") {
        if (idx && text[idx - 1] !== "\n") {
            text[idx++] = "\n";
        }
	} else if (nodeName == "blockquote") {
		text[idx++] = "\n\n";
	} else if (nodeName == "pre") {
        if (idx && text[idx - 1] !== "\n") {
            text[idx++] = "\n";
        }
		ctxt.isPreformatted = true;
	} else if (nodeName == "#comment" ||
			   nodeName == "script" ||
			   nodeName == "select" ||
			   nodeName == "style") {
		return idx;
	}

	var childNodes = el.childNodes;
	var len = childNodes.length;
	for (var i = 0; i < len; i++) {
		var tmp = childNodes[i];
		if (tmp.nodeType == 1 && tmp.tagName.toLowerCase() == "li") {
			bulletNum++;
		}
		idx = AjxStringUtil._traverse(tmp, text, idx, listType, listLevel, bulletNum, ctxt, convertor, onlyOneNewLinePerP);
	}

	if (convertor && convertor["/"+nodeName]) {
		text[idx++] = convertor["/"+nodeName](el);
	}

	if (nodeName == "h1" || nodeName == "h2" || nodeName == "h3" || nodeName == "h4"
		|| nodeName == "h5" || nodeName == "h6" || nodeName == "div" || nodeName == "address") {
        if (idx && text[idx - 1] !== "\n") {
            text[idx++] = "\n";
        }
			ctxt.list = false;
	} else if (nodeName == "pre") {
        if (idx && text[idx - 1] !== "\n") {
            text[idx++] = "\n";
        }
		ctxt.isPreformatted = false;
	} else if (nodeName == "li") {
		if (!ctxt.list) {
			text[idx++] = "\n";
		}
		ctxt.list = false;
	} else if (nodeName == "ol" || nodeName == "ul") {
		ctxt.list = true;
	} else if (nodeName != "#text") {
		ctxt.list = false;
	}

	ctxt.lastNode = nodeName;
	return idx;
};

/**
 * Sets the given name/value pairs into the given query string. Args that appear
 * in both will get the new value. The order of args in the returned query string
 * is indeterminate.
 *
 * @param args		[hash]		name/value pairs to add to query string
 * @param qsReset	[boolean]	if true, start with empty query string
 * 
 * @private
 */
AjxStringUtil.queryStringSet =
function(args, qsReset) {
	var qs = qsReset ? "" : location.search;
	if (qs.indexOf("?") == 0) {
		qs = qs.substr(1);
	}
	var qsArgs = qs.split("&");
	var newArgs = {};
	for (var i = 0; i < qsArgs.length; i++) {
		var f = qsArgs[i].split("=");
		newArgs[f[0]] = f[1];
	}
	for (var name in args) {
		newArgs[name] = args[name];
	}
	var pairs = [];
	var i = 0;
	for (var name in newArgs) {
		if (name) {
			pairs[i++] = [name, newArgs[name]].join("=");
		}
	}

	return "?" + pairs.join("&");
};

/**
 * Removes the given arg from the query string.
 *
 * @param {String}	qs	a query string
 * @param {String}	name	the arg name
 * 
 * @return	{String}	the resulting query string
 */
AjxStringUtil.queryStringRemove =
function(qs, name) {
	qs = qs ? qs : "";
	if (qs.indexOf("?") == 0) {
		qs = qs.substr(1);
	}
	var pairs = qs.split("&");
	var pairs1 = [];
	for (var i = 0; i < pairs.length; i++) {
		if (pairs[i].indexOf(name) != 0) {
			pairs1.push(pairs[i]);
		}
	}

	return "?" + pairs1.join("&");
};

/**
 * Returns the given object/primitive as a string.
 *
 * @param {primitive|Object}	o		an object or primitive
 * @return	{String}	the string
 */
AjxStringUtil.getAsString =
function(o) {
	return !o ? "" : (typeof(o) == 'object') ? o.toString() : o;
};

AjxStringUtil.isWhitespace = 
function(str) {
	return (str.charCodeAt(0) <= 32);
};

AjxStringUtil.isDigit = 
function(str) {
	var charCode = str.charCodeAt(0);
	return (charCode >= 48 && charCode <= 57);
};

AjxStringUtil.compareRight = 
function(a,b) {
	var bias = 0;
	var idxa = 0;
	var idxb = 0;
	var ca;
	var cb;

	for (; (idxa < a.length || idxb < b.length); idxa++, idxb++) {
		ca = a.charAt(idxa);
		cb = b.charAt(idxb);

		if (!AjxStringUtil.isDigit(ca) &&
			!AjxStringUtil.isDigit(cb))
		{
			return bias;
		}
		else if (!AjxStringUtil.isDigit(ca))
		{
			return -1;
		}
		else if (!AjxStringUtil.isDigit(cb))
		{
			return +1;
		}
		else if (ca < cb)
		{
			if (bias == 0) bias = -1;
		}
		else if (ca > cb)
		{
			if (bias == 0) bias = +1;
		}
	}
};

AjxStringUtil.natCompare = 
function(a, b) {
	var idxa = 0, idxb = 0;
	var nza = 0, nzb = 0;
	var ca, cb;

	while (idxa < a.length || idxb < b.length)
	{
		// number of zeroes leading the last number compared
		nza = nzb = 0;

		ca = a.charAt(idxa);
		cb = b.charAt(idxb);

		// ignore overleading spaces/zeros and move the index accordingly
		while (AjxStringUtil.isWhitespace(ca) || ca =='0') {
			nza = (ca == '0') ? (nza+1) : 0;
			ca = a.charAt(++idxa);
		}
		while (AjxStringUtil.isWhitespace(cb) || cb == '0') {
			nzb = (cb == '0') ? (nzb+1) : 0;
			cb = b.charAt(++idxb);
		}

		// current index points to digit in both str
		if (AjxStringUtil.isDigit(ca) && AjxStringUtil.isDigit(cb)) {
			var result = AjxStringUtil.compareRight(a.substring(idxa), b.substring(idxb));
			if (result && result!=0) {
				return result;
			}
		}

		if (ca == 0 && cb == 0) {
			return nza - nzb;
		}

		if (ca < cb) {
			return -1;
		} else if (ca > cb) {
			return +1;
		}

		++idxa; ++idxb;
	}
};

AjxStringUtil.clipFile =
function(fileName, limit) {
	var index = fileName.lastIndexOf('.');

	// fallback - either not found or starts with delimiter
	if (index <= 0) {
		index = fileName.length;
	}

	if (index <= limit) {
		return fileName;
	}

	var fName = fileName.slice(0, index);
	var ext = fileName.slice(index);

	return [
		fName.slice(0, limit/2),
		AjxMsg.ellipsis,
		fName.slice(-Math.ceil(limit/2) + AjxMsg.ellipsis.length),
		ext
	].join("")
};


AjxStringUtil.URL_PARSE_RE = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?");

AjxStringUtil.parseURL = 
function(sourceUri) {

	var names = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
	var parts = AjxStringUtil.URL_PARSE_RE.exec(sourceUri);
	var uri = {};

	for (var i = 0; i < names.length; i++) {
		uri[names[i]] = (parts[i] ? parts[i] : "");
	}

	if (uri.directoryPath.length > 0) {
		uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
	}

	return uri;
};

/**
 * Parses a mailto: link into components. If the string is not a mailto: link, the object returned will
 * have a "to" property set to the string.
 *
 * @param {String}      str     email address, possibly within a "mailto:" link
 * @returns {Object}    object with at least a 'to' property, and possibly 'subject' and 'body'
 */
AjxStringUtil.parseMailtoLink = function(str) {

	var parts = {};

	if (!str) {
		return parts;
	}

	if (str.toLowerCase().indexOf('mailto:') === -1) {
		parts.to = str;
		return parts;
	}

	var match = str.match(/\bsubject=([^&]+)/i);
	parts.subject = match ? decodeURIComponent(match[1]) : null;

	match = str.match(/\bto\:([^&]+)/);
	if (!match) {
		match = str.match(/\bmailto\:([^\?]+)/i);
	}
	parts.to = match ? decodeURIComponent(match[1]) : null;

	match = str.match(/\bbody=([^&]+)/i);
	parts.body = match ? decodeURIComponent(match[1]) : null;

	return parts;
};

/**
 * Parse the query string (part after the "?") and return it as a hash of key/value pairs.
 * 
 * @param	{String}	sourceUri		the source location or query string
 * @return	{Object}	a hash of query string params
 */
AjxStringUtil.parseQueryString =
function(sourceUri) {

	var location = sourceUri || ("" + window.location);
	var idx = location.indexOf("?");
	var qs = (idx === -1) ? location : location.substring(idx + 1);
	qs = qs.replace(/#.*$/, '');    // strip anchor
	var list = qs.split("&");
	var params = {}, pair, key, value;
	for (var i = 0; i < list.length; i++) {
		pair = list[i].split("=");
		key = decodeURIComponent(pair[0]),
		value = pair[1] ? decodeURIComponent(pair[1]) : true;   // if no value given, set to true so we know it's there
		params[key] = value;
	}
	return params;
};

/**
 * Pretty-prints a JS object. Preferred over JSON.stringify for the debug-related dumping
 * of an object for several reasons:
 * 		- doesn't have an enclosing object, which shifts everything over one level
 * 		- doesn't put quotes around keys
 * 		- shows indexes for arrays (downside is that prevents output from being eval-able)
 * 
 * @param obj
 * @param recurse
 * @param showFuncs
 * @param omit
 */
AjxStringUtil.prettyPrint =
function(obj, recurse, showFuncs, omit) {

	AjxStringUtil._visited = new AjxVector();
	var text = AjxStringUtil._prettyPrint(obj, recurse, showFuncs, omit);
	AjxStringUtil._visited = null;

	return text;
};

AjxStringUtil._visited = null;

AjxStringUtil._prettyPrint =
function(obj, recurse, showFuncs, omit) {

	var indentLevel = 0;
	var showBraces = false;
	var stopRecursion = false;
	if (arguments.length > 4) {
		indentLevel = arguments[4];
		showBraces = arguments[5];
		stopRecursion = arguments[6];
	}

	if (AjxUtil.isObject(obj)) {
		var objStr = obj.toString ? obj.toString() : "";
		if (omit && objStr && omit[objStr]) {
			return "[" + objStr + "]";
		}
		if (AjxStringUtil._visited.contains(obj)) {
			return "[visited object]";
		} else {
			AjxStringUtil._visited.add(obj);
		}
	}

	var indent = AjxStringUtil.repeat(" ", indentLevel);
	var text = "";

	if (obj === undefined) {
		text += "[undefined]";
	} else if (obj === null) {
		text += "[null]";
	} else if (AjxUtil.isBoolean(obj)) {
		text += obj ? "true" : "false";
	} else if (AjxUtil.isString(obj)) {
		text += '"' + AjxStringUtil._escapeForHTML(obj) + '"';
	} else if (AjxUtil.isNumber(obj)) {
		text += obj;
	} else if (AjxUtil.isObject(obj)) {
		var isArray = AjxUtil.isArray(obj) || AjxUtil.isArray1(obj);
		if (stopRecursion) {
			text += isArray ? "[Array]" : obj.toString();
		} else {
			stopRecursion = !recurse;
			var keys = new Array();
			for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    keys.push(i);
                }
			}

			if (isArray) {
				keys.sort(function(a,b) {return a - b;});
			} else {
				keys.sort();
			}

			if (showBraces) {
				text += isArray ? "[" : "{";
			}
			var len = keys.length;
			for (var i = 0; i < len; i++) {
				var key = keys[i];
				var nextObj = obj[key];
				var value = null;
				// For dumping events, and dom elements, though I may not want to
				// traverse the node, I do want to know what the attribute is.
				if (nextObj == window || nextObj == document || (!AjxEnv.isIE && nextObj instanceof Node)){
					value = nextObj.toString();
				}
				if ((typeof(nextObj) == "function")) {
					if (showFuncs) {
						value = "[function]";
					} else {
						continue;
					}
				}

				if (i > 0) {
					text += ",";
				}
				text += "\n" + indent;
                var keyString;
                if (isArray) {
                    keyString = "// [" + key + "]:\n" + indent;
                } else {
                    keyString = key + ": ";
                }
				if (omit && omit[key]) {
					text += keyString + "[" + key + "]";
				} else if (value != null) {
					text += keyString + value;
				} else {
					text += keyString + AjxStringUtil._prettyPrint(nextObj, recurse, showFuncs, omit, indentLevel + 2, true, stopRecursion);
				}
			}
			if (i > 0) {
				text += "\n" + AjxStringUtil.repeat(" ", indentLevel - 1);
			}
			if (showBraces) {
				text += isArray ? "]" : "}";
			}
		}
	}
	return text;
};

AjxStringUtil._escapeForHTML =
function(str){

	if (typeof(str) != 'string') { return str; }

	var s = str;
	s = s.replace(/\&/g, '&amp;');
	s = s.replace(/\</g, '&lt;');
	s = s.replace(/\>/g, '&gt;');
	s = s.replace(/\"/g, '&quot;');
	s = s.replace(/\xA0/g, '&nbsp;');

	return s;
};

// hidden SPANs for measuring regular and bold strings
AjxStringUtil._testSpan = null;
AjxStringUtil._testSpanBold = null;

// cached string measurements
AjxStringUtil.WIDTH			= {};		// regular strings
AjxStringUtil.WIDTH_BOLD	= {};		// bold strings
AjxStringUtil.MAX_CACHE		= 1000;		// max total number of cached strings
AjxStringUtil._cacheSize	= 0;		// current number of cached strings

/**
 * Returns the width in pixels of the given string.
 *
 * @param {string}	str		string to measure
 * @param {boolean}	bold	if true, string should be measured in bold font
 * @param {string|number}   font size to measure string in. If unset, use default font size
 */
AjxStringUtil.getWidth =
function(str, bold, fontSize) {

	if (!AjxStringUtil._testSpan) {
		var span1 = AjxStringUtil._testSpan = document.createElement("SPAN");
		var span2 = AjxStringUtil._testSpanBold = document.createElement("SPAN");
		span1.style.position = span2.style.position = Dwt.ABSOLUTE_STYLE;
		var shellEl = DwtShell.getShell(window).getHtmlElement();
		shellEl.appendChild(span1);
		shellEl.appendChild(span2);
		Dwt.setLocation(span1, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		Dwt.setLocation(span2, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		span2.style.fontWeight = "bold";
	}

	if (AjxUtil.isString(fontSize)) {
		fontSize = DwtCssStyle.asPixelCount(fontSize);
	}
	var sz = "" + (fontSize || 0); // 0 means "default";
	
	var cache = bold ? AjxStringUtil.WIDTH_BOLD : AjxStringUtil.WIDTH;
	if (cache[str] && cache[str][sz]) {
		return cache[str][sz];
	}

	if (AjxStringUtil._cacheSize >= AjxStringUtil.MAX_CACHE) {
		AjxStringUtil.WIDTH = {};
		AjxStringUtil.WIDTH_BOLD = {};
		AjxStringUtil._cacheSize = 0;
	}

	var span = bold ? AjxStringUtil._testSpanBold : AjxStringUtil._testSpan;
	span.innerHTML = str;
	span.style.fontSize = fontSize ? (fontSize+"px") : null;

	if (!cache[str]) {
		cache[str] = {};
	}

	var w = cache[str][sz] = Dwt.getSize(span).x;
	AjxStringUtil._cacheSize++;

	return w;
};

/**
 * Fits as much of a string within the given width as possible. If truncation is needed, adds an ellipsis.
 * Truncation could happen at any letter, and not necessarily at a word boundary.
 *
 * @param {String}  str     a string
 * @param {Number}  width   available width in pixels
 *
 * @returns {String}    string (possibly truncated) that fits in width
 */
AjxStringUtil.fitString = function(str, width) {

    var strWidth = AjxStringUtil.getWidth(str);
    if (strWidth < width) {
        return str;
    }

    var ell = AjxStringUtil.ELLIPSIS_NO_SPACE,
        ellWidth = AjxStringUtil.getWidth(ell);

    while (str.length > 0) {
        if (AjxStringUtil.getWidth(str) + ellWidth < width) {
            return str + ell;
        }
        else {
            str = str.substring(0, str.length - 1); // remove last letter and try again
        }
    }

    return '';
};

/**
 * correct the cross domain reference in passed url content
 * eg: http://<ipaddress>/ url might have rest url page which points to http://<server name>/ pages
 *
 */
AjxStringUtil.fixCrossDomainReference =
function(url, restUrlAuthority, convertToRelativeURL) {
	var urlParts = AjxStringUtil.parseURL(url);
	if (urlParts.authority == window.location.host) {
		return url;
	}

	if ((restUrlAuthority && url.indexOf(restUrlAuthority) >=0) || !restUrlAuthority) {
        if (convertToRelativeURL) {
            url = urlParts.path;
        }
        else {
            var oldRef = urlParts.protocol + "://" + urlParts.authority;
            var newRef = window.location.protocol + "//" + window.location.host;
            url = url.replace(oldRef, newRef);
        }
	}
	return url;
};


AjxStringUtil._dummyDiv = document.createElement("DIV");

AjxStringUtil.htmlPlatformIndependent =
function(html) {
	var div = AjxStringUtil._dummyDiv;
	div.innerHTML = html;
	var inner = div.innerHTML;
	div.innerHTML = "";
	return inner;
};

/**
 * compare two html code fragments, ignoring the case of tags, since the tags inside innnerHTML are returned differently by different browsers (and from Outlook)
 * e.g. IE returns CAPS for tag names in innerHTML while FF returns lowercase tag names. Outlook signature creation also returns lowercase.
 * this approach is also good in case the browser removes some of the innerHTML set to it, like I suspect might be in the case of stuff coming from Outlook. (e.g. it removes head tag since it's illegal inside a div)
 *
 * @param html1
 * @param html2
 */
AjxStringUtil.equalsHtmlPlatformIndependent =
function(html1, html2) {
	return AjxStringUtil.htmlPlatformIndependent(html1) == AjxStringUtil.htmlPlatformIndependent(html2);
};

// Stuff for parsing messages to find original (as opposed to quoted) content

// types of content related to finding original content; not all are used
AjxStringUtil.ORIG_UNKNOWN		= "UNKNOWN";
AjxStringUtil.ORIG_QUOTED		= "QUOTED";
AjxStringUtil.ORIG_SEP_STRONG	= "SEP_STRONG";
AjxStringUtil.ORIG_SEP_WEAK		= "SEP_WEAK";
AjxStringUtil.ORIG_WROTE_STRONG	= "WROTE_STRONG";
AjxStringUtil.ORIG_WROTE_WEAK	= "WROTE_WEAK";
AjxStringUtil.ORIG_HEADER		= "HEADER";
AjxStringUtil.ORIG_LINE			= "LINE";
AjxStringUtil.ORIG_SIG_SEP		= "SIG_SEP";

// regexes for parsing msg body content so we can figure out what was quoted and what's new
// TODO: should these be moved to AjxMsg to be fully localizable?
AjxStringUtil.MSG_REGEXES = [
	{
		// the two most popular quote characters, > and |
		type:	AjxStringUtil.ORIG_QUOTED,
		regex:	/^\s*(>|\|)/
	},
	{
		// marker for Original or Forwarded message, used by ZCS and others
		type:	AjxStringUtil.ORIG_SEP_STRONG,
		regex:	new RegExp("^\\s*--+\\s*(" + AjxMsg.origMsg + "|" + AjxMsg.forwardedMessage + "|" + AjxMsg.origAppt + ")\\s*--+\\s*$", "i")
	},
	{
		// marker for Original or Forwarded message, used by ZCS and others
		type:	AjxStringUtil.ORIG_SEP_STRONG,
		regex:	new RegExp("^" + AjxMsg.forwardedMessage1 + "$", "i")
	},
	{
		// one of the commonly quoted email headers
		type:	AjxStringUtil.ORIG_HEADER,
		regex:	new RegExp("^\\s*(" + [AjxMsg.from, AjxMsg.to, AjxMsg.subject, AjxMsg.date, AjxMsg.sent, AjxMsg.cc].join("|") + ")")
	},
	{
		// some clients use a series of underscores as a text-mode separator (text version of <hr>)
		type:	AjxStringUtil.ORIG_LINE,
		regex:	/^\s*_{5,}\s*$/
	}/*,
	{
		// in case a client doesn't use the exact words above
		type:	AjxStringUtil.ORIG_SEP_WEAK,
		regex:	/^\s*--+\s*[\w\s]+\s*--+$/
	},
	{
		// internet style signature separator
		type:	AjxStringUtil.ORIG_SIG_SEP,
		regex:	/^- ?-\s*$/
	}*/
];

// ID for an HR to mark it as ours
AjxStringUtil.HTML_SEP_ID = "zwchr";

// regexes for finding a delimiter such as "On DATE, NAME (EMAIL) wrote:"
AjxStringUtil.ORIG_EMAIL_RE = /[^@\s]+@[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{2,})+/;    // see AjxUtil.EMAIL_FULL_RE
AjxStringUtil.ORIG_DATE_RE = /\d+\s*(\/|\-|, )20\d\d/;                                    // matches "03/07/2014" or "March 3, 2014" by looking for year 20xx
AjxStringUtil.ORIG_INTRO_RE = new RegExp("^(-{2,}|" + AjxMsg.on + "\\s+)", "i");


// Lazily creates a test hidden IFRAME and writes the given html to it, then returns the HTML element.
AjxStringUtil._writeToTestIframeDoc =
function(html) {
	var iframe;

	if (!AjxStringUtil.__curIframeId) {
		iframe = document.createElement("IFRAME");
		AjxStringUtil.__curIframeId = iframe.id = Dwt.getNextId();
		
		// position offscreen rather than set display:none so we can get metrics if needed; no perf difference seen
		iframe.setAttribute('aria-hidden', true);
		document.body.appendChild(iframe);
		Dwt.setPosition(iframe, Dwt.ABSOLUTE_STYLE);
		Dwt.setLocation(iframe, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	} else {
		iframe = document.getElementById(AjxStringUtil.__curIframeId);
	}

	var idoc = Dwt.getIframeDoc(iframe);

    html = html && html.replace(AjxStringUtil.IMG_SRC_CID_REGEX, '<img $1 pnsrc="cid:');
	idoc.open();
	idoc.write(html);
	idoc.close();

	return idoc.childNodes[0];
};

// Firefox only - clean up test iframe since we can't reuse it
AjxStringUtil._removeTestIframeDoc =
function() {
	if (AjxEnv.isFirefox) {
		var iframe = document.getElementById(AjxStringUtil.__curIframeId);
		if (iframe) {
			iframe.parentNode.removeChild(iframe);
		}
		AjxStringUtil.__curIframeId = null;
	}
};

/**
 * Analyze the text and return what appears to be original (as opposed to quoted) content. We
 * look for separators commonly used by mail clients, as well as prefixes that indicate that
 * a line is being quoted.
 * 
 * @param {string}	text		message body content
 * 
 * @return	{string}	original content if quoted content was found, otherwise NULL
 */
AjxStringUtil.getOriginalContent =
function(text, isHtml) {
	
	if (!text) { return ""; }
	
	if (isHtml) {
		return AjxStringUtil._getOriginalHtmlContent(text);
	}

	var results = [];
	var lines = text.split(AjxStringUtil.SPLIT_RE);
	
	var curType, curBlock = [], count = {}, isMerged, unknownBlock, isBugzilla = false;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var testLine = AjxStringUtil.trim(line);

		// blank lines are just added to the current block
		if (!AjxStringUtil._NON_WHITESPACE.test(testLine)) {
			curBlock.push(line);
			continue;
		}
		
		// Bugzilla summary looks like QUOTED; it should be treated as UNKNOWN
		if ((testLine.indexOf("| DO NOT REPLY") === 0) && (lines[i + 2].indexOf("bugzilla") !== -1)) {
			isBugzilla = true;
		}

		var type = AjxStringUtil._getLineType(testLine);
		if (type === AjxStringUtil.ORIG_QUOTED) {
			type = isBugzilla ? AjxStringUtil.ORIG_UNKNOWN : type;
		}
		else {
			isBugzilla = false;
		}

		// WROTE can stretch over two lines; if so, join them into one line
		var nextLine = lines[i + 1];
		var isMerged = false;
		if (nextLine && (type === AjxStringUtil.ORIG_UNKNOWN) && AjxStringUtil.ORIG_INTRO_RE.test(testLine) && nextLine.match(/\w+:$/)) {
			testLine = [testLine, nextLine].join(" ");
			type = AjxStringUtil._getLineType(testLine);
			isMerged = true;
		}
		
		// LINE sometimes used as delimiter; if HEADER follows, lump it in with them
		if (type === AjxStringUtil.ORIG_LINE) {
			var j = i + 1;
			nextLine = lines[j];
			while (!AjxStringUtil._NON_WHITESPACE.test(nextLine) && j < lines.length) {
				nextLine = lines[++j];
			}
			var nextType = nextLine && AjxStringUtil._getLineType(nextLine);
			if (nextType === AjxStringUtil.ORIG_HEADER) {
				type = AjxStringUtil.ORIG_HEADER;
			}
			else {
				type = AjxStringUtil.ORIG_UNKNOWN;
			}
		}
				
		// see if we're switching to a new type; if so, package up what we have so far
		if (curType) {
			if (curType !== type) {
				results.push({type:curType, block:curBlock});
				unknownBlock = (curType === AjxStringUtil.ORIG_UNKNOWN) ? curBlock : unknownBlock;
				count[curType] = count[curType] ? count[curType] + 1 : 1;
				curBlock = [];
				curType = type;
			}
		}
		else {
			curType = type;
		}
		
		if (isMerged && (type === AjxStringUtil.ORIG_WROTE_WEAK || type === AjxStringUtil.ORIG_WROTE_STRONG)) {
			curBlock.push(line);
			curBlock.push(nextLine);
			i++;
			isMerged = false;
		}
		else {
			curBlock.push(line);
		}
	}

	// Handle remaining content
	if (curBlock.length) {
		results.push({type:curType, block:curBlock});
		unknownBlock = (curType === AjxStringUtil.ORIG_UNKNOWN) ? curBlock : unknownBlock;
		count[curType] = count[curType] ? count[curType] + 1 : 1;
	}
	
	// Now it's time to analyze all these blocks that we've classified

	// Check for UNKNOWN followed by HEADER
	var first = results[0], second = results[1];
	if (first && first.type === AjxStringUtil.ORIG_UNKNOWN && second && (second.type === AjxStringUtil.ORIG_HEADER || second.type === AjxStringUtil.ORIG_WROTE_STRONG)) {
		var originalText = AjxStringUtil._getTextFromBlock(first.block);
		if (originalText) {
			var third = results[2];
			if (third && third.type === AjxStringUtil.ORIG_UNKNOWN) {
				var originalThirdText = AjxStringUtil._getTextFromBlock(third.block);
				if (originalThirdText && originalThirdText.indexOf(ZmItem.NOTES_SEPARATOR) !== -1) {
					return originalText + originalThirdText;
				}
			}
			return originalText;
		}
	}

	// check for special case of WROTE preceded by UNKNOWN, followed by mix of UNKNOWN and QUOTED (inline reply)
	var originalText = AjxStringUtil._checkInlineWrote(count, results, false);
	if (originalText) {
		return originalText;
	}

	// If we found quoted content and there's exactly one UNKNOWN block, return it.
	if (count[AjxStringUtil.ORIG_UNKNOWN] === 1 && count[AjxStringUtil.ORIG_QUOTED] > 0) {
		var originalText = AjxStringUtil._getTextFromBlock(unknownBlock);
		if (originalText) {
			return originalText;
		}
	}

	// If we have a STRONG separator (eg "--- Original Message ---"), consider it authoritative and return the text that precedes it
	if (count[AjxStringUtil.ORIG_SEP_STRONG] > 0) {
		var block = [];
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			if (result.type === AjxStringUtil.ORIG_SEP_STRONG) {
				break;
			}
			block = block.concat(result.block);
		}
		var originalText = AjxStringUtil._getTextFromBlock(block);
		if (originalText) {
			return originalText;
		}
	}

	return text;
};

// Matches a line of text against some regexes to see if has structural meaning within a mail msg.
AjxStringUtil._getLineType =
function(testLine) {

	var type = AjxStringUtil.ORIG_UNKNOWN;
	
	// see if the line matches any known delimiters or quote patterns
	for (var j = 0; j < AjxStringUtil.MSG_REGEXES.length; j++) {
		var msgTest = AjxStringUtil.MSG_REGEXES[j];
		var regex = msgTest.regex;
		if (regex.test(testLine.toLowerCase())) {
			// line that starts and ends with | is considered ASCII art (eg a table) rather than quoted
			if (msgTest.type == AjxStringUtil.ORIG_QUOTED && /^\s*\|.*\|\s*$/.test(testLine)) {
				continue;
			}
			type = msgTest.type;
			break;	// first match wins
		}
	}
	
	if (type === AjxStringUtil.ORIG_UNKNOWN) {
		// "so-and-so wrote:" takes a lot of different forms; look for various common parts and
		// assign points to determine confidence
		var m = testLine.match(/(\w+):$/);
		var verb = m && m[1] && m[1].toLowerCase();
		if (verb) {
			var points = 0;
			// look for "wrote:" (and discount "changed:", which is used by Bugzilla)
			points = points + (verb === AjxMsg.wrote) ? 5 : (verb === AjxMsg.changed) ? 0 : 2;
			if (AjxStringUtil.ORIG_EMAIL_RE.test(testLine)) {
				points += 4;
			}
			if (AjxStringUtil.ORIG_DATE_RE.test(testLine)) {
				points += 3;
			}
			var regEx = new RegExp("^(--|" + AjxMsg.on + ")", "i");
			if (AjxStringUtil.ORIG_INTRO_RE.test(testLine)) {
				points += 1;
			}
			if (points >= 7) {
				type = AjxStringUtil.ORIG_WROTE_STRONG;
			}
			else if (points >= 5) {
				type = AjxStringUtil.ORIG_WROTE_WEAK;
			}
		}
	}
	
	return type;
};

AjxStringUtil._getTextFromBlock =
function(block) {
	if (!(block && block.length)) { return null; }
	var originalText = block.join("\n") + "\n";
	originalText = originalText.replace(/\s+$/, "\n");
	return (AjxStringUtil._NON_WHITESPACE.test(originalText)) ? originalText : null;
};

AjxStringUtil.SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

// nodes to ignore; they won't have anything we're interested in
AjxStringUtil.IGNORE_NODE_LIST = ["#comment", "br", "script", "select", "style"];
AjxStringUtil.IGNORE_NODE = AjxUtil.arrayAsHash(AjxStringUtil.IGNORE_NODE_LIST);

/**
 * For HTML, we strip off the html, head, and body tags and stick the rest in a temporary DOM node so that
 * we can go element by element. If we find one that is recognized as a separator, we remove all subsequent elements.
 *
 * @param {string}	text		message body content
 *
 * @return	{string}	original content if quoted content was found, otherwise NULL
 * @private
 */
AjxStringUtil._getOriginalHtmlContent = function(text) {

	// strip <script> tags (which should not be there)
	var htmlNode = AjxStringUtil._writeToTestIframeDoc(text);
    while (AjxStringUtil.SCRIPT_REGEX.test(text)) {
        text = text.replace(AjxStringUtil.SCRIPT_REGEX, "");
    }

	var done = false, nodeList = [];
	AjxStringUtil._flatten(htmlNode, nodeList);

	var ln = nodeList.length, i, results = [], count = {}, el, prevEl, nodeName, type, prevType, sepNode;
	for (i = 0; i < ln; i++) {
		el = nodeList[i];
		if (el.nodeType === AjxUtil.ELEMENT_NODE) {
			el.normalize();
		}
		nodeName = el.nodeName.toLowerCase();
		type = AjxStringUtil._checkNode(nodeList[i]);

		// Check for a multi-element "wrote:" attribution (usually a combo of #text and A nodes), for example:
		//
		//     On Feb 28, 2014, at 3:42 PM, Joe Smith &lt;<a href="mailto:jsmith@zimbra.com" target="_blank">jsmith@zimbra.com</a>&gt; wrote:

		// If the current node is a #text with a date or "On ...", find #text nodes within the next ten nodes, concatenate them, and check the result.
		if (type === AjxStringUtil.ORIG_UNKNOWN && el.nodeName === '#text' &&
			(AjxStringUtil.ORIG_DATE_RE.test(el.nodeValue) || AjxStringUtil.ORIG_INTRO_RE.test(el.nodeValue))) {

			var str = el.nodeValue;
			for (var j = 1; j < 10; j++) {
				var el1 = nodeList[i + j];
				if (el1 && el1.nodeName === '#text') {
					str += el1.nodeValue;
					if (/:$/.test(str)) {
						type = AjxStringUtil._getLineType(AjxStringUtil.trim(str));
						if (type === AjxStringUtil.ORIG_WROTE_STRONG) {
							i = i + j;
							break;
						}
					}
				}
			}
		}

		if (type !== null) {
			results.push({ type: type, node: el, nodeName: nodeName });
			count[type] = count[type] ? count[type] + 1 : 1;
			// definite separator
			if (type === AjxStringUtil.ORIG_SEP_STRONG || type === AjxStringUtil.ORIG_WROTE_STRONG) {
				sepNode = el;
				done = true;
				break;
			}
			// some sort of line followed by a header
			if (type === AjxStringUtil.ORIG_HEADER && prevType === AjxStringUtil.ORIG_LINE) {
				sepNode = prevEl;
				done = true;
				break;
			}
			prevEl = el;
			prevType = type;
		}
	}

	if (sepNode) {
		AjxStringUtil._prune(sepNode, true);
	}

	// convert back to text, restoring html, head, and body nodes; if there is nothing left, return original text
	var result = done && htmlNode.textContent ? "<html>" + htmlNode.innerHTML + "</html>" : text;

	AjxStringUtil._removeTestIframeDoc();
	return result;
};

/**
 * Traverse the given node depth-first to produce a list of descendant nodes. Some nodes are
 * ignored.
 *
 * @param {Element}     node        node
 * @param {Array}       list        result list which grows in place
 * @private
 */
AjxStringUtil._flatten = function(node, list) {

	var nodeName = node && node.nodeName.toLowerCase();
	if (AjxStringUtil.IGNORE_NODE[nodeName]) {
		return;
	}

	list.push(node);

	var children = node.childNodes || [];
	for (var i = 0; i < children.length; i++) {
		this._flatten(children[i], list);
	}
};

/**
 * Removes all subsequent siblings of the given node, and then does the same for its parent.
 * The effect is that all nodes that come after the given node in a depth-first traversal of
 * the DOM will be removed.
 *
 * @param {Element}     node
 * @param {Boolean}     clipNode    if true, also remove the node
 * @private
 */
AjxStringUtil._prune = function(node, clipNode) {

	var p = node && node.parentNode;
	// clip all subsequent nodes
	while (p && p.lastChild && p.lastChild !== node) {
		p.removeChild(p.lastChild);
	}
	// clip the node if asked
	if (clipNode && p && p.lastChild === node) {
		p.removeChild(p.lastChild);
	}
	var nodeName = p && p.nodeName.toLowerCase();
	if (p && nodeName !== 'body' && nodeName !== 'html') {
		AjxStringUtil._prune(p, false);
	}
};

/**
 * Tries to determine the type of the given node.
 *
 * @param {Element}     el      a DOM node
 * @return {String}     type, or null
 * @private
 */
AjxStringUtil._checkNode = function(el) {

	if (!el) { return null; }

	var nodeName = el.nodeName.toLowerCase();
	var type = null;

	// Text node: test against our regexes
	if (nodeName === "#text") {
		var content = AjxStringUtil.trim(el.nodeValue);
		if (AjxStringUtil._NON_WHITESPACE.test(content)) {
			type = AjxStringUtil._getLineType(content);
		}
	}
	// HR: look for a couple different forms that are used to delimit quoted content
	else if (nodeName === "hr") {
		// see if the HR is ours, or one commonly used by other mail clients such as Outlook
		if (el.id === AjxStringUtil.HTML_SEP_ID || (el.size === "2" && el.width === "100%" && el.align === "center")) {
			type = AjxStringUtil.ORIG_SEP_STRONG;
		}
		else {
			type = AjxStringUtil.ORIG_LINE;
		}
	}
	// PRE: treat as one big line of text (should maybe go line by line)
	else if (nodeName === "pre") {
		type = AjxStringUtil._checkNodeContent(el);
	}
	// DIV: check for Outlook class used as delimiter, or a top border used as a separator, and finally just
	// check the text content
	else if (nodeName === "div") {
		if (el.className === "OutlookMessageHeader" || el.className === "gmail_quote") {
			type = AjxStringUtil.ORIG_SEP_STRONG;
		}
		else if (el.style.borderTop) {
			var styleObj = DwtCssStyle.getComputedStyleObject(el);
			if (styleObj && styleObj.borderTopWidth && parseInt(styleObj.borderTopWidth) === 1 && styleObj.borderTopColor) {
				type = AjxStringUtil.ORIG_SEP_STRONG;
			}
		}
		type = type || AjxStringUtil._checkNodeContent(el);
	}
	// SPAN: check text content
	else if (nodeName === "span") {
		type = type || AjxStringUtil._checkNodeContent(el);
	}
	// IMG: treat as original content
	else if (nodeName === "img") {
		type = AjxStringUtil.ORIG_UNKNOWN;
	}
	// BLOCKQUOTE: treat as quoted section
	else if (nodeName === "blockquote") {
		type = AjxStringUtil.ORIG_QUOTED;
	}

	return type;
};

/**
 * Checks textContent to see if it's a separator.
 * @param {Element} node
 * @return {String}
 * @private
 */
AjxStringUtil._checkNodeContent = function(node) {
	var content = node.textContent || '';
	if (!AjxStringUtil._NON_WHITESPACE.test(content) || content.length > 200) {
		return null;
	}
	// We're really only interested in SEP_STRONG and WROTE_STRONG
	var type = AjxStringUtil._getLineType(content);
	return (type === AjxStringUtil.ORIG_SEP_STRONG || type === AjxStringUtil.ORIG_WROTE_STRONG) ? type : null;
};

/**
 * Checks the given HTML to see if it is "safe", and cleans it up if it is. It must have only
 * the tags in the given list, otherwise false is returned. Attributes in the given list will
 * be removed. It is not necessary to include "#text", "html", "head", and "body" in the list
 * of allowed tags.
 * 
 * @param {string}	html			HTML text
 * @param {array}	okTags			whitelist of allowed tags
 * @param {array}	untrustedAttrs	list of attributes to not allow in non-iframe.
 */
AjxStringUtil.checkForCleanHtml =
function(html, okTags, untrustedAttrs) {

	var htmlNode = AjxStringUtil._writeToTestIframeDoc(html);
	var ctxt = {
		allowedTags: AjxUtil.arrayAsHash(okTags),
		untrustedAttrs:	untrustedAttrs || []
	};
	AjxStringUtil._traverseCleanHtml(htmlNode, ctxt);

	var result = "<!DOCTYPE html><html>" + htmlNode.innerHTML + "</html>";

	var width = Math.max(htmlNode.scrollWidth, htmlNode.lastChild.scrollWidth);

	AjxStringUtil._removeTestIframeDoc();
	return {html:result, width:width, useIframe:ctxt.fail};
};

AjxStringUtil._traverseCleanHtml =
function(el, ctxt) {

    var isCleanHtml = true;

	var nodeName = el.nodeName.toLowerCase();
	
	// useless <style> that we used to add, remove it
	if (nodeName === "style" && el.innerHTML === "p { margin: 0; }") {
		el.doDelete = true;
	}
	
	// IE likes to insert an empty <title> in the <head>, let it go
	else if (nodeName === "title" && !el.innerHTML) {
	}
	
	// see if tag is allowed
	else if (ctxt.allowedTags[nodeName]) {

        //checks for invalid styles and removes them.  Bug: 78875 - bad styles from user = email displays incorrectly
        if (el.style) {
            var style = el.style && el.style.cssText;

            // Ignore empty style tags, we don't want to pollute DOM by adding empty style tags
            if (style !== "") {
                style = style.toLowerCase();
                if (!AjxStringUtil._checkStyle(style)){
                    isCleanHtml = false;
                }
                el.style.cssText = AjxStringUtil._fixStyle(style);
            }
        }

		if (el.removeAttribute && el.attributes && el.attributes.length) {
			// check for blacklisted attrs
			for (var i = 0; i < ctxt.untrustedAttrs.length; i++) {
				if (el.hasAttribute(ctxt.untrustedAttrs[i])) {
					isCleanHtml = false;
				}
			}
			
			// Note that DOM-based handling of attributes is horribly broken in IE, in all sorts of ways.
			// In IE it is impossible to find a reliable way to get an attribute's value. The attributes
			// collection is supposed to be attributes that were specified in the HTML, but IE fills it with every
			// possible attribute.
			for (var i = 0, attrs = el.attributes, l = attrs.length; i < l; i++) {
				var attr = attrs.item(i);
                if (!attr) {
                    continue;
                }
				var attrName = attr.nodeName && attr.nodeName.toLowerCase();
				// on* handlers (should have been removed by server, check again to be safe)
				if (attrName && attrName.indexOf("on") === 0) {
					el.removeAttribute(attrName);
					continue;
				}
				// this might not work in IE
				var attrValue = attr.nodeValue && String(attr.nodeValue);
				if (attrValue) {
					attrValue = attrValue.toLowerCase();
					// we have global CSS rules for TD that trump table properties, so bail
					if (nodeName === "table" && (attrName === "cellpadding" || attrName === "cellspacing" ||
							attrName === "border") && attrValue !== "0") {
						isCleanHtml = false;
					}
				}
			}
		}
	}
	
	// disallowed tag - bail
	else {
        isCleanHtml = false;
	}
	
	// process child nodes
	for (var i = 0, len = el.childNodes.length; i < len; i++) {
		var childNode = el.childNodes[i];
		AjxStringUtil._traverseCleanHtml(childNode, ctxt);
	}
	
	// remove nodes marked for deletion
	for (var i = el.childNodes.length - 1; i >= 0; i--) {
		var childNode = el.childNodes[i];
		if (childNode.doDelete) {
			el.removeChild(childNode);
		}
	}

    if (!isCleanHtml){
        ctxt.fail = true;
    }
};


AjxStringUtil._checkStyle =
    function(style) {

        //check for absolute positioning
        if (style.match(/\bposition\s*:\s*absolute[^;]*;?/)){
            return false;
        }

        //check for font-<anything>
        if (style.match(/\bfont-[^;]*;?/)){
            return false;
        }

        return true;
};

AjxStringUtil._fixStyle =
function(style) {

    //check for negative margins
    style = style.replace(/\bmargin-?(top|left|right|bottom)?\s*:[^;]*-\d+[^;]*;?/gi, "");

    //check for negative padding
    style = style.replace(/\bpadding-?(top|left|right|bottom)?\s*:[^;]*-\d+[^;]*;?/gi, "");
    
    //remove absolute and fixed positioning
    style = style.replace(/\bposition\s*:\s*(absolute|fixed)[^;]*;?/, "");

    return style;
};

/**
 * A "... wrote:" separator is not quite as authoritative, since the user might be replying inline. If we have
 * a single UNKNOWN block before the WROTE separator, return it unless there is a mix of QUOTED and UNKNOWN
 * following the separator, except if there's only a single unknown block after the separator and it comes last.
 * 
 * @private
 */
AjxStringUtil._checkInlineWrote =
function(count, results) {

	if (count[AjxStringUtil.ORIG_WROTE_STRONG] > 0) {
		var unknownBlock, foundSep = false, afterSep = {};
		for (var i = 0; i < results.length; i++) {
			var result = results[i], type = result.type;
			if (type === AjxStringUtil.ORIG_WROTE_STRONG) {
				foundSep = true;
			}
			else if (type === AjxStringUtil.ORIG_UNKNOWN && !foundSep) {
				if (unknownBlock) {
					return null;
				}
				else {
					unknownBlock = result.block;
				}
			}
			else if (foundSep) {
				afterSep[type] = true;
			}
		}

		var mixed = (afterSep[AjxStringUtil.ORIG_UNKNOWN] && afterSep[AjxStringUtil.ORIG_QUOTED]);
		var endsWithUnknown = (count[AjxStringUtil.ORIG_UNKNOWN] === 2 && results[results.length - 1].type === AjxStringUtil.ORIG_UNKNOWN);
		if (unknownBlock && (!mixed || endsWithUnknown)) {
			var originalText = AjxStringUtil._getTextFromBlock(unknownBlock);
			if (originalText) {
				return originalText;
			}
		}
	}
};

/**
 * Removes non-content HTML from the beginning and end. The idea is to remove anything that would
 * appear to the user as blank space. This function is an approximation since that's hard to do,
 * especially when dealing with HTML as a string.
 *
 * @param {String}  html    HTML to fix
 * @return {String} trimmed HTML
 * @adapts AjxStringUtil.trimHtml
 */
AjxStringUtil.trimHtml = function(html) {

	if (!html) {
		return '';
	}
	var trimmedHtml = html;

	// remove doc-level tags if they don't have attributes
	trimmedHtml = trimmedHtml.replace(AjxStringUtil.DOC_TAG_REGEX, '');

	// some editors like to put every <br> in a <div>
	trimmedHtml = trimmedHtml.replace(/<div><br ?\/?><\/div>/gi, '<br>');

	// remove leading/trailing <br>
	var len = 0;
	while (trimmedHtml.length !== len && (/^<br ?\/?>/i.test(trimmedHtml) || /<br ?\/?>$/i.test(trimmedHtml))) {
		len = trimmedHtml.length;	// loop prevention
		trimmedHtml = trimmedHtml.replace(/^<br ?\/?>/i, "").replace(/<br ?\/?>$/i, "");
	}

	// remove trailing <br> trapped in front of closing tags
	var m = trimmedHtml && trimmedHtml.match(/((<br ?\/?>)+)((<\/\w+>)+)$/i);
	if (m && m.length) {
		var regex = new RegExp(m[1] + m[3] + '$', 'i');
		trimmedHtml = trimmedHtml.replace(regex, m[3]);
	}

	// remove empty internal <div> containers
	trimmedHtml = trimmedHtml.replace(/(<div><\/div>)+/gi, '');

	return AjxStringUtil.trim(trimmedHtml);
};

// regex for removing empty doc tags from an HTML string
AjxStringUtil.DOC_TAG_REGEX = /<\/?(html|head|body)>/gi;

// Convert the html to DOM nodes, update the img src with the defanged field value,
// and then return the html inside the body.
// TODO: See about using a DocumentFragment
AjxStringUtil.defangHtmlContent = function(html) {
	var htmlNode = AjxStringUtil._writeToTestIframeDoc(html);
	var images = htmlNode.getElementsByTagName("img");
	if (images && images.length) {
		var imgEl;
		var dfSrcContent;
		var pnSrcContent;
		for (var i = 0; i < images.length; i++) {
			imgEl = images[i];
			dfSrcContent = imgEl.getAttribute("dfsrc");
			if (dfSrcContent && (dfSrcContent !== "#")) {
				imgEl.setAttribute("src", dfSrcContent);
			} else {
				pnSrcContent = imgEl.getAttribute("pnsrc");
				if (pnSrcContent && (pnSrcContent !== "#")) {
					imgEl.setAttribute("src", pnSrcContent);
				}
			}
			imgEl.removeAttribute("dfsrc");
		}
	}
	var content = "";
	var children = htmlNode.childNodes;
	for (var i = 0; i < children.length; i++) {
		if (children[i].tagName && (children[i].tagName.toLowerCase() === "body")) {
			content = children[i].innerHTML;
			break;
		}
	}
	AjxStringUtil._removeTestIframeDoc();
	return content;
};

}
if (AjxPackage.define("ajax.util.AjxTimedAction")) {
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
AjxTimedAction = function(obj, func, args) {
	AjxCallback.call(this, obj, func, args);
	this._tid = -1;
	this._id = -1;
    this._runResult = null;
}
AjxTimedAction.prototype = new AjxCallback();
AjxTimedAction.prototype.constructor = AjxTimedAction;

// Setting a timeout of 25 days or more appears to revert it
// to 0 in FF3 and Safari3. There's really no reason to set
// it to anything above a few days, so set a max of 20 days.
AjxTimedAction.MAX_TIMEOUT = 20 * 24 * 60 * 60 * 1000;

AjxTimedAction.prototype.toString = 
function() {
	return "AjxTimedAction";
};

AjxTimedAction.prototype.getRunResult =
function() {
    return this._runResult;
};

AjxTimedAction._pendingActions = {};
AjxTimedAction._nextActionId = 1;

AjxTimedAction.scheduleAction =
function(action, timeout){
	if (!action) { return; }
	// if tid already exists, cancel previous timeout before setting a new one
	if (action._tid && action._tid != -1) {
		AjxTimedAction.cancelAction(action._id);
	}

	timeout = timeout || 0; // make sure timeout is numeric
	if (timeout > AjxTimedAction.MAX_TIMEOUT) {
		if (window.DBG) {
			DBG.println(AjxDebug.DBG1, "timeout value above maximum: " + timeout);
		}
		timeout = AjxTimedAction.MAX_TIMEOUT;
	}
	var id = action._id = AjxTimedAction._nextActionId++;
	AjxTimedAction._pendingActions[id] = action;
	var actionStr = "AjxTimedAction._exec(" + id + ")";
	action._tid = window.setTimeout(actionStr, timeout);
	return action._id;
};

AjxTimedAction.cancelAction =
function(actionId) {
	var action = AjxTimedAction._pendingActions[actionId];
	if (action) {
		window.clearTimeout(action._tid);
		delete AjxTimedAction._pendingActions[actionId];
		delete action._tid;
	}
};

AjxTimedAction._exec =
function(actionId) {

	try {

	var action = AjxTimedAction._pendingActions[actionId];
	if (action) {
		delete AjxTimedAction._pendingActions[actionId];
		delete action._tid;
	    action._runResult = action.run();
	}

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

}

if (AjxPackage.define("ajax.dwt.core.Dwt")) {
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
 * Default constructor.
 * @constructor
 * @class
 * Dwt is a static class that defines a number of constants and helper methods that
 * support the <code>ajax.dwt.*</code> package.
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 */

Dwt = function() {
};

// Constants for positioning
/**
 * Static position style.
 */
Dwt.STATIC_STYLE = "static";

/**
 * Absolute position style.
 */
Dwt.ABSOLUTE_STYLE = "absolute";

/**
 * Relative position style.
 */
Dwt.RELATIVE_STYLE = "relative";

/**
 * Fixed position style.
 */
Dwt.FIXED_STYLE = "fixed";

// Background repeat
/**
 * Do not repeat background image.
 */
Dwt.NO_REPEAT = "no-repeat";

/**
 * Repeat background image.
 */
Dwt.REPEAT = "repeat";

/**
 * Repeat background image horizontally.
 */
Dwt.REPEAT_X = "repeat-x";

/**
 * Repeat background image vertically.
 */
Dwt.REPEAT_Y = "repeat-y";


// display style
/**
 * Inline display style.
 */
Dwt.DISPLAY_INLINE = "inline";

/**
 * Block display style.
 */
Dwt.DISPLAY_BLOCK = "block";

/**
 * No display style.
 */
Dwt.DISPLAY_NONE = "none";

/**
 * Table row style.
 */
Dwt.DISPLAY_TABLE_ROW = "table-row";

/**
 * Table cell style.
 */
Dwt.DISPLAY_TABLE_CELL = "table-cell";

// Scroll constants
/**
 * Clip on overflow.
 */
Dwt.CLIP = 1;

/**
 * Allow overflow to be visible.
 */
Dwt.VISIBLE = 2;

/**
 * Automatically create scrollbars if content overflows.
 */
Dwt.SCROLL = 3;

/**
 * Always have scrollbars whether content overflows or not.
 */
Dwt.FIXED_SCROLL = 4;

/**
 * Only show scrollbars on Y when content overflows.
 */
Dwt.SCROLL_Y = 5;

/**
 * Only show scrollbars on X when content overflows.
 */
Dwt.SCROLL_X = 6;


// z-index order
/** 
 * Hidden layer. Elements at this layer will be hidden from view.
 */
Dwt.Z_HIDDEN = 100;

/**
 * The curtain layer.
 * @type int
 * @see DwtShell
 */
Dwt.Z_CURTAIN = 200;


/**
 * Visible layer. Elements at this layer will be in view.
 */
Dwt.Z_VIEW = 300;

/**
 * Popup menu layer. Used by the menu components.
 */
Dwt.Z_MENU = 500;

/**
 * Veil layer. The veil appears just behind modal dialogs render other components
 * unable to receive mouse input.
 */
Dwt.Z_VEIL = 600;

/**
 * Dialog layer. Dialogs are positioned at this layer.
 */
Dwt.Z_DIALOG = 700;

/**
 * Used by menus that are part of a dialog.
 */
Dwt.Z_DIALOG_MENU = 750;

/**
 * Tooltips layer.
 */
Dwt.Z_TOOLTIP = 775;

/**
 * Drag and Drop (DnD) icon layer. DnD icons are positioned at this layer so they
 * move across the top of other components.
 */
Dwt.Z_DND = 800;		// Drag N Drop icons

/**
 * This layer appears in front of other layers to block all user mouse input.
 */
Dwt.Z_BUSY = 900;

/**
 * The toast layer.
 */
Dwt.Z_TOAST = 950;

/**
 * Used by the splash screens.
 */
Dwt.Z_SPLASH = 1000;


/**
 * Default value. Used when setting such things as size and bounds to indicate a
 * component should not be set. For example if setting size and not wishing to set
 * the height.
 * <pre>
 * Dwt.setSize(htmlElement, 100, Dwt.DEFAULT)
 * </pre>
 * 
 */
Dwt.DEFAULT = -123456789;

/**
 * Used to clear a value.
 */
Dwt.CLEAR = -20000;

/**
 * Offscreen position. Used when setting a elements position.
 */
Dwt.LOC_NOWHERE = -10000;

// Drag N Drop action constants. These are bit fields.
/**
 * No drag and drop operation.
 */
Dwt.DND_DROP_NONE = 0;

/**
 * Copy drag and drop operation.
 */
Dwt.DND_DROP_COPY = 1;

/**
 * Move drag and drop operation.
 */
Dwt.DND_DROP_MOVE = 2;

/**
 * Ballpark figure for width of a scrollbar.
 */
Dwt.SCROLLBAR_WIDTH = 22;

// Editor formats
Dwt.HTML = "text/html";
Dwt.TEXT = "text/plain";

// Keys used for retrieving data
// TODO JSDoc
Dwt.KEY_OBJECT = "_object_";
Dwt.KEY_ID = "_id_";

/**
 * z-index increment unit. Used by components if they need to bump their z-index.
 */
Dwt._Z_INC = 1;


/**
 * @private
 */
Dwt.__nextId = {};

/**
 * This method is used to generate a unique id to be used for an HTML element's id
 * attribute.
 *
 * @return {string}	the next available element ID
 */
Dwt.getNextId =
function(prefix) {
	prefix = prefix || "DWT";
	if (!Dwt.__nextId[prefix]) {
		Dwt.__nextId[prefix] = 1;
	}
	return prefix + Dwt.__nextId[prefix]++;
};

/**
 * This method is used to query an element for its id, generating one if it
 * isn't set.
 *
 * @return {string}	the element ID
 */
Dwt.getId =
function(element, prefix) {
	return element ? element.id || (element.id = Dwt.getNextId(prefix)) : null;
};

/**
 * @deprecated
 * The association between an element and a control is now via DwtControl.ALL_BY_ID,
 * where the unique element ID is a key to the control. The association is made when
 * the control is initialized.
 * 
 * This method builds an indirect association between a DOM object and a JavaScript
 * object. This indirection is important to prevent memory leaks (particularly in IE) by
 * not directly creating a circular reference between a DOM object
 *
 * @param {DOMElement} domElement the DOM element (typically an HTML element)
 * @param {Object} jsObject the JavaScript object
 * 
 * @private
 */
Dwt.associateElementWithObject =
function(domElement, jsObject, attrName) {
	domElement[attrName||"dwtObj"] = jsObject.__internalId = AjxCore.assignId(jsObject);
};

/**
 * @deprecated
 * The association will be broken by the control when it is disposed.
 * 
 * This method breaks the indirect association between a DOM object and a JavaScript
 * object that was created by the <code>Dwt.associateElementWithObject</code>method
 *
 * @param {DOMElement} domElement the DOM element (typically an HTML element)
 * @param {Object} jsObject the JavaScript object
 * 
 * @private
 */
Dwt.disassociateElementFromObject =
function(domElement, jsObject, attrName) {
	if (domElement){
		domElement.removeAttribute(attrName||"dwtObj");
	}
	if (jsObject.__internalId){
		AjxCore.unassignId(jsObject.__internalId);
	}
};

/**
 * @deprecated		use {@link DwtControl.fromElement}
 * 
 * @private
 */
Dwt.getObjectFromElement =
function(domElement, attrName) {
	return AjxCore.objectWithId(domElement[attrName||"dwtObj"]);
};

Dwt.getElement =
function(el) {
	return (typeof(el) == "string") ? document.getElementById(el) : el;
};

/**
 * Finds an ancestor element with a non-empty value for the given attr.
 * 
 * @param	{DOMElement}	domElement	the starting DOM element
 * @param	{string}		attrName	the attribute name
 * 
 * @return	{DOMElement}	the DOM element
 */
Dwt.findAncestor =
function(domElement, attrName) {
	var attr = Dwt.getAttr(domElement, attrName);
	while (domElement && (attr == null || attr == "")) {
		domElement = domElement.parentNode;
		attr = Dwt.getAttr(domElement, attrName);
	}
	return domElement;
};

/**
 * Returns true if el1 is an ancestor (in the parent chain) of el2, or if
 * el1 and el2 are the same element.
 *
 * @param {DOMElement}	el1
 * @param {DOMElement}	el2
 */
Dwt.isAncestor =
function(el1, el2) {

	if (el1 == el2) {
		return true;
	}

	var el = el2;
	while (el) {
		el = el.parentNode;
		if (el == el1) {
			return true;
		}
	}
	return false;
};

Dwt.setHandler =
function(htmlElement, event, func) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		Dwt.clearHandler(htmlElement, event);
	}
	htmlElement[event] = func;
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		htmlElement.addEventListener("DOMMouseScroll", func, true);
	}
};

Dwt.clearHandler =
function(htmlElement, event) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		if (htmlElement[event]) {
			var func = htmlElement[event];
			htmlElement.removeEventListener("DOMMouseScroll", func, true);
		}
	}
	htmlElement[event] = null;
};

Dwt.getBackgroundRepeat =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return DwtCssStyle.getProperty(htmlElement, "background-repeat");
};

Dwt.setBackgroundRepeat =
function(htmlElement, style) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.backgroundRepeat = style;
};

/**
 * Gets the bounds of an HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtRectangle}	the elements bounds
 *
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getSize
 */
Dwt.getBounds =
function(htmlElement, rect) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return null; }
	var tmpPt = DwtPoint.tmp;

	Dwt.getLocation(htmlElement, tmpPt);
	var locX = tmpPt.x;
	var locY = tmpPt.y;

	Dwt.getSize(htmlElement, tmpPt);

	if (!rect) {
		return new DwtRectangle(locX, locY, tmpPt.x, tmpPt.y);
	} else {
		rect.set(locX, locY, tmpPt.x, tmpPt.y);
		return rect;
	}
};

/**
 * Sets the bounds of an HTML element. The position type of the element must
 * be absolute or else an exception is thrown. To omit setting a value set the
 * actual parameter value to <i>Dwt.DEFAULT</i>
 *
 * @param {HTMLElement} htmlElement absolutely positioned HTML element
 * @param {number|string} x the x coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number|string} y the y coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number} width the width of the element (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 * @param {number} height the height of the element  (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 *
 * @throws DwtException
 *
 * @see #getBounds
 * @see #setLocation
 * @see #setSize
 */
Dwt.setBounds =
function(htmlElement, x, y, width, height) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	Dwt.setLocation(htmlElement, x, y);
	Dwt.setSize(htmlElement, width, height);
};

/**
 * Gets the element cursor for a given HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {string}	the html elements cursor
 *
 * @see #setCursor
 */
Dwt.getCursor =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return ""; }
	return DwtCssStyle.getProperty(htmlElement, "cursor");
};

/**
 * Sets an HTML element cursor.
 *
 * @param {HTMLElement} htmlElement the element for which to set the cursor
 * @param {string} cursorName name of the new cursor
 *
 * @see #setCursor
 */
Dwt.setCursor =
function(htmlElement, cursorName) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.cursor = cursorName;
};

/**
 * Gets the location of an HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtPoint}		the location of the HTML element
 *
 * @see #setLocation
 * @see #getBounds
 * @see #getSize
 */
Dwt.getLocation =
function(htmlElement, point) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return null; }
	point = point || new DwtPoint(0, 0);

	if (htmlElement.style.position == Dwt.ABSOLUTE_STYLE) {
		// parseInt will return NaN if "top" or "left" is "auto" or not set.
		// TODO: We should test for that and just go to toWindow in that case.
		point.set(parseInt(DwtCssStyle.getProperty(htmlElement, "left")),
				parseInt(DwtCssStyle.getProperty(htmlElement, "top")));
		return point;
	}

	return Dwt.toWindow(htmlElement, 0, 0, null, null, point);
};

/**
 * Sets the location of an HTML element. The position type of the element must
 * be absolute or else an exception is thrown. To only set one of the coordinates,
 * pass in a value of {@link Dwt.DEFAULT} for the coordinate for which the value is
 * not to be set
 *
 * @param {HTMLElement} htmlElement the absolutely positioned HTML element
 * @param {number|string} x the x coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number|string} y the y coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 *
 * @throws DwtException
 *
 * @see #getLocation
 * @see #setBounds
 * @see #setSize
 */
Dwt.setLocation =
function(htmlElement, x, y) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var position = DwtCssStyle.getProperty(htmlElement, 'position');
	if (position != Dwt.ABSOLUTE_STYLE && position != Dwt.RELATIVE_STYLE && position != Dwt.FIXED_STYLE) {
		DBG.println(AjxDebug.DBG1, "Cannot position static widget " + htmlElement.className);
		throw new DwtException("Static widgets may not be positioned", DwtException.INVALID_OP, "Dwt.setLocation");
	}
	if (x = Dwt.__checkPxVal(x)) {
		htmlElement.style.left = x;
	}
	if (y = Dwt.__checkPxVal(y)) {
		htmlElement.style.top = y;
	}
};

Dwt.getPosition =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return htmlElement.style.position;
};

Dwt.setPosition =
function(htmlElement, posStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.position = posStyle;
};

/**
 * Returns <code>htmlElement</code>'s scroll style. The scroll style determines the element's
 * behaviour when content overflows its boundaries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {HTMLElement} htmlElement HTML element
 *
 * @return {Dwt.CLIP|Dwt.VISIBLE|Dwt.SCROLL|Dwt.FIXED_SCROLL}	the elements scroll style
 */
Dwt.getScrollStyle =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return ""; }
	var overflow =  DwtCssStyle.getProperty(htmlElement, "overflow");

	if (overflow == "hidden")		{ return Dwt.CLIP; }
	if (overflow =="auto")			{ return Dwt.SCROLL; }
	if (overflow =="scroll")		{ return Dwt.FIXED_SCROLL; }

	if (overflow == '') {
		var overflowX = DwtCssStyle.getProperty(htmlElement, "overflowX");
		var overflowY = DwtCssStyle.getProperty(htmlElement, "overflowY");

		if (overflowX == 'scroll')	{ return Dwt.SCROLL_X; }
		if (overflowY == 'scroll')	{ return Dwt.SCROLL_Y; }
	}
	return Dwt.VISIBLE;
};

/**
 * Sets the <code>htmlElement</code>'s scroll style. The scroll style determines the elements's
 * behaviour when content overflows its div's boundaries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {HTMLElement} htmlElement HTML element
 * @param {Dwt.CLIP|Dwt.VISIBLE|Dwt.SCROLL|Dwt.FIXED_SCROLL}	scrollStyle		the elements scroll style
 */
Dwt.setScrollStyle =
function(htmlElement, scrollStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (scrollStyle == Dwt.CLIP)
		htmlElement.style.overflow = "hidden";
	else if (scrollStyle == Dwt.SCROLL)
		htmlElement.style.overflow = "auto";
	else if (scrollStyle == Dwt.FIXED_SCROLL)
		htmlElement.style.overflow = "scroll";
	else if (scrollStyle == Dwt.SCROLL_Y) {
		htmlElement.style.overflowX = "hidden";
		htmlElement.style.overflowY = "auto";
	} else if (scrollStyle == Dwt.SCROLL_X) {
		htmlElement.style.overflowY = "hidden";
		htmlElement.style.overflowX = "auto";
	} else {
		htmlElement.style.overflow = "visible";
	}
};


/**
 * Gets the size of an HTML element. Normally, this yields the
 * calculated size of the element. However, if 'getFromStyle' is
 * true, the style is obtained directly from the CSS style.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 * @param {DwtPoint} point		if given, reuse this point
 * @param {Boolean} getFromStyle		whether to use the calculated size
 *
 * @return {DwtPoint}	the elements size, margins included
 *
 * @see #getBounds
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getOuterSize
 */
Dwt.getSize =
function(htmlElement, point, getFromStyle) {
    // Note: in FireFox, offsetHeight includes border and clientHeight does not;
    // may want to look at clientHeight for FF

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var p;
	if (!point) {
		p = new DwtPoint(0, 0);
	} else {
		p = point;
		p.set(0, 0);
	}

	if (!htmlElement) { return p; }

	if (getFromStyle) {
		if (htmlElement.style.width) { //assumption - the caller only cares about the dimension that is set via the style. So ok to keep 0 if it's not set. for simplicity.
			p.x = parseInt(htmlElement.style.width);
		}
		if (htmlElement.style.height) {
			p.y = parseInt(htmlElement.style.height);
		}

		return p;
	}

	p.x = htmlElement.offsetWidth;
	if (p.x != null) {
		p.y = htmlElement.offsetHeight;
	} else if (htmlElement.clip && htmlElement.clip.width != null) {
		p.x = parseInt(htmlElement.clip.width);
		p.y = parseInt(htmlElement.clip.height);
	} else if (htmlElement.style && htmlElement.style.pixelWidth != null) {
		p.x = parseInt(htmlElement.style.pixelWidth);
		p.y = parseInt(htmlElement.style.pixelHeight);
	}

	return p;
};


/**
 * Gets the outer size -- that is, the size including margins, padding, and borders -- of an
 * HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtPoint}	the elements size, margins included
 *
 * @see #getSize
 * @see #getBounds
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 */
Dwt.getOuterSize =
function(htmlElement, point) {
    var p = Dwt.getSize(htmlElement, point);

    if (p && Dwt.getVisible(htmlElement)) {
        var margins = Dwt.getMargins(htmlElement);
		var insets = Dwt.getInsets(htmlElement);
        p.x += margins.left + margins.right + insets.left + insets.right;
        p.y += margins.top + margins.bottom + insets.top + insets.bottom;
    }

    return p;
};

Dwt.setSize =
function(htmlElement, width, height) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (!htmlElement.style) { return; }

	if (width == Dwt.CLEAR) {
		htmlElement.style.width = null;
	} else if (width = Dwt.__checkPxVal(width, true)) {
		htmlElement.style.width = width;
	}

	if (height == Dwt.CLEAR) {
		htmlElement.style.height = null;
	} else if (height = Dwt.__checkPxVal(height, true)) {
		htmlElement.style.height = height;
	}
};

/**
 * Measure the extent in pixels of a section of html. This is not the worlds cheapest
 * method to invoke so do so judiciously
 *
 * @param {string} html 	the html content for which that extents are to be calculated
 *
 * @return {DwtPoint}	the extent of the content
 */
Dwt.getHtmlExtent =
function(html) {
	var div = AjxStringUtil.calcDIV();
	div.innerHTML = html;
	return Dwt.getSize(div);
};

Dwt.toDocumentFragment =
function(html, id) {
	var div = AjxStringUtil.calcDIV();
	div.innerHTML = html;

	var fragment = document.createDocumentFragment();
	var container = id && document.getElementById(id);
	if (container) {
		fragment.appendChild(container);
	}
	else {
		for (var child = div.firstChild; child; child = div.firstChild) {
			fragment.appendChild(child);
		}
	}
	return fragment;
};

Dwt.getAttr =
function(htmlEl, attr, recursive) {
	// test for tagName so we dont try to eval non-html elements (i.e. document)
	if (!recursive) {
		return htmlEl && htmlEl.tagName
			? (htmlEl.getAttribute(attr) || htmlEl[attr])
			: null;
	} else {
		while (htmlEl) {
			if (Dwt.getAttr(htmlEl, attr) != null) {
				return htmlEl;
			}
			htmlEl = htmlEl.parentNode;
		}
		return null;
	}
};

Dwt.getVisible =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var disp = DwtCssStyle.getProperty(htmlElement, "display");
	return (disp != Dwt.DISPLAY_NONE);
};

Dwt.setVisible =
function(htmlElement, visible) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (visible) {
		if (htmlElement.nodeName.match(/tr/i)) {
			htmlElement.style.display = Dwt.DISPLAY_TABLE_ROW;
		}
		else if (htmlElement.nodeName.match(/td|th/i)) {
			htmlElement.style.display = Dwt.DISPLAY_TABLE_CELL;
		}
		else {
			htmlElement.style.display = htmlElement.getAttribute("x-display") ||
										Dwt.DISPLAY_BLOCK;
		}
	} else {
		var display = DwtCssStyle.getComputedStyleObject(htmlElement).display;
		if (display != "none") {
			htmlElement.setAttribute("x-display", display);
		}
		htmlElement.style.display = Dwt.DISPLAY_NONE;
	}
};

Dwt.getVisibility =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var vis = DwtCssStyle.getProperty(htmlElement, "visibility");
	return (vis == "visible");
};

Dwt.setVisibility =
function(htmlElement, visible) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.visibility = visible ? "visible" : "hidden";
};

Dwt.__MSIE_OPACITY_RE = /alpha\(opacity=(\d+)\)/;

Dwt.getOpacity =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return Number(htmlElement.style.opacity || 1) * 100;
};

Dwt.setOpacity =
function(htmlElement, opacity) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.opacity = opacity/100;
};


/**
 * Get the z-index of an element.
 *
 * @param {boolean} getFromStyle    get the value from the style attribute of
 *                                  this element, or a parent
 *
 * @return	{number}	the z-index value
 */
Dwt.getZIndex =
function(htmlElement, getFromStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }

	if (getFromStyle) {
		while (htmlElement.style.zIndex === "" && htmlElement.parentNode) {
			htmlElement = htmlElement.parentNode;
		}

		return htmlElement.style.zIndex;
	}

	return DwtCssStyle.getProperty(htmlElement, "z-index");
};

Dwt.setZIndex =
function(htmlElement, idx) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.zIndex = idx;
	if (idx < Dwt.Z_VIEW) {
		htmlElement.setAttribute('aria-hidden', true);
	} else {
		htmlElement.removeAttribute('aria-hidden');
	}
};

Dwt.getDisplay =
function(htmlElement) {
	DwtCssStyle.getProperty(htmlElement, "display");
};

Dwt.setDisplay =
function(htmlElement, value) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.display = value;
};

/**
 * Gets the window size of the browser.
 * 
 * @param	{DwtPoint}		point		the point to hold the windows x/y size
 * @return	{DwtPoint}		the point holding the window x/y size
 */
Dwt.getWindowSize =
function(point) {
	var p = (!point) ? new DwtPoint(0, 0) : point;
	if (window.innerWidth) {
		p.x = window.innerWidth;
		p.y = window.innerHeight;
	} else if (document.body && document.body.clientWidth) {
		p.x = document.body.clientWidth;
		p.y = document.body.clientHeight;
	}
	return p;
};

Dwt.toWindow =
function(htmlElement, x, y, containerElement, dontIncScrollTop, point) {
	var p;
	if (!point) {
		p = new DwtPoint(x, y);
	} else {
		p = point;
		p.set(x, y);
	}

	htmlElement = Dwt.getElement(htmlElement);
	var offsetParent = htmlElement;
	while (offsetParent && offsetParent != containerElement) {
		p.x += offsetParent.offsetLeft - offsetParent.scrollLeft;
		p.y += offsetParent.offsetTop;
		if (!dontIncScrollTop) {
			var scrollTop = AjxEnv.isOpera ? offsetParent.pageYOffset : offsetParent.scrollTop;
			if (scrollTop) {
				p.y -= scrollTop;
			}
			var parentNode = offsetParent.parentNode;
			while (parentNode != offsetParent.offsetParent && parentNode != containerElement) {
				scrollTop = AjxEnv.isOpera ? parentNode.pageYOffset : parentNode.scrollTop;
				if (scrollTop) {
					p.y -= scrollTop;
				}
				parentNode = parentNode.parentNode;
			}
		}
		offsetParent = offsetParent.offsetParent;
	}
	return p;
};

Dwt.getInsets = function(htmlElement) {
	// return an object with the insets (border + padding size) for each side of the element, eg:
	//		{ left: 3, top:0, right:3, bottom:0 }
	// NOTE: assumes values from computedStyle are returned in pixels!!!

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var style = DwtCssStyle.getComputedStyleObject(htmlElement);

	var bl = parseInt(style.borderLeftWidth) 	|| 0;
	var bt = parseInt(style.borderTopWidth) 	|| 0;
	var br = parseInt(style.borderRightWidth)	|| 0;
	var bb = parseInt(style.borderBottomWidth)	|| 0;

	var pl = parseInt(style.paddingLeft) 	|| 0;
	var pt = parseInt(style.paddingTop) 	|| 0;
	var pr = parseInt(style.paddingRight)	|| 0;
	var pb = parseInt(style.paddingBottom)	|| 0;

	return {
			left 	: bl + pl,
			top  	: bt + pt,
			right 	: br + pr,
			bottom	: bb + pb
		};
};

Dwt.insetBounds = function(bounds, insets) {

	// given a 'bounds' object [from Dwt.getBounds()] 
	//	and an 'insets' object [from Dwt.getInsets()]
	//	munge the bounds so it takes the insets into account.
	// Useful to get the inner dimensions of an element.
	if (!bounds) {
        return null;
    }

	bounds.x += insets.left;
	bounds.y += insets.top;
	bounds.width  -= insets.left + insets.right;
	bounds.height -= insets.top + insets.bottom;

	return bounds;
};

/**
 * Gets the bounds of an HTML element, excluding borders and paddings.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtRectangle}	the elements bounds
 *
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getSize
 */
Dwt.getInsetBounds = function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }

	var bounds = Dwt.getBounds(htmlElement);
	var insets = Dwt.getInsets(htmlElement);

	return Dwt.insetBounds(bounds, insets);
};

Dwt.getMargins = function(htmlElement) {
	// return an object with the margins for each side of the element, eg:
	//		{ left: 3, top:0, right:3, bottom:0 }
	// NOTE: assumes values from computedStyle are returned in pixels!!!

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var style = DwtCssStyle.getComputedStyleObject(htmlElement);

	return {
		left 	: parseInt(style.marginLeft) 	|| 0,
		top  	: parseInt(style.marginTop) 	|| 0,
		right 	: parseInt(style.marginRight) 	|| 0,
		bottom	: parseInt(style.marginBottom)	|| 0
	};
};

/**
 * Get ancestor elements of the given node, up to and including the given
 * parent node. If no parent is given, assume the root document node. If the
 * parent node is not an ancestor of the child, return <code>null</code>.
 *
 * @param {HTMLElement} childNode		the child HTML element
 * @param {HTMLElement} parentNode		the parent HTML element
 * @param {Boolean} 	includeChild	if true, include the child itself
 *
 * @return {Array}						a list of HTML elements
 */
Dwt.getAncestors =
function(childNode, parentNode, includeChild) {
	var ancestors = [];

	// a reasonable default
	if (!parentNode) {
		parentNode = document.documentElement;
	}

	if (includeChild) {
		ancestors.push(childNode);
	}

	while (childNode && childNode != parentNode) {
		ancestors.push(childNode.parentNode);
		childNode = childNode.parentNode;
	}

	// check if the parent was an ancestor
	if (ancestors[ancestors.length - 1] != parentNode) {
		return null;
	}

	return ancestors;
};

Dwt.setStatus =
function(text) {
	window.status = text;
};

Dwt.getTitle =
function() {
	return window.document.title;
};

Dwt.setTitle =
function(text) {
	window.document.title = text;
};

Dwt.getIframeDoc =
function(iframeObj) {
	if (iframeObj) {
		return iframeObj.contentDocument;
	}
	return null;
};

Dwt.getIframeWindow =
function(iframeObj) {
	return iframeObj.contentWindow;
};

/**
 * Creates and returns an element from a string of HTML.
 *
 * @param {string} html 	the HTML text
 * @param {boolean} isRow 	if <code>true</code>, if the element is a <code>&lt;tr&gt;</code>
 *
 * @return {HTMLElement}	an HTMLElement with the <code>html</code> as its content. if <code>isRow</code>
 * 		is <code>true</code>, then the element will be a table
 */
Dwt.parseHtmlFragment =
function(html, isRow) {
	if (!Dwt._div) {
		Dwt._div = document.createElement('div');
	}
	// TR element needs to have surrounding table
	if (isRow) {
		html = "<table style='table-layout:fixed'>" + html + "</table>";
	}
	Dwt._div.innerHTML = html;

	if (isRow) {
		var fragment = document.createDocumentFragment();
		var rows = Dwt._div.firstChild.rows;
		for (var i = rows.length - 1; i >= 0; i--) {
			// NOTE: We always grab the first row because once we append it
			//       to the fragment, it will be removed from the table.
			fragment.appendChild(rows[0]);
		}
		return fragment.childNodes.length > 1 ? fragment : fragment.firstChild;
	}
	return Dwt._div.firstChild;
};

Dwt.contains =
function(parentEl, childEl) {
	var isContained = false;
	if (parentEl.compareDocumentPosition) {
		var relPos = parentEl.compareDocumentPosition(childEl);
		if ((relPos == (document.DOCUMENT_POSITION_CONTAINED_BY | document.DOCUMENT_POSITION_FOLLOWING))) {
			isContained = true;
		}
	} else if (parentEl.contains) {
		isContained = parentEl.contains(childEl);
	}
	return isContained;
};

Dwt.removeChildren =
function(htmlEl) {
	while (htmlEl.hasChildNodes()) {
		htmlEl.removeChild(htmlEl.firstChild);
	}
};

/**
 * Opera always returns zero for cellIndex property of TD element :(
 *
 * @param cell		TD object we want cell index for
 * 
 * @private
 */
Dwt.getCellIndex =
function(cell) {
	if (AjxEnv.isOpera) {
		if (cell.tagName && cell.tagName.toLowerCase() == "td") {
			// get the cells collection from the TD's parent TR
			var cells = cell.parentNode.cells;
			var len = cells.length;
			for (var i = 0; i < len; i++) {
				if (cells[i] == cell)
					return i;
			}
		}
	} else {
		return cell.cellIndex;
	}
	return -1;
};

/**
 * Remove the <code>del</code> class name from the element's CSS class names and
 * optionally add <code>add</code> class name if given provided
 *
 * @param {HTMLElement} el HTML Element to which to add/delete class names
 * @param {string} [del] the class name to delete
 * @param {string} [add] the class name to add
 */
Dwt.delClass =
function(el, del, add) {

	if (el == null) { return }
	if (!del && !add) { return; }

	if (typeof del == "string" && del.length) {
		del = Dwt._DELCLASS_CACHE[del] || (Dwt._DELCLASS_CACHE[del] = new RegExp("\\b" + del + "\\b", "ig"));
	}
	var className = el.className || "";
	className = className.replace(del, " ");
	className = AjxStringUtil.trim(className);
	el.className = add ? className + " " + add : className;
};

// cache the regexps here to avoid compiling the same regexp multiple times
Dwt._DELCLASS_CACHE = {};

/**
 * Adds the given class name to the element's CSS class names
 *
 * @param {HTMLElement} el the HTML Element to which to add the class name
 * @param {string} c the class name
 *
 * @see #delClass
 */
Dwt.addClass =
function(el, c) {
	Dwt.delClass(el, c, c);
};

/**
 * Conditionally add or remove a class name from an element
 *
 * @param {HTMLElement} el the target element
 * @param {boolean} condition 	the condition to check
 * @param {string} a the class name when condition is <code>true</code>
 * @param {string} b the class name when condition is <code>false</code>
 */
Dwt.condClass =
function(el, condition, a, b) {
	if (!!condition) {
		if (b) {
			Dwt.delClass(el, b);
		}
		Dwt.addClass(el, a);
	} else {
		Dwt.delClass(el, a);
		if (b) {
			Dwt.addClass(el, b);
		}
	}
};

/** Returns true if the specified element has the given class. */
Dwt.hasClass = function(el, className) {
    if (!el || !className) return false;
    return el.className.match(new RegExp("\\b"+className+"\\b"));
};

/**
 * Sets the selection range.
 *
 * @param {input|iframe} input input for which to find the selection start point. This
 * 		may be a text input field or an iframe in design mode
 * @param {number} start 	the starting position
 * @param {number} end 	the ending position
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #moveCursorToEnd
 */
Dwt.setSelectionRange =
function(input, start, end) {
	if (input.setSelectionRange) {
        input.focus();
		input.setSelectionRange(start, end);
	} else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();
	} else if (input.select) {
		// FIXME: find solutions for other browsers
		input.select();
	}
};

/**
 * Retrieves the start of the selection.  For a collapsed range, this is
 * equivalent to {@link #getSelectionEnd}.
 *
 * @param {input|iframe} input input for which to find the selection start point. This
 * 		may be a text input field or an iframe in design mode
 *
 * @return {number}	starting position of the selection
 *
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.getSelectionStart =
function(input) {
	if (AjxUtil.isSpecified(input.selectionStart)) {
		return input.selectionStart;
	} else if (document.selection) {
		var range = document.selection.createRange();
		var isCollapsed = range.compareEndPoints("StartToEnd", range) == 0;
		if (!isCollapsed)
			range.collapse(true);
		var b = range.getBookmark();
		var offset = input.createTextRange().getBookmark().charCodeAt(2);
		return Math.max(b.charCodeAt(2) - offset, 0);
	}

	// FIXME: find solutions for other browsers
	return input.value.length;
};

/**
 * Retrieves the end of the selection.
 *
 * @param {input|iframe} input 	the input for which to find the selection end point. This
 * 		may be a text input field or an iframe in design mode
 *
 * @return {number}	the starting position of the selection
 *
 * @see #getSelectionStart
 * @see #setSelectionText
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.getSelectionEnd =
function(input) {
	if (AjxUtil.isSpecified(input.selectionEnd)) {
		return input.selectionEnd;
	} else if (document.selection) {
		var range = document.selection.createRange();
		var isCollapsed = range.compareEndPoints("StartToEnd", range) == 0;
		if (!isCollapsed)
			range.collapse(false);
		var b = range.getBookmark();
		var offset = input.createTextRange().getBookmark().charCodeAt(2);
		return Math.max(b.charCodeAt(2) - offset, 0);
	}

	// FIXME: find solutions for other browsers
	return input.value.length;
};

/**
 * Sets the selection text
 *
 * @param {input|iframe} input	the input for which to set the selection text. This
 * 		may be a text input field or an iframe in design mode
 * @param {string} text 	the text to set as the selection
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.setSelectionText =
function(input, text) {
	var start = Dwt.getSelectionStart(input);
	var end = Dwt.getSelectionEnd(input);
	var str = input.value;
	var val = [
		str.substr(0, start),
		text,
		str.substr(end)
	].join("");

	if (typeof input.setValue == "function") {
		input.setValue(val);
	} else {
		input.value = val;
	}
	Dwt.setSelectionRange(input, start, start + text.length);
};

/**
 * Move cursor to the end of an input.
 *
 * @param {input} input	    text input
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #setSelectionRange
 */
Dwt.moveCursorToEnd =
function(input) {
	Dwt.setSelectionRange(input, input.value.length, input.value.length);
};

Dwt.instanceOf =
function(objOrClassName, className) {
	if (typeof objOrClassName == "string") {
		return window[objOrClassName] &&
				(objOrClassName == className || window[objOrClassName].prototype instanceof window[className]);
	}
	return (window[className] && objOrClassName instanceof window[className]);
};

/**
 * Normalizes an argument list into a hash with the given argument names.
 * If a single hash argument is passed, it is recognized as a params hash
 * and returned. Otherwise, the argument list is exploded into a params
 * hash with the given param names.
 * 
 * @param {Object}	args			Array-like structure of arguments
 * @param {array}	paramNames		an ordered list of param names
 */
Dwt.getParams = function(args, paramNames) {

	if (!args || args.length === 0 || (args.length === 1 && !args[0])) {
		return {};
	}

	// Check for arg-list style of passing params. There will almost always
	// be more than one arg, and the first one may be the parent DwtControl.
	// Conversion is not done if there is a single argument that is a simple
	// hash, or a proxy for a simple hash (see AjxUtil.createProxy).

	if (args.length > 1 || !AjxUtil.isHash(args[0]._object_ || args[0])) {
		var params = {};
		for (var i = 0; i < args.length; i++) {
			params[paramNames[i]] = args[i];
		}
		return params;
	}
	if (args.length === 1) {
		return args[0];
	}
	return {};
};

//////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
//////////////////////////////////////////////////////////////////////////////////

Dwt.__REM_RE = /^(-?[0-9]+(?:\.[0-9]*)?)rem$/;

/**
 * @private
 */
Dwt.__checkPxVal =
function(val, check) {
	if (val == Dwt.DEFAULT) { return false; }
	if (isNaN(parseInt(val))) { return false; }

	if (check && val < 0 && val != Dwt.LOC_NOWHERE) {
		DBG.println(AjxDebug.DBG1, "negative pixel value: " + val);
		val = 0;
	}
	if (typeof(val) == "number") {
		val = val + "px";
	}
	if (!AjxEnv.supportsCSS3RemUnits && Dwt.__REM_RE.test(val)) {
		val = DwtCssStyle.asPixelCount(val) + "px";
	}
	return val;
};






/////////////
//	NEW STUFF FROM OWEN
/////////////
Dwt.byId =
function(id, ancestor) {
	if (!ancestor) {
		return (typeof id == "string" ? document.getElementById(id) : id);
	}

	// Find node with id that descends from ancestor (also works on DOM trees
	// that are not attached to the document object)
	if (ancestor == id || ancestor.id == id) {
		return ancestor;
	}

	for (var i = 0; i < ancestor.childNodes.length; i++) {
		if (ancestor.childNodes[i].nodeType == 1) {
			var cnode = Dwt.byId(id, ancestor.childNodes[i]);
			if (cnode) { return cnode; }
		}
	}
	return null;
};

/**
 * Get all elements of a certain tag name. Similar to
 * document.getElementsByTagName(), but returning an Array instead of
 * a NodeList.
 *
 * @param {String} tagName	the tag name, such as "A"
 * @param {HTMLElement} ancestor An optional ancestor element,
 *                      defaults to the document
 * @return	{Array}
 */
Dwt.byTag =
function(tagName, ancestor) {
	if (!ancestor) {
		ancestor = document;
	}

	return AjxUtil.toArray(ancestor.getElementsByTagName(tagName));
};

/**
 * Get all elements of the given class name. Similar to
 * document.getElementsByClassName(), but returning an Array instead
 * of a NodeList.
 *
 * @param {String} className
 * @param {HTMLElement} ancestor An optional ancestor element,
 *                      defaults to the document
 * @return	{Array}
 */
Dwt.byClassName =
function(className, ancestor) {
	if (!ancestor) {
        ancestor = document;
	}

	var nodes;

	if (ancestor.getElementsByClassName) {
		nodes = ancestor.getElementsByClassName(className);
	} else {
		nodes = ancestor.querySelectorAll('.' + className);
	}

	return AjxUtil.toArray(nodes);
};

Dwt.show =
function(it) {
	var el = Dwt.byId(it);
	if (el) {
		Dwt.setVisible(el,true);
	}
};

Dwt.hide =
function(it) {
	var el = Dwt.byId(it);
	if (el) {
		Dwt.setVisible(el,false);
	}
};

//setText Methods

Dwt.setText =
function(htmlEl,text){
	htmlEl.appendChild(document.createTextNode(text));
};

Dwt.populateText =
function(){
	if (arguments.length == 0 ) { return; }

	var node, index = 0, length = arguments.length;
	while (index < length) {
		node = document.getElementById(arguments[index]);
		if (node) {
			Dwt.setText(node,arguments[index+1]);
		}
		index += 2;
	}
};

//setHtml Methods

Dwt.setInnerHtml =
function(htmlEl,html){
	htmlEl.innerHTML = html;
};

/**
 * Sets the favicon.
 *
 * @param {string} the url to the icon to display
 * 
 * @private
 */
Dwt.setFavIcon =
function(iconURL) {

	// Look for an existing fav icon to modify.
	var favIcon = null;
	if (Dwt._favIconId) {
		favIcon = document.getElementById(Dwt._favIconId);
	} else {
		var docHead = document.getElementsByTagName("head")[0];
		var links = docHead.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			if (link.rel.toUpperCase() == "SHORTCUT ICON") {
				if (!link.id) {
					link.id = Dwt._favIconId = Dwt.getNextId();
				}
				favIcon = link;
				break;
			}
		}
	}
	// If available, change the existing favicon.
	// (Need to remove/add to dom in order to force a redraw.)
	if (favIcon) {
		favIcon.href=iconURL;
		favIcon.type = 'image/x-icon';
		var parent = favIcon.parentNode;
		parent.removeChild(favIcon);
		parent.appendChild(favIcon);
	}
	// If no favicon was found in the document, create a new one.
	else {
		var newLink = document.createElement("link");
		newLink.id = Dwt._favIconId = Dwt.getNextId()
		newLink.rel = "SHORTCUT ICON";
		newLink.href = iconURL;
		newLink.type = "image/x-icon";
		docHead = docHead || document.getElementsByTagName("head")[0];
		docHead.appendChild(newLink);
	}
};

Dwt.enableDesignMode =
function(doc, on) {
	if (!AjxEnv.isIE) {
		doc.designMode = on ? "on" : "off";
	} else {
		var editorBody = doc.body;
		if (!editorBody || editorBody.contentEditable === undefined) {
			doc.designMode = on ? "on" : "off";
		} else {
			editorBody.contentEditable = on ? true : false;
		}
	}
};

/**
 * Hack to work around FF 3.6 change in behavior with regard to mouse down/up in
 * scrollbar, which breaks this list view's scrollbar. Return true and tell DOM
 * not to call <code>preventDefault()</code>, since we want default browser behavior.
 * <p>
 * Note: Callers should set up their elements so that a click that is not within
 * a scrollbar goes to a more specific element (and not the one that scrolls).
 * That way we don't have to perform sketchy math to see if the click was in the
 * scrollbar.
 * </p>
 * <p>
 * <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=489667">https://bugzilla.mozilla.org/show_bug.cgi?id=489667</a>
 * </p>
 * <p>It looks like the FF bug will be fixed with the release of 3.6.4.</p>
 * @param {DwtMouseEvent}	ev			the event
 * @return	{boolean}	<code>true</code> if FF3.6+ scrollbar click was detected and handled
 * 
 * @private
 */
Dwt.ffScrollbarCheck =
function(ev) {
	if (AjxEnv.isFirefox3_6up || AjxEnv.isDesktop2up) {
		var t = ev.target;
		if (t && (t.clientHeight && t.scrollHeight && (t.clientHeight != t.scrollHeight)) ||
				 (t.clientWidth && t.scrollWidth && (t.clientWidth != t.scrollWidth)))
		{
			ev._dontCallPreventDefault = true;
			ev._stopPropagation = false;
			ev._returnValue = true;
			return true;
		}
	}
	return false;
};

Dwt.selectText =
function(el) {

	if (!el) {
		Dwt.deselectText();
		return;
	}

	if (document.selection) {
		// IE
		var range = el.parentTextEdit.createTextRange();
		range.moveToElementText(el);
		range.select();
	}
	else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(el);
		var sel = window.getSelection();
		sel.addRange(range);
	}
};

Dwt.deselectText =
function() {

	if (document.selection) {
		// IE
		document.selection.empty();
	}
	else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
};

/**
 * Inserts some text into an input at the caret.
 *
 * @param {Element}     input       INPUT or TEXTAREA
 * @param {String}      text        text to insert
 */
Dwt.insertText = function(input, text) {

    if (!input || !text) {
        return;
    }

    if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        input.focus();
    }
    else if (AjxUtil.isSpecified(input.selectionStart)) {
        var start = input.selectionStart,
            end = input.selectionEnd;
        input.value = input.value.substring(0, start) + text + input.value.substring(end, input.value.length);
        input.selectionStart = start + text.length;
        input.selectionEnd = end + text.length;
    }
    else {
        input.value += text;
    }
};

/**
 * Returns true if the two elements overlap.
 * 
 * @param el1
 * @param el2
 */
Dwt.doOverlap =
function(el1, el2) {

	if (!el1 || !el2) { return false; }

	var loc1 = Dwt.getLocation(el1), loc2 = Dwt.getLocation(el2);
	var size1 = Dwt.getSize(el1), size2 = Dwt.getSize(el2);
	var left1 = loc1.x, left2 = loc2.x, top1 = loc1.y, top2 = loc2.y;
	var right1 = left1 + size1.x, right2 = left2 + size2.x;
	var bottom1 = top1 + size1.y, bottom2 = top2 + size2.y;

	return !(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2);
};

/**
 * Resets the scrollTop of container (if necessary) to ensure that element is visible.
 * 
 * @param {Element}		element		the element to be made visible
 * @param {Element}		container	the containing element to possibly scroll
 * @private
 */
Dwt.scrollIntoView =
function(element, container) {
	
	if (!element || !container) { return; }
	
	var elementTop = Dwt.toWindow(element, 0, 0, null, null, DwtPoint.tmp).y;
	var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y + container.scrollTop;

	var diff = elementTop - containerTop;
	if (diff < 0) {
		container.scrollTop += diff;
	} else {
		var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
		var elementH = Dwt.getSize(element, DwtPoint.tmp).y;
		diff = (elementTop + elementH) - (containerTop + containerH);
		if (diff > 0) {
			container.scrollTop += diff;
		}
	}
};

/**
 * Sets up a hidden div for performance metrics.  Use to set the start of object rendering
 * @param id {String}
 * @param date {Date}
 */
Dwt.setLoadingTime = 
function(id, date) {
	if (!window.isPerfMetric) { return;	}
	date = date || new Date();
	id += "_loading";
	var div = document.getElementById(id);
	if (!div) {
		div = document.createElement("div");
		div.id = id;
		div.style.display = "none";
		document.body.appendChild(div);
	}
	div.innerHTML = date.getTime();
	if (window.appDevMode) {
		console.profile(id);
	}
};

/**
 * Sets up a hidden div for performance metrics.  Use to set the end of object rendering
 * @param id {String}
 * @param date {Date}
 */
Dwt.setLoadedTime = 
function(id, date) {
	if (!window.isPerfMetric) { return;	}
	date = date || new Date();
	id += "_loaded";
	var div = document.getElementById(id);
	if (!div) {
		div = document.createElement("div");
		div.id = id;
		div.style.display = "none";
		document.body.appendChild(div);
	}
	div.innerHTML = date.getTime();
	if (window.appDevMode) {
		console.profileEnd();
	}
};

/**
 * Prints the computed time from performance metrics data
 */
Dwt.printPerfMetric =
function() {
	//code to print all loading stats
	$.each($('div[id*="_loaded"]'), function(index, elem) {
		var end_id = $(elem).attr("id");
		var start_id_prefix = end_id.substring(0,end_id.indexOf("_"));
		var end_elem = $("#" + start_id_prefix+"_launched");
		if (end_elem && end_elem.length > 0) {
			var end_time = $("#" + start_id_prefix+"_launched").html();
		} else {
			end_time = $("#" + start_id_prefix+"_loading").html();
		}
		var log = "Load time for " + start_id_prefix + " is " + ($(elem).html()-end_time);
		DBG.println(AjxDebug.DBG1,log);
		if (console) {
			console.log(log);
		}
	});
}

// Css for Templates
Dwt.createLinearGradientCss =
function(startColor, endColor, direction) {
    var gradientCss = null;
    var gradient = this.createLinearGradientInfo(startColor, endColor, direction);
    if (gradient.field) {
        gradientCss = gradient.field + ":" + gradient.css + ";";
    }
    return gradientCss;
}

/**
 * -- FF 3.6+
 *    background: -moz-linear-gradient(black, white);
 * -- Safari 4+, Chrome 2+
 *    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #000000), color-stop(100%, #ffffff));
 * -- Safari 5.1+, Chrome 10+
 *    background: -webkit-linear-gradient(top, black, white);
 * -- Opera 11.10
 *    background: -o-linear-gradient(black, white);
 * -- IE6 & IE7
 *    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#ffffff');
 * -- IE10
 *    background: -ms-linear-gradient(black, white);
 * -- the standard
 *    background: linear-gradient(black, white);
 */
Dwt.createLinearGradientInfo =
function(startColor, endColor, direction) {

    var cssDirection;
    var gradient = {};
	if (AjxEnv.isIE9) {
        var params = {
            x1: "0%",
            x2: direction == 'v' ? "0%" : "100%",
            y1: "0%",
            y2: direction == 'v' ? "100%" : "0%",
            startColor: startColor,
            endColor: endColor
        };
        var svgsrc =
            AjxTemplate.expand('dwt.Widgets#SVGGradient', params);
        gradient.field = "background";
        gradient.css   = ('url(data:image/svg+xml,' +
                          escape(svgsrc.replace(/\s+/g, ' ')) + ')');
    } else if (AjxEnv.isFirefox3_6up) {
        cssDirection = (direction == 'v') ? 'top' : 'left';
        gradient.field = "background";
        gradient.css   = "-moz-linear-gradient(" + cssDirection + "," + startColor + ", "  + endColor + ")";
    } else if ((AjxEnv.isSafari && AjxEnv.isSafari5_1up) || AjxEnv.isChrome10up) {
        cssDirection = (direction == 'v') ? 'top' : 'left';
        gradient.field = "background";
        gradient.css   = "-webkit-linear-gradient(" + cssDirection + ","+
                          startColor + ", " + endColor + ")";
    } else if ((AjxEnv.isSafari && AjxEnv.isSafari4up) || AjxEnv.isChrome2up) {
        var startPt = 'left top';
        var endPt   = (direction == 'v') ? "left bottom" : "right top";
        gradient.field = "background";
        gradient.css   = "-webkit-gradient(linear, " + startPt + ", " + endPt +
                         ", color-stop(0%, " + startColor + "), color-stop(100%, " + endColor + "))";
    } else {
        cssDirection = (direction == 'v') ? 'to bottom' : 'to right';
        gradient.field = "background";
        gradient.css   = "linear-gradient(" + cssDirection + "," + startColor + ", "  + endColor + ")";
    }
    return gradient;
}

// Used for an unattached DOM subtree.
Dwt.getDescendant =
function(htmlElement, id) {
    var descendant = null;
    for (var i = 0; i < htmlElement.childNodes.length; i++) {
        var child = htmlElement.childNodes[i];
        if (child.id == id) {
            descendant = child;
        } else {
            descendant = Dwt.getDescendant(child, id);
        }
        if (descendant != null) {
            break;
        }
    }
    return descendant;
};

Dwt.getPreviousElementSibling =
function(element) {
	var sibling = element.previousElementSibling;

	if (sibling !== undefined) {
		return sibling;
	}

	// workaround for missing previousElementSibling in MSIE 8
	for (sibling = element.previousSibling;
		 sibling && sibling.nodeType !== 1;
		 sibling = sibling.previousSibling);

	return sibling;
}

Dwt.getNextElementSibling =
function(element) {
	var sibling = element.nextElementSibling;

	if (sibling !== undefined) {
		return sibling;
	}

	// workaround for missing nextElementSibling in MSIE 8
	for (sibling = element.nextSibling;
		 sibling && sibling.nodeType !== 1;
		 sibling = sibling.nextSibling);

	return sibling;
}

Dwt.getScrollbarSizes = function(node) {
    var insets = Dwt.getInsets(node);
    var style = DwtCssStyle.getComputedStyleObject(node);

    var bl = parseInt(style.borderLeftWidth)    || 0;
    var bt = parseInt(style.borderTopWidth)     || 0;
    var br = parseInt(style.borderRightWidth)   || 0;
    var bb = parseInt(style.borderBottomWidth)  || 0;

    var width = node.offsetWidth - node.clientWidth - bl - br;
    var height = node.offsetHeight - node.clientHeight - bt - bb;

    return new DwtPoint(width, height);
};
}
if (AjxPackage.define("ajax.dwt.core.DwtDraggable")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
* @class
* This static class enables entities (for example, {@link DwtDialog}s) to be dragged around within
* an application window. The code is basically the same as in dom-drag.js from www.youngpup.net
*
* @author Ross Dargahi
* 
* @private
*/
DwtDraggable = function() {
}

DwtDraggable.dragEl = null;

/**
 * Initializes dragging for <code>dragEl</code>
 * 
 * @param {HTMLElement} dragEl 	the element being dragged, can also be a handle e.g. the
 * 		title bar in a dialog
 * @param {HTMLElement} [rootEl]	the actual element that will be moved. This will be a
 * 		parent element of <i>dragEl</i>
 * @param {number} [minX] 	the minimum x coord to which we can drag
 * @param {number} [maxX] 	the maximum x coord to which we can drag
 * @param {number} [minY] 	the minimum y coord to which we can drag
 * @param {number} [maxY] 	the maximum x coord to which we can drag
 * @param {AjxCallback} dragStartCB	the callback that is called when dragging is started
 * @param {AjxCallback}dragCB		the callback that is called when dragging
 * @param {AjxCallback}dragEndCB	the callback that is called when dragging is ended
 * @param {boolean} [swapHorizRef]	if <code>true</code>, then mouse motion to the right will move element left
 * @param {boolean} [swapVertRef]		if <code>true</code>, then mouse motion to the bottom will move element up
 * @param {function} [fXMapper] 		the function that overrides this classes x coordinate transformations
 * @param {function} [fYMapper] 		the function that overrides this classes y coordinate transformations
 *
 */
DwtDraggable.init = 
function(dragEl, rootEl, minX, maxX, minY, maxY, dragStartCB, dragCB, dragEndCB, 
		 swapHorizRef, swapVertRef, fXMapper, fYMapper) {
	dragEl.onmousedown = DwtDraggable.__start;

	dragEl.__hMode = swapHorizRef ? false : true;
	dragEl.__vMode = swapVertRef ? false : true;

	dragEl.__root = (rootEl && rootEl != null) ? rootEl : dragEl ;

	if (dragEl.__hMode && isNaN(parseInt(dragEl.__root.style.left))) 
		dragEl.__root.style.left = "0px";
	if (dragEl.__vMode && isNaN(parseInt(dragEl.__root.style.top))) 
		dragEl.__root.style.top = "0px";
		
	if (!dragEl.__hMode && isNaN(parseInt(dragEl.__root.style.right))) 
		dragEl.__root.style.right = "0px";
	if (!dragEl.__vMode && isNaN(parseInt(dragEl.__root.style.bottom))) 
		dragEl.__root.style.bottom = "0px";

	dragEl.__minX = (typeof minX != 'undefined') ? minX : null;
	dragEl.__minY = (typeof minY != 'undefined') ? minY : null;
	dragEl.__maxX = (typeof maxX != 'undefined') ? maxX : null;
	dragEl.__maxY = (typeof maxY != 'undefined') ? maxY : null;

	dragEl.__xMapper = fXMapper ? fXMapper : null;
	dragEl.__yMapper = fYMapper ? fYMapper : null;

	dragEl.__root.onDragStart = dragStartCB
	dragEl.__root.onDragEnd = dragEndCB
	dragEl.__root.onDrag = dragCB;
};

/**
 * Sets the minimum and maximum drag boundries
 * 
 * @param {HTMLElement} dragEl Element being dragged, can also be a handle e.g. the
 * 		title bar in a dialog
 * @param {number} minX 	the minimum x coordinate
 * @param {number} maxX 	the maximum x coordinate
 * @param {number} minY 	the minimum y coordinate
 * @param {number} maxY 	the maximum y coordinate
 */
DwtDraggable.setDragBoundaries =
function (dragEl ,minX, maxX, minY, maxY) {
	if (dragEl != null) {
		if (minX != null) dragEl.__minX = minX;
		if (maxX != null) dragEl.__maxX = maxX;
		if (minY != null) dragEl.__minY = minY;
		if (maxY != null) dragEl.__maxY = maxY;
	}
};

/** @private */
DwtDraggable.__start =
function(e)	{
	var dragEl = DwtDraggable.dragEl = this;
	e = DwtDraggable.__fixE(e);
	var x = parseInt(dragEl.__hMode ? dragEl.__root.style.left : dragEl.__root.style.right );
	var y = parseInt(dragEl.__vMode ? dragEl.__root.style.top  : dragEl.__root.style.bottom);
	if (dragEl.__root.onDragStart)
		dragEl.__root.onDragStart.run([x, y]);

	dragEl.__lastMouseX = e.clientX;
	dragEl.__lastMouseY = e.clientY;

	if (dragEl.__hMode) {
		if (dragEl.__minX != null)	
			dragEl.__minMouseX = e.clientX - x + dragEl.__minX;
		if (dragEl.__maxX != null)
			dragEl.__maxMouseX = dragEl.__minMouseX + dragEl.__maxX - dragEl.__minX;
	} else {
		if (dragEl.__minX != null)
			dragEl.__maxMouseX = -dragEl.__minX + e.clientX + x;
		if (dragEl.__maxX != null)
			dragEl.__minMouseX = -dragEl.__maxX + e.clientX + x;
	}

	if (dragEl.__vMode) {
		if (dragEl.__minY != null)
			dragEl.__minMouseY = e.clientY - y + dragEl.__minY;
		if (dragEl.__maxY != null)
			dragEl.__maxMouseY = dragEl.__minMouseY + dragEl.__maxY - dragEl.__minY;
	} else {
		if (dragEl.__minY != null)
			dragEl.__maxMouseY = -dragEl.__minY + e.clientY + y;
		if (dragEl.__maxY != null)
			dragEl.__minMouseY = -dragEl.__maxY + e.clientY + y;
	}

	document.onmousemove = DwtDraggable.__drag;
	document.onmouseup = DwtDraggable.__end;

	return false;
};

/** @private */
DwtDraggable.__drag =
function(e)	{
	e = DwtDraggable.__fixE(e);
	var dragEl = DwtDraggable.dragEl;

	var ey	= e.clientY;
	var ex	= e.clientX;
	var x = parseInt(dragEl.__hMode ? dragEl.__root.style.left : dragEl.__root.style.right );
	var y = parseInt(dragEl.__vMode ? dragEl.__root.style.top  : dragEl.__root.style.bottom);
	var nx, ny;

	if (!dragEl.__xMapper) {
		if (dragEl.__minX != null)
			ex = dragEl.__hMode ? Math.max(ex, dragEl.__minMouseX) : Math.min(ex, dragEl.__maxMouseX);
		if (dragEl.__maxX != null)
			ex = dragEl.__hMode ? Math.min(ex, dragEl.__maxMouseX) : Math.max(ex, dragEl.__minMouseX);
		nx = x + ((ex - dragEl.__lastMouseX) * (dragEl.__hMode ? 1 : -1));
	} else {
		nx = dragEl.__xMapper(x, ex);
	}

	if (!dragEl.__yMapper) {
		if (dragEl.__minY != null)
			ey = dragEl.__vMode ? Math.max(ey, dragEl.__minMouseY) : Math.min(ey, dragEl.__maxMouseY);
		if (dragEl.__maxY != null)
			ey = dragEl.__vMode ? Math.min(ey, dragEl.__maxMouseY) : Math.max(ey, dragEl.__minMouseY);
		ny = y + ((ey - dragEl.__lastMouseY) * (dragEl.__vMode ? 1 : -1));
	} else {
		ny = dragEl.__yMapper(y, ey);
	}

	DwtDraggable.dragEl.__root.style[dragEl.__hMode ? "left" : "right"] = nx + "px";
	DwtDraggable.dragEl.__root.style[dragEl.__vMode ? "top" : "bottom"] = ny + "px";
	DwtDraggable.dragEl.__lastMouseX = ex;
	DwtDraggable.dragEl.__lastMouseY = ey;

	if (DwtDraggable.dragEl.__root.onDrag)
		DwtDraggable.dragEl.__root.onDrag.run([nx, ny]);
		
	return false;
};

/** @private */
DwtDraggable.__end =
function() {
	document.onmousemove = null;
	document.onmouseup   = null;
	if (DwtDraggable.dragEl.__root.onDragEnd)
		DwtDraggable.dragEl.__root.onDragEnd.run([parseInt(DwtDraggable.dragEl.__root.style[DwtDraggable.dragEl.__hMode ? "left" : "right"]), 
											 	  parseInt(DwtDraggable.dragEl.__root.style[DwtDraggable.dragEl.__vMode ? "top" : "bottom"])]);
	DwtDraggable.dragEl = null;
};

/** @private */
DwtDraggable.__fixE =
function(e) {
	if (typeof e == 'undefined')
		e = window.event;
	if (!AjxEnv.isWebKitBased) {
		if (typeof e.layerX == 'undefined')
			e.layerX = e.offsetX;
		if (typeof e.layerY == 'undefined')
			e.layerY = e.offsetY;
	}
	return e;
};
}

if (AjxPackage.define("ajax.dwt.events.DwtEvent")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * This class is the base class of all DWT events.
 * 
 * @param {boolean} 	__init 	a dummy parameter used for class initialization
 * 
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 */
DwtEvent = function(__init) {
	if (arguments.length == 0) return;
	/**
	 * The Dwt object that generated the event
	 * @type DwtControl
	 */
	this.dwtObj = null;
}

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtEvent.prototype.toString = 
function() {
	return "DwtEvent";
}

// native browser events - value is the associated DOM property
/**
 * Browser "onchange" event.
 */
DwtEvent.ONCHANGE = "onchange";

/**
 * Browser "onclick" event.
 */
DwtEvent.ONCLICK = "onclick";

/**
 * Browser "oncontextmenu" event.
 */
DwtEvent.ONCONTEXTMENU = "oncontextmenu";

/**
 * Browser double-click event "ondblclick" event.
 */
DwtEvent.ONDBLCLICK = "ondblclick";

/**
 * Browser "onfocus" event.
 */
DwtEvent.ONFOCUS = "onfocus";

/**
 * Browser "onblur" event.
 */
DwtEvent.ONBLUR = "onblur";

/**
 * Browser "onkeydown" event.
 */
DwtEvent.ONKEYDOWN = "onkeydown";

/**
 * Browser "onkeypress" event.
 */
DwtEvent.ONKEYPRESS = "onkeypress";

/**
 * Browser "onkeyup" event.
 */
DwtEvent.ONKEYUP = "onkeyup";

/**
 * Browser "onmousedown" event.
 */
DwtEvent.ONMOUSEDOWN = "onmousedown";

/**
 * Browser "onmouseenter" event (IE Only) - reported only for the element.
 */
DwtEvent.ONMOUSEENTER = "onmouseenter";

/**
 * Browser "onmouseleave" event (IE Only) - reported only for the element.
 */
DwtEvent.ONMOUSELEAVE = "onmouseleave";

/**
 * Browser "onmousemove" event.
 */
DwtEvent.ONMOUSEMOVE = "onmousemove";

/**
 * Browser "onmouseout" event - reported for element and children.
 */
DwtEvent.ONMOUSEOUT = "onmouseout";

/**
 * Browser "onmouseover" event - reported for element and children.
 */
DwtEvent.ONMOUSEOVER = "onmouseover";

/**
 * Browser "onmouseup" event
 */
DwtEvent.ONMOUSEUP = "onmouseup";

/**
 * Browser "onmousewheel" event.
 */
DwtEvent.ONMOUSEWHEEL = "onmousewheel";

/**
 * Browser "onselectstart" event.
 */
DwtEvent.ONSELECTSTART = "onselectstart";

/**
 * Browser "onscroll" event.
 */
DwtEvent.ONSCROLL = "onscroll";

/**
 * Browser "onpaste" event.
 */
DwtEvent.ONPASTE = "onpaste";

/**
 * Browser "oncut" event.
 */
DwtEvent.ONCUT = "oncut";

/**
 * Browser "oninput" event is fired synchronously when the value of an <input> or <textarea> element is changed.
 */
DwtEvent.ONINPUT = "oninput";

// semantic events

/**
 * Action event. An example is right-clicking on a list item or tree item
 * generally brings up a context menu.
 */
DwtEvent.ACTION	= "ACTION";

/**
 * Control event. Control events are fired by resizing or repositioning {@link DwtControl}s.
 */
DwtEvent.CONTROL = "CONTROL";		// resize

/**
 * Date Range events are fired by the {@link DwtCalendar} widget. This event is
 * fired when the date range of the calendar widget changes.
 */
DwtEvent.DATE_RANGE	= "DATE_RANGE";

/**
 * The dispose event is fired when the {@link DwtControl#dispose} method of a control is called.
 */
DwtEvent.DISPOSE = "DISPOSE";

/**
 * The enter event is fired when the enter key is pressed.
 * @private
 */
DwtEvent.ENTER = "ENTER";			// enter/return key

/**
 * This event is fired when the mouse hovers over a control for a certain period of time.
 */
DwtEvent.HOVEROVER = "HOVEROVER";

/**
 * This event is fired when the mouse stops hovering over a control.
 */
DwtEvent.HOVEROUT = "HOVEROUT";

/**
 * The popdown event is fired when a item (such as a {@link DwtMenu}) is popped down.
 */
DwtEvent.POPDOWN = "POPDOWN";

/**
 * The popup event is fired when a item (such as a {@link DwtMenu}) is popped up.
 */
DwtEvent.POPUP = "POPUP";

/**
 * The selection event is fired when controls are selected. This generally means
 * that there has been a "left mouse button click" in the control (for example: a button, or
 * list item, or tree node).
 */
DwtEvent.SELECTION = "SELECTION";		// left-click

/**
 * A tree event is fired when a {@link DwtTree} node is expanded or collapsed.
 */
DwtEvent.TREE = "TREE";

/**
 * State change events are fired when some intrinsic state of a widget changes. For
 * example it may be that an item was added to a {@link DwtListView}
 */
DwtEvent.STATE_CHANGE	= "STATE_CHANGE";

/**
 * The tab event is fired when the tab key is pressed.
 * @private
 */
DwtEvent.TAB = "TAB";

// XForms
DwtEvent.XFORMS_READY				= "xforms-ready";
DwtEvent.XFORMS_DISPLAY_UPDATED		= "xforms-display-updated";
DwtEvent.XFORMS_VALUE_CHANGED		= "xforms-value-changed";
DwtEvent.XFORMS_FORM_DIRTY_CHANGE	= "xforms-form-dirty-change";
DwtEvent.XFORMS_CHOICES_CHANGED		= "xforms-choices-changed";
DwtEvent.XFORMS_VALUE_ERROR			= "xforms-value-error";
DwtEvent.XFORMS_INSTANCE_CHANGED 	= "xforms-instance-cahnged"; //fires when a new instance is applied to the form

// Convenience lists
/**
 * An array of key event types.
 */
DwtEvent.KEY_EVENTS = [DwtEvent.ONKEYDOWN, DwtEvent.ONKEYPRESS, DwtEvent.ONKEYUP];

/**
 * An array of mouse event types.
 */
DwtEvent.MOUSE_EVENTS = [
	DwtEvent.ONCONTEXTMENU, DwtEvent.ONCLICK, DwtEvent.ONDBLCLICK,
	DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP,
	DwtEvent.ONSELECTSTART, DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT
];
}
if (AjxPackage.define("ajax.dwt.events.DwtControlEvent")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * 
 * @private
 */
DwtControlEvent = function() {
	this.reset();
}
DwtControlEvent.prototype = new DwtEvent;
DwtControlEvent.prototype.constructor = DwtControlEvent;

// type of control event
//      RESIZE	       -- for setSize
//      MOVE	       -- for setLocation
//      RESIZE | MOVE  -- for setBounts (bitwise or)
//      STATE	       -- for setDisplayState (bitwise or)

DwtControlEvent.RESIZE = 1;
DwtControlEvent.MOVE = 2;
DwtControlEvent.STATE = 4;

DwtControlEvent.prototype.toString = 
function() {
	return "DwtControlEvent";
}

DwtControlEvent.prototype.reset = 
function(type) {
	this.oldX = Dwt.DEFAULT;
	this.oldY = Dwt.DEFAULT;
	this.oldWidth = Dwt.DEFAULT;
	this.oldHeight = Dwt.DEFAULT;
	this.oldState = null;
	this.newX = Dwt.DEFAULT;
	this.newY = Dwt.DEFAULT;
	this.newWidth = Dwt.DEFAULT;
	this.newHeight = Dwt.DEFAULT;
	this.newState = null;
	this.type = type || null;
}
}
if (AjxPackage.define("ajax.dwt.events.DwtUiEvent")) {
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
 * 
 * 
 * @private
 */
DwtUiEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}

DwtUiEvent.prototype = new DwtEvent;
DwtUiEvent.prototype.constructor = DwtUiEvent;

DwtUiEvent.prototype.isDwtUiEvent = true;
DwtUiEvent.prototype.toString = function() { return "DwtUiEvent"; }

DwtUiEvent.prototype.reset =
function() {
	this.dwtObj = null
	this.altKey = false;
	this.ctrlKey = false;
	this.metaKey = false;
	this.shiftKey = false;
	this.target = null;
	this.type = null;
	this.docX = -1;
	this.docY = -1;
	this.elementX = -1;
	this.elementY = -1;
	this.ersatz = false; // True means this event was manufactured
	this._stopPropagation = false;
	this._returnValue = true;
	this._dontCallPreventDefault = false; // True means to allow the the (unusual) situation in Firefox where we
	                                      // want the event handler to return false without calling preventDefault().
}

/**
 * Pass caller's "this" as 'target' if using IE and the ev may have come from another window. The target
 * will be used to get to the window that generated the event, so the event can be found.
 */
DwtUiEvent.getEvent =
function(ev, target) {
	ev = ev || window.event;
	if (ev) { return ev; }

	// get event from iframe in IE; see http://www.outofhanwell.com/blog/index.php?cat=25
	if (target) {
		DBG.println(AjxDebug.DBG3, "getEvent: Checking other window for event");
		var pw = (target.ownerDocument || target.document || target).parentWindow;
		return pw ? pw.event : null;
	}
}

/**
 * Returns the target element of the event.
 * 
 * @param ev				[Event]		DHTML event
 * @param useRelatedTarget	[boolean]*	if true, return element that was related to this event;
 * 										for a MOUSEOVER or MOUSEOUT event, that's the element
 * 										moved from/to.
 */
DwtUiEvent.getTarget =
function(ev, useRelatedTarget)  {
	ev = DwtUiEvent.getEvent(ev);
	if (!ev) { return null; }
	if (!useRelatedTarget) {
		if (ev.target) {
			// if text node (like on Safari) return parent
			return (ev.target.nodeType == 3) ? ev.target.parentNode : ev.target;
		} else if (ev.srcElement) {		// IE
			return ev.srcElement;
		}
	} else {
		if (ev.relatedTarget) {
			return ev.relatedTarget;
		} else if (ev.toElement) {		// IE
			return ev.toElement;
		} else if (ev.fromElement) {	// IE
			return ev.fromElement;
		}
	}
	return null;
}

/**
 * Returns the first element with a value for the given property, working its way up the element chain.
 *
 * @param ev				[Event]		DHTML event
 * @param prop				[string]	the name of a property
 * @param useRelatedTarget	[boolean]*	if true, return element that was related to this event;
 * @param value				[string]*	expected value of given property
 */
DwtUiEvent.getTargetWithProp =
function(ev, prop, useRelatedTarget, value)  {
	var htmlEl = DwtUiEvent.getTarget(ev, useRelatedTarget);
	while (htmlEl) {
		var elValue = Dwt.getAttr(htmlEl, prop);
		if (elValue != null && elValue !== "" && (!value || (elValue == value))) {
			return htmlEl;
		}
		htmlEl = htmlEl.parentNode;
	}
	return null;
}

/**
 * Returns the first element with the given class name, working its way up the element chain.
 *
 * @param ev				[Event]		DHTML event
 * @param className			[string]	the requested class name
 * @param useRelatedTarget	[boolean]*	if true, return element that was related to this event;
 */
DwtUiEvent.getTargetWithClass =
function(ev, className, useRelatedTarget)  {
	var htmlEl = DwtUiEvent.getTarget(ev, useRelatedTarget);
	while (htmlEl && htmlEl.nodeType === 1) {
		if (Dwt.hasClass(htmlEl, className)) {
			return htmlEl;
		}
		htmlEl = htmlEl.parentNode;
	}
	return null;
}

/**
 * Returns the first element with values for all of the given properties, working its way up the element chain.
 *
 * @param ev				[Event]		DHTML event
 * @param props				[array]		a list of property names (strings)
 */
DwtUiEvent.getTargetWithProps =
function(ev, props)  {
	var htmlEl = DwtUiEvent.getTarget(ev);
	while (htmlEl) {
		var okay = true;
		for (var i in props) {
			var val = Dwt.getAttr(htmlEl, props[i]);
			if (val == null || val === "") {
				htmlEl = htmlEl.parentNode;
				okay = false;
				break;
			}
		}
		if (okay)
			return htmlEl;
	}
	return null;
}

DwtUiEvent.copy = 
function(dest, src) {
	dest.altKey = src.altKey;
	dest.ctrlKey = src.ctrlKey;
	dest.metaKey = src.metaKey;
	dest.shiftKey = src.shiftKey;
	dest.target = src.target;
	dest.type = src.type;
	dest.dwtObj = src.dwtObj;
	dest.docX = src.docX;
	dest.docY = src.docY;
	dest.elementX = src.elementX;
	dest.elementY = src.elementY;
	dest.ersatz = src.ersatz;
	dest._stopPropagation = src._stopPropagation;
	dest._returnValue = src._returnValue;
}

/**
 * Copies properties from the native DHTML event to this DWT event object. The target
 * control can be optionally fetched by providing true as the second argument.
 * 
 * @param ev	[Event]				DHTML event
 * @param obj	[DwtControl|true]	if true, the target object will be fetched; otherwise
 * 									used to set target object if present
 */
DwtUiEvent.prototype.setFromDhtmlEvent =
function(ev, obj) {
	ev = DwtUiEvent.getEvent(ev);
	if (!ev) { return; }
	this.altKey = ev.altKey;
	this.ctrlKey = ev.ctrlKey;
	this.metaKey = ev.metaKey;
	this.shiftKey = ev.shiftKey;
	this.type = ev.type;
	this.target = DwtUiEvent.getTarget(ev);
	this.dwtObj = (obj === true) ? DwtControl.getTargetControl(ev) : obj;

	// Compute document coordinates
	if (ev.pageX != null) {
		this.docX = ev.pageX;
		this.docY = ev.pageY;
	} else if (ev.clientX != null) {
		this.docX = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
		this.docY = ev.clientY + document.body.scrollTop - document.body.clientTop;
		if (document.body.parentElement) {
				var bodParent = document.body.parentElement;
				this.docX += bodParent.scrollLeft - bodParent.clientLeft;
				this.docY += bodParent.scrollTop - bodParent.clientTop;
		}
	}
	// Compute Element coordinates
	if (ev.offsetX != null) {
		this.elementX = ev.offsetX;
		this.elementY = ev.offsetY;
	} else if (!AjxEnv.isWebKitBased && ev.layerX != null) {
		this.elementX = ev.layerX;
		this.elementY = ev.layerY;
	} else { // fail hard for others
		this.elementX = Dwt.DEFAULT;
		this.elementY = Dwt.DEFAULT;
	}
	
	this.ersatz = false;
	return ev;
}

DwtUiEvent.prototype.setToDhtmlEvent =
function(ev) {
	DwtUiEvent.setBehaviour(ev, this._stopPropagation, this._returnValue, this._dontCallPreventDefault);
}

DwtUiEvent.setBehaviour =
function(ev, stopPropagation, allowDefault, dontCallPreventDefault) {
	var dhtmlEv = DwtUiEvent.getEvent(ev);
	DwtUiEvent.setDhtmlBehaviour(dhtmlEv, stopPropagation, allowDefault, dontCallPreventDefault);
};

DwtUiEvent.setDhtmlBehaviour =
function(dhtmlEv, stopPropagation, allowDefault, dontCallPreventDefault) {

	dhtmlEv = DwtUiEvent.getEvent(dhtmlEv);
	if (!dhtmlEv) { return; }

	// stopPropagation is referring to the function found in Mozilla's event object
	if (dhtmlEv.stopPropagation != null) {
		if (stopPropagation)
			dhtmlEv.stopPropagation();
		if (!allowDefault && !dontCallPreventDefault)
			dhtmlEv.preventDefault();
	} else {
		// IE only..
		dhtmlEv.returnValue = allowDefault;
		dhtmlEv.cancelBubble = stopPropagation;
	}
};

/**
 * @deprecated
 * Use DwtControl.getTargetControl() instead.
 * 
 * Returns a control (DWT object) based on the event, by finding the event target and using
 * its reference to a DWT object in the element's "dwtObj" expando property.
 * 
 * @param ev				[Event]		DHTML event
 * @param useRelatedTarget	[boolean]*	if true, return element that was related to this event;
 */
DwtUiEvent.getDwtObjFromEvent =
function(ev, useRelatedTarget) {
	var htmlEl = DwtUiEvent.getTargetWithProp(ev, "dwtObj", useRelatedTarget);
	return htmlEl ? Dwt.getObjectFromElement(htmlEl) : null;
};

/**
 * @deprecated
 * Instead, do something like this:
 * 		var htmlEl = DwtUiEvent.getTargetWithProp(ev, "myProp");
 * 		var obj = DwtControl.findControl(htmlEl);
 * 
 * Returns a control (DWT object) based on the event, by finding the event target with the
 * given property and using its reference to a DWT object.
 * 
 * @param ev				[Event]		DHTML event
 * @param useRelatedTarget	[boolean]*	if true, return element that was related to this event;
 */
DwtUiEvent.getDwtObjWithProp =
function(ev, prop) {
	var htmlEl = DwtUiEvent.getTargetWithProps(ev, ["dwtObj", prop]);
	return htmlEl ? Dwt.getObjectFromElement(htmlEl) : null;
};
}
if (AjxPackage.define("ajax.dwt.events.DwtFocusEvent")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * 
 * @private
 */
DwtFocusEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}
DwtFocusEvent.prototype = new DwtEvent;
DwtFocusEvent.prototype.constructor = DwtFocusEvent;

DwtFocusEvent.FOCUS = 1;
DwtFocusEvent.BLUR = 2;

DwtFocusEvent.prototype.toString = 
function() {
	return "DwtFocusEvent";
}

DwtFocusEvent.prototype.reset = 
function() {
	this.dwtObj = null;
	this.state = DwtFocusEvent.FOCUS;
}
}
if (AjxPackage.define("ajax.dwt.events.DwtKeyEvent")) {
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
 * 
 * @private
 */
DwtKeyEvent = function() {
	DwtUiEvent.call(this, true);
	this.reset(true);
};

DwtKeyEvent.prototype.toString = function() { return "DwtKeyEvent"; }
DwtKeyEvent.prototype.isDwtKeyEvent = true;

// Constants for key codes
DwtKeyEvent.KEY_END_OF_TEXT     = 3;      // Enter key on Mac
DwtKeyEvent.KEY_BACKSPACE       = 8;
DwtKeyEvent.KEY_TAB             = 9;
DwtKeyEvent.KEY_RETURN          = 13;
DwtKeyEvent.KEY_ENTER           = DwtKeyEvent.KEY_RETURN;
DwtKeyEvent.KEY_ESCAPE          = 27;
DwtKeyEvent.KEY_SPACE           = 32;
DwtKeyEvent.KEY_ARROW_LEFT      = 37;
DwtKeyEvent.KEY_ARROW_UP        = 38;
DwtKeyEvent.KEY_ARROW_RIGHT     = 39;
DwtKeyEvent.KEY_ARROW_DOWN      = 40;
DwtKeyEvent.KEY_DELETE          = 46;
DwtKeyEvent.KEY_SEMICOLON       = 59;
DwtKeyEvent.KEY_SEMICOLON_1     = 186;
DwtKeyEvent.KEY_COMMA           = 188;
DwtKeyEvent.KEY_COMMAND         = 224;  // Mac FF

// Easy way to check for 3 or 13
DwtKeyEvent.IS_RETURN = {};
DwtKeyEvent.IS_RETURN[ DwtKeyEvent.KEY_END_OF_TEXT ]    = true;
DwtKeyEvent.IS_RETURN[ DwtKeyEvent.KEY_RETURN ]         = true;

// FF on Mac reports keyCode of 0 for many shifted keys
DwtKeyEvent.MAC_FF_CODE = {};
DwtKeyEvent.MAC_FF_CODE["~"] = 192;
DwtKeyEvent.MAC_FF_CODE["!"] = 49;
DwtKeyEvent.MAC_FF_CODE["@"] = 50;
DwtKeyEvent.MAC_FF_CODE["#"] = 51;
DwtKeyEvent.MAC_FF_CODE["$"] = 52;
DwtKeyEvent.MAC_FF_CODE["%"] = 53;
DwtKeyEvent.MAC_FF_CODE["^"] = 54;
DwtKeyEvent.MAC_FF_CODE["&"] = 55;
DwtKeyEvent.MAC_FF_CODE["*"] = 56;
DwtKeyEvent.MAC_FF_CODE["("] = 57;
DwtKeyEvent.MAC_FF_CODE[")"] = 48;
DwtKeyEvent.MAC_FF_CODE["-"] = 189;
DwtKeyEvent.MAC_FF_CODE["_"] = 189;
DwtKeyEvent.MAC_FF_CODE["+"] = 187;
DwtKeyEvent.MAC_FF_CODE["|"] = 220;
DwtKeyEvent.MAC_FF_CODE[":"] = 186;
DwtKeyEvent.MAC_FF_CODE["<"] = 188;
DwtKeyEvent.MAC_FF_CODE[">"] = 190;
DwtKeyEvent.MAC_FF_CODE["?"] = 191;

DwtKeyEvent.prototype = new DwtUiEvent;
DwtKeyEvent.prototype.constructor = DwtKeyEvent;


DwtKeyEvent.isKeyEvent =
function(ev) {
	return ev.type && ev.type.search(/^key/i) != -1;
}

DwtKeyEvent.isKeyPressEvent =
function(ev) {
	return (AjxEnv.isIE && ev.type == "keydown") || (ev.type == "keypress");
}

DwtKeyEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtUiEvent.prototype.reset.call(this);
	this.keyCode = 0;
	this.charCode = 0;
}

DwtKeyEvent.prototype.isCommand =
function(ev) {
	return AjxEnv.isMac && this.metaKey || this.ctrlKey;
}

DwtKeyEvent.prototype.setFromDhtmlEvent =
function(ev, obj) {
	ev = DwtUiEvent.prototype.setFromDhtmlEvent.apply(this, arguments);
	if (!ev) { return; }
	this.charCode = ev.charCode || ev.keyCode;
	this.keyCode = ev.keyCode;
}

/**
 * Simple function to return key code from a key event. The code is in keyCode for keydown/keyup.
 * Gecko puts it in charCode for keypress.
 */
DwtKeyEvent.getCharCode =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var key = AjxEnv.isSafari ? ev.keyCode : (ev.charCode || ev.keyCode);
	if (key == 0 && AjxEnv.isMac && AjxEnv.isGeckoBased && ev.type == "keyup" && DwtKeyEvent._geckoCode) {
		// if Mac Gecko, return keyCode saved from keypress event
		key = DwtKeyEvent._geckoCode;
		DwtKeyEvent._geckoCode = null;
	}
	return key;
}

DwtKeyEvent.copy =
function(dest, src) {
	DwtUiEvent.copy(dest, src);
	dest.charCode = src.charCode;
	dest.keyCode = src.keyCode;
}

/**
 * Workaround for the bug where Mac Gecko returns a keycode of 0 for many shifted chars for
 * keydown and keyup. Since it returns a char code for keypress, we save it so that the
 * ensuing keyup can pick it up.
 *
 * FF2 returns keycode 0 for: ~ ! @ # $ % ^ & * ( ) - _ + | : < > ? Alt-anything
 * FF3 returns keycode 0 for: ~ _ | : < > ?
 *
 * FF2 returns incorrect keycode for Ctrl plus any of: 1 2 3 4 5 6 7 8 9 0 ; ' , . /
 *
 * https://bugzilla.mozilla.org/show_bug.cgi?id=448434
 *
 * @param ev
 */
DwtKeyEvent.geckoCheck =
function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	if (ev.type == "keypress") {
		DwtKeyEvent._geckoCode = null;
		if (AjxEnv.isMac && AjxEnv.isGeckoBased) {
			var ch = String.fromCharCode(ev.charCode);
			DwtKeyEvent._geckoCode = DwtKeyEvent.MAC_FF_CODE[ch];
		}
	}
};
}
if (AjxPackage.define("ajax.dwt.events.DwtMouseEvent")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * 
 * @private
 */
DwtMouseEvent = function() {
	DwtUiEvent.call(this, true);
	this.reset(true);
};

DwtMouseEvent.prototype = new DwtUiEvent;
DwtMouseEvent.prototype.constructor = DwtMouseEvent;

DwtMouseEvent.prototype.toString = 
function() {
	return "DwtMouseEvent";
};

DwtMouseEvent.NONE		= 0;
DwtMouseEvent.LEFT 		= 1;
DwtMouseEvent.MIDDLE	= 2;
DwtMouseEvent.RIGHT		= 3;

DwtMouseEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent) {
		DwtUiEvent.prototype.reset.call(this);
	}
	this.button = 0;
};

DwtMouseEvent.prototype.setFromDhtmlEvent =
function(ev, obj) {
	ev = DwtUiEvent.prototype.setFromDhtmlEvent.apply(this, arguments);
	if (!ev) { return; }

	if (ev.which) { // Mozilla or Safari3
		switch (ev.which) {
			case 1:  this.button = DwtMouseEvent.LEFT; break;
			case 2:  this.button = DwtMouseEvent.MIDDLE; break;
			case 3:  this.button = DwtMouseEvent.RIGHT; break;
			default: this.button = DwtMouseEvent.NONE;
		}
	} else if (ev.button) { // IE
		if ((ev.button & 1) != 0) {
			this.button = DwtMouseEvent.LEFT;
		} else if ((ev.button & 2) != 0) {
			this.button = DwtMouseEvent.RIGHT;
		} else if ((ev.button & 4) != 0) {
			this.button = DwtMouseEvent.MIDDLE;
		} else {
			this.button = DwtMouseEvent.NONE;
		}
	}

	if (AjxEnv.isMac && this.button) {
		// Mac only comes with one button, but can take a USB multibutton mouse. Single-button will translate
		// CTRL-LEFT into RIGHT, but leave ctrlKey set to true. Convert that into vanilla RIGHT click. That
		// means we can't distinguish a CTRL-RIGHT, but oh well.
		if (this.ctrlKey && (this.button == DwtMouseEvent.LEFT || this.button == DwtMouseEvent.RIGHT)) {
			this.button = DwtMouseEvent.RIGHT;
			this.ctrlKey = false;
		}
		// allow alt-key to be used for ctrl-select
		if (this.altKey) {
			this.ctrlKey = true;
			this.altKey = false;
		}
	}
};
}
if (AjxPackage.define("ajax.dwt.events.DwtSelectionEvent")) {
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
 * 
 * 
 * @private
 */
DwtSelectionEvent = function(init) {
	if (arguments.length == 0) return;
	DwtUiEvent.call(this, true);
	this.reset(true);
}

DwtSelectionEvent.prototype = new DwtUiEvent;
DwtSelectionEvent.prototype.constructor = DwtSelectionEvent;

DwtSelectionEvent.prototype.toString = 
function() {
	return "DwtSelectionEvent";
}

DwtSelectionEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtUiEvent.prototype.reset.call(this);
	this.button = 0;
	this.detail = null;
	this.item = null;
}

}
if (AjxPackage.define("ajax.dwt.events.DwtTreeEvent")) {
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
 * 
 * @private
 */
DwtTreeEvent = function() {
	DwtSelectionEvent.call(this, true);
}

DwtTreeEvent.prototype = new DwtSelectionEvent;
DwtTreeEvent.prototype.constructor = DwtTreeEvent;

DwtTreeEvent.prototype.toString = 
function() {
	return "DwtTreeEvent";
}

DwtTreeEvent.prototype.setFromDhtmlEvent =
function(ev, obj) {
	ev = DwtSelectionEvent.prototype.setFromDhtmlEvent.apply(this, arguments);
}
}
if (AjxPackage.define("ajax.dwt.events.DwtMouseEventCapture")) {
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
 * Creates a helper class for mouse event capturing.
 * @constructor
 * @class
 *
 * @author Ross Dargahi
 *
 * @param {hash}		params					a hash of parameters:
 * @param {Element}		params.targetObj		the target element
 * @param {string}		params.id				the ID for this capture instance.
 * @param {function}	params.mouseOverHdlr	the browser event handler
 * @param {function}	params.mouseDownHdlr	the browser event handler
 * @param {function}	params.mouseMoveHdlr	the browser event handler
 * @param {function}	params.mouseUpHdlr		the browser event handler
 * @param {function}	params.mouseOutHdlr		the browser event handler
 * @param {function}	params.mouseWheelHdlr	the browser event handler
 * @param {boolean}		params.hardCapture		if <code>true</code>, event propagation is halted at this element (IE only)
 *
 * @private
 */
DwtMouseEventCapture = function(params) {

	params = Dwt.getParams(arguments, DwtMouseEventCapture.PARAMS);

	this.targetObj = params.targetObj;
	this._id = params.id;
	this._mouseOverHdlr = params.mouseOverHdlr || DwtMouseEventCapture.emptyHdlr;
	this._mouseDownHdlr = params.mouseDownHdlr || DwtMouseEventCapture.emptyHdlr;
	this._mouseMoveHdlr = params.mouseMoveHdlr || DwtMouseEventCapture.emptyHdlr;
	this._mouseUpHdlr = params.mouseUpHdlr || DwtMouseEventCapture.emptyHdlr;
	this._mouseOutHdlr = params.mouseOutHdlr || DwtMouseEventCapture.emptyHdlr;
	this._mouseWheelHdlr = params.mouseWheelHdlr || DwtMouseEventCapture.emptyHdlr;
	this._hardCapture = (params.hardCapture !== false)
}

DwtMouseEventCapture.PARAMS = ["targetObj", "id", "mouseOverHdlr", "mouseDownHdlr", "mouseMoveHdlr",
							   "mouseUpHdlr", "mouseOutHdlr", "mouseWheelHdlr", "hardCapture"];

DwtMouseEventCapture._capturing = false;

DwtMouseEventCapture.getCaptureObj =
function() {
	return window._mouseEventCaptureObj;
}

DwtMouseEventCapture.getTargetObj =
function() {
	return window._mouseEventCaptureObj ? window._mouseEventCaptureObj.targetObj : null;
}

DwtMouseEventCapture.getId =
function() {
	return window._mouseEventCaptureObj ? window._mouseEventCaptureObj._id : null;
}

DwtMouseEventCapture.prototype.toString = 
function() {
	return "DwtMouseEventCapture";
}

DwtMouseEventCapture.prototype.capturing =
function() {
	return DwtMouseEventCapture._capturing;
}

DwtMouseEventCapture.prototype.capture =
function() {

	if (window._mouseEventCaptureObj) {
		window._mouseEventCaptureObj.release();
	}

	if (document.body != null && document.body.addEventListener != null) {
		document.body.addEventListener("mouseover", this._mouseOverHdlr, true);
		document.body.addEventListener("mousedown", this._mouseDownHdlr, true);
		document.body.addEventListener("mousemove", this._mouseMoveHdlr, true);
		document.body.addEventListener("mouseup", this._mouseUpHdlr, true);
		document.body.addEventListener("mouseout", this._mouseOutHdlr, true);
		document.body.addEventListener("DOMMouseScroll", this._mouseWheelHdlr, true);
	} else {
		this._savedMouseOverHdlr = document.onmouseover;
		this._savedMouseDownHdlr = document.onmousedown;
		this._savedMouseMoveHdlr = document.onmousemove;
		this._savedMouseUpHdlr = document.onmouseup;
		this._savedMouseOutHdlr = document.onmouseout;
		this._savedMouseWheelHdlr = document.onmousewheel;
		document.onmouseover = this._mouseOverHdlr;
		document.onmousedown = this._mouseDownHdlr;
		document.onmousemove = this._mouseMoveHdlr;
		document.onmouseup = this._mouseUpHdlr;
		document.onmouseout = this._mouseOutHdlr;
		document.onmousewheel = this._mouseWheelHdlr;
	}
	window._mouseEventCaptureObj = this;
	DwtMouseEventCapture._capturing = true;
}


DwtMouseEventCapture.prototype.release = 
function() {

	if (window._mouseEventCaptureObj == null) { return; }

	var obj = window._shellCaptureObj;
	if (document.body && document.body.addEventListener) {
		document.body.removeEventListener("mouseover", this._mouseOverHdlr, true);
		document.body.removeEventListener("mousedown", this._mouseDownHdlr, true);
		document.body.removeEventListener("mousemove", this._mouseMoveHdlr, true);
		document.body.removeEventListener("mouseup", this._mouseUpHdlr, true);
		document.body.removeEventListener("mouseout", this._mouseOutHdlr, true);
		document.body.removeEventListener("DOMMouseScroll", this._mouseWheelHdlr, true);
	} else {
		document.onmouseover = this._savedMouseOverHdlr
		document.onmousedown = this._savedMouseDownHdlr;
		document.onmousemove = this._savedMouseMoveHdlr;
		document.onmouseup = this._savedMouseUpHdlr;
		document.onmouseout = this._savedMouseOutHdlr;
		document.onmousewheel = this._savedMouseWheelHdlr;
	}
	window._mouseEventCaptureObj = null;
	DwtMouseEventCapture._capturing = false;
}

DwtMouseEventCapture.emptyHdlr =
function(ev) {
	var capObj = DwtMouseEventCapture.getCaptureObj();
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);	
	if (capObj._hardCapture) {
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;	
	} else {
		mouseEv._stopPropagation = false;
		mouseEv._returnValue = true;
		mouseEv.setToDhtmlEvent(ev);
		return true;
	}	
}
}
if (AjxPackage.define("ajax.dwt.events.DwtEventManager")) {
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
 * static class that wraps around AjxEventManager
 * 
 * @private
 */
DwtEventManager = function() {
};

DwtEventManager._instance = new AjxEventMgr();

DwtEventManager._domEventToDwtMap = {
	'ondblclick': DwtEvent.ONDBLCLICK,
	'onmousedown': DwtEvent.ONMOUSEDOWN ,
	'onmouseup': DwtEvent.ONMOUSEUP,
	'onmousemove': DwtEvent.ONMOUSEMOVE,
	'onmouseout': DwtEvent.ONMOUSEOUT,
	'onmouseover': DwtEvent.ONMOUSEOVER,
	'onselectstart': DwtEvent.ONSELECTSTART,
	'onchange': DwtEvent.ONCHANGE
};

DwtEventManager.addListener = 
function(eventType, listener) {
	DwtEventManager._instance.addListener(eventType, listener);
};

DwtEventManager.notifyListeners = 
function(eventType, event) {
	DwtEventManager._instance.notifyListeners(eventType, event);
};

DwtEventManager.removeListener = 
function(eventType, listener) {
	DwtEventManager._instance.removeListener(eventType, listener);
};
}
if (AjxPackage.define("ajax.dwt.events.DwtHoverEvent")) {
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
 * 
 * @private
 */
DwtHoverEvent = function(type, delay, object, x, y) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.type = type;
	this.delay = delay;
	this.object = object;
	this.x = x || -1;
	this.y = y || -1;
}

DwtHoverEvent.prototype = new DwtEvent;
DwtHoverEvent.prototype.constructor = DwtHoverEvent;

DwtHoverEvent.prototype.toString = function() { return "DwtHoverEvent"; };

DwtHoverEvent.prototype.reset =
function() {
	this.type = 0;
	this.delay = 0;
	this.object = null;
	this.x = -1;
	this.y = -1;
};
}

if (AjxPackage.define("ajax.dwt.widgets.DwtControl")) {
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
 * This file contains a Dwt control.
 */

/**
 * Creates a control.
 * @class
 * This class is the root class of the Dwt component hierarchy. All
 * Dwt components either directly or indirectly inherit from this class.
 * <p>
 * A {@link DwtControl} may also be directly instantiated. In this case it is essentially
 * a div into which any content may be "drawn"
 * <p>
 * A control may be created in "deferred" mode, meaning that the UI portion of the control
 * will be created "Just In Time". This is useful for widgets which may want to defer construction
 * of elements (e.g. {@link DwtTreeItem}) until such time as is needed, in the interest of efficiency.
 * Note that if the control is a child of the shell, it won't become visible until its z-index is set.
 *
 * <h4>Events</h4><ul>
 * <li><i>DwtEvent.CONTROL</i></li>
 * <li><i>DwtEvent.DISPOSE</i></li>
 * <li><i>DwtEvent.HOVEROVER</i></li>
 * <li><i>DwtEvent.HOVEROUT</i></li>
 * <li><i>DwtEvent.ONCONTEXTMENU</i></li>
 * <li><i>DwtEvent.ONCLICK</i></li>
 * <li><i>DwtEvent.ONDBLCLICK</i></li>
 * <li><i>DwtEvent.ONFOCUS</i></li>
 * <li><i>DwtEvent.ONBLUR</i></li>
 * <li><i>DwtEvent.ONMOUSEDOWN</i></li>
 * <li><i>DwtEvent.ONMOUSEENTER</i></li>
 * <li><i>DwtEvent.ONMOUSELEAVE</i></li>
 * <li><i>DwtEvent.ONMOUSEMOVE</i></li>
 * <li><i>DwtEvent.ONMOUSEOUT</i></li>
 * <li><i>DwtEvent.ONMOUSEOVER</i></li>
 * <li><i>DwtEvent.ONMOUSEUP</i></li>
 * <li><i>DwtEvent.ONMOUSEWHEEL</i></li>
 * <li><i>DwtEvent.ONSELECTSTART</i></li>
 * </ul>
 *
 * @author Ross Dargahi
 * 
 * @param {hash}		params			a hash of parameters
 * @param	{DwtComposite}	parent		the parent widget, except in the case of {@link DwtShell}, the parent will be a control that is a subclass of {@link DwtComposite}
 * @param	{string}	className		the CSS class
 * @param	{constant}	posStyle		the positioning style (absolute, static, or relative). Defaults to {@link DwtControl.STATIC_STYLE}.
 * @param	{boolean}	deferred		if <code>true</code>, postpone initialization until needed
 * @param	{string}	id			    an explicit ID to use for the control's HTML element. If not provided, defaults to an auto-generated ID.
 * @param	{string|HTMLElement}	parentElement   the parent element
 * @param	{number}	index 		    the index at which to add this control among parent's children
 * @param   {boolean}   isFocusable     if false, this control does not take browser focus (its element will not have a tabindex); defaults to true
 * @param   {string}    role            ARIA role for this control
 *
 */
DwtControl = function(params) {

	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtControl.PARAMS);

	/**
	 * parent component. Read-Only
	 * 
	 * @private
	 */
	var parent = this.parent = params.parent;
	if (parent && !(parent.isDwtComposite)) {
		throw new DwtException("Parent must be a subclass of Composite", DwtException.INVALIDPARENT, "DwtControl");
	}

	/**
	 * the control's <i>DwtShell</i>
	 * @private
	 */
	this.shell = null;

	/**
	 * Data object used to store "client data" on the widget via the
	 * <code>setData</code> and <code>getData</code> methods
	 * 
	 * @type hash
	 * @private
	 */
	this._data = {};

	/**
	 * The event manager controls the mapping between event types and the registered listeners.
	 * @type AjxEventMgr
	 * @private
	 */
	this._eventMgr = new AjxEventMgr();

	/** true if the control is disposed, else false. The public api to this
	 * member is <code>isDisposed</code>.
	 * 
	 * @type boolean
	 * @private
	 */
	this._disposed = false;

	// set to true for an event type to override default behavior of swallowing the event
	this._propagateEvent = {};

	// don't swallow mouse wheel events; we often want to react to them, while
	// letting the browser continue to scroll
	this._propagateEvent[DwtEvent.ONMOUSEWHEEL] = true;

 	if (!parent) { return; }

	/** CSS class name
	 * @type string
	 * @private
	 */
	this._className = params.className || "DwtControl";

	/**
	 * @private
	 */
	this.__posStyle = params.posStyle;

	/**
	 * id of the control's HTML element
	 * @type string
	 * @private
	 */
	if (params.id) {
		this._htmlElId = params.id;
	}

	this.isFocusable = (params.isFocusable !== false);

	if (params.role != null) {
		this.role = params.role;
	}

	if (params.ariaLabel != null) {
		this.ariaLabel = params.ariaLabel;
	}

	if (params.ariaControls != null) {
		this.ariaControls = params.ariaControls;
	}

	/**
	 * @private
	 */
	this.__index = params.index;

	this.__parentElement = params.parentElement;

	/**
	 * enabled state of this control. Public APIs to this member are
	 * <code>getEnabled</code> and <code>setEnabled</code>.
	 * 
	 * @type boolean
	 * @private
	 */
	this._enabled = false;

	/**
	 * Indicates the drag state of the control. Valid values are:
	 * <ul>
	 * <li>DwtControl._NO_DRAG<li>
	 * <li>DwtControl._DRAGGING<li>
	 * <li>DwtControl._DRAG_REJECTED<li>
	 * </ul>
	 * 
	 * @type number
	 * @private
	 */
	this._dragging = null;

	/**
	 * Drag n drop icon. Valid when a drag and drop operation is occurring.
	 * 
	 * @type HTMLElement
	 * @private
	 */
	this._dndProxy = null;

	/**
	 * Flag indicating whether the control has keyboard focus or not.
	 * 
	 * @type boolean
	 * @private
	 */
	this._hasFocus = false;

	if (!params.deferred) {
		this.__initCtrl();
	}

	/**
	 * Hover over listener.
	 * 
	 * @type AjxListener
	 * @private
	 */
	this._hoverOverListener = new AjxListener(this, this.__handleHoverOver);

	/**
	 * Hover out listener.
	 * 
	 * @type AjxListener
	 * @private
	 */
	this._hoverOutListener = new AjxListener(this, this.__handleHoverOut);

	// turn this on to receive only the dblclick event (rather than click,
	// click, dblclick); penalty is that single click's timer must expire
	// before it is processed; useful if control has both single and double
	// click actions, and single click action is heavy
	this._dblClickIsolation = false;

	// set to true to ignore OVER and OUT mouse events between elements in the same control
	this._ignoreInternalOverOut = false;
	
	// override this control's default template
	this.TEMPLATE = params.template || this.TEMPLATE;
};

DwtControl.prototype.isDwtControl = true;
DwtControl.prototype.toString = function() { return "DwtControl"; };

DwtControl.prototype.isFocusable = null;

DwtControl.PARAMS = ["parent", "className", "posStyle", "deferred", "id", "index", "template"];

DwtControl.ALL_BY_ID = {};


//
// Constants
//

// Display states
/**
 * Defines the "normal" display state.
 */
DwtControl.NORMAL = "";
/**
 * Defines the "active" display state.
 */
DwtControl.ACTIVE = "ZActive";
/**
 * Defines the "focused" display state.
 */
DwtControl.FOCUSED = "ZFocused";
/**
 * Defines the "disabled" display state.
 */
DwtControl.DISABLED = "ZDisabled";
/**
 * Defines the "hover" display state.
 */
DwtControl.HOVER = "ZHover";
/**
 * Defines the "selected" display state.
 */
DwtControl.SELECTED = "ZSelected";
/**
 * Defines the "default" display state.
 */
DwtControl.DEFAULT = "ZDefault";
/**
 * Defines the "error" display state.
 */
DwtControl.ERROR = "ZError";

DwtControl._STATES = [
	DwtControl.ACTIVE,  DwtControl.FOCUSED,     DwtControl.DISABLED,
	DwtControl.HOVER,   DwtControl.SELECTED,    DwtControl.DEFAULT,
	DwtControl.ERROR
];

DwtControl._RE_STATES = new RegExp(
    "\\b(" + DwtControl._STATES.join("|") + ")\\b", "g"
);

DwtControl._RE_STATE = AjxUtil.arrayAsHash(
	DwtControl._STATES,
	function(state) {
		return new RegExp("\\b" + state + "\\b", "g");
	});

DwtControl._ARIA_STATES = {};
DwtControl._ARIA_STATES[DwtControl.DISABLED] = 'aria-disabled';
DwtControl._ARIA_STATES[DwtControl.SELECTED] = 'aria-selected';
DwtControl._ARIA_STATES[DwtControl.ERROR] = 'aria-invalid';

// Try to use browser tooltips (setting 'title' attribute) if possible
DwtControl.useBrowserTooltips = false;


/*
 * Position styles
 * 
 */

/**
 * Defines the static position style.
 * 
 * @see  Dwt.STATIC_STYLE
 */
DwtControl.STATIC_STYLE = Dwt.STATIC_STYLE;

/**
 * Defines the absolute position style.
 * 
 * @see Dwt.ABSOLUTE_STYLE
 */
DwtControl.ABSOLUTE_STYLE = Dwt.ABSOLUTE_STYLE;

/**
 * Defines the relative position style.
 * 
 * @see Dwt.RELATIVE_STYLE
 */
DwtControl.RELATIVE_STYLE = Dwt.RELATIVE_STYLE;

/**
 * Defines the fixed position style.
 * 
 * @see Dwt.FIXED_STYLE
 */
DwtControl.FIXED_STYLE = Dwt.FIXED_STYLE;


/*
 * 
 * Overflow style
 * 
 */

/**
 * 
 * Defines clip on overflow.
 * 
 * @see Dwt.CLIP
 */
DwtControl.CLIP = Dwt.CLIP;

/**
 * Defines allow overflow to be visible.
 * 
 * @see Dwt.VISIBLE
 */
DwtControl.VISIBLE = Dwt.VISIBLE;

/**
 * Defines automatically create scrollbars if content overflows.
 * 
 * @see Dwt.SCROLL
 */
DwtControl.SCROLL = Dwt.SCROLL;

/**
 * Defines always have scrollbars whether content overflows or not.
 * 
 * @see Dwt.FIXED_SCROLL
 */
DwtControl.FIXED_SCROLL = Dwt.FIXED_SCROLL;


// DnD states
/**
 * Defines "no drag" in progress.
 * 
 * @private
 */
DwtControl._NO_DRAG = "NO_DRAG";

/**
 * Defines "drag" in progress.
 *
 * @private
 */
DwtControl._DRAGGING = "DRAGGING";

/**
 * Defines "drag rejected".
 * 
 * @private
 */
DwtControl._DRAG_REJECTED = "DRAG_REJECTED";

/**
 * Defines "drag threshold".
 * 
 * @private
 */
DwtControl.__DRAG_THRESHOLD = 3;

/**
 * Defines "tooltip threshold".
 *
 * @private
 */
DwtControl.__TOOLTIP_THRESHOLD = 5;

/**
 * @private
 */
DwtControl.__DND_HOVER_DELAY = 750;

/**
 * @private
 */
DwtControl.__controlEvent = new DwtControlEvent();

/**
 * Applies only if control has turned on _doubleClickIsolation (see above)
 * want to hit sweet spot where value is more than actual dbl click speed,
 * but as low as possible since it also the length of single click pause.
 * 
 * @private
 */
DwtControl.__DBL_CLICK_TIMEOUT = 300;

//
// Data
//

/**
 * @private
 */
DwtControl.prototype._displayState = "";

//
// Public methods
//

/**
 * Adds a control event listener for control events. Control events are essentially
 * resize and coordinate change events.
 *
 * @param {AjxListener} listener		the listener to be registered (may not be <code>null</code>)
 *
 * @see DwtControlEvent
 * @see #removeControlListener
 * @see #removeAllListeners
 */
DwtControl.prototype.addControlListener =
function(listener) {
	this.addListener(DwtEvent.CONTROL, listener);
};

/**
 * Removes a control event listener for control events. Control events are essentially
 * resize and coordinate change events.
 *
 * @param {AjxListener} listener		the listener to remove
 *
 * @see DwtControlEvent
 * @see #addControlListener
 * @see #removeAllListeners
 */
DwtControl.prototype.removeControlListener =
function(listener) {
	this.removeListener(DwtEvent.CONTROL, listener);
};

/**
 * Registers a dispose listener for control events. Dispose events are fired when
 * a control is "destroyed" via the {@link #dispose} call.
 *
 * @param {AjxListener} listener		the listener to be registered (may not be <code>null</code>)
 *
 * @see DwtDisposeEvent
 * @see #removeDisposeListener
 * @see #removeAllListeners
 * @see #dispose
 * @see #isDisposed
 */
DwtControl.prototype.addDisposeListener =
function(listener) {
	this.addListener(DwtEvent.DISPOSE, listener);
};

/**
 * Removes a dispose event listener for control events. Dispose events are fired when
 * a control is "destroyed" via the {@link #dispose} method call.
 *
 * @param {AjxListener} listener		the listener to remove
 *
 * @see DwtDisposeEvent
 * @see #addDisposeListener
 * @see #removeAllListeners
 * @see #dispose
 * @see #isDisposed
 */
DwtControl.prototype.removeDisposeListener =
function(listener) {
	this.removeListener(DwtEvent.DISPOSE, listener);
};

/**
 * Adds a listener to the control. The listener will be call when events
 * of type <code>eventType</code> fire.
 *
 * @param {string} eventType		the event type for which to listen (may not be <code>null</code>)
 * @param {AjxListener} listener	the listener to register (may not be <code>null</code>)
 * @param {number}		index		the index at which to add listener
 *
 * @see DwtEvent
 * @see #removeListener
 * @see #removeAllListeners
 * @see #notifyListeners
 */
DwtControl.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

/**
 * Removes a listener from the control.
 *
 * @param {string} eventType		the event type for which to listen (may not be <code>null</code>)
 * @param {AjxListener} listener	the listener to remove (may not be <code>null</code>)
 *
 * @see DwtEvent
 * @see #addListener
 * @see #removeAllListeners
 */
DwtControl.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};

/**
 * Removes all listeners for a particular event type.
 *
 * @param {string} eventType		the event type (may not be <code>null</code>)
 * @return	{boolean}	<code>true</code> if all listeners are removed
 * 
 * @see DwtEvent
 * @see #addListener
 * @see #removeListener
 */
DwtControl.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

/**
 * Checks if there are any listeners registered for a particular event type.
 *
 * @param {string} eventType		the event type (may not be <code>null</code>)
 *
 * @return {boolean}	<code>true</code> if there is an listener registered for the specified event type
 * @see DwtEvent
 */
DwtControl.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

/**
 * Notifies all listeners of type <code>eventType</code> with <code>event</code>.
 *
 * @param {string} eventType		the event type (may not be <code>null</code>)
 * @param {DwtEvent} event		the event
 */
DwtControl.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

/**
 * Disposes of the control. This method will remove the control from under the
 * control of its parent and release any resources associate with the component
 * it will also notify any event listeners on registered {@link DwtEvent.DISPOSE} event type.
 *
 * <p>
 * Subclasses may override this method to perform their own dispose functionality but
 * should generally call up to the parent method.
 *
 * @see #isDisposed
 * @see #addDisposeListener
 * @see #removeDisposeListener
 */
DwtControl.prototype.dispose =
function() {
	if (this._disposed) { return; }

	if (this.parent && this.parent.isDwtComposite) {
		this.parent.removeChild(this);
	}
	this._elRef = null;
	
    DwtControl.ALL_BY_ID[this._htmlElId] = null;
    delete DwtControl.ALL_BY_ID[this._htmlElId];

	this._disposed = true;
	var ev = new DwtDisposeEvent();
	ev.dwtObj = this;
	this.notifyListeners(DwtEvent.DISPOSE, ev);
    this._eventMgr.clearAllEvents();
};

/**
 * This method is deprecated. Please use "document" directly.
 * @deprecated
 * @private
 */
DwtControl.prototype.getDocument =
function() {
	return document;
};

/**
 * Gets the tab group member for this control. Tab group members can
 * be a native HTML form element, a {@link DwtControl}, or a {@link DwtTabGroup} (for more
 * complex or explicit tab-ordering.
 * 
 * @return	{DwtControl}	by default, returns this object
 */
DwtControl.prototype.getTabGroupMember = function() {

    return this.tabGroupMember || this;
};

/**
 * Gets the data associated with the specified key.
 *
 * @param {string} key		the key
 * @return {Object}		the associated data
 * 
 * @see #setData
 */
DwtControl.prototype.getData =
function(key) {
	return this._data[key];
};

/**
 * Sets the data for a given key. This method is useful for associating client data with a control.
 *
 * @param {string} key		the key
 * @param {Object} value	the data
 * 
 * @see #getData
 */
DwtControl.prototype.setData =
function(key, value) {
  this._data[key] = value;
};

/**
 * Checks if the control is disposed.
 * 
 * @return {boolean}	<code>true</code> if the control is in a disposed state; <code>false</code> otherwise
 *
 * @see #dispose
 * @see #addDisposeListener
 * @see #removeDisposeListener
 */
DwtControl.prototype.isDisposed =
function() {
	return this._disposed;
};

/**
 * Checks if the control is initialized. In general, a control will not be
 * initialized if it has been created in deferred mode and has not yet been initialized.
 * 
 * @return {boolean}	<code>true</code> if the control is in a initialized; <code>false</code> otherwise
 */
DwtControl.prototype.isInitialized =
function() {
	return this.__ctrlInited;
};

/**
 * Sets browser and keyboard focus to this control.
 *
 *  @return  {DwtControl|Element}   control or element that actually got focused
 */
DwtControl.prototype.focus = function() {

    DBG.println(AjxDebug.FOCUS, "DwtControl FOCUS: " + [this, this._htmlElId].join(' / '));
    if (!this._checkState()) {
        return;
    }

    var el = this.getFocusElement();
    if (el && el.focus) {
        AjxTimedAction.scheduleAction(this._focusAction);

        // retain the scroll position if the user scrolled, since setting focus will cause browser to scroll this control into view
        var scrollContainer = this.getScrollContainer(),
            scrollTop = scrollContainer && scrollContainer.scrollTop;

        el.focus();

        if (scrollTop > 0) {
            DBG.println(AjxDebug.DBG1, "Resetting scroll after focus to: " + scrollTop);
            scrollContainer.scrollTop = scrollTop;
        }
    }

    return this;
};

/**
 * Takes browser and keyboard focus away from this control.
 *
 *  @return   {DwtControl|Element}  control or element that actually got blurred
 */
DwtControl.prototype.blur = function() {

    DBG.println(AjxDebug.FOCUS, "DwtControl BLUR: " + [this, this._htmlElId].join(' / '));
    if (!this._checkState()) {
        return;
    }
    var el = this.getFocusElement();
    if (el && el.blur) {
        AjxTimedAction.scheduleAction(this._blurAction);
        el.blur();
    }

    return this;
};

/**
 * Checks if this control has focus.
 * 
 * @return {boolean}	<code>true</code> if this control has keyboard focus; <code>false</code> otherwise
 */
DwtControl.prototype.hasFocus =
function() {
	return this._hasFocus;
};

/**
 * Handles key actions and is called by the keyboard navigation framework. Subclasses
 * should override this method to provide behavior for supported key actions.
 * 
 * @param	{DwtKeyMap}	actionCode	the key action code
 * @param	{DwtKeyEvent}	ev		the key event
 * @return	{boolean}	<code>true</code> if the event is handled; <code>false</code> otherwise
 * 
 * @private
 *
 */
DwtControl.prototype.handleKeyAction =
function(actionCode, ev) {
	return false;
};

/**
 * Re-parents the control within the component hierarchy. Unlike <i>reparentHtmlElement</i>
 * which re-parents the controls <i>div</i> within the DOM hierarchy, this method re-parents
 * the whole control.
 *
 * @param {DwtComposite} newParent 	the control's new parent
 * @param	{number}	index	the index
 * 
 * @see #reparentHtmlElement
 */
DwtControl.prototype.reparent =
function(newParent, index) {
	if (!this._checkState()) { return; }

	var htmlEl = this.getHtmlElement();
	this.parent.removeChild(this, true);
	DwtComposite._pendingElements[this._htmlElId] = htmlEl;
	newParent.addChild(this, index);
	this.parent = newParent;
	// TODO do we need a reparent event?
};

/**
 * Re-parents the HTML element of the control to the html element supplied as the
 * parameter to this method. Note this method only re-parents the control's <i>div</i>
 * element and does not affect the component hierarchy. To re-parent the control within
 * the component hierarchy, use the <i>reparent</i> method.
 *
 * @param {string|HTMLElement} htmlEl a string representing an element ID or an HTML element
 * @param {number} position 	the position to insert the element
 *
 * @see #reparent
 */
DwtControl.prototype.reparentHtmlElement =
function(htmlEl, position) {

	// If htmlEl is a string, then it is an ID so lookup the html element that
	// has the corresponding ID
	if (typeof htmlEl == "string") {
		htmlEl = document.getElementById(htmlEl);
	}
	if (!htmlEl) { return; }

	var el = this.getHtmlElement();
	if (position == null) {
		htmlEl.appendChild(el);
	} else if (typeof position == "object") {
		htmlEl.insertBefore(el, position);
	} else {
		if (htmlEl.childNodes[position]) {
			htmlEl.insertBefore(el, htmlEl.childNodes[position]);
		} else {
			htmlEl.appendChild(el);
		}
	}
};

/**
 * Sets the event handling function for a given event type. This method
 * should be used judiciously as it can lead to unexpected results (for example if
 * overriding the control's mouse handlers). This method calls through to <i>Dwt.setHandler</i>
 *
 * @param {string} eventType 	the event type (defined in {@see DwtEvent}) to override 
 * @param {function} hdlrFunc Event handler function
 *
 * @see DwtEvent
 */
DwtControl.prototype.setHandler =
function(eventType, hdlrFunc) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	Dwt.setHandler(htmlElement, eventType, hdlrFunc);
};

/**
 * Clears the event handling function for a given event type. This method
 * should be used judiciously as it can lead to unexpected results (for example if
 * overriding the control's mouse handlers)
 *
 * @param {string} eventType 	the event type (defined in {@see DwtEvent}) to override 
 *
 * @see DwtEvent
 */
DwtControl.prototype.clearHandler =
function(eventType) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	Dwt.clearHandler(htmlElement, eventType);
};

/**
 * Set the default behavior for whether an event will propagate (bubble up).
 * 
 * @param {boolean}		propagate		if true, event will propagate
 * @param {array}		events			one or more events
 */
DwtControl.prototype.setEventPropagation =
function(propagate, events) {
	events = AjxUtil.toArray(events);
	for (var i = 0; i < events.length; i++) {
		this._propagateEvent[events[i]] = propagate;
	}
};

/**
 * Gets the bounds of the component. Bounds includes the location (not relevant for
 * statically position elements) and dimensions of the control (i.e. the <code>&lt;div&gt;</code> element).
 *
 * @return {DwtRectangle}		the control bounds
 *
 * @see DwtRectangle
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getBounds =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getBounds(this.getHtmlElement());
};

/**
 * Gets the inset bounds of the component. Similar to the bounds, but excluding borders and paddings.
 *
 * @return {DwtRectangle}		the control inset bounds
 *
 * @see DwtRectangle
 * @see #getBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getInsetBounds =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getInsetBounds(this.getHtmlElement());
};

/**
 * Gets the insets of the component, i.e. the width of borders and paddings.
 *
 * @return {DwtRectangle}		the control insets
 *
 * @see DwtRectangle
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getMargins
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getInsets =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getInsets(this.getHtmlElement());
};

/**
 * Gets the margins of the component.
 *
 * @return {DwtRectangle}		the control margins
 *
 * @see DwtRectangle
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getMargins =
function() {
	if (!this._checkState()) {
		return;
	}

	return Dwt.getMargins(this.getHtmlElement());
};

/**
 * Sets the bounds of a control. The position type of the control must
 * be absolute or else an exception is thrown. To omit setting a value set the
 * actual parameter value to <i>Dwt.DEFAULT</i>
 *
 * @param {number|string} x		the x coordinate of the element (for example: 10, "10px", Dwt.DEFAULT)
 * @param {number|string} y		the y coordinate of the element (for example: 10, "10px", Dwt.DEFAULT)
 * @param {number|string} width	the width of the element (for example: 100, "100px", "75%", Dwt.DEFAULT)
 * @param {number|string} height	the height of the element (for example: 100, "100px", "75%", Dwt.DEFAULT)
 *
 * @return {DwtControl}		this control
 *
 * @see DwtRectangle
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #setSize
 * @see #setLocation
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 */
DwtControl.prototype.setBounds =
function(x, y, width, height) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		this.__controlEvent.reset(DwtControlEvent.RESIZE | DwtControlEvent.MOVE);
		var bds = Dwt.getBounds(htmlElement);
		this.__controlEvent.oldX = bds.x;
		this.__controlEvent.oldY = bds.y;
		this.__controlEvent.oldWidth = bds.width;
		this.__controlEvent.oldHeight = bds.height;
        //TODO: notifyListeners() called atleast 3 times. Should minimize the calls.
		this.setLocation(x, y);
		this.setSize(width, height);
		bds = Dwt.getBounds(htmlElement);
		this.__controlEvent.newX = bds.x;
		this.__controlEvent.newY = bds.y;
		this.__controlEvent.newWidth = (AjxUtil.isNumber(width)) ? width : bds.width; //if it's exact number, no need to use the bounds, especially since they are not accurate, wrong in about 2 pixels at least in the case I'm testing.
		this.__controlEvent.newHeight = (AjxUtil.isNumber(height)) ? height : bds.height;
		this.__controlEvent.requestedWidth = width;
		this.__controlEvent.requestedHeight = height;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		this.setLocation(x, y);
		this.setSize(width, height);
	}

	return this;
}

/**
 * Gets the class name of this control. The class name may be set
 * when constructing the control. If it is not passed into the constructor, it
 * defaults to the control's class name. The class name is generally used as the
 * CSS class name for the control, although control's that change visual behaviour
 * based on state may append (or even use different) class names. See the documentation
 * of the specific component for details.
 *
 * @return {string}		the control class name
 *
 * @see #setClassName
 */
DwtControl.prototype.getClassName =
function() {
	return this._className;
};

/**
 * Sets the control class name. This also automatically sets the control CSS
 * class name (i.e. the control htmlElement class name). Subclasses of <i>DwtControl</i>
 * may override this method to perform a different behavior.
 *
 * @param {string} className		the new class name for the control
 *
 * @see #getClassName
 */
DwtControl.prototype.setClassName =
function(className) {
	if (!this._checkState()) { return; }

	this._className = className;
    var el = this.getHtmlElement();
    el.className = className;
    Dwt.addClass(el, this._displayState);
};

/**
 * Adds a class name to this control HTML element.
 *
 * @param {string} className		the class name to add
 */
DwtControl.prototype.addClassName =
function(className) {
	Dwt.addClass(this.getHtmlElement(), className);
};

/**
 * Removes a class name from this control's HTML element. Optionally adds a new class name, if specified.
 *
 * @param {string} delClass		the class to remove
 * @param {string} addClass		the class to add (may be <code>null</code>)
 */
DwtControl.prototype.delClassName =
function(delClass, addClass) {
	Dwt.delClass(this.getHtmlElement(), delClass, addClass);
};

/**
 * Conditionally adds or removes a class name to this control HTML element.
 * The class names are used exclusively, that is: when condition is true,
 * <code>classWhenTrue</code> is added and <code>classWhenFalse</code> is removed (if present and
 * specified).  When condition is false, <code>classWhenTrue</code> is removed and
 * <code>classWhenFalse</code> is added (again, if present and specified).
 *
 * @param {string} condition	the condition
 * @param {string} classWhenTrue	the class name to add when condition is <code>true</code>
 * @param {string} classWhenFalse	the class name to add when contition is <code>false</code> (may be <code>null</code>)
 */
DwtControl.prototype.condClassName = function(condition, classWhenTrue, classWhenFalse) {
	Dwt.condClass(this.getHtmlElement(), condition, classWhenTrue, classWhenFalse);
};

/**
 * Sets the display state.
 * 
 * @param	{Object}		state		the state
 */
DwtControl.prototype.setDisplayState =
function(state) {
    if (!this._enabled) {
		state = DwtControl.DISABLED;
	}

    if (arguments.length > 1) {
        var a = [];
        for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
        }
        state = a.join(" ").trim();
    }

    if (this._displayState == state) {
        return;
    }

	var oldState = this._displayState;

    this._displayState = state;
    Dwt.delClass(this.getHtmlElement(), DwtControl._RE_STATES, state);

    // Set Aria states.
    var ariaStateKeys = Object.keys(DwtControl._ARIA_STATES);
    var attribute = DwtControl._ARIA_STATES[state];

    // Add/remove aria states only if given state is blank or given state is present in _ARIA_STATES
    // state will be blank when user navigate to other app. e.g. User is on Mail and navigate to Calendar then state='' for Mail app object.
    if (attribute || (state === '' && ariaStateKeys.indexOf(oldState.trim()) != -1)) {
        for (var i = 0; i < ariaStateKeys.length; i++) {
            var ariaStateValue = DwtControl._ARIA_STATES[ariaStateKeys[i]];
            if (attribute === ariaStateValue) {
                this.setAttribute(ariaStateValue, true);
            } else {
                if (ariaStateValue == 'aria-selected' && this.role == 'tab') {
                    this.setAttribute(ariaStateValue, false); // Setting aria-selected='false' for `tab` element to prevent SR to announce as selected on travesing it.
                } else {
                    this.removeAttribute(ariaStateValue);
                }
            }
        }
    }

	if (this.isListenerRegistered(DwtEvent.STATE_CHANGE)) {
		this.__controlEvent.reset(DwtControlEvent.STATE);
		this.__controlEvent.oldState = oldState;
		this.__controlEvent.newState = state;
		this.__controlEvent.dwtObj = this;
		this.notifyListeners(DwtEvent.STATE_CHANGE, this.__controlEvent);
	}
};

/**
* Shows an alert in the control. For example, to indicate that a new message has arrived.
*
* @param	{string}	alert		the alert
*/
DwtControl.prototype.showAlert =
function(alert) {
	if (alert && !this._alert) {
		this.delClassName(null, "ZAlert");
	} else if (!alert && this._alert) {
		this.delClassName("ZAlert", null);
	}
	this._alert = alert;
};

/**
* Checks if the control is showing an alert.
* 
* @return	{boolean}	<code>true</code> if showing an altert; <code>false</code> otherwise
*/
DwtControl.prototype.isAlertShown =
function() {
	return this._alert;
};

/**
 * @private
 */
DwtControl.prototype._createHtmlFromTemplate =
function(templateId, data) {
    // set html content
    this.getHtmlElement().innerHTML = AjxTemplate.expand(templateId, data);

    // set container class name, if needed
    var params = AjxTemplate.getParams(templateId);
    var className = params && params["class"];
    if (className) {
        className = [ this._className, className ].join(" ");
        this.setClassName(className);
    }
};

/**
 * Gets the control cursor.
 * 
 * @return {string}		the control cursor
 *
 * @see #setCursor
 */
DwtControl.prototype.getCursor =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getCursor(this.getHtmlElement());
};

/**
 * Sets the control cursor.
 *
 * @param {string} cursorName		the name of the new cursor
 *
 * @see #getCursor
 */
DwtControl.prototype.setCursor =
function(cursorName) {
	if (!this._checkState()) { return; }

	Dwt.setCursor(this.getHtmlElement(), cursorName);
};

/**
 * Gets the control drag source.
 * 
 * @return {DwtDragSource}		the control drag source or <code>null</code> for none
 *
 * @see #setDragSource
 */
DwtControl.prototype.getDragSource =
function() {
	return this._dragSource;
};

/**
 * Set the control drag source. The drag source binds the drag-and-drop system with
 * an application. Setting a control drag source makes the control "draggable".
 *
 * @param {DwtDragSource} dragSource		the control drag source
 *
 * @see #getDragSource
 */
DwtControl.prototype.setDragSource =
function(dragSource) {
	this._dragSource = dragSource;
	if (dragSource && !this._ctrlCaptureObj) {
		this.__initCapture();
		this._dndHoverAction = new AjxTimedAction(null, this.__dndDoHover);
	}
};

/**
 * Gets the control drop target.
 * 
 * @return	{DwtDropTarget}		the control drop target or <code>null</code> for none
 *
 * @see #setDropTarget
 */
DwtControl.prototype.getDropTarget =
function() {
	return this._dropTarget;
};

/**
 * Sets the drop target for the control. The drop target binds the drag-and-drop system with
 * an application. Setting a control drop target makes the control a potential drop
 * target within an application.
 *
 * @param {DwtDropTarget} dropTarget		the control drop target
 *
 * @see #getDropTarget
 */
DwtControl.prototype.setDropTarget =
function(dropTarget) {
	this._dropTarget = dropTarget;
};

/**
 * Gets the control drag box.
 *
 * @return {DwtDragBox}		the control drag box or <code>null</code> for none
 *
 * @see #setDragBox
 */
DwtControl.prototype.getDragBox =
function() {
	return this._dragBox;
};

/**
 * Set the control drag box. The drag box handles the display of a dotted rectangle
 * that is typically used to select items.
 *
 * @param {DwtDragBox} dragBox		the control drag box
 *
 * @see #getDragBox
 */
DwtControl.prototype.setDragBox =
function(dragBox) {
	this._dragBox = dragBox;
	if (dragBox && !this._ctrlCaptureObj) {
		this.__initCapture();
	}
};

DwtControl.prototype.__initCapture =
function(dragBox) {
	this._ctrlCaptureObj = new DwtMouseEventCapture({
		targetObj:		this,
		id:				"DwtControl",
		mouseOverHdlr:	DwtControl.__mouseOverHdlr,
		mouseDownHdlr:	DwtControl.__mouseDownHdlr,
		mouseMoveHdlr:	DwtControl.__mouseMoveHdlr,
		mouseUpHdlr:	DwtControl.__mouseUpHdlr,
		mouseOutHdlr:	DwtControl.__mouseOutHdlr
	});
};

/**
 * Gets the enabled state.
 * 
 * @return {boolean}		<code>true</code> if the control is enabled; <code>false</code> otherwise
 *
 * @see #setEnabled
 */
DwtControl.prototype.getEnabled =
function() {
	if (!this._checkState()) { return; }

	return this._enabled;
};

/**
 * Sets the control enabled state. If <code>setHtmlElement</code> is true, then
 * this method will also set the control HTML element disabled attribute.
 *
 * @param {boolean} enabled		<code>true</code> if the control is enabled
 * @param {boolean} setHtmlElement	<code>true</code> to set the control HTML element disabled attribute
 */
DwtControl.prototype.setEnabled =
function(enabled, setHtmlElement) {
	if (!this._checkState()) { return; }

	if (enabled != this._enabled) {
		this._enabled = enabled;
        this.setDisplayState(enabled ? DwtControl.NORMAL : DwtControl.DISABLED);
        if (setHtmlElement)
			this.getHtmlElement().disabled = !enabled;
	}
};

/**
 * Gets the ID of the control containing HTML element.
 *
 * @return {string} 	the ID of the control containing HTML element
 */
DwtControl.prototype.getHTMLElId =
function () {
	return this._htmlElId;
};

/**
 * Gets the control containing HTML element. By default this is a <code>div</code> element
 *
 * @return {HTMLElement}		the control containing HTML element
 */
DwtControl.prototype.getHtmlElement =
function() {
	if (!this._checkState()) { return; }

	var htmlEl = this._elRef || document.getElementById(this._htmlElId);
	if (htmlEl == null) {
		htmlEl = DwtComposite._pendingElements[this._htmlElId];
	} else if (!htmlEl._rendered) {
		delete DwtComposite._pendingElements[this._htmlElId];
		htmlEl._rendered = true;
	}
	return this._elRef = htmlEl;
};

/**
 * Returns the element that should get browser focus when this control is focused.
 *
 * @returns {HTMLElement}
 */
DwtControl.prototype.getFocusElement = function() {

    return this.isFocusable ? this._focusElement : null;
};

/**
 * Sets the "focus element" if this control is focusable. Adds focus/blur event handlers and a tabIndex to the focus element.
 * If no element is provided, defaults to the control's input element or its container (DIV).
 *
 * @param {HTMLElement} el      (optional) new focus element
 */
DwtControl.prototype.setFocusElement = function(el) {

    if (!this.isFocusable) {
        return;
    }

    var hadFocus = (document.activeElement === this._focusElement),
        focusEl = el || (this.getInputElement && this.getInputElement()) || this.getHtmlElement();

    if (this._focusElement && this._focusElement !== focusEl) {
        this._makeFocusable(this._focusElement, false);
    }

    this._focusElement = focusEl;

    if (focusEl) {
        this._makeFocusable(this._focusElement, true);
        if (hadFocus) {
            focusEl.focus();
        }
    }
};

/**
 * Returns the control associated with the given element, if any.
 * 
 * @param {Element}		htmlEl	an HTML element
 * @return	{DwtControl}		the control element or <code>null</code> for none
 */
DwtControl.fromElement = function(htmlEl)  {

	return DwtControl.ALL_BY_ID[htmlEl.id];
};

/**
 * Returns the control associated with the given element ID, if any.
 * 
 * @param {string}		htmlElId	an HTML element Id
 * @return	{DwtControl}		the control element or <code>null</code> for none
 */
DwtControl.fromElementId = function(htmlElId)  {

	return DwtControl.ALL_BY_ID[htmlElId];
};

/**
 * Finds a control and starts the search at the given element and works
 * up the element chain until it finds one with an ID that maps to a {@link DwtControl}.
 * 
 * @param {Element}		htmlEl	an HTML element
 * @return	{DwtControl}	the control or <code>null</code> for none
 */
DwtControl.findControl =
function(htmlEl)  {

	// FF 3.5 throws protection error if we dereference a chrome element, so bail
	if (AjxEnv.isFirefox3_5up && !AjxEnv.isFirefox3_6up) {
		var s = HTMLElement.prototype.toString.call(htmlEl);
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]') { return null; }
	}

	try{
		while (htmlEl) {
			if (htmlEl.id && DwtControl.ALL_BY_ID[htmlEl.id]) {
				return DwtControl.ALL_BY_ID[htmlEl.id];
			}
			htmlEl = htmlEl.parentNode;
		}
	} catch(e) {
		//In some FF, we might get permission denied error. Ignore it.
	}
	return null;
};

/**
 * Returns the control associated with the given event. Starts with the
 * event target and works its way up the element chain until it finds one
 * with an ID that maps to a {@link DwtControl}.
 * 
 * @param {Event}		ev				the DHTML event
 * @param {boolean}		useRelatedTarget	if <code>true</code>, use element that was related to this event
 * @return {DwtControl}	the control or <code>null</code> for none
 */
DwtControl.getTargetControl =
function(ev, useRelatedTarget)  {
	var htmlEl = DwtUiEvent.getTarget(ev, useRelatedTarget);
	return htmlEl ? DwtControl.findControl(htmlEl) : null;
};

/**
 * Sets the control HTML element id attribute.
 *
 * @param {string} id 		the new element Id
 */
DwtControl.prototype.setHtmlElementId =
function(id) {
	if (this._disposed) { return; }

	if (this.__ctrlInited) {
		var htmlEl = this.getHtmlElement();
		if (!htmlEl._rendered) {
			delete DwtComposite._pendingElements[this._htmlElId];
			DwtComposite._pendingElements[id] = htmlEl;
		}
		else {
			delete DwtControl.ALL_BY_ID[this._htmlElId];
			DwtControl.ALL_BY_ID[id] = this;
		}
		htmlEl.id = id;
	}
	this._htmlElId = id;
};

/**
 * Gets the X coordinate of the control (if absolutely positioned).
 * 
 * @return {number}		the X coordinate of the control 
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getX =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement()).x;
};

/**
 * Gets the horizontal extent of the control (if absolutely positioned).
 * 
 * @return {number} 	the horizontal extent of the control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getXW =
function() {
	if (!this._checkState()) { return; }

    var bounds = this.getBounds();
	return bounds.x+bounds.width;
};

/**
 * Gets the Y coordinate of the control (if it is absolutely positioned).
 * 
 * @return {number}		the Y coordinate of the control 
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getY =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement()).y;
};

/**
 * Gets the vertical extent of the control (if it is absolutely positioned).
 * 
 * @return {number}		the vertical extent of the control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getYH =
function() {
	if (!this._checkState()) { return; }

    var bounds = this.getBounds();
	return bounds.y+bounds.height;
};

/**
 * Returns the positioning style
 */
DwtControl.prototype.getPosition =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getPosition(this.getHtmlElement());
};

/**
 * Sets the positioning style
 * 
 * @param 	{constant}	posStyle	positioning style (Dwt.*_STYLE)
 */
DwtControl.prototype.setPosition =
function(posStyle) {
	if (!this._checkState()) { return; }

	return Dwt.setPosition(this.getHtmlElement(), posStyle);
};

/**
 * Gets the location of the control.
 *
 * @return {DwtPoint}		the location of the control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #setLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see Dwt
 */
DwtControl.prototype.getLocation =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement());
};

/**
 * Sets the location of the control. The position style of the control must
 * be absolute or else an exception is thrown. To only set one of the coordinates,
 * pass in a value of <i>Dwt.DEFAULT</i> for the coordinate for which the value is
 * not to be set. Any <i>DwtEvent.CONTROL</i> listeners registered on the control
 * will be called.
 *
 * @param {number|string} x	the x coordinate of the element (for example: 10, "10px", Dwt.DEFAULT)
 * @param {number|string} y	the y coordinate of the element (for example: 10, "10px", Dwt.DEFAULT)
 *
 * @return {DwtControl}		this control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see Dwt
 */
DwtControl.prototype.setLocation =
function(x, y) {
	if (!this._checkState()) { return; }

	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this.__controlEvent.reset(DwtControlEvent.MOVE);
		var loc = Dwt.getLocation(htmlElement);
		this.__controlEvent.oldX = loc.x;
		this.__controlEvent.oldY = loc.y;
		Dwt.setLocation(htmlElement, x, y);
		loc = Dwt.getLocation(htmlElement);
		this.__controlEvent.newX = loc.x;
		this.__controlEvent.newY = loc.y;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		Dwt.setLocation(this.getHtmlElement(), x, y);
	}
	return this;
};

/**
 * Gets the control scroll style. The scroll style determines the control
 * behavior when content overflows its div's boundaries. Possible values are:
 * <ul>
 * <li>{@link Dwt.CLIP} - Clip on overflow</li>
 * <li>{@link Dwt.VISIBLE} - Allow overflow to be visible</li>
 * <li>{@link Dwt.SCROLL} - Automatically create scrollbars if content overflows</li>
 * <li>{@link Dwt.FIXED_SCROLL} - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @return {number}		the control scroll style
 */
DwtControl.prototype.getScrollStyle =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getScrollStyle(this.getHtmlElement());
};

/**
 * Sets the control scroll style. The scroll style determines the control's
 * behavior when content overflows its div's boundaries. Possible values are:
 * <ul>
 * <li>{@link Dwt.CLIP} - Clip on overflow</li>
 * <li>{@link Dwt.VISIBLE} - Allow overflow to be visible</li>
 * <li>{@link Dwt.SCROLL} - Automatically create scrollbars if content overflows</li>
 * <li>{@link Dwt.FIXED_SCROLL} - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {int} scrollStyle		the control new scroll style
 */
DwtControl.prototype.setScrollStyle =
function(scrollStyle) {
	if (!this._checkState()) { return; }

	Dwt.setScrollStyle(this.getHtmlElement(), scrollStyle);
};

/**
 * Returns the element that this control scrolls within.
 *
 * @returns {HTMLElement}
 */
DwtControl.prototype.getScrollContainer = function() {

    return this.parent && this.parent.getHtmlElement();
};

/**
 * Sets the control position. The position determines the control's
 * location within the context of which it was created. Possible values are:
 * <ul>
 * <li>{@link DwtControl.STATIC_STYLE} - Allow browser to control content flow</li>
 * <li>{@link DwtControl.ABSOLUTE_STYLE} - Allow content to be positioned relative to parent or body</li>
 * <li>{@link DwtControl.RELATIVE_STYLE} - Allow browser to control content flow but relative to parent</li>
 * </ul>
 *
 * @param {number} position		the control new position
 */
DwtControl.prototype.setPosition =
function(position) {
	if (!this._checkState()) { return; }

	if (position == DwtControl.STATIC_STYLE ||
		position == DwtControl.ABSOLUTE_STYLE ||
		position == DwtControl.RELATIVE_STYLE)
	{
		this.__posStyle = position;
		Dwt.setPosition(this.getHtmlElement(), position);
	}
};

/**
 * Gets the width of the control.
 * 
 * @return	{number}		the width of the control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getW =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement()).x;
};

/**
 * Gets the height of the control.
 * 
 * @return {number}	the height of the control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #getLocation
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setLocation
 * @see #setSize
 */
DwtControl.prototype.getH =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement()).y;
};

/**
 * Gets the size of the control. The x value of the returned point is the width
 * and the y is the height.
 * 
 * @return {DwtPoint}		the control size
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getSize =
function(getFromStyle) {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement(), null, getFromStyle);
};

/**
 * Gets the outer size -- that is, the size including margins, padding, and borders -- of an
 * HTML element.
 *
 * @return {DwtPoint}	the elements size, margins, padding, and borders included
 */
DwtControl.prototype.getOuterSize =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getOuterSize(this.getHtmlElement(), null);
};

/**
 * Sets the size of the control
 *
 * @param {number|string} width	the width of the control (for example: 100, "100px", "75%", Dwt.DEFAULT)
 * @param {number|string} height	the height of the control (for example: 100, "100px", "75%", Dwt.DEFAULT)
 *
 * @return {DwtControl}	this control
 *
 * @see #getBounds
 * @see #getInsetBounds
 * @see #getInsets
 * @see #getSize
 * @see #setLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 */
DwtControl.prototype.setSize =
function(width, height) {
	if (!this._checkState()) { return; }

	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this.__controlEvent.reset(DwtControlEvent.RESIZE);
		var sz = Dwt.getSize(htmlElement);
		this.__controlEvent.oldWidth = sz.x;
		this.__controlEvent.oldHeight = sz.y;
		Dwt.setSize(htmlElement, width, height);
		sz = Dwt.getSize(htmlElement);
		this.__controlEvent.newWidth = sz.x;
		this.__controlEvent.newHeight = sz.y;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		Dwt.setSize(this.getHtmlElement(), width, height);
	}
	return this;
};

/**
 * Gets the tooltip content (typically set using {@link #setToolTipContent}). Controls
 * that want to return dynamic tooltip content should override this method.
 *
 * @param {DwtEvent}	ev	the mouseover event
 * @return {string}		the tooltip content set for the control
 */
DwtControl.prototype.getToolTipContent =
function(ev) {
	if (this._disposed) { return null; }

	return this.__toolTipContent;
};

/**
 * Sets tooltip content for the control. The toolTip passed in may be plain text,
 * HTML or an object containing a callback function.
 * If DwtControl.useBrowserTooltips is set to true, and the tooltip does not have
 * HTML, returns, or tabs, use a browser tooltip by setting the 'title' attribute
 * on the element.
 *
 * @param {string/object} 	toolTip		the tooltip content
 */
DwtControl.prototype.setToolTipContent =
function(toolTip, useBrowser) {
	if (this._disposed) { return; }
	if (toolTip && (typeof(toolTip) == "string")  && DwtControl.useBrowserTooltips) {
		// browser tooltip can't have return, tab, or HTML
		if (!toolTip || (!toolTip.match(/[\n\r\t]/) && !toolTip.match(/<[a-zA-Z]+/))) {
			var el = this.getHtmlElement();
			if (el) {
				el.title = toolTip;
				this._browserToolTip = true;
				return;
			}
		}
	}

	this._browserToolTip = false;
	this.__toolTipContent = toolTip;
};

/**
 * Gets the visible state of the control. For example, the control HTML elements display style attribute is not "none".
 * 
 * @return {boolean}	if <code>true</code>, the control is visible
 *
 * @see Dwt#getVisibile
 */
DwtControl.prototype.getVisible =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getVisible(this.getHtmlElement());
};

/**
 * Sets the the visible state of the control HTML element. <i>Note: Gets style
 * "display: none", don't confuse with {@link setVisibility}).</i>
 *
 * @param {boolean} visible 	if <code>true</code>, the control should be displayed; if <code>false</code>, the control should not be displayed
 *
 * @see Dwt#setVisible
 */
DwtControl.prototype.setVisible =
function(visible) {
	if (!this._checkState()) { return; }

	Dwt.setVisible(this.getHtmlElement(), visible);
};

/**
 * Sets the visibility of the control HTML element.
 *
 * @param {boolean} visible		if <code>true</code> then the control is visible
 *
 * @see Dwt#setVisibility
 */
DwtControl.prototype.setVisibility =
function(visible) {
	if (!this._checkState()) { return; }

	Dwt.setVisibility(this.getHtmlElement(), visible);
};

/**
 * Gets the visibility of the control HTML element.
 * 
 * @return {boolean}	if <code>true</code>, the control is visible (i.e. the HTML elements visibility play style attribute is not "hidden")
 *
 * @see Dwt#getVisibility
 */
DwtControl.prototype.getVisibility =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getVisibility(this.getHtmlElement());
};


/**
 * Gets the control z-index value.
 *
 * @param {boolean} getFromStyle    get the value from the style attribute of
 *                                  the control element, or a parent
 *
 * @return	{number}	the z-index value
 */
DwtControl.prototype.getZIndex =
function(getFromStyle) {
	if (!this._checkState()) { return; }

	return Dwt.getZIndex(this.getHtmlElement(), getFromStyle);
};

/**
 * Sets the z-index for the control HTML element. Since z-index is only relevant among peer
 * elements, we make sure that all elements that are being displayed via z-index hang off the
 * main shell.
 *
 * @param {number} idx		the new z-index for this element
 */
DwtControl.prototype.setZIndex =
function(idx) {
	if (!this._checkState()) { return; }

	Dwt.setZIndex(this.getHtmlElement(), idx);
};

/**
 * Convenience function to toggle visibility using z-index. It uses the two lowest level
 * z-indexes ({@link Dwt.Z_VIEW} and {@link Dwt.Z_HIDDEN} respectively). Any further
 * stacking will have to use {@link #setZIndex} directly.
 *
 * @param {boolean} show		if <code>true</code>, show the element; <code>false</code> to hide the element
 *
 * @see #setZIndex
 */
DwtControl.prototype.zShow =
function(show) {
	this.setZIndex(show ? Dwt.Z_VIEW : Dwt.Z_HIDDEN);
};

/**
 * Sets the display.
 * 
 * @param	{string}	value		the display value
 */
DwtControl.prototype.setDisplay =
function(value) {
	if (!this._checkState()) { return; }

	Dwt.setDisplay(this.getHtmlElement(), value);
};

/**
 * Sets the opacity of the control HTML element.
 *
 * @param {Number} opacity		opacity, as a percentage between 0 and 100
 *
 * @see Dwt#setOpacity
 */
DwtControl.prototype.setOpacity =
function(opacity) {
	if (!this._checkState()) { return; }

	Dwt.setOpacity(this.getHtmlElement(), opacity);
};

/**
 * Gets the opacity of the control HTML element.
 *
 * @return {Number}	opacity, as a percentage between 0 and 100
 *
 * @see Dwt#getOpacity
 */
DwtControl.prototype.getOpacity =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getOpacity(this.getHtmlElement());
};

/**
 * Prevents selection on the specified element.
 *
 * @param	{Element}	targetEl	the element
 */
DwtControl.prototype.preventSelection =
function(targetEl) {
	return !this.__isInputEl(targetEl);
};

/**
 * Prevents a context menu on the specified element.
 * 
 * @param	{Element}	targetEl	the element
 */
DwtControl.prototype.preventContextMenu =
function(targetEl) {
	return targetEl ? (!this.__isInputEl(targetEl)) : true;
};

/**
 * Returns the content of the control HTML element.
 * 
 * @return {string}		HTML content
 */
DwtControl.prototype.getContent =
function() {
	return this.getHtmlElement().innerHTML;
};

/**
 * Sets the content of the control HTML element to the provided
 * content. Care should be taken when using this method as it can blow away all
 * the content of the control which can be particularly bad if the control is
 * a <i>DwtComposite</i> with children. Generally this method should be used
 * controls which are being directly instantiated and used as a canvas
 *
 * @param {string} content		the HTML content
 */
DwtControl.prototype.setContent =
function(content) {
	if (content) {
		this.getHtmlElement().innerHTML = content;
	}
};

/**
 * Clears the content of the control HTML element.
 * Care should be taken when using this method as it can blow away all
 * the content of the control which can be particularly bad if the control is
 * a {@link DwtComposite} with children. Generally this method should be used
 * controls which are being directly instantiated and used as a canvas.
 */
DwtControl.prototype.clearContent =
function() {
	this.getHtmlElement().innerHTML = "";
};

/**
 * Appends this control element to the specified element.
 *
 * @param {Element|string}	elemOrId  the DOM element or an element id
 */
DwtControl.prototype.appendElement =
function(elemOrId) {
    var el = AjxUtil.isString(elemOrId) ? document.getElementById(elemOrId) : elemOrId;
    if (el) {
        el.appendChild(this.getHtmlElement(), el);
    }
};

/**
 * Replaces the specified element with this control element.
 *
 * @param {Element|string}	elemOrId  the DOM element or an element id
 */
DwtControl.prototype.replaceElement =
function(elemOrId, inheritClass, inheritStyle) {
    var oel = AjxUtil.isString(elemOrId) ? document.getElementById(elemOrId) : elemOrId;
    if (oel) {
        var nel = this.getHtmlElement();
        oel.parentNode.replaceChild(nel, oel);
        this._replaceElementHook(oel, nel, inheritClass, inheritStyle);
    }
};

/**
 * This method is a hook for sub-classes that want to intercept the
 * inheriting of class and style when an element is replaced. By
 * default, the new will will inherit the class and style. In order
 * to prevent this behavior, you must pass in a <code>true</code>
 * or <code>false</code> value.
 * 
 * @private
 */
DwtControl.prototype._replaceElementHook =
function(oel, nel, inheritClass, inheritStyle) {
    if ((inheritClass == null || inheritClass) && oel.className) {
        Dwt.addClass(nel, oel.className);
    }
    if (inheritStyle == null || inheritStyle) {
        var style = oel.getAttribute("style") || oel.style;
        if (style) {
            if (AjxUtil.isString(style)) { // All non-IE browsers
                nel.setAttribute("style", [nel.getAttribute("style"),style].join(";"));
            } else if (AjxUtil.isString(style.cssText)) {
				if (style.cssText) {
					nel.setAttribute("style", [nel.getAttribute("style"),style.cssText].join(";"));
				}
			} else {
				for (var attribute in style) {
					if (style[attribute]) {
						try {
							nel.style[attribute] = style[attribute];
						} catch (e) {}
					}
				}
			}
        }
    }
};

/**
 * This protected method is called by the keyboard navigate infrastructure when a control
 * gains focus. This method should be overridden by derived classes to provide
 * the visual behavior for the component losing focus
 *
 * @see #_focus
 * @see #_focusByMouseUpEvent
 * @see #focus
 * 
 * @private
 */
DwtControl.prototype._blur =
function() {
};

/**
 * This protected method should be overridden by derived classes to provide
 * behavior for the component gaining focus e.g. providing a border or
 * highlighting etc...
 *
 * @see #_blur
 * @see #_focusByMouseUpEvent
 * @see #focus
 * 
 * @private
 */
DwtControl.prototype._focus =
function() {
};

/**
 * This protected method is called from mouseUpHdl. Subclasses may override this method
 * if they have their own specialized focus management code.
 *
 * @see #_blur
 * @see #_focus
 * @see #focus
 * 
 * @private
 */
DwtControl.prototype._focusByMouseUpEvent =
function(ev)  {
    DBG.println(AjxDebug.FOCUS, "DwtControl FOCUSONMOUSEUP: " + [this, this._htmlElId].join(' / '));
 	if (this.getEnabled()) {
        this.shell.getKeyboardMgr().grabFocus(this);
    }
};

/**
 * This is for bug 11827.
 * 
 * TODO: we should remove _focusByMouseUpEvent and update all classes
 * that define it to use _focusByMouseDownEvent instead.
 * 
 * @private
 */
DwtControl.prototype._focusByMouseDownEvent =
function(ev) {
    DBG.println(AjxDebug.FOCUS, "DwtControl FOCUSONMOUSEDOWN: " + [this, this._htmlElId].join(' / '));
	this._duringFocusByMouseDown = true;
	this._focusByMouseUpEvent(ev);
	this._duringFocusByMouseDown = false;
};

/**
 * Returns the type of drag operation we are performing.
 *
 * @param mouseEv
 */
DwtControl.prototype._getDragOp =
function(mouseEv) {
	return mouseEv.ctrlKey ? Dwt.DND_DROP_COPY : Dwt.DND_DROP_MOVE;
};

/**
 * Subclasses may override this protected method to return an HTML element that will represent
 * the dragging icon. The icon must be created on the DwtShell widget. This means that the
 * icon must be a child of the shells HTML component If this method returns
 * null, it indicates that the drag failed. This method is called when a control is
 * being dragged and it has a valid drag source
 *
 * @return {HTMLElement}	the DnD dragging icon. This is typically a div element
 *
 * @see #_setDragProxyState
 * @see #_destroyDragProxy
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 * 
 * @private
 */
DwtControl.prototype._getDragProxy =
function(dragOp) {
	DBG.println(AjxDebug.DBG2, "DwtControl.prototype._getDragProxy");
	return null;
};

DwtControl.prototype.getDragSelectionBox =
function(dragOp) {

	if (!this._dragSelectionBox) {
		var box = this._dragSelectionBox = document.createElement("div");
		box.className = "dndSelectionBox";
		Dwt.setPosition(box, Dwt.ABSOLUTE_STYLE);
		this.shell.getHtmlElement().appendChild(box);
		Dwt.setZIndex(box, Dwt.Z_DND);
	}
	return this._dragSelectionBox;
};

/**
 * Subclasses may override this method to set the DnD icon properties based on whether drops are
 * allowed. The default implementation sets the class on the HTML element obtained
 * from <code>_getDragProxy</code> to DwtCssStyle.DROPPABLE if <code>dropAllowed</code> is true and
 * to DwtCssStyle.NOT_DROPPABLE if false
 *
 * @param {boolean} dropAllowed		if <code>true</code>, then dropping is allowed on the drop zone so set
 * 		DnD icon to the visually reflect this
 *
 * @see #_getDragProxy
 * @see #_destroyDragProxy
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 * 
 * @private
 */
DwtControl.prototype._setDragProxyState =
function(dropAllowed) {
	if (this._dndProxy) {
		Dwt.condClass(this._dndProxy, dropAllowed, DwtCssStyle.DROPPABLE, DwtCssStyle.NOT_DROPPABLE);
	}
};


/**
 * @private
 */
DwtControl.__junkIconId = 0;

/**
 * Subclasses may override this method to destroy the DnD icon HTML element
 *
 * @see #_getDragProxy
 * @see #_setDragProxyState
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 * 
 * @private
 */
DwtControl.prototype._destroyDragProxy =
function(icon) {
	if (icon) {
		// not sure why there is no parent node, but if there isn't one,
		// let's try and do our best to get rid of the icon
		if (icon.parentNode) {
			icon.parentNode.removeChild(icon);
		} else {
			// at least hide the icon, and change the id so we can't get it back later
			icon.style.zIndex = -100;
			icon.id = "DwtJunkIcon" + DwtControl.__junkIconId++;
			icon = null;
		}
	}
};

DwtControl.prototype.destroyDragSelectionBox =
function() {

	var box = this._dragSelectionBox;
	if (box && box.parentNode) {
		box.parentNode.removeChild(box);
	}
	this._dragSelectionBox = null;
};

/**
 * Subclasses may override this method to provide feedback as to whether a possibly
 * valid capture is taking place. For example, there are instances such as when a mouse
 * down happens on a scroll bar in a DwtListView that are reported in the context of
 * the DwtListView, but which are not really a valid mouse down i.e. on a list item. In
 * such cases this function would return false.
 *
 * @return {boolean}	<code>true</code> if the object is a valid drag object
 *
 * @see #_getDragProxy
 * @see #_setDragProxyState
 * @see #_destroyDragProxy
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 * 
 * @private
 */
 DwtControl.prototype._isValidDragObject =
 function(ev) {
 	return true;
 };

/**
 * _dragHover is called multiple times as the user hovers over
 * the control. _dragLeave is called when the drag operation exits the control.
 * _drop is called when the item is dropped on the target.
 */

 /**
  * This protected method is called when a drag operation enters a control. Subclasses
  * supporting drop targets should implement this method to visual indicate that they are a
  * drop target. This could be by changing the background etc. Note that it is the
  * responsibility of the drag source (the control being dragged) to change its icon state
  * to reflect whether the drop target is valid for the drag source
  *
  * @param {DwtMouseEvent} ev	the mouse event that is associated with the drag operation
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragOver
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  * 
  * @private
  */
DwtControl.prototype._dragEnter =
function(ev) {
};

 /**
  * This protected method is called multiple times as a dragged control crosses over this control
  * Subclasses supporting drop targets may implement this method for additional visual
  * indication, such as indicating "landing zones" in the control for drop operations
  *
  * @param {DwtMouseEvent} ev	the mouse event that is associated with the drag operation
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  * @private
  */
DwtControl.prototype._dragOver =
function(ev) {
};

 /**
  * This protected method is called every 750ms as an item hovers over this control
  * Subclasses supporting drop targets may implement this method for additional visual
  * indication or actions, such as expanding a collapsed tree node if the user hovers
  * over the node for a period of time.
  *
  * @param {DwtMouseEvent} ev	the mouse event that is associated with the drag operation
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  * @private
  */
DwtControl.prototype._dragHover =
function(ev) {
};

 /**
  * This protected method is called when the drag operation exits the control
  * Subclasses supporting drop targets should implement this method to reset the
  * visual to the default (i.e. reset the actions performed as part of the
  * <code>_dragEnter</code> method.
  *
  * @param {DwtMouseEvent} ev	the mouse event that is associated with the drag operation
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  * @private
  */
DwtControl.prototype._dragLeave =
function(ev) {
};


/**
  * This protected method is called when the a drop occurs on the control
  * Subclasses supporting drop targets may implement this method to provide a
  * visual indication that the drop succeeded (e.g. an animation such as flashing
  * the drop target).
  *
  * @param {DwtMouseEvent} ev	the mouse event that is associated with the drag operation
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  * @private
  */
DwtControl.prototype._drop =
function(ev) {
};

/**
  * Makes an element focusable or unfocusable by the browser. It manages the "tabIndex" attribute,
  * and sets or unsets the element's onfocus and onblur handlers.
  *
  * @param {HTMLElement}    element	    element to make (not) focusable
  * @param {boolean}        focusable   if true (default), make element focusable by the browser
  *
  * @private
  */
DwtControl.prototype._makeFocusable = function(element, focusable) {

    focusable = (focusable !== false);
    DBG.println(AjxDebug.FOCUS, "MAKE " + (focusable ? '' : 'NOT ') + "FOCUSABLE: " + this + ', ' + (element || ''));

    this._setEventHdlrs([ DwtEvent.ONFOCUS, DwtEvent.ONBLUR ], true, element);
    if (focusable) {
        this._setEventHdlrs([ DwtEvent.ONFOCUS, DwtEvent.ONBLUR ], false, element);
        element.tabIndex = 0;
    }
    else {
        element.removeAttribute('tabIndex');
    }
};

/**
 * This convenience methods sets or clears the control's event handler for key
 * press events as defined by {@link DwtEvent.ONKEYPRESS}.
 *
 * @param {boolean} clear	if <code>true</code>, clear the keypress events handler
 * @param {HTMLElement} element	if specified, assign event handlers to this element (optional)
 *
 * @private
 */
DwtControl.prototype._setKeyPressEventHdlr =
function(clear, element) {
	this._setEventHdlrs([DwtEvent.ONKEYPRESS], clear, element);
};

/**
 * This convenience methods sets or clears the control's event handlers for mouse
 * events as defined by <i>DwtEvent.MOUSE_EVENTS</i>
 *
 * @param {boolean} clear	if <code>true</code>, clear the mouse events handlers
 * @param {HTMLElement} element	if specified, assign event handlers to this element (optional)
 *
 * @private
 */
DwtControl.prototype._setMouseEventHdlrs =
function(clear, element) {
	this._setEventHdlrs(DwtEvent.MOUSE_EVENTS, clear, element);
};

/**
 * This convenience methods sets or clears the control's event handlers for keyboard
 * events as defined by <i>DwtEvent.KEY_EVENTS</i>
 *
 * @param {boolean} clear	if <code>true</code>, clear the mouse events handlers
 * @param {HTMLElement} element	if specified, assign event handlers to this element (optional)
 *
 * @private
 */
DwtControl.prototype._setKeyEventHdlrs =
function(clear, element) {
	this._setEventHdlrs(DwtEvent.KEY_EVENTS, clear, element);
};

/**
 * This protected method will set or clear the event handlers for the provided array
 * of events.
 *
 * @param {array} events		an array of events for which to set or clear the
 * 		control's event handlers. The set of events supported by the control are:
 * 		<ul>
 * 		<li><i>DwtEvent.ONCONTEXTMENU</i></li>
 * 		<li><i>DwtEvent.ONCLICK</i></li>
 * 		<li><i>DwtEvent.ONDBLCLICK</i></li>
 * 		<li><i>DwtEvent.ONMOUSEDOWN</i></li>
 * 		<li><i>DwtEvent.ONMOUSEENTER</i></li>
 * 		<li><i>DwtEvent.ONMOUSELEAVE</i></li>
 * 		<li><i>DwtEvent.ONMOUSEMOVE</i></li>
 * 		<li><i>DwtEvent.ONMOUSEOUT</i></li>
 * 		<li><i>DwtEvent.ONMOUSEOVER</i></li>
 * 		<li><i>DwtEvent.ONMOUSEUP</i></li>
 * 		<li><i>DwtEvent.ONMOUSEWHEEL</i></li>
 * 		<li><i>DwtEvent.ONSELECTSTART</i></li>
 * 		<li><i>DwtEvent.ONKEYPRESS</i></li>
 * 		</ul>
 * @param {boolean} clear	if <code>true</code>, the event handlers are cleared for the set of events
 * @param {HTMLElement} element	if specified, assign event handlers to this element (optional)
 *
 * @see Dwt#setHandler
 * @see Dwt#clearHandler
 * @private
 */
DwtControl.prototype._setEventHdlrs =
function(events, clear, element) {
	if (!this._checkState()) { return; }

	var htmlElement = element || this.getHtmlElement();
	for (var i = 0; i < events.length; i++) {
		if (clear !== true) {
			Dwt.setHandler(htmlElement, events[i], DwtControl.__HANDLER[events[i]]);
		} else {
			Dwt.clearHandler(htmlElement, events[i]);
		}
	}
};

/**
 * @private
 */
DwtControl.prototype._setMouseEvents =
function() {
	// add custom mouse handlers to standard ones
	var mouseEvents = [DwtEvent.ONCONTEXTMENU, DwtEvent.ONCLICK, DwtEvent.ONDBLCLICK, DwtEvent.ONMOUSEDOWN,
					   DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP, DwtEvent.ONSELECTSTART];
	if (AjxEnv.isIE) {
		mouseEvents.push(DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE);
	} else {
		mouseEvents.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
	}
	this._setEventHdlrs(mouseEvents);
};

/**
 * Populates a fake mouse event in preparation for the direct call of a listener (rather
 * than via an event handler).
 * 
 * @param {DwtMouseEvent}	mev		the mouse event
 * @param {hash}	params		the hash of event properties
 * 
 * @see DwtUiEvent.copy
 * @private
 */
DwtControl.prototype._setMouseEvent =
function(mev, params) {
	mev.reset();
	params.ersatz = true;
	DwtUiEvent.copy(mev, params);
	mev.button = params.button;
};

/**
 * TODO
 * @private
 */
DwtControl.prototype._getStopPropagationValForMouseEv =
function(ev) {
	// overload me for dealing w/ browsers w/ weird quirks
	return true;
};

/**
 * TODO
 * @private
 */
DwtControl.prototype._getEventReturnValForMouseEv =
function(ev) {
	// overload me for dealing w/ browsers w/ weird quirks
	return false;
};


/**
 * Check the state of the control, if it is not disposed and is not initialized, then
 * as a side-effect it will initialize it (meaning it will create the HTML element
 * for the control and insert it into the DOM. This is pertinent for controls that
 * were created <i>deferred</i> (see the constructor documentation)
 *
 * @return {boolean}	<code>true</code> if the control is not disposed; <code>false</code> otherwise
 * @private
 */
DwtControl.prototype._checkState =
function() {
	if (this._disposed) { return false; }
	if (!this.__ctrlInited) {
		this.__initCtrl();
	}
	return true;
};

/**
 * Positions this control at the given point. If no location is provided, centers it
 * within the shell.
 *
 * @param {DwtPoint}	loc		the point at which to position this control
 * @private
 */
DwtControl.prototype._position =
function(loc) {
	this._checkState();

	var sizeShell = this.shell.getSize();
	var sizeThis = this.getSize();
	var x, y;

	if (sizeThis) {
		if (!loc) {
			// if no location, go for the middle
			x = Math.round((sizeShell.x - sizeThis.x) / 2);
			y = Math.round((sizeShell.y - sizeThis.y) / 2);
		} else {
			x = loc.x;
			y = loc.y;
		}
		// try to stay within shell boundaries
		if ((x + sizeThis.x) > sizeShell.x) {
			x = sizeShell.x - sizeThis.x;
		}
		if ((y + sizeThis.y) > sizeShell.y) {
			y = sizeShell.y - sizeThis.y;
		}
		this.setLocation(x, y);
	}
};

/**
 * Handles scrolling of a drop area for an object being dragged. The scrolling is based on proximity to
 * the top or bottom edge of the area (only vertical scrolling is done). The scrolling is done via a
 * looping timer, so that the scrolling is smooth and does not depend on additional mouse movement.
 *
 * @param {hash}	params		a hash of parameters
 * @param {Element}      params.container		the DOM element that may need to be scrolled
 * @param {number}      params.threshold		if mouse is within this many pixels of top or bottom of container,
 * 										check if scrolling is needed
 * @param {number}      params.amount		the number of pixels to scroll at each interval
 * @param {number}      params.interval		the number of milliseconds to wait before continuing to scroll
 * @param {string}      params.id			the ID for determining if we have moved out of container
 * @param {DwtEvent}	ev		the event
 * 
 * @private
 */
DwtControl._dndScrollCallback =
function(params, ev) {

	var container = params.container;
	if (!container) { return; }

	// stop scrolling if mouse has moved out of the scrolling area, or dnd object has been released;
	// a bit tricky because this callback is run as the mouse moves among objects within the scroll area,
	// so we need to see if mouse has moved from within to outside of scroll area
	var dwtObjId = ev.dwtObj && ev.dwtObj._dndScrollId;
	if (ev.type == "mouseup" || !dwtObjId || (params.id && dwtObjId != params.id)) {
		if (container._dndScrollActionId != -1) {
			AjxTimedAction.cancelAction(container._dndScrollActionId);
			container._dndScrollActionId = -1;
		}
		return;
	}

	container._scrollAmt = 0;
	if (container.clientHeight < container.scrollHeight) {
		var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y;
		var realTop = containerTop + container.scrollTop;
		var scroll = container.scrollTop;
		var diff = ev.docY - realTop; // do we need to scroll up?
		// account for horizontal scrollbar
		var threshold = (container.clientWidth < container.scrollWidth) ? params.threshold + Dwt.SCROLLBAR_WIDTH :
																		  params.threshold;
		var scrollAmt = (diff <= threshold) ? -1 * params.amount : 0;
		if (scrollAmt == 0) {
			var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
			var containerBottom = realTop + containerH;
			diff = containerBottom - ev.docY; // do we need to scroll down?
			scrollAmt = (diff <= threshold) ? params.amount : 0;
		}
		container._scrollAmt = scrollAmt;
		if (scrollAmt) {
			if (!container._dndScrollAction) {
				container._dndScrollAction = new AjxTimedAction(null, DwtControl._dndScroll, [params]);
				container._dndScrollActionId = -1;
			}
			// launch scrolling loop
			if (container._dndScrollActionId == -1) {
				container._dndScrollActionId = AjxTimedAction.scheduleAction(container._dndScrollAction, 0);
			}
		} else {
			// stop scrolling
			if (container._dndScrollActionId != -1) {
				AjxTimedAction.cancelAction(container._dndScrollActionId);
				container._dndScrollActionId = -1;
			}
		}
	}
};

/**
 * @private
 */
DwtControl._dndScroll =
function(params) {
	var container = params.container;
	var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y;
	var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
	var scroll = container.scrollTop;
	// if we are to scroll, make sure there is more scrolling to be done
	if ((container._scrollAmt < 0 && scroll > 0) || (container._scrollAmt > 0 && (scroll + containerH < container.scrollHeight))) {
		container.scrollTop += container._scrollAmt;
		container._dndScrollActionId = AjxTimedAction.scheduleAction(container._dndScrollAction, params.interval);
	}
};

/**
 * @private
 */
DwtControl.__keyPressHdlr =
function(ev) {
	var obj = obj ? obj : DwtControl.getTargetControl(ev);
	if (!obj) return false;

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
		obj.__tooltipClosed = false;
	}
};


/**
 * @private
 */
DwtControl.__keyUpHdlr = function(ev) {

	return DwtKeyboardMgr.__keyUpHdlr.apply(this, arguments);
};

/**
 * @private
 */
DwtControl.__keyDownHdlr = function(ev) {

	return DwtKeyboardMgr.__keyDownHdlr.apply(this, arguments);
};

/**
 * @private
 */
DwtControl.__focusHdlr = function(ev, evType, obj) {

	obj = obj || DwtControl.getTargetControl(ev);
	if (!obj) {
        return false;
    }

    obj._cancelFocusBlurActions();

    return obj.__doFocus(ev);
};

/**
 * @private
 */
DwtControl.__blurHdlr = function(ev, evType, obj) {

    obj = obj || DwtControl.getTargetControl(ev);
    if (!obj) {
        return false;
    }

    obj._cancelFocusBlurActions();

	return obj.__doBlur(ev);
};

DwtControl.prototype._cancelFocusBlurActions = function() {

    if (this._focusAction._id !== -1) {
        AjxTimedAction.cancelAction(this._focusAction._id);
    }
    if (this._blurAction._id !== -1) {
        AjxTimedAction.cancelAction(this._blurAction._id);
    }
};

/**
 * Returns true if the control has static tooltip content, or if it has overridden
 * getToolTipContent() to return dynamic content. Essentially, it means that this
 * control provides tooltips and will need to use the hover mgr.
 *
 * @private
 */
DwtControl.prototype.__hasToolTipContent =
function() {
	if (this._disposed) { return false; }
	return Boolean(!this._browserToolTip && (this.__toolTipContent || (this.getToolTipContent != DwtControl.prototype.getToolTipContent)));
};

/**
 * This control has gotten focus, so do some housekeeping: tell the keyboard mgr, notify listeners, and update our UI and state.
 * @private
 */
DwtControl.prototype.__doFocus = function(ev) {

    DBG.println(AjxDebug.FOCUS, "DwtControl.__doFocus for " + this.toString() + ", id: " + this._htmlElId);

    if (!this._checkState()) {
        return false;
    }

    this._hasFocus = true;

    this.shell.getKeyboardMgr().updateFocus(this, ev);

    if (this.isListenerRegistered(DwtEvent.ONFOCUS)) {
        ev = ev || DwtShell.focusEvent;
        ev.dwtObj = this;
        ev.state = DwtFocusEvent.FOCUS;
        this.notifyListeners(DwtEvent.ONFOCUS, ev);
    }

    this._focus();

    return true;
};

/**
 * This control has lost focus, so do some housekeeping: notify listeners, and update our UI and state.
 * @private
 */
DwtControl.prototype.__doBlur = function(ev) {

	DBG.println(AjxDebug.FOCUS, "DwtControl.__doBlur for " + this.toString() + ", id: " + this._htmlElId);

    if (!this._checkState()) {
        return false;
    }

	this._hasFocus = false;
	if (this.isListenerRegistered(DwtEvent.ONBLUR)) {
        ev = ev || DwtShell.focusEvent;
		ev.dwtObj = this;
		ev.state = DwtFocusEvent.BLUR;
		this.notifyListeners(DwtEvent.ONBLUR, ev);
	}

	this._blur();

    return true;
};

/**
 * @private
 */
DwtControl.__clickHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	if (obj && obj._clickPending) {
		return;
	}

	if (obj.hasAttribute('aria-haspopup')) {
		obj.setAttribute('aria-expanded', !(obj.getAttribute('aria-expanded') === 'true'));
	}

	try {

	return DwtControl.__mouseEvent(ev, DwtEvent.ONCLICK);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__dblClickHdlr =
function(ev) {

	try {

	var obj = DwtControl.getTargetControl(ev);
	if (obj && obj._dblClickIsolation) {
		obj._clickPending = false;
		AjxTimedAction.cancelAction(obj._dblClickActionId);
	}
	return DwtControl.__mouseEvent(ev, DwtEvent.ONDBLCLICK);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseOverHdlr =
function(ev, evType) {

	try {

	// Check to see if a drag is occurring. If so, don't process the mouse
	// over events.
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	if (captureObj != null) {
		ev = DwtUiEvent.getEvent(ev);
		ev._stopPropagation = true;
		return false;
	}
	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }
	evType = evType || DwtEvent.ONMOUSEOVER;
	if ((evType == DwtEvent.ONMOUSEOVER) && obj._ignoreInternalOverOut) {
		var otherObj = DwtControl.getTargetControl(ev, true);
		if (obj == otherObj) {
			return false;
		}
	}

	var mouseEv = DwtShell.mouseEvent;
	if (obj._dragging == DwtControl._NO_DRAG) {
		mouseEv.setFromDhtmlEvent(ev, obj);
		mouseEv.hoverStarted = false;	// don't handle hover if it has already begun
		if (obj.isListenerRegistered(evType)) {
			obj.notifyListeners(evType, mouseEv);
		}
		// Call the tooltip after the listeners to give them a
		// chance to change the tooltip text.
		if (obj.__hasToolTipContent(mouseEv) && !mouseEv.hoverStarted) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if ((!manager.isHovering() || manager.getHoverObject() != obj) && !DwtMenu.menuShowing()) {
				manager.reset();
				manager.setHoverObject(obj);
				manager.setHoverOverData(mouseEv);
				manager.setHoverOverDelay(DwtToolTip.TOOLTIP_DELAY);
				manager.setHoverOverListener(obj._hoverOverListener);
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			}
		}
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseEnterHdlr =
function(ev) {
	return DwtControl.__mouseOverHdlr(ev, DwtEvent.ONMOUSEENTER);
};

/**
 * @private
 */
DwtControl.__mouseDownHdlr =
function(ev) {

	try {

	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	ev = DwtUiEvent.getEvent(ev);
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, obj);
	if (mouseEv.button == DwtMouseEvent.LEFT) {
		obj._focusByMouseDownEvent(ev);
		// reset our event - above call can set type to "blur" (at least in FF)
		mouseEv.setFromDhtmlEvent(ev, obj);
	}

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
	}

	// If we have a dragSource, then we need to start capturing mouse events
	if (obj._dragSource && (mouseEv.button == DwtMouseEvent.LEFT) && obj._isValidDragObject(mouseEv))	{
		try {
			obj._ctrlCaptureObj.capture();
		} catch (ex) {
			DBG.dumpObj(ex);
		}
		obj._dragOp = obj._getDragOp(mouseEv);
		obj.__dragStartX = mouseEv.docX;
		obj.__dragStartY = mouseEv.docY;
	}
	else if (obj._dragBox) {
		// We do mouse capture for drag boxes mostly because the mouseup can come from anywhere, and we
		// want to handle it, usually by destroying the box.
		if (obj._dragBox._setStart(mouseEv, obj)) {
			try {
				obj._ctrlCaptureObj.capture();
			} catch (ex) {
				DBG.dumpObj(ex);
			}
		}
	}

	return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEDOWN, obj, mouseEv);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseMoveHdlr =
function(ev) {

	try {

	// Find the target control. If we're doing capture (DnD), we get it from the capture object.
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = captureObj ? captureObj.targetObj : DwtControl.getTargetControl(ev);
 	if (!obj) { return false; }

	// DnD hover cancel point
	if (obj.__dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj.__dndHoverActionId);
		obj.__dndHoverActionId = -1;
	}

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, captureObj ? true : obj);

	// This following can happen during a DnD operation if the mouse moves
	// out the window. This seems to happen on IE only.
	if (mouseEv.docX < 0 || mouseEv.docY < 0) {
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}

	// If we are not draggable or if we have not started dragging and are
	// within the Drag threshold then handle it as a move.
	var doingDnD = (obj._dragSource && captureObj &&
			(Math.abs(obj.__dragStartX - mouseEv.docX) >= DwtControl.__DRAG_THRESHOLD ||
			 Math.abs(obj.__dragStartY - mouseEv.docY) >= DwtControl.__DRAG_THRESHOLD));
	var doingDragBox = (captureObj && obj._dragBox && obj._dragBox._dragObj == obj);

	if (!doingDnD && !doingDragBox) {
		if (obj.__hasToolTipContent()) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if (!obj.__tooltipClosed && !DwtMenu.menuShowing()) {
				// NOTE: mouseOver already init'd other hover settings
				// We do hoverOver() here since the mouse may have moved during
				// the delay, and we want to use latest x,y
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			} else {
				var deltaX = obj.__lastTooltipX ? Math.abs(mouseEv.docX - obj.__lastTooltipX) : null;
				var deltaY = obj.__lastTooltipY ? Math.abs(mouseEv.docY - obj.__lastTooltipY) : null;
				if ((deltaX != null && deltaX > DwtControl.__TOOLTIP_THRESHOLD) ||
					(deltaY != null && deltaY > DwtControl.__TOOLTIP_THRESHOLD)) {
					manager.setHoverOutListener(obj._hoverOutListener);
					manager.hoverOut();
					obj.__tooltipClosed = true; // prevent tooltip popup during moves in this object
				}
			}
		}
		return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
	} else {
		// If we are not dragging, try to begin a drag operation, which may be either DnD or drawing a box.
		if (obj._dragging == DwtControl._NO_DRAG) {
			if (obj._dragSource) {
				obj._dragOp = obj._dragSource._beginDrag(obj._dragOp, obj);
				if (obj._dragOp != Dwt.DND_DROP_NONE) {
					obj._dragging = DwtControl._DRAGGING;
					obj._dndProxy = obj._getDragProxy(obj._dragOp);
					Dwt.addClass(obj._dndProxy, "DwtDragProxy");
					if (!obj._dndProxy) {
						obj._dragging = DwtControl._DRAG_REJECTED;
					}
				} else {
					obj._dragging = DwtControl._DRAG_REJECTED;
				}
			}
			else if (obj._dragBox) {
				obj._dragging = DwtControl._DRAGGING;
				obj._dragBox._beginDrag(obj);
			}
		}

		if (obj._dragging != DwtControl._DRAG_REJECTED) {
			var targetObj = mouseEv.dwtObj;
			if (obj._dragSource) {
				var dropTarget = targetObj && targetObj._dropTarget;
				var lastTargetObj = obj.__lastTargetObj;
				if (targetObj) {
					// Set up the drag hover event. we will even let this item hover over itself as there may be
					// scenarios where that will hold true
					obj._dndHoverAction.args = [ targetObj ];
					obj.__dndHoverActionId = AjxTimedAction.scheduleAction(obj._dndHoverAction, DwtControl.__DND_HOVER_DELAY);
				}

				// See if the target will allow us to be dropped on it. We have to be an allowable type, and the
				// target's drop listener may perform additional checks. The DnD icon will typically turn green or
				// red to indicate whether a drop is allowed.
				if (targetObj && dropTarget && ((targetObj != obj) || dropTarget.hasMultipleTargets())) {
					if (targetObj != lastTargetObj || dropTarget.hasMultipleTargets()) {
						var data = obj._dragSource._getData();
						if (dropTarget._dragEnter(obj._dragOp, targetObj, data, mouseEv, obj._dndProxy)) {
							obj._setDragProxyState(true);
							obj.__dropAllowed = true;
							targetObj._dragEnter(mouseEv);
						} else {
							obj._setDragProxyState(false);
							obj.__dropAllowed = false;
						}
					} else if (obj.__dropAllowed) {
						targetObj._dragOver(mouseEv);
					}
				} else {
					obj._setDragProxyState(false);
				}

				// Tell the previous target that we're no longer being dragged over it.
				if (lastTargetObj && lastTargetObj != targetObj && lastTargetObj._dropTarget && lastTargetObj != obj) {
					// check if obj dragged out of scrollable container
					if (targetObj && !targetObj._dndScrollCallback && lastTargetObj._dndScrollCallback) {
						lastTargetObj._dndScrollCallback.run(mouseEv);
					}

					lastTargetObj._dragLeave(mouseEv);
					lastTargetObj._dropTarget._dragLeave();
				}

				obj.__lastTargetObj = targetObj;

				if ((targetObj != obj) && targetObj && targetObj._dndScrollCallback) {
					targetObj._dndScrollCallback.run(mouseEv);
				}

				// Move the DnD icon. We offset the location slightly so the icon doesn't receive the mousemove events.
				Dwt.setLocation(obj._dndProxy, mouseEv.docX + 2, mouseEv.docY + 2);
			}

			// We keep drawing a drag box as long as we're still over the owning object. We need to check its child
			// objects, and whether we're over the box itself (in case the user reverses direction).
			else if (obj._dragBox) {
				var evTarget = DwtUiEvent.getTarget(ev);
				if (targetObj && (Dwt.isAncestor(obj.getHtmlElement(), evTarget) || evTarget == obj._dragSelectionBox)) {
					obj._dragBox._dragMove(mouseEv, obj);
				}
			}

		} else {
			DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
		}
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseUpHdlr =
function(ev) {

	try {

	// Find the target control. If we're doing capture (DnD), we get it from the capture object.
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = captureObj ? captureObj.targetObj : DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	// DnD hover cancel point
	if (obj.__dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj.__dndHoverActionId);
		obj.__dndHoverActionId = -1;
	}

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, captureObj ? true : obj);
	if (!(captureObj && (obj._dragSource || obj._dragBox))) {
		return DwtControl.__processMouseUpEvent(ev, obj, mouseEv);
	} else {
		captureObj.release();
		if (obj._dragging != DwtControl._DRAGGING) {
			obj._dragging = DwtControl._NO_DRAG;
			return DwtControl.__processMouseUpEvent(ev, obj, mouseEv);
		}
		if (obj._dragSource) {
			obj.__lastTargetObj = null;
			var targetObj = mouseEv.dwtObj;
			var dropTarget = targetObj && targetObj._dropTarget;
			// Perform the drop if the target has allowed it
			if (targetObj && dropTarget && obj.__dropAllowed && ((targetObj != obj) || dropTarget.hasMultipleTargets())) {
				targetObj._drop(mouseEv);
				dropTarget._drop(obj._dragSource._getData(), mouseEv);
				obj._dragSource._endDrag();
				obj._destroyDragProxy(obj._dndProxy);
				obj._dragging = DwtControl._NO_DRAG;
			} else {
				DwtControl.__badDrop(obj, mouseEv);
			}
			if (targetObj && targetObj._dndScrollCallback) {
				targetObj._dndScrollCallback.run(mouseEv);
			}
		}
		else if (obj._dragBox) {
			obj._dragBox._endDrag(obj);
		}
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * Handles a bad DND drop operation by showing an animation of the icon flying
 * back to its origin.
 *
 * @param obj		[DwtControl]	control that underlies drag operation
 * @param mouseEv	[DwtMouseEvent]	mouse event
 * @private
 */
DwtControl.__badDrop =
function(obj, mouseEv) {
	if (obj._dragSource) {
		obj._dragSource._cancelDrag();
	}
    var targetObj = mouseEv.dwtObj;
    if (targetObj) {
       targetObj._drop(mouseEv);
    }
	// The following code sets up the drop effect for when an
	// item is dropped onto an invalid target. Basically the
	// drag icon will spring back to its starting location.
	obj.__dragEndX = mouseEv.docX;
	obj.__dragEndY = mouseEv.docY;
	if (obj.__badDropAction == null) {
		obj.__badDropAction = new AjxTimedAction(obj, obj.__badDropEffect);
	}

	// Line equation is y = mx + c. Solve for c, and set up d (direction)
	var m = (obj.__dragEndY - obj.__dragStartY) / (obj.__dragEndX - obj.__dragStartX);
	obj.__badDropAction.args = [m, obj.__dragStartY - (m * obj.__dragStartX), (obj.__dragStartX - obj.__dragEndX < 0) ? -1 : 1];
	AjxTimedAction.scheduleAction(obj.__badDropAction, 0);
};

/**
 * Handle double clicks in isolation, if requested (if not, events are handled
 * normally). On the first click, we set a 'click pending' flag and start a timer.
 * If the timer expires before another click arrives, we process the single click.
 * If a double-click event arrives before the timer expires, then we process the
 * double-click event.
 * @private
 */
DwtControl.__processMouseUpEvent =
function(ev, obj, mouseEv) {
	var shell = DwtShell.getShell(window);
	var hoverMgr = shell.getHoverMgr();
	hoverMgr.ignoreHoverOverOnClick();

	if (obj._dblClickIsolation && mouseEv && (mouseEv.button == DwtMouseEvent.LEFT)) {
		if (obj._clickPending) {
			// wait for real dblclick event
			return false;
		} else {
			obj._clickPending = true;
			var ta = new AjxTimedAction(null, DwtControl.__timedClick, [ev, obj, mouseEv]);
			obj._dblClickActionId = AjxTimedAction.scheduleAction(ta, DwtControl.__DBL_CLICK_TIMEOUT);
			DwtUiEvent.setBehaviour(ev, true, false);
			obj._st = new Date();
			return false;
		}
	} else {
		obj._clickPending = false;
		return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP, obj, mouseEv);
	}
};

DwtControl.__timedClick =
function(ev, obj, mouseEv) {
	obj._clickPending = false;
	DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP, obj, mouseEv);
};

/**
 * @private
 */
DwtControl.__mouseOutHdlr =
function(ev, evType) {

	try {

	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }
	evType = evType || DwtEvent.ONMOUSEOUT;
	if ((evType == DwtEvent.ONMOUSEOUT) && obj._ignoreInternalOverOut) {
		var otherObj = DwtControl.getTargetControl(ev, true);
		if (obj == otherObj) {
			return false;
		}
	}

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
			manager.setHoverOutListener(obj._hoverOutListener);
			manager.hoverOut();
			obj.__tooltipClosed = false;
	}
	return DwtControl.__mouseEvent(ev, evType || DwtEvent.ONMOUSEOUT, obj);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseLeaveHdlr =
function(ev) {
	return DwtControl.__mouseOutHdlr(ev, DwtEvent.ONMOUSELEAVE);
};

/**
 * @private
 */
DwtControl.__mouseWheelHdlr =
function(ev) {

	try {

	return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEWHEEL);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__selectStartHdlr =
function(ev) {

	try {

	return DwtControl.__mouseEvent(ev, DwtEvent.ONSELECTSTART);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * Note: if there is also a mousedown handler, oncontextmenu is no longer sent, so be careful.
 *
 * @private
 */
DwtControl.__contextMenuHdlr =
function(ev) {

	try {

	// for Safari, we have to fake a right click
	if (AjxEnv.isSafari) {
		var obj = DwtControl.getTargetControl(ev);
		var prevent = obj ? obj.preventContextMenu() : true;
		if (prevent) {
			DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEDOWN);
			return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP);
		}
	}
	return DwtControl.__mouseEvent(ev, DwtEvent.ONCONTEXTMENU);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * @private
 */
DwtControl.__mouseEvent =
function(ev, eventType, obj, mouseEv) {

	var obj = obj ? obj : DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	if (!mouseEv) {
		mouseEv = DwtShell.mouseEvent;
		mouseEv.setFromDhtmlEvent(ev, obj);
	}

	// By default, we halt event processing. The default can be overridden here through
	// the use of setEventPropagation(). A listener may also change the event props when called.
	var target = mouseEv.target;
	var tn = target.tagName;
	var parentTn = target.parentElement && target.parentElement.tagName;
	var containerTags = ["A", "LABEL"];
	var propagate = obj._propagateEvent[eventType] || (tn === "INPUT" || tn === "TEXTAREA" || tn === "SELECT" || containerTags.includes(tn));
	//todo - not sure if _stopPropagation and _dontCallPreventDefault should not the the SAME. Since if you stop propagation and dontCallPreventDefault,
	//it DOES allow selection (or context menu, etc, any default browser stuff). But if you allow to propagate, this might be overriden by a DOM element
	//higher up, which might not be what we want. Very confusing.
	mouseEv._stopPropagation = !propagate;
	mouseEv._dontCallPreventDefault = containerTags.includes(parentTn) || propagate;
	mouseEv._returnValue = propagate;

	// notify global listeners
	DwtEventManager.notifyListeners(eventType, mouseEv);

	// notify widget listeners
	if (obj.isListenerRegistered && obj.isListenerRegistered(eventType)) {
		obj.notifyListeners(eventType, mouseEv);
	}

	// publish our settings to the DOM
	mouseEv.setToDhtmlEvent(ev);

	// Some screen readers exclusively trigger ONCLICK events, but
	// Zimbra relies on ONMOUSEDOWN/ONMOUSEUP sequences for buttons
	// and some other controls, so we detect non-mouse clicks and
	// introduce the ability to 'fake' ONMOUSEDOWN/ONMOUSEUP sequences
	// for them. This triggers when the control element has a listener
	// for ONCLICK, but the DwtControl doesn't.
	if (eventType == DwtEvent.ONMOUSELEAVE ||
		eventType == DwtEvent.ONMOUSEOUT) {
		// we're 'switching' elements, so the browser won't
		// trigger a click event
		obj.__ignoreNextClick = false;

	} else if (eventType == DwtEvent.ONMOUSEUP) {
		// yes, ignore the next click -- ZCS' built-in click-ish
		// thing will work just fine
		obj.__ignoreNextClick = true;

	} else if (eventType == DwtEvent.ONCLICK) {
		if (obj.__ignoreNextClick) {
			DBG.println(AjxDebug.ACCESSIBILITY,
			            "DwtControl: ignoring a click!");
			obj.__ignoreNextClick = false;
			return true;
		}

		// check whether the target control listens for clicks,
		// and if not, fake a mouseup/mousedown event pair
		if (obj.isListenerRegistered && !obj.isListenerRegistered(DwtEvent.ONCLICK)) {
			DBG.println(AjxDebug.ACCESSIBILITY,
			            "DwtControl: faking a click!");

			eventType = DwtEvent.ONMOUSEDOWN;
			if (ev) {
				ev.type = eventType;
			}

			DwtControl.__mouseEvent(ev, eventType, obj, DwtShell.mouseEvent);

			eventType = DwtEvent.ONMOUSEUP;
			if (ev) {
				ev.type = eventType;
			}

			DwtControl.__mouseEvent(ev, eventType, obj, DwtShell.mouseEvent);

			return DwtShell.mouseEvent._returnValue;
		} else {
			DBG.println(AjxDebug.ACCESSIBILITY,
			            "DwtControl: skipping a click!");
			window.console && console.warn('skipping a click!');
		}
	}

	return mouseEv._returnValue;
};

// need to populate this hash after methods are defined
/**
 * @private
 */
DwtControl.__HANDLER = {};
DwtControl.__HANDLER[DwtEvent.ONCONTEXTMENU] = DwtControl.__contextMenuHdlr;
DwtControl.__HANDLER[DwtEvent.ONCLICK] = DwtControl.__clickHdlr;
DwtControl.__HANDLER[DwtEvent.ONDBLCLICK] = DwtControl.__dblClickHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEDOWN] = DwtControl.__mouseDownHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEENTER] = DwtControl.__mouseEnterHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSELEAVE] = DwtControl.__mouseLeaveHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEMOVE] = DwtControl.__mouseMoveHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEOUT] = DwtControl.__mouseOutHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEOVER] = DwtControl.__mouseOverHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEUP] = DwtControl.__mouseUpHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEWHEEL] = DwtControl.__mouseWheelHdlr;
DwtControl.__HANDLER[DwtEvent.ONSELECTSTART] = DwtControl.__selectStartHdlr;
DwtControl.__HANDLER[DwtEvent.ONKEYPRESS] = DwtControl.__keyPressHdlr;
DwtControl.__HANDLER[DwtEvent.ONKEYUP] = DwtControl.__keyUpHdlr;
DwtControl.__HANDLER[DwtEvent.ONKEYDOWN] = DwtControl.__keyDownHdlr;
DwtControl.__HANDLER[DwtEvent.ONFOCUS] = DwtControl.__focusHdlr;
DwtControl.__HANDLER[DwtEvent.ONBLUR] = DwtControl.__blurHdlr;

/**
 * @private
 */
DwtControl.prototype.__initCtrl =
function() {
	this.shell = this.parent.shell || this.parent;
	// __internalId is for back-compatibility (was side effect of Dwt.associateElementWithObject)
	this._htmlElId = this.__internalId = this._htmlElId || Dwt.getNextId();
	var htmlElement = this._elRef = this._createElement(this._htmlElId);
	htmlElement.id = this._htmlElId;
    if (DwtControl.ALL_BY_ID[this._htmlElId]) {
        DBG.println(AjxDebug.DBG1, "Duplicate ID for " + this.toString() + ": " + this._htmlElId);
        this._htmlElId = htmlElement.id = this.__internalId = DwtId.makeId(this._htmlElId, Dwt.getNextId());
    }
    DwtControl.ALL_BY_ID[this._htmlElId] = this;
	DwtComposite._pendingElements[this._htmlElId] = htmlElement;
	htmlElement.style.position = this.__posStyle || DwtControl.STATIC_STYLE;
	htmlElement.className = this._className;
	htmlElement.style.overflow = "visible";
	if (this.role) {
		htmlElement.setAttribute('role', this.role);
		if (this.role == 'tab') {
			htmlElement.setAttribute('aria-selected', false);
		}
	}
	if (this.ariaControls) {
		htmlElement.setAttribute('aria-controls', this.ariaControls);
	}

	if (this.ariaLabel) {
		htmlElement.setAttribute('aria-label', this.ariaLabel);
	}

	if (this.ariaOrientation) {
		htmlElement.setAttribute('aria-orientation', this.ariaOrientation);
	}

	if (this.ariaModal) {
		htmlElement.setAttribute('aria-modal', true);
	}

	this._enabled = true;
	this.__controlEvent = DwtControl.__controlEvent;
	this._dragging = DwtControl._NO_DRAG;
	this.__ctrlInited = true;

    this.setFocusElement();

    // timed actions in case we don't get focus/blur events when we programmatically focus/blur
    this._focusAction = new AjxTimedAction(null, DwtControl.__focusHdlr, [ DwtShell.focusEvent, DwtEvent.ONFOCUS, this ]);
    this._blurAction = new AjxTimedAction(null, DwtControl.__blurHdlr, [ DwtShell.focusEvent, DwtEvent.ONBLUR, this ]);

	// Make sure this is the last thing we do
	this.parent.addChild(this, this.__index);
};

/**
 * Returns the container element to be used for this control.
 * <p>
 * <strong>Note:</strong>
 * The caller will overwrite the id of the returned element with the
 * specified id.
 *
 * @param id [string] The id of the container element.
 * @private
 */
DwtControl.prototype._createElement = function(id) {
	return document.createElement("DIV")
};

/**
 * @private
 */
DwtControl.prototype.__dndDoHover =
function(control) {
	//TODO Add allow hover?
	control._dragHover();
};

/**
 * This method is called when a drop happens on an invalid target. The code will
 * animate the Drag icon back to its source before destroying it via <code>_destroyDragProxy</code>
 * @private
 */
DwtControl.prototype.__badDropEffect =
function(m, c, d) {
	var usingX = (Math.abs(m) <= 1);
	// Use the bigger delta to control the snap effect
	var delta = usingX ? this.__dragStartX - this.__dragEndX : this.__dragStartY - this.__dragEndY;
    if (delta * d > 0 && !(this.__dragEndY == this.__dragStartY || this.__dragEndX == this.__dragStartX) ) {
		if (usingX) {
			this.__dragEndX += (30 * d);
			this._dndProxy.style.top = m * this.__dragEndX + c;
			this._dndProxy.style.left = this.__dragEndX;
		} else {
			this.__dragEndY += (30 * d);
			this._dndProxy.style.top = this.__dragEndY;
			this._dndProxy.style.left = (this.__dragEndY - c) / m;
		}
		AjxTimedAction.scheduleAction(this.__badDropAction, 0);
 	} else {
  		this._destroyDragProxy(this._dndProxy);
		this._dragging = DwtControl._NO_DRAG;
  	}
};

/**
 * Attempts to display a tooltip for this control, triggered by the cursor having been
 * over the control for a period of time. The tooltip may have already been set (if it's
 * a static tooltip). For dynamic tooltip content, the control implements getToolTipContent()
 * to return the content or a callback. It should return a callback if it makes an
 * async server call to get data.
 *
 * @private
 */
DwtControl.prototype.__handleHoverOver =
function(event) {

	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROVER)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROVER, event);
	}

	var mouseEv = event && event.object;
	var tooltip = this.getToolTipContent(mouseEv);
	var content, callback;
	if (!tooltip) {
		content = "";
	} else if (typeof(tooltip) == "string") {
		content = tooltip;
	} else if (tooltip.isAjxCallback || AjxUtil.isFunction(tooltip)) {
		callback = tooltip;
	} else if (typeof(tooltip) == "object") {
		content = tooltip.content;
		callback = tooltip.callback;
	}

	if (!content && callback && tooltip.loading) {
		content = AjxMsg.loading;
	}

	if (content) {
		this.__showToolTip(event, content);
	}

	if (callback) {
		var callback1 = new AjxCallback(this, this.__showToolTip, [event]);
		AjxTimedAction.scheduleAction(new AjxTimedAction(null, function() { callback.run(callback1); }), 0);
	}
};

/**
 * @private
 */
DwtControl.prototype.__showToolTip =
function(event, content) {

	if (!content) { return; }
    DwtControl.showToolTip(content, event.x, event.y, this, event);
	this.__lastTooltipX = event.x;
	this.__lastTooltipY = event.y;
	this.__tooltipClosed = false;
};

/**
 * @private
 */
DwtControl.prototype.__handleHoverOut =
function(event) {
	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROUT)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROUT, event);
	}
    DwtControl.hideToolTip();
	this.__lastTooltipX = null;
	this.__lastTooltipY = null;
};

/**
 * @private
 */
DwtControl.prototype.__isInputEl =
function(targetEl) {
	var bIsInput = false;
	if(!targetEl || !targetEl.tagName) {
		return bIsInput;
	}
	var tagName = targetEl.tagName.toLowerCase();
	var type = tagName == "input" ? targetEl.type.toLowerCase() : null;

	if (tagName == "textarea" || (type && (type == "text" || type == "password")))
		bIsInput = true;

	return bIsInput;
};


/**
 * onunload hacking
 * @private
 */
DwtControl.ON_UNLOAD =
function() {
	// break widget-element references
	var h = DwtControl.ALL_BY_ID, i;
	for (i in h) {
		h[i]._elRef = null;
	}
	DwtControl.ALL_BY_ID = {};
};

if (window.attachEvent) {
	window.attachEvent("onunload", DwtControl.ON_UNLOAD);
}
else if (window.addEventListener) {
	window.addEventListener("unload", DwtControl.ON_UNLOAD, false);
}

/**
 *  A helper method to show the toolTips.
 * @param content
 * @param x [Number] The x coordinate of the toolTip.
 * @param y [Number] The y coordinate of the toolTip.
 */
DwtControl.showToolTip =
function(content, x, y, obj, hoverEv) {
	if (!content) { return; }
	var tooltip = DwtShell.getShell(window).getToolTip();
	tooltip.setContent(content);
	tooltip.popup(x, y, false, false, obj, hoverEv);
};

/**
 * A helper method to hide the toolTip.
 */
DwtControl.hideToolTip =
function() {
	DwtShell.getShell(window).getToolTip().popdown();
};

/**
 * Returns the element that should be used as a base for positioning the tooltip.
 * If overridden to return null, the cursor position will be used as the base.
 * 
 * @param {DwtHoverEvent}	hoverEv		hover event (from hover mgr)
 */
DwtControl.prototype.getTooltipBase =
function(hoverEv) {
	return this.getHtmlElement();
};

DwtControl.prototype.boundsForChild =
function(child) {
	if (child && child.getHtmlElement) {
		child = child.getHtmlElement();
	}

	var fn = function(bounds, node) {
		var margins = Dwt.getMargins(node);
		var bounds = Dwt.insetBounds(bounds, Dwt.getInsets(node));
		bounds.width =
			Math.max(bounds.width - margins.left - margins.right, 0);
		bounds.height =
			Math.max(bounds.height - margins.top - margins.bottom, 0);
		return bounds;
	};

	var bounds = new DwtRectangle(0, 0, this.getHtmlElement().clientWidth,
	                              this.getHtmlElement().clientHeight);

	return AjxUtil.reduce(Dwt.getAncestors(child, this.getHtmlElement(), true),
	                      fn, bounds);
};

// Convenience methods for manipulating attributes of this control's DIV
DwtControl.prototype.hasAttribute = function(attr) {
	return this.getHtmlElement().hasAttribute(attr);
};
DwtControl.prototype.getAttribute = function(attr) {
	return this.getHtmlElement().getAttribute(attr);
};
DwtControl.prototype.setAttribute = function(attr, value) {
	this.getHtmlElement().setAttribute(attr, value);
};
DwtControl.prototype.removeAttribute = function(attr) {
	this.getHtmlElement().removeAttribute(attr);
};

}
if (AjxPackage.define("ajax.dwt.widgets.DwtComposite")) {
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
 * This file contains a Dwt composite control.
 * 
 */

/**
 * @class
 * A composite may contain other controls. All controls that need to contain child controls
 * (such as menus, trees) should inherit from this class.
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}	params.parent	the parent widget
 * @param {string}	params.className		the CSS class
 * @param {constant}	params.posStyle		the positioning style
 * @param {boolean}	params.deferred		if <code>true</code>, postpone initialization until needed
 * @param {string}	params.id			an explicit ID to use for the control's HTML element
 * @param {number}	params.index 		the index at which to add this control among parent's children
 * 
 * @extends	DwtControl
 */
DwtComposite = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtComposite.PARAMS);
	
	params.className = params.className || "DwtComposite";
	DwtControl.call(this, params);

	var desc = this.toString();
	if (desc == 'DwtComposite') {
		desc = this.getHTMLElId();
	}

	this._compositeTabGroup = new DwtTabGroup(desc + ' (DwtComposite)');

	/**
	 * Vector of child elements
	 * @type AjxVector
	 */
	this._children = new AjxVector();
}

DwtComposite.PARAMS = DwtControl.PARAMS.concat();

DwtComposite.prototype = new DwtControl;
DwtComposite.prototype.constructor = DwtComposite;

DwtComposite.prototype.isDwtComposite = true;
DwtComposite.prototype.toString = function() { return "DwtComposite"; }



/**
 * Pending elements hash (i.e. elements that have not yet been realized).
 * @private
 */
DwtComposite._pendingElements = new Object();


/**
 * Disposes of the control. This method will remove the control from under the
 * control of it's parent and release any resources associate with the component.
 * The method will also notify any event listeners on registered {@link DwtEvent.DISPOSE} event type.
 * 
 * <p>
 * In the case of {@link DwtComposite} this method will also dispose of all of the composite's
 * children.
 * 
 * <p> 
 * Subclasses may override this method to perform their own dispose functionality but
 * should generally call the parent <code>dispose()</code> method.
 * 
 * @see DwtControl#isDisposed
 * @see DwtControl#addDisposeListener
 * @see DwtControl#removeDisposeListener
 */
DwtComposite.prototype.dispose =
function() {
	if (this._disposed) return;

	var children = this._children.getArray();
	while (children.length > 0) {
        children.pop().dispose();
	}

	if (this._compositeTabGroup) {
		this._compositeTabGroup.removeAllMembers();
	}
	this._compositeTabGroup = null;

	DwtControl.prototype.dispose.call(this);
}

/**
 * Get a list of children of this composite.
 * 
 * @return	{array}		an array of {@link DwtControl} objects
 */
DwtComposite.prototype.getChildren =
function() {
	return this._children.getArray().slice(0);
}

/**
 * Get the Nth child of this composite.
 * 
 * @param {number}	index 		the index of the child.
 *
 * @return	{DwtControl}		the child.
 */
DwtComposite.prototype.getChild =
function(idx) {
	return this._children.get(idx);
};

/**
 * collapses consecutive separators into one. Gets rid of head or tail separators as well .
 * Note that is does not remove the separators, just hides them so they can re-displayed as needed, next time this is called and other elements
 * become visible
 *
 * this would be used on such subclasses as DwtMenu and DwtToolbar .
 * However, currently it does not work with the toolbars, since separators there are not added as children to the toolbar composite.
 * I tried to make it consistent with the DwtMenu approach, but it seemed a bit complicated right now.
 * so for now I try to make it so no complete groups (items between separators) are hidden at one time. It might also be possible
 * to do it for the toolbar using the _items HTML elements array, but probably less elegant than this approach.
 */
DwtComposite.prototype.cleanupSeparators =
function() {
	var items = this.getChildren();
	var previousVisibleIsSeparator = true; // I lie so that upfront separator would be cleaned up
	var lastSeparator;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var isSeparator = item.isStyle && item.isStyle(DwtMenuItem.SEPARATOR_STYLE);

		if (isSeparator) {
			item.setVisible(!previousVisibleIsSeparator);
			if (!previousVisibleIsSeparator || !lastSeparator) { //the !lastSeparator is the edge case of first item is separator. (see comment about lie above)
				//keep track of last visible separator (if it's also last item visible overall)
				previousVisibleIsSeparator = true;
				lastSeparator = item;
			}
			continue;
		}

		//not a separator
		if (item.getVisible()) {
			previousVisibleIsSeparator = false;
		}
	}
	//cleanup tail separator
	if (previousVisibleIsSeparator && lastSeparator) {
		lastSeparator.setVisible(false);
	}
};




/**
 * Gets the number of children of this composite.
 * 
 * @return {number} 		the number of composite children
 */
DwtComposite.prototype.getNumChildren =
function() {
	return this._children.size();
}

/**
 * Removes all of the composite children.
 * 
 */
DwtComposite.prototype.removeChildren =
function() {
	var a = this._children.getArray();
	while (a.length > 0) {
		a[0].dispose();
	}
	if (this._compositeTabGroup) {
		this._compositeTabGroup.removeAllMembers();
	}
}

/**
 * Clears the composite HTML element of content and removes
 * all composite children by calling <code>removeChildren</code>.
 * 
 * @see #removeChildren
 */
DwtComposite.prototype.clear =
function() {
	this.removeChildren();
	this.getHtmlElement().innerHTML = "";
}

/**
* Adds the given child control to this composite at the index (if specified).
*
* @param {DwtControl} child		the child control to add
* @param {number}	index		the index at which to add the child (may be <code>null</code>)
*/
DwtComposite.prototype.addChild =
function(child, index) {
	this._children.add(child, index);
	this._compositeTabGroup.addMember(child, index);
	
	// check for a previously removed element
	var childHtmlEl = child.getHtmlElement();
	childHtmlEl.setAttribute("parentId", this._htmlElId);
	if (this instanceof DwtShell && this.isVirtual()) {
		// If we are operating in "virtual shell" mode, then children of the shell's html elements
		// are actually parented to the body
		document.body.appendChild(childHtmlEl);
	} else {
		child.reparentHtmlElement(child.__parentElement || this.getHtmlElement(), index);
		child.__parentElement = null; // don't keep the reference to element, if any
	}
};

/**
* Removes the specified child control from this control. A removed child is no longer retrievable via
* <code>getHtmlElement()</code>, so there is an option to save a reference to the removed child. 
* That way it can be added later using <code>addChild()</code>.
*
* @param {DwtConrol} child		the child control to remove
* @see #addChild
*/
DwtComposite.prototype.removeChild =
function(child) {
	DBG.println(AjxDebug.DBG3, "DwtComposite.prototype.removeChild: " + child._htmlElId + " - " + child.toString());
	// Make sure that the child is initialized. Certain children (such as DwtTreeItems)
	// can be created in a deferred manner (i.e. they will only be initialized if they
	// are becoming visible.
	if (child.isInitialized()) {
		this._children.remove(child);
		this._compositeTabGroup.removeMember(child);
		// Sometimes children are nested in arbitrary HTML so we elect to remove them
		// in this fashion rather than use this.getHtmlElement().removeChild(child.getHtmlElement()
		var childHtmlEl = child.getHtmlElement();
        if (childHtmlEl) {
			childHtmlEl.removeAttribute("parentId");
			if (childHtmlEl.parentNode) {
				var el = childHtmlEl.parentNode.removeChild(childHtmlEl);
			}
		}
	}
}

/**
 * Return this.tabGroupMember if present (it always overrides any other contender), otherwise if this composite has
 * children return the composite tab group, otherwise just return this control (instead of a group with one member).
 *
 * @returns {DwtComposite|DwtTabGroup}
 */
DwtComposite.prototype.getTabGroupMember = function() {

	return this.tabGroupMember || (this.getNumChildren() > 0 ? this._compositeTabGroup : this);
};

/**
 * Allows the user to use the mouse to select text on the control.
 * 
 * @private
 */
DwtComposite.prototype._setAllowSelection =
function() {
	if (!this._allowSelection) {
		this._allowSelection = true;
		this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
		this.addListener(DwtEvent.ONCONTEXTMENU, new AjxListener(this, this._contextMenuListener));
	}
};

/**
 * Sets whether to prevent the browser from allowing text selection.
 * 
 * @see DwtControl#preventSelection
 * @private
 */
DwtComposite.prototype.preventSelection = 
function(targetEl) {
	return this._allowSelection ? false : DwtControl.prototype.preventSelection.call(this, targetEl);
};

/**
 * Determines whether to prevent the browser from displaying its context menu.
 * 
 * @see DwtControl#preventContextMenu
 * @private
 */
DwtComposite.prototype.preventContextMenu =
function(target) {
	if (!this._allowSelection) {
		return DwtControl.prototype.preventContextMenu.apply(this, arguments);
	}
	
	var bObjFound = target ? (target.id.indexOf("OBJ_") == 0) : false;
	var bSelection = false;

	// determine if anything has been selected (IE and mozilla do it differently)
	if (document.selection) {			// IE
		bSelection = document.selection.type == "Text";
	} else if (getSelection()) {		// mozilla
		bSelection = getSelection().toString().length > 0;
	}

	// if something has been selected and target is not a custom object,
	return (bSelection && !bObjFound) ? false : true;
};

/**
 * Handles focus control when the mouse button is released
 * 
 * @see DwtControl#_focusByMouseUpEvent
 * @private
 */
DwtComposite.prototype._focusByMouseUpEvent =
function()  {
	if (!this._allowSelection) {
		DwtControl.prototype._focusByMouseUpEvent.apply(this, arguments);
	}
	// ...Else do nothing....
	// When text is being selected, we don't want the superclass
	// to give focus to the keyboard input control.
};

/**
 * Event listener that is only registered when this control allows selection
 * 
 * @see _allowSelection
 * @private
 */
DwtComposite.prototype._mouseDownListener =
function(ev) {
	if (ev.button == DwtMouseEvent.LEFT) {
		// reset mouse event to propagate event to browser (allows text selection)
		//todo - look into changing this, it's currently very confusing and inconsistent.
		//bug 23462 change it to stop propagation, so supposedly it should NOT allow selection.
		// (so the above comment is wrong). But it's more complicated than this, since ev._dontCallPreventDefault is more
		// important, and is not set here, so a listener could set it to TRUE thus making it allow selection, despite
		// _stopPropagation being set to true here. (not sure what the meaning is).
		// Note for example the inconsistency with the DwtComposite.prototype._contextMenuListener method below
		// As one cool way to allow selection look at ZmConvView2Header constructor, the line:
		// this.setEventPropagation(true, [DwtEvent.ONMOUSEDOWN, DwtEvent.ONSELECTSTART, DwtEvent.ONMOUSEUP, DwtEvent.ONMOUSEMOVE]);
		// which causes _dontCallPreventDefault to be set to true, not being overriden here, thus selection works.
		ev._stopPropagation = true;
		ev._returnValue = true;
	}
};

/**
 * Event listener that is only registered when this control allows selection
 * 
 * @see _allowSelection
 * @private
 */
DwtComposite.prototype._contextMenuListener =
function(ev) {
	// reset mouse event to propagate event to browser (allows context menu)
	ev._stopPropagation = false;
	ev._returnValue = true;
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtBaseDialog")) {
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
 * @overview
 * This file contains a base Dwt dialog control.
 * 
 */

/**
 * @class
 * This is a base class for dialogs. Given content, this class will take care of 
 * showing and hiding the dialog, as well as dragging it.
 * <p>
 * Dialogs always hang off the main shell since their stacking order is managed through z-index.
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 * @param {hash}	params		a hash of parameters
 * @param	{DwtComposite}	params.parent	the parent widget (the shell)
 * @param	{string}	params.className		the CSS class
 * @param	{string}	params.title		the title
 * @param	{number}	[params.zIndex=Dwt.Z_DIALOG]		the z-index to set for this dialog when it is visible
 * @param	{DwtBaseDialog.MODAL|DwtBaseDialog.MODELESS}	[params.mode=DwtBaseDialog.MODAL] 		the modality of the dialog
 * @param	{DwtPoint}	params.loc			the location at which to popup the dialog. Defaults to being centered within its parent
 * @param	{boolean}		params.disposeOnPopDown		    destroy the content of dialog on popdown, Defaults to false
 * @param	{DwtControl}	params.view 		the the control whose element is to be re-parented
 * @param	{string}	params.dragHandleId 		the the ID of element used as drag handle
 * 
 * @extends	DwtComposite
 */
DwtBaseDialog = function(params) {
	if (arguments.length == 0) { return; }

	params = Dwt.getParams(arguments, DwtBaseDialog.PARAMS);
	var parent = params.parent;
	if (!(parent instanceof DwtShell)) {
		throw new DwtException("DwtBaseDialog parent must be a DwtShell", DwtException.INVALIDPARENT, "DwtDialog");
	}
	params.className = params.className || "DwtBaseDialog";
	params.posStyle = DwtControl.ABSOLUTE_STYLE;
	params.isFocusable = false;

	this._title = params.title || "";

	DwtComposite.call(this, params);
    this._disposeOnPopDown = params.disposeOnPopDown || false;
	this._shell = parent;
	this._zIndex = params.zIndex || Dwt.Z_DIALOG;
	this._mode = params.mode || DwtBaseDialog.MODAL;
	
	this._loc = new DwtPoint();
	if (params.loc) {
		this._loc.x = params.loc.x;
		this._loc.y = params.loc.y
	} else {
		this._loc.x = this._loc.y = Dwt.LOC_NOWHERE;
	}

	// Default dialog tab group.
	this._tabGroup = new DwtTabGroup(this.toString());

    this._dragHandleId = params.dragHandleId || this._htmlElId + "_handle";
	this._createHtml();
    this._initializeDragging(this._dragHandleId);

	if (params.view) {
		this.setView(params.view);
    }

	// reset tab index
    this.setZIndex(Dwt.Z_HIDDEN); // not displayed until popup() called

    // Set visible to true now to allow for getting metrics. ZIndex hidden will prevent it
    // from actually being visible until the dialog is popped up.
	this.setVisible(true);

	this._position(DwtBaseDialog.__nowhereLoc);

	// Make sure mouse clicks propagate to the DwtDraggable handler (document.onMouseMove and onMouseUp)
	this._propagateEvent[DwtEvent.ONMOUSEUP] = true;

	this.shellResizeHandler = this._resizeHdlr.bind(this);
};

/**
 * @private
 */
DwtBaseDialog.PARAMS = ["parent", "className", "title", "zIndex", "mode", "loc", "view", "dragHandleId", "id"];

DwtBaseDialog.prototype = new DwtComposite;
DwtBaseDialog.prototype.constructor = DwtBaseDialog;

DwtBaseDialog.prototype.toString = function() { return "DwtBaseDialog"; };
DwtBaseDialog.prototype.isDwtBaseDialog = true;

DwtBaseDialog.prototype.role = 'dialog';
DwtBaseDialog.prototype.ariaModal = 'true';
DwtBaseDialog.prototype.isFocusable = true;


//
// Constants
//

// modes

/**
 * Defines a "modeless" dialog.
 */
DwtBaseDialog.MODELESS = 1;

/**
 * Defines a "modal" dialog.
 */
DwtBaseDialog.MODAL = 2;

/**
 * @private
 */
DwtBaseDialog.__nowhereLoc = new DwtPoint(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);

//
// Data
//

/**
 * @private
 */
DwtBaseDialog.prototype.TEMPLATE = "dwt.Widgets#DwtBaseDialog";

/**
 * <strong>Note:</strong>
 * This member variable will be set by sub-classes that want a control bar
 * to appear below the dialog contents.
 * 
 * @private
 */
DwtBaseDialog.prototype.CONTROLS_TEMPLATE = null;

//
// Public methods
//

/**
 * Adds a popup listener.
 * 
 * @param		{AjxListener}	listener		the listener to add
 */
DwtBaseDialog.prototype.addPopupListener =
function(listener) {
	this.addListener(DwtEvent.POPUP, listener);
}

/**
 * Removes a popup listener.
 * 
 * @param		{AjxListener}	listener		the listener to remove
 */
DwtBaseDialog.prototype.removePopupListener = 
function(listener) {
	this.removeListener(DwtEvent.POPUP, listener);
}

/**
 * Adds a popdown listener.
 * 
 * @param		{AjxListener}	listener		the listener to add
 */
DwtBaseDialog.prototype.addPopdownListener = 
function(listener) {
	this.addListener(DwtEvent.POPDOWN, listener);
}

/**
 * Removes a popdown listener.
 * 
 * @param		{AjxListener}	listener		the listener to remove
 */
DwtBaseDialog.prototype.removePopdownListener = 
function(listener) {
	this.removeListener(DwtEvent.POPDOWN, listener);
}

/**
 * Pops-up the dialog, makes the dialog visible in places. Everything under the dialog will
 * become veiled if we are modal. Note: popping up a dialog will block
 * keyboard actions from being delivered to the global key action handler (if one
 * is registered).
 *
 * @param {DwtPoint}		loc		the desired location
 */
DwtBaseDialog.prototype.popup =
function(loc) {
	if (this._poppedUp) { return; }

	this.cleanup(true);
	var thisZ = this._zIndex;

	// if we're modal, setup the veil effect, and track which dialogs are open
	if (this._mode == DwtBaseDialog.MODAL) {
		thisZ = this._setModalEffect(thisZ);
	}

	this._shell._veilOverlay.activeDialogs.push(this);
	this.setVisible(true);
	
	// use whichever has a value, local has precedence
	if (loc) {
		this._loc.x = loc.x;
		this._loc.y = loc.y;
	}
	this._position(loc);

    //reset TAB focus before popup of dialog.
    //method be over-written to focus a different member.
    this._resetTabFocus();

	this.setZIndex(thisZ);
	this._poppedUp = true;

	// Push our tab group
	var kbMgr = this._shell.getKeyboardMgr();
	kbMgr.pushTabGroup(this._tabGroup);
	kbMgr.pushDefaultHandler(this);

	DwtShell.getShell().addListener(DwtEvent.CONTROL, this.shellResizeHandler);

	this.notifyListeners(DwtEvent.POPUP, this);
};

/**
 * @private
 */
DwtBaseDialog.prototype._resetTabFocus =
function(){
    this._tabGroup.resetFocusMember(true);
};

DwtBaseDialog.prototype.focus = 
function () {
	// if someone is listening for the focus to happen, give control to them,
	// otherwise focus on this dialog.
	if (this.isListenerRegistered(DwtEvent.ONFOCUS)) {
		this.notifyListeners(DwtEvent.ONFOCUS);
	} else if (this._focusElementId){
		var focEl = document.getElementById(this._focusElementId);
		if (focEl) {
			focEl.focus();
            return focEl;
		}
	}
};

/**
 * Checks if the dialog is popped-up.
 * 
 * @return	{boolean}	<code>true</code> if the dialog is popped-up; <code>false</code> otherwise
 */
DwtBaseDialog.prototype.isPoppedUp =
function () {
	return this._poppedUp;
};

/**
 * Pops-down and hides the dialog.
 * 
 */
DwtBaseDialog.prototype.popdown =
function() {

	if (this._poppedUp) {
		this._poppedUp = false;
		this.cleanup(false);
	
		//var myZIndex = this.getZIndex();
	    var myZIndex = this._zIndex;
		this.setZIndex(Dwt.Z_HIDDEN);
		this.setVisible(false);
		//TODO we should not create an object everytime we popdown a dialog (ditto w/popup)
		this._position(DwtBaseDialog.__nowhereLoc);
		if (this._mode == DwtBaseDialog.MODAL) {
			this._undoModality(myZIndex);
		} else {
			this._shell._veilOverlay.activeDialogs.pop();
		}
		//this.removeKeyListeners();

        //Dispose the dialog if _disposeOnPopDown is set to true
		if (this._disposeOnPopDown === true) {
            this.dispose();
        }

		// Pop our tab group
		var kbMgr = this._shell.getKeyboardMgr();
		kbMgr.popTabGroup(this._tabGroup);
		kbMgr.popDefaultHandler();

		DwtShell.getShell().removeListener(DwtEvent.CONTROL, this.shellResizeHandler);
		this.notifyListeners(DwtEvent.POPDOWN, this);
	}
};

/**
 * Sets the content of the dialog to a new view. Essentially re-parents
 * the supplied control's HTML element to the dialogs HTML element
 * 
 * @param {DwtControl} newView		the control whose element is to be re-parented
 */
DwtBaseDialog.prototype.setView =
function(newView) {
	this.reset();
	if (newView) {
		this._getContentDiv().appendChild(newView.getHtmlElement());
	}
};

/**
 * Resets the dialog back to its original state. Subclasses should override this method
 * to add any additional behavior, but should still call up into this method.
 * 
 */
DwtBaseDialog.prototype.reset =
function() {
	this._loc.x = this._loc.y = Dwt.LOC_NOWHERE;
}

/**
* Cleans up the dialog so it can be used again later.
* 
* @param	{boolean}		bPoppedUp		if <code>true</code>, the dialog is popped-up; <code>false</code> otherwise
*/
DwtBaseDialog.prototype.cleanup =
function(bPoppedUp) {
	//TODO handle different types of input fields e.g. checkboxes etc
	var inputFields = this._getInputFields();
	
	if (inputFields) {
		var len = inputFields.length;
		for (var i = 0; i < len; i++) {
			inputFields[i].disabled = !bPoppedUp;
			if (bPoppedUp)
				inputFields[i].value = "";
		}
	}
}

/**
 * Sets the title.
 * 
 * @param	{string}		title		the title
 */
DwtBaseDialog.prototype.setTitle =
function(title) {
    if (this._titleEl) {
        this._titleEl.innerHTML = title || "";
    }

    this._title = title;
};

/**
* Sets the dialog content (below the title, above the buttons).
*
* @param {string}		text		the dialog content
*/
DwtBaseDialog.prototype.setContent =
function(text) {
	var d = this._getContentDiv();
	if (d) {
		d.innerHTML = text || "";
	}
}

/**
 * @private
 */
DwtBaseDialog.prototype._getContentDiv =
function() {
	return this._contentEl;
};

/**
 * Adds an enter listener.
 * 
 * @param	{AjxListener}	listener		the listener to add
 */
DwtBaseDialog.prototype.addEnterListener =
function(listener) {
	this.addListener(DwtEvent.ENTER, listener);
};

/**
 * Gets the active dialog.
 * 
 * @return	{DwtBaseDialog}		the active dialog
 */
DwtBaseDialog.getActiveDialog = 
function() {
	var dialog = null;
	var shellObj = DwtShell.getShell(window);
	if (shellObj) {
		var len = shellObj._veilOverlay.activeDialogs.length;
		if (len > 0) {
			dialog = shellObj._veilOverlay.activeDialogs[len - 1];
		}
	}
	return dialog;
};

//
// Protected methods
//

DwtBaseDialog.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * @private
 */
DwtBaseDialog.prototype._initializeDragging =
function(dragHandleId) {
	var dragHandle = document.getElementById(dragHandleId);
	if (dragHandle) {
		var control = DwtControl.fromElementId(window._dwtShellId);
		if (control) {
			var p = Dwt.getSize(control.getHtmlElement());
			var dragObj = document.getElementById(this._htmlElId);
			var size = this.getSize();
			var dragEndCb = new AjxCallback(this, this._dragEnd);
			var dragCb = new AjxCallback(this, this._duringDrag);
			var dragStartCb = new AjxCallback(this, this._dragStart);

			DwtDraggable.init(dragHandle, dragObj, 0,
							  document.body.offsetWidth - 10, 0, document.body.offsetHeight - 10, dragStartCb, dragCb, dragEndCb);
		}
	}
};

/**
 * @private
 */
DwtBaseDialog.prototype._getContentHtml =
function() {
    return "";
};

/**
 * @private
 */
DwtBaseDialog.prototype._createHtml = function(templateId) {
    var data = { id: this._htmlElId };
    this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

/**
 * @private
 */
DwtBaseDialog.prototype._createHtmlFromTemplate = function(templateId, data) {
    // set default params
    data.dragId = this._dragHandleId;
    data.title = this._title;
    data.icon = "";
    data.closeIcon1 = "";
    data.closeIcon2 = "";
    data.controlsTemplateId = this.CONTROLS_TEMPLATE;

    // expand template
    DwtComposite.prototype._createHtmlFromTemplate.call(this, templateId, data);

    // remember elements
    this._titleBarEl = document.getElementById(data.id+"_titlebar");
    this._titleEl = document.getElementById(data.id+"_title");
    this._contentEl = document.getElementById(data.id+"_content");

	if (this._titleEl) {
		this.setAttribute('aria-labelledby', this._titleEl.id);
		this._titleEl.setAttribute('role', 'heading');
		this._titleEl.setAttribute('aria-level', '2');
	}

    // NOTE: This is for backwards compatibility. There are just
    //       too many sub-classes of dialog that expect to return
    //       the dialog contents via the _getContentHtml method.
    this.setContent(this._getContentHtml());
};

/**
 * @private
 */
DwtBaseDialog.prototype._setModalEffect =
function() {
	// place veil under this dialog
	var dialogZ = this._shell._veilOverlay.dialogZ;
	var currentDialogZ = null;
	var thisZ, veilZ;
	if (dialogZ.length)
		currentDialogZ = dialogZ[dialogZ.length - 1];
	if (currentDialogZ) {
		thisZ = currentDialogZ + 2;
		veilZ = currentDialogZ + 1;
	} else {
		thisZ = this._zIndex;
		veilZ = Dwt.Z_VEIL;
	}
	this._shell._veilOverlay.veilZ.push(veilZ);
	this._shell._veilOverlay.dialogZ.push(thisZ);
	Dwt.setZIndex(this._shell._veilOverlay, veilZ);
	return thisZ;
};

/**
 * @private
 */
DwtBaseDialog.prototype._undoModality =
function (myZIndex) {
	var veilZ = this._shell._veilOverlay.veilZ;
	veilZ.pop();
	var newVeilZ = veilZ[veilZ.length - 1];
	Dwt.setZIndex(this._shell._veilOverlay, newVeilZ);
	this._shell._veilOverlay.dialogZ.pop();
	this._shell._veilOverlay.activeDialogs.pop();
	if (this._shell._veilOverlay.activeDialogs.length > 0 ) {
		this._shell._veilOverlay.activeDialogs[0].focus();
	}
};

/**
 * Subclasses should implement this method to return an array of input fields that
 * they want to be cleaned up between instances of the dialog being popped up and
 * down
 * 
 * @return An array of the input fields to be reset
 */
DwtBaseDialog.prototype._getInputFields = 
function() {
	// overload me
}

DwtBaseDialog.prototype._resizeHdlr =
function(ev) {
	if (this._loc.x === Dwt.LOC_NOWHERE && this._loc.y === Dwt.LOC_NOWHERE) {
		this._position();
	}
};

/**
 * @private
 */
DwtBaseDialog.prototype._dragStart =
function (x, y){
    // fix for bug 3177
    if (AjxEnv.isNav && !this._ignoreSetDragBoundries) {
        this._currSize = this.getSize();
        var control = DwtControl.fromElementId(window._dwtShellId);
        if (control) {
            var p = Dwt.getSize(control.getHtmlElement());
            DwtDraggable.setDragBoundaries(DwtDraggable.dragEl, 0, p.x - this._currSize.x, 0, p.y - this._currSize.y);
        }
    }
};

/**
 * @private
 */
DwtBaseDialog.prototype._dragEnd =
function(x, y) {
 	// save dropped position so popup(null) will not re-center dialog box
	this._loc.x = x;
	this._loc.y = y;
}

/**
 * @private
 */
DwtBaseDialog.prototype._duringDrag =
function(x, y) {
	// overload me
};

/**
 * @private
 */
DwtBaseDialog.prototype._doesContainElement = 
function (element) {
	return Dwt.contains(this.getHtmlElement(), element);
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtDialog")) {
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
 * This file contains classes for a Dwt dialog pop-up.
 */

/**
 * @class
 * This class represents a popup dialog with a title and standard buttons.
 * A client or subclass sets the dialog content. Dialogs always hang-off the main shell
 * since their stacking order is managed through z-index.
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 *
 * @param {hash}		params			a hash of parameters
 * @param	{DwtComposite}		params.parent			 		the parent widget (the shell)
 * @param	{string}	params.className					the CSS class
 * @param	{string}	params.title						the title of dialog
 * @param	{array|constant}	params.standardButtons		an array of standard buttons to include. Defaults to {@link DwtDialog.OK_BUTTON} and {@link DwtDialog.CANCEL_BUTTON}.
 * @param	{array}	params.extraButtons		  			a list of {@link DwtDialog_ButtonDescriptor} objects describing custom buttons to add to the dialog
 * @param	{number}	params.zIndex							the z-index to set for this dialog when it is visible. Defaults to {@link Dwt.Z_DIALOG}.
 * @param	{DwtDialog.MODELESS|DwtDialog.MODAL}	params.mode 						the modality of the dialog. Defaults to {@link DwtDialog.MODAL}.
 * @param	{boolean}		params.disposeOnPopDown		    destroy the content of dialog on popdown, Defaults to false
 * @param	{DwtPoint}		params.loc						the location at which to popup the dialog. Defaults to centered within its parent.
 * 
 * @see		DwtDialog.CANCEL_BUTTON
 * @see		DwtDialog.OK_BUTTON
 * @see		DwtDialog.DISMISS_BUTTON
 * @see		DwtDialog.NO_BUTTON
 * @see		DwtDialog.YES_BUTTON
 * @see		DwtDialog.ALL_BUTTONS
 * @see		DwtDialog.NO_BUTTONS
 * 
 * @extends	DwtBaseDialog
 */
DwtDialog = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtDialog.PARAMS);
	params.className = params.className || "DwtDialog";
	this._title = params.title = params.title || "";

	// standard buttons default to OK / Cancel
	var standardButtons = params.standardButtons;
	var extraButtons = params.extraButtons;
	if (!standardButtons) {
		standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
	} else if (standardButtons == DwtDialog.NO_BUTTONS) {
		standardButtons = null;
	} else if (standardButtons && !standardButtons.length) {
		standardButtons = [standardButtons];
	}

	// assemble the list of button IDs, and the list of button descriptors
	this._buttonList = [];
	var buttonOrder = {};
	buttonOrder[DwtDialog.ALIGN_LEFT] = [];
	buttonOrder[DwtDialog.ALIGN_CENTER] = [];
	buttonOrder[DwtDialog.ALIGN_RIGHT] = [];
	if (standardButtons || extraButtons) {
		this._buttonDesc = {};
		if (standardButtons && standardButtons.length) {
			this._initialEnterButtonId = this._enterButtonId = standardButtons[0];
			for (var i = 0; i < standardButtons.length; i++) {
				var buttonId = standardButtons[i];
				this._buttonList.push(buttonId);
				var align = DwtDialog.ALIGN[buttonId];
				if (align) {
					buttonOrder[align].push(buttonId);
				}
				// creating standard button descriptors on file read didn't work, so we create them here
				this._buttonDesc[buttonId] = new DwtDialog_ButtonDescriptor(buttonId, AjxMsg[DwtDialog.MSG_KEY[buttonId]], align);
			}
			// set standard callbacks
			this._resetCallbacks();
		}
		if (extraButtons && extraButtons.length) {
			if (!this._enterButtonId) {
				this._initialEnterButtonId = this._enterButtonId = extraButtons[0];
			}
			for (var i = 0; i < extraButtons.length; i++) {
				var buttonId = extraButtons[i].id;
				this._buttonList.push(buttonId);
				var align = extraButtons[i].align;
				if (align) {
					buttonOrder[align].push(buttonId);
				}
				this._buttonDesc[buttonId] = extraButtons[i];
			}
		}
	}

	// get button IDs
	this._buttonElementId = {};
	for (var i = 0; i < this._buttonList.length; i++) {
		var buttonId = this._buttonList[i];
		//this._buttonElementId[this._buttonList[i]] = params.id + "_button" + buttonId + "_cell";
		this._buttonElementId[buttonId] = this._buttonDesc[buttonId].label? this._buttonDesc[buttonId].label + "_" + Dwt.getNextId():Dwt.getNextId();
	}

	DwtBaseDialog.call(this, params);

	// set up buttons
	this._button = {};
	for (var i = 0; i < this._buttonList.length; i++) {
		var buttonId = this._buttonList[i];
		var b = this._button[buttonId] = new DwtButton({parent:this,id:this._htmlElId+"_button"+buttonId});
		b.setText(this._buttonDesc[buttonId].label);
		b.buttonId = buttonId;
		b.addSelectionListener(new AjxListener(this, this._buttonListener));
		var el = document.getElementById(this._buttonElementId[buttonId]);
		if (el) {
			el.appendChild(b.getHtmlElement());
		}
	}
	// add to tab group, in order
	var list = buttonOrder[DwtDialog.ALIGN_LEFT].concat(buttonOrder[DwtDialog.ALIGN_CENTER], buttonOrder[DwtDialog.ALIGN_RIGHT]);
	for (var i = 0; i < list.length; i++) {
		var button = this._button[list[i]];
		this._tabGroup.addMember(button);		
	}
};

DwtDialog.PARAMS = ["parent", "className", "title", "standardButtons", "extraButtons", "zIndex", "mode", "loc", "id"];

DwtDialog.prototype = new DwtBaseDialog;
DwtDialog.prototype.constructor = DwtDialog;

DwtDialog.prototype.isDwtDialog = true;
DwtDialog.prototype.toString = function() { return "DwtDialog"; };

//
// Constants
//

/**
 * Defines the "left" align.
 */
DwtDialog.ALIGN_LEFT 		= 1;
/**
 * Defines the "right" align.
 */
DwtDialog.ALIGN_RIGHT 		= 2;
/**
 * Defines the "center" align.
 */
DwtDialog.ALIGN_CENTER 		= 3;

// standard buttons, their labels, and their positioning

/**
 * Defines the "Cancel" button.
 */
DwtDialog.CANCEL_BUTTON 	= 1;
/**
 * Defines the "OK" button.
 */
DwtDialog.OK_BUTTON 		= 2;
/**
 * Defines the "Dismiss" button.
 */
DwtDialog.DISMISS_BUTTON 	= 3;
/**
 * Defines the "No" button.
 */
DwtDialog.NO_BUTTON 		= 4;
/**
 * Defines the "Yes" button.
 */
DwtDialog.YES_BUTTON 		= 5;

DwtDialog.LAST_BUTTON 		= 5;

/**
 * Defines "no" buttons. This constant is used to show no buttons.
 */
DwtDialog.NO_BUTTONS 		= 256;
/**
 * Defines "all" buttons. This constant is used to show all buttons.
 */
DwtDialog.ALL_BUTTONS 		= [DwtDialog.CANCEL_BUTTON, DwtDialog.OK_BUTTON, 
							   DwtDialog.DISMISS_BUTTON, DwtDialog.NO_BUTTON, 
							   DwtDialog.YES_BUTTON];

DwtDialog.MSG_KEY = {};
DwtDialog.MSG_KEY[DwtDialog.CANCEL_BUTTON] 	= "cancel";
DwtDialog.MSG_KEY[DwtDialog.OK_BUTTON] 		= "ok";
DwtDialog.MSG_KEY[DwtDialog.DISMISS_BUTTON] = "close";
DwtDialog.MSG_KEY[DwtDialog.NO_BUTTON] 		= "no";
DwtDialog.MSG_KEY[DwtDialog.YES_BUTTON] 	= "yes";

DwtDialog.ALIGN = {};
DwtDialog.ALIGN[DwtDialog.CANCEL_BUTTON]	= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.OK_BUTTON] 		= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.DISMISS_BUTTON] 	= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.NO_BUTTON] 		= DwtDialog.ALIGN_RIGHT;
DwtDialog.ALIGN[DwtDialog.YES_BUTTON] 		= DwtDialog.ALIGN_RIGHT;

/**
 * Defines a "modeless" dialog.
 * 
 * @see	DwtBaseDialog.MODELESS
 */
DwtDialog.MODELESS = DwtBaseDialog.MODELESS;

/**
 * Defines a "modal" dialog.
 * 
 * @see	DwtBaseDialog.MODAL
 */
DwtDialog.MODAL = DwtBaseDialog.MODAL;

//
// Data
//
/**
 * @private
 */
DwtDialog.prototype.CONTROLS_TEMPLATE = "dwt.Widgets#DwtDialogControls";

//
// Public methods
//

DwtDialog.prototype.popdown =
function() {
	DwtBaseDialog.prototype.popdown.call(this);
	if (!this._disposeOnPopDown) {
		this.resetButtonStates();
	}
};

/**
 * This method will pop-up the dialog.
 * 
 * @param	{DwtPoint}	loc		the location
 * @param	{constant}	focusButtonId		the button Id
 */
DwtDialog.prototype.popup =
function(loc, focusButtonId) {
	this._focusButtonId = focusButtonId;
	DwtBaseDialog.prototype.popup.call(this, loc);
};

/**
 * @private
 */
DwtDialog.prototype._resetTabFocus =
function(){
	if (this._focusButtonId) {
		var focusButton = this.getButton(this._focusButtonId);
		this._tabGroup.setFocusMember(focusButton, true);
	} else {
		DwtBaseDialog.prototype._resetTabFocus.call(this);
	}
};

DwtDialog.prototype.reset =
function() {
	this._resetCallbacks();
	this.resetButtonStates();
	DwtBaseDialog.prototype.reset.call(this);
};

/**
 * Sets all buttons back to inactive state.
 * 
 */
DwtDialog.prototype.resetButtonStates =
function() {
	for (b in this._button) {
		this._button[b].setEnabled(true);
		this._button[b].setHovered(false);
	}
	this.associateEnterWithButton(this._initialEnterButtonId);
};

/**
 * Gets a button by the specified Id.
 * 
 * @param	{constant}		buttonId		the button Id
 * @return	{DwtButton}		the button or <code>null</code> if not found
 */
DwtDialog.prototype.getButton =
function(buttonId) {
	return this._button[buttonId];
};

/**
 * Sets the button enabled state.
 * 
 * @param	{constant}		buttonId		the button Id
 * @param	{boolean}		enabled		if <code>true</code>, enable the button; <code>false</code> otherwise
 */
DwtDialog.prototype.setButtonEnabled = 
function(buttonId, enabled) {
	if (!this._button[buttonId]) {
		return;
	}
	this._button[buttonId].setEnabled(enabled);
};

/**
 * Sets the button visible state.
 * 
 * @param	{constant}		buttonId		the button Id
 * @param	{boolean}		enabled		if <code>true</code>, make the button visible; <code>false</code> otherwise
 */
DwtDialog.prototype.setButtonVisible = 
function(buttonId, visible) {
	if (!this._button[buttonId]) {
		return;
	}
	this._button[buttonId].setVisible(visible);
};

/**
 * Gets the button enabled state.
 * 
 * @param	{constant}		buttonId		the button Id
 * @return	{boolean}	<code>true</code> if the button is enabled; <code>false</code> otherwise
 */
DwtDialog.prototype.getButtonEnabled = 
function(buttonId) {
	return this._button[buttonId].getEnabled();
};

/**
 * Registers a callback for a given button. Can be passed an AjxCallback,
 * the params needed to create one, or as a bound function.
 *
 * @param {constant}		buttonId	one of the standard dialog buttons
 * @param {AjxCallback}	func		the callback method
 * @param {Object}		obj			the callback object
 * @param {array}		args		the callback args
 */
DwtDialog.prototype.registerCallback =
function(buttonId, func, obj, args) {
	this._buttonDesc[buttonId].callback = (func && (func.isAjxCallback || (!obj && !args))) ? func : (new AjxCallback(obj, func, args));
};

/**
 * Unregisters a callback for a given button.
 *
 * @param {constant}		buttonId	one of the standard dialog buttons
 */
DwtDialog.prototype.unregisterCallback =
function(buttonId) {
	this._buttonDesc[buttonId].callback = null;
};

/**
 * Sets the given listener as the only listener for the given button.
 *
 * @param {constant}		buttonId	one of the standard dialog buttons
 * @param {AjxListener}			listener	a listener
 */
DwtDialog.prototype.setButtonListener =
function(buttonId, listener) {
	this._button[buttonId].removeSelectionListeners();
	this._button[buttonId].addSelectionListener(listener);
};

/**
 * Sets the enter key listener.
 * 
 * @param	{AjxListener}	listener	a listener
 */
DwtDialog.prototype.setEnterListener =
function(listener) {
	this.removeAllListeners(DwtEvent.ENTER);
	this.addEnterListener(listener);
};

/**
 * Associates the "enter" key with a given button.
 * 
 * @param {constant}		buttonId	one of the standard dialog buttons
 */
DwtDialog.prototype.associateEnterWithButton =
function(id) {
	this._enterButtonId = id;
};

DwtDialog.prototype.getKeyMapName = 
function() {
	return DwtKeyMap.MAP_DIALOG;
};

DwtDialog.prototype.handleKeyAction =
function(actionCode, ev) {
	switch (actionCode) {
		
		case DwtKeyMap.ENTER:
			this.notifyListeners(DwtEvent.ENTER, ev);
			break;
			
		case DwtKeyMap.CANCEL:
			// hitting ESC should act as a cancel
            //TODO: dialog should set ESC/Enter listeners so we don't have to guess the action to take
			var handled = false;
			handled = handled || this._runCallbackForButtonId(DwtDialog.CANCEL_BUTTON);
			handled = handled || this._runCallbackForButtonId(DwtDialog.NO_BUTTON);
			handled = handled || this._runCallbackForButtonId(DwtDialog.DISMISS_BUTTON);

            //don't let OK act as cancel if there are other buttons
            if (!handled && this._buttonDesc[DwtDialog.OK_BUTTON] && this._buttonList.length == 1) {
                handled = handled || this._runCallbackForButtonId(DwtDialog.OK_BUTTON);
            }
            this.popdown();
			return true;

		case DwtKeyMap.YES:
			if (this._buttonDesc[DwtDialog.YES_BUTTON]) {
				this._runCallbackForButtonId(DwtDialog.YES_BUTTON);
			}
			break;

		case DwtKeyMap.NO:
			if (this._buttonDesc[DwtDialog.NO_BUTTON]) {
				this._runCallbackForButtonId(DwtDialog.NO_BUTTON);
			}
			break;

		default:
			return false;
	}
	return true;
};

//
// Protected methods
//

/**
 * @private
 */
DwtDialog.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtBaseDialog.prototype._createHtmlFromTemplate.call(this, templateId, data);

	var focusId = data.id+"_focus";
	if (document.getElementById(focusId)) {
		this._focusElementId = focusId;
	}
	this._buttonsEl = document.getElementById(data.id+"_buttons");
	if (this._buttonsEl) {
		var html = [];
		var idx = 0;
		this._addButtonsHtml(html,idx);
		this._buttonsEl.innerHTML = html.join("");
	}
};

// TODO: Get rid of these button template methods!
/**
 * @private
 */
DwtDialog.prototype._getButtonsContainerStartTemplate =
function () {
	return "<table role='presentation' width='100%'><tr>";
};

/**
 * @private
 */
DwtDialog.prototype._getButtonsAlignStartTemplate =
function () {
	return "<td align=\"{0}\"><table role='presentation'><tr>";
};

/**
 * @private
 */
DwtDialog.prototype._getButtonsAlignEndTemplate =
function () {
	return "</tr></table></td>";
};

/**
 * @private
 */
DwtDialog.prototype._getButtonsCellTemplate =
function () {
	return "<td id=\"{0}\"></td>";
};

/**
 * @private
 */
DwtDialog.prototype._getButtonsContainerEndTemplate =
function () {
	return  "</tr></table>";
};

/**
 * @private
 */
DwtDialog.prototype._addButtonsHtml =
function(html, idx) {
	if (this._buttonList && this._buttonList.length) {
		var leftButtons = new Array();
		var rightButtons = new Array();
		var centerButtons = new Array();
		for (var i = 0; i < this._buttonList.length; i++) {
			var buttonId = this._buttonList[i];
			switch (this._buttonDesc[buttonId].align) {
				case DwtDialog.ALIGN_RIGHT: 	rightButtons.push(buttonId); break;
				case DwtDialog.ALIGN_LEFT: 		leftButtons.push(buttonId); break;
				case DwtDialog.ALIGN_CENTER:	centerButtons.push(buttonId); break;
			}
		}
		html[idx++] = this._getButtonsContainerStartTemplate();
		
		if (leftButtons.length) {
			html[idx++] = AjxMessageFormat.format(
								  this._getButtonsAlignStartTemplate(),
								  ["left"]);
			for (var i = 0; i < leftButtons.length; i++) {
				var buttonId = leftButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();
		 		html[idx++] = AjxMessageFormat.format(
								  cellTemplate,
								  [this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		if (centerButtons.length){
			html[idx++] = AjxMessageFormat.format(
								this._getButtonsAlignStartTemplate(),
								["center"]);
			for (var i = 0; i < centerButtons.length; i++) {
				var buttonId = centerButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();				
		 		html[idx++] = AjxMessageFormat.format(
								cellTemplate,
								[this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		if (rightButtons.length) {
			html[idx++] = AjxMessageFormat.format(
								this._getButtonsAlignStartTemplate(),
								["right"]);
			for (var i = 0; i < rightButtons.length; i++) {
				var buttonId = rightButtons[i];
				var cellTemplate = this._buttonDesc[buttonId].cellTemplate ? 
					this._buttonDesc[buttonId].cellTemplate : this._getButtonsCellTemplate();				

		 		html[idx++] = AjxMessageFormat.format(cellTemplate,
													[this._buttonElementId[buttonId]]);
		 	}
			html[idx++] = this._getButtonsAlignEndTemplate();
		}
		html[idx++] = this._getButtonsContainerEndTemplate();
	}	
	return idx;
};

/**
 * Button listener that checks for callbacks.
 * 
 * @private
 */
DwtDialog.prototype._buttonListener =
function(ev, args) {
	var obj = DwtControl.getTargetControl(ev);
	var buttonId = (obj && obj.buttonId) || this._enterButtonId;
	if (buttonId) {
		this._runCallbackForButtonId(buttonId, args);
	}
};

/**
 * @private
 */
DwtDialog.prototype._runCallbackForButtonId =
function(id, args) {
	var buttonDesc = this._buttonDesc[id];
	var callback = buttonDesc && buttonDesc.callback;
	if (!callback) {
		return false;
	}
	args = (args instanceof Array) ? args : [args];
	callback.run.apply(callback, args);
	return true;
};

/**
 * @private
 */
DwtDialog.prototype._runEnterCallback =
function(args) {
	if (this._enterButtonId && this.getButtonEnabled(this._enterButtonId)) {
		this._runCallbackForButtonId(this._enterButtonId, args);
	}
};

/**
 * Default callbacks for the standard buttons.
 * 
 * @private
 */
DwtDialog.prototype._resetCallbacks =
function() {
	if (this._buttonDesc) {
		for (var i = 0; i < DwtDialog.ALL_BUTTONS.length; i++) {
			var id = DwtDialog.ALL_BUTTONS[i];
			if (this._buttonDesc[id])
				this._buttonDesc[id].callback = new AjxCallback(this, this.popdown);
		}
	}
};

//
// Classes
//

/**
 * @class
 * This class represents a button descriptor.
 * 
 * @param	{string}	id		the button Id
 * @param	{string}	label		the button label
 * @param	{constant}	align		the alignment
 * @param	{AjxCallback}	callback		the callback
 * @param	{string}	cellTemplate		the template
 */
DwtDialog_ButtonDescriptor = function(id, label, align, callback, cellTemplate) {
	this.id = id;
	this.label = label;
	this.align = align;
	this.callback = callback;
	this.cellTemplate = cellTemplate;
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtToolTip")) {
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
 * Singleton tooltip class.
 */
DwtToolTip = function(shell, className, dialog) {

	if (arguments.length == 0) { return; }

	this.shell = shell;
	this._dialog = dialog;
	this._poppedUp = false;
	this._div = document.createElement("div");
	this._div.className = className || "DwtToolTip";
	this._div.style.position = DwtControl.ABSOLUTE_STYLE;
	this.shell.getHtmlElement().appendChild(this._div);
	Dwt.setZIndex(this._div, Dwt.Z_HIDDEN);
	Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);

	this._eventMgr = new AjxEventMgr();

    // create html
    // NOTE: This id is ok because there's only ever one instance of a tooltip
    var templateId = "dwt.Widgets#DwtToolTip";
    this._div.innerHTML = AjxTemplate.expand(templateId);

    var params = AjxTemplate.getParams(templateId);
    this._offsetX = (params.width != null) ? Number(params.width) : DwtToolTip.POPUP_OFFSET_X;
    this._offsetY = (params.height != null) ? Number(params.height) : DwtToolTip.POPUP_OFFSET_Y;

    // save reference to content div
    this._contentDiv = document.getElementById("tooltipContents");

    Dwt.setHandler(this._div, DwtEvent.ONMOUSEOVER, AjxCallback.simpleClosure(this._mouseOverListener, this));
    Dwt.setHandler(this._div, DwtEvent.ONMOUSEOUT, AjxCallback.simpleClosure(this._mouseOutListener, this));

	var events = [DwtEvent.ONCLICK,DwtEvent.ONDBLCLICK,DwtEvent.ONMOUSEDOWN,DwtEvent.ONMOUSEENTER,DwtEvent.ONMOUSELEAVE,DwtEvent.ONMOUSEMOVE,DwtEvent.ONMOUSEUP,DwtEvent.ONMOUSEWHEEL,DwtEvent.ONSCROLL];
	for (var i=0; i<events.length; i++) {
		var event = events[i];
    	Dwt.setHandler(this._div, event, AjxCallback.simpleClosure(this.notifyListeners, this, [event]));
	}
};

DwtToolTip.prototype.isDwtToolTip = true;
DwtToolTip.prototype.toString = function() { return "DwtToolTip"; };

//
// Constants
//

DwtToolTip.TOOLTIP_DELAY = 750;

DwtToolTip.WINDOW_GUTTER = 5;	// space to leave between tooltip and edge of shell
DwtToolTip.POPUP_OFFSET_X = 5;	// default horizontal offset from control
DwtToolTip.POPUP_OFFSET_Y = 5;	// default vertical offset from control

//
// Data
//

//
// Public methods
//

DwtToolTip.prototype.getContent =
function() {
    return this._div.innerHTML;
};

DwtToolTip.prototype.setContent =
function(content, setInnerHTML) {
	this._content = content;
	if(setInnerHTML) {
        this._contentDiv.innerHTML = this._content;
    }
};

/**
 * Shows the tooltip. By default, its position will be relative to the location of the
 * cursor when the mouseover event happened. Alternatively, the control that generated
 * the tooltip can be passed in, and the tooltip will be positioned relative to it. If
 * the control is a large composite control (eg a DwtListView), the hover event can be
 * passed so that the actual target of the event can be found.
 * 
 * @param {number}			x					X-coordinate of cursor
 * @param {number}			y					Y-coordinate of cursor
 * @param {boolean}			skipInnerHTML		if true, do not copy content to DOM
 * @param {boolean}			popdownOnMouseOver	if true, hide tooltip on mouseover
 * @param {DwtControl}		obj					control that tooltip is for (optional)
 * @param {DwtHoverEvent}	hoverEv				hover event (optional)
 * @param {AjxCallback}		popdownListener		callback to run when tooltip pops down
 */
DwtToolTip.prototype.popup = 
function(x, y, skipInnerHTML, popdownOnMouseOver, obj, hoverEv, popdownListener) {
	this._hovered = false;
    if (this._popupAction) {
        AjxTimedAction.cancelAction(this._popupAction);
        this._popupAction = null;
    }
	// popdownOnMouseOver may be true to pop down the tooltip if the mouse hovers over the tooltip. Optionally,
	// it can be an AjxCallback that will be called after popping the tooltip down.
    this._popdownOnMouseOver = popdownOnMouseOver;
	// popdownListener is always called after popping the tooltip down, regardless of what called the popdown
    this._popdownListener = popdownListener;
    if (this._content != null) {
		if(!skipInnerHTML) {
            this._contentDiv.innerHTML = this._content;
        }

		this._popupAction = new AjxTimedAction(this, this._positionElement, [x, y, obj, hoverEv]);
		AjxTimedAction.scheduleAction(this._popupAction, 5);
	}
};

/*
* setSticky allows making the tooltip not to popdown. 
* IMPORTANT: Tooltip is singleton inside Zimbra i.e. only one instance of tooltip is reused by all objects. 
* So, it is very important for the code setting tooltip to sticky to have some mechanism to close the tooltip by itself. 
* Like have a close-button inside tooltip and when clicked, should set the setSticky(false) and then close the tooltip.
*
* If setSticky(true) is called, _poppedUp is set to false, which is essentially pretending the tooltip is not
* up. In that case, a call to popdown will not close the tooltip. And that means tooltip will stay up even if some other
* code path calls popdown on the singleton tooltip.
*
*/
DwtToolTip.prototype.setSticky = 
function(bool) {
	this._poppedUp = !bool;
};

DwtToolTip.prototype.popdown = 
function() {
    this._popdownOnMouseOver = false;
	this._hovered = false;
    if (this._popupAction) {
        AjxTimedAction.cancelAction(this._popupAction);
        this._popupAction = null;
    }
	if (this._content != null && this._poppedUp) {
		Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		this._poppedUp = false;
		if (this._popdownListener instanceof AjxCallback) {
			this._popdownListener.run();
		}
		this._popdownListener = null;
	}
};

//
// Protected methods
//

// Positions the tooltip relative to the base element based on vertical and horizontal offsets.
DwtToolTip.prototype._positionElement = 
function(startX, startY, obj, hoverEv) {
	
    this._popupAction = null;
	
	var wdSize = DwtShell.getShell(window).getSize();
	var wdWidth = wdSize.x, wdHeight = wdSize.y;

	var tooltipX, tooltipY, baseLoc;
	var baseEl = obj && obj.getTooltipBase(hoverEv);
	if (baseEl) {
		baseLoc = Dwt.toWindow(baseEl);
		var baseSz = Dwt.getSize(baseEl);
		tooltipX = baseLoc.x + this._offsetX;
		tooltipY = baseLoc.y + baseSz.y + this._offsetY;
	}
	else {
		tooltipX = startX + this._offsetX;
		tooltipY = startY + this._offsetY;
	}

	var popupSize = Dwt.getSize(this._div);
	var popupWidth = popupSize.x, popupHeight = popupSize.y;

	// check for sufficient room to the right
	if (tooltipX + popupWidth > wdWidth - DwtToolTip.WINDOW_GUTTER) {
		tooltipX = wdWidth - DwtToolTip.WINDOW_GUTTER - popupWidth;
	}
	// check for sufficient room below
	if (tooltipY + popupHeight > wdHeight - DwtToolTip.WINDOW_GUTTER) {
		tooltipY = (baseLoc ? baseLoc.y : tooltipY) - this._offsetY - popupHeight;
	}

	Dwt.setLocation(this._div, tooltipX, tooltipY);
	var zIndex = this._dialog ? this._dialog.getZIndex() + Dwt._Z_INC : Dwt.Z_TOOLTIP;
	Dwt.setZIndex(this._div, zIndex);
    this._poppedUp = true;
};

DwtToolTip.prototype._mouseOverListener = 
function(ev) {
	this._hovered = true;
    if (this._popdownOnMouseOver && this._poppedUp) {
        var callback = (this._popdownOnMouseOver.isAjxCallback || AjxUtil.isFunction(this._popdownOnMouseOver)) ? this._popdownOnMouseOver : null;
        this.popdown();
        if (callback) {
            callback.run();
		}
    }
	this.notifyListeners(DwtEvent.ONMOUSEOVER);
};

DwtToolTip.prototype._mouseOutListener = 
function(ev) {
	ev = DwtUiEvent.getEvent(ev, this._div)
	var location = Dwt.toWindow(this._div);
	var size = Dwt.getSize(this._div);
	// We sometimes get mouseover events even though the cursor is inside the tooltip, so double-check before popping down
	if (ev.clientX <= location.x || ev.clientX >= (location.x + size.x) || ev.clientY <= location.y || ev.clientY >= (location.y + size.y)) {
		this.popdown();
		this.notifyListeners(DwtEvent.ONMOUSEOUT);
	}
};

DwtToolTip.prototype.getHovered = 
function() {
	return this._hovered;
};


// The com_zimbra_email zimlet wants to put a listener on our mouseout event, but overwriting the existing handler is a no-no
// and we actually only want that event when the double-check above succeeds. Let API users add event listeners in a more clean way.
DwtToolTip.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

DwtToolTip.prototype.setListener =
function(eventType, listener, index) {
	this.removeAllListeners(eventType);
	return this._eventMgr.addListener(eventType, listener, index);
};

DwtToolTip.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};

DwtToolTip.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

DwtToolTip.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

DwtToolTip.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

}
if (AjxPackage.define("ajax.dwt.widgets.DwtHoverMgr")) {
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
 * 
 * @private
 */
DwtHoverMgr = function() {
	this._hoverOverAction = new AjxTimedAction(this, this._notifyHoverOver);
	this._hoverOutAction = new AjxTimedAction(this, this._notifyHoverOut);
	this._ignoreHoverOverOnClickAction = new AjxTimedAction(this, this._resetIgnoreHoverOverOnClick);
};

DwtHoverMgr.prototype.isDwtHoverMgr = true;
DwtHoverMgr.prototype.toString = function() { return "DwtHoverMgr"; };

// Data


DwtHoverMgr.prototype._hoverOverDelay = 750;
DwtHoverMgr.prototype._hoverOverActionId = -1;

DwtHoverMgr.prototype._hoverOutDelay = 50;
DwtHoverMgr.prototype._ignoreHoverOverOnClickDelay = 750;
DwtHoverMgr.prototype._hoverOutActionId = -1;

DwtHoverMgr.prototype._isHovering = false;

// Public methods

DwtHoverMgr.prototype.setHoverObject =
function(object) {
	this._hoverObject = object;
};

DwtHoverMgr.prototype.getHoverObject =
function() {
	return this._hoverObject;
};

DwtHoverMgr.prototype.reset =
function() {
	this._hoverObject = null;
	this._hoverOverDelay = DwtHoverMgr.prototype._hoverOverDelay;
	this._hoverOverData = null;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	this._hoverOverActionId = -1;
	this._hoverOverListener = null;

	this._hoverOutDelay = DwtHoverMgr.prototype._hoverOutDelay;
	this._hoverOutData = null;
	if (this._hoverOutActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOutActionId);
		this._notifyHoverOut();
	}
	this._hoverOutActionId = -1;
	this._hoverOutListener = null;
};

DwtHoverMgr.prototype.isHovering =
function() {
	return this._isHovering;
};

DwtHoverMgr.prototype.setHoverOverDelay =
function(delay) {
	this._hoverOverDelay = delay;
};

DwtHoverMgr.prototype.setHoverOverData =
function(data) {
	this._hoverOverData = data;
};

DwtHoverMgr.prototype.setHoverOverListener =
function(listener) {
	this._hoverOverListener = listener;
};

DwtHoverMgr.prototype.setHoverOutDelay =
function(delay) {
	this._hoverOutDelay = delay;
};

DwtHoverMgr.prototype.setHoverOutData =
function(data) {
	this._hoverOutData = data;
};

DwtHoverMgr.prototype.setHoverOutListener =
function(listener) {
	this._hoverOutListener = listener;
};


DwtHoverMgr.prototype.ignoreHoverOverOnClick =
function() {
	this._ignoreHoverOverOnClick = true;
	AjxTimedAction.scheduleAction(this._ignoreHoverOverOnClickAction, this._ignoreHoverOverOnClickDelay);
};

DwtHoverMgr.prototype._resetIgnoreHoverOverOnClick =
function() {
	this._ignoreHoverOverOnClick = false;
};

DwtHoverMgr.prototype.hoverOver =
function(x, y) {

	if (this._ignoreHoverOverOnClick) { return; }
	
	this._isHovering = true;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	this._hoverOverAction.args = [x, y];
	this._hoverOverActionId = AjxTimedAction.scheduleAction(this._hoverOverAction, this._hoverOverDelay);
};

DwtHoverMgr.prototype.hoverOut =
function() {
	this._isHovering = false;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	if (this._hoverOutActionId == -1) {
		if (this._hoverOutDelay > 0) {
			this._hoverOutActionId = AjxTimedAction.scheduleAction(this._hoverOutAction, this._hoverOutDelay);
		}
		else {
			this._notifyHoverOut();
		}
	}
};

// Protected methods

DwtHoverMgr.prototype._notifyHoverOver =
function() {
	this._hoverOverActionId = -1;
	if (this._hoverOverListener != null) {
		var x = this._hoverOverAction.args[0];
		var y = this._hoverOverAction.args[1];
		var event = new DwtHoverEvent(DwtEvent.HOVEROVER, this._hoverOverDelay, this._hoverOverData, x, y);
		this._hoverOverListener.handleEvent(event);
	}
};

DwtHoverMgr.prototype._notifyHoverOut =
function() {
	this._hoverOutActionId = -1;
		if (this._hoverOutListener != null) {
		var event = new DwtHoverEvent(DwtEvent.HOVEROUT, this._hoverOutDelay, this._hoverOutData);
		this._hoverOutListener.handleEvent(event);
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtLabel")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file defines a label.
 *
 */

/**
 * Creates a label.
 * @constructor
 * @class
 * This class represents a label, which consists of an image and/or text. It is used
 * both as a concrete class and as the base class for {@link DwtButton}. The label
 * components are managed within a table. The label can be enabled or disabled, which are reflected in 
 * its display. A disabled label looks greyed out.
 * 
 * <h4>CSS</h4>
 * <ul>
 * <li><code>.className table</code> - the label table</li>
 * <li><code>.className .Icon</code> - class name for the icon image cell</li>
 * <li><code>.className .Text</code> - enabled text cell</li>
 * <li><code>.className .DisabledText</code> - disabled text cell</li>
 * </ul>
 * 
 * <h4>Keyboard Actions</h4>
 * None
 * 
 * <h4>Events</h4>
 * None
 * 
 * @author Ross Dargahi
 * 
 * @param {hash}		params		the hash of parameters
 * @param	{DwtComposite}	params.parent	the parent widget
 * @param	{constant}	params.style		the label style: May be one of: {@link DwtLabel.IMAGE_LEFT} 
 * 											or {@link DwtLabel.IMAGE_RIGHT} arithmetically or'd (|) with  one of:
 * 											{@link DwtLabel.ALIGN_LEFT}, {@link DwtLabel.ALIGN_CENTER}, or {@link DwtLabel.ALIGN_LEFT}
 * 											The first determines were in the label the icon will appear (if one is set), the second
 * 											determine how the content of the label will be aligned. The default value for
 * 											this parameter is: {@link DwtLabel.IMAGE_LEFT} | {@link DwtLabel.ALIGN_CENTER}
 * @param	{string}	params.className	the CSS class
 * @param	{constant}	params.posStyle		the positioning style (see {@link DwtControl})
 * @param	{string}	params.id			the to use for the control HTML element
 * @param	{number}	params.index 		the index at which to add this control among parent's children
 *        
 * @extends DwtComposite
 */
DwtLabel = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtLabel.PARAMS);
	
	params.className = params.className || "DwtLabel";
	DwtComposite.call(this, params);

	/**
	 * The label style. See the constructor for more info.
	 */
	this._style = params.style || (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_CENTER);
	
	/**
	 * The label text background color.
	 */
	this._textBackground = null;
	
	/**
	 * The label text foreground color.
	 */
	this._textForeground = null;

    this._createHtml(params.template);
    //MOW:  this.setCursor("default");
}

DwtLabel.PARAMS = ["parent", "style", "className", "posStyle", "id", "index"];

DwtLabel.prototype = new DwtComposite;
DwtLabel.prototype.constructor = DwtLabel;

DwtLabel.prototype.isFocusable = true;

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtLabel.prototype.toString =
function() {
	return "DwtLabel";
}

//
// Constants
//

// display styles
/**
 * Defines the "left" align image (i.e. align to the left of text, if both present).
 */
DwtLabel.IMAGE_LEFT = 1;

/**
 * Defines the "right" align image (i.e. align to the right of text, if both present).
 */
DwtLabel.IMAGE_RIGHT = 2;

/**
 * Defines both "right" and "left" align images (i.e. align to the left and to the right of text, if all present).
 */
DwtLabel.IMAGE_BOTH = 4;

/**
 * Defines the "left" align label.
 */
DwtLabel.ALIGN_LEFT = 8;

/**
 * Defines the "right" align label.
 */
DwtLabel.ALIGN_RIGHT = 16;

/**
 * Defines the "center" align label.
 */
DwtLabel.ALIGN_CENTER = 32;

/**
 * Defines the last style label (used for subclasses).
 * @private
 */
DwtLabel._LAST_STYLE = 32;

/**
 * Defines the "left" side icon
 */
DwtLabel.LEFT = "left";

/**
 * Defines the "right" side icon
 */
DwtLabel.RIGHT = "right";

//
// Data
//

DwtLabel.prototype.TEMPLATE = "dwt.Widgets#ZLabel";

//
// Public methods
//

/**
 * Disposes of the label.
 * 
 */
DwtLabel.prototype.dispose =
function() {
	delete this._dropDownEl;
	delete this._iconEl;
	delete this._textEl;
	DwtControl.prototype.dispose.call(this);
};

/**
 * Sets the enabled/disabled state of the label. A disabled label may have a different
 * image, and greyed out text. This method overrides {@link DwtControl#setEnabled}.
 *
 * @param {boolean} enabled 		if <code>true</code>, set the label as enabled
 */
DwtLabel.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtControl.prototype.setEnabled.call(this, enabled);
		var direction = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
		this.__imageInfo = this.__imageInfo || {};
		this.__setImage(this.__imageInfo[direction]);
	}
}

/**
 * Gets the current image info.
 *
 * @param	{string}	direction		position of the image
 *
 * @return	{string}	the image info
 */
DwtLabel.prototype.getImage =
function(direction) {
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	return this.__imageInfo[direction];
}

/**
 * Sets the main (enabled) image. If the label is currently enabled, the image is updated.
 *
 * @param	{string}	imageInfo		the image
 * @param	{string}	direction		position of the image
 * @param	{string}	altText			alternate text for non-visual users
 */
DwtLabel.prototype.setImage =
function(imageInfo, direction, altText) {
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	this.__imageInfo = this.__imageInfo || {};
	this.__imageInfo[direction] = imageInfo;
	this.__setImage(imageInfo, direction, altText);
}

/**
 *
 * Set _iconEl, used for buttons that contains only images
 *
 * @param	htmlElement/DOM node
 * @param	{string}				direction		position of the image
 *
 */
DwtLabel.prototype.setIconEl = function(iconElement, direction) {
	this._iconEl = this._iconEl || {};
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	this._iconEl[direction] =  iconElement;
}

/**
 * Sets the disabled image. If the label is currently disabled, its image is updated.
 *
 * @param	{string}	imageInfo		the image
 * @deprecated		no longer support different images for disabled
 * @see		#setImage
 */
DwtLabel.prototype.setDisabledImage =
function(imageInfo) {
	// DEPRECATED -- we no longer support different images for disabled.
	//	See __setImage() for details.
}

/**
 * Gets the label text.
 * 
 * @return	{string}	the text or <code>null</code> if not set
 */
DwtLabel.prototype.getText =
function() {
	return (this.__text != null) ? this.__text : null;
}

/**
* Sets the label text, and manages the placement and display.
*
* @param {string}	text	the new label text
*/
DwtLabel.prototype.setText = function(text) {

    if (!this._textEl) {
	    return;
    }

    if (text == null || text == "") {
        this.__text = null;
        this._textEl.innerHTML = "";
    }
    else {
		this.__text = text;
        this._textEl.innerHTML = text;
    }

	// Do not set combobox selected value as aria-label
	if (!(this instanceof DwtSelect)) {
		this.setAriaLabel(text);
	}
};

/**
 * Sets the text background.
 * 
 * @param	{string}	color	the background color
 */
DwtLabel.prototype.setTextBackground =
function(color) {
	this._textBackground = color;
    if (this._textEl) {
        this._textEl.style.backgroundColor = color;
    }
}

/**
 * Sets the text foreground.
 * 
 * @param	{string}	color	the foreground color
 */
DwtLabel.prototype.setTextForeground =
function(color) {
	this._textForeground = color;
    if (this._textEl) {
		this._textEl.style.color = color;
    }
}

/**
 * Sets the align style.
 * 
 * @param		{constant}		alignStyle		the align style (see {@link DwtControl})
 */
DwtLabel.prototype.setAlign =
function(alignStyle) {
	this._style = alignStyle;

	// reset dom since alignment style may have changed
	var direction = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
	this.__imageInfo = this.__imageInfo || {};
    this.__setImage(this.__imageInfo[direction]);
}

/**
 * Checks if the given style is set as the current label style.
 * 
 * @param	{constant}	style	the style
 * @return	{boolean}	<code>true</code> if the style is set
 */
DwtLabel.prototype.isStyle = function(style) {
    return this._style & style;
};

DwtLabel.prototype.getTabGroupMember =
function() {
	// DwtLabel descends from DwtComposite, as some buttons contain nested
	// members; it's a widget, however, and should be directly focusable
	return DwtControl.prototype.getTabGroupMember.apply(this, arguments);
}

//
// Protected methods
//

/**
 * @private
 */
DwtLabel.prototype._createHtml = function(templateId) {
    var data = { id: this._htmlElId };
    this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

/**
 * @private
 */
DwtLabel.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtControl.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._textEl = document.getElementById(data.id+"_title");
};

/**
 * @private
 *
 * @param	{string}	direction		position of the image
 */
DwtLabel.prototype._getIconEl = function(direction) {
    var _dir = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
    direction = typeof direction === 'boolean' ? _dir : (direction || _dir);    // fix for Bug 90130
	// MOW: getting the proper icon element on demand rather than all the time for speed
	this._iconEl = this._iconEl || {};
	return this._iconEl[direction] ||
		(this._iconEl[direction] = document.getElementById(this._htmlElId+"_"+direction+"_icon"));
};

//
// Private methods
//

/**
 * Set the label's image, and manage its placement.
 *
 * @private
 *
 * @param	{string}	imageInfo		the image
 * @param	{string}	direction		position of the image
 * @param	{string}	altText			alternate text for non-visual users
 */
DwtLabel.prototype.__setImage =
function(imageInfo, direction, altText) {
	this.__altText = altText || this.__altText;

	var iconEl = this._getIconEl(direction);
	if (iconEl) {
		if (imageInfo) {
			AjxImg.setImage(iconEl, imageInfo, null, !this._enabled, null, this.__altText);

			// set a ZHasRightIcon or ZHasLeftIcon on the outer element, depending on which we set
			var elementClass = (this._style & DwtLabel.IMAGE_RIGHT ? "ZHasRightIcon" : "ZHasLeftIcon");
			Dwt.addClass(this.getHtmlElement(), elementClass);
		} else {
			iconEl.innerHTML = "";
		}
	}
};

// Accessibility
DwtLabel.prototype.setAriaLabel = function(text) {

	// assign the ARIA label directly; we want it to override the tooltip, if any
	if (!this.hasAttribute('aria-labelledby')) {
		if (text) {
			this.setAttribute('aria-label', text);
		} else {
			this.removeAttribute('aria-label');
		}
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtButton")) {
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
 * This file defines a button.
 *
 */

/**
 * Creates a button.
 * @class
 * This class represents a button, which is basically a smart label that can handle
 * various UI events. It knows when it has been hovered (the mouse is over it),
 * when it is active (mouse down), and when it has been pressed (mouse up).
 * In addition to a label's image and/or text, a button may have a dropdown menu.
 * <p>
 * There are several different types of button:
 * <ul>
 * <li><i>Push</i> - This is the standard push button</li>
 * <li><i>Toggle</i> - This is a button that exhibits selectable behaviour when clicked
 * 		e.g. on/off. To make a button selectable style "or" {@link DwtButton.SELECT_STYLE}
 * 		to the constructor's style parameter</li>
 * <li><i>Menu</i> - By setting a mene via the {@link #setMenu} method a button will become
 * 		a drop down or menu button.</li>
 * </ul>
 *
 * <h4>CSS</h4>
 * <ul>
 * <li><i>className</i>-hover - hovered style</li>
 * <li><i>className</i>-active - mouse down style</li>
 * <li><i>className</i>-selected - permanently down style</li>
 * <li><i>className</i>-disabled - disabled style</li>
 * </ul>
 *
 * <h4>Keyboard Actions</h4>
 * <ul>
 * <li>{@link DwtKeyMap.SELECT} - triggers the button</li>
 * <li>{@link DwtKeyMap.SUBMENU} - display's the button's submenu if one is set</li>
 * </ul>
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}	params.parent	the parent widget
 * @param {constant}	params.style		the button style
 * @param {string}	params.className		the CSS class
 * @param {constant}	params.posStyle		the positioning style
 * @param {DwtButton.ACTION_MOUSEUP|DwtButton.ACTION_MOUSEDOWN}	params.actionTiming	if {@link DwtButton.ACTION_MOUSEUP}, then the button is triggered
 *											on mouseup events, else if {@link DwtButton.ACTION_MOUSEDOWN},
 * 											then the button is triggered on mousedown events
 * @param {string}	params.id		the id to use for the control HTML element
 * @param {number}	params.index 		the index at which to add this control among parent's children
 * @param {hash}	params.listeners		a hash of event listeners
 *        
 * @extends		DwtLabel
 */
DwtButton = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtButton.PARAMS);
	
	params.className = params.className || "ZButton";
	DwtLabel.call(this, params);

	var parent = params.parent;
	if (!parent._hasSetMouseEvents || AjxEnv.isIE) {
		this._setMouseEvents();
	}
	
	var events;
	if (parent._hasSetMouseEvents) {
		events = AjxEnv.isIE ? [DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE] : [];
	} else {
		events = AjxEnv.isIE
			? [DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE]
			: [DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT];
		events.push(DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONCLICK);
	}
	if (events && events.length) {
		this._setEventHdlrs(events);
	}
	this._listeners = params.listeners || DwtButton._listeners;
	this._addMouseListeners();
	this._ignoreInternalOverOut = true;
	
	this._dropDownEvtMgr = new AjxEventMgr();

	this._selected = false;

	this._actionTiming = params.actionTiming || DwtButton.ACTION_MOUSEUP;
	this.__preventMenuFocus = null;
	this._menuPopupStyle = DwtButton.MENU_POPUP_STYLE_BELOW;
};

DwtButton.prototype = new DwtLabel;
DwtButton.prototype.constructor = DwtButton;

DwtButton.prototype.isDwtButton = true;
DwtButton.prototype.toString = function() { return "DwtButton"; };

DwtButton.prototype.role = 'button';

//
// Constants
//
DwtButton.PARAMS = ["parent", "style", "className", "posStyle", "actionTiming", "id", "index", "listeners"];
DwtButton.TOGGLE_STYLE = DwtLabel._LAST_STYLE * 2; // NOTE: These must be powers of 2 because we do bit-arithmetic to check the style.
DwtButton.ALWAYS_FLAT = DwtLabel._LAST_STYLE * 4;
DwtButton._LAST_STYLE = DwtButton.ALWAYS_FLAT;

DwtButton.ACTION_MOUSEUP = 1;
DwtButton.ACTION_MOUSEDOWN = 2; // No special appearance when hovered or active

DwtButton.NOTIFY_WINDOW = 500;  // Time (in ms) during which to block additional clicks from being processed

DwtButton.MENU_POPUP_STYLE_BELOW	= "BELOW";		// menu pops up just below the button (default)
DwtButton.MENU_POPUP_STYLE_ABOVE	= "ABOVE";		// menu pops up above the button
DwtButton.MENU_POPUP_STYLE_RIGHT	= "RIGHT";		// menu pops up below the button, with right edges aligned
DwtButton.MENU_POPUP_STYLE_CASCADE	= "CASCADE";	// menu pops up to right of the button

DwtButton.MOUSE_EVENTS = [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP];

if (AjxEnv.isIE) {
	DwtButton.MOUSE_EVENTS.push(DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE);
} else {
	DwtButton.MOUSE_EVENTS.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
}

//
// Data
//
DwtButton.prototype.TEMPLATE = "dwt.Widgets#ZButton";

//
// Public methods
//

/**
 * Disposes of the button.
 * 
 */
DwtButton.prototype.dispose =
function() {
	if (this._menu && this._menu.isDwtMenu && (this._menu.parent == this)) {
		this._menu.dispose();
		this._menu = null;
	}
	DwtLabel.prototype.dispose.call(this);
};

/**
 * Adds a listener to be notified when the button is pressed.
 *
 * @param {AjxListener}	listener	the listener
 * @param {number}	index		the index at which to add listener
 */
DwtButton.prototype.addSelectionListener =
function(listener, index) {
	this.addListener(DwtEvent.SELECTION, listener, index);
};

/**
 * Removes a selection listener.
 *
 * @param {AjxListener}		listener	the listener to remove
 */
DwtButton.prototype.removeSelectionListener =
function(listener) {
	this.removeListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes all the selection listeners.
 */
DwtButton.prototype.removeSelectionListeners =
function() {
	this.removeAllListeners(DwtEvent.SELECTION);
};

/**
 * Adds a listener to be notified when the dropdown arrow is pressed.
 *
 * @param {AjxListener}		listener	the listener
 */
DwtButton.prototype.addDropDownSelectionListener =
function(listener) {
	return this._dropDownEvtMgr.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a dropdown selection listener.
 *
 * @param {AjxListener}		listener	the listener to remove
 */
DwtButton.prototype.removeDropDownSelectionListener =
function(listener) {
	this._dropDownEvtMgr.removeListener(DwtEvent.SELECTION, listener);
};

// defaults for drop down images (set here once on prototype rather than on each button instance)
DwtButton.prototype._dropDownImg 	= "SelectPullDownArrow";
DwtButton.prototype._dropDownDepImg	= "SelectPullDownArrow";
DwtButton.prototype._dropDownHovImg = "SelectPullDownArrowHover";

/**
 * Sets the dropdown images.
 * 
 * @param	{string}	enabledImg		the enabled image
 * @param	{string}	disImg		the disabled image
 * @param	{string}	hovImg		the hover image
 * @param	{string}	depImg		the depressed image
 */
DwtButton.prototype.setDropDownImages =
function (enabledImg, disImg, hovImg, depImg) {
	this._dropDownImg = enabledImg;
	this._dropDownHovImg = hovImg;
	this._dropDownDepImg = depImg;
};

/**
 * Sets the Drop Down Hover Image
 */
DwtButton.prototype.setDropDownHovImage =
function(hovImg) {
    this._dropDownHovImg = hovImg;    
}

/**
 * @private
 */
DwtButton.prototype._addMouseListeners =
function() {
	AjxUtil.foreach(DwtButton.MOUSE_EVENTS, (function(event) {
		this.addListener(event, this._listeners[event]);
	}).bind(this));
};

/**
 * @private
 */
DwtButton.prototype._removeMouseListeners =
function() {
	AjxUtil.foreach(DwtButton.MOUSE_EVENTS, (function(event) {
		this.removeListener(event, this._listeners[event]);
	}).bind(this));
};

/**
 * Sets the display state.
 * 
 * @param	{string}	state		the display state
 * @param	{boolean}	force		if <code>true</code>, force the state change
 * @see		DwtControl
 */
DwtButton.prototype.setDisplayState =
function(state, force) {
    if (this._selected && state != DwtControl.SELECTED && !force) {
        state = [ DwtControl.SELECTED, state ].join(" ");
    }
    DwtLabel.prototype.setDisplayState.call(this, state);
};

/**
 * Sets the enabled/disabled state of the button. A disabled button may have a different
 * image, and greyed out text. The button (and its menu) will only have listeners if it
 * is enabled.
 *
 * @param {boolean}	enabled			if <code>true</code>, enable the button
 *
 */
DwtButton.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtLabel.prototype.setEnabled.call(this, enabled); // handles image/text
        if (enabled) {
			// bug fix #36253 - HACK for IE. ARGH!!!
			var el = (AjxEnv.isIE) ? this.getHtmlElement().firstChild : null;
			if (el) {
				var cname = el.className;
				el.className = "";
				el.className = cname;
			}
			this._addMouseListeners();
			// set event handler for pull down menu if applicable
			if (this._menu) {
				this._setDropDownCellMouseHandlers(true);
                if (this._dropDownEl && this._dropDownImg) {
                    AjxImg.setImage(this._dropDownEl, this._dropDownImg);
                }
            }

		} else {
			this._removeMouseListeners();
			// remove event handlers for pull down menu if applicable
			if (this._menu) {
				this._setDropDownCellMouseHandlers(false);
                if (this._dropDownEl && this._dropDownImg) {
                    AjxImg.setDisabledImage(this._dropDownEl, this._dropDownImg);
                }
			}
		}
	}
};

/**
 * Sets the main (enabled) image. If the button is currently enabled, the image is updated.
 * 
 * @param	{string}	imageInfo		the image
 */
DwtButton.prototype.setImage =
function(imageInfo, direction) {
	// This button is set to not show image. Doing it here is safer against bugs resulting from dynamically modified images and text such as teh case of spam vs. "no spam".
	// This way you don't have to worry in that code whether we show image or not (Which could change for example as it does in this bug when moving the button to the main buttons).
	if (this.whatToShow && !this.whatToShow.showImage) {
		return;
	}
	DwtLabel.prototype.setImage.apply(this, arguments);
	this._setMinWidth();
};

/**
 * Sets the text.
 * 
 * @param	{string}	text		the text
 */
DwtButton.prototype.setText =
function(text) {

	//see explanation in setImage
	if (this.whatToShow && !this.whatToShow.showText) {
		return;
	}
	DwtLabel.prototype.setText.call(this, text);
	this._setMinWidth();
};

/**
 * @private
 */
DwtButton.prototype._setMinWidth =
function() {
	if (this.getText() != null) {
		Dwt.addClass(this.getHtmlElement(), "ZHasText");
	} else {
		Dwt.delClass(this.getHtmlElement(), "ZHasText");
	}
};

/**
 * Sets the hover image.
 * 
 * @param	{string}	hoverImageInfo		the image
 * @param	{string}	direction			position of the image
 */
DwtButton.prototype.setHoverImage =
function (hoverImageInfo, direction) {
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	this._hoverImageInfo = this._hoverImageInfo || {};
	this._hoverImageInfo[direction] = hoverImageInfo;
};

/**
 * Adds a dropdown menu to the button, available through a small down-arrow. If a
 * callback is passed as the dropdown menu, it is called the first time the
 * menu is requested. The callback must return a valid DwtMenu object.
 *
 * @param {hash}				params				hash of params:
 * @param {DwtMenu|AjxCallback}	menu				the dropdown menu or a callback
 * @param {boolean}				shouldToggle		if <code>true</code>, toggle
 * @param {string}				menuPopupStyle		one of DwtButton.MENU_POPUP_STYLE_* (default is BELOW)
 * @param {boolean}				popupAbove			if <code>true</code>, pop up the menu above the button
 * @param {boolean}				popupRight			if <code>true</code>, align the right edge of the menu to the right edge of the button
 */
DwtButton.prototype.setMenu =
function(params) {
	
	params = Dwt.getParams(arguments, DwtButton.setMenuParams, (arguments.length == 1 && arguments[0] && !arguments[0].menu));

    if (params){
	    this._menu = params.menu;
    }

	if (this._menu) {
		// if menu is a callback, wait until it's created to set menu-related properties
		if (this._menu.isDwtMenu) {
			this._shouldToggleMenu = (params.shouldToggle === true);
			if (params.popupAbove) {
				this._menuPopupStyle = DwtButton.MENU_POPUP_STYLE_ABOVE;
			}
			else if (params.popupRight) {
				this._menuPopupStyle = DwtButton.MENU_POPUP_STYLE_RIGHT;
			}
			else {
				this._menuPopupStyle = params.menuPopupStyle || DwtButton.MENU_POPUP_STYLE_BELOW;
			}
			this._menuAdded(this._menu);
		}
		else {
			this._savedMenuParams = params;
		}
        if (this._dropDownEl) {
			Dwt.addClass(this.getHtmlElement(), "ZHasDropDown");
			if (this._dropDownImg) {
            	AjxImg.setImage(this._dropDownEl, this._dropDownImg);
			}

			// set event handler if applicable
			if (this._enabled) {
				this._setDropDownCellMouseHandlers(true);
			}

            if (this._menu.isDwtMenu) {
                this._menu.setAssociatedElementId(this._dropDownEl.id);
            }
		}
		if ((this.__preventMenuFocus != null) && this._menu.isDwtMenu) {
			this._menu.dontStealFocus(this.__preventMenuFocus);
		}
    }
	// removing menu
    else if (this._dropDownEl) {
		Dwt.delClass(this.getHtmlElement(), "ZHasDropDown");
        this._dropDownEl.innerHTML = "";
    }
};
DwtButton.setMenuParams = ["menu", "shouldToggle", "followIconStyle", "popupAbove", "popupRight"];

/**
 * @private
 */
DwtButton.prototype._setDropDownCellMouseHandlers =
function(set) {
	this._dropDownEventsEnabled = set;
};

/**
* Gets the button menu.
*
* @param {boolean}		dontCreate	 if <code>true</code>, the menu will not be lazily created
* @return	{DwtMenu}	the menu or <code>null</code> if menu is not set
*/
DwtButton.prototype.getMenu =
function(dontCreate) {
	if (this._menu && this._menu.isAjxCallback) {
		if (dontCreate) {
			return null;
		}
		var callback = this._menu;
		var params = this._savedMenuParams || {};
		params.menu = callback.run(this);
		this.setMenu(params);
		if ((this.__preventMenuFocus != null) && (this._menu.isDwtMenu)) {
			this._menu.dontStealFocus(this.__preventMenuFocus);
		}
	}
    if (this._menu) {
        this.setAttribute("menuId", this._menu._htmlElId);
    }
    return this._menu;
};

/**
 * Resets the button display to normal (not hovered or active).
 * 
 */
DwtButton.prototype.resetClassName =
function() {
    this.setDisplayState(DwtControl.NORMAL);
};

/**
 * Sets whether actions for this button should occur on mouse up or mouse down.
 *
 * @param	{DwtButton.ACTION_MOUSEDOWN|DwtButton.ACTION_MOUSEUP}		actionTiming		the action timing
 */
DwtButton.prototype.setActionTiming =
function(actionTiming) {
      this._actionTiming = actionTiming;
};

/**
 * Activates/de-activates the button. A button is hovered when the mouse is over it.
 *
 * @param {boolean}	hovered		if <code>true</code>, the button is hovered
 */
DwtButton.prototype.setHovered =
function(hovered) {
    this.setDisplayState(hovered ? DwtControl.HOVER : DwtControl.NORMAL);
};

/**
 * Sets the enabled image
 * 
 * @param	{string}	imageInfo	the image
 */
DwtButton.prototype.setEnabledImage =
function (imageInfo) {
	this._enabledImageInfo = imageInfo;
	this.setImage(imageInfo);
};

/**
 * Sets the depressed image
 * 
 * @param	{string}	imageInfo	the image
 */
DwtButton.prototype.setDepressedImage =
function (imageInfo) {
    this._depressedImageInfo = imageInfo;
};

/**
 * Sets the button as selected.
 * 
 * @param	{boolean}	selected		if <code>true</code>, the button is selected
 */
DwtButton.prototype.setSelected =
function(selected) {
	if (this._selected != selected) {
		this._selected = selected;
        this.setDisplayState(selected ? DwtControl.SELECTED : DwtControl.NORMAL);
    }
};

/**
 * Checks if the button is toggled.
 * 
 * @return	{boolean}	<code>true</code> if toggled
 */
DwtButton.prototype.isToggled =
function() {
	return this._selected;
};

/**
 * Pops-up the button menu (if present).
 * 
 * @param	{DwtMenu}	menu		the menu to use or <code>null</code> to use currently set menu
 */
DwtButton.prototype.popup =
function(menu, event) {
	menu = menu || this.getMenu();

    if (!menu) { return; }

    var parent = menu.parent;
	var parentBounds = parent.getBounds();
	var windowSize = menu.shell.getSize();
	var menuSize = menu.getSize();
	var parentElement = parent.getHtmlElement();
	// since buttons are often absolutely positioned, and menus aren't, we need x,y relative to window
	var parentLocation = Dwt.toWindow(parentElement, 0, 0);
	var leftBorder = (parentElement.style.borderLeftWidth == "") ? 0 : parseInt(parentElement.style.borderLeftWidth);
	var kbGenerated = Boolean(event && DwtKeyEvent.isKeyEvent(event));

	var x;
	if (this._menuPopupStyle == DwtButton.MENU_POPUP_STYLE_RIGHT) {
		x = parentLocation.x + parentBounds.width - menuSize.x;
	}
	else if (this._menuPopupStyle == DwtButton.MENU_POPUP_STYLE_CASCADE) {
		x = parentLocation.x + parentBounds.width;
	}
	else {
		x = parentLocation.x + leftBorder;
		x = ((x + menuSize.x) >= windowSize.x) ? windowSize.x - menuSize.x : x;
	}

	var y;
	if (this._menuPopupStyle == DwtButton.MENU_POPUP_STYLE_ABOVE) {
		y = parentLocation.y - menuSize.y;
	}
	else if (this._menuPopupStyle == DwtButton.MENU_POPUP_STYLE_CASCADE) {
		y = parentLocation.y;
	}
	else {
		var horizontalBorder = (parentElement.style.borderTopWidth == "") ? 0 : parseInt(parentElement.style.borderTopWidth);
		horizontalBorder += (parentElement.style.borderBottomWidth == "") ? 0 : parseInt(parentElement.style.borderBottomWidth);
		y = parentLocation.y + parentBounds.height + horizontalBorder;
	}
	menu.popup(0, x, y, kbGenerated);
	menu.setSelectedItem(0);
};

/**
 * Gets the key map name.
 * 
 * @return	{string}	the key map name
 */
DwtButton.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_BUTTON;
};

/**
 * Handles a key action event.
 * 
 * @param	{constant}		actionCode		the action code (see {@link DwtKeyMap})
 * @param	{DwtEvent}		ev		the event
 * @return	{boolean}		<code>true</code> if the event is handled; <code>false</code> otherwise
 * @see		DwtKeyMap
 */
DwtButton.prototype.handleKeyAction =
function(actionCode, ev) {
	switch (actionCode) {
		case DwtKeyMap.SELECT:
			this._emulateSingleClick();
			break;

		case DwtKeyMap.SUBMENU:
			var menu = this.getMenu();
			if (!menu) return false;
			this._emulateDropDownClick();
			menu.setSelectedItem(0);
			break;
	}

	return true;
};

/**
 * Removes options from drop down menu
 */
DwtButton.prototype.removePullDownMenuOptions =
function() {
    if (this._menu) {
        this._setDropDownCellMouseHandlers(false);
        if (this._dropDownEl && this._dropDownImg) {
            // removes initial down arrow
            AjxImg.setImage(this._dropDownEl, "");
            // removes arrow image set by mouse hover, click, etc.
            this.setDropDownImages("", "", "", "");
        }
    }
};

// Private methods

/**
 * @private
 */
DwtButton.prototype._emulateSingleClick =
function() {
	this.trigger();
	var htmlEl = this.getHtmlElement();
	var p = Dwt.toWindow(htmlEl);
	var mev = new DwtMouseEvent();
	this._setMouseEvent(mev, {
		type: this._actionTiming == DwtButton.ACTION_MOUSEDOWN ?
			DwtEvent.ONMOUSEDOWN : DwtEvent.ONMOUSEUP,
		dwtObj: this,
		target: htmlEl,
		button: DwtMouseEvent.LEFT,
		docX: p.x,
		docY: p.y,
		kbNavEvent: true
	});
	this.notifyListeners(mev.type, mev);
};

/**
 * @private
 */
DwtButton.prototype._emulateDropDownClick =
function() {
    var htmlEl = this._dropDownEl;
    if (!htmlEl) { return; }

	var p = Dwt.toWindow(htmlEl);
	var mev = new DwtMouseEvent();
	this._setMouseEvent(mev, {
		dwtObj: this,
		target: htmlEl,
		button: DwtMouseEvent.LEFT,
		docX: p.x,
		docY: p.y,
		kbNavEvent: true
	});
	DwtButton._dropDownCellMouseUpHdlr(mev);
};

/**
 * This method is called from mouseUpHdlr in {@see DwtControl}.
 * 
 * @private
 */
DwtButton.prototype._focusByMouseUpEvent =
function()  {
	//do nothing, override parents so that we do not focus on button using mouseUp. Makes no sense to focus.
};

/**
 * NOTE: _focus and _blur will be reworked to reflect styles correctly
 * 
 * @private
 */
DwtButton.prototype._focus =
function() {
    this.setDisplayState(DwtControl.FOCUSED);
};

/**
 * @private
 */
DwtButton.prototype._blur =
function() {
    this.setDisplayState(DwtControl.NORMAL);
};

/**
 * @private
 */
DwtButton.prototype._toggleMenu =
function (event) {
	if (this._shouldToggleMenu){
        var menu = this.getMenu();
        if (!menu.isPoppedUp()){
			this.popup(null, event);
			this._menuUp = true;
		} else {
			menu.popdown(0, event);
			this._menuUp = false;
            this.deactivate();
        }
	} else {
		this.popup(null, event);
	}
};

/**
 * @private
 */
DwtButton.prototype._isDropDownEvent =
function(ev) {
	if (this._dropDownEventsEnabled && this._dropDownEl) {
		var mouseX = ev.docX;
		var dropDownX = Dwt.toWindow(this._dropDownEl, 0, 0, window).x;
		if (mouseX >= dropDownX) {
			return true;
		}
	}
	return false;
};

/**
 * @private
 */
DwtButton.prototype.trigger =
function (){
    if (this._depressedImageInfo) {
        this.setImage(this._depressedImageInfo);
    }
    this.setDisplayState(DwtControl.ACTIVE, true);
    this.isActive = true;
};

/**
 * @private
 */
DwtButton.prototype.deactivate =
function() {
	this._showHoverImage(true);

	if (this._style & DwtButton.TOGGLE_STYLE){
		this._selected = !this._selected;
	}
    this.setDisplayState(DwtControl.HOVER);
};

/**
 * @private
 */
DwtButton.prototype.dontStealFocus = function(val) {
	if (val == null) {
		val = true;
	}
	if (this._menu && this._menu.isDwtMenu) {
		this._menu.dontStealFocus(val);
	}
	this.__preventMenuFocus = val;
};

/**
 * @private
 */
DwtButton.prototype._toggleHoverClass =
function(show, direction) {
	var iconEl = this._getIconEl(direction);
	if (iconEl) {  //add a null check so buttons with no icon elements don't break the app.
		var info = show ? this._hoverImageInfo[direction] : this.__imageInfo[direction];
		iconEl.firstChild.className = AjxImg.getClassForImage(info);
	}
};

/**
 * @private
 */
DwtButton.prototype._showHoverImage =
function(show) {
	// if the button is image-only, DwtLabel#setImage is bad
	// because it clears the element first
	// (innerHTML = "") causing a mouseout event, then it
	// re-sets the image, which results in a new mouseover
	// event, thus looping forever eating your CPU and
	// blinking.
	if (!this._hoverImageInfo) {
		return;
	}
	if (this._hoverImageInfo.left) {
		this._toggleHoverClass(show, DwtLabel.LEFT);
	}
	if (this._hoverImageInfo.right) {
		this._toggleHoverClass(show, DwtLabel.RIGHT);
	}
};

/**
 * @private
 */
DwtButton.prototype._handleClick =
function(ev) {
	if (this.isListenerRegistered(DwtEvent.SELECTION)) {
		var now = (new Date()).getTime();
		if (!this._lastNotify || (now - this._lastNotify > DwtButton.NOTIFY_WINDOW)) {
			var selEv = DwtShell.selectionEvent;
			DwtUiEvent.copy(selEv, ev);
			selEv.item = this;
			selEv.detail = (typeof this.__detail == "undefined") ? 0 : this.__detail;
			this.notifyListeners(DwtEvent.SELECTION, selEv);
			this._lastNotify = now;
			this.shell.notifyGlobalSelection(selEv);
		}
	} else if (this._menu) {
		if(this._menu.isDwtMenu && !this.isListenerRegistered(DwtEvent.SELECTION)) {
			this._menu.setAssociatedObj(this);	
		}		
		this._toggleMenu(ev);
	}
};

/**
 * @private
 */
DwtButton.prototype._setMouseOutClassName =
function() {
    this.setDisplayState(DwtControl.NORMAL);
};

/**
 * @private
 */
DwtButton.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtLabel.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._dropDownEl = document.getElementById(data.id+"_dropdown");
};

// Accessibility
DwtButton.prototype._menuAdded = function(menu) {
	this.setAttribute("aria-haspopup", true);
	this.setAttribute("aria-expanded", false);
	this.setAttribute("aria-controls", menu._htmlElId);
};

// Accessibility
DwtButton.prototype._menuItemSelected = function(menuItem) {};

/**
 * Pops up the dropdown menu.
 * 
 * @private
 */
DwtButton._dropDownCellMouseDownHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);

    var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, obj);

	if (mouseEv.button == DwtMouseEvent.LEFT) {
	    if (this._depImg){
			AjxImg.setImage(this, this._depImg);
	    }
	}

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

/**
 * Updates the current mouse event (set from the previous mouse down).
 * 
 * @private
 */
DwtButton._dropDownCellMouseUpHdlr =
function(ev) {
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev);

	if (mouseEv.button == DwtMouseEvent.LEFT) {
	    if (this._dropDownHovImg && !this.noMenuBar) {
			AjxImg.setImage(this, this._dropDownHovImg);
	    }

		DwtEventManager.notifyListeners(DwtEvent.ONMOUSEDOWN, mouseEv);

		var obj = DwtControl.getTargetControl(ev);
		if (obj) {
			if (obj.getMenu() && obj.getMenu().isPoppedUp()) {
				obj.getMenu().popdown();
			}
			else {
				if (obj._menu && obj._menu.isAjxCallback) {
					obj.popup();
				}

				if (obj._dropDownEvtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
					var selEv = DwtShell.selectionEvent;
					DwtUiEvent.copy(selEv, mouseEv);
					selEv.item = obj;
					obj._dropDownEvtMgr.notifyListeners(DwtEvent.SELECTION, selEv);
				} else {
					obj._toggleMenu(ev);
				}
			}
		}
	}
	
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

/**
 * Activates the button.
 * 
 * @private
 */
DwtButton._mouseOverListener =
function(ev) {
	var button = ev.dwtObj;
	if (!button) { return false; }
	button._showHoverImage(true);
    button.setDisplayState(DwtControl.HOVER);

    var dropDown = button._dropDownEl;
    if (button._menu && dropDown && button._dropDownHovImg && !button.noMenuBar &&
        button.isListenerRegistered(DwtEvent.SELECTION)) {
		if (button._dropDownHovImg) {
			AjxImg.setImage(dropDown, button._dropDownHovImg);
		}
    }
	// bug fix 48266 IE hack, solution is similar to bug 36253
	// Just rewrite the el's Child's className to trigger IE to render it
	// In mouserOut, it seems the IE can render it automatically. 	
	if(AjxEnv.isIE){
	   	if(ev && ev.target && ev.target.firstChild){
			var el = ev.target.firstChild;
			var cname = el.className;
			el.className = "";
			el.className = cname;
		} 
	}    	
    ev._stopPropagation = true;
};

/**
 * @private
 */
DwtButton._mouseOutListener =
function(ev) {
	var button = ev.dwtObj;
	if (!button) { return false; }
	button._showHoverImage(false);
	button._setMouseOutClassName();
    button.isActive = false;

    var dropDown = button._dropDownEl;
    if (button._menu && dropDown && button._dropDownImg) {
		AjxImg.setImage(dropDown, button._dropDownImg);
    }
};

/**
 * @private
 */
DwtButton._mouseDownListener =
function(ev) {
	var button = ev.dwtObj;
	if (!button) { return false; }
	if (button._isDropDownEvent(ev)) {
		return DwtButton._dropDownCellMouseDownHdlr(ev);
	}

	if (ev.button != DwtMouseEvent.LEFT) { return; }

    var dropDown = button._dropDownEl;
    if (button._menu && dropDown && button._dropDownDepImg) {
		AjxImg.setImage(dropDown, button._dropDownDepImg);
    }
	switch (button._actionTiming) {
	  case DwtButton.ACTION_MOUSEDOWN:
		button.trigger();
		button._handleClick(ev);
		break;
	  case DwtButton.ACTION_MOUSEUP:
		button.trigger();
		break;
	}
};

/**
 * Button has been pressed, notify selection listeners.
 * 
 * @private
 */
DwtButton._mouseUpListener =
function(ev) {
	var button = ev.dwtObj;
	if (!button) { return false; }
	if (button._isDropDownEvent(ev)) {
		return DwtButton._dropDownCellMouseUpHdlr(ev);
	}
	if (ev.button != DwtMouseEvent.LEFT) { return; }

    var dropDown = button._dropDownEl;
    if (button._menu && dropDown && button._dropDownHovImg && !button.noMenuBar){
		AjxImg.setImage(dropDown, button._dropDownHovImg);
    }
	switch (button._actionTiming) {
	  case DwtButton.ACTION_MOUSEDOWN:
 	    button.deactivate();
		break;

	  case DwtButton.ACTION_MOUSEUP:
	    var el = button.getHtmlElement();
		if (button.isActive) {
			button.deactivate();
			button._handleClick(ev);
		}
		break;
	}
};

DwtButton._listeners = {};
DwtButton._listeners[DwtEvent.ONMOUSEOVER] = new AjxListener(null, DwtButton._mouseOverListener);
DwtButton._listeners[DwtEvent.ONMOUSEOUT] = new AjxListener(null, DwtButton._mouseOutListener);
DwtButton._listeners[DwtEvent.ONMOUSEDOWN] = new AjxListener(null, DwtButton._mouseDownListener);
DwtButton._listeners[DwtEvent.ONMOUSEUP] = new AjxListener(null, DwtButton._mouseUpListener);
DwtButton._listeners[DwtEvent.ONMOUSEENTER] = new AjxListener(null, DwtButton._mouseOverListener);
DwtButton._listeners[DwtEvent.ONMOUSELEAVE] = new AjxListener(null, DwtButton._mouseOutListener);
}
if (AjxPackage.define("ajax.dwt.widgets.DwtMenuItem")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a menu item.
 * @constructor
 * @class
 * Menu items can be part of a radio group, or can be checked style menu items.
 *
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param  {DwtComposite}     params.parent		the parent widget
 * @param  {constant}     params.style			the menu item style
 * @param  {string}     params.radioGroupId 	the radio group that the menu item is part of
 * @param  {number}     params.index 			the position in menu
 * @param  {string}     params.className		the CSS class
 * @param  {constant}     params.posStyle		the positioning style (see {@link DwtControl})
 * @param  {string}     params.id			an explicit ID to use for the control's HTML element
 * 
 * @extends		DwtButton
 */
DwtMenuItem = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtMenuItem.PARAMS);

	// check parameters
	var parent = params.parent;
	if (!(parent && parent.isDwtMenu)) {
		throw new DwtException("Parent must be a DwtMenu object", DwtException.INVALIDPARENT, "DwtMenuItem");
	}

	var style = params.style = params.style || DwtMenuItem.NO_STYLE;
	if (parent._style == DwtMenu.BAR_STYLE && style != DwtMenuItem.PUSH_STYLE) {
		throw new DwtException("DwtMenuItemInit: invalid style", DwtException.INVALID_PARAM, "DwtMenuItem");
	}

	// call super constructor
	params.className = params.className || "ZMenuItem";
	style &= ~DwtLabel.IMAGE_RIGHT; // remove image right style
	style |= DwtButton.ALWAYS_FLAT | DwtLabel.IMAGE_LEFT; // set default styles
	var isSeparator = (style & DwtMenuItem.SEPARATOR_STYLE);
	if (isSeparator) {
		params.className = "ZMenuItemSeparator";
		this.isFocusable = false;
        this.noTab = true;
		this.role = null;
	}
	params.listeners = DwtMenuItem._listeners;
	DwtButton.call(this, params);

	this.setDropDownImages("Cascade", "Cascade", "Cascade", "Cascade");
	this._radioGroupId = params.radioGroupId;

	// add this item at the specified index
	if (parent._addItem) {
		parent._addItem(this, params.index);
	}

	// add listeners if not menu item separator
	if (!isSeparator) {
		this.addSelectionListener(this.__handleItemSelect.bind(this));
	}
};

DwtMenuItem.PARAMS = ["parent", "style", "radioGroupId", "index", "className", "posStyle", "id"];

DwtMenuItem.prototype = new DwtButton;
DwtMenuItem.prototype.constructor = DwtMenuItem;

DwtMenuItem.prototype.isDwtMenuItem = true;
DwtMenuItem.prototype.toString = function() { return "DwtMenuItem"; };
DwtMenuItem.prototype.role = "menuitem";

//
// Constants
//

DwtMenuItem.CHECKED			= 1;
DwtMenuItem.UNCHECKED		= 2;

/**
 * Defines the "no" style.
 */
DwtMenuItem.NO_STYLE		= 0;
/**
 * Defines the "check" style.
 */
DwtMenuItem.CHECK_STYLE		= DwtButton._LAST_STYLE * 2;
/**
 * Defines the "radio" style.
 */
DwtMenuItem.RADIO_STYLE		= DwtButton._LAST_STYLE * 4;
/**
 * Defines the "separator" style.
 */
DwtMenuItem.SEPARATOR_STYLE = DwtButton._LAST_STYLE * 8;
/**
 * Defines the "cascade" style.
 */
DwtMenuItem.CASCADE_STYLE	= DwtButton._LAST_STYLE * 16;
/**
 * Defines the "push" style.
 */
DwtMenuItem.PUSH_STYLE		= DwtButton._LAST_STYLE * 32;
/**
 * Defines the "select" style.
 */
DwtMenuItem.SELECT_STYLE	= DwtButton._LAST_STYLE * 64;
DwtMenuItem._LAST_STYLE		= DwtMenuItem.SELECT_STYLE;

DwtMenuItem._MENU_POPUP_DELAY	= 250;
DwtMenuItem._MENU_POPDOWN_DELAY	= 250;

//
// Data
//

DwtMenuItem.prototype.TEMPLATE					= "dwt.Widgets#ZMenuItem";
DwtMenuItem.prototype.SEPARATOR_TEMPLATE		= "dwt.Widgets#ZMenuItemSeparator";
DwtMenuItem.prototype.BLANK_CHECK_TEMPLATE		= "dwt.Widgets#ZMenuItemBlankCheck";
DwtMenuItem.prototype.BLANK_ICON_TEMPLATE		= "dwt.Widgets#ZMenuItemBlankIcon";
DwtMenuItem.prototype.BLANK_CASCADE_TEMPLATE	= "dwt.Widgets#ZMenuItemBlankCascade";

//
// Public methods
//
DwtMenuItem.prototype.dispose =
function() {
	delete this._checkEl;
	DwtButton.prototype.dispose.call(this);
};

/**
 * Creates the menu item.
 * 
 * @param	{hash}	params		a hash of parameters
 */
DwtMenuItem.create =
function(params) {
	var mi = new DwtMenuItem(params);
	if (params.imageInfo) {
		mi.setImage(params.imageInfo);
	}
	if (params.text) {
		mi.setText(params.text);
	}
	mi.setEnabled(params.enabled !== false);
	return mi;
};

/**
 * Gets the checked flag.
 * 
 * @return	{boolean}	<code>true</code> if the item is checked
 */
DwtMenuItem.prototype.getChecked =
function() {
	return this._itemChecked;
};

/**
 * Sets the checked flag.
 * 
 * @param	{boolean}	checked			if <code>true</code>, check the item
 * @param	{boolean}	skipNotify		if <code>true</code>, do not notify listeners
 */
DwtMenuItem.prototype.setChecked =
function(checked, skipNotify) {
	this._setChecked(checked, null, skipNotify);
	this.parent._checkItemAdded(this);
};

DwtMenuItem.prototype.setImage =
function(imageInfo) {
	DwtButton.prototype.setImage.call(this, imageInfo);
	this.parent._iconItemAdded(this);
};

DwtMenuItem.prototype.setText =
function(text) {
	DwtButton.prototype.setText.call(this, text);
	if (this.parent.isPoppedUp()) {
		// resize menu if we reset text on the fly
		this.parent.render();
	}
};

DwtMenuItem.prototype.setMenu =
function(params) {
	var params = Dwt.getParams(arguments, DwtButton.setMenuParams);
	DwtButton.prototype.setMenu.call(this, params);
	this.parent._submenuItemAdded(this);
};

DwtMenuItem.prototype.setHoverDelay =
function(delay) {
	this._hoverDelay = delay;
};

DwtMenuItem.prototype.setShortcut =
function(shortcut) {
	if (shortcut && this._dropDownEl) {
		this._dropDownEl.innerHTML = shortcut;
	}
};

// Set whether the item is selectable even when it has an open submenu
DwtMenuItem.prototype.setSelectableWithSubmenu =
function(selectable) {
	this._selectableWithSubmenu = selectable;
};

DwtMenuItem.prototype.isSeparator =
function() {
	return Boolean(this._style & DwtMenuItem.SEPARATOR_STYLE);
};

DwtMenuItem.prototype.handleKeyAction =
function(actionCode, ev) {
	if (this.parent) {
		return this.parent.handleKeyAction(actionCode, ev)
	} else {
		return DwtButton.prototype.handleKeyAction.call(this, actionCode, ev);
	}
};

DwtMenuItem.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_MENU;
};

//
// Protected methods
//

DwtMenuItem.prototype._createHtml =
function(templateId) {
	var defaultTemplate = this.isSeparator() ? this.SEPARATOR_TEMPLATE : this.TEMPLATE;
	DwtButton.prototype._createHtml.call(this, templateId || defaultTemplate);
};

DwtMenuItem.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtButton.prototype._createHtmlFromTemplate.call(this, templateId, data);
	this._checkEl = document.getElementById(data.id+"_check");
};

DwtMenuItem.prototype._setChecked =
function(checked, ev, skipNotify) {
	var isCheck = this._style & DwtMenuItem.CHECK_STYLE;
	var isRadio = this._style & DwtMenuItem.RADIO_STYLE;
	if ((isCheck || isRadio) && this._itemChecked != checked) {
		this._itemChecked = checked;

		if (this._checkEl) {
			this._checkEl.innerHTML = "";
			var icon = checked ? (isCheck ? "MenuCheck" : "MenuRadio") : "Blank_9";
			AjxImg.setImage(this._checkEl, icon);
			if (checked) {
				// deselect currently selected radio button
				if (isRadio) {
					this.parent._radioItemSelected(this, skipNotify);
				}
			}
		}
	}
};

DwtMenuItem.prototype._checkItemAdded = function(className) {};
DwtMenuItem.prototype._checkedItemsRemoved = function() {};

DwtMenuItem.prototype._submenuItemAdded =
function() {
	if (this.isSeparator()) { return; }

	if (this._cascCell == null) {
		this._cascCell = this._row.insertCell(-1);
		this._cascCell.noWrap = true;
	}
};

DwtMenuItem.prototype._submenuItemRemoved =
function() {
	if (this._dropDownEl) {
		this._dropDownEl.innerHTML = "";
	}
};

DwtMenuItem.prototype._popupMenu =
function(delay, kbGenerated) {
	var menu = this.getMenu();
	var pp = this.parent.parent;
	var pb = this.getBounds();
	var ws = menu.shell.getSize();
	var s = menu.getSize();
	var x;
	var y;
	var vBorder;
	var hBorder;
	var ppHtmlElement = pp.getHtmlElement();
	if (pp._style == DwtMenu.BAR_STYLE) {
		vBorder = (ppHtmlElement.style.borderLeftWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderLeftWidth);
		x = pb.x + vBorder;
		hBorder = (ppHtmlElement.style.borderTopWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderTopWidth);
		hBorder += (ppHtmlElement.style.borderBottomWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderBottonWidth);
		y = pb.y + pb.height + hBorder;		
		x = ((x + s.x) >= ws.x) ? x - (x + s.x - ws.x): x;
	}
	else { // Drop Down
		vBorder = (ppHtmlElement.style.borderLeftWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderLeftWidth);
		vBorder += (ppHtmlElement.style.borderRightWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderRightWidth);
		x = pb.x + pb.width + vBorder;
		hBorder = (ppHtmlElement.style.borderTopWidth == "") ? 0 : parseInt(ppHtmlElement.style.borderTopWidth);
		y = pb.y + hBorder;
        if (menu.centerOnParentVertically()) {
            y += pb.height / 2;
        }
		//x = ((x + s.x) >= ws.x) ? pb.x - s.x - vBorder : x;
	}
	menu.popup(delay, x, y, kbGenerated);
};

DwtMenuItem.prototype._popdownMenu =
function() {
	var menu = this.getMenu();
	if (menu) {
		menu.popdown();
	}
};

DwtMenuItem.prototype._isMenuPoppedUp =
function() {
	var menu = this.getMenu();
	return (menu && menu.isPoppedUp());
};

DwtMenuItem.prototype._blur =
function() {
	var menu = this.parent;
	var mev = new DwtMouseEvent();

	this._setMouseEvent(mev, {
		dwtObj: this,
		ersatz: true,
		type: DwtEvent.ONMOUSEOUT
	});
	this.notifyListeners(DwtEvent.ONMOUSEOUT, mev);
	menu.__currentItem = null;

	DwtButton.prototype._blur.call(this);
};

DwtMenuItem.prototype._focus = function() {

	var menu = this.parent;
	var currItem = menu.__currentItem;
	var mev = new DwtMouseEvent();

	this._setMouseEvent(mev, {dwtObj:this, ersatz: true});
	this.notifyListeners(AjxEnv.isIE ? DwtEvent.ONMOUSEENTER : DwtEvent.ONMOUSEOVER, mev);	// mouseover selects a menu item
	menu.__currentItem = this;

	DwtButton.prototype._focus.call(this);
}

//
// Private methods
//

DwtMenuItem.prototype.__handleItemSelect =
function(event) {
	this.setDisplayState(DwtControl.NORMAL);
	if (this.isStyle(DwtMenuItem.CHECK_STYLE)) {
		this._setChecked(!this._itemChecked, null, true);
		event.detail = this.getChecked() ? DwtMenuItem.CHECKED : DwtMenuItem.UNCHECKED;
	}
	else if (this.isStyle(DwtMenuItem.RADIO_STYLE)) {
		this._setChecked(true, true);
		this.parent._radioItemSelected(this, true);
		event.detail = this.getChecked() ? DwtMenuItem.CHECKED : DwtMenuItem.UNCHECKED;
	}
	else if (this.isStyle(DwtMenuItem.PUSH_STYLE)) {
		if (this._menu) {
			if (this._isMenuPoppedUp()) {
				DwtMenu.closeActiveMenu(event);
			}
			else {
				this._popupMenu(DwtKeyEvent.isKeyEvent(ev));
			}
		}
		return;
	}
	if (!this.isStyle(DwtMenuItem.CASCADE_STYLE)) {
		if (this._selectableWithSubmenu || !this._menu || !this._menu.isPoppedUp || !this._menu.isPoppedUp()) {
			DwtMenu.closeActiveMenu(event);
		}
	}
};

DwtMenuItem._mouseOverListener =
function(ev) {
	var menuItem = ev.dwtObj;
	if (!menuItem) { return false; }
	var menu = menuItem.parent;
	if (menuItem.isSeparator()) { return false; }
	DwtButton._mouseOverListener(ev, menuItem);
	if (!ev.ersatz) {
		menu._popdownSubmenus();
	}
	if (!menuItem.hasFocus() && menuItem.getEnabled()) {
		menuItem.focus();
	}

	if (menuItem._menu && !ev.ersatz) {
		menuItem._popupMenu(menuItem._hoverDelay);
	}
};

DwtMenuItem._mouseOutListener =
function(ev) {
	var menuItem = ev.dwtObj;
	var submenu = menuItem && menuItem.getMenu();
	if (submenu && submenu.isPoppedUp()) { return; }
	DwtButton._mouseOutListener(ev);
};

/*
 * returns menu item table row element
 */
DwtMenuItem.prototype.getRowElement =
function() {
	var el = this._textEl ||
		this._dropDownEl ||
		(this._iconEl && this._iconEl.left) ||
		(this._iconEl && this._iconEl.right);
	if (el) {
		return el.parentNode;
	}
};

DwtMenuItem._listeners = {};
DwtMenuItem._listeners[DwtEvent.ONMOUSEOVER]	= DwtMenuItem._mouseOverListener.bind();
DwtMenuItem._listeners[DwtEvent.ONMOUSEOUT]		= DwtMenuItem._mouseOutListener.bind();
DwtMenuItem._listeners[DwtEvent.ONMOUSEDOWN]	= DwtButton._mouseDownListener.bind();
DwtMenuItem._listeners[DwtEvent.ONMOUSEUP]		= DwtButton._mouseUpListener.bind();
DwtMenuItem._listeners[DwtEvent.ONMOUSEENTER]	= DwtMenuItem._mouseOverListener.bind();
DwtMenuItem._listeners[DwtEvent.ONMOUSELEAVE]	= DwtButton._mouseOutListener.bind();
}
if (AjxPackage.define("ajax.dwt.widgets.DwtMenu")) {
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
 * Creates a menu.
 * @constructor
 * @class
 * Creates a menu object to menu items can be added. Menus can be created in various styles as
 * follows:
 * <ul>
 * <li>DwtMenu.BAR_STYLE - Traditional menu bar</li>
 * <li>DwtMenu.POPUP_STYLE - Popup menu</li>
 * <li>DwtMenu.DROPDOWN_STYLE - Used when a menu is a drop down (e.g. parent is a button or another menu item)</li>
 * <li>DwtMenu.DROPDOWN_CENTERV_STYLE - like a dropdown, but position to the right, centered vertically on the parent</li>
 * <li>DwtMenu.COLOR_PICKER_STYLE - Menu is hosting a single color picker</li>
 * <li>DwtMenu.CALENDAR_PICKER_STYLE - Menu is hostng a single calendar</li>
 * <li>DwtMenu.GENERIC_WIDGET_STYLE - Menu is hosting a single "DwtInsertTableGrid"</li>
 * </ul>
  *
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param       {DwtComposite}	params.parent		the parent widget
 * @param {constant}      params.style			the menu style
 * @param {string}        params.className		the CSS class
 * @param {constant}      params.posStyle		the positioning style (see {@link DwtControl})
 * @param {constant}      params.layout			layout to use: DwtMenu.LAYOUT_STACK, DwtMenu.LAYOUT_CASCADE or DwtMenu.LAYOUT_SCROLL. A value of [true] defaults to DwtMenu.LAYOUT_CASCADE and a value of [false] defaults to DwtMenu.LAYOUT_STACK.
 * @param {int}		  params.maxRows=0	    	if >0 and layout = LAYOUT_CASCADE or DwtMenu.LAYOUT_SCROLL, define how many rows are allowed before cascading/scrolling
 * @param {boolean}		params.congruent		if the parent is a DwtMenuItem, align so that the submenu "merges" with the parent menu
 * 
 * @extends		DwtComposite
 */

DwtMenu = function(params) {
	this._created = false;
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtMenu.PARAMS);

	this._origStyle = params.style;
	var parent = params.parent;
	if (parent) {
		if (parent instanceof DwtMenuItem || parent instanceof DwtButton) {
			if ((params.style == DwtMenu.GENERIC_WIDGET_STYLE) ||
                (params.style == DwtMenu.DROPDOWN_CENTERV_STYLE)) {
				this._style = params.style;
			} else {
                this._style = DwtMenu.DROPDOWN_STYLE;
 			}
		} else {
			this._style = params.style || DwtMenu.POPUP_STYLE;
		}
		if (!params.posStyle) {
			params.posStyle = (this._style == DwtMenu.BAR_STYLE) ? DwtControl.STATIC_STYLE : DwtControl.ABSOLUTE_STYLE;
		}
	}
	params.className = params.className || "DwtMenu";

	this._layoutStyle = params.layout == null || params.layout;
	if (this._layoutStyle === true) {
		this._layoutStyle = DwtMenu.LAYOUT_CASCADE;
	} else if (this._layoutStyle === false) {
		this._layoutStyle = DwtMenu.LAYOUT_STACK;
	}
	this._maxRows = this._layoutStyle && params.maxRows || 0;
	this._congruent = params.congruent;

	// Hack to force us to hang off of the shell for positioning.
	params.parent = (parent instanceof DwtShell) ? parent : parent.shell;
	DwtComposite.call(this, params);
	this.parent = parent;

	if (this._isPopupStyle() && (this._layoutStyle == DwtMenu.LAYOUT_STACK)) {
		this.setScrollStyle(DwtControl.SCROLL);
	}

	if (!parent) { return; }

	var events = AjxEnv.isIE ? [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP] :
							   [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT];
	this._setEventHdlrs(events);
	this._hasSetMouseEvents = true;
	
	var htmlElement = this.getHtmlElement();

	if (params.posStyle != DwtControl.STATIC_STYLE) {
		Dwt.setLocation(htmlElement, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	}

	// Don't need to create table for color picker and calendar picker styles
	if (this._style != DwtMenu.COLOR_PICKER_STYLE &&
		this._style != DwtMenu.CALENDAR_PICKER_STYLE &&
		this._style != DwtMenu.GENERIC_WIDGET_STYLE)
	{
		this._table = document.createElement("table");
		this._table.border = this._table.cellPadding = this._table.cellSpacing = 0;
		this._table.className = "DwtMenuTable";
		this._table.setAttribute('role', 'presentation');
		this._table.id = Dwt.getNextId();


		if (this._layoutStyle == DwtMenu.LAYOUT_SCROLL) {
			this._setupScroll();
		} else {
			htmlElement.appendChild(this._table);
		}
		this._table.backgroundColor = DwtCssStyle.getProperty(htmlElement, "background-color");
    }

	if (params.style != DwtMenu.BAR_STYLE) {
		this.setVisible(false);
 		this._isPoppedUp = false;
	} else {
		DwtMenu._activeMenuIds.add(htmlElement.id, null, true);
		this._isPoppedUp = true;
 	}
	this._popdownAction = new AjxTimedAction(this, this._doPopdown);
	this._popdownActionId = -1;
	this._popupAction = new AjxTimedAction(this, this._doPopup);
	this._popupActionId = -1;

	this._outsideListener = new AjxListener(null, DwtMenu._outsideMouseDownListener);

	this._menuItemsHaveChecks = false;	
	this._menuItemsHaveIcons = false;
	this._menuItemsWithSubmenus = 0;
	this.__currentItem = null;
	this.__preventMenuFocus = false;

	this._created = true;

    // When items are added, the menu listens to selection events
    // and will propagate the event to listeners that are registered
    // on the menu itself.
    this._itemSelectionListener = new AjxListener(this, this._propagateItemSelection);

	// Accessibility
	if (parent._menuAdded) {
		parent._menuAdded(this);
	}
};

DwtMenu.PARAMS = ["parent", "style", "className", "posStyle", "cascade", "id"];

DwtMenu.prototype = new DwtComposite;
DwtMenu.prototype.constructor = DwtMenu;

DwtMenu.prototype.isDwtMenu = true;
DwtMenu.prototype.toString = function() { return "DwtMenu"; };
DwtMenu.prototype.role = "menu";

DwtMenu.BAR_STYLE				= "BAR";
DwtMenu.POPUP_STYLE				= "POPUP";
DwtMenu.DROPDOWN_STYLE			= "DROPDOWN";
DwtMenu.DROPDOWN_CENTERV_STYLE	= "DROPDOWN_CENTERV";
DwtMenu.COLOR_PICKER_STYLE		= "COLOR";
DwtMenu.CALENDAR_PICKER_STYLE	= "CALENDAR";
DwtMenu.GENERIC_WIDGET_STYLE	= "GENERIC";

DwtMenu.HAS_ICON = "ZHasIcon";
DwtMenu.HAS_CHECK = "ZHasCheck";
DwtMenu.HAS_SUBMENU = "ZHasSubMenu";

DwtMenu.LAYOUT_STACK 	= 0;
DwtMenu.LAYOUT_CASCADE 	= 1;
DwtMenu.LAYOUT_SCROLL 	= 2;

DwtMenu._activeMenuUp = false;
DwtMenu._activeMenuIds = new AjxVector();
DwtMenu._activeMenus = new AjxVector() ;

DwtMenu.prototype.dispose =
function() {
	this._table = null;
	DwtComposite.prototype.dispose.call(this);

	// Remove this from the shell. (Required because of hack in constructor.) 
	if (!(this.parent instanceof DwtShell)) {
		this.shell.removeChild(this);	
	}
};

/**
 * Adds a selection listener.
 * @param {AjxListener} listener The listener.
 */
DwtMenu.prototype.addSelectionListener = function(listener) {
    this.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * @param {AjxListener} listener The listener.
 */
DwtMenu.prototype.removeSelectionListener = function(listener) {
    this.removeListener(DwtEvent.SELECTION, listener);
};

/**
 * Adds a popup listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtMenu.prototype.addPopupListener =
function(listener) {
	this.addListener(DwtEvent.POPUP, listener);
};

/**
 * Removes a popup listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtMenu.prototype.removePopupListener = 
function(listener) {
	this.removeListener(DwtEvent.POPUP, listener);
};

/**
 * Adds a popdown listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtMenu.prototype.addPopdownListener = 
function(listener) {
	this.addListener(DwtEvent.POPDOWN, listener);
};

/**
 * Removes a popdown listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtMenu.prototype.removePopdownListener = 
function(listener) {
	this.removeListener(DwtEvent.POPDOWN, listener);
};

DwtMenu.prototype.setWidth = 
function(width) {
	this._width = width;

    if (this._table) {
        Dwt.setSize(this._table, width, Dwt.CLEAR);
    }
};

DwtMenu.prototype.centerOnParentVertically =
function() {
    return (this._style === DwtMenu.DROPDOWN_CENTERV_STYLE);
};

DwtMenu.prototype._isPopupStyle =
function() {
	return (this._style === DwtMenu.POPUP_STYLE || this._style === DwtMenu.DROPDOWN_STYLE || this._style === DwtMenu.DROPDOWN_CENTERV_STYLE);
};

/**
 * Gets a menu item.
 * 
 * @param	{string}	index		the index
 * @return	{DwtMenuItem}		the menu item
 */
DwtMenu.prototype.getItem =
function(index) {
	return this._children.get(index);
};

DwtMenu.prototype.getItemIndex =
function(item) {
	return this._children.indexOf(item);
};

/**
 * Gets the item by id.
 * 
 * @param	{string}	key		the id key
 * @param	{Object}	id		the id value
 * @return	{DwtMenuItem}	the menu item
 */
DwtMenu.prototype.getItemById =
function(key, id) {
	var items = this.getItems();
	for (var i = 0; i < items.length; i++) {
		var itemId = items[i].getData(key);
		if (itemId == id) {
			items[i].index = i; //needed in some caller
			return items[i];
		}
	}
	return null;
};

/**
 * Gets a count of the items.
 * 
 * @return	{number}	the count
 */
DwtMenu.prototype.getItemCount =
function() {
	return this._children.size();
};

/**
 * Gets an array of items.
 * 
 * @return	{array}	an array of {@link DwtMenuItem} objects
 */
DwtMenu.prototype.getItems =
function() {
	return this._children.getArray();
};

DwtMenu.prototype.getSelectedItem =
function(style) {
	var a = this._children.getArray();
	for (var i = 0; i < a.length; i++) {
		var mi = a[i];
		if ((style == null || (mi._style && style != 0)) && mi.getChecked())
			return mi;
	}
	return null;
};

/**
 * Checks if the menu is popped-up.
 * 
 * @return	{boolean}	<code>true</code> if popped-up
 */
DwtMenu.prototype.isPoppedUp =
function() {
	return this._isPoppedUp;
};

DwtMenu.prototype.popup = function(msec, x, y, kbGenerated) {

	if (this._style == DwtMenu.BAR_STYLE) {
        return;
    }
	
	if (this._popdownActionId != -1) {
		AjxTimedAction.cancelAction(this._popdownActionId);
		this._popdownActionId = -1;
	}
    else {
		if (this._isPoppedUp || (this._popupActionId != -1 && msec && msec > 0)) {
			return;
		}
        else if (this._popupActionId != -1) {
			AjxTimedAction.cancelAction(this._popupActionId);
			this._popupActionId = -1;
		}

		if (!msec) {
			this._doPopup(x, y, kbGenerated);
		}
        else {
			this._popupAction.args = [x, y, kbGenerated];
			this._popupActionId = AjxTimedAction.scheduleAction(this._popupAction, msec);
		}
	}
};

DwtMenu.prototype.popdown =
function(msec, ev) {
	if (this._style == DwtMenu.BAR_STYLE) return;

	if (this._popupActionId != -1) {
		AjxTimedAction.cancelAction(this._popupActionId);	
		this._popupActionId = -1;
	} else {
		if (!this._isPoppedUp || this._popdownActionId != -1)
			return;
		if (msec == null || msec == 0)
			this._doPopdown(ev);
		else
			this._popdownActionId = AjxTimedAction.scheduleAction(this._popdownAction, msec);
	}
};

DwtMenu.prototype._setupScroll = function() {
	var htmlElement = this.getHtmlElement();
	this._table.style.position = "relative";
			
	this._topScroller = document.createElement("div");
	this._topScroller.className = "DwtMenuScrollTop";
	this._topScroller.id = Dwt.getNextId();
	
	this._imgDivTop = document.createElement("div");
	this._imgDivTop.className = "ImgUpArrowSmall";
	this._topScroller.appendChild(this._imgDivTop);
	Dwt.setHandler(this._imgDivTop, DwtEvent.ONMOUSEOUT, DwtMenu._stopEvent);
	Dwt.setHandler(this._imgDivTop, DwtEvent.ONMOUSEOVER, DwtMenu._stopEvent);
	htmlElement.appendChild(this._topScroller);

	this._tableContainer = document.createElement("div");
	this._tableContainer.appendChild(this._table);
	htmlElement.appendChild(this._tableContainer);

	this._bottomScroller = document.createElement("div");
	this._bottomScroller.className = "DwtMenuScrollBottom";
	this._bottomScroller.id = Dwt.getNextId();
	
	this._imgDivBottom = document.createElement("div");
	this._imgDivBottom.className = "ImgDownArrowSmall";
	Dwt.setHandler(this._imgDivBottom, DwtEvent.ONMOUSEOUT, DwtMenu._stopEvent);
	Dwt.setHandler(this._imgDivBottom, DwtEvent.ONMOUSEOVER, DwtMenu._stopEvent);
	this._bottomScroller.appendChild(this._imgDivBottom);
	htmlElement.appendChild(this._bottomScroller);

	//scroll up
	var scrollUpStartListener = AjxCallback.simpleClosure(this._scroll, this, this._table.id, true, false);
	var scrollUpStopListener = AjxCallback.simpleClosure(this._scroll, this, this._table.id, false, false);
	var mouseOutTopListener = AjxCallback.simpleClosure(this._handleMouseOut, this, this._topScroller.id, this._table.id);
	var mouseOutBottomListener = AjxCallback.simpleClosure(this._handleMouseOut, this, this._bottomScroller.id, this._table.id);

	Dwt.setHandler(this._topScroller, DwtEvent.ONMOUSEDOWN, scrollUpStartListener);
	Dwt.setHandler(this._topScroller, DwtEvent.ONMOUSEUP, scrollUpStopListener);
	if (!AjxEnv.isIE) {
		Dwt.setHandler(this._topScroller, DwtEvent.ONMOUSEOUT, mouseOutTopListener);
	} else {
		Dwt.setHandler(this._topScroller, DwtEvent.ONMOUSELEAVE, scrollUpStopListener);
	}

	//scroll down
	var scrollDownStartListener = AjxCallback.simpleClosure(this._scroll, this, this._table.id, true, true);
	var scrollDownStopListener = AjxCallback.simpleClosure(this._scroll, this, this._table.id, false, true);

	Dwt.setHandler(this._bottomScroller, DwtEvent.ONMOUSEDOWN, scrollDownStartListener);
	Dwt.setHandler(this._bottomScroller, DwtEvent.ONMOUSEUP, scrollDownStopListener);
	Dwt.setHandler(this._bottomScroller, DwtEvent.ONMOUSEUP, scrollDownStopListener);
	if (!AjxEnv.isIE) {
		Dwt.setHandler(this._bottomScroller, DwtEvent.ONMOUSEOUT, mouseOutBottomListener);
	} else {
		Dwt.setHandler(this._bottomScroller, DwtEvent.ONMOUSELEAVE, scrollDownStopListener);
	}

	var wheelListener = AjxCallback.simpleClosure(this._handleScroll, this, this._table.id);
	Dwt.setHandler(htmlElement, DwtEvent.ONMOUSEWHEEL, wheelListener);
};

DwtMenu.prototype.render = function(x, y) {

	var windowSize = this.shell.getSize();
	var mySize = this.getSize();
	var htmlEl = this.getHtmlElement();

	// bug 9583 - can't query border size so just subtract generic padding
	windowSize.y -= 10 + (AjxEnv.isIE ? 20 : 0);
	windowSize.x -= 28;

	var isScroll = this._layoutStyle == DwtMenu.LAYOUT_SCROLL;
	var isPopup = this._isPopupStyle();
	var isCascade = this._layoutStyle == DwtMenu.LAYOUT_CASCADE;
	if (this._table) {
		if (isPopup && isCascade) {
			var space = windowSize.y;
			var newY = null;
			var rows = this._table.rows;
			var numRows = rows.length;
			var maxRows = this._maxRows;
			var height = mySize.y;
			var requiredSpace = space - 25; // Account for space on top & bottom of menu.
			for (var i = numRows - 1; i >= 0; i--) {
				height -= Dwt.getSize(rows[i]).y;
				if (height < requiredSpace) {
					break;
				}
			}
			var count = maxRows ? Math.min(i + 1, maxRows) : (i + 1);
			for (var j = count; j < numRows; j++) {
				var row = rows[(j - count) % count];
				var cell = row.insertCell(-1);
				cell.className = "DwtMenuCascadeCell";
				var child = rows[j].cells[0].firstChild;
				while (child != null) {
					cell.appendChild(child);
					child = child.nextSibling;
				}
			}
			for (j = rows.length - 1; j >= count; j--) {
				this._table.deleteRow(count);
			}
			var offset = numRows % count;
			if (offset > 0) {
				for (var j = offset; j < count; j++) {
					var row = rows[j];
					var cell = row.insertCell(-1);
					cell.className = "DwtMenuCascadeCell";
					cell.empty = true;
					cell.innerHTML = "&nbsp;";
				}
			}

			mySize = this.getSize();
			if (newY) {
				y = newY - mySize.y;
			}
		}
        else if (isPopup && isScroll) {
			var rows = this._table.rows;
			var numRows = rows.length;
			var maxRows = this._maxRows;
			var limRows = maxRows ? Math.min(maxRows, numRows) : numRows;
			var availableSpace = windowSize.y - 25; // Account for space on top & bottom of menu.

			var height = 20; //for scroll buttons
			for (var i = 0; i < limRows; i++) {
				var rowSize = Dwt.getSize(rows[i]).y;
				if (height + rowSize <= availableSpace) {
					height += rowSize;
                }
				else {
					break;
                }
			}
			mySize.y = height;
		}
	}

	var newW = "auto";
	var newH = "auto";
	if (isPopup && isScroll) {
		newH = mySize.y;
		if (this._tableContainer) {
			this._tableContainer.style.height = (newH - 20) +"px";
        }
	}
    else if ((isPopup && isCascade) || y + mySize.y < windowSize.y - 5 ) {
		newH = "auto";
	}
    else {
		newH = windowSize.y - y - 5;
	}
    if (isScroll) {
	    if (this._table) {
		    this._table.style.width = mySize.x;
        }
        newW = mySize.x;
    }
    this.setSize(newW, newH);
	// NOTE: This hack is needed for FF/Moz because the containing div
	//	   allows the inner table to overflow. When the menu cascades
	//	   and the menu items get pushed off of the visible area, the
	//	   div's border doesn't surround the menu items. This hack
	//	   forces the outer div's width to surround the table.

	if ((AjxEnv.isGeckoBased || AjxEnv.isSafari || (this._origStyle == DwtMenu.CALENDAR_PICKER_STYLE)) && this._table && !isScroll) {
		htmlEl.style.width = (mySize.x + (isPopup && !isCascade ? 10 : 0)) + "px";
	}

	// Popup menu type
	var newX = x + mySize.x >= windowSize.x ? windowSize.x - mySize.x : x;
	if (this.parent instanceof DwtMenuItem) {
		Dwt.delClass(htmlEl, "DwtMenu-congruentLeft");
		Dwt.delClass(htmlEl, "DwtMenu-congruentRight");

		var pbound = this.parent.getBounds();
		var pmstyle = DwtCssStyle.getComputedStyleObject(this.parent.parent.getHtmlElement()); // Get the style for the DwtMenu holding the parent DwtMenuItem
		var tstyle = DwtCssStyle.getComputedStyleObject(htmlEl); // Get the style for this menu (includes skinning)

		//if the cascading extends over the edge of the screen, cascade to the left
		if (((newX > pbound.x && newX < pbound.x + pbound.width) || (pbound.x >= newX && pbound.x < newX + mySize.x)) && pbound.x >= mySize.x) {
			var totalWidth = parseInt(tstyle.width);
			if (!AjxEnv.isIE) {
				totalWidth += parseInt(tstyle.paddingLeft) + parseInt(tstyle.paddingRight) + parseInt(tstyle.borderLeftWidth) + parseInt(tstyle.borderRightWidth);
            }
			newX = (parseInt(pmstyle.left) || pbound.x) - (totalWidth || mySize.x);
			if (this._congruent) {
				var offset;
				if (AjxEnv.isIE) {
					offset = parseInt(tstyle.borderLeftWidth);
                }
				else {
					offset = parseInt(tstyle.borderLeftWidth) + parseInt(tstyle.borderRightWidth);
                }
				if (!isNaN(offset)) {
					newX += offset;
					Dwt.addClass(htmlEl, "DwtMenu-congruentLeft");
				}
			}
		}
        else { // Cascade to the right
			var left = parseInt(pmstyle.left) || (pbound.x - (parseInt(pmstyle.paddingLeft) || 0));
			var width = parseInt(pmstyle.width) || pbound.width;
			newX = left + width;
			if (this._congruent) {
				var offset = parseInt(pmstyle.paddingRight) + parseInt(tstyle.paddingLeft) + parseInt(tstyle.borderLeftWidth);
				if (!isNaN(offset)) {
					newX += offset;
					Dwt.addClass(htmlEl, "DwtMenu-congruentRight");
				}
			}
		}
	}

    if (this._style === DwtMenu.DROPDOWN_CENTERV_STYLE) {
        y -=  mySize.y/2;
        if (y < 0) {
            y = 0;
        }
    }
	var newY = isPopup && y + mySize.y >= windowSize.y ? windowSize.y - mySize.y : y;

	if (this.parent instanceof DwtMenuItem && this._congruent) {
		var offset = (parseInt(tstyle.paddingTop) || 0) - (parseInt(tstyle.borderTopWidth) || 0);
		if (offset > 0) {
			newY -= offset;
        }
	}

    // make sure we aren't locating the menu offscreen
    newX = newX < 0 && newX !== Dwt.DEFAULT ? 0 : newX;
    newY = newY < 0 && newY !== Dwt.DEFAULT ? 0 : newY;
	this.setLocation(newX, newY);
};

DwtMenu.prototype.getKeyMapName = 
function() {
	return DwtKeyMap.MAP_MENU;
};

DwtMenu.prototype._handleScroll =
function(divID, ev) {
	if (!ev) ev = window.event;
	var div = Dwt.byId(divID);
	if (div && ev) {
	 	ev = ev ? ev : window.event;
	  	var wheelData = ev.detail ? ev.detail * -1 : ev.wheelDelta / 40;
		var rows = div.rows;
		var step = Dwt.getSize(rows[0]).y || 10;
		this._popdownSubmenus();
		if (wheelData > 0) { //scroll up
			this._doScroll(div, +step)
		} else if (wheelData < 0) { //scroll down
			this._doScroll(div, -step)
		}
	}
};

DwtMenu.prototype._handleMouseOut = 
function(divID, tableID, ev) {
	if (divID && ev.type && ev.type == "mouseout" && !AjxEnv.isIE) {
		var div = divID ? Dwt.byId(divID) : null;
		fromEl = ev.target;
		if (fromEl != div) {
			return;
		}
		toEl = ev.relatedTarget;
		while (toEl) {
			toEl = toEl.parentNode;
			if (toEl == div) {
				return;
			}
		}
		this._scroll(tableID, false, false, null);
	}
};

DwtMenu.prototype._scroll =
function(divID, scrolling, direction, ev) {
	var div = divID ? document.getElementById(divID) : null;
	if (div && scrolling) {
		var rows = div.rows;
		var step = Dwt.getSize(rows[0]).y || 10;
		if (this._direction != direction || !this._scrollTimer) {
			this._popdownSubmenus();
			this._direction = direction;
			if (this._scrollTimer) {
				clearInterval(this._scrollTimer);
				this._scrollTimer = null;
			}
	
			if (direction) { //scroll down
				this._scrollTimer = setInterval(AjxCallback.simpleClosure(this._doScroll, this, div, -step), 100);
				this._doScroll(div, -step);
			} else { //scroll up
				this._scrollTimer = setInterval(AjxCallback.simpleClosure(this._doScroll, this, div, step), 100);
				this._doScroll(div, step);
			}
		}
	} else {
		if (this._scrollTimer) {
			clearInterval(this._scrollTimer);
			this._scrollTimer = null;
		}
	}
};

DwtMenu.prototype._doScroll =
function(div, step) {
	if (div && step) {
		var old = parseInt(div.style.top) || 0;
		var top;
		if (step < 0) { // scroll down
			var rows = this._table.rows || null;
			var height = rows && rows.length && Dwt.getSize(rows[0]).y;
			var max = div.scrollHeight - (parseInt(div.parentNode.style.height) || ((this._maxRows || (rows && rows.length)) * height) || 0);
			if (Math.abs(old + step) <= max) {
				top = old + step;
			} else {
				top = -max;
			}
		} else { // scroll up
			if ((old + step) < 0) {
				top = old + step;
			} else {
				top = 0;
			}
		}
		Dwt.setLocation(div, Dwt.DEFAULT, top);
	}
};

/**
 * Checks a menu item (the menu must be radio or checkbox style). The menu item
 * is identified through the given field/value pair.
 *
 * @param {DwtMenuItem}		item				the menu item to scroll to
 * @param {boolean}			justMakeVisible		false: scroll so the item is in the topmost row; true: scroll so the item is visible (scrolling down to an item puts it in the bottom row, doesn't scroll if the item is already visible)
 * 
 */
DwtMenu.prototype.scrollToItem =
function(item, justMakeVisible) {
	var index = this.getItemIndex(item);
	if (index != -1)
		this.scrollToIndex(index, justMakeVisible);
};

DwtMenu.prototype.scrollToIndex = 
function(index, justMakeVisible) {
	if (this._created && this._layoutStyle == DwtMenu.LAYOUT_SCROLL && index !== null && index >= 0 && this._table) {
		var rows = this._table.rows;
		if (rows) {
			var maxRows = this._maxRows;
			var visibleHeight = 0;
			var rowHeights = [];
			for (var i = 0, numRows = rows.length; i < numRows; i++) {
				var h = Dwt.getSize(rows[i]).y;
				if (i < maxRows)
					visibleHeight += h;
				rowHeights.push(h);
			}
		
			var itemHeight = rowHeights[index];
			var currentOffset = parseInt(this._table.style.top) || 0;
			if (index >= rows.length)
				index = rows.length-1;
			
			var itemOffset = 0;
			for (var i=0; i<index && i<rowHeights.length; i++) {
				itemOffset += rowHeights[i];
			}
			var delta = 0;
			if (justMakeVisible) {
				if (itemOffset < -currentOffset) {
					delta = -(itemOffset + currentOffset); // Scroll up, making the item the topmost visible row
				} else if (itemOffset + itemHeight > visibleHeight - currentOffset) {
					delta = -(itemOffset + currentOffset - visibleHeight + itemHeight); // Scroll down, making the item the lowermost visible row
				} // else do not scroll; item is already visible
			} else {
				delta = -(itemOffset + currentOffset); // Scroll so that the item is the topmost visible row
			}
			if (delta) {
				this._popdownSubmenus();
				this._doScroll(this._table, delta);
			}
		}
	}
};

DwtMenu.prototype.handleKeyAction = function(actionCode, ev) {

	// For now don't deal with anything but BAR, POPUP, and DROPDOWN style menus
	switch (this._style) {
		case DwtMenu.BAR_STYLE:
		case DwtMenu.POPUP_STYLE:
        case DwtMenu.DROPDOWN_STYLE:
        case DwtMenu.DROPDOWN_CENTERV_STYLE:
			break;
			
		default:
			return false;
	}

	switch (actionCode) {

		case DwtKeyMap.PAGE_UP:
		case DwtKeyMap.PAGE_DOWN:
			var item = this.__currentItem || this._children.get(0);
			var index = this.getItemIndex(item);
			if (this._maxRows && index !== -1) {
				this.setSelectedItem(index + ((actionCode === DwtKeyMap.PAGE_UP) ? -this._maxRows : this._maxRows));
			}
            else {
				this.setSelectedItem(actionCode === DwtKeyMap.PAGE_DOWN);
			}
			break;

        case DwtKeyMap.SELECT_PREV:
		case DwtKeyMap.SELECT_NEXT:
			this.setSelectedItem(actionCode === DwtKeyMap.SELECT_NEXT);
			break;

		case DwtKeyMap.SELECT:
			if (this.__currentItem) {
				this.__currentItem._emulateSingleClick();
			}
			break;
		
		case DwtKeyMap.SUBMENU:
			if (this.__currentItem && this.__currentItem._menu) {
				this.__currentItem._popupMenu(0, true);	
			}
			break;
			
		case DwtKeyMap.PARENTMENU:
			if (this.parent.isDwtMenuItem) {
				this.popdown();
                this.parent.focus();
			}

			break;
			
		case DwtKeyMap.CANCEL:
			this.popdown();
			break;		
			
		default:
			return false;		
	}
	
	return true;
};

/**
 * This allows the caller to associate one object with the menu. Association
 * means, for events, treat the menu, and this object as one. If I click on
 * elements pertaining to this object, we will think of them as part of the
 * menu. 
 * @see _outsideMouseListener.
 * 
 * @private
 */
DwtMenu.prototype.setAssociatedObj =
function(dwtObj) {
	this._associatedObj = dwtObj;
};

DwtMenu.prototype.setAssociatedElementId =
function(id){
	this._associatedElId = id;
};

/**
 * Checks a menu item (the menu must be radio or checkbox style). The menu item
 * is identified through the given field/value pair.
 *
 * @param {Object}	field		a key for menu item data
 * @param {Object}	value		value for the data of the menu item to check
 * 
 */
DwtMenu.prototype.checkItem =
function(field, value, skipNotify) {
	var items = this._children.getArray();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (!(item.isStyle(DwtMenuItem.CHECK_STYLE) || item.isStyle(DwtMenuItem.RADIO_STYLE))) {
			continue;
		}
		var val = item.getData(field);
	 	if (val == value)
			item.setChecked(true, skipNotify);
	}
};

/**
 * Programmatically selects a menu item. The item can be specified with an index,
 * or as the next or previous item based on which item is currently selected. If
 * the new item is a separator or is disabled, it won't be selected. Instead, the
 * next suitable item will be used.
 * 
 * @param {boolean|number}	which		if <code>true</code>, selects the next menu item
 * 									if <code>false</code>, selects the previous menu item
 * 									if <code>DwtMenuItem</code>, select that menu item
 * 									if <code>int</code>, selects the menu item with that index
 */
DwtMenu.prototype.setSelectedItem =
function(which, preventFocus) {
	var currItem = this.__currentItem;
	if (typeof(which) == "boolean") {
		currItem = !currItem
			? this._children.get(0)
			: which ? this._children.getNext(currItem) : this._children.getPrev(currItem);
	} else if (which instanceof DwtMenuItem) {
		if (this._children.contains(which))
			currItem = which;
	} else {
		which = Math.max(0, Math.min(this._children.size()-1, which));
		currItem = this._children.get(which);
	}
	// While the current item is not enabled or is a separator, try another
	while (currItem) {
		if (!currItem.isStyle) { // this is not a DwtMenuItem
			if (!preventFocus) {
				currItem.focus();
			}
			break;
		}
		else if (!currItem.isStyle(DwtMenuItem.SEPARATOR_STYLE) && currItem.getEnabled() && currItem.getVisible()) {
			break;
		}
		currItem = (which === false) ? this._children.getPrev(currItem) : this._children.getNext(currItem);
	}
	if (!currItem) { return; }

	this.scrollToItem(currItem, true);
	if (!preventFocus) {
		currItem.focus();
	}

	if (this.parent && this.parent._menuItemSelected) {
		this.parent._menuItemSelected(currItem);
	}
};

DwtMenu.prototype.clearExternallySelectedItems =
function() {
	if (this._externallySelected != null) {
		this._externallySelected._deselect();
		this._externallySelected = null;
	}
};

DwtMenu.prototype.removeChild =
function(child) {
	if (this._table) {
		if (this._style == DwtMenu.BAR_STYLE) {
			var cell = child.getHtmlElement().parentNode;
			this._table.rows[0].deleteCell(Dwt.getCellIndex(cell));
		} else {
			var el = child.getHtmlElement();
			if (el && el.parentNode && el.parentNode.parentNode.rowIndex > -1)// Make sure that the element exists in the table
				this._table.deleteRow(el.parentNode.parentNode.rowIndex);
		}
	}
	this._children.remove(child);

    if (child.removeSelectionListener) {
        child.removeSelectionListener(this._itemSelectionListener);
    }
};

DwtMenu.prototype.addChild = 
function(child) {
    DwtComposite.prototype.addChild.apply(this, arguments);
    // Color pickers and calendars are not menu aware so we have to deal with
	// them acordingly
	if (Dwt.instanceOf(child, "DwtColorPicker") || Dwt.instanceOf(child, "DwtCalendar") ||
	    (this._style == DwtMenu.GENERIC_WIDGET_STYLE)) {
		
		this._addItem(child);
	}

    if (child.addSelectionListener) {
        child.addSelectionListener(this._itemSelectionListener);
    }
};

// All children are added now, including menu items. Previously, it wasn't
// reparenting and that was preventing the menu items from using templates
// because they need to be in the DOM in order to get access to elements
// within the template.
DwtMenu.prototype._addItem =
function(item, index) {
	if (this._style == DwtMenu.COLOR_PICKER_STYLE ||
		this._style == DwtMenu.CALENDAR_PICKER_STYLE ||
		this._style == DwtMenu.GENERIC_WIDGET_STYLE)
	{
		return;
	}

	var row;
	var col;
	if (this._style == DwtMenu.BAR_STYLE) {
		var rows = this._table.rows;
		row = (rows.length != 0) ? rows[0]: this._table.insertRow(0);
		if (index == null || index > row.cells.length)
			index = rows.cells.length;
		col = row.insertCell(index);
		col.align = "center";
		col.vAlign = "middle";
		var spc = row.insertCell(-1);
		spc.nowrap = true;
		spc.width = "7px";
	} else {
		// If item we're adding is check/radio style, and its the first such
		// item in the menu, then we must instruct our other children to add 
		// a "checked column" to ensure that things line up
		if (item.isStyle && (item.isStyle(DwtMenuItem.CHECK_STYLE) || item.isStyle(DwtMenuItem.RADIO_STYLE))) {
			this._checkItemAdded();
		}
		if (index == null || index > this._table.rows.length)
			index = -1;
		row = this._table.insertRow(index);
		col = row.insertCell(0);
	}
	col.noWrap = true;
	row.setAttribute('role', 'none');
	col.setAttribute('role', 'none');
	col.appendChild(item.getHtmlElement());
//	this._children.add(item, index);
};

DwtMenu.prototype._radioItemSelected =
function(child, skipNotify) {
	var radioGroupId = child._radioGroupId;
	var sz = this._children.size();
	var a = this._children.getArray();
	for (var i = 0; i < sz; i++) {
		if (a[i] != child && a[i].isStyle(DwtMenuItem.RADIO_STYLE) &&
			a[i]._radioGroupId == radioGroupId && a[i]._itemChecked)
		{
			a[i].setChecked(false, skipNotify);
			break;
		}
	}
};

DwtMenu.prototype._propagateItemSelection = function(evt) {
    if (this.isListenerRegistered(DwtEvent.SELECTION)) {
        this.notifyListeners(DwtEvent.SELECTION, evt);
    }
};

DwtMenu.prototype._menuHasCheckedItems =
function() {
	return this._menuItemsHaveChecks;
};

DwtMenu.prototype._menuHasItemsWithIcons =
function() {
	return this._menuItemsHaveIcons;
};

DwtMenu.prototype._menuHasSubmenus =
function() {
	return (this._menuItemsWithSubmenus > 0);
};

/* Once an icon is added to any menuItem, then the menu will be considered
 * to contain menu items with icons in perpetuity */
DwtMenu.prototype._iconItemAdded =
function(item) {
	if (!this._menuItemsHaveIcons) Dwt.addClass(this.getHtmlElement(), DwtMenu.HAS_ICON);
	this._menuItemsHaveIcons = true;
};

/* Once an check/radio is added to any menuItem, then the menu will be considered
 * to contain checked items in perpetuity */
DwtMenu.prototype._checkItemAdded = function(item) {
	if (!this._menuItemsHaveChecks) Dwt.addClass(this.getHtmlElement(), DwtMenu.HAS_CHECK);
	this._menuItemsHaveChecks = true;
};

DwtMenu.prototype._submenuItemAdded =
function() {
	Dwt.addClass(this.getHtmlElement(), DwtMenu.HAS_SUBMENU);
	this._menuItemsWithSubmenus++;
};

DwtMenu.prototype._submenuItemRemoved =
function() {
	if (this._menuItemsWithSubmenus == 1) {
		var sz = this._children.size();
		var a = this._children.getArray();
		for (var i = 0; i < sz; i++)
			a[i]._submenuItemRemoved();
	}
	this._menuItemsWithSubmenus--;
	if (this._menuItemsWithSubmenus == 0) {
		Dwt.delClass(this.getHtmlElement(), DwtMenu.HAS_SUBMENU);
	}
};

DwtMenu.prototype._popdownSubmenus = function() {
	var sz = this._children.size();
	var a = this._children.getArray();
	for (var i = 0; i < sz; i++) {
		if (a[i]._popdownMenu) a[i]._popdownMenu();
	}
};

DwtMenu.prototype.dontStealFocus =
function(val) {
	if (val == null)
		val = true;
	this.__preventMenuFocus = !!val;
};

DwtMenu.prototype._doPopup =
function(x, y, kbGenerated) {

	// bump z-index if we're inside a dialog
	var zIndex = DwtBaseDialog.getActiveDialog() ? Dwt.Z_DIALOG_MENU : Dwt.Z_MENU;
	this.setZIndex(zIndex);
	this.setVisible(true);

	this.render(x, y);

	var isScroll = this._layoutStyle == DwtMenu.LAYOUT_SCROLL;
	var isCascade = this._layoutStyle == DwtMenu.LAYOUT_CASCADE;
	if (!isScroll) {
		this.setScrollStyle(this._isPopupStyle() && isCascade ? Dwt.CLIP : Dwt.SCROLL);
	} else if (this._tableContainer) {
		Dwt.setScrollStyle(this._tableContainer, Dwt.CLIP);
	}
	
	this.notifyListeners(DwtEvent.POPUP, this);

	// Hide the tooltip
	var tooltip = this.shell.getToolTip();
	if (tooltip) {
		tooltip.popdown();
	}

	this._popupActionId = -1;
	this._isPoppedUp = true;

	var omem = DwtOutsideMouseEventMgr.INSTANCE;
	var omemParams = {
		id:					"DwtMenu",
		obj:				this,
		outsideListener:	this._outsideListener
	}
	omem.startListening(omemParams);

	if (!DwtMenu._activeMenu) {
		DwtMenu._activeMenu = this;
		DwtMenu._activeMenuUp = true;
	}

	DwtMenu._activeMenuIds.add(this._htmlElId, null, true);
	DwtMenu._activeMenuIds.sort();	
	DwtMenu._activeMenus.add(this, null, true);

	// Put our tabgroup in play
	DwtShell.getShell(window).getKeyboardMgr().pushTabGroup(this._compositeTabGroup, this.__preventMenuFocus);

	/* If the popup was keyboard generated, then pick the first enabled child
	   item */
	if (kbGenerated || !this.parent.isDwtMenu) {
	 	this.setSelectedItem(0, this.__preventMenuFocus);
	}
};

DwtMenu.prototype.getSize =
function(incScroll) {
	var size;
	if (this._table) {
		size = Dwt.getSize(this._table, incScroll);
	} else {
		size = DwtComposite.prototype.getSize.call(this, incScroll);
	}
	if (this._width && this._width > size.x) size.x = this._width;
	return size;
};

DwtMenu.prototype._doPopdown =
function(ev) {
	// Notify all sub menus to pop themselves down
	var a = this._children.getArray();
	var s = this._children.size();
	for (var i = 0; i < s; i++) {
		if ((a[i] instanceof DwtMenuItem) && !(a[i].isStyle(DwtMenuItem.SEPARATOR_STYLE))) {
			a[i]._popdownMenu();
		}
	}
	this.setVisible(false);
	this._ev = ev;

	this.notifyListeners(DwtEvent.POPDOWN, this);

	var omem = DwtOutsideMouseEventMgr.INSTANCE;
	omem.stopListening({id:"DwtMenu", obj:this});

	if (DwtMenu._activeMenu == this) {
		DwtMenu._activeMenu = null;
		DwtMenu._activeMenuUp = false;
	}
	DwtMenu._activeMenuIds.remove(this._htmlElId);
	DwtMenu._activeMenus.remove(this);
	this._popdownActionId = -1;
	this._isPoppedUp = false;

	if (this._isPopupStyle() && this._table && this._table.rows && this._table.rows.length && this._table.rows[0].cells.length)	{
		var numColumns = this._table.rows[0].cells.length;
		var numRows = this._table.rows.length;
		for (var i = 1; i < numColumns; i++) {
			for (var j = 0; j < numRows; j++) {
				var cell = this._table.rows[j].cells[i];
				if (!cell.empty) {
					var child = cell.firstChild;
					var row = this._table.insertRow(this._table.rows.length);
					var cell = row.insertCell(0);
					while (child != null) {
						cell.appendChild(child);
						child = child.nextSibling;
					}
				}
			}
		}
		for (var j = 0; j < numRows; j++) {
			var row = this._table.rows[j];
			for (var i = row.cells.length - 1; i > 0; i--) {
				row.deleteCell(i);
			}
		}
	}

	if (this.__currentItem) {
		this.__currentItem.blur();
	}

	// Take our tabgroup out of play
	DwtShell.getShell(window).getKeyboardMgr().popTabGroup(this._compositeTabGroup);
};

DwtMenu.prototype._getActiveItem = 
function(){
	var a = this._children.getArray();
	var s = this._children.size();
	for (var i = 0; i < s; i++) {
		if (a[i]._isMenuPoppedUp())
			return a[i];
	}
	return null;
};

DwtMenu._outsideMouseDownListener =
function(ev) {

	if (DwtMenu._activeMenuUp) {
		var menu = DwtMenu._activeMenu;

		// assuming that the active menu is the parent of all other menus
		// that are up, search through the array of child menu dom IDs as
		// well as our own.
		var id = menu._htmlElId;
		var htmlEl = DwtUiEvent.getTarget(ev);
		while (htmlEl != null) {
			if (htmlEl.id && htmlEl.id != "" && 
				(htmlEl.id == id || htmlEl.id == menu._associatedElId ||
				 DwtMenu._activeMenuIds.binarySearch(htmlEl.id) != -1 )) {
				return false;
			}
			htmlEl = htmlEl.parentNode;
		}

		// If we've gotten here, the mousedown happened outside the active
		// menu, so we hide it.
		menu.popdown(0, ev);
		
		//it should remove all the active menus 
		var cMenu = null ;
		do {
			cMenu = DwtMenu._activeMenus.getLast();
			if (cMenu!= null && cMenu instanceof DwtMenu) cMenu.popdown();
		} while (cMenu != null) ;
	}
};

DwtMenu._stopEvent = function(e) {
	if (!e) e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) {
		e.stopPropagation();
	}
};

/*
* Returns true if any menu is currently popped up.
*/
DwtMenu.menuShowing =
function() {
	return DwtMenu._activeMenuUp;
};

DwtMenu.closeActiveMenu =
function(ev) {
	if (DwtMenu._activeMenuUp) {
		DwtMenu._activeMenu.popdown(0, ev);
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtShell")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a shell.
 * @constructor
 * @class
 * This class represents a shell, the first widget that must be instantiated in a Dwt based 
 * application. By default the shell covers the whole browser window, though it may also be 
 * instantiated within an HTML element.
 * <p>
 * {@link DwtShell} should <b>NOT</b> be subclassed.
 * </p>
 *
 * @author Ross Dargahi
 * 
 * @param	{hash}	params		a hash of parameters
 * @param {string}	params.className			the CSS class name
 * @param {boolean}	params.docBodyScrollable	if <code>true</code>, then the document body is set to be scrollable
 * @param {Element}	params.userShell			an HTML element that will be reparented into an absolutely
 *											postioned container in this shell. This is useful in the situation where you have an HTML 
 *											template and want to use this in context of Dwt.
 * @param {Boolean}	params.useCurtain			if <code>true</code>, a curtain overlay is created to be used between hidden and viewable elements 
 *											using z-index (see {@link Dwt}) for various layering constants)
 *
 * @extends		DwtComposite
 */
DwtShell = function(params) {
	if (window._dwtShellId) {
		throw new DwtException("DwtShell already exists for window", DwtException.INVALID_OP, "DwtShell");
	}

	var className = params.className || "DwtShell";
	DwtComposite.call(this, {className:className});

	// HACK! This is a hack to make sure that the control methods work 
	// with DwtShell since the parent of DwtShell is null. 
	this.__ctrlInited = true;

	document.body.style.margin = 0;
	if (!params.docBodyScrollable) {
		if (AjxEnv.isIE) {
			document.body.onscroll = DwtShell.__onBodyScroll;
		}
		document.body.style.overflow = "hidden";
	}

	document.body.onselect = DwtShell._preventDefaultSelectPrt;
	document.body.onselectstart = DwtShell._preventDefaultSelectPrt;
	document.body.oncontextmenu = DwtShell._preventDefaultPrt;
	window.onresize = DwtShell._resizeHdlr;

	var htmlElement = document.createElement("div");
	this._htmlElId = window._dwtShellId = htmlElement.id = params.id || Dwt.getNextId();
	DwtControl.ALL_BY_ID[this._htmlElId] = this;

	htmlElement.className = className;
	htmlElement.style.width = htmlElement.style.height = "100%";
	Dwt.setPosition(htmlElement, DwtControl.ABSOLUTE_STYLE);

	if (htmlElement.style.overflow) {
		htmlElement.style.overflow = null;
	}

	// if there is a user shell (body content), move it below this shell
	// into a container that's absolutely positioned
	try {
		if (params.userShell) {
			document.body.removeChild(params.userShell);
		}
	} catch (ex) {}
	document.body.appendChild(htmlElement);
	if (params.userShell) {
		var userShellContainer = new DwtControl({parent:this, posStyle:Dwt.ABSOLUTE_STYLE});
		userShellContainer.getHtmlElement().appendChild(params.userShell);
		userShellContainer.setSize("100%", "100%");
		userShellContainer.zShow(true);
		this._userShell = params.userShell;
	} else {
		this._userShell = null;
	}
	this.shell = this;

	// Busy overlay - used when we want to enforce a modal busy state
	this._createBusyOverlay(htmlElement);

	// Veil overlay - used by DwtDialog to disable underlying app
	this._veilOverlay = document.createElement("div");
	this._veilOverlay.className = "VeilOverlay";
	this._veilOverlay.style.position = "absolute";
	this._veilOverlay.style.cursor = "not-allowed";
	this._veilOverlay.veilZ = new Array();
	this._veilOverlay.veilZ.push(Dwt.Z_HIDDEN);
	this._veilOverlay.dialogZ = new Array();
	this._veilOverlay.activeDialogs = new Array();
	this._veilOverlay.innerHTML = "<table role='presentation' cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
	htmlElement.appendChild(this._veilOverlay);
	Dwt.setBounds(this._veilOverlay, 0, 0, "100%", "100%");
	Dwt.setZIndex(this._veilOverlay, Dwt.Z_HIDDEN);

	// Curtain overlay - used between hidden and viewable elements using z-index
	if (params.useCurtain) {
		this._curtainOverlay = document.createElement("div");
		this._curtainOverlay.className = "CurtainOverlay";
		this._curtainOverlay.style.position = "absolute";
		this._curtainOverlay.innerHTML = "<table role='presentation' cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
		htmlElement.appendChild(this._curtainOverlay);
		Dwt.setBounds(this._curtainOverlay, 0, 0, "100%", "100%")
		Dwt.setZIndex(this._curtainOverlay, Dwt.Z_CURTAIN);
	}

	this._uiEvent = new DwtUiEvent(true);
	this.relayout();

	// tooltip singleton used by all controls in shell
	this._toolTip = new DwtToolTip(this);
	this._hoverMgr = new DwtHoverMgr();
	
	this._keyboardMgr = new DwtKeyboardMgr(this);
}

DwtShell.prototype = new DwtComposite;
DwtShell.prototype.constructor = DwtShell;

/**
 * DwtDialog not defined yet, can't base ID on it
 * @private
 */
DwtShell.CANCEL_BUTTON = -1;

// Event objects used to populate events so we dont need to create them for each event
DwtShell.controlEvent 	= new DwtControlEvent();
DwtShell.focusEvent 	= new DwtFocusEvent();
DwtShell.keyEvent 		= new DwtKeyEvent();
DwtShell.mouseEvent 	= new DwtMouseEvent();
DwtShell.selectionEvent = new DwtSelectionEvent(true);
DwtShell.treeEvent 		= new DwtTreeEvent();

DwtShell._GLOBAL_SELECTION = "GlobalSelection";

// Public methods

DwtShell.prototype.toString = 
function() {
	return "DwtShell";
}

/**
 * Gets the shell managing the browser window (if any).
 *
 * @param {Window}      win     the global context
 * @return {DwtShell}		the shell or <code>null</code>
 */
DwtShell.getShell = function(win) {
    win = win || window;
	return DwtControl.fromElementId(win._dwtShellId);
};

/**
 * Gets the shell's keyboard manager.
 * 
 * @return	{DwtKeyboardMgr}		the keyboard manager
 * 
 * @private
 */
DwtShell.prototype.getKeyboardMgr =
function() {
	return this._keyboardMgr;
}

/**
 * Sets the busy overlay. The busy overlay disables input to the application and makes the 
 * cursor a wait cursor. Optionally a work in progress (WIP) dialog may be requested. Since
 * multiple calls to this method may be interleaved, it accepts a unique ID to keep them
 * separate. We also maintain a count of outstanding calls to <code>setBusy(true)</code>. When that count
 * changes between 0 and 1, the busy overlay is applied or removed.
 * 
 * @param {boolean}	busy			if <code>true</code>, set the busy overlay, otherwise hide the busy overlay
 * @param {number}	id					a unique ID for this instance
 * @param {boolean}	showBusyDialog 		if <code>true</code>, show the WIP dialog
 * @param {number}	busyDialogDelay 		the number of ms to delay before popping up the WIP dialog
 * @param {AjxCallback}	cancelBusyCallback	the callback to run when OK button is pressed in WIP dialog
 */ 
DwtShell.prototype.setBusy =
function(busy, id, showBusyDialog, busyDialogDelay, cancelBusyCallback) {
	if (busy) {
		this._setBusyCount++;
	} else if (this._setBusyCount > 0) {
		this._setBusyCount--;
	}

    if (!this._setBusy && (this._setBusyCount > 0)) {
		// transition from non-busy to busy state
		Dwt.setCursor(this._busyOverlay, "wait");
    	Dwt.setVisible(this._busyOverlay, true);
    	this._setBusy = this._blockInput = true;
    	DBG.println(AjxDebug.DBG2, "set busy overlay, id = " + id);
    } else if (this._setBusy && (this._setBusyCount <= 0)) {
		// transition from busy to non-busy state
	    Dwt.setCursor(this._busyOverlay, "default");
	    Dwt.setVisible(this._busyOverlay, false);
	    this._setBusy = this._blockInput = false;
    	DBG.println(AjxDebug.DBG2, "remove busy overlay, id = " + id);
	}
	
	// handle busy dialog whether we've changed state or not
	if (busy && showBusyDialog) {
		if (busyDialogDelay && busyDialogDelay > 0) {
			this._busyActionId[id] = AjxTimedAction.scheduleAction(this._busyTimedAction, busyDialogDelay);
		} else {
			this._showBusyDialogAction(id);
		}

		this._cancelBusyCallback = cancelBusyCallback;
		if (this._busyDialog) {
			this._busyDialog.setButtonEnabled(DwtShell.CANCEL_BUTTON, (cancelBusyCallback != null));
		}
	} else {
    	if (this._busyActionId[id] && (this._busyActionId[id] != -1)) {
    		AjxTimedAction.cancelAction(this._busyActionId[id]);
    		this._busyActionId[id] = -1;
    	}
   		if (this._busyDialog && this._busyDialog.isPoppedUp) {
    		this._busyDialog.popdown();
   		}
    } 
}

// (hee hee)
DwtShell.prototype.getBusy =
function() {
	return this._setBusy;
};

/**
 * Sets the text for the shell busy dialog
 *
 * @param {string}	text 		the text to set (may be HTML)
 */
DwtShell.prototype.setBusyDialogText =
function(text) {
	this._busyDialogText = text;
	if (this._busyDialogTxt) {
		this._busyDialogTxt.innerHTML = (text) ? text : "";
	}
}

/**
 * Sets the shell busy dialog title.
 * 
 * @param {string}	title 		the title text
 */
DwtShell.prototype.setBusyDialogTitle =
function(title) {
	this._busyDialogTitle = title;
	if (this._busyDialog) {
		this._busyDialog.setTitle((title) ? title : AjxMsg.workInProgress);
	}
}

DwtShell.prototype.getHoverMgr = 
function() {
	return this._hoverMgr;
}

/**
 * Gets the tool tip.
 * 
 * @return	{string}	the tool tip
 */
DwtShell.prototype.getToolTip = 
function() {
	return this._toolTip;
}

DwtShell.prototype.getH = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll).y
	                        : Dwt.getSize(document.body, incScroll).y;
}

DwtShell.prototype.getW = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll).x
	                        : Dwt.getSize(document.body, incScroll).x;
}

DwtShell.prototype.getSize = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getSize(this.getHtmlElement(), incScroll)
	                        : Dwt.getSize(document.body, incScroll);
}

DwtShell.prototype.getLocation =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement())
	                        : Dwt.getLocation(document.body);
}

DwtShell.prototype.getX =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement()).x
	                        : Dwt.getLocation(document.body).x;
}

DwtShell.prototype.getY =
function() {
	return (!this._virtual) ? Dwt.getLocation(this.getHtmlElement()).y
	                        : Dwt.getLocation(document.body).y;
}


DwtShell.prototype.getBounds = 
function(incScroll) {
	return (!this._virtual) ? Dwt.getBounds(this.getHtmlElement(), incScroll)
	                        : Dwt.getBounds(document.body, incScroll);
}

/**
 * If the shell is set as a virtual shell, then all children that are 
 * directly added to the shell become children on the page's body element. This
 * is useful in the cases where Dwt is to beused  with existing HTML documents
 * rather than as the foundation for an application.
 * 
 * @private
 */
DwtShell.prototype.setVirtual =
function() {
	this._virtual = true;
	this.setVisible(false);
}

/**
 * Adds a focus listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtShell.prototype.addFocusListener =
function(listener) {
	if (!this._hasFocusHandler) {
		var doc = document;
		if ((typeof doc.onfocusin != "undefined" ) && doc.attachEvent) {  // if (IE)
			doc.attachEvent("onfocusin", DwtShell.__focusHdlr);
		} else if (window.addEventListener) {
			window.addEventListener("focus", DwtShell.__focusHdlr, false);
		}
		this._hasFocusHandler = true;
	}
	this.addListener(DwtEvent.ONFOCUS, listener);
};

/**
 * Adds a blur listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtShell.prototype.addBlurListener =
function(listener) {
	if (!this._hasBlurHandler) {
		var doc = document;
		if ((typeof doc.onfocusin != "undefined" ) && doc.attachEvent) {  // if (IE)
			doc.attachEvent("onfocusout", DwtShell.__blurHdlr);
		} else if (window.addEventListener) {
			window.addEventListener("blur", DwtShell.__blurHdlr, false);
		}
		this._hasBlurHandler = true;
	}
	this.addListener(DwtEvent.ONBLUR, listener);
};

/**
 * Adds a global selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtShell.prototype.addGlobalSelectionListener =
function(listener) {
	this.addListener(DwtShell._GLOBAL_SELECTION, listener);
};

/**
 * Removes a global selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtShell.prototype.removeGlobalSelectionListener =
function(listener) {
	this.removeListener(DwtShell._GLOBAL_SELECTION, listener);
};

DwtShell.prototype.notifyGlobalSelection =
function(event) {
	this.notifyListeners(DwtShell._GLOBAL_SELECTION, event);
};

/**
 * @return {boolean}	<code>true</code> if the shell is virtual
 * 
 * @private
 */
DwtShell.prototype.isVirtual =
function() {
	return this._virtual;
}


// Private / protected methods

DwtShell.prototype._showBusyDialogAction =
function(id) {
	var bd = this._getBusyDialog();
	bd.popup();
	this._busyActionId[id] = -1;
}

DwtShell.prototype._createBusyOverlay =
function(htmlElement) {
    this._busyOverlay = document.createElement("div");
    this._busyOverlay.className = "BusyOverlay";
    this._busyOverlay.style.position = "absolute";
    this._busyOverlay.innerHTML = "<table role='presentation' cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
    htmlElement.appendChild(this._busyOverlay);
	Dwt.setBounds(this._busyOverlay, 0, 0, "100%", "100%")
	Dwt.setZIndex(this._busyOverlay, Dwt.Z_VEIL);
	Dwt.setVisible(this._busyOverlay, false);

	this._busyTimedAction = new AjxTimedAction(this, this._showBusyDialogAction);
	this._busyActionId = {};
	
	this._setBusyCount = 0;
	this._setBusy = false;
}

DwtShell.prototype._getBusyDialog =
function(htmlElement) {
	if (!this._busyDialog) {
		var cancelButton = new DwtDialog_ButtonDescriptor(DwtShell.CANCEL_BUTTON, AjxMsg.cancelRequest, DwtDialog.ALIGN_CENTER);
	    this._busyDialog = new DwtDialog({parent:this, className:"DwtShellBusyDialog", title:AjxMsg.workInProgress,
	    								  standardButtons:DwtDialog.NO_BUTTONS, extraButtons:[cancelButton], zIndex:Dwt.BUSY + 10});
	    this._busyDialog.registerCallback(DwtShell.CANCEL_BUTTON, this._busyCancelButtonListener, this);
	    var txtId = Dwt.getNextId();
	    var html = [
	        "<table class='DialogContent'><tr>",
	            "<td><div class='WaitIcon'></div></td><td class='MsgText' id='", txtId, "'>&nbsp;</td>",
	        "</tr></table>"].join("");
	    
	    this._busyDialog.setContent(html);
	    this._busyDialogTxt = document.getElementById(txtId);
		if (this._busyDialogText) {
			this._busyDialogTxt.innerHTML = this._busyDialogText;
		}
		if (this._busyDialogTitle) {
			this._busyDialog.setTitle(this._busyDialogTitle);
		}
		this._busyDialog.setButtonEnabled(DwtShell.CANCEL_BUTTON, (this._cancelBusyCallback != null));
	}
	return this._busyDialog;
};

/**
 *
 * Relayout user skin elements. Called whenever hiding or showing a
 * part of the user skin, or when resizing the window.
 *
 * The layout works on elements of class "skin_layout_filler" -- which
 * must also be of either class "skin_layout_row" or
 * "skin_layout_cell". It finds the size of our parent, subtract the
 * sizes all sibling rows or cells (excluding other fillers) and
 * divide the remaining size between this filler and any sibling
 * fillers.
 */
DwtShell.prototype.relayout =
function() {
    this._currWinSize = Dwt.getWindowSize();

    if (this._userShell) {
        var fillers = Dwt.byClassName('skin_layout_filler', this._userShell);

        AjxUtil.foreach(fillers, function(elem) {
            if (Dwt.hasClass(elem, 'skin_layout_row')) {
                var row = elem;
                var table = row.parentNode;
                var height = Dwt.getSize(table).y;
                var nfillers = 0;

                var insets = Dwt.getInsets(table);
                height -= insets.top + insets.bottom;
                var margins = Dwt.getMargins(row);
                height -= margins.top + margins.bottom;

                AjxUtil.foreach(table.children, function(otherrow) {
                    var margins = Dwt.getMargins(otherrow);
                    height -= margins.top + margins.bottom;

                    if (Dwt.hasClass(otherrow, 'skin_layout_filler')) {
                        nfillers += 1;
                    } else {
                        var otherheight = Dwt.getSize(otherrow).y;

                        AjxUtil.foreach(otherrow.children, function(cell) {
                            var margins = Dwt.getMargins(cell);
                            var height = Dwt.getSize(cell).y +
                                margins.top + margins.bottom;
                            otherheight = Math.max(otherheight, height);
                        });

                        height -= otherheight;
                    }
                });

                row.style.height = Math.max(height / nfillers, 0) + 'px';

            } else if (Dwt.hasClass(elem, 'skin_layout_cell')) {
                var cell = elem;
                var row = cell.parentNode;
                var table = row.parentNode;
                var width = Dwt.getSize(table).x;
                var nfillers = 0;

                var insets = Dwt.getInsets(table);
                width -= insets.left + insets.right;
                var margins = Dwt.getMargins(row);
                width -= margins.left + margins.right;

                AjxUtil.foreach(row.children, function(othercell) {
                    var margins = Dwt.getMargins(othercell);
                    width -= margins.left + margins.right;

                    if (Dwt.hasClass(othercell, 'skin_layout_filler')) {
                        nfillers += 1;
                    } else {

						if (cell.id === "skin_td_main" && othercell.id === "skin_td_tree_app_sash" &&
							AjxEnv.isChrome && !AjxUtil.isInt(window.devicePixelRatio)) {
							// See bug #96808.
							// Chrome seems to change the hardcoded pixel value.
							// Depending on the zoom level it fluctuates +/- 1. This messes up elements' width calculation.
							// The problematic element is #skin_td_tree_app_sash when calculating width for #skin_td_main.
							// The value of sash's width is set in skins.
							// Decreasing the width by 3 works on all zoom levels.
							// Only do this on non-integer devicePixelRatio
							// (e.g. skip 100% zoom on retina and non-retina displays where devicePixelRatio is 2 and 1).
							width -= 3;
						}

                        width -= Dwt.getSize(othercell).x;
                    }
                });

                cell.style.width = Math.max(width / nfillers, 0) + 'px';

            } else if (window.console) {
                console.warn('not fixing sizes for element!', elem);
            }
        });
    }
};

// Listeners

DwtShell.prototype._busyCancelButtonListener =
function(ev) {
	this._cancelBusyCallback.run();
	if (this._busyDialog) {
		this._busyDialog.popdown();
	}
}


// Static methods

DwtShell._preventDefaultSelectPrt =
function(ev) {
    var evt = DwtControl.fromElementId(window._dwtShellId)._uiEvent;
    evt.setFromDhtmlEvent(ev, true);

	if (evt.dwtObj && evt.dwtObj instanceof DwtControl && !evt.dwtObj.preventSelection(evt.target)) {
        evt._stopPropagation = false;
        evt._returnValue = true;
    } else {
        evt._stopPropagation = true;
        evt._returnValue = false;
    }
    evt.setToDhtmlEvent(ev);
    return !evt._stopPropagation;
};

DwtShell._preventDefaultPrt =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var target = ev.target ? ev.target : ev.srcElement;
	
    var evt = DwtControl.fromElementId(window._dwtShellId)._uiEvent;
    evt.setFromDhtmlEvent(ev, true);
	//default behavior
    evt._stopPropagation = true;
    evt._returnValue = false;
	if (evt.dwtObj && evt.dwtObj instanceof DwtControl && !evt.dwtObj.preventContextMenu(evt.target)) {
        evt._stopPropagation = false;
        evt._returnValue = true;
    } else if (target != null && typeof(target) == 'object') {
     	if ((target.tagName == "A" ||  target.tagName == "a") && target.href) {
	        evt._stopPropagation = false;
    	    evt._returnValue = true;
    	}
    } 
    
    evt.setToDhtmlEvent(ev);
    return evt._returnValue;
};


/* This the resize handler to track when the browser window size changes */
DwtShell._resizeHdlr =
function(ev) {
	var shell = DwtControl.fromElementId(window._dwtShellId);
	if (shell.isListenerRegistered(DwtEvent.CONTROL)) {
	 	var evt = DwtShell.controlEvent;
	 	evt.reset();
	 	evt.oldWidth = shell._currWinSize.x;
	 	evt.oldHeight = shell._currWinSize.y;
		shell.relayout();
	 	evt.newWidth = shell._currWinSize.x;
	 	evt.newHeight = shell._currWinSize.y;
	 	shell.notifyListeners(DwtEvent.CONTROL, evt);
	} else {
		shell.relayout();
	}
};

DwtShell.__onBodyScroll = function() {
	// alert(document.body.scrollTop + "/" + document.body.scrollLeft);
	document.body.scrollTop = 0;
	document.body.scrollLeft = 0;
	// DwtShell._resizeHdlr();
};

DwtShell.__focusHdlr =
function() {
	var focusEvent = DwtShell.focusEvent;
	var self = DwtShell.getShell(window);
	focusEvent.dwtObj = self;
	focusEvent.state = DwtFocusEvent.FOCUS;
	self.notifyListeners(DwtEvent.ONFOCUS, focusEvent);
};

DwtShell.__blurHdlr =
function() {
	var focusEvent = DwtShell.focusEvent;
	var self = DwtShell.getShell(window);
	focusEvent.dwtObj = self;
	focusEvent.state = DwtFocusEvent.BLUR;
	self.notifyListeners(DwtEvent.ONBLUR, focusEvent);
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtSelect")) {
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
 * Creates a select element.
 * @constructor
 * @class
 * Widget to replace the native select element.
 * <p>
 * Note: Currently this does not support multiple selection.
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}      params.parent		the parent widget
 * @param {array}      params.options 		a list of options. This can be either an array of {@link DwtSelectOption} or {String} objects.
 * @param {string}      params.className		the CSS class
 * @param {constant}      params.posStyle		the positioning style (see {@link DwtControl})
 * @param {boolean}      [layout=true]		layout to use: DwtMenu.LAYOUT_STACK, DwtMenu.LAYOUT_CASCADE or DwtMenu.LAYOUT_SCROLL. A value of [true] defaults to DwtMenu.LAYOUT_CASCADE and a value of [false] defaults to DwtMenu.LAYOUT_STACK.
 *        
 * @extends		DwtButton
 *
 * TODO: add option to keep options sorted by display text
 */
DwtSelect = function(params) {

	if (arguments.length == 0) { return; }

	params = Dwt.getParams(arguments, DwtSelect.PARAMS);
	params.className = params.className || "ZSelect";
	params.posStyle = params.posStyle || Dwt.STATIC_STYLE;
	this._legendId = params.legendId;
    DwtButton.call(this, params);

	var events = AjxEnv.isIE ? [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP] :
							   [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT];
	this._setEventHdlrs(events);
	this._hasSetMouseEvents = true;

    // initialize some variables
    this._currentSelectedOption = null;
    this._options = new AjxVector();
    this._optionValuesToIndices = {};
    this._selectedValue = this._selectedOption = null;
	this._maxRows = params.maxRows || 0;
	this._layout = params.layout;
    this._congruent = params.congruent;
    this._hrCount = 0;

    // add options
    var options = params.options;
    if (options) {
        for (var i = 0; i < options.length; ++i) {
            this.addOption(options[i]);
        }
    }

    this.setAttribute("aria-expanded", false);

    // setup display
    this.setDropDownImages("SelectPullDownArrow",			// normal
                           "SelectPullDownArrowDis",		// disabled
                           "SelectPullDownArrow",			// hover
                           "SelectPullDownArrow");			// down

    // add listeners
    this._menuCallback = new AjxListener(this, this._createMenu);
    this.setMenu(this._menuCallback, true);
};

DwtSelect.PARAMS = ["parent", "options", "style", "className", "layout"];

DwtSelect.prototype = new DwtButton;
DwtSelect.prototype.constructor = DwtSelect;

DwtSelect.prototype.isDwtSelect = true;
DwtSelect.prototype.toString = function() { return "DwtSelect"; };

DwtSelect.prototype.role = 'combobox';

//
// Constants
//

/**
 * This template is only used for the auto-sizing of the select width.
 * 
 * @private
 */
DwtSelect._CONTAINER_TEMPLATE = "dwt.Widgets#ZSelectAutoSizingContainer";

//
// Data
//

// static

/**
 * This keeps track of all instances out there
 * 
 * @private
 */
DwtSelect._objectIds = [null];

// templates

DwtSelect.prototype.TEMPLATE = "dwt.Widgets#ZSelect";

//
// Public methods
//

// static

DwtSelect.getObjectFromElement =
function(element) {
	return element && element.dwtObj
		? AjxCore.objectWithId(element.dwtObj) : null;
};

// other

/**
 * Adds an option.
 * 
 * @param {string|DwtSelectOption|DwtSelectOptionData}		option			a {String} for the option value or the {@link DwtSelectOption} object
 * @param {boolean}	[selected]		indicates whether option should be the selected option
 * @param {Object}	value			if the option parameter is a {@link DwtSelectOption}, this will override the value already set in the option.
 * @param {String}  image	(optional)
 * @return 	{number} a handle to the newly added option
 *
 * TODO: support adding at an index
 */
DwtSelect.prototype.addOption =
function(option, selected, value, image) {

	if (!option) { return -1; }
	image = image || null;

	var opt = null;
	var val = null;
    var id = null;
	if (typeof(option) == 'string') {
		val = value != null ? value : option;
		opt = new DwtSelectOption(val, selected, option, this, null, image);
	} else {
		if (option instanceof DwtSelectOption) {
			opt = option;
			if (value) {
				opt.setValue(value);
			}
			selected = opt.isSelected();
		} else if(option instanceof DwtSelectOptionData || option.value != null) {
			val = value != null ? value : option.value;
			opt = new DwtSelectOption(val, option.isSelected, option.displayValue, this, null, option.image, option.selectedValue, false, option.extraData, option.id);
			selected = Boolean(option.isSelected);
            id = option.id;
		} else {
			return -1;
		}
	}

	this._options.add(opt);
	if (this._options.size() == 1 || selected) {
		this._setSelectedOption(opt);
	}

	// Insert the option into the table that's below the button.
	// This is what gives the button the same size as the select menu.
	var table = this._pseudoItemsEl;
	var row = table.insertRow(-1);
	var cell = row.insertCell(-1);
	cell.className = 'ZSelectPseudoItem';
	cell.innerHTML = [
        "<div class='ZWidgetTitle'>",
            AjxStringUtil.htmlEncode(opt.getDisplayValue()),
        "</div>"
    ].join("");

	this.fixedButtonWidth(); //good to call always to prevent future bugs due to the vertical space.

	// Register listener to create new menu.
	this.setMenu(this._menuCallback, true);

    // return the index of the option.
    this._optionValuesToIndices[opt.getValue()] = this._options.size() - 1;
    return (this._options.size() - 1);
};

DwtSelect.prototype.addHR =
function() {
    opt = new DwtSelectOption("hr" + this._hrCount.toString(), false, "", this, null, null, null, true);
    this._hrCount++;
	this._options.add(opt);
};

/**
 * Removes an option.
 *
 * @param {DwtSelectOption}		option			option to remove
 *
 * @return {number} index of the option that was removed, or -1 if there was an error
 */
DwtSelect.prototype.removeOption =
function(option) {

	if (!option) { return -1; }

	// Register listener to create new menu.
	this.setMenu(this._menuCallback, true);

	this._options.remove(option);
	var size = this._options.size();

	var value = option.getValue();
	var index = this._optionValuesToIndices[value];
	if (index != null) {
		this._pseudoItemsEl.deleteRow(index);
		if (this._selectedOption == option) {
			if (size > 0) {
				var newSelIndex = (index >= size) ? size - 1 : index;
				this._setSelectedOption(this._options.get(newSelIndex));
			}
			this.removeAttribute('aria-activedescendant');
		}
		this.fixedButtonWidth(); //good to call always to prevent future bugs due to the vertical space.
	}

	delete this._optionValuesToIndices[value];
	for (var i = index; i < size; i++) {
		var option = this._options.get(i);
		this._optionValuesToIndices[option.getValue()] = i;
	}

	return index;
};

/**
 * Removes an option based on its value.
 *
 * @param {string}		value			value of the option to remove
 *
 * @return {number} index of the option that was removed, or -1 if there was an error
 */
DwtSelect.prototype.removeOptionWithValue =
function(value) {

	var option = this.getOptionWithValue(value);
	return option ? this.removeOption(option) : -1;
};

DwtSelect.prototype.popup =
function() {
	var menu = this.getMenu();
	if (!menu) { return; }

	var selectElement = this._selectEl;
	var selectBounds = Dwt.getBounds(selectElement);
    
    // since buttons are often absolutely positioned, and menus aren't, we need x,y relative to window
	var verticalBorder = (selectElement.style.borderLeftWidth == "") ? 0 : parseInt(selectElement.style.borderLeftWidth);
	var horizontalBorder = (selectElement.style.borderTopWidth == "") ? 0 : parseInt(selectElement.style.borderTopWidth);
	horizontalBorder += (selectElement.style.borderBottomWidth == "") ? 0 : parseInt(selectElement.style.borderBottomWidth);

    var selectLocation = Dwt.toWindow(selectElement, 0, 0);
    var x = selectLocation.x + verticalBorder;
    var y = selectLocation.y + selectBounds.height + horizontalBorder;
    menu.popup(0, x, y);
    if (this._currentSelectedOption) {
        menu.setSelectedItem(this._currentSelectedOption.getItem());
    }
};

/**
 * Renames an option.
 *
 * @param {Object}	value		the value of the option to rename
 * @param {string}	newValue	the new display value
 */
DwtSelect.prototype.rename =
function(value, newValue) {

	var option = this.getOptionWithValue(value);
	if (!option) { return; }
	option._displayValue = newValue;

	if (this._selectedOption && (this._selectedOption._value == value))	{
		this.setText(AjxStringUtil.htmlEncode(newValue));
	}

	// Register listener to create new menu.
	this.setMenu(this._menuCallback, true);
};

/**
 * Enables or disables an option.
 *
 * @param {Object}	value		the value of the option to enable/disable
 * @param {boolean}	enabled		if <code>true</code>, enable the option
 */
DwtSelect.prototype.enableOption =
function(value, enabled) {
	var option = this.getOptionWithValue(value);
	if (!option) { return; }
	if (option.enabled != enabled) {
		option.enabled = enabled;
		var item = option.getItem();
		if (item) {
			item.setEnabled(enabled);
		}
	}
};

/**
 * Clears the options.
 * 
 */
DwtSelect.prototype.clearOptions =
function() {
	var opts = this._options.getArray();
	for (var i = 0; i < opts.length; ++i) {
		opts[i] = null;
	}
	this._options.removeAll();
	this._optionValuesToIndices = null;
	this._optionValuesToIndices = [];
	this._selectedValue = null;
	this._selectedOption = null;
	this._currentSelectedOption = null;
	if (this._pseudoItemsEl) {
		try {
			this._pseudoItemsEl.innerHTML = ""; //bug 81504
		}
		catch (e) {
			//do nothing - this happens in IE for some reason. Stupid IE. "Unknown runtime error".
		}
	}
};

/**
 * Sets the select name.
 * 
 * @param	{string}	name		the name
 */
DwtSelect.prototype.setName =
function(name) {
	this._name = name;
};

/**
 * Gets the select name.
 * 
 * @return	{string}	the name
 */
DwtSelect.prototype.getName =
function() {
	return this._name;
};

/**
 * Sets the selected value.
 * 
 * @param	{Object}	optionValue		the value of the option to select
 */
DwtSelect.prototype.setSelectedValue =
function(optionValue) {
    var index = this._optionValuesToIndices[optionValue];
    if (index != null) {
        this.setSelected(index);
    }
};

/**
 * Sets the option as the selected option.
 * 
 * @param {number}	optionHandle 	a handle to the option
 * 
 * @see		#addOption
 */
DwtSelect.prototype.setSelected =
function(optionHandle) {
    var optionObj = this.getOptionWithHandle(optionHandle);
	this.setSelectedOption(optionObj);
};

/**
 * Gets the option count.
 * 
 * @return	{number}	the option count
 */
DwtSelect.prototype.getOptionCount =
function() {
	return this._options.size();
};

/**
 * Gets the options.
 * 
 * @return	{AjxVector}		a vector of {@link DwtSelectOption} objects
 */
DwtSelect.prototype.getOptions =
function() {
	return this._options;
};

/**
 * Gets the option .
 * 
 * @param {number}	optionHandle 	a handle to the option
 * @return	{DwtSelectOption}	the option
 * @see		#addOption
 */
DwtSelect.prototype.getOptionWithHandle =
function(optionHandle) {
	return this._options.get(optionHandle);
};

DwtSelect.prototype.getOptionAtIndex = DwtSelect.prototype.getOptionWithHandle;

/**
 * Gets the index for a given value.
 * 
 * @param	{Object}	value		the value
 * @return	{number}		the index
 */
DwtSelect.prototype.getIndexForValue =
function(value) {
	return this._optionValuesToIndices[value];
};

/**
 * Gets the option for a given value.
 * 
 * @param	{Object}	optionValue		the value
 * @return	{DwtSelectOption}		the option
 */
DwtSelect.prototype.getOptionWithValue =
function(optionValue) {
	var index = this._optionValuesToIndices[optionValue];
	var option = null;
    if (index != null) {
        option = this.getOptionWithHandle(index);
    }
	return option;
};

/**
 * Sets the selected option.
 * 
 * @param	{Object}	optionObj		the object
 */
DwtSelect.prototype.setSelectedOption =
function(optionObj) {
	if (optionObj) {
		this._setSelectedOption(optionObj);
	}
};

/**
 * Gets the selected value.
 * 
 * @return	{Object}	the value
 */
DwtSelect.prototype.getValue =
function() {
    return this._selectedValue;
};

/**
 * Gets the selected option.
 * 
 * @return	{DwtSelectOption}	the selected option
 */
DwtSelect.prototype.getSelectedOption =
function() {
	return this._selectedOption;
};

/**
 * Gets the selected option index.
 * 
 * @return	{number}	the selected option index
 */
DwtSelect.prototype.getSelectedIndex =
function() {
	return this.getIndexForValue(this.getValue());
};

/**
 * Adds a change listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtSelect.prototype.addChangeListener =
function(listener) {
    this.addListener(DwtEvent.ONCHANGE, listener);
    this.setAttribute('aria-expanded', false);
};

/**
 * Gets the count of options.
 * 
 * @return	{number}	the count
 */
DwtSelect.prototype.size =
function() {
	return this._options.size();
};

/**
 * Disables the select.
 */
DwtSelect.prototype.disable =
function() {
	this.setEnabled(false);
};

/**
 * Enables the select.
 */
DwtSelect.prototype.enable =
function() {
	this.setEnabled(true);
};

DwtSelect.prototype.setImage =
function(imageInfo) {
	// dont call DwtButton base class!
	DwtLabel.prototype.setImage.call(this, imageInfo);
};

DwtSelect.prototype.setText =
function(text) {
	// dont call DwtButton base class!
	DwtLabel.prototype.setText.call(this, text);
};

DwtSelect.prototype.dispose =
function() {
	this._selectEl = null;
	if (this._pseudoItemsEl) {
		this._pseudoItemsEl.outerHTML = "";
		this._pseudoItemsEl = null;
	}
	this._containerEl = null;

	DwtButton.prototype.dispose.call(this);

	if (this._internalObjectId) {
		DwtSelect._unassignId(this._internalObjectId);
	}
};

//
// Protected methods
//

// static

DwtSelect._assignId =
function(anObject) {
    var myId = DwtSelect._objectIds.length;
    DwtSelect._objectIds[myId]= anObject;
    return myId;
};

DwtSelect._getObjectWithId =
function(anId) {
    return DwtSelect._objectIds[anId];
};

DwtSelect._unassignId =
function(anId) {
    DwtSelect._objectIds[anId] = null;
};

// other

/* use this in case you want the button to take as little space as needed, and not be aligned with the size of the drop-down.
	Especially useful in cases where we mess up the button (remove the text) such as in ZmFreeBusySchedulerView 
 */
DwtSelect.prototype.dynamicButtonWidth = 
function() {
	this._isDynamicButtonWidth = true; //if this is set, set this so fixedButtonWidth doesn't change this.
	this._selectEl.style.width = "auto"; //set to default in case fixedButtonWidth was called before setting it explicitely.
	this._pseudoItemsEl.style.display =  "none";
};

/*
 * Use this in case you want the select to be as wide as the widest option and
 * the options hidden so they don't overflow outside containers.
 */
DwtSelect.prototype.fixedButtonWidth =
function(){
	if (this._isDynamicButtonWidth) {
		return;
	}
	this._pseudoItemsEl.style.display = "block"; //in case this function was called before. This will fix the width of the _selectEl to match the options.
    var elm = this._selectEl;
	var width = elm.offsetWidth;
	//offsetWidth is 0 if some parent (ancestor) has display:none which is the case only in Prefs pages when the select is setup.
	//don't set width to 0px in this case as it acts inconsistent - filling the entire space. Better to keep it just dynamic.
	if (width) {
		elm.style.width = width + "px";
	}
    this._pseudoItemsEl.style.display = "none";
};

DwtSelect.prototype._createHtmlFromTemplate =
function(templateId, data) {
    // wrap params
    var containerTemplateId = DwtSelect._CONTAINER_TEMPLATE;
    var containerData = {
        id: data.id,
        selectTemplateId: templateId || this.TEMPLATE,
        selectData: data
    };

    // generate html
    DwtButton.prototype._createHtmlFromTemplate.call(this, containerTemplateId, containerData);
    this._selectEl = document.getElementById(data.id+"_select_container");
    this._pseudoItemsEl = document.getElementById(data.id+"_pseudoitems_container");
	// this has to be block for it to affect the layout. it is not seen because its visibility hidden for the TDs
	// inside, and also "overflow:hidden" (so mouse over the hidden stuff does not highlight)
	this._pseudoItemsEl.style.display = "block";
    // set classes
    var el = this._containerEl = this.getHtmlElement();
    this._selectEl.className = el.className;
    Dwt.addClass(el, "ZSelectAutoSizingContainer");
    this.removeAttribute("style");
	if (this._legendId) {
		this.setAttribute('aria-labelledby', [ this._legendId, this._textEl.id ].join(' '));
	}
};

DwtSelect.prototype._createMenu = function() {

    var menu = new DwtSelectMenu(this);
    var mi;
    for (var i = 0, len = this._options.size(); i < len; ++i) {
	    var option = this._options.get(i);
        if (option._hr) {
            mi = new DwtMenuItem({parent:menu, style:DwtMenuItem.SEPARATOR_STYLE});
            mi.setEnabled(false);
        } else {
            var mi = new DwtSelectMenuItem(menu, option.id || Dwt.getNextId(menu._htmlElId + '_option_'));
            var image = option.getImage();
            if (image) {
                mi.setImage(image);
            }
            var text = option.getDisplayValue();
            if (text) {
                mi.setText(AjxStringUtil.htmlEncode(text));
            }
            mi.setEnabled(option.enabled);

            mi.addSelectionListener(new AjxListener(this, this._handleOptionSelection));
            mi._optionIndex = i;
        }
        mi._optionIndex = i;
		option.setItem(mi);
    }

	// Accessibility
	var select = this;
	menu.addPopupListener(function() {
		select.setAttribute('aria-expanded', true);
	});
	menu.addPopdownListener(function() {
		select.setAttribute('aria-expanded', false);
		select.removeAttribute('aria-activedescendant');
	});

	return menu;
};

DwtSelect.prototype._handleOptionSelection =
function(ev) {
	var menuItem = ev.item;
	var optionIndex = menuItem._optionIndex;
	var opt = this._options.get(optionIndex);
	var oldValue = this.getValue();
	this._setSelectedOption(opt);

	// notify our listeners
    var args = new Object();
    args.selectObj = this;
    args.newValue = opt.getValue();
    args.oldValue = oldValue;
    var event = DwtUiEvent.getEvent(ev);
    event._args = args;
    this.notifyListeners(DwtEvent.ONCHANGE, event);
};

DwtSelect.prototype._setSelectedOption =
function(option) {
	var displayValue = option.getSelectedValue() || option.getDisplayValue();
	var image = option.getImage();
	if (this._selectedOption != option) {
 		if (displayValue) {
 			this.setText(AjxStringUtil.htmlEncode(displayValue));
 		}
 		this.setImage(image);
		this._selectedValue = option._value;
		this._selectedOption = option;
	}
    this._updateSelection(option);

    this.autoResize();
};

DwtSelect.prototype.autoResize =
function() {
    /* bug: 21041 */
    var divElId = this.getHtmlElement();
    AjxTimedAction.scheduleAction(new AjxTimedAction(this,
        function(){
            var divEl = document.getElementById(divElId.id);
            if (divEl) {
                divEl.style.width = divEl.childNodes[0].offsetWidth || "auto"; // offsetWidth doesn't work in IE if the element or one of its parents has display:none
            }
    }, 200));
};

DwtSelect.prototype._updateSelection = 
function(newOption) {
	var currOption = this._currentSelectedOption;

	if (currOption) {
		currOption.deSelect();
	}
	this._currentSelectedOption = newOption;
	if (!newOption) {
		return;
	}
	newOption.select();
	var menu = this.getMenu(true);
	if (!menu) {
		return;
	}
	menu.setSelectedItem(newOption.getItem());
};

// Call this function to update the rendering of the element
// Firefox sometimes renders the element incorrectly on certain DOM updates, so this function rectifies that
DwtSelect.prototype.updateRendering = 
function() {
	var scrollStyle = this.getScrollStyle();
	this.setScrollStyle(scrollStyle == Dwt.VISIBLE ? Dwt.CLIP : Dwt.VISIBLE);
	var reset = function() {
					try {
						this.setScrollStyle(scrollStyle);
					} catch(e) {}
				};
	var resetAction = new AjxTimedAction(this, reset);
	AjxTimedAction.scheduleAction(resetAction, 4);
};

// Accessibility - select has role of 'combobox', so 'aria-owns' is used instead of 'aria-haspopup'
DwtSelect.prototype._menuAdded = function(menu) {
	this.setAttribute('aria-owns', menu._htmlElId);
};

// Accessibility - with a role of 'combobox' we need to maintain 'aria-activedescendant'
DwtSelect.prototype._menuItemSelected = function(menuItem) {
	this.setAttribute('aria-activedescendant', menuItem._htmlElId);
};


//
// Class
//

/**
 * Greg Solovyev 2/2/2004 added this class to be able to create a list of options 
 * before creating the DwtSelect control. This is a workaround an IE bug, that 
 * causes IE to crash with error R6025 when DwtSelectOption object are added to empty DwtSelect
 * @class
 * @constructor
 * 
 * @private
 */
DwtSelectOptionData = function(value, displayValue, isSelected, selectedValue, image, id, extraData) {
	if (value == null || displayValue == null) { return null; }

	this.value = value;
	this.displayValue = displayValue;
	this.isSelected = isSelected;
	this.selectedValue = selectedValue;
	this.image = image;
	this.extraData = extraData;
    this.id = id || Dwt.getNextId();
};

//
// Class
//

/**
 * Creates a select option.
 * @constructor
 * @class
 * This class encapsulates the option object that the {@link DwtSelect} widget uses. 
 *
 * @param {String}	value this is the value for the object, it will be returned in any onchange event
 * @param {Boolean}	selected whether or not the option should be selected to start with
 * @param {String}	displayValue the value that the user will see (HTML encoding will be done on this value internally)
 * @param {DwtSelect}	owner 	not used
 * @param {String}	optionalDOMId		not used
 * @param {String}	[selectedValue] 	the text value to use when this value is the currently selected value
 * @param {Boolean}	hr                  True => This option will be usd to create a unselectable horizontal rule
 * @param {Object} extraData  map of extra name/value pairs
 */
DwtSelectOption = function(value, selected, displayValue, owner, optionalDOMId, image, selectedValue, hr, extraData, id) {
	this._value = value;
	this._selected = selected;
	this._displayValue = displayValue;
	this._image = image;
	this._selectedValue = selectedValue;
    this._hr = hr;
	this._extraData = extraData;

	this.id = id;

	this._internalObjectId = DwtSelect._assignId(this);
	this.enabled = true;
};

DwtSelectOption.prototype.toString =
function() {
    return "DwtSelectOption";
};

/**
 * Sets the item.
 * 
 * @param	{DwtSelectMenuItem}	menuItem		the menu item
 */
DwtSelectOption.prototype.setItem = 
function(menuItem) {
	this._menuItem = menuItem;
};

/**
 * Gets the item.
 * 
 * @return	{DwtSelectMenuItem}	the menu item
 */
DwtSelectOption.prototype.getItem = 
function(menuItem) {
	return this._menuItem;
};

/**
 * Gets the display value.
 * 
 * @return	{String}	the display value
 */
DwtSelectOption.prototype.getDisplayValue = 
function() {
	return this._displayValue;
};

/**
 * Gets the image.
 * 
 * @return	{String}	the image
 */
DwtSelectOption.prototype.getImage = 
function() {
	return this._image;
};

/**
 * Gets the selected value.
 * 
 * @return	{String}	the selected value
 */
DwtSelectOption.prototype.getSelectedValue =
function() {
	return this._selectedValue;
};

/**
 * Gets the value.
 * 
 * @return	{String}	the value
 */
DwtSelectOption.prototype.getValue = 
function() {
	return this._value;
};

/**
 * Sets the value.
 * 
 * @param	{String|Number}	stringOrNumber	the value
 */
DwtSelectOption.prototype.setValue = 
function(stringOrNumber) {
	this._value = stringOrNumber;
};

/**
 * Selects the option.
 */
DwtSelectOption.prototype.select = 
function() {
	this._selected = true;
};

/**
 * De-selects the option.
 */
DwtSelectOption.prototype.deSelect = 
function() {
	this._selected = false;
};

/**
 * Checks if the option is selected.
 * 
 * @return	{Boolean}	<code>true</code> if the option is selected
 */
DwtSelectOption.prototype.isSelected = 
function() {
	return this._selected;
};

/**
 * Gets the id.
 * 
 * @return	{String}	the id
 */
DwtSelectOption.prototype.getIdentifier = 
function() {
	return this._internalObjectId;
};

DwtSelectOption.prototype.getExtraData =
function(key) {
	return this._extraData && this._extraData[key];
};



/**
 * Creates a select menu.
 * @constructor
 * @class
 * This class represents a select menu.
 * 
 * @param	{DwtComposite}	parent		the parent
 * 
 * @extends		DwtMenu
 */
DwtSelectMenu = function(parent) {
    DwtMenu.call(this, {parent:parent, style:DwtMenu.DROPDOWN_STYLE, className:"DwtMenu", layout:parent._layout,
        maxRows:parent._maxRows, congruent:parent._congruent,
        id:Dwt.getNextId(parent.getHTMLElId() + "_Menu_")});
// Dwt.getNextId should be removed once Bug 66510 is fixed
};
DwtSelectMenu.prototype = new DwtMenu;
DwtSelectMenu.prototype.constructor = DwtSelectMenu;

DwtSelectMenu.prototype.TEMPLATE = "dwt.Widgets#ZSelectMenu";

DwtSelectMenu.prototype.toString =
function() {
    return "DwtSelectMenu";
};

/**
 * Creates a select menu item.
 * @constructor
 * @class
 * This class represents a menu item.
 * 
 * @param	{DwtComposite}	parent		the parent
 * 
 * @extends 	DwtMenuItem
 */
DwtSelectMenuItem = function(parent, id) {
    DwtMenuItem.call(this, {parent:parent, style:DwtMenuItem.SELECT_STYLE, className:"ZSelectMenuItem", id: id});
};
DwtSelectMenuItem.prototype = new DwtMenuItem;
DwtSelectMenuItem.prototype.constructor = DwtSelectMenuItem;

DwtSelectMenuItem.prototype.TEMPLATE = "dwt.Widgets#ZSelectMenuItem";

DwtSelectMenuItem.prototype.isDwtSelectMenuItem = true;
DwtSelectMenuItem.prototype.toString = function() { return "DwtSelectMenuItem"; };

DwtSelectMenuItem.prototype.role = 'option';
}

if (AjxPackage.define("ajax.dwt.keyboard.DwtTabGroupEvent")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @constructor
 * @class
 * This class represents a the tab event. This event is used to indicate changes in
 * the state of {@link DwtTabGroup} objects (e.g. member addition and deletion). 
 * 
 * @author Ross Dargahi
 * 
 * @private
 */
DwtTabGroupEvent = function() {
	/**
	 * Tab group for which the event is being generated
	 * @type DwtTabGroup
	 */
	this.tabGroup = null;
	
	/**
	 * New focus member
	 * @type DwtControl|HTMLElement
	 */
	this.newFocusMember = null;
}

/**
 * Returns a string representation of this object.
 * 
 * @return {string}	a string representation of this object
 */
DwtTabGroupEvent.prototype.toString = 
function() {
	return "DwtTabGroupEvent";
}

/**
 * Resets the members of the event.
 * 
 */
DwtTabGroupEvent.prototype.reset =
function() {
	this.tabGroup = null;
	this.newFocusMember = null;
}
}
if (AjxPackage.define("ajax.dwt.keyboard.DwtTabGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates an empty tab group.
 * @constructor
 * @class
 * A tab group is used to manage keyboard focus among a group of related visual 
 * elements. It is a tree structure consisting of elements and other tab groups.
 * <p>
 * The root tab group is the only one without a parent tab group, and is the one
 * that the application interacts with. Focus listeners register with the root
 * tab group. The root tab group tracks where focus is.
 * 
 * @param {string}	name					the name of this tab group
 *
 * @author Ross Dargahi
 */
DwtTabGroup = function(name) {

	this.__members = new AjxVector();
	this.__parent = null;
	this.__name = name;
	this.__currFocusMember = null;
	this.__evtMgr = new AjxEventMgr();

    DwtTabGroup.BY_NAME[name] = this;
};

DwtTabGroup.prototype.isDwtTabGroup = true;
DwtTabGroup.prototype.toString = function() { return "DwtTabGroup"; };



/** 
 * Exception string that is thrown when an operation is attempted
 * on a non-root tab group.
 */
DwtTabGroup.NOT_ROOT_TABGROUP = "NOT ROOT TAB GROUP";

DwtTabGroup.__changeEvt = new DwtTabGroupEvent();

// Allow static access to any tab group by its name
DwtTabGroup.getByName = function(name) {
    return DwtTabGroup.BY_NAME[name];
};
DwtTabGroup.BY_NAME = {};

/**
 * Gets the name of this tab group.
 * 
 * @return	{string}	the tab group name
 */
DwtTabGroup.prototype.getName = function() {
	return this.__name;
};

/**
 * Adds a focus change listener to the root tab group. The listener is called
 * when the focus member changes. Note that the focus member hasn't actually
 * been focused yet - only its status within the tab group has changed. It is
 * up to the listener to implement the appropriate focus action.
 * 
 * @param {AjxListener} listener	a listener
 * 
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.addFocusChangeListener = function(listener) {

	this.__checkRoot();		
	this.__evtMgr.addListener(DwtEvent.STATE_CHANGE, listener);
};

/**
 * Removes a focus change listener from the root tab group.
 * 
 * @param {AjxListener} listener	a listener
 * 
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.removeFocusChangeListener = function(listener) {

	this.__checkRoot();		
	this.__evtMgr.removeListener(DwtEvent.STATE_CHANGE, listener);
};

/**
 * Adds a member to the tab group.
 * 
 * @param {Array|DwtControl|DwtTabGroup|HTMLElement} member	the member(s) to be added
 * @param {number} [index] 		the index at which to add the member. If omitted, the member
 * 		will be added to the end of the tab group
 */
DwtTabGroup.prototype.addMember = function(member, index) {

    index = (index != null) ? index : this.__members.size();
    var members = AjxUtil.collapseList(AjxUtil.toArray(member));

	for (var i = 0, len = members.length; i < len; i++) {
        var member = members[i];
        this.__members.add(member, index + i);
        // If adding a tab group, register me as its parent
        if (member.isDwtTabGroup) {
            member.newParent(this);
        }
	}
};

/**
 * Resets all members of the tab group to the given arguments.
 * 
 * @param {Array|DwtControl|DwtTabGroup|HTMLElement} members	the member(s) for the tab group
 */
DwtTabGroup.prototype.setMembers = function(members) {
	this.removeAllMembers();
	this.addMember(members);
};

/**
 * Adds a member to the tab group, positioned after another member.
 * 
 * @param {DwtControl|DwtTabGroup|HTMLElement} member 		the member to be added
 * @param {DwtControl|DwtTabGroup|HTMLElement} afterMember 	the member after which to add <code>member</code>
 */
DwtTabGroup.prototype.addMemberAfter = function(newMember, afterMember) {

	this.addMember(newMember, this.__indexOfMember(afterMember) + 1);
};

/**
 * Adds a member to the tab group, positioned before another member.
 * 
 * @param {DwtControl|DwtTabGroup|HTMLElement} member 		the member to be added
 * @param {DwtControl|DwtTabGroup|HTMLElement} beforeMember 	the member before which to add <code>member</code>
 */
DwtTabGroup.prototype.addMemberBefore = function(newMember, beforeMember) {

	this.addMember(newMember, this.__indexOfMember(beforeMember));
};

/**
 * This method removes a member from the tab group. If the member being removed
 * is currently the focus member, then we will try to set focus to the
 * previous member. If that fails, we will try the next member.
 * 
 * @param {DwtControl|DwtTabGroup|HTMLElement} member 	the member to be removed
 * @param {boolean} [checkEnabled] 		if <code>true</code>, then make sure that if we have a newly focused member it is enabled
 * @param {boolean} [skipNotify] 		if <code>true</code>, notification is not fired. This flag typically set by Dwt tab management framework when it is calling into this method
 * @return {DwtControl|DwtTabGroup|HTMLElement}	the removed member or <code>null</code> if <code>oldMember</code> is not in the tab groups hierarchy
 */
DwtTabGroup.prototype.removeMember = function(member, checkEnabled, skipNotify) {

	return this.replaceMember(member, null, checkEnabled, skipNotify);
};

/**
 * Removes all members.
 * 
 */
DwtTabGroup.prototype.removeAllMembers = function() {

	this.__members.removeAll();
};

/**
 * This method replaces a member in the tab group with a new member. If the member being
 * replaced is currently the focus member, then we will try to set focus to the
 * previous member. If that fails, we will try the next member.
 * 
 * @param {DwtControl|DwtTabGroup|HTMLElement} oldMember 	the member to be replaced
 * @param {DwtControl|DwtTabGroup|HTMLElement} newMember 	the replacing member
 * 		If this parameter is <code>null</code>, then this method effectively removes <code>oldMember</code>
 * @param {boolean} [checkEnabled] 	if <code>true</code>, then make sure that if we have a newly focused
 * 		member it is enabled
 * @param {boolean} [skipNotify] if <code>true</code>, notification is not fired. This flag is
 * 		typically set by the tab management framework when it is calling into this method
 * @return {DwtControl|DwtTabGroup|HTMLElement}	replaced member or <code>null></code> if <code>oldMember</code> is not in the tab group
 */
DwtTabGroup.prototype.replaceMember = function(oldMember, newMember, checkEnabled, skipNotify, focusItem, noFocus) {

	var tg = this.__getTabGroupForMember(oldMember);
	if (!tg) {
		this.addMember(newMember);
		return null;
	}

	/* If we are removing the current focus member, then we need to adjust the focus
	 * member index. If the tab group is empty as a result of the removal
	 */
	var root = this.__getRootTabGroup();
	var newFocusMember;
	if (focusItem) {
		newFocusMember = focusItem;
	}
    else if (root.__currFocusMember === oldMember || (oldMember && oldMember.isDwtTabGroup && oldMember.contains(root.__currFocusMember))) {
		if (newMember) {
			newFocusMember = (newMember.isDwtTabGroup) ? newMember.getFirstMember() : newMember;
		}
        else {
			newFocusMember = this.__getPrevMember(oldMember, checkEnabled);
			if (!newFocusMember) {
				newFocusMember =  this.__getNextMember(oldMember, checkEnabled);
			}
		}
	}

	if (newFocusMember && !noFocus) {
		root.__currFocusMember = newFocusMember;
		this.__showFocusedItem(this.__currFocusMember, "replaceMember");
		if (!skipNotify) {
			this.__notifyListeners(newFocusMember);
		}
	}

	if (newMember && newMember.isDwtTabGroup) {
		newMember.newParent(this);
	}
		
	return newMember ? this.__members.replaceObject(oldMember, newMember) : this.__members.remove(oldMember);
};

/**
 * Returns true if this tab group contains <code>member</code>.
 * 
 * @param {DwtControl|DwtTabGroup|HTMLElement} member	the member for which to search
 * 
 * @return {boolean}	<code>true</code> if the tab group contains member
 */
DwtTabGroup.prototype.contains = function(member) {

	return !!this.__getTabGroupForMember(member);
};

/**
 * Sets a new parent for this tab group.
 * 
 * @param {DwtTabGroup} newParent 	the new parent. If the parent is <code>null</code>, then this tabGroup is the root tab group.
 */
DwtTabGroup.prototype.newParent = function(newParent) {

	this.__parent = newParent;
};

/**
 * Gets the first member of the tab group.
 * 
 * @param {boolean} [checkEnabled]		if <code>true</code>, then return first enabled member
 *
 * @return {DwtControl|HTMLElement}	the first member of the tab group
 */
DwtTabGroup.prototype.getFirstMember = function(checkEnabled) {

	return this.__getLeftMostMember(checkEnabled);
};

/**
 * Gets the last member of the tab group.
 * 
 * @param {boolean} [checkEnabled]		if <code>true</code>, then return last enabled member
 *
 * @return {DwtControl|HTMLElement}	the last member of the tab group
 */
DwtTabGroup.prototype.getLastMember = function(checkEnabled) {

	return this.__getRightMostMember(checkEnabled);
};
 
/**
 * Returns the current focus member.
 * 
 * @return {DwtControl|HTMLElement}	current focus member
 * 
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.getFocusMember = function(){

	this.__checkRoot();
	return this.__currFocusMember;
};

/**
 * Sets the current focus member. 
 * 
 * @param {DwtControl|HTMLElement} member 		the member to which to set focus
 * @param {boolean} [checkEnabled] 	if <code>true</code>, then make sure the member is enabled
 * @param {boolean} [skipNotify] if <code>true</code>, notification is not fired. This flag
 * 		typically set by Dwt tab management framework when it is calling into this method
 * 
 * @return {boolean}	<code>true</code> if member was part of the tab group hierarchy, else false
 *
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.setFocusMember = function(member, checkEnabled, skipNotify) {

    if (!member) {
        return false;
    }

    if (member.isDwtTabGroup) {
        DBG.println(AjxDebug.FOCUS, "DwtTabGroup SETFOCUSMEMBER to a DwtTabGroup: " + member + " / " + member.getName());
        member = member.getFocusMember() || member.getFirstMember();
    }
	this.__checkRoot();	
	if (!this.__checkEnabled(member, checkEnabled)) {
		return false;
	}

	if (this.contains(member)) {
		this.__currFocusMember = member;
		this.__showFocusedItem(this.__currFocusMember, "setFocusMember");
		if (!skipNotify) {
			this.__notifyListeners(this.__currFocusMember);
		}
		return true;	
	}

	return false;
};

/**
 * This method sets and returns the next focus member in this tab group. If there is no next
 * member, sets and returns the first member in the tab group.
 * 
 * @param {boolean} [checkEnabled] 	if <code>true</code>, get the next enabled member
 * @param {boolean} [skipNotify] if <code>true</code>, notification is not fired. This flag
 * 		typically set by {@link Dwt} tab management framework when it is calling into this method
 * 
 * @return {DwtControl|HTMLElement}	new focus member or <code>null</code> if there is no focus member or if the focus
 * 		member has not changed (i.e. only one member in the tabgroup)
 *
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.getNextFocusMember = function(checkEnabled, skipNotify) {

	this.__checkRoot();		
	return this.__setFocusMember(true, checkEnabled, skipNotify);
};

/**
 * This method sets and returns the previous focus member in this tab group. If there is no
 * previous member, sets and returns the last member in the tab group.
 * 
 * @param {boolean} [checkEnabled] 	if <code>true</code>, get the previously enabled member
 * @param {boolean} [skipNotify] if <code>true</code>, notification is not fired. This flag
 * 		typically set by Dwt tab management framework when it is calling into this method
 * 
 * @return {DwtControl|HTMLElement}	new focus member or <code>null</code> if there is no focus member or if the focus
 * 		member has not changed (i.e. only one member in the tabgroup)
 *
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.getPrevFocusMember = function(checkEnabled, skipNotify) {

	this.__checkRoot();		
	return this.__setFocusMember(false, checkEnabled, skipNotify);
};

/**
 * Resets the the focus member to the first element in the tab group.
 * 
 * @param {boolean} [checkEnabled] 	if <code>true</code>, then pick a enabled member to which to set focus
 * @param {boolean} [skipNotify] if <code>true</code>, notification is not fired. This flag
 * 		typically set by Dwt tab management framework when it is calling into this method
 * 
 * @return {DwtControl|HTMLElement}	the new focus member
 *
 * @throws DwtTabGroup.NOT_ROOT_TABGROUP
 */
DwtTabGroup.prototype.resetFocusMember = function(checkEnabled, skipNotify) {

	this.__checkRoot();
	var focusMember = this.__getLeftMostMember(checkEnabled);
	if ((focusMember != this.__currFocusMember) && !skipNotify) {
		this.__notifyListeners(this.__currFocusMember);
	}
	this.__showFocusedItem(this.__currFocusMember, "resetFocusMember");
    DBG.println(AjxDebug.FOCUS, "DwtTabGroup RESETFOCUSMEMBER: " + focusMember);
	this.__currFocusMember = focusMember;
	
	return this.__currFocusMember;
};

/**
 * Pretty-prints the contents of the tab group to the browser console or the
 * debug window.
 *
 * @param {number} [debugLevel]     if specified, dump to the debug window
 *                                  at the given level.
 */
DwtTabGroup.prototype.dump = function(debugLevel) {

	if (debugLevel) {
		if (!window.AjxDebug || !window.DBG) {
			return;
		}

		var logger = function(s) {
			var s = AjxStringUtil.convertToHtml(s);
			DBG.println(debugLevel, s);
		}

		DwtTabGroup.__dump(this, logger, 0);
	} else if (window.console && window.console.log) {
		var r = [];
		DwtTabGroup.__dump(this, r.push.bind(r), 0);
		console.log(r.join('\n'));
	}
};

/**
 * Gets the size of the group.
 * 
 * @return	{number}	the size
 */
DwtTabGroup.prototype.size = function() {

	return this.__members.size();
};

/**
 * Returns the previous member in the tag group.
 * 
 * @private
 */
DwtTabGroup.prototype.__getPrevMember = function(member, checkEnabled) {

	var a = this.__members.getArray();

	// Start working from the member to the immediate left, then keep going left
	for (var i = this.__lastIndexOfMember(member) - 1; i > -1; i--) {
		var prevMember = a[i];
		/* if sibling is not a tab group, then it is the previous child. If the
		 * sibling is a tab group, get its rightmost member.*/
		if (!prevMember.isDwtTabGroup) {
			if (this.__checkEnabled(prevMember, checkEnabled)) {
				return prevMember;
			}
		} else {
			prevMember = prevMember.__getRightMostMember(checkEnabled);
			if (this.__checkEnabled(prevMember, checkEnabled)) {
				return prevMember;
			}
		}
	}

	/* If we have fallen through to here it is because the tab group only has 
	 * one member. So we roll up to the parent, unless we are at the root in 
	 * which case we return null. */
	return this.__parent ? this.__parent.__getPrevMember(this, checkEnabled) : null;
};

/**
 * Returns true if the given member can accept focus, or if there is no need to check.
 * If we are checking, the member must be enabled and visible if it is a control, and
 * enabled otherwise. A member may also set the "noTab" flag to take itself out of the
 * tab hierarchy.
 * 
 * @private
 */
DwtTabGroup.prototype.__checkEnabled = function(member, checkEnabled) {

	if (!checkEnabled) {
		return true;
	}

	if (!member || member.noTab) {
		return false;
	}

	if (member.isDwtControl ? !member.getEnabled() : member.disabled) {
		return false;
	}

	if (member.isDwtControl) {
		member = member.getHtmlElement();
	}

	var loc = Dwt.getLocation(member);
	if (loc.x === null || loc.y === null || loc.x === Dwt.LOC_NOWHERE || loc.y === Dwt.LOC_NOWHERE) {
		return false;
	}

	var size = Dwt.getSize(member);
	if (!size || size.x === 0 || size.y === 0) {
		return false;
	}

	if (member.nodeName && member.nodeName.toLowerCase() === "body") {
		return true;
	}
	return (Dwt.getZIndex(member, true) > Dwt.Z_HIDDEN &&
	        Dwt.getVisible(member) && Dwt.getVisibility(member));
};

DwtTabGroup.prototype.__indexOfMember = function(member) {

    return this.__members.indexOf(member);
};

DwtTabGroup.prototype.__lastIndexOfMember = function(member) {

    return this.__members.lastIndexOf(member);
};

/**
 * Sets and returns the next member in the tag group.
 * 
 * @private
 */
DwtTabGroup.prototype.__getNextMember = function(member, checkEnabled) {

	var a = this.__members.getArray();
	var sz = this.__members.size();

	// Start working from the member rightwards
	for (var i = this.__indexOfMember(member) + 1; i < sz; i++) {
		var nextMember = a[i];
		/* if sibling is not a tab group, then it is the next child. If the
		 * sibling is a tab group, get its leftmost member.*/
		if (!nextMember.isDwtTabGroup) {
			if (this.__checkEnabled(nextMember, checkEnabled)) {
				return nextMember;
			}
		}
        else {
			nextMember = nextMember.__getLeftMostMember(checkEnabled);
			if (this.__checkEnabled(nextMember, checkEnabled)) {
				return nextMember;
			}
		}
	}

	/* If we have fallen through to here it is because the tab group only has 
	 * one member or we are at the end of the list. So we roll up to the parent, 
	 * unless we are at the root in which case we return null. */
	return this.__parent ? this.__parent.__getNextMember(this, checkEnabled) : null;
};

/**
 * Finds the rightmost member of the tab group. Will recurse down
 * into contained tab groups if necessary.
 * @private
 */
DwtTabGroup.prototype.__getRightMostMember = function(checkEnabled) {

	var a = this.__members.getArray();
	var member = null;
	
	/* Work backwards from the rightmost member. If the member is a tab group, then
	 * recurse into it. If member is not a tab group, return it as it is the 
	 * rightmost element. */
	for (var i = this.__members.size() - 1; i >= 0; i--) {
		member = a[i]
		if (!member.isDwtTabGroup) {
			if (this.__checkEnabled(member, checkEnabled)) {
                break;
            }
		}
        else {
			member = member.__getRightMostMember(checkEnabled);
			if (this.__checkEnabled(member, checkEnabled)) {
                break;
            }
		}
	}

	return this.__checkEnabled(member, checkEnabled) ? member : null;
};

/**
 *  Finds the leftmost member of the tab group. Will recurse down
 * into contained tab groups if necessary.
 * @private
 */
DwtTabGroup.prototype.__getLeftMostMember = function(checkEnabled) {

	var sz = this.__members.size();
	var a = this.__members.getArray();
	var member = null;

	/* Work forwards from the leftmost member. If the member is a tabgroup, then
	 * recurse into it. If member is not a tabgroup, return it as it is the 
	 * rightmost element */
	for (var i = 0; i < sz; i++) {
		member = a[i]
		if (!member.isDwtTabGroup) {
			if  (this.__checkEnabled(member, checkEnabled)) {
                break;
            }
		}
        else {
			member = member.__getLeftMostMember(checkEnabled);
			if (this.__checkEnabled(member, checkEnabled)) {
                break;
            }
		}
	}

	return this.__checkEnabled(member, checkEnabled) ? member : null;
};

/**
 * Notifies focus change listeners.
 * @private
 */
DwtTabGroup.prototype.__notifyListeners = function(newFocusMember) {

	// Only the root tab group will issue notifications
	var rootTg = this.__getRootTabGroup();
	if (rootTg.__evtMgr) {
		var evt = DwtTabGroup.__changeEvt;
		evt.reset();
		evt.tabGroup = this;
		evt.newFocusMember = newFocusMember;
		rootTg.__evtMgr.notifyListeners(DwtEvent.STATE_CHANGE, evt);
	}
};

/**
 * @private
 */
DwtTabGroup.prototype.__getRootTabGroup = function() {

	var root = this;
	while (root.__parent) {
		root = root.__parent;
	}
	
	return root;
}

DwtTabGroup.DUMP_INDENT = '|\t';

/**
 * @private
 */
DwtTabGroup.__dump = function(tg, logger, level) {

	var myIndent = AjxStringUtil.repeat(DwtTabGroup.DUMP_INDENT, level);

	logger(myIndent + "TABGROUP: " + tg.__name);

	myIndent += DwtTabGroup.DUMP_INDENT;

	var sz = tg.__members.size();
	var a = tg.__members.getArray();
	for (var i = 0; i < sz; i++) {
        var m = a[i];
		if (m.isDwtTabGroup) {
			DwtTabGroup.__dump(m, logger, level + 1);
		}
        else {
			var desc = m.nodeName ? [ m.nodeName, m.id, m.className ].join(' ') : [ String(m), m._htmlElId ].join(' ');
			if (m.noTab) {
				desc += ' - no tab!';
			}
			logger(myIndent + desc);
		}
	}
};

/**
 * Sets the next or previous focus member.
 * @private
 */
DwtTabGroup.prototype.__setFocusMember = function(next, checkEnabled, skipNotify) {

	// If there is currently no focus member, then reset to the first member and return
	if (!this.__currFocusMember) {
		return this.resetFocusMember(checkEnabled, skipNotify);
	}
	
	var tabGroup = this.__getTabGroupForMember(this.__currFocusMember);
	if (!tabGroup) {
		DBG.println(AjxDebug.DBG1, "tab group not found for focus member: " + this.__currFocusMember);
		return null;
	}
	var m = next ? tabGroup.__getNextMember(this.__currFocusMember, checkEnabled)
				 : tabGroup.__getPrevMember(this.__currFocusMember, checkEnabled);

	if (!m) {
        // wrap around
		m = next ? this.__getLeftMostMember(checkEnabled)
				 : this.__getRightMostMember(checkEnabled);

		// Test for the case where there is only one member in the tabgroup
		if (m == this.__currFocusMember) {
			return this.__currFocusMember;
		}
	}

	this.__currFocusMember = m;
	
	this.__showFocusedItem(this.__currFocusMember, "__setFocusMember");
	if (!skipNotify) {
		this.__notifyListeners(this.__currFocusMember);
	}
	
	return this.__currFocusMember;
};

/**
 * Returns the tab group from within this tab group's hierarchy that contains the given member. Traverses the tree top-down.
 *
 * @private
 */
DwtTabGroup.prototype.__getTabGroupForMember = function(member) {

	if (!member) {
        return null;
    }

    var a = this.__members.getArray(),
        ln = a.length, i, m;

	for (i = 0; i < ln; i++) {
		m = a[i];
		if (m === member) {
			return this;
		}
        else if (m.isDwtTabGroup && (m = m.__getTabGroupForMember(member))) {
			return m;
		}
	}
	return null;
};

/**
 * Throws an exception if this is not the root tab group.
 * 
 * @private
 */
DwtTabGroup.prototype.__checkRoot = function() {

	if (this.__parent) {
        DBG.println(AjxDebug.DBG1, "DwtTabGroup NOT_ROOT_TABGROUP: " + this.getName());
//		throw DwtTabGroup.NOT_ROOT_TABGROUP;
	}
};

// Prints out a debug line describing the currently focused member
DwtTabGroup.prototype.__showFocusedItem = function(item, caller) {

	if (item && window.AjxDebug && window.DBG) {
		var callerText = caller ? "DwtTabGroup." + caller + ": " : "",
			idText = " [" + (item.isDwtControl ? item._htmlElId : item.id) + "] ",
            itemText = (item.nodeName || item) + " " + idText,
			otherText = (item.getTitle && item.getTitle()) || (item.getText && item.getText()) || "",
			fullText = itemText + otherText;

		DBG.println(AjxDebug.FOCUS, callerText + "current focus member is now " + itemText);
		DBG.println(AjxDebug.FOCUS1, "Focus: " + fullText);
	}
};
}
if (AjxPackage.define("ajax.dwt.keyboard.DwtKeyboardMgr")) {
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
 * Creates an empty keyboard manager. Intended for use as a singleton.
 * @constructor
 * @class
 * This class is responsible for managing focus and shortcuts via the keyboard. That includes dispatching
 * keyboard events (shortcuts), as well as managing tab groups. It is at the heart of the
 * Dwt keyboard navigation framework.
 * <p>
 * {@link DwtKeyboardMgr} intercepts key strokes and translates
 * them into actions which it then dispatches to the component with focus. If the key
 * stroke is a TAB (or Shift-TAB), then focus is moved based on the current tab group.
 * </p><p>
 * A {@link DwtShell} instantiates its own <i>DwtKeyboardMgr</i> at construction.
 * The keyboard manager may then be retrieved via the shell's <code>getKeyboardMgr()</code>
 * function. Once a handle to the shell's keyboard manager is retrieved, then the user is free
 * to add tab groups, and to register keymaps and handlers with the keyboard manager.
 * </p><p>
 * Focus is managed among a stack of tab groups. The TAB button will move the focus within the
 * current tab group. When a non-TAB is received, we first check if the control can handle it.
 * In general, control key events simulate something the user could do with the mouse, and change
 * the state/appearance of the control. For example, ENTER on a DwtButton simulates a button
 * press. If the control does not handle the key event, the event is handed to the application,
 * which handles it based on its current state. The application key event handler is in a sense
 * global, since it does not matter which control received the event.
 * </p><p>
 * At any given time there is a default handler, which is responsible for determining what
 * action is associated with a particular key sequence, and then taking it. A handler should support
 * the following methods:
 * 
 * <ul>
 * <li><i>getKeyMapName()</i> -- returns the name of the map that defines shortcuts for this handler</li>
 * <li><i>handleKeyAction()</i> -- performs the action associated with a shortcut</li>
 * <li><i>handleKeyEvent()</i>	-- optional override; handler solely responsible for handling event</li>
 * </ul>
 * </p>
 *
 * @author Ross Dargahi
 *
 * @param	{DwtShell}	shell		the shell
 * @see DwtShell
 * @see DwtTabGroup
 * @see DwtKeyMap
 * @see DwtKeyMapMgr
 * 
 * @private
 */
DwtKeyboardMgr = function(shell) {

	DwtKeyboardMgr.__shell = shell;

    this.__kbEventStatus = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
    this.__keyTimeout = DwtKeyboardMgr.SHORTCUT_TIMEOUT;

    // focus
    this.__tabGrpStack = [];
    this.__currTabGroup = null;
    this.__tabGroupChangeListenerObj = this.__tabGrpChangeListener.bind(this);

    // shortcuts
    this.__shortcutsEnabled = false;
	this.__defaultHandlerStack = [];
	this.__currDefaultHandler = null;
    this.__killKeySeqTimedAction = new AjxTimedAction(this, this.__killKeySequenceAction);
    this.__killKeySeqTimedActionId = -1;
    this.__keySequence = [];
    this._evtMgr = new AjxEventMgr();

    Dwt.setHandler(document, DwtEvent.ONKEYDOWN, DwtKeyboardMgr.__keyDownHdlr);
    Dwt.setHandler(document, DwtEvent.ONKEYUP, DwtKeyboardMgr.__keyUpHdlr);
    Dwt.setHandler(document, DwtEvent.ONKEYPRESS, DwtKeyboardMgr.__keyPressHdlr);
};

DwtKeyboardMgr.prototype.isDwtKeyboardMgr = true;
DwtKeyboardMgr.prototype.toString = function() { return "DwtKeyboardMgr"; };

DwtKeyboardMgr.SHORTCUT_TIMEOUT = 750;

DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED	= "NOT HANDLED";
DwtKeyboardMgr.__KEYSEQ_HANDLED		= "HANDLED";
DwtKeyboardMgr.__KEYSEQ_PENDING		= "PENDING";

/**
 * Checks if the event may be a shortcut from within an input (text input or
 * textarea). Since printable characters are echoed, the shortcut must be non-printable:
 * 
 * <ul>
 * <li>Alt or Ctrl or Meta plus another key</li>
 * <li>Esc</li>
 * </ul>
 * 
 * @param {DwtKeyEvent}	ev	the key event
 * @return	{boolean}	<code>true</code> if the event may be a shortcut
 */

// Enter and all four arrows can be used as shortcuts in an INPUT
DwtKeyboardMgr.IS_INPUT_SHORTCUT_KEY = AjxUtil.arrayAsHash([
    DwtKeyEvent.KEY_END_OF_TEXT,
    DwtKeyEvent.KEY_RETURN,
    DwtKeyEvent.KEY_ARROW_LEFT,
    DwtKeyEvent.KEY_ARROW_UP,
    DwtKeyEvent.KEY_ARROW_RIGHT,
    DwtKeyEvent.KEY_ARROW_DOWN
]);

// Returns true if the key event has a keycode that could be used in an input (INPUT or TEXTAREA) as a shortcut. That
// excludes printable characters.
DwtKeyboardMgr.isPossibleInputShortcut = function(ev) {

	var target = DwtUiEvent.getTarget(ev);
    return !DwtKeyMap.IS_MODIFIER[ev.keyCode] && (ev.keyCode === DwtKeyEvent.KEY_ESCAPE || DwtKeyMapMgr.hasModifier(ev) ||
			(target && target.nodeName.toLowerCase() == "input" && DwtKeyboardMgr.IS_INPUT_SHORTCUT_KEY[ev.keyCode]));
};

/**
 * Pushes the tab group onto the stack and makes it the active tab group.
 * 
 * @param 	{DwtTabGroup}	tabGroup	the tab group to push onto the stack
 * 
 * @see		#popTabGroup
 */
DwtKeyboardMgr.prototype.pushTabGroup = function(tabGroup, preventFocus) {

    if (!(tabGroup && tabGroup.isDwtTabGroup)) {
        DBG.println(AjxDebug.DBG1, "pushTabGroup() called without a tab group: " + tabGroup);
        return;
    }

	DBG.println(AjxDebug.FOCUS, "PUSH tab group " + tabGroup.getName());
	this.__tabGrpStack.push(tabGroup);
	this.__currTabGroup = tabGroup;
	var focusMember = tabGroup.getFocusMember();
	if (!focusMember) {
		focusMember = tabGroup.resetFocusMember(true);
	}
	if (!focusMember) {
		DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr.pushTabGroup: tab group " + tabGroup.__name + " has no members!");
		return;
	}
	tabGroup.addFocusChangeListener(this.__tabGroupChangeListenerObj);
	if (!preventFocus) {
		this.grabFocus(focusMember);
	}
};

/**
 * Pops the current tab group off the top of the tab group stack. The previous 
 * tab group (if there is one) then becomes the current tab group.
 * 
 * @param {DwtTabGroup} [tabGroup]		the tab group to pop. If supplied, then the tab group
 * 		stack is searched for the tab group and it is removed. If <code>null</code>, then the
 * 		top tab group is popped.
 * 
 * @return {DwtTabGroup}	the popped tab group or <code>null</code> if there is one or less tab groups
 */
DwtKeyboardMgr.prototype.popTabGroup = function(tabGroup) {

    if (!(tabGroup && tabGroup.isDwtTabGroup)) {
        DBG.println(AjxDebug.DBG1, "popTabGroup() called without a tab group: " + tabGroup);
        return null;
    }

    DBG.println(AjxDebug.FOCUS, "POP tab group " + tabGroup.getName());
	
	// we never want an empty stack
	if (this.__tabGrpStack.length <= 1) {
		return null;
	}
	
	// If we are popping a tab group that is not on the top of the stack then
	// we need to find it and remove it.
	if (tabGroup && this.__tabGrpStack[this.__tabGrpStack.length - 1] != tabGroup) {
		var a = this.__tabGrpStack;
		var len = a.length;
		for (var i = len - 1; i >= 0; i--) {
			if (tabGroup == a[i]) {
				a[i].dump(AjxDebug.DBG1);
				break;
			}
		}
		
		/* If there is no match in the stack for tabGroup, then simply return null,
		 * else if the match is not the top item on the stack, then remove it from 
		 * the stack. Else we are dealing with the topmost item on the stack so handle it 
		 * as a simple pop. */
		if (i < 0) { // No match
			return null;
		} else if (i != len - 1) { // item is not on top
			// Remove tabGroup
			a.splice(i, 1);
			return tabGroup;
		}
	} 

	var tabGroup = this.__tabGrpStack.pop();
	tabGroup.removeFocusChangeListener(this.__tabGroupChangeListenerObj);
	
	var currTg = null;
	if (this.__tabGrpStack.length > 0) {
		currTg = this.__tabGrpStack[this.__tabGrpStack.length - 1];
		var focusMember = currTg.getFocusMember();
		if (!focusMember) {
			focusMember = currTg.resetFocusMember(true);
		}
		if (focusMember) {
			this.grabFocus(focusMember);
		}
	}
	this.__currTabGroup = currTg;

	return tabGroup;
};

/**
 * Replaces the current tab group with the given tab group.
 * 
 * @param {DwtTabGroup} tabGroup 	the tab group to use
 * @return {DwtTabGroup}	the old tab group
 */
DwtKeyboardMgr.prototype.setTabGroup = function(tabGroup) {

	var otg = this.popTabGroup();
	this.pushTabGroup(tabGroup);

	return otg;
};

/**
 * Gets the current tab group
 *
 * @return {DwtTabGroup}	current tab group
 */
DwtKeyboardMgr.prototype.getCurrentTabGroup = function() {

    return this.__currTabGroup;
};

/**
 * Adds a default handler to the stack. A handler should define a 'handleKeyAction' method.
 *
 * @param {Object}  handler     default handler
 */
DwtKeyboardMgr.prototype.pushDefaultHandler = function(handler) {

	if (!this.isEnabled() || !handler) {
        return;
    }
	DBG.println(AjxDebug.FOCUS, "PUSH default handler: " + handler);
		
	this.__defaultHandlerStack.push(handler);
	this.__currDefaultHandler = handler;
};

/**
 * Removes a default handler from the stack.
 *
 * @return {Object}  handler     a default handler
 */
DwtKeyboardMgr.prototype.popDefaultHandler = function() {

	DBG.println(AjxDebug.FOCUS, "POP default handler");
	// we never want an empty stack
	if (this.__defaultHandlerStack.length <= 1) {
        return null;
    }

	DBG.println(AjxDebug.FOCUS, "Default handler stack length: " + this.__defaultHandlerStack.length);
	var handler = this.__defaultHandlerStack.pop();
	this.__currDefaultHandler = this.__defaultHandlerStack[this.__defaultHandlerStack.length - 1];
	DBG.println(AjxDebug.FOCUS, "Default handler is now: " + this.__currDefaultHandler);

	return handler;
};

/**
 * Sets the focus to the given object.
 * 
 * @param {HTMLInputElement|DwtControl|string} focusObj		the object to which to set focus, or its ID
 */ 
DwtKeyboardMgr.prototype.grabFocus = function(focusObj) {

	if (typeof focusObj === "string") {
		focusObj = document.getElementById(focusObj);
	}
    else if (focusObj && focusObj.isDwtTabGroup) {
        focusObj = focusObj.getFocusMember() || focusObj.getFirstMember();
    }

    if (!focusObj) {
        return;
    }

	// Make sure tab group knows what's currently focused
	if (this.__currTabGroup) {
		this.__currTabGroup.setFocusMember(focusObj, false, true);
	}
		
	this.__doGrabFocus(focusObj);
};

/**
 * Tells the keyboard manager that the given control now has focus. That control will handle shortcuts and become
 * the reference point for tabbing.
 *
 * @param {DwtControl|Element}  focusObj    control (or element) that has focus
 */
DwtKeyboardMgr.prototype.updateFocus = function(focusObj, ev) {

    if (!focusObj) {
        return;
    }

    var ctg = this.__currTabGroup;
    if (ctg) {
        this.__currTabGroup.__showFocusedItem(focusObj, "updateFocus");
    }
    var control = focusObj.isDwtControl ? focusObj : DwtControl.findControl(focusObj);

    // Set the keyboard mgr's focus obj, which will be handed shortcuts. It must be a DwtControl.
    if (control) {
        this.__focusObj = control;
        DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr UPDATEFOCUS kbMgr focus obj: " + control);
    }

    // Update the current (usually root) tab group's focus member to whichever of these it contains: the focus obj,
    // its tab group member, or its control.
    var tgm = this._findTabGroupMember(ev || focusObj);
    if (tgm && ctg) {
        ctg.setFocusMember(tgm, false, true);
    }
};

// Goes up the DOM looking for something (element or control) that is in the current tab group.
DwtKeyboardMgr.prototype._findTabGroupMember = function(obj) {

    var ctg = this.__currTabGroup;
    if (!obj || !ctg) {
        return;
    }

    var htmlEl = (obj.isDwtControl && obj.getHtmlElement()) || DwtUiEvent.getTarget(obj, false) || obj;

    try {
        while (htmlEl) {
            if (ctg.contains(htmlEl)) {
                return htmlEl;
            }
            else {
                var control = DwtControl.ALL_BY_ID[htmlEl.id];
                if (control && ctg.contains(control)) {
                    return control;
                }
                else {
                    var tgm = control && control.getTabGroupMember && control.getTabGroupMember();
                    if (tgm && ctg.contains(tgm)) {
                        return tgm;
                    }
                }
            }
            htmlEl = htmlEl.parentNode;
        }
    } catch(e) {
    }

    return null;
};

/**
 * Gets the object that has focus.
 *
 * @return {HTMLInputElement|DwtControl} focusObj		the object with focus
 */
DwtKeyboardMgr.prototype.getFocusObj = function(focusObj) {

	return this.__focusObj;
};

/**
 * This method is used to register an application key handler. If registered, this
 * handler must support the following methods:
 * <ul>
 * <li><i>getKeyMapName</i>: This method returns a string representing the key map 
 * to be used for looking up actions
 * <li><i>handleKeyAction</i>: This method should handle the key action and return
 * true if it handled it else false. <i>handleKeyAction</i> has two formal parameters
 *    <ul>
 *    <li><i>actionCode</i>: The action code to be handled</li>
 *    <li><i>ev</i>: the {@link DwtKeyEvent} corresponding to the last key event in the sequence</li>
 *    </ul>
 * </ul>
 * 
 * @param 	{function}	hdlr	the handler function. This method should have the following
 * 									signature <code>Boolean hdlr(Int actionCode DwtKeyEvent event);</code>
 * 
 * @see DwtKeyEvent
 */
DwtKeyboardMgr.prototype.registerDefaultKeyActionHandler = function(hdlr) {

	if (this.isEnabled()) {
        this.__defaultKeyActionHdlr = hdlr;
    }
};

/**
 * Registers a keymap with the shell. A keymap typically
 * is a subclass of {@link DwtKeyMap} and defines the mappings from key sequences to
 * actions.
 *
 * @param {DwtKeyMap} keyMap		the key map to register
 * 
 */
DwtKeyboardMgr.prototype.registerKeyMap = function(keyMap) {

	if (this.isEnabled()) {
	    this.__keyMapMgr = new DwtKeyMapMgr(keyMap);
    }
};

/**
 * Sets the timeout (in milliseconds) between key presses for handling multi-keypress sequences.
 * 
 * @param 	{number}	timeout		the timeout (in milliseconds)
 */
DwtKeyboardMgr.prototype.setKeyTimeout = function(timeout) {
	this.__keyTimeout = timeout;
};

/**
 * Clears the key sequence. The next key event will begin a new one.
 * 
 */
DwtKeyboardMgr.prototype.clearKeySeq = function() {

	this.__killKeySeqTimedActionId = -1;
	this.__keySequence = [];
};

/**
 * Enables/disables keyboard nav (shortcuts).
 * 
 * @param 	{boolean}	enabled		if <code>true</code>, enable keyboard nav
 */
DwtKeyboardMgr.prototype.enable = function(enabled) {

	DBG.println(AjxDebug.DBG2, "keyboard shortcuts enabled: " + enabled);
	this.__shortcutsEnabled = enabled;
};

DwtKeyboardMgr.prototype.isEnabled = function() {
	return this.__shortcutsEnabled;
};

/**
 * Adds a global key event listener.
 *
 * @param {constant}	ev			key event type
 * @param {AjxListener}	listener	listener to notify
 */
DwtKeyboardMgr.prototype.addListener = function(ev, listener) {
	this._evtMgr.addListener(ev, listener);
};

/**
 * Removes a global key event listener.
 *
 * @param {constant}	ev			key event type
 * @param {AjxListener}	listener	listener to remove
 */
DwtKeyboardMgr.prototype.removeListener = function(ev, listener) {
	this._evtMgr.removeListener(ev, listener);
};

DwtKeyboardMgr.prototype.__doGrabFocus = function(focusObj) {

	if (!focusObj) {
        return;
    }

    var curFocusObj = this.getFocusObj();
    if (curFocusObj && curFocusObj.blur) {
        DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr DOGRABFOCUS cur focus obj: " + [curFocusObj, curFocusObj._htmlElId || curFocusObj.id].join(' / '));
        curFocusObj.blur();
    }

    DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr DOGRABFOCUS new focus obj: " + [focusObj, focusObj._htmlElId || focusObj.id].join(' / '));
    if (focusObj.focus) {
        // focus handler should lead to focus update, but just in case ...
        this.updateFocus(focusObj.focus() || focusObj);
    }
};

/**
 * @private
 */
DwtKeyboardMgr.__keyUpHdlr = function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "keyup: " + ev.keyCode);

	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYUP, ev) === false) {
		return false;
	}

	// clear saved Gecko key
	if (AjxEnv.isMac && AjxEnv.isGeckoBased && ev.keyCode === 0) {
		return DwtKeyboardMgr.__keyDownHdlr(ev);
	}
    else {
		return DwtKeyboardMgr.__handleKeyEvent(ev);
	}
};

/**
 * @private
 */
DwtKeyboardMgr.__keyPressHdlr = function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "keypress: " + (ev.keyCode || ev.charCode));

	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYPRESS, ev) === false) {
		return false;
	}

	DwtKeyEvent.geckoCheck(ev);

	return DwtKeyboardMgr.__handleKeyEvent(ev);
};

/**
 * @private
 */
DwtKeyboardMgr.__handleKeyEvent =
function(ev) {

	if (DwtKeyboardMgr.__shell._blockInput) {
        return false;
    }

	ev = DwtUiEvent.getEvent(ev, this);
	DBG.println(AjxDebug.KEYBOARD, [ev.type, ev.keyCode, ev.charCode, ev.which].join(" / "));
	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	var kev = DwtShell.keyEvent;
	kev.setFromDhtmlEvent(ev);

	if (kbMgr.__kbEventStatus != DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED) {
		return kbMgr.__processKeyEvent(ev, kev, false);
	}
};

/**
 * @private
 */
DwtKeyboardMgr.__keyDownHdlr = function(ev) {

	try {

	ev = DwtUiEvent.getEvent(ev, this);
	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	ev.focusObj = null;
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYDOWN, ev) === false) {
		return false;
	}

	if (DwtKeyboardMgr.__shell._blockInput) {
        return false;
    }
	DBG.println(AjxDebug.KEYBOARD, [ev.type, ev.keyCode, ev.charCode, ev.which].join(" / "));

	var kev = DwtShell.keyEvent;
	kev.setFromDhtmlEvent(ev);
	var keyCode = DwtKeyEvent.getCharCode(ev);
	DBG.println(AjxDebug.KEYBOARD, "keydown: " + keyCode + " -------- " + ev.target);

	// Popdown any tooltip
	DwtKeyboardMgr.__shell.getToolTip().popdown();

    /********* FOCUS MANAGEMENT *********/

	/* The first thing we care about is the tab key since we want to manage
	 * focus based on the tab groups. 
	 * 
	 * If the tab hit happens in the currently
	 * focused obj, the go to the next/prev element in the tab group. 
	 * 
	 * If the tab happens in an element that is in the tab group hierarchy, but that 
	 * element is not the currently focus element in the tab hierarchy (e.g. the user
	 * clicked in it and we didnt detect it) then sync the tab group's current focus 
	 * element and handle the tab
	 * 
	 * If the tab happens in an object not under the tab group hierarchy, then set
	 * focus to the current focus object in the tab hierarchy i.e. grab back control
	 */
    var ctg = kbMgr.__currTabGroup,
        member;

	if (keyCode == DwtKeyEvent.KEY_TAB) {
	    if (ctg && !DwtKeyMapMgr.hasModifier(kev)) {
			DBG.println(AjxDebug.FOCUS, "Tab");
			// If the tab hit is in an element or if the current tab group has a focus member
			if (ctg.getFocusMember()) {
                member = kev.shiftKey ? ctg.getPrevFocusMember(true) : ctg.getNextFocusMember(true);
			}
            else {
			 	DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr.__keyDownHdlr: no current focus member, resetting to first in tab group");
			 	// If there is no current focus member, then reset
                member = ctg.resetFocusMember(true);
			}
	    }
        // If we did not handle the Tab, let the browser handle it
        return kbMgr.__processKeyEvent(ev, kev, !member, member ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);
	}
    else if (ctg && AjxEnv.isGecko && kev.target instanceof HTMLHtmlElement) {
	 	/* With FF we focus get set to the <html> element when tabbing in
	 	 * from the address or search fields. What we want to do is capture
	 	 * this here and reset the focus to the first element in the tabgroup
	 	 * 
	 	 * TODO Verify this trick is needed/works with IE/Safari
	 	 */
        member = ctg.resetFocusMember(true);
	}
	 
    // Allow key events to propagate when keyboard manager is disabled (to avoid taking over browser shortcuts). Bugzilla #45469.
    if (!kbMgr.isEnabled()) {
        return true;
    }


    /********* SHORTCUTS *********/

	// Filter out modifier keys. If we're in an input field, filter out legitimate input.
	// (A shortcut from an input field must use a modifier key.)
	if (DwtKeyMap.IS_MODIFIER[keyCode] || (kbMgr.__killKeySeqTimedActionId === -1 &&
		kev.target && DwtKeyMapMgr.isInputElement(kev.target) && !kev.target["data-hidden"] && !DwtKeyboardMgr.isPossibleInputShortcut(kev))) {

	 	return kbMgr.__processKeyEvent(ev, kev, true, DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);
	}
	 
	/* Cancel any pending time action to kill the keysequence */
	if (kbMgr.__killKeySeqTimedActionId != -1) {
		AjxTimedAction.cancelAction(kbMgr.__killKeySeqTimedActionId);
		kbMgr.__killKeySeqTimedActionId = -1;
	}
		
 	var parts = [];
	if (kev.altKey) 	{ parts.push(DwtKeyMap.ALT); }
	if (kev.ctrlKey) 	{ parts.push(DwtKeyMap.CTRL); }
 	if (kev.metaKey) 	{ parts.push(DwtKeyMap.META); }
	if (kev.shiftKey) 	{ parts.push(DwtKeyMap.SHIFT); }
	parts.push(keyCode);
	kbMgr.__keySequence[kbMgr.__keySequence.length] = parts.join(DwtKeyMap.JOIN);

	DBG.println(AjxDebug.KEYBOARD, "KEYCODE: " + keyCode + " - KEY SEQ: " + kbMgr.__keySequence.join(""));
	
	var handled = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;

	// First see if the control that currently has focus can handle the key event
	var obj = ev.focusObj || kbMgr.__focusObj;
    var hasFocus = obj && obj.hasFocus && obj.hasFocus();
    DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr::__keyDownHdlr - focus object " + obj + " has focus: " + hasFocus);
	if (hasFocus && obj.handleKeyAction) {
		handled = kbMgr.__dispatchKeyEvent(obj, kev);
		while ((handled === DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED) && obj.parent) {
			obj = obj.parent;
            if (obj.getKeyMapName) {
			    handled = kbMgr.__dispatchKeyEvent(obj, kev);
            }
		}
	}

	// If the currently focused control didn't handle the event, hand it to the default key event handler
	if (handled === DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED && kbMgr.__currDefaultHandler) {
		handled = kbMgr.__dispatchKeyEvent(kbMgr.__currDefaultHandler, kev);
	}

	// see if we should let browser handle the event as well; note that we need to set the 'handled' var rather than
	// just the 'propagate' one below, since the keyboard mgr isn't built for both it and the browser to handle the event.
	if (kev.forcePropagate) {
		handled = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
		kev.forcePropagate = false;
	}
	
	kbMgr.__kbEventStatus = handled;
	var propagate = (handled == DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);

	if (handled != DwtKeyboardMgr.__KEYSEQ_PENDING) {
		kbMgr.clearKeySeq();
	}

	return kbMgr.__processKeyEvent(ev, kev, propagate);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * Handles event dispatching
 * 
 * @private
 */
DwtKeyboardMgr.prototype.__dispatchKeyEvent = function(hdlr, ev, forceActionCode) {

	if (hdlr && hdlr.handleKeyEvent) {
		var handled = hdlr.handleKeyEvent(ev);
		return handled ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}

	var mapName = (hdlr && hdlr.getKeyMapName) ? hdlr.getKeyMapName() : null;
	if (!mapName) {
		return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}

	DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: handler " + hdlr.toString() + " handling " + this.__keySequence + " for map: " + mapName);
	var actionCode = this.__keyMapMgr.getActionCode(this.__keySequence, mapName, forceActionCode);
	if (actionCode === DwtKeyMapMgr.NOT_A_TERMINAL) {
		DBG.println(AjxDebug.KEYBOARD, "scheduling action to kill key sequence");
		/* setup a timed action to redispatch/kill the key sequence in the event
		 * the user does not press another key in the allotted time */
		this.__hdlr = hdlr;
		this.__mapName = mapName;
		this.__ev = ev;
		this.__killKeySeqTimedActionId = AjxTimedAction.scheduleAction(this.__killKeySeqTimedAction, this.__keyTimeout);
		return DwtKeyboardMgr.__KEYSEQ_PENDING;	
	}
    else if (actionCode != null) {
		/* It is possible that the component may not handle a valid action
		 * particulary actions defined in the default map */
		DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: handling action: " + actionCode);
		if (!hdlr.handleKeyAction) {
			return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
		}
		var result = hdlr.handleKeyAction(actionCode, ev);
		return result ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}
    else {
		DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: no action code for " + this.__keySequence);
		return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}
};

/**
 * This method will reattempt to handle the event in the case that the intermediate
 * node in the keymap may have an action code associated with it.
 * 
 * @private
 */
DwtKeyboardMgr.prototype.__killKeySequenceAction = function() {

	DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__killKeySequenceAction: " + this.__mapName);
	this.__dispatchKeyEvent(this.__hdlr, this.__ev, true);
	this.clearKeySeq();
};

/**
 * @private
 */
DwtKeyboardMgr.prototype.__tabGrpChangeListener = function(ev) {
	this.__doGrabFocus(ev.newFocusMember);
};

/**
 * @private
 */
DwtKeyboardMgr.prototype.__processKeyEvent = function(ev, kev, propagate, status) {

	if (status) {
		this.__kbEventStatus = status;
	}
	kev._stopPropagation = !propagate;
	kev._returnValue = propagate;
	kev.setToDhtmlEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "key event returning: " + propagate);
	return propagate;
};
}

if (AjxPackage.define("ajax.soap.AjxSoapDoc")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Default constructor.
 * @class
 * Note: do not directly instantiate AjxSoapDoc. Use one of the <code>create</code> methods instead
 * 
 * @see		AjxSoapDoc.create
 */
AjxSoapDoc = function() {
	this._soapURI = AjxSoapDoc._SOAP_URI;
}

AjxSoapDoc.prototype.isAjxSoapDoc = true;
AjxSoapDoc.prototype.toString = function() { return "AjxSoapDoc"; };

AjxSoapDoc._SOAP_URI = "http://www.w3.org/2003/05/soap-envelope";
// AjxSoapDoc._SOAP_URI = "http://schemas.xmlsoap.org/soap/envelope/";
AjxSoapDoc._XMLNS_URI = "http://www.w3.org/2000/xmlns";

/**
 * Creates a SOAP document.
 * 
 * @param	{string}	method		the soap method
 * @param	{string}	namespace	the method namespace
 * @param	{string}	[namespaceId]	the namespace id
 * @param	{string}	[soapURI]	the SOAP uri
 * @return	{AjxSoapDoc}		the document
 */
AjxSoapDoc.create =
function(method, namespace, namespaceId, soapURI) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.create();
	var d = sd._xmlDoc.getDoc();

	if (!soapURI)
		soapURI = AjxSoapDoc._SOAP_URI;
	sd._soapURI = soapURI;

	var useNS = d.createElementNS && !AjxEnv.isSafari;
	var envEl = useNS ?  d.createElementNS(soapURI, "soap:Envelope") : d.createElement("soap:Envelope");
	if (!useNS) envEl.setAttribute("xmlns:soap", soapURI);

	d.appendChild(envEl);

	var bodyEl = useNS ? d.createElementNS(soapURI, "soap:Body") : d.createElement("soap:Body");
	envEl.appendChild(bodyEl);

	sd._methodEl = namespace && useNS ?  d.createElementNS(namespace, method) : d.createElement(method);
	if (namespace != null && !useNS) {
		if (namespaceId == null)
			sd._methodEl.setAttribute("xmlns", namespace);
		else
			sd._methodEl.setAttribute("xmlns:" + namespaceId, namespace);
	}
	bodyEl.appendChild(sd._methodEl);
	return sd;
};

/**
 * Creates from a DOM object.
 * 
 * @param	{Object}	doc		the DOM object
 * @return	{AjxSoapDoc}		the document
 */
AjxSoapDoc.createFromDom =
function(doc) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.createFromDom(doc);
	sd._methodEl = sd._check(sd._xmlDoc);
	return sd;
};

/**
 * Creates from an XML object.
 * 
 * @param	{Object}	xml		the XML object
 * @return	{AjxSoapDoc}		the document
 */
AjxSoapDoc.createFromXml =
function(xml) {
	var sd = new AjxSoapDoc();
	sd._xmlDoc = AjxXmlDoc.createFromXml(xml);
	sd._methodEl = sd._check(sd._xmlDoc);
	return sd;
};

AjxSoapDoc.element2FaultObj =
function(el) {
	// If the element is not a SOAP fault, then return null
	var faultEl = el.firstChild;
	// Safari is bad at handling namespaces
	if (!AjxEnv.isSafari) {
		if (faultEl != null && faultEl.namespaceURI != AjxSoapDoc._SOAP_URI || faultEl.nodeName != (el.prefix + ":Fault"))
		return null;
	} else {
		if (faultEl != null && faultEl.nodeName != (el.prefix + ":Fault"))
			return null;
	}
	return new AjxSoapFault(faultEl);
};

AjxSoapDoc.prototype.setMethodAttribute =
function(name, value) {
	this._methodEl.setAttribute(name, value);
};

/**
 * Creates arguments to pass within the envelope.  "value" can be a JS object
 * or a scalar (string, number, etc.).
 * <p>
 * When "value" is a JS object, set() will call itself recursively in order to
 * create a complex data structure.  Don't pass a "way-too-complicated" object
 * ("value" should only contain references to simple JS objects, or better put,
 * hashes--don't include a reference to the "window" object as it will kill
 * your browser).
 * <p>
 * Example:
 *
 * <pre>
 *    soapDoc.set("user_auth", {
 *       user_name : "foo",
 *       password  : "bar"
 *    });
 * </pre>
 * 
 * will create an XML like this under the method tag:
 *
 * <pre>
 *    &lt;user_auth>
 *      &lt;user_name>foo&lt;/user_name>
 *      &lt;password>bar&lt;/password>
 *    &lt;/user_auth>
 * </pre>
 * 
 * Of course, nesting other hashes is allowed and will work as expected.
 * <p>
 * NOTE: you can pass null for "name", in which case "value" is expected to be
 * an object whose properties will be created directly under the method el.
 * 
 * @param	{string}	name	the name
 * @param	{hash}	value		the attribute name/value pairs
 * @param	{string}	[parent]	the parent element to append to
 * @param	{string}	[namespace]	the namespace
 * @return	{Element}	the node element
 */
AjxSoapDoc.prototype.set =
function(name, value, parent, namespace) {
	var	doc = this.getDoc();

	var useNS = doc.createElementNS && !AjxEnv.isSafari;

	var	p = name
		? (namespace && useNS ? doc.createElementNS(namespace, name) : doc.createElement(name))
		: doc.createDocumentFragment();

    if ((namespace !== undefined) && (namespace !== null) && !useNS) {
        p.setAttribute("xmlns", namespace);
    }

	if (value != null) {
		if (typeof value == "object") {
			for (var i in value) {
                                var val = value[i];
                                if (i.charAt(0) == "!") {
                                        // attribute
                                        p.setAttribute(i.substr(1), val);
                                } else if (val instanceof Array) {
                                        // add multiple elements
                                        for (var j = 0; j < val.length; ++j)
                                                this.set(i, val[j], p);
                                } else {
				        this.set(i, val, p);
                                }
			}
		} else {
			p.appendChild(doc.createTextNode(value));
		}
	}
	if (!parent)
		parent = this._methodEl;
	return parent.appendChild(p);
};

/**
 * Gets the method.
 * 
 * @return	{string}	the method
 */
AjxSoapDoc.prototype.getMethod =
function() {
	return this._methodEl;
};

/**
 * Creates a header element.
 * 
 * @return	{Element}	the header element
 */
AjxSoapDoc.prototype.createHeaderElement =
function() {
	var d = this._xmlDoc.getDoc();
	var envEl = d.firstChild;
	var header = this.getHeader();
	if (header != null) {
		throw new AjxSoapException("SOAP header already exists", AjxSoapException.ELEMENT_EXISTS, "AjxSoapDoc.prototype.createHeaderElement");
	}
	var useNS = d.createElementNS && !AjxEnv.isSafari;
	header = useNS ? d.createElementNS(this._soapURI, "soap:Header") : d.createElement("soap:Header")
	envEl.insertBefore(header, envEl.firstChild);
	return header;
};

/**
 * Gets the header.
 * 
 * @return	{Element}	the header or <code>null</code> if not created
 */
AjxSoapDoc.prototype.getHeader =
function() {
	// fall back to getElementsByTagName in IE 8 and earlier
	var d = this._xmlDoc.getDoc();
	var nodeList = !d.getElementsByTagNameNS
		? (d.getElementsByTagName(d.firstChild.prefix + ":Header"))
		: (d.getElementsByTagNameNS(this._soapURI, "Header"));

	return nodeList ? nodeList[0] : null;
};

/**
 * Gets the body.
 * 
 * @return	{Element}	the body element
 */
AjxSoapDoc.prototype.getBody =
function() {
	// fall back to getElementsByTagName in IE 8 and earlier
	var d = this._xmlDoc.getDoc();
	var nodeList = !d.getElementsByTagNameNS
		? (d.getElementsByTagName(d.firstChild.prefix + ":Body"))
		: (d.getElementsByTagNameNS(this._soapURI, "Body"));

	return nodeList ? nodeList[0] : null;
};

AjxSoapDoc.prototype.getByTagName =
function(type) {
	if (type.indexOf(":") == -1)
		type = "soap:" + type;

	var a = this.getDoc().getElementsByTagName(type);

	if (a.length == 1)		return a[0];
	else if (a.length > 0)	return a;
	else					return null;
};

// gimme a header, no exceptions.
AjxSoapDoc.prototype.ensureHeader =
function() {
	return (this.getHeader() || this.createHeaderElement());
};

/**
 * Gets the document.
 * 
 * @return	{Document}	the document
 */
AjxSoapDoc.prototype.getDoc =
function() {
	return this._xmlDoc.getDoc();
};

/**
 * Adopts a node from another document to this document.
 * 
 * @param	{Element}	node		the node
 * @private
 */
AjxSoapDoc.prototype.adoptNode =
function(node) {
	// Older firefoxes throw not implemented error when you call adoptNode.
	if (AjxEnv.isFirefox3up || !AjxEnv.isFirefox) {
		try {
			var doc = this.getDoc();
			if (doc.adoptNode) {
				return doc.adoptNode(node, true);
			}
		} catch (ex) {
			// handle below by returning the input node.
		}
	}
	// call removeChild since Safari complains if you try to add an already
	// parented node to another document.
	return node.parentNode.removeChild(node);
};

/**
 * Gets the XML.
 * 
 * @return	{string}	the XML
 */
AjxSoapDoc.prototype.getXml = function() {
    return this._xmlDoc.getXml();
};

// Very simple checking of soap doc. Should be made more comprehensive
AjxSoapDoc.prototype._check =
function(xmlDoc) {
	var doc = xmlDoc.getDoc();
	if (doc.childNodes.length != 1)
		throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:1");

	// Check to make sure we have a soap envelope
	var el = doc.firstChild;

	// Safari is bad at handling namespaces
	if (!AjxEnv.isSafari) {
		if (el.namespaceURI != AjxSoapDoc._SOAP_URI ||
			el.nodeName != (el.prefix + ":Envelope") ||
			(el.childNodes.length < 1 || el.childNodes.length > 2))
		{
			DBG.println("<font color=red>XML PARSE ERROR on RESPONSE:</font>");
			DBG.printRaw(doc.xml);
			throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:2");
		}
	} else {
		if (el.nodeName != (el.prefix + ":Envelope"))
			throw new AjxSoapException("Invalid SOAP PDU", AjxSoapException.INVALID_PDU, "AjxSoapDoc.createFromXml:2");
	}
};
}
if (AjxPackage.define("ajax.soap.AjxSoapException")) {
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
 * Creates a SOAP exception.
 * @class
 * 
 * 
 * @param {string} 		[msg]		the human readable message
 * @param {constant}		code		the exception code
 * @param {string} 		[method] 	the name of the method throwing the exception
 * @param {string} 		[detail]		any additional detail
 * 
 * @extends		AjxException
 * 
 * @private
 */
AjxSoapException = function(msg, code, method, detail) {
	AjxException.call(this, msg, code, method, detail);
}

AjxSoapException.prototype.toString = 
function() {
	return "AjxSoapException";
}

AjxSoapException.prototype = new AjxException;
AjxSoapException.prototype.constructor = AjxSoapException;

/**
 * Defines an "internal error" exception.
 */
AjxSoapException.INTERNAL_ERROR 	= "INTERNAL_ERROR";
/**
 * Defines an "invalid PDU" exception.
 */
AjxSoapException.INVALID_PDU 		= "INVALID_PDU";
/**
 * Defines an "element exists" exception.
 */
AjxSoapException.ELEMENT_EXISTS 	= "ELEMENT_EXISTS";
}

if (AjxPackage.define("ajax.net.AjxRpc")) {
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
 * @constructor
 * @class
 * This static class provides an interface for send requests to a server. It
 * essentially wraps {@link AjxRpcRequest}. This {@link AjxRpc} link maintains a cache of
 * {@link AjxRpcRequest} objects which it attempts to reuse before allocating additional
 * objects. It also has a mechanism whereby if an {@link AjxRpcRequest} object is 
 * in a "busy" state for a extended period of time, it will reap it appropriately.
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 * @see AjxRpcRequest
 */
AjxRpc = function() {
};

AjxRpc.__rpcCache		= [];		// The pool of RPC contexts available
AjxRpc.__rpcOutstanding	= {};		// The pool of RPC contexts in use

AjxRpc.__RPC_CACHE_MAX		= 50;		// maximum number of busy contexts we can have
AjxRpc.__RPC_ID				= 0;		// used for context IDs
AjxRpc.__RPC_IN_USE			= 0;		// number of contexts that are busy
AjxRpc.__RPC_HIGH_WATER		= 0;		// high water mark for busy contexts
AjxRpc.__RPC_REAP_AGE		= 300000;	// 5 minutes; mark any context older than this (in ms) as free
AjxRpc.__RPC_REAP_INTERVAL	= 1800000;	// 30 minutes; run the reaper this often

/**
 * Submits a request to a URL. The request is handled through a pool of request
 * contexts (each a wrapped XmlHttpRequest). The context does the real work.
 *
 * @param {string} [requestStr] 	the HTTP request string/document
 * @param {string} serverUrl 	the request target 
 * @param {array} [requestHeaders] an array of HTTP request headers
 * @param {AjxCallback} callback 	the callback for asynchronous requests. This callback 
 * 		will be invoked when the requests completes. It will be passed the same
 * 		values as when this method is invoked synchronously (see the return values
 * 		below) with the exception that if the call times out (see timeout param 
 * 		below), then the object passed to the callback will be the same as in the 
 * 		error case with the exception that the status will be set to 
 * 		{@link AjxRpcRequest.TIMEDOUT}.
 * @param {Constant} [method] 		the HTTP method -- GET, POST, PUT, DELETE. if <code>true</code>, use get method for backward compatibility
 * @param {number} [timeout] 		the timeout (in milliseconds) after which the request is canceled
 * 
 * @return {object|hash}	if invoking in asynchronous mode, then it will return the id of the 
 * 		underlying {@link AjxRpcRequest} object. Else if invoked synchronously, if
 * 		there is no error (i.e. we get a HTTP result code of 200 from the server),
 * 		an object with the following attributes is returned
 * 		<ul>
 * 		<li>text - the string response text</li>
 * 		<li>xml - the string response xml</li>
 * 		<li>success - boolean set to true</li>
 * 		</ul>
 * 		If there is an error, then the following will be returned
 * 		<ul>
 * 		<li>text - the string response text<li>
 * 		<li>xml - the string response xml </li>
 * 		<li>success - boolean set to <code>false</code></li>
 * 		<li>status - HTTP status</li>
 * 		</ul>
 * 
 * @throws	{AjxException.NETWORK_ERROR}	a network error occurs
 * @throws	{AjxException.UNKNOWN_ERROR}	an unknown error occurs
 * 
 * @see	AjxRpcRequest#invoke
 * 
 */
AjxRpc.invoke =
function(requestStr, serverUrl, requestHeaders, callback, method, timeout) {

	var asyncMode = (callback != null);
	var rpcCtxt = AjxRpc.__getFreeRpcCtxt();

	try {
		var response = rpcCtxt.invoke(requestStr, serverUrl, requestHeaders, callback, method, timeout);
	} catch (ex) {
		var newEx = new AjxException();
		newEx.method = "AjxRpc.prototype._invoke";
		if (ex instanceof Error) {
			newEx.detail = ex.message;
			newEx.code = AjxException.NETWORK_ERROR;
			newEx.msg = "Network error";
		} else if (ex.code == 101){
			// Chrome 
			newEx.detail = ex.message;
			newEx.code = AjxException.NETWORK_ERROR;
			newEx.msg = "Network error";
		} else {
			newEx.detail = ex.toString();
			newEx.code = AjxException.UNKNOWN_ERROR;
			newEx.msg = "Unknown Error";
		}
		// exception hit: we're done whether sync or async, free the context
		AjxRpc.freeRpcCtxt(rpcCtxt);
		throw newEx;
	}
	if (!asyncMode) {
		// we've returned from a sync request, free the context
		AjxRpc.freeRpcCtxt(rpcCtxt);
	}
	return response;
};

/**
 * @private
 */
AjxRpc.freeRpcCtxt =
function(rpcCtxt) {
	// we're done using this rpcCtxt. Add it back to the pool
	if (AjxRpc.__rpcOutstanding[rpcCtxt.id]) {
		AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " --- freeing rpcCtxt " + rpcCtxt.id);
		AjxRpc.__rpcCache.push(rpcCtxt);
		delete AjxRpc.__rpcOutstanding[rpcCtxt.id];
		AjxRpc.__RPC_IN_USE--;
	}
};

AjxRpc.removeRpcCtxt =
function(rpcCtxt) {
	AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " REMOVE rpcCtxt " + rpcCtxt.id);
	if (AjxRpc.__rpcOutstanding[rpcCtxt.id]) {
		delete AjxRpc.__rpcOutstanding[rpcCtxt.id];
		AjxRpc.__RPC_IN_USE--;
	}
	AjxUtil.arrayRemove(AjxRpc.__rpcCache, rpcCtxt);
};

/**
 * Returns the request from the RPC context with the given ID.
 *
 * @param {String} id RPC context ID
 * 
 * @return The <i>AjxRpcRequest</i> object associated with <code>id</code> or null
 * 		if no object exists for the supplied id
 * @type AjxRpcRequest
 * 
 * @private
 */
AjxRpc.getRpcRequestById = 
function(id) {
	return (AjxRpc.__rpcOutstanding[id]);
};

/**
 * Factory method for getting context objects.
 * 
 * @private
 */
AjxRpc.__getFreeRpcCtxt = 
function() {
	var rpcCtxt;

	if (AjxRpc.__rpcCache.length > 0) {
		rpcCtxt = AjxRpc.__rpcCache.pop();
		AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " reusing RPC ID " + rpcCtxt.id);
	} else {
		if (AjxRpc.__RPC_IN_USE < AjxRpc.__RPC_CACHE_MAX) {
			// we haven't reached our limit, so create a new AjxRpcRequest
			var id = "__RpcCtxt_" + AjxRpc.__RPC_ID;
			rpcCtxt = new AjxRpcRequest(id);
			AjxRpc.__RPC_ID++;
			AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " Created RPC " + id);
		} else {
			// yikes, we're out of rpc's! Look for an old one to kill.
			rpcCtxt = AjxRpc.__reap();

			// if reap didn't find one either, bail.
			if (!rpcCtxt) {
				var text = [];
				for (var i in AjxRpc.__rpcOutstanding) {
					var rpcCtxt = AjxRpc.__rpcOutstanding[i];
					text.push(rpcCtxt.methodName);
				}
				var detail = text.join("<br>") + "<br>";
				AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " Out of RPC cache!!! Outstanding requests: " + detail);
				throw new AjxException("Out of RPC cache", AjxException.OUT_OF_RPC_CACHE, "AjxRpc.__getFreeRpcCtxt", detail);
			}
		}
	}

	AjxRpc.__rpcOutstanding[rpcCtxt.id] = rpcCtxt;
	AjxRpc.__RPC_IN_USE++;
	if (AjxRpc.__RPC_IN_USE > AjxRpc.__RPC_HIGH_WATER) {
		AjxRpc.__RPC_HIGH_WATER = AjxRpc.__RPC_IN_USE;
		AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " High water mark: " + AjxRpc.__RPC_HIGH_WATER);
	}

	// always reset timestamp before returning rpcCtxt
	rpcCtxt.timestamp = (new Date()).getTime();
	return rpcCtxt;
};

/**
 * Frees expired contexts.
 * 
 * @param {boolean}	all		if true, frees all expired contexts; otherwise, returns the first one it finds
 * @private
 */
AjxRpc.__reap =
function(all) {
	var rpcCtxt;
	var time = (new Date()).getTime();
	AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " Running RPC context reaper");
	for (var i in AjxRpc.__rpcOutstanding) {
		rpcCtxt = AjxRpc.__rpcOutstanding[i];
		if ((rpcCtxt.timestamp + AjxRpc.__RPC_REAP_AGE) < time) {
			DBG.println(AjxDebug.DBG1, "AjxRpc.__reap: cleared RPC context " + rpcCtxt.id);
			AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " AjxRpc.__reap: cleared RPC context " + rpcCtxt.id);
			rpcCtxt.cancel();
			delete AjxRpc.__rpcOutstanding[i];
			AjxRpc.__RPC_IN_USE--;
			if (!all) {
				return rpcCtxt;
			}
		}
	}
	return null;
};

window.setInterval(AjxRpc.__reap.bind(null, true), AjxRpc.__RPC_REAP_INTERVAL);
}
if (AjxPackage.define("ajax.net.AjxRpcRequest")) {
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
 * @constructor
 * @class
 * This class encapsulates the XML HTTP request, hiding differences between
 * browsers. The internal request object depends on the browser. While it is 
 * possible to use this class directly, {@link AjxRpc} provides a managed interface
 * to this class 
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 * @param {string} [id]		the ID to identify this object
 * 
 * @see AjxRpc
 * 
 */
AjxRpcRequest = function(id) {
	if (!AjxRpcRequest.__inited) {
		AjxRpcRequest.__init();
	}

	/**
	 * The id for this object.
	 */
	this.id = id;
	this.__httpReq = AjxRpcRequest.__msxmlVers
		? (new ActiveXObject(AjxRpcRequest.__msxmlVers))
		: (new XMLHttpRequest());
};

AjxRpcRequest.prototype.isAjxRpcRequest = true;
AjxRpcRequest.prototype.toString = function() { return "AjxRpcRequest"; };

AjxRpcRequest.TIMEDOUT		= -1000;		// Timed out exception
AjxRpcRequest.HTTP_GET		= "get";		//HTTP GET
AjxRpcRequest.HTTP_POST		= "post";		//HTTP POST
AjxRpcRequest.HTTP_PUT		= "put";		//HTTP PUT
AjxRpcRequest.HTTP_DELETE	= "delete";		//HTTP DELETE

AjxRpcRequest.__inited		= false;
AjxRpcRequest.__msxmlVers	= null;


/**
 * Sends this request to the target URL. If there is a callback, the request is
 * performed asynchronously.
 * 
 * @param {string} [requestStr] 	the HTTP request string/document
 * @param {string} serverUrl 	the request target 
 * @param {array} [requestHeaders] an array of HTTP request headers
 * @param {AjxCallback} callback 	the callback for asynchronous requests. This callback 
 * 		will be invoked when the requests completes. It will be passed the same
 * 		values as when this method is invoked synchronously (see the return values
 * 		below) with the exception that if the call times out (see timeout param 
 * 		below), then the object passed to the callback will be the same as in the 
 * 		error case with the exception that the status will be set to 
 * 		{@link AjxRpcRequest.TIMEDOUT}.
 * @param {Constant} [method] 		the HTTP method -- GET, POST, PUT, DELETE. if <code>true</code>, use get method for backward compatibility
 * @param {number} [timeout] 		the timeout (in milliseconds) after which the request is canceled
 * 
 * @return {object|hash}	if invoking in asynchronous mode, then it will return the id of the 
 * 		underlying {@link AjxRpcRequest} object. Else if invoked synchronously, if
 * 		there is no error (i.e. we get a HTTP result code of 200 from the server),
 * 		an object with the following attributes is returned
 * 		<ul>
 * 		<li>text - the string response text</li>
 * 		<li>xml - the string response xml</li>
 * 		<li>success - boolean set to true</li>
 * 		</ul>
 * 		If there is an eror, then the following will be returned
 * 		<ul>
 * 		<li>text - the string response text<li>
 * 		<li>xml - the string response xml </li>
 * 		<li>success - boolean set to <code>false</code></li>
 * 		<li>status - HTTP status</li>
 * 		</ul>
 * 
 * @throws	{AjxException.NETWORK_ERROR}	a network error occurs
 * @throws	{AjxException.UNKNOWN_ERROR}	an unknown error occurs
 * 
 * @see AjxRpc.invoke
 */
AjxRpcRequest.prototype.invoke =
function(requestStr, serverUrl, requestHeaders, callback, method, timeout) {


	var asyncMode = (callback != null);
	this.methodName = serverUrl || "";

	// An exception here will be caught by AjxRpc.invoke
	var httpMethod = AjxRpcRequest.HTTP_POST;
	if (method) {
		httpMethod = method === true ? AjxRpcRequest.HTTP_GET : method;
	}

	if (window.csrfToken &&
		(httpMethod === AjxRpcRequest.HTTP_POST ||
		httpMethod === AjxRpcRequest.HTTP_PUT ||
		httpMethod === AjxRpcRequest.HTTP_DELETE)) {

		requestHeaders = requestHeaders || {};
		requestHeaders["X-Zimbra-Csrf-Token"] = window.csrfToken;

	}

	this.__httpReq.open(httpMethod, serverUrl, asyncMode);

	if (asyncMode) {
		if (timeout) {
			var action = new AjxTimedAction(this, this.__handleTimeout, [callback]);
			callback._timedActionId = AjxTimedAction.scheduleAction(action, timeout);
		}
		var tempThis = this;
		this.__httpReq.onreadystatechange = function(ev) {
			if (window.AjxRpcRequest) {
				AjxRpcRequest.__handleResponse(tempThis, callback);
			}
		}
	} else {
		// IE appears to run handler even on sync requests, so we need to clear it
		this.__httpReq.onreadystatechange = function(ev) {};
	}

	if (requestHeaders) {
		for (var i in requestHeaders) {
            if (requestHeaders.hasOwnProperty(i)) {
                this.__httpReq.setRequestHeader(i, requestHeaders[i]);
            }
		}
	}

	AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " RPC send: " + this.id);
	this.__httpReq.send(requestStr);
	if (asyncMode) {
		return this.id;
	} else {
		if (this.__httpReq.status == 200 || this.__httpReq.status == 201) {
			return {text:this.__httpReq.responseText, xml:this.__httpReq.responseXML, success:true};
		} else {
			return {text:this.__httpReq.responseText, xml:this.__httpReq.responseXML, success:false, status:this.__httpReq.status};
		}
	}
};

/**
 * Cancels a pending request.
 * 
 */
AjxRpcRequest.prototype.cancel =
function() {
	AjxRpc.freeRpcCtxt(this);
    if (AjxEnv.isFirefox3_5up) {
		// bug 55911
        this.__httpReq.onreadystatechange = function(){};
    }
    this.__httpReq.abort();
};

/**
 * Handler that runs when an asynchronous request timesout.
 *
 * @param {AjxCallback} callback 	the callback to run after timeout
 * 
 * @private
 */
AjxRpcRequest.prototype.__handleTimeout =
function(callback) {
	this.cancel();
	callback.run( {text:null, xml:null, success:false, status:AjxRpcRequest.TIMEDOUT} );
};

/**
 * Handler that runs when an asynchronous response has been received. It runs a
 * callback to initiate the response handling.
 *
 * @param {AjxRpcRequest}	req		the request that generated the response
 * @param {AjxCallback}	callback	the callback to run after response is received
 * 
 * @private
 */
AjxRpcRequest.__handleResponse =
function(req, callback) {

	try {

	if (!req || !req.__httpReq) {

		req.cancel();

		// If IE receives a 500 error, the object reference can be lost
		DBG.println(AjxDebug.DBG1, "Async RPC request: Lost request object!!!");
		AjxDebug.println(AjxDebug.RPC, AjxDebug._getTimeStamp() + " Async RPC request: Lost request object!!!");
		callback.run( {text:null, xml:null, success:false, status:500} );
		AjxRpc.freeRpcCtxt(req);
		return;
	}

	if (req.__httpReq.readyState == 4) {
		if (callback._timedActionId !== null) {
			AjxTimedAction.cancelAction(callback._timedActionId);
		}

		var status = 500;
		try {
			status = req.__httpReq.status;
		} catch (ex) {
			// Use default status of 500 above.
		}
		if (status == 200 || status == 201) {
			callback.run( {text:req.__httpReq.responseText, xml:req.__httpReq.responseXML, success:true, reqId:req.id} );
		} else {
			callback.run( {text:req.__httpReq.responseText, xml:req.__httpReq.responseXML, success:false, status:status, reqId:req.id} );
		}

		AjxRpc.freeRpcCtxt(req);
	}

	} catch (ex) {
		if (window.AjxException) {
			AjxException.reportScriptError(ex);
		}
	}
};

/**
 * @private
 */
AjxRpcRequest.__init =
function() {
	if (!window.XMLHttpRequest && window.ActiveXObject) {
		// search for the latest xmlhttp version on user's machine (IE 6)
		var msxmlVers = ["MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
		for (var i = 0; i < msxmlVers.length; i++) {
			try {
				var x = new ActiveXObject(msxmlVers[i]);
				AjxRpcRequest.__msxmlVers = msxmlVers[i];
				break;
			} catch (ex) {
				// do nothing
			}
		}
		if (!AjxRpcRequest.__msxmlVers) {
			throw new AjxException("MSXML not installed", AjxException.INTERNAL_ERROR, "AjxRpc._init");
		}
	}
	AjxRpcRequest.__inited = true;
};

}

if (AjxPackage.define("ajax.debug.AjxDebug")) {
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
 * Creates a new debug window. The document inside is not kept open.  All the
 * output goes into a single &lt;div&gt; element.
 * @constructor
 * @class
 * This class pops up a debug window and provides functions to send output there
 * in various ways. The output is continuously appended to the bottom of the
 * window. The document is left unopened so that the browser doesn't think it's
 * continuously loading and keep its little icon flailing forever. Also, the DOM
 * tree can't be manipulated on an open document. All the output is added to the
 * window by appending it the DOM tree. Another method of appending output is to
 * open the document and use document.write(), but then the document is left open.
 * <p>
 * Any client that uses this class can turn off debugging by changing the first
 * argument to the constructor to {@link AjxDebug.NONE}.
 *
 * @author Conrad Damon
 * @author Ross Dargahi
 *
 * @param {constant}	level	 	debug level for the current debugger (no window will be displayed for a level of NONE)
 * @param {string}		name 		the name of the window (deprecated)
 * @param {boolean}		showTime	if <code>true</code>, display timestamps before debug messages
 * @param {constant}	target		output target (AjxDebug.TGT_WINDOW | AjxDebug.TGT_CONSOLE)
 *
 * @private
 */
AjxDebug = function(params) {

	if (arguments.length == 0) {
		params = {};
	}
	else if (typeof arguments[0] == "number") {
		params = {level:arguments[0], name:arguments[1], showTime:arguments[2]};
	}

	this._showTime = params.showTime;
	this._target = params.target || AjxDebug.TGT_WINDOW;
	this._showTiming = false;
	this._startTimePt = this._lastTimePt = 0;
	this._dbgWindowInited = false;

	this._msgQueue = [];
	this._isPrevWinOpen = false;
	this.setDebugLevel(params.level);
};

AjxDebug.prototype.toString = function() { return "AjxDebug"; };
AjxDebug.prototype.isAjxDebug = true;

/**
 * Defines "no debugging" level.
 */
AjxDebug.NONE = 0; // no debugging (window will not come up)
/**
 * Defines "minimal" debugging level.
 */
AjxDebug.DBG1 = 1; // minimal debugging
/**
 * Defines "moderate" debugging level.
 */
AjxDebug.DBG2 = 2; // moderate debugging
/**
 * Defines "all" debugging level.
 */
AjxDebug.DBG3 = 3; // anything goes

// log output targets
AjxDebug.TGT_WINDOW		= "window";
AjxDebug.TGT_CONSOLE	= "console";

// holds log output in memory so we can show it to user if requested; hash of arrays by type
AjxDebug.BUFFER		= {};
AjxDebug.BUFFER_MAX	= {};

// Special log types. These can be used to make high-priority log info available in prod mode.
// To turn off logging for a type, set its BUFFER_MAX to 0.
AjxDebug.DEFAULT_TYPE	= "debug";		// regular DBG messages
AjxDebug.RPC			= "rpc";		// for troubleshooting "Out of RPC cache" errors
AjxDebug.NOTIFY			= "notify";		// for troubleshooting missing new mail
AjxDebug.EXCEPTION		= "exception";	// JS errors
AjxDebug.CALENDAR		= "calendar";	// for troubleshooting calendar errors
AjxDebug.REPLY			= "reply";		// bug 56308
AjxDebug.SCROLL			= "scroll"; 	// bug 55775
AjxDebug.BAD_JSON		= "bad_json"; 	// bug 57066
AjxDebug.PREFS			= "prefs";		// bug 60942
AjxDebug.PROGRESS       = "progress";	// progress dialog
AjxDebug.REMINDER       = "reminder";   // bug 60692
AjxDebug.OFFLINE        = "offline";
AjxDebug.TAG_ICON       = "tagIcon";    // bug 62155
AjxDebug.DATA_URI       = "dataUri";    // bug 64693
AjxDebug.MSG_DISPLAY	= "msgDisplay";	// bugs 68599, 69616
AjxDebug.ZIMLET			= "zimlet";		// bugs 83009
AjxDebug.KEYBOARD		= "kbnav";		// keyboard manager debugging
AjxDebug.FOCUS			= "focus";		// focus
AjxDebug.FOCUS1			= "focus1";		// focus - minimal logging
AjxDebug.ACCESSIBILITY	= "a11y";		// accessibility logging
AjxDebug.DRAFT	        = "draft";		// draft auto-save

AjxDebug.BUFFER_MAX[AjxDebug.DEFAULT_TYPE]	= 0;	// this one can get big due to object dumps
AjxDebug.BUFFER_MAX[AjxDebug.RPC]			= 200;
AjxDebug.BUFFER_MAX[AjxDebug.NOTIFY]		= 400;
AjxDebug.BUFFER_MAX[AjxDebug.EXCEPTION]		= 100;
AjxDebug.BUFFER_MAX[AjxDebug.CALENDAR]		= 400;
AjxDebug.BUFFER_MAX[AjxDebug.REPLY]			= 400;
AjxDebug.BUFFER_MAX[AjxDebug.SCROLL]		= 100;
AjxDebug.BUFFER_MAX[AjxDebug.BAD_JSON]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.PREFS] 		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.REMINDER]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.OFFLINE]		= 400;
AjxDebug.BUFFER_MAX[AjxDebug.TAG_ICON]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.PROGRESS]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.DATA_URI]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.MSG_DISPLAY]	= 200;
AjxDebug.BUFFER_MAX[AjxDebug.ZIMLET]		= 200;
AjxDebug.BUFFER_MAX[AjxDebug.KEYBOARD]		= null;
AjxDebug.BUFFER_MAX[AjxDebug.FOCUS]			= null;
AjxDebug.BUFFER_MAX[AjxDebug.ACCESSIBILITY]	= null;
AjxDebug.BUFFER_MAX[AjxDebug.DRAFT]	        = 200;

AjxDebug.MAX_OUT = 25000; // max length capable of outputting an XML msg

AjxDebug._CONTENT_FRAME_ID	= "AjxDebug_CF";
AjxDebug._LINK_FRAME_ID		= "AjxDebug_LF";
AjxDebug._BOTTOM_FRAME_ID	= "AjxDebug_BFI";
AjxDebug._BOTTOM_FRAME_NAME	= "AjxDebug_BFN";

AjxDebug.prototype.setTitle =
function(title) {
	if (this._document && !AjxEnv.isIE) {
		this._document.title = title;
	}
};

/**
 * Set debug level. May open or close the debug window if moving to or from level {@link AjxDebug.NONE}.
 *
 * @param {constant}	level	 	debug level for the current debugger
 */
AjxDebug.prototype.setDebugLevel =
function(level) {

	this._level = parseInt(level) || level;
	this._enable(this._level != AjxDebug.NONE);
};

/**
 * Gets the current debug level.
 * 
 * @return	{constant}	the debug level
 */
AjxDebug.prototype.getDebugLevel =
function() {
	return this._level;
};

/**
 * Prints a debug message. Any HTML will be rendered, and a line break is added.
 *
 * @param {constant}	level	 	debug level for the current debugger
 * @param {string}	msg		the text to display
 */
AjxDebug.prototype.println =
function(level, msg, linkName) {
	
	if (!this._isWriteable()) { return; }

	try {
		var result = this._handleArgs(arguments);
		if (!result) { return; }

		msg = result.args.join("");
		var eol = (this._target != AjxDebug.TGT_CONSOLE) ? "<br>" : "";
		this._add({msg:this._timestamp() + msg + eol, linkName:result.linkName, level:level});
	} catch (ex) {
		// do nothing
	}
};

/**
 * Checks if debugging is disabled.
 * 
 * @return	{boolean}		<code>true</code> if disabled
 */
AjxDebug.prototype.isDisabled =
function () {
	return !this._enabled;
};

/**
 * Prints an object into a table, with a column for properties and a column for values. Above the table is a header with the object
 * class and the CSS class (if any). The properties are sorted (numerically if they're all numbers). Creating and appending table
 * elements worked in Mozilla but not IE. Using the insert* methods works for both. Properties that are function
 * definitions are skipped.
 *
 * @param {constant}	level	 	debug level for the current debugger
 * @param {object}	obj		the object to be printed
 * @param {boolean}	showFuncs		if <code>true</code>, show props that are functions
 */
AjxDebug.prototype.dumpObj =
function(level, obj, showFuncs, linkName) {
	if (!this._isWriteable()) { return; }

	var result = this._handleArgs(arguments);
	if (!result) { return; }

	obj = result.args[0];
	if (!obj) { return; }

	showFuncs = result.args[1];
	this._add({obj:obj, linkName:result.linkName, showFuncs:showFuncs, level:level});
};

/**
 * Dumps a bunch of text into a &lt;textarea&gt;, so that it is wrapped and scrollable. HTML will not be rendered.
 *
 * @param {constant}	level	 	debug level for the current debugger
 * @param {string}	text		the text to output as is
 */
AjxDebug.prototype.printRaw =
function(level, text, linkName) {
	if (!this._isWriteable()) { return; }

	var result = this._handleArgs(arguments);
	if (!result) { return; }

	this._add({obj:result.args[0], isRaw:true, linkName:result.linkName, level:level});
};

/**
 * Pretty-prints a chunk of XML, doing color highlighting for different types of nodes.
 *
 * @param {constant}	level	 	debug level for the current debugger
 * @param {string}	text		some XML
 * 
 * TODO: fix for printing to console
 */
AjxDebug.prototype.printXML =
function(level, text, linkName) {
	if (!this._isWriteable()) { return; }

	var result = this._handleArgs(arguments);
	if (!result) { return; }

	text = result.args[0];
	if (!text) { return; }

	// skip generating pretty xml if theres too much data
	if (text.length > AjxDebug.MAX_OUT) {
		this.printRaw(text);
		return;
	}
	this._add({obj:text, isXml:true, linkName:result.linkName, level:level});
};

/**
 * Reveals white space in text by replacing it with tags.
 *
 * @param {constant}	level	 	debug level for the current debugger
 * @param {string}	text		the text to be displayed
 */
AjxDebug.prototype.display =
function(level, text, linkName) {
	if (!this._isWriteable()) { return; }

	var result = this._handleArgs(arguments);
	if (!result) { return; }

	text = result.args[0];
	text = text.replace(/\r?\n/g, '[crlf]');
	text = text.replace(/ /g, '[space]');
	text = text.replace(/\t/g, '[tab]');
	this.printRaw(level, text, linkName);
};

/**
 * Turn the display of timing statements on/off.
 *
 * @param {boolean}	on			if <code>true</code>, display timing statements
 * @param {string}	msg		the message to show when timing is turned on
 */
AjxDebug.prototype.showTiming =
function(on, msg) {
	this._showTiming = on;
	if (on) {
		this._enable(true);
	}
	var state = on ? "on" : "off";
	var text = "Turning timing info " + state;
	if (msg) {
		text = text + ": " + msg;
	}

	var debugMsg = new DebugMessage({msg:text});
	this._addMessage(debugMsg);
	this._startTimePt = this._lastTimePt = new Date().getTime();
};

/**
 * Displays time elapsed since last time point.
 *
 * @param {string}	msg		the text to display with timing info
 * @param {boolean}	restart	if <code>true</code>, set timer back to zero
 */
AjxDebug.prototype.timePt =
function(msg, restart) {
	if (!this._showTiming || !this._isWriteable()) { return; }

	if (restart) {
		this._startTimePt = this._lastTimePt = new Date().getTime();
	}
	var now = new Date().getTime();
	var elapsed = now - this._startTimePt;
	var interval = now - this._lastTimePt;
	this._lastTimePt = now;

	var spacer = restart ? "<br/>" : "";
	msg = msg ? " " + msg : "";
	var text = [spacer, "[", elapsed, " / ", interval, "]", msg].join("");
	var html = "<div>" + text + "</div>";

	// Add the message to our stack
	this._addMessage(new DebugMessage({msg:html}));
	return interval;
};

AjxDebug.prototype.getContentFrame =
function() {
	if (this._contentFrame) {
		return this._contentFrame;
	}
	if (this._debugWindow && this._debugWindow.document) {
		return this._debugWindow.document.getElementById(AjxDebug._CONTENT_FRAME_ID);
	}
	return null;
};

AjxDebug.prototype.getLinkFrame =
function(noOpen) {
	if (this._linkFrame) {
		return this._linkFrame;
	}
	if (this._debugWindow && this._debugWindow.document) {
		return this._debugWindow.document.getElementById(AjxDebug._LINK_FRAME_ID);
	}
	if (!noOpen) {
		this._openDebugWindow();
		return this.getLinkFrame(true);
	}
	return null;
};

// Private methods

AjxDebug.prototype._enable =
function(enabled) {

	this._enabled = enabled;
	if (this._target == AjxDebug.TGT_WINDOW) {
		if (enabled) {
			if (!this._dbgName) {
				this._dbgName = "AjxDebugWin_" + location.hostname.replace(/\./g,'_');
			}
			if (this._debugWindow == null || this._debugWindow.closed) {
				this._openDebugWindow();
			}
		} else {
			if (this._debugWindow) {
				this._debugWindow.close();
				this._debugWindow = null;
			}
		}
	}
};

AjxDebug.prototype._isWriteable =
function() {
	if (this.isDisabled()) {
		return false;
	}
	if (this._target == AjxDebug.TGT_WINDOW) {
		try {
			return (!this._isPaused && this._debugWindow && !this._debugWindow.closed);
		} catch (ex) {
			// OMG accessing the debugWindow in IE12 is sometimes throwing a COM exception 'An outgoing call
			// cannot be made since the application is dispatching an input-synchronous call'.  IOleWindow.GetWindow
			// is marked with input-sync and the exception implies an attempt to access another COM apartment while
			// executing it.  Sounds like an IE12 Bug with this preview version.

			// Just suppress the logging for this call, since it appears _debugWindow is inaccessible
			return false;

		}
	}
	return true;
};

AjxDebug.prototype._getHtmlForObject =
function(obj, params) {

	params = params || {};
	var html = [];
	var idx = 0;

	if (obj === undefined) {
		html[idx++] = "<span>Undefined</span>";
	} else if (obj === null) {
		html[idx++] = "<span>NULL</span>";
	} else if (AjxUtil.isBoolean(obj)) {
		html[idx++] = "<span>" + obj + "</span>";
	} else if (AjxUtil.isNumber(obj)) {
		html[idx++] = "<span>" + obj +"</span>";
	} else {
		if (params.isRaw) {
			html[idx++] = this._timestamp();
			html[idx++] = "<textarea rows='25' style='width:100%' readonly='true'>";
			html[idx++] = obj;
			html[idx++] = "</textarea><p></p>";
		} else if (params.isXml) {
			var xmldoc = new AjxDebugXmlDocument;
			var doc = xmldoc.create();
			// IE bizarrely throws error if we use doc.loadXML here (bug 40451)
			if (doc && ("loadXML" in doc)) {
				doc.loadXML(obj);
				html[idx++] = "<div style='border-width:2px; border-style:inset; width:100%; height:300px; overflow:auto'>";
				html[idx++] = this._createXmlTree(doc, 0, {"authToken":true});
				html[idx++] = "</div>";
			} else {
				html[idx++] = "<span>Unable to create XmlDocument to show XML</span>";
			}
		} else {
			html[idx++] = "<div style='border-width:2px; border-style:inset; width:100%; height:300px; overflow:auto'><pre>";
			html[idx++] = this._dump(obj, true, params.showFuncs, {"ZmAppCtxt":true, "authToken":true});
			html[idx++] = "</div></pre>";
		}
	}
	return html.join("");
};

// Pretty-prints a Javascript object
AjxDebug.prototype._dump =
function(obj, recurse, showFuncs, omit) {

	return AjxStringUtil.prettyPrint(obj, recurse, showFuncs, omit);
};

/**
 * Marshals args to public debug functions. In general, the debug level is an optional
 * first arg. If the first arg is a debug level, check it and then strip it from the args.
 * The last argument is an optional name for the link from the left panel.
 *
 * Returns an object with the link name and a list of the arguments (other than level and
 * link name).
 *
 * @param {array}	args				an arguments list
 *
 * @private
 */
AjxDebug.prototype._handleArgs =
function(args) {

	// don't output anything if debugging is off, or timing is on
	if (this._level == AjxDebug.NONE || this._showTiming || args.length == 0) { return; }

	// convert args to a true Array so they're easier to deal with
	var argsArray = new Array(args.length);
	for (var i = 0; i < args.length; i++) {
		argsArray[i] = args[i];
	}

	var result = {args:null, linkName:null};

	// remove link name from arg list if present - check if last arg is *Request or *Response
	var origLen = argsArray.length;
	if (argsArray.length > 1) {
		var lastArg = argsArray[argsArray.length - 1];
		if (lastArg && lastArg.indexOf && (lastArg.indexOf("DebugWarn") != -1 || ((lastArg.indexOf(" ") == -1) && (/Request|Response$/.test(lastArg))))) {
			result.linkName = lastArg;
			argsArray.pop();
		}
	}

	// check level if provided, strip it from args; level is either a number, or 1-8 lowercase letters/numbers
	var userLevel = null;
	var firstArg = argsArray[0];
	var gotUserLevel = (typeof firstArg == "number" || ((origLen > 1) && firstArg.length <= 8 && /^[a-z0-9]+$/.test(firstArg)));
	if (gotUserLevel) {
		userLevel = firstArg;
		argsArray.shift();
	}
	if (userLevel && (AjxDebug.BUFFER_MAX[userLevel] == null)) {
		if (typeof this._level == "number") {
			if (typeof userLevel != "number" || (userLevel > this._level)) { return; }
		} else {
			if (userLevel != this._level) { return; }
		}
	}
	result.args = argsArray;

	return result;
};

AjxDebug.prototype._openDebugWindow =
function(force) {
	var name = AjxEnv.isIE ? "_blank" : this._dbgName;
	this._debugWindow = window.open("", name, "width=600,height=400,resizable=yes,scrollbars=yes");

	if (this._debugWindow == null) {
		this._enabled = false;
		return;
	}

	this._enabled = true;
	this._isPrevWinOpen = this._debugWindow.debug;
	this._debugWindow.debug = true;

	try {
		this._document = this._debugWindow.document;
		this.setTitle("Debug");

		if (!this._isPrevWinOpen) {
			this._document.write(
				"<html>",
					"<head>",
						"<script>",
							"function blank() {return [",
								"'<html><head><style type=\"text/css\">',",
									"'P, TD, DIV, SPAN, SELECT, INPUT, TEXTAREA, BUTTON {',",
											"'font-family: Tahoma, Arial, Helvetica, sans-serif;',",
											"'font-size:11px;}',",
									"'.Content {display:block;margin:0.25em 0em;}',",
									"'.Link {cursor: pointer;color:blue;text-decoration:underline;white-space:nowrap;width:100%;}',",
									"'.DebugWarn {color:red;font-weight:bold;}',",
									"'.Run {color:black; background-color:red;width:100%;font-size:18px;font-weight:bold;}',",
									"'.RunLink {display:block;color:black;background-color:red;font-weight:bold;white-space:nowrap;width:100%;}',",
								"'</style></head><body></body></html>'].join(\"\");}",
						"</script>",
					"</head>",
					"<frameset cols='125, *'>",
						"<frameset rows='*,40'>",
							"<frame name='", AjxDebug._LINK_FRAME_ID, "' id='", AjxDebug._LINK_FRAME_ID, "' src='javascript:parent.parent.blank();'>",
							"<frame name='", AjxDebug._BOTTOM_FRAME_NAME, "' id='", AjxDebug._BOTTOM_FRAME_ID, "' src='javascript:parent.parent.blank();' scrolling=no frameborder=0>",
						"</frameset>",
						"<frame name='", AjxDebug._CONTENT_FRAME_ID, "' id='", AjxDebug._CONTENT_FRAME_ID, "' src='javascript:parent.blank();'>",
					"</frameset>",
				"</html>"
			);
			this._document.close();
			
			var ta = new AjxTimedAction(this, AjxDebug.prototype._finishInitWindow);
			AjxTimedAction.scheduleAction(ta, 2500);
		} else {
			this._finishInitWindow();

			this._contentFrame = this._document.getElementById(AjxDebug._CONTENT_FRAME_ID);
			this._linkFrame = this._document.getElementById(AjxDebug._LINK_FRAME_ID);
			this._createLinkNContent("RunLink", "NEW RUN", "Run", "NEW RUN");

			this._attachHandlers();

			this._dbgWindowInited = true;
			// show any messages that have been queued up, while the window loaded.
			this._showMessages();
		}
	} catch (ex) {
		if (this._debugWindow) {
			this._debugWindow.close();
		}
		this._openDebugWindow(true);
	}
};

AjxDebug.prototype._finishInitWindow =
function() {
	try {
		this._contentFrame = this._debugWindow.document.getElementById(AjxDebug._CONTENT_FRAME_ID);
		this._linkFrame = this._debugWindow.document.getElementById(AjxDebug._LINK_FRAME_ID);

		var frame = this._debugWindow.document.getElementById(AjxDebug._BOTTOM_FRAME_ID);
		var doc = frame.contentWindow.document;
		var html = [];
		var i = 0;
		html[i++] = "<table><tr><td><button id='";
		html[i++] = AjxDebug._BOTTOM_FRAME_ID;
		html[i++] = "_clear'>Clear</button></td><td><button id='";
		html[i++] = AjxDebug._BOTTOM_FRAME_ID;
		html[i++] = "_pause'>Pause</button></td></tr></table>";
		if (doc.body) {
			doc.body.innerHTML = html.join("");
		}
	}
	catch (ex) {
		// IE chokes on the popup window on cold start-up (when IE is started
		// for the first time after system reboot). This should not prevent the
		// app from running and should not bother the user
	}

	if (doc) {
		this._clearBtn = doc.getElementById(AjxDebug._BOTTOM_FRAME_ID + "_clear");
		this._pauseBtn = doc.getElementById(AjxDebug._BOTTOM_FRAME_ID + "_pause");
	}

	this._attachHandlers();
	this._dbgWindowInited = true;
	this._showMessages();
};

AjxDebug.prototype._attachHandlers =
function() {
	// Firefox allows us to attach an event listener, and runs it even though
	// the window with the code is gone ... odd, but nice. IE, though will not
	// run the handler, so we make sure, even if we're  coming back to the
	// window, to attach the onunload handler. In general reattach all handlers
	// for IE
	var unloadHandler = AjxCallback.simpleClosure(this._unloadHandler, this);
	if (this._debugWindow.attachEvent) {
		this._unloadHandler = unloadHandler;
		this._debugWindow.attachEvent('onunload', unloadHandler);
	}
	else {
		this._debugWindow.onunload = unloadHandler;
	}

	if (this._clearBtn) {
		this._clearBtn.onclick = AjxCallback.simpleClosure(this._clear, this);
	}
	if (this._pauseBtn) {
		this._pauseBtn.onclick = AjxCallback.simpleClosure(this._pause, this);
	}
};

/**
 * Scrolls to the bottom of the window. How it does that depends on the browser.
 *
 * @private
 */
AjxDebug.prototype._scrollToBottom =
function() {
	var contentFrame = this.getContentFrame();
	var contentBody = contentFrame ? contentFrame.contentWindow.document.body : null;
	var linkFrame = this.getLinkFrame();
	var linkBody = linkFrame ? linkFrame.contentWindow.document.body : null;

	if (contentBody && linkBody) {
		contentBody.scrollTop = contentBody.scrollHeight;
		linkBody.scrollTop = linkBody.scrollHeight;
	}
};

/**
 * Returns a timestamp string, if we are showing them.
 * @private
 */
AjxDebug.prototype._timestamp =
function() {
	return this._showTime ? this._getTimeStamp() + ": " : "";
};

AjxDebug.prototype.setShowTimestamps =
function(show) {
	this._showTime = show;
};

/**
 * This function takes an XML node and returns an HTML string that displays that node
 * the indent argument is used to describe what depth the node is at so that
 * the HTML code can create a nice indentation.
 * 
 * @private
 */
AjxDebug.prototype._createXmlTree =
function (node, indent, omit) {
	if (node == null) { return ""; }

	var str = "";
	var len;
	switch (node.nodeType) {
		case 1:	// Element
			str += "<div style='color: blue; padding-left: 16px;'>&lt;<span style='color: DarkRed;'>" + node.nodeName + "</span>";

			if (omit && omit[node.nodeName]) {
				return str + "/&gt;</div>";
			}

			var attrs = node.attributes;
			len = attrs.length;
			for (var i = 0; i < len; i++) {
				str += this._createXmlAttribute(attrs[i]);
			}

			if (!node.hasChildNodes()) {
				return str + "/&gt;</div>";
			}
			str += "&gt;<br />";

			var cs = node.childNodes;
			len = cs.length;
			for (var i = 0; i < len; i++) {
				str += this._createXmlTree(cs[i], indent + 3, omit);
			}
			str += "&lt;/<span style='color: DarkRed;'>" + node.nodeName + "</span>&gt;</div>";
			break;

		case 9:	// Document
			var cs = node.childNodes;
			len = cs.length;
			for (var i = 0; i < len; i++) {
				str += this._createXmlTree(cs[i], indent, omit);
			}
			break;

		case 3:	// Text
			if (!/^\s*$/.test(node.nodeValue)) {
				var val = node.nodeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
				str += "<span style='color: WindowText; padding-left: 16px;'>" + val + "</span><br />";
			}
			break;

		case 7:	// ProcessInstruction
			str += "&lt;?" + node.nodeName;

			var attrs = node.attributes;
			len = attrs.length;
			for (var i = 0; i < len; i++) {
				str += this._createXmlAttribute(attrs[i]);
			}
			str+= "?&gt;<br />"
			break;

		case 4:	// CDATA
			str = "<div style=''>&lt;![CDATA[<span style='color: WindowText; font-family: \"Courier New\"; white-space: pre; display: block; border-left: 1px solid Gray; padding-left: 16px;'>" +
				  node.nodeValue +
				  "</span>]" + "]></div>";
			break;

		case 8:	// Comment
			str = "<div style='color: blue; padding-left: 16px;'>&lt;!--<span style='white-space: pre; font-family: \"Courier New\"; color: Gray; display: block;'>" +
				  node.nodeValue +
				  "</span>--></div>";
			break;

		case 10:
				str = "<div style='color: blue; padding-left: 16px'>&lt;!DOCTYPE " + node.name;
				if (node.publicId) {
					str += " PUBLIC \"" + node.publicId + "\"";
					if (node.systemId)
						str += " \"" + node.systemId + "\"";
				}
				else if (node.systemId) {
					str += " SYSTEM \"" + node.systemId + "\"";
				}
				str += "&gt;</div>";

				// TODO: Handle custom DOCTYPE declarations (ELEMENT, ATTRIBUTE, ENTITY)
				break;

		default:
			this._inspect(node);
	}

	return str;
};

AjxDebug.prototype._createXmlAttribute =
function(a) {
	return [" <span style='color: red'>", a.nodeName, "</span><span style='color: blue'>=\"", a.nodeValue, "\"</span>"].join("");
};

AjxDebug.prototype._inspect =
function(obj) {
	var str = "";
	for (var k in obj) {
		str += "obj." + k + " = " + obj[k] + "\n";
	}
	window.alert(str);
};

AjxDebug.prototype._add =
function(params) {

	params.extraHtml = params.obj && this._getHtmlForObject(params.obj, params);

	// Add the message to our stack
    this._addMessage(new DebugMessage(params));
};

AjxDebug.prototype._addMessage =
function(msg) {
	this._msgQueue.push(msg);
	this._showMessages();
};

AjxDebug.prototype._showMessages =
function() {

	switch (this._target) {
		case AjxDebug.TGT_WINDOW:
			this._showMessagesInWindow();
			break;
		case AjxDebug.TGT_CONSOLE:
			this._showMessagesInConsole();
	}
	this._addMessagesToBuffer();
	this._msgQueue = [];
};

AjxDebug.prototype._showMessagesInWindow =
function() {

	if (!this._dbgWindowInited) {
		// For now, don't show the messages-- assuming that this case only
		// happens at startup, and many messages will be written
		return;
	}
	try {
		if (this._msgQueue.length > 0) {
			var contentFrame = this.getContentFrame();
			var linkFrame = this.getLinkFrame();
			if (!contentFrame || !linkFrame) { return; }

			var contentFrameDoc = contentFrame.contentWindow.document;
			var linkFrameDoc = linkFrame.contentWindow.document;
			var now = new Date();
			for (var i = 0, len = this._msgQueue.length; i < len; ++i ) {
				var msg = this._msgQueue[i];
				var linkLabel = msg.linkName;
				var contentLabel = [msg.message, msg.extraHtml].join("");
				this._createLinkNContent("Link", linkLabel, "Content", contentLabel, now);
			}
		}

		this._scrollToBottom();
	} catch (ex) {}
};

AjxDebug.prototype._addMessagesToBuffer =
function() {

	var eol = (this._target == AjxDebug.TGT_CONSOLE) ? "<br>" : "";
	for (var i = 0, len = this._msgQueue.length; i < len; ++i ) {
		var msg = this._msgQueue[i];
		AjxDebug._addMessageToBuffer(msg.type, msg.message + msg.extraHtml + eol);
	}
};

AjxDebug._addMessageToBuffer =
function(type, msg) {

	type = type || AjxDebug.DEFAULT_TYPE;
	var max = AjxDebug.BUFFER_MAX[type];
	if (max > 0) {
		var buffer = AjxDebug.BUFFER[type] = AjxDebug.BUFFER[type] || [];
		while (buffer.length >= max) {
			buffer.shift();
		}
		buffer.push(msg);
	}
};

AjxDebug.prototype._showMessagesInConsole =
function() {

	if (!window.console) { return; }

	var now = new Date();
	for (var i = 0, len = this._msgQueue.length; i < len; ++i ) {
		var msg = this._msgQueue[i];
		if (window.console && window.console.log) {
			window.console.log(AjxStringUtil.stripTags(msg.message + msg.extraHtml));
		}
	}
};

AjxDebug.prototype._getTimeStamp =
function(date) {
	if (!AjxDebug._timestampFormatter) {
		AjxDebug._timestampFormatter = new AjxDateFormat("HH:mm:ss.SSS");
	}
	date = date || new Date();
	return AjxStringUtil.htmlEncode(AjxDebug._timestampFormatter.format(date), true);
};

AjxDebug.prototype._createLinkNContent =
function(linkClass, linkLabel, contentClass, contentLabel, now) {

	var linkFrame = this.getLinkFrame();
	if (!linkFrame) { return; }

	now = now || new Date();
	var timeStamp = ["[", this._getTimeStamp(now), "]"].join("");
	var id = "Lnk_" + now.getTime();

	// create link
	if (linkLabel) {
		var linkFrameDoc = linkFrame.contentWindow.document;
		var linkEl = linkFrameDoc.createElement("DIV");
		linkEl.className = linkClass;
		linkEl.innerHTML = [linkLabel, timeStamp].join(" - ");
		linkEl._targetId = id;
		linkEl._dbg = this;
		linkEl.onclick = AjxDebug._linkClicked;

		var linkBody = linkFrameDoc.body;
		linkBody.appendChild(linkEl);
	}

	// create content
	var contentFrameDoc = this.getContentFrame().contentWindow.document;
	var contentEl = contentFrameDoc.createElement("DIV");
	contentEl.className = contentClass;
	contentEl.id = id;
	contentEl.innerHTML = contentLabel;

	contentFrameDoc.body.appendChild(contentEl);

	// always show latest
	this._scrollToBottom();
};

AjxDebug._linkClicked =
function() {
	var contentFrame = this._dbg.getContentFrame();
	var el = contentFrame.contentWindow.document.getElementById(this._targetId);
	var y = 0;
	while (el) {
		y += el.offsetTop;
		el = el.offsetParent;
	}

	contentFrame.contentWindow.scrollTo(0, y);
};

AjxDebug.prototype._clear =
function() {
	this.getContentFrame().contentWindow.document.body.innerHTML = "";
	this.getLinkFrame().contentWindow.document.body.innerHTML = "";
};

AjxDebug.prototype._pause =
function() {
	this._isPaused = !this._isPaused;
	this._pauseBtn.innerHTML = this._isPaused ? "Resume" : "Pause";
};

AjxDebug.prototype._unloadHandler =
function() {
	if (!this._debugWindow) { return; } // is there anything to do?

	// detach event handlers
	if (this._debugWindow.detachEvent) {
		this._debugWindow.detachEvent('onunload', this._unloadHandler);
	} else {
		this._debugWindow.onunload = null;
	}
};

AjxDebug.println =
function(type, msg) {
	AjxDebug._addMessageToBuffer(type, msg + "<br>");
};

AjxDebug.dumpObj =
function(type, obj) {
	AjxDebug._addMessageToBuffer(type, "<pre>" + AjxStringUtil.prettyPrint(obj, true) + "</pre>");
};

/**
 *
 * @param {hash}	params			hash of params:
 * @param {string}	methodNameStr	SOAP method, eg SearchRequest or SearchResponse
 * @param {boolean}	asyncMode		true if request made asynchronously
 */
AjxDebug.logSoapMessage =
function(params) {

	if (params.methodNameStr == "NoOpRequest" || params.methodNameStr == "NoOpResponse") { return; }

	var ts = AjxDebug._getTimeStamp();
	var msg = ["<b>", params.methodNameStr, params.asyncMode ? "" : " (SYNCHRONOUS)" , " - ", ts, "</b>"].join("");
	for (var type in AjxDebug.BUFFER) {
		if (type == AjxDebug.DEFAULT_TYPE) { continue; }
		AjxDebug.println(type, msg);
	}
	if (window.DBG) {
        // Link is written here:
        var linkName = params.methodNameStr;
        if (!params.asyncMode) {
            linkName = "<span class='DebugWarn'>SYNCHRONOUS </span>" + linkName;
        }
        window.DBG.println(window.DBG._level, msg, linkName);
	}
};

AjxDebug._getTimeStamp =
function(date) {
	return AjxDebug.prototype._getTimeStamp.apply(null, arguments);
};

AjxDebug.getDebugLog =
function(type) {

	type = type || AjxDebug.DEFAULT_TYPE;
	var buffer = AjxDebug.BUFFER[type];
	return buffer ? buffer.join("") : "";
};

/**
 * Simple wrapper for log messages.
 * @private
 */
DebugMessage = function(params) {

	params = params || {};
	this.message = params.msg || "";
	this.type = params.type || null;
	this.category = params.category || "";
	this.time = params.time || (new Date().getTime());
	this.extraHtml = params.extraHtml || "";
	this.linkName = params.linkName;
	this.type = (params.level && typeof(params.level) == "string") ? params.level : AjxDebug.DEFAULT_TYPE;
};
}

if (AjxPackage.define("ajax.xml.AjxXmlDoc")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Default constructor.
 * @class
 * Do not directly instantiate {@link AjxXmlDoc}, use one of the create factory methods instead.
 * 
 */
AjxXmlDoc = function() {
	if (!AjxXmlDoc._inited)
		AjxXmlDoc._init();
}

AjxXmlDoc.prototype.isAjxXmlDoc = true;
AjxXmlDoc.prototype.toString = function() {	return "AjxXmlDoc"; }

//
// Constants
//

/**
 * <strong>Note:</strong>
 * Anybody that uses these regular expressions MUST reset the <code>lastIndex</code>
 * property to zero or else the results are not guaranteed to be correct. You should
 * use {@link AjxXmlDoc.replaceInvalidChars} instead.
 * 
 * @private
 */
AjxXmlDoc.INVALID_CHARS_RE = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/g;
AjxXmlDoc.REC_AVOID_CHARS_RE = /[\u007F-\u0084\u0086-\u009F\uFDD0-\uFDDF]/g;

//
// Data
//

AjxXmlDoc._inited = false;
AjxXmlDoc._msxmlVers = null;
AjxXmlDoc._useDOM =
    Boolean(document.implementation && document.implementation.createDocument);
AjxXmlDoc._useActiveX =
    !AjxXmlDoc._useDOM && Boolean(window.ActiveXObject);

/**
 * Creates an XML doc.
 * 
 * @return	{AjxXmlDoc}	the XML doc
 */
AjxXmlDoc.create =
function() {
	var xmlDoc = new AjxXmlDoc();
	var newDoc = null;
	if (AjxXmlDoc._useActiveX) {
		newDoc = new ActiveXObject(AjxXmlDoc._msxmlVers);
		newDoc.async = true; // Force Async loading
		if (AjxXmlDoc._msxmlVers == "MSXML2.DOMDocument.4.0") {
			newDoc.setProperty("SelectionLanguage", "XPath");
			newDoc.setProperty("SelectionNamespaces", "xmlns:zimbra='urn:zimbra' xmlns:mail='urn:zimbraMail' xmlns:account='urn:zimbraAccount'");
		}
	} else if (AjxXmlDoc._useDOM) {
		newDoc = document.implementation.createDocument("", "", null);
	} else {
		throw new AjxException("Unable to create new Doc", AjxException.INTERNAL_ERROR, "AjxXmlDoc.create");
	}
	xmlDoc._doc = newDoc;
	return xmlDoc;
}

/**
 * Creates an XML doc from a document object.
 * 
 * @param	{Document}		doc		the document object
 * @return	{AjxXmlDoc}		the XML doc
 */
AjxXmlDoc.createFromDom =
function(doc) {
	var xmlDoc = new AjxXmlDoc();
	xmlDoc._doc = doc;
	return xmlDoc;
}

/**
 * Creates an XML doc from an XML string.
 * 
 * @param	{string}		xml		the XML string
 * @return	{AjxXmlDoc}		the XML doc
 */
AjxXmlDoc.createFromXml =
function(xml) {
	var xmlDoc = AjxXmlDoc.create();
	xmlDoc.loadFromString(xml);
	return xmlDoc;
}

/**
 * Replaces invalid characters in the given string.
 * 
 * @param	{string}	s	the string
 * @return	{string}	the resulting string
 */
AjxXmlDoc.replaceInvalidChars = function(s) {
	AjxXmlDoc.INVALID_CHARS_RE.lastIndex = 0;
	return s.replace(AjxXmlDoc.INVALID_CHARS_RE, "?");
};

AjxXmlDoc.getXml = function(node) {

    if (!node) {
        return '';
    }

    var xml = node.xml;
    if (!xml) {
        var ser = new XMLSerializer();
        xml = ser.serializeToString(node);
    }

    return AjxXmlDoc.replaceInvalidChars(xml);
};

/**
 * Gets the document.
 * 
 * @return	{Document}	the document
 */
AjxXmlDoc.prototype.getDoc =
function() {
	return this._doc;
}

AjxXmlDoc.prototype.loadFromString =
function(str) {
	var doc = this._doc;
	doc.loadXML(str);
	if (AjxXmlDoc._useActiveX) {
		if (doc.parseError.errorCode != 0)
			throw new AjxException(doc.parseError.reason, AjxException.INVALID_PARAM, "AjxXmlDoc.loadFromString");
	}
}

AjxXmlDoc.prototype.loadFromUrl =
function(url) {
	if(AjxEnv.isChrome || AjxEnv.isSafari) {
		var xmlhttp = new window.XMLHttpRequest();
		xmlhttp.open("GET", url, false);
		xmlhttp.send(null);
		var xmlDoc = xmlhttp.responseXML;
		this._doc = xmlDoc;
	} else {
		this._doc.load(url);
	}
}

/**
 * This function tries to create a JavaScript representation of the DOM. In some cases,
 * it is easier to work with JS objects rather than do DOM lookups.
 *
 * <p>
 * Rules:
 * <ol>
 * <li>The top-level tag gets lost; only it's content is seen important.</li>
 * <li>Each node will be represented as a JS object.  It's textual content
 *      will be saved in node.__msh_content (returned by <code>toString()</code>).</li>
 * <li>Attributes get discarded.</li>
 * <li>Each subnode will map to a property with its tagName in the parent
 *      node <code>parent[subnode.tagName] == subnode</code></li>
 * <li>If multiple nodes with the same tagName have the same parent node, then
 *      <code>parent[tagName]</code> will be an array containing the objects, rather than a
 *      single object.</li>
 * </ol>
 * 
 * So what this function allows us to do is for instance this, starting with this XML doc:
 *
 * <pre>
 * &lt;error>
 *   &lt;code>404&lt;/code>
 *   &lt;name>Not Found&lt;/name>
 *   &lt;description>Page wasn't found on this server.&lt;/description>
 * &lt;/error>
 * </pre>
 * 
 * <pre>
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * alert(obj.code + " " + obj.name + " " + obj.description);
 * </pre>
 * 
 * Here's an array example:
 * <pre>
 * &lt;return>
 *   &lt;item>
 *     &lt;name>John Doe&lt;/name>
 *     &lt;email>foo@bar.com&lt;/email>
 *   &lt;/item>
 *   &lt;item>
 *     &lt;name>Johnny Bravo&lt;/name>
 *     &lt;email>bravo@cartoonnetwork.com&lt;/email>
 *   &lt;/item>
 * &lt;/return>
 * </pre>
 * 
 * <pre>
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * for (var i = 0; i < obj.item.length; ++i) {
 *   alert(obj.item[i].name + " / " + obj.item[i].email);
 * }
 * </pre>
 *
 * Note that if there's only one &lt;item> tag, then obj.item will be an object
 * rather than an array.  And if there is no &lt;item> tag, then obj.item will be
 * undefined.  These are cases that the calling application must take care of.
 */
AjxXmlDoc.prototype.toJSObject = 
function(dropns, lowercase, withAttrs) {
	_node = function() { this.__msh_content = ''; };
	_node.prototype.toString = function() { return this.__msh_content; };
	rec = function(i, o) {
		var tags = {}, t, n;
		for (i = i.firstChild; i; i = i.nextSibling) {
			if (i.nodeType == 1) {
				t = i.tagName;
				if (dropns)      t = t.replace(/^.*?:/, "");
				if (lowercase)   t = t.toLowerCase();
				n = new _node();
				if (tags[t]) {
					if (tags[t] == 1) {
						o[t] = [ o[t] ];
						tags[t] = 2;
					}
					o[t].push(n);
				} else {
					o[t] = n;
					tags[t] = 1;
				}
				//do attributes
				if(withAttrs) {
					if(i.attributes && i.attributes.length) {
						for(var ix = 0;ix<i.attributes.length;ix++) {
							attr = i.attributes[ix];
							n[attr.name] = AjxUtil.isNumeric(attr.value) ? attr.value : String(attr.value);
						}
					}
				}
				rec(i, n);
			} else if (i.nodeType == 3)
				o.__msh_content += i.nodeValue;
		}
	};
	var o = new _node();
	rec(this._doc.documentElement, o);
	return o;
};

AjxXmlDoc.prototype.getElementsByTagNameNS = 
function(ns, tag) {
	var doc = this.getDoc();
	return !doc.getElementsByTagNameNS
		? doc.getElementsByTagName(ns + ":" + tag)
		: doc.getElementsByTagNameNS(ns, tag);
};

AjxXmlDoc.prototype.getFirstElementByTagNameNS = 
function(ns, tag) {
	return this.getElementsByTagNameNS(ns, tag)[0];
};

AjxXmlDoc.prototype.getElementsByTagName = 
function(tag) {
	var doc = this.getDoc();
	return doc.getElementsByTagName(tag);
};

AjxXmlDoc._init =
function() {
	if (AjxXmlDoc._useActiveX) {
		var msxmlVers = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument.4.0",
				 "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument",
				 "Microsoft.XmlDom"];
		for (var i = 0; i < msxmlVers.length; i++) {
			try {
				new ActiveXObject(msxmlVers[i]);
				AjxXmlDoc._msxmlVers = msxmlVers[i];
				break;
			} catch (ex) {
			}
		}
		if (!AjxXmlDoc._msxmlVers) {
			throw new AjxException("MSXML not installed", AjxException.INTERNAL_ERROR, "AjxXmlDoc._init");
		}
	} else if (!Document.prototype.loadXML) {
		// add loadXML to Document's API
		Document.prototype.loadXML = function(str) {
			var domParser = new DOMParser();
			var domObj = domParser.parseFromString(str, "text/xml");
			// remove old child nodes since we recycle DOMParser and append new
			while (this.hasChildNodes()) {
				this.removeChild(this.lastChild);
			}
			var len = domObj.childNodes.length;
            for (var i = 0; i < len; i++) {
                var importedNode = this.importNode(domObj.childNodes[i], true);
                this.appendChild(importedNode);
            }
		}
		
		if (AjxEnv.isNav) {
			_NodeGetXml = function() {
				var ser = new XMLSerializer();
				return ser.serializeToString(this);
			}
			Node.prototype.__defineGetter__("xml", _NodeGetXml);
		}
	}
	
	AjxXmlDoc._inited = true;
};

AjxXmlDoc.prototype.set =
function(name, value, element) {
   var p = this._doc.createElement(name);
      if (value != null) {
         var cdata = this._doc.createTextNode("");
         p.appendChild(cdata);
         cdata.nodeValue = value;
      }
      if (element == null) {
         this.root.appendChild(p);
      } else {
         element.appendChild(p);
      }
   return p;
};

AjxXmlDoc.prototype.getXml = function() {
    return AjxXmlDoc.getXml(this.getDoc());
};
AjxXmlDoc.prototype.getDocXml = AjxXmlDoc.prototype.getXml;     // back-compatibility with old name

/**
 * Creates an XML document with a root element.
 * 
 * @param	{string}	rootName	the root name
 * @return	{AjxXmlDoc}	the XML document
 */
AjxXmlDoc.createRoot =
function(rootName) {
   var xmldoc = AjxXmlDoc.create();
   var d = xmldoc.getDoc();
   xmldoc.root = d.createElement(rootName);

   d.appendChild(xmldoc.root);
   return xmldoc;
};

/**
 * Creates an XML document with the element.
 * 
 * @param	{string}	name	the element name
 * @param	{string}	value	the element value
 * @return	{AjxXmlDoc}	the XML document
 */
AjxXmlDoc.createElement =
function(name, value) {
	
   var xmldoc = AjxXmlDoc.create();
   var d = xmldoc.getDoc();
   xmldoc.root = d.createElement(name);
   if (value != null) {
   		//xmldoc.root.nodeValue = value;
   	 	var cdata = d.createTextNode("");
        xmldoc.root.appendChild(cdata);
        cdata.nodeValue = value;
   }
   
   d.appendChild(xmldoc.root);
   return xmldoc;
   
};


AjxXmlDoc.prototype.appendChild =
function(xmldoc){
   //Security Exception WRONG_DOCUMENT_ERR thrown when we append nodes created of diff. documents
   //Chrome/Safari does not like it.
   if(this._doc != xmldoc._doc && ( AjxEnv.isChrome || AjxEnv.isSafari )){
        this.root.appendChild(this.getDoc().importNode(xmldoc.root, true));
   }else{
        this.root.appendChild(xmldoc.root);
   }
};

}

if (AjxPackage.define("zimbra.csfe.ZmCsfeCommand")) {
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
 * This file contains the command class.
 */

/**
 * Creates a command.
 * @class
 * This class represents a command.
 * 
 */
ZmCsfeCommand = function() {
};

ZmCsfeCommand.prototype.isZmCsfeCommand = true;
ZmCsfeCommand.prototype.toString = function() { return "ZmCsfeCommand"; };

// Static properties

// Global settings for each CSFE command
ZmCsfeCommand._COOKIE_NAME = "ZM_AUTH_TOKEN";
ZmCsfeCommand.serverUri = null;

ZmCsfeCommand._sessionId = null;	// current session ID
ZmCsfeCommand._staleSession = {};	// old sessions

// Reasons for re-sending a request
ZmCsfeCommand.REAUTH	= "reauth";
ZmCsfeCommand.RETRY		= "retry";

// Static methods

/**
 * Gets the auth token cookie.
 * 
 * @return	{String}	the auth token
 * @deprecated this method does not work as the ZM_AUTH_TOKEN cookie is a http only cookie
 */
ZmCsfeCommand.getAuthToken =
function() {
	return AjxCookie.getCookie(document, ZmCsfeCommand._COOKIE_NAME);
};

/**
 * Sets the auth token cookie name.
 * 
 * @param	{String}	cookieName		the cookie name to user
 */
ZmCsfeCommand.setCookieName =
function(cookieName) {
	ZmCsfeCommand._COOKIE_NAME = cookieName;
};

/**
 * Sets the server URI.
 * 
 * @param	{String}	uri		the URI
 */
ZmCsfeCommand.setServerUri =
function(uri) {
	ZmCsfeCommand.serverUri = uri;
};

/**
 * Sets the auth token.
 * 
 * @param	{String}	authToken		the auth token
 * @param	{int}		lifetimeMs		the token lifetime in milliseconds
 * @param	{String}	sessionId		the session id
 * @param	{Boolean}	secure		<code>true</code> for secure
 * 
 */
ZmCsfeCommand.setAuthToken =
function(authToken, lifetimeMs, sessionId, secure) {
	ZmCsfeCommand._curAuthToken = authToken;
	if (lifetimeMs != null) {
		var exp = null;
		if(lifetimeMs > 0) {
			exp = new Date();
			var lifetime = parseInt(lifetimeMs);
			exp.setTime(exp.getTime() + lifetime);
		}
		AjxCookie.setCookie(document, ZmCsfeCommand._COOKIE_NAME, authToken, exp, "/", null, secure);
	} else {
		AjxCookie.deleteCookie(document, ZmCsfeCommand._COOKIE_NAME, "/");
	}
	if (sessionId) {
		ZmCsfeCommand.setSessionId(sessionId);
	}
};

/**
 * Clears the auth token cookie.
 * 
 */
ZmCsfeCommand.clearAuthToken =
function() {
	AjxCookie.deleteCookie(document, ZmCsfeCommand._COOKIE_NAME, "/");
};

/**
 * Gets the session id.
 * 
 * @return	{String}	the session id
 */
ZmCsfeCommand.getSessionId =
function() {
	return ZmCsfeCommand._sessionId;
};

/**
 * Sets the session id and, if the session id is new, designates the previous
 * session id as stale.
 * 
 * @param	{String}	sessionId		the session id
 * 
 */
ZmCsfeCommand.setSessionId =
function(sessionId) {
    var sid = ZmCsfeCommand.extractSessionId(sessionId);
    if (sid) {
        if (sid && !ZmCsfeCommand._staleSession[sid]) {
            if (sid != ZmCsfeCommand._sessionId) {
                if (ZmCsfeCommand._sessionId) {
                    // Mark the old session as stale...
                    ZmCsfeCommand._staleSession[ZmCsfeCommand._sessionId] = true;
                }
                // ...before accepting the new session.
                ZmCsfeCommand._sessionId = sid;
            }
        }
    }
};

ZmCsfeCommand.clearSessionId =
function() {
	ZmCsfeCommand._sessionId = null;
};

/**
 * Isolates the parsing of the various forms of session types that we
 * might have to handle.
 *
 * @param {mixed} session Any valid session object: string, number, object,
 * or array.
 * @return {Number|Null} If the input contained a valid session object, the
 * session number will be returned. If the input is not valid, null will
 * be returned.
 */
ZmCsfeCommand.extractSessionId =
function(session) {
    var id;

    if (session instanceof Array) {
        // Array form
	    session = session[0].id;
    }
    else if (session && session.id) {
        // Object form
        session = session.id;
    }

    // We either have extracted the id or were given some primitive form.
    // Whatever we have at this point, attempt conversion and clean up response.
    id = parseInt(session, 10);
    // Normalize response
    if (isNaN(id)) {
        id = null;
    }

	return id;
};

/**
 * Converts a fault to an exception.
 * 
 * @param	{Hash}	fault		the fault
 * @param	{Hash}	params		a hash of parameters
 * @return	{ZmCsfeException}	the exception
 */
ZmCsfeCommand.faultToEx =
function(fault, params) {
	var newParams = {
		msg: AjxStringUtil.getAsString(fault.Reason.Text),
		code: AjxStringUtil.getAsString(fault.Detail.Error.Code),
		method: (params ? params.methodNameStr : null),
		detail: AjxStringUtil.getAsString(fault.Code.Value),
		data: fault.Detail.Error.a,
		trace: (fault.Detail.Error.Trace || "")
	};

	var request;
	if (params) {
		if (params.soapDoc) {
			// note that we don't pretty-print XML if we get a soapDoc
			newParams.request = params.soapDoc.getXml();
		} else if (params.jsonRequestObj) {
			if (params.jsonRequestObj && params.jsonRequestObj.Header && params.jsonRequestObj.Header.context) {
				params.jsonRequestObj.Header.context.authToken = "(removed)";
			}
			newParams.request = AjxStringUtil.prettyPrint(params.jsonRequestObj, true);
		}
	}

	return new ZmCsfeException(newParams);
};

/**
 * Gets the method name of the given request or response.
 *
 * @param {AjxSoapDoc|Object}	request	the request
 * @return	{String}			the method name or "[unknown]"
 */
ZmCsfeCommand.getMethodName =
function(request) {

	// SOAP request
	var methodName = (request && request._methodEl && request._methodEl.tagName)
		? request._methodEl.tagName : null;

	if (!methodName) {
		for (var prop in request) {
			if (/Request|Response$/.test(prop)) {
				methodName = prop;
				break;
			}
		}
	}
	return (methodName || "[unknown]");
};

/**
 * Sends a SOAP request to the server and processes the response. The request can be in the form
 * of a SOAP document, or a JSON object.
 *
 * @param	{Hash}			params				a hash of parameters:
 * @param	{AjxSoapDoc}	soapDoc				the SOAP document that represents the request
 * @param	{Object}		jsonObj				the JSON object that represents the request (alternative to soapDoc)
 * @param	{Boolean}		noAuthToken			if <code>true</code>, the check for an auth token is skipped
 * @param	{Boolean}		authToken			authToken to use instead of the local one
 * @param	{String}		serverUri			the URI to send the request to
 * @param	{String}		targetServer		the host that services the request
 * @param	{Boolean}		useXml				if <code>true</code>, an XML response is requested
 * @param	{Boolean}		noSession			if <code>true</code>, no session info is included
 * @param	{String}		changeToken			the current change token
 * @param	{int}			highestNotifySeen 	the sequence # of the highest notification we have processed
 * @param	{Boolean}		asyncMode			if <code>true</code>, request sent asynchronously
 * @param	{AjxCallback}	callback			the callback to run when response is received (async mode)
 * @param	{Boolean}		logRequest			if <code>true</code>, SOAP command name is appended to server URL
 * @param	{String}		accountId			the ID of account to execute on behalf of
 * @param	{String}		accountName			the name of account to execute on behalf of
 * @param	{Boolean}		skipAuthCheck		if <code>true</code> to skip auth check (i.e. do not check if auth token has changed)
 * @param	{constant}		resend				the reason for resending request
 * @param	{boolean}		useStringify1		use JSON.stringify1 (gets around IE child win issue with Array)
 * @param	{boolean}		emptyResponseOkay	if true, empty or no response from server is not an erro
 */
ZmCsfeCommand.prototype.invoke =
function(params) {
	this.cancelled = false;
	if (!(params && (params.soapDoc || params.jsonObj))) { return; }

	var requestStr = ZmCsfeCommand.getRequestStr(params);

	var rpcCallback;
	try {
		var uri = (params.serverUri || ZmCsfeCommand.serverUri) + params.methodNameStr;
		this._st = new Date();
		
		var requestHeaders = {"Content-Type": "application/soap+xml; charset=utf-8"};
			
		if (params.asyncMode) {
			//DBG.println(AjxDebug.DBG1, "set callback for asynchronous response");
			rpcCallback = new AjxCallback(this, this._runCallback, [params]);
			this._rpcId = AjxRpc.invoke(requestStr, uri, requestHeaders, rpcCallback);
		} else {
			//DBG.println(AjxDebug.DBG1, "parse response synchronously");
			var response = AjxRpc.invoke(requestStr, uri, requestHeaders);
			return (!params.returnXml) ? (this._getResponseData(response, params)) : response;
		}
	} catch (ex) {
		this._handleException(ex, params, rpcCallback);
	}
};

/**
 * Sends a REST request to the server via GET and returns the response.
 *
 * @param {Hash}	params			a hash of parameters
 * @param	{String}       params.restUri			the REST URI to send the request to
 * @param	{Boolean}       params.asyncMode			if <code>true</code> request sent asynchronously
 * @param	{AjxCallback}	params.callback			the callback to run when response is received (async mode)
 */
ZmCsfeCommand.prototype.invokeRest =
function(params) {

	if (!(params && params.restUri)) { return; }

	var rpcCallback;
	try {
		this._st = new Date();
		if (params.asyncMode) {
			rpcCallback = new AjxCallback(this, this._runCallback, [params]);
			this._rpcId = AjxRpc.invoke(null, params.restUri, null, rpcCallback, true);
		} else {
			var response = AjxRpc.invoke(null, params.restUri, null, null, true);
			return response.text;
		}
	} catch (ex) {
		this._handleException(ex, params, rpcCallback);
	}
};

/**
 * Cancels this request (which must be async).
 * 
 */
ZmCsfeCommand.prototype.cancel =
function() {
	DBG.println("req", "CSFE cancel: " + this._rpcId);
	if (!this._rpcId) { return; }
	this.cancelled = true;
	var req = AjxRpc.getRpcRequestById(this._rpcId);
	if (req) {
		req.cancel();
		if (AjxEnv.isFirefox3_5up) {
			AjxRpc.removeRpcCtxt(req);
		}
	}
};

/**
 * Gets the request string.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @return	{String}	the request string
 */
ZmCsfeCommand.getRequestStr =
function(params) {
	return 	params.soapDoc ? ZmCsfeCommand._getSoapRequestStr(params) : ZmCsfeCommand._getJsonRequestStr(params);
};

/**
 * @private
 */
ZmCsfeCommand._getJsonRequestStr =
function(params) {

	var obj = {Header:{}, Body:params.jsonObj};

	var context = obj.Header.context = {_jsns:"urn:zimbra"};
	var ua_name = ["ZimbraWebClient - ", AjxEnv.browser, " (", AjxEnv.platform, ")"].join("");
	context.userAgent = {name:ua_name};
	if (ZmCsfeCommand.clientVersion) {
		context.userAgent.version = ZmCsfeCommand.clientVersion;
	}
	if (params.noSession) {
		context.nosession = {};
	} else {
		var sessionId = ZmCsfeCommand.getSessionId();
		if (sessionId) {
			context.session = {_content:sessionId, id:sessionId};
		} else {
			context.session = {};
		}
	}
	if (params.targetServer) {
		context.targetServer = {_content:params.targetServer};
	}
	if (params.highestNotifySeen) {
		context.notify = {seq:params.highestNotifySeen};
	}
	if (params.changeToken) {
		context.change = {token:params.changeToken, type:"new"};
	}

	// if we're not checking auth token, we don't want token/acct mismatch	
	if (!params.skipAuthCheck) {
		if (params.accountId) {
			context.account = {_content:params.accountId, by:"id"}
		} else if (params.accountName) {
			context.account = {_content:params.accountName, by:"name"}
		}
	}
	
	// Tell server what kind of response we want
	if (params.useXml) {
		context.format = {type:"xml"};
	}

	params.methodNameStr = ZmCsfeCommand.getMethodName(params.jsonObj);

	// Get auth token from cookie if required
	if (!params.noAuthToken) {
		var authToken = params.authToken || ZmCsfeCommand.getAuthToken();
		if (!authToken) {
			throw new ZmCsfeException(ZMsg.authTokenRequired, ZmCsfeException.NO_AUTH_TOKEN, params.methodNameStr);
		}
		if (ZmCsfeCommand._curAuthToken && !params.skipAuthCheck && 
			(params.resend != ZmCsfeCommand.REAUTH) && (authToken != ZmCsfeCommand._curAuthToken)) {
			throw new ZmCsfeException(ZMsg.authTokenChanged, ZmCsfeException.AUTH_TOKEN_CHANGED, params.methodNameStr);
		}
		context.authToken = ZmCsfeCommand._curAuthToken = authToken;
	}
	else if (ZmCsfeCommand.noAuth) {
		throw new ZmCsfeException(ZMsg.authRequired, ZmCsfeException.NO_AUTH_TOKEN, params.methodNameStr);
	}

	if (window.csrfToken) {
		context.csrfToken = window.csrfToken;
	}

	AjxDebug.logSoapMessage(params);
	DBG.dumpObj(AjxDebug.DBG1, obj);

	params.jsonRequestObj = obj;
	
	var requestStr = (params.useStringify1 ?
	                  JSON.stringify1(obj) : JSON.stringify(obj));

	// bug 74240: escape non-ASCII characters to prevent the browser from
	// combining decomposed characters in paths
	return AjxStringUtil.jsEncode(requestStr)
};

/**
 * @private
 */
ZmCsfeCommand._getSoapRequestStr =
function(params) {

	var soapDoc = params.soapDoc;

	if (!params.resend) {

		// Add the SOAP header and context
		var hdr = soapDoc.createHeaderElement();
		var context = soapDoc.set("context", null, hdr, "urn:zimbra");
	
		var ua = soapDoc.set("userAgent", null, context);
		var name = ["ZimbraWebClient - ", AjxEnv.browser, " (", AjxEnv.platform, ")"].join("");
		ua.setAttribute("name", name);
		if (ZmCsfeCommand.clientVersion) {
			ua.setAttribute("version", ZmCsfeCommand.clientVersion);
		}
	
		if (params.noSession) {
			soapDoc.set("nosession", null, context);
		} else {
			var sessionId = ZmCsfeCommand.getSessionId();
			var si = soapDoc.set("session", null, context);
			if (sessionId) {
				si.setAttribute("id", sessionId);
			}
		}
		if (params.targetServer) {
			soapDoc.set("targetServer", params.targetServer, context);
		}
		if (params.highestNotifySeen) {
		  	var notify = soapDoc.set("notify", null, context);
		  	notify.setAttribute("seq", params.highestNotifySeen);
		}
		if (params.changeToken) {
			var ct = soapDoc.set("change", null, context);
			ct.setAttribute("token", params.changeToken);
			ct.setAttribute("type", "new");
		}
	
		// if we're not checking auth token, we don't want token/acct mismatch	
		if (!params.skipAuthCheck) {
			if (params.accountId) {
				var acc = soapDoc.set("account", params.accountId, context);
				acc.setAttribute("by", "id");
			} else if (params.accountName) {
				var acc = soapDoc.set("account", params.accountName, context);
				acc.setAttribute("by", "name");
			}
		}
	
		if (params.skipExpiredToken) {
			var tokenControl = soapDoc.set("authTokenControl", null, context);
			tokenControl.setAttribute("voidOnExpired", "1");
		}	
		// Tell server what kind of response we want
		if (!params.useXml) {
			var js = soapDoc.set("format", null, context);
			js.setAttribute("type", "js");
		}
	}

	params.methodNameStr = ZmCsfeCommand.getMethodName(soapDoc);

	// Get auth token from cookie if required
	if (!params.noAuthToken) {
		var authToken = params.authToken || ZmCsfeCommand.getAuthToken();
		if (!authToken) {
			throw new ZmCsfeException(ZMsg.authTokenRequired, ZmCsfeException.NO_AUTH_TOKEN, params.methodNameStr);
		}
		if (ZmCsfeCommand._curAuthToken && !params.skipAuthCheck && 
			(params.resend != ZmCsfeCommand.REAUTH) && (authToken != ZmCsfeCommand._curAuthToken)) {
			throw new ZmCsfeException(ZMsg.authTokenChanged, ZmCsfeException.AUTH_TOKEN_CHANGED, params.methodNameStr);
		}
		ZmCsfeCommand._curAuthToken = authToken;
		if (params.resend == ZmCsfeCommand.REAUTH) {
			// replace old auth token with current one
			var nodes = soapDoc.getDoc().getElementsByTagName("authToken");
			if (nodes && nodes.length == 1) {
				DBG.println(AjxDebug.DBG1, "Re-auth: replacing auth token");
				nodes[0].firstChild.data = authToken;
			} else {
				// can't find auth token, just add it to context element
				nodes = soapDoc.getDoc().getElementsByTagName("context");
				if (nodes && nodes.length == 1) {
					DBG.println(AjxDebug.DBG1, "Re-auth: re-adding auth token");
					soapDoc.set("authToken", authToken, nodes[0]);
				} else {
					DBG.println(AjxDebug.DBG1, "Re-auth: could not find context!");
				}
			}
		} else if (!params.resend){
			soapDoc.set("authToken", authToken, context);
		}
	}
	else if (ZmCsfeCommand.noAuth && !params.ignoreAuthToken) {
		throw new ZmCsfeException(ZMsg.authRequired, ZmCsfeException.NO_AUTH_TOKEN, params.methodNameStr);
	}

	if (window.csrfToken) {
		soapDoc.set("csrfToken", window.csrfToken, context);
	}

	AjxDebug.logSoapMessage(params);
	DBG.printXML(AjxDebug.DBG1, soapDoc.getXml());

	return soapDoc.getXml();
};

/**
 * Runs the callback that was passed to invoke() for an async command.
 *
 * @param {AjxCallback}	callback	the callback to run with response data
 * @param {Hash}	params	a hash of parameters (see method invoke())
 * 
 * @private
 */
ZmCsfeCommand.prototype._runCallback =
function(params, result) {
	if (!result) { return; }
	if (this.cancelled && params.skipCallbackIfCancelled) {	return; }

	var response;
	if (result instanceof ZmCsfeResult) {
		response = result; // we already got an exception and packaged it
	} else {
		response = this._getResponseData(result, params);
	}
	this._en = new Date();

	if (params.callback && response) {
		params.callback.run(response);
	} else if (!params.emptyResponseOkay) {
		DBG.println(AjxDebug.DBG1, "ZmCsfeCommand.prototype._runCallback: Missing callback!");
	}
};

/**
 * Takes the response to an RPC request and returns a JS object with the response data.
 *
 * @param {Object}	response	the RPC response with properties "text" and "xml"
 * @param {Hash}	params	a hash of parameters (see method invoke())
 */
ZmCsfeCommand.prototype._getResponseData =
function(response, params) {
	this._en = new Date();
	DBG.println(AjxDebug.DBG1, "ROUND TRIP TIME: " + (this._en.getTime() - this._st.getTime()));

	var result = new ZmCsfeResult();
	var xmlResponse = false;
	var restResponse = Boolean(params.restUri);
	var respDoc = null;

	// check for un-parseable HTML error response from server
	if (!response.success && !response.xml && (/<html/i.test(response.text))) {
		// bad XML or JS response that had no fault
		var ex = new ZmCsfeException(null, ZmCsfeException.CSFE_SVC_ERROR, params.methodNameStr, "HTTP response status " + response.status);
		if (params.asyncMode) {
			result.set(ex, true);
			return result;
		} else {
			throw ex;
		}
	}

	if (typeof(response.text) == "string" && response.text.indexOf("{") == 0) {
		respDoc = response.text;
	} else if (!restResponse) {
		// an XML response if we requested one, or a fault
		try {
			xmlResponse = true;
			if (!(response.text || (response.xml && (typeof response.xml) == "string"))) {
				if (params.emptyResponseOkay) {
					return null;
				}
				else {
					// If we can't reach the server, req returns immediately with an empty response rather than waiting and timing out
					throw new ZmCsfeException(null, ZmCsfeException.EMPTY_RESPONSE, params.methodNameStr);
				}
			}
			// responseXML is empty under IE
			respDoc = (AjxEnv.isIE || response.xml == null) ? AjxSoapDoc.createFromXml(response.text) :
															  AjxSoapDoc.createFromDom(response.xml);
		} catch (ex) {
			DBG.dumpObj(AjxDebug.DBG1, ex);
			if (params.asyncMode) {
				result.set(ex, true);
				return result;
			} else {
				throw ex;
			}
		}
		if (!respDoc) {
			var ex = new ZmCsfeException(null, ZmCsfeException.SOAP_ERROR, params.methodNameStr, "Bad XML response doc");
			DBG.dumpObj(AjxDebug.DBG1, ex);
			if (params.asyncMode) {
				result.set(ex, true);
				return result;
			} else {
				throw ex;
			}
		}
	}

	var obj = restResponse ? response.text : {};

	if (xmlResponse) {
		DBG.printXML(AjxDebug.DBG1, respDoc.getXml());
		obj = respDoc._xmlDoc.toJSObject(true, false, true);
	} else if (!restResponse) {
		try {
			obj = JSON.parse(respDoc);
		} catch (ex) {
			if (ex.name == "SyntaxError") {
				ex = new ZmCsfeException(null, ZmCsfeException.BAD_JSON_RESPONSE, params.methodNameStr, respDoc);
				AjxDebug.println(AjxDebug.BAD_JSON, "bad json. respDoc=" + respDoc);
			}
			DBG.dumpObj(AjxDebug.DBG1, ex);
			if (params.asyncMode) {
				result.set(ex, true);
				return result;
			} else {
				throw ex;
			}
		}

	}

	params.methodNameStr = ZmCsfeCommand.getMethodName(obj.Body);
	AjxDebug.logSoapMessage(params);
	DBG.dumpObj(AjxDebug.DBG1, obj, -1);

	var fault = obj && obj.Body && obj.Body.Fault;
	if (fault) {
		// JS response with fault
		if (AjxUtil.isString(fault) && fault.indexOf("<")==0) { // We got an xml string
			fault = AjxXmlDoc.createFromXml(fault).toJSObject(true, false, true);
		}
		var ex = ZmCsfeCommand.faultToEx(fault, params);
		if (params.asyncMode) {
			result.set(ex, true, obj.Header);
			return result;
		} else {
			throw ex;
		}
	} else if (!response.success) {
		// bad XML or JS response that had no fault
		var ex = new ZmCsfeException(null, ZmCsfeException.CSFE_SVC_ERROR, params.methodNameStr, "HTTP response status " + response.status);
		if (params.asyncMode) {
			result.set(ex, true);
			return result;
		} else {
			throw ex;
		}
	} else {
		// good response
		if (params.asyncMode) {
			result.set(obj);
		}
	}

	// check for new session ID
	var session = obj.Header && obj.Header.context && obj.Header.context.session;
    ZmCsfeCommand.setSessionId(session);

	return params.asyncMode ? result : obj;
};

/**
 * @private
 */
ZmCsfeCommand.prototype._handleException =
function(ex, params, callback) {
	if (!(ex && (ex instanceof ZmCsfeException || ex instanceof AjxSoapException || ex instanceof AjxException))) {
		var newEx = new ZmCsfeException();
		newEx.method = params.methodNameStr || params.restUri;
		newEx.detail = ex ? ex.toString() : "undefined exception";
		newEx.code = ZmCsfeException.UNKNOWN_ERROR;
		newEx.msg = "Unknown Error";
		ex = newEx;
	}
	if (params.asyncMode) {
		callback.run(new ZmCsfeResult(ex, true));
	} else {
		throw ex;
	}
};
}
if (AjxPackage.define("zimbra.csfe.ZmCsfeException")) {
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
 * This file contains the exception class.
 */
/**
 * Creates an exception.
 * @class
 * This class represents an exception returned by the server as a response, generally as a fault. The fault
 * data is converted to properties of the exception.
 *
 * @param {Hash}	params	a hash of parameters
 * @param {String}      params.msg		the explanation (Fault.Reason.Text)
 * @param {String}      params.code		the error code (Fault.Detail.Error.Code)
 * @param {String}      params.method	the request name
 * @param {String}      params.detail	the Fault.Code.Value
 * @param {Object}      [params.data]		an optional structured fault data (Fault.Detail.Error.a)
 * @param {String}      params.trace		the trace info (Fault.Detail.Error.Trace)
 * @param {String}       params.request	the SOAP or JSON that represents the request
 * 
 * @extends		AjxException
 */
ZmCsfeException = function(params) {

	params = Dwt.getParams(arguments, ZmCsfeException.PARAMS);

	AjxException.call(this, params.msg, params.code, params.method, params.detail);
	
	if (params.data) {
		this.data = {};
		for (var i = 0; i < params.data.length; i++) {
			var item = params.data[i];
			var key = item.n;
			if (!this.data[key]) {
				this.data[key] = [];
			}
			this.data[key].push(item._content);
		}
	}
	
	this.trace = params.trace;
	this.request = params.request;
};

ZmCsfeException.PARAMS = ["msg", "code", "method", "detail", "data", "trace"];

ZmCsfeException.prototype = new AjxException;
ZmCsfeException.prototype.constructor = ZmCsfeException;
ZmCsfeException.prototype.isZmCsfeException = true;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmCsfeException.prototype.toString =
function() {
	return "ZmCsfeException";
};

//
// Constants
//

// structured data keys
ZmCsfeException.MAIL_SEND_ADDRESS_FAILURE_INVALID = "invalid";
ZmCsfeException.MAIL_SEND_ADDRESS_FAILURE_UNSENT = "unsent";

//
// Static functions
//

/**
 * Gets the error messages.
 * 
 * @param	{String}	code	the code
 * @param	{Array}	args		the message format args
 * 
 * @return	{String}	the message
 */
ZmCsfeException.getErrorMsg =
function(code, args) {
	var msg = ZMsg[code];
	if (!msg) {
		ZmCsfeException._unknownFormat = ZmCsfeException._unknownFormat || new AjxMessageFormat(ZMsg.unknownError);
		return ZmCsfeException._unknownFormat.format(code);
	}
	this.msg = this.msg || msg;
	return args ? AjxMessageFormat.format(msg, args) : msg;
};

//
// Public methods
//

/**
 * Gets the error message.
 * 
 * @param	{Array}	args		the message format args
 * @return	{String}	the message
 */
ZmCsfeException.prototype.getErrorMsg =
function(args) {
	return ZmCsfeException.getErrorMsg(this.code, args);
};

/**
 * Gets the data.
 * 
 * @param	{Object}	key		the key
 * 
 * @return	{Object}	the data
 */
ZmCsfeException.prototype.getData =
function(key) {
	return this.data && this.data[key];
};

//
// Constants for server exceptions
//

ZmCsfeException.AUTH_TOKEN_CHANGED					= "AUTH_TOKEN_CHANGED";
ZmCsfeException.BAD_JSON_RESPONSE					= "BAD_JSON_RESPONSE";
ZmCsfeException.CSFE_SVC_ERROR						= "CSFE_SVC_ERROR";
ZmCsfeException.EMPTY_RESPONSE						= "EMPTY_RESPONSE";
ZmCsfeException.NETWORK_ERROR						= "NETWORK_ERROR";
ZmCsfeException.NO_AUTH_TOKEN						= "NO_AUTH_TOKEN";
ZmCsfeException.SOAP_ERROR							= "SOAP_ERROR";

ZmCsfeException.LICENSE_ERROR						= "service.LICENSE_ERROR";
ZmCsfeException.SVC_ALREADY_IN_PROGRESS				= "service.ALREADY_IN_PROGRESS";
ZmCsfeException.SVC_AUTH_EXPIRED					= "service.AUTH_EXPIRED";
ZmCsfeException.SVC_AUTH_REQUIRED					= "service.AUTH_REQUIRED";
ZmCsfeException.SVC_FAILURE							= "service.FAILURE";
ZmCsfeException.SVC_INVALID_REQUEST					= "service.INVALID_REQUEST";
ZmCsfeException.SVC_PARSE_ERROR						= "service.PARSE_ERROR";
ZmCsfeException.SVC_PERM_DENIED						= "service.PERM_DENIED";
ZmCsfeException.SVC_RESOURCE_UNREACHABLE			= "service.RESOURCE_UNREACHABLE";
ZmCsfeException.SVC_UNKNOWN_DOCUMENT				= "service.UNKNOWN_DOCUMENT";
ZmCsfeException.SVC_TEMPORARILY_UNAVAILABLE			= "service.TEMPORARILY_UNAVAILABLE";
ZmCsfeException.SVC_WRONG_HOST						= "service.WRONG_HOST";

ZmCsfeException.ACCT_AUTH_FAILED					= "account.AUTH_FAILED";
ZmCsfeException.ACCT_CHANGE_PASSWORD				= "account.CHANGE_PASSWORD";
ZmCsfeException.ACCT_EXISTS							= "account.ACCOUNT_EXISTS";
ZmCsfeException.ACCT_TOO_MANY_ACCOUNTS      		= "account.TOO_MANY_ACCOUNTS" ;
ZmCsfeException.ACCT_INVALID_ATTR_VALUE				= "account.INVALID_ATTR_VALUE";
ZmCsfeException.ACCT_INVALID_PASSWORD				= "account.INVALID_PASSWORD";
ZmCsfeException.ACCT_INVALID_PREF_NAME				= "account.INVALID_PREF_NAME";
ZmCsfeException.ACCT_INVALID_PREF_VALUE				= "account.INVALID_PREF_VALUE";
ZmCsfeException.ACCT_MAINTENANCE_MODE				= "account.MAINTENANCE_MODE";
ZmCsfeException.ACCT_NO_SUCH_ACCOUNT				= "account.NO_SUCH_ACCOUNT";
ZmCsfeException.ACCT_NO_SUCH_SAVED_SEARCH			= "account.NO_SUCH_SAVED_SEARCH";
ZmCsfeException.ACCT_NO_SUCH_TAG					= "account.ACCT_NO_SUCH_TAG";
ZmCsfeException.ACCT_PASS_CHANGE_TOO_SOON			= "account.PASSWORD_CHANGE_TOO_SOON";
ZmCsfeException.ACCT_PASS_LOCKED					= "account.PASSWORD_LOCKED";
ZmCsfeException.ACCT_PASS_RECENTLY_USED				= "account.PASSWORD_RECENTLY_USED";
ZmCsfeException.COS_EXISTS							= "account.COS_EXISTS";
ZmCsfeException.DISTRIBUTION_LIST_EXISTS			= "account.DISTRIBUTION_LIST_EXISTS";
ZmCsfeException.DOMAIN_EXISTS						= "account.DOMAIN_EXISTS";
ZmCsfeException.DOMAIN_NOT_EMPTY					= "account.DOMAIN_NOT_EMPTY";
ZmCsfeException.IDENTITY_EXISTS						= "account.IDENTITY_EXISTS";
ZmCsfeException.NO_SUCH_DISTRIBUTION_LIST			= "account.NO_SUCH_DISTRIBUTION_LIST";
ZmCsfeException.NO_SUCH_DOMAIN						= "account.NO_SUCH_DOMAIN";
ZmCsfeException.MAINTENANCE_MODE					= "account.MAINTENANCE_MODE";
ZmCsfeException.TOO_MANY_IDENTITIES					= "account.TOO_MANY_IDENTITIES";
ZmCsfeException.TOO_MANY_SEARCH_RESULTS				= "account.TOO_MANY_SEARCH_RESULTS";
ZmCsfeException.NO_SUCH_COS 						= "account.NO_SUCH_COS";
ZmCsfeException.SIGNATURE_EXISTS                    = "account.SIGNATURE_EXISTS";

ZmCsfeException.CANNOT_CHANGE_VOLUME = "volume.CANNOT_CHANGE_TYPE_OF_CURRVOL";
ZmCsfeException.CANNOT_DELETE_VOLUME_IN_USE = "volume.CANNOT_DELETE_VOLUME_IN_USE";
ZmCsfeException.NO_SUCH_VOLUME						= "volume.NO_SUCH_VOLUME";
ZmCsfeException.ALREADY_EXISTS						= "volume.ALREADY_EXISTS";
ZmCsfeException.VOLUME_NO_SUCH_PATH					= "volume.NO_SUCH_PATH";

ZmCsfeException.MAIL_ALREADY_EXISTS					= "mail.ALREADY_EXISTS";
ZmCsfeException.MAIL_IMMUTABLE						= "mail.IMMUTABLE_OBJECT";
ZmCsfeException.MAIL_INVALID_NAME					= "mail.INVALID_NAME";
ZmCsfeException.MAIL_INVITE_OUT_OF_DATE				= "mail.INVITE_OUT_OF_DATE";
ZmCsfeException.MAIL_MAINTENANCE_MODE				= "mail.MAINTENANCE";
ZmCsfeException.MAIL_MESSAGE_TOO_BIG				= "mail.MESSAGE_TOO_BIG";
ZmCsfeException.MAIL_MUST_RESYNC					= "mail.MUST_RESYNC";
ZmCsfeException.MAIL_NO_SUCH_CALITEM				= "mail.NO_SUCH_CALITEM";
ZmCsfeException.MAIL_NO_SUCH_CONV					= "mail.NO_SUCH_CONV";
ZmCsfeException.MAIL_NO_SUCH_CONTACT				= "mail.NO_SUCH_CONTACT";
ZmCsfeException.MAIL_NO_SUCH_FOLDER					= "mail.NO_SUCH_FOLDER";
ZmCsfeException.MAIL_NO_SUCH_ITEM					= "mail.NO_SUCH_ITEM";
ZmCsfeException.MAIL_NO_SUCH_MOUNTPOINT				= "mail.NO_SUCH_MOUNTPOINT";
ZmCsfeException.MAIL_NO_SUCH_MSG					= "mail.NO_SUCH_MSG";
ZmCsfeException.MAIL_NO_SUCH_PART					= "mail.NO_SUCH_PART";
ZmCsfeException.MAIL_NO_SUCH_TAG					= "mail.NO_SUCH_TAG";
ZmCsfeException.MAIL_QUERY_PARSE_ERROR				= "mail.QUERY_PARSE_ERROR";
ZmCsfeException.MAIL_QUOTA_EXCEEDED					= "mail.QUOTA_EXCEEDED";
ZmCsfeException.MAIL_SEND_ABORTED_ADDRESS_FAILURE	= "mail.SEND_ABORTED_ADDRESS_FAILURE";
ZmCsfeException.MAIL_SEND_FAILURE					= "mail.SEND_FAILURE";
ZmCsfeException.MAIL_TOO_MANY_CONTACTS				= "mail.TOO_MANY_CONTACTS";
ZmCsfeException.MAIL_TOO_MANY_TERMS					= "mail.TOO_MANY_QUERY_TERMS_EXPANDED";
ZmCsfeException.MAIL_UNABLE_TO_IMPORT_APPOINTMENTS	= "mail.MAIL_UNABLE_TO_IMPORT_APPOINTMENTS";
ZmCsfeException.MAIL_UNABLE_TO_IMPORT_CONTACTS		= "mail.UNABLE_TO_IMPORT_CONTACTS";
ZmCsfeException.MODIFY_CONFLICT						= "mail.MODIFY_CONFLICT";
ZmCsfeException.TOO_MANY_TAGS						= "mail.TOO_MANY_TAGS";
ZmCsfeException.CANNOT_RENAME                       = "mail.CANNOT_RENAME";
ZmCsfeException.CANNOT_UNLOCK                       = "mail.CANNOT_UNLOCK";
ZmCsfeException.CANNOT_LOCK                         = "mail.CANNOT_LOCK";
ZmCsfeException.LOCKED                              = "mail.LOCKED";
ZmCsfeException.UPLOAD_REJECTED						= "mail.UPLOAD_REJECTED";

ZmCsfeException.MUST_BE_ORGANIZER					= "mail.MUST_BE_ORGANIZER";


ZmCsfeException.OFFLINE_ONLINE_ONLY_OP				= "offline.ONLINE_ONLY_OP";
}
if (AjxPackage.define("zimbra.csfe.ZmCsfeResult")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the result class.
 */

/**
 * Creates a CSFE result object.
 * @class
 * This class represents the result of a CSFE request. The data is either the 
 * response that was received, or an exception. If the request resulted in a 
 * SOAP fault from the server, there will also be a SOAP header present.
 *
 * @author Conrad Damon
 * 
 * @param {Object}	data			the response data
 * @param {Boolean}	isException	if <code>true</code>, the data is an exception object
 * @param {Object}	header			the SOAP header
 * 
 */
ZmCsfeResult = function(data, isException, header) {
	this.set(data, isException, header);
};

ZmCsfeResult.prototype.isZmCsfeResult = true;
ZmCsfeResult.prototype.toString = function() { return "ZmCsfeResult"; };

/**
 * Sets the content of the result.
 *
 * @param {Object}	data			the response data
 * @param {Boolean}	isException	if <code>true</code>, the data is an exception object
 * @param {Object}	header			the SOAP header
 */
ZmCsfeResult.prototype.set =
function(data, isException, header) {
	this._data = data;
	this._isException = (isException === true);
	this._header = header;
};

/**
 * Gets the response data. If there was an exception, throws the exception.
 * 
 * @return	{Object}	the data
 */
ZmCsfeResult.prototype.getResponse =
function() {
	if (this._isException) {
		throw this._data;
	} else {
		return this._data;
	}
};

/**
 * Gets the exception object, if any.
 * 
 * @return	{ZmCsfeException}	the exception or <code>null</code> for none
 */
ZmCsfeResult.prototype.getException =
function() {
	return this._isException ? this._data : null;
};

/**
 * Checks if this result is an exception.
 * 
 * @return	{Boolean}	<code>true</code> if an exception
 */
ZmCsfeResult.prototype.isException = 
function() {
	return this._isException;
};

/**
 * Gets the SOAP header that came with a SOAP fault.
 * 
 * @return	{String}	the header
 */
ZmCsfeResult.prototype.getHeader =
function() {
	return this._header;
};
}

if (AjxPackage.define("zimbraMail.share.view.dialog.ZmTwoFactorSetupDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a dialog for Two factor initial setup
 * @constructor
 * @class
 * @author  Hem Aravind
 *
 * @extends	DwtDialog
 */
ZmTwoFactorSetupDialog = function(params) {
	this.username = typeof appCtxt !== "undefined" ? appCtxt.getLoggedInUsername() : params.userName;
	this.twoStepAuthSpan = params.twoStepAuthSpan;
	this.twoStepAuthLink = params.twoStepAuthLink;
	this.twoStepAuthCodesContainer = params.twoStepAuthCodesContainer;
	this.twoStepAuthEnabledCallback = params.twoStepAuthEnabledCallback;
	// this.isFromLoginPage will be true if ZmTwoFactorSetupDialog is created from TwoFactorSetup.jsp, which is forwarded from login.jsp file.
	this.isFromLoginPage = params.isFromLoginPage;
	var previousButton = new DwtDialog_ButtonDescriptor(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, ZmMsg.previous, DwtDialog.ALIGN_RIGHT, this._previousButtonListener.bind(this));
	var beginSetupButton = new DwtDialog_ButtonDescriptor(ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON, ZmMsg.twoStepAuthBeginSetup, DwtDialog.ALIGN_RIGHT, this._beginSetupButtonListener.bind(this));
	var nextButton = new DwtDialog_ButtonDescriptor(ZmTwoFactorSetupDialog.NEXT_BUTTON, ZmMsg.next, DwtDialog.ALIGN_RIGHT, this._nextButtonListener.bind(this));
	var finishButton = new DwtDialog_ButtonDescriptor(ZmTwoFactorSetupDialog.FINISH_BUTTON, ZmMsg.twoStepAuthSuccessFinish, DwtDialog.ALIGN_RIGHT, this._finishButtonListener.bind(this));
	var cancelButton = new DwtDialog_ButtonDescriptor(ZmTwoFactorSetupDialog.CANCEL_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT, this._cancelButtonListener.bind(this));
	var shell = typeof appCtxt !== "undefined" ? appCtxt.getShell() : new DwtShell({});
	var newParams = {
		parent : shell,
		title : ZmMsg.twoStepAuthSetup,
		standardButtons : [DwtDialog.NO_BUTTONS],
		extraButtons : params.isFromLoginPage ? [nextButton, previousButton, beginSetupButton, finishButton, cancelButton] : [previousButton, beginSetupButton, nextButton, finishButton, cancelButton]
	};
	DwtDialog.call(this, newParams);
	this.setContent(this._contentHtml(params.isFromLoginPage));
	this._createControls(params.isFromLoginPage);
	this._setAllowSelection();
};

ZmTwoFactorSetupDialog.prototype = new DwtDialog;
ZmTwoFactorSetupDialog.prototype.constructor = ZmTwoFactorSetupDialog;

ZmTwoFactorSetupDialog.PREVIOUS_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmTwoFactorSetupDialog.NEXT_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmTwoFactorSetupDialog.FINISH_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmTwoFactorSetupDialog.CANCEL_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmTwoFactorSetupDialog.ONE_TIME_CODES = "ZIMBRA_TWO_FACTOR_ONE_TIME_CODES";

ZmTwoFactorSetupDialog.prototype.toString =
function() {
	return "ZmTwoFactorSetupDialog";
};

/**
 * Gets the HTML that forms the basic framework of the dialog.
 *
 * @private
 */
ZmTwoFactorSetupDialog.prototype._contentHtml =
function(isFromLoginPage) {
	var id = this._htmlElId;
	this._descriptionDivId = id + "_description";
	this._passwordDivId = id + "_password";
	this._passwordErrorDivId = id + "_password_error";
	this._authenticationDivId = id + "_authentication";
	this._emailDivId = id + "_email";
	this._codeDivId = id + "_code";
	this._codeDescriptionDivId = id + "_code_description";
	this._codeErrorDivId = id + "_code_error";
	this._successDivId = id + "_success";
	this._divIdArray = [this._descriptionDivId, this._passwordDivId, this._authenticationDivId, this._emailDivId, this._codeDivId, this._successDivId];
	return isFromLoginPage ? AjxTemplate.expand("share.Dialogs#ZmTwoFactorCustomLoginPage", {id : id, username : this.username}) : AjxTemplate.expand("share.Dialogs#ZmTwoFactorSetup", {id : id, username : this.username});
};

ZmTwoFactorSetupDialog.prototype._createControls =
function(isFromLoginPage) {
	var id = this._htmlElId;
	this._passwordInput = Dwt.getElement(id + "_password_input");
	this._codeInput = Dwt.getElement(id + "_code_input");
	this._keySpan = Dwt.getElement(id + "_email_key");
	var keyupHandler = this._handleKeyUp.bind(this);
	if(isFromLoginPage) {
		this.getButton(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON).setClassName('ZmTwoFactorPreviousButton');
		this.getButton(ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON).setClassName('ZmTwoFactorBeginButton');
		this.getButton(ZmTwoFactorSetupDialog.NEXT_BUTTON).setClassName('ZmTwoFactorNextButton');
		this.getButton(ZmTwoFactorSetupDialog.FINISH_BUTTON).setClassName('ZmTwoFactorFinishButton');
		this.getButton(ZmTwoFactorSetupDialog.CANCEL_BUTTON).setClassName('ZmTwoFactorCancelButton');
	}
	Dwt.setHandler(this._passwordInput, DwtEvent.ONKEYUP, keyupHandler);
	Dwt.setHandler(this._passwordInput, DwtEvent.ONINPUT, keyupHandler);
	Dwt.setHandler(this._codeInput, DwtEvent.ONKEYUP, keyupHandler);
	Dwt.setHandler(this._codeInput, DwtEvent.ONINPUT, keyupHandler);
};

/**
** an array of input fields that will be cleaned up between instances of the dialog being popped up and down
*
* @return An array of the input fields to be reset
*/
ZmTwoFactorSetupDialog.prototype._getInputFields =
function() {
	return [this._passwordInput, this._codeInput];
};

/**
 * Pops-up the dialog.
 */
ZmTwoFactorSetupDialog.prototype.popup =
function() {
	this.reset();
	DwtDialog.prototype.popup.call(this);
};

/**
 * Resets the dialog back to its original state.
 */
ZmTwoFactorSetupDialog.prototype.reset =
function() {
	Dwt.show(this._descriptionDivId);
	Dwt.hide(this._passwordDivId);
	Dwt.hide(this._passwordErrorDivId);
	Dwt.hide(this._authenticationDivId);
	Dwt.hide(this._emailDivId);
	Dwt.hide(this._codeDivId);
	Dwt.hide(this._codeErrorDivId);
	Dwt.hide(this._successDivId);
	this.setButtonVisible(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, false);
	this.setButtonVisible(ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON, true);
	this.setButtonVisible(ZmTwoFactorSetupDialog.NEXT_BUTTON, false);
	this.setButtonVisible(ZmTwoFactorSetupDialog.FINISH_BUTTON, false);
	this.setButtonVisible(ZmTwoFactorSetupDialog.CANCEL_BUTTON, true);
	this._divIdArrayIndex = 0;
	DwtDialog.prototype.reset.call(this);
};

ZmTwoFactorSetupDialog.prototype._beginSetupButtonListener =
function() {
	Dwt.hide(this._descriptionDivId);
	Dwt.show(this._passwordDivId);
	this.setButtonVisible(ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON, false);
	this.setButtonVisible(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, true);
	this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, this._passwordInput.value !== "");
	this.setButtonVisible(ZmTwoFactorSetupDialog.NEXT_BUTTON, true);
	this._passwordInput.focus();
	this._divIdArrayIndex = 1;
};

ZmTwoFactorSetupDialog.prototype._previousButtonListener =
function() {
	var currentDivId = this._divIdArray[this._divIdArrayIndex];
	if (currentDivId === this._passwordDivId) {
		Dwt.hide(this._passwordErrorDivId);
		this.setButtonVisible(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, false);
		this.setButtonVisible(ZmTwoFactorSetupDialog.NEXT_BUTTON, false);
		this.setButtonVisible(ZmTwoFactorSetupDialog.BEGIN_SETUP_BUTTON, true);
	}
	else if (currentDivId === this._codeDivId) {
		this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, true);
	}
	else if (currentDivId === this._successDivId) {
		this.setButtonVisible(ZmTwoFactorSetupDialog.FINISH_BUTTON, false);
		this.setButtonVisible(ZmTwoFactorSetupDialog.NEXT_BUTTON, true);
	}
	Dwt.show(this._divIdArray[this._divIdArrayIndex - 1]);
	Dwt.hide(this._divIdArray[this._divIdArrayIndex]);
	if (this._divIdArrayIndex > -1) {
		this._divIdArrayIndex--;
	}
};

ZmTwoFactorSetupDialog.prototype._nextButtonListener =
function() {
	var currentDivId = this._divIdArray[this._divIdArrayIndex];
	if (currentDivId === this._passwordDivId || currentDivId === this._codeDivId) {
		this._enableTwoFactorAuth(currentDivId);
		return;
	}
	Dwt.show(this._divIdArray[this._divIdArrayIndex + 1]);
	Dwt.hide(this._divIdArray[this._divIdArrayIndex]);
	if (this._divIdArrayIndex < this._divIdArray.length) {
		this._divIdArrayIndex++;
	}
	if (currentDivId === this._emailDivId) {
		Dwt.hide(this._codeErrorDivId);
		Dwt.show(this._codeDescriptionDivId);
		this._codeInput.focus();
		this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, this._codeInput.value !== "");
	}
};

ZmTwoFactorSetupDialog.prototype._finishButtonListener =
function() {
	//If the user clicks finish button, redirect to the login page
	if (this.isFromLoginPage) {
		location.replace(location.href);
	}
	else {
		this.popdown();
		if (this.twoStepAuthSpan) {
			Dwt.setInnerHtml(this.twoStepAuthSpan, ZmMsg.twoStepAuth);
		}
		if (this.twoStepAuthLink) {
			Dwt.setInnerHtml(this.twoStepAuthLink, ZmMsg.twoStepAuthDisableLink);
		}
		if (this.twoStepAuthCodesContainer) {
			Dwt.setDisplay(this.twoStepAuthCodesContainer, "");
		}
		if (this.twoStepAuthEnabledCallback) {
			this.twoStepAuthEnabledCallback();
		}
	}
};

ZmTwoFactorSetupDialog.prototype._cancelButtonListener =
function() {
	//If the user clicks cancel button, redirect to the login page
	if (this.isFromLoginPage) {
		location.replace(location.href);
	}
	else {
		this.popdown();
	}
};

ZmTwoFactorSetupDialog.prototype._handleKeyUp =
function(ev) {
	var value = ev && ev.target && ev.target.value && ev.target.value.length;
	this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, !!value);
};

/**
 * Sends first EnableTwoFactorAuthRequest with username and password
 * Sends second EnableTwoFactorAuthRequest with username, temporary authToken and twoFactorCode
*/
ZmTwoFactorSetupDialog.prototype._enableTwoFactorAuth =
function(currentDivId) {
	var passwordInput = this._passwordInput;
	passwordInput.setAttribute("disabled", true);
	this.setButtonEnabled(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, false);
	this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, false);
	var command = new ZmCsfeCommand();
	if (currentDivId === this._codeDivId) {
		var codeInput = this._codeInput;
		codeInput.setAttribute("disabled", true);
		var jsonObj = {EnableTwoFactorAuthRequest : {_jsns:"urn:zimbraAccount", csrfTokenSecured:1, name:{_content : this.username}, authToken:{_content : this._authToken}, twoFactorCode:{_content : codeInput.value}}};
	}
	else {
		var jsonObj = {EnableTwoFactorAuthRequest : {_jsns:"urn:zimbraAccount", csrfTokenSecured:1, name:{_content : this.username}, password:{_content : passwordInput.value}}};
	}
	var callback = this._enableTwoFactorAuthCallback.bind(this, currentDivId);
	command.invoke({jsonObj:jsonObj, noAuthToken: true, asyncMode: true, callback: callback, serverUri:"/service/soap/"});
};

ZmTwoFactorSetupDialog.prototype._enableTwoFactorAuthCallback =
function(currentDivId, result) {
	if (!result || result.isException()) {
		this._handleTwoFactorAuthError(currentDivId, result.getException());
	}
	else {
		var response = result.getResponse();
		if (!response || !response.Body || !response.Body.EnableTwoFactorAuthResponse) {
			this._handleTwoFactorAuthError(currentDivId);
			return;
		}
		var enableTwoFactorAuthResponse = response.Body.EnableTwoFactorAuthResponse;
		var authToken = enableTwoFactorAuthResponse.authToken;
		this._authToken = authToken && authToken[0] && authToken[0]._content;
		if (enableTwoFactorAuthResponse.csrfToken && enableTwoFactorAuthResponse.csrfToken[0] && enableTwoFactorAuthResponse.csrfToken[0]._content) {
			window.csrfToken = enableTwoFactorAuthResponse.csrfToken[0]._content;
		}
		var secret = enableTwoFactorAuthResponse.secret;
		var scratchCodes = enableTwoFactorAuthResponse.scratchCodes;
		if (secret && secret[0] && secret[0]._content) {
			Dwt.setInnerHtml(this._keySpan, secret[0]._content);
			this._handleTwoFactorAuthSuccess(currentDivId);
			return;
		}
		else if (scratchCodes && scratchCodes[0] && scratchCodes[0].scratchCode) {
			if (typeof appCtxt !== "undefined") {
				//Only the server will set ZmSetting.TWO_FACTOR_AUTH_ENABLED. Don???t try to save the setting from the UI.
				appCtxt.set(ZmSetting.TWO_FACTOR_AUTH_ENABLED, true, false, false, true);
				var scratchCode = AjxUtil.map(scratchCodes[0].scratchCode, function(obj) {return obj._content});
				appCtxt.cacheSet(ZmTwoFactorSetupDialog.ONE_TIME_CODES, scratchCode);
			}
			this._handleTwoFactorAuthSuccess(currentDivId);
			return;
		}
		this._handleTwoFactorAuthError(currentDivId);
	}
};

ZmTwoFactorSetupDialog.prototype._handleTwoFactorAuthSuccess =
function(currentDivId) {
	if (currentDivId === this._passwordDivId) {
		Dwt.hide(this._passwordDivId);
		Dwt.show(this._authenticationDivId);
		Dwt.hide(this._passwordErrorDivId);
		this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, true);
		this.setButtonEnabled(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, true);
		if (this._divIdArrayIndex < this._divIdArray.length) {
			this._divIdArrayIndex++;
		}
	}
	else if (currentDivId === this._codeDivId) {
		Dwt.show(this._successDivId);
		Dwt.hide(this._codeDivId);
		this.setButtonVisible(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, false);
		this.setButtonVisible(ZmTwoFactorSetupDialog.NEXT_BUTTON, false);
		this.setButtonVisible(ZmTwoFactorSetupDialog.FINISH_BUTTON, true);
		this.setButtonVisible(ZmTwoFactorSetupDialog.CANCEL_BUTTON, false);
	}
};

ZmTwoFactorSetupDialog.prototype._handleTwoFactorAuthError =
function(currentDivId, exception) {
	if (currentDivId === this._passwordDivId) {
		if (exception && exception.code === ZmCsfeException.ACCT_AUTH_FAILED) {
			Dwt.show(this._passwordErrorDivId);
		}
		var passwordInput = this._passwordInput;
		passwordInput.removeAttribute("disabled");
		passwordInput.value = "";
		passwordInput.focus();
	}
	else if (currentDivId === this._codeDivId) {
		Dwt.show(this._codeErrorDivId);
		Dwt.hide(this._codeDescriptionDivId);
		var codeInput = this._codeInput;
		codeInput.removeAttribute("disabled");
		codeInput.value = "";
		codeInput.focus();
	}
	this.setButtonEnabled(ZmTwoFactorSetupDialog.NEXT_BUTTON, false);
	this.setButtonEnabled(ZmTwoFactorSetupDialog.PREVIOUS_BUTTON, true);
};

/**
 * Determines whether to prevent the browser from displaying its context menu.
 */
ZmTwoFactorSetupDialog.prototype.preventContextMenu =
function() {
	return false;
};

ZmTwoFactorSetupDialog.disableTwoFactorAuth =
function(params, dialog) {
	var command = new ZmCsfeCommand();
	var jsonObj = {DisableTwoFactorAuthRequest : {_jsns:"urn:zimbraAccount"}};
	var callback = ZmTwoFactorSetupDialog.disableTwoFactorAuthCallback.bind(window, params, dialog);
	command.invoke({jsonObj: jsonObj, noAuthToken: true, asyncMode: true, callback: callback, serverUri:"/service/soap/"});
};

ZmTwoFactorSetupDialog.disableTwoFactorAuthCallback =
function(params, dialog) {
	dialog.popdown();
	Dwt.setInnerHtml(params.twoStepAuthSpan, ZmMsg.twoStepStandardAuth);
	Dwt.setInnerHtml(params.twoStepAuthLink, ZmMsg.twoStepAuthSetupLink);
	Dwt.setDisplay(params.twoStepAuthCodesContainer, Dwt.DISPLAY_NONE);
	appCtxt.set(ZmSetting.TWO_FACTOR_AUTH_ENABLED, false, false, false, true);
};
}
}
