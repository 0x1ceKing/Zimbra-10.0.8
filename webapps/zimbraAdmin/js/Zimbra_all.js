if (AjxPackage.define("Zimbra")) {
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
 * Support for a generic login page, error dialog,
 * splash screen, and for sending requests to the server.
 */
if (AjxPackage.define("zimbra.csfe.ZmBatchCommand")) {
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
 * This file contains the batch command class.
 */

/**
 * Creates an empty batch command. Use the {@link #add} method to add commands to it,
 * and {@link #run} to invoke it.
 * @class
 * This class represent a batch command, which is a collection of separate 
 * requests. Each command is a callback with a method, arguments, and (usually) an
 * object on which to call the method. Normally, when the command is run, it creates
 * a SOAP document or JSON object which it hands to the app controller's <code>sendRequest()</code>
 * method. It may also pass a response callback and/or an error callback.
 * <p>
 * Instead of calling sendRequest(), the command should hand the batch command its SOAP
 * document or JSON object, response callback, and error callback. The last argument that
 * the command receives is a reference to the batch command; that's how it knows it's in batch mode.
 * </p>
 * <p>
 * After all commands have been added to the batch command, call its run() method. That will
 * create a BatchRequest out of the individual commands' requests and send it to the
 * server. Each subrequest gets an ID. When the BatchResponse comes back, it is broken into
 * individual responses. If a response indicates success (it is a <code>*Response</code>), the corresponding
 * response callback is called with the result. If the response is a fault, the corresponding
 * error callback is called with the exception.
 * </p>
 * <p>
 * A command does not have to be the method that generates a SOAP document or JSON object.
 * It can be higher-level. Just make sure that the reference to the batch command gets passed down to it.
 * </p>
 * @author Conrad Damon
 * 
 * @param {Boolean}	continueOnError	if <code>true</code>, the batch request continues processing when a subrequest fails (defaults to <code>true</code>)
 * @param {String}	accountName		the account name to run this batch command as.
 * @param {Boolean}	useJson			if <code>true</code>, send JSON rather than XML
 */
ZmBatchCommand = function(continueOnError, accountName, useJson) {
	
	this._onError = (continueOnError === false) ? ZmBatchCommand.STOP : ZmBatchCommand.CONTINUE;
	this._accountName = accountName;
	this._useJson = useJson;
    this._requestBody = null;

	this.curId = 0;
    this._cmds = [];
	this._requests = [];
	this._respCallbacks = [];
	this._errorCallbacks = [];
};

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmBatchCommand.prototype.toString =
function() {
	return "ZmBatchCommand";
};

//
// Data
//

ZmBatchCommand.prototype._sensitive = false;
ZmBatchCommand.prototype._noAuthToken = false;

//
// Constants
//
ZmBatchCommand.STOP = "stop";
ZmBatchCommand.CONTINUE = "continue";

//
// Public methods
//

/**
 * Sets the sensitive flag. This indicates that this batch command
 * contains a request with sensitive data. Note: There is no way to unset
 * this value for the batch command.
 * 
 * @param	{Boolean}	sensitive		<code>true</code> to set command as sensitive
 */
ZmBatchCommand.prototype.setSensitive = function(sensitive) {
	this._sensitive = this._sensitive || sensitive;
};

/**
 * Sets the noAuthToken flag.
 *
 * @param	{Boolean}	noAuthToken		<code>true</code> to send command with noAuthToken
 */
ZmBatchCommand.prototype.setNoAuthToken = function(noAuthToken) {
	this._noAuthToken = noAuthToken;
};

/**
 * Checks if the command is sensitive.
 * 
 * @return	{Boolean}	<code>true</code> if the command is sensitive
 */
ZmBatchCommand.prototype.isSensitive = function() {
	return this._sensitive;
};

/**
 * Adds a command to the list of commands to run as part of this batch request.
 * 
 * @param {AjxCallback}	cmd		the command
 */
ZmBatchCommand.prototype.add =
function(cmd) {
	this._cmds.push(cmd);
};

/**
 * Gets the number of commands that are part of this batch request.
 * 
 * @return	{int}	the size
 */
ZmBatchCommand.prototype.size =
function() {
	return this.curId || this._cmds.length;
};

/**
 * Runs the batch request. For each individual request, either a response or an
 * error callback will be called.
 * 
 * @param {AjxCallback}		callback		the callback to run after entire batch request has completed
 * @param {AjxCallback}		errorCallback	the error callback called if anything fails.
 *										The error callbacks arguments are all
 *										of the exceptions that occurred. Note:
 *										only the first exception is passed if
 *										this batch command's onError is set to
 *										stop.
 */
ZmBatchCommand.prototype.run =
function(callback, errorCallback, offlineCallback) {

	// Invoke each command so that it hands us its SOAP doc, response callback,
	// and error callback
	for (var i = 0; i < this._cmds.length; i++) {
		var cmd = this._cmds[i];
		cmd.run(this);
		this.curId++;
	}

	var params = {
		sensitive:		this._sensitive,
        noAuthToken:	this._noAuthToken,
		asyncMode:		true,
		callback:		new AjxCallback(this, this._handleResponseRun, [callback, errorCallback]),
		errorCallback:	errorCallback,
		offlineCallback: offlineCallback,
		accountName:	this._accountName
	};

	// Create the BatchRequest
	if (this._useJson) {
		var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror:this._onError}};
		var batchRequest = jsonObj.BatchRequest;
		var size = this.size();
		if (size && this._requests.length) {
			for (var i = 0; i < size; i++) {
				var request = this._requests[i];
                //Bug fix # 67110 the request object is sometimes undefined
                if(request) {
                    request.requestId = i;
                    var methodName = ZmCsfeCommand.getMethodName(request);
                    if (!batchRequest[methodName]) {
                        batchRequest[methodName] = [];
                    }
				    request[methodName].requestId = i;
				    batchRequest[methodName].push(request[methodName]);
                }
			}
			params.jsonObj = jsonObj;
            this._requestBody = jsonObj;
		}
	}
	else {
		var batchSoapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra");
		batchSoapDoc.setMethodAttribute("onerror", this._onError);
		// Add each command's request element to the BatchRequest, and set its ID
		var size = this.size();
		if (size > 0) {
			for (var i = 0; i < size; i++) {
				var soapDoc = this._requests[i];
				var reqEl = soapDoc.getMethod();
				reqEl.setAttribute("requestId", i);
				var node = batchSoapDoc.adoptNode(reqEl);
				batchSoapDoc.getMethod().appendChild(node);
			}
			params.soapDoc = batchSoapDoc;
            this._requestBody = batchSoapDoc;
		}
	}

	// Issue the BatchRequest *but* only when there's something to request
	if (params.jsonObj || params.soapDoc) {
		appCtxt.getAppController().sendRequest(params);
	}
	else if (callback) {
		callback.run();
	}
};

