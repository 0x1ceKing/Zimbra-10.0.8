if (AjxPackage.define("XForms")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2010, 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2010, 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
if (AjxPackage.define("ajax.dwt.events.DwtXFormsEvent")) {
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
DwtXFormsEvent = function(form, formItem, details) {
	if (arguments.length == 0) return;
	this.form = form;
	this.formItem = formItem;
	this.details = details;
}

DwtEvent.prototype.toString = function() {
	return "DwtXFormsEvent";
}
}
if (AjxPackage.define("ajax.dwt.events.DwtXModelEvent")) {
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
 * 
 * 
 * @private
 */
DwtXModelEvent = function(instance, modelItem, refPath, details) {
	if (arguments.length == 0) return;
	this.instance = instance;
	this.modelItem = modelItem;
	this.refPath = refPath;
	this.details = details;
}

DwtEvent.prototype.toString = function() {
	return "DwtXModelEvent";
}
}
if (AjxPackage.define("ajax.dwt.events.DwtIdleTimer")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * Simple manager for "idle" events. Add a handler like this:
 *
 * <pre>
 *    var idleTimer = new DwtIdleTimer(10000, new AjxCallback(obj, obj.handler));
 *
 *    obj.handler = function(idle) {
 *       if (idle) {
 *          // do idle stuff here
 *       } else {
 *          // user is back
 *       }
 *    }
 * </pre>
 * 
 * With this code, when the user is idle for 10 seconds obj.handler(true) will
 * be called.  When the user gets back from idle, obj.handler(false) will be
 * called and the timer restarted.
 * </p>
 * <p>
 * To cancel a timer, call <code>idleTimer.kill()</code>. To restart it later, you can
 * <code>idleTimer.resurrect(timeout)</code>. The timeout parameter is optional, pass it only if you
 * want to modify it.
 * </p>
 * <p>
 * You can create multiple handlers, each with its own callback and timeout.  A
 * new {@link DwtIdleTimer} will start running right away and will continue to do so
 * until you <code>kill()</code> it.
 * </p>
 * 
 * @param	{number}	[timeout]		the timeout 
 * @param	{AjxCallback}	handler		the callback
 * 
 * @private
 */
DwtIdleTimer = function(timeout, handler) {
	DwtIdleTimer._initEvents();
	this.timeout = timeout;
	this.handler = handler;
	this.idle = false;
	this._onIdle = AjxCallback.simpleClosure(this.setIdle, this);
	this._startTimer();
	DwtIdleTimer.getHandlers().add(this);
};

DwtIdleTimer.idleHandlers = 0;

DwtIdleTimer.prototype.toString =
function() {
	return "DwtIdleTimer";
};

DwtIdleTimer.prototype.kill =
function() {
	this._stopTimer();
	this.idle = false;
	DwtIdleTimer.getHandlers().remove(this);
};

DwtIdleTimer.prototype.resurrect =
function(timeout) {
	this.idle = false; // make sure we start "unidle"
	DwtIdleTimer.getHandlers().add(this, null, true);
	if (timeout != null) {
		this.timeout = timeout;
	}
	this._startTimer();
};

DwtIdleTimer.prototype.setIdle =
function() {
	if (!this.idle) {
		DwtIdleTimer.idleHandlers++;
		this.idle = true;
		this.handler.run(true);
	}
};

DwtIdleTimer.prototype.resume =
function() {
	if (this.idle) {
		this.idle = false;
		this.handler.run(false);
		DwtIdleTimer.idleHandlers--;
	}
};

DwtIdleTimer.prototype._startTimer =
function() {
	this._stopTimer();
	this._timer = setTimeout(this._onIdle, this.timeout);
};

DwtIdleTimer.prototype._stopTimer =
function() {
	if (this._timer) {
		clearTimeout(this._timer);
		this._timer = null;
	}
};

DwtIdleTimer._initEvents =
function() {
	// execute only once per session
	if (!DwtIdleTimer._initialized) {
		if (window.addEventListener) {
			window.addEventListener("keydown", DwtIdleTimer.resetIdle, true);
			window.addEventListener("mousemove", DwtIdleTimer.resetIdle, true);
			window.addEventListener("mousedown", DwtIdleTimer.resetIdle, true);
			window.addEventListener("focus", DwtIdleTimer.resetIdle, true);
		}
        else if (window.attachEvent) {
			document.body.attachEvent("onkeydown", DwtIdleTimer.resetIdle);
			document.body.attachEvent("onkeyup", DwtIdleTimer.resetIdle);
			document.body.attachEvent("onmousedown", DwtIdleTimer.resetIdle);
			document.body.attachEvent("onmousemove", DwtIdleTimer.resetIdle);
			document.body.attachEvent("onmouseover", DwtIdleTimer.resetIdle);
			document.body.attachEvent("onmouseout", DwtIdleTimer.resetIdle);
			window.attachEvent("onfocus", DwtIdleTimer.resetIdle);
		}
		DwtIdleTimer._initialized = true;
	}
};

DwtIdleTimer.getHandlers =
function() {
	var a = DwtIdleTimer.HANDLERS;
	if (!a) {
		a = DwtIdleTimer.HANDLERS = new AjxVector();
	}
	return a;
};

DwtIdleTimer.resetIdle =
function() {
	var a = DwtIdleTimer.getHandlers();
	a.foreach("_startTimer"); // we need to restart timers anyway...
	if (DwtIdleTimer.idleHandlers > 0) {
		a.foreach("resume");
	}
};
}

if (AjxPackage.define("ajax.dwt.xforms.XFormGlobal")) {
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
XFG = function() {} // XFormGlobal

XFG.prefixList = {};
XFG.objectCache = {};
XFG.getUniqueId = function (namePrefix) {
	if (namePrefix == null) namePrefix = "__id__";
	var list = XFG.prefixList;

	// if we've never seen one of these before, call it the name they passed in
	//	(without a number) and set the counter to 1 (so the next one is #2)
	if (list[namePrefix] == null) {
		list[namePrefix] = 1;
		return namePrefix;
	} else {
		list[namePrefix]++;
		return namePrefix + "_" + list[namePrefix];
	}
};

XFG.assignUniqueId = function (object, namePrefix) {
	var id = XFG.getUniqueId(namePrefix);
	object.__id = id;
	XFG.objectCache[id] = object;
};

XFG.cacheGet = function (id){
	return XFG.objectCache[id];
}

XFG.createEl = function (id, parentEl, tagName, contents) {
	// create the element
	if (tagName == null) tagName = "div";
	var el = window.document.createElement(tagName);

	// set its id and contents (if supplied)
	el.id = id;
	if (contents != null) el.innerHTML = contents;

	// root it under the parent
	if (parentEl == null) {
		parentEl = document.body;
	}
	parentEl.appendChild(el);
	
	return el;
}

XFG.getEl = function (id, frame) {
	// if they passed something other than a string, assume its the element itself
	if (typeof id != "string") return id;
	
	var doc = (doc == null ? document : frame.document);
	var it = doc.getElementById(id);
	if (it == null) it = null;
	return it;
};

XFG.hideEl = function (id,isBlock) {
	var el = (typeof id == "string" ? XFG.getEl(id) : id);
	if (el) {
		if(!isBlock)
			el.style.display = "none";
			
		el.style.visibility = "hidden";
	} else {
		DBG.println("hideEl(", id, "): element not found");
	}
};

XFG.showEl = function (id) {
	var el = (typeof id == "string" ? XFG.getEl(id) : id);
	if (el) {
		if (el.tagName == "TD") {
			el.style.display = "table-cell";
		} else {
			el.style.display = "block";
		}
		el.style.visibility = "visible";
	} else {
		DBG.println("showEl(", id, "): element not found");
	}
};

XFG.getClassName = function(element) {
	if (typeof element == "string") element = XFG.getEl(element);
	if (element) return element.className;
	return "";
};

XFG.showSelected = function (element) {
	XFG.setClassName(element, XFG.addSuffix(XFG.getClassName(element), "_selected"));
};

XFG.hideSelected = function (element) {
	XFG.setClassName(element, XFG.removeSuffix(XFG.getClassName(element), "_selected"));
};

XFG.setClassName = function (element, className) {
	if (typeof element == "string") element = XFG.getEl(element);
	if (element) element.className = className;
};

XFG.addSuffix = function (text, suffix) {
	if (text.indexOf(suffix) > -1) return text;
	return text + suffix;
};

XFG.removeSuffix = function (text, suffix) {
	if (text.indexOf(suffix) < 0) return text;
	return text.substring(0, text.indexOf(suffix));	
};

XFG.showOver = function (element) {
	XFG.setClassName(element, XFG.addSuffix(XFG.getClassName(element), "_over"));
};

XFG.hideOver = function (element) {
	XFG.setClassName(element, XFG.removeSuffix(XFG.getClassName(element), "_over"));
}


XFG.showDisabled = function (element) {
	XFG.setClassName(element, XFG.addSuffix(XFG.getClassName(element), "_disabled"));
};

XFG.hideDisabled = function (element) {
	XFG.setClassName(element, XFG.removeSuffix(XFG.getClassName(element), "_disabled"));
}



/* StringBuffer class  changed to AjxBuffer and moved into Ajax/js/util/  */



XFG.getCookie = function (name) {
	var value = new RegExp(name + "=([^;]+)").exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}


XFG.setCookie = function (name, value) { // use: setCookie("name", value);
	document.cookie = name + "=" + escape(value);
}




XFG.valueToString = function (value, skipDerivedProperties, skipMethods, skipPrototypeProperties) {
	if (value == null) return "null";

	// strings get quotes
	if (typeof value == "string") return '"' + value + '"';

	// for arrays, list all the objects in it
	if (value instanceof Array) {
		var buffer = new AjxBuffer();
		for (var i = 0; i < value.length; i++) {
			buffer.append("        ", XFG.valueToString(value[i], "    ", skipDerivedProperties, skipMethods, skipPrototypeProperties));
		}
		return "[\n" + buffer.join(",\n") + "\n" + "    ]";
	}

	// for dates, return the syntax to create a new date (might as well)
	if (value instanceof Date) {
		return " new Date("+ [value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds()].join(",") + ")";
	}
	
	if (typeof value == "function") {
		return "(function)";
	}

	// for objects, call
	if (typeof value == "object") return XFG.objectToString(value, "    ", skipDerivedProperties, skipMethods, skipPrototypeProperties);
	
	return value;	
}

XFG.objectToString = function (object, skipDerivedProperties, skipMethods, skipPrototypeProperties) {

	var indentSpacer = "    ";
	var buffer = [];
	var hasObject = false;
	var propCount = 0;
	var proto = object.constructor.prototype;

	if (proto == null) proto = {};
	for (var prop in object) {
		var value = object[prop];
		if (skipPrototypeProperties && (object[prop] == proto[prop])) continue;
		if (skipMethods && value instanceof Function) continue;
		
		// if we have a derived property, write its id or [object] so we don't recurse too much
		if ((prop.indexOf("__") == 0 || prop.indexOf("$") == 0) && value instanceof Object) {
			buffer.push(AjxBuffer.concat(prop, ": ", value.toString()));
		} else {
			hasObject = hasObject || (typeof value == "object");
			buffer.push(AjxBuffer.concat(prop, ": ", XFG.valueToString(value, skipDerivedProperties, skipMethods, skipPrototypeProperties)));
		}
		propCount++;
	}
	buffer.sort(XFG.sortSpecialLast);
	if (hasObject || propCount > 5) {
		return "{\n" + indentSpacer + buffer.join(",\n"+ indentSpacer) + "\n" + "}"
	} else {
		return "{" + indentSpacer + buffer.join(", ") + indentSpacer + "}";
	}
}

XFG.sortSpecialLast = function (a,b) {
	var a1 = a.charAt(0);
	var b1 = b.charAt(0);
	var aIsSpecial = a1 == "_" || a1 == "$";
	var bIsSpecial = b1 == "_" || b1 == "$";
	if ( !aIsSpecial && !bIsSpecial) {
		return (a > b ? 1 : -1)
	} else if (aIsSpecial && bIsSpecial) {
		return (a > b ? 1 : -1)
	} else if (aIsSpecial) {
		return 1;
	} else {
		return -1;
	}
	
}



/* DEPRECATED:  Use AjxBuffer() instead */
StringBuffer = function() {
	this.clear();
	if (arguments.length > 0) {
		arguments.join = this.buffer.join;
		this.buffer[this.buffer.length] = arguments.join("");
	}
}
StringBuffer.prototype.toString = function () {
	return this.buffer.join("");
}
StringBuffer.prototype.join = function (delim) {
	if (delim == null) delim = "";
	return this.buffer.join(delim);
}
StringBuffer.prototype.append = function () {
	arguments.join = this.buffer.join;
	this.buffer[this.buffer.length] = arguments.join("");
}
StringBuffer.prototype.join = function (str) {
	return this.buffer.join(str);
}
StringBuffer.prototype.set = function(str) {
	this.buffer = [str];
}
StringBuffer.prototype.clear = function() {
	this.buffer = [];
}
StringBuffer.concat = function() {
	arguments.join = Array.prototype.join;
	return arguments.join("");
}

XFG.ARROW_DOWN = 40;
XFG.ARROW_LEFT = 37;
XFG.ARROW_RIGHT = 39;
XFG.ARROW_UP = 38;	
}
if (AjxPackage.define("ajax.dwt.xforms.XModel")) {
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


var _MODEL_ = "model";
var _INSTANCE_ = "instance";
var _INHERIT_ = "inherit";
var _MODELITEM_ = "modelitem";


/**
 * 
 * 
 * @private
 */
XModel = function(attributes) {
	// get a unique id for this form
	XFG.assignUniqueId(this, "_Model_");

	// copy any attributes passed in directly into this object
	if (attributes) {
		for (var prop in attributes) {
			this[prop] = attributes[prop];	
		}
	}
	
	if (this.items == null) this.items = [];
	
	this._pathIndex = {};
	this._pathGetters = {};
	this._parentGetters = {};
	this._itemsAreInitialized = false;
	this._errorMessages = {};

	if (this.getDeferInit() == false) {
		this.initializeItems();
	}
}
XModel.toString = function() {	return "[Class XModel]";	}
XModel.prototype.toString = function() {	return "[XModel " + this.__id + "]";	}

XModel.prototype.pathDelimiter = "/";
XModel.prototype.getterScope = _INSTANCE_;
XModel.prototype.setterScope = _INSTANCE_;

// set deferInit to false to initialize all modelItems when the model is created
//	NOTE: this is generally a bad idea, and all XForms are smart enough
//			to tell their models to init before they need them...
XModel.prototype.deferInit = true;
XModel.prototype.getDeferInit = function () {	return this.deferInit	}


XModel.prototype.initializeItems = function() {
	if (this._itemsAreInitialized) return;
	
	var t0 = new Date().getTime();

	this.__nestedItemCount = 0;	//DEBUG

	// initialize the items for the form
	this.items = this.initItemList(this.items, null);

	this._itemsAreInitialized = true;

	var t1 = new Date().getTime();
	//DBG.println(this,".initializeItems(): w/ ", this.__nestedItemCount," items took ", (t1 - t0), " msec");
}



XModel.prototype.initItemList = function(itemAttrs, parentItem) {
	var items = [];
	for (var i = 0; i < itemAttrs.length; i++) {
		items[i] = this.initItem(itemAttrs[i], parentItem);
	}
	this.__nestedItemCount += itemAttrs.length;		//DEBUG
	return items;
}


XModel.prototype.initItem = function(itemAttr, parentItem) {
	// if we already have a form item, assume it's been initialized already!
	if (itemAttr.__isXModelItem) return itemAttr;

	// create the XFormItem subclass from the item attributes passed in
	//	(also links to the model)
	var item = XModelItemFactory.createItem(itemAttr, parentItem, this);
	
	
	
	// have the item initialize it's sub-items, if necessary (may be recursive)
	item.initializeItems();

	return item;
}

XModel.prototype.addItem = function(item, parentItem) {
	if (!item.__isXModelItem) item = this.initItem(item, parentItem);
	if (parentItem == null) {
		this.items.push(item);
	} else {
		parentItem.addItem(item);
	}
}

// add an item to our index, so we can find it easily later
XModel.prototype.indexItem = function(item, path) {
	this._pathIndex[path] = item;
}






//
// getting modelItems, parent items, their paths, etc
//

XModel.prototype.getItem = function(path, createIfNecessary) {
	// try to find the item by the path, return if we found it
	var item = this._pathIndex[path];
	if (item != null) return this._pathIndex[path];

	// if we didn't find it, try normalizing the path
	var normalizedPath = this.normalizePath(path);
	//	convert any "#1", etc to just "#"
	for (var i = 0; i < normalizedPath.length; i++) {
		if (normalizedPath[i].charAt(0) == "#") normalizedPath[i] = "#";
	}
	// and if we find it, save that item under the original path and return it
	item = this._pathIndex[normalizedPath.join(this.pathDelimiter)];
	if (item != null) {
		this._pathIndex[path] = item;
		return item;
	}

	if (createIfNecessary != true) return null;

	// get each parent item (creating if necessary) until we get to the end
	var parentItem = null;
	for (var p = 0; p < normalizedPath.length; p++) {
		var itemPath = normalizedPath.slice(0, p+1).join(this.pathDelimiter);
		var item = this.getItem(itemPath, false);
		if (item == null) {
			//DBG.println("making modelItem for ", itemPath);
			item = XModelItemFactory.createItem({id:normalizedPath[p]}, parentItem, this);
		}
		parentItem = item;
	}
	return item;
}



// "normalize" a path and return it split on the itemDelimiter for this model
XModel.prototype.normalizePath = function (path) {
	if (path.indexOf("[") > -1) {
		path = path.split("[").join("/#");
		path = path.split("]").join("");
	}
	if (path.indexOf(".") > -1) {
		path = path.split(/[\/\.]+/);
		var outputPath = [];
		for (var i = 0; i < path.length; i++) {
			var step = path[i];
			if (step == "..") {
				outputPath.pop();
			} else if (step != ".") {
				outputPath.push(step);
			}
		}
		return outputPath;
	}
	return path.split(this.pathDelimiter);
}


XModel.prototype.getParentPath = function (path) {
	path = this.normalizePath(path);
	return path.slice(0, path.length - 1);
}

XModel.prototype.getLeafPath = function (path) {
	path = this.normalizePath(path);
	return path[path.length - 1];
}






XModel.prototype.getInstanceValue = function (instance, path) {
	var getter = this._getPathGetter(path);
	return getter.call(this, instance);
}

XModel.prototype.getParentInstanceValue = function (instance, path) {
	var getter = this._getParentPathGetter(path);
	return getter.call(this, instance);
}

XModel.prototype.setInstanceValue = function (instance, path, value) {
//DBG.println("setInstanceValue(",path,"): ", value, " (",typeof value,")");
	var parentValue = this.getParentInstanceValue(instance, path);
	if (parentValue == null) {
		parentValue = this.setParentInstanceValues(instance, path);
	}
	var modelItem = this.getItem(path, true);
	var leafPath = this.getLeafPath(path);
	var ref = modelItem.ref;
	if (leafPath.charAt(0) == "#") ref = parseInt(leafPath.substr(1));
	
	if (modelItem.setter) {
		// convert "/" to "." in the ref
		if (ref.indexOf(this.pathDelimiter) > -1) ref = ref.split(this.pathDelimiter).join(".");

		var setter = modelItem.setter;
		var scope = modelItem.setterScope;
		if (scope == _INHERIT_) scope = this.setterScope;
		if (scope == _INSTANCE_) {
			instance[setter](value, parentValue, ref);
		} else if (scope == _MODEL_) {
			this[setter](value, instance, parentValue, ref);		
		} else {
			modelItem[setter](value, instance, parentValue, ref);
		}
	} else {
		if (typeof ref == "string" && ref.indexOf(this.pathDelimiter) > -1) {
			ref = ref.split(this.pathDelimiter);
			for (var i = 0; i < ref.length - 1; i++) {
				parentValue = parentValue[ref[i]];
			}
			ref = ref.pop();
		}
		parentValue[ref] = value;
		var parentItem = modelItem.getParentItem();
		if(parentItem) {
			var parentPath = this.getParentPath(path).join(this.pathDelimiter);
			 if(parentItem.setter) {
				XModel.prototype.setInstanceValue.call(this,instance, parentPath, parentValue);
			 } else {
				var event = new DwtXModelEvent(instance, parentItem, parentPath, parentValue);
				parentItem.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
			 }
		}
	}
	
	//notify listeners that my value has changed
	var event = new DwtXModelEvent(instance, modelItem, path, value);
	modelItem.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
	return value;
}


XModel.prototype.setParentInstanceValues = function (instance, path) {
	var pathList = this.getParentPath(path);
	for (var i = 0; i < pathList.length; i++) {
		var itemPath = pathList.slice(0, i+1).join(this.pathDelimiter);
		var itemValue = this.getInstanceValue(instance, itemPath);
		if (itemValue == null) {
			var modelItem = this.getItem(itemPath, true);
			var defaultValue = modelItem.getDefaultValue();
			itemValue = this.setInstanceValue(instance, itemPath, defaultValue);
		}
	}
	return itemValue;
}







//NOTE: model.getInstance() gets count of PARENT
// "modelItem" is a pointer to a modelItem, or an path as a string
XModel.prototype.getInstanceCount = function (instance, path) {
	var list = this.getParentInstanceValue(instance, path);
	if (list != null && list.length) return list.length;
	return 0;
}


// "path" is a path of id's
XModel.prototype.addRowAfter = function (instance, path, afterRow) {
	var newInstance = null;	
	
	var modelItem = this.getItem(path);
	if (modelItem) {
		newInstance = this.getNewListItemInstance(modelItem);
	} else {
		newInstance = "";
	}
	var list = this.getInstanceValue(instance, path);
	if (list == null) {
		list = [];
	}

	list.splice(afterRow+1, 0, newInstance);
	this.setInstanceValue(instance, path, list);
}


XModel.prototype.getNewListItemInstance = function (modelItem) {
	var listItem = modelItem.listItem;
	if (listItem == null) return "";
	return this.getNewInstance(listItem);
}

XModel.prototype.getNewInstance = function (modelItem) {
	if (modelItem.defaultValue != null) return modelItem.defaultValue;
	
	var type = modelItem.type;
	switch (type) {
		case _STRING_:
			return "";

		case _NUMBER_:
			return 0;
			
		case _OBJECT_:
			var output = {};
			if (modelItem.items) {
				for (var i = 0; i < modelItem.items.length; i++) {
					var subItem = modelItem.items[i];
					if (subItem.ref) {
						output[subItem.ref] = this.getNewInstance(subItem);
					} else if (subItem.id) {
						output[subItem.id] = this.getNewInstance(subItem);
					}
				}
			
			}
			return output;
			
		case _LIST_:
			return [];

		case _DATE_:
		case _TIME_:
		case _DATETIME_:
			return new Date();
			
		default:
			return "";
	}
}



// "modelItem" is a pointer to a modelItem, or an path as a string
XModel.prototype.removeRow = function (instance, path, instanceNum) {
	var list = this.getInstanceValue(instance, path);
	if (list == null) return;
	
	var isString = false;
	if(list instanceof String || typeof(list) == "string")
		isString=true;
	
	var tmpList = isString ? list.split(",") : list;
	var newList = [];
	var cnt = tmpList.length;
	for (var i=0;i<cnt;i++) {
		if(i != instanceNum) {
			newList.push(tmpList[i]);
		}
	}

	this.setInstanceValue(instance, path, newList);
}






// for speed, we create optimized functions to traverse paths in the instance
//	to actually return values for an instance.  Make them here.
//
XModel.prototype._getPathGetter = function (path) {
//DBG.println("_getPathGetter(",path,")");
	var getter = this._pathGetters[path];
	if (getter != null) return getter;

	getter = this._makePathGetter(path);
//DBG.println("assigning path getter for ", path, " to ", getter);
	this._pathGetters[path] = getter;
	return getter;
}

XModel.prototype._getParentPathGetter = function (path) {
	var getter = this._parentGetters[path];
	if (getter != null) return getter;
	
	var parentPath = this.getParentPath(path).join(this.pathDelimiter);
	getter = this._getPathGetter(parentPath);
	this._parentGetters[path] = getter;
	this._pathGetters[parentPath] = getter;
	return getter;
}

XModel.prototype._makePathGetter = function (path) {
	if (path == null) return new Function("return null");
	
	// normalizePath() converts to an array, fixes all "." and ".." items, and changes [x]  to #x
	var pathList = this.normalizePath(path);

	// forget any leading slashes
	if (pathList[0] == "") pathList = pathList.slice(1);
	
//	DBG.println("_makePathGetter(", path, "): ", pathList);
	var methodSteps = [];
	var pathToStep = "";
	
	for (var i = 0; i < pathList.length; i++) {
		var	pathStep = pathList[0, i];
		
		if (pathStep.charAt(0) == "#") {
			pathStep = pathStep.substr(1);
			pathToStep = pathToStep + "#";
		} else {
			pathToStep = pathToStep + pathStep;

		}
		var	modelItem = this.getItem(pathToStep, true);
		var ref = modelItem.ref;

		// convert "/" to "." in the ref
		if (ref.indexOf(this.pathDelimiter) > -1) ref = ref.split(this.pathDelimiter).join(".");

		if (modelItem.getter) {
			var getter = modelItem.getter;
			var scope = modelItem.getterScope;
			if (scope == _INHERIT_) {
				scope = this.getterScope;
			}
			
			if (scope == _INSTANCE_) {
				methodSteps.push("if(instance) {");	
				methodSteps.push("	current = instance."+ getter+ "(current, '"+ref+"');");
				methodSteps.push("}");							
			} else if (scope == _MODEL_) {
				methodSteps.push("current = this."+ getter+ "(instance, current, '"+ref+"');");
			} else {
				methodSteps.push("current = this.getItem(\""+ pathToStep+ "\")."+ getter+ "(instance, current, '"+ref+"');");			
			}
			
		} else if (ref == "#") {
			methodSteps.push("if(current) {");	
			methodSteps.push("	current = current[" + pathStep + "];");
			methodSteps.push("}");					
		} else {
			methodSteps.push("if(current) {");		
			methodSteps.push("	current = current." + ref + ";");
			methodSteps.push("}");					
		}
		pathToStep += this.pathDelimiter;
	}

	var methodBody = AjxBuffer.concat(
			"try {\r",
			"var current = instance;\r",
			"\t", methodSteps.join("\r\t"), "\r",
			"} catch (e) {\r ",
			"	DBG.println('Error in getting path for \"", path, "\": ' + e);\r",
			"	current = null;\r",
			"}\r",
			"return current;\r"
		);
	//DBG.println(path,"\r\t", methodSteps.join("\r\t"), "\r");
	var method = new Function("instance", methodBody);

	return method;
}








// error messages
//	NOTE: every call to XModel.prototype.registerError() should be translated!

XModel._errorMessages = {};
XModel.registerErrorMessage = XModel.prototype.registerErrorMessage = function (id, message) {
	this._errorMessages[id] = message;
}
XModel.registerErrorMessage("unknownError", "Unknown error.");
XModel.prototype.defaultErrorMessage = "unknownError";


// set the default error message for the model (it's not a bad idea to override this in your models!)
XModel.prototype.getDefaultErrorMessage = function (modelItem) {
	if (modelItem && modelItem.errorMessage) {
		return modelItem.getDefaultErrorMessage();
	}

	return this.defaultErrorMessage;
}

XModel.prototype.getErrorMessage = function (id, arg0, arg1, arg2, arg3, arg4) {
	var msg = this._errorMessages[id];
	if (msg == null) msg = XModel._errorMessages[id];
	
	if (msg == null) {
		DBG.println("getErrorMessage('", id, "'): message not found.  If this is an actual error message, add it to the XModel error messages so it can be translated.");
		return id;
	}
	if (arg0 !== null) msg = msg.split("{0}").join(arg0);
	if (arg1 !== null) msg = msg.split("{1}").join(arg1);
	if (arg2 !== null) msg = msg.split("{2}").join(arg2);
	if (arg3 !== null) msg = msg.split("{3}").join(arg3);
	if (arg4 !== null) msg = msg.split("{4}").join(arg4);
	return msg;
}
}
if (AjxPackage.define("ajax.dwt.xforms.XModelItem")) {
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


//
//	Factory to create XModelItems from simple attributes (eg: from JS object literals or XML)
//

/**
 * 
 * This class is never instantiated.
 * 
 * @private
 */
XModelItemFactory = function() {}

XModelItemFactory.createItem = function (attributes, parentItem, xmodel) {
	// assign a modelItem to the item
	var type = attributes.type;
	var constructor = this.getItemTypeConstructor(type || _UNTYPED_);

	var item = new constructor();
	item._setAttributes(attributes);
	if (item.id != null && item.ref == null) item.ref = item.id;

	// idPath is mostly used for debugging...
	var idPath = this.getIdPath(attributes, parentItem);
	item.__idPath = idPath;

	item.__xmodel = xmodel;
	item.__parentItem = parentItem;

//DBG.println("XModelItemFactory.createItem(", attributes.id, ") idPath='", idPath, "' type='", item.type,"'");
	item.initModelItem();

	// add the item to its model's index
	xmodel.indexItem(item, idPath);

	return item;
}

XModelItemFactory.getIdPath = function (attributes, parentItem) {
	if (attributes.path) return attributes.path;
	return this.getFullPath(attributes.id, (parentItem ? parentItem.getIdPath() : ""));
}

XModelItemFactory.getFullPath = function (itemPath, parentPath) {
	if (itemPath == null) return null;
	if (parentPath == null) parentPath = "";
	
	var path = itemPath;
	if (itemPath == ".") {
		path = parentPath;

	} else if (itemPath == "..") {
		parentPath = parentPath.split("/");
		path = parentPath.slice(0, parentPath.length - 1).join("/");

	} else if (parentPath == "") {
		path = itemPath;

	} else {
		path = parentPath + "/" + itemPath;
	}
	return path;
}



XModelItemFactory.typeConstructorMap = {};

XModelItemFactory.createItemType = function (typeConstant, typeName, constructor, superClassConstructor) {
	if (constructor == null) constructor = new Function();
	if (typeof superClassConstructor == "string") superClassConstructor = this.getItemTypeConstructor(superClassConstructor);
	if (superClassConstructor == null) superClassConstructor = XModelItem;

	// initialize the constructor
	constructor.prototype = new superClassConstructor();	

	constructor.prototype.type = typeName;
	constructor.prototype.constructor = constructor;
	constructor.prototype.toString = new Function("return '[XModelItem:" + typeName + " path=\"' + this.getIdPath() + '\"]'");
	constructor.toString = new Function("return '[Class XModelItem:" + typeName + "]'");
	
	// put the item type into the typemap
	this.registerItemType(typeConstant, typeName, constructor);

	// return the prototype
	return constructor;
}

XModelItemFactory.registerItemType = function(typeConstant, typeName, constructor) {
	// assign the type constant to the window so everyone else can use it
	window[typeConstant] = typeName;
	this.typeConstructorMap[typeName] = constructor;	
}


XModelItemFactory.getItemTypeConstructor = function (typeName) {
	var typeConstructor = this.typeConstructorMap[typeName];
	if (typeConstructor == null) typeConstructor = this.typeConstructorMap["string"];
	return typeConstructor;
}







XModelItem = function() {}
XModelItemFactory.createItemType("_UNTYPED_", "untyped", XModelItem, Object);

// define the base class as the "object" class -- it works, but no type logic is applied
XModelItemFactory.registerItemType("_OBJECT_", "object", XModelItem);


// set base class defaults

XModelItem.prototype.__isXModelItem = true;
XModelItem.prototype.getterScope = _INHERIT_;
XModelItem.prototype.setterScope = _INHERIT_;

// methods
XModelItem.prototype._setAttributes = function (attributes) {
	this._attributes = attributes;
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
}


XModelItem.prototype.initModelItem = function() {
	this._eventMgr = new AjxEventMgr();
}



// initialize sub-items for this item
XModelItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items != null) {
		this.items = this.getModel().initItemList(items, this);
	}
}



//
//	accessors
//
XModelItem.prototype.getModel = function() 		{		return this.__xmodel;		}
XModelItem.prototype.getParentItem = function() 	{		return this.__parentItem;	}
XModelItem.prototype.getIdPath = function()	 	{		return this.__idPath;		}


XModelItem.prototype.getItems = function () 		{		return this.items;			}
XModelItem.prototype.addItem = function (item) {
	if (!item.__isXModelItem) item = this.xmodel.initItem(item, this);
	if (this.items == null) this.items = [];
	this.items.push(item);
}


XModelItem.prototype.getConstraints = function()	{		return this.constraints;	}
XModelItem.prototype.getRequired = function()		{		return this.required;		}
XModelItem.prototype.getReadonly = function()		{		return this.readonly;		}
XModelItem.prototype.getReadOnly = XModelItem.prototype.getReadonly;


XModelItem.prototype.getDefaultValue = function () {return new Object() };


//
//	validate this value (i.e. when a formitem that refers to it has changed)
//

XModel.registerErrorMessage("valueIsRequired", AjxMsg.valueIsRequired);
XModelItem.prototype.validate = function (value, form, formItem, instance) {

	// see if it's required
	if (value == null || value === "") {
		if (this.getRequired()) {
			throw this.getModel().getErrorMessage("valueIsRequired", value);
		}
    }
    
	// next validate the type
	//	this will throw an exception if something went wrong
	//	also, value may be coerced to a particular type by the validator
	else {
		value = this.validateType(value);
	}
	
	// if they defined any constraints, 
	var constraints = this.getConstraints();
	if (constraints == null) return value;

	if (! (AjxUtil.isInstance(constraints, Array))) constraints = [constraints];
	for (var i = 0; i < constraints.length; i++) {
		var constraint = constraints[i];
		if (constraint.type == "method") {
			// The constraint method should either return a value, or throw an
			// exception.
			value = constraint.value.call(this, value, form, formItem, instance);
		}
// 		if (isValid == false) {
// 			throw this.getModel().getErrorMessage(constraint.errorMessageId, value);
// 		}
	}
	return value;
}

XModelItem.prototype.getDefaultErrorMessage = function () {
	return this.errorMessage;
}


// generic validators for different data types
//	we have them here so we can use them in the _LIST_ data type


XModelItem.prototype.validateType = function(value) {	return value;		}




//
//	for validating strings
//

/**
 * Datatype facet: length. If not null, the length of the data
 * value must be equal to this value. Specifying this attribute
 * ignores the values for {@link XModelItem.prototype.minLength}
 * and {@link XModelItem.prototype.maxLength}.
 */
XModelItem.prototype.length = null;

/**
 * Datatype facet: minimum length. If not null, the length of
 * the data value must not be less than this value.
 */
XModelItem.prototype.minLength = null;

/**
 * Datatype facet: maximum length. If not null, the length of
 * the data value must not exceed this value.
 */
XModelItem.prototype.maxLength = null;

/**
 * Datatype facet: pattern. If not null, specifies an array of
 * <code>RegExp</code> objects. The data value must match one of
 * the patterns or an error is signaled during validation.
 */
XModelItem.prototype.pattern = null;

/**
 * Datatype facet: enumeration. If not null, specifies an array of
 * literal string values. The data value must match one of the
 * literals or an error is signaled during validation.
 */
XModelItem.prototype.enumeration = null;

/**
 * Datatype facet: white space. If not null, specifies how white
 * space in the value should be processed before returning the
 * final value. Valid values are:
 * <ul>
 * <li>"preserve": leaves whitespace as-is (default)
 * <li>"replace": replaces tabs, newlines, and carriage-returns with a space
 * <li>"collapse": same as "replace"  but also trims leading and trailing whitespace and replaces sequences of spaces with a single space
 * </ul>
 */
XModelItem.prototype.whiteSpace = null;

XModelItem.prototype.getLength = function() 		{ return this.length; }
XModelItem.prototype.getMinLength = function () 	{	return this.minLength;				}
XModelItem.prototype.getMaxLength = function () 	{	return this.maxLength;				}
XModelItem.prototype.getPattern = function() {
	if (this.pattern != null && this.pattern.checked == null) {
		if (AjxUtil.isString(this.pattern)) {
			this.pattern = [ new RegExp(this.pattern) ];
		}
		else if (AjxUtil.isInstance(this.pattern, RegExp)) {
			this.pattern = [ this.pattern ];
		}
		else if (AjxUtil.isArray(this.pattern)) {
			for (var i = 0; i < this.pattern.length; i++) {
				var pattern = this.pattern[i];
				if (AjxUtil.isString(pattern)) {
					this.pattern[i] = new RegExp(this.pattern[i]);
				}
			}
		}
		else {
			// REVISIT: What to do in this case? Do we just
			//          assume that it was specified correctly?
		}
		this.pattern.checked = true;
	}
	return this.pattern;
}
XModelItem.prototype.getEnumeration = function() { return this.enumeration; }
XModelItem.prototype.getWhiteSpace = function() { return this.whiteSpace; }

XModel.registerErrorMessage("notAString",		AjxMsg.notAString);
XModel.registerErrorMessage("stringLenWrong",   AjxMsg.stringLenWrong);
XModel.registerErrorMessage("stringTooShort", 	AjxMsg.stringTooShort);
XModel.registerErrorMessage("stringTooLong",	AjxMsg.stringTooLong);
XModel.registerErrorMessage("stringMismatch",   AjxMsg.stringMismatch);

XModelItem.prototype.validateString = function(value) {
	if (value == null) return;
	
	if (!AjxUtil.isString(value)) {
		throw this.getModel().getErrorMessage("notAString", value);
	}

	value = this._normalizeAndValidate(value);

    var length = this.getLength();
    if (length !== null) {
        if (value.length !== length) {
            throw this.getModel().getErrorMessage("stringLenWrong", length);
        }
    }
    else {
		var maxLength = this.getMaxLength();
		if (maxLength !== null && value.length > maxLength) {
			throw this.getModel().getErrorMessage("stringTooLong", maxLength);
		}
	
		var minLength = this.getMinLength();
		if (minLength !== null && value.length < minLength) {
			throw this.getModel().getErrorMessage("stringTooShort", minLength);
		}
    }
    
    return value;
}

XModel.registerErrorMessage("invalidEmailAddr",   AjxMsg.invalidEmailAddr);
XModelItem.prototype.validateEmailAddress = function(value) {
	if (value == null) return;
	
	if (!AjxUtil.isString(value)) {
		throw this.getModel().getErrorMessage("notAString", value);
	}

	value = this._normalizeAndValidate(value);

    var length = this.getLength();
    if (length !== null) {
        if (value.length !== length) {
            throw this.getModel().getErrorMessage("stringLenWrong", length);
        }
    } else {
		var maxLength = this.getMaxLength();
		if (maxLength !== null && value.length > maxLength) {
			throw this.getModel().getErrorMessage("stringTooLong", maxLength);
		}
	
		var minLength = this.getMinLength();
		if (minLength !== null && value.length < minLength) {
			throw this.getModel().getErrorMessage("stringTooShort", minLength);
		}
	    var parts = value.split('@');
		if (!parts || parts[0] == null || parts[0] == ""){
		   // set the name, so that on refresh, we don't display old data.
			throw this.getModel().getErrorMessage("invalidEmailAddr");
		 } else {
			if(!AjxUtil.isValidEmailNonReg(value)) {
			   throw this.getModel().getErrorMessage("invalidEmailAddr");
			}
	  	 }
	}
    return value;
}

/**
 * Normalizes value against whiteSpace facet and then validates 
 * against pattern and enumeration facets.
 * @private
 */
XModelItem.prototype._normalizeAndValidate = function(value) {

    var whiteSpace = this.getWhiteSpace();
    if (whiteSpace !== null) {
    	if (whiteSpace === "replace" || whiteSpace === "collapse") {
    		value = value.replace(/[\t\r\n]/g, " ");
    	}
    	if (whiteSpace === "collapse") {
    		value = value.replace(/^\s+/,"").replace(/\s+$/,"").replace(/[ ]+/, " ");
    	}
    }
	
    var pattern = this.getPattern();
    if (pattern != null) {
    	var matched = false;
    	for (var i = 0; i < pattern.length; i++) {
    		if (pattern[i].test(value)) {
    			matched = true;
    			break;
    		}
    	}
		if (!matched) {
			throw this.getModel().getErrorMessage("stringMismatch", value);
		}    	
    }
    
    var enumeration = this.getEnumeration();
    if (enumeration !== null) {
    	var matched = false;
    	for (var i = 0; i < enumeration.length; i++) {
    		if (enumeration[i] === value) {
    			matched = true;
    			break;
    		}
    	}
    	if (!matched) {
			throw this.getModel().getErrorMessage("stringMismatch", value);
    	}
    }
    
	return value;
}


//
//	for validating numbers
//

/**
 * Datatype facet: total digits. If not null, the number of
 * digits before the decimal point in the data value must not
 * be greater than this value.
 */
XModelItem.prototype.totalDigits = null;
 
/** 
 * Datatype facet: fraction digits. If not null, the number of
 * digits after the decimal point in the data value must not be
 * greater than this value.
 */
XModelItem.prototype.fractionDigits = null;

/** 
 * Datatype facet: maximum value (inclusive). If not null, the
 * data value must be less than or equal to this value.
 */
XModelItem.prototype.maxInclusive = null;

/** 
 * Datatype facet: maximum value (exclusive). If not null, the
 * data value must be less than this value.
 */
XModelItem.prototype.maxExclusive = null;

/** 
 * Datatype facet: minimum value (inclusive). If not null, the
 * data value must be greater than or equal to this value.
 */
XModelItem.prototype.minInclusive = null;

/** 
 * Datatype facet: minimum value (exclusive). If not null, the
 * data value must be greater than or equal to this value.
 */
XModelItem.prototype.minExclusive = null;


XModelItem.prototype.getTotalDigits = function() { return this.totalDigits; }
XModelItem.prototype.getFractionDigits = function () 	{	return this.fractionDigits;			}
XModelItem.prototype.getMinInclusive = function () 			{	return this.minInclusive;				}
XModelItem.prototype.getMinExclusive = function() { return this.minExclusive; }
XModelItem.prototype.getMaxInclusive = function () 			{	return this.maxInclusive;				}
XModelItem.prototype.getMaxExclusive = function() { return this.maxExclusive; }

/**
 * Registers a listener with the control. The listener will be call when events
 * of type <code>eventType</code> fire
 *
 * @param {String} eventType Event type for which to listen (required)
 * @param {AjxListener} listener Listener to be registered (required)
 * @param index		[int]*			index at which to add listener
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #removeListener
 * @see #removeAllListeners
 * @see #notifyListeners
 */
XModelItem.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

/**
 * Removes a listener from the control.
 *
 * @param {String} eventType Event type for which to remove the listener (required)
 * @param {AjxListener} listener Listener to be removed (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeAllListeners
 */
XModelItem.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};


/**
 * Removes all listeners for a particular event type.
 *
 * @param {String} eventType Event type for which to remove listeners (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeListener
 */
XModelItem.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

/**
 * Queries to see if there are any listeners registered for a particular event type
 *
 * @param {String} eventType Event type for which to check for listener registration (required)
 *
 * @return True if there is an listener registered for the specified event type
 *
 * @see DwtEvent
 */
XModelItem.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

/**
 * Notifys all listeners of type <code>eventType</code> with <code>event</code>
 *
 * @param {String} eventType Event type for which to send notifications (required)
 * @param {DwtEvent} event Event with which to notify. Typically a subclass of
 * 		DwtEvent
 *
 * @see DwtEvent
 */
XModelItem.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

XModel.registerErrorMessage("notANumber",		 AjxMsg.notANumber);
XModel.registerErrorMessage("numberTotalExceeded", AjxMsg.numberTotalExceeded);
XModel.registerErrorMessage("numberFractionExceeded", AjxMsg.numberFractionExceeded);
XModel.registerErrorMessage("numberMoreThanMax", AjxMsg.numberMoreThanMax);
XModel.registerErrorMessage("numberMoreThanEqualMax", AjxMsg.numberMoreThanEqualMax);
XModel.registerErrorMessage("numberLessThanMin", AjxMsg.numberLessThanMin);
XModel.registerErrorMessage("numberLessThanEqualMin", AjxMsg.numberLessThanEqualMin);

XModelItem.prototype.validateNumber = function(value) {
	value = this._normalizeAndValidate(value);

	var nvalue = parseFloat(value);

	if (isNaN(nvalue) || !AjxUtil.FLOAT_RE.test(value)) {
		throw this.getModel().getErrorMessage("notANumber", value);
	}

	var totalDigits = this.getTotalDigits();
	if (this.totalDigits !== null) {
		var wholePart = Math.floor(nvalue);
		if (wholePart.toString().length > totalDigits) {
			throw this.getModel().getErrorMessage("numberTotalExceeded", value, totalDigits);
		}
	}

	var fractionDigits = this.getFractionDigits();
	if (this.fractionDigits !== null) {
		var fractionPart = String(nvalue - Math.floor(nvalue));
		if (fractionPart.indexOf('.') != -1 && fractionPart.replace(/^\d*\./,"").length > fractionDigits) {
			throw this.getModel().getErrorMessage("numberFractionExceeded", value, fractionDigits);
		}
	}

	var maxInclusive = this.getMaxInclusive();
	if (maxInclusive !== null && nvalue > maxInclusive) {
		throw this.getModel().getErrorMessage("numberMoreThanMax", maxInclusive);
	}
	
	var maxExclusive = this.getMaxExclusive();
	if (maxExclusive !== null && nvalue >= maxExclusive) {
		throw this.getModel().getErrorMessage("numberMoreThanEqualMax", maxExclusive);
	}

	var minInclusive = this.getMinInclusive();
	if (minInclusive !== null && nvalue < minInclusive) {
		throw this.getModel().getErrorMessage("numberLessThanMin",  minInclusive);
	}
	
	var minExclusive = this.getMinExclusive();
	if (minExclusive !== null && nvalue <= minExclusive) {
		throw this.getModel().getErrorMessage("numberLessThanEqualMin", minExclusive);
	}

	return nvalue;
}

XModel.registerErrorMessage("notAnInteger",		 AjxMsg.notAnInteger);
XModelItem.prototype.validateInt = function (value) {
    var fvalue = this.validateNumber (value) ; //parseFloat value
    var nvalue = parseInt (value) ;   //parseInt value
    if (nvalue != fvalue ) {
        throw this.getModel().getErrorMessage("notAnInteger", value) ;        
    }

    return nvalue ;
}


//
//	for validating dates and times
//

XModelItem.prototype.msecInOneDay = (1000 * 60 * 60 * 24);
XModel.registerErrorMessage("invalidDateString", AjxMsg.invalidDateString);

// methods
XModelItem.prototype.validateDate = function(value) {
	
	if (AjxUtil.isInstance(value, Date)) return value;
	if (AjxUtil.isString(value)) {
		value = value.toLowerCase();
		var date = new Date();

		if (value.indexOf("/") > -1) {
			var dateStrs = value.split("/");
			if (dateStrs.length == 3){
				var month = dateStrs[0];
				var day = dateStrs[1];
				var year = dateStrs[2];							
					
				if (month.length <= 2 && day.length <= 2 && year.length == 4) {
					//remove the preceeding 0 of the date value,
					//otherwise parseInt will evaluate it as 0
					month = parseInt(XModel.removePreceedingZero(month));
					day = parseInt(XModel.removePreceedingZero(day));
					year = parseInt(XModel.removePreceedingZero(year));							
					
					if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
						month -= 1;
						date.setFullYear(year, month, day);
						date.setHours(0,0,0,0);
						return date; 
											
						/*
						month -= 1;
						if (year < 1900) {
							if (year < 50) year += 2000;
							year += 1900;
						}
						date.setFullYear(year, month, day);
						date.setHours(0,0,0,0);
						return date; */
					}
				}
			}
		} else {
			// set to midnight today according to local time
			date.setHours(0,0,0,0);
			
			if (value == AjxMsg.today) {
				return date;
			} else if (value == AjxMsg.yesterday) {
				date.setTime(date.getTime() - this.msecInOneDay);
				return date;
			} else if (value == AjxMsg.tomorrow) {
				date.setTime(date.getTime() + this.msecInOneDay);
				return date;
			}
		}
	}
	throw this.getModel().getErrorMessage("invalidDateString", value);
	return value;
}

//remove the preceeding zero of a string, it is useful when evaluate a date item
XModel.removePreceedingZero =
function (dStr){
	var pattern = /^[0]*(.*)$/ ;
	var result = dStr.match(pattern) ;
	if (result != null) {
		return result[1];
	}else{
		return dStr ;
	}
}


XModel.registerErrorMessage("invalidTimeString",		 AjxMsg.invalidTimeString);
// time is returned as a number of milliseconds since
XModelItem.prototype.validateTime = function (value) {

	if (AjxUtil.isNumber(value)) return value;
	
	if (AjxUtil.isInstance(value, Date)) {
		return ((value.getHours() * 360) + (value.getMinutes() * 60) + value.getSeconds()) * 1000;
	}
	
	if (AjxUtil.isString(value)) {
		value = value.toLowerCase();
		if (value.indexOf(":") > -1) {
			value = value.split(":");

			var isPM = false;
			var lastPiece = value[value.length - 1];
			isPM = (lastPiece.indexOf(I18nMsg.periodPm.toLowerCase()) > -1);

			var hour = parseInt(value[0]);
			var min = parseInt(value[1]);
			var sec = (value.length == 3 ? parseInt(value[2]) : 0);
			if (!isNaN(hour) && !isNaN(min) && !isNaN(sec)) {
				hour -= 1;
				if (isPM && hour > 11) hour += 12;
				
				return ((hour * 360) + (min * 60) + sec) * 1000;
			}
		}
	}
	throw this.getModel().getErrorMessage("invalidTimeString", value);
}


XModel.registerErrorMessage("invalidDatetimeString",		 AjxMsg.invalidDatetimeString);
XModelItem.prototype.validateDateTime = function (value) {

	if (AjxUtil.isInstance(value, Date)) return value;
	if (AjxUtil.isNumber(value)) return value;
	if (AjxUtil.isString(value)) {
		// try to get the value as a date
		//  (this will ignore time fields, and will throw an exeception if we couldn't parse a date)
		var date = this.validateDate(value);
		
		// if it has a time component
		if (value.indexOf(":") > -1) {
			var time = value.split(" ")[1];
			// this will validate the time string and will throw an exception if it doesn't match
			time = this.validateTimeString(time);
			
			date.setTime(date.getTime() + time);
		}
		return date;
	}
	// probably should never get here...
	throw this.getModel().getErrorMessage("invalidDatetimeString", value);
}






//
//	XModelItem class: "string"
//
String_XModelItem = function(){}
XModelItemFactory.createItemType("_STRING_", "string", String_XModelItem)  ;
String_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
String_XModelItem.prototype.getDefaultValue = function () {	return ""; };


//
//	XModelItem class: "number"
//
Number_XModelItem = function(){}
XModelItemFactory.createItemType("_NUMBER_", "number", Number_XModelItem);
Number_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Number_XModelItem.prototype.getDefaultValue = function () {	return 0; };

//XModelItem class: "int"
Integer_XModelItem = function(){}
XModelItemFactory.createItemType("_INT_", "int", Integer_XModelItem);
Integer_XModelItem.prototype.validateType = XModelItem.prototype.validateInt;
Integer_XModelItem.prototype.getDefaultValue = function () {	return 0; };




//
//	XModelItem class: "date"
//
Date_XModelItem = function(){}
XModelItemFactory.createItemType("_DATE_", "date", Date_XModelItem);
Date_XModelItem.prototype.validateType = XModelItem.prototype.validateDate;
Date_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };




//
//	XModelItem class: "time"
//
Time_XModelItem = function(){}
XModelItemFactory.createItemType("_TIME_", "time", Time_XModelItem);
Time_XModelItem.prototype.validateType = XModelItem.prototype.validateTime;
Time_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };





//
//	XModelItem class: "datetime"
//
Datetime_XModelItem = function(){}
XModelItemFactory.createItemType("_DATETIME_", "datetime", Datetime_XModelItem);
Datetime_XModelItem.prototype.validateType = XModelItem.prototype.validateDateTime;
Datetime_XModelItem.prototype.getDefaultValue = function () {	return new Date(); };





//
//	XModelItem class: "list"
//
List_XModelItem = function(){}
XModelItemFactory.createItemType("_LIST_", "list", List_XModelItem);
List_XModelItem.prototype.getDefaultValue = function () {	return new Array(); };

// type defaults and accessors
List_XModelItem.prototype.outputType = _LIST_;	// 	_STRING_ == convert to a string
													//	_LIST_ == convert to an array
List_XModelItem.prototype.itemDelimiter = ","; 		//	delimiter for converting string values to arrays
List_XModelItem.prototype.inputDelimiter = /[\s,\r\n]+/;		//	delimiter for converting string values to arrays
List_XModelItem.prototype.listItem = {type:_UNTYPED_};

List_XModelItem.prototype.getOutputType = function () 	{	return this.outputType;			}
List_XModelItem.prototype.getItemDelimiter = function() {	return this.itemDelimiter		}
List_XModelItem.prototype.getInputDelimiter = function() {	return this.inputDelimiter		}
List_XModelItem.prototype.getListItem = function () 	{	return this.listItem;			}
List_XModelItem.prototype.getterScope = _MODELITEM_;
List_XModelItem.prototype.setterScope = _MODELITEM_;
List_XModelItem.prototype.getter = "getValue";
List_XModelItem.prototype.setter = "setValue";



//	methods
List_XModelItem.prototype.getValue =  function(ins, current, ref) {
	var value = eval("ins."+ref);
	if(value && this.getOutputType() ==_STRING_ && value instanceof Array) {
		return value.join(this.getItemDelimiter());
	} else {
		return value;
	}
}

List_XModelItem.prototype.setValue = function(val, ins, current, ref) {
	if(val && this.getOutputType() == _STRING_ && !(val instanceof Array)) {
		var value = val.split(this.getInputDelimiter());
		eval("ins."+ref+" = value");
		return value;
	} else {
        var value = eval("ins."+ref+" = val");
        return value;
	}
}

List_XModelItem.prototype.initializeItems = function () {
	var listItem = this.listItem;
	listItem.ref = listItem.id = "#";	
	this.listItem = XModelItemFactory.createItem(listItem, this, this.getModel());
	this.listItem.initializeItems();
}


List_XModelItem.prototype.validateType = function (value) {
	return value;
//XXX REWORK THIS TO USE THE listItem MODEL ITEM FOR EACH SUB-ITEM
}








//
//	XModelItem class: "enum"
//
Enum_XModelItem = function(){
    XModel.registerErrorMessage("didNotMatchChoice",	AjxMsg.didNotMatchChoice);

}
XModelItemFactory.createItemType("_ENUM_", "enum", Enum_XModelItem);
//XXXX
Enum_XModelItem.prototype.getDefaultValue = function () {	return this.getChoices()[0]; };

Enum_XModelItem.prototype.getChoices = function()		 {
    if (typeof this.choices == "function") {  //due to the i18n complexity, we have to define the choices use the function
        this.choices = this.choices.call (this) ;
    }
    return this.choices;
}
Enum_XModelItem.prototype.getSelection = function() 	{		return this.selection;		}


Enum_XModelItem.prototype.validateType = function (value) {
	// if the selection is open, they can enter any value they want
	var selectionIsOpen = this.getSelection() == _OPEN_;
	if (selectionIsOpen) return value;
	
	// selection is not open: it must be one of the supplied choices
	var choices = this.getChoices();
	for (var i = 0; i < choices.length; i++) {
		var choice = choices[i];
		if (AjxUtil.isInstance(choice, Object)) {
			if (choice.value == value) return value;
		} else {
			if (choice == value) return value;
		}
	}
	
	// if we get here, we didn't match any of the choices
	throw this.getModel().getErrorMessage("didNotMatchChoice", value);
}

//
// Model Item Class: "bool"
// Can only be used with checkbox
//
Bool_XModelItem = function(){};
XModelItemFactory.createItemType("_BOOL_", "bool", Bool_XModelItem);
Bool_XModelItem.prototype = new Enum_XModelItem();
Bool_XModelItem.prototype.choices = ["FALSE", "TRUE", null];

FileSize_XModelItem = function (){}
XModelItemFactory.createItemType("_FILE_SIZE_", "file_size", FileSize_XModelItem);
FileSize_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
FileSize_XModelItem.prototype.getterScope = _MODELITEM_;
FileSize_XModelItem.prototype.setterScope = _MODELITEM_;
FileSize_XModelItem.prototype.getter = "getValue";
FileSize_XModelItem.prototype.setter = "setValue";
FileSize_XModelItem.prototype.units = AjxUtil.SIZE_MEGABYTES;
FileSize_XModelItem.prototype.minInclusive = 0;
FileSize_XModelItem.prototype.maxInclusive = 922337203685477;
FileSize_XModelItem.prototype.maxLength = 15;

FileSize_XModelItem.prototype.getValue =  function(ins, current, ref) {
	var value = eval("ins."+ref);
	return value ? AjxUtil.formatSizeForUnits(value, AjxUtil.SIZE_KILOBYTES, false, 2) : 1;
}

FileSize_XModelItem.prototype.setValue = function(val, ins, current, ref) {
        var value = eval("ins."+ref+" = AjxUtil.parseSize(val, this.units)");
	return isNaN(value) ? 1 : value;
}

HostNameOrIp_XModelItem = function() {}
XModelItemFactory.createItemType("_HOSTNAME_OR_IP_", "hostname_or_ip", HostNameOrIp_XModelItem);
HostNameOrIp_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
HostNameOrIp_XModelItem.prototype.maxLength = 256;
HostNameOrIp_XModelItem.prototype.pattern = [
	AjxUtil.HOST_NAME_RE,
	AjxUtil.IPv4_ADDRESS_RE,
	AjxUtil.IPv6_ADDRESS_RE,
	AjxUtil.HOST_NAME_WITH_PORT_RE,
	AjxUtil.IPv4_ADDRESS_WITH_PORT_RE,
	AjxUtil.IPv6_ADDRESS_WITH_PORT_RE
];

ShortURL_XModelItem = function() {}
XModelItemFactory.createItemType("_SHORT_URL_", "short_url", ShortURL_XModelItem);
ShortURL_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
ShortURL_XModelItem.prototype.maxLength = 256;
ShortURL_XModelItem.prototype.pattern = [AjxUtil.SHORT_URL_RE,AjxUtil.IP_SHORT_URL_RE];

Port_XModelItem = function() {}
XModelItemFactory.createItemType("_PORT_", "port", Port_XModelItem);
Port_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Port_XModelItem.prototype.minInclusive = 0;
Port_XModelItem.prototype.maxInclusive = 65535;

Percent_XModelItem = function() {}
XModelItemFactory.createItemType("_PERCENT_", "percent", Percent_XModelItem);
Percent_XModelItem.prototype.validateType = XModelItem.prototype.validateNumber;
Percent_XModelItem.prototype.minInclusive = 0;
Percent_XModelItem.prototype.maxInclusive = 100;

EmailAddress_XModelItem = function() {}
XModelItemFactory.createItemType("_EMAIL_ADDRESS_", "email_address", EmailAddress_XModelItem);
EmailAddress_XModelItem.prototype.validateType = XModelItem.prototype.validateEmailAddress;
EmailAddress_XModelItem.prototype.maxLength = 256;

FullUrl_XModelItem = function() {}
XModelItemFactory.createItemType("_FULL_URL_", "full_url", FullUrl_XModelItem);
FullUrl_XModelItem.prototype.validateType = XModelItem.prototype.validateString;
FullUrl_XModelItem.prototype.maxLength = 1024;
FullUrl_XModelItem.prototype.pattern = [AjxUtil.FULL_URL_RE, AjxUtil.IP_FULL_URL_RE];
}
if (AjxPackage.define("ajax.dwt.xforms.XForm")) {
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
 * @constructor
 * @class
 * 
 * @param attributes
 * @param {XModel}	model		the model
 * @param {Object}	instance  the data instance
 * @param {DwtComposite}	dwtContainer 	the container
 * 
 * @private
 */
XForm = function(attributes, model, instance, dwtContainer, contextId) {
	if (attributes) {
		for (var prop in attributes) {
			this[prop] = attributes[prop];	
		}
	}

	// get a unique id for this form
	this.assignGlobalId(this, this.id || contextId ||  "_XForm");
	DwtComposite.call(this, dwtContainer, "DWTXForm");
	
	if (this.itemDefaults) {
		XFormItemFactory.initItemDefaults(this, this.itemDefaults);
	}

	// if they didn't pass in a model, make an empty one now
	if (model) {
		this.setModel(model);
	} else {
		this.xmodel = new XModel();
	}
	if (instance) this.setInstance(instance);

	this.__idIndex = {};
	this.__externalIdIndex = {};
	this.__itemsAreInitialized = false;
	this.tabIdOrder = [];
	this.tabGroupIDs = [];
}
XForm.prototype = new DwtComposite;
XForm.prototype.constructor = XForm;
XForm.FONT_WIDTH1 = 7;
XForm.FONT_WIDTH2 = 8;
XForm.toString = function() {	return "[Class XForm]";	}
XForm.prototype.toString = function() {	return "[XForm " + this.__id + "]";	}
XForm.prototype.getId = function () {	return this.__id;	}

/**
* A global handler for setTimeout/clearTimeout. This handler is used by onKeyPress event of all input fields.
**/
XForm.keyPressDelayHdlr = null;


/**
* FORM DEFAULTS
**/
XForm.prototype.numCols = 2;
XForm.prototype.defaultItemType = "output";
XForm.prototype._isDirty = false;
XForm._showBorder = false;		// if true, we write a border around form cells for debugging

//
//	FORM CONSTANTS
//

// generic script constants
var _IGNORE_CACHE_ = "IGNORE_CACHE";
var _UNDEFINED_;

var _UNDEFINED_;
var _ALL_ = "all";

// possible values for "labelDirection", "align" and "valign"
var _NONE_ = "none";
var _LEFT_ = "left";
var _TOP_ = "top";
var _RIGHT_ = "right";
var _BOTTOM_ = "bottom";
var _CENTER_ = "center";
var _MIDDLE_ = "middle";
var _INLINE_ = "inline";


// values for "relevantBehavior"
var _HIDE_ = "hide";
var _BLOCK_HIDE_ = "block_hide";
var _DISABLE_ = "disable";
var _SHOW_DISABLED_ = "show_disabled";
var _PARENT_ = "parent"; // used in error location as well

// values for "errorLocation"
var _SELF_ = "self";
// var _INHERIT_ = "inherit" -- this is defined in XModel.js

// values for "selection"
var _OPEN_ = "open";
var _CLOSED_ = "closed";

// possible values for "overflow"
var _HIDDEN_ = "hidden";
var _SCROLL_ = "scroll";
var _AUTO_ = "auto";
var _VISIBLE_ = "visible";

/**
* update the form with new values
*  NOTE: this will be done automatically if you do a {@link #setInstance}
* This method is costly and should not be called unless the whole form needs to be refreshed.
* When a single or several values are changed on a form - use change events.
**/
XForm.prototype.refresh = function () {
	if(this.__drawn)
		this.updateElementStates();
}


// NOTE: THE FOLLOWING CODE SHOULD BE CONVERTED TO DWT 

XForm.prototype.getGlobalRefString = function() {
	return "XFG.cacheGet('" + this.__id + "')";
}

XForm.prototype.assignGlobalId = function (object, prefix) {
	return XFG.assignUniqueId(object, prefix);
}
XForm.prototype.getUniqueId = function (prefix) {
	return XFG.getUniqueId(prefix);
}

XForm.prototype.getElement = function (id) {
	if (id == null) id = this.getId();
	var el = XFG.getEl(id);
	if (el == null) {
		DBG.println(AjxDebug.DBG2, "getElement(",id,"): no element found");
	}
	return el;
}

XForm.prototype.showElement = function (id) {
	if (id == null) id = this.getId();
	return XFG.showEl(id);
}
XForm.prototype.hideElement = function (id,isBlock) {
	if (id == null) id = this.getId();
	return XFG.hideEl(id,isBlock);
}

XForm.prototype.createElement = function (id, parentEl, tagName, contents) {
	if (id == null) id = this.getId();
	return XFG.createEl(id, parentEl, tagName, contents);
}

// NOTE: END DWT CONVERSION NEEDED 

XForm.prototype.focusElement = function (id) {
	var el = this.getElement(id);
	// if this is a div we will have problems.
	if (el != null) {
		var tagName = el.tagName;
		if (tagName != "DIV" && tagName != "TD" && tagName != "TABLE") {
			el.focus();		//MOW: el.select() ????
			this.onFocus(id);
		}
	}

    return el;
};

//set focus on the first element in the actuve tab group or in the first element in the form
XForm.prototype.focusFirst = function(currentTabId) {
	var tabIdOrder=null;
	if (currentTabId != null ) {
		tabIdOrder = this.tabIdOrder[currentTabId];
	} else {
		for(var a in this.tabIdOrder) {
			if(this.getItemById(a).getIsVisible() && this.getItemById(a).getIsEnabled() && this.tabIdOrder[a] && this.tabIdOrder[a].length > 0) {
				tabIdOrder = this.tabIdOrder[a];
				break;
			}
		}
	}	
	if(tabIdOrder) {
		var cnt = tabIdOrder.length;
		for (var i = 0; i < cnt; i++) {
			var nextItem = this.getItemById(tabIdOrder[i]);
			if(nextItem && nextItem.focusable && nextItem.getIsVisible() && nextItem.getIsEnabled()) {
				return this.focusElement(tabIdOrder[i]);
			}
		}
	}
    return null;
};

XForm.prototype.addTabGroup = function(item, tabGroupKeyAttr) {
	tabGroupKeyAttr = tabGroupKeyAttr ? tabGroupKeyAttr : "tabGroupKey";
	var tabGroupKey = item.getInheritedProperty(tabGroupKeyAttr) ? item.getInheritedProperty(tabGroupKeyAttr) : item.getId();
	this.tabGroupIDs[tabGroupKey] = item.getId();
}

XForm.prototype.focusNext = function(id, currentTabId) {
	var myId = id ? id : null;
	var tabIdOrder = null ;
	if (currentTabId != null ) {
		tabIdOrder = this.tabIdOrder[currentTabId];
	} else {
		tabIdOrder = this.tabIdOrder ;
	}
	
	if(tabIdOrder && tabIdOrder.length > 0) {
		var cnt = tabIdOrder.length;
		//DBG.println(AjxDebug.DBG1, "TabIdOrder: length = " + tabIdOrder.length + "<br />" + tabIdOrder.toString());
		if (myId != null) {
			for (var i = 0; i < cnt; i++) {
				if(tabIdOrder[i] == myId) {
					var elIndex = ((i+1) % cnt);
					if(tabIdOrder[elIndex]) {
						var nextEl = this.getItemById(tabIdOrder[elIndex]);
						if(nextEl.focusable && nextEl.getIsVisible() && nextEl.getIsEnabled()) {
							return this.focusElement(tabIdOrder[elIndex]);
						} else {
							myId=tabIdOrder[elIndex];
						}
					} 
				}
			}
		}		
		return this.focusFirst(currentTabId);
	}
    return null;
};

XForm.prototype.focusPrevious = function(id, currentTabId) {
	var myId = id ? id : null;
	var tabIdOrder = null ;
	if (currentTabId != null ) {
		tabIdOrder = this.tabIdOrder[currentTabId];
	} else {
		tabIdOrder = this.tabIdOrder ;
	}
	
	if(tabIdOrder && tabIdOrder.length > 0) {
		var cnt = tabIdOrder.length-1;
		if (myId != null) {
			for (var i = cnt; i >= 0; i--) {
				if(tabIdOrder[i] == myId) {
					var elIndex = ((i-1) % cnt);
					if(tabIdOrder[elIndex]) {
						var nextEl = this.getItemById(tabIdOrder[elIndex]);
						if(nextEl.focusable && nextEl.getIsVisible()  && nextEl.getIsEnabled()) {
							return this.focusElement(tabIdOrder[elIndex]);
						} else {
							myId=tabIdOrder[elIndex];
						}
					} 
				}
			}
		}		
		return this.focusFirst(currentTabId);
	}
    return null;
};

XForm.prototype.getModel = function () {
	return this.xmodel;
}
XForm.prototype.setModel = function (model) {
	this.xmodel = model;
}

XForm.prototype.getInstance = function () {
	return this.instance;
}

XForm.prototype.updateElementStates = function () {
	if(!this.__drawn)
		return;
		
	this.items[0].updateVisibility();
	this.items[0].updateEnabledDisabled();
	this.items[0].updateElement();
}

XForm.prototype.setInstance = function(instance) {
	this.setIsDirty(false);
	this.clearErrors();
	this.instance = instance;
	if(this.__drawn)
		this.updateElementStates();
	else
		this.__updateStatesDelayed = true;
		
	if (this.__drawn) {
		this.notifyListeners(DwtEvent.XFORMS_INSTANCE_CHANGED, new DwtXFormsEvent(this));
	}
}

XForm.prototype.getInstance = function() {
	return this.instance;
}

XForm.prototype.setInstanceValue = function(val, refPath) {
	this.xmodel.setInstanceValue(this.instance,refPath,val);
}

XForm.prototype.getInstanceValue = function(refPath) {
	return this.xmodel.getInstanceValue(this.instance,refPath);
}

XForm.checkInstanceValue = function(refPath,val) {
	return (this.getInstanceValue(refPath) == val);
}

XForm.checkInstanceValueNot = function(refPath,val) {
	return (this.getInstanceValue(refPath) != val);
}

XForm.checkInstanceValueEmty = function(refPath) {
	return AjxUtil.isEmpty(this.getInstanceValue(refPath));
}

XForm.checkInstanceValueNotEmty = function(refPath) {
	return !AjxUtil.isEmpty(this.getInstanceValue(refPath));
}

XForm.prototype.getController = function () {
	return this.controller;
}
XForm.prototype.setController = function(controller) {
	this.controller = controller;
}




XForm.prototype.getIsDirty = function () {
	return this._isDirty;
}
XForm.prototype.setIsDirty = function(dirty, item) {
	this._isDirty = (dirty == true);
	//pass the current dirty XFORM item, so the event object can has the information which item is changed
	if (typeof item == "undefined") item = null ; //to make it compatible with the previous version. 
	this.notifyListeners(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new DwtXFormsEvent(this, item, this._isDirty));
}






XForm.prototype.initializeItems = function() {
	// tell the model to initialize all its items first
	//	(its smart enough to only do this once)
	this.xmodel.initializeItems();

	if (this.__itemsAreInitialized) return;
	
	// create a group for the outside parameters and initialize that
	// XXX SKIP THIS IF THERE IS ONLY ONE ITEM AND IT IS ALREADY A GROUP, SWITCH OR REPEAT???
	var outerGroup = {
		id:"__outer_group__",
		type:_GROUP_,
		useParentTable:false,

		numCols:this.numCols,
		colSizes:this.colSizes,
		items:this.items,
		tableCssClass:this.tableCssClass,
		tableCssStyle:this.tableCssStyle
	}
	this.items = this.initItemList([outerGroup]);
	
	this.__itemsAreInitialized = true;
}


XForm.prototype.initItemList = function(itemAttrs, parentItem) {
	var items = [];
	for (var i = 0; i < itemAttrs.length; i++) {
		var attr = itemAttrs[i];
		if (attr != null) {
			items.push(this.initItem(attr, parentItem));
		}
	}
	this.__nestedItemCount += itemAttrs.length;		//DEBUG
	return items;
}


XForm.prototype.initItem = function(itemAttr, parentItem) {
	// if we already have a form item, assume it's been initialized already!
	if (itemAttr._isXFormItem) return itemAttr;
	
	// create the XFormItem subclass from the item attributes passed in
	//	(also links to the model)
	var item = XFormItemFactory.createItem(itemAttr, parentItem, this);
	
	// have the item initialize it's sub-items, if necessary (may be recursive)
	item.initializeItems();
	return item;
}


// add an item to our index, so we can find it easily later
XForm.prototype.indexItem = function(item, id) {
	//DBG.println("id: "+id);
	this.__idIndex[id] = item;
	
	// Add the item to an existing array, or
	var exId = item.getExternalId();
	if (exId == null || exId == "") return;

	var arr = this.__externalIdIndex[exId];
	if (arr != null) {
		arr.push(item);
	} else {
		arr = [item];
	}
	this.__externalIdIndex[exId] = arr;
}
// refPath is ignored
// This is probably not useful to an Xforms client --
// use getItemsById instead.
XForm.prototype.getItemById = function(id) {
	if (id._isXFormItem) return id;
	return this.__idIndex[id];
}

// This is a method that can be called by an XForms client, but
// which doesn't have much internal use.
// gets an item by the id or the ref provided in the declaration
// This method returns an array, or null;
XForm.prototype.getItemsById = function (id) {
	return this.__externalIdIndex[id];
};

XForm.prototype.get = function(path) {
	if (path == null) return null;
	if (path._isXFormItem) path = path.getRefPath();
	return this.xmodel.getInstanceValue(this.instance, path);
}


XForm.prototype.isDrawn = function () {
	return (this.__drawn == true);
}

/**
 * EMC 7/12/2005: I didn't want the extra div that DwtControl writes,
 * since the xforms engine already has an outer div that we can use as 
 * container.
 */
XForm.prototype._replaceDwtContainer = function () {
	var myDiv = document.getElementById(this.__id);
	var dwtContainer = this.getHtmlElement();
	if (dwtContainer.parentNode) dwtContainer.parentNode.replaceChild(myDiv, dwtContainer);
	this._htmlElId = this.__id;
};

/**
* actually draw the form in the parentElement
* @param parentElement
* calls outputForm to generate all the form's HTML
**/
XForm.prototype.draw = function (parentElement) {
	this.initializeItems();
	
	// get the HTML output
	var formOutput = this.outputForm();
	
	if (parentElement == null) parentElement = this.getHtmlElement();
	// if a parentElement was passed, stick the HTML in there and call the scripts
	//	if not, you'll have call put HTML somewhere and call the scripts yourself
	if (parentElement) {
		parentElement.innerHTML = formOutput;
	}
	
	// notify any listeners that we're "ready"
	this.notifyListeners(DwtEvent.XFORMS_READY, new DwtXFormsEvent(this));
	
	// remember that we've been drawn
	this.__drawn = true;
	// and we're done!
	
	if(this.__updateStatesDelayed && this.instance) {
		this.updateElementStates();
		this.__updateStatesDelayed = false;
	}	
}


XForm.prototype.getItems = function () {
	return this.items;
}

/**
* Prints out the form HTML
* calls outputItemList
**/
XForm.prototype.outputForm = function () {
	var t0 = new Date().getTime();
	
	var html = new AjxBuffer();			// holds the HTML output
	var items = this.getItems();

	
	html.append('<div id="', this.__id, '"', 'style="height: 100%;"',
				(this.cssClass != null && this.cssClass != '' ? ' class="' + this.cssClass + '"' : ""),
				(this.cssStyle != null && this.cssStyle != '' ? ' style="' + this.cssStyle + ';"' : ""),
				'>'
				);
	
	this._itemsToInsert = {};
	this._itemsToCleanup = [];

	
	DBG.timePt("starting outputItemList");
	// in initializeItems(), we guaranteed that there was a single outer item
	//	and that it is a group that sets certain properties that can be set at
	//	the form level.  Just output that (and it will output all children)

	// output the actual items of the form
	this.outputItemList(items[0].items, items[0], html, this.numCols);
	DBG.timePt("finished outputItemList");
	html.append("</div id=\"", this.__id,"\">");

	// save the HTML in this.__html (for debugging and such)
	this.__HTMLOutput = html.toString();

	//DBG.println("outputForm() took " + (new Date().getTime() - t0) + " msec");

	return this.__HTMLOutput;
}

XForm.prototype.getOutstandingRowSpanCols = function (parentItem) {
	if (parentItem == null) return 0;
	var outstandingRowSpanCols = 0;
	var previousRowSpans = parentItem.__rowSpanItems;
	if (previousRowSpans) {
/*
		for (var i = 0; i < previousRowSpans.length; i++) {
			var previousItem = previousRowSpans[i];
			//DBG.println("outputing ", previousItem.__numDrawnCols," rowSpan columns for ", previousItem);
			outstandingRowSpanCols += previousItem.__numDrawnCols;

			previousItem.__numOutstandingRows -= 1;
			if ( previousItem.__numOutstandingRows == 0) {
				if (previousRowSpans.length == 1) {
					delete parentItem.__rowSpanItems;
				} else {
					parentItem.__rowSpanItems = [].concat(previousRowSpans.slice(0,i), previousRowSpans.slice(i+1));
				}
			}
		}
*/
		for (var i = previousRowSpans.length-1; i >= 0; i--) {
			var previousItem = previousRowSpans[i];
			//DBG.println("outputing ", previousItem.__numDrawnCols," rowSpan columns for ", previousItem);
			previousItem.__numOutstandingRows -= 1;
			if ( previousItem.__numOutstandingRows == 0) {
				if (previousRowSpans.length == 1) {
					delete parentItem.__rowSpanItems;
				} else {
					parentItem.__rowSpanItems.pop();
				}
			} else {
				outstandingRowSpanCols += previousItem.__numDrawnCols;			
			}
		}

	}
	return outstandingRowSpanCols;
}

/**
* This method will iterate through all the items (XFormItem) in the form and call outputMethod on each of them.
* @param items
* @param parentItem
* @param html
* @param numCols
* @param currentCol
* @param skipTable
**/
XForm.prototype.outputItemList = function (items, parentItem, html,  numCols, currentCol, skipTable, skipOuter) {
	if (parentItem.outputHTMLStart) {
		parentItem.outputHTMLStart(html, currentCol);
	}
	var drawTable = (parentItem.getUseParentTable() == false && skipTable != true);
	var outerStyle = null;
	if(!skipOuter) {
		outerStyle = parentItem.getCssString();
		if (outerStyle != null && outerStyle != "") {
			parentItem.outputElementDivStart(html);
		}
	}

	if (drawTable) {
		var colSizes = parentItem.getColSizes();

		//XXX MOW: appending an elementDiv around the container if we need to style it
		var cellspacing = parentItem.getInheritedProperty("cellspacing");
		var cellpadding = parentItem.getInheritedProperty("cellpadding");
        var border = parentItem.getInheritedProperty("border");
        if (border == 0 && XForm._showBorder) {
            border = 1;
        }
		html.append("<table cellspacing=",cellspacing," cellpadding=",cellpadding,
				 "  border=" , border,
				" id=\"", parentItem.getId(),"_table\" ", parentItem.getTableCssString(),">");
		if (colSizes != null) {
			html.append( " <colgroup>");
			for (var i = 0; i < colSizes.length; i++) {
				var size = colSizes[i];
				if(!isNaN(size)) {
					if (size < 1) 
						size = size * 100 + "%";
				}
				html.append( "<col width='", size, "'>");
			}
			html.append( "</colgroup>");
		}
		html.append( "<tbody>");
	}

	numCols = Math.max(1, numCols);
	if (currentCol == null) currentCol = 0;
	//DBG.println("outputItemList: numCols:",numCols, " currentCol:", currentCol);


	for (var itemNum = 0; itemNum < items.length; itemNum++) {
		var item = items[itemNum];
		var isNestingItem = (item.getItems() != null);
		var itemUsesParentTable = (item.getUseParentTable() != false);
		
		item.__numDrawnCols = 0;

		// write the beginning of the update script
		//	(one of the routines below may want to modify it)
		
		var label = item.getLabel();
		var labelLocation = item.getLabelLocation();
		var showLabel = (label != null && (labelLocation == _LEFT_ || labelLocation == _RIGHT_));

		var colSpan = item.getColSpan();
		if (colSpan == "*") colSpan = Math.max(1, (numCols - currentCol));
		var rowSpan = item.getRowSpan();

		var totalItemCols = item.__numDrawnCols = parseInt(colSpan) + (showLabel ? 1 : 0);
		if (rowSpan > 1 && parentItem) {
			if (parentItem.__rowSpanItems == null) parentItem.__rowSpanItems  = [];
			parentItem.__rowSpanItems.push(item);
			item.__numOutstandingRows = rowSpan;
		}
		//DBG.println("rowSpan = " + rowSpan);
		if(currentCol==0)
			html.append( "<tr>");
		
		// write the label to the left if desired
		if (label != null && labelLocation == _LEFT_) {
			//DBG.println("writing label");
			item.outputLabelCellHTML(html, rowSpan, labelLocation);
		}

		var writeElementDiv = item.getWriteElementDiv();
		var outputMethod = item.getOutputHTMLMethod();
		if (isNestingItem && itemUsesParentTable) {
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html, currentCol);

		} else {

			// write the cell that contains the item 
			//	NOTE: this is currently also the container!
			item.outputContainerTDStartHTML(html,  colSpan, rowSpan);
	
			// begin the element div, if required
			if (writeElementDiv) 	item.outputElementDivStart(html);
			
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html, 0);

	
			// end the element div, if required
			if (writeElementDiv) 	item.outputElementDivEnd(html);
			
	
			// end the cell that contains the item
			item.outputContainerTDEndHTML(html);

		}

		currentCol += totalItemCols;

		// write the label to the right, if desired
		if (label != null && labelLocation == _RIGHT_) {
			//DBG.println("writing label");
			item.outputLabelCellHTML(html, rowSpan);
		}
		
		// now end the update script if necessary

		if ( currentCol >= numCols) {
			html.append( "</tr>");
			currentCol = this.getOutstandingRowSpanCols(parentItem);
			//DBG.println("creating new row:  currentCol is now ", currentCol, (currentCol > 0 ? " due to outstanding rowSpans" : ""));
		}

		// if the number of outstanding rows is the same as the number of columns we're to generate
		//	output an empty row for each
		while (currentCol >= numCols) {
			//DBG.println("outputting empty row because outstandingRowSpanCols >= numCols");
			html.append("</tr id='numCols'>");//\r<tr  id='numCols'>");
			currentCol = this.getOutstandingRowSpanCols(parentItem);
		}
		
		if(parentItem)
			parentItem.registerActiveChild(item);
			
		item.signUpForEvents();

	}
	
	
	if (drawTable) {
		html.append("</tbody></table>");
	}

	if (outerStyle != null && outerStyle != "") {
		parentItem.outputElementDivEnd(html);
	}


	if (parentItem.outputHTMLEnd) {
		parentItem.outputHTMLEnd(html, currentCol);
	}

}






//
//	NOTE: properties of individual items moved to XForm_item_properties.js
//


// CHANGE HANDLING


XForm.prototype.onFocus = function(id) {
	this.__focusObject = id;
}

XForm.prototype.onBlur = function(id) {
	this.__focusObject = null;
}

XForm.prototype.subItemChanged = function (id, value, event, quite) {
	//console.log("XForm.prototype.itemChanged start (" + id +","+value+","+event+")");
	var item = this.getItemById(id);
	if (item == null) return alert("Couldn't get item for " + id);	// EXCEPTION
	
	// tell the item that it's display is dirty so it might have to update
	item.dirtyDisplay();

	// validate value
	var modelItem = item.getSubModelItem();
	var errorCorrected = false;
	if (modelItem != null) {
		try {
			value = modelItem.validate(value, this, item, this.getInstance());
			if(item.hasError()) {
				errorCorrected = true;
			}
			item.clearError();
		}
		catch (message) {
			item.setError(message);
			var event = new DwtXFormsEvent(this, item, value);
			this.notifyListeners(DwtEvent.XFORMS_VALUE_ERROR, event);
			return;
		}
	}

	// if there is an onChange handler, call that
	var onChangeMethod = item.cacheInheritedMethod("onSubChange","$onSubChange","value,event,form");

	if (typeof onChangeMethod == "function") {
//		DBG.println("itemChanged(", item.ref, ").onChange = ", onChangeMethod);
		value = onChangeMethod.call(item, value, event, this);
	} else {
		var oldVal = item.getInstanceValue(item.getInheritedProperty("subRef"));
		if(oldVal == value) {
			if(errorCorrected && !quite) 
				this.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
				
			return;
		}	
		item.setInstanceValue(value, item.getSubRefPath());
	}
	
	var event = new DwtXFormsEvent(this, item, value);
	if(!quite)
		this.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);

	this.setIsDirty(true, item);
	//console.log("XForm.prototype.itemChanged end (" + id +","+value+","+event+")");
}

XForm.prototype.itemChanged = function (id, value, event, quite) {
	//console.log("XForm.prototype.itemChanged start (" + id +","+value+","+event+")");
	var item = this.getItemById(id);
	if (item == null) return alert("Couldn't get item for " + id);	// EXCEPTION
	
	// tell the item that it's display is dirty so it might have to update
	item.dirtyDisplay();

	// validate value
	var modelItem = item.getModelItem();
	var errorCorrected = false;
	if (modelItem != null) {
		try {
			value = modelItem.validate(value, this, item, this.getInstance());
			if(item.hasError()) {
				errorCorrected = true;
			}
			item.clearError();
		}
		catch (message) {
			item.setError(message);
			var event = new DwtXFormsEvent(this, item, value);
			this.notifyListeners(DwtEvent.XFORMS_VALUE_ERROR, event);
			return;
		}
	}

	// if there is an onChange handler, call that
	var onChangeMethod = item.getOnChangeMethod();

	if (typeof onChangeMethod == "function") {
//		DBG.println("itemChanged(", item.ref, ").onChange = ", onChangeMethod);
		value = onChangeMethod.call(item, value, event, this);
	} else {
		var oldVal = item.getInstanceValue();
		if(oldVal == value) {
			if(errorCorrected && !quite) 
				this.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
				
			return;
		}	
		item.setInstanceValue(value);
	}
	
	var event = new DwtXFormsEvent(this, item, value);
	if(!quite)
		this.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);

	this.setIsDirty(true, item);
	//console.log("XForm.prototype.itemChanged end (" + id +","+value+","+event+")");
}


XForm.prototype.getItemsInErrorState = function () {
	if (this.__itemsInErrorState == null) {
		this.__itemsInErrorState = new Object();
		this.__itemsInErrorState.size = 0;
	}
	return this.__itemsInErrorState;
};

XForm.prototype.addErrorItem = function ( item ) {
	var errs = this.getItemsInErrorState();
	var oldItem = 	errs[item.getId()];
	errs[item.getId()] = item;
	if (oldItem == null){
		errs.size++;
	}
};

XForm.prototype.removeErrorItem = function ( item ) {
	if (item != null) {
		var errs = this.getItemsInErrorState();
		var id = item.getId();
		var oldItem = errs[id];
		if (oldItem != null) {
			delete errs[id];
			errs.size--;
		}
	}
};

XForm.prototype.hasErrors = function () {
	var errs = this.getItemsInErrorState();
	return (errs != null && errs.size > 0);
};

XForm.prototype.clearErrors = function () {
	var errs = this.getItemsInErrorState();
	if (errs.size > 0) {
		var k;
		for (k in errs) {
			if (k == 'size') continue;
			errs[k].clearError();
			delete errs[k];
		}
		errs.size = 0;
	}
}

XForm.prototype.onCloseForm = function () {
	if (this.__focusObject != null) {
		var item = this.getItemById(this.__focusObject);
		var element = item.getElement();

//alert("onCloseForm() not implemented");
//		this.itemChanged(this.__focusObject, VALUE???)
		if (element && element.blur) {
			element.blur();
		}
		this.__focusObject = null;
	}
}

//Hack: to fix the cursor on input field not shown in FF
//see https://bugzilla.mozilla.org/show_bug.cgi?id=167801#c58
XForm.prototype.releaseFocus = function () {
	if (this.__focusObject != null) {
		var item = this.getItemById(this.__focusObject);
		var element = item.getElement();

		if (element && element.blur) {
			element.blur();
		}
		this.__focusObject = null;
	}
}



/** @private */
XForm.prototype._reparentDwtObject = function (dwtObj, newParent) {
	var dwtE = dwtObj.getHtmlElement();
	if (dwtE.parentNode) dwtE.parentNode.removeChild(dwtE);
	newParent.appendChild(dwtE);
}

XForm.prototype.shouldInsertItem = function (item) {
	return (this._itemsToInsert[item.getId()] != null)
}

XForm.prototype.insertExternalWidget = function (item) {
	DBG.println("insertExternalWidget(): inserting ref=", item.ref,"  type=", item.type, " id=", item.getId());
			 
	var insertMethod = item.getInsertMethod();

	var widget = item.getWidget();
	if (widget && widget.insertIntoXForm instanceof Function) {
		widget.insertIntoXForm(this, item, item.getElement());
		
	} else if (typeof this[insertMethod] == "function") {
		this[insertMethod](item, item.getElement());
		
	} else {
		DBG.println("insertExternalWidget(): don't know how to insert item ", item.ref,"  type=", item.type);
	}

	// take the item out of the list to insert so we don't insert it more than once
	delete this._itemsToInsert[item.getId()];
}
}
if (AjxPackage.define("ajax.dwt.xforms.XFormItem")) {
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


//
//	Factory to create XFormItems from simple attributes (eg: from JS object literals or XML)
//

/**
 * This object is never instantiated.
 * @class
 * @private 
 */
XFormItemFactory = function() {}

/**
 * Creates a form item.
 *
 * @param attributes		an object whose properties map to component attribute name/value pairs
 * @param parentItem 		the parent item of this item
 * @param {XForm}	xform      the form to which this item is being created
 * 
 * @private
 */
XFormItemFactory.createItem = function (attributes, parentItem, xform) {
	// assign a modelItem to the item
	var refPath = this.getRefPath(attributes, parentItem);
	var subRefPath = this.getSubRefPath(attributes, parentItem);

	var modelItem, subModelItem;
	if (refPath != null) {
		// assign a modelItem to the item
		modelItem = this.getModelItem(xform.xmodel, attributes, refPath);
	}
	
	if (subRefPath != null) {
		// assign a modelItem to the item
		subModelItem = this.getModelItem(xform.xmodel, attributes, subRefPath);
	}
	// get the class for that type and create one
	var type = this.getItemType(attributes, modelItem);
	var constructor = this.getItemTypeConstructor(type, xform);

	var item = new constructor();
	item._setAttributes(attributes);

	// get a unique id for the item
	var idPrefix = (	attributes.id ? xform.getId() + "_" + attributes.id :
							  refPath ? xform.getId() + "_" + refPath :
					item.__parentItem ? item.__parentItem.getId() :
										xform.getId() + "_" + item.type
					);
	// assign a unique id to each item
	//	(if the item specifies an id, we use a variant of that, just in case there's more than one)
	item.id = xform.getUniqueId(idPrefix);

	item.refPath = refPath;
	item.subRefPath = subRefPath;
	item.__modelItem = modelItem;
	item.__subModelItem = subModelItem;
	
	item.__xform = xform;
	item.__parentItem = parentItem;
	
	// assign the item into our form's index so we can be found later
	xform.indexItem(item, item.id);
	

	// tell the item to initialize any special properties it needs to on construction
	item.initFormItem();
	
		
	return item;
} 

XFormItemFactory.getRefPath = function (attributes, parentItem) {
	if (attributes.refPath) return attributes.refPath;
	
	var ref = attributes.ref;
	if (ref == null) return null;
	
	if (parentItem) {
		var parentPath = parentItem.getRefPath();
		if (parentPath == null) parentPath = "";
	} else {
		var parentPath = "";
	}
	
	var path = ref;
	if (ref == ".") {
		path = parentPath;

	} else if (ref == "..") {
		parentPath = parentPath.split("/");
		path = parentPath.slice(0, parentPath.length - 1).join("/");

	} else if (parentPath == "") {
		path = ref;

	} else {
		path = parentPath + "/" + ref;
	}
	return path;
}

XFormItemFactory.getSubRefPath = function (attributes, parentItem) {
	if (attributes.subRefPath) return attributes.subRefPath;
	
	var subRref = attributes.subRef;
	if (subRref == null) return null;
	
	if (parentItem) {
		var parentPath = parentItem.getSubRefPath();
		if (parentPath == null) parentPath = "";
	} else {
		var parentPath = "";
	}
	
	var path = subRref;
	if (subRref == ".") {
		path = parentPath;

	} else if (subRref == "..") {
		parentPath = parentPath.split("/");
		path = parentPath.slice(0, parentPath.length - 1).join("/");

	} else if (parentPath == "") {
		path = subRref;

	} else {
		path = parentPath + "/" + subRref;
	}
	return path;
}

XFormItemFactory.getModelItem = function (xmodel, attributes, refPath) {
	if (refPath == null || refPath == "") return null;
	return xmodel.getItem(refPath, true);
}

XFormItemFactory.getItemType = function (attributes, modelItem) {
	var type = attributes.type;

	if (type == null) {
		type = attributes.type = _OUTPUT_;
	}
	
	var modelType = (modelItem && modelItem.type ? modelItem.type : _STRING_);

	if (type == _INPUT_) {
		if (attributes.value !== _UNDEFINED_) {
			type = _CHECKBOX_;
		} else {
			switch (modelType) {
				case _STRING_:
				case _NUMBER_:
					type = _INPUT_;
					break;

				case _DATE_:
				case _DATETIME_:
				case _TIME_:
					type = modelType;			
					break;

				default:
					type = _INPUT_;
			}
		}
	} else if (type == _SELECT_) {
		var appearance = attributes.appearance;
		if (appearance == _RADIO_) {
			type = _RADIO_;
		} else {
			type = _SELECT_;
		}
	}
	return type;
}

XFormItemFactory.typeConstructorMap = {};

XFormItemFactory.createItemType = 
function (typeConstant, typeName, constructor, superClassConstructor) {
	if (constructor == null) constructor = new Function();
	if (typeof superClassConstructor == "string") superClassConstructor = this.getItemTypeConstructor(superClassConstructor);
	if (superClassConstructor == null) superClassConstructor = XFormItem;

	// initialize the constructor
	constructor.prototype = new superClassConstructor();	

	constructor.prototype.type = typeName;
	constructor.prototype.constructor = constructor;
	constructor.prototype.toString = new Function("return '[XFormItem:" + typeName + " ' + this.getId() + ']'");
	constructor.toString = new Function("return '[Class XFormItem:" + typeName + "]'");
	
	// put the item type into the typemap
	this.registerItemType(typeConstant, typeName, constructor);
	
	// return the prototype
	return constructor;
}

XFormItemFactory.registerItemType = 
function(typeConstant, typeName, constructor) {
	// assign the type constant to the window so everyone else can use it
	window[typeConstant] = typeName;
	this.typeConstructorMap[typeName] = constructor;	
}

XFormItemFactory.defaultItemType = "output";
XFormItemFactory.getItemTypeConstructor = 
function (typeName, form) {
	var typeConstructorMap = (form && form.typeConstructorMap ? form.typeConstructorMap : this.typeConstructorMap);
	
	var typeConstructor = typeConstructorMap[typeName];
	if (typeConstructor == null) {
		var defaultItemType = (form ? form.defaultItemType : this.defaultItemType);
		typeConstructorMap[defaultItemType];
	}
	return typeConstructor;
}

XFormItemFactory.quickClone = 
function(object) {
	this.cloner.prototype = object;
	return new this.cloner();
}
XFormItemFactory.cloner = function(){}

XFormItemFactory.initItemDefaults = function(form, itemDefaults) {
	// create a clone of the XFormItemFactory typeConstructorMap for the form
	form.typeConstructorMap =  this.quickClone(this.typeConstructorMap);

	if (itemDefaults == null) itemDefaults = form.itemDefaults;
	if (itemDefaults != null) {
		// for each type in itemDefaults
		for (var type in itemDefaults) {
			var originalConstructor = this.typeConstructorMap[type];
			var defaults = itemDefaults[type];

			if (originalConstructor == null) {
				type = window[type];
				originalConstructor = this.typeConstructorMap[type];
			}
			if (originalConstructor == null) {
				continue;
			}
			var newConstructor = form.typeConstructorMap[type] = new Function();
			newConstructor.prototype = new originalConstructor();
			// NOTE: reassigning the constructor here is technically correct,
			//		but will result in (item.constructor == originalClass.constructor) not working...
			newConstructor.prototype.constructor = newConstructor;
			
			for (var prop in defaults) {
				newConstructor.prototype[prop] = defaults[prop];
			}
		}
	}
}




//
//	Abstract Class XFormItem
//
//	All other form item classes inherit from this.
//


/**
 * @private
 */
XFormItem = function() {}
XFormItem.prototype.constructor = XFormItem;
XFormItemFactory.registerItemType("_FORM_ITEM_", "form_item", XFormItem);

XFormItem.ERROR_STATE_ERROR = 0;
XFormItem.ERROR_STATE_VALID = 1;


//
// set base class defaults
// 

XFormItem.prototype._isXFormItem = true;

// outputting and inserting
XFormItem.prototype.writeElementDiv = false;

// appearance
XFormItem.prototype.labelLocation = _LEFT_;
XFormItem.prototype.tableCssClass = "xform_table";				// table that encloses one or more cells
XFormItem.prototype.tableCssStyle = null;						// table that encloses one or more cells
XFormItem.prototype.containerCssClass =  "xform_container";		// td that contains the element
XFormItem.prototype.containerCssStyle =  null;					// td that contains the element
XFormItem.prototype.cssClass = null;							// element itself (or element div)
XFormItem.prototype.labelCssClass =  "xform_label";				// label td
XFormItem.prototype.errorCssClass =  "xform_error";				// error DIV
XFormItem.prototype.nowrap = false; 
XFormItem.prototype.labelWrap = false; 
XFormItem.prototype.align = _UNDEFINED_;						// _UNDEFINED_ because it's a bit faster to draw
XFormItem.prototype.valign = _UNDEFINED_;						// _UNDEFINED_ because it's a bit faster to draw
XFormItem.prototype.focusable = false;
XFormItem.prototype.bmolsnr = false; //Be My Own Listener
// updating
XFormItem.prototype.forceUpdate = false;			// SET TO true TO FORCE AN ITEM TO UPDATE, EVEN IF VALUE HAS NOT CHANGED
//XFormItem.prototype.relevant;
//XFormItem.prototype.relevantIfEmpty = true;
//XFormItem.prototype.relevantBehavior = _HIDE_;		//	_HIDE_, _DISABLE_
XFormItem.prototype.isBlockElement = false;
XFormItem.prototype.visibilityChecks = []; //array of method references that check whether this element should be visible
XFormItem.prototype.enableDisableChecks = []; //array of methods that check whether this element should be enabled 
XFormItem.prototype.visibilityChangeEventSources = []; //paths to XModelItems that influence visibility of this XFormItem
XFormItem.prototype.enableDisableChangeEventSources = []; //paths to XModelItems that influence Enabled/Disabled state of this XFormItem
XFormItem.prototype.valueChangeEventSources = []; //paths to XModelItems that influence the value this XFormItem

/* array of references to XModel items that may affect the visibility of this item. 
* Whenever any of the XModel items referenced in this array change, they will notify this XForm item
*/
XFormItem.prototype.visibilityUpdaters = [];

/* array of references to XModel items that may affect whether this item is enabled. 
* Whenever any of the XModel items referenced in this array change, they will notify this XForm item
*/
XFormItem.prototype.enabledDisabledUpdaters = [];

// changing/saving
XFormItem.prototype.elementChangeHandler = "onchange";

                              
// choices map
XFormItem.prototype.selection = _CLOSED_;
XFormItem.prototype.openSelectionLabel = "";

// error handling
XFormItem.prototype.errorLocation = _SELF_;

// show help tooltip icon
XFormItem.prototype.helpTooltip = false;
//
// Methods
//


// set the initializing attributes of this firm
XFormItem.prototype._setAttributes = function (attributes) {
	this.__attributes = attributes;
}

// override this to do any item initialization you need to do
//	NOTE: this is called AFTER the formItem is initiaized with its modelItem, set in its form, etc
XFormItem.prototype.initFormItem = function() {
//	window.status = '';
	if(this.focusable) {
		var currentTabId = XFormItem.getParentTabGroupId(this);
		if(currentTabId) {
			var tabGroupItem = this.getForm().getItemById(currentTabId);
			tabGroupItem.tabIdOrder.push(this.getId());
		}
	}
}	

// DEFAULT IMPLEMENTATION calls this.getForm().initItemList() on our items array
//	SOME CLASSES MAY NOT WANT TO DO THIS (eg: _REPEAT_, which does this dynamically later)
XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items != null) {
		this.items = this.getForm().initItemList(items, this);
	}
}

XFormItem.prototype.registerActiveChild = function(item) {
	if(!this.activeChildren)
		this.activeChildren = {};
	this.activeChildren[item.getId()]=true;	
}

XFormItem.prototype.signUpForEvents = function () {
	var modelItem;
	modelItem = this.getModelItem();

	//register this item's listeners with model items
	var itemsVisibilityChangers = this.getInheritedProperty("visibilityChangeEventSources");
	if(!AjxUtil.isEmpty(itemsVisibilityChangers)) {
		var model = this.getModel();
		var cnt = itemsVisibilityChangers.length;
		if(model && cnt>0) {
			for (var i=0; i < cnt; i++) {
				var modelItm = model.getItem(itemsVisibilityChangers[i], false);
				if(modelItm) {
					var lsnr = new AjxListener(this, XFormItem.prototype.updateVisibilityLsnr);
					modelItm.addListener(DwtEvent.XFORMS_VALUE_CHANGED, lsnr);
				}
			}
		}
	}
	
	var itemsEnableDisableChangers = this.getInheritedProperty("enableDisableChangeEventSources");
	if(!AjxUtil.isEmpty(itemsEnableDisableChangers)) {
		var model = this.getModel();
		var cnt = itemsEnableDisableChangers.length;
		if(model && cnt>0) {
			for (var i=0; i < cnt; i++) {
				var modelItm = model.getItem(itemsEnableDisableChangers[i], false);
				if(modelItm) {
					var lsnr = new AjxListener(this, XFormItem.prototype.updateEnabledDisabledLsnr);
					modelItm.addListener(DwtEvent.XFORMS_VALUE_CHANGED, lsnr);
				}
			}
		}
	}	
	
	var itemsValueChangers = this.getInheritedProperty("valueChangeEventSources");
	if(!AjxUtil.isEmpty(itemsValueChangers)) {
		var model = this.getModel();
		var cnt = itemsValueChangers.length;
		if(model && cnt>0) {
			for (var i=0; i < cnt; i++) {
				var modelItm = model.getItem(itemsValueChangers[i], false);
				if(modelItm) {
					var lsnr = new AjxListener(this, XFormItem.prototype.valueChangeLsnr);
					modelItm.addListener(DwtEvent.XFORMS_VALUE_CHANGED, lsnr);
				}
			}
		}
	}
	
	//listen to changes of my own model item
	var bmolsnr = this.getInheritedProperty("bmolsnr");
	if(modelItem && bmolsnr) {
		var lsnr = new AjxListener(this, XFormItem.prototype.valueChangeLsnr);
		modelItem.addListener(DwtEvent.XFORMS_VALUE_CHANGED, lsnr);
	}
}

XFormItem.prototype.valueChangeLsnr = function (event) {
	var updateMethod = this.getUpdateElementMethod();
	if(!updateMethod)
		return;
		
	var value = this.getInstanceValue();	
	var getDisplayValueMethod = this.getDisplayValueMethod();
	if(getDisplayValueMethod)
		value = getDisplayValueMethod.call(this,value);
	
	updateMethod.call(this, value);
}

XFormItem.prototype.updateElement = function() {
	//run update methods on all initialized children
	if(!this.activeChildren)
		return;
		
	for(var itemId in this.activeChildren) {
		if(this.activeChildren[itemId]===true) {
			var item = this.getForm().getItemById(itemId);
			if(item && this.getInstance()) {
				var updateMethod = item.getUpdateElementMethod();
				var getDisplayValueMethod = item.getDisplayValueMethod();
				
				if(updateMethod) {
					var xmodel = this.getModel();
					var value = item.getRefPath() ? xmodel.getInstanceValue(this.getInstance(), item.getRefPath()) : item.getValue();
					if (getDisplayValueMethod) {
						value =  getDisplayValueMethod.call(item,value);
					}
					updateMethod.call(item,value);
				}
			}
		}
	}
}

XFormItem.prototype.hasReadPermission = function (refToCheck) {
	var instance = this.getInstance();
	if (!instance.getAttrs)
		return false;
	
	var refPath=null;
	if(refToCheck) {
		refPath=refToCheck;
	} else {
		if(!this.refPath)
			return true;
		else
			refPath=this.refPath;
	}
		
	return ((instance.getAttrs.all === true) || (instance.getAttrs[refPath] === true));
}

XFormItem.prototype.hasWritePermission = function (refToCheck) {
	var instance = this.getInstance();
	if (!instance.setAttrs)
		return false;
	
	var refPath=null;
	if(refToCheck) {
		refPath=refToCheck;
	} else {
		if(!this.refPath)
			return true;
		else
			refPath=this.refPath;
	}
		
	return ((instance.setAttrs.all === true) || (instance.setAttrs[refPath] === true));
}

XFormItem.prototype.hasRight = function (right) {
	var instance = this.getInstance();
	if (!instance.rights)
		return false;
	
	if(!right)
		return true;
		
	return (instance.rights[right] === true);
}

XFormItem.prototype.updateVisibilityLsnr = function (event) {
	var updateMethod = this.getUpdateVisibilityMethod();
	updateMethod.call(this);
}

XFormItem.prototype.updateVisibility = function () {
	var isVisible = true;
	
	//check if the parent element is visible
	var parentItem = this.getParentItem();
	if(parentItem)
		isVisible=this.getParentItem().getIsVisible();
	
	//run stack of visibility checks until encounter a negative result
	if(isVisible) {
		var myVisibilityChecks = this.getInheritedProperty("visibilityChecks");
		if(myVisibilityChecks && myVisibilityChecks instanceof Array) {
			var cnt = myVisibilityChecks.length;
			for(var i=0;i<cnt;i++) {
				if(myVisibilityChecks[i] != null) {
					if(typeof(myVisibilityChecks[i])=="function") {
						isVisible = myVisibilityChecks[i].call(this);
						if(!isVisible)
							break;
					} else if (myVisibilityChecks[i] instanceof Array) {
						//first element is a func reference, the rest of elements are arguments
						var func = myVisibilityChecks[i].shift();
						isVisible = func.apply(this, myVisibilityChecks[i]);
						myVisibilityChecks[i].unshift(func);
						if(!isVisible)
							break;
					} else if (typeof (myVisibilityChecks[i]) == "string") {
                        //for relevant backward compatibility
                        var instance = this.getInstance();
                        isVisible = eval(myVisibilityChecks[i]) ;
                        if(!isVisible)
							break;
                    }
				}
			}
		}
	}	
	var reRunRefresh = false;	
	if(isVisible) {
		if(this.deferred)
			reRunRefresh=true;
			
		this.show();
	} else
		this.hide();
	
	//update visibility for active child items
	for(var itemId in this.activeChildren) {
		if(this.activeChildren[itemId]===true) {
			var item = this.getForm().getItemById(itemId);
			if(item && this.getInstance()) {
				var updateMethod = item.getUpdateVisibilityMethod();				
				if(updateMethod) {
					updateMethod.call(item);
				}
			}
		}
	}
	
	if(reRunRefresh) {
		this.updateEnabledDisabled();
		this.updateElement();
	}	
}

XFormItem.prototype.updateEnabledDisabledLsnr = function (event) {
	var updateMethod = this.getUpdateEnabledDisabledtMethod();
	updateMethod.call(this);	
}

XFormItem.prototype.updateEnabledDisabled = function (parentDisabled) {
	var isEnabled = true;
	
	//check if the parent element is visible
	var parentItem = this.getParentItem();
	if(parentItem)
		isEnabled=this.getParentItem().getIsEnabled();
		
	//run stack of visibility checks until encounter a negative result
	if(isEnabled) {
		var myEnabledDisabledChecks = this.getInheritedProperty("enableDisableChecks");
		if(myEnabledDisabledChecks && myEnabledDisabledChecks instanceof Array) {
			var cnt = myEnabledDisabledChecks.length;
			for(var i=0;i<cnt;i++) {
				if(myEnabledDisabledChecks[i] != null) {
					if(typeof(myEnabledDisabledChecks[i])=="function") {
						isEnabled = myEnabledDisabledChecks[i].call(this);
						if(!isEnabled)
							break;
					} else if (myEnabledDisabledChecks[i] instanceof Array) {
						//first element is a func reference, the rest of elements are arguments
						var func = myEnabledDisabledChecks[i].shift();
						if(!func || !func.apply) continue;
						isEnabled = func.apply(this, myEnabledDisabledChecks[i]);
						myEnabledDisabledChecks[i].unshift(func);
						if(!isEnabled)
							break;
					}                      
				}
			}
		}else if (myEnabledDisabledChecks == false) {   //always disable this element
            isEnabled = false ;
        }
	}	
	
	if(isEnabled)
		this.enableElement();
	else
		this.disableElement();
	
	//update enableddisabled for active child items
	for(var itemId in this.activeChildren) {
		if(this.activeChildren[itemId]===true) {
			var item = this.getForm().getItemById(itemId);
			if(item && this.getInstance()) {
				var updateMethod = item.getUpdateEnabledDisabledtMethod();				
				if(updateMethod) {
					updateMethod.call(item);
				}
			}
		}
	}
}
// error handling

/**
 * Sets the error message for this form item.
 * This will set the error for this item, or 
 * useing the errorLocation, follow the chain up,
 * to set the error on the related item.
 *
 * @param message The message to display. This message should already
 *                be localized.
 */
XFormItem.prototype.setError = function(message, childError) {
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().setError(message, true);
		return;
	}
	this.getForm().addErrorItem(this);
	this.__errorState = XFormItem.ERROR_STATE_ERROR;
	var container = this.getErrorContainer(true);
	if (container) container.innerHTML = AjxStringUtil.htmlEncode(message);
};

/** 
 * Clears the error message for this form item. 
 * This will clear the error for this item, or 
 * useing the errorLocation, follow the chain up,
 * to clear the error on the related item.
 */
XFormItem.prototype.clearError = function() {
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().clearError();
		return;
	}

	this.getForm().removeErrorItem(this);
	this.__errorState = XFormItem.ERROR_STATE_VALID;
	this.removeErrorContainer();
};

XFormItem.prototype.hasError = function () {
	return (this.__errorState == XFormItem.ERROR_STATE_ERROR);
};

XFormItem.prototype.getErrorContainer = function(createIfNecessary) {
	var container = this.getElement(this.getId() + "___error_container");
	if (container != null) return container;
	
	if (createIfNecessary == true && this.getContainer()) {
		return this.createErrorContainer();
	}
	return null;
}

XFormItem.prototype.createErrorContainer = function () {
	// output an error container
	var errorContainer = document.createElement("div");
	errorContainer.id = this.getId() + "___error_container";
	errorContainer.className = this.getErrorCssClass();

	var container = this.getContainer();
	if (container.hasChildNodes()) {
		container.insertBefore(errorContainer, container.firstChild);
	} else {
		container.appendChild(errorContainer);
	}	
	return errorContainer;
}

XFormItem.prototype.removeErrorContainer = function () {
	var errorContainer = this.getErrorContainer();
	if (errorContainer != null) {
		errorContainer.parentNode.removeChild(errorContainer);
	}
}


//
// PROPERTIES OF INDIVIDUAL ITEMS
//


XFormItem.prototype.getType = function () {
	return this.type;
}


//XXX
XFormItem.prototype.getParentItem = function () {
	return this.__parentItem;
}

XFormItem.prototype.getForm = function () {
	return this.__xform;
}

XFormItem.prototype.getGlobalRef = function() {
	return this.getForm().getGlobalRefString() + ".getItemById('" + this.getId() + "')";
}

XFormItem.prototype.getFormGlobalRef = function() {
	return this.getForm().getGlobalRefString();
}

XFormItem.prototype.getInstance = function() {
	return this.getForm().instance;
}

XFormItem.prototype.getModel = function () {
	return this.getForm().getModel();
}

XFormItem.prototype.getController = function () {
	return this.getForm().getController();
}

XFormItem.prototype.getFormController = function () {
	return this.getForm().getController();
}


XFormItem.prototype.getModelItem = function() {
	return this.__modelItem;
}

XFormItem.prototype.getSubModelItem = function() {
	return this.__subModelItem;
}

//XXX NON-STANDARD
XFormItem.prototype.getRef = function () {
	if (this.ref !== _UNDEFINED_) return this.ref;
	return this.__attributes.ref;
}

XFormItem.prototype.getRefPath = function () {
	return this.refPath;
}

XFormItem.prototype.getSubRefPath = function () {
	return this.subRefPath;
}

XFormItem.prototype.getId = function () {
	return this.id;
}

XFormItem.prototype.getExternalId = function () {
	var ret = null;
	if (this.__attributes.id !== _UNDEFINED_) {
		ret = this.__attributes.id;
	} else if ( (ret = this.getRef()) !== _UNDEFINED_) {
		// nothing
	} else {
		ret = null;
	}
	return ret;
};



//
//	GENERIC HTML WRITING ROUTINES
//


XFormItem.prototype.getOnChangeMethod = function() {
	return this.cacheInheritedMethod("onChange","$onChange","value,event,form");
}

XFormItem.prototype.getOnActivateMethod = function() {
	return this.cacheInheritedMethod("onActivate","$onActivate","event");
}

XFormItem.prototype.getOnClickMethod = function() {
	return this.cacheInheritedMethod("onClick","$onClick","event");
}

XFormItem.prototype.getExternalChangeHandler = function() {
	return "var item = " + this.getGlobalRef() + "; var elementChangedMethod = item.getElementChangedMethod(); elementChangedMethod.call(item, value, item.getInstanceValue(), event||window.event);";
}
XFormItem.prototype.getElementValueGetterHTML = function () {
	return "var value = this.value;";
}

/**
* returns the HTML part of an <input > element that is used to set "onchange" 
* (or whatever is defined by elementChangehandler)  property of the element
**/
XFormItem.prototype.getChangeHandlerHTML = function() {
	var elementChangeHandler = this.getElementChangeHandler();
	if (elementChangeHandler != "onkeypress") {
		return AjxBuffer.concat(" ", elementChangeHandler, "=\"", this.getChangehandlerJSCode() + "\"",this.getKeyPressHandlerHTML());
	} else {
		return this.getKeyPressHandlerHTML();
	}
}

/**
* returns JavaScript code that should be executed when an element is changed by a user
* @author Greg Solovyev
**/
XFormItem.prototype.getChangehandlerJSCode = function () {
	return AjxBuffer.concat(this.getElementValueGetterHTML(),this.getExternalChangeHandler());
}

XFormItem.prototype.getFocusHandlerHTML = function () {
	var formId = this.getFormGlobalRef(),
		itemId = this.getId()
	;
	
	var inputHelp =  this.getInheritedProperty("inputHelp");
	var clearInputHelpScript = "";
	if (inputHelp != null) {
		clearInputHelpScript = "if (this.value == '" + inputHelp + "') this.value=''; ";
		DBG.println("ClearnInputHelpScript = " + clearInputHelpScript);
	}
	
	var onFocusAction = null;
	if (this.getInheritedProperty("onFocus") != null) {
		onFocusAction = AjxBuffer.concat(" onfocus=\"", formId, ".onFocus('", itemId, "'); " ,	
				 clearInputHelpScript ,			 	
				 this.getInheritedProperty("onFocus") , ".call(" ,   this.getGlobalRef(), ", event )\"");
	}else{
		onFocusAction = AjxBuffer.concat(" onfocus=\"", formId, ".onFocus('", itemId, "');",
										clearInputHelpScript, "\"" );
	}
	return AjxBuffer.concat(
		//" onfocus=\"", formId, ".onFocus('", itemId, "')\"",
		//HC: unflexible hacking way to support the License Portal text field onFocus event
		onFocusAction ,		
		" onblur=\"", formId, ".onBlur('", itemId, "')\""
	);
}


XFormItem.prototype.getOnActivateHandlerHTML = function() {
	var method = this.getOnActivateMethod();
	if (method == null) return "";
	
	return AjxBuffer.concat(
			" ", this.getElementChangeHandler(), "=\"", 
			this.getGlobalRef(),".$onActivate(event||window.event)\""
		);
}

XFormItem.prototype.getClickHandlerHTML =
function () {
	var onClickFunc = this.getOnClickMethod();
	if (onClickFunc == null) return "" ;
	
	return AjxBuffer.concat(" onclick=\"", 
				this.getGlobalRef(),".$onClick(event||window.event)\""
			);
			
	return AjxBuffer.concat( onClickAction );	
}

/**
* Schedules {@link #handleKeyPressDelay} to fire later when the user finishes typing
* @param ev - "onkeypress" event 
* @param domItem - HTML form element
* @author Greg Solovyev
**/
XFormItem.prototype.handleKeyUp = function (ev, domItem) {
	var key = DwtKeyEvent.getCharCode(ev);
	// don't fire off another if we've already set one up unless this is an ENTER key
	if (!AjxUtil.isEmpty(this.keyPressDelayHdlr) && key != DwtKeyEvent.KEY_ENTER) {
		AjxTimedAction.cancelAction(this.keyPressDelayHdlr);
		this.keyPressDelayHdlr = null;
	}
	var form = this.getForm();
	var evt = new DwtKeyEvent();
	evt.setFromDhtmlEvent(ev);

	if (key == DwtKeyEvent.KEY_TAB) {
		DwtUiEvent.setBehaviour(ev, true, false);
		return false;
	} else {
		var action = new AjxTimedAction(this, this.handleKeyPressDelay, [evt, domItem]);
		//XForm.keyPressDelayHdlr = setTimeout(XForm.handleKeyPressDelay, 250, item, ev, formItem);
		this.keyPressDelayHdlr = AjxTimedAction.scheduleAction(action, 250);
	}
};

XFormItem.prototype.handleKeyDown = function (ev, domItem) {
	ev = (ev != null)? ev: window.event;
	var key = DwtKeyEvent.getCharCode(ev);
	if (key == DwtKeyEvent.KEY_ENTER) {
		// By telling the browser just to let this do the default, and 
		// not let the event bubble, our keyup handler
		// wil see the enter key.
		DwtUiEvent.setBehaviour(ev, true, true);
		return false;
	} else if (key == DwtKeyEvent.KEY_TAB) {
		DwtUiEvent.setBehaviour(ev, true, false);
		var currentTabId = XFormItem.getParentTabGroupId(this) ;
		//DBG.println(AjxDebug.DBG1, "Current Tab ID = " + currentTabId);
		if(ev.shiftKey)
			this.getForm().focusPrevious(this.getId(), currentTabId);	
		else
			this.getForm().focusNext(this.getId(), currentTabId);	
		return false;
	}
	return true;
};

/**
* Implements delayed handling of "keypress" event. 
* Calls change handler script on the item.
* See {@link XFormItem.#getChangehandlerJSCode} for change handler script.

**/
XFormItem.prototype.handleKeyPressDelay = function(ev, domItem) {	
	this.keyPressDelayHdlr = null;
	if (this.$changeHandlerFunc == null) {
		var JSCode = this.getChangehandlerJSCode();
		this.$changeHandlerFunc = new Function("event", JSCode);
	}
	if (this.$changeHandlerFunc) {
		this.$changeHandlerFunc.call(domItem, ev);
	}
};

XFormItem.prototype.getKeyPressHandlerHTML = function () {

	var keydownEv = "onkeydown";
	if (AjxEnv.isNav) {
		keydownEv = "onkeypress";
	}
	return AjxBuffer.concat(" ", keydownEv,"=\"",this.getGlobalRef(), ".handleKeyDown(event, this)\"",
						   " onkeyup=\"", this.getGlobalRef(), ".handleKeyUp(event, this)\"");
};


//
//	container
//


XFormItem.prototype.outputContainerTDStartHTML = function (html,  colSpan, rowSpan) {
	var _align = this.getAlign();
	html.append( "<td id=\"",  this.getId(), "___container\"",
					(colSpan > 1 ? " colspan=" + colSpan : ""),
					(rowSpan > 1 ? " rowspan=" + rowSpan : ""),
					this.getContainerCssString(), 
					(_align != _UNDEFINED_ ? " align='" + _align + "'" : ""),
					">"
	);
} 

XFormItem.prototype.outputContainerTDEndHTML = function (html) {
	html.append("</td id=\"",  this.getId(), "___container\">");
} 


//
//	element div
//
// for items that are effectively elements (or are drawn by something other than this form)
// NOTE: you can pass in any random CSS properties you want in cssStyle
XFormItem.prototype.outputElementDivStart = function (html) {
	html.append( "<div id=", this.getId(), this.getCssString(), " xform_type='elementDiv'>");
}

XFormItem.prototype.outputElementDivEnd = function (html) {
	html.append("</div id=\"", this.getId(), "\">");
}

//
//	label td
//
XFormItem.prototype.outputLabelCellHTML = function (html,  rowSpan, labelLocation) {
	var label = this.getLabel();
	if (label == null) return;
	
	if (label == "") label = "&nbsp;";
	
	if (labelLocation == _INLINE_) {
		var style = this.getLabelCssStyle();
		if (style == null) style = "";
		style = "position:relative;left:10px;top:5px;text-align:left;background-color:#eeeeee;margin-left:5px;margin-right:5px;" + style;
		html.append( "<div id=\"", this.getId(),"___label\"", 
								this.getLabelCssString(null, style), ">",
								label,
							"</div>"
					);
	} else {
		//lable for is allowd the label to associate with an input item
		var enableLabelFor = this.getInheritedProperty("enableLabelFor");
		if (enableLabelFor) {
			html.append( "<td id=\"", this.getId(),"___label\"", 
								this.getLabelCssString(), 
								(rowSpan > 1 ? " rowspan=" + rowSpan : ""), ">", 
								"<label for='", this.getId(), "'>", label, "</label>"
				);
		}else{
            if(!this.getInheritedProperty("helpTooltip") ||
               !this.getInheritedProperty("showHelpTooltip") ||
               !this.getInheritedProperty("hideHelpTooltip") ){
                html.append( "<td id=\"", this.getId(),"___label\"",
                    this.getLabelCssString(),
                    (rowSpan > 1 ? " rowspan=" + rowSpan : ""), ">",
                    label
                );
            }else{
                html.append( "<td id=\"", this.getId(),"___label\"",
                    this.getLabelCssString(),
                    " onclick=\"", "XFormItem.prototype.showHelpTooltip" ,
			        ".call(" ,   this.getGlobalRef(), ", event );\" ",
                    " onmouseout=\"", "XFormItem.prototype.hideHelpTooltip" ,
			        ".call(" ,   this.getGlobalRef(), ", event );\" ",
                    (rowSpan > 1 ? " rowspan=" + rowSpan : ""), ">",
                    label
                );
            }
		}
		if (this.getRequired()) {
			html.append("<span class='redAsteric'>*</span>");
		}
		html.append("</td>");
	}


}

XFormItem.getParentTabGroupId =
function (item){
	//DBG.println(AjxDebug.DBG1, "Enter the getParentTabGroupId() ...");
	
	while (item != null) {
		var p = item.getParentItem();
		if (p == null || (! p instanceof XFormItem)){
			return null ; //no parent item or p is not an XFormItem
		}else if (p instanceof Group_XFormItem && p.getInheritedProperty("isTabGroup") == true) {	
			return p.getId ();
		}
		//DBG.println(AjxDebug.DBG1, "Continue the getParentTabGroupId() ...");
		item = p ;
	}
}


//
//	change handling
//

XFormItem.prototype.elementChanged = function(elementValue, instanceValue, event) {
	this.getForm().itemChanged(this.getId(), elementValue, event);
}

//
//	get and set instance values!
//


XFormItem.prototype.getInstanceValue = function (path) {
	if (path == null) path = this.getRefPath();
	if (path == null) return null;
	return this.getModel().getInstanceValue(this.getInstance(), path);
}

//NOTE: model.getInstance() gets count of PARENT
XFormItem.prototype.getInstanceCount = function () {
	if (this.getRefPath() == null) return 0;
	return this.getModel().getInstanceCount(this.getInstance(), this.getRefPath());
}

XFormItem.prototype.setInstanceValue = function (value, path) {
	if (path == null) path = this.getRefPath();
	if (path == null) return null;
	return this.getModel().setInstanceValue(this.getInstance(), path, value);
}
XFormItem.prototype.set = XFormItem.prototype.setInstancevalue;

XFormItem.getValueFromHTMLSelect = function (element) {
	var values = [];
	for (var i = 0; i < element.options.length; i++) {
		if (element.options[i].selected) {
			values[values.length] = element.options[i].value;	
		}
	}
	return values.join(",");
}

XFormItem.prototype.getValueFromHTMLSelect = function(element) {
	if (element == null) element = this.getElement();
	return XFormItem.getValueFromHTMLSelect(element);
}

XFormItem.updateValueInHTMLSelect1 = function (newValue, element, selectionIsOpen) {
	if (element == null) return null;
	if (selectionIsOpen == null) selectionIsOpen = false;
	
	var options = element.options;
	for (i = 0; i < options.length; i++) {
		var choice = options[i];
		if (choice.value == newValue) {
			element.selectedIndex = i;
			return element.value;
		}
	}
	// default to the first element if nothing was selected (?)
	if (options.length > 0) {
		element.selectedIndex = 0;
		return options[0].value;
	}
	return null;
}
XFormItem.prototype.updateValueInHTMLSelect1 = function (newValue, element, selectionIsOpen) {
	if (element == null) element = this.getElement();
	if (selectionIsOpen == null) selectionIsOpen = this.getSelectionIsOpen();
	return XFormItem.updateValueInHTMLSelect1(newValue, element, selectionIsOpen);
}


XFormItem.updateValueInHTMLSelect = function (newValue, element, selectionIsOpen) {
	if (element == null) return null;
	if (newValue == null) newValue = "";
	if (selectionIsOpen == null) selectionIsOpen = false;
	
	// assumes newValue is a comma-delimited string or an array
	if (typeof newValue == "string") newValue = newValue.split(",");
	// hack up newValue to make searching for a particular option newValue easier
	var uniqueStartStr = "{|[", 
		uniqueEndStr = "]|}"
	;
	newValue = uniqueStartStr + newValue.join(uniqueEndStr + uniqueStartStr) + uniqueEndStr;
	
	var options = element.options;
	var anySelected = false;
	for (var i = 0; i < options.length; i++) {
		var isPresent = (newValue.indexOf(uniqueStartStr + options[i].value + uniqueEndStr) > -1);
		options[i].selected = isPresent;
		anySelected = anySelected || isPresent;		
	}
	
	if (!anySelected && !selectionIsOpen) {
		// select the first value???
		options[0].selected = true;
	}
}

XFormItem.prototype.updateValueInHTMLSelect = function (newValue, element, selectionIsOpen) {
	if (newValue == null) newValue = "";
	if (element == null) element = this.getElement();
	if (selectionIsOpen == null) selectionIsOpen = this.getSelectionIsOpen();
	return XFormItem.updateValueInHTMLSelect(newValue, element, selectionIsOpen);
}

XFormItem.prototype.getChoicesHTML = function() {
	var choices = this.getNormalizedChoices();
	if (choices == null) return "";	//throw an error?
	var html = new AjxBuffer();
	

	this.outputChoicesHTMLStart(html);
	var values = choices.values;
	var labels = choices.labels;
    var visible = choices.visible ;

    var choiceCssClass = this.getChoiceCssClass();
	for (var i = 0; i < values.length; i++) {
        if (visible && (visible[i] == false)) {
            //don't display this choice
        }else {       //by default, the choice should be visible
            html.append("", this.getChoiceHTML(i, values[i], labels[i], choiceCssClass, ""));
        }
    }
	this.outputChoicesHTMLEnd(html);
	return html.toString();
}

XFormItem.prototype.outputChoicesHTMLStart = function(html) {
	return;
}
XFormItem.prototype.outputChoicesHTMLEnd = function(html) {
	return;
}

XFormItem.prototype.getChoiceCssClass = function() {
	return "";
}

XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass) {
	return AjxBuffer.concat("<option value=\"", value, "\">", label,"</option>");
}

XFormItem.prototype.updateChoicesHTML = function () {
	this.cleanChoiceDisplay();

	// NOTE: setting the innerHTML of the options doesn't work
	//	for now, just set the outer HTML of the entire widget
	// TODO: do this by frobbing the options manually for speed and so things don't flash
	var html = new AjxBuffer();
	this.outputHTML(html, new AjxBuffer());
	if (this.getContainer())  this.getContainer().innerHTML = html.toString();
	return;       
}


XFormItem.prototype.getInheritedProperty = function(prop) {
	// first look in the instance attributes
	if (this.__attributes[prop] !== _UNDEFINED_) return this.__attributes[prop];

	// look up the inheritance chain for this type
	if (this[prop] !== _UNDEFINED_) return this[prop];

	// if not found there, look in the xmodel
	var modelItem = this.__modelItem;
	if (modelItem && modelItem[prop] !== _UNDEFINED_) return modelItem[prop];

	return null;
}

// NOTE: cacheProp MUST be different than prop!
XFormItem.prototype.cacheInheritedProperty = function (prop, cacheProp) {
	if (this[cacheProp] !== _UNDEFINED_) return this[cacheProp];
	return (this[cacheProp] = this.getInheritedProperty(prop));
}

XFormItem.prototype.cacheInheritedMethod = function (methodName, cacheProp, arguments) {
	if (this[cacheProp] !== _UNDEFINED_) return this[cacheProp];
	var func = this.getInheritedProperty(methodName);
	if (func != null) func = this.convertToFunction(func, arguments);
	this[cacheProp] = func;
	return func;
}




//
//	properties of the element after its' been drawn
//


XFormItem.prototype.getElement = XForm.prototype.getElement;
XFormItem.prototype.showElement = function (id) {
	XForm.prototype.showElement.call(this, id);
}

XFormItem.prototype.getIsVisible = function () {
	return this.__isVisible;
}

XFormItem.prototype.getIsEnabled = function () {
	return this.__isEnabled;
}
 
XFormItem.prototype.hideElement = function (id,isBlock) {
	XForm.prototype.hideElement.call(this,id,isBlock);
}

XFormItem.prototype.createElement = XForm.prototype.createElement;

XFormItem.estimateMyWidth = function (label,withIcon,extraMargin, minimum) {
	var width = (String(label).length/2)*XForm.FONT_WIDTH1 + (String(label).length/2)*XForm.FONT_WIDTH2 + 14;
	if(withIcon)
		width = width + 24;
	
	if(extraMargin>0)
		width = width + extraMargin;
	
	width = (width >= minimum) ? width : minimum;
	return [width,"px"].join("");
}

XFormItem.prototype.getWidget = function() {
	return this.widget;
}

XFormItem.prototype.setWidget = function(widget) {
	this.widget = widget;
}


XFormItem.prototype.getContainer = function() {
	return this.getElement(this.getId() + "___container");
}
XFormItem.prototype.getLabelContainer = function() {
	return this.getElement(this.getId() + "___label");
}
XFormItem.prototype.show = function() {
	if(this.deferred) {
		this._outputHTML();
	}	
	var container = this.getLabelContainer();
	if (container) this.showElement(container);
	container = this.getContainer();
	if (container != null) {
		this.showElement(container);
	} 
	this.__isVisible = true;
}

XFormItem.prototype.hide = function(isBlock) {
	isBlock = this.getInheritedProperty("isBlockElement") || isBlock;
	var container = this.getLabelContainer()
	if (container) this.hideElement(container,isBlock);
	container = this.getContainer();
	if (container != null) {
		this.hideElement(container,isBlock);
	} else {
		var items = this.getItems();
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				items[i].hide(isBlock);
			}
		}
	}
	this.__isVisible = false;
}

XFormItem.prototype.focus = function () {
	this.getForm().focusElement(this.getId());
};


//
//	SIMPLE ATTRIBUTE ACCESSORS
//
//	NOTE: this is effectively the public API for the properties you can define
//			for a FormItem
//

XFormItem.prototype.getRequired = function() {
	return this.getInheritedProperty("required");
}

XFormItem.prototype.getValue = function() {
	return this.getInheritedProperty("value");
}

// SPECIAL CASE:  don't take ITEMS from the model...
//XXX NON-STANDARD
XFormItem.prototype.getItems = function () {
	if (this.items) return this.items;
	return this.__attributes.items;
}

XFormItem.prototype.getChoices = function () {
	return this.getInheritedProperty("choices");
}

// normalized choices look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
XFormItem.prototype.getNormalizedChoices = function () {
	if (this.$normalizedChoices) return this.$normalizedChoices;

	var choices = this.getChoices();
	if (choices == null) return null;
    if (typeof choices == "function") choices = choices.call(this) ;
    
    var normalizedChoices;
	if (typeof choices.getChoices == "function") {
		normalizedChoices = choices.getChoices();
	} else if (AjxUtil.isArray(choices)) {
		// it's either an array of objects or an array of strings
		if (typeof choices[0] == "object") {
			// list of objects
			normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.OBJECT_LIST);
		} else {
			// list of simple values
			normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.SIMPLE_LIST);
		}
	} else {
		// assume it's a hash
		normalizedChoices = XFormChoices.normalizeChoices(choices, XFormChoices.HASH);
	}
	this.$normalizedChoices = normalizedChoices;
	return this.$normalizedChoices;
}


XFormItem.prototype.getNormalizedValues = function () {
	var choices = this.getNormalizedChoices();
	if (choices) return choices.values;
	return null;
}


XFormItem.prototype.getNormalizedLabels = function () {
	var choices = this.getNormalizedChoices();
	if (choices) return choices.labels;
	return null;
}
	
	
	
//
//	appearance methods
//

XFormItem.prototype.getAppearance = function () {
	return this.getInheritedProperty("appearance");
}
XFormItem.prototype.getCssClass = function () {
	return this.getInheritedProperty("cssClass");
}

XFormItem.prototype.getCssStyle = function () {
	return this.getInheritedProperty("cssStyle");
}

XFormItem.prototype.getLabel = function (value) {
	return this.getInheritedProperty("label");
}

XFormItem.prototype.getErrorCssClass = function () {
	return this.getInheritedProperty("errorCssClass");
}
XFormItem.prototype.getLabelCssClass = function (className) {
	if (className != null) return className;
	return this.getInheritedProperty("labelCssClass");
}

XFormItem.prototype.getLabelCssStyle = function (style) {
	if (style != null) return style;
	return this.getInheritedProperty("labelCssStyle");
}

XFormItem.prototype.getLabelWrap = function () {
	return this.getInheritedProperty("labelWrap");
}

XFormItem.prototype.getLabelLocation = function () {
	return this.getInheritedProperty("labelLocation");
}

XFormItem.prototype.getContainerCssClass = function () {
	return this.getInheritedProperty("containerCssClass");
}

XFormItem.prototype.getContainerCssStyle = function () {
	return this.getInheritedProperty("containerCssStyle");
}

XFormItem.prototype.getTableCssClass = function () {
	return this.getInheritedProperty("tableCssClass");
}
XFormItem.prototype.getTableCssStyle = function () {
	return this.getInheritedProperty("tableCssStyle");
}

XFormItem.prototype.getNowrap = function () {
	return this.getInheritedProperty("nowrap");
}

XFormItem.prototype.getWidth = function () {
	return this.cacheInheritedProperty("width","_width");
}

XFormItem.prototype.getHeight = function () {
	return this.getInheritedProperty("height");
}

XFormItem.prototype.getOverflow = function () {
	return this.getInheritedProperty("overflow");
}

XFormItem.prototype.getNumCols = function () {
	return this.getInheritedProperty("numCols");
}

XFormItem.prototype.getAlign = function () {
	return this.getInheritedProperty("align");
}


XFormItem.prototype.getValign = function() {
	return this.getInheritedProperty("valign");
}

XFormItem.prototype.getName = function () {
	return this.getInheritedProperty("name");
}

// NEW TABLE LAYOUT STUFF
XFormItem.prototype.useParentTable = true;
XFormItem.prototype.getUseParentTable = function () {
	return this.getInheritedProperty("useParentTable");
}
XFormItem.prototype.colSizes = _UNDEFINED_;
XFormItem.prototype.getColSizes = function () {
	return this.getInheritedProperty("colSizes");
}
XFormItem.prototype.colSpan = 1;
XFormItem.prototype.getColSpan = function () {
	return this.getInheritedProperty("colSpan");
}
XFormItem.prototype.rowSpan = 1;
XFormItem.prototype.getRowSpan = function () {
	return this.getInheritedProperty("rowSpan");
}

// END NEW TABLE LAYOUT STUFF

// error handling
XFormItem.prototype.getErrorLocation = function () {
	return this.getInheritedProperty("errorLocation");
};

//
//	convenience methods to figure out drawing types for you
//

// return the "label" in the choices array for this item
//	(allows us to do lookup of displayed values easily)
XFormItem.prototype.getChoiceLabel = function (value) {
	var choices = this.getNormalizedChoices();
	if (choices == null) return value;
	if (value == null) value = "" ; //make it an empty string, so empty value label can be returned
    
    // choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	var values = choices.values;
	for (var i = 0; i < values.length; i++) {
		if (values[i] == value) {
			return choices.labels[i];
		}
	}
	// if we didn't find it, simply return the original value
	return value;
}

// return the "label" in the choices array for this item
//	(allows us to do lookup of displayed values easily)
// If no matching choice is found, the label is returned. 
XFormItem.prototype.getChoiceValue = function (label) {
	function labelComparator (a, b) {
			return String(a).toLowerCase() < String(b).toLowerCase() ? -1 : (String(a).toLowerCase() > String(b).toLowerCase() ? 1 : 0);
	 };
	var choices = this.getNormalizedChoices();
	if (choices == null) return label;
	
	// choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	// bug 6738: sort will change the mapping between value and label.
	/*
	var labels = choices.labels;
	var vec = AjxVector.fromArray(labels);
	vec.sort(labelComparator);
	var ix = vec.binarySearch(label,labelComparator); */
	var labels = choices.labels;
	var ix = -1;
	for (var i=0; i < labels.length ; i++ ){
		if (labelComparator (label, labels[i]) == 0) {
			ix = i ;
			break;
		}		
	}
	
	if(ix>=0) 
		return choices.values[ix];
	else 		
		//return choices.values[0];// If no matching choice is found, the label is returned, instead of the first value
		return label;
}

// return the number of the choice for a particular value
//	returns -1 if not found
XFormItem.prototype.getChoiceNum = function (value) {
	var choices = this.getNormalizedChoices();
	if (choices == null) return -1;
	
	// choices will look like:  {values:[v1, v2, v3...], labels:[l1, l2, l3...]}
	var values = choices.values;
	for (var i = 0; i < values.length; i++) {
		if (values[i] == value) {
			return i;
		}
	}
	return -1
}

XFormItem.prototype.getCssString = function () {
	var css = (this.getCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";

	var style = (this.getCssStyle() || '');

	var width = this.getWidth();
	if (width != null && width != "auto") {
		if(style.length)
			style += ";";
			
		if (!isNaN(Number(width)))
			width += 'px';

		style += "width:" + width;
	}

	var height = this.getHeight();
	if (height != null) {
		if(style.length)
			style += ";";
	
		if (!isNaN(Number(height)))
			height += 'px';

		style += "height:" + height;
	}

	var overflow = this.getOverflow();
	if (overflow != null) {
		if(style.length)
			style += ";";
	
		style += "overflow:" + overflow;
	}
	
	if (this.getNowrap()) {
		if(style.length)
			style += ";";
	
		style += "white-space:nowrap";
	}

	var valign = this.getValign();
	if (valign) {
		if(style.length)
			style += ";";
	
		style += "vertical-align:"+valign;
	}
	
	if (style != '') css += " style=\"" + style + ";\"";
	return css;
}


XFormItem.prototype.getLabelCssString = function (className, style) {
	var css = (this.getLabelCssClass(className) || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	var style = (this.getLabelCssStyle(style) || '');
	if (this.getLabelWrap() == false) {
		if(style.length)
			style += ";";

		style += "white-space:nowrap";
	}
	if (style != '') css += " style=\"" + style + ";\"";
	
	return css;
}




XFormItem.prototype.getTableCssString = function () {
	var css = (this.getTableCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";

	var style = this.getTableCssStyle();
	if (style == null) style = '';
	
	var colSizes = this.getColSizes();
	if (colSizes != null) {
		if(style.length)
			style += ";";
					
		style += "table-layout:fixed";
	}

	var width = this.getWidth();
	if (width != null) 	style += ";width:"+ width;
	
	var overflow = this.getOverflow();
	if (overflow != null) {
		if(style.length)
			style += ";";

		style += "overflow:" + overflow;
	}

	return css + (style != null ? " style=\"" + style + ";\"" : "");
}


XFormItem.prototype.getContainerCssString = function () {
	var css = (this.getContainerCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	var style = this.getContainerCssStyle();
	if (style == null) style = '';
	
	var align = this.getAlign();
	if (align != _LEFT_) {
		if (align == _CENTER_ || align == _MIDDLE_) {
			if(style.length)
				style += ";";
						
			style += "text-align:center";
		} else if (align == _RIGHT_) {
			if(style.length)
				style += ";";			
		
			style += "text-align:right";
		}
	}
	var valign = this.getValign();
	if (valign == _TOP_) {
		if(style.length)
			style += ";";
					
		style += "vertical-align:top";
	} else if (valign == _BOTTOM_) {
		if(style.length)
			style += ";";
					
		style += "vertical-align:bottom";
	} else if (valign == _CENTER_ || valign == _MIDDLE_) {
		if(style.length)
			style += ";";		
			
		style += "vertical-align:middle";
	}

	if (style != "") css += " style=\"" + style + ";\"";
	return css;
}




//
//	handling changes to items
//
XFormItem.prototype.getElementChangeHandler = function () {
	return this.getInheritedProperty("elementChangeHandler");
}




//
//	outputting, inserting and updating items
//

XFormItem.prototype.getForceUpdate = function() {
	return this.getInheritedProperty("forceUpdate");
}

XFormItem.prototype.getOutputHTMLMethod = function() {
	return this.convertToFunction(
				this.getInheritedProperty("outputHTML"),
				"html,currentCol"
		);
}

XFormItem.prototype.getElementChangedMethod = function () {
	return this.cacheInheritedMethod("elementChanged","$elementChanged","elementValue, instanceValue, event");
}

XFormItem.prototype.getUpdateElementMethod = function() {
	return this.cacheInheritedMethod("updateElement","$updateElement","newValue");
}

XFormItem.prototype.getDisplayValueMethod = function() {
	return this.cacheInheritedMethod("getDisplayValue","$getDisplayValue","newValue");
}

XFormItem.prototype.getUpdateVisibilityMethod = function() {
	return this.cacheInheritedMethod("updateVisibility","$updateVisibility");
}

XFormItem.prototype.getUpdateEnabledDisabledtMethod = function() {
	return this.cacheInheritedMethod("updateEnabledDisabled","$updateEnabledDisabled");
}

XFormItem.prototype.convertToFunction = function (script, arguments) {
	if ((script == null) || (typeof(script) == "function")) return script;
	if (typeof(this[script]) == "function") return this[script];
	// CLOSURE???
	return new Function(arguments, script);
}


// note that this form item's display needs to be updated
XFormItem.prototype.dirtyDisplay = function () {
	delete this.$lastDisplayValue;
}

// override the next method in your subclass to enable/disable element
XFormItem.prototype.setElementEnabled = function(enable) {}

// convenience methods that call the above routine
XFormItem.prototype.disableElement = function () {
	this.setElementEnabled(false);
	this.__isEnabled = false;
}

XFormItem.prototype.enableElement = function () {
	this.setElementEnabled(true);
	this.__isEnabled = true;
}

// you can use these to 
XFormItem.prototype.setElementDisabledProperty = function (enable) {
	this.getElement().disabled = (enable != true)
}


XFormItem.prototype.setElementEnabledCssClass = function (enable) {
	var el = this.getElement();
	if (!el) return;
	
	if (enable) {
		el.className = this.getCssClass();
	} else {
		el.className = (this.getCssClass() + "_disabled");
	}
}



//
//	_SELECT_ etc type properties
//
XFormItem.prototype.getSelection = function () {
	return this.getInheritedProperty("selection");
}

XFormItem.prototype.getSelectionIsOpen = function () {
	return this.getInheritedProperty("selection");
}

XFormItem.prototype.getOpenSelectionLabel = function () {
	return this.getInheritedProperty("openSelectionLabel");
}


//
//	_REPEAT_ type properties
//

XFormItem.prototype.getNumberToShow = function () {
	return this.getInheritedProperty("number");
}

XFormItem.prototype.getShowAddButton = function () {
	return this.getInheritedProperty("showAddButton");
}

XFormItem.prototype.getShowRemoveButton = function () {
	return this.getInheritedProperty("showRemoveButton");
}

XFormItem.prototype.getShowMoveUpButton = function () {
	return this.getInheritedProperty("showMoveUpButton");
}

XFormItem.prototype.getShowMoveDownButton = function () {
	return this.getInheritedProperty("showMoveDownButton");
}

XFormItem.prototype.getAddButton = function () {
	return this.getInheritedProperty("addButton");
}

XFormItem.prototype.getRemoveButton = function () {
	return this.getInheritedProperty("removeButton");
}

XFormItem.prototype.getMoveUpButton = function () {
	return this.getInheritedProperty("moveUpButton");
}

XFormItem.prototype.getMoveDownButton = function () {
	return this.getInheritedProperty("moveDownButton");
}

XFormItem.prototype.getAlwaysShowAddButton = function () {
	return this.getInheritedProperty("alwaysShowAddButton");
}

XFormItem.prototype.getRepeatInstance = function () {
	return this.getInheritedProperty("repeatInstance");
}




//
//	_IMAGE_ type properties
//

XFormItem.prototype.getSrc = function () {
	return this.getInheritedProperty("src");
}

XFormItem.prototype.getSrcPath = function () {
	return this.getInheritedProperty("srcPath");
}



//
//	_ANCHOR_, _URL_, etc
//
//	type defaults
XFormItem.prototype.getShowInNewWindow = function () {
	return this.getInheritedProperty("showInNewWindow");
}




//
//	internal properties for creating various item types
//


XFormItem.prototype.getWriteElementDiv = function () {
	return this.getInheritedProperty("writeElementDiv");
}

XFormItem.prototype.getMultiple = function () {
	return this.getInheritedProperty("multiple");
}

XFormItem.prototype.getAlwaysUpdateChoices = function () {
	return this.getInheritedProperty("alwaysUpdateChoices");
}

XFormItem.prototype.choicesAreDirty = function () {
	return (this._choiceDisplayIsDirty == true || this.getAlwaysUpdateChoices());
}

XFormItem.prototype.cleanChoiceDisplay = function () {
	this._choiceDisplayIsDirty = false;
}

XFormItem.prototype.showInputTooltip =
function (event) {
	var dwtEv = new DwtUiEvent(true);
	dwtEv.setFromDhtmlEvent(event)
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setContent(this.getInheritedProperty("toolTipContent"));
	tooltip.popup(dwtEv.docX, dwtEv.docY);
}

XFormItem.prototype.hideInputTooltip =
function (event) {
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.popdown();
}









/**
 * @class defines XFormItem type _OUTPUT_
 * @constructor
 * 
 * @private
 */
Output_XFormItem = function() {}
XFormItemFactory.createItemType("_OUTPUT_", "output", Output_XFormItem, XFormItem);


//	type defaults
Output_XFormItem.prototype.writeElementDiv = true;
Output_XFormItem.prototype.labelWrap = true;
Output_XFormItem.prototype.cssClass =  "xform_output";	// element itself (or element div)
Output_XFormItem.prototype.containerCssClass =  "xform_output_container";	// element itself (or element div)

//	methods

Output_XFormItem.prototype.outputHTML = function (html) {
	// by defaut, we output the "attributes.value" if set 
	//	(in case an item only wants to write out on the initial draw)
	// NOTE: dereferencing through the choice map happens in getDisplayValue()
	var value = this.getValue();
	var method = this.getDisplayValueMethod();
	if (method) {
		value = method.call(this, value);
	}
	
	//set the onClick event handler
	var clickMethod = this.getClickHandlerHTML();
	var htmlWithEvent = null ;
	if (clickMethod != null && clickMethod != "") {
		htmlWithEvent = "<div " + this.getClickHandlerHTML() +
		 				">" + value + "</div>" ; 
	}
	
	html.append(htmlWithEvent || value);
}


Output_XFormItem.prototype.getDisplayValue = function(newValue) {
	// dereference through the choices array, if provided
	newValue = this.getChoiceLabel(newValue);

	if (newValue == null) {
		newValue = "";
	} else {
		newValue = "" + newValue;
	}
	return newValue;
}

Output_XFormItem.prototype.updateElement = function (newValue) {
	var el = this.getElement();
	if(el) {
	    //set the onClick event handler
	    var clickMethod = this.getClickHandlerHTML();
	    var htmlWithEvent = null ;
	    if (clickMethod != null && clickMethod != "") {
		    htmlWithEvent = "<div " + this.getClickHandlerHTML() +
		 				">" + newValue + "</div>" ;
	    }

        newValue = htmlWithEvent || newValue;
		this.getElement().innerHTML = newValue;
    }
}

Output_XFormItem.prototype.initFormItem = function () {
	
	XFormItem.prototype.initFormItem.call(this);
	
	// if we're dealing with an XFormChoices object...
	var choices = this.getChoices();
	if (choices == null || choices.constructor != XFormChoices) return;

	//	...set up to receive notification when its choices change
	var listener = new AjxListener(this, this.dirtyDisplay);
	choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);

    this.signUpForEvents();   //so when the instance value changed, the output display can be updated.
}

Output_XFormItem.prototype.dirtyDisplay = function () {
	XFormItem.prototype.dirtyDisplay.call(this);
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;
}

// set up how disabling works for this item type
Output_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;


/**
 * @class defines XFormItem type _TEXTFIELD_
 * @constructor
 * 
 * @private
 */
Textfield_XFormItem = function() {}
XFormItemFactory.createItemType("_TEXTFIELD_", "textfield", Textfield_XFormItem, XFormItem);
// aliases for _TEXTFIELD_:  _INPUT_
XFormItemFactory.registerItemType("_INPUT_", "input", Textfield_XFormItem);

//	type defaults
//Textfield_XFormItem.prototype.width = 100;
Textfield_XFormItem.prototype._inputType = "text";
Textfield_XFormItem.prototype.cssClass = "xform_field";
Textfield_XFormItem.prototype.elementChangeHandler="onchange";
//Textfield_XFormItem.prototype.onclickHandler="onclick";
Textfield_XFormItem.prototype.focusable = true;
Textfield_XFormItem.prototype.nowrap = false;
Textfield_XFormItem.prototype.labelWrap = true;
Textfield_XFormItem.prototype.containerCssClass = "xform_field_container";
Textfield_XFormItem.prototype.visibilityChecks = [XFormItem.prototype.hasReadPermission];
Textfield_XFormItem.prototype.enableDisableChecks = [XFormItem.prototype.hasWritePermission];
//	methods
Textfield_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	var inputType = this._inputType;
	var value = this.getValue();
	var modelItem = this.getModelItem();
	var inputHelp = this.getInheritedProperty("inputHelp");


	/***
//XXX this is probably not the best way to tell if we only want to enter numbers...
	if (modelItem && (modelItem.type == _NUMBER_)) {// || modelItem.type == _COS_NUMBER_)) {
		var keyStrokeHandler = " onkeypress=\""
//			+"',45,46,48,49,50,51,52,53,54,55,56,57,69,101,'.indexOf(','+(event||window.event).keyCode+',') > -1\""		
				+"var code = ','+(event||window.event).which+',';"
				+"var isValidChar = (',45,46,48,49,50,51,52,53,54,55,56,57,69,101,'.indexOf(code) > -1);"
				+"DBG.println(code + ':'+isValidChar);"
				+"event.returnValue = isValidChar;"
				+"return isValidChar;"
				+"\""
	}
	/***/
	html.append( 
			"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", inputType, "\"", this.getCssString(), 
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
				this.getClickHandlerHTML(), this.getMouseoutHandlerHTML(),
				(value != null ? " value=\"" + value + "\"" :""), //: (inputHelp != null ? " value=\"" + inputHelp + "\""
			">");
}

Textfield_XFormItem.prototype.getClickHandlerHTML =
function () {
	var formId = this.getFormGlobalRef(), 
		itemId = this.getId()
		;
	
	var onClickAction = "";
	
	var onClickFunc = this.getInheritedProperty("onClick") ;
	onClickAction = AjxBuffer.concat(" onclick=\"", onClickFunc || "XFormItem.prototype.showInputTooltip" , 
			".call(" ,   this.getGlobalRef(), ", event );\" ");
			
	return AjxBuffer.concat( onClickAction );	
}

Textfield_XFormItem.prototype.getMouseoutHandlerHTML =
function () {
	var formId = this.getFormGlobalRef(), 
		itemId = this.getId()
		;
	
	var onMouseoutAction = "";
	
	var onMouseoutFunc = this.getInheritedProperty("onMouseout") ;
	onMouseoutAction = AjxBuffer.concat(" onmouseout=\"", onMouseoutFunc || "XFormItem.prototype.hideInputTooltip" , 
						".call(" ,   this.getGlobalRef(), ", event );\" ");
						
	return AjxBuffer.concat( onMouseoutAction );	
}

Textfield_XFormItem.prototype.updateElement = function(newValue) {
	if (newValue == null) newValue = this.getValue();
	var inputHelp = this.getInheritedProperty("inputHelp");
	/*
	DBG.println("In updateElement: " + "newValue=" + newValue + "###" + "elementValue=" + this.getElement().value);	*/
	if ((newValue == null) && (inputHelp != null)) {
		 newValue = inputHelp ;
	}else if (newValue == null){
		 newValue = "";
	}
	
	if (this.getElement() && this.getElement().value != newValue) {
		this.getElement().value = newValue;
	}
}

// set up how disabling works for this item type
Textfield_XFormItem.prototype.setElementEnabled  = function (enabled) {
	if (this.getElement()) {
		this.setElementDisabledProperty(enabled);
		this.setElementEnabledCssClass(enabled);
	}
}

//Creates a datalist element which specifies a list of pre-defined options for an <input> element providing an autocomplete feature.
Textfield_XFormItem.prototype.createDataList  = function (list) {
	if (!AjxEnv.supported.input.list) {
		return;
	}
	list = list || [];
	var dataListId = this.getId() + "_datalist";
	// If old datalist is already present remove it.
	var oldDataList = Dwt.getElement(dataListId);
	if (oldDataList) {
		oldDataList.parentNode.removeChild(oldDataList);
	}
	var element = this.getElement();
	element.setAttribute("list", dataListId);
	var dataList = document.createElement("datalist");
	dataList.id = dataListId;
	for (var i = 0; i < list.length; i++) {
		var option = document.createElement('option');
		option.value = list[i];
		dataList.appendChild(option);
	}
	element.parentNode.appendChild(dataList);

	// if there is an onChange handler, call that during on input event
	var onChangeMethod = this.getOnChangeMethod();
	if (typeof onChangeMethod === "function") {
		Dwt.setHandler(element, DwtEvent.ONINPUT, function() {
			onChangeMethod.call(this, this.getElement().value, false, this.getForm());
		}.bind(this));
	}
};


/**
 * @class defines XFormItem type _SECRET_
 * @constructor
 * 
 * @private
 */
Secret_XFormItem = function() {}
XFormItemFactory.createItemType("_SECRET_", "secret", Secret_XFormItem, Textfield_XFormItem);
// alias for the SECRET class:  PASSWORD
XFormItemFactory.registerItemType("_PASSWORD_", "password", Secret_XFormItem);


//	type defaults
Secret_XFormItem.prototype._inputType = "password";
Secret_XFormItem.prototype.focusable = true;




/**
 * @class defines XFormItem type _FILE_
 * @constructor
 * 
 * @private
 */
File_XFormItem = function() {}
XFormItemFactory.createItemType("_FILE_", "file", File_XFormItem, Textfield_XFormItem)

//	type defaults
File_XFormItem.prototype._inputType = "file";
File_XFormItem.prototype.forceUpdate = false;
File_XFormItem.prototype.focusable = true;



/**
 * @class defines XFormItem type _TEXTAREA_
 * @constructor
 * 
 * @private
 */
Textarea_XFormItem = function() {}
XFormItemFactory.createItemType("_TEXTAREA_", "textarea", Textarea_XFormItem, Textfield_XFormItem)

Textarea_XFormItem.prototype.width = "100%";
Textarea_XFormItem.prototype.height = 100;
Textarea_XFormItem.prototype.focusable = true;
//	methods
Textarea_XFormItem.prototype.outputHTML = function (html,   currentCol) {
	var wrap = this.getInheritedProperty("textWrapping");
	if (!wrap)
		wrap = "off";
		
	html.append( 
		"<textarea id=\"", this.getId(), "\"", this.getCssString(),
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), "wrap='", wrap, "'",
		"></textarea>");
}

// you can use these to 
Textarea_XFormItem.prototype.setElementDisabledProperty = function (enable) {
	this.getElement().disabled = (enable != true);
	this.getElement().readOnly = (enable != true)
}

Textarea_XFormItem.prototype.getKeyPressHandlerHTML = function () {

        var keydownEv = "onkeydown";
        if (AjxEnv.isNav || AjxEnv.isChrome || AjxEnv.isSafari) {
                keydownEv = "onkeypress";
        }
        return AjxBuffer.concat(" ", keydownEv,"=\"",this.getGlobalRef(), ".handleKeyDown(event, this)\"",
                                                   " onkeyup=\"", this.getGlobalRef(), ".handleKeyUp(event, this)\"");
};

/**
 * @class defines XFormItem type _CHECKBOX_
 * @constructor
 * 
 * @private
 */
Checkbox_XFormItem = function() {}
XFormItemFactory.createItemType("_CHECKBOX_", "checkbox", Checkbox_XFormItem, XFormItem)
 // Wiz_checkbox for appNewUI dialog
 Wiz_Checkbox_XFormItem = function() {}
XFormItemFactory.createItemType("_WIZ_CHECKBOX_", "wiz_checkbox", Wiz_Checkbox_XFormItem, Checkbox_XFormItem)
if(appNewUI){
   Wiz_Checkbox_XFormItem.prototype.labelLocation = _RIGHT_;
   Wiz_Checkbox_XFormItem.prototype.align = _RIGHT_;
   Wiz_Checkbox_XFormItem.prototype.subLabel = "";
}


//	type defaults
Checkbox_XFormItem.prototype._inputType = "checkbox";
Checkbox_XFormItem.prototype.elementChangeHandler = "onclick";
Checkbox_XFormItem.prototype.labelLocation = (appNewUI?_LEFT_:_RIGHT_);
Checkbox_XFormItem.prototype.cssClass = "xform_checkbox";
Checkbox_XFormItem.prototype.labelCssClass = "xform_checkbox";
Checkbox_XFormItem.prototype.align = (appNewUI?_LEFT_:_RIGHT_);
Checkbox_XFormItem.prototype.trueValue = _UNDEFINED_;		// Don't set in proto so model can override
Checkbox_XFormItem.prototype.falseValue = _UNDEFINED_;
Checkbox_XFormItem.prototype.focusable = true;
Checkbox_XFormItem.prototype.visibilityChecks = [XFormItem.prototype.hasReadPermission];
Checkbox_XFormItem.prototype.enableDisableChecks = [XFormItem.prototype.hasWritePermission];
Checkbox_XFormItem.prototype.nowrap = false;
Checkbox_XFormItem.prototype.labelWrap = true;
//if (appNewUI) {
   // Checkbox_XFormItem.prototype.subLabel = ZaMsg.CaptionEnabled;
//}
//	methods
Checkbox_XFormItem.prototype.outputHTML = function (html, currentCol) {
	// figure out how to show the checkbox as checked or not
	var checked = "";
	if (this.getInstanceValue() == this.getTrueValue()) {
		checked = " CHECKED";
	}
	html.append( 
		"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", this._inputType, "\"",  
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), checked,
		">");
}


Checkbox_XFormItem.prototype.getTrueValue = function () {
	var trueValue = this.getInheritedProperty("trueValue");
	if (trueValue == null) trueValue = true;
	return trueValue;
}

Checkbox_XFormItem.prototype.getFalseValue = function () {
	var falseValue = this.getInheritedProperty("falseValue");
	if (falseValue == null) falseValue = false;
	return falseValue;
}



Checkbox_XFormItem.prototype.updateElement = function(newValue) {
	newValue = (newValue == this.getTrueValue());
	this.getElement().checked = newValue;
}

Checkbox_XFormItem.prototype.getElementValueGetterHTML = function () {
	var trueValue = this.getTrueValue();
	if (trueValue !== _UNDEFINED_) {
		if (typeof trueValue == "string") trueValue = "'" + trueValue + "'";
		
		var falseValue = this.getFalseValue();
		if (typeof falseValue == "string") falseValue = "'" + falseValue + "'";
	
		if (trueValue == null) trueValue = true;
		if (falseValue == null) falseValue = false;
	
		return AjxBuffer.concat(
			"var value = (this.checked ? ",  trueValue, " : ", falseValue, ");"
		);
	} else {
		return "var value = '"+this.getValue()+"';";
	}
}


if (appNewUI) {  //   bug66133,for some particular places, subLabel need
    Checkbox_XFormItem.prototype.outputContainerTDEndHTML = function (html) {
        var tdLabel = this.getInheritedProperty("subLabel");
        if (AjxUtil.isEmpty(tdLabel)) {
            tdLabel = "";
        } else {
            tdLabel = " " + tdLabel;
        }

        html.append(tdLabel + "</td id=\"",  this.getId(), "___container\">");
    }
}
// set up how disabling works for this item type
//	XXXX eventually we want to disable our label as well...
Checkbox_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
 * @class defines XFormItem type _RADIO_
 * @constructor
 * 
 * @private
 */
Radio_XFormItem = function() {}
XFormItemFactory.createItemType("_RADIO_", "radio", Radio_XFormItem, Checkbox_XFormItem)

//	type defaults
Radio_XFormItem.prototype._inputType = "radio";
Radio_XFormItem.prototype.focusable = true;
Radio_XFormItem.prototype.groupname=null;
Radio_XFormItem.prototype.subLabel = (appNewUI?"":null);
Radio_XFormItem.prototype.align = _RIGHT_;
Radio_XFormItem.prototype.labelLocation = _RIGHT_;
//	methods

Radio_XFormItem.prototype.updateElement = function(newValue) {
	this.getElement().checked = (this.getValue() == newValue);
}

//	methods
Radio_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	// figure out how to show the checkbox as checked or not
	var checked = "";
	if (this.getInstanceValue() == this.getTrueValue()) {
		checked = " CHECKED";
	}
	html.append( 
		"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", this._inputType, "\"",  
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), checked);
	var groupname = this.getInheritedProperty("groupname");
	if(groupname) {
			html.append(" name='",groupname,"'");
	}
	html.append(">");
}

/**
 * @class defines XFormItem type _RADIO_LABEL_
 * @constructor
 * 
 * @private
 */
Radio_Label_XFormItem = function() {}
XFormItemFactory.createItemType("_RADIO_LABEL_", "radio_label", Radio_Label_XFormItem, Radio_XFormItem)

//	type defaults
Radio_Label_XFormItem.prototype._inputType = "radio";
Radio_Label_XFormItem.prototype.focusable = true;
Radio_Label_XFormItem.prototype.groupname=null;
//	methods

Radio_XFormItem.prototype.elementChanged = function(elementValue, instanceValue, event) {
	if(elementValue==true) {
		//this.setInstanceValue(this.getValue());
		this.getForm().itemChanged(this.getId(), this.getValue(), event);
	}	
}

Radio_XFormItem.prototype.updateElement = function(newValue) {
	this.getElement().checked = (this.getValue() == newValue);
	var labelEl = XFG.getEl((this.getId()+"___labelValue"));
	if(labelEl) {
		var labelRef = this.getInheritedProperty("labelRef");
		if (labelRef == null) 
			return;
		var label = this.getInstanceValue(labelRef);	
		labelEl.innerHTML = label;
	}
}

//	methods
Radio_Label_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	// figure out how to show the checkbox as checked or not
	var checked = "";
	if (this.getInstanceValue() == this.getTrueValue()) {
		checked = " CHECKED";
	}
	html.append( 
		"<input autocomplete='off' id=\"", this.getId(),"\" type=\"", this._inputType, "\"",  
				this.getChangeHandlerHTML(), this.getFocusHandlerHTML(), checked);
	var groupname = this.getInheritedProperty("groupname");
	if(groupname) {
			html.append(" name='",groupname,"'");
	}
	html.append(">");
}

Radio_Label_XFormItem.prototype.outputLabelCellHTML = function (html,  rowSpan, labelLocation) {
	var labelRef = this.getInheritedProperty("labelRef");
	if (labelRef == null) return;
	var label = this.getInstanceValue(labelRef);
	if (label == null) return;
	if (label == "") label = "&nbsp;";
	var accessKey = this.getInheritedProperty("labelValue");
	if (labelLocation == _INLINE_) {
		var style = this.getLabelCssStyle();
		if (style == null) style = "";
		style = "position:relative;left:10;top:5;text-align:left;background-color:#eeeeee;margin-left:5px;margin-right:5px;" + style;
		html.append( "<label id=\"", this.getId(),"___labelValue\"", 
								this.getLabelCssString(null, style), " FOR=\"",this.getId(), "\">",
								label,
							"</label>"
					);
	} else {
		html.append( "<td ", this.getLabelCssString(), (rowSpan > 1 ? " rowspan=" + rowSpan : ""), ">",	
		"<label id=\"", this.getId(),"___labelValue\"", " FOR=\"",this.getId(), "\">",
		label,"</label>");
		html.append("</td>");
	}

}

/**
 * @class defines XFormItem type _BUTTON_
 * this item is a simple HTML &lt;button> element
 * @constructor
 * 
 * @private
 */
Button_XFormItem = function() {}
XFormItemFactory.createItemType("_BUTTON_", "button", Button_XFormItem, XFormItem);
XFormItemFactory.registerItemType("_TRIGGER_", "trigger", Button_XFormItem);
//	type defaults
Button_XFormItem.prototype.forceUpdate = false;
Button_XFormItem.prototype.elementChangeHandler = "onclick";
Button_XFormItem.prototype.labelLocation = _NONE_;
Button_XFormItem.prototype.relevantBehavior = _DISABLE_;
Button_XFormItem.prototype.cssClass = "xform_button";
Button_XFormItem.prototype.focusable = true;
// 	methods
Button_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	// write the div to hold the value (will be filled in on update)
	html.append(
		"<button id=\"", this.getId(), "\"", this.getCssString(),
			"\r  ", this.getOnActivateHandlerHTML(), 
			"\r  ", this.getFocusHandlerHTML(),
		"\r",">", 
			this.getLabel(),
		"</button>");
}

// set up how disabling works for this item type
Button_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
 * @class defines XFormItem type _SUBMIT_
 * this item is a simple HTML <input type="submit"> element
 * @constructor
 * 
 * @private
 */
Submit_XFormItem = function() {}
XFormItemFactory.createItemType("_SUBMIT_", "submit", Submit_XFormItem, Button_XFormItem)


//	methods
Submit_XFormItem.prototype.outputHTML = function (html,   currentCol) {
	// write the div to hold the value (will be filled in on update)
	html.append(
		"<input id=\"", this.getId(), "\" type=\"submit\"", this.getCssString(),
			this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
		" value=\"", this.getLabel(), ">"
	);
}






/**
 * @class defines XFormItem type _ANCHOR_
 * this item is an HTML &lt;a> element
 * @constructor
 * 
 * @private
 */
Anchor_XFormItem = function() {}
XFormItemFactory.createItemType("_ANCHOR_", "anchor", Anchor_XFormItem, XFormItem)

//	type defaults
Anchor_XFormItem.prototype.writeElementDiv = true;
Anchor_XFormItem.prototype.forceUpdate = true;
Anchor_XFormItem.prototype.cssClass = "xform_anchor";
Anchor_XFormItem.prototype.elementChangeHandler = "onclick";
Anchor_XFormItem.prototype.href = "javascript:;";
Anchor_XFormItem.prototype.showInNewWindow = true;
Anchor_XFormItem.prototype.focusable = true;

Anchor_XFormItem.prototype.getHref = function () {
	return this.getInheritedProperty("href");
}

//	type defaults


Anchor_XFormItem.prototype.getAnchorTag = function(href, label) {
	if (href == null) href = this.getHref();
	if (label == null) label = this.getLabel();
	
	var inNewWindow = this.getShowInNewWindow();
	return AjxBuffer.concat(
			'<a href=', href, 
				this.getOnActivateHandlerHTML(), 
				(inNewWindow ? ' target="_blank"' : ''),
			'>',
				label,
			'</a>');
}

//	methods
Anchor_XFormItem.prototype.outputHTML = function (html) {
	html.append(this.getAnchorTag());
}


Anchor_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(value);
}


// set up how disabling works for this item type
Anchor_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;




/**
 * @class defines XFormItem type _DATA_ANCHOR_
 * this item is an HTML &lt;a> element
 * @constructor
 * 
 * @private
 */
Data_Anchor_XFormItem = function() {}
XFormItemFactory.createItemType("_DATA_ANCHOR_", "data_anchor", Data_Anchor_XFormItem, Anchor_XFormItem)


Data_Anchor_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(null, value);
}




/**
 * @class defines XFormItem type _URL_
 * @constructor
 * 
 * @private
 */
Url_XFormItem = function() {}
XFormItemFactory.createItemType("_URL_", "url", Url_XFormItem, Anchor_XFormItem)


Url_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(value, value);
}

/**
 * @class defines XFormItem type _DATA_URL_
 * @constructor
 * @private
 */
DataUrl_XFormItem = function() {}
XFormItemFactory.createItemType("_DATA_URL_", "rata_url", DataUrl_XFormItem, Anchor_XFormItem)

Url_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag(value, null);
}



/**
 * @class defines XFormItem type _MAILTO_
 * this item is an _ANCHOR_ element with "mailto:" link
 * @constructor
 * 
 * @private
 */
Mailto_XFormItem = function() {}
XFormItemFactory.createItemType("_MAILTO_", "mailto", Mailto_XFormItem, Anchor_XFormItem)
Mailto_XFormItem.prototype.updateElement = function (value) {
	this.getElement().innerHTML = this.getAnchorTag("mailto:"+value, value);
}




/**
 * @class defines XFormItem type _IMAGE_
 * @constructor
 * 
 * @private
 */
Image_XFormItem = function() {}
XFormItemFactory.createItemType("_IMAGE_", "image", Image_XFormItem, XFormItem)


//	type defaults
Image_XFormItem.prototype.forceUpdate = true;
Image_XFormItem.prototype.src = _UNDEFINED_;
Image_XFormItem.prototype.srcPath = _UNDEFINED_;;
Image_XFormItem.prototype.writeElementDiv = true;


//	methods
Image_XFormItem.prototype.updateElement = function (src) {
	if (src == null) src = this.getSrc();
	
	// dereference through the choices array, if provided
	src = this.getChoiceLabel(src);

	// if we didn't get an image name, output nothing (?)
	if (src == null || src == "") {
		var output = "";
	} else {
		// prepend the image path
		var path = this.getSrcPath();
		if (path != null) src = path + src;

		var output = AjxBuffer.concat(
			"<img id=\"", this.getId(), "\" border=0 ", this.getCssString(),
				" src=\"", src, "\"",
			">"
		);
	}
	this.getElement().innerHTML = output;
}


// set up how disabling works for this item type
Image_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;



// Ajx_Image
Ajx_Image_XFormItem = function() {}
XFormItemFactory.createItemType("_AJX_IMAGE_", "ajx_image", Ajx_Image_XFormItem, XFormItem);


//	type defaults
Ajx_Image_XFormItem.prototype.forceUpdate = true;
Ajx_Image_XFormItem.prototype.src = _UNDEFINED_;
Ajx_Image_XFormItem.prototype.srcPath = _UNDEFINED_;;
Ajx_Image_XFormItem.prototype.writeElementDiv = false;

// //	methods
Ajx_Image_XFormItem.prototype.updateElement = function (src) {
	if (src == null) src = this.getSrc();

 	// dereference through the choices array, if provided
 	src = this.getChoiceLabel(src);
	var output;
 	// if we didn't get an image name, output nothing (?)
 	if (src == null || src == "") {
 		output = "";
 	} else {
 		// prepend the image path
 		var path = this.getSrcPath();
 		if (path != null) src = path + src;
 		var style = this.getCssStyle();
		output = AjxImg.getImageHtml(src, "position:relative;" + (style ? style : '' ));
 	}
 	if (this.getContainer()) this.getContainer().innerHTML = output;
};


// Dwt_Image
Dwt_Image_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_IMAGE_", "dwt_image", Dwt_Image_XFormItem, XFormItem);


//	type defaults
Dwt_Image_XFormItem.prototype.forceUpdate = true;
Dwt_Image_XFormItem.prototype.src = _UNDEFINED_;
Dwt_Image_XFormItem.prototype.srcPath = _UNDEFINED_;;
Dwt_Image_XFormItem.prototype.writeElementDiv = false;

// //	methods
Dwt_Image_XFormItem.prototype.updateElement = function (src) {
	if (src == null) src = this.getSrc();

 	// dereference through the choices array, if provided
 	src = this.getChoiceLabel(src);
	var output;
 	// if we didn't get an image name, output nothing (?)
 	if (src == null || src == "") {
 		output = "";
 	} else {
 		// prepend the image path
 		var path = this.getSrcPath();
 		if (path != null) src = path + src;
 		var style = this.getCssStyle();
		style = style || "";
		var styleStr = "style='position:relative;"+ style + "'";

		if (src) {
			output = ["<div class='", src, "' ", styleStr, this.getClickHandlerHTML(), " ></div>"].join("");
		} else {
			output = ["<div ", styleStr, this.getClickHandlerHTML(), " ></div>"].join("");
		}
 	}
 	this.getContainer().innerHTML = output;
};

/**
 * @class defines XFormItem type _SELECT1_
 * this item is rendered as HTML &lt;select> element
 * @constructor
 * 
 * @private
 */
Select1_XFormItem = function() {}
XFormItemFactory.createItemType("_SELECT1_", "select1", Select1_XFormItem, XFormItem)

//	type defaults
Select1_XFormItem.prototype.multiple = false;
Select1_XFormItem.prototype.alwaysUpdateChoices = false;
Select1_XFormItem.prototype.focusable = true;
Select1_XFormItem.prototype.cssClass = "xform_select1";
Select1_XFormItem.prototype.containerCssClass = "xform_select_container";
Select1_XFormItem.prototype.visibilityChecks = [XFormItem.prototype.hasReadPermission];
Select1_XFormItem.prototype.enableDisableChecks = [XFormItem.prototype.hasWritePermission];
//	methods
Select1_XFormItem.prototype.initFormItem = function () {
	// if we're dealing with an XFormChoices object...
	var choices = this.getChoices();
	if (choices == null || choices.constructor != XFormChoices) return;

	//	...set up to receive notification when its choices change
	var listener = new AjxListener(this, this.dirtyDisplay);
	choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);
}


Select1_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	html.append( 
		"<select id=\"", this.getId(), "\" ", this.getCssString(), 
			(this.getMultiple() ? "multiple " : ""), 
			this.getChangeHandlerHTML(), this.getFocusHandlerHTML(),
		">",
			this.getChoicesHTML(),
		"</select>"
		);
	this.cleanChoiceDisplay();
}

Select1_XFormItem.prototype.getElementValueGetterHTML = function () {
	return "var value = XFormItem.getValueFromHTMLSelect(this);";
}



Select1_XFormItem.prototype.setChoices = function(newChoices) {
	this.choices = newChoices;
	this.dirtyDisplay();
	this.updateChoicesHTML();
}

Select1_XFormItem.prototype.dirtyDisplay = function () {
	XFormItem.prototype.dirtyDisplay.call(this);
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;
}

Select1_XFormItem.prototype.updateElement = function (newValue) {
	if (this.choicesAreDirty()) this.updateChoicesHTML();
	this.updateValueInHTMLSelect1(newValue, this.getElement(), this.getSelectionIsOpen());
}


Select1_XFormItem.prototype.cleanChoiceDisplay = function () {
	this._choiceDisplayIsDirty = false;
}

// set up how disabling works for this item type
Select1_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementDisabledProperty;



/**
 * @class defines XFormItem type _SELECT_
 * this item is rendered as HTML &lt;select> element
 * @constructor
 * 
 * @private
 */
Select_XFormItem = function() {}
XFormItemFactory.createItemType("_SELECT_", "select", Select_XFormItem, Select1_XFormItem)

//	type defaults
Select_XFormItem.prototype.multiple = true;
Select_XFormItem.prototype.selection = _OPEN_;
Select_XFormItem.prototype.focusable = true;
Select_XFormItem.prototype.containerCssClass = "xform_select_container";

//	methods

Select_XFormItem.prototype.updateElement = function (newValue) {
	if (this.choicesAreDirty()) this.updateChoicesHTML();
	this.updateValueInHTMLSelect(newValue, this.getElement(), this.getSelectionIsOpen());
}



/**
 * @class defines XFormItem type _SPACER_
 * Use to output an entire row spacer
 * @constructor
 * 
 * @private
 */
Spacer_XFormItem = function() {}
XFormItemFactory.createItemType("_SPACER_", "spacer", Spacer_XFormItem, XFormItem)

//	type defaults
Spacer_XFormItem.prototype.forceUpdate = false;
Spacer_XFormItem.prototype.labelLocation = _NONE_;
Spacer_XFormItem.prototype.width = 1;
Spacer_XFormItem.prototype.height = 10;
Spacer_XFormItem.prototype.cssStyle = "font-size:1px;overflow:hidden;";
Spacer_XFormItem.prototype.colSpan = "*";
Spacer_XFormItem.prototype.focusable = false;

// 	methods
Spacer_XFormItem.prototype.outputHTML = function (html,   currentCol) {
	html.append( "<div id=", this.getId(), this.getCssString(),"></div>");
}

// set up how disabling works for this item type
Spacer_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;

/**
 * @class defines XFormItem type _CELL_SPACER_
 * Use to output a single cell of space
 * @constructor
 * 
 * @private
 */
Cell_Spacer_XFormItem = function() {}
XFormItemFactory.createItemType("_CELL_SPACER_", "cell_spacer", Cell_Spacer_XFormItem, Spacer_XFormItem)
XFormItemFactory.registerItemType("_CELLSPACER_", "cell_spacer", Cell_Spacer_XFormItem);
Cell_Spacer_XFormItem.prototype.width = 10;
Cell_Spacer_XFormItem.prototype.height = 10;
Cell_Spacer_XFormItem.prototype.colSpan = 1;
Cell_Spacer_XFormItem.prototype.focusable = false;

/**
 * @class defines XFormItem type _SEPARATOR_
 * @constructor
 * 
 * @private
 */
Separator_XFormItem = function() {}
XFormItemFactory.createItemType("_SEPARATOR_", "separator", Separator_XFormItem, XFormItem)

//	type defaults
Separator_XFormItem.prototype.cssClass = "xform_separator";
Separator_XFormItem.prototype.colSpan = "*";
Separator_XFormItem.prototype.align = _CENTER_;
Separator_XFormItem.prototype.valign = _CENTER_;
Separator_XFormItem.prototype.height = 10;
Separator_XFormItem.prototype.focusable = false;

// methods
Separator_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	var css = (this.getCssClass() || '');
	if (css != '' && css != null) css = " class=\"" + css + "\"";
	
	html.append( 
			"<table width=100% cellspacing=0 cellpadding=0>",
				"<tr><td height=",this.getHeight(),">",
					"<div ", css,"></div>",
			"</td></tr></table>"
	);
}


// set up how disabling works for this item type
Separator_XFormItem.prototype.setElementEnabled = XFormItem.prototype.setElementEnabledCssClass;







/**
 * @class defines XFormItem type _GROUP_
 * @constructor
 * 
 * @private
 */
Group_XFormItem = function() {
	this.tabIdOrder = [];
}
XFormItemFactory.createItemType("_GROUP_", "group", Group_XFormItem, XFormItem)

//	type defaults
Group_XFormItem.prototype.forceUpdate = false;
Group_XFormItem.prototype.numCols = 2;
Group_XFormItem.prototype.useParentTable = false;
Group_XFormItem.prototype.focusable = false;
Group_XFormItem.prototype.cellspacing = 0;
Group_XFormItem.prototype.border = 0;
Group_XFormItem.prototype.cellpadding = 0;
if(appNewUI){
Group_XFormItem.prototype.tableCssClass = "grid_xform_table";
}
Group_XFormItem.prototype.initFormItem = function () {
	XFormItem.prototype.initFormItem.call(this);	
	if(this.getInheritedProperty("isTabGroup")) {
		var form = this.getForm();
		form.tabIdOrder[this.getId()] = this.tabIdOrder;
		form.addTabGroup(this);
	}

}

Group_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	this.getForm().outputItemList(this.getItems(), this, html,   this.getNumCols(), currentCol);
}

Group_XFormItem.prototype.clearError = function() {
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().clearError();
		return;
	}

	this.getForm().removeErrorItem(this);
	if(this.items) {
		var cnt = this.items.length;
		for(var i = 0; i < cnt; i++) {
			if(this.items[i].getErrorLocation() != _PARENT_ &&  this.items[i].getErrorLocation() != _INHERIT_)
				this.items[i].clearError();
		}
	}
	this.__errorState = XFormItem.ERROR_STATE_VALID;
	this.removeErrorContainer();
};

Group_XFormItem.prototype.setElementEnabled  =  function (enable) {
		
}

Group_XFormItem.prototype.updateVisibility = function () {
	var isVisible = true;
	
	//check if the parent element is visible
	var parentItem = this.getParentItem();
	if(parentItem)
		isVisible=this.getParentItem().getIsVisible();
	
	//run stack of visibility checks until encounter a negative result
	if(isVisible) {
		var myVisibilityChecks = this.getInheritedProperty("visibilityChecks");
		if(myVisibilityChecks && myVisibilityChecks instanceof Array) {
			var cnt = myVisibilityChecks.length;
			for(var i=0;i<cnt;i++) {
				if(myVisibilityChecks[i] != null) {
					if(typeof(myVisibilityChecks[i])=="function") {
						isVisible = myVisibilityChecks[i].call(this);
						if(!isVisible)
							break;
					} else if (myVisibilityChecks[i] instanceof Array) {
						//first element is a func reference, the rest of elements are arguments
						var func = myVisibilityChecks[i].shift();
						isVisible = func.apply(this, myVisibilityChecks[i]);
						myVisibilityChecks[i].unshift(func);
						if(!isVisible)
							break;
					} else if (typeof (myVisibilityChecks[i]) == "string") {
                        //for relevant backward compatibility
                        var instance = this.getInstance();
                        isVisible = eval(myVisibilityChecks[i]) ;
                        if(!isVisible)
							break;
                    }
				}
			}
		}
	}	
	var reRunRefresh = false;	
	if(isVisible) {
		if(this.deferred)
			reRunRefresh=true;
			
		this.show();
	} else
		this.hide();
	
	//update visibility for active child items
	if(isVisible) {
		for(var itemId in this.activeChildren) {
			if(this.activeChildren[itemId]===true) {
				var item = this.getForm().getItemById(itemId);
				if(item && this.getInstance()) {
					var updateMethod = item.getUpdateVisibilityMethod();				
					if(updateMethod) {
						updateMethod.call(item);
					}
				}
			}
		}
	}
	if(reRunRefresh) {
		this.updateEnabledDisabled();
		this.updateElement();
	}	
}



Step_Choices_XFormItem = function() {}
XFormItemFactory.createItemType("_STEPCHOICE_", "stepchoices", Step_Choices_XFormItem, Group_XFormItem);

Step_Choices_XFormItem.prototype.numCols = 1;
Step_Choices_XFormItem.prototype.labelVisibility = _UNDEFINED_;
Step_Choices_XFormItem.prototype.labelUpdateMethod = function(newValue) {
    var el = this.getElement();
    var sourceValue =  this.getInheritedProperty("sourceValue");
    if (sourceValue < newValue) {
        el.className = "AdminOutputTabClick";
    } else if (sourceValue == newValue) {
        el.className =  "AdminOutputTabSelect";
    } else {
        el.className = "AdminOutputTab";
    }
}

Step_Choices_XFormItem.prototype.getLabelUpdateMethod = function() {
    return this.cacheInheritedMethod("labelUpdateMethod", "$labelUpdateMethod", "newValue");
}

Step_Choices_XFormItem.prototype.labelClickMethod = function(event) {
    var sourceValue =  this.getInheritedProperty("sourceValue");
    var instanceValue = this.getInstanceValue();
    if (sourceValue < instanceValue) {
        this.setInstanceValue(sourceValue);
    }
}

Step_Choices_XFormItem.prototype.getLabelClickMethod = function() {
    return this.cacheInheritedMethod("labelClickMethod", "$labelClickMethod", "event");
}

Step_Choices_XFormItem.prototype.initFormItem = function() {
    var choices = this.getNormalizedChoices();
    if (!choices)
        return;

	XFormItem.prototype.initFormItem.call(this);

    this.signUpForEvents();
    var labels = choices.labels;
    var values =choices.values;

    this.items = [];
    var currentItem;
    var labelUpdateMethod = this.getLabelUpdateMethod();
    var labelVisibility = this.getInheritedProperty ("labelVisibility");
    var labelOnClickMethod = this.getLabelClickMethod();
    for (var i = 0; i < labels.length; i++) {
        if (labelVisibility && labelVisibility[values[i]]) {
            currentItem = {ref: ".", type:_OUTPUT_,
                value:labels[i], sourceValue: values[i],
                updateElement: labelUpdateMethod,
                visibilityChecks: labelVisibility[values[i]].checks,
                visibilityChangeEventSources:labelVisibility[values[i]].sources
            };
        } else {
            currentItem = {ref: ".", type:_OUTPUT_,
                value:labels[i], sourceValue: values[i],
                updateElement: labelUpdateMethod
            };
        }

        if (labelOnClickMethod) {
            currentItem.onClick = labelOnClickMethod;
        }
        this.items.push(currentItem);
    }
}
 /*
Step_Choices_XFormItem.prototype.updateElement = function (newValue) {
    var items = this.getItems();
    var el;
    for ( var i = 0; i < items.length; i++) {
        el = items[i].getElement();
        if (items[i].getInheritedProperty("sourceValue") == newValue) {
            Dwt.addClass(el, "AdminOutputTabSelect");
            Dwt.delClass(el, "AdminOutputTab");
        } else {
            Dwt.delClass(el, "AdminOutputTabSelect");
            Dwt.addClass(el, "AdminOutputTab");
        }
    }
}
*/


HomeGroup_XFormItem = function() {
    this.expanded = true;
}
XFormItemFactory.createItemType("_HOMEGROUP_", "homegroup", HomeGroup_XFormItem, Group_XFormItem)

//	type defaults
HomeGroup_XFormItem.prototype.headCss = "homeGroupHeader";
HomeGroup_XFormItem.prototype.bodyCss = "homeGroupBody";
HomeGroup_XFormItem.prototype.numCols = 1;
HomeGroup_XFormItem.prototype.width = "90%";
HomeGroup_XFormItem.prototype.cssStyle = "margin-left:5%; margin-top: 10px;";
HomeGroup_XFormItem.prototype.headerLabel = "Home Group";
HomeGroup_XFormItem.prototype.expandedImg =  "ImgNodeExpanded";
HomeGroup_XFormItem.prototype.collapsedImg =  "ImgNodeCollapsed";
HomeGroup_XFormItem.prototype.initializeItems = function () {
    this.items = [];
    this.items[0] = this.getHeaderItems();
    this.items[1] = this.getContentItems();
    var content = this.items[1].items;
    var choices = this.getInheritedProperty("contentChoices");
    if (!choices[0].label)
        this.items[1].numCols = 1;
    for (var i = 0; i < choices.length; i ++) {
        var currentItem = {type:_OUTPUT_, label: choices[i].label,
                        value: choices[i].value, containerCssStyle:"color:blue;cursor:pointer"};
        if (choices[i].onClick) {
            currentItem.onClick = choices[i].onClick;
        }
        content.push(currentItem);
    }
    Group_XFormItem.prototype.initializeItems.call(this);
}

HomeGroup_XFormItem.prototype.onClick = function(ev) {
    var homeItem = this.getParentItem().getParentItem();
    var contentContainer = homeItem.items[1];
    if (homeItem.expanded) {
        homeItem.expanded = false;
        this.updateElement(homeItem.collapsedImg);
        contentContainer.hide();
    } else {
        homeItem.expanded = true;
        this.updateElement(homeItem.expandedImg);
        contentContainer.show();
    }
}

HomeGroup_XFormItem.prototype.getHeaderItems =
function () {
    var headerLabel = this.getInheritedProperty("headerLabel");
    var headerCss = this.getInheritedProperty("headCss");
    var headerItems = { type:_COMPOSITE_, numCols:3, width:"100%",
            colSizes:["20px", "100%", "20px"],
            items:[
                {type:_DWT_IMAGE_, value: this.expandedImg, cssStyle:"position:static;", onClick:this.onClick},
                {type:_OUTPUT_, value: headerLabel},
                {type:_AJX_IMAGE_, value: "BorderNone"}
            ],
            cssClass:headerCss
        };
    return headerItems;
}

HomeGroup_XFormItem.prototype.getContentItems =
function () {
    var bodyCss = this.getInheritedProperty("bodyCss");
    var contentItems = { type:_GROUP_, items:[], cssClass:bodyCss
    };
    contentItems.items = [];
    return contentItems;
}

CollapsedGroup_XFormItem = function() {
    this.expanded = true;
}
XFormItemFactory.createItemType("_COLLAPSED_GROUP_", "collapsedgroup", CollapsedGroup_XFormItem, Group_XFormItem)

//	type defaults
CollapsedGroup_XFormItem.prototype.headCss = "gridGroupHeader";
CollapsedGroup_XFormItem.prototype.contentCss = "gridGroupContent";
CollapsedGroup_XFormItem.prototype.gridLabelCss = "gridGroupBodyLabel";
CollapsedGroup_XFormItem.prototype.colSizes = "100%";
CollapsedGroup_XFormItem.prototype.numCols = 1;
CollapsedGroup_XFormItem.prototype.width = "100%";
CollapsedGroup_XFormItem.prototype.defaultDisplay = true;
CollapsedGroup_XFormItem.prototype.displayLabelItem = false;
CollapsedGroup_XFormItem.prototype.cssClass = "grid_group_container";
CollapsedGroup_XFormItem.prototype.cssStyle = "margin-top: 10px;";
CollapsedGroup_XFormItem.prototype.headerLabel = AjxMsg.collapsedGroup;
CollapsedGroup_XFormItem.prototype.expandedImg =  "ImgNodeExpanded";
CollapsedGroup_XFormItem.prototype.collapsedImg =  "ImgNodeCollapsed";
CollapsedGroup_XFormItem.prototype.contentTableCssClass = "grid_table";
CollapsedGroup_XFormItem.prototype.containerCssClass = "grid_table_cell_sheet";
CollapsedGroup_XFormItem.prototype.initializeItems = function () {
    var gridLabelCss = this.getInheritedProperty("gridLabelCss");
    var oldItems = this.getItems();
    this.items = [];
    if(this.__attributes.label) {
        this.headerLabel = this.__attributes.label;
    }
    this.items[0] = this.getHeaderItems();
    this.items[1] = this.getContentItems();
    if(!this.items[1] || this.items[1].items.length == 0) {
        if(oldItems) {
            for(var i = 0; i < oldItems.length; i++) {
                if(oldItems[i].type == "radio")
                    continue;  // don't deal with _RADIO_
                if(oldItems[i].label || oldItems[i].txtBoxLabel) {
                    if (oldItems[i].type) {
                        var form = this.getForm();
                        var constructor =   XFormItemFactory.getItemTypeConstructor(oldItems[i].type, form);
                        //oldItems[i].labelCssStyle = "text-align:left; background-color:#DEE5F1 !important;padding-left:10px;";
                        if (constructor.prototype.labelCssClass) {
                           oldItems[i].labelCssClass =  constructor.prototype.labelCssClass + " " + gridLabelCss;
                        } else {
                            oldItems[i].labelCssClass = gridLabelCss;
                        }
                    }
                    else {
                        oldItems[i].labelCssClass = gridLabelCss;
                    }
                }
            }
            this.items[1].items =  oldItems;
        }
    }

    Group_XFormItem.prototype.initializeItems.call(this);
}

CollapsedGroup_XFormItem.prototype.onClick = function(ev) {
    var headerItem =  this.getParentItem();
    var collapsedItem = headerItem.getParentItem();
    var headerContainer = headerItem.items[2];
    var contentContainer = collapsedItem.items[1];
    var displayLabelItem = collapsedItem.getInheritedProperty("displayLabelItem");
    if (collapsedItem.expanded) {
        collapsedItem.expanded = false;
        this.updateElement(collapsedItem.collapsedImg);
        contentContainer.hide();
        if(displayLabelItem)
            headerContainer.show();
    } else {
        collapsedItem.expanded = true;
        this.updateElement(collapsedItem.expandedImg);
        contentContainer.show();
        headerContainer.hide();
    }
}

CollapsedGroup_XFormItem.prototype.getHeaderItems =
function () {
    var headerLabel = this.getInheritedProperty("headerLabel");
    var headerLabelWidth = this.getInheritedProperty("headerLabelWidth");
    var headerCss = this.getInheritedProperty("headCss");
    var headItems = this.getInheritedProperty("headerItems") || [];
    var headerItems = { type:_COMPOSITE_, numCols:3, width:"100%",
            colSizes:["20px", headerLabelWidth || "100%", "100%"], colSpan:"*",
            items:[
                {type:_DWT_IMAGE_, value: this.expandedImg, cssStyle:"position:static;", onClick:this.onClick},
                {type:_OUTPUT_, value: headerLabel},
                {type:_GROUP_, items: headItems}
            ],
            cssClass:headerCss
        };
    return headerItems;
}

CollapsedGroup_XFormItem.prototype.getContentItems =
function () {
    var colsize = this.getInheritedProperty("colSizes");
    var numcols = this.getInheritedProperty("numCols");
    var contentCss = this.getInheritedProperty("contentCss");
    var tableCssClass = this.getInheritedProperty("contentTableCssClass");
    var contentItems = { type:_GROUP_, items:[], colSpan:"*",
                         colSizes:colsize,numCols:numcols, width:"100%",
                         cssClass:contentCss, tableCssClass:tableCssClass
    };
    var ref = this.getInheritedProperty("ref");
    if(ref) {
        contentItems.ref = ref;
    }
    var content =  this.getInheritedProperty("contentItems");
    if(content)
        contentItems.items = content;
    return contentItems;
}

CollapsedGroup_XFormItem.prototype.updateVisibility = function () {

    XFormItem.prototype.updateVisibility.call(this);
    var display = this.getInheritedProperty("defaultDisplay");
    var displayLabelItem = this.getInheritedProperty("displayLabelItem");
    if(display) {
        this.items[0].items[2].hide();
        this.items[1].show();
        this.items[0].items[0].value = this.expandedImg;
        this.expanded = true;
    } else {
        if(displayLabelItem)
            this.items[0].items[2].show();
        else this.items[0].items[2].hide();
        this.items[1].hide();
        this.items[0].items[0].__attributes.value = this.collapsedImg;
        this.expanded = false;
    }
}

CollapsedGroup_XFormItem.prototype.getLabel = function () {
    return null;
}


/**
 * @class defines XFormItem type _GROUPER_
 * Draws a simple border around the group, with the label placed over the border
 * @constructor
 * 
 * @private
 */
Grouper_XFormItem = function() {}
XFormItemFactory.createItemType("_GROUPER_", "grouper", Grouper_XFormItem, Group_XFormItem);
Grouper_XFormItem.prototype.labelCssClass = "GrouperLabel";
Grouper_XFormItem.prototype.labelLocation = _INLINE_;		// managed manually by this class
Grouper_XFormItem.prototype.borderCssClass = "GrouperBorder";
Grouper_XFormItem.prototype.insetCssClass = "GrouperInset";

Grouper_XFormItem.prototype.getBorderCssClass = function () {
	return this.getInheritedProperty("borderCssClass");
}

Grouper_XFormItem.prototype.getInsetCssClass = function () {
	return this.getInheritedProperty("insetCssClass");
}

// output the label
Grouper_XFormItem.prototype.outputHTMLStart = function (html,  currentCol) {
	html.append(
			"<div class=", this.getBorderCssClass(), ">",
				"<span ", this.getLabelCssString(),">", this.getLabel(), "</span>",
				"<div class=", this.getInsetCssClass(),">"
		);
}

Grouper_XFormItem.prototype.outputHTMLEnd = function (html,  currentCol) {
	html.append(
			"</div></div>"
		);
}



RadioGrouper_XFormItem = function() {}
XFormItemFactory.createItemType("_RADIO_GROUPER_", "radiogrouper", RadioGrouper_XFormItem, Grouper_XFormItem)
RadioGrouper_XFormItem.prototype.labelCssClass = "xform_radio_grouper_label";
RadioGrouper_XFormItem.prototype.borderCssClass = "xform_radio_grouper_border";
RadioGrouper_XFormItem.prototype.insetCssClass = "xform_radio_grouper_inset";
RadioGrouper_XFormItem.prototype.width = "100%";



CollapsableRadioGrouper_XFormItem = function() {}
XFormItemFactory.createItemType("_COLLAPSABLE_RADIO_GROUPER_", "collapsableradiogrouper", CollapsableRadioGrouper_XFormItem, RadioGrouper_XFormItem)

CollapsableRadioGrouper_XFormItem.prototype.getLabel = function () {
	var label = XFormItem.prototype.getLabel.apply(this);
	return "<nobr><span class=xform_button style='font-size:9px;color:black;'>&nbsp;&ndash;&nbsp;</span>&nbsp;"+label+"</nobr>";
}




/**
 * @class defines XFormItem type _CASE_
 * @constructor
 * 
 * @private
 */
Case_XFormItem = function() {
	Group_XFormItem.call(this);

}
XFormItemFactory.createItemType("_CASE_", "case", Case_XFormItem, Group_XFormItem);

//	type defaults
Case_XFormItem.prototype.labelLocation = _NONE_;
Case_XFormItem.prototype.useParentTable = false;
Case_XFormItem.prototype.width = "100%";
Case_XFormItem.prototype.focusable = false;
Case_XFormItem.prototype.deferred = true;
Case_XFormItem.prototype.cellspacing = 0;
Case_XFormItem.prototype.cellpadding = 0;
Case_XFormItem.prototype.cssClass = "XFormCase";
Case_XFormItem.prototype.isTabGroup = true;	
Case_XFormItem.prototype.caseVarRef = "currentStep";
Case_XFormItem.prototype.visibilityChangeEventSources = [Case_XFormItem.prototype.caseVarRef];
Case_XFormItem.prototype.initFormItem = function () {
	XFormItem.prototype.initFormItem.call(this);	
	if(this.getInheritedProperty("isTabGroup")) {
		var form = this.getForm();
		form.tabIdOrder[this.getId()] = this.tabIdOrder;
		form.addTabGroup(this,"caseKey");
	}

}
Case_XFormItem.prototype.outputHTML = function (html,  currentCol) {
	this.deferred = this.getInheritedProperty("deferred");
	if(this.deferred) {
		this.getForm().outputItemList([], this, html,  this.getNumCols(), 0, true, false);
	} else {
		this.getForm().outputItemList(this.getItems(), this, html,  this.getNumCols(), currentCol);
	}
}

Case_XFormItem.prototype._outputHTML = function () {
	var form = this.getForm();
	
	var element = this.getElement();
	if(!element) {
		return;
	}
	var masterId = this.getId();
	
	if(this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight")) {
		var height = this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight").call(this);
		var width = this.cacheInheritedMethod("getCustomWidth", "$getCustomWidth").call(this);
		Dwt.setSize(element, width, height);
		var container = (form.parent instanceof DwtControl) ? form.parent : DwtControl.fromElementId(window._dwtShellId);
		if(container) {
			if(this.cacheInheritedMethod("resizeHdlr", "$resizeHdlr")) {
				container.addControlListener(new AjxListener(this, this.cacheInheritedMethod("resizeHdlr", "$resizeHdlr")));
			}
		}
	}	

    if(this.cacheInheritedMethod("getCustomPaddingStyle", "$getCustomPaddingStyle")) {
        var paddingStyle = this.cacheInheritedMethod("getCustomPaddingStyle", "$getCustomPaddingStyle").call(this);
        if(paddingStyle)
            element.style.cssText += ";"+paddingStyle;  //";"for IE
    }

	if (AjxEnv.isIE) {
		var tempDiv = this.createElement("temp",null,"div","");
		tempDiv.display = "none";
	}

	var html = new AjxBuffer();
	
	if (this.outputHTMLStart) {
		this.outputHTMLStart(html,  0);
	}
	
	var drawTable = (this.getUseParentTable() == false);
	if (drawTable) {
		var colSizes = this.getColSizes();
		var cellspacing = this.getInheritedProperty("cellspacing");
		var cellpadding = this.getInheritedProperty("cellpadding");		
		html.append("<table cellspacing=",cellspacing," cellpadding=",cellpadding," ",  
				(XForm._showBorder ? "border=1" : "border=0"),
				" id=\"", this.getId(),"_table\" ", this.getTableCssString(),">");
		if (colSizes != null) {
			html.append(" <colgroup>");
			for (var i = 0; i < colSizes.length; i++) {
				var size = colSizes[i];
				if (size < 1) size = size * 100 + "%";
				html.append("<col width=", size, ">");
			}
			html.append("</colgroup>");
		}
		html.append("<tbody>");
	}
	//output HTML for all child elements
	form.outputItemList(this.getItems(), this, html, this.getNumCols(), 0, true, true);
	html.append("</table>");	

	
//	DBG.dumpObj(html.toString());
    element.innerHTML = html.toString();
    this.deferred = false;
}

Case_XFormItem.prototype.hide = function(isBlock) {
	XFormItem.prototype.hide.call(this, isBlock);
	this.hideElement(this.getElement(),isBlock)	;
}

Case_XFormItem.prototype.show = function(isBlock) {
	XFormItem.prototype.show.call(this, isBlock);
	this.showElement(this.getElement(),isBlock)	;
}

Case_XFormItem.prototype.isCurrentTab = function () {
	var isCurrent = false;
	var caseKey = this.getInheritedProperty("caseKey");
	if(!AjxUtil.isEmpty(caseKey)) {
		var caseVarRef = this.getInheritedProperty("caseVarRef");
		var currentKey = this.getInstanceValue(caseVarRef);
		isCurrent = (currentKey == caseKey);
	}
	return isCurrent;
}
Case_XFormItem.prototype.visibilityChecks = [Case_XFormItem.prototype.isCurrentTab];

/**
 * @class defines XFormItem type _TOP_GROUPER_
 * Draws a simple border around the group, with the label placed over the border
 * @constructor
 * 
 * @private
 */
TopGrouper_XFormItem = function() {}
XFormItemFactory.createItemType("_TOP_GROUPER_", "top_grouper", TopGrouper_XFormItem, RadioGrouper_XFormItem)
TopGrouper_XFormItem.prototype.borderCssClass = "TopGrouperBorder";
TopGrouper_XFormItem.prototype.labelCssClass = "GrouperLabel";
TopGrouper_XFormItem.prototype.labelLocation = _INLINE_;		// managed manually by this class
TopGrouper_XFormItem.prototype.insetCssClass = "GrouperInset";


// output the label
TopGrouper_XFormItem.prototype.outputHTMLStart = function (html,   currentCol) {
	html.append(
			"<div class=", this.getBorderCssClass(), ">",
				"<div ", this.getLabelCssString(),">", this.getLabel(), "</div>",
				"<div class=", this.getInsetCssClass(),">"
		);
}

TopGrouper_XFormItem.prototype.outputHTMLEnd = function (html,  currentCol) {
	html.append(
			"</div></div>"
		);
}

if (appNewUI) {
    XFormItemFactory.createItemType("_TOP_GROUPER_", "top_grouper", TopGrouper_XFormItem, CollapsedGroup_XFormItem);
}

BaseTopGrouper_XFormItem = function() {}
XFormItemFactory.createItemType("_BASE_TOP_GROUPER_", "base_top_grouper", BaseTopGrouper_XFormItem, RadioGrouper_XFormItem)
BaseTopGrouper_XFormItem.prototype.borderCssClass = "TopGrouperBorder";
BaseTopGrouper_XFormItem.prototype.labelCssClass = "GrouperLabel";
BaseTopGrouper_XFormItem.prototype.labelLocation = _INLINE_;		// managed manually by this class
BaseTopGrouper_XFormItem.prototype.insetCssClass = "GrouperInset";

// output the label
BaseTopGrouper_XFormItem.prototype.outputHTMLStart = function (html,   currentCol) {
    html.append(
            "<div class=", this.getBorderCssClass(), ">",
                "<div ", this.getLabelCssString(),">", this.getLabel(), "</div>",
                "<div class=", this.getInsetCssClass(),">"
        );
}

BaseTopGrouper_XFormItem.prototype.outputHTMLEnd = function (html,  currentCol) {
    html.append(
            "</div></div>"
        );
    }

/**
 * @class defines XFormItem type _SWITCH_
 * @constructor
 * 
 * @private
 */
Switch_XFormItem = function() {}
XFormItemFactory.createItemType("_SWITCH_", "switch", Switch_XFormItem, Group_XFormItem)

//	type defaults
Switch_XFormItem.prototype.labelLocation = _NONE_;
Switch_XFormItem.prototype.colSpan = "*";
Switch_XFormItem.prototype.width = "100%";
Switch_XFormItem.prototype.numCols = 1;

Switch_XFormItem.prototype.outputHTML = function (html) {
	Switch_XFormItem.outputItemList.call(this.getForm(),this.getItems(), this, html);
}

Switch_XFormItem.prototype.setElementEnabled = function (enable) {};

Switch_XFormItem.outputItemList = function (items, parentItem, html,   numCols, currentCol, skipTable, skipOuter) {
	if (parentItem.outputHTMLStart) {
		parentItem.outputHTMLStart(html,  currentCol);
	}
	var outerStyle = null;
	if(!skipOuter) {
		outerStyle = parentItem.getCssString();
		if (outerStyle != null && outerStyle != "") {
			parentItem.outputElementDivStart(html);
		}
	}
	for (var itemNum = 0; itemNum < items.length; itemNum++) {	
		var item = items[itemNum];
		var isNestingItem = (item.getItems() != null);
		var itemUsesParentTable = (item.getUseParentTable() != false);

		var writeElementDiv = item.getWriteElementDiv();
		var outputMethod = item.getOutputHTMLMethod();
		
		if (isNestingItem && itemUsesParentTable) {
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html,  currentCol);

		} else {

			// begin the element div, if required
			if (writeElementDiv) 	item.outputElementDivStart(html);
			
			// actually write out the item
			if (outputMethod) outputMethod.call(item, html,  0);

	
			// end the element div, if required
			if (writeElementDiv) 	item.outputElementDivEnd(html);
	
		}
		
		if(parentItem)
			parentItem.registerActiveChild(item);
		
		item.signUpForEvents();
		
		var itemUpdateMethod = item.getUpdateElementMethod();
		if(itemUpdateMethod) {
			var itemRefpath = item.getRefPath();
			if(itemRefpath) {
				var instance = this.getInstance();
				if(instance) {
					itemUpdateMethod.call(item, item.getInstanceValue());
				}
			}
		}
	}
	if (outerStyle != null && outerStyle != "") {
		parentItem.outputElementDivEnd(html);
	}


	if (parentItem.outputHTMLEnd) {
		parentItem.outputHTMLEnd(html,  currentCol);
	}		
}

/**
 * @class defines XFormItem type _REPEAT_
 * @constructor
 * 
 * @private
 */
Repeat_XFormItem = function() {
	Group_XFormItem.call(this);
}
XFormItemFactory.createItemType("_REPEAT_", "repeat", Repeat_XFormItem, Group_XFormItem)

//	type defaults
Repeat_XFormItem.prototype.useParentTable = false;
Repeat_XFormItem.prototype.writeElementDiv = true;
Repeat_XFormItem.prototype.numCols = 1;
Repeat_XFormItem.prototype.number = 1;
Repeat_XFormItem.prototype.showRemoveButton = true;
Repeat_XFormItem.prototype.showAddButton = true;
Repeat_XFormItem.prototype.alwaysShowAddButton = false;
Repeat_XFormItem.prototype.showMoveUpButton = false;
Repeat_XFormItem.prototype.showMoveDownButton = false;
Repeat_XFormItem.prototype.bmolsnr = true;
Repeat_XFormItem.prototype.enableDisableChecks = [XFormItem.prototype.hasWritePermission];
Repeat_XFormItem.prototype.visibilityChecks = [XFormItem.prototype.hasReadPermission];

Repeat_XFormItem.haveAnyRows = function () {
	return (this.getParentItem().getInstanceCount() != 0);
}

Repeat_XFormItem.isLastRow = function () {
	return ((this.getParentItem().getInstanceCount()-1) == this.getParentItem().instanceNum);
}

Repeat_XFormItem.isAddButtonVisible = function () {
	return (this.getParentItem().getParentItem().getAlwaysShowAddButton() || Repeat_XFormItem.isLastRow.call(this) || !(Repeat_XFormItem.haveAnyRows.call(this)));
}

Repeat_XFormItem.prototype.getRemoveButton = function () {
	if(!this.removeButton) {
		this.removeButton = {
			type:_BUTTON_, 
			label: AjxMsg.xformRepeatRemove, 
			//width:20,
			cssStyle:"margin-left:20px;",
			onActivate:function (event) {
				var repeatItem = this.getParentItem().getParentItem();
				repeatItem.removeRowButtonClicked(this.getParentItem().instanceNum);
			},
			visibilityChecks:[Repeat_XFormItem.haveAnyRows],
			visibilityChangeEventSources:[this.getRef()]
		};
		var label = this.getInheritedProperty("removeButtonLabel");
		if(label)
			this.removeButton.label = label;
		
		var width = this.getInheritedProperty("removeButtonWidth");		
		if (width)
			this.removeButton.width = width ;		
			
		var cssStyle = this.getInheritedProperty("removeButtonCSSStyle");
		if (cssStyle) 
			this.removeButton.cssStyle = cssStyle ;	
	}
	return this.removeButton;	
}

Repeat_XFormItem.prototype.getAddButton = function () {
	if(!this.addButton) {
		var showAddOnNextRow = this.getInheritedProperty("showAddOnNextRow");
		this.addButton = {
			ref:".",
			type:_BUTTON_, 
			label: AjxMsg.xformRepeatAdd, 
			onActivate:function (event) {
				var repeatItem = this.getParentItem().getParentItem();
				repeatItem.addRowButtonClicked(this.getParentItem().instanceNum);
			},
			visibilityChecks:[Repeat_XFormItem.isAddButtonVisible],
			visibilityChangeEventSources:[this.getRefPath()],
			forceUpdate:true
		};
		var label = this.getInheritedProperty("addButtonLabel");
		if(label)
			this.addButton.label = label;			
		
		var width = this.getInheritedProperty("addButtonWidth");		
		if (width)
			this.addButton.width = width ;

        var cssStyle = this.getInheritedProperty("addButtonCSSStyle");
		if (cssStyle)
			this.addButton.cssStyle = cssStyle ;

		if(showAddOnNextRow) {
			this.addButton.colSpan = "*";
		}
			
	}
	return this.addButton;	
}

Repeat_XFormItem.prototype.moveUpButton = {
	type:_BUTTON_, 
	label:"^", 
	width:20,
	cssStyle:"margin-left:20px;",
	onActivate:function (event) {
		var repeatItem = this.getParentItem().getParentItem();
		repeatItem.moveUpButtonClicked(this.getParentItem().instanceNum);
	}
}
Repeat_XFormItem.prototype.moveDownButton = {
	ref:".",
	type:_BUTTON_, 
	label:"v", 
	width:20,
	onActivate:function (event) {
		var repeatItem = this.getParentItem().getParentItem();
		repeatItem.moveDownButtonClicked(this.getParentItem().instanceNum);
	},
	forceUpdate:true
}

Repeat_XFormItem.groupVisibilityCheck = function () {
	return ( (this.instanceNum < this.getNumberToShow()) || (this.instanceNum < this.getInstanceCount()) || (this.instanceNum==0));	
}

Repeat_XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();

	if (items.length == 1 && items[0].items) {
		var group = items[0];
	} else {
		var group = {	
				ref: this.getRef(), 
				fromRepeat:true, 
//				useParentTable:true,
				type:_GROUP_, 
				numCols: items.length,
				items:[].concat(items),
				visibilityChangeEventSources:[this.getRefPath()],
				visibilityChecks:[function() {
					return (this.instanceNum==0 || (this.instanceNum < this.getNumberToShow()) || (this.instanceNum < this.getInstanceCount()));
				}]
			};
	}
	
	group.colSpan = 1;

	//Check if we have an explicit condition defined for Remove button
	
	// add the add and remove buttons to the original items array, if appropriate
	if (this.getShowRemoveButton()) {
		var button = this.getRemoveButton();
		group.items[group.items.length] = button;
		group.numCols++;			
	}
	if (this.getShowAddButton()) {
		var button = this.getAddButton();
	
		var showAddOnNextRow = this.getInheritedProperty("showAddOnNextRow");
		group.items[group.items.length] = button;
		if(showAddOnNextRow) {
			group.items[group.items.length] = 
			{type:_SPACER_, colSpan:(group.numCols-1), 
				visibilityChecks:[Repeat_XFormItem.isLastRow], 
				visibilityChangeEventSources:[this.getRefPath()]
			};
		} else {
			group.numCols++;
		}
	}
	if (this.getShowMoveUpButton()) {
		group.items[group.items.length] = this.getMoveUpButton();
		group.numCols++;
	}
	if (this.getShowMoveDownButton()) {
		group.items[group.items.length] = this.getMoveDownButton();
		group.numCols++;
	}

	// save off the original items in the group
	this.__originalItems = group;
	// and reset the items array
	this.items = [];
}

Repeat_XFormItem.prototype.makeRepeatInstance = function() {
	// NOTE: We always append the new items to the end, which is OK,
	//			since if a *data value* is inserted in the middle,
	//			each row will show the proper thing when the update script is called
	//
	//  NOTE: XFORMS SPEC REQUIRES REPEAT ITEMS TO START AT 1, this implementation starts at 0!!!
	//
	var originalGroup = this.__originalItems;
	var numCols = this.getNumCols();
	var newItems = [];
	
	for (var i = 0; i < numCols; i++) {
		var instanceNum = this.items.length;
	
		originalGroup.refPath = this.getRefPath() + "[" + instanceNum + "]";
	
		// initialize the originalGroup and its cloned items
		groupItem = this.getForm().initItem(originalGroup, this);
		groupItem.instanceNum = instanceNum;
	
		newItems.push(groupItem);
		this.items.push(groupItem);
	}	
	return newItems;
}


Repeat_XFormItem.prototype.outputHTML = function (html,   currentCol) {
	// output one item to start
	//	all other items will be output dynamically
	this.makeRepeatInstance();
	this.getForm().outputItemList(this.items, this, html, this.getNumCols(), 0);
}


Repeat_XFormItem.prototype.updateElement = function (value) {
	var form = this.getForm();
	
	var element = this.getElement();
	if (value == null || value === "") value = [];
	var itemsToShow = Math.max(value.length, this.getNumberToShow());
	var slotsPresent = this.items.length;

	var masterId = this.getId();
	if (itemsToShow > slotsPresent) {
		var missingElementCount = (itemsToShow - slotsPresent);
		// create some more slots and show them

		var table = element.getElementsByTagName("table")[0];
		var tbody = element.getElementsByTagName("tbody")[0];
	
		var tempDiv;	
		if (AjxEnv.isIE) {
			tempDiv = this.createElement("temp",null,"div","");
			tempDiv.display = "none";
		}
		while (this.items.length < itemsToShow) {
			var newItems = this.makeRepeatInstance(this);
			var html = new AjxBuffer();
			form.outputItemList(newItems, this, html,  this.getNumCols(), 0, true);
			if (AjxEnv.isIE) {
				tempDiv.innerHTML = "<table>" + html.toString() + "</table>";
				var rows = tempDiv.getElementsByTagName("table")[0].rows;
				for (var r = 0; r < rows.length; r++) {
					tbody.appendChild(rows[r]);
				}
			} else {
				var row = table.insertRow(-1);
				row.innerHTML = html;
			}
			var cnt = newItems.length;
			for(var i = 0; i <cnt; i++) {
				var updateMethod = newItems[i].getUpdateVisibilityMethod();
				if(updateMethod)
					updateMethod.call(newItems[i]);
				
				updateMethod = newItems[i].getUpdateEnabledDisabledtMethod();
				if(updateMethod)
					updateMethod.call(newItems[i]);				
			}
		}
	}
	/*var updateMethod = this.getUpdateVisibilityMethod();
	if(updateMethod)
		updateMethod.call(this);
	updateMethod = this.getUpdateEnabledDisabledtMethod();
	if(updateMethod)
		updateMethod.call(this);	*/
	
	XFormItem.prototype.updateElement.call(this, value);
}

Repeat_XFormItem.prototype.addRowButtonClicked = function (instanceNum) {
	var path = this.getRefPath();
	this.getModel().addRowAfter(this.getInstance(), path, instanceNum);
}

Repeat_XFormItem.prototype.removeRowButtonClicked = function (instanceNum) {
	var form = this.getForm();
	if (this.getOnRemoveMethod() ) {
		this.getOnRemoveMethod().call(this, instanceNum, form)
	} else {
		var path = this.getRefPath();
		this.getModel().removeRow(this.getInstance(), path, instanceNum);
	}
	this.items[instanceNum].clearError();
//	this.getForm().setIsDirty(true,this);
	
	var event = new DwtXFormsEvent(form, this, this.getInstanceValue());
	form.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
}

Repeat_XFormItem.prototype.getOnRemoveMethod = function() {
	return this.cacheInheritedMethod("onRemove","$onRemove","index,form");
}


/**
 * @class defines XFormItem type _REPEAT_GRID_
 * @constructor
 * 
 * @private
 */
Repeat_Grid_XFormItem = function() {}
XFormItemFactory.createItemType("_REPEAT_GRID_", "repeat_grid", Repeat_Grid_XFormItem, Repeat_XFormItem)
Repeat_Grid_XFormItem.prototype.showRemoveButton = false;
Repeat_Grid_XFormItem.prototype.showAddButton = false;
Repeat_Grid_XFormItem.numCols = 2;





/**
 * @class defines XFormItem type _COMPOSITE_
 * @constructor
 * 
 * @private
 */
Composite_XFormItem = function() {
	Group_XFormItem.call(this);
}
XFormItemFactory.createItemType("_COMPOSITE_", "composite", Composite_XFormItem, Group_XFormItem)

//	type defaults
Composite_XFormItem.prototype.useParentTable = false;
Composite_XFormItem.prototype.tableCssClass = "xform_composite_table";
Composite_XFormItem.prototype.focusable = false;

Composite_XFormItem.prototype.initializeItems = function () {
	var items = this.getItems();
	if (items == null) return;
	
	// make sure the numCols is defined (default to the number of items in the composite)
	if (this.numCols == null) this.numCols = items.length;
	
	// actually instantiate them as formItems
	this.items = this.getForm().initItemList(items, this);
}

Composite_XFormItem.onFieldChange = function(value, event, form) {
	if (this.getParentItem() && this.getParentItem().getOnChangeMethod()) {
		return this.getParentItem().getOnChangeMethod().call(this, value, event, form);
	} else {
		return this.setInstanceValue(value);
	}
}


SetupGroup_XFormItem = function() {
}
SetupGroup_XFormItem.prototype.width="100%";
XFormItemFactory.createItemType("_SETUPGROUP_", "setupgroup", SetupGroup_XFormItem, Composite_XFormItem)
SetupGroup_XFormItem.prototype.initializeItems = function () {
    var headerLabels = this.getInheritedProperty("headerLabels");
    var contentItems = this.getInheritedProperty("contentItems");
    this.items = [];
    this.width="100%";

    if (headerLabels.length!= 0 && headerLabels.length == contentItems.length) {
        var firstlabel = 1;
        var isLast;
        for (var i = 0; i < headerLabels.length; i++) {
            if (i != headerLabels.length - 1) {
                isLast = false;
            } else {
                isLast = true;
            }
            var result =  this.constructSingleGroup(headerLabels[i], contentItems[i], firstlabel, isLast);
            if (result != undefined) {
                this.items.push(result);
                firstlabel ++;
            }
        }
    }
    this.numCols = this.items.length;
    if (this.numCols > 1)  {
        var colSize =Math.floor(100/(this.numCols));
        var lastCol = 100 - colSize* (this.numCols - 1);
        var colArr = [];
        for (var i = 0; i < this.numCols - 1; i ++) {
            colArr.push(colSize + "%");
        }
        colArr.push(lastCol + "%");
        this.colSizes = colArr;
    }
    Composite_XFormItem.prototype.initializeItems.call(this);
}

SetupGroup_XFormItem.prototype.constructSingleGroup = function (headerLabel, contentItem, index, isLast) {
    var currentGroup = {type:_GROUP_, numCols:2, width: "100%", valign:_TOP_, items:[]};
    var labelMessage = (index) + "  " + headerLabel;
    /*Header Start*/
    var headerItems;
    if (isLast) {
        headerItems = {type:_OUTPUT_, colSpan: "*", value: labelMessage, cssClass: "ZaHomeSetupHeader ZaHomeSetupTitle"};
    } else {
        headerItems = {type:_GROUP_, colSpan: "*", numCols:3, cssClass: "ZaHomeSetupHeader",
            items:[
                {type:_OUTPUT_, value: labelMessage, cssClass: "ZaHomeSetupTitle"},
                {type:_SPACER_, width:"5px", colSpan:1},
                {type:_AJX_IMAGE_, src:"SetupArrow"}
            ]
        };
    }

    currentGroup.items.push(headerItems);
    /*Body Start*/
    var singleContentItem;
    var isAdd = false;
    var labelNumber = 1;
    var currentLabel ;
    for (var i = 0; i < contentItem.length; i++) {
        if (contentItem[i] && contentItem[i].value) {
            isAdd = true;
            currentLabel = labelNumber + ".";
            labelNumber ++;
            singleContentItem = {type:_OUTPUT_, label: currentLabel, value: contentItem[i].value, onClick: contentItem[i].onClick, labelCssClass:"ZaHomeLinkItemLabel", containerCssClass:"ZaLinkedItem"};
            currentGroup.items.push(singleContentItem);
        }
    }

    if (!isAdd)
        return undefined;
    else
        return currentGroup;
}
//Composite_XFormItem.prototype.getErrorContainer = function () {
//	
//}

/**
 * @class defines XFormItem type _DATE_
 * @constructor
 * 
 * @private
 */
Date_XFormItem = function() {}
XFormItemFactory.createItemType("_DATE_", "date", Date_XFormItem, Composite_XFormItem)

//	type defaults
Date_XFormItem.prototype.DATE_MONTH_CHOICES = [
				{value:1, label:I18nMsg.monthJanMedium},
				{value:2, label:I18nMsg.monthFebMedium},
				{value:3, label:I18nMsg.monthMarMedium},
				{value:4, label:I18nMsg.monthAprMedium},
				{value:5, label:I18nMsg.monthMayMedium},
				{value:6, label:I18nMsg.monthJunMedium},
				{value:7, label:I18nMsg.monthJulMedium},
				{value:8, label:I18nMsg.monthAugMedium},
				{value:9, label:I18nMsg.monthSepMedium},
				{value:10, label:I18nMsg.monthOctMedium},
				{value:11, label:I18nMsg.monthNovMedium},
				{value:12, label:I18nMsg.monthDecMedium}
			];
Date_XFormItem.prototype.DATE_DAY_CHOICES = ["1","2","3","4","5","6","7","8","9","10","11","12",
						  "13","14","15","16","17","18","19","20","21","22",
						  "23","24","25","26","27","28","29","30","31"];
Date_XFormItem.prototype.numCols = 3;
Date_XFormItem.prototype.items = [
	{	type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		relevantBehavior:_PARENT_,
		choices: Date_XFormItem.prototype.DATE_MONTH_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + (newValue.getMonth() + 1);
		},
		elementChanged:function (monthStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var month = parseInt(monthStr);
			if (!isNaN(month)) {
				month -= 1;
				currentDate.setMonth(month);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}
	},
	{	type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		relevantBehavior:_PARENT_,
		labelLocation:_NONE_,
		choices: Date_XFormItem.prototype.DATE_DAY_CHOICES,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + newValue.getDate();
		},
		elementChanged: function (dateStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var date = parseInt(dateStr);
			if (!isNaN(date)) {
				currentDate.setDate(date);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}
	},
	{	type:_TEXTFIELD_, 
		ref:".",
		relevantBehavior:_PARENT_,
		width:45,
		labelLocation:_NONE_,

		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			return "" + newValue.getFullYear();
		},
		elementChanged: function (yearStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other field???
		
			var year = parseInt(yearStr);
			if (!isNaN(year)) {
				currentDate.setYear(year);
			}
			this.getForm().itemChanged(this.getParentItem(), currentDate, event);
		}

	}
];



/**
 * @class defines XFormItem type _TIME_
 * @constructor
 * 
 * @private
 */
Time_XFormItem = function() {}
XFormItemFactory.createItemType("_TIME_", "time", Time_XFormItem, Composite_XFormItem)

//	type defaults
Time_XFormItem.prototype.numCols = 3;
Time_XFormItem.prototype.TIME_HOUR_CHOICES = ["1","2","3","4","5", "6","7","8","9","10","11","12"];
Time_XFormItem.prototype.TIME_MINUTE_CHOICES = ["00","05","10","15","20","25", "30","35","40","45","50","55"];
Time_XFormItem.prototype.TIME_AMPM_CHOICES = [I18nMsg.periodAm,I18nMsg.periodPm];


Time_XFormItem.prototype.items = [
	{	
		type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		choices: Time_XFormItem.prototype.TIME_HOUR_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var hours = "" + (newValue.getHours() % 12);
			if (hours == "0") hours = "12";
			return hours;
		},
		elementChanged:function (hoursStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());
			var hours = parseInt(hoursStr);
			if (!isNaN(hours)) {
				if (hours == 12) hours = 0;
				var wasPM = (currentDate.getHours() > 11);
				if (wasPM) hours += 12;
				this.__dummyDate.setHours(hours);
			}
			var parentItem = this.getParentItem();
			var elementChangedMethod = parentItem.getElementChangedMethod();
			if (elementChangedMethod != null) {
				elementChangedMethod.call(this.getParentItem(),this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	},

	{	
		type:_SELECT1_, 
		ref:".",
		width:50,
		valign:_MIDDLE_,
		choices: Time_XFormItem.prototype.TIME_MINUTE_CHOICES,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var minutes = newValue.getMinutes();
			minutes = Math.round(minutes / 5) * 5;
			minutes = (minutes < 10 ? "0" + minutes : "" + minutes);
			return minutes;
		},
		elementChanged:function (minutesStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());
		
			var minutes = parseInt(minutesStr);
			if (!isNaN(minutes)) {
				this.__dummyDate.setMinutes(minutes);
			}
			var parentItem = this.getParentItem();
			var elementChangedMethod = parentItem.getElementChangedMethod();
			if (elementChangedMethod!= null) {
				elementChangedMethod.call(this.getParentItem(), this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	},
	
	{	
		type:_SELECT1_, 
		ref:".",
		choices: Time_XFormItem.prototype.TIME_AMPM_CHOICES,
		width:50,
		valign:_MIDDLE_,
		labelLocation:_NONE_,
		getDisplayValue:function (newValue) {
			if (!(newValue instanceof Date)) newValue = new Date();
			var hours = newValue.getHours();
			if (hours > 11) return I18nMsg.periodPm;
			return I18nMsg.periodAm;
		},
		elementChanged:function (ampmStr, currentDate, event) {
			if (currentDate == null) currentDate = new Date();	//??? should get values of other fields???
			if (this.__dummyDate == null) {
				this.__dummyDate = new Date();
			}
			this.__dummyDate.setTime(currentDate.getTime());

			var isPM = (ampmStr == I18nMsg.periodPm);
			var hours = currentDate.getHours() % 12;
			
			this.__dummyDate.setHours(hours + (isPM ? 12 : 0));
			var parentItem = this.getParentItem();
			var elementChangedMethod = parentItem.getElementChangedMethod();
			if (elementChangedMethod!= null) {
				elementChangedMethod.call(this.getParentItem(), this.__dummyDate, currentDate, event);
			} else {
				this.getForm().itemChanged(this.getParentItem(), this.__dummyDate, event);
			}
		}
	}
];




/**
 * @class defines XFormItem type _DATETIME_
 * @constructor
 * 
 * @private
 */
Datetime_XFormItem = function() {}
XFormItemFactory.createItemType("_DATETIME_", "datetime", Datetime_XFormItem, Composite_XFormItem)

Datetime_XFormItem._datetimeFormatToItems = function(format, dateItem, timeItem) {
	var items = [];
	var pattern = /{(\d+),\s*(date|time)}/;
	var index = 0;
	while ((index = format.search(pattern)) != -1) {
		if (index > 0) {
			var item = { type: _OUTPUT_, value: format.substring(0,index), valign: _CENTER_ };
			items.push(item);
			format = format.substring(index);
		}
		var result = pattern.exec(format);
		items.push(result[2] == "date" ? dateItem : timeItem);
		format = format.substring(result[0].length);
	}
	if (format.length > 0) {
		var item = { type:_OUTPUT_, value: format };
		items.push(item);
	}
	return items;
}

//	type defaults
Datetime_XFormItem.prototype.numCols = 3;
Datetime_XFormItem.prototype.items = Datetime_XFormItem._datetimeFormatToItems(
	AjxMsg.xformDateTimeFormat,
	{type:_DATE_, ref:".", labelLocation:_NONE_},
	{type:_TIME_, ref:".", labelLocation:_NONE_}
);


/**
 * @class defines XFormItem type _WIDGET_ADAPTOR_
 *	An adaptor for using any random (non-DWT) widget in an xform
 *	NOTE: the generic implementation assumes:
 *			1) you'll create a method called "constructWidget()" which will construct the appropriate widget
 *			2) the widget has a function "insertIntoXForm(form, item, element)"
 *				(overide "this.insertWidget" to change)
 *			3) the widget has a function "updateInXForm(form, item, value, element)"
 *				(overide "this.updateWidget" to change)
 *
 * @constructor
 * 
 * @private
 */
WidgetAdaptor_XFormItem = function() {}
XFormItemFactory.createItemType("_WIDGET_ADAPTOR_", "widget_adaptor", WidgetAdaptor_XFormItem, XFormItem)

//	type defaults
WidgetAdaptor_XFormItem.prototype.writeElementDiv = true;
WidgetAdaptor_XFormItem.prototype.focusable = false;
//	methods

// implement the following to actually construct the instance of your widget
WidgetAdaptor_XFormItem.prototype.constructWidget = function () {}


//
//	insertElement must guarantee that each element is only inserted ONCE
//
WidgetAdaptor_XFormItem.prototype.insertElement = function () {
	if (!this.__alreadyInserted) {
		this.__alreadyInserted = true;
		
		// try to construct a widget
		var widget = this.constructWidget();

		// if we didn't get one, there's nothing to do here
		if (widget == null) return;

		// otherwise insert it into the form!
		this.widget = widget;
		this.insertWidget(this.getForm(), this.widget, this.getElement());
	}
}

WidgetAdaptor_XFormItem.prototype.showElement = function (id) {
	this.insertElement();
	XForm.prototype.showElement.call(this, id);
}

WidgetAdaptor_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.widget.insertIntoXForm(form, this, element);
}

WidgetAdaptor_XFormItem.prototype.updateElement = function(newValue) {
	if (this.__alreadyInserted) 
		this.updateWidget(newValue);
}
WidgetAdaptor_XFormItem.prototype.updateWidget = function (newValue) {
	this.widget.updateInXForm(this.getForm(), this, newValue, this.getElement());
}





/**
 * @class defines XFormItem type _DWT_ADAPTOR_"
 *
 *	An adaptor for using any random DWT widget in an xform
 *
 *	NOTE: the generic implementation assumes:
 *			1) you'll create a method called "constructWidget()" which will construct the appropriate widget
 *			2) you'll adapt "insertWidget(form,  widget, element)" to insert the widget properly
 *			3) you'll adapt "updateWidget(newValue)" to update the value properly
 * @constructor
 * 
 * @private
 */
Dwt_Adaptor_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_ADAPTOR_", "dwt_adaptor", Dwt_Adaptor_XFormItem, WidgetAdaptor_XFormItem)

//	type defaults
Dwt_Adaptor_XFormItem.prototype.focusable = false;
//	methods

Dwt_Adaptor_XFormItem.prototype.setElementEnabled = function(enabled) {
	WidgetAdaptor_XFormItem.prototype.setElementEnabled.call(this, enabled);
	if (this.widget) {
		this.widget.setEnabled(enabled);
	}
	this._enabled = enabled;
}

// implement the following to actually construct the instance of your widget
Dwt_Adaptor_XFormItem.prototype.constructWidget = function () {}


Dwt_Adaptor_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, element);
}

Dwt_Adaptor_XFormItem.prototype.updateWidget = function (newValue) {}

Dwt_Adaptor_XFormItem.prototype.getDwtSelectItemChoices = function () {
	if (this.__selOption != null) return this.__selOptions;
	
	var selectOptions = null;
	var choices = this.getChoices();
	if (choices != null) {
		var selectOptions = new Array(choices.length);
		for (var i = 0; i < choices.length; i++) {
			var choice = choices[i];
			var choiceValue = (choice instanceof Object ? choice.value : choice);
			var choiceLabel = (choice instanceof Object ? choice.label : choice);
			selectOptions[i] = new DwtSelectOptionData(choiceValue, choiceLabel);
		}
	}
	this.__selOptions = selectOptions;
	return this.__selOptions;
};

Dwt_Adaptor_XFormItem.prototype._addCssStylesToDwtWidget = function () {
	var style = this.getCssStyle();
	if (style != null){
		var styleArr = style.split(";");
		var el = this.widget.getHtmlElement();
		var kp;
		for (var i = 0 ; i < styleArr.length ; ++i ){
			kp = styleArr[i].split(":");
			if (kp.length > 0){
				var key = kp[0];
				if (key != null) {
					key = key.replace(/^(\s)*/,"");
				}
				if (key == "float"){
					key = (AjxEnv.isIE)? "styleFloat": "cssFloat";
				}
				var val = kp[1];
				if (val != null) {
					el.style[key] = val.replace(/^(\s)*/,"");
				}
			}
		}
	}
};

/**
 * @class defines XFormItem type  _DWT_BUTTON_
 * Adapts a DwtButton to work with the XForm
 * @constructor
 * 
 * @private
 */
Dwt_Button_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_BUTTON_", "dwt_button", Dwt_Button_XFormItem, Dwt_Adaptor_XFormItem)
Dwt_Button_XFormItem.estimateMyWidth = function (label,withIcon,extraMargin) {
    var width;
    if(ZaZimbraAdmin.LOCALE=="ja"||ZaZimbraAdmin.LOCALE=="ko"||ZaZimbraAdmin.LOCALE=="zh_CN"||ZaZimbraAdmin.LOCALE=="zh_HK")
         width = (String(label).length)*XForm.FONT_WIDTH1 + (String(label).length)*XForm.FONT_WIDTH2 + 14;
    else
	     width = (String(label).length/2)*XForm.FONT_WIDTH1 + (String(label).length/2)*XForm.FONT_WIDTH2 + 14;

    if(withIcon)
		width = width + 24;
	
	if(extraMargin>0)
		width = width + extraMargin;	
	return [width,"px"].join("");
}
//	type defaults
Dwt_Button_XFormItem.prototype.labelLocation = DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_CENTER;
Dwt_Button_XFormItem.prototype.writeElementDiv = false;
Dwt_Button_XFormItem.prototype.autoPadding= true;
//	methods

Dwt_Button_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
};

// implement the following to actually construct the instance of your widget
Dwt_Button_XFormItem.prototype.constructWidget = function () {
	var widget = this.widget = new DwtButton(this.getForm(), this.getLabelLocation(), this.getCssClass());
	var height = this.getHeight();
	var width = this.getWidth();
	
	var el = null;
	if (width != null || height != null){
		el = widget.getHtmlElement();
		if (width != null) el.style.width = width;
		if (height != null) el.style.height = height;
	} 
	this._addCssStylesToDwtWidget();
	
	var icon = this.getInheritedProperty("icon");
	if(icon != null) {
		widget.setImage(icon);
	}
	
	var isToolTip = false;	
	var toolTipContent = this.getInheritedProperty("toolTipContent");
	if(toolTipContent != null) {
		widget.setToolTipContent(toolTipContent);
		isToolTip = true;
	}
	
        var labelContent = this.getLabel();
	
	try{
		var size = Dwt.getSize(this.getContainer());
		if(labelContent){
			var totalCharWidth = AjxStringUtil.getWidth(labelContent);
			var textLength;
			if(icon){	
				textLength = size.x - 42; // exclude icons, paddings, margin, borders
			}
			else{
				textLength = size.x - 22; // exclude paddings, margin, borders
			}
			
			if( (textLength > 0) && (totalCharWidth > textLength)){
				if(!isToolTip){
                                	widget.setToolTipContent(labelContent);
                                }

				var totalNumber = labelContent.length;
				var textLength = textLength - AjxStringUtil.getWidth("..."); // three '.'
				var maxNumberOfLetters= Math.floor(textLength * totalNumber / totalCharWidth);
				if(textLength > 0){
					labelContent = labelContent.substring(0, maxNumberOfLetters) + "...";
				}
			}
			 
			el =  widget.getHtmlElement();
            var tableEl = el.firstChild;
            var isAutoPadding = this.getInheritedProperty("autoPadding");
            if(!tableEl.style.width && isAutoPadding){
                 tableEl.style.width = "100%";
            }

		}		
	}catch(ex){
	}

	widget.setText(labelContent);

	var onActivateMethod = this.getOnActivateMethod();
	if (onActivateMethod != null) {
		var ls = new AjxListener(this, onActivateMethod);
		widget.addSelectionListener(ls);
	}

	if (this._enabled !== void 0) {
		//this.widget = widget;
		this.setElementEnabled(this._enabled);
	}
	
	return widget;
}

Dwt_Button_XFormItem.prototype.getWidget =
function (){
	return this.widget ;
}

/**
 * @class defines XFormItem type _DWT_SELECT_
 * Adapts a DwtSelect to work with the XForm
 * @constructor
 * 
 * @private
 */
Dwt_Select_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_SELECT_", "dwt_select", Dwt_Select_XFormItem, Dwt_Adaptor_XFormItem)

//	type defaults
Dwt_Select_XFormItem.prototype.writeElementDiv = false;
//	methods

Dwt_Select_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
}

Dwt_Select_XFormItem.prototype.constructWidget = function () {
	var choices = this.getDwtSelectItemChoices(this.getChoices());

	var widget = this.widget = new DwtSelect(this.getForm(), choices);
	var height = this.getHeight();
	var width = this.getWidth();
	if (width != null || height != null){
		var el = widget.getHtmlElement();
		if (width != null) el.style.width = width;
		if (height != null) el.style.height = height;
	} 
	this._addCssStylesToDwtWidget();

	var onChangeFunc = new Function("event", 
			"var widget = event._args.selectObj;\r"
		  + "value = event._args.newValue; " + this.getExternalChangeHandler()
	);
	var ls = new AjxListener(this.getForm(), onChangeFunc);
	widget.addChangeListener(ls);

	if (this._enabled !== void 0) {
		//this.widget = widget;
		this.setElementEnabled(this._enabled);
	}
	return widget;
}

Dwt_Select_XFormItem.prototype.updateWidget = function (newValue) {
	this.widget.setSelectedValue(newValue);
}

Dwt_Select_XFormItem.prototype.setElementEnabled = function (enable) {
	this._enabled = enable;
	if (this.widget == null) return;
	if (enable) {
		this.widget.enable();
	} else {
		this.widget.disable();
	}
};

/**	
 * @class defines XFormItem type _DWT_COLORPICKER_
 * Adapts a DwtButtonColorPicker to work with the XForm
 * @constructor
 * 
 * @private
 */
Dwt_ColorPicker_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_COLORPICKER_", "dwt_colorpicker", Dwt_ColorPicker_XFormItem, Dwt_Adaptor_XFormItem)

Dwt_ColorPicker_XFormItem.prototype.cssStyle = "width:80px;";
Dwt_ColorPicker_XFormItem.prototype.nowrap = false;
Dwt_ColorPicker_XFormItem.prototype.labelWrap = true;
Dwt_ColorPicker_XFormItem.prototype.constructWidget = function () {
    var params = {
        parent: this.getForm(),
        allowColorInput: true,
        noFillLabel: ZaMsg.bt_reset
    };
    var widget = new DwtButtonColorPicker (params) ;
	widget.setActionTiming(DwtButton.ACTION_MOUSEDOWN);

    var buttonImage = this.getInheritedProperty("buttonImage") || "FontColor";
    widget.setImage(buttonImage);
	widget.showColorDisplay(true);
	widget.setToolTipContent(ZMsg.xformFontColor);
	if (this.getInstanceValue() != null) {
		widget.setColor(this.getInstanceValue());       
	}
//	widget.addSelectionListener(new AjxListener(this, this._colorOnChange)); //it cause the dwt color picker event handller is not invoked correctly
    widget.__colorPicker.addSelectionListener(new AjxListener(this, this._colorOnChange)) ;
	return widget;
}

Dwt_ColorPicker_XFormItem.prototype.updateWidget = function (newValue) {
	if(!this.widget)
		return;
		
	//if(window.console && window.console.log) console.log ("new color = " + newValue) ;
	if (newValue != null) {
		this.widget.setColor(newValue);
	}else { //ensure the empty color can be set in the UI
        this.widget.setColor("");            
    }
};

Dwt_ColorPicker_XFormItem.prototype._colorOnChange = function (event) {
	var value = event.detail;
    
    var elementChanged = this.getElementChangedMethod();
	if (elementChanged) {
		elementChanged.call(this,value, this.getInstanceValue(), event);
	}
	var onChangeFunc = this.getOnChangeMethod();
	if (onChangeFunc) {
		onChangeFunc.call(this, value, event, this.getForm());	
	}
};

/**	
 * @class defines XFormItem type _DWT_DATE_
 * Adapts a DwtCalendar to work with the XForm
 * @constructor
 * 
 * @private
 */
Dwt_Date_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_DATE_", "dwt_date", Dwt_Date_XFormItem, Dwt_Adaptor_XFormItem)

Dwt_Date_XFormItem.prototype.cssClass =  "xform_dwt_date";


//	methods

Dwt_Date_XFormItem.prototype.constructWidget = function () {
	var firstDayOfWeek = this.getInheritedProperty("firstDayOfWeek");
	var widget = new DwtButton(this.getForm());
	widget.setActionTiming(DwtButton.ACTION_MOUSEDOWN);

	// ONE MENU??
	var menu = this.menu = new DwtMenu(widget, DwtMenu.CALENDAR_PICKER_STYLE, null, null, this.getForm());
	menu.setSize("150");
	menu._table.width = "100%";
	widget.setMenu(menu, true);
	menu.setAssociatedObj(widget);

	// For now, create a new DwtCalendar for each of the buttons, since on
	// IE, I'm having trouble getting the one calendar to work.
	// TODO: Figure out the IE problem.
	//var cal = new DwtCalendar(menu);
	var cal = new DwtCalendar({parent:menu,firstDayOfWeek:(!AjxUtil.isEmpty(firstDayOfWeek) ? firstDayOfWeek : 0)});
	cal._invokingForm = this.getForm();
	cal._invokingFormItemId = this.getId();
	cal.setDate(new Date(), true);
	cal.addSelectionListener(new AjxListener(this, this._calOnChange));
	widget.__cal = cal;
	return widget; 
}

Dwt_Date_XFormItem.prototype.updateWidget = function (newValue) {
	if (newValue == null) newValue = new Date();
	this.widget.setText(this.getButtonLabel(newValue));
	this.widget._date = newValue;
	this.widget.__cal.setDate(newValue,true);
};


Dwt_Date_XFormItem.prototype._calOnChange = function (event) {
	var value = event.detail;
	var cal = event.item;
	var elemChanged = this.getElementChangedMethod();
	elemChanged.call(this,value, this.getInstanceValue(), event);	
};

Dwt_Date_XFormItem.prototype.getButtonLabel = function (newValue) {
	if (newValue == null || !(newValue instanceof Date)) return "";
        var formatter = AjxDateFormat.getDateInstance(AjxDateFormat.NUMBER);
	return formatter.format(newValue) ;//(newValue.getMonth()+1) + "/" + newValue.getDate() + "/" + (newValue.getFullYear());
};


/**
 * @class defines XFormItem type _DWT_TIME_
 * Adapts a DwtTimeSelect to work with the XForm
 * @constructor
 *
 * @private
 */
Dwt_Time_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_TIME_", "dwt_time", Dwt_Time_XFormItem, Dwt_Adaptor_XFormItem)

Dwt_Time_XFormItem.prototype.cssClass =  "xform_dwt_time";

Dwt_Time_XFormItem.prototype.constructWidget = function () {
	var widget = new DwtTimeSelect(this.getForm());
    widget.addChangeListener(this._onChange.bind(this));
    return widget;
};

Dwt_Time_XFormItem.prototype.updateWidget = function (newValue) {
	if (newValue == null) {
        newValue = new Date();
        newValue.setHours(0, 0, 0, 0);
    }
	this.widget.set(newValue);
};

Dwt_Time_XFormItem.prototype._onChange = function (event) {
	var value = this.widget.getValue();
	var elemChanged = this.getElementChangedMethod();
	elemChanged.call(this, value, this.getInstanceValue(), event);
};


/**
 * @class defines XFormItem type _DWT_DATETIME_
 * Composes a _DWT_DATE_ and a (non-DWT) _TIME_ to make a date/time editor, just for kicks.
 * @constructor
 * 
 * @private
 */
Dwt_Datetime_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_DATETIME_", "dwt_datetime", Dwt_Datetime_XFormItem, Composite_XFormItem)

//	type defaults
Dwt_Datetime_XFormItem.prototype.numCols = 3;
Dwt_Datetime_XFormItem.prototype.useParentTable = false;
Dwt_Datetime_XFormItem.prototype.cssClass =  "xform_dwt_datetime";
Dwt_Datetime_XFormItem.initialize = function(){
   Dwt_Datetime_XFormItem.prototype.items = Datetime_XFormItem._datetimeFormatToItems(
	AjxMsg.xformDateTimeFormat,
	{type:_DWT_DATE_, ref:".", labelLocation:_NONE_, errorLocation:_PARENT_,
	 elementChanged:
	 function (newDate, currentDate, event) {
	 	currentDate = currentDate ? currentDate : new Date();
		newDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), 0);
		var elementChangedMethod = this.getParentItem().getElementChangedMethod();
		if(elementChangedMethod)
			elementChangedMethod.call(this.getParentItem(),newDate, currentDate, event);
	 }
	},
	{type:_DWT_TIME_, ref:".", labelLocation:_NONE_, errorLocation:_PARENT_,
	 elementChanged:
	 function (newDate, currentDate, event) {
		currentDate = currentDate ? currentDate : new Date();
		//If time is changed set the full year of new date with current date.
		newDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		var elementChangedMethod = this.getParentItem().getElementChangedMethod();
		if(elementChangedMethod)
			elementChangedMethod.call(this.getParentItem(),newDate, currentDate, event);
	 }
	}
);
}
Dwt_Datetime_XFormItem.initialize();


/**
 * @class defines XFormItem type _DWT_LIST_
 * @constructor
 * 
 * @private
 */
Dwt_List_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_LIST_", "dwt_list", Dwt_List_XFormItem, Dwt_Adaptor_XFormItem)

//	type defaults
Dwt_List_XFormItem.prototype.writeElementDiv = false;
Dwt_List_XFormItem.prototype.widgetClass = DwtListView;
Dwt_List_XFormItem.prototype.bmolsnr = true;
Dwt_List_XFormItem.prototype.getOnSelectionMethod = function() {
	return this.cacheInheritedMethod("onSelection","$onSelection","event");
}


Dwt_List_XFormItem.prototype.constructWidget = function () {
	var headerList = this.getInheritedProperty("headerList");
	var listClass = this.getInheritedProperty("widgetClass");
	
	var hideHeader = this.getInheritedProperty("hideHeader");

	var widget = new listClass(this.getForm(), this.getCssClass(), null, ((hideHeader!=undefined && hideHeader==true ) ? null : headerList));
	var emptyText = this.getInheritedProperty("emptyText");
	if(emptyText !=null || emptyText==="")
		widget.emptyText = emptyText;
		
	if(hideHeader != undefined) {
		widget.hideHeader = hideHeader;
		if(hideHeader && headerList) {
			widget._headerList = headerList;
		}
	}	

	var multiselect = this.getInheritedProperty("multiselect");
	if(multiselect != undefined) {
		widget.setMultiSelect(multiselect);
	}
	if(this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight") && this.cacheInheritedMethod("getCustomWidth", "$getCustomWidth")) {	
		var height = this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight").call(this);
		var width = this.cacheInheritedMethod("getCustomWidth", "$getCustomWidth").call(this);
		if(width && height)
			widget.setSize(width, height);		
	} else {			
		//set the width height here.
		var width = this.getWidth();
		var height = this.getHeight();
		
		if(width && height)
			widget.setSize(width, height);
		
		//set the listDiv height
		if (height && height != Dwt.DEFAULT) {
			widget.setListDivHeight (height) ;
		}
	}		
	
	// make sure the user defined listener is called 
	// before our selection listener.
	var selMethod = this.getOnSelectionMethod();
	if (selMethod) {
		widget.addSelectionListener(new AjxListener(this, selMethod));
	} else {
		var localLs = new AjxListener(this, this._handleSelection);
		widget.addSelectionListener(localLs);
	}
	//check if createPopupMenu method is defined
	var createPopupMenumethod = this.cacheInheritedMethod("createPopupMenu","$createPopupMenu","parent");
	if(createPopupMenumethod != null) {
		createPopupMenumethod.call(this, widget);
	}
	var form=this.getForm();
	var container = (form.parent instanceof DwtControl) ? form.parent : DwtControl.fromElementId(window._dwtShellId);
	if(container) {
		if(this.cacheInheritedMethod("resizeHdlr", "$resizeHdlr") && this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight") && this.cacheInheritedMethod("getCustomWidth", "$getCustomWidth")) {
			container.addControlListener(new AjxListener(this, this.cacheInheritedMethod("resizeHdlr", "$resizeHdlr")));
		}
	}

	return widget;
};

Dwt_List_XFormItem.prototype.resizeHdlr = 
function() {
	try {
		var height = this.cacheInheritedMethod("getCustomHeight", "$getCustomHeight").call(this);
		var width = this.cacheInheritedMethod("getCustomWidth", "$getCustomWidth").call(this);		
		this.widget.setSize(width,height);
	} catch (ex) {
		alert(ex);
	}
};


Dwt_List_XFormItem.prototype.getSelection = function () {
	return this.widget.getSelection();
};

Dwt_List_XFormItem.prototype._handleSelection = function (event) {
	var modelItem = this.getModelItem();
	var event = new DwtXModelEvent(this.getInstance(), modelItem, null, null);
	modelItem.notifyListeners(DwtEvent.XFORMS_VALUE_CHANGED, event);
};

Dwt_List_XFormItem.prototype.insertWidget = function (form, widget, element) {
	this.getForm()._reparentDwtObject(widget, this.getContainer());
};

Dwt_List_XFormItem.prototype.updateWidget = function (newValue) {
	if (typeof (newValue) != 'undefined') {
		this.setItems(newValue);
	}
};

//the method used to compare the contents of the list array.
//because object  array  join alwasy return [Object Object]
//we need to compare the property values
//we should return once we find the differences
//Assume that itemArray and existingArr has the same length
Dwt_List_XFormItem.isItemsChanged = function (itemArray, existingArr) {
    var isChanged = false ;
    if ((itemArray._version !=null && existingArr._version !=null && (itemArray._version != existingArr._version ))
			|| (itemArray.length != existingArr.length)) {
        isChanged = true ;
    } else {
        var rows = [] ;
        var existingRows = [] ;
        for (var i=0; i < itemArray.length; i ++) {
            if (itemArray[i] instanceof Object)  {
                for (var p in itemArray[i]) {
                    rows.push (itemArray[i][p]) ;
                }
            } else {
                rows.push(itemArray[i]) ;
            }

            if (existingArr[i] instanceof Object)  {
                for (var p1 in existingArr[i]) {
                    existingRows.push (existingArr[i][p1]) ;
                }
            } else {
                existingRows.push(existingArr[i]) ;
            }

            if (rows.join() != existingRows.join()) {
                isChanged = true;
                break ;
            }else{
                rows = [];
                existingRows = [] ;
            }
        }
    }

    return isChanged ;
}
Dwt_List_XFormItem.prototype.setItems = function (itemArray){
	var list = this.widget.getList();
	var existingArr = new Array();
	var tmpArr = new Array();
	if (list) {
		existingArr = list.getArray();
	} 
	tmpArr = new Array();
	var defaultColumnSort = this.getInheritedProperty("defaultColumnSortable") ;
	if (itemArray && itemArray.length > 0) {	
		//we have to compare the objects, because XForm calls this method every time an item in the list is selected
		if (this.getForceUpdate() || Dwt_List_XFormItem.isItemsChanged(itemArray, existingArr)) {
            var preserveSelection = this.getInheritedProperty("preserveSelection");
			var selection = null;
			if(preserveSelection) {
				selection = this.widget.getSelection();
			}		
			var cnt=itemArray.length;
			for(var i = 0; i< cnt; i++) {
				tmpArr.push(itemArray[i]);		
			}
			//add the default sort column
			this.widget.set(AjxVector.fromArray(tmpArr), defaultColumnSort);
			if(itemArray._version != undefined && itemArray._version != null)
				this.widget.getList().getArray()._version = itemArray._version;
				
			if(preserveSelection && selection) {
				this.widget.setSelectedItems(selection);
			}
		}
	}else{
		//display the empty list (no result html)
		this.widget.set(AjxVector.fromArray([]), defaultColumnSort); 
	}
};

Dwt_List_XFormItem.prototype.appendItems = function (itemArray){ 
	this.widget.addItems(itemArray);
};


/**
 * @class defines XFormItem type _BUTTON_GRID_
 * @constructor
 * 
 * @private
 */
Button_Grid_XFormItem = function() {}
XFormItemFactory.createItemType("_BUTTON_GRID_", "button_grid", Button_Grid_XFormItem, WidgetAdaptor_XFormItem)

//	type defaults
Button_Grid_XFormItem.prototype.numCols = 5;
Button_Grid_XFormItem.prototype.cssClass = "xform_button_grid_medium";
Button_Grid_XFormItem.prototype.forceUpdate = true;


//	methods
Button_Grid_XFormItem.prototype.constructWidget = function () {
	var changeHandler = this.getExternalChangeHandler();
	var attributes = {
		numCols:this.getNumCols(),
		choices:choices.getChoiceObject(),
		cssClass:this.getCssClass(),
		onChange:changeHandler,
		addBracketingCells:(this.getAlign() == _CENTER_)
	}
	var multiple = this.getMultiple();
	if (multiple !== null) attributes.multiple = multiple;
	return new ButtonGrid(attributes);
}



/**
 * @class defines XFormItem type _DWT_CHOOSER_
 * @constructor
 * 
 * @private
 */
Dwt_Chooser_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_CHOOSER_", "chooser", Dwt_Chooser_XFormItem, Dwt_Adaptor_XFormItem);
Dwt_Chooser_XFormItem.prototype.widgetClass = DwtChooser;
Dwt_Chooser_XFormItem.prototype.listSize = 100;
/*
NOTE: this won't work because attributes.ref is accessed before this
method is called in XFormItemFactory#createItem.
Dwt_Chooser_XFormItem.prototype._setAttributes = function(attributes) {
	// allows "targetRef" alias for "ref" attribute
	if (!attributes.ref && attributes.targetRef) {
		attributes.ref = attributes.targetRef;
	}
	XFormItem.prototype._setAttributes.call(this, attributes);
}
*/
Dwt_Chooser_XFormItem.prototype.getSorted = function() {
	return this.getInheritedProperty("sorted");
}
Dwt_Chooser_XFormItem.prototype.getListCssClass = function() {
	return this.getInheritedProperty("listCssClass");
}

Dwt_Chooser_XFormItem.prototype.getTargetListCssClass = function() {
	return this.getInheritedProperty("targetListCssClass");
}

Dwt_Chooser_XFormItem.prototype.getSourceInstanceValue = function() {
	var items = this.getModel().getInstanceValue(this.getInstance(), this.getInheritedProperty("sourceRef"));
	//items must be either array or vector
	if (! items) {
		items = new AjxVector ();
	}else if (typeof items == "string") {
		items = new Array(items);
	}
	return items ;
}

Dwt_Chooser_XFormItem.prototype.getTargetInstanceValue = function() {
	var items = this.getInstanceValue();
	if (! items) {
		items = new AjxVector ();
	}else if (typeof items == "string") {
		items = new Array(items);
	}
	return items ;
}

Dwt_Chooser_XFormItem.prototype._handleStateChange = function(event) {
	var form = this.getForm();
	var id = this.getId();
	var widget = this.getWidget();
	var value = widget.getItems();
	this._skipUpdate = true;
	form.itemChanged(id, value);
	this._skipUpdate = false;
}

Dwt_Chooser_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var cssClass = this.getCssClass();
	var sourceListCssClass = this.getListCssClass();
	var targetListCssClass = this.getTargetListCssClass();
	var widgetClass = this.getInheritedProperty("widgetClass");
	if (sourceListCssClass && !targetListCssClass) {
		targetListCssClass = sourceListCssClass;
	}
	var listSize = this.getInheritedProperty("listSize");
	var params = {parent: form, 
				className: cssClass, 
				slvClassName: sourceListCssClass,
				tlvClassName: targetListCssClass, 
				layoutStyle: (this.getInheritedProperty("layoutStyle") ? this.getInheritedProperty("layoutStyle") : DwtChooser.HORIZ_STYLE),
				listSize: listSize, 
				sourceEmptyOk: true, 
				allButtons: true,
				listWidth: (this.getInheritedProperty("listWidth") ? this.getInheritedProperty("listWidth") : null),
				listHeight: (this.getInheritedProperty("listHeight") ? this.getInheritedProperty("listHeight") : null),
				tableWidth: (this.getInheritedProperty("tableWidth") ? this.getInheritedProperty("tableWidth") : null),
				labelWidth: (this.getInheritedProperty("labelWidth") ? this.getInheritedProperty("labelWidth") : null),
				splitButtons:this.getInheritedProperty("splitButtons")	
				};
	
	return new widgetClass(params);
}

Dwt_Chooser_XFormItem.prototype.updateWidget = function(newvalue, dedup, compareFunc) {
	if (this._skipUpdate) {
		return;
	}

	if (this._stateChangeListener) {
		this.widget.removeStateChangeListener(this._stateChangeListener);
	}
	else {
		this._stateChangeListener = new AjxListener(this, Dwt_Chooser_XFormItem.prototype._handleStateChange)
	}

	var origSourceItems = this.getSourceInstanceValue();
	var sourceItems;
	
	if(origSourceItems instanceof Array) { 
		var _tmpSrcItems = [];
		var cnt = origSourceItems.length;
		for(var i=0; i<cnt;i++) {
			_tmpSrcItems.push(origSourceItems[i]);
		}
		sourceItems = AjxVector.fromArray(_tmpSrcItems);
	} else {
		sourceItems = origSourceItems.clone();
	}
	
	var targetItems = this.getTargetInstanceValue();
	if(targetItems instanceof Array) targetItems = AjxVector.fromArray(targetItems);	
	if(dedup) {
		var cnt = targetItems.size();
		for(var i=0; i < cnt; i++) {
			if(compareFunc) {
			 	var ix=sourceItems.indexOfLike(targetItems.get(i),compareFunc);
			 	if(ix > -1) {
					sourceItems.removeAt(ix);
			 	}
			} else {
			 	var ix=sourceItems.indexOf(targetItems.get(i));
			 	if(ix > -1) {
					sourceItems.removeAt(ix);
			 	}
			}
		}
	}
	
	var sorted = this.getSorted();
	if (sorted) {
		sourceItems.sort();
		targetItems.sort();
	}

	this.widget.setItems(sourceItems);
	this.widget.setItems(targetItems, DwtChooserListView.TARGET);

	this.widget.addStateChangeListener(this._stateChangeListener);
}

//
// XFormItem class: "alert"
//

Dwt_Alert_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_ALERT_", "alert", Dwt_Alert_XFormItem, Dwt_Adaptor_XFormItem);

Dwt_Alert_XFormItem.prototype.colSpan = "*";
Dwt_Alert_XFormItem.prototype.labelLocation = _NONE_;

Dwt_Alert_XFormItem.prototype.getStyle = function() {
	return this.getInheritedProperty("style");
}
Dwt_Alert_XFormItem.prototype.getIconVisible = function() {
	return this.getInheritedProperty("iconVisible");
}
Dwt_Alert_XFormItem.prototype.getTitle = function() {
	return this.getInheritedProperty("title");
}
Dwt_Alert_XFormItem.prototype.getContent = function() {
	return this.getInheritedProperty("content");
}
Dwt_Alert_XFormItem.prototype.getAlertCssClass = function() {
	return this.getInheritedProperty("alertCssClass");
}

Dwt_Alert_XFormItem.prototype.constructWidget = function() {
	var style = this.getStyle();
	var iconVisible = this.getIconVisible();
	var title = this.getTitle();
	var content = this.getContent();
	var alertCssClass = this.getAlertCssClass();
	
	var form = this.getForm();
	var alert = new DwtAlert(form, alertCssClass);
	
	alert.setStyle(style);
	alert.setIconVisible(iconVisible);
	alert.setTitle(title);
	alert.setContent(content);
	
	// bug fix wrong IE box model when conculating the width
	if(AjxEnv.isIE){
		try{	
			var htmlElement = alert.getHtmlElement();
                	var size = Dwt.getSize(htmlElement);
		
			var container = this.getContainer();
			var containerSize =  Dwt.getSize(container);
			
			var style = DwtCssStyle.getComputedStyleObject(htmlElement);	
		        var bl = parseInt(style.borderLeftWidth)     || 1;
                        var br = parseInt(style.borderRightWidth)    || 1;
                        var pl = parseInt(style.paddingLeft)         || 5;
                        var pr = parseInt(style.paddingRight)        || 5;
                        var ml = parseInt(style.marginLeft)          || 5;
                        var mr = parseInt(style.marginRight)         || 5;
                        var extraWidth = bl + br + pl + pr + ml + mr;
			
			if(containerSize.x > extraWidth){
				size.x = containerSize.x - extraWidth;
				Dwt.setSize(htmlElement, size.x, size.y);
			}
		}catch(ex){
		}
	}	
	return alert;
}

Dwt_Alert_XFormItem.prototype.updateWidget = function(newvalue) {
	// nothing
	var content = this.getContent();
	if(!content && newvalue) {
		this.getWidget().setContent(newvalue);
	}
}

//
// XFormItem class: "dwt_tab_bar" ("tab_bar")
//

Dwt_TabBar_XFormItem = function() {}
XFormItemFactory.createItemType("_TAB_BAR_", "tab_bar", Dwt_TabBar_XFormItem, Dwt_Adaptor_XFormItem);
Dwt_TabBar_XFormItem.prototype.colSpan = "*";
Dwt_TabBar_XFormItem.prototype.labelLocation = _NONE_;
Dwt_TabBar_XFormItem.prototype.cssStyle = "margin-right: 5px";

// NOTE: Overriding the _TAB_BAR_
//XFormItemFactory.registerItemType(_TAB_BAR_, "tab_bar", Dwt_TabBar_XFormItem);

Dwt_TabBar_XFormItem.prototype._value2tabkey;
Dwt_TabBar_XFormItem.prototype._tabkey2value;

Dwt_TabBar_XFormItem.prototype._stateChangeListener;

Dwt_TabBar_XFormItem.prototype.getChoices = function() {
	return this.getInheritedProperty("choices");
}

Dwt_TabBar_XFormItem.prototype._handleStateChange = function(event) {
	var form = this.getForm();
	var widget = this.getWidget();
	
	var tabKey = widget.getCurrentTab();
	var newvalue = this._tabkey2value[tabKey];
	
	var id = this.getId();
	//release the focus  
	form.releaseFocus() ;
	form.itemChanged(id, newvalue, event, true);
}

Dwt_TabBar_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var cssClass = this.getCssClass();
	var btnCssClass = this.getInheritedProperty("buttonCssClass");	
	
	var widget = new DwtTabBarFloat(form, cssClass, btnCssClass);
    this._value2tabkey = {};
	this._tabkey2value = {};
	
	var choices = this.getChoices();
	if(choices.constructor == XFormChoices) {
		this.choices = choices;
		var listener = new AjxListener(this, this.dirtyDisplay);
		choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);	
		
		var values = this.getNormalizedValues();
		var labels = this.getNormalizedLabels();
		var cnt = values.length;
		for (var i = 0; i < cnt; i++) {
			// NOTE: DwtTabView keeps its own internal keys that are numerical
			this._value2tabkey[values[i]] = i + 1;
			this._tabkey2value[i + 1] = values[i];
			widget.addButton(i+1, labels[i]);
            widget.getButton(i+1).getHtmlElement().style ["paddingRight"] = "2px" ;
		}			
	} else {
		var cnt = choices.length;
		for (var i = 0; i < cnt; i++) {
			var choice = choices[i];
			// NOTE: DwtTabView keeps its own internal keys that are numerical
			this._value2tabkey[choice.value] = i + 1;
			this._tabkey2value[i + 1] = choice.value;
			widget.addButton(i+1, choice.label);
            widget.getButton(i+1).getHtmlElement().style ["paddingRight"] = "2px" ;
		}
	}
	
	return widget;
}

Dwt_TabBar_XFormItem.prototype.updateWidget = function(newvalue) {
	if (this.widget.isUpdating) {
		this.widget.isUpdating = false;
		return;
	}

	if (this._stateChangeListener) {
		this.widget.removeStateChangeListener(this._stateChangeListener);
	}
	else {
		this._stateChangeListener = new AjxListener(this, Dwt_TabBar_XFormItem.prototype._handleStateChange);
	}
	
	var tabKey = this._value2tabkey[newvalue];
	if (tabKey != this.widget.getCurrentTab()) {
		this.widget.openTab(tabKey);
	}

	this.widget.addStateChangeListener(this._stateChangeListener);
}

Dwt_TabBar_XFormItem.prototype.dirtyDisplay = function() {
	this.$normalizedChoices = null; //nuke these since they are out of date at this point
	if(this.choices && this.choices.constructor == XFormChoices) {
		var labels = this.getNormalizedLabels();
		var values = this.getNormalizedValues();
		var cnt = labels.length;
		for(var i=0;i<cnt;i++) {
			var tabKey = this._value2tabkey[values[i]];
			if(tabKey) {
				var btn = this.widget.getButton(tabKey);
				if(btn) {
					btn.setText(labels[i]);
				}
			}
		}
	}
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;	
}

//
// XFormItem class: "alert"
//

Dwt_ProgressBar_XFormItem = function() {}
XFormItemFactory.createItemType("_DWT_PROGRESS_BAR_", "dwt_progress_bar", Dwt_ProgressBar_XFormItem, Dwt_Adaptor_XFormItem);

Dwt_ProgressBar_XFormItem.prototype.constructWidget = function() {
	var form = this.getForm();
	var widget = new DwtProgressBar(form, null);
	var maxvalue = this.getInheritedProperty("maxValue");
	if(!maxvalue) {
		this.maxValueRef = this.getInheritedProperty("maxValueRef");
		maxvalue = this.getModel().getInstanceValue(this.getInstance(), this.maxValueRef)
	}
	widget.setMaxValue(maxvalue);
	
	var progressCssClass = this.getInheritedProperty("progressCssClass");
	if(progressCssClass) {
		widget.setProgressCssClass(progressCssClass);
	}
	
	var wholeCssClass = this.getInheritedProperty("wholeCssClass");
	if(wholeCssClass) {
		widget.setWholeCssClass(wholeCssClass);
	}	
	return widget;
}

Dwt_ProgressBar_XFormItem.prototype.updateWidget = function(newvalue) {
	// nothing
	if(!newvalue)
		newvalue=0;
	if(this.maxValueRef) {
		maxvalue = this.getModel().getInstanceValue(this.getInstance(), this.maxValueRef)
		this.getWidget().setMaxValue(maxvalue);	
	}
	this.getWidget().setValue(newvalue);
}
}
if (AjxPackage.define("ajax.dwt.xforms.XFormChoices")) {
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
XFormChoices = function(choiceObject, type, valueProperty, labelProperty) {
	if (arguments.length == 0) return;
	
	if (choiceObject != null) this._choiceObject = choiceObject;
	if (type != null) this._type = type;
	if (valueProperty != null) this._valueProperty = valueProperty;
	if (labelProperty != null) this._labelProperty = labelProperty;
	
	this._choiceChangeTime = new Date().getTime();
	this._lastNormalizeTime = 0;
	
	if (this._type == XFormChoices.AUTO) this.autoDetermineType();
	
	this._eventMgr = new AjxEventMgr();
}
XFormChoices.prototype = new Object();
XFormChoices.prototype.constructor = XFormChoices;


//
//	static methods
//
XFormChoices.normalizeChoices = function (choices, type, valueProperty, labelProperty) {
	var values;
	var labels;
    var visible; //indicate if the menu item choice is visible
    var totalInvisibleChoices = 0;
    
    switch (type) {
		case XFormChoices.SIMPLE_LIST:
			values = [].concat(choices)
			labels = [].concat(choices)

			break;


		case XFormChoices.OBJECT_LIST:
			values = []; labels = []; visible = [];
			if (valueProperty == null) valueProperty = "value";
			if (labelProperty == null) labelProperty = "label";

            var cnt = choices.length;
			for (var i = 0; i < cnt; i++) {
				if(choices[i]) {				
					values.push(choices[i][valueProperty]);
					labels.push(choices[i][labelProperty]);
                    if (choices[i]["visible"] == false) { //by default, the choice should be visible unless specified as false
                        visible.push(false) ;
                        totalInvisibleChoices ++ ;
                    }else{
                        visible.push(true) ;
                    }
                }
			}
		
			break;
		case XFormChoices.OBJECT_REFERENCE_LIST:
			values = []; labels = [];
			if (labelProperty == null) labelProperty = "label";
			var cnt = choices.length;
			for (var i = 0; i < cnt; i++) {
				if(choices[i]) {
					values.push(choices[i]);
					labels.push(choices[i][labelProperty]);
				}
			}		
			break;	

		case XFormChoices.HASH:
			values = []; labels = [];
			for (var prop in choices) {
				values.push(prop);
				labels.push(choices[prop]);
			}
		
			break;
	}
	return {values:values, labels:labels, visible:visible, totalInvisibleChoices: totalInvisibleChoices };
}


// constants
XFormChoices.AUTO = "auto";
XFormChoices.SIMPLE_LIST = "list";
XFormChoices.HASH = "hash";
XFormChoices.OBJECT_LIST = "object";
XFormChoices.OBJECT_REFERENCE_LIST = "object_reference_list";

// type defaults
XFormChoices.prototype._type = XFormChoices.AUTO;
XFormChoices.prototype._valueProperty = "value";
XFormChoices.prototype._labelProperty = "label";
XFormChoices.prototype._visibleProperty = "visible" ;


XFormChoices.prototype.getChoiceObject = 
function () {
	return this._choiceObject;
}

XFormChoices.prototype.autoDetermineType = function () {
	var type;

	var choices = this._choiceObject;
	if (choices) {
		if (AjxUtil.isArray(choices)) {
			var firstChoice = choices[0];
			if (AjxUtil.isObject(firstChoice)) {
				type = XFormChoices.OBJECT_LIST;
			} else {
				type = XFormChoices.SIMPLE_LIST;
			}
		} else if (AjxUtil.isObject(choices)) {
			type = XFormChoices.HASH;
		}
	}
	
	if (type == null) type = XFormChoices.SIMPLE_LIST;
	this._type = type;
}

XFormChoices.prototype.setChoices = function (choiceObject) {
	this._choiceObject = choiceObject;
}

XFormChoices.prototype.getChoices = function () {
	// only normalize if dirty
	if (this._lastNormalizeTime == this._choiceChangeTime && this.$normalizedChoices) {
		return this.$normalizedChoices;
	}
	this._lastNormalizeTime = this._choiceChangeTime;

	this.$normalizedChoices = XFormChoices.normalizeChoices(this._choiceObject, this._type, this._valueProperty, this._labelProperty);
	return this.$normalizedChoices;
}

XFormChoices.prototype.getChoiceByValue = function(value) {
	switch (this._type) {
		case XFormChoices.SIMPLE_LIST: 
			return value;
			break;
		
		case XFormChoices.OBJECT_LIST: 
			var valueProperty = this._valueProperty || "value";
			for (var i = 0; i < this._choiceObject.length; i++) {
				if (this._choiceObject[i][valueProperty] == value) {
					return this._choiceObject[i];
				}
			}
			break;
		
		case XFormChoices.OBJECT_REFERENCE_LIST:
			for (var i = 0; i < this._choiceObject.length; i++) {
				if (this._choiceObject[i] == value) {
					return this._choiceObject[i];
				}
			}
			break;
		case XFormChoices.HASH: 
			return this._choiceObject[value];
		break;
	}
	return null;
}

XFormChoices.prototype.dirtyChoices = function () {
	this._choiceChangeTime = new Date().getTime();
	this.notifyListeners(DwtEvent.XFORMS_CHOICES_CHANGED, {});
}






//
//	listening -- these are from DwtControl  -- make an installable interface?
//
XFormChoices.prototype.addListener = function(eventType, listener) {
	return this._eventMgr.addListener(eventType, listener); 	
}

XFormChoices.prototype.notifyListeners = function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
}

XFormChoices.prototype.isListenerRegistered = function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
}

XFormChoices.prototype.removeListener =  function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
}
}
if (AjxPackage.define("ajax.dwt.xforms.OSelect_XFormItem")) {
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
 * OSelect1_XFormItem class -- lightning fast SELECT type widget
 * @author Owen Williams, Greg Solovyev
 * 
 * @private
 */
OSelect1_XFormItem = function(){ this._enabled = true; }
XFormItemFactory.createItemType("_OSELECT1_", "oselect1", OSelect1_XFormItem, Select1_XFormItem);

OSelect1_XFormItem._mouseWheelEventAttached = false;
OSelect1_XFormItem._mouseWheelCurrentSelect;
OSelect1_XFormItem._mouseWheelHideMenu = function() {
	//DBG.println(AjxDebug.DBG1, "OSelect1_XFormItem._mouseWheelCurrentSelect.hideMenu hiding menu time " +  (new Date()).getTime());
	OSelect1_XFormItem._mouseWheelCurrentSelect.hideMenu();
};

// override the default SELECT type
//XFormItemFactory.registerItemType("_SELECT1_", "select1", OSelect1_XFormItem)
OSelect1_XFormItem.prototype.focusable = false;
OSelect1_XFormItem.prototype.cssClass = "oselect";
OSelect1_XFormItem.prototype.multiple = false;
OSelect1_XFormItem.prototype.writeElementDiv = false;
OSelect1_XFormItem.prototype.width = "auto";
OSelect1_XFormItem.prototype.editable = false;
OSelect1_XFormItem.prototype.menuUp = false;
OSelect1_XFormItem.prototype.noteUp = false;
OSelect1_XFormItem.prototype.inputSize = 25;
OSelect1_XFormItem.prototype.bmolsnr = true;
OSelect1_XFormItem.prototype.nowrap = false;
OSelect1_XFormItem.prototype.labelWrap = true;
//TODO: get showing check working for the normal SELECT, requires:
//		* separate notion of hilited row (for mouseover) and selected row(s)
//		* teach select1 that more than one value may be selected (same as select)
//		* convert OSELECT_CHECK to just use showCheck?
//		* does &radic; work everywhere?  Use an image?
OSelect1_XFormItem.prototype.setMenuWidth = true;
OSelect1_XFormItem.prototype.showCheck = false;
OSelect1_XFormItem.prototype.checkHTML = "&radic;";
OSelect1_XFormItem.MENU_DIR_DOWN=1;
OSelect1_XFormItem.MENU_DIR_UP=2;
OSelect1_XFormItem.MENU_DIR_UNKNOWN=0;
OSelect1_XFormItem.NOTE_HEIGHT=22;
OSelect1_XFormItem.prototype.menuDirection = OSelect1_XFormItem.MENU_DIR_UNKNOWN;
OSelect1_XFormItem.prototype.visibilityChecks = [XFormItem.prototype.hasReadPermission];
OSelect1_XFormItem.prototype.enableDisableChecks = [XFormItem.prototype.hasWritePermission];

//	methods
OSelect1_XFormItem.prototype.initFormItem = function () {
	// if we're dealing with an XFormChoices object...
	var choices = this.getChoices();
	if (choices == null || choices.constructor != XFormChoices) return;

	//	...set up to receive notification when its choices change
	var listener = new AjxListener(this, this.choicesChangeLsnr);
	choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);
}

OSelect1_XFormItem.prototype.updateElement = function (newValue) {
	if (this.choicesAreDirty()) this.updateChoicesHTML();
	// hack: if this item can display multiple values and there's a comma in the value
	//		assume it's a list of values
	if (this.getMultiple() && newValue != null && newValue.indexOf(",") > -1) {
		newValue = newValue.split(",");
		for (var i = 0; i < newValue.length; i++) {
			newValue[i] = this.getChoiceLabel(newValue[i]);
		}
	} else {
		newValue = this.getChoiceLabel(newValue);
	}
	if (newValue == null) newValue = "";
	
	var el = this.getDisplayElement();

	if (el) {
		if(this.getInheritedProperty("editable")) {
			if((!newValue || newValue=="") && el.value != newValue) {
				var i=0;
			}
			el.value = newValue;
			//DBG.println(AjxDebug.DBG1, AjxBuffer.concat(this.getId(),".value = ",newValue));
			if(this.getElement() && el.offsetWidth && this.getElement().style)
				this.getElement().style.width = el.offsetWidth + 20 + 'px';
				
		} else {
			// Encode data before appending to dom
			el.innerHTML = AjxStringUtil.htmlEncode(newValue);
		}
		//el.readOnly = !this.getInheritedProperty("editable");
	}
}

OSelect1_XFormItem.prototype.getShowCheck = function () {
	return this.cacheInheritedProperty("showCheck", "$showCheck");
}

OSelect1_XFormItem.prototype.getCheckHTML = function () {
	return this.cacheInheritedProperty("checkHTML", "$checkHTML");
}


OSelect1_XFormItem.prototype.getMenuElementId = function () {
	return "___OSELECT_MENU___";
}
OSelect1_XFormItem.prototype.getMenuElement = function () {
	var id = this.getMenuElementId();
	var el = this.getElement(id);
	if (el == null) {
		el = this.createElement(id, null, "div", "MENU CONTENTS");
	}
	return el;
}

OSelect1_XFormItem.prototype.getNoteElementId = function () {
	return "___OSELECT_NOTE___";
}
OSelect1_XFormItem.prototype.getNoteElement = function () {
	var id = this.getNoteElementId();
	var el = this.getElement(id);
	if (el == null) {
		el = this.createElement(id, null, "div", "NOTE CONTENTS");
	}
	return el;
}
/*OSelect1_XFormItem.prototype.setError = function (message, childError) {
	if(window.console && window.console.log) console.log("Showing error note");
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().setError(message, true);
		return;
	}
	this.showNote(message, this.getErrorNoteCssClass());
	this.__errorState = XFormItem.ERROR_STATE_ERROR;
}

OSelect1_XFormItem.prototype.clearError = function () {
	if(window.console && window.console.log) console.log("Hiding error note");
	var errLoc = this.getErrorLocation();
	if (errLoc == _PARENT_ || errLoc == _INHERIT_){
		this.getParentItem().clearError();
		return;
	}
	this.hideNote();
	this.__errorState = XFormItem.ERROR_STATE_VALID;
}*/

OSelect1_XFormItem.prototype.showMenu = function() {
	if(!this._enabled)
		return;
	if(window.console && window.console.log) console.log("Showing menu");
	this.hideInputTooltip();
	
	if (AjxEnv.isIE && !OSelect1_XFormItem._mouseWheelEventAttached) {
		var form = this.getForm();
		var formElement = form.getHtmlElement();
		if (formElement.attachEvent) {
			formElement.attachEvent("onmousewheel", OSelect1_XFormItem._mouseWheelHideMenu);
			OSelect1_XFormItem._mouseWheelCurrentSelect = this;
			OSelect1_XFormItem._mouseWheelEventAttached = true;
		}
	}

	var menu = this.getMenuElement();
	if (menu == null) return; 

	menu.className = this.getMenuCssClass();
	menu.innerHTML = this.getChoicesHTML();	
	var bounds;
	//bounds = this.getBounds(this.getElement().childNodes[0]);
	if(this.getInheritedProperty("editable")) {
		bounds = this.getBounds(this.getDisplayElement());
	} else {
		bounds = this.getBounds(this.getElement());
	}
	var w =DwtShell.getShell(window).getSize();
	var wh = w.y;
	var WINDOW_GUTTER = 8;
	menu.style.left = parseInt(bounds.left) + 'px';
	menu.style.top = parseInt(bounds.top) + parseInt(bounds.height) - 1 + 'px';
	var choices = this.getNormalizedChoices();
	if(choices && choices.values) {
		menu.style.overflow="auto";
        var visibleChoices = choices.values.length - choices.totalInvisibleChoices;
        menu.style.height = "auto";
    }

	var value = this.getInstanceValue();
	var getDisplayValueMethod = this.getDisplayValueMethod();
	if (getDisplayValueMethod) {
		value = getDisplayValueMethod.call(this, value);
	}
	var selectedItemNum = this.getChoiceNum(value);
	this.__currentHiliteItem = selectedItemNum;
	this.hiliteChoice(selectedItemNum);
	menu.style.zIndex = Dwt.Z_HIDDEN;
	menu.style.display = "block";


	var mBounds = this.getBounds(menu);
	var menuHeight = mBounds.height;
	var menuTop = mBounds.top;
    if (this.getInheritedProperty("setMenuWidth") == true) {
        if (AjxEnv.isIE) {
            if(this.getInheritedProperty("editable")) {
                menu.style.width = parseInt(bounds.width)+4 + 'px';
                menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width) - 1 + 'px';
            } else {
                menu.style.width = parseInt(bounds.width)+2 + 'px';
                menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width) - 1 + 'px';
            }
        } else {
            if(this.getInheritedProperty("editable")) {
                menu.style.width = parseInt(bounds.width)-5 + 'px';
                menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width) - 6 + 'px';
            } else {
                menu.style.width = parseInt(bounds.width)-3 + 'px';
                menu.getElementsByTagName("table")[0].style.width = parseInt(bounds.width) - 4 + 'px';
            }
        }
    }
	if(menuHeight + menuTop > wh - WINDOW_GUTTER) {
		//menu does not fit downwards - check if it fits upwards
		if((bounds.top - menuHeight) > WINDOW_GUTTER) {
			//yes - it fits upwards
			
			menu.style.top = bounds.top - menuHeight + 'px';
			menu.getElementsByTagName("table")[0].className = this.getChoiceTableCssClass();				
		} else {
			/*
			* menu is too big to expand either up or down 
			* make it expand wherever ther is more space and make it scrollable
			*/
			if(bounds.top > ((wh - WINDOW_GUTTER*2)/2) ) {
				//expand upwards
				menu.style.height = parseInt(bounds.top) - WINDOW_GUTTER + 'px';
				menu.style.top = WINDOW_GUTTER + 'px';
				this.menuDirection = OSelect1_XFormItem.MENU_DIR_UP;
			} else {
				//expand downwards
				menu.style.top	= 	parseInt(menu.style.top)+2 + 'px';
				menu.style.height = wh-WINDOW_GUTTER-parseInt(menu.style.top) + 'px';
				this.menuDirection = OSelect1_XFormItem.MENU_DIR_DOWN;
			}

            if(!AjxEnv.isIE){
                menu.style.height = parseInt(menu.style.height) - 11;
            }
			menu.style.overflow="auto";	
			menu.getElementsByTagName("table")[0].className = this.getChoiceScrollTableCssClass();
			menu.getElementsByTagName("table")[0].width="100%";
		} 
	} else {
		menu.getElementsByTagName("table")[0].className = this.getChoiceTableCssClass();
	}

    if(!AjxEnv.isIE && menu.clientWidth && menu.scrollWidth && (menu.scrollWidth > menu.clientWidth)){
        menu.style.overflow="auto";
    }

	menu.style.zIndex = 1000000;
	if (this.$hideListener == null) {
		this.$hideListener = new AjxListener(this, this.oMouseUp);
	}
	
	if (this.$outsideMouseDownListener == null) {
		this.$outsideMouseDownListener = new AjxListener(this, this.onOutsideMouseDown);
	}

	AjxCore.addListener(window, DwtEvent.ONMOUSEUP, this.$hideListener);
	AjxCore.addListener(document.body, DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);
	Dwt.setHandler(this.getForm().getHtmlElement(), DwtEvent.ONMOUSEWHEEL, this.$outsideMouseDownListener);	
	DwtEventManager.addListener(DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);	
	this.menuUp = true;
}

OSelect1_XFormItem.prototype.choicesChangeLsnr = function () {
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;
	if(this.menuUp)
		this.showMenu();
}

OSelect1_XFormItem.prototype.redrawChoices = function () {
	var menu = this.getMenuElement();
	if (menu == null) return; 

	menu.innerHTML = this.getChoicesHTML();		
}

OSelect1_XFormItem.prototype.hideMenu = function () {
	if(!this.menuUp) {
		return;
	}	
	if(window.console && window.console.log) console.log("Hiding menu");
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	setTimeout(this.getFormGlobalRef()+".getElement('" + this.getMenuElementId() + "').style.display = 'none'", 10);

	AjxCore.removeListener(window, DwtEvent.ONMOUSEUP, this.$hideListener);
	AjxCore.removeListener(document.body, DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);
	Dwt.clearHandler(this.getForm().getHtmlElement(), DwtEvent.ONMOUSEWHEEL);
	DwtEventManager.removeListener(DwtEvent.ONMOUSEDOWN, this.$outsideMouseDownListener);
	if (AjxEnv.isIE &&  OSelect1_XFormItem._mouseWheelEventAttached) {
		var form = this.getForm();
		var formElement = form.getHtmlElement();
		if (formElement.detachEvent) {
			if (window.event != null) window.event.cancelBubble = true;
			formElement.detachEvent("onmousewheel", OSelect1_XFormItem._mouseWheelHideMenu);
			OSelect1_XFormItem._mouseWheelEventAttached = false;
			OSelect1_XFormItem._mouseWheelCurrentSelect = null;
		}
	}
	this.menuUp = false;
	this.hideNote();
}

OSelect1_XFormItem.prototype.moveMenuY = function (y, shorten, lengthen) {
	var menu = this.getMenuElement();
	if (menu == null) return; 
	var mBounds = this.getBounds(menu);
	var menuHeight = mBounds.height;
	var menuTop = mBounds.top;
	var newTop = parseInt(menuTop)+parseInt(y);
	var newBotton = parseInt(newTop)+parseInt(menuHeight);
	menu.style.top = newTop + 'px';
	//shorten the menu
	if(shorten) {
		menu.style.height = parseInt(menu.style.height)-Math.abs(parseInt(y)) + 'px';
	} else if(lengthen) {
		menu.style.height = parseInt(menu.style.height)+Math.abs(parseInt(y)) + 'px';
	}
	
}

OSelect1_XFormItem.prototype.showNote = function(noteText, noteClass) {
	var note = this.getNoteElement();
	if(!note == null) return;
	note.className = noteClass ? noteClass : this.getNoteCssClass();
	note.innerHTML = noteText;	
	note.style.display = "block";
	var bounds;
	if(this.getInheritedProperty("editable")) {
		bounds = this.getBounds(this.getDisplayElement());
	} else {
		bounds = this.getBounds(this.getElement());
	}
	//note.style.width = menu.style.width;
	note.style.left = bounds.left + 'px';
	if(this.menuDirection == OSelect1_XFormItem.MENU_DIR_UP) {
		note.style.top = bounds.top + bounds.height + 'px';
		//this.moveMenuY((-1)*OSelect1_XFormItem.NOTE_HEIGHT,true,false);
	} else {
		note.style.top = bounds.top - OSelect1_XFormItem.NOTE_HEIGHT + 'px';
		//this.moveMenuY(OSelect1_XFormItem.NOTE_HEIGHT,true,false);
	}
	note.style.zIndex = 1000000;
	this.noteUp = true;
}

OSelect1_XFormItem.prototype.hideNote = function() {
	if(!this.noteUp) return;
	var note = this.getNoteElement();
	if(!note == null) return;
	note.innerHTML = "";	
	note.style.display = "none";	
	note.style.zIndex = Dwt.Z_HIDDEN;
	this.noteUp = false;
}

OSelect1_XFormItem.prototype.oMouseUp = function (ev) {
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	ev = ev || window.event;
	var found = false;
    if (ev) {
		// figure out if we are over the menu that is up
		var htmlEl = DwtUiEvent.getTarget(ev);
		var inputId = this.getId()+"_display";
		var arrowId = this.getId() + "_arrow_button";
	//	DBG.println(AjxDebug.DBG1, AjxBuffer.concat("oMouseUp; htmlEl.nodeName=",htmlEl.nodeName," htmlEl.localName = ", htmlEl.nodeName));
		//check if the user clicked on the scrollbar
			if(htmlEl.localName == "scrollbar" && ( (htmlEl.parentNode && htmlEl.parentNode.id=="___OSELECT_MENU___") || (htmlEl.id && htmlEl.id=="___OSELECT_MENU___"))) { 
				found = true;
			} else if (htmlEl.id && htmlEl.id == "___OSELECT_MENU___"){
				found = true;
			} else if (htmlEl.id && htmlEl.id == inputId){
				found = true;
			} else if (htmlEl.id && htmlEl.id == arrowId){
				found = true;
			}
	}


	if(!found) {
		//DBG.println(AjxDebug.DBG1, "OSelect1_XFormItem.oMouseUp hiding menu time " +  (new Date()).getTime());
		this.hideMenu();
	}	
	return true;
}

OSelect1_XFormItem.prototype.onOutsideMouseDown = function (ev) {
	// hide the menu on a timer so we don't have to deal with wierd selection bugs
	ev = ev || window.event;
	var found = false;
	var htmlEl;
    if (ev) {
		// figure out if we are over the menu that is up
		htmlEl = DwtUiEvent.getTarget(ev);
		var inputId = this.getId()+"_display";
		var arrowId = this.getId() + "_arrow_button";
		if(htmlEl && htmlEl.attributes && htmlEl.attributes.length) {
			var cnt = htmlEl.attributes.length;
			for(var i = 0; i < cnt; i++) {
				if(htmlEl.attributes[i].name == "itemnum") {
					this.onChoiceClick(htmlEl.attributes[i].value, ev);
					found = true;
					break;
				}
			}
		}
		if(!found) {
		//	DBG.println(AjxDebug.DBG1, AjxBuffer.concat("onOutsideMouseDown; htmlEl.nodeName=", htmlEl.nodeName," htmlEl.localName = ", htmlEl.localName, " htmlEl.id=", htmlEl.id));
			//check if the user clicked on the scrollbar or on the input or on the arrow
			if(htmlEl.localName == "scrollbar" && ( (htmlEl.parentNode && htmlEl.parentNode.id=="___OSELECT_MENU___") || (htmlEl.id && htmlEl.id=="___OSELECT_MENU___"))) { 
				found = true;
			} else if (htmlEl.id && htmlEl.id == "___OSELECT_MENU___"){
				found = true;
			} else if (htmlEl.id && htmlEl.id == inputId) {
				found = true;				
			} else if (htmlEl.id && htmlEl.id == arrowId) {
				found = true;
			}
		}
		
	}
	if(!found) {
		//DBG.println(AjxDebug.DBG1, "OSelect1_XFormItem.onOutsideMouseDown hiding menu htmlEl id = " + htmlEl.id + " time " +  (new Date()).getTime());
		this.hideMenu();
	}	
	return true;
}

OSelect1_XFormItem.prototype.getBounds = function(anElement, containerElement) {
	var myBounds = new Object();
	myBounds.left = 0;
	myBounds.top = 0;
	myBounds.width = anElement.clientWidth ? anElement.clientWidth: anElement.offsetWidth;
	myBounds.height = anElement.offsetHeight;

	if(!containerElement) {
		containerElement = AjxEnv.isIE ? anElement.document.body : anElement.ownerDocument.body;
	}

	// account for the scrollbars if necessary
	var hasScroll = (anElement.scrollLeft !== void 0);
	var trace = anElement;

	while(trace !=null && trace != containerElement) {
		myBounds.left += trace.offsetLeft;
		myBounds.top += trace.offsetTop;

		var nextEl = trace.offsetParent;
		while (hasScroll && (trace != nextEl)) {
			myBounds.left -= trace.scrollLeft;
			myBounds.top -= trace.scrollTop;
			trace = AjxEnv.isIE ? nextEl : trace.parentNode;
		}
		trace = nextEl;
	}
	return myBounds;
};



// TAKE DIRECTLY FROM DWT_SELECT
OSelect1_XFormItem.prototype.onChoiceOver = function (itemNum, event) {
	if (this.__currentHiliteItem != null) this.dehiliteChoice(this.__currentHiliteItem);
	this.hiliteChoice(itemNum);
	this.__currentHiliteItem = itemNum;
}
OSelect1_XFormItem.prototype.onChoiceOut = function (itemNum, event) {
	if (this.__currentHiliteItem != null) this.dehiliteChoice(this.__currentHiliteItem);
	this.__currentHiliteItem = null;
}
OSelect1_XFormItem.prototype.onChoiceClick = function (itemNum, event) {
	this.choiceSelected(itemNum, false, event);
}

OSelect1_XFormItem.prototype.onChoiceDoubleClick = function (itemNum, event) {
	this.choiceSelected(itemNum, true, event);
}

OSelect1_XFormItem.prototype.onValueTyped = function(label, event) {	
	var value = this.getChoiceValue(label);
	if(window.console && window.console.log) console.log("onValueTyped called value: " + value);
	this.setValue(value, false, event);
}

OSelect1_XFormItem.prototype.onKeyUp = function(value, event) {

	if(event.keyCode==XFG.ARROW_UP) {
		if(!this.menuUp)
			this.showMenu();
		
		this.hilitePreviousChoice(event);
		this.isSelecting = true;
		return;
	} 
	
	if(event.keyCode==XFG.ARROW_DOWN) {
		if(!this.menuUp)
			this.showMenu();
			
		this.hiliteNextChoice(event);
		this.isSelecting = true;
		return;
	} 
		
	if(this.isSelecting && this.menuUp && event.keyCode==DwtKeyEvent.KEY_ENTER && this.__currentHiliteItem != null && this.__currentHiliteItem != undefined) {
		var value = this.getNormalizedValues()[this.__currentHiliteItem];
		if(value != null && value != undefined) {
//			DBG.println(AjxDebug.DBG1, "OSelect1_XFormItem.onKeyUp handled key code "+ event.keyCode +" char code " + (new Date()).getTime());
			this.setValue(value, true, event);
			this.hideMenu();
			return;
		}
	} 
	this.isSelecting = false;		
	var method = this.getKeyUpMethod();
	if(method)
		method.call(this, value, event);
}

OSelect1_XFormItem.prototype.getKeyUpMethod = function () {
	return this.cacheInheritedMethod("keyUp","$keyUp","elementValue, event");
}

OSelect1_XFormItem.prototype.choiceSelected = function (itemNum, clearOldValues, event) {
	this.onChoiceOut();
	//DBG.println(AjxDebug.DBG1, "OSelect1_XFormItem.choiceSelected hiding menu "+  (new Date()).getTime());
	this.hideMenu();
	var value = this.getNormalizedValues()[itemNum];
	var editable = this.getInheritedProperty("editable");
	if(editable) {
		this.getDisplayElement().value = this.getNormalizedLabels()[itemNum];
	}
	this.setValue(value, clearOldValues, event);
}

OSelect1_XFormItem.prototype.hiliteNextChoice = function() {
	var choices = this.getNormalizedChoices();
	if(!(choices && choices.values && choices.values.length>0)) {
		return;
	}
	
	if(this.__currentHiliteItem == null || this.__currentHiliteItem == undefined) {
		this.hiliteChoice(0);
	} else { 
		this.dehiliteChoice(this.__currentHiliteItem);
		if ((this.__currentHiliteItem+1) < choices.values.length) {
			this.__currentHiliteItem++;
		} else {
			this.__currentHiliteItem = 0;
		}
		this.hiliteChoice(this.__currentHiliteItem);
	}
}
	
OSelect1_XFormItem.prototype.hilitePreviousChoice = function() {
	var choices = this.getNormalizedChoices();
	if(!(choices && choices.values && choices.values.length>0)) {
		return;
	}
	
	if(this.__currentHiliteItem == null || this.__currentHiliteItem == undefined) {
		this.hiliteChoice(0);
	} else { 
		this.dehiliteChoice(this.__currentHiliteItem);
		
		if ((this.__currentHiliteItem-1) > -1) {
			this.__currentHiliteItem--;
		} else {
			this.__currentHiliteItem = choices.values.length-1;
		}
		this.hiliteChoice(this.__currentHiliteItem);
	}
}	


OSelect1_XFormItem.prototype.setValue = function (newValue, clearOldValues, event) {
	if(window.console && window.console.log) console.log("setValue called + " + newValue);
	var method = this.getElementChangedMethod();
	method.call(this, newValue, this.getInstanceValue(), event);
}

OSelect1_XFormItem.prototype.hiliteChoice = function (itemNum) {
	this.setChoiceCssClass(itemNum, this.getChoiceSelectedCssClass());
	if (this.getShowCheck() == true) {
		var els = this.getChoiceElements(itemNum);
		if (els) els[0].innerHTML = this.getCheckHTML();
	}
}

OSelect1_XFormItem.prototype.displayMouseOver = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.displayMouseOut = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.displayMouseDown = function () {
	if(!this._enabled)
		return;
}

OSelect1_XFormItem.prototype.dehiliteChoice = function(itemNum) {
	this.setChoiceCssClass(itemNum, this.getChoiceCssClass());
	if (this.getShowCheck() == true) {
		var els = this.getChoiceElements(itemNum);
		if (els) els[0].innerHTML = "&nbsp;";
	}
}


OSelect1_XFormItem.prototype.clearAllHilites = function () {
	for (var i = 0; i < this._normalizedValues.length; i++) {
		this.dehiliteChoice(i);
	}
}



OSelect1_XFormItem.prototype.setChoiceCssClass = function (itemNum, cssClass) {
	var els = this.getChoiceElements(itemNum);
	if (els) {
		els.className = cssClass;
	}
}

OSelect1_XFormItem.prototype.getArrowElement = function () {
	return this.getForm().getElement(this.getId() + "_arrow_button");
}

OSelect1_XFormItem.prototype.getDisplayElement = function () {
	return this.getElement(this.getId() + "_display");
}


OSelect1_XFormItem.prototype.getItemNumFromEvent = function (event) {
	var target = event.target || event.src;
	while (target) {
		if (target.id) {
			var itemNum = parseInt(target.id);
			if (isNaN(itemNum)) return -1;
			return itemNum;
		}
		target = target.parentNode;
	}
	return -1;
}

OSelect1_XFormItem.prototype.getChoiceElements = function (itemNum) {
	if (itemNum == null || itemNum == -1) return null;
	try {
		return this.getForm().getElement([this.getId(), "_choice_",itemNum].join(""));
	} catch (e) {
		return null;
	}
}


OSelect1_XFormItem.prototype.outputHTML = function (HTMLoutput) {
	var id = this.getId();
	var ref = this.getFormGlobalRef() + ".getItemById('"+ id + "')";	
	var inputHtml;
	var editable = this.getInheritedProperty("editable");
	if(editable) {
		var inputSize = this.getInheritedProperty("inputSize");		
		inputHtml = ["<input type=text id=", id, "_display class=", this.getDisplayCssClass(), " value='VALUE' ", 
					" onchange=\"",ref, ".onValueTyped(this.value, event||window.event)\"",
					" onmouseup=\"", ref, ".showMenu(this)\"",
					" onkeyup=\"",ref, ".onKeyUp(this.value, event||window.event)\"", "size=",inputSize,
					">"].join("");
	}
	
	if (this.getWidth() == "auto" && !editable) {
		var element = this.getElement("tempDiv");
		if(!element) 
			element = this.createElement("tempDiv", null, "div", "MENU CONTENTS");
		element.style.left = '-1000px';
		element.style.top = '-1000px';
		element.className = this.getMenuCssClass();
		element.innerHTML = this.getChoicesHTML();
		this._width = element.offsetWidth+20;
		element.innerHTML = "";
	}

	
	if(editable) {
		HTMLoutput.append(
			"<div id=", id, this.getCssString(),
				" onclick=\"", this.getFormGlobalRef(), ".getItemById('",this.getId(),"').showMenu(this)\"",
				" onselectstart=\"return false\"",
				">",
				"<table ", this.getTableCssString(), ">", 
					"<tr><td width=100%>",inputHtml,"</td>",
						"<td>", this.getArrowButtonHTML(),"</td>", 
					"</tr>", 
				"</table>", 
			"</div>"
		);
	} else {
		HTMLoutput.append(
			"<div id=", id, this.getCssString(),
				" onclick=\"", this.getFormGlobalRef(), ".getItemById('",this.getId(),"').showMenu(this)\"",
				" onselectstart=\"return false\"",
				"><table ", this.getTableCssString(), ">",
					"<tr><td width=100%><div id=", id, "_display class=", this.getDisplayCssClass(), ">VALUE</div></td>",
						"<td>", this.getArrowButtonHTML(),"</td>", 
					"</tr>", 
				"</table>", 
			"</div>"
		);	
	}
}

OSelect1_XFormItem.prototype.getArrowButtonHTML = function () {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	return AjxBuffer.concat("<div id=", this.getId(), "_arrow_button",
	 " onmouseover=\"", ref, ".displayMouseOver();\"",
 	 " onmouseout=\"", ref, ".displayMouseOut();\"",
 	 " onmousedown=\"", ref, ".displayMouseDown();\"", 	 
 	 ">", AjxImg.getImageHtml("SelectPullDownArrow"), "</div>");
}

OSelect1_XFormItem.prototype.getTableCssClass = function () {
	return this.cssClass + "_table";
}
OSelect1_XFormItem.prototype.getDisplayCssClass = function () {
	return this.cssClass + "_display";
}

OSelect1_XFormItem.prototype.getMenuCssClass = function () {
	return this.cssClass + "_menu";
}
OSelect1_XFormItem.prototype.getChoiceTableCssClass = function () {
	return this.cssClass + "_choice_table";
}
OSelect1_XFormItem.prototype.getChoiceScrollTableCssClass = function () {
	return this.cssClass + "_choice_table_scrolled";
}

OSelect1_XFormItem.prototype.getChoiceCssClass = function () {
	return this.cssClass + "_choice";
}
OSelect1_XFormItem.prototype.getChoiceSelectedCssClass = function () {
	return this.cssClass + "_choice_selected";
}

OSelect1_XFormItem.prototype.getNoteCssClass = function () {
	return this.cssClass + "_note";
}

OSelect1_XFormItem.prototype.getErrorNoteCssClass = function () {
	return this.cssClass + "_error_note";
}

OSelect1_XFormItem.prototype.outputChoicesHTMLStart = function(html) {
	html.append("<table cellspacing=0 cellpadding=0 id=", this.getId(),"_menu_table class=", this.getChoiceTableCssClass(), ">");
	
}
OSelect1_XFormItem.prototype.outputChoicesHTMLEnd = function(html) {
	html.append("</table>");
}

OSelect1_XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	//try DIVs
	return AjxBuffer.concat("<tr><td><div id=\"", this.getId(), "_choice_", itemNum, "\" ", "class=", cssClass, 
			" onmouseover=\"",ref, ".onChoiceOver(", itemNum,", event||window.event)\"",
			" onmouseout=\"",ref, ".onChoiceOut(", itemNum,", event||window.event)\"",
			" onclick=\"",ref, ".onChoiceClick(", itemNum,", event||window.event)\"",
			" itemnum = '", itemNum, "'",">",AjxStringUtil.htmlEncode(label),	"</div></td></tr>");
	
}


// set up how disabling works for this item type
OSelect1_XFormItem.prototype.setElementEnabled = function(enabled) {
	this._enabled = enabled;
	var table = this.getForm().getElement(this.getId()).getElementsByTagName("table")[0];
	if(enabled) {
		this.getDisplayElement().className = this.getDisplayCssClass();
		var el = this.getArrowElement();
		if(el)
			AjxImg.setImage(el, "SelectPullDownArrow");
			
		this.getForm().getElement(this.getId()).className = this.cssClass;
		table.className = this.getTableCssClass();
		if(this.getInheritedProperty("editable")) {
			this.getDisplayElement().disabled=false;
		}
	} else {
		this.getDisplayElement().className = this.getDisplayCssClass() + "_disabled";
		var el = this.getArrowElement();
		/*if(el)
			AjxImg.setImage(el, "SelectPullDownArrowDis");
		*/	
		this.getForm().getElement(this.getId()).className = this.cssClass + "_disabled";
		table.className = this.getTableCssClass()+"_disabled";
		if(this.getInheritedProperty("editable")) {
			this.getDisplayElement().disabled=true;
		}
	}
}

//
//	OSelect class -- lightning fast SELECT type widget
//
OSelect_XFormItem = function() {}
XFormItemFactory.createItemType("_OSELECT_", "oselect", OSelect_XFormItem, OSelect1_XFormItem);

OSelect_XFormItem.prototype.focusable = false;
OSelect_XFormItem.prototype.multiple = true;
OSelect_XFormItem.prototype.writeElementDiv = true;
OSelect_XFormItem.prototype.overflow = "auto";
OSelect_XFormItem.prototype.cssStyle = "border:2px inset gray;";
OSelect_XFormItem.prototype.showCheck = false;

OSelect_XFormItem.prototype.outputHTML = function(html) {
	var it = this.getChoicesHTML();
	html.append(it);
}

OSelect_XFormItem.prototype.choicesChangeLsnr = function () {
	this._choiceDisplayIsDirty = true;
	delete this.$normalizedChoices;
	var element = this.getElement();
	if(element)
		element.innerHTML = this.getChoicesHTML();	
}

OSelect_XFormItem.prototype.outputChoicesHTMLStart = function(html) {
	html.append("<table id=", this.getId(),"_menu_table width=100% cellspacing=2 cellpadding=0>");
}
OSelect_XFormItem.prototype.outputChoicesHTMLEnd = function(html) {
	html.append("</table>");
}


OSelect_XFormItem.prototype.getMenuElementId = function () {
	return this.getId();
}

OSelect_XFormItem.prototype.updateElement = function (values) {
	var element = this.getElement();
	element.innerHTML = this.getChoicesHTML();

	if (values == null) return;	
	if(this.getMultiple()) {
		if (typeof values == "string") values = values.split(",");
		for (var i = 0; i < values.length; i++) {
			var itemNum = this.getChoiceNum(values[i]);
			if (itemNum != -1) this.hiliteChoice(itemNum);
		}
	} else {
		var itemNum = this.getChoiceNum(values);
		if (itemNum != -1) this.hiliteChoice(itemNum);
	}

    //updateEnabledDisabled() should run after the element is created.
    //OSelect_XFormItem updateElement will redraw the elements.
    //The redraw of the elements will screw the enable disable state of the element
    //So we update the enable disable state after the redraw.      
    this.updateEnabledDisabled();
}

OSelect_XFormItem.prototype.onChoiceOver = function (itemNum) {}
OSelect_XFormItem.prototype.onChoiceOut = function (itemNum) {}

OSelect_XFormItem.prototype.onChoiceClick = function (itemNum, event) {
	event = event || window.event;
	var clearOthers = true;
	var includeIntermediates = false;
	
	if(this.getMultiple()) {
		clearOthers = false;
		if (event.shiftKey) {
			includeIntermediates = true;
		}
	}
	
	this.choiceSelected(itemNum, clearOthers, includeIntermediates, event);
};

OSelect_XFormItem.prototype.choiceSelected = function (itemNum, clearOldValues, includeIntermediates, event) {
	if (includeIntermediates){
		this._selectionCursor = itemNum;
		if (this._selectionAnchor == null) {
			this._selectionAnchor = itemNum;
		}
	} else {
		this._selectionAnchor = itemNum;
		this._selectionCursor = itemNum;
	}

	var value = this.getNormalizedValues()[itemNum];
	this.setValue(value, clearOldValues, includeIntermediates, event);
}

OSelect_XFormItem.prototype.setValue = function (newValue, clearOldValues, includeIntermediates, event) {

	var newValues;
	if (clearOldValues) {
		if(this.getMultiple()) {
			if(newValue instanceof Array)
				newValues = newValue;
			else
				newValues = [newValue];
		} else {
			newValues = newValue;
		}
	} else {
		if (includeIntermediates) {
			newValues = [];
			var vals = this.getNormalizedValues();
			var start = this._selectionCursor;
			var dist = this._selectionAnchor - this._selectionCursor;
			if (dist < 0 ) {
				dist = this._selectionCursor - this._selectionAnchor;
				start = this._selectionAnchor;
			}
			for (var i = start; i <= start + dist; ++i) {
				newValues.push(vals[i]);
			}
		} else {
			var oldValues = this.getInstanceValue();
			if(typeof oldValues == "string") {
				newValues = oldValues;
			} else if(typeof oldValues =="object" || oldValues instanceof Array) {
				newValues = [];
				for(var a in oldValues) {
					newValues[a] = oldValues[a];
				}
			}
			if(newValues) {
				if (typeof newValues == "string") {
					if (newValues == "") 	
						newValues = [];
					else
						newValues = newValues.split(",");
				}
			} else {
				newValues = new Array();			
			}			
			
			var found = false;
			var i;
			for (i = 0; i < newValues.length; i++) {
				if (newValues[i] == newValue) {
					found = true;
					break;
				}
			}
			
			if (found) {
				newValues.splice(i, 1);
			} else {
				newValues.push(newValue);
			}
		}
		if(!newValues || (newValues.length == 1 && newValues[0] == "")) {
			newValues = []
		} 
		// if we have a modelItem which is a LIST type
		//	convert the output to the propert outputType
		var modelItem = this.getModelItem();
		if (modelItem && modelItem.getOutputType) {
			if (modelItem.getOutputType() == _STRING_) {
				newValues = newValues.join(modelItem.getItemDelimiter());
			}
		} else {
			// otherwise assume we should convert it to a comma-separated string
			newValues = newValues.join(",");
		}
	}
	this.getForm().itemChanged(this, newValues, event);
}

OSelect_XFormItem.prototype.setElementEnabled = function (enabled) {
	var choices = this.getNormalizedChoices();
	if(!choices)
		return;
	
	var values = choices.values;
	if(!values)
		return;
		
	var cnt = values.length;
	for(var i=0; i < cnt; i ++) {
		var chkbx = this.getElement(this.getId() + "_choiceitem_" + i);	
		if(chkbx) {
			if(enabled) {
				chkbx.className = this.getChoiceCssClass();
				chkbx.disabled = false;
			} else {
				chkbx.className = this.getChoiceCssClass() + "_disabled";
				chkbx.disabled = true;
			}
		} 
	}
};




OSelect_Check_XFormItem = function() {}
XFormItemFactory.createItemType("_OSELECT_CHECK_", "oselect_check", OSelect_Check_XFormItem, OSelect_XFormItem)
OSelect_Check_XFormItem.prototype.cssClass = "oselect_check";
OSelect_Check_XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	var id = this.getId();

	// The bugfixing for bug 44925
	// By checking the __isEnabled property via getIsEnabled(), the fixing can make the label working with
	// checkbox under same property: 
	//     1) both should be in grey(disabled) when the item is disabled, vise versa;
	//     2) both should be removed all the event handlers on element when it is disabled, vise versa.

    return AjxBuffer.concat(
            "<tr><td class=", cssClass,
                    (this.getIsEnabled())?(" onmouseover=\"" + ref + ".onChoiceOver(" + itemNum + ", event||window.event)\""):"",
                    (this.getIsEnabled())?(" onmouseout=\"" + ref +  ".onChoiceOut(" + itemNum + ", event||window.event)\""):"",
                    (this.getIsEnabled())?(" onclick=\"" + ref + ".onChoiceClick(" + itemNum + ", event||window.event)\""):"",
                    (this.getIsEnabled())?(" ondblclick=\"" + ref + ".onChoiceDoubleClick(" + itemNum + ", event||window.event)\""):"",
            ">",
            "<table cellspacing=0 cellpadding=0><tr><td><input type=checkbox id='",id,"_choiceitem_",itemNum,"'></td><td>",
                            (!this.getIsEnabled())?("<font color=\"#808080\">"):"", AjxStringUtil.htmlEncode(label), (!this.getIsEnabled())?("</font>"):"",
            "</td></tr></table></td></tr>"
    );
}


OSelect_Check_XFormItem.prototype.hiliteChoice = function (itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[0];
		el.className = this.getChoiceSelectedCssClass();
	
		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = true;
		}
	}
}

OSelect_Check_XFormItem.prototype.dehiliteChoice = function(itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[0];
		el.className = this.getChoiceCssClass();

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = false;
		}
	}
}

OSelect_Check_XFormItem.prototype.getChoiceElements = function (itemNum) {
	if (itemNum == null || itemNum == -1) return null;
	try {
		return this.getForm().getElement(this.getId() + "_menu_table").rows[itemNum].getElementsByTagName("td");
	} catch (e) {
		return null;
	}
}

OSelect_Check_XFormItem.prototype.selectAll = function (ev) {
	var newValues = [];
	if(this.$normalizedChoices && this.$normalizedChoices.values) {
		var choices = this.$normalizedChoices.values;
		var cnt = choices.length;
		for(var i =0; i < cnt; i ++) {
			newValues.push(choices[i]);
		}
	}
	this.setValue(newValues,true,false,ev);
}

OSelect_Check_XFormItem.prototype.deselectAll = function (ev) {
	this.getForm().itemChanged(this, [], ev);
}

OSelect_Check_XFormItem.prototype.updateElement = function (values) {
	var element = this.getElement();
	element.innerHTML = this.getChoicesHTML();
	this.clearAllHilites();
	if (values) {	
		if(this.getMultiple()) {
			if (typeof values == "string") values = values.split(",");
			for (var i = 0; i < values.length; i++) {
				var itemNum = this.getChoiceNum(values[i]);
				if (itemNum != -1) this.hiliteChoice(itemNum);
			}
		} else {
			var itemNum = this.getChoiceNum(values);
			if (itemNum != -1) this.hiliteChoice(itemNum);
		}
	}
    this.updateEnabledDisabled();
}

OSelect_Check_XFormItem.prototype.clearAllHilites = function () {
	var choices = this.getNormalizedChoices();
	var cnt;
	if(choices.values) {
		cnt = choices.values.length;
		for(var i=0; i< cnt; i++) {
			this.dehiliteChoice(i);		
		}
	}
}

OSelect_DblCheck_XFormItem = function() {}
XFormItemFactory.createItemType("_OSELECT_DBL_CHECK_", "oselect_dbl_check", OSelect_DblCheck_XFormItem, OSelect_Check_XFormItem)

OSelect_DblCheck_XFormItem.prototype.onSubChoiceOver = function (itemNum) {}
OSelect_DblCheck_XFormItem.prototype.onSubChoiceOut = function (itemNum) {}

OSelect_DblCheck_XFormItem.prototype.onSubChoiceClick = function (itemNum, event) {
	event = event || window.event;
	var clearOthers = true;
	var includeIntermediates = false;
	
	if(this.getMultiple()) {
		clearOthers = false;
		if (event.shiftKey) {
			includeIntermediates = true;
		}
	}
	
	this.subChoiceSelected(itemNum, clearOthers, includeIntermediates, event);
};

OSelect_DblCheck_XFormItem.prototype.subChoiceSelected = function (itemNum, clearOldValues, includeIntermediates, event) {
	if (includeIntermediates){
		this._subSelectionCursor = itemNum;
		if (this._subSelectionAnchor == null) {
			this._subSselectionAnchor = itemNum;
		}
	} else {
		this._subSelectionAnchor = itemNum;
		this._subSelectionCursor = itemNum;
	}

	var value = this.getNormalizedValues()[itemNum];
	this.setSubValue(value, clearOldValues, includeIntermediates, event);
}

OSelect_DblCheck_XFormItem.prototype.setSubValue = function (newValue, clearOldValues, includeIntermediates, event) {
	var newValues;

	if (clearOldValues) {
		if(this.getMultiple()) {
			if(newValue instanceof Array)
				newValues = newValue;
			else
				newValues = [newValue];
		} else {
			newValues = newValue;
		}
	} else {
		if (includeIntermediates) {
			newValues = [];
			var vals = this.getNormalizedValues();
			var start = this._subSelectionCursor;
			var dist = this._subSelectionAnchor - this._subSelectionCursor;
			if (dist < 0 ) {
				dist = this._subSelectionCursor - this._subSelectionAnchor;
				start = this._subSelectionAnchor;
			}
			for (var i = start; i <= start + dist; ++i) {
				newValues.push(vals[i]);
			}
		} else {
			var oldValues = this.getInstanceValue(this.getInheritedProperty("subRef"));
			if(typeof oldValues == "string") {
				newValues = new String(oldValues);
			} else if(typeof oldValues =="object" || oldValues instanceof Array) {
				newValues = [];
				for(var a in oldValues) {
					newValues[a] = oldValues[a];
				}
			}
			if(newValues) {
				if (typeof newValues == "string") {
					if (newValues == "") 	
						newValues = [];
					else
						newValues = newValues.split(",");
				}
			} else {
				newValues = new Array();			
			}			
			
			var found = false;
			for (var i = 0; i < newValues.length; i++) {
				if (newValues[i] == newValue) {
					found = true;
					break;
				}
			}
			
			if (found) {
				newValues.splice(i, 1);
			} else {
				newValues.push(newValue);
			}
		}
		if(!newValues || (newValues.length == 1 && newValues[0] == "")) {
			newValues = []
		} 
		// if we have a modelItem which is a LIST type
		//	convert the output to the propert outputType
		var modelItem = this.getSubModelItem();
		if (modelItem && modelItem.getOutputType) {
			if (modelItem.getOutputType() == _STRING_) {
				newValues = newValues.join(modelItem.getItemDelimiter());
			}
		} else {
			// otherwise assume we should convert it to a comma-separated string
			newValues = newValues.join(",");
		}
	}
	this.getForm().subItemChanged(this, newValues, event);
}

OSelect_DblCheck_XFormItem.prototype.getSubLabel = function () {
	return this.getInheritedProperty("subLabel");	
}

OSelect_DblCheck_XFormItem.prototype.getChoiceHTML = function (itemNum, value, label, cssClass) {
	var ref = this.getFormGlobalRef() + ".getItemById('"+ this.getId()+ "')";
	var id = this.getId();
	return AjxBuffer.concat(
		"<tr><td class=", cssClass, 
			" onmouseover=\"",ref, ".onChoiceOver(", itemNum,", event||window.event)\"",
			" onmouseout=\"",ref, ".onChoiceOut(", itemNum,", event||window.event)\"",
			" onclick=\"",ref, ".onChoiceClick(", itemNum,", event||window.event)\"",
			" ondblclick=\"",ref, ".onChoiceDoubleClick(", itemNum,", event||window.event)\">",
				"<table cellspacing=0 cellpadding=0><tr><td><input type=checkbox id='",id,"_choiceitem_",itemNum,"'></td><td>",
				AjxStringUtil.htmlEncode(label),
				"</td></tr></table>",
			"</td><td class=",cssClass,
				" onmouseover=\"",ref,".onSubChoiceOver(", itemNum, ", event||window.event)\"",
				" onmouseout=\"",ref, ".onSubChoiceOut(", itemNum, ", event||window.event)\"",
				" onclick=\"",ref, ".onSubChoiceClick(", itemNum, ", event||window.event)\"",
				" ondblclick=\"",ref, ".onSubChoiceDoubleClick(", itemNum, ".event||window.event)\">",
					"<table cellspacing=0 cellpadding=0><tr><td><input type=checkbox id='",id,"_subchoiceitem_",itemNum,"'></td><td>",
				AjxStringUtil.htmlEncode(this.getSubLabel()),
				"</td></tr></table>",
		"</td></tr>"
	);
}

OSelect_DblCheck_XFormItem.prototype.hiliteChoice = function (itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[0];
		el.className = this.getChoiceSelectedCssClass();
	
		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = true;
			this.enableSubChoice(itemNum);
		}
	}
}

OSelect_DblCheck_XFormItem.prototype.dehiliteChoice = function(itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[0];
		el.className = this.getChoiceCssClass();

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = false;
			this.dehiliteSubChoice(itemNum);
			this.disableSubChoice(itemNum);
		}
	}
}

OSelect_DblCheck_XFormItem.prototype.hiliteSubChoice = function (itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[3];
		el.className = this.getChoiceSelectedCssClass();

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = true;
		}
	}
}

OSelect_DblCheck_XFormItem.prototype.dehiliteSubChoice = function(itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[3];
		el.className = this.getChoiceCssClass();

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].checked = false;
		}
	}
}

OSelect_DblCheck_XFormItem.prototype.disableSubChoice = function (itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[3];
		el.className = this.getChoiceCssClass() + "_disabled";

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].disabled = true;
		}
	}
}

OSelect_DblCheck_XFormItem.prototype.enableSubChoice = function (itemNum) {
	var chEl = this.getChoiceElements(itemNum);
	if(chEl) {
		var el = chEl[3];
		el.className = this.getChoiceCssClass();

		var checks = el.getElementsByTagName("input");
		if (checks) {
			checks[0].disabled = false;
		}
	}
}


OSelect_DblCheck_XFormItem.prototype.updateElement = function () {
	var element = this.getElement();
	element.innerHTML = this.getChoicesHTML();
	var values = this.getInstanceValue();
	this.clearAllHilites();
	if (values) {	
		if(this.getMultiple()) {
			if (typeof values == "string") values = values.split(",");
			for (var i = 0; i < values.length; i++) {
				var itemNum = this.getChoiceNum(values[i]);
				if (itemNum != -1) this.hiliteChoice(itemNum);
			}
		} else {
			var itemNum = this.getChoiceNum(values);
			if (itemNum != -1) this.hiliteChoice(itemNum);
		}
	}
	
	var subValues = this.getInstanceValue(this.getInheritedProperty("subRef"));
	if (subValues) {	
		if(this.getMultiple()) {
			if (typeof subValues == "string") subValues = subValues.split(",");
			for (var i = 0; i < subValues.length; i++) {
				var itemNum = this.getChoiceNum(subValues[i]);
				if (itemNum != -1) this.hiliteSubChoice(itemNum);
			}
		} else {
			var itemNum = this.getChoiceNum(values);
			if (itemNum != -1) this.hiliteSubChoice(itemNum);
		}
	}	
    this.updateEnabledDisabled();
}

OSelect_DblCheck_XFormItem.prototype.onSubChoiceDoubleClick = function (itemNum, event) {
	this.subChoiceSelected(itemNum, true, event);
}

OSelect_DblCheck_XFormItem.prototype.setElementEnabled = function (enabled) {
	var choices = this.getNormalizedChoices();
	if(!choices)
		return;
	
	var values = choices.values;
	if(!values)
		return;
		
	var cnt = values.length;
	for(var i=0; i < cnt; i ++) {
		var chkbx = this.getElement(this.getId() + "_choiceitem_" + i);
		var chkbxSub = this.getElement(this.getId() + "_subchoiceitem_" + i);	
		if(chkbx && chkbxSub) {
			if(enabled) {
				chkbx.className = this.getChoiceCssClass();
				chkbx.disabled = false;
//				chkbxSub.className = this.getChoiceCssClass();
//				chkbxSub.disabled = false;					
			} else {
				chkbx.className = this.getChoiceCssClass() + "_disabled";
				chkbx.disabled = true;
				chkbxSub.className = this.getChoiceCssClass() + "_disabled";
				chkbxSub.disabled = true;				
			}
		} 
	}
};

OSelect_DblCheck_XFormItem.prototype.deselectAll = function (ev) {
	this.getForm().subItemChanged(this, [], ev);
	this.getForm().itemChanged(this, [], ev);
}
}
if (AjxPackage.define("ajax.dwt.xforms.ButtonGrid")) {
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
 * @constructor
 * @class 
 * This class is an example of putting a custom widget in a {@link XForm}.
 * 
 * @param	{array}	attributes		the attributes
 * @private
 */
ButtonGrid = function(attributes) {
	XFG.assignUniqueId(this, "__BUTTON_GRID__");

	// copy any props passed in into the object
	for (var prop in attributes) {
		this[prop] = attributes[prop];
	}
	// handle any props that need special care
	if (this.onChange) this.setOnChange(this.onChange);

	// initialize to an empty array for value
	this.value = [];
	
	
}
var BGP = ButtonGrid.prototype;
BGP.choices = null;
BGP.numCols = 4;
BGP.cssClass = "xform_button_grid_medium";
BGP.onChange = null;
BGP.multiple = true;
BGP.addBracketingCells = false;

BGP.setOnChange = function (onChange) {
	if (onChange && typeof onChange == "string") {
		onChange = new Function("value, event", onChange);	
	}
	this.onChange = onChange;
}


BGP.getValue = function() {
	return this.value;
}

BGP.setValue = function(value) {
	if (value == null) value = [];
	if (typeof value == "string") value = value.split(",");
	this.value = value;
	
	this.showValue();
}

BGP.showValue = function() {
	var value = this.value;
	if (value == null) value = "";

	// assumes value is a comma-delimited string or an array
	if (typeof value == "string") value = value.split(",");
	
	// hack up value to make searching for a particular option value easier
	var uniqueStartStr = "{|[", uniqueEndStr = "]|}";
	value = uniqueStartStr + value.join(uniqueEndStr + uniqueStartStr) + uniqueEndStr;
	var choices = this.choices;
	for (var i = 0; i < choices.length; i++) {
		var element = XFG.getEl(this.getButtonId(i));
		var isPresent = (value.indexOf(uniqueStartStr + choices[i].value + uniqueEndStr) > -1);
		if (isPresent) {
			XFG.showSelected(element);
		} else {
			XFG.hideSelected(element);
		}
	}	
}

BGP.toggleValue = function(value, element) {
	if (this.multiple) {
		if (this.valueIsSelected(value)) {
			this.deselectValue(value, element);
		} else {
			this.selectValue(value, element);
		}
	} else {
		this.value = value;
	}
	return this.value;
}

BGP.valueIsSelected = function(value) {
	for (var i = 0; i < this.value.length; i++) {
		if (this.value[i] == value) return true;
	}
}

BGP.selectValue = function(value, element) {
	if (!this.valueIsSelected(value)) {
		this.value.push(value);
	}
	if (element) XFG.showSelected(element);
}

BGP.deselectValue = function(value, element) {
	if (this.valueIsSelected(value)) {
		for (var i = 0; i < this.value.length; i++) {
			if (this.value[i] == value) {
				this.value = this.value.slice(0, i).concat(this.value.slice(i+1, this.value.length));
			}
		}
	}
	if (element) XFG.hideSelected(element);
}

BGP.getButtonId = function (btnNum) {
	return this.__id + "_button_" + btnNum;
}


BGP.onButtonClick = function(choiceValue, element, event) {
	var newValue = this.toggleValue(choiceValue, element);
	if (this.onChange) {
		this.onChange(newValue, event);
	}
}

BGP.getHTML = function () {
	if (this.choices == null) return (this.__HTMLOutput = null);

	var buffer = new AjxBuffer();
	
	// write HTML for this element
	var buttonCssClass = this.cssClass + "_button";
	buffer.append("<table class=\"", this.cssClass, "_table\">");
	var i = 0;
	var numRows = Math.ceil(this.choices.length / this.numCols);
	for (var r = 0; r < numRows; r++) {
		buffer.append("<tr>\r");
		if (this.addBracketingCells) {
			buffer.append("\t<td width=50%><div class=", this.cssClass + "_start></div></td>");
		}
		for (var c = 0; c < this.numCols; c++) {
			var choice = this.choices[i];
			if (typeof choice == "string") {
				choice = this.choices[i] = {value:choice, label:choice};
			}
			buffer.append("<td class=", this.cssClass + "_td ><div id=", this.getButtonId(i), " class=", buttonCssClass, //(this.valueIsSelected(choice.value) ? "_selected" : ""),
								" onclick=\"XFG.cacheGet('", this.__id, "').onButtonClick('",choice.value,"',this,event);\">", 
								choice.label,
						"</div></td>");
			i++;
			if (i >= this.choices.length) break;
		}
		if (this.addBracketingCells) {
			buffer.append("<td width=50%><div class=", this.cssClass + "_end></div></td>");
		}
		buffer.append("</tr>");
	}
	buffer.append("</table>");
	this.__HTMLOutput = buffer.toString();
	return this.__HTMLOutput;
}


BGP.insertIntoXForm = function (form, item, element) {
	element.innerHTML = this.getHTML();
}

BGP.updateChoicesHTML = function(labels) {
	var i = 0;
	for (var r = 0; r < numRows; r++) {
		for (var c = 0; c < this.numCols; c++) {
			var btn = document.getElementById(this.getButtonId(i));
			if(btn) {
				btn.innerHTML =labels[i].label;
			}
			i++;
			if (i >= labels.length) break;
		}
	}
}

BGP.updateInXForm = function (form, item, value, element) {
	var valueStr = (value instanceof Array ? value.join(",") : value);
	if (!form.forceUpdate && this.__lastDisplayValue == valueStr) return;
	
	this.setValue(value);
	this.__lastDisplayValue = valueStr;
}

}
if (AjxPackage.define("ajax.dwt.xforms.DwtXFormDialog")) {
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
DwtXFormDialog = function(xformDef, xmodelDef, parent, className, title, standardButtons, extraButtons, zIndex, mode, loc) {
	if (arguments.length == 0) return;
	className = className || "DwtXFormDialog";
	DwtDialog.call(this, parent, className, title, standardButtons, extraButtons, zIndex, mode, loc);
	 
	this._xform = new XForm(xformDef, new XModel(xmodelDef), null, this);
	this._xform.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, this._handleXFormDirty));
	
	this.setView(this._xform);

	if (this._button[DwtDialog.OK_BUTTON]) {	
		this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	}
	if (this._button[DwtDialog.CANCEL_BUTTON]) {	
		this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));
	}
	if (this._button[DwtDialog.YES_BUTTON]) {	
		this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));
	}
	if (this._button[DwtDialog.NO_BUTTON]) {	
		this.setButtonListener(DwtDialog.NO_BUTTON, new AjxListener(this, this._handleNoButton));
	}
}
DwtXFormDialog.prototype = new DwtDialog;
DwtXFormDialog.prototype.constructor = DwtXFormDialog;

// Data

DwtXFormDialog.prototype._xform;
DwtXFormDialog.prototype._xformInitialized = false;

// Public methods

DwtXFormDialog.prototype.setInstance = function(instance) { 
	this._xform.setInstance(instance);
}
DwtXFormDialog.prototype.getInstance = function() {
	return this._xform.getInstance();
}

DwtXFormDialog.prototype.popup = function(loc) {
	this._initDialog();
	
	// make sure that form represents current data and show
	this._xform.setIsDirty(true);
	this._xform.refresh();
	if (this._button[DwtDialog.OK_BUTTON]) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	}
	if (this._button[DwtDialog.YES_BUTTON]) {
		this.setButtonEnabled(DwtDialog.YES_BUTTON, false);
	}
	DwtDialog.prototype.popup.call(this, loc);
}

// Protected methods

DwtXFormDialog.prototype._initDialog = function() {
	// initialize form
	if (!this._xformInitialized) {
		this._xform.draw();
		this._xformInitialized = true;
	}
}

DwtXFormDialog.prototype._handleXFormDirty = function(event) {
	if (this._button[DwtDialog.OK_BUTTON]) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
	}
	if (this._button[DwtDialog.YES_BUTTON]) {
		this.setButtonEnabled(DwtDialog.YES_BUTTON, true);
	}
}

DwtXFormDialog.prototype._handleOkButton = function(event) {
	this.popdown();
	this.setInstance(null);
}
DwtXFormDialog.prototype._handleCancelButton = DwtXFormDialog.prototype._handleOkButton;

DwtXFormDialog.prototype._handleYesButton = DwtXFormDialog.prototype._handleOkButton;
DwtXFormDialog.prototype._handleNoButton = DwtXFormDialog.prototype._handleOkButton;
}
if (AjxPackage.define("ajax.dwt.xforms.DynSelect_XFormItem")) {
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
 * XFormItem class: "dynselect"
 * @constructor DynSelect_XFormItem
 * @class DynSelect_XFormItem
 * A select box with asynchronous autocomplete capability
 * 
 * 
 * @author Greg Solovyev
 *
 * @private
 *
 */
DynSelect_XFormItem = function() {}
XFormItemFactory.createItemType("_DYNSELECT_", "dynselect", DynSelect_XFormItem, OSelect1_XFormItem);

// By Default auto-complete shall be disabled.
DynSelect_XFormItem.prototype.autoCompleteEnabled = false;

DynSelect_XFormItem.prototype.dataFetcherClass = null;
DynSelect_XFormItem.prototype.dataFetcherMethod = null;
DynSelect_XFormItem.prototype.dataFetcherObject = null;
DynSelect_XFormItem.prototype.dataFetcherTypes = null;
DynSelect_XFormItem.prototype.dataFetcherAttrs = null;
DynSelect_XFormItem.prototype.dataFetcherDomain = null;
DynSelect_XFormItem.prototype.entryKeyMethod = null;
DynSelect_XFormItem.prototype.bmolsnr = true;
DynSelect_XFormItem.prototype.emptyText = "";
DynSelect_XFormItem.prototype.cssClass = "dynselect";
DynSelect_XFormItem.prototype.edited = false;
DynSelect_XFormItem.prototype.focusable = true;

// Make sure there's enough delay between keystroke pauses
// TODO This is just a simple fix for now. A more complete and comprehensive fix is needed
// OLD --- DynSelect_XFormItem.LOAD_PAUSE = AjxEnv.isIE ? 500 : 250;	// delay between chunks
DynSelect_XFormItem.LOAD_PAUSE = 750; // delay between chunks

DynSelect_XFormItem.prototype.initFormItem = function () {
    // if we're dealing with an XFormChoices object...

    var choices  = this.getChoices();
    if (choices instanceof Array) {
        choices =  new XFormChoices(choices,XFormChoices.SIMPLE_LIST);
    }

    if (!choices) {
        choices = new XFormChoices([], XFormChoices.OBJECT_LIST, "name", "name");
    }

    this.setChoices(choices);

    //	...set up to receive notification when its choices change
    var listener = new AjxListener(this, this.choicesChangeLsnr);

    this.choices.addListener(DwtEvent.XFORMS_CHOICES_CHANGED, listener);

    this.dataFetcherClass = this.getInheritedProperty("dataFetcherClass");
    this.dataFetcherMethod = this.getInheritedProperty("dataFetcherMethod");
    this.dataFetcherTypes = this.getInheritedProperty("dataFetcherTypes");
    this.dataFetcherAttrs = this.getInheritedProperty("dataFetcherAttrs");
    this.dataFetcherDomain = this.getInheritedProperty("dataFetcherDomain");
    this.autoCompleteEnabled = this.getInheritedProperty("autoCompleteEnabled");
    this.dataFetcherObject = null;
    if(!this.dataFetcherMethod) {
        this.dataFetcherMethod = DynSelect_XFormItem.fetchDataDefault;
        this.dataFetcherObject = this;
    }

    var currentTabId = XFormItem.getParentTabGroupId(this);
    this.getForm().indexItem(this, this.getId() + "_display");

    if(currentTabId) {
        var tabGroupItem = this.getForm().getItemById(currentTabId);
        if(tabGroupItem) {
            tabGroupItem.tabIdOrder.push(this.getId()+"_display");
        }
    }
}

DynSelect_XFormItem.prototype.changeChoicesCallback = function (data, more, total) {
    var choices = this.choices ? this.choices : this.getChoices();

    if(!choices) {
        return;
    }

    choices.setChoices(data);
    choices.dirtyChoices();

    if(AjxUtil.isEmpty(data)) {
        this.hideMenu();
    } else {
        if(!this.menuUp) {
            this.showMenu();
        }
    }
}

DynSelect_XFormItem.fetchDataDefault = function (callArgs) {
    var callback = callArgs["callback"];
    callback.run(this.choices.getChoiceObject(), false, null);
}

DynSelect_XFormItem.prototype.onKeyUp = function(value, event) {
    var lastTypeTime = new Date().getTime();
    this._lastTypeTime = lastTypeTime;

    if (window.console && window.console.log) {
        window.console.log("onKeyUp " + value + " @ "+lastTypeTime);
    }

    this.edited = true;
    this.hideNote();

    if (event.keyCode == XFG.ARROW_UP) {
        if(!this.menuUp) {
            this.showMenu();
        }
        this.hilitePreviousChoice(event);
        this.isSelecting = true;
        return;
    }
	
	if (event.keyCode == XFG.ARROW_DOWN) {
        if(!this.menuUp) {
            this.showMenu();
        }

        this.hiliteNextChoice(event);
        this.isSelecting = true;
        return;
    }

    if (this.isSelecting &&
        this.menuUp &&
        event.keyCode == DwtKeyEvent.KEY_ENTER &&
        this.__currentHiliteItem != null &&
        this.__currentHiliteItem != undefined) {

        var value = this.getNormalizedValues()[this.__currentHiliteItem];

        if (value != null && value != undefined) {
            this.setValue(value, true, event);
            this.hideMenu();
            this.processEntryKey();
            return;
        }
    } else if (this.menuUp && event.keyCode==DwtKeyEvent.KEY_ENTER) {
        this.hideMenu();
        this.processEntryKey();
        return;
    }

    this.isSelecting = false;

    var method = this.getKeyUpMethod();
    if (method) {
        method.call(this, value, event);
    } else {
        var key = DwtKeyEvent.getCharCode(event);

        // don't fire off another if we've already set one up unless this is an ENTER key
        if (!AjxUtil.isEmpty(this.keyPressDelayHdlr)) {
            AjxTimedAction.cancelAction(this.keyPressDelayHdlr);
            this.keyPressDelayHdlr = null;
        }

        var form = this.getForm();

        var evt = new DwtKeyEvent();
        evt.setFromDhtmlEvent(event);
	
		if (key == DwtKeyEvent.KEY_TAB) {
            DwtUiEvent.setBehaviour(event, true, false);
            return false;
        } else if(!(event.keyCode==XFG.ARROW_RIGHT || event.keyCode==XFG.ARROW_LEFT || event.keyCode == DwtKeyEvent.KEY_ESCAPE)) {
            var action = new AjxTimedAction(this, this.handleKeyPressDelay, [evt, value,lastTypeTime]);
            this.keyPressDelayHdlr = AjxTimedAction.scheduleAction(action, DynSelect_XFormItem.LOAD_PAUSE);
        }
    }
}

DynSelect_XFormItem.prototype.onKeyDown = function (value, event) {
    var key = DwtKeyEvent.getCharCode(event);
    if (key == DwtKeyEvent.KEY_ENTER) {
        DwtUiEvent.setBehaviour(event, true, true); // keyup handle will see enter key
        return false;
    } else if (key == DwtKeyEvent.KEY_TAB) {
        DwtUiEvent.setBehaviour(event, true, false);
        if (this.menuUp) {
            this.hideMenu();
        }

        var currentTabId = XFormItem.getParentTabGroupId(this);
        if(event.shiftKey) {
            this.getForm().focusPrevious(this.getId()+"_display" , currentTabId);
        } else {
            this.getForm().focusNext(this.getId()+"_display", currentTabId);
        }

        return true;
    }

    return true;
}

DynSelect_XFormItem.prototype.resetChoices = function () {
    var choices = this.getChoices();
    choices.setChoices([]);
    choices.dirtyChoices();

    if (!this.dataFetcherObject &&
        this.dataFetcherClass != null &&
        this.dataFetcherMethod != null) {

        this.dataFetcherObject = new this.dataFetcherClass(this.getForm().getController());

    } else if (this.getInheritedProperty("dataFetcherInstance")) {
        this.dataFetcherObject = this.getInstance();
    }
}

DynSelect_XFormItem.prototype.handleKeyPressDelay = function (event, value, lastTypeTime) {

    if (event.keyCode == DwtKeyEvent.KEY_ENTER) {
        this.processEntryKey();
        return;
    }

    if (this.autoCompleteEnabled) {

        var currTime = new Date().getTime();

        if (window.console && window.console.log) {
            window.console.log("handleKeyPressDelay " + value + " @ " + currTime);
        }

        this.keyPressDelayHdlr = null;

        var val = this.preProcessInput(value);

        if (lastTypeTime == this._lastTypeTime) {
            this.getForm().itemChanged(this, val, event);
        } else {

            if (window.console && window.console.log) {
                window.console.log("typing faster than retreiving data");
            }

            return;
        }

        if (!this.dataFetcherObject &&
            this.dataFetcherClass != null &&
            this.dataFetcherMethod != null) {

            this.dataFetcherObject = new this.dataFetcherClass(this.getForm().getController());

        } else if (this.getInheritedProperty("dataFetcherInstance")) {
            this.dataFetcherObject = this.getInstance();
        }

        if(!this.dataFetcherObject) {
            return;
        }

        var callback = new AjxCallback(this, this.changeChoicesCallback);

        var searchByProcessedValue = this.getInheritedProperty("searchByProcessedValue");

        var callArgs = {
            event: event,
            callback: callback,
            extraLdapQuery: null,
            form: this.getForm(),
            types: (this.dataFetcherTypes ? this.dataFetcherTypes : null),
            attrs: (this.dataFetcherAttrs ? this.dataFetcherAttrs : null),
            domain: (this.dataFetcherDomain ? this.dataFetcherDomain : null)
        };

        if (searchByProcessedValue && !AjxUtil.isEmpty(val)) {
            callArgs["value"] = val;
            this.dataFetcherMethod.call(this.dataFetcherObject, callArgs);
        } else if (!AjxUtil.isEmpty(value)) {
            callArgs["value"] = value;
            this.dataFetcherMethod.call(this.dataFetcherObject, callArgs);
        }

    }

}

DynSelect_XFormItem.prototype.outputHTML = function (HTMLoutput) {
    var id = this.getId();
    var ref = this.getFormGlobalRef() + ".getItemById('"+ id + "')";

    var inputHtml;

    var inputSize = this.getInheritedProperty("inputSize");
    var inputWidth = this.getInheritedProperty("inputWidth");

    var keyPressEv = " onkeypress";
    if(!AjxEnv.isFirefox) {
        keyPressEv = " onkeydown";
    }

    var inputWidthString = inputWidth ? "style='width:" + inputWidth + "'" : (inputSize ? "size=" + inputSize : "");

    inputHtml = [
        "<input type=text id=",
        id,
        "_display class=",
        this.getDisplayCssClass(),
        " value='VALUE' ",
        " onchange=\"",
        ref,
        ".onValueTyped(this.value, event||window.event)\"",
        keyPressEv + "=\"",
        ref,
        ".onKeyDown(this.value, event||window.event)\"",
        " onkeyup=\"",
        ref,
        ".onKeyUp(this.value, event||window.event)\"",
        inputWidthString,
        this.getMouseoutHandlerHTML(),
        ">"
    ].join("");

    HTMLoutput.append (
        "<div id=",
        id,
        this.getCssString(),
        " onclick=\"",
        this.getFormGlobalRef(),
        ".getItemById('",
        this.getId(),
        "').onClick(event)\"",
        " onselectstart=\"return false\"",
        ">",
        "<table ",
        this.getTableCssString(),
        " cellspacing='0'>",
        "<tr><td width=100%>",
        inputHtml,
        "</td>",
        "</tr>",
        "</table>",
        "</div>"
    );

    this.edited = false;
}

DynSelect_XFormItem.prototype.getMouseoutHandlerHTML = function () {
    var formId = this.getFormGlobalRef(),
        itemId = this.getId();

    var onMouseoutAction = "";

    var onMouseoutFunc = this.getInheritedProperty("onMouseout");

    onMouseoutAction = AjxBuffer.concat(
        " onmouseout=\"",
        onMouseoutFunc || "XFormItem.prototype.hideInputTooltip",
        ".call(",
        this.getGlobalRef(),
        ", event );\" "
    );

    return AjxBuffer.concat( onMouseoutAction );
}

DynSelect_XFormItem.prototype.onClick = function(event) {
    var choices = this.getNormalizedChoices();

    if (!this.edited && this.getInheritedProperty("editable")) {
        this.showInputTooltip(event);
    } else {
        if(choices && choices.values && choices.values.length && !(choices.values[0] instanceof XFormChoices)) {
            this.showMenu();
        }
    }

	if(AjxUtil.isEmpty(this.getInstanceValue()) && this._enabled) {
        var el = this.getDisplayElement();
        el.value = "";
        el.className = this.getDisplayCssClass();
    }
}

DynSelect_XFormItem.prototype.getArrowElement = function () {
    return null;
}

DynSelect_XFormItem.prototype.preProcessInput = function (value) {
    var preProcessMethod = this.getPreProcessMethod();
    var val = value;

    if (preProcessMethod) {
        val = preProcessMethod.call(this, value, this.getForm());
    }

    return val;
}

DynSelect_XFormItem.prototype.getPreProcessMethod = function () {
    return this.cacheInheritedMethod("inputPreProcessor","inputPreProcessor","value, form");
}

DynSelect_XFormItem.prototype.updateElement = function (newValue) {
    if (this.getMultiple() && newValue != null && newValue.indexOf(",") > -1) {
        newValue = newValue.split(",");

        for (var i = 0; i < newValue.length; i++) {
            newValue[i] = this.getChoiceLabel(newValue[i]);
        }
    } else {
        newValue = this.getChoiceLabel(newValue);
    }
	
	var el = this.getDisplayElement();

	if (el) {
		if(AjxUtil.isEmpty(newValue) && this._enabled && !this.edited) {
			var emptyText = this.getInheritedProperty("emptyText");
			if(!AjxUtil.isEmpty(emptyText)) {
				newValue = emptyText;
				el.className = this.getDisplayCssClass() + "_empty";
			}		
		} else if(this._enabled) {
			el.className = this.getDisplayCssClass();
		}

        if(window.console && window.console.log) {
            console.log("updating element with value: " + newValue + " over " + el.value);

        }

        el.value = newValue;
    }

    if (this.autoCompleteEnabled) {

        if (AjxUtil.isEmpty(newValue)) {
            if(!this.dataFetcherObject &&
                this.dataFetcherClass != null &&
                this.dataFetcherMethod != null) {

                this.dataFetcherObject = new this.dataFetcherClass(this.getForm().getController());
            }

            if (!this.dataFetcherObject) {
                return;
            }
        }

    }

}

DynSelect_XFormItem.prototype.setElementEnabled = function(enabled) {
    this._enabled = enabled;

    var el = this.getForm().getElement(this.getId());
    if (!el || !el.getElementsByTagName || !el.getElementsByTagName("table")[0]) {
        return;
    }

    var table = el.getElementsByTagName("table")[0];

    if (enabled) {
        if(AjxUtil.isEmpty(this.getInstanceValue()) && !AjxUtil.isEmpty(this.getInheritedProperty("emptyText"))) {
            this.getDisplayElement().className = this.getDisplayCssClass() + "_empty";
            this.getDisplayElement().value = this.getInheritedProperty("emptyText");
        } else {
            this.getDisplayElement().className = this.getDisplayCssClass();
        }

        this.getForm().getElement(this.getId()).className = this.cssClass;
        table.className = this.getTableCssClass();
        this.getDisplayElement().disabled=false;

    } else {
        this.getDisplayElement().className = this.getDisplayCssClass() + "_disabled";

        var el = this.getArrowElement();
        if(el) {
            AjxImg.setImage(el, "SelectPullDownArrowDis");
        }

        this.getForm().getElement(this.getId()).className = this.cssClass + "_disabled";
        table.className = this.getTableCssClass()+"_disabled";
        this.getDisplayElement().disabled = true;
    }
}

DynSelect_XFormItem.prototype.processEntryKey = function () {
    var value = this.getInstanceValue();

    var processEntryKey = this.getInheritedProperty("entryKeyMethod");
    if (processEntryKey instanceof AjxCallback) {
        processEntryKey.run(this, value);
    }
}
}
}
