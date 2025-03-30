if (AjxPackage.define("DocsPreview")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2011, 2012, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2011, 2012, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
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

if (AjxPackage.define("ajax.util.AjxTimezone")) {
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
 * This class holds all of the known timezone rules. Each timezone
 * is represented by an object that has a unique identifier and the
 * offset to UTC in standard time. If the timezone defines daylight
 * savings time, then additional information is provided (e.g. when
 * the DST takes effect and it's offset to UTC).
 * <p>
 * Both the standard and daylight information are specified as objects
 * with the following properties:
 * <dl>
 * <dt> offset
 *   <dd> The offset to UTC (in minutes)
 * <dt> mon
 *   <dd> The transition month of the year (January = 1, ...).
 * <dt> week
 *   <dd> The transition week of the month (First = 1, ..., Fourth = 4,
 *        Last = -1).
 * <dt> wkday
 *   <dd> The transition day of the week (Sunday = 1, ...).
 * <dt> mday
 *   <dd> The transition day of the month (1, ... 31).
 * <dt> hour
 *   <dd> The transition hour (midnight = 0, noon = 12, ...).
 * <dt> min
 *   <dd> The transition minute.
 * <dt> sec
 *   <dt> The transition second (which is usually 0).
 * </dl>
 *
 * <h5>Notes</h5>
 * <ul>
 * <li> Timezones with no DST only specify an id and a standard info
 *      object with a single "offset" property.
 * <li> Timezones with a DST <em>must</em> provide standard and
 *      daylight info objects.
 * <li> If timezone has DST, then the following properties of the
 *      standard and daylight info objects are <em>required</em>:
 *      offset, month, hour, min, sec.
 * <li> Transition dates are specified in only one of the following ways:
 *   <ul>
 *   <li> by specifying a specific date of the year (e.g. March 10);
 *   <li> or by specifying the day of a specific week within some
 *        month (e.g. Second Wednesday, Last Saturday, etc).
 *   </ul>
 * <li> If the transition date is specified as a specific date of the
 *      year, then the following field in the standard and/or daylight
 *      info objects are <em>required</em>: mday.
 * <li> If the transition date is specified as the day of a specific
 *      week, then the following fields in the standard and/or daylight
 *      info objects are <em>required</em>: week, wkday.
 * </ul>
 *
 * <h5>Examples</h5>
 * <dl>
 * <dt> Timezone with no DST
 *   <dd>
 *   <pre>
 *   var timezone = { clientId: "My Timezone", standard: { offset: -480 } };
 *   </pre>
 * <dt> America/Los_Angeles, 2007
 *   <dd>
 *   <pre>
 *   var standard = {
 *     offset: -480,
 *     mon: 11, week: 1, wkday: 1,
 *     hour: 2, min: 0, sec: 0    
 *   };
 *   var daylight = {
 *     offset: -420,
 *     mon: 3, week: 2, wkday: 1,
 *     hour: 2, min: 0, sec: 0
 *   };
 *   var timezone = { clientId: "My Timezone",
 *                    standard: standard, daylight: daylight };
 *   </pre>
 * <dt> Custom US/Pacific using 11 Mar 2007 and 2 Dec 2007
 *   <dd>
 *   <pre>
 *   var standard = {
 *     offset: -480,
 *     mon: 11, mday: 2,
 *     hour: 2, min: 0, sec: 0
 *   };
 *   var daylight = {
 *     offset: -420,
 *     mon: 3, mday: 11,
 *     hour: 2, min: 0, sec: 0
 *   };
 *   var timezone = { clientId: "My Timezone",
 *                    standard: standard, daylight: daylight };
 *   </pre>
 * </dl>
 * <p>
 * <strong>Note:</strong>
 * Specifying a transition date using a specific date of the year
 * <em>should</em> be avoided.
 *
 * <hr>
 *
 * <p>
 * This class stores mappings between client and server identifiers for
 * timezones as well as attempting to guess the default timezone. The 
 * application can override this value, through a user preference perhaps, 
 * by setting the <code>DEFAULT</code> property's value. The default 
 * timezone is specified using the client identifier.
 *
 * @class
 */
AjxTimezone = function() {};

//
// Static methods
//

AjxTimezone.convertTimezone = function(date, fromClientId, toClientId) {
	if (fromClientId == toClientId) {
		return date;
	}
	var offset1 = AjxTimezone.getOffset(toClientId, date);
	var offset2 = AjxTimezone.getOffset(fromClientId, date);
	//returning a new Date object since we might not always want to modify the parameter Date object
	return new Date(date.getTime() + (offset1 - offset2) * 60 * 1000);
};


AjxTimezone.getTransition = function(onset, year) {
	var trans = [ year || new Date().getFullYear(), onset.mon, 1 ];
	if (onset.mday) {
		trans[2] = onset.mday;
	}
	else if (onset.wkday) {
		var date = new Date(year, onset.mon - 1, 1, onset.hour, onset.min, onset.sec);

		// last wkday of month
		if (onset.week == -1) {
			// NOTE: This creates a date of the *last* day of specified month by
			//       setting the month to *next* month and setting day of month
			//       to zero (i.e. the day *before* the first day).
			var last = new Date(new Date(date.getTime()).setMonth(onset.mon, 0));
			var count = last.getDate();
			var wkday = last.getDay() + 1;
			var adjust = wkday >= onset.wkday ? wkday - onset.wkday : 7 - onset.wkday - wkday;
			trans[2] = count - adjust;
		}

		// Nth wkday of month
		else {
			var wkday = date.getDay() + 1;
			var adjust = onset.wkday == wkday ? 1 :0;
			trans[2] = onset.wkday + 7 * (onset.week - adjust) - wkday + 1;
		}
	}
	return trans;
};

AjxTimezone.createMDayTransition = function(date, offset) {
	if (date instanceof Date) {
		offset = offset != null ? offset : date.getTimezoneOffset();
		date = [
			date.getFullYear(), date.getMonth() + 1, date.getDate(),
			date.getHours(), date.getMinutes(), date.getSeconds()
		];
	}
	var onset = { offset: offset, trans: date };
	return AjxTimezone.addMDayTransition(onset);
};

AjxTimezone.addMDayTransition = function(onset) {
	var trans = onset.trans;
	onset.mon = trans[1];
	onset.mday = trans[2];
	onset.hour = trans[3];
	onset.min = trans[4];
	onset.sec = trans[5];
	return onset;
};

AjxTimezone.createWkDayTransition = function (date, offset) {
	if (date instanceof Date) {
		offset = offset != null ? offset : date.getTimezoneOffset();
		date = [
			date.getFullYear(), date.getMonth() + 1, date.getDate(),
			date.getHours(), date.getMinutes(), date.getSeconds()
		];
	}
	var onset = { offset: offset, trans: date };
	return AjxTimezone.addWkDayTransition(onset);
};

AjxTimezone.addWkDayTransition = function(onset) {
	var trans = onset.trans;
	var mon = trans[1];
	var monDay = trans[2];
	var week = Math.floor((monDay - 1) / 7);
	var date = new Date(trans[0], trans[1] - 1, trans[2], 12, 0, 0);

	// NOTE: This creates a date of the *last* day of specified month by
	//       setting the month to *next* month and setting day of month
	//       to zero (i.e. the day *before* the first day).
	var count = new Date(new Date(date.getTime()).setMonth(mon - 1, 0)).getDate();
	var last = count - monDay < 7;

	// set onset values
	onset.mon =  mon;
	onset.week = last ? -1 : week + 1;
	onset.wkday = date.getDay() + 1;
	onset.hour = trans[3];
	onset.min = trans[4];
	onset.sec = trans[5];
	return onset;
};

AjxTimezone.createTransitionDate = function(onset) {
    var date = new Date(AjxTimezoneData.TRANSITION_YEAR, onset.mon - 1, 1, 12, 0, 0);
    if (onset.mday) {
        date.setDate(onset.mday);
    }
    else if (onset.week == -1) {
        date.setMonth(date.getMonth() + 1, 0);
        for (var i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() - 1);
        }
    }
    else {
        for (var i = 0; i < 7; i++) {
            if (date.getDay() + 1 == onset.wkday) {
                break;
            }
            date.setDate(date.getDate() + 1);
        }
        date.setDate(date.getDate() + 7 * (onset.week - 1));
    }
    var trans = [ date.getFullYear(), date.getMonth() + 1, date.getDate() ];
    return trans;
};

AjxTimezone.getZonePreferences =
function() {
	if (AjxTimezone._PREF_ZONE_DISPLAY) {
		var count = AjxTimezone._PREF_ZONE_DISPLAY.length;
		var total = AjxTimezone.STANDARD_RULES.length + AjxTimezone.DAYLIGHT_RULES.length;
		if (count != total) {
			AjxTimezone._PREF_ZONE_DISPLAY = null;
		}
	}

	if (!AjxTimezone._PREF_ZONE_DISPLAY) {
		AjxTimezone._PREF_ZONE_DISPLAY = [];
		AjxTimezone.getAbbreviatedZoneChoices();
		for (var i = 0; i < AjxTimezone._ABBR_ZONE_OPTIONS.length; i++) {
			AjxTimezone._PREF_ZONE_DISPLAY.push(AjxTimezone._ABBR_ZONE_OPTIONS[i].displayValue);
		}
	}
	return AjxTimezone._PREF_ZONE_DISPLAY;
};

AjxTimezone.getZonePreferencesOptions =
function() {
	if (AjxTimezone._PREF_ZONE_OPTIONS) {
		var count = AjxTimezone._PREF_ZONE_OPTIONS.length;
		var total = AjxTimezone.STANDARD_RULES.length + AjxTimezone.DAYLIGHT_RULES.length;
		if (count != total) {
			AjxTimezone._PREF_ZONE_OPTIONS = null;
		}
	}

	if (!AjxTimezone._PREF_ZONE_OPTIONS) {
		AjxTimezone._PREF_ZONE_OPTIONS = [];
		AjxTimezone.getAbbreviatedZoneChoices();
		for (var i = 0; i < AjxTimezone._ABBR_ZONE_OPTIONS.length; i++) {
			AjxTimezone._PREF_ZONE_OPTIONS.push(AjxTimezone._ABBR_ZONE_OPTIONS[i].value); //use value is better, serverID is usd by compare operator.
		}
	}
	return AjxTimezone._PREF_ZONE_OPTIONS;
};

AjxTimezone.getServerId = function(clientId) {
	return AjxTimezone._CLIENT2SERVER[clientId] || clientId;
};
AjxTimezone.getClientId = function(serverId) {
	return AjxTimezone._SERVER2CLIENT[serverId] || serverId;
};

AjxTimezone.getShortName = function(clientId) {
	var rule = AjxTimezone.getRule(clientId);
    if (rule && rule.shortName) return rule.shortName;
    var generatedShortName = ["GMT",AjxTimezone._SHORT_NAMES[clientId]].join("");
    if(rule) rule.shortName = generatedShortName;
	return generatedShortName;
};

AjxTimezone.getMediumName = function(clientId) {
	var rule = AjxTimezone.getRule(clientId);
    if (rule && rule.mediumName) return rule.mediumName;
    var generatedMediumName = TzMsg[clientId] || ['(',AjxTimezone.getShortName(clientId),') ',clientId].join("");
    if(rule) rule.mediumName = generatedMediumName;
	return generatedMediumName;
};

AjxTimezone.getLongName = AjxTimezone.getMediumName;

AjxTimezone.addRule = function(rule) {
    var serverId = rule.serverId;
    var clientId = rule.clientId;

    AjxTimezone._CLIENT2SERVER[clientId] = serverId;
    AjxTimezone._SERVER2CLIENT[serverId] = clientId;
    AjxTimezone._SHORT_NAMES[clientId] = AjxTimezone._generateShortName(rule.standard.offset);
    AjxTimezone._CLIENT2RULE[clientId] = rule;

    var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
    array.push(rule);
};

AjxTimezone.getRule = function(clientId, tz) {
	var rule = AjxTimezone._CLIENT2RULE[clientId];
    if (!rule) {
        // try to find the rule treating the clientId as the serverId
        clientId = AjxTimezone._SERVER2CLIENT[clientId];
        rule = AjxTimezone._CLIENT2RULE[clientId];
    }
    if (!rule && tz) {
        var names = [ "standard", "daylight" ];
        var rules = tz.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        for (var i = 0; i < rules.length; i++) {
            rule = rules[i];

            var found = true;
            for (var j = 0; j < names.length; j++) {
                var name = names[j];
                var onset = rule[name];
                if (!onset) continue;
			
				var breakOuter = false;

                for (var p in tz[name]) {
                    if (tz[name][p] != onset[p]) {
                        found = false;
                        breakOuter = true;
                        break;
                    }
                }
                
                if(breakOuter){
                	break;
                }
            }
            if (found) {
                return rule;
            }
        }
        return null;
    }

    return rule;
};

AjxTimezone.getOffset = function(clientId, date) {
	var rule = AjxTimezone.getRule(clientId || AjxTimezone.DEFAULT);
	if (rule && rule.daylight) {
		var year = date.getFullYear();

		var standard = rule.standard, daylight  = rule.daylight;
		var stdTrans = AjxTimezone.getTransition(standard, year);
		var dstTrans = AjxTimezone.getTransition(daylight, year);

		var month    = date.getMonth()+1, day = date.getDate();
		var stdMonth = stdTrans[1], stdDay = stdTrans[2];
		var dstMonth = dstTrans[1], dstDay = dstTrans[2];

		// northern hemisphere
		var isDST = false;
		if (dstMonth < stdMonth) {
			isDST = month > dstMonth && month < stdMonth;
			isDST = isDST || (month == dstMonth && day >= dstDay);
			isDST = isDST || (month == stdMonth && day <  stdDay);
		}

		// sorthern hemisphere
		else {
			isDST = month < stdMonth || month > dstMonth;
			isDST = isDST || (month == dstMonth && day >=  dstDay);
			isDST = isDST || (month == stdMonth && day < stdDay);
		}

		return isDST ? daylight.offset : standard.offset;
	}
	return rule ? rule.standard.offset : -(new Date().getTimezoneOffset());
};

AjxTimezone.guessMachineTimezone = function() {
	return AjxTimezone._guessMachineTimezone().clientId;
};

AjxTimezone.getAbbreviatedZoneChoices = function() {
	if (AjxTimezone._ABBR_ZONE_OPTIONS) {
		var count = AjxTimezone._ABBR_ZONE_OPTIONS.length;
		var total = AjxTimezone.STANDARD_RULES.length + AjxTimezone.DAYLIGHT_RULES.length;
		if (count != total) {
			AjxTimezone._ABBR_ZONE_OPTIONS = null;
		}
	}
	if (!AjxTimezone._ABBR_ZONE_OPTIONS) {
		AjxTimezone._ABBR_ZONE_OPTIONS = [];
		for (var clientId in AjxTimezone._CLIENT2SERVER) {
			var rule = AjxTimezone._CLIENT2RULE[clientId];
			var serverId = rule.serverId;
			var option = {
				displayValue: AjxTimezone.getMediumName(clientId),
				value: serverId,
				// these props used by sort comparator
				standard: rule.standard,
				serverId: serverId, //In _BY_OFFSET, the attribute name is serverId.
                clientId: clientId
			};
			AjxTimezone._ABBR_ZONE_OPTIONS.push(option);
		}
		AjxTimezone._ABBR_ZONE_OPTIONS.sort(AjxTimezone._BY_OFFSET);
	}
	return AjxTimezone._ABBR_ZONE_OPTIONS;
};

AjxTimezone.getMatchingTimezoneChoices = function() {
	if (AjxTimezone._MATCHING_ZONE_OPTIONS) {
		var count = AjxTimezone._MATCHING_ZONE_OPTIONS.length;
		var total = AjxTimezone.STANDARD_RULES.length + AjxTimezone.DAYLIGHT_RULES.length;
		if (count != total) {
			AjxTimezone._MATCHING_ZONE_OPTIONS = null;
		}
	}
	if (!AjxTimezone._MATCHING_ZONE_OPTIONS) {
		AjxTimezone._MATCHING_ZONE_OPTIONS = [];
		for (var i in AjxTimezone.MATCHING_RULES) {
			var rule = AjxTimezone.MATCHING_RULES[i];
			var clientId = rule.clientId;
			var serverId = rule.serverId;
            if(clientId == AjxTimezone.AUTO_DETECTED) continue;
			var option = {
				displayValue: AjxTimezone.getMediumName(clientId),
				value: serverId,
				// these props used by sort comparator
				standard: rule.standard,
				serverId: serverId, //In _BY_OFFSET, the attribute name is serverId.
                clientId: clientId
			};
			AjxTimezone._MATCHING_ZONE_OPTIONS.push(option);
		}
		AjxTimezone._MATCHING_ZONE_OPTIONS.sort(AjxTimezone._BY_OFFSET);
	}
	return AjxTimezone._MATCHING_ZONE_OPTIONS;
};

AjxTimezone._BY_OFFSET = function(arule, brule) {
	// sort by offset and then by name
	var delta = arule.standard.offset - brule.standard.offset;
	if (delta == 0) {
		var aname = arule.serverId;
		var bname = brule.serverId;
		if (aname < bname) delta = -1;
		else if (aname > bname) delta = 1;
	}
	return delta;
};

// Constants

/**
 * Client identifier for GMT.
 * <p>
 * <strong>Note:</strong>
 * UK observes daylight savings time so this constant should
 * <em>not</em> be used as the reference point (i.e. UTC) --
 * use {@link AjxTimezone.GMT_NO_DST} instead. The name of
 * this constant is historical.
 */
AjxTimezone.GMT = "Europe/London";

/**
 * Client identifier for GMT with no daylight savings time.
 */
AjxTimezone.GMT_NO_DST = "UTC";

/**
 * <strong>Note:</strong>
 * Do NOT change this value because it is used to reference messages.
 */
AjxTimezone.AUTO_DETECTED = "Auto-Detected";

/**
 * The default timezone is set by guessing the machine timezone later
 * in this file. See the static initialization section below for details.
 */

AjxTimezone._CLIENT2SERVER = {};
AjxTimezone._SERVER2CLIENT = {};
AjxTimezone._SHORT_NAMES = {};
AjxTimezone._CLIENT2RULE = {};

/** 
 * The data is specified using the server identifiers for historical
 * reasons. Perhaps in the future we'll use the client (i.e. Java)
 * identifiers on the server as well.
 */
AjxTimezone.STANDARD_RULES = [];
AjxTimezone.DAYLIGHT_RULES = [];
(function() {
    for (var i = 0; i < AjxTimezoneData.TIMEZONE_RULES.length; i++) {
        var rule = AjxTimezoneData.TIMEZONE_RULES[i];
        var array = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
        array.push(rule);
    }
})();

/**
 * One problem with firefox, is if the timezone on the machine changes,
 * the browser isn't updated. You have to restart firefox for it to get the 
 * new machine timezone.
 * <p>
 * <strong>Note:</strong>
 * It looks like the current versions of FF always reflect the current
 * timezone w/o needing to restart the browser.
 * timezonePreference - optional value used to decide timezone rule in case of conflict 
 */
AjxTimezone._guessMachineTimezone = 
function(timezonePreference) {
	var dec1 = new Date(AjxTimezoneData.TRANSITION_YEAR, 11, 1, 0, 0, 0);
	var jun1 = new Date(AjxTimezoneData.TRANSITION_YEAR, 5, 1, 0, 0, 0);
	var dec1offset = -dec1.getTimezoneOffset();
	var jun1offset = -jun1.getTimezoneOffset();

    AjxTimezone.MATCHING_RULES = [];
    AjxTimezone.TIMEZONE_CONFLICT = false;
    var matchingRules = [];
    var matchingRulesMap = {};
    var offsetMatchingRules = [];
    var daylightMatchingFound = false;

    // if the offset for jun is the same as the offset in december,
	// then we have a timezone that doesn't deal with daylight savings.
	if (jun1offset == dec1offset) {
		var rules = AjxTimezone.STANDARD_RULES;
 		for (var i = 0; i < rules.length ; ++i ) {
            var rule = rules[i];
            if (rule.standard.offset == jun1offset) {
				 if(!matchingRulesMap[rule.serverId]) {
                     matchingRules.push(rule);
                     matchingRulesMap[rule.serverId] = true;
                 }
                 AjxTimezone.MATCHING_RULES.push(rule);
			}
		}
	}

    // we need to find a rule that matches both offsets
    else {
		var rules = AjxTimezone.DAYLIGHT_RULES;
		var dst = Math.max(dec1offset, jun1offset);
		var std = Math.min(dec1offset, jun1offset);
        var now = new Date();
        var currentOffset = -now.getTimezoneOffset();
        for (var i = 0; i < rules.length ; ++i ) {
			var rule = rules[i];
			if (rule.standard.offset == std && rule.daylight.offset == dst) {
                var strans = rule.standard.trans;
                var dtrans = rule.daylight.trans;

                var s0 = new Date(strans[0], strans[1]-1, strans[2]-1);
                var s1 = new Date(strans[0], strans[1]-1, strans[2]+2);
                var d0 = new Date(dtrans[0], dtrans[1]-1, dtrans[2]-1);
                var d1 = new Date(dtrans[0], dtrans[1]-1, dtrans[2]+2);
                if (-s1.getTimezoneOffset() == std && -d1.getTimezoneOffset() == dst &&
                    -s0.getTimezoneOffset() == dst && -d0.getTimezoneOffset() == std) {
                    if(!matchingRulesMap[rule.serverId]) {
                        matchingRules.push(rule);
                        matchingRulesMap[rule.serverId] = true;
                    }                    
                    daylightMatchingFound = true;
                }
            }
            //used for conflict resolution when server rules are wrong 
            if (rule.standard.offset == currentOffset || rule.daylight.offset == currentOffset) {
                    AjxTimezone.MATCHING_RULES.push(rule);
            }
		}
	}

    //when there is a timezone conflict use the preference to find better match
    if((matchingRules.length > 0) && timezonePreference != null) {
        var rules = matchingRules; 
        for(var i in rules) {
            if(rules[i].serverId == timezonePreference) {
                return rules[i];
            }
        }
    }

    if(matchingRules.length > 0) {
        // resolve conflict, if possible
        if (matchingRules.length > 1) {
            matchingRules.sort(AjxTimezone.__BY_SCORE);
            if (matchingRules[0].score != matchingRules[1].score) {
                matchingRules.length = 1;
            }
        }
        // mark if conflict and return best guess
        AjxTimezone.TIMEZONE_CONFLICT = (matchingRules.length > 1);  
        return matchingRules[0];        
    }

    if((AjxTimezone.MATCHING_RULES.length > 0) && timezonePreference != null) {
        var rules = AjxTimezone.MATCHING_RULES; 
        for(var i in rules) {
            if(rules[i].serverId == timezonePreference) {
                return rules[i];
            }
        }
    }

    // generate default rule
    return AjxTimezone._generateDefaultRule();
};

AjxTimezone.__BY_SCORE = function(a, b) {
    return b.score - a.score;
};

// Thanks to Jiho for this new, improved logic for generating the timezone rule.
AjxTimezone._generateDefaultRule = function() {
	var byMonth = 0;
	var byDate = 1;
	var byHour = 2;
	var byMinute = 3;
	var bySecond = 4;

	// Sweep the range between d1 and d2 looking for DST transitions.
	// Iterate the range by "by" unit.  When a transition is detected,
	// sweep the range between before/after dates by increasingly
	// smaller unit, month then date then hour then minute then finally second.
	function sweepRange(d1, d2, by, rule) {
		var upperBound = d2.getTime();
		var d = new Date();
		d.setTime(d1.getTime());
		var prevD = new Date();
		prevD.setTime(d.getTime());
		var prevOffset = d1.getTimezoneOffset() * -1;

		// initialize rule
		if (!rule) {
			rule = {
				clientId: AjxTimezone.AUTO_DETECTED,
				autoDetected: true
			};
		}

		// perform sweep
		while (d.getTime() <= upperBound) {
			// Increment by the right unit.
			if (by == byMonth) {
				d.setUTCMonth(d.getUTCMonth() + 1);
			}
			else if (by == byDate) {
				d.setUTCDate(d.getUTCDate() + 1);
			}
			else if (by == byHour) {
				d.setUTCHours(d.getUTCHours() + 1);
			}
			else if (by == byMinute) {
				d.setUTCMinutes(d.getUTCMinutes() + 1);
			}
			else if (by == bySecond) {
				d.setUTCSeconds(d.getUTCSeconds() + 1);
			}
			else {
				return rule;
			}

			var offset = d.getTimezoneOffset() * -1;
			if (offset != prevOffset) {
				if (by < bySecond) {
					// Drill down.
					rule = sweepRange(prevD, d, by + 1, rule);
				}
				else {
					// Tricky:
					// Initialize a Date object whose UTC fields are set to prevD's local fields.
					// Then add 1 second to get UTC version of onset time.  We want to work in UTC
					// to prevent the date object from experiencing the DST jump when we add 1 second.
					var trans = new Date();
					trans.setUTCFullYear(prevD.getFullYear(), prevD.getMonth(), prevD.getDate());
					trans.setUTCHours(prevD.getHours(), prevD.getMinutes(),     prevD.getSeconds() + 1);

					var onset = rule[prevOffset < offset ? "daylight" : "standard"] = {
						offset: offset,
						trans: [
							trans.getUTCFullYear(), trans.getUTCMonth() + 1, trans.getUTCDate(),    // yyyy-MM-dd
							trans.getUTCHours(),    trans.getUTCMinutes(),   trans.getUTCSeconds()  //   HH:mm:ss
						]
					};
					AjxTimezone.addWkDayTransition(onset);
					return rule;
				}
			}

			prevD.setTime(d.getTime());
			prevOffset = offset;
		}

		return rule;
	}

	// Find DST transitions between yyyy/07/71 00:00:00 and yyyy+1/06/30 23:59:59.
	// We can detect transition on/around 12/31 and 01/01.  Assume no one will
	// transition on/around 6/30 and 07/01.
	var d1 = new Date();
	var d2 = new Date();

	// set sweep start to yesterday
	var year = d1.getFullYear();
	d1.setUTCFullYear(year, d1.getMonth(), d1.getDate() - 1);
	d1.setUTCHours(0, 0, 0, 0);

	// set sweep end to tomorrow + 1 year
	d2.setTime(d1.getTime());
	d2.setUTCFullYear(year + 1, d1.getMonth(), d1.getDate() + 1);

	// case 1: no onset returned -> TZ doesn't use DST
	// case 2: two onsets returned -> TZ uses DST
	// case 3: only one onset returned -> mid-year policy change -> simplify and assume it's non-DST
	// case 4: three or more onsets returned -> shouldn't happen
	var rule = sweepRange(d1, d2, byMonth);

	// handle case 1 and 3
	if (!rule.daylight || !rule.standard) {
		rule.standard = { offset: d1.getTimezoneOffset() * -1 };
		delete rule.daylight;
	}

	// now that standard offset is determined, set serverId
	rule.serverId = ["(GMT",AjxTimezone._generateShortName(rule.standard.offset, true),") ",AjxTimezone.AUTO_DETECTED].join("");
	//To resolve brasilia timezone Issue this is hack.Details in ZBUG-922.
	if (rule.serverId.includes('GMT-03.00')) {
	  rule.serverId = "America/Sao_Paulo";
	}

	// bug 33800: guard against inverted daylight/standard onsets
	if (rule.daylight && rule.daylight.offset < rule.standard.offset) {
		var onset = rule.daylight;
		rule.daylight = rule.standard;
		rule.standard = onset;
	}

	// add generated rule to proper list
	//AjxTimezoneData.TIMEZONE_RULES.unshift(rule);
	//var rules = rule.daylight ? AjxTimezone.DAYLIGHT_RULES : AjxTimezone.STANDARD_RULES;
	//rules.unshift(rule);

	return rule;
};

AjxTimezone._generateShortName = function(offset, period) {
	if (offset == 0) return "";
	var sign = offset < 0 ? "-" : "+";
	var stdOffset = Math.abs(offset);
	var hours = Math.floor(stdOffset / 60);
	var minutes = stdOffset % 60;
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	return [sign,hours,period?".":"",minutes].join("");
};

// Static initialization

AjxTimezone.DEFAULT_RULE = AjxTimezone._guessMachineTimezone();


/*** DEBUG ***
// This forces the client to create an auto-detected timezone rule,
// regardless of whether the actual timezone was detected correctly
// from the known list.
AjxTimezone.DEFAULT_RULE = AjxTimezone._generateDefaultRule();
/***/

(function() {
    AjxTimezoneData.TIMEZONE_RULES.sort(AjxTimezone._BY_OFFSET);
    for (var j = 0; j < AjxTimezoneData.TIMEZONE_RULES.length; j++) {
        var rule = AjxTimezoneData.TIMEZONE_RULES[j];
        AjxTimezone.addRule(rule);
    }
})();

AjxTimezone.DEFAULT = AjxTimezone.getClientId(AjxTimezone.DEFAULT_RULE.serverId);
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

if (AjxPackage.define("zimbraMail.docs.view.ZmDocsPreview")) {
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

ZmDocsPreview = function(container, params){

    this._container = document.getElementById(container);

    params = params || {};
    if(params.versionCont)
        params.versionCont = document.getElementById(params.versionCont);
    if(params.dateContainer){
        params.dateContainer = document.getElementById(params.dateContainer);
    }
    this._params = params;

    if(!params.deferInit)   this.init();

};

ZmDocsPreview.prototype.constructor = ZmDocsPreview;

//TODO: Make ZmPreview base class sto isolate all the common methods for Documents
//ZmDocsPreview.prototype = new ZmPreview

ZmDocsPreview.launch =
function(container, params){
    return ( new ZmDocsPreview(container, params) );
};

ZmDocsPreview.prototype.init =
function(){
    this.loadContent(new AjxCallback(this, this.show));
};

ZmDocsPreview.prototype.loadContent =
function(callback){
    if(!this._content){
        this.fetchContent(callback);
        return;
    }

    if(callback) callback.run();
};

ZmDocsPreview.prototype.getContent =
function(){
    return this._content;
};

ZmDocsPreview.prototype.fetchContent =
function(callback){

    var serverUrl = window.location.href;
    serverUrl = serverUrl.replace(/\?.*/,''); //Cleanup Params

    var urlParams = [];
    urlParams.push("fmt=native");

    var version = this._params.version;
    if(version)
        urlParams.push("ver="+version);

    urlParams = urlParams.join('&');
    serverUrl = serverUrl + ( urlParams.length > 0 ? "?" : "" ) + urlParams;

    AjxRpc.invoke(urlParams, serverUrl, null, new AjxCallback(this, this._handleFetchContent, callback), true);
    
};

ZmDocsPreview.prototype._handleFetchContent =
function(callback, response){
   this._content = response.text;
   if(callback)
        callback.run();
};

ZmDocsPreview.prototype.show =
function(){
    var previewHTML = this._content;
    this._container.innerHTML = previewHTML;
    var params = this._params;
    if(params.versionCont){
       params.versionCont.innerHTML = this._params.version;
    }
    if(params.dateContainer && params.dateModified){
        //bug:50533, Server sends GMT, convert it into Client timezone
        var dateModified = new Date(params.dateModified);
        params.dateModified = AjxTimezone.convertTimezone(dateModified, AjxTimezone.GMT ,AjxTimezone.DEFAULT);
        var dateFormatter = AjxDateFormat.getDateTimeInstance(AjxDateFormat.LONG, AjxDateFormat.SHORT);
        params.dateContainer.innerHTML = dateFormatter.format(params.dateModified) || params.dateModified;
    }
	this.fixImages();

};

ZmDocsPreview.prototype.fixImages = 
function() {
	var images = document.getElementsByTagName("img");
	
	for (var i = 0; i < images.length; i++) {
		var dfsrc = images[i].getAttribute("dfsrc");
		if (dfsrc && dfsrc.match(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\_\.]*(\?\S+)?)?)?/)) {
			// Fix for IE: Over HTTPS, http src urls for images might cause an issue.
			try {
				images[i].src = ''; //unload it first
				images[i].src = dfsrc;
			} catch (ex) {
				// do nothing
			}
		}
	}	
};
}
}