ZmBatchCommand.prototype.getRequestBody =
function() {
    return this._requestBody;
}

/**
 * @private
 */
ZmBatchCommand.prototype._handleResponseRun =
function(callback, errorCallback, result) {
	var batchResponse = result.getResponse();
	if (!batchResponse.BatchResponse) {
		DBG.println(AjxDebug.DBG1, "Missing batch response!");
		return;
	}
	// NOTE: In case the order of the requests is significant, we process
	//       the responses in the same order.
	var responses = [];
	for (var method in batchResponse.BatchResponse) {
		if (method.match(/^_/)) continue;

		var methodResponses = batchResponse.BatchResponse[method];
		for (var i = 0; i < methodResponses.length; i++) {
			responses[methodResponses[i].requestId] = { method: method, resp: methodResponses[i] };
		}
	}
	var exceptions = [];
	for (var i = 0; i < responses.length; i++) {
		var response = responses[i];
		try {
			this._processResponse(response.method, response.resp);
		}
		catch (ex) {
			exceptions.push(ex);
			if (this._onError == ZmBatchCommand.STOP) {
				break;
			}
		}
	}
	if (exceptions.length > 0 && errorCallback) {
		errorCallback.run.apply(errorCallback, exceptions);
	}
	else if (callback) {
		callback.run(result);
	}
};

