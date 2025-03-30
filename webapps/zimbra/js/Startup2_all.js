if (AjxPackage.define("Startup2")) {
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

if (AjxPackage.define("ajax.util.AjxSelectionManager")) {
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
 * This requires an "owner" which is the object that owns the full set of items, implementing:
 * getItemCount() to return the number of items
 * getItem(index) to return the item at a given index.
 * 
 * And optionally implementing
 * itemSelectionChanged(item, index, isSelected) which is called
 *         for each item that is selected or deselected
 * selectionChanged() which is called after a batch of items have
 *         been selected or deselected with select()
 *
 * @private
 */
AjxSelectionManager = function(anOwner) {
	this._owner = anOwner;
};

// -----------------------------------------------------------
// Constants
// -----------------------------------------------------------

// Actions for select()
AjxSelectionManager.SELECT_ONE_CLEAR_OTHERS = 0;
AjxSelectionManager.TOGGLE_ONE_LEAVE_OTHERS = 1;
AjxSelectionManager.SELECT_TO_ANCHOR = 2;
AjxSelectionManager.DESELECT_ALL = 3;
AjxSelectionManager.SELECT_ALL = 4;

// -----------------------------------------------------------
// API Methods
// -----------------------------------------------------------

/**
 * returns an AjxVector
 */
AjxSelectionManager.prototype.getItems = function() {
	if (this._selectedItems == null) {
		this._selectedItems = this._createItemsCollection();
	}
	return this._selectedItems;
};

/**
 * returns the number of selected items
 */	
AjxSelectionManager.prototype.getLength = function() {
	return this.getItems().length;
};
	
/**
 * returns the anchor, unless nothing is selected
 */
AjxSelectionManager.prototype.getAnchor = function() {
	if (this._anchor == null) {
		var items = this.getItems();
		if (items.length > 0) {
			this._anchor = items[0];
		}
	}
	return this._anchor;
};
    
/**
 * The cursor probably changes when the users navigates with 
 * the keyboard. This returns the item that is currently the cursor,
 * and null if nothing is selected.
 */
AjxSelectionManager.prototype.getCursor = function() {
	if (this._cursor == null) {
		this._cursor = this.getAnchor();
	}
	return this._cursor;
};
    
    
/**
 * Returns true if the given item is selected.
 */
AjxSelectionManager.prototype.isSelected = function(item) {
	return this.getItems().binarySearch(item) != -1;
};
    
AjxSelectionManager.prototype.selectOneItem = function(item) {
	this.select(item, AjxSelectionManager.SELECT_ONE_CLEAR_OTHERS);
};
    
AjxSelectionManager.prototype.toggleItem = function(item) {
	this.select(item, AjxSelectionManager.TOGGLE_ONE_LEAVE_OTHERS);
};
	
AjxSelectionManager.prototype.selectFromAnchorToItem = function(item) {
	this.select(item, AjxSelectionManager.SELECT_TO_ANCHOR);
};
    
AjxSelectionManager.prototype.deselectAll = function() {
	this.select(null, AjxSelectionManager.DESELECT_ALL);
};
	
AjxSelectionManager.prototype.selectAll = function() {
	this.select(null, AjxSelectionManager.SELECT_ALL);
};
    
    
/**
 * This method will notify the owner of any changes by calling
 * itemSelectionChanged() (if the owner defines it) for each item whose
 * selection changes and also by calling selectionChanged() (if the
 * owner defines it) once at the end, if anything changed selection.
 *
 */
AjxSelectionManager.prototype.select = function(item, action) {
	
	// Update the anchor and cursor, if necessary
	this._setAnchorAndCursor(item, action);
    
	// save off the old set of selected items
	var oldItems = this._selectedItems;
	var oldItemsCount = (oldItems == null) ? 0 : oldItems.length;
	
	// create a fresh set of selected items
	this._selectedItems = null;
	this._selectedItems = this._createItemsCollection();
	
	// Now update the selection
	var itemCount = this._owner.getItemCount();
	var needsSort = false;
	var selectionChanged = false;
	var selecting = false;
	for (var i = 0; i < itemCount; ++i) {
		var testItem = this._owner.getItem(i);
		var oldSelectionExists = this._isItemOldSelection(testItem, oldItems);
		var newSelectionExists = oldSelectionExists;
		
		switch (action) {
		case AjxSelectionManager.SELECT_TO_ANCHOR:
			if (this._anchor == null) {
				// If we have no anchor, let it be the first item
				// in the list
				this._anchor = testItem;
			}
			var atEdge = (testItem == this._anchor || testItem == item);
			var changed = false;
			// mark the beginning of the selection for the iteration
			if (!selecting && atEdge) {
				selecting = true;
				changed = true;
			}
			newSelectionExists = selecting;
			// mark the end of the selection if we're there
			if ((!changed || this._anchor == item) 
				&& selecting && atEdge) {
				selecting = false;
			}

			break;
		case AjxSelectionManager.SELECT_ONE_CLEAR_OTHERS:
			newSelectionExists = (testItem == item);
			break;
		case AjxSelectionManager.TOGGLE_ONE_LEAVE_OTHERS:
			if (testItem == item) {
				newSelectionExists = !oldSelectionExists ;
			}
			break;
		case AjxSelectionManager.DESELECT_ALL:
			newSelectionExists = false;
			break;
		case AjxSelectionManager.SELECT_ALL:
			newSelectionExists = true;
			break;
		}

		if (newSelectionExists) {
			this._selectedItems.add(testItem);
			needsSort = (this._selectedItems.length > 1);
		}

		if ( newSelectionExists != oldSelectionExists) {
			// Something changed so notify the owner.
			if (this._owner.itemSelectionChanged != null) {
				this._owner.itemSelectionChanged(testItem, 
												 i, newSelectionExists);
			}
			selectionChanged = true;
		}
	}
	selectionChanged = selectionChanged || (oldItemsCount != 
											this._selectedItems.length);

	if (needsSort) this._selectedItems.sort();
	
	if (selectionChanged && this._owner.selectionChanged != null) {
		this._owner.selectionChanged(item);
	}
};

/**
 * Remove an item from the selection managers selected items
 * collection if it exists.
 */
AjxSelectionManager.prototype.removeItem = function(item) {
	if (this._selectedItems) {
		var index = this._selectedItems.binarySearch(item);
		if (index > -1) this._selectedItems.removeAt(index);
	}
};

// -----------------------------------------------------------
// Internal Methods
// -----------------------------------------------------------
	
/**
 * Creates an array suitable for use as the sorted list of selected
 * items and returns it.
 */
AjxSelectionManager.prototype._createItemsCollection = function() {
	return new AjxVector();
};

AjxSelectionManager.prototype._isItemOldSelection = function (testItem, oldItems) {
	var ret = false;
	if (oldItems) {
		var oldSelectionIndex = oldItems.binarySearch(testItem);
		if (oldSelectionIndex > -1) {
			oldItems.removeAt(oldSelectionIndex);
		}
		ret = (oldSelectionIndex != -1);
	}
	return ret;
};

AjxSelectionManager.prototype._setAnchorAndCursor = function (item, action) {
	switch (action) {
	case AjxSelectionManager.SELECT_TO_ANCHOR:
		this._cursor = item;
		break;
	case AjxSelectionManager.SELECT_ONE_CLEAR_OTHERS:		
		this._anchor = item;
		this._cursor = item;
		break;
	case AjxSelectionManager.TOGGLE_ONE_LEAVE_OTHERS:
		this._anchor = item;
		this._cursor = item;
		break;
	case AjxSelectionManager.DESELECT_ALL:
		this._anchor = null;
		this._cursor = null;
		break;
	case AjxSelectionManager.SELECT_ALL:
		return;
	}
};
}
if (AjxPackage.define("ajax.net.AjxPost")) {
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
 * Resets the AjxPost object.
 * @constructor
 * @class
 * This singleton class makes an HTTP POST to the server and receives the response, passing returned data
 * to a callback. This class is used to upload files from the client browser to the server using the file
 * upload feature of POST.
 *
 * @param	{string}	iframeId		the iframe ID
 * 
 * @author Conrad Damon
 * 
 * @private
 */
AjxPost = function(iframeId) {
	this._callback = null;
	this._iframeId = iframeId;
}


// Globals

AjxPost._reqIds = 0;
AjxPost._outStandingRequests = new Object();


// Consts 

// Common HttpServletResponse error codes
// - see full list: http://java.sun.com/products/servlet/2.2/javadoc/javax/servlet/http/HttpServletResponse.html
AjxPost.SC_CONTINUE					= 100;
AjxPost.SC_OK						= 200;
AjxPost.SC_ACCEPTED 				= 202;
AjxPost.SC_NO_CONTENT 				= 204;
AjxPost.SC_BAD_REQUEST				= 400;
AjxPost.SC_UNAUTHORIZED				= 401;
AjxPost.SC_REQUEST_TIMEOUT			= 408;
AjxPost.SC_CONFLICT					= 409;
AjxPost.SC_REQUEST_ENTITY_TOO_LARGE = 413;
AjxPost.SC_INTERNAL_SERVER_ERROR	= 500;
AjxPost.SC_BAD_GATEWAY 				= 502;
AjxPost.SC_SERVICE_UNAVAILABLE		= 503;


// Public methods

/**
* Submits the form.
*
* @param callback		function to return to after the HTTP response is received
* @param formId			DOM ID of the form
*/
AjxPost.prototype.execute =
function(callback, form, optionalTimeout) {
	// bug fix #7361
	var tags = form.getElementsByTagName("input");
	var inputs = new Array();
	for (var i = 0; i < tags.length; i++) {
		var tag = tags[i];
		if (tag.type == "file") {
			inputs.push(tag);
			continue;
		}
		// clean up form from previous posts
		if (tag.name && tag.name.match(/^filename\d+$/)) {
			tag.parentNode.removeChild(tag);
			i--; // list is live, so stay on same index
			continue;
		}
	}
	if (window.csrfToken) {
		this._addHiddenField(inputs[0], "csrfToken", window.csrfToken);
	}
    this._addHiddenFileNames(inputs);

	form.target = this._iframeId;
	this._callback = callback;
	var req = new AjxPostRequest(form);
	var failureAction = new AjxTimedAction(this, this._onFailure, [req.id]);
	var timeout = optionalTimeout? optionalTimeout: 5000;
	AjxPost._outStandingRequests[req.id] = req;
	try {
		req.send(failureAction, timeout);
	} catch (ex) {
		if (AjxEnv.isIE) {
			if (ex.number == -2147024891) { // 0x80070005: E_ACCESSDENIED (Couldn't open file)
				throw new AjxException(ZmMsg.uploadErrorAccessDenied, ex.number);
			}
		}
		throw ex;
	}
};

AjxPost.prototype._addHiddenFileNames =
function(inputs){
    var m = 0;
    for (var i = 0; i < inputs.length; i++) {
        var fileInput = inputs[i];
        if(fileInput.files && fileInput.files.length > 1){
            var files = fileInput.files, fileStr=[];
            for(var j=0; j<files.length; j++){
               var f = files[j];
               fileStr.push(f.name || f.fileName);
            }
            this._addHiddenFileName(inputs[i], fileStr.join('\n'), ++m);
        }else{
            this._addHiddenFileName(inputs[i], inputs[i].value, ++m);
        }
    }

};

AjxPost.prototype._addHiddenFileName =
function(inputField, fileName, index){
	this._addHiddenField(inputField, "filename" + (index), fileName);
};
AjxPost.prototype._addHiddenField = function(referenceElement, fieldName, fieldValue){
	var hidden   = document.createElement("input");
	hidden.type  = "hidden";
	hidden.name  = fieldName;
	hidden.value = fieldValue;
	referenceElement.parentNode.insertBefore(hidden, referenceElement);
};


// Private methods

AjxPost.prototype._onFailure =
function (reqId){
	var req = AjxPost._outStandingRequests[reqId];
	req.cancel();
	delete AjxPost._outStandingRequests[reqId];
	if (this._callback) {
		this._callback.run([404]);
		this._callback = null;
	}
};



/**
* Processes the HTTP response from the form post. The server needs to make sure this function is
* called and passed the appropriate args. Something like the following should do the trick:
* <code>
*        out.println("<html><head></head><body onload=\"window.parent._uploadManager.loaded(" + results +");\"></body></html>");
* </code>
*
* @param status		an HTTP status
* @param id			the id for any attachments that were uploaded
*/
AjxPost.prototype.loaded =
function(status, reqId, id) {
	//alert(document.getElementById(this._iframeId).contentWindow.document.documentElement.innerHTML);
	var req = AjxPost._outStandingRequests[reqId];
	if (req && !req.hasBeenCancelled()) {
		req.cancelTimeout();
	}
	delete AjxPost._outStandingRequests[reqId];
	if (this._callback) {
		this._callback.run(status, id);
		this._callback = null;
	}
};

/**
 * @class
 * 
 * @private
 */
AjxPostRequest = function(form) {
	this.id = AjxPost._reqIds++;
	this._cancelled = false;
	this._form = form;
	var inp = form.elements.namedItem("requestId");
	if (!inp) {
		inp = form.ownerDocument.createElement('input');
		inp.type = "hidden";
		inp.name = "requestId";
	}
	inp.value = this.id;
	form.appendChild(inp);
};

AjxPostRequest.prototype.send =
function(failureAction, timeout) {
	this._form.submit();
};

AjxPostRequest.prototype.hasBeenCancelled =
function() {
	return this._cancelled;
};

AjxPostRequest.prototype.cancelTimeout =
function() {
	AjxTimedAction.cancelAction(this._timeoutId);
};

AjxPostRequest.prototype.cancel =
function() {
	this._cancelled = true;
};
}
if (AjxPackage.define("ajax.util.AjxBuffer")) {
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
 * @class
 * Use this class to implement an efficient String Buffer. It is especially useful for assembling HTML.
 * <p>
 * Usage:
 * <ol>
 * <li>For a small amount of text, call it statically as:
 * <pre>
 * AjxBuffer.concat("a", 1, "b", this.getFoo(), ...);
 * </pre>
 * </li>
 * <li>Or create an instance and use that to assemble a big pile of HTML:
 * <pre>
 * var buffer = new AjxBuffer();
 * buffer.append("foo", myObject.someOtherFoo(), ...);
 * ...
 * buffer.append(fooo.yetMoreFoo());
 * return buffer.toString();
 * </pre>
 * </li>
 * </ol>
 * 
 * It is useful (and quicker!) to create a single buffer and then pass that to subroutines
 * that are doing assembly of HTML pieces for you.
 * </p><p>
 * Note: in both modes you can pass as many arguments you like to the
 * methods -- this is quite a bit faster than concatenating the arguments
 * with the + sign (eg: do not do <code>buffer.append("a" + b.foo());</code>).
 *
 * @author Owen Williams
 * 
 * @private
 */
AjxBuffer = function() {
	this.clear();
	if (arguments.length > 0) {
		arguments.join = this.buffer.join;
		this.buffer[this.buffer.length] = arguments.join("");
	}
}
AjxBuffer.prototype.toString = function () {
	return this.buffer.join("");
}
AjxBuffer.prototype.join = function (delim) {
	if (delim == null) delim = "";
	return this.buffer.join(delim);
}
AjxBuffer.prototype.append = function () {
	arguments.join = this.buffer.join;
	this.buffer[this.buffer.length] = arguments.join("");
}
AjxBuffer.prototype.join = function (str) {
	return this.buffer.join(str);
}
AjxBuffer.prototype.set = function(str) {
	this.buffer = [str];
}
AjxBuffer.prototype.clear = function() {
	this.buffer = [];
}
AjxBuffer.concat = function() {
	arguments.join = Array.prototype.join;
	return arguments.join("");
}
AjxBuffer.append = AjxBuffer.concat;
}
if (AjxPackage.define("ajax.xslt.AjxXslt")) {
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
 * XSLT engine <a href="http://www.w3.org/TR/xslt">http://www.w3.org/TR/xslt</a>
 * @class
 * Supports IE and Firefox. Use the following static methods to create instance.
 *
 * <pre>
 * xslt = AjxXslt.createFromUrl(url of the stylesheet)
 * xslt = AjxXslt.createFromString(stylesheet in string)
 * </pre>
 *
 * Then apply the transformation on a document.  Two methods are available depending on the needs.
 *
 * <pre>
 * dom = xslt.transformToDom(doc);
 * xml = xslt.transformToString(doc);
 * </pre>
 * 
 * @private
 */
AjxXslt = function() {
	var doc = AjxXmlDoc.create();
	if (AjxEnv.isIE) {
		var msdoc = null;
		var vers = ["MSXML2.FreeThreadedDOMDocument.5.0", "MSXML2.FreeThreadedDOMDocument.3.0"];
		for (var i = 0; i < vers.length; i++) {
			try {
				msdoc = new ActiveXObject(vers[i]);
				break;
			} catch (ex) {
			}
		}
		if (!msdoc) {
			throw new AjxException("FreeThreadedDOMDocument", AjxException.UNSUPPORTED, "AjxXslt");
		}
		msdoc.async = false;
		doc._doc = msdoc;
	}
	this._doc = doc;
};

AjxXslt.prototype.toString =
function() {
	return "AjxXslt";
};

AjxXslt.createFromUrl =
function(url) {
	var xslt = new AjxXslt();

	xslt.loadUrl(url);

	return xslt;
};

AjxXslt.createFromString =
function(str) {
	var xslt = new AjxXslt();
	
	xslt._doc.loadFromString(str);
	xslt.createProcessor();
	
	return xslt;
};

AjxXslt.prototype.createProcessor =
function() {
	var doc = this._doc.getDoc();
	if (AjxEnv.isIE) {
		var err = doc.parseError;
	    if (err.errorCode != 0) {
			DBG.println(AjxDebug.DBG1, "Parse error (" + err.reason + ") at line " + err.line + ", character " + err.linepos + "\n" + err.srcText);
			throw new AjxException(err.reason, AjxException.INVALID_PARAM, "AjxXslt.createProcessor");
		}

		var proc = null;
		var vers = ["MSXML2.XSLTemplate.5.0", "MSXML2.XSLTemplate.3.0"];
		for (var i = 0; i < vers.length; i++) {
			try {
				proc = new ActiveXObject(vers[i]);
				break;
			} catch (ex) {
			}
		}
		if (!proc) {
			throw new AjxException("XSLTemplate", AjxException.UNSUPPORTED, "AjxXslt.createProcessor");
		}
        this._processor = proc;
		if(this._processor) {
			this._processor.stylesheet = doc;
		}
	} else {
		this._processor = new XSLTProcessor();
		if(this._processor) {
			this._processor.importStylesheet(doc);
		}
	}
};

AjxXslt._finishedLoading =
function() {
	var xslt = this._xslt;  // "this" is the document which xsl is being loaded to.
	xslt.createProcessor();
};

AjxXslt.prototype.loadUrl =
function(url) {
	var doc = this._doc;
	
	if (AjxEnv.isNav) {
		var docImpl = doc.getDoc();
		docImpl._xslt = this;  // for callback
		docImpl.addEventListener("load", AjxXslt._finishedLoading, false);
	}

	doc.loadFromUrl(url);

	if (AjxEnv.isIE || AjxEnv.isChrome || AjxEnv.isSafari) {
		this.createProcessor();
	}
};

AjxXslt.prototype.transformToDom =
function(dom) {
	var ret;
	if (AjxEnv.isIE) {
		ret = this.transformIE(dom);
	} else {
		return this.transformNav(dom);  // already in dom
	}
	var doc = AjxXmlDoc.createFromXml(ret);
	return doc.getDoc();
};

AjxXslt.prototype.transformToString =
function(dom) {
	var ret;
	if (AjxEnv.isIE) {
		return this.transformIE(dom);  // already in str
	} else if (AjxEnv.isNav || AjxEnv.isChrome || AjxEnv.isSafari) {
		ret = this.transformNav(dom);
	} else {
		DBG.println(AjxDebug.DBG1, "No XSL transformation due to browser incompatibility.");
		return dom.documentElement.innerHTML;
	}
	
	if (!ret || !ret.documentElement) {
		throw new AjxException("XSL transformation failed.", AjxException.INVALID_PARAM, "AjxXslt.transformToString");
	}
	
	var elem = ret.documentElement;
	if ((elem instanceof HTMLElement) ||
		(elem instanceof HTMLHtmlElement)) {
		// good.
		return elem.innerHTML;
	} else if (elem instanceof Element) {
		// ok.
		return AjxXmlDoc.replaceInvalidChars(elem.xml);
	}
	DBG.println(AjxDebug.DBG1, "Transformation resulted in non-element.");
	return dom.documentElement.innerHTML;
};

/**
* IE returns html text.
*/
AjxXslt.prototype.transformIE =
function(dom) {
	try {
		var xsltProc = this._processor.createProcessor();
        xsltProc.input = dom;
        xsltProc.transform();
		return xsltProc.output;
	} catch (exception) {
		DBG.println(AjxDebug.DBG1, "Exception in XSL transformation: "+exception.description);
		throw new AjxException(exception.description, AjxException.INVALID_PARAM, "AjxXslt.transformIE");
	}
};

/**
* Returns either HTMLDocument or XMLDocument, depending on the transformation.
*/
AjxXslt.prototype.transformNav =
function(dom) {
	if(!this._processor) {
		return "";
	}
	return this._processor.transformToDocument(dom);
};

/**
* Returns DocumentFragment
*/
AjxXslt.prototype.transformNav2 =
function(dom) {
	this._fragment = document.implementation.createDocument("", "", null);
	if(!this._processor) {
		return "";
	}
	return this._processor.transformToFragment(dom, this._fragment);
};
}
if (AjxPackage.define("ajax.util.AjxSHA1")) {
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
/*
 * Based on code by Paul Johnston:
 *
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var AjxSHA1 = function() {

	/*
	 * Configurable variables. You may need to tweak these to be compatible with
	 * the server-side, but the defaults work in most cases.
	 */
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
	var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	/*
	 * These are the functions you'll usually want to call
	 * They take string arguments and return either hex or base-64 encoded strings
	 */
	function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));};
	function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));};
	function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));};
	function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));};
	function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));};
	function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));};

	/*
	 * Perform a simple self-test to see if the VM is working
	 */
	function sha1_vm_test()
	{
		return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
	};

	/*
	 * Calculate the SHA-1 of an array of big-endian words, and a bit length
	 */
	function core_sha1(x, len)
	{
		/* append padding */
		x[len >> 5] |= 0x80 << (24 - len % 32);
		x[((len + 64 >> 9) << 4) + 15] = len;

		var w = Array(80);
		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;
		var e = -1009589776;

		for(var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			var olde = e;

			for(var j = 0; j < 80; j++) {
				if(j < 16) w[j] = x[i + j];
				else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
				var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
						 safe_add(safe_add(e, w[j]), sha1_kt(j)));
				e = d;
				d = c;
				c = rol(b, 30);
				b = a;
				a = t;
			}

			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
			e = safe_add(e, olde);
		}
		return Array(a, b, c, d, e);

	};

	/*
	 * Perform the appropriate triplet combination function for the current
	 * iteration
	 */
	function sha1_ft(t, b, c, d)
	{
		if(t < 20) return (b & c) | ((~b) & d);
		if(t < 40) return b ^ c ^ d;
		if(t < 60) return (b & c) | (b & d) | (c & d);
		return b ^ c ^ d;
	};

	/*
	 * Determine the appropriate additive constant for the current iteration
	 */
	function sha1_kt(t)
	{
		return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
			(t < 60) ? -1894007588 : -899497514;
	};

	/*
	 * Calculate the HMAC-SHA1 of a key and some data
	 */
	function core_hmac_sha1(key, data)
	{
		var bkey = str2binb(key);
		if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

		var ipad = Array(16), opad = Array(16);
		for(var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}

		var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
		return core_sha1(opad.concat(hash), 512 + 160);
	};

	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	function safe_add(x, y)
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	};

	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	function rol(num, cnt)
	{
		return (num << cnt) | (num >>> (32 - cnt));
	};

	/*
	 * Convert an 8-bit or 16-bit string to an array of big-endian words
	 * In 8-bit function, characters >255 have their hi-byte silently ignored.
	 */
	function str2binb(str)
	{
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz)
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
		return bin;
	};

	/*
	 * Convert an array of big-endian words to a string
	 */
	function binb2str(bin)
	{
		var str = "";
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < bin.length * 32; i += chrsz)
			str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
		return str;
	};

	/*
	 * Convert an array of big-endian words to a hex string.
	 */
	function binb2hex(binarray)
	{
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
				hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	};

	/*
	 * Convert an array of big-endian words to a base-64 string
	 */
	function binb2b64(binarray)
	{
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i += 3) {
			var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
				| (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
				|  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
			for(var j = 0; j < 4; j++) {
				if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
				else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
			}
		}
		return str;
	};

	// export functions
	this.hex_sha1 = hex_sha1;
	this.b64_sha1 = b64_sha1;
	this.str_sha1 = str_sha1;
	this.hex_hmac_sha1 = hex_hmac_sha1;
	this.b64_hmac_sha1 = b64_hmac_sha1;
	this.str_hmac_sha1 = str_hmac_sha1;

	this.sha1_vm_test = sha1_vm_test;

};

AjxSHA1 = new AjxSHA1();
}
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
if (AjxPackage.define("ajax.util.AjxClipboard")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Clipboard access. Current implementation is built on clipboard.js
 *
 * @class
 * @constructor
 */
AjxClipboard = function() {
	AjxDispatcher.require("Clipboard");
};

/**
 * Returns true if clipboard access is supported.
 * @returns {Boolean}   true if clipboard access is supported
 */
AjxClipboard.isSupported = function() {
	// clipboard.js works on all browsers except IE8 and Safari
	return !AjxEnv.isIE8 && !(AjxEnv.isSafari && !AjxEnv.isChrome);
};

/**
 * Initialize clipboard action
 *
 * @param {DwtControl}          op          widget that initiates copy (eg button or menu item)
 * @param {Object}              listeners   hash of events
 */
AjxClipboard.prototype.init = function(op, listeners) {
	if (listeners.onComplete) {
		this._completionListener = listeners.onComplete.bind(null, this);
	}
	if (op && listeners.onMouseDown) {
		op.addSelectionListener(listeners.onMouseDown.bind(null, this));
	}
};

AjxClipboard.prototype.setText = function(text) {
	if (window.clipboard) {
		clipboard.copy(text).then(this._completionListener, this._onError);
	}
};

AjxClipboard.prototype._onError = function(error) {
	appCtxt.setStatusMsg(error && error.message, ZmStatusView.LEVEL_WARNING);
};
}
if (AjxPackage.define("ajax.dwt.events.DwtDateRangeEvent")) {
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
 * @private
 */
DwtDateRangeEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}

DwtDateRangeEvent.prototype = new DwtEvent;
DwtDateRangeEvent.prototype.constructor = DwtDateRangeEvent;

DwtDateRangeEvent.prototype.toString = 
function() {
	return "DwtDateRangeEvent";
}

DwtDateRangeEvent.prototype.reset =
function() {
	this.start = null;
	this.end = null;
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
if (AjxPackage.define("ajax.dwt.widgets.DwtColorPicker")) {
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
 * Creates a color picker displaying "Web safe" colors.
 * @constructor
 * @class
 * Instances of this class may be
 * used with {@link DwtMenu} to create a {@link DwtColorPicker} menu. Clicking on a color cell generates a
 * DwtSelectionEvent the detail attribute of which contains the color string associated
 * the cell on which the user clicked
 *
 *
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite} params.parent		the parent widget
 * @param {string}       params.className	a CSS class
 * @param {constant}     params.posStyle	the positioning style
 * @param {boolean}      params.hideNoFill  True to hide the no-fill/use-default option
 * @param {string}       params.noFillLabel			the no-fill label
 * @param {boolean}      params.allowColorInput		if <code>true</code>, allow a text field to allow user to input their customized RGB value
 * @param {string}       params.defaultColor Default color.
 * 
 * @extends		DwtControl
 */
DwtColorPicker = function(params) {
	if (arguments.length == 0) return;
    params = Dwt.getParams(arguments, DwtColorPicker.PARAMS);

	params.className = params.className || "DwtColorPicker";
	DwtComposite.call(this, params);

    this._hideNoFill = params.hideNoFill;
	this._noFillLabel = params.noFillLabel;
    this._allowColorInput = params.allowColorInput;
    this._defaultColor = params.defaultColor || "#000000";
    this._createHtml();
};

DwtColorPicker.prototype = new DwtComposite;
DwtColorPicker.prototype.constructor = DwtColorPicker;

DwtColorPicker.prototype.toString = function() {
	return "DwtColorPicker";
};

DwtColorPicker.PARAMS = ["parent", "className", "posStyle", "noFillLabel", "allowColorInput", "defaultColor"];

//
// Constants
//

// RE to parse out components out of a "rgb(r, g, b);" string
DwtColorPicker._RGB_RE = /^rgb\(([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3})\)$/;
DwtColorPicker._HEX_RE = /^\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

//
// Data
//

DwtColorPicker.prototype.TEMPLATE = "dwt.Widgets#DwtColorPicker";

//
// Public methods
//

/**
 * Adds a listener to be notified when the button is pressed.
 *
 * @param {AjxListener}	listener	a listener
 */
DwtColorPicker.prototype.addSelectionListener = 
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 *
 * @param {AjxListener}	listener	a listener
 */
DwtColorPicker.prototype.removeSelectionListener = 
function(listener) { 
	this.removeListener(DwtEvent.SELECTION, listener);
};

DwtColorPicker.prototype.dispose = 
function () {
	if (this._disposed) { return; }
	DwtControl.prototype.dispose.call(this);
};

DwtColorPicker.prototype._createHtml = function(templateId) {
    this._createHtmlFromTemplate(templateId||this.TEMPLATE, {id:this.getHtmlElement().id});
};

DwtColorPicker.prototype._createHtmlFromTemplate = function(templateId, data) {
    data.allowColorInput = this._allowColorInput;
    data.hideNoFill = this._hideNoFill;
    data.noFillLabel = this._noFillLabel;
    DwtComposite.prototype._createHtmlFromTemplate.apply(this, arguments);

    // create controls
    if (data.allowColorInput) {
        var inputEl = document.getElementById(data.id+"_input");
	var inputParams = {
		parent: this,
		validationStyle: DwtInputField.CONTINUAL_VALIDATION, //update the preview for each key up 
		errorIconStyle: DwtInputField.ERROR_ICON_RIGHT, 
		validator: DwtColorPicker.__isValidInputValue
	};
        var input = this._colorInput = new DwtInputField(inputParams);
        input.replaceElement(inputEl);
	// Add  callback for update the preview when the input value is validated.
	var updateCallback = new AjxCallback(this, this._updatePreview);
	input.setValidationCallback(updateCallback);
	
	var error = this._error = new DwtLabel({parent:this});
	var errorEl = document.getElementById(data.id+"_error");
        error.replaceElement(errorEl);
        error.setVisible(false);
        
	this._preview = document.getElementById(data.id+"_preview");
        
	var buttonEl = document.getElementById(data.id+"_button");
        var button = new DwtButton({parent:this});
        button.setText(AjxMsg.setColor);
        button.replaceElement(buttonEl);
        button.addSelectionListener(new AjxListener(this, this._handleSetColor));
    }

    var buttonEl = document.getElementById(data.id+"_default");
    if (buttonEl) {
        if (!DwtColorPicker.Button) {
            DwtColorPicker.__defineClasses();
        }
        var button = this._defaultColorButton = new DwtColorPicker.Button({parent:this});
        button.setText(data.noFillLabel || AjxMsg.colorsUseDefault);
        button.replaceElement(buttonEl);
        button.addSelectionListener(new AjxListener(this, this._handleColorSelect, [0]));
    }

    // set color handlers
    var colorsEl = document.getElementById(data.id+"_colors");
    var mouseOver = AjxEnv.isIE ? DwtEvent.ONMOUSEENTER : DwtEvent.ONMOUSEOVER;
    var mouseOut  = AjxEnv.isIE ? DwtEvent.ONMOUSELEAVE : DwtEvent.ONMOUSEOUT;

    Dwt.setHandler(colorsEl, DwtEvent.ONMOUSEDOWN, AjxCallback.simpleClosure(this._handleMouseDown, this));
    Dwt.setHandler(colorsEl, DwtEvent.ONMOUSEUP, AjxCallback.simpleClosure(this._handleMouseUp, this));
    Dwt.setHandler(colorsEl, mouseOver, AjxCallback.simpleClosure(this._handleMouseOver, this));
    Dwt.setHandler(colorsEl, mouseOut, AjxCallback.simpleClosure(this._handleMouseOut, this));
};

DwtColorPicker.prototype._handleMouseOver = function(htmlEvent) {
    var event = DwtUiEvent.getEvent(htmlEvent);
    var target = DwtUiEvent.getTarget(event);
    if (!Dwt.hasClass(target, "Color")) return;

    this._handleMouseOut(htmlEvent);
    Dwt.addClass(target, DwtControl.HOVER);
    this._mouseOverEl = target;
};

DwtColorPicker.prototype._handleMouseOut = function(htmlEvent) {
    if (this._mouseOverEl) {
        Dwt.delClass(this._mouseOverEl, DwtControl.HOVER);
    }
    this._mouseOverEl = null;
};

DwtColorPicker.prototype._handleMouseDown = function(htmlEvent) {
    var event = DwtUiEvent.getEvent(htmlEvent);
    var target = DwtUiEvent.getTarget(event);
    this._mouseDownEl = Dwt.hasClass(target, "Color") ? target : null;
};
DwtColorPicker.prototype._handleMouseUp = function(htmlEvent) {
    var event = DwtUiEvent.getEvent(htmlEvent);
    var target = DwtUiEvent.getTarget(event);
    if (this._mouseDownEl != target) return;

    var cssColor = DwtCssStyle.getProperty(target, "background-color");
    this._handleColorSelect(DwtColorPicker.__color2hex(cssColor));
};

DwtColorPicker.prototype._handleSetColor = function(evt) {
    var color = this._colorInput.getValue();
    if (color) {
	color = DwtColorPicker.__color2hex(color);
	if(!color) 
		return; 
    	this._handleColorSelect(color);
    }
};

DwtColorPicker.prototype._handleColorSelect = function(color) {
    this._inputColor = color;

    // If our parent is a menu then we need to have it close
    if (this.parent instanceof DwtMenu) {
        DwtMenu.closeActiveMenu();
    }

    // Call Listeners on mouseEv.target.id
    if (this.isListenerRegistered(DwtEvent.SELECTION)) {
        var selEvent = DwtShell.selectionEvent;
//        DwtUiEvent.copy(selEvent, htmlEvent);
        selEvent.item = this;
        selEvent.detail = this._inputColor;
        this.notifyListeners(DwtEvent.SELECTION, selEvent);
    }
};

/**
 * Gets the input color.
 * 
 * @return	{string}	the color (in hex) from the input color field
 */
DwtColorPicker.prototype.getInputColor = function () {
    return this._inputColor;
};

DwtColorPicker.prototype.setDefaultColor = function (color) {
    if(this._defaultColorButton) {
        this._defaultColorButton.setDefaultColor(color);
    }
};

DwtColorPicker.__color2hex = function(s) {
	//in IE we can't get the calculated value so for white/black we get white/black (of course it could be set the the hex value in the markup but this is more bulletproof to make sure here)
	if (s == "white") {
		return "#FFFFFF";
	}
	if (s == "black") {
		return "#000000";
	}

    var m = s && s.match(DwtColorPicker._RGB_RE);
    if (m) {
	// each component should be in range of (0 - 255)
	for( var i = 1; i <= 3; i++ ) {
		if(parseInt(m[i]) > 255)
			return "";
	}
        return AjxColor.color(m[1], m[2], m[3]);
    }
    m = s && s.match(DwtColorPicker._HEX_RE);
    if (m) {
        return s;
    }
    return "";
};

DwtColorPicker.__isValidInputValue = function(s) {
   // null is valid for we consider the condition
   // the user delete all the word it has been input
   if (!s)
	return s;
   var r = DwtColorPicker.__color2hex(s);
   if (!r) { 
	throw AjxMsg.colorFormatError;	
   }
   return s;	
};

DwtColorPicker.prototype._updatePreview = function(inputelement, isValid, value){
   if (isValid) {
	value = DwtColorPicker.__color2hex(value);
	Dwt.setVisible(this._preview, true);
	this._preview.style.backgroundColor = value;
	this._error.setVisible(false);
   }
   else {
	Dwt.setVisible(this._preview, false);
	this._error.setVisible(true);
	this._error.setText(AjxMsg.colorFormatError);
   }
};
//
// Classes
//

DwtColorPicker.__defineClasses = function() {
    // HACK: This defines the custom button after the color picker has
    // HACK: been initialized and instantiated so that we dont' get
    // HACK: weird dependency issues. (I noticed this in particular
    // HACK: in the admin client.)
    DwtColorPicker.Button = function(params) {
        params.className = params.className || "DwtColorPickerButton";
        DwtButton.call(this, params);
        this._colorDiv = document.getElementById(this.getHtmlElement().id+"_color");
    };
    DwtColorPicker.Button.prototype = new DwtButton;
    DwtColorPicker.Button.prototype.constructor = DwtColorPicker.Button;

    DwtColorPicker.Button.prototype.setDefaultColor = function(color) {
        this._colorDiv.style.backgroundColor = (color === null) ? "" : color;
    };

    DwtColorPicker.Button.prototype.toString = function() {
        return "DwtColorPickerButton";
    };

    DwtColorPicker.Button.prototype.TEMPLATE = "dwt.Widgets#DwtColorPickerButton";
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtCheckbox")) {
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
 * Creates a checkbox.
 * @constructor
 * @class
 * This class represents a checkbox.
 * 
 * @param {hash}	params	a hash of parameters
 * @param {DwtComposite}	params.parent	the parent widget
 * @param {DwtCheckbox.TEXT_LEFT|DwtCheckbox.TEXT_RIGHT}       [params.style=DwtCheckbox.TEXT_RIGHT] 	the text style
 * @param {string}       params.name		the input control name (required for IE)
 * @param {string}       params.value     the input control value
 * @param {boolean}       params.checked	the input control checked status (required for IE)
 * @param {string}       params.className	the CSS class
 * @param {constant}       params.posStyle	the positioning style (see {@link Dwt})
 * @param {string}       params.id		an explicit ID to use for the control's HTML element
 * @param {number}       params.index 	the index at which to add this control among parent's children
 * 
 *  @extends		DwtControl
 */
DwtCheckbox = function(params) {
	if (arguments.length == 0) { return; }

	params = Dwt.getParams(arguments, DwtCheckbox.PARAMS);
	params.className = params.className || "DwtCheckbox";

	DwtControl.call(this, params);

	this._textPosition = DwtCheckbox.DEFAULT_POSITION;
	this._initName = params.name;
    this._initValue = params.value;
	this._createHtml();

	this.setSelected(params.checked);
};

DwtCheckbox.prototype = new DwtControl;
DwtCheckbox.prototype.constructor = DwtCheckbox;

DwtCheckbox.prototype.isDwtCheckbox = true;
DwtCheckbox.prototype.isInputControl = true;
DwtCheckbox.prototype.toString = function() { return "DwtCheckbox"; };

//
// Constants
//
DwtCheckbox.PARAMS = [
	"parent",
	"style",
	"name",
	"checked",
	"className",
	"posStyle",
	"id",
	"index",
    "value"
];
/**
 * Defines the "left" text style position.
 */
DwtCheckbox.TEXT_LEFT			= "left";
/**
 * Defines the "right" text style position.
 */
DwtCheckbox.TEXT_RIGHT			= "right";
/**
 * Defines the default text style position.
 */
DwtCheckbox.DEFAULT_POSITION	= DwtCheckbox.TEXT_RIGHT;

//
// Data
//
DwtCheckbox.prototype.TEMPLATE = "dwt.Widgets#DwtCheckbox";

DwtCheckbox.prototype.INPUT_TYPE = 'checkbox';

//
// Public methods
//
DwtCheckbox.prototype.getInputElement =
function() {
	return this._inputEl;
};

DwtCheckbox.prototype._focus =
function() {
	Dwt.addClass(this.getHtmlElement(), DwtControl.FOCUSED);
};

DwtCheckbox.prototype._blur =
function() {
	Dwt.delClass(this.getHtmlElement(), DwtControl.FOCUSED);
};

// listeners

/**
 * Adds a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCheckbox.prototype.addSelectionListener =
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCheckbox.prototype.removeSelectionListener =
function(listener) {
	this.removeListener(DwtEvent.SELECTION, listener);
};

// properties

/**
 * Sets the enabled state.
 * 
 * @param	{boolean}	enabled		if <code>true</code>, the checkbox is enabled
 */
DwtCheckbox.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtControl.prototype.setEnabled.call(this, enabled);
		this._inputEl.disabled = !enabled;
		var className = enabled ? "Text" : "DisabledText";
		if (this._textElLeft) this._textElLeft.className = className;
		if (this._textElRight) this._textElRight.className = className;
	}
};

/**
 * Sets the selected state.
 * 
 * @param	{boolean}	selected		if <code>true</code>, the checkbox is selected
 */
DwtCheckbox.prototype.setSelected =
function(selected) {
	if (this._inputEl && this._inputEl.checked != selected) {
		this._inputEl.checked = selected;
	}
};

/**
 * Checks if the checkbox is selected state.
 * 
 * @return	{boolean}	<code>true</code> if the checkbox is selected
 */
DwtCheckbox.prototype.isSelected =
function() {
	return this._inputEl && this._inputEl.checked;
};

/**
 * Sets the checkbox text.
 * 
 * @param		{string}	text		the text
 */
DwtCheckbox.prototype.setText =
function(text) {
	if (this._textEl && this._text != text) {
		this._text = text;
		this._textEl.innerHTML = text || "";
	}
};

/**
 * Gets the checkbox text.
 * 
 * @return	{string}	the text
 */
DwtCheckbox.prototype.getText =
function() {
	return this._text;
};

/**
 * Sets the text position.
 * 
 * @param	{DwtCheckbox.TEXT_LEFT|DwtCheckbox.TEXT_RIGHT}		position	the position
 */
DwtCheckbox.prototype.setTextPosition =
function(position) {
	this._textEl = position == DwtCheckbox.TEXT_LEFT ? this._textElLeft : this._textElRight;
	if (this._textPosition != position) {
		this._textPosition = position;
		if (this._textElLeft) this._textElLeft.innerHTML = "";
		if (this._textElRight) this._textElRight.innerHTML = "";
		this.setText(this._text);
	}
};

/**
 * Gets the text position.
 * 
 * @return	{DwtCheckbox.TEXT_LEFT|DwtCheckbox.TEXT_RIGHT}		the position
 */
DwtCheckbox.prototype.getTextPosition =
function() {
	return this._textPosition;
};

/**
 * Sets the value.
 * 
 * @param	{string}		value		the value
 */
DwtCheckbox.prototype.setValue =
function(value) {
    var object = this._inputEl || this;
	if (object.value !== value) {
        object.value = value;
    }
};

/**
 * Gets the value.
 * 
 * @return		{string}		the value
 */
DwtCheckbox.prototype.getValue =
function() {
    var object = this._inputEl || this;
	return object.value != null ? object.value : this.getText();
};

/**
 * Gets the input element.
 * 
 * @return		{Element}		the element
 */
DwtCheckbox.prototype.getInputElement =
function() {
	return this._inputEl;
};

//
// DwtControl methods
//

DwtCheckbox.prototype.setToolTipContent = function(content) {
    if (content && !this.__mouseEventsSet) {
        // NOTE: We need mouse events in order to initiate tooltips on hover.
        // TODO: This should be done transparently in DwtControl for all
        // TODO: controls with tooltips.
        this.__mouseEventsSet = true;
        this._setMouseEvents();
    }
    DwtControl.prototype.setToolTipContent.apply(this, arguments);
};

//
// Protected methods
//

/**
 * The input field inherits the id for accessibility purposes.
 * 
 * @private
 */
DwtCheckbox.prototype._replaceElementHook =
function(oel, nel, inheritClass, inheritStyle) {
	nel = this.getInputElement();
	DwtControl.prototype._replaceElementHook.call(this, oel, nel, inheritClass, inheritStyle);
	if (oel.id) {
		this.setHtmlElementId(oel.id+"_control");
		nel.id = oel.id;
		if (this._textEl) {
			this._textEl.setAttribute(AjxEnv.isIE ? "htmlFor" : "for", oel.id);
		}
	}
};

//
// Private methods
//

DwtCheckbox.prototype._createHtml =
function(templateId) {
	var data = { id: this._htmlElId };
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

DwtCheckbox.prototype._createHtmlFromTemplate =
function(templateId, data) {
	// NOTE: If  you don't set the name and checked status when
	//       creating checkboxes and radio buttons on IE, they will
	//       not take the first programmatic value. So we pass in
	//       the init values from the constructor.
	data.name = this._initName || this._htmlElId;
    data.value = this._initValue;
	data.type = this.INPUT_TYPE;
	DwtControl.prototype._createHtmlFromTemplate.call(this, templateId, data);
	this._inputEl = document.getElementById(data.id+"_input");
	if (this._inputEl) {
		var keyboardMgr = DwtShell.getShell(window).getKeyboardMgr();
		var handleFocus = AjxCallback.simpleClosure(keyboardMgr.grabFocus, keyboardMgr, this.getInputElement());
		Dwt.setHandler(this._inputEl, DwtEvent.ONFOCUS, handleFocus);
		Dwt.setHandler(this._inputEl, DwtEvent.ONCLICK, DwtCheckbox.__handleClick);
		this.setFocusElement();
	}
	this._textElLeft = document.getElementById(data.id+"_text_left");
	this._textElRight = document.getElementById(data.id+"_text_right");
	this.setTextPosition(this._textPosition);
};

//
// Private functions
//

DwtCheckbox.__handleClick =
function(evt) {
	var event = DwtUiEvent.getEvent(evt);
	var target = DwtUiEvent.getTarget(event);

	var selEv = DwtShell.selectionEvent;
	DwtUiEvent.copy(selEv, event);
	selEv.item = this;
	selEv.detail = target.checked;

	var checkbox = DwtControl.findControl(target);
	checkbox.setSelected(target.checked);
	checkbox.focus();
	checkbox.notifyListeners(DwtEvent.SELECTION, selEv);
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtRadioButton")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a radio button.
 * @constructor
 * @class
 * This class implements a radio button.
 * 
 * @param {hash}	params	a hash of parameters
 * @param  {DwtComposite}     params.parent	the parent widget
 * @param  {constant}     params.style 	the text style. May be one of: {@link DwtCheckbox.TEXT_LEFT} or
 * 									{@link DwtCheckbox.TEXT_RIGHT} arithimatically or'd (|) with one of:
 * 									{@link DwtCheckbox.ALIGN_LEFT}, {@link DwtCheckbox.ALIGN_CENTER}, or
 * 									{@link DwtCheckbox.ALIGN_LEFT}.
 * 									The first determines were in the checkbox the text will appear
 * 									(if set), the second determine how the content of the text will be
 * 									aligned. The default value for this parameter is: 
 * 									{@link DwtCheckbox.TEXT_LEFT} | {@link DwtCheckbox.ALIGN_CENTER}
 * @param  {string}     params.name		the input control name (required for IE)
 * @param  {string}     params.value     the input control value.
 * @param  {boolean}     params.checked	the input control checked status (required for IE)
 * @param  {string}     params.className	the CSS class
 * @param  {constant}     params.posStyle	the positioning style (see {@link DwtControl})
 * @param  {string}     params.id		an explicit ID to use for the control's HTML element
 * @param  {number}     params.index 	the index at which to add this control among parent's children
 * 
 * @extends	DwtCheckbox
 */
DwtRadioButton = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtRadioButton.PARAMS);
	params.className = params.className || "DwtRadioButton";
	DwtCheckbox.call(this, params);
}

DwtRadioButton.PARAMS = DwtCheckbox.PARAMS;

DwtRadioButton.prototype = new DwtCheckbox;
DwtRadioButton.prototype.constructor = DwtRadioButton;

DwtRadioButton.prototype.isDwtRadioButton = true;
DwtRadioButton.prototype.isInputControl = true;
DwtRadioButton.prototype.toString = function() { return "DwtRadioButton"; };

//
// Data
//

DwtRadioButton.prototype.INPUT_TYPE = 'radio';
}
if (AjxPackage.define("ajax.dwt.widgets.DwtPasswordField")) {
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
 * Creates a password field.
 * @constructor
 * @class
 * 
 * @param	{hash}		params		a hash of parameters
 * @param {DwtComposite}      params.parent			the parent widget
 * @param {string}      params.initialValue		the initial value of the field
 * @param {number}      params.size				size of the input field (in characters)
 * @param {number}      params.rows				the number of rows (more than 1 means textarea)
 * @param {boolean}      params.forceMultiRow		if <code>true</code>, forces use of textarea even if rows == 1
 * @param {number}      params.maxLen			the maximum length (in characters) of the input
 * @param {constant}      params.errorIconStyle		the error icon style
 * @param {constant}      params.validationStyle	the validation type
 * @param  {function}     params.validator			the custom validation function
 * @param {Object}      params.validatorCtxtObj		the object context for validation function
 * @param {string}      params.className			the CSS class
 * @param {constant}      params.posStyle			the positioning style (see {@link DwtControl})
 * @param {boolean}      params.required          if <code>true</code>, mark as required.
 * @param {string}      params.hint				a hint to display in the input field when the value is empty.
 * @param {string}      params.id				an explicit ID to use for the control's DIV element
 * @param {string}      params.inputId			an explicit ID to use for the control's INPUT element
 * 
 * @extends		DwtInputField
 */
DwtPasswordField = function(params) {
	if (arguments.length == 0) return;

	params = params || { parent: DwtShell.getShell(window) };
	params.type = DwtInputField.PASSWORD;
	DwtInputField.call(this, params);

	this._tabGroup = new DwtTabGroup(this._htmlElId);

	// TODO: templatize DwtInputField -- then we don't need to explicitly call _createHtml
	this._createHtml();
};
DwtPasswordField.prototype = new DwtInputField;
DwtPasswordField.prototype.constructor = DwtPasswordField;

//
// Data
//

DwtPasswordField.prototype.TEMPLATE = "dwt.Widgets#DwtPasswordField";

//
// Public methods
//

DwtPasswordField.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * Shows the password.
 * 
 * @param	{boolean}	show		if <code>true</code>, show the password
 */
DwtPasswordField.prototype.setShowPassword = function(show) {
	this._showCheckbox.setSelected(show);
	this.setInputType(show ? DwtInputField.STRING : DwtInputField.PASSWORD);
};

//
// Protected methods
//

DwtPasswordField.prototype._createHtml = function(templateId) {
	var data = { id: this._htmlElId };
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

DwtPasswordField.prototype._createHtmlFromTemplate =
function(templateId, data) {
	this._tabGroup.removeAllMembers();

	// save old contents
	var fragment = document.createDocumentFragment();
	var child = this.getHtmlElement().firstChild;
	while (child) {
		var sibling = child.nextSibling;
		fragment.appendChild(child);
		child = sibling;
	};

	// create HTML and append content
	DwtInputField.prototype._createHtmlFromTemplate.apply(this, arguments);
	var inputEl = document.getElementById(data.id+"_input");
	inputEl.appendChild(fragment);
	this._tabGroup.addMember(this.getInputElement());

	var showCheckboxEl = document.getElementById(data.id+"_show_password");
	if (showCheckboxEl) {
		this._showCheckbox = new DwtCheckbox({parent:this});
		this._showCheckbox.setText(AjxMsg.showPassword);
		this._showCheckbox.addSelectionListener(new AjxListener(this, this._handleShowCheckbox));
		this._showCheckbox.replaceElement(showCheckboxEl);
		this._tabGroup.addMember(this._showCheckbox);
	}
};

DwtPasswordField.prototype._handleShowCheckbox = function(event) {
	this.setShowPassword(event.detail);
};

/**
* Overrides DwtInputField getValue to not do the leading/trailing spaces trimming.
*
* @return {string} the value
*/
DwtPasswordField.prototype.getValue =
function() {
	return this._inputField.value;
};

}
if (AjxPackage.define("ajax.dwt.widgets.DwtCalendar")) {
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
 * Creates a calendar widget
 * @constructor
 * @class
 * This class provides a calendar view.
 *
 * @author Ross Dargahi
 * @author Roland Schemers
 *
 * @param {hash}		params			a hash of parameters
 * @param {DwtComposite}      params.parent			the parent widget
 * @param {string}      params.className			the CSS class
 * @param {constant}      params.posStyle			the positioning style (see {@link Dwt})
 * @param {constant}     [params.firstDayOfWeek=DwtCalendar.SUN]		the first day of the week
 * @param {boolean}	[params.forceRollOver=true] 	if <code>true</code>, then clicking on (or setting) the widget to a 
 *												date that is not part of the current month (i.e. one of 
 *												the grey prev or next month days) will result in the 
 *												widget rolling 	the date to that month.
 * @param {array}      params.workingDays		a list of days that are work days. This array assumes that
 * 												index 0 is Sunday. Defaults to Mon-Fri being work days.
 * @param {boolean}      params.hidePrevNextMo 	a flag indicating whether widget should hide days of the 
 *												previous/next month
 * @param {boolean}      params.readOnly 		a flag indicating that this widget is read-only (should not 
 *												process events such as mouse clicks)
 * @param {boolean}      params.showWeekNumber	a flag indicating whether widget should show week number
 *        
 * @extends		DwtComposite
 */
DwtCalendar = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtCalendar.PARAMS);
	params.className = params.className || "DwtCalendar";
	DwtComposite.call(this, params);

	this._skipNotifyOnPage = false;
	this._hidePrevNextMo = params.hidePrevNextMo;
	this._readOnly = params.readOnly;
	this._showWeekNumber = params.showWeekNumber;
	this._uuid = Dwt.getNextId();
	var cn = this._origDayClassName = params.className + "Day";
	this._todayClassName = " " + params.className + "Day-today";
	this._selectedDayClassName = " " + cn + "-" + DwtCssStyle.SELECTED;
	this._hoveredDayClassName = " " + cn + "-" + DwtCssStyle.HOVER;
	this._activeDayClassName = " " + cn + "-" + DwtCssStyle.ACTIVE;
	this._hiliteClassName = " " + cn + "-hilited";
	this._greyClassName = " " + cn + "-grey";
	
	if (!this._readOnly) {
		this._installListeners();
	}

	this._selectionMode = DwtCalendar.DAY;
	
	this._init();

	this._weekDays = new Array(7);
	this._workingDays = params.workingDays || DwtCalendar._DEF_WORKING_DAYS;
    this._useISO8601WeekNo = params.useISO8601WeekNo;
	this.setFirstDayOfWeek(params.firstDayOfWeek || DwtCalendar.SUN);
	
	this._forceRollOver = (params.forceRollOver !== false);
};

DwtCalendar.PARAMS = ["parent", "className", "posStyle", "firstDayOfWeek", "forceRollOver",
					  "workingDaysArray", "hidePrevNextMo", "readOnly"];

DwtCalendar.prototype = new DwtComposite;
DwtCalendar.prototype.constructor = DwtCalendar;

/**
 * Sunday.
 */
DwtCalendar.SUN = 0;
/**
 * Monday.
 */
DwtCalendar.MON = 1;
/**
 * Tuesday.
 */
DwtCalendar.TUE = 2;
/**
 * Wednesday.
 */
DwtCalendar.WED = 3;
/**
 * Thursday.
 */
DwtCalendar.THU = 4;
/**
 * Friday.
 */
DwtCalendar.FRI = 5;
/**
 * Saturday.
 */
DwtCalendar.SAT = 6;

// Selection modes
/**
 * Defines the "day" selection mode.
 */
DwtCalendar.DAY = 1;
/**
 * Defines the "week" selection mode.
 */
DwtCalendar.WEEK = 2;
/**
 * Defines the "work week" selection mode.
 */
DwtCalendar.WORK_WEEK = 3;
/**
 * Defines the "month" selection mode.
 */
DwtCalendar.MONTH = 4;

DwtCalendar.RANGE_CHANGE = "DwtCalendar.RANGE_CHANGE";

DwtCalendar._FULL_WEEK = [1, 1, 1, 1, 1, 1, 1];
DwtCalendar._DEF_WORKING_DAYS = [0, 1, 1, 1, 1, 1, 0];
DwtCalendar._DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

DwtCalendar._NO_MONTH = -2;
DwtCalendar._PREV_MONTH = -1;
DwtCalendar._THIS_MONTH = 0;
DwtCalendar._NEXT_MONTH = 1;

DwtCalendar._NORMAL = 1;
DwtCalendar._HOVERED = 2;
DwtCalendar._ACTIVE = 3;
DwtCalendar._SELECTED = 4;
DwtCalendar._DESELECTED = 5;

DwtCalendar.DATE_SELECTED 		= 1;
DwtCalendar.DATE_DESELECTED 	= 2;
DwtCalendar.DATE_DBL_CLICKED 	= 3;

DwtCalendar._LAST_DAY_CELL_IDX = 41;

DwtCalendar._BUTTON_CLASS = "DwtCalendarButton";
DwtCalendar._BUTTON_HOVERED_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.HOVER;
DwtCalendar._BUTTON_ACTIVE_CLASS = DwtCalendar._BUTTON_CLASS + "-" + DwtCssStyle.ACTIVE;

DwtCalendar._TITLE_CLASS = "DwtCalendarTitle";
DwtCalendar._TITLE_HOVERED_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.HOVER;
DwtCalendar._TITLE_ACTIVE_CLASS = DwtCalendar._TITLE_CLASS + "-" + DwtCssStyle.ACTIVE;

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtCalendar.prototype.toString = 
function() {
	return "DwtCalendar";
};

/**
 * Adds a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.addSelectionListener = 
function(listener) {
	this.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.removeSelectionListener = 
function(listener) { 
	this.removeListener(DwtEvent.SELECTION, listener);
};

/**
 * Adds an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.addActionListener = 
function(listener) {
	this.addListener(DwtEvent.ACTION, listener);
};

/**
 * Removes an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtCalendar.prototype.removeActionListener = 
function(listener) { 
	this.removeListener(DwtEvent.ACTION, listener);
};

/**
 * Adds a date range listener. Date range listeners are called whenever the date range of the calendar
 * changes (i.e. when it rolls over due to a programatic action via {@link #setDate} or
 * via user selection).
 *
 * @param 	{AjxListener}		listener		the listener
 */
DwtCalendar.prototype.addDateRangeListener = 
function(listener) {
	this.addListener(DwtEvent.DATE_RANGE, listener);
};

/**
 * Removes a date range listener.
 * 
 * @param 	{AjxListener}		listener		the listener
 */
DwtCalendar.prototype.removeDateRangeListener = 
function(listener) { 
	this.removeListener(DwtEvent.DATE_RANGE, listener);
};

/**
 * Sets the skip notify on page. This method notify (or not) selection when paging arrow buttons
 * are clicked.
 *
 * @param	{boolean}	skip		if <code>true</code>, do not notify selection
 */
DwtCalendar.prototype.setSkipNotifyOnPage = 
function(skip) {
	this._skipNotifyOnPage = skip;
};

/**
 * Gets the skip notify on page setting.
 * 
 * @return	{boolean}	<code>true</code>, do not notify selection
 */
DwtCalendar.prototype.getSkipNotifyOnPage = 
function() {
	return this._skipNotifyOnPage;
};

/**
 * Sets the date.
 * 
 * @param	{Date}	date	the date
 * @param	{boolean}	skipNotify		if <code>true</code>, do not notify selection
 * @param {boolean}	forceRollOver 	if <code>true</code>, then clicking on (or setting) the widget to a 
 *												date that is not part of the current month (i.e. one of 
 *												the grey prev or next month days) will result in the 
 *												widget rolling 	the date to that month.
 * @param	{boolean}	dblClick		if <code>true</code>, require a double click
 */
DwtCalendar.prototype.setDate =
function(date, skipNotify, forceRollOver, dblClick) {

	forceRollOver = (forceRollOver == null) ? this._forceRollOver : forceRollOver;
	
	// Check if the date is available for selection. Basically it is unless we are in
	// work week selection mode and <date> is not a working day
	//if (this._selectionMode == DwtCalendar.WORK_WEEK && !this._currWorkingDays[date.getDay()])
	//	return false;

	if(!date) {
		date = new Date();
	}
	var newDate = new Date(date.getTime());
	var oldDate = this._date;

	var layout = false;
	var notify = false;
	var cellId;

	if (this._date2CellId != null) {
		var idx = (newDate.getFullYear() * 10000) + (newDate.getMonth() * 100) + newDate.getDate();
		var cellId = this._date2CellId[idx];
		
		if (cellId) {
		 	if (cellId == this._selectedCellId)
		 		notify = true;

			var cell = document.getElementById(cellId);
			if (cell._dayType == DwtCalendar._THIS_MONTH)
				notify = true;
			else if (forceRollOver)
				notify = layout = true;
			else
				notify = true;
		} else {
			 notify = layout = true;
		}
	} else {
		notify = layout = true;
	}

	// update before layout, notify after layout
	if (notify) {
		if (this._date){
			// 5/13/2005 EMC -- I'm not sure why this was setting the hours to 0.
			// I think it should respect what the user passed in, and only change
			// the parts of the date that it is responsible for.
			//newDate.setHours(0,0,0,0);
			//handle daylight saving
			if(AjxDateUtil.isDayShifted(newDate)) {
				AjxDateUtil.rollToNextDay(newDate);
			}
			newDate.setHours(this._date.getHours(), this._date.getMinutes(), this._date.getSeconds(), 0);            
		}

		this._date = newDate;
		if (!layout && !this._readOnly) {
			this._setSelectedDate();
			this._setToday();
		}
	}

	if (layout) {
		this._layout();
	}

	if (notify && !skipNotify) {
		var type = dblClick ? DwtCalendar.DATE_DBL_CLICKED : DwtCalendar.DATE_SELECTED;
		this._notifyListeners(DwtEvent.SELECTION, type, this._date);
	}
	
	return true;
};

/**
 * Checks if the cell is selected.
 * 
 * @param	{string}	cellId			the cell id	
 * @return	{boolean}	<code>true</code> if the cell is the selected day
 */
DwtCalendar.prototype.isSelected =
function(cellId) {
	// if cellId is the selected day, then return true, else if we are NOT in
	// day selection mode (i.e. week/work week) then compute the row and index
	// of cellId and look it up in the week array to see if it is a selectable day
	if (cellId == this._selectedDayElId) {
		return true;
	} else if (this._selectionMode != DwtCalendar.DAY) {
		// If the cell is in the same row as the currently selected cell and it
		// is a selectable day (i.e. a working day in the case of work week),
		// then say it is selected
		var cellIdx = this._getDayCellIndex(cellId);
		if (Math.floor(cellIdx / 7) == Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7)
			&& this._currWorkingDays[cellIdx % 7])
			return true;
	}
	return false;
};

/**
 * Gets the force roll over setting. Force roll over is occurs when a date that
 * is not part of the current month (i.e. one of the grey prev or next month
 * days) will result in the widget rolling 	the date to that month.
 * 
 * @return	{boolean}	<code>true</code> if force roll over is set
 */
DwtCalendar.prototype.getForceRollOver =
function() {
	return this._forceRollOver;
};

/**
 * Sets the force roll over setting. Force roll over is occurs when a date that
 * is not part of the current month (i.e. one of the grey prev or next month
 * days) will result in the widget rolling 	the date to that month.
 * 
 * @param	{boolean}	force		if <code>true</code>, force roll over
 */
DwtCalendar.prototype.setForceRollOver =
function(force) {
	if (force == null) { return; }
	
	if (this._forceRollOver != force) {
		this._forceRollOver = force;
		this._layout();
	}
};

/**
 * Gets the selection mode.
 * 
 * @return	{constant}		the selection mode
 */
DwtCalendar.prototype.getSelectionMode =
function() {
	return this._selectionMode;
};

/**
 * Sets the selection mode.
 * 
 * @return	{constant}		selectionMode		the selection mode
 */
DwtCalendar.prototype.setSelectionMode =
function(selectionMode) {
	if (this._selectionMode == selectionMode) { return; }

	this._selectionMode = selectionMode;
	if (selectionMode == DwtCalendar.WEEK) {
		this._currWorkingDays = DwtCalendar._FULL_WEEK;
	} else if (selectionMode == DwtCalendar.WORK_WEEK) {
		this._currWorkingDays = this._workingDays;
	}

	this._layout();
};

/**
 * Sets the working week.
 * 
 * @param	{array}	workingDaysArray		an array of days
 */
DwtCalendar.prototype.setWorkingWeek =
function(workingDaysArray) {
	// TODO Should really create a copy of workingDaysArray
	this._workingDays = this._currWorkingDays = workingDaysArray;
	
	if (this._selectionMode == DwtCalendar.WORK_WEEK) {
		DBG.println("FOO!!!");
		this._layout();
	}
};

/**
 * Enables/disables the highlight (i.e. "bolding") on the dates in <code>&lt;dates&gt;</code>.
 *
 * @param {object} dates associative array of {@link Date} objects for
 * which to enable/disable highlighting
 * @param {boolean}	enable 	if <code>true</code>, enable highlighting
 * @param {boolean}	clear 	if <code>true</code>, clear current highlighting
 */
DwtCalendar.prototype.setHilite =
function(dates, enable, clear) {
	if (this._date2CellId == null) { return; }

	var cell;
	var aDate;
	if (clear) {
		for (aDate in this._date2CellId) {
			cell = document.getElementById(this._date2CellId[aDate]);
			if (cell._isHilited) {
				cell._isHilited = false;
				this._setClassName(cell, DwtCalendar._NORMAL);
			}	
		}
	}

	var cellId;
	for (var i in dates) {
        // NOTE: Protect from prototype extensions.
        if (dates.hasOwnProperty(i)) {
            aDate = dates[i];
            cellId = this._date2CellId[aDate.getFullYear() * 10000 + aDate.getMonth() * 100 + aDate.getDate()];

            if (cellId) {
                cell = document.getElementById(cellId);
                if (cell._isHilited != enable) {
                    cell._isHilited = enable;
                    this._setClassName(cell, DwtCalendar._NORMAL);
                }
            }
        }
	}
};

/**
 * Gets the date.
 * 
 * @return	{Date}	the date
 */
DwtCalendar.prototype.getDate =
function() {
	return this._date;
};

/**
 * Sets the first date of week.
 * 
 * @param	{constant}		firstDayOfWeek		the first day of week
 */
DwtCalendar.prototype.setFirstDayOfWeek =
function(firstDayOfWeek) {
	for (var i = 0; i < 7; i++) {
		this._weekDays[i] = (i < firstDayOfWeek)
			? (6 - (firstDayOfWeek -i - 1))
			: (i - firstDayOfWeek);

		var dowCell = document.getElementById(this._getDOWCellId(i));
		dowCell.innerHTML = AjxDateUtil.WEEKDAY_SHORT[(firstDayOfWeek + i) % 7];
	}
    this._firstDayOfWeek = firstDayOfWeek
	this._layout();
};

/**
 * Gets the date range.
 * 
 * @return	{Object}		the range (<code>range.start</code> and <code>range.end</code>)
 */
DwtCalendar.prototype.getDateRange =
function () {
	return this._range;
};

DwtCalendar.prototype._getDayCellId =
function(cellId) {
	return ("c:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getDayCellIndex =
function(cellId) {
	return cellId.substring(2, cellId.indexOf(":", 3));
};

DwtCalendar.prototype._getDOWCellId =
function(cellId) {
	return ("w:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getWeekNumberCellId =
function(cellId) {
	return ("k:" + cellId + ":" + this._uuid);
};

DwtCalendar.prototype._getDaysInMonth =
function(mo, yr) {
	/* If we are not dealing with Feb, then simple lookup
	 * Leap year rules
	 *  1. Every year divisible by 4 is a leap year.
	 *  2. But every year divisible by 100 is NOT a leap year
	 *  3. Unless the year is also divisible by 400, then it is still a leap year.*/
	if (mo != 1) {
		return DwtCalendar._DAYS_IN_MONTH[mo];
	}

	if (yr % 4 != 0 || (yr % 100 == 0 && yr % 400 != 0)) {
		return 28;
	}

	return 29;
};

DwtCalendar.prototype._installListeners =
function() {
	this._setMouseEventHdlrs();
	this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));
	this.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this._mouseOutListener));
	this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
	this.addListener(DwtEvent.ONMOUSEUP, new AjxListener(this, this._mouseUpListener));
	this.addListener(DwtEvent.ONDBLCLICK, new AjxListener(this, this._doubleClickListener));
};

DwtCalendar.prototype._notifyListeners =
function(eventType, type, detail, ev) {
	if (!this.isListenerRegistered(eventType)) { return; }

	var selEv = DwtShell.selectionEvent;
	if (ev) {
		DwtUiEvent.copy(selEv, ev);
	} else {
		selEv.reset();
	}
	selEv.item = this;
	selEv.detail = detail;
	selEv.type = type;
	this.notifyListeners(eventType, selEv);
};

DwtCalendar.prototype._layout =
function() {
	if (this._date == null) { this._date = new Date(); }

	if (!this._calWidgetInited) {
		this._init();
	}

	var date = new Date(this._date.getTime());
	date.setDate(1);
	var year = date.getFullYear();
	var month  = date.getMonth();
	var firstDay = date.getDay();
	var daysInMonth = this._getDaysInMonth(month, year);
	var day = 1;
	var nextMoDay = 1;

	this._date2CellId = new Object();
	this._selectedDayElId = null;

	// Figure out how many days from the previous month we have to fill in
	// (see comment below)
	var lastMoDay, lastMoYear, lastMoMonth, nextMoMonth, nextMoYear;
	if (!this._hidePrevNextMo) {
		if (month != 0) {
			lastMoDay = this._getDaysInMonth(month - 1, year) - this._weekDays[firstDay] + 1;
			lastMoYear = year;
			lastMoMonth = month - 1;
			if (month != 11) {
				nextMoMonth = month + 1;
				nextMoYear = year;
			} else {
				nextMoMonth = 0;
				nextMoYear = year + 1;
			}
		} else {
			lastMoDay = this._getDaysInMonth(11, year - 1) - this._weekDays[firstDay] + 1;
			lastMoYear = year - 1;
			lastMoMonth = 11;
			nextMoMonth = 1;
			nextMoYear = year;
		}
	}

	for (var i = 0; i < 6; i++) {
		for (var j = 0; j < 7; j++) {
			var dayCell = document.getElementById(this._getDayCellId(i * 7 + j));

			if (dayCell._isHilited == null) {
				dayCell._isHilited = false;
			}

			if (day <= daysInMonth) {
				/* The following if statement deals with the first day of this month not being
				 * the first day of the week. In this case we must fill the preceding days with
				 * the final days of the previous month */
				if (i != 0 || j >= this._weekDays[firstDay]) {
					this._date2CellId[(year * 10000) + (month * 100) + day] = dayCell.id;
					dayCell._day = day;
					dayCell._month = month;
					dayCell._year = year;
					dayCell.innerHTML = day++;
					dayCell._dayType = DwtCalendar._THIS_MONTH;
					if (this._readOnly) {
						dayCell.style.fontFamily = "Arial";
						dayCell.style.fontSize = "10px";
					}
				} else {
					if (this._hidePrevNextMo) {
						dayCell.innerHTML = "";
					} else {
						this._date2CellId[(lastMoYear * 10000) + (lastMoMonth * 100) + lastMoDay] = dayCell.id;
						dayCell._day = lastMoDay;
						dayCell._month = lastMoMonth;
						dayCell._year = lastMoYear;
						dayCell.innerHTML = lastMoDay++;
						dayCell._dayType = DwtCalendar._PREV_MONTH;
					}
				}
			} else if (!this._hidePrevNextMo) {
				// Fill any remaining slots with days from next month
				this._date2CellId[(nextMoYear * 10000) + (nextMoMonth * 100) + nextMoDay] = dayCell.id;
				dayCell._day = nextMoDay;
				dayCell._month = nextMoMonth;
				dayCell._year = nextMoYear;
				dayCell.innerHTML = nextMoDay++;
				dayCell._dayType = DwtCalendar._NEXT_MONTH;
			}
			this._setClassName(dayCell, DwtCalendar._NORMAL);
		}

		if (this._showWeekNumber) {
			var kwCellId = this._getWeekNumberCellId('kw' + i * 7);
			var kwCell = document.getElementById(kwCellId);
			if (kwCell) {
				var firstDayCell = document.getElementById(this._getDayCellId(i * 7));
				kwCell.innerHTML = AjxDateUtil.getWeekNumber(new Date(firstDayCell._year, firstDayCell._month, firstDayCell._day), this._firstDayOfWeek, null, this._useISO8601WeekNo);
			}
		}
	}

	this._setTitle(month, year);

	// Compute the currently selected day
	if (!this._readOnly) {
		this._setSelectedDate();
		this._setToday();
	}
	
	this._setRange();
};

DwtCalendar.prototype._setRange =
function() {
	var cell = document.getElementById(this._getDayCellId(0));
	var start = new Date(cell._year, cell._month, cell._day, 0, 0, 0, 0);

	cell = document.getElementById(this._getDayCellId(DwtCalendar._LAST_DAY_CELL_IDX));
	
	var daysInMo = this._getDaysInMonth(cell._month, cell._year);
	var end;
	if (cell._day < daysInMo) {
		end = new Date(cell._year, cell._month, cell._day + 1, 0, 0, 0, 0);
	} else if (cell._month < 11) {
		end = new Date(cell._year, cell._month + 1, 1, 0, 0, 0, 0);
	} else {
		end = new Date(cell._year + 1, 0, 1, 0, 0, 0, 0);
	}

	if (this._range == null) {
		this._range = {};
	} else if (this._range.start.getTime() == start.getTime() && this._range.end.getTime() == end.getTime()) {
		return false;
	}

	this._range.start = start;
	this._range.end = end;

	// Notify any listeners
	if (!this.isListenerRegistered(DwtEvent.DATE_RANGE)) { return; }

	if (!this._dateRangeEvent) {
		this._dateRangeEvent = new DwtDateRangeEvent(true);
	}

	this._dateRangeEvent.item = this;
	this._dateRangeEvent.start = start;
	this._dateRangeEvent.end = end;
	this.notifyListeners(DwtEvent.DATE_RANGE, this._dateRangeEvent);
};

DwtCalendar.prototype._setToday =
function() {
	var cell;
	var today = new Date();
	var todayDay = today.getDate();

	if (!this._todayDay || this._todayDay != todayDay) {
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = false;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}

		this._todayCellId = this._date2CellId[(today.getFullYear() * 10000) + (today.getMonth() * 100) + todayDay];
		if (this._todayCellId != null) {
			cell = document.getElementById(this._todayCellId);
			cell._isToday = true;
			this._setClassName(cell, DwtCalendar._NORMAL);
		}
	}
};

DwtCalendar.prototype._setSelectedDate =
function() {
	var day = this._date.getDate();
	var month = this._date.getMonth();
	var year = this._date.getFullYear();
	var cell;

	if (this._selectedDayElId) {
		cell = document.getElementById(this._selectedDayElId);
		this._setClassName(cell, DwtCalendar._DESELECTED);
	}

	var cellId = this._date2CellId[(year * 10000) + (month * 100) + day];
	cell = document.getElementById(cellId);
	this._selectedDayElId = cellId;
	this._setClassName(cell, DwtCalendar._SELECTED);
};

DwtCalendar.prototype._setCellClassName = 
function(cell, className, mode) {
	if (cell._dayType != DwtCalendar._THIS_MONTH) {
		className += this._greyClassName;
	}

	if (this._selectionMode == DwtCalendar.DAY &&
		cell.id == this._selectedDayElId &&
		mode != DwtCalendar._DESELECTED)
	{
		className += this._selectedDayClassName;
	}
	else if (this._selectionMode != DwtCalendar.DAY &&
			 mode != DwtCalendar._DESELECTED &&
			 this._selectedDayElId != null)
	{
		var idx = this._getDayCellIndex(cell.id);
		if (Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) == Math.floor(idx / 7) &&
			this._currWorkingDays[idx % 7])
		{
			className += this._selectedDayClassName;
		}
	}

	if (cell._isHilited) {
		className += this._hiliteClassName;
	}

	if (cell._isToday) {
		className += this._todayClassName;
	}

	return className;
};

DwtCalendar.prototype._setClassName = 
function(cell, mode) {
	var className = "";
	
	if (mode == DwtCalendar._NORMAL) {
		className = this._origDayClassName;
	} else if (mode == DwtCalendar._HOVERED) {
		className = this._hoveredDayClassName;
	} else if (mode == DwtCalendar._ACTIVE) {
		className = this._activeDayClassName;
	} else if (mode == DwtCalendar._DESELECTED && this._selectionMode == DwtCalendar.DAY) {
		className = this._origDayClassName;
	} else if (this._selectionMode != DwtCalendar.DAY &&
			(mode == DwtCalendar._SELECTED || mode == DwtCalendar._DESELECTED))
	{
		// If we are not in day mode, then we need to highlite multiple cells
		// e.g. the whole week if we are in week mode
		var firstCellIdx = Math.floor(this._getDayCellIndex(this._selectedDayElId) / 7) * 7;

		for (var i = 0; i < 7; i++) {
			className = this._origDayClassName;
			var aCell = document.getElementById(this._getDayCellId(firstCellIdx++));
			aCell.className = this._setCellClassName(aCell, className, mode);
		}
		return;
	}

	cell.className = this._setCellClassName(cell, className, mode);
};

DwtCalendar.prototype._setTitle =
function(month, year) {
	var cell = document.getElementById(this._monthCell);
	var formatter = DwtCalendar.getMonthFormatter();
	var date = new Date(year, month);
	cell.innerHTML = formatter.format(date);
};

DwtCalendar.prototype._init =
function() {
	var html = new Array(100);
	var idx = 0;
	this._monthCell = "t:" + this._uuid;

	// Construct the header row with the prev/next year and prev/next month
	// icons as well as the month/year title cell
	html[idx++] =	"<table role='presentation' width=100%>";
	html[idx++] =		"<tr><td class='DwtCalendarTitlebar'>";
	html[idx++] =			"<table role='presentation'>";
	html[idx++] =				"<tr>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:py:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FastRevArrowSmall", null, ["id='b:py:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:pm:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("RevArrowSmall", null, ["id='b:pm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td class='DwtCalendarTitleCell' 'nowrap' style='width: 60%'><span class='";
	html[idx++] =						DwtCalendar._TITLE_CLASS;
	html[idx++] = 						"' id='";
	html[idx++] =						this._monthCell;
	html[idx++] =					"'></span></td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:nm:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FwdArrowSmall", null, ["id='b:nm:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =					"<td align='center' class='";
	html[idx++] =						DwtCalendar._BUTTON_CLASS;
	html[idx++] =						"' id='b:ny:";
	html[idx++] =						this._uuid;
	html[idx++] =						"'>";
	html[idx++] =						AjxImg.getImageHtml("FastFwdArrowSmall", null, ["id='b:ny:img:", this._uuid, "'"].join(""));
	html[idx++] =					"</td>";
	html[idx++] =				"</tr>";
	html[idx++] =			"</table>";
	html[idx++] =		"</td></tr>";
	html[idx++] =	"<tr><td class='DwtCalendarBody'>";
	html[idx++] =		"<table role='presentation' width='100%' style='border-collapse:separate;' cellspacing='0'>";
	html[idx++] =			"<tr>";

	if (this._showWeekNumber) {
		html[idx++] = "<td class='DwtCalendarWeekNoTitle' width='14%' id='";
		html[idx++] = this._getWeekNumberCellId('kw');
		html[idx++] = "'>";
		html[idx++] = AjxMsg.calendarWeekTitle;
		html[idx++] = "</td>";
	}

	for (var i = 0; i < 7; i++) {
		html[idx++] = "<td class='DwtCalendarDow' width='";
		html[idx++] = (i < 5 ? "14%" : "15%");
		html[idx++] = "' id='";
		html[idx++] = this._getDOWCellId(i);
		html[idx++] = "'>&nbsp;</td>";
	}
	html[idx++] = "</tr>";

	for (var i = 0; i < 6; i++) {
		html[idx++] = "<tr>";
		if (this._showWeekNumber) {
			html[idx++] = "<td class='DwtCalendarWeekNo' id='" + this._getWeekNumberCellId('kw' + i * 7) + "'>&nbsp;</td>";
		}
		for (var j = 0; j < 7; j++) {
			html[idx++] = "<td id='";
			html[idx++] = this._getDayCellId(i * 7 + j);
			html[idx++] = "'>&nbsp;</td>";
		}
		html[idx++] ="</tr>";
	}

	html[idx++] = "</td></tr></table></table>";

	this.getHtmlElement().innerHTML = html.join("");
	if (!this._readOnly) {
		document.getElementById("b:py:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastRevArrowSmall");
		document.getElementById("b:pm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("RevArrowSmall");
		document.getElementById("b:nm:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FwdArrowSmall");
		document.getElementById("b:ny:img:" + this._uuid)._origClassName = AjxImg.getClassForImage("FastFwdArrowSmall");
	}

	this._calWidgetInited = true;
};

/**
 * Sets the mouse over day callback.
 * 
 * @param	{AjxCallback}		callback		the callback
 */
DwtCalendar.prototype.setMouseOverDayCallback =
function(callback) {
	this._mouseOverDayCB = callback;
};

/**
 * Sets the mouse out day callback.
 * 
 * @param	{AjxCallback}		callback		the callback
 */
DwtCalendar.prototype.setMouseOutDayCallback =
function(callback) {
	this._mouseOutDayCB = callback;
};

/**
 * Gets the date value for the last cell that the most recent
 * Drag-and-drop operation occurred over. Typically it will be called by a DwtDropTarget
 * listener when an item is dropped onto the mini calendar
 * 
 * @return	{Date}		the date or <code>null</code> for none
 */
DwtCalendar.prototype.getDndDate =
function() {
	var dayCell = this._lastDndCell;
	if (dayCell) {
		return new Date(dayCell._year, dayCell._month, dayCell._day);
	}

	return null;
};

// Temp date used for callback in mouseOverListener
DwtCalendar._tmpDate = new Date();
DwtCalendar._tmpDate.setHours(0, 0, 0, 0);

DwtCalendar.prototype._mouseOverListener = 
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._HOVERED);
		// If a mouse over callback has been registered, then call it to give it
		// chance do work like setting the tooltip content
		if (this._mouseOverDayCB) {
			DwtCalendar._tmpDate.setFullYear(target._year, target._month, target._day);
			this._mouseOverDayCB.run(this, DwtCalendar._tmpDate);
		}
	} else if (target.id.charAt(0) == 't') {
		// Dont activate title for now
		return;
	} else if (target.id.charAt(0) == 'b') {
		var img;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_HOVERED_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_HOVERED_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = img._origClassName;
	}

	ev._stopPropagation = true;
};

DwtCalendar.prototype._mouseOutListener = 
function(ev) {
	this.setToolTipContent(null);
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._NORMAL);
		if (this._mouseOutDayCB) {
			this._mouseOutDayCB.run(this);
		}
	} else if (target.id.charAt(0) == 'b') {
		var img;
		target.className = DwtCalendar._BUTTON_CLASS;
		if (target.firstChild == null) {
			img = target;
			AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_CLASS;
		} else {
			target.className = DwtCalendar._BUTTON_CLASS;
			img = AjxImg.getImageElement(target);
		}
		img.className = img._origClassName;
	}
};

DwtCalendar.prototype._mouseDownListener = 
function(ev) {
	if (ev.button == DwtMouseEvent.LEFT) {
		var target = ev.target;
		if (target.id.charAt(0) == 'c') {
			this._setClassName(target, DwtCalendar._ACTIVE);
		} else if (target.id.charAt(0) == 't') {
			target.className = DwtCalendar._TITLE_ACTIVE_CLASS;
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_ACTIVE_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_ACTIVE_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
		} else if (target.id.charAt(0) == 'w') {
		}
	}
};

DwtCalendar.prototype._mouseUpListener = 
function(ev) {
	var target = ev.target;
	if (ev.button == DwtMouseEvent.LEFT) {
		if (target.id.charAt(0) == 'c') {
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu)
				DwtMenu.closeActiveMenu();

            var sDate = new Date(target._year, target._month, target._day);
            if(sDate.getDate() != target._day) {
                sDate.setDate(target._day);                 
            }
			if (this.setDate(sDate)) { return; }

			this._setClassName(target, DwtCalendar._HOVERED);
		} else if (target.id.charAt(0) == 'b') {
			var img;
			if (target.firstChild == null) {
				img = target;
				AjxImg.getParentElement(target).className = DwtCalendar._BUTTON_HOVERED_CLASS;
			} else {
				target.className = DwtCalendar._BUTTON_HOVERED_CLASS;
				img = AjxImg.getImageElement(target);
			}
			img.className = img._origClassName;
			
			if (img.id.indexOf("py") != -1) {
				this._prevYear();
			} else if (img.id.indexOf("pm") != -1) {
				this._prevMonth();
			} else if (img.id.indexOf("nm") != -1) {
				this._nextMonth();
			} else {
				this._nextYear();
			}
		} else if (target.id.charAt(0) == 't') {
			// TODO POPUP MENU
			target.className = DwtCalendar._TITLE_HOVERED_CLASS;
			this.setDate(new Date(), this._skipNotifyOnPage);
			// If our parent is a menu then we need to have it close
			if (this.parent instanceof DwtMenu) {
				DwtMenu.closeActiveMenu();
			}
		}
	} else if (ev.button == DwtMouseEvent.RIGHT && target.id.charAt(0) == 'c') {
		this._notifyListeners(DwtEvent.ACTION, 0, new Date(target._year, target._month, target._day), ev);
	}
};

DwtCalendar.prototype._doubleClickListener =
function(ev) {
	var target = ev.target;
	if (this._selectionEvent) {
		this._selectionEvent.type = DwtCalendar.DATE_DBL_CLICKED;
	}
	if (target.id.charAt(0) == 'c') {
		// If our parent is a menu then we need to have it close
		if (this.parent instanceof DwtMenu) {
			DwtMenu.closeActiveMenu();
		}
		this.setDate(new Date(target._year, target._month, target._day), false, false, true)
	}
};

DwtCalendar.prototype._prevMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, -1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._nextMonth = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.MONTH, 1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._prevYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, -1), this._skipNotifyOnPage);
};

DwtCalendar.prototype._nextYear = 
function(ev) {
	var d = new Date(this._date.getTime());
	this.setDate(AjxDateUtil.roll(d, AjxDateUtil.YEAR, 1), this._skipNotifyOnPage);
};

/**
 * Gets the date formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateFormatter =
function() {
	if (!DwtCalendar._dateFormatter) {
		DwtCalendar._dateFormatter = new AjxDateFormat(AjxMsg.formatCalDate);
	}
	return DwtCalendar._dateFormatter;
};

/**
 * Gets the date long formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateLongFormatter =
function() {
	if (!DwtCalendar._dateLongFormatter) {
		DwtCalendar._dateLongFormatter = new AjxDateFormat(AjxMsg.formatCalDateLong);
	}
	return DwtCalendar._dateLongFormatter;
};

/**
 * Gets the date full formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDateFullFormatter =
function() {
	if (!DwtCalendar._dateFullFormatter) {
		DwtCalendar._dateFullFormatter = new AjxDateFormat(AjxMsg.formatCalDateFull);
	}
	return DwtCalendar._dateFullFormatter;
};

/**
 * Gets the hour formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getHourFormatter =
function() {
	if (!DwtCalendar._hourFormatter) {
		DwtCalendar._hourFormatter = new AjxMessageFormat(AjxMsg.formatCalHour);
	}
	return DwtCalendar._hourFormatter;
};

/**
 * Gets the day formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getDayFormatter =
function() {
	if (!DwtCalendar._dayFormatter) {
		DwtCalendar._dayFormatter = new AjxDateFormat(AjxMsg.formatCalDay);
	}
	return DwtCalendar._dayFormatter;
};

/**
 * Gets the month formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getMonthFormatter =
function() {
	if (!DwtCalendar._monthFormatter) {
		DwtCalendar._monthFormatter = new AjxDateFormat(AjxMsg.formatCalMonth);
	}
	return DwtCalendar._monthFormatter;
};

/**
 * Gets the short month formatter.
 * 
 * @return	{AjxDateFormat}		the date formatter
 * 
 * @private
 */
DwtCalendar.getShortMonthFormatter =
function() {
	if (!DwtCalendar._shortMonthFormatter) {
		DwtCalendar._shortMonthFormatter = new AjxDateFormat(AjxMsg.formatShortCalMonth);
	}
	return DwtCalendar._shortMonthFormatter;
};

DwtCalendar.prototype._dragEnter =
function(ev) {
};

DwtCalendar.prototype._dragHover =
function(ev) {
};

DwtCalendar.prototype._dragOver =
function(ev) {
	var target = ev.target;
	if (target.id.charAt(0) == 'c') {
		this._setClassName(target, DwtCalendar._HOVERED);
		this._lastDndCell = target;
	} else {
		this._lastDndCell = null;
	}
};

DwtCalendar.prototype._dragLeave =
function(ev) {
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtPropertyPage")) {
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
 * Creates a property page.
 * @class
 * @constructor
 * This class represents a page (view) for working with properties. It provides ability to
 * keep track of any changes in the form fields on the page.
 * 
 * @author Greg Solovyev
 * 
 * @param	{hash}	params		a hash of parameters
 * 
 * @extends		DwtComposite
 */
DwtPropertyPage = function(params) {
	if (arguments.length == 0) return;
	params = Dwt.getParams(arguments, DwtPropertyPage.PARAMS);
	params.className = params.className || "DwtPropertyPage";
	DwtComposite.call(this, params);
	this._fieldIds = new Object();
	this._fildDivIds = new Object();
	this._isDirty = false;
	this._tabGroup = new DwtTabGroup(this.toString());
};

DwtPropertyPage.prototype = new DwtComposite;
DwtPropertyPage.prototype.constructor = DwtPropertyPage;

DwtPropertyPage.prototype.toString = function() {
	return "DwtPropertyPage";
};

DwtPropertyPage.PARAMS = DwtComposite.PARAMS;

/**
 * Sets the value of the dirty flag.
 * 
 * @param {boolean}	isD	
 * 
 * @private
 */
DwtPropertyPage.prototype.setDirty = 
function (isD) {
	this._isDirty = isD;
}

/**
 * @return boolean _isDirty flag
 * isDirty indicates whether the user changed any data on the page after the page was initialized
 * 
 * @private
 */
DwtPropertyPage.prototype.isDirty = 
function () {
	return this._isDirty;
}

DwtPropertyPage.prototype.getTabGroupMember =
function (){
	return this._tabGroup;
};

/**
 * @param field either key to the field ID in the _fieldIds or reference to the field
 * 
 * @private
 */
DwtPropertyPage.prototype._installOnKeyUpHandler = 
function(field, func) {
	if (!field)	return;
	
	var e = null;
	e = document.getElementById(this._fieldIds[field]);
	if (e) {
		Dwt.setHandler(e, DwtEvent.ONKEYUP, func ? func : this._onKeyUp);
		e._view = this;
		e._field = field;
	}
}

/**
 * @param field either key to the field ID in the _fieldIds or reference to the field
 * 
 * @private
 */
DwtPropertyPage.prototype._installOnClickHandler = 
function(field, func) {
	if (!field) return;
	
	var e = document.getElementById(this._fieldIds[field]);
	if (e) {
		Dwt.setHandler(e, DwtEvent.ONCLICK, func ? func : this._onClick);
		e._view = this;
		e._field = field;
	}
}

DwtPropertyPage.prototype._onClick =
function(ev) {
	this._view.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._onKeyUp =
function(ev) {
	this._view.setDirty(true);
	return true;
}

/**
 * @param field either key to the field ID in the _fieldIds or reference to the field
 * 
 * @private
 */
DwtPropertyPage.prototype._installOnChangeHandler = 
function(field, func) {
	if (!field) return;
	
	var e = null;
	e = document.getElementById(this._fieldIds[field]);
	if(e) {
		Dwt.setHandler(e, DwtEvent.ONCHANGE, func ? func : this._onChange);
		e._view = this;
		e._field = field;
	}
}

DwtPropertyPage._onChange =
function(ev) {
	this._view.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._onChange2 =
function(ev) {
	this.setDirty(true);
	return true;
}

DwtPropertyPage.prototype._addDwtSelectEntryRow =
function(field, title, html, idx, titleSize) {
	var tSize = "30ex";
	if(titleSize)
		tSize = titleSize;
		
	html[idx++] = "<tr valign='center'>";
	idx = this._addDwtSelectEntryCell(field, title, html, idx, tSize);
	html[idx++] = "</tr>";
	return idx;
}

DwtPropertyPage.prototype._addDwtSelectEntryCell =
function(field, title, html, idx, titleWidth) {
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	if(title) {
		html[idx++] = "<td align='left' style='width:" + titleWidth + "'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td align='left'>";
	html[idx++] = "<div id='" + id + "'></div></td>";
	return idx;
}

DwtPropertyPage.prototype._addBoolEntryRow =
function(field, title, html, idx, titleWidth) {
	html[idx++] = "<tr valign='center'>";
	idx = this._addBoolEntryCell(field, title, html, idx, titleWidth);
	html[idx++] = "</tr>";
	return idx;
}

DwtPropertyPage.prototype._addBoolEntryCell =
function(field, title, html, idx, titleWidth) {
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	var tWidth = "20ex";
	if(titleWidth)
		tWidth = titleWidth;	
		
	if(title) {
		html[idx++] = "<td style='width:" + tWidth + ";' align='left'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td align='left'>";
	html[idx++] = "<input type='checkbox' id='"+id+"'>";
	html[idx++] = "</td>";
	return idx;
}

DwtPropertyPage.prototype._addTextAreaEntryRow =
function(field, title, html, idx, noWrap) {
	var myWrap = "on";
	if(noWrap)
		myWrap = "off";
		
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	html[idx++] = "<tr valign='center'>";
	html[idx++] = "<td align='left' style='width:60ex;'>";
	html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
	html[idx++] = "</td></tr>";
	html[idx++] = "<tr valign='center'><td align='left' style='width:60ex;'><textarea wrap='" + myWrap + "' rows='8' cols ='60' id='";	
	html[idx++] = id;
	html[idx++] = "'/></textarea></td></tr>";
	return idx;
}

/**
 * _addEntryRow
 *	@param field - key of the field id in this._fieldIds
 *	@param title - title string. If title is specified a separate cell will be appended before the form field
 * title will be rendered within that cell
 *	@param html - reference to html array
 *	@param idx - current counter inside the html array
 *	@param type - type of the form field to create (<input type= )
 *	@param fldsize - size of the input field (this value will be assigned to the size property
 *	@param tailTitle - string that will be placed behind the form field
 *	@param titleWidth - width of the title cell
 * 
 * @private
 */
DwtPropertyPage.prototype._addEntryRow =
function(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric) {
	html[idx++] = "<tr valign='center'>";
	idx = this._addEntryCell(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric);
	html[idx++] = "</tr>";
	return idx;
}

/**
 * _addEntryCell
 *	@param field - key of the field id in this._fieldIds
 *	@param title - title string. If title is specified a separate cell will be appended before the form field
 * title will be rendered within that cell
 *	@param html - reference to html array
 *	@param idx - current counter inside the html array
 *	@param type - type of the form field to create (<input type= )
 *	@param fldsize - size of the input field (this value will be assigned to the size property
 *	@param tailTitle - string that will be placed behind the form field
 *	@param titleWidth - width of the title cell
 * 
 * @private
 */
DwtPropertyPage.prototype._addEntryCell =
function(field, title, html, idx, type, fldsize, tailTitle, titleWidth, withAsteric) {
	if (type == null) type = "text";
	if(fldsize == null) fldsize = 35;
	var tWidth = "20ex";
	if(titleWidth) 
		tWidth = titleWidth;
		
	var id = Dwt.getNextId();
	this._fieldIds[field] = id;
	if(title) {
		html[idx++] = "<td align='left' style='width:" + tWidth + ";'>";
		html[idx++] = AjxStringUtil.htmlEncode(title) + ":";
		html[idx++] = "</td>";
	}
	html[idx++] = "<td ";
	if(withAsteric) {
		html[idx++] = "class='redAsteric' ";		
	}
	html[idx++] = "	align='left'><input autocomplete='off' size='"+fldsize+"' type='"+type+"' id='";	
	html[idx++] = id;
	html[idx++] = "'";
	if(withAsteric) {
		html[idx++] = "/>*";		
	} else {
		html[idx++] = "/>&nbsp;";
	}
	if(tailTitle != null) {
		html[idx++]	= tailTitle;
	}
	html[idx++] = "</td>";
	return idx;
}

/**
 * Use this method to render HTML form
 * call all other rendering methods from this method.
 * 
 * @private
 */
DwtPropertyPage.prototype._createHTML = 
function () {
 //abstract method
}
}
if (AjxPackage.define("ajax.dwt.widgets.DwtTabView")) {
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
 * Creates a tab view.
 * @constructor
 * @class
 * This class represents a tabbed view. {@link DwtTabView} manages the z-index of the contained tabs. 
 * 
 * @param {hash}			params			a hash of parameters
 * @param {DwtComposite}	parent			the parent widget
 * @param {string}			className		the CSS class
 * @param {constant}		posStyle		the positioning style (see {@link DwtControl})
 * @param {string}			id				an explicit ID to use for the control's HTML element
 * 
 * @author Greg Solovyev
 * 
 * @extends DwtComposite
 */
DwtTabView = function(params) {
	if (arguments.length == 0) return;
	params = Dwt.getParams(arguments, DwtListView.PARAMS);
	params.className = params.className || "ZTabView";
	params.posStyle = params.posStyle || DwtControl.ABSOLUTE_STYLE;
	DwtComposite.call(this, params);

	this._stateChangeEv = new DwtEvent(true);
	this._stateChangeEv.item = this;

	this._tabs = [];
	this._tabIx = 1;
	this._createHtml();

	var tabGroupId = [this.toString(), this._htmlElId].join(" ");
	this._tabGroup = new DwtTabGroup(tabGroupId);
	this._tabGroup.addMember(this._tabBar);
};

DwtTabView.PARAMS = ["parent", "className", "posStyle"];

DwtTabView.prototype = new DwtComposite;
DwtTabView.prototype.constructor = DwtTabView;

DwtTabView.prototype.isDwtTabView = true;
DwtTabView.prototype.toString = function() { return "DwtTabView"; };

DwtTabView.prototype.role = 'tablist';

// Constants

// Z-index consts for tabbed view contents are based on Dwt z-index consts
DwtTabView.Z_ACTIVE_TAB	= Dwt.Z_VIEW+10;
DwtTabView.Z_HIDDEN_TAB	= Dwt.Z_HIDDEN;
DwtTabView.Z_TAB_PANEL	= Dwt.Z_VIEW+20;
DwtTabView.Z_CURTAIN	= Dwt.Z_CURTAIN;

DwtTabView.prototype.TEMPLATE = "dwt.Widgets#ZTabView";


// Public methods


/**
 * Adds a state change listener.
 * 
 * @param {AjxListener}		listener		the listener
 */
DwtTabView.prototype.addStateChangeListener =
function(listener) {
	this._eventMgr.addListener(DwtEvent.STATE_CHANGE, listener);
};

/**
 * Removes a state change listener.
 * 
 * @param {AjxListener}		listener		the listener
 */
DwtTabView.prototype.removeStateChangeListener =
function(listener) {
	this._eventMgr.removeListener(DwtEvent.STATE_CHANGE, listener);
};

DwtTabView.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * Adds a tab.
 * 
 * @param {string}						title					the text for the tab button
 * @param {DwtTabViewPage|AjxCallback}	tabViewOrCallback		an instance of the tab view page or callback that returns an instance of {@link DwtTabViewPage}
 *
 * @return {string}		key for the added tab	This key can be used to retrieve the tab using {@link #getTab}
 * 
 * @see		#getTab
 */
DwtTabView.prototype.addTab =
function (title, tabViewOrCallback, buttonId, index) {
	var tabKey = this._tabIx++;	

	// create tab entry
	this._tabs[tabKey] = {
		title: title,
		button: this._tabBar.addButton(tabKey, title, buttonId, index)
	};

	// add the page
	this.setTabView(tabKey, tabViewOrCallback);

	// show the first tab
	if (tabKey==1) {
		var tabView = this.getTabView(tabKey);
		if(tabView) {
			tabViewOrCallback.showMe();
		}
		this._currentTabKey = tabKey;		
		this.switchToTab(tabKey);
	}
	// hide all the other tabs
	else if (tabViewOrCallback && !(tabViewOrCallback instanceof AjxCallback)) {
		tabViewOrCallback.hideMe();
		Dwt.setVisible(tabViewOrCallback.getHtmlElement(), false);
	}

	this._tabBar.addSelectionListener(tabKey, new AjxListener(this, DwtTabView.prototype._tabButtonListener));

	return tabKey;
};

DwtTabView.prototype.enable =
function(enable) {
	for (var i in this._tabs) {
		var button = this._tabs[i].button;
		if (button) {
			button.setEnabled(enable);
		}
	}
};

/**
 * Gets the current tab.
 * 
 * @return {string}		the tab key
 */
DwtTabView.prototype.getCurrentTab =
function() {
	return this._currentTabKey;
};

/**
 * Gets the tab count.
 * 
 * @return {number}		the number of tabs
 */
DwtTabView.prototype.getNumTabs =
function() {
	return (this._tabs.length - 1);
};

/**
 * Gets the tab.
 * 
 * @param {string}		tabKey		the key for the tab
 *
 * @return {DwtTabViewPage}	the view tab
 * 
 * @see		#addTab
 */
DwtTabView.prototype.getTab =
function (tabKey) {
	return (this._tabs && this._tabs[tabKey])
		? this._tabs[tabKey]
		: null;
};

/**
 * Gets the tab bar.
 * 
 * @return {DwtTabBar}		the tab bar
 */
DwtTabView.prototype.getTabBar = function() {
	return this._tabBar;
};

/**
 * Gets the tab title.
 * 
 * @param {string}		tabKey		the tab key
 *
 * @return {string}		the title
 */
DwtTabView.prototype.getTabTitle =
function(tabKey) {
	return (this._tabs && this._tabs[tabKey])
		? this._tabs[tabKey]["title"]
		: null;
};

/**
 * Gets the tab button.
 * 
 * @param {string}		tabKey		the tab key
 *
 * @return {DwtTabButton}		the tab button
 */
DwtTabView.prototype.getTabButton =
function(tabKey) {
	return (this._tabs && this._tabs[tabKey])
		? this._tabs[tabKey]["button"]
		: null;
};

/**
 * Sets the tab view.
 * 
 * @param {string}						tabKey		the tab key
 * @param {DwtTabViewPage|AjxCallback}	tabView		 an instance of the tab view page or callback that returns an instance of {@link DwtTabViewPage}
 */
DwtTabView.prototype.setTabView =
function(tabKey, tabView) {
	var tab = this.getTab(tabKey);
	tab.view = tabView;
	if (tabView && !(tabView instanceof AjxCallback)) {
		this._pageEl.appendChild(tabView.getHtmlElement());
		tabView._tabKey = tabKey;
		if (tabKey == this._currentTabKey) {
			var tabGroup = tabView.getTabGroupMember();
			this._tabGroup.replaceMember(tab.tabGroup, tabGroup);
			tab.tabGroup = tabGroup;
		}
	}
};

/**
 * Gets the tab view.
 * 
 * @param {string}		tabKey		the tab key
 *
 * @return {DwtTabViewPage}		the tab view page
 */
DwtTabView.prototype.getTabView =
function(tabKey) {
	var tab = this.getTab(tabKey);
	var tabView = tab && tab.view;
	if (tabView instanceof AjxCallback) {
		var callback = tabView;
		tabView = callback.run(tabKey);
		this.setTabView(tabKey, tabView);
		var size = this._getTabSize();
		tabView.setSize(size.x, size.y);
		tabView.setAttribute('aria-labelledby', tab.button.getHTMLElId());
	}
	return tabView;
};

/**
 * Switches to the tab view.
 * 
 * @param {string}		tabKey		the tab key
 */
DwtTabView.prototype.switchToTab = 
function(tabKey) {
	var ntab = this.getTab(tabKey);
	if(ntab) {
		// remove old tab from tab-group
		var otab = this.getTab(this._currentTabKey);
		if (otab) {
			this._tabGroup.removeMember(otab.tabGroup);
		}
		// switch tab
		this._showTab(tabKey);
		this._tabBar.openTab(tabKey);
		// add new tab to tab-group
		if (!ntab.tabGroup && ntab.view) {
			ntab.tabGroup = ntab.view.getTabGroupMember();
		}
		this._tabGroup.addMember(ntab.tabGroup);
		// notify change
		if (this._eventMgr.isListenerRegistered(DwtEvent.STATE_CHANGE)) {
			this._eventMgr.notifyListeners(DwtEvent.STATE_CHANGE, this._stateChangeEv);
		}
	}
};

DwtTabView.prototype.setBounds =
function(x, y, width, height) {
	DwtComposite.prototype.setBounds.call(this, x, y, width, height);
	this._resetTabSizes(width, height);
};

DwtTabView.prototype.getActiveView =
function() {
	return this._tabs[this._currentTabKey].view;
};

DwtTabView.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_TAB_VIEW;
};

DwtTabView.prototype.resetKeyBindings =
function() {
	var kbm = this.shell.getKeyboardMgr();
	if (kbm.isEnabled()) {
		var kmm = kbm.__keyMapMgr;
		if (!kmm) { return; }
		var num = this.getNumTabs();
		var seqs = kmm.getKeySequences(DwtKeyMap.MAP_TAB_VIEW, "GoToTab");
		for (var k = 0; k < seqs.length; k++) {
			var ks = seqs[k];
			for (var i = 1; i <= num; i++) {
				var keycode = 48 + i;
				var newKs = ks.replace(/NNN/, keycode);
				kmm.setMapping(DwtKeyMap.MAP_TAB_VIEW, newKs, "GoToTab" + i);
			}
		}
		kmm.reloadMap(DwtKeyMap.MAP_TAB_VIEW);
	}
};

DwtTabView.prototype.handleKeyAction =
function(actionCode) {
	DBG.println(AjxDebug.DBG3, "DwtTabView.handleKeyAction");

	switch (actionCode) {

		case DwtKeyMap.NEXT_TAB:
			var curTab = this.getCurrentTab();
			if (curTab < this.getNumTabs()) {
				this.switchToTab(curTab + 1);
			}
			break;
			
		case DwtKeyMap.PREV_TAB:
			var curTab = this.getCurrentTab();
			if (curTab > 1) {
				this.switchToTab(curTab - 1);
			}
			break;
		
		default:
			// Handle action code like "GoToTab3"
			var m = actionCode.match(DwtKeyMap.GOTO_TAB_RE);
			if (m && m.length) {
				var idx = m[1];
				if ((idx <= this.getNumTabs()) && (idx != this.getCurrentTab())) {
					this.switchToTab(idx);
				}
			} else {
				return false;
			}
	}
	return true;
};


// Protected methods

DwtTabView.prototype._resetTabSizes =
function (width, height) {
	if (this._tabs && this._tabs.length) {
		for (var curTabKey in this._tabs) {
			var tabView = this._tabs[curTabKey].view;
			if (tabView && !(tabView instanceof AjxCallback)) {
				var contentHeight;
				contentHeight = contentHeight || height - Dwt.getSize(this._tabBarEl).y;
				tabView.resetSize(width, contentHeight);
			}	
		}
	}		
};

DwtTabView.prototype._getTabSize =
function() {
	var size = this.getSize();
	var width = size.x || this.getHtmlElement().clientWidth;
	var height = size.y || this.getHtmlElement().clientHeight;
	var tabBarSize = this._tabBar.getSize();
	var tabBarHeight = tabBarSize.y || this._tabBar.getHtmlElement().clientHeight;

	return new DwtPoint(width, (height - tabBarHeight));
};

DwtTabView.prototype._createHtml =
function(templateId) {
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, {id:this._htmlElId});
};

DwtTabView.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtComposite.prototype._createHtmlFromTemplate.call(this, templateId, data);

	this._tabBarEl = document.getElementById(data.id+"_tabbar");
	this._tabBar = new DwtTabBar(this);
	this._tabBar.reparentHtmlElement(this._tabBarEl);
	this._pageEl = document.getElementById(data.id+"_page");
};

DwtTabView.prototype._showTab = 
function(tabKey) {
	if (this._tabs && this._tabs[tabKey]) {
		this._currentTabKey = tabKey;
		this._hideAllTabs();						// hide all the tabs
		var tabView = this.getTabView(tabKey);		// make this tab visible
		if (tabView) {
			tabView.setVisible(true);
			tabView.showMe();
		}
	}
};

DwtTabView.prototype._hideAllTabs = 
function() {
	if (this._tabs && this._tabs.length) {
		for (var curTabKey in this._tabs) {
			var tabView = this._tabs[curTabKey].view;
			if (tabView && !(tabView instanceof AjxCallback)) {
				tabView.hideMe();
				//this._tabs[curTabKey]["view"].setZIndex(DwtTabView.Z_HIDDEN_TAB);
				Dwt.setVisible(tabView.getHtmlElement(), false);
			}	
		}
	}
};

DwtTabView.prototype._tabButtonListener = 
function (ev) {
	this.switchToTab(ev.item.getData("tabKey"));
};


//
// Class
//

/**
 * Creates a tab view page.
 * @constructor
 * @class
 * DwtTabViewPage abstract class for a page in a tabbed view.
 * Tab pages are responsible for creating their own HTML and populating/collecting
 * data to/from any form fields that they display.
 * 
 * @param {DwtComposite}	parent			the parent widget
 * @param {string}			className		the CSS class
 * @param {constant}		posStyle		the positioning style (see {@link DwtControl})
 * 
 * @extends DwtPropertyPage
 */
DwtTabViewPage = function(parent, className, posStyle, id) {
	if (arguments.length == 0) return;
	var params = Dwt.getParams(arguments, DwtTabViewPage.PARAMS);
	params.className = params.className || "ZTabPage";
	params.posStyle = params.posStyle || DwtControl.ABSOLUTE_STYLE;
	params.id = id || null;
	this._rendered = true; // by default UI creation is not lazy

	DwtPropertyPage.call(this, params);

	this._createHtml();
	this.getHtmlElement().style.overflowY = "auto";
	this.getHtmlElement().style.overflowX = "visible";
	if (params.contentTemplate) {
		this.getContentHtmlElement().innerHTML = AjxTemplate.expand(params.contentTemplate, this._htmlElId);
	}
};

DwtTabViewPage.prototype = new DwtPropertyPage;
DwtTabViewPage.prototype.constructor = DwtTabViewPage;

DwtTabViewPage.prototype.isDwtTabViewPage = true;
DwtTabViewPage.prototype.toString = function() { return "DwtTabViewPage"; };

DwtTabViewPage.prototype.role = 'tabpanel';


DwtTabViewPage.prototype.TEMPLATE = "dwt.Widgets#ZTabPage";

DwtTabViewPage.PARAMS = DwtPropertyPage.PARAMS.concat("contentTemplate");

// Public methods

/**
 * Gets the content HTML element.
 * 
 * @return {Element}	the element
 */
DwtTabViewPage.prototype.getContentHtmlElement =
function() {
	return this._contentEl || this.getHtmlElement();
};

/**
 * Shows the tab view page.
 * 
 */
DwtTabViewPage.prototype.showMe =
function() {
	this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
	this.setAttribute('aria-selected', true);
	if (this.parent.getHtmlElement().offsetHeight > 80) { 						// if parent visible, use offsetHeight
		this._contentEl.style.height=this.parent.getHtmlElement().offsetHeight-80;
	} else {
		var parentHeight = parseInt(this.parent.getHtmlElement().style.height);	// if parent not visible, resize page to fit parent
		var units = AjxStringUtil.getUnitsFromSizeString(this.parent.getHtmlElement().style.height);
		if (parentHeight > 80) {
			this._contentEl.style.height = (Number(parentHeight-80).toString() + units);
		}
	}

	this._contentEl.style.width = this.parent.getHtmlElement().style.width;	// resize page to fit parent
};

/**
 * Hides the tab view page.
 */
DwtTabViewPage.prototype.hideMe = 
function() {
	this.setZIndex(DwtTabView.Z_HIDDEN_TAB);
	this.setAttribute('aria-selected', false);
};

/**
 * Resets the size.
 * 
 * @param {number|string}		newWidth		the width of the control (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 * @param {number|string}		newHeight		the height of the control (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 */
DwtTabViewPage.prototype.resetSize =
function(newWidth, newHeight) {
	this.setSize(newWidth, newHeight);
};


// Protected methods

DwtTabViewPage.prototype._createHtml =
function(templateId) {
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, {id:this._htmlElId});
};

DwtTabViewPage.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtPropertyPage.prototype._createHtmlFromTemplate.call(this, templateId, data);
	this._contentEl = document.getElementById(data.id+"_content") || this.getHtmlElement();
};


//
// Class
//

/**
 * Creates a tab bar.
 * @constructor
 * @class
 * This class represents the tab bar, which is effectively a tool bar.
 * 
 * @param {DwtComposite}		parent			the parent widget
 * @param {string}				tabCssClass		the tab CSS class
 * @param {string}				btnCssClass		the button CSS class
 * 
 * @extends DwtToolBar
 */
DwtTabBar = function(parent, tabCssClass, btnCssClass) {
	if (arguments.length == 0) return;

	this._buttons = [];
	this._btnStyle = btnCssClass || "ZTab"; 									// REVISIT: not used
	this._btnImage = null;
	this._currentTabKey = 1;
	var myClass = tabCssClass || "ZTabBar";

	DwtToolBar.call(this, {parent:parent, className:myClass, posStyle:DwtControl.STATIC_STYLE});

	//Temp solution for bug 55391 
	//It is caused by float attribute in the td. The best solution is just as the main tab. No td
	//wrap the div. And this modification shouldn't affect the subclasses DwtTabBarFloat, otherwise, the _CASE_ 
	//xform item will be affect.
	//To do: modify it as the same as main tab
	if(AjxEnv.isFirefox){
		if(this._prefixEl && this.constructor == DwtTabBar)
			this._prefixEl.style.cssFloat = "none";
	}
};

DwtTabBar.prototype = new DwtToolBar;
DwtTabBar.prototype.constructor = DwtTabBar;


// Constants

DwtTabBar.prototype.TEMPLATE = "dwt.Widgets#ZTabBar";


// Public methods

DwtTabBar.prototype.toString =
function() {
	return "DwtTabBar";
};

/**
 * Gets the current tab.
 * 
 * @return {string}		the tab key
 */
DwtTabBar.prototype.getCurrentTab =
function() {
	return this._currentTabKey;
};

/**
 * Adds a state change listener.
 * 
 * @param {AjxListener}		listener		the listener
 */
DwtTabBar.prototype.addStateChangeListener =
function(listener) {
	this._eventMgr.addListener(DwtEvent.STATE_CHANGE, listener);
};

/**
 * Removes a state change listener.
 * 
 * @param {AjxListener}		listener		the listener
 */
DwtTabBar.prototype.removeStateChangeListener = 
function(listener) {
	this._eventMgr.removeListener(DwtEvent.STATE_CHANGE, listener);
};

/**
 * Adds a selection listener.
 * 
 * @param {string}			tabKey		the id used to create tab button in {@link DwtTabBar.addButton}
 * @param {AjxListener}		listener	the listener
 */
DwtTabBar.prototype.addSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].addSelectionListener(listener);
};

/**
 * Removes a selection listener.
 * 
 * @param {string}			tabKey		the id used to create tab button in {@link DwtTabBar.addButton}
 * @param {AjxListener}		listener	the listener
 */
DwtTabBar.prototype.removeSelectionListener =
function(tabKey, listener) {
	this._buttons[tabKey].removeSelectionListener(listener);
};

/**
 * Adds a button.
 * 
 * @param {string}		tabKey		the the tab key
 * @param {string}		tabTitle	the tab title
 * @param {string}		id			the id
 * @param {number}		index		the index
 *
 * @return {DwtTabButton}		the newly added button
 */
DwtTabBar.prototype.addButton =
function(tabKey, tabTitle, id, index) {
	var b = this._buttons[tabKey] = new DwtTabButton(this, id, index);
	
	this._buttons[tabKey].addSelectionListener(new AjxListener(this, DwtTabBar._setActiveTab));

	if (this._btnImage != null) {
		b.setImage(this._btnImage);
	}

	if (tabTitle != null) {
		b.setText(tabTitle);
	}

	b.setEnabled(true);
	b.setData("tabKey", tabKey);

	if (parseInt(tabKey) == 1) {
		this.openTab(tabKey, true);
	}

	// make sure that new button is selected properly
	var sindex = this.__getButtonIndex(this._currentTabKey);
	if (sindex != -1) {
		var nindex = this.__getButtonIndex(tabKey);
		if (nindex == sindex + 1) {
			Dwt.addClass(b.getHtmlElement(), DwtTabBar.SELECTED_NEXT);
		}
	}

	return b;
};

/**
 * Gets the button.
 * 
 * @param {string}		tabKey		the id used to create tab button in {@link DwtTabBar.addButton}
 *
 * @return {DwtTabButton}		the button
 */
DwtTabBar.prototype.getButton = 
function (tabKey) {
	return (this._buttons[tabKey])
		? this._buttons[tabKey]
		: null;
};

/**
 * Opens the tab.
 *
 * @param {string}		tabKey			the id used to create tab button in {@link DwtTabBar.addButton}
 * @param {boolean}		skipNotify		if <code>true</code>, do not notify listeners
 */
DwtTabBar.prototype.openTab = 
function(tabK, skipNotify) {
	this._currentTabKey = tabK;
	var cnt = this._buttons.length;

	for (var ix = 0; ix < cnt; ix ++) {
		if (ix==tabK) { continue; }

		var button = this._buttons[ix];
		if (button) {
			this.__markPrevNext(ix, false);
			button.setClosed();
		}
	}

	var button = this._buttons[tabK];
	if (button) {
		button.setOpen();
		this.__markPrevNext(tabK, true);
	}

	if (!skipNotify && this._eventMgr.isListenerRegistered(DwtEvent.STATE_CHANGE)) {
		this._eventMgr.notifyListeners(DwtEvent.STATE_CHANGE, this._stateChangeEv);
	}
};

/**
 * Greg Solovyev 1/4/2005 
 * changed ev.target.offsetParent.offsetParent to
 * lookup for the table up the elements stack, because the mouse down event may come from the img elements 
 * as well as from the td elements.
 * 
 * @private
 */
DwtTabBar._setActiveTab =
function(ev) {
	var tabK;
	if (ev && ev.item) {
		tabK=ev.item.getData("tabKey");
	} else if (ev && ev.target) {
		var elem = ev.target;
		while (elem.tagName != "TABLE" && elem.offsetParent )
			elem = elem.offsetParent;

		tabK = elem.getAttribute("tabKey");
		if (tabK == null)
			return false;
	} else {
		return false;
	}
	this.openTab(tabK);
};


//
// Class
//

/**
 * Creates a tab button (i.e. a tab in a tab view).
 * @constructor
 * @class
 * This class represents the tab in a tab view.
 * 
 * @param {DwtComposite}		parent			the parent widget
 * @param {string}				id				the id
 * @param {number}				index			the index
 * @param {string}				className		the style class name
 * 
 * @extends DwtButton
 */
DwtTabButton = function(parent, id, index, className) {
	if (arguments.length == 0) return;
	var tabStyle = className || "ZTab";
	DwtButton.call(this, {parent:parent, className:tabStyle, id:id, index:index});
};

DwtTabButton.prototype = new DwtButton;
DwtTabButton.prototype.constructor = DwtTabButton;

DwtTabButton.prototype.TEMPLATE = "dwt.Widgets#ZTab";

DwtTabButton.prototype.isDwtTabButton = true;
DwtTabButton.prototype.toString = function() { return "DwtTabButton"; };

DwtTabButton.prototype.role = 'tab';

// Public methods


/**
 * Changes the visual appearance to active tab.
 */
DwtTabButton.prototype.setOpen = 
function() {
	this._isSelected = true;
	this.setDisplayState(DwtControl.SELECTED);
};

/**
 * Changes the visual appearance to inactive tab.
 */
DwtTabButton.prototype.setClosed =
function() {
	this._isSelected = false;
	this.setDisplayState(DwtControl.NORMAL);
};

DwtTabButton.prototype.setDisplayState = function(state) {
	if (this._isSelected && state != DwtControl.SELECTED) {
		state = [ DwtControl.SELECTED, state ].join(" ");
	}
	DwtButton.prototype.setDisplayState.call(this, state);
};


/**
 * @class
 * @constructor
 * 
 * @param {DwtComposite}		parent			the parent widget
 * @param {string}				tabCssClass		the tab CSS class
 * @param {string}				btnCssClass		the button CSS class
 *
 * @extends DwtTabButton
 * 
 * @private
 */
DwtTabBarFloat = function(parent, tabCssClass, btnCssClass) {
	if (arguments.length == 0) return;
	DwtTabBar.call(this,parent,tabCssClass,btnCssClass)
};

DwtTabBarFloat.prototype = new DwtTabBar;
DwtTabBarFloat.prototype.constructor = DwtTabBarFloat;

DwtTabBarFloat.prototype.TEMPLATE = "dwt.Widgets#ZTabBarFloat";

/**
 * Adds a button.
 * 
 * @param {string}		tabKey			the the tab key
 * @param {string}		tabTitle		the tab title
 * @param {string}		id				the id
 * 
 * @return {DwtTabButton}		the newly added button
 */
DwtTabBarFloat.prototype.addButton =
function(tabKey, tabTitle, id) {
	var b = this._buttons[tabKey] = new DwtTabButtonFloat(this, id);
	
	this._buttons[tabKey].addSelectionListener(new AjxListener(this, DwtTabBar._setActiveTab));

	if (this._btnImage != null) {
		b.setImage(this._btnImage);
	}

	if (tabTitle != null) {
		b.setText(tabTitle);
	}

	b.setEnabled(true);
	b.setData("tabKey", tabKey);

	if (parseInt(tabKey) == 1) {
		this.openTab(tabKey, true);
	}

	// make sure that new button is selected properly
	var sindex = this.__getButtonIndex(this._currentTabKey);
	if (sindex != -1) {
		var nindex = this.__getButtonIndex(tabKey);
		if (nindex == sindex + 1) {
			Dwt.addClass(b.getHtmlElement(), DwtTabBar.SELECTED_NEXT);
		}
	}

	return b;
};

DwtTabButtonFloat = function(parent, id) {
	DwtTabButton.call(this, parent,id, undefined, "ZTab");
};

DwtTabButtonFloat.prototype = new DwtTabButton;
DwtTabButtonFloat.prototype.constructor = DwtTabButtonFloat;

DwtTabButtonFloat.prototype.TEMPLATE = "dwt.Widgets#ZTabFloat";
}
if (AjxPackage.define("ajax.dwt.widgets.DwtAlert")) {
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

//
// Constructor
//

/**
 * Constructs a control that alerts the user to important information.
 * @class
 * This class represents an alert.
 * 
 * @param {DwtComposite}	parent    the parent container for this control
 * @param {string}	[className="DwtAlert"] the CSS class for this control
 * @param {Dwt.STATIC_STYLE|Dwt.ABSOLUTE_STYLE|Dwt.RELATIVE_STYLE|Dwt.FIXED_STYLE}	[posStyle] 	the position style of this control
 * 
 * @extends		DwtControl
 */
DwtAlert = function(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "DwtAlert";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtControl.call(this, {parent:parent, className:className, posStyle:posStyle});
	this._alertStyle = DwtAlert.INFORMATION;
	this._createHtml();
}

DwtAlert.prototype = new DwtControl;
DwtAlert.prototype.constructor = DwtAlert;

//
// Constants
//
/**
 * Defines the "information" style.
 */
DwtAlert.INFORMATION = 0;
/**
 * Defines the "warning" style.
 */
DwtAlert.WARNING = 1;
/**
 * Defines the "critical" style.
 */
DwtAlert.CRITICAL = 2;

/**
 * Defines the "success" style
 */
DwtAlert.SUCCESS = 3;

DwtAlert._ICONS = [
    AjxImg.getClassForImage("Information_32"),
    AjxImg.getClassForImage("Warning_32"),
    AjxImg.getClassForImage("Critical_32"),
    AjxImg.getClassForImage("Success")
];
DwtAlert._CLASSES = [
    "DwtAlertInfo",
    "DwtAlertWarn",
    "DwtAlertCrit",
    "DwtAlertWarn"    // Reuse for Success
];

DwtAlert._RE_ICONS = new RegExp(DwtAlert._ICONS.join("|"));
DwtAlert._RE_CLASSES = new RegExp(DwtAlert._CLASSES.join("|"));

//
// Data
//

DwtAlert.prototype.TEMPLATE = "dwt.Widgets#DwtAlert";

//
// Public methods
//

/**
 * Sets the style.
 * 
 * @param	{DwtAlert.INFORMATION|DwtAlert.WARNING|DwtAlert.CRITICAL|DwtAlert.SUCCESS}	style		the style
 */
DwtAlert.prototype.setStyle = function(style) {
	this._alertStyle = style || DwtAlert.INFORMATION;
	if (this._iconDiv) {
		Dwt.delClass(this._iconDiv, DwtAlert._RE_ICONS, DwtAlert._ICONS[this._alertStyle]);
	}
	Dwt.delClass(this.getHtmlElement(), DwtAlert._RE_CLASSES, DwtAlert._CLASSES[this._alertStyle]);
};

/**
 * Gets the style.
 * 
 * @return	{DwtAlert.INFORMATION|DwtAlert.WARNING|DwtAlert.CRITICAL|DwtAlert.SUCCESS}		the style
 */
DwtAlert.prototype.getStyle = function() {
	return this._alertStyle;
};

/**
 * Sets the icon visibility.
 * 
 * @param	{boolean}	visible		if <code>true</code>, the icon is visible
 */
DwtAlert.prototype.setIconVisible = function(visible) {
	if (this._iconDiv) {
		Dwt.setVisible(this._iconDiv, visible);
	}
};

/**
 * Gets the icon visibility.
 * 
 * @return	{boolean}	<code>true</code> if the icon is visible
 */
DwtAlert.prototype.getIconVisible = function() {
	return this._iconDiv ? Dwt.getVisible(this._iconDiv) : false;
};

/**
 * Sets the title.
 * 
 * @param	{string}	title	the title
 */
DwtAlert.prototype.setTitle = function(title) {
	this._alertTitle = title;
	if (this._titleDiv) {
		this._titleDiv.innerHTML = title || "";
	}
};

/**
 * Gets the title.
 * 
 * @return	{string}	the title
 */
DwtAlert.prototype.getTitle = function() {
	return this._alertTitle;
};

DwtAlert.prototype.setContent = function(content) {
	this._alertContent = content;
	if (this._contentDiv) {
		this._contentDiv.innerHTML = content || "";
	}
};
DwtAlert.prototype.getContent = function() {
	return this._alertContent;
};

DwtAlert.prototype.setDismissContent = function (dwtElement) {
    if (this._dismissDiv) {
        dwtElement.reparentHtmlElement(this._dismissDiv.id) ;
    }
}

//
// DwtControl methods
//

DwtAlert.prototype.getTabGroupMember = function() {
	// NOTE: This control is not tabbable
	return null;
};

//
// Protected methods
//

/**
 * @private
 */
DwtAlert.prototype._createHtml = function(templateId) {
	var data = { id: this._htmlElId };
	this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

/**
 * @private
 */
DwtAlert.prototype._createHtmlFromTemplate = function(templateId, data) {
	DwtControl.prototype._createHtmlFromTemplate.apply(this, arguments);
	this._iconDiv = document.getElementById(data.id+"_icon");
	this._titleDiv = document.getElementById(data.id+"_title");
	this._contentDiv = document.getElementById(data.id+"_content");
    this._dismissDiv = document.getElementById(data.id+"_dismiss") ;
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtPropertySheet")) {
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
DwtPropertySheet = function(parent, className, posStyle, labelSide) {
	if (arguments.length == 0) return;
	className = className || "DwtPropertySheet";
	DwtComposite.call(this, {parent:parent, className:className, posStyle:posStyle});

	this._labelSide = labelSide || DwtPropertySheet.DEFAULT;

	this._propertyIdCount = 0;
	this._propertyList = [];
	this._propertyMap = {};

	this._tabGroup = new DwtTabGroup(this.toString());

	this._tableEl = document.createElement("TABLE");
	this._tableEl.setAttribute('role', 'presentation');
	// Cellspacing needed for IE in quirks mode
	this._tableEl.cellSpacing = 6;

	var element = this.getHtmlElement();
	element.appendChild(this._tableEl);
	this._setAllowSelection();
}

DwtPropertySheet.prototype = new DwtComposite;
DwtPropertySheet.prototype.constructor = DwtPropertySheet;

DwtPropertySheet.prototype.toString = 
function() {
	return "DwtPropertySheet";
}

// Constants

DwtPropertySheet.RIGHT = "right";
DwtPropertySheet.LEFT = "left";
DwtPropertySheet.DEFAULT = DwtPropertySheet.LEFT;

// Data

DwtPropertySheet.prototype._labelCssClass = "Label";
DwtPropertySheet.prototype._valueCssClass = "Field";

// Public methods

/**
 * Adds a property.
 *
 * @param label [string] The property label. The value is used to set the
 *				inner HTML of the property label cell.
 * @param value The property value. If the value is an instance of DwtControl
 *				the element returned by <code>getHtmlElement</code> is used;
 *				if the value is an instance of Element, it is added directly;
 *				anything else is set as the inner HTML of the property value
 *				cell.
 * @param required [boolean] Determines if the property should be marked as
 *				   required. This is denoted by an asterisk next to the label.
 */
DwtPropertySheet.prototype.addProperty = function(label, value, required) {

	var index = this._tableEl.rows.length;

	var row = this._tableEl.insertRow(-1);
	row.vAlign = this._vAlign ? this._vAlign : "top";

	var labelId = Dwt.getNextId(),
		valueId = Dwt.getNextId(),
		tabValue;   // element or control that can be a tab group member

	if (this._labelSide == DwtPropertySheet.LEFT) {
		this._insertLabel(row, label, required, labelId, valueId);
		tabValue = this._insertValue(row, value, required, labelId, valueId);
	}
	else {
		this._insertValue(row, value, required, labelId, valueId);
		tabValue = this._insertLabel(row, label, required, labelId, valueId);
	}

	var id = this._propertyIdCount++;
	var property = {
		id:         id,
		index:      index,
		row:        row,
		visible:    true,
		labelId:    labelId,
		valueId:    valueId,
		tabValue:   tabValue
	};
	this._propertyList.push(property);
	this._propertyMap[id] = property;
	return id;
};

DwtPropertySheet.prototype._insertLabel = function(row, label, required, labelId, valueId) {

	var labelCell = row.insertCell(-1);
	labelCell.className = this._labelCssClass;
	labelCell.id = labelId;
	labelCell.setAttribute("for", valueId);
	if (this._labelSide != DwtPropertySheet.LEFT) {
		labelCell.width = "100%";
		labelCell.style.textAlign = "left";
	}
	labelCell.innerHTML = label;
	if (required) {
		var asterisk = this._tableEl.ownerDocument.createElement("SUP");
		asterisk.innerHTML = "*";
		labelCell.insertBefore(asterisk, labelCell.firstChild);
	}
};

DwtPropertySheet.prototype._insertValue = function(row, value, required, labelId, valueId) {

	var valueCell = row.insertCell(-1);
	valueCell.className = this._valueCssClass;
	valueCell.id = valueId;

	if (!value) {
		valueCell.innerHTML = "&nbsp;";
	}
	else if (value.isDwtControl) {
		valueCell.appendChild(value.getHtmlElement());
		this._tabGroup.addMember(value);
		var input = value.getInputElement && value.getInputElement();
		if (input) {
			input.setAttribute('aria-labelledby', labelId);
		}
	}
	else if (value.nodeType == AjxUtil.ELEMENT_NODE) {
		valueCell.appendChild(value);
		this._addTabGroupMemberEl(valueCell);
		value.setAttribute('aria-labelledby', labelId);
	}
	else {
		valueCell.innerHTML = String(value);
		this._addTabGroupMemberEl(valueCell);
		valueCell.setAttribute('aria-labelledby', labelId);
		value = valueCell;
	}

	return value;
};

/**
 * Add element's leaf children to tabgroup.
 *
 * @param element HTML element.
 */
DwtPropertySheet.prototype._addTabGroupMemberEl = function(element, isTabStop) {

	var obj = this;

	// recursive function to add leaf nodes
	function addChildren(el) {
		if (el.children.length > 0) {
			AjxUtil.foreach(el.children, function(child){
				addChildren(child);
			});
		}
		else {
			if (AjxUtil.isBoolean(isTabStop)) {
				obj.noTab = !isTabStop;
			}
			else {
				// add leaf to tabgroup
				obj._makeFocusable(el);
				obj._tabGroup.addMember(el);
			}
		}
	}

	addChildren(element, isTabStop);
};

DwtPropertySheet.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

DwtPropertySheet.prototype.getProperty = function(id) {
	return this._propertyMap[id];
};

DwtPropertySheet.prototype.removeProperty = function(id) {
	var prop = this._propertyMap[id];
	if (prop) {
		var propIndex = prop.index;
		if (prop.visible) {
			var tableIndex = this.__getTableIndex(propIndex);
			var row = this._tableEl.rows[tableIndex];
			row.parentNode.removeChild(row);
		}
		prop.row = null;
		for (var i = propIndex + 1; i < this._propertyList.length; i++) {
			this._propertyList[i].index--;
		}
		this._propertyList.splice(propIndex, 1);
		delete this._propertyMap[id];
	}
};

DwtPropertySheet.prototype.setPropertyVisible = function(id, visible) {

	var prop = this._propertyMap[id];
	if (prop && prop.visible !== visible) {
		prop.visible = visible;
		Dwt.setVisible(this._tableEl.rows[prop.index], visible);
		var tabValue = prop.tabValue;
		if (tabValue.isDwtControl) {
			tabValue.noTab = !visible;
		}
		else {
			this._addTabGroupMemberEl(tabValue, !visible)
		}
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtGrouper")) {
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
 * 
 * @private
 */
DwtGrouper = function(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "DwtGrouper";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, {parent:parent, posStyle:posStyle});

	this._labelEl = document.createElement("LEGEND");
	this._labelEl.id = Dwt.getNextId();
	this._insetEl = document.createElement("DIV");
	this._borderEl = document.createElement("FIELDSET");
	this._borderEl.appendChild(this._labelEl);
	this._borderEl.appendChild(this._insetEl);

	this._tabGroup = new DwtTabGroup(this.toString());

	var element = this.getHtmlElement();
	element.appendChild(this._borderEl);
}

DwtGrouper.prototype = new DwtComposite;
DwtGrouper.prototype.constructor = DwtGrouper;

// Public methods

DwtGrouper.prototype.setLabel = function(htmlContent) {
	Dwt.setVisible(this._labelEl, Boolean(htmlContent));
	// HACK: undo block display set by Dwt.setVisible
	this._labelEl.style.display = "";
	this._labelEl.innerHTML = htmlContent ? htmlContent : "";
};

DwtGrouper.prototype.setContent = function(htmlContent) {
	var element = this._insetEl;
	element.innerHTML = htmlContent;
	var inputElements = element.getElementsByTagName('input');
	for (var i=0; i < inputElements.length; i++) {
		this._tabGroup.addMember(inputElements[i]);
	}
};

DwtGrouper.prototype.setElement = function(htmlElement) {
	var element = this._insetEl;
	Dwt.removeChildren(element);
	element.appendChild(htmlElement);
};

DwtGrouper.prototype.setView = function(control) {
	this.setElement(control.getHtmlElement());
};

DwtGrouper.prototype.getInsetHtmlElement = function() {
	return this._insetEl;
};

DwtGrouper.prototype.getTabGroupMember = function(){
	return this._tabGroup;
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtProgressBar")) {
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
 * Creates a progress bar.
 * @constructor
 * @class
 * This class represents a progress bar.
 * 
 * @param {DwtComposite}	parent    the parent container
 * @param {string}	className the CSS class name
 * @param {constant}	posStyle  the position style (see {@link DwtControl})
 * 
 * @author Greg Solovyev
 * 
 * @extends		DwtComposite
 */
DwtProgressBar = function(parent, className, posStyle) {
	if (arguments.length == 0) return;
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, {parent:parent, posStyle:posStyle});
	this._maxValue = 100;
	this._value = 0;
	this._quotabarDiv = null;
	this._quotausedDiv = null;	

	this._progressBgColor = null;// "#66cc33";	//	MOW: removing this so the color can be skinned
												// 		set the color in the class "quotaused"
	this._progressCssClass = "quotaused";
	
	this._wholeBgColor = null;
	this._wholeCssClass = "quotabar";	
	this._createHTML();
}

DwtProgressBar.prototype = new DwtComposite;
DwtProgressBar.prototype.constructor = DwtProgressBar;


//
// Public methods
//

/**
 * Sets the progress background color.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setProgressBgColor = 
function(val) {
	this._progressBgColor = val;
}

/**
 * Sets the whole background color.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setWholeBgColor = 
function(val) {
	this._wholeBgColor = val;
}

/**
 * Sets the progress CSS class.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setProgressCssClass = 
function(val) {
	this._progressCssClass = val;
}

/**
 * Sets the whole CSS class.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setWholeCssClass = 
function(val) {
	this._wholeCssClass = val;
}

/**
 * Sets the process CSS style.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setProgressCssStyle = 
function(val) {
	this._progressCssStyle = val;
}

/**
 * Sets the while CSS style.
 * 
 * @param	{string}	var		the color
 */
DwtProgressBar.prototype.setWholeCssStyle  = 
function(val) {
	this._wholeCssStyle = val;
}

/**
 * Sets the progress value.
 * 
 * @param	{number}		val		the value
 */
DwtProgressBar.prototype.setValue = 
function(val) {
	this._value = parseInt(val);
	var percent;

	if(this._value == this._maxValue)
		percent = 100;
	else 
		percent = Math.min(Math.round((this._value / this._maxValue) * 100), 100);	

	if(isNaN(percent))
		percent = "0";
			
	if(!this._quotabarDiv) {
		this._quotabarDiv = document.createElement("div")
		if(this._wholeCssClass)
			this._quotabarDiv.className = this._wholeCssClass;

		if(this._wholeBgColor)
			this._quotabarDiv.backgroundColor = this._wholeBgColor;
		
		this._cell.appendChild(this._quotabarDiv);
	}
	if(!this._quotausedDiv) {
		this._quotausedDiv = document.createElement("div")
		if(this._progressCssClass)
			this._quotausedDiv.className = this._progressCssClass;
			
		if(this._progressBgColor)
			this._quotausedDiv.style.backgroundColor = this._progressBgColor;
			
		this._quotabarDiv.appendChild(this._quotausedDiv);			
	}	

	this._quotausedDiv.style.width = percent + "%";
}

/**
 * Sets the value by percentage.
 * 
 * @param	{string}		percent		the value as a percentage (for example: "10%")
 */
DwtProgressBar.prototype.setValueByPercent =
function (percent){
	this.setMaxValue(100);
	this.setValue (percent.replace(/\%/gi, ""));
}

/**
 * Gets the value.
 * 
 * @return	{number}	the value
 */
DwtProgressBar.prototype.getValue = 
function() {
	return this._value;
}

/**
 * Gets the maximum value.
 * 
 * @return	{number}	the maximum value
 */
DwtProgressBar.prototype.getMaxValue = 
function() {
	return this._maxValue;
}

/**
 * Sets the maximum value.
 * 
 * @param	{number}	val		the maximum value
 */
DwtProgressBar.prototype.setMaxValue = 
function(val) {
	this._maxValue = parseInt(val);
}

/**
 * Sets the label.
 * 
 * @param	{string}		text		the label
 * @param	{boolean}		isRightAlign	if <code>true</code>, if the label is right aligned
 */
DwtProgressBar.prototype.setLabel =
function( text, isRightAlign) {
	var labelNode = document.createTextNode(text);
	var position = isRightAlign ? -1 : 0;
	var labelCell = this._row.insertCell(position) ;
	labelCell.appendChild (labelNode);
}

//
// Protected methods
//

DwtProgressBar.prototype._createHTML = 
function() {
	this._table = document.createElement("table");
	this._table.border = this._table.cellpadding = this._table.cellspacing = 0;	
	this._table.setAttribute('role', 'presentation');

	this._row = this._table.insertRow(-1);

	//if(AjxEnv.isLinux)
		//this._row.style.lineHeight = 13;
	
	this._cell = this._row.insertCell(-1);
	
	this.getHtmlElement().appendChild(this._table);
}
}
if (AjxPackage.define("ajax.dwt.widgets.DwtPropertyEditor")) {
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
 * Generic Property Editor Widget.
 *
 * @author Mihai Bazon
 *
 * See initProperties() below
 * 
 * @extends		DwtComposite
 * @private
 */
DwtPropertyEditor = function(parent, useDwtInputField, className, posStyle, deferred) {
	if (arguments.length > 0) {
		if (!className)
			className = "DwtPropertyEditor";
		DwtComposite.call(this, {parent:parent, className:className, posStyle:posStyle, deferred:deferred});
		this._useDwtInputField = useDwtInputField != null ? useDwtInputField : true;
		this._schema = null;
		this._init();
	}
};

DwtPropertyEditor.MSG_TIMEOUT = 4000; // 4 seconds should be plenty

DwtPropertyEditor.MSG = {
	// Now these 2 are kind of pointless...
	// We should allow a message in the prop. object.
	mustMatch     : "This field does not match validators: REGEXP",
	mustNotMatch  : "This field matches anti-validators: REGEXP" // LOL
};

DwtPropertyEditor.prototype = new DwtComposite;
DwtPropertyEditor.prototype.constructor = DwtPropertyEditor;

DwtPropertyEditor.prototype.toString = function() { return "DwtPropertyEditor"; }

DwtPropertyEditor.prototype._init = function() {
	var div = document.createElement("div");
	div.id = this._relDivId = Dwt.getNextId();
	div.style.position = "relative";
	var table = document.createElement("table");
	table.setAttribute('role', 'presentation');
	table.id = this._tableId = Dwt.getNextId();
	table.cellSpacing = table.cellPadding = 0;
	table.appendChild(document.createElement("tbody"));
	div.appendChild(table);
	this.getHtmlElement().appendChild(div);
	this.maxLabelWidth = 0;
	this.maxFieldWidth = 0;
	this._setMouseEventHdlrs();
	this._onMouseDown = new AjxListener(this, this._onMouseDown);
	this.addListener(DwtEvent.ONMOUSEDOWN, this._onMouseDown);
};

DwtPropertyEditor.prototype.getRelDiv = function() {
	return document.getElementById(this._relDivId);
};

DwtPropertyEditor.prototype.getTable = function() {
	return document.getElementById(this._tableId);
};

DwtPropertyEditor.prototype._onMouseDown = function(event) {
	var target = event.target;
	var tag = target.tagName.toLowerCase();
	if (tag == "input") {
		event._stopPropagation = false;
		event._returnValue = true;
		return true;
	}
	if (this._currentInputField && !this._currentInputField.onblur()) {
		event._stopPropagation = true;
		event._returnValue = false;
		return false;
	}
	try {
		while (target && tag != "tr") {
			target = target.parentNode;
			tag = target.tagName.toLowerCase();
		}
		if (target && target.__msh_doMouseDown)
			target.__msh_doMouseDown(event);
	} catch(ex) {};
};

/**
 * Call this function to retrieve an object that contains all properties,
 * indexed by name.  Any "struct" property will map to an object that contains
 * its child properties.
 *
 * For the sample schema below (see comments on initProperties()), we would
 * retrieve an object like this (dots represent the edited value, or the
 * initial value if the property wasn't modified):
 *
 *  {
 *    userName : ... ,
 *    address  : {
 *                  street   : ... ,
 *                  country  : ... ,
 *               },
 *    age      : ... ,
 *    birthday : ...
 *  }
 */
DwtPropertyEditor.prototype.getProperties = function() {
	if (this._currentInputField)
		// make sure we get the value
		this._currentInputField.onblur();
	function rec(schema) {
		var prop = {}, tmp, n = schema.length;
		for (var i = 0; i < n; ++i) {
			tmp = schema[i];
			if (tmp.type == "struct")
				prop[tmp.name] = rec(tmp.children);
			else
				prop[tmp.name] = tmp.value;
		}
		return prop;
	};
	return rec(this._schema);
};

DwtPropertyEditor.prototype.validateData = function() {
	var valid = true;
	function rec(schema) {
		var tmp, n = schema.length;
		for (var i = 0; i < n; ++i) {
			tmp = schema[i];
			if (tmp.type == "struct")
				rec(tmp.children);
			else if (!tmp._validate())
				valid = false;
		}
	};
	rec(this._schema);
	return valid;
};

/** This function will initialize the Property Editor with a given schema and
 * property set.
 *
 *  @param schema - declares which properties/types are allowed; see below
 *  @param parent - parent schema, for subproperties
 *
 * "schema" is an object that maps property names to property declaration.
 * Here's an example of what I have in mind:
 *
 *  [
 *    {
 *      label        : "User Name",
 *      id           : "userName",
 *      type         : "string",
 *      value        : "",
 *      minLength    : 4,
 *      maxLength    : 8,
 *      mustMatch    : /^[a-z][a-z0-9_]+$/i,
 *      mustNotMatch : /^(admin|root|guest)$/i
 *    },
 *    {
 *      label     : "Address",
 *      id        : "address",
 *      type      : "struct",
 *      children  : [ // this is a nested schema definition
 *              { label : "Street", id: "street", type: "string" },
 *              { label  : "Country",
 *                id     : "country",
 *                type   : "enum",
 *                item : [
 							{ label : "US", value : "US" },
 							{ label : "UK", value : "UK" },
 							{ label : "KR", value : "KR" }
 						 ] 
 				}
 *      ]
 *    },
 *    {
 *      label     : "Age",
 *      id        : "age",
 *      type      : "integer",
 *      minValue  : 18,
 *      maxValue  : 80
 *    },
 *    {
 *      label     : "Birthday",
 *      id        : "birthday",
 *      type      : "date",
 *      minValue  : "YYYY/MM/DD"  // can we restrict the DwtCalendar?
 *    }
 *  ]
 *
 * The types we will support for now are:
 *
 *   - "number" / "integer" : Allows floating point numbers or integers only.
 *     Properties: "minValue", "maxValue".
 *
 *   - "string" : Allows any string to be inserted.  "minLength", "maxLength",
 *     "mustMatch", "mustNotMatch".
 *
 *   - "password" : Same as "string", only it's not displayed.
 *
 *   - "enum" : One of the strings listed in the value.
 *
 *   - "boolean" : Checkbox that yields string value of "true" and "false".
 *
 *   - "struct" : Composite property; doesn't have a value by itself, but has
 *     child properties (the "children" array) that are defined in the same way
 *     as a toplevel property.
 *
 * All types except "struct" will allow a "value" property which is expected
 * to be of a valid type that matches all validating properties (such as
 * minLength, etc.).  The value of this property will be displayed initially
 * when the widget is constructed.
 *
 * Also, all types will support a "readonly" property.
 */
DwtPropertyEditor.prototype.initProperties = function(schema, parent) {
	if (parent == null) {
		this._schema = schema;
		parent = null;
	}
	for (var i = 0; i < schema.length; ++i)
		this._createProperty(schema[i], parent);
};

DwtPropertyEditor.prototype._createProperty = function(prop, parent) {
	var level = parent ? parent._level + 1 : 0;
	var tr = this.getTable().firstChild.appendChild(document.createElement("tr"));

	// Initialize the "prop" object with some interesting attributes...
	prop._parent = parent;
	prop._level = level;
	prop._rowElId = tr.id = Dwt.getNextId();
	prop._propertyEditor = this;

	// ... and methods.
	for (var i in DwtPropertyEditor._prop_functions)
		prop[i] = DwtPropertyEditor._prop_functions[i];

	prop._init();

	// indent if needed
	tr.className = "level-" + level;

	if (prop.visible == "false")
		tr.className += " invisible";

	if (prop.readonly)
		tr.className += " readonly";

	if (prop.type != "struct") {
		tr.className += " " + prop.type;

		// this is a simple property, create a label and value cell.
		var tdLabel = document.createElement("td");
		tdLabel.className = "label";
		
		if(prop.type=="checkboxgroup"){
			tdLabel.className+=" grouplabel";
		}
		
		tr.appendChild(tdLabel);
		var html = AjxStringUtil.htmlEncode(prop.label || prop.name);
		if (prop.required)
			html += "<span class='DwtPropertyEditor-required'>*</span>";
		tdLabel.innerHTML = html;
		var tdField = document.createElement("td");
		tdField.className = "field";
		tr.appendChild(tdField);

		switch (prop.type) {
			case "boolean" : this._createCheckbox(prop, tdField); break;
		    case "enum"    : this._createDropDown(prop, tdField); break;
		    case "date"    : this._createCalendar(prop, tdField); break;
   		    case "checkboxgroup"	:	this._createCheckBoxGroup(prop,tdField); break;		    
		    default        :
			if (this._useDwtInputField)
				this._createInputField(prop, tdField);
			else {
				tdField.innerHTML = prop._makeDisplayValue();
				tr.__msh_doMouseDown = DwtPropertyEditor.simpleClosure(prop._edit, prop);
			}
			break;
		}

		prop._fieldCellId = tdField.id = Dwt.getNextId();
		// prop._labelCellId = tdLabel.id = Dwt.getNextId();

		if (tdLabel.offsetWidth > this.maxLabelWidth)
			this.maxLabelWidth = tdLabel.offsetWidth;
		if (tdField.offsetWidth > this.maxFieldWidth)
			this.maxFieldWidth = tdField.offsetWidth;
	} else {
		var td = document.createElement("td");
		td.colSpan = 2;
		tr.appendChild(td);
		td.className = "label";
		tr.className += " expander-collapsed";
		td.innerHTML = [ "<div>", AjxStringUtil.htmlEncode(prop.label), "</div>" ].join("");
		this.initProperties(prop.children, prop);
		tr.__msh_doMouseDown = DwtPropertyEditor.simpleClosure(prop._toggle, prop);
	}

	// collapsed by default
	if (level > 0) {
		tr.style.display = "none";
		parent._hidden = true;
	}
};

// <FIXME: this will create problems when the first property is a "struct">
DwtPropertyEditor.prototype.setFixedLabelWidth = function(w) {
	try {
		this.getTable().rows[0].cells[0].style.width = (w || this.maxLabelWidth) + "px";
	} catch(ex) {};
};

DwtPropertyEditor.prototype.setFixedFieldWidth = function(w) {
	try {
		this.getTable().rows[0].cells[1].style.width = (w || this.maxFieldWidth) + "px";
	} catch(ex) {};
};
// </FIXME>

DwtPropertyEditor.prototype._setCurrentMsgDiv = function(div) {
	this._currentMsgDiv = div;
	this._currentMsgDivTimer = setTimeout(
		DwtPropertyEditor.simpleClosure(this._clearMsgDiv, this),
		DwtPropertyEditor.MSG_TIMEOUT);
};

DwtPropertyEditor.prototype._clearMsgDiv = function() {
	try {
		this._stopMsgDivTimer();
	} catch(ex) {};
	var div = this._currentMsgDiv;
	if (div) {
		div.parentNode.removeChild(div);
		this._currentMsgDiv = div = null;
		this._currentMsgDivTimer = null;
	}
};

DwtPropertyEditor.prototype._stopMsgDivTimer = function() {
	if (this._currentMsgDivTimer) {
		clearTimeout(this._currentMsgDivTimer);
		this._currentMsgDivTimer = null;
	}
};

// This is bad.  We're messing with internals.  I think there should be an
// option in DwtComposite to specify the element where to add the child, rather
// than simply getHtmlElement().appendChild(child).
DwtPropertyEditor.prototype.addChild = function(child) {
	if (!this._currentFieldCell)
		DwtComposite.prototype.addChild.call(this, child);
	else {
		this._children.add(child);
		this._currentFieldCell.appendChild(child.getHtmlElement());
	}
};

DwtPropertyEditor.prototype._createCheckbox = function(prop, target) {

	var checkbox = document.createElement("input");
	checkbox._prop = prop;
	checkbox.id = prop.name;
	checkbox.type = 'checkbox';
	
	if (checkbox.attachEvent) {
		checkbox.attachEvent("onclick",prop._onCheckboxChange);
	}
    else if (checkbox.addEventListener) {
		checkbox.addEventListener("click", prop._onCheckboxChange, false);			
	}
	
	this._children.add(checkbox);
	target.appendChild(checkbox);
    if (prop.value == 'true')
		checkbox.checked = prop.value;
};

DwtPropertyEditor.prototype._createCheckBoxGroup = function(prop, target) {
	
	var div = document.createElement("div");
	div._prop = prop;
	div.id = prop.name;
	//div._prop._checkBox = [];
	prop._checkBox = [];
	div.appendChild(document.createTextNode(prop.value));
	
	var table = document.createElement("table");
	table.setAttribute('role', 'presentation');
	table.id = Dwt.getNextId();
	table.border=0;
	table.cellSpacing = table.cellPadding = 0;
	table.appendChild(document.createElement("tbody"));
	
	
	for(var i=0;i<prop.checkBox.length;i++){
	var tr = document.createElement("tr");

	var tdField1 = document.createElement("td");
	tdField1.className = "field";	
	var checkBox = this._createCheckboxForGroup(prop,prop.checkBox[i],tdField1);
	tr.appendChild(tdField1);
	
	checkBox._label = prop.checkBox[i].label;
	
	var tdField2 = document.createElement("td");
	tdField2.className = "field";
	tdField2.appendChild(document.createTextNode(prop.checkBox[i].label));
	tr.appendChild(tdField2);
	
	table.firstChild.appendChild(tr);	

//	div._prop._checkBox[i]=checkBox;
	prop._checkBox[i]=checkBox;
	}
	
	div.appendChild(table);
	
	this._children.add(div);
	target.appendChild(div);
	return div;
};

DwtPropertyEditor.prototype._createCheckboxForGroup = function(parent_prop,prop, target) {
	var checkbox = document.createElement("input");
	checkbox._prop = parent_prop;
	checkbox.id = prop.name;
	checkbox.type = 'checkbox';
	if (prop.value == 'true')
		checkbox.checked = prop.value;
		if (checkbox.attachEvent) {
		    checkbox.attachEvent("onclick", parent_prop._onCheckboxGroupChange);
		}
        else if (checkbox.addEventListener) {
		    checkbox.addEventListener("click", parent_prop._onCheckboxGroupChange, false);
		}
	this._children.add(checkbox);
	target.appendChild(checkbox);
	return checkbox;
};


DwtPropertyEditor.prototype._createDropDown = function(prop, target) {
	this._currentFieldCell = target;
	var item, sel,
		i       = 0,
		options = [],
		items   = prop.item;
	while (item = items[i])
		options[i++] = new DwtSelectOption(item.value,
						   item.value == prop.value,
						   item.label);
	prop._select = sel = new DwtSelect({parent:this, options:options});
	sel.addChangeListener(new AjxListener(prop, prop._onSelectChange));
	sel.addListener(DwtEvent.ONMOUSEDOWN, this._onMouseDown);
	this._currentFieldCell = null;
};

DwtPropertyEditor.prototype._createCalendar = function(prop, target) {
	this._currentFieldCell = target;
	var btn = new DwtButton({parent:this});
	this._currentFieldCell = null;

	btn.setText(prop._makeDisplayValue());
	var menu = new DwtMenu({parent:btn, style:DwtMenu.CALENDAR_PICKER_STYLE});
	menu.setAssociatedObj(btn);
	var cal = new DwtCalendar({parent:menu});
	var date = new Date();
	date.setTime(prop.value);
	cal.setDate(date);
	cal.setSize(150, "auto");
	cal.addSelectionListener(new AjxListener(prop, prop._onCalendarSelect));
	btn.setMenu(menu);

	prop._dateButton = btn;
	prop._dateCalendar = cal;
};

DwtPropertyEditor.DWT_INPUT_FIELD_TYPES = {
	"string"    : DwtInputField.STRING,
	"password"  : DwtInputField.PASSWORD,
	"integer"   : DwtInputField.INTEGER,
	"number"    : DwtInputField.FLOAT
};

DwtPropertyEditor.prototype._createInputField = function(prop, target) {
	this._currentFieldCell = target;
	var type = DwtPropertyEditor.DWT_INPUT_FIELD_TYPES[prop.type]
		|| DwtInputField.STRING;
	var field = new DwtInputField({parent: this, type: type, initialValue: prop.value, maxLen: prop.maxLength, rows: prop.rows});
	if (type == DwtInputField.INTEGER || type == DwtInputField.FLOAT) {
		field.setValidNumberRange(prop.minValue || null,
					  prop.maxValue || null);
		if (prop.decimals != null)
			field.setNumberPrecision(prop.decimals);
	}
	if (type == DwtInputField.STRING || type == DwtInputField.PASSWORD)
		field.setValidStringLengths(prop.minLength, prop.maxLength);
	if (prop.required)
		field.setRequired(true);
	this._currentFieldCell = null;
	prop._inputField = field;
	field.setValue(prop.value);
	if (prop.readonly)
		field.setReadOnly(true);
	field.setValidationCallback(new AjxCallback(prop, prop._onDwtInputFieldValidated));
};

// these will be merged to each prop object that comes in the schema
DwtPropertyEditor._prop_functions = {

	_init : function() {
		this.type != null || (this.type = "string");
		this.value != null || (this.value = "");
		this._initialVal = this.value;

		if (this.type == "date") {
			if (!this.value) {
// 				var tmp = new Date();
// 				tmp.setHours(0);
// 				tmp.setMinutes(0);
// 				tmp.setSeconds(0);
				this.value = new Date().getTime();
			}
			if (!this.format)
				this.format = AjxDateUtil.getSimpleDateFormat().toPattern();
		}
	},

	_modified : function() {
		return this._initialVal != this.value;
	},

	_getRowEl : function() {
		return document.getElementById(this._rowElId);
	},

	_makeDisplayValue : function() {
		var val = this._getValue();
		switch (this.type) {
		    case "password" :
			val = val.replace(/./g, "*");
			break;
		    case "date" :
			var date = new Date();
			date.setTime(val);
			val = AjxDateFormat.format(this.format, date);
			break;
		}
		if (val == "")
			val = "<br />";
		else
			val = AjxStringUtil.htmlEncode(String(val));
		return val;
	},

	_display : function(visible) {
		var
			c = this.children,
			d = visible ? "" : "none";
		if (c) {
			var i = c.length;
			while (--i >= 0) {
				c[i]._getRowEl().style.display = d;
				if (!visible)
					c[i]._display(false);
			}
			this._hidden = !visible;

			// change the class name accordingly
			var tr = this._getRowEl();
			tr.className = tr.className.replace(
				/expander-[^\s]+/,
				visible ? "expander-expanded" : "expander-collapsed");
		}
	},

	_toggle : function() { this._display(this._hidden); },

	_edit : function() {
		// Depending on the type, this should probably create different
		// fields for editing.  For instance, in a "date" property we
		// would want a calendar, while in a "list" property we would
		// want a drop-down select box.

		if (this.readonly)
			return;

		switch (this.type) {
		    case "string" :
		    case "number" :
		    case "integer" :
		    case "password" :
			setTimeout(
				DwtPropertyEditor.simpleClosure(
					this._createInputField, this), 50);
			break;

// 		    default :
// 			alert("We don't support this type yet");
		}
	},

	_createInputField : function() {
		var	pe     = this._propertyEditor;
		var td     = document.getElementById(this._fieldCellId);
		var canvas = pe.getRelDiv();
		var input  = document.createElement("input");

		input.className = "DwtPropertyEditor-input " + this.type;
		input.setAttribute("autocomplete", "off");

		input.type = this.type == "password"
			? "password"
			: "text";

		var left = td.offsetLeft, top = td.offsetTop;
		if (AjxEnv.isGeckoBased) {
			--left;
			--top;
		}
		input.style.left = left + "px";
		input.style.top = top + "px";
		input.style.width = td.offsetWidth + 1 + "px";
		input.style.height = td.offsetHeight + 1 + "px";

		input.value = this._getValue();

		canvas.appendChild(input);
		input.focus();

		input.onblur = DwtPropertyEditor.simpleClosure(this._saveInput, this);
		input.onkeydown = DwtPropertyEditor.simpleClosure(this._inputKeyPress, this);

		this._propertyEditor._currentInputField = this._inputField = input;
		if (!AjxEnv.isGeckoBased)
			input.select();
		else
			input.setSelectionRange(0, input.value.length);
	},

	_getValue : function() {
		return this.value || "";
	},

	_checkValue : function(val) {
		var empty = val == "";

		if (empty) {
			if (!this.required)
				return val;
			this._displayMsg(AjxMsg.valueIsRequired);
			return null;
		}

		if (this.maxLength != null && val.length > this.maxLength) {
			this._displayMsg(AjxMessageFormat.format(AjxMsg.stringTooLong, this.maxLength));
			return null;
		}

		if (this.minLength != null && val.length < this.minLength) {
			this._displayMsg(AjxMessageFormat.format(AjxMsg.stringTooShort, this.minLength));
			return null;
		}

		if (this.mustMatch && !this.mustMatch.test(val)) {
			this._displayMsg(this.msg_mustMatch ||
					 DwtPropertyEditor.MSG.mustMatch.replace(
						 /REGEXP/, this.mustMatch.toString()));
			return null;
		}

		if (this.mustNotMatch && this.mustNotMatch.test(val)) {
			this._displayMsg(this.msg_mustNotMatch ||
					 DwtPropertyEditor.MSG.mustNotMatch.replace(
						 /REGEXP/, this.mustNotMatch.toString()));
			return null;
		}

		switch (this.type) {
		    case "integer" :
		    case "number" :
			var n = new Number(val);
			if (isNaN(n)) {
				this._displayMsg(AjxMsg.notANumber);
				return null;
			}
			if (this.type == "integer" && Math.round(n) != n) {
				this._displayMsg(AjxMsg.notAnInteger);
				return null;
			}
			if (this.minValue != null && n < this.minValue) {
				this._displayMsg(AjxMessageFormat.format(AjxMsg.numberLessThanMin, this.minValue));
				return null;
			}
			if (this.maxValue != null && n > this.maxValue) {
				this._displayMsg(AjxMessageFormat.format(AjxMsg.numberMoreThanMax, this.maxValue));
				return null;
			}
			val = n;
			if (this.type == "number" && this.decimals != null) {
				var str = val.toString();
				var pos = str.indexOf(".");
				if (pos == -1)
					pos = str.length;
				val = val.toPrecision(pos + this.decimals);
			}
			break;
		}
		return val;
	},

	_displayMsg : function(msg) {
		var x, y, w, h;
		var pe  = this._propertyEditor;
		var div = pe._currentMsgDiv;

		if (!div) {
			div = document.createElement("div");
			div.className = "DwtPropertyEditor-ErrorMsg";
			pe.getRelDiv().appendChild(div);
		} else
			pe._stopMsgDivTimer();
		div.style.visibility = "hidden";
		div.innerHTML = AjxStringUtil.htmlEncode(msg);
		// position & size
		var table = pe.getTable();
		w = table.offsetWidth; // padding & border!
		if (!AjxEnv.isIE)
			w -= 12;
		x = table.offsetLeft;
		div.style.left = x + "px";
		div.style.width = w + "px";
		h = div.offsetHeight;
		var td = document.getElementById(this._fieldCellId);
		y = td.offsetTop + td.offsetHeight;
		if (y + h > table.offsetTop + table.offsetHeight)
			y = td.offsetTop - h;
		div.style.top = y + "px";
		div.style.visibility = "";
		pe._setCurrentMsgDiv(div);
	},

	_saveInput : function() {
		var input = this._inputField;
		var val = this._checkValue(input.value);
		if (val != null) {
			this._setValue(val);
			input.onblur = input.onkeyup = input.onkeydown = input.onkeypress = null;
			var td = document.getElementById(this._fieldCellId);
			td.innerHTML = this._makeDisplayValue();
			this._inputField = null;
			this._propertyEditor._currentInputField = null;
			this._propertyEditor._clearMsgDiv();
			input.parentNode.removeChild(input);
			return true;
		} else {
			if (input.className.indexOf(" DwtPropertyEditor-input-error") == -1)
				input.className += " DwtPropertyEditor-input-error";
			input.focus();
			return false;
		}
	},

	_inputKeyPress : function(ev) {
		ev || (ev = window.event);
		var input = this._inputField;
		if (ev.keyCode == 13) {
			this._saveInput();
		} else if (ev.keyCode == 27) {
			input.value = this._getValue();
			this._saveInput();
		} else {
			this._propertyEditor._clearMsgDiv();
			input.className = input.className.replace(/ DwtPropertyEditor-input-error/, "");
		}
	},

	_onCheckboxChange : function(ev) {
		ev || (ev = window.event);
		var el = AjxEnv.isIE ? ev.srcElement : ev.target;
		el._prop._setValue(el.checked ? "true" : "false");
	},

	_onSelectChange : function() {
		this._setValue(this._select.getValue());
	},

	_onCheckboxGroupChange	:	function(ev) {
		ev || (ev = window.event);
		var el = AjxEnv.isIE ? ev.srcElement : ev.target;
		var chkBxs=el._prop._checkBox;
		var val = [];
		for(var i=0;i<chkBxs.length;i++){
			if(chkBxs[i].checked){
				val.push(chkBxs[i]._label);
			}
		}
		el._prop._setValue(val);
	},	

	_onCalendarSelect : function() {
		this._setValue(this._dateCalendar.getDate().getTime());
		this._dateButton.setText(this._makeDisplayValue());
	},

	_onDwtInputFieldValidated : function(dwtField, validated, value) {
		if (validated)
			this._setValue(value);
	},

	_setValue : function(val) {
		this.value = val;
		var tr = this._getRowEl();
		tr.className = tr.className.replace(/ dirty/, "");
		if (this._modified())
			tr.className += " dirty";
	},

	_validate : function() {
		if (this._inputField) {
			if (this._inputField instanceof DwtInputField)
				return this._inputField.validate();
			else
				return this._inputField.onblur();
		} else
			return true;
	}
};

// Since we don't like nested functions...
DwtPropertyEditor.simpleClosure = function(func, obj) {
	return function() { return func.call(obj, arguments[0]); };
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtConfirmDialog")) {
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
 * Creates a confirmation dialog.
 * @class
 * This class represents a confirmation dialog.
 * 
 * @param {DwtComposite}	parent  the parent widget (the shell)
 * @param {string}		className  the CSS class
 * 
 * @extends		DwtDialog
 */
DwtConfirmDialog = function(parent, className, id, buttons, extraButtons) {
	if (arguments.length == 0) return;

    if(!buttons){
	buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON, DwtDialog.CANCEL_BUTTON ];
    }
	DwtDialog.call(this, {parent:parent, className:className || "DwtConfirmDialog", title:AjxMsg.confirmTitle, standardButtons:buttons, id:id, extraButtons:extraButtons});
	
	this._questionDiv = document.createElement("DIV");
	this._questionDiv.className = "DwtConfirmDialogQuestion";
	this._getContentDiv().appendChild(this._questionDiv);
	
	this.registerCallback(DwtDialog.YES_BUTTON, this._handleYesButton, this);
	this.registerCallback(DwtDialog.NO_BUTTON, this._handleNoButton, this);
	this.registerCallback(DwtDialog.CANCEL_BUTTON, this._handleCancelButton, this);
}
DwtConfirmDialog.prototype = new DwtDialog;
DwtConfirmDialog.prototype.constructor = DwtConfirmDialog;

DwtConfirmDialog.prototype.toString =
function() {
	return "DwtConfirmDialog";
};


// Public methods

/**
 * Pops up the confirmation dialog. The caller passes in the confirmation
 * question and callbacks for the Yes, No, and Cancel buttons.
 * <p>
 * <strong>Note:</strong>
 * If the callback for the No button is not specified, the confirmation
 * dialog assumes that the caller is only concerned with a Yes response
 * and hides the (presumably) extraneous Cancel button.
 * 
 * @param	{string}	questionHtml		the question HTML
 * @param	{AjxCallback}	yesCallback		the "yes" button callback
 * @param	{AjxCallback}	noCallback		the "no" button callback
 * @param	{AjxCallback}	cancelCallback		the "cancel" button callback
 * @param	{DwtPoint}	loc			the location
 */
DwtConfirmDialog.prototype.popup = 
function(questionHtml, yesCallback, noCallback, cancelCallback, loc) {
	this._questionDiv.innerHTML = questionHtml || "";
	
	this._yesCallback = yesCallback;
	this._noCallback = noCallback;
	this._cancelCallback = cancelCallback;
	
	this.setButtonVisible(DwtDialog.CANCEL_BUTTON, Boolean(noCallback));
	
	DwtDialog.prototype.popup.call(this, loc);
};

DwtConfirmDialog.prototype.popdown =
function() {
	this._yesCallback = this._noCallback = this._cancelCallback = null;
	DwtDialog.prototype.popdown.call(this);
};

// Protected methods

DwtConfirmDialog.prototype._handleYesButton =
function(ev) {
	if (this._yesCallback) this._yesCallback.run(ev);
	this.popdown();
};

DwtConfirmDialog.prototype._handleNoButton =
function(ev) {
	if (this._noCallback) this._noCallback.run(ev);
	this.popdown();
};

DwtConfirmDialog.prototype._handleCancelButton =
function(ev) {
	if (this._cancelCallback) this._cancelCallback.run(ev);
	this.popdown();
};

DwtConfirmDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtSpinner")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/**
 * Creates a spinner control.
 * @constructor
 * @class
 * Represents a entry field for entering numeric values.  Has 2 arrow buttons
 * that can be used to increment or decrement the current value with a step
 * that can be specified.
 *
 * <h4>CSS</h4>
 * <ul>
 * <li><code>DwtSpinner</code>              -- a table that contains the spinner elements
 * <li><code>DwtSpinner-inputCell</code>    -- the TD that holds the input field
 * <li><code>DwtSpinner-btnCell</code>      -- a DIV holding the 2 arrow buttons
 * <li><code>DwtSpinner-upBtn</code>        -- the DIV button for increment operation
 * <li><code>DwtSpinner-downBtn</code>      -- the DIV button for decrement operation
 * <li><code>DwtSpinner-up-pressed</code>   -- upBtn while pressed
 * <li><code>DwtSpinner-down-pressed</code> -- downBtn while pressed
 * <li><code>DwtSpinner-disabled</code>     -- the table gets this class added when the widget is disabled
 * </ul>
 * 
 * @param	{hash}	params		a hash of parameters
 * @param {DwtComposite} params.parent 	the parent widget
 * @param {string} params.className the class name for the containing DIV (see {@link DwtControl})
 * @param {string} params.posStyle 	the positioning style (see {@link DwtControl})
 * @param {number} params.max 	the maximum value
 * @param {number} params.min 	the minimum value
 * @param {number} params.size 	size of the input field, as in <code>&lt;input size="X"&gt;</code>
 * @param {number} params.value the original value of the input field
 * @param {number} params.maxLen the maximum length of the text in the input field
 * @param {number} params.step 	the amount to add or substract when the arrow buttons are pressed
 * @param {number} [params.decimals=0] Number of decimal digits.  Specify 0 to allow only
 *                 integers (default). Pass <code>null</code> to allow float numbers but
 *                 not enforce decimals.
 * @param {string} [params.align="right"] 	the align of the input field text (see <code>dwt.css</code>)
 *
 * @author Mihai Bazon
 * 
 * @extends DwtControl
 */
DwtSpinner = function(params) {
	if (arguments.length == 0) return;
	DwtControl.call(this, { parent        : params.parent,
                                className     : params.className,
                                posStyle      : params.posStyle,
                                parentElement : params.parentElement
                              });

	// setup arguments
	this._maxValue      = params.max  != null ? params.max  : null;
	this._minValue      = params.min  != null ? params.min  : null;
	this._fieldSize     = params.size != null ? params.size : 3;
	this._origValue     = params.value     || 0;
	this._maxLen        = params.maxLen    || null;
	this._step          = params.step      || 1;
	this._decimals      = 'decimals' in params ? params.decimals : 0;
	this._align         = params.align     || null;

	// timerFunc is a closure that gets called upon timeout when the user
	// presses and holds the mouse button
	this._timerFunc = AjxCallback.simpleClosure(this._timerFunc, this);

	// upon click and hold we capture mouse events
	this._btnPressCapture = new DwtMouseEventCapture({
		targetObj:this,
		id:"DwtSpinner",
		mouseUpHdlr:AjxCallback.simpleClosure(this._stopCapture, this)
	});

	this._createElements();
};

DwtSpinner.prototype = new DwtControl;
DwtSpinner.prototype.constructor = DwtSpinner;

DwtSpinner.INIT_TIMER = 250;
DwtSpinner.SLOW_TIMER = 125;
DwtSpinner.FAST_TIMER = 33;

DwtSpinner.prototype._createElements = function() {
	var div = this.getHtmlElement();
	var id = Dwt.getNextId();
	this._idField = id;
	this._idUpButton = id + "-up";
	this._idDownButton = id + "-down";
	var html = [ "<table class='DwtSpinner' cellspacing='0' cellpadding='0'>",
		     "<tr><td rowspan='2' class='DwtSpinner-inputCell'>", "<input id='", id, "' autocomplete='off' />", "</td>",
		     "<td unselectable id='", this._idUpButton, "' class='DwtSpinner-upBtn'><div class='ImgUpArrowSmall'>&nbsp;</div></td>",
		     "</tr><tr>",
		     "<td unselectable id='", this._idDownButton, "' class='DwtSpinner-downBtn'><div class='ImgDownArrowSmall'>&nbsp;</div></td>",
		     "</tr></table>" ];


// 		     "<td><div class='DwtSpinner-btnCell'>",
// 		     "<div unselectable class='DwtSpinner-upBtn' id='", this._idUpButton, "'><div class='ImgUpArrowSmall'>&nbsp;</div></div>",
// 		     "<div unselectable class='DwtSpinner-downBtn' id='", this._idDownButton, "'><div class='ImgDownArrowSmall'>&nbsp;</div></div>",
// 		     "</div></td></tr></table>" ];
	div.innerHTML = html.join("");

	var b1 = this._getUpButton();
	b1.onmousedown = AjxCallback.simpleClosure(this._btnPressed, this, "Up");
	var b2 = this._getDownButton();
	b2.onmousedown = AjxCallback.simpleClosure(this._btnPressed, this, "Down");
// 	if (AjxEnv.isIE) {
// 		b1.ondblclick = b1.onmousedown;
// 		b2.ondblclick = b2.onmousedown;
//	}
// 	if (AjxEnv.isIE && b1.offsetHeight == 1) {
// 		// we must correct button heights for IE
// 		div = b1.parentNode;
// 		var td = div.parentNode;
// 		div.style.height = td.offsetHeight + "px";
// // 		b1.style.height = b2.style.height = td.offsetHeight / 2 + "px";
// // 		b2.style.top = "";
// // 		b2.style.bottom = "0px";
// 	}
	var input = this.getInputElement();
	if (this._maxLen)
		input.maxLength = this._maxLen;
	if (this._fieldSize)
		input.size = this._fieldSize;
	if (this._align)
		input.style.textAlign = this._align;
	if (this._origValue != null)
		this.setValue(this._origValue);

	input.onblur = AjxCallback.simpleClosure(this.setValue, this, null);
	input[(AjxEnv.isIE || AjxEnv.isOpera) ? "onkeydown" : "onkeypress"]
		= AjxCallback.simpleClosure(this.__onKeyPress, this);
};

DwtSpinner.prototype._getValidValue = function(val) {
	var n = parseFloat(val);
	if (isNaN(n) || n == null)
		n = this._lastValidValue; // note that this may be string
	if (n == null)
		n = this._minValue || 0;
	if (this._minValue != null && n < this._minValue)
		n = this._minValue;
	if (this._maxValue != null && n > this._maxValue)
		n = this._maxValue;
	// make sure it's a number
	n = parseFloat(n);
	if (this._decimals != null)
		n = n.toFixed(this._decimals);
	this._lastValidValue = n;
	return n;
};

/**
 * Gets the input element.
 * 
 * @return	{Element}	the element
 */
DwtSpinner.prototype.getInputElement = function() {
	return document.getElementById(this._idField);
};

DwtSpinner.prototype._getUpButton = function() {
	return document.getElementById(this._idUpButton);
};

DwtSpinner.prototype._getDownButton = function() {
	return document.getElementById(this._idDownButton);
};

DwtSpinner.prototype._getButton = function(direction) {
	switch (direction) {
	    case "Up"   : return this._getUpButton();
	    case "Down" : return this._getDownButton();
	}
};

DwtSpinner.prototype._setBtnState = function(dir, disabled) {
	var btn = this._getButton(dir);
	if (disabled) {
		Dwt.addClass(btn, "DwtSpinner-" + dir + "-disabled");
		btn.firstChild.className = "Img" + dir + "ArrowSmallDis";
	} else {
		Dwt.delClass(btn, "DwtSpinner-" + dir + "-disabled");
		btn.firstChild.className = "Img" + dir + "ArrowSmall";
	}
};

/**
 * Gets the value.
 * 
 * @return	{number}	the value
 */
DwtSpinner.prototype.getValue = function() {
	return parseFloat(this._getValidValue(this.getInputElement().value));
};

/**
 * Sets the value.
 * 
 * @param	{number}	val		the value
 */
DwtSpinner.prototype.setValue = function(val) {
	if (val == null)
		val = this.getInputElement().value;
	val = this._getValidValue(val);
	this.getInputElement().value = val;
	val = parseFloat(val);
	this._setBtnState("Down", this._minValue != null && this._minValue == val);
	this._setBtnState("Up", this._maxValue != null && this._maxValue == val);
};

DwtSpinner.prototype.setEnabled = function(enabled) {
	DwtControl.prototype.setEnabled.call(this, enabled);
	this.getInputElement().disabled = !enabled;
	var table = this.getHtmlElement().firstChild;
	if (!enabled)
		Dwt.addClass(table, "DwtSpinner-disabled");
	else
		Dwt.delClass(table, "DwtSpinner-disabled");
};

DwtSpinner.prototype._rotateVal = function(direction) {
	var val = this.getValue();
	switch (direction) {
	    case "Up"   : val += this._step; break;
	    case "Down" : val -= this._step; break;
	}
	this.setValue(val);
};

DwtSpinner.prototype._btnPressed = function(direction) {
	if (!this.getEnabled())
		return;
	Dwt.addClass(this._getButton(direction), "DwtSpinner-" + direction + "-pressed");
	this._direction = direction;
	this._rotateVal(direction);
	this._btnPressCapture.capture();
	this._timerSteps = 0;
	this._timer = setTimeout(this._timerFunc, DwtSpinner.INIT_TIMER);
};

DwtSpinner.prototype._timerFunc = function() {
	var v1 = this.getValue();
	this._rotateVal(this._direction);
	var v2 = this.getValue();
	this._timerSteps++;
	var timeout = this._timerSteps > 4 ? DwtSpinner.FAST_TIMER : DwtSpinner.SLOW_TIMER;
	if (v1 != v2)
		this._timer = setTimeout(this._timerFunc, timeout);
	else
		this._stopCapture();
};

DwtSpinner.prototype._stopCapture = function() {
	if (this._timer)
		clearTimeout(this._timer);
	this._timer = null;
	this._timerSteps = null;
	var direction = this._direction;
	Dwt.delClass(this._getButton(direction), "DwtSpinner-" + direction + "-pressed");
	this._direction = null;
	this._btnPressCapture.release();
	var input = this.getInputElement();
	input.focus();
	Dwt.setSelectionRange(input, 0, input.value.length);
};

DwtSpinner.prototype.__onKeyPress = function(ev) {
	if (AjxEnv.isIE)
		ev = window.event;
	var dir = null;
	switch (ev.keyCode) {
	    case 38:
		dir = "Up";
		break;
	    case 40:
		dir = "Down";
		break;
	}
	if (dir) {
		this._rotateVal(dir);
		var input = this.getInputElement();
		Dwt.setSelectionRange(input, 0, input.value.length);
	}
};

DwtSpinner.prototype.focus = function() {
	this.getInputElement().focus();
};

DwtSpinner.prototype.select = function() {
	var input = this.getInputElement();
	input.focus();
	Dwt.setSelectionRange(input, 0, input.value.length);
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtButtonColorPicker")) {
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
 * Creates a button
 * @constructor
 * @class
 * This class ntegrates {@link DwtButton} with a popup {@link DwtColorPicker}. This class is useful to
 * present a color picker button with an integrated drop-down for choosing from
 * a color palette. You can use addSelectionListener to register a handler
 * that will get called when a new color is selected.  Inspect "ev.detail" to
 * retrieve the color (guaranteed to be in #RRGGBB format).
 * <p>
 * The button also features a DIV that displays the currently selected color.
 * Upon clicking that DIV, the color will be cleared (in this event, ev.detail
 * will be the empty string in your selection listener).  Note you must call
 * showColorDisplay() in order for this DIV to be displayed.
 * <p>
 * All constructor arguments are passed forward to the {@link DwtButton} constructor.
 *
 * @extends DwtButton
 * @author Mihai Bazon
 * 
 * @param {hash}	params		a hash of parameters
 * @param  {DwtComposite}     params.parent		the parent widget
 * @param  {constant}     params.style			the button style
 * @param  {string}     params.className		the CSS class
 * @param  {constant}     params.posStyle		the positioning style
 * @param  {string}     params.id			the ID to use for the control's HTML element
 * @param  {number}     params.index 		the index at which to add this control among parent's children
 * @param  {boolean}     params.allowColorInput if <code>true</code>, allow a text field to allow user to input their customized RGB value
 * @param  {boolean}     params.noFillLabel	if <code>true</code>, do not fill label
 * 
 * @extends		DwtButton
 */
DwtButtonColorPicker = function(params) {
    if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtButtonColorPicker.PARAMS);
	params.actionTiming = DwtButton.ACTION_MOUSEUP;
    DwtButton.call(this, params);

	// WARNING: we pass boolean instead of a DwtDialog because (1) we don't
	// have a dialog right now and (2) DwtMenu doesn't seem to make use of
	// this parameter in other ways than to establish the zIndex.  That's
	// unnecessarily complex :-(
	var m = new DwtMenu({parent:this, style:DwtMenu.COLOR_PICKER_STYLE});
	this.setMenu(m);
	var cp = new DwtColorPicker(m, null, null, params.noFillLabel, params.allowColorInput);
	cp.addSelectionListener(new AjxListener(this, this._colorPicked));
    this.__colorPicker = cp ;    //for xform item _DWT_COLORPICKER_
	// no color initially selected
	this.__color = "";
};

DwtButtonColorPicker.PARAMS = ["parent", "style", "className", "posStyle", "id", "index", "noFillLabel", "allowColorInput"];

DwtButtonColorPicker.prototype = new DwtButton;
DwtButtonColorPicker.prototype.constructor = DwtButtonColorPicker;

//
// Constants
//

DwtButtonColorPicker._RGB_RE = /rgb\(([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3})\)/;

DwtButtonColorPicker._hexdigits = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];

//
// Data
//

//MOW:  DwtButtonColorPicker.prototype.TEMPLATE = "dwt.Widgets#ZButtonColorPicker";

//
// Public methods
//

/**
 * Utility function that converts the given integer to its hexadecimal representation.
 *
 * @param {number}		n 		the number to convert
 * @param {number}		[pad] 	the number of digits in the final number (zero-padded if required)
 * @return	{string}	the hexadecimal representation
 */
DwtButtonColorPicker.toHex =
function(n, pad) {
	var digits = [];
	while (n) {
		var d = DwtButtonColorPicker._hexdigits[n & 15];
		digits.push(d);
		n = n >> 4;
	}
	if (pad != null) {
		pad -= digits.length;
		while (pad-- > 0)
			digits.push('0');
	}
	digits.reverse();
	return digits.join("");
};

/**
 * Shows the color display. Call this function to display a DIV that shows the currently
 * selected color. This DIV also has the ability to clear the current color.
 * 
 * @param	{boolean}	disableMouseOver		if <code>true</code>, disable the mouse over
 */
DwtButtonColorPicker.prototype.showColorDisplay =
function(disableMouseOver) {
    if (!this._colorEl) return;

    if (!disableMouseOver) {
		this._colorEl.onmouseover = DwtButtonColorPicker.__colorDisplay_onMouseOver;
		this._colorEl.onmouseout = DwtButtonColorPicker.__colorDisplay_onMouseOut;
		this._colorEl.onmousedown = DwtButtonColorPicker.__colorDisplay_onMouseDown;
	}
};

/**
 * Gets the color.
 * 
 * @return {string}		the currently selected color
 */
DwtButtonColorPicker.prototype.getColor =
function() {
	return this.__color;
};

/**
 * Set the current color.
 *
 * @param {string} color 		the desired color. Pass the empty string "" to clear the selection.
 */ 
DwtButtonColorPicker.prototype.setColor =
function(color) {
	// let's make sure we keep it in #RRGGBB format
	var rgb = color.match(DwtButtonColorPicker._RGB_RE);
	if (rgb) {
		color = "#" +
			DwtButtonColorPicker.toHex(parseInt(rgb[1]), 2) +
			DwtButtonColorPicker.toHex(parseInt(rgb[2]), 2) +
			DwtButtonColorPicker.toHex(parseInt(rgb[3]), 2);
	}
	this.__color = color;
    var colorEl = this._colorEl;
    if (colorEl)
		colorEl.style.backgroundColor = color;
};

//
// Protected methods
//

DwtButtonColorPicker.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtButton.prototype._createHtmlFromTemplate.call(this, templateId, data);

	// set the color display bit inside the title of the widget
	var displayHtml = AjxTemplate.expand('dwt.Widgets#ZButtonColorDisplay', data);
	this.setText(displayHtml);

    this._colorEl = document.getElementById(data.id+"_color");
};


// override "_setMinWidth" since that doesn't apply for this type of button
DwtButtonColorPicker.prototype._setMinWidth = function() {}


/// Protected function that is called when a color is chosen from the popup
/// DwtColorPicker.  Sets the current color to the chosen one and calls the
/// DwtButton's selection handlers if any.
DwtButtonColorPicker.prototype._colorPicked = function(ev) {

	var color = ev.detail || '#000000';
	this.__color = this.__detail = color;
    var colorEl = this._colorEl;
    if (colorEl) {
		colorEl.style.backgroundColor = color;
	}
	if (this.isListenerRegistered(DwtEvent.SELECTION)) {
		var selEv = DwtShell.selectionEvent;
		// DwtUiEvent.copy(selEv, ev);
		selEv.item = this;
		selEv.detail = color;
		this.notifyListeners(DwtEvent.SELECTION, selEv);
	}
};

//
// Private methods
//

/// When the color display DIV is hovered, we show a small "X" icon to suggest
/// the end user that the selected color can be cleared.
DwtButtonColorPicker.prototype.__colorDisplay_onMouseOver =
function(ev, div) {
	if (!this.getEnabled())
		return;
	Dwt.addClass(div, "ImgDisable");
};

DwtButtonColorPicker.prototype.__colorDisplay_onMouseOut =
function(ev, div) {
	if (!this.getEnabled())
		return;
	Dwt.delClass(div, "ImgDisable");
};

/// Clears the selected color.  This function is called when the color display
/// DIV is clicked.
DwtButtonColorPicker.prototype.__colorDisplay_onMouseDown =
function(ev, div) {
	if (!this.getEnabled())
		return;
	var dwtev = DwtShell.mouseEvent;
	dwtev.setFromDhtmlEvent(ev);
	this.__color = this.__detail = div.style.backgroundColor = "";

 	if (this.isListenerRegistered(DwtEvent.SELECTION)) {
 		var selEv = DwtShell.selectionEvent;
 		// DwtUiEvent.copy(selEv, ev);
 		selEv.item = this;
 		selEv.detail = "";
 		this.notifyListeners(DwtEvent.SELECTION, selEv);
 	}

	dwtev._stopPropagation = true;
	dwtev._returnValue = false;
	dwtev.setToDhtmlEvent(ev);
	return false;
};

// static event dispatchers

DwtButtonColorPicker.__colorDisplay_onMouseOver =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	obj.__colorDisplay_onMouseOver(ev, this);
};

DwtButtonColorPicker.__colorDisplay_onMouseOut =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	obj.__colorDisplay_onMouseOut(ev, this);
};

DwtButtonColorPicker.__colorDisplay_onMouseDown =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	obj.__colorDisplay_onMouseDown(ev, this);
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtMessageComposite")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a composite that is populated from a message pattern.
 * @constructor
 * @class
 * This class allows you to create a composite that is populated from
 * a message pattern and inserts controls at the appropriate places.
 * For example, say that the message <code>MyMsg.repeatTimes</code> is
 * defined as the following:
 * <pre>
 * MyMsg.repeatTimes = "Repeat: {0} times";
 * </pre>
 * and you want to replace "{0}" with an input field or perhaps a
 * drop-down menu that enumerates a specific list of choices as part of
 * the application. To do this, you just create a
 * {@link DwtMessageComposite} and set the message format, like so:
 * <pre>
 * var comp = new DwtMessageComposite(parent);
 * comp.setFormat(MyMsg.repeatTimes);
 * </pre>
 * <p>
 * The message composite instantiates an {@link AjxMessageFormat}
 * from the specified message pattern. Then, for each segment it creates
 * static text or a {@link DwtInputField} for replacement segments
 * such as "{0}".
 * <p>
 * To have more control over the controls that are created and inserted
 * into the resulting composite, you can pass a callback object to the
 * method. Each time that a replacement segment is found in the
 * message pattern, the callback is called with the following parameters:
 * <ul>
 * <li>a reference to this message composite object;
 * <li>a reference to the segment object.
 * <li>the index at which the segment was found in the message pattern; and
 * </ul>
 * The segment object will be an instance of
 * <code>AjxMessageFormat.MessageSegment</code> and has the following
 * methods of interest:
 * <ul>
 * <li>toSubPattern
 * <li>getIndex
 * <li>getType
 * <li>getStyle
 * <li>getSegmentFormat
 * </ul>
 * <p>
 * The callback can use this information to determine whether or not
 * a custom control should be created for the segment. If the callback
 * returns <code>null</code>, a standard {@link DwtInputField} is
 * created and inserted. Note: if the callback returns a custom control,
 * it <em>must</em> be an instance of {@link AjxControl}.
 * <p>
 * Here is an example of a message composite created with a callback
 * that generates a custom control for each replacement segment:
 * <pre>
 * function createCustomControl(parent, segment, i) {
 *     return new DwtInputField(parent);
 * }
 *
 * var compParent = ...;
 * var comp = new DwtMessageComposite(compParent);
 *
 * var message = MyMsg.repeatTimes;
 * var callback = new AjxCallback(null, createCustomControl);
 * comp.setFormat(message, callback);
 * </pre>
 *
 * @author Andy Clark
 *
 * @param {Object}		params		hash of params:
 * @param {DwtComposite}	parent    the parent widget.
 * @param {string}	className 	the CSS class
 * @param {constant}	posStyle  		the position style (see {@link DwtControl})
 * @param {DwtComposite}	parent    the parent widget.
 * @param {string}	format   the message that defines the text and controls within this composite control
 * @param {AjxCallback}	[controlCallback]   the callback to create UI components (only used with format specified)
 * @param {AjxCallback}	[hintsCallback]   the callback to provide display hints for the container element of the UI component (only used with format specified)
 * 
 * @extends		DwtComposite
 */
DwtMessageComposite = function(params) {
	if (arguments.length == 0) return;

	params = Dwt.getParams(arguments, DwtMessageComposite.PARAMS);

	if (!params.className) {
		params.className = "DwtMessageComposite";
	}

	DwtComposite.call(this, params);

	this._tabGroup = new DwtTabGroup("DwtMessageComposite");

	if (params.format) {
		this.setFormat(params.format,
		               params.controlCallback,
		               params.hintsCallback);
	}
}

DwtMessageComposite.PARAMS = ['parent', 'className', 'posStyle'];

DwtMessageComposite.prototype = new DwtComposite;
DwtMessageComposite.prototype.constructor = DwtMessageComposite;
DwtMessageComposite.prototype.isDwtMessageComposite = true;

DwtMessageComposite.prototype.toString =
function() {
	return "DwtMessageComposite";
}

// Public methods

/**
 * Sets the format.
 * 
 * @param {string}	message   the message that defines the text and controls that comprise this composite
 * @param {AjxCallback}	[callback]   the callback to create UI components
 * @param {AjxCallback}	[hintsCallback]   the callback to provide display hints for the container element of the UI component
 */
DwtMessageComposite.prototype.setFormat =
function(message, callback, hintsCallback) {
    // create formatter
    this._formatter = new AjxMessageFormat(message);
    this._controls = {};

    // create HTML
    var id = this._htmlElId;
    this.getHtmlElement().innerHTML = "<table role='presentation' class='DwtCompositeTable' border='0' cellspacing='0' cellpadding='0'><tr valign='center'></tr></table>";
    var row = this.getHtmlElement().firstChild.rows[0];

    var segments = this._formatter.getSegments();
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var isMsgSegment = segment instanceof AjxMessageFormat.MessageSegment;

        var cid = [id,i].join("_");
        var cell = document.createElement('TD');

        cell.id = cid;
        cell.className = 'DwtCompositeCell';
        row.appendChild(cell);

        if (isMsgSegment) {
            cell.className += ' MessageControl' + segment.getIndex();
            var control = callback ? callback.run(this, segment, i) : null;
            if (!control) {
                control = new DwtInputField({parent:this, parentElement: cell});
            } else {
                control.reparentHtmlElement(cell);
            }
            this._tabGroup.addMember(control.getTabGroupMember());
            if (hintsCallback) {
                var hints = hintsCallback.run(this, segment, i);

                AjxUtil.hashUpdate(control.getHtmlElement(), hints, true);
            }

            var sindex = segment.getIndex();
            this._controls[sindex] = this._controls[sindex] || control;
        }
        else {
            control = new DwtText({parent:this, parentElement: cell});
            control.setText(segment.toSubPattern());
            this._tabGroup.addMember(control);
        }
    }
};

/**
 * Gets the format.
 * 
 * @return	{string}	the format
 */
DwtMessageComposite.prototype.format = function() {
    var args = [];
    for (var sindex in this._controls) {
        args[sindex] = this._controls[sindex].getValue();
    }
    return this._formatter.format(args);
};

DwtMessageComposite.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtRadioButtonGroup")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a radio button group.
 * @constructor
 * @class
 * This class implements a group of radio buttons
 *
 * @param {hash} [radios] 	a hash whose keys are the ids of the radio button elements
 * 		and whose values are the values associated with those buttons
 * @param {string} [selectedId]	the id of the button to select initially
 * 
 * TODO: this really should be a DwtComposite
 * 
 * @private
 */
DwtRadioButtonGroup = function(radios, selectedId) {
	this._radios = {};
	this._radioButtons = {};
	this._values = {};
	this._value2id = {};
	this._eventMgr = new AjxEventMgr();
	
	for (var id in radios) {
		this.addRadio(id, radios[id], (id == selectedId));
	}
};

DwtRadioButtonGroup.prototype.toString =
function() {
	return "DwtRadioButtonGroup";
};

//
// Data
//

DwtRadioButtonGroup.prototype._enabled = true;
DwtRadioButtonGroup.prototype._visible = true;

//
// Public methods
//

DwtRadioButtonGroup.prototype.addSelectionListener = function(listener) {
	return this._eventMgr.addListener(DwtEvent.SELECTION, listener);
};

DwtRadioButtonGroup.prototype.removeSelectionListener = function(listener) {
	return this._eventMgr.removeListener(DwtEvent.SELECTION, listener);
};

DwtRadioButtonGroup.prototype.setEnabled = function(enabled) {
	this._enabled = enabled;
	for (var id in this._radios) {
		this._radios[id].disabled = !enabled;
	}
};
DwtRadioButtonGroup.prototype.isEnabled = function() {
	return this._enabled;
};

DwtRadioButtonGroup.prototype.setVisible = function(visible) {
	this._visible = visible;
	for (var id in this._radioButtons) {
		this._radioButtons[id].setVisible(visible);
	}
	for (var id in this._radios) {
		Dwt.setVisible(this._radios[id], visible);
	}
};
DwtRadioButtonGroup.prototype.isVisible = function() {
	return this._visible;
};

DwtRadioButtonGroup.prototype.addRadio =
function(id, radioButtonOrValue, selected) {
	var isRadioButton = radioButtonOrValue instanceof DwtRadioButton;
	var radioButton = isRadioButton ? radioButtonOrValue : null;
	var value = radioButton ? radioButton.getValue() : radioButtonOrValue;

	this._values[id] = value;
	this._value2id[value] = id;
	var element = document.getElementById(id);
	this._radios[id] = element;
	this._radioButtons[id] = radioButton;
	var handler = AjxCallback.simpleClosure(this._handleClick, this);
	Dwt.setHandler(element, DwtEvent.ONCLICK, handler);
   	element.checked = selected;
    if (selected) {
    	this._selectedId = id;
    }
};

DwtRadioButtonGroup.prototype.getRadioByValue = function(value) {
	var id = this._value2id[value];
	return this._radios[id];
};

DwtRadioButtonGroup.prototype.getRadioButtonByValue = function(value) {
	var id = this._value2id[value];
	return this._radioButtons[id];
};

DwtRadioButtonGroup.prototype.setSelectedId =
function(id, skipNotify) {
	if (id != this._selectedId) {
		var el = document.getElementById(id);
		if (!el) return;
		el.checked = true;
		this._selectedId = id;
		if (!skipNotify) {
			var selEv = DwtShell.selectionEvent;
			selEv.reset();
			this._notifySelection(selEv);
		}
	}
};

DwtRadioButtonGroup.prototype.setSelectedValue =
function(value, skipNotify) {
	var id = this._valueToId(value);
	this.setSelectedId(id, skipNotify);
};

DwtRadioButtonGroup.prototype.getSelectedId =
function() {
	return this._selectedId;
};

DwtRadioButtonGroup.prototype.getSelectedValue =
function() {
	return this._values[this._selectedId];
};

DwtRadioButtonGroup.prototype.getValue =
function() {
	return this.getSelectedValue();
};

DwtRadioButtonGroup.prototype.getData =
function(key) {
	var selectedRadio = !AjxUtil.isUndefined(this._selectedId) && this._radioButtons[this._selectedId];
	if (selectedRadio) {
		return selectedRadio.getData(key);
	}
	// return undefined;
}

//
// Protected methods
//

DwtRadioButtonGroup.prototype._valueToId =
function(value) {
	for (var id in this._values) {
		if (this._values[id] == value) {
			return id;
		}
		if (value === true && this._values[id] == "true") {
			return id;
		}
		if (value === false && (this._values[id] == "false" || this._values[id] == "")) {
			return id;
		}
	}
	return null;
};

DwtRadioButtonGroup.prototype._notifySelection = 
function(selEv) {
    selEv.item = this;
    selEv.detail = { id: this._selectedId, value: this._values[this._selectedId] };
    this._eventMgr.notifyListeners(DwtEvent.SELECTION, selEv);
};

DwtRadioButtonGroup.prototype._handleClick = 
function(event) {
	event = DwtUiEvent.getEvent(event);

	var target = DwtUiEvent.getTarget(event);
	if (target && target.nodeName.match(/label/i)) {
        target = document.getElementById(target.getAttribute(AjxEnv.isIE ? "htmlFor" : "for"));
    }

	var id = target.id;
	// NOTE: When you use the arrows on radio button groups in FF,
	//       the radio button that is being unselected is the target
	//       of the event. So we need to check to see if this target
	//       is the one that is checked.
	if (!target.checked) {
		for (id in this._radios) {
			if (this._radios[id].checked) {
				break;
			}
		}
	}
	if (id != this._selectedId) {
		this._selectedId = id;
	    var selEv = DwtShell.selectionEvent;
	    DwtUiEvent.copy(selEv, event);
		this._notifySelection(selEv);
	}
};
}
if (AjxPackage.define("ajax.dwt.widgets.DwtComboBox")) {
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
 * Creates a combo box.
 * @constructor
 * @class
 * This class represents a combo box.
 *
 * @author Dave Comfort
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}      parent		the parent widget
 * @param {boolean}	useLabel		Set to true if the value should be shown in a DwtLabel. Defaults to false, showing it in a DwtInputField.
 * @param {hash}	inputParams		params for the input (see {@link DwtInputField} or {@link DwtLabel})
 * @param {string}      className		the CSS class
 * @param {constant}      posStyle		the positioning style (see {@link DwtControl})
 * @param {int}     maxRows         The number of maxRows needed in drop down(see {@link DwtMenu})
 * @param {constant} layout         The layout of the drop down(see {@link DwtMenu})
 * @param {boolean} autoScroll    Set to true if auto scroll to the input text is needed. Defaults to false.
 * 
 * @extends		DwtComposite
 */
DwtComboBox = function(params) {
    if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtComboBox.PARAMS);
    params.className = params.className || "DwtComboBox";
    DwtComposite.call(this, params);
    
    this.input = null;
	this._menu = null;
    this._button = null;
    
    this._textToValue = {}; // Map of text strings to their values.
    this._valueToText = {};
    this._valueToItem = {};
	this._size = 0;

    this._hasMenuCallback = true;
	this._menuItemListenerObj = new AjxListener(this, this._menuItemListener);

    this._inputParams = params.inputParams;
	this._useLabel = Boolean(params.useLabel);
	this._maxRows = params.maxRows;
	this._layout = params.layout;
	this._autoScroll = params.autoScroll || false;
    this._createHtml();
};

DwtComboBox.PARAMS = ["parent", "inputParams", "className", "posStyle", "dialog"];

DwtComboBox.prototype = new DwtComposite;
DwtComboBox.prototype.constructor = DwtComboBox;

DwtComboBox.prototype.isDwtComboBox = true;
DwtComboBox.prototype.toString = function() { return "DwtComboBox"; };

//
// Data
//

DwtComboBox.prototype.TEMPLATE = "dwt.Widgets#DwtComboBox";

//
// Public methods
//

DwtComboBox.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

/**
 * Adds the change listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtComboBox.prototype.addChangeListener = function(listener) {
	this.addListener(DwtEvent.ONCHANGE, listener);
};

DwtComboBox.prototype.setAriaLabel = function(label) {
	this.getHtmlElement().setAttribute('aria-label', label);
}
/**
 * Removes the change listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
DwtComboBox.prototype.removeChangeListener = function(listener) {
	this.removeListener(DwtEvent.ONCHANGE, listener);
};

/**
 * Adds an entry to the combo box list.
 * 
 * @param {string}	text		the user-visible text for the entry
 * @param {string}	value		the value for the entry
 * @param {boolean}	selected	if <code>true</code>, the entry is selected
 */
DwtComboBox.prototype.add =
function(text, value, selected) {
	this._textToValue[text] = value;
    this._valueToText[value] = text;
    if (!this._hasMenuCallback) {
		var menu = this._button.getMenu();
    	this._createMenuItem(menu, text);
	}
	if (selected) {
		this.setText(text);
	}
	this._size++;
	this._updateButton();
};

/**
 * Removes the specified value from the list.
 *
 * @param	{string}	value		the value
 */
DwtComboBox.prototype.remove = function(value) {
    var item = this._valueToItem[value];
    if (item) {
        this._button.getMenu().removeChild(item);
        var text = this._valueToText[value];
        delete this._textToValue[text];
        delete this._valueToText[value];
        delete this._valueToItem[value];
        if (this.getText() == text) {
            this.setText("");
        }
		this._size--;
		this._updateButton();
	}
};

/**
 * Removes all the items in the list.
 * 
 */
DwtComboBox.prototype.removeAll = function() {
    this._button.setMenu(new AjxCallback(this, this._createMenu), true);
    this._hasMenuCallback = true;

    this._textToValue = {};
    this._valueToText = {};
    this._valueToItem = {};
	this._size = 0;
	this._updateButton();
};

/**
 * Gets the value of the currently selected entry. If the entry
 * is one that was not added via the add method (that is, if it was
 * typed in by the user) then <code>null</code> is returned.
 * 
 * @return	{string}	the value
 */
DwtComboBox.prototype.getValue =
function() {
	var text = this.getText();
	return this._textToValue[text];
};

/**
 * Sets the value.
 * 
 * @param	{string}	value		the value
 */
DwtComboBox.prototype.setValue = function(value) {
	var text = this._valueToText[value];
	this.setText(text || value);
};

/**
 * Gets the text of the currently selected entry.
 * 
 * @return	{string}	the text
 */
DwtComboBox.prototype.getText =
function() {
	return this._useLabel ? this.input.getText() : this.input.getValue();
};

/**
 * Sets the selected text.
 * 
 * @param	{string}	text		the text
 */
DwtComboBox.prototype.setText =
function(text) {
	if (this._useLabel)
		this.input.setText(text);
	else
		this.input.setValue(text);
};

DwtComboBox.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtComposite.prototype.setEnabled.call(this, enabled);
		this.input.setEnabled(enabled);
		this._button.setEnabled(enabled);
    }
};

DwtComboBox.prototype.focus = function() {
    return this.input.focus();
};

DwtComboBox.prototype.popdown = function() {
	if (this._menu)
		this._menu.popdown();
};

//
// Protected methods
//

DwtComboBox.prototype._createMenu =
function() {
	var params = {parent:this};
	if (this._maxRows) {
		params.maxRows = this._maxRows;
	}
	if (this._layout) {
		params.layout = this._layout;
	}
    var menu = this._menu = new DwtMenu(params);
    for (var i in this._textToValue) {
    	var item = this._createMenuItem(menu, i);
        var value = this._textToValue[i];
        this._valueToItem[value] = item;
    }
	this._hasMenuCallback = false;
	return menu;
};

DwtComboBox.prototype._createMenuItem =
function(menu, text) {
	var item = new DwtMenuItem({parent:menu});
	item.setText(text);
	item.addSelectionListener(this._menuItemListenerObj);
	if (!this._menuWidth) {
		this._menuWidth = this.getW() - 10; // 10 is some fudge factor that lines up the menu right.
	}
    item.getHtmlElement().style.minWidth = this._menuWidth;
    return item;
};

DwtComboBox.prototype._menuItemListener =
function(ev) {
	var menuItem = ev.dwtObj;
	var ovalue = this.getText();
	var nvalue = menuItem.getText();
	this.setText(nvalue);
	this._menu.popdown();

	// notify our listeners
	var event = DwtUiEvent.getEvent(ev);
	event._args = { selectObj: this, newValue: nvalue, oldValue: ovalue };
	this.notifyListeners(DwtEvent.ONCHANGE, event);

	if (!this._useLabel) {
	    var input = this.input.getInputElement();
	    input.focus();
	    input.select();
	}
};

DwtComboBox.prototype._handleKeyDown = function(ev) {
	var keycode = DwtKeyEvent.getCharCode(ev);

	this.__ovalue = this.getText();

	return true;
};

DwtComboBox.prototype._handleKeyUp = function(ev) {
	// propagate event to DwtInputField
	DwtInputField._keyUpHdlr(ev);
	// notify our listeners
	var event = DwtUiEvent.getEvent(ev);
	var newValue = this.getText();
	event._args = { selectObj: this, newValue: newValue, oldValue: this.__ovalue };
	this.notifyListeners(DwtEvent.ONCHANGE, event);
	if (this._menu && this._autoScroll && newValue != this.__ovalue) {
		//if auto scroll is on then scroll to the index which starts with
		//the value in input field
		var index = 0;
		for (var text in this._textToValue) {
			if (text.indexOf(newValue) == 0) {
				this._menu.scrollToIndex(index);
				break;
			}
			index++;
		}
	}
	return true;
};

DwtComboBox.prototype._updateButton =
function() {
	this._button.setVisible(this._size > 0);
};

DwtComboBox.prototype._createHtml = function(templateId) {
    var data = { id: this._htmlElId };
    this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

DwtComboBox.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtComposite.prototype._createHtmlFromTemplate.call(this, templateId, data);

	var inputParams = this._inputParams || {};
	inputParams.parent = this;
	inputParams.size = inputParams.size || 40;
	delete this._inputParams;
    
	this.input = (this._useLabel ?
	              new DwtLabel(inputParams) : new DwtInputField(inputParams));
    this.input.replaceElement(data.id + "_input");
	this.input.setHandler(DwtEvent.ONKEYDOWN, AjxCallback.simpleClosure(this._handleKeyDown, this));
	this.input.setHandler(DwtEvent.ONKEYUP, AjxCallback.simpleClosure(this._handleKeyUp, this));

    this._button = new DwtComboBoxButton({parent:this});
	this._button.setMenu(new AjxListener(this, this._createMenu), true);
    this._button.replaceElement(data.id + "_button");
	this._updateButton();

	this._tabGroup = new DwtTabGroup(this._htmlElId);
	this._tabGroup.addMember(this.input);
	this._tabGroup.addMember(this._button);
};

/**
 * The input field inherits the id for accessibility purposes.
 * 
 * @private
 */
DwtComboBox.prototype._replaceElementHook =
function(oel, nel, inheritClass, inheritStyle) {
	DwtComposite.prototype._replaceElementHook.apply(this, arguments);
	// set input settings
	if (oel.size) {
		var el = (this._useLabel ?
		          this.input.getHtmlElement() :
		          this.input.getInputElement());
		el.size = oel.size;
	}
	if (oel.title) {
		this.input.setHint(oel.title);
	}
};

//
// Classes
//

/**
 * DwtComboBoxButton: Stylizable button just for use in combo boxes.
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}       params.parent		the parent widget
 * @param	{string}       params.className		the CSS class
 * 
 * @extends		DwtButton
 * @private
 */
DwtComboBoxButton = function(params) {
	params = Dwt.getParams(arguments, DwtComboBoxButton.PARAMS);
	params.posStyle = Dwt.RELATIVE_STYLE;
	DwtButton.call(this, params);
}

DwtComboBoxButton.prototype = new DwtButton;
DwtComboBoxButton.prototype.constructor = DwtComboBoxButton;

DwtComboBoxButton.prototype.toString =
function() {
    return "DwtComboBoxButton";
};

DwtComboBoxButton.PARAMS = ["parent", "className"];

// Data

DwtComboBoxButton.prototype.TEMPLATE = "dwt.Widgets#DwtComboBoxButton"

}

if (AjxPackage.define("zimbra.common.ZLoginFactory")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZLoginFactory = function() {}

ZLoginFactory.USER_ID = "ZLoginUserName";
ZLoginFactory.PASSWORD_ID = "ZLoginPassword";
ZLoginFactory.REMEMBER_ME_ID = "rememberMe";
ZLoginFactory.REMEMBER_ME_CONTAINER_ID = "ZLoginRememberMeContainer"
ZLoginFactory.NEW_PASSWORD_ID = "newpass1";
ZLoginFactory.NEW_PASSWORD_TR_ID = "ZLoginNewPassword1Tr";
ZLoginFactory.PASSWORD_CONFIRM_TR_ID = "ZLoginNewPassword2Tr";
ZLoginFactory.PASSWORD_CONFIRM_ID = "newpass2";
ZLoginFactory.LOGIN_BUTTON_ID = "ZLoginButton";
ZLoginFactory.MORE_ID = "ZLoginMore";

// Constants for tabbing through the login controls.
ZLoginFactory.TEXT_TYPE = 0;
ZLoginFactory.CHECKBOX_TYPE = 1;
ZLoginFactory.BUTTON_TYPE = 2;

ZLoginFactory.TAB_ORDER = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					 ZLoginFactory.NEW_PASSWORD_ID, ZLoginFactory.PASSWORD_CONFIRM_ID,
					 ZLoginFactory.REMEMBER_ME_ID, ZLoginFactory.LOGIN_BUTTON_ID];
ZLoginFactory.VISIBILITY = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					  ZLoginFactory.NEW_PASSWORD_TR_ID, ZLoginFactory.PASSWORD_CONFIRM_TR_ID,
					  ZLoginFactory.REMEMBER_ME_CONTAINER_ID, ZLoginFactory.LOGIN_BUTTON_ID];
ZLoginFactory.TAB_TYPE = [ZLoginFactory.TEXT_TYPE, ZLoginFactory.TEXT_TYPE, 
					ZLoginFactory.TEXT_TYPE, ZLoginFactory.TEXT_TYPE,
					ZLoginFactory.CHECKBOX_TYPE, ZLoginFactory.BUTTON_TYPE];
				
/**
 * Creates a copy of the default login parameters.
 * 
 * @param msgs	The class where localized messages are defined. ZmMsg for example.
 */
ZLoginFactory.copyDefaultParams = 
function(msgs) {
	return {
		showPanelBorder: true,
		
		companyURL : msgs["splashScreenCompanyURL"] || "",
	
		shortVersion : "",
		longVersion : "",
	
		appName : msgs["splashScreenAppName"] || "",
		productName : "",
	
		showError : false,
		errorMsg : "",
		
		showLongVersion:false,
		showAbout : false,
		aboutMsg : "",
	
		showLoading : false,
		loadingMsg : msgs["splashScreenLoading"] || "",
		
		showForm : false,
		
		showUserField : false,
		userNameMsg : msgs["username"] ? msgs["username"] + ':' : "",
		
		showMoreField : false,
				moreMsg : msgs["more"] || "",

		showPasswordField : false,
		passwordMsg : msgs["password"] ? msgs["password"] + ':' : "",
		
		showNewPasswordFields : false,
		newPassword1Msg : msgs["newPassword"] + ':'|| "",
		newPassword2Msg : msgs["confirm"] + ':'|| "",
	
		showLicenseMsg : false,
		licenseMsg : "",
		
		showRememberMeCheckbox : false,
		rememberMeMsg : msgs["rememberMe"] || "",
	
		showLogOff : false,
		logOffMsg : msgs["loginAsDiff"] || "",
		logOffAction : "",
		
		showButton : true,
		buttonName : msgs["login"] || "",
		
		copyrightText : msgs["splashScreenCopyright"] || ""
	};
};

// show and hide various things
ZLoginFactory.getLoginPanel = function () 			{												
	var retval = document.getElementsByName("loginForm");

	return retval;
	
}

ZLoginFactory.showErrorMsg = function (msg) {
	this.setHTML("ZLoginErrorMsg", msg);
	this.show("ZLoginErrorPanel");
	this._flickerErrorMessagePanel();
}
ZLoginFactory.hideErrorMsg = function () 			{												this.hide("ZLoginErrorPanel");	}
ZLoginFactory.getErrorMsgPanel = function () 		{												return this.get("ZLoginErrorPanel");	}

ZLoginFactory.showAboutMsg = function (msg) 		{	this.setHTML("ZLoginAboutPanel", msg);		this.show("ZLoginAboutPanel");	}
ZLoginFactory.hideAboutMsg = function () 			{												this.hide("ZLoginAboutPanel");	}
ZLoginFactory.getAboutMsg = function () 			{												return this.get("ZLoginAboutPanel");	}

ZLoginFactory.showLoadingMsg = function (msg)		{	this.setHTML("ZLoginLoadingMsg", msg);		this.show("ZLoginAboutPanel");	}
ZLoginFactory.hideLoadingMsg = function () 		{													this.hide("ZLoginAboutPanel");	}
ZLoginFactory.getLoadingMsg = function () 		{													return this.get("ZLoginAboutPanel");	}

ZLoginFactory.showForm = function ()				{												this.show("ZLoginFormPanel");	}
ZLoginFactory.hideForm = function () 				{												this.hide("ZLoginFormPanel");	}
ZLoginFactory.getForm = function () 				{												return this.get("ZLoginFormPanel");	}

ZLoginFactory.showMoreField = function (name)		   {	   this.setValue(ZLoginFactory.MORE_ID, name);							 this.show(ZLoginFactory.MORE_ID);	   }
ZLoginFactory.hideMoreField = function ()					   {																							   this.hide(ZLoginFactory.MORE_ID);	   }
ZLoginFactory.getMoreField = function ()						{																							   return this.get(ZLoginFactory.MORE_ID); }

ZLoginFactory.showUserField = function (name)		{	this.setValue(ZLoginFactory.USER_ID, name);				this.show(ZLoginFactory.USER_ID);	}
ZLoginFactory.hideUserField = function () 			{												this.hide(ZLoginFactory.USER_ID);	}
ZLoginFactory.getUserField = function () 			{												return this.get(ZLoginFactory.USER_ID);	}

ZLoginFactory.showPasswordField = function (msg)	{	this.show(ZLoginFactory.PASSWORD_ID);	}
ZLoginFactory.hidePasswordField = function () 		{	this.hide(ZLoginFactory.PASSWORD_ID);	}
ZLoginFactory.getPasswordField = function () 		{	return this.get(ZLoginFactory.PASSWORD_ID);	}

ZLoginFactory.showNewPasswordFields = function ()	{	this.show(ZLoginFactory.NEW_PASSWORD_TR_ID); this.show(ZLoginFactory.PASSWORD_CONFIRM_TR_ID);	}
ZLoginFactory.hideNewPasswordFields = function () 	{	this.hide(ZLoginFactory.NEW_PASSWORD_TR_ID); this.hide(ZLoginFactory.PASSWORD_CONFIRM_TR_ID);	}
ZLoginFactory.areNewPasswordFieldsShown = function (){	return this.isShown(ZLoginFactory.NEW_PASSWORD_TR_ID); }

ZLoginFactory.getNewPasswordField = function () 	{	return this.get(ZLoginFactory.NEW_PASSWORD_ID); }
ZLoginFactory.getPasswordConfirmField = function () {	return this.get(ZLoginFactory.PASSWORD_CONFIRM_ID); }

ZLoginFactory.showRememberMeCheckbox = function ()	{	this.show(ZLoginFactory.REMEMBER_ME_CONTAINER_ID);	}
ZLoginFactory.hideRememberMeCheckbox = function ()	{	this.hide(ZLoginFactory.REMEMBER_ME_CONTAINER_ID);	}

ZLoginFactory.showLogOff = function ()	{	this.show("ZLoginLogOffContainer");	}
ZLoginFactory.hideLogOff = function ()	{	this.hide("ZLoginLogOffContainer");	}

ZLoginFactory.setLoginButtonName = function (name) 	{	this.setHTML("ZLoginButtonText", name);	}
ZLoginFactory.setLoginButtonAction = function (method) {	var el = document.getElementById(ZLoginFactory.LOGIN_BUTTON_ID); if (el) el.onclick = method	}
ZLoginFactory.getLoginButton = function () 		{	return this.get(ZLoginFactory.LOGIN_BUTTON_ID);	}


ZLoginFactory.getLoginDialogHTML = function (params) {
	var html = [
		"<div ", (params.showAbout ? " " : "class='center'"), ">",
			"<div class='contentBox'>",
				"<h1><a href='" + params.companyURL + "' id='bannerLink' target='_new'>",
					"<span class='ImgLoginBanner'></span>",
				"</a></h1>",
				"<div id='ZLoginErrorPanel' ", (params.showError ? " " :  "style='display:none'"), ">",
					"<table><tr><td width='40'><div class='ImgCritical_32'></div></td><td width='*'><span class='errorText' id='ZLoginErrorMsg'></span></td></tr></table>",
				"</div>",
				"<form name='loginForm' method='POST'>",
					"<table class='form' ", (params.showForm ? " " : "style='display:none'"),">",
					"<tr ", (params.showMoreField ? " " : "style='display:none'"), ">",
						"<td></td>",
						"<td><span class='Img ImgInformation_xtra_small'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><label for='", ZLoginFactory.MORE_ID, "'>",params.moreMsg,"</label></td>",
					"</tr>",
					"<tr ", (params.showLoading ? " " : "style='display:none'"), ">",
						"<td colspan=2 class='ZLoadingMessage'>" , params.loadingMsg, "</td>",
					"</tr>",
					"<tr id='ZLoginLicenseMsgContainer' ", (params.showLicenseMsg ? " " : "style='display:none'"), ">",
						"<td colspan=3 id='ZLoginLicenseMsg'>", params.licenseMsg, "</td>",
					"</tr>",
					"<tr ", (params.showUserField ? " " : "style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.USER_ID, "'>",params.userNameMsg,"</label></td>",
						"<td><input id='", ZLoginFactory.USER_ID, "' name='", ZLoginFactory.USER_ID, "' class='zLoginField' type='text' size='40' autocomplete=OFF/></td>",
					"</tr>",
					"<tr ", (params.showPasswordField ? " " : "style='display:none'"), ">",
						"<td><label for=",ZLoginFactory.PASSWORD_ID,">", params.passwordMsg,"</label></td>",
						"<td><input id=",ZLoginFactory.PASSWORD_ID," class='zLoginField' name=",ZLoginFactory.PASSWORD_ID," type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr id=", ZLoginFactory.NEW_PASSWORD_TR_ID, (params.showNewPasswordFields ? " " : " style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.NEW_PASSWORD_ID, "'>", params.newPassword1Msg, "</label></td>",
						"<td><input id='", ZLoginFactory.NEW_PASSWORD_ID, "' class='zLoginField' name='", ZLoginFactory.NEW_PASSWORD_ID, "' type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr id=", ZLoginFactory.PASSWORD_CONFIRM_TR_ID, (params.showNewPasswordFields ? " " : " style='display:none'"), ">",
						"<td><label for='", ZLoginFactory.PASSWORD_CONFIRM_ID, "'>", params.newPassword2Msg, "</label></td>",
						"<td><input id='", ZLoginFactory.PASSWORD_CONFIRM_ID, "' class='zLoginField' name='", ZLoginFactory.PASSWORD_CONFIRM_ID, "' type='password' autocomplete=OFF size='40'/></td>",
					"</tr>",
					"<tr>",
						"<td>&nbsp;</td>",
						"<td class='submitTD'>",
							"<input id='", ZLoginFactory.LOGIN_BUTTON_ID, "' class='ZLoginButton DwtButton' type='button' onclick='", params.loginAction, ";return false' value='",params.buttonName,(params.showButton ?"'/>" :"' style='display:none'/>"),
							"<input id='", ZLoginFactory.REMEMBER_ME_ID, "' value='1' type='checkbox' name='", ZLoginFactory.REMEMBER_ME_ID, "'  ", (params.showRememberMeCheckbox ? "" : "style='display:none'"), "/>",
							"<label ", (params.showRememberMeCheckbox ? "" : "style='display:none'"), " for='", ZLoginFactory.REMEMBER_ME_ID, "'>", params.rememberMeMsg, "</label>",
						"</td>",
					"</tr>",	
					"</table>",
				"</form>",
				"<div id='ZLoginAboutPanel' ", (params.showAbout ? "" : "style='display:none'"), ">", params.aboutMsg,
				"</div>",	
				"<div id='ZLoginLongVersion' class='version' ", (params.showLongVersion ? "" : "style='display:none'"), ">", params.longVersion, "</div>",
			"</div>",
			"<div class='decor1'></div>",
		"</div>",
		"<div class='Footer'>",
			"<div id='ZLoginNotice'>",params.clientLevelNotice,"</div>",
			"<div class='copyright'>",params.copyrightText,"</div>",
	"</div>",
	"<div class='decor2'></div>"
	].join("");
	return html;
}


// simple API to show/hide elements (can be replaced with Dwt if desired)
ZLoginFactory.setHTML = function (id, newContent) {
	var el = document.getElementById(id);
	if (el && newContent != null) el.innerHTML = newContent;
}

ZLoginFactory.setValue = function (id, newContent) {
	var el = document.getElementById(id);
	if (el && newContent != null) el.value = newContent;
}

ZLoginFactory.show = function (id, newContent) {
	var el = document.getElementById(id);
	if (el) el.style.display = "";
}

ZLoginFactory.isShown = function (id) {
	var el = document.getElementById(id);
	return el ? (el.style.display != "none") : false;
}

ZLoginFactory.hide = function (id) {
	var el = document.getElementById(id);
	if (el) el.style.display = "none";
}

ZLoginFactory.get = function (id) {
	return document.getElementById(id);
}

ZLoginFactory.handleKeyPress =
function(ev) {
	ev = ev || window.event;
	if (ev == null) {
		return true;
	}
	var target = ev.target ? ev.target: ev.srcElement;
	if (!target) {
		return true;
	}
	var keyCode = ev.keyCode;
	var fakeTabKey = false;
	if (keyCode == 13) { // Enter
		if (target.id == ZLoginFactory.USER_ID || target.id == ZLoginFactory.NEW_PASSWORD_ID) {
			fakeTabKey = true;
		} else {
			// Call the login action
			var loginAction = ZLoginFactory.get(ZLoginFactory.LOGIN_BUTTON_ID).onclick;
			if (loginAction) {
				loginAction.call(target);
			}
			ZLoginFactory._cancelEvent(ev);
			return false;
		}
	}
	if (fakeTabKey || (keyCode == 9)) { // Tab
		var startIndex = ZLoginFactory.TAB_ORDER.length - 1;
		for (var i = 0; i < ZLoginFactory.TAB_ORDER.length; i++) {
			if (ZLoginFactory.TAB_ORDER[i] == target.id) {
				startIndex = i;
				break;
			}
		}
		var forward = !ev.shiftKey;
		var tabToIndex = ZLoginFactory._getTabToIndex(startIndex, forward);
		var tabToId = ZLoginFactory.TAB_ORDER[tabToIndex];
		var tabToType = ZLoginFactory.TAB_TYPE[tabToIndex];
		ZLoginFactory._onFocusChange(tabToType, tabToId, target);
		ZLoginFactory._cancelEvent(ev);
	}
}

// Private / protected methods

ZLoginFactory._cancelEvent =
function(ev) {
	if (ev.stopPropagation)
		ev.stopPropagation();

	if (ev.preventDefault)
		ev.preventDefault();

	ev.cancelBubble = true;
	ev.returnValue = false;
}

ZLoginFactory._onFocusChange =
function(type, id, target) {
	if (type == ZLoginFactory.TEXT_TYPE) {
		var edit = ZLoginFactory.get(id);
		edit.focus();
		edit.select();
	} else if (type == ZLoginFactory.CHECKBOX_TYPE) {
		var checkbox = ZLoginFactory.get(id);
		checkbox.focus();
	}
	else {
		var button = ZLoginFactory.get(id);
		button.focus();
	}
};

ZLoginFactory._getTabToIndex =
function(startIndex, forward) {
	var testIndex = startIndex;
	do {
		var tabToIndex;
		if (forward) {
			testIndex = (testIndex == (ZLoginFactory.TAB_ORDER.length - 1)) ? 0 : testIndex + 1;
		} else {
			testIndex = (testIndex == 0) ? (ZLoginFactory.TAB_ORDER.length - 1) : testIndex - 1;
		}
		var id = ZLoginFactory.TAB_ORDER[testIndex];
		var visibilityId = ZLoginFactory.VISIBILITY[testIndex];
		var control = ZLoginFactory.get(id);
		if (ZLoginFactory.isShown(visibilityId) && !ZLoginFactory.get(id).disabled) {
			return testIndex
		}
	} while (testIndex != startIndex);
	return 0; // Should never get here.
}
					 
ZLoginFactory._loginButtonFocus =
function(border) {
	border.className = "DwtButton-focused";
};

/*
* Hide error panel very briefly, making it look like something happened if
* user has successive errors.
*/
ZLoginFactory._flickerErrorMessagePanel =
function() {
	ZLoginFactory.getErrorMsgPanel().style.visibility = "hidden";
	window.setTimeout(ZLoginFactory._showErrorMessagePanel, 8);
};

ZLoginFactory._showErrorMessagePanel =
function() {
	ZLoginFactory.getErrorMsgPanel().style.visibility = "visible";
};
}
if (AjxPackage.define("zimbra.common.ZmBaseSplashScreen")) {
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

ZmBaseSplashScreen = function(shell, imageInfo, className) {

 	if (arguments.length == 0) return;
	
 	if (!(shell instanceof DwtShell)) {
 		throw new AjxException("Parent must be a DwtShell", AjxException.INVALIDPARENT, "ZSplashScreen");
 	}
	
 	className = className || "ZSplashScreen";
 	DwtControl.call(this, {parent:shell, className:className, posStyle:Dwt.ABSOLUTE_STYLE});

	this.__createContents();
}

ZmBaseSplashScreen.prototype = new DwtControl;
ZmBaseSplashScreen.prototype.constructor = ZmBaseSplashScreen;

/** abstract **/
ZmBaseSplashScreen.prototype.getHtml = function() { }

ZmBaseSplashScreen.prototype.setVisible =
function(visible) {
	if (visible == this.getVisible()) {
		return;
	}
	
	if (visible) {
		this.__createContents();
	}		

	DwtControl.prototype.setVisible.call(this, visible);	
	
	if (!visible) {
		this.getHtmlElement().innerHTML = "";
	}
};

ZmBaseSplashScreen.prototype.__createContents =
function() {
	var htmlEl = this.getHtmlElement();
 	htmlEl.style.zIndex = Dwt.Z_SPLASH;
	
 	var myTable = document.createElement("table");
	myTable.setAttribute('role', 'presentation');
 	myTable.border = myTable.cellSpacing = myTable.cellPadding = 0;
 	Dwt.setSize(myTable, "100%", "100%");
	
 	var row = myTable.insertRow(0);
 	var cell = row.insertCell(0);
 	cell.vAlign = "middle";
 	cell.align = "center";
	cell.innerHTML = this.getHtml();
 	htmlEl.appendChild(myTable);
	htmlEl.style.cursor = "wait";
};
}
if (AjxPackage.define("zimbra.common.ZmErrorDialog")) {
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
 * @overview
 * This file defines the Zimbra error dialog.
 *
 */

/**
 * Creates an error dialog.
 * @class
 * Creates an error dialog which will have a "Send Error Report" button.
 * A normal {@link DwtMessageDialog} with a "Send Error Report" button that will post user info to the 
 * server when clicked.
 * 
 * @param	{Object}	parent		the parent
 * @param	{Hash}		msgs		a hash of messages
 * @param	{String}	msgs.showDetails		the show details message
 * @param	{String}	msgs.hideDetails		the hide details message
 * 
 * @extends DwtMessageDialog
 */
ZmErrorDialog = function(parent, msgs) {

	// go ahead and cache the navigator and subject info now (since it should never change)		
	this._strNav = this._getNavigatorInfo();
	this._subjPfx = this._getSubjectPrefix();

	var reportButton = new DwtDialog_ButtonDescriptor(ZmErrorDialog.REPORT_BUTTON, msgs.report, DwtDialog.ALIGN_LEFT);
	var detailButton = new DwtDialog_ButtonDescriptor(ZmErrorDialog.DETAIL_BUTTON, msgs.showDetails, DwtDialog.ALIGN_LEFT);
	DwtMessageDialog.call(this, {parent:parent, extraButtons:[reportButton, detailButton], id:"ErrorDialog"});

	this.registerCallback(ZmErrorDialog.REPORT_BUTTON, this._reportCallback, this);
	this.registerCallback(ZmErrorDialog.DETAIL_BUTTON, this.showDetail, this);
	
	this._showDetailsMsg = msgs.showDetails;
	this._hideDetailsMsg = msgs.hideDetails;

	this._setAllowSelection();
};

ZmErrorDialog.prototype = new DwtMessageDialog;
ZmErrorDialog.prototype.constructor = ZmErrorDialog;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmErrorDialog.prototype.toString =
function() {
	return "ZmErrorDialog";
};

//
// Consts
//

ZmErrorDialog.REPORT_BUTTON = "Report";
ZmErrorDialog.DETAIL_BUTTON = "Detail";
ZmErrorDialog.DEFAULT_REPORT_URL = "//www.zimbra.com/e/";

//
// Data
//

ZmErrorDialog.prototype._detailsVisible = false;
ZmErrorDialog.prototype.CONTROLS_TEMPLATE = "zimbra.Widgets#ZmErrorDialogControls";

//
// Public methods
//

/**
 * Resets the dialog.
 * 
 */
ZmErrorDialog.prototype.reset =
function() {
	this.setDetailString();
	DwtMessageDialog.prototype.reset.call(this);
};

/**
* Sets the text to display when the "Show Details" button is pressed.
*
* @param {String}	text	the detail text
*/
ZmErrorDialog.prototype.setDetailString = 
function(text) {
	if (!(this._button[ZmErrorDialog.DETAIL_BUTTON])) { return; }

	this._button[ZmErrorDialog.DETAIL_BUTTON].setVisible(text != null);
	this._detailStr = text;
};

/**
 * Sets the message style (info/warning/critical) and content.
 *
 * @param {String}	msgStr		the message text
 * @param {String}	detailStr	the detail text
 * @param {constant}	style		the style (see {@link DwtMessageDialog} <code>_STYLE</code> constants)
 * @param {String}	title		the dialog box title
 */
ZmErrorDialog.prototype.setMessage =
function(msgStr, detailStr, style, title) {
	this._msgStr = msgStr;
	this.setDetailString(detailStr);
	this._msgStyle = style;
	this._msgTitle = title;

	// clear the 'detailsVisible' flag and reset the title of the 'showDetails' button
	this._detailsVisible = false;
	this._button[ZmErrorDialog.DETAIL_BUTTON].setText(this._showDetailsMsg);
	
	// Set the content, enveloped
	this._updateContent();
};

/**
 * Sets/updates the content
 */
ZmErrorDialog.prototype._updateContent = 
function() {
	var data = {
		message: this._msgStr,
		detail: this._detailStr,
		showDetails: this._detailsVisible
	};
	var html = AjxTemplate.expand("zimbra.Widgets#ZmErrorDialogContent", data);
	this.setSize(Dwt.CLEAR, this._detailsVisible ? "300" : Dwt.CLEAR);
	DwtMessageDialog.prototype.setMessage.call(this, html, this._msgStyle, this._msgTitle);
};

/**
 * Pops-up the error dialog.
 * 
 * @param {Object}	loc				the desired location
 * @param {Boolean}	hideReportButton	if <code>true</code>, do not show "Send Error Report" button
 * 
 */
ZmErrorDialog.prototype.popup =
function(loc, hideReportButton) {
	if (hideReportButton) {
		this.setButtonVisible(ZmErrorDialog.REPORT_BUTTON, false);
	}
	DwtMessageDialog.prototype.popup.call(this, loc);
};

/**
 * Pops-down the dialog.
 * 
 */
ZmErrorDialog.prototype.popdown =
function() {
	DwtMessageDialog.prototype.popdown.call(this);

	// reset dialog
	this.setSize(Dwt.CLEAR, Dwt.CLEAR);
	this.setButtonVisible(ZmErrorDialog.REPORT_BUTTON, true);
};

//
// Protected methods
//
/**
 * @private
 */
ZmErrorDialog.prototype._getNavigatorInfo =
function() {
	var strNav = [];
	var idx = 0;

	// Add the url
	strNav[idx++] = "\n\n";
	strNav[idx++] = "href: ";
	strNav[idx++] = location.href;
	strNav[idx++] = "\n";

	for (var i in navigator) {
		// Skip functions
		if(typeof navigator[i] == "function") {continue;}
		if(typeof navigator[i] == "unknown") {continue;}	// IE7
		if(AjxEnv.isIE && i === "mimeTypes") {continue;}
		strNav[idx++] = i + ": " + navigator[i] + "\n";
	}
	return strNav.join("");
};

/**
 * @private
 */
ZmErrorDialog.prototype._getSubjectPrefix = 
function() {
	var strSubj = [];
	var idx = 0;

	strSubj[idx++] = "ER: ";

	if (AjxEnv.isIE) 				strSubj[idx++] = "IE ";
	else if (AjxEnv.isFirefox)		strSubj[idx++] = "FF ";
	else if (AjxEnv.isMozilla)		strSubj[idx++] = "MOZ ";
	else if (AjxEnv.isSafari)		strSubj[idx++] = "SAF ";
	else if (AjxEnv.isOpera)		strSubj[idx++] = "OPE ";
	else							strSubj[idx++] = "UKN ";

	if (AjxEnv.isWindows)			strSubj[idx++] = "WIN ";
	else if (AjxEnv.isLinux)		strSubj[idx++] = "LNX ";
	else if (AjxEnv.isMac)			strSubj[idx++] = "MAC ";
	else							strSubj[idx++] = "UNK ";

	strSubj[idx++] = appCtxt.get(ZmSetting.CLIENT_VERSION) + " ";
	return strSubj.join("");
};

/**
 * @private
 */
ZmErrorDialog.prototype._getUserPrefs = 
function() {
	var currSearch = appCtxt.getCurrentSearch();
	var strPrefs = [];
	var idx = 0;

	// Add username and current search
	strPrefs[idx++] = "\n\n";
	strPrefs[idx++] = "username: ";
	strPrefs[idx++] = appCtxt.get(ZmSetting.USERNAME);
	strPrefs[idx++] = "\n";
	if (currSearch) {
		strPrefs[idx++] = "currentSearch: ";
		strPrefs[idx++] = currSearch.query;
		strPrefs[idx++] = "\n";
	}
	for (var i in ZmSetting.INIT) {
		if (ZmSetting.INIT[i][0]) {
			strPrefs[idx++] = ZmSetting.INIT[i][0];
			strPrefs[idx++] = ": ";
			strPrefs[idx++] = ("" + ZmSetting.INIT[i][3]);
			strPrefs[idx++] = "\n";
		}
	}
	return strPrefs.join("");
};

// Callbacks

/**
 * @private
 */
ZmErrorDialog.prototype._reportCallback =
function() {
	this._iframe = document.createElement("iframe");
	this._iframe.style.width = this._iframe.style.height = 0;
	this._iframe.style.visibility = "hidden";

	var contentDiv = this._getContentDiv();
	contentDiv.appendChild(this._iframe);

	var strPrefs = this._getUserPrefs();
	var formId = Dwt.getNextId();

	// generate html form for submission via POST
	var html = [];
	var idx = 0;
	var subject = this._subjPfx + this._detailStr.substring(0,40);
	var scheme = (location.protocol == 'https:') ? "https:" : "http:";
	html[idx++] = "<html><head></head><body><form id='";
	html[idx++] = formId;
	html[idx++] = "' method='POST' action='";
	html[idx++] = scheme;
	html[idx++] = appCtxt.get(ZmSetting.ERROR_REPORT_URL) || ZmErrorDialog.DEFAULT_REPORT_URL;
	html[idx++] = "'>";
	html[idx++] = "<textarea name='details'>";
	html[idx++] = this._detailStr;
	html[idx++] = "version - ";
	html[idx++] = appCtxt.get(ZmSetting.CLIENT_VERSION);
	html[idx++] = "\n";
	html[idx++] = "release - ";
	html[idx++] = appCtxt.get(ZmSetting.CLIENT_RELEASE);
	html[idx++] = "\n";
	html[idx++] = "date - ";
	html[idx++] = appCtxt.get(ZmSetting.CLIENT_DATETIME);
	html[idx++] = "</textarea><textarea name='navigator'>";
	html[idx++] = this._strNav;
	html[idx++] = "</textarea><textarea name='prefs'>";
	html[idx++] = strPrefs;
	html[idx++] = "</textarea><textarea name='subject'>";
	html[idx++] = subject;
	html[idx++] = "</textarea></form></body></html>";

	var idoc = Dwt.getIframeDoc(this._iframe);
	idoc.open();
	idoc.write(html.join(""));
	idoc.close();

	// submit the form!
	var form = idoc.getElementById(formId);
	if (form) {
		form.submit();
		appCtxt.setStatusMsg(ZmMsg.errorReportSent);
	}

	this.popdown();
};

/**
 * Displays the detail text
 */
ZmErrorDialog.prototype.showDetail = 
function() {
	this._detailsVisible = !this._detailsVisible;
	this._updateContent();
	this._button[ZmErrorDialog.DETAIL_BUTTON].setText(this._detailsVisible ? this._hideDetailsMsg : this._showDetailsMsg);
};
}

if (AjxPackage.define("zimbraMail.share.model.ZmAuthenticate")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * 
 * This file defines authentication.
 *
 */

/**
 * Constructor. Use {@link execute} to construct the authentication.
 * @class
 * This class represents in-app authentication following the expiration of the session.
 * 
 * @see		#execute
 */
ZmAuthenticate = function() {}

ZmAuthenticate.prototype.isZmAuthenticate = true;
ZmAuthenticate.prototype.toString = function() { return "ZmAuthenticate"; };


ZmAuthenticate._isAdmin = false;

/**
 * Sets the authentication as "admin".
 * 
 * @param	{Boolean}	isAdmin		<code>true</code> if admin
 */
ZmAuthenticate.setAdmin =
function(isAdmin) {
	ZmAuthenticate._isAdmin = isAdmin;
};

/**
 * Executes an authentication.
 * 
 * @param	{String}	uname		the username
 * @param	{String}	pword		the password
 * @param	{AjxCallback}	callback	the callback
 */
ZmAuthenticate.prototype.execute =
function(uname, pword, callback) {
	var command = new ZmCsfeCommand();
	var soapDoc;
	if (!ZmAuthenticate._isAdmin) {
		soapDoc = AjxSoapDoc.create("AuthRequest", "urn:zimbraAccount");
		var el = soapDoc.set("account", uname);
		el.setAttribute("by", "name");
	} else {
		soapDoc = AjxSoapDoc.create("AuthRequest", "urn:zimbraAdmin", null);
		soapDoc.set("name", uname);
	}
	soapDoc.set("virtualHost", location.hostname);	
	soapDoc.set("password", pword);
	var respCallback = new AjxCallback(this, this._handleResponseExecute, callback);
	command.invoke({soapDoc: soapDoc, noAuthToken: true, noSession: true, asyncMode: true, callback: respCallback})
};

/**
 * @private
 */
ZmAuthenticate.prototype._handleResponseExecute =
function(callback, result) {
	if (!result.isException()) {
		ZmCsfeCommand.noAuth = false;
	}

	if (callback) {
		callback.run(result);
	}
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmAutocomplete")) {
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
 *
 * This file defines authentication.
 *
 */

/**
 * Creates and initializes support for server-based autocomplete.
 * @class
 * This class manages auto-completion via <code>&lt;AutoCompleteRequest&gt;</code> calls to the server. Currently limited
 * to matching against only one type among people, locations, and equipment.
 *
 * @author Conrad Damon
 */
ZmAutocomplete = function(params) {

	if (arguments.length == 0) {
		return;
	}

	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		var listener = this._settingChangeListener.bind(this);
		var settings = [ZmSetting.GAL_AUTOCOMPLETE, ZmSetting.AUTOCOMPLETE_SHARE, ZmSetting.AUTOCOMPLETE_SHARED_ADDR_BOOKS];
		for (var i = 0; i < settings.length; i++) {
			appCtxt.getSettings().getSetting(settings[i]).addChangeListener(listener);
		}
	}
};

// choices for text in the returned match object
ZmAutocomplete.AC_VALUE_FULL = "fullAddress";
ZmAutocomplete.AC_VALUE_EMAIL = "email";
ZmAutocomplete.AC_VALUE_NAME = "name";

// request control
ZmAutocomplete.AC_TIMEOUT = 20;	// autocomplete timeout (in seconds)

// result types
ZmAutocomplete.AC_TYPE_CONTACT = "contact";
ZmAutocomplete.AC_TYPE_GAL = "gal";
ZmAutocomplete.AC_TYPE_TABLE = "rankingTable";

ZmAutocomplete.AC_TYPE_UNKNOWN = "unknown";
ZmAutocomplete.AC_TYPE_LOCATION = "Location";	// same as ZmResource.ATTR_LOCATION
ZmAutocomplete.AC_TYPE_EQUIPMENT = "Equipment";	// same as ZmResource.ATTR_EQUIPMENT

// icons
ZmAutocomplete.AC_ICON = {};
ZmAutocomplete.AC_ICON[ZmAutocomplete.AC_TYPE_CONTACT] = "Contact";
ZmAutocomplete.AC_ICON[ZmAutocomplete.AC_TYPE_GAL] = "GALContact";
ZmAutocomplete.AC_ICON[ZmAutocomplete.AC_TYPE_LOCATION] = "Location";
ZmAutocomplete.AC_ICON[ZmAutocomplete.AC_TYPE_EQUIPMENT] = "Resource";

// cache control
ZmAutocomplete.GAL_RESULTS_TTL = 900000;	// time-to-live for cached GAL autocomplete results (msec)

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmAutocomplete.prototype.toString =
		function() {
			return "ZmAutocomplete";
		};

/**
 * Returns a list of matching contacts for a given string. The first name, last
 * name, full name, first/last name, and email addresses are matched against.
 *
 * @param {String}					str				the string to match against
 * @param {closure}					callback		the callback to run with results
 * @param {ZmAutocompleteListView}	aclv			the needed to show wait msg
 * @param {ZmZimbraAccount}			account			the account to fetch cached items from
 * @param {Hash}					options			additional options:
 * @param {constant}				 type			 type of result to match; default is {@link ZmAutocomplete.AC_TYPE_CONTACT}; other valid values are for location or equipment
 * @param {Boolean}					needItem		 if <code>true</code>, return a {@link ZmItem} as part of match result
 * @param {Boolean}					supportForget	allow user to reset ranking for a contact (defaults to true)
 */
ZmAutocomplete.prototype.autocompleteMatch =
		function(str, callback, aclv, options, account, autocompleteType) {

			str = str.toLowerCase().replace(/"/g, '');
			this._curAcStr = str;
			DBG.println("ac", "begin autocomplete for " + str);

			var acType = (options && (options.acType || options.type)) || ZmAutocomplete.AC_TYPE_CONTACT;

			var list = this._checkCache(str, acType, account);
			if (!str || (list !== null)) {
				callback(list);
			}
			else {
				aclv.setWaiting(true, str);
				return this._doSearch(str, aclv, options, acType, callback, account, autocompleteType);
			}
		};

ZmAutocomplete.prototype._doSearch =
		function(str, aclv, options, acType, callback, account, autocompleteType) {

			var params = {query:str, isAutocompleteSearch:true};
			if (acType != ZmAutocomplete.AC_TYPE_CONTACT) {
				params.isGalAutocompleteSearch = true;
				params.isAutocompleteSearch = false;
				params.limit = params.limit * 2;
				var searchType = ((acType === ZmAutocomplete.AC_TYPE_LOCATION) || (acType === ZmAutocomplete.AC_TYPE_EQUIPMENT)) ?  ZmItem.RESOURCE : ZmItem.CONTACT;
				params.types = AjxVector.fromArray([searchType]);
				params.galType = params.galType || ZmSearch.GAL_RESOURCE;
				DBG.println("ac", "AutoCompleteGalRequest: " + str);
			} else {
				DBG.println("ac", "AutoCompleteRequest: " + str);
			}
			params.accountName = account && account.name;

			var search = new ZmSearch(params);
			var searchParams = {
				callback:		this._handleResponseDoAutocomplete.bind(this, str, aclv, options, acType, callback, account),
				errorCallback:	this._handleErrorDoAutocomplete.bind(this, str, aclv),
				timeout:		ZmAutocomplete.AC_TIMEOUT,
				noBusyOverlay:	true
			};
			if (autocompleteType) {
				searchParams.autocompleteType = autocompleteType;
			}
            searchParams.offlineCallback = this._handleOfflineDoAutocomplete.bind(this, str, search, searchParams.callback);
			return search.execute(searchParams);
		};

/**
 * @private
 */
ZmAutocomplete.prototype._handleResponseDoAutocomplete =
		function(str, aclv, options, acType, callback, account, result) {

			DBG.println("ac", "got response for " + str);
			aclv.setWaiting(false);

			var resultList, gotContacts = false, hasGal = false;
			var resp = result.getResponse();
			if (resp && resp.search && resp.search.isGalAutocompleteSearch) {
				var cl = resp.getResults(resp.type);
				resultList = (cl && cl.getArray()) || [];
				gotContacts = hasGal = true;
			} else {
				resultList = resp._respEl.match || [];
			}

			DBG.println("ac", resultList.length + " matches");

			var list = [];
			for (var i = 0; i < resultList.length; i++) {
				var match = new ZmAutocompleteMatch(resultList[i], options, gotContacts, str);
				if (match.acType == acType) {
					if (options.excludeGroups && match.isGroup) continue;
					if (match.type == ZmAutocomplete.AC_TYPE_GAL) {
						hasGal = true;
					}
					list.push(match);
				}
			}
			var complete = !(resp && resp.getAttribute("more"));

			// we assume the results from the server are sorted by ranking
			callback(list);
			this._cacheResults(str, acType, list, hasGal, complete && resp._respEl.canBeCached, null, account);
		};

/**
 * Handle timeout.
 *
 * @private
 */
ZmAutocomplete.prototype._handleErrorDoAutocomplete =
		function(str, aclv, ex) {
			DBG.println("ac", "error on request for " + str + ": " + ex.toString());
			aclv.setWaiting(false);
			appCtxt.setStatusMsg({msg:ZmMsg.autocompleteFailed, level:ZmStatusView.LEVEL_WARNING});

			return true;
		};

/**
 * @private
 */
ZmAutocomplete.prototype._handleOfflineDoAutocomplete =
function(str, search, callback) {
    if (str) {
        var autoCompleteCallback = this._handleOfflineResponseDoAutocomplete.bind(this, search, callback);
        ZmOfflineDB.searchContactsForAutoComplete(str, autoCompleteCallback);
    }
};

ZmAutocomplete.prototype._handleOfflineResponseDoAutocomplete =
function(search, callback, result) {
    var match = [];
    result.forEach(function(contact) {
        var attrs = contact._attrs;
		if (attrs) {
			var obj = {
				id : contact.id,
				l : contact.l
			};
			if (attrs.fullName) {
				var fullName = attrs.fullName;
			}
			else {
				var fullName = [];
				if (attrs.firstName) {
					fullName.push(attrs.firstName);
				}
				if (attrs.middleName) {
					fullName.push(attrs.middleName);
				}
				if (attrs.lastName) {
					fullName.push(attrs.lastName);
				}
				fullName = fullName.join(" ");
			}
			if (attrs.email) {
				obj.email = '"' + fullName + '" <' + attrs.email + '>';
			}
			else if (attrs.type === "group") {
				obj.display = fullName;
				obj.type = ZmAutocomplete.AC_TYPE_CONTACT;
				obj.exp = true;
				obj.isGroup = true;
			}
			match.push(obj);
		}
    });
    if (callback) {
        var zmSearchResult = new ZmSearchResult(search);
        var response = {
            match : match
        };
        zmSearchResult.set(response);
        var zmCsfeResult = new ZmCsfeResult(zmSearchResult);
        callback(zmCsfeResult);
    }
};

/**
 * Sort auto-complete list by ranking scores.
 *
 * @param	{ZmAutocomplete}	a		the auto-complete list
 * @param	{ZmAutocomplete}	b		the auto-complete list
 * @return	{int}	0 if the lists match; 1 if "a" is before "b"; -1 if "b" is before "a"
 */
ZmAutocomplete.acSortCompare =
		function(a, b) {
			var aScore = (a && a.score) || 0;
			var bScore = (b && b.score) || 0;
			return (aScore > bScore) ? 1 : (aScore < bScore) ? -1 : 0;
		};

/**
 * Checks if the given string is a valid email.
 *
 * @param {String}	str		a string
 * @return	{Boolean}	<code>true</code> if a valid email
 */
ZmAutocomplete.prototype.isComplete =
		function(str) {
			return AjxEmailAddress.isValid(str);
		};

/**
 * Asks the server to drop an address from the ranking table.
 *
 * @param {string}	addr		email address
 * @param {closure}	callback	callback to run after response
 */
ZmAutocomplete.prototype.forget =
		function(addr, callback) {

			var jsonObj = {RankingActionRequest:{_jsns:"urn:zimbraMail"}};
			jsonObj.RankingActionRequest.action = {op:"delete", email:addr};
			var respCallback = this._handleResponseForget.bind(this, callback);
			var aCtxt = appCtxt.isChildWindow ? parentAppCtxt : appCtxt;
			aCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
		};

ZmAutocomplete.prototype._handleResponseForget =
		function(callback) {
			appCtxt.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
			if (appCtxt.isChildWindow) {
				parentAppCtxt.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
			}
			if (callback) {
				callback();
			}
		};

/**
 * Expands a contact which is a DL and returns a list of its members.
 *
 * @param {ZmContact}	contact		DL contact
 * @param {int}			offset		member to start with (in case we're paging a large DL)
 * @param {closure}		callback	callback to run with results
 */
ZmAutocomplete.prototype.expandDL =
		function(contact, offset, callback) {

			var respCallback = this._handleResponseExpandDL.bind(this, contact, callback);
			contact.getDLMembers(offset, null, respCallback);
		};

ZmAutocomplete.prototype._handleResponseExpandDL =
		function(contact, callback, result) {

			var list = result.list;
			var matches = [];
			if (list && list.length) {
				for (var i = 0, len = list.length; i < len; i++) {
					var addr = list[i];
					var match = {};
					match.type = ZmAutocomplete.AC_TYPE_GAL;
					match.email = addr;
					match.isGroup = result.isDL[addr];
					matches.push(new ZmAutocompleteMatch(match, null, false, contact && contact.str));
				}
			}
			if (callback) {
				callback(matches);
			}
		};

/**
 * @param acType		[constant]			type of result to match
 * @param str			[string]			string to match against
 * @param account		[ZmZimbraAccount]*	account to check cache against
 * @param create		[boolean]			if <code>true</code>, create a cache if none found
 *
 * @private
 */
ZmAutocomplete.prototype._getCache =
		function(acType, str, account, create) {
			var context = AjxEnv.isIE ? window.appCtxt : window.parentAppCtxt || window.appCtxt;
			return context.getAutocompleteCache(acType, str, account, create);
		};

/**
 * @param str			[string]			string to match against
 * @param acType		[constant]			type of result to match
 * @param list			[array]				list of matches
 * @param hasGal		[boolean]*			if true, list includes GAL results
 * @param cacheable		[boolean]*			server indication of cacheability
 * @param baseCache		[hash]*				cache that is superset of this one
 * @param account		[ZmZimbraAccount]*	account to check cache against
 *
 * @private
 */
ZmAutocomplete.prototype._cacheResults =
		function(str, acType, list, hasGal, cacheable, baseCache, account) {

			var cache = this._getCache(acType, str, account, true);
			cache.list = list;
			// we always cache; flag below indicates whether we can do forward matching
			cache.cacheable = (baseCache && baseCache.cacheable) || cacheable;
			if (hasGal) {
				cache.ts = (baseCache && baseCache.ts) || (new Date()).getTime();
			}
		};

/**
 * @private
 *
 * TODO: substring result matching for multiple tokens, eg "tim d"
 */
ZmAutocomplete.prototype._checkCache =
		function(str, acType, account) {

			// check cache for results for this exact string
			var cache = this._getCachedResults(str, acType, null, account);
			var list = cache && cache.list;
			if (list !== null) {
				return list;
			}

			return null;
		};

/**
 * See if we have cached results for the given string. If the cached results have a
 * timestamp, we make sure they haven't expired.
 *
 * @param str				[string]			string to match against
 * @param acType			[constant]			type of result to match
 * @param checkCacheable	[boolean]			if true, make sure results are cacheable
 * @param account			[ZmZimbraAccount]*	account to fetch cached results from
 *
 * @private
 */
ZmAutocomplete.prototype._getCachedResults =
		function(str, acType, checkCacheable, account) {

			var cache = this._getCache(acType, str, account);
			if (cache) {
				if (checkCacheable && (cache.cacheable === false)) {
					return null;
				}
				if (cache.ts) {
					var now = (new Date()).getTime();
					if (now > (cache.ts + ZmAutocomplete.GAL_RESULTS_TTL)) {
						return null;	// expired GAL results
					}
				}
				DBG.println("ac", "cache hit for " + str);
				return cache;
			} else {
				return null;
			}
		};

/**
 * Clears contact autocomplete cache on change to any related setting.
 *
 * @private
 */
ZmAutocomplete.prototype._settingChangeListener =
		function(ev) {
			if (ev.type != ZmEvent.S_SETTING) {
				return;
			}
			var context = AjxEnv.isIE ? window.appCtxt : window.parentAppCtxt || window.appCtxt;
			context.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
		};


/**
 * Creates an auto-complete match.
 * @class
 * This class represents an auto-complete result, with fields for the caller to look at, and fields to
 * help with further matching.
 *
 * @param {Object}	match		the JSON match object or a {@link ZmContact} object
 * @param {Object}	options		the matching options
 * @param {Boolean}	isContact	if <code>true</code>, provided match is a {@link ZmContact}
 */
ZmAutocompleteMatch = function(match, options, isContact, str) {
	// TODO: figure out how to minimize loading of calendar code
	AjxDispatcher.require(["MailCore", "CalendarCore"]);
	if (!match) {
		return;
	}
	this.type = match.type;
	this.str = str;
	var ac = window.parentAppCtxt || window.appCtxt;
	if (isContact) {
		this.text = this.name = match.getFullName();
		this.email = match.getEmail();
		this.item = match;
		this.type = ZmContact.getAttr(match, ZmResource && ZmResource.F_type || "zimbraCalResType") || ZmAutocomplete.AC_TYPE_GAL;
		this.fullAddress = (new AjxEmailAddress(this.email, null, this.text)).toString(); //bug:60789 formated the email and name to get fullAddress
	} else {
		this.isGroup = Boolean(match.isGroup);
		this.isDL = (this.isGroup && this.type == ZmAutocomplete.AC_TYPE_GAL);
		if (this.isGroup && !this.isDL) {
			// Local contact group; emails need to be looked up by group member ids. 
			var contactGroup = ac.cacheGet(match.id);
			if (contactGroup && contactGroup.isLoaded) {
				this.setContactGroupMembers(match.id);
			}
			else {
				//not a contact group that is in cache.  we'll need to deref it
				this.needDerefGroup = true;
				this.groupId = match.id;
			}
			this.name = match.display;
			this.text = match.display || this.email;
			this.icon = "Group";
		} else {
			// Local contact, GAL contact, or distribution list
			var email = AjxEmailAddress.parse(match.email);
			if (email) {
				this.email = email.getAddress();
				if (this.type == ZmAutocomplete.AC_TYPE_CONTACT) {
					var contactList = AjxDispatcher.run("GetContacts");
					var contact = contactList && contactList.getById(match.id);
					if (contact) {
						var displayName = contact && contact.getFullNameForDisplay(false);
						this.fullAddress = "\"" + displayName + "\" <" + email.getAddress() + ">";
						this.name = displayName;
						this.text = this.fullAddress;
					}
					else {
						//we assume if we don't get contact object, its a shared contact.
						this.fullAddress = email.toString();
						this.name = email.getName();
						this.email = email.getAddress();
						this.text = this.fullAddress;
					}
				} else {
					this.fullAddress = email.toString();
					this.name = email.getName();
					this.text = match.email;
				}
			} else {
				this.email = match.email;
				this.text = match.email;
			}
			if (options && options.needItem && window.ZmContact) {
				this.item = new ZmContact(null);
				this.item.initFromEmail(email || match.email);
			}
			this.icon = this.isDL ? "Group" : ZmAutocomplete.AC_ICON[match.type];
			this.canExpand = this.isDL && match.exp;
			ac.setIsExpandableDL(this.email, this.canExpand);
		}
	}
	this.score = (match.ranking && parseInt(match.ranking)) || 0;
	this.icon = this.icon || ZmAutocomplete.AC_ICON[ZmAutocomplete.AC_TYPE_CONTACT];
	this.acType = (this.type == ZmAutocomplete.AC_TYPE_LOCATION || this.type == ZmAutocomplete.AC_TYPE_EQUIPMENT)
			? this.type : ZmAutocomplete.AC_TYPE_CONTACT;
	if (this.type == ZmAutocomplete.AC_TYPE_LOCATION || this.type == ZmAutocomplete.AC_TYPE_EQUIPMENT) {
		this.icon = ZmAutocomplete.AC_ICON[this.type];
	}
};

/**
 * Sets the email & fullAddress properties of a contact group
 * @param groupId {String} contact group id to lookup from cache
 * @param callback {AjxCallback} callback to be run
 */
ZmAutocompleteMatch.prototype.setContactGroupMembers =
		function(groupId, callback) {
			var ac = window.parentAppCtxt || window.appCtxt;
			var contactGroup = ac.cacheGet(groupId);
			if (contactGroup) {
				var groups = contactGroup.getGroupMembers();
				var addresses = (groups && groups.good && groups.good.getArray()) || [];
				var emails = [], addrs = [];
				for (var i = 0; i < addresses.length; i++) {
					var addr = addresses[i];
					emails.push(addr.getAddress());
					addrs.push(addr.toString());
				}
				this.email = emails.join(AjxEmailAddress.SEPARATOR);
				this.fullAddress = addrs.join(AjxEmailAddress.SEPARATOR);
			}
			if (callback) {
				callback.run();
			}
		};

/**
 * Returns a string representation of the object.
 *
 * @return		{String}		a string representation of the object
 */
ZmAutocompleteMatch.prototype.toString =
		function() {
			return "ZmAutocompleteMatch";
		};

/**
 * Matches the given string to this auto-complete result.
 *
 * @param {String}	str		the string
 * @return	{Boolean}	<code>true</code> if the given string matches this result
 */
ZmAutocompleteMatch.prototype.matches =
		function(str) {
			if (this.name && !this._nameParsed) {
				var parts = this.name.split(/\s+/, 3);
				var firstName = parts[0];
				this._lastName = parts[parts.length - 1];
				this._firstLast = [firstName, this._lastName].join(" ");
				this._nameParsed = true;
			}

			var fields = [this.email, this.name, this._lastName, this._firstLast];
			for (var i = 0; i < fields.length; i++) {
				var f = fields[i] && fields[i].toLowerCase();
				if (f && (f.indexOf(str) == 0)) {
					return true;
				}
			}
			return false;
		};

/**
 * Creates a search auto-complete.
 * @class
 * This class supports auto-complete for our query language. Each search operator that is supported has an associated handler.
 * A handler is a hash which contains the info needed for auto-complete. A handler can have the following properties:
 *
 * <ul>
 * <li><b>listType</b> - A handler needs a list of objects to autocomplete against. By default, that list is
 *						 identified by the operator. If more than one operator uses the same list, their handlers
 *						 should use this property to identify the list.</li>
 * <li><b>loader</b> - Function that populates the list of objects. Lists used by more than one operator provide
 *						 their loader separately.</li>
 * <li><b>text</b> - Function that returns a string value of data, to autocomplete against and to display in the
 *						 autocomplete list.</li>
 * <li><b>icon</b> - Function that returns an icon to display in the autocomplete list.</li>
 * <li><b>matchText</b> - Function that returns a string to place in the input when the item is selected. Defaults to
 *						 the 'op:' plus the value of the 'text' attribute.</li>
 * <li><b>quoteMatch</b> - If <code>true</code>, the text that goes into matchText will be place in double quotes.</li>
 * </ul>
 *
 */
ZmSearchAutocomplete = function() {

	this._op = {};
	this._list = {};
	this._loadFunc = {};

	var params = {
		loader:		this._loadTags,
		text:		function(o) {
			return o.getName(false, null, true, true);
		},
		icon:		function(o) {
			return o.getIconWithColor();
		},
		matchText:	function(o) {
			return o.createQuery();
		}
	};
	this._registerHandler("tag", params);

	params = {
		listType:	ZmId.ORG_FOLDER,
		text:		function(o) {
			return o.getPath(false, false, null, true, false);
		},
		icon:		function(o) {
			return o.getIconWithColor();
		},
		matchText:	function(o) {
			return o.createQuery();
		}
	};
	this._loadFunc[ZmId.ORG_FOLDER] = this._loadFolders;
	this._registerHandler("in", params);
	params.matchText = function(o) {
		return "under:" + '"' + o.getPath() + '"';
	};
	this._registerHandler("under", params);

	params = { loader:		this._loadFlags };
	this._registerHandler("is", params);

	params = {
		loader:		this._loadObjects,
		icon:		function(o) {
			return ZmSearchAutocomplete.ICON[o];
		}
	};
	this._registerHandler("has", params);

	this._loadFunc[ZmId.ITEM_ATT] = this._loadTypes;
	params = {listType:		ZmId.ITEM_ATT,
		text:			function(o) {
			return o.desc;
		},
		icon:			function(o) {
			return o.image;
		},
		matchText:	function(o) {
			return "type:" + (o.query || o.type);
		},
		quoteMatch:	true
	};
	this._registerHandler("type", params);
	params = {listType:		ZmId.ITEM_ATT,
		text:			function(o) {
			return o.desc;
		},
		icon:			function(o) {
			return o.image;
		},
		matchText:	function(o) {
			return "attachment:" + (o.query || o.type);
		},
		quoteMatch:	true
	};
	this._registerHandler("attachment", params);

	params = {
		loader:		this._loadCommands
	};
	this._registerHandler("set", params);

	var folderTree = appCtxt.getFolderTree();
	if (folderTree) {
		folderTree.addChangeListener(this._folderTreeChangeListener.bind(this));
	}
	var tagTree = appCtxt.getTagTree();
	if (tagTree) {
		tagTree.addChangeListener(this._tagTreeChangeListener.bind(this));
	}
};

ZmSearchAutocomplete.prototype.isZmSearchAutocomplete = true;
ZmSearchAutocomplete.prototype.toString = function() {
	return "ZmSearchAutocomplete";
};

ZmSearchAutocomplete.ICON = {};
ZmSearchAutocomplete.ICON["attachment"] = "Attachment";
ZmSearchAutocomplete.ICON["phone"] = "Telephone";
ZmSearchAutocomplete.ICON["url"] = "URL";

/**
 * @private
 */
ZmSearchAutocomplete.prototype._registerHandler = function(op, params) {

	var loadFunc = params.loader || this._loadFunc[params.listType];
	this._op[op] = {
		loader:     loadFunc.bind(this),
		text:       params.text, icon:params.icon,
		listType:   params.listType || op, matchText:params.matchText || params.text,
		quoteMatch: params.quoteMatch
	};
};

/**
 * Returns a list of matches for a given query operator.
 *
 * @param {String}					str			the string to match against
 * @param {closure}					callback	the callback to run with results
 * @param {ZmAutocompleteListView}	aclv		needed to show wait msg
 * @param {Hash}					options		a hash of additional options
 */
ZmSearchAutocomplete.prototype.autocompleteMatch = function(str, callback, aclv, options) {

	if (ZmSearchAutocomplete._ignoreNextKey) {
		ZmSearchAutocomplete._ignoreNextKey = false;
		return;
	}

	str = str.toLowerCase().replace(/"/g, '');

	var idx = str.lastIndexOf(" ");
	if (idx != -1 && idx <= str.length) {
		str = str.substr(idx + 1);
	}
	var m = str.match(/\b-?\$?([a-z]+):/);
	if (!(m && m.length)) {
		callback();
		return;
	}

	var op = m[1];
	var opHash = this._op[op];
	if (!opHash) {
		callback();
		return;
	}
	var list = this._list[opHash.listType];
	if (list) {
		callback(this._getMatches(op, str));
	} else {
		var respCallback = this._handleResponseLoad.bind(this, op, str, callback);
		this._list[opHash.listType] = [];
		opHash.loader(opHash.listType, respCallback);
	}
};

// TODO - some validation of search ops and args
ZmSearchAutocomplete.prototype.isComplete = function(str, returnStr) {

	var pq = new ZmParsedQuery(str);
	var tokens = pq.getTokens();
	if (!pq.parseFailed && tokens && (tokens.length == 1)) {
		return returnStr ? tokens[0].toString() : true;
	}
	else {
		return false;
	}
};

ZmSearchAutocomplete.prototype.getAddedBubbleClass = function(str) {

	var pq = new ZmParsedQuery(str);
	var tokens = pq.getTokens();
	return (!pq.parseFailed && tokens && (tokens.length == 1) && tokens[0].type);
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._getMatches = function(op, str) {

	var opHash = this._op[op];
	var results = [], app;
	var list = this._list[opHash.listType];
	var rest = str.substr(str.indexOf(":") + 1);
	if (opHash.listType == ZmId.ORG_FOLDER) {
		rest = rest.replace(/^\//, "");	// remove leading slash in folder path
		app = appCtxt.getCurrentAppName();
		if (!ZmApp.ORGANIZER[app]) {
			app = null;
		}
	}
	for (var i = 0, len = list.length; i < len; i++) {
		var o = list[i];
		var text = opHash.text ? opHash.text(o) : o;
		var test = text.toLowerCase();
		if (app && ZmOrganizer.APP[o.type] != app) {
			continue;
		}
		if (!rest || (test.indexOf(rest) == 0)) {
			var matchText = opHash.matchText ? opHash.matchText(o) :
					opHash.quoteMatch ? [op, ":", '"', text, '"'].join("") :
							[op, ":", text].join("");
			matchText = str.replace(op + ":" + rest, matchText);
			results.push({text:			text,
				icon:			opHash.icon ? opHash.icon(o) : null,
				matchText:	matchText,
				exactMatch:	(test.length == rest.length)});
		}
	}

	// no need to show list of one item that is same as what was typed
	if (results.length == 1 && results[0].exactMatch) {
		results = [];
	}

	return results;
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._handleResponseLoad = function(op, str, callback) {
	callback(this._getMatches(op, str));
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadTags = function(listType, callback) {

	var list = this._list[listType];
	var tags = appCtxt.getTagTree().asList();
	for (var i = 0, len = tags.length; i < len; i++) {
		var tag = tags[i];
		if (tag.id != ZmOrganizer.ID_ROOT) {
			list.push(tag);
		}
	}
	list.sort(ZmTag.sortCompare);
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadFolders = function(listType, callback) {

	var list = this._list[listType];
	var folderTree = appCtxt.getFolderTree();
	var folders = folderTree ? folderTree.asList({includeRemote:true}) : [];
	for (var i = 0, len = folders.length; i < len; i++) {
		var folder = folders[i];
		if (folder.id !== ZmOrganizer.ID_ROOT && !ZmFolder.HIDE_ID[folder.id] && folder.id !== ZmFolder.ID_DLS) {
			list.push(folder);
		}
	}
	list.sort(ZmFolder.sortComparePath);
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadFlags = function(listType, callback) {

	var flags = AjxUtil.filter(ZmParsedQuery.IS_VALUES, function(flag) {
		return appCtxt.checkPrecondition(ZmParsedQuery.IS_VALUE_PRECONDITION[flag]);
	});
	this._list[listType] = flags.sort();
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadObjects = function(listType, callback) {

	var list = this._list[listType];
	list.push("attachment");
	var idxZimlets = appCtxt.getZimletMgr().getIndexedZimlets();
	if (idxZimlets.length) {
		for (var i = 0; i < idxZimlets.length; i++) {
			list.push(idxZimlets[i].keyword);
		}
	}
	list.sort();
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadTypes = function(listType, callback) {

	AjxDispatcher.require("Extras");
	var attachTypeList = new ZmAttachmentTypeList();
	var respCallback = this._handleResponseLoadTypes.bind(this, attachTypeList, listType, callback);
	attachTypeList.load(respCallback);
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._handleResponseLoadTypes = function(attachTypeList, listType, callback) {

	this._list[listType] = attachTypeList.getAttachments();
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._loadCommands = function(listType, callback) {

	var list = this._list[listType];
	for (var funcName in ZmClientCmdHandler.prototype) {
		if (funcName.indexOf("execute_") == 0) {
			list.push(funcName.substr(8));
		}
	}
	list.sort();
	if (callback) {
		callback();
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._folderTreeChangeListener = function(ev) {

	var fields = ev.getDetail("fields");
	if (ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_CREATE || ev.event == ZmEvent.E_MOVE ||
			((ev.event == ZmEvent.E_MODIFY) && fields && fields[ZmOrganizer.F_NAME])) {

		var listType = ZmId.ORG_FOLDER;
		if (this._list[listType]) {
			this._list[listType] = [];
			this._loadFolders(listType);
		}
	}
};

/**
 * @private
 */
ZmSearchAutocomplete.prototype._tagTreeChangeListener = function(ev) {

	var fields = ev.getDetail("fields");
	if (ev.event == ZmEvent.E_DELETE || ev.event == ZmEvent.E_CREATE || ev.event == ZmEvent.E_MOVE ||
			((ev.event == ZmEvent.E_MODIFY) && fields && fields[ZmOrganizer.F_NAME])) {

		var listType = "tag";
		if (this._list[listType]) {
			this._list[listType] = [];
			this._loadTags(listType);
		}
	}
};

/**
 * Creates a people search auto-complete.
 * @class
 * This class supports auto-complete for searching the GAL and the user's
 * personal contacts.
 */
ZmPeopleSearchAutocomplete = function() {
	// no need to call ctor
	//	this._acRequests = {};
};

ZmPeopleSearchAutocomplete.prototype = new ZmAutocomplete;
ZmPeopleSearchAutocomplete.prototype.constructor = ZmPeopleSearchAutocomplete;

ZmPeopleSearchAutocomplete.prototype.toString = function() { return "ZmPeopleSearchAutocomplete"; };

ZmPeopleSearchAutocomplete.prototype._doSearch = function(str, aclv, options, acType, callback, account) {

	var params = {
		query: str,
		types: AjxVector.fromArray([ZmItem.CONTACT]),
		sortBy: ZmSearch.NAME_ASC,
		contactSource: ZmId.SEARCH_GAL,
		accountName: account && account.name
	};

	var search = new ZmSearch(params);

	var searchParams = {
		callback:		this._handleResponseDoAutocomplete.bind(this, str, aclv, options, acType, callback, account),
		errorCallback:	this._handleErrorDoAutocomplete.bind(this, str, aclv),
		timeout:		ZmAutocomplete.AC_TIMEOUT,
		noBusyOverlay:	true
	};
	return search.execute(searchParams);
};

/**
 * @private
 */
ZmPeopleSearchAutocomplete.prototype._handleResponseDoAutocomplete = function(str, aclv, options, acType, callback, account, result) {

	// if we get back results for other than the current string, ignore them
	if (str != this._curAcStr) {
		return;
	}

	var resp = result.getResponse();
	var cl = resp.getResults(ZmItem.CONTACT);
	var resultList = (cl && cl.getArray()) || [];
	var list = [];

	for (var i = 0; i < resultList.length; i++) {
		var match = new ZmAutocompleteMatch(resultList[i], options, true);
		list.push(match);
	}
	var complete = !(resp && resp.getAttribute("more"));

	// we assume the results from the server are sorted by ranking
	callback(list);
	this._cacheResults(str, acType, list, true, complete && resp._respEl.canBeCached, null, account);
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmInvite")) {
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
 * @overview
 * This file defines a calendar appointment invite.
 *
 */

/**
 * Creates an invite.
 * @class
 * This class represents an invite to a calendar appointment.
 * 
 * @extends	ZmModel
 */
ZmInvite = function() {
	ZmModel.call(this);
};

ZmInvite.prototype = new ZmModel;
ZmInvite.prototype.constructor = ZmInvite;


// Consts
ZmInvite.CHANGES_LOCATION	= "location";
ZmInvite.CHANGES_SUBJECT	= "subject";
ZmInvite.CHANGES_RECURRENCE	= "recurrence";
ZmInvite.CHANGES_TIME		= "time";
ZmInvite.TASK		= "task";


/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmInvite.prototype.toString = 
function() {
	return "ZmInvite: name=" + this.name + " id=" + this.id;
};

/**
 * Function that will be used to send requests. This should be set via ZmInvite.setSendFunction.
 * 
 * @private
 */
ZmInvite._sendFun = null;

// Class methods

/**
 * Creates the invite from the DOM.
 * 
 * @param	{Object}	node	the node
 * @return	{ZmInvite}	the newly created invite
 */
ZmInvite.createFromDom = 
function(node) {
	var invite = new ZmInvite();
	invite.components = node[0].comp;
	invite.replies = node[0].replies;
    invite.id = node[0].id;
	// not sure why components are null .. but.
	if (invite.components == null) {
		invite.components = [{}];
		invite.components.empty = true;
	}
	var inv = node[0];
	if (inv.tz) {
		for (var i = 0; i < inv.tz.length; i++) {
			// get known rule
			var tz = inv.tz[i];
			var rule = AjxTimezone.getRule(tz.id);

			// get known rule that exactly matches tz definition
			if (!rule) {
				var tzrule = {
					standard: tz.standard ? AjxUtil.createProxy(tz.standard[0]) : {},
					daylight: tz.daylight ? AjxUtil.createProxy(tz.daylight[0]) : null
				};
				tzrule.standard.offset = tz.stdoff;
				delete tzrule.standard._object_;
				if (tz.daylight) {
					tzrule.daylight.offset = tz.dayoff;
					delete tzrule.daylight._object_;
				}

				rule = AjxTimezone.getRule(tz.id, tzrule);
				if (rule) {
					var alias = AjxUtil.createProxy(rule);
					alias.aliasId = rule.clientId;
					alias.clientId = tz.id;
					alias.serverId = tz.id;
					AjxTimezone.addRule(alias);
				}
			}

			// add custom rule to known list
			if (!rule) {
				rule = { clientId: tz.id, serverId: tz.id, autoDetected: true };
				if (tz.daylight) {
					rule.standard = AjxUtil.createProxy(tz.standard[0]);
					rule.standard.offset = tz.stdoff;
					rule.standard.trans = AjxTimezone.createTransitionDate(rule.standard);

					rule.daylight = AjxUtil.createProxy(tz.daylight[0]);
					rule.daylight.offset = tz.dayoff;
					rule.daylight.trans = AjxTimezone.createTransitionDate(rule.daylight);
				}
				else {
					rule.standard = { offset: tz.stdoff };
				}
				AjxTimezone.addRule(rule);
			}
		}
	}
	invite.type = inv && inv.type ? inv.type : "appt";
	return invite;
};

/**
 * Sets the message id.
 * 
 * @param	{String}	id		the message id
 */
ZmInvite.prototype.setMessageId = 
function (id) {
	this.msgId = id;
};

/**
 * Gets the message id.
 * 
 * @return	{String}	the message id
 */
ZmInvite.prototype.getMessageId = 
function() {
	return this.msgId;
};

/**
 * Gets the component.
 * 
 * @param	{String}	id	the component id
 * @return	{Object}	the component
 */
ZmInvite.prototype.getComponent = 
function(id) {
	return this.components[id];
};

/**
 * Gets the components.
 * 
 * @return	{Array}	an array of components
 */
ZmInvite.prototype.getComponents = 
function () {
	return this.components;
};

/**
 * Checks if the invite has multiple components.
 * 
 * @return	{Boolean}	<code>true</code> if the invite has one or more components
 */
ZmInvite.prototype.hasMultipleComponents = 
function() {
	return (this.components.length > 1);
};

/**
 * Checks if the invite has other attendees.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if the invite has more than one other attendee
 */
ZmInvite.prototype.hasOtherAttendees =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn].at && this.components[cn].at.length > 0;
};

/**
 * Checks if the invite has other individual (non-location & resource) attendees.
 *
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if the invite has more than one other individual attendee
 */
ZmInvite.prototype.hasOtherIndividualAttendees =
function(compNum) {
    var cn  = compNum || 0;
    var att = this.components[cn].at;
    var otherFound = false;

    if (att && att.length) {
        for (var i = 0; i < att.length; i++) {
            if (!att[i].cutype || (att[i].cutype == ZmCalendarApp.CUTYPE_INDIVIDUAL)) {
                otherFound = true;
                break;
            }
        }
    }
    return otherFound;
};

/**
 * Gets the event name.
 *  
 * @param	{int}	compNum		the component number
 * @return	{String}	the name or <code>null</code> for none
 */
ZmInvite.prototype.getEventName = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].name : null;
};

/**
 * Gets the alarm.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the alarm or <code>null</code> for none
 */
ZmInvite.prototype.getAlarm = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].alarm : null;
};

/**
 * Gets the invite method.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String} the method or <code>null</code> for none
 */
ZmInvite.prototype.getInviteMethod =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].method : null;
};

/**
 * Gets the sequence no
 *
 * @param	{int}	compNum		the component number
 * @return	{String} the sequence no
 */
ZmInvite.prototype.getSequenceNo =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].seq : null;
};

/**
 * Gets the organizer email.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the organizer email or <code>null</code> for none
 */
ZmInvite.prototype.getOrganizerEmail =
function(compNum) {
	var cn = compNum || 0;
	return (this.components[cn] && this.components[cn].or && this.components[cn].or.url)
		? (this.components[cn].or.url.replace("MAILTO:", "")) : null;
};

/**
 * Gets the organizer name.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the organizer name or <code>null</code> for none
 */
ZmInvite.prototype.getOrganizerName = 
function(compNum) {
	var cn = compNum || 0;
	return (this.components[cn] && this.components[cn].or)
		? (this.components[cn].or.d || this.components[cn].or.url) : null;
};

/**
 * Gets the sent by.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the sent by or <code>null</code> for none
 */
ZmInvite.prototype.getSentBy =
function(compNum) {
	var cn = compNum || 0;
	return (this.components[cn] && this.components[cn].or)
		? this.components[cn].or.sentBy : null;
};

/**
 * Checks if is organizer.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if is organizer
 */
ZmInvite.prototype.isOrganizer =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? (!!this.components[cn].isOrg) : false;
};

/**
 * Gets the RSVP.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the RSVP or <code>null</code> for none
 */
ZmInvite.prototype.shouldRsvp =
function(compNum){
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].rsvp : null;
};

/**
 * Gets the recurrence.
 * 
 * @param	{int}	compNum		the component number
 * @return	{ZmRecurrence}	the recurrence
 */
ZmInvite.prototype.getRecurrenceRules = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn].recur;
};

/**
 * Gets the attendees.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Array}	an array of attendees or an empty array for none
 */
ZmInvite.prototype.getAttendees =
function(compNum) {
	var cn = compNum || 0;
	var att = this.components[cn].at;
	var list = [];

	if (!(att && att.length)) { return list; }

	for (var i = 0; i < att.length; i++) {
		if (!att[i].cutype || (att[i].cutype == ZmCalendarApp.CUTYPE_INDIVIDUAL)) {
			list.push(att[i]);
		}
	}
	return list;
};

/**
 * Gets the replies.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the reply
 */
ZmInvite.prototype.getReplies =
function(compNum) {
	var cn = compNum || 0;
	return (this.replies && this.replies[cn]) ? this.replies[cn].reply : null;
};

/**
 * Gets the resources.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Array}	an array of resources
 */
ZmInvite.prototype.getResources =
function(compNum) {
	var cn = compNum || 0;
	var att = this.components[cn].at;
	var list = [];

	if (!(att && att.length)) { return list; }

	for (var i = 0; i < att.length; i++) {
		if (att[i].cutype == ZmCalendarApp.CUTYPE_RESOURCE || 
		    att[i].cutype == ZmCalendarApp.CUTYPE_ROOM      ) {
			list.push(att[i]);
		}
	}
	return list;
};

/**
 * Gets the except id.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the except id
 */
ZmInvite.prototype.getExceptId =
function(compNum) {
	var cn = compNum || 0;
	return (this.components[cn] && this.components[cn].exceptId)
		? this.components[cn].exceptId[0] : null;
};

/**
 * Gets the appointment id.
 * 
 * @param	{int}	compNum		the component number
 * @return {String}	the id
 */
ZmInvite.prototype.getAppointmentId =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn].apptId;
};

/**
 * Gets the status.
 *
 * @param	{int}	compNum		the component number
 * @return {String}	the status
 */
ZmInvite.prototype.getStatus =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn].status;
};

/**
 * Gets the transparency.
 *
 * @param	{int}	compNum		the component number
 * @return {String}	the transparent value
 */
ZmInvite.prototype.getTransparency = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn].transp;
};

/**
 * Checks if the invite is empty.
 * 
 * @return	{Boolean}	<code>true</code> if the invite is empty
 */
ZmInvite.prototype.isEmpty =
function() {
	return Boolean(this.components.empty);
};

/**
 * Checks if the invite is an exception.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if exception
 */
ZmInvite.prototype.isException = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].ex : false;
};

/**
 * Checks if the invite is recurring.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if recurring
 * @see		#getRecurrenceRules
 */
ZmInvite.prototype.isRecurring =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].recur : false;
};

/**
 * Checks if the invite is an all day event.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if an all day event
 */
ZmInvite.prototype.isAllDayEvent = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].allDay == "1" : false;
};

/**
 * Checks if the invite is multi-day.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if the invite is multi-day
 */
ZmInvite.prototype.isMultiDay =
function(compNum) {
	var cn = compNum || 0;
	var sd = this.getServerStartDate(cn);
	var ed = this.getServerEndDate(cn);

    if(!sd) return false;

	return (sd.getDate() != ed.getDate()) || (sd.getMonth() != ed.getMonth()) || (sd.getFullYear() != ed.getFullYear());
};

/**
 * Gets the description html.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the description html or <code>null</code> for none
 */
ZmInvite.prototype.getComponentDescriptionHtml =
function(compNum) {
	var cn = compNum || 0;
	var comp = this.components[cn];
	if (comp == null) { return; }

	var desc = comp.descHtml;
	var content = desc && desc[0]._content || null;
	if (!content) {
		var txtContent = comp.desc;
        txtContent = (txtContent && txtContent[0]._content) || null;
        content = txtContent ? AjxStringUtil.convertToHtml(txtContent) : null;
		if (!content) {
			var msg = appCtxt.getById(this.getMessageId());
			if (msg && msg.hasContentType) {
				content = msg.hasContentType(ZmMimeTable.TEXT_HTML) ? msg.getBodyContent(ZmMimeTable.TEXT_HTML) : null;
				if (!content) {
					txtContent = msg.getTextBodyPart();
					content = txtContent ? AjxStringUtil.convertToHtml(txtContent) : null;
				}
			}
		}
		if (!content) {
			content = this.getApptSummary(true);
		}
	}
    if (!content) {
        var comment = this.getComponentComment();
        content = comment && AjxStringUtil.convertToHtml(comment);
    }
	return content;
};

/**
 * Gets the description.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the description or <code>null</code> for none
 */
ZmInvite.prototype.getComponentDescription =
function(compNum) {
	var cn = compNum || 0;
	var comp = this.components[cn];
	if (comp == null) { return; }

	var desc = comp.desc;
	var content = desc && desc[0]._content || null;
	if (!content) {
		content = this.getComponentComment();
	}
	if (!content) {
		var htmlContent = comp.descHtml;
		htmlContent = (htmlContent && htmlContent[0]._content) || null;
		if (!htmlContent && this.type != ZmInvite.TASK) {
			content = this.getApptSummary();
		}
	}
	return content;
};

/**
 * Gets the comment.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the comment or <code>null</code> for none
 */
ZmInvite.prototype.getComponentComment =
function(compNum) {
	var cn = compNum || 0;
	var comp = this.components[cn];
	if (comp == null) { return; }

	var comment = comp.comment;
	return comment && comment[0]._content || null;
};

/**
 * Gets the server end time.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the end time
 */
ZmInvite.prototype.getServerEndTime =
function(compNum) {
	var cn = compNum || 0;
	if (this.components[cn] == null) { return; }

	if (this._serverEndTime == null) {
		if (this.components[cn].e != null ) {
			this._serverEndTime = this.components[cn].e[0].d;
		} else if (this.components[cn].s) {
			// get the duration
			var dur	= this.components[cn].dur;
			var dd		= dur && dur[0].d || 0;
			var weeks	= dur && dur[0].w || 0;
			var hh		= dur && dur[0].h || 0;
			var mm		= dur && dur[0].m || 0;
			var ss		= dur && dur[0].s || 0;
			var t = parseInt(ss) + (parseInt(mm) * 60) + (parseInt(hh) * 3600) + (parseInt(dd) * 24 * 3600) + (parseInt(weeks) * 7 * 24 * 3600);
			// parse the start date
			var start = this.components[cn].s[0].d;
			var yyyy = parseInt(start.substr(0,4), 10);
			var MM = parseInt(start.substr(4,2), 10);
			var dd = parseInt(start.substr(6,2), 10);
			var d = new Date(yyyy, MM -1, dd);
			if (start.charAt(8) == 'T') {
				hh = parseInt(start.substr(9,2), 10);
				mm = parseInt(start.substr(11,2), 10);
				ss = parseInt(start.substr(13,2), 10);
				d.setHours(hh, mm, ss, 0);
			}
			// calculate the end date -- start + offset;
			var endDate = new Date(d.getTime() + (t * 1000));

			// put the end date into server DURATION format.
			MM = AjxDateUtil._pad(d.getMonth() + 1);
			dd = AjxDateUtil._pad(d.getDate());
			hh = AjxDateUtil._pad(d.getHours());
			mm = AjxDateUtil._pad(d.getMinutes());
			ss = AjxDateUtil._pad(d.getSeconds());
			yyyy = d.getFullYear();
			this._serverEndTime = [yyyy,MM,dd,"T",hh,mm,ss].join("");
		}
	}
	return this._serverEndTime;
};

/**
 * Gets the server end date.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Date}	the end date
 */
ZmInvite.prototype.getServerEndDate =
function(compNum, noSpecialUtcCase) {
	var cn = compNum || 0;
    return AjxDateUtil.parseServerDateTime(this.getServerEndTime(cn), noSpecialUtcCase);
};

/**
 * Gets the server start time.
 *
 * @param	{int}	compNum		the component number
 * @return	{Date}	the start time
 */
ZmInvite.prototype.getServerStartTime = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] && this.components[cn].s
		? this.components[cn].s[0].d : null;
};

/**
 * Gets the server start date.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Date}	the start date
 */
ZmInvite.prototype.getServerStartDate =
function(compNum, noSpecialUtcCase) {
	var cn = compNum || 0;
    return AjxDateUtil.parseServerDateTime(this.getServerStartTime(cn), noSpecialUtcCase);
};

/**
 * Gets start date from exception ID.
 *
 * @param	{int}	compNum		the component number
 */

ZmInvite.prototype.getStartDateFromExceptId =
function(compNum) {
	var cn = compNum || 0;
    return AjxDateUtil.parseServerDateTime(this.components[cn] && this.components[cn].exceptId
		? this.components[cn].exceptId[0].d : null);
};

/**
 * Gets the server start time timezone.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the timezone
 */
ZmInvite.prototype.getServerStartTimeTz = 
function(compNum) {
	var cn = compNum || 0;
	if (this.components[cn] == null) { return; }

	if (this._serverStartTimeZone == null) {
		var startTime = this.getServerStartTime();
		this._serverStartTimeZone = startTime && startTime.charAt(startTime.length -1) == 'Z'
			? AjxTimezone.GMT_NO_DST
			: (this.components[cn].s ? this.components[cn].s[0].tz : null);
	}
	return this._serverStartTimeZone;
};

/**
 * Gets the server end time timezone.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the timezone
 */
ZmInvite.prototype.getServerEndTimeTz = 
function(compNum) {
	var cn = compNum || 0;
	var endComp = this.components[cn] && this.components[cn].e;
	if (!endComp) { return null; }

	if (!this._serverEndTimeZone) {
		var endTime = this.getServerEndTime();
		this._serverEndTimeZone = (endTime && endTime.charAt(endTime.length -1) == 'Z')
			? AjxTimezone.GMT_NO_DST : endComp[0].tz;
	}
	return this._serverEndTimeZone;
};

/**
 * Gets the duration text.
 * 
 * @param	{int}		compNum			the component number
 * @param	{Boolean}	emptyAllDay		<code>true</code> to return an empty string "" if all day event.
 * @param	{Boolean}	startOnly		<code>true</code> to include start only
 * @param	{Boolean}	isText			<code>true</code> to return as text, not html
 * @param	{Date}		startDate		Optional. Start date to use instead of the original start date
 * @param	{Date}		endDate			Optional. End date to use instead of the original end date
 *
 * @return	{String}	the duration
 */
ZmInvite.prototype.getDurationText =
function(compNum, emptyAllDay, startOnly, isText, startDate, endDate) {
	var component = this.components[compNum];
	var sd = startDate || this.getServerStartDate(compNum);
	var ed = endDate || this.getServerEndDate(compNum);
	if (!sd && !ed) { return ""; }

	// all day
	if (this.isAllDayEvent(compNum)) {
		if (emptyAllDay) { return ""; }

		if (this.isMultiDay(compNum)) {
			var dateFormatter = AjxDateFormat.getDateInstance();
			var startDay = dateFormatter.format(sd);
			var endDay = dateFormatter.format(ed);

			if (!ZmInvite._daysFormatter) {
				ZmInvite._daysFormatter = new AjxMessageFormat(ZmMsg.durationDays);
			}
			return ZmInvite._daysFormatter.format([startDay, endDay]);
		} 
		return sd ? AjxDateFormat.getDateInstance(AjxDateFormat.FULL).format(sd) : "";
	}

    var dateFormatter = AjxDateFormat.getDateInstance(AjxDateFormat.FULL);
    var timeFormatter = AjxDateFormat.getTimeInstance(AjxDateFormat.SHORT);

    var a = sd ? [dateFormatter.format(sd), isText ? " " : "<br>"] : [];
    if (startOnly) {
        a.push(sd ? timeFormatter.format(sd) : "");
	}
	else {
        var startHour = sd ? timeFormatter.format(sd) : "";
		var endHour = timeFormatter.format(ed);

		if (!ZmInvite._hoursFormatter) {
			ZmInvite._hoursFormatter = new AjxMessageFormat(ZmMsg.durationHours);
		}
		a.push(ZmInvite._hoursFormatter.format([startHour, endHour]));
	}
	return a.join("");
};

/**
 * Gets the name.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the name
 */
ZmInvite.prototype.getName = 
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].name : null;
};

/**
 * Gets the free busy.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the free busy
 */
ZmInvite.prototype.getFreeBusy =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].fb : null;
};

/**
 * Gets the privacy.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the privacy
 */
ZmInvite.prototype.getPrivacy =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn]["class"] : null;
};

/**
 * Gets the x-prop.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the x-prop
 */
ZmInvite.prototype.getXProp =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn]["xprop"] : null;
};

/**
 * Gets the location.
 * 
 * @param	{int}	compNum		the component number
 * @return	{String}	the location
 */
ZmInvite.prototype.getLocation =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].loc : null;
};

/**
 * Gets the recurrence id (ridZ) - applicable to recurring appointment .
 *
 * @param	{int}	compNum		the component number
 * @return	{String}	the recurrence id, null for non-recurring appointment
 */
ZmInvite.prototype.getRecurrenceId =
function(compNum) {
	var cn = compNum || 0;
	return this.components[cn] ? this.components[cn].ridZ : null;
};

/**
 * Gets the tool tip in HTML for this invite.
 * 
 * <p>
 * <strong>Note:</strong> This method assumes that there are currently one and only one component object on the invite.
 * </p>
 * 
 * @return	{String}	the tool tip
 */
ZmInvite.prototype.getToolTip =
function() {
	if (this._toolTip)
		return this._toolTip;

	var compNum = 0;

	var html = [];
	var idx = 0;

	html[idx++] = "<table role='presentation' cellpadding=0 cellspacing=0 border=0 >";
	html[idx++] = "<tr valign='center'><td colspan=2 align='left'>";
	html[idx++] = "<div style='border-bottom: 1px solid black;'>";
	html[idx++] = "<table role='presentation' cellpadding=0 cellspacing=0 border=0 width=100%>";
	html[idx++] = "<tr valign='center'><td><b>";

	// IMGHACK - added outer table for new image changes...
	html[idx++] = "<div style='white-space:nowrap'><table role='presentation' border=0 cellpadding=0 cellspacing=0 style='display:inline'><tr>";
	if (this.hasOtherAttendees(compNum)) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptMeeting");
		html[idx++] = "</td>";
	}

	if (this.isException(compNum)) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptException");
		html[idx++] = "</td>";
	}
	else if (this.isRecurring(compNum)) {
		html[idx++] = "<td>";
		html[idx++] = AjxImg.getImageHtml("ApptRecur");
		html[idx++] = "</td>";
	}

	html[idx++] = "</tr></table>&nbsp;";
	html[idx++] = AjxStringUtil.htmlEncode(this.getName(compNum));
	html[idx++] = "&nbsp;</div></b></td><td align='right'>";
	html[idx++] = AjxImg.getImageHtml("Appointment");
	html[idx++] = "</td></table></div></td></tr>";

	var when = this.getDurationText(compNum, false, false);
	idx = this._addEntryRow(ZmMsg.when, when, html, idx, false, null, true);
	if (this.isRecurring(compNum)) {
		if (!this._recurBlurb) {
			AjxDispatcher.require(["MailCore", "CalendarCore"]);
			var recur = new ZmRecurrence();
			recur.parse(this.getRecurrenceRules(compNum));
			this._recurBlurb = recur.getBlurb();
		}
		idx = this._addEntryRow(ZmMsg.repeats, this._recurBlurb, html, idx, true, null, true);
	}
	idx = this._addEntryRow(ZmMsg.location, this.getLocation(compNum), html, idx, false);

	html[idx++] = "</table>";
	this._toolTip = html.join("");

	return this._toolTip;
};

/**
 * Gets the Appt summary.
 *
 * @param	{Boolean}	isHtml	<code>true</code> to return summary as HTML
 * @return	{String}	the appt summary
 */
ZmInvite.prototype.getApptSummary =
function(isHtml) {
	var msg = appCtxt.getById(this.getMessageId());
	var appt;

	if (msg) {
		AjxDispatcher.require(["MailCore", "CalendarCore"]);
		appt = new ZmAppt();
		appt.setFromMessage(msg);
	}

	return appt ? appt.getSummary(isHtml) : this.getSummary(isHtml);
};

/**
 * Gets the summary.
 * 
 * @param	{Boolean}	isHtml	<code>true</code> to return summary as HTML
 * @return	{String}	the summary
 */
ZmInvite.prototype.getSummary =
function(isHtml) {
	if (this.isRecurring()) {
		if (!this._recurBlurb) {
			AjxDispatcher.require(["MailCore", "CalendarCore"]);
			var recur = new ZmRecurrence();
			recur.setRecurrenceRules(this.getRecurrenceRules(), this.getServerStartDate());
			this._recurBlurb = recur.getBlurb();
		}
	}

	var buf = [];
	var i = 0;

	if (!this._summaryHtmlLineFormatter) {
		this._summaryHtmlLineFormatter = new AjxMessageFormat("<tr><th align='left'>{0}</th><td>{1} {2}</td></tr>");
		this._summaryTextLineFormatter = new AjxMessageFormat("{0} {1} {2}");
	}
	var formatter = isHtml ? this._summaryHtmlLineFormatter : this._summaryTextLineFormatter;

	var params = [];

	if (isHtml) {
		buf[i++] = "<p>\n<table border='0'>\n";
	}

	var orgName = AjxStringUtil.htmlEncode(this.getOrganizerName());
	if (orgName) {
		params = [ZmMsg.organizerLabel, orgName, ""];
		buf[i++] = formatter.format(params);
		buf[i++] = "\n";
	}

	var whenSummary = this.getDurationText(0, false, false, true);
	if (whenSummary) {
		params = [ZmMsg.whenLabel, whenSummary, ""];
		buf[i++] = formatter.format(params);
		buf[i++] = "\n";
	}

	var locationSummary = AjxStringUtil.htmlEncode(this.getLocation());
	if (locationSummary) {
		params = [ZmMsg.locationLabel, locationSummary, ""];
		buf[i++] = formatter.format(params);
		buf[i++] = "\n";
	}

	if (this._recurBlurb) {
		params = [ZmMsg.repeatLabel, this._recurBlurb, ""];
		buf[i++] = formatter.format(params);
		buf[i++] = "\n";
	}

	if (isHtml) {
		buf[i++] = "</table>\n";
	}
	buf[i++] = isHtml ? "<div>" : "\n\n";
	buf[i++] = ZmItem.NOTES_SEPARATOR;
	// bug fix #7835 - add <br> after DIV otherwise Outlook lops off 1st char
	buf[i++] = isHtml ? "</div><br>" : "\n\n";

	return buf.join("");
};

/**
 * Adds a row to the tool tip.
 * 
 * @private
 */
ZmInvite.prototype._addEntryRow =
function(field, data, html, idx, wrap, width, asIs) {
	if (data != null && data != "") {
		html[idx++] = "<tr valign='top'><td align='right' style='padding-right: 5px;'><b><div style='white-space:nowrap'>";
		html[idx++] = AjxMessageFormat.format(ZmMsg.makeLabel, AjxStringUtil.htmlEncode(field));
		html[idx++] = "</div></b></td><td align='left'><div style='white-space:";
		html[idx++] = wrap ? "wrap;" : "nowrap;";
		if (width) {
			html[idx++] = "width:";
			html[idx++] = width;
			html[idx++] = "px;";
		}
		html[idx++] = "'>";
		html[idx++] = asIs ? data : AjxStringUtil.htmlEncode(data);
		html[idx++] = "</div></td></tr>";
	}
	return idx;
};

/**
 * Checks the invite has acceptable components.
 * 
 * @return	{Boolean}	<code>true</code> if the invite has acceptable components
 */
ZmInvite.prototype.hasAcceptableComponents =
function() {
	for (var i  in this.components) {
		if (this.getStatus(i) != ZmCalendarApp.STATUS_CANC) {
			return true;
		}
	}

	return false;
};

/**
 * Checks the invite has a reply method.
 * 
 * @param	{int}	compNum		the component number
 * @return	{Boolean}	<code>true</code> if the invite has a method that REQUIRES a reply (ironically NOT REPLY method but rather REQUEST or PUBLISH)
 */
ZmInvite.prototype.hasInviteReplyMethod =
function(compNum) {
	var methodName = this.getInviteMethod(compNum);
	var publishOrRequest = (methodName == ZmCalendarApp.METHOD_REQUEST ||
							methodName == ZmCalendarApp.METHOD_PUBLISH);
	return ((methodName == null) || publishOrRequest);
};

/**
 * Checks the invite has a counter method.
 *
 * @param	{int}	    compNum		the component number
 * @return	{Boolean}	<code>true</code> if the invite has a counter method
 */
ZmInvite.prototype.hasCounterMethod =
function(compNum) {
	return (this.getInviteMethod(compNum) == ZmCalendarApp.METHOD_COUNTER);
};

/**
 * returns proposed time from counter invite
 *
 * @param	{int}	    compNum		the component number
 * @return	{string}	proposed time as formatted string
 */
ZmInvite.prototype.getProposedTimeStr =
function(compNum) {
	var methodName = this.getInviteMethod(compNum);
	if (methodName == ZmCalendarApp.METHOD_COUNTER) {
		return this.getDurationText(compNum, false, false, true);
	}
	return "";
};

ZmInvite.prototype.getChanges =
function(compNum) {
	var cn = compNum || 0;
	var changesStr = this.components[cn] && this.components[cn].changes;
	var changesArr = changesStr && changesStr.split(",");
	if (changesArr && changesArr.length > 0) {
		var changes = {};
		for (var i = 0; i < changesArr.length; i++) {
			changes[changesArr[i]] = true;
		}
		return changes;
	}

	return null;
};

/**
 * Returns true if this invite has attendees, one of which replied back with an
 * "actioned" response (e.g. accept/decline/tentative)
 */
ZmInvite.prototype.hasAttendeeResponse =
function() {
	var att = this.getAttendees();
	return (att.length > 0 && att[0].ptst != ZmCalBaseItem.PSTATUS_NEEDS_ACTION);
};

/**
 * Checks if this invite has html description.
 *
 * @return	{Boolean}	<code>true</code> if this invite has HTML description
 */
ZmInvite.prototype.isHtmlInvite =
function() {
	var comp = this.getComponent(0);
	var htmlContent = comp && comp.descHtml;
	return (htmlContent && htmlContent[0] && htmlContent[0]._content) ? true : false;
};
}
if (AjxPackage.define("zimbraMail.share.model.ZmSystemRetentionPolicy")) {
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
 * 
 * This file accesses the set of system retention policies
 *
 */

ZmSystemRetentionPolicy = function() {
};

ZmSystemRetentionPolicy.prototype.constructor = ZmSystemRetentionPolicy;

ZmSystemRetentionPolicy.prototype.toString =
function() {
	return "ZmSystemRetentionPolicy";
};

ZmSystemRetentionPolicy.prototype.getKeepPolicies =
function() {
	return this._keepPolicies;
};

ZmSystemRetentionPolicy.prototype.getPurgePolicies =
function() {
	return this._purgePolicies;
};


// Read the system retention policies from the server
ZmSystemRetentionPolicy.prototype.getPolicies =
function(callback, batchCmd) {
    this._keepPolicies  = new Array();
    this._purgePolicies = new Array();

    var jsonObj = {GetSystemRetentionPolicyRequest:{_jsns:"urn:zimbraMail"}};
    var request = jsonObj.GetSystemRetentionPolicyRequest;
    var respCallback = this._handleResponseGetPolicies.bind(this, callback);
    if (batchCmd) {
        batchCmd.addRequestParams(jsonObj, respCallback);
    } else {
        appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
    }
};



ZmSystemRetentionPolicy.prototype._handleResponseGetPolicies =
function(callback, result) {
	var resp = result.getResponse().GetSystemRetentionPolicyResponse;
    if (resp.retentionPolicy) {
        if (resp.retentionPolicy[0].keep && resp.retentionPolicy[0].keep[0] &&
            resp.retentionPolicy[0].keep[0].policy) {
            this._keepPolicies = resp.retentionPolicy[0].keep[0].policy;
        }
        if (resp.retentionPolicy[0].purge && resp.retentionPolicy[0].purge[0] &&
            resp.retentionPolicy[0].purge[0].policy) {
            this._purgePolicies = resp.retentionPolicy[0].purge[0].policy;
        }
    }
	if (callback) {
		callback.run(this._keepPolicies, this._purgePolicies);
	}
};
}

if (AjxPackage.define("zimbraMail.share.view.ZmAutocompleteListView")) {
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
 * 
 */

/**
 * Creates a new autocomplete list. The list isn't populated or displayed until some
 * autocompletion happens. Takes a data class and loader, so that when data is needed (it's
 * loaded lazily), the loader can be called on the data class.
 * @class
 * This class implements autocomplete functionality. It has two main parts: matching data based
 * on keystroke events, and displaying/managing the list of matches. This class is theoretically
 * neutral concerning the data that gets matched (as long as its class has an <code>autocompleteMatch()</code>
 * method), and the field that it's being called from.
 * 
 * The data class's <code>autocompleteMatch()</code> method should returns a list of matches, where each match is
 * an object with the following properties:
 * <table border="1" width="50%">
 * <tr><td width="15%">data</td><td>the object being matched</td></tr>
 * <tr><td>text</td><td>the text to display for this object in the list</td></tr>
 * <tr><td>[key1]</td><td>a string that may be used to replace the typed text</td></tr>
 * <tr><td>[keyN]</td><td>a string that may be used to replace the typed text</td></tr>
 * </table>
 * 
 * The calling client also specifies the key in the match result for the string that will be used
 * to replace the typed text (also called the "completion string"). For example, the completion 
 * string for matching contacts could be a full address, or just the email.
 * 
 * The client may provide additional key event handlers in the form of callbacks. If the callback
 * explicitly returns true or false, that's what the event handler will return.
 * 
 * A single autocomplete list view may handle several related input fields. With the "quick complete" feature, there
 * may be multiple outstanding autocomplete requests to the server. Each request is managed through a context which
 * has all the information needed to make the request and handle its results.
 * 
 * 
 * 
 * Using Autocomplete
 * 
 * Autocomplete kicks in after there is a pause in the typing (that pause has to be at least 300ms by default). Let's say that
 * you are entering addresses into the To: field while composing an email. You type a few characters and then pause:
 * 
 * 	dav
 * 
 * ZCS will ask the user for people whose name or email address matches "dav", and display the matches in a list that pops up.
 * The matches will be sorted with the people you email the most at the top. When you select a match, that person's address
 * will replace the search string ("dav") in the To: field. Typically the address will be in a bubble.
 * 
 * 	Davey Jones x
 * 
 * Quick Complete
 * 
 * Many times you will know which address you're looking for, and you will type enough characters so that they will appear at
 * the top of the matches, and then you type semicolon or a return to select them once the list has come up. If you know that
 * the address you want will appear at the top of the matches based on what you've typed, then there's a way to select it 
 * without waiting for the list to come up: just type a semicolon. For example, let's assume that I email Davey Jones a lot,
 * and I know that if I type "dav" he will be the first match. I can just type
 * 
 * 	dav;
 * 
 * and continue, whether that's adding more addresses, or moving on to the subject and body (done easily via the Tab key).
 * Autocompletion will happen in the background, and will automatically replace "dav;" with the first match from the list. If 
 * no matches are found, nothing changes. One way to think of the Quick Complete feature is as the autocomplete version of 
 * Google's "I'm Feeling Lucky", though in this case you have a much better idea of what the results are going to be. You 
 * don't have to wait for the list to appear in order to add the bubble. It gets added for you.
 * 
 * You can type in multiple Quick Complete strings, and they will all be handled. For example, I could type
 * 
 * 	dav;pb;ann;x;
 * 
 * and see bubbles pop up for Davey Jones, Phil Bates, Ann Miller, and Xavier Gold without any more action on my part. I could
 * even type "dav;" into the To: field, hit Tab to go to the Cc: field, type "pb;" there, and then Tab to the Subject: field,
 * and start writing my message.
 * 
 * One small limitation of Quick Complete is that the bubbles will pop up within a field in the order that the results come 
 * back, which may not match the order of the strings you typed in. You can drag the bubbles to rearrange them if you want.
 * 
 * Special Keys
 * 
 * There are a number of keys that have special meanings when you are working with an input field that supports autocomplete. 
 * Most of them apply while the list of matches is showing, and are used to control selection of the match you want:
 * 
 * Return		Adds the selected address
 * Tab		Adds the selected address
 * ;		Adds the selected address
 * ,		Adds the selected address (if enabled in Preferences/Address Book/Autocomplete)
 * DownArrow	Selects the next address (hold to repeat)
 * UpArrow		Selects the previous address (hold to repeat)
 * Esc		Hides the list
 * 
 * A few keys have special meanings while the list is not showing:
 * 
 * Return		If the input contains an email address, turn it into a bubble
 * Tab		Go to the next field
 * Esc		If requests are pending (it will say "Autocompleting"), cancel them. If not, cancel compose.
 * 
 * 
 * 
 * @author Conrad Damon
 *
 * @param {Hash}	params			a hash of parameters:
 * @param	{String}		matchValue			the name of field in match result to use for completion
 * @param	{function}		dataClass			the class that has the data loader
 * @param	{function}		dataLoader			a method of dataClass that returns data to match against
 * @param	{DwtComposite}	parent				the control that created this list (defaults to shell)
 * @param	{String}		className			the CSS class
 * @param	{Array}			delims				the list of delimiters (which separate tokens such as addresses)
 * @param	{Array}			delimCodes			the list of delimiter key codes
 * @param	{String}		separator			the separator (gets added to the end of a match)
 * @param	{AjxCallback}	compCallback		the callback into client to notify it that completion happened
 * @param	{AjxCallback}	selectionCallback	the callback into client to notify it that selection from extended DL happened (passed from email.js, and accessed from ZmDLAutocompleteListView.prototype._doUpdate)
 * @param	{AjxCallback}	keyDownCallback		the additional client ONKEYDOWN handler
 * @param	{AjxCallback}	keyPressCallback	the additional client ONKEYPRESS handler
 * @param	{AjxCallback}	keyUpCallback		the additional client ONKEYUP handler
 * @param	{string}		contextId			ID from parent
 * @param	{Hash}			options				the additional options for the data class
 * @param	{function}		locationCallback	used to customize list location (optional)
 * 
 * @extends		DwtComposite
 */
ZmAutocompleteListView = function(params) {

	if (arguments.length == 0) {
		return;
	}

	params.parent = params.parent || appCtxt.getShell();
	params.className = params.className || "ZmAutocompleteListView";
	params.posStyle = DwtControl.ABSOLUTE_STYLE;
	params.id = params.contextId ? DwtId.makeId(ZmId.WIDGET_AUTOCOMPLETE, params.contextId) :
								   this._htmlElId || Dwt.getNextId("ZmAutocompleteListView_");
	DBG.println("acid", "ID: " + params.id);
	DwtComposite.call(this, params);

	this._dataClass = this._dataAPI = params.dataClass;
	this._dataLoader = params.dataLoader;
	this._dataLoaded = false;
	this._matchValue = params.matchValue;
	this._selectionCallback = params.selectionCallback;
	this._separator = (params.separator != null) ? params.separator : AjxEmailAddress.SEPARATOR;
    this._options = params.options || {};
	this._locationCallback = params.locationCallback;
	this._autocompleteType = params.autocompleteType;

	this._callbacks = {};
	for (var i = 0; i < ZmAutocompleteListView.CALLBACKS.length; i++) {
		this._setCallbacks(ZmAutocompleteListView.CALLBACKS[i], params);
	}

	this._isDelim = AjxUtil.arrayAsHash(params.delims || ZmAutocompleteListView.DELIMS);
	this._isDelimCode = AjxUtil.arrayAsHash(params.delimCodes || ZmAutocompleteListView.DELIM_CODES);
	if (!params.delims && !params.delimCodes) {
		this._isDelim[','] = this._isDelimCode[188] = appCtxt.get(ZmSetting.AUTOCOMPLETE_ON_COMMA); 
		var listener = new AjxListener(this, this._settingChangeListener);
		var aoc = appCtxt.getSettings().getSetting(ZmSetting.AUTOCOMPLETE_ON_COMMA);
		if (aoc) {
			aoc.addChangeListener(listener);
		}
	}

    // mouse event handling
	this._setMouseEventHdlrs();
	this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
	this.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this._mouseOverListener));
	this._addSelectionListener(new AjxListener(this, this._listSelectionListener));
	this._outsideListener = new AjxListener(null, ZmAutocompleteListView._outsideMouseDownListener);

	// only trigger matching after a sufficient pause
	this._acInterval = appCtxt.get(ZmSetting.AC_TIMER_INTERVAL);
	this._acActionId = {};	// per element

	// for managing focus on Tab in Firefox
	if (AjxEnv.isGeckoBased) {
		this._focusAction = new AjxTimedAction(null, this._autocompleteFocus);
	}

	this._origClass = "acRow";
	this._selClass = "acRow-selected";
	this._showLinkTextClass = "LinkText";
	this._hideLinkTextClass = "LinkText-hide";
	this._hideSelLinkTextClass = "LinkText-hide-selected";

	this._contexts 			= {};	// key is element ID
	this._inputValue		= {};	// key is element ID
	
	this.setVisible(false);
	this.setScrollStyle(Dwt.SCROLL);
	this.reset();
};

ZmAutocompleteListView.prototype = new DwtComposite;
ZmAutocompleteListView.prototype.constructor = ZmAutocompleteListView;
ZmAutocompleteListView.prototype.toString = function() { return "ZmAutocompleteListView"; };

ZmAutocompleteListView.CB_ADDR_FOUND	= "addrFound";
ZmAutocompleteListView.CB_COMPLETION	= "comp";
ZmAutocompleteListView.CB_KEYDOWN		= "keyDown";
ZmAutocompleteListView.CB_KEYPRESS		= "keyPress";
ZmAutocompleteListView.CB_KEYUP			= "keyUp";
ZmAutocompleteListView.CALLBACKS = [
		ZmAutocompleteListView.CB_ADDR_FOUND,
		ZmAutocompleteListView.CB_COMPLETION,
		ZmAutocompleteListView.CB_KEYDOWN,
		ZmAutocompleteListView.CB_KEYPRESS,
		ZmAutocompleteListView.CB_KEYUP
];

// map of characters that are completion characters
ZmAutocompleteListView.DELIMS = [',', ';', '\n', '\r'];	// used when list is not showing
ZmAutocompleteListView.DELIM_CODES = [                  // used when list is showing
    DwtKeyEvent.KEY_COMMA,
    DwtKeyEvent.KEY_SEMICOLON,
    DwtKeyEvent.KEY_SEMICOLON_1,
    DwtKeyEvent.KEY_END_OF_TEXT,
    DwtKeyEvent.KEY_RETURN
];

ZmAutocompleteListView.WAIT_ID = "wait";

// for list selection with up/down arrows
ZmAutocompleteListView.NEXT = -1;
ZmAutocompleteListView.PREV = -2;

// possible states of an autocomplete context
ZmAutocompleteListView.STATE_NEW		= "NEW";
ZmAutocompleteListView.STATE_REQUEST	= "REQUEST";
ZmAutocompleteListView.STATE_RESPONSE	= "RESPONSE";
ZmAutocompleteListView.STATE_DONE		= "DONE";




/**
 * Handles the on key down event.
 * 
 * @param	{Event}	event		the event
 */
ZmAutocompleteListView.onKeyDown =
function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	var key = DwtKeyEvent.getCharCode(ev);
	var result = true;
	var element = DwtUiEvent.getTargetWithProp(ev, "_aclvId");
	DBG.println("ac", ev.type.toUpperCase() + " in " + (element && element.id) + ": " + key);
	var aclv = element && DwtControl.ALL_BY_ID[element._aclvId];
	if (aclv) {
		// if the user types a single delimiting character with the list showing, do completion
		var isDelim = (!ev.shiftKey && (aclv._isDelimCode[key] || (key === DwtKeyEvent.KEY_TAB && aclv.getVisible())));
		var visible = aclv.getVisible();
		aclv._actionHandled = false;
		// DBG.println("ac", "key = " + key + ", isDelim: " + isDelim);
		if (visible && aclv.handleAction(key, isDelim, element)) {
			aclv._actionHandled = true;
			result = false;
		}

		aclv._inputValue[element.id] = element.value;
		var cbResult = aclv._runCallbacks(ZmAutocompleteListView.CB_KEYDOWN, element && element.id, [ev, aclv, result, element]);
		// DBG.println("ac", ev.type.toUpperCase() + " cbResult: " + cbResult);
		result = (cbResult === true || cbResult === false) ? cbResult : result;
	}
	if (AjxEnv.isFirefox){
		ZmAutocompleteListView.clearTimer();
		ZmAutocompleteListView.timer =  new AjxTimedAction(this, ZmAutocompleteListView.onKeyUp, [ev]);
		AjxTimedAction.scheduleAction(ZmAutocompleteListView.timer, 300)
	}
	return ZmAutocompleteListView._echoKey(result, ev);
};

/**
 * Handles the on key press event.
 * 
 * @param	{Event}	event		the event
 */
ZmAutocompleteListView.onKeyPress =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	DwtKeyEvent.geckoCheck(ev);
	var result = true;
	var key = DwtKeyEvent.getCharCode(ev);
	var element = DwtUiEvent.getTargetWithProp(ev, "_aclvId");
	DBG.println("ac", ev.type.toUpperCase() + " in " + (element && element.id) + ": " + key);
	var aclv = element && DwtControl.ALL_BY_ID[element._aclvId];
	if (aclv) {
		if (aclv._actionHandled) {
			result = false;
		}
		var cbResult = aclv._runCallbacks(ZmAutocompleteListView.CB_KEYPRESS, element && element.id, [ev, aclv, result, element]);
		DBG.println("ac", ev.type.toUpperCase() + " cbResult: " + cbResult);
		result = (cbResult === true || cbResult === false) ? cbResult : true;
	}

	return ZmAutocompleteListView._echoKey(result, ev);
};

/**
 * Handles the on key up event.
 * 
 * @param	{Event}	event		the event
 */
ZmAutocompleteListView.onKeyUp =
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var result = true;
	var key = DwtKeyEvent.getCharCode(ev);
	var element = DwtUiEvent.getTargetWithProp(ev, "_aclvId");
	DBG.println("ac", ev.type.toUpperCase() + " in " + (element && element.id) + ": " + key);
	var aclv = element && DwtControl.ALL_BY_ID[element._aclvId];
	if (aclv) {
		if (aclv._actionHandled) {
			result = false;
		}
		var result = ZmAutocompleteListView._onKeyUp(ev);
		var cbResult = aclv._runCallbacks(ZmAutocompleteListView.CB_KEYUP, element && element.id, [ev, aclv, result, element]);
		DBG.println("ac", ev.type.toUpperCase() + " cbResult: " + cbResult);
		result = (cbResult === true || cbResult === false) ? cbResult : result;
	}
	return ZmAutocompleteListView._echoKey(result, ev);
};

/**
 * "onkeyup" handler for performing autocompletion. The reason it's an "onkeyup" handler is that it's the only one
 * that arrives after the input has been updated.
 *
 * @param ev		the key event
 * 
 * @private
 */
ZmAutocompleteListView._onKeyUp =
function(ev) {

	var element = DwtUiEvent.getTargetWithProp(ev, "_aclvId");
	if (!element) {
		return ZmAutocompleteListView._echoKey(true, ev);
	}

	var aclv = DwtControl.ALL_BY_ID[element._aclvId];
	var key = DwtKeyEvent.getCharCode(ev);
	var value = element.value;
	var elId = element.id;
	DBG.println("ac", ev.type + " event, key = " + key + ", value = " + value);
	ev.inputChanged = (value != aclv._inputValue[elId]);

	// reset timer on any address field key activity
	if (aclv._acActionId[elId] !== -1 && !DwtKeyMap.IS_MODIFIER[key] && key !== DwtKeyEvent.KEY_TAB) {
		DBG.println("ac", "canceling autocomplete");
		AjxTimedAction.cancelAction(aclv._acActionId[elId]);
		aclv._acActionId[elId] = -1;
	}

	// ignore modifier keys (including Shift), or a key with a modifier that makes it nonprintable
	if (DwtKeyMap.IS_MODIFIER[key] || DwtKeyMapMgr.hasModifier(ev)) {
		return true;
	}

	// if the input is empty, clear the list (if it's for this input)
	if (!value && aclv._currentContext && element == aclv._currentContext.element) {
		aclv.reset(element);
		return true;
	}

	// a Return following an address turns it into a bubble
	if (DwtKeyEvent.IS_RETURN[key] && aclv._complete(element)) {
		return false;
	}

	// skip if input value is not changed
	if (!ev.inputChanged) {
		return true;
	}

	ZmAutocompleteListView.clearTimer();

	// regular input, schedule autocomplete
	var ev1 = new DwtKeyEvent();
	DwtKeyEvent.copy(ev1, ev);
	ev1.aclv = aclv;
	ev1.element = element;
	DBG.println("ac", "scheduling autocomplete for: " + elId);

	var aif = DwtControl.ALL_BY_ID[element._aifId];
	if (aif && aif._editMode) {
		return false;
	}
	
	var acAction = new AjxTimedAction(aclv, aclv._autocompleteAction, [ev1]);
	aclv._acActionId[elId] = AjxTimedAction.scheduleAction(acAction, aclv._acInterval);
	
	return true;
};

ZmAutocompleteListView.clearTimer =
function(ev){
    if (ZmAutocompleteListView.timer){
        AjxTimedAction.cancelAction(ZmAutocompleteListView.timer)
    }
};

/**
 * Invokes or prevents the browser's default behavior (which is to echo the typed key).
 * 
 * @param {Boolean}	echo	if <code>true</code>, echo the key
 * @param {Event}	ev	the UI event
 * 
 * @private
 */
ZmAutocompleteListView._echoKey =
function(echo, ev) {
	DwtUiEvent.setBehaviour(ev, !echo, echo);
	return echo;
};

/**
 * Hides list if there is a click elsewhere.
 * 
 * @private
 */
ZmAutocompleteListView._outsideMouseDownListener =
function(ev, context) {

	var curList = context && context.obj;
	if (curList) {
		DBG.println("out", "outside listener, cur " + curList.toString() + ": " + curList._htmlElId);
		curList.show(false);
		curList.setWaiting(false);
	}
};

/**
 * Sets the active account.
 * 
 * @param	{ZmAccount}		account		the account
 */
ZmAutocompleteListView.prototype.setActiveAccount =
function(account) {
	this._activeAccount = account;
};

/**
 * Adds autocompletion to the given field by setting key event handlers.
 *
 * @param {Element}	element			an HTML element
 * @param {string}	addrInputId		ID of ZmAddressInputField (for addr bubbles)
 * 
 * @private
 */
ZmAutocompleteListView.prototype.handle =
function(element, addrInputId) {
	
	var elId = element.id = element.id || Dwt.getNextId();
	DBG.println("ac", "HANDLE " + elId);
	// TODO: use el id instead of expando
	element._aclvId = this._htmlElId;
	if (addrInputId) {
		element._aifId = addrInputId;
	}
	this._contexts[elId] = {};
	this._acActionId[elId] = -1;
	Dwt.setHandler(element, DwtEvent.ONKEYDOWN, ZmAutocompleteListView.onKeyDown);
	Dwt.setHandler(element, DwtEvent.ONKEYPRESS, ZmAutocompleteListView.onKeyPress);
	Dwt.setHandler(element, DwtEvent.ONKEYUP, ZmAutocompleteListView.onKeyUp);
	if (AjxEnv.isFirefox){
		// don't override the element input handler directly, as DwtControl uses
		// that for changing style, etc.
		var control = DwtControl.findControl(element);

		if (control && control.getInputElement && control.getInputElement() === element) {
			control.addListener(DwtEvent.ONBLUR, ZmAutocompleteListView.clearTimer);
		} else {
			Dwt.setHandler(element, DwtEvent.ONBLUR, ZmAutocompleteListView.clearTimer);
		}
	}
	this.isActive = true;
};

ZmAutocompleteListView.prototype.unhandle =
function(element) {
	DBG.println("ac", "UNHANDLE " + element.id);
	Dwt.clearHandler(element, DwtEvent.ONKEYDOWN);
	Dwt.clearHandler(element, DwtEvent.ONKEYPRESS);
	Dwt.clearHandler(element, DwtEvent.ONKEYUP);
	this.isActive = false;
};

// Kicks off an autocomplete cycle, which scans the content of the given input and then
// handles the strings it finds, possible making requests to the data provider.
ZmAutocompleteListView.prototype.autocomplete =
function(element) {

	if (this._dataLoader && !this._dataLoaded) {
		this._data = this._dataLoader.call(this._dataClass);
		this._dataAPI = this._data;
		this._dataLoaded = true;
	}

	var results = this._parseInput(element);
	this._process(results, element);
};

/**
 * See if the text in the input is an address. If it is, complete it.
 * 
 * @param {Element}		element
 * @return {boolean}	true if the value in the input was completed
 */
ZmAutocompleteListView.prototype._complete =
function(element) {

	var value = element.value;
	if (this._dataAPI.isComplete && this._dataAPI.isComplete(value)) {
		DBG.println("ac", "got a Return or Tab, found an addr: " + value);
		var result = this._parseInput(element)[0];
		var context = {
			element:	element,
			str:		result.str,
			isAddress:	true,
			isComplete:	result.isComplete,
			key:		this._getKey(result)
		}
		this._update(context);
		this.reset(element);
		return true;
	}
	return false;
};

// Parses the content of the given input by splitting the text at delimiters. Returns a list of
// objects with information about each string it found.
ZmAutocompleteListView.prototype._parseInput =
function(element) {

	DBG.println("ac", "parse input for element: " + element.id); 
	var results = [];
	var text = element && element.value;
	if (!text) {
		return results;
	}
	DBG.println("ac", "PARSE: " + text);
	var str = "";
	for (var i = 0; i < text.length; i++) {
		var c = text.charAt(i);
		if (c == ' ' && !str) { continue; }	// ignore leading space
		var isDelim = this._isDelim[c];
		if (isDelim || c == ' ') {
			// space counts as delim if bubbles are on and the space follows an address
			var str1 = (this._dataAPI.isComplete && this._dataAPI.isComplete(str, true));
			if (str1) {
				DBG.println("ac", "parse input found address: " + str);
				str1 = (str1 === true) ? str : str1;
				results.push({element:element, str:str1, isComplete:true, isAddress:true});
				str = "";
			}
			else if (c == ";") {
				// semicolon triggers Quick Complete
				results.push({element:element, str:str, isComplete:true});
				str = "";
			}
			else {
				// space typed, but not after an address so no special meaning
				str += c;
			}
		}
		else {
			str += c;
		}
	}
	if (str) {
		results.push({str:str, isComplete:false});
	}

	return results;
};

/**
 * Look through the parsed contents of the input and make any needed autocomplete requests. If there is a 
 * delimited email address, go ahead and handle it now. Also, make sure to cancel any requests that no
 * longer match the contents of the input. This function will run only after a pause in the user's typing
 * (via a setTimeout call), so existing contexts will be in either the REQUEST state or the DONE state.
 */
ZmAutocompleteListView.prototype._process =
function(results, element) {

	// for convenience, create a hash of current keys for this input
	var resultsHash = {};
	for (var i = 0; i < results.length; i++) {
		var key = this._getKey(results[i]);
		resultsHash[key] = true;
	}
	
	// cancel any outstanding requests for strings that are no longer in the input
	var pendingContextHash = {};
	var oldContexts = this._contexts[element.id];
	if (oldContexts && oldContexts.length) {
		for (var i = 0; i < oldContexts.length; i++) {
			var context = oldContexts[i];
			var key = context.key;
			if (key && context.reqId && context.state == ZmAutocompleteListView.STATE_REQUEST && !resultsHash[key]) {
				DBG.println("ac", "request for '" + context.str + "' no longer current, canceling req " + context.reqId);
				appCtxt.getAppController().cancelRequest(context.reqId);
				context.state = ZmAutocompleteListView.STATE_DONE;
				if (context.str == this._waitingStr) {
					this.setWaiting(false);
				}
			}
			else if (context.state == ZmAutocompleteListView.STATE_REQUEST) {
				pendingContextHash[context.key] = context;
			}
		}
	}
	
	// process the parsed content
	var newContexts = [];
	for (var i = 0; i < results.length; i++) {
		var result = results[i];
		var str = result.str;
		var key = this._getKey(result);
		var pendingContext = pendingContextHash[key];
		// see if we already have a pending request for this result; if so, leave it alone
		if (pendingContext) {
			DBG.println("ac", "PROCESS: propagate pending context for '" + str + "'");
			newContexts.push(pendingContext);
		}
		else {
			// add a new context
			DBG.println("ac", "PROCESS: add new context for '" + str + "', isComplete: " + result.isComplete);
			var context = {
				element:	element,
				str:		str,
				isComplete:	result.isComplete,
				key:		key,
				isAddress:	result.isAddress,
				state:		ZmAutocompleteListView.STATE_NEW
			}
			newContexts.push(context);
			if (result.isAddress) {
				// handle a completed email address now
				this._update(context);
			}
			else {
				// go get autocomplete results from the data provider
				this._autocomplete(context);
			}
		}
	}
	this._contexts[element.id] = newContexts;
};

// Returns a key that combines the string with whether it's subject to Quick Complete
ZmAutocompleteListView.prototype._getKey =
function(context) {
	return context.str + (context.isComplete ? this._separator : "");
};

/**
 * Resets the visible state of the autocomplete list. The state-related properties are not
 * per-element because there can only be one visible autocomplete list.
 */
ZmAutocompleteListView.prototype.reset =
function(element) {

	DBG.println("ac", "RESET");
	this._matches = null;
	this._selected = null;

	this._matchHash			= {};
	this._forgetLink		= {};
	this._expandLink		= {};

	this.show(false);
	if (this._memberListView) {
		this._memberListView.show(false);
	}
	this.setWaiting(false);
	
	if (element) {
		this._removeDoneRequests(element);
	}
};

/**
 * Checks the given key to see if it's used to control the autocomplete list in some way.
 * If it does, the action is taken and the key won't be echoed into the input area.
 *
 * The following keys are action keys:
 *	38 40		up/down arrows (list selection)
 *	37 39		left/right arrows (dl expansion)
 *	27			escape (hide list)
 *
 * The following keys are delimiters (trigger completion when list is up):
 *	3 13		return
 *	9			tab
 *	59 186		semicolon
 *	188			comma (depends on user pref)
 *
 * @param {int}		key			a numeric key code
 * @param {boolean}	isDelim		true if a single delimiter key was typed
 * @param {Element}	element		element key event happened in 
 * 
 * @private
 */
ZmAutocompleteListView.prototype.handleAction = function(key, isDelim, element) {

	DBG.println("ac", "autocomplete handleAction for key " + key + " / " + isDelim);

	if (isDelim) {
		this._update();
	}
    else if (key === DwtKeyEvent.KEY_ARROW_RIGHT) {
		// right arrow
		var dwttext = this._expandText && this._expandText[this._selected];

		// if the caret is at the end of the input, expand a distribution list,
		// if possible
		if(!dwttext || Dwt.getSelectionStart(element) !== element.value.length) {
			return false;
		}

		// fake a click
		dwttext.notifyListeners(DwtEvent.ONMOUSEDOWN);

	}
    else if (key === DwtKeyEvent.KEY_ARROW_UP || key === DwtKeyEvent.KEY_ARROW_DOWN) {
		// handle up and down arrow keys
		if (this.size() < 1) {
			return;
		}
		if (key === DwtKeyEvent.KEY_ARROW_DOWN) {
			this._setSelected(ZmAutocompleteListView.NEXT);
		}
        else if (key === DwtKeyEvent.KEY_ARROW_UP) {
			this._setSelected(ZmAutocompleteListView.PREV);
		}
	}
    else if (key === DwtKeyEvent.KEY_ESCAPE) {
		if (this.getVisible()) {
			this.reset(element); // ESC hides the list
		}
		else if (!this._cancelPendingRequests(element)) {
			return false;
		}
	}
    else if (key === DwtKeyEvent.KEY_TAB) {
		this._popdown();
		return false;
	}
    else {
		return false;
	}
	return true;
};

// Cancels the XHR of any context in the REQUEST state.
ZmAutocompleteListView.prototype._cancelPendingRequests =
function(element) {

	var foundOne = false;
	var contexts = this._contexts[element.id];
	if (contexts && contexts.length) {
		for (var i = 0; i < contexts.length; i++) {
			var context = contexts[i];
			if (context.state == ZmAutocompleteListView.STATE_REQUEST) {
				DBG.println("ac", "user-initiated cancel of request for '" + context.str + "', " + context.reqId);
				appCtxt.getAppController().cancelRequest(context.reqId);
				context.state = ZmAutocompleteListView.STATE_DONE;
				foundOne = true;
			}
		}
	}
	this.setWaiting(false);
	
	return foundOne;
};

// Clean up contexts we are done with
ZmAutocompleteListView.prototype._removeDoneRequests =
function(element) {

	var contexts = this._contexts[element.id];
	var newContexts = [];
	if (contexts && contexts.length) {
		for (var i = 0; i < contexts.length; i++) {
			var context = contexts[i];
			if (context.state == ZmAutocompleteListView.STATE_DONE) {
				newContexts.push(context);
			}
		}
	}
	this._contexts[element.id] = newContexts;
};

/**
 * Sets the waiting status.
 * 
 * @param	{Boolean}	on		if <code>true</code>, turn waiting "on"
 * @param	{string}	str		string that pending request is for
 * 
 */
ZmAutocompleteListView.prototype.setWaiting =
function(on, str) {

	if (!on && !this._waitingDiv) {
		return;
	}

	var div = this._waitingDiv;
	if (!div) {
		div = this._waitingDiv = document.createElement("div");
		div.className = "acWaiting";
		var html = [], idx = 0;
		html[idx++] = "<table role='presentation' cellpadding=0 cellspacing=0 border=0>";
		html[idx++] = "<tr>";
		html[idx++] = "<td><div class='ImgSpinner'></div></td>";
		html[idx++] = "<td>" + ZmMsg.autocompleteWaiting + "</td>";
		html[idx++] = "</tr>";
		html[idx++] = "</table>";
		div.innerHTML = html.join("");
		Dwt.setPosition(div, Dwt.ABSOLUTE_STYLE);
		appCtxt.getShell().getHtmlElement().appendChild(div);
	}

	if (on) {
		this._popdown();
		var loc = this._getDefaultLoc();
		Dwt.setLocation(div, loc.x, loc.y);

		this._setLiveRegionText(ZmMsg.autocompleteWaiting);
	}
	this._waitingStr = on ? str : "";

	Dwt.setZIndex(div, on ? Dwt.Z_DIALOG_MENU : Dwt.Z_HIDDEN);
	Dwt.setVisible(div, on);
};

// Private methods

/**
 * Called as a timed action, after a sufficient pause in typing within an address field.
 * 
 * @private
 */
ZmAutocompleteListView.prototype._autocompleteAction =
function(ev) {
	var aclv = ev.aclv;
	aclv._acActionId[ev.element.id] = -1; // so we don't try to cancel
	aclv.autocomplete(ev.element);
};

/**
 * Displays the current matches in a popup list, selecting the first.
 *
 * @param {Boolean}	show	if <code>true</code>, display the list
 * @param {String}	loc		where to display the list
 * 
 */
ZmAutocompleteListView.prototype.show =
function(show, loc) {

	if (show) {
		this.setWaiting(false);
		this._popup(loc);
	} else {
		this._popdown();
	}
};

// Makes an autocomplete request to the data provider.
ZmAutocompleteListView.prototype._autocomplete =
function(context) {

	var str = AjxStringUtil.trim(context.str);
	if (!str || !(this._dataAPI && this._dataAPI.autocompleteMatch)) {
		return;
	}
	DBG.println("ac", "autocomplete: " + context.str);
	
	this._currentContext = context;	// so we can figure out where to pop up the "waiting" indicator
	var respCallback = this._handleResponseAutocomplete.bind(this, context);
	context.state = ZmAutocompleteListView.STATE_REQUEST;
	context.reqId = this._dataAPI.autocompleteMatch(str, respCallback, this, this._options, this._activeAccount, this._autocompleteType);
	DBG.println("ac", "Request ID for " + context.element.id + " / '" + context.str + "': " + context.reqId);
};

ZmAutocompleteListView.prototype._handleResponseAutocomplete =
function(context, list) {

	context.state = ZmAutocompleteListView.STATE_RESPONSE;

	if (list && list.length) {
		DBG.println("ac", "matches found for '" + context.str + "': " + list.length);
		context.list = list;
		if (context.isComplete) {
			// doing Quick Complete, go ahead and update with the first match
			DBG.println("ac", "performing quick completion for: " + context.str);
			this._update(context, list[0]);
		} else {
			// pop up the list of matches
			this._set(list, context);
			this._currentContext = context;
			this.show(true);
		}
	} else if (!context.isComplete) {
		this._popdown();
		this._showNoResults();

		var msg = AjxMessageFormat.format(ZmMsg.autocompleteMatches, 0);
		this._setLiveRegionText(msg);
	}
};

// Returns the field in the match that we show the user.
ZmAutocompleteListView.prototype._getCompletionValue =
function(match) {
	var value = "";
	if (this._matchValue instanceof Array) {
		for (var i = 0, len = this._matchValue.length; i < len; i++) {
			if (match[this._matchValue[i]]) {
				value = match[this._matchValue[i]];
				break;
			}
		}
	} else {
		value = match[this._matchValue] || "";
	}
	return value;
};

// Updates the content of the input with the given match and adds a bubble
ZmAutocompleteListView.prototype._update =
function(context, match) {

	context = context || this._currentContext;
	if (!context) {
		return;
	}
	match = match || this._matchHash[this._selected];
	
	if (match && match.needDerefGroup) {
		var contact = new ZmContact(match.groupId, {});
		var continuationCb = new AjxCallback(this, this._updateContinuation, [context, match]);
		var derefCallback = new AjxCallback(match, match.setContactGroupMembers, [match.groupId, continuationCb]);
		contact.load(derefCallback, null, null, true);
	}
	else {
		this._updateContinuation(context, match);
	}
};

// continuation of _update
ZmAutocompleteListView.prototype._updateContinuation = 
function(context, match) {

	var newText = "";
	var address = context.address = context.address || (context.isAddress && context.str) || (match && this._getCompletionValue(match));
	DBG.println("ac", "UPDATE: result for '" + context.str + "' is " + AjxStringUtil.htmlEncode(address));

	var bubbleAdded = this._addBubble(context, match, context.isComplete);
	if (!bubbleAdded) {
		newText = address + this._separator;
	}

	// figure out what the content of the input should now be
	var el = context.element;
	if (el) {
		// context.add means don't change the content (used by DL selection)
		if (!context.add) {
			// Parse the input again so we know what to replace. There is a race condition here, since the user
			// may have altered the content during the request. In that case, the altered content will not match
			// and get replaced, which is fine. Reparsing the input seems like a better option than trying to use
			// regexes.
			var results = this._parseInput(el);
			var newValue = "";
			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				var key = this._getKey(result);
				// Compare el.value to key too. Edge case: user types complete email and presses enter
				// before new autocomplete request is sent. In this case context.key is only a part of key and el.value.
				// Bug 86577
				if (context.key === key || el.value === key) {
					newValue += newText;
				}
				else {
					newValue += key;
				}
			}
			if (bubbleAdded) {
				newValue = AjxStringUtil.trim(newValue);
			}
			if (el.value !== newValue) {
				el.value = newValue;
			}
		}
		
		if (!context.isComplete) {
			// match was selected from visible list, refocus the input and clear the list
			el.focus();
			this.reset(el);
		}
	}
	context.state = ZmAutocompleteListView.STATE_DONE;

	this._runCallbacks(ZmAutocompleteListView.CB_COMPLETION, el && el.id, [address, el, match]);
};

// Adds a bubble. If we are adding it via Quick Complete, we don't want the input field to set
// focus since the user may have tabbed into another input field.
ZmAutocompleteListView.prototype._addBubble =
function(context, match, noFocus) {

	var el = context.element;
	var addrInput = el && el._aifId && DwtControl.ALL_BY_ID[el._aifId];
	if (addrInput) {
		var bubbleCount = addrInput.getBubbleCount();

		if (match && match.multipleAddresses) {
			// mass complete (add all) from a DL
			addrInput.addValue(context.address);
		}
		else {
			var addedClass = this._dataAPI && this._dataAPI.getAddedBubbleClass && this._dataAPI.getAddedBubbleClass(context.str);
			var bubbleParams = {
				address:	context.address,
				match:		match,
				noFocus:	noFocus,
				addClass:	addedClass,
				noParse:	this._options.noBubbleParse
			}
			addrInput.addBubble(bubbleParams);
		}

		var msg = AjxMessageFormat.format(ZmMsg.autocompleteAddressesAdded,
		                                  addrInput.getBubbleCount() - bubbleCount);
		this._setLiveRegionText(msg);

		el = addrInput._input;
		// Input field loses focus along the way. Restore it when the stack is finished
		if (AjxEnv.isIE) {
			AjxTimedAction.scheduleAction(new AjxTimedAction(addrInput, addrInput.focus), 0);
		}
		return true;
	}
	else {
		return false;
	}
};

// Listeners

// MOUSE_DOWN selects a match and performs an update. Note that we don't wait for
// a corresponding MOUSE_UP event.
ZmAutocompleteListView.prototype._mouseDownListener = 
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var row = DwtUiEvent.getTargetWithProp(ev, "id");
	if (!row || !row.id || row.id.indexOf("Row") === -1) {
		return;
	}
	if (ev.button == DwtMouseEvent.LEFT) {
		this._setSelected(row.id);
		if (this.isListenerRegistered(DwtEvent.SELECTION)) {
	    	var selEv = DwtShell.selectionEvent;
	    	DwtUiEvent.copy(selEv, ev);
	    	selEv.detail = 0;
	    	this.notifyListeners(DwtEvent.SELECTION, selEv);
	    	return true;
	    }		
	}
};

// Mouse over selects a match
ZmAutocompleteListView.prototype._mouseOverListener = 
function(ev) {
	ev = DwtUiEvent.getEvent(ev);
	var row = Dwt.findAncestor(DwtUiEvent.getTarget(ev), "id");
	if (row) {
		this._setSelected(row.id);
	}
	return true;
};

// Seems like DwtComposite should define this method
ZmAutocompleteListView.prototype._addSelectionListener = 
function(listener) {
	this._eventMgr.addListener(DwtEvent.SELECTION, listener);
};

ZmAutocompleteListView.prototype._listSelectionListener = 
function(ev) {
	this._update();
};

// Layout

// Lazily create main table, since we may need it to show "Waiting..." row before
// a call to _set() is made.
ZmAutocompleteListView.prototype._getTable =
function() {

	var table = this._tableId && document.getElementById(this._tableId);
	if (!table) {
		var html = [], idx = 0;
		this._tableId = this.getHTMLElId() + '_table';
		html[idx++] = "<table role='presentation' id='" + this._tableId + "' cellpadding=0 cellspacing=0 border=0>";
		html[idx++] = "</table>";
		this.getHtmlElement().innerHTML = html.join("");
		table = document.getElementById(this._tableId);
	}
	return table;
};

ZmAutocompleteListView.prototype._setLiveRegionText =
function(text) {
	// Lazily create accessibility live region
	var id = this.getHTMLElId() + '_liveRegion';
	var liveRegion = Dwt.byId(id);

	if (!liveRegion) {
		liveRegion = document.createElement('div');
		liveRegion.id = id;
		liveRegion.className = 'ScreenReaderOnly';
		liveRegion.setAttribute('role', 'alert');
		liveRegion.setAttribute('aria-label', ZmMsg.autocomplete);
		liveRegion.setAttribute('aria-live', 'assertive');
		liveRegion.setAttribute('aria-relevant', 'additions');
		liveRegion.setAttribute('aria-atomic', true);
		appCtxt.getShell().getHtmlElement().appendChild(liveRegion);
	}

	// Set the live region text content
	Dwt.removeChildren(liveRegion);
	if (text) {
		var paragraph = document.createElement('p');
		paragraph.appendChild(document.createTextNode(text));
		liveRegion.appendChild(paragraph);
	}
};

// Creates the list and its member elements based on the matches we have. Each match becomes a
// row. The first match is automatically selected.
ZmAutocompleteListView.prototype._set =
function(list, context) {

	this._removeAll();
	var table = this._getTable();
	this._matches = list;
	var forgetEnabled = (this._options.supportForget !== false);
	var expandEnabled = (this._options.supportExpand !== false);
	var len = this._matches.length;
	for (var i = 0; i < len; i++) {
		var match = this._matches[i];
		if (match && (match.text || match.icon)) {
			var rowId = match.id = this._getId("Row", i);
			this._matchHash[rowId] = match;
			var row = table.insertRow(-1);
			row.className = this._origClass;
			row.id = rowId;
			row.index = i;
			var html = [], idx = 0;
			var cell = row.insertCell(-1);
			cell.className = "AutocompleteMatchIcon";
			if (match.icon) {
				cell.innerHTML = (match.icon.indexOf('Dwt') !== -1) ? ["<div class='", match.icon, "'></div>"].join("") :
								 									 AjxImg.getImageHtml(match.icon);
			} else {
				cell.innerHTML = "&nbsp;";
			}
			cell = row.insertCell(-1);
			cell.innerHTML = AjxStringUtil.htmlEncode(match.text) || "&nbsp;";
			if (forgetEnabled) {
				this._insertLinkCell(this._forgetLink, row, rowId, this._getId("Forget", i), (match.score > 0));
			}
			if (expandEnabled) {
				this._insertLinkCell(this._expandLink, row, rowId, this._getId("Expand", i), match.canExpand);
			}
		}
	}
	if (forgetEnabled) {
		this._forgetText = {};
		this._addLinks(this._forgetText, "Forget", ZmMsg.forget, ZmMsg.forgetTooltip, this._handleForgetLink, context);
	}
	if (expandEnabled) {
		this._expandText = {};
		this._addLinks(this._expandText, "Expand", ZmMsg.expand, ZmMsg.expandTooltip, this.expandDL, context);
	}

	var msg = AjxMessageFormat.format(ZmMsg.autocompleteMatches, len);
	this._setLiveRegionText(msg);

	AjxTimedAction.scheduleAction(new AjxTimedAction(this,
		function() {
			this._setSelected(this._getId("Row", 0));
		}), 100);
};

ZmAutocompleteListView.prototype._showNoResults =
function() {
	// do nothing. Overload to show something.
};

ZmAutocompleteListView.prototype._insertLinkCell =
function(hash, row, rowId, linkId, addLink) {
	hash[rowId] = addLink ? linkId : null;
	var cell = row.insertCell(-1);
	cell.className = "Link";
	cell.innerHTML = addLink ? "<a id='" + linkId + "'></a>" : "";
};

ZmAutocompleteListView.prototype._getId =
function(type, num) {
	return [this._htmlElId, "ac" + type, num].join("_");
};

// Add a DwtText to the link so it can have a tooltip.
ZmAutocompleteListView.prototype._addLinks =
function(textHash, idLabel, label, tooltip, handler, context) {

	var len = this._matches.length;
	for (var i = 0; i < len; i++) {
		var match = this._matches[i];
		var rowId = match.id = this._getId("Row", i);
		var linkId = this._getId(idLabel, i);
		var link = document.getElementById(linkId);
		if (link) {
			var textId = this._getId(idLabel + "Text", i);
			var text = new DwtText({parent:this, className:this._hideLinkTextClass, id:textId});
			textHash[rowId] = text;
			text.isLinkText = true;
			text.setText(label);
			text.setToolTipContent(tooltip);
			var listener = handler.bind(this, {email:match.email, textId:textId, rowId:rowId, element:context.element});
			text.addListener(DwtEvent.ONMOUSEDOWN, listener);
			text.reparentHtmlElement(link);
		}
	}
};

ZmAutocompleteListView.prototype._showLink =
function(hash, textHash, rowId, show) {
	var text = textHash && textHash[rowId];
	if (text) {
		text.setClassName(!show ? this._hideLinkTextClass :
			hash[rowId] ? this._showLinkTextClass : this._hideSelLinkTextClass);
	}
};

// Displays the list
ZmAutocompleteListView.prototype._popup =
function(loc) {

	if (this.getVisible()) {
		return;
	}

	loc = loc || this._getDefaultLoc();
	var x = loc.x;
	var y = loc.y;

	var windowSize = this.shell.getSize();
	var availHeight = windowSize.y - y;
	var fullHeight = this.size() * this._getRowHeight();
	this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	this.setVisible(true);
	var curSize = this.getSize();
	if (availHeight < fullHeight) {
	  //we are short add text to alert user to keep typing
      this._showMoreResultsText(availHeight);
      // if we don't fit, resize so we are scrollable
      this.setSize(Dwt.DEFAULT, availHeight - (AjxEnv.isIE ? 30 : 10));
	   // see if we need to account for width of vertical scrollbar
	  var div = this.getHtmlElement();
	  if (div.clientWidth != div.scrollWidth) {
			this.setSize(curSize.x + Dwt.SCROLLBAR_WIDTH, Dwt.DEFAULT);
	  }
      
	} else if (curSize.y < fullHeight) {
		this.setSize(Dwt.CLEAR, fullHeight);
	} else {
		this.setSize(Dwt.CLEAR, Dwt.CLEAR);	// set back to auto-sizing
	}

	var newX = (x + curSize.x >= windowSize.x) ? windowSize.x - curSize.x : x;

	DBG.println("ac", this.toString() + " popup at: " + newX + "," + y);
    this.setLocation(newX, y);
	this.setVisible(true);
	this.setZIndex(Dwt.Z_DIALOG_MENU);

	var omem = appCtxt.getOutsideMouseEventMgr();
	var omemParams = {
		id:					"ZmAutocompleteListView",
		obj:				this,
		outsideListener:	this._outsideListener,
		noWindowBlur:		appCtxt.get(ZmSetting.IS_DEV_SERVER)
	}
	omem.startListening(omemParams);
};

// returns a point with a location just below the input field
ZmAutocompleteListView.prototype._getDefaultLoc = 
function() {

	if (this._locationCallback) {
		return this._locationCallback();
	}
	
	var el = this._currentContext && this._currentContext.element;
	if (!el) {
		return {};
	}
	
	var elLoc = Dwt.getLocation(el);
	var elSize = Dwt.getSize(el);
	var x = elLoc.x;
	var y = elLoc.y + elSize.y + 3;
	DwtPoint.tmp.set(x, y);
	return DwtPoint.tmp;
};

// Hides the list
ZmAutocompleteListView.prototype._popdown = 
function() {

	if (!this.getVisible()) {
		return;
	}
	DBG.println("out", "popdown " + this.toString() + ": " + this._htmlElId);

	if (this._memberListView) {
		this._memberListView._popdown();
	}
	
	this.setZIndex(Dwt.Z_HIDDEN);
	this.setVisible(false);
	this._removeAll();
	this._selected = null;

	var omem = appCtxt.getOutsideMouseEventMgr();
	omem.stopListening({id:"ZmAutocompleteListView", obj:this});
};

/*
    Display message to user that more results are available than fit in the current display
    @param {int}    availHeight available height of display
 */
ZmAutocompleteListView.prototype._showMoreResultsText =
function (availHeight){
    //over load for implementation
};

/**
 * Selects a match by changing its CSS class.
 *
 * @param	{string}	id		ID of row to select, or NEXT / PREV
 */
ZmAutocompleteListView.prototype._setSelected =
function(id) {

	DBG.println("ac", "setting selected id to " + id);
	var table = document.getElementById(this._tableId);
	var rows = table && table.rows;
	if (!(rows && rows.length)) {
		return;
	}

	var len = rows.length;

	// handle selection of next/prev via arrow keys
	if (id == ZmAutocompleteListView.NEXT || id == ZmAutocompleteListView.PREV) {
		id = this._getRowId(rows, id, len);
		if (!id) {
			return;
		}
	}

	// make sure the ID matches one of our rows
	var found = false;
	for (var i = 0; i < len; i++) {
		if (rows[i].id == id) {
			found = true;
			break;
		}
	}
	if (!found) {
		return;
	}
	
	// select one row, deselect the rest
	for (var i = 0; i < len; i++) {
		var row = rows[i];
		var curStyle = row.className;
		if (row.id == id) {
			row.className = this._selClass;
		} else if (curStyle != this._origClass) {
			row.className = this._origClass;
		}
	}

	// links only shown for selected row
	this._showLink(this._forgetLink, this._forgetText, this._selected, false);
	this._showLink(this._forgetLink, this._forgetText, id, true);

	this._showLink(this._expandLink, this._expandText, this._selected, false);
	this._showLink(this._expandLink, this._expandText, id, true);

	this._selected = id;

	var match = this._matchHash[id];
	var msg;

	if (!match) {
		msg = AjxStringUtil.convertHtml2Text(Dwt.byId(this._selected));
	} else {
		var msg = AjxMessageFormat.format(ZmMsg.autocompleteMatchText, [ match.name, match.email ]);
		if (match.isGroup) {
			msg = AjxMessageFormat.format(ZmMsg.autocompleteGroup, msg);
		}
		else if (match.isDL) {
			msg = AjxMessageFormat.format(ZmMsg.autocompleteDL, msg);
		}
	}

	this._setLiveRegionText(msg);
};

ZmAutocompleteListView.prototype._getRowId =
function(rows, id, len) {

	if (len < 1) {
		return;
	}

	var idx = -1;
	for (var i = 0; i < len; i++) {
		if (rows[i].id == this._selected) {
			idx = i;
			break;
		}
	}
	var newIdx = (id == ZmAutocompleteListView.PREV) ? idx - 1 : idx + 1;
	if (newIdx == -1) {
		newIdx = len - 1;
	}
	if (newIdx == len) {
		newIdx = 0;
	}
	
	if (newIdx >= 0 && newIdx < len) {
		Dwt.scrollIntoView(rows[newIdx], this.getHtmlElement());
		return rows[newIdx].id;
	}
	return null;
};

ZmAutocompleteListView.prototype._getRowHeight =
function() {
	if (!this._rowHeight) {
		if (!this.getVisible()) {
			this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
			this.setVisible(true);
		}
		var row = this._getTable().rows[0];
		this._rowHeight = row && Dwt.getSize(row).y;
	}
	return this._rowHeight || 18;
};



// Miscellaneous

// Clears the internal list of matches
ZmAutocompleteListView.prototype._removeAll =
function() {
	this._matches = null;
	var table = this._getTable();
	for (var i = table.rows.length - 1; i >= 0; i--) {
		var row = table.rows[i];
		if (row != this._waitingRow) {
			table.deleteRow(i);
		}
	}
	this._removeLinks(this._forgetText);
	this._removeLinks(this._expandText);
};

ZmAutocompleteListView.prototype._removeLinks =
function(textHash) {
	if (!textHash) {
		return;
	}
	for (var id in textHash) {
		var textCtrl = textHash[id];
		if (textCtrl) {
			textCtrl.dispose();
		}
	}
};

// Returns the number of matches
ZmAutocompleteListView.prototype.size =
function() {
	return this._getTable().rows.length;
};

// Force focus to the input element (handle Tab in Firefox)
ZmAutocompleteListView.prototype._autocompleteFocus =
function(htmlEl) {
	htmlEl.focus();
};

ZmAutocompleteListView.prototype._getAcListLoc =
function(ev) {
	var element = ev.element;
	var loc = Dwt.getLocation(element);
	var height = Dwt.getSize(element).y;
	return (new DwtPoint(loc.x, loc.y + height));
};

ZmAutocompleteListView.prototype._settingChangeListener =
function(ev) {
	if (ev.type != ZmEvent.S_SETTING) {
		return;
	}
	if (ev.source.id == ZmSetting.AUTOCOMPLETE_ON_COMMA) {
		this._isDelim[','] = this._isDelimCode[188] = appCtxt.get(ZmSetting.AUTOCOMPLETE_ON_COMMA);
	}
};

ZmAutocompleteListView.prototype._handleForgetLink =
function(params) {
	if (this._dataAPI.forget) {
		this._dataAPI.forget(params.email, this._handleResponseForget.bind(this, params.email, params.rowId));
	}
};

ZmAutocompleteListView.prototype._handleResponseForget =
function(email, rowId) {
	var row = document.getElementById(rowId);
	if (row) {
		row.parentNode.removeChild(row);
		var msg = AjxMessageFormat.format(ZmMsg.forgetSummary, [email]);
		appCtxt.setStatusMsg(msg);
	}
	appCtxt.clearAutocompleteCache(ZmAutocomplete.AC_TYPE_CONTACT);
};

/**
 * Displays a second popup list with the members of the given distribution list.
 *
 * @param {hash}			params				hash of params:
 * @param {string}			params.email		address of a distribution list
 * @param {string}			params.textId		ID of link text
 * @param {string}			params.rowId		ID or list view row
 * @param {DwtMouseEvent}	params.ev			mouse event
 * @param {DwtPoint}		params.loc			location to popup at; default is right of parent ACLV
 * @param {Element}			params.element		input element
 */
ZmAutocompleteListView.prototype.expandDL =
function(params) {

	if (!this._dataAPI.expandDL) {
		return;
	}

	var mlv = this._memberListView;
	if (mlv && mlv.getVisible() && params.textId && this._curExpanded == params.textId) {
		// User has clicked "Collapse" link
		mlv.show(false);
		this._curExpanded = null;
		this._setExpandText(params.textId, false);
	} else {
		// User has clicked "Expand" link
		if (mlv && mlv.getVisible()) {
			// expanding a DL while another one is showing
			this._setExpandText(this._curExpanded, false);
			mlv.show(false);
		}
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var contact = contactsApp.getContactByEmail(params.email);
		if (!contact) {
			contact = new ZmContact(null);
			contact.initFromEmail(params.email);	// don't cache, since it's not a real contact (no ID)
		}
		contact.isDL = true;
		if (params.textId && params.rowId) {
			this._curExpanded = params.textId;
			this._setExpandText(params.textId, true);
		}
		this._dataAPI.expandDL(contact, 0, this._handleResponseExpandDL.bind(this, contact, params));
	}

};

ZmAutocompleteListView.prototype._handleResponseExpandDL =
function(contact, params, matches) {

	var mlv = this._memberListView;
	if (!mlv) {
		mlv = this._memberListView = new ZmDLAutocompleteListView({parent:appCtxt.getShell(), parentAclv:this,
                                                                   selectionCallback: this._selectionCallback,
                                                                   expandTextId: params.textId});
	}
	mlv._dlContact = contact;
	mlv._dlBubbleId = params.textId;
	mlv._set(matches, contact);

	// default position is just to right of parent ac list
	var loc = params.loc;
	if (this.getVisible()) {
		loc = this.getLocation();
		loc.x += this.getSize().x;
	}

	mlv.show(true, loc);
	if (!mlv._rowHeight) {
		var table = document.getElementById(mlv._tableId);
		if (table) {
			mlv._rowHeight = Dwt.getSize(table.rows[0]).y;
		}
	}
};

ZmAutocompleteListView.prototype._setExpandText =
function(textId, expanded) {
	var textCtrl = DwtControl.fromElementId(textId);
	if (textCtrl && textCtrl.setText) {
		textCtrl.setText(expanded ? ZmMsg.collapse : ZmMsg.expand);
	}
};

ZmAutocompleteListView.prototype._setCallbacks =
function(type, params) {

	var cbKey = type + "Callback";
	var list = this._callbacks[type] = [];
	if (params[cbKey]) {
		list.push({callback:params[cbKey]});
	}
};

/**
 * Adds a callback of the given type. In an input ID is provided, then the callback
 * will only be run if the event happened in that input.
 *
 * @param {constant}				type		autocomplete callback type (ZmAutocompleteListView.CB_*)
 * @param {AjxCallback|function}	callback	callback to add
 * @param {string}					inputId		DOM ID of an input element (optional)
 */
ZmAutocompleteListView.prototype.addCallback =
function(type, callback, inputId) {
	this._callbacks[type].push({callback:callback, inputId:inputId});
};

ZmAutocompleteListView.prototype._runCallbacks =
function(type, inputId, args) {

	var result = null;
	var list = this._callbacks[type];
	if (list && list.length) {
		for (var i = 0; i < list.length; i++) {
			var cbObj = list[i];
			if (inputId && cbObj.inputId && (inputId != cbObj.inputId)) { continue; }
			var callback = cbObj.callback;
			var r;
			if (typeof(callback) == "function") {
				r = callback.apply(callback, args);
			}
			else if (callback && callback.isAjxCallback) {
				r = AjxCallback.prototype.run.apply(cbObj.callback, args);
			}
			if (r === true || r === false) {
				result = (result == null) ? r : result && r;
			}
		}
	}
	return result;
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmPeopleAutocompleteListView")) {
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
 * Subclass of ZmAutocompleteListView so we can customize the "listview"
 *
 * @param params
 */
ZmPeopleAutocompleteListView = function(params) {
	ZmAutocompleteListView.call(this, params);

	this.addClassName("ZmPeopleAutocompleteListView");
	this.setScrollStyle(DwtControl.CLIP);
};

ZmPeopleAutocompleteListView.prototype = new ZmAutocompleteListView;
ZmPeopleAutocompleteListView.prototype.constructor = ZmPeopleAutocompleteListView;


// Consts

ZmPeopleAutocompleteListView.ACTION_MESSAGE		= "message";
ZmPeopleAutocompleteListView.ACTION_IM			= "IM";
ZmPeopleAutocompleteListView.ACTION_CALL		= "call";
ZmPeopleAutocompleteListView.ACTION_APPT		= "appt";
ZmPeopleAutocompleteListView.NO_RESULTS			= "no-results";


// Public methods

ZmPeopleAutocompleteListView.prototype.toString =
function() {
	return "ZmPeopleAutocompleteListView";
};


// protected methods

// Creates the list and its member elements based on the matches we have. Each match becomes a
// row. The first match is automatically selected.
ZmPeopleAutocompleteListView.prototype._set =
function(list) {
	var table = this._getTable();
	this._matches = list;

	for (var i = 0; i < list.length; i++) {
		var match = list[i];
		if (match && (match.text || match.icon)) {
			var rowId = match.id = this._getId("Row", i);
			this._matchHash[rowId] = match;
		}

		var rowId = this._getId("Row", i);
		var contact = match.item;
		var data = {
			id: this._htmlElId,
			rowId: rowId,
			fullName: contact.getFullName(),
			title: contact.getAttr(ZmContact.F_jobTitle),
			email: contact.getEmail(),
            phone: contact.getAttr(ZmContact.F_workPhone),
            photoFileName: contact.getAttr("photoFileName")
		};

        // zimlet support
        appCtxt.notifyZimlets("onPeopleSearchData", [data]);
        

		var rowHtml = AjxTemplate.expand("share.Widgets#ZmPeopleAutocompleteListView", data);

        var row = Dwt.parseHtmlFragment(rowHtml, true);
        var tbody = document.createElement("tbody");
        tbody.appendChild(row);
		var rowEl = table.appendChild(tbody);

        if (data.email){
            var emailTxt = new DwtText({parent:this, parentElement:rowId + "-email", index:0, id:"NewMsg", className:"FakeAnchor"});
            emailTxt.isLinkText = true;
            emailTxt.setText(data.email);
            emailTxt.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._peopleItemListener));
            emailTxt.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this.peopleItemMouseOverListener));
            emailTxt.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this.peopleItemMouseOutListener));
        }

        if (data.fullName){
            var nameTxt = new DwtText({parent:this, parentElement:rowId + "-fullName", index:0, id:"NewContact", className:"ZmPeopleSearch-fullname"});
            nameTxt.isLinkText = true;
            nameTxt.setText(data.fullName);
            nameTxt.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._peopleItemListener));
            nameTxt.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this.peopleItemMouseOverListener));
            nameTxt.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this.peopleNameMouseOutListener));
        }
		Dwt.associateElementWithObject(row, contact, "contact");
        // ask zimlets if they want to make data into links
		appCtxt.notifyZimlets("onPeopleSearchShow", [this, contact, rowId]);

        if (i==0)
            this._setSelected(rowId);

	}

	//leave this out as part of bug 50692
	/*
	     //fetch free/busy info for all results;
	    if (list.length > 0) {
		AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._getFreeBusyInfo, [list]), 100);
	} */
};

/*
    Called by zimlet to clear existing text when DwtText item is created.
 */
ZmPeopleAutocompleteListView.prototype._clearText =
function(id) {
    if (document.getElementById(id)!=null)
        document.getElementById(id).innerHTML="";
};

ZmPeopleAutocompleteListView.prototype._showNoResults =
function() {
	var table = this._getTable();
	var data = { id: this._htmlElId, rowId: ZmPeopleAutocompleteListView.NO_RESULTS };
	var rowHtml = AjxTemplate.expand("share.Widgets#ZmPeopleAutocompleteListView-NoResults", data);
    var tbody =   document.createElement("tbody");
    tbody.appendChild(Dwt.parseHtmlFragment(rowHtml, true));
	table.appendChild(tbody);

	this.show(true);
};

ZmPeopleAutocompleteListView.prototype._setSelected =
function(id) {
    if (id && typeof id == "string") {
        id = id.split("-")[0]; 
    }

    if (id == ZmPeopleAutocompleteListView.NO_RESULTS || id == this.getHtmlElement().id) { return; }

	if (id == ZmAutocompleteListView.NEXT || id == ZmAutocompleteListView.PREV) {
		var table = document.getElementById(this._tableId);
		var rows = table && table.rows;
		id = this._getRowId(rows, id, rows.length);
		if (!id) { return; }
	}

	var rowEl = document.getElementById(id);
	if (rowEl) {
		this._activeContact = Dwt.getObjectFromElement(rowEl, "contact");
	}

	ZmAutocompleteListView.prototype._setSelected.apply(this, arguments);
};

ZmPeopleAutocompleteListView.prototype._getFreeBusyInfo =
function(list) {
	var emailList = [];
	var emailHash = {};
	for (var i = 0; i < list.length; i++) {
		var match = list[i];
		emailList.push(match.email);
		emailHash[match.email] = match.id;
	}

	var now = new Date();
	var jsonObj = {GetFreeBusyRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.GetFreeBusyRequest;
	request.s = now.getTime();
	request.e = now.getTime() + (5*60*1000); // next 5 mins
	request.name = emailList.join(",");

	return appCtxt.getAppController().sendRequest({
		jsonObj: jsonObj,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleFreeBusyResponse, [emailHash])),
		noBusyOverlay: true
	});
};

ZmPeopleAutocompleteListView.prototype._handleFreeBusyResponse =
function(emailHash, result) {
	if (!this.getVisible()) { return; }

	var fb = result.getResponse().GetFreeBusyResponse.usr;
	for (var i = 0; i < fb.length; i++) {
		var id = fb[i].id;
		var el = id && (document.getElementById(emailHash[id] + "-freebusy"));
        var td = document.createElement("td");
        td.innerHTML="- ";
        td.className="ZmPeopleSearch-busy";
        el.parentNode.insertBefore(td, el);
        var text = new DwtText({parent:this, parentElement:el, index:1, id:"NewAppt", className:"FakeAnchor"});
        text.isLinkText = true;
        text.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._peopleItemListener));
        text.addListener(DwtEvent.ONMOUSEOVER, new AjxListener(this, this.peopleItemMouseOverListener));
        text.addListener(DwtEvent.ONMOUSEOUT, new AjxListener(this, this.peopleItemMouseOutListener));

		if (el && fb[i].b) {
            text.setText("Busy");
		}else if(el) {
            text.setText("Available");
        }
	}
};

ZmPeopleAutocompleteListView.prototype._removeAll =
function() {
	var table = this._getTable();
	for (var i = table.rows.length - 1; i >= 0; i--) {
		var row = table.rows[i];
		var contact = Dwt.getObjectFromElement(row, "contact");
		if (contact) {
			Dwt.disassociateElementFromObject(row, contact, "contact");
		}
	}

	this._activeContact = null;

	ZmAutocompleteListView.prototype._removeAll.apply(this, arguments);
};


ZmPeopleAutocompleteListView.prototype._listSelectionListener =
function(ev) {
};

ZmPeopleAutocompleteListView.prototype._peopleItemListener =
 function(ev){
    if (!this._activeContact) {
        return;
    }

    var target = DwtUiEvent.getTargetWithProp(ev, "id");
    var action = "";
    if (target && target.id)
        action = target.id.split("_")[0]; //ids are inserted by DwtText, clean up as necessary

    switch (action){
        case "NewMsg":
            var params = {action:ZmOperation.NEW_MESSAGE, toOverride: new AjxEmailAddress(this._activeContact.getEmail(),
            AjxEmailAddress.TO, this._activeContact.getFullName())};
	        AjxDispatcher.run("Compose", params);
            break;

        case "NewAppt":
            AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar", "CalendarAppt"]);
			var cc = AjxDispatcher.run("GetCalController");
			var appt = cc.newApptObject((new Date()));
			appt.setAttendees([this._activeContact.getEmail()], ZmCalBaseItem.PERSON);
			cc.newAppointment(appt);
			break;

        case "NewContact":
            AjxDispatcher.require(["ContactsCore", "Contacts"]);
            var cc = AjxDispatcher.run("GetContactListController");
            var list = new ZmContactList((new ZmSearch()), true);
            list.add(this._activeContact);
	        cc.show(list, true);
            break;
    }

    this.show(false);

 };

 ZmPeopleAutocompleteListView.prototype.peopleItemMouseOverListener =
 function(ev){
	 var target = DwtUiEvent.getTargetWithProp(ev, "id");
     target.className="ZmPeopleSearchText-hover";
 };

 ZmPeopleAutocompleteListView.prototype.peopleItemMouseOutListener =
 function(ev){
	 var target = DwtUiEvent.getTargetWithProp(ev, "id");
     target.className="FakeAnchor";
 };

 ZmPeopleAutocompleteListView.prototype.peopleNameMouseOutListener =
 function(ev){
	 var target = DwtUiEvent.getTargetWithProp(ev, "id");
     target.className="ZmPeopleSearch-fullname";
 };


ZmPeopleAutocompleteListView._outsideMouseDownListener =
function(ev) {
	var curList = ZmAutocompleteListView._activeAcList;
	if (curList) {
		var obj = DwtControl.getTargetControl(ev);
		if (obj && obj.parent && obj.parent == curList._toolbar) {
			return;
		}
	}

	ZmAutocompleteListView._outsideMouseDownListener(ev);
    ZmPeopleAutocompleteListView.prototype._listSelectionListener(ev);


};

ZmPeopleAutocompleteListView.prototype._addMouseDownListener =
function() {
	DwtEventManager.addListener(DwtEvent.ONMOUSEDOWN, ZmPeopleAutocompleteListView._outsideMouseDownListener);
	this.shell._setEventHdlrs([DwtEvent.ONMOUSEDOWN]);
	this.shell.addListener(DwtEvent.ONMOUSEDOWN, this._outsideListener);
};

ZmPeopleAutocompleteListView.prototype._removeMouseDownListener =
function() {
	DwtEventManager.removeListener(DwtEvent.ONMOUSEDOWN, ZmPeopleAutocompleteListView._outsideMouseDownListener);
	this.shell._setEventHdlrs([DwtEvent.ONMOUSEDOWN], true);
	this.shell.removeListener(DwtEvent.ONMOUSEDOWN, this._outsideListener);
};

/*
    Display message to user that more results are available than fit in the current display
    @param {int}    availHeight available height of display
 */
ZmPeopleAutocompleteListView.prototype._showMoreResultsText =
function (availHeight) {
      var rowNum = this._getNumberofAllowedRows(availHeight);
      var textPos = rowNum > 1 ? rowNum-1 : 0;
      var rowEl = this._getTable().rows[textPos];
      var rowCell = Dwt.parseHtmlFragment(AjxTemplate.expand("share.Widgets#ZmPeopleAutocompleteListView-MoreResults"), true);
      rowEl.parentNode.insertBefore(rowCell, rowEl);
      //remove rows below text so they are not displayed
      this._removeRows(rowNum);
};

/* remove rows from bottom to index number */
ZmPeopleAutocompleteListView.prototype._removeRows =
function(idx) {
	this._matches = null;
	var table = this._getTable();
	for (var i = table.rows.length - 1; i >= 0 && i >= idx; i--) {
		var row = table.rows[i];
		if (row != this._waitingRow) {
			table.deleteRow(i);
		}
	}
};

/*
    Get the number of rows within the available height
    @param {int}    availHeight available height for display
    @return {int}   return the number of rows
 */
ZmPeopleAutocompleteListView.prototype._getNumberofAllowedRows =
function(availHeight) {
   var rowCount = 0;
   var totalHeight = 0;
   for(var i = 0; i< this._getTable().rows.length; i++){
       var row = this._getTable().rows[i];
       totalHeight += Dwt.getSize(row).y;
       if (totalHeight < availHeight){
           rowCount++;
       } else {
           break;
       }
   }

    return rowCount;

};
}
if (AjxPackage.define("zimbraMail.share.view.ZmDLAutocompleteListView")) {
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
 * @overview
 *
 */

/**
 * Creates a new autocomplete list.
 * @class
 * This class shows the members of an expanded distribution list (DL).
 *
 * @author Conrad Damon
 *
 * @param {Hash}	params			a hash of parameters:
 * @param	{ZmAutocompleteListView}		parent autocomplete list view
 * @param	{AjxCallback}	selectionCallback	the callback into client to notify it that selection from extended DL happened (passed from email.js, and accessed from ZmDLAutocompleteListView.prototype._doUpdate)
 *
 * @extends		ZmAutocompleteListView
 */
ZmDLAutocompleteListView = function(params) {
	params.isFocusable = true;
	ZmAutocompleteListView.call(this, params);
	this._parentAclv = params.parentAclv;
	this._dlScrollDiv = this.getHtmlElement();
	this._selectionCallback = params.selectionCallback;
	this._expandTextId = params.expandTextId;
	Dwt.setHandler(this._dlScrollDiv, DwtEvent.ONSCROLL, ZmDLAutocompleteListView.handleDLScroll);
};

ZmDLAutocompleteListView.prototype = new ZmAutocompleteListView;
ZmDLAutocompleteListView.prototype.constructor = ZmDLAutocompleteListView;

ZmDLAutocompleteListView.prototype.toString =
function() {
	return "ZmDLAutocompleteListView";
};


ZmDLAutocompleteListView.prototype.getKeyMapName = function() {
	return ZmKeyMap.MAP_DL_ADDRESS_LIST;
};

ZmDLAutocompleteListView.prototype.handleKeyAction = function(actionCode, ev) {
	DBG.println("aif", "handle shortcut: " + actionCode);

	switch (actionCode) {
		case DwtKeyMap.SELECT_NEXT:	this._setSelected(ZmAutocompleteListView.NEXT); break;
		case DwtKeyMap.SELECT_PREV:	this._setSelected(ZmAutocompleteListView.PREV); break;
		case DwtKeyMap.ENTER:		this._update();  break;
		case DwtKeyMap.CANCEL:		if (this._parentAclv && this._expandTextId) {
										this._parentAclv._setExpandText(this._expandTextId, false);
									}
									this._popdown();
									break;
		default: return false;
	}
	return true;
};


ZmDLAutocompleteListView.prototype._set =
function(list, contact) {

	this._removeAll();
	this._matches = [];
	this._addMembers(list);

	// add row for selecting all at top of list
	var dl = appCtxt.getApp(ZmApp.CONTACTS).getDL(contact.getEmail());
	var numMembers = dl ? dl.total : list.length;
	var selectId = this._getId("Row", 1);
	if (numMembers != 1) {
		var table = this._getTable();
		var row = table.insertRow(0);
		row.className = this._origClass;
		selectId = row.id = this._selectAllRowId = this._getId("Row", "selectAll");
		var cell = row.insertCell(-1);
		cell.className = "AutocompleteMatchIcon";
		cell.innerHTML = AjxImg.getImageHtml("Blank16");
		cell = row.insertCell(-1);
		var text = numMembers ? ZmMsg.selectAllMembers : ZmMsg.noMembers;
		cell.innerHTML = AjxMessageFormat.format(text, [numMembers]);
	}

	AjxTimedAction.scheduleAction(new AjxTimedAction(this,
		function() {
			this._setSelected(selectId);
		}), 100);
};

ZmDLAutocompleteListView.prototype._addMembers =
function(list) {

	var table = this._getTable();
	var len = list.length;
	for (var i = 0; i < len; i++) {
		var match = list[i];
		this._matches.push(match);
		var rowId = match.id = this._getId("Row", this._matches.length);
		this._addRow(table, match, rowId);
	}
};

ZmDLAutocompleteListView.prototype._addRow =
function(table, match, rowId) {

	if (match && (match.text || match.icon)) {
		this._matchHash[rowId] = match;
		var row = table.insertRow(-1);
		row.className = this._origClass;
		row.id = rowId;
		var cell = row.insertCell(-1);
		cell.className = "AutocompleteMatchIcon";
		if (match.icon) {
			cell.innerHTML = (match.icon.indexOf('Dwt') != -1) ? ["<div class='", match.icon, "'></div>"].join("") :
																  AjxImg.getImageHtml(match.icon);
		} else {
			cell.innerHTML = "&nbsp;";
		}
		cell = row.insertCell(-1);
		cell.innerHTML = match.text || "&nbsp;";
	}
};

ZmDLAutocompleteListView.prototype._update =
function(context, match, ev) {
	
	if (this._selected == this._selectAllRowId) {
		if (!this._matchHash[this._selectAllRowId]) {
			var callback = this._handleResponseGetAllDLMembers.bind(this, ev);
			this._dlContact.getAllDLMembers(callback);
		}
	} else {
		this._doUpdate();
		this.reset(true);
	}
};

ZmDLAutocompleteListView.prototype._handleResponseGetAllDLMembers =
function(ev, result) {

	var mv = this._parentAclv._matchValue;
	var field = (mv instanceof Array) ? mv[0] : mv;
	if (result.list && result.list.length) {
		// see if client wants addresses joined, or one at a time
		if (this._parentAclv._options.massDLComplete) {
			var match = this._matchHash[this._selectAllRowId] = new ZmAutocompleteMatch();
			match[field] = result.list.join(this._parentAclv._separator);
			match.multipleAddresses = true;
			this._doUpdate();
		}
		else {
			var match = new ZmAutocompleteMatch();
			for (var i = 0, len = result.list.length; i < len; i++) {
				match[field] = result.list[i];
				this._doUpdate(match);
			}
		}
	}
	this.reset(true);
};

ZmDLAutocompleteListView.prototype._doUpdate =
function(match) {

	var context = null;
	// so that address will be taken from match
	if (this._parentAclv && this._parentAclv._currentContext) {
		context = this._parentAclv._currentContext;
		context.address = null;
	}
	match = match || this._matchHash[this._selected];
	if (!match) {
		return;
	}

	if (this._selectionCallback) {
		this._selectionCallback(match.fullAddress);
		return;
	}

	var dlBubble = document.getElementById(this._dlBubbleId);
	if (dlBubble && dlBubble._aifId && (!context || context.element._aifId != dlBubble._aifId)) {
		//this is the special case the DL was pre-created with the view. In this case we might have no context.
		// Another possible bug this fixes is if the current context is not in the same input field as the DL we are selecting from.
		var addrInputFld = DwtControl.ALL_BY_ID[dlBubble._aifId];
		if (addrInputFld){ 
			var bubbleParams = {
				address:	match.fullAddress,
				match:		match,
				noFocus:	false,
				addClass:	null,
				noParse:	false
			};
			addrInputFld.addBubble(bubbleParams);
			return;
		}
	}

	this._parentAclv._update(null, match);
};

ZmDLAutocompleteListView.handleDLScroll =
function(ev) {

	var target = DwtUiEvent.getTarget(ev);
	var view = DwtControl.findControl(target);
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
			var respCallback = ZmDLAutocompleteListView._handleResponseDLScroll.bind(null, view);
			view._parentAclv._dataAPI.expandDL(view._dlContact, listSize, respCallback);
		}
	}
};

ZmDLAutocompleteListView._handleResponseDLScroll =
function(view, matches) {
	view._addMembers(matches);
};

ZmDLAutocompleteListView.prototype.getDLSize =
function() {
	return this.size() - 1;
};

// optionally removes the DL address bubble
ZmDLAutocompleteListView.prototype.reset =
function(clearDL) {

	if (clearDL) {
		var dlBubble = document.getElementById(this._dlBubbleId);
		if (dlBubble) {
			var addrInput = DwtControl.ALL_BY_ID[dlBubble._aifId];
			if (addrInput && addrInput.removeBubble) { //it's not always really addrInput - from msg/conv view it's the msg or conv view, (unlike compose view where it's really address input
				addrInput.removeBubble(this._dlBubbleId);
				this._dlBubbleId = null;
			}
		}
	}
	ZmAutocompleteListView.prototype.reset.call(this);
};

ZmDLAutocompleteListView.prototype._popup =
function(loc) {

	if (this.getVisible()) { return; }

	loc = loc || this._getDefaultLoc();
	var x = loc.x;
	var windowSize = this.shell.getSize();
	this.setVisible(true);
	var curSize = this.getSize();
	this.setVisible(false);
	var newX = (x + curSize.x >= windowSize.x) ? windowSize.x - curSize.x : x;
	if (newX != x) {
		var parentSize = this._parentAclv.getSize();
		this._parentAclv.setLocation(windowSize.x - (curSize.x + parentSize.x + 2), Dwt.DEFAULT);
		loc.x = newX;
	}
	ZmAutocompleteListView.prototype._popup.call(this, loc);
	this.focus();
};

ZmDLAutocompleteListView.prototype._popdown =
function() {
	if (this._parentAclv) {
		this._parentAclv._curExpanded = null;
	}
	ZmAutocompleteListView.prototype._popdown.call(this);
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmAddressInputField")) {
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
 * Creates an address input field that shows addresses as bubbles.
 * @constructor
 * @class
 * This class creates and manages a control for entering email addresses and displaying
 * them in bubbles. An address's surrounding bubble can be used to remove it, or, if the
 * address is a distribution list, expand it. They can be dragged to other address fields,
 * or reordered within this one. They can be selected via a "rubber band" selection box.
 * The bubbles support a few shortcuts.
 *
 * It is not a DwtInputField. If you don't want bubbles, use that (or a native INPUT) instead.
 *
 * @author Conrad Damon
 *
 * @param {hash}					params						hash of params:
 * @param {ZmAutocompleteListView}	autocompleteListView		associated autocomplete control
 * @param {string}      			inputId						an explicit ID to use for the control's INPUT element
 * @param {string}					templateId					custom template to use
 * @param {string}					type						arbitrary type to uniquely identify this among others
 * @param {boolean}					strictMode					if true (default), bubbles must contain valid addresses
 * @param {AjxCallback|function}	bubbleAddedCallback			called when a bubble is added
 * @param {AjxCallback|function}	bubbleRemovedCallback		called when a bubble is removed
 * @param {AjxCallback|function}	bubbleMenuCreatedCallback	called when the action menu has been created
 * @param {AjxCallback|function}	bubbleMenuResetOperationsCallback	called when the action menu has reset its operations
 * @param {boolean}					noOutsideListening			don't worry about outside mouse clicks
 */
ZmAddressInputField = function(params) {

	params.parent = params.parent || appCtxt.getShell();
	params.className = params.className || "addrBubbleContainer";
	DwtComposite.call(this, params);

	this._initialize(params);

	if (params.autocompleteListView) {
		this.setAutocompleteListView(params.autocompleteListView);
	}

	this.type = params.type;
	this._strictMode = (params.strictMode !== false);
	this._noOutsideListening = params.noOutsideListening;
	this._singleBubble = params.singleBubble;

    this._bubbleAddedCallback = params.bubbleAddedCallback;
    this._bubbleRemovedCallback = params.bubbleRemovedCallback;
    this._bubbleMenuCreatedCallback = params.bubbleMenuCreatedCallback;
    this._bubbleResetOperationsCallback = params.bubbleMenuResetOperationsCallback;

	this._bubbleClassName = "addrBubble";

	this._bubbleList = new ZmAddressBubbleList({parent:this, separator:this._separator});
	this._bubbleList.addSelectionListener(this._selectionListener.bind(this));
	this._bubbleList.addActionListener(this._actionListener.bind(this));

	this._listeners = {};
	this._listeners[ZmOperation.DELETE]		= this._deleteListener.bind(this);
	this._listeners[ZmOperation.EDIT]		= this._editListener.bind(this);
	this._listeners[ZmOperation.EXPAND]		= this._expandListener.bind(this);
	this._listeners[ZmOperation.CONTACT]	= this._contactListener.bind(this);

	// drag-and-drop of bubbles
	var dropTgt = new DwtDropTarget("ZmAddressBubble");
	dropTgt.markAsMultiple();
	dropTgt.addDropListener(this._dropListener.bind(this));
	this.setDropTarget(dropTgt);

	// rubber-band selection of bubbles
	this._setEventHdlrs([DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP]);
	var dragBox = new DwtDragBox();
	dragBox.addDragListener(this._dragBoxListener.bind(this));
	this.setDragBox(dragBox);

    // Let this be a single tab stop, then manage focus among bubbles (if any) and the input using arrow keys
    this.tabGroupMember = this;

    this.addListener(DwtEvent.ONMOUSEDOWN, this._mouseDownListener);
	this._reset();
};

ZmAddressInputField.prototype = new DwtComposite;
ZmAddressInputField.prototype.constructor = ZmAddressInputField;

ZmAddressInputField.prototype.isZmAddressInputField = true;
ZmAddressInputField.prototype.isInputControl = true;
//ZmAddressInputField.prototype.role = 'combobox';
ZmAddressInputField.prototype.toString = function() { return "ZmAddressInputField"; };

ZmAddressInputField.prototype.TEMPLATE = "share.Widgets#ZmAddressInputField";

ZmAddressInputField.INPUT_EXTRA = 30;		// extra width for the INPUT
ZmAddressInputField.INPUT_EXTRA_SMALL = 10;	// edit mode

// tie a bubble SPAN to a widget that can handle clicks
ZmAddressInputField.BUBBLE_OBJ_ID = {};

// several ZmAddressInputField's can share an action menu, so save context statically
ZmAddressInputField.menuContext = {};

ZmAddressInputField.prototype.setAutocompleteListView =
function(aclv) {
	this._aclv = aclv;
	this._separator = (aclv._separator) || AjxEmailAddress.SEPARATOR;
	aclv.addCallback(ZmAutocompleteListView.CB_KEYDOWN, this._keyDownCallback.bind(this), this._inputId);
	aclv.addCallback(ZmAutocompleteListView.CB_KEYUP, this._keyUpCallback.bind(this), this._inputId);
};

// Override since we normally want to add bubble before the INPUT, and not at the end. If we're
// leaving edit mode, we want to put the bubble back where it was via the index.
ZmAddressInputField.prototype.addChild =
function(child, index) {

	DwtComposite.prototype.addChild.apply(this, arguments);

	var el = child.getHtmlElement();
	if (this._input.parentNode == this._holder) {
		var refElement;
		if (index != null) {
			var refBubble = this._getBubbleList().getBubble(index);
			refElement = refBubble && refBubble.getHtmlElement();
		}
		this._holder.insertBefore(el, refElement || this._input);
	} else {
		this._holder.appendChild(el);
	}
};

/**
 * Creates a bubble for the given address and adds it into the holding area. If the address
 * is a local group, it is expanded and the members are added individually.
 *
 * @param {hash}				params		hash of params:
 * @param {string}				address		address text to go in the bubble
 * @param {ZmAutocompleteMatch}	match		match object
 * @param {ZmAddressBubble}		bubble		bubble to clone
 * @param {int}					index		position (relative to bubbles, not elements) at which to add bubble
 * @param {boolean}				skipNotify	if true, don't call bubbleAddedCallback
 * @param {boolean}				noFocus		if true, don't focus input after bubble is added
 * @param {string}				addClass	additional class name for bubble
 * @param {boolean}				noParse		if true, do not parse content to see if it is an address
 */
ZmAddressInputField.prototype.addBubble =
function(params) {

	params = params || {};
	if (!params.address && !params.bubble) { return; }
	
	if (params.bubble) {
		params.address = params.bubble.address;
		params.match = params.bubble.match;
		params.canExpand = params.bubble.canExpand;
	}
	params.parent		= this;
	params.addrInput	= this;
	params.parentId		= this._htmlElId;
	params.className	= this._bubbleClassName ;
	params.canRemove	= true;
	params.separator	= this._separator;
	params.type			= this.type;
	
	if (params.index == null && this._editModeIndex != null) {
		params.index = this._getInsertionIndex(this._holder.childNodes[this._editModeIndex]);
	}
	
	var bubble, bubbleAdded = false;
	
	// if it's a local group, expand it and add each address separately
	var match = params.match;
	if (match && match.isGroup && match.type == ZmAutocomplete.AC_TYPE_CONTACT) {
		var addrs = AjxEmailAddress.split(params.address);
		for (var i = 0, len = addrs.length; i < len; i++) {
			params.id = params.addrObj = params.match = params.email = params.canExpand = null;
			params.address = addrs[i];
			params.index = (params.index != null) ? params.index + i : null;
			if (this._hasValidAddress(params)) {
				this._addBubble(new ZmAddressBubble(params), params.index);
				bubbleAdded = true;
			}
		}
	}
	else {
		if (this._hasValidAddress(params)) {
			bubble = new ZmAddressBubble(params);
			this._addBubble(bubble, params.index, params.noFocus);
			bubbleAdded = true;
		}
		else {
			// if handed a non-address while in strict mode, append it to the INPUT and bail
			var value = this._input.value;
			var sep = value ? this._separator : "";
			this._setInputValue([value, sep, params.address].join(""));
		}
	}

	if (bubbleAdded) {
		this._holder.className = "addrBubbleHolder";
		if (this._bubbleAddedCallback && !params.skipNotify) {
			this._bubbleAddedCallback.run(bubble, true);
		}
		this._leaveEditMode();
		return bubble;
	}
};

ZmAddressInputField.prototype._addBubble =
function(bubble, index, noFocus) {

	if (!bubble || (this._singleBubble && this._numBubbles > 0)) {
		return;
	}
	
	DBG.println("aif1", "ADD bubble: " + AjxStringUtil.htmlEncode(bubble.address));
	bubble.setDropTarget(this.getDropTarget());
	this._bubbleList.add(bubble, index);
	this._numBubbles++;

	var bubbleId = bubble._htmlElId;
	this._bubble[bubbleId] = bubble;
	this._addressHash[bubble.hashKey] = bubbleId;

	if (!noFocus) {
		this.focus();
	}

	if (this._singleBubble) {
		this._setInputEnabled(false);
	}
};

ZmAddressInputField.prototype.getAddressBubble =
function(email) {
    return this._addressHash[email];
};

ZmAddressInputField.prototype._hasValidAddress =
function(params) {
	if (!this._strictMode) {
		return true;
	}
	var addr = (params.addrObj && params.addrObj.getAddress()) || params.address || (params.match && params.match.email);
	return (Boolean(AjxEmailAddress.parse(addr)));
};

/**
 * Removes the bubble with the given ID from the holding area.
 *
 * @param {string}	bubbleId	ID of bubble to remove
 * @param {boolean}	skipNotify	if true, don't call bubbleRemovedCallback
 */
ZmAddressInputField.prototype.removeBubble =
function(bubbleId, skipNotify) {

	var bubble = DwtControl.fromElementId(bubbleId);
	if (!bubble) { return; }
	
	this._bubbleList.remove(bubble);

	bubble.dispose();

	this._bubble[bubbleId] = null;
	delete this._bubble[bubbleId];
	delete this._addressHash[bubble.hashKey];
	this._numBubbles--;

	if (this._numBubbles == 0) {
		this._holder.className = "addrBubbleHolder-empty";
	}

	this._resizeInput();

	if (this._bubbleRemovedCallback && !skipNotify) {
		this._bubbleRemovedCallback.run(bubble, false);
	}

	if (this._singleBubble && this._numBubbles === 0) {
		this._setInputEnabled(true);
	}
};

/**
 * Removes all bubbles from the holding area.
 */
ZmAddressInputField.prototype.clear =
function(skipNotify) {
	for (var id in this._bubble) {
		this.removeBubble(id, skipNotify);
	}
	this._reset();
};

/**
 * Returns a string of concatenated bubble addresses.
 */
ZmAddressInputField.prototype.getValue =
function() {
	var list = this.getAddresses();
	if (this._input.value) {
		list.push(this._input.value);
	}
	return list.join(this._separator);
};

/**
 * Parses the given text into email addresses, and adds a bubble for each one
 * that we don't already have. Since text is passed in, we don't recognize expandable DLs.
 * A bubble may be added for a string even if it doesn't parse as an email address.
 *
 * @param {string}	text				email addresses
 * @param {boolean}	add					if true, control is not cleared first
 * @param {boolean}	skipNotify			if true, don't call bubbleAddedCallback
 * @param {boolean}	invokeAutocomplete	if true, trigger autocomplete
 * 										(useful in paste event when keyup/down events don't take place
 */
ZmAddressInputField.prototype.setValue =
function(text, add, skipNotify, invokeAutocomplete) {

	if (!add) {
		this.clear();
	}
	if (!text) {
		return;
	}

	var index = null;
	if (this._editModeIndex != null) {
		index = this._getInsertionIndex(this._holder.childNodes[this._editModeIndex]);
	}

	var addrs = AjxEmailAddress.parseEmailString(text);
	var good, bad;
	if (this.type === ZmId.SEARCH) {
		// search field query isn't supposed to be validated for emails
		good = addrs.all.getArray();
		bad = [];
		// skip notify because we don't need to trigger search on text to bubble conversion
		skipNotify = true;
	}
	else {
		good = addrs.good.getArray();
		bad = addrs.bad.getArray();
	}

	for (var i = 0; i < good.length; i++) {
		var addr = good[i];
		if ((addr && !this._addressHash[addr.address])) {
			this.addBubble({
				address: addr.toString(),
				addrObj: addr,
				index: (index != null) ? index + i : null,
				skipNotify: skipNotify
			});
		}
	}

	this._setInputValue(bad.length ? bad.join(this._separator) : "");
	if (invokeAutocomplete && bad.length) {
		this._aclv.autocomplete(this.getInputElement());
	}
};

/**
 * Sets the value of the input without looking for email addresses. No bubbles will be added.
 * 
 * @param {string}	text		new input content
 */
ZmAddressInputField.prototype.setInputValue =
function(text) {
	this._input.value = text;
	this._resizeInput();
};

/**
 * Adds address(es) to the input.
 * 
 * @param {string}	text		email addresses
 * @param {boolean}	skipNotify	if true, don't call bubbleAddedCallback
 */
ZmAddressInputField.prototype.addValue =
function(text, skipNotify) {
	this.setValue(text, true, skipNotify);
};

/**
 * Removes the selected bubble. If none are selected, selects the last one.
 *
 * @param {boolean}		checkInput		if true, make sure INPUT is empty
 *
 * @return {boolean}	true if the delete selected or removed a bubble
 */
ZmAddressInputField.prototype.handleDelete =
function(checkInput) {

	if (checkInput && this._input.value.length > 0) {
		return false;
	}

	var sel = this.getSelection();
	if (sel.length) {
		for (var i = 0, len = sel.length; i < len; i++) {
			if (sel[i]) {
				this.removeBubble(sel[i].id);
			}
		}
		this.focus();
		return true;
	}
	else {
		return this._selectBubbleBeforeInput();
	}
};

// Selects the bubble to the left of the (empty) INPUT, if there is one.
ZmAddressInputField.prototype._selectBubbleBeforeInput =
function() {
	
	if (!this._input.value) {
		var index = this._getInputIndex();
		var span = (index > 0) && this._holder.childNodes[index - 1];
		var bubble = DwtControl.fromElement(span);
		if (bubble) {
			this.setSelected(bubble, true);
			this.blur();
			appCtxt.getKeyboardMgr().grabFocus(bubble);
			return true;
		}
	}
	return false;
};

/**
 * Sets selection of the given bubble.
 *
 * @param {Element}	bubble		bubble to select
 * @param {boolean} selected	if true, select the bubble, otherwise deselect it
 */
ZmAddressInputField.prototype.setSelected =
function(bubble, selected) {
	this._bubbleList.setSelected(bubble, selected);
};

/**
 * Returns a list of the currently selected bubbles. If a bubble has been selected via right-click,
 * but is not part of the current left-click selection, only it will be returned.
 *
 * @param {ZmAddressBubble}	bubble	reference bubble
 */
ZmAddressInputField.prototype.getSelection =
function(bubble) {
	return this._bubbleList.getSelection(bubble);
};

ZmAddressInputField.prototype.getSelectionCount =
function(bubble) {
	return this._bubbleList.getSelectionCount(bubble);
};

ZmAddressInputField.prototype.deselectAll =
function() {
	this._bubbleList.deselectAll();
};

ZmAddressInputField.prototype.preventSelection =
function(targetEl) {
	return !(this._bubble[targetEl.id] || this.__isInputEl(targetEl));
};

/**
 * Makes bubbles out of addresses in pasted text.
 *
 * @param ev
 */
ZmAddressInputField.onPaste =
function(ev) {
	var addrInput = ZmAddressInputField._getAddrInputFromEvent(ev);
	if (addrInput) {
		// trigger autocomplete after paste to accommodate  mouse click pastes
		var invokeAutocomplete = true;
		// give browser time to update input - easier than dealing with clipboard
		// will also resize the INPUT
		AjxTimedAction.scheduleAction(
			new AjxTimedAction(
				addrInput,
				addrInput._checkInput,
				[null, invokeAutocomplete]
			), 100
		);
	}
};

ZmAddressInputField.onCut =
function(ev) {
	var addrInput = ZmAddressInputField._getAddrInputFromEvent(ev);
	if (addrInput) {
		addrInput._resizeInput();
	}
};

/**
 * Handle arrow up, arrow down for bubble holder
 *
 * @param ev
 */
ZmAddressInputField.onHolderKeyClick =
function(ev) {
    ev = DwtUiEvent.getEvent(ev);
    var key = DwtKeyEvent.getCharCode(ev);
    if (key === DwtKeyEvent.KEY_ARROW_UP) {
        if (this.clientHeight >= this.scrollHeight) { return; }
	    this.scrollTop = Math.max(this.scrollTop - this.clientHeight, 0);
        DBG.println("aif", "this.scrollTop  = " + this.scrollTop);
    }
    else if (key === DwtKeyEvent.KEY_ARROW_DOWN) {
         if (this.clientHeight >= this.scrollHeight) { return; }
	     this.scrollTop = Math.min(this.scrollTop + this.clientHeight, this.scrollHeight - this.clientHeight);
         DBG.println("aif", "this.scrollTop  = " + this.scrollTop);
    }
};

// looks for valid addresses in the input, and converts them to bubbles
ZmAddressInputField.prototype._checkInput =
function(text, invokeAutocomplete) {
	text = text || this._input.value;
	DBG.println("aif", "CHECK input: " + AjxStringUtil.htmlEncode(text));
	if (text) {
		this.setValue(text, true, false, invokeAutocomplete);
	}
};

// focus input when holder div is clicked
ZmAddressInputField.onHolderClick =
function(ev) {
	DBG.println("aif", "ZmAddressInputField.onHolderClick");
	var addrInput = ZmAddressInputField._getAddrInputFromEvent(ev);
	if (addrInput) {
		addrInput.focus();

		// bug 85036: ensure caret visibility on IE by resetting the selection
		var input = addrInput.getInputElement();
		Dwt.setSelectionRange(input, Dwt.getSelectionStart(input),
		                      Dwt.getSelectionEnd(input));
	}
};

/**
 * Removes the bubble with the given ID from the holding area.
 *
 * @param {string}	bubbleId	ID of bubble to remove
 * @param {boolean}	skipNotify	if true, don't call bubbleRemovedCallback
 *
 */
ZmAddressInputField.removeBubble =
function(bubbleId, skipNotify) {

	var bubble = document.getElementById(bubbleId);
	DBG.println("aif", "REMOVE bubble: " + AjxStringUtil.htmlEncode(bubble.address));
	var parentId = bubble._aifId || ZmAddressInputField.BUBBLE_OBJ_ID[bubbleId];
	var addrInput = bubble && DwtControl.ALL_BY_ID[parentId];
	if (addrInput && addrInput.getEnabled()) {
		addrInput.removeBubble(bubbleId, skipNotify);
		addrInput.focus();
	}
};

ZmAddressInputField.prototype.getInputElement =
function() {
	return this._input;
};

ZmAddressInputField.prototype._focus = function() {
    this.setDisplayState(DwtControl.FOCUSED);
};

ZmAddressInputField.prototype._blur = function() {
    this.setDisplayState(DwtControl.NORMAL);
};

ZmAddressInputField.prototype.setEnabled =
function(enabled) {
	DwtControl.prototype.setEnabled.call(this, enabled);
	this._input.disabled = !enabled;
};

/**
 * Enables or disables the input without affecting the bubbles.
 *
 * @param {boolean} enabled		enable input if true, disable if false
 */
ZmAddressInputField.prototype._setInputEnabled =
function(enabled) {
	this._input.disabled = !enabled;
};

ZmAddressInputField.prototype._initialize =
function(params) {

	this._holderId = Dwt.getNextId();
	this._inputId = params.inputId || Dwt.getNextId();
	this._label = params.label;
	this._dragInsertionBarId = Dwt.getNextId();
	var data = {
		inputTagName:		AjxEnv.isIE || AjxEnv.isModernIE ? 'textarea' : 'input type="text" ',
		holderId:			this._holderId,
		inputId:			this._inputId,
		label:				this._label,
		dragInsertionBarId:	this._dragInsertionBarId
	};
	this._createHtmlFromTemplate(params.templateId || this.TEMPLATE, data);

	this._holder = document.getElementById(this._holderId);
	this._holder._aifId = this._htmlElId;
	this._input = document.getElementById(this._inputId);
	this._input.supportsAutoComplete = true;
	this._dragInsertionBar = document.getElementById(this._dragInsertionBarId);

	Dwt.setHandler(this._holder, DwtEvent.ONCLICK, ZmAddressInputField.onHolderClick);
	Dwt.setHandler(this._input, DwtEvent.ONCUT, ZmAddressInputField.onCut);
	Dwt.setHandler(this._input, DwtEvent.ONPASTE, ZmAddressInputField.onPaste);
    Dwt.setHandler(this._holder, DwtEvent.ONKEYDOWN, ZmAddressInputField.onHolderKeyClick);

    this.setFocusElement(); // now that INPUT has been created

    var args = {container:this._holder, threshold:10, amount:15, interval:5, id:this._holderId};
    this._dndScrollCallback = DwtControl._dndScrollCallback.bind(null, [args]);
    this._dndScrollId = this._holderId;
};

ZmAddressInputField.prototype._reset =
function() {

	this._bubble		= {};	// bubbles by bubble ID
	this._addressHash	= {};	// used addresses, so we can check for dupes

	this._numBubbles	= 0;

	this._bubbleList.reset();

	this._editMode = false;
	this._editModeIndex = this._editModeBubble = null;

	this._dragInsertionBarIndex = null;	// node index vertical bar indicating insertion point

	this._holder.className = "addrBubbleHolder-empty";
	this._setInputValue("");
};

ZmAddressInputField.prototype.moveCursorToEnd =
function() {
	Dwt.moveCursorToEnd(this._input);
};

ZmAddressInputField.prototype._setInputValue =
function(value) {
	DBG.println("aif", "SET input value to: " + AjxStringUtil.htmlEncode(value));
	this._input.value = value && value.replace(/\s+/g, ' ');
	this._resizeInput();
};

// Handles key events that occur in the INPUT.
ZmAddressInputField.prototype._keyDownCallback =
function(ev, aclv) {
	ev = DwtUiEvent.getEvent(ev);
	var key = DwtKeyEvent.getCharCode(ev);
	var propagate;
	var clearInput = false;
	
	if (DwtKeyMapMgr.hasModifier(ev) || ev.shiftKey) {
		return propagate;
	}

	// Esc in edit mode restores the original address to the bubble
	if (key === DwtKeyEvent.KEY_ESCAPE && this._editMode) {
		DBG.println("aif", "_keyDownCallback found ESC key in edit mode");
		this._leaveEditMode(true);
		propagate = false;	// eat the event - eg don't let compose view catch Esc and pop the view
		clearInput = true;
	}
	// Del removes selected bubbles, or selects last bubble if there is no input
	else if (key === DwtKeyEvent.KEY_BACKSPACE) {
		DBG.println("aif", "_keyDownCallback found DEL key");
		if (this.handleDelete(true)) {
			propagate = false;
		}
	}
	// Left arrow selects last bubble if there is no input
	else if (key === DwtKeyEvent.KEY_ARROW_LEFT) {
		DBG.println("aif", "_keyDownCallback found left arrow");
		if (this._selectBubbleBeforeInput()) {
			propagate = false;
		}
	}
	// Handle case where user is leaving edit while we're not in strict mode
	// (in strict mode, aclv will call addrFoundCallback if it gets a Return)
	else if (!this._strictMode && DwtKeyEvent.IS_RETURN[key]) {
		DBG.println("aif", "_keyDownCallback found RETURN");
		var bubble = this._editMode && this._editModeBubble;
		if (bubble && !bubble.addrObj) {
			this._leaveEditMode();
			propagate = false;
			clearInput = true;
		}
	}

	if (clearInput && AjxEnv.isGeckoBased) {
		AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._setInputValue, [""]), 20);
	}
	
	return propagate;
};

// need to do this on keyup, after character has appeared in the INPUT
ZmAddressInputField.prototype._keyUpCallback =
function(ev, aclv) {
	if (!this._input.value && this._editMode) {
		if (this._bubbleRemovedCallback) {
			this._bubbleRemovedCallback.run(this._editModeBubble, false);
		}
		this._leaveEditMode();
	}
	this._resizeInput();
};

ZmAddressInputField.prototype._selectionListener =
function(ev) {

	var bubble = ev.item;
	if (ev.detail == DwtEvent.ONDBLCLICK) {
		// Double-clicking a bubble moves it into edit mode. It is replaced by the
		// INPUT, which is moved to the bubble's position. The bubble's address fills
		// the input and is selected.
		this.setSelected(bubble, false);
		this._checkInput();
		this._enterEditMode(bubble);
	}
	else {
		this._resetOperations();
	}
};

ZmAddressInputField.prototype._actionListener =
function(ev) {

	var bubble = ev.item;
	var menu = this.getActionMenu();
	ZmAddressInputField.menuContext.addrInput = this;
	ZmAddressInputField.menuContext.event = ev;
	ZmAddressInputField.menuContext.bubble = bubble;

	DBG.println("aif", "right sel bubble: " + bubble.id);
	this._resetOperations();

	var email = bubble.email;
	var contactsEnabled = appCtxt.get(ZmSetting.CONTACTS_ENABLED);
	if (email && contactsEnabled) {
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		// first check if contact is cached, and no server call is needed
		var contact = contactsApp.getContactByEmail(email);
		if (contact) {
			this._handleResponseGetContact(ev, contact);
		} else {
			menu.getOp(ZmOperation.CONTACT).setText(ZmMsg.loading);
			var respCallback = this._handleResponseGetContact.bind(this, ev);
			contactsApp.getContactByEmail(email, respCallback);
		}
	}
	else {
		var actionMenu = this.getActionMenu();
		if (actionMenu.getOp(ZmOperation.CONTACT)) {
			actionMenu.getOp(ZmOperation.CONTACT).setVisible(false);
			this._setContactText(null);
		}
		if (actionMenu.getOp(ZmOperation.EXPAND)) {
			actionMenu.getOp(ZmOperation.EXPAND).setVisible(false);
		}

		menu.popup(0, ev.docX || bubble.getXW(), ev.docY || bubble.getYH());
	}

	// if we are listening for outside mouse clicks, add the action menu to the elements
	// defined as "inside" so that clicking a menu item doesn't call our outside listener
	// and deselectAll before the menu listener does its thing
	if (!this._noOutsideListening && (this.getSelectionCount() > 0)) {
		var omem = appCtxt.getOutsideMouseEventMgr();
		var omemParams = {
			id:					"ZmAddressBubbleList",
			obj:				menu,
			outsideListener:	this.getOutsideListener()
		}
		DBG.println("aif", "ADD menu to outside listening " + this._input.id);
		omem.startListening(omemParams);
	}
};

ZmAddressInputField.prototype.getOutsideListener =
function() {
	return this._bubbleList ? this._bubbleList._outsideMouseListener.bind(this._bubbleList) : null;
};

ZmAddressInputField.prototype.getActionMenu =
function() {
	var menu = this._actionMenu || this.parent._bubbleActionMenu;
	if (!menu) {
		menu = this._actionMenu = this.parent._bubbleActionMenu = this._createActionMenu();
	}
	return menu;
};

ZmAddressInputField.prototype._createActionMenu =
function() {

	DBG.println("aif", "create action menu for " + this._input.id);
	var menuItems = this._getActionMenuOps();
	var menu = new ZmActionMenu({parent:this.shell, menuItems:menuItems});
	for (var i = 0; i < menuItems.length; i++) {
		var menuItem = menuItems[i];
		if (this._listeners[menuItem]) {
			menu.addSelectionListener(menuItem, this._listeners[menuItem]);
		}
	}

	var copyMenuItem = menu.getOp(ZmOperation.COPY);
	if (copyMenuItem) {
		appCtxt.getClipboard().init(copyMenuItem, {
			onMouseDown:    this._clipCopy.bind(this),
			onComplete:     this._clipCopyComplete.bind(this)
		});
	}

	menu.addPopdownListener(this._menuPopdownListener.bind(this));

	if (this._bubbleMenuCreatedCallback) {
		this._bubbleMenuCreatedCallback.run(this, menu);
	}

	return menu;
};

ZmAddressInputField.prototype._resetOperations =
function() {

	var menu = this.getActionMenu();
	if (menu) {
		var sel = this.getSelection();
		var bubble = (sel.length == 1) ? sel[0] : null;
		menu.enable(ZmOperation.DELETE, sel.length > 0);
		menu.enable(ZmOperation.COPY, sel.length > 0);
		menu.enable(ZmOperation.EDIT, Boolean(bubble));
		var email = bubble && bubble.email;
		var ac = window.parentAppCtxt || window.appCtxt;
		var isExpandableDl = ac.isExpandableDL(email);
		menu.enable(ZmOperation.EXPAND, isExpandableDl);
		//not sure this is %100 good, since isExpandableDL returns false also if EXPAND_DL_ENABLED setting is false.
		//but I tried to do this in _setContactText by passing in the contact we get (using getContactByEmail) - but that contact somehow doesn't
		//have isGal set or type "group" (the type is "contact"), thus isDistributionList returns null. Not sure what this inconsistency comes from.

		//so this is messy and I just try to do the best with information - see the comment above - so I use isExpandableDl as indication of DL (sometimes it's false despite it being an expandable DL)
		//and I also use isDL as another way to try to know if it's a DL (by trying to find the contact from the contactsApp cache - sometimes it's there, sometimes not (it's there
		//after you go to the DL folder).
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var contact = contactsApp && contactsApp.getContactByEmail(email);
		var isDL = contact && contact.isDistributionList();
		var canEdit = !(isDL || isExpandableDl) || (contact && contact.dlInfo && contact.dlInfo.isOwner);
		menu.enable(ZmOperation.CONTACT, canEdit);

	}

	if (this._bubbleResetOperationsCallback) {
		this._bubbleResetOperationsCallback.run(this, menu);
	}
};

ZmAddressInputField.prototype._getActionMenuOps =
function() {

	var ops = [ZmOperation.DELETE];
	if (AjxClipboard.isSupported()) {
		ops.push(ZmOperation.COPY);
	};
	ops.push(ZmOperation.EDIT);
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		ops.push(ZmOperation.EXPAND);
		ops.push(ZmOperation.CONTACT);
	}
	return ops;
};

ZmAddressInputField.prototype._handleResponseGetContact = function(ev, contact) {

	ZmAddressInputField.menuContext.contact = contact;
	this._setContactText(contact);
    var x = ev.docX > 0 ? ev.docX : ev.item.getXW(),
        y = ev.docY > 0 ? ev.docY : ev.item.getYH();

	this.getActionMenu().popup(0, x, y);
};

ZmAddressInputField.prototype._setContactText =
function(contact) {
	ZmBaseController.setContactTextOnMenu(contact, this.getActionMenu());
};

ZmAddressInputField.prototype._deleteListener =
function() {
	var addrInput = ZmAddressInputField.menuContext.addrInput;
	var sel = addrInput && addrInput.getSelection();
	if (sel && sel.length) {
		for (var i = 0; i < sel.length; i++) {
			addrInput.removeBubble(sel[i].id);
		}
	}
};

ZmAddressInputField.prototype._editListener =
function() {
	var addrInput = ZmAddressInputField.menuContext.addrInput;
	var bubble = ZmAddressInputField.menuContext.bubble;
	if (addrInput && bubble) {
		addrInput._enterEditMode(bubble);
	}
};

ZmAddressInputField.prototype._expandListener =
function() {
	var addrInput = ZmAddressInputField.menuContext.addrInput;
	var bubble = ZmAddressInputField.menuContext.bubble;
	if (addrInput && bubble) {
		ZmAddressBubble.expandBubble(bubble.id, bubble.email);
	}
};

/**
 * If there's a contact for the participant, edit it, otherwise add it.
 *
 * @private
 */
ZmAddressInputField.prototype._contactListener =
function(ev) {
	var addrInput = ZmAddressInputField.menuContext.addrInput;
	if (addrInput) {
		var loadCallback = addrInput._handleLoadContactListener.bind(addrInput);
		AjxDispatcher.require(["ContactsCore", "Contacts"], false, loadCallback, null, true);
	}
};

/**
 * @private
 */
ZmAddressInputField.prototype._handleLoadContactListener =
function() {

	var ctlr = window.parentAppCtxt ? window.parentAppCtxt.getApp(ZmApp.CONTACTS).getContactController() :
									  AjxDispatcher.run("GetContactController");
	var contact = ZmAddressInputField.menuContext.contact;
	if (contact) {
		if (contact.isLoaded) {
			ctlr.show(contact);
		} else {
			var callback = this._loadContactCallback.bind(this);
			contact.load(callback);
		}
	} else {
		var contact = new ZmContact(null);
		var bubble = ZmAddressInputField.menuContext.bubble;
		var email = bubble && bubble.email;
		if (email) {
			contact.initFromEmail(email);
			ctlr.show(contact, true);
		}
	}
};

ZmAddressInputField.prototype._loadContactCallback =
function(resp, contact) {
	var ctlr = window.parentAppCtxt ? window.parentAppCtxt.getApp(ZmApp.CONTACTS).getContactController() :
									  AjxDispatcher.run("GetContactController");
	ctlr.show(contact);
};

// Copies address text from the active bubble to the clipboard.
ZmAddressInputField.prototype._clipCopy =
function(clip) {
	clip.setText(ZmAddressInputField.menuContext.bubble.address + this._separator);
};

ZmAddressInputField.prototype._clipCopyComplete =
function(clip) {
	this._actionMenu.popdown();
};

ZmAddressInputField.prototype._menuPopdownListener =
function() {

	var bubble = ZmAddressInputField.menuContext.bubble;
	if (bubble) {
		bubble.setClassName(this._bubbleClassName);
	}

	if (!this._noOutsideListening && (this.getSelectionCount() > 0)) {
		DBG.println("aif", "REMOVE menu from outside listening " + this._input.id);
		var omem = appCtxt.getOutsideMouseEventMgr();
		omem.stopListening({id:"ZmAddressInputField", obj:this.getActionMenu()});
	}

	// use a timer since popdown happens before listeners are called; alternatively, we could put the
	// code below at the end of every menu action listener
	AjxTimedAction.scheduleAction(new AjxTimedAction(this,
		function() {
			DBG.println("aif", "_menuPopdownListener");
			ZmAddressInputField.menuContext = {};
			this._bubbleList.clearRightSelection();
		}), 10);
};

ZmAddressInputField.prototype._enterEditMode =
function(bubble) {

	DBG.println("aif", "ENTER edit mode");
	if (this._editMode) {
		// user double-clicked a bubble while another bubble was being edited
		this._leaveEditMode();
	}

	this._editMode = true;
	this._editModeIndex = this._getBubbleIndex(bubble);
	DBG.println("aif", "MOVE input");
	this._holder.insertBefore(this._input, bubble.getHtmlElement());
	this.removeBubble(bubble.id, true);

	this._editModeBubble = bubble;
	this._setInputValue(bubble.address);

	// Chrome triggers BLUR after DBLCLICK, so use a timer to make sure select works
	AjxTimedAction.scheduleAction(new AjxTimedAction(this,
		function() {
			this.focus();
			this._input.select();
		}), 20);

	if (this._singleBubble) {
		this._setInputEnabled(true);
	}
};

ZmAddressInputField.prototype._leaveEditMode =
function(restore) {

	DBG.println("aif", "LEAVE edit mode");
	if (!this._editMode) {
		return;
	}

	if (this._holder.lastChild != this._input) {
		this._holder.appendChild(this._input);
	}
	var bubble = restore && this._editModeBubble;
	this._checkInput(bubble && bubble.address);
	this.focus();

	this._editMode = false;
	this._editModeIndex = this._editModeBubble = null;
	DBG.println("aif", "input value: " + AjxStringUtil.htmlEncode(this._input.value));
};

// size the input to a bit more than its current content
ZmAddressInputField.prototype._resizeInput =
function() {
	var val = AjxStringUtil.htmlEncode(this._input.value);
	var paddings = Dwt.getMargins(this._holder);
	var margins = Dwt.getMargins(this._input);
	var maxWidth = Dwt.getSize(this._holder).x - (this._input.offsetLeft + ((AjxEnv.isTrident) ? (margins.left + paddings.left) : 0) + paddings.right + margins.right + 1);
	maxWidth = Math.max(maxWidth, 3); //don't get too small - minimum 3 - if it gets negative, the cursor would not show up before starting to type (bug 84924)

	var inputWidth = "100%";
	if (this._input.supportsAutoComplete) {
		var inputFontSize = DwtCssStyle.getProperty(this._input, "font-size");
		var strW = AjxStringUtil.getWidth(val, false, inputFontSize);
		if (AjxEnv.isWindows && (AjxEnv.isFirefox || AjxEnv.isSafari || AjxEnv.isChrome) ){
			// FF/Win: fudge factor since string is longer in INPUT than when measured in SPAN
			strW = strW * 1.2;
		}
		var pad = this._editMode ? ZmAddressInputField.INPUT_EXTRA_SMALL : ZmAddressInputField.INPUT_EXTRA;
		inputWidth = Math.min(strW + pad, maxWidth);
		if (this._editMode) {
			inputWidth = Math.max(inputWidth, ZmAddressInputField.INPUT_EXTRA);
		}
	}
	Dwt.setSize(this._input, inputWidth, Dwt.DEFAULT);
};

ZmAddressInputField.prototype.hasFocus =
function(ev) {
	return true;
};

ZmAddressInputField.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_ADDRESS;
};

// invoked when at least one bubble is selected
ZmAddressInputField.prototype.handleKeyAction =
function(actionCode, ev) {

	var selCount = this.getSelectionCount();
	if (!selCount || this._editMode) {
        // it might be nicer to allow arrowing out of the field (eg right arrow when at end of input) to move to
        // another bubble or toolbar control, but getting the cursor position is not reliable
        ev.forcePropagate = true;
		return true;
	}
	DBG.println("aif", "handle shortcut: " + actionCode);
	
	switch (actionCode) {

		case DwtKeyMap.DELETE:
			this.handleDelete();
			break;

		case DwtKeyMap.SELECT_NEXT:
			if (selCount == 1) {
				this._selectAdjacentBubble(true);
			}
			break;

		case DwtKeyMap.SELECT_PREV:
			if (selCount == 1) {
				this._selectAdjacentBubble(false);
			}
			break;

		default:
			return false;
	}

	return true;
};

// Returns an ordered list of bubbles
ZmAddressInputField.prototype._getBubbleList =
function() {

	var list = [];
	var children = this._holder.childNodes;
	for (var i = 0; i < children.length; i++) {
		var id = children[i].id;
		if (id && this._bubble[id]) {
			var bubble = DwtControl.fromElementId(id);
			if (bubble) {
				list.push(bubble);
			}
		}
	}
	
	this._bubbleList.set(list);
	return this._bubbleList;
};

ZmAddressInputField.prototype.getBubbleCount =
function() {
	return this._getBubbleList().getArray().length;
};

// returns the index of the given bubble among all the holder's elements (not just bubbles)
ZmAddressInputField.prototype._getBubbleIndex =
function(bubble) {
	return AjxUtil.indexOf(this._holder.childNodes, bubble.getHtmlElement());
};

// returns the index of the INPUT among all the holder's elements
ZmAddressInputField.prototype._getInputIndex =
function() {
	return AjxUtil.indexOf(this._holder.childNodes, this._input);
};

/**
 * Selects the next or previous bubble relative to the selected one.
 *
 * @param {boolean}			next		if true, select next bubble; otherwise select previous bubble
 */
ZmAddressInputField.prototype._selectAdjacentBubble =
function(next) {

	var sel = this.getSelection();
	var bubble = sel && sel.length && sel[0];
	if (!bubble) { return; }

	var index = this._getBubbleIndex(bubble);
	index = next ? index + 1 : index - 1;
	var children = this._holder.childNodes;
	var el = (index >= 0 && index < children.length) && children[index];
	if (el == this._dragInsertionBar) {
		index = next ? index + 1 : index - 1;
		el = (index >= 0 && index < children.length) && children[index];
	}
	if (el) {
		if (el == this._input) {
			this.setSelected(bubble, false);
			this.focus();
		}
		else {
			var newBubble = DwtControl.fromElement(el);
			if (newBubble) {
				this.setSelected(bubble, false);
				this.setSelected(newBubble, true);
			}
		}
	}
};

/**
 * Returns an ordered list of bubble addresses.
 *
 * @param {boolean}	asObjects	if true, return list of AjxEmailAddress
 */
ZmAddressInputField.prototype.getAddresses =
function(asObjects) {

	var addrs = [];
	var bubbles = this._getBubbleList().getArray();
	var ac = window.parentAppCtxt || window.appCtxt;
	for (var i = 0; i < bubbles.length; i++) {
		var bubble = bubbles[i];
		var addr = bubble.address;
		if (asObjects) {
			var addrObj = AjxEmailAddress.parse(addr) || new AjxEmailAddress("", null, addr);
			if (ac.isExpandableDL(bubble.email) || (bubble.match && bubble.match.isDL)) {
				addrObj.isGroup = true;
				addrObj.canExpand = true;
			}
			addrs.push(addrObj);
		}
		else {
			addrs.push(addr);
		}
	}
	return addrs;
};

ZmAddressInputField._getAddrInputFromEvent =
function(ev) {
	var target = DwtUiEvent.getTarget(ev);
	return target && DwtControl.ALL_BY_ID[target._aifId];
};

/**
 * Since both the input and each of its bubbles has a drop listener, the target object may be
 * either of those object types. Dropping is okay if we're over a different type of input, or if
 * we're reordering bubbles within the same input.
 */
ZmAddressInputField.prototype._dropListener =
function(dragEv) {

	var sel = dragEv.srcData && dragEv.srcData.selection;
	if (!(sel && sel.length)) { return; }

	if (dragEv.action == DwtDropEvent.DRAG_ENTER) {
		DBG.println("aif", "DRAG_ENTER");
		var targetObj = dragEv.uiEvent.dwtObj;
		var targetInput = targetObj.isAddressBubble ? targetObj.addrInput : targetObj;
		var dragBubble = sel[0];
		if (dragBubble.type != this.type) {
			dragEv.doIt = true;
		}
		else if (targetInput._numBubbles <= 1) {
			dragEv.doIt = false;
		}
		if (dragEv.doIt && targetInput._numBubbles >= 1) {
			var idx = targetInput._getIndexFromEvent(dragEv.uiEvent);
			var bubbleIdx = targetInput._getBubbleIndex(dragBubble);
			DBG.println("aif", "idx: " + idx + ", bubbleIdx: " + bubbleIdx);
			if ((dragBubble.type == this.type) && (idx == bubbleIdx || idx == bubbleIdx + 1)) {
				dragEv.doIt = false;
			}
			else {
				this._setInsertionBar(idx);
			}
		}
		if (!dragEv.doIt) {
			this._setInsertionBar(null);
		}
	}
	else if (dragEv.action == DwtDropEvent.DRAG_LEAVE) {
		DBG.println("aif", "DRAG_LEAVE");
		this._setInsertionBar(null);
	}
	else if (dragEv.action == DwtDropEvent.DRAG_DROP) {
		DBG.println("aif", "DRAG_DROP");
		var sourceInput = dragEv.srcData.addrInput;
		var index = this._getInsertionIndex(this._dragInsertionBar);
		for (var i = 0; i < sel.length; i++) {
			var bubble = sel[i];
			var id = bubble.id;
			this.addBubble({bubble:bubble, index:index + i});
			sourceInput.removeBubble(id);
		}
		this._setInsertionBar(null);
	}
};

ZmAddressInputField.prototype._dragBoxListener =
function(ev) {
    // Check if user is using scroll bar rather than trying to drag.
    if (ev && ev.srcControl && this._holder) {
        var scrollWidth = this._holder.scrollWidth;  //returns width w/out scrollbar
        var scrollPos = scrollWidth + Dwt.getLocation(this._holder).x;
        var dBox = ev.srcControl.getDragBox();
        if (dBox) {
            DBG.println("aif", "DRAG_BOX x =" + dBox.getStartX() + " scrollWidth = " + scrollWidth);
            if (dBox.getStartX() > scrollPos) {
                DBG.println("aif", "DRAG_BOX x =" + dBox.getStartX() + " scrollPos = " + scrollPos);
                return false;
            }
        }
    }

	if (ev.action == DwtDragEvent.DRAG_INIT) {
		// okay to draw drag box if we have at least one bubble, and user isn't clicking in
		// the non-empty INPUT (might be trying to select text)
		return (this._numBubbles > 0 && (ev.target != this._input || this._input.value == ""));
	}
	else if (ev.action == DwtDragEvent.DRAG_START) {
		DBG.println("aif", "ZmAddressInputField DRAG_START");
		this.deselectAll();
		this.blur();
	}
	else if (ev.action == DwtDragEvent.DRAG_MOVE) {
//		DBG.println("aif", "ZmAddressInputField DRAG_MOVE");
		var box = this._dragSelectionBox;
		for (var id in this._bubble) {
			var bubble = this._bubble[id];
			var span = bubble.getHtmlElement();
			var sel = Dwt.doOverlap(box, span);
			if (sel != this._bubbleList.isSelected(bubble)) {
				this.setSelected(bubble, sel);
				appCtxt.getKeyboardMgr().grabFocus(bubble);
			}
		}
	}
	else if (ev.action == DwtDragEvent.DRAG_END) {
		DBG.println("aif", "ZmAddressInputField DRAG_END");
		this._bubbleList._checkSelection();
		if (AjxEnv.isWindows && (this.getSelectionCount() == 0)) {
			this.blur();
			this.focus();
		}
	}
};

ZmAddressInputField.prototype._mouseDownListener =
function(ev) {
    // reset mouse event to propagate event to browser (allows focus on input when clicking on holder click)
    ev._stopPropagation = false;
    ev._returnValue = true;
};

// Returns insertion index (among all elements) based on event coordinates
ZmAddressInputField.prototype._getIndexFromEvent =
function(ev) {

	var bubble, w, bx, idx;
	var bubble = (ev.dwtObj && ev.dwtObj.isAddressBubble) ? ev.dwtObj : null;
	if (bubble) {
		w = bubble.getSize().x;
		bx = ev.docX - bubble.getLocation().x;
		idx = this._getBubbleIndex(bubble);	// TODO: cache?
		return (bx > (w / 2)) ? idx + 1 : idx;
	}
	else {
		idx = 0;
		var children = this._holder.childNodes;
		for (var i = 0; i < children.length; i++) {
			var id = children[i].id;
			bubble = id && this._bubble[id];
			if (bubble) {
				w = bubble.getSize().x;
				bx = ev.docX - bubble.getLocation().x;
				if (bx < (w / 2)) {
					return idx;
				}
				else {
					idx++;
				}
			}
			else if (i < (children.length - 1)) {
				idx++;
			}
		}
		return idx;
	}
};

ZmAddressInputField.prototype._setInsertionBar =
function(index) {

	if (index == this._dragInsertionBarIndex) { return; }

	var bar = this._dragInsertionBar;
	if (index != null) {
		bar.style.display = "inline";
		var refElement = this._holder.childNodes[index];
		if (refElement) {
			this._holder.insertBefore(bar, refElement);
			this._dragInsertionBarIndex = index;
		}
	}
	else {
		bar.style.display = "none";
		this._dragInsertionBarIndex = null;
	}
};

ZmAddressInputField.prototype._getInsertionIndex =
function(element) {

	var bubbleIndex = 0;
	var children = this._holder.childNodes;
	for (var i = 0; i < children.length; i++) {
		var el = children[i];
		if (el == element) {
			break;
		}
		else if (el && this._bubble[el.id]) {
			bubbleIndex++;
		}
	}
	return bubbleIndex;
};




/**
 * Creates a bubble that contains an email address.
 * @constructor
 * @class
 * This class represents an object that allows various operations to be performed on an
 * email address within a compose or display context.
 *
 * @param {hash}				params		the hash of parameters:
 * @param {ZmAddressInputField}	parent		parent control
 * @param {string}				id			element ID for the bubble
 * @param {string}				className	CSS class for the bubble
 * @param {string}				address		email address to display in the bubble
 * @param {AjxEmailAddress}		addrObj		email address (alternative form)
 * @param {boolean}				canRemove	if true, an x will be provided to remove the address bubble
 * @param {boolean}				canExpand	if true, a + will be provided to expand the DL address
 * @param {string}				separator	address separator
 *
 * @extends DwtControl
 */
ZmAddressBubble = function(params) {

	params = params || {};
	params.id = this.id = params.id || Dwt.getNextId();
	params.className = params.className || "addrBubble";
	if (params.addClass) {
		params.className = [params.className, params.addClass].join(" ");
	}
	DwtControl.call(this, params);

	this.type = params.type;
	this.isAddressBubble = true;

	var addrInput = this.addrInput = params.addrInput;
	var match = this.match = params.match;
	var addrContent = !params.noParse && (params.address || (match && match.email));
	var addrObj = this.addrObj = params.addrObj || (addrContent && AjxEmailAddress.parse(addrContent));
	this.address = params.address || (addrObj && addrObj.toString());
	this.email = params.email = params.email || (addrObj && addrObj.getAddress()) || "";
	// text search bubbles won't have anything in the "email" field so we need to use "address" for hash lookup
	this.hashKey = this.type === ZmId.SEARCH ? this.address : this.email;
	var ac = window.parentAppCtxt || window.appCtxt;
	this.canExpand = params.canExpand = params.canExpand || ac.isExpandableDL(this.email);
	
	this._createHtml(params);

	this._setEventHdlrs([DwtEvent.ONCLICK, DwtEvent.ONDBLCLICK,
						 DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT,
						 DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP]);
	this.addListener(DwtEvent.ONCLICK, this._clickListener.bind(this));
	this.addListener(DwtEvent.ONDBLCLICK, this._dblClickListener.bind(this));
	this.addListener(DwtEvent.ONMOUSEUP, this._mouseUpListener.bind(this));

	if (addrInput) {
		var dragSrc = new DwtDragSource(Dwt.DND_DROP_MOVE);
		dragSrc.addDragListener(this._dragListener.bind(this));
		this.setDragSource(dragSrc);
	}

	this._evtMgr = new AjxEventMgr();
	this._selEv = new DwtSelectionEvent(true);
};

ZmAddressBubble.prototype = new DwtControl;
ZmAddressBubble.prototype.constructor = ZmAddressBubble;

ZmAddressBubble.prototype.isZmAddressBubble = true;
ZmAddressBubble.prototype.toString = function() { return "ZmAddressBubble"; };
ZmAddressBubble.prototype.isFocusable = true;

ZmAddressBubble.prototype._createElement =
function() {
	return document.createElement("SPAN");
};

ZmAddressBubble.prototype._createHtml =
function(params) {

	var el = this.getHtmlElement();
	el.innerHTML = ZmAddressBubble.getContent(params);
	if (params.parentId) {
		el._aifId = params.parentId;
	}
};

/**
 * Returns HTML for the content of a bubble.
 *
 * @param {hash}				params		the hash of parameters:
 * @param {ZmAddressInputField}	parent		parent control
 * @param {string}				id			element ID for the bubble
 * @param {string}				className	CSS class for the bubble
 * @param {string}				address		email address to display in the bubble
 * @param {AjxEmailAddress}		addrObj		email address (alternative form)
 * @param {boolean}				canRemove	if true, an x will be provided to remove the address bubble
 * @param {boolean}				canExpand	if true, a + will be provided to expand the DL address
 * @param {boolean}				noParse		if true, do not parse content to see if it is an address
 */
ZmAddressBubble.getContent =
function(params) {

	var id = params.id;
	var addrObj = params.addrObj || (!params.noParse && AjxEmailAddress.parse(params.address)) || params.address || ZmMsg.unknown;
	var fullAddress = AjxStringUtil.htmlEncode(addrObj ? addrObj.toString() : params.address);
	var text = AjxStringUtil.htmlEncode(addrObj ? addrObj.toString(appCtxt.get(ZmSetting.SHORT_ADDRESS)) : params.address);

	var expandLinkText = "", removeLinkText = "", addrStyle = "";
	var style = "cursor:pointer;position:absolute;top:2px;";

	if (params.canExpand) {
		var addr = params.email || params.address;
		var expandLinkId = id + "_expand";
		var expandLink = 'ZmAddressBubble.expandBubble("' + id + '","' + addr + '");';
		var expStyle = style + "left:2px;";
		var expandLinkText = AjxImg.getImageHtml("BubbleExpand", expStyle, "id='" + expandLinkId + "' onclick='" + expandLink + "'");
		addrStyle += "padding-left:12px;";
	}

	if (params.canRemove) {
		var removeLinkId = id + "_remove";
		var removeLink = 'ZmAddressInputField.removeBubble("' + id + '");';
		var removeStyle = style + "right:2px;";
		var removeLinkText = AjxImg.getImageHtml("BubbleDelete", removeStyle, "id='" + removeLinkId + "' onclick='" + removeLink + "'");
		addrStyle += "padding-right:12px;";
	}
	
	var html = [], idx = 0;
	var addrStyleText = (params.canExpand || params.canRemove) ? " style='" + addrStyle + "'" : "";
	html[idx++] = "<span" + addrStyleText + ">" + text + " </span>";
	var addrText = html.join("");

	return expandLinkText + addrText + removeLinkText;
};


/**
 * Gets the key map name.
 * 
 * @return	{string}	the key map name
 */
ZmAddressBubble.prototype.getKeyMapName =
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
ZmAddressBubble.prototype.handleKeyAction = function(actionCode, ev) {

    if (!this.list || (this.addrInput && this.addrInput._editMode)) {
        return true;
    }

	switch (actionCode) {
		case DwtKeyMap.SELECT:
		case DwtKeyMap.SUBMENU:
			this.list._itemActioned(ev, this);
			break;
	}

	return true;
};

/**
 * Adds a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubble.prototype.addSelectionListener =
function(listener) {
	this._evtMgr.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubble.prototype.removeSelectionListener =
function(listener) {
	this._evtMgr.removeListener(DwtEvent.SELECTION, listener);
};

ZmAddressBubble.prototype._clickListener =
function(ev) {
	if (this.list && this._dragging == DwtControl._NO_DRAG) {
		this.list._itemClicked(ev, this);
	}
	else if (this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
		DwtUiEvent.copy(this._selEv, ev);
		this._selEv.item = this;
		this._selEv.detail = DwtEvent.ONCLICK;
		this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);
	}
};

ZmAddressBubble.prototype._dblClickListener =
function(ev) {
	if (!this.list) { return; }
	this.list._itemDoubleClicked(ev, this);
};

ZmAddressBubble.prototype._mouseUpListener =
function(ev) {
	if (!this.list) { return; }
	if (ev.button == DwtMouseEvent.RIGHT) {
		this.list._itemActioned(ev, this);
	}
};

ZmAddressBubble.prototype._getDragProxy =
function(dragOp) {

	var icon = document.createElement("div");
	icon.className = this._className;
	Dwt.setPosition(icon, Dwt.ABSOLUTE_STYLE);
	var count = this.addrInput.getSelectionCount(this);
	var content;
	if (count == 1) {
		var addrObj = AjxEmailAddress.parse(this.address) || this.address || ZmMsg.unknown;
		content = AjxStringUtil.htmlEncode(addrObj ? addrObj.toString(appCtxt.get(ZmSetting.SHORT_ADDRESS)) : this.address);
	}
	else {
		content = AjxMessageFormat.format(ZmMsg.numAddresses, count);
	}
	icon.innerHTML = content;
	this.shell.getHtmlElement().appendChild(icon);
	Dwt.setZIndex(icon, Dwt.Z_DND);
	return icon;
};

ZmAddressBubble.prototype._dragListener =
function(ev) {
	if (ev.action == DwtDragEvent.SET_DATA) {
		ev.srcData = {selection: this.addrInput.getSelection(this),
					  addrInput: this.addrInput};
	}
};

ZmAddressBubble.prototype._dragOver =
function(ev) {
	this.addrInput._dragOver(ev);
};

/**
 * Gets the tool tip content.
 * 
 * @param	{Object}	ev		the hover event
 * @return	{String}	the tool tip content
 */
ZmAddressBubble.prototype.getToolTipContent =
function(ev) {

	var ttParams = {address:this.addrObj, ev:ev};
	var ttCallback = new AjxCallback(this,
		function(callback) {
			appCtxt.getToolTipMgr().getToolTip(ZmToolTipMgr.PERSON, ttParams, callback);
		});
	return {callback:ttCallback};
};

// Bug 78359 - hack so that shortcuts work even though browser focus is on hidden textarea
ZmAddressBubble.prototype.hasFocus =
function() {
	return true;
};

/**
 * Expands the distribution list address of the bubble with the given ID.
 *
 * @param {string}	bubbleId	ID of bubble
 * @param {string}	email		address to expand
 */
ZmAddressBubble.expandBubble = function(bubbleId, email) {

	var bubble = document.getElementById(bubbleId);
	if (bubble) {
		var parentId = bubble._aifId || ZmAddressInputField.BUBBLE_OBJ_ID[bubbleId];
		var parent = bubble && DwtControl.ALL_BY_ID[parentId];
		if (parent && parent.getEnabled() && parent._aclv) {
			var bubbleObj = DwtControl.fromElementId(bubbleId);
			if (bubbleObj) {
				var loc = bubbleObj.getLocation();
				loc.y += bubbleObj.getSize().y + 2;
				parent._aclv.expandDL({
					email:      email,
					textId:     bubbleObj._htmlElId,
					loc:        loc,
					element:    parent._input
				});
			}
		}
	}
};



/**
 * Creates an empty bubble list.
 * @constructor
 * @class
 * This class manages selection events (click, double-click, and right-click) of a collection of bubbles, since
 * those events are typically meaningful within a group of bubbles. It maintains the visual state of the bubble
 * and notifies any listeners of the selection events. 
 * 
 * @param {hash}				params			hash of params:
 * @param {ZmAddressInputField}	parent			parent
 * @param {string}				normalClass		class for an unselected bubble
 * @param {string}				selClass		class for a selected bubble
 * @param {string}				rightSelClass	class for a right-clicked bubble
 */
ZmAddressBubbleList = function(params) {
	
	params = params || {};
	this.parent = params.parent;
	this._separator = params.separator || AjxEmailAddress.SEPARATOR;
	
	this._normalClass = params.normalClass || "addrBubble";
	this._selClass = params.selClass || this._normalClass + "-" + DwtCssStyle.SELECTED;
	this._actionClass = params.rightSelClass || this._normalClass + "-" + DwtCssStyle.ACTIONED;

	this._evtMgr = new AjxEventMgr();
	this._selEv = new DwtSelectionEvent(true);
	this._actionEv = new DwtListViewActionEvent(true);

	this.reset();
};

ZmAddressBubbleList.prototype.isZmAddressBubbleList = true;
ZmAddressBubbleList.prototype.toString = function() { return "ZmAddressBubbleList"; };

ZmAddressBubbleList.prototype.set =
function(list) {
	
	this._bubbleList = [];
	var selected = {};
	this._numSelected = 0;
	for (var i = 0; i < list.length; i++) {
		var bubble = list[i];
		this._bubbleList.push(bubble);
		if (this._selected[bubble.id]) {
			selected[bubble.id] = true;
			DBG.println("aif", "ZmAddressBubbleList::set - bubble selected: " + bubble.address);
			this._numSelected++;
		}
	}
	this._selected = selected; 
};

ZmAddressBubbleList.prototype.getArray =
function(list) {
	return this._bubbleList;
};

ZmAddressBubbleList.prototype.add =
function(bubble, index) {
	AjxUtil.arrayAdd(this._bubbleList, bubble, index);
	bubble.list = this;
};

ZmAddressBubbleList.prototype.remove =
function(bubble) {
	AjxUtil.arrayRemove(this._bubbleList, bubble);
	bubble.list = null;
	if (this._selected[bubble.id]) {
		this._numSelected--;
		this._selected[bubble.id] = false;
		this._checkSelection();
	}
	if (bubble == this._rightSelBubble) {
		this._rightSelBubble = null;
	}
	bubble.dispose();
};

ZmAddressBubbleList.prototype.clear = function() {
	while (this._bubbleList.length > 0) {
		this.remove(this._bubbleList[this._bubbleList.length - 1]);
	}
};

ZmAddressBubbleList.prototype.getBubble =
function(index) {
	index = index || 0;
	return this._bubbleList[index];
};

/**
 * Adds a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubbleList.prototype.addSelectionListener =
function(listener) {
	this._evtMgr.addListener(DwtEvent.SELECTION, listener);
};

/**
 * Removes a selection listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubbleList.prototype.removeSelectionListener =
function(listener) {
	this._evtMgr.removeListener(DwtEvent.SELECTION, listener);
};

/**
 * Adds an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubbleList.prototype.addActionListener =
function(listener) {
	this._evtMgr.addListener(DwtEvent.ACTION, listener);
};

/**
 * Removes an action listener.
 * 
 * @param	{AjxListener}	listener		the listener
 */
ZmAddressBubbleList.prototype.removeActionListener =
function(listener) {
	this._evtMgr.removeListener(DwtEvent.ACTION, listener);
};

ZmAddressBubbleList.prototype._itemClicked =
function(ev, bubble) {

	if (ev.shiftKey) {
		if (this._lastSelectedId) {
			var select = false;
			for (var i = 0, len = this._bubbleList.length; i < len; i++) {
				var b = this._bubbleList[i];
				if (b == bubble || b.id == this._lastSelectedId) {
					if (select) {
						this.setSelected(b, true);
						select = false;
						continue;
					}
					select = !select;
				}
				this.setSelected(b, select);
			}
		}
	}
	else if (ev.ctrlKey || ev.metaKey) {
		this.setSelected(bubble, !this._selected[bubble.id]);
		if (this._selected[bubble.id]) {
			this._lastSelectedId = bubble.id;
		}
	}
	else {
		var wasOnlyOneSelected = ((this.getSelectionCount() == 1) && this._selected[bubble.id]);
		this.deselectAll();
		this.setSelected(bubble, !wasOnlyOneSelected);
		this._lastSelectedId = wasOnlyOneSelected ? null : bubble.id;
	}

	if (this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
		DwtUiEvent.copy(this._selEv, ev);
		this._selEv.item = bubble;
		this._selEv.detail = DwtEvent.ONCLICK;
		this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);
	}
};

ZmAddressBubbleList.prototype._itemDoubleClicked =
function(ev, bubble) {

	if (this._evtMgr.isListenerRegistered(DwtEvent.SELECTION)) {
		DwtUiEvent.copy(this._selEv, ev);
		this._selEv.item = bubble;
		this._selEv.detail = DwtEvent.ONDBLCLICK;
		this._evtMgr.notifyListeners(DwtEvent.SELECTION, this._selEv);
	}
};

ZmAddressBubbleList.prototype._itemActioned =
function(ev, bubble) {

	this._rightSelBubble = bubble;
	bubble.setClassName(this._actionClass);
	if (this._evtMgr.isListenerRegistered(DwtEvent.ACTION)) {
		DwtUiEvent.copy(this._actionEv, ev);
		this._actionEv.item = bubble;
		this._evtMgr.notifyListeners(DwtEvent.ACTION, this._actionEv);
	}
};

/**
 * Sets selection of the given bubble.
 *
 * @param {ZmAddressBubble}	bubble		bubble to select
 * @param {boolean} 		selected	if true, select the bubble, otherwise deselect it
 */
ZmAddressBubbleList.prototype.setSelected =
function(bubble, selected) {

	if (!bubble) { return; }
	if (selected == Boolean(this._selected[bubble.id])) { return; }

	this._selected[bubble.id] = selected;
	bubble.setClassName(selected ? this._selClass : this._normalClass);

	this._numSelected = selected ? this._numSelected + 1 : this._numSelected - 1;
	DBG.println("aif", "**** selected: " + selected + ", " + bubble.email + ", num = " + this._numSelected);
	this._checkSelection();	
};

ZmAddressBubbleList.prototype.isSelected =
function(bubble) {
	return Boolean(bubble && this._selected[bubble.id]);
};

/**
 * Returns a list of the currently selected bubbles. If a bubble has been selected via right-click,
 * but is not part of the current left-click selection, only it will be returned.
 *
 * @param {ZmAddressBubble}	bubble	reference bubble
 */
ZmAddressBubbleList.prototype.getSelection =
function(bubble) {

	var ref = bubble || this._rightSelBubble;
	var refIncluded = false;
	var sel = [];
	for (var i = 0; i < this._bubbleList.length; i++) {
		var bubble = this._bubbleList[i];
		if (this._selected[bubble.id]) {
			sel.push(bubble);
			if (bubble == ref) {
				refIncluded = true;
			}
		}
	}
	sel = (ref && !refIncluded) ? [ref] : sel;
	DBG.println("aif", "getSelection, sel length: " + sel.length);

	return sel;
};

ZmAddressBubbleList.prototype.getSelectionCount =
function(bubble) {
	return bubble ? this.getSelection(bubble).length : this._numSelected;
};

ZmAddressBubbleList.prototype.deselectAll =
function() {
	DBG.println("aif", "deselectAll");
	var sel = this.getSelection();
	for (var i = 0, len = sel.length; i < len; i++) {
		this.setSelected(sel[i], false);
	}
	this._selected = {};
	this._numSelected = 0;
};

ZmAddressBubbleList.prototype.clearRightSelection =
function() {
	this._rightSelBubble = null;
};

ZmAddressBubbleList.prototype.reset =
function(list) {
	this._bubbleList = [];
	this._selected = {};
	this._numSelected = 0;
};

ZmAddressBubbleList.prototype.size =
function() {
	return this._bubbleList.length;
};

ZmAddressBubbleList.prototype.selectAddressText =
function() {
	
	var sel = this.getSelection();
	var addrs = [];
	for (var i = 0; i < sel.length; i++) {
		addrs.push(sel[i].address);
	}
	var textarea = this._getTextarea();
	textarea.value = addrs.join(this._separator) + this._separator;
	textarea.focus();
	textarea.select();
};

ZmAddressBubbleList.prototype._getTextarea =
function() {
	// hidden textarea used for copying address text
	if (!ZmAddressBubbleList._textarea) {
		var el = ZmAddressBubbleList._textarea = document.createElement("textarea");
		el.id = "abcb";	// address bubble clipboard
		el["data-hidden"] = "1";
		appCtxt.getShell().getHtmlElement().appendChild(el);
		Dwt.setPosition(el, Dwt.ABSOLUTE_STYLE);
		Dwt.setLocation(el, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	}
	return ZmAddressBubbleList._textarea;
};

ZmAddressBubbleList.prototype._checkSelection =
function() {

	// don't mess with outside listening if we're selecting via rubber-banding
	if (this.parent && (this.parent._noOutsideListening || this.parent._dragging == DwtControl._DRAGGING)) { return; }

	if (!this._listening && this._numSelected == 1) {
		var omem = appCtxt.getOutsideMouseEventMgr();
		var omemParams = {
			id:					"ZmAddressBubbleList",
			elementId:			null,	// all clicks call our listener
			outsideListener:	this._outsideMouseListener.bind(this),
			noWindowBlur:		appCtxt.get(ZmSetting.IS_DEV_SERVER)
		}
		DBG.println("aif", "START outside listening for bubbles");
		omem.startListening(omemParams);
		this._listening = true;
	}
	else if (this._listening && this._numSelected == 0) {
		var omem = appCtxt.getOutsideMouseEventMgr();
		DBG.println("aif", "STOP outside listening for bubbles");
		var omemParams = {
			id:			"ZmAddressBubbleList",
			elementId:	null
		}		
		omem.stopListening(omemParams);
		this._listening = false;
	}
	this.selectAddressText();
};

ZmAddressBubbleList.prototype._outsideMouseListener =
function(ev, context) {

	// modified clicks control list selection, ignore them
	if (!ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
		this.deselectAll();
	}
};
}

if (AjxPackage.define("zimbraMail.share.view.ZmColorMenu")) {
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
 * @param {hash} params Constructor parameters.
 * @param {DwtComposite} params.parent Parent control.
 * @param {string} params.image Item image to display next to each color choice.
 * @param {boolean} params.hideNone True to hide the "None" option.
 * @param {boolean} params.hideNoFill True to hide the no-fill/use-default option.
 */
ZmColorMenu = function(params) {
    if (arguments.length == 0) return;
    params.className = params.className || "ZmColorMenu DwtMenu";
    DwtMenu.call(this, params);
    this._hideNone = params.hideNone;
    this._hideNoFill = params.hideNoFill;
    this.setImage(params.image);
    this._populateMenu();
};
ZmColorMenu.prototype = new DwtMenu;
ZmColorMenu.prototype.constructor = ZmColorMenu;

ZmColorMenu.prototype.toString = function() {
    return "ZmColorMenu";
};

//
// Constants
//

ZmColorMenu.__KEY_COLOR = "color";

//
// Public methods
//

ZmColorMenu.prototype.setImage = function(image) {
    if (this._image != image) {
        this._image = image;
        var children = this.getChildren();
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var color = child.getData(ZmColorMenu.__KEY_COLOR);
			var displayColor = color || ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR]; //default to gray
            var icon = [image, displayColor].join(",color=");
            child.setImage(icon);
        }
    }
};
ZmColorMenu.prototype.getImage = function() {
    return this._image;
};

ZmColorMenu.prototype.getTextForColor = function(color) {
    color = String(color).toLowerCase();
    if (!color.match(/^#/)) color = ZmOrganizer.COLOR_VALUES[color];
    var children = this.getChildren();
    for (var i = 0; i < children.length; i++) {
        var mi = children[i];
        if (mi.getData(ZmColorMenu.__KEY_COLOR) == color) {
            return mi.getText();
        }
    }
    return ZmMsg.custom;
};

ZmColorMenu.prototype.showMoreColors = function() {
    if (this.parent && this.parent.getMenu() == this) {
        var menu = this.parent.getMenu();
        var moreMenu = this._getMoreColorMenu();
        this.parent.setMenu(moreMenu);
        if (menu.isPoppedUp()) {
            var loc = menu.getLocation();
            menu.popdown();
            moreMenu.popup(0, loc.x, loc.y);
        }
        else {
            this.parent.popup();
        }
    }
};

ZmColorMenu.prototype.showLessColors = function() {
    if (this.parent && this.parent.getMenu() != this) {
        var menu = this.parent.getMenu();
        this.parent.setMenu(this);
        if (menu.isPoppedUp()) {
            var loc = menu.getLocation();
            menu.popdown();
            this.popup(0, loc.x, loc.y);
        }
        else {
            this.parent.popup();
        }
    }
};

//
// DwtMenu methods
//

ZmColorMenu.prototype.addSelectionListener = function(listener) {
    DwtMenu.prototype.addSelectionListener.apply(this, arguments);
    this._getMoreColorMenu().addSelectionListener(listener);
};
ZmColorMenu.prototype.removeSelectionListener = function(listener) {
    DwtMenu.prototype.removeSelectionListener.apply(this, arguments);
    this._getMoreColorMenu().removeSelectionListener(listener);
};

//
// Protected methods
//

ZmColorMenu.prototype._populateMenu = function() {
    var list = ZmOrganizer.COLOR_VALUES;
    for (var id = 0; id < list.length; id++) {
        var color = ZmOrganizer.COLOR_VALUES[id];
        if (!color && this._hideNone) continue;
		var displayColor = color || ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR]; //default to gray
        var image = this._image ? [this._image, displayColor].join(",color=") : null;
        var text = ZmOrganizer.COLOR_TEXT[id];
        var menuItemId = "COLOR_" + id;
        var menuItem = new DwtMenuItem({parent:this, id:menuItemId});
        menuItem.setImage(image);
        menuItem.setText(text);
        menuItem.setData(ZmOperation.MENUITEM_ID, id);
        menuItem.setData(ZmColorMenu.__KEY_COLOR, color);
    }
    var callback = new AjxCallback(this, this.showMoreColors); 
    var showMoreItem = new ZmColorMenuItem({parent:this,callback:callback, id:"SHOW_MORE_ITEMS"});
    showMoreItem.setText(ZmMsg.colorsShowMore);
};

ZmColorMenu.prototype._getMoreColorMenu = function() {
    if (!this._moreMenu) {
        var callback = new AjxCallback(this, this.showLessColors);
        this._moreMenu = new ZmMoreColorMenu({parent:this.parent,callback:callback,hideNoFill:this._hideNoFill});
    }
    return this._moreMenu;
};

//
// Classes
//

ZmMoreColorMenu = function(params) {
    params.style = DwtMenu.COLOR_PICKER_STYLE;
    DwtMenu.call(this, params);
    this._colorPicker = new DwtColorPicker({parent:this,hideNoFill:params.hideNoFill});
    this._colorPicker.getData = this.__DwtColorPicker_getData; // HACK
    var showLessItem = new ZmColorMenuItem({parent:this,callback:params.callback});
    showLessItem.setText(ZmMsg.colorsShowLess);
};
ZmMoreColorMenu.prototype = new DwtMenu;
ZmMoreColorMenu.prototype.constructor = ZmMoreColorMenu;

ZmMoreColorMenu.prototype.toString = function() {
    return "ZmMoreColorMenu";
};

/**
 * <strong>Note:</strong>
 * This method is run in the context of the color picker!
 *
 * @private
 */
ZmMoreColorMenu.prototype.__DwtColorPicker_getData = function(key) {
    // HACK: This is to fake the color picker as a menu item whose
    // HACK: id is the selected color.
    if (key == ZmOperation.MENUITEM_ID) {
        return this.getInputColor();
    }
    return DwtColorPicker.prototype.getData.apply(this, arguments);
};

ZmMoreColorMenu.prototype.setDefaultColor = function(color) {
    this._colorPicker.setDefaultColor(color);
}

/**
 * A custom menu item class for the "More colors..." and
 * "Fewer colors..." options which should not leave space for
 * an image next to the text. A sub-class is also needed so
 * that we can avoid the default handling of the item click.
 *
 * @param params
 */
ZmColorMenuItem = function(params) {
    DwtMenuItem.call(this, params);
    this.callback = params.callback;
    // HACK: This is needed because we no-op the add/removeSelectionListener
    // HACK: methods so that external people can't register listeners but we
    // HACK: still want to handle a true selection to call the callback.
    DwtMenuItem.prototype.addSelectionListener.call(this, new AjxListener(this, this.__handleItemSelect));
};
ZmColorMenuItem.prototype = new DwtMenuItem;
ZmColorMenuItem.prototype.constructor = ZmColorMenuItem;

ZmColorMenuItem.prototype.toString = function() {
    return "ZmColorMenuItem";
};

ZmColorMenuItem.prototype.TEMPLATE = "zimbra.Widgets#ZmColorMenuItem";

// DwtMenuItem methods

ZmColorMenuItem.prototype.addSelectionListener = function() {}; // no-op
ZmColorMenuItem.prototype.removeSelectionListener = function() {}; // no-op

ZmColorMenuItem.prototype.__handleItemSelect = function() {
    if (this.callback) {
        this.callback.run();
    }
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmColorButton")) {
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

ZmColorButton = function(params) {

    if (arguments.length == 0) {
	    return;
    }

    DwtButton.call(this, params);
    var menu = new ZmColorMenu({parent:this,hideNone:params.hideNone});
    menu.addSelectionListener(new AjxListener(this, this._handleSelection));
    this.setMenu(menu);
    this._colorMenu = menu;
	this._labelId = params.labelId;
};

ZmColorButton.prototype = new DwtButton;
ZmColorButton.prototype.constructor = ZmColorButton;

ZmColorButton.prototype.isZmColorButton = true;
ZmColorButton.prototype.toString = function() { return "ZmColorButton"; };

//
// Public methods
//

ZmColorButton.prototype.setImage = function(image, skipMenu) {
    DwtButton.prototype.setImage.apply(this, arguments);
    if (!skipMenu) {
        this._colorMenu.setImage(image);
    }
};

ZmColorButton.prototype.setValue = function(color) {

	var standardColorCode = ZmOrganizer.getStandardColorNumber(color),
		colorMenuItemId;

	if (standardColorCode !== -1) {
		this._color = standardColorCode;
		colorMenuItemId = 'COLOR_' + standardColorCode;
	}
	else {
        this._color = color;
	}
    var image = this.getImage();
    if (image) {
        image = image.replace(/,.*$/, "");
		var displayColor = this._color || ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR]; //default to gray
        this.setImage([image, this._color].join(",color="), true);
    }
    this.setText(this._colorMenu.getTextForColor(this._color));

	if (colorMenuItemId) {
		this.removeAttribute('aria-label');
		this.setAttribute('aria-labelledby', [ this._labelId, colorMenuItemId ].join(' '));
	}
};


ZmColorButton.prototype.getValue = function() {
    return this._color;
};

//
// Protected methods
//

ZmColorButton.prototype._handleSelection = function(evt) {
    this.setValue(evt.item.getData(ZmOperation.MENUITEM_ID)); 
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmFolderChooser")) {
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
 * @class
 * This is a folder choosing widget designed to be displayed as a dropdown hanging off a menu. Other than
 * that, it works mostly like ZmChooseFolderDialog. Instead of a New button, it has a "New Folder" menu item
 * at the bottom. Items are moved when a menu item is clicked, instead of the OK button in the dialog.
 * 
 * The implementation mostly relies on calling ZmChooseFolderDialog and ZmDialog methods, since those were
 * already written. A cleaner implementation would probably include a base widget that this and the dialog
 * would use.
 *
 * @author Eran Yarkon
 *
 * @param {hash}		params			a hash of parameters
 * @param {DwtComposite}      params.parent			the parent widget
 * @param {string}      params.className			the CSS class
 * @param {constant}      params.posStyle			the positioning style (see {@link Dwt})
 *
 * @extends		DwtComposite
 */
ZmFolderChooser = function(params) {
	if (arguments.length == 0) { return; }
	params.className = params.className || "ZmFolderChooser";
	DwtComposite.call(this, params);

	this._overview = {};
	this._opc = appCtxt.getOverviewController();
	this._treeView = {};
	this._folderTreeDivId = this._htmlElId + "_folderTreeDivId";

	this._uuid = Dwt.getNextId();

	AjxDispatcher.require("Extras");	// ZmChooseFolderDialog
	this._changeListener = ZmChooseFolderDialog.prototype._folderTreeChangeListener.bind(this);
	this._treeViewListener = this._treeViewSelectionListener.bind(this);

	var moveMenu = params.parent;
	moveMenu._addItem(this, params.index); //this is what DwtMenuItem does. Allows this item to be in the menu items table - better for layout purposes such as consistent widths
	this._moveOnFolderCreate = true;
	
	if (!params.hideNewButton) {
		//add separator menu item on the move menu (the parent)
		new DwtMenuItem({parent:moveMenu, style:DwtMenuItem.SEPARATOR_STYLE});
	
		// add New button
		var newFolderItem = this._newButton = new DwtMenuItem({parent:moveMenu, id: moveMenu.getHTMLElId() + "|NEWFOLDER"});
		var appName = appCtxt.getCurrentAppName();	
		var defaultApp = ZmApp.MAIL;
		var newTextKey = ZmFolderChooser.NEW_ORG_KEY[appName] || ZmFolderChooser.NEW_ORG_KEY[defaultApp];
		var newImage = ZmFolderChooser.NEW_ORG_ICON[appName] || ZmFolderChooser.NEW_ORG_ICON[defaultApp];
		var newShortcut = ZmFolderChooser.NEW_ORG_SHORTCUT[appName];
		newFolderItem.setText(ZmMsg[newTextKey]);
		newFolderItem.setImage(newImage);
		if (newShortcut) {
			newFolderItem.setShortcut(appCtxt.getShortcutHint(this._keyMap, newShortcut));
		}
		newFolderItem.addSelectionListener(this._showNewDialog.bind(this));
	}

	this._init();
};

ZmFolderChooser.prototype = new DwtComposite;
ZmFolderChooser.prototype.constructor = ZmFolderChooser;

ZmFolderChooser.prototype.isZmFolderChooser = true;
ZmFolderChooser.prototype.toString = function() { return "ZmFolderChooser"; };


// Properties for New button at bottom
ZmFolderChooser.NEW_ORG_KEY = {};
ZmFolderChooser.NEW_ORG_KEY[ZmApp.MAIL]				= "newFolder";
ZmFolderChooser.NEW_ORG_KEY[ZmApp.CONTACTS]			= "newAddrBook";
ZmFolderChooser.NEW_ORG_KEY[ZmApp.CALENDAR]			= "newCalendar";
ZmFolderChooser.NEW_ORG_KEY[ZmApp.TASKS]			= "newTaskFolder";

ZmFolderChooser.NEW_ORG_ICON = {};
ZmFolderChooser.NEW_ORG_ICON[ZmApp.MAIL]			= "NewFolder";
ZmFolderChooser.NEW_ORG_ICON[ZmApp.CONTACTS]		= "NewContactsFolder";
ZmFolderChooser.NEW_ORG_ICON[ZmApp.CALENDAR]		= "NewAppointment";
ZmFolderChooser.NEW_ORG_ICON[ZmApp.TASKS]			= "NewTaskList";

ZmFolderChooser.NEW_ORG_SHORTCUT = {};
ZmFolderChooser.NEW_ORG_SHORTCUT[ZmApp.MAIL]		= ZmKeyMap.NEW_FOLDER;
ZmFolderChooser.NEW_ORG_SHORTCUT[ZmApp.CALENDAR]	= ZmKeyMap.NEW_CALENDAR;

/**
 *
 * see ZmChooseFolderDialog.prototype.popup
 */
ZmFolderChooser.prototype.setupFolderChooser =
function(params, selectionCallback) {

	this._selectionCallback = selectionCallback;
	this._overviewId = params.overviewId;

	ZmChooseFolderDialog.prototype.popup.call(this, params, true);
};

ZmFolderChooser.prototype._getNewButton =
function () {
	return this._newButton;
};

ZmFolderChooser.prototype.updateData =
function(data) {
	this._data = data;
};

ZmFolderChooser.prototype._focus =
function() {
	var overview = this._overview[this._overviewId];
	if (overview) {
		overview.focus();
	}
};

/**
 * this is not really doing the popup, just setting more stuff up, but to reuse the caller (ZmChooseFolderDialog.prototype.popup)
 * from ZmChooseFolderDialog, I had to keep the name.
 *
 * @param params
 */
ZmFolderChooser.prototype._doPopup =
function(params) {
	ZmChooseFolderDialog.prototype._doPopup.call(this, params, true);
};


/**
 * this reuses ZmDialog stuff. With slight necessary changes. Might be fragile if this is changed in ZmDialog
 * in which case we might be better off with copy-paste. but for now it works.
 * 
 * @param params
 * @param forceSingle
 */
ZmFolderChooser.prototype._setOverview =
function(params, forceSingle) {
	params.overviewClass = "menuOverview";
	params.dynamicWidth = true;

	var overview = ZmDialog.prototype._setOverview.call(this, params, forceSingle); //reuse from ZmDialog

	if (!appCtxt.multiAccounts || forceSingle) {
		//this  is needed for some reason
		this._overview[params.overviewId] = overview;
	}

	return overview;
};

/**
 * delegate to ZmDialog. called from ZmDialog.prototype._setOverview (which we delegate to from ZmFolderChooser.prototype._setOverview)
 */
ZmFolderChooser.prototype._renderOverview =
function() {
	ZmDialog.prototype._renderOverview.apply(this, arguments); //reuse code from ZmDialog
};

/**
 * delegate to ZmDialog.
 */
ZmFolderChooser.prototype._setRootSelection =
function() {
	ZmDialog.prototype._setRootSelection.apply(this, arguments); //reuse code from ZmDialog
};


/**
 * delegate to ZmDialog. called from ZmDialog.prototype._setOverview (which we delegate to from ZmFolderChooser.prototype._setOverview)
 */
ZmFolderChooser.prototype._makeOverviewVisible =
function() {
	ZmDialog.prototype._makeOverviewVisible.apply(this, arguments); //reuse code from ZmDialog
};

ZmFolderChooser.prototype._resetTree =
function(treeIds, overview) {
	ZmChooseFolderDialog.prototype._resetTree.call(this, treeIds, overview);
};

ZmFolderChooser.prototype._getOverview =
function() {
	return ZmChooseFolderDialog.prototype._getOverview.call(this)
};

ZmFolderChooser.prototype._treeViewSelectionListener =
function(ev) {
	if (ev.detail != DwtTree.ITEM_SELECTED) {
		return;
	}
	//set in DwtTree.prototype._itemClicked and DwtTree.prototype.setSelection (which is called by DwtTreeItem.prototype.handleKeyAction)
	if (!ev.clicked && !ev.enter) {
		return;
	}

	//I kept this logic from ZmChooseFolderDialog.prototype._treeViewSelectionListener. Not sure what it means exactly
	if (this._getOverview() instanceof ZmAccountOverviewContainer) {
		if (ev.item instanceof DwtHeaderTreeItem) {
			return;
		}

		var oc = this._opc.getOverviewContainer(this._curOverviewId);
		var overview = oc.getOverview(ev.item.getData(ZmTreeView.KEY_ID));
		oc.deselectAll(overview);
	}

	var organizer = ev.item && ev.item.getData(Dwt.KEY_OBJECT);
	if (organizer.id == ZmFolder.ID_LOAD_FOLDERS) {
		return; // user clicked on "Show More Folders", it's not a real selection, it just expanded more folders.
	}
	var value = organizer ? organizer.getName(null, null, true) : ev.item.getText();
	this._lastVal = value.toLowerCase();
	this._doSelection();
};

/**
 * copied mostly from ZmChooseFolderDialog.prototype._okButtonListener  
 * @param tgtFolder
 */
ZmFolderChooser.prototype._doSelection =
function(tgtFolder) {
    tgtFolder = tgtFolder || this._getOverview().getSelected();
    if  (!tgtFolder) {
        tgtFolder = appCtxt.getById(this._selected);
    }
	var folderList = (tgtFolder && (!(tgtFolder instanceof Array)))
		? [tgtFolder] : tgtFolder;

	var msg = (!folderList || (folderList && folderList.length == 0))
		? ZmMsg.noTargetFolder : null;

	//todo - what is that? can you move stuff to multiple targets?  annotation on ZmChooseFolderDialog show it might be for filters on multiple folders. obviously in that case we can't have a drop down. we might have to keep that folder dialog
	
	// check for valid target
	if (!msg && this._data) {
		for (var i = 0; i < folderList.length; i++) {
			var folder = folderList[i];
			if (folder.mayContain && !folder.mayContain(this._data, null, this._acceptFolderMatch)) {
				if (this._data instanceof ZmFolder) {
					msg = ZmMsg.badTargetFolder;
				}
				else {
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
						}
						else if ((folder.nId == ZmFolder.ID_DRAFTS || folder.rid == ZmFolder.ID_DRAFTS) && !item.isDraft)	{
							// only drafts can be moved into Drafts
							msg = ZmMsg.badItemForDraftsFolder;
							break;
						}
					}
					if (!msg) {
						msg = ZmMsg.badTargetFolderItems;
					}
				}
				break;
			}
		}
	}

	if (msg) {
		ZmDialog.prototype._showError.call(this, msg);
		return;
	}
	if (this._selectionCallback) {
		this._selectionCallback(tgtFolder);
	}
};

ZmFolderChooser.prototype._resetTreeView =
function(visible) {
	ZmChooseFolderDialog.prototype._resetTreeView.call(this, visible);
};

ZmFolderChooser.prototype.getOverviewId =
function(part) {
	return appCtxt.getOverviewId([this.toString(), part], null);
};

ZmFolderChooser.prototype._loadFolders =
function() {
	ZmChooseFolderDialog.prototype._loadFolders.call(this);
};

ZmFolderChooser.prototype._init =
function() {

	var html = [], idx = 0;

	html[idx++] =	"<table role='presentation' cellspacing='0' cellpadding='0' style='border-collapse:collapse;'>";
	html[idx++] =		"<tr><td><div id='" + this._folderTreeDivId + "'>";
	html[idx++] =		"</div></td></tr>";
	html[idx++] =	"</table>";

	this.getHtmlElement().innerHTML = html.join("");
};

ZmFolderChooser.prototype._showNewDialog =
function() {
	var item = this._getOverview().getSelected(true);
	var newType = (item && item.type) || this._treeIds[0];
	var ftc = this._opc.getTreeController(newType);
	var dialog = ftc._getNewDialog();
	dialog.reset();
	dialog.registerCallback(DwtDialog.OK_BUTTON, ZmChooseFolderDialog.prototype._newCallback, this, [ftc, dialog]);
	this.parent.popdown(); //pop it down so it doenst pop down when user clicks on the "new" dialog, confusing them. this is also consistent with the tag menu "new".
	dialog.popup();
};
}

if (AjxPackage.define("zimbraMail.share.view.htmlEditor.ZmHtmlEditor")) {
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
 * HTML editor which wraps TinyMCE
 *
 * @param {Hash}		params				a hash of parameters:
 * @param {constant}	posStyle				new message, reply, forward, or an invite action
 * @param {Object}		content
 * @param {constant}	mode
 * @param {Boolean}		withAce
 * @param {Boolean}		parentElement
 * @param {String}		textAreaId
 * @param {Function}	attachmentCallback		callback to create image attachment
 * @param {Function}	pasteCallback			callback invoked when data is pasted and uploaded to the server
 * @param {Function}	initCallback			callback invoked when the editor is fully initialized
 *
 * @author Satish S
 * @private
 */
ZmHtmlEditor = function() {
	if (arguments.length == 0) { return; }

	var params = Dwt.getParams(arguments, ZmHtmlEditor.PARAMS);

	if (!params.className) {
		params.className = 'ZmHtmlEditor';
	}

	if (!params.id) {
		params.id = Dwt.getNextId('ZmHtmlEditor');
	}

    DwtControl.call(this, params);

	this.isTinyMCE = window.isTinyMCE;
	this._mode = params.mode;
	this._hasFocus = {};
	this._bodyTextAreaId = params.textAreaId || this.getHTMLElId() + '_body';
	this._iFrameId = this._bodyTextAreaId + "_ifr";
	this._initCallbacks = [];
	this._attachmentCallback = params.attachmentCallback;
	this._pasteCallback = params.pasteCallback;
	this._onContentInitializeCallbacks = []
	this.initTinyMCEEditor(params);
    this._ignoreWords = {};
	this._classCount = 0;

    if (params.initCallback)
        this._initCallbacks.push(params.initCallback);

    var settings = appCtxt.getSettings();
    var listener = new AjxListener(this, this._settingChangeListener);
    settings.getSetting(ZmSetting.COMPOSE_INIT_FONT_COLOR).addChangeListener(listener);
    settings.getSetting(ZmSetting.COMPOSE_INIT_FONT_FAMILY).addChangeListener(listener);
    settings.getSetting(ZmSetting.COMPOSE_INIT_FONT_SIZE).addChangeListener(listener);
    settings.getSetting(ZmSetting.COMPOSE_INIT_DIRECTION).addChangeListener(listener);
    settings.getSetting(ZmSetting.SHOW_COMPOSE_DIRECTION_BUTTONS).addChangeListener(listener);

	this.addControlListener(this._resetSize.bind(this));

	this.addListener(DwtEvent.ONFOCUS, this._onFocus.bind(this));
	this.addListener(DwtEvent.ONBLUR, this._onBlur.bind(this));
};

ZmHtmlEditor.PARAMS = [
	'parent',
	'posStyle',
	'content',
	'mode',
	'withAce',
	'parentElement',
	'textAreaId',
	'attachmentCallback',
	'initCallback'
];

ZmHtmlEditor.prototype = new DwtControl();
ZmHtmlEditor.prototype.constructor = ZmHtmlEditor;

ZmHtmlEditor.prototype.isZmHtmlEditor = true;
ZmHtmlEditor.prototype.isInputControl = true;
ZmHtmlEditor.prototype.toString = function() { return "ZmHtmlEditor"; };

ZmHtmlEditor.TINY_MCE_PATH = "/js/ajax/3rdparty/tinymce";

// used as a data key (mostly for menu items)
ZmHtmlEditor.VALUE = "value";

ZmHtmlEditor._INITDELAY = 50;

ZmHtmlEditor._containerDivId = "zimbraEditorContainer";

ZmHtmlEditor.prototype.getEditor =
function() {
	return  (window.tinyMCE) ? tinyMCE.get(this._bodyTextAreaId) : null;
};

ZmHtmlEditor.prototype.getBodyFieldId =
function() {
	if (this._mode == Dwt.HTML) {
		var editor = this.getEditor();
		return editor ? this._iFrameId : this._bodyTextAreaId;
	}

	return this._bodyTextAreaId;
};

ZmHtmlEditor.prototype.getBodyField =
function() {
	return document.getElementById(this.getBodyFieldId());
};

ZmHtmlEditor.prototype._resetSize =
function() {
	var field = this.getContentField();

	if (this._resetSizeAction) {
		clearTimeout(this._resetSizeAction);
		this._resetSizeAction = null;
	}

	if (field) {
		var bounds = this.boundsForChild(field);
		Dwt.setSize(field, bounds.width, bounds.height);
	}

	var editor = this.getEditor();

	if (!editor || !editor.getContentAreaContainer() || !editor.getBody()) {
		if (this.getVisible()) {
			this._resetSizeAction =
				setTimeout(ZmHtmlEditor.prototype._resetSize.bind(this), 100);
		}
		return;
	}

	var iframe = Dwt.byId(this._iFrameId);
	var bounds = this.boundsForChild(iframe);
	var x = bounds.width, y = bounds.height;

    //Subtracting editor toolbar heights
    AjxUtil.foreach(
        Dwt.byClassName('mce-toolbar-grp', editor.getContainer()),
        function(elem) {
            y -= Dwt.getSize(elem).y;
        }
    );

    // on Firefox, the toolbar is detected as unreasonably large during load;
    // so start the timer for small sizes -- even in small windows, the toolbar
    // should never be more than ~110px tall
    if (bounds.height - y > 200) {
        this._resetSizeAction =
            setTimeout(ZmHtmlEditor.prototype._resetSize.bind(this), 100);
        return;
    }

    //Subtracting spellcheckmodediv height
    var spellCheckModeDiv = this._spellCheckModeDivId && document.getElementById(this._spellCheckModeDivId);
    if (spellCheckModeDiv && spellCheckModeDiv.style.display !== "none") {
        y = y - Dwt.getSize(spellCheckModeDiv).y;
    }

	if (isNaN(x) || x < 0 || isNaN(y) || y < 0) {
		if (this.getVisible()) {
			this._resetSizeAction =
				setTimeout(ZmHtmlEditor.prototype._resetSize.bind(this), 100);
		}
		return;
	}

	Dwt.setSize(iframe, Math.max(0, x), Math.max(0, y));

	var body = editor.getBody();
	var bounds =
		Dwt.insetBounds(Dwt.insetBounds({x: 0, y: 0, width: x, height: y},
		                                Dwt.getMargins(body)),
		                Dwt.getInsets(body));

	Dwt.setSize(body, Math.max(0, bounds.width), Math.max(0, bounds.height));
};

ZmHtmlEditor.prototype.focus =
function(editor) {
    var currentObj = this,
        bodyField;

   if (currentObj._mode === Dwt.HTML) {
        editor = editor || currentObj.getEditor();
        if (currentObj._editorInitialized && editor) {
            editor.focus();
            currentObj.setFocusStatus(true);
            editor.getWin().scrollTo(0,0);
        }
    }
    else {
        bodyField = currentObj.getContentField();
        if (bodyField) {
            bodyField.focus();
            currentObj.setFocusStatus(true, true);
        }
    }
};

/**
 * @param	{Boolean}	keepModeDiv	if <code>true</code>, _spellCheckModeDiv is not removed
 */
ZmHtmlEditor.prototype.getTextVersion = function (convertor, keepModeDiv) {
    this.discardMisspelledWords(keepModeDiv);
    return this._mode === Dwt.HTML
        ? this._convertHtml2Text(convertor)
        : this.getContentField().value;
};

ZmHtmlEditor.prototype._focus = function() {
	if (this._mode === Dwt.HTML && this.getEditor()) {
		this.getEditor().focus();
	}
};

/**
 * Returns the content of the editor.
 * 
 * @param {boolean}		insertFontStyle		if true, add surrounding DIV with font settings
 * @param {boolean}		onlyInnerContent	if true, do not surround with HTML and BODY
 */
ZmHtmlEditor.prototype.getContent =
function(addDivContainer, onlyInnerContent) {

    this.discardMisspelledWords();
    
	var field = this.getContentField();

	var content = "";
	if (this._mode == Dwt.HTML) {
		var editor = this.getEditor(),
            content1 = "";
        if (editor) {
            content1 = editor.save({ format:"raw", set_dirty: false });
        }
        else {
            content1 = field.value || "";
        }
        if (content1 && (/\S+/.test(AjxStringUtil.convertHtml2Text(content1)) || content1.match(/<img/i)) ) {
			content = this._embedHtmlContent(content1, addDivContainer, onlyInnerContent, this._classCount);
		}
	}
	else {
		if (/\S+/.test(field.value)) {
			content = field.value;
		}
	}

	return content;
};

ZmHtmlEditor.prototype._embedHtmlContent =
function(html, addDivContainer, onlyInnerContent, classCount) {

	html = html || "";
	if (addDivContainer) {
		if (classCount) {
			var editor = this.getEditor();
			var document = editor.getDoc();
			var containerEl = document.getElementById(ZmHtmlEditor._containerDivId);
			if (containerEl) {
				// Leave the previous container in place and update its
				// class (used for classCount)
				containerEl.setAttribute("class", classCount.toString());
				// Set to zero, so an additional classCount is not added in the new container
				classCount = 0;
			}
		}
		html = ZmHtmlEditor._addDivContainer(html, classCount);
	}
	return onlyInnerContent ? html : [ "<html><body>", html, "</body></html>" ].join("");
};
ZmHtmlEditor._embedHtmlContent = ZmHtmlEditor.prototype._embedHtmlContent;

ZmHtmlEditor._addDivContainer =
function(html, classCount) {
	return ZmHtmlEditor._getDivContainerPrefix(classCount) + html + ZmHtmlEditor._getDivContainerSuffix();
};

ZmHtmlEditor._getDivContainerPrefix =
function(classCount) {
	var recordClassCount = !!classCount;
	var a = [], i = 0;
	a[i++] = '<div ';
	if (recordClassCount) {
		a[i++] = 'id="' + ZmHtmlEditor._containerDivId + '" ';
	}
	a[i++] = 'style="font-family: ';
	a[i++] = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_FAMILY);
	a[i++] = '; font-size: ';
	a[i++] = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_SIZE);
	a[i++] = '; color: ';
	a[i++] = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_COLOR);
	a[i++] = '"';
    if (appCtxt.get(ZmSetting.COMPOSE_INIT_DIRECTION) === ZmSetting.RTL) {
        a[i++] = ' dir="' + ZmSetting.RTL + '"';
    }
	// Cheat; Store the classCount (used for mapping excel classes to unique ids) in a class attribute.
	// Otherwise, if stored in a non-standard attribute, it gets stripped by the server defanger.
	if (recordClassCount) {
		a[i++] = ' class=' + classCount.toString() + ' '
	}
    a[i++] = ">";
	return a.join("");
};

ZmHtmlEditor._getDivContainerSuffix =
function() {
	return "</div>";
};

/*
 If editor is not initialized and mode is HTML, tinymce will automatically initialize the editor with the content in textarea
 */
ZmHtmlEditor.prototype.setContent = function (content) {
    if (this._mode === Dwt.HTML && this._editorInitialized) {
		var ed = this.getEditor();
        ed.setContent(content, {format:'raw'});
		this._setContentStyles(ed);
    } else {
        this.getContentField().value = content;
    }
    this._ignoreWords = {};
};

ZmHtmlEditor.prototype._setContentStyles = function(ed) {
    var document = ed.getDoc();

	// First, get the number of classes already added via paste; Only exists if this was retrieved from the server
	// (otherwise, use the in-memory this._classCount).  This is used to create unique class names for styles
	// imported on an Excel paste
	var containerDiv = document.getElementById(ZmHtmlEditor._containerDivId);
	if (containerDiv && containerDiv.hasAttribute("class")) {
		// Cheated - stored classCount in class, since non-standard attributes will be stripped by the
		// server html defanger.
		this._classCount = parseInt(containerDiv.getAttribute("class"));
		if (isNaN(this._classCount)) {
			this._classCount = 0;
		}
	}

	// Next, move all style nodes to be children of the body, otherwise when adding a style to the body, any subnode
	// style nodes will be deleted!
	var dom      = ed.dom;
	var body     = document.body;
	var styles   = dom.select("style", body);
	var parentNode;
	for (var i = 0; i < styles.length; i++) {
		parentNode = styles[i].parentNode;
		if (parentNode.tagName.toLowerCase() != 'body') {
			parentNode.removeChild(styles[i]);

			// while replying we were adding the incoming css styles to the first element present 
			// in the body which was <br/> tag which causes issue after performing multiple backspace
			// now we are searching for the data-marker of replying message i.e  '__QUOTED_TEXT__'
			// and inserting css div style before the '__QUOTED_TEXT__' data marker.
			for(var j=0; j < body.childElementCount; j++){
				if(body.children[j].hasAttribute('data-marker')) {
					const dataMarker = body.children[j].getAttribute('data-marker');

					if(dataMarker === '__' + ZmComposeView.BC_QUOTED_TEXT + '__'){
						body.insertBefore(styles[i], body.childNodes[j]);
						return
					}
				}
			}
		}
	}
}

ZmHtmlEditor.prototype.reEnableDesignMode =
function() {
	// tinyMCE doesn't need to handle this
};

ZmHtmlEditor.prototype.getMode =
function() {
	return this._mode;
};

ZmHtmlEditor.prototype.isHtmlModeInited =
function() {
	return Boolean(this.getEditor());
};

ZmHtmlEditor.prototype._convertHtml2Text = function (convertor) {
    var editor = this.getEditor(),
        body;
    if (editor) {
        body = editor.getBody();
        if (body) {
            return (AjxStringUtil.convertHtml2Text(body, convertor, true));
        }
    }
    return "";
};

ZmHtmlEditor.prototype.moveCaretToTop =
function(offset) {
	if (this._mode == Dwt.TEXT) {
		var control = this.getContentField();
		control.scrollTop = 0;
		if (control.createTextRange) { // IE
			var range = control.createTextRange();
			if (offset) {
				range.move('character', offset);
			}
			else {
				range.collapse(true);
			}
			range.select();
		} else if (control.setSelectionRange) { // FF
			offset = offset || 0;
            //If display is none firefox will throw the following error
            //Error: Component returned failure code: 0x80004005 (NS_ERROR_FAILURE) [nsIDOMHTMLTextAreaElement.setSelectionRange]
            //checking offsetHeight to check whether it is rendered or not
            if (control.offsetHeight) {
                control.setSelectionRange(offset, offset);
            }
		}
	} else {
		this._moveCaretToTopHtml(true, offset);
	}
};

ZmHtmlEditor.prototype._moveCaretToTopHtml =
function(tryOnTimer, offset) {
	var editor = this.getEditor();
	var body = editor && editor.getDoc().body;
	var success = false;
	if (AjxEnv.isIE) {
		if (body) {
			var range = body.createTextRange();
			if (offset) {
				range.move('character', offset);
			} else {
				range.collapse(true);
			}
			success = true;
		}
	} else {
		var selection = editor && editor.selection ? editor.selection.getSel() : "";
		if (selection) {
            if (offset) { // if we get an offset, use it as character count into text node
                var target = body.firstChild;
                while (target) {
                    if (offset === 0) {
                        selection.collapse(target, offset);
                        break;
                    }
                    if (target.nodeName === "#text") {
                        var textLength = target.length;
                        if (offset > textLength) {
                            offset = offset - textLength;
                        } else {
                            selection.collapse(target, offset);
                            break;
                        }
                    } else if (target.nodeName === "BR") {//text.length is also including \n count. so if there is br reduce offset by 1
                        offset = offset - 1;
                    }
                    target = target.nextSibling;
                }
            }
            else {
                selection.collapse(body, 0);
            }
          success = true;
        }
	}

	if (success) {
		editor.focus();
	} else if (tryOnTimer) {
		if (editor) {
			var action = new AjxTimedAction(this, this._moveCaretToTopHtml);
			AjxTimedAction.scheduleAction(action, ZmHtmlEditor._INITDELAY + 1);
		} else {
			var cb = ZmHtmlEditor.prototype._moveCaretToTopHtml;
			this._initCallbacks.push(cb.bind(this, tryOnTimer, offset));
		}
	}
};

ZmHtmlEditor.prototype.hasFocus =
function() {
	return Boolean(this._hasFocus[this._mode]);
};

/*ZmSignature editor contains getIframeDoc method dont want to break the existing code*/
ZmHtmlEditor.prototype._getIframeDoc = ZmHtmlEditor.prototype.getIframeDoc =
function() {
	var editor = this.getEditor();
	return editor ? editor.getDoc() : null;
};

ZmHtmlEditor.prototype._getIframeWin =
function() {
	var editor = this.getEditor();
	return editor ? editor.getWin() : null;
};

ZmHtmlEditor.prototype.clear =
function() {
	var editor = this.getEditor();
	if (editor && this._editorInitialized) {
		editor.undoManager && editor.undoManager.clear();
		this.clearDirty();
	}
	var textField = this.getContentField();
	if (!textField) {
		return;
	}

	//If HTML editor is not initialized and the current mode is HTML, then HTML editor is currently getting initialized. Text area should not be replaced at this time, as this will make the TinyMCE JavaScript reference empty for the text area.
	if (!this.isHtmlModeInited() && this.getMode() === Dwt.HTML) {
		return;
	}
	var textEl = textField.cloneNode(false);
	textField.parentNode.replaceChild(textEl, textField);//To clear undo/redo queue of textarea
	//cloning and replacing node will remove event handlers and hence adding it once again
	Dwt.setHandler(textEl, DwtEvent.ONFOCUS, this._onTextareaFocus.bind(this, true, true));
	Dwt.setHandler(textEl, DwtEvent.ONBLUR, this.setFocusStatus.bind(this, false, true));
    Dwt.setHandler(textEl, DwtEvent.ONKEYDOWN, this._handleTextareaKeyEvent.bind(this));
	if (editor) {
		// TinyMCE internally stored textarea element reference as targetElm which is lost after the above operation. Once targetElm is undefined TinyMCE will try to get the element using it's id.
		editor.targetElm = null;
	}
};

ZmHtmlEditor.prototype.initTinyMCEEditor = function(params) {

	var htmlEl = this.getHtmlElement();
	//textarea on which html editor is constructed
	var id = this._bodyTextAreaId;
	var textEl = document.createElement("textarea");
	textEl.setAttribute("id", id);
	textEl.setAttribute("name", id);
	textEl.setAttribute("aria-label", ZmMsg.composeBody);
    if( appCtxt.get(ZmSetting.COMPOSE_INIT_DIRECTION) === ZmSetting.RTL ){
        textEl.setAttribute("dir", ZmSetting.RTL);
    }
	textEl.className = "ZmHtmlEditorTextArea";
    if ( params.content !== null ) {
        textEl.value = params.content;
    }
	if (this._mode === Dwt.HTML) {
		//If the mode is HTML set the text area display as none. After editor is rendered with the content, TinyMCE editor's show method will be called for displaying the editor on the post render event.
		Dwt.setVisible(textEl, false);
	}
	htmlEl.appendChild(textEl);
	this._textAreaId = id;

    Dwt.setHandler(textEl, DwtEvent.ONFOCUS, this._onTextareaFocus.bind(this, true, true));
    Dwt.setHandler(textEl, DwtEvent.ONBLUR, this.setFocusStatus.bind(this, false, true));
    Dwt.setHandler(textEl, DwtEvent.ONKEYDOWN, this._handleTextareaKeyEvent.bind(this));

	if (!window.tinyMCE) {
        window.tinyMCEPreInit = {};
        window.tinyMCEPreInit.suffix = '';
        window.tinyMCEPreInit.base = appContextPath + ZmHtmlEditor.TINY_MCE_PATH; // SET PATH TO TINYMCE HERE
        // Tell TinyMCE that the page has already been loaded
        window.tinyMCE_GZ = {};
        window.tinyMCE_GZ.loaded = true;

		var callback = this.initEditorManager.bind(this, id, params.autoFocus);
        AjxDispatcher.require(["TinyMCE"], true, callback);
	} else {
		this.initEditorManager(id, params.autoFocus);
	}
};

ZmHtmlEditor.prototype.addOnContentInitializedListener =
function(callback) {
	this._onContentInitializeCallbacks.push(callback);
};

ZmHtmlEditor.prototype.clearOnContentInitializedListeners =
function() {
	this._onContentInitializeCallback = null;
};

ZmHtmlEditor.prototype._handleEditorKeyEvent = function(ev) {

	var ed = this.getEditor(),
	    retVal = true;

    if (DwtKeyboardMgr.isPossibleInputShortcut(ev) || (ev.keyCode === DwtKeyEvent.KEY_TAB && (ev.shiftKey || !appCtxt.get(ZmSetting.TAB_IN_EDITOR)))) {
        // pass to keyboard mgr for kb nav
        retVal = DwtKeyboardMgr.__keyDownHdlr(ev);
    }
    else if (DwtKeyEvent.IS_RETURN[ev.keyCode]) { // enter key
        var parent,
            selection,
            startContainer,
            editorDom,
            uniqueId,
            blockquote,
            nextSibling,
            divElement,
            splitElement;

        if (ev.shiftKey) {
            return;
        }

        selection = ed.selection;
        parent = startContainer = selection.getRng(true).startContainer;
        if (!startContainer) {
            return;
        }

        editorDom = ed.dom;
        //Gets all parent block elements
        blockquote = editorDom.getParents(startContainer, "blockquote", ed.getBody());
        if (!blockquote) {
            return;
        }

        blockquote = blockquote.pop();//Gets the last blockquote element
        if (!blockquote || !blockquote.style.borderLeft) {//Checking blockquote left border for verifying it is reply blockquote
            return;
        }

        uniqueId = editorDom.uniqueId();
        ed.undoManager.add();
        try {
            selection.setContent("<div id='" + uniqueId + "'><br></div>");
        }
        catch (e) {
            return;
        }

        divElement = ed.getDoc().getElementById(uniqueId);
        if (divElement) {
            divElement.removeAttribute("id");
        }
        else {
            return;
        }

        nextSibling = divElement.nextSibling;
        if (nextSibling && nextSibling.nodeName === "BR") {
            nextSibling.parentNode.removeChild(nextSibling);
        }

        try {
            splitElement = editorDom.split(blockquote, divElement);
            if (splitElement) {
                selection.select(splitElement);
                selection.collapse(true);
                ev.preventDefault();
            }
        }
        catch (e) {
        }
    }
    else if (ZmHtmlEditor.isEditorTab(ev)) {
        ed.execCommand('mceInsertContent', false, '&emsp;');
        DwtUiEvent.setBehaviour(ev, true, false);
        return false;
    }


    if (window.DwtIdleTimer) {
		DwtIdleTimer.resetIdle();
	}

	if (window.onkeydown) {
		window.onkeydown.call(this);
	}
	
	return retVal;
};

// Text mode key event handler
ZmHtmlEditor.prototype._handleTextareaKeyEvent = function(ev) {

    if (ZmHtmlEditor.isEditorTab(ev)) {
        Dwt.insertText(this.getContentField(), '\t');
        DwtUiEvent.setBehaviour(ev, true, false);
        return false;
    }
    return true;
};

//Notifies mousedown event in tinymce editor to ZCS
ZmHtmlEditor.prototype._handleEditorMouseDownEvent =
function(ev) {
    DwtOutsideMouseEventMgr.forwardEvent(ev);
};

ZmHtmlEditor.prototype.onLoadContent =
function(ev) {
	if (this._onContentInitializeCallbacks) {
		AjxDebug.println(AjxDebug.REPLY, "ZmHtmlEditor::onLoadContent - run callbacks");
		AjxUtil.foreach(this._onContentInitializeCallbacks,
		                function(fn) { fn.run() });
	}
};

ZmHtmlEditor.prototype.setFocusStatus =
function(hasFocus, isTextModeFocus) {
	var mode = isTextModeFocus ? Dwt.TEXT : Dwt.HTML;
	this._hasFocus[mode] = hasFocus;

	Dwt.condClass(this.getHtmlElement(), hasFocus, DwtControl.FOCUSED);

	if (!isTextModeFocus) {
		Dwt.condClass(this.getEditor().getBody(), hasFocus,
		              'mce-active-editor', 'mce-inactive-editor');
	}
};

ZmHtmlEditor.prototype._onTextareaFocus = function() {

    this.setFocusStatus(true, true);
    appCtxt.getKeyboardMgr().updateFocus(this.getContentField());
};

ZmHtmlEditor.prototype.initEditorManager =
function(id, autoFocus) {

	var obj = this;

    if (!window.tinyMCE) {//some problem in loading TinyMCE files
        return;
    }

	var urlParts = AjxStringUtil.parseURL(location.href);

	//important: tinymce doesn't handle url parsing well when loaded from REST URL - override baseURL/baseURI to fix this
	tinymce.baseURL = appContextPath + ZmHtmlEditor.TINY_MCE_PATH;

	if (tinymce.EditorManager) {
		tinymce.EditorManager.baseURI = new tinymce.util.URI(urlParts.protocol + "://" + urlParts.authority + tinymce.baseURL);
	}

	if (tinymce.dom) {
		tinymce.DOM = new tinymce.dom.DOMUtils(document, {process_html : 0});
	}

	if (tinymce.dom && tinymce.dom.Event) {
		tinymce.dom.Event.domLoaded = true;
	}

	var toolbarbuttons = [
		'fontselect fontsizeselect formatselect |',
		'bold italic underline strikethrough removeformat |',
		'forecolor backcolor |',
		'outdent indent bullist numlist blockquote |',
		'alignleft aligncenter alignright alignjustify |',
		this._attachmentCallback ? 'zimage' : 'image',
		'link zemoticons charmap hr table |',
		appCtxt.get(ZmSetting.SHOW_COMPOSE_DIRECTION_BUTTONS) ? 'ltr rtl |' : '',
		'undo redo |',
		'pastetext code'
	];

	// NB: contextmenu plugin deliberately omitted; it's confusing
	var plugins = [
		"zemoticons",
		"table", "directionality", "textcolor", "lists", "advlist",
		"link", "hr", "charmap", "code", "image", "autolink"
	];

	if (this._attachmentCallback) {
		tinymce.PluginManager.add('zimage', function(editor) {
			editor.addButton('zimage', {
                icon: 'image',
                tooltip: ZmMsg.insertImage,
                onclick: obj._attachmentCallback,
                stateSelector: 'img:not([data-mce-object])'
			});
		});

		plugins.push('zimage');
	}

    var fonts = [];
	var KEYS = [ "fontFamilyIntl", "fontFamilyBase" ];
	var i, j, key, value, name;
	for (j = 0; j < KEYS.length; j++) {
		for (i = 1; value = AjxMsg[KEYS[j]+i+".css"]; i++) {
			if (value.match(/^#+$/)) break;
			value = value.replace(/,\s/g,",");
			name = AjxMsg[KEYS[j]+i+".display"];
			fonts.push(name+"="+value);
		}
	}

	if (!autoFocus) {
		// if !true, Set to false in case undefined
		autoFocus = false;
	}
    var tinyMCEInitObj = {
        // General options
		mode :  (this._mode == Dwt.HTML)? "exact" : "none",
		theme: 'modern',
		auto_focus: autoFocus,
		elements:  id,
        plugins : plugins.join(' '),
		toolbar: toolbarbuttons.join(' '),
		toolbar_items_size: 'small',
		statusbar: false,
		menubar: false,
		ie7_compat: false,
		object_resizing : true,
        font_formats : fonts.join(";"),
        fontsize_formats : AjxMsg.fontSizes || '',
		convert_urls : false,
		anchor_top: false,
		anchor_bottom: false,
		verify_html : false,
		browser_spellcheck : true,
        content_css : appContextPath + '/css/tinymce-content.css?v=' + cacheKillerVersion,
        dialog_type : "modal",
        forced_root_block : "div",
        width: "100%",
        height: "auto",
        visual: false,
        language: tinyMCE.getlanguage(appCtxt.get(ZmSetting.LOCALE_NAME)),
        directionality : appCtxt.get(ZmSetting.COMPOSE_INIT_DIRECTION),
        paste_retain_style_properties : "all",
		paste_data_images: false,
        paste_remove_styles_if_webkit : false,
        table_default_attributes: { cellpadding: '3px', border: '1px' },
        table_default_styles: { width: '90%', tableLayout: 'fixed' },
		setup : function(ed) {
            ed.on('LoadContent', obj.onLoadContent.bind(obj));
            ed.on('PostRender', obj.onPostRender.bind(obj));
            ed.on('init', obj.onInit.bind(obj));
            ed.on('keydown', obj._handleEditorKeyEvent.bind(obj));
            ed.on('MouseDown', obj._handleEditorMouseDownEvent.bind(obj));
            ed.on('paste', obj.onPaste.bind(obj));
            ed.on('PastePostProcess', obj.pastePostProcess.bind(obj));
            ed.on('BeforeExecCommand', obj.onBeforeExecCommand.bind(obj));

            ed.on('contextmenu', obj._handleEditorEvent.bind(obj));
            ed.on('mouseup', obj._handleEditorEvent.bind(obj));
        }
    };

	tinyMCE.init(tinyMCEInitObj);
	this._editor = this.getEditor();
};

ZmHtmlEditor.prototype.onPaste = function(ev) {
    if (!this._pasteCallback)
        return;

    var items = ((ev.clipboardData &&
                  (ev.clipboardData.items || ev.clipboardData.files)) ||
                 (window.clipboardData && clipboardData.files)),
        item = items && items[0],
        file, name, type,
        view;

	if (item && item.getAsFile) {
		file = item.getAsFile();
		name = file && file.name;
		type = file && file.type;
	} else if (item && item.type) {
		file = item;
		name = file.name;
		type = file.type;
	}

	if (file) {
		ev.stopPropagation();
		ev.preventDefault();
		var headers = {
			"Cache-Control": "no-cache",
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": type,
			"Content-Disposition": 'attachment; filename="' + (name ? AjxUtil.convertToEntities(name) : ev.timeStamp || new Date().getTime()) + '"'
		};
		var url = (appCtxt.get(ZmSetting.CSFE_ATTACHMENT_UPLOAD_URI) +
				   "?fmt=extended,raw");

		var fn = AjxRpc.invoke.bind(AjxRpc, file, url, headers,
		                            this._handlePasteUpload.bind(this),
		                            AjxRpcRequest.HTTP_POST);

		// IE11 appears to disallow AJAX requests within the event handler
		if (AjxEnv.isTrident) {
			setTimeout(fn, 0);
		} else {
			fn();
		}
    }  else  {
		var clipboardContent = this.getClipboardContent(ev);
		if (this.hasContentType(clipboardContent, 'text/html')) {
			var content = clipboardContent['text/html'];
			if (content) {
				this.pasteHtml(content);
				ev.stopPropagation();
				ev.preventDefault();
			}
		}
	}
};

ZmHtmlEditor.prototype.getDataTransferItems = function(dataTransfer) {
	var data = {};

	if (dataTransfer) {
		// Use old WebKit/IE API
		if (dataTransfer.getData) {
			var legacyText = dataTransfer.getData('Text');
			if (legacyText && legacyText.length > 0) {
				data['text/plain'] = legacyText;
			}
		}

		if (dataTransfer.types) {
			for (var i = 0; i < dataTransfer.types.length; i++) {
				var contentType = dataTransfer.types[i];
				data[contentType] = dataTransfer.getData(contentType);
			}
		}
	}

	return data;
};


ZmHtmlEditor.prototype.hasContentType = function(clipboardContent, mimeType) {
	return mimeType in clipboardContent && clipboardContent[mimeType].length > 0;
};

ZmHtmlEditor.prototype.getClipboardContent = function(clipboardEvent) {
	return this.getDataTransferItems(clipboardEvent.clipboardData || this.getEditor().getDoc().dataTransfer);
};


ZmHtmlEditor.prototype.pasteHtml = function(html) {
	var ed = this.getEditor();
	var args, dom = ed.dom;

	var document = ed.getDoc();
	var numOriginalStyleSheets = document.styleSheets ? document.styleSheets.length : 0;
	var styleSheets    = document.styleSheets;

	// We need to attach the element to the DOM so Sizzle selectors work on the contents
	var tempBody = dom.add(ed.getBody(), 'div', {style: 'display:none'}, html);
	args = ed.fire('PastePostProcess', {node: tempBody});
	html = args.node.innerHTML;

	var styleNodes = [];
	if (!args.isDefaultPrevented()) {
		var re;
		for (var i = numOriginalStyleSheets; i < styleSheets.length; i++) {
			// Access and update the stylesheet class names, to insure no collisions
			var stylesheet = styleSheets[i];
			var updates = this._getPastedClassUpdates(stylesheet);
			var styleHtml = stylesheet.ownerNode.innerHTML;
			for (var selectorText in updates) {
				// Replace the non-unique Excel class names with unique new ones in style html and pasted content html.
				var newSelectorText = updates[selectorText];
				re = new RegExp(selectorText.substring(1), 'g');
				html = html.replace(re, newSelectorText.substring(1));
				styleHtml = styleHtml.replace(selectorText, newSelectorText);
			}
			// Excel .5pt line doesn't display in Chrome - use a 1pt line.  Somewhat fragile (Assuming width is the
			// first attribute for border, following the ':'), but need to do so that we only replace a standalone .5pt
			re = new RegExp(":.5pt", 'g');
			styleHtml = styleHtml.replace(re, ":1pt");
			// Microsoft special, just use 'black'
			re = new RegExp("windowtext", 'g');
			styleHtml = styleHtml.replace(re, "black");

			// Create a new style node and record it; it will be added below to the body with the new content
			var styleNode = document.createElement('style');
			styleNode.type = "text/css";
			var scoped = document.createAttribute("scoped");
			styleNode.setAttributeNode(scoped);
			styleNode.innerHTML = styleHtml;
			styleNodes.push(styleNode);
		}
	}

	dom.remove(tempBody);

	if (!args.isDefaultPrevented()) {
		var body = document.body;
		for (var i = 0; i < styleNodes.length; i++) {
			// Insert the styles into the body.  Modern browsers support this (even though its not strictly valid), and
			// the 'scoped' attribute added above means that future browsers should treat it as valid.
			body.insertBefore(styleNodes[i], body.childNodes[0]);
		}
		ed.insertContent(html, {merge: ed.settings.paste_merge_formats !== false});
	}
};

ZmHtmlEditor.prototype._getPastedClassUpdates = function(styleSheet) {
    var cssRules = styleSheet.cssRules;
	var updates = {};
	if (cssRules) {
		for (var i = 0; i < cssRules.length; i++) {
			var selectorText = cssRules[i].selectorText;
			// Excel class definitions (for now) start with ".xl", but this tries to be a little less specific (and fragile).
			// Convert the Excel class names (which may be duplicated with each paste) to unique class names, so that
			// later paste formatting doesn't step on previous formatting.
			if (selectorText && selectorText.indexOf(".") == 0) {
				// Create a new unique class name that will be used instead
				var newSelectorText = ".zimbra" + (++this._classCount).toString();
				updates[selectorText] = newSelectorText;
			}
		}
	}
	// Return a map of { oldClassName : newClassName }
	return updates;
}

ZmHtmlEditor.prototype._handlePasteUpload = function(r) {
	if (r && r.success) {
		var resp = eval("["+r.text+"]");
		if(resp.length === 3) {
			resp[2].clipboardPaste = true;
		}
		this._pasteCallback(resp);
	}
};


ZmHtmlEditor.prototype.onPostRender = function(ev) {
	var ed = this.getEditor();

    ed.dom.setStyles(ed.getBody(), {"font-family" : appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_FAMILY),
                                    "font-size"   : appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_SIZE),
                                    "color"       : appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_COLOR)
                                   });
	//Shows the editor and hides any textarea/div that the editor is supposed to replace.
	ed.show();
    this._resetSize();
};

ZmHtmlEditor.prototype.onInit = function(ev) {

	var ed = this.getEditor();
    var obj = this,
        tinymceEvent = tinymce.dom.Event,
        doc = ed.getDoc(),
        win = ed.getWin(),
        view = obj.parent;

    obj.setFocusStatus(false);

    ed.on('focus', function(e) {
        DBG.println(AjxDebug.FOCUS, "EDITOR got focus");
		appCtxt.getKeyboardMgr().updateFocus(obj._getIframeDoc().body);
        obj.setFocusStatus(true);
    });
    ed.on('blur', function(e) {
        obj.setFocusStatus(false);
    });
    // Sets up the a range for the current ins point or selection. This is IE only because the iFrame can
    // easily lose focus (e.g. by clicking on a button in the toolbar) and we need to be able to get back
    // to the correct insertion point/selection.
    // Here we are registering this dedicated event to store the bookmark which will fire when focus moves outside the editor
    if(AjxEnv.isIE){
        tinymceEvent.bind(doc, 'beforedeactivate', function(e) {
            if(ed.windowManager){
                ed.windowManager.bookmark = ed.selection.getBookmark(1);
            }
        });
    }

    ed.on('open', ZmHtmlEditor.onPopupOpen);
    if (view && view.toString() === "ZmComposeView" && ZmDragAndDrop.isSupported()) {
        var dnd = view._dnd;
        tinymceEvent.bind(doc, 'dragenter', this._onDragEnter.bind(this));
        tinymceEvent.bind(doc, 'dragleave', this._onDragLeave.bind(this));
        tinymceEvent.bind(doc, 'dragover', this._onDragOver.bind(this, dnd));
        tinymceEvent.bind(doc, 'drop', this._onDrop.bind(this, dnd));
    }

    obj._editorInitialized = true;

	// Access the content stored in the textArea (if any)
	var contentField = this.getContentField();
	var content =  contentField.value;
	contentField.value = "";
	// Use our setContent to set up the content using the 'raw' format, which preserves styling
	this.setContent(content);

	this._resetSize();
	this._setupTabGroup();

	var iframe = Dwt.getElement(this._iFrameId);
	if (iframe) {
		Dwt.addClass(iframe, 'ZmHtmlEditorIFrame');
		iframe.setAttribute('title', ZmMsg.htmlEditorTitle);
		var body = this._getIframeDoc().body;
		if (body) {
			body.setAttribute('aria-label', ZmMsg.composeBody);
		}
	}

    AjxUtil.foreach(this._initCallbacks, function(fn) { fn.run() });
};

ZmHtmlEditor.prototype._onFocus = function() {
	var editor = this.getEditor();

	if (this._mode === Dwt.HTML && editor) {
		editor.fire('focus', {focusedEditor: editor});
	}
};

ZmHtmlEditor.prototype._onBlur = function() {
	var editor = this.getEditor();

	if (this._mode === Dwt.HTML && editor) {
		editor.fire('blur', {focusedEditor: null});
	}
};


ZmHtmlEditor.prototype.__getEditorControl = function(type, tooltip) {
	// This method provides a naive emulation of the control manager offered in
	// TinyMCE 3.x. We assume that there's only one control of a given type
	// with a given tooltip in the entire TinyMCE control hierarchy. Hopefully,
	// this heuristic won't prove too fragile.
	var ed = this.getEditor();

	function finditem(item) {
		// the tooltip in settings appears constant and unlocalized
		if (item.type === type && item.settings.tooltip === tooltip)
			return item;

		if (typeof item.items === 'function') {
			var items = item.items();

			for (var i = 0; i < items.length; i++) {
				var r = finditem(items[i]);
				if (r)
					return r;
			}
		}

		if (typeof item.menu === 'object') {
			return finditem(item.menu);
		}
	};

	return ed ? finditem(ed.theme.panel) : null;
};

/*
**   TinyMCE will fire onBeforeExecCommand before executing all commands
 */
ZmHtmlEditor.prototype.onBeforeExecCommand = function(ev) {
    if (ev.command === "mceImage") {
        this.onBeforeInsertImage(ev);
    }
    else if (ev.command === "mceRepaint") { //img src modified
        this.onBeforeRepaint(ev);
    }
};

ZmHtmlEditor.prototype.onBeforeInsertImage = function(ev) {
    var element = ev.target.selection.getNode();
    if (element && element.nodeName === "IMG") {
        element.setAttribute("data-mce-src", element.src);
        element.setAttribute("data-mce-zsrc", element.src);//To find out whether src is modified or not set a dummy attribute
    }
};

ZmHtmlEditor.prototype.onBeforeRepaint = function(ev) {
    var element = ev.target.selection.getNode();
    if (element && element.nodeName === "IMG") {
        if (element.src !== element.getAttribute("data-mce-zsrc")) {
            element.removeAttribute("dfsrc");
        }
        element.removeAttribute("data-mce-zsrc");
    }
};

ZmHtmlEditor.prototype._onDragEnter = function() {
    Dwt.addClass(Dwt.getElement(this._iFrameId), "DropTarget");
};

ZmHtmlEditor.prototype._onDragLeave = function() {
    Dwt.delClass(Dwt.getElement(this._iFrameId), "DropTarget");
};

ZmHtmlEditor.prototype._onDragOver = function(dnd, ev) {
    dnd._onDragOver(ev);
};

ZmHtmlEditor.prototype._onDrop = function(dnd, ev) {
    dnd._onDrop(ev, true);
    Dwt.delClass(Dwt.getElement(this._iFrameId), "DropTarget");
};

ZmHtmlEditor.prototype.setMode = function (mode, convert, convertor) {

    this.discardMisspelledWords();
    if (mode === this._mode || (mode !== Dwt.HTML && mode !== Dwt.TEXT)) {
        return;
    }
    this._mode = mode;
	var textarea = this.getContentField();
    if (mode === Dwt.HTML) {
        if (convert) {
            textarea.value = AjxStringUtil.convertToHtml(textarea.value, true);
        }
        if (this._editorInitialized) {
	        // tinymce will automatically toggle the editor and set the corresponding content.
            tinyMCE.execCommand('mceToggleEditor', false, this._bodyTextAreaId);
        }
        else {
            //switching from plain text to html using tinymces mceToggleEditor method is always
            // using the last editor creation setting. Due to this current ZmHtmlEditor object
            // always point to last ZmHtmlEditor object. Hence initializing the tinymce editor
            // again for the first time when mode is switched from plain text to html.
            this.initEditorManager(this._bodyTextAreaId);
        }
    } else {
        if (convert) {
            var content;
            if (this._editorInitialized) {
                content = this._convertHtml2Text(convertor);
            }
            else {
                content = AjxStringUtil.convertHtml2Text(textarea.value);
            }
        }
        if (this._editorInitialized) {
	        //tinymce will automatically toggles the editor and sets the corresponding content.
            tinyMCE.execCommand('mceToggleEditor', false, this._bodyTextAreaId);
        }
        if (convert) {
            //tinymce will set html content directly in textarea. Resetting the content after removing the html tags.
            this.setContent(content);
        }

        Dwt.setVisible(textarea, true);
    }

	textarea = this.getContentField();
	textarea.setAttribute('aria-hidden', !Dwt.getVisible(textarea));

	if(this._editorInitialized) {
		this._setupTabGroup();
		this._resetSize();
	}
};

ZmHtmlEditor.prototype.getContentField =
function() {
	return document.getElementById(this._bodyTextAreaId);
};

ZmHtmlEditor.prototype.insertImage =
function(src, dontExecCommand, width, height, dfsrc) {
	// We can have a situation where:
	//   Paste plugin does a createPasteBin, creating a marker element that it uses
	//   We upload a pasted image.
	//   The upload completes, and we do a SaveDraft. It calls insertImage.
	//   A timeout function from the plugin executes before or after insertImage, and calls removePasteBin.
	//
	//   InsertImage executes. If the pasteBin has not been removed when we try to insert the image, it interferes with
	//   tinyMCE insertion.  No image is inserted in the editor body, and we end up with an attachment
	//    bubble instead.
	var  pasteBinClone;
	var ed = this.getEditor();

	// *** Begin code copied from Paste Plugin Clipboard.js, removePasteBin
	while ((pasteBinClone = ed.dom.get('mcepastebin'))) {
		ed.dom.remove(pasteBinClone);
		ed.dom.unbind(pasteBinClone);
	}
	// *** End copied code from removePasteBin

	var html = [];
	var idx= 0 ;

	html[idx++] = "<img";
	html[idx++] = " src='";
	html[idx++] = src;
	html[idx++] = "'";

    if ( dfsrc != null) {
        html[idx++] = " dfsrc='";
        html[idx++] = dfsrc;
	    html[idx++] = "'";
    }
	if (width != null) {
		html[idx++] = " width='" + width + "'";
	}
	if (height != null) {
		html[idx++] = " height='" + height + "'";
	}
	html[idx++] = ">";


    ed.focus();

	//tinymce modifies the source when using mceInsertContent
    //ed.execCommand('mceInsertContent', false, html.join(""), {skip_undo : 1});
    ed.execCommand('mceInsertRawHTML', false, html.join(""), {skip_undo : 1});
};

ZmHtmlEditor.prototype.replaceImage =
function(id, src){
    var doc = this.getEditor().getDoc();
    if(doc){
        var img = doc.getElementById(id);
        if( img && img.getAttribute("data-zim-uri") === id ){
            img.src = src;
            img.removeAttribute("id");
            img.removeAttribute("data-mce-src");
            img.removeAttribute("data-zim-uri");
        }
    }
};

/*
This function will replace all the img elements matching src
 */
ZmHtmlEditor.prototype.replaceImageSrc =
function(src, newsrc){
	var doc = this.getEditor().getDoc();
	if(doc){
		var images = doc.getElementsByTagName('img');
		if (images && images.length > 0) {
			AjxUtil.foreach(images,function(img) {
				if (img.src && img.src == src) {
					img.src = newsrc;
					img.removeAttribute("id");
					img.removeAttribute("data-mce-src");
					img.removeAttribute("data-zim-uri");
				}
			});
		}
	}
};

ZmHtmlEditor.prototype.addCSSForDefaultFontSize =
function(editor) {
	var selectorText = "body,td,pre";
	var ruleText = [
			"font-family:", appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_FAMILY),";",
			"font-size:", appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_SIZE),";",
			"color:", appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_COLOR),";"
	].join("");
	var doc = editor ? editor.getDoc() : null;
	if (doc) {
		this.insertDefaultCSS(doc, selectorText, ruleText);
	}
};

ZmHtmlEditor.prototype.insertDefaultCSS =
function(doc, selectorText, ruleText) {
	var sheet, styleElement;
	if (doc.createStyleSheet) {
		sheet = doc.createStyleSheet();
	} else {
		styleElement = doc.createElement("style");
		doc.getElementsByTagName("head")[0].appendChild(styleElement);
		sheet = styleElement.styleSheet ? styleElement.styleSheet : styleElement.sheet;
	}

	if (!sheet && styleElement) {
		//remove braces
		ruleText = ruleText.replace(/^\{?([^\}])/, "$1");
		styleElement.innerHTML = selectorText + ruleText;
	} else if (sheet.addRule) {
		//remove braces
		ruleText = ruleText.replace(/^\{?([^\}])/, "$1");
		DBG.println("ruleText:" + ruleText + ",selector:" + selectorText);
		sheet.addRule(selectorText, ruleText);
	} else if (sheet.insertRule) {
		//need braces
		if (!/^\{[^\}]*\}$/.test(ruleText)) ruleText = "{" + ruleText + "}";
		sheet.insertRule(selectorText + " " + ruleText, sheet.cssRules.length);
	}
};

ZmHtmlEditor.prototype.resetSpellCheck =
function() {
	//todo: remove this when spellcheck is disabled
	this.discardMisspelledWords();
	this._spellCheckHideModeDiv();
};

/**SpellCheck modules**/

ZmHtmlEditor.prototype.checkMisspelledWords =
function(callback, onExitCallback, errCallback){
	var text = this.getTextVersion();
	if (/\S/.test(text)) {
		AjxDispatcher.require("Extras");
		this._spellChecker = new ZmSpellChecker(this);
		this._spellCheck = null;
		this._spellCheckSuggestionListenerObj = new AjxListener(this, this._spellCheckSuggestionListener);
		if (!this.onExitSpellChecker) {
			this.onExitSpellChecker = onExitCallback;
		}
		var params = {
			text: text,
			ignore: AjxUtil.keys(this._ignoreWords).join()
		};
		this._spellChecker.check(params, callback, errCallback);
		return true;
	}

	return false;
};

ZmHtmlEditor.prototype.spellCheck =
function(callback, keepModeDiv) {
	var text = this.getTextVersion(null, keepModeDiv);

	if (/\S/.test(text)) {
		AjxDispatcher.require("Extras");
		this._spellChecker = new ZmSpellChecker(this);
		this._spellCheck = null;
		this._spellCheckSuggestionListenerObj = new AjxListener(this, this._spellCheckSuggestionListener);
		if (!this.onExitSpellChecker) {
			this.onExitSpellChecker = callback;
		}
        var params = {
			text: text,
			ignore: AjxUtil.keys(this._ignoreWords).join()
		};
		this._spellChecker.check(params, new AjxCallback(this, this._spellCheckCallback));
		return true;
	}

	return false;
};

ZmHtmlEditor.prototype._spellCheckCallback =
function(words) {
    // Remove the below comment for hard coded spell check response for development
    //words = {"misspelled":[{"word":"onee","suggestions":"one,nee,knee,once,ones,one's"},{"word":"twoo","suggestions":"two,too,woo,twos,two's"},{"word":"fourrr","suggestions":"Fourier,furor,furry,firer,fuhrer,fore,furrier,four,furrow,fora,fury,fours,ferry,foray,flurry,four's"}],"available":true};
	var wordsFound = false;

	if (words && words.available) {
		var misspelled = words.misspelled;
		if (misspelled == null || misspelled.length == 0) {
			appCtxt.setStatusMsg(ZmMsg.noMisspellingsFound, ZmStatusView.LEVEL_INFO);
			this._spellCheckHideModeDiv();
		} else {
			var msg = AjxMessageFormat.format(ZmMsg.misspellingsResult, misspelled.length);
			appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_WARNING);

			this.highlightMisspelledWords(misspelled);
			wordsFound = true;
		}
	} else {
		appCtxt.setStatusMsg(ZmMsg.spellCheckUnavailable, ZmStatusView.LEVEL_CRITICAL);
	}

	if (AjxEnv.isGeckoBased && this._mode == Dwt.HTML) {
		setTimeout(AjxCallback.simpleClosure(this.focus, this), 10);
	}

	if (this.onExitSpellChecker) {
		this.onExitSpellChecker.run(wordsFound);
	}
};

ZmHtmlEditor.prototype._spellCheckSuggestionListener =
function(ev) {
	var self = this;
	var item = ev.item;
	var orig = item.getData("orig");
	if (!orig) { return; }

	var val = item.getData(ZmHtmlEditor.VALUE);
	var plainText = this._mode == Dwt.TEXT;
	var fixall = item.getData("fixall");
	var doc = plainText ? document : this._getIframeDoc();
	var span = doc.getElementById(item.getData("spanId"));
	var action = item.getData(ZmOperation.MENUITEM_ID);
	switch (action) {
		case "ignore":
			val = orig;
			this._ignoreWords[val] = true;
//			if (fixall) {
				// TODO: visually "correct" all of them
//			}
			break;
		case "add":
			val = orig;
			// add word to user's personal dictionary
			var soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount");
			var prefEl = soapDoc.set("pref", val);
			prefEl.setAttribute("name", "+zimbraPrefSpellIgnoreWord");
			var params = {
				soapDoc: soapDoc,
				asyncMode: true,
				callback: new AjxCallback(appCtxt, appCtxt.setStatusMsg, [ZmMsg.wordAddedToDictionary])
			};
			appCtxt.getAppController().sendRequest(params);
			this._ignoreWords[val] = true;
			break;
		default: break;
	}

	if (plainText && val == null) {
		this._editWord(fixall, span);
	}
	else {
		var spanEls = fixall ? this._spellCheck.wordIds[orig] : span;
		this._editWordFix(spanEls, val);
	}
    
	this._handleSpellCheckerEvents(null);
};

ZmHtmlEditor.prototype._getEditorDocument = function() {
	var plainText = this._mode == Dwt.TEXT;
	return plainText ? document : this._getIframeDoc();
};

ZmHtmlEditor.prototype._editWord = function(fixall, spanEl) {
	// edit clicked
	var doc = this._getEditorDocument();
	var input = doc.createElement("input");
	input.type = "text";
	input.value = AjxUtil.getInnerText(spanEl);
	input.className = "SpellCheckInputField";
	input.style.left = spanEl.offsetLeft - 2 + "px";
	input.style.top = spanEl.offsetTop - 2 + "px";
	input.style.width = spanEl.offsetWidth + 4 + "px";
	var div = doc.getElementById(this._spellCheckDivId);
	var scrollTop = div.scrollTop;
	div.appendChild(input);
	div.scrollTop = scrollTop; // this gets resetted when we add an input field (at least Gecko)
	input.setAttribute("autocomplete", "off");
	input.focus();
	if (!AjxEnv.isGeckoBased)
		input.select();
	else
		input.setSelectionRange(0, input.value.length);
	var inputListener = AjxCallback.simpleClosure(this._editWordHandler, this, fixall, spanEl);
	input.onblur = inputListener;
	input.onkeydown = inputListener;
};

ZmHtmlEditor.prototype._editWordHandler = function(fixall, spanEl, ev) {
	// the event gets lost after 20 milliseconds so we need
	// to save the following :(
	setTimeout(AjxCallback.simpleClosure(this._editWordHandler2, this, fixall, spanEl, ev), 20);
};
ZmHtmlEditor.prototype._editWordHandler2 = function(fixall, spanEl, ev) {
	ev = DwtUiEvent.getEvent(ev);
	var evType = ev.type;
	var evKeyCode = ev.keyCode;
	var evCtrlKey = ev.ctrlKey;
	var input = DwtUiEvent.getTarget(ev);
	var keyEvent = /key/.test(evType);
	var removeInput = true;
	if (/blur/.test(evType) || (keyEvent && DwtKeyEvent.IS_RETURN[evKeyCode])) {
		if (evCtrlKey)
			fixall =! fixall;
		var orig = AjxUtil.getInnerText(spanEl);
		var spanEls = fixall ? this._spellCheck.wordIds[orig] : spanEl;
		this._editWordFix(spanEls, input.value);
	} else if (keyEvent && evKeyCode === DwtKeyEvent.KEY_ESCAPE) {
		this._editWordFix(spanEl, AjxUtil.getInnerText(spanEl));
	} else {
		removeInput = false;
	}
	if (removeInput) {
		input.onblur = null;
		input.onkeydown = null;
		if (input.parentNode) {
			input.parentNode.removeChild(input);
		}
	}
	this._handleSpellCheckerEvents(null);
};

ZmHtmlEditor.prototype._editWordFix = function(spanEls, value) {
	spanEls = spanEls instanceof Array ? spanEls : [ spanEls ];
	var doc = this._getEditorDocument();
	for (var i = spanEls.length - 1; i >= 0; i--) {
		var spanEl = spanEls[i];
		if (typeof spanEl == "string") {
			spanEl = doc.getElementById(spanEl);
		}
		if (spanEl) {
			spanEl.innerHTML = value;
		}
	}
};

ZmHtmlEditor.prototype._getParentElement =
function() {
	var ed = this.getEditor();
	if (ed.selection) {
		return ed.selection.getNode();
	} else {
		var doc = this._getIframeDoc();
		return doc ? doc.body : null;
	}
};

ZmHtmlEditor.prototype._handleSpellCheckerEvents =
function(ev) {
	var plainText = this._mode == Dwt.TEXT;
	var p = plainText ? (ev ? DwtUiEvent.getTarget(ev) : null) : this._getParentElement(),
		span, ids, i, suggestions,
		self = this,
		sc = this._spellCheck,
		doc = plainText ? document : this._getIframeDoc(),
		modified = false,
		word = "";
	if (ev && /^span$/i.test(p.tagName) && /ZM-SPELLCHECK/.test(p.className)) {
		// stuff.
		word = p.getAttribute("word");
		// FIXME: not sure this is OK.
		window.status = "Suggestions: " + sc.suggestions[word].join(", ");
		modified = word != AjxUtil.getInnerText(p);
	}

	// <FIXME: there's plenty of room for optimization here>
	ids = sc.spanIds;
	for (i in ids) {
		span = doc.getElementById(i);
		if (span) {
			if (ids[i] != AjxUtil.getInnerText(span) || this._ignoreWords[ids[i]])
				span.className = "ZM-SPELLCHECK-FIXED";
			else if (ids[i] == word)
				span.className = "ZM-SPELLCHECK-MISSPELLED2";
			else
				span.className = "ZM-SPELLCHECK-MISSPELLED";
		}
	}
	// </FIXME>

	// Dismiss the menu if it is present AND:
	//   - we have no event, OR
	//   - it's a mouse(down|up) event, OR
	//   - it's a KEY event AND there's no word under the caret, OR the word was modified.
	// I know, it's ugly.
	if (sc.menu &&
		(!ev || ( /click|mousedown|mouseup|contextmenu/.test(ev.type)
			  || ( /key/.test(ev.type)
			   && (!word || modified) )
			)))
	{
		sc.menu.dispose();
		sc.menu = null;
		window.status = "";
	}
	// but that's even uglier:
	if (ev && word && (suggestions = sc.suggestions[word]) &&
		(/mouseup|contextmenu/i.test(ev.type) ||
		 (plainText && /(click|mousedown|contextmenu)/i.test(ev.type))) && 
		(word == AjxUtil.getInnerText(p) && !this._ignoreWords[word]))
	{
		sc.menu = this._spellCheckCreateMenu(this.parent, 0, suggestions, word, p.id, modified);
		var pos, ms = sc.menu.getSize(), ws = this.shell.getSize();
		if (!plainText) {
			// bug fix #5857 - use Dwt.toWindow instead of Dwt.getLocation so we can turn off dontIncScrollTop
			pos = Dwt.toWindow(document.getElementById(this._iFrameId), 0, 0, null, true);
			var pos2 = Dwt.toWindow(p, 0, 0, null, true);
			pos.x += pos2.x
				- (doc.documentElement.scrollLeft || doc.body.scrollLeft);
			pos.y += pos2.y
				- (doc.documentElement.scrollTop || doc.body.scrollTop);
		} else {
			// bug fix #5857
			pos = Dwt.toWindow(p, 0, 0, null, true);
			var div = document.getElementById(this._spellCheckDivId);
			pos.x -= div.scrollLeft;
			pos.y -= div.scrollTop;
		}
		pos.y += p.offsetHeight;
		// let's make sure we look nice, shall we.
		if (pos.y + ms.y > ws.y)
			pos.y -= ms.y + p.offsetHeight;
		sc.menu.popup(0, pos.x, pos.y);
		ev._stopPropagation = true;
		ev._returnValue = false;
		return false;
	}
};

ZmHtmlEditor.prototype._spellCheckCreateMenu = function(parent, fixall, suggestions, word, spanId, modified) {
    
	var menu = new ZmPopupMenu(parent);
//	menu.dontStealFocus();

	if (modified) {
		var txt = "<b>" + word + "</b>";
		this._spellCheckCreateMenuItem(menu, "orig", {text:txt}, fixall, word, word, spanId);
	}

	if (suggestions.length > 0) {
		for (var i = 0; i < suggestions.length; ++i) {
			this._spellCheckCreateMenuItem(
				menu, "sug-"+i, {text:suggestions[i], className: ""},
				fixall, suggestions[i], word, spanId
			);
		}
		if (!(parent instanceof DwtMenuItem) && this._spellCheck.wordIds[word].length > 1) {
			if (!this._replaceAllFormatter) {
				this._replaceAllFormatter = new AjxMessageFormat(ZmMsg.replaceAllMenu);
			}
			var txt = "<i>"+this._replaceAllFormatter.format(this._spellCheck.wordIds[word].length)+"</i>";
			var item = menu.createMenuItem("fixall", {text:txt});
			var submenu = this._spellCheckCreateMenu(item, 1, suggestions, word, spanId, modified);
			item.setMenu(submenu);
		}
	}
	else {
		var item = this._spellCheckCreateMenuItem(menu, "noop", {text:ZmMsg.noSuggestions}, fixall, "", word, spanId);
		item.setEnabled(false);
		this._spellCheckCreateMenuItem(menu, "clear", {text:"<i>"+ZmMsg.clearText+"</i>" }, fixall, "", word, spanId);
	}

    var plainText = this._mode == Dwt.TEXT;
    if (!fixall || plainText) {
        menu.createSeparator();
    }

	if (plainText) {
		// in plain text mode we want to be able to edit misspelled words
		var txt = fixall ? ZmMsg.editAll : ZmMsg.edit;
		this._spellCheckCreateMenuItem(menu, "edit", {text:txt}, fixall, null, word, spanId);
	}

	if (!fixall) {
		this._spellCheckCreateMenuItem(menu, "ignore", {text:ZmMsg.ignoreWord}, 0, null, word, spanId);
//		this._spellCheckCreateMenuItem(menu, "ignore", {text:ZmMsg.ignoreWordAll}, 1, null, word, spanId);
	}

	if (!fixall && appCtxt.get(ZmSetting.SPELL_CHECK_ADD_WORD_ENABLED)) {
		this._spellCheckCreateMenuItem(menu, "add", {text:ZmMsg.addWord}, fixall, null, word, spanId);
	}

	return menu;
};

ZmHtmlEditor.prototype._spellCheckCreateMenuItem =
function(menu, id, params, fixall, value, word, spanId, listener) {
	if (params.className == null) {
		params.className = "ZMenuItem ZmSpellMenuItem";
	}
	var item = menu.createMenuItem(id, params);
	item.setData("fixall", fixall);
	item.setData("value", value);
	item.setData("orig", word);
	item.setData("spanId", spanId);
	item.addSelectionListener(listener || this._spellCheckSuggestionListenerObj);
	return item;
};

ZmHtmlEditor.prototype.discardMisspelledWords =
function(keepModeDiv) {
	if (!this._spellCheck) { return; }

    var size = this.getSize();
	if (this._mode == Dwt.HTML) {
		var doc = this._getIframeDoc();
		doc.body.style.display = "none";

		var p = null;
		var spanIds = this._spellCheck.spanIds;
		for (var i in spanIds) {
			var span = doc.getElementById(i);
			if (!span) continue;

			p = span.parentNode;
			while (span.firstChild) {
				p.insertBefore(span.firstChild, span);
			}
			p.removeChild(span);
		}

		if (!AjxEnv.isIE) {
			doc.body.normalize(); // IE crashes here.
		} else {
			doc.body.innerHTML = doc.body.innerHTML; // WTF.
		}

		// remove the spell check styles
		p = doc.getElementById("ZM-SPELLCHECK-STYLE");
		if (p) {
			p.parentNode.removeChild(p);
		}

		doc.body.style.display = "";
		this._unregisterEditorEventHandler(doc, "contextmenu");
        size.y = size.y - (keepModeDiv ? 0 : 2);
	} else if (this._spellCheckDivId != null) {
		var div = document.getElementById(this._spellCheckDivId);
		var scrollTop = div.scrollTop;
		var textArea = document.getElementById(this._textAreaId);
		// bug: 41760 - HACK. Convert the nbsps back to spaces since Gecko seems
		// to return control characters for HTML entities.
		if (AjxEnv.isGeckoBased) {
			div.innerHTML = AjxStringUtil.htmlDecode(div.innerHTML, true);
		}
		textArea.value = AjxUtil.getInnerText(div);

		// avoid mem. leaks, hopefully
		div.onclick = null;
		div.oncontextmenu = null;
		div.onmousedown = null;
		div.parentNode.removeChild(div);
		textArea.style.display = "";
		textArea.scrollTop = scrollTop;
        size.y = size.y + (keepModeDiv ? 2 : 0);
	}

	this._spellCheckDivId = this._spellCheck = null;
	window.status = "";

	if (!keepModeDiv) {
		this._spellCheckHideModeDiv();
	}

	if (this.onExitSpellChecker) {
		this.onExitSpellChecker.run();
	}
    this._resetSize();
};

ZmHtmlEditor.prototype._spellCheckShowModeDiv =
function() {
	var size = this.getSize();

	if (!this._spellCheckModeDivId) {
		var div = document.createElement("div");
		div.className = "SpellCheckModeDiv";
		div.id = this._spellCheckModeDivId = Dwt.getNextId();
		var html = new Array();
		var i = 0;
		html[i++] = "<table role='presentation' border=0 cellpadding=0 cellspacing=0><tr><td style='width:25'>";
		html[i++] = AjxImg.getImageHtml("SpellCheck");
		html[i++] = "</td><td style='white-space:nowrap'><span class='SpellCheckLink'>";
		html[i++] = ZmMsg.resumeEditing;
		html[i++] = "</span> | <span class='SpellCheckLink'>";
		html[i++] = ZmMsg.checkAgain;
		html[i++] = "</span></td></tr></table>";
		div.innerHTML = html.join("");

		//var editable = document.getElementById((this._spellCheckDivId || this.getBodyFieldId()));
		//editable.parentNode.insertBefore(div, editable);
		var container = this.getHtmlElement();
		container.insertBefore(div, container.firstChild);

		var el = div.getElementsByTagName("span");
		Dwt.associateElementWithObject(el[0], this);
		Dwt.setHandler(el[0], "onclick", ZmHtmlEditor._spellCheckResumeEditing);
		Dwt.associateElementWithObject(el[1], this);
		Dwt.setHandler(el[1], "onclick", ZmHtmlEditor._spellCheckAgain);
	}
	else {
		document.getElementById(this._spellCheckModeDivId).style.display = "";
	}
    this._resetSize();
};

ZmHtmlEditor._spellCheckResumeEditing =
function() {
	var editor = Dwt.getObjectFromElement(this);
	editor.discardMisspelledWords();
    editor.focus();
};

ZmHtmlEditor._spellCheckAgain =
function() {
    Dwt.getObjectFromElement(this).spellCheck(null, true);
};


ZmHtmlEditor.prototype._spellCheckHideModeDiv =
function() {
	var size = this.getSize();
	if (this._spellCheckModeDivId) {
		document.getElementById(this._spellCheckModeDivId).style.display = "none";
	}
    this._resetSize();
};

ZmHtmlEditor.prototype.highlightMisspelledWords =
function(words, keepModeDiv) {
	this.discardMisspelledWords(keepModeDiv);

	var word, style, doc, body, self = this,
		spanIds     = {},
		wordIds     = {},
		regexp      = [ "([^A-Za-z0-9']|^)(" ],
		suggestions = {};

	// preparations: initialize some variables that we then save in
	// this._spellCheck (the current spell checker context).
	for (var i = 0; i < words.length; ++i) {
		word = words[i].word;
		if (!suggestions[word]) {
			i && regexp.push("|");
			regexp.push(word);
			var a = words[i].suggestions.split(/\s*,\s*/);
			if (!a[a.length-1])
				a.pop();
			suggestions[word] = a;
			if (suggestions[word].length > 5)
				suggestions[word].length = 5;
		}
	}
	regexp.push(")([^A-Za-z0-9']|$)");
	regexp = new RegExp(regexp.join(""), "gm");

	function hiliteWords(text, textWhiteSpace) {
		text = textWhiteSpace
			? AjxStringUtil.convertToHtml(text)
			: AjxStringUtil.htmlEncode(text);

		var m;

		regexp.lastIndex = 0;
		while (m = regexp.exec(text)) {
			var str = m[0];
			var prefix = m[1];
			var word = m[2];
			var suffix = m[3];

			var id = Dwt.getNextId();
			spanIds[id] = word;
			if (!wordIds[word])
				wordIds[word] = [];
			wordIds[word].push(id);

			var repl = [
				prefix,
				'<span word="',
				word, '" id="', id, '" class="ZM-SPELLCHECK-MISSPELLED">',
				word, '</span>',
				suffix
				].join("");
			text = [
				text.substr(0, m.index),
				repl,
				text.substr(m.index + str.length)
			].join("");

			// All this crap necessary because the suffix
			// must be taken into account at the next
			// match and JS regexps don't have look-ahead
			// constructs (except \b, which sucks).  Oh well.
			regexp.lastIndex = m.index + repl.length - suffix.length;
		}
		return text;
	};

	var doc;

	// having the data, this function will parse the DOM and replace
	// occurrences of the misspelled words with <span
	// class="ZM-SPELLCHECK-MISSPELLED">word</span>
	rec = function(node) {
		switch (node.nodeType) {
			case 1: /* ELEMENT */
				for (var i = node.firstChild; i; i = rec(i)) {}
				node = node.nextSibling;
				break;
			case 3: /* TEXT */
				if (!/[^\s\xA0]/.test(node.data)) {
					node = node.nextSibling;
					break;
				}
				// for correct handling of whitespace we should
				// not mess ourselves with leading/trailing
				// whitespace, thus we save it in 2 text nodes.
				var a = null, b = null;

				var result = /^[\s\xA0]+/.exec(node.data);
				if (result) {
					// a will contain the leading space
					a = node;
					node = node.splitText(result[0].length);
				}
				result = /[\s\xA0]+$/.exec(node.data);
				if (result) {
					// and b will contain the trailing space
					b = node.splitText(node.data.length - result[0].length);
				}

				var text = hiliteWords(node.data, false);
				text = text.replace(/^ +/, "&nbsp;").replace(/ +$/, "&nbsp;");
				var div = doc.createElement("div");
				div.innerHTML = text;

				// restore whitespace now
				if (a) {
					div.insertBefore(a, div.firstChild);
				}
				if (b) {
					div.appendChild(b);
				}

				var p = node.parentNode;
				while (div.firstChild) {
					p.insertBefore(div.firstChild, node);
				}
				div = node.nextSibling;
				p.removeChild(node);
				node = div;
				break;
			default :
				node = node.nextSibling;
		}
		return node;
	};

	if (this._mode == Dwt.HTML) {
		// HTML mode; See the "else" branch for the TEXT mode--code differs
		// quite a lot.  We should probably implement separate functions as
		// this already becomes long.

		doc = this._getIframeDoc();
		body = doc.body;

		// load the spell check styles, if not already there.
		this._loadExternalStyle("/css/spellcheck.css");

		body.style.display = "none";	// seems to have a good impact on speed,
										// since we may modify a lot of the DOM
		if (!AjxEnv.isIE) {
			body.normalize();
		} else {
			body.innerHTML = body.innerHTML;
		}
		rec(body);
		if (!AjxEnv.isIE) {
			body.normalize();
		} else {
			body.innerHTML = body.innerHTML;
		}
		body.style.display = ""; // redisplay the body
	}
	else { // TEXT mode
		var textArea = document.getElementById(this._textAreaId);
		var scrollTop = textArea.scrollTop;
		var size = Dwt.getSize(textArea);
		textArea.style.display = "none";
		var div = document.createElement("div");
		div.className = "TextSpellChecker";
		this._spellCheckDivId = div.id = Dwt.getNextId();
		div.style.overflow = "auto";
		if (!AjxEnv.isIE) {
			// FIXME: we substract borders/padding here.  this sucks.
			size.x -= 4;
			size.y -= 6;
		}
		div.style.height = size.y + "px";

		div.innerHTML = AjxStringUtil.convertToHtml(this.getContent());
		doc = document;
		rec(div);

		textArea.parentNode.insertBefore(div, textArea);
		div.scrollTop = scrollTop;
		div.oncontextmenu = div.onclick
			= function(ev) { self._handleSpellCheckerEvents(ev || window.event); };
	}

	this._spellCheckShowModeDiv();

	// save the spell checker context
	this._spellCheck = {
		suggestions: suggestions,
		spanIds: spanIds,
		wordIds: wordIds
	};
};

/**
 * Returns true if editor content is spell checked
 */
ZmHtmlEditor.prototype.isSpellCheckMode = function() {
    return Boolean( this._spellCheck );
};

ZmHtmlEditor.prototype._loadExternalStyle =
function(path) {
	var doc = this._getIframeDoc();
	// check if already loaded
	var style = doc.getElementById(path);
	if (!style) {
		style = doc.createElement("link");
		style.id = path;
		style.rel = "stylesheet";
		style.type = "text/css";
		var style_url = appContextPath + path + "?v=" + cacheKillerVersion;
		if (AjxEnv.isGeckoBased || AjxEnv.isSafari) {
			style_url = document.baseURI.replace(
					/^(https?:\x2f\x2f[^\x2f]+).*$/, "$1") + style_url;
		}
		style.href = style_url;
		var head = doc.getElementsByTagName("head")[0];
		if (!head) {
			head = doc.createElement("head");
			var docEl = doc.documentElement;
			if (docEl) {
				docEl.insertBefore(head, docEl.firstChild);
			}
		}
		head.appendChild(style);
	}
};

ZmHtmlEditor.prototype._registerEditorEventHandler = function(iFrameDoc, name) {

	if (iFrameDoc.attachEvent) {
		iFrameDoc.attachEvent("on" + name, this.__eventClosure);
	}
    else if (iFrameDoc.addEventListener) {
		iFrameDoc.addEventListener(name, this.__eventClosure, true);
	}
};

ZmHtmlEditor.prototype._unregisterEditorEventHandler = function(iFrameDoc, name) {

	if (iFrameDoc.detachEvent) {
		iFrameDoc.detachEvent("on" + name, this.__eventClosure);
	}
    else if (iFrameDoc.removeEventListener) {
		iFrameDoc.removeEventListener(name, this.__eventClosure, true);
	}
};

ZmHtmlEditor.prototype.__eventClosure =
function(ev) {
	this._handleEditorEvent(AjxEnv.isIE ? this._getIframeWin().event : ev);
	return tinymce.dom.Event.cancel(ev);
};


ZmHtmlEditor.prototype._handleEditorEvent =
function(ev) {
	var ed = this.getEditor();
	var retVal = true;

	var self = this;

	var target = ev.srcElement || ev.target; //in FF we get ev.target and not ev.srcElement.
	if (this._spellCheck && target && target.id in this._spellCheck.spanIds) {
		var dw;
		// This probably sucks.
		if (/mouse|context|click|select/i.test(ev.type)) {
			dw = new DwtMouseEvent(true);
		} else {
			dw = new DwtUiEvent(true);
		}
		dw.setFromDhtmlEvent(ev);
		this._TIMER_spell = setTimeout(function() {
			self._handleSpellCheckerEvents(dw);
			this._TIMER_spell = null;
		}, 100);
		ev.stopImmediatePropagation();
		ev.stopPropagation();
		ev.preventDefault();
		return tinymce.dom.Event.cancel(ev);
	}

	return retVal;
};

ZmHtmlEditor.prototype._getSelection =
function() {
	if (AjxEnv.isIE) {
		return this._getIframeDoc().selection;
	} else {
		return this._getIframeWin().getSelection();
	}
};

/*
 * Returns toolbar row of tinymce
 *
 *  @param {Number}	Toolbar Row Number 1,2
 *  @param {object}	tinymce editor
 *  @return	{Toolbar HTML Element}
 */
ZmHtmlEditor.prototype.getToolbar =
function(number, editor) {
    var controlManager,
        toolbar;

    editor = editor || this.getEditor();
    if (editor && number) {
        controlManager = editor.controlManager;
        if (controlManager) {
            toolbar = controlManager.get("toolbar"+number);
            if (toolbar && toolbar.id) {
                return document.getElementById(toolbar.id);
            }
        }
    }
};

/*
 *  Returns toolbar button of tinymce
 *
 *  @param {String}	button name
 *  @param {object}	tinymce editor
 *  @return	{Toolbar Button HTML Element}
 */
ZmHtmlEditor.prototype.getToolbarButton =
function(buttonName, editor) {
    var controlManager,
        toolbarButton;

    if (editor && buttonName) {
        controlManager = editor.controlManager;
        if (controlManager) {
            toolbarButton = controlManager.get(buttonName);
            if (toolbarButton && toolbarButton.id) {
                return document.getElementById(toolbarButton.id);
            }
        }
    }
};

/*
 *  Inserting image for signature
 */
ZmHtmlEditor.prototype.insertImageDoc =
function(file) {
    var src = file.rest;
    if (!src) { return; }
    var path = appCtxt.get(ZmSetting.REST_URL) + ZmFolder.SEP;
    var dfsrc = file.docpath;
    if (dfsrc && dfsrc.indexOf("doc:") == 0) {
        var url = [path, dfsrc.substring(4)].join('');
        src = AjxStringUtil.fixCrossDomainReference(url, false, true);
    }
    this.insertImage(src, null, null, null, dfsrc);
};

/*
 *  Insert image callback
 */
ZmHtmlEditor.prototype._imageUploaded = function(folder, fileNames, files) {

	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		var path = appCtxt.get(ZmSetting.REST_URL) + ZmFolder.SEP;
		var docPath = folder.getRestUrl() + ZmFolder.SEP + file.name;
		file.docpath = ["doc:", docPath.substr(docPath.indexOf(path) + path.length)].join("");
		file.rest = folder.getRestUrl() + ZmFolder.SEP + AjxStringUtil.urlComponentEncode(file.name);

		this.insertImageDoc(file);
	}

	//note - it's always one file so far even though the code above support a more than one item array.
	//toast so the user understands uploading an image result in it being in the briefcase.
	appCtxt.setStatusMsg(ZmMsg.imageUploadedToBriefcase);

};

/**
 * This will be fired before every popup open
 *
 * @param {windowManager} tinymce window manager for popups
 * @param {popupWindow}	contains tinymce popup info or popup DOM Window
 *
 */
ZmHtmlEditor.onPopupOpen = function(windowManager, popupWindow) {
    if (!popupWindow) {
        return;
    }
    if (popupWindow.resizable) {
        popupWindow.resizable = 0;
    }

    var popupIframe = popupWindow.frameElement,
        popupIframeLoad;

    if (popupIframe && popupIframe.src && popupIframe.src.match("/table.htm")) {//Table dialog
        popupIframeLoad = function(popupWindow, popupIframe) {
            var doc,align,width;
            if (popupWindow.action === "insert") {//Insert Table Action
                doc = popupWindow.document;
                if (doc) {
                    align = doc.getElementById("align");
                    width = doc.getElementById("width");
                    align && (align.value = "center");
                    width && (width.value = "90%");
                }
            }
            if (this._popupIframeLoad) {
                popupIframe.detachEvent("onload", this._popupIframeLoad);
                delete this._popupIframeLoad;
            }
            else {
                popupIframe.onload = null;
            }
        };

        if (popupIframe.attachEvent) {
            this._popupIframeLoad = popupIframeLoad.bind(this, popupWindow, popupIframe);
            popupIframe.attachEvent("onload", this._popupIframeLoad);
        }
        else {
            popupIframe.onload = popupIframeLoad.bind(this, popupWindow, popupIframe);
        }
    }
};

/**
 * Returns true if editor content is modified
 */
ZmHtmlEditor.prototype.isDirty = function(){
    if( this._mode === Dwt.HTML ){
        var editor = this.getEditor();
        if (editor) {
            return editor.isDirty();
        }
    }
    return false;
};

/**
 * Mark the editor content as unmodified; e.g. as freshly saved.
 */
ZmHtmlEditor.prototype.clearDirty = function(){
	var ed = this.getEditor();
    if (ed) {
        this.getEditor().isNotDirty = true;
    }
};

/**
 * Listen for change in fontfamily, fontsize, fontcolor, direction and showing compose direction buttons preference and update the corresponding one.
 */
ZmHtmlEditor.prototype._settingChangeListener = function(ev) {
    if (ev.type != ZmEvent.S_SETTING) { return; }

    var id = ev.source.id,
        editor,
        body,
        textArea,
        direction,
        showDirectionButtons,
        ltrButton;

    if (id === ZmSetting.COMPOSE_INIT_DIRECTION) {
        textArea = this.getContentField();
        direction = appCtxt.get(ZmSetting.COMPOSE_INIT_DIRECTION);
        if (direction === ZmSetting.RTL) {
            textArea.setAttribute("dir", ZmSetting.RTL);
        }
        else{
            textArea.removeAttribute("dir");
        }
    }

    editor = this.getEditor();
    body = editor ? editor.getBody() : null;
    if(!body)
        return;

    if (id === ZmSetting.COMPOSE_INIT_FONT_FAMILY) {
        body.style.fontFamily = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_FAMILY);
    }
    else if (id === ZmSetting.COMPOSE_INIT_FONT_SIZE) {
        body.style.fontSize = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_SIZE);
    }
    else if (id === ZmSetting.COMPOSE_INIT_FONT_COLOR) {
        body.style.color = appCtxt.get(ZmSetting.COMPOSE_INIT_FONT_COLOR);
    }
    else if (id === ZmSetting.SHOW_COMPOSE_DIRECTION_BUTTONS) {
        showDirectionButtons = appCtxt.get(ZmSetting.SHOW_COMPOSE_DIRECTION_BUTTONS);
        ltrButton = this.getToolbarButton("ltr", editor).parentNode;
        if (ltrButton) {
            Dwt.setVisible(ltrButton, showDirectionButtons);
            Dwt.setVisible(ltrButton.previousSibling, showDirectionButtons);
        }
        Dwt.setVisible(this.getToolbarButton("rtl", editor).parentNode, showDirectionButtons);
    }
    else if (id === ZmSetting.COMPOSE_INIT_DIRECTION) {
        if (direction === ZmSetting.RTL) {
            body.dir = ZmSetting.RTL;
        }
        else{
            body.removeAttribute("dir");
        }
    }
    editor.nodeChanged && editor.nodeChanged();//update the toolbar state
};

/*
 * TinyMCE paste Callback function to execute after the contents has been converted into a DOM structure.
 */
ZmHtmlEditor.prototype.pastePostProcess =
function(ev) {
	if (!ev || !ev.node || !ev.target || ev.node.children.length === 0) {
		return;
	}

	var editor = ev.target, tables = editor.dom.select("TABLE", ev.node);

	// Add a border to all tables in the pasted content
	for (var i = 0; i < tables.length; i++) {
		var table = tables[i];
		// set the table border as 1 if it is 0 or unset
		if (table && (table.border === "0" || table.border === "")) {
			table.border = 1;
		}
	}

	// does any child have a 'float' style?
	var hasFloats = editor.dom.select('*', ev.node).some(function(node) {
		return node.style['float'];
	});

	// If the pasted content contains a table then append a DIV so
	// that focus can be set outside the table, and to prevent any floats from
	// overlapping other elements
	if (hasFloats || tables.length > 0) {
		var div = editor.getDoc().createElement("DIV");
		div.style.clear = 'both';
		ev.node.appendChild(div);
	}

	// Find all paragraphs in the pasted content and set the margin to 0
	var paragraphs = editor.dom.select("p", ev.node);

	for (var i = 0; i < paragraphs.length; i++) {
		editor.dom.setStyle(paragraphs[i], "margin", "0");
	}
};

ZmHtmlEditor.prototype._getTabGroup = function() {
	if (!this.__tabGroup) {
		this.__tabGroup = new DwtTabGroup(this.toString());
	}
	return this.__tabGroup;
};

ZmHtmlEditor.prototype.getTabGroupMember = function() {
	var tabGroup = this._getTabGroup();
	this._setupTabGroup(tabGroup);

	return tabGroup;
};

/**
 * Set up the editor tab group. This is done by having a separate tab group for each compose mode: one for HTML, one
 * for TEXT. The current one will be attached to the main tab group. We rebuild the tab group each time to avoid all kinds of issues
 *
 * @private
 */
ZmHtmlEditor.prototype._setupTabGroup = function(mainTabGroup) {

	var mode = this.getMode();
	mainTabGroup = mainTabGroup || this._getTabGroup();

	mainTabGroup.removeAllMembers();
	var modeTabGroup = new DwtTabGroup(this.toString() + '-' + mode);
	if (mode === Dwt.HTML) {
		// tab group for HTML has first toolbar button and IFRAME
		var firstbutton = this.__getEditorControl('listbox', 'Font Family');
		if (firstbutton) {
			modeTabGroup.addMember(firstbutton.getEl());
		}
		var iframe = this._getIframeDoc();
		if (iframe) { //iframe not avail first time this is called. But it's fixed subsequently
			modeTabGroup.addMember(iframe.body);
		}
	}
	else {
		// tab group for TEXT has the TEXTAREA
		modeTabGroup.addMember(this.getContentField());
	}
	mainTabGroup.addMember(modeTabGroup);
};

// Returns true if the user is inserting a Tab into the editor (rather than moving focus)
ZmHtmlEditor.isEditorTab = function(ev) {

    return appCtxt.get(ZmSetting.TAB_IN_EDITOR) && ev && ev.keyCode === DwtKeyEvent.KEY_TAB && !ev.shiftKey && !DwtKeyMapMgr.hasModifier(ev);
};
}
if (AjxPackage.define("zimbraMail.share.view.ZmDragAndDrop")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Drag and Drop Event handler
 *
 * @author Hem Aravind
 *
 * @private
 */

ZmDragAndDrop = function(parent) {
    this._view = parent;
    this._controller = parent._controller;
    this._element = parent.getHtmlElement();
    this._initialize();
};

ZmDragAndDrop.prototype.constructor = ZmDragAndDrop;

/**
* @return	{boolean}	true if drag and drop is supported
*/
ZmDragAndDrop.isSupported = function() {

    //Refer https://github.com/Modernizr/Modernizr/issues/57#issuecomment-4187079 Drag and Drop support
    var div = document.createElement('div'),
        dragSupport = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)),
        isSupported = dragSupport && !!window.FileReader;

    if (AjxEnv.isSafari4up && dragSupport) {
        isSupported = true;
    }

    ZmDragAndDrop.isSupported = function() {
        return isSupported;
    };

    if (isSupported) {
        ZmDragAndDrop.MESSAGE_SIZE_LIMIT = appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT);
        ZmDragAndDrop.ATTACHMENT_URL = appCtxt.get(ZmSetting.CSFE_ATTACHMENT_UPLOAD_URI)+"?fmt=extended,raw";
    }

    return ZmDragAndDrop.isSupported();
};

/**
 * @return	{boolean} 	true if attachment size exceeded and shows the warning dialog
 */
ZmDragAndDrop.isAttachmentSizeExceeded = function(files, showDialog) {
    var j,
        filesLength,
		size,
        file;

    if (!files) {
        return false;
    }

    for (j = 0 , size = 0, filesLength = files.length; j < filesLength; j++) {
        file = files[j];
        if (file) {
			//Check the total size of the files we upload this time (we don't know the previously uploaded files total size so we do the best we can).
			//NOTE - we compare to the MTA message size limit since there's no limit on specific attachments.
            size += file.size || file.fileSize /*Safari*/ || 0;
            //Showing Error dialog if the attachment size is exceeded
            if ((-1 /* means unlimited */ != ZmDragAndDrop.MESSAGE_SIZE_LIMIT) &&
                (size > ZmDragAndDrop.MESSAGE_SIZE_LIMIT)) {
                if (showDialog) {
                    var msgDlg = appCtxt.getMsgDialog();
                    var errorMsg = AjxMessageFormat.format(ZmMsg.attachmentSizeError, AjxUtil.formatSize(ZmDragAndDrop.MESSAGE_SIZE_LIMIT));
                    msgDlg.setMessage(errorMsg, DwtMessageDialog.WARNING_STYLE);
                    msgDlg.popup();
                }
                return true;
            }
        }
    }
    return false;
};

ZmDragAndDrop.prototype._initialize = function () {
	if (!ZmDragAndDrop.isSupported() && this._element && this._element.id) {
		var tooltip = document.getElementById(this._element.id + ZmId.CMP_DND_TOOLTIP);
		if (tooltip) {
			tooltip.style.display = "none";
			tooltip.innerHTML = "";
		}
	}
    if (!this._view || !this._controller || !this._element || !ZmDragAndDrop.isSupported()) {
        return;
    }
    this._addHandlers(this._element);
    this._dndTooltipEl = document.getElementById(this._element.id + ZmId.CMP_DND_TOOLTIP);
    this._setToolTip();
};

ZmDragAndDrop.prototype._addHandlers = function(el) {
    Dwt.setHandler(el,"ondragover",this._onDragOver.bind(this));
    Dwt.setHandler(el,"ondrop", this._onDrop.bind(this));
};

ZmDragAndDrop.prototype._setToolTip = function(){
    if (!this._dndTooltipEl) {
        return;
    }
    if (this._view._attachCount > 0 || this._dndFilesLength > 0){
        this._dndTooltipEl.style.display = "none";
        this._dndTooltipEl.innerHTML = "";
    } else {
        this._dndTooltipEl.innerHTML = ZmMsg.dndTooltip;
        this._dndTooltipEl.style.display = "block";
    }
};

ZmDragAndDrop.prototype._onDragOver = function(ev) {
    ZmDragAndDrop._stopEvent(ev);
};

ZmDragAndDrop.prototype._onDrop = function(ev, isEditorDND) {
    var dt,
        files,
        file,
        j,
        filesLength;

    if (!ev || (this._view && this._view._disableAttachments === true) ) {
        return;
    }

    dt = ev.dataTransfer;
    if (!dt) {
        return;
    }

    files = dt.files;
    if (!files || !files.length) {
        return;
    }

    ZmDragAndDrop._stopEvent(ev);

	//just re-use code from the my computer option as it should be exactly the same case from now on.
	this._view._submitMyComputerAttachments(files, null, isEditorDND, ev);
};

ZmDragAndDrop._stopEvent = function(ev) {
	if (!ZmDragAndDrop.containFiles(ev)) {
		return;
	}
	if (ev.preventDefault) {
		ev.preventDefault();
	}
	if (ev.stopPropagation) {
		ev.stopPropagation();
	}
};

ZmDragAndDrop.containFiles =
function(ev, type) {
	var typesArray = ev && ev.dataTransfer && ev.dataTransfer.types;
    if (!typesArray) {
		return false;
	}
	type = type || "Files";
	for (var i = 0; i < typesArray.length; i++) {
		if (typesArray[i] === type) {
			return true;
		}
	}
	return false;
};
}

if (AjxPackage.define("zimbraMail.share.view.dialog.ZmDialog")) {
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
 * This file contains a dialog.
 * 
 */

/**
 * Creates a dialog.
 * @class
 * This class is a base class for miscellaneous organizer-related dialogs. An instance
 * of this class can be re-used to show different overviews.
 *
 * @author Conrad Damon
 *
 * @param {Hash}	params		a hash of parameters
 * @param	{DwtControl}	params.parent		the parent widget
 * @param	{DwtMsgDialog}	params.msgDialog		the message dialog
 * @param	{String}	params.className		the CSS class name
 * @param	{String}	params.title		the dialog title
 * @param	{Array|constant}	params.standardButtons		an array of standard buttons to include. Defaults to {@link DwtDialog.OK_BUTTON} and {@link DwtDialog.CANCEL_BUTTON}.
 * @param	{Array}	params.extraButtons		a list of {@link DwtDialog_ButtonDescriptor} objects describing custom buttons to add to the dialog
 * @param	{DwtControl}	params.view				the dialog contents
 * 
 * @extends	DwtDialog
 */
ZmDialog = function(params) {
	if (arguments.length == 0) { return; }

	DwtDialog.call(this, params);

	if (!params.view) {
		this.setContent(this._contentHtml());
	}

	if (this._button[DwtDialog.OK_BUTTON]) {
		this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
	}

	this._overview = {};
	this._opc = appCtxt.getOverviewController();

	this._baseTabGroupSize = this._tabGroup.size();
};

ZmDialog.prototype = new DwtDialog;
ZmDialog.prototype.constructor = ZmDialog;

ZmDialog.prototype.isZmDialog = true;
ZmDialog.prototype.toString = function() { return "ZmDialog"; };

/**
 * @private
 */
ZmDialog.prototype._contentHtml =
function() {
	return "";
};

/**
 * Sets the view for this dialog.
 * 
 * @param	{DwtComposite}		newView		the view
 * @param	{Boolean}		noReset		if <code>true</code>, do not reset the dialog; <code>false</code> otherwise
 */
ZmDialog.prototype.setView =
function(newView, noReset) {
	this.reset();
	if (newView) {
        var contentDiv = this._getContentDiv();
        var el = newView.getHtmlElement();
		contentDiv.parentNode.replaceChild(el, contentDiv);
		this._contentDiv = el;
	}
};

ZmDialog.prototype.popup =
function() {
	// Bug 38281: for multiuse dialogs, we need to re-add the discretionary
	// tab stops to the base list (the dialog buttons)
	this._tabGroup.__members._array.splice(this._baseTabGroupSize);
	this._tabGroup.addMember(this._getTabGroupMembers());

	DwtDialog.prototype.popup.call(this);
	if (this._focusElement) {
		appCtxt.getKeyboardMgr().grabFocus(this._focusElement);	
	}
};

ZmDialog.prototype.reset =
function() {
	if (this._nameField) {
		this._nameField.value = "";
	}
	DwtDialog.prototype.reset.call(this);
};

/**
 * @private
 */
ZmDialog.prototype._okButtonListener =
function() {
	this.popdown();
};

/**
 * @private
 */
ZmDialog.prototype._setNameField =
function(fieldId) {
	this._nameField = this._focusElement = document.getElementById(fieldId);
	if (this._enterListener) {
		this.addEnterListener(new AjxListener(this, this._enterListener));
	}
};

/**
 * Displays the given list of tree views in an overview, creating it if
 * necessary, and appends the overview to an element in the dialog. Since
 * dialogs may be reused, it is possible that it will display different
 * overviews. That is handled by making sure that only the current overview is
 * visible.
 * 
 * @param params		[hash]				hash of params:
 *        treeIds		[array]				list of tree views to show
 *        omit			[hash]				IDs of organizers to exclude
 *        fieldId		[string]			DOM ID of element that contains overview
 *        overviewId	[string]*			ID for the overview
 *        noRootSelect	[boolean]*			if true, don't make root tree item(s) selectable
 * @param forceSingle	[boolean]*			if true, don't make multi-account overviews
 * @private
 */
ZmDialog.prototype._setOverview =
function(params, forceSingle) {

	// when in multi-account mode, hide the old overview since we don't know
	// whether we want to show an overview container or just a single-account overview.
	if (appCtxt.multiAccounts) {
		var oldOverview = this._opc.getOverviewContainer(this._curOverviewId) ||
						  this._opc.getOverview(this._curOverviewId);

		if (oldOverview) {
			oldOverview.setVisible(false);
		}
	}

	// multi-account uses overview container
	if (appCtxt.multiAccounts && !forceSingle) {
		// use overviewId as the containerId; container will assign overviewId's
		var containerId = this._curOverviewId = params.overviewId;
		var ovContainer = this._opc.getOverviewContainer(containerId);
		if (!ovContainer) {
			var overviewParams = {
				overviewClass:	"dialogOverviewContainer",
				headerClass:	"DwtTreeItem",
				noTooltips:		true,
				treeStyle:		params.treeStyle,
				treeIds:		params.treeIds,
				overviewTrees:	params.overviewTrees,
				omit:			params.omit,
				omitPerAcct:	params.omitPerAcct,
				selectable:		params.selectable
			};
			var containerParams = {
				appName: params.appName,
				containerId: containerId
			};
			ovContainer = this._opc.createOverviewContainer(containerParams, overviewParams);
			ovContainer.setSize(Dwt.DEFAULT, "200");
			document.getElementById(params.fieldId).appendChild(ovContainer.getHtmlElement());
		}

		// make overview container visible
		ovContainer.setVisible(true);

		return ovContainer;
	}

	// single-account overview handling
	var overviewId = this._curOverviewId = params.overviewId;
	var overview = this._opc.getOverview(overviewId);
	if (!overview) {
		var ovParams = {
			overviewId:		overviewId,
			overviewClass:	params.overviewClass || "dialogOverview",
			headerClass:	"DwtTreeItem",
			noTooltips:		true,
			treeStyle:		params.treeStyle,
			dynamicWidth:	params.dynamicWidth,
			treeIds:		params.treeIds,
			account:		((appCtxt.multiAccounts && params.forceSingle) ? appCtxt.getActiveAccount() : (params.account || appCtxt.getActiveAccount())),
			skipImplicit: 	true,
			appName:        params.appName
		};
		overview = this._overview[overviewId] = this._opc.createOverview(ovParams);
		this._renderOverview(overview, params.treeIds, params.omit, params.noRootSelect);
		document.getElementById(params.fieldId).appendChild(overview.getHtmlElement());
	}
	else {
		//this might change between clients so have to update this.
		this._setRootSelection(overview, params.treeIds, params.noRootSelect);
	}

	this._makeOverviewVisible(overviewId);

	return overview;
};

/**
 * @private
 */
ZmDialog.prototype._makeOverviewVisible =
function(overviewId) {
	for (var id in this._overview) {
		this._overview[id].setVisible(id == overviewId);
	}
};

/**
 * Renders the tree views in the overview, and makes the header items
 * selectable (since they can generally be targets of whatever action the dialog
 * is facilitating).
 * 
 * @param overview		[ZmOverview]		the overview
 * @param treeIds		[array]				list of tree views to show
 * @param omit			[hash]*				IDs of organizers to exclude
 * @param noRootSelect	[boolean]*			if true, don't make root tree item(s) selectable
 * @private
 */
ZmDialog.prototype._renderOverview =
function(overview, treeIds, omit, noRootSelect) {
	overview.set(treeIds, omit);
	this._setRootSelection(overview, treeIds, noRootSelect);
};

ZmDialog.prototype._setRootSelection =
function(overview, treeIds, noRootSelect) {
	for (var i = 0; i < treeIds.length; i++) {
		var treeView = overview.getTreeView(treeIds[i]);
		var hi = treeView && treeView.getHeaderItem();
		if (hi) {
			hi.enableSelection(!noRootSelect);
		}
	}
};


/**
 * @private
 */
ZmDialog.prototype._getOverview =
function() {
	return this._overview[this._curOverviewId];
};

/**
 * @private
 */
ZmDialog.prototype._getInputFields =
function() {
	return (this._nameField) ? [this._nameField] : null;
};

/**
 * @private
 */
ZmDialog.prototype._showError =
function(msg, loc) {
	var nLoc = loc || (new DwtPoint(this.getLocation().x + 50, this.getLocation().y + 100));
	var msgDialog = appCtxt.getMsgDialog();

	msgDialog.reset();
    msgDialog.setMessage(AjxStringUtil.htmlEncode(msg), DwtMessageDialog.CRITICAL_STYLE);
	msgDialog.popup(nLoc);
};

/**
 * @private
 */
ZmDialog.prototype._getTabGroupMembers =
function() {
	return this._nameField ? [ this._nameField ] : [];
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmAttachDialog")) {
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
 * @overview
 */

/**
 * Creates an attachment dialog.
 * @class
 * This class represents an attachment dialog.
 * 
 * @param	{DwtControl}	shell		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmAttachDialog = function(shell, className) {

	className = className || "ZmAttachDialog";
	DwtDialog.call(this, {parent:shell, className:className, title:ZmMsg.attachFile});

	// Initialize
	this._createBaseHtml();

	// Ok and Cancel Actions
	this._defaultCancelCallback = new AjxCallback(this, this._defaultCancelListener);
	this._cancelListener = null;

	this._defaultOkCallback = new AjxCallback(this, this._defaultOkListener);
	this._okListener = null;

	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, function() {
		this._cancelButtonListener();
	}));

	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, function() {
		this._okButtonListener();
	}));


	var okButton = this.getButton(DwtDialog.OK_BUTTON);
	okButton.setText(ZmMsg.attach);

};

ZmAttachDialog.prototype = new DwtDialog;
ZmAttachDialog.prototype.constructor = ZmAttachDialog;

/**
 * Defines the "briefcase" tab key.
 */
ZmAttachDialog.TABKEY_BRIEFCASE		= "BRIEFCASE";

//Listeners

/**
 * Adds a cancel button listener.
 * 
 * @param	{constant}		tabKey		the tab key (see <code>TABKEY_</code> constants)
 * @param	{AjxListener|AjxCallback}	cancelCallbackOrListener		the listener
 */
ZmAttachDialog.prototype.setCancelListener =
function(cancelCallbackOrListener) {
	if (cancelCallbackOrListener &&
		(cancelCallbackOrListener instanceof AjxListener ||
		 cancelCallbackOrListener instanceof AjxCallback))
	{
		this._cancelListener = cancelCallbackOrListener;
	}
};


ZmAttachDialog.prototype._defaultCancelListener =
function() {
	this.popdown();
};

ZmAttachDialog.prototype._cancelButtonListener =
function() {
	if (this._cancelListener) {
		this._cancelListener.run();
	} else {
		this._defaultCancelCallback.run();
	}
};

/**
 * Adds a OK button listener.
 * 
 * @param	{constant}		tabKey		the tab key (see <code>TABKEY_</code> constants)
 * @param	{AjxListener|AjxCallback}	cancelCallbackOrListener		the listener
 */
ZmAttachDialog.prototype.setOkListener =
function(okCallbackOrListener) {
	if (okCallbackOrListener &&
		(okCallbackOrListener instanceof AjxListener ||
		 okCallbackOrListener instanceof AjxCallback))
	{
		this._okListener = okCallbackOrListener;
	}
};

ZmAttachDialog.prototype._defaultOkListener =
function() {
	this.popdown();
};

ZmAttachDialog.prototype._okButtonListener =
function() {

    var okButton = this.getButton(DwtDialog.OK_BUTTON);
    okButton.setEnabled(false);

	if (this._okListener) {
		this._okListener.run(this);
	} else {
		this._defaultOkCallback.run();
	}
    
     okButton.setEnabled(true);
};

// Create HTML Container
ZmAttachDialog.prototype._createBaseHtml =
function() {
	this._baseContainerView = new DwtComposite({parent:this, className:"ZmAttachDialog-container"});
	this._initializeTabView(this._baseContainerView);
	this.setView(this._baseContainerView);
};

ZmAttachDialog.prototype._initializeTabView =
function(view) {
    this._setAttachmentSizeSection(view);
	this._setInlineOptionSection(view);
    this._setMsgSection(view);
	this._setFooterSection(view);
};

/**
 * @private
 */
ZmAttachDialog.prototype.stateChangeListener =
function(ev) {
	// Reset Inline Options Here
	this._resetInlineOption();
};


ZmAttachDialog.prototype._setAttachmentSizeSection =
function(view) {
	var div = document.createElement("div");
	div.className = "ZmAttachDialog-note";
    var attSize = AjxUtil.formatSize(appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT) || 0, true)
	div.innerHTML = AjxMessageFormat.format(ZmMsg.attachmentLimitMsg, attSize);
	view.getHtmlElement().appendChild(div);
};

ZmAttachDialog.prototype._setMsgSection =
function(view) {
	var div = document.createElement("div");
	div.className = "ZmAttachDialog-footer";
	div.id = Dwt.getNextId();
	view.getHtmlElement().appendChild(div);
	this._msgDiv = document.getElementById(div.id);
};

ZmAttachDialog.prototype._setFooterSection =
function(view) {
	var div = document.createElement("div");
	div.className = "ZmAttachDialog-footer";
	div.id = Dwt.getNextId();
	view.getHtmlElement().appendChild(div);

	this._footer = document.getElementById(div.id);
};

/**
 * Sets the footer content.
 * 
 * @param	{String}	html		the HTML footer content
 */
ZmAttachDialog.prototype.setFooter =
function(html) {
	if (typeof html == "string") {
		this._footer.innerHTML = html;
	} else {
		this._footer.appendChild(html);
	}
};

//Called when AjxEnv.supportsHTML5File is false

ZmAttachDialog.prototype.submitAttachmentFile =
function(view) {
    this.upload(this._uploadCallback, view.uploadForm);
};

ZmAttachDialog.prototype.cancelUploadFiles =
function() {
	// Fix this, as this needs feature request like AjxPost.getRequestId()
	// We need to cancel actual request, but for now just close the window
	this._cancelUpload = true;
	this._defaultCancelListener();
};

ZmAttachDialog.prototype.setUploadCallback =
function(callback) {
	this._uploadCallback = callback;
};

ZmAttachDialog.prototype.getUploadCallback =
function() {
	return this._uploadCallback;
};

/**
 * Uploads the attachments.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{Object}			uploadForm		the upload form
 */
ZmAttachDialog.prototype.upload =
function(callback, uploadForm) {
	if (!callback) {
		callback = false;
	}
	this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);
	this.setFooter(ZmMsg.attachingFiles);
	this._cancelUpload = false;
	this._processUpload(callback, uploadForm);
};

ZmAttachDialog.prototype._processUpload =
function(callback, uploadForm) {
	var ajxCallback = new AjxCallback(this, this._uploadDoneCallback, [callback]);
	var um = appCtxt.getUploadManager();
	window._uploadManager = um;

	try {
		um.execute(ajxCallback, uploadForm);
	} catch (ex) {
		ajxCallback.run();
	}
};

ZmAttachDialog.prototype._uploadDoneCallback =
function(callback, status, attId) {
	if (this._cancelUpload) { return; }

	this.setButtonEnabled(DwtDialog.CANCEL_BUTTON, true);

	if (status == AjxPost.SC_OK) {
		this.setFooter(ZmMsg.attachingFilesDone);
		if (callback) {
			callback.run(status, attId);
		}
	} else if (status == AjxPost.SC_UNAUTHORIZED) {
		// auth failed during att upload - let user relogin, continue with compose action
		var ex = new AjxException("401 response during attachment upload", ZmCsfeException.SVC_AUTH_EXPIRED);
		appCtxt.getAppController()._handleException(ex, {continueCallback:callback});
	} else {
		// bug fix #2131 - handle errors during attachment upload.
		appCtxt.getAppController().popupUploadErrorDialog(ZmItem.MSG, status);
		this.setFooter(ZmMsg.attachingFilesError);
	}

	this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
};

ZmAttachDialog.prototype.removePrevAttDialogContent =
function(contentDiv) {
    var elementNode =  contentDiv && contentDiv.firstChild;
    if (elementNode && elementNode.className == "DwtComposite" ){
        contentDiv.removeChild(elementNode);
    }
};


ZmAttachDialog.prototype.getBriefcaseView =
function(){

    this.removePrevAttDialogContent(this._getContentDiv().firstChild);
    this.setTitle(ZmMsg.attachFile);

	if (!this._briefcaseView) {
		AjxDispatcher.require(["BriefcaseCore", "Briefcase"]);
		this._briefcaseView = new ZmBriefcaseTabView(this);
	}

    this._briefcaseView.reparentHtmlElement(this._getContentDiv().childNodes[0], 0);
    var okCallback = new AjxCallback(this._briefcaseView, this._briefcaseView.uploadFiles);
    this.setOkListener(okCallback);
    this.setCancelListener((new AjxCallback(this,this.cancelUploadFiles)));


	return this._briefcaseView;
};

// Inline Option for attachment Dialog.
ZmAttachDialog.prototype._setInlineOptionSection =
function(view){
	var div = document.createElement("div");
	div.className = "ZmAttachDialog-inline";
	div.id = Dwt.getNextId();
	view.getHtmlElement().appendChild(div);

	this._inlineOption = document.getElementById(div.id);
};

ZmAttachDialog.prototype.enableInlineOption =
function(enable) {
	if (enable) {
		var inlineCheckboxId = this._htmlElId + "_inlineCheckbox";
		this._inlineOption.setAttribute("option", "inline");
		this._inlineOption.innerHTML = [
			"<input type='checkbox' name='inlineimages' id='",
			inlineCheckboxId,
			"'> <label for='",
			inlineCheckboxId,
			"'>",
			ZmMsg.inlineAttachmentOption,
			"</label>"
		].join("");
		this._tabGroup.addMember(this._inlineOption.getElementsByTagName('input')[0],0);
	} else {
		this._inlineOption.innerHTML = "";
	}
};

ZmAttachDialog.prototype._resetInlineOption =
function() {
	var inlineOption = document.getElementById(this._htmlElId+"_inlineCheckbox");
	if (inlineOption) {
		inlineOption.checked = false;
	}
};

ZmAttachDialog.prototype.isInline =
function() {
	var inlineOption = document.getElementById(this._htmlElId+"_inlineCheckbox");
	return (inlineOption && inlineOption.checked);
};

ZmAttachDialog.prototype.setInline =
function(checked) {
	var inlineOption = document.getElementById(this._htmlElId+"_inlineCheckbox");

	if (inlineOption)
		inlineOption.checked = checked;
};


/**
 * Attachment Upload View
 *
 * @param parent
 * @param className
 * @param posStyle
 *
 * @class
 * @private
 */
ZmAttachDialog.prototype.getMyComputerView =
function(){
    var newElm = false;
    this.removePrevAttDialogContent(this._getContentDiv().firstChild);
    this.setTitle(ZmMsg.attachFile);

	if (!this._myComputerView) {
		this._myComputerView = new ZmMyComputerTabViewPage(this);
        newElm = true;
	}

    this._myComputerView.reparentHtmlElement(this._getContentDiv().childNodes[0], 0);

    if (!newElm) {
        this._myComputerView.resetAttachments()
    }

    var okCallback = new AjxCallback(this, this.submitAttachmentFile,[this._myComputerView]);
    this.setOkListener(okCallback);
    this.setCancelListener((new AjxCallback(this,this.cancelUploadFiles)));

	return this._myComputerView;
};


ZmMyComputerTabViewPage = function(parent, className, posStyle) {
	if (arguments.length == 0) { return; }

	DwtComposite.call(this, parent, className, Dwt.STATIC_STYLE);
    this._createHtml();
    this.showMe();
	this.setScrollStyle(Dwt.SCROLL);
};

ZmMyComputerTabViewPage.prototype = new DwtComposite;
ZmMyComputerTabViewPage.prototype.constructor = ZmMyComputerTabViewPage;

ZmMyComputerTabViewPage.SHOW_NO_ATTACHMENTS	= 5;
ZmMyComputerTabViewPage.MAX_NO_ATTACHMENTS	= 10;
ZmMyComputerTabViewPage.UPLOAD_FIELD_NAME	= "_attFile_";


ZmMyComputerTabViewPage.prototype.showMe =
function() {
	this.resetAttachments();
	this.setSize(Dwt.DEFAULT, "240");
	this._focusAttEl();
};

ZmMyComputerTabViewPage.prototype.hideMe =
function() {
	DwtTabViewPage.prototype.hideMe.call(this);
};

// Create UI for MyComputer
ZmMyComputerTabViewPage.prototype._createHtml =
function() {

	var subs = {
		id: this._htmlElId,
		uri: (appCtxt.get(ZmSetting.CSFE_ATTACHMENT_UPLOAD_URI) + "?fmt=extended")
	};
	this.setContent(AjxTemplate.expand("share.Dialogs#ZmAttachDialog-MyComputerTab", subs));

	this.attachmentTable = document.getElementById(this._htmlElId+"_attachmentTable");
	this.uploadForm = document.getElementById(this._htmlElId+"_uploadForm");
	this.attachmentButtonTable = document.getElementById(this._htmlElId+"_attachmentButtonTable");

	this._addAttachmentFieldButton();
	this._attachCount = 0;
};

// Attachments
ZmMyComputerTabViewPage.prototype._addAttachmentField =
function() {
	if (this._attachCount >= ZmMyComputerTabViewPage.MAX_NO_ATTACHMENTS) { return; }

	this._attachCount++;

	var row = this.attachmentTable.insertRow(-1);
	var cell = row.insertCell(-1);
	var fieldId = Dwt.getNextId();

	var subs = {
		id: fieldId,
		uploadName: ZmMyComputerTabViewPage.UPLOAD_FIELD_NAME
	};
	cell.innerHTML = AjxTemplate.expand("share.Dialogs#ZmAttachDialog-MyComputerTab-AddAttachment", subs);

	var removeEl = document.getElementById(fieldId+"_remove");   
	removeEl.onclick = AjxCallback.simpleClosure(this._removeAttachmentField, this, row);

    var inputId = fieldId+"_input";
	if (this._focusElId == -1) {
		this._focusElId = inputId;
	}    
    var inputEl = document.getElementById(inputId);
    var sizeEl = document.getElementById(fieldId+"_size");

    //HTML5
    if(AjxEnv.supportsHTML5File){
        Dwt.setHandler(inputEl, "onchange", AjxCallback.simpleClosure(this._handleFileSize, this, inputEl, sizeEl));
    }

	// trap key presses in IE for input field so we can ignore ENTER key (bug 961)
	if (AjxEnv.isIE) {
		inputEl.onkeydown = AjxCallback.simpleClosure(this._handleKeys, this);
	}
};

ZmMyComputerTabViewPage.prototype._handleFileSize =
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



ZmMyComputerTabViewPage.prototype._removeAttachmentField =
function(row) {
	this.attachmentTable.deleteRow(row.rowIndex);
	this._attachCount--;

	if (this._attachCount == 0) {
		this._addAttachmentField();
	}
};

ZmMyComputerTabViewPage.prototype._addAttachmentFieldButton =
function() {
	var row = this.attachmentButtonTable.insertRow(-1);
	var cell = row.insertCell(-1);

	var button = new DwtButton({parent:this, parentElement:cell});
	button.setText(ZmMsg.addMoreAttachments);
	button.addSelectionListener(new AjxListener(this, this._addAttachmentField));
};

ZmMyComputerTabViewPage.prototype.gotAttachments =
function() {
	var atts = document.getElementsByName(ZmMyComputerTabViewPage.UPLOAD_FIELD_NAME);

	for (var i = 0; i < atts.length; i++)
		if (atts[i].value.length) {
			return true;
		}
	return false;
};

ZmMyComputerTabViewPage.prototype.resetAttachments =
function() {
	// CleanUp
	this._cleanTable(this.attachmentTable);
	this._attachCount = 0;
	if (ZmMyComputerTabViewPage.SHOW_NO_ATTACHMENTS > ZmMyComputerTabViewPage.MAX_NO_ATTACHMENTS) {
		ZmMyComputerTabViewPage.SHOW_NO_ATTACHMENTS = ZmMyComputerTabViewPage.MAX_NO_ATTACHMENTS;
	}

	// Re-initialize UI
	this._focusElId = -1;
	var row = this.attachmentTable.insertRow(-1);
	var cell = row.insertCell(-1);
	cell.appendChild(document.createElement("br"));
	cell.appendChild(document.createElement("br"));

	for (var i = 0; i < ZmMyComputerTabViewPage.SHOW_NO_ATTACHMENTS; i++) {
		this._addAttachmentField();
	}
	delete i;
};

ZmMyComputerTabViewPage.prototype._focusAttEl =
function() {
	var el = document.getElementById(this._focusElId);
	if (el) el.focus();
};

// Utilities
ZmMyComputerTabViewPage.prototype._cleanTable =
function(table) {
	if (!table || !table.rows) { return; }
	while (table.rows.length > 0) {
		table.deleteRow(0);
	}
};

ZmMyComputerTabViewPage.prototype._handleKeys =
function(ev) {
	var key = DwtKeyEvent.getCharCode(ev);
	return !DwtKeyEvent.IS_RETURN[key];
};

ZmMyComputerTabViewPage.prototype._validateFileSize =
function(){

    var atts = document.getElementsByName(ZmMyComputerTabViewPage.UPLOAD_FIELD_NAME);
    var file, size;
	for (var i = 0; i < atts.length; i++){
        file = atts[i].files;
        if(!file || file.length == 0) continue;
        for(var j=0; j<file.length;j++){
            var f = file[j];
            size = f.size || f.fileSize /*Safari*/;
            if ((-1 /* means unlimited */ != appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT)) &&
                (size > appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT))) {
                return false;
            }
        }
    }
	return true;
};

ZmMyComputerTabViewPage.prototype.validate =
function(){
    var status, errorMsg;
    if(AjxEnv.supportsHTML5File){
        status = this._validateFileSize();
        errorMsg = AjxMessageFormat.format(ZmMsg.attachmentSizeError, AjxUtil.formatSize(appCtxt.get(ZmSetting.MESSAGE_SIZE_LIMIT)));
    }else{
        status = true;
    }

    return {status: status, error:errorMsg};
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmNewOrganizerDialog")) {
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
 * Creates a new organizer dialog.
 * @class
 * This class represents a new organizer dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * @param	{String}	title		the title
 * @param	{constant}	type		the organizer type
 * 
 * @extends		ZmDialog
 */
ZmNewOrganizerDialog = function(parent, className, title, type, extraButtons) {
	if (arguments.length == 0) return;

	this._organizerType = type;
	ZmDialog.call(this, {parent:parent, className:className, title:title, id:"CreateNewFolderDialog", extraButtons: extraButtons});
	this._setupControls();
};

ZmNewOrganizerDialog.prototype = new ZmDialog;
ZmNewOrganizerDialog.prototype.constructor = ZmNewOrganizerDialog;

ZmNewOrganizerDialog.prototype.isZmNewOrganizerDialog = true;
ZmNewOrganizerDialog.prototype.toString = function() { return "ZmNewOrganizerDialog"; };

//override the following if needed
ZmNewOrganizerDialog.prototype._folderLocationLabel = ZmMsg.newFolderParent;
ZmNewOrganizerDialog.prototype._folderNameAlreadyExistsMsg = ZmMsg.errorAlreadyExists;

// Public methods

/**
 * Pops-up the dialog.
 * 
 * @param {ZmOrganizer|hash}	params      popup parameters
 * @param	{ZmAccount}	account		the account
 */
ZmNewOrganizerDialog.prototype.popup =
function(params, account) {

	params = params || {};
    var folder = params instanceof ZmOrganizer ? params : (params && params.organizer);

	var parentLabelCell = document.getElementById(this._htmlElId + '_parentLabel');
	var parentValueCell = document.getElementById(this._htmlElId + '_parentValue');
	this._parentFolder = null;

	// if the user has already implicitly selected a parent folder, don't show overview
	if (folder && folder.id != ZmOrganizer.ID_ROOT) {
		this._parentFolder = folder;
		this._makeOverviewVisible();    // hide all overviews
		if (parentLabelCell) {
			parentLabelCell.colSpan = 1;
			parentLabelCell.innerHTML = ZmMsg.parentFolderLabel;
			parentValueCell.innerHTML = folder.getName();
		}
	}
	else {
		if (this._folderTreeCellId) {
			if (parentLabelCell) {
				parentLabelCell.innerHTML = this._folderLocationLabel;
				parentLabelCell.colSpan = 2;
				parentValueCell.innerHTML = '';
			}
			var overviewParams = {
				appName:		params.appName,
				overviewId:		this.toString() + (params.appName || ""),
				treeIds:		this._treeIds,
				omit:			this._omit,
				fieldId:		this._folderTreeCellId,
				overviewTrees:	[this._organizerType],
	            treeStyle:      this._treeStyle
			};
			var overview = this._setOverview(overviewParams);
			overview.removeAttribute('aria-label');
			overview.setAttribute('aria-labelledby', this._htmlElId + '_parentLabel');

			if (this._folderTreeView) {
				// bug #18533 - always make sure header item is visible in "New" dialog
				this._folderTreeView.getHeaderItem().setVisible(true, true);

				if (!folder || this._omit[folder.nId] || folder.nId == ZmOrganizer.ID_ROOT) {
					folder = appCtxt.getFolderTree().root; //default to root if no folder passed, the folder is omitted from the overview. (I don't get the last option, but it was there so I keep it - it's already root)
				}
				var ti = this._folderTreeView.getTreeItemById(folder.id);
				if (ti) {
					this._folderTreeView.setSelection(ti, true, null, true);
				}
				if (folder.nId == ZmOrganizer.ID_ROOT) {
					var sid = ZmOrganizer.getSystemId(folder.id);
					var ti = this._folderTreeView.getTreeItemById(sid);
					if (ti) {
						ti.setExpanded(true);
					}
				}
			}
		}
	}

    if (this._colorSelect) {
        var defaultColorCode = ZmOrganizer.DEFAULT_COLOR[this._organizerType],
            defaultColor = ZmOrganizer.COLOR_VALUES[defaultColorCode],
            colorMenu = this._colorSelect.getMenu(),
            moreColorMenu;
        if(colorMenu) {
            moreColorMenu = (colorMenu.toString() == "ZmMoreColorMenu") ? colorMenu : colorMenu._getMoreColorMenu();
            if(moreColorMenu) moreColorMenu.setDefaultColor(defaultColor);
        }

        var icon = null;
        var orgType = this._organizerType;
        var orgClass = ZmOrganizer.ORG_CLASS[orgType];
        if (orgClass) {
			//to fix bug 55320 - got rid of the calling getIcon on the prototype hack - that caused isRemote to set _isRemote on the prototype thus causing every object to have it by default set.
            //bug 55491: pass tmp. organizer id to make sure this._isRemote is not true by default.
			var sample = new window[orgClass]({id:Dwt.getNextId()}); //get a sample object just for the icon
			icon = sample.getIcon();
        }

        this._colorSelect.setImage(icon);
        this._colorSelect.setValue(ZmOrganizer.DEFAULT_COLOR[orgType]);
    }

	var ovContainer = appCtxt.multiAccounts && this._opc.getOverviewContainer(this.toString());
	if (ovContainer) {
		if (!folder || (folder && folder.nId == ZmOrganizer.ID_ROOT)) {
			var acct = account || appCtxt.getActiveAccount();
			ovContainer.setSelection(ovContainer.getHeaderItem(acct));
		} else {
			var overviewId = appCtxt.getOverviewId(this.toString(), account);
			var overview = ovContainer.getOverview(overviewId);
			var treeView = overview && overview.getTreeView(this._organizerType);
			if (treeView) {
				ovContainer.deselectAll();
				var ti = treeView.getTreeItemById(folder.id);
				treeView.setSelection(ti);
			}
		}

		ovContainer.expandAccountOnly(account);
	}

	ZmDialog.prototype.popup.call(this);
};

/**
 * Resets the dialog.
 * 
 * @param	{ZmAccount}	account		the account
 */
ZmNewOrganizerDialog.prototype.reset = function(account) {

	ZmDialog.prototype.reset.apply(this, arguments);

	if (this._remoteCheckboxField) {
		this._remoteCheckboxField.checked = false;
		var urlRow = document.getElementById(this._remoteCheckboxFieldId + "URLrow");
		if (urlRow) {
			urlRow.style.display = "none";
		}
	}

	if (this._urlField) {
		this._urlField.value = "";
		this._urlField.noTab = true;
	}

	if (appCtxt.multiAccounts) {
		this._account = account;
	} else {
		this._account = null;
	}
};


//
// Protected methods
//

ZmNewOrganizerDialog.prototype._getRemoteLabel =
function() {
	return ZmMsg.subscribeToFeed;
};

// create html

ZmNewOrganizerDialog.prototype._contentHtml = 
function() {
	var html = [];
	var idx = 0;
	html[idx++] = "<table role='presentation' class='ChooserDialog ZPropertySheet' cellspacing='6' >";
	idx = this._createStandardContentHtml(html, idx);
	idx = this._createExtraContentHtml(html, idx);
	html[idx++] = "</table>";
	return html.join("");
};

ZmNewOrganizerDialog.prototype._createStandardContentHtml =
function(html, idx) {
	idx = this._createNameContentHtml(html, idx);
	if (this._organizerType != ZmOrganizer.FOLDER || (this._organizerType == ZmOrganizer.FOLDER && appCtxt.get(ZmSetting.MAIL_FOLDER_COLORS_ENABLED))) {
		idx = this._createColorContentHtml(html, idx);
	}
	return idx;
};

ZmNewOrganizerDialog.prototype._createNameContentHtml =
function(html, idx) {
	this._nameFieldId = this._htmlElId + "_name";
	html[idx++] = AjxTemplate.expand("share.Dialogs#ZmNewOrgDialogName", {id:this._htmlElId});
	return idx;
};

ZmNewOrganizerDialog.prototype._createColorContentHtml =
function(html, idx) {
	this._colorSelectId = this._htmlElId + "_colorSelect";
	html[idx++] = AjxTemplate.expand("share.Dialogs#ZmNewOrgDialogColor", {id:this._htmlElId});
	return idx;
};

ZmNewOrganizerDialog.prototype._createExtraContentHtml =
function(html, idx) {
	idx = this._createRemoteContentHtml(html, idx);
	idx = this._createFolderContentHtml(html, idx);
	return idx;
};

ZmNewOrganizerDialog.prototype._createRemoteContentHtml = function(html, idx) {

	this._remoteCheckboxFieldId = this._htmlElId + "_remote";

	var subs = {
		id: this._htmlElId,
		remoteLabel: this._getRemoteLabel()
	};
	html[idx++] = AjxTemplate.expand("share.Dialogs#ZmNewOrgDialogRemote", subs);
	return idx;
};

ZmNewOrganizerDialog.prototype._createFolderContentHtml =
function(html, idx) {
	this._folderTreeCellId = this._htmlElId + "_folderTree";
	html[idx++] = AjxTemplate.expand("share.Dialogs#ZmNewOrgDialogFolder", {id:this._htmlElId});
	return idx;
};

// setup dwt controls

ZmNewOrganizerDialog.prototype._setupControls =
function() {
	this._setupStandardControls();
	this._setupExtraControls();
};

ZmNewOrganizerDialog.prototype._setupStandardControls =
function() {
	this._setupNameControl();
	this._setupColorControl();
};

ZmNewOrganizerDialog.prototype._setupNameControl =
function() {
	this._setNameField(this._nameFieldId);
};

ZmNewOrganizerDialog.prototype._setupColorControl =
function() {
    var el = document.getElementById(this._colorSelectId);
	this._colorSelect = new ZmColorButton({
		parent:         this,
		parentElement:  el,
		labelId:        this._htmlElId + '_lblColor'
	});
};

ZmNewOrganizerDialog.prototype._setupExtraControls =
function() {
	this._setupRemoteControl();
	this._setupFolderControl();
};

ZmNewOrganizerDialog.prototype._setupRemoteControl =
function() {
	this._remoteCheckboxField = document.getElementById(this._remoteCheckboxFieldId);
	if (this._remoteCheckboxField) {
		this._urlField = document.getElementById(this._remoteCheckboxFieldId + "URLfield");
		Dwt.setHandler(this._remoteCheckboxField, DwtEvent.ONCLICK, this._handleCheckbox.bind(this));
	}
};

ZmNewOrganizerDialog.prototype._setupFolderControl =
function() {
	if (!this._folderTreeCellId) { return; }
	
	this._treeIds = [this._organizerType];

	this._omit = {};
	this._omit[ZmFolder.ID_SPAM] = true;
	this._omit[ZmFolder.ID_DRAFTS] = true;
	this._omit[ZmFolder.ID_SYNC_FAILURES] = true;
	this._omit[ZmFolder.ID_OUTBOX] = true;
	this._omit[ZmFolder.ID_FILE_SHARED_WITH_ME] = true;

	//Bug#68799: no special handling needed for sync issues folder
	/*var folderTree = appCtxt.getFolderTree();
	var syncIssuesFolder = folderTree ? folderTree.getByName(ZmFolder.SYNC_ISSUES) : null;
	if (syncIssuesFolder) {
		this._omit[syncIssuesFolder.id] = true;
	}*/
	this._omit[ZmOrganizer.ID_ZIMLET] = true;
};

// other

ZmNewOrganizerDialog.prototype._renderOverview =
function(overview, treeIds, omit, noRootSelect) {
	this._setupFolderControl();	// reset in case we changed accounts (family mailbox)
	ZmDialog.prototype._renderOverview.apply(this, arguments);
	this._folderTreeView = overview.getTreeView(this._organizerType);
};

ZmNewOrganizerDialog.prototype._getOverviewOrOverviewContainer =
function() {
	if (appCtxt.multiAccounts) {
		return this._opc.getOverviewContainer(this.toString());
	}
	return this._opc.getOverview(this._curOverviewId);

};


/** 
 * Checks the input for validity and returns the following array of values:
 * <ul>
 * <li> parentFolder
 * <li> name
 * <li> color
 * <li> URL
 * </ul>
 */
ZmNewOrganizerDialog.prototype._getFolderData =
function() {
	// make sure a parent was selected
	var ov = this._getOverviewOrOverviewContainer();

	var parentFolder = this._parentFolder || (ov && ov.getSelected()) || appCtxt.getFolderTree(this._account).root;

	if (this._isGlobalSearch) {
		//special case for global search (only possible if this is ZmNewSearchDialog
		parentFolder = appCtxt.getById(ZmOrganizer.ID_ROOT);
	}

	// check name for presence and validity
	var name = AjxStringUtil.trim(this._nameField.value);
	var msg = ZmFolder.checkName(name, parentFolder);

	// make sure parent doesn't already have a child by this name
	if (!msg && parentFolder.hasChild(name)) {
        var folderType = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getFolderTypeByName(name);
		msg = AjxMessageFormat.format(this._folderNameAlreadyExistsMsg, [name,ZmMsg[folderType.toLowerCase()]]);
	}

	var color = null;
	if (!msg && this._colorSelectId) {
		color = this._colorSelect.getValue();
	}

	var url = null;
	if (!msg && this._remoteCheckboxField) {
		url = this._remoteCheckboxField.checked ? this._urlField.value : null;
		if (url || url != null) {
			msg = ZmOrganizer.checkUrl(url);
		}
	}

	if (!msg && parentFolder.disallowSubFolder) {
		msg = AjxMessageFormat.format(ZmMsg.errorSubFolderNotAllowed, parentFolder.name);
	}

    if (msg) {
        return this._showError(msg);
    }

	var account = appCtxt.multiAccounts ? parentFolder.getAccount() : null;
	var params = {l:parentFolder.id, name:name, color:color, url:url, account:account};
    if (String(color).match(/^#/)) {
        params.rgb = color;
        delete params.color;
    }
    return params;
};

ZmNewOrganizerDialog.prototype._getTabGroupMembers =
function() {
	var list = [this._nameField];
	if (this._colorSelect) {
		list.push(this._colorSelect);
	}
	if (this._remoteCheckboxField) {
		list.push(this._remoteCheckboxField);
		if (this._urlField) {
			list.push(this._urlField);
		}
	}
	if (this._overview[this._curOverviewId]) {
		list.push(this._overview[this._curOverviewId]);
	}
	return list;
};

// dwt event listeners

ZmNewOrganizerDialog.prototype._okButtonListener =
function(ev) {
	var results = this._getFolderData();
	if (results) {
		DwtDialog.prototype._buttonListener.call(this, ev, results);
	}
};

ZmNewOrganizerDialog.prototype._enterListener =
function(ev) {
	var results = this._getFolderData();
	if (results) {
		this._runEnterCallback(results);
	}
};


// html event handlers

ZmNewOrganizerDialog.prototype._handleCheckbox = function(event) {

	event = event || window.event;
	var target = DwtUiEvent.getTarget(event);
	var urlRow = document.getElementById(target.id + "URLrow");
	urlRow.style.display = target.checked ? (AjxEnv.isIE ? "block" : "table-row") : "none";
	if (this._urlField) {
		if (target.checked) {
			this._urlField.focus();
		}
		this._urlField.noTab = !target.checked;
	}
};

ZmNewOrganizerDialog.prototype.setRemoteURL =
function(url) {
    this._remoteCheckboxField.checked = true;
    this._urlField.value = url;
    var urlRow = document.getElementById(this._remoteCheckboxFieldId + "URLrow");
	var urlField= document.getElementById(this._remoteCheckboxFieldId + "URLfield");
	urlRow.style.display = AjxEnv.isIE ? "block" : "table-row";

};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmNewSearchDialog")) {
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
 * @overview
 */

/**
 * Creates a new search dialog.
 * @class
 * This class represents a new search dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		ZmNewOrganizerDialog
 */
ZmNewSearchDialog = function(parent, className) {

	ZmNewOrganizerDialog.call(this, parent, className, ZmMsg.saveSearch, ZmOrganizer.SEARCH);

};

ZmNewSearchDialog.prototype = new ZmNewOrganizerDialog;
ZmNewSearchDialog.prototype.constructor = ZmNewSearchDialog;

ZmNewSearchDialog.prototype.toString = 
function() {
	return "ZmNewSearchDialog";
};

//overriden properties

ZmNewSearchDialog.prototype._folderLocationLabel = ZmMsg.newSearchParent;


/**
 * Pops-up the dialog.
 * 
 * @param	{Hash}	params		a hash of parameters
 * @param	{String}	params.search		the search
 *
 */
ZmNewSearchDialog.prototype.popup =
function(params) {
	ZmNewOrganizerDialog.prototype.popup.call(this, params);

	var account = appCtxt.multiAccounts ? appCtxt.getActiveAccount() : null;

	var ov = this._getOverviewOrOverviewContainer();
	
	this._searchTreeView = ov.getTreeView(ZmOrganizer.SEARCH);
	this._search = params.search;
	this._searchTreeView.setSelected(appCtxt.getFolderTree(account).root, true);
	this._isGlobalSearch = appCtxt.multiAccounts && appCtxt.getSearchController().searchAllAccounts;

	if (appCtxt.multiAccounts) {
		this._searchTreeView.setVisible(true);
		this._makeOverviewVisible(this._curOverviewId);
	}

	var overviewDiv = document.getElementById(this._folderTreeCellId);
	if (overviewDiv) {
		Dwt.setVisible(overviewDiv, !this._isGlobalSearch);
	}
};

ZmNewSearchDialog.prototype._getFolderData =
function() {

	var ret = ZmNewOrganizerDialog.prototype._getFolderData.call(this);
	if (!ret) {
		return;
	}

	ret.isGlobal = this._isGlobalSearch;
	ret.search = this._search;

	return ret;
};


/**
 * @private
 */
ZmNewSearchDialog.prototype._setupFolderControl =
function(){
    ZmNewOrganizerDialog.prototype._setupFolderControl.call(this);
	this._treeIds = [ ZmOrganizer.SEARCH ];
};

// NOTE: don't show remote checkbox
ZmNewSearchDialog.prototype._createRemoteContentHtml =
function(html, idx) {
	return idx;
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmNewTagDialog")) {
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

/**
 * @overview
 */

/**
 * Creates a new tag dialog.
 * @class
 * This class represents a new tag dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		ZmDialog
 */
ZmNewTagDialog = function(parent, className) {
	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.createNewTag, id:"CreateTagDialog"});

	this._setNameField(this._htmlElId+"_name");
	this._setTagColorMenu();
	this._setAccountMenu();
	DBG.timePt("set content");
};

ZmNewTagDialog.prototype = new ZmDialog;
ZmNewTagDialog.prototype.constructor = ZmNewTagDialog;

ZmNewTagDialog.prototype.toString = 
function() {
	return "ZmNewTagDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmOrganizer}	org		the organizer
 * @param	{ZmAccount}		account	the account
 */
ZmNewTagDialog.prototype.popup =
function(org, account) {
	if (this._accountSelect) {
		var acct = account || appCtxt.getActiveAccount();
		this._accountSelect.setSelectedValue(acct.id);
	}

	ZmDialog.prototype.popup.call(this);
};

ZmNewTagDialog.prototype.cleanup =
function(bPoppedUp) {
	DwtDialog.prototype.cleanup.call(this, bPoppedUp);
	var color = this._getNextColor();
	this._setColorButton(color, ZmOrganizer.COLOR_TEXT[color], ZmTag.getIcon(color));
};

ZmNewTagDialog.prototype._colorListener = 
function(ev) {
	var color = ev.item.getData(ZmOperation.MENUITEM_ID);
	this._setColorButton(color, ZmOrganizer.COLOR_TEXT[color], ZmTag.getIcon(color));
};

ZmNewTagDialog.prototype._setTagColorMenu =
function() {
	var fieldId = this._htmlElId + "_tagColor";
	this._colorButton = new DwtButton({parent:this, parentElement:fieldId, id:"ZmTagColorMenu"});
	this._colorButton.noMenuBar = true;

	var menu = ZmOperation.addColorMenu(this._colorButton, true);

	var color = ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.TAG];
	this._setColorButton(color, ZmOrganizer.COLOR_TEXT[color], ZmTag.getIcon(color));

	this._tagColorListener = new AjxListener(this, this._colorListener);
    menu.addSelectionListener(this._tagColorListener);
};

ZmNewTagDialog.prototype._setAccountMenu =
function() {
	if (!appCtxt.multiAccounts) { return; }

	var fieldId = this._htmlElId + "_account";
	this._accountSelect = new DwtSelect({parent:this, parentElement:fieldId});

	var accounts = appCtxt.accountList.visibleAccounts;
	for (var i = 0; i < accounts.length; i++) {
		var acct = accounts[i];
		if (appCtxt.get(ZmSetting.TAGGING_ENABLED, null, acct)) {
			var o = new DwtSelectOption(acct.id, null, acct.getDisplayName(), null, null, acct.getIcon());
			this._accountSelect.addOption(o);
		}
	}
};

ZmNewTagDialog.prototype._setColorButton =
function(color, text, image) {
	this._colorButton.setData(ZmOperation.MENUITEM_ID, color);
	this._colorButton.setText(text || ZmMsg.custom);
	this._colorButton.setImage(image);
};

ZmNewTagDialog.prototype._contentHtml = 
function() {
	return AjxTemplate.expand("share.Dialogs#ZmNewTagDialog", {id:this._htmlElId});
};

ZmNewTagDialog.prototype._okButtonListener =
function(ev) {
	var results = this._getTagData();
	if (results) {
		DwtDialog.prototype._buttonListener.call(this, ev, results);
	}
};

ZmNewTagDialog.prototype._getTagData =
function() {
	var acctId = this._accountSelect && this._accountSelect.getValue();
	var account = acctId && appCtxt.accountList.getAccount(acctId);

	// check name for presence and validity
	var name = AjxStringUtil.trim(this._nameField.value);
	var msg = ZmTag.checkName(name);

	// make sure tag doesn't already exist
	var tagTree = appCtxt.getTagTree(account);
	if (!msg && tagTree && tagTree.getByName(name)) {
		msg = ZmMsg.tagNameExists;
	}

	if (msg) return this._showError(msg);
    var color = this._colorButton.getData(ZmOperation.MENUITEM_ID);
    var data = {name:name, color:color, accountName:(account && account.name)};
    if (String(color).match(/^#/)) {
        data.rgb = color;
        delete data.color;
    }
    return data;
};

ZmNewTagDialog.prototype._enterListener =
function(ev) {
	var results = this._getTagData();
	if (results) {
		this._runEnterCallback(results);
	}
};

ZmNewTagDialog.prototype._getNextColor =
function() {
	var colorUsed = {};
	var tagTree = appCtxt.getTagTree();
	if (!tagTree) {
		return ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.TAG];
	}

	var tags = tagTree.root.children.getArray();
	if (!(tags && tags.length)) {
		return ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.TAG];
	}

	for (var i = 0; i < tags.length; i++) {
		colorUsed[tags[i].color] = true;
	}
	for (var i = 0; i < ZmTagTree.COLOR_LIST.length; i++) {
		var color = ZmTagTree.COLOR_LIST[i];
		if (!colorUsed[color]) {
			return color;
		}
	}

	return ZmOrganizer.DEFAULT_COLOR[ZmOrganizer.TAG];
};

ZmNewTagDialog.prototype._getTabGroupMembers =
function() {
	return [this._nameField, this._colorButton];
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmOfflineSettingsDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a dialog for offline settings which can be enabled or disabled.
 * @constructor
 * @class
 * @author  Hem Aravind
 *
 * @extends	DwtDialog
 */
ZmOfflineSettingsDialog = function() {

    var params = {
        parent : appCtxt.getShell(),
        className : "ZmOfflineSettingDialog",
        id : "ZmOfflineSettingDialog",
        title : ZmMsg.offlineSettings
    };
    DwtDialog.call(this, params);

    // set content
    this.setContent(this._contentHtml());

    this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
};

ZmOfflineSettingsDialog.prototype = new DwtDialog;
ZmOfflineSettingsDialog.prototype.constructor = ZmOfflineSettingsDialog;

ZmOfflineSettingsDialog.prototype.toString =
function() {
    return "ZmOfflineSettingDialog";
};

/**
 * Gets the HTML that forms the basic framework of the dialog.
 *
 * @private
 */
ZmOfflineSettingsDialog.prototype._contentHtml =
function() {
    // identifiers
    var id = this._htmlElId;
    this._enableRadioBtnId = id + "_ENABLE_OFFLINE_RADIO";
    this._disableRadioBtnId = id + "_DISABLE_OFFLINE_RADIO";
    // content html
    return AjxTemplate.expand("prefs.Pages#OfflineSettings", {id : id, isWebClientOfflineSupported : appCtxt.isWebClientOfflineSupported});
};

ZmOfflineSettingsDialog.prototype._okButtonListener =
function(ev) {
    var enableRadioBtn = document.getElementById(this._enableRadioBtnId),
        disableRadioBtn = document.getElementById(this._disableRadioBtnId);

    if (enableRadioBtn && enableRadioBtn.checked) {
		ZmOfflineSettingsDialog.modifySetting(true);
    }
    else if (disableRadioBtn && disableRadioBtn.checked) {
		ZmOfflineSettingsDialog.modifySetting(false);
    }
    DwtDialog.prototype._buttonListener.call(this, ev);
};

/**
 * Pops-down the ZmOfflineSettingsDialog dialog.
 *
 * Radio button state restored based on the current setting.
 */
ZmOfflineSettingsDialog.prototype.popdown =
function() {
	var offlineBrowserKey = appCtxt.get(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY);
	var localOfflineBrowserKey = localStorage.getItem(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY);
	if (offlineBrowserKey && offlineBrowserKey.indexOf(localOfflineBrowserKey) !== -1) {
        var enableRadioBtn = document.getElementById(this._enableRadioBtnId);
        enableRadioBtn && (enableRadioBtn.checked = true);
    }
    else {
        var disableRadioBtn = document.getElementById(this._disableRadioBtnId);
        disableRadioBtn && (disableRadioBtn.checked = true);
    }
    DwtDialog.prototype.popdown.call(this);
};

/**
 * Gets the sign out confirmation dialog if webclient offline is enabled
 *
 * @return	{dialog}
 */
ZmOfflineSettingsDialog.showConfirmSignOutDialog =
function() {
    var dialog = appCtxt.getYesNoMsgDialog();
    dialog.reset();
	dialog.registerCallback(DwtDialog.YES_BUTTON, ZmOfflineSettingsDialog.modifySetting.bind(null, false, true, dialog));
    dialog.setMessage(ZmMsg.offlineSignOutWarning, DwtMessageDialog.WARNING_STYLE);
    dialog.popup();
};

ZmOfflineSettingsDialog.modifySetting =
function(offlineEnable, logOff, dialog) {
    if (logOff) {
        dialog.popdown();
        var setting = appCtxt.getSettings().getSetting(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY);
        if (setting) {
			setting.addChangeListener(ZmOfflineSettingsDialog._handleLogOff.bind(window));
        }
        else {
			ZmOfflineSettingsDialog._handleLogOff();
        }
    }
    var existingBrowserKey = appCtxt.get(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY);
    if (existingBrowserKey) {
        existingBrowserKey = existingBrowserKey.split(",");
    }
    if (offlineEnable) {
        var browserKey = new Date().getTime().toString();
        localStorage.setItem(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY, browserKey);
        if (existingBrowserKey) {
            AjxUtil.arrayAdd(existingBrowserKey, browserKey);
        }
        else {
            existingBrowserKey = [].concat(browserKey);
        }
    }
    else {
        if (existingBrowserKey) {
            AjxUtil.arrayRemove(existingBrowserKey, localStorage.getItem(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY));
        }
        localStorage.removeItem(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY);
		AjxCookie.deleteCookie(document, "ZM_OFFLINE_KEY", "/");
    }
    if (existingBrowserKey) {
        appCtxt.set(ZmSetting.WEBCLIENT_OFFLINE_BROWSER_KEY, existingBrowserKey.join());
    }
};

ZmOfflineSettingsDialog._handleLogOff =
function() {
	ZmOffline.deleteOfflineData();
	setTimeout(ZmZimbraMail.logOff, 2500);//Give some time for deleting indexeddb data and application cache data
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFolderDialogTabView")) {
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
 * Creates a folder properties view for the folder dialog
 * @class
 * This class represents a dialog tab view displayed by a tabToolbar
 * 
 * @param	{DwtControl}	parent		    the parent (dialog)
 * @param	{String}	    className		the class name
 * 
 * @extends		DwtComposite
 */
ZmFolderDialogTabView = function(parent, className) {
    if (arguments.length == 0) return;

    DwtTabViewPage.call(this, parent, className, Dwt.RELATIVE_STYLE);

    this._createView();
};

ZmFolderDialogTabView.prototype = new DwtTabViewPage;
ZmFolderDialogTabView.prototype.constructor = ZmFolderDialogTabView;



ZmFolderDialogTabView.prototype.toString =
function() {
	return "ZmDialogTabView";
};

ZmFolderDialogTabView.prototype.setOrganizer =
function(organizer) {
    this._organizer = organizer;
}

/**  doSave will be invoked for each tab view.
 *
 * @param	{BatchCommand}	batchCommand	Accumulates updates from all tabs
 * @param	{Object}	    saveState		Accumulates error messages and indication of any update
 */
ZmFolderDialogTabView.prototype.doSave =
function(batchCommand, saveState) { };


ZmFolderDialogTabView.prototype._handleFolderChange =
function(event) { }

ZmFolderDialogTabView.prototype._handleError =
function(response) {
	// Returned 'not handled' so that the batch command will preform the default
	// ZmController._handleException
	return false;
};

ZmFolderDialogTabView.prototype._createCheckboxItem =
function(name, label) {
    var checkboxName  = "_" + name + "Checkbox"
    var containerName = "_" + name + "El"

    this[checkboxName] = document.createElement("INPUT");
    this[checkboxName].type = "checkbox";
    this[checkboxName]._dialog = this;
    this[checkboxName].id = checkboxName;

    this[containerName] = document.createElement("DIV");
    this[containerName].style.display = "none";
    this[containerName].appendChild(this[checkboxName]);
    var lbl = document.createElement("label");
    lbl.innerHTML = label;
    lbl.htmlFor = checkboxName;
    this[containerName].appendChild(lbl);

    return this[containerName];
}

ZmFolderDialogTabView.prototype._createBusyOverlay =
function(htmlElement) {
    this._busyOverlay = document.createElement("div");
    this._busyOverlay.className = "ZmDialogTabViewBusy";
    this._busyOverlay.style.position = "absolute";
    this._busyOverlay.innerHTML = "<table role='presentation' cellspacing=0 cellpadding=0 style='width:100%; height:100%'><tr><td>&nbsp;</td></tr></table>";
    htmlElement.appendChild(this._busyOverlay);
    Dwt.setBounds(this._busyOverlay, 0, 0, "100%", "100%")
    Dwt.setZIndex(this._busyOverlay, Dwt.Z_VEIL);
	Dwt.setVisible(this._busyOverlay, false);

    this._setBusyFlag = false;
}

ZmFolderDialogTabView.prototype._setBusy =
function(busy) {
    if (!this._setBusyFlag) {
		// transition from non-busy to busy state
		Dwt.setCursor(this._busyOverlay, "wait");
    	Dwt.setVisible(this._busyOverlay, true);
    	this._setBusyFlag = this._blockInput = true;
    } else if (this._setBusy) {
		// transition from busy to non-busy state
	    Dwt.setCursor(this._busyOverlay, "default");
	    Dwt.setVisible(this._busyOverlay, false);
	    this._setBusyFlag = this._blockInput = false;
	}
}
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFolderPropertyView")) {
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

/**
 * @overview
 */

/**
 * Creates a folder properties view for the folder dialog
 * @class
 * This class represents a folder properties view
 * 
 * @param	{DwtControl}	parent		the parent (dialog)
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmFolderPropertyView = function(dialog, parent) {
    if (arguments.length == 0) return;
    ZmFolderDialogTabView.call(this, parent, "ZmFolderPropertyView");
    this._dialog = dialog;

};

ZmFolderPropertyView.prototype = new ZmFolderDialogTabView;
ZmFolderPropertyView.prototype.constructor = ZmFolderPropertyView;


// Public methods

ZmFolderPropertyView.prototype.toString =
function() {
	return "ZmFolderPropertyView";
};

ZmFolderPropertyView.prototype.getTitle =
function() {
    return ZmMsg.folderTabProperties;
}

ZmFolderPropertyView.prototype.showMe =
function() {
	DwtTabViewPage.prototype.showMe.call(this);
    if (appCtxt.get(ZmSetting.SHARING_ENABLED)) {
        this._dialog.setButtonVisible(ZmFolderPropsDialog.ADD_SHARE_BUTTON, true);
    }

	this.setSize(Dwt.DEFAULT, "100");
    if (Dwt.getVisible(this._nameInputEl)) {
        this._nameInputEl.focus();
    }
};


/**  doSave will be invoked for each tab view.
 *
 * @param	{BatchCommand}	batchCommand	Accumulates updates from all tabs
 * @param	{Object}	    saveState		Accumulates error messages and indication of any update
 */
ZmFolderPropertyView.prototype.doSave =
function(batchCommand, saveState) {
	if (!this._handleErrorCallback) {
        this._handleErrorCallback = this._handleError.bind(this);
		this._handleRenameErrorCallback = this._handleRenameError.bind(this);
	}

	// rename folder followed by attribute processing
	var organizer = this._organizer;

    if (!organizer.isSystem() && !organizer.isDataSource()) {
		var name = this._nameInputEl.value;
		if (organizer.name != name) {
			var error = ZmOrganizer.checkName(name);
			if (error) {
                saveState.errorMessage.push(error);
                // Only error checking for now.  If additional, should not return here
				return;
			}
            batchCommand.add(new AjxCallback(organizer, organizer.rename, [name, null, this._handleRenameErrorCallback]));
            saveState.commandCount++;
		}
	}

    if (!organizer.isDataSource() && appCtxt.isWebClientOfflineSupported) {
        var webOfflineSyncDays = $('#folderOfflineLblId').val() || 0;
		if (organizer.webOfflineSyncDays != webOfflineSyncDays) {
			var error = ZmOrganizer.checkWebOfflineSyncDays(webOfflineSyncDays);
			if (error) {
                saveState.errorMessage.push(error);
                // Only error checking for now.  If additional, should not return here
				return;
			}
            batchCommand.add(new AjxCallback(organizer, organizer.setOfflineSyncInterval, [webOfflineSyncDays, null, this._handleErrorCallback]));
            saveState.commandCount++;
		}
	}

	var color = this._color.getValue() || ZmOrganizer.DEFAULT_COLOR[organizer.type];
	if (organizer.isColorChanged(color, organizer.color, organizer.rgb)) {
		if (ZmOrganizer.getStandardColorNumber(color) === -1) {
            batchCommand.add(new AjxCallback(organizer, organizer.setRGB, [color, null, this._handleErrorCallback]));
		}
		else {
            batchCommand.add(new AjxCallback(organizer, organizer.setColor, [color, null, this._handleErrorCallback]));
		}
        saveState.commandCount++;
	}

    if (Dwt.getVisible(this._excludeFbEl) && organizer.setFreeBusy) {
        var excludeFreeBusy = this._excludeFbCheckbox.checked;
		if (organizer.excludeFreeBusy != excludeFreeBusy) {
            batchCommand.add(new AjxCallback(organizer, organizer.setFreeBusy, [excludeFreeBusy, null, this._handleErrorCallback]));
            saveState.commandCount++;
		}
    }

    // Mail Folders only
    if (Dwt.getVisible(this._globalMarkReadEl) && organizer.globalMarkRead) {
        var globalMarkRead = this._globalMarkReadCheckbox.checked;
        if (organizer.globalMarkRead != globalMarkRead) {
            batchCommand.add(new AjxCallback(organizer, organizer.setGlobalMarkRead, [globalMarkRead, null, this._handleErrorCallback]));
            saveState.commandCount++;
        }
    }

	// Saved searches
	if (Dwt.getVisible(this._queryInputEl) && organizer.type === ZmOrganizer.SEARCH) {
		var query = this._queryInputEl.value;
		if (organizer.search.query !== query) {
			batchCommand.add(new AjxCallback(organizer, organizer.setQuery, [query, null, this._handleErrorCallback]));
			saveState.commandCount++;
		}
	}
};

ZmFolderPropertyView.prototype._handleFolderChange =
function(event) {
	var organizer = this._organizer;

    var colorCode = 0;
    if (this._color) {
        var icon = organizer.getIcon();
        this._color.setImage(icon);

		var colorCode = organizer.isColorCustom ? organizer.rgb : organizer.color;
		
        var defaultColorCode = ZmOrganizer.DEFAULT_COLOR[organizer.type],
            defaultColor = ZmOrganizer.COLOR_VALUES[defaultColorCode],
            colorMenu = this._color.getMenu(),
            moreColorMenu;
        if (colorMenu) {
            moreColorMenu = (colorMenu.toString() == "ZmMoreColorMenu") ? colorMenu : colorMenu._getMoreColorMenu();
            if (moreColorMenu) {
				moreColorMenu.setDefaultColor(defaultColor);
			}
        }
        this._color.setValue(colorCode);
		var folderId = organizer.getSystemEquivalentFolderId() || organizer.id;
		this._color.setEnabled(folderId != ZmFolder.ID_DRAFTS);
		var isVisible = (organizer.type != ZmOrganizer.FOLDER ||
						 (organizer.type == ZmOrganizer.FOLDER && appCtxt.get(ZmSetting.MAIL_FOLDER_COLORS_ENABLED)));
		this._props.setPropertyVisible(this._colorId, isVisible);
    }

	if (organizer.isSystem() || organizer.isDataSource()) {
		this._nameOutputEl.innerHTML = AjxStringUtil.htmlEncode(organizer.name);
        Dwt.setVisible(this._nameOutputEl, true);
        Dwt.setVisible(this._nameInputEl,  false);
	}
	else {
		this._nameInputEl.value = organizer.name;
        Dwt.setVisible(this._nameOutputEl, false);
        Dwt.setVisible(this._nameInputEl,  true);
	}

	var hasFolderInfo = !!organizer.getToolTip();
	if (hasFolderInfo) {
		var unreadProp = this._props.getProperty(this._unreadId),
			unreadLabel = unreadProp && document.getElementById(unreadProp.labelId);
		if (unreadLabel) {
			unreadLabel.innerHTML = AjxMessageFormat.format(ZmMsg.makeLabel, organizer._getUnreadLabel());
		}
		this._unreadEl.innerHTML = organizer.numUnread;
		var totalProp = this._props.getProperty(this._totalId),
			totalLabel = totalProp && document.getElementById(totalProp.labelId);
		if (totalLabel) {
			totalLabel.innerHTML = AjxMessageFormat.format(ZmMsg.makeLabel, organizer._getItemsText());
		}
		this._totalEl.innerHTML = organizer.numTotal;
		this._sizeEl.innerHTML = AjxUtil.formatSize(organizer.sizeTotal);
	}
	this._props.setPropertyVisible(this._unreadId, hasFolderInfo && organizer.numUnread);
	this._props.setPropertyVisible(this._totalId, hasFolderInfo);
	this._props.setPropertyVisible(this._sizeId, hasFolderInfo && organizer.sizeTotal);

	if (organizer.type === ZmOrganizer.SEARCH) {
		this._queryInputEl.value = organizer.search.query;
		this._props.setPropertyVisible(this._queryId, true);
	}
	else {
		this._props.setPropertyVisible(this._queryId, false);
	}

	this._ownerEl.innerHTML = AjxStringUtil.htmlEncode(organizer.owner);
	this._typeEl.innerHTML = ZmMsg[ZmOrganizer.FOLDER_KEY[organizer.type]] || ZmMsg.folder;

    this._excludeFbCheckbox.checked = organizer.excludeFreeBusy;

	var showPerm = organizer.isMountpoint;
	if (showPerm) {
		AjxDispatcher.require("Share");
		var share = ZmShare.getShareFromLink(organizer);
		var role = share && share.link && share.link.role;
		this._permEl.innerHTML = ZmShare.getRoleActions(role);
	}

    var url = organizer.url ? AjxStringUtil.htmlEncode(organizer.url).replace(/&amp;/g,'%26') : null;
	var urlDisplayString = url;
	if (urlDisplayString) {
		urlDisplayString = [ '<a target=_new href="',url,'">', AjxStringUtil.clipByLength(urlDisplayString, 50), '</a>' ].join("");
	}

    this._urlEl.innerHTML = urlDisplayString || "";

	this._props.setPropertyVisible(this._ownerId, organizer.owner != null);

	this._props.setPropertyVisible(this._urlId, organizer.url);
	this._props.setPropertyVisible(this._permId, showPerm);
    $('#folderOfflineLblId').val(organizer.webOfflineSyncDays || 0)

	Dwt.setVisible(this._excludeFbEl, !organizer.link && (organizer.type == ZmOrganizer.CALENDAR));
	// TODO: False until server handling of the flag is added
	//Dwt.setVisible(this._globalMarkReadEl, organizer.type == ZmOrganizer.FOLDER);
    Dwt.setVisible(this._globalMarkReadEl, false);

	if (this._offlineId) {
		var enabled = false;
		if (!organizer.isMountpoint) {
			enabled = (this._organizer.type == ZmOrganizer.FOLDER);
		}
		this._props.setPropertyVisible(this._offlineId, enabled);
	}
};


ZmFolderPropertyView.prototype._handleRenameError =
function(response) {
	var value = this._nameInputEl.value;
    var type = appCtxt.getFolderTree(appCtxt.getActiveAccount()).getFolderTypeByName(value);
	var msg;
	var noDetails = false;
	if (response.code == ZmCsfeException.MAIL_ALREADY_EXISTS) {
		msg = AjxMessageFormat.format(ZmMsg.errorAlreadyExists, [value,ZmMsg[type.toLowerCase()]]);
	} else if (response.code == ZmCsfeException.MAIL_IMMUTABLE) {
		msg = AjxMessageFormat.format(ZmMsg.errorCannotRename, [value]);
	} else if (response.code == ZmCsfeException.SVC_INVALID_REQUEST) {
		msg = response.msg; // triggered on an empty name
	} else if (response.code == ZmCsfeException.MAIL_INVALID_NAME) {
		//I add this here despite checking upfront using ZmOrganizer.checkName, since there might be more restrictions for different types of organizers. so just in case the server still returns an error in the name.
		msg = AjxMessageFormat.format(ZmMsg.invalidName, [AjxStringUtil.htmlEncode(value)]);
		noDetails = true;
	}
	appCtxt.getAppController().popupErrorDialog(msg, noDetails ? null : response.msg, null, true);
	return true;
};

// TODO: This seems awkward. Should use a template.
ZmFolderPropertyView.prototype._createView = function() {

	// create html elements
	this._nameOutputEl = document.createElement("SPAN");
	this._nameInputEl = document.createElement("INPUT");
	this._nameInputEl.style.width = "20em";
	this._nameInputEl._dialog = this;
	var nameElement = this._nameInputEl;

	this._queryInputEl = document.createElement("INPUT");
	this._queryInputEl.style.width = "20em";
	this._queryInputEl._dialog = this;
	var queryElement = this._queryInputEl;

	this._ownerEl = document.createElement("DIV");
	this._typeEl = document.createElement("DIV");
	this._urlEl = document.createElement("DIV");
	this._permEl = document.createElement("DIV");

	this._unreadEl = document.createElement("SPAN");
	this._totalEl = document.createElement("SPAN");
	this._sizeEl = document.createElement("SPAN");

	var nameEl = document.createElement("DIV");
	nameEl.appendChild(this._nameOutputEl);
	nameEl.appendChild(nameElement);

	var queryEl = document.createElement("DIV");
	queryEl.appendChild(queryElement);

	var excludeFbEl      = this._createCheckboxItem("excludeFb",        ZmMsg.excludeFromFreeBusy);
	var globalMarkReadEl = this._createCheckboxItem("globalMarkRead",   ZmMsg.globalMarkRead);

	this._props = new DwtPropertySheet(this);
	this._color = new ZmColorButton({parent:this});

	var namePropId = this._props.addProperty(ZmMsg.nameLabel, nameEl);
	this._props.addProperty(ZmMsg.typeLabel, this._typeEl);
	this._queryId = this._props.addProperty(ZmMsg.queryLabel, queryEl);
	this._ownerId = this._props.addProperty(ZmMsg.ownerLabel,  this._ownerEl);
	this._urlId   = this._props.addProperty(ZmMsg.urlLabel,    this._urlEl);
	this._permId  = this._props.addProperty(ZmMsg.permissions, this._permEl);
	this._colorId = this._props.addProperty(ZmMsg.colorLabel,  this._color);
	this._totalId = this._props.addProperty(AjxMessageFormat.format(ZmMsg.makeLabel, ZmMsg.messages),  this._totalEl);
	this._unreadId = this._props.addProperty(AjxMessageFormat.format(ZmMsg.makeLabel, ZmMsg.unread),  this._unreadEl);
	this._sizeId = this._props.addProperty(ZmMsg.sizeLabel,  this._sizeEl);

    if (appCtxt.isWebClientOfflineSupported) {
        this._offlineEl = document.createElement("DIV");
		this._offlineEl.style.whiteSpace = "nowrap";
		this._offlineEl.innerHTML = ZmMsg.offlineFolderSyncInterval;
        this._offlineId = this._props.addProperty(ZmMsg.offlineLabel,  this._offlineEl);
    }

    var container = this.getHtmlElement();
	container.appendChild(this._props.getHtmlElement());
	container.appendChild(excludeFbEl);
	container.appendChild(globalMarkReadEl);
	this._contentEl = container;

	this._tabGroup.addMember(this._props.getTabGroupMember());
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFolderRetentionView")) {
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

/**
 * @overview
 */

// Creates a folder retention view for the folder dialog
ZmFolderRetentionView = function(dialog, parent) {
    if (arguments.length == 0) return;
    ZmFolderDialogTabView.call(this, parent);

    this._dialog = dialog;
    this._initialized = false;
	// Make sure mouse down clicks propagate to the select controls
	this._propagateEvent[DwtEvent.ONMOUSEDOWN] = true;
};

ZmFolderRetentionView.prototype = new ZmFolderDialogTabView;
ZmFolderRetentionView.prototype.constructor = ZmFolderRetentionView;

// Data to populate and process the custom units and values
ZmFolderRetentionView._CustomUnitsToDays = { year: 366, month:31, week:7, day:1};
ZmFolderRetentionView._CustomUnits = [
    { id:"day",   label: ZmMsg.days.toLowerCase(),   days: ZmFolderRetentionView._CustomUnitsToDays.day},
    { id:"week",  label: ZmMsg.weeks.toLowerCase(),  days: ZmFolderRetentionView._CustomUnitsToDays.week},
    { id:"month", label: ZmMsg.months.toLowerCase(), days: ZmFolderRetentionView._CustomUnitsToDays.month},
    { id:"year",  label: ZmMsg.years.toLowerCase(),  days: ZmFolderRetentionView._CustomUnitsToDays.year}];



ZmFolderRetentionView.prototype.toString =
function() {
	return "ZmFolderRetentionView";
};

ZmFolderRetentionView.prototype.getTitle =
function() {
    return ZmMsg.folderTabRetention;
}

ZmFolderRetentionView.prototype.showMe =
function() {
	DwtTabViewPage.prototype.showMe.call(this);
    this._dialog.setButtonVisible(ZmFolderPropsDialog.ADD_SHARE_BUTTON, false);

	this.setSize(Dwt.DEFAULT, "200");

};

ZmFolderRetentionView.prototype._handleFolderChange =
function() {
    // Read the policies from the server, and add 'Custom'
    if (this._initialized) {
        this._dataBindComponents(this._organizer, ZmOrganizer.RETENTION_KEEP);
        this._dataBindComponents(this._organizer, ZmOrganizer.RETENTION_PURGE);
    } else {
        var systemPolicies = new ZmSystemRetentionPolicy();
        systemPolicies.getPolicies(this._processSystemPolicies.bind(this));
        this._setBusy(true);
    }
}

ZmFolderRetentionView.prototype._processSystemPolicies =
function(systemKeepPolicies, systemPurgePolicies) {

    this._populatePolicySelect(ZmOrganizer.RETENTION_KEEP,  systemKeepPolicies);
    this._populatePolicySelect(ZmOrganizer.RETENTION_PURGE, systemPurgePolicies);

    this._dataBindComponents(this._organizer, ZmOrganizer.RETENTION_KEEP);
    this._dataBindComponents(this._organizer, ZmOrganizer.RETENTION_PURGE);

    this._initialized = true;
    this._setBusy(false);
}


ZmFolderRetentionView.prototype._dataBindComponents =
function(organizer, policyElement) {
    var components = this._components[policyElement];
    components.policyEnable.checked = false;

    var policy = organizer.getRetentionPolicy(policyElement);
    if (policy) {
        // The organizer has a retention policy
        components.policyEnable.checked = true;

        if (policy.type == "user") {
            // Custom policy defined.
            components.policySelect.selectedIndex = components.policySelect.options.length-1;
            // parseInt will discard the unit
            var lifetime = parseInt(policy.lifetime);
            // In case someone used SOAP to specify a custom policy, convert it
            // to days (which is the smallest unit we can handle via the UI).
            var conversionFactor = 1;
            // Intervals taken from DateUtil.java
            var interval = policy.lifetime.slice(policy.lifetime.length-1);
            switch (interval) {
                case  "d": conversionFactor =  1; break;
                case  "h": conversionFactor = 24; break;
                case  "m": conversionFactor = AjxDateUtil.MINUTES_PER_DAY; break;
                case  "s": conversionFactor = AjxDateUtil.SECONDS_PER_DAY; break;
                case "ms": conversionFactor = AjxDateUtil.MSEC_PER_DAY;    break;
                default  : conversionFactor = AjxDateUtil.SECONDS_PER_DAY; break;
            }
            var days = Math.floor((lifetime-1)/conversionFactor) + 1;

            // Convert lifetime to the best fit for unit and amount.  Start with year,
            // proceed to smaller units.  If the amount in days is evenly divisible by the
            // days for a unit, use that unit
            for (var i = ZmFolderRetentionView._CustomUnits.length-1; i >= 0; i--) {
                if ((days >= ZmFolderRetentionView._CustomUnits[i].days) &&
                    ((days % ZmFolderRetentionView._CustomUnits[i].days) == 0)) {
                    components.customUnit.selectedIndex = i;
                    components.customValue.value = days/ZmFolderRetentionView._CustomUnits[i].days;
                    break;
                }
            }
        } else {
            // System policy, find the match in the policy selection pull down
            for (var i = 0; i < components.policySelect.options.length; i++) {
                if (components.policySelect.options[i].value == policy.id) {
                    components.policySelect.selectedIndex = i;
                    break;
                }
            }
            // Reset custom fields to their defaults
            components.customUnit.selectedIndex   = 0;
            components.customValue.value          = "";
        }
    }
    if (!components.policyEnable.checked) {
        // No policy of this type (keep/purge) reset the selects and input fields
        components.policySelect.selectedIndex = 0;
        // Default to the largest unit to reduce the chance of an inadvertent tiny deletion period
        components.customUnit.selectedIndex   =  components.customUnit.options.length-1;
        components.customValue.value          = "";
    }
    this._handleSelectionChange(policyElement);
    this._handleEnableClick(policyElement);
}


/**  doSave will be invoked for each tab view.
 *
 * @param	{BatchCommand}	batchCommand	Accumulates updates from all tabs
 * @param	{Object}	    saveState		Accumulates error messages and indication of any update
 */
ZmFolderRetentionView.prototype.doSave =
function(batchCommand, saveState) {
	if (!this._handleErrorCallback) {
		this._handleErrorCallback = new AjxCallback(this, this._handleError);
	}

    var organizer = this._organizer;

    var initialErrorCount = saveState.errorMessage.length;
    var newRetentionPolicy = { };
    // Create policy objects from the UI fields, attach to the newRetentionPolicy variable
    this._createPolicy(newRetentionPolicy, ZmOrganizer.RETENTION_KEEP,  saveState);
    this._createPolicy(newRetentionPolicy, ZmOrganizer.RETENTION_PURGE, saveState);

    if (initialErrorCount == saveState.errorMessage.length) {
        var keepPolicy  = organizer.getRetentionPolicy(ZmOrganizer.RETENTION_KEEP);
        var purgePolicy = organizer.getRetentionPolicy(ZmOrganizer.RETENTION_PURGE);
        if (organizer.policiesDiffer(keepPolicy,  newRetentionPolicy.keep) ||
            organizer.policiesDiffer(purgePolicy, newRetentionPolicy.purge)) {
            // Retention policy has changed
            batchCommand.add(new AjxCallback(organizer, organizer.setRetentionPolicy,
                             [newRetentionPolicy, null, this._handleErrorCallback]));
            saveState.commandCount++;
        }
    }

};


// Create a retention policy object from UI components for processing by the
// organizer.setRetentionPolicy
ZmFolderRetentionView.prototype._createPolicy =
function(retentionPolicy, policyElement, saveState) {
    var components = this._components[policyElement];

    var policy;
    if (components.policyEnable.checked) {
        // A keep or Purge retention policy is defined
        var policySelection = components.policySelect.options[components.policySelect.selectedIndex].value;
        var policyType;
        if (policySelection == "custom") {
            policyType = "user";
            var unit   = components.customUnit.options[components.customUnit.selectedIndex].value;
            // Parse the custom value field to get the number of units
            var invalidCustomValue = false;
            var amountText = AjxStringUtil.trim(components.customValue.value);
            if (!amountText) {
                invalidCustomValue = true;
            } else {
                var amount = 0;
                var nonNumericIndex = amountText.search(/\D/);
                if (nonNumericIndex == -1) {
                    amount = parseInt(amountText);
                }

                if (amount <= 0) {
                    invalidCustomValue = true;
                } else {
                    var daysPerUnit = ZmFolderRetentionView._CustomUnitsToDays[unit];
                    var lifetime = (amount * daysPerUnit).toString() + "d";
                    policy = {type:"user", lifetime:lifetime};
                }
            }
            if (invalidCustomValue) {
                var  errorMessage = (policyElement == ZmOrganizer.RETENTION_KEEP) ?
                                     ZmMsg.retentionKeepLifetimeAmount : ZmMsg.retentionPurgeLifetimeAmount;
                saveState.errorMessage.push(errorMessage);
            }
        } else {
            policy = {type:"system", id:policySelection};
        }
    }
    retentionPolicy[policyElement] = policy;
}


ZmFolderRetentionView.prototype._populatePolicySelect =
function(policyElement, systemPolicies) {
    var components = this._components[policyElement];
    components.policies = systemPolicies ? systemPolicies : [];
	
	var sorted = {};
	for (var i=0; i< components.policies.length; i++) {
		sorted[components.policies[i].name] =  components.policies[i].id;
	}
	
	var sortedKeys = AjxUtil.getHashKeys(sorted);
	sortedKeys.push(ZmMsg.custom);  //append custom to the end
	sorted[ZmMsg.custom] = "custom";
    components.policySelect.options.length = 0;
    for (var i = 0; i < sortedKeys.length; i++) {
        components.policySelect.options[i] = new Option(sortedKeys[i], sorted[sortedKeys[i]]);
    }
}


ZmFolderRetentionView.prototype._handleEnableClick =
function(policyElement) {
    var components = this._components[policyElement];
    var disabled = !components.policyEnable.checked;
    components.policySelect.disabled = disabled;
    components.customValue.disabled  = disabled;
    components.customUnit.disabled   = disabled;
}

ZmFolderRetentionView.prototype._handleSelectionChange = function(policyElement) {

    var components = this._components[policyElement],
        policySelect   = components.policySelect,
	    selectedOption = policySelect.options[policySelect.selectedIndex],
        policySelection = selectedOption.value,
        visible = (policySelection == "custom");

    // Show hide the custom unit and values fields based on whether the policy
    // selected is a system defined policy, or custom
    components.customValue.style.visibility = visible ? "visible" : "hidden";
    components.customUnit.style.visibility  = visible ? "visible" : "hidden";

	// accessibility
	policySelect.setAttribute('aria-label', AjxMessageFormat.format(ZmMsg.policyTypeLabel, selectedOption.innerHTML));
};

ZmFolderRetentionView.prototype._createView =
function() {
	// Create html elements
    this._id = Dwt.getNextId();
    var params = {
        id: this._id
    }

    var container = this.getHtmlElement();
    container.innerHTML = AjxTemplate.expand("share.Dialogs#ZmFolderRetentionView", params);

    this._components = {};
    this._setupComponents(ZmOrganizer.RETENTION_KEEP,  this._components);
    this._setupComponents(ZmOrganizer.RETENTION_PURGE, this._components);

    this._createBusyOverlay(container);
    this._contentEl = container;
};

ZmFolderRetentionView.prototype._setupComponents =
function(policyElement, allComponents) {

    var components = {};
    allComponents[policyElement] = components;

    components.policyEnable = document.getElementById(this._id + "_" + policyElement + "Checkbox");
    components.policySelect = document.getElementById(this._id + "_" + policyElement);
    components.customValue  = document.getElementById(this._id + "_" + policyElement + "Value");
    components.customUnit   = document.getElementById(this._id + "_" + policyElement + "Unit");

    for (var i = 0; i < ZmFolderRetentionView._CustomUnits.length; i++) {
        var unit = ZmFolderRetentionView._CustomUnits[i];
        components.customUnit.options[i] = new Option(unit.label, unit.id);
    }

	this._tabGroup.addMember(components.policyEnable);
	this._tabGroup.addMember(components.policySelect);
	this._tabGroup.addMember(components.customValue);
	this._tabGroup.addMember(components.customUnit);

    Dwt.setHandler(components.policyEnable, "onclick", this._handleEnableClick.bind(this, policyElement));
    Dwt.setHandler(components.policySelect, "onclick", this._handleSelectionChange.bind(this, policyElement));
}
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmFolderPropsDialog")) {
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
 * Creates a folder properties dialog.
 * @class
 * This class represents a folder properties dialog.
 * 
 * @param	{DwtControl}	parent		the parent
 * @param	{String}	className		the class name
 * 
 * @extends		DwtDialog
 */
ZmFolderPropsDialog = function(parent, className) {
	className = className || "ZmFolderPropsDialog";
	var extraButtons;
	if (appCtxt.get(ZmSetting.SHARING_ENABLED))	{
		extraButtons = [
			new DwtDialog_ButtonDescriptor(ZmFolderPropsDialog.ADD_SHARE_BUTTON, ZmMsg.addShare, DwtDialog.ALIGN_LEFT)
		];
	}


	DwtDialog.call(this, {parent:parent, className:className, title:ZmMsg.folderProperties, extraButtons:extraButtons, id:"FolderProperties"});

	this._tabViews  = [];
	this._tabKeys   = [];
	this._tabInUse  = [];
	this._tabKeyMap = {};

	if (appCtxt.get(ZmSetting.SHARING_ENABLED))	{
		this.registerCallback(ZmFolderPropsDialog.ADD_SHARE_BUTTON, this._handleAddShareButton, this);
	}
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));

	this._folderChangeListener = new AjxListener(this, this._handleFolderChange);

	this._createView();
	this._initializeTabGroup();
};

ZmFolderPropsDialog.prototype = new DwtDialog;
ZmFolderPropsDialog.prototype.constructor = ZmFolderPropsDialog;

// Constants

ZmFolderPropsDialog.ADD_SHARE_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmFolderPropsDialog.SHARES_HEIGHT = "9em";

// Tab identifiers
ZmFolderPropsDialog.TABKEY_PROPERTIES	= "PROPERTIES_TAB";
ZmFolderPropsDialog.TABKEY_RETENTION 	= "RETENTION_TAB";


// Public methods

ZmFolderPropsDialog.prototype.toString =
function() {
	return "ZmFolderPropsDialog";
};

ZmFolderPropsDialog.prototype.getTabKey =
function(id) {
	var index = this._tabKeyMap[id];
	return this._tabKeys[index];
};

/**
 * Pops-up the properties dialog.
 * 
 * @param	{ZmOrganizer}	organizer		the organizer
 */
ZmFolderPropsDialog.prototype.popup =
function(organizer) {
	this._organizer = organizer;
    for (var i = 0; i < this._tabViews.length; i++) {
        this._tabViews[i].setOrganizer(organizer);
    }
    // On popup, make the property view visible
	var tabKey = this.getTabKey(ZmFolderPropsDialog.TABKEY_PROPERTIES);
	this._tabContainer.switchToTab(tabKey, true);

	organizer.addChangeListener(this._folderChangeListener);

	this._handleFolderChange();
	if (appCtxt.get(ZmSetting.SHARING_ENABLED))	{
		var isShareable = ZmOrganizer.SHAREABLE[organizer.type];

		var isVisible = (!organizer.link || organizer.isAdmin());
		this.setButtonVisible(ZmFolderPropsDialog.ADD_SHARE_BUTTON, isVisible && isShareable);
	}

	DwtDialog.prototype.popup.call(this);
};

ZmFolderPropsDialog.prototype.popdown =
function() {
	if (this._organizer) {
		this._organizer.removeChangeListener(this._folderChangeListener);
		this._organizer = null;
	}
	DwtDialog.prototype.popdown.call(this);
};

// Protected methods

ZmFolderPropsDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};

ZmFolderPropsDialog.prototype._handleEditShare =
function(event, share) {
	share = share || Dwt.getObjectFromElement(DwtUiEvent.getTarget(event));
	var sharePropsDialog = appCtxt.getSharePropsDialog();

	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (share.object.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	sharePropsDialog.popup(ZmSharePropsDialog.EDIT, share.object, share);
	return false;
};

ZmFolderPropsDialog.prototype._handleRevokeShare =
function(event, share) {
	share = share || Dwt.getObjectFromElement(DwtUiEvent.getTarget(event));
	var revokeShareDialog = appCtxt.getRevokeShareDialog();
	revokeShareDialog.popup(share);
	return false;
};

ZmFolderPropsDialog.prototype._handleResendShare =
function(event, share) {

	AjxDispatcher.require("Share");
	share = share || Dwt.getObjectFromElement(DwtUiEvent.getTarget(event));

	// create share info
	var tmpShare = new ZmShare({object:share.object});
	tmpShare.grantee.id = share.grantee.id;
	tmpShare.grantee.email = (share.grantee.type == "guest") ? share.grantee.id : share.grantee.name;
	tmpShare.grantee.name = share.grantee.name;
    if (tmpShare.object.isRemote()) {
		tmpShare.grantor.id = tmpShare.object.zid;
		tmpShare.grantor.email = tmpShare.object.owner;
		tmpShare.grantor.name = tmpShare.grantor.email;
		tmpShare.link.id = tmpShare.object.rid;
	} else {
		tmpShare.grantor.id = appCtxt.get(ZmSetting.USERID);
		tmpShare.grantor.email = appCtxt.get(ZmSetting.USERNAME);
		tmpShare.grantor.name = appCtxt.get(ZmSetting.DISPLAY_NAME) || tmpShare.grantor.email;
		tmpShare.link.id = tmpShare.object.id;
	}

	tmpShare.link.name = share.object.name;
	tmpShare.link.view = ZmOrganizer.getViewName(share.object.type);
	tmpShare.link.perm = share.link.perm;

	if (share.grantee.type == "guest") {
        // Pass action as ZmShare.NEW even for resend for external user
        tmpShare._sendShareNotification(tmpShare.grantee.email, tmpShare.link.id, "", ZmShare.NEW);
	}
    else {
	    tmpShare.sendMessage(ZmShare.NEW);
    }
	appCtxt.setStatusMsg(ZmMsg.resentShareMessage);

	return false;
};

ZmFolderPropsDialog.prototype._handleAddShareButton =
function(event) {
	var sharePropsDialog = appCtxt.getSharePropsDialog();

	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (this._organizer.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}
	
	sharePropsDialog.popup(ZmSharePropsDialog.NEW, this._organizer, null);
};

ZmFolderPropsDialog.prototype._handleOkButton =
function(event) {

	// New batch command, stop on error
	var batchCommand = new ZmBatchCommand(null, null, true);
    var saveState = {
        commandCount: 0,
        errorMessage: []
    };
    for (var i = 0; i < this._tabViews.length; i++) {
        if (this._tabInUse[i]) {
            // Save all in use tabs
            this._tabViews[i].doSave(batchCommand, saveState);
        }
    }

    if (saveState.errorMessage.length > 0) {
        var msg = saveState.errorMessage.join("<br>");
        var dialog = appCtxt.getMsgDialog();
        dialog.reset();
        dialog.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
        dialog.popup();
    }  else if (saveState.commandCount > 0) {
        var callback = new AjxCallback(this, this.popdown);
        batchCommand.run(callback);
    } else {
        this.popdown();
    }
};



ZmFolderPropsDialog.prototype._handleError =
function(response) {
	// Returned 'not handled' so that the batch command will preform the default
	// ZmController._handleException
	return false;
};


ZmFolderPropsDialog.prototype._handleCancelButton =
function(event) {
	this.popdown();
};

ZmFolderPropsDialog.prototype._handleFolderChange =
function(event) {
	var organizer = this._organizer;

    // Get the components that will be hidden or displayed
    var tabBar = this._tabContainer.getTabBar();
    var tabKey = this.getTabKey(ZmFolderPropsDialog.TABKEY_RETENTION);
    var retentionTabButton = this._tabContainer.getTabButton(tabKey);
    var retentionIndex = this._tabKeyMap[ZmFolderPropsDialog.TABKEY_RETENTION];

    if ((organizer.type != ZmOrganizer.FOLDER) || organizer.link) {
        // Not a folder, or shared - hide the retention view (and possibly the toolbar)
        this._tabInUse[retentionIndex] = false;
        if (this._tabViews.length > 2) {
            // More than two tabs, hide the retention tab, leave the toolbar intact
            tabBar.setVisible(true);
            retentionTabButton.setVisible(false);
        } else {
            // Two or fewer tabs.  Hide the toolbar, just let the properties view display standalone
            // (On popup, the display defaults to the property view)
            tabBar.setVisible(false);
        }
    } else {
        // Using the retention tab view - show the toolbar and all tabs
        this._tabInUse[retentionIndex] = true;
        retentionTabButton.setVisible(true);
        tabBar.setVisible(true);
    }

    for (var i = 0; i < this._tabViews.length; i++) {
        if (this._tabInUse[i]) {
            // Update all in use tabs to use the specified folder
            this._tabViews[i]._handleFolderChange(event);
        }
    }

	if (appCtxt.get(ZmSetting.SHARING_ENABLED))	{
		this._populateShares(organizer);
	}

};

ZmFolderPropsDialog.prototype._populateShares =
function(organizer) {

	this._sharesGroup.setContent("");

	var displayShares = this._getDisplayShares(organizer);

	var getFolder = false;
	if (displayShares.length) {
		for (var i = 0; i < displayShares.length; i++) {
			var share = displayShares[i];
			if (!(share.grantee && share.grantee.name)) {
				getFolder = true;
			}
		}
	}

	if (getFolder) {
		var respCallback = new AjxCallback(this, this._handleResponseGetFolder, [displayShares]);
		organizer.getFolder(respCallback);
	} else {
		this._handleResponseGetFolder(displayShares);
	}


	this._sharesGroup.setVisible(displayShares.length > 0);
};

ZmFolderPropsDialog.prototype._getDisplayShares =
function(organizer) {

	var shares = organizer.shares;
	var displayShares = [];
	if ((!organizer.link || organizer.isAdmin()) && shares && shares.length > 0) {
		AjxDispatcher.require("Share");
		var userZid = appCtxt.accountList.mainAccount.id;
		// if a folder was shared with us with admin rights, a share is created since we could share it;
		// don't show any share that's for us in the list
		for (var i = 0; i < shares.length; i++) {
			var share = shares[i];
			if (share.grantee) {
				var granteeId = share.grantee.id;
				if ((share.grantee.type != ZmShare.TYPE_USER) || (share.grantee.id != userZid)) {
					displayShares.push(share);
				}
			}
		}
	}

	return displayShares;
};

ZmFolderPropsDialog.prototype._handleResponseGetFolder =
function(displayShares, organizer) {

	if (organizer) {
		displayShares = this._getDisplayShares(organizer);
	}

	if (displayShares.length) {
		var table = document.createElement("TABLE");
		table.setAttribute('role', 'presentation');
		table.className = "ZPropertySheet";
		table.cellSpacing = "6";
		for (var i = 0; i < displayShares.length; i++) {
			var share = displayShares[i];
			var row = table.insertRow(-1);
			var nameEl = row.insertCell(-1);
			nameEl.style.paddingRight = "15px";
			var nameText = share.grantee && share.grantee.name;
			if (share.isAll()) {
				nameText = ZmMsg.shareWithAll;
			} else if (share.isPublic()) {
				nameText = ZmMsg.shareWithPublic;
			} else if (share.isGuest()){
				nameText = nameText || (share.grantee && share.grantee.id);
			}
			nameEl.innerHTML = AjxStringUtil.htmlEncode(nameText);

			var roleEl = row.insertCell(-1);
			roleEl.style.paddingRight = "15px";
			roleEl.innerHTML = ZmShare.getRoleName(share.link.role);

			this.__createCmdCells(row, share);
		}
		this._sharesGroup.setElement(table);

		var width = Dwt.DEFAULT;
		var height = displayShares.length > 5 ? ZmFolderPropsDialog.SHARES_HEIGHT : Dwt.CLEAR;

		var insetElement = this._sharesGroup.getInsetHtmlElement();
		Dwt.setScrollStyle(insetElement, Dwt.SCROLL);
		Dwt.setSize(insetElement, width, height);
	}

	this._sharesGroup.setVisible(displayShares.length > 0);
};

ZmFolderPropsDialog.prototype.__createCmdCells =
function(row, share) {
	var type = share.grantee.type;
	if (type == ZmShare.TYPE_DOMAIN || !share.link.role) {
		var cell = row.insertCell(-1);
		cell.colSpan = 3;
		cell.innerHTML = ZmMsg.configureWithAdmin;
		return;
	}

	var actions = [ZmShare.EDIT, ZmShare.REVOKE, ZmShare.RESEND];
	var handlers = [this._handleEditShare, this._handleRevokeShare, this._handleResendShare];

	for (var i = 0; i < actions.length; i++) {
		var action = actions[i];
		var cell = row.insertCell(-1);

		// public shares have no editable fields, and sent no mail
		var isAllShare = share.grantee && (share.grantee.type == ZmShare.TYPE_ALL);
        // Fix for bug: 76685. Removed share.isGuest() from the condition and it adds edit cmd link
		if (((isAllShare || share.isPublic()) && (action == ZmShare.EDIT)) ||
            ((isAllShare || share.isPublic()) && action == ZmShare.RESEND)) { continue; }

		var link = document.createElement("A");
		link.href = "#";
		link.innerHTML = ZmShare.ACTION_LABEL[action];

		Dwt.setHandler(link, DwtEvent.ONCLICK, handlers[i]);
		Dwt.associateElementWithObject(link, share);
		this._sharesGroup.getTabGroupMember().addMember(link);

		cell.appendChild(link);
	}
};

ZmFolderPropsDialog.prototype.addTab =
function(index, id, tabViewPage) {
	if (!this._tabContainer || !tabViewPage) { return null; }

	this._tabViews[index] = tabViewPage;
	this._tabKeys[index]  = this._tabContainer.addTab(tabViewPage.getTitle(), tabViewPage);
	this._tabInUse[index] = true;
	this._tabKeyMap[id] = index;
	return this._tabKeys[index];
};

ZmFolderPropsDialog.prototype._initializeTabView =
function(view) {
    this._tabContainer = new DwtTabView(view, null, Dwt.STATIC_STYLE);

	//ZmFolderPropertyView handle things such as color and type. (in case you're searching for "color" and can't find in this file. I know I did)
    this.addTab(0, ZmFolderPropsDialog.TABKEY_PROPERTIES, new ZmFolderPropertyView(this, this._tabContainer));
    this.addTab(1, ZmFolderPropsDialog.TABKEY_RETENTION,  new ZmFolderRetentionView(this, this._tabContainer));

	// setup shares group
	if (appCtxt.get(ZmSetting.SHARING_ENABLED))	{
        this._sharesGroup = new DwtGrouper(view, "DwtGrouper ZmFolderPropSharing");
		this._sharesGroup.setLabel(ZmMsg.folderSharing);
		this._sharesGroup.setVisible(false);
		this._sharesGroup.setScrollStyle(Dwt.SCROLL);
        view.getHtmlElement().appendChild(this._sharesGroup.getHtmlElement());
	}
};

// This creates the tab views managed by this dialog, the tabToolbar, and
// the share buttons and view components
ZmFolderPropsDialog.prototype._createView =
function() {
    this._baseContainerView = new DwtComposite({parent:this, className:"ZmFolderPropertiesDialog-container "});
    this._initializeTabView(this._baseContainerView);
    this.setView(this._baseContainerView);
};

ZmFolderPropsDialog.prototype._initializeTabGroup = function() {

	if (this._sharesGroup) {
		this._tabGroup.addMember(this._sharesGroup.getTabGroupMember(), 0);
	}
	this._tabGroup.addMember(this._tabContainer.getTabGroupMember(), 0);
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmQuickAddDialog")) {
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
 * @overview
 */

/**
 * Creates a generic quick add dialog (which basically mean it has different 
 * than regular dialogs). Dialogs always hang off the main shell since their stacking order
 * is managed through z-index. See "dwt.Widgets#DwtSemiModalDialog" template.
 * @class
 * This class represents a modal dialog which has at least a title and the 
 * standard buttons (OK/Cancel) and widgets (i.e. buttons, etc) as necessary.
 * 
 * @author Parag Shah
 * 
 * @param {DwtComposite}	parent				the parent widget (the shell)
 * @param {String}	title				a title for the dialog
 * @param {Array}	standardButtons		a list of standard button IDs (default is [{@link DwtDialog.OK_BUTTON}, {@link DwtDialog.CANCEL_BUTTON}])
 * @param {Array}	extraButtons 		any extra buttons to be added in addition to the standard ones
 * @param {Object}	loc				where to popup (optional)
 * 
 * @extends		DwtDialog
 */
ZmQuickAddDialog = function(parent, title, standardButtons, extraButtons, loc) {
	if (arguments.length == 0) return;

	DwtDialog.call(this, {parent:parent, title:title, standardButtons:standardButtons,
						  extraButtons:extraButtons, loc:loc});
};

ZmQuickAddDialog.prototype = new DwtDialog;
ZmQuickAddDialog.prototype.constructor = ZmQuickAddDialog;

ZmQuickAddDialog.prototype.toString =
function() {
	return "ZmQuickAddDialog";
};

//
// Data
//

ZmQuickAddDialog.prototype.TEMPLATE = "dwt.Widgets#DwtSemiModalDialog";

//
// Public methods
//

/**
 * Adds a selection listener.
 * 
 * @param	{String}		buttonId		the button id
 * @param	{AjxListener}	listener		the listener
 */
ZmQuickAddDialog.prototype.addSelectionListener = 
function(buttonId, listener) {
	this._button[buttonId].addSelectionListener(listener);
};
}
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmTimeDialog")) {
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
 * Creates a generic time picker dialog
 * @constructor
 * @class
 * 
 * @extends		ZmDialog
 * 
 */
ZmTimeDialog = function(params) {
	params.id = Dwt.getNextId("ZmTimeDialog_");
	ZmDialog.call(this, params);
	var html = AjxTemplate.expand("share.Dialogs#ZmTimeDialog", {id: this._htmlElId, description: ZmMsg.sendLaterDescription, label: ZmMsg.time});
	this.setContent(html);
	this.setTitle(ZmMsg.sendLaterTitle);
	this._createDwtObjects();
};

ZmTimeDialog.prototype = new ZmDialog;
ZmTimeDialog.prototype.constructor = ZmTimeDialog;

// Public

ZmTimeDialog.prototype.toString = 
function() {
	return "ZmTimeDialog";
};

ZmTimeDialog.prototype.initialize = 
function() {
	// Init Date / time picker
	var now = new Date();
	this._dateField.value = AjxDateUtil.simpleComputeDateStr(now);
	this.showTimeFields(true);
	this._timeSelect.set(now);

	// Init Timezone picker
	var options = AjxTimezone.getAbbreviatedZoneChoices();
	var serverIdMap = {};
	var serverId;
	if (options.length != this._tzCount) {
		this._tzCount = options.length;
		this._tzoneSelect.clearOptions();
		for (var i = 0; i < options.length; i++) {
			if (!options[i].autoDetected) {
				serverId = options[i].value;
				serverIdMap[serverId] = true;
				this._tzoneSelect.addOption(options[i]);
			}
		}
	}
	this.autoSelectTimezone();
};



ZmTimeDialog.prototype.isValid = 
function() {
	return true;
};

ZmTimeDialog.prototype.isDirty = 
function() {
	return true;
};

ZmTimeDialog.prototype.getValue =
function() {
	var date = this._timeSelect.getValue(AjxDateUtil.simpleParseDateStr(this._dateField.value));
	var timezone = this._tzoneSelect.getValue();
	return {date: date, timezone: timezone};
}

ZmTimeDialog.prototype.isValidDateStr =
function() {
    return AjxDateUtil.isValidSimpleDateStr(this._dateField.value);
};

ZmTimeDialog.prototype.popup =
function() {
	this.initialize();
	ZmDialog.prototype.popup.call(this);
	if (!this._tabGroupComplete) {
		var members = [this._dateField, this._dateButton, this._timeSelect.getInputField(), this._tzoneSelect];
		for (var i = 0; i < members.length; i++) {
			this._tabGroup.addMember(members[i], i);
		}
		this._tabGroupComplete = true;
	}
	this._tabGroup.setFocusMember(this._dateField);
};

// Private / protected methods

ZmTimeDialog.prototype._createDwtObjects =
function() {

	var dateButtonListener = new AjxListener(this, this._dateButtonListener);
	var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);

	this._dateButton = this.createMiniCalButton(this._htmlElId + "_miniCal", dateButtonListener, dateCalSelectionListener);

	// create selects for Time section
	var timeSelectListener = new AjxListener(this, this._timeChangeListener);
	
	this._timeSelect = new DwtTimeInput(this, DwtTimeInput.START);
	this._timeSelect.addChangeListener(timeSelectListener);
	this._timeSelect.reparentHtmlElement(this._htmlElId + "_time");

	this._dateField = Dwt.byId(this._htmlElId + "_date");

	this._tzoneSelect = new DwtSelect({parent:this, parentElement: (this._htmlElId + "_tzSelect"), layout:DwtMenu.LAYOUT_SCROLL, maxRows: 7, id: Dwt.getNextId("TimeZoneSelect_")});
};

ZmTimeDialog.prototype.showTimeFields = 
function(show) {
	Dwt.setVisibility(this._timeSelect.getHtmlElement(), show);
};

// Listeners

ZmTimeDialog.prototype._dateButtonListener = 
function(ev) {
	var calDate = AjxDateUtil.simpleParseDateStr(this._dateField.value);

	// if date was input by user and its foobar, reset to today's date
	if (calDate === null || isNaN(calDate)) {
		calDate = new Date();
		var field = this._dateField;
		field.value = AjxDateUtil.simpleComputeDateStr(calDate);
	}

	// always reset the date to current field's date
	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

ZmTimeDialog.prototype._dateCalSelectionListener = 
function(ev) {
	var parentButton = ev.item.parent.parent;

	// do some error correction... maybe we can optimize this?
	var sd = AjxDateUtil.simpleParseDateStr(this._dateField.value);
	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

	// change the start/end date if they mismatch
	if (parentButton == this._dateButton) {
		this._dateField.value = newDate;
	}
};

ZmTimeDialog.prototype.createMiniCalButton =
function(buttonId, dateButtonListener, dateCalSelectionListener) {
	// create button
	var dateButton = new DwtButton({parent:this});
	dateButton.addDropDownSelectionListener(dateButtonListener);
	dateButton.setData(Dwt.KEY_ID, buttonId);
	if (AjxEnv.isIE) {
		dateButton.setSize("20");
	}

	// create menu for button
	var calMenu = new DwtMenu({parent:dateButton, style:DwtMenu.CALENDAR_PICKER_STYLE});
	calMenu.setSize("150");
	calMenu._table.width = "100%";
	dateButton.setMenu(calMenu, true);

	// create mini cal for menu for button
	var cal = new DwtCalendar({parent:calMenu});
	cal.setData(Dwt.KEY_ID, buttonId);
	cal.setSkipNotifyOnPage(true);
	var fdow = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;
	cal.setFirstDayOfWeek(fdow);
	cal.addSelectionListener(dateCalSelectionListener);
	// add settings change listener on mini cal in case first day of week setting changes
	// safety check since this is static code (may not have loaded calendar)
	var fdowSetting = appCtxt.getSettings().getSetting(ZmSetting.CAL_FIRST_DAY_OF_WEEK);
	if (fdowSetting) {
		var listener = new AjxListener(null, ZmCalendarApp._settingChangeListener, cal);
		fdowSetting.addChangeListener(listener);
	}

	// reparent and cleanup
	dateButton.reparentHtmlElement(buttonId);
	delete buttonId;

	return dateButton;
};

ZmTimeDialog.prototype.autoSelectTimezone =
function() {
	if (AjxTimezone.DEFAULT_RULE.autoDetected) {

		var cRule = AjxTimezone.DEFAULT_RULE;
		var standardOffsetMatch, daylightOffsetMatch, transMatch;

		for (var i in AjxTimezone.MATCHING_RULES) {
			var rule = AjxTimezone.MATCHING_RULES[i];
			if (rule.autoDetected) continue;
			if (rule.standard.offset == cRule.standard.offset) {

				if (!standardOffsetMatch)
					standardOffsetMatch = rule.serverId;

				var isDayLightOffsetMatching = (cRule.daylight && rule.daylight && (rule.daylight.offset == cRule.daylight.offset));

				if(isDayLightOffsetMatching) {
					if (!daylightOffsetMatch)
						daylightOffsetMatch = rule.serverId;
					var isTransYearMatching = (rule.daylight.trans[0] == cRule.daylight.trans[0]);
					var isTransMonthMatching = (rule.daylight.trans[1] == cRule.daylight.trans[1]);
					if (isTransYearMatching && isTransMonthMatching && !transMatch)
						transMatch = rule.serverId;
				}
			}
		}
		//select closest matching timezone
		var serverId = transMatch ? transMatch : (daylightOffsetMatch || standardOffsetMatch);
		if (serverId) this._tzoneSelect.setSelectedValue(serverId);
	} else {
		var tz = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
		this._tzoneSelect.setSelectedValue(tz);
	}
};
}
if (AjxPackage.define("zimbraMail.core.ZmNewWindow")) {
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
 * This file contains the new window class.
 */

/**
 * Creates a controller to run <code>ZmNewWindow</code>. Do not call directly, instead use
 * the <code>run()</code> factory method.
 * @class
 * This class is the controller for a window created outside the main client
 * window. It is a very stripped down and specialized version of {@link ZmZimbraMail}.
 * The child window is single-use; it does not support switching among multiple
 * views.
 *
 * @author Parag Shah
 * 
 * @extends	ZmController
 * 
 * @see		#run
 */
ZmNewWindow = function() {

	ZmController.call(this, null);

	appCtxt.setAppController(this);

	//update body class to reflect user selected font
	document.body.className = "user_font_" + appCtxt.get(ZmSetting.FONT_NAME);
	//update root html elment class to reflect user selected font size
	Dwt.addClass(document.documentElement, "user_font_size_" + appCtxt.get(ZmSetting.FONT_SIZE));


	this._settings = appCtxt.getSettings();
	this._settings.setReportScriptErrorsSettings(AjxException, ZmController.handleScriptError); //must set this for child window since AjxException is fresh for this window. Also must pass AjxException and the handler since we want it to update the one from this child window, and not the parent window

	this._shell = appCtxt.getShell();

	// Register keymap and global key action handler w/ shell's keyboard manager
	this._kbMgr = appCtxt.getKeyboardMgr();
	if (appCtxt.get(ZmSetting.USE_KEYBOARD_SHORTCUTS)) {
		this._kbMgr.enable(true);
		this._kbMgr.registerKeyMap(new ZmKeyMap());
		this._kbMgr.pushDefaultHandler(this);
	}

	this._apps = {};
};

ZmNewWindow.prototype = new ZmController;
ZmNewWindow.prototype.constructor = ZmNewWindow;

ZmNewWindow.prototype.isZmNewWindow = true;
ZmNewWindow.prototype.toString = function() { return "ZmNewWindow"; };

// Public methods

/**
 * Sets up new window and then starts it by calling its constructor. It is assumed that the
 * CSFE is on the same host.
 * 
 */
ZmNewWindow.run =
function() {

	// We're using a custom pkg that includes the mail classes we'll need, so pretend that
	// we've already loaded mail packages so the real ones don't get loaded as well.
	AjxDispatcher.setLoaded("MailCore", true);
	AjxDispatcher.setLoaded("Mail", true);

	var winOpener = window.opener || window;

	if (!window.parentController) {
		window.parentController = winOpener._zimbraMail;
	}

	// Create the global app context
	window.appCtxt = new ZmAppCtxt();
	window.appCtxt.isChildWindow = true;

	// XXX: DO NOT MOVE THIS LINE
	// redefine ZmSetting from parent window since it loses this info.
	window.parentAppCtxt = winOpener.appCtxt;
	appCtxt.setSettings(parentAppCtxt.getSettings());
	appCtxt.isOffline = parentAppCtxt.isOffline;
	appCtxt.multiAccounts = parentAppCtxt.multiAccounts;
    appCtxt.sendAsEmails = parentAppCtxt.sendAsEmails;
    appCtxt.sendOboEmails = parentAppCtxt.sendOboEmails;
    window.ZmSetting = winOpener.ZmSetting;

	ZmOperation.initialize();
	ZmApp.initialize();

	var shell = new DwtShell({className:"MainShell"});
	window.onbeforeunload = ZmNewWindow._confirmExitMethod;
	appCtxt.setShell(shell);

	// create new window and Go!
	var newWindow = new ZmNewWindow();
    newWindow.startup();
	
	if (winOpener.onkeydown) {
		window.onkeydown = winOpener.onkeydown;
	}
};

/**
* Allows this child window to inform parent it's going away
*/
ZmNewWindow.unload = function(ev) {

	if (!window || !window.opener || !window.parentController) {
        return;
    }

	var command = window.newWindowCommand; //bug 54409 - was using wrong attribute for command in unload
	if (command == "compose" || command == "composeDetach"
			|| (command == "msgViewDetach" && appCtxt.composeCtlrSessionId)) { //msgViewDetach might turn into a compose session if user hits "reply"/etc
		// compose controller adds listeners to parent window's list so we
		// need to remove them before closing this window!
		var cc = AjxDispatcher.run("GetComposeController", appCtxt.composeCtlrSessionId);
		if (cc) {
			cc.dispose();
		}
	}

	if (command == "msgViewDetach") {
		// msg controller (as a ZmListController) adds listener to tag list
		var mc = AjxDispatcher.run("GetMsgController", appCtxt.msgCtlrSessionId);
		if (mc) {
			mc.dispose();
		}
	}

	if (window.parentController) {
		window.parentController.removeChildWindow(window);
	}
};

/**
 * Presents a view based on a command passed through the window object. Possible commands are:
 *
 * <ul>
 * <li><b>compose</b> compose window launched in child window</li>
 * <li><b>composeDetach</b> compose window detached from client</li>
 * <li><b>msgViewDetach</b> msg view detached from client</li>
 * </ul>
 * 
 */
ZmNewWindow.prototype.startup =
function() {
	// get params from parent window b/c of Safari bug #7162
	// and in case of a refresh, our old window parameters are still stored there
	if (window.parentController) {
		var childWinObj = window.parentController.getChildWindow(window);
		if (childWinObj) {
			window.newWindowCommand = childWinObj.command;
			window.newWindowParams = childWinObj.params;
		}
	}

    if (!this._appViewMgr) {
        this._appViewMgr = new ZmAppViewMgr(this._shell, this, true, false);
        this._statusView = new ZmStatusView(this._shell, "ZmStatus", Dwt.ABSOLUTE_STYLE, ZmId.STATUS_VIEW);
    }

    var cmd = window.newWindowCommand;
	var params = window.newWindowParams;
	if (cmd == "shortcuts") {
		var apps = {};
		apps[ZmApp.PREFERENCES] = true;
		this._createEnabledApps(apps);
		this._createView();
		return;
	}

	DBG.println(AjxDebug.DBG1, " ************ Hello from new window!");

	var rootTg = appCtxt.getRootTabGroup();

	var apps = {};
	apps[ZmApp.SEARCH] = true;
	apps[ZmApp.MAIL] = true;
	apps[ZmApp.CONTACTS] = true;
	// only load calendar app if we're dealing with an invite
	var msg = (cmd == "msgViewDetach") ? params.msg : null;
	if (msg &&
        (msg.isInvite() || this._checkShareType(msg.share, "appointment"))) {
		apps[ZmApp.CALENDAR] = true;
	} else if (msg && this._checkShareType(msg.share, "task")) {
		apps[ZmApp.TASKS] = true;
	}
	apps[ZmApp.PREFERENCES] = true;
    apps[ZmApp.BRIEFCASE] = true;  //Need this for both Compose & Msg View detach window.
	this._createEnabledApps(apps);

	// inherit parent's identity collection
	var parentPrefsApp = parentAppCtxt.getApp(ZmApp.MAIL);
    if (parentPrefsApp) {
        appCtxt.getApp(ZmApp.MAIL)._identityCollection = parentPrefsApp.getIdentityCollection();
    }

	// Find target first.
	var target;
	if (cmd == "compose" || cmd == "composeDetach") {
		target = "compose-window";
	} else if (cmd == "msgViewDetach") {
		target = "view-window";
	}

	ZmZimbraMail.prototype._registerOrganizers.call(this);
	ZmZimbraMail.registerViewsToTypeMap();

    
	// setup zimlets, Load it first becoz.. zimlets has to get processed first.
	if (target) {
		var allzimlets = parentAppCtxt.get(ZmSetting.ZIMLETS);
		allzimlets = allzimlets || [];
		var zimletArray = this._settings._getCheckedZimlets(allzimlets);
		if (this._hasZimletsForTarget(zimletArray, target)) {
			var zimletMgr = appCtxt.getZimletMgr();
			var userProps = this._getUserProps();
			var createViewCallback =  new AjxCallback(this, this._createView);
            appCtxt.setZimletsPresent(true);
			zimletMgr.loadZimlets(zimletArray, userProps, target, createViewCallback, true);
			return;
		}
	}

	this._createView();
};

/**
 * @private
 */
ZmNewWindow.prototype._checkShareType =
function(share, type) {
    return share && share.link && (type === share.link.view);
};
ZmNewWindow.prototype._createView =
function() {

	var cmd = window.newWindowCommand;
	var params = window.newWindowParams;

	var rootTg = appCtxt.getRootTabGroup();
	var startupFocusItem;

	//I null composeCtlrSessionId so it's not kept from irrelevant sessions from parent window.
	// (since I set it in every compose session, in ZmMailApp.prototype.compose).
	// This is important in case of cmd == "msgViewDetach"
	appCtxt.composeCtlrSessionId = null;  
	// depending on the command, do the right thing
	if (cmd == "compose" || cmd == "composeDetach") {
		var cc = AjxDispatcher.run("GetComposeController");	// get a new compose ctlr
		appCtxt.composeCtlrSessionId = cc.getSessionId();
		if (params.action == ZmOperation.REPLY_ALL) {
			params.msg = this._deepCopyMsg(params.msg);
		}
		if (cmd == "compose") {
			cc._setView(params);
		} else {
			AjxDispatcher.require(["MailCore", "ContactsCore", "CalendarCore"]);
			var op = params.action || ZmOperation.NEW_MESSAGE;
			if (params.msg && params.msg._mode) {
				switch (params.msg._mode) {
					case ZmAppt.MODE_DELETE:
					case ZmAppt.MODE_DELETE_INSTANCE:
					case ZmAppt.MODE_DELETE_SERIES: {
						op = ZmOperation.REPLY_CANCEL;
						break;
					}
				}
			}
			params.action = op;
			cc._setView(params);
			cc._composeView.setDetach(params);

			// bug fix #5887 - get the parent window's compose controller based on its session ID
			var parentCC = window.parentController.getApp(ZmApp.MAIL).getComposeController(params.sessionId);
			if (parentCC && parentCC._composeView) {
				// once everything is set in child window, pop parent window's compose view
				parentCC._composeView.reset(true);
				parentCC._app.popView(true);
			}
		}
		cc._setComposeTabGroup();
		rootTg.addMember(cc.getTabGroup());
		startupFocusItem = cc._getDefaultFocusItem();

		target = "compose-window";
	} else if (cmd == "msgViewDetach") {
		//bug 52366 - not sure why only REPLY_ALL causes the problem (and not REPLY for example), but in this case the window is opened first for view. But
		//the user might of course click "reply to all" later in the window so I deep copy here in any case.
		var msg = this._deepCopyMsg(params.msg);
		msg.isRfc822 = params.isRfc822; //simpler
		params.msg.addChangeListener(msg.detachedChangeListener.bind(msg));

		var msgController = AjxDispatcher.run("GetMsgController");
		appCtxt.msgCtlrSessionId = msgController.getSessionId();
		msgController.show(msg, params.parentController);
		rootTg.addMember(msgController.getTabGroup());
		startupFocusItem = msgController.getCurrentView();

		target = "view-window";
	} else if (cmd == 'documentEdit') {
		AjxDispatcher.require(["Docs"]);
 		ZmDocsEditApp.setFile(params.id, params.name, params.folderId);
		ZmDocsEditApp.restUrl = params.restUrl;
		new ZmDocsEditApp();
		if (params.name) {
			Dwt.setTitle(params.name);
		}
	} else if (cmd == "shortcuts") {
		var panel = appCtxt.getShortcutsPanel();
		panel.popup(params.cols);
	}

	if (this._appViewMgr.loadingView) {
		this._appViewMgr.loadingView.setVisible(false);
	}

	this._kbMgr.setTabGroup(rootTg);
	this._kbMgr.grabFocus(startupFocusItem);
};

/**
 * HACK: This should go away once we have a cleaner server solution that
 *       allows us to get just those zimlets for the specified target.
 *       
 * @private
 */
ZmNewWindow.prototype._hasZimletsForTarget =
function(zimletArray, target) {
	var targetRe = new RegExp("\\b"+target+"\\b");
	for (var i=0; i < zimletArray.length; i++) {
		var zimletObj = zimletArray[i];
		var zimlet0 = zimletObj.zimlet[0];
		if (targetRe.test(zimlet0.target || "main")) {
			return true;
		}
	}
	return false;
};

/**
 * @private
 */
ZmNewWindow.prototype._getUserProps =
function() {
	var userPropsArray = parentAppCtxt.get(ZmSetting.USER_PROPS);

	// default to original user props
	userPropsArray = userPropsArray ? [].concat(userPropsArray) : [];

	// current user props take precedence, if available
	var zimletHash = parentAppCtxt.getZimletMgr().getZimletsHash();
	var zimletArray = parentAppCtxt.get(ZmSetting.ZIMLETS);
	for (var i = 0; i < zimletArray.length; i++) {
		var zname = zimletArray[i].zimlet[0].name;
		var zimlet = zimletHash[zname];
		if (!zimlet || !zimlet.userProperties) continue;
		for (var j = 0; j < zimlet.userProperties.length; j++) {
			var userProp = zimlet.userProperties[j];
			var userPropObj = { zimlet: zname, name: userProp.name, _content: userProp.value };
			userPropsArray.push(userPropObj);
		}
	}

	// return user properties
	return userPropsArray;
};

/**
 * Cancels the request.
 * 
 * @param	{String}	reqId		the request id
 * @param	{AjxCallback}	errorCallback		the callback
 * @param	{Boolean}	noBusyOverlay	if <code>true</code>, do not show a busy overlay
 */
ZmNewWindow.prototype.cancelRequest =
function(reqId, errorCallback, noBusyOverlay) {
	return window.parentController ? window.parentController.cancelRequest(reqId, errorCallback, noBusyOverlay) : null;
};

/**
 * Sends the server requests to the main controller.
 * 
 * @param	{Hash}	params		a hash of parameters
 */
ZmNewWindow.prototype.sendRequest =
function(params) {
    // reset onbeforeunload on send
    window.onbeforeunload = null;
	// bypass error callback to get control over exceptions in the childwindow.
	params.errorCallback = new AjxCallback(this, this._handleException, [( params.errorCallback || null )]);
	params.fromChildWindow = true;
	return window.parentController ? window.parentController.sendRequest(params) : null;
};

/**
 * @private
 */
ZmNewWindow.prototype._handleException =
function(errCallback, ex) {
	var handled = false;
	if (errCallback) {
		handled = errCallback.run(ex);
	}
	if (!handled) {
		ZmController.prototype._handleException.apply(this, [ex]);
	}
	return true;
};

/**
 * Popup the error dialog.
 * 
 * @param	{String}	msg		the message
 * @param	{AjxException}	ex	the exception
 * @param	{Boolean}	noExecReset
 * @param	{Boolean}	hideReportButton
 */
ZmNewWindow.prototype.popupErrorDialog =
function(msg, ex, noExecReset, hideReportButton)  {
	// Since ex is from parent window, all the types seems like objects, so need
	// to filter the functions
	var detailStr;
	if (ex instanceof Object || typeof ex == "object") {
		var details = [];
		ex.msg = ex.msg || msg;
		for (var prop in ex) {
			if (typeof ex[prop] == "function" ||
				(typeof ex[prop] == "object" && ex[prop].apply && ex[prop].call))
			{
				continue;
			}
			details.push([prop, ": ", ex[prop], "<br/>\n"].join(""));
		}
		detailStr = details.join("");
	}
	ZmController.prototype.popupErrorDialog.call(this, msg, ( detailStr || ex ), noExecReset, hideReportButton);
};

/**
 * Set status messages via the main controller, so they show up in the client's status area.
 * 
 * @param	{Hash}	params		a hash of parameters
 */
ZmNewWindow.prototype.setStatusMsg =
function(params) {
	// bug: 26478. Changed status msg to be displayed within the child window.
	params = Dwt.getParams(arguments, ZmStatusView.MSG_PARAMS);
	this._statusView.setStatusMsg(params);
};

/**
 * Gets a handle to the given app.
 *
 * @param {String}	appName		the app name
 * @return	{ZmApp}		the application
 */
ZmNewWindow.prototype.getApp =
function(appName) {
	if (!this._apps[appName]) {
		this._createApp(appName);
	}
	return this._apps[appName];
};

/**
 * Gets a handle to the app view manager.
 * 
 * @return	{ZmAppViewMgr}	the view manager
 */
ZmNewWindow.prototype.getAppViewMgr =
function() {
	return this._appViewMgr;
};

// App view mgr calls this, we don't need it to do anything.
ZmNewWindow.prototype.setActiveApp = function() {};

/**
 * Gets the key map manager.
 * 
 * @return	{DwtKeyMapMgr}	the key map manager
 */
ZmNewWindow.prototype.getKeyMapMgr =
function() {
	return this._kbMgr.__keyMapMgr;
};

/**
 * Gets the key map name.
 * 
 * @return	{String}	the key map name
 */
ZmNewWindow.prototype.getKeyMapName =
function() {
	var ctlr = appCtxt.getCurrentController();
	if (ctlr && ctlr.getKeyMapName) {
		return ctlr.getKeyMapName();
	}
	return ZmKeyMap.MAP_GLOBAL;
};

/**
 * Handles the key action.
 * 
 * @param	{Object}	actionCode		the action code
 * @param	{Object}	ev		the event
 * @return	{Boolean}	<code>true</code> if the action is handled
 */
ZmNewWindow.prototype.handleKeyAction = function(actionCode, ev) {

    // Ignore global shortcuts since they don't make sense in a child window
    if (ZmApp.GOTO_ACTION_CODE_R[actionCode]) {
        return false;
    }
    switch (actionCode) {
        case ZmKeyMap.QUICK_REMINDER:
        case ZmKeyMap.FOCUS_SEARCH_BOX:
        case ZmKeyMap.FOCUS_CONTENT_PANE:
        case ZmKeyMap.FOCUS_TOOLBAR:
        case ZmKeyMap.SHORTCUTS:
            return false;
    }

    // Hand shortcut to current controller
	var ctlr = appCtxt.getCurrentController();
	if (ctlr && ctlr.handleKeyAction) {
		return ctlr.handleKeyAction(actionCode, ev);
	}

	return false;
};


// Private methods

/**
 * Instantiates enabled apps. An optional argument may be given limiting the set
 * of apps that may be created.
 *
 * @param {Hash}	apps	the set of apps to create
 * 
 * @private
 */
ZmNewWindow.prototype._createEnabledApps =
function(apps) {
	for (var app in ZmApp.CLASS) {
		if (!apps || apps[app]) {
			ZmApp.APPS.push(app);
		}
	}
	ZmApp.APPS.sort(function(a, b) {
		return ZmZimbraMail.hashSortCompare(ZmApp.LOAD_SORT, a, b);
	});

	// instantiate enabled apps - this will invoke app registration
	for (var i = 0; i < ZmApp.APPS.length; i++) {
		var app = ZmApp.APPS[i];
		if (app != ZmApp.IM) { // Don't create im app. Seems like the safest way to avoid ever logging in.
			var setting = ZmApp.SETTING[app];
			if (!setting || appCtxt.get(setting)) {
				this._createApp(app);
			}
		}
	}
};

/**
 * Creates an app object, which doesn't necessarily do anything just yet.
 * 
 * @private
 */
ZmNewWindow.prototype._createApp =
function(appName) {
	if (this._apps[appName]) return;
	var appClass = eval(ZmApp.CLASS[appName]);
	this._apps[appName] = appClass && new appClass(this._shell, window.parentController);
};

/**
 * @private
 * TODO: get rid of this function
 */
ZmNewWindow.prototype._deepCopyMsg =
function(msg) {
	// initialize new ZmSearch if applicable
	var newSearch = null;
	var oldSearch = msg.list.search;

	if (oldSearch) {
		newSearch = new ZmSearch();

		for (var i in oldSearch) {
			if ((typeof oldSearch[i] == "object") || (typeof oldSearch[i] == "function")) { continue; }
			newSearch[i] = oldSearch[i];
		}

		// manually add objects since they are no longer recognizable
		newSearch.types = new AjxVector();
		var types = oldSearch.types.getArray();
		for (var i = 0;  i < types.length; i++) {
			newSearch.types.add(types[i]);
		}
	}

	// initialize new ZmMailList
	var newMailList = new ZmMailList(msg.list.type, newSearch);
	for (var i in msg.list) {
		if ((typeof msg.list[i] == "object") || (typeof msg.list[i] == "function")) { continue; }
		newMailList[i] = msg.list[i];
	}

	// finally, initialize new ZmMailMsg
	var newMsg = new ZmMailMsg(msg.id, newMailList);

	for (var i in msg) {
		if ((typeof msg[i] == "object") || (typeof msg[i] == "function")) { continue; }
		newMsg[i] = msg[i];
	}

	// manually add any objects since they are no longer recognizable
	for (var i in msg._addrs) {
		var addrs = msg._addrs[i].getArray();
		for (var j = 0; j < addrs.length; j++) {
			newMsg._addrs[i].add(addrs[j]);
		}
	}

	if (msg.attachments && msg.attachments.length > 0) {
		for (var i = 0; i < msg.attachments.length; i++) {
			newMsg.attachments.push(msg.attachments[i]);
		}
	}

	for (var i = 0; i < msg._bodyParts.length; i++) {
		newMsg._bodyParts.push(msg._bodyParts[i]);
	}
	
	for (var ct in msg._contentType) {
		newMsg._contentType[ct] = true;
	}

	if (msg._topPart) {
		newMsg._topPart = new ZmMimePart();
		for (var i in msg._topPart) {
			if ((typeof msg._topPart[i] == "object") || (typeof msg._topPart[i] == "function"))
				continue;
			newMsg._topPart[i] = msg._topPart[i];
		}
		var children = msg._topPart.children.getArray();
		for (var i = 0; i < children.length; i++) {
			newMsg._topPart.children.add(children[i]);
		}
	}

	if (msg.invite) {
		newMsg.invite = msg.invite;
	}

	if (msg.share) {
		newMsg.share = msg.share;
	}

	newMsg.subscribeReq = msg.subscribeReq;

	// TODO: When/if you get rid of this function, also remove the cloneOf uses in:
	//		ZmBaseController.prototype._doTag
	//		ZmBaseController.prototype._setTagMenu
	//		ZmMailMsgView.prototype._setTags
	//		ZmMailMsgView.prototype._handleResponseSet
	//		ZmMailListController.prototype._handleResponseFilterListener
	//		ZmMailListController.prototype._handleResponseNewApptListener
	//		ZmMailListController.prototype._handleResponseNewTaskListener
	newMsg.cloneOf = msg;

	if (msg.certificate) {
		newMsg.certificate = msg.certificate;
	}

	return newMsg;
};


// Static Methods

/**
 * @private
 */
ZmNewWindow._confirmExitMethod = function(ev) {

	if (!appCtxt.get(ZmSetting.WARN_ON_EXIT) || !window.parentController) {
		return;
    }

	var cmd = window.newWindowCommand;

	if (cmd === "compose" || cmd === "composeDetach")	{
		var cc = AjxDispatcher.run("GetComposeController", appCtxt.composeCtlrSessionId),
            cv = cc && cc._composeView,
            viewId = cc.getCurrentViewId(),
            avm = appCtxt.getAppViewMgr();

		// only show native confirmation dialog if compose view is dirty
		if (cv && avm.isVisible(viewId) && cv.isDirty()) {
			return ZmMsg.newWinComposeExit;
		}
	} else if (cmd == 'documentEdit') {
		var ctrl = ZmDocsEditApp._controller;
		var msg = ctrl.checkForChanges();
		return msg || ctrl.exit();
	}
};
}
if (AjxPackage.define("zimbraMail.core.ZmToolTipMgr")) {
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
 * Creates a tooltip manager.
 * @constructor
 * @class
 * This singleton class manages tooltip content generation and retrieval. Tooltips are
 * broken down by type based on what they show (for example information about
 * a person). Each type has a handler, which gets passed the appropriate data
 * and generates the tooltip content.
 *
 * @author Conrad Damon
 * 
 * @param {DwtComposite}	container	the containing shell
 * @param {ZmMailApp}		mailApp		the containing app
 */

ZmToolTipMgr = function() {
	this._registry = {};
	this.registerToolTipHandler(ZmToolTipMgr.PERSON, this.getPersonToolTip);
};

ZmToolTipMgr.PERSON = "PERSON";

/**
 * Associates a type of tooltip with a function to generate its content.
 * 
 * @param {constant}	type		type of tooltip
 * @param {function}	handler		function that returns tooltip content
 */
ZmToolTipMgr.prototype.registerToolTipHandler =
function(type, handler) {
	this._registry[type] = handler;
};

/**
 * Returns tooltip content for the given type with the given data.
 * 
 * @param {constant}	type		type of tooltip
 * @param {hash}		params		arbitrary data to pass to tooltip function
 * @param {AjxCallback}	callback	callback to run with results (optional)
 */
ZmToolTipMgr.prototype.getToolTip =
function(type, params, callback) {
	var handler = this._registry[type];
	if (handler && AjxUtil.isFunction(handler)) {
		return handler.apply(this, [params, callback]);
	}
};

/**
 * Returns tooltip content for a person based on an email address or contact.
 * 
 * @param {hash}					params			hash of params:
 * @param {string|AjxEmailAddress}	address			email address
 * @param {ZmContact}				contact			contact - need either address or contact
 * @param {DwtMouseEvent}			ev				mouseover event
 * @param {boolean}					noRightClick	if true, don't show right click hint
 * @param {AjxCallback}				callback		callback to run with results (optional)
 */
ZmToolTipMgr.prototype.getPersonToolTip =
function(params, callback) {

	if (!(params && (params.address || params.contact))) { return ""; }

	var contact = params.contact;
	var address = params.address || contact.getEmail();
	if (!address.isAjxEmailAddress) {
		address = new AjxEmailAddress(address);
	}
	
	if (appCtxt.notifyZimlets("onHoverOverEmailInList", [address, params.ev, params.noRightClick])) {
		// Zimlet framework is handling the tooltip
		return "";
	}
	
	var contactsApp = appCtxt.get(ZmSetting.CONTACTS_ENABLED) && appCtxt.getApp(ZmApp.CONTACTS);
	if (!contact && !contactsApp) { return ""; }

	var addr = address.getAddress();

	if (callback) {
		if (contact) {
			this._handleResponseGetContact(address, callback, contact);
		}
		else {
			var respCallback = new AjxCallback(this, this._handleResponseGetContact, [address, callback]);
			contactsApp.getContactByEmail(addr, respCallback);
		}
	} else {
		contact = contact || contactsApp.getContactByEmail(addr);
		return this._handleResponseGetContact(address, null, contact);
	}
};
		
ZmToolTipMgr.prototype._handleResponseGetContact =
function(address, callback, contact) {

	if (!address && !contact) { return ""; }
	
	var tooltip;
	if (contact) {
		tooltip = contact.getToolTip(address.getAddress());
	} else {
		tooltip = AjxTemplate.expand("abook.Contacts#TooltipNotInAddrBook", {addrstr:address.toString()});
	}

	if (callback) {
		callback.run(tooltip);
	} else {
		return tooltip;
	}
};
}

if (AjxPackage.define("zimbraMail.calendar.model.ZmCalMgr")) {
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

ZmCalMgr = function(container) {
	this._container = container;
	this.clearCache();
	
	this._listeners = {};
	this._folderNames = {};

	this._listeners[ZmOperation.NEW_APPT] = new AjxListener(this, this._newApptAction);
	this._listeners[ZmOperation.NEW_ALLDAY_APPT] = new AjxListener(this, this._newAllDayApptAction);
	this._listeners[ZmOperation.SEARCH_MAIL] = new AjxListener(this, this._searchMailAction);
};

ZmCalMgr.prototype.toString =
function() {
	return "ZmCalMgr";
};

ZmCalMgr.prototype.clearCache =
function() {
	this._miniCalData = {};
};

ZmCalMgr.prototype._createMiniCalendar =
function(date) {
	date = date ? date : new Date();

	var firstDayOfWeek = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;

    //todo: need to use server setting to decide the weekno standard
    var serverId = AjxTimezone.getServerId(AjxTimezone.DEFAULT);
    var useISO8601WeekNo = (serverId && serverId.indexOf("Europe")==0 && serverId != "Europe/London");

	this._miniCalendar = new DwtCalendar({parent: this._container, posStyle:DwtControl.ABSOLUTE_STYLE,
										  firstDayOfWeek: firstDayOfWeek, showWeekNumber: appCtxt.get(ZmSetting.CAL_SHOW_CALENDAR_WEEK), useISO8601WeekNo: useISO8601WeekNo});
	this._miniCalendar.setDate(date);
	this._miniCalendar.setScrollStyle(Dwt.CLIP);
	this._miniCalendar.addSelectionListener(new AjxListener(this, this._miniCalSelectionListener));
	this._miniCalendar.addActionListener(new AjxListener(this, this._miniCalActionListener));
	this._miniCalendar.addDateRangeListener(new AjxListener(this, this._miniCalDateRangeListener));
	this._miniCalendar.setMouseOverDayCallback(new AjxCallback(this, this._miniCalMouseOverDayCallback));
	this._miniCalendar.setMouseOutDayCallback(new AjxCallback(this, this._miniCalMouseOutDayCallback));

	var list = [];
	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		list.push("ZmMailMsg");
		list.push("ZmConv");
	}
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED)) {
		list.push("ZmContact");
	}
	this._miniCalDropTarget = new DwtDropTarget(list);
	this._miniCalDropTarget.addDropListener(new AjxListener(this, this._miniCalDropTargetListener));
	this._miniCalendar.setDropTarget(this._miniCalDropTarget);

	var workingWeek = [];
	for (var i = 0; i < 7; i++) {
		var d = (i + firstDayOfWeek) % 7;
		workingWeek[i] = (d > 0 && d < 6);
	}
	this._miniCalendar.setWorkingWeek(workingWeek);

	// add mini-calendar to skin
	var components = {};
	components[ZmAppViewMgr.C_TREE_FOOTER] = this._miniCalendar;
	appCtxt.getAppViewMgr().setViewComponents(ZmAppViewMgr.GLOBAL, components, true);
	
	var app = appCtxt.getApp(ZmApp.CALENDAR);
	var show = app._active || appCtxt.get(ZmSetting.CAL_ALWAYS_SHOW_MINI_CAL);
	this._miniCalendar.setSkipNotifyOnPage(show && !app._active);
	if (!app._active) {
		this._miniCalendar.setSelectionMode(DwtCalendar.DAY);
	}

    this._dayRollTimer = null;
};



ZmCalMgr.prototype.startDayRollTimer =
function(){
  if(!this._dayRollTimer){
    var curTime = new Date();
    var rollTime = new Date();
    rollTime.setHours(23,59,59,999);
    var interval = rollTime.getTime() - curTime.getTime();
    var dayRollAction = new AjxTimedAction(this,this._rollDay);
    AjxTimedAction.scheduleAction(dayRollAction,interval);
  }
}


ZmCalMgr.prototype._rollDay =
function(){
    this._dayRollTimer = null;
    this._miniCalendar.setDate(new Date(),true);
    this.startDayRollTimer();
}

ZmCalMgr.prototype._miniCalDropTargetListener =
function(ev) {
	var calController = this.getCalViewController();
	calController._miniCalDropTargetListener(ev);
};

ZmCalMgr.prototype.getMiniCalendar = 
function() {
	if (!this._miniCalendar) {
		this._createMiniCalendar();
	}
	
	return this._miniCalendar;
};

ZmCalMgr.prototype._refreshCallback =
function(list) {
	this.getReminderController()._refreshCallback(list);
};

ZmCalMgr.prototype.getReminderController =
function() {
	if (!this._reminderController) {
		this._reminderController = new ZmReminderController(this, "appt");
	}
	return this._reminderController;
};

ZmCalMgr.prototype._miniCalSelectionListener =
function(ev) {
	if (ev.item instanceof DwtCalendar) {
		var calController = this.getCalViewController();
		calController._handleLoadMiniCalSelection(ev);
	}
};

ZmCalMgr.prototype._miniCalActionListener =
function(ev) {
    if (appCtxt.isExternalAccount()) { return; }
	var mm = this._getMiniCalActionMenu();
	mm.__detail = ev.detail;
	mm.popup(0, ev.docX, ev.docY);
};

ZmCalMgr.prototype._getMiniCalActionMenu =
function() {
	if (this._minicalMenu == null) {

		this.postInitListeners();

		var list = [ZmOperation.NEW_APPT, ZmOperation.NEW_ALLDAY_APPT, ZmOperation.SEP, ZmOperation.SEARCH_MAIL];
		//Zimlet hack
		var zimletOps = ZmZimlet.actionMenus ? ZmZimlet.actionMenus["ZmCalViewController"] : null;
		if (zimletOps && zimletOps.length) {
			for (var i = 0; i < zimletOps.length; i++) {
				var op = zimletOps[i];
				ZmOperation.defineOperation(null, op);
				list.push(op.id);
			}
		}
		var params = {parent: appCtxt.getShell(), menuItems:list};
		this._minicalMenu = new ZmActionMenu(params);
		list = this._minicalMenu.opList;
		var cnt = list.length;
		for(var ix=0; ix < cnt; ix++) {
			if(this._listeners[list[ix]]) {
				this._minicalMenu.addSelectionListener(list[ix], this._listeners[list[ix]]);
			}
		}
	}
	return this._minicalMenu;
};

// Zimlet hack
ZmCalMgr.prototype.postInitListeners =
function () {
	if (ZmZimlet.listeners && ZmZimlet.listeners["ZmCalViewController"]) {
		for (var ix in ZmZimlet.listeners["ZmCalViewController"]) {
			if (ZmZimlet.listeners["ZmCalViewController"][ix] instanceof AjxListener) {
				this._listeners[ix] = ZmZimlet.listeners["ZmCalViewController"][ix];
			} else {
				this._listeners[ix] = new AjxListener(this, this._proxyListeners, [ZmZimlet.listeners["ZmCalViewController"][ix]]);
			}
		}
	}
};

// Few zimlets might expect listeners from calendar view controller object
ZmCalMgr.prototype._proxyListeners =
function(zimletListener, event) {
	var calController = this.getCalViewController();
	return (new AjxListener(calController, zimletListener)).handleEvent(event);
};

ZmCalMgr.prototype.isMiniCalCreated =
function() {
	return (this._miniCalendar != null);
};

ZmCalMgr.prototype._miniCalDateRangeListener =
function(ev) { 
	var viewId = appCtxt.getCurrentViewId();
	if (viewId == ZmId.VIEW_CAL) {
		var calController = this.getCalViewController();
		calController._scheduleMaintenance(ZmCalViewController.MAINT_MINICAL);
	} else {
		this.highlightMiniCal();
	}
};

ZmCalMgr.prototype._miniCalMouseOverDayCallback =
function(control, day) {
	this._currentMouseOverDay = day;
	var action = new AjxTimedAction(this, this._getDayToolTipOnDelay, [control, day]);
	AjxTimedAction.scheduleAction(action, 1000);
};

ZmCalMgr.prototype.getCalViewController = 
function() {
	var calController = AjxDispatcher.run("GetCalController");
	calController._miniCalendar = this._miniCalendar;
	calController._minicalMenu = this._minicalMenu;
	calController._miniCalDropTarget = this._miniCalDropTarget;
	return calController;
};

ZmCalMgr.prototype._miniCalMouseOutDayCallback =
function(control) {
	this._currentMouseOverDay = null;
};

ZmCalMgr.prototype._getDayToolTipOnDelay =
function(control, day) {
	if (!this._currentMouseOverDay) { return; }
	if ((this._currentMouseOverDay.getDate() == day.getDate()) &&
		(this._currentMouseOverDay.getMonth() == day.getMonth()))
	{
		this._currentMouseOverDay = null;
        var mouseEv = DwtShell.mouseEvent;
        if(mouseEv && mouseEv.docX > 0 && mouseEv.docY > 0) {
            var callback = new AjxCallback(this, this.showTooltip, [control, mouseEv.docX, mouseEv.docY]);
            this.getCalViewController().getDayToolTipText(day, false, callback, true);
        }
	}
};

ZmCalMgr.prototype.showTooltip =
function(control, x, y, tooltipContent) {
    control.setToolTipContent(tooltipContent);
    if(x > 0 && y > 0) {
        var shell = DwtShell.getShell(window);
        var tooltip = shell.getToolTip();
        tooltip.setContent(tooltipContent);
        tooltip.popup(x, y);
        control.__tooltipClosed = false;
    }
};

ZmCalMgr.prototype.getApptSummaries =
function(params) {
	var apptVec = this.setSearchParams(params);

	if (apptVec != null && (apptVec instanceof AjxVector)) {
		return apptVec;
	}

	// this array will hold a list of appts as we collect them from the server
	this._rawAppts = [];

	if (params.callback) {
		this._search(params);
	} else {
		return this._search(params);
	}
};

ZmCalMgr.prototype.setSearchParams =
function(params) {
	if (!(params.folderIds instanceof Array)) {
		params.folderIds = [params.folderIds];
	} else if (params.folderIds.length == 0) {
		var newVec = new AjxVector();
		if (params.callback) {
			params.callback.run(newVec);
		}
		return newVec;
	}

	var folderIdMapper = {};
	var query = "";
	for (var i=0; i < params.folderIds.length; i++) {
		var fid = params.folderIds[i];
		var systemFolderId = appCtxt.getActiveAccount().isMain
			? fid : ZmOrganizer.getSystemId(fid);

		// map remote folder ids into local ones while processing search since
		// server wont do it for us (see bug 7083)
		var folder = appCtxt.getById(systemFolderId);
		var rid = folder ? folder.getRemoteId() : systemFolderId;
		folderIdMapper[rid] = systemFolderId;

		if (query.length) {
			query += " OR ";
		}
		var idText = AjxUtil.isNumeric(fid) ? fid : ['"', fid, '"'].join("");
		query += "inid:" + idText;
		
	}
	params.queryHint = query;
    params.needToFetch = params.folderIds;
	params.folderIdMapper = folderIdMapper;
	params.offset = 0;
};

ZmCalMgr.prototype._search =
function(params) {
	var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.SearchRequest;

	this._setSoapParams(request, params);

    var calController = this.getCalViewController();
    var apptCache     = calController.getApptCache();

    var accountName = appCtxt.multiAccounts ? appCtxt.accountList.mainAccount.name : null;
	if (params.callback) {
		appCtxt.getAppController().sendRequest({
			jsonObj: jsonObj,
			asyncMode: true,
			callback: (new AjxCallback(this, this._getApptSummariesResponse, [params])),
            offlineCallback: apptCache.offlineSearchAppts(null, null, params),
			noBusyOverlay: params.noBusyOverlay,
			accountName: accountName
		});
	} else {
		var response = appCtxt.getAppController().sendRequest({jsonObj: jsonObj, accountName: accountName});
		var result = new ZmCsfeResult(response, false);
		return this._getApptSummariesResponse(params, result);
	}
};

ZmCalMgr.prototype._setSoapParams =
function(request, params) {	
	request.sortBy = "none";
	request.limit = "500";
	request.calExpandInstStart = params.start;
	request.calExpandInstEnd = params.end;
	request.types = ZmSearch.TYPE[ZmItem.APPT];
	request.offset = params.offset;

	var query = params.query;
	if (params.queryHint) {
		query = (query != null)
			? (query + " (" + params.queryHint + ")")
			: params.queryHint;
	}
	request.query = {_content:query};
};


ZmCalMgr.prototype._getApptSummariesResponse =
function(params, result) {
	// TODO: mark both as needing refresh?
	if (!result) { return; }

	var callback = params.callback;
	var resp;
	try {
		resp = result.getResponse();
	} catch (ex) {
		if (callback) {
			callback.run(new AjxVector());
		}
		return;
	}

	var searchResp = resp.SearchResponse;
	var newList = this.processSearchResponse(searchResp, params);
	if (newList == null) { return; }

	if (callback) {
		callback.run(newList, params.query);
	} else {
		return newList;
	}
};

ZmCalMgr.prototype.processSearchResponse = 
function(searchResp, params) {
	if(!searchResp) { return; }

	if (searchResp && searchResp.appt && searchResp.appt.length) {
		this._rawAppts = this._rawAppts != null 
			? this._rawAppts.concat(searchResp.appt)
			: searchResp.appt;

		// if "more" flag set, keep requesting more appts
		if (searchResp.more) {
			var lastAppt = searchResp.appt[searchResp.appt.length-1];
			if (lastAppt) {
				params.offset += 500;
				this._search(params);
				return;
			}
		}
	}

	var newList = new AjxVector();
	if (this._rawAppts && this._rawAppts.length) {
		this._list = new ZmList(ZmItem.APPT);
		for (var i = 0; i < this._rawAppts.length; i++) {
			DBG.println(AjxDebug.DBG2, "appt[j]:" + this._rawAppts[i].name);
			var apptNode = this._rawAppts[i];
			var instances = apptNode ? apptNode.inst : null;
			if (instances) {
				var args = {list:this._list};
				for (var j = 0; j < instances.length; j++) {
					var appt = ZmCalBaseItem.createFromDom(apptNode, args, instances[j]);
					DBG.println(AjxDebug.DBG2, "lite appt :" + appt);
					if (appt) newList.add(appt);
				}
			}
		}

	}
	return newList;
};

ZmCalMgr.prototype.getCalendarName =
function(folderId) {
	var app = appCtxt.getApp(ZmApp.CALENDAR);
	return app.getCalendarName(folderId);
};

// Mini calendar action menu listeners, calview controller is loaded and than
// event handling listener functions are called
ZmCalMgr.prototype._newApptAction =
function(ev) {
	var calController = this.getCalViewController();
	calController._newApptAction(ev);
};

ZmCalMgr.prototype._newAllDayApptAction =
function(ev) {
	var calController = this.getCalViewController();
	calController._newAllDayApptAction(ev);
};

ZmCalMgr.prototype._searchMailAction =
function(ev) {
	var calController = this.getCalViewController();
	calController._searchMailAction(ev);
};

ZmCalMgr.prototype.getCheckedCalendarFolderIds =
function(localOnly) {
	var app = appCtxt.getApp(ZmApp.CALENDAR);
	return app.getCheckedCalendarFolderIds(localOnly);
};

ZmCalMgr.prototype.getReminderCalendarFolderIds =
function() {
	var app = appCtxt.getApp(ZmApp.CALENDAR);
	return app.getReminderCalendarFolderIds();
};

ZmCalMgr.prototype._handleError =
function(ex) {
	if (ex.code == 'mail.INVITE_OUT_OF_DATE' ||	ex.code == 'mail.NO_SUCH_APPT') {
		var msgDialog = appCtxt.getMsgDialog();
		msgDialog.setMessage(ZmMsg.apptOutOfDate, DwtMessageDialog.INFO_STYLE);
		msgDialog.popup();
		return true;
	}
	return false;
};

ZmCalMgr.prototype.highlightMiniCal =
function() {
	this.getMiniCalCache()._getMiniCalData(this.getMiniCalendarParams());
};

ZmCalMgr.prototype.getMiniCalendarParams =
function() {
	var dr = this.getMiniCalendar().getDateRange();
	return {
		start: dr.start.getTime(),
		end: dr.end.getTime(),
		fanoutAllDay: true,
		noBusyOverlay: true,
		folderIds: this.getCheckedCalendarFolderIds(),
        tz: AjxTimezone.DEFAULT
	};
};

ZmCalMgr.prototype.getMiniCalCache =
function() {
	if (!this._miniCalCache) {
		this._miniCalCache = new ZmMiniCalCache(this);
	}
	return this._miniCalCache;
};

ZmCalMgr.prototype.getQuickReminderSearchTimeRange =
function() {
	var endOfDay = new Date();
	endOfDay.setHours(23,59,59,999);

	var end = new Date(endOfDay.getTime());

	var start = endOfDay;
	start.setHours(0,0,0, 0);

	return { start: start.getTime(), end: end.getTime() };
};

ZmCalMgr.prototype.showQuickReminder =
function() {
    var params = this.getQuickReminderParams();
    this.getApptSummaries(params);
};

ZmCalMgr.prototype.getQuickReminderParams =
function() {

	var timeRange = this.getQuickReminderSearchTimeRange();
	return {
		start: timeRange.start,
		end: timeRange.end,
		fanoutAllDay: false,
		folderIds: this.getCheckedCalendarFolderIds(true),
		callback: (new AjxCallback(this, this._quickReminderCallback)),
		includeReminders: true
	};
};

ZmCalMgr.prototype._quickReminderCallback =
function(list) {
    var newList = new AjxVector();
    this._cacheMap = {};
    var size = list.size();

    var currentTime  = (new Date()).getTime();

    for (var i = 0; i < size; i++) {
        var appt = list.get(i);
        var id = appt.id;
        if (!this._cacheMap[id]) {
            this._cacheMap[id] = appt;
            if(appt.isAllDayEvent()) continue;
            var diff = appt.getStartTime() - currentTime;
            var isUpcomingEvent = (diff >= 0 && diff <= AjxDateUtil.MSEC_PER_HOUR)
            if((currentTime >= appt.getStartTime() && currentTime <= appt.getEndTime()) || isUpcomingEvent) {
                appt.isUpcomingEvent = isUpcomingEvent;
                newList.add(appt);
            }
        }
    }

    var qDlg = this.getQuickReminderDialog();
    qDlg.initialize(newList);
    qDlg.popup();
};


/**
 * Gets the quick reminder dialog.
 *
 * @return	{ZmQuickReminderDialog}	the dialog
 */
ZmCalMgr.prototype.getQuickReminderDialog =
function() {
	if (this._reminderDialog == null) {
		this._reminderDialog = new ZmQuickReminderDialog(appCtxt.getShell(), this, this._calController);
	}
	return this._reminderDialog;
};
}
if (AjxPackage.define("zimbraMail.calendar.model.ZmRecurrence")) {
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
 * Creates a recurrence object.
 * @class
 * This class represents a recurrence pattern.
 * 
 * @param	{ZmCalItem}	calItem		the calendar item
 * 
 */
ZmRecurrence = function(calItem) {
	this._startDate 			= (calItem && calItem.startDate) ? calItem.startDate : (new Date());

	// initialize all params (listed alphabetically)
	this.repeatCustom			= "0";  										// 1|0
	this.repeatCustomCount		= 1; 											// ival
	this.repeatCustomDayOfWeek	= "SU"; 										// (DAY|WEEKDAY|WEEKEND) | (SU|MO|TU|WE|TH|FR|SA)
	this.repeatBySetPos	= "1";
	this.repeatCustomMonthDay	= this._startDate.getDate();
	this.repeatCustomType		= "S"; 											// (S)pecific, (O)rdinal
	this.repeatEnd				= null;
	this.repeatEndCount			= 1; 											// maps to "count" (when there is no end date specified)
	this.repeatEndDate			= null; 										// maps to "until"
	this.repeatEndType			= "N";
	this.repeatMonthlyDayList	= null; 										// list of numbers representing days (usually, just one day)
	this.repeatType				= ZmRecurrence.NONE;							// maps to "freq"
	this.repeatWeekday			= false; 										// set to true if freq = "DAI" and custom repeats every weekday
	this.repeatWeeklyDays		= [];	 										// SU|MO|TU|WE|TH|FR|SA
	this.repeatYearlyMonthsList	= 1; 											// list of numbers representing months (usually, just one month)

    this._cancelRecurIds        = {};                                           //list of recurIds to be excluded
};

ZmRecurrence.prototype.toString =
function() {
	return "ZmRecurrence";
};

/**
 * Defines the "none" recurrence.
 */
ZmRecurrence.NONE		= "NON";
/**
 * Defines the "daily" recurrence.
 */
ZmRecurrence.DAILY		= "DAI";
/**
 * Defines the "weekly" recurrence.
 */
ZmRecurrence.WEEKLY		= "WEE";
/**
 * Defines the "monthly" recurrence.
 */
ZmRecurrence.MONTHLY	= "MON";
/**
 * Defines the "yearly" recurrence.
 */
ZmRecurrence.YEARLY		= "YEA";

/**
 * Defines the "day" week day selection.
 */
ZmRecurrence.RECURRENCE_DAY = -1;
/**
 * Defines the "weekend" week day selection.
 */
ZmRecurrence.RECURRENCE_WEEKEND = -2;
/**
 * Defines the "weekday" week day selection.
 */
ZmRecurrence.RECURRENCE_WEEKDAY = -3

ZmRecurrence.prototype.setJson =
function(inv) {
	if (this.repeatType == ZmRecurrence.NONE) {
        return;
    }

	var recur = inv.recur = {},
        add = recur.add = {},
        rule = add.rule = {},
        interval = rule.interval = {},
        until,
        bwd,
        bmd,
        c,
        i,
        day,
        wkDay,
        bysetpos,
        bm;

	rule.freq = this.repeatType;
	interval.ival = this.repeatCustomCount;

	if (this.repeatEndDate != null && this.repeatEndType == "D") {
		until = rule.until = {};
		until.d = AjxDateUtil.getServerDate(this.repeatEndDate);
	}
    else if (this.repeatEndType == "A"){
		c = rule.count = {};
		c.num = this.repeatEndCount;
	}

	if (this.repeatCustom != "1") {
        this.setExcludes(recur);
		return;
    }

	if (this.repeatType == ZmRecurrence.DAILY) {
        if (this.repeatWeekday) {
			// TODO: for now, handle "every weekday" as M-F
			//       eventually, needs to be localized work week days
			bwd = rule.byday = {};
            wkDay = bwd.wkday = [];
			for (i = 0; i < ZmCalItem.SERVER_WEEK_DAYS.length; i++) {
				day = ZmCalItem.SERVER_WEEK_DAYS[i];
				if (day == "SA" || day == "SU") {
					continue;
                }
				wkDay.push({
                    day : day
                });
			}
		}
	}
    else if (this.repeatType == ZmRecurrence.WEEKLY) {
        bwd = rule.byday = {};
        wkDay = bwd.wkday = [];
		for (i = 0; i < this.repeatWeeklyDays.length; ++i) {
            wkDay.push({
                day : this.repeatWeeklyDays[i]
            });
		}
	}
	else if (this.repeatType == ZmRecurrence.MONTHLY) {
		if (this.repeatCustomType == "S") {
			bmd = rule.bymonthday = {};
			bmd.modaylist = this.repeatMonthlyDayList.join(",");
		}
        else {
			bwd = rule.byday = {};
            bwd.wkday = [];
            if (this.repeatCustomDays) {
                for (i=0; i < this.repeatCustomDays.length; i++) {
                    wkDay = {};
                    wkDay.day = this.repeatCustomDays[i];
                    if (this.repeatCustomOrdinal) {
                        wkDay.ordwk = this.repeatCustomOrdinal;
                    }
                    bwd.wkday.push(wkDay);
                }
            }

            if (this.repeatCustomOrdinal == null) {
                bysetpos = rule.bysetpos = {};
                bysetpos.poslist = this.repeatBySetPos;
            }
        }
    }
	else if (this.repeatType == ZmRecurrence.YEARLY) {
		bm = rule.bymonth = {};
		bm.molist = this.repeatYearlyMonthsList;
		if (this.repeatCustomType == "O") {
			bwd = rule.byday = {};
            bwd.wkday = [];
            if(this.repeatCustomDays) {
                for(i=0; i < this.repeatCustomDays.length; i++) {
                    wkDay = {};
                    wkDay.day = this.repeatCustomDays[i];
                    if (this.repeatCustomOrdinal) {
                        wkDay.ordwk = this.repeatCustomOrdinal;
                    }
                    bwd.wkday.push(wkDay);
                }
            }

            if(this.repeatCustomOrdinal == null) {
                bysetpos = rule.bysetpos = {};
                bysetpos.poslist = this.repeatBySetPos;
            }

        } else {
			bmd = rule.bymonthday = {};
			bmd.modaylist = this.repeatCustomMonthDay;
		}

	}

    this.setExcludes(recur);
};

ZmRecurrence.prototype.setExcludes =
function(recur) {
    if (!this._cancelRecurIds) {
        return;
    }

    var exclude,
        dates,
        i,
        ridZ,
        dtval,
        s;

    for (i in this._cancelRecurIds) {

        if (!this._cancelRecurIds[i]) {
            continue;
        }

        if (!exclude && !dates) {
            exclude = recur.exclude = {};
            dates = exclude.dates = {};
            // Fix for bug: 77998, 84054. Object was missing child element dtval as per soap doc.
            dates.dtval = [];
        }

        ridZ = i;
        dtval = {};
        s = dtval.s = {};
        s.d = ridZ;
        // dtval should hold list of timestamps for conflicting appointments.
        dates.dtval.push(dtval);
    }
};

/**
 * Gets the recurrence blurb.
 * 
 * @return	{String}	the blurb text
 */
ZmRecurrence.prototype.getBlurb =
function() {
	if (this.repeatType == ZmRecurrence.NONE)
		return "";

	var every = [];
	switch (this.repeatType) {
		case ZmRecurrence.DAILY: {
			if (this.repeatCustom == "1" && this.repeatWeekday) {
				every.push(ZmMsg.recurDailyEveryWeekday);
			} else if (this.repeatCustomCount == 1) {
				every.push(ZmMsg.recurDailyEveryDay);
			} else {
				var formatter = new AjxMessageFormat(ZmMsg.recurDailyEveryNumDays);
				every.push(formatter.format(this.repeatCustomCount));
			}
			break;
		}
		case ZmRecurrence.WEEKLY: {
			if (this.repeatCustomCount == 1 && this.repeatWeeklyDays.length == 1) {
				var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatWeeklyDays[0]);
				var date = new Date();
				date.setDate(date.getDate() - date.getDay() + dayofweek);

				var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryWeekday);
				every.push(formatter.format(date));
			} else {
				var weekdays = [];
				for (var i = 0; i < this.repeatWeeklyDays.length; i++) {
					var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatWeeklyDays[i]);
					var date = new Date();
					date.setDate(date.getDate() - date.getDay() + dayofweek);
					weekdays.push(date);
				}

				var formatter = new AjxMessageFormat(ZmMsg.recurWeeklyEveryNumWeeksDate);
				every.push(formatter.format([ this.repeatCustomCount, weekdays, "" ]));
			}
			break;
		}
		case ZmRecurrence.MONTHLY: {
			if (this.repeatCustomType == "S") {
				var count = Number(this.repeatCustomCount);
				var date = Number(this.repeatMonthlyDayList[0]);

				var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsDate);
				every.push(formatter.format([ date, count ]));
			} else {
				var ordinal = Number(this.repeatCustomOrdinal);
                var bysetpos = Number(this.repeatBySetPos);                                
                var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatCustomDayOfWeek);
				var day = new Date();
				day.setDate(day.getDate() - day.getDay() + dayofweek);
                var count = Number(this.repeatCustomCount);

                var days = this.repeatCustomDays.join(",");
                var workWeekDays = ZmCalItem.SERVER_WEEK_DAYS.slice(1,6).join(","); 
                var weekEndDays = [ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SUNDAY], ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SATURDAY]].join(",");

                //if both values are present and unequal give preference to repeatBySetPos
                if (this.repeatCustomOrdinal != null &&
                    this.repeatBySetPos != null &&
                    this.repeatCustomOrdinal != this.repeatBySetPos) {
                    this.repeatCustomOrdinal = this.repeatBySetPos;
                }

                if((ZmCalItem.SERVER_WEEK_DAYS.join(",") == days) || (workWeekDays == days) || (weekEndDays == days)) {
                    var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsWeekDays);
                    var dayType = -1;
                    if(workWeekDays == days) {
                        dayType = 1;
                    }else if(weekEndDays == days) {
                        dayType = 0;
                    }
                    every.push(formatter.format([ bysetpos || ordinal, dayType, count ]));
                }else {
                    var day = new Date();
                    day.setDate(day.getDate() - day.getDay() + dayofweek);
                    var formatter = new AjxMessageFormat(ZmMsg.recurMonthlyEveryNumMonthsNumDay);
                    every.push(formatter.format([ bysetpos || ordinal, day, count ]));
                }
			}
			break;
		}
		case ZmRecurrence.YEARLY: {
			if (this.repeatCustomType == "S") {
				var month = new Date();
				month.setMonth(Number(this.repeatYearlyMonthsList) - 1);
				var day = Number(this.repeatCustomMonthDay);

				var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryDate);
				every.push(formatter.format([ month, day ]));
			} else {
				var ordinal = Number(this.repeatCustomOrdinal);
                var bysetpos = Number(this.repeatBySetPos);                
                var dayofweek = AjxUtil.indexOf(ZmCalItem.SERVER_WEEK_DAYS, this.repeatCustomDayOfWeek);
                var month = new Date();
                month.setMonth(Number(this.repeatYearlyMonthsList)-1);

                var days = this.repeatCustomDays.join(",");
                var workWeekDays = ZmCalItem.SERVER_WEEK_DAYS.slice(1,6).join(",");
                var weekEndDays = [ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SUNDAY], ZmCalItem.SERVER_WEEK_DAYS[AjxDateUtil.SATURDAY]].join(",");

                if((ZmCalItem.SERVER_WEEK_DAYS.join(",") == days) || (workWeekDays == days) || (weekEndDays == days)) {
                    var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthWeekDays);
                    var dayType = -1;
                    if(workWeekDays == days) {
                        dayType = 1;
                    }else if(weekEndDays == days) {
                        dayType = 0;
                    }
                    every.push(formatter.format([ bysetpos || ordinal, dayType, month ]));
                }else {

                    var day = new Date();
                    day.setDate(day.getDate() - day.getDay() + dayofweek);
                    var formatter = new AjxMessageFormat(ZmMsg.recurYearlyEveryMonthNumDay);
                    every.push(formatter.format([ bysetpos || ordinal, day, month ]));
                }
            }
			break;
		}
	}

	// start
	var start = [];
	var formatter = new AjxMessageFormat(ZmMsg.recurStart);
	start.push(formatter.format(this._startDate));

	// end
	var end = [];
	switch (this.repeatEndType) {
		case "N": {
			end.push(ZmMsg.recurEndNone);
			break;
		}
		case "A": {
			formatter = new AjxMessageFormat(ZmMsg.recurEndNumber);
			end.push(formatter.format(this.repeatEndCount));
			break;
		}
		case "D": {
			formatter = new AjxMessageFormat(ZmMsg.recurEndByDate);
			end.push(formatter.format(this.repeatEndDate));
			break;
		}
	}

	// join all three together
	if (every.length > 0) {
		every.push(".  ");
	}
	if (end.length > 0) {
		end.push(".  ");
	}
	formatter = new AjxMessageFormat(ZmMsg.recurBlurb);
	return formatter.format([ every.join(""), end.join(""), start.join("") ]);
};

ZmRecurrence.prototype.parse =
function(recurRules) {
	// bug 16513: This array never gets cleaned.
	// TODO: Maybe this needs a flag so it doesn't reparse?
	this.repeatWeeklyDays = [];

	for (var k = 0; k < recurRules.length ; ++k) {
		var adds = recurRules[k].add;
		if (!adds) continue;

		this.repeatYearlyMonthsList = this._startDate.getMonth() + 1;
		for (var i = 0; i < adds.length; ++i) {
			var rules = adds[i].rule;
			if (!rules) continue;

			for (var j = 0; j < rules.length; ++j) {
				var rule = rules[j];
				if (rule.freq) {
					this.repeatType = rule.freq.substring(0,3);
					if (rule.interval && rule.interval[0].ival) {
						this.repeatCustomCount = parseInt(rule.interval[0].ival);
						this.repeatCustom = "1";
					}
				}
				if (rule.bymonth) {
					this.repeatYearlyMonthsList = rule.bymonth[0].molist;
					this.repeatCustom = "1";
				}
				if (rule.bymonthday) {
					if (this.repeatType == ZmRecurrence.YEARLY) {
						this.repeatCustomMonthDay = rule.bymonthday[0].modaylist;
						this.repeatCustomType = "S";
					} else if (this.repeatType == ZmRecurrence.MONTHLY){
						this.repeatMonthlyDayList = rule.bymonthday[0].modaylist.split(",");
					}
					this.repeatCustom = "1";
				}
				if (rule.byday && rule.byday[0] && rule.byday[0].wkday) {
					this.repeatCustom = "1";
					var wkday = rule.byday[0].wkday;
					if (this.repeatType == ZmRecurrence.WEEKLY || (this.repeatType == ZmRecurrence.DAILY && wkday.length == 5)) {
						this.repeatWeekday = this.repeatType == ZmRecurrence.DAILY;
						for (var x = 0; x < wkday.length; ++x) {
							this.repeatWeeklyDays.push(wkday[x].day);
						}
					} else {
						this.repeatCustomDayOfWeek = wkday[0].day;
                        var days = [];
                        for(var i = 0; i < wkday.length; i++) {
                            days.push(wkday[i].day);
                        }
                        this.repeatCustomDays = days;                        
                        this.repeatCustomOrdinal = wkday[0].ordwk;
                        this.repeatBySetPos  = (rule.bysetpos && (rule.bysetpos.length > 0)) ? rule.bysetpos[0].poslist : null;
                        //ical sends only ordwk in recurrence rule, we follow outlook behavior in setting repeatbysetpos instead of ordwk
                        if(this.repeatBySetPos == null && this.repeatCustomOrdinal) {
                            this.repeatBySetPos  = this.repeatCustomOrdinal; 
                        }
                        this.repeatCustomType = "O";
					}
				}
				if (rule.until) {
					this.repeatEndType = "D";
					this.repeatEndDate = AjxDateUtil.parseServerDateTime(rule.until[0].d);
				} else if (rule.count) {
					this.repeatEndType = "A";
					this.repeatEndCount = rule.count[0].num;
				}
			}
		}
	}
};

ZmRecurrence.prototype.setRecurrenceStartTime =
function(startTime) {
	
	this._startDate.setTime(startTime);
    this.repeatCustomMonthDay	= this._startDate.getDate();    
	
	if (this.repeatType == ZmRecurrence.NONE) return;

	//if (this.repeatCustom != "0")
		//return;

 	if (this.repeatType == ZmRecurrence.WEEKLY) {
		this.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[this._startDate.getDay()]];
	} else if (this.repeatType == ZmRecurrence.MONTHLY) {
		this.repeatMonthlyDayList = [this._startDate.getDate()];
    } else if (this.repeatType == ZmRecurrence.YEARLY) {
		this.repeatYearlyMonthsList = this._startDate.getMonth() + 1;	
	}
};

ZmRecurrence.prototype.setRecurrenceRules =
function(recurRules, startDate) {

    if (recurRules)
        this.parse(recurRules);    

    if(!startDate) return;

    if (this.repeatWeeklyDays == null) {
        this.repeatWeeklyDays = [ZmCalItem.SERVER_WEEK_DAYS[startDate.getDay()]];
    }
    if (this.repeatMonthlyDayList == null) {
        this.repeatMonthlyDayList = [startDate.getDate()];
    }

};

ZmRecurrence.prototype.addCancelRecurId =
function(ridZ) {
    this._cancelRecurIds[ridZ] = true;        
};

ZmRecurrence.prototype.resetCancelRecurIds =
function(   ) {
    this._cancelRecurIds = {};
};

ZmRecurrence.prototype.isInstanceCanceled =
function(ridZ) {
    return this._cancelRecurIds[ridZ];
};

ZmRecurrence.prototype.removeCancelRecurId =
function(ridZ) {
    this._cancelRecurIds[ridZ] = null;
};

ZmRecurrence.prototype.parseExcludeInfo =
function(recurInfo) {

    if (!recurInfo) { return; }

    for(var i=0; i < recurInfo.length; i++) {
        var excludeInfo = (recurInfo[i] && recurInfo[i].exclude) ? recurInfo[i].exclude : null;
        if(!excludeInfo) continue;
        for(var j=0; j < excludeInfo.length; j++) {
            var datesInfo = excludeInfo[j].dates;
            if(datesInfo) this._parseExcludeDates(datesInfo);
        }
    }

};

ZmRecurrence.prototype._parseExcludeDates =
function(datesInfo) {
    for(var j=0; j < datesInfo.length; j++) {

        var dtval = datesInfo[j].dtval;
        if(!dtval) continue;

        for(var k=0; k < dtval.length; k++) {
            var dinfo = dtval[k];
            var excludeDate = (dinfo && dinfo.s) ? dinfo.s[0].d : null;
            if(excludeDate) this.addCancelRecurId(excludeDate);
        }
    }
};

}
if (AjxPackage.define("zimbraMail.tasks.model.ZmTaskMgr")) {
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

ZmTaskMgr = function(container) {
	this._container = container;
	//this.clearCache();

	this._listeners = {};
	this._folderNames = {};

};

ZmTaskMgr.prototype = new ZmCalMgr;
ZmTaskMgr.prototype.constructor = ZmTaskMgr;

ZmTaskMgr.prototype.toString =
function() {
	return "ZmTaskMgr";
};

ZmTaskMgr.prototype._refreshCallback =
function(list) {
	this.getReminderController()._refreshCallback(list);
};

ZmTaskMgr.prototype.getReminderController =
function() {
	if (!this._reminderController) {
		this._reminderController = new ZmReminderController(this, "task");
	}
	return this._reminderController;
};

ZmTaskMgr.prototype.getCalViewController =
function() {
	var taskController = AjxDispatcher.run("GetTaskController");
	return taskController;
};

ZmTaskMgr.prototype._miniCalMouseOutDayCallback =
function(control) {
	this._currentMouseOverDay = null;
};

ZmTaskMgr.prototype.getApptSummaries =
function(params) {
	var apptVec = this.setSearchParams(params);

	if (apptVec != null && (apptVec instanceof AjxVector)) {
		return apptVec;
	}

	// this array will hold a list of tasks as we collect them from the server
	this._rawTasks = [];

	if (params.callback) {
		this._search(params);
	} else {
		return this._search(params);
	}
};

ZmTaskMgr.prototype.setSearchParams =
function(params) {
	if (!(params.folderIds instanceof Array)) {
		params.folderIds = [params.folderIds];
	} else if (params.folderIds.length == 0) {
		var newVec = new AjxVector();
		if (params.callback) {
			params.callback.run(newVec);
		}
		return newVec;
	}

	var folderIdMapper = {};
	var query = "";
	for (var i=0; i < params.folderIds.length; i++) {
		var fid = params.folderIds[i];
		var systemFolderId = appCtxt.getActiveAccount().isMain
			? fid : ZmOrganizer.getSystemId(fid);

		// map remote folder ids into local ones while processing search since
		// server wont do it for us (see bug 7083)
		var folder = appCtxt.getById(systemFolderId);
		var rid = folder ? folder.getRemoteId() : systemFolderId;
		folderIdMapper[rid] = systemFolderId;

		if (query.length) {
			query += " OR ";
		}
		var idText = AjxUtil.isNumeric(fid) ? fid : ['"', fid, '"'].join("");
		query += "inid:" + idText;

	}
	params.queryHint = query;
	params.folderIdMapper = folderIdMapper;
	params.offset = 0;
};

ZmTaskMgr.prototype._search =
function(params) {
	var jsonObj = {SearchRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.SearchRequest;

	this._setSoapParams(request, params);

	var accountName = appCtxt.multiAccounts ? appCtxt.accountList.mainAccount.name : null;
	if (params.callback) {
		appCtxt.getAppController().sendRequest({
			jsonObj: jsonObj,
			asyncMode: true,
			callback: (new AjxCallback(this, this._getApptSummariesResponse, [params])),
			noBusyOverlay: params.noBusyOverlay,
			accountName: accountName
		});
	} else {
		var response = appCtxt.getAppController().sendRequest({jsonObj: jsonObj, accountName: accountName});
		var result = new ZmCsfeResult(response, false);
		return this._getApptSummariesResponse(params, result);
	}
};

ZmTaskMgr.prototype._setSoapParams =
function(request, params) {
	request.sortBy = "none";
	request.limit = "500";
	//request.calExpandInstStart = params.start;
	//request.calExpandInstEnd = params.end;
	request.types = ZmSearch.TYPE[ZmItem.TASK];
	request.offset = params.offset;

	var query = params.query;
	if (params.queryHint) {
		query = (query != null)
			? (query + " (" + params.queryHint + ")")
			: params.queryHint;
	}
	request.query = {_content:query};
};


ZmTaskMgr.prototype._getApptSummariesResponse =
function(params, result) {
	// TODO: mark both as needing refresh?
	if (!result) { return; }

	var callback = params.callback;
	var resp;
	try {
		resp = result.getResponse();
	} catch (ex) {
		if (callback) {
			callback.run(new AjxVector());
		}
		return;
	}

	var searchResp = resp.SearchResponse;
	var newList = this.processSearchResponse(searchResp, params);
	if (newList == null) { return; }

	if (callback) {
		callback.run(newList, params.query);
	} else {
		return newList;
	}
};

ZmTaskMgr.prototype.processSearchResponse =
function(searchResp, params) {
	if(!searchResp) { return; }

	if (searchResp && searchResp.task && searchResp.task.length) {
		this._rawTasks = this._rawTasks != null
			? this._rawTasks.concat(searchResp.task)
			: searchResp.task;

		// if "more" flag set, keep requesting more appts
		if (searchResp.more) {
			var lastAppt = searchResp.task[searchResp.task.length-1];
			if (lastAppt) {
				params.offset += 500;
				this._search(params);
				return;
			}
		}
	}

	var newList = new AjxVector();
	if (this._rawTasks && this._rawTasks.length) {
		//this._list = new ZmList(ZmItem.TASK);
		for (var i = 0; i < this._rawTasks.length; i++) {
			DBG.println(AjxDebug.DBG2, "task[j]:" + this._rawTasks[i].name);
			var taskNode = this._rawTasks[i];
			////var instances = taskNode ? taskNode.inst : null;
			////if (instances) {
            //var args = {list:this._list};
            // Pass null as the list - otherwise the list, created above and used nowhere else
            // for viewing will be the one associated with teh
            var args = {list:null};
				////for (var j = 0; j < instances.length; j++) {
					var task = ZmTask.createFromDom(taskNode, args, null);
					DBG.println(AjxDebug.DBG2, "lite task :" + task);
					if (task) newList.add(task);
				////}
			////}

            // Accumulate this list to be processed by the reminderController callback
            newList.add(task);
		}

	}
	return newList;
};

ZmTaskMgr.prototype.getCalendarName =
function(folderId) {
	var app = appCtxt.getApp(ZmApp.TASKS);
	return app.getTaskFolderName(folderId);
};


ZmTaskMgr.prototype.getCheckedCalendarFolderIds =
function(localOnly) {
	var app = appCtxt.getApp(ZmApp.TASKS);
	return app.getTaskFolderIds(localOnly);
};

ZmTaskMgr.prototype._handleError =
function(ex) {
	if (ex.code == 'mail.INVITE_OUT_OF_DATE' ||	ex.code == 'mail.NO_SUCH_APPT') {
		var msgDialog = appCtxt.getMsgDialog();
		msgDialog.setMessage(ZmMsg.apptOutOfDate, DwtMessageDialog.INFO_STYLE);
		msgDialog.popup();
		return true;
	}
	return false;
};


ZmTaskMgr.prototype.getQuickReminderSearchTimeRange =
function() {
	var endOfDay = new Date();
	endOfDay.setHours(23,59,59,999);

	var end = new Date(endOfDay.getTime());

	var start = endOfDay;
	start.setHours(0,0,0, 0);

	return { start: start.getTime(), end: end.getTime() };
};

ZmTaskMgr.prototype.showQuickReminder =
function() {
    var params = this.getQuickReminderParams();
    this.getApptSummaries(params);
};

ZmTaskMgr.prototype.getQuickReminderParams =
function() {

	var timeRange = this.getQuickReminderSearchTimeRange();
	return {
		start: timeRange.start,
		end: timeRange.end,
		fanoutAllDay: false,
		folderIds: this.getCheckedCalendarFolderIds(true),
		callback: (new AjxCallback(this, this._quickReminderCallback)),
		includeReminders: true
	};
};

ZmTaskMgr.prototype._quickReminderCallback =
function(list) {
    var newList = new AjxVector();
    this._cacheMap = {};
    var size = list.size();

    var currentTime  = (new Date()).getTime();

    for (var i = 0; i < size; i++) {
        var appt = list.get(i);
        var id = appt.id;
        if (!this._cacheMap[id]) {
            this._cacheMap[id] = appt;
            if(appt.isAllDayEvent()) continue;
            var diff = appt.getStartTime() - currentTime;
            var isUpcomingEvent = (diff >= 0 && diff <= AjxDateUtil.MSEC_PER_HOUR)
            if((currentTime >= appt.getStartTime() && currentTime <= appt.getEndTime()) || isUpcomingEvent) {
                appt.isUpcomingEvent = isUpcomingEvent;
                newList.add(appt);
            }
        }
    }

    var qDlg = this.getQuickReminderDialog();
    qDlg.initialize(newList);
    qDlg.popup();
};


/**
 * Gets the quick reminder dialog.
 *
 * @return	{ZmQuickReminderDialog}	the dialog
 */
ZmTaskMgr.prototype.getQuickReminderDialog =
function() {
	if (this._reminderDialog == null) {
		this._reminderDialog = new ZmQuickReminderDialog(appCtxt.getShell(), this, this._calController);
	}
	return this._reminderDialog;
};
}
if (AjxPackage.define("zimbraMail.calendar.model.ZmMiniCalCache")) {
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

ZmMiniCalCache = function(calViewController) {
	this._calViewController = calViewController;
	this.clearCache();
};

ZmMiniCalCache.prototype.toString =
function() {
	return "ZmMiniCalCache";
};

ZmMiniCalCache.prototype.clearCache =
function() {
	this._miniCalData = {};
};

ZmMiniCalCache.prototype.updateCache =
function(params, data) {
	var key = this._getCacheKey(params);
	this._miniCalData[key] = data;	
};

ZmMiniCalCache.prototype._getCacheKey =
function(params) {
	var sortedFolderIds = [];
	sortedFolderIds = sortedFolderIds.concat(params.folderIds);
	sortedFolderIds.sort();
	return (params.start + ":" + params.end + ":" + sortedFolderIds.join(":"));
};

ZmMiniCalCache.prototype._getMiniCalData =
function(params) {
	var cacheKey = this._getCacheKey(params);
	var cachedData = this._miniCalData[cacheKey];
	if (cachedData) {
		this.highlightMiniCal(cachedData);
		if (params.callback) {
			params.callback.run(cachedData);
			return;
		}
		return cachedData;
	}	

	var jsonObj = {GetMiniCalRequest:{_jsns:"urn:zimbraMail"}};
	var request = jsonObj.GetMiniCalRequest;

	this._setSoapParams(request, params);

	appCtxt.getAppController().sendRequest({
		jsonObj: jsonObj,
		asyncMode: true,
        offlineCache: true,
		callback: (new AjxCallback(this, this._getMiniCalResponse, [params])),
		errorCallback: (new AjxCallback(this, this._handleMiniCalResponseError, [params])),
        offlineCallback: this._getMiniCalOfflineResponse.bind(this, params),
		noBusyOverlay: params.noBusyOverlay,
		accountName: (appCtxt.multiAccounts ? appCtxt.accountList.mainAccount.name : null)
	});
};

ZmMiniCalCache.prototype.getCacheData =
function(params) {
	var cacheKey = this._getCacheKey(params);
	var cachedData = this._miniCalData[cacheKey];
	if (cachedData) {
		return cachedData;
	}
};

ZmMiniCalCache.prototype._handleMiniCalResponseError =
function(params, result) {
	var code = result ? result.code : null;
	if (code == ZmCsfeException.ACCT_NO_SUCH_ACCOUNT ||
		code == ZmCsfeException.MAIL_NO_SUCH_MOUNTPOINT)
	{
		var data = (result && result.data) ? result.data : null;
		var id = (data && data.itemId && (data.itemId.length>0)) ? data.itemId[0] : null;
		if (id && appCtxt.getById(id) && this._faultHandler) {
			var folder = appCtxt.getById(id);
			folder.noSuchFolder = true;
			this._faultHandler.run(folder);
			return true;
		}
	}

	//continue with callback operation
	if(params.callback) {
		params.callback.run([]);
	}

	return true;
};

ZmMiniCalCache.prototype._setSoapParams = 
function(request, params) {
	request.s = params.start;
	request.e = params.end;
    request.tz = params.tz;

	var folderNode = null;
	if (params.folderIds && params.folderIds.length) {
		request.folder = [];
		for (var i = 0; i < params.folderIds.length; i++) {
			request.folder.push({id:params.folderIds[i]});
		}
	}
    if(params.tz){
        request.tz = [];
        var timezone = AjxTimezone.getRule(params.tz);
        request.tz.push({id:params.tz,stdoff: timezone ? timezone.standard.offset : 0});
    }

};

ZmMiniCalCache.prototype.setFaultHandler =
function(faultHandler) {
	this._faultHandler = faultHandler;
};

ZmMiniCalCache.prototype._getMiniCalResponse =
function(params, result) {
	var data = [];
	if (!result) { return data; }

	var callback = params.callback;
	var resp = result && result._data && result._data;
	var miniCalResponse = resp.GetMiniCalResponse;

	if (miniCalResponse && miniCalResponse.date) {
		var dates = miniCalResponse.date;
		if (dates) {
			for (var i = 0; i < dates.length; i++) {
				if (dates[i]._content) {
					data.push(dates[i]._content);
				}
			}
		}	
		this.highlightMiniCal(data);
	} else {
		// always reset hiliting if empty response returned
		this.highlightMiniCal([]);
	}

    var errors = (miniCalResponse && miniCalResponse.error);
    this.handleError(errors);

	this.updateCache(params, data);

	if (params.callback) {
		params.callback.run(data);
		return;
	}

	return data;
};

ZmMiniCalCache.prototype._getMiniCalOfflineResponse =
function(params) {

    var calMgr = appCtxt.getCalManager();
    var calViewController = calMgr && calMgr.getCalViewController();
    if (calViewController) {
        var apptCache = calViewController.getApptCache();
        if (apptCache) {
            var folderIds = calViewController.getMainAccountCheckedCalendarIds();
            var searchParams = { folderIds: folderIds,
                                 start: params.start,
                                 end: params.end
                               };
            var apptList = apptCache.setSearchParams(searchParams);
            if (apptList) {
                apptCache.processOfflineMiniCal(params, apptList);
            } else {
                apptCache.offlineSearchAppts(searchParams, params, null);
            }
        }
    }
}

ZmMiniCalCache.prototype.processBatchResponse =
function(miniCalResponse, data) {
	if (!miniCalResponse) { return; }

	for (var i = 0; i < miniCalResponse.length; i++) {
		var dates = (miniCalResponse[i] && miniCalResponse[i].date);
		if (dates) {
			for (var j = 0; j < dates.length; j++) {
				if (dates[j]._content) {
					data.push(dates[j]._content);
				}
			}
		}

        var errors = (miniCalResponse[i] && miniCalResponse[i].error);
        this.handleError(errors);
	}
};

ZmMiniCalCache.prototype.handleError =
function(errors) {
    if (errors && errors.length) {
        for (var i = 0; i < errors.length; i++) {
            if (errors[i].code == ZmCsfeException.MAIL_NO_SUCH_FOLDER || errors[i].code == ZmCsfeException.MAIL_NO_SUCH_MOUNTPOINT || errors[i].code == ZmCsfeException.ACCT_NO_SUCH_ACCOUNT || errors[i].code == ZmCsfeException.SVC_PERM_DENIED) {
                var id = errors[i].id;
                if (id && appCtxt.getById(id)) {
                    var folder = appCtxt.getById(id);
                    folder.noSuchFolder = true;
                }
            }
        }
    }
};

ZmMiniCalCache.prototype.highlightMiniCal =
function(dateArr) {
	var highlight = {};
	for (var i = 0; i < dateArr.length; i++) {
		if (dateArr[i]) {
			highlight[dateArr[i]] = AjxDateFormat.parse("yyyyMMdd", dateArr[i]);
		}
	}
	if (this._calViewController && this._calViewController._miniCalendar) {
		this._calViewController._miniCalendar.setHilite(highlight, true, true);
	}
};
}
if (AjxPackage.define("zimbraMail.calendar.controller.ZmSnoozeBeforeProcessor")) {
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
 * Helper class for applying snooze 'before' times to a set of appointments that
 * were handled en-masse in the reminder dialog.
 *
 * For each appointment
 *  - If the appointment has already started (whether in-progress or completed) then the
 *    before value is not applied, and we store this appt for later processing.
 *  - For appointments that have not started yet:
 *     - If the appointment startTime + snoozeTime is in the future (> now) then
 *       set the appt reminder untilTime.
 *     - If the startTime + snoozeTime is in the past (< now), loop over the
 *       standard set of 'before' snooze times and find the max before time that we can
 *       apply and still have the reminder occur in the future.
 *    Once a time for the appointment's reminder is calculated, save the minimum one (i.e. the
 *    reminder for the earlier occuring appt) as earliestUntilTime.
 *
 * Finally, loop over each of the appointments whose start time is past.
 *  - Set their snooze time to the soonestUntilTime.  When the soonest appt reminder goes off,
 *    any past appointments will appear too.  The user should dismiss them, but till then they
 *    are dragged along
 *
 */
ZmSnoozeBeforeProcessor = function(apptType) {
    this._apptType = apptType;
}
ZmSnoozeBeforeProcessor.prototype.constructor = ZmSnoozeBeforeProcessor;


ZmSnoozeBeforeProcessor.prototype.execute =
function(apptList, chosenSnoozeMilliseconds, appts) {
    var added = false;
    var untilTime;
    var earliestUntilTime = 0;
    var pastAppts = [];
    var actionNode;
    var now = (new Date()).getTime();
    for (var i = 0; i < apptList.size(); i++) {
        var appt = apptList.get(i);
        var apptStartTime = appt.getAlarmInstStart();
        var snoozeMilliseconds = chosenSnoozeMilliseconds;
        if (apptStartTime <= now) {
            // Past or in progress appt.  Once we determine the earliest untilTime,
            // we will apply it to these appts, to 'drag them along'
            pastAppts.push(appt);
        } else {
            // Only apply snooze reminder for appts that have not already started
            snoozeMilliseconds = -snoozeMilliseconds
            untilTime = apptStartTime + snoozeMilliseconds;
            // Test that the chosen 'before' time is valid for this appt.  The user may
            // have entered a value that would cause a reminder to be scheduled for the past.
            // So check the user specified snoozeTime (untilTime = apptStart + snoozeTime); if it
            // is in the past, loop over the standard 'before' snooze intervals and choose the
            // first that results in a reminder scheduled for the future.
            for (var iSnooze = 0; iSnooze < ZmReminderDialog.SNOOZE_MSEC.length; iSnooze++) {
                if ((untilTime >= now) || (snoozeMilliseconds >= 0)) break;
                snoozeMilliseconds = ZmReminderDialog.SNOOZE_MSEC[iSnooze];
                untilTime = apptStartTime + snoozeMilliseconds;
            }

            if (snoozeMilliseconds < 0) {
                // Found a valid untilTime
                var apptInfo = { id: appt.id, until: untilTime};
                appts.push(apptInfo)


                added = true;
                if ((earliestUntilTime ==0) || (earliestUntilTime > untilTime)) {
                    // Keep track of the earliest reminder that will occur
                    earliestUntilTime = untilTime;
                }
            }
        }
    }

    if (added) {
        // At least one future appt was added.  Take the one with the earliest reminder
        // and apply it to past appointments
        for (var i = 0; i < pastAppts.length; i++) {
           var apptInfo = { id: pastAppts[i].id, until: earliestUntilTime};
            appts.push(apptInfo)
        }
    }
    return added;
}

}
if (AjxPackage.define("zimbraMail.calendar.controller.ZmReminderController")) {
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
 * Creates a new reminder controller to manage the reminder dialog and status area.
 * @class
 *
 * This controller uses the following timed actions:
 * <ol>
 * <li>one for refreshing our "cache" of upcoming appts to notify on</li>
 * <li>one for when to next popup the reminder dialog. 
 *    by default, next appt start time minus lead time pref (i..e, 5 minutes before).
 *    but, also could be controlled by snooze prefs.</li>
 * </ol>
 * 
 * @param	{ZmCalViewController}		calController		the controller
 * 
 */
ZmReminderController = function(calController, apptType) {
	this._calController = calController;
    this._apptType = apptType;
	this._apptState = {};	// keyed on appt.getUniqueId(true)
    this._cacheMap = {};    
	this._cachedAppts = new AjxVector(); // set of appts in cache from refresh
	this._activeAppts = new AjxVector(); // set of appts we are actively reminding on
	this._oldAppts = new AjxVector(); // set of appts which are olde and needs silent dismiss    
	this._housekeepingTimedAction = new AjxTimedAction(this, this._housekeepingAction);
	this._refreshTimedAction = new AjxTimedAction(this, this.refresh);
};

ZmReminderController.prototype.constructor = ZmReminderController;

/**
 * Defines the "active" reminder state.
 */
ZmReminderController._STATE_ACTIVE = 1; // appt was in reminder, never dismissed
/**
 * Defines the "dismissed" reminder state.
 */
ZmReminderController._STATE_DISMISSED = 2; // appt was in reminder, and was dismissed
/**
 * Defines the "snoozed" reminder state.
 */
ZmReminderController._STATE_SNOOZED = 3; // appt was in reminder, and was snoozed

ZmReminderController._CACHE_RANGE = 24; // range of appts to grab 24 hours (-1, +23)
ZmReminderController._CACHE_REFRESH = 16; // when to grab another range

ZmReminderController.prototype.toString =
function() {
	return "ZmReminderController";
};

/**
 * called when: (1) app first loads, (2) on refresh blocks, (3) after appt cache is cleared. Our
 * _apptState info will keep us from popping up the same appt again if we aren't supposed to
 * (at least for the duration of the app)
 * 
 * @private
 */
ZmReminderController.prototype.refresh =
function(retryCount) {
	this._searchTimeRange = this.getSearchTimeRange();
    DBG.println(AjxDebug.DBG1, "reminder search time range: " + this._searchTimeRange.start + " to " + this._searchTimeRange.end);

	try {
		var params = this.getRefreshParams();
	} catch(e) {
		if (retryCount == null && retryCount != 0) {
			retryCount = 3; //retry 3 times before giving up.
		}
		//bug 76771 if there is a exception retry after 1 sec
		if (retryCount) {
			setTimeout(this.refresh.bind(this, --retryCount), 1000);
			return;
		}
		DBG.println(AjxDebug.DBG1, "Too many failures to get refresh params. Giving up.");
		return;
	}
	this._calController.getApptSummaries(params);

	// cancel outstanding refresh, since we are doing one now, and re-schedule a new one
	if (this._refreshActionId) {
		AjxTimedAction.cancelAction(this._refreshActionId);
	}
	DBG.println(AjxDebug.DBG1, "reminder refresh");
	this._refreshActionId = AjxTimedAction.scheduleAction(this._refreshTimedAction, (AjxDateUtil.MSEC_PER_HOUR * ZmReminderController._CACHE_REFRESH));
};

/**
 * Gets the search time range.
 * 
 * @return	{Hash}	a hash of parameters
 */
ZmReminderController.prototype.getSearchTimeRange =
function() {
	var endOfDay = new Date();
	endOfDay.setHours(23,59,59,999);

	//grab a week's appt backwards
	var end = new Date(endOfDay.getTime());
	endOfDay.setDate(endOfDay.getDate()-7);

	var start = endOfDay;
	start.setHours(0,0,0, 0);

	return { start: start.getTime(), end: end.getTime() };
};

ZmReminderController.prototype.getRefreshParams =
function() {
	
	var timeRange = this.getSearchTimeRange();
	return {
		start: timeRange.start,
		end: timeRange.end,
		fanoutAllDay: false,
		folderIds: this._apptType ==
            "appt" ? this._calController.getReminderCalendarFolderIds() :
                     this._calController.getCheckedCalendarFolderIds(true),
		callback: (new AjxCallback(this, this._refreshCallback)),
		includeReminders: true
	};
};

ZmReminderController.prototype._cancelRefreshAction =
function() {
	if (this._refreshActionId) {
		AjxTimedAction.cancelAction(this._refreshActionId);
		delete this._refreshActionId;
	}
};

ZmReminderController.prototype._cancelHousekeepingAction =
function() {
	if (this._houseKeepingActionId) {
		AjxTimedAction.cancelAction(this._housekeepingActionId);
		delete this._houseKeepingActionId;
	}
};

ZmReminderController.prototype._scheduleHouseKeepingAction =
function() {
	this._cancelHousekeepingAction(); //cancel to be on safe side against race condition when 2 will be runing instead of one.
	this._housekeepingActionId = AjxTimedAction.scheduleAction(this._housekeepingTimedAction, 60 * 1000);
};

/**
 * called after we get upcoming appts from server. Save list,
 * and call housekeeping.
 *
 * @private
 */
ZmReminderController.prototype._refreshCallback =
function(list) {
	if (this._refreshDelay > 0) {
		AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._refreshCallback, [list]), this._refreshDelay);
		this._refreshDelay = 0;
		return;
	}

	if (list instanceof ZmCsfeException) {
		this._calController._handleError(list, new AjxCallback(this, this._maintErrorHandler));
		return;
	}

	var newList = new AjxVector();
	this._cacheMap = {};

	// filter recurring appt instances, the alarmData is common for all the instances
	var size = list.size();
	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
		var id = appt.id;
        var hasAlarm = appt.recurring ? appt.isAlarmInstance() : appt.hasAlarmData();
		if (hasAlarm) {
            var alarmData = appt.getAlarmData();
            alarmData = (alarmData && alarmData.length > 0) ? alarmData[0] : {};
            AjxDebug.println(AjxDebug.REMINDER, appt.name + " :: " + appt.startDate + " :: " + appt.endDate + " :: " + appt.recurring + " :: " + appt.isException + " :: " + alarmData.nextAlarm + " :: " + alarmData.alarmInstStart);
			if (!this._cacheMap[id]) {
				this._cacheMap[id] = true;
				newList.add(appt);
			}
		}
	}

	this._cachedAppts = newList.clone();
	this._cachedAppts.sort(ZmCalBaseItem.compareByTimeAndDuration);
	this._activeAppts.removeAll();

	// cancel outstanding timed action and update now...
	this._cancelHousekeepingAction();
	this._housekeepingAction();
};

ZmReminderController.prototype.updateCache =
function(list) {
	if (!list) { return; }

	if (!this._cachedAppts) {
		this._cachedAppts = new AjxVector();
	}

    AjxDebug.println(AjxDebug.REMINDER, "updating reminder cache...");
	var srchRange = this.getSearchTimeRange();
	var count = 0;

	// filter recurring appt instances, the alarmData is common for all the instances
	var size = list.size();
	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
		var id = appt.id;
		if(appt.hasAlarmData() && !this._cacheMap[id] && appt.isStartInRange(srchRange.start, srchRange.end)) {
			this._cacheMap[id] = true;
			this._cachedAppts.add(appt);
			count++;
		}
	}

    AjxDebug.println(AjxDebug.REMINDER, "new appts added to reminder cache :" + count);
};

ZmReminderController.prototype.isApptSnoozed =
function(uid) {
	return (this._apptState[uid] == ZmReminderController._STATE_SNOOZED);
};

/**
 * go through list to see if we should add any cachedAppts to activeAppts and
 * popup the dialog or not.
 * 
 * @private
 */
ZmReminderController.prototype._housekeepingAction =
function() {
    AjxDebug.println(AjxDebug.REMINDER, "reminder house keeping action...");
	var rd = this.getReminderDialog();
	if (ZmCsfeCommand.noAuth) {
        AjxDebug.println(AjxDebug.REMINDER, "reminder check: no auth token, bailing");
		if (rd && rd.isPoppedUp()) {
			rd.popdown();
		}
		return;
	}

	if (this._searchTimeRange) {
		var newTimeRange = this.getSearchTimeRange();
		var diff = newTimeRange.end - this._searchTimeRange.end;
		if (diff > AjxDateUtil.MSEC_PER_HOUR) {
            AjxDebug.println(AjxDebug.REMINDER, "time elapsed - refreshing reminder cache");
			this._searchTimeRange = null;
			this.refresh();
			return;
		}
	}

	var cachedSize = this._cachedAppts.size();
	var activeSize = this._activeAppts.size();
	if (cachedSize == 0 && activeSize == 0) {
        AjxDebug.println(AjxDebug.REMINDER, "no appts - empty cached and active list");
		this._scheduleHouseKeepingAction();
		return;
	}

	var numNotify = 0;
	var toRemove = [];

	for (var i=0; i < cachedSize; i++) {
		var appt = this._cachedAppts.get(i);

		if (!appt || appt.ptst == ZmCalBaseItem.PSTATUS_DECLINED) {
			toRemove.push(appt);
		} else if (appt.isAlarmInRange()) {
			var uid = appt.getUniqueId(true);
			var state = this._apptState[uid];
			var addToActiveList = false;
			if (state == ZmReminderController._STATE_DISMISSED) {
				// just remove themn
			} else if (state == ZmReminderController._STATE_ACTIVE) {
				addToActiveList = true;
			} else {
				// we need to notify on this one
				numNotify++;
				addToActiveList = true;
				this._apptState[uid] = ZmReminderController._STATE_ACTIVE;
			}

			if (addToActiveList) {
				toRemove.push(appt);
				if (!appCtxt.get(ZmSetting.CAL_SHOW_PAST_DUE_REMINDERS) && appt.isAlarmOld()) {
					numNotify--;
					this._oldAppts.add(appt);
				} else {
					this._activeAppts.add(appt);
				}
			}
		}
	}

	// remove any appts in cachedAppts that are no longer supposed to be in there	
	// need to do this here so we don't screw up iteration above
	for (var i = 0; i < toRemove.length; i++) {
		this._cachedAppts.remove(toRemove[i]);
	}

	// if we have any to notify on, do it
	if (numNotify || rd.isPoppedUp()) {
		if (this._activeAppts.size() == 0 && rd.isPoppedUp()) {
            AjxDebug.println(AjxDebug.REMINDER, "popping down reminder dialog");
            rd.popdown();
		} else {
            AjxDebug.println(AjxDebug.REMINDER, "initializing reminder dialog");
			rd.initialize(this._activeAppts);
			if (!rd.isPoppedUp()) rd.popup();
		}
	}

    AjxDebug.println(AjxDebug.REMINDER, "no of appts active:" + this._activeAppts.size() + ", no of appts cached:" + cachedSize);

	if (this._oldAppts.size() > 0) {
		this.dismissAppt(this._oldAppts, new AjxCallback(this, this._silentDismissCallback));
	}

	// need to schedule housekeeping callback, ideally right before next _cachedAppt start time - lead,
	// for now just check once a minute...
	this._scheduleHouseKeepingAction();
};

ZmReminderController.prototype._silentDismissCallback =
function(list) {
	var size = list.size();
	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
		if (appt && appt.hasAlarmData()) {
			if(appt.isAlarmInRange()) {
				this._activeAppts.add(appt);
			}
		}
	}
	this._oldAppts.removeAll();

	// cancel outstanding timed action and update now...
	this._cancelHousekeepingAction();
	this._housekeepingAction();
};

/**
 * Dismisses an appointment. This method is called when
 * an appointment (individually or as part of "dismiss all") is removed from reminders.
 * 
 * @param	{AjxVector|Array}	list	a list of {@link ZmAppt} objects
 * @param	{AjxCallback}		callback		a callback
 */
ZmReminderController.prototype.dismissAppt =
function(list, callback) {
	if (!(list instanceof AjxVector)) {
		list = AjxVector.fromArray((list instanceof Array)? list: [list]);
	}

	for (var i=0; i<list.size(); i++) {
		var appt = list.get(i);
		this._apptState[appt.getUniqueId(true)] = ZmReminderController._STATE_DISMISSED;
		this._activeAppts.remove(appt);
	}

	this.dismissApptRequest(list, callback);
};

/**
 * Snoozes the appointments.
 * 
 * @param	{AjxVector}	appts	a list of {@link ZmAppt} objects
 * @return	{Array}	an array of snoozed apt ids
 */
ZmReminderController.prototype.snoozeAppt =
function(appts) {
	appts = AjxUtil.toArray(appts);

	var snoozedIds = [];
	var appt;
	var uid;
	for (var i = 0; i < appts.length; i++) {
		appt = appts[i];
		uid = appt.getUniqueId(true);
		this._apptState[uid] = ZmReminderController._STATE_SNOOZED;
		snoozedIds.push(uid);
		this._activeAppts.remove(appt);
		this._cachedAppts.add(appt);
	}
	return snoozedIds;
};

ZmReminderController.prototype.dismissApptRequest = 
function(list, callback) {


    //<DismissCalendarItemAlarmRequest>
    //    <appt|task id="cal item id" dismissedAt="time alarm was dismissed, in millis"/>+
    //</DismissCalendarItemAlarmRequest>
    var jsonObj = {DismissCalendarItemAlarmRequest:{_jsns:"urn:zimbraMail"}};
    var request = jsonObj.DismissCalendarItemAlarmRequest;

    var appts = [];
    var dismissedAt = (new Date()).getTime();
    for (var i = 0; i < list.size(); i++) {
        var appt = list.get(i);
        var apptInfo = { id: appt.id, dismissedAt: dismissedAt};
        appts.push(apptInfo)
    }
    request[this._apptType] = appts;

    var respCallback    = this._handleDismissAppt.bind(this, list, callback);
    var offlineCallback = this._handleOfflineReminderAction.bind(this,  jsonObj, list, true);
    var errorCallback   = this._handleErrorDismissAppt.bind(this, list, callback);
    var params =
        {jsonObj:         jsonObj,
         asyncMode:       true,
         callback:        respCallback,
         offlineCallback: offlineCallback,
         errorCallback:   errorCallback
        };
    appCtxt.getAppController().sendRequest(params);

	return true;
};

ZmReminderController.prototype.setAlarmData =
function (soapDoc, request, params) {
	var alarmData = soapDoc.set("alarmData", null, request);
	alarmData.setAttribute("");
};

ZmReminderController.prototype._handleDismissAppt =
function(list, callback, result) {
	if (result.isException()) { return; }

	var response = result.getResponse();
	var dismissResponse = response.DismissCalendarItemAlarmResponse;
	var appts = dismissResponse ? dismissResponse.appt : null;
	if (!appts) { return; }

    this._updateApptAlarmData(list, appts);

	if (callback) {
		callback.run(list);
	}
};

ZmReminderController.prototype._handleErrorDismissAppt =
function(list, callback, response) {
};


ZmReminderController.prototype._updateApptAlarmData =
function(apptList, responseAppts) {
    var updateData = {};
    for (var i = 0; i < responseAppts.length; i++) {
        var appt = responseAppts[i];
        if (appt && appt.calItemId) {
            updateData[appt.calItemId] = appt.alarmData ? appt.alarmData : {};
        }
    }

    var size = apptList.size();
    for (var i = 0; i < size; i++) {
        var appt = apptList.get(i);
        if (appt) {
            if (updateData[appt.id]) {
                appt.alarmData = (updateData[appt.id] != {}) ? updateData[appt.id] : null;
            }
        }
    }
};

/**
 * Gets the reminder dialog.
 * 
 * @return	{ZmReminderDialog}	the dialog
 */
ZmReminderController.prototype.getReminderDialog =
function() {
	if (this._reminderDialog == null) {
		this._reminderDialog = new ZmReminderDialog(appCtxt.getShell(), this, this._calController, this._apptType);
	}
	return this._reminderDialog;
};


ZmReminderController.prototype._snoozeApptAction =
function(apptArray, snoozeMinutes, beforeAppt) {

	var apptList = AjxVector.fromArray(apptArray);

    var chosenSnoozeMilliseconds = snoozeMinutes * 60 * 1000;
    var added = false;

    //     <SnoozeCalendarItemAlarmRequest xmlns="urn:zimbraMail">
    //        <appt id="573" until="1387833974851"/>
    //        <appt id="601" until="1387833974851"/>
    //    </SnoozeCalendarItemAlarmRequest>

    var jsonObj = {SnoozeCalendarItemAlarmRequest:{_jsns:"urn:zimbraMail"}};
    var request = jsonObj.SnoozeCalendarItemAlarmRequest;

    var appts = [];
    if (beforeAppt) {
        // Using a before time, relative to the start of each appointment
        if (!this._beforeProcessor) {
            this._beforeProcessor = new ZmSnoozeBeforeProcessor(this._apptType);
        }
        added = this._beforeProcessor.execute(apptList, chosenSnoozeMilliseconds, appts);
    } else {
        // using a fixed untilTime for all appts
        added = apptList.size() > 0;
        // untilTime determines next alarm time, based on the option user has chosen in snooze reminder pop up .
        var untilTime = (new Date()).getTime() + chosenSnoozeMilliseconds;
        for (var i = 0; i < apptList.size(); i++) {
            var appt = apptList.get(i);
            if (chosenSnoozeMilliseconds === 0) { // at time of event, making it to appt start time .
                untilTime = appt.getStartTime();
            }
            var apptInfo = { id: appt.id, until: untilTime};
            appts.push(apptInfo)
        }
    }
    request[this._apptType] = appts;

    var respCallback    = this._handleResponseSnoozeAction.bind(this, apptList, snoozeMinutes);
    var offlineCallback = this._handleOfflineReminderAction.bind(this,  jsonObj, apptList, false);
    var errorCallback   = this._handleErrorResponseSnoozeAction.bind(this);
    var ac = window.parentAppCtxt || window.appCtxt;
    ac.getRequestMgr().sendRequest(
        {jsonObj:         jsonObj,
         asyncMode:       true,
         callback:        respCallback,
         offlineCallback: offlineCallback,
         errorCallback:   errorCallback});

};


ZmReminderController.prototype._handleResponseSnoozeAction =
function(apptList, snoozeMinutes, result) {
    if (result.isException()) { return; }

	var response = result.getResponse();
	var snoozeResponse = response.SnoozeCalendarItemAlarmResponse;
	var appts = snoozeResponse ? snoozeResponse[this._apptType] : null;
	if (!appts) { return; }

    this._updateApptAlarmData(apptList, appts);

    if (snoozeMinutes == 1) {
	    // cancel outstanding timed action and update now...
		// I'm not sure why this is here but I suspect to prevent some race condition.
		this._cancelHousekeepingAction();
		//however calling _housekeepingAction immediately caused some other race condition issues. so I just schedule it again.
		this._scheduleHouseKeepingAction();
    }
};
ZmReminderController.prototype._handleErrorResponseSnoozeAction =
function(result) {
    //appCtxt.getAppController().popupErrorDialog(ZmMsg.reminderSnoozeError, result.msg, null, true);
};

ZmReminderController.prototype._handleOfflineReminderAction =
function(jsonObj, apptList, dismiss) {
    var jsonObjCopy = $.extend(true, {}, jsonObj);  //Always clone the object.  ?? Needed here ??
    var methodName = dismiss ? "DismissCalendarItemAlarmRequest" : "SnoozeCalendarItemAlarmRequest";
    jsonObjCopy.methodName = methodName;
    // Modify the id to thwart ZmOffline._handleResponseSendOfflineRequest, which sends a DELETE
    // notification for the id (which impacts here if there is a single id).
    jsonObjCopy.id = "C" + this._createSendRequestKey(apptList);

    var value = {
        update:          true,
        methodName:      methodName,
        id:              jsonObjCopy.id,
        value:           jsonObjCopy
    };

    var callback = this._handleOfflineReminderDBCallback.bind(this, jsonObjCopy, apptList, dismiss);
    ZmOfflineDB.setItemInRequestQueue(value, callback);
};

ZmReminderController.prototype._createSendRequestKey =
function(apptList) {
    var keyPart = [];
    var appt;
    for (var i = 0; i < apptList.size(); i++) {
        appt = apptList.get(i);
        if (appt) {
            keyPart.push(apptList.get(i).invId);
        }
    }
    return keyPart.join(":");
}

ZmReminderController.prototype._handleOfflineReminderDBCallback =
function(jsonObj, apptList, dismiss) {
    // Successfully stored the snooze request in the SendRequest queue, update the db items and flush the apptCache

    var request = jsonObj[jsonObj.methodName];
    var appts   = request[this._apptType];

    var callback;
    var appt;
    var apptCache = this._calController.getApptCache();
    for (var i = 0; i < apptList.size(); i++) {
        appt = apptList.get(i);
        if (appt) {
            // AWKWARD, but with indexedDB there's no way to specify a set of ids to read. So for the moment
            // (hopefully not too many appts triggered at once) - read one, modify, write it to the Calendar Obj store.
            // When done with each one, invoke a callback to update the reminder appt in memory.
            var apptInfo = appts[i];
            callback = this._updateOfflineAlarmCallback.bind(this, appt, dismiss, apptInfo.until);
            // Set up null data and replacement data for snooze.  apptInfo.until will be undefined for dismiss,
            // but we remove the alarm data for dismiss anyway
            var nullData = [];
            nullData.push({ nextAlarm: apptInfo.until});
            apptCache.updateOfflineAppt(appt.invId, "alarmData.0.nextAlarm", apptInfo.until, nullData, callback);
        }
    }
}

// Final step in the Reminder Snooze: update in memory.  I believe alarmData[0].nextAlarm is all that needs to
// be modified, try for now.   The online _updateApptAlarmData replaces the entire alarmData with the Snooze response,
// but all we have is the nextAlarm value.
ZmReminderController.prototype._updateOfflineAlarmCallback =
function(appt, dismiss, origValue, field, value) {
    if (dismiss) {
        appt.alarmData = null;
    } else {
        appt.alarmData[0].nextAlarm = origValue;
    }
}
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmReminderDialog")) {
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
* show history of the status window
* @param parent			the element that created this view
 * @private
*/
ZmReminderDialog = function(parent, reminderController, calController, apptType) {

	// init custom buttons
    this._apptType = apptType;

	this.ALL_APPTS = "ALL" + apptType;

	// call base class
	DwtDialog.call(this, {id:"ZmReminderDialog_" + apptType, parent:parent, standardButtons:DwtDialog.NO_BUTTONS});

	this._reminderController = reminderController;
	this._calController = calController;

	this._listId = Dwt.getNextId("ZmReminderDialogContent");

    this.setContent(this._contentHtml());
    if(this._calController instanceof ZmTaskMgr) {
        this.setTitle(ZmMsg.taskReminders);
    } else {
        this.setTitle(ZmMsg.apptReminders);
    }

    // we want all children in the tab order, so just reuse the
    // composite tab group
	this.getTabGroupMember().addMember(this._compositeTabGroup);
};

ZmReminderDialog.prototype = new DwtDialog;
ZmReminderDialog.prototype.constructor = ZmReminderDialog;
ZmReminderDialog.prototype.role = 'alertdialog';


// Consts

ZmReminderDialog.SOON = -AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES;

// Public methods

ZmReminderDialog.prototype.toString =
function() {
	return "ZmReminderDialog";
};

ZmReminderDialog.prototype.popup =
function() {
	DwtDialog.prototype.popup.call(this);
	this._cancelSnooze();

    if (appCtxt.get(ZmSetting.CAL_REMINDER_NOTIFY_BROWSER)) {
        AjxPackage.require("Alert");
        ZmBrowserAlert.getInstance().start(ZmMsg.reminders);
    }

    if (appCtxt.get(ZmSetting.CAL_REMINDER_NOTIFY_SOUNDS)) {
        AjxPackage.require("Alert");
        ZmSoundAlert.getInstance().start();
    }

    if (appCtxt.get(ZmSetting.CAL_REMINDER_NOTIFY_TOASTER)) {
        AjxPackage.require("Alert");
        var winText = [];
        var appts = this._list.getArray();
        // only show, at most, five appointment reminders
        for (var i = 0; i < appts.length && i < 5; i++) {
            var appt = appts[i];
            var startDelta = this._computeDelta(appt);
            var delta = startDelta ? ZmReminderDialog.formatDeltaString(startDelta, appt.isAllDayEvent()) : "";
            var text = [appt.getName(), ", ", this._getDurationText(appt), "\n(", delta, ")"].join("");
            if (AjxEnv.isMac) {
                ZmDesktopAlert.getInstance().start(ZmMsg.reminders, text, true);
            } else if (AjxEnv.isWindows) {
                winText.push(text);
            }
        }

        if (AjxEnv.isWindows && winText.length > 0) {
            if (appts.length > 5) {
                winText.push(ZmMsg.andMore);
            }
            ZmDesktopAlert.getInstance().start(ZmMsg.reminders, winText.join("\n"), true);
        }
    }

	this._snoozeSelectInputs[this.ALL_APPTS].focus();
};

ZmReminderDialog.prototype.initialize =
function(list) {
	this._list = new AjxVector();
	this._apptData = {};

	var html = [];
	var idx = 0;
	var size = list.size();

    AjxDebug.println(AjxDebug.REMINDER, "---Reminders [" + (new Date().getTime())+ "]---");

	html[idx++] = "<table role='presentation' style='min-width:375px'>";
	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
        if (appt.isShared() && appt.isReadOnly()) { continue; }
        this._list.add(appt);
		var uid = appt.getUniqueId(true);
		var data = this._apptData[uid] = {appt:appt};
		idx = this._addAppt(html, idx, appt, data);
	}
	html[idx++] = "</table>";

	this._addAllSection(html, idx);

	// cleanup before using
	this._cleanupButtons(this._dismissButtons);
	this._cleanupButtons(this._openButtons);
	this._cleanupButtons(this._snoozeButtons);
	this._cleanupButtons(this._snoozeSelectButtons);
	this._cleanupButtons(this._snoozeSelectInputs);
	this._dismissButtons = {};
	this._openButtons = {}; //those are link buttons  (the reminder name is now a link)
	this._snoozeButtons = {};
	this._snoozeSelectButtons = {};
	this._snoozeSelectInputs = {};

	var dismissListener = new AjxListener(this, this._dismissButtonListener);
	var openListener = new AjxListener(this, this._openButtonListener);
	var snoozeListener = this._snoozeButtonListener.bind(this);
	var snoozeSelectButtonListener = this._snoozeSelectButtonListener.bind(this);
	var snoozeSelectMenuListener = this._snoozeSelectMenuListener.bind(this);

	var div = document.getElementById(this._listId);
	div.innerHTML = html.join("");

	for (var i = 0; i < this._list.size(); i++) {
		var appt = this._list.get(i);
		var uid = appt.getUniqueId(true);
        var id = appt.id;
		var data = this._apptData[uid];

        var alarmData = appt.getAlarmData();
        alarmData = (alarmData && alarmData.length > 0) ? alarmData[0] : {};
        //bug: 60692 - Add troubleshooting code for late reminders
        AjxDebug.println(AjxDebug.REMINDER, appt.getReminderName() + " : " + (alarmData.nextAlarm || " NA ") + " / " + (alarmData.alarmInstStart || " NA "));

		this._createButtons(uid, id, dismissListener, openListener, snoozeListener, snoozeSelectButtonListener, snoozeSelectMenuListener);

		this._updateDelta(data);
	}

	this._createButtons(this.ALL_APPTS, this.ALL_APPTS, dismissListener, openListener, snoozeListener, snoozeSelectButtonListener, snoozeSelectMenuListener);

	this._updateIndividualSnoozeActionsVisibility();

	//hide the separator from the dialog buttons since we do not use dialog buttons for this dialog.
	document.getElementById(this._htmlElId + "_buttonsSep").style.display = "none";

};

ZmReminderDialog.prototype._createButtons =
function(uid, id, dismissListener, openListener, snoozeListener, snoozeSelectButtonListener, snoozeSelectMenuListener) {
	//id should probably not be used, and only uid should - but I'm afraid it would confuse seleniun. This was added for bug 62376

	var data = this._apptData[uid];
	var appt = data.appt;

	if (uid !== this.ALL_APPTS) {
		// open button
		var openBtn = this._openButtons[uid] = new DwtLinkButton({id: "openBtn_" + id, parent: this, parentElement: data.openLinkId, noDropDown: true});
		openBtn.setText(AjxStringUtil.htmlEncode(appt.getReminderName()));
		openBtn.addSelectionListener(openListener);
		openBtn.setAttribute('aria-labelledby', [
			openBtn._textEl.id, data.reminderDescContainerId, data.deltaId
		].join(' '));
		openBtn.apptUid = uid;
		this.getTabGroupMember().addMember(openBtn);
	}

	var className = uid === this.ALL_APPTS ? "ZButton" : "DwtToolbarButton";

	// snooze input field
	var params = {
		parent: this,
		parentElement: data.snoozeSelectInputId,
		type: DwtInputField.STRING,
		errorIconStyle: DwtInputField.ERROR_ICON_NONE,
		validationStyle: DwtInputField.CONTINUAL_VALIDATION,
		className: "DwtInputField ReminderInput"
	};
	var snoozeSelectInput = this._snoozeSelectInputs[uid] = new DwtInputField(params);
	var snoozeSelectInputEl = snoozeSelectInput.getInputElement();
	Dwt.setSize(snoozeSelectInputEl, "120px", "2rem");
	snoozeSelectInputEl.setAttribute('aria-labelledby',
	                                 data.snoozeAllLabelId || '');

	// snoooze button
	var snoozeSelectBtn = this._snoozeSelectButtons[uid] = new DwtButton({id: "snoozeSelectBtn_" + id, parent: this, className: "DwtToolbarButton", parentElement: data.snoozeSelectBtnId});
	snoozeSelectBtn.apptUid = uid;
	snoozeSelectBtn.addDropDownSelectionListener(snoozeSelectButtonListener);

    var snoozeBtn = this._snoozeButtons[uid] = new DwtButton({id: "snoozeBtn_" + id, parent: this, className: className, parentElement: data.snoozeBtnId});
	snoozeBtn.setText(ZmMsg.snooze);
	snoozeBtn.addSelectionListener(snoozeListener);
	snoozeBtn.apptUid = uid;

	// dismiss button
	var dismissBtn = this._dismissButtons[uid] = new DwtButton({id: "dismissBtn_" + id, parent: this, className: className, parentElement: data.dismissBtnId});
	dismissBtn.setText(ZmMsg.dismiss);
	dismissBtn.addSelectionListener(dismissListener);
	dismissBtn.apptUid = uid;

	this._createSnoozeMenu(snoozeSelectBtn, snoozeSelectInput, snoozeSelectMenuListener, uid === this.ALL_APPTS ? this._list : appt);
};

ZmReminderDialog.prototype._cleanupButtons =
function(buttons) {
	if (!buttons) {
		return;
	}
	for (var id in buttons) {
		buttons[id].dispose();
	}
};

ZmReminderDialog.prototype._contentHtml =
function() {
    return ["<div class='ZmReminderDialog' id='", this._listId, "'>"].join("");
};


ZmReminderDialog.DEFAULT_SNOOZE = -5;
ZmReminderDialog.SNOOZE_MINUTES =
// Snooze period in minutes (negative is 'minutes before appt', zero is 'At time of event', 'separator' is for seperator icon.
    [-30, -15, -5, -1, 0, 'seperator',
       1, 5, 10, 15, 30, 45, 60, 120, 240, 480,  1440, 2880,  4320,   5760, 10080, 20160];
//                          1hr  2hr  4hr  8hr  1day  2days  3days  4days  1week  2weeks

// Snooze period in msec (Entries must match SNOOZE_MINUTES)
ZmReminderDialog.SNOOZE_MSEC =
    [  -30*60*1000,   -15*60*1000,  -5*60*1000,    -1*60*1000,            0,
         1*60*1000,     5*60*1000,  10*60*1000,    15*60*1000,   30*60*1000,    45*60*1000,   60*60*1000,
       120*60*1000,   240*60*1000, 480*60*1000,  1440*60*1000, 2880*60*1000,  4320*60*1000, 5760*60*1000,
     10080*60*1000, 20160*60*1000];

// Minutes per:                   minute hour  day   week   endMarker
ZmReminderDialog.SCALE_MINUTES = [   1,   60, 1440, 10080,   1000000];

ZmReminderDialog.prototype._createSnoozeMenu =
function(snoozeSelectButton, snoozeSelectInput, menuSelectionListener, apptList) {
    // create menu for button
    var snoozeMenu = new DwtMenu({parent:snoozeSelectButton, style:DwtMenu.DROPDOWN_STYLE});
    snoozeMenu.setSize("150");
    snoozeSelectButton.setMenu(snoozeMenu, true);

	var appts = AjxUtil.toArray(apptList);

    var maxStartDelta = -Infinity; //It was called minStartDelta which was true if you think of the absolute value (as it is negative). But it's actually max.

    if (this._apptType == "task") {
        // Tasks are simpler: No 'before' times allowed, and all fixed times are allowed
        maxStartDelta = 0;
	}
	else {
        for (var i = 0; i < appts.length; i++) {
            var appt = appts[i];
            var startDelta = this._computeDelta(appt);
			maxStartDelta = Math.max(startDelta, maxStartDelta);
        }
		//if maxStartDelta is >= 0, there was at least one appt that is already started, in which case for the aggregate "snooze" we do not show any "before" item
		maxStartDelta = Math.min(maxStartDelta, 0); //don't get positive - we don't care about that later in the loop below. We want max to be 0.
    }

    var snoozeFormatter = [];
    var snoozeFormatterBefore = new AjxMessageFormat(ZmMsg.apptRemindNMinutesBefore); // Before Appt Formatter
    snoozeFormatter[0] = new AjxMessageFormat(ZmMsg.reminderSnoozeMinutes);       // Minute Formatter
    snoozeFormatter[1] = new AjxMessageFormat(ZmMsg.reminderSnoozeHours);         // Hour   Formatter
    snoozeFormatter[2] = new AjxMessageFormat(ZmMsg.reminderSnoozeDays);          // Day    Formatter
    snoozeFormatter[3] = new AjxMessageFormat(ZmMsg.reminderSnoozeWeeks);         // Week   Formatter
    var iFormatter = 0;
    var formatter = null;
    var snoozeDisplayValue = -1;
    var scale = 1;
    var defaultSet = false;
    var firstMenuItem = null;
    var addSeparator = false;
    var anyAdded = false;
    for (var i = 0; i < ZmReminderDialog.SNOOZE_MINUTES.length; i++) {
        if (ZmReminderDialog.SNOOZE_MSEC[i] > maxStartDelta) { // only those values will come in snooze reminder, which are valid i.e avoid 'before minutes' in menu , when appointment has started . Donot include 0, when the event has started, value of maxStartDelta is 0,(see min) and we donot want 0 i.e 'at time of event' to be included in the menu , when the event has started .
            // Found a snooze period to display
            snoozeDisplayValue = ZmReminderDialog.SNOOZE_MINUTES[i];
            if (snoozeDisplayValue == 'seperator') {
                // Set up to add a separator if any 'before' time were added; do the
                // actual add if any fixed times are added
                 addSeparator = anyAdded;
            }
            else {
                if (addSeparator) {
                    new DwtMenuItem({parent:snoozeMenu, style:DwtMenuItem.SEPARATOR_STYLE});
                    addSeparator = false;
                }
                anyAdded = true;
                if (snoozeDisplayValue < 0) {
                    snoozeDisplayValue = -snoozeDisplayValue;
                    formatter = snoozeFormatterBefore;
                    scale = 1;

				}
                else if (snoozeDisplayValue == 0){
                    label = ZmMsg.apptRemindAtEventTime;
                }
				else {
                    if (snoozeDisplayValue >= ZmReminderDialog.SCALE_MINUTES[iFormatter+1]) {
                        iFormatter++;
                    }
                    scale = ZmReminderDialog.SCALE_MINUTES[iFormatter];
                    formatter = snoozeFormatter[iFormatter];
                }
                if (snoozeDisplayValue != 0) {
                    var label = formatter.format(snoozeDisplayValue / scale);
                }
                var mi = new DwtMenuItem({parent: snoozeMenu, style: DwtMenuItem.NO_STYLE});
                mi.setText(label);
                mi.setData("value", snoozeDisplayValue);
                if(menuSelectionListener) mi.addSelectionListener(menuSelectionListener);

                if (!firstMenuItem) {
                    // Set the first item as the default
                    firstMenuItem = mi;
                    mi.setChecked(true);
                    snoozeSelectInput.setValue(label);
                    defaultSet = true;
                }
            }
        }
    }

};

ZmReminderDialog.prototype._snoozeSelectButtonListener =
function(ev) {
	ev.item.popup();
};

ZmReminderDialog.prototype._snoozeSelectMenuListener =
function(ev) {
	if (!ev.item || !(ev.item instanceof DwtMenuItem)) {
		return;
	}

	var obj = DwtControl.getTargetControl(ev);
	obj = obj.parent.parent; //get the button - the parent of the menu which is the parent of the menu item which is this target control.
	var uid = obj.apptUid;
	var data = this._apptData[uid];
	if (!data) {
		return;
	}
	this._snoozeSelectInputs[uid].setValue(ev.item.getText());
//  this._snoozeValue = ev.item.getData("value");
};

ZmReminderDialog.prototype._updateDelta =
function(data) {
	var td = document.getElementById(data.deltaId);
	if (td) {
		var startDelta = this._computeDelta(data.appt);

		td.className = startDelta >= 0 ? "ZmReminderOverdue"
						: startDelta > ZmReminderDialog.SOON ? "ZmReminderSoon"
						: "ZmReminderFuture";

		td.innerHTML = startDelta ? ZmReminderDialog.formatDeltaString(startDelta, data.appt.isAllDayEvent()) : "";
	}
};

/**
 * display the individual actions (snooze, dismiss) only if there's more than one reminder.
 * @private
 */
ZmReminderDialog.prototype._updateIndividualSnoozeActionsVisibility =
function() {
	var appts = this._list.getArray();
	if (appts.length === 0) {
		return; //all snoozed or dismissed, nothing to do here)
	}
	var multiple = appts.length > 1;
	for (var i = 0; i < appts.length; i++) {
		var appt = appts[i];
		var uid = appt.getUniqueId(true);
		var data = this._apptData[uid];
		var actionsRow = document.getElementById(data.actionsRowId);
		actionsRow.style.display = multiple ? "block" : "none";
	}

	//update the all text
	var dismissAllBtn = this._dismissButtons[this.ALL_APPTS];
	dismissAllBtn.setText(multiple ? ZmMsg.dismissAll : ZmMsg.dismiss);
	var snoozeAllBtn = this._snoozeButtons[this.ALL_APPTS];
	snoozeAllBtn.setText(multiple ? ZmMsg.snoozeAllLabel : ZmMsg.snooze);

	var snoozeAllLabelId = this._apptData[this.ALL_APPTS].snoozeAllLabelId;
	var allLabelSpan = document.getElementById(snoozeAllLabelId);
	allLabelSpan.innerHTML = multiple ? ZmMsg.snoozeAll : ZmMsg.snoozeFor;
};


ZmReminderDialog.prototype._addAppt =
function(html, idx, appt, data) {

	var uid = appt.id;
	this._addData(data, uid);

	var calName = (appt.folderId != ZmOrganizer.ID_CALENDAR && appt.folderId != ZmOrganizer.ID_TASKS && this._calController)
		? this._calController.getCalendarName(appt.folderId) : null;


	var calendar = appCtxt.getById(appt.folderId);

	var params = {
		rowId: data.rowId,
		calName: AjxStringUtil.htmlEncode(calName),
		accountName: (appCtxt.multiAccounts && calendar && calendar.getAccount().getDisplayName()),
		location: (AjxStringUtil.htmlEncode(appt.getReminderLocation())),
		apptIconHtml: (AjxImg.getImageHtml(appt.otherAttendees ? "ApptMeeting" : "Appointment")),
		organizer: appt.otherAtt ? appt.organizer : null,
		reminderName: (AjxStringUtil.htmlEncode(appt.getReminderName())),
		durationText: (AjxStringUtil.trim(this._getDurationText(appt))),
		deltaId: data.deltaId,
		openLinkId: data.openLinkId,
		dismissBtnId: data.dismissBtnId,
		snoozeSelectInputId: data.snoozeSelectInputId,
		snoozeSelectBtnId: data.snoozeSelectBtnId,
		snoozeBtnId: data.snoozeBtnId,
		actionsRowId: data.actionsRowId,
        reminderNameContainerId: data.reminderNameContainerId,
        reminderDescContainerId: data.reminderDescContainerId,
        type: appt.type ? appt.type : ZmItem.APPT
	};
	html[idx++] = AjxTemplate.expand("calendar.Calendar#ReminderDialogRow", params);
	return idx;
};

ZmReminderDialog.prototype._addAllSection =
function(html, idx) {

	var uid = this.ALL_APPTS;

	var data = this._apptData[uid] = {};
	this._addData(data, uid);
	data.snoozeAllLabelId = "snoozeAllLabelContainerId_" + uid;

	var params = {
		rowId: data.rowId,
		dismissBtnId: data.dismissBtnId,
		snoozeSelectInputId: data.snoozeSelectInputId,
		snoozeSelectBtnId: data.snoozeSelectBtnId,
		snoozeBtnId: data.snoozeBtnId,
		snoozeAllLabelId: data.snoozeAllLabelId
	};
	html[idx++] = AjxTemplate.expand("calendar.Calendar#ReminderDialogAllSection", params);
	return idx;
};

ZmReminderDialog.prototype._addData =
function(data, uid) {
	data.dismissBtnId = "dismissBtnContainer_" + uid;
	data.snoozeSelectInputId = "snoozeSelectInputContainer_" + uid;
	data.snoozeSelectBtnId = "snoozeSelectBtnContainer_" + uid;
	data.snoozeBtnId = "snoozeBtnContainer_" + uid;
	data.openLinkId = "openLinkContainer_" + uid;
	data.actionsRowId = "actionsRowContainer_" + uid;
	data.deltaId = "delta_" + uid;
	data.rowId = "apptRow_" + uid;
	data.reminderNameContainerId = "reminderNameContainerId_" + uid;
	data.reminderDescContainerId = "reminderDescContainerId_" + uid;
};

ZmReminderDialog.prototype._openButtonListener =
function(ev) {

    appCtxt.getAppController().setStatusMsg(ZmMsg.allRemindersAreSnoozed, ZmStatusView.LEVEL_INFO);

	var obj = DwtControl.getTargetControl(ev);
	var data = this._apptData[obj.apptUid];

	this._snoozeButtonListener(null, true); //do it after getting the obj and data since snoozing gets rid of the elements.

	var appt = data ? data.appt : null;
    var type = appt.type ? appt.type : ZmItem.APPT;
	if (appt && type == ZmItem.APPT) {
		AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);

		var cc = AjxDispatcher.run("GetCalController");

		// the give appt object is a ZmCalBaseItem. We need a ZmAppt
		var newAppt = new ZmAppt();
		for (var i in appt) {
			if (!AjxUtil.isFunction(appt[i])) {
				newAppt[i] = appt[i];
			}
		}
        var mode = newAppt.isRecurring() ? ZmCalItem.MODE_EDIT_SINGLE_INSTANCE : null;
		var callback = new AjxCallback(cc, cc._showAppointmentDetails, newAppt);
		newAppt.getDetails(mode, callback, null, null, true);
	} else if(appt && type == ZmItem.TASK) {
        AjxDispatcher.require(["TasksCore", "Tasks"]);

		var tlc = AjxDispatcher.run("GetTaskListController");

		// the give appt object is a ZmCalBaseItem. We need a ZmAppt
		var newTask = new ZmTask();
		for (var i in appt) {
			if (!AjxUtil.isFunction(appt[i])) {
				newTask[i] = appt[i];
			}
		}
		var callback = new AjxCallback(tlc, tlc._editTask, newTask);
		newTask.getDetails(null, callback, null, null, true);
    }
};

ZmReminderDialog.prototype._dismissButtonListener =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	var uid = obj.apptUid;
	var data = this._apptData[uid];
	if (!data) { return; }
	var appts;
	if (uid === this.ALL_APPTS) {
		appts = this._getApptsClone();
	}
	else {
		appts = data.appt; //note - this could be all the appts this._list
	}

	this._reminderController.dismissAppt(appts);

	this._removeAppts(appts);
};

ZmReminderDialog.prototype._cleanupButton =
function(buttons, uid) {
	var button = buttons[uid];
	if (!button) {
		return;
	}
	button.dispose();
	delete buttons[uid];
};

ZmReminderDialog.prototype._removeAppts =
function(appts) {
	appts = AjxUtil.toArray(appts);
	for (i = 0; i < appts.length; i++) {
		this._removeAppt(appts[i]);
	}
	this._updateIndividualSnoozeActionsVisibility();

};

ZmReminderDialog.prototype._removeAppt =
function(appt) {
	var uid = appt.getUniqueId(true);
	var data = this._apptData[uid];

	// cleanup HTML
	this._cleanupButton(this._dismissButtons, uid);
	this._cleanupButton(this._openButtons, uid);
	this._cleanupButton(this._snoozeButtons, uid);
	this._cleanupButton(this._snoozeSelectButtons, uid);
	this._cleanupButton(this._snoozeSelectInputs, uid);

	var row = document.getElementById(data.rowId);
	if (row) {
		var nextRow = row.nextSibling;
		if (nextRow && nextRow.getAttribute("name") === "rdsep") {
			nextRow.parentNode.removeChild(nextRow);
		}
		row.parentNode.removeChild(row);
	}

	delete this._apptData[uid];
	this._list.remove(appt);

	if (this._list.size() === 0) {
		this._cleanupButton(this._dismissButtons, this.ALL_APPTS);
		this._cleanupButton(this._snoozeButtons, this.ALL_APPTS);
		this._cleanupButton(this._snoozeSelectButtons, this.ALL_APPTS);
		this._cleanupButton(this._snoozeSelectInputs, this.ALL_APPTS);
		this.popdown();
	}
};


ZmReminderDialog.prototype._getApptsClone =
function() {
	//make a shallow copy of this_list.getArray(),  so that stuff can work while or after removing things from the _list. This is a must.
	return this._list.getArray().slice(0);
};

ZmReminderDialog.prototype._snoozeButtonListener =
function(ev, all) {

	var data;
	var uid;
	var appts;
	if (all) { //all is true in the case of "open" where we snooze everything artificially
		uid = this.ALL_APPTS;
		appts = this._getApptsClone();
	}
	else {
		var obj = DwtControl.getTargetControl(ev);
		uid = obj.apptUid;
		if (uid === this.ALL_APPTS) {
			appts = this._getApptsClone();
		}
		else {
			data = this._apptData[uid];
			appts = AjxUtil.toArray(data.appt);
		}
	}

	var snoozeString = this._snoozeSelectInputs[uid].getValue();

    // check if all fields are populated w/ valid values
    var errorMsg = [];
    var snoozeInfo = null;
    var beforeAppt = false;
    if (!snoozeString) {
         errorMsg.push(ZmMsg.reminderSnoozeClickNoDuration);
    }
	else {
        snoozeInfo = ZmCalendarApp.parseReminderString(snoozeString);
        if (snoozeInfo.reminderValue === "" ) {
            // Returned when no number was specified in the snooze input field
            errorMsg.push(ZmMsg.reminderSnoozeClickNoNumber);
        }  else {
            // Test if the unit is a known one (default behaviour for parseReminderString
            // returns unknowns as hours)
            var valid = this._testSnoozeString(snoozeString);
            if (!valid) {
                 errorMsg.push(ZmMsg.reminderSnoozeClickUnknownUnit);
            } else {
                // Detect 'before'
                //Fix for Bug: 80651 - Check for snooze before object
                beforeAppt = snoozeInfo.before;
            }
        }
    }
    if (errorMsg.length > 0) {
        var msg = errorMsg.join("<br>");
        var dialog = appCtxt.getMsgDialog();
        dialog.reset();
        dialog.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
        dialog.popup();
		return;
    }

	var snoozeMinutes = ZmCalendarApp.convertReminderUnits(snoozeInfo.reminderValue, snoozeInfo.reminderUnits);
	this._reminderController.snoozeAppt(appts);
	this._reminderController._snoozeApptAction(appts, snoozeMinutes, beforeAppt);

	this._removeAppts(appts, true);

};



/**
 * Parses the given string to insure the units are recognized
 * @param snoozeString snooze string eg. "10 minutes"
 *
 * @private
 */
ZmReminderDialog.prototype._testSnoozeString =
function(snoozeString) {
    var snoozeUnitStrings = [];
    snoozeUnitStrings[0] = AjxMsg.minute;
    snoozeUnitStrings[1] = AjxMsg.hour;
    snoozeUnitStrings[2] = AjxMsg.day;
    snoozeUnitStrings[3] = AjxMsg.week;
    // Plural
    snoozeUnitStrings[4] = AjxMsg.minutes;
    snoozeUnitStrings[5] = AjxMsg.hours;
    snoozeUnitStrings[6] = AjxMsg.days;
    snoozeUnitStrings[7] = AjxMsg.weeks;
    snoozeUnitStrings[8] = AjxMsg.atEventTime;

    snoozeString = snoozeString.toLowerCase();
    var found = false;
    for (var i = 0; i < snoozeUnitStrings.length; i++) {
        if (snoozeString.indexOf(snoozeUnitStrings[i].toLowerCase()) >= 0) {
            found = true;
            break;
        }
    }
	return found;
};



ZmReminderDialog.prototype._cancelSnooze =
function() {
	if (this._snoozeActionId) {
		AjxTimedAction.cancelAction(this._snoozeActionId);
		delete this._snoozeActionId;
	}
};

ZmReminderDialog.prototype._getDurationText =
function(appt) {
	var isMultiDay = appt.isMultiDay();
	var start = appt._alarmInstStart ? new Date(appt._alarmInstStart) : appt.startDate ? appt.startDate : null;
	// bug: 28598 - alarm for recurring appt might still point to old alarm time
	// cannot take endTime directly
	var endTime = appt._alarmInstStart ? (start.getTime() + appt.getDuration()) : appt.getEndTime();
	var end = new Date(endTime);

    //for task
    if(appt.type == ZmItem.TASK && !start && !endTime) { return null; }

	if (appt.isAllDayEvent()) {
		end = appt.type != ZmItem.TASK ? new Date(endTime - (isMultiDay ? 2 * AjxDateUtil.MSEC_PER_HOUR : 0)) : end;
		var pattern = isMultiDay ? ZmMsg.apptTimeAllDayMulti : ZmMsg.apptTimeAllDay;
		return start ? AjxMessageFormat.format(pattern, [start, end]) : AjxMessageFormat.format(pattern, [end]); //for task
	}
	var pattern = isMultiDay ? ZmMsg.apptTimeInstanceMulti : ZmMsg.apptTimeInstance;
	return AjxMessageFormat.format(pattern, [start, end, ""]);
};

ZmReminderDialog.prototype._computeDelta =
function(appt) {
    var deltaTime = null;

    // Split out task processing - the deltaTime is used to split the tasks into sections (Past Due, Upcoming, No
    // Due Date), and a task is only overdue when it is later than its end time.  AlarmData is the
    // next reminder trigger time, and is inappropriate to use for sorting the tasks.
    var now = (new Date()).getTime();
    if (appt.type === ZmItem.TASK) {
        if (appt.getEndTime()) {
            deltaTime = now - appt.getEndTime();
        }
    } else {
        // Calendar Appt

        //I refactored the big nested ternary operator (?:) to make it more readable and try to understand what's the logic here.
        // After doing so, this doesn't make sense to me. But I have no idea if it should be this way on purpose, and that is the way it was with the ?:
        // Basically if there is NO alarmData it uses the appt startTime, which makes sense. But if there IS alarmData but no alarmInstStart it uses the endTime? WHY? What about the startTime?
        // I don't get it. Seems wrong.
        if (!appt.alarmData || appt.alarmData.length === 0) {
            deltaTime = now - appt.getStartTime();
        } else {
            var alarmInstStart = appt.alarmData[0].alarmInstStart; //returned from the server in case i'm wondering
            if (alarmInstStart) {
                deltaTime = now - appt.adjustMS(alarmInstStart, appt.tzo);
            } else if (appt.getEndTime()) {
                deltaTime = now - appt.getEndTime();
            }
        }
    }
	return deltaTime;
};

ZmReminderDialog.formatDeltaString = function(deltaMSec, isAllDay) {
    if (deltaMSec > 0 && deltaMSec < 60000) { // less than 1 minute i.e 60 seconds
        return ZmMsg.reminderNow;
    }
	var prefix = deltaMSec < 0 ? "In" : "OverdueBy";
	deltaMSec = Math.abs(deltaMSec);

	// calculate parts
    var years  = 0;
    var months = 0;
    var days   = 0;
    var hours  = 0;
    var mins   = 0;
    var secs   = 0;

	years =  Math.floor(deltaMSec / (AjxDateUtil.MSEC_PER_DAY * 365));
	if (years !== 0) {
		deltaMSec -= years * AjxDateUtil.MSEC_PER_DAY * 365;
    }
	months = Math.floor(deltaMSec / (AjxDateUtil.MSEC_PER_DAY * 30.42));
	if (months > 0) {
		deltaMSec -= Math.floor(months * AjxDateUtil.MSEC_PER_DAY * 30.42);
    }
	days = Math.floor(deltaMSec / AjxDateUtil.MSEC_PER_DAY);
	if (days > 0) {
		deltaMSec -= days * AjxDateUtil.MSEC_PER_DAY;
    }
    hours = Math.floor(deltaMSec / AjxDateUtil.MSEC_PER_HOUR);
    if (hours > 0) {
        deltaMSec -= hours * AjxDateUtil.MSEC_PER_HOUR;
    }
    mins = Math.floor(deltaMSec / 60000);
    if (mins > 0) {
        deltaMSec -= mins * 60000;
    }
    secs = Math.floor(deltaMSec / 1000);
    if (secs > 30 && mins < 59) {
        mins++;
    }
	secs = 0;

	// determine message
	var amount;
	if (years > 0) {
		amount = "Years";
		if (years <= 3 && months > 0) {
			amount = "YearsMonths";
		}
	}
	else if (months > 0) {
		amount = "Months";
		if (months <= 3 && days > 0) {
			amount = "MonthsDays";
		}
	}
	else if (days > 0) {
		amount = "Days";
		if (!isAllDay && (days <= 2 && hours > 0)) {
            // Only include hours if not an all day appt/task
			amount = "DaysHours";
		}
	}
	else {
        if (isAllDay) {
            // 'Overdue' from start of day, which really means due today
            amount ="Today";
        }  else {
            if (hours > 0) {
                amount = "Hours";
                if (hours < 5 && mins > 0) {
                    amount = "HoursMinutes";
                }
            } else {
                amount = "Minutes";
            }
        }
    }

	// format message
	var key = ["reminder", prefix, amount].join("");
	var args = [deltaMSec, years, months, days, hours, mins, secs];
    if (amount == "Minutes" && mins == 0) { // In 0 minutes
        return ZmMsg.reminderNow;
    }
	return AjxMessageFormat.format(ZmMsg[key], args);
};


//Bug 65466: Method overridden to remove the ESC button behavior

ZmReminderDialog.prototype.handleKeyAction =
function(actionCode, ev) {
	switch (actionCode) {

		case DwtKeyMap.ENTER:
			this.notifyListeners(DwtEvent.ENTER, ev);
			break;

		case DwtKeyMap.CANCEL:
			// Dont do anything
			break;

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
}
if (AjxPackage.define("zimbraMail.calendar.view.ZmQuickReminderDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
* show history of the status window
* @param parent			the element that created this view
 * @private
*/
ZmQuickReminderDialog = function(parent, reminderController, calController) {

	// init custom buttons
	var selectId = Dwt.getNextId();
	// call base class
	DwtDialog.call(this, {parent:parent, standardButtons: [DwtDialog.OK_BUTTON]});

	this._reminderController = reminderController;
	this._calController = calController;

	this.setContent(this._contentHtml(selectId));
	this.setTitle(ZmMsg.currentMeetings);
};

ZmQuickReminderDialog.prototype = new DwtDialog;
ZmQuickReminderDialog.prototype.constructor = ZmQuickReminderDialog;


ZmQuickReminderDialog.SOON = -AjxDateUtil.MSEC_PER_FIFTEEN_MINUTES;


// Public methods

ZmQuickReminderDialog.prototype.toString = 
function() {
	return "ZmQuickReminderDialog";
};

ZmQuickReminderDialog.prototype.popup =
function() {
	DwtDialog.prototype.popup.call(this);
};

ZmQuickReminderDialog.prototype.initialize =
function(list) {
	this._list = list.clone();
	this._apptData = {};

	var html = [];
	var idx = 0;
	var size = list.size();

	html[idx++] = "<table role='presentation' cellpadding=0 cellspacing=0 border=0 width=100%>";
	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
		var uid = appt.getUniqueId(true);
		var data = this._apptData[uid] = {appt:appt};
		idx = this._addAppt(html, idx, appt, data, (i === size - 1));
	}
    if(size == 0) {
        html[idx++] = '<tr name="rdsep">';
		html[idx++] = '<td colspan=3><div>' + ZmMsg.noMeetingsFound + '</div></td>';
		html[idx++] = '</tr>';
    }
	html[idx++] = "</table>";

	
	if (this._openButtons) {
		for (var id in this._openButtons) {
			this._openButtons[id].dispose();
		}
	}
	this._openButtons = {};

	var openListener = new AjxListener(this, this._openButtonListener);
	var div = document.getElementById(this._listId);
	div.innerHTML = html.join("");

	for (var i = 0; i < size; i++) {
		var appt = list.get(i);
		var uid = appt.getUniqueId(true);
		var data = this._apptData[uid];

		// open button
		var openBtn = this._openButtons[data.openBtnId] = new DwtLinkButton({id: "openBtn_" + id, parent: this, parentElement: data.openLinkId, noDropDown: true});
		openBtn.setText(appt.getName());
		openBtn.addSelectionListener(openListener);
		openBtn.apptUid = uid;

		this._updateDelta(data);
	}
};

ZmQuickReminderDialog.prototype._contentHtml =
function(selectId) {
	this._listId = Dwt.getNextId();
	return ["<div class='ZmQuickReminderDialog' id='", this._listId, "'>"].join("");
};

ZmQuickReminderDialog.prototype._updateDelta = 
function(data) {
	var td = document.getElementById(data.deltaId);
	if (td) {
		var startDelta = this._computeDelta(data.appt);

		if (startDelta >= 0) 							td.className = 'ZmReminderOverdue';
		else if (startDelta > ZmQuickReminderDialog.SOON)	td.className = 'ZmReminderSoon';
		else											td.className = 'ZmReminderFuture';

		td.innerHTML = ZmReminderDialog.formatDeltaString(startDelta);
	}
};

ZmQuickReminderDialog.prototype._addAppt =
function(html, idx, appt, data, noSep) {

	data.openLinkId = Dwt.getNextId();
	data.deltaId = Dwt.getNextId();
	data.rowId = Dwt.getNextId();

	var calName = (appt.folderId != ZmOrganizer.ID_CALENDAR && this._calController)
		? this._calController.getCalendarName(appt.folderId) : null;

	var calendar = appCtxt.getById(appt.folderId);

    var apptLabel = appt.isUpcomingEvent ? " (" + ZmMsg.upcoming + ")" : ""

	var params = {
		noSep: noSep,
		rowId: data.rowId,
		calName: calName,
		accountName: (appCtxt.multiAccounts && calendar && calendar.getAccount().getDisplayName()),
		location: appt.getLocation(),
		apptIconHtml: (AjxImg.getImageHtml(appt.otherAttendees ? "ApptMeeting" : "Appointment")),
		organizer: appt.otherAtt ? appt.organizer : null,
		reminderName: (AjxStringUtil.htmlEncode(appt.name + apptLabel)),
		durationText: (AjxStringUtil.trim(this._getDurationText(appt))),
		deltaId: data.deltaId,
		openLinkId: data.openLinkId
	};
	html[idx++] = AjxTemplate.expand("calendar.Calendar#ReminderDialogRow", params);
	return idx;
};

ZmQuickReminderDialog.prototype._openButtonListener =
function(ev) {

	var obj = DwtControl.getTargetControl(ev);
	var data = this._apptData[obj.apptUid];
	var appt = data ? data.appt : null;
	if (appt) {
		AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);

		var cc = AjxDispatcher.run("GetCalController");

		// the give appt object is a ZmCalBaseItem. We need a ZmAppt
		var newAppt = new ZmAppt();
		for (var i in appt) {
			if (!AjxUtil.isFunction(appt[i])) {
				newAppt[i] = appt[i];
			}
		}
		var callback = new AjxCallback(cc, cc._showAppointmentDetails, newAppt);
		newAppt.getDetails(null, callback, null, null, true);
        this.popdown();
	}
};

ZmQuickReminderDialog.prototype._getDurationText =
function(appt) {
	var isMultiDay = appt.isMultiDay();
	var start = appt.startDate;
	var endTime = appt.getEndTime();
	var end = new Date(endTime);

	if (appt.isAllDayEvent()) {
		end = new Date(endTime - (isMultiDay ? 2 * AjxDateUtil.MSEC_PER_HOUR : 0));
		var pattern = isMultiDay ? ZmMsg.apptTimeAllDayMulti : ZmMsg.apptTimeAllDay;
		return AjxMessageFormat.format(pattern, [start, end]);
	}
	var pattern = isMultiDay ? ZmMsg.apptTimeInstanceMulti : ZmMsg.apptTimeInstance;
	return AjxMessageFormat.format(pattern, [start, end, ""]);
};

ZmQuickReminderDialog.prototype._computeDelta =
function(appt) {
	return ((new Date()).getTime() - appt.getStartTime());
};
}

if (AjxPackage.define("zimbraMail.mail.view.ZmRetentionWarningDialog")) {
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
 * This file defines the Zimbra Retention Warning dialog, when attempting to delete
 * items that a retention policy specifies should be kept.
 *
 */

/**
 * Creates a retention warning dialog.
 * @class
 * Creates an retention warning can have a "Delete All", "Delete Valid" or Cancel buttons
 * "Delete All"   will delete all the messages that the user chose for deletion.
 * "Delete Valid" will delete those messages of the ones chosen that are unaffected by the
 *                retention policy (i.e. they are older than now - retention_policy_keep_period, or
 *                are in a folder that does not have a retention policy).
 *
 * @param	{Object}	parent		the parent
 *
 * @extends DwtMessageDialog
 */

ZmRetentionWarningDialog = function(parent) {

	var deleteAllButton   = new DwtDialog_ButtonDescriptor(ZmRetentionWarningDialog.DELETE_ALL_BUTTON,   ZmMsg.retentionDeleteAll,   DwtDialog.ALIGN_LEFT);
    var deleteValidButton = new DwtDialog_ButtonDescriptor(ZmRetentionWarningDialog.DELETE_VALID_BUTTON, ZmMsg.retentionDeleteValid, DwtDialog.ALIGN_LEFT);
	DwtMessageDialog.call(this, {parent:parent, buttons:[DwtDialog.CANCEL_BUTTON],
                          extraButtons:[deleteAllButton, deleteValidButton], id:"RetentionWarningDialog"});
};

ZmRetentionWarningDialog.prototype = new DwtMessageDialog;
ZmRetentionWarningDialog.prototype.constructor = ZmRetentionWarningDialog;

ZmRetentionWarningDialog.prototype.toString =
function() {
	return "ZmRetentionWarningDialog";
};

//
// Consts
//

ZmRetentionWarningDialog.DELETE_ALL_BUTTON   = "RetentionDeleteAll";
ZmRetentionWarningDialog.DELETE_VALID_BUTTON = "RetentionDeleteValid";

}
if (AjxPackage.define("zimbraMail.offline.ZmOffline")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
ZmOffline = function() {
	ZmOffline.SUPPORTED_APPS = [ZmApp.MAIL, ZmApp.CONTACTS, ZmApp.CALENDAR];
	ZmOffline.SUPPORTED_MAIL_TREE_VIEWS = [ZmOrganizer.FOLDER, ZmOrganizer.SEARCH, ZmOrganizer.TAG];
    ZmOfflineDB.init();
    this._addListeners();
};

ZmOffline.appCacheDone = false;
ZmOffline.messageNotShowed = true;
ZmOffline.cacheProgress = [];
ZmOffline.syncStarted = false;
ZmOffline.isServerReachable = true;

ZmOffline.folders = {};
ZmOffline.calendars = {};

// The number of days we read into the future to get calendar entries
ZmOffline.CALENDAR_LOOK_BEHIND_DAYS = 7;
ZmOffline.CALENDAR_READ_AHEAD_DAYS  = 21;

ZmOffline.ATTACHMENT = "Attachment";
ZmOffline.REQUESTQUEUE = "RequestQueue";
ZmOffline.META_DATA = "MetaData";

ZmOffline.MAIL_PROGRESS = "Mail";
ZmOffline.CONTACTS_PROGRESS = "Contacts";
ZmOffline.CALENDAR_PROGRESS = "Calendar Appointments";

ZmOffline.MAX_REQUEST_IN_BATCH_REQUEST = 50;
ZmOffline.SYNC_REQUEST_DELAY = 10000;

ZmOffline._checkCacheDone =
function (){
    if (appCtxt.isWebClientOfflineSupported && ZmOffline.appCacheDone && ZmOffline.cacheProgress.length === 0 && ZmOffline.syncStarted && ZmOffline.messageNotShowed){
        appCtxt.setStatusMsg(ZmMsg.offlineCachingDone, ZmStatusView.LEVEL_INFO);
        ZmOffline.messageNotShowed = false;
    }
};

ZmOffline.prototype._addListeners =
function() {
    $(window).on("online offline", ZmOffline.checkServerStatus);
    $(document).on("ZWCOffline", this._onZWCOffline.bind(this));
    $(document).on("ZWCOnline", this._onZWCOnline.bind(this));
	ZmZimbraMail.addListener(ZmAppEvent.POST_STARTUP, this._onPostStartup.bind(this));
    setInterval(ZmOffline.checkServerStatus, 10000);
};

ZmOffline.prototype._onZWCOffline =
function() {
	ZmOffline.refreshStatusIcon();
    this._disableApps();
	var zimbraMail = appCtxt.getZimbraMail();
	if (zimbraMail) {
		zimbraMail.setupHelpMenu();
	}
	this._setSearchOfflineState(true);
};

ZmOffline.prototype._onZWCOnline =
function() {
	ZmOffline.refreshStatusIcon();
    this._enableApps();
    this._replayOfflineRequest();
	var zimbraMail = appCtxt.getZimbraMail();
	if (zimbraMail) {
		zimbraMail.setupHelpMenu();
	}
	this._setSearchOfflineState(false);
};

ZmOffline.prototype._setSearchOfflineState = function(offline) {
	var searchController = appCtxt.getSearchController();
	if (searchController) {
		var searchToolbar = searchController.getSearchToolbar();
		if (searchToolbar) {
			searchToolbar.setOfflineState(offline);
		}
	}
}

ZmOffline.prototype._onPostStartup =
function() {
	this._initOfflineFolders();
	if (appCtxt.isWebClientOffline()) {
		this._onZWCOffline();
	}
	else {
		// Always replay offline request on post startup event so that the offline related changes are applied.
		this._replayOfflineRequest();
		this._initStaticResources();
	}
	ZmOffline.updateFolderCount();
};

ZmOffline.prototype._enableApps =
function() {
    // Configure the tabs
    var appChooser = appCtxt.getAppChooser();
    for (var i in ZmApp.ENABLED_APPS) {
        var appButton = appChooser.getButton(i);
        if (appButton) {
            appButton.setEnabled(true);
        }
    }

    // Enable features for the current app
    var app = appCtxt.getCurrentApp();
	app.resetWebClientOfflineOperations();
 };

ZmOffline.prototype._disableApps =
function() {
    // Configure the tabs
    var appChooser = appCtxt.getAppChooser();
    var enabledApps = AjxUtil.keys(ZmApp.ENABLED_APPS);
    var disabledApps = AjxUtil.arraySubstract(enabledApps, ZmOffline.SUPPORTED_APPS);
    for (var j = 0; j < disabledApps.length; j++) {
        var appButton = appChooser.getButton(disabledApps[j]);
        if (appButton) {
            appButton.setEnabled();
        }
    }

    // Disable features for the current app
    var app = appCtxt.getCurrentApp();
	app.resetWebClientOfflineOperations();
};

ZmOffline.prototype._initOfflineFolders =
function() {
	var folderTree = appCtxt.getFolderTree();
	if (folderTree) {
		var folders = folderTree.getByType("FOLDER");
		folders.forEach(function(folder) {
			if (folder.webOfflineSyncDays !== 0) {
				ZmOffline.folders[folder.id] = folder;
			}
		});

		var addrBooks = folderTree.getByType("ADDRBOOK");
		addrBooks.forEach(function(folder) {
			if (folder.id != ZmFolder.ID_DLS) {//Do not add distribution lists
				ZmOffline.folders[folder.id] = folder;
			}
		});

		//Check for deferredFolders for contacts
		var contactApp = appCtxt.getApp("Contacts");
		if (contactApp) {
			contactApp._deferredFolders.forEach(function(folder) {
				if (folder.obj.id != ZmFolder.ID_DLS) {
					ZmOffline.folders[folder.obj.id] = folder.obj;
				}
			});
		}
	}

	// Get the possible set of calendars.  Used to insure getFolder allows access to the invite messages
	var calMgr = appCtxt.getCalManager();
	var calViewController = calMgr && calMgr.getCalViewController();
	var calendarIds = calViewController.getOfflineSearchCalendarIds();
	for (var i = 0; i < calendarIds.length; i++) {
		// Store for use in processing mail messages - allow invites
		ZmOffline.calendars[calendarIds[i]] = calendarIds[i];
	}
};

ZmOffline.prototype._initStaticResources =
function() {
	ZmOffline.refreshStatusIcon(true);
	var staticURLs = [];
	var cssUrl = ["/css/msgview.css?v=", cacheKillerVersion, "&locale=", window.appRequestLocaleId, "&skin=", window.appCurrentSkin].join("");
	staticURLs.push({url : cssUrl, storeInLocalStorage : true, appendCacheKillerVersion : false});
	staticURLs.push({url : "/img/large.png"});
	staticURLs.push({url : "/img/large/ImgPerson_48.png"});
	staticURLs.push({url : "/img/arrows/ImgSashArrowsUp.png"});
	staticURLs.push({url : "/img/arrows.png"});
	staticURLs.push({url : "/img/calendar/ImgCalendarDayGrid.repeat.gif"});
	staticURLs.push({url : "/css/tinymce-content.css"});
	staticURLs.push({url : "/js/ajax/3rdparty/tinymce/skins/lightgray/fonts/tinymce-small.woff", appendCacheKillerVersion : false});
	staticURLs.push({url : "/js/ajax/3rdparty/tinymce/skins/lightgray/content.min.css", appendCacheKillerVersion : false});
	staticURLs.push({url : "/js/ajax/3rdparty/tinymce/skins/lightgray/skin.min.css", appendCacheKillerVersion : false});
	this._cacheStaticResources(staticURLs);
};

ZmOffline.prototype._cacheStaticResources =
function(staticURLs, cachedURL, response) {
	if (response && response.success && cachedURL && cachedURL.storeInLocalStorage) {
		localStorage.setItem(cachedURL.url, response.text);
	}
	if (staticURLs && staticURLs.length > 0) {
		var staticURL = staticURLs.shift();
		var url = appContextPath + staticURL.url;
		if (staticURL.appendCacheKillerVersion !== false) {
			staticURL.url = url = url + "?v=" + cacheKillerVersion;
		}
		var callback = this._cacheStaticResources.bind(this, staticURLs, staticURL);
		AjxRpc.invoke(null, url, null, callback, true);
	}
	else {
		var callback = this._cacheStaticResourcesContinue.bind(this);
		AjxDispatcher.require(["Contacts", "TinyMCE", "Extras"], true, callback);
	}
};

ZmOffline.prototype._cacheStaticResourcesContinue =
function() {
	var callback = this.sendSyncRequest.bind(this, appCtxt.reloadAppCache.bind(appCtxt));
	var cacheSignatureImages = this._cacheSignatureImages.bind(this, callback);
	var tinyMCELocale = tinyMCE.getlanguage(appCtxt.get(ZmSetting.LOCALE_NAME));
	if (tinyMCELocale === "en") {
		cacheSignatureImages();
	}
	else {
		var url = appContextPath + "/js/ajax/3rdparty/tinymce/langs/" + tinyMCELocale + ".js";
		AjxRpc.invoke(null, url, null, cacheSignatureImages, true);
	}
};

ZmOffline.prototype._cacheSignatureImages =
function(callback) {
	var signatures = appCtxt.getSignatureCollection().getSignatures();
	if (!signatures || signatures.length === 0) {
		return callback && callback();
	}
	var template = document.createElement("template");
	var imgSrcArray = [];
	signatures.forEach(function(signature) {
		template.innerHTML = signature.getValue(ZmMimeTable.TEXT_HTML);
		var imgNodeList = template.content.querySelectorAll("img[src]");
		for (var i = 0; i < imgNodeList.length; i++) {
			imgSrcArray.push(imgNodeList[i].getAttribute("src"));
		}
	});
	this._storeSignatureImages(imgSrcArray, callback);
};

ZmOffline.prototype._storeSignatureImages =
function(imgSrcArray, callback) {
	if (!imgSrcArray || imgSrcArray.length === 0) {
		return callback && callback();
	}
	var imgSrc = imgSrcArray.shift();
	var request = $.ajax({
		url: imgSrc,
		dataType: "text",
		headers: {'X-Zimbra-Encoding':'x-base64'}
	});
	request.done(function(imgSrc, response) {
		var imgType = imgSrc.substr(imgSrc.lastIndexOf(".") + 1);
		localStorage.setItem(imgSrc, "data:image/" + imgType + ";base64," + response);
	}.bind(window, imgSrc));
	request.always(this._storeSignatureImages.bind(this, imgSrcArray, callback));
};

ZmOffline.modifySignature =
function(value) {
	var template = document.createElement("template");
	template.innerHTML = value;
	var imgNodeList = template.content.querySelectorAll("img[src]");
	for (var i = 0; i < imgNodeList.length; i++) {
		var img = imgNodeList[i];
		var dataURI = localStorage.getItem(img.getAttribute("src"));
		if (dataURI) {
			img.setAttribute("src", dataURI);
			img.removeAttribute("dfsrc");
			img.removeAttribute("data-mce-src");
		}
	}
	return template.innerHTML;
};

ZmOffline.prototype._downloadCalendar =
function(startTime, endTime, calendarIds, callback, getMessages, previousMessageIds) {
    // Bundle it together in a batch request
    var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue"}};
    var request = jsonObj.BatchRequest;

    // Get the Cal Manager and CalViewController
    var calMgr = appCtxt.getCalManager();
    var calViewController = calMgr && calMgr.getCalViewController();
    var apptCache = calViewController.getApptCache();

    if (!startTime) {
        var endDate = new Date();
        endDate.setHours(23,59,59,999);
        //grab a week's appt backwards for reminders
        var startDate = new Date(endDate.getTime());
        startDate.setDate(startDate.getDate()-ZmOffline.CALENDAR_LOOK_BEHIND_DAYS);
        startDate.setHours(0,0,0, 0);
        endDate.setDate(endDate.getDate()+ ZmOffline.CALENDAR_READ_AHEAD_DAYS);
        startTime = startDate.getTime();
        endTime   = endDate.getTime();
    }

    if (!calendarIds) {
        // Get the calendars ids stored checked calendars for the first (main) account
        calendarIds = [];
        for (var calendarId in  ZmOffline.calendars) {
            calendarIds.push(calendarId);
        }
    }
    // Store the marker containing the end of the current display time window.
    localStorage.setItem("calendarSyncTime", endTime);

    // Appt Search Request.  This request will provide data for the calendar view displays, the reminders, and
    // the minical display.  Entries will be stored as ZmAppt data,
    var searchParams = {
        start:            startTime,
        end:              endTime,
        accountFolderIds: calendarIds,
        folderIds:        calendarIds,
        offset:           0
    }
    apptCache.setFolderSearchParams(searchParams.folderIds, searchParams);
    request.SearchRequest = {_jsns:"urn:zimbraMail"};
    apptCache._setSoapParams(request.SearchRequest, searchParams);

    var respCallback = this._handleCalendarResponse.bind(this, startTime, endTime, callback, getMessages, previousMessageIds, null);
    appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmOffline.prototype._downloadByApptId =
function(apptIds, itemQueryClause, startTime, endTime, callback) {
    // Place the search in a batchRequest, so handleCalendarResponse can unpack it in the same way
    var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue"}};
    jsonObj.BatchRequest.SearchRequest = {_jsns:"urn:zimbraMail"};
    var request = jsonObj.BatchRequest.SearchRequest;
    request.sortBy = "none";
    request.limit  = "500";
    request.offset = 0;
    request.locale = { _content: AjxEnv.DEFAULT_LOCALE };
    request.types  = ZmSearch.TYPE[ZmItem.APPT];
    var query      = itemQueryClause.join(" OR ");
    request.query  = {_content:query};
    request.calExpandInstStart = startTime;
    request.calExpandInstEnd   = endTime;

    // Call with getMessages == false, so callback will continue the downloading, and do the combined getMsgRequest call
    var respCallback = this._handleCalendarResponse.bind(this, startTime, endTime, callback, callback == null, null, apptIds);
    appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
}

ZmOffline.prototype._handleCalendarResponse =
function(startTime, endTime, callback, getMessages, previousMessageIds, apptIds, response) {

    var batchResp   = response && response._data && response._data.BatchResponse;
    var searchResp  = batchResp && batchResp.SearchResponse && batchResp.SearchResponse[0];

    try{
        var rawAppt;
        var appt;
        var apptList = new ZmApptList();
        // Convert the raw appts into ZmAppt objects.  Each rawAppt may represent several actual appointments (if the
        // appt is a recurring one), with differing start and end dates.  So break a raw appt into its component appts
        // and store them individually, with start and end time index info.
        apptList.loadFromSummaryJs(searchResp.appt, true);
        var numAppt = apptList.size();
        var apptContainers = [];
        var apptContainer;
        var apptStartTime;
        var apptEndTime;
        var msgIds = previousMessageIds ? previousMessageIds : [];
        var uniqueMsgIds = {};
        for (var i = 0; i < numAppt; i++) {
            appt       = apptList.get(i);
            apptStartTime  = appt.startDate.getTime();
            apptEndTime    = appt.endDate.getTime();
            // If this was called via _downloadByApptId (Sync items), prune if a synced item is outside
            // of the display window.  This may not be needed, since it looks like we can use calExpandInstStart and
            // End in the Search, but leave it for the moment.
            if (((apptStartTime >= startTime) && (apptStartTime <= endTime)) ||
                ((apptEndTime   >= startTime) && (apptEndTime   <= endTime)) ) {
                // The appts do not contain a unique id for each instance.  Generate one (used as the primary key),
                // for each appt/instance and store the appt with a container that has the index fields

                this._cleanApptForStorage(appt);
                apptContainer = {appt: appt,
                                 instanceId: this._createApptPrimaryKey(appt),
                                 id:         appt.id,
                                 invId:      appt.invId,
                                 startDate:  apptStartTime,
                                 endDate:    apptEndTime
                                };
                apptContainers.push(apptContainer);

                // Accumulate the msgIds for reading the appt invites.  Do that here to pick up any series exceptions
                // Note:  ZmCalItem.getDetails does:
                //   var id = seriesMode ? (this.seriesInvId || this.invId || this.id) : this.invId;
                // seriesInvId is the invId or null, constructed on dom load.  We want the actual invIds
                var msgId = appt.invId || appt.id;
                uniqueMsgIds[msgId] = true;
            }
        }
        for (var uniqueId in uniqueMsgIds) {
            msgIds.push(uniqueId);
        }

        // Unfortunately, periodic appts have a cancel mode ('Delete this instance and any future
        // ones') that removes a portion of the appts associated with an apptId.  In order to
        // assure that we have the correct appts and instances, delete all appts mentioned in
        // the apptIds (provided when syncing) and then write the newly acquired appts (i.e. an
        // update will be a delete then rewrite).
        if (apptIds) {
            var search;
            var offlineUpdateAppts = this._offlineUpdateAppts.bind(this, apptContainers);
            for (var apptId in apptIds) {
                search = [apptId];
                // If its a recurring appt, several ZmAppts may share the same id.  Find them and delete them all
                ZmOfflineDB.doIndexSearch(search, ZmApp.CALENDAR, null, offlineUpdateAppts,
                    this.calendarDeleteErrorCallback.bind(this), "id");
            }
        }  else {
			// Store the new/modified entries.
			ZmOfflineDB.setItem(apptContainers, ZmApp.CALENDAR, null, this.calendarDownloadErrorCallback.bind(this));
		}

        // Now make a server read to get the detailed appt invites, for edit view and tooltips
        if (getMessages) {
            if (msgIds.length > 0) {
                var updateProgress = this._updateCacheProgress.bind(this, ZmOffline.CALENDAR_PROGRESS);
                this._loadMessages(msgIds, updateProgress);
            } else {
                this._updateCacheProgress(ZmOffline.CALENDAR_PROGRESS);
            }
        }

        var calMgr = appCtxt.getCalManager();
        var calViewController = calMgr && calMgr.getCalViewController();
        var apptCache = calViewController.getApptCache();
        apptCache.clearCache();
    }catch(ex){
        DBG.println(AjxDebug.DBG1, ex);
        if (!callback) {
            this._updateCacheProgress(ZmOffline.CALENDAR_PROGRESS);
        }
    }

    if (callback) {
        callback.run(msgIds);
    }

};
ZmOffline.prototype.calendarDownloadErrorCallback =
function(e) {
    DBG.println(AjxDebug.DBG1, "Error while adding appts to indexedDB.  Error = " + e);
}
ZmOffline.prototype.calendarDeleteErrorCallback =
function(e) {
    DBG.println(AjxDebug.DBG1, "Error while deleting appts from indexedDB.  Error = " + e);
}

ZmOffline.prototype._createApptPrimaryKey =
function(appt) {
    return appt.id + ":" + appt.startDate.getTime();
}

ZmOffline.prototype._cleanApptForStorage =
function(appt) {
    delete appt.list;
    delete appt._list;
    delete appt._evt;
    delete appt._evtMgr;
}

ZmOffline.prototype._updateCacheProgress =
function(folderName){

    var index = $.inArray(folderName, ZmOffline.cacheProgress);
    if(index != -1){
        ZmOffline.cacheProgress.splice(index, 1);
    }
    if (ZmOffline.cacheProgress.length === 0){
        //this.sendSyncRequest();
        ZmOffline._checkCacheDone();
    }
    DBG.println(AjxDebug.DBG1, "_updateCacheProgress folder: " + folderName + " ZmOffline.cacheProgress " + ZmOffline.cacheProgress.join());


};

ZmOffline.prototype.scheduleSyncRequest =
function(notify, methodName) {
	if (methodName === "SyncRequest") {
		return;
	}
	var keys = Object.keys(notify.created || {});
	keys = keys.concat(Object.keys(notify.modified || {}));
	keys = keys.concat(Object.keys(notify.deleted || {}));
	if (keys.length === 0) {
		return;
	}
	if (this._syncRequestActionId) {
		AjxTimedAction.cancelAction(this._syncRequestActionId);
	}
	this._syncRequestActionId = AjxTimedAction.scheduleAction(new AjxTimedAction(this, this.sendSyncRequest), ZmOffline.SYNC_REQUEST_DELAY);
};

ZmOffline.prototype.sendSyncRequest =
function(callback) {
	ZmOffline.refreshStatusIcon(true);
	var syncToken = localStorage.getItem("SyncToken");
	if (syncToken) {
		AjxDebug.println(AjxDebug.OFFLINE, "syncToken :: "+syncToken);
		this._sendDeltaSyncRequest(callback, syncToken);
	}
	else {
		this._sendInitialSyncRequest(callback);
	}
};

ZmOffline.prototype._sendInitialSyncRequest =
function(callback) {
	var syncRequestArray = [];
	var keys = AjxUtil.keys(ZmOffline.folders);
	for (var i = 0, length = keys.length; i < length; i++) {
		var folder = ZmOffline.folders[keys[i]];
		if (folder && folder.id != ZmFolder.ID_OUTBOX) {
			var params = {l:folder.id, _jsns:"urn:zimbraMail"};
			if (folder.type === "FOLDER") {
				//specify the start date for the mail to be synched
				var startDate = AjxDateUtil.roll(new Date(), AjxDateUtil.DAY, -parseInt(folder.webOfflineSyncDays));
				params.msgCutoff = Math.round(startDate.getTime() / 1000);
			}
			syncRequestArray.push(params);
		}
	}
	if (syncRequestArray.length > 0) {
		var params = {
			jsonObj : {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue", SyncRequest:syncRequestArray}},
			asyncMode : true,
			callback : this._handleInitialSyncResponse.bind(this, true, callback),
			errorCallback : this._handleInitialSyncError.bind(this)
		};
		appCtxt.getRequestMgr().sendRequest(params);
	}
};

ZmOffline.prototype._handleInitialSyncResponse =
function(downloadCalendar, callback, result) {
	var response = result && result.getResponse();
	var batchResponse = response && response.BatchResponse;
	var syncResponse = batchResponse && batchResponse.SyncResponse;
	if (!syncResponse) {
		return;
	}
	var msgParamsArray = [];
	var contactIdsArray = [];
	var syncToken;
	var more;
	syncResponse.forEach(function(response) {
		var folderInfo = response.folder && response.folder[0];
		if (folderInfo) {
			if (folderInfo.m) {
				var msgIds = folderInfo.m[0].ids;
				if (msgIds) {
					// Check for a shared-mailbox folder.  If so, the msgIds must be specified as mountpoint:msgId
					var idParts = folderInfo.id.split(":");
					var prefix = (idParts.length > 1) ? idParts[0] + ":" : "";
					msgIds.split(",").forEach(function(id) {
						var params = {
							m : {id: prefix + id, html:1, needExp:1},
							_jsns : "urn:zimbraMail"
						};
						msgParamsArray.push(params);
					});
				}
			}
			else if (folderInfo.cn) {
				var contactIds = folderInfo.cn[0].ids;
				if (contactIds) {
					contactIdsArray = contactIdsArray.concat(contactIds.split(","));
				}
			}
		}
		syncToken = response.token;
		more = response.more;
	});
	var params = {
		msgs : msgParamsArray,
		contactIds : contactIdsArray
	};
	// if more="1" is specified on the sync response, the response does *not* bring the client completely up to date. more changes are still queued, and another SyncRequest (using the new returned token) is necessary.
	if (more == 1) {
		params.callback = this.sendSyncRequest.bind(this, callback);
	}
	else {
		params.callback = callback;
	}
	this._sendGetRequest(params);
	if (downloadCalendar) {
		this._downloadCalendar(null, null, null, null, true, null);
	}
	this._storeSyncToken(syncToken);
};

ZmOffline.prototype._handleInitialSyncError =
function() {
	ZmOffline.refreshStatusIcon();
};

ZmOffline.prototype._sendGetRequest =
function(params) {
	var msgs = params.msgs || [];
	var contactIds = params.contactIds || [];
	var msgsLength = msgs.length;
	var contactIdsLength = contactIds.length;
	if (msgsLength === 0 && contactIdsLength === 0) {
		if (params.callback && !params.isCallbackExecuted) {
			params.isCallbackExecuted = true;
			params.callback();
		}
		ZmOffline.refreshStatusIcon();
	}
	else {
		var getCallback = this._sendGetRequest.bind(this, params);
		var newParams = {
			jsonObj : {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue"}},
			asyncMode : true,
			callback : this._handleGetResponse.bind(this, getCallback),
			errorCallback : this._handleGetError.bind(this, getCallback)
		};
		var batchRequest = newParams.jsonObj.BatchRequest;
		//Limit maximum number of request in batch request to ZmOffline.MAX_REQUEST_IN_BATCH_REQUEST property
		var getMsgRequest = msgs.splice(0, ZmOffline.MAX_REQUEST_IN_BATCH_REQUEST);
		if (getMsgRequest.length > 0) {
			batchRequest.GetMsgRequest = getMsgRequest;
		}
		if (contactIdsLength > 0 && getMsgRequest.length < ZmOffline.MAX_REQUEST_IN_BATCH_REQUEST) {
			batchRequest.GetContactsRequest = {_jsns:"urn:zimbraMail", derefGroupMember:1, returnCertInfo: 1, cn:{id:contactIds.join()}}; //See ZCS-999 and ZCS-991 for returnCertInfo param
			contactIds.splice(0, contactIdsLength);
		}
		appCtxt.getRequestMgr().sendRequest(newParams);
	}
};

ZmOffline.prototype._sendDeltaSyncRequest =
function(callback, syncToken) {
	var params = {
		jsonObj : {SyncRequest:{_jsns:"urn:zimbraMail", token:syncToken, typed:1}},
		asyncMode : true,
		callback : this._handleDeltaSyncResponse.bind(this, callback, syncToken),
		errorCallback : this._handleDeltaSyncError.bind(this)
	};
	appCtxt.getRequestMgr().sendRequest(params);
};

ZmOffline.prototype._handleDeltaSyncResponse =
function(callback, syncToken, result) {
	ZmOffline.refreshStatusIcon();
	var syncResponse = result && result.getResponse().SyncResponse;
	if (!syncResponse || syncResponse.token === syncToken) {
		if (callback) {
			callback();
		}
		return;
	}
	this._storeSyncToken(syncResponse.token);
	if (syncResponse.deleted) {
		this._handleSyncDeletes(syncResponse.deleted);
	}
	if (syncResponse.m || syncResponse.cn) {
		this._handleSyncUpdate(syncResponse);
	}
	if (syncResponse.appt) {
		this._handleUpdateAppts(syncResponse.appt);
	}
	if (syncResponse.folder) {
		this._handleUpdateFolders(syncResponse.folder);
	}
    if (syncResponse.folder || syncResponse.search) {
        appCtxt.reloadAppCache();
    }
	if (callback) {
		callback();
	}
};

ZmOffline.prototype._handleDeltaSyncError =
function(ex) {
	ZmOffline.refreshStatusIcon();
	if (ex && ex.code === ZmCsfeException.MAIL_MUST_RESYNC) {
		//if the response is a mail.MUST_RESYNC fault, client has fallen too far out of date and must re-initial sync
		localStorage.removeItem("SyncToken");
		this.sendSyncRequest();
		return true;
	}
};

ZmOffline.prototype._handleSyncDeletes =
function(deletes) {
	var deletedInfo = deletes[0];
	if (!deletedInfo) {
		return;
	}
	if (deletedInfo.m) {
		var deletedMsgIds = deletedInfo.m[0] && deletedInfo.m[0].ids;
		if (deletedMsgIds) {
			var deletedMsgIdArray = [].concat(deletedMsgIds.split(","));
		}
	}
	if (deletedInfo.cn) {
		var deletedContactIds = deletedInfo.cn[0] && deletedInfo.cn[0].ids;
		if (deletedContactIds) {
			var deletedContactsIdArray = [].concat(deletedContactIds.split(","));
		}
	}
	if (deletedMsgIdArray && deletedMsgIdArray.length > 0) {
		ZmOfflineDB.deleteItem(deletedMsgIdArray, ZmApp.MAIL);
	}
	if (deletedContactsIdArray && deletedContactsIdArray.length > 0) {
		ZmOfflineDB.deleteItem(deletedContactsIdArray, ZmApp.CONTACTS);
	}
};

ZmOffline.prototype._handleSyncUpdate =
function(syncResponse) {
	var msgs = syncResponse.m;
	var contacts = syncResponse.cn;
	var msgParamsArray = [];
	var contactIdsArray = [];
	if (msgs) {
		var offlineFolderIds = Object.keys(ZmOffline.folders);
		var nonOfflineMsgIds = [];
		msgs.forEach(function(msg) {
			//Get messages only if it belongs to offline folder
			if (msg.l && offlineFolderIds.indexOf(msg.l) !== -1) {
				var params = {m:{id:msg.id, html:1, needExp:1}, _jsns:"urn:zimbraMail"};
				msgParamsArray.push(params);
			} else {
				nonOfflineMsgIds.push(msg.id);
			}
		});
		if (nonOfflineMsgIds.length > 0) {
			// Fix for Bug 95758.  Try and delete the messages from the mail store, in case some were stored offline.
			// This happens when a message is moved from a folder that stores offline messages to one that does not.
			ZmOfflineDB.deleteItem(nonOfflineMsgIds, ZmApp.MAIL);
		}
	}
	if (contacts) {
		contacts.forEach(function(contact) {
			contactIdsArray.push(contact.id);
		});
	}
	ZmOffline.refreshStatusIcon(true);
	this._sendGetRequest({msgs : msgParamsArray, contactIds : contactIdsArray});
};

ZmOffline.prototype._handleUpdateFolders =
function(folders) {
	var syncRequestArray = [];
	folders.forEach(function(folder) {
		var folderId = folder.id;
		var params = {l:folderId, _jsns:"urn:zimbraMail"};
		if (folder.view === "message") {
			var isExistingOfflineFolder = ZmOffline.folders.hasOwnProperty(folderId);
			if (isExistingOfflineFolder && folder.webOfflineSyncDays == 0) {
				var callback = function(result) {
					ZmOfflineDB.deleteItem(result, ZmApp.MAIL);
				};
				ZmOfflineDB.doIndexSearch([folderId.toString()], ZmApp.MAIL, null, callback, null, "folder", true);
				delete ZmOffline.folders[folderId];
			}
			else if ( (isExistingOfflineFolder && folder.webOfflineSyncDays != ZmOffline.folders[folderId].webOfflineSyncDays)
					  || (!isExistingOfflineFolder && folder.webOfflineSyncDays != 0) ) {
				//If existing offline folder???s webOfflineSyncDays property is modified or new folder???s webOfflineSyncDays property is set
				//specify the start date for the mail to be synched
				var startDate = AjxDateUtil.roll(new Date(), AjxDateUtil.DAY, -parseInt(folder.webOfflineSyncDays));
				params.msgCutoff = Math.round(startDate.getTime() / 1000);
				syncRequestArray.push(params);
				ZmOffline.folders[folderId] = folder;
			}
		}
		else if (folder.view === "contact") {
			syncRequestArray.push(params);
			ZmOffline.folders[folderId] = folder;
		}
	});
	if (syncRequestArray.length > 0) {
		var params = {
			jsonObj : {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue", SyncRequest:syncRequestArray}},
			asyncMode : true,
			callback : this._handleInitialSyncResponse.bind(this, false, false)
		};
		ZmOffline.refreshStatusIcon(true);
		appCtxt.getRequestMgr().sendRequest(params);
	}
};

ZmOffline.prototype._storeSyncToken =
function(syncToken) {
	AjxDebug.println(AjxDebug.OFFLINE, "New syncToken :: " + syncToken);
	localStorage.setItem("SyncToken", syncToken);
};

ZmOffline.prototype._handleGetResponse =
function(callback, result) {
	var response = result && result.getResponse();
	var batchResponse = response && response.BatchResponse;
	if (!batchResponse) {
		return;
	}
	var getMsgResponse = batchResponse.GetMsgResponse;
	if (getMsgResponse) {
		var msgs = [];
		for (var i = 0; i < getMsgResponse.length; i++) {
			msgs.push(getMsgResponse[i].m[0]);
		}
		var setItemCallback = this._handleSetItemCallback.bind(this, msgs, ZmApp.MAIL, callback);
		ZmOfflineDB.setItem(msgs, ZmApp.MAIL, setItemCallback);
	}
	var getContactsResponse = batchResponse.GetContactsResponse;
	if (getContactsResponse) {
		var contacts = [];
		for (var i = 0; i < getContactsResponse.length; i++) {
			contacts = contacts.concat(getContactsResponse[i].cn);
		}
		var setItemCallback = this._handleSetItemCallback.bind(this, contacts, ZmApp.CONTACTS, callback);
		ZmOfflineDB.setItem(contacts, ZmApp.CONTACTS, setItemCallback);
	}
};

ZmOffline.prototype._handleSetItemCallback =
function(item, type, callback) {
	if (callback) {
		callback();
	}
	if (type === ZmApp.MAIL) {
		this._fetchMsgAttachments(item);
	}
};

ZmOffline.prototype._handleGetError =
function(folder, index, result) {
	localStorage.removeItem("SyncToken");
};

// Different enough from mail to warrent its own function
ZmOffline.prototype._handleUpdateAppts =
function(items, type){

    if (!items) items = [];

    var item = null;
    var folders = {};
    var startOfDayDate = new Date();
    var currentTime    = startOfDayDate.getTime();
    var endOfDayDate   = new Date(currentTime);

    // We only care about changes within our display window.
    startOfDayDate.setHours(0,0,0,0);
    var newStartTime = startOfDayDate.getTime() - (AjxDateUtil.MSEC_PER_DAY * ZmOffline.CALENDAR_LOOK_BEHIND_DAYS);
    endOfDayDate.setHours(23,59,59,999)
    var newEndTime   = endOfDayDate.getTime()   + (AjxDateUtil.MSEC_PER_DAY * ZmOffline.CALENDAR_READ_AHEAD_DAYS);

    var previousEndTime = newEndTime;
    var lastSyncTime = localStorage.getItem("calendarSyncTime");
    if (lastSyncTime) {
        previousEndTime = parseInt(lastSyncTime) + (AjxDateUtil.MSEC_PER_DAY * ZmOffline.CALENDAR_READ_AHEAD_DAYS);
    }
    localStorage.setItem("calendarSyncTime", endOfDayDate.getTime());

    // Accumulate the ids of the altered appts
    var itemQueryClause = [];
    var apptIds  = {};
    var sId;
    for (var i = 0, length = items.length; i < length; i++){
        item = items[i];
        sId = item.id.toString();
        apptIds[sId] = true;
        itemQueryClause.push("item:\"" + sId + "\"");
    }

    // If this is not the first download, we need to extend the visible range beyond the last update which read
    // calendar items from current-1week to current+3weeks.  So if 2 days has passed since the previous
    // read, read from the previousEnd to previousEnd+2days;  We also update previousEnd (by setting
    // calendarSyncTime in localstore).
    var doEndRangeDownloadCallback = (newEndTime > previousEndTime) ?
        this._downloadCalendar.bind(this, previousEndTime, newEndTime, null, null, true) : null;

    if (itemQueryClause.length > 0) {
        this._downloadByApptId(apptIds, itemQueryClause, newStartTime, newEndTime, doEndRangeDownloadCallback);
    } else if (doEndRangeDownloadCallback) {
        doEndRangeDownloadCallback.run();
    }

    // Delete items < newStartTime, in order to prune old entries and prevent monotonic accumulation
    // Search for items whose endTime is from 0 to newStartTime
    var search = [0, newStartTime];
    var errorCallback = this._expiredErrorCallback.bind(this);
    var offlineSearchExpiredAppts = this._offlineUpdateAppts.bind(this, null);
    ZmOfflineDB.doIndexSearch(search, ZmApp.CALENDAR, null, offlineSearchExpiredAppts, errorCallback, "endDate");
};

ZmOffline.prototype._offlineUpdateAppts =
function(apptContainersToAdd, apptContainersToDelete) {
    var appt;
	if (apptContainersToDelete) {
		for (var i = 0; i < apptContainersToDelete.length; i++) {
			appt = apptContainersToDelete[i].appt;
			ZmOfflineDB.deleteItem(this._createApptPrimaryKey(appt), ZmApp.CALENDAR, this.calendarDeleteErrorCallback.bind(this));
		}
	}

	// Store the new/modified entries.
	if (apptContainersToAdd) {
		ZmOfflineDB.setItem(apptContainersToAdd, ZmApp.CALENDAR, null, this.calendarDownloadErrorCallback.bind(this));
	}
}

ZmOffline.prototype._expiredErrorCallback =
function(e) {
    DBG.println(AjxDebug.DBG1, "Error while trying to search for expired appts in indexedDB.  Error = " + e);
}

ZmOffline.prototype._loadMessages =
function(msgIds, callback){
    if (!msgIds || msgIds.length === 0){
        return;
    }
    var soapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra");
    soapDoc.setMethodAttribute("onerror", "continue");
    for (var i=0, length = msgIds.length;i<length;i++){
        var requestNode = soapDoc.set("GetMsgRequest",null,null,"urn:zimbraMail");
        var msg = soapDoc.set("m", null, requestNode);
        msg.setAttribute("id", msgIds[i]);
        msg.setAttribute("read", 0);
        msg.setAttribute("html", 1);
        msg.setAttribute("needExp", 1);
     }
    var respCallback = this._handleGetResponse.bind(this, callback);
    appCtxt.getRequestMgr().sendRequest({
        soapDoc: soapDoc,
        asyncMode: true,
        callback: respCallback
    });

};


ZmOffline.prototype._replayOfflineRequest =
function() {
    var callback = this._sendOfflineRequest.bind(this);
    ZmOfflineDB.getItemInRequestQueue(false, callback);
};

ZmOffline.prototype._sendOfflineRequest =
function(result, skipOfflineAttachmentUpload) {

    if (!result || result.length === 0) {
        return;
    }

	if (skipOfflineAttachmentUpload) {
		var idArray = [];
		var oidArray = [];
		// Bundle it together in a batch request
		var params = {
			jsonObj : {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue"}},
			asyncMode : true
		};
		params.errorCallback = params.callback = this._handleResponseSendOfflineRequest.bind(this, idArray, oidArray);
		var batchRequest = params.jsonObj.BatchRequest;
		result.forEach(function(obj) {
			var methodName = obj.methodName;
			if (methodName === "BatchRequest") {
				$.extend(true, batchRequest, obj[methodName]);
			}
			else {
				if (!batchRequest[methodName]) {
					batchRequest[methodName] = [];
				}
				batchRequest[methodName].push(obj[methodName]);
			}
			idArray.push(obj.id);
			oidArray.push(obj.oid);
		});
		appCtxt.getRequestMgr().sendRequest(params);
	}
	else {
		var offlineAttachments = [];
		result.forEach(function(obj) {
			var methodName = obj.methodName;
			if (methodName === "SendMsgRequest" || methodName === "SaveDraftRequest") {
				var msg = obj[methodName].m;
				var attach = msg && msg.attach;
				if (attach) {
					for (var j in attach) {
						var attachmentObj = attach[j];
						if (attachmentObj && attachmentObj.isOfflineUploaded) {
							offlineAttachments.push(attachmentObj);
						}
					}
				}
				var flags = msg && msg.f;
				if (flags && flags.indexOf(ZmItem.FLAG_OFFLINE_CREATED) !== -1) {
					msg.f = flags.replace(ZmItem.FLAG_OFFLINE_CREATED, "");//Removing the offline created flag
					if (!msg.f) {
						delete msg.f;
					}
					delete msg.id;//Removing the temporary id
					delete msg.did;//Removing the temporary draft id
				}
			}
		});
		this._uploadOfflineAttachments(offlineAttachments, result);
	}
};

ZmOffline.prototype._handleResponseSendOfflineRequest =
function(idArray, oidArray) {
	if (idArray.length > 0) {
		var callback = ZmOffline.updateFolderCountCallback.bind(window, ZmFolder.ID_OUTBOX, 0);
		ZmOfflineDB.deleteItem(idArray, ZmApp.MAIL, callback);
	}
	if (oidArray.length > 0) {
		ZmOfflineDB.deleteItemInRequestQueue(oidArray);
	}
};

ZmOffline.prototype._getFolder =
function(index){
    for (var i=0, length = ZmOffline.folders.length; i< length; i++){
        if (ZmOffline.folders[i].id == index){
            return ZmOffline.folders[i].name;
        }
    }
    if (ZmOffline.calendars[index]) {
        return ZmOffline.calendars[index];
    } else {
        return null;
    }
};

/**
 * Deletes conversations or messages from the offline database.
 * @param {deletedIds}	array of message/convesation id's to be deleted from offline database.
 * @param {type}    type of the mail item ("message" or "conversation").
 */

ZmOffline.prototype.deleteItem =
function(deletedIds, type, folder){
    if (!deletedIds || deletedIds.length === 0){
        return;
    }
    var store = folder + type;
    for (var i=0, length = deletedIds.length;i < length; i++){
        ZmOfflineDB.deleteItem(deletedIds[i], store);
    }

};

ZmOffline.deleteOfflineData =
function() {
    DBG.println(AjxDebug.DBG1, "ZmOffline.deleteOfflineData");
    ZmOfflineDB.deleteDB();
    localStorage.clear();
};

ZmOffline.generateMsgResponse =
function(result) {
    var resp = [],
        obj,
        msgNode,
        generatedMsg,
        messagePart,
        i,
        length;

    result = [].concat(result);
    for (i = 0, length = result.length; i < length; i++) {
        obj = result[i];
        if (obj) {
            msgNode = obj[obj.methodName] && obj[obj.methodName]["m"];
            if (msgNode) {
                generatedMsg = {
                    id : msgNode.id,
                    f : msgNode.f || "",
                    mid : msgNode.mid,
                    cid : msgNode.cid,
                    idnt : msgNode.idnt,
                    e : msgNode.e,
                    l : "",
                    fr : "",
                    su : msgNode.su._content,
                    mp : [],
                    d : msgNode.d
                };
                //Flags
                if (obj.methodName === "SendMsgRequest") {
                    generatedMsg.f = generatedMsg.f.replace(ZmItem.FLAG_ISSENT, "").concat(ZmItem.FLAG_ISSENT);
                }
                else if (obj.methodName === "SaveDraftRequest") {
                    generatedMsg.f = generatedMsg.f.replace(ZmItem.FLAG_ISDRAFT, "").concat(ZmItem.FLAG_ISDRAFT);
                }
                if (msgNode.attach) {//attachment is there
                    generatedMsg.f = generatedMsg.f.replace(ZmItem.FLAG_ATTACH, "").concat(ZmItem.FLAG_ATTACH);
                }
                //Folder id
                if (obj.methodName === "SendMsgRequest") {
                    generatedMsg.l = ZmFolder.ID_OUTBOX.toString();
                }
                else if (obj.methodName === "SaveDraftRequest") {
                    generatedMsg.l = ZmFolder.ID_DRAFTS.toString();
                }
                //Message part
                messagePart = msgNode.mp[0];
                if (messagePart) {
                    var attach = msgNode.attach;
                    if (attach && attach.aid) { //attachment is there

                        generatedMsg.mp.push({
                            ct : ZmMimeTable.MULTI_MIXED,
                            part: ZmMimeTable.TEXT,
                            mp : []
                        });

                        if (messagePart.ct === ZmMimeTable.TEXT_PLAIN) {

                            generatedMsg.mp[0].mp.push({
                                body : true,
                                part : "1",
                                ct : ZmMimeTable.TEXT_PLAIN,
                                content : messagePart.content._content
                            });
                            generatedMsg.fr = generatedMsg.mp[0].mp[0].content;

                        } else if (messagePart.ct === ZmMimeTable.MULTI_ALT) {

                            generatedMsg.mp[0].mp.push({
                                ct : ZmMimeTable.MULTI_ALT,
                                part : "1",
                                mp : [{
                                        ct : ZmMimeTable.TEXT_PLAIN,
                                        part : "1.1",
                                        content : (messagePart.mp[0].content) ? messagePart.mp[0].content._content : ""
                                       },
                                       {
                                        ct : ZmMimeTable.TEXT_HTML,
                                        part : "1.2",
                                        body : true,
                                        content : (messagePart.mp[1].content) ? messagePart.mp[1].content._content : ""
                                       }
                                ]
                            });
                            generatedMsg.fr = generatedMsg.mp[0].mp[0].mp[0].content;

                        }

                        var attachIds = attach.aid.split(",");
                        for (var j = 0; j < attachIds.length; j++) {
                            var attachment = attach[attachIds[j]];
                            if (attachment) {
                                generatedMsg.mp[0].mp.push({
                                    cd : "attachment",
                                    ct : attachment.ct,
                                    filename : attachment.filename,
                                    aid : attachment.aid,
                                    s : attachment.s,
                                    data : attachment.data,
                                    isOfflineUploaded : attachment.isOfflineUploaded,
                                    part : (j + 2).toString()
                                });
                            }
                        }

                    } else {

                        if (messagePart.ct === ZmMimeTable.TEXT_PLAIN) {

                            generatedMsg.mp.push({
                                ct : ZmMimeTable.TEXT_PLAIN,
                                body : true,
                                part : "1",
                                content : messagePart.content._content
                            });
                            generatedMsg.fr = generatedMsg.mp[0].content;

                        } else if (messagePart.ct === ZmMimeTable.MULTI_ALT) {

                            generatedMsg.mp.push({
                                ct : ZmMimeTable.MULTI_ALT,
                                part: ZmMimeTable.TEXT,
                                mp : [{
                                        ct : ZmMimeTable.TEXT_PLAIN,
                                        part : "1",
                                        content : (messagePart.mp[0].content) ? messagePart.mp[0].content._content : ""
                                    },
                                    {
                                        ct : ZmMimeTable.TEXT_HTML,
                                        part : "2",
                                        body : true,
                                        content : (messagePart.mp[1].content) ? messagePart.mp[1].content._content : ""
                                    }
                                ]
                            });
                            generatedMsg.fr = generatedMsg.mp[0].mp[0].content;

                        }
                    }
                }
            }
            resp.push(generatedMsg);
        }
    }
    return resp;
};

/**
 * For ZWC offline, adds outbox folder
 */
ZmOffline.addOutboxFolder =
function() {
    if (!appCtxt.isWebClientOfflineSupported) {
        return;
    }
    var folderTree = appCtxt.getFolderTree(),
        root = folderTree.root,
        folderObj = {
            id: ZmFolder.ID_OUTBOX,
            absFolderPath: "/Outbox",
            activesyncdisabled: false,
            name: "Outbox"
        };
    var folder = ZmFolderTree.createFolder(ZmOrganizer.FOLDER, root, folderObj, folderTree, null, "folder");
    root.children.add(folder);
};

ZmOffline.updateFolderCount =
function() {
	var folders = [ZmFolder.ID_DRAFTS, ZmFolder.ID_OUTBOX];
	for (var i = 0, length = folders.length; i < length; i++) {
		var callback = ZmOffline.updateFolderCountCallback.bind(window, folders[i]);
		ZmOfflineDB.doIndexSearch([folders[i].toString()], ZmApp.MAIL, null, callback, null, "folder", true);
	}
};

ZmOffline.updateFolderCountCallback =
function(folderId, count) {
	if (AjxUtil.isArray(count)) {
		count = count.length;
	}
	var folder = appCtxt.getById(folderId);
	if (folder) {
		folder.notifyModify({n : count});
	}
};

ZmOffline.prototype._uploadOfflineAttachments =
function (attachments, result) {
	var attachment = attachments.shift();
	if (attachment) {
		var blob = AjxUtil.dataURItoBlob(attachment.data);
		if (blob) {
			blob.name = attachment.filename;
			var callback = this._uploadOfflineAttachmentsCallback.bind(this, attachments, result, attachment.aid);
			var errorCallback = this._uploadOfflineAttachmentsErrorCallback.bind(this, attachments, result, attachment.aid);
			ZmComposeController.prototype._uploadImage(blob, callback, errorCallback);
		}
	}
	else {
		this._sendOfflineRequest(result, true);
	}
};

ZmOffline.prototype._uploadOfflineAttachmentsCallback =
function(attachments, result, attachmentAid, uploadResponse) {
	for (var i = 0; i < result.length; i++) {
		var obj = result[i];
		if (!obj) {
			continue;
		}
		var methodName = obj.methodName;
		if (methodName === "SendMsgRequest" || methodName === "SaveDraftRequest") {
			var msg = obj[methodName].m;
			var attach = msg && msg.attach;
			var aid = attach && attach.aid;
			if (aid && aid.indexOf(attachmentAid) !== -1) {
				attach.aid = aid.replace(attachmentAid, uploadResponse[0].aid);
				delete attach[attachmentAid];
				break;
			}
		}
	}
	this._uploadOfflineAttachments(attachments, result);
};

ZmOffline.prototype._uploadOfflineAttachmentsErrorCallback =
function(attachments, result, attachmentAid) {
	for (var i = 0; i < result.length; i++) {
		var obj = result[i];
		if (!obj) {
			continue;
		}
		var methodName = obj.methodName;
		if (methodName === "SendMsgRequest" || methodName === "SaveDraftRequest") {
			var msg = obj[methodName].m;
			var attach = msg && msg.attach;
			var aid = attach && attach.aid;
			if (aid && aid.indexOf(attachmentAid) !== -1) {
				var aidArray = aid.split(",");
				AjxUtil.arrayRemove(aidArray, attachmentAid);
				if (aidArray.length > 0) {
					delete attach.aid;
				}
				else {
					attach.aid = aidArray.join();
				}
				delete attach[attachmentAid];//deleting the offline created attachment in the message node
				break;
			}
		}
	}
	this._uploadOfflineAttachments(attachments, result);
};

ZmOffline.prototype._uploadOfflineInlineAttachments =
function (obj, msg) {
    var template = document.createElement("template");
    template.innerHTML = msg.mp[0].mp[1].content._content;
    var dataURIImageNodeList = template.content.querySelectorAll("img[src^='data:']");
    for (var i = 0; i < dataURIImageNodeList.length; i++) {
        var blob = AjxUtil.dataURItoBlob(dataURIImageNodeList[i].src);
        if (blob) {
            var callback = this._uploadOfflineInlineAttachmentsCallback.bind(this, dataURIImageNodeList[i], obj, msg, template);
            ZmComposeController.prototype._uploadImage(blob, callback);
        }
    }

};

ZmOffline.prototype._uploadOfflineInlineAttachmentsCallback =
function(img, obj, msg, template, uploadResponse) {
    //img.src =
    var dataURIImageNodeList = template.content.querySelectorAll("img[src^='data:']");
    if (dataURIImageNodeList.length === 0) {
        delete msg.isInlineAttachment;
        this._sendOfflineRequest([].concat(obj));
    }
};

/**
 * Fires a head request to find whether server is reachable or not
 * @param {Boolean} [doStop] will not fire a second head request to confirm the server reachability
 * @param {Boolean} [doNotTrigger] Do not trigger online/offline events
 * @param {Function} [callback] Callback function to be called when the request finishes
 */
ZmOffline.checkServerStatus =
function(doStop, doNotTrigger, callback) {
    $.ajax({
        type: "HEAD",
        url: "/public/blank.html",
		cache: false,
        statusCode: {
            0: function() {
                if (ZmOffline.isServerReachable === true) {
                    if (doStop) {
                        // Reset here - state must be correct for functions triggered by ZWCOffline
                        ZmOffline.isServerReachable = false;
						if (!doNotTrigger) {
							$.event.trigger({
								type: "ZWCOffline"
							});
						}
					}
                    else {
                        return ZmOffline.checkServerStatus(true);
                    }
                }
                ZmOffline.isServerReachable = false;
            },
            200: function() {
                if (ZmOffline.isServerReachable === false) {
                    if (doStop) {
                        // Reset here - state must be correct for functions triggered by ZWCOnline
                        ZmOffline.isServerReachable = true;
						if (!doNotTrigger) {
							$.event.trigger({
								type: "ZWCOnline"
							});
						}
					}
                    else {
                        return ZmOffline.checkServerStatus(true);
                    }
                }
                ZmOffline.isServerReachable = true;
			}
		},
		complete: callback
    });
};
ZmOffline.checkServerStatus(true, true);

ZmOffline.isOnlineMode =
function() {
    return appCtxt.isWebClientOfflineSupported && !appCtxt.isWebClientOffline();
};

ZmOffline.prototype._fetchMsgAttachments =
function(messages) {
    var attachments = [];
    messages = ZmOffline.recreateMsg(messages);
    messages.forEach(function(msg) {
        var mailMsg = ZmMailMsg.createFromDom(msg, {}, true);
        var attachInfo = mailMsg.getAttachmentInfo();
        attachInfo.forEach(function(attachment) {
            attachments.push(attachment);
        });
    });
    this._saveAttachments(attachments);
};

ZmOffline.prototype._saveAttachments =
function(attachments) {
    if (!attachments || attachments.length === 0) {
	    ZmOffline.refreshStatusIcon();
        return;
    }
	ZmOffline.refreshStatusIcon(true);
    var attachment = attachments.shift();
    var callback = this._isAttachmentSavedinIndexedDBCallback.bind(this, attachment, attachments);
    ZmOffline.isAttachmentSavedinIndexedDB(attachment, callback);
};

ZmOffline.isAttachmentSavedinIndexedDB =
function(attachment, callback, errorCallback) {
    var key = ZmOffline.createAttachmentKey(attachment);
    ZmOfflineDB.getItemCount(key, ZmOffline.ATTACHMENT, callback, errorCallback);
};

ZmOffline.createAttachmentKey = function(attachment) {
	return "id=" + attachment.mid + "&part=" + attachment.part;
}

ZmOffline.prototype._isAttachmentSavedinIndexedDBCallback =
function(attachment, attachments, count) {
    var callback = this._saveAttachments.bind(this, attachments);
    if (count === 0) {
        var request = $.ajax({
            url: attachment.url,
	        dataType: "text",
            headers: {'X-Zimbra-Encoding':'x-base64'}
        });

        request.done(function(response) {
            var key = ZmOffline.createAttachmentKey(attachment);
            var item = {
                id   : key,
                mid  : attachment.mid,
                url  : attachment.url,
                type : attachment.ct,
                name : attachment.label,
                size : attachment.sizeInBytes,
				part : attachment.part,
                content : response
            };
            ZmOfflineDB.setItem(item, ZmOffline.ATTACHMENT, callback, callback);
        }.bind(this));

        request.fail(callback);
    }
    else {
        callback();
    }
};

ZmOffline.prototype._handleAttachmentsForOfflineMode = function(attachments, getLinkIdCallback, linkIds) {
	if (appCtxt.isWebClientOffline()) {
		var keyArray = [];
		if (attachments) {
			attachments.forEach(function(attachment) {
				var key = ZmOffline.createAttachmentKey(attachment);
				keyArray.push(key);
			});
			if (keyArray.length > 0) {
				var callback = this._handleAttachmentsForOfflineModeCallback.bind(this, attachments, getLinkIdCallback, linkIds);
				ZmOfflineDB.getItem(keyArray, ZmOffline.ATTACHMENT, callback);
			}
		}
	}
};

ZmOffline.prototype._handleAttachmentsForOfflineModeCallback = function(attachments, getLinkIdCallback, linkIds, resultArray) {
	if (!resultArray || !linkIds) {
		return;
	}
	var self = this;
	resultArray.forEach(function(result) {
		if (result.type && result.content) {
			var url = "data:" + result.type + ";base64," + result.content;
			for (var i = 0; i < linkIds.length; i++) {
				//Attachment main link
				var id = getLinkIdCallback(result.part, linkIds[i]);
				var link = document.getElementById(id);
				if (link) {
					link.href     = url;
					link.onclick  = null;
					link.download = result.name;
				}
			}
		}
	});
};


ZmOffline.modifyMsg =
function(msg) {

    var result = [].concat(msg).map(function(item) {
        if (item.f) {
            item.f = item.f.split("");
        }
        if (item.su) {
            item.su = item.su.split(" ");
        }
        if (item.fr) {
            item.fr = item.fr.split(" ");
        }
        if (item.tn) {
            item.tn = item.tn.split(",");
        }
        if (item.l) {
            item.l = item.l.toString();
        }
        if (item.e) {
            var from = [];
            var to = [];
            var cc = [];
            item.e.forEach(function(element){
                if (element.t === "f") {
                    if (element.a) {
                        from.push(element.a.toLowerCase());
                    }
                    if (element.p) {
                        from = from.concat(element.p.toLowerCase().split(" "));
                    }
                }
                else if (element.t === "t") {
                    if (element.a) {
                        to.push(element.a.toLowerCase());
                    }
                    if (element.p) {
                        to = to.concat(element.p.toLowerCase().split(" "));
                    }
                }
                else if (element.t === "c") {
                    if (element.a) {
                        cc.push(element.a.toLowerCase());
                    }
                    if (element.p) {
                        cc = cc.concat(element.p.toLowerCase().split(" "));
                    }
                }
            });
            if (from.length) {
                item.e.from = from;
            }
            if (to.length) {
                item.e.to = to;
            }
            if (cc.length) {
                item.e.cc = cc;
            }
        }
        return item;
    });

    return result;
};

ZmOffline.recreateMsg =
function(msg) {

    var result = [].concat(msg).map(function(item) {
        if (Array.isArray(item.f)) {
            item.f = item.f.join();
        }
        if (Array.isArray(item.su)) {
            item.su = item.su.join(" ");
        }
        if (Array.isArray(item.fr)) {
            item.fr = item.fr.join(" ");
        }
        if (Array.isArray(item.tn)) {
            item.tn = item.tn.join();
        }
        if (item.e) {
            delete item.e.from;
            delete item.e.to;
            delete item.e.cc;
        }
        return item;
    });

    return result;
};

ZmOffline.modifyContact =
function(contact) {

    var result = [].concat(contact).map(function(item) {
        if (item.tn) {
            item.tn = item.tn.split(",");
        }
        if (item._attrs) {
            if (item._attrs.jobTitle) {
                item._attrs.jobTitle = item._attrs.jobTitle.split(" ");
            }
        }
        return item;
    });

    return result;
};

ZmOffline.recreateContact =
function(contact) {

    var result = [].concat(contact).map(function(item) {
        if (Array.isArray(item.tn)) {
            item.tn = item.tn.join();
        }
        if (item._attrs) {
            if (Array.isArray(item._attrs.jobTitle)) {
                item._attrs.jobTitle = item._attrs.jobTitle.join(" ");
            }
        }
		ZmOffline._cacheContactMember(item);
        return item;
    });

    return result;
};

/*
** cache contact group members
*/
ZmOffline._cacheContactMember =
function(contact) {
	var contactMember = contact.m;
	if (!contactMember || !Array.isArray(contactMember) || appCtxt.cacheGet(contact.id)) {
		return;
	}
	var contactObj = ZmContact.createFromDom(contact, {});
	var result = new ZmCsfeResult({GetContactsResponse : {cn : [contact]}});
	//This method will do the caching of contact group member and update the cache
	ZmContact.prototype._handleLoadResponse.call(contactObj, null, result);
};

ZmOffline.refreshStatusIcon =
function(isSyncing) {
	if (appCtxt.isWebClientOffline()) {
		$("#" + ZmId.SKIN_OFFLINE_STATUS).addClass("ImgDisconnect")
			.removeClass("ImgOfflineSync")
			.attr("title", ZmMsg.OfflineServerNotReachable);
	}
	else {
		if (isSyncing) {
			$("#" + ZmId.SKIN_OFFLINE_STATUS).addClass("ImgOfflineSync")
				.removeClass("ImgDisconnect")
				.attr("title", ZmMsg.offlineCachingSync);
		}
		else {
			$("#" + ZmId.SKIN_OFFLINE_STATUS).removeClass("ImgOfflineSync ImgDisconnect")
				.attr("title", ZmMsg.offlineCachingDone);
		}
	}
};

ZmOffline.handleLogOff =
function(ev, relogin) {
	if (ev) {
		ZmOfflineSettingsDialog.showConfirmSignOutDialog();
	}
	else if (relogin) {
		appCtxt.reloadAppCache();
		setTimeout(ZmZimbraMail.logOff, 1000);
	}
};
}
// This ZmRevokeShareDialog is require in zimlet (zimbra-zimlet-classic-document-editor)
if (AjxPackage.define("zimbraMail.share.view.dialog.ZmRevokeShareDialog")) {
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
 */

/**
 * Creates a revoke share dialog.
 * @class
 * This class represents a revoke share dialog.
 * 
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *  
 * @extends		DwtDialog
 */
ZmRevokeShareDialog = function(parent, className) {
	if (arguments.length == 0) return;

	className = className || "ZmRevokeShareDialog";
	var title = ZmMsg.revokeShare;
	var buttons = [ DwtDialog.YES_BUTTON, DwtDialog.NO_BUTTON ];
	DwtDialog.call(this, {parent:parent, className:className, title:title, standardButtons:buttons});
	this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));
	
	var view = this._createView();
	this.setView(view);

	// create formatters
	this._formatter = new AjxMessageFormat(ZmMsg.revokeShareConfirm);
};

ZmRevokeShareDialog.prototype = new DwtDialog;
ZmRevokeShareDialog.prototype.constructor = ZmRevokeShareDialog;

// Public methods

ZmRevokeShareDialog.prototype.toString =
function() {
	return "ZmRevokeShareDialog";
};

/**
 * Pops-up the dialog.
 * 
 * @param	{ZmShare}	share		the share
 */
ZmRevokeShareDialog.prototype.popup =
function(share) {
	this._share = share;

	var isPubShare = share.isPublic();
	var isGuestShare = share.isGuest();
	var isAllShare = share.grantee && (share.grantee.type == ZmShare.TYPE_ALL);

	var params = isPubShare ? ZmMsg.shareWithPublic : isGuestShare ? share.grantee.id : isAllShare ? ZmMsg.shareWithAll :
					(AjxStringUtil.htmlEncode(share.grantee.name) || ZmMsg.userUnknown);
	this._confirmMsgEl.innerHTML = this._formatter.format(params);

	this._reply.setReplyType(ZmShareReply.STANDARD);
	this._reply.setReplyNote("");
	this._reply.setVisible(!isPubShare && !isAllShare);

    if (isGuestShare) {
        this._reply.setReplyOptions(ZmShareReply.EXTERNAL_USER_OPTIONS);
    }
    else {
        this._reply.setReplyOptions(ZmShareReply.DEFAULT_OPTIONS);
    }

	DwtDialog.prototype.popup.call(this);
	this.setButtonEnabled(DwtDialog.YES_BUTTON, true);
};

// Protected methods

ZmRevokeShareDialog.prototype._handleYesButton =
function() {
	var callback = new AjxCallback(this, this._yesButtonCallback);
	this._share.revoke(callback);
};

ZmRevokeShareDialog.prototype._yesButtonCallback =
function() {
	var share = this._share;
	var replyType = this._reply.getReplyType();
	var sendMail = !(share.isAll() || share.isPublic() || share.invalid); 
	if (replyType != ZmShareReply.NONE && sendMail) {
		// initialize rest of share information
		share.grantee.email = share.grantee.name || share.grantee.id;
		share.grantor.id = appCtxt.get(ZmSetting.USERID);
		share.grantor.email = appCtxt.get(ZmSetting.USERNAME);
		share.grantor.name = appCtxt.get(ZmSetting.DISPLAY_NAME) || share.grantor.email;
		share.link.id = share.object.id;
		share.link.name = share.object.name;
		share.link.view = ZmOrganizer.getViewName(share.object.type);

		share.notes = (replyType == ZmShareReply.QUICK) ? this._reply.getReplyNote() : "";
	
		share.sendMessage(ZmShare.DELETE);
	}

	this.popdown();
};

ZmRevokeShareDialog.prototype._createView =
function() {
	this._confirmMsgEl = document.createElement("DIV");
	this._confirmMsgEl.style.fontWeight = "bold";
	this._confirmMsgEl.style.marginBottom = "0.25em";
	
	var view = new DwtComposite(this);
	this._reply = new ZmShareReply(view);
	
	var element = view.getHtmlElement();
	element.appendChild(this._confirmMsgEl);
	element.appendChild(this._reply.getHtmlElement());

	this._tabGroup.addMember(this._reply.getTabGroupMember());
	return view;
};

ZmRevokeShareDialog.prototype._getSeparatorTemplate =
function() {
	return "";
};
}
}
