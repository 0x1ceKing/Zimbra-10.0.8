if (AjxPackage.define("Preferences")) {
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
/*
 * Package: Preferences
 * 
 * Supports: The Options (preferences) application
 * 
 * Loaded:
 * 	- When the user goes to the Options application
 * 	- When the user creates a filter rule from message headers
 */
if (AjxPackage.define("zimbraMail.prefs.model.ZmFilterRule")) {
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
 * Creates an empty filter rule. Conditions and actions will need to be added.
 * @constructor
 * @class
 * ZmFilterRule represents a filter rule. A rule includes one or more conditions
 * and one or more actions.
 *
 * @author Conrad Damon
 *
 * @param {String}	name			the rule name
 * @param {Boolean}	active		if <code>true</code>, if the rule is enabled
 * @param {Object}	filterActions	the filter action data as raw json object
 * @param {Object}	filterTests	the filter conditions data as raw json object
 * 
 */
ZmFilterRule = function(name, active, filterActions, filterTests) {
	/**
     * The name of the filter rule.
     * @type String
     */
	this.name = name;
	/**
	 * The filter rule actions.
	 * @type	Object
	 */
	this.actions = filterActions || {};
	/**
	 * The filter rules conditions.
	 * @type	Object
	 */
	this.conditions = filterTests || {};
	this.active = (active !== false);
	if (!filterTests) {
		this.setGroupOp();
	}

	this.id = ZmFilterRule._nextId++;
};

ZmFilterRule.prototype.isZmFilterRule = true;
ZmFilterRule.prototype.toString = function() { return "ZmFilterRule"; };


ZmFilterRule._nextId = 1;

/**
 * Defines the "group any" operator.
 */
ZmFilterRule.GROUP_ANY = "anyof";
/**
 * Defines the "group all" operator.
 */
ZmFilterRule.GROUP_ALL = "allof";

// Display widgets for various rule properties

/**
 * Defines the "input" type.
 */
ZmFilterRule.TYPE_INPUT			= "INPUT";
/**
 * Defines the "select" type.
 */
ZmFilterRule.TYPE_SELECT		= "SELECT";
/**
 * Defines the "calendar" type.
 */
ZmFilterRule.TYPE_CALENDAR		= "CALENDAR";
/**
 * Defines the "folder picker" type.
 */
ZmFilterRule.TYPE_FOLDER_PICKER	= "FOLDER_PICKER";
/**
 * Defines the "tag picker" type.
 */
ZmFilterRule.TYPE_TAG_PICKER	= "TAG_PICKER";

ZmFilterRule.IMPORTANCE         = "importance";
ZmFilterRule.IMPORTANCE_HIGH    = "high";
ZmFilterRule.IMPORTANCE_LOW     = "low";
ZmFilterRule.IMPORTANCE_NORMAL  = "normal";
ZmFilterRule.FLAGGED            = "flagged";
ZmFilterRule.READ               = "read";
ZmFilterRule.PRIORITY           = "priority";
ZmFilterRule.RANKING            = "ranking";


// Conditions (subjects)
ZmFilterRule.C_FROM			            = AjxEmailAddress.FROM;
ZmFilterRule.C_TO			            = AjxEmailAddress.TO;
ZmFilterRule.C_CC			            = AjxEmailAddress.CC;
ZmFilterRule.C_TO_CC		            = "TO_CC";
ZmFilterRule.C_BCC                      = AjxEmailAddress.BCC;
ZmFilterRule.C_SUBJECT		            = "SUBJECT";
ZmFilterRule.C_HEADER		            = "HEADER";
ZmFilterRule.C_SIZE			            = "SIZE";
ZmFilterRule.C_DATE			            = "DATE";
ZmFilterRule.C_BODY			            = "BODY";
ZmFilterRule.C_ATT			            = "ATT";
ZmFilterRule.C_MIME_HEADER	            = "MIME_HEADER";
ZmFilterRule.C_ADDRBOOK		            = "ADDRBOOK";
ZmFilterRule.C_INVITE		            = "INVITE";
ZmFilterRule.C_CONV                     = "CONVERSATIONS";
ZmFilterRule.C_BULK                     = "BULK";
ZmFilterRule.C_LIST                     = "LIST";
ZmFilterRule.C_SOCIAL                   = "SOCIAL";
ZmFilterRule.C_FACEBOOK                 = "FACEBOOK";
ZmFilterRule.C_LINKEDIN                 = "LINKEDIN";
ZmFilterRule.C_TWITTER                  = "TWITTER";
ZmFilterRule.C_COMMUNITY                = "COMMUNITY";
ZmFilterRule.C_COMMUNITY_REQUESTS       = "COMMUNITY_REQUESTS";
ZmFilterRule.C_COMMUNITY_CONTENT        = "COMMUNITY_CONTENT";
ZmFilterRule.C_COMMUNITY_CONNECTIONS    = "COMMUNITY_CONNECTIONS";
ZmFilterRule.C_ADDRESS                  = "ADDRESS";
ZmFilterRule.C_RANKING                  = "RANKING";
ZmFilterRule.C_ME                       = "ME";
ZmFilterRule.C_IMPORTANCE               = "IMPORTANCE";

ZmFilterRule.C_HEADER_VALUE = {};
ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT]	= "subject";
ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_HEADER]	= "header";

ZmFilterRule.C_HEADER_MAP = AjxUtil.valueHash(ZmFilterRule.C_HEADER_VALUE);

ZmFilterRule.C_ADDRESS_VALUE = {};
ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_FROM]	= "from";
ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO]		= "to";
ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_CC]		= "cc";
ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO_CC]	= "to,cc";
ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_BCC]    = "bcc";

ZmFilterRule.C_ADDRESS_MAP = AjxUtil.valueHash(ZmFilterRule.C_ADDRESS_VALUE);

ZmFilterRule.C_LABEL = {};
ZmFilterRule.C_LABEL[ZmFilterRule.C_FROM]		= ZmMsg.from;
ZmFilterRule.C_LABEL[ZmFilterRule.C_TO]			= ZmMsg.to;
ZmFilterRule.C_LABEL[ZmFilterRule.C_CC]			= ZmMsg.cc;
ZmFilterRule.C_LABEL[ZmFilterRule.C_TO_CC]		= ZmMsg.toCc;
ZmFilterRule.C_LABEL[ZmFilterRule.C_BCC]        = ZmMsg.bcc;
ZmFilterRule.C_LABEL[ZmFilterRule.C_SUBJECT]	= ZmMsg.subject;
ZmFilterRule.C_LABEL[ZmFilterRule.C_HEADER]		= ZmMsg.headerNamed;
ZmFilterRule.C_LABEL[ZmFilterRule.C_SIZE]		= ZmMsg.size;
ZmFilterRule.C_LABEL[ZmFilterRule.C_DATE]		= ZmMsg.date;
ZmFilterRule.C_LABEL[ZmFilterRule.C_BODY]		= ZmMsg.body;
ZmFilterRule.C_LABEL[ZmFilterRule.C_ATT]		= ZmMsg.attachment;
// only read-receipt (i.e. "message/disposition-notification") content-type is currently supported
ZmFilterRule.C_LABEL[ZmFilterRule.C_MIME_HEADER]= ZmMsg.readReceiptFilter;
ZmFilterRule.C_LABEL[ZmFilterRule.C_ADDRBOOK]	= ZmMsg.addressIn;
ZmFilterRule.C_LABEL[ZmFilterRule.C_INVITE]		= ZmMsg.calendarInvite;
ZmFilterRule.C_LABEL[ZmFilterRule.C_CONV]       = ZmMsg.message;
ZmFilterRule.C_LABEL[ZmFilterRule.C_SOCIAL]     = ZmMsg.socialLabel;
ZmFilterRule.C_LABEL[ZmFilterRule.C_COMMUNITY]  = ZmMsg.communityName;
ZmFilterRule.C_LABEL[ZmFilterRule.C_ADDRESS]    = ZmMsg.address;

// Tests
ZmFilterRule.TEST_ADDRESS						= "addressTest"; 
ZmFilterRule.TEST_HEADER						= "headerTest";
ZmFilterRule.TEST_HEADER_EXISTS					= "headerExistsTest";
ZmFilterRule.TEST_SIZE							= "sizeTest";
ZmFilterRule.TEST_DATE							= "dateTest";
ZmFilterRule.TEST_BODY							= "bodyTest";
ZmFilterRule.TEST_ATTACHMENT					= "attachmentTest";
ZmFilterRule.TEST_MIME_HEADER					= "mimeHeaderTest";
ZmFilterRule.TEST_ADDRBOOK						= "addressBookTest";
ZmFilterRule.TEST_INVITE						= "inviteTest";
ZmFilterRule.TEST_FACEBOOK                      = "facebookTest";
ZmFilterRule.TEST_LINKEDIN                      = "linkedinTest";
ZmFilterRule.TEST_TWITTER                       = "twitterTest";
ZmFilterRule.TEST_COMMUNITY_REQUESTS            = "communityRequestsTest";
ZmFilterRule.TEST_COMMUNITY_CONTENT             = "communityContentTest";
ZmFilterRule.TEST_COMMUNITY_CONNECTIONS         = "communityConnectionsTest";
ZmFilterRule.TEST_CONVERSATIONS                 = "conversationTest";
ZmFilterRule.TEST_BULK                          = "bulkTest";
ZmFilterRule.TEST_LIST                          = "listTest";
ZmFilterRule.TEST_SOCIAL                        = "socialTest"; //not a real test
ZmFilterRule.TEST_COMMUNITY                     = "communityTest"; //not a real test
ZmFilterRule.TEST_ME                            = "meTest";
ZmFilterRule.TEST_RANKING                       = "contactRankingTest";
ZmFilterRule.TEST_IMPORTANCE                    = "importanceTest";
ZmFilterRule.TEST_FLAGGED                       = "flaggedTest";


// Conditions map to Tests
ZmFilterRule.C_TEST_MAP = {};
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_FROM]		            = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_TO]			            = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_CC]			            = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_TO_CC]		            = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_BCC]                     = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_SUBJECT]		            = ZmFilterRule.TEST_HEADER;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_HEADER]		            = ZmFilterRule.TEST_HEADER;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_SIZE]		            = ZmFilterRule.TEST_SIZE;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_DATE]		            = ZmFilterRule.TEST_DATE;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_BODY]		            = ZmFilterRule.TEST_BODY;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_ATT]			            = ZmFilterRule.TEST_ATTACHMENT;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_MIME_HEADER]	            = ZmFilterRule.TEST_MIME_HEADER;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_ADDRBOOK]	            = ZmFilterRule.TEST_ADDRBOOK;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_INVITE]		            = ZmFilterRule.TEST_INVITE;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_FACEBOOK]                = ZmFilterRule.TEST_FACEBOOK;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_LINKEDIN]                = ZmFilterRule.TEST_LINKEDIN;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_TWITTER]                 = ZmFilterRule.TEST_TWITTER;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_COMMUNITY_REQUESTS]      = ZmFilterRule.TEST_COMMUNITY_REQUESTS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_COMMUNITY_CONTENT]       = ZmFilterRule.TEST_COMMUNITY_CONTENT;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_COMMUNITY_CONNECTIONS]   = ZmFilterRule.TEST_COMMUNITY_CONNECTIONS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_CONV]                    = ZmFilterRule.TEST_CONVERSATIONS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_BULK]                    = ZmFilterRule.TEST_BULK;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_SOCIAL]                  = ZmFilterRule.TEST_SOCIAL;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_COMMUNITY]               = ZmFilterRule.TEST_COMMUNITY;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_ADDRESS]                 = ZmFilterRule.TEST_ADDRESS;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_ME]                      = ZmFilterRule.TEST_ME;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_RANKING]                 = ZmFilterRule.TEST_RANKING;
ZmFilterRule.C_TEST_MAP[ZmFilterRule.C_IMPORTANCE]              = ZmFilterRule.TEST_IMPORTANCE;

// Operations (verbs)
ZmFilterRule.OP_IS				        = "IS";
ZmFilterRule.OP_NOT_IS			        = "NOT_IS";
ZmFilterRule.OP_CONTAINS		        = "CONTAINS";
ZmFilterRule.OP_NOT_CONTAINS	        = "NOT_CONTAINS";
ZmFilterRule.OP_MATCHES			        = "MATCHES";
ZmFilterRule.OP_NOT_MATCHES		        = "NOT_MATCHES";
ZmFilterRule.OP_EXISTS			        = "EXISTS";
ZmFilterRule.OP_NOT_EXISTS		        = "NOT_EXISTS";
ZmFilterRule.OP_UNDER			        = "UNDER";
ZmFilterRule.OP_NOT_UNDER		        = "NOT_UNDER";
ZmFilterRule.OP_OVER			        = "OVER";
ZmFilterRule.OP_NOT_OVER		        = "NOT_OVER";
ZmFilterRule.OP_BEFORE			        = "BEFORE";
ZmFilterRule.OP_NOT_BEFORE		        = "NOT_BEFORE";
ZmFilterRule.OP_AFTER			        = "AFTER";
ZmFilterRule.OP_NOT_AFTER		        = "NOT_AFTER";
ZmFilterRule.OP_IN				        = "IN";
ZmFilterRule.OP_NOT_IN			        = "NOT_IN";
ZmFilterRule.OP_IS_REQUESTED	        = "IS_REQUESTED"; // invites
ZmFilterRule.OP_NOT_REQUESTED           = "NOT_REQUESTED"; //invites
ZmFilterRule.OP_NOT_REPLIED             = "NOT_REPLIED"; //invites
ZmFilterRule.OP_IS_REPLIED		        = "IS_REPLIED"; // invites
ZmFilterRule.OP_IS_READRECEIPT          = "IS_READRECEIPT";
ZmFilterRule.OP_NOT_READRECEIPT         = "NOT_READRECEIPT";
ZmFilterRule.OP_WHERE_STARTED           = "STARTED"; //conversations
ZmFilterRule.OP_WHERE_PARTICIPATED      = "PARTICIPATED"; //conversations
ZmFilterRule.OP_CONV_IS                 = "CONV_IS";//not an operator
ZmFilterRule.OP_NOT_CONV                = "CONV_NOT";
//ZmFilterRule.OP_SOCIAL_FROM           = "SOCIAL_FROM"; //not an operator
ZmFilterRule.OP_SOCIAL_FACEBOOK         = "SOCIAL_FACEBOOK";
ZmFilterRule.OP_SOCIAL_TWITTER          = "SOCIAL_TWITTER";
ZmFilterRule.OP_SOCIAL_LINKEDIN         = "SOCIAL_LINKEDIN";
ZmFilterRule.OP_IS_ME                   = "IS_ME";
ZmFilterRule.OP_NOT_ME                  = "IS_NOT_ME";
ZmFilterRule.OP_COMMUNITY_REQUESTS      = "COMMUNITY_REQUESTS";
ZmFilterRule.OP_COMMUNITY_CONTENT       = "COMMUNITY_CONTENT";
ZmFilterRule.OP_COMMUNITY_CONNECTIONS   = "COMMUNITY_CONNECTIONS";


// comparator types
ZmFilterRule.COMP_STRING    = "stringComparison";
ZmFilterRule.COMP_NUMBER    = "numberComparison";
ZmFilterRule.COMP_DATE      = "dateComparison";

// comparator map to test
ZmFilterRule.COMP_TEST_MAP = {};
ZmFilterRule.COMP_TEST_MAP[ZmFilterRule.TEST_ADDRESS]		= ZmFilterRule.COMP_STRING;
ZmFilterRule.COMP_TEST_MAP[ZmFilterRule.TEST_HEADER]		= ZmFilterRule.COMP_STRING;
ZmFilterRule.COMP_TEST_MAP[ZmFilterRule.TEST_MIME_HEADER]	= ZmFilterRule.COMP_STRING;
ZmFilterRule.COMP_TEST_MAP[ZmFilterRule.TEST_SIZE]			= ZmFilterRule.COMP_NUMBER;
ZmFilterRule.COMP_TEST_MAP[ZmFilterRule.TEST_DATE]			= ZmFilterRule.COMP_DATE;

// operation values
ZmFilterRule.OP_VALUE = {};
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS]			            = "is";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_CONTAINS]		            = "contains";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_MATCHES]		            = "matches";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_EXISTS]		            = "exists";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_UNDER]		            = "under";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_OVER]			            = "over";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_BEFORE]		            = "before";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_AFTER]		            = "after";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IN]			            = "in";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS_REQUESTED]	            = "anyrequest";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS_REPLIED]	            = "anyreply";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS_READRECEIPT]           = "contains";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_WHERE_STARTED]            = "started";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_WHERE_PARTICIPATED]       = "participated";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_CONV_IS]                  = "convIs";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS_ME]                    = "isMe";
ZmFilterRule.OP_VALUE[ZmFilterRule.OP_NOT_CONV]                 = "convNot";

ZmFilterRule.OP_VALUE_MAP = AjxUtil.valueHash(ZmFilterRule.OP_VALUE);

ZmFilterRule.OP_SOCIAL_MAP = {};
ZmFilterRule.OP_SOCIAL_MAP[ZmFilterRule.OP_SOCIAL_FACEBOOK] = ZmFilterRule.TEST_FACEBOOK;
ZmFilterRule.OP_SOCIAL_MAP[ZmFilterRule.OP_SOCIAL_LINKEDIN] = ZmFilterRule.TEST_LINKEDIN;
ZmFilterRule.OP_SOCIAL_MAP[ZmFilterRule.OP_SOCIAL_TWITTER] = ZmFilterRule.TEST_TWITTER;

ZmFilterRule.OP_COMMUNITY_MAP = {};
ZmFilterRule.OP_COMMUNITY_MAP[ZmFilterRule.OP_COMMUNITY_REQUESTS]       = ZmFilterRule.TEST_COMMUNITY_REQUESTS;
ZmFilterRule.OP_COMMUNITY_MAP[ZmFilterRule.OP_COMMUNITY_CONTENT]        = ZmFilterRule.TEST_COMMUNITY_CONTENT;
ZmFilterRule.OP_COMMUNITY_MAP[ZmFilterRule.OP_COMMUNITY_CONNECTIONS]    = ZmFilterRule.TEST_COMMUNITY_CONNECTIONS;

ZmFilterRule.OP_COMMUNITY_MAP_R = AjxUtil.backMap(ZmFilterRule.OP_COMMUNITY_MAP);

// operation labels
ZmFilterRule.OP_LABEL = {};
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IS]			            = ZmMsg.exactMatch;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_IS]		            = ZmMsg.notExactMatch;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_CONTAINS]		            = ZmMsg.contains;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_CONTAINS]	            = ZmMsg.notContain;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_MATCHES]		            = ZmMsg.matches;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_MATCHES]	            = ZmMsg.notMatch;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_EXISTS]		            = ZmMsg.exists;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_EXISTS]	            = ZmMsg.notExist;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_UNDER]		            = ZmMsg.under;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_UNDER]	            = ZmMsg.notUnder;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_OVER]			            = ZmMsg.over;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_OVER]		            = ZmMsg.notOver;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_BEFORE]		            = ZmMsg.beforeLc;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_BEFORE]	            = ZmMsg.notBefore;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_AFTER]		            = ZmMsg.afterLc;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_AFTER]	            = ZmMsg.notAfter;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IN]			            = ZmMsg.isIn;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_IN]		            = ZmMsg.notIn;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IS_REQUESTED]	            = ZmMsg.isRequested;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_REQUESTED]            = ZmMsg.notRequested;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IS_REPLIED]	            = ZmMsg.isReplied;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_REPLIED]              = ZmMsg.notReplied;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IS_READRECEIPT]           = ZmMsg.exists;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_READRECEIPT]          = ZmMsg.notExist;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_WHERE_PARTICIPATED]       = ZmMsg.participatedLabel;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_WHERE_STARTED]            = ZmMsg.startedLabel;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_CONV_IS]                  = ZmMsg.isLabel;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_CONV]                 = ZmMsg.notIs;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_SOCIAL_FACEBOOK]          = ZmMsg.facebookNotifications;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_SOCIAL_TWITTER]           = ZmMsg.twitterNotifications;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_SOCIAL_LINKEDIN]          = ZmMsg.linkedinMessagesConnections;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_COMMUNITY_REQUESTS]       = ZmMsg.communityRequests;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_COMMUNITY_CONTENT]        = ZmMsg.communityContent;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_COMMUNITY_CONNECTIONS]    = ZmMsg.communityConnections;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_IS_ME]                    = ZmMsg.isMeLabel;
ZmFilterRule.OP_LABEL[ZmFilterRule.OP_NOT_ME]                   = ZmMsg.isNotMeLabel;


// commonly used lists
ZmFilterRule.MATCHING_OPS = [
	ZmFilterRule.OP_IS, ZmFilterRule.OP_NOT_IS,
	ZmFilterRule.OP_CONTAINS, ZmFilterRule.OP_NOT_CONTAINS,
	ZmFilterRule.OP_MATCHES, ZmFilterRule.OP_NOT_MATCHES
];

/**
 * This defines a hash of conditions. Each condition is a hash of parameters. The key of the hash
 * is also known as the condition "subject". It is the field of an email message that 
 * the condition is tested against.
 * 
 * <p>
 * The condition parameters are:
 * <ul>
 * <li><b>subjectMod</b>	Type of input widget for the subjectModifier, which is a specifier or 
 *				modifier for the subject (such as which address to look at)</li>
 * <li><b>smOptions</b>		List of possible values for the subjectModifier ({@link ZmFilterRule.TYPE_SELECT})</li>
 * <li><b>ops</b>			Type of input widget for choosing the comparator</li>
 * <li><b>opsOptions</b>	List of possible comparators for this subject ({@link ZmFilterRule.TYPE_SELECT} type)</li>
 * <li><b>value</b>			Type of input widget for specifying the value</li>
 * <li><b>vOptions</b>		List of possible values ({@link ZmFilterRule.TYPE_SELECT} type)</li>
 * <li><b>valueMod</b>		Type of input widget for the valueModifier, which is a specifier or 
 *				modifier for the value (such as units for size)</li>
 * <li><b>vmOptions</b>		List of possible values for the valueModifier ({@link ZmFilterRule.TYPE_SELECT} type)</li>
 * </ul>
 */
ZmFilterRule.CONDITIONS = {};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_FROM] = {
	ops:		ZmFilterRule.TYPE_SELECT,
	opsOptions:	ZmFilterRule.MATCHING_OPS,
	value:		ZmFilterRule.TYPE_INPUT,
	valueMod:   ZmFilterRule.TYPE_SELECT,
	vmOptions:	[{label: ZmMsg.filterRuleOptionAll, value: "all"}, {label: ZmMsg.filterRuleOptionLocalpart, value: "localpart"}, {label:ZmMsg.filterRuleOptionDomain, value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_TO] = {
	ops:		ZmFilterRule.TYPE_SELECT,
	opsOptions:	ZmFilterRule.MATCHING_OPS,
	value:		ZmFilterRule.TYPE_INPUT,
	valueMod:   ZmFilterRule.TYPE_SELECT,
	vmOptions:	[{label: ZmMsg.filterRuleOptionAll, value: "all"}, {label: ZmMsg.filterRuleOptionLocalpart, value: "localpart"}, {label:ZmMsg.filterRuleOptionDomain, value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_CC] = {
	ops:		ZmFilterRule.TYPE_SELECT,
	opsOptions:	ZmFilterRule.MATCHING_OPS,
	value:		ZmFilterRule.TYPE_INPUT,
	valueMod:   ZmFilterRule.TYPE_SELECT,
	vmOptions:	[{label: ZmMsg.filterRuleOptionAll, value: "all"}, {label: ZmMsg.filterRuleOptionLocalpart, value: "localpart"}, {label:ZmMsg.filterRuleOptionDomain, value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_TO_CC] = {
	ops:		ZmFilterRule.TYPE_SELECT,
	opsOptions:	ZmFilterRule.MATCHING_OPS,
	value:		ZmFilterRule.TYPE_INPUT,
	valueMod:   ZmFilterRule.TYPE_SELECT,
	vmOptions:	[{label: ZmMsg.filterRuleOptionAll, value: "all"}, {label: ZmMsg.filterRuleOptionLocalpart, value: "localpart"}, {label:ZmMsg.filterRuleOptionDomain, value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_BCC] = {
	ops:		ZmFilterRule.TYPE_SELECT,
	opsOptions:	ZmFilterRule.MATCHING_OPS,
	value:		ZmFilterRule.TYPE_INPUT,
	valueMod:   ZmFilterRule.TYPE_SELECT,
	vmOptions:	[{label: ZmMsg.filterRuleOptionAll, value: "all"}, {label: ZmMsg.filterRuleOptionLocalpart, value: "localpart"}, {label:ZmMsg.filterRuleOptionDomain, value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_SUBJECT] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	ZmFilterRule.MATCHING_OPS,
		value:		ZmFilterRule.TYPE_INPUT
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_HEADER] = {
		subjectMod:	ZmFilterRule.TYPE_INPUT,
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	ZmFilterRule.MATCHING_OPS.concat([ZmFilterRule.OP_EXISTS, ZmFilterRule.OP_NOT_EXISTS]),
		value:		ZmFilterRule.TYPE_INPUT
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_SIZE] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_UNDER, ZmFilterRule.OP_NOT_UNDER, ZmFilterRule.OP_OVER, ZmFilterRule.OP_NOT_OVER],
		value:		ZmFilterRule.TYPE_INPUT,
		valueMod:	ZmFilterRule.TYPE_SELECT,
		vmOptions:	[{label: ZmMsg.b, value: "B"}, {label: ZmMsg.kb, value: "K"}, {label: ZmMsg.mb, value: "M"}, {label: ZmMsg.gb, value: "G"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_DATE] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_BEFORE, ZmFilterRule.OP_NOT_BEFORE, ZmFilterRule.OP_AFTER, ZmFilterRule.OP_NOT_AFTER],
		value:		ZmFilterRule.TYPE_CALENDAR
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_BODY] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_CONTAINS, ZmFilterRule.OP_NOT_CONTAINS],
		value:		ZmFilterRule.TYPE_INPUT
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_ATT] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_EXISTS, ZmFilterRule.OP_NOT_EXISTS]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_MIME_HEADER] = {
        ops:        ZmFilterRule.TYPE_SELECT,
        opsOptions: [ZmFilterRule.OP_IS_READRECEIPT, ZmFilterRule.OP_NOT_READRECEIPT]

};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_ADDRBOOK] = {
		subjectMod:	ZmFilterRule.TYPE_SELECT,
		smOptions:	[{label: ZmMsg.from, value: "FROM"}, {label: ZmMsg.to, value: "TO"},
					 {label: ZmMsg.cc, value: "CC"}, {label: ZmMsg.toOrCc, value: "TO,CC"},
					 {label: ZmMsg.bcc, value: "BCC"}],
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_IN, ZmFilterRule.OP_NOT_IN, ZmFilterRule.OP_IS_ME, ZmFilterRule.OP_NOT_ME],
		value:		ZmFilterRule.TYPE_SELECT,
		vOptions:	[{label: ZmMsg.myContactsLabel, value: "contacts"}, {label: ZmMsg.frequentEmailLabel, value: "ranking"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_INVITE] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_IS_REQUESTED, ZmFilterRule.OP_NOT_REQUESTED, ZmFilterRule.OP_IS_REPLIED, ZmFilterRule.OP_NOT_REPLIED]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_CONV] = {
		ops:        ZmFilterRule.TYPE_SELECT,
	    opsOptions: [ZmFilterRule.OP_CONV_IS, ZmFilterRule.OP_NOT_CONV],
		value:      ZmFilterRule.TYPE_SELECT,
		vOptions:  [{label: ZmMsg.convIStartLabel, value: "started"}, {label: ZmMsg.convIParticipateLabel, value: "participated"},
			        {label: ZmMsg.massMarketingLabel, value: ZmFilterRule.C_BULK}, {label: ZmMsg.distributionListLabel, value: ZmFilterRule.C_LIST},
					{label: ZmMsg.markedAsLabel, value: ZmFilterRule.IMPORTANCE}, {label: ZmMsg.flagged.toLowerCase(), value: ZmFilterRule.FLAGGED}],
	    valueMod:  ZmFilterRule.TYPE_SELECT,
	    vmOptions: [{label: ZmMsg.read.toLowerCase(), value: ZmFilterRule.READ}, {label: ZmMsg.priority.toLowerCase(), value: ZmFilterRule.PRIORITY},
		            {label: ZmMsg.importanceHigh, value: ZmFilterRule.IMPORTANCE_HIGH}, {label: ZmMsg.importanceNormal, value: ZmFilterRule.IMPORTANCE_NORMAL},
		            {label: ZmMsg.importanceLow, value: ZmFilterRule.IMPORTANCE_LOW}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_SOCIAL] = {
		ops:        ZmFilterRule.TYPE_SELECT,
		opsOptions: [ZmFilterRule.OP_SOCIAL_FACEBOOK, ZmFilterRule.OP_SOCIAL_TWITTER, ZmFilterRule.OP_SOCIAL_LINKEDIN]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_COMMUNITY] = {
		ops:        ZmFilterRule.TYPE_SELECT,
		opsOptions: [ZmFilterRule.OP_COMMUNITY_REQUESTS, ZmFilterRule.OP_COMMUNITY_CONTENT, ZmFilterRule.OP_COMMUNITY_CONNECTIONS]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_ADDRESS] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	ZmFilterRule.MATCHING_OPS,
		value:		ZmFilterRule.TYPE_INPUT,
		valueMod:   ZmFilterRule.TYPE_SELECT,    
		vmOptions:	[{label: "all", value: "all"}, {label: "localpart", value: "localpart"}, {label:"domain", value: "domain"}]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_LIST] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_EXISTS, ZmFilterRule.OP_NOT_EXISTS]
};
ZmFilterRule.CONDITIONS[ZmFilterRule.C_BULK] = {
		ops:		ZmFilterRule.TYPE_SELECT,
		opsOptions:	[ZmFilterRule.OP_EXISTS, ZmFilterRule.OP_NOT_EXISTS]
};

// map config keys to fields in a ZmCondition
ZmFilterRule.CONDITIONS_KEY = {"subjectMod": "subjectMod", "ops": "comparator",
							   "value": "value" /*, "valueMod": "valueModifier"*/};   //valueModifier was in the old CONDITIONS_KEY that I revived, but no longer seemed to work at all... no references to it.

// listed in order we want to display them in the SELECT
ZmFilterRule.CONDITIONS_LIST = [
	ZmFilterRule.C_FROM,
	ZmFilterRule.C_TO,
	ZmFilterRule.C_CC,
	ZmFilterRule.C_TO_CC,
    ZmFilterRule.C_BCC,
	ZmFilterRule.C_SUBJECT,
	ZmFilterRule.C_CONV,	
	ZmFilterRule.C_SIZE,
	ZmFilterRule.C_DATE,
	ZmFilterRule.C_BODY,
	ZmFilterRule.C_ATT,
	ZmFilterRule.C_MIME_HEADER,
	ZmFilterRule.C_ADDRBOOK,
	ZmFilterRule.C_INVITE,
	ZmFilterRule.C_SOCIAL,
	ZmFilterRule.C_COMMUNITY,
	ZmFilterRule.C_HEADER
];

// mark certain conditions as headers
ZmFilterRule.IS_HEADER = {};
ZmFilterRule.IS_HEADER[ZmFilterRule.C_SUBJECT]	= true;
ZmFilterRule.IS_HEADER[ZmFilterRule.C_HEADER]	= true;

ZmFilterRule.IS_ADDRESS = {};
ZmFilterRule.IS_ADDRESS[ZmFilterRule.C_FROM]    = true;
ZmFilterRule.IS_ADDRESS[ZmFilterRule.C_TO]      = true;
ZmFilterRule.IS_ADDRESS[ZmFilterRule.C_CC]      = true;
ZmFilterRule.IS_ADDRESS[ZmFilterRule.C_TO_CC]   = true;
ZmFilterRule.IS_ADDRESS[ZmFilterRule.C_BCC]     = true;

// Actions

/**
 * Defines the "keep" action type.
 */
ZmFilterRule.A_KEEP			= "KEEP";
/**
 * Defines the "keep" action type.
 */
ZmFilterRule.A_KEEP_SENT	= "KEEP_SENT";
/**
 * Defines the "folder" action type.
 */
ZmFilterRule.A_FOLDER		= "FOLDER";
/**
 * Defines the "discard" action type.
 */
ZmFilterRule.A_DISCARD		= "DISCARD";
/**
 * Defines the "stop" action type.
 */
ZmFilterRule.A_STOP			= "STOP";
/**
 * Defines the "flag" action type.
 */
ZmFilterRule.A_FLAG			= "FLAG";
/**
 * Defines the "tag" action type.
 */
ZmFilterRule.A_TAG			= "TAG";
/**
 * Defines the "forward" action type.
 */
ZmFilterRule.A_FORWARD		= "FORWARD";

/**
 * Defines the "keep" action name.
 */
ZmFilterRule.A_NAME_KEEP						= "actionKeep";
/**
 * Defines the "keep" action name.
 */
ZmFilterRule.A_NAME_KEEP_SENT					= "actionKeep";
/**
 * Defines the "file into a folder" action name.
 */
ZmFilterRule.A_NAME_FOLDER						= "actionFileInto";
/**
 * Defines the "discard" action name.
 */
ZmFilterRule.A_NAME_DISCARD						= "actionDiscard";
/**
 * Defines the "stop" action name.
 */
ZmFilterRule.A_NAME_STOP						= "actionStop";
/**
 * Defines the "flag" action name.
 */
ZmFilterRule.A_NAME_FLAG						= "actionFlag";
/**
 * Defines the "tag" action name.
 */
ZmFilterRule.A_NAME_TAG							= "actionTag";
/**
 * Defines the "forward" action name.
 */
ZmFilterRule.A_NAME_FORWARD						= "actionRedirect";
/**
 * Defines the "reply" action name.
 */
ZmFilterRule.A_REPLY                            = "actionReply";
/**
 * Defines the "notify" action name.
 */
ZmFilterRule.A_NOTIFY                           = "actionNotify";

ZmFilterRule.A_VALUE = {};
ZmFilterRule.A_VALUE[ZmFilterRule.A_KEEP]		= ZmFilterRule.A_NAME_KEEP;
ZmFilterRule.A_VALUE[ZmFilterRule.A_KEEP_SENT]	= ZmFilterRule.A_NAME_KEEP_SENT;
ZmFilterRule.A_VALUE[ZmFilterRule.A_FOLDER]		= ZmFilterRule.A_NAME_FOLDER;
ZmFilterRule.A_VALUE[ZmFilterRule.A_DISCARD]	= ZmFilterRule.A_NAME_DISCARD;
ZmFilterRule.A_VALUE[ZmFilterRule.A_STOP]		= ZmFilterRule.A_NAME_STOP;
ZmFilterRule.A_VALUE[ZmFilterRule.A_FLAG]		= ZmFilterRule.A_NAME_FLAG;
ZmFilterRule.A_VALUE[ZmFilterRule.A_TAG]		= ZmFilterRule.A_NAME_TAG;
ZmFilterRule.A_VALUE[ZmFilterRule.A_FORWARD]	= ZmFilterRule.A_NAME_FORWARD;
ZmFilterRule.A_VALUE[ZmFilterRule.A_REPLY]      = ZmFilterRule.A_REPLY;
ZmFilterRule.A_VALUE[ZmFilterRule.A_NOTIFY]     = ZmFilterRule.A_NOTIFY;

ZmFilterRule.A_VALUE_MAP = AjxUtil.valueHash(ZmFilterRule.A_VALUE);

ZmFilterRule.A_LABEL = {};
ZmFilterRule.A_LABEL[ZmFilterRule.A_KEEP]		= ZmMsg.keepInInbox;
ZmFilterRule.A_LABEL[ZmFilterRule.A_KEEP_SENT]	= ZmMsg.keepInSent;
ZmFilterRule.A_LABEL[ZmFilterRule.A_FOLDER]		= ZmMsg.moveIntoFolder;
ZmFilterRule.A_LABEL[ZmFilterRule.A_DISCARD]	= ZmMsg.discardMessage;
ZmFilterRule.A_LABEL[ZmFilterRule.A_STOP]		= ZmMsg.stopEvaluation;
ZmFilterRule.A_LABEL[ZmFilterRule.A_FLAG]		= ZmMsg.filterMarkAs;
ZmFilterRule.A_LABEL[ZmFilterRule.A_TAG]		= ZmMsg.tagWith;
ZmFilterRule.A_LABEL[ZmFilterRule.A_FORWARD]	= ZmMsg.redirectToAddress;

/**
 * This defines a hash of actions. The hash key is known as the action "name".
 * It may or may not take an argument.
 * 
 * <p>
 * The action parameters are:
 * <ul>
 * <li><b>param</b>			the type of input widget for the action's argument</li>
 * <li><b>pOptions</b>		the name/value pairs for args</li>
 * <li><b>precondition</b>	the setting that must be enabled for action to be available
 * 								(preconditions are set by ZmFilterRulesController, after
 * 								 settings are available)</li>
 * </ul>
 */
ZmFilterRule.ACTIONS = {};
ZmFilterRule.ACTIONS[ZmFilterRule.A_KEEP]		= {};
ZmFilterRule.ACTIONS[ZmFilterRule.A_KEEP_SENT]	= {};
ZmFilterRule.ACTIONS[ZmFilterRule.A_DISCARD] = {};
ZmFilterRule.ACTIONS[ZmFilterRule.A_STOP]		= {};
ZmFilterRule.ACTIONS[ZmFilterRule.A_FOLDER]	= {
	param:				ZmFilterRule.TYPE_FOLDER_PICKER
};

ZmFilterRule.ACTIONS[ZmFilterRule.A_FLAG] = {
	param:				ZmFilterRule.TYPE_SELECT,
	// NOTE: If you change the order of these options, also change _setPreconditions!!!
	pOptions:			[{label: ZmMsg.read, value: ZmFilterRule.READ}, {label: ZmMsg.flagged, value: ZmFilterRule.FLAGGED}]
};

ZmFilterRule.ACTIONS[ZmFilterRule.A_TAG] = {
	param:				ZmFilterRule.TYPE_TAG_PICKER
};

ZmFilterRule.ACTIONS[ZmFilterRule.A_FORWARD] = {
	param:				ZmFilterRule.TYPE_INPUT,
	validationFunction:	ZmPref.validateEmail,
	errorMessage:		ZmMsg.errorInvalidEmail
};


ZmFilterRule.ACTIONS_LIST = [
	ZmFilterRule.A_KEEP,
	ZmFilterRule.A_DISCARD,
	ZmFilterRule.A_FOLDER,
	ZmFilterRule.A_TAG,
	ZmFilterRule.A_FLAG,
	ZmFilterRule.A_FORWARD
];

ZmFilterRule.ACTIONS_OUTGOING_LIST = [
	ZmFilterRule.A_KEEP_SENT,
	ZmFilterRule.A_DISCARD,
	ZmFilterRule.A_FOLDER,
	ZmFilterRule.A_TAG,
	ZmFilterRule.A_FLAG,
	ZmFilterRule.A_FORWARD
];

ZmFilterRule._setPreconditions =
function() {
	ZmFilterRule.CONDITIONS[ZmFilterRule.C_COMMUNITY].precondition = ZmSetting.SOCIAL_EXTERNAL_URL;
	ZmFilterRule.ACTIONS[ZmFilterRule.A_FLAG].pOptions[1].precondition = ZmSetting.FLAGGING_ENABLED;
	ZmFilterRule.ACTIONS[ZmFilterRule.A_TAG].precondition = ZmSetting.TAGGING_ENABLED;
	ZmFilterRule.ACTIONS[ZmFilterRule.A_FORWARD].precondition = ZmSetting.FILTERS_MAIL_FORWARDING_ENABLED;
	ZmFilterRule.ACTIONS[ZmFilterRule.A_DISCARD].precondition = ZmSetting.DISCARD_IN_FILTER_ENABLED;
};

/**
 * Returns array of social filter options based on COS settings
 * @return {array} social filter options
 */
ZmFilterRule.getSocialFilters = 
function() {
	var ops = [];
	var socialFilters = appCtxt.get(ZmSetting.SOCIAL_FILTERS_ENABLED);
	if (socialFilters && socialFilters.length) {
		for (var i=0; i<socialFilters.length; i++) {
			if (socialFilters[i].toLowerCase() == ZmFilterRule.C_FACEBOOK.toLowerCase()) {
				ops.push(ZmFilterRule.OP_SOCIAL_FACEBOOK)
			}
			else if (socialFilters[i].toLowerCase() == ZmFilterRule.C_TWITTER.toLowerCase() ) {
				ops.push(ZmFilterRule.OP_SOCIAL_TWITTER);	
			}
			else if (socialFilters[i].toLowerCase() == ZmFilterRule.C_LINKEDIN.toLowerCase()) {
				ops.push(ZmFilterRule.OP_SOCIAL_LINKEDIN);
			}
		}
	}
	return ops;
};

/**
 * Gets the rule condition grouping operator.
 * 
 * @return	{constant}	the operator (see <code>ZmFilterRule.GROUP_</code> constants)
 */
ZmFilterRule.prototype.getGroupOp =
function() {
	return this.conditions.condition;
};

/**
 * Sets the rule condition grouping operator to "any" or "all".
 *
 * @param {constant}	groupOp		the grouping operator (see <code>ZmFilterRule.GROUP_</code> constants)
 */
ZmFilterRule.prototype.setGroupOp =
function(groupOp) {
	this.conditions.condition = groupOp || ZmFilterRule.GROUP_ANY;
};

ZmFilterRule.prototype.addCondition =
function(testType, comparator, value, subjectMod, caseSensitive) {
	//In dialog some tests are options under other tests
	if (testType == ZmFilterRule.TEST_SOCIAL && comparator) {
		testType = ZmFilterRule.OP_SOCIAL_MAP[comparator];
	}
	else if (testType == ZmFilterRule.TEST_COMMUNITY && comparator) {
		testType = ZmFilterRule.OP_COMMUNITY_MAP[comparator];
	}
	else if (testType == ZmFilterRule.TEST_ADDRBOOK && (comparator == ZmFilterRule.OP_IS_ME || comparator == ZmFilterRule.OP_NOT_ME)) {
		testType = ZmFilterRule.TEST_ME;
		value = null;
		comparator = comparator == ZmFilterRule.OP_IS_ME ? ZmFilterRule.OP_IS : ZmFilterRule.OP_NOT_IS;
	}
	else if (testType == ZmFilterRule.TEST_ADDRBOOK && value == "ranking") {
		testType = ZmFilterRule.TEST_RANKING;
		value = null;
	}
	else if (testType == ZmFilterRule.TEST_CONVERSATIONS && value == ZmFilterRule.C_BULK) {
		testType = ZmFilterRule.TEST_BULK;
		value = null;
	}
	else if (testType == ZmFilterRule.TEST_CONVERSATIONS && value == ZmFilterRule.C_LIST) {
		testType = ZmFilterRule.TEST_LIST;
		value = null;
	}
	else if (testType == ZmFilterRule.TEST_CONVERSATIONS && (value == ZmFilterRule.IMPORTANCE_HIGH || value == ZmFilterRule.IMPORTANCE_NORMAL || value == ZmFilterRule.IMPORTANCE_LOW))  {
		testType = ZmFilterRule.TEST_IMPORTANCE;
	}
	else if (testType == ZmFilterRule.TEST_CONVERSATIONS && (value == ZmFilterRule.READ || value == ZmFilterRule.PRIORITY || value == ZmFilterRule.FLAGGED)) {
		testType = ZmFilterRule.TEST_FLAGGED;
	}
	
	if (!this.conditions[testType]) {
		this.conditions[testType] = [];
	}
	
	var cdata = ZmFilterRule.getConditionData(testType, comparator, value, subjectMod, caseSensitive);
	this.conditions[testType].push(cdata);
	return cdata;
};

/**
 * Clears the rule conditions list.
 * 
 */
ZmFilterRule.prototype.clearConditions =
function() {
	this.conditions = {};
};

/**
 * Adds an action to the rule actions list.
 *
 * @param {constant}		actionType	the action type (see <code>ZmFilterRule.A_</code> constants)
 * @param {String}	value		the value for the action
 * 
 */
ZmFilterRule.prototype.addAction =
function(actionType, value) {
	var action = ZmFilterRule.A_VALUE[actionType];
	if (!this.actions[action]) {
		this.actions[action] = [];
	}

	var adata = ZmFilterRule.getActionData(actionType, value);
	this.actions[action].push(adata);
};

/**
 * Clears the rule actions list.
 * 
 */
ZmFilterRule.prototype.clearActions =
function() {
	this.actions = {};
};

/**
 * Checks if the if the rule is enabled.
 * 
 * @return	{Boolean}	<code>true</code> if the rule is enabled
 */
ZmFilterRule.prototype.hasValidAction =
function() {
	for (var i in this.actions) {
		var actionIndex = ZmFilterRule.A_VALUE_MAP[i];
		var actionCfg = ZmFilterRule.ACTIONS[actionIndex];
		if ((actionIndex != ZmFilterRule.A_STOP && (ZmFilterRule.checkPreconditions(actionCfg))) || actionIndex == ZmFilterRule.A_FORWARD) {
			return true;
		}
	}
	return false;
};


// Static methods

ZmFilterRule.getConditionData =
function(testType, comparator, value, subjectMod, caseSensitive) {
	var conditionData = {};

	// add subject modifier
	if (subjectMod &&
		(testType == ZmFilterRule.TEST_HEADER ||
		 testType == ZmFilterRule.TEST_HEADER_EXISTS ||
		 testType == ZmFilterRule.TEST_ADDRBOOK ||
		 testType == ZmFilterRule.TEST_MIME_HEADER ||
		 testType == ZmFilterRule.TEST_ADDRESS ||
		 testType == ZmFilterRule.TEST_ME ||
		 testType == ZmFilterRule.TEST_RANKING))
	{
		conditionData.header = subjectMod;
	}
	
	var part = "all"; //default
	if (testType == ZmFilterRule.TEST_ADDRESS && value && typeof value == "string") {
		var valueArr = value.split(";"); 
		if (valueArr && valueArr.length > 1) {
			value = valueArr[0];
			part = valueArr[1];
		}
	}
	
	// normalize negative operator and add comparator
	var negativeOp;
	switch (comparator) {
		case ZmFilterRule.OP_NOT_IS:		negativeOp = ZmFilterRule.OP_IS; break;
		case ZmFilterRule.OP_NOT_CONTAINS:	negativeOp = ZmFilterRule.OP_CONTAINS; break;
		case ZmFilterRule.OP_NOT_MATCHES:	negativeOp = ZmFilterRule.OP_MATCHES; break;
		case ZmFilterRule.OP_NOT_EXISTS:	negativeOp = ZmFilterRule.OP_EXISTS; break;
		case ZmFilterRule.OP_NOT_UNDER:		negativeOp = ZmFilterRule.OP_UNDER; break;
		case ZmFilterRule.OP_NOT_OVER:		negativeOp = ZmFilterRule.OP_OVER; break;
		case ZmFilterRule.OP_NOT_BEFORE:	negativeOp = ZmFilterRule.OP_BEFORE; break;
		case ZmFilterRule.OP_NOT_AFTER:		negativeOp = ZmFilterRule.OP_AFTER; break;
		case ZmFilterRule.OP_NOT_IN:		negativeOp = ZmFilterRule.OP_IN; break;
        case ZmFilterRule.OP_NOT_REPLIED:   negativeOp = ZmFilterRule.OP_IS_REPLIED; break;
        case ZmFilterRule.OP_NOT_REQUESTED: negativeOp = ZmFilterRule.OP_IS_REQUESTED; break;
        case ZmFilterRule.OP_NOT_READRECEIPT: negativeOp = ZmFilterRule.OP_CONTAINS; break;
		case ZmFilterRule.OP_NOT_CONV:      negativeOp = true; break;
	}
	if (negativeOp) {
		conditionData.negative = "1";
	}
	
	var compType = ZmFilterRule.COMP_TEST_MAP[testType];
	if (compType) {
		conditionData[compType] = ZmFilterRule.OP_VALUE[negativeOp || comparator];
	}

	// add data value
	if (value) {
		switch (testType) {
			case ZmFilterRule.TEST_ADDRBOOK:	conditionData.type = value; break;
			case ZmFilterRule.TEST_SIZE:		conditionData.s = value; break;
			case ZmFilterRule.TEST_DATE:		conditionData.d = value; break;
			case ZmFilterRule.TEST_CONVERSATIONS: conditionData.where = value; break;
			case ZmFilterRule.TEST_IMPORTANCE:  conditionData.imp = value; break;
			case ZmFilterRule.TEST_ADDRESS:     conditionData.part = part;
												conditionData.value= value;
												break;
			case ZmFilterRule.TEST_FLAGGED:     conditionData.flagName = value; break;
			default:							conditionData.value = value; break;
		}
	}

	if (testType == ZmFilterRule.TEST_INVITE) {
	    conditionData.method = [{_content:ZmFilterRule.OP_VALUE[negativeOp || comparator]}];
	}
	if (caseSensitive != null) {
		conditionData.caseSensitive = caseSensitive;
	}

	return conditionData;
};

ZmFilterRule.getActionData =
function(actionType, value) {
	var actionData = {};

	switch (actionType) {
		case ZmFilterRule.A_FOLDER:			actionData.folderPath = value; break;
		case ZmFilterRule.A_FLAG:			actionData.flagName = value; break;
		case ZmFilterRule.A_TAG:			actionData.tagName = value; break;
		case ZmFilterRule.A_FORWARD:		actionData.a = value; break;
	}

	return actionData;
};

ZmFilterRule.getDummyRule =
function() {
	var rule = new ZmFilterRule(null, true, {}, {});
	var subjMod = ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT];
	rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, "", subjMod);
	rule.addAction(ZmFilterRule.A_KEEP);
	return rule;
};

ZmFilterRule.checkPreconditions = function(obj) {

    if (!ZmFilterRule.__preConditionsInitialized) {
        ZmFilterRule.__preConditionsInitialized = true;
        ZmFilterRule._setPreconditions();
    }

	return appCtxt.checkPrecondition(obj && obj.precondition ? obj.precondition : true);
};

/**
 * helper method to get the negative comparator
 *
 * @return	{constant}	the operator (see <code>ZmFilterRule.OP_</code> constants)
 */

ZmFilterRule.getNegativeComparator =
function(comparator) {
    var negativeOp;
    
    switch (comparator) {
		case ZmFilterRule.OP_IS:		negativeOp = ZmFilterRule.OP_NOT_IS; break;
		case ZmFilterRule.OP_CONTAINS:	negativeOp = ZmFilterRule.OP_NOT_CONTAINS; break;
		case ZmFilterRule.OP_MATCHES:	negativeOp = ZmFilterRule.OP_NOT_MATCHES; break;
		case ZmFilterRule.OP_EXISTS:	negativeOp = ZmFilterRule.OP_NOT_EXISTS; break;
		case ZmFilterRule.OP_UNDER:		negativeOp = ZmFilterRule.OP_NOT_UNDER; break;
		case ZmFilterRule.OP_OVER:		negativeOp = ZmFilterRule.OP_NOT_OVER; break;
		case ZmFilterRule.OP_BEFORE:	negativeOp = ZmFilterRule.OP_NOT_BEFORE; break;
		case ZmFilterRule.OP_AFTER:		negativeOp = ZmFilterRule.OP_NOT_AFTER; break;
		case ZmFilterRule.OP_IN:		negativeOp = ZmFilterRule.OP_NOT_IN; break;
        case ZmFilterRule.OP_IS_REPLIED:   negativeOp = ZmFilterRule.OP_NOT_REPLIED; break;
        case ZmFilterRule.OP_IS_REQUESTED: negativeOp = ZmFilterRule.OP_NOT_REQUESTED; break;
        case ZmFilterRule.OP_IS_READRECEIPT: negativeOp = ZmFilterRule.OP_NOT_CONTAINS; break;
	    case ZmFilterRule.OP_CONV_IS:  negativeOp = ZmFilterRule.OP_NOT_CONV; break;
	    case ZmFilterRule.OP_IS_ME:     negativeOp = ZmFilterRule.OP_NOT_ME; break;
	}
    return negativeOp;

};
}
if (AjxPackage.define("zimbraMail.prefs.model.ZmFilterRules")) {
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
 * Creates a filter rules object.
 * @constructor
 * @class
 * This class represents a set of filter rules. The rules are maintained in a {@link AjxVector}
 * and have an order. Each rule is a {@link ZmFilterRule}. Filter rules can be added and
 * edited via a {@link ZmFilterRuleDialog}.
 *
 * @author Conrad Damon
 *
 * @param {String}	accountName		the name of the account this set of filter rules belongs to
 * 
 * @extends		ZmModel
 */
ZmFilterRules = function(accountName, outgoing) {

	ZmModel.call(this, ZmEvent.S_FILTER);

	this._vector = new AjxVector();
	this._ruleIdHash = {};
	this._ruleNameHash = {};
	this._initialized = false;
	this._accountName = accountName;
	this._outgoing = outgoing;
};

ZmFilterRules.prototype = new ZmModel;
ZmFilterRules.prototype.constructor = ZmFilterRules;

ZmFilterRules.prototype.toString =
function() {
	return "ZmFilterRules";
};

/**
 * Adds a rule to the list.
 *
 * @param {ZmFilterRule}	rule			the rule to be added
 * @param {ZmFilterRule}	referenceRule	the rule after which to add the new rule
 * @param {AjxCallback}	callback		the callback
 */
ZmFilterRules.prototype.addRule = 
function(rule, referenceRule, callback) {
	DBG.println(AjxDebug.DBG3, "FILTER RULES: add rule '" + rule.name + "'");
	var index = referenceRule ? this._vector.indexOf(referenceRule) : 0;
	this._insertRule(rule, index);
	this._saveRules(index, true, callback);
};

/**
 * Removes a rule from the list.
 *
 * @param {ZmFilterRule}	rule			the rule to be removed
 */
ZmFilterRules.prototype.removeRule = 
function(rule) {
	if (!rule) { return; }
	DBG.println(AjxDebug.DBG3, "FILTER RULES: remove rule '" + rule.name + "'");
	var index = this.getIndexOfRule(rule);
	this._vector.removeAt(index);
	delete this._ruleIdHash[rule.id];
	delete this._ruleNameHash[rule.name];
	this._deleteMode = true;
    this._saveRules(index, true);
};

/**
 * Moves a rule up in the list. If the rule is the first in the list, it isn't moved.
 *
 * @param {ZmFilterRule}	rule			the rule to be moved
 */
ZmFilterRules.prototype.moveUp = 
function(rule) {
	if (!rule) { return; }
	DBG.println(AjxDebug.DBG3, "FILTER RULES: move up rule '" + rule.name + "'");
	var index = this.getIndexOfRule(rule);
	if (index == 0) { return; }

	var prevRule = this._vector.removeAt(index - 1);
	this._insertRule(prevRule, index);
	this._saveRules(index - 1, true);
};

/**
 * Moves a rule down in the list. If the rule is the last in the list, it isn't moved.
 *
 * @param {ZmFilterRule}	rule			the rule to be moved
 */
ZmFilterRules.prototype.moveDown = 
function(rule) {
	if (!rule) { return; }
	DBG.println(AjxDebug.DBG3, "FILTER RULES: move down rule '" + rule.name + "'");
	var index = this.getIndexOfRule(rule);
	if (index >= (this._vector.size() - 1)) { return; }
	
	var nextRule = this._vector.removeAt(index + 1);
	this._insertRule(nextRule, index);
	this._saveRules(index + 1, true);
};

/**
 * Moves a rule to the bottom of the list.  If the rule is the last in the list, it isn't moved.
 * @param rule  {ZmFilterRule}  rule    the rule to be moved
 * @param skipSave  {boolean}   true to not save
 */
ZmFilterRules.prototype.moveToBottom = 
function(rule, skipSave) {
	if (!rule) { return; }
	var index = this.getIndexOfRule(rule);
	if (index >= (this._vector.size() - 1)) { return; }
	
	while (index < this._vector.size() -1) {
		var nextRule = this._vector.removeAt(index+1);
		this._insertRule(nextRule, index);
		index++;
	}
	if (!skipSave) {
		this._saveRules(index, true);
	}
};

/**
 * Marks a rule as active/inactive.
 *
 * @param {ZmFilterRule}	rule			the rule to mark active/inactive
 * @param {Boolean}	active			if <code>true</code>, the rule is marked active
 */
ZmFilterRules.prototype.setActive =
function(rule, active) {
	if (!rule) { return; }
	DBG.println(AjxDebug.DBG3, "FILTER RULES: set active rule '" + rule.name + "', " + active);
	rule.active = active;
	this._saveRules(null, false);
};

// utility methods

/**
 * Gets the number of rules in the list.
 * 
 * @return	{int}		the number of rules
 */
ZmFilterRules.prototype.getNumberOfRules = 
function() {
	return this._vector.size();
};

/**
 * Gets the active rules in the list.
 * 
 * @return	{AjxVector}		the active rules
 */
ZmFilterRules.prototype.getActiveRules = 
function() {
	return this._vector.sub(function(rule){return !rule.active});
};

/**
 * Gets the numeric index of the rule in the list.
 *
 * @param {ZmFilterRule}	rule	a rule
 * @return	{int}	the index
 */
ZmFilterRules.prototype.getIndexOfRule = 
function(rule) {
	return this._vector.indexOf(rule);
};

/**
 * Gets a rule based on its index.
 *
 * @param {int}		index		the index
 * @return	{ZmFilterRule}	the rule
 */
ZmFilterRules.prototype.getRuleByIndex = 
function(index) {
    return this._vector.get(index);
};

/**
 * Gets a rule based on its ID.
 *
 * @param {String}	id		the rule ID
 * @return	{ZmFilterRule}	the rule
 */
ZmFilterRules.prototype.getRuleById = 
function(id) {
	return this._ruleIdHash[id];
};

/**
 * Gets a rule by name.
 *
 * @param {String}	name	the rule name
 * @return	{ZmFilterRule}	the rule
 */
ZmFilterRules.prototype.getRuleByName = 
function(name) {
	return this._ruleNameHash[name];
};

ZmFilterRules.prototype.getOutgoing = 
function(name) {
	return this._outgoing
};

/**
 * Loads the rules from the server.
 *
 * @param {Boolean}	force			if <code>true</code>, get rules from server
 * @param {AjxCallback}	callback		the callback
 */
ZmFilterRules.prototype.loadRules = 
function(force, callback) {
	// return cache?
	if (this._initialized && !force) {
		if (callback) {
			callback.run(new ZmCsfeResult(this._vector));
			return;
		}
		return this._vector;
	}

	// fetch from server:
	DBG.println(AjxDebug.DBG3, "FILTER RULES: load rules");
	var params = {
		soapDoc: AjxSoapDoc.create(this._outgoing ? "GetOutgoingFilterRulesRequest" : "GetFilterRulesRequest", "urn:zimbraMail"),
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleResponseLoadRules, [callback])),
		accountName:this._accountName
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmFilterRules.prototype._handleResponseLoadRules =
function(callback, result) {
	this._vector.removeAll();
	this._ruleIdHash = {};
	this._ruleNameHash = {};

	var r = result.getResponse();
	var resp = this._outgoing ? r.GetOutgoingFilterRulesResponse : r.GetFilterRulesResponse;
	var children = resp.filterRules[0].filterRule;
	if (children) {
		for (var i = 0; i < children.length; i++) {
			var ruleNode = children[i];
			var rule = new ZmFilterRule(ruleNode.name, ruleNode.active, ruleNode.filterActions[0], ruleNode.filterTests[0]);
			this._insertRule(rule);
		}
	}

	this._initialized = true;

	if (callback) {
		result.set(this._vector);
		callback.run(result);
	} else {
		return this._vector;
	}
};

/**
 * Public method to save the rules to the server.
 *
 * @param {int}	index			the index of rule to select in list after save
 * @param {Boolean}	notify			if <code>true</code>, notify listeners of change event
 * @param {AjxCallback}	callback		the callback
 * 
 * @public
 */
ZmFilterRules.prototype.saveRules = 
function(index, notify, callback) {
	this._saveRules(index, notify, callback);	
};

/**
 * Saves the rules to the server.
 *
 * @param {int}	index			the index of rule to select in list after save
 * @param {Boolean}	notify			if <code>true</code>, notify listeners of change event
 * @param {AjxCallback}	callback		the callback
 * 
 * @private
 */
ZmFilterRules.prototype._saveRules = 
function(index, notify, callback) {
	var requestKey = this._outgoing ? "ModifyOutgoingFilterRulesRequest" : "ModifyFilterRulesRequest";
	var jsonObj = {};
	jsonObj[requestKey] = {_jsns:"urn:zimbraMail"};

	var request = jsonObj[requestKey];

	var rules = this._vector.getArray();
	if (rules.length > 0) {
		request.filterRules = [{filterRule:[]}];
		var filterRuleObj = request.filterRules[0].filterRule;

		for (var i = 0; i < rules.length; i++) {
			var r = rules[i];
			var ruleObj = {
				active: r.active,
				name: r.name,
				filterActions: [],
				filterTests: []
			};
			ruleObj.filterActions.push(r.actions);
			ruleObj.filterTests.push(r.conditions);
			filterRuleObj.push(ruleObj);
		}
	} else {
		request.filterRules = {};
	}

	var params = {
		jsonObj: jsonObj,
		asyncMode: true,
		callback: (new AjxCallback(this, this._handleResponseSaveRules, [index, notify, callback])),
		errorCallback: (new AjxCallback(this, this._handleErrorSaveRules)),
		accountName: this._accountName
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmFilterRules.prototype._handleResponseSaveRules =
function(index, notify, callback, result) {
	if (notify) {
		this._notify(ZmEvent.E_MODIFY, {index: index});
	}

    if(this._deleteMode){
        appCtxt.setStatusMsg(ZmMsg.filtersDeleted);
        this._deleteMode = false;
    }

    else if(appCtxt.getFilterRuleDialog().isEditMode()){
	    appCtxt.setStatusMsg(ZmMsg.filtersEdited);
    }
    else{
        appCtxt.setStatusMsg(ZmMsg.filtersSaved);
    }

	if (callback) {
		callback.run(result);
	}
};

/**
 * The save failed. Show an error dialog.
 * @param {AjxException}	ex		the exception
 * 
 * @private
 */
ZmFilterRules.prototype._handleErrorSaveRules =
function(ex) {
	if (ex.code == ZmCsfeException.SVC_PARSE_ERROR ||
		ex.code == ZmCsfeException.SVC_INVALID_REQUEST ||
		ex.code == ZmCsfeException.MAIL_NO_SUCH_FOLDER ||
		ex.code == ZmCsfeException.MAIL_NO_SUCH_TAG)
	{
		var msgDialog = appCtxt.getMsgDialog();

		var msg = '';
		switch(ex.code) {
			case ZmCsfeException.MAIL_NO_SUCH_FOLDER:
				msg = ZmMsg.errorNoSuchFolder;
				break;
			case ZmCsfeException.MAIL_NO_SUCH_TAG:
				msg = ZmMsg.errorNoSuchTag;
				break;
			default:
				msg = [ZmMsg.filterError, " ", AjxStringUtil.htmlEncode(ex.msg)].join("");
		}

		msgDialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
		msgDialog.popup();

		//only reload rules if the filter rule dialog is not popped up or if a new rule is being added
		//get index for refreshing list view
		if (!appCtxt.getFilterRuleDialog() || !appCtxt.getFilterRuleDialog().isPoppedUp() || !appCtxt.getFilterRuleDialog().isEditMode()) {
			var filterRulesController = ZmPreferencesApp.getFilterRulesController(this._outgoing);
			var sel = filterRulesController.getListView() ? filterRulesController.getListView().getSelection()[0] : null;
			var index = sel ? this.getIndexOfRule(sel) - 1: null;   //new filter is inserted into vector, subtract 1 to get the selected index
			var respCallback = new AjxCallback(this, this._handleResponseHandleErrorSaveRules, [index]);
			this.loadRules(true, respCallback);
		}
		return true;
	}
	return false;
};

// XXX: the caller should probably be the one doing this
ZmFilterRules.prototype._handleResponseHandleErrorSaveRules =
function(index) {
	var prefController = AjxDispatcher.run("GetPrefController");
	var prefsView = prefController.getPrefsView();
	var section = ZmPref.getPrefSectionWithPref(ZmSetting.FILTERS);
	if (section && prefsView && prefsView.getView(section.id)) {
        var filterRulesController = ZmPreferencesApp.getFilterRulesController(this._outgoing);
		filterRulesController.resetListView(index);
	}
};

/**
 * Inserts a rule into the internal vector. Adds to the end if no index is given.
 *
 * @param {ZmFilterRule}	rule		the rule to insert
 * @param {int}	index		the index at which to insert
 * 
 * @private
 */
ZmFilterRules.prototype._insertRule = 
function(rule, index) {
	this._vector.add(rule, index);
	this._ruleIdHash[rule.id] = rule;
	this._ruleNameHash[rule.name] = rule;
};

/**
 * Public method to insert rule into internval vectors.  Adds to the end if no index is given.
 * 
 * @param {ZmFilterRule}	rule		the rule to insert
 * @param {int}	index		the index at which to insert
 * 
 * @public
 */
ZmFilterRules.prototype.insertRule =
function(rule, index) {
	this._insertRule(rule, index);	
};
}
if (AjxPackage.define("zimbraMail.prefs.model.ZmLocale")) {
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
 * Default constructor.
 * @class
 * This class represents a locale.
 * 
 * @param	{String}	id		the id
 * @param	{String}	name	the name
 * @param	{String}	image	the image
 * @param	{String}	localName	the name in user's locale
 *
 * @see		ZmLocale.create
 */
ZmLocale = function(id, name, image, localName) {
	this.id = id;
	this.name = name;
	this.localName = localName;
	this._image = image;
};

//List of RTL supporting languages
ZmLocale.RTLLANGUAGES = {
    ar:"Arabic",
    iw:"Hebrew"
};

ZmLocale.localeMap = {};
ZmLocale.languageMap = {};

/**
 * Creates the locale.
 * 
 * @param	{String}	id		the locale id (for example, <code>en_US</code>)
 * @param	{String}	name	the locale name
 * @param	{String}	localName	the name in user's locale
 */
ZmLocale.create =
function(id, name, localName) {
	var index = id.indexOf("_");
	var languageId;
	var country = null;
	if (index == -1) {
		languageId = id;
	}
	else {
		languageId = id.substr(0, index);
		country = id.substring(id.length - 2);
	}

	var languageObj = ZmLocale.languageMap[languageId];
	if (!languageObj) {
		languageObj = new ZmLocale(languageId, name, null, localName);
		ZmLocale.languageMap[languageId] = languageObj;
		ZmLocale.localeMap[id] = languageObj;
	}
	if (country) {
		var localeObj = new ZmLocale(id, name, null, localName);
		languageObj._add(localeObj);
		ZmLocale.localeMap[id] = localeObj;
		return localeObj;
	}
	else {
		languageObj.name = name;
		return languageObj;
	}
};

/**
 * Checks if there are more than one selectable locale.
 * 
 * @return	{Boolean}	<code>true</code> if there are more than one selectable locale
 */
ZmLocale.hasChoices =
function() {
	var count = 0;
	for (var id in ZmLocale.localeMap) {
		var locale = ZmLocale.localeMap[id]; 
		if (!locale.locales) {
			count++;
		}
		if (count >= 2) {
			return true;
		}
	}
	return false;
};

/**
 * Gets the image.
 * 
 * @return	{String}	the image
 */
ZmLocale.prototype.getImage =
function() {
	return this._image;
};

/**
 * Gets the name in both the locale itself, and in the local (user) locale. 
 *
 * @return	{String}	the name
 */
ZmLocale.prototype.getNativeAndLocalName =
function() {
	if (this.name == this.localName) {
		/* don't show both if they are the same - it looks extremely funny */
		return this.name;
	}
	return [this.localName, " - ", this.name].join("");
};

ZmLocale.prototype._add =
function(locale) {
	(this.locales = this.locales || []).push(locale);
};

ZmLocale.prototype._getLanguageImage =
function() {
	switch (this.id) {
		// Arabic was omitted from this list...not sure what country to use.
		case "sq": return "FlagAL"; // Albanian -> Albania
		case "be": return "FlagBY"; // Belarusian -> Belarus
		case "bg": return "FlagBG"; // Bulgarian -> Bulgaria
		case "ca": return "FlagES"; // Catalan -> Spain
		case "zh": return "FlagCN"; // Chinese -> China
		case "hr": return "FlagHR"; // Croatian -> Croatia
		case "cs": return "FlagCZ"; // Czech -> Czech Republic
		case "da": return "FlagDK"; // Danish -> Denmark
		case "nl": return "FlagNL"; // Dutch -> Netherlands
		case "en": return "FlagUS"; // English -> USA
		case "et": return "FlagEE"; // Estonian -> Estonia
		case "fi": return "FlagFI"; // Finnish -> Finland
		case "fr": return "FlagFR"; // French -> France
		case "de": return "FlagDE"; // German -> Germany
		case "el": return "FlagGR"; // Greek -> Greece
		case "iw": return "FlagIL"; // Hebrew -> Israel
		case "hi": return "FlagIN"; // Hindi -> India
		case "hu": return "FlagHU"; // Hungarian -> Hungary
		case "id": return "FlagID"; // Indonesian -> Indonesia
		case "is": return "FlagIS"; // Icelandic -> Iceland
		case "it": return "FlagIT"; // Italian -> Italy
		case "ja": return "FlagJP"; // Japanese -> Japan
		case "ko": return "FlagKR"; // Korean -> South Korea
		case "lv": return "FlagLV"; // Latvian -> Latvia
		case "lt": return "FlagLT"; // Lithuanian -> Lithuania
		case "mk": return "FlagMK"; // Macedonian -> Macedonia
		case "no": return "FlagNO"; // Norwegian -> Norway
		case "pl": return "FlagPL"; // Polish -> Poland
		case "pt": return "FlagPT"; // Portugese -> Portugal
		case "ro": return "FlagRO"; // Romanian -> Romania
		case "ru": return "FlagRU"; // Russian -> Russia
		case "sk": return "FlagSK"; // Slovak -> Slovakia
		case "sl": return "FlagSI"; // Slovenian -> Slovenia
		case "es": return "FlagES"; // Spanish -> Spain
		case "sv": return "FlagSE"; // Swedish -> Sweden
		case "th": return "FlagTH"; // Thai -> Thailand
		case "tr": return "FlagTR"; // Turkish -> Turkey
		case "uk": return "FlagUA"; // Ukrainian -> Ukraine
		case "vi": return "FlagVN"; // Vietnamese -> Vietnam
		default: return "FlagNone";
	}
};
}
if (AjxPackage.define("zimbraMail.prefs.model.ZmMobileDevice")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an empty mobile device object.
 * @constructor
 * @class
 * This class represents  mobile device.
 * 
 * @author Parag Shah
 *
 * @param	{Hash}		params		a hash of parameters
 * @param	{Date}		params.lastPolicyUpdate		the last policy update time
 * @param	{Date}		params.firstReqReceived		the first request received time
 * @param	{Date}		params.remoteWipeAckTime		the remote wipe acknowledged time
 * @param	{Date}		params.remoteWipeReqTime		the remote wipe requested time
 * @param	{constant}	params.status			the status (see <code>ZmMobileDevice.STATUS_</code>)
 */
ZmMobileDevice = function(params) {
	this.lastPolicyUpdate = params.lastPolicyUpdate;
	this.firstReqReceived = params.firstReqReceived;
	this.remoteWipeAckTime = params.remoteWipeAckTime;
	this.remoteWipeReqTime = params.remoteWipeReqTime;
	this.status = params.status;
	this.provisionable = params.provisionable;
	this.protocol = params.protocol;
	this.ua = params.ua;
	this.type = params.type;
	this.id = params.id;
};

ZmOAuthConsumerApp = function(params) {
    this.accessToken = params.accessToken ;
    this.appName = params.appName;
    this.approvedOn = params.approvedOn;
    this.device = params.device;
};


// Consts

/**
 * Defines the "need provision" status.
 */
ZmMobileDevice.STATUS_NEED_PROVISION		= 0;
/**
 * Defines the "OK" status.
 */
ZmMobileDevice.STATUS_OK					= 1;
/**
 * Defines the "suspended" status.
 */
ZmMobileDevice.STATUS_SUSPENDED				= 2;
/**
 * Defines the "remote wipe requested" status.
 */
ZmMobileDevice.STATUS_REMOTE_WIPE_REQUESTED	= 3;
/**
 * Defines the "remote wipe complete" status.
 */
ZmMobileDevice.STATUS_REMOTE_WIPE_COMPLETE	= 4;
/**
 * Defines the "OAuth Consumer App" status.
 */
ZmMobileDevice.TYPE_OAUTH = 'oauth';


// Public methods

ZmMobileDevice.prototype.toString =
function() {
	return "ZmMobileDevice";
};

/**
 * Gets the status.
 * 
 * @return	{constant}	the status (see <code>ZmMobileDevice.STATUS_</code> constants)
 */
ZmMobileDevice.prototype.getStatus =
function() {
	return (!this.provisionable && this.status == ZmMobileDevice.STATUS_NEED_PROVISION)
		? ZmMobileDevice.STATUS_OK : this.status;
};

/**
 * Gets the status string.
 * 
 * @return	{String}	the status string
 */
ZmMobileDevice.prototype.getStatusString =
function() {
	var status = this.getStatus();

	switch (status) {
		case ZmMobileDevice.STATUS_NEED_PROVISION:			return ZmMsg.mobileStatusNeedProvision;
		case ZmMobileDevice.STATUS_OK:						return ZmMsg.mobileStatusOk;
		case ZmMobileDevice.STATUS_SUSPENDED:				return ZmMsg.mobileStatusSuspended;
		case ZmMobileDevice.STATUS_REMOTE_WIPE_REQUESTED:	return ZmMsg.mobileStatusWipe;
		case ZmMobileDevice.STATUS_REMOTE_WIPE_COMPLETE:	return ZmMsg.mobileStatusWipeComplete;
	}
	return "";
};

/**
 * Gets the last policy update time as a string.
 * 
 * @return	{String}	the last policy update string
 */
ZmMobileDevice.prototype.getLastPolicyUpdateString =
function() {
	return this.lastPolicyUpdate ? AjxDateUtil.computeDateTimeString(new Date(this.lastPolicyUpdate*1000)) : "";
};

/**
 * Gets the first request received time as a string.
 * 
 * @return	{String}	the first request received string
 */
ZmMobileDevice.prototype.getFirstReqReceivedString =
function() {
	return this.firstReqReceived ? AjxDateUtil.computeDateTimeString(new Date(this.firstReqReceived*1000)) : "";
};

/**
 * Gets the remote wipe acknowledged time as a string.
 * 
 * @return	{String}	the remote wipe acknowledged string
 */
ZmMobileDevice.prototype.getRemoteWipeAckTimeString =
function() {
	return this.remoteWipeAckTime ? AjxDateUtil.computeDateTimeString(new Date(this.remoteWipeAckTime*1000)) : "";
};

/**
 * Gets the remote wipe requested time as a string.
 * 
 * @return	{String}	the remote wipe requested string
 */
ZmMobileDevice.prototype.getRemoteWipeReqTimeString =
function() {
	return this.remoteWipeReqTime ? AjxDateUtil.computeDateTimeString(new Date(this.remoteWipeReqTime*1000)) : "";
};

ZmMobileDevice.prototype.doAction =
function(id, callback) {
	var request;
	switch (id) {
		case ZmOperation.MOBILE_REMOVE: 		request = "RemoveDeviceRequest"; break;
		case ZmOperation.MOBILE_RESUME_SYNC:	request = "ResumeDeviceRequest"; break;
		case ZmOperation.MOBILE_SUSPEND_SYNC:	request = "SuspendDeviceRequest"; break;
		case ZmOperation.MOBILE_WIPE:			request = "RemoteWipeRequest"; break;
		case ZmOperation.MOBILE_CANCEL_WIPE:	request = "CancelPendingRemoteWipeRequest"; break;
	}

	if (request) {
		var soapDoc = AjxSoapDoc.create(request, "urn:zimbraSync");
		var node = soapDoc.set("device");
		node.setAttribute("id", this.id);

		var respCallback = new AjxCallback(this, this._handleDoAction, callback);
		appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true, callback:respCallback});
	}
};

ZmMobileDevice.prototype._handleDoAction =
function(callback, results) {
	var resp = results.getResponse();
	for (var i in resp) {
		var device = resp[i].device && resp[i].device[0];
		if (device && device.id == this.id) {
			this.status = device.status;
			if (device.lastPolicyUpdate) {
				this.lastPolicyUpdate = device.lastPolicyUpdate;
			}
			if (device.firstReqReceived) {
				this.firstReqReceived = device.firstReqReceived;
			}
			if (device.remoteWipeAckTime) {
				this.remoteWipeAckTime = device.remoteWipeAckTime;
			}
			if (device.remoteWipeReqTime) {
				this.remoteWipeReqTime = device.remoteWipeReqTime;
			}
		}
	}

	if (callback) {
		callback.run();
	}
};
}

if (AjxPackage.define("zimbraMail.mail.model.ZmIdentity")) {
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
 * Creates an identity.
 * @class
 * This class represents an identity.
 * 
 * @param	{String}	name		the identity name
 * 
 */
ZmIdentity = function(name) {

	this.reset();
	this.name = name;
	this.id = "";
};

ZmIdentity.prototype.toString =
function() {
	return "ZmIdentity";
};


// Constants

ZmIdentity.COMPOSE_SAME				= "same";
ZmIdentity.COMPOSE_TEXT 			= "text";
ZmIdentity.COMPOSE_HTML 			= "html";
ZmIdentity.DEFAULT_NAME 			= "DEFAULT";


ZmIdentity.FIELDS	= {};
ZmIdentity._SOAP	= {};

ZmIdentity.SIG_ID_NONE = "11111111-1111-1111-1111-111111111111";

// Static inititialization

ZmIdentity.addField =
function(id, params) {

	ZmIdentity[id] = id;
	ZmIdentity.FIELDS[id] = params;
	ZmIdentity._SOAP[params.soap] = params;
};

// Identity fields. The "name" parameter is used to set a property on this object.

ZmIdentity.addField("NAME",						{ name: "name", soap: "zimbraPrefIdentityName", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_DISPLAY",		{ name: "sendFromDisplay", soap: "zimbraPrefFromDisplay", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_ADDRESS",		{ name: "sendFromAddress", soap: "zimbraPrefFromAddress", type: ZmSetting.D_STRING });
ZmIdentity.addField("SEND_FROM_ADDRESS_TYPE",	{ name: "sendFromAddressType", soap: "zimbraPrefFromAddressType", type: ZmSetting.D_STRING });
ZmIdentity.addField("SET_REPLY_TO",				{ name: "setReplyTo", soap: "zimbraPrefReplyToEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("SET_REPLY_TO_DISPLAY",		{ name: "setReplyToDisplay", soap: "zimbraPrefReplyToDisplay", type: ZmSetting.D_STRING });
ZmIdentity.addField("SET_REPLY_TO_ADDRESS",		{ name: "setReplyToAddress", soap: "zimbraPrefReplyToAddress", type: ZmSetting.D_STRING });
ZmIdentity.addField("SIGNATURE",				{ name: "signature", soap: "zimbraPrefDefaultSignatureId", type: ZmSetting.D_STRING });
ZmIdentity.addField("REPLY_SIGNATURE",			{ name: "replySignature", soap: "zimbraPrefForwardReplySignatureId", type: ZmSetting.D_STRING });

// Used only for Persona
ZmIdentity.addField("USE_WHEN_SENT_TO",			{ name: "useWhenSentTo", soap: "zimbraPrefWhenSentToEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("WHEN_SENT_TO_ADDRESSES",	{ name: "whenSentToAddresses", soap: "zimbraPrefWhenSentToAddresses", type: ZmSetting.D_LIST });
ZmIdentity.addField("USE_WHEN_IN_FOLDER",		{ name: "useWhenInFolder", soap: "zimbraPrefWhenInFoldersEnabled", type: ZmSetting.D_BOOLEAN });
ZmIdentity.addField("WHEN_IN_FOLDERIDS",		{ name: "whenInFolderIds", soap: "zimbraPrefWhenInFolderIds", type: ZmSetting.D_LIST });


// Public methods

/**
 * Gets the field.
 * 
 * @param	{constant}	fieldId		the id
 * @return	{Object}	the value
 */
ZmIdentity.prototype.getField =
function(fieldId) {
	return this[ZmIdentity.FIELDS[fieldId].name];
};

/**
 * Sets the field.
 * 
 * @param	{constant}	fieldId		the id
 * @param	{Object}	value		the value
 */
ZmIdentity.prototype.setField =
function(fieldId, value) {
	this[ZmIdentity.FIELDS[fieldId].name] = value;
};

/**
 * Creates the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.create =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Create", this._handleCreateResponse, callback, errorCallback, batchCmd);
};

/**
 * Saves the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.save =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Modify", this._handleSaveResponse, callback, errorCallback, batchCmd);
};

/**
 * Deletes the identity.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmIdentity.prototype.doDelete =
function(callback, errorCallback, batchCmd) {
	return this._doRequest("Delete", this._handleDeleteResponse, callback, errorCallback, batchCmd);
};

/**
 * Clears this identity's fields.
 */
ZmIdentity.prototype.reset =
function() {
	for (var field in ZmIdentity.FIELDS) {
		var props = ZmIdentity.FIELDS[field];
		switch (props.type) {
			case ZmSetting.D_STRING:	this[props.name] = "";		break;
			case ZmSetting.D_BOOLEAN:	this[props.name] = false;	break;
			case ZmSetting.D_LIST:		this[props.name] = [];		break;
		}
	}
};

// Protected methods

ZmIdentity.prototype._doRequest =
function(requestType, respFunction, callback, errorCallback, batchCmd) {

	var soapDoc = AjxSoapDoc.create(requestType + "IdentityRequest", "urn:zimbraAccount");
	var identityNode = soapDoc.set("identity");

	var name = this.isDefault ? ZmIdentity.DEFAULT_NAME : this.name;
	if (requestType != "Create" && this.id !== "") {
		identityNode.setAttribute("id", this.id);
	}
	else {
		identityNode.setAttribute("name", this.name);
	}
	if (requestType != "Delete") {
		for (var i in ZmIdentity.FIELDS) {
			var field = ZmIdentity.FIELDS[i];
			if (this.hasOwnProperty(field.name)) {
				var value = this.getField(i);
				if (field.type == ZmSetting.D_LIST) {
					for (var j = 0, count = value.length; j < count; j++) {
						if (value[j]) {
							var propertyNode = soapDoc.set("a", value[j], identityNode);
							propertyNode.setAttribute("name", field.soap);
						}
					}
				} else {
					if (field.type == ZmSetting.D_BOOLEAN) {
						value = value ? "TRUE" : "FALSE";
					}
					var isSignature = (i == ZmIdentity.SIGNATURE || i == ZmIdentity.REPLY_SIGNATURE);
					var isDisplayName = (i == ZmIdentity.SEND_FROM_DISPLAY || i == ZmIdentity.SET_REPLY_TO_DISPLAY);
					var isEmailAddress = (i == ZmIdentity.SET_REPLY_TO_ADDRESS);
					if (value || isSignature || isDisplayName || isEmailAddress) {
						var propertyNode = soapDoc.set("a", value, identityNode);
						propertyNode.setAttribute("name", field.soap);
					}
				}
			}
		}
	}

	var respCallback = new AjxCallback(this, respFunction, [callback]);
	if (batchCmd) {
		batchCmd.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};

	return appCtxt.getAppController().sendRequest(params);
};

ZmIdentity.prototype._loadFromDom =
function(data) {

	this.id = data.id;

    var props = data._attrs;
	if (props) {
		for (var i in props) {
			var field = ZmIdentity._SOAP[i];
			if (field) {
				var value = props[i];
				if (field.type == ZmSetting.D_BOOLEAN) {
					this[field.name] = (value.toString().toUpperCase() == "TRUE");
				}
				else if (field.type == ZmSetting.D_LIST) {
					this[field.name] = AjxUtil.isArray(value) ? value : [value];
				}
				else {
					this[field.name] = value;
				}
			}
		}
	}

    if (data.name) {
		if (data.name == ZmIdentity.DEFAULT_NAME) {
			this.isDefault = true;
        }
	}
};

ZmIdentity.prototype._handleCreateResponse =
function(callback, result, response) {

	this.id = response.identity[0].id;
	delete this._new;
	delete this._dirty;

	var collection = appCtxt.getIdentityCollection();
	collection.add(this);
	collection._notify(ZmEvent.E_CREATE, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};

ZmIdentity.prototype._handleSaveResponse =
function(callback, result, response) {

	delete this._dirty;

	var collection = appCtxt.getIdentityCollection();
	collection.remove(this);
	collection.add(this);
	collection._notify(ZmEvent.E_MODIFY, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};

ZmIdentity.prototype._handleDeleteResponse =
function(callback, result, response) {

	var collection = appCtxt.getIdentityCollection();
	collection.remove(this);
	collection._notify(ZmEvent.E_DELETE, { item: this } );

	if (callback) {
		callback.run(this, result);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmIdentityCollection")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2007, 2008, 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the identity collection.
 * @class
 * This class represents the identity collection
 * 
 * @extends		ZmModel
 */
ZmIdentityCollection = function() {
	ZmModel.call(this, ZmEvent.S_IDENTITY);
	this.defaultIdentity = null;
	this._initialized = false;
	this._idToIdentity = {};
	this._addressToIdentity = {};
	this._folderToIdentity = {};
	this._size = 0;
};

ZmIdentityCollection.prototype = new ZmModel;
ZmIdentityCollection.prototype.constructor = ZmIdentityCollection;

ZmIdentityCollection.prototype.toString =
function() {
	return "ZmIdentityCollection";
};

//
// Public methods
//

/**
 * Gets the count of identities.
 * 
 * @return	{int}		the size
 */
ZmIdentityCollection.prototype.getSize =
function() {
	// bug: 30009
	return this.getIdentities().length;
};

/**
 * Gets the identities.
 * 
 * @param	{Object}	sort		(not used)
 * @return	{Array}		an array of {ZmIdentity} objects
 */
ZmIdentityCollection.prototype.getIdentities =
function(sort) {
	var identity, i = 0, result = [], isOffline = appCtxt.isOffline;
	for (var id in this._idToIdentity) {
		identity = this._idToIdentity[id];
		// bug: 30009
		if (isOffline && identity.isFromDataSource) continue;
		result[i++] = identity;
	}
	if (sort) {
		result.sort(ZmIdentityCollection._comparator);
	}
	return result;
};

/**
 * Gets the identity by id.
 * 
 * @param	{String}	id	the identity id
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype.getById =
function(id) {
	return this._idToIdentity[id];
};

/**
 * Gets the identity by name.
 * 
 * @param	{String}	name		the identity name
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype.getByName =
function(name) {
	name = name.toLowerCase();
	for (var id in this._idToIdentity) {
		var identity = this._idToIdentity[id];
		if (identity.name.toLowerCase() == name) {
			return identity;
		}
	}
	return null;
};

/**
 * Adds the identity to the collection.
 * 
 * @param	{ZmIdentity}	identity		the identity
 */
ZmIdentityCollection.prototype.add =
function(identity) {
	if (!this._idToIdentity[identity.id]) {
		this._idToIdentity[identity.id] = identity;
		if (identity.isDefault) {
			this.defaultIdentity = identity;
		}

		this._addToMaps(identity);
		this._size++;
	}
};

/**
 * Removes the identity from the collection.
 * 
 * @param	{ZmIdentity}	identity		the identity
 */
ZmIdentityCollection.prototype.remove =
function(identity) {
	if (this._idToIdentity[identity.id]) {
		this._removeFromMaps(identity);
		delete this._idToIdentity[identity.id];
		this._size--;
	}
};
/**
 * try to find the persona to use from the rules defined in the accounts settings. Recurse to parent so to apply rules to sub-folders too.
 * @param folderId
 * @returns {*}
 */
ZmIdentityCollection.prototype.selectIdentityFromFolder =
function(folderId) {
	if (!folderId) {
		return this.defaultIdentity;
	}
	var folder = appCtxt.getById(folderId);
	var parent = folder.parent;
	return this._folderToIdentity[folder.getRemoteId()] || this.selectIdentityFromFolder(parent && parent.id);
};

ZmIdentityCollection.prototype.selectIdentity =
function(mailMsg, type) {
	if (!appCtxt.get(ZmSetting.IDENTITIES_ENABLED) || !mailMsg) {
		return this.defaultIdentity;
	}

	// Check if the a identity's address was in the given type field.
	if (type) {
		return this._selectIdentityFromAddresses(mailMsg, type);
	}

	// Check if the a identity's address was in the to field.
	var identity = this._selectIdentityFromAddresses(mailMsg, AjxEmailAddress.TO);
	if (identity) { return identity; }

	// Check if the a identity's address was in the cc field.
	identity = this._selectIdentityFromAddresses(mailMsg, AjxEmailAddress.CC);
	if (identity) { return identity; }

    //Check if a identity's address was in the attendees list
    if(mailMsg.isInvite()) {
        identity = this._selectIdentityFromAttendees(mailMsg);
        if (identity) { return identity; }
    }

	// Check if a identity's folder is the same as where the message lives.
	return this.selectIdentityFromFolder(mailMsg.folderId);
};

ZmIdentityCollection.prototype.initialize =
function(data) {
	// This can be called unnecessarily after auth token expires.
	if (this._initialized || this.getSize() || !data) { return; }

	var identities = data.identity;
	for (var i = 0, count = identities ? identities.length : 0; i < count; i++) {
		var identity = new ZmIdentity('');
		identity._loadFromDom(identities[i]);
		this.add(identity);
	}
	this._initialized = true;
};

//
// Protected methods
//

ZmIdentityCollection.prototype._addToMaps =
function(identity) {
	if (identity.useWhenSentTo) {
		var addresses = identity.whenSentToAddresses;
		for (var i = 0, count = addresses.length; i < count; i++) {
			var address = addresses[i].toLowerCase();
			// External emails are added after other identities, potentially overwriting a persona which should have
			// precedence.  Use the external identity only if the email address has not been assigned an identity.
			if (!this._addressToIdentity[address] || !identity.isFromDataSource) {
				this._addressToIdentity[address] = identity;
			}
		}
	}

	if (identity.useWhenInFolder) {
		var folders = identity.whenInFolderIds;
		for (var i = 0, count = folders.length; i < count; i++) {
			var folder = appCtxt.getById(folders[i]);
			if (folder) {
				var fid = folder.getRemoteId();
				this._folderToIdentity[fid] = identity;
			}
		}
	}
};

ZmIdentityCollection.prototype._removeFromMaps =
function(identity) {
	for (var i = 0, count = identity.whenSentToAddresses.length; i < count; i++) {
		var address = identity.whenSentToAddresses[i];
		delete this._addressToIdentity[address];
	}

	for (var i = 0, count = identity.whenInFolderIds.length; i < count; i++) {
		var folder = appCtxt.getById(identity.whenInFolderIds[i]);
		if (folder) {
			var fid = folder.getRemoteId();
			delete this._folderToIdentity[fid];
		}
	}
};

ZmIdentityCollection._comparator =
function(a, b) {
	if (a.isDefault) {
		return -1;
	} else if (b.isDefault) {
		return 1;
	} else {
		return a.name == b.name ? 0 : a.name < b.name ? -1 : 1;
	}
};

ZmIdentityCollection.prototype.getSortIndex =
function(identity) {

	var identities = this.getIdentities(true);
	if (!(identities && identities.length)) { return 0; }

	if (this.getById(identity.id)) {
		// already have the identity, find its current position
		for (var i = 0; i < identities.length; i++) {
			if (identities[i].id == identity.id) {
				return i;
			}
		}
	} else {
		// hasn't been added yet, find where it should go
		for (var i = 0; i < identities.length; i++) {
			var test = ZmIdentityCollection._comparator(identity, identities[i]);
			if (test == -1) {
				return i;
			}
		}
	}
	return identities.length - 1;
};

ZmIdentityCollection.prototype._selectIdentityFromAddresses =
function(mailMsg, type) {
	var identity;
	var addresses = mailMsg.getAddresses(type).getArray();
	for (var i = 0, count = addresses.length; i < count; i++) {
		var address = addresses[i].getAddress();
		if (address) {
			identity = this._addressToIdentity[address.toLowerCase()];
			if(identity) {
				return identity;
			}
		}
	}
	return null;
};

/**
 * Gets the identity based on attendees list
 *
 * @param	{ZmMailMsg}	    mail msg which is an invitation, passing non-invite mail msg will return null
 * @return	{ZmIdentity}	the identity
 */
ZmIdentityCollection.prototype._selectIdentityFromAttendees =
function(mailMsg) {

    if(!mailMsg.isInvite()) return null;

	var identity;
    var attendees = mailMsg.invite.getAttendees();

    if(!attendees) return null;
    
	for (var i = 0, count = attendees.length; i < count; i++) {
		var address = attendees[i].url;
		if (address) {
			identity = this._addressToIdentity[address.toLowerCase()];
			if(identity) {
				return identity;
			}
		}
	}
    
	return null;
};

ZmIdentityCollection.prototype.getIdentityBySendAddress =
function(address) {
    for(var id in this._idToIdentity){
        var identity = this._idToIdentity[id];
        if(identity.sendFromAddress == address){
            return identity;
        }
    }
    return null;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmDataSource")) {
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
 * Creates a data source.
 * @class
 * This class represents a data source.
 * 
 * @param	{constant}	type	the account type (see <code>ZmAccount.TYPE_</code> constants)
 * @param	{String}	id		the id
 * 
 * @extends		ZmAccount
 */
ZmDataSource = function(type, id) {
	if (arguments.length == 0) { return; }
	ZmAccount.call(this, type, id);
	this.reset();
};

ZmDataSource.prototype = new ZmAccount;
ZmDataSource.prototype.constructor = ZmDataSource;

ZmDataSource.prototype.toString =
function() {
	return "ZmDataSource";
};

//
// Constants
//
/**
 * Defines the "cleartext" connection type.
 */
ZmDataSource.CONNECT_CLEAR = "cleartext";
/**
 * Defines the "ssl" connection type.
 */
ZmDataSource.CONNECT_SSL = "ssl";
ZmDataSource.CONNECT_DEFAULT = ZmDataSource.CONNECT_CLEAR;

ZmDataSource.POLL_NEVER = "0";

// soap attribute to property maps

ZmDataSource.DATASOURCE_ATTRS = {
	// SOAP attr:		JS property
	"id":				"id",
	"name":				"name",
	"isEnabled":		"enabled",
	"emailAddress":		"email",
	"host":				"mailServer",
	"port":				"port",
	"username":			"userName",
	"password":			"password",
	"l":				"folderId",
	"connectionType":	"connectionType",
	"pollingInterval":	"pollingInterval",
    "smtpEnabled":      "smtpEnabled",
	"leaveOnServer":	"leaveOnServer" // POP only
};

ZmDataSource.IDENTITY_ATTRS = {
	// SOAP attr:					JS property
	"fromDisplay":					"sendFromDisplay",
	"useAddressForForwardReply":	"setReplyTo",
	"replyToAddress":				"setReplyToAddress",
	"replyToDisplay":				"setReplyToDisplay",
	"defaultSignature":				"signature",
	"forwardReplySignature":		"replySignature"
};

//
// Data
//

ZmDataSource.prototype.ELEMENT_NAME = "dsrc";

// data source settings

ZmDataSource.prototype.enabled = true;

// basic settings

ZmDataSource.prototype.mailServer = "";
ZmDataSource.prototype.userName = "";
ZmDataSource.prototype.password = "";
ZmDataSource.prototype.folderId = ZmOrganizer.ID_INBOX;

// advanced settings

ZmDataSource.prototype.leaveOnServer = true;
ZmDataSource.prototype.connectionType = ZmDataSource.CONNECT_DEFAULT;

//
// Public methods
//

/** NOTE: Email is same as the identity's from address. */
ZmDataSource.prototype.setEmail =
function(email) {
	this.email = email;
};

ZmDataSource.prototype.getEmail =
function() {
	var email = this.email != null ? this.email : this.identity.getField(ZmIdentity.SEND_FROM_ADDRESS); // bug: 23042
	if (!email) { // bug: 38175
		var provider = ZmDataSource.getProviderForAccount(this);
		var host = (provider && provider._host) || this.mailServer;
		email = "";
        if (this.userName) {
            if (this.userName.match(/@/)) email = this.userName; // bug: 48186
            else if (host) email = [ this.userName, host].join("@");
        }
	}
	return email;
};

ZmDataSource.prototype.setFolderId =
function(folderId) {
	// TODO: Is there a better way to do this?
	//       I basically need to have the folder selector on the options
	//       page have a value of -1 but allow other code to see that and
	//       fill in the correct folder id. But I don't want it to
	//       overwrite that value once set.
	if (folderId == -1 && this.folderId != ZmOrganizer.ID_INBOX) { return; }
	this.folderId = folderId;
};

ZmDataSource.prototype.getFolderId =
function() {
	return this.folderId;
};

ZmDataSource.prototype.getIdentity =
function() {
	return this.identity;
};

// operations

ZmDataSource.prototype.create =
function(callback, errorCallback, batchCommand) {
	var soapDoc = AjxSoapDoc.create("CreateDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		var pvalue = pname == "folderId"
			? ZmOrganizer.normalizeId(this[pname])
			: this[pname];
		if (pname == "id" || (!pvalue && pname != "enabled" && pname != "leaveOnServer")) continue;

		dsrc.setAttribute(aname, String(pvalue));
	}
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		var pvalue = identity[pname];
		if (!pvalue) continue;

		dsrc.setAttribute(aname, String(pvalue));
	}

	var respCallback = new AjxCallback(this, this._handleCreateResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		batchCommand.setSensitive(Boolean(this.password));
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: Boolean(this.password),
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

ZmDataSource.prototype.save = function(callback, errorCallback, batchCommand, isIdentity) {

	var soapDoc = AjxSoapDoc.create("ModifyDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	// NOTE: If this object is a proxy, we guarantee that the
	//       the id attribute is *always* set.
	dsrc.setAttribute("id", this.id);
    if (!isIdentity) {
        for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
            var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
            if (!this.hasOwnProperty(pname)) {
                continue;
            }
            var avalue = this[pname];
            if (pname === "folderId") {
                avalue = ZmOrganizer.normalizeId(avalue);
            }
            // server sends us pollingInterval in ms, expects it back in seconds (!)
            // since it is not a user-visible value, it's safer to not send it back at all
            else if (pname === "pollingInterval") {
                continue;
            }
            dsrc.setAttribute(aname, String(avalue));
        }
    }
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		if (!identity.hasOwnProperty(pname)) continue;

		var avalue = identity[pname];
		dsrc.setAttribute(aname, String(avalue));
	}

	var respCallback = new AjxCallback(this, this._handleSaveResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		batchCommand.setSensitive(Boolean(this.password));
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: Boolean(this.password),
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

ZmDataSource.prototype.doDelete =
function(callback, errorCallback, batchCommand) {
	var soapDoc = AjxSoapDoc.create("DeleteDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);
	dsrc.setAttribute("id", this.id);

	var respCallback = new AjxCallback(this, this._handleDeleteResponse, [callback]);
	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		asyncMode: Boolean(callback),
		callback: respCallback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

/**
 * Tests the data source connection.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCommand		the batch command
 * @param	{Boolean}	noBusyOverlay		if <code>true</code>, do not show busy overlay
 * @return	{Object}	the response
 */
ZmDataSource.prototype.testConnection =
function(callback, errorCallback, batchCommand, noBusyOverlay) {
	var soapDoc = AjxSoapDoc.create("TestDataSourceRequest", "urn:zimbraMail");
	var dsrc = soapDoc.set(this.ELEMENT_NAME);

	var attrs = ["host", "port", "username", "password", "connectionType", "leaveOnServer"];
	for (var i = 0; i < attrs.length; i++) {
		var aname = attrs[i];
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		dsrc.setAttribute(aname, this[pname]);
	}

	if (batchCommand) {
		batchCommand.addNewRequestParams(soapDoc, callback, errorCallback);
		batchCommand.setSensitive(true);
		return;
	}

	var params = {
		soapDoc: soapDoc,
		sensitive: true,
		asyncMode: Boolean(callback),
		noBusyOverlay: noBusyOverlay,
		callback: callback,
		errorCallback: errorCallback
	};
	return appCtxt.getAppController().sendRequest(params);
};

/**
 * Gets the port.
 * 
 * @return	{int}	port
 */
ZmDataSource.prototype.getPort =
function() {
	return this.port || this.getDefaultPort();
};

ZmDataSource.prototype.isStatusOk = function() {
	return this.enabled && !this.failingSince;
};

ZmDataSource.prototype.setFromJson =
function(obj) {
	// errors
	if (obj.failingSince) {
		this.failingSince = obj.failingSince;
		this.lastError = (obj.lastError && obj.lastError[0]._content) || ZmMsg.unknownError;
	}
	else {
		delete this.failingSince;
		delete this.lastError;
	}
	// data source fields
	for (var aname in ZmDataSource.DATASOURCE_ATTRS) {
		var avalue = obj[aname];
		if (avalue == null) continue;
		if (aname == "isEnabled" || aname == "leaveOnServer") {
			avalue = avalue == "1" || String(avalue).toLowerCase() == "true";
		}
        // server sends us pollingInterval in ms, expects it back in seconds (!)
        else if (aname === "pollingInterval") {
            avalue = avalue / 1000;
        }
		var pname = ZmDataSource.DATASOURCE_ATTRS[aname];
		this[pname] = avalue;
	}

	// pseudo-identity fields
	var identity = this.getIdentity();
	for (var aname in ZmDataSource.IDENTITY_ATTRS) {
		var avalue = obj[aname];
		if (avalue == null) continue;
		if (aname == "useAddressForForwardReply") {
			avalue = avalue == "1" || String(avalue).toLowerCase() == "true";
		}

		var pname = ZmDataSource.IDENTITY_ATTRS[aname];
		identity[pname] = avalue;
	}
	this._setupIdentity();
};

ZmDataSource.prototype.reset = function() {
	// reset data source properties
	// NOTE: These have default values on the prototype object
	delete this.mailServer;
	delete this.userName;
	delete this.password;
	delete this.folderId;
	delete this.leaveOnServer;
	delete this.connectionType;
	delete this.pollingInterval;
	// other
	this.email = "";
	this.port = this.getDefaultPort();

	// reset identity
	var identity = this.identity = new ZmIdentity();
	identity.id = this.id;
	identity.isFromDataSource = true;
	
	// saving the identity itself won't work; need to save the data source
	var self = this;
	identity.save = function(callback, errorCallback, batchCommand) {
		ZmDataSource.prototype.save.call(self, callback, errorCallback, batchCommand, true);
	};
};

ZmDataSource.prototype.getProvider = function() {
	return ZmDataSource.getProviderForAccount(this);
};

//
// Public functions
//

// data source providers - provides default values

/**
 * Adds a data source provider. The registered providers are objects that
 * specify default values for data sources. This can be used to show the
 * user a list of known email providers (e.g. Yahoo! Mail) to pre-fill the
 * account information.
 *
 * @param {Hash}	provider  a hash of provider information
 * @param	{String}	provider.id		a unique identifier for this provider
 * @param	{String}	provider.name	the name of this provider to display to the user
 * @param	{String}	[provider.type]		the type (see <code>ZmAccount.TYPE_</code> constants)
 * @param	{String}	[provider.connectionType]	the connection type (see <code>ZmDataSource.CONNECT_</code> constants)
 * @param	{String}	[provider.host]	the server
 * @param	{String}	[provider.pollingInterval]		the polling interval
 * @param	{Boolean}	[provider.leaveOnServer]	if <code>true</code>, leave message on server (POP only)
 */
ZmDataSource.addProvider = function(provider) {
	var providers = ZmDataSource.getProviders();
	providers[provider.id] = provider;
	// normalize values -- defensive programming
	if (provider.type) {
		provider.type = provider.type.toLowerCase() == "pop" ? ZmAccount.TYPE_POP : ZmAccount.TYPE_IMAP;
	}
	else {
		provider.type = ZmAccount.TYPE_POP;
	}
	if (provider.connectionType) {
		var isSsl = provider.connectionType.toLowerCase() == "ssl";
		provider.connectionType =  isSsl ? ZmDataSource.CONNECT_SSL : ZmDataSource.CONNECT_CLEAR;
	}
	else {
		provider.connectionType = ZmDataSource.CONNECT_CLEAR;
	}
	if (!provider.port) {
		var isPop = provider.type == ZmAccount.TYPE_POP;
		if (isSsl) {
			provider.port = isPop ? ZmPopAccount.PORT_SSL : ZmImapAccount.PORT_SSL;
		}
		else {
			provider.port = isPop ? ZmPopAccount.PORT_CLEAR : ZmImapAccount.PORT_CLEAR;
		}
	}
};

/**
 * Gets the providers.
 * 
 * @return	{Array}		an array of providers
 */
ZmDataSource.getProviders =
function() {
	if (!ZmDataSource._providers) {
		ZmDataSource._providers = {};
	}
	return ZmDataSource._providers;
};

/**
 * Gets the provider.
 * 
 * @param	{ZmAccount}	account		the account
 * @return	{Hash}		the provider or <code>null</code> for none
 */
ZmDataSource.getProviderForAccount =
function(account) {
	return ZmDataSource.getProviderForHost(account.mailServer);
};

/**
 * Gets the provider.
 * 
 * @param	{String}	host		the host
 * @return	{Hash}		the provider or <code>null</code> for none
 */
ZmDataSource.getProviderForHost =
function(host) {
	var providers = ZmDataSource.getProviders();
	for (var id in providers) {
		hasProviders = true;
		var provider = providers[id];
		if (provider.host == host) {
			return provider;
		}
	}
	return null;
};

/**
 * Removes all providers.
 */
ZmDataSource.removeAllProviders = function() {
	delete ZmDataSource._providers;
};

//
// Protected methods
//


ZmDataSource.prototype._setupIdentity =
function() {
	this.identity.useWhenSentTo = true;
	this.identity.whenSentToAddresses = [ this.getEmail() ];
	this.identity.name = this.name;
};

ZmDataSource.prototype._loadFromDom =
function(data) {
	this.setFromJson(data);
};

ZmDataSource.prototype._handleCreateResponse =
function(callback, result) {
	var resp = result._data.CreateDataSourceResponse;
	this.id = resp[this.ELEMENT_NAME][0].id;
	this.identity.id = this.id;
	this._setupIdentity();
	delete this._new;
	delete this._dirty;

	appCtxt.getDataSourceCollection().add(this);

	var apps = [ZmApp.MAIL, ZmApp.PORTAL];
	for (var i=0; i<apps.length; i++) {
		var app = appCtxt.getApp(apps[i]);
		if (app) {
			var overviewId = app.getOverviewId();
			var treeView = appCtxt.getOverviewController().getTreeView(overviewId, ZmOrganizer.FOLDER);
			var fid = appCtxt.getActiveAccount().isMain ? this.folderId : ZmOrganizer.getSystemId(this.folderId);
			var treeItem = treeView ? treeView.getTreeItemById(fid) : null;
			if (treeItem) {
				// reset the icon in the tree view if POP account since the first time it
				// was created, we didnt know it was a data source
				if (this.type == ZmAccount.TYPE_POP && this.folderId != ZmFolder.ID_INBOX) {
					treeItem.setImage("POPAccount");
				}
				else if (this.type == ZmAccount.TYPE_IMAP) {
					// change imap folder to a tree header since folder is first created
					// without knowing its a datasource
					treeItem.dispose();
					var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
					var parentNode = treeView.getTreeItemById(rootId);
					var organizer = appCtxt.getById(this.folderId);
					treeView._addNew(parentNode, organizer);
				}
			}
		}
	}

	if (callback) {
		callback.run();
	}
};

ZmDataSource.prototype._handleSaveResponse =
function(callback, result) {
	delete this._dirty;

	var collection = appCtxt.getDataSourceCollection();
	// NOTE: By removing and adding it again, we make this proxy the
	//       base datasource object in the collection.
	collection.remove(this);
	collection.add(this);

	if (callback) {
		callback.run();
	}
};

ZmDataSource.prototype._handleDeleteResponse =
function(callback, result) {
	appCtxt.getDataSourceCollection().remove(this);

	var overviewId = appCtxt.getApp(ZmApp.MAIL).getOverviewId();
	var treeView = appCtxt.getOverviewController().getTreeView(overviewId, ZmOrganizer.FOLDER);
	var fid = appCtxt.getActiveAccount().isMain ? this.folderId : ZmOrganizer.getSystemId(this.folderId);
	if(this.folderId == ZmAccountsPage.DOWNLOAD_TO_FOLDER && this._object_ && this._object_.folderId) {
		fid = this._object_.folderId;
	}	
	var treeItem = treeView ? treeView.getTreeItemById(fid) : null;
	if (treeItem) {
		if (this.type == ZmAccount.TYPE_POP && this.folderId != ZmFolder.ID_INBOX) {
			// reset icon since POP folder is no longer hooked up to a datasource
			treeItem.setImage("Folder");
		} else if (this.type == ZmAccount.TYPE_IMAP) {
			// reset the icon in the tree view if POP account since the first time it
			// was created, we didnt know it was a data source
			treeItem.dispose();
			var parentNode = treeView.getTreeItemById(ZmOrganizer.ID_ROOT);
			var organizer = appCtxt.getById(fid);
			if (organizer) {
				treeView._addNew(parentNode, organizer);
			}
		}
	}

	if (callback) {
		callback.run();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmDataSourceCollection")) {
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
 * Creates the data source collection.
 * @class
 * This class represents a data source collection.
 * 
 * @extends		ZmModel
 */
ZmDataSourceCollection = function() {
    ZmModel.call(this, ZmEvent.S_DATA_SOURCE);
	this._initialized = false;
	this._itemMap = {};
    this._pop3Map = {};
	this._imapMap = {};
};
ZmDataSourceCollection.prototype = new ZmModel;
ZmDataSourceCollection.prototype.constructor = ZmDataSourceCollection;

//
// Public methods
//

ZmDataSourceCollection.prototype.toString =
function() {
	return "ZmDataSourceCollection";
};

ZmDataSourceCollection.prototype.getItems = function() {
	return AjxUtil.values(this._itemMap);
};

ZmDataSourceCollection.prototype.getItemsFor = function(folderId) {
    var accounts = [];
    for (var id in this._itemMap) {
        var account = this._itemMap[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

/**
 * Gets the POP accounts.
 * 
 * @return	{Array}	an array of {@link ZmPopAccount} objects
 */
ZmDataSourceCollection.prototype.getPopAccounts = function() {
    return AjxUtil.values(this._pop3Map);
};

/**
 * Gets the IMAP accounts.
 * 
 * @return	{Array}	an array of {@link ZmImapAccount} objects
 */
ZmDataSourceCollection.prototype.getImapAccounts = function() {
    return AjxUtil.values(this._imapMap);
};

/**
 * Gets the POP accounts.
 * 
 * @param	{String}	folderId		the folder id
 * @return	{Array}	an array of {@link ZmPopAccount} objects
 */
ZmDataSourceCollection.prototype.getPopAccountsFor = function(folderId) {
    var accounts = [];
    for (var id in this._pop3Map) {
        var account = this._pop3Map[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

/**
 * Gets the IMAP accounts.
 * 
 * @param	{String}	folderId		the folder id
 * @return	{Array}	an array of {@link ZmImapAccount} objects
 */
ZmDataSourceCollection.prototype.getImapAccountsFor = function(folderId) {
    var accounts = [];
    for (var id in this._imapMap) {
        var account = this._imapMap[id];
        if (account.folderId == folderId && account.enabled) {
            accounts.push(account);
        }
    }
    return accounts;
};

ZmDataSourceCollection.prototype.importMailFor = function(folderId) {
	this.importMail(this.getItemsFor(folderId));
};

ZmDataSourceCollection.prototype.importPopMailFor = function(folderId) {
	this.importMail(this.getPopAccountsFor(folderId));
};

ZmDataSourceCollection.prototype.importImapMailFor = function(folderId) {
	this.importMail(this.getImapAccountsFor(folderId));
};

ZmDataSourceCollection.prototype.importMail = function(accounts) {
    if (accounts && accounts.length > 0) {
        var sourceMap = {};
        var soapDoc = AjxSoapDoc.create("ImportDataRequest", "urn:zimbraMail");
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            sourceMap[account.id] = account;

            var dsrc = soapDoc.set(account.ELEMENT_NAME);
            dsrc.setAttribute("id", account.id);
        }

	    // send import request
        var params = {
            soapDoc: soapDoc,
            asyncMode: true,
	        noBusyOverlay: true,
            callback: null,
            errorCallback: null
        };
        appCtxt.getAppController().sendRequest(params);

	    // kick off check status request because import request
	    // doesn't return for (potentially) a looong time
	    var delayMs = 2000;
	    var action = new AjxTimedAction(this, this.checkStatus, [sourceMap, delayMs]);
	    AjxTimedAction.scheduleAction(action, delayMs);
    }
};

ZmDataSourceCollection.prototype.getById = function(id) {
	return this._itemMap[id];
};

/**
 * Gets a list of data sources associated with the given folder ID.
 *
 * @param {String}	folderId		[String]	the folderId
 * @param {constant}	type			the type of data source (see <code>ZmAccount.TYPE_</code> constants)
 * @return	{Array}	an array of items
 * 
 * @see	ZmAccount
 */
ZmDataSourceCollection.prototype.getByFolderId = function(folderId, type) {
	var list = [];
	for (var id in this._itemMap) {
		var item = this._itemMap[id];
		if (item.folderId == folderId) {
			if (!type || (type && type == item.type))
				list.push(item);
		}
	}
	return list;
};

ZmDataSourceCollection.prototype.add = function(item) {
	this._itemMap[item.id] = item;
	if (item.type == ZmAccount.TYPE_POP) {
		this._pop3Map[item.id] = item;
	}
	else if (item.type == ZmAccount.TYPE_IMAP) {
		this._imapMap[item.id] = item;
	}
	appCtxt.getIdentityCollection().add(item.getIdentity());
	this._notify(ZmEvent.E_CREATE, {item:item});
};

ZmDataSourceCollection.prototype.modify = function(item) {
	appCtxt.getIdentityCollection().notifyModify(item.getIdentity(), true);
    this._notify(ZmEvent.E_MODIFY, {item:item});
};

ZmDataSourceCollection.prototype.remove = function(item) {
    delete this._itemMap[item.id];
	delete this._pop3Map[item.id];
	delete this._imapMap[item.id];
	appCtxt.getIdentityCollection().remove(item.getIdentity());
    this._notify(ZmEvent.E_DELETE, {item:item});
};

ZmDataSourceCollection.prototype.initialize = function(dataSources) {
	if (!dataSources || this._initialized) { return; }

	var errors = [];

	if (appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED)) {
		var popAccounts = dataSources.pop3 || [];
		for (var i = 0; i < popAccounts.length; i++) {
			var object = popAccounts[i];
			var dataSource = new ZmPopAccount(object.id);
			dataSource.setFromJson(object);
			this.add(dataSource);
			if (!dataSource.isStatusOk()) {
				errors.push(dataSource);
			}
		}
	}

	if (appCtxt.get(ZmSetting.IMAP_ACCOUNTS_ENABLED)) {
		var imapAccounts = dataSources.imap || [];
		for (var i = 0; i < imapAccounts.length; i++) {
			var object = imapAccounts[i];
			var dataSource = new ZmImapAccount(object.id);
			dataSource.setFromJson(object);
			this.add(dataSource);
			if (!dataSource.isStatusOk()) {
				errors.push(dataSource);
			}
		}
	}

	this._initialized = true;

	var count = errors.length;
	if (count > 0) {
		// build error message
		var array = [
			AjxMessageFormat.format(ZmMsg.dataSourceFailureDescription, [count])
		];
		for (var i = 0; i < count; i++) {
			var dataSource = errors[i];
			var timestamp = Number(dataSource.failingSince);
			var lastError = dataSource.lastError;
			if (isNaN(timestamp)) {
				var pattern = ZmMsg.dataSourceFailureItem_noDate;
				var params = [AjxStringUtil.htmlEncode(dataSource.getName()), AjxStringUtil.htmlEncode(lastError)];
			} else {
				var pattern = ZmMsg.dataSourceFailureItem;
				var params = [AjxStringUtil.htmlEncode(dataSource.getName()), new Date(timestamp * 1000), AjxStringUtil.htmlEncode(lastError)];
			}
			array.push(AjxMessageFormat.format(pattern, params));
		}
		array.push(ZmMsg.dataSourceFailureInstructions);
		var message = array.join("");

		// show error message
		var shell = DwtShell.getShell(window);
		var dialog = new DwtMessageDialog({parent:shell,buttons:[DwtDialog.OK_BUTTON,DwtDialog.CANCEL_BUTTON]});
		dialog.setMessage(message, DwtMessageDialog.CRITICAL_STYLE, ZmMsg.dataSourceFailureTitle);
		dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this.__handleErrorDialogOk, [dialog]));
		dialog.popup();
	}
};

ZmDataSourceCollection.prototype.__handleErrorDialogOk = function(dialog) {
	dialog.popdown();

	var callback = new AjxCallback(this, this.__gotoPrefSection, ["ACCOUNTS"]);
	appCtxt.getAppController().activateApp(ZmApp.PREFERENCES, true, callback);
};

ZmDataSourceCollection.prototype.__gotoPrefSection = function(prefSectionId) {
	var controller = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController();
	controller.getPrefsView().selectSection(prefSectionId);
};

/**
 * Periocially check status of the import
 * @param {Object} sourceMap map of accounts
 * @param {int} delayMs delay time between checks
 */
ZmDataSourceCollection.prototype.checkStatus =
function(sourceMap, delayMs) {
	// Slowly back off import status checks but no more than 15 secs.
	if (delayMs && delayMs < 15000) {
		delayMs += 2000;
	}

    var soapDoc = AjxSoapDoc.create("GetImportStatusRequest", "urn:zimbraMail");
    var callback = new AjxCallback(this, this._checkStatusResponse, [sourceMap, delayMs]);
    var params = {
        soapDoc: soapDoc,
        asyncMode: true,
        callback: callback,
        errorCallback: null
    };

    var appController = appCtxt.getAppController();
    var action = new AjxTimedAction(appController, appController.sendRequest, [params]);
    AjxTimedAction.scheduleAction(action, delayMs || 2000);
};

//
// Protected methods
//

ZmDataSourceCollection.prototype._checkStatusResponse =
function(sourceMap, delayMs, result) {
	var dataSources = [];

	// gather sources from the response
	var popSources = result._data.GetImportStatusResponse.pop3;
	if (popSources) {
		for (var i in popSources) {
			dataSources.push(popSources[i]);
		}
	}
	var imapSources = result._data.GetImportStatusResponse.imap;
	if (imapSources) {
		for (var i in imapSources) {
			dataSources.push(imapSources[i]);
		}
	}
	var genericSources = result._data.GetImportStatusResponse.dsrc;
	if (genericSources) {
		for (var i in genericSources) {
			dataSources.push(genericSources[i]);
		}
	}

	// is there anything to do?
	if (dataSources.length == 0) return;

	// report status
	for (var i = 0; i < dataSources.length; i++) {
		var dsrc = dataSources[i];
		// NOTE: Only report the ones we were asked to; forget others
		if (!dsrc.isRunning && sourceMap[dsrc.id]) {
			var source = sourceMap[dsrc.id];
			if (sourceMap[dsrc.id]) {
				delete sourceMap[dsrc.id];
				if (dsrc.success) {
					var message = AjxMessageFormat.format(ZmMsg.dataSourceLoadSuccess, AjxStringUtil.htmlEncode(source.name));
					appCtxt.setStatusMsg(message);
				}
				else {
					var message = AjxMessageFormat.format(ZmMsg.dataSourceLoadFailure, AjxStringUtil.htmlEncode(source.name));
					appCtxt.setStatusMsg(message, ZmStatusView.LEVEL_CRITICAL);
					var dialog = appCtxt.getErrorDialog();
					dialog.setMessage(message, dsrc.error, DwtMessageDialog.CRITICAL_STYLE);
					dialog.popup();
				}
			}
		}
	}

	// continue checking status
	if (AjxUtil.keys(sourceMap).length > 0) {
		this.checkStatus(sourceMap, delayMs);
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmPopAccount")) {
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
 * Creates an POP account.
 * @class
 * This class represents an POP account.
 * 
 * @param	{String}	id		the id
 * 
 * @extends		ZmDataSource
 */ZmPopAccount = function(id) {
	ZmDataSource.call(this, ZmAccount.TYPE_POP, id);
};

ZmPopAccount.prototype = new ZmDataSource;
ZmPopAccount.prototype.constructor = ZmPopAccount;

// Constants
/**
 * Defines the "cleartext" port.
 * 
 * @type	int
 */
ZmPopAccount.PORT_CLEAR 	= 110;
/**
 * Defines the "ssl" port.
 * 
 * @type	int
 */
ZmPopAccount.PORT_SSL 		= 995;
ZmPopAccount.PORT_DEFAULT	= ZmPopAccount.PORT_CLEAR;


// advanced settings
ZmPopAccount.prototype.ELEMENT_NAME = "pop3";
ZmPopAccount.prototype.port = ZmPopAccount.PORT_DEFAULT;


// Public methods

ZmPopAccount.prototype.toString =
function() {
	return "ZmPopAccount";
};

/**
 * Gets the default port.
 * 
 * @return	{int}		the port
 */
ZmPopAccount.prototype.getDefaultPort =
function() {
	return (this.connectionType == ZmDataSource.CONNECT_SSL)
		? ZmPopAccount.PORT_SSL : ZmPopAccount.PORT_DEFAULT;
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmImapAccount")) {
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
 * Creates an IMAP account.
 * @class
 * This class represents an IMAP account.
 * 
 * @param	{String}	id		the id
 * 
 * @extends		ZmDataSource
 */
ZmImapAccount = function(id) {
	ZmDataSource.call(this, ZmAccount.TYPE_IMAP, id);
};

ZmImapAccount.prototype = new ZmDataSource;
ZmImapAccount.prototype.constructor = ZmImapAccount;


// Constants
/**
 * Defines the "cleartext" port.
 * 
 * @type	int
 */
ZmImapAccount.PORT_CLEAR	= 143;
/**
 * Defines the "ssl" port.
 * 
 * @type	int
 */
ZmImapAccount.PORT_SSL		= 993;
ZmImapAccount.PORT_DEFAULT	= ZmImapAccount.PORT_CLEAR;


// advanced settings
ZmImapAccount.prototype.ELEMENT_NAME = "imap";
ZmImapAccount.prototype.port = ZmImapAccount.PORT_DEFAULT;


// Public methods

ZmImapAccount.prototype.toString =
function() {
	return "ZmImapAccount";
};

/**
 * Gets the default port.
 * 
 * @return	{int}		the port
 */
ZmImapAccount.prototype.getDefaultPort =
function() {
	return (this.connectionType == ZmDataSource.CONNECT_SSL)
		? ZmImapAccount.PORT_SSL : ZmImapAccount.PORT_DEFAULT;
};

/**
 * Comparison function for *IMAP* folders. Since IMAP folderId's are *not* well-
 * known, we have to compare their names instead of their ID's.
 * 
 * @param	{ZmFolder}	folderA
 * @param	{ZmFolder}	folderB
 * @return	{int}	0 if the folders are the same; 1 if "a" is before "b"; -1 if "b" is before "a"
 */
ZmImapAccount.sortCompare =
function(folderA, folderB) {
	var check = ZmOrganizer.checkSortArgs(folderA, folderB);
	if (check != null) { return check; }

	var aId = ZmFolder.getIdForName(folderA.name);
	var bId = ZmFolder.getIdForName(folderB.name);

	if (ZmFolder.SORT_ORDER[aId] && ZmFolder.SORT_ORDER[bId]) {
		return (ZmFolder.SORT_ORDER[aId] - ZmFolder.SORT_ORDER[bId]);
	}
	if (!ZmFolder.SORT_ORDER[aId] && ZmFolder.SORT_ORDER[bId]) { return 1; }
	if (ZmFolder.SORT_ORDER[aId] && !ZmFolder.SORT_ORDER[bId]) { return -1; }
	if (folderA.name.toLowerCase() > folderB.name.toLowerCase()) { return 1; }
	if (folderA.name.toLowerCase() < folderB.name.toLowerCase()) { return -1; }
	return 0;
};

}
if (AjxPackage.define("zimbraMail.mail.model.ZmSignature")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates a signature.
 * @class
 * This class represents a signature.
 * 
 * 
 */
ZmSignature = function(id) {
	this.id = id;
};

ZmSignature.prototype.toString = function() {
	return "ZmSignature";
};

//
// Data
//
/**
 * The name property.
 * @type	String
 */
ZmSignature.prototype.name = "";
/**
 * The content type property.
 * @type	String
 * @see		ZmMimeTable
 */
ZmSignature.prototype.contentType = ZmMimeTable.TEXT_PLAIN;
/**
 * The value property.
 * @type	String
 */
ZmSignature.prototype.value = "";

//
// Static functions
//

ZmSignature.createFromJson =
function(object) {
	var signature = new ZmSignature(object.id);
	signature.setFromJson(object);
	return signature;
};

//
// Public methods
//
/**
 * Creates the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.create =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleCreateResponse, [callback]) : null;
	var resp = this._sendRequest("CreateSignatureRequest", false, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleCreateResponse(callback, resp);
	}
};

/**
 * Saves the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.save =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleModifyResponse, [callback]) : null;
	var resp = this._sendRequest("ModifySignatureRequest", false, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleModifyResponse(callback, resp);
	}
};

/**
 * Deletes the signature.
 * 
 * @param	{AjxCallback}		callback		the callback
 * @param	{AjxCallback}		errorCallback		the error callback
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmSignature.prototype.doDelete =
function(callback, errorCallback, batchCmd) {
	var respCallback = callback ? new AjxCallback(this, this._handleDeleteResponse, [callback]) : null;
	var resp = this._sendRequest("DeleteSignatureRequest", true, respCallback, errorCallback, batchCmd);
	if (!callback && !batchCmd) {
		this._handleDeleteResponse(callback, resp);
	}
};

/**
 * Sets the signature from JSON object.
 * 
 * @param	{Object}	object		the object
 */
ZmSignature.prototype.setFromJson =
function(object) {

	this.name = object.name || this.name;
	var c = object.content;
    if (c) {
		var sig = c[0]._content ? c[0] : c[1];
		this.contentType = sig.type || this.contentType;
		this.value = sig._content || this.value;
    }
	if (object.cid) {
		this.contactId = object.cid[0]._content;
	}
};

/**
 * Gets the content type.
 * 
 * @return	{String}	the content type
 */
ZmSignature.prototype.getContentType =
function() {
    return this.contentType;
};

/**
 * Sets the content type.
 * 
 * @param	{String}	ct		the content type
 * @see		ZmMimeTable
 */
ZmSignature.prototype.setContentType =
function(ct){
    this.contentType = ct || ZmMimeTable.TEXT_PLAIN;  
};

/**
 * @param outputType	[string]	(Optional) Formats the resulting
 *									signature text to the specified
 *									content-type. If not specified,
 *									the signature text is returned in
 *									the original format.
 *
 * @private
 */
ZmSignature.prototype.getValue =
function(outputType) {
	
    var isHtml = this.contentType == ZmMimeTable.TEXT_HTML;
	var value = this.value;

	var type = outputType || this.contentType;
	if (type != this.contentType) {
        value = isHtml ? AjxStringUtil.convertHtml2Text(value) : AjxStringUtil.convertToHtml(value);
	}

	if (appCtxt.isWebClientOffline()) {
		value = ZmOffline.modifySignature(value);
	}

    return value;
};


//
// Protected methods
//

ZmSignature.prototype._sendRequest =
function(method, idOnly, respCallback, errorCallback, batchCmd) {

/*
	var jsonObj = {};
	var request = jsonObj[method] = {_jsns:"urn:zimbraAccount"};
	var sig = request.signature = {};
	if (this.id) {
		sig.id = this.id;
	}
	if (!idOnly) {
		sig.name = this.name;
		sig.cid = this.contactId || null;
		sig.content = [];
		sig.content.push({_content:this.value, type:this.contentType});

        // Empty the other content type
        var emptyType = (this.contentType == ZmMimeTable.TEXT_HTML) ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML;
		sig.content.push({_content:"", type:emptyType});
	}
*/

	var soapDoc = AjxSoapDoc.create(method, "urn:zimbraAccount");
	var signatureEl = soapDoc.set("signature");
	if (this.id) {
		signatureEl.setAttribute("id", this.id);
	}
	if (!idOnly) {
		signatureEl.setAttribute("name", this.name);
		if (this.contactId || (method == "ModifySignatureRequest")) {
			soapDoc.set("cid", this.contactId || null, signatureEl);
		}
		var contentEl = soapDoc.set("content", this.value, signatureEl);
		contentEl.setAttribute("type", this.contentType);

        //Empty the other content type
        var emptyType = (this.contentType == ZmMimeTable.TEXT_HTML) ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML;
        contentEl = soapDoc.set("content", "", signatureEl);
		contentEl.setAttribute("type", emptyType);

	}

	if (batchCmd) {
		batchCmd.addNewRequestParams(soapDoc, respCallback, errorCallback);
		return;
	}

	var appController = appCtxt.getAppController();
	var params = {
		soapDoc:		soapDoc,
		asyncMode:		Boolean(respCallback),
		callback:		respCallback,
		errorCallback:	errorCallback
	}
	return appController.sendRequest(params);
};

ZmSignature.prototype._handleCreateResponse =
function(callback, resp) {
	// save id
	this.id = resp._data.CreateSignatureResponse.signature[0].id;

	// add to global hash
	var signatures = appCtxt.getSignatureCollection();
	signatures.add(this);

	if (callback) {
		callback.run();
	}
};

ZmSignature.prototype._handleModifyResponse = function(callback, resp) {
	// promote settings to global signature
	var signatures = appCtxt.getSignatureCollection();
	var signature = signatures.getById(this.id);
	signature.name = this.name;
	signature.value = this.value;
    signature.contentType = this.contentType;
	signatures._notify(ZmEvent.E_MODIFY, { item: signature });

	if (callback) {
		callback.run();
	}
};

ZmSignature.prototype._handleDeleteResponse = function(callback, resp) {
	// remove from global hash
	var signatures = appCtxt.getSignatureCollection();
	signatures.remove(this);

	if (callback) {
		callback.run();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.model.ZmSignatureCollection")) {
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
 * Creates a signature collection.
 * @class
 * This class represents a signature collection.
 * 
 * @extends		ZmModel
 */
ZmSignatureCollection = function() {
	ZmModel.call(this, ZmEvent.S_SIGNATURE);
	this._idMap = {};
	this._nameMap= {};
	this._size = 0;
};

ZmSignatureCollection.prototype = new ZmModel;
ZmSignatureCollection.prototype.constructor = ZmSignatureCollection;

ZmSignatureCollection.prototype.toString =
function() {
	return "ZmSignatureCollection";
};

//
// Public methods
//
/**
 * Adds the signature.
 * 
 * @param	{ZmSignature}	signature		the signature to add
 */
ZmSignatureCollection.prototype.add =
function(signature) {
	if (!this._idMap[signature.id]) {
		this._idMap[signature.id] = signature;
		this._nameMap[signature.name] = signature;
		this._size++;
		this._notify(ZmEvent.E_CREATE, { item: signature });
	}
};

/**
 * Removes the signature.
 * 
 * @param	{ZmSignature}	signature		the signature to remove
 */
ZmSignatureCollection.prototype.remove =
function(signature) {
	if (this._idMap[signature.id]) {
		delete this._idMap[signature.id];
		delete this._nameMap[signature.name];
		this._size--;
		this._notify(ZmEvent.E_DELETE, { item: signature });
	}
};

/**
 * Gets the count of signatures.
 * 
 * @return	{int}		the size
 */
ZmSignatureCollection.prototype.getSize =
function() {
	return this._size;
};

/**
 * Gets the signatures.
 * 
 * @return	{Array}	an array of {@link ZmSignature} objects
 */
ZmSignatureCollection.prototype.getSignatures =
function(sort) {

	var signatures = AjxUtil.values(this._idMap);
	if (sort) {
		signatures.sort(ZmSignatureCollection.BY_NAME);
	}
	return signatures;
};

ZmSignatureCollection.prototype.getSignatureOptions =
function() {
	// collect signatures
	var signatures = [];
	for (var id in this._idMap) {
		signatures.push(this._idMap[id]);
	}
	signatures.sort(ZmSignatureCollection.BY_NAME);

	// create options
	var options = [];
	//In Web Client offline mode signature having vCard will be suppressed
	var isWebClientOffline = appCtxt.isWebClientOffline();
	for (var i = 0; i < signatures.length; i++) {
		var signature = signatures[i];
		if (isWebClientOffline && signature.contactId) {
			continue;
		}
		options.push(new DwtSelectOptionData(signature.id, signature.name));
	}
	options.push(new DwtSelectOptionData("", ZmMsg.signatureDoNotAttach));
	return options;
};

/**
 * Gets the signature by id.
 * 
 * @param	{String}	id		the signature
 * @return	{ZmSignature} the signature
 */
ZmSignatureCollection.prototype.getById =
function(id) {
	return this._idMap[id];
};

/**
 * Gets the signature by name.
 * 
 * @param	{String}	name		the signature
 * @return	{ZmSignature} the signature
 */
ZmSignatureCollection.prototype.getByName =
function(name) {
	var lname = name.toLowerCase();
	for (var key in this._nameMap) {
		if (key.toLowerCase() == lname) {
			return this._nameMap[key];
		}
	}
};

ZmSignatureCollection.prototype.initialize =
function(data) {
	if (this._size) return;

	var signatures = data.signature;
	if (!signatures) return;

	for (var i = 0; i < signatures.length; i++) {
		var signature = ZmSignature.createFromJson(signatures[i]);
		this.add(signature);
	}
};

//
// Static functions
//

ZmSignatureCollection.BY_NAME =
function(a, b) {
	return a.name.localeCompare(b.name);
};
}

if (AjxPackage.define("zimbraMail.prefs.view.ZmPreferencesPage")) {
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
 * Creates an empty preferences page of the given type.
 * @constructor
 * @class
 * This class represents a single page of preferences available by selecting one of the
 * preference tabs. During construction, skeletal HTML is created. The preferences
 * are not added until the page becomes visible.
 *
 * @author Conrad Damon
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 *
 * @extends		DwtTabViewPage
 */
ZmPreferencesPage = function(parent, section, controller, id) {
	if (arguments.length == 0) return;

	id = id || ("Prefs_Pages_" + section.id);
	DwtTabViewPage.call(this, parent, "ZmPreferencesPage", null, id);

	this._section = section;
	this._controller = controller;

	this.setScrollStyle(Dwt.SCROLL_Y);

	this._title = [ZmMsg.zimbraTitle, controller.getApp().getDisplayName(), section.title].join(": ");

	this._dwtObjects = {};
	this._tabGroup = new DwtTabGroup(id);
	this._rendered = false; // used by DwtTabViewPage
};

ZmPreferencesPage.prototype = new DwtTabViewPage;
ZmPreferencesPage.prototype.constructor = ZmPreferencesPage;

ZmPreferencesPage.prototype.toString =
function () {
	return "ZmPreferencesPage";
};

//
// Constants
//

ZmPreferencesPage.IMPORT_FIELD_NAME = "importUpload";
ZmPreferencesPage.IMPORT_TIMEOUT = 300;

//
// Public methods
//

ZmPreferencesPage.prototype._replaceControlElement =
function(elemOrId, control) {
	control.replaceElement(elemOrId);
};

ZmPreferencesPage.prototype._enterTabScope =
function() {
	if (!this._tabScopeStack) {
		this._tabScopeStack = [];
	}
	var scope = {};
	this._tabScopeStack.push(scope);
	return scope;
};

ZmPreferencesPage.prototype._getCurrentTabScope =
function() {
	var stack = this._tabScopeStack;
	return stack && stack[stack.length - 1];
};

ZmPreferencesPage.prototype._exitTabScope =
function() {
	var stack = this._tabScopeStack;
	return stack && stack.pop();
};

ZmPreferencesPage.prototype._addControlTabIndex =
function(elemOrId, control) {
};

ZmPreferencesPage.prototype._addTabLinks =
function(elemOrId) {
	var elem = Dwt.byId(elemOrId);
	if (!elem) return;

	var links = elem.getElementsByTagName("A");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		if (!link.href) continue;
		this._addControlTabIndex(link, link);
	}
};

/**
 * Fills the page with preferences that belong to this page, if that has not been done
 * already. Note this method is only called when the tab
 * is selected and the page becomes visible.
 *
 */
ZmPreferencesPage.prototype.showMe =
function() {
	DwtTabViewPage.prototype.showMe.call(this);

	Dwt.setTitle(this._title);
	this._controller._resetOperations(this._controller._toolbar, this._section.id);

	if (this.hasRendered) {
		if (this._controller.isDirty(this._section.id)) {
			this._controller.setDirty(this._section.id, false);
		}
		return;
	}

	this._dwtObjects = {}; // always reset in case account has changed
	this._createPageTemplate();
	this._createControls();

	// find option headers and sections
	var elements = this.getHtmlElement().children;

	AjxUtil.foreach(elements, function(el) {
		if (Dwt.hasClass(el, 'prefHeader')) {
			var header = el;
			header.setAttribute('role', 'heading');
			header.setAttribute('aria-level', 1);
			header.id = Dwt.getNextId('prefHeader')
		} else if (Dwt.hasClass(el, 'ZOptionsSectionTable')) {
			var sectiontable = el;
			var header = Dwt.getPreviousElementSibling(sectiontable);
			var sections = Dwt.byClassName('ZOptionsSectionMain', sectiontable);

			if (!Dwt.hasClass(header, 'prefHeader')) {
				DBG.println(AjxDebug.DBG1, "pref section has no prefHeader:\n" +
				            sectiontable.outerHTML);
				return;
			}

			// we only expect one section, but iterate over them, just in case
			AjxUtil.foreach(sections, function(section) {
				section.setAttribute('aria-labelledby', header.id);
				section.setAttribute('role', 'region');
			});
		}
	});

	// find option fields
	var fields = Dwt.byClassName('ZOptionsField', this.getHtmlElement());

	AjxUtil.foreach(fields, function(field) {
		field.setAttribute('role', 'group');

		// find the label corresponding to this item and assign it as an ARIA
		// label
		var label = Dwt.getPreviousElementSibling(field);

		if (!label) {
			DBG.println(AjxDebug.DBG1, "option field has no label " + Dwt.getId(field));
			return;
		}

		label.setAttribute('role', 'heading');
		label.setAttribute('aria-level', 2);

		field.setAttribute('aria-labelledby',
		                   Dwt.getId(label, 'ZOptionsLabel'));
	});

	// find focusable children -- i.e. links and widgets -- but in the DOM
	// order, not in the order they were added as children
	var selector = [
		'[parentid="',
		this.getHTMLElId(),
		'"],',
		'A'
	].join('');
	var elements = this.getHtmlElement().querySelectorAll(selector);

	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		var control = DwtControl.fromElement(element);

		// add the child to our tab group
		if (control && control.parent == this) {
			this._tabGroup.addMember(control.getTabGroupMember());
		} else if (DwtControl.findControl(element) === this) {
			this._makeFocusable(element);
			this._tabGroup.addMember(element);
		}

		// find the ZOptionsField corresponding to this item and assign it as
		// an ARIA label
		var ancestors = Dwt.getAncestors(element, this.getHtmlElement());
		var field = null, label = null;

		for (var j = 0; j < ancestors.length; j++) {
			var ancestor = ancestors[j];
			var ancestorSibling = Dwt.getPreviousElementSibling(ancestor);

			// are we looking at an option field with a corresponding label?
			// please note that labels can have multiple classes, all of them
			// starting with ZOptionsLabel
			if (Dwt.hasClass(ancestor, 'ZOptionsField')) {
				field = ancestor;
			}
		}

		if (!field) {
			DBG.println(AjxDebug.DBG1, "no field found for:\n" +
						element.outerHTML);
			continue;
		}

		var label = Dwt.getPreviousElementSibling(field);

		if (!label || !label.className.match(/\bZOptionsLabel/)) {
			DBG.println(AjxDebug.DBG1, "option field has no label:\n" +
						field.outerHTML);
			continue;
		}

		if (!label.id) {
			label.id = Dwt.getNextId();
		}

		label.setAttribute('role', 'heading');
		label.setAttribute('aria-level', 2);
	}
};

ZmPreferencesPage.prototype._createPageTemplate =
function() {
	// expand template
	DBG.println(AjxDebug.DBG2, "rendering preferences page " + this._section.id);
	var templateId = this._section.templateId;
	this._createPageHtml(templateId, this._getTemplateData());
	this.setVisible(false); // hide until ready
};

ZmPreferencesPage.prototype._getTemplateData =
function() {
	var data = {
		id: this._htmlElId,
		isEnabled: AjxCallback.simpleClosure(this._isEnabled, this),
		activeAccount: appCtxt.getActiveAccount()
	};
	data.expandField = AjxCallback.simpleClosure(this._expandField, this, data);

	return data;
};

ZmPreferencesPage.prototype._createControls =
function() {
	// create controls for prefs, if present in template
	this._prefPresent = {};
	this._enterTabScope();
	try {
		// add links to tab control list
		this._addTabLinks(this.getHtmlElement());

		// add preference controls
		var prefs = this._section.prefs || [];
		var settings = appCtxt.getSettings();

		for (var i = 0; i < prefs.length; i++) {
			var id = prefs[i];
			if (!id) { continue; }
			var pref = settings.getSetting(id);

			// ignore if there is no container element
			var elem = document.getElementById([this._htmlElId, id].join("_"));
			if (!elem) { continue; }

			// ignore if doesn't meet pre-condition
			var setup = ZmPref.SETUP[id];

			if (!setup || !appCtxt.checkPrecondition(setup.precondition, setup.preconditionAny)) {
				continue;
			}

			// perform load function
			if (setup.loadFunction) {
				setup.loadFunction(setup);
				if (setup.options.length <= 1) { continue; }
			}

			// save the current value (for checking later if it changed)
			pref.origValue = this._getPrefValue(id);
			var value = this._getPrefValue(id, false);

			this._prefPresent[id] = true;
			DBG.println(AjxDebug.DBG3, "adding pref " + pref.name + " / " + value);

			// create form controls
			this._initControl(id, setup, value);

			var control = null;
			var type = setup ? setup.displayContainer : null;
			if (type == ZmPref.TYPE_CUSTOM) {
				control = this._setupCustom(id, setup, value);
			}
			else if (type == ZmPref.TYPE_SELECT) {
				control = this._setupSelect(id, setup, value);
			}
			else if (type == ZmPref.TYPE_COMBOBOX) {
				control = this._setupComboBox(id, setup, value);
			}
			else if (type == ZmPref.TYPE_RADIO_GROUP) {
				control = this._setupRadioGroup(id, setup, value);
			}
			else if (type == ZmPref.TYPE_CHECKBOX) {
				control = this._setupCheckbox(id, setup, value);
			}
			else if (type == ZmPref.TYPE_INPUT || type == ZmPref.TYPE_TEXTAREA) {
				if (type == ZmPref.TYPE_TEXTAREA) {
					setup.rows = elem.getAttribute("rows") || setup.rows || 4;
					setup.cols = elem.getAttribute("cols") || setup.cols || 60;
					setup.wrap = elem.getAttribute("wrap") || setup.wrap || "on";
				}
				control = this._setupInput(id, setup, value);
			}
			else if (type == ZmPref.TYPE_STATIC) {
				control = this._setupStatic(id, setup, value);
			}
			else if (type == ZmPref.TYPE_COLOR) {
				control = this._setupColor(id, setup, value);
			}
			else if (type == ZmPref.TYPE_LOCALES) {
                //Fix for bug# 80762 - Based on multiple locale availability set the view as dropdown or label
                if(ZmLocale.hasChoices()) {
                    control = this._setupLocales(id, setup, value);
                }
                else {
                    //Part of bug# 80762. Sets view for a single locale and displays as a label
                    control = this._setupLocaleLabel(id, setup, value);
                }
			}
			else if (type == ZmPref.TYPE_FONT) {
				control = this._setupMenuButton(id, value, ZmPreferencesPage.fontMap);
			}
			else if (type == ZmPref.TYPE_FONT_SIZE) {
				control = this._setupMenuButton(id, value, ZmPreferencesPage.fontSizeMap);
			}
			else if (type == ZmPref.TYPE_PASSWORD) {
				this._addButton(elem, setup.displayName, 50, new AjxListener(this, this._changePasswordListener), "CHANGE_PASSWORD");
			}
			else if (type == ZmPref.TYPE_IMPORT) {
				this._addImportWidgets(elem, id, setup);
			}
			else if (type == ZmPref.TYPE_EXPORT) {
				this._addExportWidgets(elem, id, setup);
			}

			if (!control) {
				control = this.getFormObject(id);
			}

			// add control to form
			if (control && control.isDwtControl) {
				this._replaceControlElement(elem, control);
				if (setup.initFunction) {
					setup.initFunction(control, value);
				}
				if (setup.changeFunction) {
					if (control.addChangeListener) {
						control.addChangeListener(setup.changeFunction);
					} else if (control.addSelectionListener) {
						control.addSelectionListener(setup.changeFunction);
					}
				}
			}
		}

		// create special page buttons
		var defaultsRestore = document.getElementById([this._htmlElId,"DEFAULTS_RESTORE"].join("_"));
		if (defaultsRestore) {
			this._addButton(defaultsRestore, ZmMsg.restoreDefaults, 110, new AjxListener(this, this._resetListener));
		}

		// create tab-group for all controls on the page
		this._addControlsToTabGroup(this._tabGroup);
	}
	finally {
		this._exitTabScope();
	}

	// finish setup
	this.setVisible(true);
	this.hasRendered = true;
};

ZmPreferencesPage.prototype._addControlsToTabGroup =
function(tabGroup) {
};

ZmPreferencesPage.prototype.setFormObject =
function(id, object) {
	this._dwtObjects[id] = object;
};

ZmPreferencesPage.prototype.getFormObject =
function(id) {
	return this._dwtObjects[id];
};

/**
 * Gets the value of the preference control.
 *
 * @param {String}		id		the preference id
 * @param {Object}	[setup]		the preference descriptor
 * @param {DwtControl}	[control]	the preference control
 * @return	{String}	the value
 */
ZmPreferencesPage.prototype.getFormValue =
function(id, setup, control) {
	setup = setup || ZmPref.SETUP[id];
	var value = null;
	var type = setup ? setup.displayContainer : null;
	if (type == ZmPref.TYPE_SELECT || type == ZmPref.TYPE_COMBOBOX ||
		type == ZmPref.TYPE_CHECKBOX ||
		type == ZmPref.TYPE_RADIO_GROUP || type == ZmPref.TYPE_COLOR ||
		type == ZmPref.TYPE_INPUT || type == ZmPref.TYPE_LOCALES ||
		type === ZmPref.TYPE_FONT || type === ZmPref.TYPE_FONT_SIZE) {
		var object = control || this.getFormObject(id);
		if (object) {
			if (type == ZmPref.TYPE_COLOR) {
				value = object.getColor();
			}
			else if (type == ZmPref.TYPE_CHECKBOX) {
				value = object.isSelected();
				if (setup.options) {
					value = setup.options[Number(value)];
				}
			}
			else if (type == ZmPref.TYPE_RADIO_GROUP) {
				value = object.getSelectedValue();
				if (value == "true" || value == "false") {
					value = (value == "true");
				}
			}
			else if (type == ZmPref.TYPE_LOCALES) {
				value = object._localeId;
			}
			else if (type === ZmPref.TYPE_FONT || type === ZmPref.TYPE_FONT_SIZE) {
				value = object._itemId;
			}
			else if (type == ZmPref.TYPE_COMBOBOX) {
				value = object.getValue() || object.getText();
			}
			else {
				value = object.getValue();
			}
		}
	}
	else {
		var prefId = [this._htmlElId, id].join("_");
		var element = document.getElementById(prefId);
		if (!element) return null;
		value = element.value;
	}
	return setup && setup.valueFunction ? setup.valueFunction(value) : value;
};

/**
 * Sets the value of the preference control.
 *
 * @param {String}	id		the preference id
 * @param {Object}	value		the preference value
 * @param {Object}	[setup]		the preference descriptor
 * @param {DwtControl}	[control]	the preference control
 */
ZmPreferencesPage.prototype.setFormValue =
function(id, value, setup, control) {
	setup = setup || ZmPref.SETUP[id];
	if (setup && setup.displayFunction) {
		value = setup.displayFunction(value);
	}
	if (setup && setup.approximateFunction) {
		value = setup.approximateFunction(value);
	}
	var type = setup ? setup.displayContainer : null;
	if (type == ZmPref.TYPE_SELECT || type == ZmPref.TYPE_COMBOBOX ||
		type == ZmPref.TYPE_CHECKBOX ||
		type == ZmPref.TYPE_RADIO_GROUP ||
		type == ZmPref.TYPE_COLOR) {
		var object = control || this.getFormObject(id);
		if (!object) { return value; }

		if (type == ZmPref.TYPE_COLOR) {
			object.setColor(value);
		} else if (type == ZmPref.TYPE_CHECKBOX) {
			if (id == ZmSetting.OFFLINE_IS_MAILTO_HANDLER) {
				try { // add try/catch - see bug #33870
					if (window.platform && !window.platform.isRegisteredProtocolHandler("mailto")) {
						object.setSelected(false);

						// this pref might have been set to true before. so we must set origValue = false
						// so that when user selects the checkbox, it will be considered "dirty"
						var setting = appCtxt.getSettings(appCtxt.accountList.mainAccount).getSetting(id);
						setting.origValue = false;
					} else {
						object.setSelected(true);
					}
					object.setEnabled(true);
				} catch(ex) {
					object.setEnabled(false);
					object.setSelected(false);
				}
			} else {
				object.setSelected(value);
			}
		} else if (type == ZmPref.TYPE_RADIO_GROUP) {
			object.setSelectedValue(value);
		} else if (type == ZmPref.TYPE_COMBOBOX) {
			object.setValue(value);
		} else {
			var curValue = object.getValue();
			if (value != null && (curValue != value)) {
				object.setSelectedValue(value);
			}
		}
	} else if (type == ZmPref.TYPE_INPUT) {
		var object = control || this.getFormObject(id);
		if (!object) { return value; }

		var curValue = object.getValue();
		if (value != null && (curValue != value)) {
			object.setValue(value);
		}
	} else if (type == ZmPref.TYPE_LOCALES) {
		var object = this._dwtObjects[ZmSetting.LOCALE_NAME];
		if (!object) { return value; }
		this._showLocale(value, object);
	} else if (type == ZmPref.TYPE_FONT) {
		var object = this._dwtObjects[ZmSetting.FONT_NAME];
		if (!object) { return value; }
		this._showItem(value, ZmPreferencesPage.fontMap, object);
	} else if (type == ZmPref.TYPE_FONT_SIZE) {
		var object = this._dwtObjects[ZmSetting.FONT_SIZE];
		if (!object) { return value; }
		this._showItem(value, ZmPreferencesPage.fontSizeMap, object);
	} else {
		var prefId = [this._htmlElId, id].join("_");
		var element = control || document.getElementById(prefId);
		if (!element || element.value == value) { return value; }

		element.value = value || "";
	}
    return value;
};

/**
 * Gets the title.
 *
 * @return	{String}	the title
 */
ZmPreferencesPage.prototype.getTitle =
function() {
	return this._title;
};

ZmPreferencesPage.prototype.hasResetButton =
function() {
	return true;
};


ZmPreferencesPage.prototype.getTabGroupMember =
function() {
	return this._tabGroup;
};

ZmPreferencesPage.prototype.reset =
function(useDefaults) {
	var settings = appCtxt.getSettings();
	var prefs = this._section.prefs || [];
	for (var i = 0; i < prefs.length; i++) {
		var id = prefs[i];
		if (!id) { continue; }
		var setup = ZmPref.SETUP[id];
		if (!setup) { continue; }
		var type = setup.displayContainer;
		if (type == ZmPref.TYPE_PASSWORD) { continue; } // ignore non-form elements
		var pref = settings.getSetting(id);
		var newValue = this._getPrefValue(id, useDefaults);
		this.setFormValue(id, newValue);
	}

	if (!useDefaults) {
		this._controller.setDirty(this._section.id, false);
	}
};

ZmPreferencesPage.prototype.resetOnAccountChange =
function() {
	this.hasRendered = false;
};

/**
 * Checks if the data is dirty.
 *
 * @return	{Boolean}	<code>true</code> if the data is dirty
 */
ZmPreferencesPage.prototype.isDirty = function() { return false; };
ZmPreferencesPage.prototype.validate = function() {	return true; };

/**
 * Adds the modify command to the given batch command.
 *
 * @param	{ZmBatchCommand}		batchCmd		the batch command
 */
ZmPreferencesPage.prototype.addCommand = function(batchCmd) {};

//
// Protected methods
//

ZmPreferencesPage.prototype._createPageHtml =
function(templateId, data) {
	if (AjxTemplate.require(templateId)) {
		this.getContentHtmlElement().innerHTML = AjxTemplate.expand(templateId, data);
	}
};

/**
 * Returns the value of the specified pref, massaging it if necessary.
 *
 * @param id			[constant]		pref ID
 * @param useDefault	[boolean]		if true, use pref's default value
 *
 * @private
 */
ZmPreferencesPage.prototype._getPrefValue =
function(id, useDefault) {
	var pref = appCtxt.getSettings().getSetting(id);
	return useDefault ? pref.getDefaultValue() : pref.getValue();
};

// Add a button to the preferences page
ZmPreferencesPage.prototype._addButton =
function(parentIdOrElem, text, width, listener, id) {
	var params = {parent: this};
	if (id) {
		params.id = id;
	}
	var button = new DwtButton(params);
	button.setSize(width, Dwt.DEFAULT);
	button.setText(text);
	button.addSelectionListener(listener);
	this._replaceControlElement(parentIdOrElem, button);
	return button;
};

ZmPreferencesPage.prototype._prepareValue =
function(id, setup, value) {
	if (setup.displayFunction) {
		value = setup.displayFunction(value);
	}
	if (setup.approximateFunction) {
		value = setup.approximateFunction(value);
	}
	return value;
};

ZmPreferencesPage.prototype._initControl =
function(id, setup, value) {
	// sub-classes can override this to provide initialization
	// code *before* the actual control is constructed.
};

ZmPreferencesPage.prototype._setupStatic =
function(id, setup, value) {
	var text = new DwtText(this);
	this.setFormObject(id, text);
	text.setText(value);
	return text;
};

ZmPreferencesPage.prototype._setupSelect =
function(id, setup, value) {
	value = this._prepareValue(id, setup, value);

	var params = {parent: this, id: "Prefs_Select_" + id};
	for (var p in setup.displayParams) {
		params[p] = setup.displayParams[p];
	}
	var selObj = new DwtSelect(params);
	this.setFormObject(id, selObj);

	var options = setup.options || setup.displayOptions || setup.choices || [];
	var isChoices = Boolean(setup.choices);
	for (var j = 0; j < options.length; j++) {
		var optValue = isChoices ? options[j].value : options[j];
		var optLabel = isChoices ? options[j].label : setup.displayOptions[j];
		optLabel = ZmPreferencesPage.__formatLabel(optLabel, optValue);
		var optImage = setup.images ? setup.images[j] : null;
		var data = new DwtSelectOptionData(optValue, optLabel, false, null, optImage);
		selObj.addOption(data);
	}

	selObj.setName(id);
	selObj.setSelectedValue(value);
    selObj.dynamicButtonWidth();

	return selObj;
};

ZmPreferencesPage.prototype._setupComboBox =
function(id, setup, value) {
	value = this._prepareValue(id, setup, value);

	var params = {parent: this, id: "Prefs_ComboBox_" + id};

	var cboxObj = new DwtComboBox(params);
	this.setFormObject(id, cboxObj);

	var options = setup.options || setup.displayOptions || setup.choices || [];
	var isChoices = Boolean(setup.choices);
	for (var j = 0; j < options.length; j++) {
		var optValue = isChoices ? options[j].value : options[j];
		var optLabel = isChoices ? options[j].label : setup.displayOptions[j];
		optLabel = ZmPreferencesPage.__formatLabel(optLabel, optValue);
		cboxObj.add(optLabel, optValue, optValue == value);
	}

	cboxObj.setValue(value);

	return cboxObj;
};

ZmPreferencesPage.prototype._setupRadioGroup =
function(id, setup, value) {
	value = this._prepareValue(id, setup, value);

	var params = {parent: this, id: "Prefs_RadioGroup_" + id};
	var container = new DwtComposite(params);

	// build horizontally-oriented radio group, if needed
	var orient = setup.orientation || ZmPref.ORIENT_VERTICAL;
	var isHoriz = orient == ZmPref.ORIENT_HORIZONTAL;
	if (isHoriz) {
		var table, row, cell;

		table = document.createElement("TABLE");
		table.className = "ZmRadioButtonGroupHoriz";
		table.setAttribute('role', 'presentation');
		table.border = 0;
		table.cellPadding = 0;
		table.cellSpacing = 0;
		container.getHtmlElement().appendChild(table);

		row = table.insertRow(-1);
	}

	// add options
	var options = setup.options || setup.displayOptions || setup.choices;
	var isChoices = setup.choices;
	var isDisplayString = AjxUtil.isString(setup.displayOptions);
	var inputId = setup.inputId;
	
	var radioIds = {};
	var selectedId;
	var name = Dwt.getNextId();
	for (var i = 0; i < options.length; i++) {
		var optValue = isChoices ? options[i].value : options[i];
		var optLabel = isChoices ? options[i].label : (isDisplayString ? setup.displayOptions : setup.displayOptions[i]);
		optLabel = ZmPreferencesPage.__formatLabel(optLabel, optValue);
		var isSelected = value == optValue;

		var automationId  = AjxUtil.isArray(inputId) && inputId[i] ? inputId[i] : Dwt.getNextId();
		var radioBtn = new DwtRadioButton({parent:container, name:name, checked:isSelected, id: automationId});
		radioBtn.setText(optLabel);
		radioBtn.setValue(optValue);

		var radioId = radioBtn.getInputElement().id;
		radioIds[radioId] = radioBtn;
		if (isSelected) {
			radioBtn.setSelected(true);
            selectedId = radioId;
		}

		if (setup.validationFunction) {
			var valueToCheck = setup.valueFunction ? setup.valueFunction(optValue) : optValue;
			if (!setup.validationFunction(valueToCheck)) {
				radioBtn.setEnabled(false);
			}
		}

		if (isHoriz) {
			cell = row.insertCell(-1);
			cell.className = "ZmRadioButtonGroupCell";
			radioBtn.appendElement(cell);
		}
	}

	// store radio button group
	this.setFormObject(id, new DwtRadioButtonGroup(radioIds, selectedId));

	return container;
};

ZmPreferencesPage.prototype._setupCheckbox =
function(id, setup, value) {
	var params = {parent: this, checked: value, id: "Prefs_Checkbox_" + id};
	var checkbox = new DwtCheckbox(params);
	this.setFormObject(id, checkbox);
	var text = setup.displayFunc ? setup.displayFunc() : setup.displayName;
	var cboxLabel = ZmPreferencesPage.__formatLabel(text, value);
	checkbox.setText(cboxLabel);
	checkbox.setSelected(value);

	// TODO: Factor this out
	if (id == ZmSetting.MAIL_LOCAL_DELIVERY_DISABLED) {
		this._handleDontKeepCopyChange();
		checkbox.addSelectionListener(new AjxListener(this, this._handleDontKeepCopyChange));
	}

	return checkbox;
};

ZmPreferencesPage.prototype._setupInput =
function(id, setup, value) {
	value = this._prepareValue(id, setup, value);
	var params = {
		parent: this,
		type: setup.type || DwtInputField.STRING,
		initialValue: value,
		size: setup.cols || 40,
		rows: setup.rows,
		wrap: setup.wrap,
		maxLen:setup.maxLen,
		hint: setup.hint,
		label: setup.label,
		id: "Prefs_Input_" + id
	};
	var input = new DwtInputField(params);
	this.setFormObject(id, input);
	// TODO: Factor this out
	if (id == ZmSetting.MAIL_FORWARDING_ADDRESS) {
		this._handleDontKeepCopyChange();
	}

	return input;
};

ZmPreferencesPage.prototype._addImportWidgets =
function(containerDiv, settingId, setup) {
	var uri = appCtxt.get(ZmSetting.CSFE_UPLOAD_URI);

	var importDivId = this._htmlElId+"_import";
	var isAddrBookImport = settingId == ZmSetting.IMPORT;
	var data = {
		id: importDivId,
		action: uri,
		name: ZmPreferencesPage.IMPORT_FIELD_NAME,
		label: isAddrBookImport ? ZmMsg.importFromCSVLabel : ZmMsg.importFromICSLabel
	};
	containerDiv.innerHTML = AjxTemplate.expand("prefs.Pages#Import", data);

	this._uploadFormId = importDivId+"_form";
	this._attInputId = importDivId+"_input";

	// setup pseudo tab group
	this._enterTabScope();
	var tabGroup = new DwtTabGroup(importDivId+"_x-tabgroup");
	try {
		// set up import button
	var buttonDiv = document.getElementById(importDivId+"_button");
	var btnLabel = setup ? setup.displayName : ZmMsg._import;
	this._importBtn = this._addButton(buttonDiv, btnLabel, 100, new AjxListener(this, this._importButtonListener));
	if (settingId) {
		this._importBtn.setData(Dwt.KEY_ID, settingId);
	}

		// add other controls
		var inputEl = document.getElementById(this._attInputId);
		if (inputEl) {
			this._addControlTabIndex(inputEl, inputEl);
		}
		this._addTabLinks(containerDiv);

		// add pseudo tab group
		this._addControlsToTabGroup(tabGroup);
	}
	finally {
		this._exitTabScope();
		this._addControlTabIndex(containerDiv, new ZmPreferencesPage.__hack_TabGroupControl(tabGroup));
	}
};

ZmPreferencesPage.__hack_TabGroupControl =
function(tabGroup) {
	this.getTabGroupMember = function() { return tabGroup; };
};

ZmPreferencesPage.prototype._setupColor =
function(id, setup, value) {

	var params = {parent: this, id: "Prefs_ColorPicker_" + id};
	var picker = new DwtButtonColorPicker(params);
	picker.setImage("FontColor");
	picker.showColorDisplay(true);
	picker.setToolTipContent(ZmMsg.fontColor);
	picker.setColor(value);

	this.setFormObject(id, picker);

	return picker;
};

ZmPreferencesPage.prototype._addExportWidgets =
function(containerDiv, settingId, setup) {
	var exportDivId = this._htmlElId+"_export";
	containerDiv.innerHTML = AjxTemplate.expand("prefs.Pages#Export", exportDivId);

    //Export Options
	var format = settingId == "CAL_EXPORT" ? "ics" : "csv";
    var selFormat = null;
    var optionsDiv = document.getElementById(exportDivId+"_options");
    if(optionsDiv && (setup.options && setup.options.length > 0) ) {
        var selFormat = this._setupSelect(settingId, setup);
        this._replaceControlElement(optionsDiv, selFormat);
    }

    //Export Button
	var buttonDiv = document.getElementById(exportDivId+"_button");
	buttonDiv.setAttribute("tabindex", containerDiv.getAttribute("tabindex"));

	var btnLabel = setup.displayName || ZmMsg._export;
	var btn = this._addButton(buttonDiv, btnLabel, 110, new AjxListener(this, this._exportButtonListener, [format, selFormat]));
	btn.setData(Dwt.KEY_ID, settingId);
};

ZmPreferencesPage.prototype._setupCustom =
function(id, setup, value) {
	DBG.println("TODO: override ZmPreferences#_setupCustom");
};

ZmPreferencesPage.prototype._setupLocales =
function(id, setup, value) {
	var params = {parent: this, id: "Prefs_Locale_" + id};
	var button = new DwtButton(params);
	button.setSize(60, Dwt.DEFAULT);
	button.setMenu(new AjxListener(this, this._createLocalesMenu, [setup]));
	this._showLocale(value, button);

	this._dwtObjects[id] = button;

	return button;
};

//Part of bug# 80762 - Display the single locale item as a read-only label
ZmPreferencesPage.prototype._setupLocaleLabel =
function(id, setup, value) {
    var label = new DwtLabel({parent:this});
    label.setSize(60, Dwt.DEFAULT);
    this._showLocale(value, label);
    this._dwtObjects[id] = label;
    return label;
};

ZmPreferencesPage.prototype._setupMenuButton =
function(id, value, itemMap) {
	var button = new DwtButton({parent:this});
	button.setSize(60, Dwt.DEFAULT);
	button.setMenu(new AjxListener(this, this._createMenu, [button, itemMap]));
	this._showItem(value, itemMap, button);

	this._dwtObjects[id] = button;

	return button;
};

ZmPreferencesPage.prototype._showLocale =
function(localeId, button) {
	var locale = ZmLocale.localeMap[localeId] || ZmLocale.localeMap[localeId.substr(0, 2)];
	button.setImage(locale ? locale.getImage() : null);
	button.setText(locale ? locale.getNativeAndLocalName() : "");
	button._localeId = localeId;
};

ZmPreferencesPage.prototype._createMenu =
function(button, itemMap) {

	var menu = new DwtMenu({parent:button});

	var listener = this._itemSelectionListener.bind(this, button, itemMap);

	for (var id in itemMap) {
		var item = itemMap[id];
		this._createMenuItem(menu, item.id, item.name, listener);
	}
	return menu;
};

ZmPreferencesPage.prototype._createLocalesMenu =
function(setup) {

	var button = this._dwtObjects[ZmSetting.LOCALE_NAME];
	var result = new DwtMenu({parent:button});

	var listener = new AjxListener(this, this._localeSelectionListener);
	for (var language in ZmLocale.languageMap) {
		var languageObj = ZmLocale.languageMap[language];
		var locales = languageObj.locales;
		if (!locales) {
			this._createLocaleItem(result, languageObj, listener);
		}
		else if (locales.length > 0) {
			/* show submenu even if just one item, for cases such as Portugeuse (Brasil), since we want country (locale) specific items in the submenu level */
			var menuItem = new DwtMenuItem({parent:result, style:DwtMenuItem.CASCADE_STYLE});
			menuItem.setText(ZmLocale.languageMap[language].getNativeAndLocalName());
			var subMenu = new DwtMenu({parent:result, style:DwtMenu.DROPDOWN_STYLE});
			menuItem.setMenu(subMenu);
			for (var i = 0, count = locales.length; i < count; i++) {
				this._createLocaleItem(subMenu, locales[i], listener);
			}
		}
	}
	return result;
};

ZmPreferencesPage.prototype._createMenuItem =
function(parent, id, text, listener) {
	var item = new DwtMenuItem({parent:parent});
	item.setText(text);
	item._itemId = id;
	item.addSelectionListener(listener);
	return item;
};

ZmPreferencesPage.prototype._createLocaleItem =
function(parent, locale, listener) {
	var result = new DwtMenuItem({parent:parent});
	result.setText(locale.getNativeAndLocalName());
	if (locale.getImage()) {
		result.setImage(locale.getImage());
	}
	result._localeId = locale.id;
	result.addSelectionListener(listener);
	return result;
};

ZmPreferencesPage.prototype._showItem =
function(itemId, itemMap, button) {
	var item = itemMap[itemId];
	button.setImage(item && item.image || null);
	button.setText(item && item.name || "");
	button._itemId = itemId;
};

ZmPreferencesPage.prototype._itemSelectionListener =
function(button, itemMap, ev) {
	var item = ev.dwtObj;
	this._showItem(item._itemId, itemMap, button);
};

ZmPreferencesPage.prototype._localeSelectionListener =
function(ev) {
	var item = ev.dwtObj;
	var button = this._dwtObjects[ZmSetting.LOCALE_NAME];
	this._showLocale(item._localeId, button);
    this._showComposeDirection(item._localeId);
};

ZmPreferencesPage.prototype._handleDontKeepCopyChange = function(ev) {
	var input = this.getFormObject(ZmSetting.MAIL_FORWARDING_ADDRESS);
	var checkbox = this.getFormObject(ZmSetting.MAIL_LOCAL_DELIVERY_DISABLED);
	if (input && checkbox) {
		input.setRequired(checkbox.isSelected());
	}
};

// Popup the change password dialog.
ZmPreferencesPage.prototype._changePasswordListener =
function(ev) {
	appCtxt.getChangePasswordWindow(ev);
};

ZmPreferencesPage.prototype._exportButtonListener =
function(format, formatSelectObj, ev) {
	var settingId = ev.dwtObj.getData(Dwt.KEY_ID);

	//Get Format
	var subFormat = formatSelectObj? formatSelectObj.getValue() : null;

	var dialog = appCtxt.getChooseFolderDialog();
	dialog.reset();
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._exportOkCallback, this, [dialog, format, subFormat]);

	var omit = {};
	omit[ZmFolder.ID_TRASH] = true;
	var overviewId = dialog.getOverviewId(settingId);

	if (settingId == ZmSetting.EXPORT) {
		AjxDispatcher.require(["ContactsCore", "Contacts"]);
		dialog.popup({treeIds:			[ZmOrganizer.ADDRBOOK],
					  overviewId:		overviewId,
					  omit:				omit,
					  title:			ZmMsg.chooseAddrBook,
					  hideNewButton:	true,
					  appName:			ZmApp.CONTACTS,
					  description:		ZmMsg.chooseAddrBookToExport});
	} else {
		AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar", "CalendarAppt"]);
		dialog.popup({treeIds:			[ZmOrganizer.CALENDAR],
					  overviewId:		overviewId,
					  omit:				omit,
					  title:			ZmMsg.chooseCalendar,
					  hideNewButton:	true,
					  appName:			ZmApp.CALENDAR,
					  description:		ZmMsg.chooseCalendarToExport});
	}
};

ZmPreferencesPage.prototype._importButtonListener =
function(ev) {
	var settingId = this._importBtn.getData(Dwt.KEY_ID);
	var fileInput = document.getElementById(this._attInputId);
	var val = fileInput ? AjxStringUtil.trim(fileInput.value) : null;

	if (val) {
		var dialog = appCtxt.getChooseFolderDialog();
		dialog.reset();
		dialog.setTitle(ZmMsg._import);
		dialog.registerCallback(DwtDialog.OK_BUTTON, this._importOkCallback, this, dialog);

		var overviewId = [this.toString(), settingId].join("-");
		if (settingId == ZmSetting.IMPORT) {
			AjxDispatcher.require(["ContactsCore", "Contacts"]);
			var noNew = !appCtxt.get(ZmSetting.NEW_ADDR_BOOK_ENABLED);
			var omit = {};
			omit[ZmFolder.ID_TRASH] = true;
			dialog.popup({treeIds:[ZmOrganizer.ADDRBOOK], title:ZmMsg.chooseAddrBook, overviewId: overviewId,
						  description:ZmMsg.chooseAddrBookToImport, skipReadOnly:true, hideNewButton:noNew, omit:omit});
		} else {
			AjxDispatcher.require(["MailCore", "CalendarCore", "Calendar"]);
			dialog.popup({treeIds:[ZmOrganizer.CALENDAR], title:ZmMsg.chooseCalendar, overviewId: overviewId, description:ZmMsg.chooseCalendarToImport, skipReadOnly:true});
		}
	}
	else {
		var params = {
			msg:	ZmMsg.importErrorMissingFile,
			level:	ZmStatusView.LEVEL_CRITICAL
		};
		appCtxt.setStatusMsg(params);
	}
};

ZmPreferencesPage.prototype._importOkCallback =
function(dialog, folder) {
	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
	if (folder && folder.id && folder.id != rootId) {
		dialog.popdown();
		this._importBtn.setEnabled(false);

		var callback = new AjxCallback(this, this._importDoneCallback, folder.id);
		var um = appCtxt.getUploadManager();
		window._uploadManager = um;
		try {
			um.execute(callback, document.getElementById(this._uploadFormId));
		} catch (ex) {
			if (ex.msg) {
				var d = appCtxt.getMsgDialog();
				d.setMessage(ex.msg, DwtMessageDialog.CRITICAL_STYLE);
				d.popup();
			}

			this._importBtn.setEnabled(true);
			return true;
		}
	}
};

ZmPreferencesPage.prototype._importDoneCallback =
function(folderId, status, aid) {
	var appCtlr = appCtxt.getAppController();
	var settingId = this._importBtn.getData(Dwt.KEY_ID);

	if (status == 200) {
		appCtlr.setStatusMsg(ZmMsg.importingContacts);

		// send the import request w/ the att Id to the server per import setting
		if (settingId == ZmSetting.IMPORT)
		{
			var soapDoc = AjxSoapDoc.create("ImportContactsRequest", "urn:zimbraMail");
			var method = soapDoc.getMethod();
			method.setAttribute("ct", "csv"); // always "csv" for now
			method.setAttribute("l", folderId);
			var content = soapDoc.set("content", "");
			content.setAttribute("aid", aid);
		} else {
			var soapDoc = AjxSoapDoc.create("ImportAppointmentsRequest", "urn:zimbraMail");
			var method = soapDoc.getMethod();
			method.setAttribute("ct", "ics");
			method.setAttribute("l", folderId);
			var content = soapDoc.set("content", "");
			content.setAttribute("aid", aid);
		}
		var respCallback = new AjxCallback(this, this._handleResponseFinishImport, [aid, settingId]);
		var errorCallback = new AjxCallback(this, this._handleErrorFinishImport);
		appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true,
													  callback:respCallback, errorCallback:errorCallback,
													  timeout:ZmPreferencesPage.IMPORT_TIMEOUT});
	} else {
		var msg = (status == AjxPost.SC_NO_CONTENT)
			? ZmMsg.errorImportNoContent
			: (AjxMessageFormat.format(ZmMsg.errorImportStatus, status));
        appCtlr.setStatusMsg(msg, ZmStatusView.LEVEL_CRITICAL);
		this._importBtn.setEnabled(true);
	}
};

ZmPreferencesPage.prototype._handleResponseFinishImport =
function(aid, settingId, result) {
	var msg;
	if (settingId == ZmSetting.IMPORT) {
		var resp = result.getResponse().ImportContactsResponse.cn[0];
		msg = AjxMessageFormat.format(ZmMsg.contactsImportedResult, Number(resp.n));
	} else {
		var resp = result.getResponse().ImportAppointmentsResponse.appt[0];
		msg = AjxMessageFormat.format(ZmMsg.apptsImportedResult, Number(resp.n));
	}
	appCtxt.getAppController().setStatusMsg(msg);
	this._importBtn.setEnabled(true);
};

ZmPreferencesPage.prototype._handleErrorFinishImport =
function(ex) {
	this._importBtn.setEnabled(true);

	if (ex.code == ZmCsfeException.MAIL_UNABLE_TO_IMPORT_CONTACTS ||
		ex.code == ZmCsfeException.MAIL_UNABLE_TO_IMPORT_APPOINTMENTS)
	{
		var errDialog = appCtxt.getErrorDialog();
		errDialog.setMessage(ex.getErrorMsg(), ex.msg, DwtMessageDialog.WARNING_STYLE);
		errDialog.popup();
		return true;
	}
	return false;
};

ZmPreferencesPage.prototype._exportOkCallback =
function(dialog, format, subFormat, folder) {
	var rootId = ZmOrganizer.getSystemId(ZmOrganizer.ID_ROOT);
	if (folder && folder.id && folder.id != rootId) {
		var portPrefix = (location.port == "" || location.port == "80")
			? ""
			: (":" + location.port);
		var folderName = folder._systemName || AjxStringUtil.urlEncode(folder.getPath());
		var username = appCtxt.multiAccounts ? (AjxStringUtil.urlComponentEncode(appCtxt.get(ZmSetting.USERNAME))) : "~";
		var uri = [
			location.protocol, "//", location.hostname, portPrefix, "/service/home/",
			username, "/", folderName,
			"?auth=co&fmt=", format,
			subFormat ? "&"+format+"fmt="+subFormat : "" // e.g. csvfmt=zimbra-csv
		].join("");
		window.open(uri, "_blank");

		dialog.popdown();
	}
};

// Reset the form values to the pref defaults. Note that the pref defaults aren't the
// values that the user last had, they're the values that the prefs have before the
// user ever touches them.
ZmPreferencesPage.prototype._resetListener =
function(ev) {
	this.reset(true);
	appCtxt.setStatusMsg(ZmMsg.defaultsRestored);
};

/**
 * Returns true if any of the specified prefs are enabled (or have no preconditions).
 */
ZmPreferencesPage.prototype._isEnabled = function(prefId1 /* ..., prefIdN */) {

	for (var i = 0; i < arguments.length; i++) {
		var prefId = arguments[i];

		// setting not created (its app is disabled)
		if (!prefId) { return false; }

		if (!appCtxt.getActiveAccount().isMain && ZmSetting.IS_GLOBAL[prefId]) {
			return false;
		}

		var setup = ZmPref.SETUP[prefId],
			prefPrecondition = setup && setup.precondition;
		if (appCtxt.checkPrecondition(prefPrecondition  || prefId, prefPrecondition && setup.preconditionAny)) {
			return true;
		}
	}
	return false;
};

ZmPreferencesPage.prototype._expandField =
function(data, prefId) {
	var templateId = this._section.templateId.replace(/#.*$/, "#"+prefId);
	return AjxTemplate.expand(templateId, data);
};

ZmPreferencesPage.prototype._showComposeDirection =
function(localeId) {
    var button = this._dwtObjects[ZmSetting.COMPOSE_INIT_DIRECTION];
    var checkbox = this._dwtObjects[ZmSetting.SHOW_COMPOSE_DIRECTION_BUTTONS];
    if ( ZmLocale.RTLLANGUAGES.hasOwnProperty(localeId) ){
        button.setSelectedValue(ZmSetting.RTL);
        checkbox.setSelected(true);
    }
    else {
        button.setSelectedValue(ZmSetting.LTR);
        checkbox.setSelected(false);
    }
};
//
// Private functions
//

/**
 * Formats a label. If the label contains a replacement parameter (e.g. {0}),
 * then it is formatted using AjxMessageFormat with the current value for this
 * label.
 *
 * @private
 */
ZmPreferencesPage.__formatLabel =
function(prefLabel, prefValue) {
	prefLabel = prefLabel || "";
	return prefLabel.match(/\{/) ? AjxMessageFormat.format(prefLabel, prefValue) : prefLabel;
};

ZmPreferencesPage.fontMap = {};

ZmPreferencesPage._createMenuItem =
function(id, name, itemMap) {
	return itemMap[id] = {id: id, name: name};
};

ZmPreferencesPage._createMenuItem(ZmSetting.FONT_SYSTEM, ZmMsg.fontSystem, ZmPreferencesPage.fontMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_MODERN, ZmMsg.fontModern, ZmPreferencesPage.fontMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_CLASSIC, ZmMsg.fontClassic, ZmPreferencesPage.fontMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_WIDE, ZmMsg.fontWide, ZmPreferencesPage.fontMap);

ZmPreferencesPage.fontSizeMap = {};

ZmPreferencesPage._createMenuItem(ZmSetting.FONT_SIZE_SMALL, ZmMsg.fontSizeSmall, ZmPreferencesPage.fontSizeMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_SIZE_NORMAL, ZmMsg.fontSizeNormal, ZmPreferencesPage.fontSizeMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_SIZE_LARGE, ZmMsg.fontSizeLarge, ZmPreferencesPage.fontSizeMap);
ZmPreferencesPage._createMenuItem(ZmSetting.FONT_SIZE_LARGER, ZmMsg.fontSizeExtraLarge, ZmPreferencesPage.fontSizeMap);
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmShortcutsPage")) {
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
 * Creates an empty shortcuts page.
 * @constructor
 * @class
 * This class represents a page that allows the user to specify custom
 * keyboard shortcuts. Currently, we limit custom shortcuts to actions
 * that involve a folder, tag, or saved search. The user specifies a 
 * number to refer to a particular organizer, which binds the shortcut
 * to that organizer. For example, the user might assign the folder
 * "test" the number 3, and then the shortcut "M,3" would move mail to
 * that folder.
 * <p>
 * Only a single pref (the user's shortcuts gathered together in a string)
 * is represented.</p>
 *
 * @author Conrad Damon
 * 
 * @param {DwtControl}	parent			the containing widget
 * @param {object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends		ZmPreferencesPage
 * 
 * @private
 */
ZmShortcutsPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);
};

ZmShortcutsPage.prototype = new ZmPreferencesPage;
ZmShortcutsPage.prototype.constructor = ZmShortcutsPage;

ZmShortcutsPage.prototype.toString =
function () {
    return "ZmShortcutsPage";
};

ZmShortcutsPage.prototype.hasResetButton =
function() {
	return false;
};

ZmShortcutsPage.prototype._createControls =
function(deferred) {

	if (!appCtxt.getKeyboardMgr().__keyMapMgr) {
		if (!deferred) {
			appCtxt.getAppController().addListener(ZmAppEvent.POST_STARTUP, new AjxListener(this, this._createControls, [true]));
		}
		return;
	}

	var button = new DwtButton({parent:this});
	button.setText(ZmMsg.print);
	var printButtonId = this._htmlElId + "_SHORTCUT_PRINT";
	var buttonDiv = document.getElementById(printButtonId);
	buttonDiv.appendChild(button.getHtmlElement());
	button.addSelectionListener(new AjxListener(this, this._printListener));

	var col1 = {};
	col1.title = ZmMsg.shortcutsApp;
	col1.type = ZmShortcutList.TYPE_APP;
	col1.sort = true;
	var list = new ZmShortcutList({style:ZmShortcutList.PREFS_STYLE, cols:[col1, ZmShortcutList.COL_SYS]});
	var listId = this._htmlElId + "_SHORTCUT_LIST";
	var listDiv = document.getElementById(listId);
	listDiv.innerHTML = list.getContent();

	ZmPreferencesPage.prototype._createControls.call(this);
};

ZmShortcutsPage.prototype._printListener =
function() {
	var args = "height=650,width=900,location=no,menubar=yes,resizable=yes,scrollbars=yes,toolbar=no";
	var newWin = window.open("", "_blank", args);

	var col1 = {}, col2 = {};
	col1.type = col2.type = ZmShortcutList.TYPE_APP;
	col1.maps = ["global", "mail"];
	col2.omit = ["global", "mail"];
	col2.sort = true;

	var list = new ZmShortcutList({style:ZmShortcutList.PRINT_STYLE, cols:[col1, col2, ZmShortcutList.COL_SYS]});

	var html = [], i = 0;
	html[i++] = "<html><head>";
	html[i++] = "<link href='" + appContextPath + "/css/zm.css' rel='stylesheet' type='text/css' />";
	html[i++] = "</head><body>";
	html[i++] = "<div class='ShortcutsPrintHeader'>" + ZmMsg.keyboardShortcuts + "</div>";

	var doc = newWin.document;
	doc.write(html.join(""));

	var content = list.getContent();
	doc.write(content);
	doc.write("</body></html>");

	doc.close();
};


/**
 * Displays shortcuts in some sort of list.
 * 
 * @param params
 * @private
 */
ZmShortcutList = function(params) {

	this._style = params.style;
    if (!ZmShortcutList.modifierKeys) {
        ZmShortcutList.modifierKeys = this._getModifierKeys();
    }
	this._content = this._renderShortcuts(params.cols);
};

ZmShortcutList.prototype = new DwtControl;
ZmShortcutList.prototype.constructor = ZmShortcutList;

ZmShortcutList.PREFS_STYLE = "prefs";
ZmShortcutList.PRINT_STYLE = "print";
ZmShortcutList.PANEL_STYLE = "panel";

ZmShortcutList.TYPE_APP = "APP";
ZmShortcutList.TYPE_SYS = "SYS";

ZmShortcutList.COL_SYS = {};
ZmShortcutList.COL_SYS.title = ZmMsg.shortcutsSys;
ZmShortcutList.COL_SYS.type = ZmShortcutList.TYPE_SYS;
ZmShortcutList.COL_SYS.sort = true;
ZmShortcutList.COL_SYS.maps = ["button", "menu", "list", "tree", "dialog", "toolbarHorizontal",
							   "editor", "tabView"];

ZmShortcutList.prototype.getContent =
function() {
	return this._content;
};

// Set up map for interpolating modifier keys
ZmShortcutList.prototype._getModifierKeys = function() {

    var modifierKeys = {},
        regex = /^keys\.\w+\.display$/,
        keys = AjxUtil.filter(AjxUtil.keys(AjxKeys), function(key) {
            return regex.test(key);
        });

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i],
            parts = key.split('.');

            modifierKeys[parts[1]] = AjxKeys[key];
    }

    return modifierKeys;
};

/**
 * Displays shortcut documentation as a set of columns.
 *
 * @param cols		[array]		list of columns; each column may have:
 *        maps		[array]*	list of maps to show in this column; if absent, show all maps
 *        omit		[array]*	list of maps not to show; all others are shown
 *        title		[string]*	text for column header
 *        type		[constant]	app or sys
 *        sort		[boolean]*	if true, sort list of maps based on .sort values in props file
 *        
 * @private
 */
ZmShortcutList.prototype._renderShortcuts = function(cols) {

	var html = [];
	var i = 0;
	html[i++] = "<div class='ZmShortcutList'>";
	for (j = 0; j < cols.length; j++) {
		i = this._getKeysHtml(cols[j], html, i);
	}
	html[i++] = "</div>";

	return html.join("");
};

ZmShortcutList.prototype._getKeysHtml = function(params, html, i) {

	var keys = (params.type == ZmShortcutList.TYPE_APP) ? ZmKeys : AjxKeys;
	var kmm = appCtxt.getKeyboardMgr().__keyMapMgr;
	var mapDesc = {}, mapsFound = [], mapsHash = {}, keySequences = {}, mapsToShow = {}, mapsToOmit = {};
	if (params.maps) {
		for (var k = 0; k < params.maps.length; k++) {
			mapsToShow[params.maps[k]] = true;
		}
	}
	if (params.omit) {
		for (var k = 0; k < params.omit.length; k++) {
			mapsToOmit[params.omit[k]] = true;
		}
	}
	for (var propName in keys) {
		var propValue = keys[propName];
		if (!propValue || (typeof propValue != "string")) { continue; }
		var parts = propName.split(".");
		var map = parts[0];
        if ((params.maps && !mapsToShow[map]) || (params.omit && mapsToOmit[map])) { continue; }
		var isMap = (parts.length == 2);
		var action = isMap ? null : parts[1];
		var field = parts[parts.length - 1];

		if (action && (map != ZmKeyMap.MAP_CUSTOM)) {
			// make sure shortcut is defined && available
			var ks = kmm.getKeySequences(map, action);
			if (!(ks && ks.length)) { continue; }
		}
		if (field == "description") {
			if (isMap) {
				mapsFound.push(map);
				mapsHash[map] = true;
				mapDesc[map] = propValue;
			} else {
				keySequences[map] = keySequences[map] || [];
				keySequences[map].push([map, action].join("."));
			}
		}
	}

	var sortFunc = function(keyA, keyB) {
		var sortPropNameA = [keyA, "sort"].join(".");
		var sortPropNameB = [keyB, "sort"].join(".");
		var sortA = keys[sortPropNameA] ? Number(keys[sortPropNameA]) : 0;
		var sortB = keys[sortPropNameB] ? Number(keys[sortPropNameB]) : 0;
		return (sortA > sortB) ? 1 : (sortA < sortB) ? -1 : 0;
	}
	var maps = [];
	if (params.sort || !params.maps) {
		mapsFound.sort(sortFunc);
		maps = mapsFound;
	} else {
		for (var j = 0; j < params.maps.length; j++) {
			var map = params.maps[j];
			if (mapsHash[map]) {
				maps.push(map);
			}
		}
	}

	for (var j = 0; j < maps.length; j++) {
		var map = maps[j];
		if (!keySequences[map]) { continue; }
		var mapDesc = keys[[map, "description"].join(".")];
		html[i++] = "<dl class='" + ZmShortcutList._getClass("shortcutListMap", this._style) + "'>";
		html[i++] = "<lh class='title' role='header' aria-level='3'>" + mapDesc + "</lh>";

		var actions = keySequences[map];
		if (actions && actions.length) {
			actions.sort(sortFunc);
			for (var k = 0; k < actions.length; k++) {
				var action = actions[k];
				var ks = ZmShortcutList._formatDisplay(keys[[action, "display"].join(".")]);
				var desc = keys[[action, "description"].join(".")];
				var keySeq = ks.split(/\s*;\s*/);
				var keySeq1 = [];
				for (var m = 0; m < keySeq.length; m++) {
					html[i++] = "<dt>" + ZmShortcutList._formatKeySequence(keySeq[m], this._style) + "</dt>";
					html[i++] = "<dd>" + desc + "</dd>";
				}
			}
		}
        html[i++] = "</dl>";
	}

	return i;
};

// Replace {mod} with the proper localized and/or platform-specific version, eg
// replace {meta} with Cmd, or, in German, {ctrl} with Strg.
ZmShortcutList._formatDisplay = function(keySeq) {
    return keySeq.replace(/\{(\w+)\}/g, function(match, p1) {
        return ZmShortcutList.modifierKeys[p1];
    });
};


// Translates a key sequence into a friendlier, more readable version
ZmShortcutList._formatKeySequence =
function(ks, style) {

	var html = [];
	var i = 0;
	html[i++] = "<span class='" + ZmShortcutList._getClass("shortcutKeyCombo", style) + "'>";

	var keys = ((ks[ks.length - 1] != DwtKeyMap.SEP) && (ks != DwtKeyMap.SEP)) ? ks.split(DwtKeyMap.SEP) : [ks];
	for (var j = 0; j < keys.length; j++) {
		var key = keys[j];
		var parts = key.split(DwtKeyMap.JOIN);
		var baseIdx = parts.length - 1;
		// base can be: printable char or escaped char name (eg "Comma")
		var base = parts[baseIdx];
		if (ZmKeyMap.ENTITY[base]) {
			base = ZmKeyMap.ENTITY[base];
		}
		parts[baseIdx] = base;
		var newParts = [];
		for (var k = 0; k < parts.length; k++) {
			newParts.push(ZmShortcutList._formatKey(parts[k], style));
		}
		html[i++] = newParts.join("+");
	}
	html[i++] = "</span>";

	return html.join("");
};

ZmShortcutList._formatKey =
function(key, style) {
	return ["<span class='", ZmShortcutList._getClass("shortcutKey", style), "'>", key, "</span>"].join("");
};

/**
 * Returns a string with two styles in it, a base style and a modifier, eg "shortcutListMap prefs".
 *
 * @param base		[string]	base style
 * @param style		[string]	style modifier
 *
 * @private
 */
ZmShortcutList._getClass =
function(base, style) {
	return [base, style].join(" ");
};


ZmShortcutsPanel = function() {

	ZmShortcutsPanel.INSTANCE = this;
	var className = appCtxt.isChildWindow ? "ZmShortcutsWindow" : "ZmShortcutsPanel";
	DwtControl.call(this, {parent:appCtxt.getShell(), className:className, posStyle:Dwt.ABSOLUTE_STYLE});

	this._createHtml();

	this._tabGroup = new DwtTabGroup(this.toString());
	this._tabGroup.addMember(this);
};

ZmShortcutsPanel.prototype = new DwtControl;
ZmShortcutsPanel.prototype.constructor = ZmShortcutsPanel;

ZmShortcutsPanel.prototype.toString =
function() {
	return "ZmShortcutsPanel";
}

ZmShortcutsPanel.prototype.popup =
function(cols) {
	var kbMgr = appCtxt.getKeyboardMgr();
	kbMgr.pushDefaultHandler(this);
	this._cols = cols;
	Dwt.setZIndex(appCtxt.getShell()._veilOverlay, Dwt.Z_VEIL);
	var list = new ZmShortcutList({style:ZmShortcutList.PANEL_STYLE, cols:cols});
	this._contentDiv.innerHTML = list.getContent();
	if (!appCtxt.isChildWindow) {
		this._position();
	}
	this._contentDiv.scrollTop = 0;
	kbMgr.pushTabGroup(this._tabGroup);
};

ZmShortcutsPanel.prototype.popdown =
function(maps) {
	var kbMgr = appCtxt.getKeyboardMgr();
	kbMgr.popTabGroup(this._tabGroup);
	this.setLocation(Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
	Dwt.setZIndex(appCtxt.getShell()._veilOverlay, Dwt.Z_HIDDEN);
	kbMgr.popDefaultHandler();
};

ZmShortcutsPanel.prototype.handleKeyEvent =
function(ev) {
	if (ev && ev.charCode === 27) {
		ZmShortcutsPanel.closeCallback();
		return true;
	}
};

ZmShortcutsPanel.prototype._createHtml = function() {

	var headerId = [this._htmlElId, "header"].join("_");
	var containerId = [this._htmlElId, "container"].join("_");
	var contentId = [this._htmlElId, "content"].join("_");
	var html = [];
	var i = 0;
	html[i++] = "<div class='ShortcutsPanelHeader' id='" + headerId + "'>";
	html[i++] = "<div class='title' role='header' aria-level='2'>" + ZmMsg.keyboardShortcuts + "</div>";
	// set up HTML to create two columns using floats
	html[i++] = "<div class='container' id='" + containerId + "'>";
	html[i++] = "<div class='description'>" + ZmMsg.shortcutsCurrent + "</div>";
	html[i++] = "<div class='actions'>";
	html[i++] = "<span class='link' onclick='ZmShortcutsPanel.closeCallback();'>" + ZmMsg.close + "</span>";
	if (!appCtxt.isChildWindow) {
		html[i++] = "<br /><span class='link' onclick='ZmShortcutsPanel.newWindowCallback();'>" + ZmMsg.newWindow + "</span>";
	}
	html[i++] = "</div></div></div>";
	html[i++] = "<hr />";
	html[i++] = "<div id='" + contentId + "' style='overflow:auto;width: 100%;'></div>";

	this.getHtmlElement().innerHTML = html.join("");
	this._headerDiv = document.getElementById(headerId);
	this._contentDiv = document.getElementById(contentId);
	var headerHeight = Dwt.getSize(this._headerDiv).y;
	var containerHeight = Dwt.getSize(containerId).y;
	var h = this.getSize().y - headerHeight - containerHeight;
	Dwt.setSize(this._contentDiv, Dwt.DEFAULT, h - 20);
	this.setZIndex(Dwt.Z_DIALOG);
};

ZmShortcutsPanel.closeCallback =
function() {
	if (appCtxt.isChildWindow) {
		window.close();
	} else {
		ZmShortcutsPanel.INSTANCE.popdown();
	}
};

ZmShortcutsPanel.newWindowCallback =
function() {
	var newWinObj = appCtxt.getNewWindow(false, 820, 650);
	if (newWinObj) {
		newWinObj.command = "shortcuts";
		newWinObj.params = {cols:ZmShortcutsPanel.INSTANCE._cols};
	}
	ZmShortcutsPanel.closeCallback();
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmBackupPage")) {
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
 * Creates a Back-up preference page.
 * @constructor
 * @class ZmBackupPage
 * This class represents a page that allows the user to set preferences on backup
 * For Instance, How often user wants to backup data and list of accounts user wants to back-up
 *
 * @author KK
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 *
 * @extends		ZmPreferencesPage
 * @private
 */
ZmBackupPage = function(parent, section, controller) {
    ZmPreferencesPage.call(this, parent, section, controller);
    //this.backupDetailsLoaded = false;
};

ZmBackupPage.prototype = new ZmPreferencesPage;
ZmBackupPage.prototype.constructor = ZmBackupPage;

ZmBackupPage.prototype.toString =
function () {
    return "ZmBackupPage";
};

ZmBackupPage.prototype.showMe =
function(){
    ZmPreferencesPage.prototype.showMe.call(this);
    if (this._acctListView) {
        var s = this._acctListView.getSelection();
        this._acctListView.set(this.getAccounts()._vector.clone());
        if (s && s[0]) {
            this._acctListView.setSelection(s[0]);
        }
    }

    if (this._restoreListView) {
        var r = this._restoreListView.getSelection();
        this._restoreListView.set(this.getBackups(true)._vector.clone());
        if (r && r[0]) {
            this._restoreListView.setSelection(r[0]);
        }
    }
};


/**
 * @private
 */
ZmBackupPage.prototype._setupCustom =
function(id, setup, value) {

    if (id == ZmSetting.OFFLINE_BACKUP_ACCOUNT_ID) {
        this._acctListView = new ZmPrefAcctListView(this, this._controller);
        return this._acctListView;
    }

    if (id == ZmSetting.OFFLINE_BACKUP_RESTORE) {
        this._restoreListView = new ZmPrefBackupListView(this, this._controller);
        return this._restoreListView;
    }

    return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

ZmBackupPage.prototype._createControls =
function() {

    // add "Backup" button
    this._backupButton = new DwtButton({parent:this, parentElement: this._htmlElId+"_button"});
    this._backupButton.setText(ZmMsg.offlineBackUpButton);
    this._backupButton.addSelectionListener(new AjxListener(this, this._handleBackupAccountsButton));

    this._restoreButton = new DwtButton({parent:this, parentElement: this._htmlElId+"_restore_button"});
    this._restoreButton.setText(ZmMsg.offlineBackUpRestore);
    this._restoreButton.addSelectionListener(new AjxListener(this, this._handleRestoreBackupButton));

    ZmPreferencesPage.prototype._createControls.apply(this, arguments);
};

ZmBackupPage.prototype._handleBackupAccountsButton =
function() {
    this._backupButton.setEnabled(false);

    var accts = this.getAccounts()._vector.getArray();

    var settingsObj = appCtxt.getSettings();
    var setting = settingsObj.getSetting(ZmSetting.OFFLINE_BACKUP_ACCOUNT_ID);

    var checked = [];
    for (var i = 0; i < accts.length; i++) {
        if (accts[i].active) {
            checked.push(accts[i].id);
        }
    }
    if(checked.length < 1) {
        this._backupButton.setEnabled(true);
        return;
    }

    setting.setValue(checked);

    var soapDoc = AjxSoapDoc.create("BatchRequest", "urn:zimbra", null);
    soapDoc.setMethodAttribute("onerror", "continue");
    for (var k=0; k<checked.length; k++) {
        var requestNode = soapDoc.set("AccountBackupRequest",null,null,"urn:zimbraOffline");
        requestNode.setAttribute("id", checked[k]);
    }

    var params = {
        soapDoc: soapDoc,
        asyncMode: true,
        errorCallback: null,
        accountName: appCtxt.accountList.mainAccount.name
    };

    params.callback = new AjxCallback(this, this._handleBackupStarted);
    var appController = appCtxt.getAppController();
    appController.sendRequest(params);
};

ZmBackupPage._handleBackupNowLink =
function(id, obj) {
    var backupPage = DwtControl.fromElementId(obj);
    backupPage._handleBackupNowLink(id);
};

ZmBackupPage.prototype._handleBackupNowLink =
function(id) {

    try{
        var soapDoc = AjxSoapDoc.create("AccountBackupRequest", "urn:zimbraOffline");
        var method = soapDoc.getMethod();
        method.setAttribute("id", id);
        var respCallback = new AjxCallback(this, this._handleBackupAcctStarted , id);
        var params = {
            soapDoc:soapDoc,
            callback:respCallback,
            asyncMode:true
        };
        appCtxt.getAppController().sendRequest(params);
    }
    finally { // do
        return false;
    }
};

ZmBackupPage.prototype._handleBackupAcctStarted =
function(id) {
    appCtxt.setStatusMsg(AjxMessageFormat.format(ZmMsg.offlineBackupStartedForAcct, appCtxt.accountList.getAccount(id).getDisplayName()));
};

ZmBackupPage.prototype._handleBackupStarted =
function(result) {
    appCtxt.setStatusMsg(ZmMsg.offlineBackUpStarted);
    this._backupButton.setEnabled(true);
};

ZmBackupPage.prototype._handleRestoreBackupButton =
function() {

    this._restoreButton.setEnabled(false);

    var backups = this.getBackups()._vector.getArray();
    var sel = [];
    for (var i = 0; i < backups.length; i++) {
        if (backups[i].active) {
            var bk = backups[i];
            sel.push(backups[i]);
            break;
        }
    }

    if(sel.length < 1) {
        this._restoreButton.setEnabled(true);
        return;
    }

    var soapDoc = AjxSoapDoc.create("AccountRestoreRequest", "urn:zimbraOffline");
    var method = soapDoc.getMethod();
    method.setAttribute("id", sel[0].acct);
    method.setAttribute("time", sel[0].timestamp);
    var respCallback = new AjxCallback(this, this._handleAccountRestoreSent, [sel[0].acct]);
    var params = {
        soapDoc:soapDoc,
        callback:respCallback,
        asyncMode:true
    };
    appCtxt.getAppController().sendRequest(params);

};

ZmBackupPage.prototype._handleAccountRestoreSent =
function(id, resp) {

    this._restoreButton.setEnabled(true);
    if(resp._data.AccountRestoreResponse.status == "restored") {
        appCtxt.setStatusMsg(AjxMessageFormat.format(ZmMsg.offlineBackupRestored, appCtxt.accountList.getAccount(id).name));
    }
};

ZmBackupPage.prototype.addCommand  =
function(batchCommand) {

    var soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount");
    var accts = this.getAccounts()._vector.getArray();

    var settingsObj = appCtxt.getSettings();
    var setting = settingsObj.getSetting(ZmSetting.OFFLINE_BACKUP_ACCOUNT_ID);

    var checked = [];
    for (var i = 0; i < accts.length; i++) {
        if (accts[i].active) {
            checked.push(accts[i].id);
        }
    }
    var node = soapDoc.set("pref", checked.join(","));
    node.setAttribute("name", "zimbraPrefOfflineBackupAccountId");
    setting.setValue(checked.join(", "));
    batchCommand.addNewRequestParams(soapDoc);
};

/**
 * Gets the account preferences.
 *
 * @return	{ZmPrefAccounts}	the accounts
 *
 * @private
 */


ZmBackupPage.prototype.getAccounts =
function() {
    if (!this._accounts) {
        this._accounts = ZmBackupPage._getAccounts();
    }
    return this._accounts;
};


ZmBackupPage._getAccounts =
function() {
    var savedAccounts = appCtxt.get(ZmSetting.OFFLINE_BACKUP_ACCOUNT_ID);
    savedAccounts = (savedAccounts && savedAccounts.length) ? savedAccounts.split(",") : [];
    var accounts = new ZmPrefAccounts();
    var visAccts = appCtxt.accountList.visibleAccounts;
    for (var i=0; i< visAccts.length; i++) {
        var name =  visAccts[i].getDisplayName();
        var desc = visAccts[i].name;
        var id = visAccts[i].id;

        loop1: for (var k=0; k < savedAccounts.length ; k++)  {
                var checked = (id == AjxStringUtil.trim(savedAccounts[k]));
                if(checked) { break loop1; }
            }
        accounts.addPrefAccount(new ZmPrefAccount(name, checked, desc, id));
    }
    return accounts;
};

ZmBackupPage.prototype._isChecked =
function(name) {
    var z = this.getAccounts().getPrefAccountByName(name);
    return (z && z.active);
};

ZmBackupPage.prototype.isDirty =
function() {
    var allAccountss = this.getAccounts();
    var r = false;
    var arr = allAccountss._vector.getArray();
    for (var i = 0; i < arr.length; i++) {
        if (arr[i]._origStatus != arr[i].active) {
            r = true;
            break;
        }
    }
    return r;
};


/**
 * ZmPrefAcctListView
 *
 * @param parent
 * @param controller
 * @private
 */
ZmPrefAcctListView = function(parent, controller) {

    DwtListView.call(this, {
        parent: parent,
        className: "ZmFilterListView",
        headerList: this._getHeaderList(),
        view: ZmId.OFFLINE_BACKUP_ACCOUNT_ID
    });

    this._controller = controller;
    this.setMultiSelect(false); // single selection only
    this._internalId = AjxCore.assignId(this);
};

ZmPrefAcctListView.COL_ACTIVE	= "ac";
ZmPrefAcctListView.COL_NAME	= "na";
ZmPrefAcctListView.COL_DESC	= "ds";
ZmPrefAcctListView.COL_ACTION	= "an";
ZmPrefAcctListView.CHECKBOX_PREFIX = "_accCheckbox";


ZmPrefAcctListView.prototype = new DwtListView;
ZmPrefAcctListView.prototype.constructor = ZmPrefAcctListView;

ZmPrefAcctListView.prototype.toString =
function() {
    return "ZmPrefAcctListView";
};

ZmPrefAcctListView.prototype.set =
function(list) {
    this._checkboxIds = [];
    DwtListView.prototype.set.call(this, list);
    this._handleAccts();
};

ZmPrefAcctListView.prototype._handleAccts = function(evt) {
    this._acctsLoaded = true;
    var item = {};
    var visAccts = this.parent.getAccounts()._vector.getArray();
    for (var i=0; i< visAccts.length; i++) {
        item.name =  visAccts[i].name;
        item.desc = visAccts[i].desc;
        this.setCellContents(item, ZmPrefAcctListView.COL_NAME, AjxStringUtil.htmlEncode(AjxStringUtil.trim(item.name)));
        this.setCellContents(item, ZmPrefAcctListView.COL_DESC, AjxStringUtil.htmlEncode(item.desc));
    }
};

ZmPrefAcctListView.prototype.setCellContents = function(item, field, html) {
    var el = this.getCellElement(item, field);
    if (!el) { return; }
    el.innerHTML = html;
};

ZmPrefAcctListView.prototype.getCellElement = function(item, field) {
    return document.getElementById(this._getCellId(item, field));
};

ZmPrefAcctListView.prototype._getCellId = function(item, field, params) {
    return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_CELL, "accts", AjxStringUtil.trim(item.name), field);
};

ZmPrefAcctListView.prototype._getHeaderList =
function() {
    return [
        (new DwtListHeaderItem({field:ZmPrefAcctListView.COL_ACTIVE, text:ZmMsg.active, width:ZmMsg.COLUMN_WIDTH_ACTIVE})),
        (new DwtListHeaderItem({field:ZmPrefAcctListView.COL_NAME, text:ZmMsg.name, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV})),
        (new DwtListHeaderItem({field:ZmPrefAcctListView.COL_DESC, text:ZmMsg.emailAddr, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV})),
        (new DwtListHeaderItem({field:ZmPrefAcctListView.COL_ACTION, text:ZmMsg.action, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV}))
    ];

};

ZmPrefAcctListView.prototype._getCellClass =
function(item, field, params) {
    if (field == ZmPrefAcctListView.COL_ACTIVE) {
        return "FilterActiveCell";
    }
    return DwtListView.prototype._getCellClass.call(this, item, field, params);
};

ZmPrefAcctListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
    if (field == ZmPrefAcctListView.COL_ACTIVE) {
        html[idx++] = "<input name='OFFLINE_BACKUP_ACCOUNT_ID' type='checkbox' ";
        html[idx++] = item.active ? "checked " : "";
        html[idx++] = "id='";
        html[idx++] = AjxStringUtil.trim(item.name);
        html[idx++] = "_acctsCheckbox' _name='";
        html[idx++] = AjxStringUtil.trim(item.name);
        html[idx++] = "' _acId='";
        html[idx++] = this._internalId;
        html[idx++] = "' onclick='ZmPrefAcctListView._activeStateChange;'>";
    } else if (field == ZmPrefAcctListView.COL_DESC) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefAcctListView.COL_DESC);
        html[idx++] = "'>";
        html[idx++] = AjxStringUtil.stripTags(item.desc, true);
        html[idx++] = "</div>";
    } else if (field == ZmPrefAcctListView.COL_NAME) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefAcctListView.COL_NAME);
        html[idx++] = "' title='";
        html[idx++] = item.name;
        html[idx++] = "'>";
        html[idx++] = AjxStringUtil.stripTags(item.name, true);
        html[idx++] = "</div>";
    } else if (field == ZmPrefAcctListView.COL_ACTION) {
        html[idx++] = "<a href='javascript:;' onclick='ZmBackupPage._handleBackupNowLink(";
        var accId = appCtxt.accountList.getAccountByName(AjxStringUtil.trim(item.desc)).id;
        html[idx++] = '"' + accId.toString();
        html[idx++] = '","' + this.parent._htmlElId + '"';
        html[idx++] = ");'>";
        html[idx++] = ZmMsg.offlineBackUpNow;
        html[idx++] = "</a>";
    }

    return idx;
};


/**
 * Handles click of 'active' checkbox by toggling the rule's active state.
 *
 * @param ev			[DwtEvent]	click event
 */
ZmPrefAcctListView._activeStateChange =
function(ev) {
    var target = DwtUiEvent.getTarget(ev);
    var flvId = target.getAttribute("_acId");
    var flv = AjxCore.objectWithId(flvId);
    var name = target.getAttribute("_name");
    var z = flv.parent.getAccounts().getPrefAccountByName(name);
    if (z) {
        z.active = !z.active;
    }
};

ZmPrefAcctListView.prototype._allowLeftSelection =
function(clickedEl, ev, button) {
    var target = DwtUiEvent.getTarget(ev);
    var isInput = (target.id.indexOf("_acctsCheckbox") > 0);
    if (isInput) {
        ZmPrefAcctListView._activeStateChange(ev);
    }

    return !isInput;
};

/**
 * Model class to hold the list of PrefAccounts
 * @private
 */
ZmPrefAccounts = function() {
    ZmModel.call(this, ZmEvent.S_PREF_ACCOUNT);
    this._vector = new AjxVector();
    this._zNameHash = {};
};

ZmPrefAccounts.prototype = new ZmModel;
ZmPrefAccounts.prototype.constructor = ZmPrefAccounts;

ZmPrefAccounts.prototype.toString =
function() {
    return "ZmPrefAccounts";
};

ZmPrefAccounts.prototype.addPrefAccount =
function(Account) {
    this._vector.add(Account);
    this._zNameHash[Account.name] = Account;
};

ZmPrefAccounts.prototype.removePrefAccount =
function(Account) {
    delete this._zNameHash[Account.name];
    this._vector.remove(Account);
};

ZmPrefAccounts.prototype.getPrefAccountByName =
function(name) {
    return this._zNameHash[name];
};

/**
 * ZmPrefAccount
 *
 * @param name
 * @param active
 * @param desc
 *
 * @private
 */
ZmPrefAccount = function(name, active, desc, id) {
    this.name = name;
    this.active = (active !== false);
    this.desc = desc;
    this.id = id;
    this._origStatus = this.active;
};

ZmBackupPage.prototype.getBackups =
function(force) {
    if (!this._backups || force) {
        this._backups = ZmBackupPage._getBackups();
    }
    return this._backups;
};


ZmBackupPage._getBackups =
function(evt) {

    var soapDoc = AjxSoapDoc.create("AccountBackupEnumerationRequest", "urn:zimbraOffline");
    var result = appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:false});

    var _restoreAccts = result.AccountBackupEnumerationResponse.account;
    var backups = new ZmPrefBackups();
    for (var i=0; i< _restoreAccts.length; i++) {
        var acct =  _restoreAccts[i].id;
        var backupArray = _restoreAccts[i].backup;
        if(!backupArray) {
            continue;
        }

        for(var k=0; k<backupArray.length; k++) {
            var fileSize = backupArray[k].fileSize;
            var timestamp = backupArray[k].time;
            backups.addPrefBackup(new ZmPrefBackup(timestamp, false, fileSize, acct));
        }

    }
    return backups;
};

/**
 * ZmPrefBackupListView
 *
 * @param parent
 * @param controller
 * @private
 */

ZmPrefBackupListView  = function(parent, controller) {

    DwtListView.call(this, {
        parent: parent,
        className: "ZmFilterListView",
        headerList: this._getHeaderList(),
        view: ZmId.OFFLINE_BACKUP_RESTORE
    });

    this._controller = controller;
    this.setMultiSelect(false); // single selection only
    this._internalId = AjxCore.assignId(this);
};

ZmPrefBackupListView.COL_ACTIVE	= "ac";
ZmPrefBackupListView.COL_NAME	= "na";
ZmPrefBackupListView.COL_DESC	= "ds";
ZmPrefBackupListView.COL_ACTION	= "an";
ZmPrefBackupListView.CHECKBOX_PREFIX = "_BackupCheckbox";


ZmPrefBackupListView.prototype = new DwtListView;
ZmPrefBackupListView.prototype.constructor = ZmPrefBackupListView;

ZmPrefBackupListView.prototype.toString =
function() {
    return "ZmPrefBackupListView";
};

ZmPrefBackupListView.prototype.set =
function(list) {
    this._checkboxIds = [];
    DwtListView.prototype.set.call(this, list);
    //this.loadBackupDetails();
};

ZmPrefBackupListView.prototype.loadBackupDetails =
function() {
    var restoreArr =   this.parent._backups._vector.getArray();
    var item = {};
    for (var i = 0; i < restoreArr.length; i++) {
        item.timestamp = restoreArr[i].timestamp;
        item.size = restoreArr[i].fileSize;
        item.acct = restoreArr[i].acct;
        this.setCellContents(item, ZmPrefBackupListView.COL_NAME, item.timestamp);
        this.setCellContents(item, ZmPrefBackupListView.COL_DESC, item.size);
    }
};

ZmPrefBackupListView.prototype.setCellContents = function(item, field, html) {
    var el = this.getCellElement(item, field);
    if (!el) { return; }
    el.innerHTML = html;
};

ZmPrefBackupListView.prototype.getCellElement = function(item, field) {
    return document.getElementById(this._getCellId(item, field));
};

ZmPrefBackupListView.prototype._getCellId = function(item, field, params) {
    return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_CELL, "backup", item.timestamp, field);
};


ZmPrefBackupListView.prototype._getHeaderList =
function() {
    return  [
        (new DwtListHeaderItem({field:ZmPrefBackupListView.COL_ACTIVE, text:ZmMsg.active, width:ZmMsg.COLUMN_WIDTH_ACTIVE})),
        (new DwtListHeaderItem({field:ZmPrefBackupListView.COL_NAME, text:ZmMsg.date, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV})),
        (new DwtListHeaderItem({field:ZmPrefBackupListView.COL_DESC, text:ZmMsg.size, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV})),
        (new DwtListHeaderItem({field:ZmPrefBackupListView.COL_ACTION, text:ZmMsg.account, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV}))
    ];
};

ZmPrefBackupListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
    if (field == ZmPrefBackupListView.COL_ACTIVE) {
        html[idx++] = "<input name='offline_backup_restore' type='checkbox' ";
        html[idx++] = item.active ? "checked " : "";
        html[idx++] = "id='";
        html[idx++] = item.timestamp;
        html[idx++] = "_";
        html[idx++] = item.acct;
        html[idx++] = "_backupCheckbox' _name='";
        html[idx++] = item.timestamp;
        html[idx++] = "_";
        html[idx++] = item.acct;
        html[idx++] = "' _bkId='";
        html[idx++] = this._internalId;
        html[idx++] = "' onchange='ZmPrefBackupListView._activeStateChange'>";
    } else if (field == ZmPrefBackupListView.COL_DESC) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefBackupListView.COL_DESC);
        html[idx++] = "'>";
        var fSize = item.fileSize;
        var numFormater = AjxNumberFormat.getInstance();
        if (fSize != null && fSize >= 0) {
            if (fSize < 1024) { //" B";
                fSize = numFormater.format(fSize) + " "+ZmMsg.b;
            }
            else if (fSize < (1024*1024) ) { //" KB";
                fSize = numFormater.format(Math.round((fSize / 1024) * 10) / 10) + " "+ZmMsg.kb;
            }
            else { //" MB";
                fSize = numFormater.format(Math.round((fSize / (1024*1024)) * 10) / 10) + " "+ZmMsg.mb;
            }
        } else { fSize = 0+" "+ZmMsg.b; }
        html[idx++] = fSize;
        html[idx++] = "</div>";
    }
    else if (field == ZmPrefBackupListView.COL_NAME) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefBackupListView.COL_NAME);
        html[idx++] = "'>";
        html[idx++] = AjxDateFormat.getDateTimeInstance(AjxDateFormat.MEDIUM).format(new Date(item.timestamp));
        html[idx++] = "</div>";
    }
    else if (field == ZmPrefBackupListView.COL_ACTION) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefBackupListView.COL_ACTION);
        html[idx++] = "'>";
        html[idx++] = appCtxt.accountList.getAccount(item.acct).name;
        html[idx++] = "</div>";
    }
    return idx;
};

ZmPrefBackupListView._activeStateChange =
function(ev) {
    var target = DwtUiEvent.getTarget(ev);
    var bkId = target.getAttribute("_bkId");
    var bk = AjxCore.objectWithId(bkId);
    var name = target.getAttribute("_name");
    var bkups = bk.parent.getBackups();
    var z = bkups.getPrefBackupByName(name);
    var bkarray = bkups._vector.getArray();
    // Make checkbox behave like radio button
    for (var k=0; k<bkarray.length; k++) {
        if(bkarray[k].active && (bkarray[k].timestamp != z.timestamp)) {
            var y = document.getElementById([bkarray[k].timestamp, "_", bkarray[k].acct, "_backupCheckbox"].join(""));
            y.checked = false;
            bkarray[k].active = false;
        }
    }
    if (z) {
        z.active = !z.active;
    }
};

ZmPrefBackupListView.prototype._allowLeftSelection =
function(clickedEl, ev, button) {
    var target = DwtUiEvent.getTarget(ev);
    var isInput = (target.id.indexOf("_backupCheckbox") > 0);
    if (isInput) {
        ZmPrefBackupListView._activeStateChange(ev);
    }

    return !isInput;
};


/**
 * Model class to hold the list of backups
 * @private
 */
ZmPrefBackups = function() {
    ZmModel.call(this, ZmEvent.S_PREF_BACKUP);
    this._vector = new AjxVector();
    this._zNameHash = {};
};

ZmPrefBackups.prototype = new ZmModel;
ZmPrefBackups.prototype.constructor = ZmPrefBackups;

ZmPrefBackups.prototype.toString =
function() {
    return "ZmPrefBackups";
};

ZmPrefBackups.prototype.addPrefBackup =
function(Backup) {
    this._vector.add(Backup);
    var hash = [Backup.timestamp, "_", Backup.acct].join("");
    this._zNameHash[hash] = Backup;
};

ZmPrefBackups.prototype.removePrefBackup =
function(Backup) {
    var hash = [Backup.timestamp, "_", Backup.acct].join("");
    delete this._zNameHash[hash];
    this._vector.remove(Backup);
};

ZmPrefBackups.prototype.getPrefBackupByName =
function(hash) {
    return this._zNameHash[hash];
};

/**
 * ZmPrefBackup
 *
 * @param timestamp
 * @param active
 * @param fileSize
 * @param acct
 *
 * @private
 */
ZmPrefBackup = function(timestamp, active, fileSize, acct) {
    this.fileSize = fileSize;
    this.active = (active !== false);
    this.timestamp = timestamp;
    this.acct = acct;
    this._origStatus = this.active;
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmPrefView")) {
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
 * Creates an empty view of the preference pages.
 * @constructor
 * @class
 * This class represents a tabbed view of the preference pages.
 *
 * @author Conrad Damon
 *
 * @param {Hash}	params		a hash of parameters
 * @param  {DwtComposite}	parent		the parent widget
 * @param {constant}	posStyle		the positioning style
 * @param {ZmController}	controller	the owning controller
 * 
 * @extends		DwtTabView
 */
ZmPrefView = function(params) {

	params.className = "ZmPrefView";
	DwtTabView.call(this, params);

	this._parent = params.parent;
	this._controller = params.controller;

	
	this.prefView = {};
	this._tabId = {};
	this._sectionId = {};
	this.hasRendered = false;

	this.setVisible(false);
	this.setScrollStyle(Dwt.CLIP);
	this.getTabBar().setVisible(false);
	this.getTabBar().noTab = true;
    this.addStateChangeListener(new AjxListener(this, this._stateChangeListener));
};

ZmPrefView.prototype = new DwtTabView;
ZmPrefView.prototype.constructor = ZmPrefView;

ZmPrefView.prototype.toString =
function () {
	return "ZmPrefView";
};

ZmPrefView.prototype.getController =
function() {
	return this._controller;
};

ZmPrefView.prototype.getSectionForTab =
function(tabKey) {
	var sectionId = this._sectionId[tabKey];
	return ZmPref.getPrefSectionMap()[sectionId];
};

ZmPrefView.prototype.getTabForSection =
function(sectionOrId) {
	var section = (typeof sectionOrId == "string")
		? ZmPref.getPrefSectionMap()[sectionOrId] : sectionOrId;
	var sectionId = section && section.id;
	return this._tabId[sectionId];
};

ZmPrefView.prototype.show =
function() {
	if (this.hasRendered) { return; }

	// add sections that have been registered so far
	var sections = ZmPref.getPrefSectionArray();
	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		this._addSection(section);
	}

	// add listener for sections added/removed later...
	var account = appCtxt.isOffline && appCtxt.accountList.mainAccount;
	var setting = appCtxt.getSettings(account).getSetting(ZmSetting.PREF_SECTIONS);
	setting.addChangeListener(new AjxListener(this, this._prefSectionsModified));

	// display
	this.resetKeyBindings();
	this.hasRendered = true;
	this.setVisible(true);
};

ZmPrefView.prototype._prefSectionsModified =
function(evt) {
	var sectionId = evt.getDetails();
	var section = appCtxt.get(ZmSetting.PREF_SECTIONS, sectionId);
	if (section) {
		this._prefSectionAdded(section);
	}
	else {
		this._prefSectionRemoved(sectionId);
	}
};

ZmPrefView.prototype._prefSectionAdded =
function(section) {
	// add section to tabs
	var index = this._getIndexForSection(section.id);
	var added = this._addSection(section, index);

	if (added) {
		// create new page pref organizer
		var organizer = ZmPrefPage.createFromSection(section);
		var treeController = appCtxt.getOverviewController().getTreeController(ZmOrganizer.PREF_PAGE);
		var tree = treeController.getDataTree();

		if (tree) {
			var parent = tree.getById(ZmId.getPrefPageId(section.parentId)) || tree.root;
			organizer.pageId = this.getNumTabs();
			organizer.parent = parent;

			// find index within parent's children
			var index = null;
			var children = parent.children.getArray();
			for (var i = 0; i < children.length; i++) {
				if (section.priority < this.getSectionForTab(children[i].pageId).priority) {
					index = i;
					break;
				}
			}
			parent.children.add(organizer, index);

			// notify so that views can be updated
			organizer._notify(ZmEvent.E_CREATE);
		}
	}
};

ZmPrefView.prototype._prefSectionRemoved =
function(sectionId) {
	var index = this._getIndexForSection(sectionId);
	var tree = appCtxt.getTree(ZmOrganizer.PREF_PAGE);
	var organizer = tree && tree.getById(ZmId.getPrefPageId(sectionId));
	if (organizer) {
		organizer.notifyDelete();
	}
};

/**
 * <strong>Note:</strong>
 * This is typically called automatically when adding sections.
 *
 * @param section   [object]    The section to add.
 * @param index     [number]    (Optional) The index where to add.
 * 
 * @private
 */
ZmPrefView.prototype._addSection = function(section, index) {

	// does the section meet the precondition?
	if ((!appCtxt.multiAccounts || (appCtxt.multiAccounts && appCtxt.getActiveAccount().isMain)) &&
		!appCtxt.checkPrecondition(section.precondition, section.preconditionAny)) {

		return false;
	}

	if (this.prefView[section.id]) {
		return false; // Section already exists
	}

	// create pref page's view
	var view = (section.createView)
		? (section.createView(this, section, this._controller))
		: (new ZmPreferencesPage(this, section, this._controller));
	this.prefView[section.id] = view;
	
	// add section as a tab
	var tabButtonId = ZmId.getTabId(this._controller.getCurrentViewId(), ZmId.getPrefPageId(section.id));
	var tabId = this.addTab(section.title, view, tabButtonId, index);
	this._tabId[section.id] = tabId;
	this._sectionId[tabId] = section.id;
	return true;
};

ZmPrefView.prototype._getIndexForSection =
function(id) {
	var sections = ZmPref.getPrefSectionArray();
	for (var i = 0; i < sections.length; i++) {
		if (sections[i].id == id) break;
	}
	return i;
};

ZmPrefView.prototype.reset =
function() {
	for (var id in this.prefView) {
		var viewPage = this.prefView[id];
		// if feature is disabled, may not have a view page
		// or if page hasn't rendered, nothing has changed
		if (!viewPage || (viewPage && !viewPage.hasRendered)) { continue; }
		viewPage.reset();
	}
};

ZmPrefView.prototype.resetOnAccountChange =
function() {
	for (var id in this.prefView) {
		this.prefView[id].resetOnAccountChange();
	}
};

ZmPrefView.prototype.getTitle =
function() {
	return (this.hasRendered && this.getActiveView().getTitle());
};

ZmPrefView.prototype.getView =
function(view) {
	return this.prefView[view];
};

/**
 * This method iterates over the preference pages to see if any of them have
 * actions to perform <em>before</em> saving. If the page has a
 * <code>getPreSaveCallback</code> method and it returns a callback, the pref
 * controller will call it before performing any save. This is done for each
 * page that returns a callback.
 * <p>
 * The pre-save callback is passed a callback that <em>MUST</em> be called upon
 * completion of the pre-save code. This is so the page can perform its pre-save
 * behavior asynchronously without the need to immediately return to the pref
 * controller.
 * <p>
 * <strong>Note:</strong>
 * When calling the continue callback, the pre-save code <em>MUST</em> pass a
 * single boolean signifying the success of the the pre-save operation.
 * <p>
 * An example pre-save callback implementation:
 * <pre>
 * MyPrefView.prototype.getPreSaveCallback = function() {
 *    return new AjxCallback(this, this._preSaveAction, []);
 * };
 *
 * MyPrefView.prototype._preSaveAction =
 * function(continueCallback, batchCommand) {
 *    var success = true;
 *    // perform some operation
 *    continueCallback.run(success);
 * };
 * </pre>
 *
 * @return	{Array}	an array of {AjxCallback} objects
 */
ZmPrefView.prototype.getPreSaveCallbacks =
function() {
	var callbacks = [];
	for (var id in this.prefView) {
		var viewPage = this.prefView[id];
		if (viewPage && viewPage.getPreSaveCallback && viewPage.hasRendered) {
			var callback = viewPage.getPreSaveCallback();
			if (callback) {
				callbacks.push(callback);
			}
		}
	}
	return callbacks;
};

/**
 * This method iterates over the preference pages to see if any of them have
 * actions to perform <em>after</em> saving. If the page has a
 * <code>getPostSaveCallback</code> method and it returns a callback, the pref
 * controller will call it after performing any save. This is done for each page
 * that returns a callback.
 * 
 * @return	{Array}	an array of {AjxCallback} objects
 */
ZmPrefView.prototype.getPostSaveCallbacks =
function() {
	var callbacks = [];
	for (var id in this.prefView) {
		var viewPage = this.prefView[id];
		var callback = viewPage && viewPage.hasRendered &&
					   viewPage.getPostSaveCallback && viewPage.getPostSaveCallback();
		if (callback) {
			callbacks.push(callback);
		}
	}
	return callbacks;
};

/**
 * Gets the changed preferences. Each prefs page is checked in
 * turn. This method can also be used to check simply whether <em>_any_</em>
 * prefs have changed, in which case it short-circuits as soon as it finds one that has changed.
 *
 * @param {Boolean}	dirtyCheck		if <code>true</code>, only check if any prefs have changed
 * @param {Boolean}	noValidation		if <code>true</code>, don't perform any validation
 * @param {ZmBatchCommand}	batchCommand		if not <code>null</code>, add soap docs to this batch command
 * 
 * @return	{Array|Boolean}	an array of {ZmPref} objects or <code>false</code> if no changed prefs
 */
ZmPrefView.prototype.getChangedPrefs =
function(dirtyCheck, noValidation, batchCommand) {
	var list = [];
	var errors= [];
	var sections = ZmPref.getPrefSectionMap();
	var pv = this.prefView;
	for (var view in pv) {
		var section = sections[view];
		if (!section || (section && section.manageChanges)) { continue; }

		var viewPage = pv[view];
		if (!viewPage || (viewPage && !viewPage.hasRendered)) { continue; }

		if (section.manageDirty) {
			var isDirty = viewPage.isDirty(section, list, errors);
			if (isDirty) {
				if (dirtyCheck) {
					return true;
				} else {
					this._controller.setDirty(view, true);
				}
			}
			if (!noValidation) {
				if (!viewPage.validate()) {
					throw new AjxException(viewPage.getErrorMessage());
				}
			}
			if (!dirtyCheck && batchCommand) {
				viewPage.addCommand(batchCommand);
			}
		}
        var isSaveCommand = (batchCommand) ? true : false;
		try {
			var result = this._checkSection(section, viewPage, dirtyCheck, noValidation, list, errors, view, isSaveCommand);
		} catch (e) {
			throw(e);
		}
		if (dirtyCheck && result) {
			return true;
		}
		
		// errors can only have a value if noValidation is false
		if (errors.length) {
			throw new AjxException(errors.join("\n"));
		}
	}
	return dirtyCheck ? false : list;
};

ZmPrefView.prototype._checkSection = function(section, viewPage, dirtyCheck, noValidation, list, errors, view, isSaveCommand) {

	var settings = appCtxt.getSettings();
	var prefs = section && section.prefs;
	var isAllDayVacation = false;
	for (var j = 0, count = prefs ? prefs.length : 0; j < count; j++) {
		var id = prefs[j];
		if (!viewPage._prefPresent || !viewPage._prefPresent[id]) { continue; }
		var setup = ZmPref.SETUP[id];
        var defaultError = setup.errorMessage;
		if (!appCtxt.checkPrecondition(setup.precondition, setup.preconditionAny)) {
			continue;
		}

		var type = setup ? setup.displayContainer : null;
		// ignore non-form elements
		if (type == ZmPref.TYPE_PASSWORD || type == ZmPref.TYPE_CUSTOM) { continue;	}

		// check if value has changed
		var value;
		try {
			value = viewPage.getFormValue(id);
		} catch (e) {
			if (dirtyCheck) {
				return true;
			} else {
				throw e;
			}
		}
		var pref = settings.getSetting(id);
		var origValue = pref.origValue;
		if (setup.approximateFunction) {
			if (setup.displayFunction) {
				origValue = setup.displayFunction(origValue);
			}
			origValue = setup.approximateFunction(origValue);
			if (setup.valueFunction) {
				origValue = setup.valueFunction(origValue);
			}
		}

        if (pref.name == "zimbraPrefAutoSaveDraftInterval"){
          // We are checking if zimbraPrefAutoSaveDraftInterval is set or not
          var orig = !(!origValue);
          var current  = !(!value);
          if (orig == current)
              origValue = value;
        }

		//this is ugly but it's all due to keeping the information on whether the duration is all-day by setting end hour to 23:59:59, instead of having a separate flag on the server. See Bug 80059.
		//the field does not support seconds so we set to 23:59 and so we need to take care of it not to think the vacation_until has changed.
		if (id === "VACATION_DURATION_ALL_DAY") {
			isAllDayVacation = value; //keep this info for the iteration that checks VACATION_UNTIL (luckily it's after... a bit hacky to rely on it maybe).
		}
		var comparableValue = value;
		var comparableOrigValue = origValue;
		if (id === "VACATION_UNTIL" && isAllDayVacation) {
			//for comparing, compare just the dates (e.g. 20130214) since it's an all day, so only significant change is the date, not the time. See bug 80059
			comparableValue = value.substr(0, 8);
			comparableOrigValue = origValue.substr(0, 8);
		}
    /**
        In OOO vacation external select, first three options have same value i.e false, so we do
                    comparableValue = !comparableOrigValue;
         so that it enters the inner "_prefChanged" function and from there we add pref to list, depending upon which
         option is selected and it maps to which pref.  Both comparableValue and comparableOrigValue are local variables
         to this function, so no issues.
     */
        if (id === "VACATION_EXTERNAL_SUPPRESS" && (dirtyCheck || isSaveCommand)) {
            comparableValue = !comparableOrigValue;
        }

        if (this._prefChanged(pref.dataType, comparableOrigValue, comparableValue)) {
			var isValid = true;
			if (!noValidation) {
				var maxLength = setup ? setup.maxLength : null;
				var validationFunc = setup ? setup.validationFunction : null;
				if (!noValidation && maxLength && (value.length > maxLength)) {
					isValid = false;
				} else if (!noValidation && validationFunc) {
					isValid = validationFunc(value);
				}
			}
			if (isValid) {
                if (!dirtyCheck && isSaveCommand) {
                    if (setup.setFunction) {
                        setup.setFunction(pref, value, list, viewPage);
                    } else {
                        pref.setValue(value);
                        if (pref.name) {
                            list.push(pref);
                        }
                    }
                } else if (!dirtyCheck) {
                    //for logging
                    list.push({name: section.title + "." + id, origValue: origValue, value:value});
                }
			} else {
				errors.push(AjxMessageFormat.format(setup.errorMessage, AjxStringUtil.htmlEncode(value)));
                setup.errorMessage = defaultError;
			}
			this._controller.setDirty(view, true);
			if (dirtyCheck) {
				return true;
			}
		}
	}
};

ZmPrefView.prototype._prefChanged =
function(type, origValue, value) {

	var test1 = (typeof value == "undefined" || value === null || value === "") ? null : value;
	var test2 = (typeof origValue == "undefined" || origValue === null || origValue === "") ? null : origValue;

	if (type == ZmSetting.D_LIST) {
		return !AjxUtil.arrayCompare(test1, test2);
	}
	if (type == ZmSetting.D_HASH) {
		return !AjxUtil.hashCompare(test1, test2);
	}
	if (type == ZmSetting.D_INT) {
		test1 = parseInt(test1);
		test2 = parseInt(test2);
	}
	return Boolean(test1 != test2);
};

/**
 * Checks if any preference has changed.
 * 
 * @return	{Boolean}	<code>true</code> if any preference has changed
 */
ZmPrefView.prototype.isDirty =
function() {
	try {
		var printPref = function(pref) {
			if (AjxUtil.isArray(pref)) {
				return AjxUtil.map(pref, printPref).join("<br>");
			}
			return [pref.name, ": from ", (pref.origValue!=="" ? pref.origValue : "[empty]"), " to ", (pref.value!=="" ? pref.value : "[empty]")].join("");
		}

		var changed = this.getChangedPrefs(false, true); // Will also update this._controller._dirty
		if (changed && changed.length) {
			AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:<br>" + printPref(changed));
			return true;
		}

		var dirtyViews = AjxUtil.keys(this._controller._dirty, function(key,obj){return obj[key]});
		if (dirtyViews.length) {
			AjxDebug.println(AjxDebug.PREFS, "Dirty preference views:<br>" + dirtyViews.join("<br>"));
			return true;
		}

		return false;
	} catch (e) {
		AjxDebug.println(AjxDebug.PREFS, "Exception in preferences: " + e.name + ": " + e.message);
		return true;
	}
};

/**
 * Selects the section (tab) with the given id.
 * 
 * @param	{String}	sectionId		the section id
 * 
 */
ZmPrefView.prototype.selectSection =
function(sectionId) {
	this.switchToTab(this._tabId[sectionId]);

	// Mark the correct organizer entry
	var tree = appCtxt.getTree(ZmOrganizer.PREF_PAGE);
	var organizer = tree && tree.getById(ZmId.getPrefPageId(sectionId));
	if (organizer) {
		var treeController = appCtxt.getOverviewController().getTreeController(ZmOrganizer.PREF_PAGE);
		var treeView = treeController && treeController.getTreeView(appCtxt.getCurrentApp().getOverviewId());
		if (treeView)
			treeView.setSelected(organizer, true, false);
	}
};

ZmPrefView.prototype._stateChangeListener =
function(ev) {
  if (ev && ev.item && ev.item instanceof ZmPrefView) {
      var view = ev.item.getActiveView();
      view._controller._stateChangeListener(ev);
  }

};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmFilterRulesView")) {
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
 * Creates the filter rules view.
 * @class
 * This class represents the filters tab view in preferences application.
 * 
 * @param	{DwtComposite}	parent		the parent widget
 * @param	{ZmController}	controller	the controller
 *
 * @extends		DwtTabViewPage
 * 
 * @see		ZmPreferencesApp
 */
ZmFilterRulesView = function(parent, controller) {

	DwtTabViewPage.call(this, parent, "ZmPreferencesPage ZmFilterRulesView", Dwt.STATIC_STYLE);

	this._controller = controller;
	this._prefsController = AjxDispatcher.run("GetPrefController");

	this._rules = AjxDispatcher.run(controller.isOutgoing() ? "GetOutgoingFilterRules" : "GetFilterRules");

	var section = ZmPref.getPrefSectionWithPref(ZmSetting.FILTERS);
	this._title = [ZmMsg.zimbraTitle, controller.getApp().getDisplayName(), section && section.title].join(": ");

	this._rendered = false;

	this._tabGroup = new DwtTabGroup(this._htmlElId);
};

ZmFilterRulesView.prototype = new DwtTabViewPage;
ZmFilterRulesView.prototype.constructor = ZmFilterRulesView;

ZmFilterRulesView.prototype.toString =
function() {
	return "ZmFilterRulesView";
};

ZmFilterRulesView.prototype.showMe =
function() {
	Dwt.setTitle(this._title);
	var section = ZmPref.getPrefSectionWithPref(ZmSetting.FILTERS);

	this._prefsController._resetOperations(this._prefsController._toolbar, section && section.id);
    //TODO: We got to optimize / avoid force-rendering logic for multi-account setup
	if (this.hasRendered && !appCtxt.isOffline) { return; }

	// create the html
	var data = {id:this._htmlElId};
	this.getHtmlElement().innerHTML = AjxTemplate.expand("prefs.Pages#MailFilter", data);

	// create toolbar
	var toolbarEl = Dwt.byId(data.id + "_toolbar");
	if (toolbarEl) {
		var buttons = this._controller.getToolbarButtons();
		this._toolbar = new ZmButtonToolBar({parent:this, buttons:buttons, posStyle:Dwt.STATIC_STYLE,
											 context:ZmId.VIEW_FILTER_RULES});
		this._toolbar.replaceElement(toolbarEl);
		this._tabGroup.addMember(this._toolbar);
	}

	// create list view
	var listViewEl = Dwt.byId(data.id + "_list");
	// add chooser
	this._chooser = new ZmFilterRulesChooser(this._controller, {parent:this});
	this._chooser.reparentHtmlElement(listViewEl + "_chooser");
	var width = this._chooser.getWidth(this.parent);
	var height = this._chooser.getHeight(this.parent);
	this._chooser.resize(width, height); //still call this so the height is set correctly, but let's set the width to non specific values, to work better on resize:
	//remove the width explicit setting and keep the current height setting.
	this._chooser.sourceListView.setSize(Dwt.CLEAR, Dwt.DEFAULT);
	this._chooser.targetListView.setSize(Dwt.CLEAR, Dwt.DEFAULT);
	this._controller.initialize(this._toolbar, this._chooser.activeListView, this._chooser.notActiveListView);
	this.hasRendered = true;
};

/**
 * Gets the title.
 * 
 * @return	{String}	the title
 */
ZmFilterRulesView.prototype.getTitle =
function() {
	return this._title;
};

/**
 * Gets the toolbar.
 * 
 * @return	{ZmButtonToolBar}		the toolbar
 */
ZmFilterRulesView.prototype.getToolbar =
function() {
	return this._toolbar;
};

/**
 * Gets the list view.
 * 
 * @return	{DwtListView}	the list view
 */
ZmFilterRulesView.prototype.getListView =
function() {
	return this._listView;
};

/**
 * Gets the tab group.
 * 
 * @return	{DwtTabGroup}		the tab group
 */
ZmFilterRulesView.prototype.getTabGroupMember =
function() {
	return this._tabGroup;
};

// View is always in sync with rules
ZmFilterRulesView.prototype.reset = function() {};

ZmFilterRulesView.prototype.resetOnAccountChange =
function() {
	this.hasRendered = false;
};

/**
 * Creates a filter rule chooser.
 * @class
 * This class creates a specialized chooser for the filter rule list view.
 *
 * @param {ZmController}	controller			the filter rule controller
 * @param {hash}		params		chooser params
 * 
 * @extends		DwtChooser
 * 
 * @private
 */
ZmFilterRulesChooser = function(controller, params) {
	this._controller = controller;
	DwtChooser.call(this, params);
	this._rules = AjxDispatcher.run(controller.isOutgoing() ? "GetOutgoingFilterRules" : "GetFilterRules");
	this._rules.addChangeListener(new AjxListener(this, this._changeListener));
};

ZmFilterRulesChooser.prototype = new DwtChooser;
ZmFilterRulesChooser.prototype.constructor = ZmFilterRulesChooser;
ZmFilterRulesChooser.MOVE_UP_BTN_ID = "__moveUp__";
ZmFilterRulesChooser.MOVE_DOWN_BTN_ID = "__moveDown__";
ZmFilterRulesChooser.CHOOSER_HEIGHT = 300;
ZmFilterRulesChooser.CHOOSER_WIDTH = 300;
ZmFilterRulesChooser.WIDTH_FUDGE = 111; //if button size not this sets the correct width
ZmFilterRulesChooser.HEIGHT_FUDGE = 200;
/**
 * @private
 */
ZmFilterRulesChooser.prototype._createSourceListView =
function() {
	return new ZmFilterChooserNotActiveListView(this);
};

/**
 * @private
 */
ZmFilterRulesChooser.prototype._createTargetListView =
function() {
	return new ZmFilterChooserActiveListView(this);
};

ZmFilterRulesChooser.prototype._initialize = 
function() {
	DwtChooser.prototype._initialize.call(this);
	this._moveUpButtonId = Dwt.getNextId();
	this._moveUpButton = this._setupButton(ZmFilterRulesChooser.MOVE_UP_BTN_ID, this._moveUpButtonId, this._moveUpButtonDivId, ZmMsg.filterMoveUp);
	this._moveUpButton.addSelectionListener(new AjxListener(this._controller, this._controller.moveUpListener));
	this._moveUpButton.setImage("UpArrow");
	this._moveUpButton.setEnabled(false);
	this._moveDownButtonId = Dwt.getNextId();
	this._moveDownButton = this._setupButton(ZmFilterRulesChooser.MOVE_DOWN_BTN_ID, this._moveDownButtonId, this._moveDownButtonDivId, ZmMsg.filterMoveDown);
	this._moveDownButton.addSelectionListener(new AjxListener(this._controller, this._controller.moveDownListener));
	this._moveDownButton.setImage("DownArrow");
	this._moveDownButton.setEnabled(false);
	this._removeButton.setEnabled(false);
	this._removeButton.setAlign(DwtLabel.IMAGE_RIGHT);
	this._removeButton.setImage("RightDoubleArrow");
	this._removeButton.setEnabled(false);
	this._transferButton =  this._button[this._buttonInfo[0].id];
	this._transferButton.setImage("LeftDoubleArrow");
	this._transferButton.setEnabled(false);
	this.notActiveListView = this.sourceListView;
	this.activeListView = this.targetListView;
    AjxUtil.foreach([this._moveUpButton, this._moveDownButton, this._removeButton, this._transferButton],
    function(item){
            var htmlElement = item.getHtmlElement();
            if (htmlElement && htmlElement.firstChild) htmlElement.firstChild.style.width = "100%";
    });
};

ZmFilterRulesChooser.prototype._createHtml = 
function() {

	this._sourceListViewDivId	= Dwt.getNextId();
	this._targetListViewDivId	= Dwt.getNextId();
	this._buttonsDivId			= Dwt.getNextId();
	this._removeButtonDivId		= Dwt.getNextId();
	this._moveUpButtonDivId		= Dwt.getNextId();
	this._moveDownButtonDivId	= Dwt.getNextId();
	var data = {
		        targetDivId: this._targetListViewDivId,
		        sourceDivId: this._sourceListViewDivId,
				buttonsDivId: this._buttonsDivId,
				transferButtonId: this._buttonDivId[this._buttonInfo[0].id],
				removeButtonId: this._removeButtonDivId,
				moveUpButtonId: this._moveUpButtonDivId,
				moveDownButtonId: this._moveDownButtonDivId
				};
	this.getHtmlElement().innerHTML = AjxTemplate.expand("prefs.Pages#MailFilterListView", data);
};

/**
 * In general, we just re-display all the rules when anything changes, rather
 * than trying to update a particular row.
 *
 * @param {DwtEvent}	ev		the event
 * 
 * @private
 */
ZmFilterRulesChooser.prototype._changeListener =
function(ev) {
	if (ev.type != ZmEvent.S_FILTER) {
		AjxDebug.println(AjxDebug.FILTER, "FILTER RULES: ev.type is not S_FILTER; ev.type == " + ev.type);
		return;
	}
	AjxDebug.println(AjxDebug.FILTER, "FILTER RULES: ev.type == " + ev.type);
	if (ev.event == ZmEvent.E_MODIFY) {
		this._controller.resetListView(ev.getDetail("index"));
		AjxDebug.println(AjxDebug.FILTER, "FILTER RULES: MODIFY event, called resetListview");
		if (ev.source && ev.source.getNumberOfRules() == 0) {
			this._enableButtons(); //disable transfer buttons
		}
	}
};

/**
 * Clicking a transfer button moves selected items to the target list.
 *
 * @param {DwtEvent}		ev		the click event
 * 
 * @private
 */
ZmFilterRulesChooser.prototype._transferButtonListener =
function(ev) {
	var button = DwtControl.getTargetControl(ev);
	var sel = this.notActiveListView.getSelection();
	if (sel && sel.length) {
		this.transfer(sel);
		var list = this.notActiveListView.getList();
		if (list && list.size()) {
			this._selectFirst(DwtChooserListView.SOURCE);
		} else {
			this._enableButtons();
		}
	} 
};

/**
* Moves or copies items from the source list to the target list, paying attention
* to current mode.
*
* @param {AjxVector|array|Object|hash} list a list of items or hash of lists
* @param {string} id the ID of the transfer button that was used
* @param {boolean} skipNotify if <code>true</code>, do not notify listeners
*/
ZmFilterRulesChooser.prototype.transfer =
function(list, id, skipNotify) {
	DwtChooser.prototype.transfer.call(this, list, id, skipNotify);
	for (var i=0; i<list.length; i++) {
		var rule = this._rules.getRuleByName(list[i].name);
		if (rule) {
			rule.active = true;
			this._rules.moveToBottom(rule, true);
		}
	}
	this._rules.saveRules(0, true);
};

/**
 * Removes items from target list, paying attention to current mode. Also handles button state.
 *
 * @param {AjxVector|array|Object|hash}	list			a list of items or hash of lists
 * @param {boolean}	skipNotify	if <code>true</code>, do not notify listeners
 */
ZmFilterRulesChooser.prototype.remove =
function(list, skipNotify) {
	DwtChooser.prototype.remove.call(this, list, skipNotify);
	for (var i=0; i<list.length; i++) {
		var rule = this._rules.getRuleByName(list[i].name);
		if (rule) {
			rule.active = false;
			this._rules.moveToBottom(rule, true);
		}
	}
	this._rules.saveRules(0, true);
};

/**
 * Removes an item from the target list.
 *
 * @param {Object}	item		the item to remove
 * @param {boolean}	skipNotify	if <code>true</code>, don't notify listeners
 * 
 * @private
 */
ZmFilterRulesChooser.prototype._removeFromTarget =
function(item, skipNotify) {
	if (!item) return;
	var list = this.activeListView.getList();
	if (!list) return;
	if (!list.contains(item)) return;

	this.activeListView.removeItem(item, skipNotify);
};

/**
 * Enable/disable buttons as appropriate.
 *
 * @private
 */
ZmFilterRulesChooser.prototype._enableButtons =
function(sForce, tForce) {
	DwtChooser.prototype._enableButtons.call(this, sForce, tForce);
	
	var activeEnabled = (sForce || (this.activeListView.getSelectionCount() > 0));
	var availableEnabled = (tForce || (this.notActiveListView.getSelectionCount() > 0));
	
	var listView = activeEnabled ? this.activeListView : this.notActiveListView;
	if (listView.getSelectionCount() > 1 || listView._list.size() <= 1) {
		this._moveUpButton.setEnabled(false);
		this._moveDownButton.setEnabled(false);
	}
	else if (listView.getSelectionCount() == 1) {
		var sel = listView.getSelection();
		var firstItem = listView._list.get(0);
		var lastItem = listView._list.get(listView._list.size()-1);
		if (firstItem && firstItem.id == sel[0].id) {
			this._moveUpButton.setEnabled(false);
			this._moveDownButton.setEnabled(true);
		}
		else if (lastItem && lastItem.id == sel[0].id) {
			this._moveDownButton.setEnabled(false);
			this._moveUpButton.setEnabled(true);
		}
		else {
			this._moveDownButton.setEnabled(true);
			this._moveUpButton.setEnabled(true);
		}
	}
};


/**
 * Single-click selects an item, double-click adds selected items to target list.
 *
 * @param {DwtEvent}	ev		the click event
 * 
 * @private
 */
ZmFilterRulesChooser.prototype._sourceListener =
function(ev) {
	if (this._activeButtonId == DwtChooser.REMOVE_BTN_ID) {
		// single-click activates appropriate transfer button if needed
		var id = this._lastActiveTransferButtonId ? this._lastActiveTransferButtonId : this._buttonInfo[0].id;
		this._setActiveButton(id);
	}
	this.targetListView.deselectAll();
	this._enableButtons();
};

/**
 * Single-click selects an item, double-click removes it from the target list.
 *
 * @param {DwtEvent}		ev		the click event
 * 
 * @private
 */
ZmFilterRulesChooser.prototype._targetListener =
function(ev) {
	this._setActiveButton(DwtChooser.REMOVE_BTN_ID);
	this.sourceListView.deselectAll();
	this._enableButtons();

};

/**
 * Calculates the chooser height based on the parent element height
 * @param parent    {DwtControl} parent
 * @return {int} height
 */
ZmFilterRulesChooser.prototype.getHeight = 
function(parent) {
	if (!parent) {
		return ZmFilterRulesChooser.CHOOSER_HEIGHT;
	}
	var height = parseInt(parent.getHtmlElement().style.height);
	return height - ZmFilterRulesChooser.HEIGHT_FUDGE;
};

/**
 * calculates chooser width based on parent element width.
 * @param parent {DwtControl} parent
 * @return {int} width
 */
ZmFilterRulesChooser.prototype.getWidth = 
function(parent) {
	if (!parent) {
		return ZmFilterRulesChooser.CHOOSER_WIDTH;
	}

	var widthFudge = ZmFilterRulesChooser.WIDTH_FUDGE;
	var width = parseInt(parent.getHtmlElement().style.width);
	var buttonsDiv = document.getElementById(this._buttonsDivId);
	if (buttonsDiv) {
		var btnSz = Dwt.getSize(buttonsDiv); 
		if (btnSz && btnSz.x > 0) {
			widthFudge = ZmFilterRulesChooser.WIDTH_FUDGE - btnSz.x;
		}
	}
	
	return width - widthFudge;	
};		

/**
 * Creates a source list view.
 * @class
 * This class creates a specialized source list view for the contact chooser.
 * 
 * @param {DwtComposite}	parent			the contact picker
 * 
 * @extends		DwtChooserListView
 * 
 * @private
 */
ZmFilterChooserActiveListView = function(parent) {
	DwtChooserListView.call(this, {parent:parent, type:DwtChooserListView.SOURCE});
	this.setScrollStyle(Dwt.CLIP);
};

ZmFilterChooserActiveListView.prototype = new DwtChooserListView;
ZmFilterChooserActiveListView.prototype.constructor = ZmFilterChooserActiveListView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 * @private
 */
ZmFilterChooserActiveListView.prototype.toString =
function() {
	return "ZmFilterChooserActiveListView";
};

ZmFilterChooserActiveListView.prototype._getCellContents = 
function(html, idx, item, field, colIdx, params) {
	if (AjxEnv.isIE) {
		var maxWidth = AjxStringUtil.getWidth(item);
		html[idx++] = "<div style='float; left; overflow: visible; width: " + maxWidth + ";'>";
		html[idx++] = AjxStringUtil.htmlEncode(item.name);
		html[idx++] = "</div>";		
	}
	else {
		html[idx++] = AjxStringUtil.htmlEncode(item.name);
	}
	return idx;
};

/**
 * Only show active rules that have at least one valid action (eg, if the only action
 * is "tag" and tagging is disabled, don't show the rule).
 *
 * @param list
 * 
 * @private
 */
ZmFilterChooserActiveListView.prototype.set =
function(list) {
	var list1 = new AjxVector();
	var len = list.size();
	for (var i = 0; i < len; i++) {
		var rule = list.get(i);
		if (rule.hasValidAction() && rule.active) {
			list1.add(rule);
		}
	}
	DwtListView.prototype.set.call(this, list1);
};

ZmFilterChooserActiveListView.prototype._getHeaderList =
function() {
	return [(new DwtListHeaderItem({text: ZmMsg.activeFilters}))];
};


/**
 * Returns a string of any extra attributes to be used for the TD.
 *
 * @param item		[object]	item to render
 * @param field		[constant]	column identifier
 * @param params	[hash]*		hash of optional params
 * 
 * @private
 */
ZmFilterChooserActiveListView.prototype._getCellAttrText =
function(item, field, params) {
	return "style='position: relative; overflow: visible;'";
};

/**
 * Creates the target list view.
 * @class
 * This class creates a specialized target list view for the contact chooser.
 * 
 * @param {DwtComposite}	parent			the contact picker
 * @extends		DwtChooserListView
 * 
 * @private
 */
ZmFilterChooserNotActiveListView = function(parent) {
	DwtChooserListView.call(this, {parent:parent, type:DwtChooserListView.TARGET});
	this.setScrollStyle(Dwt.CLIP);
};

ZmFilterChooserNotActiveListView.prototype = new DwtChooserListView;
ZmFilterChooserNotActiveListView.prototype.constructor = ZmFilterChooserNotActiveListView;

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmFilterChooserNotActiveListView.prototype.toString =
function() {
	return "ZmFilterChooserNotActiveListView";
};

ZmFilterChooserNotActiveListView.prototype._getCellContents = 
function(html, idx, item, field, colIdx, params) {
	html[idx++] = AjxStringUtil.htmlEncode(item.name);
	return idx;
};

ZmFilterChooserNotActiveListView.prototype._getHeaderList =
function() {
	return [(new DwtListHeaderItem({text: ZmMsg.availableFilters}))];
};

/**
 * Only show non-active rules that have at least one valid action (eg, if the only action
 * is "tag" and tagging is disabled, don't show the rule).
 *
 * @param list
 * 
 * @private
 */
ZmFilterChooserNotActiveListView.prototype.set =
function(list) {
	var list1 = new AjxVector();
	var len = list.size();
	for (var i = 0; i < len; i++) {
		var rule = list.get(i);
		if (rule.hasValidAction() && !rule.active) {
			list1.add(rule);
		}
	}
	DwtListView.prototype.set.call(this, list1);
};

ZmFilterChooserNotActiveListView.prototype._getCellContents = 
function(html, idx, item, field, colIdx, params) {
	if (AjxEnv.isIE) {
		var maxWidth = AjxStringUtil.getWidth(item);
		html[idx++] = "<div style='float; left; overflow: visible; width: " + maxWidth + ";'>";
		html[idx++] = AjxStringUtil.htmlEncode(item.name);
		html[idx++] = "</div>";		
	}
	else {
		html[idx++] = AjxStringUtil.htmlEncode(item.name);
	}
	return idx;
};

/**
 * Returns a string of any extra attributes to be used for the TD.
 *
 * @param item		[object]	item to render
 * @param field		[constant]	column identifier
 * @param params	[hash]*		hash of optional params
 * 
 * @private
 */
ZmFilterChooserNotActiveListView.prototype._getCellAttrText =
function(item, field, params) {
	return "style='position: relative; overflow: visible;'";
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmFilterRuleDialog")) {
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
 * Creates a dialog for specifying a filter rule. Can be used for either add or edit.
 * @constructor
 * @class
 * This class presents a dialog which a user can use to add or edit a filter rule.
 * A filter rule consists of conditions and actions (at least one of each). Different
 * types of conditions and actions require different fields to specify them, so they
 * are presented in a table in which all columns are not necessarily occupied.
 * <p>
 * First the HTML is laid out, then DWT objects that are needed for input are plugged
 * in.</p>
 *
 * @author Conrad Damon
 * 
 * @extends		DwtDialog
 */
ZmFilterRuleDialog = function() {

	DwtDialog.call(this, {parent:appCtxt.getShell(), className:"ZmFilterRuleDialog", title:ZmMsg.selectAddresses, id: "ZmFilterRuleDialog"});

	// set content
	this.setContent(this._contentHtml());
	this._createControls();
	this._setConditionSelect();
	this._createTabGroup();

	// create these listeners just once
	this._rowChangeLstnr			= new AjxListener(this, this._rowChangeListener);
	this._opsChangeLstnr			= new AjxListener(this, this._opsChangeListener);
	this._dateLstnr					= new AjxListener(this, this._dateListener);
	this._plusMinusLstnr			= new AjxListener(this, this._plusMinusListener);
	this._browseLstnr				= new AjxListener(this, this._browseListener);
	this._addrBookChangeLstnr		= new AjxListener(this, this._addrBookChangeListener);
	this._importanceChangeLstnr		= new AjxListener(this, this._importanceChangeListener);
		
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
	this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._cancelButtonListener));
	this._conditionErrorFormatter = new AjxMessageFormat(ZmMsg.filterErrorCondition);
	this._actionErrorFormatter = new AjxMessageFormat(ZmMsg.filterErrorAction);
};

ZmFilterRuleDialog.prototype = new DwtDialog;
ZmFilterRuleDialog.prototype.constructor = ZmFilterRuleDialog;

// data keys
ZmFilterRuleDialog.ROW_ID			= "_rowid_";
ZmFilterRuleDialog.IS_CONDITION		= "_condition_";
ZmFilterRuleDialog.DO_ADD			= "_add_";
ZmFilterRuleDialog.BROWSE_TYPE		= "_btype_";
ZmFilterRuleDialog.DATA				= "_data_";

// character width of text inputs
ZmFilterRuleDialog.INPUT_NUM_CHARS = 15;

// button widths
ZmFilterRuleDialog.CHOOSER_BUTTON_WIDTH		= 120;
ZmFilterRuleDialog.PLUS_MINUS_BUTTON_WIDTH	= 20;

ZmFilterRuleDialog.CONDITIONS_INDEX = 0;
ZmFilterRuleDialog.prototype.toString =
function() {
	return "ZmFilterRuleDialog";
};

/**
 * Pops-up the dialog and displays either a given rule for editing, or a dummy
 * rule that is the base for adding a new rule.
 *
 * @param {ZmFilterRule}	rule				the rule to edit
 * @param {Boolean}	editMode			if <code>true</code>, we are editing a rule
 * @param {ZmFilterRule}	referenceRule		the rule after which to add new rule
 * @param {String}	accountName		the name of the account
 */
ZmFilterRuleDialog.prototype.popup =
function(rule, editMode, referenceRule, accountName, outgoing) {
	// always make sure we have the right rules container in case of multi-mbox
	this._rules = AjxDispatcher.run(outgoing ? "GetOutgoingFilterRules" : "GetFilterRules", accountName);
	this._outgoing = outgoing;
	this._rules.loadRules(); // make sure rules are loaded (for when we save)
	this._inputs = {};
	this._rule = rule || ZmFilterRule.getDummyRule();
	this._editMode = editMode;
	this._referenceRule = referenceRule;
	this.setTitle(editMode ? ZmMsg.editFilter : ZmMsg.addFilter);

	var nameField = Dwt.byId(this._nameInputId);
	var name = rule ? rule.name : null;
	nameField.value = name || "";
	nameField.setAttribute('aria-label', ZmMsg.filterName);

	var activeField = Dwt.byId(this._activeCheckboxId);
	activeField.checked = (!rule || rule.active);
	activeField.setAttribute('aria-label', ZmMsg.active);
	Dwt.setHandler(activeField, DwtEvent.ONCHANGE, AjxCallback.simpleClosure(this._activeChangeListener, this));

	var stopField = Dwt.byId(this._stopCheckboxId);
	stopField.checked = (!editMode);

	var checkAll = (rule && (rule.getGroupOp() == ZmFilterRule.GROUP_ALL));
	this._conditionSelect.setSelectedValue(checkAll ? ZmFilterRule.GROUP_ALL : ZmFilterRule.GROUP_ANY);

	this._conditionsTabGroup.removeAllMembers();
	this._actionsTabGroup.removeAllMembers();

	this._renderTable(this._rule, true, this._conditionsTableId, this._rule.conditions, this._conditionsTabGroup);	// conditions
	this._renderTable(this._rule, false, this._actionsTableId, this._rule.actions, this._actionsTabGroup);	// actions
	this._addDwtObjects();

	DwtDialog.prototype.popup.call(this);

	nameField.focus();
};

/**
 * Pops-down the dialog. Clears the conditions and actions table before popdown
 * so we don't keep adding to them.
 */
ZmFilterRuleDialog.prototype.popdown =
function() {
	this._clearTables();
	DwtDialog.prototype.popdown.call(this);
};

/**
 * Gets the tab group member.
 * 
 * @return	{DwtTabGroup}		the tab group
 */
ZmFilterRuleDialog.prototype.getTabGroupMember =
function() {
	return this._tabGroup;
};

/**
 * Gets the HTML that forms the basic framework of the dialog.
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._contentHtml =
function() {
	// identifiers
	var id = this._htmlElId;
	this._nameInputId = id+"_name";
	this._activeCheckboxId = id+"_active";
	this._groupSelectId = id+"_group";
	this._conditionId = id+"_condition";
	this._conditionsTableId = id+"_conditions";
	this._actionsTableId = id+"_actions";
	this._stopCheckboxId = id+"_stop";

	// content html
	return AjxTemplate.expand("prefs.Pages#MailFilterRule", id);
};

ZmFilterRuleDialog.prototype._createControls =
function() {
 this._stopFiltersCheckbox = new DwtCheckbox({parent: this, id: this._stopCheckboxId, checked: true});
 this._stopFiltersCheckbox.replaceElement(document.getElementById(this._stopCheckboxId));
 this._stopFiltersCheckbox.setText(ZmMsg.stopFilterProcessing);
};

ZmFilterRuleDialog.prototype._setConditionSelect =
function() {
	var message = new DwtMessageComposite(this);
	var callback = new AjxCallback(this, this._createConditionControl);
	message.setFormat(ZmMsg.filterCondition, callback);

	var conditionEl = Dwt.byId(this._htmlElId+"_condition");
	message.appendElement(conditionEl);
};

ZmFilterRuleDialog.prototype._createConditionControl =
function(parent, segment, i) {
	if (segment.getIndex() == 0) {
		var format = segment.getSegmentFormat();
		var limits = format.getLimits();
		var formats = format.getFormats();
		var values = [ZmFilterRule.GROUP_ANY, ZmFilterRule.GROUP_ALL];

		var select = this._conditionSelect = new DwtSelect({parent:parent, id: "FilterRuleGroupCondition_" + ZmFilterRuleDialog.CONDITIONS_INDEX++});
		for (var i = 0; i < values.length; i++) {
			// TODO: guard against badly specified message
			select.addOption(formats[i].toPattern(), i == 0, values[i]);
		};

		var setAriaLabel = function() {
			select.setAriaLabel(select._selectedValue === ZmFilterRule.GROUP_ANY ? ZmMsg.anyConditionMet : ZmMsg.allConditionsMet);
		};

		setAriaLabel();
		select.addChangeListener(setAriaLabel);

		return select;
	}
};

ZmFilterRuleDialog.prototype._createTabGroup =
function() {
	// create tabgroups
	var id = this._htmlElId;
	this._tabGroup = new DwtTabGroup(id);
	this._conditionsTabGroup = new DwtTabGroup(id+"_conditions");
	this._actionsTabGroup = new DwtTabGroup(id+"_actions");

	// get basic controls
	var MAX_VALUE = 100000;
	var tabIndexes = {};
	var el, tabIndex;
	var ids = [this._activeCheckboxId, this._nameInputId];
	for (var i = 0; i < ids.length; i++) {
		el = Dwt.byId(ids[i]);
		tabIndex = MAX_VALUE - 6 - i;
		tabIndexes[tabIndex] = el;
	}

	// add other controls
	el = Dwt.byId(this._conditionId);
	tabIndex = MAX_VALUE - 5;
	tabIndexes[tabIndex] = this._conditionSelect;

	// add tabgroups that will hold the conditions and actions
	el = Dwt.byId(this._conditionsTableId);
	tabIndex = MAX_VALUE - 4;
	tabIndexes[tabIndex] = this._conditionsTabGroup;

	el = Dwt.byId(this._actionsTableId);
	tabIndex = MAX_VALUE - 3;
	tabIndexes[tabIndex] = this._actionsTabGroup;

	el = Dwt.byId(this._stopCheckboxId);
	tabIndex = MAX_VALUE -2;
	tabIndexes[tabIndex] = el;

	// add dialog buttons
	tabIndexes[MAX_VALUE - 1] = this.getButton(DwtDialog.OK_BUTTON);
	tabIndexes[MAX_VALUE] = this.getButton(DwtDialog.CANCEL_BUTTON);

	// populate tabgroup
	var keys = AjxUtil.keys(tabIndexes);
	keys.sort(AjxUtil.byNumber);
	for (var i = 0; i < keys.length; i++) {
		this._tabGroup.addMember(tabIndexes[keys[i]]);
	}
};

/**
 * Draws a table of conditions or actions. Returns the ID of the last row added.
 *
 * @param {ZmFilterRule}	rule			the source rule
 * @param {Boolean}			isCondition		if <code>true</code>, we're drawing conditions (as opposed to actions)
 * @param {String}			tableId			the DWT id representing the parent table
 * @param {Object}			rowData			the meta data used to figure out which DWT widget to create
 * @param {DwtTabGroup}		tabGroup		tab group for focus
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._renderTable =
function(rule, isCondition, tableId, rowData, tabGroup) {
	var table = Dwt.byId(tableId);
	table.setAttribute('role', 'presentation');
	var row;
	for (var i in rowData) {
		var data = rowData[i];
		if (isCondition && i == "condition") { continue; }

		// don't show action if it's disabled
		if (!isCondition) {
			var actionIndex = ZmFilterRule.A_VALUE_MAP[i];
			if (!ZmFilterRule.checkPreconditions(ZmFilterRule.ACTIONS[actionIndex]) && actionIndex != ZmFilterRule.A_FORWARD) { continue; }
		}

		for (j = 0; j < data.length; j++) {
			var rowId = Dwt.getNextId();
			this._enterTabScope(rowId);
			try {
				var html = this._getRowHtml(data[j], i, isCondition, rowId);
				if (html) {
					row = Dwt.parseHtmlFragment(html, true);
					table.tBodies[0].appendChild(row);
					tabGroup.addMember(this._getCurrentTabScope());
				}
			}
			finally {
				this._exitTabScope();
			}
		}
	}

	this._resetOperations(isCondition);

	return (row ? row.id : null);
};

/**
 * Gets the HTML for a single condition or action row.
 *
 * @param {Object}	data			an object containing meta info about the filter rule condition or action
 * @param {String}	test			the type of test condition (headerTest, sizeTest, bodyTest, etc)
 * @param {Boolean}	isCondition		if <code>true</code>, we're rendering a condition row
 * @param {String}	rowId			the unique ID representing this row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._getRowHtml =
function(data, test, isCondition, rowId) {
	var conf;
	if (isCondition) {
		conf = this._getConditionFromTest(test, data);
		if (!conf) {
			return ""; //see bug 85825 - encountered such a case if I had a socialcast filter before I removed socialcast code.
		}
	} else {
		var actionId = ZmFilterRule.A_VALUE_MAP[test];
		conf = ZmFilterRule.ACTIONS[actionId];
	}

	var html = [];
	var i = 0;

	this._inputs[rowId] = {};

	html[i++] = "<tr id='";
	html[i++] = rowId;
	html[i++] = "'>";

	if (isCondition) {
		this._inputs[rowId].isCondition = true;
		html[i++] = this._createRowComponent(true, "subject", ZmFilterRule.CONDITIONS_LIST, data, test, rowId);
		html[i++] = this._createRowComponent(conf, "subjectMod", conf.smOptions, data, test, rowId);
		html[i++] = this._createRowComponent(conf, "ops", conf.opsOptions, data, test, rowId);
		html[i++] = this._createRowComponent(conf, "value", conf.vOptions, data, test, rowId);
		html[i++] = this._createRowComponent(conf, "valueMod", conf.vmOptions, data, test, rowId);
		if (data && data.caseSensitive) {
			this._inputs[rowId]["caseSensitive"] = {value: data.caseSensitive}; //save case sensitive value if it exists
		}
	} else {
		if (test == ZmFilterRule.A_NAME_STOP) {
			var stopField = Dwt.byId(this._stopCheckboxId);
			stopField.checked = true;
			return;
		}
		html[i++] = "<td role='none'><table role='presentation' class='filterActions'><tr>";
		if (conf) {
			var options = this._outgoing ? ZmFilterRule.ACTIONS_OUTGOING_LIST : ZmFilterRule.ACTIONS_LIST;
			html[i++] = this._createRowComponent(false, "name", options, data, test, rowId);
			html[i++] = this._createRowComponent(conf, "param", conf.pOptions, data, test, rowId);
		}
		else {
		 //see if it's a actionReply or actionNotify filter and output readonly
			if (actionId == ZmFilterRule.A_NOTIFY && data) {
				var email = data.a;
				var content = AjxUtil.isArray(data.content) ?  data.content[0]._content : "";
				var maxBodySize = data.maxBodySize;
				var subject = data.su;

				html[i++] = "<td><table role='presentation'>";
				html[i++] = "<tr><td>" + ZmMsg.actionNotifyReadOnlyMsg + "</td></tr>";
				html[i++] = "<tr><td>" + ZmMsg.emailLabel + " " + email + " | " + subject + " | " + ZmMsg.maxBodySize + ": " + maxBodySize + "</td><tr>";
				html[i++] = "<tr><td style='max-width:100px'>" + ZmMsg.body + ": " + content + "</td></tr></table></td>";
			}
			else if (actionId == ZmFilterRule.A_REPLY && data) {
				var content = AjxUtil.isArray(data.content) ? data.content[0]._content : "";
				html[i++] = "<td><table role='presentation'><tr><td>" + ZmMsg.actionReplyReadOnlyMsg + "</td></tr>";
				html[i++] = "<tr><td style='max-width:100px'>" + ZmMsg.body + ": " + content + "</td></tr></table></td>";
			}
			this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
		}
		html[i++] = "</tr></table></td>";
	}
	html[i++] = this._getPlusMinusHtml(rowId, isCondition);
	html[i++] = "</tr>";

	return html.join("");
};

ZmFilterRuleDialog.prototype._getConditionFromTest =
function(test, data) {
	var condition;
	switch (test) {
		case ZmFilterRule.TEST_ADDRESS:
			condition = ZmFilterRule.C_ADDRESS_MAP[data.header];
			if (!condition) { // shouldn't get here
				condition = ZmFilterRule.C_ADDRESS;
			}
			break;
		case ZmFilterRule.TEST_HEADER_EXISTS:	        condition = ZmFilterRule.C_HEADER; break;
		case ZmFilterRule.TEST_SIZE:			        condition = ZmFilterRule.C_SIZE; break;
		case ZmFilterRule.TEST_DATE:			        condition = ZmFilterRule.C_DATE; break;
		case ZmFilterRule.TEST_BODY:			        condition = ZmFilterRule.C_BODY; break;
		case ZmFilterRule.TEST_ATTACHMENT:		        condition = ZmFilterRule.C_ATT; break;
		case ZmFilterRule.TEST_MIME_HEADER:		        condition = ZmFilterRule.C_MIME_HEADER; break;
		case ZmFilterRule.TEST_ADDRBOOK:		        condition = ZmFilterRule.C_ADDRBOOK; break;
		case ZmFilterRule.TEST_INVITE:			        condition = ZmFilterRule.C_INVITE; break;
		case ZmFilterRule.TEST_CONVERSATIONS:	        condition = ZmFilterRule.C_CONV; break;
		case ZmFilterRule.TEST_SOCIAL:			        condition = ZmFilterRule.C_SOCIAL; break;
		case ZmFilterRule.TEST_FACEBOOK:		        condition = ZmFilterRule.C_SOCIAL; break;
		case ZmFilterRule.TEST_TWITTER:			        condition = ZmFilterRule.C_SOCIAL; break;
		case ZmFilterRule.TEST_LINKEDIN:		        condition = ZmFilterRule.C_SOCIAL; break;
		case ZmFilterRule.TEST_COMMUNITY:		        condition = ZmFilterRule.C_COMMUNITY; break;
		case ZmFilterRule.TEST_COMMUNITY_REQUESTS:		condition = ZmFilterRule.C_COMMUNITY; break;
		case ZmFilterRule.TEST_COMMUNITY_CONTENT:		condition = ZmFilterRule.C_COMMUNITY; break;
		case ZmFilterRule.TEST_COMMUNITY_CONNECTIONS:   condition = ZmFilterRule.C_COMMUNITY; break;
		case ZmFilterRule.TEST_LIST:			        condition = ZmFilterRule.C_CONV; break;
		case ZmFilterRule.TEST_BULK:			        condition = ZmFilterRule.C_CONV; break;
		case ZmFilterRule.TEST_ME:				        condition = ZmFilterRule.C_ADDRBOOK; break;
		case ZmFilterRule.TEST_RANKING:			        condition = ZmFilterRule.C_ADDRBOOK; break;
		case ZmFilterRule.TEST_IMPORTANCE:		        condition = ZmFilterRule.C_CONV; break;
		case ZmFilterRule.TEST_FLAGGED:			        condition = ZmFilterRule.C_CONV; break;
		case ZmFilterRule.TEST_HEADER:
			condition = ZmFilterRule.C_HEADER_MAP[data.header];
			if (!condition) { // means custom header
				condition = ZmFilterRule.C_HEADER;
			}  
			break;
	}

	//TODO: find a better way to do this.  Preconditions for opsOptions?
	if (condition == ZmFilterRule.C_SOCIAL) {
		condition = ZmFilterRule.CONDITIONS[condition];
		condition.opsOptions = ZmFilterRule.getSocialFilters();
		return condition;
	}
	return (condition ? ZmFilterRule.CONDITIONS[condition] : null);
};

ZmFilterRuleDialog.prototype._enterTabScope =
function(id) {
	if (!this._tabScope) {
		this._tabScope = [];
	}
	var tabGroup = new DwtTabGroup(id || Dwt.getNextId());
	this._tabScope.push(tabGroup);
	return tabGroup;
};

ZmFilterRuleDialog.prototype._getCurrentTabScope =
function() {
	if (this._tabScope) {
		return this._tabScope[this._tabScope.length - 1];
	}
};

ZmFilterRuleDialog.prototype._exitTabScope =
function() {
	return this._tabScope ? this._tabScope.pop() : null;
};

/**
 * Adds a new condition or action row to its table.
 *
 * @param {Boolean}	isCondition	if <code>true</code>, we're adding a condition row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._addRow =
function(isCondition) {
	var rule = ZmFilterRule.getDummyRule();
	var tableId, data, tabGroup;
	if (isCondition) {
		tableId = this._conditionsTableId;
		data = rule.conditions;
		tabGroup = this._conditionsTabGroup;
	} else {
		tableId = this._actionsTableId;
		data = rule.actions;
		tabGroup = this._actionsTabGroup;
	}
	var newRowId = this._renderTable(rule, isCondition, tableId, data, tabGroup);
	this._addDwtObjects(newRowId);
};

/**
 * Removes a condition or action row from its table. Also cleans up any DWT
 * objects the row was using.
 *
 * @param {String}	rowId			the ID of the row to remove
 * @param {Boolean}	isCondition		if <code>true</code>, we're removing a condition row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._removeRow =
function(rowId, isCondition) {
	var row = Dwt.byId(rowId);
	if (!row) { return; }
		
	var table = Dwt.byId(isCondition ? this._conditionsTableId : this._actionsTableId);
	var rows = table.rows;
	for (var i = 0; i < rows.length; i++) {
		if (rows[i] == row) {
			table.deleteRow(i);
			break;
		}
	}
	this._removeDwtObjects(rowId);
	delete this._inputs[rowId];
};

/**
 * Creates an input widget and returns HTML for a table cell that will contain it.
 * The config for a condition or action is based on its main operator; for conditions
 * it's called subject ("from", "body", etc), and for actions it's just called the
 * action ("keep", "fileinto", etc). Each one of those has its own particular inputs.
 * This method creates one of those inputs.
 *
 * @param {Hash|Boolean}	conf		the config for this subject or action; boolean if rendering
 *										the actual subject or action (means "isCondition")
 * @param {String}			field		the name of the input field
 * @param {Array}			options		if the field type is a select, its options
 * @param {Object}			rowData		the current value of the field, if any
 * @param {String}			testType	the type of test condition (i.e. headerTest, attachmentTest, bodyTest, etc)
 * @param {String}			rowId		the ID of the containing row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._createRowComponent =
function(conf, field, options, rowData, testType, rowId) {
	var tabGroup = this._getCurrentTabScope();

	var isCondition, type;
	var isMainSelect = AjxUtil.isBoolean(conf);
	if (isMainSelect) {
		type = ZmFilterRule.TYPE_SELECT;
		isCondition = conf;
	} else {
		type = conf[field];
		if (!type) {
			return "<td></td>";
		}
	}

	var dataValue = this._getDataValue(isMainSelect, testType, field, rowData);

	var id = Dwt.getNextId();
	if (type == ZmFilterRule.TYPE_INPUT) {
		var inputFieldId = "FilterRuleDialog_INPUTFIELD_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var inputId = "FilterRuleDialog_INPUT_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var input = new DwtInputField({parent: this, type: DwtInputField.STRING, initialValue: dataValue, size: 20, id: inputFieldId, inputId: inputId});
		input.setData(ZmFilterRuleDialog.ROW_ID, rowId);
		this._inputs[rowId][field] = {id: id, dwtObj: input};
		tabGroup.addMember(input.getTabGroupMember());
	}
	else if (type == ZmFilterRule.TYPE_SELECT) {
		var selectId = "FilterRuleDialog_SELECT_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var select = new DwtSelect({parent:this, id: selectId});
		select.setData(ZmFilterRuleDialog.ROW_ID, rowId);
        select.fixedButtonWidth();
		this._inputs[rowId][field] = {id: id, dwtObj: select};
		if (isMainSelect) {
			select.setData(ZmFilterRuleDialog.IS_CONDITION, isCondition);
			select.addChangeListener(this._rowChangeLstnr);
			if (field === "subject") {
				select.setAriaLabel(ZmMsg.header);
			} else if (field === "name") {
				select.setAriaLabel(ZmMsg.action);
			}
		} 
		else if (field == "ops") {
			if (testType == ZmFilterRule.TEST_HEADER) {
				select.setData(ZmFilterRuleDialog.IS_CONDITION, isCondition);
				select.addChangeListener(this._opsChangeLstnr);
			}
			else if (testType == ZmFilterRule.TEST_ADDRBOOK || testType == ZmFilterRule.TEST_ME) {
				select.addChangeListener(this._addrBookChangeLstnr);
			}
			select.setAriaLabel(ZmMsg.condition);
		}
		else if (field == "value") {
			if (testType == ZmFilterRule.TEST_ADDRESS || testType == ZmFilterRule.TEST_ME)
			{
				select.setVisibility(false); //Don't show value "me" for address test 
			}
			else if (testType == ZmFilterRule.TEST_CONVERSATIONS || testType == ZmFilterRule.TEST_LIST  ||  testType == ZmFilterRule.TEST_BULK || testType == ZmFilterRule.TEST_IMPORTANCE || testType == ZmFilterRule.TEST_FLAGGED) {
				select.addChangeListener(this._importanceChangeLstnr);
			}
			select.setAriaLabel(ZmMsg.value);
		}
		else if (field == "valueMod"){
			if (testType == ZmFilterRule.TEST_FLAGGED && (rowData.flagName == ZmFilterRule.READ || rowData.flagName == ZmFilterRule.PRIORITY)) {
				var valueSelect = this._inputs[rowId]["value"].dwtObj;
				var index = valueSelect.getIndexForValue(ZmFilterRule.IMPORTANCE);
				valueSelect.setSelected(index);
			}
			else if (testType == ZmFilterRule.TEST_CONVERSATIONS || testType == ZmFilterRule.TEST_LIST ||  testType == ZmFilterRule.TEST_BULK || testType == ZmFilterRule.TEST_FLAGGED) {
				select.setVisibility(false);
			}
			select.setAriaLabel(ZmMsg.valueType);
		}
		else if (field === "name") {
			select.setAriaLabel(ZmMsg.action);
		}
		
		for (var i = 0; i < options.length; i++) {
			var o = options[i];
			// skip if the action or this option is disabled
			var okay = ZmFilterRule.checkPreconditions(ZmFilterRule.CONDITIONS[o] || ZmFilterRule.ACTIONS[o] || o);
			if (!okay && (o !== ZmFilterRule.A_FORWARD || !rowData || !rowData.a)) {
				continue;
			}

			var value, label;
			if (isMainSelect) {
				value = o;
				label = isCondition ? ZmFilterRule.C_LABEL[o] : ZmFilterRule.A_LABEL[o];
			} else if (field == "ops") {
				value = o;
				label = ZmFilterRule.OP_LABEL[o];
			} else {
				value = o.value;
				label = o.label;
			}
			var selected = (dataValue && value && (value.toLowerCase() == dataValue.toLowerCase()));
			if (value && value.toLowerCase()== "bcc" && !this._outgoing && !selected) {
				continue;
			}
			select.addOption(new DwtSelectOptionData(value, label, selected));
		}
		if (!select.getValue()) {
			select.setSelected(0);
		}
		tabGroup.addMember(select.getTabGroupMember());
	}
	else if (type == ZmFilterRule.TYPE_CALENDAR) {
		// create button with calendar that hangs off menu
		var dateId = "FilterRuleDialog_DATE_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var dateButton = new DwtButton({parent:this, id: dateId});
		dateButton.setSize(ZmFilterRuleDialog.CHOOSER_BUTTON_WIDTH, Dwt.DEFAULT);
		var date, dateText;
		if (dataValue) {
			date = new Date(dataValue);
			dateText = AjxDateUtil.simpleComputeDateStr(date);
		} else {
			date = null;
			dateText = ZmMsg.chooseDate;
		}
		dateButton.setText(dateText);
		dateButton.setData(ZmFilterRuleDialog.DATA, date);
		var calId = "FilterRuleDialog_CAL_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var calMenu = new DwtMenu({parent:dateButton, style:DwtMenu.CALENDAR_PICKER_STYLE, id: calId});
		dateButton.setMenu(calMenu, true);
		var cal = new DwtCalendar({parent:calMenu});
		cal.setSkipNotifyOnPage(true);
		cal.addSelectionListener(this._dateLstnr);
		cal.setDate(date || new Date());
		cal._dateButton = dateButton;
		this._inputs[rowId][field] = {id: id, dwtObj: dateButton};
		tabGroup.addMember(dateButton.getTabGroupMember());
	}
	else if (type == ZmFilterRule.TYPE_FOLDER_PICKER || type == ZmFilterRule.TYPE_TAG_PICKER) {
		var buttonId = "FilterRuleDialog_BUTTON_" + ZmFilterRuleDialog.CONDITIONS_INDEX++;
		var button = new DwtButton({parent:this, id: buttonId});
		var organizer;
		if (dataValue) {
			if (type == ZmFilterRule.TYPE_FOLDER_PICKER) {
				var folderTree = appCtxt.getFolderTree();
				if (folderTree) {
					dataValue = (dataValue.charAt(0) == '/') ? dataValue.substring(1) : dataValue;
					organizer = folderTree.getByPath(dataValue, true);
				}
			} else {
				var tagTree = appCtxt.getTagTree();
				if (tagTree) {
					organizer = tagTree.getByName(dataValue);
				}
			}
		}
		var	text = organizer ? AjxStringUtil.htmlEncode(organizer.getName(false, null, true)) : ZmMsg.browse;
		button.setText(text);
		button.setData(ZmFilterRuleDialog.BROWSE_TYPE, type);
		button.setData(ZmFilterRuleDialog.DATA, dataValue);
		this._inputs[rowId][field] = {id: id, dwtObj: button};
		button.addSelectionListener(this._browseLstnr);
		tabGroup.addMember(button.getTabGroupMember());
	}

	return "<td role='none' id='" + id + "'></td>";
};

ZmFilterRuleDialog.prototype._getDataValue =
function(isMainSelect, testType, field, rowData) {
	var dataValue;
	if (isMainSelect) {
		switch (testType) {
		case ZmFilterRule.TEST_HEADER:
			dataValue = ZmFilterRule.C_HEADER_MAP[rowData.header];
			if (!dataValue) { // means custom header
				dataValue = ZmFilterRule.C_HEADER;
			}
			break;
			case ZmFilterRule.TEST_HEADER_EXISTS:	        dataValue = ZmFilterRule.C_HEADER; break;
			case ZmFilterRule.TEST_SIZE:			        dataValue = ZmFilterRule.C_SIZE; break;
			case ZmFilterRule.TEST_DATE:			        dataValue = ZmFilterRule.C_DATE; break;
			case ZmFilterRule.TEST_BODY:			        dataValue = ZmFilterRule.C_BODY; break;
			case ZmFilterRule.TEST_ATTACHMENT:		        dataValue = ZmFilterRule.C_ATT; break;
			case ZmFilterRule.TEST_MIME_HEADER:		        dataValue = ZmFilterRule.C_MIME_HEADER; break;
			case ZmFilterRule.TEST_ADDRBOOK:		        dataValue = ZmFilterRule.C_ADDRBOOK; break;
			case ZmFilterRule.TEST_INVITE:			        dataValue = ZmFilterRule.C_INVITE; break;
			case ZmFilterRule.TEST_CONVERSATIONS:	        dataValue = ZmFilterRule.C_CONV; break;
			case ZmFilterRule.TEST_SOCIAL:			        dataValue = ZmFilterRule.C_SOCIAL; break;
			case ZmFilterRule.TEST_FACEBOOK:		        dataValue = ZmFilterRule.C_SOCIAL; break;
			case ZmFilterRule.TEST_TWITTER:			        dataValue = ZmFilterRule.C_SOCIAL; break;
			case ZmFilterRule.TEST_LINKEDIN:		        dataValue = ZmFilterRule.C_SOCIAL; break;
			case ZmFilterRule.TEST_COMMUNITY:		        dataValue = ZmFilterRule.C_COMMUNITY; break;
			case ZmFilterRule.TEST_COMMUNITY_REQUESTS:		dataValue = ZmFilterRule.C_COMMUNITY; break;
			case ZmFilterRule.TEST_COMMUNITY_CONTENT:		dataValue = ZmFilterRule.C_COMMUNITY; break;
			case ZmFilterRule.TEST_COMMUNITY_CONNECTIONS:   dataValue = ZmFilterRule.C_COMMUNITY; break;
			case ZmFilterRule.TEST_ADDRESS:
				dataValue = ZmFilterRule.C_ADDRESS_MAP[rowData.header];
				if (!dataValue) { 
					dataValue = ZmFilterRule.C_ADDRESS;
				}
				break;
			case ZmFilterRule.TEST_LIST:			        dataValue = ZmFilterRule.C_CONV; break;
			case ZmFilterRule.TEST_BULK:			        dataValue = ZmFilterRule.C_CONV; break;
			case ZmFilterRule.TEST_ME:				        dataValue = ZmFilterRule.C_ADDRBOOK; break;
			case ZmFilterRule.TEST_RANKING:			        dataValue = ZmFilterRule.C_ADDRBOOK; break;
			case ZmFilterRule.TEST_IMPORTANCE:		        dataValue = ZmFilterRule.C_CONV; break;
			case ZmFilterRule.TEST_FLAGGED:			        dataValue = ZmFilterRule.C_CONV; break;
			// default returns action type
			default:								return ZmFilterRule.A_VALUE_MAP[testType];
		}
	} else {
		// conditions
		if (testType == ZmFilterRule.TEST_HEADER) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = ZmFilterRule.OP_VALUE_MAP[rowData.stringComparison] == ZmFilterRule.OP_IS_READRECEIPT ? ZmFilterRule.OP_CONTAINS : 
						ZmFilterRule.OP_VALUE_MAP[rowData.stringComparison];
				if (dataValue && rowData.negative == "1") {
					dataValue = ZmFilterRule.getNegativeComparator(dataValue);
				}
			} else if (field == "value") {
				dataValue = rowData.value;
			}
		}
		else if (testType == ZmFilterRule.TEST_HEADER_EXISTS) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_EXISTS
					: ZmFilterRule.OP_EXISTS;
			} else if (field == "value") {
				dataValue = rowData.value;
			}
		}
		else if (testType == ZmFilterRule.TEST_SIZE) {
			if (field == "ops") {
				dataValue = ZmFilterRule.OP_VALUE_MAP[rowData.numberComparison];
				if (dataValue && rowData.negative == "1") {
					dataValue = ZmFilterRule.getNegativeComparator(dataValue);
				}
			} else if (field == "valueMod") {
				var m = rowData.s ? rowData.s.match(/(\d+)([A-Z]*)/) : null;
				dataValue = m ? ((!m[2]) ? "B" : m[2]) : null;
			} else if (field == "value") {
				dataValue = rowData.s ? rowData.s.match(/(\d+)/)[0] : null;
			}
		}
		else if (testType == ZmFilterRule.TEST_DATE) {
			if (field == "ops") {
				dataValue = ZmFilterRule.OP_VALUE_MAP[rowData.dateComparison];
				if (dataValue && rowData.negative == "1") {
					dataValue = ZmFilterRule.getNegativeComparator(dataValue);
				}
			} else if (field == "value") {
				dataValue = rowData.d * 1000;
			}
		}
		else if (testType == ZmFilterRule.TEST_BODY) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONTAINS
					: ZmFilterRule.OP_CONTAINS;
			} else if (field == "value") {
				dataValue = rowData.value;
			}
		}
		else if (testType == ZmFilterRule.TEST_ATTACHMENT) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_EXISTS
					: ZmFilterRule.OP_EXISTS;
			}
		}
		else if (testType == ZmFilterRule.TEST_LIST) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONV
					: ZmFilterRule.OP_CONV_IS;
			}
			else if (field == "value") {
				dataValue = ZmFilterRule.C_LIST;
			}
		}
		else if (testType == ZmFilterRule.TEST_BULK) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONV
					: ZmFilterRule.OP_CONV_IS;
			}
			else if (field == "value") {
				dataValue = ZmFilterRule.C_BULK;
			}
		}
		else if (testType == ZmFilterRule.TEST_CONVERSATIONS) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONV
					: ZmFilterRule.OP_CONV_IS;	
			}
			else if (field == "value") {
				dataValue = rowData.where;
			}
		}
		else if (testType == ZmFilterRule.TEST_IMPORTANCE) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONV
					: ZmFilterRule.OP_CONV_IS;	
			}
			else if (field == "value") {
				dataValue = ZmFilterRule.IMPORTANCE;
			}
			else if (field == "valueMod") {
				dataValue = rowData.imp;
			}
		}
		else if (testType == ZmFilterRule.TEST_FLAGGED) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_CONV
					: ZmFilterRule.OP_CONV_IS;	
			}
			else if (field == "value") {
				dataValue = ZmFilterRule.FLAGGED;	
			}
			else if (field == "valueMod") {
				dataValue = rowData.flagName;
			}
		}
		else if (testType == ZmFilterRule.TEST_FACEBOOK) {
			dataValue = ZmFilterRule.OP_SOCIAL_FACEBOOK;
		}
		else if (testType == ZmFilterRule.TEST_TWITTER) {
			dataValue = ZmFilterRule.OP_SOCIAL_TWITTER;
		}
		else if (testType == ZmFilterRule.TEST_LINKEDIN) {
			dataValue = ZmFilterRule.OP_SOCIAL_LINKEDIN;
		}
		else if (testType == ZmFilterRule.TEST_INVITE) {
			if (field == "ops") {
				var isRequested = ZmFilterRule.OP_VALUE[ZmFilterRule.OP_IS_REQUESTED];
				var tmpValue = rowData.method && rowData.method[0]._content;
				if (rowData.negative!=1) {
					dataValue = (isRequested == tmpValue)
					? ZmFilterRule.OP_IS_REQUESTED
					: ZmFilterRule.OP_IS_REPLIED;
				}else {
					dataValue = (isRequested == tmpValue)
					? ZmFilterRule.OP_NOT_REQUESTED
					: ZmFilterRule.OP_NOT_REPLIED;
				}
			}
		}
		else if (testType == ZmFilterRule.TEST_ADDRBOOK) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_IN
					: ZmFilterRule.OP_IN;
			} else if (field == "value") {
				dataValue = rowData.type;
			}
		}
		else if (testType == ZmFilterRule.TEST_ADDRESS) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = ZmFilterRule.OP_VALUE_MAP[rowData.stringComparison] == ZmFilterRule.OP_IS_READRECEIPT ? ZmFilterRule.OP_CONTAINS : 
				ZmFilterRule.OP_VALUE_MAP[rowData.stringComparison];
				if (dataValue && rowData.negative == "1") {
					dataValue = ZmFilterRule.getNegativeComparator(dataValue);
				}						
			} else if (field == "value") {
				dataValue = rowData.value;
			} else if (field == "valueMod") {
				dataValue = rowData.part;
			}
		}
		else if (testType == ZmFilterRule.TEST_ME) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = (rowData.negative == "1")
							? ZmFilterRule.OP_NOT_ME
							: ZmFilterRule.OP_IS_ME;						
			} else if (field == "value") {
				dataValue = rowData.value;
			}
		}
		else if (testType == ZmFilterRule.TEST_RANKING) {
			if (field == "subjectMod") {
				dataValue = rowData.header;
			} else if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_IN
					: ZmFilterRule.OP_IN;
			} else if (field == "value") {
				dataValue = ZmFilterRule.RANKING;
			}
		}
		else if (testType == ZmFilterRule.TEST_MIME_HEADER) {
			if (field == "ops") {
				dataValue = (rowData.negative == "1")
					? ZmFilterRule.OP_NOT_READRECEIPT
					: ZmFilterRule.OP_IS_READRECEIPT;
			}
		}
		// actions
		else if (testType == ZmFilterRule.A_NAME_FOLDER) {
			dataValue = rowData.folderPath;
		}
		else if (testType == ZmFilterRule.A_NAME_FLAG) {
			dataValue = rowData.flagName;
		}
		else if (testType == ZmFilterRule.A_NAME_TAG) {
			dataValue = rowData.tagName;
		}
		else if (testType == ZmFilterRule.A_NAME_FORWARD) {
			dataValue = rowData.a;
		}
		else if (ZmFilterRule.OP_COMMUNITY_MAP_R[testType]) {
			dataValue = ZmFilterRule.OP_COMMUNITY_MAP_R[testType];
		}
	}

	return dataValue;
};

/**
 * Returns HTML for the + and - buttons at the end of each row.
 *
 * @param {String}	rowId			the ID of the row that gets the buttons
 * @param {Boolean}	isCondition		the <code>true</code>, we're adding them to a condition row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._getPlusMinusHtml =
function(rowId, isCondition) {
	var tabGroup = this._getCurrentTabScope();
	var html = [];
	var j = 0;
	html[j++] = "<td width='1%'><table role='presentation' class='FilterAddRemoveButtons'><tr>";
	var buttons = ["Plus", "Minus"];
	for (var i = 0; i < buttons.length; i++) {
		var b = buttons[i];
		var button = new DwtButton({parent:this});
		button.setImage(b);
		button.setData(ZmFilterRuleDialog.ROW_ID, rowId);
		button.setData(ZmFilterRuleDialog.IS_CONDITION, isCondition);
		button.setData(ZmFilterRuleDialog.DO_ADD, (b == "Plus"));
		button.addSelectionListener(this._plusMinusLstnr);
		button.setAriaLabel(b === "Plus" ? ZmMsg.addFilterRule : ZmMsg.removeFilterRule);
		var id = Dwt.getNextId("TEST_");
		this._inputs[rowId][b] = {id: id, dwtObj: button};
		html[j++] = "<td id='";
		html[j++] = id;
		html[j++] = "'></td>";
		tabGroup.addMember(button);
	}
	html[j++] = "</tr></table></td>";
	return html.join("");
};

/**
 * If there's only one row, disable its Minus button (since removing it would
 * leave the user with nothing).
 *
 * @param {Boolean}	isCondition	if <code>true</code>, we're checking a condition row
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._resetOperations =
function(isCondition) {
	var tableId = isCondition ? this._conditionsTableId : this._actionsTableId;
	var table = Dwt.byId(tableId);
	var rows = table.rows;
	if (!(rows && rows.length)) { return; }

	var input = this._inputs[rows[0].id];
	if (input) {
		var minusButton = input["Minus"].dwtObj;
		if (rows.length == 1) {
			minusButton.setEnabled(false);
		} else {
			minusButton.setEnabled(true);
		}
	}
};

/**
 * Update the inputs for a row based on the subject (condition), or action name.
 * The old row is removed, and a new row is created and inserted.
 *
 * @param {DwtEvent}	ev		the event (from {@link DwtSelect})
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._rowChangeListener =
function(ev) {
	var newValue = ev._args.newValue;
	var oldValue = ev._args.oldValue;
	var rowId = ev._args.selectObj.getData(ZmFilterRuleDialog.ROW_ID);
	var isCondition = ev._args.selectObj.getData(ZmFilterRuleDialog.IS_CONDITION);
	var tabGroup = isCondition ? this._conditionsTabGroup : this._actionsTabGroup;

	// preserve op and value between header fields
	var comparator, dataValue;
	if (isCondition && (ZmFilterRule.IS_HEADER[oldValue] && ZmFilterRule.IS_HEADER[newValue])) {
		comparator = this._getInputValue(this._inputs[rowId], ZmFilterRule.CONDITIONS[oldValue], "ops");
		dataValue = this._getInputValue(this._inputs[rowId], ZmFilterRule.CONDITIONS[oldValue], "value");
	}
	else if (isCondition && (ZmFilterRule.IS_ADDRESS[oldValue] && ZmFilterRule.IS_ADDRESS[newValue])) {
		comparator = this._getInputValue(this._inputs[rowId], ZmFilterRule.CONDITIONS[oldValue], "ops");
		dataValue = this._getInputValue(this._inputs[rowId], ZmFilterRule.CONDITIONS[oldValue], "value");
	}
		
	var row = Dwt.byId(rowId);
	var index = this._getIndexForRow(row, isCondition);
	var table = Dwt.byId(isCondition ? this._conditionsTableId : this._actionsTableId);
	this._removeDwtObjects(rowId);
	table.deleteRow(index);
	var newIndex = (index >= table.rows.length) ? null : index; // null means add to end

	var test, data, subjectMod;
	if (isCondition) {
		test = ZmFilterRule.C_TEST_MAP[newValue];
		if (test == ZmFilterRule.TEST_HEADER) {
			subjectMod = ZmFilterRule.C_HEADER_VALUE[newValue];
		}
		else if (test == ZmFilterRule.TEST_ADDRESS) {
			subjectMod = ZmFilterRule.C_ADDRESS_VALUE[newValue];
		}
		data = ZmFilterRule.getConditionData(test, comparator, dataValue, subjectMod);
	} else {
		test = ZmFilterRule.A_VALUE[newValue];
		data = ZmFilterRule.getActionData(test);
	}

	this._enterTabScope(rowId);
	try {
		var html = this._getRowHtml(data, test, isCondition, rowId);
		if (html) {
			row = Dwt.parseHtmlFragment(html, true);
			if (!row) {
				DBG.println(AjxDebug.DBG1, "Filter rule dialog: no row created!");
				return;
			}
			table.tBodies[0].insertBefore(row, (newIndex != null) ? table.rows[newIndex] : null);
			this._addDwtObjects(row.id);
			this._resetOperations(isCondition);
			tabGroup.removeMember(DwtTabGroup.getByName(rowId));
			tabGroup.addMember(this._getCurrentTabScope());
		}
	}
	finally {
		this._exitTabScope();
	}
};

/**
 * For the "Header Named" input only - hide the last input field (value) if the
 * selected op is "exists" or "does not exist", since those are unary ops which
 * don't take a value.
 *
 * @param {DwtEvent}	ev		the event (from {@link DwtSelect})
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._opsChangeListener =
function(ev) {
	var rowId = ev._args.selectObj.getData(ZmFilterRuleDialog.ROW_ID);
	var input = this._inputs[rowId];
	if (!input) { return; }
	var newValue = ev._args.newValue;
	input["value"].dwtObj.setVisibility(!(newValue == ZmFilterRule.OP_EXISTS || newValue == ZmFilterRule.OP_NOT_EXISTS));
};

ZmFilterRuleDialog.prototype._addrBookChangeListener =
function(ev) {
	var rowId = ev._args.selectObj.getData(ZmFilterRuleDialog.ROW_ID);
	var input = this._inputs[rowId];
	if (!input && !input["ops"] && !input["ops"].dwtObj) {
		return;
	}
	var value = input["ops"].dwtObj.getValue();
	if (value == ZmFilterRule.OP_IS_ME || value == ZmFilterRule.OP_NOT_ME) {
		input["value"].dwtObj.setVisibility(false);
	}
	else {
		input["value"].dwtObj.setVisibility(true);
	}
};

ZmFilterRuleDialog.prototype._importanceChangeListener = 
function(ev) {
	var rowId = ev._args.selectObj.getData(ZmFilterRuleDialog.ROW_ID);
	var input = this._inputs[rowId];
	if (!input && !input["value"] && !input["value"].dwtObj) {
		return;
	}
	var value = input["value"].dwtObj.getValue();
	if (value == ZmFilterRule.IMPORTANCE) {
		input["valueMod"].dwtObj.setVisibility(true);
	}
	else {
		input["valueMod"].dwtObj.setVisibility(false);
	}		
};

/**
 * Updates the calendar button text with a date that's just been selected.
 *
 * @param {DwtEvent}	ev		the event (from {@link DwtCalendar})
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._dateListener =
function(ev) {
	var cal = ev.item;
	if (!cal._dateButton) { return; }
	var date = ev.detail;
	var button = cal._dateButton;
	button.setText(AjxDateUtil.simpleComputeDateStr(date));
	button.setData(ZmFilterRuleDialog.DATA, date);
};

/**
 * Adds or removes a condition/action row.
 *
 * @param {DwtEvent}	ev		the event
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._plusMinusListener =
function(ev) {
	var button = ev.item;
	var isCondition = button.getData(ZmFilterRuleDialog.IS_CONDITION);
	var doAdd = button.getData(ZmFilterRuleDialog.DO_ADD);
	if (doAdd) {
		this._addRow(isCondition);
	} else {
		var rowId = button.getData(ZmFilterRuleDialog.ROW_ID);
		this._removeRow(rowId, isCondition);
	}
	this._resetOperations(isCondition);
};

/**
 * Pops up one of two dialogs, for choosing a folder or a tag.
 * 
 * @param {DwtEvent}	ev		the event
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._browseListener =
function(ev) {
	var type = ev.item.getData(ZmFilterRuleDialog.BROWSE_TYPE);
	var isFolder = (type == ZmFilterRule.TYPE_FOLDER_PICKER);
	var dialog = isFolder ? appCtxt.getChooseFolderDialog(ZmApp.MAIL) : appCtxt.getPickTagDialog();
	var overviewId = isFolder ? dialog.getOverviewId(ZmApp.MAIL) : null;
	if (appCtxt.multiAccounts) {
		overviewId = [overviewId, "-", appCtxt.getActiveAccount().name, this.toString()].join("");
	}

	dialog.reset();
	dialog.setTitle((type == ZmFilterRule.TYPE_FOLDER_PICKER) ? ZmMsg.chooseFolder : ZmMsg.chooseTag);
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._browseSelectionCallback, this, [ev.item, dialog]);
	dialog.popup({overviewId:overviewId, appName:ZmApp.MAIL, forceSingle:true});
};

/**
 * Changes the text of a button to the folder/tag that the user just chose.
 *
 * @param	{DwtButton}		button		the browse button
 * @param	{ZmDialog}		dialog		the folder or tag dialog that is popped up
 * @param	{ZmOrganizer}	organizer	the folder or tag that was chosen
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._browseSelectionCallback =
function(button, dialog, organizer) {
	var type = button.getData(ZmFilterRuleDialog.BROWSE_TYPE);
	var isFolder = (type == ZmFilterRule.TYPE_FOLDER_PICKER);
	if (organizer) {
		// Bug 24425, don't allow root folder selection
		if (isFolder && organizer.nId == ZmFolder.ID_ROOT) { return; }

		button.setText(AjxStringUtil.htmlEncode(organizer.getName(false, null, true)));
		var value = isFolder
			? organizer.getPath(false, false, null, true, true)
			: organizer.getName(false, null, true);
		button.setData(ZmFilterRuleDialog.DATA, value);
	}
	dialog.popdown();
};

/**
 * If "save to sent" is disabled and we're an outgoing filter and the user chose to active the filter, display a warning with the option to turn the setting on
 *
 * @param {DwtEvent}	ev		the event
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._activeChangeListener =
function(ev) {
	if (this._outgoing) {
		var target = DwtUiEvent.getTarget(ev);
		var active = target.checked;
		var cancelCallback = new AjxCallback(this, function(){target.checked = false;});
		if (active) {
			var outgoingFilterController = ZmPreferencesApp.getFilterRulesController(this._outgoing);
			if (outgoingFilterContrller) {
				outgoingFilterController.handleBeforeFilterChange(null, cancelCallback);
			}
		}
	}
};

/**
 * Attaches input widgets to the DOM tree based on placeholder IDs.
 *
 * @param {String}	rowId	the ID of a single row to add inputs to
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._addDwtObjects =
function(rowId) {
	for (var id in this._inputs) {
		if (rowId && (id != rowId)) { continue; }
		var row = this._inputs[id];
		for (var f in row) {
			var field = row[f];
			var el = (field.id && field.dwtObj) ? field.dwtObj.getHtmlElement() : null;
			if (el) {
				el.parentNode.removeChild(el);
				Dwt.byId(field.id).appendChild(el);
				el._rowId = id;
			}
		}
	}
};

/**
 * Destroys input widgets.
 *
 * @param {String}	rowId		the ID of a single row to clean up
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._removeDwtObjects =
function(rowId) {
	for (var id in this._inputs) {
		if (rowId && (id != rowId)) continue;
		var row = this._inputs[id];
		for (var f in row) {
			var field = row[f];
			if (field.dwtObj)
				field.dwtObj.dispose();
		}
	}
};

ZmFilterRuleDialog.prototype._cancelButtonListener =
function(ev) {
	var filterRulesController = ZmPreferencesApp.getFilterRulesController(this._outgoing);
	if (filterRulesController) {
		//get index before loading rules to keep selection on cancel
		var sel = filterRulesController.getListView() ? filterRulesController.getListView().getSelection()[0] : null;
		var index = sel ? this._rules.getIndexOfRule(sel) : null;
		var callback = new AjxCallback(this, this._handleResponseLoadRules, [index]);
		this._rules.loadRules(true, callback);
	}
	this.popdown();
};

ZmFilterRuleDialog.prototype._handleResponseLoadRules =
function(index) {
	var filterRulesController = ZmPreferencesApp.getFilterRulesController(this._outgoing);
	if (filterRulesController) {
		filterRulesController.resetListView(index);
	}
};

/**
 * Saves the newly created/edited rule.
 *
 * @param {DwtEvent}	ev		the event
 */
ZmFilterRuleDialog.prototype._okButtonListener =
function(ev) {

	var rule = this._rule;
	var msg = null;
	var name = Dwt.byId(this._nameInputId).value;
	name = name.replace (/\s*$/,'');
	name = name.replace (/^\s*/,'');
	if (!name) {
		msg = ZmMsg.filterErrorNoName;
	}

	var rule1 = this._rules.getRuleByName(name);
	if ( rule1 && (rule1 != rule))  {
		msg = ZmMsg.filterErrorNameExists;
	}
	if (msg) {
		var msgDialog = appCtxt.getMsgDialog();
		msgDialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
		msgDialog.popup();
		return;
	}

	var active = Dwt.byId(this._activeCheckboxId).checked;
	var anyAll = this._conditionSelect.getValue();

	// adding a rule always starts with dummy

	if (this._editMode) {
		var cachedRule = {
			name: rule.name,
			active: rule.active,
			conditions: rule.conditions,
			actions: rule.actions
		};

		rule.name = name;
		rule.active = active;
		rule.clearConditions();
		rule.clearActions();
	} else {
		rule = new ZmFilterRule(name, active);
	}
	rule.setGroupOp(anyAll);

	// get input from tables so order is preserved
	var table = Dwt.byId(this._conditionsTableId);
	var rows = table.rows;
	for (var i = 0; i < rows.length; i++) {
		var c = this._getConditionFromRow(rows[i].id);
		if (msg = this._checkCondition(c)) {
			break;
		} else {
			rule.addCondition(c.testType, c.comparator, c.value, c.subjectMod, c.caseSensitive);
		}
	}
	if (!msg) {
		table = Dwt.byId(this._actionsTableId);
		rows = table.rows;
		for (var i = 0; i < rows.length; i++) {
			var action = this._getActionFromRow(rows[i].id);
			if (msg = this._checkAction(action)) {
				break;
			}
			rule.addAction(action.actionType, action.value);
		}
	}

	if (msg) {
		// bug #35912 - restore values from cached rule
		if (cachedRule) {
			rule.name = cachedRule.name;
			rule.active = cachedRule.active;
			rule.conditions = cachedRule.conditions;
			rule.actions = cachedRule.actions;
		}

		var msgDialog = appCtxt.getMsgDialog();
		msgDialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
		msgDialog.popup();
		return;
	}

	var stopAction = Dwt.byId(this._stopCheckboxId).checked;
	if (stopAction) {
		rule.addAction(ZmFilterRule.A_STOP);
	}

	var respCallback = new AjxCallback(this, this._handleResponseOkButtonListener);
	if (this._editMode) {
		this._rules._saveRules(this._rules.getIndexOfRule(rule), true, respCallback);
	} else {
		this._rules.addRule(rule, this._referenceRule, respCallback);
	}
};

ZmFilterRuleDialog.prototype._handleResponseOkButtonListener =
function() {
	this.popdown();
};

/**
 * Creates an Object based on the values of a condition row.
 *
 * @param {String}	rowId	the row ID
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._getConditionFromRow =
function(rowId) {
	var inputs = this._inputs[rowId];

	var subject = inputs.subject.dwtObj.getValue();
	var conf = ZmFilterRule.CONDITIONS[subject];
	var comparator = this._getInputValue(inputs, conf, "ops");
	var value = AjxStringUtil.trim(this._getInputValue(inputs, conf, "value"));
	var subjectMod = this._getInputValue(inputs, conf, "subjectMod");
	var valueMod = this._getInputValue(inputs, conf, "valueMod");
	var testType = ZmFilterRule.C_TEST_MAP[subject];
	var caseSensitive = null;

	if (testType == ZmFilterRule.TEST_HEADER) {
		if (subject == ZmFilterRule.C_HEADER &&
			(comparator == ZmFilterRule.OP_EXISTS ||
			 comparator == ZmFilterRule.OP_NOT_EXISTS))
		{
			testType = ZmFilterRule.TEST_HEADER_EXISTS;
		}
		else {
			if (subject != ZmFilterRule.C_HEADER) {
				subjectMod = ZmFilterRule.C_HEADER_VALUE[subject];
			}
		}
	}
	else if (testType == ZmFilterRule.TEST_ADDRESS && subject) {
		subjectMod = ZmFilterRule.C_ADDRESS_VALUE[subject];
		value += ";" + valueMod;   //addressTest has value=email part=all|domain|localpart
	}
	else if (testType == ZmFilterRule.TEST_SIZE && valueMod && valueMod != "B") {
		value += valueMod;
	}
	// MIME header currently supports ZmMimeTable.MSG_READ_RECEIPT only.
	else if (testType == ZmFilterRule.TEST_MIME_HEADER) {
		subjectMod = "Content-Type";
		value = ZmMimeTable.MSG_READ_RECEIPT;
	}
	else if (testType == ZmFilterRule.TEST_ADDRESS) {
		value += ";" + valueMod;   //addressTest has value=email part=all|domain|localpart
	}
	else if (testType == ZmFilterRule.TEST_CONVERSATIONS && value == ZmFilterRule.IMPORTANCE) {
		value = valueMod;  //importanceTest
	}
		
	if (testType == ZmFilterRule.TEST_HEADER || testType == ZmFilterRule.TEST_MIME_HEADER || testType == ZmFilterRule.TEST_ADDRESS) {
		caseSensitive = inputs["caseSensitive"] ? inputs["caseSensitive"].value : null;	
	}

	return { testType:testType, comparator:comparator, value:value, subjectMod:subjectMod, caseSensitive:caseSensitive, subject: subject };
};

/**
 * Returns an Object based on the values of an action row.
 *
 * @param {String}	rowId	the row ID
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._getActionFromRow =
function(rowId) {
	var inputs = this._inputs[rowId];
	var name = inputs.name.dwtObj.getValue();
	var conf = ZmFilterRule.ACTIONS[name];
	var value = this._getInputValue(inputs, conf, "param");

	return {actionType:name, value:value};
};

/**
 * Retrieves the value of an input based on what type it is. For all but text
 * inputs, we can get it from a DWT object.
 *
 * @param {Object}	inputs		the the inputs for one row
 * @param {Object}	conf		the config info for this row's subject or action name
 * @param {String}	field		the current input field
 * 
 * @private
 */
ZmFilterRuleDialog.prototype._getInputValue =
function(inputs, conf, field) {
	var type = conf[field];
	if (!type) {
		return null;
	}
	if (type == ZmFilterRule.TYPE_INPUT) {
		return inputs[field].dwtObj.getValue();
	}
	if (type == ZmFilterRule.TYPE_SELECT) {
		return inputs[field].dwtObj.getValue();
	}
	if (type == ZmFilterRule.TYPE_CALENDAR) {
		var date = inputs[field].dwtObj.getData(ZmFilterRuleDialog.DATA);
		if (!date) {
			return null;
		}
		return String(date.getTime() / 1000);
	}
	if (type == ZmFilterRule.TYPE_FOLDER_PICKER) {
		return inputs[field].dwtObj.getData(ZmFilterRuleDialog.DATA);
	}
	if (type == ZmFilterRule.TYPE_TAG_PICKER) {
		return inputs[field].dwtObj.getData(ZmFilterRuleDialog.DATA);
	}
};

/**
* Given a row, returns its index in its containing table.
*
* @param row			[element]	a table row (TR)
* @param isCondition	[boolean]	true if the row is a condition row
* 
* @private
*/
ZmFilterRuleDialog.prototype._getIndexForRow =
function(row, isCondition) {
	var table = Dwt.byId(isCondition ? this._conditionsTableId : this._actionsTableId);
	var rows = table.rows;
	for (var i = 0; i < rows.length; i++) {
		if (rows[i] == row) { return i; }
	}

	return null;
};

/**
* Buses tables, hopes to make it big in movies some day.
* 
* @private
*/
ZmFilterRuleDialog.prototype._clearTables =
function() {
	var list = [this._conditionsTableId, this._actionsTableId];
	for (var i = 0; i < list.length; i++) {
		var table = Dwt.byId(list[i]);
		var tbody = table.tBodies[0];
		while (tbody.firstChild != null) {
			this._removeDwtObjects(tbody.firstChild.id);
			tbody.removeChild(tbody.firstChild);
		}
	}
};

/**
* Returns false if the condition has the necessary parts, an error message otherwise.
*
* @param condition	[Object]	condition
* 
* @private
*/
ZmFilterRuleDialog.prototype._checkCondition =
function(condition) {
	var conf = ZmFilterRule.CONDITIONS[condition.subject];
	for (var f in conf) {
		var key = ZmFilterRule.CONDITIONS_KEY[f];
		if (!key) { continue; }
		if ((key == "value") && (condition.subject == ZmFilterRule.C_HEADER) &&
			(condition.comparator == ZmFilterRule.OP_EXISTS || condition.comparator == ZmFilterRule.OP_NOT_EXISTS)) {
			continue; // "Header Named" with "exists" doesn't take a value
		}
		if (conf[f] && !condition[key]) {
			return this._conditionErrorFormatter.format([ZmFilterRule.C_LABEL[condition.subject]]);
		}
	}
};

/**
* Returns true if the action has the necessary parts, an error message otherwise.
*
* @param action	[Object]	action
*/
ZmFilterRuleDialog.prototype._checkAction =
function(action) {
	var conf = ZmFilterRule.ACTIONS[action.actionType];
	if (conf.param && !action.value) {
		return this._actionErrorFormatter.format([ZmFilterRule.A_LABEL[action.actionType]]);
	}
	if (conf.validationFunction && !conf.validationFunction(action.value)) {
		return conf.errorMessage;
	}
};

ZmFilterRuleDialog.prototype.isEditMode =
function() {
	return this._editMode;
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmZimletsPage")) {
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
 * Creates a Zimlets preference page.
 * @constructor
 * @class ZmZimletsPage
 * This class represents a page that allows the user to enable/disable available
 * zimlets. User can see all the simlets those are enabled by admin for his account.
 * Out of these available zimlets user can choose some or all for his account.
 *
 * @author Rajendra Patil
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends		ZmPreferencesPage
 * @private
 */
ZmZimletsPage = function(parent, section, controller) {
	ZmPreferencesPage.call(this, parent, section, controller);
};

ZmZimletsPage.prototype = new ZmPreferencesPage;
ZmZimletsPage.prototype.constructor = ZmZimletsPage;

// CONSTS
ZmZimletsPage.ADMIN_URI = [
	"http://",
	location.hostname, ":",
	location.port,
	"/service/admin/soap/"
].join("");

ZmZimletsPage.ADMIN_UPLOAD_URI = [
	"http://",
	location.hostname, ":",
	location.port,
	"/service/upload"
].join("");

ZmZimletsPage.ADMIN_COOKIE_NAME				= "ZM_ADMIN_AUTH_TOKEN";
ZmZimletsPage.ZIMLET_UPLOAD_STATUS_PENDING	= "pending";
ZmZimletsPage.ZIMLET_UPLOAD_STATUS_SUCCESS	= "succeeded";
ZmZimletsPage.ZIMLET_UPLOAD_STATUS_FAIL		= "failed";
ZmZimletsPage.ZIMLET_MAX_CHECK_STATUS		= 8;

ZmZimletsPage.prototype.toString =
function () {
	return "ZmZimletsPage";
};

ZmZimletsPage.prototype.reset =
function(){
	var arr = this.getZimletsArray();
	for (var i = 0; i < arr.length; i++) {
		arr[i].restoreStatus();
	}
	this.showMe();
};

ZmZimletsPage.prototype.showMe =
function(deferred){
	ZmPreferencesPage.prototype.showMe.call(this);
	var zimlets = this.getZimlets();
	if (zimlets.size() === 0) {
		this._zimlets = null; //otherwise it would stay cached and would not update when this method is calledback.
		if (!deferred) {
			appCtxt.getAppController().addListener(ZmAppEvent.POST_STARTUP, new AjxListener(this, this.showMe, [true]));
		}
		return;
	}
	if (this._listView) {
		var s = this._listView.getSelection();
		this._listView.set(zimlets.clone());
		if (s && s[0]) {
			this._listView.setSelection(s[0]);
		}
	}
};

ZmZimletsPage.prototype._getTemplateData =
function() {
	var data = ZmPreferencesPage.prototype._getTemplateData.apply(this, arguments);
	if (appCtxt.isOffline) {
		data.action = ZmZimletsPage.ADMIN_UPLOAD_URI;
	}
	return data;
};

/**
 * @private
 */
ZmZimletsPage.prototype._setupCustom =
function(id, setup, value) {
	if (id == ZmSetting.CHECKED_ZIMLETS) {
		this._listView = new ZmPrefZimletListView(this, this._controller);
		return this._listView;
	}

	return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

ZmZimletsPage.prototype._createControls =
function() {
	if (appCtxt.isOffline) {
		// add "upload" button
		this._uploadButton = new DwtButton({parent:this, parentElement: this._htmlElId+"_button"});
		this._uploadButton.setText(ZmMsg.uploadNewFile);
		this._uploadButton.addSelectionListener(new AjxListener(this, this._fileUploadListener));
	}

	ZmPreferencesPage.prototype._createControls.apply(this, arguments);
};

ZmZimletsPage.prototype._fileUploadListener =
function() {
	this._uploadButton.setEnabled(false);

	// first, fetch the admin auth token if none exists
	var callback = new AjxCallback(this, this._uploadZimlet);
	this._getAdminAuth(callback);
};

ZmZimletsPage.prototype._uploadZimlet =
function() {
	this._checkStatusCount = 0;

	var callback = new AjxCallback(this, this._handleZimletUpload);
	var formEl = document.getElementById(this._htmlElId + "_form");
	var um = window._uploadManager = appCtxt.getUploadManager();
	um.execute(callback, formEl);
};

ZmZimletsPage.prototype._handleZimletUpload =
function(status, aid) {
	if (status == 200) {
		this._deployZimlet(aid);
	}
	else {
		var msg = (status == AjxPost.SC_NO_CONTENT)
			? ZmMsg.zimletUploadError
			: (AjxMessageFormat.format(ZmMsg.zimletUploadStatus, status));
        appCtxt.setStatusMsg(msg, ZmStatusView.LEVEL_CRITICAL);

		this._uploadButton.setEnabled(true);
	}
};

ZmZimletsPage.prototype._getAdminAuth =
function(callback) {
	// first, make sure we have a valid admin password (parsed from location)
	var pword;
	var searches = document.location.search.split("&");
	for (var i = 0; i < searches.length; i++) {
		var idx = searches[i].indexOf("at=");
		if (idx != -1) {
			pword = searches[i].substring(idx+3);
			break;
		}
	}

	// for dev build
	if (!pword) {
		pword = "@install.key@";
	}

	var soapDoc = AjxSoapDoc.create("AuthRequest", "urn:zimbraAdmin");
	soapDoc.set("name", "zimbra");
	soapDoc.set("password", pword);

	var params = {
		soapDoc: soapDoc,
		noSession: true,
		asyncMode: true,
		noAuthToken: true,
		skipAuthCheck: true,
		serverUri: ZmZimletsPage.ADMIN_URI,
		callback: (new AjxCallback(this, this._handleResponseAuthenticate, [callback]))
	};
	(new ZmCsfeCommand()).invoke(params);
};

ZmZimletsPage.prototype._handleResponseAuthenticate =
function(callback, result) {
	if (result.isException()) {
		this._handleZimletDeployError();
		return;
	}

	// set the admin auth cookie (expires when browser closes)
	this._adminAuthToken = result.getResponse().Body.AuthResponse.authToken[0]._content;
	AjxCookie.setCookie(document, ZmZimletsPage.ADMIN_COOKIE_NAME, this._adminAuthToken, null, "/service/upload");

	if (callback) {
		callback.run();
	}
};

ZmZimletsPage.prototype._deployZimlet =
function(aid, action) {
	var dialog = appCtxt.getCancelMsgDialog();
	dialog.reset();
	dialog.setMessage(ZmMsg.zimletDeploying, DwtMessageDialog.INFO_STYLE);
	dialog.registerCallback(DwtDialog.CANCEL_BUTTON, new AjxCallback(this, this._handleZimletCancel, [dialog]));
	dialog.popup();

	var soapDoc = AjxSoapDoc.create("DeployZimletRequest", "urn:zimbraAdmin");
	var method = soapDoc.getMethod();
	method.setAttribute("action", (action || "deployLocal"));
	method.setAttribute("flush", "1");
	method.setAttribute("synchronous", "1");
	var content = soapDoc.set("content");
	content.setAttribute("aid", aid);

	var params = {
		soapDoc: soapDoc,
		asyncMode: true,
		skipAuthCheck: true,
		callback: (new AjxCallback(this, this._deployZimletResponse, [dialog, aid])),
		serverUri: ZmZimletsPage.ADMIN_URI,
		authToken: this._adminAuthToken
	};

	(new ZmCsfeCommand()).invoke(params);
};

ZmZimletsPage.prototype._deployZimletResponse =
function(dialog, aid, result) {
    
    // remove Admin auth key
     AjxCookie.deleteCookie(document, ZmZimletsPage.ADMIN_COOKIE_NAME, "/service/upload");

	if (result.isException()) {
		dialog.popdown();
		this._uploadButton.setEnabled(true);

		this._controller.popupErrorDialog(ZmMsg.zimletDeployError, result.getException());
		return;
	}

	var status = result.getResponse().Body.DeployZimletResponse.progress[0].status;
	if (status == ZmZimletsPage.ZIMLET_UPLOAD_STATUS_PENDING) {
		if (this._checkStatusCount++ > ZmZimletsPage.ZIMLET_MAX_CHECK_STATUS) {
			this._handleZimletDeployError();
		} else {
			AjxTimedAction.scheduleAction(new AjxTimedAction(this, this._deployZimlet, [aid, "status"]), 1500);
		}
	} else {
		dialog.popdown();

		if (status == ZmZimletsPage.ZIMLET_UPLOAD_STATUS_FAIL) {
			this._handleZimletDeployError();
		}
		else {
			this._uploadButton.setEnabled(true);

			var settings = appCtxt.getSettings(appCtxt.accountList.mainAccount);
			settings._showConfirmDialog(ZmMsg.zimletDeploySuccess, settings._refreshBrowserCallback.bind(settings), DwtMessageDialog.INFO_STYLE);
		}
	}
};

ZmZimletsPage.prototype._handleZimletDeployError =
function() {
	this._uploadButton.setEnabled(true);

	var dialog = appCtxt.getMsgDialog();
	dialog.setMessage(ZmMsg.zimletDeployError, DwtMessageDialog.CRITICAL_STYLE);
	dialog.popup();
};

ZmZimletsPage.prototype._handleZimletCancel =
function(dialog) {
	dialog.popdown();
	this._uploadButton.setEnabled(true);
};

ZmZimletsPage.prototype.undeployZimlet =
function(zimletName) {
	var callback = new AjxCallback(this, this._handleUndeployZimlet, [zimletName]);
	this._getAdminAuth(callback);
};

ZmZimletsPage.prototype._handleUndeployZimlet =
function(zimletName) {
	var soapDoc = AjxSoapDoc.create("UndeployZimletRequest", "urn:zimbraAdmin");
	soapDoc.getMethod().setAttribute("name", zimletName);

	var params = {
		soapDoc: soapDoc,
		asyncMode: true,
		skipAuthCheck: true,
		callback: (new AjxCallback(this, this._undeployZimletResponse, [zimletName])),
		serverUri: ZmZimletsPage.ADMIN_URI,
		authToken: this._adminAuthToken
	};

	(new ZmCsfeCommand()).invoke(params);
};

ZmZimletsPage.prototype._undeployZimletResponse =
function(zimletName, result) {

    // remove admin auth key
    AjxCookie.deleteCookie(document, ZmZimletsPage.ADMIN_COOKIE_NAME, "/service/upload");
    
	if (result.isException()) {
		this._controller.popupErrorDialog(ZmMsg.zimletUndeployError, result.getException());
		return;
	}

	// remove the uninstalled zimlet from the listview
    var zimletsCtxt = this.getZimletsCtxt();
	var zimlet = zimletsCtxt.getPrefZimletByName(zimletName);
	if (zimlet) {
		zimletsCtxt.removePrefZimlet(zimlet);
		this._listView.set(zimletsCtxt.getZimlets().clone());
	}

	// prompt user to restart client
	var settings = appCtxt.getSettings(appCtxt.accountList.mainAccount);
	settings._showConfirmDialog(ZmMsg.zimletUndeploySuccess, settings._refreshBrowserCallback.bind(settings), DwtMessageDialog.INFO_STYLE);
};

ZmZimletsPage.prototype.addCommand  =
function(batchCommand) {
	var soapDoc = AjxSoapDoc.create("ModifyZimletPrefsRequest", "urn:zimbraAccount");
	// LDAP supports multi-valued attrs, so don't serialize list
	var zimlets = this.getZimletsArray();
	var settingsObj = appCtxt.getSettings();
	var setting = settingsObj.getSetting(ZmSetting.CHECKED_ZIMLETS);
	var checked = [];
	for (var i = 0; i < zimlets.length; i++) {
		if (zimlets[i].active) {
			checked.push(zimlets[i].name);
		}
		var node = soapDoc.set("zimlet", null);
		node.setAttribute("name", zimlets[i].name);
		node.setAttribute("presence", (zimlets[i].active ? "enabled" : "disabled"));
	}
	setting.setValue(checked);
	batchCommand.addNewRequestParams(soapDoc);
};

ZmZimletsPage.prototype._reloadZimlets =
function() {
	// reset all zimlets origStatus
	var zimlets = this.getZimletsArray();
	for (var i = 0; i < zimlets.length; i++) {
		zimlets[i].resetStatus();
	}
};

ZmZimletsPage.prototype.getPostSaveCallback =
function() {
	return new AjxCallback(this, this._postSave);
};
ZmZimletsPage.prototype._postSave =
function() {
	if (!this.isDirty()) { return; }

	this._reloadZimlets();

	var settings = appCtxt.getSettings();
	settings._showConfirmDialog(ZmMsg.zimletChangeRestart, settings._refreshBrowserCallback.bind(settings));
};

ZmZimletsPage.prototype._isChecked =
function(name) {
	var z = this.getZimletsCtxt().getPrefZimletByName(name);
	return (z && z.active);
};

ZmZimletsPage.prototype.isDirty =
function() {
	var dirty = false;
	var arr = this.getZimletsArray();
	var dirtyZimlets = [];

	var printZimlet = function(zimlet) {
		if (AjxUtil.isArray(zimlet)) {
			return AjxUtil.map(zimlet, printZimlet).join("\n");
		}
		return [zimlet.name," (from ",zimlet._origStatus," to ",zimlet.active,")"].join("");
	}

	for (var i = 0; i < arr.length; i++) {
		if (arr[i]._origStatus != arr[i].active) {
			dirty = true;
			dirtyZimlets.push(arr[i]);
		}
	}

	if (dirty) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\n" + "Dirty zimlets:\n" + printZimlet(dirtyZimlets));
	}
	return dirty;
};

/**
 * Gets the zimlet preferences.
 * 
 * @return	{ZmPrefZimlets}	the zimlets
 * 
 * @private
 */
ZmZimletsPage.prototype.getZimletsCtxt =
function() {
	if (!this._zimlets) {
		this._zimlets = ZmZimletsPage._getZimlets();
	}
	return this._zimlets;
};

ZmZimletsPage.prototype.getZimlets =
function() {
	return this.getZimletsCtxt().getZimlets();
};

ZmZimletsPage.prototype.getZimletsArray =
function() {
	return this.getZimlets().getArray();
};


ZmZimletsPage._getZimlets =
function() {
	var allz = appCtxt.get(ZmSetting.ZIMLETS) || [];
	var zimlets = new ZmPrefZimlets();
    var zimletsLoaded = appCtxt.getZimletMgr().isLoaded();
	for (var i = 0; i <  allz.length; i++) {
		var name = allz[i].zimlet[0].name;
		if (allz[i].zimletContext[0].presence == "mandatory" || allz[i].zimlet[0].zimbraXZimletCompatibleSemVer) {
			continue; // skip mandatory zimlets and modern zimlets to be shown in prefs
		}
		var desc = allz[i].zimlet[0].description;
		var label = allz[i].zimlet[0].label || name.replace(/^.*_/,"");
        if (zimletsLoaded) {
            desc = ZmZimletContext.processMessage(name, desc);
            label = ZmZimletContext.processMessage(name, label);
        }
		var isEnabled = allz[i].zimletContext[0].presence == "enabled";
		zimlets.addPrefZimlet(new ZmPrefZimlet(name, isEnabled, desc, label));
	}
	zimlets.sortByName();
	return zimlets;
};

/**
 * ZmPrefZimletListView
 *
 * @param parent
 * @param controller
 * @private
 */
ZmPrefZimletListView = function(parent, controller) {
	DwtListView.call(this, {
		parent: parent,
		className: "ZmPrefZimletListView",
		headerList: this._getHeaderList(),
        id: "ZmPrefZimletListView",
		view: ZmId.VIEW_PREF_ZIMLETS
	});

	this._controller = controller;
	this.setMultiSelect(false); // single selection only
	this._internalId = AjxCore.assignId(this);
};

ZmPrefZimletListView.COL_ACTIVE	= "ac";
ZmPrefZimletListView.COL_NAME	= "na";
ZmPrefZimletListView.COL_DESC	= "ds";
ZmPrefZimletListView.COL_ACTION	= "an";

ZmPrefZimletListView.prototype = new DwtListView;
ZmPrefZimletListView.prototype.constructor = ZmPrefZimletListView;

ZmPrefZimletListView.prototype.toString =
function() {
	return "ZmPrefZimletListView";
};

/**                                                                        
 * Only show zimlets that have at least one valid action (eg, if the only action
 * is "tag" and tagging is disabled, don't show the rule).
 */
ZmPrefZimletListView.prototype.set =
function(list) {
	this._checkboxIds = [];
    this._zimletsLoaded = appCtxt.getZimletMgr().isLoaded();
	DwtListView.prototype.set.call(this, list);
    if (!this._zimletsLoaded) {
        appCtxt.addZimletsLoadedListener(new AjxListener(this, this._handleZimletsLoaded));
    }
};

ZmPrefZimletListView.prototype._handleZimletsLoaded = function(evt) {
    this._zimletsLoaded = true;
    var array = this.parent.getZimletsArray();
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        var label = item.label || item.name.replace(/^.*_/,"");
        item.label = ZmZimletContext.processMessage(item.name, label);
        item.desc = ZmZimletContext.processMessage(item.name, item.desc);
        this.setCellContents(item, ZmPrefZimletListView.COL_NAME, AjxStringUtil.htmlEncode(item.label));
        this.setCellContents(item, ZmPrefZimletListView.COL_DESC, AjxStringUtil.htmlEncode(item.desc));
    }
};

ZmPrefZimletListView.prototype._getRowId =
function(item, params) {
    if (item) {
        var rowIndex = this._list && this._list.indexOf(item);
        if (rowIndex && rowIndex != -1)
            return "ZmPrefZimletListView_row_" + rowIndex;
    }

    return null;
};


ZmPrefZimletListView.prototype.setCellContents = function(item, field, html) {
	var el = this.getCellElement(item, field);
	if (!el) { return; }
	el.innerHTML = html;
};

ZmPrefZimletListView.prototype.getCellElement = function(item, field) {
	return document.getElementById(this._getCellId(item, field));
};

ZmPrefZimletListView.prototype._getCellId = function(item, field, params) {
	return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_CELL, "zimlets", item.name, field);
};

ZmPrefZimletListView.prototype._getHeaderList =
function() {
	var hlist = [
		(new DwtListHeaderItem({field:ZmPrefZimletListView.COL_ACTIVE, text:ZmMsg.activeInZimletsListHeader, width:ZmMsg.COLUMN_WIDTH_ACTIVE})),
        (new DwtListHeaderItem({field:ZmPrefZimletListView.COL_NAME, text:ZmMsg.name, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV})),    
		(new DwtListHeaderItem({field:ZmPrefZimletListView.COL_DESC, text:ZmMsg.description}))
	];

	if (appCtxt.isOffline) {
		hlist.push(new DwtListHeaderItem({field:ZmPrefZimletListView.COL_ACTION, text:ZmMsg.action, width:ZmMsg.COLUMN_WIDTH_FOLDER_DLV}));
	}

	return hlist;
};

ZmPrefZimletListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {
	if (field == ZmPrefZimletListView.COL_ACTIVE) {
		html[idx++] = "<input name='checked_zimlets' type='checkbox' ";
		html[idx++] = item.active ? "checked " : "";
		html[idx++] = "id='";
		html[idx++] = item.name;
		html[idx++] = "_zimletCheckbox' _name='";
		html[idx++] = item.name;
		html[idx++] = "' _flvId='";
		html[idx++] = this._internalId;
		html[idx++] = "' onchange='ZmPrefZimletListView._activeStateChange'>";
	}
	else if (field == ZmPrefZimletListView.COL_DESC) {
        var desc = this._zimletsLoaded ? item.desc : ZmMsg.loading;
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefZimletListView.COL_DESC);
        html[idx++] = "'>";
		html[idx++] = AjxStringUtil.stripTags(desc, true);
        html[idx++] = "</div>";
	}
	else if (field == ZmPrefZimletListView.COL_NAME) {
        html[idx++] = "<div id='";
        html[idx++] = this._getCellId(item, ZmPrefZimletListView.COL_NAME);
        html[idx++] = "' title='";
        html[idx++] = item.name;
        html[idx++] = "'>";
		html[idx++] = AjxStringUtil.stripTags(item.getNameWithoutPrefix(!this._zimletsLoaded), true);
        html[idx++] = "</div>";
	}
	else if (field == ZmPrefZimletListView.COL_ACTION) {
		html[idx++] = "<a href='javascript:;' onclick='ZmPrefZimletListView.undeployZimlet(";
		html[idx++] = '"' + item.name + '"';
		html[idx++] = ");'>";
		html[idx++] = ZmMsg.uninstall;
		html[idx++] = "</a>";
	}

	return idx;
};

ZmPrefZimletListView.undeployZimlet =
function(zimletName) {
	appCtxt.getCurrentView().prefView["PREF_ZIMLETS"].undeployZimlet(zimletName);
};

/**
* Handles click of 'active' checkbox by toggling the rule's active state.
*
* @param ev			[DwtEvent]	click event
*/
ZmPrefZimletListView._activeStateChange =
function(ev) {
	var target = DwtUiEvent.getTarget(ev);
	var flvId = target.getAttribute("_flvId");
	var flv = AjxCore.objectWithId(flvId);
	var name = target.getAttribute("_name");
	var z = flv.parent.getZimletsCtxt().getPrefZimletByName(name);
	if (z) {
		z.active = !z.active;
	}
};

/**
* Override so that we don't change selection when the 'active' checkbox is clicked.
* Also contains a hack for IE for handling a click of the 'active' checkbox, because
* the ONCHANGE handler was only getting invoked on every other checkbox click for IE.
*
* @param clickedEl	[Element]	list DIV that received the click
* @param ev			[DwtEvent]	click event
* @param button		[constant]	button that was clicked
*/
ZmPrefZimletListView.prototype._allowLeftSelection =
function(clickedEl, ev, button) {
	var target = DwtUiEvent.getTarget(ev);
	var isInput = (target.id.indexOf("_zimletCheckbox") > 0);
	if (isInput) {
		ZmPrefZimletListView._activeStateChange(ev);
	}

	return !isInput;
};

/**
 * Model class to hold the list of PrefZimlets
 * @private
 */
ZmPrefZimlets = function() {
   ZmModel.call(this, ZmEvent.S_PREF_ZIMLET);
   this._vector = new AjxVector();
   this._zNameHash = {};
};

ZmPrefZimlets.prototype = new ZmModel;
ZmPrefZimlets.prototype.constructor = ZmPrefZimlets;

ZmPrefZimlets.prototype.toString =
function() {
	return "ZmPrefZimlets";
};

ZmPrefZimlets.prototype.getZimlets =
function() {
	return this._vector;
};

ZmPrefZimlets.prototype.addPrefZimlet =
function(zimlet) {
	this._vector.add(zimlet);
	this._zNameHash[zimlet.name] = zimlet;
};

ZmPrefZimlets.prototype.removePrefZimlet =
function(zimlet) {
	delete this._zNameHash[zimlet.name];
	this._vector.remove(zimlet);
};

ZmPrefZimlets.prototype.getPrefZimletByName =
function(name) {
   return this._zNameHash[name];
};

/**
 *
 * @param desc true for desc sorting, false or empty otherwise
 */
ZmPrefZimlets.prototype.sortByName =
function(desc) {
	var r = 0;
    var zimletsLoaded = appCtxt.getZimletMgr().isLoaded();
	this._vector.sort(function(a,b) {
		var aname = a.getNameWithoutPrefix(!zimletsLoaded).toLowerCase();
		var bname = b.getNameWithoutPrefix(!zimletsLoaded).toLowerCase();

		if (aname == bname) {
			r = 0;
		} else if (aname > bname) {
			r = 1;
		} else {
			r = -1;
		}
		return (desc ? -r : r);
	});
};

/**
 * ZmPrefZimlet
 *
 * @param name
 * @param active
 * @param desc
 *
 * @private
 */
ZmPrefZimlet = function(name, active, desc, label) {
	this.name = name;
	this.active = (active !== false);
	this.desc = desc;
	this.label = label;
	this._origStatus = this.active;
};

ZmPrefZimlet.prototype.getNameWithoutPrefix	=
function(noLabel) {
	if (!noLabel && this.label != null && this.label.length > 0) {
		return	this.label;
	}

	return this.name.substring(this.name.lastIndexOf("_")+1);
};

ZmPrefZimlet.prototype.resetStatus =
function() {
	this._origStatus = this.active;
};

ZmPrefZimlet.prototype.restoreStatus =
function() {
	this.active = this._origStatus;
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmMobileDevicesPage")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the mobile devices page.
 * @class
 * This class represents the mobile devices page.
 * 
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends	ZmPreferencesPage
 * 
 * @private
 */
ZmMobileDevicesPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);

	this._deviceController = controller.getMobileDevicesController();
};

ZmMobileDevicesPage.prototype = new ZmPreferencesPage;
ZmMobileDevicesPage.prototype.constructor = ZmMobileDevicesPage;

ZmMobileDevicesPage.prototype.toString =
function () {
    return "ZmMobileDevicesPage";
};


// ZmPreferencesPage methods

/**
 * @private
 */
ZmMobileDevicesPage.prototype.showMe =
function() {
	ZmPreferencesPage.prototype.showMe.apply(this, arguments);

	if (!this._rendered) {
		var params = {
			parent:this,
			buttons:this._deviceController.getToolbarButtons(),
			posStyle:Dwt.STATIC_STYLE,
			context:ZmId.VIEW_MOBILE_DEVICES,
			parentElement:(this._htmlElId+"_deviceToolbar")
		};
		this._toolbar = new ZmButtonToolBar(params);
		params = {
			parent:this,
			parentElement:(this._htmlElId+"_deviceList")
		};
		this.listView = new ZmMobileDeviceListView(params);
		this.listView.setMultiSelect(false);

		this._deviceController.initialize(this._toolbar, this.listView);

        var params1 = {
            parent: this,
            parentElement: (this._htmlElId + "_oauthconsumerapps"),
            type: ZmMobileDevice.TYPE_OAUTH
        };
        this.oAuthAppsListView = new ZmMobileDeviceListView(params1);
        this._deviceController.initializeOAuthAppListView(this.oAuthAppsListView);

        var pageId = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController().getPrefsView().getView("MOBILE").getHTMLElId();
        this._addListView(this.oAuthAppsListView, pageId + "_oauthconsumerapps");
        this._mobileConfiguration(pageId+"_mobileConfig");
        this._rendered = true;
	}
	this._deviceController.loadDeviceInfo();
    this._deviceController.loadOAuthConsumerAppInfo();
};

ZmMobileDevicesPage.prototype.reset = function(useDefaults) {
    var deviceController = this._deviceController;
    ZmPreferencesPage.prototype.reset.apply(this, arguments);

    if (this._controller.getTabView().getActiveView() == this) {
        deviceController.loadDeviceInfo();
        deviceController.loadOAuthConsumerAppInfo();
    }
};

ZmMobileDevicesPage.prototype.hasResetButton =
function() {
	return false;
};

ZmMobileDevicesPage.prototype._addListView = function(listView, listViewDivId) {
        var listDiv = document.getElementById(listViewDivId);
        listDiv.appendChild(listView.getHtmlElement());
        listView.setUI(null, true);
        listView._initialized = true;
};


/**
 * Creates a mobile device list.
 * @class
 * A list view that displays user mobile devices. The data is in the form of a
 * list of {@link ZmMobileDevice} objects.
 *
 * @param {Hash}	params	a hash of parameters
 * 
 * 
 * @extends		DwtListView
 * 
 * @private
 */
ZmMobileDeviceListView = function(params) {
    this.type = params.type;
	params.headerList = this._getHeaderList();
	DwtListView.call(this, params);
};

ZmMobileDeviceListView.prototype = new DwtListView;
ZmMobileDeviceListView.prototype.constructor = ZmMobileDeviceListView;


// Consts

ZmMobileDevicesPage.ALL                 = "all";
ZmMobileDevicesPage.DAV                 = "dav";
ZmMobileDevicesPage.CALDAV              = "caldav";
ZmMobileDevicesPage.CARDDAV             = "carddav";
ZmMobileDevicesPage.IMAP                = "imap";
ZmMobileDevicesPage.ID_DOWNLOAD_CONFIG  = "downloadButton";
ZmMobileDevicesPage.ID_CONFIG_TYPE      = "configType";

ZmMobileDeviceListView.F_DEVICE         = "de";
ZmMobileDeviceListView.F_STATUS         = "st";
ZmMobileDeviceListView.F_ID             = "id";
ZmMobileDeviceListView.F_PROTOCOL       = "pr";
ZmMobileDeviceListView.F_PROVISIONABLE  = "pv";

ZmMobileDeviceListView.F_APP            = "ap";
ZmMobileDeviceListView.F_APPDEVICE      = "ad";
ZmMobileDeviceListView.F_APPROVED       = "ar";
ZmMobileDeviceListView.F_ACTIONS        = "ac";


// Public methods

ZmMobileDeviceListView.prototype.toString =
function() {
	return "ZmMobileDeviceListView";
};

ZmMobileDevicesPage.prototype._downloadUrl = 
function() {

    var portPrefix = (location.port == "" || location.port == "80")
			? ""
            : (":" + location.port);
    var username = appCtxt.multiAccounts ? (AjxStringUtil.urlComponentEncode(appCtxt.get(ZmSetting.USERNAME))) : "~";
    var uri=[
        location.protocol, "//", location.hostname, portPrefix, "/service/home/",
        username, "/", "?fmt=mobileconfig&configType="
    ].join("");
    return uri;
};

ZmMobileDevicesPage.prototype._onClick = 
function(id) {

    var downloadType = "";
    if(id === ZmMobileDevicesPage.ID_DOWNLOAD_CONFIG) {
        var configType = this.getValue(ZmMobileDevicesPage.ID_CONFIG_TYPE);
        switch(configType) {
        case ZmMobileDevicesPage.DAV:
            downloadType = "dav";
            break;
        case ZmMobileDevicesPage.CALDAV:
            downloadType = "caldav";
            break;
        case ZmMobileDevicesPage.CARDDAV:
            downloadType = "carddav";
            break;
        case ZmMobileDevicesPage.IMAP:
            downloadType = "imap";
            break;
        default:
            downloadType = "all"
        }
        var link = this.parent._downloadUrl().concat(downloadType);
        window.open(link,"_parent");
    }
};

ZmMobileDevicesPage.prototype._mobileConfiguration = 
function(configDivId) {

    var params = {};
    var options = [
        { id: ZmMobileDevicesPage.ALL, value: ZmMobileDevicesPage.ALL, label: ZmMsg.mobileConfigurationAll },
        { id: ZmMobileDevicesPage.DAV, value: ZmMobileDevicesPage.DAV, label: ZmMsg.mobileConfigurationDav },
        { id: ZmMobileDevicesPage.CALDAV, value: ZmMobileDevicesPage.CALDAV, label: ZmMsg.mobileConfigurationCaldav },
        { id: ZmMobileDevicesPage.CARDDAV, value: ZmMobileDevicesPage.CARDDAV, label: ZmMsg.mobileConfigurationCarddav },
        { id: ZmMobileDevicesPage.IMAP, value: ZmMobileDevicesPage.IMAP, label: ZmMsg.mobileConfigurationImap }
    ];
    params.parent = this;
    params.template = "prefs.Pages#MobileConfig"
    params.form = {
        items: [
            { id: ZmMobileDevicesPage.ID_CONFIG_TYPE, type: "DwtSelect", items: options},
            { id: ZmMobileDevicesPage.ID_DOWNLOAD_CONFIG, type: "DwtButton", label: ZmMsg.mobileConFigurationDownloadLabel, onclick: this._onClick }
        ]
    };
    this._mobileConfig = new DwtForm(params);
    var mobileConfigDiv = document.getElementById(configDivId);
    mobileConfigDiv.appendChild(this._mobileConfig.getHtmlElement());
}

ZmMobileDeviceListView.prototype._getHeaderList =
function() {

	var headerList = [];
    if (this.type === ZmMobileDevice.TYPE_OAUTH) {
        headerList.push(new DwtListHeaderItem({field:ZmMobileDeviceListView.F_APP, text:ZmMsg.oAuthApp, width:ZmMsg.COLUMN_WIDTH_ID_MDL}));
        headerList.push(new DwtListHeaderItem({field:ZmMobileDeviceListView.F_APPDEVICE, text:ZmMsg.oAuthAppDevice, width:ZmMsg.COLUMN_WIDTH_ID_MDL}));
        headerList.push(new DwtListHeaderItem({field:ZmMobileDeviceListView.F_APPROVED, text:ZmMsg.oAuthAppApprovedDate, width:ZmMsg.COLUMN_WIDTH_STATUS_MDL}));
        headerList.push(new DwtListHeaderItem({field:ZmMobileDeviceListView.F_ACTIONS, width:ZmMsg.COLUMN_WIDTH_PROTOCOL_MDL}));
    }
    else {
        headerList.push(new DwtListHeaderItem({field: ZmMobileDeviceListView.F_DEVICE, text: ZmMsg.mobileDevice}));
        headerList.push(new DwtListHeaderItem({field: ZmMobileDeviceListView.F_ID, text: ZmMsg.mobileDeviceId, width: ZmMsg.COLUMN_WIDTH_ID_MDL}));
        headerList.push(new DwtListHeaderItem({field: ZmMobileDeviceListView.F_STATUS, text: ZmMsg.status, width: ZmMsg.COLUMN_WIDTH_STATUS_MDL}));
        headerList.push(new DwtListHeaderItem({field: ZmMobileDeviceListView.F_PROTOCOL, text: ZmMsg.mobileProtocolVersion, width: ZmMsg.COLUMN_WIDTH_PROTOCOL_MDL}));
        headerList.push(new DwtListHeaderItem({field: ZmMobileDeviceListView.F_PROVISIONABLE, text: ZmMsg.mobileProvisionable, width: ZmMsg.COLUMN_WIDTH_PROVISIONABLE_MDL}));
    }
    return headerList;
};

ZmMobileDeviceListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {

        if (field == ZmMobileDeviceListView.F_DEVICE) {
            html[idx++] = '<span style="white-space:nowrap">';
            html[idx++] = item.type;
            if (item.ua) {
                html[idx++] = " (";
                html[idx++] = item.ua;
                html[idx++] = ")";
            }
            html[idx++] = "</span>";
        } else if (field == ZmMobileDeviceListView.F_STATUS) {
            html[idx++] = item.getStatusString();
        } else if (field == ZmMobileDeviceListView.F_ID) {
            html[idx++] = item.id;
        } else if (field == ZmMobileDeviceListView.F_PROTOCOL) {
            html[idx++] = item.protocol;
        } else if (field == ZmMobileDeviceListView.F_PROVISIONABLE) {
            html[idx++] = item.provisionable ? AjxMsg.yes : AjxMsg.no;
        } else if (field == ZmMobileDeviceListView.F_APP) {
            html[idx++] = item.appName;
        } else if (field == ZmMobileDeviceListView.F_APPDEVICE) {
            html[idx++] = item.device;
        } else if (field == ZmMobileDeviceListView.F_APPROVED) {
            var approvedOn = item.approvedOn;
            html[idx++] = AjxDateFormat.getDateInstance(AjxDateFormat.MEDIUM).format(new Date(parseInt(approvedOn)));
        } else if (field == ZmMobileDeviceListView.F_ACTIONS) {
            html[idx++] = "<a href = 'javascript:;' onclick = 'ZmMobileDevicesController.handleRemoveOauthConsumerApp(this, " + '"' + item.accessToken + '", "' + item.appName + '", "' + item.device + '" ' + " );'>" + ZmMsg.remove + "</a> ";
        }

    return idx;
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmPriorityMessageFilterDialog")) {
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

ZmPriorityMessageFilterDialog = function() {

	DwtDialog.call(this, {parent:appCtxt.getShell(), className:"ZmPriorityMessageFilterDialog", title:ZmMsg.activityStream});

	// set content
	this.setContent(this._contentHtml());
	this._initialize();
	var okButton = this.getButton(DwtDialog.OK_BUTTON);
	okButton.setText(ZmMsg.save);
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
	this._rules = AjxDispatcher.run("GetFilterRules");
};

ZmPriorityMessageFilterDialog.prototype = new DwtDialog;
ZmPriorityMessageFilterDialog.prototype.constructor = ZmPriorityMessageFilterDialog;

ZmPriorityMessageFilterDialog.prototype._contentHtml = 
function() {   
	var html = "<div id='PRIORITYMESSAGE_PROMPT_FORM'>";
	return html;			
};

ZmPriorityMessageFilterDialog.prototype._initialize = 
function() {
	var streamListener = this._onMoveMsgIntoStream.bind(this);
	var advancedListener = this._onAdvancedControls.bind(this);
	var params = {};
	params.parent = this;
	params.template = "prefs.Pages#PriorityMessageFilterPrompt";
	params.id = "PriorityInboxDialog";
	params.form = {
		items: [
			{ id: "MOVE_MSG_STREAM", type: "DwtCheckbox", label: ZmMsg.enableActivityStream, checked: false, onclick: streamListener},
			{ id: "NOT_TO_ME", type: "DwtCheckbox", label: ZmMsg.moveNotToMe, checked: false},
			{ id: "SELECT_FIELD", type: "DwtSelect", items:[ZmMsg.to, ZmMsg.toOrCc]},
			{ id: "NOT_IN_ADDR", type: "DwtCheckbox", label: ZmMsg.moveNotInAddrBook, checked: false},
			{ id: "DL_SUBSCRIBED", type: "DwtCheckbox", label: ZmMsg.moveMessagesFromDL, checked: true},
			{ id: "MASS_MARKETING", type: "DwtCheckbox", label: ZmMsg.massMarketingMessages, checked: true}
		]
	};
	this._priorityMessageForm = new DwtForm(params);
	this._priorityMessageForm.setScrollStyle(DwtControl.CLIP);
	var div = document.getElementById("PRIORITYMESSAGE_PROMPT_FORM");
	this._priorityMessageForm.appendElement(div);
	
	this._moveMsgIntoStream = this._priorityMessageForm.getControl("MOVE_MSG_STREAM");
	this._notToMe = this._priorityMessageForm.getControl("NOT_TO_ME");
	this._selectField = this._priorityMessageForm.getControl("SELECT_FIELD");
	this._selectField.fixedButtonWidth();
	this._notInMyAddrBk = this._priorityMessageForm.getControl("NOT_IN_ADDR");
	this._dlSubscribedTo = this._priorityMessageForm.getControl("DL_SUBSCRIBED");
	this._massMarketing = this._priorityMessageForm.getControl("MASS_MARKETING");
	
	this._streamHash = {};
	this._streamHash[ZmFilterRule.TEST_BULK] = {control: this._massMarketing, negative: false};
	this._streamHash[ZmFilterRule.TEST_LIST] = {control: this._dlSubscribedTo, negative: false};
	this._streamHash[ZmFilterRule.TEST_ADDRBOOK] = {control: this._notInMyAddrBk, negative: true, headerValue: "from"};
	this._streamHash[ZmFilterRule.TEST_ME] = {control: this._notToMe, negative: true, headerValue: "to"};
	
    this._advancedControls = new DwtText({parent:this,className:"FakeAnchor"});
    this._advancedControls.setText(ZmMsg.advancedControls);
    this._advancedControls.getHtmlElement().onclick = advancedListener;
    this._advancedControls.replaceElement(document.getElementById("PriorityInboxAdvancedControls"));
};

ZmPriorityMessageFilterDialog.prototype.popup =
function() {
	var callback = new AjxCallback(this, this._handleResponseLoadRules);
	this._rules.loadRules(true, callback); // make sure rules are loaded (for when we save)
	
	DwtDialog.prototype.popup.call(this);
};

ZmPriorityMessageFilterDialog.prototype._handleResponseLoadRules =
function() {
	this._activityStreamRule = this._rules.getRuleByName(ZmMsg.activityStreamsRule);
	this._setStreamSelections();
};

ZmPriorityMessageFilterDialog.prototype._onMoveMsgIntoStream = 
function() {
	var enabled = this._moveMsgIntoStream.isSelected();
	this._notToMe.setEnabled(enabled);
	this._selectField.setEnabled(enabled);
	this._notInMyAddrBk.setEnabled(enabled);
	this._dlSubscribedTo.setEnabled(enabled);
	this._massMarketing.setEnabled(enabled);
};

ZmPriorityMessageFilterDialog.prototype._onAdvancedControls = 
function(controlId) {
	var filterRuleDialog = appCtxt.getFilterRuleDialog();
	var isPriority = false;
	var rule = this._activityStreamRule;	
	
	if (rule) {
		filterRuleDialog.popup(rule, true);		
	}
	else {
		//create rule with default conditions
		var ruleName = isPriority ? ZmMsg.markAsPriorityRule : ZmMsg.activityStreamsRule;
		var rule = new ZmFilterRule(ruleName, true, {}, {});
        rule.addAction(ZmFilterRule.A_FOLDER, ZmMsg.activityStreamsRule);
        for (var id in this._streamHash) {
            if (id == ZmFilterRule.TEST_ME) {
				var meTestValue = this._selectField.getValue() == ZmMsg.to ? ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO] : ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO_CC];
                rule.addCondition(id, ZmFilterRule.OP_NOT_IS, null, meTestValue);	
            }
            else if (id == ZmFilterRule.TEST_ADDRBOOK) {
                rule.addCondition(id, ZmFilterRule.OP_NOT_IN ,"contacts", this._streamHash[id].headerValue); //Address in From not in Contacts	
            }
            else {
                rule.addCondition(id);
            }
        }
		rule.setGroupOp(ZmFilterRule.GROUP_ANY);		
		filterRuleDialog.popup(rule, true);
	}
};

ZmPriorityMessageFilterDialog.prototype._setStreamSelections = 
function() {
	if (this._activityStreamRule) {
		if (this._activityStreamRule.active) {
			this._moveMsgIntoStream.setEnabled(true);
			this._moveMsgIntoStream.setSelected(true);
		}
		else {
			this._moveMsgIntoStream.setSelected(false);
		}
		var conditions = this._activityStreamRule.conditions;
		//initialize checkboxes before loading them
		this._massMarketing.setSelected(false);
		this._dlSubscribedTo.setSelected(false);
		this._notInMyAddrBk.setSelected(false);
		this._notToMe.setSelected(false);

		for (var c in conditions) {
			var length = AjxUtil.isArray(conditions[c]) ? conditions[c].length : -1;
			for (var i=0; i<length; i++) {
				var isNegative = AjxUtil.isArray(conditions[c]) && conditions[c][i].negative ? (conditions[c][i].negative == "1") : false;
				if (this._streamHash[c]) {
					if (isNegative && (c == ZmFilterRule.TEST_ADDRBOOK || c == ZmFilterRule.TEST_ME)) {
						var header = AjxUtil.isArray(conditions[c]) && conditions[c][i].header;
						if (c == ZmFilterRule.TEST_ADDRBOOK) {
							value = ZmFilterRule.C_FROM;
						}
						else if (c == ZmFilterRule.TEST_ME) {
							if (header &&  header.toUpperCase() == ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO].toUpperCase()) {
								value = header;
								this._selectField.setSelected(0);
							}
							else if (header &&  header.toUpperCase() == ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO_CC].toUpperCase()) {
								value = header;
								this._selectField.setSelected(1);
							}
						}
						//var value = (c == ZmFilterRule.TEST_ADDRBOOK) ? ZmFilterRule.C_FROM : ZmFilterRule.C_TO;
						if (header && header.toLowerCase() == value.toLowerCase()) {
							this._streamHash[c].control.setSelected(true);
							this._streamHash[c].control.setEnabled(true);
						}
					}
					else if (!isNegative && !(c == ZmFilterRule.TEST_ADDRBOOK || c == ZmFilterRule.TEST_ME)) {
						this._streamHash[c].control.setSelected(true);
						this._streamHash[c].control.setEnabled(true);
					}
				} 
			}
		}
	}
	else {
		this._moveMsgIntoStream.setSelected(false);
	}
	this._onMoveMsgIntoStream();	
};

ZmPriorityMessageFilterDialog.prototype._okButtonListener = 
function() {
	//build filter
	var foundCondition = false;
	var needSave = false; 
	var condition = {};
	var activityRule = this._rules.getRuleByName(ZmMsg.activityStreamsRule);
	
	//handle activity streams
	foundCondition = false;
	if (this._moveMsgIntoStream.isSelected()) {
		var streamRule = new ZmFilterRule(ZmMsg.activityStreamsRule, true, {}, {});
		streamRule.addAction(ZmFilterRule.A_FOLDER, ZmMsg.activityStreamsRule); 
		streamRule.setGroupOp(ZmFilterRule.GROUP_ANY);
		
		for (var id in this._streamHash) {
			var control = this._streamHash[id].control;
			var negative = this._streamHash[id].negative;
			var headerValue = this._streamHash[id].headerValue;
			if (control.isSelected()) {
				if (id == ZmFilterRule.TEST_ME) {
					var meTestValue = this._selectField.getValue() == ZmMsg.to ? ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO] : ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO_CC];
					streamRule.addCondition(id, ZmFilterRule.OP_NOT_IS, null, meTestValue);	
				}
				else if (id == ZmFilterRule.TEST_ADDRBOOK) {
					streamRule.addCondition(id, ZmFilterRule.OP_NOT_IN ,"contacts", headerValue); //Address in From not in Contacts	
				}
				else {
					streamRule.addCondition(id);
				}
				foundCondition = true;
			}
			else if (activityRule) {
				if (id == ZmFilterRule.TEST_ME && this._activityStreamRule.conditions[ZmFilterRule.TEST_ME]) {
					//if we uncheck the me filter we need to know which headerValue we are removing ("to" or "to,cc")
					activityRule = this._removeCondition(activityRule, id, negative, this._activityStreamRule.conditions[ZmFilterRule.TEST_ME][0].headerValue);	
				}
				else {
					activityRule = this._removeCondition(activityRule, id, negative, headerValue);
				}
			}
		}
		
		if (foundCondition && activityRule) {
			for (var id in streamRule.conditions) {
				activityRule.conditions[id] = streamRule.conditions[id];
			}
	
			for (var id in streamRule.actions) {
				activityRule.actions[id] = streamRule.actions[id];
			}
	
			activityRule.active = true;
			needSave = true;
		}
		else if(foundCondition) {
			this._rules.insertRule(streamRule); //insert last
			needSave = true;
		}
		else if (activityRule) {
			return this._handleConditionsError(ZmMsg.ruleNoConditonActivityFilter);	
		}
	}
	else if (activityRule) {
		//set existing rule to be non-active
		activityRule.active = false;
		needSave = true;
	}
	
	if (needSave) {
		this._rules.saveRules(null, true);
		this._createActivityStreamsFolder();
	}
	
	this.popdown();
			
};

ZmPriorityMessageFilterDialog.prototype._getButtonsContainerStartTemplate =
function() {
	var html = "<div style='width: 250px; float: left;'><span id='PriorityInboxAdvancedControls'></span></div><div style='float:right;'>";
	html += DwtDialog.prototype._getButtonsContainerStartTemplate.call(this);
	return html;
};

ZmPriorityMessageFilterDialog.prototype._getButtonsContainerEndTemplate = 
function() {
	var html = "</div>";
	html += DwtDialog.prototype._getButtonsContainerEndTemplate.call(this);
	return html;
};

/**
 * checks condition and value to determine if it should be removed; comparators are not checked
 * @param rule
 * @param condition
 * @param isNegative
 * @param headerValue
 */
ZmPriorityMessageFilterDialog.prototype._removeCondition = 
function(rule, condition, isNegative, headerValue) {
	var c = rule.conditions[condition];
	if (c) {
		for (var i=0; i<c.length; i++) {
			var negativeCheck = isNegative ? c[i].negative == "1" : !c[i].negative;
			var headerCheck = headerValue ? c[i].header == headerValue : true;
			if (condition == ZmFilterRule.TEST_CONVERSATIONS) {
				headerCheck = headerValue ? c[i].where == headerValue : true;
			}
			if (negativeCheck && headerCheck) {				
				c.splice(i, 1);
				rule.conditions[condition] = c;
			}
		} 			
	}
	return rule;
};

ZmPriorityMessageFilterDialog.prototype._handleConditionsError =
function(msg) {  
	var msgDialog = appCtxt.getMsgDialog();
	msgDialog.setMessage(msg, DwtMessageDialog.CRITICAL_STYLE);
	msgDialog.popup();
};

ZmPriorityMessageFilterDialog.prototype._createActivityStreamsFolder =
function() {
	var jsonObj = {CreateFolderRequest:{_jsns:"urn:zimbraMail"}};
	var folder = jsonObj.CreateFolderRequest.folder = {l: ZmOrganizer.ID_ROOT, name: ZmMsg.activityStreamFolder, fie: 1, view: "message"};
	return appCtxt.getAppController().sendRequest({
		jsonObj: jsonObj,
		asyncMode: true,
		callback:  new AjxCallback(this, this._handleActivityStreamsFolderCreate)
	});
};

ZmPriorityMessageFilterDialog.prototype._handleActivityStreamsFolderCreate = 
function(result) {
	var resp = result && result._data && result._data.CreateFolderResponse;
	if (resp) {
		appCtxt.set(ZmSetting.MAIL_ACTIVITYSTREAM_FOLDER, resp.folder[0].id);
	}
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmSharingPage")) {
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
 * Creates a preferences page for displaying shares.
 * @constructor
 * @class
 * This class contains a {@link ZmSharingView}, which shows shares in two list views.
 *
 * @author Conrad Damon
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends		ZmPreferencesPage
 * 
 * @private
 */
ZmSharingPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);
};

ZmSharingPage.prototype = new ZmPreferencesPage;
ZmSharingPage.prototype.constructor = ZmSharingPage;

ZmSharingPage.prototype.isZmSharingPage = true;
ZmSharingPage.prototype.toString = function () { return "ZmSharingPage"; };

ZmSharingPage.prototype.getShares =
function(type, owner, callback) {

	var jsonObj = {GetShareInfoRequest:{_jsns:"urn:zimbraAccount"}};
	var request = jsonObj.GetShareInfoRequest;
	if (type && type != ZmShare.TYPE_ALL) {
		request.grantee = {type:type};
	}
	if (owner) {
		request.owner = {by:"name", _content:owner};
	}
	var respCallback = new AjxCallback(this, this._handleGetSharesResponse, [callback]);
	appCtxt.getAppController().sendRequest({jsonObj:	jsonObj,
											asyncMode:	true,
											callback:	respCallback});
};

ZmSharingPage.prototype._handleGetSharesResponse =
function(callback, result) {

	var resp = result.getResponse().GetShareInfoResponse;
	if (callback) {
		callback.run(resp.share);
	}
};

ZmSharingPage.prototype._createControls =
function() {
	ZmPreferencesPage.prototype._createControls.call(this);

	this.view = new ZmSharingView({parent:this, pageId:this._htmlElId});
	this.view.showMounts();
	this.view.findShares();
	this.view.showGrants();

	if (appCtxt.multiAccounts && this._acAddrSelectList) {
		this._acAddrSelectList.setActiveAccount(appCtxt.getActiveAccount());
	}
};

ZmSharingPage.prototype.hasResetButton =
function() {
	return false;
};


/**
 * Creates a sharing view.
 * @constructor
 * @class
 * <p>Manages a view composed of two sections. The first section is for showing information about
 * folders shared with the user. The user can look for shares that came via their membership in
 * a distribution list, or shares directly from a particular user. The shares are displayed in two
 * lists: one for shares that have not been accepted, and one for shares that have been accepted,
 * which have mountpoints.</p>
 * <p>
 * Internally, shares are standardized into ZmShare objects, with a few additional fields. Shares
 * are converted into those from several different forms: share info JSON from GetShareInfoResponse,
 * ZmShare's on folders that have been shared by the user, and folders that have been mounted by the
 * user.
 *
 * @param {Hash}	params	a hash of parameters
 * @param {ZmSharingPage}		params.parent	the owning prefs page
 * @param {String}	params.pageId	the ID of prefs page's HTML element
 * 
 * @extends		DwtComposite
 * 
 * @private
 */
ZmSharingView = function(params) {

	DwtComposite.apply(this, arguments);

	this._pageId = params.pageId;
	this._shareByKey = {};
	this._shareByDomId = {};

	this._initialize();
	ZmFolderTree.createAllDeferredFolders();
};

ZmSharingView.prototype = new DwtComposite;
ZmSharingView.prototype.constructor = ZmSharingView;

ZmSharingView.ID_RADIO			= "radio";
ZmSharingView.ID_GROUP			= "group";
ZmSharingView.ID_USER			= "user";
ZmSharingView.ID_OWNER			= "owner";
ZmSharingView.ID_FIND_BUTTON	= "findButton";
ZmSharingView.ID_FOLDER_TYPE	= "folderType";
ZmSharingView.ID_SHARE_BUTTON	= "shareButton";

ZmSharingView.PENDING	= "PENDING";
ZmSharingView.MOUNTED	= "MOUNTED";

ZmSharingView.F_ACTIONS	= "ac";
ZmSharingView.F_FOLDER	= "fo";
ZmSharingView.F_ITEM	= "it";
ZmSharingView.F_OWNER	= "ow";
ZmSharingView.F_ROLE	= "ro";
ZmSharingView.F_TYPE	= "ty";
ZmSharingView.F_WITH	= "wi";

ZmSharingView.prototype.toString = function() { return "ZmSharingView"; };

/**
 * Makes a request to the server for group shares or shares from a particular user.
 *
 * @param owner					[string]*		address of account to check for shares from
 * @param userButtonClicked		[boolean]*		if true, user pressed "Find Shares" button
 * 
 * @private
 */
ZmSharingView.prototype.findShares =
function(owner, userButtonClicked) {

	var errorMsg;
	// check if button was actually clicked, since missing owner is fine when form
	// goes through rote validation on display
	if (userButtonClicked && !owner) {
		errorMsg = ZmMsg.sharingErrorOwnerMissing;
	} else if (!this._shareForm.validate(ZmSharingView.ID_OWNER)) {
		errorMsg = ZmMsg.sharingErrorOwnerSelf;
	}
	if (errorMsg) {
		appCtxt.setStatusMsg({msg: errorMsg, level: ZmStatusView.LEVEL_INFO});
		return;
	}

	var respCallback = new AjxCallback(this, this.showPendingShares);
	var type = owner ? null : ZmShare.TYPE_GROUP;
	this._curOwner = owner;
	var shares = this.parent.getShares(type, owner, respCallback);
};
/**
 * Displays a list of shares that have been accepted/mounted by the user.
 * 
 * @private
 */
ZmSharingView.prototype.showMounts =
function() {

	var folderTree = appCtxt.getFolderTree();
	var folders = folderTree && folderTree.asList({remoteOnly:true});
	if (!folders) { return; }

	var ownerHash = {};
	for (var i = 0; i < folders.length; i++) {
		var folder = folders[i];
		if (folder.isMountpoint || folder.link) {
			if (folder.owner) {
				ownerHash[folder.owner] = true;
			}
		}
	}

	var owners = AjxUtil.keys(ownerHash);
	if (owners.length > 0) {
		var jsonObj = {BatchRequest:{_jsns:"urn:zimbra", onerror:"continue"}};
		var br = jsonObj.BatchRequest;
		var requests = br.GetShareInfoRequest = [];
		for (var i = 0; i < owners.length; i++) {
			var req = {_jsns: "urn:zimbraAccount"};
			req.owner = {by:"name", _content:owners[i]};
			requests.push(req);
		}

		var respCallback = new AjxCallback(this, this._handleResponseGetShares);
		appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	}
};

ZmSharingView.prototype._handleResponseGetShares =
function(result) {

	var mounts = [];
	var resp = result.getResponse().BatchResponse.GetShareInfoResponse;
	for (var i = 0; i < resp.length; i++) {
		var shares = resp[i].share;
		if (!(shares && shares.length)) { continue; }
		for (var j = 0; j < shares.length; j++) {
			var share = ZmShare.getShareFromShareInfo(shares[j]);
			if (share.mounted) {
				mounts.push(share);
			}
		}
	}

	mounts.sort(ZmSharingView.sortCompareShare);
	this._mountedShareListView.set(AjxVector.fromArray(mounts));

};

/**
 * Displays shares that are pending (have not yet been mounted).
 *
 * @param shares	[array]		list of JSON share info objects from GetShareInfoResponse
 * 
 * @private
 */
ZmSharingView.prototype.showPendingShares =
function(shares) {

	var pending = [];
	if (shares && shares.length) {
		for (var i = 0; i < shares.length; i++) {
			// convert share info to ZmShare
			var share = ZmShare.getShareFromShareInfo(shares[i]);
			if (!share.mounted) {
				pending.push(share);
			}
		}
	}
	pending.sort(ZmSharingView.sortCompareShare);
	this._pendingShareListView.set(AjxVector.fromArray(pending));
};

/**
 * Displays grants (folders shared by the user) in a list view. Grants show up as shares
 * in folders owned by the user.
 * 
 * @private
 */
ZmSharingView.prototype.showGrants =
function() {

	// the grant objects we get in the refresh block don't have grantee names,
	// so use GetFolder in a BatchRequest to get them
	var batchCmd = new ZmBatchCommand(true, null, true);
	var list = appCtxt.getFolderTree().asList();
	for (var i = 0; i < list.length; i++) {
		var folder = list[i];
		if (folder.shares && folder.shares.length) {
			for (var j = 0; j < folder.shares.length; j++) {
				var share = folder.shares[j];
				if (!(share.grantee && share.grantee.name)) {
					batchCmd.add(new AjxCallback(folder, folder.getFolder, [null, batchCmd]));
					break;
				}
			}
		}
	}

	if (batchCmd._cmds.length) {
		var respCallback = new AjxCallback(this, this._handleResponseGetFolder);
		batchCmd.run(respCallback);
	} else {
		this._handleResponseGetFolder();
	}
};

ZmSharingView.prototype._handleResponseGetFolder =
function() {

	var shares = [], invalid = [];
	var list = appCtxt.getFolderTree().asList();
	for (var i = 0; i < list.length; i++) {
		var folder = list[i];
		if (folder.shares && folder.shares.length) {
			for (var j = 0; j < folder.shares.length; j++) {
				var share = ZmShare.getShareFromGrant(folder.shares[j]);
				if (share.invalid) {
					invalid.push(share);
				}
				shares.push(share);
			}
		}
	}

	shares.sort(ZmSharingView.sortCompareGrant);
	this._grantListView.set(AjxVector.fromArray(shares));

	// an invalid grant is one whose grantee has been removed from the system
	// if we have some, ask the user if it's okay to remove them
	if (invalid.length) {
		invalid.sort(ZmSharingView.sortCompareGrant);
		var msgDialog = appCtxt.getOkCancelMsgDialog();
		var list = [];
		for (var i = 0; i < invalid.length; i++) {
			var share = invalid[i];
			var path = share.link && share.link.path;
			if (path) {
				list.push(["<li>", AjxStringUtil.htmlEncode(path), "</li>"].join(""));
			}
		}
		list = AjxUtil.uniq(list);
		var listText = list.join("");
		msgDialog.setMessage(AjxMessageFormat.format(ZmMsg.granteeGone, listText));
		msgDialog.registerCallback(DwtDialog.OK_BUTTON, this._revokeGrantsOk, this, [msgDialog, invalid]);
		msgDialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._revokeGrantsCancel, this, msgDialog);
		msgDialog.associateEnterWithButton(DwtDialog.OK_BUTTON);
		msgDialog.popup(null, DwtDialog.OK_BUTTON);
	}
};

ZmSharingView.prototype._revokeGrantsOk =
function(dlg, invalid) {

	var batchCmd = new ZmBatchCommand(true, null, true);
	var zids = {};
	for (var i = 0; i < invalid.length; i++) {
		var share = invalid[i];
		zids[share.grantee.id] = share.grantee.type;
	}

	for (var zid in zids) {
		batchCmd.add(new AjxCallback(null, ZmShare.revokeOrphanGrants, [zid, zids[zid], null, batchCmd]));
	}

	if (batchCmd._cmds.length) {
		batchCmd.run();
	}

	dlg.popdown();
};

ZmSharingView.prototype._revokeGrantsCancel =
function(dlg) {
	dlg.popdown();
};

ZmSharingView._handleAcceptLink =
function(domId) {

	var sharingView = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController().getPrefsView().getView("SHARING").view;
	var share = sharingView._shareByDomId[domId];
	if (share) {
		appCtxt.getAcceptShareDialog().popup(share, share.grantor.email);
	}
	return false;
};

ZmSharingView._handleShareAction =
function(domId, handler) {

	var sharingView = appCtxt.getApp(ZmApp.PREFERENCES).getPrefController().getPrefsView().getView("SHARING").view;
	var share = sharingView._shareByDomId[domId];
	if (share) {
		var dlg = appCtxt.getFolderPropsDialog();
		return dlg[handler](null, share);
	}
};

ZmSharingView.prototype._initialize =
function() {

	// form for finding shares
	var params = {};
	params.parent = this;
	params.template = "prefs.Pages#ShareForm";
	params.form = {
		items: [
			{ id: ZmSharingView.ID_RADIO, type: "DwtRadioButtonGroup", onclick: this._onClick, items: [
			{ id: ZmSharingView.ID_GROUP, type: "DwtRadioButton", value: ZmSharingView.ID_GROUP, label: ZmMsg.showGroupShares, checked: true },
			{ id: ZmSharingView.ID_USER, type: "DwtRadioButton", value: ZmSharingView.ID_USER, label: ZmMsg.showUserShares }]},
			{ id: ZmSharingView.ID_OWNER, type: "ZmAddressInputField", validator: this._validateOwner, params: { singleBubble: true } },
			{ id: ZmSharingView.ID_FIND_BUTTON, type: "DwtButton", label: ZmMsg.findShares, onclick: this._onClick }
		]
	};
	this._shareForm = new DwtForm(params);
	var shareFormDiv = document.getElementById(this._pageId + "_shareForm");
	shareFormDiv.appendChild(this._shareForm.getHtmlElement());

	// form for creating a new share
	var options = [];
	var orgTypes = [
		{type: ZmOrganizer.FOLDER},
		{type: ZmOrganizer.CALENDAR, setting: ZmSetting.CALENDAR_ENABLED},
		{type: ZmOrganizer.ADDRBOOK},
		{type: ZmOrganizer.TASKS, setting: ZmSetting.TASKS_ENABLED},
		{type: ZmOrganizer.BRIEFCASE, setting: ZmSetting.BRIEFCASE_ENABLED}
	];
	var orgKey = {};
	orgKey[ZmOrganizer.FOLDER]		= "mailFolder";
	orgKey[ZmOrganizer.TASKS]		= "tasksFolder";
	orgKey[ZmOrganizer.BRIEFCASE]	= "briefcase";
	for (var i = 0; i < orgTypes.length; i++) {
		var orgType = orgTypes[i].type;
		var setting = orgTypes[i].setting;

		// Only add option when feature is enabled
		if (orgType && (!setting || appCtxt.get(setting))) {
			var key = orgKey[orgType] || ZmOrganizer.MSG_KEY[orgType];

			options.push({id: orgType, value: orgType, label: ZmMsg[key]});
		}
	}
	params.template = "prefs.Pages#GrantForm";
	params.form = {
		items: [
			{ id: ZmSharingView.ID_FOLDER_TYPE, type: "DwtSelect", items: options},
			{ id: ZmSharingView.ID_SHARE_BUTTON, type: "DwtButton", label: ZmMsg.share, onclick: this._onClick }
		]
	};
	this._grantForm = new DwtForm(params);
	var grantFormDiv = document.getElementById(this._pageId + "_grantForm");
	grantFormDiv.appendChild(this._grantForm.getHtmlElement());

	var folderTypeSelect = this._grantForm._items.folderType.control;
	folderTypeSelect.fixedButtonWidth();

	// list views of shares and grants
	this._pendingShareListView = new ZmSharingListView({parent:this, type:ZmShare.SHARE,
		status:ZmSharingView.PENDING, sharingView:this, view:ZmId.VIEW_SHARE_PENDING});
	this._addListView(this._pendingShareListView, this._pageId + "_pendingShares");
	this._mountedShareListView = new ZmSharingListView({parent:this, type:ZmShare.SHARE,
		status:ZmSharingView.MOUNTED, sharingView:this, view:ZmId.VIEW_SHARE_MOUNTED});
	this._addListView(this._mountedShareListView, this._pageId + "_mountedShares");
	this._grantListView = new ZmSharingListView({parent:this, type:ZmShare.GRANT,
		sharingView:this, view:ZmId.VIEW_SHARE_GRANTS});
	this._addListView(this._grantListView, this._pageId + "_sharesBy");

	// autocomplete
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			parent:			appCtxt.getShell(),
			dataClass:		appCtxt.getAutocompleter(),
			matchValue:		ZmAutocomplete.AC_VALUE_EMAIL,
			separator:		"",
			keyUpCallback:	this._enterCallback.bind(this),
			contextId:		this.toString()
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		var inputCtrl = this._shareForm.getControl(ZmSharingView.ID_OWNER);
		this._acAddrSelectList.handle(inputCtrl.getInputElement(), inputCtrl._htmlElId);
		inputCtrl.setAutocompleteListView(this._acAddrSelectList);
	}

	appCtxt.getFolderTree().addChangeListener(new AjxListener(this, this._folderTreeChangeListener));
};

ZmSharingView.prototype._addListView =
function(listView, listViewDivId) {
	var listDiv = document.getElementById(listViewDivId);
 	listDiv.appendChild(listView.getHtmlElement());
	listView.setUI(null, true); // renders headers and empty list
	listView._initialized = true;
};

// make sure user is not looking for folders shared from their account
ZmSharingView.prototype._validateOwner =
function(value) {
	if (!value) { return true; }
	return (appCtxt.isMyAddress(value, true)) ? false: true;
};

// Note that in the handler call, "this" is set to the form
ZmSharingView.prototype._onClick =
function(id) {

	if (id == ZmSharingView.ID_FIND_BUTTON) {
		this.setValue(ZmSharingView.ID_USER, true, true);
		this.parent.findShares(this.getValue(ZmSharingView.ID_OWNER), true);
	} else if (id == ZmSharingView.ID_GROUP) {
		this.parent.findShares();
	} else if (id == ZmSharingView.ID_SHARE_BUTTON) {
		var orgType = this.getValue(ZmSharingView.ID_FOLDER_TYPE);
		this.parent._showChooser(orgType);
	}
};

ZmSharingView.prototype._enterCallback =
function(ev) {
	var key = DwtKeyEvent.getCharCode(ev);
	if (DwtKeyEvent.IS_RETURN[key]) {
		this._onClick.call(this._shareForm, ZmSharingView.ID_FIND_BUTTON);
		return false;
	}
	return true;
};

ZmSharingView.prototype._showChooser =
function(orgType) {

	// In multi-account, sharing page gets its own choose-folder dialog since it 
	// only shows the active account's overview. Otherwise, we have to juggle
	// overviews with between single/multiple overview trees. Ugh.
	var dialog;
	if (appCtxt.multiAccounts) {
		if (!this._chooseFolderDialog) {
			AjxDispatcher.require("Extras");
			this._chooseFolderDialog = new ZmChooseFolderDialog(appCtxt.getShell());
		}
		dialog = this._chooseFolderDialog;
	} else {
		dialog = appCtxt.getChooseFolderDialog();
	}

	var overviewId = dialog.getOverviewId(ZmOrganizer.APP[orgType]);
	if (appCtxt.multiAccounts) {
		overviewId = [overviewId, "-", this.toString(), "-", appCtxt.getActiveAccount().name].join("");
	}
	var omit = {};
	omit[ZmFolder.ID_TRASH] = true;
	var params = {
		treeIds: [orgType],
		overviewId: overviewId,
		title: ZmMsg.chooseFolder,
		skipReadOnly: true,
		skipRemote: true,
		omit: omit,
		hideNewButton: true,
		appName: ZmOrganizer.APP[orgType],
		noRootSelect: true,
		forceSingle: true
	};
	dialog.reset();
	dialog.registerCallback(DwtDialog.OK_BUTTON, this._folderSelectionCallback, this, [dialog]);
	dialog.popup(params);
};

ZmSharingView.prototype._folderSelectionCallback =
function(chooserDialog, org) {

	chooserDialog.popdown();
	var shareDialog = appCtxt.getSharePropsDialog();
	
	// This is a transient fix untill we find actual steps to reproduce problem and find exact root cause
	if (org.id === "1") {
		var ex = new AjxException("Root folder sharing is not allowed, ignoring action.", AjxException.INVALID_PARAM);
		appCtxt.getAppController()._handleException(ex);
		return;
	}

	shareDialog.popup(ZmSharePropsDialog.NEW, org);
};

/**
 * Sorts shares in the following order:
 *   1. by name of owner
 *   2. by name of group it was shared with, if any
 *   3. by path of shared folder
 *   
 * @private
 */
ZmSharingView.sortCompareShare =
function(a, b) {

	var ownerA = (a.grantor.name && a.grantor.name.toLowerCase()) || (a.grantor.email && a.grantor.email.toLowerCase()) || "";
	var ownerB = (b.grantor.name && b.grantor.name.toLowerCase()) || (b.grantor.email && b.grantor.email.toLowerCase()) || "";
	if (ownerA != ownerB) {
		return (ownerA > ownerB) ? 1 : -1;
	}

	var groupA = (a.grantee.type == ZmShare.TYPE_GROUP) ? (a.grantee.name && a.grantee.name.toLowerCase()) : "";
	var groupB = (b.grantee.type == ZmShare.TYPE_GROUP) ? (b.grantee.name && b.grantee.name.toLowerCase()) : "";
	if (groupA != groupB) {
		if (!groupA && groupB) {
			return 1;
		} else if (groupA && !groupB) {
			return -1;
		} else {
			return (groupA > groupB) ? 1 : -1;
		}
	}

	var pathA = (a.link.name && a.link.name.toLowerCase()) || "";
	var pathB = (b.link.name && b.link.name.toLowerCase()) || "";
	if (pathA != pathB) {
		return (pathA > pathB) ? 1 : -1;
	}

	return 0;
};

/**
 * Sorts shares in the following order:
 *   1. by name of who it was shared with
 *   2. by path of shared folder
 *   
 * @private
 */
ZmSharingView.sortCompareGrant =
function(a, b) {

	var granteeA = (a.grantee && a.grantee.name && a.grantee.name.toLowerCase()) || "";
	var granteeB = (b.grantee && b.grantee.name && b.grantee.name.toLowerCase()) || "";
	if (granteeA != granteeB) {
		return (granteeA > granteeB) ? 1 : -1;
	}

	var pathA = (a.link && a.link.name) || "";
	var pathB = (b.link && b.link.name) || "";
	if (pathA != pathB) {
		return (pathA > pathB) ? 1 : -1;
	}

	return 0;
};

ZmSharingView.prototype._folderTreeChangeListener =
function(ev) {

	this._pendingShareListView._changeListener(ev);
	this._mountedShareListView._changeListener(ev);
	this._grantListView._changeListener(ev);
};

/**
 * Handle modifications to pending shares, which don't have an item to propagate
 * changes through. The preferences app sends the notifications here.
 *
 * @param modifies		[hash]		notifications
 * 
 * @private
 */
ZmSharingView.prototype.notifyModify =
function(modifies) {

	for (var name in modifies) {
		if (name == "folder") {
			modifies = modifies.folder;
			for (var i = 0; i < modifies.length; i++) {
				var mod = modifies[i];
				var share = this._shareByKey[mod.id];
				var ev = new ZmEvent();
				if (share) {
					var parts = mod.id.split(":");
					share.zid = parts[0];
					share.rid = parts[1];
					ev.ersatz = true;
					ev.set(ZmEvent.E_MODIFY);
					var fields = {};
					if (mod.perm) {
						share.setPermissions(mod.perm);
						fields[ZmOrganizer.F_PERMS] = true;
					}
					if (mod.name) {
						fields[ZmOrganizer.F_RNAME] = true;
					}
					if (mod.l) {
						ev.set(ZmEvent.E_MOVE);
					}
					ev.setDetail("share", share);
					ev.setDetail("fields", fields);
					this._folderTreeChangeListener(ev);
					mod._handled = true;
				} else if (mod.id.indexOf(":") != -1) {
					ev.set(ZmEvent.E_CREATE);
				}
			}
		}
	}
};

/**
 * If we get a refresh block from the server, redraw all three list views.
 *
 * @param refresh	[object]	the refresh block JSON
 * 
 * @private
 */
ZmSharingView.prototype.refresh =
function(refresh) {
	this.findShares(this._curOwner);
	this.showGrants();
};

/**
 * A list view that displays some form of shares, either with or by the user. The data
 * is in the form of a list of ZmShare's.
 *
 * @param {Hash}	params	a hash of parameters
 * @param	{constant}		params.type		the SHARE (shared with user) or GRANT (shared by user)
 * @param	{ZmSharingView}		params.view		the owning view
 * @param	{constant}		params.status	the pending or mounted
 *       
 * @extends		DwtListView
 * 
 * @private
 */
ZmSharingListView = function(params) {

	this.type = params.type;
	this.status = params.status;
	params.headerList = this._getHeaderList();
	DwtListView.call(this, params);

	this.sharingView = params.sharingView;
	this._idMap = {};
};

ZmSharingListView.prototype = new DwtListView;
ZmSharingListView.prototype.constructor = ZmSharingListView;

ZmSharingListView.prototype.toString =
function() {
	return "ZmSharingListView";
};

ZmSharingListView.prototype._getHeaderList =
function() {

	var headerList = [];
	if (this.type == ZmShare.SHARE) {
		headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_OWNER, text:ZmMsg.sharingOwner, width:ZmMsg.COLUMN_WIDTH_OWNER_SH}));
	} else if (this.type == ZmShare.GRANT) {
		headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_WITH, text:ZmMsg.sharingWith, width:ZmMsg.COLUMN_WIDTH_WITH_SH}));
	}
	headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_ITEM, text:ZmMsg.sharingItem}));
	headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_TYPE, text:ZmMsg.sharingFolderType, width:ZmMsg.COLUMN_WIDTH_TYPE_SH}));
	headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_ROLE, text:ZmMsg.sharingRole, width:ZmMsg.COLUMN_WIDTH_ROLE_SH}));
	if (this.type == ZmShare.SHARE) {
		if (this.status == ZmSharingView.PENDING) {
			headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_ACTIONS, text:ZmMsg.actions, width:ZmMsg.COLUMN_WIDTH_ACTIONS_SH}));
		} else {
			headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_FOLDER, text:ZmMsg.sharingFolder, width:ZmMsg.COLUMN_WIDTH_FOLDER_SH}));
		}
		headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_WITH, text:ZmMsg.sharingWith, width:ZmMsg.COLUMN_WIDTH_WITH_SH}));
	} else {
		headerList.push(new DwtListHeaderItem({field:ZmSharingView.F_ACTIONS, text:ZmMsg.actions, width:ZmMsg.COLUMN_WIDTH_ACTIONS_SH}));
	}

	return headerList;
};

ZmSharingListView.prototype._getItemId =
function(item) {

	var account = (item.type == ZmShare.SHARE) ? item.grantor && item.grantor.id :
													   item.grantee && item.grantee.id;
	var key = [account, item.link.id].join(":");
	var id = item.domId;
	if (!id) {
		id = Dwt.getNextId();
		item.domId = id;
		this.sharingView._shareByDomId[id] = item;
		this.sharingView._shareByKey[key] = item;
	}

	return id;
};

ZmSharingListView.prototype._getCellId =
function(item, field, params) {
    var rowId = this._getItemId(item);
    return [rowId, field].join("_");
};

ZmSharingListView.prototype._getCellContents =
function(html, idx, item, field, colIdx, params) {

	if (field == ZmSharingView.F_OWNER) {
		html[idx++] = AjxStringUtil.htmlEncode(item.grantor.name) || item.grantor.email;
	} else if (field == ZmSharingView.F_WITH) {
		var type = item.grantee.type;
		if (type == ZmShare.TYPE_PUBLIC) {
			html[idx++] = ZmMsg.shareWithPublic;
		} else if (type == ZmShare.TYPE_ALL) {
			html[idx++] = ZmMsg.shareWithAll;
		} else if (type == ZmShare.TYPE_GUEST) {
			html[idx++] = item.grantee.id;
		} else {
			html[idx++] = AjxStringUtil.htmlEncode(item.grantee.name);
		}
	} else if (field == ZmSharingView.F_ITEM) {
		html[idx++] = AjxStringUtil.htmlEncode(item.link.path);
	} else if (field == ZmSharingView.F_TYPE) {
		html[idx++] = (item.object && item.object.type) ? ZmMsg[ZmOrganizer.FOLDER_KEY[item.object.type]] :
					  									  ZmShare._getFolderType(item.link.view);
	} else if (field == ZmSharingView.F_ROLE) {
		var role = item.link.role || ZmShare._getRoleFromPerm(item.link.perm);
		html[idx++] = ZmShare.getRoleName(role);
	} else if (field == ZmSharingView.F_FOLDER) {
		html[idx++] = (item.mountpoint && item.mountpoint.path) || "&nbsp;";
	} else if (field == ZmSharingView.F_ACTIONS) {
		if (this.type == ZmShare.SHARE) {
			var id = this._getItemId(item);
            var linkId = [id, ZmShare.ACCEPT].join("_");
			html[idx++] = "<a href='javascript:;' id='" + linkId + "' onclick='ZmSharingView._handleAcceptLink(" + '"' + id + '"' + ");'>" + ZmMsg.accept + "</a>";
		} else {
			idx = this._addActionLinks(item, html, idx);
		}
	}

	return (params && params.returnText) ? html.join("") : idx;
};

ZmSharingListView.prototype._changeListener =
function(ev) {

	var organizers = ev.getDetail("organizers") || [];
	var fields = ev.getDetail("fields") || {};

	if (this.type == ZmShare.SHARE) {
		var share = ev.getDetail("share");
		if (!share) {
			var mtpt = organizers[0];
			if (!mtpt.link) { return; }
			var share = this.sharingView._shareByKey[[mtpt.zid, mtpt.rid].join(":")];
			share = ZmShare.getShareFromLink(mtpt, share);	// update share
		}
		if (!share) { return; }
		if (ev.event == ZmEvent.E_CREATE) {
			// share accepted, mountpoint created; move from pending to mounted list
			if (this.status == ZmSharingView.PENDING) {
				this.removeItem(share);
			} else if (this.status == ZmSharingView.MOUNTED) {
				var index = this._list && this._getIndex(share, this._list.getArray(), ZmSharingView.sortCompareShare);
				this.addItem(share, index, true);
			}
		} else if (ev.event == ZmEvent.E_MODIFY) {
			if ((this.status == ZmSharingView.PENDING && share.mounted) ||
				(this.status == ZmSharingView.MOUNTED && !share.mounted)) { return; }
			if (fields[ZmOrganizer.F_PERMS]) {
				var cell = document.getElementById(this._getCellId(share, ZmSharingView.F_ROLE));
				if (cell) {
					cell.innerHTML = this._getCellContents([], 0, share, ZmSharingView.F_ROLE, null, {returnText:true});
				}
			}
			if ((this.status == ZmSharingView.MOUNTED) && fields[ZmOrganizer.F_NAME]) {
				var cell = document.getElementById(this._getCellId(share, ZmSharingView.F_FOLDER));
				if (cell) {
					cell.innerHTML = this._getCellContents([], 0, share, ZmSharingView.F_FOLDER, null, {returnText:true});
				}
			}
		}
		// if a remote folder has been renamed or moved, rerun the search
		if (ev.event == ZmEvent.E_MOVE || fields[ZmOrganizer.F_RNAME]) {
			if (this.sharingView._curOwner) {
				this.sharingView.findShares(this.sharingView._curOwner);
			}
		}
	}

	// Any change to a grant (including create or revoke) results in a wholesale replacement of
	// the folder's shares, so it's easiest to just redraw the list. Also check for folder rename.
	if (this.type == ZmShare.GRANT) {
		if ((ev.event = ZmEvent.E_MODIFY && fields[ZmOrganizer.F_SHARES]) ||
		    (ev.event = ZmEvent.E_MODIFY && fields[ZmOrganizer.F_NAME] && organizers[0].shares)) {

			this.sharingView.showGrants();
		}
	}
};

/**
 * Adds links for editing, revoking, or resending a grant.
 *
 * @param share		[ZmShare]		share
 * @param html		[array]			HTML content
 * @param idx		[int]			index
 * 
 * @private
 */
ZmSharingListView.prototype._addActionLinks =
function(share, html, idx) {

	var type = share.grantee.type;
	var actions = ["edit", "revoke", "resend"];
	if (type == ZmShare.TYPE_ALL || type == ZmShare.TYPE_DOMAIN || !share.link.role) {
		html[idx++] = ZmMsg.configureWithAdmin;
		actions = [];
	}

	var handlers = ["_handleEditShare", "_handleRevokeShare", "_handleResendShare"]; // handlers in ZmFolderPropsDialog

	for (var i = 0; i < actions.length; i++) {

		var action = actions[i];
        var linkId = [share.domId, action].join("_");
		// public shares have no editable fields, and sent no mail
		if (share.isGuest() && action == "edit") { continue; }
		if ((share.isPublic() || share.invalid) && (action == "edit" || action == "resend")) { continue; }

		html[idx++] = "<a href='javascript:;' id='" + linkId + "' onclick='ZmSharingView._handleShareAction(" + '"' + share.domId + '", "' + handlers[i] + '"' + ");'>" + ZmMsg[action] + "</a> ";
	}

	return idx;
};

/**
 * Returns the position of the share in the given list using the given compare function.
 *
 * @param share			[ZmShare]		a share
 * @param list			[array]			list of shares
 * @param compareFunc	[function]		compare function
 * 
 * @private
 */
ZmSharingListView.prototype._getIndex =
function(share, list, compareFunc) {

	for (var i = 0; i < list.length; i++) {
		var result = compareFunc(share, list[i]);
		if (result == -1) {
			return i;
		}
	}
	return null;
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmFilterPage")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2010, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates the filters page, with tabs for incoming and outgoing filters.
 * @class
 * This class represents the filters page.
 * 
 * @param {DwtControl}	            parent			the containing widget
 * @param {Object}	                section			the page
 * @param {ZmFilterController}	    controller		the filter controller
 * 
 * @extends	ZmPreferencesPage
 * 
 * @private
 */
ZmFilterPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);
};

ZmFilterPage.prototype = new ZmPreferencesPage;
ZmFilterPage.prototype.constructor = ZmFilterPage;

ZmFilterPage.prototype.isZmFilterPage = true;
ZmFilterPage.prototype.toString = function () { return "ZmFilterPage"; };

ZmFilterPage.prototype._createControls =
function() {
	if (appCtxt.get(ZmSetting.PRIORITY_INBOX_ENABLED)) {
		this._activityStreamsButton = new DwtButton({parent:this, parentElement: this._htmlElId+"_ACTIVITY_STREAM_BUTTON" });
		this._activityStreamsButton.setText(ZmMsg.activityStreamSettings);
		this._activityStreamsButton.addSelectionListener(new AjxListener(this, this._activityStreamDialog));
	}
	this._tabView = new DwtTabView({parent:this, posStyle:Dwt.STATIC_STYLE});
	this._tabView.reparentHtmlElement(this._htmlElId+"_tabview");
	var incomingController = this._controller.getIncomingFilterRulesController();
	this._tabView.addTab(ZmMsg.incomingMessageFilters, incomingController.getFilterRulesView());
	var outgoingController = this._controller.getOutgoingFilterRulesController();
	this._tabView.addTab(ZmMsg.outgoingMessageFilters, outgoingController.getFilterRulesView());
	this.setVisible(true);
	
	this.hasRendered = true;
};

ZmFilterPage.prototype.reset =
function() {
	ZmPreferencesPage.prototype.reset.apply(this, arguments);
	this._controller._stateChangeListener();
};

ZmFilterPage.prototype.getTabView =
function () {
	return this._tabView;
};

ZmFilterPage.prototype.hasResetButton =
function() {
	return false;
};


//
// Protected methods
//

ZmFilterPage.prototype._setupCustom = function(id, setup, value) {
	if (id == "FILTER_TABS") {
		return this.getTabView();
	}
	return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

ZmFilterPage.prototype._activityStreamDialog = function() {
	var priorityFilterDialog = appCtxt.getPriorityMessageFilterDialog();
	ZmController.showDialog(priorityFilterDialog);
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmNotificationsPage")) {
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
 * Creates a preferences page for displaying notifications.
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 *
 * @extends		ZmPreferencesPage
 */
ZmNotificationsPage = function(parent, section, controller) {
	if (arguments.length == 0) return;
	ZmPreferencesPage.apply(this, arguments);
};
ZmNotificationsPage.prototype = new ZmPreferencesPage;
ZmNotificationsPage.prototype.constructor = ZmNotificationsPage;

ZmNotificationsPage.prototype.toString = function() {
	return "ZmNotificationsPage";
};

//
// Constants
//

// device email data

ZmNotificationsPage.REGIONS = {};
ZmNotificationsPage.CARRIERS = {};

//
// DwtControl methods
//

ZmNotificationsPage.prototype.getTabGroupMember = function() {
	return this._form.getTabGroupMember();
};

ZmNotificationsPage.prototype._getValidatedDevice = function() {
	var acct = appCtxt.multiAccounts && appCtxt.getActiveAccount();
	return appCtxt.get(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS, null, acct);
};

ZmNotificationsPage.prototype._getEmailAddress = function() {
	var acct = appCtxt.multiAccounts && appCtxt.getActiveAccount();
	return appCtxt.get(ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS, null, acct);
};


//
// ZmPreferencesPage methods
//

ZmNotificationsPage.prototype.showMe = function() {
	// default processing
	var initialize = !this.hasRendered;
	ZmPreferencesPage.prototype.showMe.apply(this, arguments);

	// setup controls
	var status = this._getValidatedDevice() ?
			ZmNotificationsPageForm.CONFIRMED : ZmNotificationsPageForm.UNCONFIRMED;
	this._form.setValue("DEVICE_EMAIL_CODE_STATUS_VALUE", status);
	this._form.setValue("EMAIL", this._getEmailAddress());
	this._form.update();

	// load SMS data, if needed
	if (initialize && this._form.getControl("DEVICE_EMAIL_REGION") != null) {
		var locid = window.appRequestLocaleId ? "&locid=" + window.appRequestLocaleId : "";
		var includes = [
			[   appContextPath,
				"/res/ZmSMS.js",
				"?v=",cacheKillerVersion,
				locid,
				appDevMode ? "&debug=1" : ""
			].join("")
		];
		var baseurl = null;
		var callback = new AjxCallback(this, this._smsDataLoaded);
		var proxy = null;
		AjxInclude(includes, baseurl, callback, proxy);
	}
};

/**
 * <strong>Note:</strong>
 * Only the email field is a preference that the user can set directly.
 *
 * @private
 */
ZmNotificationsPage.prototype.isDirty = function() {
	return this._form.getValue("EMAIL") != this._getEmailAddress();
};

/**
 * <strong>Note:</strong>
 * Only the email field is a preference that the user can set directly.
 *
 * @private
 */
ZmNotificationsPage.prototype.validate = function() {
	return this._form.isValid("EMAIL");
};

ZmNotificationsPage.prototype.setFormValue = function(id, value, setup, control) {
	value = ZmPreferencesPage.prototype.setFormValue.apply(this, arguments);
	if (id == ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS) {
		this._form.setValue("EMAIL", value);
		this._form.update();
	}
	return value;
};

ZmNotificationsPage.prototype.getFormValue = function(id, setup, control) {
	if (id == ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS) {
		var value = this._form.getValue("EMAIL");
		return setup && setup.valueFunction ? setup.valueFunction(value) : value;
	}
	return ZmPreferencesPage.prototype.getFormValue.apply(this, arguments);
};

/**
 * This class compleletely overrides the ZmPreferencePage's page
 * creation in order to use DwtForm for easier page creation. By
 * using DwtForm, we can get automatic control creation, tab group
 * ordering, and interactivity dependencies.
 *
 * @private
 */
ZmNotificationsPage.prototype._createPageTemplate = function() {
	DBG.println(AjxDebug.DBG2, "rendering preferences page " + this._section.id);
	this._cleanup();
	this.setVisible(false); // hide until ready
};

ZmNotificationsPage.prototype._cleanup =
		function() {
			this.setContent("");
		}

ZmNotificationsPage.prototype._createControls = function() {

	//cleanup
	this._cleanup();

	// the following part is to do stuff that ZmPreferencesPage does (setting the origValue of the preference),
	// but simplified for this case (since we are not using all the stuff from ZmPreferencesPage, we are using DwtForm instead)
	var email = this._getEmailAddress();
	var settings = appCtxt.getSettings();
	var emailPrefId = ZmSetting.CAL_EMAIL_REMINDERS_ADDRESS;
	var pref = settings.getSetting(emailPrefId);
	// save the current value (for checking later if it changed)
	pref.origValue = email;

	// create form controls
	this._form = this._setupCustomForm();
	this._form.reparentHtmlElement(this.getContentHtmlElement());

	// make it look like email notification pref control is present
	// NOTE: This is needed so that the default pref saving works.
	// NOTE: This is used in conjunction with set/getFormValue.
	if (this._form.getControl("EMAIL")) {
		this._prefPresent = {};
		this._prefPresent[emailPrefId] = true;
	}

	// finish setup
	this.setVisible(true);
	this.hasRendered = true;
};

ZmNotificationsPage.prototype._resetPageListener = function() {
	ZmPreferencesPage.prototype._resetPageListener.apply(this, arguments);
	this._form.reset();
};

//
// Protected methods
//

ZmNotificationsPage.prototype._setupCustomForm = function() {
	return new ZmNotificationsPageForm({parent:this, sectionTemplate:this._section.templateId, id:"ZmNotificationsPage"});
};

ZmNotificationsPage.prototype._smsDataLoaded = function() {
	if (!window.ZmSMS) return;
	this._form.setSMSData(window.ZmSMS);
};

//
// Classes
//

ZmNotificationsPageForm = function(params) {
	if (arguments.length == 0) return;
	params.form = this._getFormParams(params.sectionTemplate);
	DwtForm.apply(this, arguments);

    // hide DwtSelect options which overflow the container
	var select = this.getControl("DEVICE_EMAIL_CARRIER");
	if (select) {
		select.dynamicButtonWidth();
	}

	this._regionSelectionListener = new AjxListener(this, this._handleRegionSelection);

	// listen to CAL_DEVICE_EMAIL_REMINDERS_ADDRESS changes
	// NOTE: We can't actually listen to changes in this value because
	// NOTE: ZmSetting doesn't notify the listeners when the value is
	// NOTE: set *if* it has an actual LDAP name.
};
ZmNotificationsPageForm.prototype = new DwtForm;
ZmNotificationsPageForm.prototype.constructor = ZmNotificationsPageForm;

ZmNotificationsPageForm.prototype.toString = function() {
	return "ZmNotificationsPageForm";
};

// Constants: special region/carrier ids

ZmNotificationsPageForm.CUSTOM = "Custom";
ZmNotificationsPageForm.UNKNOWN = "Unknown";

// Constants: code status values; also doubles as element class names

ZmNotificationsPageForm.CONFIRMED = "DeviceCodeConfirmed";
ZmNotificationsPageForm.PENDING = "DeviceCodePending";
ZmNotificationsPageForm.UNCONFIRMED = "DeviceCodeUnconfirmed";

// Constants: private

ZmNotificationsPageForm.__letters2NumbersMap = {
	a:2,b:2,c:2,d:3,e:3,f:3,
	g:4,h:4,i:4,	j:5,k:5,l:5,m:6,n:6,o:6,
	p:7,q:7,r:7,s:7,t:8,u:8,v:8,w:9,x:9,y:9,z:9
};

// Public

ZmNotificationsPageForm.prototype.setSMSData = function(data) {
	this._smsData = data;

	// setup regions control
	var regionMap = this._defineRegions(data);
	var button = this.getControl("DEVICE_EMAIL_REGION");
	var menu = this.__createRegionsMenu(button, regionMap);
	if (menu == null) {
		// always have at least one region
		menu = new DwtMenu({parent:button});
		this.__createRegionMenuItem(menu, ZmNotificationsPageForm.UNKNOWN, ZmMsg.unknown);
	}
	menu.addSelectionListener(this._regionSelectionListener);
	button.setMenu(menu);

	// set default region
	this.setRegion(data.defaultRegionId);
};

ZmNotificationsPageForm.prototype.setRegion = function(regionId) {
	// decorate the region button
	var region = ZmNotificationsPage.REGIONS[regionId] || { id:ZmNotificationsPageForm.UNKNOWN, label:ZmMsg.unknown };
	var button = this.getControl("DEVICE_EMAIL_REGION");
	button.setText(region.label);
	button.setImage(region.image);
	button.setData(Dwt.KEY_ID, region.id);

	// update the form
	this.setCarriers(regionId);
	this.setValue("DEFAULT_EMAIL_REGION", regionId);
	if (regionId == this._smsData.defaultRegionId && this._smsData.defaultCarrierId) {
		this.setValue("DEVICE_EMAIL_CARRIER", this._smsData.defaultCarrierId);
	}
	this.update();
};

ZmNotificationsPageForm.prototype.setCarriers = function(regionId) {
	var select = this.getControl("DEVICE_EMAIL_CARRIER");
	select.clearOptions();
	var region = ZmNotificationsPage.REGIONS[regionId] || {};
	var carriers = ZmNotificationsPageForm.__getRegionCarriers(region, true);
	carriers.sort(ZmNotificationsPageForm.__byLabel);
	for (var i = 0; i < carriers.length; i++) {
		var carrier = carriers[i];
		var image = carrier.image || carrier.region.image;
		select.addOption({displayValue:carrier.label, value:carrier.id, image:image});
	}
	select.addOption({displayValue:ZmMsg.custom, value:ZmNotificationsPageForm.CUSTOM, image:null});
};

ZmNotificationsPageForm.prototype.isCustom = function() {
	// user selected "Custom"
	var carrierId = this.getValue("DEVICE_EMAIL_CARRIER");
	if (carrierId == ZmNotificationsPageForm.CUSTOM) return true;

	// any entry w/o an email pattern is also custom
	var carrier = ZmNotificationsPage.CARRIERS[carrierId];
	var hasPattern = Boolean(carrier && carrier.pattern);
	return !hasPattern;
};

ZmNotificationsPageForm.prototype.getEmailAddress = function() {
	if (this.isCustom()) {
		var number = this.getValue("DEVICE_EMAIL_CUSTOM_NUMBER");
		var address = this.getValue("DEVICE_EMAIL_CUSTOM_ADDRESS");
		return number && address ? [number,address].join("@") : "";
	}

	var phone = ZmNotificationsPageForm.normalizePhoneNumber(this.getValue("DEVICE_EMAIL_PHONE"));
	var carrier = ZmNotificationsPage.CARRIERS[this.getValue("DEVICE_EMAIL_CARRIER")];
	return phone ? AjxMessageFormat.format(carrier.pattern, [phone]) : "";
};

ZmNotificationsPageForm.prototype.getCodeStatus = function() {
	// is there anything to do?
	var control = this.getControl("DEVICE_EMAIL_CODE_STATUS");
	if (!control) return "";

	// remove other status class names
	var controlEl = control.getHtmlElement();
	Dwt.delClass(controlEl, ZmNotificationsPageForm.CONFIRMED);
	Dwt.delClass(controlEl, ZmNotificationsPageForm.PENDING);
	Dwt.delClass(controlEl, ZmNotificationsPageForm.UNCONFIRMED);

	// add appropriate class name
	var status = this.get("DEVICE_EMAIL_CODE_STATUS_VALUE");
	Dwt.addClass(controlEl, status);

	// format status text
	if (status == ZmNotificationsPageForm.CONFIRMED) {
		var email = this._getValidatedDevice();
		if (email) {
			var pattern = ZmMsg.deviceEmailNotificationsVerificationStatusConfirmed;
			return AjxMessageFormat.format(pattern, [email]);
		}
		// default back to unconfirmed
		Dwt.delClass(controlEl, status, ZmNotificationsPageForm.UNCONFIRMED);
	}
	return status == ZmNotificationsPageForm.PENDING ?
			ZmMsg.deviceEmailNotificationsVerificationStatusPending :
			ZmMsg.deviceEmailNotificationsVerificationStatusUnconfirmed
			;
};

ZmNotificationsPageForm.prototype.getPhoneHint = function() {
	var carrierId = this.getValue("DEVICE_EMAIL_CARRIER");
	var carrier = ZmNotificationsPage.CARRIERS[carrierId];
	var carrierHint = carrier && carrier.hint;
	var email = this.getEmailAddress();
	var emailHint = email && AjxMessageFormat.format(ZmMsg.deviceEmailNotificationsPhoneNumber, [email]);
	if (carrierHint || emailHint) {
		if (!carrierHint) return emailHint;
		if (!emailHint) return carrierHint;
		return AjxMessageFormat.format(ZmMsg.deviceEmailNotificationsCarrierEmailHint, [emailHint,carrierHint]);
	}
	return "";
};

ZmNotificationsPageForm.normalizePhoneNumber = function(phone) {
	if (phone) {
		phone = phone.replace(/[a-z]/gi, ZmNotificationsPageForm.__letters2Numbers);
		phone = phone.replace(/[^+#\*0-9]/g, "");
	}
	return phone;
};

// Protected

ZmNotificationsPageForm.prototype._getFormParams = function(templateId) {
	return {
		template: templateId,
		items: [
			// default pref page controls
			{ id: "REVERT_PAGE", type: "DwtButton", label: ZmMsg.restorePage,
				onclick: "this.parent._resetPageListener()"
			},
			// email
			{ id: "EMAIL", type: "DwtInputField", hint: ZmMsg.exampleEmailAddr, cols:100 },
			// device email (aka SMS)
			{ id: "DEVICE_EMAIL_REGION", type: "DwtButton",
				enabled: "this._smsData",
				onclick: this._handleRegionClick
			},
			{ id: "DEVICE_EMAIL_CARRIER", type: "DwtSelect", value: ZmNotificationsPageForm.CUSTOM,
				enabled: this._isCarrierEnabled
			},
			{ id: "DEVICE_EMAIL_PHONE", type: "DwtInputField",
				hint: ZmMsg.deviceEmailNotificationsPhoneHint,
				visible: "!this.isCustom()",
				onchange: this._handleCarrierChange
			},
			{ id: "DEVICE_EMAIL_PHONE_HINT", type: "DwtText",
				getter: this.getPhoneHint,
				visible: "get('DEVICE_EMAIL_PHONE_HINT')" // NOTE: only show if there's a value
			},
			{ id: "DEVICE_EMAIL_PHONE_SEND_CODE", type: "DwtButton",
				label: ZmMsg.deviceEmailNotificationsVerificationCodeSend,
				visible: "!this.isCustom()",
				enabled: "get('DEVICE_EMAIL_PHONE')",
				onclick: this._handleSendCode
			},
			{ id: "DEVICE_EMAIL_CUSTOM_NUMBER", type: "DwtInputField",
				visible: "this.isCustom()"
			},
			{ id: "DEVICE_EMAIL_CUSTOM_ADDRESS", type: "DwtInputField",
				visible: "this.isCustom()"
			},
			{ id: "DEVICE_EMAIL_CUSTOM_SEND_CODE", type: "DwtButton",
				label: ZmMsg.deviceEmailNotificationsVerificationCodeSend,
				visible: "this.isCustom()",
				enabled: "get('DEVICE_EMAIL_CUSTOM_NUMBER') && get('DEVICE_EMAIL_CUSTOM_ADDRESS')",
				onclick: this._handleSendCode
			},
			{ id: "DEVICE_EMAIL_CODE", type: "DwtInputField",
				hint: ZmMsg.deviceEmailNotificationsVerificationCodeHint
			},
			{ id: "DEVICE_EMAIL_CODE_VALIDATE", type: "DwtButton",
				label: ZmMsg.deviceEmailNotificationsVerificationCodeValidate,
				enabled: "get('DEVICE_EMAIL_CODE') && this.getEmailAddress()",
				onclick: this._handleValidateCode
			},
			{ id: "DEVICE_EMAIL_CODE_INVALIDATE", type: "DwtButton",
				label: ZmMsg.deviceEmailNotificationsVerificationCodeInvalidate,
				visible: "this._getValidatedDevice()",
				onclick: this._handleInvalidateDevice
			},
			{ id: "DEVICE_EMAIL_CODE_STATUS", type: "DwtText",
				className: "DeviceCode", getter: this.getCodeStatus
			},
			// NOTE: This holds the current code status
			{ id: "DEVICE_EMAIL_CODE_STATUS_VALUE", value: ZmNotificationsPageForm.UNCONFIRMED }
		]
	};
};

ZmNotificationsPageForm.prototype._isCarrierEnabled = function() {
	var control = this.getControl('DEVICE_EMAIL_CARRIER');
	return control && control.getOptionCount() > 0;
};

ZmNotificationsPageForm.prototype._defineRegions = function(data) {
	// define regions
	var regionMap = {};
	for (var id in data) {
		// do we care about this entry?
		if (!id.match(/^region_/)) continue;

		// take apart message key
		var parts = id.split(/[_\.]/);
		var prop = parts[parts.length - 1];

		// set region info
		var regions = regionMap;
		var regionIds = parts[1].split("/"), region;
		for (var i = 0; i < regionIds.length; i++) {
			var regionId = regionIds[i];
			if (!regions[regionId]) {
				regions[regionId] = ZmNotificationsPage.REGIONS[regionId] = { id: regionId };
			}
			region = regions[regionId];
			if (i < regionIds.length - 1 && !region.regions) {
				region.regions = {};
			}
			regions = region.regions;
		}

		// store property
		region[prop] = data[id];
	}

	// define carriers
	this._defineCarriers(data);

	return regionMap;
};

ZmNotificationsPageForm.prototype._defineCarriers = function(data) {
	for (var id in data) {
		// do we care about this entry?
		if (!id.match(/^carrier_/)) continue;

		// take apart message key
		var s = id.split(/[_\.]/);
		var prop = s[s.length - 1];

		// set carrier info
		var carrierId = s.slice(1, 3).join("_");
		var carrier = ZmNotificationsPage.CARRIERS[carrierId];
		if (!carrier) {
			var regionId = s[1];
			var region = ZmNotificationsPage.REGIONS[regionId];
			if (!region.carriers) {
				region.carriers = {};
			}
			carrier = region.carriers[carrierId] = ZmNotificationsPage.CARRIERS[carrierId] = {
				id: carrierId, region: region
			};
		}

		// store property
		carrier[prop] = data[id];
	}
	return ZmNotificationsPage.CARRIERS;
};

ZmNotificationsPageForm.prototype._handleRegionClick = function() {
	var button = this.getControl("DEVICE_EMAIL_REGION");
	var menu = button.getMenu();
	if (menu.isPoppedUp()) {
		menu.popdown();
	}
	else {
		button.popup();
	}
};

ZmNotificationsPageForm.prototype._handleCarrierChange = function() {
	var controlId = this.isCustom() ? "DEVICE_EMAIL_NUMBER" : "DEVICE_EMAIL_PHONE";
	var control = this.getControl(controlId);
	if (control && control.focus) {
		control.focus();
	}
};

ZmNotificationsPageForm.prototype._handleSendCode = function() {
	var params = {
		jsonObj: {
			SendVerificationCodeRequest: {
				_jsns: "urn:zimbraMail",
				a: this.getEmailAddress()
			}
		},
		asyncMode: true,
		callback: new AjxCallback(this, this._handleSendCodeResponse)
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmNotificationsPageForm.prototype._handleSendCodeResponse = function(resp) {
	appCtxt.setStatusMsg(ZmMsg.deviceEmailNotificationsVerificationCodeSendSuccess);

	this.setValue("DEVICE_EMAIL_CODE_STATUS_VALUE", ZmNotificationsPageForm.PENDING);
	this.update();

	var dialog = appCtxt.getMsgDialog();
	var email = appCtxt.get(ZmSetting.USERNAME);
	var message = AjxMessageFormat.format(ZmMsg.deviceEmailNotificationsVerificationCodeSendNote, [email]);
	dialog.setMessage(message);
	dialog.popup();
};

ZmNotificationsPageForm.prototype._handleRegionSelection = function(event) {
	var regionId = event.item.getData(Dwt.KEY_ID);
	this.setRegion(regionId);
};

ZmNotificationsPageForm.prototype._handleValidateCode = function() {
	var params = {
		jsonObj: {
			VerifyCodeRequest: {
				_jsns: "urn:zimbraMail",
				a: this.getEmailAddress(),
				code: this.getValue("DEVICE_EMAIL_CODE")
			}
		},
		asyncMode: true,
		callback: new AjxCallback(this, this._handleValidateCodeResponse)
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmNotificationsPageForm.prototype._handleValidateCodeResponse = function(resp) {
	var success = AjxUtil.get(resp.getResponse(), "VerifyCodeResponse", "success") == "1";
	var params = {
		msg: success ?
				ZmMsg.deviceEmailNotificationsVerificationCodeValidateSuccess :
				ZmMsg.deviceEmailNotificationsVerificationCodeValidateFailure,
		level: success ? ZmStatusView.LEVEL_INFO : ZmStatusView.LEVEL_CRITICAL
	};
	appCtxt.setStatusMsg(params);

	// NOTE: Since the preference values only come in at launch time,
	// NOTE: manually set the confirmed email address so that we can
	// NOTE: display the correct confirmed code status text
	if (success) {
		appCtxt.set(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS, this.getEmailAddress());
	}

	var status = success ? ZmNotificationsPageForm.CONFIRMED : ZmNotificationsPageForm.UNCONFIRMED;
	this.setValue("DEVICE_EMAIL_CODE_STATUS_VALUE", status);
	this.update();
};


ZmNotificationsPageForm.prototype._getValidatedDevice = function() {
	return this.parent._getValidatedDevice();
};


ZmNotificationsPageForm.prototype._handleInvalidateDevice = function() {
	var params = {
		jsonObj: {
			InvalidateReminderDeviceRequest: {
				_jsns: "urn:zimbraMail",
				a: this._getValidatedDevice()
			}
		},
		asyncMode: true,
		callback: new AjxCallback(this, this._handleInvalidateDeviceResponse)
	};
	appCtxt.getAppController().sendRequest(params);
};

ZmNotificationsPageForm.prototype._handleInvalidateDeviceResponse = function(resp) {
	var dummy = resp.getResponse(); //to get the exception thrown if there was some unexpected error.
	var params = {
		msg: ZmMsg.deviceEmailNotificationsVerificationCodeInvalidateSuccess,
		level: ZmStatusView.LEVEL_INFO
	};
	appCtxt.setStatusMsg(params);

	appCtxt.set(ZmSetting.CAL_DEVICE_EMAIL_REMINDERS_ADDRESS, null);
	this.setValue("DEVICE_EMAIL_CODE_STATUS_VALUE", ZmNotificationsPageForm.UNCONFIRMED);
	this.update();
};


// Private

ZmNotificationsPageForm.prototype.__createRegionsMenu = function(parent, regionMap, parentRegion) {
	var regions = AjxUtil.values(regionMap, ZmNotificationsPageForm.__acceptRegion);
	if (regions.length == 0) return null;

	var menu = new DwtMenu({parent:parent});

	regions.sort(ZmNotificationsPageForm.__byLabel);
	for (var i = 0; i < regions.length; i++) {
		var region = regions[i];
		// add entry for this region
		var image = parent instanceof DwtMenuItem ? region.image : null;
		var menuItem = this.__createRegionMenuItem(menu, region.id, region.label, image);
		// add sub-regions
		var subMenu = region.regions && this.__createRegionsMenu(menuItem, region.regions, region);
		if (subMenu && subMenu.getItemCount() > 0) {
			subMenu.addSelectionListener(this._regionSelectionListener);
			menuItem.setMenu(subMenu);
		}
	}

	// NOTE: Since only the call to this method *within* this method
	// NOTE: passes in a parentRegion, we'll only add a general entry for
	// NOTE: the parent region at a sub-level and never at the top level.
	if (parentRegion) {
		var hasCarriers = parentRegion.carriers && parentRegion.carriers.length > 0;
		var menuItemCount = menu.getItemCount();
		if (hasCarriers || menuItemCount > 1) {
			this.__createRegionMenuItem(menu, parentRegion.id, parentRegion.label, parentRegion.image, 0);
			if (menuItemCount > 1) {
				new DwtMenuItem({parent:menu,style:DwtMenuItem.SEPARATOR_STYLE,index:1});
			}
		}
	}

	return menu;
};

ZmNotificationsPageForm.prototype.__createRegionMenuItem = function(parent, id, label, image, index) {
	var menuItem = new DwtMenuItem({parent:parent,index:index});
	menuItem.setText(label);
	menuItem.setImage(image);
	menuItem.setData(Dwt.KEY_ID, id);
	return menuItem;
};

ZmNotificationsPageForm.__acceptRegion = function(regionId, regionMap) {
	var region = regionMap[regionId];
	var hasRegions = false;
	for (var id in region.regions) {
		if (ZmNotificationsPageForm.__acceptRegion(id, region.regions)) {
			hasRegions = true;
			break;
		}
	}
	var hasCarriers = ZmNotificationsPageForm.__getRegionCarriers(region).length > 0;
	return hasRegions || hasCarriers;
};

ZmNotificationsPageForm.__getRegionCarriers = function(region, recurse) {
	if (region.carriers && !(region.carriers instanceof Array)) {
		region.carriers = AjxUtil.values(region.carriers);
		region.carriers.sort(ZmNotificationsPageForm.__byLabel);
	}
	var carriers = region.carriers || [];
	if (recurse && region.regions) {
		for (var regionId in region.regions) {
			carriers = carriers.concat(ZmNotificationsPageForm.__getRegionCarriers(region.regions[regionId], true));
		}
	}
	return carriers;
};

ZmNotificationsPageForm.__byLabel = AjxCallback.simpleClosure(AjxUtil.byStringProp, window, "label");

ZmNotificationsPageForm.__letters2Numbers = function($0) {
	return ZmNotificationsPageForm.__letters2NumbersMap[$0.toLowerCase()];
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmActivityStreamPromptDialog")) {
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

ZmActivityStreamPromptDialog = function() {
	var extraButtons = new DwtDialog_ButtonDescriptor(ZmActivityStreamPromptDialog.ADD_ADVANCED_BUTTON, ZmMsg.advanced, DwtDialog.ALIGN_LEFT);
	DwtDialog.call(this, {parent:appCtxt.getShell(), className:"ZmActivityStreamPromptDialog", title:"Activity Stream Rules",
						  standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON], extraButtons: [extraButtons]});	
	// set content
	this.setContent(this._contentHtml());
	this._initialize();
	
	var okButton = this.getButton(DwtDialog.OK_BUTTON);
	okButton.setText(ZmMsg.save);
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._saveListener));
	
	var advancedButton = this.getButton(ZmActivityStreamPromptDialog.ADD_ADVANCED_BUTTON);
	this.setButtonListener(ZmActivityStreamPromptDialog.ADD_ADVANCED_BUTTON, new AjxListener(this, this._advancedListener));
};

ZmActivityStreamPromptDialog.prototype = new DwtDialog;
ZmActivityStreamPromptDialog.prototype.constructor = ZmActivityStreamPromptDialog;
ZmActivityStreamPromptDialog.ADD_ADVANCED_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmActivityStreamPromptDialog.prototype._contentHtml = 
function() {   
	return "<div style='width: 400px' id='ACTIVITYSTREAM_PROMPT_FORM'>" + ZmMsg.activityStreamPrompt + "</div>";				
};

ZmActivityStreamPromptDialog.prototype._initialize = 
function() {
	var params = {};
	params.parent = this;
	params.template = "prefs.Pages#ActivityStreamPrompt";
	params.form = {
		items: [
			{ id: "SENTTO", type: "DwtCheckbox", label: ZmMsg.to + ":", value: "to"},
			{ id: "TO", type: "DwtInputField", value: "", cols: 30},
			{ id: "RECEIVED", type: "DwtCheckbox", label: ZmMsg.receivedFrom, value: "received"},
			{ id: "FROM", type: "DwtInputField", value: "", cols: 30},
			{ id: "SUBJECT", type: "DwtCheckbox", label: ZmMsg.subjectContains, value: "subject"},
			{ id: "CONTAINS", type: "DwtInputField", value: "", cols: 30}
		]
	};
	this._activityStreamForm = new DwtForm(params);
	var activityStreamForm = document.getElementById("ACTIVITYSTREAM_PROMPT_FORM");
	this._activityStreamForm.appendElement(activityStreamForm);
	this._activityStreamForm.getControl("SUBJECT").setSelected(false);
};

ZmActivityStreamPromptDialog.prototype._handleResponseLoadRules = 
function() {
	this._activityRule = this._rules.getRuleByName(ZmMsg.activityStreamsRule);	
};

/**
 * Checks to see if new condition is being added before popping up dialog
 * @param skip {Boolean} true to skip new condition check
 */
ZmActivityStreamPromptDialog.prototype.popup = 
function(skip) {
	this._rules = AjxDispatcher.run("GetFilterRules");
	var callback = new AjxCallback(this, this._handleResponseLoadRules);
	this._rules.loadRules(true, callback); // make sure rules are loaded (for when we save)
	if (skip || this._isNewCondition(this._getActivityStreamRule())) {	
		DwtDialog.prototype.popup.call(this);
	}
};

/**
 * sets form fields
 * @param item  {ZmMailMsg} mail message
 */
ZmActivityStreamPromptDialog.prototype.setFields = 
function(item) {
	this._subject = item.subject;
	var msg = item.type == ZmId.ITEM_CONV ? item.getFirstHotMsg() : item;
	if (msg) {
		this._from = msg.getMsgSender();
	}
	else if (item.participants) {
		var arr = item.participants.getArray();
		for (var i=0; i<arr.length; i++) {
			if (arr[i].getType() == "FROM") {
				this._from = arr[i].getAddress();
			}
		}
	}


	var arr = msg._addrs && msg._addrs["TO"] && msg._addrs["TO"].getArray();
    this._to = (arr.length == 1) ? arr[0].getAddress() : "";

	if (this._subject) {
		var subjectField = this._activityStreamForm.getControl("CONTAINS");
		subjectField.setValue(this._subject);
	}
	
	if (this._from) {
		var fromField = this._activityStreamForm.getControl("FROM");
		fromField.setValue(this._from);
	}
    var toField = this._activityStreamForm.getControl("TO");
	toField.setValue(this._to);

};

ZmActivityStreamPromptDialog.prototype._saveListener =
function() {
	var foundCondition = this._setConditions(this._activityRule);		
	if (foundCondition) {
		this._rules.saveRules(null, true);
	}
	this.popdown();
};

ZmActivityStreamPromptDialog.prototype._setConditions = 
function(rule) {
	var received = this._activityStreamForm.getControl("RECEIVED");
    var sentto = this._activityStreamForm.getControl("SENTTO");
	var subject = this._activityStreamForm.getControl("SUBJECT");
	var foundCondition = false;
	
	if (received && received.isSelected() && rule) {
		var from = this._activityStreamForm.getControl("FROM");
		if (from) {
			rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, from.getValue(), ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_FROM]);
			foundCondition = true;
		}
	}

    if (sentto && sentto.isSelected() && rule) {
		var to = this._activityStreamForm.getControl("TO");
		if (to) {
			rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, to.getValue(), ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO]);
			foundCondition = true;
		}
	}
		
	if (subject && subject.isSelected() && rule) {
		var contains = this._activityStreamForm.getControl("CONTAINS");
		if (contains) {
			rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, contains.getValue(), ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT]);
			foundCondition = true;
		}
	}
	
	return foundCondition;
};

ZmActivityStreamPromptDialog.prototype._advancedListener =
function() {
	this.popdown(); //popdown existing 
	var filterRuleDialog = appCtxt.getFilterRuleDialog();
	this._setConditions(this._activityRule);
	filterRuleDialog.popup(this._activityRule, true);
};

/**
 * Determine if user has already created an activity stream condition with subject or email value.
 * @param  activityRule {ZmFilterRule} the activity stream rule to determine if condition already exists
 * @return {boolean} true this is a new condition or false condition with subject or email exists
 */
ZmActivityStreamPromptDialog.prototype._isNewCondition =
function(activityRule) {
	var newCondition = activityRule ? true : false;   //if we don't have an activity rule don't prompt user
	var conditionData = {};
	var header = "";
	var contains = -1;
	if (this._subject && activityRule) {
		var headerTest = activityRule.conditions[ZmFilterRule.TEST_HEADER] || [];
		for (var i=0; i<headerTest.length && newCondition; i++) {
			conditionData = headerTest[i];
			header = conditionData.header;
			contains = conditionData.value ? this._subject.indexOf(conditionData.value) : -1;		
			newCondition = !(header == ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT] && contains != -1);    
		}
	}
	
	if (this._from && activityRule && newCondition) {
		var addressTest = activityRule.conditions[ZmFilterRule.TEST_ADDRESS] || [];
		for (var i=0; i<addressTest.length && newCondition; i++) {
			conditionData = addressTest[i];
			header = conditionData.header;
			contains = conditionData.value ? this._from.indexOf(conditionData.value) : -1;
			newCondition = !(header == ZmFilterRule.C_FROM.toLowerCase() && contains != -1); 
		}
	}
	
	return newCondition;
};

ZmActivityStreamPromptDialog.prototype._getActivityStreamRule = 
function() {
	return this._activityStreamRule || this._rules.getRuleByName(ZmMsg.activityStreamsRule);	
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmActivityToInboxPromptDialog")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

ZmActivityToInboxPromptDialog = function () {
	var extraButtons = new DwtDialog_ButtonDescriptor(ZmActivityToInboxPromptDialog.ADD_ADVANCED_BUTTON, ZmMsg.advanced, DwtDialog.ALIGN_LEFT);
	DwtDialog.call(this, {parent:appCtxt.getShell(), className:"ZmActivityToInboxPromptDialog", title:ZmMsg.activityStreamExceptionsTitle,
		standardButtons:[DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON], extraButtons:[extraButtons]});
	// set content
	this.setContent(this._contentHtml());
	this._initialize();

	var okButton = this.getButton(DwtDialog.OK_BUTTON);
	okButton.setText(ZmMsg.save);
	this.setButtonListener(DwtDialog.OK_BUTTON, this._saveListener.bind(this));

	var advancedButton = this.getButton(ZmActivityToInboxPromptDialog.ADD_ADVANCED_BUTTON);
	this.setButtonListener(ZmActivityToInboxPromptDialog.ADD_ADVANCED_BUTTON, this._advancedListener.bind(this));
};

ZmActivityToInboxPromptDialog.prototype = new DwtDialog;
ZmActivityToInboxPromptDialog.prototype.constructor = ZmActivityToInboxPromptDialog;
ZmActivityToInboxPromptDialog.ADD_ADVANCED_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmActivityToInboxPromptDialog.prototype._contentHtml =
function () {
	return "<div style='width: 400px' id='ACTIVITYTOINBOX_PROMPT_FORM'>" + ZmMsg.activityStreamToInboxPrompt + "</div>";
};

ZmActivityToInboxPromptDialog.prototype._initialize =
function () {
	var params = {};
	params.parent = this;
	params.template = "prefs.Pages#ActivityStreamPrompt";
	params.form = {
		items:[
			{ id:"SENTTO", type:"DwtCheckbox", label:ZmMsg.to + ":", value:"to"},
			{ id:"TO", type:"DwtInputField", value:"", cols:30},
			{ id:"RECEIVED", type:"DwtCheckbox", label:ZmMsg.receivedFrom, value:"received"},
			{ id:"FROM", type:"DwtInputField", value:"", cols:30},
			{ id:"SUBJECT", type:"DwtCheckbox", label:ZmMsg.subjectContains, value:"subject"},
			{ id:"CONTAINS", type:"DwtInputField", value:"", cols:30}
		]
	};
	this._activityStreamForm = new DwtForm(params);
	var activityStreamForm = document.getElementById("ACTIVITYTOINBOX_PROMPT_FORM");
	this._activityStreamForm.appendElement(activityStreamForm);
	this._activityStreamForm.getControl("SUBJECT").setSelected(false);
};

ZmActivityToInboxPromptDialog.prototype._handleResponseLoadRules =
function () {
	this._activityExceptionsRule = this._rules.getRuleByName(ZmMsg.activityStreamExceptionsRule);
	this._activityStreamRule = this._rules.getRuleByName(ZmMsg.activityStreamsRule);
	if (!this._activityExceptionsRule) {
		this._ruleExists = false;
		this._activityExceptionsRule = new ZmFilterRule(ZmMsg.activityStreamExceptionsRule, true, {}, {});
		this._activityExceptionsRule.addAction(ZmFilterRule.A_KEEP);
		this._activityExceptionsRule.addAction(ZmFilterRule.A_STOP);
		this._activityExceptionsRule.setGroupOp(ZmFilterRule.GROUP_ANY);
	}
	else {
		this._ruleExists = true;
	}
};

/**
 * Checks to see if new condition is being added before popping up dialog
 * @param skip {Boolean} true to skip new condition check
 */
ZmActivityToInboxPromptDialog.prototype.popup =
function (skip) {
	this._rules = AjxDispatcher.run("GetFilterRules");
	var callback = new AjxCallback(this, this._handleResponseLoadRules);
	this._rules.loadRules(true, callback); // make sure rules are loaded (for when we save)
	if (skip || this._isNewCondition(this._getActivityStreamExceptionRule())) {
		DwtDialog.prototype.popup.call(this);
	}
};

/**
 * sets form fields
 * @param item  {ZmMailMsg} mail message
 */
ZmActivityToInboxPromptDialog.prototype.setFields =
function (item) {
	this._subject = item.subject;
	var msg = item.type == ZmId.ITEM_CONV ? item.getFirstHotMsg() : item;
	if (msg) {
		this._from = msg.getMsgSender();
	}
	else if (item.participants) {
		var arr = item.participants.getArray();
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].getType() == "FROM") {
				this._from = arr[i].getAddress();
			}
		}
	}

	var arr = msg._addrs && msg._addrs["TO"] && msg._addrs["TO"].getArray();
	this._to = (arr.length == 1) ? arr[0].getAddress() : "";

	if (this._subject) {
		var subjectField = this._activityStreamForm.getControl("CONTAINS");
		subjectField.setValue(this._subject);
	}

	if (this._from) {
		var fromField = this._activityStreamForm.getControl("FROM");
		fromField.setValue(this._from);
	}
	var toField = this._activityStreamForm.getControl("TO");
	toField.setValue(this._to);

};

ZmActivityToInboxPromptDialog.prototype._saveListener =
function () {
	var foundCondition = this._setConditions(this._activityExceptionsRule);
	if (foundCondition) {
		if (!this._ruleExists) {
			var index = this._rules.getIndexOfRule(this._activityStreamRule);
			index = index > 0 ? index -1 : 0;
			this._rules.insertRule(this._activityExceptionsRule, index); //insert before activity stream rule
			this._ruleExists = true;
		}
		this._rules.saveRules(null, true);
	}
	this.popdown();
};

ZmActivityToInboxPromptDialog.prototype._setConditions =
function (rule) {
	var received = this._activityStreamForm.getControl("RECEIVED");
	var sentto = this._activityStreamForm.getControl("SENTTO");
	var subject = this._activityStreamForm.getControl("SUBJECT");
	var foundCondition = false;

	if (received && received.isSelected() && rule) {
		var from = this._activityStreamForm.getControl("FROM");
		if (from) {
			rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS,
					from.getValue(), ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_FROM]);
			foundCondition = true;
		}
	}

	if (sentto && sentto.isSelected() && rule) {
		var to = this._activityStreamForm.getControl("TO");
		if (to) {
			rule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS,
					to.getValue(), ZmFilterRule.C_ADDRESS_VALUE[ZmFilterRule.C_TO]);
			foundCondition = true;
		}
	}

	if (subject && subject.isSelected() && rule) {
		var contains = this._activityStreamForm.getControl("CONTAINS");
		if (contains) {
			rule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS,
					contains.getValue(), ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT]);
			foundCondition = true;
		}
	}

	return foundCondition;
};

ZmActivityToInboxPromptDialog.prototype._advancedListener =
function () {
	this.popdown(); //popdown existing 
	var filterRuleDialog = appCtxt.getFilterRuleDialog();
	this._setConditions(this._activityExceptionsRule);
	filterRuleDialog.popup(this._activityExceptionsRule, this._ruleExists);
};

/**
 * Determine if user has already created an activity stream condition with subject or email value.
 * @param  activityRule {ZmFilterRule} the activity stream rule to determine if condition already exists
 * @return {boolean} true this is a new condition or false condition with subject or email exists
 */
ZmActivityToInboxPromptDialog.prototype._isNewCondition =
function (activityRule) {
	var newCondition = activityRule ? true : false;   //if we don't have an activity rule don't prompt user
	var conditionData = {};
	var header = "";
	var contains = -1;
	if (this._subject && activityRule) {
		var headerTest = activityRule.conditions[ZmFilterRule.TEST_HEADER] || [];
		for (var i = 0; i < headerTest.length && newCondition; i++) {
			conditionData = headerTest[i];
			header = conditionData.header;
			contains = conditionData.value ? this._subject.indexOf(conditionData.value) : -1;
			newCondition = !(header == ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT] && contains != -1);
		}
	}

	if (this._from && activityRule && newCondition) {
		var addressTest = activityRule.conditions[ZmFilterRule.TEST_ADDRESS] || [];
		for (var i = 0; i < addressTest.length && newCondition; i++) {
			conditionData = addressTest[i];
			header = conditionData.header;
			contains = conditionData.value ? this._from.indexOf(conditionData.value) : -1;
			newCondition = !(header == ZmFilterRule.C_FROM.toLowerCase() && contains != -1);
		}
	}

	return newCondition;
};

ZmActivityToInboxPromptDialog.prototype._getActivityStreamExceptionRule =
function () {
	return this._activityExceptionsRule || this._rules.getRuleByName(ZmMsg.activityStreamExceptionsRule);
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmOneTimeCodesDialog")) {
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
 * Creates a dialog for
 * @constructor
 * @class
 * @author  Hem Aravind
 *
 * @extends	DwtDialog
 */
ZmOneTimeCodesDialog = function(params) {
	this.twoStepAuthCodesSpan = params.twoStepAuthCodesSpan;
	this.twoStepAuthCodesViewLink = params.twoStepAuthCodesViewLink;
	this.twoStepAuthCodesGenerateLink = params.twoStepAuthCodesGenerateLink;
	var generateNewCodesButton = new DwtDialog_ButtonDescriptor(ZmOneTimeCodesDialog.GENERATE_NEW_CODES_BUTTON, ZmMsg.twoStepAuthGenerateNewCodes, DwtDialog.ALIGN_LEFT, this._getScratchCodes.bind(this, true));
	var printButton = new DwtDialog_ButtonDescriptor(ZmOneTimeCodesDialog.PRINT_BUTTON, ZmMsg.print, DwtDialog.ALIGN_RIGHT, this._printListener.bind(this));
	var closeButton = new DwtDialog_ButtonDescriptor(DwtDialog.DISMISS_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT, this.popdown.bind(this));
	var newParams = {
		parent : appCtxt.getShell(),
		title : ZmMsg.twoStepAuthOneTimeCodesTitle,
		standardButtons: [DwtDialog.NO_BUTTONS],
		extraButtons : [generateNewCodesButton, printButton, closeButton]
	};
	DwtDialog.call(this, newParams);
	this.setContent(this._contentHtml());
	this._setAllowSelection();
};

ZmOneTimeCodesDialog.prototype = new DwtDialog;
ZmOneTimeCodesDialog.prototype.constructor = ZmOneTimeCodesDialog;

ZmOneTimeCodesDialog.GENERATE_NEW_CODES_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmOneTimeCodesDialog.PRINT_BUTTON = ++DwtDialog.LAST_BUTTON;

/**
 * Pops-up the dialog.
 */
ZmOneTimeCodesDialog.prototype.popup =
function() {
	this._getScratchCodes();
	DwtDialog.prototype.popup.call(this);
};

ZmOneTimeCodesDialog.prototype._getScratchCodes =
function(isNew) {
	var params = {
		twoStepAuthCodesSpan : this.twoStepAuthCodesSpan,
		twoStepAuthCodesViewLink : this.twoStepAuthCodesViewLink,
		twoStepAuthCodesGenerateLink : this.twoStepAuthCodesGenerateLink
	};
	var callback = this._getScratchCodesCallback.bind(this);
	ZmAccountsPage.getScratchCodes(isNew, params, callback);
};

ZmOneTimeCodesDialog.prototype._getScratchCodesCallback =
function(scratchCode) {
	this.setContent(this._contentHtml(scratchCode));
};

ZmOneTimeCodesDialog.prototype._printListener =
function() {
	var content = AjxTemplate.expand("prefs.Pages#OneTimeCodesPrint", {content : this._getContentDiv().innerHTML});
	var win = window.open('', '_blank');
	appCtxt.handlePopupBlocker(win);
	win.document.write(content);
	win.document.close();
	win.focus();
	win.print();
};

ZmOneTimeCodesDialog.prototype._contentHtml =
function(oneTimeCodes) {
	var data = {
		id : this._htmlElId,
		oneTimeCodes : oneTimeCodes
	};
	return AjxTemplate.expand("prefs.Pages#OneTimeCodes", data);
};
}
if (AjxPackage.define("zimbraMail.prefs.view.ZmApplicationCodeDialog")) {
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
 * Created by administrator on 29/05/15.
 */

/**
 * Creates a application code dialog.
 * @constructor
 * @class
 * @author  Hem Aravind
 *
 * @extends	DwtDialog
 */
ZmApplicationCodeDialog = function(appPasscodeCallback) {
	var nextButton = new DwtDialog_ButtonDescriptor(ZmApplicationCodeDialog.NEXT_BUTTON, ZmMsg.next, DwtDialog.ALIGN_RIGHT, this._nextButtonListener.bind(this));
	var cancelButton = new DwtDialog_ButtonDescriptor(ZmApplicationCodeDialog.CANCEL_BUTTON, ZmMsg.cancel, DwtDialog.ALIGN_RIGHT, this._cancelButtonListener.bind(this));
	var params = {
		parent : appCtxt.getShell(),
		title : ZmMsg.twoStepAuthAddAppCode,
		standardButtons : [DwtDialog.NO_BUTTONS],
		extraButtons : [nextButton, cancelButton]
	};
	DwtDialog.call(this, params);
	this.setContent(this._contentHtml());
	this._createControls();
	this._setAllowSelection();
	this.appPasscodeCallback = appPasscodeCallback;
};

ZmApplicationCodeDialog.prototype = new DwtDialog;
ZmApplicationCodeDialog.prototype.constructor = ZmApplicationCodeDialog;

ZmApplicationCodeDialog.NEXT_BUTTON = ++DwtDialog.LAST_BUTTON;
ZmApplicationCodeDialog.CANCEL_BUTTON = ++DwtDialog.LAST_BUTTON;

ZmApplicationCodeDialog.prototype._nextButtonListener =
function() {
	this.setButtonEnabled(ZmApplicationCodeDialog.NEXT_BUTTON, false);
	var appName = this._appNameInput.value;
	var callback = this._handleAppSpecificPassword.bind(this, appName);
	var errorCallback = this._handleAppSpecificPasswordError.bind(this, appName);
	this._createAppSpecificPassword(appName, callback, errorCallback);
};

ZmApplicationCodeDialog.prototype._cancelButtonListener =
function() {
	this.popdown();
};

ZmApplicationCodeDialog.prototype._contentHtml =
function() {
	var id = this._htmlElId;
	this._appName = id + "_app_name";
	this._appPassCode = id + "_app_passcode";
	this._appPassCodeValue = id + "_app_passcode_value";
	return AjxTemplate.expand("prefs.Pages#AddApplicationCode", {id : id});
};

ZmApplicationCodeDialog.prototype._createControls =
function() {
	var id = this._htmlElId;
	this.setButtonEnabled(ZmApplicationCodeDialog.NEXT_BUTTON, false);
	this._appNameInput = Dwt.getElement(id + "_app_name_input");
	Dwt.setHandler(this._appNameInput, DwtEvent.ONKEYUP, this._handleKeyUp.bind(this));
	this._appNameError = Dwt.getElement(id + "_app_name_error");
};

ZmApplicationCodeDialog.prototype._handleKeyUp =
function(ev) {
	var value = ev && ev.target && ev.target.value && ev.target.value.length;
	this.setButtonEnabled(ZmApplicationCodeDialog.NEXT_BUTTON, !!value);
};

/**
 ** an array of input fields that will be cleaned up between instances of the dialog being popped up and down
 *
 * @return An array of the input fields to be reset
 */
ZmApplicationCodeDialog.prototype._getInputFields =
function() {
	return [this._appNameInput];
};

/**
 * Pops-up the dialog.
 */
ZmApplicationCodeDialog.prototype.popup =
function() {
	this.reset();
	DwtDialog.prototype.popup.call(this);
	this._appNameInput.focus();
};

/**
 * Resets the dialog back to its original state.
 */
ZmApplicationCodeDialog.prototype.reset =
function() {
	Dwt.show(this._appName);
	Dwt.setInnerHtml(this._appNameError, "");
	Dwt.hide(this._appPassCode);
	DwtDialog.prototype.reset.call(this);
	this.setButtonEnabled(ZmApplicationCodeDialog.NEXT_BUTTON, false);
	this.setButtonVisible(ZmApplicationCodeDialog.NEXT_BUTTON, true);
	this.getButton(ZmApplicationCodeDialog.CANCEL_BUTTON).setText(ZmMsg.cancel);
};

ZmApplicationCodeDialog.prototype._createAppSpecificPassword =
function(appName, callback, errorCallback) {
	var jsonObj = {CreateAppSpecificPasswordRequest : {_jsns:"urn:zimbraAccount", appName:{_content : appName}}};
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:callback, errorCallback:errorCallback});
};

ZmApplicationCodeDialog.prototype._handleAppSpecificPassword =
function(appName, result) {
	var response = result.getResponse();
	if (!response || !response.CreateAppSpecificPasswordResponse) {
		this._handleAppSpecificPasswordError(appName);
		return;
	}
	Dwt.hide(this._appName);
	Dwt.setInnerHtml(Dwt.getElement(this._appPassCodeValue), response.CreateAppSpecificPasswordResponse.pw);
	Dwt.show(this._appPassCode);
	this.setButtonVisible(ZmApplicationCodeDialog.NEXT_BUTTON, false);
	this.getButton(ZmApplicationCodeDialog.CANCEL_BUTTON).setText(ZmMsg.close);
	this.appPasscodeCallback && this.appPasscodeCallback();
};

ZmApplicationCodeDialog.prototype._handleAppSpecificPasswordError =
function(appName, exception) {
	var errorMsg;
	if (exception) {
		if (exception.msg === "system failure: app-specific password already exists for the name " + appName) {
			errorMsg = ZmMsg.twoStepAuthAppNameError1;
		} else if (exception.msg === "system failure: app-specific password limit reached") {
			errorMsg = ZmMsg.twoStepAuthAppNameError3;
		} else {
			errorMsg = exception.getErrorMsg();
		}
	}
	else {
		errorMsg = ZmMsg.twoStepAuthAppNameError2;
	}
	Dwt.setInnerHtml(this._appNameError, errorMsg);
	this._appNameInput.focus();
	this.setButtonEnabled(ZmApplicationCodeDialog.NEXT_BUTTON, true);
	return true;
};
}

if (AjxPackage.define("zimbraMail.calendar.view.ZmCalendarPrefsPage")) {
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
 * Creates a preferences page for managing calendar prefs
 * @constructor
 * @class
 * This class adds specialized handling for managing calendar ACLs that control whether
 * events can be added to the user's calendar, and who can see the user's free/busy info.
 *
 * @author Conrad Damon
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {Object}	section			which page we are
 * @param {ZmPrefController}	controller		the prefs controller
 * 
 * @extends		ZmPreferencesPage
 * 
 * @private
 */

ZmCalendarPrefsPage = function(parent, section, controller) {

	ZmPreferencesPage.apply(this, arguments);

	ZmCalendarPrefsPage.TEXTAREA = {};
	ZmCalendarPrefsPage.TEXTAREA[ZmSetting.CAL_FREE_BUSY_ACL]	= ZmSetting.CAL_FREE_BUSY_ACL_USERS;
	ZmCalendarPrefsPage.TEXTAREA[ZmSetting.CAL_INVITE_ACL]		= ZmSetting.CAL_INVITE_ACL_USERS;
	ZmCalendarPrefsPage.SETTINGS	= [ZmSetting.CAL_FREE_BUSY_ACL, ZmSetting.CAL_INVITE_ACL];
	ZmCalendarPrefsPage.RIGHTS		= [ZmSetting.RIGHT_VIEW_FREE_BUSY, ZmSetting.RIGHT_INVITE];

	this._currentSelection = {};
	this._initAutocomplete();
};

ZmCalendarPrefsPage.prototype = new ZmPreferencesPage;
ZmCalendarPrefsPage.prototype.constructor = ZmCalendarPrefsPage;

ZmCalendarPrefsPage.prototype.isZmCalendarPrefsPage = true;
ZmCalendarPrefsPage.prototype.toString = function() { return "ZmCalendarPrefsPage"; };

ZmCalendarPrefsPage.prototype.reset =
function(useDefaults) {
	ZmPreferencesPage.prototype.reset.apply(this, arguments);
	var settings = ZmCalendarPrefsPage.SETTINGS;
	for (var i = 0; i < settings.length; i++) {
		this._checkPermTextarea(settings[i]);
    }
    if(this._workHoursControl) {
        this._workHoursControl.reset();
    }
};

ZmCalendarPrefsPage.prototype.showMe =
function() {
	this._acl = appCtxt.getACL();
	if (this._acl && !this._acl._loaded) {
		var respCallback = this._doShowMe.bind(this);
		this._acl.load(respCallback);
	} else {
		this._doShowMe();
	}
};

ZmCalendarPrefsPage.prototype._doShowMe =
function() {
	var settings = ZmCalendarPrefsPage.SETTINGS;
	var rights = ZmCalendarPrefsPage.RIGHTS;
	for (var i = 0; i < settings.length; i++) {
		this._setACLValues(settings[i], rights[i]);
	}

	var active = appCtxt.getActiveAccount();
	this._isAclSupported = !appCtxt.multiAccounts || appCtxt.isFamilyMbox || (!active.isMain && active.isZimbraAccount);

	ZmPreferencesPage.prototype.showMe.call(this);
};

ZmCalendarPrefsPage.prototype._setupCustom = function (id, setup, value) {
    switch(id) {
        case "CAL_WORKING_HOURS":
            var el = document.getElementById([this._htmlElId, id].join("_"));
            if(el) {
                this._workHoursControl = new ZmWorkHours(this, id, value, "WorkHours");
                this._workHoursControl.reparentHtmlElement(el);
            }
            this.setFormObject(id, this._workHoursControl);
            break;
    }
    
};

ZmCalendarPrefsPage.prototype._getTemplateData =
function() {
	var data = ZmPreferencesPage.prototype._getTemplateData.call(this);
	data.domain = appCtxt.getUserDomain();
	data.isAclSupported = this._isAclSupported;

	return data;
};

ZmCalendarPrefsPage.prototype._createControls =
function() {
	ZmPreferencesPage.prototype._createControls.apply(this, arguments);

	var settings = ZmCalendarPrefsPage.SETTINGS;

	for (var i = 0; i < settings.length; i++) {
		var textarea = this.getFormObject(ZmCalendarPrefsPage.TEXTAREA[settings[i]]);
		if (textarea && this._acList) {
			this._acList.handle(textarea.getInputElement());
			this._checkPermTextarea(settings[i]);
		}
	}
};

// Sets values for calendar ACL-related settings.
ZmCalendarPrefsPage.prototype._setACLValues =
function(setting, right) {
	var gt = this._acl.getGranteeType(right);
	this._currentSelection[setting] = gt;

	appCtxt.set(setting, gt);
	var list = this._acl.getGrantees(right);
	var textDisplay = list.join("\n");
	appCtxt.set(ZmCalendarPrefsPage.TEXTAREA[setting], textDisplay);

	this._acl.getGranteeType(right);
	// Set up the preference initial value (derived from ACL data) so that the
	// pref is not incorrectly detected as dirty in the _checkSection call.
	var pref = appCtxt.getSettings().getSetting(setting);
	pref.origValue = this._currentSelection[setting];
	pref = appCtxt.getSettings().getSetting(ZmCalendarPrefsPage.TEXTAREA[setting]);
	pref.origValue = textDisplay;
};

/**
 * ZmPrefView.getChangedPrefs() doesn't quite work for performing a dirty check on this page since
 * it only returns true if a changed setting is stored in LDAP (has a 'name' property in its ZmSetting
 * object). This override checks the ACL-related settings to see if they changed.
 */
ZmCalendarPrefsPage.prototype.isDirty =
function(section, list, errors) {
	var dirty = this._controller.getPrefsView()._checkSection(section, this, true, true, list, errors);
    if(!dirty && this._workHoursControl) {
        dirty = this._workHoursControl.isDirty();
    }
	if (!dirty && this._isAclSupported) {
		this._findACLChanges();
		dirty = (this._grants.length || this._revokes.length);
	}
	return dirty;
};

ZmCalendarPrefsPage.prototype._checkPermTextarea =
function(setting) {
	var radioGroup = this.getFormObject(setting);
	var val = radioGroup && radioGroup.getValue();
	var textarea = this.getFormObject(ZmCalendarPrefsPage.TEXTAREA[setting]);
	if (textarea && val) {
		textarea.setEnabled(val == ZmSetting.ACL_USER);
	}
};

ZmCalendarPrefsPage.prototype._setupRadioGroup =
function(id, setup, value) {
	var control = ZmPreferencesPage.prototype._setupRadioGroup.apply(this, arguments);
	var radioGroup = this.getFormObject(id);
	if (id == ZmSetting.CAL_FREE_BUSY_ACL || id == ZmSetting.CAL_INVITE_ACL) {
		radioGroup.addSelectionListener(new AjxListener(this, this._checkPermTextarea, [id]));
	}
	return control;
};

ZmCalendarPrefsPage.prototype.getPreSaveCallback =
function() {
	return new AjxCallback(this, this._preSave);
};

ZmCalendarPrefsPage.prototype.getPostSaveCallback =
function() {
	return new AjxCallback(this, this._postSave);
};

ZmCalendarPrefsPage.prototype._postSave =
function(callback) {
    var settings = appCtxt.getSettings();
    var workHoursSetting = settings.getSetting(ZmSetting.CAL_WORKING_HOURS);
    workHoursSetting._notify(ZmEvent.E_MODIFY);
	if (this._workHoursControl) {
		this._workHoursControl.reloadWorkHours(this._workHoursControl.getValue());
	}

    /**
     * Post save, restore the value of pref zimbraPrefCalendarApptReminderWarningTimevalue
     * for 'never' and 'at time of event'. In function ZmCalendarApp.setDefaultReminderTimePrefValueOnSave,
     * if the user has chosen 'never' or 'at time of event' option in default reminder select option,
     * then on save we make value of never to 0 and 'at time of event' to -1, we are undoing that change here.
     **/

    var defaultWarningTime = settings.getSetting(ZmSetting.CAL_REMINDER_WARNING_TIME).getValue();
    if (defaultWarningTime === -1 || defaultWarningTime === 0) { // never or 'at time of event' was chosen in defaultreminderpref dropdown
        defaultWarningTime === -1 ? (defaultWarningTime = 0) : (defaultWarningTime = -1);
        settings.getSetting(ZmSetting.CAL_REMINDER_WARNING_TIME).setValue(defaultWarningTime);
        appCtxt.getSettings().getSetting('CAL_REMINDER_WARNING_TIME').origValue = defaultWarningTime;
    }
    if (callback instanceof AjxCallback) {
		callback.run();
	}
};

ZmCalendarPrefsPage.prototype._preSave =
function(callback) {
	if (this._isAclSupported) {
		this._findACLChanges();
	}
	if (callback) {
		callback.run();
	}
};

ZmCalendarPrefsPage.prototype._findACLChanges =
function() {
	var settings = ZmCalendarPrefsPage.SETTINGS;
	var rights = ZmCalendarPrefsPage.RIGHTS;
	this._grants = [];
	this._revokes = [];
	for (var i = 0; i < settings.length; i++) {
		var result = this._getACLChanges(settings[i], rights[i]);
		this._grants = this._grants.concat(result.grants);
		this._revokes = this._revokes.concat(result.revokes);
	}
};

ZmCalendarPrefsPage.prototype._getACLChanges =
function(setting, right) {

	var curType = appCtxt.get(setting);
	var curUsers = (curType == ZmSetting.ACL_USER) ? this._acl.getGrantees(right) : [];
	var curUsersInfo = (curType == ZmSetting.ACL_USER) ? this._acl.getGranteesInfo(right) : [];
	var zidHash = {};
	for (var i = 0; i < curUsersInfo.length; i++) {
		zidHash[curUsersInfo[i].grantee] = curUsersInfo[i].zid;
	}
	var curHash = AjxUtil.arrayAsHash(curUsers);

	var radioGroup = this.getFormObject(setting);
		var newType = radioGroup.getValue();
	var radioGroupChanged = (newType != this._currentSelection[setting]);

	var newUsers = [];
	if (newType == ZmSetting.ACL_USER) {
		var textarea = this.getFormObject(ZmCalendarPrefsPage.TEXTAREA[setting]);
		var val = textarea.getValue();
		var users = val.split(/[\n,;]/);
		for (var i = 0; i < users.length; i++) {
			var user = AjxStringUtil.trim(users[i]);
			if (!user) { continue; }
			if (zidHash[user] != user) {
				user = (user.indexOf('@') == -1) ? [user, appCtxt.getUserDomain()].join('@') : user;
			}
			newUsers.push(user);
		}
		newUsers.sort();
	}

	var newHash = AjxUtil.arrayAsHash(newUsers);

	var contacts = AjxDispatcher.run("GetContacts");
	var grants = [];
	var revokes = [];
	if (newUsers.length > 0) {
		for (var i = 0; i < newUsers.length; i++) {
			var user = newUsers[i];
			if (!curHash[user]) {
				var contact = contacts.getContactByEmail(user);
				var gt = (contact && contact.isGroup()) ? ZmSetting.ACL_GROUP : ZmSetting.ACL_USER;
				var ace = new ZmAccessControlEntry({grantee:user, granteeType:gt, right:right});
				grants.push(ace);
			}
		}
	}
	if (curUsers.length > 0) {
		for (var i = 0; i < curUsers.length; i++) {
			var user = curUsers[i];
			var zid = (curUsersInfo[i]) ? curUsersInfo[i].zid : null;
			if (!newHash[user]) {
				var contact = contacts.getContactByEmail(user);
				var gt = (contact && contact.isGroup()) ? ZmSetting.ACL_GROUP : ZmSetting.ACL_USER;
				var ace = new ZmAccessControlEntry({grantee: (user!=zid) ? user : null, granteeType:gt, right:right, zid: zid});
				revokes.push(ace);
			}
		}
	}

	var userAdded = (grants.length > 0);
	var userRemoved = (revokes.length > 0);

	var denyAll = (radioGroupChanged && (newType == ZmSetting.ACL_NONE));

	if ((newType == ZmSetting.ACL_USER) && (userAdded || userRemoved || radioGroupChanged)) {
        revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_DOMAIN));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_AUTH));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_PUBLIC));
		
		if (newUsers.length == 0) {
			denyAll = true;
		}
	}

	// deny all
	if (denyAll) {
		revokes = [];
		grants = [];

        revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_DOMAIN));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_USER));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_GROUP));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_PUBLIC));

		//deny all
		var ace = new ZmAccessControlEntry({granteeType: ZmSetting.ACL_AUTH, right:right, negative: true});
		grants.push(ace);
	}

	//allow all users
	if (radioGroupChanged && (newType == ZmSetting.ACL_PUBLIC)) {
		grants = [];
		revokes = [];

		//grant all
		var ace = new ZmAccessControlEntry({granteeType: ZmSetting.ACL_PUBLIC, right:right});
		grants.push(ace);

		//revoke all other aces
		revokes = this._acl.getACLByGranteeType(right, ZmSetting.ACL_USER);
        revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_DOMAIN));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_GROUP));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_AUTH));
	}

	if (radioGroupChanged && (newType == ZmSetting.ACL_AUTH)) {
		grants = [];
		revokes = [];

		//grant all
		var ace = new ZmAccessControlEntry({granteeType: ZmSetting.ACL_AUTH, right:right});
		grants.push(ace);

		//revoke all other aces
		revokes = this._acl.getACLByGranteeType(right, ZmSetting.ACL_USER);
        revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_DOMAIN));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_GROUP));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_PUBLIC));
	}

    if (radioGroupChanged && (newType == ZmSetting.ACL_DOMAIN)) {
		grants = [];
		revokes = [];

		//grant all
		var ace = new ZmAccessControlEntry({granteeType: ZmSetting.ACL_DOMAIN, right:right, grantee:appCtxt.getUserDomain()});
		grants.push(ace);

		//revoke all other aces
		revokes = this._acl.getACLByGranteeType(right, ZmSetting.ACL_USER);
        revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_GROUP));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_AUTH));
		revokes = revokes.concat(this._acl.getACLByGranteeType(right, ZmSetting.ACL_PUBLIC));
	}

	return {grants:grants, revokes:revokes};
};

ZmCalendarPrefsPage.prototype.addCommand =
function(batchCmd) {
    if (this._isAclSupported) {
        var respCallback = new AjxCallback(this, this._handleResponseACLChange);
        if (this._revokes.length) {
            this._acl.revoke(this._revokes, respCallback, batchCmd);
        }
        if (this._grants.length) {
            this._acl.grant(this._grants, respCallback, batchCmd);
        }
    }

	var workHoursControl = this._workHoursControl;
    if(workHoursControl) {
        if(workHoursControl.isValid() && workHoursControl.isDirty()) {
            var value = this._workHoursControl.getValue(),
                    soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount"),
                    node = soapDoc.set("pref", value),
                    respCallback = new AjxCallback(this, this._postSaveBatchCmd, [value]);
            node.setAttribute("name", "zimbraPrefCalendarWorkingHours");
            batchCmd.addNewRequestParams(soapDoc, respCallback);
        }
        if (!workHoursControl.isValid()) {
            throw new AjxException(ZmMsg.calendarWorkHoursInvalid);
        }
    }
};

ZmCalendarPrefsPage.prototype._postSaveBatchCmd =
function(value) {
    appCtxt.set(ZmSetting.CAL_WORKING_HOURS, value);
    var firstDayOfWeek = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;

    if(this._workHoursControl) {
        // Check if either work days have changed or first day of week has changed.
        // Need to reload the browser either way to show the correct changes.
        if(this._workHoursControl.getDaysChanged() ||
                parseInt(this._workHoursControl._workDaysCheckBox[0].getValue()) != firstDayOfWeek) {
            this._workHoursControl.setDaysChanged(false);
            var cd = appCtxt.getYesNoMsgDialog();
            cd.reset();
            cd.registerCallback(DwtDialog.YES_BUTTON, this._newWorkHoursYesCallback, this, [skin, cd]);
            cd.setMessage(ZmMsg.workingDaysRestart, DwtMessageDialog.WARNING_STYLE);
            cd.popup();
        }
    }
};

ZmCalendarPrefsPage.prototype._newWorkHoursYesCallback =
function(skin, dialog) {
	dialog.popdown();
	window.onbeforeunload = null;
	var url = AjxUtil.formatUrl();
	DBG.println(AjxDebug.DBG1, "Working days change, redirect to: " + url);
	ZmZimbraMail.sendRedirect(url); // redirect to self to force reload
};

ZmCalendarPrefsPage.prototype._handleResponseACLChange =
function(aces) {
	if (aces && !(aces instanceof Array)) { aces = [aces]; }

	if (aces && aces.length) {
		for (var i = 0; i < aces.length; i++) {
			var ace = aces[i];
			var setting = (ace.right == ZmSetting.RIGHT_INVITE) ? ZmSetting.CAL_INVITE_ACL : ZmSetting.CAL_FREE_BUSY_ACL;
			this._setACLValues(setting, ace.right);
		}
	}
};

ZmCalendarPrefsPage.prototype._initAutocomplete =
function() {
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) && appCtxt.get(ZmSetting.GAL_AUTOCOMPLETE_ENABLED)) {
		var contactsClass = appCtxt.getApp(ZmApp.CONTACTS);
		var contactsLoader = contactsClass.getContactList;
		var params = {
			dataClass:	appCtxt.getAutocompleter(),
			separator:	";",
			matchValue:	ZmAutocomplete.AC_VALUE_EMAIL,
			options:	{galOnly:true},
			contextId:	this.toString()
		};
		this._acList = new ZmAutocompleteListView(params);
	}
};

/**
 * Creates the WorkHours custom control
 * 
 * @constructor
 * @param parent
 * @param id
 * @param value work hours string
 * @param templateId
 */
ZmWorkHours = function(parent, id, value, templateId) {
	DwtComposite.call(this, {parent:parent, id: Dwt.getNextId(id)});


    this._workDaysCheckBox = [];
    this._startTimeSelect = null;
    this._endTimeSelect = null;
    this._customDlg = null;
    this._customBtn = null;
    this.reloadWorkHours(value);
    this._radioNormal = null;
    this._radioCustom = null;
    this._daysChanged = false;
    this._setContent(templateId);
};

ZmWorkHours.STR_DAY_SEP = ",";
ZmWorkHours.STR_TIME_SEP = ":";

ZmWorkHours.prototype = new DwtComposite;
ZmWorkHours.prototype.constructor = ZmWorkHours;

ZmWorkHours.prototype.toString =
function() {
	return "ZmWorkHours";
};

ZmWorkHours.prototype.getTabGroup = ZmWorkHours.prototype.getTabGroupMember;

ZmWorkHours.prototype.reloadWorkHours =
function(value) {
    value = value || appCtxt.get(ZmSetting.CAL_WORKING_HOURS);
    var workHours = this._workHours = this.decodeWorkingHours(value),
        dayIdx = new Date().getDay();
    this._startTime = new Date();
    this._endTime = new Date();
    this._startTime.setHours(workHours[dayIdx].startTime/100, workHours[dayIdx].startTime%100, 0);
    this._endTime.setHours(workHours[dayIdx].endTime/100, workHours[dayIdx].endTime%100, 0);
    this._isCustom = this._isCustomTimeSet();
    if(this._customDlg) {
        this._customDlg.reloadWorkHours(workHours);
    }
};

ZmWorkHours.prototype.reset =
function() {
    if (!this.isDirty()) { return; }
    var i,
        workHours = this._workHours;

    this._startTimeSelect.set(this._startTime);
    this._endTimeSelect.set(this._endTime);

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        this._workDaysCheckBox[i].setSelected(workHours[i].isWorkingDay);
    }

	this._radioGroup.setSelectedId(this._isCustom ? this._radioCustomId : this._radioNormalId);

    // Reset the custom work hours dialog as well
    if (this._customDlg) {
        this._customDlg.reset();
    }
};

ZmWorkHours.prototype.isDirty =
function() {
	var i,
        isDirty = false,
        workHours = this._workHours,
        tf = new AjxDateFormat("HHmm"),
        startInputTime = tf.format(this._startTimeSelect.getValue()),
        endInputTime = tf.format(this._endTimeSelect.getValue()),
        isCustom = this._radioCustom.isSelected();


    if(!isCustom) {
        for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
            if(this._workDaysCheckBox[i].isSelected() != workHours[i].isWorkingDay) {
                this.setDaysChanged(true);
                isDirty = true;
                break;
            }
        }

        if(startInputTime != workHours[0].startTime || endInputTime != workHours[0].endTime) {
            isDirty = true;
        }
    }
    else if(this._customDlg) {
        isDirty = this._customDlg.isDirty();
    }

    if (!isCustom && this._isCustom) { //switching to normal should trigger dirty anyway.
        isDirty = true;
    }

	return isDirty;
};

ZmWorkHours.prototype.setDaysChanged =
function(value) {
    var isCustom = this._radioCustom.isSelected();
    if(isCustom && this._customDlg) {
        this._customDlg.setDaysChanged(value);
    }
    else {
        this._daysChanged = value;
    }
};

ZmWorkHours.prototype.getDaysChanged =
function() {
    var isCustom = this._radioCustom.isSelected();
    if(isCustom && this._customDlg) {
        return this._customDlg.getDaysChanged();
    }
    else {
        return this._daysChanged;
    }
};

ZmWorkHours.prototype.isValid =
function() {
    var tf = new AjxDateFormat("HHmm"),
        startInputTime = tf.format(this._startTimeSelect.getValue()),
        endInputTime = tf.format(this._endTimeSelect.getValue());
    if(this._radioCustom.isSelected() && this._customDlg) {
        return this._customDlg.isValid();        
    }
    return startInputTime < endInputTime ? true : false;
};

ZmWorkHours.prototype.decodeWorkingHours =
function(wHrsString) {
    if(wHrsString === 0) {
        return [];
    }
	var wHrsPerDay = wHrsString.split(ZmWorkHours.STR_DAY_SEP),
        i,
        wHrs = [],
        wDay,
        w,
        idx;

    for(i=0; i<wHrsPerDay.length; i++) {
        wDay = wHrsPerDay[i].split(ZmWorkHours.STR_TIME_SEP);
        w = {};
		w.dayOfWeek = wDay[0] - 1;
		w.isWorkingDay = (wDay[1] === "Y");
        w.startTime = wDay[2];
        w.endTime = wDay[3];

		wHrs[i] = w;
    }
    return wHrs;
};

ZmWorkHours.prototype.encodeWorkingHours =
function() {
    var i,
        tf = new AjxDateFormat("HHmm"),
        startInputTime = tf.format(this._startTimeSelect.getValue()),
        endInputTime = tf.format(this._endTimeSelect.getValue()),
        dayStr,
        wDaysStr = [];

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        dayStr = [];
		dayStr.push(parseInt(this._workDaysCheckBox[i].getValue()) + 1);
		if(this._workDaysCheckBox[i].isSelected()) {
            dayStr.push("Y");
        }
        else {
            dayStr.push("N");
        }
        dayStr.push(startInputTime);
        dayStr.push(endInputTime);
        wDaysStr.push(dayStr.join(ZmWorkHours.STR_TIME_SEP));
    }
    return wDaysStr.join(ZmWorkHours.STR_DAY_SEP);
};

ZmWorkHours.prototype._isCustomTimeSet =
function() {
    var i,
        w = this._workHours;
    for (i=1;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        if(w[i].startTime != w[i-1].startTime || w[i].endTime != w[i-1].endTime) {
            return true;
        }
    }
    return false;
};

ZmWorkHours.prototype._closeCustomDialog =
function(value) {
    this._customDlg.popdown();
};

ZmWorkHours.prototype._closeCancelCustomDialog = function(value) {
    if (this._customDlg.isDirty()) {
        this._customDlg.reset();
    }
    this._customDlg.popdown();
};

ZmWorkHours.prototype._openCustomizeDlg =
function() {
    if(!this._customDlg) {
        this._customDlg = new ZmCustomWorkHoursDlg(appCtxt.getShell(), "CustomWorkHoursDlg", this._workHours);
        this._customDlg.initialize(this._workHours);
        this._customDlg.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._closeCustomDialog, [true]));
        this._customDlg.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._closeCancelCustomDialog, [false]));
    }
    this._customDlg.popup();
};

ZmWorkHours.prototype.getValue =
function() {
    if(this._radioCustom.isSelected()) { 
        if(this._customDlg) {
            return this._customDlg.getValue();
        }
        else {
            this._radioNormal.setSelected(true);
            this._radioCustom.setSelected(false);
            this._toggleNormalCustom();
        }
    }
    return this.encodeWorkingHours();
};

ZmWorkHours.prototype._toggleNormalCustom =
function() {
    var i;
    if(this._radioNormal.isSelected()) {
        this._startTimeSelect.setEnabled(true);
        this._endTimeSelect.setEnabled(true);
        for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
            this._workDaysCheckBox[i].setEnabled(true);
        }
        this._customBtn.setEnabled(false);
    }
    else {
        for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
            this._workDaysCheckBox[i].setEnabled(false);
        }
        this._startTimeSelect.setEnabled(false);
        this._endTimeSelect.setEnabled(false);
        this._customBtn.setEnabled(true);
    }
};

ZmWorkHours.prototype._setContent =
function(templateId) {
	var i,
        el,
        checkbox,
        customBtn,
        workHours = this._workHours,
        startTimeSelect,
        endTimeSelect,
        radioNormal,
        radioCustom,
        radioGroup,
        selectedRadioId,
        radioIds = {},
        radioName = this._htmlElId + "_normalCustom",
        isCustom = this._isCustom;

    this.getHtmlElement().innerHTML = AjxTemplate.expand("prefs.Pages#"+templateId, {id:this._htmlElId});
    //fill the containers for the work days and work time
    var firstDayOfWeek = appCtxt.get(ZmSetting.CAL_FIRST_DAY_OF_WEEK) || 0;

	// Figure out where in the workHours array the info for firstDayOfWeek is located.
	// The first item in array is associated with the first day of the week that has been set.
	// This determines how the checkboxes will be displayed for work week days. Getting
	// the correct position in the array for first day of week will allow the correct
	// workHours[].isworkingDay value to be set.
	var startingIndex = 0;
	for (i = 0; i < AjxDateUtil.DAYS_PER_WEEK; i++) {
		if (workHours[i].dayOfWeek == firstDayOfWeek) {
			startingIndex = i;
			break;
		}
	}

	for (i = 0; i < AjxDateUtil.DAYS_PER_WEEK; i++) {
		var dayIndex = (i + startingIndex) % AjxDateUtil.DAYS_PER_WEEK;
		var dayOfWeek = (i + firstDayOfWeek) % AjxDateUtil.DAYS_PER_WEEK;

        checkbox = new DwtCheckbox({parent:this, parentElement:(this._htmlElId + "_CAL_WORKING_DAY_" + i)});
		checkbox.setText(AjxDateUtil.WEEKDAY_MEDIUM[dayOfWeek]);
		checkbox.setToolTipContent(AjxDateUtil.WEEKDAY_LONG[dayOfWeek]);
		checkbox.setValue(dayOfWeek);
		checkbox.setSelected(workHours[dayIndex].isWorkingDay);
		checkbox.setEnabled(!isCustom)
        this._workDaysCheckBox.push(checkbox);
    }

    radioNormal = new DwtRadioButton({parent:this, name:radioName, parentElement:(this._htmlElId + "_CAL_WORKING_HOURS_NORMAL")});
    radioNormal.setSelected(!isCustom);
    var radioNormalId = radioNormal.getInputElement().id;
    radioIds[radioNormalId] = radioNormal;
    this._radioNormal = radioNormal;
    this._radioNormalId = radioNormalId;

    el = document.getElementById(this._htmlElId + "_CAL_WORKING_START_TIME");
    startTimeSelect = new DwtTimeInput(this, DwtTimeInput.START, el);
    startTimeSelect.set(this._startTime);
    startTimeSelect.setEnabled(!isCustom);
    this._startTimeSelect = startTimeSelect;

    el = document.getElementById(this._htmlElId + "_CAL_WORKING_END_TIME");
    endTimeSelect = new DwtTimeInput(this, DwtTimeInput.END, el);
    endTimeSelect.set(this._endTime);
    endTimeSelect.setEnabled(!isCustom);
    this._endTimeSelect = endTimeSelect;

    radioCustom = new DwtRadioButton({parent:this, name:radioName, parentElement:(this._htmlElId + "_CAL_WORKING_HOURS_CUSTOM")});
    radioCustom.setSelected(isCustom);
    var radioCustomId = radioCustom.getInputElement().id;
    radioIds[radioCustomId] = radioCustom;
    this._radioCustom = radioCustom;
    this._radioCustomId = radioCustomId;

    radioGroup = new DwtRadioButtonGroup(radioIds, isCustom ? radioCustomId : radioNormalId);

    radioGroup.addSelectionListener(new AjxListener(this, this._toggleNormalCustom));
    this._radioGroup = radioGroup;

    customBtn = new DwtButton({parent:this, parentElement:(this._htmlElId + "_CAL_CUSTOM_WORK_HOURS")});
    customBtn.setText(ZmMsg.calendarCustomBtnTitle);
    customBtn.addSelectionListener(new AjxListener(this, this._openCustomizeDlg));
    customBtn.setEnabled(isCustom);
    this._customBtn = customBtn;
};

/**
 * Create the custom work hours dialog box
 * @param parent
 * @param templateId
 * @param workHours the work hours parsed array
 */
ZmCustomWorkHoursDlg = function (parent, templateId, workHours) {
    DwtDialog.call(this, {parent:parent});
    this._workHours = workHours;
    this._startTimeSelect = [];
    this._endTimeSelect = [];
    this._workDaysCheckBox = [];
    var contentHtml = AjxTemplate.expand("prefs.Pages#"+templateId, {id:this._htmlElId});
    this.setContent(contentHtml);
	this.setTitle(ZmMsg.calendarCustomDlgTitle);
    this._daysChanged = false;
};

ZmCustomWorkHoursDlg.prototype = new DwtDialog;
ZmCustomWorkHoursDlg.prototype.constructor = ZmCustomWorkHoursDlg;

ZmCustomWorkHoursDlg.prototype.initialize = function(workHours) {
    var i,
        el,
        checkbox,
        startTimeSelect,
        endTimeSelect,
        inputTime;

    workHours = workHours || this._workHours;

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        //fill the containers for the work days and work time
        el = document.getElementById(this._htmlElId + "_CAL_WORKING_START_TIME_"+i);
        startTimeSelect = new DwtTimeInput(this, DwtTimeInput.START, el);
        inputTime = new Date();
        inputTime.setHours(workHours[i].startTime/100, workHours[i].startTime%100, 0);
        startTimeSelect.set(inputTime);
        startTimeSelect.setEnabled(workHours[i].isWorkingDay);
        this._startTimeSelect.push(startTimeSelect);


        inputTime = new Date();
        inputTime.setHours(workHours[i].endTime/100, workHours[i].endTime%100, 0);
        el = document.getElementById(this._htmlElId + "_CAL_WORKING_END_TIME_"+i);
        endTimeSelect = new DwtTimeInput(this, DwtTimeInput.END, el);
        endTimeSelect.set(inputTime);
        endTimeSelect.setEnabled(workHours[i].isWorkingDay);
        this._endTimeSelect.push(endTimeSelect);


        checkbox = new DwtCheckbox({parent:this, parentElement:(this._htmlElId + "_CAL_WORKING_DAY_" + i)});
        checkbox.setText(AjxDateUtil.WEEKDAY_MEDIUM[i]);
	    checkbox.setSelected(workHours[i].isWorkingDay);
        checkbox.addSelectionListener(new AjxListener(this, this._setTimeInputEnabled, [i, checkbox]));
        this._workDaysCheckBox.push(checkbox);
    }
};

ZmCustomWorkHoursDlg.prototype.reset =
function() {
    var i,
    inputTime;

    for (i = 0; i < AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        inputTime = new Date();
        inputTime.setHours(this._workHours[i].startTime/100, this._workHours[i].startTime%100, 0);
        this._startTimeSelect[i].set(inputTime);
        this._startTimeSelect[i].setEnabled(this._workHours[i].isWorkingDay);

        inputTime = new Date();
        inputTime.setHours(this._workHours[i].endTime/100, this._workHours[i].endTime%100, 0);
        this._endTimeSelect[i].set(inputTime);
        this._endTimeSelect[i].setEnabled(this._workHours[i].isWorkingDay);

        this._workDaysCheckBox[i].setSelected(this._workHours[i].isWorkingDay);
    }
}

ZmCustomWorkHoursDlg.prototype.reloadWorkHours =
function(workHours) {
    workHours = workHours || appCtxt.get(ZmSetting.CAL_WORKING_HOURS);
    this._workHours = workHours;
};

ZmCustomWorkHoursDlg.prototype._setTimeInputEnabled =
function(idx, checkbox) {
    this._startTimeSelect[idx].setEnabled(checkbox.isSelected());
    this._endTimeSelect[idx].setEnabled(checkbox.isSelected());
};

ZmCustomWorkHoursDlg.prototype.isDirty =
function() {
    var i,
        workHours = this._workHours,
        tf = new AjxDateFormat("HHmm"),
        startInputTime,
        endInputTime;

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        if(this._workDaysCheckBox[i].isSelected() != workHours[i].isWorkingDay) {
            this.setDaysChanged(true);
            return true;
        }
    }
    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        startInputTime = tf.format(this._startTimeSelect[i].getValue());
        endInputTime = tf.format(this._endTimeSelect[i].getValue());
        
        if(startInputTime != workHours[i].startTime
        || endInputTime != workHours[i].endTime
        || this._workDaysCheckBox[i].isSelected() != workHours[i].isWorkingDay) {
            return true;
        }
    }
    return false;
};

ZmCustomWorkHoursDlg.prototype.popup =
function() {
	DwtDialog.prototype.popup.call(this);
};

ZmCustomWorkHoursDlg.prototype.isValid =
function() {
    var i,
        tf = new AjxDateFormat("HHmm"),
        startInputTime,
        endInputTime;

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        if(this._workDaysCheckBox[i].isSelected()) {
            startInputTime = tf.format(this._startTimeSelect[i].getValue());
            endInputTime = tf.format(this._endTimeSelect[i].getValue());

            if(startInputTime > endInputTime) {
                return false;
            }
        }
    }
    return true;

};

ZmCustomWorkHoursDlg.prototype.getValue =
function() {
    var i,
        tf = new AjxDateFormat("HHmm"),
        startInputTime,
        endInputTime,
        dayStr,
        wDaysStr = [];

    for (i=0;i<AjxDateUtil.WEEKDAY_MEDIUM.length; i++) {
        startInputTime = tf.format(this._startTimeSelect[i].getValue());
        endInputTime = tf.format(this._endTimeSelect[i].getValue());
        dayStr = [];
        dayStr.push(i+1);
        if(this._workDaysCheckBox[i].isSelected()) {
            dayStr.push("Y");
        }
        else {
            dayStr.push("N");
        }
        dayStr.push(startInputTime);
        dayStr.push(endInputTime);
        wDaysStr.push(dayStr.join(ZmWorkHours.STR_TIME_SEP));
    }
    return wDaysStr.join(ZmWorkHours.STR_DAY_SEP);
};

ZmCustomWorkHoursDlg.prototype.setDaysChanged =
function(value) {
    this._daysChanged = value;
};

ZmCustomWorkHoursDlg.prototype.getDaysChanged =
function() {
    return this._daysChanged;
};


}

if (AjxPackage.define("zimbraMail.mail.view.prefs.ZmAccountsPage")) {
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

ZmAccountsPage = function(parent, section, controller) {
	// bug: 20458 - We don't have ZmDataSource and other classes unless
	//              we load MailCore (which we never do if mail is disabled).
	ZmAccountsPage._definePrefs();
	ZmAccountsPage._defineClasses();

	ZmPreferencesPage.call(this, parent, section, controller);

	this._sectionDivs = {};
	this._accounts = new AjxVector();
	this._deletedAccounts = [];
	this._deleteResponseReceived = [];
};
ZmAccountsPage.prototype = new ZmPreferencesPage;
ZmAccountsPage.prototype.constructor = ZmAccountsPage;

ZmAccountsPage.prototype.toString =
function() {
	return "ZmAccountsPage";
};

//
// Constants
//

// pref values

ZmAccountsPage.DOWNLOAD_TO_INBOX  = ZmOrganizer.ID_INBOX;
ZmAccountsPage.DOWNLOAD_TO_FOLDER = -1;

// counters

ZmAccountsPage.__personaCount = 0;
ZmAccountsPage.__externalCount = 0;

// section prefs

ZmAccountsPage._definePrefs =
function() {
	ZmAccountsPage.PREFS = {
		// Primary / Common
		ALERT: {
			displayContainer:	ZmPref.TYPE_CUSTOM
		},
		PROVIDER: {
			displayContainer:   ZmPref.TYPE_SELECT
		},
		NAME: {
			displayContainer:	ZmPref.TYPE_INPUT
		},
		HEADER: {
			displayContainer:	ZmPref.TYPE_STATIC,
			displayName:		ZmMsg.accountSubHeader
		},
		EMAIL: {
			displayContainer:	ZmPref.TYPE_INPUT,
			hint:				ZmMsg.exampleEmailAddr
		},
		VISIBLE: {
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		REPLY_TO: {
			displayName:		ZmMsg.accountReplyTo,
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		REPLY_TO_NAME: {
			displayContainer:	ZmPref.TYPE_INPUT,
			hint:				ZmMsg.exampleEmailName
		},
		REPLY_TO_EMAIL: {
			displayContainer:	ZmPref.TYPE_COMBOBOX,
			hint:				ZmMsg.emailAddr
		},
		// External
		ACCOUNT_TYPE: {
			displayContainer:	ZmPref.TYPE_RADIO_GROUP,
			orientation:		ZmPref.ORIENT_HORIZONTAL,
			displayOptions:		["POP3", "IMAP"], // TODO: i18n
			options:			[ZmAccount.TYPE_POP, ZmAccount.TYPE_IMAP]
		},
		USERNAME: {
			displayContainer:	ZmPref.TYPE_INPUT
		},
		HOST: {
			displayContainer:	ZmPref.TYPE_INPUT,
			hint:				ZmMsg.exampleMailServer
		},
		PASSWORD: {
			// TODO: rename ZmPref.TYPE_PASSWORD to TYPE_CHANGE_PASSWORD
			// TODO: add ZmPref.TYPE_PASSWORD
			displayContainer:	ZmPref.TYPE_INPUT
		},
		CHANGE_PORT: {
			displayName:		ZmMsg.accountChangePortLabel,
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		PORT: {
			displayContainer:	ZmPref.TYPE_INPUT,
			validator:			DwtInputField.validateNumber
		},
		PORT_DEFAULT: {
			displayContainer:	ZmPref.TYPE_STATIC,
			displayName:		ZmMsg.accountPortDefault
		},
		SSL: {
			displayName:		ZmMsg.accountUseSSL,
			displayContainer:	ZmPref.TYPE_CHECKBOX,
			options:			[ZmDataSource.CONNECT_CLEAR, ZmDataSource.CONNECT_SSL]
		},
		TEST: {
			displayName:		ZmMsg.accountTest,
			displayContainer:	ZmPref.TYPE_CUSTOM // NOTE: a button
		},
		DOWNLOAD_TO: {
			displayContainer:	ZmPref.TYPE_RADIO_GROUP,
			displayOptions:		[ZmMsg.accountDownloadToInbox, ZmMsg.accountDownloadToFolder],
			options:			[ZmAccountsPage.DOWNLOAD_TO_INBOX, ZmAccountsPage.DOWNLOAD_TO_FOLDER]
		},
		DELETE_AFTER_DOWNLOAD: {
			displayName:		ZmMsg.accountDeleteAfterDownload,
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		// Persona
		FROM_NAME: {
			displayContainer:	ZmPref.TYPE_INPUT,
			hint:				ZmMsg.exampleEmailName
		},
		FROM_EMAIL: {
			displayContainer:	ZmPref.TYPE_SELECT,
			hint:				ZmMsg.emailAddr
		},
		FROM_EMAIL_TYPE: {
			displayContainer:	ZmPref.TYPE_SELECT,
			hint:				ZmMsg.emailAddr
		},
		WHEN_SENT_TO: {
			displayName:		ZmMsg.personaWhenSentTo,
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		WHEN_SENT_TO_LIST: {
			displayContainer:	ZmPref.TYPE_INPUT
		},
		WHEN_IN_FOLDER: {
			displayName:		ZmMsg.personaWhenInFolder,
			displayContainer:	ZmPref.TYPE_CHECKBOX
		},
		WHEN_IN_FOLDER_LIST: {
			displayContainer:	ZmPref.TYPE_INPUT,
			hint:				ZmMsg.exampleFolderNames
		},
		WHEN_IN_FOLDER_BUTTON: {
			displayContainer:	ZmPref.TYPE_CUSTOM
		}
	};

	/**
	 * Defines the various account sections. Each section has a list of "prefs"
	 * that may appear in that section. In the code below, each pref is marked
	 * as "A" if it's a field on the account object and "I" if it's a field on
	 * the identity object.
	 */
	ZmAccountsPage.SECTIONS = {
		PRIMARY: {
			id: "PRIMARY",
			prefs: [
				"NAME",					// A
				"HEADER",				//
				"EMAIL",				// A
				"VISIBLE",				//
				"FROM_NAME",			// I
				"FROM_EMAIL",			// I
				"FROM_EMAIL_TYPE",			// I
				"REPLY_TO",				// I
				"REPLY_TO_NAME",		// I
				"REPLY_TO_EMAIL"		// I
			]
		},
		EXTERNAL: {
			id: "EXTERNAL",
			prefs: [
				"ALERT",
				"PROVIDER",
				"NAME",						// A
				"HEADER",
				"EMAIL",					// I - maps to from name in identity
				"ACCOUNT_TYPE",				// A
				"USERNAME",					// A
				"HOST",						// A
				"PASSWORD",					// A
				"CHANGE_PORT",
				"PORT",						// A
				"PORT_DEFAULT",
				"SSL",						// A
				"TEST",
				"DOWNLOAD_TO",				// A
				"DELETE_AFTER_DOWNLOAD",	// A
				"FROM_NAME",				// I
				"FROM_EMAIL",				// I
				"REPLY_TO",					// I
				"REPLY_TO_NAME",			// I
				"REPLY_TO_EMAIL"			// I
			]
		},
		PERSONA: {
			id: "PERSONA",
			prefs: [
				"NAME",						// I
				"HEADER",
				"FROM_NAME",				// I
				"FROM_EMAIL",				// I
				"FROM_EMAIL_TYPE",				// I
				"REPLY_TO",					// I
				"REPLY_TO_NAME",			// I
				"REPLY_TO_EMAIL",			// I
				"WHEN_SENT_TO",				// I
				"WHEN_SENT_TO_LIST",		// I
				"WHEN_IN_FOLDER",			// I
				"WHEN_IN_FOLDER_LIST",		// I
				"WHEN_IN_FOLDER_BUTTON"
			]
		}
	};

	/*** DEBUG ***
	var providers = [
		{ id: "yahoo-pop", name: "Yahoo! Mail", type: "POP", host: "yahoo.com" },
		{ id: "gmail-pop", name: "GMail (POP)", type: "POP", host: "pop.gmail.com", connectionType: "ssl" },
		{ id: "gmail-imap", name: "GMail (IMAP)", type: "IMAP", host: "imap.gmail.com", connectionType: "ssl" }
	];
	for (var i = 0; i < providers.length; i++) {
		ZmDataSource.addProvider(providers[i]);
	}
	/***/

	// create a section for each provider with a custom template
	var providers = ZmDataSource.getProviders();
	for (var id in providers) {
		if (!AjxTemplate.getTemplate("prefs.Pages#ExternalAccount-"+id)) { continue; }
		ZmAccountsPage.SECTIONS[id] = {
			id:    id,
			prefs: ZmAccountsPage.SECTIONS["EXTERNAL"].prefs
		};
	}

}; // function ZmAccountsPage._definePrefs

ZmAccountsPage.ACCOUNT_PROPS = {
	"NAME":						{ setter: "setName",	getter: "getName" },
	"EMAIL":					{ setter: "setEmail",	getter: "getEmail" },
	"EMAIL_TYPE":					"emailType",
	"VISIBLE":					"visible",
	"ACCOUNT_TYPE":				"type",
	"USERNAME":					"userName",
	"HOST":						"mailServer",
	"PASSWORD":					"password",
	"PORT":						"port",
	"SSL":						"connectionType",
	"DOWNLOAD_TO":				{ setter: "setFolderId", getter: "getFolderId" },
	"DELETE_AFTER_DOWNLOAD":	"leaveOnServer"
};

ZmAccountsPage.IDENTITY_PROPS = {
	"FROM_NAME":			"sendFromDisplay",
	"FROM_EMAIL":			"sendFromAddress",
	"FROM_EMAIL_TYPE":		"sendFromAddressType",
	"REPLY_TO":				"setReplyTo",
	"REPLY_TO_NAME":		"setReplyToDisplay",
	"REPLY_TO_EMAIL":		"setReplyToAddress",
	"WHEN_SENT_TO":			"useWhenSentTo",
	"WHEN_SENT_TO_LIST":	"whenSentToAddresses",
	"WHEN_IN_FOLDER":		"useWhenInFolder",
	"WHEN_IN_FOLDER_LIST":	"whenInFolderIds"
};

ZmAccountsPage.prototype._handleTwoStepAuthLink =
function(params) {
	if (appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_ENABLED)) {
		var dialog = appCtxt.getYesNoMsgDialog();
		dialog.setMessage(ZmMsg.twoStepAuthDisableConfirm, DwtMessageDialog.CRITICAL_STYLE, ZmMsg.twoStepAuthDisable);
		dialog.registerCallback(DwtDialog.YES_BUTTON, ZmTwoFactorSetupDialog.disableTwoFactorAuth.bind(window, params, dialog));
	}
	else {
		if (!this._twoFactorSetupDialog) {
			this._twoFactorSetupDialog = new ZmTwoFactorSetupDialog(params);
		}
		var dialog = this._twoFactorSetupDialog;
	}
	dialog.popup();
};

ZmAccountsPage.prototype._handleTwoStepAuthCodesViewLink =
function(params) {
	if (!this._oneTimeCodesDialog) {
		this._oneTimeCodesDialog = new ZmOneTimeCodesDialog(params);
	}
	this._oneTimeCodesDialog.popup();
};

/**
 * Recovery Account Section
 */

/**
 * Validate Button's Listener.
 *
 * Validate code input through the SetRecoveryAccountRequest API Method.
 *
 */
ZmAccountsPage.prototype._handleValidateRecoveryEmailButton =
	function() {
	var soapDoc = AjxSoapDoc.create("SetRecoveryAccountRequest", "urn:zimbraMail");
	var callback = this._recoveryValidateRequest.bind(this);
	var errorCallback = this._recoveryErrorCallback.bind(this);
	this.recoveryErrorMessage.innerHTML = "";
	soapDoc.setMethodAttribute("op", "validateCode");
	soapDoc.setMethodAttribute("recoveryAccountVerificationCode", this.recoveryCodeInputField.getValue());
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback, errorCallback: errorCallback});
};

/**
 * Validate listener callback method.
 *
 * Expecting a blank response so the callback acts as confirmation that the code is verified.
 * Clear the code input field, reset the button, update controls based on "verified" status.
 *
 * @param {object} response The response object.
 */
ZmAccountsPage.prototype._recoveryValidateRequest =
function(response) {
	this.recoveryCodeInputField.setValue("", true);
	if (!response._isException) {
		this.recoveryCodeInputField.setValue("", true);
		this.validateRecoveryEmailButton.setEnabled(false);
		this._setAccountPasswordControls(this.RECOVERY_EMAIL_STATUS.verified);
	} else {
		this._recoveryErrorCallback({code: "Unknown", msg: "Unknown Error: " + ZmMsg.unknownError});
	}
};

/**
 * Reset Button's Listener.
 *
 * Reset code and email input through the SetRecoveryAccountRequest API Method.
 *
 */
ZmAccountsPage.prototype._handleResetRecoveryEmailButton =
function() {
	var soapDoc = AjxSoapDoc.create("SetRecoveryAccountRequest", "urn:zimbraMail");
	var callback = this._recoveryResetRequest.bind(this);
	var errorCallback = this._recoveryErrorCallback.bind(this);
	this.recoveryErrorMessage.innerHTML = "";
	soapDoc.setMethodAttribute("op", "reset");
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback, errorCallback: errorCallback});
};

/**
 * Reset listener callback method.
 *
 * Expecting a blank response so the callback acts as confirmation that the code and email has been reset.
 * Clear the code and email input fields, reset the buttons, update controls based on "null" status.
 *
 * @param {object} response The response object.
 */
ZmAccountsPage.prototype._recoveryResetRequest =
function(response) {
	if (!response._isException) {
		this._sentLabel = ZmMsg.recoveryEmailSentLabel;
		this.recoveryCodeInputField.setValue("", true);
		this.validateRecoveryEmailButton.setEnabled(false);
		this.recoveryAccountInputField.setValue("", true);
		this.addRecoveryEmailButton.setEnabled(false);
		this._setAccountPasswordControls("Not Set");
	} else {
		this._recoveryErrorCallback({code: "Unknown", msg: "Unknown Error: " + ZmMsg.unknownError});
	}
};

/**
 * Resend Button's Listener.
 *
 * Resend code input through the SetRecoveryAccountRequest API Method.
 *
 */
ZmAccountsPage.prototype._handleResendRecoveryEmailButton =
function() {
	var soapDoc = AjxSoapDoc.create("SetRecoveryAccountRequest", "urn:zimbraMail");
	var callback = this._recoveryResendRequest.bind(this);
	var errorCallback = this._recoveryErrorCallback.bind(this);
	this.recoveryErrorMessage.innerHTML = "";
	soapDoc.setMethodAttribute("op", "resendCode");
	soapDoc.setMethodAttribute("recoveryAccount", this.recoveryEmail);
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback, errorCallback: errorCallback});
};

/**
 * Resend listener callback method.
 *
 * Expecting a blank response so the callback acts as confirmation that the code has been resent.
 * Uupdate controls based on "pending" status.
 *
 * @param {object} response The response object.
 */
ZmAccountsPage.prototype._recoveryResendRequest =
function(response) {
	var responseDetail = response && response.getResponse() ? response.getResponse() : {};
	if (!response._isException) {
		if (responseDetail.Body && responseDetail.Body.RecoverAccountResponse) {
			this._recoveryAttemptsLeft = responseDetail.Body.RecoverAccountResponse.recoveryAttemptsLeft ? responseDetail.Body.RecoverAccountResponse.recoveryAttemptsLeft : false;
		}
		this._sentLabel = ZmMsg.recoveryEmailResentLabel;
		this._setAccountPasswordControls(this.RECOVERY_EMAIL_STATUS.pending);
	} else {
		this._recoveryErrorCallback({code: "Unknown", msg: "Unknown Error: " + ZmMsg.unknownError});
	}
};

/**
 * Add Button's Listener.
 *
 * Add email input through the SetRecoveryAccountRequest API Method.
 *
 */
ZmAccountsPage.prototype._handleAddRecoveryEmailButton =
function() {
	var soapDoc = AjxSoapDoc.create("SetRecoveryAccountRequest", "urn:zimbraMail");
	var callback = this._recoveryAddRequest.bind(this);
	var errorCallback = this._recoveryErrorCallback.bind(this);
	this.recoveryErrorMessage.innerHTML = "";
	this.currentPasswordRecoveryValue = this.recoveryAccountInputField.getValue();
	soapDoc.setMethodAttribute("op", "sendCode");
	soapDoc.setMethodAttribute("recoveryAccount", this.currentPasswordRecoveryValue);
	appCtxt.getAppController().sendRequest({soapDoc: soapDoc, asyncMode: true, callback: callback, errorCallback: errorCallback});
};

/**
 * Add listener callback method.
 *
 * Expecting a blank response so the callback acts as confirmation that the email was submitted and in pending state.
 * Clear the email input field, reset the buttons, update controls based on "pending" status.
 *
 * @param {object} response The response object.
 */
ZmAccountsPage.prototype._recoveryAddRequest =
function(response) {
	var responseDetail = response && response.getResponse() ? response.getResponse() : {};
	if (!response._isException) {
		if (responseDetail.Body && responseDetail.Body.RecoverAccountResponse) {
			this._recoveryAttemptsLeft = responseDetail.Body.RecoverAccountResponse.recoveryAttemptsLeft ? responseDetail.Body.RecoverAccountResponse.recoveryAttemptsLeft : false;
		}
		this.recoveryAccountInputField.setValue("", true);
		this.addRecoveryEmailButton.setEnabled(false);
		this._setAccountPasswordControls(this.RECOVERY_EMAIL_STATUS.pending);
	} else {
		this._recoveryErrorCallback({code: "Unknown", msg: "Unknown Error: " + ZmMsg.unknownError});
	}
};

/**
 * Recovery Error callback method.
 *
 * Response object will have a code and msg value to work with.
 * Determine message to display and update the error message div.
 *
 * @param {object} response The response object.
 */
ZmAccountsPage.prototype._recoveryErrorCallback =
function(response) {
	var message = response.msg;
	var code = response.code;
	var messageBeginning = message.indexOf(": ") + 2; // Simplify the message to description - usually the first colon is the error prefix
	this.recoveryCodeInputField.setValue("", true);
	message = message.substring(messageBeginning);
	// because one particlar exception message is long, check the code and change the message.
	if (code === "mail.SEND_ABORTED_ADDRESS_FAILURE") {
		message = ZmMsg.invalidEmailAddress;
	}
	this.recoveryErrorMessage.innerHTML = message;
	return true;
};

/**
 * Method to update all Password Recovery elements.
 *
 * Based on the satus of the recovery email address, change the ui to fit the expected flow.
 *
 * @TODO Possibly remove this.recoveryEmailStatus if variable is no longer being used in multiple methods
 * @param {string} status this.RECOVERY_EMAIL_STATUS (none || pending || verified)
 */

ZmAccountsPage.prototype._setAccountPasswordControls =
function(status) {
	var userStatusMessage, attempts, attemptsMessage, requestMessage;
	var resendMessage = AjxMessageFormat.format(ZmMsg.recoveryEmailMessageResend);
	this.recoveryEmailStatus = status;
	switch(status) {
		case this.RECOVERY_EMAIL_STATUS.verified:
			userStatusMessage = ZmMsg.recoveryEmailStatusVerified;
			this.recoveryMessage.innerHTML = ZmMsg.recoveryEmailMessageVerified;
			this.recoveryOptionsTitle.innerHTML = ZmMsg.recoveryEmailOptionLabel;
			this.addRecoveryEmailButton.setVisible(false);
			this.resetRecoveryEmailButton.setVisible(true);
			this.resendRecoveryEmailButton.setVisible(false);
			this.validateRecoveryEmailButton.setVisible(false);
			this.addRecoveryEmailInputContainer.style.display = "none";
			this.codeRecoveryEmailInputContainer.style.display = "none";
			break;
		case this.RECOVERY_EMAIL_STATUS.pending:
			userStatusMessage = ZmMsg.recoveryEmailStatusPending;
			attempts = this._recoveryAttemptsLeft ? this._recoveryAttemptsLeft : false;
			attemptsMessage = attempts ? AjxMessageFormat.format(ZmMsg.recoveryEmailMessageAttempts, [attempts]) : "";
			requestMessage = AjxMessageFormat.format(ZmMsg.recoveryEmailMessageSent, [this._sentLabel, this._validityMessage, attemptsMessage, resendMessage]);
			this.recoveryMessage.innerHTML = requestMessage;
			this.recoveryOptionsTitle.innerHTML = ZmMsg.recoveryEmailOptionLabel;
			this.recoveryEmail = this.currentPasswordRecoveryValue;
			this.addRecoveryEmailButton.setVisible(false);
			this.resetRecoveryEmailButton.setVisible(true);
			this.resendRecoveryEmailButton.setVisible(true);
			this.validateRecoveryEmailButton.setVisible(true);
			this.addRecoveryEmailInputContainer.style.display = "none";
			this.codeRecoveryEmailInputContainer.style.display = "table-row";
			break;
		default:
			userStatusMessage = ZmMsg.recoveryEmailStatusNone;
			this.recoveryMessage.innerHTML = ZmMsg.recoveryEmailMessageAdd;
			this.recoveryEmail = "";
			this.recoveryOptionsTitle.innerHTML = "";
			this.addRecoveryEmailButton.setVisible(true);
			this.resetRecoveryEmailButton.setVisible(false);
			this.resendRecoveryEmailButton.setVisible(false);
			this.validateRecoveryEmailButton.setVisible(false);
			this.addRecoveryEmailInputContainer.style.display = "table-row";
			this.codeRecoveryEmailInputContainer.style.display = "none";
			break;
	}
	this.recoveryCodeInputField.setValue("", true);
	this.recoveryDetailDiv.innerHTML = this.recoveryEmail;
	this.recoveryStatusDiv.innerHTML = userStatusMessage;
};

/**
 * Add Email Input's Keyup Listener.
 *
 * Keyup handler to enable the add button once the input is considered valid.
 *
 * @param {object} result   The Keyup event information from the input object that dispatched the event.
 */
ZmAccountsPage.prototype._handleRecoveryEmailInput =
function(result) {
	if (result.target && result.target.value && AjxEmailAddress.isValid(result.target.value)) {
		this.addRecoveryEmailButton.setEnabled(true);
	} else {
		this.addRecoveryEmailButton.setEnabled(false);
	}
};

/**
 * Validate Code Input's Keyup Listener.
 *
 * Keyup handler to enable the validate button once the input is considered valid.
 *
 * @param {object} result   The Keyup event information from the input object that dispatched the event.
 */
ZmAccountsPage.prototype._handleRecoveryCodeInput =
function(result) {
	var codeLength = result.target.value.length;
	if (codeLength >= 4) {
		this.validateRecoveryEmailButton.setEnabled(true);
	} else {
		this.validateRecoveryEmailButton.setEnabled(false);
	}
};

/**
 * GetPrefRequest method.
 *
 * Retrieve up-to-date values of attributes and assign named variables for further use.
 *
 * @param {array} attrs An array of objects based on the foilowing format [ { "name": "variable_name", "attr": "name_of_preference_attribute" } ].
 * @param {function} callback   The callback method to continue with after call is made.
 */
ZmAccountsPage.prototype.loadRecoveryPrefSettings =
function(attrs, callback) {
	var params, node = {};
	var soapDoc = AjxSoapDoc.create("GetPrefsRequest", "urn:zimbraAccount");
	var errorCallback = this._recoveryErrorPrefSettings.bind(this, attrs, callback);
	var respCallback = this._handleLoadRecoveryPrefSettings.bind(this, attrs, callback);
	for(var i = 0, count = attrs.length; i < count; i++) {
		node[i] = soapDoc.set("pref", "TRUE");
		node[i].setAttribute("name", attrs[i].attr);
	}
	params = {
		soapDoc: soapDoc,
		asyncMode: true,
		callback: respCallback,
		errorCallback: errorCallback,
	};
	appCtxt.getAppController().sendRequest(params);
};

/**
 * GetPrefsRequest response method.
 *
 * Parse out the values sent. If attributes don't exist, create the the variable by name supplied and set it to a false boolean value.
 *
 * @param {array} attrs An array of objects based on the foilowing format [ { "name": "variable_name", "attr": "name_of_preference_attribute" } ].
 * @param {function} callback   The callback method to continue with after call is made.
 * @param {object} result Data from GetPrefsRequest call.
 *
 */
ZmAccountsPage.prototype._handleLoadRecoveryPrefSettings =
function(attrs, callback, result) {
	var resultDetail = result && result.getResponse() ? result.getResponse() : {};
	var resultAttrs = resultDetail.GetPrefsResponse && resultDetail.GetPrefsResponse._attrs ? resultDetail.GetPrefsResponse._attrs : false;
	if (resultAttrs) {
		for(var i = 0, count = attrs.length; i < count; i++) {
			if (resultAttrs[attrs[i].attr]){
				this[attrs[i].name] = resultAttrs[attrs[i].attr];
			} else {
				this[attrs[i].name] = false;
			}
		}
	}
	if(callback) {
		callback();
	}
};

/**
 * Error Handling for GetPrefsRequest for recovery settings.
 *
 * If errors occur for this request, error silently and continue with setup.
 *
 * @param {array} attrs An array of objects based on the foilowing format [ { "name": "variable_name", "attr": "name_of_preference_attribute" } ].
 * @param {function} callback   The callback method to continue with after call is made.
 * @param {object} result Data from GetPrefsRequest call.
 *
 */
ZmAccountsPage.prototype._recoveryErrorPrefSettings =
function(attrs, callback, result) {
	for(var i = 0, count = attrs.length; i < count; i++) {
		this[attrs[i].name] = "error";
	}
	if(callback) {
		callback();
	}
};

/**
 * Load the Account Password Recovery Attributes.
 *
 * Get changes to potentially modifed attributes.
 *
 */
ZmAccountsPage.prototype.loadAccountPasswordRecovery =
function() {
	var callback = this.setAccountPasswordRecovery.bind(this);
	var attrs = [
		{
			"name": "recoveryEmail",
			"attr": "zimbraPrefPasswordRecoveryAddress"
		},
		{
			"name": "recoveryEmailStatus",
			"attr": "zimbraPrefPasswordRecoveryAddressStatus"
		}
	];
	this.loadRecoveryPrefSettings(attrs, callback);
}

/**
 * Initiate the Account Password Recovery Preference section.
 *
 * Grab and set all related ui elements and set their state. Create buttons and input fields with respective listeners.
 * Use any ZmSettings applicable to determine the initial state.
 *
 */
ZmAccountsPage.prototype.setAccountPasswordRecovery =
function() {
	var optionsTitle = document.getElementById(this._htmlElId + "_RECOVERY_OPTIONS_TITLE");
	var addRecoveryEmailInputContainer = document.getElementById(this._htmlElId + "_RECOVERY_ACCOUNT_TR");
	var codeRecoveryEmailInputContainer = document.getElementById(this._htmlElId + "_RECOVERY_CODE_TR");
	var recoveryAccountInput = document.getElementById(this._htmlElId + "_RECOVERY_ACCOUNT");
	var recoveryCodeInput = document.getElementById(this._htmlElId + "_RECOVERY_CODE");
	var durationTypePos, durationTypeChar, durationArray, durationTime, durationType, durationMessage, plural;

	// Add constants
	this.RECOVERY_EMAIL_STATUS = {none: "none", pending: "pending", verified: "verified"}

	// Add critical elements
	if (addRecoveryEmailInputContainer && recoveryAccountInput && codeRecoveryEmailInputContainer && recoveryCodeInput) {
		this.recoveryOptionsTitle = optionsTitle;
		this.addRecoveryEmailInputContainer = addRecoveryEmailInputContainer;
		this.codeRecoveryEmailInputContainer = codeRecoveryEmailInputContainer;
		// create dwt input fields
		this._createRecoveryInputFields("recoveryAccountInputField", "text", "", true, "_RECOVERY_ACCOUNT", "_handleRecoveryEmailInput");
		this._createRecoveryInputFields("recoveryCodeInputField", "text", "", true, "_RECOVERY_CODE", "_handleRecoveryCodeInput");
	} else {
		return;
	}

	// Add additional non-critical elements
	this.recoveryDetailDiv = document.getElementById(this._htmlElId + "_RECOVERY_ACCOUNT_DETAIL");
	this.recoveryStatusDiv = document.getElementById(this._htmlElId + "_RECOVERY_ACCOUNT_STATUS");
	this.recoveryMessage = document.getElementById(this._htmlElId + "_RECOVERY_MESSAGE");
	this.recoveryErrorMessage = document.getElementById(this._htmlElId + "_RECOVERY_ERROR_MESSAGE");
	this._recoveryAttemptsLeft = false;
	this._sentLabel = ZmMsg.recoveryEmailSentLabel;

	// Get ZmSettings
	if(!this.recoveryEmail) {
		this.recoveryEmail = "";
	} else if(this.recoveryEmail === "error") {
		this.recoveryEmail = appCtxt.get(ZmSetting.PASSWORD_RECOVERY_EMAIL) ? appCtxt.get(ZmSetting.PASSWORD_RECOVERY_EMAIL) : "";
	}
	if(!this.recoveryEmailStatus) {
		this.recoveryEmailStatus = this.RECOVERY_EMAIL_STATUS.none;
	} else if(this.recoveryEmail === "error") {
		this.recoveryEmailStatus = appCtxt.get(ZmSetting.PASSWORD_RECOVERY_EMAIL_STATUS) ? appCtxt.get(ZmSetting.PASSWORD_RECOVERY_EMAIL_STATUS) : this.RECOVERY_EMAIL_STATUS.none;
	}
	this.recoveryCodeValidity = appCtxt.get(ZmSetting.PASSWORD_RECOVERY_CODE_VALIDITY) ? appCtxt.get(ZmSetting.PASSWORD_RECOVERY_CODE_VALIDITY).toLowerCase() : false;

	if(this.recoveryCodeValidity) {
		durationTypePos = this.recoveryCodeValidity.search(/[a-zA-Z]/);
		durationTypeChar = this.recoveryCodeValidity.charAt(durationTypePos);
		durationArray = this.recoveryCodeValidity.split(durationTypeChar);
		durationTime = durationArray[0];
		plural = durationTime > 1 ? "s" : "";
		if (durationTypePos !== -1 && durationTime !== "") {
			switch(durationTypeChar) {
				case "d":
					durationType = "day" + plural;
					break;
				case "m":
					durationType = "minute" + plural;
					break;
				default:
					durationType = "";
					break;
			}
			if (durationType && durationTime) {
				durationMessage = durationTime + " " + ZmMsg[durationType].toLowerCase();
			}
		} else {
			durationMessage = false;
		}
	}
	this._validityMessage = durationMessage ? AjxMessageFormat.format(ZmMsg.recoveryEmailMessageDuration, [durationMessage]) : "";

	// Create buttons
	this._createRecoveryButtons("addRecoveryEmailButton", ZmMsg.recoveryEmailButtonAdd, false, false,
					"_ADD_RECOVERY_EMAIL", "_handleAddRecoveryEmailButton");
	this._createRecoveryButtons("resetRecoveryEmailButton", ZmMsg.recoveryEmailButtonReset, true, false,
					"_RESET_RECOVERY_EMAIL", "_handleResetRecoveryEmailButton");
	this._createRecoveryButtons("resendRecoveryEmailButton", ZmMsg.recoveryEmailButtonResend, true, false,
					"_RESEND_RECOVERY_EMAIL", "_handleResendRecoveryEmailButton");
	this._createRecoveryButtons("validateRecoveryEmailButton", ZmMsg.recoveryEmailButtonValidate, false, false,
					"_VALIDATE_RECOVERY_EMAIL", "_handleValidateRecoveryEmailButton");

	// Set a email input value between submits
	this.currentPasswordRecoveryValue = this.recoveryEmail;

	// Pass this status through standard control method for additional settings.
	this._setAccountPasswordControls(this.recoveryEmailStatus);
};

/**
 * Create Recovery Input Field method.
 *
 * To reduce repetitive code, make a function that can build password recovery buttons with the desired params.
 *
 * @param {string}  ide         The name of the id for this input element.
 * @param {string}  inputType   The type of input field.
 * @param {string}  value       The initial value to show inthe field.
 * @param {boolean} enabled     Boolean to enable / disable the button.
 * @param {string}  divSuffix   The id from the template to grab.
 * @param {string}  listener    The onclick method.
 */
ZmAccountsPage.prototype._createRecoveryInputFields =
function(ide, inputType, value, enabled, divSuffix, keyupListener) {
	var inputField, inputDiv = document.getElementById(this._htmlElId + divSuffix);
	if (inputDiv) {
		inputField = new DwtInputField({parent: this, id: ide, type: inputType, initialValue: value});
		inputField.setEnabled(enabled);
		if (keyupListener) {
			inputField.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this[keyupListener]));
		}
		inputField.replaceElement(inputDiv);
		this[ide] = inputField;
	}
};

/**
 * Create Recovery Button method.
 *
 * To reduce repetitive code, make a function that can build password recovery buttons with the desired params.
 *
 * @param {string}  ide         The name of the id for this button element.
 * @param {string}  text        The text that shows on the button.
 * @param {boolean} enabled     Boolean to enable / disable the button.
 * @param {boolean} visible     Boolean to show / hide the button.
 * @param {string}  divSuffix   The id from the template to grab.
 * @param {string}  listener    The onclick method.
 */
ZmAccountsPage.prototype._createRecoveryButtons =
function(ide, text, enabled, visible, divSuffix, listener) {
	var button, buttonDiv = document.getElementById(this._htmlElId + divSuffix);
	if (buttonDiv) {
		button = new DwtButton({parent: this, id: ide});
		button.setText(text);
		button.setEnabled(enabled);
		button.setVisible(visible);
		if (listener) {
			button.addSelectionListener(new AjxListener(this, this[listener]));
		}
		button.replaceElement(buttonDiv);
		this[ide] = button;
	}
};

ZmAccountsPage.prototype.getGrantRightsDlg =
function(callback) {

    if (!this._grantRightsDlg) {
        this._grantRightsDlg = new ZmGrantRightsDialog(appCtxt.getShell(), "ZmGrantRightsDialog");
    }
    this._grantRightsDlg._okCallBack = callback;
    return this._grantRightsDlg;

};

ZmAccountsPage.prototype._errRightsCommand =
function(user, ex) {
    this._delegateErrFormatter = this._delegateErrFormatter || new AjxMessageFormat(ZmMsg.delegateNoSuchAccErr);
    var msg = this._delegateErrFormatter.format(user);
    if (ex.code === "account.NO_SUCH_ACCOUNT") {
        appCtxt.getAppController().popupErrorDialog(msg, ex);
        return true;
    }

    return false;

};

ZmAccountsPage.prototype._handleDelegateRights =
function(user, sendAs, sendObo, isGrant, refresh) {
	var request = isGrant ? "GrantRightsRequest" : "RevokeRightsRequest";
	var soapDoc = AjxSoapDoc.create(request, "urn:zimbraAccount");
	var batchCmd = new ZmBatchCommand(null, appCtxt.accountList.mainAccount.name);
	var callback = this._handleDelegateRightsCallback.bind(this, user, sendAs, sendObo, isGrant, refresh);
	var errCallback = this._errRightsCommand.bind(this, user);
	var aceNode = null;
	if (sendAs){
		aceNode = soapDoc.set("ace");
		aceNode.setAttribute("gt", "usr");
		aceNode.setAttribute("d", user);
		aceNode.setAttribute("right", ZmSetting.SEND_AS);
	}

	if (sendObo){
		aceNode = soapDoc.set("ace");
		aceNode.setAttribute("gt", "usr");
		aceNode.setAttribute("d", user);
		aceNode.setAttribute("right", ZmSetting.SEND_ON_BEHALF_OF);
	}

	batchCmd.addNewRequestParams(soapDoc, callback, errCallback);
	batchCmd.run();
};

ZmAccountsPage.prototype._handleDelegateRightsCallback =
function(user, sendAs, sendObo, isGrant, refresh, result){
     var email = user;
     if (isGrant){
        var response = result.getResponse();
        var aces = response && response.GrantRightsResponse && response.GrantRightsResponse.ace;
        if (aces && aces.length && aces[0].d)
            email = aces[0].d;
     }
     if (refresh) {
         this._getGrants();
     }
     this._sendGrantRightsMessage(appCtxt.accountList.mainAccount.name, email, sendAs, sendObo, isGrant);

 };

ZmAccountsPage.prototype._grantDelegateRights =
function(user, sendAs, sendObo) {
    if (sendAs || sendObo){
        this._handleDelegateRights(user, sendAs, sendObo, true, true);
    }
};

ZmAccountsPage.prototype._handleAddDelegateButton =
function() {
    var callback = this._grantDelegateRights.bind(this);
    var dlg = this.getGrantRightsDlg(callback);
    dlg.setData();
    dlg.popup();
};


ZmAccountsPage.prototype._editDelegateRights =
function() {
    var user = this._editDelegateOrig.user;
    var sendAs = arguments[1];
    var sendObo = arguments[2];
    var isGrant = null;
    var updateSendAs = false;
    var updateSendObo = false;

    if (sendAs != this._editDelegateOrig.sendAs && sendObo != this._editDelegateOrig.sendOnBehalfOf){
        if (sendAs == sendObo){
            updateSendAs = updateSendObo = true;
            isGrant = sendAs;
        }else{
            this._handleDelegateRights(user, true, false, sendAs, false);
            updateSendObo = true;
            isGrant = sendObo;
        }
    }else if (sendAs != this._editDelegateOrig.sendAs){
            updateSendAs = true;
            isGrant = sendAs;
    }else if (sendObo != this._editDelegateOrig.sendOnBehalfOf){
            updateSendObo = true;
            isGrant = sendObo;
    }
    this._handleDelegateRights(user, updateSendAs, updateSendObo, isGrant, true);
};

ZmAccountsPage.prototype._editDelegateButton =
    function() {
    var item = this.delegatesList.getSelection()[0];
    this._editDelegateOrig = item;
    this._editDelegateOrig.sendAs = item.sendAs || false;
    this._editDelegateOrig.sendOnBehalfOf = item.sendOnBehalfOf || false;
    var callback = this._editDelegateRights.bind(this);
    var dlg = this.getGrantRightsDlg(callback);
    dlg.setData(item);
    dlg.popup();
};
ZmAccountsPage.prototype._compareDelegateEntries =
function(a, b) {
	return a.user < b.user ? -1 : (a.user > b.user ? 1 : 0);
};
ZmAccountsPage.prototype._setDelegateSendPrefs =
function(grants) {
    var ace = grants._data.GetRightsResponse && grants._data.GetRightsResponse.ace;
    var userRights = [];
    var right = user = node = null;
    var res = new AjxVector();
    if (!ace){
        this._dlSelectionListener(false);
        return res;
    }
    for (var i=0;i<ace.length;i++){
        user = ace[i].d;
        right = ace[i].right;
        if (!userRights[user]){
         userRights[user] = {user:user, id:ace[i].zid};

        }
        userRights[user][right] = true;
    }

    for (var usr in userRights) {
        res.add(userRights[usr])
    }

    res.sort(this._compareDelegateEntries);
    return res;
};

ZmAccountsPage.prototype._refreshRights =
function(grants) {
    var delegatesEl =   document.getElementById(this._htmlElId+"_DELEGATE_RIGHTS") || (this.delegatesList && this.delegatesList.getHtmlElement());
    var dlUsers = this._setDelegateSendPrefs(grants);
    var delegatesList = new ZmAccountDelegatesListView(this);
    delegatesList.replaceElement(delegatesEl);
    delegatesList.setEnabled(true);
    delegatesList.set(dlUsers);
    delegatesList.addSelectionListener(this._dlSelectionListener.bind(this,(dlUsers.size() > 0)));
    this.delegatesList = delegatesList;
    if (this._grantRightsDlg && this._grantRightsDlg.isPoppedUp()) this._grantRightsDlg.popdown();

    this._dlSelectionListener(false);
};

ZmAccountsPage.prototype._removeDelegateButton =
function() {
    var item = this.delegatesList.getSelection()[0];
    this._handleDelegateRights(item.user, item.sendAs, item.sendOnBehalfOf, false, true);
};

ZmAccountsPage.prototype._sendGrantRightsMessage =
function(granter, grantee, sendAs,sendObo,isGrant) {
    var msg = new ZmMailMsg();
    var addrs = new AjxVector();
    var permissions = (sendAs && sendObo)?ZmMsg.sendAsAndSendOnBehalfOf:(sendAs?ZmMsg.sendAs:ZmMsg.sendOnBehalfOflbl);
    var subject = "";
    var status = "";
    if (isGrant){
        status = (sendAs && sendObo) ? ZmMsg.delegateRightsStatus : ZmMsg.delegateRightStatus;
        subject = (sendAs && sendObo) ? ZmMsg.delegateRightsSubject : ZmMsg.delegateRightSubject;
    } else{
        status = (sendAs && sendObo) ? ZmMsg.revokeRightsStatus : ZmMsg.revokeRightStatus;
        subject = (sendAs && sendObo) ? ZmMsg.revokeRightsSubject : ZmMsg.revokeRightSubject;
    }
    subject = AjxMessageFormat.format(subject, [granter]);
    status = AjxMessageFormat.format(status, AjxStringUtil.htmlEncode(grantee));
    var text = (isGrant)?ZmMsg.delegateCreatedText : ZmMsg.delegateRevokedText;
    text = AjxMessageFormat.format(text, [permissions, grantee, granter]);
    var html = (isGrant)?ZmMsg.delegateCreatedHtml : ZmMsg.delegateRevokedHtml;
    html = AjxMessageFormat.format(html, [permissions, grantee, granter]);
    appCtxt.setStatusMsg(status);

    addrs.add(new AjxEmailAddress(grantee, AjxEmailAddress.TO));
    msg.setAddresses(AjxEmailAddress.TO, addrs);
    msg.setSubject(subject);
    var topPart = new ZmMimePart();
    topPart.setContentType(ZmMimeTable.MULTI_ALT);

    var htmlPart = new ZmMimePart();
    htmlPart.setContentType(ZmMimeTable.TEXT_HTML);
    htmlPart.setContent(html);

    var textPart = new ZmMimePart();
    textPart.setContentType(ZmMimeTable.TEXT_PLAIN);
    textPart.setContent(text);

    topPart.children.add(textPart);
    topPart.children.add(htmlPart);
    msg.setTopPart(topPart);
    msg.send();
};

ZmAccountsPage.getScratchCodes =
function(isNew, params, callback) {
	if (isNew) {
		var jsonObj = {GenerateScratchCodesRequest : {_jsns:"urn:zimbraAccount"}};
	}
	else {
		var jsonObj = {GetScratchCodesRequest: {_jsns: "urn:zimbraAccount"}};
	}
	var getScratchCodesCallback = ZmAccountsPage._getScratchCodesCallback.bind(window, isNew, params, callback);
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:getScratchCodesCallback});
};

ZmAccountsPage._getScratchCodesCallback =
function(isNew, params, callback, result) {
	if (!result || result.isException()) {
		return;
	}
	var response = result.getResponse();
	var scratchCodesResponse = response && (response.GetScratchCodesResponse || response.GenerateScratchCodesResponse);
	if (!scratchCodesResponse) {
		return;
	}
	var scratchCode = scratchCodesResponse.scratchCodes && scratchCodesResponse.scratchCodes.scratchCode;
	if (scratchCode) {
		var scratchCodeArray = [];
		for (var i = 0; i < scratchCode.length; i++) {
			if (scratchCode[i]._content) {
				scratchCodeArray.push(scratchCode[i]._content);
			}
		}
		if (scratchCodeArray.length === 0) {
			Dwt.setInnerHtml(params.twoStepAuthCodesSpan, ZmMsg.twoStepAuthOneTimeCodesEmpty);
			Dwt.setDisplay(params.twoStepAuthCodesViewLink, Dwt.DISPLAY_NONE);
			Dwt.setDisplay(params.twoStepAuthCodesGenerateLink, "");
		}
		else {
			Dwt.setInnerHtml(params.twoStepAuthCodesSpan, AjxMessageFormat.format(ZmMsg.twoStepAuthOneTimeCodesCount, scratchCodeArray.length));
			Dwt.setDisplay(params.twoStepAuthCodesViewLink, "");
			Dwt.setDisplay(params.twoStepAuthCodesGenerateLink, Dwt.DISPLAY_NONE);
		}
		if (callback) {
			callback(scratchCodeArray);
		}
	}
};

ZmAccountsPage.prototype._getTrustedDevicesCount =
function() {
	var jsonObj = {GetTrustedDevicesRequest : {_jsns : "urn:zimbraAccount"}};
	var respCallback = this._getTrustedDevicesCountCallback.bind(this);
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmAccountsPage.prototype._getTrustedDevicesCountCallback =
function(result) {
	var response = result && result.getResponse();
	var getTrustedDevicesResponse = response && response.GetTrustedDevicesResponse;
	if (!response || !getTrustedDevicesResponse) {
		return;
	}
	var trustedDevicesCount = 0;
	var trustedDeviceRevokeLink = document.getElementById(this._htmlElId + "_TRUSTED_DEVICE_REVOKE_LINK");
	if (getTrustedDevicesResponse.thisDeviceTrusted) {
		if (trustedDeviceRevokeLink) {
			Dwt.setHandler(trustedDeviceRevokeLink, DwtEvent.ONCLICK, this._handleTrustedDeviceRevokeLink.bind(this));
			Dwt.delClass(trustedDeviceRevokeLink, "ZmLinkDisabled");
		}
		trustedDevicesCount = 1;
	}
	else {
		if (trustedDeviceRevokeLink) {
			Dwt.addClass(trustedDeviceRevokeLink, "ZmLinkDisabled");
		}
	}
	var trustedDevicesRevokeAllLink = document.getElementById(this._htmlElId + "_TRUSTED_DEVICES_REVOKE_ALL_LINK");
	if (getTrustedDevicesResponse.nOtherDevices) {
		if (trustedDevicesRevokeAllLink) {
			Dwt.setHandler(trustedDevicesRevokeAllLink, DwtEvent.ONCLICK, this._handleTrustedDevicesRevokeAllLink.bind(this));
			Dwt.delClass(trustedDevicesRevokeAllLink, "ZmLinkDisabled");
		}
		trustedDevicesCount = trustedDevicesCount + parseInt(getTrustedDevicesResponse.nOtherDevices);
	}
	else {
		if (trustedDevicesRevokeAllLink) {
			Dwt.addClass(trustedDevicesRevokeAllLink, "ZmLinkDisabled");
		}
	}
	var trustedDevicesCountSpan = document.getElementById(this._htmlElId + "_TRUSTED_DEVICES_COUNT");
	Dwt.setInnerHtml(trustedDevicesCountSpan, AjxMessageFormat.format(ZmMsg.trustedDevicesCount, trustedDevicesCount));
};

ZmAccountsPage.prototype._handleTrustedDeviceRevokeLink =
function() {
	var trustedDeviceRevokeLink = document.getElementById(this._htmlElId + "_TRUSTED_DEVICE_REVOKE_LINK");
	//link is currently disabled by CSS pointer-event which will prevent onclick event. For older browsers just check for ZmLinkDisabled class
	if (Dwt.hasClass(trustedDeviceRevokeLink, "ZmLinkDisabled")) {
		return false;
	}
	var msgDialog = appCtxt.getOkCancelMsgDialog();
	msgDialog.setMessage(ZmMsg.revokeTrustedDeviceMsg, DwtMessageDialog.WARNING_STYLE, ZmMsg.revokeTrustedDevice);
	msgDialog.registerCallback(DwtDialog.OK_BUTTON, this._revokeTrustedDevice.bind(this, msgDialog));
	msgDialog.getButton(DwtDialog.OK_BUTTON).setText(ZmMsg.revoke);
	msgDialog.popup();
};

ZmAccountsPage.prototype._revokeTrustedDevice =
function(msgDialog) {
	msgDialog.popdown();
	var jsonObj = {RevokeTrustedDeviceRequest : {_jsns : "urn:zimbraAccount"}};
	var respCallback = this._revokeTrustedDeviceCallback.bind(this);
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmAccountsPage.prototype._revokeTrustedDeviceCallback =
function() {
	this._getTrustedDevicesCount();
};

ZmAccountsPage.prototype._handleTrustedDevicesRevokeAllLink =
function() {
	var trustedDevicesRevokeAllLink = document.getElementById(this._htmlElId + "_TRUSTED_DEVICES_REVOKE_ALL_LINK");
	if (Dwt.hasClass(trustedDevicesRevokeAllLink, "ZmLinkDisabled")) {
		return false;
	}
	var msgDialog = appCtxt.getOkCancelMsgDialog();
	msgDialog.setMessage(ZmMsg.revokeAllTrustedDevicesMsg, DwtMessageDialog.WARNING_STYLE, ZmMsg.revokeAllTrustedDevices);
	msgDialog.registerCallback(DwtDialog.OK_BUTTON, this._revokeOtherTrustedDevices.bind(this, msgDialog));
	msgDialog.getButton(DwtDialog.OK_BUTTON).setText(ZmMsg.revokeAll);
	msgDialog.popup();
};

ZmAccountsPage.prototype._revokeOtherTrustedDevices =
function(msgDialog) {
	msgDialog.popdown();
	var jsonObj = {RevokeOtherTrustedDevicesRequest : {_jsns : "urn:zimbraAccount"}};
	var respCallback = this._revokeOtherTrustedDevicesCallback.bind(this);
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmAccountsPage.prototype._revokeOtherTrustedDevicesCallback =
function() {
	this._getTrustedDevicesCount();
};

ZmAccountsPage.prototype._getGrants =
function() {
    var jsonObj = {GetRightsRequest:{
        _jsns:"urn:zimbraAccount",
        "ace":[
            {right:ZmSetting.SEND_AS},
            {right:ZmSetting.SEND_ON_BEHALF_OF}
        ]
      }
    };
    var respCallback = this._refreshRights.bind(this);
    appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmAccountsPage.prototype._dlSelectionListener =
function(opt) {
    this.editDelegateButton.setEnabled(opt);
    this.removeDelegateButton.setEnabled(opt);
}

ZmAccountsPage.prototype.setAccountSecurity =
function() {
	//If two-factor authentication feature is not available just return.
	if (!appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_AVAILABLE)) {
		return;
	}
	//If two-factor authentication is required user cannot see the Enable/Disable two-step authentication link.
	if (!appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_REQUIRED)) {
		var twoStepAuthLink = document.getElementById(this._htmlElId + "_TWO_STEP_AUTH_LINK");
		if (twoStepAuthLink) {
			var paramsObj = {
				twoStepAuthLink : twoStepAuthLink,
				twoStepAuthSpan : Dwt.getElement(this._htmlElId + "_TWO_STEP_AUTH"),
				twoStepAuthCodesContainer : Dwt.getElement(this._htmlElId + "_TWO_STEP_AUTH_CODES_CONTAINER"),
				twoStepAuthEnabledCallback : this.setAccountSecurity.bind(this)
			};
			Dwt.setHandler(twoStepAuthLink, DwtEvent.ONCLICK, this._handleTwoStepAuthLink.bind(this, paramsObj));
		}
	}
	//If two-factor authentication is not enabled just return.
	if (!appCtxt.get(ZmSetting.TWO_FACTOR_AUTH_ENABLED)) {
		return;
	}

	var twoStepAuthCodesSpan = document.getElementById(this._htmlElId + "_TWO_STEP_AUTH_CODES");
	if (twoStepAuthCodesSpan) {
		var twoStepAuthCodesViewLink = document.getElementById(this._htmlElId + "_TWO_STEP_AUTH_CODES_VIEW_LINK");
		var twoStepAuthCodesGenerateLink = document.getElementById(this._htmlElId + "_TWO_STEP_AUTH_CODES_GENERATE_LINK");
		var params = {
			twoStepAuthCodesSpan : twoStepAuthCodesSpan,
			twoStepAuthCodesViewLink : twoStepAuthCodesViewLink,
			twoStepAuthCodesGenerateLink : twoStepAuthCodesGenerateLink
		};
		if (twoStepAuthCodesViewLink) {
			Dwt.setHandler(twoStepAuthCodesViewLink, DwtEvent.ONCLICK, this._handleTwoStepAuthCodesViewLink.bind(this, params));
		}
		if (twoStepAuthCodesGenerateLink) {
			Dwt.setHandler(twoStepAuthCodesGenerateLink, DwtEvent.ONCLICK, ZmAccountsPage.getScratchCodes.bind(window, true, params, false));
		}
		ZmAccountsPage.getScratchCodes(false, params, false);
	}

	if (appCtxt.get(ZmSetting.TRUSTED_DEVICES_ENABLED)) {
		var trustedDevicesCountSpan = document.getElementById(this._htmlElId + "_TRUSTED_DEVICES_COUNT");
		if (trustedDevicesCountSpan) {
			this._getTrustedDevicesCount();
		}
	}

	//Whether app-specific passwords are enabled when two-factor auth is enabled
	if (appCtxt.get(ZmSetting.APP_PASSWORDS_ENABLED)) {
		var applicationCodesElement = document.getElementById(this._htmlElId + "_APPLICATION_CODES");
		if (!applicationCodesElement) {
			return;
		}
		this._getAppSpecificPasswords(applicationCodesElement);

		var addApplicationCodeButton = document.getElementById(this._htmlElId + "_ADD_APPLICATION_CODE");
		if (addApplicationCodeButton) {
			var button = new DwtButton({parent:this, id:"addApplicationCodeBtn"});
			button.setText(ZmMsg.twoStepAuthAddAppCode);
			button.setEnabled(true);
			button.addSelectionListener(new AjxListener(this, this._handleAddApplicationCode));
			button.replaceElement(addApplicationCodeButton);
			this.addApplicationCodeButton = button;
		}

		var revokeApplicationCodeButton = document.getElementById(this._htmlElId+"_REVOKE_APPLICATION_CODE");
		if (revokeApplicationCodeButton) {
			var button = new DwtButton({parent:this, id:"revokeApplicationCodeBtn"});
			button.setText(ZmMsg.twoStepAuthRevokeCode);
			button.setEnabled(false);
			button.addSelectionListener(new AjxListener(this, this._revokeApplicationCode));
			button.replaceElement(revokeApplicationCodeButton);
			this.revokeApplicationCodeButton = button;
		}
	}
};

ZmAccountsPage.prototype.setAccountDelegates =
function() {
    var delegatesEl =   document.getElementById(this._htmlElId+"_DELEGATE_RIGHTS");
    if (!delegatesEl) return;
    this._getGrants(delegatesEl);


    var addDelegateButtonDiv = document.getElementById(this._htmlElId+"_ADD_DELEGATE");
	if (addDelegateButtonDiv) {
		var button = new DwtButton({parent:this, id:"addDelegateBtn"});
		button.setText(ZmMsg.addDelegate);
		button.setEnabled(true);
		button.addSelectionListener(new AjxListener(this, this._handleAddDelegateButton));
        button.replaceElement(addDelegateButtonDiv);
		this.addDelegateButton = button;
	}

    var editDelegateButtonDiv = document.getElementById(this._htmlElId+"_EDIT_DELEGATE");
    if (editDelegateButtonDiv) {
        var button = new DwtButton({parent:this, id:"editDelegateBtn"});
        button.setText(ZmMsg.editPermissions);
        button.setEnabled(false);
        button.addSelectionListener(new AjxListener(this, this._editDelegateButton));
        button.replaceElement(editDelegateButtonDiv);
        this.editDelegateButton = button;
    }

    var removeDelegateButtonDiv = document.getElementById(this._htmlElId+"_REMOVE_DELEGATE");
    if (removeDelegateButtonDiv) {
       var button = new DwtButton({parent:this, id:"removeDelegateBtn"});
       button.setText(ZmMsg.remove);
       button.setEnabled(false);
       button.addSelectionListener(new AjxListener(this, this._removeDelegateButton));
       button.replaceElement(removeDelegateButtonDiv);
       this.removeDelegateButton = button;
    }



}
//
// Public methods
//

ZmAccountsPage.prototype.setAccount =
function(account, skipUpdate, ignoreProvider) {
	// keep track of changes made to current account
	if (this._currentAccount) {
		if (!skipUpdate) {
			this._setAccountFields(this._currentAccount, this._currentSection);
		}
		this._tabGroup.removeMember(this._currentSection.tabGroup);
		this._currentAccount = null;
		this._currentSection = null;
	}

	// toggle delete button
	if (this._deleteButton) {
		var isEnabled = (appCtxt.isOffline)
			? (account && account.type == ZmAccount.TYPE_PERSONA)
			: (account && account.type != ZmAccount.TYPE_ZIMBRA);
        if (account.smtpEnabled) {
            isEnabled = false;
        }
		this._deleteButton.setEnabled(isEnabled);
	}

	// intialize sections
	for (var type in this._sectionDivs) {
		Dwt.setVisible(this._sectionDivs[type], false);
	}

	// HACK: Attempt to get around an IE update issue.
	setTimeout(AjxCallback.simpleClosure(this._setAccount2, this, account, skipUpdate, ignoreProvider),0);
};

ZmAccountsPage.prototype._setAccount2 =
function(account, skipUpdate, ignoreProvider) {
	// NOTE: hide all sections first, then show the specific section b/c some
	// sections use same div. This avoids double inititalization in that case.
	var isExternal = account instanceof ZmDataSource;
	var provider = !ignoreProvider && isExternal && account.getProvider();
	var div = (provider && this._sectionDivs[provider.id]) || this._getSectionDiv(account);
    if (div) {
        this._currentAccount = account;
        Dwt.setVisible(div, true);
        if (appCtxt.isOffline) {
            // bug 48014 - add "Use this persona" section for offline
            if (account.type == ZmAccount.TYPE_PERSONA) {
                this._currentSection = ZmAccountsPage.SECTIONS["PERSONA"];
                this._setPersona(account, this._currentSection);
            } else {
                this._currentSection = ZmAccountsPage.SECTIONS["PRIMARY"];
                this._setZimbraAccount(account, this._currentSection);
            }
        } else {
            switch (account.type) {
                case ZmAccount.TYPE_POP:
                case ZmAccount.TYPE_IMAP: {
                    this._currentSection = provider && ZmAccountsPage.SECTIONS[provider.id];
                    this._currentSection = this._currentSection || ZmAccountsPage.SECTIONS["EXTERNAL"];
                    this._setExternalAccount(account, this._currentSection);
                    if (ignoreProvider) {
                        this._setControlValue("PROVIDER", this._currentSection, "");
                    }
                    if (!skipUpdate) {
                        var password = this._getControlObject("PASSWORD", this._currentSection);
                        if (password) {
                            password.setShowPassword(false);
                        }
                    }
                    break;
                }
                case ZmAccount.TYPE_PERSONA: {
                    this._currentSection = ZmAccountsPage.SECTIONS["PERSONA"];
                    this._setPersona(account, this._currentSection);
                    break;
                }
                default: {
                    this._currentSection = ZmAccountsPage.SECTIONS["PRIMARY"];
                    this._setZimbraAccount(account, this._currentSection);
                    break;
                }
            }
        }
		if (!this._tabGroup.contains(this._currentSection.tabGroup)) {
			this._tabGroup.addMember(this._currentSection.tabGroup);
		}
	}

	// update list cells
	this._updateList(account);

	var control = this._currentSection && this._currentSection.controls[isExternal ? "EMAIL" : "NAME"];

	// When a hidden field is applied focus(), IE throw's an exception.
	// Thus checking for isActive()
	if (control && this.isActive()) {
		control.focus();
	}
};

ZmAccountsPage.prototype.isActive =
function() {
	return (this._controller.getTabView().getActiveView().toString() == this.toString());
};

// ZmPreferencesPage methods

ZmAccountsPage.prototype.showMe =
function() {
	var hasRendered = this.hasRendered; // cache before calling base

	ZmPreferencesPage.prototype.showMe.apply(this, arguments);

	if (!hasRendered) {
		this.reset();
	}
};

ZmAccountsPage.prototype.reset =
function(useDefaults) {
	ZmPreferencesPage.prototype.reset.apply(this, arguments);

	// clear current list of accounts
	this._accounts.removeAll();
	this._deletedAccounts = [];
	this._currentAccount = null;
	this._currentSection = null;

	var usedIdentities = {};

	// add zimbra accounts (i.e. family mboxes)
	var mboxes = appCtxt.accountList.getAccounts();
	var active = appCtxt.getActiveAccount();
	for (var j in mboxes) {
		var acct = mboxes[j];
		var ident = acct.getIdentity();
		// NOTE: We create proxies of all of the account objects so that we can
		//       store temporary values while editing.
		if (active.isMain || acct == active) {
			this._accounts.add(ZmAccountsPage.__createProxy(acct));
			if (ident) usedIdentities[ident.id] = true;
		}
	}
	// add data sources unless we're in offline mode
	if (!appCtxt.isOffline && active.isMain) {
		var dataSourceCollection = appCtxt.getDataSourceCollection();
		var dataSources = dataSourceCollection.getItems(); // TODO: rename getItems or rename getIdentities
		for (var i = 0; i < dataSources.length; i++) {
			var datasource = dataSources[i];
			var ident = datasource.getIdentity();
			delete datasource.password;
			this._accounts.add(ZmAccountsPage.__createProxy(datasource));
			if (ident) usedIdentities[ident.id] = true;
		}
	}

	// add identities/personas
	var identityCollection = appCtxt.getIdentityCollection();
	var identities = identityCollection.getIdentities();
	for (var i = 0; i < identities.length; i++) {
		var identity = identities[i];
		if (identity.isDefault || identity.isFromDataSource) continue;
		var id = identity.id;
		if (usedIdentities[id]) continue;
		usedIdentities[id] = true;
		var persona = new ZmPersona(identity);
		this._accounts.add(ZmAccountsPage.__createProxy(persona), null, true);
	}
	var signatureLinkElement = Dwt.getElement(this._htmlElId + "_External_Signatures_Link");
	Dwt.setHandler(signatureLinkElement, DwtEvent.ONCLICK, function(){skin.gotoPrefs("SIGNATURES")});
	// initialize list view
	this._accounts.sort(ZmAccountsPage.__ACCOUNT_COMPARATOR);
	var account = this._accounts.get(0);
	this._resetAccountListView(account);
	this.setAccount(account);
	this.setAccountSecurity();
	this.loadAccountPasswordRecovery();
	this.setAccountDelegates();
};

// saving

ZmAccountsPage.prototype.isDirty =
function() {
	// make sure that the current object proxy is up-to-date
	this._setAccountFields(this._currentAccount, this._currentSection, true);

	var printAcct = function(acct) {
		if (AjxUtil.isArray(acct)) {
			return AjxUtil.map(acct, printAcct).join("\n");
		}
		return ["name: ",acct.name,", id: ",acct.id].join("");
	}

	var dirty = this._deletedAccounts.length > 0;
	if (dirty) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\n" + "Deleted accounts:\n" + printAcct(this._deletedAccounts));
	}
	if (!dirty) {
		var accounts = this._accounts.getArray();
		var dirtyAccounts = [];
		for (var i = 0; i < accounts.length; i++) {
			var account = accounts[i];
			if (account._new || account._dirty || account._visibleDirty) {
				dirty = true;
				dirtyAccounts.push(account);
			}
		}
		if (dirty) {
			AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\n" + "Dirty accounts:\n" + printAcct(dirtyAccounts));
		}
	}
	return dirty;
};

/**
 * Does minimal checking:
 * <li>bug 21104: persona name and the associated display value for the From address
 * <li>bug 950: email addresses
 */
ZmAccountsPage.prototype.validate =
function() {
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		var type = account.type;
		var isPrimary = type == ZmAccount.TYPE_ZIMBRA;
		var isExternal = type == ZmAccount.TYPE_POP || type == ZmAccount.TYPE_IMAP;
		var isPersona = type == ZmAccount.TYPE_PERSONA;

		// bug 21104
		if (isPersona && (account._new || account._dirty) && 
			!(account.identity && account.identity.name)) {
			this._errorMsg = ZmMsg.invalidPersonaName;
			return false;
		}
		// bug 950
		if (isExternal && !this.__validateEmail(this.__getAccountValue(account, "EMAIL"))) {
			return false;
		}
		if (this.__getIdentityValue(account, "REPLY_TO") &&
			!this.__validateEmail(this.__getIdentityValue(account, "REPLY_TO_EMAIL"))) {
			return false;
		}
		if (isExternal && !this.__validateEmail(this.__getIdentityValue(account, "FROM_EMAIL"))) {
			return false;
		}
		if (isPersona && this.__getIdentityValue(account, "WHEN_SENT_TO") &&
			!this.__validateEmailList(this.__getIdentityValue(account, "WHEN_SENT_TO_LIST"))) {
			return false;
		}
		if ( AjxUtil.isEmpty(this.__getIdentityValue(account, "FROM_NAME")) &&
		    !AjxUtil.isEmpty(appCtxt.get(ZmSetting.DISPLAY_NAME))) {
			this._errorMsg = ZmMsg.missingEmailDisplayName;
			return false;
		}
	}
	return true;
};

ZmAccountsPage.prototype.__getAccountValue =
function(account, id) {
	var prop = ZmAccountsPage.ACCOUNT_PROPS[id];
	if (!prop) return;
	return (typeof prop == "string") ? account[prop] : account[prop.getter]();
};

ZmAccountsPage.prototype.__getIdentityValue =
function(account, id) {
	var prop = ZmAccountsPage.IDENTITY_PROPS[id];
	if (!prop) return;
	var identity = account.getIdentity();
	return identity && (typeof prop == "string" ? identity[prop] : identity[prop]());
};

ZmAccountsPage.prototype.__validateEmail =
function(s) {
	if (!ZmPref.validateEmail(s)) {
		this._errorMsg = AjxStringUtil.htmlEncode(AjxMessageFormat.format(ZmMsg.invalidEmail, [s]));
		return false;
	}
	return true;
};

ZmAccountsPage.prototype.__validateEmailList =
function(l) {
	var ss = String(l).split(/[,;]/);
	for (var i = 0; i < ss.length; i++) {
		var valid = this.__validateEmail(ss[i]);
		if (!valid) return false;
	}
	return true;
};

ZmAccountsPage.prototype.getErrorMessage =
function() {
	return this._errorMsg;
};

ZmAccountsPage.prototype.getPreSaveCallback =
function() {
	return new AjxCallback(this, this._preSave);
};

ZmAccountsPage.prototype.getPostSaveCallback =
function() {
	return new AjxCallback(this, this._postSave);
};

ZmAccountsPage.prototype.addCommand =
function(batchCmd) {
	// make sure that the current object proxy is up-to-date
	// NOTE: This is already done so don't do it again or else we'll
	// NOTE: lose the folderId from the create/rename folder op.
	//this._setAccountFields(this._currentAccount, this._currentSection);

	// delete accounts
	for (var i = 0; i < this._deletedAccounts.length; i++) {
		var callback = null;
		var account = this._deletedAccounts[i];
		var folderId = account.folderId;
		if (folderId == ZmAccountsPage.DOWNLOAD_TO_FOLDER || folderId != ZmAccountsPage.DOWNLOAD_TO_INBOX) {
			var root = appCtxt.getById(ZmOrganizer.ID_ROOT);
			var name = account.getName();
			var folder = root.getByName(name);
			if (folder && !folder.isSystem()) {
				callback = new AjxCallback(this, this._doDeleteCallback, [folder]);
			}
		}
		this._deletedAccounts[i].doDelete(callback, null, batchCmd);
	}

	// for multi-account mbox, check if user changed visible flag on subaccounts
	if (appCtxt.accountList.size(true) > 1) {
		this._saveVisibleAccounts(batchCmd);
	}

	// modify existing accounts
	var newAccounts = [];
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		if (account._new) {
			newAccounts.push(account);
			continue;
		}

		if (account._dirty) {
			var callback = new AjxCallback(this, this._handleSaveAccount, [account]);
			account.save(callback, null, batchCmd);
		}
	}

	// add new accounts
	for (var i = 0; i < newAccounts.length; i++) {
		var account = newAccounts[i];
		var callback = new AjxCallback(this, this._handleCreateAccount, [account]);
		account.create(callback, null, batchCmd);
	}

	// refresh display after all is done
	var soapDoc = AjxSoapDoc.create("NoOpRequest", "urn:zimbraMail");
	var callback = new AjxCallback(this, this.reset);
	batchCmd.addNewRequestParams(soapDoc, callback);
};

//
// Protected methods
//

ZmAccountsPage.prototype._testAccounts =
function(accounts, okCallback, cancelCallback) {
	this._controller.getTestDialog().popup(accounts, okCallback, cancelCallback);
};

// set controls based on account

ZmAccountsPage.prototype._setZimbraAccount =
function(account, section) {
	this._setGenericFields(account, section);
	this._setIdentityFields(account, section);
	if (appCtxt.isFamilyMbox) {
		this._setControlEnabled("VISIBLE", section, !account.isMain);
	}
};

ZmAccountsPage.prototype._setExternalAccount =
function(account, section) {
	this._setGenericFields(account, section);
	this._setDataSourceFields(account, section);
	this._setIdentityFields(account, section);
	if (this._setControlVisible("ALERT", section, !account.isStatusOk())) {
		var alert = section.controls["ALERT"];
		alert.setStyle(DwtAlert.CRITICAL);
		alert.setTitle(account.failingSince ? ZmMsg.dataSourceFailureTitle : ZmMsg.accountInactiveTitle);
		alert.setContent(account.lastError || ZmMsg.accountInactiveContent);
	}
};

ZmAccountsPage.prototype._setPersona =
function(account, section) {
	this._setGenericFields(account, section);
	this._setIdentityFields(account, section);
};

ZmAccountsPage.prototype._setGenericFields =
function(account, section) {
	this._setControlValue("NAME", section, account.getName());
	this._setControlValue("HEADER", section, account.getName());
	this._setControlValue("EMAIL", section, account.getEmail());
	this._setControlValue("VISIBLE", section, account.visible);
};

ZmAccountsPage.prototype._setDataSourceFields =
function(account, section) {
	var isSsl = account.connectionType == ZmDataSource.CONNECT_SSL;
	var isInbox = account.folderId == ZmOrganizer.ID_INBOX;
	var isPortChanged = account.port != account.getDefaultPort();
    var isSmtpEnabled = account.smtpEnabled;

	this._setControlValue("ACCOUNT_TYPE", section, account.type);
	this._setControlEnabled("ACCOUNT_TYPE", section, account._new);
	this._setControlValue("USERNAME", section, account.userName);
	this._setControlValue("HOST", section, account.mailServer);
	this._setControlValue("PASSWORD", section, account.password);
	this._setControlValue("SSL", section, isSsl);
	this._setControlEnabled("TEST", section, true);
	this._setDownloadToFolder(account);
	this._setControlValue("DELETE_AFTER_DOWNLOAD", section, account.leaveOnServer);
	this._setControlValue("CHANGE_PORT", section, isPortChanged);
	this._setControlEnabled("PORT", section, isPortChanged);
	this._setPortControls(account.type, account.connectionType, account.port);

	var provider = account.getProvider();
	this._setControlValue("PROVIDER", section, provider ? provider.id : "");
	this._setControlVisible("PROVIDER", section, AjxUtil.keys(ZmDataSource.getProviders()).length > 0);
    this._setExternalSectionControlsView(section, !isSmtpEnabled);
};

ZmAccountsPage.prototype._setDownloadToFolder =
function(account) {
	var section = this._currentSection;
	var radioGroup = section.controls["DOWNLOAD_TO"];
	if (!radioGroup) return;

	var pref = ZmAccountsPage.PREFS["DOWNLOAD_TO"];
	var options = pref.options;
	var displayOptions = pref.displayOptions;
	var pattern = displayOptions[options[0] == ZmAccountsPage.DOWNLOAD_TO_INBOX ? 1 : 0];
	var name = AjxStringUtil.htmlEncode(this._getControlValue("NAME", section));
	var text = AjxMessageFormat.format(pattern, name);

	var radioButton = radioGroup.getRadioButtonByValue(ZmAccountsPage.DOWNLOAD_TO_FOLDER);
	radioButton.setText(text);

	var isImap = account.type == ZmAccount.TYPE_IMAP;
	var isInbox = !isImap && account.folderId == ZmOrganizer.ID_INBOX;
	var value = isInbox ? ZmAccountsPage.DOWNLOAD_TO_INBOX : ZmAccountsPage.DOWNLOAD_TO_FOLDER;
	this._setControlValue("DOWNLOAD_TO", section, value);
	this._setControlEnabled("DOWNLOAD_TO", section, !isImap);
};

ZmAccountsPage.prototype._setPortControls =
function(accountType, connectionType, accountPort) {
	var isPop = accountType == ZmAccount.TYPE_POP;
	var isSsl = connectionType == ZmDataSource.CONNECT_SSL;

	var section = this._currentSection;
	this._setControlValue("PORT", section, accountPort);
	this._setControlEnabled("DELETE_AFTER_DOWNLOAD", section, isPop);

	this._setControlEnabled("DOWNLOAD_TO", section, isPop);
	// imap is never allowed in inbox
	if (!isPop) {
		this._setControlValue("DOWNLOAD_TO", section, ZmAccountsPage.DOWNLOAD_TO_FOLDER);
	}

	var portTypeLabel = AjxMessageFormat.format(ZmAccountsPage.PREFS["CHANGE_PORT"].displayName, accountType);
	this._setControlLabel("CHANGE_PORT", section, portTypeLabel);

	var defaultPort = isPop ? ZmPopAccount.PORT_CLEAR : ZmImapAccount.PORT_CLEAR;
	if (isSsl) {
		defaultPort = isPop ? ZmPopAccount.PORT_SSL : ZmImapAccount.PORT_SSL;
	}
	var defaultPortLabel = AjxMessageFormat.format(ZmAccountsPage.PREFS["PORT_DEFAULT"].displayName, defaultPort);
	this._setControlLabel("PORT_DEFAULT", section, defaultPortLabel);
};

ZmAccountsPage.prototype._setIdentityFields =
function(account, section) {
	var identity = account.getIdentity();

	this._setControlValue("FROM_NAME", section, identity.sendFromDisplay);
    this._setControlValue("FROM_EMAIL", section, (identity.sendFromAddressType == ZmSetting.SEND_ON_BEHALF_OF) ? ZmMsg.onBehalfOfMidLabel + " " + identity.sendFromAddress : identity.sendFromAddress);
    this._setControlValue("FROM_EMAIL_TYPE", section, identity.sendFromAddressType);
    this._setControlValue("REPLY_TO", section, identity.setReplyTo);
	this._setControlValue("REPLY_TO_NAME", section, identity.setReplyToDisplay);
	this._setControlValue("REPLY_TO_EMAIL", section, identity.setReplyToAddress);
	this._setControlValue("READ_RECEIPT_TO_ADDR", section, identity.readReceiptAddr);
	this._setControlValue("WHEN_SENT_TO", section, identity.useWhenSentTo);
	this._setControlValue("WHEN_SENT_TO_LIST", section, identity.whenSentToAddresses);
	this._setControlValue("WHEN_IN_FOLDER", section, identity.useWhenInFolder);
	this._setControlValue("WHEN_IN_FOLDER_LIST", section, identity.whenInFolderIds);

	this._setReplyToControls();
	this._setWhenSentToControls();
	this._setWhenInFolderControls();
};

ZmAccountsPage.prototype._saveVisibleAccounts =
function(batchCmd) {
	var accounts = this._accounts.getArray();
	var visibilityChanged = false;

	// check if visibility changed for any sub accounts
	for (var i = 0; i < accounts.length; i++) {
		if (accounts[i]._visibleDirty) {
			visibilityChanged = true;
			break;
		}
	}

	// collect *all* visible accounts for ModifyPrefsRequest and add to batchCmd
	if (visibilityChanged) {
		var soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount");
		var setting = appCtxt.getSettings().getSetting(ZmSetting.CHILD_ACCTS_VISIBLE);
		var foundVisible = false;
		for (var j = 0; j < accounts.length; j++) {
			var account = accounts[j];
			if (!account.isMain && account.visible) {
				var node = soapDoc.set("pref", account.id);
				node.setAttribute("name", setting.name);
				foundVisible = true;
			}
		}
		// user unset visible for all accounts - send empty value
		if (!foundVisible) {
			var node = soapDoc.set("pref", "");
			node.setAttribute("name", setting.name);
		}
		var callback = new AjxCallback(this, this._handleSaveVisibleAccount);
		batchCmd.addNewRequestParams(soapDoc, callback);
	}
};

ZmAccountsPage.prototype._setReplyToControls =
function() {
	var section = this._currentSection;
	var replyTo = this._getControlValue("REPLY_TO", section);

	this._setControlEnabled("REPLY_TO_NAME", section, replyTo);
	this._setControlEnabled("REPLY_TO_EMAIL", section, replyTo);
};

ZmAccountsPage.prototype._setWhenSentToControls =
function() {
	var section = this._currentSection;
	var whenSentTo = this._getControlValue("WHEN_SENT_TO", section);

	this._setControlEnabled("WHEN_SENT_TO_LIST", section, whenSentTo);
};

ZmAccountsPage.prototype._setWhenInFolderControls =
function() {
	var section = this._currentSection;
	var whenInFolder = this._getControlValue("WHEN_IN_FOLDER", section);

	this._setControlEnabled("WHEN_IN_FOLDER_LIST", section, whenInFolder);
	this._setControlEnabled("WHEN_IN_FOLDER_BUTTON", section, whenInFolder);
};

ZmAccountsPage.prototype._setControlLabel =
function(id, section, value) {
	var control = section.controls[id];
	var setup = ZmAccountsPage.PREFS[id];
	if (!control || !setup) return;

	switch (setup.displayContainer) {
		case ZmPref.TYPE_STATIC:
		case ZmPref.TYPE_CHECKBOX: {
			control.setText(value);
			break;
		}
	}
};

ZmAccountsPage.prototype._getControlObject =
function(id, section) {
	return section && section.controls[id];
};

ZmAccountsPage.prototype._setControlValue =
function(id, section, value) {
	var control = section.controls[id];
	var setup = ZmAccountsPage.PREFS[id];
	if (!setup) return;
	if (!control) {
		setup.value = value;
		return;
	}

	if (setup.displayFunction) {
		value = setup.displayFunction(value);
	}
	if (id == "DELETE_AFTER_DOWNLOAD") {
		value = !value;
	}
	else if (id == "WHEN_SENT_TO_LIST") {
		value = value ? value.join(", ") : "";
	}
	else if (id == "WHEN_IN_FOLDER_LIST") {
		var tree = appCtxt.getTree(ZmOrganizer.FOLDER);
		var folderIds = value;
		var array = [value];
		var seenComma = false;
		for (var i = 0; i < folderIds.length; i++) {
			var fid = folderIds[i];
			var searchPath = array[i] = tree.getById(fid).getSearchPath();
			seenComma = seenComma || searchPath.match(/,/);
		}
		value = AjxUtil.uniq(array).join(seenComma ? "; " : ", ");
	}

	switch (setup.displayContainer) {
		case ZmPref.TYPE_STATIC: {
			var message = setup.displayName ? AjxMessageFormat.format(setup.displayName, value) : value;
			control.setText(message);
			break;
		}
		case ZmPref.TYPE_CHECKBOX: {
			control.setSelected(value);
			break;
		}
		case ZmPref.TYPE_INPUT:
		case ZmPref.TYPE_COMBOBOX: {
			control.setValue(value);
			break;
		}
		case ZmPref.TYPE_SELECT:
		case ZmPref.TYPE_RADIO_GROUP: {
			control.setSelectedValue(value, true);
			break;
		}
	}
};

ZmAccountsPage.prototype._getControlValue =
function(id, section) {
	var control = section.controls[id];
	var setup = ZmAccountsPage.PREFS[id];
	if (!setup) return null;
	if (!control) {
		return setup.value || (id == "DOWNLOAD_TO" && ZmAccountsPage.DOWNLOAD_TO_FOLDER);
	}

	var value = null;
	if (id == "WHEN_SENT_TO_LIST") {
		var array = AjxEmailAddress.parseEmailString(control.getValue()).all.getArray();
		for (var i = 0; i < array.length; i++) {
			array[i] = array[i].address;
		}
		value = array;
	}
	else if (id == "WHEN_IN_FOLDER_LIST") {
		var tree = appCtxt.getTree(ZmOrganizer.FOLDER);
		var root = tree.getById(ZmOrganizer.ID_ROOT);

		var folderPaths = control.getValue().replace(/\s*(;|,)\s*/g,"$1").split(/;|,/);
		var array = [];
		for (var i = 0; i < folderPaths.length; i++) {
			var folder = root.getByPath(folderPaths[i],true);
			if (!folder) continue;
			array.push(folder.id);
		}
		value = array;
	}
	else if (id == "DELETE_AFTER_DOWNLOAD") {
		value = !control.isSelected();
	}
	else {
		switch (setup.displayContainer) {
			case ZmPref.TYPE_STATIC: {
				value = control.getText();
				break;
			}
			case ZmPref.TYPE_CHECKBOX: {
				value = control.isSelected();
				if (setup.options) {
					value = setup.options[Number(value)];
				}
				break;
			}
			case ZmPref.TYPE_RADIO_GROUP: {
				value = control.getSelectedValue();
				break;
			}
			case ZmPref.TYPE_INPUT:
			case ZmPref.TYPE_SELECT: {
				value = control.getValue();
				break;
			}
			case ZmPref.TYPE_COMBOBOX: {
				value = control.getValue() || control.getText();
				break;
			}
		}
	}

	return setup.valueFunction ? setup.valueFunction(value) : value;
};

ZmAccountsPage.prototype._setControlVisible =
function(id, section, visible) {
	var control = section.controls[id];
	var setup = ZmAccountsPage.PREFS[id];
	if (control) control.setVisible(visible);
	var el = document.getElementById([this._htmlElId, section.id, id, "row"].join("_"));
	if (el) Dwt.setVisible(el, visible);
	return control || el ? visible : false;
};

ZmAccountsPage.prototype._setControlEnabled =
function(id, section, enabled) {
	var control = section.controls[id];
	var setup = ZmAccountsPage.PREFS[id];
	if (!control || !setup) return;

	control.setEnabled(enabled);
};

/**
 * If selected datasource has attr smtpEnabled to true, make the external controls
 * readOnly else editable.
 */

ZmAccountsPage.prototype._setExternalSectionControlsView =
function(section, toEnable) {
    var prefs,
        prefsLen,
        i,
        pref,
        signatureLinkElement,
        signatureTextSpan;

    prefs = section.prefs; // external sections prefs.
    prefsLen = prefs.length;
    signatureLinkElement = Dwt.getElement(this._htmlElId + "_External_Signatures_Link");
    signatureTextSpan    = Dwt.getElement(this._htmlElId + "_External_Signatures_Text");

    for (i = 0; i < prefsLen; i++) {
        pref = prefs[i];
        this._setControlEnabled(pref, section, toEnable); // Disable/enable external section pref, depending on the boolean value of attr smtpEnabled in selected Data Source.
    }
    if (toEnable) {
        Dwt.setVisible(signatureLinkElement,true);
        Dwt.setVisible(signatureTextSpan,false);
    }
    else {
        Dwt.setVisible(signatureLinkElement,false);
        Dwt.setVisible(signatureTextSpan,true);
    }
};

ZmAccountsPage.prototype._setAccountFields =
function(account, section, dontClearFolder) {
	if (!account || !section) return;

	for (var id in ZmAccountsPage.ACCOUNT_PROPS) {
		var control = section.controls[id];
		if (!control) {
			// HACK: default to new folder if control not available
			if (id == "DOWNLOAD_TO" && !dontClearFolder) {
				account.folderId = ZmAccountsPage.DOWNLOAD_TO_FOLDER; 
			}
			continue;
		}

		var prop = ZmAccountsPage.ACCOUNT_PROPS[id];
		var isField = AjxUtil.isString(prop);

		var ovalue = isField ? account[prop] : account[prop.getter]();
		var nvalue = this._getControlValue(id, section);
		if (this._valuesEqual(ovalue, nvalue)) continue;

		// special case: download-to
		if (id == "DOWNLOAD_TO" &&
		    ovalue != ZmOrganizer.ID_INBOX && nvalue != ZmOrganizer.ID_INBOX) {
			continue;
		}

		// handling visible is special
		if (id == "VISIBLE") {
			account._visibleDirty = true;
		} else {
			account._dirty = true;
		}

		if (AjxUtil.isString(prop)) {
			account[prop] = nvalue;
		}
		else {
			account[prop.setter](nvalue);
		}
	}

	var identity = account.getIdentity();
	for (var id in ZmAccountsPage.IDENTITY_PROPS) {
		var control = section.controls[id];
		if (!control) { continue; }

		var prop = ZmAccountsPage.IDENTITY_PROPS[id];
		var isField = AjxUtil.isString(prop);

		var ovalue = (isField ? identity[prop] : identity[prop.getter]())|| "";
		var nvalue = (this._getControlValue(id, section))||"";
        if (id == "FROM_EMAIL" && identity.sendFromAddressType == ZmSetting.SEND_ON_BEHALF_OF) ovalue = ZmMsg.sendOnBehalfOf + " " + ovalue;

        if (this._valuesEqual(ovalue, nvalue)) { continue; }

        if (id == "FROM_EMAIL" && nvalue.indexOf(ZmMsg.sendOnBehalfOf + " ") == 0) {
            nvalue = nvalue.replace(ZmMsg.sendOnBehalfOf + " ", "");
            identity.sendFromAddressType = ZmSetting.SEND_ON_BEHALF_OF;
        } else {
            identity.sendFromAddressType = ZmSetting.SEND_AS;
        }

		account._dirty = true;
		if (isField) {
			identity[prop] = nvalue;
		}
		else {
			identity[prop.setter](nvalue);
		}
	}
};

ZmAccountsPage.prototype._valuesEqual =
function(ovalue, nvalue) {
	if (AjxUtil.isArray(ovalue) && AjxUtil.isArray(nvalue)) {
		if (ovalue.length != nvalue.length) {
			return false;
		}
		var oarray = [].concat(ovalue).sort();
		var narray = [].concat(nvalue).sort();
		for (var i = 0; i < oarray.length; i++) {
			if (oarray[i] != narray[i]) {
				return false;
			}
		}
		return true;
	}
	return ovalue == nvalue;
};

// init ui

ZmAccountsPage.prototype._initControl =
function(id, setup, value, section) {
	ZmPreferencesPage.prototype._initControl.apply(this, arguments);
	if (id == "PROVIDER" && !setup.options) {
		var providers = AjxUtil.values(ZmDataSource.getProviders());
		providers.sort(ZmAccountsPage.__BY_PROVIDER_NAME);
		providers.unshift( { id: "", name: "Custom" } ); // TODO: i18n

		var options = new Array(providers.length);
		var displayOptions = new Array(providers.length);
		for (var i = 0; i < providers.length; i++) {
			var provider = providers[i];
			options[i] = provider.id;
			displayOptions[i] = provider.name;
		}

		setup.options = options;
		setup.displayOptions = displayOptions;
	}
};

ZmAccountsPage.prototype._setupInput =
function(id, setup, value) {
	if (id == "PASSWORD") {
		var input = new DwtPasswordField({ parent: this });
		input.setValue(value);
		this.setFormObject(id, input);
		return input;
	}
	var input = ZmPreferencesPage.prototype._setupInput.apply(this, arguments);
	switch (id) {
		case "NAME": {
			input.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleNameChange));
			break;
		}
		case "HOST": {
			input.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleHostChange));
			break;
		}
		case "EMAIL": {
			input.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleEmailChange));
			break;
		}
		case "USERNAME": {
			input.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleUserNameChange));
			break;
		}
		case "WHEN_SENT_TO_LIST": {
			input.setHint(appCtxt.get(ZmSetting.USERNAME));
			break;
		}
	}
	return input;
};

ZmAccountsPage.prototype._setupCheckbox =
function(id, setup, value) {
	var checkbox = ZmPreferencesPage.prototype._setupCheckbox.apply(this, arguments);
	if (id == "SSL") {
		checkbox.addSelectionListener(new AjxListener(this, this._handleTypeOrSslChange));
	}
	else if (id == "CHANGE_PORT") {
		checkbox.addSelectionListener(new AjxListener(this, this._handleChangePort));
	}
	else if (id == "REPLY_TO") {
		checkbox.addSelectionListener(new AjxListener(this, this._handleReplyTo));
	}
	else if (id == "WHEN_SENT_TO") {
		checkbox.addSelectionListener(new AjxListener(this, this._handleWhenSentTo));
	}
	else if (id == "WHEN_IN_FOLDER") {
		checkbox.addSelectionListener(new AjxListener(this, this._handleWhenInFolder));
	}
	return checkbox;
};

ZmAccountsPage.prototype._setupRadioGroup =
function(id, setup, value) {
	var container = ZmPreferencesPage.prototype._setupRadioGroup.apply(this, arguments);
	if (id == "ACCOUNT_TYPE") {
		var radioGroup = this.getFormObject("ACCOUNT_TYPE");
		radioGroup.addSelectionListener(new AjxListener(this, this._handleTypeChange));
	}
	return container;
};

ZmAccountsPage.prototype._setSelectFromLabels =
function( displayOptions, fromAddress){
 if (!this._selectFromLabels){
    var tmpArray1 = [];
    var tmpArray2 = [];
    var email  = null;
    var index = -1;
     // Add sendOnBehalfOf emails
    for (var i=0;i < appCtxt.sendOboEmails.length; i++){
      email = appCtxt.sendOboEmails[i].addr;
      index = -1;
      if (index = AjxUtil.indexOf(fromAddress,email) != -1)
          fromAddress.splice(index, 1);
      if (index = AjxUtil.indexOf(displayOptions,email) != -1)
           displayOptions.splice(index, 1);
      tmpArray2.push({label:(ZmMsg.sendOnBehalfOf + " " + email), value:(ZmMsg.sendOnBehalfOf + " " + email)});
    }

    // Add sendAs emails
    for (var i=0;i < appCtxt.sendAsEmails.length; i++){
      email = appCtxt.sendAsEmails[i].addr;
      index = -1;
      if ((index = AjxUtil.indexOf(fromAddress,email)) != -1)
          fromAddress.splice(index, 1);
      if ((index = AjxUtil.indexOf(displayOptions,email)) != -1)
           displayOptions.splice(index, 1);
      tmpArray2.push({label:email, value:email});
    }


    if (fromAddress && fromAddress.length)
        fromAddress = fromAddress.sort();

    if (displayOptions && displayOptions.length)
        displayOptions = displayOptions.sort();

    displayOptions = AjxUtil.mergeArrays(displayOptions, fromAddress);

    var length = displayOptions.length;
    for (var i=0;i<length; i++){
        tmpArray1.push({label:displayOptions[i], value:displayOptions[i]});
    }
    this._selectFromLabels =  tmpArray1.concat(tmpArray2);
 }
 return this._selectFromLabels;
};


ZmAccountsPage.prototype._setupSelect =
function(id, setup, value) {
	var select;
	if (id == "FROM_EMAIL") {
		setup.displayOptions = this._getAllAddresses();
		var fromAddress = appCtxt.get(ZmSetting.MAIL_FROM_ADDRESS);
        setup.options = this._setSelectFromLabels(setup.displayOptions, fromAddress );
        setup.choices = setup.options;
		if (appCtxt.get(ZmSetting.ALLOW_ANY_FROM_ADDRESS)) {
			select = this._setupComboBox(id, setup, value);
			// By setting the setSelectedValue method on the combox
			// box, it fakes the setter method of a DwtSelect.
			select.setSelectedValue = select.setValue;
			// NOTE: For this control, we always want the text value 
			select.getValue = select.getText;
		}
	}
	else if (setup.displayOptions && setup.displayOptions.length < 2) {
		select = this._setupInput(id, setup, value);
		select.setEnabled(false);
		select.setSelectedValue = select.setValue;
	}
	if (!select) {
		select = ZmPreferencesPage.prototype._setupSelect.apply(this, arguments);
	}
	if (id == "PROVIDER") {
		select.addChangeListener(new AjxListener(this, this._handleProviderChange));
	}
	return select;
};

ZmAccountsPage.__BY_PROVIDER_NAME = function(a, b) {
	if (a.name.match(/^zimbra/i)) return -1;
	if (b.name.match(/^zimbra/i)) return  1;
	if (a.name.match(/^yahoo/i)) return -1;
	if (b.name.match(/^yahoo/i)) return  1;
	return a.name.localeCompare(b.name);
};

ZmAccountsPage.prototype._setupComboBox =
function(id, setup, value) {
	if (id == "REPLY_TO_EMAIL") {
		var addresses = this._getAllAddresses();
		var accounts = [].concat(appCtxt.getDataSourceCollection().getImapAccounts(), appCtxt.getDataSourceCollection().getPopAccounts());
		addresses = this._getAddressesFromAccounts(accounts, addresses, true, true);
		setup.displayOptions = addresses;
	}
	return ZmPreferencesPage.prototype._setupComboBox.apply(this, arguments);
};

ZmAccountsPage.prototype._updateComboBox =
function(id, extras) {
	var dwtElement = this.getFormObject(id);
	if (dwtElement && AjxUtil.isFunction(dwtElement.removeAll) && AjxUtil.isFunction(dwtElement.add)) {
		if (id == "REPLY_TO_EMAIL") {
			if (!AjxUtil.isArray(extras))
				extras = AjxUtil.isString(extras) ? [extras] : [];

			var addresses = this._getAllAddresses().concat(extras);
			var accounts = this._accounts.getArray();
			addresses = this._getAddressesFromAccounts(accounts, addresses, true, true);
				    
			dwtElement.removeAll();
			for (var i=0; i<addresses.length; i++) {
				dwtElement.add(addresses[i], addresses[i], false);
			}
		}
	}
};





ZmAccountsPage.prototype._setupCustom =
function(id, setup, value) {
	if (id == ZmSetting.ACCOUNTS) {
		// setup list
		var listView = this._accountListView = new ZmAccountsListView(this);
		listView.addSelectionListener(new AjxListener(this, this._handleAccountSelection));
		this.setFormObject(id, listView);

		// setup buttons
		this._setupButtons();

		// setup account sections
		this._setupPrimaryDiv();
		this._setupExternalDiv();
		this._setupPersonaDiv();

		// initialize list
		this._resetAccountListView();

		return listView;
	}
	if (id == "TEST") {
		var button = new DwtButton({parent:this});
		button.setText(setup.displayName);
		button.addSelectionListener(new AjxListener(this, this._handleTestButton));
		return button;
	}
	if (id == "WHEN_IN_FOLDER_BUTTON") {
		var button = new DwtButton({parent:this});
		button.setImage("SearchFolder");
		button.addSelectionListener(new AjxListener(this, this._handleFolderButton));
		return button;
	}
	if (id == "ALERT") {
		return new DwtAlert(this);
	}

	return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

ZmAccountsPage.prototype._getAllAddresses =
function() {
	var username = appCtxt.get(ZmSetting.USERNAME);
	var addresses = appCtxt.get(ZmSetting.ALLOW_FROM_ADDRESSES);
	var aliases = appCtxt.get(ZmSetting.MAIL_ALIASES);
	return [].concat(username, addresses, aliases);
};

/*
 * Takes a list of accounts and extracts their email addresses
 * @param accounts	array of account objects
 * @param unique	boolean: if true, addresses will be included in output only if they are not already present. Defaults to true
 * @param valid		boolean: if true, performs a validation check on the address and only includes it if it passes. Defaults to true
 * @param addresses	optional array of addresses (as strings) to append to. Defaults to an empty array
*/
ZmAccountsPage.prototype._getAddressesFromAccounts = function(accounts, addresses, unique, valid) {
	if (!AjxUtil.isArray(addresses))
		addresses = [];
	for (var i=0; i<accounts.length; i++) {
		var account = accounts[i];
		if (account.isMain || account.enabled) {
			var address = account.getEmail();
			if (!AjxUtil.isEmpty(address) && (!valid || AjxEmailAddress.isValid(address)) && (!unique || AjxUtil.indexOf(addresses, address, false) == -1)) // Make sure we are not adding an empty address and that we are not adding the address twice
				addresses.push(address);
		}
	}
	return addresses;
};

ZmAccountsPage.prototype._resetAccountListView =
function(accountOrIndex) {
	var accounts = this._accounts.clone();
	var count = accounts.size();
	// NOTE: We go backwards so we don't have to adjust index when we remove an item.
	for (var i = count - 1; i >= 0; i--) {
		var account = accounts.get(i);
		if (account.type == ZmAccount.TYPE_ZIMBRA && !account.isMain && !account.visible) {
			accounts.removeAt(i);
		}
	}
	this._accountListView.set(accounts);
	var account = accountOrIndex;
	if (AjxUtil.isNumber(account)) {
		var index = accountOrIndex;
		var list = this._accountListView.getList();
		var size = list.size();
		if (accountOrIndex >= size) {
			index = size - 1;
		}
		account = list.get(index);
	}
	this._accountListView.setSelection(account || appCtxt.accountList.mainAccount);
	this._updateReplyToEmail();
};

// account buttons

ZmAccountsPage.prototype._setupButtons =
function() {
	var deleteButtonDiv = document.getElementById(this._htmlElId+"_DELETE");
	if (deleteButtonDiv) {
		var button = new DwtButton({parent:this});
		button.setText(ZmMsg.del);
		button.setEnabled(false);
		button.addSelectionListener(new AjxListener(this, this._handleDeleteButton));
		this._replaceControlElement(deleteButtonDiv, button);
		this._deleteButton = button;
	}

	var addExternalButtonDiv = document.getElementById(this._htmlElId+"_ADD_EXTERNAL");
	if (addExternalButtonDiv) {
		var button = new DwtButton({parent:this});
		button.setText(ZmMsg.addExternalAccount);
		button.addSelectionListener(new AjxListener(this, this._handleAddExternalButton));
		this._replaceControlElement(addExternalButtonDiv, button);
		this._addExternalButton = button;
	}

	var addPersonaButtonDiv = document.getElementById(this._htmlElId+"_ADD_PERSONA");
	if (addPersonaButtonDiv) {
		var button = new DwtButton({parent:this});
		button.setText(ZmMsg.addPersona);
		button.addSelectionListener(new AjxListener(this, this._handleAddPersonaButton));
		this._replaceControlElement(addPersonaButtonDiv, button);
		this._addPersonaButton = button;
	}
};

// account sections


ZmAccountsPage.prototype._getSectionDiv =
function(account) {
	return appCtxt.isOffline
		? ((account.type == ZmAccount.TYPE_PERSONA) ? this._sectionDivs[account.type] : this._sectionDivs[ZmAccount.TYPE_ZIMBRA] )
		: this._sectionDivs[account.type];
};

ZmAccountsPage.prototype._setupPrimaryDiv =
function() {
	var div = document.getElementById(this._htmlElId+"_PRIMARY");
	if (div) {
		this._sectionDivs[ZmAccount.TYPE_ZIMBRA] = div;
		this._createSection("PRIMARY", div);
	}
};

ZmAccountsPage.prototype._setupExternalDiv =
function() {
	// setup generic external account div
	var div = document.getElementById(this._htmlElId+"_EXTERNAL");
	if (div) {
		this._sectionDivs[ZmAccount.TYPE_POP] = div;
		this._sectionDivs[ZmAccount.TYPE_IMAP] = div;
		this._createSection("EXTERNAL", div);
	}

	// setup divs for specific providers
	var providers = ZmDataSource.getProviders();
	for (var id in providers) {
		var div = document.getElementById([this._htmlElId, id].join("_"));
		if (!div) continue;
		this._sectionDivs[id] = div;
		this._createSection(id, div);
	}
};

ZmAccountsPage.prototype._setupPersonaDiv =
function() {
	var div = document.getElementById(this._htmlElId+"_PERSONA");
	if (div) {
		this._sectionDivs[ZmAccount.TYPE_PERSONA] = div;
		this._createSection("PERSONA", div);
	}
};

ZmAccountsPage.prototype._createSection =
function(name, sectionDiv) {
	var section = ZmAccountsPage.SECTIONS[name];
	var prefIds = section && section.prefs;
	if (!prefIds) return;

	this._enterTabScope();
	try {
		this._addTabLinks(sectionDiv);

		section.controls = {};

		var prefs = ZmAccountsPage.PREFS;
		for (var i = 0; i < prefIds.length; i++) {
			var id = prefIds[i];
			var setup = prefs[id];
			if (!setup) continue;

			var containerId = [this._htmlElId, name, id].join("_");
			var containerEl = document.getElementById(containerId);
			if (!containerEl) continue;

			this._initControl(id, setup, value, name);

			var type = setup.displayContainer;
			var value = null;
			var control;
			switch (type) {
				case ZmPref.TYPE_STATIC: {
					control = this._setupStatic(id, setup, value);
					break;
				}
				case ZmPref.TYPE_INPUT: {
					control = this._setupInput(id, setup, value);
					break;
				}
				case ZmPref.TYPE_SELECT: {
					control = this._setupSelect(id, setup, value);
					break;
				}
				case ZmPref.TYPE_COMBOBOX: {
					control = this._setupComboBox(id, setup, value);
					break;
				}
				case ZmPref.TYPE_CHECKBOX: {
					control = this._setupCheckbox(id, setup, value);
					break;
				}
				case ZmPref.TYPE_RADIO_GROUP: {
					control = this._setupRadioGroup(id, setup, value);
					break;
				}
				case ZmPref.TYPE_CUSTOM: {
					control = this._setupCustom(id, setup, value);
					break;
				}
				default: continue;
			}

			if (control) {
				if (name == "PRIMARY" && id == "EMAIL") {
					control.setEnabled(false);
				}
				this._replaceControlElement(containerEl, control);
				if (type == ZmPref.TYPE_RADIO_GROUP) {
					control = this.getFormObject(id);
				}
				section.controls[id] = control;
			}
		}

		section.tabGroup = new DwtTabGroup(name);
		this._addControlsToTabGroup(section.tabGroup);
	}
	finally {
		this._exitTabScope();
	}
};

// listeners

ZmAccountsPage.prototype._handleAccountSelection =
function(evt) {
	var account = this._accountListView.getSelection()[0];
	this.setAccount(account);
};

ZmAccountsPage.prototype._handleDeleteButton =
function(evt) {
	var account = this._accountListView.getSelection()[0];
	if (!account._new) {
		account._deleted = true;
		this._deletedAccounts.push(account);
	}
	var index = this._accountListView.getItemIndex(account);
    if (account.type == ZmAccount.TYPE_PERSONA) {
        var personaList = ZmNewPersona.getPersonaList(this._accountListView.getList().getArray());
        var personaListLength = personaList.length;

        // If there's only one persona or the last added persona are being deleted then reset the personal display count.
        if (personaListLength === 1) {
            ZmNewPersona.ID = 0;
        }
        else if (personaListLength === index) {
            if (ZmNewPersona.ID > 0) {
                ZmNewPersona.ID--;
            }
        }
    }

    this._accounts.remove(account);
	this._resetAccountListView(index);
};

ZmAccountsPage.prototype._handleAddExternalButton =
function(evt) {
	var account = new ZmNewDataSource();
	this._accounts.add(account);
	this._accounts.sort(ZmAccountsPage.__ACCOUNT_COMPARATOR);
	this._resetAccountListView(account);
};

ZmAccountsPage.prototype._handleAddPersonaButton =
function(evt) {
	var persona = new ZmNewPersona();
	this._accounts.add(persona);
	this._accounts.sort(ZmAccountsPage.__ACCOUNT_COMPARATOR);
	this._resetAccountListView(persona);
};

ZmAccountsPage.prototype._updateList =
function(account) {
	var lv = this._accountListView;
    var email = AjxStringUtil.htmlEncode(account.getEmail());
    var identity = account.getIdentity();
    if (!account.isMain && identity && identity.sendFromAddressType == ZmSetting.SEND_ON_BEHALF_OF){
        email = appCtxt.getUsername() + " " + ZmMsg.sendOnBehalfOf + " " + email;
    }

	lv.setCellContents(account, ZmItem.F_NAME, AjxStringUtil.htmlEncode(account.getName()));
	lv.setCellContents(account, ZmItem.F_EMAIL,email);
	lv.setCellContents(account, ZmItem.F_TYPE, AjxStringUtil.htmlEncode(lv._getAccountType(account)));
};

// generic listeners

ZmAccountsPage.prototype._handleNameChange =
function(evt) {
	var inputEl = DwtUiEvent.getTarget(evt);
	var newName = inputEl.value;
	this._accountListView.setCellContents(this._currentAccount, ZmItem.F_NAME, AjxStringUtil.htmlEncode(newName));
	this._setControlValue("HEADER", this._currentSection, newName);

	if (this._currentAccount.identity) {
		this._currentAccount.identity.name = newName;
	}

	var type = this._currentAccount.type;
	if (type == ZmAccount.TYPE_POP || type == ZmAccount.TYPE_IMAP) {
		this._setDownloadToFolder(this._currentAccount);
	}
};

ZmAccountsPage.prototype._handleEmailChange =
function(evt) {
	// update email cell
	var section = this._currentSection;
	var email = this._getControlValue("EMAIL", section);
	this._updateEmailCell(email);

	// auto-fill username and host
	var m = email.match(/^(.*?)(?:@(.*))?$/);
	if (!m) return;

	var dataSource = this._currentAccount;
	if (dataSource.userName == "") {
		this._setControlValue("USERNAME", section, m[1]);
	}
	if (m[2] && dataSource.mailServer == "") {
		this._setControlValue("HOST", section, m[2]);
	}
	this._updateReplyToEmail(email);
};

ZmAccountsPage.prototype._updateEmailCell =
function(email) {
	this._accountListView.setCellContents(this._currentAccount, ZmItem.F_EMAIL, AjxStringUtil.htmlEncode(email));
};

ZmAccountsPage.prototype._updateReplyToEmail =
function(email) {
	if (AjxEmailAddress.isValid(email)) {
		this._updateComboBox("REPLY_TO_EMAIL", email);
	} else {
		this._updateComboBox("REPLY_TO_EMAIL");
	}
};

// data source listeners

ZmAccountsPage.prototype._handleTypeChange =
function(evt) {
	var type = ZmAccount.getTypeName(this._getControlValue("ACCOUNT_TYPE", this._currentSection));
	this._accountListView.setCellContents(this._currentAccount, ZmItem.F_TYPE, AjxStringUtil.htmlEncode(type));
	this._handleTypeOrSslChange(evt);
};

ZmAccountsPage.prototype._handleDownloadTo =
function(evt) {
	var isInbox = this._getControlValue("DOWNLOAD_TO", this._currentSection) == ZmAccountsPage.DOWNLOAD_TO_INBOX;
	this._currentAccount.folderId = isInbox ? ZmOrganizer.ID_INBOX : -1; 
};

ZmAccountsPage.prototype._handleProviderChange =
function() {
	var id = this._getControlValue("PROVIDER", this._currentSection);
	var dataSource = this._currentAccount;

	// initialize data source
	if (id) {
		var provider = ZmDataSource.getProviders()[id];
		if (!provider) return;

		// init default values
		dataSource.reset();
		for (var p in provider) {
			if (p == "id") continue;
			if (p == "type") {
				dataSource.setType(provider[p]);
				continue;
			}
			if (ZmDataSource.DATASOURCE_ATTRS[p]) {
				dataSource[ZmDataSource.DATASOURCE_ATTRS[p]] = provider[p];
			}
		}
	}

	// reset interface
	var skipUpdate = true;
	var ignoreProvider = id == "";
	this.setAccount(dataSource, skipUpdate, ignoreProvider);
};

ZmAccountsPage.prototype._handleTypeOrSslChange =
function(evt) {
	var dataSource = this._currentAccount;
	var section = this._currentSection;
	if (dataSource._new) {
		var type = this._getControlValue("ACCOUNT_TYPE", section);
		if (!type) {
			type = appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED) ? ZmAccount.TYPE_POP : ZmAccount.TYPE_IMAP;
		}
		dataSource.setType(type);

		var isPop = type == ZmAccount.TYPE_POP;
		this._setControlEnabled("DELETE_AFTER_DOWNLOAD", this._currentSection, isPop);
		this._setControlEnabled("DOWNLOAD_TO", this._currentSection, isPop);
	}

	var ssl = this._getControlValue("SSL", section) == ZmDataSource.CONNECT_SSL;
	dataSource.connectionType = ssl ? ZmDataSource.CONNECT_SSL : ZmDataSource.CONNECT_CLEAR;
	dataSource.port = dataSource.getDefaultPort();
	this._setPortControls(dataSource.type, dataSource.connectionType, dataSource.port);
};

ZmAccountsPage.prototype._handleUserNameChange =
function(evt) {
	var userName = this._getControlValue("USERNAME", this._currentSection);
	this._currentAccount.userName = userName;
	if (!this._getControlValue("EMAIL", this._currentSection)) {
		var provider = ZmDataSource.getProviderForAccount(this._currentAccount);
		var email = userName && provider && provider._host ? [userName,provider._host].join("@") : userName;
		this._updateEmailCell(email);
	}
};

ZmAccountsPage.prototype._handleHostChange =
function(evt) {
	this._currentAccount.mailServer = this._getControlValue("HOST", this._currentSection);
};

ZmAccountsPage.prototype._handleChangePort =
function(evt) {
	this._setControlEnabled("PORT", this._currentSection, evt.detail);
};

ZmAccountsPage.prototype._handleTestButton =
function(evt) {
	var button = evt.item;
	button.setEnabled(false);

	// make sure that the current object proxy is up-to-date
	var dataSource = this._currentAccount;
	this._setAccountFields(dataSource, this._currentSection);

	// check values
	if (!dataSource.userName || !dataSource.mailServer || !dataSource.port) {
		appCtxt.setStatusMsg(ZmMsg.accountTestErrorMissingInfo, ZmStatusView.LEVEL_CRITICAL);
		button.setEnabled(true);
		return;
	}

	// testconnection
	var accounts = [ dataSource ];
	var callback = new AjxCallback(this, this._testFinish, [button]);
	this._testAccounts(accounts, callback, callback);
};

ZmAccountsPage.prototype._testFinish =
function(button) {
	button.setEnabled(true);
};

// identity listeners

ZmAccountsPage.prototype._handleReplyTo =
function(evt) {
	this._setReplyToControls();
};

ZmAccountsPage.prototype._handleWhenSentTo =
function(evt) {
	this._setWhenSentToControls();
};

ZmAccountsPage.prototype._handleWhenInFolder =
function(evt) {
	this._setWhenInFolderControls();
};

ZmAccountsPage.prototype._handleFolderButton =
function(evt) {
	if (!this._folderAddCallback) {
		this._folderAddCallback = new AjxCallback(this, this._handleFolderAdd);
	}
	var dialog = appCtxt.getChooseFolderDialog();
	var params = {overviewId: dialog.getOverviewId(ZmApp.MAIL), appName:ZmApp.MAIL};
	ZmController.showDialog(dialog, this._folderAddCallback, params);
};

ZmAccountsPage.prototype._handleFolderAdd =
function(folder) {
	var section = this._currentSection;
	var folders = this._getControlValue("WHEN_IN_FOLDER_LIST", section);
	if (!folders) return;

	folders.push(folder.id);
	this._setControlValue("WHEN_IN_FOLDER_LIST", section, folders);
	appCtxt.getChooseFolderDialog().popdown();
};

// pre-save callbacks

ZmAccountsPage.prototype._preSave =
function(continueCallback) {
    // make sure that the current object proxy is up-to-date
    this._setAccountFields(this._currentAccount, this._currentSection);

    if (appCtxt.isOffline) {
        // skip account tests  
        this._preSaveCreateFolders(continueCallback);
    } else {
        // perform account tests
        this._preSaveTest(continueCallback);
    }

};

ZmAccountsPage.prototype._preSaveTest =
function(continueCallback) {
	// get dirty external accounts
	var dirtyAccounts = [];
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		if (account.type == ZmAccount.TYPE_POP || account.type == ZmAccount.TYPE_IMAP) {
			if (account._new || account._dirty) {
				dirtyAccounts.push(account);
			}
		}
	}

	// test for invalid name
	for (var i = 0; i < dirtyAccounts.length; i++) {
		var account = dirtyAccounts[i];
		if (account.type == ZmAccount.TYPE_IMAP && account.name.match(/^\s*inbox\s*$/i)) {
			var params = {
				msg: AjxMessageFormat.format(ZmMsg.accountNameReserved, [AjxStringUtil.htmlEncode(account.name)]),
				level: ZmStatusView.LEVEL_CRITICAL
			};
			appCtxt.setStatusMsg(params);
			continueCallback.run(false);
			return;
		}
	}

	// test external accounts
	if (dirtyAccounts.length > 0) {
		var okCallback = new AjxCallback(this, this._preSaveTestOk, [continueCallback, dirtyAccounts]);
		var cancelCallback = new AjxCallback(this, this._preSaveTestCancel, [continueCallback]);
		this._testAccounts(dirtyAccounts, okCallback, cancelCallback);
	}

	// perform next step
	else {
		this._preSaveCreateFolders(continueCallback);
	}
};

ZmAccountsPage.prototype._preSaveTestOk =
function(continueCallback, accounts, successes) {
	// en/disable accounts based on test results 
	for (var i = 0; i < accounts.length; i++) {
		accounts[i].enabled = successes[i];
	}

	// continue
	this._preSaveCreateFolders(continueCallback);
};

ZmAccountsPage.prototype._preSaveTestCancel =
function(continueCallback) {
	if (continueCallback) {
		continueCallback.run(false);
	}
};

ZmAccountsPage.prototype._preSaveCreateFolders =
function(continueCallback) {
	var batchCmd;
	var root = appCtxt.getById(ZmOrganizer.ID_ROOT);
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		if (account.type == ZmAccount.TYPE_POP || account.type == ZmAccount.TYPE_IMAP) {
			if (account.folderId != ZmOrganizer.ID_INBOX) {
				var name = AjxStringUtil.trim(account.getName());
				if (!batchCmd) { batchCmd = new ZmBatchCommand(false); }

				// avoid folder create if it already exists
				var folder = root.getByName(name, true);
				if (folder) {
					var folderId = folder.id;
					if (folder.type !== ZmId.ORG_FOLDER) {
						if (folder.parent.id == ZmOrganizer.ID_ROOT) {
							//e.g. calendar that's child of root - wouldn't be able to create the folder for the account with that same name. (despite it being mail). So bail.
							var params = {
								msg: AjxMessageFormat.format(ZmMsg.errorAlreadyExists, [AjxStringUtil.htmlEncode(name), ZmMsg[folder.type.toLowerCase()]]),
								level: ZmStatusView.LEVEL_CRITICAL
							};
							appCtxt.setStatusMsg(params);
							continueCallback.run(false);
							return;
						}
						//otherwise this continues on with creating the folder since this folder is not interfering (it's not a root child folder)
					}
					else if (folderId != ZmOrganizer.ID_INBOX && Number(folderId) < 256) {
						var params = {
							msg: AjxMessageFormat.format(ZmMsg.accountNameReserved, [AjxStringUtil.htmlEncode(name)]),
							level: ZmStatusView.LEVEL_CRITICAL
						};
						appCtxt.setStatusMsg(params);
						continueCallback.run(false);
						return;
					}
					// if there already is a folder by this name in Trash, rename the trashed folder
					else if (folder.isInTrash()) {
						folder.rename(folder.name+"_");
					}
					else {
						account.folderId = folder.id;
						continue;
					}
				}

				// this means user modified name of the folder, so let's rename it
				folder = account._object_ && appCtxt.getById(account._object_.folderId);
				if (folder && Number(folder.id) >= 256) {
					if (folder.name != name) {
						var soapDoc = AjxSoapDoc.create("FolderActionRequest", "urn:zimbraMail");
						var actionNode = soapDoc.set("action");
						actionNode.setAttribute("op", "rename");
						actionNode.setAttribute("id", folder.id);
						actionNode.setAttribute("name", name);

						var callback = new AjxCallback(this, this._handleRenameFolderResponse, [account, folder]);
						batchCmd.addNewRequestParams(soapDoc, callback, callback);
					}
					else {
						account.folderId = folder.id;
					}
				} else {
					var soapDoc = AjxSoapDoc.create("CreateFolderRequest", "urn:zimbraMail");
					var folderEl = soapDoc.set("folder");
					folderEl.setAttribute("l", ZmOrganizer.ID_ROOT);
					folderEl.setAttribute("name", name);
					folderEl.setAttribute("fie", "1"); // fetch-if-exists

					var callback = new AjxCallback(this, this._handleCreateFolderResponse, [account]);
					batchCmd.addNewRequestParams(soapDoc, callback, callback);
				}
			}
		}
	}

	// continue
	if (batchCmd && batchCmd.size() > 0) {
		// HACK: Don't know a better way to set an error condition
		this.__hack_preSaveSuccess = true;
		var callback = new AjxCallback(this, this._preSaveFinish, [continueCallback]);
		batchCmd.run(callback);
	}
	else {
		this._preSaveFinish(continueCallback);
	}
};

ZmAccountsPage.prototype._handleCreateFolderResponse =
function(dataSource, result) {
	var resp = result && result._data && result._data.CreateFolderResponse;
	if (resp) {
		dataSource.folderId = ZmOrganizer.normalizeId(resp.folder[0].id);
	}
	else {
		// HACK: Don't know a better way to set an error condition
		this.__hack_preSaveSuccess = false;
	}
};

ZmAccountsPage.prototype._handleRenameFolderResponse =
function(dataSource, folder, result) {
	var resp = result && result._data && result._data.FolderActionResponse;
	if (resp) {
		dataSource.folderId = ZmOrganizer.normalizeId(folder.id);
	}
	else {
		// HACK: Don't know a better way to set an error condition
		this.__hack_preSaveSuccess = false;
	}
};

ZmAccountsPage.prototype._preSaveFinish =
function(continueCallback, result, exceptions) {
	// HACK: Don't know a better way to set an error condition
	continueCallback.run(this.__hack_preSaveSuccess && (!exceptions || exceptions.length == 0));
};

// save callbacks

ZmAccountsPage.prototype._handleSaveAccount =
function(account, resp) {

	delete account._dirty;

	var mboxes = appCtxt.accountList.getAccounts();
	var active = appCtxt.getActiveAccount();

	// Save data from old proxies to proxied objects
	for (var j in mboxes) {
		var acct = mboxes[j];
		if (active.isMain || acct == active) {
			var acct = ZmAccountsPage.__unProxy(mboxes[j]._proxy_);
			if (acct) {
				mboxes[j] = acct;
			}
		}
	}
};

ZmAccountsPage.prototype._handleSaveVisibleAccount =
function() {
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		account._object_.visible = account.visible;
		delete account._visibleDirty;
	}
	var setting = appCtxt.getSettings().getSetting(ZmSetting.CHILD_ACCTS_VISIBLE);
	setting._notify(ZmEvent.E_MODIFY);
};

ZmAccountsPage.prototype._handleCreateAccount =
function(account, resp) {
	delete account._new;
	account._needsSync = true;
};

ZmAccountsPage.prototype._doDeleteCallback = function(organizer) {
	// Filter the accounts and skip persona if there is any in this particular delete operation
	var onlyAccounts = AjxUtil.filter(this._deletedAccounts, function(a) { if(a.type !== ZmAccount.TYPE_PERSONA) {return a} });
	this._deleteResponseReceived.push(organizer);
	if (onlyAccounts.length === this._deleteResponseReceived.length) {
		this._promptToDeleteFolder(this._deleteResponseReceived);
	}
};

ZmAccountsPage.prototype._promptToDeleteFolder = function(organizer) {
	var dialog = appCtxt.getConfirmationDialog();
	var folderName = AjxUtil.map(organizer, function(o) { return o.getName()});
	var prompt = AjxMessageFormat.format(ZmMsg.accountDeleteFolder, [folderName.join(", ")]);
	var callback = new AjxCallback(this, this._handleDeleteFolder, [organizer]);
	dialog.popup(prompt, callback);
};

ZmAccountsPage.prototype._handleDeleteFolder = function(organizer) {
	var trash = appCtxt.getById(ZmOrganizer.ID_TRASH);
	organizer.forEach(function(o){o.move(trash)});
	this._deleteResponseReceived = [];
};


ZmAccountsPage.prototype._postSave =
function() {
	var needsSync = [];
	var accounts = this._accounts.getArray();
	for (var i = 0; i < accounts.length; i++) {
		var account = accounts[i];
		if (account._needsSync) {
			needsSync.push(account);
		}
		if (account instanceof ZmDataSource) {
			delete account.password;
		}
	}

	if (needsSync.length) {
	    var dsCollection = AjxDispatcher.run("GetDataSourceCollection");
		for (var i = 0; i < needsSync.length; i++) {
			var account = needsSync[i];
			dsCollection.importMailFor(account.folderId);
			delete account._needsSync;
		}
	}
};

ZmAccountsPage.prototype._handleAddApplicationCode =
function() {
	if (!this._addApplicationCodeDlg) {
		var appPasscodeCallback = this._getAppSpecificPasswords.bind(this);
		this._addApplicationCodeDlg = new ZmApplicationCodeDialog(appPasscodeCallback);
	}
	this._addApplicationCodeDlg.popup();
};

ZmAccountsPage.prototype._revokeApplicationCode =
function() {
	var item = this.appPasscodeList.getSelection()[0];
	if (item) {
		var jsonObj = {RevokeAppSpecificPasswordRequest : {_jsns : "urn:zimbraAccount", appName : item.appName}};
		var respCallback = this._handleRevokeApplicationCode.bind(this);
		appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
	}
};

ZmAccountsPage.prototype._handleRevokeApplicationCode =
function() {
	this._getAppSpecificPasswords();
};

ZmAccountsPage.prototype._getAppSpecificPasswords =
function() {
	var jsonObj = {GetAppSpecificPasswordsRequest : {_jsns : "urn:zimbraAccount"}};
	var respCallback = this._getAppSpecificPasswordsCallback.bind(this);
	appCtxt.getAppController().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:respCallback});
};

ZmAccountsPage.prototype._getAppSpecificPasswordsCallback =
function(appSpecificPasswords) {
	var applicationCodesElement = document.getElementById(this._htmlElId + "_APPLICATION_CODES") || (this.appPasscodeList && this.appPasscodeList.getHtmlElement());
	var appSpecificPasswordsList = this._setAppSpecificPasswords(appSpecificPasswords);
	if (!appSpecificPasswordsList) {
		appSpecificPasswordsList = new AjxVector();
	}
	var appPasscodeList = new ZmAccountAppPasscodeListView(this);
	this.appPasscodeList = appPasscodeList;
	appPasscodeList.replaceElement(applicationCodesElement);
	appPasscodeList.set(appSpecificPasswordsList);
	appPasscodeList.addSelectionListener(this._appPasscodeSelectionListener.bind(this));
	this.revokeApplicationCodeButton.setEnabled(false);
};

ZmAccountsPage.prototype._setAppSpecificPasswords =
function(appSpecificPasswords) {
	var response = appSpecificPasswords.getResponse();
	if (!response || !response.GetAppSpecificPasswordsResponse) {
		return;
	}
	var appSpecificPasswordsResponse = response.GetAppSpecificPasswordsResponse;
	var passwordData =  appSpecificPasswordsResponse && appSpecificPasswordsResponse.appSpecificPasswords && appSpecificPasswordsResponse.appSpecificPasswords.passwordData;
	if (!passwordData) {
		return;
	}
	var vector = AjxVector.fromArray(passwordData);
	vector.sort(this._compareAppPasscodes);
	return vector;
};

ZmAccountsPage.prototype._compareAppPasscodes =
function(a, b) {
	return a.appName < b.appName ? -1 : (a.appName > b.appName ? 1 : 0);
};

ZmAccountsPage.prototype._appPasscodeSelectionListener =
function() {
	this.revokeApplicationCodeButton.setEnabled(!!this.appPasscodeList.getSelectionCount());
};

//
// Private functions
//

ZmAccountsPage.__ACCOUNT_COMPARATOR =
function(a, b) {
	if (a.type == ZmAccount.TYPE_ZIMBRA && (a.isMain || appCtxt.isOffline)) return -1;
	if (b.type == ZmAccount.TYPE_ZIMBRA && (b.isMain || appCtxt.isOffline)) return 1;
	return a.getName().localeCompare(b.getName());
};

ZmAccountsPage.__createProxy =
function(account) {
	delete account._object_;
	var identity = account.getIdentity();
	var identityProxy = AjxUtil.createProxy(identity);
	var proxy = AjxUtil.createProxy(account);
	proxy._identity = identityProxy;
	account._proxy_ = proxy;
	proxy.getIdentity = AjxCallback.simpleClosure(function(){return this._identity}, proxy, identityProxy);
	return proxy;
};

ZmAccountsPage.__proxy_getIdentity =
function(identity) {
	return identity;
};

ZmAccountsPage.__unProxy =
function(accountProxy) {
	var account = AjxUtil.unProxy(accountProxy);
	if (!account) return accountProxy;
	var identityProxy = accountProxy._identity;
	var identity = AjxUtil.unProxy(identityProxy);
	account.getIdentity = AjxCallback.simpleClosure(ZmAccountsPage.__proxy_getIdentity, account, identity);
	return account;
}

//
// Classes
//

ZmAccountsListView = function(parent, className, posStyle, noMaximize) {
	className = className || "DwtListView";
	className += " ZOptionsItemsListView";
	DwtListView.call(this, {parent:parent, className:className, posStyle:posStyle,
							headerList:this._getHeaderList(), noMaximize:noMaximize});
	this.setMultiSelect(false);
	this._view = ZmId.VIEW_ACCOUNT;
};
ZmAccountsListView.prototype = new DwtListView;
ZmAccountsListView.prototype.constructor = ZmAccountsListView;

ZmAccountsListView.prototype.toString =
function() {
	return "ZmAccountsListView";
};

// Constants

ZmAccountsListView.WIDTH_NAME	= ZmMsg.COLUMN_WIDTH_NAME_ACC;
ZmAccountsListView.WIDTH_STATUS	= ZmMsg.COLUMN_WIDTH_STATUS_ACC;
ZmAccountsListView.WIDTH_TYPE	= ZmMsg.COLUMN_WIDTH_TYPE_ACC;

// Public methods

ZmAccountsListView.prototype.getCellElement =
function(account, field) {
	return document.getElementById(this._getCellId(account, field));
};

ZmAccountsListView.prototype.setCellContents =
function(account, field, html) {
	var el = this.getCellElement(account, field);
	if (!el) { return; }

	if (field == ZmItem.F_NAME) {
		el = document.getElementById(this._getCellId(account, field)+"_name");
    }
    if (field == ZmItem.F_EMAIL) {
        html = "<div style='margin-left: 10px;'>"+ html +"</div>";    
    }
	el.innerHTML = html;
};

// Protected methods

ZmAccountsListView.prototype._getCellContents =
function(buffer, i, item, field, col, params) {
	if (field == ZmItem.F_NAME) {
		var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_name'>";
		buffer[i++] = AjxStringUtil.htmlEncode(item.getName());
		buffer[i++] = "</div>";
		return i;
	}
	if (field == ZmItem.F_STATUS) {
		if (item instanceof ZmDataSource && !item.isStatusOk()) {
			buffer[i++] = "<table role='presentation' border=0 cellpadding=0 cellpadding=0><tr>";
			buffer[i++] = "<td><div class='ImgCritical_12'></div></td><td>";
			buffer[i++] = ZmMsg.ALT_ERROR;
			buffer[i++] = "</td></tr></table>";
		}
		else {
			buffer[i++] = AjxMsg.ok;
		}
		return i;
	}
	if (field == ZmItem.F_EMAIL) {
        var email = item.getEmail();
        var identity = item.getIdentity();
        if (!item.isMain && identity.sendFromAddressType == ZmSetting.SEND_ON_BEHALF_OF) email = appCtxt.getActiveAccount().name + " " + ZmMsg.sendOnBehalfOf + " " + email;
		buffer[i++] = "<div style='margin-left: 10px;'>"+ AjxStringUtil.htmlEncode(email) +"</div>";
		return i;
	}
	if (field == ZmItem.F_TYPE) {
		buffer[i++] = this._getAccountType(item);
		return i;
	}
	return DwtListView.prototype._getCellContents.apply(this, arguments);
};

ZmAccountsListView.prototype._getCellId =
function(item, field, params) {
	return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_CELL, this._view, item.id, field);
};

ZmAccountsListView.prototype._getHeaderList =
function() {
	return [
		new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg.accountName, width:ZmAccountsListView.WIDTH_NAME}),
		new DwtListHeaderItem({field:ZmItem.F_STATUS, text:ZmMsg.status, width:ZmAccountsListView.WIDTH_STATUS, align:"center"}),
		new DwtListHeaderItem({field:ZmItem.F_EMAIL, text:ZmMsg.emailAddr}),
		new DwtListHeaderItem({field:ZmItem.F_TYPE, text:ZmMsg.type, width:ZmAccountsListView.WIDTH_TYPE})
	];
};

ZmAccountsListView.prototype._getAccountType =
function(account) {
	var provider = ZmDataSource.getProviderForAccount(account);
	return (provider && AjxStringUtil.htmlEncode(provider.name)) || (account.isMain ? ZmMsg.accountTypePrimary : ZmAccount.getTypeName(account.type));
};

// Delegate Permissions

ZmAccountDelegatesListView = function(parent, className, posStyle, noMaximize) {
	className = className || "DwtListView";
	className += " ZOptionsItemsListView";
	DwtListView.call(this, {parent:parent, className:className, posStyle:posStyle,
							headerList:this._getHeaderList(), noMaximize:noMaximize});
	this.setMultiSelect(false);
};
ZmAccountDelegatesListView.prototype = new DwtListView;
ZmAccountDelegatesListView.prototype.constructor = ZmAccountDelegatesListView;

ZmAccountDelegatesListView.prototype.toString =
function() {
	return "ZmAccountDelegatesListView";
};

// Constants

ZmAccountDelegatesListView.WIDTH_NAME	= ZmMsg.COLUMN_WIDTH_NAME_ACC;
ZmAccountDelegatesListView.WIDTH_STATUS	= ZmMsg.COLUMN_WIDTH_STATUS_ACC;
ZmAccountDelegatesListView.WIDTH_TYPE	= ZmMsg.COLUMN_WIDTH_TYPE_ACC;

// Public methods

ZmAccountDelegatesListView.prototype.getCellElement =
function(account, field) {
	return document.getElementById(this._getCellId(account, field));
};

ZmAccountDelegatesListView.prototype.setCellContents =
function(account, field, html) {
	var el = this.getCellElement(account, field);
	if (!el) { return; }

	if (field == ZmItem.F_NAME) {
		el = document.getElementById(this._getCellId(account, field)+"_name");
    }
    if (field == ZmItem.F_EMAIL) {
        html = "<div style='margin-left: 10px;'>"+ html +"</div>";
    }
	el.innerHTML = html;
};

// Protected methods

ZmAccountDelegatesListView.prototype._getCellContents =
function(buffer, i, item, field, col, params) {
	if (field == ZmItem.F_NAME) {
		var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_name' style='margin:0 5px; overflow:hidden;'>";
		buffer[i++] = AjxStringUtil.htmlEncode(item.user);
		buffer[i++] = "</div>";
		return i;
	}
	if (field == ZmItem.F_TYPE) {
        var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_type' style='margin:0 5px;'>";
		buffer[i++] = (item.sendAs && item.sendOnBehalfOf)  ? ZmMsg.sendAsAndSendOnBehalfOf : (item.sendAs ? ZmMsg.sendAs : ZmMsg.sendOnBehalfOflbl);
		buffer[i++] = "</div>";
		return i;
	}
	return DwtListView.prototype._getCellContents.apply(this, arguments);
};

ZmAccountDelegatesListView.prototype._getCellId =
function(item, field, params) {
    return DwtId.getListViewItemId(DwtId.WIDGET_ITEM_CELL, this._view, item.id, field);
};

ZmAccountDelegatesListView.prototype._getHeaderList =
function() {
	return [
		new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg.name, width:ZmMsg.COLUMN_WIDTH_NAME_DELEGATE, margin:"5px"}),
		new DwtListHeaderItem({field:ZmItem.F_TYPE, text:ZmMsg.type})
	];
};

ZmAccountDelegatesListView.prototype._doubleClickAction =
function(){
   this.parent._editDelegateButton();
}

ZmAccountAppPasscodeListView = function(parent, className, posStyle, noMaximize) {
	className = className || "DwtListView";
	className += " ZOptionsItemsListView";
	DwtListView.call(this, {parent:parent, className:className, posStyle:posStyle, headerList:this._getHeaderList(), noMaximize:noMaximize});
	this.setMultiSelect(false);
};
ZmAccountAppPasscodeListView.prototype = new DwtListView;
ZmAccountAppPasscodeListView.prototype.constructor = ZmAccountAppPasscodeListView;

ZmAccountAppPasscodeListView.prototype.toString =
function() {
	return "ZmAccountAppPasscodeListView";
};

ZmAccountAppPasscodeListView.prototype._getHeaderList =
function() {
	return [
		new DwtListHeaderItem({field:ZmItem.F_NAME, text:ZmMsg.name, margin:"5px", width:ZmMsg.COLUMN_WIDTH_NAME_APPLICATION}),
		new DwtListHeaderItem({field:ZmItem.F_APP_PASSCODE_CREATED, text:ZmMsg.created, width:ZmMsg.COLUMN_WIDTH_NAME_APPLICATION}),
		new DwtListHeaderItem({field:ZmItem.F_APP_PASSCODE_LAST_USED, text:ZmMsg.lastUsed, width:ZmMsg.COLUMN_WIDTH_NAME_APPLICATION})
	];
};

ZmAccountAppPasscodeListView.prototype._getCellContents =
function(buffer, i, item, field, col, params) {
	if (field == ZmItem.F_NAME) {
		var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_name' style='margin:0 5px; overflow:hidden;'>";
		buffer[i++] = AjxStringUtil.htmlEncode(item.appName);
		buffer[i++] = "</div>";
		return i;
	}
	else if (field == ZmItem.F_APP_PASSCODE_CREATED) {
		var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_type' style='margin:0 5px;'>";
		buffer[i++] = AjxDateFormat.format(AjxDateFormat.SHORT, new Date(item.created));
		buffer[i++] = "</div>";
		return i;
	}
	else if (field == ZmItem.F_APP_PASSCODE_LAST_USED) {
		var cellId = this._getCellId(item, field);
		buffer[i++] = "<div id='";
		buffer[i++] = cellId;
		buffer[i++] = "_type' style='margin:0 5px;'>";
		if (item.lastUsed) {
			buffer[i++] = AjxDateFormat.format(AjxDateFormat.SHORT, new Date(item.lastUsed));
		}
		else {
			buffer[i++] = "-";
		}
		buffer[i++] = "</div>";
		return i;
	}
	return DwtListView.prototype._getCellContents.apply(this, arguments);
};


//
// New data source class
//

ZmAccountsPage._defineClasses =
function() {
ZmNewDataSource = function() {
	var number = ++ZmNewDataSource.ID;
	this.setType(appCtxt.get(ZmSetting.POP_ACCOUNTS_ENABLED) ? ZmAccount.TYPE_POP : ZmAccount.TYPE_IMAP);
	ZmDataSource.call(this, this.type, ("new-dsrc-"+number));
	this.email = "";
	this.name = AjxMessageFormat.format(ZmMsg.newExternalAccount, number);
	this._new = true;
	this.folderId = -1;
	var identity = this.getIdentity();
	identity.sendFromDisplay = appCtxt.get(ZmSetting.DISPLAY_NAME);
	identity.sendFromAddress = appCtxt.get(ZmSetting.USERNAME);
};
ZmNewDataSource.prototype = new ZmDataSource;
ZmNewDataSource.prototype.constructor = ZmNewDataSource;

ZmNewDataSource.prototype.toString =
function() {
	return "ZmNewDataSource";
};

// Constants

ZmNewDataSource.ID = 0;

// Data

ZmNewDataSource.prototype.ELEMENT_NAME = ZmPopAccount.prototype.ELEMENT_NAME;

// Public methods

ZmNewDataSource.prototype.setType =
function(type) {
	this.type = type;
	var TYPE = this.type == ZmAccount.TYPE_POP ? ZmPopAccount : ZmImapAccount;
	this.ELEMENT_NAME = TYPE.prototype.ELEMENT_NAME;
	this.getDefaultPort = TYPE.prototype.getDefaultPort;
};

//
// New persona class
//

ZmNewPersona = function() {
	var number = ++ZmNewPersona.ID;
	var id = "new-persona-"+number;
	var name = AjxMessageFormat.format(ZmMsg.newPersona, number);
	var identity = new ZmIdentity(name);
	identity.id = id;
	ZmPersona.call(this, identity);
	this.id = id;
	this._new = true;
	identity.sendFromDisplay = appCtxt.get(ZmSetting.DISPLAY_NAME);
	identity.sendFromAddress = appCtxt.get(ZmSetting.USERNAME);
};
ZmNewPersona.prototype = new ZmPersona;
ZmNewPersona.prototype.constructor = ZmNewPersona;

ZmNewPersona.prototype.toString =
function() {
	return "ZmNewPersona";
};

// Constants

ZmNewPersona.ID = 0;

/**
 * Fetches the list of personas added to account list view amongst other accounts.
 *
 *
 * @param	{String}	accountList		List of accounts added to account list view e.g. Persona and External (POP) account.
 *
 *
 * @public
 */
ZmNewPersona.getPersonaList =
function(accountList) {
    var personas = [];

    personas = AjxUtil.filter(accountList, function(accountItem) {
        if (accountItem instanceof ZmNewPersona || accountItem.type == ZmAccount.TYPE_PERSONA) {
            return accountItem;
        }
    });

    return personas;
};

}; // function ZmAccountsPage._defineClasses


// GrantRights Dialog


/**
 * Creates a grantRights Dialog.
 * @class
 * This class represents a rename folder dialog.
 *
 * @param	{DwtComposite}	parent		the parent
 * @param	{String}	className		the class name
 *
 * @extends		ZmDialog
 */
ZmGrantRightsDialog = function(parent, className, callback) {

	ZmDialog.call(this, {parent:parent, className:className, title:ZmMsg.grantRights, id:"GrantRightsDialog"});
    var id			= this.toString();
	var inputId		= id + "_name";
	var cellId		= id + "_name_cell";
	var rowId		= id + "_name_row";
	var sendAsId	= id + "_sendAs";
	var sendOboId	= id + "_sendObo";

	var aifParams = {
		parent:					parent,
		bubbleAddedCallback:	this._onChange.bind(this),
		bubbleRemovedCallback:	this._onChange.bind(this),
		singleBubble:			true,
		inputId:				inputId,
		type:					AjxEmailAddress.TO
	}

	this._editPermissions		= false;
	this._okCallBack			= callback;

	this._addrInputField		= new ZmAddressInputField(aifParams);
	this._aifId					= this._addrInputField._htmlElId;

	this._delegateEmailInput	= document.getElementById(inputId);
	this._delegateEmailRow		= document.getElementById(rowId);
	this._sendAs				= document.getElementById(sendAsId);
	this._sendObo				= document.getElementById(sendOboId);

	this._addrInputField.reparentHtmlElement(cellId);
	this._initAutoComplete();
};

ZmGrantRightsDialog.prototype = new ZmDialog;
ZmGrantRightsDialog.prototype.constructor = ZmGrantRightsDialog;

ZmGrantRightsDialog.prototype.toString =
function() {
	return "ZmGrantRightsDialog";
};

/**
 * Pops-up the dialog.
 *
 */
ZmGrantRightsDialog.prototype.popup =
function() {
	this._addrInputField.clear();
	ZmDialog.prototype.popup.call(this);
    if (!this._editPermissions){
     this._delegateEmailInput.focus();
    } else {
     this._sendAs.focus();
    }
};

ZmGrantRightsDialog.prototype._contentHtml =
function() {
    var subs = {id: this.toString()};
	return AjxTemplate.expand("prefs.Pages#GrantRightsDialog",subs);
};

ZmGrantRightsDialog.prototype._okButtonListener =
function(ev) {
	// get email address from the bubble
	var emailsFromBubbles = this._addrInputField.getAddresses(true);
	var delegateEmail = emailsFromBubbles[0] && emailsFromBubbles[0].address;
	if (!delegateEmail) {
		// get email address from the plain text in input if no bubbles
		var emailsFromText = AjxEmailAddress.getValidAddresses(this._delegateEmailInput.value).getArray();
		delegateEmail = (emailsFromText[0] && emailsFromText[0].address) || this._delegateEmailInput.value;
	}
	this._okCallBack.run(delegateEmail, this._sendAs.checked, this._sendObo.checked);
};

ZmGrantRightsDialog.prototype.setData =
function(item){
    if (item){
        this.setTitle(ZmMsg.editDelegatePermissions + " - " + AjxStringUtil.htmlEncode(item.user));
        this._delegateEmailRow.style.display ="none";
        this._sendAs.checked = item.sendAs;
        this._sendObo.checked = item.sendOnBehalfOf;
        this._editPermissions = true;
        this._prevData = item;
    } else {
        this.setTitle(ZmMsg.delegatePermissions);
        this._delegateEmailRow.style.display ="";
        this._delegateEmailInput.value="";
        this._sendAs.checked = false;
        this._sendObo.checked = false;
        this._editPermissions = false;
        Dwt.setHandler(this._delegateEmailInput, DwtEvent.ONCHANGE, this._onChange.bind(this));
    }
    this.getButton(DwtDialog.OK_BUTTON).setEnabled(false);
    Dwt.setHandler(this._sendAs, DwtEvent.ONCLICK, this._onChange.bind(this));
    Dwt.setHandler(this._sendObo, DwtEvent.ONCLICK, this._onChange.bind(this));
};
ZmGrantRightsDialog.prototype._initAutoComplete =
function(){
	if (appCtxt.get(ZmSetting.CONTACTS_ENABLED) || appCtxt.get(ZmSetting.GAL_ENABLED)) {
		var params = {
			parent:			appCtxt.getShell(),
			dataClass:		appCtxt.getAutocompleter(),
			options:		{type:ZmAutocomplete.AC_TYPE_GAL, acType:ZmAutocomplete.AC_TYPE_CONTACT, excludeGroups:true},
			matchValue:		ZmAutocomplete.AC_VALUE_FULL,
			separator:		"",
			galType:		ZmSearch.GAL_ACCOUNT,
			contextId:		this.toString()
		};
		this._acAddrSelectList = new ZmAutocompleteListView(params);
		this._acAddrSelectList.handle(this._delegateEmailInput, this._aifId);
		this._addrInputField.setAutocompleteListView(this._acAddrSelectList);
	}
};

ZmGrantRightsDialog.prototype._onChange =
function(){
    var enable = false;
    if (!this._editPermissions){
		enable = (this._delegateEmailInput.value || this._addrInputField.getValue())
			&& (this._sendAs.checked || this._sendObo.checked);
    } else {
		enable = this._prevData.sendAs !== this._sendAs.checked
			|| this._prevData.sendOnBehalfOf !== this._sendObo.checked;
    }
    this.getButton(DwtDialog.OK_BUTTON).setEnabled(enable);

}
}
if (AjxPackage.define("zimbraMail.mail.view.prefs.ZmAccountTestDialog")) {
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

ZmAccountTestDialog = function(parent) {
	DwtDialog.call(this, {parent:parent, title:ZmMsg.accountTest, className:"DwtBaseDialog ZmDataSourceTestDialog" });
	this.registerCallback(DwtDialog.OK_BUTTON, this._handleOkButton, this);
	this.registerCallback(DwtDialog.CANCEL_BUTTON, this._handleCancelButton, this);
};
ZmAccountTestDialog.prototype = new DwtDialog;
ZmAccountTestDialog.prototype.constructor = ZmAccountTestDialog;

ZmAccountTestDialog.prototype.toString = function() {
	return "ZmAccountTestDialog";
};

//
// DwtDialog methods
//

ZmAccountTestDialog.prototype.popup = function(accounts, okCallback, cancelCallback) {
	delete this._reqId;
	// perform tests
	if (accounts && accounts.length > 0) {
		this._okCallback = okCallback;
		this._cancelCallback = cancelCallback;

		// setup display
		this._initializeAccounts(accounts);
		this.setButtonEnabled(DwtDialog.OK_BUTTON, false);

		// show dialog
		DwtDialog.prototype.popup.call(this);

		// begin test
		var testCallback = new AjxCallback(this, this._handleTestResult);
		testCallback.args = [testCallback, 0];
		this._handleTestResult.apply(this, testCallback.args);
	}

	// nothing to do; report success
	else if (okCallback) {
		var successes = [];
		okCallback.run(successes);
	}
};

//
// Protected methods
//

ZmAccountTestDialog.prototype._initializeAccounts = function(accounts) {
	this._accounts = accounts;
	this._successes = new Array(accounts.length);

	var data = { id: this._htmlElId, accounts: accounts };
	var html = AjxTemplate.expand("prefs.Pages#AccountTestContent", data);
	this.setContent(html);
};

ZmAccountTestDialog.prototype._handleTestResult =
function(testCallback, index, result) {
	// show results
	if (result) {
		var account = this._accounts[index - 1];
		var statusEl = document.getElementById(account.id+"_test_status");

		var error = null;
		var resp = result._data && result._data.TestDataSourceResponse;
		if (resp) {
			this._successes[index - 1] = true;
			var dsrc = resp[ZmDataSource.prototype.ELEMENT_NAME] ||
					   resp[ZmPopAccount.prototype.ELEMENT_NAME] ||
					   resp[ZmImapAccount.prototype.ELEMENT_NAME];
			dsrc = dsrc && dsrc[0];
			if (dsrc.success) {
				statusEl.className = [statusEl.className,"ZmTestSucceeded"].join(" ");
				statusEl.innerHTML = ZmMsg.popAccountTestSuccess;
			}
			else {
				error = dsrc.error;
			}
		}
		else {
			error = "Generic Test Failure"; // TODO: i18n
		}

		if (error) {
			this._successes[index - 1] = false;

			statusEl.className = [statusEl.className,"ZmTestFailed"].join(" ");
			statusEl.innerHTML = ZmMsg.popAccountTestFailure;

			var detailsEl = document.getElementById(account.id+"_test_details");
			var errorEl = document.getElementById(account.id+"_test_error");
			error = AjxStringUtil.htmlEncode(error);
			errorEl.innerHTML = error.replace(/(\bhttps?:[^\s<]*)/igm, '<a href="$1" target="_blank">$1</a>');
			Dwt.setVisible(detailsEl, true);
		}

		this._position();
	}

	// finish
	if (this._accounts.length == index) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
		return;
	}

	// continue testing
	var account = this._accounts[ testCallback.args[1]++ ];
	var statusEl = document.getElementById(account.id+"_test_status");
	statusEl.innerHTML = ZmMsg.popAccountTestInProgress;
	this._reqId = account.testConnection(testCallback, testCallback, null, true);
};

ZmAccountTestDialog.prototype._handleOkButton = function(evt) {
	this.popdown();
	if (this._reqId) {
		appCtxt.getAppController().cancelRequest(this._reqId);
	}
	if (this._okCallback) {
		this._okCallback.run(this._successes);
	}
};
ZmAccountTestDialog.prototype._handleCancelButton = function(evt) {
	this.popdown();
	if (this._cancelCallback) {
		this._cancelCallback.run();
	}
};
}
if (AjxPackage.define("zimbraMail.mail.view.prefs.ZmMailPrefsPage")) {
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

ZmMailPrefsPage = function(parent, section, controller) {
	ZmPreferencesPage.apply(this, arguments);

	this._initialized = false;
};

ZmMailPrefsPage.prototype = new ZmPreferencesPage;
ZmMailPrefsPage.prototype.constructor = ZmMailPrefsPage;

ZmMailPrefsPage.prototype.isZmMailPrefsPage = true;
ZmMailPrefsPage.prototype.toString = function() { return "ZmMailPrefsPage"; };

//
// ZmPreferencesPage methods
//

ZmMailPrefsPage.prototype.showMe =
function() {
	ZmPreferencesPage.prototype.showMe.call(this);
    if(appCtxt.isOffline){
        if(this._initializedAcctId != appCtxt.getActiveAccount().id) {
            this._initialized = false;
            this._initializedAcctId = appCtxt.getActiveAccount().id;
        }
    }
	if (!this._initialized) {
		this._initialized = true;
		if (this._blackListControl && this._whiteListControl) {
			var soapDoc = AjxSoapDoc.create("GetWhiteBlackListRequest", "urn:zimbraAccount");
			var callback = new AjxCallback(this, this._handleResponseLoadWhiteBlackList);
			appCtxt.getRequestMgr().sendRequest({soapDoc:soapDoc, asyncMode:true, callback:callback});
		}
	}
};

ZmMailPrefsPage.prototype.reset =
function(useDefaults) {
    ZmPreferencesPage.prototype.reset.apply(this, arguments);

    this._duration = 0;
    var noDuration = true;
    if (this._startDateVal) {
        noDuration = (this._startDateVal.value == null || this._startDateVal.value == "");
        this._initStartEndDisplayFields();
    }


    var cbox = this.getFormObject(ZmSetting.VACATION_MSG_ENABLED);
    if (cbox) {
        this._handleEnableVacationMsg(cbox, noDuration);
        // HandleEnableVacationMsg will alter other (non-persisted) settings - update
        // their 'original' values so the section will not be thought dirty upon exit
        this._updateOriginalValue(ZmSetting.VACATION_DURATION_ENABLED);
        this._updateOriginalValue(ZmSetting.VACATION_CALENDAR_ENABLED);
    }
    this._initialAllDayFlag   = this._allDayCheckbox ? this._allDayCheckbox.isSelected() : true;
    this._updateOriginalValue(ZmSetting.VACATION_DURATION_ALL_DAY);


	this._setPopDownloadSinceControls();

	if (this._blackListControl && this._whiteListControl) {
		this._blackListControl.reset();
		this._whiteListControl.reset();
	}
};

ZmMailPrefsPage.prototype.isDirty =
function() {
	var isDirty = ZmPreferencesPage.prototype.isDirty.call(this);
	return (!isDirty) ? this.isWhiteBlackListDirty() : isDirty;
};

ZmMailPrefsPage.prototype.isWhiteBlackListDirty =
function() {
	if (this._blackListControl && this._whiteListControl) {
		return this._blackListControl.isDirty() ||
			   this._whiteListControl.isDirty();
	}
	return false;
};

ZmMailPrefsPage.prototype.addCommand =
function(batchCmd) {
	if (this.isWhiteBlackListDirty()) {
		var soapDoc = AjxSoapDoc.create("ModifyWhiteBlackListRequest", "urn:zimbraAccount");
		this._blackListControl.setSoapContent(soapDoc, "blackList");
		this._whiteListControl.setSoapContent(soapDoc, "whiteList");

		var respCallback = new AjxCallback(this, this._handleResponseModifyWhiteBlackList);
		batchCmd.addNewRequestParams(soapDoc, respCallback);
	}
};

ZmMailPrefsPage.prototype._handleResponseModifyWhiteBlackList =
function(result) {
	this._blackListControl.saveLocal();
	this._whiteListControl.saveLocal();
};

ZmMailPrefsPage.prototype._setPopDownloadSinceControls =
function() {
	var popDownloadSinceValue = this.getFormObject(ZmSetting.POP_DOWNLOAD_SINCE_VALUE);
    var value = appCtxt.get(ZmSetting.POP_DOWNLOAD_SINCE);
	if (popDownloadSinceValue && value) {
		var date = AjxDateFormat.parse("yyyyMMddHHmmss'Z'", value);
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

		popDownloadSinceValue.setText(AjxMessageFormat.format(ZmMsg.externalAccessPopCurrentValue, date));
        popDownloadSinceValue.setVisible(true);
	}  else if( popDownloadSinceValue ) {
        popDownloadSinceValue.setVisible(false);
    }

	var popDownloadSince = this.getFormObject(ZmSetting.POP_DOWNLOAD_SINCE);
	if (popDownloadSince) {
		popDownloadSince.setSelectedValue(appCtxt.get(ZmSetting.POP_DOWNLOAD_SINCE));
	}
};

ZmMailPrefsPage.prototype._createControls =
function() {
    AjxDispatcher.require(["MailCore", "CalendarCore"]);
	ZmPreferencesPage.prototype._createControls.apply(this, arguments);

	this._sId = this._htmlElId + "_startMiniCal";
	this._eId = this._htmlElId + "_endMiniCal";


    this._startDateField = Dwt.byId(this._htmlElId + "_VACATION_FROM1");
	this._endDateField = Dwt.byId(this._htmlElId + "_VACATION_UNTIL1");

	if (this._startDateField && this._endDateField) {
		this._startDateVal = Dwt.byId(this._htmlElId + "_VACATION_FROM");
		this._endDateVal = Dwt.byId(this._htmlElId + "_VACATION_UNTIL");
        if(this._startDateVal.value.length < 15){
            this._startDateVal.value = appCtxt.get(ZmSetting.VACATION_FROM);
        }
        if(this._endDateVal.value.length < 15){
            this._endDateVal.value = appCtxt.get(ZmSetting.VACATION_UNTIL);            
        }

		this._formatter = new AjxDateFormat("yyyyMMddHHmmss'Z'");

	    var timeSelectListener = new AjxListener(this, this._timeChangeListener);
	    this._startTimeSelect = new DwtTimeInput(this, DwtTimeInput.START);
	    this._startTimeSelect.reparentHtmlElement(this._htmlElId + "_VACATION_FROM_TIME");
	    this._endTimeSelect = new DwtTimeInput(this, DwtTimeInput.END);
	    this._endTimeSelect.reparentHtmlElement(this._htmlElId + "_VACATION_UNTIL_TIME");
        this._startTimeSelect.addChangeListener(timeSelectListener);
        this._endTimeSelect.addChangeListener(timeSelectListener);

        var noDuration = (this._startDateVal.value == null || this._startDateVal.value == "");
        this._initStartEndDisplayFields();

		var dateButtonListener = new AjxListener(this, this._dateButtonListener);
		var dateCalSelectionListener = new AjxListener(this, this._dateCalSelectionListener);
		var dateFieldListener = AjxCallback.simpleClosure(this._dateFieldListener, this);

		this._startDateButton = ZmCalendarApp.createMiniCalButton(this, this._sId, dateButtonListener, dateCalSelectionListener, ZmMsg.startDate);
		this._endDateButton = ZmCalendarApp.createMiniCalButton(this, this._eId, dateButtonListener, dateCalSelectionListener, ZmMsg.endDate);

		Dwt.setHandler(this._startDateField, DwtEvent.ONBLUR, dateFieldListener);
		Dwt.setHandler(this._endDateField, DwtEvent.ONBLUR, dateFieldListener);

		this._durationCheckbox = this.getFormObject(ZmSetting.VACATION_DURATION_ENABLED);
        this._allDayCheckbox = this.getFormObject(ZmSetting.VACATION_DURATION_ALL_DAY);
        // Base initial _allDayCheckbox.checked on whether the start is Midnight and end
        // is 23:59:59 (which fortunately cannot be directly specified by the user).
        // Do this because we do not have any linkage to the OOO appt.
        var prefStartDate = this._getPrefDate(ZmSetting.VACATION_FROM);
        var prefEndDate   = this._getPrefDate(ZmSetting.VACATION_UNTIL);
        if ((prefStartDate != null) && (prefEndDate != null)) {
            var startDate = new Date(prefStartDate);
            startDate.setHours(0, 0, 0, 0);  //we set this just to compare - took me a while to figure out
            var endDate = new Date(prefEndDate);
            endDate.setHours(23, 59, 59, 0); //we set this just to compare.
            this._initialAllDayFlag = ((prefStartDate.getTime() == startDate.getTime()) &&
                                       (prefEndDate.getTime()   == endDate.getTime()));
        } else {
            this._initialAllDayFlag = true;
        }
        this._allDayCheckbox.setSelected(this._initialAllDayFlag);
        this._updateOriginalValue(ZmSetting.VACATION_DURATION_ALL_DAY);
	}



	var cbox = this.getFormObject(ZmSetting.VACATION_MSG_ENABLED);
	if (cbox) {
		this._handleEnableVacationMsg(cbox, noDuration);
        // HandleEnableVacationMsg will alter other (non-persisted) settings - update
        // their 'orginal' values so the section will not be thought dirty upon exit
        this._updateOriginalValue(ZmSetting.VACATION_DURATION_ENABLED);
        this._updateOriginalValue(ZmSetting.VACATION_CALENDAR_ENABLED);
	}

	// enable downloadSince appropriately based on presence of downloadSinceEnabled
	var downloadSinceCbox = this.getFormObject(ZmSetting.POP_DOWNLOAD_SINCE_ENABLED);
	if (downloadSinceCbox) {
		var downloadSince = this.getFormObject(ZmSetting.POP_DOWNLOAD_SINCE);
		if (downloadSince) {
			var enabled = downloadSince.getValue() != "";
			downloadSinceCbox.setSelected(enabled);
			downloadSince.setEnabled(enabled);
		}
	}

	// Following code makes child nodes as siblings to separate the
	// event-handling between labels and input
	var inputId = DwtId.makeId(ZmId.WIDGET_INPUT, ZmId.OP_MARK_READ);
	var inputPlaceholder = Dwt.byId(inputId);

	if (inputPlaceholder) {
		var radioButton = DwtControl.findControl(inputPlaceholder);
		var index = AjxUtil.indexOf(radioButton.parent.getChildren(),
		                            radioButton);
		var inputControl = new DwtInputField({
			parent: radioButton.parent,
			index: index + 1,
			id: inputId,
			size: 4,
			hint: '0',
		});
		inputControl.replaceElement(inputPlaceholder);
		inputControl.setDisplay(Dwt.DISPLAY_INLINE);

		// Toggle the setting when editing the time input; it already recieves
		// focus on click, so this is mainly for keyboard navigation.
		inputControl.setHandler(DwtEvent.ONINPUT, function(ev) {
			if (inputControl.getValue()) {
				this.setFormValue(ZmSetting.MARK_MSG_READ,
				                  ZmSetting.MARK_READ_TIME);
			}
		}.bind(this));

		// If pref's value is number of seconds, populate the input
		var value = appCtxt.get(ZmSetting.MARK_MSG_READ);
		if (value > 0) {
		    inputControl.setValue(value);
		}
	}

	var composeMore = Dwt.byId(this.getHTMLElId() + '_compose_more');
	if (composeMore) {
		var links = AjxUtil.toArray(composeMore.getElementsByTagName('A'));

		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			var accountsText = new DwtText({
				parent: this,
				className: 'FakeAnchor'
			});
			accountsText.setContent(AjxUtil.getInnerText(link));
			accountsText.setDisplay(Dwt.DISPLAY_INLINE);
			accountsText.replaceElement(link);
			accountsText._setEventHdlrs([DwtEvent.ONCLICK]);
			accountsText.addListener(DwtEvent.ONCLICK,
									 skin.gotoPrefs.bind(skin, "ACCOUNTS"));
		}
	}

	this._setPopDownloadSinceControls();
};


ZmMailPrefsPage.prototype._getPrefDate =
function(settingName) {
    var prefDate = null;
    var prefDateText = appCtxt.get(settingName);
    if (prefDateText && (prefDateText != "")) {
        prefDate = this._formatter.parse(AjxDateUtil.dateGMT2Local(prefDateText));
    }
    return prefDate;
}

ZmMailPrefsPage.prototype._initStartEndDisplayFields =
function() {
    var startDate = new Date();
    startDate.setHours(0,0,0,0);
    this._initDateTimeDisplayField(this._startDateVal, this._startTimeSelect,
        this._startDateField, startDate);

    var endDate = new Date(startDate);
    // Defaulting to 11:59 PM. Ignored for all day
    endDate.setHours(23,59,0,0);
    this._initDateTimeDisplayField(this._endDateVal, this._endTimeSelect,
        this._endDateField, endDate);

    this._calcDuration();
}

ZmMailPrefsPage.prototype._initDateTimeDisplayField =
function(dateVal, timeSelect, dateField, date) {
    var dateValue = (dateVal.value != null && dateVal.value != "")
        ? (this._formatter.parse(dateVal.value)) : date;
    timeSelect.set(dateValue);
    dateValue = timeSelect.getValue(dateValue);
    dateVal.value = this._formatter.format(dateValue);
    dateField.value = AjxDateUtil.simpleComputeDateStr(dateValue);
}

ZmMailPrefsPage.prototype._updateOriginalValue =
function(id) {
    var cbox = this.getFormObject(id);
    if (cbox) {
        var pref = appCtxt.getSettings().getSetting(id);
        pref.origValue = cbox.isSelected();
        pref.value = pref.origValue;
    }
};

ZmMailPrefsPage.prototype._dateButtonListener =
function(ev) {
	var calDate = ev.item == this._startDateButton
		? this._fixAndGetValidDateFromField(this._startDateField)
		: this._fixAndGetValidDateFromField(this._endDateField);

	var menu = ev.item.getMenu();
	var cal = menu.getItem(0);
	cal.setDate(calDate, true);
	ev.item.popup();
};

ZmMailPrefsPage.prototype._fixAndGetValidDateFromField =
function(field) {
	var d = AjxDateUtil.simpleParseDateStr(field.value);
	if (!d || isNaN(d)) {
		d = new Date();
		field.value = AjxDateUtil.simpleComputeDateStr(d);
	}
	return d;
};

ZmMailPrefsPage.prototype._dateCalSelectionListener =
function(ev) {
	var parentButton = ev.item.parent.parent;

	var newDate = AjxDateUtil.simpleComputeDateStr(ev.detail);

	if (parentButton == this._startDateButton) {
		this._startDateField.value = newDate;
	} else {
		if (ev.detail < new Date()) { return; }
		this._endDateField.value = newDate;
	}

    var sd = this._fixAndGetValidDateFromField(this._startDateField);
    var ed = this._fixAndGetValidDateFromField(this._endDateField);
    if(this._startTimeSelect && this._endTimeSelect){
        sd = this._startTimeSelect.getValue(sd);
        ed = this._endTimeSelect.getValue(ed);
    }

	
	this._fixDates(sd, ed, parentButton == this._endDateButton);
    this._calcDuration();

	if (this._durationCheckbox.isSelected()) {
		this._startDateVal.value = this._formatter.format(sd);
        this._endDateVal.value = this._formatter.format(ed);
	}
};

ZmMailPrefsPage.prototype._calcDuration =
function() {
    var sd = this._fixAndGetValidDateFromField(this._startDateField);
    var ed = this._fixAndGetValidDateFromField(this._endDateField);

    var sdDay = new Date(sd.getTime());
    var edDay = new Date(ed.getTime());
    sdDay.setHours(0, 0, 0, 0);
    edDay.setHours(0, 0, 0, 0);
    this._duration = edDay.getTime() - sdDay.getTime();
    DBG.println(AjxDebug.DBG3, "ZmMailPrefsPage._calcDuration: Start=" + AjxDateUtil.simpleComputeDateStr(sdDay) +
                ", End=" + AjxDateUtil.simpleComputeDateStr(edDay) + ", duration=" + this._duration);
}

ZmMailPrefsPage.prototype._dateFieldListener =
function(ev) {
	var sd = this._fixAndGetValidDateFromField(this._startDateField);
	var ed = this._fixAndGetValidDateFromField(this._endDateField);
    if(this._startTimeSelect && this._endTimeSelect){
        sd = this._startTimeSelect.getValue(sd);
        ed = this._endTimeSelect.getValue(ed);
    }
    this._fixDates(sd, ed, DwtUiEvent.getTarget(ev) == this._endDateField);
    this._calcDuration();
    this._startDateVal.value = this._formatter.format(AjxDateUtil.simpleParseDateStr(this._startDateField.value));
    this._endDateVal.value = this._formatter.format(AjxDateUtil.simpleParseDateStr(this._endDateField.value));
};

ZmMailPrefsPage.prototype._timeChangeListener =
function(ev) {
   var stDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
   var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
   stDate = this._startTimeSelect.getValue(stDate);
   endDate = this._endTimeSelect.getValue(endDate);
   this._startDateVal.value = this._formatter.format(stDate);
   this._endDateVal.value = this._formatter.format(endDate);
};

/* Fixes the field values so that end date always is later than or equal to start date
 * @param startDate	{Date}	The value of the start date field or calendar selection
 * @param endDate	{Date}	The value of the end date field or calendar selection
 * @param endModified {boolean}	endDate was changed - don't preserve the duration
*/
ZmMailPrefsPage.prototype._fixDates =
function(startDate, endDate, endModified) {
    var startDateNoTimeOffset = new Date(startDate.getTime());
    startDateNoTimeOffset.setHours(0,0,0,0);
    var endDateNoTimeOffset   = new Date(endDate.getTime());
    endDateNoTimeOffset.setHours(0,0,0,0);

	if (startDateNoTimeOffset >= endDateNoTimeOffset) {
        // Start date after end date
		if (endModified) {
            // EndDate was set to be prior to the startDate - set them to be equal
			this._startDateField.value = AjxDateUtil.simpleComputeDateStr(endDate);
            DBG.println(AjxDebug.DBG3, "ZmMailPrefsPage._fixDates: endModified, set start == end");
		} else {
			// StartDate modified - preserve the duration
            var newEndDate = new Date(startDateNoTimeOffset.getTime() + this._duration);
			this._endDateField.value = AjxDateUtil.simpleComputeDateStr(newEndDate);
            DBG.println(AjxDebug.DBG3, "ZmMailPrefsPage._fixDates: Start=" + AjxDateUtil.simpleComputeDateStr(startDate) +
                ", End=" + AjxDateUtil.simpleComputeDateStr(newEndDate) + ", duration=" + this._duration);
		}
	}
};

ZmMailPrefsPage.prototype._setupCheckbox =
function(id, setup, value) {
	var cbox = ZmPreferencesPage.prototype._setupCheckbox.apply(this, arguments);
	if (id == ZmSetting.VACATION_CALENDAR_ENABLED ||
        id == ZmSetting.VACATION_DURATION_ENABLED ||
        id == ZmSetting.VACATION_DURATION_ALL_DAY)
	{
		cbox.addSelectionListener(new AjxListener(this, this._handleEnableVacationMsg, [cbox, false, id]));
	}
	return cbox;
};

ZmMailPrefsPage.prototype._setupRadioGroup =
function(id, setup, value) {
	var control = ZmPreferencesPage.prototype._setupRadioGroup.apply(this, arguments);
	if (id == ZmSetting.POP_DOWNLOAD_SINCE) {
		var radioGroup = this.getFormObject(id);
		var radioButton = radioGroup.getRadioButtonByValue(ZmMailApp.POP_DOWNLOAD_SINCE_NO_CHANGE);
		radioButton.setVisible(false);
	}
    else if (id == ZmSetting.VACATION_MSG_ENABLED) {
        var radioGroup = this.getFormObject(id);
        radioGroup.addSelectionListener(new AjxListener(this, this._handleEnableVacationMsg, [radioGroup, false, id]));
    }
	return control;
};

ZmMailPrefsPage.prototype._setupCustom =
function(id, setup, value) {
	if (id == ZmSetting.MAIL_BLACKLIST) {
		this._blackListControl = new ZmWhiteBlackList(this, id, "BlackList");
		return this._blackListControl;
	}

	if (id == ZmSetting.MAIL_WHITELIST) {
		this._whiteListControl = new ZmWhiteBlackList(this, id, "WhiteList");
		return this._whiteListControl;
	}
};

ZmMailPrefsPage.prototype._handleResponseLoadWhiteBlackList =
function(result) {
	var resp = result.getResponse().GetWhiteBlackListResponse;
	this._blackListControl.loadFromJson(resp.blackList[0].addr);
	this._whiteListControl.loadFromJson(resp.whiteList[0].addr);
};


//
// Protected methods
//

ZmMailPrefsPage.prototype._handleEnableVacationMsg =
function(cbox, noDuration, id, evt) {
	var textarea = this.getFormObject(ZmSetting.VACATION_MSG);
    var extTextarea = this.getFormObject(ZmSetting.VACATION_EXTERNAL_MSG);
    var externalTypeSelect = this.getFormObject(ZmSetting.VACATION_EXTERNAL_SUPPRESS);
	if (textarea) {
        if (id == ZmSetting.VACATION_DURATION_ALL_DAY) {
            this._enableDateTimeControls(true);
        } else if (id == ZmSetting.VACATION_DURATION_ENABLED) {
            this._allDayCheckbox.setEnabled(cbox.isSelected());
            this._enableDateTimeControls(cbox.isSelected());
            var calCheckBox = this.getFormObject(ZmSetting.VACATION_CALENDAR_ENABLED);
            calCheckBox.setEnabled(cbox.isSelected());
            var calendarType = this.getFormObject(ZmSetting.VACATION_CALENDAR_TYPE);
            calendarType.setEnabled(calCheckBox.isSelected() && cbox.isSelected());
		}else if(id == ZmSetting.VACATION_CALENDAR_ENABLED){
            var calendarType = this.getFormObject(ZmSetting.VACATION_CALENDAR_TYPE);
            calendarType.setEnabled(cbox.isSelected());
         }else {

            // MESSAGE_ENABLED, main On/Off switch
			var enabled = cbox.getSelectedValue()=="true";
			textarea.setEnabled(enabled);

            this._durationCheckbox.setEnabled(enabled);
            var val = this._startDateVal.value && enabled ? true : false;
            this._durationCheckbox.setSelected((val && !noDuration));

            var calCheckBox = this.getFormObject(ZmSetting.VACATION_CALENDAR_ENABLED);
            calCheckBox.setEnabled((this._durationCheckbox.isSelected() || appCtxt.get(ZmSetting.VACATION_DURATION_ENABLED)) && enabled);
            calCheckBox.setSelected(enabled && (appCtxt.get(ZmSetting.VACATION_CALENDAR_APPT_ID) != "-1"));

            var calendarType = this.getFormObject(ZmSetting.VACATION_CALENDAR_TYPE);
            calendarType.setEnabled(calCheckBox.isSelected() && this._durationCheckbox.isSelected() && enabled);
            externalTypeSelect.setEnabled(enabled);
            extTextarea.setEnabled(enabled);
            this._allDayCheckbox.setEnabled(enabled && this._durationCheckbox.isSelected());
            this._enableDateTimeControls(enabled && this._durationCheckbox.isSelected());
		}
	}
};

ZmMailPrefsPage.prototype._enableDateTimeControls =
function(enableDate) {
    this._setEnabledStartDate(enableDate);
    this._setEnabledEndDate(enableDate);
    var enableTime = enableDate && !this._allDayCheckbox.isSelected();
    this._startTimeSelect.setEnabled(enableTime);
    this._endTimeSelect.setEnabled(enableTime);
}

ZmMailPrefsPage.prototype._setEnabledStartDate =
function(val) {
	var condition = val && this._durationCheckbox.isSelected();
	this._startDateField.disabled = !condition;
	this._startDateButton.setEnabled(condition);
    var stDateVal = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
    if(this._startTimeSelect){stDateVal = this._startTimeSelect.getValue(stDateVal);}
	this._startDateVal.value = (!condition)
		? "" : (this._formatter.format(stDateVal));
};

ZmMailPrefsPage.prototype._setEnabledEndDate =
function(val) {
	//this._endDateCheckbox.setEnabled(val);
	var condition = val && this._durationCheckbox.isSelected();
	this._endDateField.disabled = !condition;
	this._endDateButton.setEnabled(condition);
    var endDateVal = AjxDateUtil.simpleParseDateStr(this._endDateField.value);
    if(this._endTimeSelect){endDateVal = this._endTimeSelect.getValue(endDateVal);}
	this._endDateVal.value = (!condition)
		? "" : (this._formatter.format(endDateVal));
};


ZmMailPrefsPage.prototype.getPreSaveCallback =
function() {
	return new AjxCallback(this, this._preSave);
};

ZmMailPrefsPage.prototype._preSave =
function(callback) {
    if (this._startDateField && this._endDateField) {
        var stDate = AjxDateUtil.simpleParseDateStr(this._startDateField.value);
        var endDate = AjxDateUtil.simpleParseDateStr(this._endDateField.value);

        var allDay = this._allDayCheckbox.isSelected();
        if (!allDay) {
            // Add in time fields if not all-day
            stDate = this._startTimeSelect.getValue(stDate);
            endDate = this._endTimeSelect.getValue(endDate);
        }  else  {
            // For the prefs, need to set the all day end time
            endDate.setHours(23, 59, 59, 0);
        }
        if (this._startDateField.disabled) {
            this._startDateVal.value = "";
        } else {
            this._startDateVal.value = this._formatter.format(stDate);
        }
        if (this._endDateField.disabled) {
             this._endDateVal.value = "";
        } else {
            this._endDateVal.value = this._formatter.format(endDate);
        }

        this._oldStartDate = appCtxt.get(ZmSetting.VACATION_FROM);
        this._oldEndDate   = appCtxt.get(ZmSetting.VACATION_UNTIL);
    }

    if (callback) {
        callback.run();
    }
};

ZmMailPrefsPage.prototype.getPostSaveCallback =
function() {
	return new AjxCallback(this, this._postSave);
};

ZmMailPrefsPage.prototype._postSave =
function(changed) {
    var form = this.getFormObject(ZmSetting.POLLING_INTERVAL);
	var polling = form && form.getSelectedOption() && form.getSelectedOption().getDisplayValue();
	if (polling) {
		// A polling value is specified - apply it
		if (polling == ZmMsg.pollInstant) {
			// Instant notify is selected
			if (appCtxt.get(ZmSetting.INSTANT_NOTIFY) && !appCtxt.getAppController().getInstantNotify()) {
				// Instant notify is not operating - Turn it on
				appCtxt.getAppController().setInstantNotify(true);
			}
		}  else if (appCtxt.getAppController().getInstantNotify()) {
			// Instant notify is not selected, but is currently operating - Turn it off
			appCtxt.getAppController().setInstantNotify(false);
		}
	}

	var vacationChangePrefs = [
		ZmSetting.VACATION_MSG_ENABLED,
		ZmSetting.VACATION_FROM,
		ZmSetting.VACATION_UNTIL
	];

	var modified = false;
	for (var i = 0; i < vacationChangePrefs.length; i++) {
		if (changed[vacationChangePrefs[i]]) {
			modified = true;
			break;
		}
	}
	if (modified) {
        var soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount");
        var node = soapDoc.set("pref", "TRUE");
        node.setAttribute("name", "zimbraPrefOutOfOfficeStatusAlertOnLogin");
        appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true});
    }

	//if old end date was greater than today then fetch appt id from metadata and delete the old appointment
	var now = new Date();
	if (appCtxt.get(ZmSetting.VACATION_CALENDAR_APPT_ID) != "-1" && this._formatter && this._oldEndDate && 
		this._formatter.parse(AjxDateUtil.dateGMT2Local(this._oldEndDate)) > now)
	{
		ZmAppt.loadById(appCtxt.get(ZmSetting.VACATION_CALENDAR_APPT_ID),new AjxCallback(this, this._oooDeleteApptCallback));
	}
    if (this._durationCheckbox && this._durationCheckbox.isSelected()) {
        //Create calendar appointments for this out of office request.
	    var calCheckBox = this.getFormObject(ZmSetting.VACATION_CALENDAR_ENABLED);
	    if (calCheckBox && calCheckBox.isSelected()) {
            var stDate  = this._getPrefDate(ZmSetting.VACATION_FROM);
            var endDate = this._getPrefDate(ZmSetting.VACATION_UNTIL);
		    var allDay = this._allDayCheckbox.isSelected();
            if (stDate != null && endDate != null) {
                if (allDay) {
                    // Strip the time of day information - calendar view
                    // creates all-day appt with just day info
                    endDate.setHours(0,0,0,0);
                }
	            var calController = appCtxt.getApp(ZmApp.CALENDAR).getCalController();
	            calController.createAppointmentFromOOOPref(stDate,endDate, allDay, new AjxCallback(this, this._oooApptCallback));
            }
        }
    }
};

ZmMailPrefsPage.prototype._oooDeleteApptCallback = function(appt){
	if (appt) {
		var calController = appCtxt.getApp(ZmApp.CALENDAR).getCalController();
		calController._continueDelete(appt, ZmCalItem.MODE_DELETE);
		appCtxt.set(ZmSetting.VACATION_CALENDAR_APPT_ID, "-1");
	}
};

ZmMailPrefsPage.prototype._oooApptCallback = function(response){
	//store the appt id as meta data
	if (response && response.apptId) {
		appCtxt.set(ZmSetting.VACATION_CALENDAR_APPT_ID, response.apptId);
	}
    appCtxt.setStatusMsg(ZmMsg.oooStatus);
}

ZmMailPrefsPage.prototype._convModeChangeYesCallback =
function(dialog) {
	dialog.popdown();
	window.onbeforeunload = null;
	var url = AjxUtil.formatUrl();
	DBG.println(AjxDebug.DBG1, "Conv mode change, redirect to: " + url);
	ZmZimbraMail.sendRedirect(url); // redirect to self to force reload
};

// ??? SHOULD THIS BE IN A NEW FILE?       ???
// ??? IT IS ONLY USED BY ZmMailPrefsPage. ???
/**
 * Custom control used to handle adding/removing addresses for white/black list
 *
 * @param parent
 * @param id
 *
 * @private
 */
ZmWhiteBlackList = function(parent, id, templateId) {
	DwtComposite.call(this, {parent:parent});

	this._settingId = id;
    switch(id) {
        case ZmSetting.MAIL_BLACKLIST:
            this._max = appCtxt.get(ZmSetting.MAIL_BLACKLIST_MAX_NUM_ENTRIES);
            break;
        case ZmSetting.MAIL_WHITELIST:
            this._max = appCtxt.get(ZmSetting.MAIL_WHITELIST_MAX_NUM_ENTRIES);
            break;
        case ZmSetting.TRUSTED_ADDR_LIST:
            this._max = appCtxt.get(ZmSetting.TRUSTED_ADDR_LIST_MAX_NUM_ENTRIES);
            break;
    }
	this._setContent(templateId);

	this._list = [];
	this._add = {};
	this._remove = {};
};

ZmWhiteBlackList.prototype = new DwtComposite;
ZmWhiteBlackList.prototype.constructor = ZmWhiteBlackList;
ZmWhiteBlackList.prototype.isZmWhiteBlackList = true;

ZmWhiteBlackList.prototype.toString =
function() {
	return "ZmWhiteBlackList";
};

ZmWhiteBlackList.prototype.reset =
function() {
	this._inputEl.setValue("");
	this._listView.set(AjxVector.fromArray(this._list).clone(), null, true);
	this._add = {};
	this._remove = {};

	this.updateNumUsed();
};

ZmWhiteBlackList.prototype.getValue =
function() {
    return this._listView.getList().clone().getArray().join(',').replace(';', ',').split(',');
};


ZmWhiteBlackList.prototype.loadFromJson =
function(data) {
	if (data) {
        for (var i = 0; i < data.length; i++) {
            var content = AjxUtil.isSpecified(data[i]._content) ? data[i]._content : data[i];
            if(content){
			    var item = this._addEmail(content);
			    this._list.push(item);
            }
		}
	}
	this.updateNumUsed();
};

ZmWhiteBlackList.prototype.setSoapContent =
function(soapDoc, method) {
	if (!this.isDirty()) { return; }

	var methodEl = soapDoc.set(method);

	for (var i in this._add) {
		var addrEl = soapDoc.set("addr", i, methodEl);
		addrEl.setAttribute("op", "+");
	}

	for (var i in this._remove) {
		var addrEl = soapDoc.set("addr", i, methodEl);
		addrEl.setAttribute("op", "-");
	}
};

ZmWhiteBlackList.prototype.isDirty =
function() {
	var isDirty = false;

	for (var i in this._add) {
		isDirty = true;
		break;
	}

	if (!isDirty) {
		for (var i in this._remove) {
			isDirty = true;
			break;
		}
	}

	return isDirty;
};

ZmWhiteBlackList.prototype.saveLocal =
function() {
	if (this.isDirty()) {
		this._list = this._listView.getList().clone().getArray();
		this._add = {};
		this._remove = {};
	}
};

ZmWhiteBlackList.prototype.updateNumUsed =
function() {
	this._numUsedText.innerHTML = AjxMessageFormat.format(ZmMsg.whiteBlackNumUsed, [this._listView.size(), this._max]);
};

ZmWhiteBlackList.prototype._setContent =
function(templateId) {
	this.getHtmlElement().innerHTML = AjxTemplate.expand("prefs.Pages#"+templateId, {id:this._htmlElId});

	var id = this._htmlElId + "_EMAIL_ADDRESS";
	var el = document.getElementById(id);
	this._inputEl = new DwtInputField({parent:this, parentElement:id, size:35, hint:ZmMsg.enterEmailAddressOrDomain});
	this._inputEl.getInputElement().style.width = "210px";
	this._inputEl._showHint();
	this._inputEl.addListener(DwtEvent.ONKEYUP, new AjxListener(this, this._handleKeyUp));
	this.parent._addControlTabIndex(el, this._inputEl);

	id = this._htmlElId + "_LISTVIEW";
	el = document.getElementById(id);
	this._listView = new DwtListView({parent:this, parentElement:id});
	this._listView.addClassName("ZmWhiteBlackList");
	this.parent._addControlTabIndex(el, this._listView);

	id = this._htmlElId + "_ADD_BUTTON";
	el = document.getElementById(id);
	var addButton = new DwtButton({parent:this, parentElement:id});
	addButton.setText(ZmMsg.add);
	addButton.addSelectionListener(new AjxListener(this, this._addListener));
	this.parent._addControlTabIndex(el, addButton);

	id = this._htmlElId + "_REMOVE_BUTTON";
	el = document.getElementById(id);
	var removeButton = new DwtButton({parent:this, parentElement:id});
	removeButton.setText(ZmMsg.remove);
	removeButton.addSelectionListener(new AjxListener(this, this._removeListener));
	this.parent._addControlTabIndex(el, removeButton);

	id = this._htmlElId + "_NUM_USED";
	this._numUsedText = document.getElementById(id);
};

ZmWhiteBlackList.prototype._addEmail =
function(addr) {
	var item = new ZmWhiteBlackListItem(addr);
	this._listView.addItem(item, null, true);
	return item;
};

ZmWhiteBlackList.prototype._addListener =
function() {
	if (this._listView.size() >= this._max) {
		var dialog = appCtxt.getMsgDialog();
		dialog.setMessage(ZmMsg.errorWhiteBlackListExceeded);
		dialog.popup();
		return;
	}

	var val,
        items = AjxStringUtil.trim(this._inputEl.getValue(), true);
	if (items.length) {
        items = AjxStringUtil.split(items, [',', ';', ' ']);
        var invalidItems = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i] && !ZmWhiteBlackList._validate(items[i])) {
                invalidItems.push(AjxStringUtil.htmlEncode(items[i]));
            }
        }
        if (invalidItems.length > 0) {
            dialog = appCtxt.getMsgDialog();
            var msg = ZmMsg.invalidAddressOrDomainError + "<br><br>" +
                      "<b>" + ZmMsg.invalidAddressOrDomain + "</b><br>" +
                      invalidItems.join("<br>");
            dialog.setMessage(msg);
            dialog.popup();
            return;
        }

        for (var i = 0; i < items.length; i++) {
            val = items[i];
            if(val) {
                this._addEmail(AjxStringUtil.htmlEncode(val));
                if (!this._add[val]) {
                    this._add[val] = true;
                }
            }
        }
		this._inputEl.setValue("", true);
		this._inputEl.blur();
		this._inputEl.focus();

		this.updateNumUsed();
	}
};

ZmWhiteBlackList._validate =
function(str) {
    if (!str) {
        return false;
    }
    if (str.indexOf('@') > 0) {
        return AjxEmailAddress.validateAddress(str);
    } else {
        return ZmWhiteBlackList.validDomain.test(str);
    }
};

/*
 * When a sender address is sender@domain1.zimbra.com, for example,
 * the domain is parsed by amavis as follows:
 *    @domain1.zimbra.com  @.domain1.zimbra.com  @.zimbra.com  @.com  @.
 *    domain1.zimbra.com  zimbra.com  com
 *
 * Domain of an email address must support IPv4 and IPv6 formats defined in RFC 5321.
 *    e.g. sender@[192.168.0.1], sender@[IPv6:1234:5678:90ab:cdef]
 * The domain is parsed by amavis as follows, respectively:
 *    @[192.168.0.1]  @.
 *    @[IPv6:1234:5678:90ab:cdef]  @.
 */
ZmWhiteBlackList.validDomain = /(^@(\.?[a-z\-0-9]+)+$)|(^@\.$)|(^[a-z\-0-9]+(\.[a-z\-0-9]+)*$)|(^@\[([0-9]{1,3}\.){3}[0-9]{1,3}\]$)|(^@\[IPv6:[a-z0-9:]+\]$)/i;

ZmWhiteBlackList.prototype._removeListener =
function() {
	var items = this._listView.getSelection();
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		this._listView.removeItem(item, true);
		var addr = item.toString();
		if (this._add[addr]) {
			delete this._add[addr];
		} else {
			this._remove[addr] = true;
		}
	}

	this.updateNumUsed();
};

ZmWhiteBlackList.prototype._handleKeyUp =
function(ev) {
	var charCode = DwtKeyEvent.getCharCode(ev);
	if (charCode == 13 || charCode == 3) {
		this._addListener();
	}
};

// Helper
ZmWhiteBlackListItem = function(addr) {
	this.addr = addr;
	this.id = Dwt.getNextId();
};

ZmWhiteBlackListItem.prototype.toString =
function() {
	return this.addr;
};
}
if (AjxPackage.define("zimbraMail.mail.view.prefs.ZmSignaturesPage")) {
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

ZmSignaturesPage = function(parent, section, controller) {

	ZmPreferencesPage.call(this, parent, section, controller);

	this._minEntries = appCtxt.get(ZmSetting.SIGNATURES_MIN);	// added for Comcast
	this._maxEntries = appCtxt.get(ZmSetting.SIGNATURES_MAX);

	this.addControlListener(this._resetSize.bind(this));
};

ZmSignaturesPage.prototype = new ZmPreferencesPage;
ZmSignaturesPage.prototype.constructor = ZmSignaturesPage;

ZmSignaturesPage.prototype.toString = function() {
	return "ZmSignaturesPage";
};

//
// Constants
//

ZmSignaturesPage.SIGNATURE_TEMPLATE = "prefs.Pages#SignatureSplitView";

ZmSignaturesPage.SIG_TYPES = [ZmIdentity.SIGNATURE, ZmIdentity.REPLY_SIGNATURE];

//
// Public methods
//

ZmSignaturesPage.prototype.showMe =
function() {

	ZmPreferencesPage.prototype.showMe.call(this);

	// bug #41719 & #94845 - always update size on display
	this._resetSize();

	if (!this._firstTime) {
		this._firstTime = true;
	}

	// bug fix #31849 - reset the signature html editor when in multi-account mode
	// since the view gets re-rendered whenever the account changes
	if (appCtxt.multiAccounts) {
		this._signatureEditor = null;
	}
};

ZmSignaturesPage.prototype._rehashByName =
function() {
	this._byName = {};
	for (var id in this._signatures) {
		var signature = this._signatures[id];
        if (!signature._new) {         // avoid messing with existing signatures with same names
		    this._byName[signature.name] = signature;
        }
	}
};

ZmSignaturesPage.prototype.getNewSignatures =
function(onlyValid) {
	var list = [];
	this._rehashByName();
	for (var id in this._signatures) {
		var signature = this._signatures[id],
			isEmpty = signature._autoAdded && !(AjxStringUtil._NON_WHITESPACE.test(signature.getValue()) || AjxStringUtil._NON_WHITESPACE.test(signature.name));
		if (signature._new && !isEmpty && !(onlyValid && this._isInvalidSig(signature, true))) {
			list.push(signature);
		}
	}
	return list;
};

ZmSignaturesPage.prototype.getDeletedSignatures =
function() {
	return AjxUtil.values(this._deletedSignatures);
};

ZmSignaturesPage.prototype.getModifiedSignatures =
function() {

	var array = [];
	for (var id in this._signatures) {
		var signature = this._signatures[id];
		if (signature._new) {
			continue;
		}

		if (this._hasChanged(signature)) {
			array.push(signature);
		}
	}
	return array;
};

ZmSignaturesPage.SIG_FIELDS = [ZmIdentity.SIGNATURE, ZmIdentity.REPLY_SIGNATURE];

// returns a hash representing the current usage, based on form selects
ZmSignaturesPage.prototype._getUsage =
function(newOnly) {

	var usage = {};
	var foundOne;
	for (var identityId in this._sigSelect) {
		usage[identityId] = {};
		for (var j = 0; j < ZmSignaturesPage.SIG_FIELDS.length; j++) {
			var field = ZmSignaturesPage.SIG_FIELDS[j];
			var select = this._sigSelect[identityId] && this._sigSelect[identityId][field];
			if (select) {
				var sigId = select.getValue();
				if (newOnly && this._newSigId[sigId]) {
					return true;
				}
				else {
					usage[identityId][field] = sigId;
				}
			}
		}
	}
	return newOnly ? false : usage;
};

// returns a hash representing the current usage, based on identity data
ZmSignaturesPage.prototype._getUsageFromIdentities =
function() {

	var usage = {};
	var collection = appCtxt.getIdentityCollection();
	var identities = collection && collection.getIdentities();
	for (var i = 0, len = identities.length; i < len; i++) {
		var identity = identities[i];
		usage[identity.id] = {};
		for (var j = 0; j < ZmSignaturesPage.SIG_FIELDS.length; j++) {
			var field = ZmSignaturesPage.SIG_FIELDS[j];
			usage[identity.id][field] = identity.getField(field) || "";
		}
	}
	return usage;
};

/**
 * Returns a list of usage changes. Each item in the list details the identity,
 * which type of signature, and the ID of the new signature.
 */
ZmSignaturesPage.prototype.getChangedUsage =
function() {

	var list = [];
	var usage = this._getUsage();
	for (var identityId in usage) {
		var u1 = this._origUsage[identityId];
		var u2 = usage[identityId];
        if (u1 && u2){
		    for (var j = 0; j < ZmSignaturesPage.SIG_FIELDS.length; j++) {
			    var field = ZmSignaturesPage.SIG_FIELDS[j];
			    var savedSigId = (u1[field]) || ((field === ZmIdentity.REPLY_SIGNATURE) ? ZmIdentity.SIG_ID_NONE : u1[field]);
			    var curSigId = this._newSigId[u2[field]] || u2[field];
			    if (savedSigId !== curSigId) {
				    list.push({identity:identityId, sig:field, value:curSigId});
		        }
		    }
        }
	}
	return list;
};

ZmSignaturesPage.prototype.reset =
function(useDefaults) {
	this._updateSignature();
	ZmPreferencesPage.prototype.reset.apply(this, arguments);
	this._populateSignatures(true);
};

ZmSignaturesPage.prototype.resetOnAccountChange =
function() {
	ZmPreferencesPage.prototype.resetOnAccountChange.apply(this, arguments);
	this._selSignature = null;
	this._firstTime = false;
};

ZmSignaturesPage.prototype.isDirty =
function() {

	this._updateSignature();

	var printSigs = function(sig) {
		if (AjxUtil.isArray(sig)) {
			return AjxUtil.map(sig, printSigs).join("\n");
		}
		return [sig.name, " (", ((sig._orig && sig._orig.value !== sig.value) ? (sig._orig.value+" changed to ") : ""), sig.value, ")"].join("");
	}

	var printUsages = function(usage) {
		if (AjxUtil.isArray(usage)) {
			return AjxUtil.map(usage, printUsages).join("\n");
		}
		return ["identityId: ", usage.identity, ", type: ", usage.sig, ", signatureId: ", usage.value].join("");
	}

	if (this.getNewSignatures(false).length > 0) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\nNew signatures:\n" + printSigs(this.getNewSignatures(false)));
		return true;
	}
	if (this.getDeletedSignatures().length > 0) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\nDeleted signatures:\n" + printSigs(this.getDeletedSignatures()));
		return true;
	}
	if (this.getModifiedSignatures().length > 0) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\nModified signatures:\n" + printSigs(this.getModifiedSignatures()));
		return true;
	}
	if (this.getChangedUsage().length > 0) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\nSignature usage changed:\n" + printUsages(this.getChangedUsage()));
		return true;
	}
};

ZmSignaturesPage.prototype.validate =
function() {
	this._updateSignature();
	this._rehashByName();

	for (var id in this._signatures) {
		var error = this._isInvalidSig(this._signatures[id]);
		if (error) {
			this._errorMsg = error;
			return false;
		}
	}
	return true;
};

// The 'strict' parameter will make the function return true if a signature is not
// saveable, even if it can be safely ignored. Without it, the function returns an error
// only if there's bad user input.
ZmSignaturesPage.prototype._isInvalidSig =
function(signature, strict) {

	var hasName = AjxStringUtil._NON_WHITESPACE.test(signature.name);
	var hasContact = Boolean(signature.contactId);
	var hasValue = AjxStringUtil._NON_WHITESPACE.test(signature.getValue()) || hasContact;
	if (!hasName && !hasValue) {
		this._deleteSignature(signature);
		if (strict) {
			return true;
		}
	}
	else if (!hasName || !hasValue) {
		return !hasName ? ZmMsg.signatureNameMissingRequired : ZmMsg.signatureValueMissingRequired;
	}
	else if (strict && !hasValue) {
		return true;
	}
	if (hasName && this._byName[signature.name]) {
        // If its a new signature with a in-use name or a existing signature whose name the user is trying to edit to a existing name value
		if (signature._new || (this._byName[signature.name].id !== signature.id)) {
            return AjxMessageFormat.format(ZmMsg.signatureNameDuplicate, AjxStringUtil.htmlEncode(signature.name));
		}
	}
	var sigValue = signature.value;
	var maxLength = appCtxt.get(ZmSetting.SIGNATURE_MAX_LENGTH);
	if (maxLength > 0 && sigValue.length > maxLength) {
		return AjxMessageFormat.format((signature.contentType === ZmMimeTable.TEXT_HTML)
			? ZmMsg.errorHtmlSignatureTooLong
			: ZmMsg.errorSignatureTooLong, maxLength);
	}

	return false;
};

ZmSignaturesPage.prototype.getErrorMessage =
function() {
	return this._errorMsg;
};

ZmSignaturesPage.prototype.addCommand =
function(batchCommand) {

	// delete signatures
	var deletedSigs = this.getDeletedSignatures();
	for (var i = 0; i < deletedSigs.length; i++) {
		var signature = deletedSigs[i];
		var callback = this._handleDeleteResponse.bind(this, signature);
		signature.doDelete(callback, null, batchCommand);
	}

	// modify signatures
	var modifiedSigs = this.getModifiedSignatures();
	for (var i = 0; i < modifiedSigs.length; i++) {
		var signature = modifiedSigs[i];
		var comps = this._signatures[signature._htmlElId];
		var callback = this._handleModifyResponse.bind(this, signature);
		var errorCallback = this._handleModifyError.bind(this, signature);
		signature.save(callback, errorCallback, batchCommand);
	}

	// add signatures
	var newSigs = this.getNewSignatures(true);
	for (var i = 0; i < newSigs.length; i++) {
		var signature = newSigs[i];
		signature._id = signature.id; // Clearing existing dummy id
		signature.id = null;
		var callback = this._handleNewResponse.bind(this, signature);
		signature.create(callback, null, batchCommand);
	}

	// signature usage
	var sigChanges = this.getChangedUsage();
	if (sigChanges.length) {
		var collection = appCtxt.getIdentityCollection();
		if (collection) {
			for (var i = 0; i < sigChanges.length; i++) {
				var usage = sigChanges[i];
				var identity = collection.getById(usage.identity);
				// don't save usage of new signature just yet
				if (identity && !this._isTempId[usage.value]) {
					identity.setField(usage.sig, usage.value);
					identity.save(null, null, batchCommand);
				}
			}
		}
	}
};

ZmSignaturesPage.prototype.getPostSaveCallback =
function() {
	return this._postSave.bind(this);
};

// if a new sig has been assigned to an identity, we need to save again since
// we only now know the sig's ID
ZmSignaturesPage.prototype._postSave =
function() {

	var newUsage = this._getUsage(true);
	if (newUsage) {
		var respCallback = this._handleResponsePostSave.bind(this);
		this._controller.save(respCallback, true);
	}
};

ZmSignaturesPage.prototype._handleResponsePostSave =
function() {

	this._newSigId = {};	// clear this to prevent request loop
	this._resetOperations();
	this._origUsage = this._getUsage();	// form selects and data in identities should be in sync now
};

ZmSignaturesPage.prototype.setContact =
function(contact) {
	if (this._selSignature) {
		this._selSignature.contactId = contact.id;
	}
	this._vcardField.value = contact.getFileAs() || contact.getFileAsNoName();
};

//
// Protected methods
//

ZmSignaturesPage.prototype._initialize =
function(container) {

	container.getHtmlElement().innerHTML = AjxTemplate.expand(ZmSignaturesPage.SIGNATURE_TEMPLATE, {id:this._htmlElId});

	// Signature list
	var listEl = document.getElementById(this._htmlElId + "_SIG_LIST");
	var list = new ZmSignatureListView(this);
	this._replaceControlElement(listEl, list);
	list.setMultiSelect(false);
	list.addSelectionListener(this._selectionListener.bind(this));
	list.setUI(null, true); // renders headers and empty list
	this._sigList = list;

	// Signature ADD
	var addEl = document.getElementById(this._htmlElId + "_SIG_NEW");
	var button = new DwtButton(this);
	button.setText(ZmMsg.newSignature);
	button.addSelectionListener(this._handleAddButton.bind(this));
	this._replaceControlElement(addEl, button);
	this._sigAddBtn = button;

	// Signature DELETE
	var deleteEl = document.getElementById(this._htmlElId + "_SIG_DELETE");
	var button = new DwtButton(this);
	button.setText(ZmMsg.del);
	button.addSelectionListener(this._handleDeleteButton.bind(this));
	this._replaceControlElement(deleteEl, button);
	this._deleteBtn = button;

	// vCard INPUT
	this._vcardField = document.getElementById(this._htmlElId + "_SIG_VCARD");

	// vCard BROWSE
	var el = document.getElementById(this._htmlElId + "_SIG_VCARD_BROWSE");
	var button = new DwtButton(this);
	button.setText(ZmMsg.browse);
	button.addSelectionListener(this._handleVcardBrowseButton.bind(this));
	this._replaceControlElement(el, button);
	this._vcardBrowseBtn = button;

	// vCard CLEAR
	var el = document.getElementById(this._htmlElId + "_SIG_VCARD_CLEAR");
	var button = new DwtButton(this);
	button.setText(ZmMsg.clear);
	button.addSelectionListener(this._handleVcardClearButton.bind(this));
	this._replaceControlElement(el, button);
	this._vcardClearBtn = button;

	// Signature Name
	var nameEl = document.getElementById(this._htmlElId + "_SIG_NAME");
	var params = {
		parent:             this,
		type:               DwtInputField.STRING,
		required:           false,
		validationStyle:    DwtInputField.CONTINUAL_VALIDATION,
	};
	var input = this._sigName = new DwtInputField(params);
	input.setValidationCallback(this._updateName.bind(this));
	this._replaceControlElement(nameEl, input);

	// Signature FORMAT
	var formatEl = document.getElementById(this._htmlElId + "_SIG_FORMAT");
	if (formatEl && appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED)) {
		var select = new DwtSelect(this);
		select.setToolTipContent(ZmMsg.formatTooltip);
		select.addOption(ZmMsg.formatAsText, 1 , true);
		select.addOption(ZmMsg.formatAsHtml, 0, false);
		select.addChangeListener(this._handleFormatSelect.bind(this));
		this._replaceControlElement(formatEl, select);
		this._sigFormat = select;
	}

	// Signature CONTENT - editor added by ZmPref.regenerateSignatureEditor

	// Signature use by identity
	var collection = appCtxt.getIdentityCollection();
	if (collection) {
		collection.addChangeListener(this._identityChangeListener.bind(this));
	}

	this._initialized = true;
};

// generate usage selects based on identity data
ZmSignaturesPage.prototype._resetUsageSelects =
function(addSigs) {

	this._clearUsageSelects();

	var table = document.getElementById(this._htmlElId + "_SIG_TABLE");
	this._sigSelect = {};
	var signatures;
	if (addSigs) {
		signatures = appCtxt.getSignatureCollection().getSignatures(true);
	}
	var ic = appCtxt.getIdentityCollection();
	var identities = ic && ic.getIdentities(true);
	if (identities && identities.length) {
		for (var i = 0, len = identities.length; i < len; i++) {
			this._addUsageSelects(identities[i], table, signatures);
		}
	}
};

ZmSignaturesPage.prototype._clearUsageSelects =
function() {

	var table = document.getElementById(this._htmlElId + "_SIG_TABLE");
	while (table.rows.length > 1) {
		table.deleteRow(-1);
	}
	for (var id in this._sigSelect) {
		for (var field in this._sigSelect[id]) {
			var select = this._sigSelect[id][field];
			if (select) {
				select.dispose();
			}
		}
	}
};

ZmSignaturesPage.prototype._addUsageSelects =
function(identity, table, signatures, index) {

	table = table || document.getElementById(this._htmlElId + "_SIG_TABLE");
	index = (index != null) ? index : -1;
	var row = table.insertRow(index);
	row.id = identity.id + "_row";
	var name = identity.getField(ZmIdentity.NAME);
	if (name === ZmIdentity.DEFAULT_NAME) {
		name = ZmMsg.accountDefault;
	}
	var cell = row.insertCell(-1);
	cell.className = "ZOptionsLabel";
	var id = identity.id + "_name";
	cell.innerHTML = "<span id='" + id + "'>" + AjxStringUtil.htmlEncode(name) + ":</span>";

	this._sigSelect[identity.id] = {};
	for (var i = 0; i < ZmSignaturesPage.SIG_FIELDS.length; i++) {
		this._addUsageSelect(row, identity, signatures, ZmSignaturesPage.SIG_FIELDS[i]);
	}
};

ZmSignaturesPage.prototype._addUsageSelect =
function(row, identity, signatures, sigType) {

	var select = this._sigSelect[identity.id][sigType] = new DwtSelect(this);
	var curSigId = identity.getField(sigType);
	var noSigId = (sigType === ZmIdentity.REPLY_SIGNATURE) ? ZmIdentity.SIG_ID_NONE : "";
	this._addUsageSelectOption(select, {name:ZmMsg.noSignature, id:noSigId}, sigType, identity);
	if (signatures) {
		for (var i = 0, len = signatures.length; i < len; i++) {
			this._addUsageSelectOption(select, signatures[i], sigType, identity);
		}
	}
	var cell = row.insertCell(-1);
	select.reparentHtmlElement(cell);
};

// Bug 86217, Don't apply any default to the Reply Signature if it is not set.
ZmSignaturesPage.prototype._addUsageSelectOption =
function(select, signature, sigType, identity) {

	var curSigId = identity.getField(sigType);
	DBG.println(AjxDebug.DBG3, "Adding " + sigType + " option for " + identity.name + ": " + signature.name + " / " + signature.id + " (" + (curSigId === signature.id) + ")");
	// a new signature starts with an empty name; use a space so that option gets added
	select.addOption(signature.name || ' ', (curSigId === signature.id), signature.id);
};

// handles addition, removal, or rename of a signature within the form
ZmSignaturesPage.prototype._updateUsageSelects =
function(signature, action) {

	if (!this._initialized) {
		return;
	}

	for (var id in this._sigSelect) {
		for (var sigType in this._sigSelect[id]) {
			var select = this._sigSelect[id][sigType];
			if (select) {
				var hasOption = !!(select.getOptionWithValue(signature.id));
				var collection = appCtxt.getIdentityCollection();
				var identity = collection && collection.getById(id);
				if (action === ZmEvent.E_CREATE && !hasOption && identity) {
					this._addUsageSelectOption(select, signature, sigType, identity);
				}
				else if (action === ZmEvent.E_DELETE && hasOption && identity) {
					select.removeOptionWithValue(signature.id);
					var curSigId = identity.getField(sigType);
					if (curSigId === signature.id) {
						var noSigId = (sigType === ZmIdentity.REPLY_SIGNATURE) ? ZmIdentity.SIG_ID_NONE : "";
						select.setSelectedValue(noSigId);
					}
				}
				else if (action === ZmEvent.E_MODIFY && hasOption) {
					select.rename(signature.id, signature.name);
				}
			}
		}
	}
};

ZmSignaturesPage.prototype._identityChangeListener =
function(ev) {

	var identity = ev.getDetail("item");
	if (!identity) {
		return;
	}
	
	var collection = appCtxt.getIdentityCollection();
	var id = identity.id;
	var signatures = appCtxt.getSignatureCollection().getSignatures(true);
	var table = document.getElementById(this._htmlElId + "_SIG_TABLE");
	if (ev.event === ZmEvent.E_CREATE) {
		var index = collection.getSortIndex(identity);
		this._addUsageSelects(identity, table, signatures, index);
		for (var i = 0; i < ZmSignaturesPage.SIG_FIELDS.length; i++) {
			var field = ZmSignaturesPage.SIG_FIELDS[i];
			var select = this._sigSelect[id] && this._sigSelect[id][field];
			if (select) {
				this._origUsage[id] = this._origUsage[id] || {};
				this._origUsage[id][field] = select.getValue();
			}
		}
	}
	else if (ev.event === ZmEvent.E_DELETE) {
		var row = document.getElementById(id + "_row");
		if (row) {
			table.deleteRow(row.rowIndex);
		}
		delete this._origUsage[id];
	}
	else if (ev.event === ZmEvent.E_MODIFY) {
		var row = document.getElementById(id + "_row");
		if (row) {
			var index = collection.getSortIndex(identity);
			if (index === row.rowIndex - 1) {	// header row doesn't count
				var span = document.getElementById(id + "_name");
				if (span) {
					span.innerHTML = AjxStringUtil.htmlEncode(identity.name) + ":";
				}
			}
			else {
				table.deleteRow(row.rowIndex);
				this._addUsageSelects(identity, table, signatures, index);
			}
		}
	}
};

// Sets the height of the editor and the list
ZmSignaturesPage.prototype._resetSize =
function() {
	if (!this._sigEditor || !this._sigList) {
		return;
	}

	// resize editor and list to fit appropriately -- in order to get this
	// right, we size them to a minimum, and then apply the sizes of their
	// containing table cells
	AjxUtil.foreach([this._sigEditor, this._sigList], function(ctrl) {
		ctrl.setSize(0, 0);

		var bounds = Dwt.getInsetBounds(ctrl.getHtmlElement().parentNode);
		ctrl.setSize(bounds.width, bounds.height);
	});
};

ZmSignaturesPage.prototype._setupCustom =
function(id, setup, value) {
	if (id === ZmSetting.SIGNATURES) {
		// create container control
		var container = new DwtComposite(this);
		this.setFormObject(id, container);

		// create radio group for defaults
		this._defaultRadioGroup = new DwtRadioButtonGroup();

		this._initialize(container);

		return container;
	}

	return ZmPreferencesPage.prototype._setupCustom.apply(this, arguments);
};

ZmSignaturesPage.prototype._selectionListener =
function(ev) {

	this._updateSignature();

	var signature = this._sigList.getSelection()[0];
	if (signature) {
		this._resetSignature(this._signatures[signature.id]);
	}
	this._resetOperations();
};

ZmSignaturesPage.prototype._insertImagesListener =
function(ev) {
	AjxDispatcher.require("BriefcaseCore");
	appCtxt.getApp(ZmApp.BRIEFCASE)._createDeferredFolders();
	var callback = this._sigEditor._imageUploaded.bind(this._sigEditor);
	var cFolder = appCtxt.getById(ZmOrganizer.ID_BRIEFCASE);
	var dialog = appCtxt.getUploadDialog();
	dialog.popup(null, cFolder, callback, ZmMsg.uploadImage, null, true);
};

// Updates name and format of selected sig based on form fields
ZmSignaturesPage.prototype._updateSignature =
function(select) {

	if (!this._selSignature) {
		return;
	}

	var sig = this._selSignature;
	var newName = AjxStringUtil.trim(this._sigName.getValue());
	var isNameModified = (newName !== sig.name);

	sig.name = newName;

	var isText = this._sigFormat ? this._sigFormat.getValue() : true;
	sig.setContentType(isText ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML);

	sig.value = this._sigEditor.getContent(false, true);

	if (isNameModified) {
		this._sigList.redrawItem(sig);
		this._updateUsageSelects(sig, ZmEvent.E_MODIFY);
	}
};

ZmSignaturesPage.prototype._populateSignatures =
function(reset) {

	this._signatures = {};
	this._deletedSignatures = {};
	this._origUsage = {};
	this._isTempId = {};
	this._newSigId = {};
	this._byName = {};

	this._selSignature = null;
	this._sigList.removeAll(true);
	this._sigList._resetList();
	this._resetUsageSelects();	// signature options will be added via _addSignature

	var signatures = appCtxt.getSignatureCollection().getSignatures(true);
	var count = Math.min(signatures.length, this._maxEntries);
	for (var i = 0; i < count; i++) {
		var signature = signatures[i];
		this._addSignature(signature, true, reset);
	}
	for (var i = count; i < this._minEntries; i++) {
		this._addNewSignature(true, true);  // autoAdded
	}

	var selectSig = this._sigList.getList().get(0);
	this._sigList.setSelection(selectSig);

	this._origUsage = this._getUsageFromIdentities();
};

ZmSignaturesPage.prototype._getNewSignature =
function() {
	var signature = new ZmSignature(null);
	signature.id = Dwt.getNextId();
	signature.name = '';
	signature._new = true;
	this._isTempId[signature.id] = true;
	return signature;
};

ZmSignaturesPage.prototype._addNewSignature =
function(skipControls, autoAdded) {
	// add new signature
	var signature = this._getNewSignature();
    var sigEditor = this._sigEditor;
    if (sigEditor) {
        sigEditor.setContent('');
    }
    signature._autoAdded = autoAdded;
	signature = this._addSignature(signature, skipControls);
	setTimeout(this._sigName.focus.bind(this._sigName), 100);

	return signature;
};

ZmSignaturesPage.prototype._addSignature =
function(signature, skipControls, reset, index, skipNotify) {

	if (!signature._new) {
		if (reset) {
			this._restoreFromOrig(signature);
		} else if (!signature._orig) {
			this._setOrig(signature);
		}
	}

	this._signatures[signature.id] = signature;

	if (this._sigList.getItemIndex(signature) === null) {
		this._sigList.addItem(signature, index);
		if (!skipNotify) {
			this._updateUsageSelects(signature, ZmEvent.E_CREATE);
		}
	}

	if (!skipControls) {
		this._resetSignature(signature); // initialize state
	}

	this._resetOperations();
	if (signature.name) {
		this._byName[signature.name] = signature;
	}

	return signature;
};

ZmSignaturesPage.prototype._fixSignatureInlineImages_onTimer =
function(msg) {
	// first time the editor is initialized, idoc.getElementsByTagName("img") is empty
	// Instead of waiting for 500ms, trying to add this callback. Risky but works.
	if (!this._firstTimeFixImages) {
		this._sigEditor.addOnContentInitializedListener(this._fixSignatureInlineImages.bind(this));
	}
	else {
		this._fixSignatureInlineImages();
	}
};

ZmSignaturesPage.prototype._fixSignatureInlineImages =
function() {
	var idoc = this._sigEditor.getIframeDoc();
	if (idoc) {
		if (!this._firstTimeFixImages) {
			this._firstTimeFixImages = true;
			this._sigEditor.clearOnContentInitializedListeners();
		}

		var images = idoc.getElementsByTagName("img");
		var path = appCtxt.get(ZmSetting.REST_URL) + ZmFolder.SEP;
		var img;
		for (var i = 0; i < images.length; i++) {
			img = images[i];
			var dfsrc = img.getAttribute("dfsrc");
			if (dfsrc && dfsrc.indexOf("doc:") === 0) {
				var url = [path, dfsrc.substring(4)].join('');
				img.src = AjxStringUtil.fixCrossDomainReference(url, false, true);
			}
		}
	}
};

ZmSignaturesPage.prototype._restoreSignatureInlineImages =
function() {
	var idoc = this._sigEditor.getIframeDoc();
	if (idoc) {
		var images = idoc.getElementsByTagName("img");
		var img;
		for (var i = 0; i < images.length; i++) {
			img = images[i];
			var dfsrc = img.getAttribute("dfsrc");
			if (dfsrc && dfsrc.substring(0, 4) === "doc:") {
				img.removeAttribute("src");
			}
		}
	}
};

ZmSignaturesPage.prototype._resetSignature =
function(signature, clear) {
	this._selSignature = signature;
	if (!signature) {
		return;
	}

	this._sigList.setSelection(signature, true);
	this._sigName.setValue(signature.name, true);
	if (this._sigFormat) {
		this._sigFormat.setSelectedValue(signature.getContentType() === ZmMimeTable.TEXT_PLAIN);
	}
	var vcardName = "";
	if (signature.contactId) {
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var contact = contactsApp && contactsApp.getContactList().getById(signature.contactId);
		if (contact) {
			vcardName = contact.getFileAs() || contact.getFileAsNoName();
		}
	}
	this._vcardField.value = vcardName;

    this._sigEditor.clear();
	var editorMode = (appCtxt.get(ZmSetting.HTML_COMPOSE_ENABLED) && signature.getContentType() === ZmMimeTable.TEXT_HTML)
		? Dwt.HTML : Dwt.TEXT;
	var htmlModeInited = this._sigEditor.isHtmlModeInited();
	if (editorMode !== this._sigEditor.getMode()) {
		this._sigEditor.setMode(editorMode);
		this._resetSize();
	}
	this._sigEditor.setContent(signature.getValue(editorMode === Dwt.HTML ? ZmMimeTable.TEXT_HTML : ZmMimeTable.TEXT_PLAIN));
	if (editorMode === Dwt.HTML) {
		this._fixSignatureInlineImages_onTimer();
	}
};

ZmSignaturesPage.prototype._resetOperations =
function() {
	if (this._sigAddBtn) {
		var hasEmptyNewSig = false;
		for (var id in this._signatures) {
			var signature = this._signatures[id];
			if (signature._new && !signature.name) {
				hasEmptyNewSig = true;
				break;
			}
		}
		this._sigAddBtn.setEnabled(!hasEmptyNewSig && this._sigList.size() < this._maxEntries);
	}
};

ZmSignaturesPage.prototype._setFormat =
function(isText) {
	this._sigEditor.setMode(isText ? Dwt.TEXT : Dwt.HTML, true);
	this._selSignature.setContentType(isText ? ZmMimeTable.TEXT_PLAIN : ZmMimeTable.TEXT_HTML);
	this._resetSize();
};

ZmSignaturesPage.prototype._formatOkCallback =
function(isText) {
	this._formatWarningDialog.popdown();
	this._setFormat(isText);
};

ZmSignaturesPage.prototype._formatCancelCallback =
function(isText) {
	this._formatWarningDialog.popdown();
	// reset the option
	this._sigFormat.setSelectedValue(!isText);
};


// buttons
ZmSignaturesPage.prototype._handleFormatSelect =
function(ev) {
	var isText = this._sigFormat ? this._sigFormat.getValue() : true;
	var currentIsText = this._sigEditor.getMode() === Dwt.TEXT;
	if (isText === currentIsText) {
		return;
	}

	var content = this._sigEditor.getContent();
	var contentIsEmpty = (content === "<html><body><br></body></html>" || content === "");

	if (!contentIsEmpty && isText) {
		if (!this._formatWarningDialog) {
			this._formatWarningDialog = new DwtMessageDialog({parent : appCtxt.getShell(), buttons : [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON]});
		}
		var dialog = this._formatWarningDialog;
		dialog.registerCallback(DwtDialog.OK_BUTTON, this._formatOkCallback, this, [isText]);
		dialog.registerCallback(DwtDialog.CANCEL_BUTTON, this._formatCancelCallback, this, [isText]);
		dialog.setMessage(ZmMsg.switchToText, DwtMessageDialog.WARNING_STYLE);
		dialog.popup();
		return;
	}
	this._setFormat(isText);

};

ZmSignaturesPage.prototype._handleAddButton =
function(ev) {
	this._updateSignature();
	this._addNewSignature();
};

ZmSignaturesPage.prototype._deleteSignature =
function(signature, skipNotify) {
	signature = signature || this._selSignature;
	if (this._selSignature && !skipNotify) {
		this._sigName.clear();
	}
	this._sigList.removeItem(signature);
	if (!skipNotify) {
		this._updateUsageSelects(signature, ZmEvent.E_DELETE);
	}
	delete this._signatures[signature.id];
	if (!signature._new) {
		this._deletedSignatures[signature.id] = signature;
	}
	delete this._byName[signature.name];
};

ZmSignaturesPage.prototype._handleDeleteButton =
function(evt) {
    var sigEditor = this._sigEditor;
	this._deleteSignature();
	this._selSignature = null;

    if (sigEditor) {
        sigEditor.setContent('');
    }
	if (this._sigList.size() > 0) {
		var sel = this._sigList.getList().get(0);
		if (sel) {
			this._sigList.setSelection(sel);
		}
	}
	else {
		for (var i = 0; i < this._minEntries; i++) {
			this._addNewSignature(false, true); //autoAdded
		}
	}
	this._resetOperations();
};

// saving

ZmSignaturesPage.prototype._handleDeleteResponse =
function(signature, resp) {
	delete this._deletedSignatures[signature.id];
};

ZmSignaturesPage.prototype._handleModifyResponse =
function(signature, resp) {
	delete this._byName[signature._orig.name];
	this._byName[signature.name] = signature;
	this._setOrig(signature);
};

ZmSignaturesPage.prototype._handleModifyError =
function(signature) {
	this._restoreFromOrig(signature);
	if (this._selSignature.id === signature.id) {
		this._resetSignature(signature);
	}
	return true;
};

ZmSignaturesPage.prototype._handleNewResponse =
function(signature, resp) {
	var id = signature.id;
	signature.id = signature._id;

	// delete and add so that ID of row in list view is updated
	var index = this._sigList.getItemIndex(signature);
	this._deleteSignature(signature, true);
	signature.id = id;
	this._addSignature(signature, false, false, index, true);

	this._newSigId[signature._id] = signature.id;
	delete signature._new;

	this._setOrig(signature);
};

ZmSignaturesPage.prototype._handleVcardBrowseButton =
function(ev) {

	var query;
	if (!this._vcardPicker) {
		AjxDispatcher.require(["ContactsCore", "Contacts"]);
		this._vcardPicker = new ZmVcardPicker({sigPage:this});
		var user = appCtxt.getUsername();
		query = user.substr(0, user.indexOf('@'));
	}
	this._vcardPicker.popup(query);
};

ZmSignaturesPage.prototype._handleVcardClearButton =
function(ev) {
	this._vcardField.value = "";
	if (this._selSignature) {
		this._selSignature.contactId = null;
	}
};

// validation

ZmSignaturesPage.prototype._updateName =
function(field, isValid) {

	var signature = this._selSignature;
	if (!signature) {
		return;
	}

	if (signature.name !== field.getValue()) {
		signature.name = field.getValue();
		this._sigList.redrawItem(signature);
		this._sigList.setSelection(signature, true);
		this._resetOperations();
		this._updateUsageSelects(signature, ZmEvent.E_MODIFY);
	}
};

ZmSignaturesPage.prototype._hasChanged =
function(signature) {

	var o = signature._orig;
	return (o.name !== signature.name ||
			o.contactId !== signature.contactId ||
			o.contentType !== signature.getContentType() ||
			!AjxStringUtil.equalsHtmlPlatformIndependent(AjxStringUtil.htmlEncode(o.value), AjxStringUtil.htmlEncode(signature.getValue())));
};

ZmSignaturesPage.prototype._setOrig =
function(signature) {
	signature._orig = {
		name:			signature.name,
		contactId:		signature.contactId,
		value:			signature.getValue(),
		contentType:	signature.getContentType()
	};
};

ZmSignaturesPage.prototype._restoreFromOrig =
function(signature) {
	var o = signature._orig;
	signature.name = o.name;
	signature.contactId = o.contactId;
	signature.value = o.value;
	signature.setContentType(o.contentType);
};

//
// Classes
//

//ZmSignatureListView:  Signatures List

ZmSignatureListView = function(parent) {
	if (arguments.length === 0) { return; }

	DwtListView.call(this, {parent:parent, className:"ZmSignatureListView"});
};

ZmSignatureListView.prototype = new DwtListView;
ZmSignatureListView.prototype.constructor = ZmSignatureListView;

ZmSignatureListView.prototype.toString =
function() {
	return "ZmSignatureListView";
};

ZmSignatureListView.prototype._getCellContents =
function(html, idx, signature, field, colIdx, params) {
	html[idx++] = signature.name ? AjxStringUtil.htmlEncode(signature.name, true) : ZmMsg.signatureNameHint;
	return idx;
};

ZmSignatureListView.prototype._getItemId =
function(signature) {
	return (signature && signature.id) ? signature.id : Dwt.getNextId();
};

ZmSignatureListView.prototype.setSignatures =
function(signatures) {
	this._resetList();
	this.addItems(signatures);
	var list = this.getList();
	if (list && list.size() > 0) {
		this.setSelection(list.get(0));
	}
};


// ZmVcardPicker

ZmVcardPicker = function(params) {

	params = params || {};
	params.parent = appCtxt.getShell();
	params.title = ZmMsg.selectContact;
	DwtDialog.call(this, params);

	this._sigPage = params.sigPage;
	this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._okButtonListener));
};

ZmVcardPicker.prototype = new DwtDialog;
ZmVcardPicker.prototype.constructor = ZmVcardPicker;

ZmVcardPicker.prototype.popup =
function(query, account) {

	if (!this._initialized) {
		this._initialize();
	}
	this._contactSearch.reset(query, account);
	if (query) {
		this._contactSearch.search();
	}

	DwtDialog.prototype.popup.call(this);
};

ZmVcardPicker.prototype._initialize =
function(account) {

	var options = {preamble: ZmMsg.vcardContactSearch};
	this._contactSearch = new ZmContactSearch({options:options});
	this.setView(this._contactSearch);
	this._initialized = true;
};

ZmVcardPicker.prototype._okButtonListener =
function(ev) {

	var data = this._contactSearch.getContacts();
	var contact = data && data[0];
	if (contact) {
		this._sigPage.setContact(contact);
	}

	this.popdown();
};
}
if (AjxPackage.define("zimbraMail.mail.view.prefs.ZmTrustedPage")) {
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
 * Creates an empty shortcuts page.
 * @constructor
 * @class
 * This class represents a page which allows user to modify the trusted addresses/domain list
 * <p>
 * Only a single pref (the user's shortcuts gathered together in a string)
 * is represented.</p>
 *
 * @author Santosh Sutar
 *
 * @param {DwtControl}	parent			the containing widget
 * @param {object}	section			the page
 * @param {ZmPrefController}	controller		the prefs controller
 *
 * @extends		ZmPreferencesPage
 *
 * @private
 */
ZmTrustedPage = function(parent, section, controller, id) {
	ZmPreferencesPage.apply(this, arguments);
};

ZmTrustedPage.prototype = new ZmPreferencesPage;
ZmTrustedPage.prototype.constructor = ZmTrustedPage;

ZmTrustedPage.prototype.toString =
function () {
    return "ZmTrustedPage";
};

ZmTrustedPage.prototype.showMe =
function() {
	ZmPreferencesPage.prototype.showMe.call(this);

	if (!this._initialized) {
		this._initialized = true;
	}
};

ZmTrustedPage.prototype._setupCustom =
function(id, setup, value) {
	if (id == ZmSetting.TRUSTED_ADDR_LIST) {
		this._trustedListControl = new ZmWhiteBlackList(this, id, "TrustedList");
        var trustedList = appCtxt.get(ZmSetting.TRUSTED_ADDR_LIST);

        	if (trustedList) {
                for (var i = 0; i < trustedList.length; i++) {
                    trustedList[i] = AjxStringUtil.htmlEncode(trustedList[i]);
        		}
        	}

        this._trustedListControl.loadFromJson(trustedList);

		return this._trustedListControl;
	}
};

ZmTrustedPage.prototype.addItem =
function(addr) {
    if(addr && this._trustedListControl) {
        this._trustedListControl.loadFromJson([addr]);
    }
};

ZmTrustedPage.prototype.reset =
function(useDefaults) {
	ZmPreferencesPage.prototype.reset.apply(this, arguments);

	if (this._trustedListControl) {
		this._trustedListControl.reset();
	}
};

ZmTrustedPage.prototype.isDirty =
function() {
	var isDirty = ZmPreferencesPage.prototype.isDirty.call(this) || this.isTrustedListDirty();
	if (isDirty) {
		AjxDebug.println(AjxDebug.PREFS, "Dirty preferences:\n" + "zimbraPrefMailTrustedSenderList");
	}
	return isDirty;
};

ZmTrustedPage.prototype.isTrustedListDirty =
function() {
	if (this._trustedListControl) {
		return this._trustedListControl.isDirty();
	}
	return false;
};

ZmTrustedPage.prototype.addCommand =
function(batchCmd) {
    if(this._trustedListControl && this._trustedListControl.isDirty()) {
        var i,
            value = this._trustedListControl.getValue(),
            soapDoc = AjxSoapDoc.create("ModifyPrefsRequest", "urn:zimbraAccount"),
            node,
            respCallback = new AjxCallback(this, this._postSaveBatchCmd, value.join(','));
        for(i=0; i<value.length;i++) {
            node = soapDoc.set("pref", AjxStringUtil.trim(value[i]));
            node.setAttribute("name", "zimbraPrefMailTrustedSenderList");
        }
        batchCmd.addNewRequestParams(soapDoc, respCallback);
    }
};

ZmTrustedPage.prototype._postSaveBatchCmd =
function(value) {
    appCtxt.set(ZmSetting.TRUSTED_ADDR_LIST, value.split(','));
    var settings = appCtxt.getSettings();
    var trustedListSetting = settings.getSetting(ZmSetting.TRUSTED_ADDR_LIST);
    trustedListSetting._notify(ZmEvent.E_MODIFY); 
    if(this._trustedListControl) {
        this._trustedListControl.saveLocal();
    }
};
}

if (AjxPackage.define("zimbraMail.prefs.controller.ZmPrefController")) {
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
 * Creates a new, empty preferences controller.
 * @constructor
 * @class
 * This class represents the preferences controller. This controller manages
 * the options pages.
 *
 * @author Conrad Damon
 *
 * @param {DwtShell}			container		the shell
 * @param {ZmPreferencesApp}	prefsApp		the preferences application
 * 
 * @extends		ZmController
 */
ZmPrefController = function(container, prefsApp) {

	if (arguments.length == 0) { return; }
	
	ZmController.call(this, container, prefsApp);

	this._listeners = {};
	this._listeners[ZmOperation.SAVE] = this._saveListener.bind(this);
	this._listeners[ZmOperation.CANCEL] = this._backListener.bind(this);
	this._listeners[ZmOperation.REVERT_PAGE] =
		this._resetPageListener.bind(this);

	this._filtersEnabled = appCtxt.get(ZmSetting.FILTERS_ENABLED);
	this._dirty = {};
};

ZmPrefController.prototype = new ZmController;
ZmPrefController.prototype.constructor = ZmPrefController;

ZmPrefController.prototype.isZmPrefController = true;
ZmPrefController.prototype.toString = function() { return "ZmPrefController"; };


ZmPrefController.getDefaultViewType =
function() {
	return ZmId.VIEW_PREF;
};
ZmPrefController.prototype.getDefaultViewType = ZmPrefController.getDefaultViewType;

/**
 * Shows the tab options pages.
 */
ZmPrefController.prototype.show = 
function() {
	this._setView();
	this._prefsView.show();
	this._app.pushView(this._currentViewId);
};

/**
 * Gets the preferences view (a view with tabs).
 * 
 * @return	{ZmPrefView}		the preferences view
 */
ZmPrefController.prototype.getPrefsView =
function() {
	return this._prefsView;
};

/**
 * Gets the current preferences page
 *
 * @return	{ZmPreferencesPage}		the current page
 */
ZmPrefController.prototype.getCurrentPage =
function() {
	var tabKey = this._prefsView.getCurrentTab();
	return this._prefsView.getTabView(tabKey);
};

/**
 * Gets the account test dialog.
 * 
 * @return	{ZmAccountTestDialog}	the account test dialog
 */
ZmPrefController.prototype.getTestDialog =
function() {
	if (!this._testDialog) {
		this._testDialog = new ZmAccountTestDialog(this._container);
	}
	return this._testDialog;
};

/**
 * Gets the filter controller.
 * 
 * @return	{ZmFilterController}	the filter controller
 */
ZmPrefController.prototype.getFilterController =
function(section) {
	if (!this._filterController) {
		this._filterController = new ZmFilterController(this._container, this._app, this._prefsView, section || ZmPref.getPrefSectionWithPref(ZmSetting.FILTERS), this);
	}
	return this._filterController;
};

/**
 * Gets the mobile devices controller.
 * 
 * @return	{ZmMobileDevicesController}	the mobile devices controller
 */
ZmPrefController.prototype.getMobileDevicesController =
function() {
	if (!this._mobileDevicesController) {
		this._mobileDevicesController = new ZmMobileDevicesController(this._container, this._app, this._prefsView);
	}
	return this._mobileDevicesController;
};

/**
 * Checks for a precondition on the given object. If one is found, it is
 * evaluated based on its type. Note that the precondition must be contained
 * within the object in a property named "precondition".
 *
 * @param obj			[object]	an object, possibly with a "precondition" property.
 * @param precondition	[object]*	explicit precondition to check
 * 
 * @private
 */
ZmPrefController.prototype.checkPreCondition =
function(obj, precondition) {
	// No object, nothing to check
	if (!obj && !ZmSetting[precondition]) {
		return true;
	}
	// Object lacks "precondition" property, nothing to check
	if (obj && !("precondition" in obj)) {
		return true;
	}
	var p = (obj && obj.precondition) || precondition;
	// Object has a precondition that didn't get defined, probably because its
	// app is not enabled. That equates to failure for the precondition.
	if (p == null) {
		return false;
	}
	// Precondition is set to true or false
	if (AjxUtil.isBoolean(p)) {
		return p;
	}
	// Precondition is a function, look at its result
	if (AjxUtil.isFunction(p)) {
		return p();
	}
	// A list of preconditions is ORed together via a recursive call
	if (AjxUtil.isArray(p)) {
		for (var i = 0, count = p.length; i < count; i++) {
			if (this.checkPreCondition(null, p[i])) {
				return true;
			}
		}
		return false;
	}
	// Assume that the precondition is a setting, and return its value
	return Boolean(appCtxt.get(p));
};

ZmPrefController.prototype.getKeyMapName =
function() {
	return ZmKeyMap.MAP_OPTIONS;
};

ZmPrefController.prototype.handleKeyAction =
function(actionCode) {
	DBG.println("ZmPrefController.handleKeyAction");
	switch (actionCode) {

		case ZmKeyMap.CANCEL:
			this._backListener();
			break;

		case ZmKeyMap.SAVE:
			this._saveListener();
			break;

		default:
			return ZmController.prototype.handleKeyAction.call(this, actionCode);
			break;
	}
	return true;
};

ZmPrefController.prototype.mapSupported =
function(map) {
	return (map == "tabView");
};

/**
 * Gets the tab view.
 * 
 * @return	{ZmPrefView}		the preferences view
 * 
 * @see		#getPrefsView
 */
ZmPrefController.prototype.getTabView =
function() {
	return this.getPrefsView();
};

ZmPrefController.prototype.resetDirty =
function(view, dirty) {
	this._dirty = {};
};

ZmPrefController.prototype.setDirty =
function(view, dirty) {
	this._dirty[view] = dirty;
};

ZmPrefController.prototype.isDirty =
function(view) {
	return this._dirty[view];
};

/**
 * Public method called to save prefs - does not check for dirty flag.
 *
 * @param {AjxCallback}	callback	the async callback
 * @param {Boolean}	noPop		if <code>true</code>, do not pop view after save
 *
 * TODO: shouldn't have to call getChangedPrefs() twice
 * 
 * @private
 */
ZmPrefController.prototype.save =
function(callback, noPop) {
	// perform pre-save ops, if needed
	var preSaveCallbacks = this._prefsView.getPreSaveCallbacks();
	if (preSaveCallbacks && preSaveCallbacks.length > 0) {
		var continueCallback = new AjxCallback(this, this._doPreSave);
		continueCallback.args = [continueCallback, preSaveCallbacks, callback, noPop];
		this._doPreSave.apply(this, continueCallback.args);
	}
	else { // do basic save
		this._doSave(callback, noPop);
	}
};

/**
 * Enables/disables toolbar buttons.
 *
 * @param {ZmButtonToolBar}	parent		the toolbar
 * @param {constant}	view		the current view (tab)
 * 
 * @private
 */
ZmPrefController.prototype._resetOperations =
function(parent, view) {
	var section = ZmPref.getPrefSectionMap()[view];
	var manageChanges = section && section.manageChanges;
	parent.enable(ZmOperation.SAVE, !manageChanges);
	parent.enable(ZmOperation.CANCEL, true);
};

/**
 * Creates the prefs view, with a tab for each preferences page.
 * 
 * @private
 */
ZmPrefController.prototype._setView = 
function() {
	if (!this._prefsView) {
		this._initializeToolBar();
		this._initializeLeftToolBar();
		var callbacks = new Object();
		callbacks[ZmAppViewMgr.CB_PRE_HIDE]		= this._preHideCallback.bind(this);
		callbacks[ZmAppViewMgr.CB_PRE_UNLOAD]	= this._preUnloadCallback.bind(this);
		callbacks[ZmAppViewMgr.CB_PRE_SHOW]		= this._preShowCallback.bind(this);
		callbacks[ZmAppViewMgr.CB_POST_SHOW]	= this._postShowCallback.bind(this);

		this._prefsView = new ZmPrefView({parent:this._container, posStyle:Dwt.ABSOLUTE_STYLE, controller:this});
		var elements = {};
		elements[ZmAppViewMgr.C_NEW_BUTTON] = this._lefttoolbar;
		elements[ZmAppViewMgr.C_TOOLBAR_TOP] = this._toolbar;
		elements[ZmAppViewMgr.C_APP_CONTENT] = this._prefsView;

		this._app.createView({	viewId:		this._currentViewId,
								elements:	elements,
								controller:	this,
								callbacks:	callbacks,
								isAppView:	true});
		this._initializeTabGroup();
	}
};

/**
 * Initializes the left toolbar and sets up the listeners.
 *
 * @private
 */
ZmPrefController.prototype._initializeLeftToolBar =
function () {
	if (this._lefttoolbar) return;

	var buttons = [ZmOperation.SAVE, ZmOperation.CANCEL];
	this._lefttoolbar = new ZmButtonToolBar({parent:this._container, buttons:buttons, context:this._currentViewId});
	buttons = this._lefttoolbar.opList;
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (this._listeners[button]) {
			this._lefttoolbar.addSelectionListener(button, this._listeners[button]);
		}
	}
	this._lefttoolbar.getButton(ZmOperation.SAVE).setToolTipContent(ZmMsg.savePrefs);
};

/**
 * Initializes the toolbar and sets up the listeners.
 * 
 * @private
 */
ZmPrefController.prototype._initializeToolBar = 
function () {
	if (this._toolbar) return;
	
	var buttons = this._getToolBarOps();
	this._toolbar = new ZmButtonToolBar({parent:this._container, buttons:buttons, context:this._currentViewId});
	buttons = this._toolbar.opList;
	for (var i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (this._listeners[button]) {
			this._toolbar.addSelectionListener(button, this._listeners[button]);
		}
	}

	appCtxt.notifyZimlets("initializeToolbar", [this._app, this._toolbar, this, this._currentViewId], {waitUntilLoaded:true});

};

/**
 * Returns the current tool bar (the one on the left with Save/Cancel).
 *
 * @return	{ZmButtonToolbar}		the toolbar
 */
ZmPrefController.prototype.getCurrentToolbar = function() {
    return this._lefttoolbar;
};

ZmPrefController.prototype._getToolBarOps =
function () {
	return [ZmOperation.REVERT_PAGE];
};

ZmPrefController.prototype._initializeTabGroup = 
function () {
	var tg = this._createTabGroup();
	var rootTg = appCtxt.getRootTabGroup();
	tg.newParent(rootTg);
	tg.addMember(this._lefttoolbar.getTabGroupMember());
	tg.addMember(this._toolbar.getTabGroupMember());
	tg.addMember(this._prefsView.getTabGroupMember());
};

/**
 * Saves any options that have been changed. This method first sees if any of the
 * preference pages need to perform any logic prior to the actual save. See the
 * <code>ZmPrefView#getPreSaveCallbacks</code> documentation for further details.
 *
 * @param ev		[DwtEvent]		click event
 * @param callback	[AjxCallback]	async callback
 * @param noPop		[boolean]		if true, don't pop view after save
 * 
 * TODO: shouldn't have to call getChangedPrefs() twice
 * 
 * @private
 */
ZmPrefController.prototype._saveListener = 
function(ev, callback, noPop) {
	// is there anything to do?
	var dirty = this._prefsView.getChangedPrefs(true, true);
	if (!dirty) {
		appCtxt.getAppViewMgr().popView(true);
		return;
	}

	this.save(callback, noPop);
};

ZmPrefController.prototype._doPreSave =
function(continueCallback, preSaveCallbacks, callback, noPop, success) {
	// cancel save
	if (success != null && !success) { return; }

	// perform save
	if (preSaveCallbacks.length == 0) {
		this._doSave(callback, noPop);
	}

	// continue pre-save operations
	else {
		var preSaveCallback = preSaveCallbacks.shift();
		preSaveCallback.run(continueCallback);
	}
};

ZmPrefController.prototype._doSave =
function(callback, noPop) {
	var batchCommand = new ZmBatchCommand(false);

	//  get changed prefs
	var list;
	try {
		list = this._prefsView.getChangedPrefs(false, false, batchCommand);
	}
	catch (e) {
		// getChangedPrefs throws an AjxException if any of the values have not passed validation.
		if (e instanceof AjxException) {
			appCtxt.setStatusMsg(e.msg, ZmStatusView.LEVEL_CRITICAL);
		} else {
			throw e;
		}
		return;
	}

	// save generic settings
	appCtxt.getSettings().save(list, null, batchCommand);
    this.resetDirty();

	// save any extra commands that may have been added
	if (batchCommand.size()) {
		var respCallback = this._handleResponseSaveListener.bind(this, true, callback, noPop, list);
		var errorCallback = this._handleResponseSaveError.bind(this);
		batchCommand.run(respCallback, errorCallback);
	}
	else {
		this._handleResponseSaveListener(list.length > 0, callback, noPop, list);
	}
};

ZmPrefController.prototype._handleResponseSaveError =
function(exception1/*, ..., exceptionN*/) {
	for (var i = 0; i < arguments.length; i++) {
		var exception = arguments[i];
		var message = exception instanceof AjxException ?
					  (exception.msg || exception.code) : String(exception);
		if (exception.code == ZmCsfeException.ACCT_INVALID_ATTR_VALUE ||
			exception.code == ZmCsfeException.INVALID_REQUEST) {
			// above faults come with technical/cryptic LDAP error msg; input validation
			// should keep us from getting here
			message = ZmMsg.invalidPrefValue;
		}
        else if(exception.code == ZmCsfeException.TOO_MANY_IDENTITIES) {
            //Bug fix # 80409 - Show a custom/localized message and not the server error
            message = ZmMsg.errorTooManyIdentities;
        }
        else if(exception.code == ZmCsfeException.IDENTITY_EXISTS) {
           //Displaying custom message in case of identity already exists
           message = AjxMessageFormat.format(ZmMsg.errorIdentityAlreadyExists, message.substring(message.length, message.lastIndexOf(':') + 2));
        }
		appCtxt.setStatusMsg(message, ZmStatusView.LEVEL_CRITICAL);
	}
};

ZmPrefController.prototype._handleResponseSaveListener =
function(optionsSaved, callback, noPop, list, result) {
	if (optionsSaved) {
		appCtxt.setStatusMsg(ZmMsg.optionsSaved);
	}

	var hasFault = result && result._data && result._data.BatchResponse
		? result._data.BatchResponse.Fault : null;

	if (!noPop && (!result || !hasFault)) {
		try {
			// pass force flag - we just saved, so we know view isn't dirty
			appCtxt.getAppViewMgr().popView(true);
		} catch (ex) {
			// do nothing - sometimes popView throws an exception ala history mgr
		}
	}
	
	if (callback) {
		callback.run(result);
	}

	var changed = {};
	for (var i = 0; i < list.length; i++) {
		changed[list[i].id] = true;
	}
	var postSaveCallbacks = this._prefsView.getPostSaveCallbacks();
	if (postSaveCallbacks && postSaveCallbacks.length) {
		for (var i = 0; i < postSaveCallbacks.length; i++) {
			postSaveCallbacks[i].run(changed);
		}
	}
	//Once preference is saved, reload the application cache to get the latest changes
	appCtxt.reloadAppCache();
};

ZmPrefController.prototype._backListener = 
function() {
	appCtxt.getAppViewMgr().popView();
};

ZmPrefController.prototype._resetPageListener =
function() {
	var viewPage = this.getCurrentPage();

	viewPage.reset(false);
	appCtxt.setStatusMsg(ZmMsg.defaultsPageRestore);
};

ZmPrefController.prototype._stateChangeListener =
function (ev) {
	var resetbutton = this._toolbar.getButton(ZmOperation.REVERT_PAGE);
	resetbutton.setEnabled(this.getCurrentPage().hasResetButton());
}

ZmPrefController.prototype._preHideCallback =
function(view, force) {
	ZmController.prototype._preHideCallback.call(this);
	return force ? true : this.popShield();
};

ZmPrefController.prototype._preUnloadCallback =
function(view) {
	return !this._prefsView.isDirty();
};

ZmPrefController.prototype._preShowCallback =
function() {
	if (appCtxt.multiAccounts) {
		var viewPage = this.getCurrentPage();
		if (viewPage) {
			// bug: 42399 - the active account may not be "owned" by what is
			// initially shown in prefs
			var active = appCtxt.accountList.activeAccount;
			if (!this._activeAccount) {
				this._activeAccount = active;
			}
			else if (this._activeAccount != active) {
				appCtxt.accountList.setActiveAccount(this._activeAccount);
			}

			viewPage.showMe();
		}
	}
	return true; // *always* return true!
};

ZmPrefController.prototype._postShowCallback =
function() {
	ZmController.prototype._postShowCallback.call(this);
	// NOTE: Some pages need to know when they are being shown again in order to
	//       display the state correctly.
	this._prefsView.reset();
};

ZmPrefController.prototype.popShield =
function() {
	if (!this._prefsView.isDirty()) { return true; }

	var ps = this._popShield = appCtxt.getYesNoCancelMsgDialog();
	ps.reset();
	ps.setMessage(ZmMsg.confirmExitPreferences, DwtMessageDialog.WARNING_STYLE);
	ps.registerCallback(DwtDialog.YES_BUTTON, this._popShieldYesCallback, this);
	ps.registerCallback(DwtDialog.NO_BUTTON, this._popShieldNoCallback, this);
	ps.registerCallback(DwtDialog.CANCEL_BUTTON, this._popShieldCancelCallback, this);
	ps.popup();

	return false;
};

ZmPrefController.prototype._popShieldYesCallback =
function() {
	var respCallback = new AjxCallback(this, this._handleResponsePopShieldYesCallback);
	this._saveListener(null, respCallback, true);
	this._popShield.popdown();
};

ZmPrefController.prototype._handleResponsePopShieldYesCallback =
function() {
	appCtxt.getAppViewMgr().showPendingView(true);
};

ZmPrefController.prototype._popShieldNoCallback =
function() {
	this._prefsView.reset();
	this._popShield.popdown();
    this.resetDirty();
	appCtxt.getAppViewMgr().showPendingView(true);
};

ZmPrefController.prototype._popShieldCancelCallback =
function() {
	this._popShield.popdown();
	appCtxt.getAppViewMgr().showPendingView(false);
};

ZmPrefController.prototype._getDefaultFocusItem = 
function() {
	return this._prefsView.getTabGroupMember() || this._lefttoolbar || this._toolbar || null;
};
}
if (AjxPackage.define("zimbraMail.prefs.controller.ZmFilterController")) {
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
 * Creates a new, empty filter rules controller.
 * @class
 * This class represents the filter rules controller. This controller manages
 * the filter rules page, which has a button toolbar and a list view of the rules.
 *
 * @author Conrad Damon
 *
 * @param {DwtShell}		container		the shell
 * @param {ZmPreferencesApp}	prefsApp		the preferences application
 * 
 * @extends		ZmController
 */
ZmFilterController = function(container, prefsApp, prefsView, section, parent) {

	ZmPrefController.call(this, container, prefsApp);

	this._prefsView = prefsView;

	this._parent = parent;
	this._toolbar = parent._toolbar;

	this._filterView = new ZmFilterPage(prefsView, section, this);
	this._incomingFilterRulesController = new ZmFilterRulesController(container, prefsApp, this._filterView, this, false);
	this._outgoingFilterRulesController = new ZmFilterRulesController(container, prefsApp, this._filterView, this, true);
};

ZmFilterController.prototype = new ZmPrefController;
ZmFilterController.prototype.constructor = ZmFilterController;

ZmFilterController.prototype.toString =
function() {
	return "ZmFilterController";
};

/**
 * Gets the filter rules view, which is comprised of a toolbar and a list view.
 * 
 * @return	{ZmFilterRulesView}		the filter rules view
 */
ZmFilterController.prototype.getFilterView =
function() {
	return this._filterView;
};

ZmFilterController.prototype.getIncomingFilterRulesController =
function() {
	return this._incomingFilterRulesController;
};

ZmFilterController.prototype.getOutgoingFilterRulesController =
function() {
	return this._outgoingFilterRulesController;
};
/**
 * Initializes the controller.
 * 
 * @param	{ZmToolBar}	toolbar		the toolbar
 * @param	{ZmListView}	listView		the list view
 */
ZmFilterController.prototype.initialize =
function() {

};

ZmFilterController.prototype._getToolBarOps =
function () {
	return [];
};

ZmFilterController.prototype.hasOutgoingFiltersActive =
function(callback) {
	var rules = this._outgoingFilterRulesController.getRules();
	if (!rules._initialized) {
		rules.loadRules(false, new AjxCallback(this, this._handleLoadFilters, [callback]));
	} else {
		var outgoingActive = rules.getActiveRules().size() > 0;
		if (callback)
			callback.run(outgoingActive);
		return outgoingActive;
	}
};

ZmFilterController.prototype._handleLoadFilters =
function(callback) {
	var outgoingActive = this._outgoingFilterRulesController.getRules().getActiveRules().size() > 0;
	if (callback)
		callback.run(outgoingActive);
	return outgoingActive;
};

ZmFilterController.prototype._stateChangeListener =
function (ev) {
   var index, sel, rules = null;

   var listView = this._incomingFilterRulesController.getListView();
   if (listView) {
       sel = listView.getSelection()[0];
       rules = this._incomingFilterRulesController.getRules();
       index = sel ? rules.getIndexOfRule(sel) : null;
       this._incomingFilterRulesController.resetListView(index);
   }

   var outListView = this._outgoingFilterRulesController.getListView();
   if (outListView) {
       sel = outListView.getSelection()[0];
       rules = this._outgoingFilterRulesController.getRules();
       index = sel ? rules.getIndexOfRule(sel) : null;
       this._outgoingFilterRulesController.resetListView(index);
   }

	ZmPrefController.prototype._stateChangeListener.apply(this, arguments);
};
}
if (AjxPackage.define("zimbraMail.prefs.controller.ZmFilterRulesController")) {
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
 * Creates a new, empty filter rules controller.
 * @class
 * This class represents the filter rules controller. This controller manages
 * the filter rules page, which has a button toolbar and a list view of the rules.
 *
 * @author Conrad Damon
 *
 * @param {DwtShell}		container		the shell
 * @param {ZmPreferencesApp}	prefsApp		the preferences application
 * 
 * @extends		ZmController
 */
ZmFilterRulesController = function(container, prefsApp, prefsView, parent, outgoing) {

	ZmController.call(this, container, prefsApp);

	this._prefsView = prefsView;
	this._parent = parent;

	this._filterRulesView = new ZmFilterRulesView(this._prefsView, this);

	this._outgoing = Boolean(outgoing);

	this._buttonListeners = {};
	this._buttonListeners[ZmOperation.ADD_FILTER_RULE] = new AjxListener(this, this._addListener);
	this._buttonListeners[ZmOperation.EDIT_FILTER_RULE] = new AjxListener(this, this._editListener);
	this._buttonListeners[ZmOperation.REMOVE_FILTER_RULE] = new AjxListener(this, this._removeListener);
	this._buttonListeners[ZmOperation.RUN_FILTER_RULE] = new AjxListener(this, this._runListener);
	this._progressController = new ZmProgressController(container, prefsApp);

	// reset community name since it gets its value from a setting
	ZmFilterRule.C_LABEL[ZmFilterRule.C_COMMUNITY] = ZmMsg.communityName;
};

ZmFilterRulesController.prototype = new ZmController();
ZmFilterRulesController.prototype.constructor = ZmFilterRulesController;

ZmFilterRulesController.prototype.toString =
function() {
	return "ZmFilterRulesController";
};

ZmFilterRulesController.prototype.isOutgoing =
function() {
	return this._outgoing;
};

/**
 * Gets the filter rules view, which is comprised of a toolbar and a list view.
 * 
 * @return	{ZmFilterRulesView}		the filter rules view
 */
ZmFilterRulesController.prototype.getFilterRulesView =
function() {
	return this._filterRulesView;
};

/**
 * Initializes the controller.
 * 
 * @param	{ZmToolBar}	toolbar		the toolbar
 * @param	{ZmListView}	listView		active list view
 * @param   {ZmListView}    listView        not active list view
 */
ZmFilterRulesController.prototype.initialize =
function(toolbar, listView, notActiveListView) {
	// always reset the the rules to make sure we get the right one for the *active* account
	this._rules = AjxDispatcher.run(this._outgoing ? "GetOutgoingFilterRules" : "GetFilterRules");

	if (toolbar) {
		var buttons = this.getToolbarButtons();
		for (var i = 0; i < buttons.length; i++) {
			var id = buttons[i];
			if (this._buttonListeners[id]) {
				toolbar.addSelectionListener(id, this._buttonListeners[id]);
			}
		}
		this._resetOperations(toolbar, 0);
	}

	if (notActiveListView) {
		this._notActiveListView = notActiveListView;
		notActiveListView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
		notActiveListView.addActionListener(new AjxListener(this, this._listActionListener));
		this.resetListView(0);
	}
	
	if (listView) {
		this._listView = listView;
		listView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
		listView.addActionListener(new AjxListener(this, this._listActionListener));
		this.resetListView(0);
	}
	
};

ZmFilterRulesController.prototype.getRules =
function() {
	if (!this._rules)
		this._rules = AjxDispatcher.run(this._outgoing ? "GetOutgoingFilterRules" : "GetFilterRules");
	return this._rules;
};

ZmFilterRulesController.prototype.getToolbarButtons =
function() {
	var ops = [
		ZmOperation.ADD_FILTER_RULE,
		ZmOperation.SEP,
		ZmOperation.EDIT_FILTER_RULE,
		ZmOperation.SEP,
		ZmOperation.REMOVE_FILTER_RULE
	];

	// bug: 42903 - disable running filters in offline for now
	if (!appCtxt.isOffline) {
		ops.push(ZmOperation.SEP, ZmOperation.RUN_FILTER_RULE);
	}

	return ops;
};

ZmFilterRulesController.prototype.resetListView =
function(selectedIndex) {
	if (!this._listView) { return; }

	var respCallback = new AjxCallback(this, this._handleResponseSetListView, [selectedIndex]);
	this._rules.loadRules(true, respCallback);  //bug 37339 - filters don't show newly created filter
};

ZmFilterRulesController.prototype._handleResponseSetListView =
function(selectedIndex, result) {
	this._listView.set(result.getResponse().clone());
	this._notActiveListView.set(result.getResponse().clone());
	var rule = this._rules.getRuleByIndex(selectedIndex || 0);
	if (rule && rule.active) {
		this._listView.setSelection(rule);
	}
	else if (rule) {
		this._notActiveListView.setSelection(rule);
	}
};

/**
 * Handles left-clicking on a rule. Double click opens up a rule for editing.
 *
 * @param	{DwtEvent}	ev		the click event
 * 
 * @private
 */
ZmFilterRulesController.prototype._listSelectionListener =
function(ev) {
	var listView = this.getListView();
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		this._editListener(ev);
	} else {
		var tb = this._filterRulesView.getToolbar();
		this._resetOperations(tb, listView.getSelectionCount(), listView.getSelection());
	}
};

ZmFilterRulesController.prototype._listActionListener =
function(ev) {
	var listView = this.getListView();
	var actionMenu = this.getActionMenu();
	this._resetOperations(actionMenu, listView.getSelectionCount(), listView.getSelection());
	actionMenu.popup(0, ev.docX, ev.docY);
};

/**
 * Gets the action menu.
 * 
 * @return	{ZmActionMenu}		the action menu
 */
ZmFilterRulesController.prototype.getActionMenu =
function() {
	if (!this._actionMenu) {
		this._initializeActionMenu();
		var listView = this.getListView();
		this._resetOperations(this._actionMenu, 0, listView.getSelection());
	}
	return this._actionMenu;
};

// action menu: menu items and listeners
ZmFilterRulesController.prototype._initializeActionMenu =
function() {
	if (this._actionMenu) { return; }

	var menuItems = this._getActionMenuOps();
	if (menuItems) {
		var params = {
			parent:this._shell,
			menuItems:menuItems,
			context:this._getMenuContext(),
			controller:this
		};
		this._actionMenu = new ZmActionMenu(params);
		this._addMenuListeners(this._actionMenu);
	}
};

ZmFilterRulesController.prototype._getActionMenuOps =
function() {
	var ops = [
		ZmOperation.EDIT_FILTER_RULE,
		ZmOperation.REMOVE_FILTER_RULE
	];

	// bug: 42903 - disable running filters in offline for now
	if (!appCtxt.isOffline) {
		ops.push(ZmOperation.RUN_FILTER_RULE);
	}

	ops.push(ZmOperation.SEP,
			ZmOperation.MOVE_UP_FILTER_RULE,
			ZmOperation.MOVE_DOWN_FILTER_RULE
	);

	return ops;
};

/**
 * Returns the context for the action menu created by this controller (used to create
 * an ID for the menu).
 */
ZmFilterRulesController.prototype._getMenuContext =
function() {
	return this._app && this._app._name;
};

ZmFilterRulesController.prototype._addMenuListeners =
function(menu) {
	var menuItems = menu.opList;
	for (var i = 0; i < menuItems.length; i++) {
		var menuItem = menuItems[i];
		if (this._buttonListeners[menuItem]) {
			menu.addSelectionListener(menuItem, this._buttonListeners[menuItem], 0);
		}
	}
	menu.addPopdownListener(this._menuPopdownListener);
};

/**
* The "Add Filter" button has been pressed.
*
* @ev		[DwtEvent]		the click event
*/
ZmFilterRulesController.prototype._addListener =
function(ev) {
	var listView = this.getListView();
	if (!listView) { return; }
	this.handleBeforeFilterChange(new AjxCallback(this, this._popUpAdd));
};

ZmFilterRulesController.prototype.handleBeforeFilterChange =
function(okCallback, cancelCallback) {
	if (this._outgoing && (appCtxt.getSettings().getSetting(ZmSetting.SAVE_TO_SENT).getValue()===false || ZmPref.getFormValue(ZmSetting.SAVE_TO_SENT)===false)) {
		var dialog = appCtxt.getConfirmationDialog();
		if (!this._saveToSentMessage) {
			var html = [];
			var i = 0;
			html[i++] = "<table role='presentation' cellspacing=0 cellpadding=0 border=0><tr><td valign='top'>";
			html[i++] = AjxImg.getImageHtml("Warning_32");
			html[i++] = "</td><td class='DwtMsgArea'>";
			html[i++] = ZmMsg.filterOutgoingNoSaveToSentWarning;
			html[i++] = "</td></tr></table>";
			this._saveToSentMessage = html.join("");
		}
		var handleSaveToSentYesListener = new AjxListener(this, this._handleSaveToSentYes, [okCallback]);
		var handleSaveToSentNoListener = new AjxListener(this, this._handleSaveToSentNo, [okCallback]);
		
		dialog.popup(this._saveToSentMessage, handleSaveToSentYesListener, handleSaveToSentNoListener, cancelCallback);
		dialog.setTitle(AjxMsg.warningMsg);
	} else {
		if (okCallback)
			okCallback.run();
	}
};

ZmFilterRulesController.prototype._handleSaveToSentYes =
function(callback) {
	var settings = appCtxt.getSettings();
	var setting = settings.getSetting(ZmSetting.SAVE_TO_SENT);
	ZmPref.setFormValue(ZmSetting.SAVE_TO_SENT, true);
	if (!setting.getValue()) {
		setting.setValue(true);
		settings.save([setting], callback);
	} else {
		if (callback)
			callback.run();
	}
};

ZmFilterRulesController.prototype._handleSaveToSentNo =
function(callback) {
	if (callback)
		callback.run();
};

ZmFilterRulesController.prototype._popUpAdd =
function() {
	var listView = this.getListView();
	var sel = listView.getSelection();
	var refRule = sel.length ? sel[sel.length - 1] : null;
	appCtxt.getFilterRuleDialog().popup(null, false, refRule, null, this._outgoing);
};

/**
* The "Edit Filter" button has been pressed.
*
* @ev		[DwtEvent]		the click event
*/
ZmFilterRulesController.prototype._editListener =
function(ev) {
	var listView = this.getListView();
	if (!listView) { return; }

	var sel = listView.getSelection();
	appCtxt.getFilterRuleDialog().popup(sel[0], true, null, null, this._outgoing);
};

/**
* The "Delete Filter" button has been pressed.
*
* @ev			[DwtEvent]		the click event
*/
ZmFilterRulesController.prototype._removeListener =
function(ev) {
	var listView = this.getListView();
	if (!listView) { return; }
	var sel = listView.getSelection();
	var rule = sel[0];
	//bug:16053 changed getYesNoCancelMsgDialog to getYesNoMsgDialog
	var ds = this._deleteShield = appCtxt.getYesNoMsgDialog();
	ds.reset();
	ds.registerCallback(DwtDialog.NO_BUTTON, this._clearDialog, this, this._deleteShield);
	ds.registerCallback(DwtDialog.YES_BUTTON, this._deleteShieldYesCallback, this, rule);
	var msg = AjxMessageFormat.format(ZmMsg.askDeleteFilter, AjxStringUtil.htmlEncode(rule.name));
	ds.setMessage(msg, DwtMessageDialog.WARNING_STYLE);
	ds.popup();
};

ZmFilterRulesController.prototype._runListener =
function(ev) {
	// !!! do *NOT* get choose folder dialog from appCtxt since this one has checkboxes!
	if (!this._chooseFolderDialog) {
		AjxDispatcher.require("Extras");
		this._chooseFolderDialog = new ZmChooseFolderDialog(appCtxt.getShell());
	}
	this._chooseFolderDialog.reset();
	this._chooseFolderDialog.registerCallback(DwtDialog.OK_BUTTON, this._runFilterOkCallback, this, this._chooseFolderDialog);

	// bug 42725: always omit shared folders
	var omit = {};
	var tree = appCtxt.getTree(ZmOrganizer.FOLDER);
	var children = tree.root.children.getArray();
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.type == ZmOrganizer.FOLDER && child.isRemote()) {
			omit[child.id] = true;
		}
	}

	var params = {
		treeIds:		[ZmOrganizer.FOLDER],
		title:			ZmMsg.chooseFolder,
		overviewId:		this.toString() + (this._outgoing ? "_outgoing":"_incoming"),
		description:	ZmMsg.chooseFolderToFilter,
		skipReadOnly:	true,
		hideNewButton:	true,
		treeStyle:		DwtTree.CHECKEDITEM_STYLE,
		appName:		ZmApp.MAIL,
		omit:			omit
	};
	this._chooseFolderDialog.popup(params);

	var foundForwardAction;
	var listView = this.getListView();
	var sel = listView && listView.getSelection();
	for (var i = 0; i < sel.length; i++) {
		if (sel[i].actions[ZmFilterRule.A_NAME_FORWARD]) {
			foundForwardAction = true;
			break;
		}
	}

	if (foundForwardAction) {
		var dialog = appCtxt.getMsgDialog();
		dialog.setMessage(ZmMsg.filterForwardActionWarning);
		dialog.popup();
	}
};

ZmFilterRulesController.prototype._runFilterOkCallback =
function(dialog, folderList) {
	dialog.popdown();
	var listView = this.getListView();
	var filterSel = listView && listView.getSelection();
	if (!(filterSel && filterSel.length)) {
		return;
	}

	// Bug 78392: We need the selection sorted
	if (filterSel.length > 1) {
		var list = this._listView.getList().getArray();
		var selectedIds = {}, sortedSelection = [];
		for (var i=0; i<filterSel.length; i++) {
			selectedIds[filterSel[i].id] = true;
		}
		for (var i=0; i<list.length; i++) {
			if (selectedIds[list[i].id]) {
				sortedSelection.push(list[i]);
			}
		}
		filterSel = sortedSelection;
	}

	var work = new ZmFilterWork(filterSel, this._outgoing);

	this._progressController.start(folderList, work);

};

/**
 * runs a specified list of filters
 * 
 * @param container     {DwtControl} container reference
 * @param filterSel     {Array} array of ZmFilterRule
 * @param isOutgoing    {Boolean} 
 */
ZmFilterRulesController.prototype.runFilter = 
function(container, filterSel, isOutgoing) {
	var work = new ZmFilterWork(filterSel, isOutgoing);
	this._progressController.start(container, work);
};

/**
* The user has agreed to delete a filter rule.
*
* @param rule	[ZmFilterRule]		rule to delete
*/
ZmFilterRulesController.prototype._deleteShieldYesCallback =
function(rule) {
	this._rules.removeRule(rule);
	this._clearDialog(this._deleteShield);
	this._resetOperations(this._filterRulesView.getToolbar(), 0);
};

/**
* The "Move Up" button has been pressed.
*
* @param	ev		[DwtEvent]		the click event
*/
ZmFilterRulesController.prototype.moveUpListener =
function(ev) {
	var listView = this.getListView();
	if (!listView) { return; }

	var sel = listView.getSelection();
	this._rules.moveUp(sel[0]);
};

/**
* The "Move Down" button has been pressed.
*
* @ev		[DwtEvent]		the click event
*/
ZmFilterRulesController.prototype.moveDownListener =
function(ev) {
	var listView = this.getListView();
	if (!listView) { return; }

	var sel = listView.getSelection();
	this._rules.moveDown(sel[0]);
};

/**
* Resets the toolbar button states, depending on which rule is selected.
* The list view enforces single selection only. If the first rule is selected,
* "Move Up" is disabled. Same for last rule and "Move Down". They're both
* disabled if there aren't at least two rules.
*
* @param parent		[ZmButtonToolBar]	the toolbar
* @param numSel		[int]				number of rules selected (0 or 1)
* @param sel		[Array]				list of selected rules
*/
ZmFilterRulesController.prototype._resetOperations =
function(parent, numSel, sel) {
	var numRules = this._rules.getNumberOfRules();
	if (numSel == 1) {
		parent.enableAll(true);
	} else {
		parent.enableAll(false);
		parent.enable(ZmOperation.ADD_FILTER_RULE, true);
		if (numSel > 1) {
			parent.enable(ZmOperation.RUN_FILTER_RULE, true);
		}
	}

	if (numRules == 0) {
		parent.enable(ZmOperation.EDIT_FILTER_RULE, false);
		parent.enable(ZmOperation.REMOVE_FILTER_RULE, false);
	}
};

ZmFilterRulesController.prototype.getListView =
function(){
	if (this._listView && this._notActiveListView) {
		var activeSel = this._listView.getSelection();
		var notActiveSel = this._notActiveListView.getSelection();
		if (!AjxUtil.isEmpty(activeSel)) {
			return this._listView;
		}
		else if (!AjxUtil.isEmpty(notActiveSel)) {
			return this._notActiveListView;
		}
	}
    return this._listView;
};



/**
 * class that holds the work specification (in this case, filtering specific filters. Keeps track of progress stats too.
 * an instance of this is passed to ZmFilterRulesController to callback for stuff specific to this work. (template pattern, I believe)
 * @param filterSel
 * @param outgoing
 */
ZmFilterWork = function(filterSel, outgoing) {
	this._filterSel = filterSel;
	this._outgoing = outgoing;
	this._totalNumMessagesAffected = 0;

};

/**
 * return the summary message when finished everything.
 */
ZmFilterWork.prototype.getFinishedMessage =
function(messagesProcessed) {
	if (messagesProcessed) {
		return AjxMessageFormat.format(ZmMsg.filterRuleApplied, [messagesProcessed, this._totalNumMessagesAffected]);
	}
	else {
		return AjxMessageFormat.format(ZmMsg.filterRuleAppliedBackground, [this._totalNumMessagesAffected]);
	}
};

/**
 * return the progress so far summary.
 */
ZmFilterWork.prototype.getProgressMessage =
function(messagesProcessed) {
	return AjxMessageFormat.format(ZmMsg.filterRunInProgress, [messagesProcessed, this._totalNumMessagesAffected]);
};

/**
 * return the finished dialog title.
 */
ZmFilterWork.prototype.getFinishedTitle =
function(messagesProcessed) {
	return AjxMessageFormat.format(ZmMsg.filterRunFinished);
};

/**
 * return the progress dialog title.
 */
ZmFilterWork.prototype.getProgressTitle =
function(messagesProcessed) {
	return AjxMessageFormat.format(ZmMsg.filterRunInProgressTitle);
};


/**
 * do the work. (in this case apply filters). Either msgIds or query should be set but not both.
 * @param msgIds {String} chunk of message ids to do the work on.
 * @param query {String} query to run filter against
 * @param callback
 */
ZmFilterWork.prototype.doWork =
function(msgIds, query, callback) {
	var filterSel = this._filterSel;
	var soapDoc = AjxSoapDoc.create(this._outgoing ? "ApplyOutgoingFilterRulesRequest" : "ApplyFilterRulesRequest", "urn:zimbraMail");
	var filterRules = soapDoc.set("filterRules", null);
	for (var i = 0; i < filterSel.length; i++) {
		var rule = soapDoc.set("filterRule", null, filterRules);
		rule.setAttribute("name", filterSel[i].name);
	}
	var noBusyOverlay = false;
	if (msgIds) {
		var m = soapDoc.set("m");
		m.setAttribute("ids", msgIds.join(","));
	}
	else {
		soapDoc.set("query", query);
		noBusyOverlay = true;
	}

	var params = {
		soapDoc: soapDoc,
		asyncMode: true,
		noBusyOverlay: noBusyOverlay,
		callback: (new AjxCallback(this, this._handleRunFilter, [callback]))
	};
	appCtxt.getAppController().sendRequest(params);
};

/**
 * private method - gets the result of the filter request, and keeps track of total messages affected.
 * @param callback
 * @param result
 */
ZmFilterWork.prototype._handleRunFilter =
function(callback, result) {
	var r = result.getResponse();
	var resp = this._outgoing ? r.ApplyOutgoingFilterRulesResponse : r.ApplyFilterRulesResponse;
	var num = (resp && resp.m && resp.m.length)
		? (resp.m[0].ids.split(",").length) : 0;
	this._totalNumMessagesAffected += num;
	callback.run();
};


}
if (AjxPackage.define("zimbraMail.prefs.controller.ZmMobileDevicesController")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2009, 2010, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 */

/**
 * Creates the mobile devices controller.
 * @constructor
 * @class
 * This class represents the mobile devices controller. This controller manages the
 * mobile devices page, which has a button toolbar and a list view of the devices.
 *
 * @author Parag Shah
 *
 * @param {DwtShell}	container		the shell
 * @param {ZmPreferencesApp}	prefsApp		the preferences app
 * @param {ZmPrefView}	prefsView		the preferences view
 * 
 * @extends		ZmController
 */
ZmMobileDevicesController = function(container, prefsApp, prefsView) {

	ZmController.call(this, container, prefsApp);

	this._prefsView = prefsView;

	this._devices = new AjxVector();
};

ZmMobileDevicesController.prototype = new ZmController();
ZmMobileDevicesController.prototype.constructor = ZmMobileDevicesController;

ZmMobileDevicesController.prototype.toString =
function() {
	return "ZmMobileDevicesController";
};

/**
 * Initializes the controller.
 * 
 * @param	{ZmToolBar}	toolbar		the toolbar
 * @param	{ZmListView}	listView		the list view
 */
ZmMobileDevicesController.prototype.initialize =
function(toolbar, listView) {
	// init toolbar
	this._toolbar = toolbar;
	var buttons = this.getToolbarButtons();
	var tbListener = new AjxListener(this, this._toolbarListener);
	for (var i = 0; i < buttons.length; i++) {
		toolbar.addSelectionListener(buttons[i], tbListener);
	}
	this._resetOperations(toolbar, 0);

	// init list view
	this._listView = listView;
	listView.addSelectionListener(new AjxListener(this, this._listSelectionListener));
};

ZmMobileDevicesController.prototype.initializeOAuthAppListView =
function(oAuthAppsListView) {
    this._oAuthAppsListView = oAuthAppsListView;
};

ZmMobileDevicesController.prototype.getToolbarButtons =
function() {
	return [
		ZmOperation.MOBILE_REMOVE,
		ZmOperation.SEP,
		ZmOperation.MOBILE_SUSPEND_SYNC,
		ZmOperation.MOBILE_RESUME_SYNC,
		ZmOperation.SEP,
		ZmOperation.MOBILE_WIPE
	];
};

ZmMobileDevicesController.prototype.loadDeviceInfo =
function() {
	var soapDoc = AjxSoapDoc.create("GetDeviceStatusRequest", "urn:zimbraSync");
	var respCallback = new AjxCallback(this, this._handleResponseLoadDevices);
	appCtxt.getAppController().sendRequest({soapDoc:soapDoc, asyncMode:true, callback:respCallback});
};

ZmMobileDevicesController.prototype._handleResponseLoadDevices =
function(results) {
    // clean up
    this._devices.removeAll();
    this._devices = new AjxVector();

    var list = results.getResponse().GetDeviceStatusResponse.device;
    if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
            this._devices.add(new ZmMobileDevice(list[i]));
        }
    }

    this._listView.set(this._devices);
    this._resetOperations(this._toolbar);
};

ZmMobileDevicesController.prototype.loadOAuthConsumerAppInfo =
function() {
    var jsonObj = { GetOAuthConsumersRequest : { _jsns:"urn:zimbraAccount"}};
    var callback = this._handleResponseLoadOAuthConsumer.bind(this);
    appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:callback});
};

ZmMobileDevicesController.prototype._handleResponseLoadOAuthConsumer =
function(result){
    if (this._oAuthConsumerApps) {
        this._oAuthConsumerApps.removeAll();
    }
    this._oAuthConsumerApps = new AjxVector();

    var response = result.getResponse();
    var OAuthConsumersResponse = response.GetOAuthConsumersResponse;
    var list = OAuthConsumersResponse.OAuthConsumer;
    if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
            this._oAuthConsumerApps.add(new ZmOAuthConsumerApp(list[i]));
        }
    }
    this._oAuthAppsListView.set(this._oAuthConsumerApps);
};

/**
 * Handles left-clicking on a rule. Double click opens up a rule for editing.
 *
 * @param	{DwtEvent}	ev		the click event
 * 
 * @private
 */
ZmMobileDevicesController.prototype._listSelectionListener =
function(ev) {
	if (ev.detail == DwtListView.ITEM_DBL_CLICKED) {
		var device = this._listView.getSelection()[0];
		this._showMoreDetails(device);
	} else {
		this._resetOperations(this._toolbar, 1);
	}
};

ZmMobileDevicesController.prototype._showMoreDetails =
function(device) {
	var msg = AjxTemplate.expand("prefs.Pages#MobileDeviceInfo", {device:device});
	var dlg = appCtxt.getMsgDialog();
	dlg.setMessage(msg);
	dlg.popup();
};


// Listeners

ZmMobileDevicesController.prototype._toolbarListener =
function(ev) {
	var item = this._listView.getSelection()[0];
	var id = ev.item.getData(ZmOperation.KEY_ID);
	var callback = new AjxCallback(this, this._handleAction, [item, id]);
	var action = ev.item.getData(ZmOperation.KEY_ID);

	if (action == ZmOperation.MOBILE_WIPE) {
		// if the item status is wipe-requested, then, user wants to cancel
		if (item.status == ZmMobileDevice.STATUS_REMOTE_WIPE_REQUESTED) {
			action = ZmOperation.MOBILE_CANCEL_WIPE;
		} else {
			// bug 42135: add confirmation for mobile wipe
			var dialog = appCtxt.getOkCancelMsgDialog();
			dialog.setMessage(ZmMsg.mobileDeviceWipeConfirm);
			dialog.registerCallback(DwtDialog.OK_BUTTON, this._handleDeviceWipe, this, [dialog, item, callback]);
			dialog.popup();
			return;
		}
	}

	item.doAction(action, callback);
};

ZmMobileDevicesController.prototype._handleDeviceWipe =
function(dialog, item, callback) {
	dialog.popdown();
	item.doAction(ZmOperation.MOBILE_WIPE, callback);
};

ZmMobileDevicesController.prototype._handleAction =
function(item, id) {
	if (id == ZmOperation.MOBILE_REMOVE) {
		this._listView.removeItem(item, true);
		this._devices.remove(item);
		this._resetOperations(this._toolbar, 0);
		return;
	}

	if (id == ZmOperation.MOBILE_WIPE) {
		this._toolbar.getButton(ZmOperation.MOBILE_WIPE).setText(ZmMsg.mobileWipeCancel);
	}

	this._listView.redrawItem(item);
	this._listView.setSelection(item, true);
	this._resetOperations(this._toolbar, 1);
};

/**
* Resets the toolbar button states, depending on which device is selected.
*
* @param parent		[ZmButtonToolBar]	the toolbar
* @param numSel		[int]				number of rules selected (0 or 1)
*/
ZmMobileDevicesController.prototype._resetOperations =
function(parent, numSel) {
	if (numSel == 1) {
		var item = this._listView.getSelection()[0];
		var status = item.getStatus();
		if (item.id == "AppleBADBAD") {
			status = ZmMobileDevice.STATUS_REMOTE_WIPE_REQUESTED;
		}

		parent.enableAll(true);
		parent.enable(ZmOperation.MOBILE_RESUME_SYNC, false);

		if (status == ZmMobileDevice.STATUS_SUSPENDED) {
			parent.enable(ZmOperation.MOBILE_SUSPEND_SYNC, false);
			parent.enable(ZmOperation.MOBILE_RESUME_SYNC, true);
		}
		else {
			var button = parent.getButton(ZmOperation.MOBILE_WIPE);
			if (button) {
				if (status == ZmMobileDevice.STATUS_REMOTE_WIPE_REQUESTED) {
					button.setText(ZmMsg.mobileWipeCancel);
					button.setImage("MobileWipeCancel");
				} else {
					button.setText(ZmMsg.mobileWipe);
					button.setImage("MobileWipe");
				}
			}
			if (status === ZmMobileDevice.STATUS_REMOTE_WIPE_COMPLETE) {
				parent.enable(ZmOperation.MOBILE_WIPE, false);
			}

		}

		if (!item.provisionable) {
			parent.enable(ZmOperation.MOBILE_WIPE, false);
		}
	}
	else {
		parent.enableAll(false);
	}
};

ZmMobileDevicesController.handleRemoveOauthConsumerApp = function(removeLinkEle, oAuthAccessToken, oAuthAppName, oAuthDevice) {
    var dialog = appCtxt.getOkCancelMsgDialog();
    var dialogContent = AjxMessageFormat.format(ZmMsg.oAuthAppAuthorizationRemoveConfirm, [oAuthAppName, oAuthDevice]);
    dialog.setMessage(dialogContent, DwtMessageDialog.CRITICAL_STYLE, ZmMsg.removeOAuthAppAuthorization);
    dialog.registerCallback(DwtDialog.OK_BUTTON, ZmMobileDevicesController.removeOauthConsumerApp.bind(null, removeLinkEle, dialog, oAuthAccessToken, oAuthAppName, oAuthDevice));
    dialog.popup();
};

ZmMobileDevicesController.removeOauthConsumerApp = function(removeLinkEle, dialog, oAuthAccessToken, oAuthAppName, oAuthDevice) {
     var jsonObj = { RevokeOAuthConsumerRequest : { _jsns:"urn:zimbraAccount", accessToken:{ _content : oAuthAccessToken}}};
     var callback = ZmMobileDevicesController.removeOauthConsumerAppCallback.bind(null, removeLinkEle, dialog);
     appCtxt.getRequestMgr().sendRequest({jsonObj:jsonObj, asyncMode:true, callback:callback});
};

ZmMobileDevicesController.removeOauthConsumerAppCallback = function(removeLinkEle, dialog) {
    dialog.popdown();
    Dwt.setVisible(removeLinkEle, false);
};
}

if (AjxPackage.define("zimbraMail.share.controller.ZmProgressController")) {
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
 * This file defines the progress controller.
 *
 * it gets a list of folders to work on, uses the search controller to get all the messages in the folders, in chunks. Callbacks the work passed to it to perform the work
 * on the message id chunks.
 *
 */

/**
 *
 * @author Eran Yarkon
 *
 * @param {DwtControl}		container	the containing shell
 * @param {ZmApp}		app		the containing application
 * 
 * @extends		ZmController
 */
ZmProgressController = function(container, app) {
	if (arguments.length == 0) { return; }
	ZmController.call(this, container, app);
    this._totalNumMsgs = 0; //for determining if run in background is available
};

ZmProgressController.prototype = new ZmController;
ZmProgressController.prototype.constructor = ZmProgressController;

// public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{String}		a string representation of the object
 */
ZmProgressController.prototype.toString =
function() {
	return "ZmProgressController";
};


ZmProgressController.prototype._getProgressDialog =
function() {
	if (!this._progressDialog ) {
		var dialog = this._progressDialog = new DwtMessageDialog({parent:this._shell, buttons:[DwtDialog.YES_BUTTON, DwtDialog.CANCEL_BUTTON], id: Dwt.getNextId("ZmProgressControllerDialog_")});
		dialog.registerCallback(DwtDialog.CANCEL_BUTTON, new AjxCallback(this, this._cancelAction));
		dialog.registerCallback(DwtDialog.YES_BUTTON, new AjxCallback(this, this._runInBackgroundAction));
        dialog.getButton(DwtDialog.YES_BUTTON).setText(ZmMsg.runInBackground);
    }
    this._progressDialog.getButton(DwtDialog.YES_BUTTON).setVisible(this._totalNumMsgs <= appCtxt.get(ZmSetting.FILTER_BATCH_SIZE));
	return this._progressDialog;
};

ZmProgressController.prototype._getFinishedDialog =
function() {
	if (!ZmProgressController._finishedDialog) {
		var dialog = ZmProgressController._finishedDialog = appCtxt.getMsgDialog();
		dialog.reset();
	}

	return ZmProgressController._finishedDialog;
};

/**
 * start a progres on a folder list and work definition
 * @param folderList - list of folders to work on the messages of, in chunks.
 * @param work - implements an unwritten interface. See ZmFilterRulesController.ZmFilterWork for the first example of an implementation
 */
ZmProgressController.prototype.start =
function(folderList, work) {
	this._currentWork = work;
	this._currentRun = new ZmProgressRun(folderList);
    this._totalNumMsgs = this.getNumMsgs(folderList);
	this._nextChunk();
};


/**
 * next chunk of work. Get the next chunk of ids from the search
 */
ZmProgressController.prototype._nextChunk =
function() {
	var run = this._currentRun;
	var work = this._currentWork;
	if (run._runInBackground) {
		//don't get Ids
		this._handleRunInBackground(this._getFolderQuery(run._folderList));	
	}
	else {
		var searchParams = {
			query:		this._getFolderQuery(run._folderList),
			types:		ZmItem.MSG,
			forceTypes:	true,
			limit:		ZmProgressController.CHUNK_SIZE,
			idsOnly:	true,
			noBusyOverlay: true
		};
	
		if (run._lastItem) {
			//this is not the first chunk - supply the last id and sort val to the search.
			searchParams.lastId = run._lastItem.id;
			searchParams.lastSortVal = run._lastItem.sf;
			AjxDebug.println(AjxDebug.PROGRESS, "***** progress search: " + searchParams.query + " --- " + [run._lastItem.id, run._lastItem.sf].join("/"));
		}
	
		var search = new ZmSearch(searchParams);
		var respCallback = new AjxCallback(this, this._handleSearchResults);
		appCtxt.getSearchController().redoSearch(search, true, null, respCallback);
	}
};

ZmProgressController.prototype._handleRunInBackground = 
function(query) {
	var run = this._currentRun;
	if (run._cancelled) {
		return;
	}
	run._finished = true; //running all at once
	var afterWorkCallback = new AjxCallback(this, this._afterChunk);
	this._currentWork.doWork(null, query, afterWorkCallback); //callback the work to do it's job on the message ids	
};

/**
 * process the returned message ids and
 * @param result
 */
ZmProgressController.prototype._handleSearchResults =
function(result) {
	var run = this._currentRun;
	if (run._cancelled) {
		return;
	}

	var response = result.getResponse();
	var items = response.getResults();

	AjxDebug.println(AjxDebug.PROGRESS, "progress search results: " + items.length);
	if (!items.length) {
		AjxDebug.println(AjxDebug.PROGRESS, "progress with empty search results!");
		return;
	}

	run._lastItem = items[items.length - 1];
	run._totalMessagesProcessed += items.length;
	var hasMore = response.getAttribute("more");
	run._finished = !hasMore;

	items = this._getIds(items);

	var afterWorkCallback = new AjxCallback(this, this._afterChunk);
	this._currentWork.doWork(items, null, afterWorkCallback); //callback the work to do it's job on the message ids

};

/**
 * returns here after the work is done on the chunk
 */
ZmProgressController.prototype._afterChunk =
function() {
	var work = this._currentWork;
	var run = this._currentRun;
	if (run._cancelled) {
		return;
	}

	var progDialog = this._getProgressDialog();
	if (run._finished) {
		//search is over, show summary messsage
		if (progDialog.isPoppedUp()) {
			progDialog.popdown();
		}
		var messagesProcessed = run._runInBackground ? false : run._totalMessagesProcessed;
		var finishedMessage = work.getFinishedMessage(messagesProcessed);
		var finishDialog = this._getFinishedDialog();
		finishDialog.setMessage(finishedMessage, DwtMessageDialog.INFO_STYLE, work.getFinishedTitle());
		finishDialog.popup();
		return;
	}

	if (!run._runInBackground) {
		var workMessage = work.getProgressMessage(run._totalMessagesProcessed);
		progDialog.setMessage(workMessage, DwtMessageDialog.INFO_STYLE, work.getProgressTitle());
		if (!progDialog.isPoppedUp()) {
			progDialog.popup();
		}
	}

	this._nextChunk();
};


/**
 * extract just the ids from the item objects. (they include also the search value)
 * @param items
 */
ZmProgressController.prototype._getIds =
function(items) {
	var ids = [];
	if (!items.length) { //not sure if this could happen but I've seen it elsewhere.
		items = [items];
	}

	for (var i = 0; i < items.length; i++) {
		ids.push(items[i].id);
	}
	return ids;
};

ZmProgressController.prototype._getFolderQuery =
function(folderList) {
	if (!(folderList instanceof Array)) {
		folderList = [folderList];
	}
	var query = [];
	for (var j = 0; j < folderList.length; j++) {
		query.push(folderList[j].createQuery());
	}
	return query.join(" OR ");

};

/**
 * Determine total number of messages filters are being applied to.
 * @param folderList {ZmOrganizer[]} array of folders
 * @return {int} number of messages
 */
ZmProgressController.prototype.getNumMsgs = 
function(folderList) {
    var numMsgs = 0;
    if (!(folderList instanceof Array)) {
        folderList = [folderList];
    }

    for (var j = 0; j < folderList.length; j++) {
        numMsgs += folderList[j].numTotal;
    }
    return numMsgs;
};

ZmProgressController.prototype._cancelAction =
function() {
	this._currentRun._cancelled = true;
	var dialog = this._getProgressDialog();
	if (dialog && dialog.isPoppedUp()) {
		dialog.popdown();
	}
};

ZmProgressController.prototype._runInBackgroundAction = 
function() {
	this._currentRun._runInBackground = true;
	var dialog = this._getProgressDialog();
	if (dialog && dialog.isPoppedUp()) {
		dialog.popdown();
	}
	AjxDebug.println(AjxDebug.PROGRESS, "set to run in background");
};

/**
 * internal class to keep track of progress, with last item processed, total messages processed, and the folder list we work on
 * @param folderList
 */
ZmProgressRun = function(folderList) {
	this._lastItem = null;
	this._totalMessagesProcessed = 0;
	this._folderList = folderList;
};

ZmProgressRun.CHUNK_SIZE = 100;
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