/**
 * Adds the given command parameters to the batch command, as part of a command's
 * invocation. Should be called by a function that was added via {@link #add} earlier; that
 * function should pass the request object.
 * 
 * @param {AjxSoapDoc|Object}	request		a SOAP document or JSON object with the command's request
 * @param {AjxCallback}	respCallback	the next callback in chain for async request
 * @param {AjxCallback}		errorCallback	the callback to run if there is an exception
 * 
 * @see		#add
 */
ZmBatchCommand.prototype.addRequestParams =
function(request, respCallback, errorCallback) {
	this._requests[this.curId] = request;
	this._respCallbacks[this.curId] = respCallback;
	this._errorCallbacks[this.curId] = errorCallback;
};

/**
 * Adds the given command parameters to the batch command, as part of a command's
 * invocation. Should be called without a previous {@link #add} command, when the request
 * object can immediately generate its request object.
 * 
 * @param {AjxSoapDoc|object}	request		a SOAP document or JSON object with the command's request
 * @param {AjxCallback}	respCallback	the next callback in chain for async request
 * @param {AjxCallback}	errorCallback	the callback to run if there is an exception
 * 
 * @see		#add
 */
ZmBatchCommand.prototype.addNewRequestParams =
function(request, respCallback, errorCallback) {
    this.addRequestParams(request, respCallback, errorCallback);
    this.curId++;
};

/**
 * Each type of request will return an array of <code>*Response</code> elements. There may also be
 * an array of Fault elements. Each element has an ID, so we can match it to its
 * response or error callback, and run whichever is appropriate.
 * 
 * @private
 */
ZmBatchCommand.prototype._processResponse =
function(method, resp) {
	var id = resp.requestId;

	// handle error
	if (method == "Fault") {
		var ex = ZmCsfeCommand.faultToEx(resp, "ZmBatchCommand.prototype.run");
		if (this._errorCallbacks[id]) {
			var handled = this._errorCallbacks[id].run(ex);
			if (!handled) {
				appCtxt.getAppController()._handleException(ex);
			}
		}
		throw ex;
	}

	// process response callback
	if (this._respCallbacks[id]) {
		var data = {};
		data[method] = resp;
		var result = new ZmCsfeResult(data);
		this._respCallbacks[id].run(result, resp);
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
ZLoginFactory.TWO_FACTOR_CODE = "ZTwoFactorCode";
ZLoginFactory.TWO_FACTOR_CODE_FORM = "ZTwoFactorCodeForm";
ZLoginFactory.VERIFY_BUTTON_ID = "ZTwoFactorVerifyButton";

// Constants for tabbing through the login controls.
ZLoginFactory.TEXT_TYPE = 0;
ZLoginFactory.CHECKBOX_TYPE = 1;
ZLoginFactory.BUTTON_TYPE = 2;

ZLoginFactory.TAB_ORDER = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					 ZLoginFactory.NEW_PASSWORD_ID, ZLoginFactory.PASSWORD_CONFIRM_ID,
					 ZLoginFactory.REMEMBER_ME_ID, ZLoginFactory.LOGIN_BUTTON_ID, ZLoginFactory.VERIFY_BUTTON_ID];
ZLoginFactory.VISIBILITY = [ZLoginFactory.USER_ID, ZLoginFactory.PASSWORD_ID, 
					  ZLoginFactory.NEW_PASSWORD_TR_ID, ZLoginFactory.PASSWORD_CONFIRM_TR_ID,
					  ZLoginFactory.REMEMBER_ME_CONTAINER_ID, ZLoginFactory.LOGIN_BUTTON_ID, ZLoginFactory.VERIFY_BUTTON_ID];
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
		
		copyrightText : msgs["splashScreenCopyright"] || "",

		twoFactorCodeTitle: msgs["twoFactorCodeTitle"] || "",
		twoFactorCodeLabel: msgs["twoFactorCodeLabel"] + ':' || "",
		twoFactorCodeButton: msgs["twoFactorCodeButton"] || "",
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

ZLoginFactory.showTwoFactorCode = function () {
	this.hideForm();
	this.show(ZLoginFactory.TWO_FACTOR_CODE_FORM);
}

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
					"<table class='form' id='ZLoginFormPanel'", (params.showForm ? " " : "style='display:none'"),">",
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
					"<table class='form' id='", ZLoginFactory.TWO_FACTOR_CODE_FORM, "'", (params.showTwoFactorForm ? " " : "style='display:none'"), " >",
						"<tr>",
							"<td colspan=2 class='ZTwoFactorMessage'>" , params.twoFactorCodeTitle, "</td>",
						"</tr>",
						"<tr>",
							"<td><label for='", ZLoginFactory.TWO_FACTOR_CODE, "'>", params.twoFactorCodeLabel, "</label></td>",
							"<td><input id='", ZLoginFactory.TWO_FACTOR_CODE, "' name='", ZLoginFactory.TWO_FACTOR_CODE, "' class='zLoginField' type='text' autocomplete='off' size='40' ></td>",
						"</tr>",
						"<tr>",
							"<td>&nbsp;</td>",
							"<td class='submitTD'>",
								"<input id='", ZLoginFactory.VERIFY_BUTTON_ID, "' class='ZLoginButton DwtButton' type='button' onclick='", params.loginAction, ";return false' value='", params.twoFactorCodeButton, "' />",
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
}
if (AjxPackage.define("zimbra.Widgets")) {
AjxTemplate.register("zimbra.Widgets#ZmErrorDialogControls", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<div id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_buttons' class='DwtDialogButtonBar'>";
	 if (AjxEnv.isNav) { 
	buffer[_i++] = "<input type='button' id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_focus' style='height:0px;width:0px;display:none;'>";
	 } 
	buffer[_i++] = "</div>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"width": "20",
	"id": "zimbra.Widgets#ZmErrorDialogControls",
	"height": "32"
}, false);
AjxTemplate.register("zimbra.Widgets", AjxTemplate.getTemplate("zimbra.Widgets#ZmErrorDialogControls"), AjxTemplate.getParams("zimbra.Widgets#ZmErrorDialogControls"));

AjxTemplate.register("zimbra.Widgets#ZmErrorDialogContent", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" width='100%' height='100%'><tr><td>";
	buffer[_i++] = data["message"];
	buffer[_i++] = "</td></tr>";
	 if (data.showDetails) { 
	buffer[_i++] = "<tr><td><hr/></td></tr><tr><td style='height:100%;vertical-align:top;'>\n";
	buffer[_i++] = "\t\t\t\t";
	buffer[_i++] = data["detail"];
	buffer[_i++] = "\n";
	buffer[_i++] = "\t\t\t</td></tr>";
	 } 
	buffer[_i++] = "</table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "zimbra.Widgets#ZmErrorDialogContent"
}, false);

AjxTemplate.register("zimbra.Widgets#ZmColorMenuItem", 
function(name, params, data, buffer) {
	var _hasBuffer = Boolean(buffer);
	data = (typeof data == "string" ? { id: data } : data) || {};
	buffer = buffer || [];
	var _i = buffer.length;

	buffer[_i++] = "<table role=\"presentation\" class='ZWidgetTable ZMenuItemTable ZMenuItemBorder'><tr><td id='";
	buffer[_i++] = data["id"];
	buffer[_i++] = "_title' class='ZWidgetTitle'></td></tr></table>";

	return _hasBuffer ? buffer.length : buffer.join("");
},
{
	"id": "zimbra.Widgets#ZmColorMenuItem",
	"class": "ZWidget"
}, false);

}
