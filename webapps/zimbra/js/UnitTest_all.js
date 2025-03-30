if (AjxPackage.define("UnitTest")) {
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
 * The test modules will be run in the order they are listed below. The unit test files are loaded via
 * script tags so that the debugger has access to their source.
 */
if (AjxPackage.define("zimbraMail.unittest.UtZWCUtils")) {
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
 * Created by .
 * User: prajain
 * Date: 6/1/11
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */

UtZWCUtils = function() {};

UtZWCUtils.chooseApp = function(appId) {
    if (!appId) {return false;}

    var appChooser = appCtxt.getAppChooser();
    if (!appChooser) {return false;}

    var appButton = appChooser.getButton(appId);
    if (!appButton) {return false;}

    appButton._emulateSingleClick();
    return true;
};

UtZWCUtils.isCurrentViewByViewIds = function(viewIds) {
    //we return an object with the currentViewId because the currentViewId can be LOADING.
    //unit tests can decide to wait before the test is being declared failed.
    
    var ret = {isCurrentView:false, currentViewId:null};
    if (!viewIds || !viewIds.length) {return ret;}

    ret.currentViewId = appCtxt.getCurrentViewId();
    
    for (var i = 0; i < viewIds.length; i++) {
        var viewId = viewIds[i];
        if (ret.currentViewId == viewId) {
            ret.isCurrentViewId = true;
            break;
        }
    }
    console.log("Expecting View: " + viewIds.toString() + " | Found view: " + ret.currentViewId);
    return ret;
};
//---------------
UtZWCUtils.isMailViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_TRAD, ZmId.VIEW_CONVLIST]);
};

UtZWCUtils.isAddressBookViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_CONTACT_SIMPLE]);
};

UtZWCUtils.isCalendarViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_CAL]);
};

UtZWCUtils.isTaskViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_TASKLIST]);
};

UtZWCUtils.isBriefCaseViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_BRIEFCASE_DETAIL]);
};

UtZWCUtils.isPreferencesViewCurrent = function() {
    return UtZWCUtils.isCurrentViewByViewIds([ZmId.VIEW_PREF]);
};

UtZWCUtils.closeAllComposeViews = function() {
	
	var avm = appCtxt.getAppViewMgr();
	var views = avm.getViewsByType(ZmId.VIEW_COMPOSE, true);
	views = views.concat(avm.getViewsByType(ZmId.VIEW_MAIL_CONFIRM, true));
	if (views && views.length) {
		for (var i = 0; i < views.length; i++) {
			var ctlr = views[i].controller;
			if (ctlr) {
				if (ctlr._cancelListener) {
					ctlr._cancelListener();
				}
				else if (ctlr._closeListener) {
					ctlr._closeListener();
				}
			}
		}
	}
};

UtZWCUtils.getLastView = function(viewType) {
	var avm = appCtxt.getAppViewMgr();
	var list = avm.getViewsByType(viewType, true);
	var view = list && list[list.length - 1];
	return view ? avm.getCurrentView(view.id) : null;
};

UtZWCUtils.getComposeViewCount = function() {
	return appCtxt.getAppViewMgr().getViewsByType(ZmId.VIEW_COMPOSE, true).length;
};

UtZWCUtils.getEmailAddressOfCurrentAccount = function() {
    var activeAccount = appCtxt.getActiveAccount();
    var email;
    if (activeAccount) {
        email = activeAccount.getEmail();
    }
    return email;
};

UtZWCUtils.getRandomString = function(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomString = '';
	for (var i=0; i<length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rnum,rnum+1);
	}
	return randomString;
}


UtZWCUtils.LOAD_VIEW_SETTIMEOUT = 5000;
UtZWCUtils.MAX_STOP = 10000;
}

if (AjxPackage.define("zimbraMail.unittest.UtMailMsgView_data")) {
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

/*
 * The data in this file is an array of test data objects. Each object has the following properties
 *   json: The json representation of a mail message
 *   expectedBody: The expected html contents of the iframe body when that message is rendered
 */

UtMailMsgView_data = [
      //
      // Bug #67854 - HTML code in "no content" message
      //
      {
      expectedBody: '<table width="100%"><tbody><tr><td class="NoResults" style="text-align:center;"><br>The message has no text content.</td></tr></tbody></table>',
      json: {
        cid: "561",
        d: 1322781373000,
        e: [
          // [0]:
          {
            a: "vmwen1@zqa-061.eng.vmware.com",
            d: "vmwen1",
            t: "f"
           },
          // [1]:
          {
            a: "vmwen1@zqa-061.eng.vmware.com",
            d: "vmwen1",
            t: "t"
           }
         ],
        id: "560",
        l: "2",
        mid: "<5769b3ce-c285-4a44-a115-7dadc6a72d10@zqa-061>",
        mp: [
          // [0]:
          {
            body: true,
            content: "",
            ct: "text/plain",
            part: "1",
            s: 2
           }
         ],
        rev: 300,
        s: 1729,
        sd: 1322761416000,
        su: "test"
       }
    }

    //
    // Bug #67744 - XSS injecting malicious email
    //
    ,{
        expectedBody: '<pre>&lt;script&gt;alert("Bad");&lt;/script&gt;</pre><img zmforced="1" class="InlineImage" src="http://localhost:7070/service/home/%7E/?auth=co&amp;id=600&amp;part=2">',
        json:
                  {
        cid: "-600",
        cm: true,
        d: 1322799190000,
        e: [
          // [0]:
          {
            a: "p4@zcs103.zimbraqa.lab",
            d: "p4",
            t: "f"
           },
          // [1]:
          {
            a: "1@zcs103.zimbraqa.lab",
            d: "1",
            t: "t"
           }
         ],
        f: "u",
        fr: '<script>alert("Bad");</script>',
        id: "600",
        l: "2",
        mid: "<6c3594eb-a17f-493f-8b70-44b41f8336b8@zcs103.zimbraqa.lab>",
        mp: [
          // [0]:
          {
            ct: "multipart/mixed",
            mp: [
              // [0]:
              {
                body: true,
                content: '<script>alert("Bad");</script>',
                ct: "text/plain",
                part: "1",
                s: 142
               },
              // [1]:
              {
                body: true,
                cd: "inline",
                ct: "image/jpeg",
                filename: "Picture.jpg",
                part: "2",
                s: 37326
               }
             ],
            part: "TEXT"
           }
         ],
        rev: 500,
        s: 52405,
        sd: 1322574434000,
        sf: "",
        su: "subject1"
       }
    }


    //
    // Bug #66192 - Blank body with JS error on viewing some messages
    //
    ,{
        expectedBody: '<div style="font-family: times new roman, new york, times, serif; font-size: 12pt; color: #000000"><div>Here\'s an empty image:<img></div></div>',
        json: {
            cid: "612",
            d: 1322801640000,
            e: [
              // [0]:
              {
                a: "user1@dcomfort.com",
                d: "Demo",
                p: "Demo User One",
                t: "f"
               },
              // [1]:
              {
                a: "list@dcomfort.com",
                d: "list",
                exp: true,
                isGroup: true,
                t: "t"
               }
             ],
            f: "a",
            fr: "Here's an empty image:",
            id: "611",
            l: "2",
            mid: "<3fee9d31-f330-446d-b242-d0703ef83764@Dave-Cs-MacBook-Pro.local>",
            mp: [
              // [0]:
              {
                ct: "multipart/mixed",
                mp: [
                  // [0]:
                  {
                    ct: "multipart/alternative",
                    mp: [
                      // [0]:
                      {
                        ct: "text/plain",
                        part: "1.1",
                        s: 27
                       },
                      // [1]:
                      {
                        body: true,
                        content: "<html><head><style>p { margin: 0; }</style></head><body><div style=\"font-family: times new roman, new york, times, serif; font-size: 12pt; color: #000000\"><div>Here&#39;s an empty image:<img></div></div></body></html>",
                        ct: "text/html",
                        part: "1.2",
                        s: 237
                       }
                     ],
                    part: "1"
                   },
                  // [1]:
                  {
                    cd: "attachment",
                    ct: "text/plain",
                    filename: "Hello.txt",
                    part: "2",
                    s: 9
                   }
                 ],
                part: "TEXT"
               }
             ],
            rev: 523,
            s: 1646,
            sd: 1322801640000,
            su: "Hello"
       }
    }
    
    //
    // Bug #64777 - Link to show external images not shown when dfsrc is present.
    //
    ,{
        validate: function(controller, view) {
            var displayImagesBar = document.getElementById(view._displayImagesId);
            UT.notEqual(displayImagesBar && displayImagesBar.style.display, "none");
        },
        json:       {
        cid: "-623",
        cm: true,
        d: 1322866294000,
        e: [
          // [0]:
          {
            a: "user1@dcomfort.com",
            d: "Demo",
            p: "Demo User One",
            t: "f"
           },
          // [1]:
          {
            a: "list@dcomfort.com",
            d: "list",
            t: "t"
           }
         ],
        fr: "Google",
        id: "623",
        l: "2",
        mid: "<670fbd72-6dc1-4218-a47d-e0608088d50a@prome-2n-dhcp175.eng.vmware.com>",
        mp: [
          // [0]:
          {
            ct: "multipart/alternative",
            mp: [
              // [0]:
              {
                ct: "text/plain",
                part: "1",
                s: 20
               },
              // [1]:
              {
                body: true,
                content: "<html><head><style>p { margin: 0; }</style></head><body><div style=\"font-family: Times New Roman; font-size: 12pt; color: #000000\"><br><span id=\"body\"><center><div id=\"lga\"><img alt=\"Google\" id=\"hplogo\" style=\"padding-top:28px\" height=\"95\" width=\"275\" dfsrc=\"http://www.google.com/intl/en_com/images/srpr/logo3w.png\"></div><form action=\"/search\" name=\"f\"><table class=\"jhp\" cellpadding=\"0\" cellspacing=\"0\"><tbody><tr valign=\"top\"><td align=\"center\" nowrap=\"nowrap\"><div class=\"ds\" style=\"height:32px;margin:4px 0\"><input dir=\"ltr\" maxlength=\"2048\" name=\"q\" id=\"lst-ib\" class=\"lst\" title=\"Google Search\" value=\"\" size=\"57\" style=\"background: none repeat scroll 0% 0% rgb(255, 255, 255); border-width: 1px; border-style: solid; border-right: 1px solid rgb(217, 217, 217); border-color: silver rgb(217, 217, 217) rgb(217, 217, 217); -moz-border-top-colors: none; -moz-border-right-colors: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none; -moz-border-image: none; color: rgb(0, 0, 0); margin: 0pt; padding: 5px 8px 0pt 6px; vertical-align: top; outline: medium none;\"></div><br style=\"line-height:0\"></td></tr></tbody></table></form><div style=\"font-size:83%;min-height:3.5em\"><br></div></center></span> <br></div></body></html>",
                ct: "text/html",
                part: "2",
                s: 1417
               }
             ],
            part: "TEXT"
           }
         ],
        rev: 550,
        s: 2594,
        sd: 1316540964000,
        sf: "",
        su: "External image"
       }
    }
];

}
if (AjxPackage.define("zimbraMail.unittest.UtGetOriginalContent_data")) {
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

// One way to generate sample data is to load the client with ?dev=1&debug=content.
// Data is printed into the debug window when a message is expanded in conv view.
// You can also just copy the content the message's body part in the SearchConvResponse.

// The code that's being tested looks for different types of blocks of content. Each test
// message will have a comment indicating whether it's text or HTML, and which blocks it has.
//
// U	UNKNOWN			Possible original content (could not be otherwise typed)
// OS	ORIG_SEP		Delimiter (eg "Original Message" or recognized <hr>)
// W	WROTE			Something like "On [date] so and so [email] wrote:"
// Q	QUOTED			Text preceded by > or |
// H	HEADER			One of the commonly quoted email headers
// L	LINE			Series of underscores, sometimes used as delimiter

// NOTE: HTML can get a bit tricky to verify since the text goes in and out of a temporary DOM node.
// We may have to account for things like different quote marks around element attributes, different
// ordering of attributes (eg in <font> tags), etc. The best approach is to use double quotes around
// attribute values, avoid HTML entities, and omit tags with multiple attributes from the output.

// The data would look much cleaner if Javascript supported HERE documents.

// Indicates that the input should be unchanged
UtZWCUtils.SAME = "SAME";

UtGetOriginalContent_data = [
	
	// 1
    // All original content
	// Text: U
    {
        input: "\
This is a new message \n\
Dave says: \"It has some interesting content\".\n\
",
        output: UtZWCUtils.SAME
    },

	// 2
    // All original content
	// HTML: U
    {
        isHtml: true,
        input: "\
<html><head><style>p { margin: 0; }</style></head>\
<body><div style=\"font-family: times new roman, new york, times, serif; font-size: 12pt; color: #000000\">\
<div>This is a new message</div>\
<div>Dave says: \"It has some interesting content\".</div>\
<div><br></div></div></body></html>\
",
		output: UtZWCUtils.SAME
    },

	// 3
    // "Original" separator, headers, no prefix
	// Text: U OS H
    {
        input: "\
Reply.\n\
\n\
----- Original Message -----\n\
From: \"Demo User One\" <user1@example.com>\n\
To: list@example.com\nSent: Tuesday, December 13, 2011 4:51:48 PM\n\
Subject: Re: Grrrrrr\n\
\n\
\n\
This is a new message \n\
Dave says: \"It has some interesting content\".\n\
",
        output: "Reply.\n"
    },

	// 4
    // "Original" separator, headers, prefix
	// Text: U OS H Q
    {
        input: "\
Reply with prefix?\n\
\n\
----- Original Message -----\n\
> From: \"Demo User One\" <user1@example.com>\n\
> To: list@dcomfort.com\n\
> Sent: Tuesday, December 13, 2011 8:30:28 PM\n\
> Subject: Plain text\n\
> \n\
> Message\n\
",
        output: "Reply with prefix?\n"
    },

	// 5
    // "Original" separator, no headers, no prefix
	// Text: U OS U
    {
        input: "\
Plain text no headers.\n\
\n\
----- Original Message -----\n\
Message\n\
",
        output: "Plain text no headers.\n"
    },

	// 6
    // All original content, including a hyphens line and an underscores line, neither
    // of which should be treated as a separator
	// Text: U L U
    {
        input: "\
There are a number of websites that explain the 6-2 and show the different positions. \n\
\n\
--------------\n\
\n\
I'm happy to not play the 6-2 if people don't like it.\n\
______________\n\
We can always play center-set.\n\
-Conrad\n\
",
		output: UtZWCUtils.SAME
    },

	// 7
    // All original content, including a hyphens line and an underscores line, neither
    // of which should be treated as a separator
	// HTML: U L U
    {
        isHtml: true,
        input: "\
<html><head>\
<style>p { margin: 0; }</style>\
</head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
Hi Conrad (& Dave).<br>\
<br>\
We have two bugs that we'd like you to consider for mainline and GnR.<br>\
-----------<br>\
Please let us know which are\
___________<br>\
3)??? other / in-progress<br><br>Thanks!<br>- Matt<br></div></body></html>\
",
		output: UtZWCUtils.SAME
    },

	// 8
    // Bottom post.
	// Text: Q U
    {
        input: "\
> I have two saved searches:\n\
> \n\
> 1. is:flagged\n\
> 2. in:(inbox or sent)\n\
> \n\
> If I click on the first, it doesn't run, only the search box changes.\n\
> If I click on the second, it seems to always run.\n\
\n\
Actually, same here.  The first one just updates the search box, the second one runs.\n\
\n\
Browser is Chrome 4.0 on MacOS 10.6.\n\
",
        output: "\
Actually, same here.  The first one just updates the search box, the second one runs.\n\
\n\
Browser is Chrome 4.0 on MacOS 10.6.\n\
"
    },

	// 9
    // "wrote" separator with email address
	// Text: U W Q
    {
        input: "\
No need. Thanks!\n\
\n\
----- 'Joanne Haggerty' <joanneh@example.com> wrote:\n\
\n\
> Conrad,\n\
> \n\
> Since you returned the other trophies, do you want a trophy for the Flag Football League?\n\
> \n\
> Joanne\n\
",
        output: "No need. Thanks!\n"
    },

	// 10
    // Inline reply.
	// Text: W Q U Q
    {
        input: "\
\n\
----- \"Parag Shah\" <pshah@example.com> wrote:\n\
\n\
> So how does the server know what to return? What is the default-to\n\
> logic?\n\
\n\
soap.txt SearchRequest says the default is conversation.\n\
\n\
> \n\
> ----- Original Message -----\n\
> From: \"Dan Karp\" <dkarp@example.com>\n\
> \n\
> > When you click on the saved search, the client barfs b/c we always\n\
> > assume the types attr is set.\n\
",
        output: "soap.txt SearchRequest says the default is conversation.\n"
    },

	// 11
    // Bugzilla mail with no actual quoted content
	// Text: U
    {
        input: "\
| DO NOT REPLY TO THIS EMAIL\n\
|\n\
| https://bugzilla.zimbra.com/show_bug.cgi?id=68357\n\
\n\
\n\
Dave Comfort <dcomfort@zimbra.com> changed:\n\
\n\
		   What    |Removed                     |Added\n\
----------------------------------------------------------------------------\n\
		 AssignedTo|bugs.mail.web.client@zimbra.|cdamon@zimbra.com\n\
				   |com                         |\n\
			 Status|NEW                         |ASSIGNED\n\
		   Keywords|                            |D3\n\
   Target Milestone|---                         |IronMaiden\n\
\n\
\n\
\n\
-- \n\
Configure bugmail: http://bugzilla.zimbra.com/userprefs.cgi?tab=email\n\
------- You are receiving this mail because: -------\n\
You are the assignee for the bug.\n\
",
		output: UtZWCUtils.SAME
    },
		
	// 12
	// Bugzilla mail - make sure first few lines survive (bug 68066)
	// Text: U
	{
		input: "\
| DO NOT REPLY TO THIS EMAIL\n\
|\n\
| https://bugzilla.zimbra.com/show_bug.cgi?id=62211\n\
\n\
\n\
--- Comment #20 from Lawrence Smith <lawrence@example.com>  2011-12-08 03:04:48 ---\n\
Created an attachment (id=36658)\n\
 --> (http://bugzilla.zimbra.com/attachment.cgi?id=36658)\n\
An example of a missing embedded image in Zimbra webmail in 7.1.3\n\
\n\
\n\
-- \n\
Configure bugmail: http://bugzilla.zimbra.com/userprefs.cgi?tab=email\n\
------- You are receiving this mail because: -------\n\
You are on the CC list for the bug.\n\
",
		output: UtZWCUtils.SAME
	},

	// 13
	// "... wrote:" intro without an email address
	// Text: U W Q
	{
		input: "\
What you see in the output are the only accounts we deploy.\n\
\n\
-bp\n\
On Dec 8, 2011, at 3:36 PM, Patrick Brien wrote:\n\n\
> \n\
> He also seems to indicate that there are other accounts besides root and zimbra... \n\
>\n\
", 
		output:	"\
What you see in the output are the only accounts we deploy.\n\
\n\
-bp\n\
"
	},
	
	// 14
	// "wrote" separator
	// HTML: U W Q
	{
		isHtml: true,
		input: "\
<html><head><style type=\"text/css\">p { margin: 0; }</style></head><body>\
<div style='font-family: Arial; font-size: 10pt; color: #000000'>\
I'm getting the same problem.<br><br>\
-Jiho<br><br>\
----- \"Marc MacIntyre\" &lt;marcmac@zimbra.com&gt; wrote:<br>\
<blockquote style=\"border-left: 2px solid rgb(16, 16, 255); margin-left: 5px; padding-left: 5px;\">\
<style>p { margin: 0; }</style><div style=\"font-family: Arial; font-size: 10pt; color: rgb(0, 0, 0);\">\
anyone get inbound ssh to ssh7/8.engx.vmare.com working?&nbsp; Keeps rejecting my RSA (but the java vpn \
browser thing works fine).<span><br><br>\
-- <br>Marc MacIntyre<br>marcmac@zimbra.com<br></span></div></blockquote><br></div></body></html>\
",
		output: "\
<html><head><style type=\"text/css\">p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
I'm getting the same problem.<br><br>\
-Jiho<br><br>\
</div></body></html>\
"
	},
	
	// 15
	// Middle post
	// HTML: Q U Q
	{
		isHtml: true,
		input: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
<br><blockquote style='border-left: 2px solid rgb(16, 16, 255); margin-left: 5px; padding-left: 5px;'>\
&gt; Hmm. For the auto-send-draft feature we had decided that the Mailbox<br>\
&gt; would not be responsible to scheduling tasks. One solution would be to<br>\
&gt; re-work the server implementation of this feature as a mailbox<br>\
&gt; listener (one of the proposals that we discussed initially).<br><br>\
Wouldn&#39;t it be much cleaner to just sync the draft up from ZD to the<br>\
ZCS immediately? &nbsp;Pushing the draft would also push autoSendTime, which<br>\
would schedule it on the ZCS instance.<br></blockquote>\
<span style=\"color: rgb(0, 128, 0);\"><br>\
I thought about that but what if ZD can&#39;t connect to ZCS at that instant?<br><br>\
Vishal<br></span>\
<br><blockquote style='border-left: 2px solid rgb(16, 16, 255); margin-left: 5px; padding-left: 5px;'><br>\
Of course, that&#39;d mean that ZD could only do deferred send for<br>mailboxes linked to ZCSes. &nbsp;If you want to enable that feature for<br>\
IMAP (etc.), I think you&#39;d have to turn on the scheduled task<br>manager in ZD.<br></blockquote><br></div></body></html>\
",
		output: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
<br><span style=\"color: rgb(0, 128, 0);\"><br>\
I thought about that but what if ZD can't connect to ZCS at that instant?<br><br>Vishal<br></span>\
<br><br></div></body></html>\
"
	},
	
	// 16
	// Outlook-style <hr>
	// HTML: U OS H Q
	{
		isHtml: true,
		input: "\
<html><head>\
<style>p { margin: 0; }</style></head><body>\
<p>\
Yes, thank you all for your patience!!!<br><br>And sorry for the moving target.\
   I very much look forward to getting this phase behind us.   <br><br>\
Jim</p>\
<hr size=\"2\" width=\"100%\" align=\"center\">\
<font face=\"Tahoma\" size=\"2\">\
<b>From</b>: Amber Weaver \
<br><b>To</b>: all@zimbra.com\
<br><b>Sent</b>: Tue Feb 02 12:00:05 2010<br>\
<b>Subject</b>: OFFICIAL CLOSE DATE: Friday, February 5th\
<br></font></p>\
<div style=\"font-family: Times New Roman; font-size: 12pt; color: #000000\">Hi Team:<br><br>\
It is finally official! The definitive close date is this <strong>Friday, February 5th</strong>.<br><br>\
-Amber<br>\
</div></body></html>\
",
		output: "\
<html><head>\
<style>p { margin: 0; }</style></head><body>\
<p>\
Yes, thank you all for your patience!!!<br><br>And sorry for the moving target.\
   I very much look forward to getting this phase behind us.   <br><br>\
Jim</p>\
</body></html>\
"
	},
	
	// 17
	// ZWC-style <hr>
	// HTML: U OS H Q
	{
		isHtml: true,
		input: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
<div>No, there isn't currently a way to turn it off either as a preference or skin change, \
though it's not present in the single message view, so if you use conversations the way they \
used to work by expanding the conversation in the list and selecting the message rather then you \
won't see the reply box.<br></div>\
<div><br>\
- Josh <br>\
<br></div>\
<hr id=\"zwchr\">\
<div style=\"color:#000;font-weight:normal;font-style:normal;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:12pt;\">\
<b>From: </b>&quot;Arnold Yee&quot; &lt;ayee@zimbra.com&gt;<br>\
<b>To: </b>&quot;Engineering&quot; &lt;engineering@zimbra.com&gt;<br>\
<b>Sent: </b>Friday, December 9, 2011 9:40:05 AM<br>\
<b>Subject: </b>D2 Web Client UI change - quick reply message pane<br><br><br>\
Hey All,<br><br>I find that the majority of the E-mails I receive do not require a reply from me.<br><br>\
--Arnold<br><br><br></div>\
</div></body></html>\
",
				output: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
<div>No, there isn't currently a way to turn it off either as a preference or skin change, \
though it's not present in the single message view, so if you use conversations the way they \
used to work by expanding the conversation in the list and selecting the message rather then you \
won't see the reply box.<br></div>\
<div><br>\
- Josh <br>\
<br></div>\
</div></body></html>\
"
	},

	// 18
	// Outlook sometimes uses delimiter of SPAN with ID "OLK_SRC_BODY_SECTION"
	// HTML: U OS H Q
	{
		isHtml: true,
		input: "\
<html><head></head><body>\
<div>\
<div>Didn't you ever put bugs in your mouth as a young boy exploring the outdoors? &nbsp;;)</div>\
<div>Andrew</div>\
<div>-------------------------------------------------------------------------</div>\
<div>-Andrew Smith</div>\
</div>\
<span id=\"OLK_SRC_BODY_SECTION\">\
<div>\
<span style=\"font-weight:bold\">From: </span> Jesse Smith &lt;<a href=\"mailto:jsmith@example.com\">jsmith@jsmith.com</a>&gt;<br>\
<span style=\"font-weight:bold\">Date: </span> Mon, 5 Dec 2011 16:16:33 -0800<br>\
<span style=\"font-weight:bold\">To: </span> Fun-List &lt;<a href=\"mailto:fun-list@example.com\">fun-list@example.com</a>&gt;<br>\
<span style=\"font-weight:bold\">Subject: </span> Re: [Fun-list] 5 freakish Japanese foods<br>\
</div>\
<div>Yes!</div>\
</span></body></html>\
",
				output: "\
<html><head></head><body>\
<div>\
<div>Didn't you ever put bugs in your mouth as a young boy exploring the outdoors? &nbsp;;)</div>\
<div>Andrew</div>\
<div>-------------------------------------------------------------------------</div>\
<div>-Andrew Smith</div>\
</div>\
</body></html>\
"
	},

	// 19
	// "Original Message" delimiter text within HTML
	// HTML: U OS H U
	{
		isHtml: true,
		input: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
If you're on-site, and are accessing the interwebs through their proxy, make sure you \
exclude *.vmware.com from your proxy settings, because you can't get to helpzilla \
through the proxy (from inside)...<br><br>\
----- Original Message -----<br>\
From: &quot;Tony Publiski&quot; &lt;tpubliski@zimbra.com&gt;<br>\
To: &quot;Jason He&quot; &lt;jmhe@zimbra.com&gt;<br>\
Sent: Monday, February 8, 2010 11:08:32 AM<br>\
Subject: Re: inbound ssh<br><br>\
Once you're connected to Network Connect, go direct to the URL (helpzilla.vmware.com) \
rather than trying to go through the sslvpn.vmware.com thing.\
</div></body></html>\
",
				output: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Arial; font-size: 10pt; color: #000000\">\
If you're on-site, and are accessing the interwebs through their proxy, make sure you \
exclude *.vmware.com from your proxy settings, because you can't get to helpzilla \
through the proxy (from inside)...<br><br>\
</div></body></html>\
"
	},

	// 20
	// "Forwarded Message" delimiter
	// HTML: U OS H U
	{
		isHtml: true,
		input: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Times New Roman; font-size: 12pt; color: #000000\">\
<span>Have you heard from the recruiter yet?<br><br>-Dave<br></span><br>\
----- Forwarded Message -----<br>\
From: &quot;Jim Morrisroe&quot; &lt;jim.morrisroe@zimbra.com&gt;<br>\
To: &quot;Brian Peterson&quot; &lt;brian@zimbra.com&gt;<br>\
Sent: Tuesday, February 16, 2010 12:59:14 PM<br>\
Subject: Fwd: Introduction<br><br>\
FYI<br>\
</div></body></html>\
",
		output: "\
<html><head><style>p { margin: 0; }</style></head><body>\
<div style=\"font-family: Times New Roman; font-size: 12pt; color: #000000\">\
<span>Have you heard from the recruiter yet?<br><br>-Dave<br></span><br>\
</div></body></html>\
"
	},

	// 21
	// Top posting
	// Text: U Q
	{
		input: "\
No, that's them blaming the victim.  I have a clean system, no\n\
plugins installed, and I can't submit tickets from either Safari\n\
or Firefox.  Chrome doesn't run their plugin, so that's out, too.\n\
\n\
Call me in a week when they have this stuff straightened out.\n\
\n\
> Apparently some firefox addons are known to break the ability to\n\
> submit tickets into their system.\n\
",
		output: "\
No, that's them blaming the victim.  I have a clean system, no\n\
plugins installed, and I can't submit tickets from either Safari\n\
or Firefox.  Chrome doesn't run their plugin, so that's out, too.\n\
\n\
Call me in a week when they have this stuff straightened out.\n\
"
	},

	// 22
	// Middle posting
	// Text: W Q U Q
	{
		input: "\
----- \"Parag Shah\" <pshah@zimbra.com> wrote:\n\
\n\
> So how does the server know what to return? What is the default-to\n\
> logic?\n\
\n\
soap.txt SearchRequest says the default is conversation:\n\
\n\
   {types}      = comma-separated list.  Legal values are:\n\
               conversation|message|contact|appointment|task|note|wiki|document\n\
               (default is \"conversation\")\n\
\n\
But I'd imagine if you are in the mail app you'd send either \"message\" if in message view or \"conversation\" if in conversation view.\n\
\n\
if the server behavior on search folders results really changed we should change it back, but I think types has always been optional.\n\
\n\
roland\n\
\n\
> \n\
> ----- Original Message -----\n\
> From: \"Dan Karp\" <dkarp@zimbra.com>\n\
> To: \"Parag Shah\" <pshah@zimbra.com>\n\
> Cc: \"UI Team\" <ui-team@zimbra.com>, \"Roland Schemers\"\n\
> <schemers@zimbra.com>\n\
> Sent: Friday, January 22, 2010 2:33:47 PM\n\
> Subject: Re: Problem running saved searches\n\
> \n\
> > When you click on the saved search, the client barfs b/c we always\n\
> > assume the types attr is set. My guess is the \"is:flagged\" saved\n\
> > search worked up until the most recent DF push. Any idea how/why\n\
> this\n\
> > happened? \n\
> \n\
> I don't think that a \"types\" constraint has ever been required for a\n\
> saved search...\n\
",
		output: "\
soap.txt SearchRequest says the default is conversation:\n\
\n\
   {types}      = comma-separated list.  Legal values are:\n\
               conversation|message|contact|appointment|task|note|wiki|document\n\
               (default is \"conversation\")\n\
\n\
But I'd imagine if you are in the mail app you'd send either \"message\" if in message view or \"conversation\" if in conversation view.\n\
\n\
if the server behavior on search folders results really changed we should change it back, but I think types has always been optional.\n\
\n\
roland\n\
"
	},
		
	// 23
	// "wrote" delimiter split across two lines, top post
	// Text: U W Q
	{
		input: "\
If not fixed try to leave a comment so that me/rajesh can look into it\n\
this weekend, lite client bug are already closed\n\
\n\
-satish s\n\
\n\
On Feb 13, 2010, at 2:05 AM, Satishkumar Sugumaran\n\
<satishs@zimbra.com> wrote:\n\
\n\
>\n\
>\n\
> -satish s\n\
>\n\
> On Feb 11, 2010, at 11:55 PM, Marc MacIntyre <marcmac@zimbra.com>\n\
> wrote:\n\
>\n\
> Guys, any idea if these are going to be fixable (amid all the move\n\
> chaos)?\n\
",
		output: "\
If not fixed try to leave a comment so that me/rajesh can look into it\n\
this weekend, lite client bug are already closed\n\
\n\
-satish s\n\
"
	},
		
	// 24
	// "wrote" delimiter split across two lines, bottom post
	// Text: W Q U
	{
		input: "\
On Feb 13, 2010, at 2:05 AM, Satishkumar Sugumaran\n\
<satishs@zimbra.com> wrote:\n\
\n\
>\n\
>\n\
> -satish s\n\
>\n\
> On Feb 11, 2010, at 11:55 PM, Marc MacIntyre <marcmac@zimbra.com>\n\
> wrote:\n\
>\n\
> Guys, any idea if these are going to be fixable (amid all the move\n\
> chaos)?\n\
\n\
If not fixed try to leave a comment so that me/rajesh can look into it\n\
this weekend, lite client bug are already closed\n\
\n\
-satish s\n\
",
		output: "\
If not fixed try to leave a comment so that me/rajesh can look into it\n\
this weekend, lite client bug are already closed\n\
\n\
-satish s\n\
"
	},
		
	// 25
	// "wrote" delimiter in HTML, parent node also has original content
	// HTML: U W Q
	{
		isHtml: true,
		input: "\
<html><head></head><body>\
<div>Not enough teams signed up. The bball time slots have been getting a good turn out as well \
so I didn't want to disrupt that.&nbsp;<br><br>\
On Mar 5, 2012, at 1:58 PM, Jeff Wagner &lt;<a href=\"mailto:jwagner@zimbra.com\" target=\"_blank\">\
jwagner@zimbra.com</a>&gt; wrote:\
<br><br></div>\
<div></div><blockquote><div>\
<div style=\"font-family: times new roman, new york, times, serif; font-size: 12pt; color: #000000\">\
<div>Hey Jon,</div><div>Is the bball league on? &nbsp;Or not have people signed up?<br><br></div></div></div></blockquote>\
</body></html>\
",
		output: "\
<html><head></head><body>\
<div>Not enough teams signed up. The bball time slots have been getting a good turn out as well \
so I didn't want to disrupt that.&nbsp;<br><br></div><div></div>\
</body></html>\
"
	},
		
	// 26
	// "original" separator followed by line ending with colon (bug 71816)
	// Text: U OS
	{
		input: "\
Fixed.\n\
\n\
-Conrad\n\
\n\
----- Original Message -----\n\
> Enjoy!  If you get a chance before you leave any thoughts on:\n\
> https://bugzilla.zimbra.com/show_bug.cgi?id=68203\n\
> \n\
> It's marked 7_2_0 which is code freeze for Monday.  I was going to\n\
> punt to 7_2_x.\n\
> \n\
> Thanks,\n\
> Jeff\n\
",
		output: "\
Fixed.\n\
\n\
-Conrad\n\
"
	},

	// 27
	// content that still has <script> tag
	// HTML: U
	{
		isHtml: true,
		input: "\
| DO NOT REPLY TO THIS EMAIL\n\
|\n\
| https://bugzilla.zimbra.com/show_bug.cgi?id=71945\n\
\n\
--- Comment #5 from Jong Yoon Lee <jylee@zimbra.com>  2012-03-26 09:39:13 ---\n\
<html>\n\
<body>\n\
<script>alert(document.cookie);</script>\n\
</body>\n\
</html>\n\
\n\
-- \n\
Configure bugmail: http://bugzilla.zimbra.com/userprefs.cgi?tab=email\n\
",
		output: "\
| DO NOT REPLY TO THIS EMAIL\n\
|\n\
| https://bugzilla.zimbra.com/show_bug.cgi?id=71945\n\
\n\
--- Comment #5 from Jong Yoon Lee <jylee@zimbra.com>  2012-03-26 09:39:13 ---\n\
<html>\n\
<body>\n\
\n\
</body>\n\
</html>\n\
\n\
-- \n\
Configure bugmail: http://bugzilla.zimbra.com/userprefs.cgi?tab=email\n\
"
	},

	// 28
    // "wrote" separator followed by inline reply
	// HTML: U W Q U Q U
    {
		isHtml: true,
        input: "\
<html><head></head><body>\
<div>Inline reply below</div>\n\
<div>On <span>May 8, 2012</span>, at 12:13 PM, Andy Flomm wrote:</div>\n\
<div>\n\
<br>\n\
<blockquote>this is some stuff Andy wrote</blockquote>\n\
<div>This is some inline replying</div>\n\
<br>\n\
<blockquote>more stuff Andy wrote</blockquote>\n\
<div>a second inline comment</div>\n\
<br>\n\
</div></body></html>\n\
"
,
		output: UtZWCUtils.SAME
    },

	// 29
    // "wrote" separator followed by inline reply
	// Text: U W Q U Q U
    {
        input: "\
No need. Thanks!\n\
\n\
----- 'Joanne Haggerty' <joanneh@example.com> wrote:\n\
\n\
> Conrad,\n\
> \n\
> Since you returned the other trophies, do you want a trophy for the Flag Football League?\n\
> \n\
> Joanne\n\
\n\
some text\n\
\n\
> some quoted stuff\n\
\n\
more text\n\
\n\
> more quoted stuff\n\
"
,
		output: UtZWCUtils.SAME
    },

	// 30
    // UNKNOWN followed by HEADER
	// Text: U W Q U Q U
    {
        input: "\
Hello\n\
\n\
________________________________\n\
From: \"Demo User One\" <user1@example.com>\n\
To: list@example.com\nSent: Tuesday, December 13, 2011 4:51:48 PM\n\
Subject: Re: Grrrrrr\n\
\n\
Conrad,\n\
\n\
Since you returned the other trophies, do you want a trophy for the Flag Football League?\n\
\n\
-Joanne\n\
\n\
----- 'Joanne Haggerty' <joanneh@example.com> wrote:\n\
\n\
some text\n\
"
,
		output: "\
Hello\n\
"
    },

	// 31
	// Alternative delimiter, same meaning as "----- Forwarded Message -----"
	// Text: U OS
	{
		input: "\
Are you guys around next Fri?\n\
\n\
Begin forwarded message:\n\
\n\
> I can be on campus on Friday.\n\
"
,
		output: "\
Are you guys around next Fri?\n\
"
	},

	// 32
	// "wrote" separator followed by inline reply
	// HTML: U W Q U Q U
	{
		isHtml: true,
		input: "\
<html><head></head><body>\
<font style='font-size:11.0pt;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;color:#1F497D'>\
Yes I will be in the office next friday. </font>\
<div style='border:none;border-top:solid #B5C4DF 1.0pt;padding:3.0pt 0in 0in 0in'>\
<font style='font-size:10.0pt;font-family:&quot;Tahoma&quot;,&quot;sans-serif&quot;'>\
<b>From</b>: John Robb [mailto:jrobb@vmware.com]<br>\
<b>Sent</b>: Friday, August 24, 2012 11:20 AM<br>\
<b>To</b>: John Hurley &lt;jhurley@vmware.com&gt;; Matt Rhoades &lt;Matt.rhoades@zimbra.com&gt;<br>\
<b>Subject</b>: Fwd: where do you sit?  we want to come by next week to see your ZCO<br>\
</font>&nbsp;<br>\
</div>\
<div>Are you guys around next Fri?<br><br>-jr</div>\
</body></html>\n\
"
,
		output: "\
<html><head></head><body>\
<font style='font-size:11.0pt;font-family:&quot;Calibri&quot;,&quot;sans-serif&quot;;color:#1F497D'>\
Yes I will be in the office next friday. </font>\
</body></html>\n\
"
	}
];
}

if (AjxPackage.define("zimbraMail.unittest.UtAjxUtil")) {
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

UT.module("AjxUtil");

UtAjxUtil = function() {};

UtAjxUtil.formatSizeForUnits = function() {
	ZmUnitTestUtil.log("starting AjxUtil.formatSizeForUnits test");

	UT.expect(8);
	//US Locale options
	I18nMsg.formatNumber = "#,##0.###";
	I18nMsg.numberSeparatorDecimal = ".";
	var us_mb1 = AjxUtil.formatSizeForUnits(52743372.8, AjxUtil.SIZE_MEGABYTES, false, 1); //50.3 mb
	UT.equal(us_mb1, "50.3", "US locale 50.3MB");
	
	var us_mb2 = AjxUtil.formatSizeForUnits(52428800, AjxUtil.SIZE_MEGABYTES, false, 1); //50 mb
	UT.equal(us_mb2, "50", "US locale 50 MB");
	
	var us_mb3 = AjxUtil.formatSizeForUnits(524288, AjxUtil.SIZE_MEGABYTES, false, 1); //.5 mb
	UT.equal(us_mb3, "0.5", "US locale .5 MB");
	
	var us_mb4 = AjxUtil.formatSizeForUnits(2622069145.5, AjxUtil.SIZE_MEGABYTES, false, 1); //2,500.6MB or 2.44GB
	UT.equal(us_mb4, "2500.6", "US locale 2,500.6 MB");
	
	//Spanish Locale options
	I18nMsg.formatNumber = "#.##0,###";
	I18nMsg.numberSeparatorDecimal = ",";
	var es_mb1 = AjxUtil.formatSizeForUnits(52743372.8, AjxUtil.SIZE_MEGABYTES, false, 1);
	UT.equal(es_mb1, "50,3", "Spanish locale 50.3 MB");

	var es_mb2 = AjxUtil.formatSizeForUnits(52428800, AjxUtil.SIZE_MEGABYTES, false, 1);
	UT.equal(es_mb2, "50", "Spanish locale 50 MB");

	var es_mb3 = AjxUtil.formatSizeForUnits(524288, AjxUtil.SIZE_MEGABYTES, false, 1); //.5 mb
	UT.equal(es_mb3, "0,5", "Spanish locale half MB");

	var es_mb4 = AjxUtil.formatSizeForUnits(2622069145.5, AjxUtil.SIZE_MEGABYTES, false, 1); //2,500.6MB or 2.44GB
	UT.equal(es_mb4, "2500,6", "Spanish locale 2,500.6 MB");
};

UT.test("AjxUtil.formatSizeForUnits", UtAjxUtil.formatSizeForUnits);
}
if (AjxPackage.define("zimbraMail.unittest.UtAjxStringUtil")) {
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

UT.module("AjxStringUtil");

UtAjxStringUtil = function() {};

UtAjxStringUtil.urlDecode = function() {
	ZmUnitTestUtil.log("starting AjxStringUtil.urlDecode test");

	UT.expect(4);
	var percentURI = AjxStringUtil.urlDecode("%");
	UT.equal(percentURI, "", "% is not a valid URI return ''");
	
	var nullURI = AjxStringUtil.urlDecode();
	UT.equal(nullURI, "", "null is not a valid URI return ''");
	
	var invalidURI = AjxStringUtil.urlDecode("%u65E5%u7523");
	UT.equal(invalidURI, "", "%u65E5%u7523 is not a valid URI return ''");
	
	var validURI = AjxStringUtil.urlDecode("http://google.com?q=Zimbra%208");
	UT.equal(validURI, "http://google.com?q=Zimbra 8");
	
};

UT.test("AjxStringUtil.urlDecode", UtAjxStringUtil.urlDecode);


UtAjxStringUtil.clipFile = function() {
	ZmUnitTestUtil.log("starting AjxStringUtil.clipFile test");

	UT.expect(13);

	UT.equal(AjxStringUtil.clipFile('kaflaflibob', 11), 'kaflaflibob');
	UT.equal(AjxStringUtil.clipFile('kaflaflibob.', 12), 'kaflaflibob.');
	UT.equal(AjxStringUtil.clipFile('kaflaflibob.flaf', 12), 'kaflaflibob.flaf');
	UT.equal(AjxStringUtil.clipFile('kaflaflibob.flaf', 8), 'kafl\u2026bob.flaf');
	UT.equal(AjxStringUtil.clipFile('kaflaflibob', 9), 'kafl\u2026ibob');
	UT.equal(AjxStringUtil.clipFile('blyf.kaflaflibob.flaf', 8), 'blyf\u2026bob.flaf');
	UT.equal(AjxStringUtil.clipFile('flaf.kaflaflibob', 8), 'flaf.kaflaflibob');
	UT.equal(AjxStringUtil.clipFile('.kaflaflibob', 8), '.kaf\u2026bob');
	UT.equal(AjxStringUtil.clipFile('kaflaflibob', 11).length, 11);
	UT.equal(AjxStringUtil.clipFile('kaflaflibob', 9).length, 9);
	UT.equal(AjxStringUtil.clipFile('kaflaflibob', 6).length, 6);
	UT.equal(AjxStringUtil.clipFile('blyf.kaflaflibob.flaf', 8).length, 8 + 5);
	UT.equal(AjxStringUtil.clipFile('.kaflaflibob', 8).length, 8);
};

UT.test("AjxStringUtil.clipFile", UtAjxStringUtil.clipFile);

}
if (AjxPackage.define("zimbraMail.unittest.UtAjxXslt")) {
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

UT.module("AjxXslt");

UtAjxXslt = function() {};

UtAjxXslt.transformToDom = function() {
	ZmUnitTestUtil.log("starting AjxXslt.transformToDom test");

	UT.expect(1);
	var xslStr =  '<?xml version="1.0" encoding="ISO-8859-1"?>' +
	'<xsl:stylesheet version="1.0" ' +
	'xmlns:xsl="http://www.w3.org/1999/XSL/Transform">'   +
	'<xsl:template match="/">' +
	'<html>' +
	'<body>' +
	'<h2>My CD Collection</h2>' +
	'<table border="1">'         +
	'<tr bgcolor="#9acd32">'     +
	'<th>Title</th>'             +
	'<th>Artist</th>'            +
	'</tr>'                      +
	'<xsl:for-each select="catalog/cd">'  +
	'<tr>'                                 +
	'<td><xsl:value-of select="title"/></td>' +
	'<td><xsl:value-of select="artist"/></td>' +
	'</tr>'                                   +
	'</xsl:for-each>'                         +
	'</table>'                                +
	'</body>'                                 +
	'</html>'                                 +
	'</xsl:template>'                         +
	'</xsl:stylesheet>';  
	
	var xml = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
		'<catalog><cd><title>Empire Burlesque</title><artist>Bob Dylan</artist><country>USA</country>' + 
		'<company>Columbia</company><price>10.90</price><year>1985</year></cd></catalog>';
	if (window.DOMParser)
	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(xml,"text/xml");
	}
	else // Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(xml);
	}
	var xslt = AjxXslt.createFromString(xslStr);
	var dom = xslt.transformToDom(xmlDoc);
	if (dom) {
		var h2Value = AjxEnv.isIE ? dom.getElementsByTagName("H2")[0].text : dom.getElementsByTagName("H2")[0].textContent;
		UT.equal(h2Value, "My CD Collection", "XSLT transform to DOM successful");
	}
	else {
		UT.equal(1,2, "dom failed");
	}
	
};

UT.test("AjxXslt.transformToDom", UtAjxXslt.transformToDom);

}
if (AjxPackage.define("zimbraMail.unittest.UtAjxTimezone")) {
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
UT.module("AjxTimezone");


UT.test("getOffset Test", {
	
	setup: function() {
		//Southern Hemisphere 3 cases: middle, daylight start, daylight end
		//2011 DST: ended on Sunday, April 3, 2011	starts again on Sunday, September 25, 2011
		this._newZealandTz = "Pacific/Auckland";
		this._nzst = new Date("Thu Jun 23 2011 06:00:00");
		this._nzdst_start = new Date("Sun Apr 2 2011 06:00");
		this._nzdst_end = new Date("Sep 25 2011 06:00");
		
		//Northern Hemisphere
		//Phoenix has no DST in 2011
		this._arizonaTz = "America/Phoenix";
		this._azst = new Date("Thu Jun 23 2011 06:00:00");
		this._azst_start = new Date("Mar 14 2011 06:00:00");
		this._azst_end = new Date("Nov 7 2011 06:00:00");
		
		//Los Angeles has DST in 2011
		//2011 DST: Sunday, March 13, 2011	- Sunday, November 6, 2011	
		this._laTz = "America/Los_Angeles";
		this._last = new Date("Dec 1 2011 06:00:00");
		this._ladst_start = new Date("Mar 14 2011 06:00:00");
		this._ladst_end = new Date("Nov 5 2011 06:00:00");
		
		//GMT
		//2011 DST: Sunday, March 27, 2011 - Sunday, October 30, 2011
		this._londonTz = "Europe/London";
		this._londonst = new Date("Dec 1 2011 06:00:00");
		this._londondst_start = new Date("Mar 28 2011 06:00:00");
		this._londondst_end = new Date("Oct 29 2011 06:00:00");
		
		//No DST in 2011 (Tokyo)
		this._japanTz = "Asia/Tokyo";
		this._jpst = new Date("Thu Jun 23 2011 06:00:00");
		this._jpst_start = new Date("Mar 22 2011 06:00:00");
		this._jpst_end = new Date("Dec 11 2011 06:00:00");
		
	}},
	function (){
		UT.expect(15);
		
		//Southern Hemisphere
		var nz_standard_offset = AjxTimezone.getOffset(this._newZealandTz, this._nzst);
		UT.equal(nz_standard_offset, 720, "Offset = " + nz_standard_offset);
		var nz_daylight_offset = AjxTimezone.getOffset(this._newZealandTz, this._nzdst_start);
		UT.equal(nz_daylight_offset, 780, "Offset = " + nz_daylight_offset);
		var nz_daylight_offset2 = AjxTimezone.getOffset(this._newZealandTz, this._nzdst_end);
		UT.equal(nz_daylight_offset2, 780, "Offset = " + nz_daylight_offset2);
		
		//Northern Hemisphere
		var arizona_offset = AjxTimezone.getOffset(this._arizonaTz, this._azst);
		UT.equal(arizona_offset, -420, "Offset = " + arizona_offset);
		var az_dst1 = AjxTimezone.getOffset(this._arizonaTz, this._azst_start);
		UT.equal(az_dst1, -420, "Offset = " + az_dst1);
		var az_dst2 = AjxTimezone.getOffset(this._arizonaTz, this._azst_end);
		UT.equal(az_dst2, -420, "Offset = " + az_dst2);
		
		var la_offset = AjxTimezone.getOffset(this._laTz, this._last);
		UT.equal(la_offset, -480, "Offset = " + la_offset);
		var la_dst_start = AjxTimezone.getOffset(this._laTz, this._ladst_start);
		UT.equal(la_dst_start, -420, "Offset = " + la_dst_start);
		var la_dst_end = AjxTimezone.getOffset(this._laTz, this._ladst_end);
		UT.equal(la_dst_end, -420, "Offset = " + la_dst_end);
		
		//GMT
		var london_offset = AjxTimezone.getOffset(this._londonTz, this._londonst);
		UT.equal(london_offset, 0, "Offset = " + london_offset);
		var london_dst1 = AjxTimezone.getOffset(this._londonTz, this._londondst_start);
		UT.equal(london_dst1, 60, "Offset = " + london_dst1);
		var london_dst2 = AjxTimezone.getOffset(this._londonTz, this._londondst_end);
		UT.equal(london_dst2, 60, "Offset = " + london_dst2);
		
		//Japan
		var japan_offset = AjxTimezone.getOffset(this._japanTz, this._jpst);
		UT.equal(japan_offset, 540, "Offset = " + japan_offset);
		var japan_st1 = AjxTimezone.getOffset(this._japanTz, this._jpst_start);
		UT.equal(japan_offset, 540, "Offset = " + japan_offset);
		var japan_st2 = AjxTimezone.getOffset(this._japanTz, this._jpst_end);
		UT.equal(japan_st2, 540, "Offset = " + japan_st2);
	}
);
		
}
if (AjxPackage.define("zimbraMail.unittest.UtDwt")) {
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

UT.module("Dwt");

UtDwt = function() {};

UtDwt.setupGetLocation = function() {
	var tests = [
		{
			element: document.createElement('DIV'),
			parent: document.body,
			style: {
				display: 'none',
				top: '42px', left: '42px',
				width: '1337px', height: '1337px'
			},
			expected: new DwtRectangle(0, 0, 0, 0)
		},
		{
			element: document.createElement('DIV'),
			parent: document.body,
			style: {
				position: 'absolute',
				top: '42px', left: '42px',
				width: '1337px', height: '1337px'
			},
			expected: new DwtRectangle(42, 42, 1337, 1337)
		},
		{
			element: document.createElement('TD'),
			parent: null,
			style: {},
			expected: new DwtRectangle(null, null, null, null)
		}
	];

	for (var i = 0; i < tests.length; i++) {
		var test = tests[i];

		for (var k in test.style) {
			test.element.style[k] = test.style[k];
		}

		if (tests.parent) {
			test.parent.appendChild(test.element);
		}
	}

	UT.stop();

	setTimeout(UtDwt.checkGetLocation.bind(this, tests), 100);
};

UtDwt.checkGetLocation = function(tests) {
	function check(test, prop) {
		var msg = AjxMessageFormat.format('{0} on {1}', [
			prop, test.element.outerHTML
		]);
		var expected = test.expected;
		var bounds = Dwt.getBounds(test.element);

		UT.strictEqual(bounds.x, expected.x, msg);

	}

	UT.start();
	UT.expect(tests.length * 4);

	for (var i = 0; i < tests.length; i++) {
		check(tests[i], 'x');
		check(tests[i], 'y');
		check(tests[i], 'width');
		check(tests[i], 'height');

		if (tests.parent) {
			test.parent.removeChild(tests[i].element);
		}
}
};

UT.test("Dwt.getLocation", UtDwt.setupGetLocation);
}
if (AjxPackage.define("zimbraMail.unittest.UtDwtCssStyle")) {
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

UT.module("DwtCssStyle");

UtDwtCssStyle = function() {};

UtDwtCssStyle.testAsPixelCount = function() {
    ZmUnitTestUtil.log("starting DwtCssStyle.asPixelCount test");
    UT.expect(27 + AjxEnv.supportsCSS3RemUnits);

    // test passing a given value through DwtCssStyle.asPixelCount
    function test(actual, expected) {
        var msg =
            AjxMessageFormat.format('test {0} against known reference value',
                                    actual);

        UT.strictEqual(DwtCssStyle.asPixelCount(actual), expected, actual);
    }

    // verify that our calcuation agrees with the DOM
    function verify(value) {
        var msg = AjxMessageFormat.format('verify calculation for {0}', value);

        // this one varies depending on the browser text zoom
        div = document.createElement('div');
        div.style.width = value;
        document.body.appendChild(div);
        var expected = Dwt.getSize(div).x;
        document.body.removeChild(div);

        var actual = Math.floor(DwtCssStyle.asPixelCount(value));

        UT.strictEqual(actual, expected, msg);
    }

    // verify that we fail loudly and noisily
    function raises(value) {
        var msg = AjxMessageFormat.format('ensure that {0} raises', value);

        UT.raises(function() { DwtCssStyle.asPixelCount(value); }, Error, msg);
    }

    // first, test the parser
    test(42, 42);
    test('37', 37);
    test('-5px', -5);
    test('-3.14', -3.14);
    test('-3.14px', -3.14);

    // now, test and verify the units we support
    test('1337px', 1337);
    verify('1337px');

    test('150pt', 200);
    verify('150pt');

    test('8.75pc', 140);
    verify('8.75pc');

    test('1in', 96);
    verify('1in');

    test('37in', 3552);
    verify('37in');

    test('2.54cm', 96);
    verify('2.54cm');

    test('254mm', 960);
    verify('254mm');

    // disabled due to rounding issues
    if (false) {
        test('2.54mm', 9.6);
        verify('2.54mm');
    }

    test('1016mm', 3840);
    verify('1016mm');

    // this one varies depending on the browser text zoom and doesn't
    // work on all browsers
    if (AjxEnv.supportsCSS3RemUnits)
        verify('1rem');

    // test failure scenarios
    raises('oi');
    raises('0cake');
    raises('100%');
    raises('1ch');
    raises('1em');
    raises('1ex');
};

UT.test("DwtCssStyle.testConversions", UtDwtCssStyle.testAsPixelCount);
}
if (AjxPackage.define("zimbraMail.unittest.UtBubbles")) {
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

UT.module("Bubbles", ["Mail"]);

// Pretend that a "d" was typed into the To: field in compose, and that the user then selected
// the first result from the autocomplete list. A bubble should be placed in the To: field.

/**
 *	1. Key pressed, timeout set. Call stop().
 *	2. Timeout expires. Server request made.
 *	3. Response received. Set a 200ms timeout.
 *	4. Results are displayed. A 100ms timeout is set.
 *	5. The 100ms timeout expires. The first result is selected.
 *	6. The 200ms timeout expires. Check the results. Call start().
 */

UtBubbles = function() {};

UtBubbles.setup = function() {
	UtBubbles._origAcTimeout = appCtxt.get(ZmSetting.AC_TIMER_INTERVAL);
	appCtxt.set(ZmSetting.AC_TIMER_INTERVAL, 0);	// remove 300ms wait to speed things up
};

UtBubbles.teardown = function() {

	appCtxt.getAppController().removeListener(ZmAppEvent.RESPONSE, UtBubbles._handleResponse);
	UtBubbles._origAcTimeout = appCtxt.get(ZmSetting.AC_TIMER_INTERVAL);
	appCtxt.set(ZmSetting.AC_TIMER_INTERVAL, UtBubbles._origAcTimeout);	// restore orig value
	var cv = UtZWCUtils.getLastView(ZmId.VIEW_COMPOSE)
	var ctlr = cv && cv._controller;
	if (ctlr) {
		ctlr._cancelListener();
	}
};

UtBubbles.test = function() {
	
	UT.expect(3);
	ZmUnitTestUtil.log("starting bubbles test");
	ZmUnitTestUtil.goToCompose();
	var input = document.getElementById("zv__COMPOSE-1_to_control");
	input.value = "";
	appCtxt.getAppController().addListener(ZmAppEvent.RESPONSE, UtBubbles._handleResponse);
	ZmUnitTestUtil.emulateKeyPress(input, 68, 100);
	UT.stop(250000);
};

UtBubbles._handleResponse = function(evt) {
	
	if (evt.request != "AutoCompleteRequest") { return; }

	// selection of the first autocomplete match runs on a 100ms timer
	setTimeout(function() {
		var cv = UtZWCUtils.getLastView(ZmId.VIEW_COMPOSE);
		UT.ok(cv, "Could not get last compose view");
		var aclv = cv._acAddrSelectList;
		UT.ok(aclv && aclv._selected, "No autocomplete row is selected");
		aclv._listSelectionListener();
		var toField = cv.getAddrInputField(AjxEmailAddress.TO);
		var bubbleList = toField._getBubbleList();
		UT.equals(bubbleList.size(), 1, "No bubbles");
		UT.start();
	}, 400);
}

UT.test("basic bubble test 2", {
		setup:		UtBubbles.setup,		
		teardown:	UtBubbles.teardown,
		tags:		["foo"]
	},		  
	UtBubbles.test
);
}
if (AjxPackage.define("zimbraMail.unittest.UtCompose")) {
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

UT.module("Compose", ["Mail", "Smoke"]);

// Make sure the compose page comes up when the New button is pressed.
UT.test("Show compose page", {
	
	teardown: function() {
		var cv = UtZWCUtils.getLastView(ZmId.VIEW_COMPOSE)
		var ctlr = cv && cv._controller;
		if (ctlr) {
			ctlr._cancelListener();
		}
	}},
		
	function() {
		UT.expect(1);
		ZmUnitTestUtil.goToCompose();
	
		UT.equal(appCtxt.getCurrentViewType(), ZmId.VIEW_COMPOSE);
	}
);

// Launch New window compose
UT.test("New window compose", {

	teardown: function() {
		ZmZimbraMail.closeChildWindows();
	}},

    // New window compose.
    function() {
        var args = {
            action: ZmOperation.NEW_MESSAGE,
            inNewWindow: true,
            callback: function() {
                UT.ok(true, "New Window Loaded");
                UT.start();
            }
        };
        appCtxt.getApp(ZmApp.MAIL).compose(args);
        UT.stop(10000);
        UT.expect(1);
    }
);
}
if (AjxPackage.define("zimbraMail.unittest.UtContactGroup")) {
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

//ZmContact mock object
ZmMockContact = function(){
   this.attr = [];
};
ZmMockContact.prototype.constructor = ZmMockContact;
ZmMockContact.zId = "1";
ZmMockContact.prototype.isGroup =
function() {
	return this.type == "group";
};

ZmMockContact.prototype.getFileAs =
function() {
	return this.fileAs;
};

ZmMockContact.prototype.getIcon =
function() {
	return "foo";
};

ZmMockContact.prototype.getFullNameForDisplay =
function() {
	return this.fullName;
};

ZmMockContact.prototype.getEmail =
function() {
	return this.email;
};

ZmMockContact.prototype.getAttr =
function(attr) {
	if (attr == "dlist") {
		return this.dlist;
	}
	return null;
};

ZmMockContact.prototype.getId = 
function(useZid) {
	if (useZid) {
		return ZmMockContact.zId + ":" + this.id;	
	}
	return this.id;
};

ZmMockContact.prototype.isDistributionList =
function() {
	return this.isGal && this.isGroup();
};


UT.module("ContactGroup");


UT.test("Get Contacts From Cache", {

	teardown: function() {

	},
	setup: function() {

	}},

	//This test would benefit from having a specified login having predicitable data; for now just checking the object properties
	function() {
		UT.expect(2);
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var contactHash = clc._getContactsFromCache();
		if (contactHash) {
			UT.ok(contactHash!=null, "hash is not null");
		}
		var count = 1;
		for (var id in contactHash) {
			var obj = contactHash[id];
			if (obj.id) {
				UT.notEqual(obj.id, null, "hash id = " + obj.id);
			}
			count++;
			if (count > 1) {
				break;
			}
		}
	}
);

//TODO: Update DLIST is no longer applicable
/*
UT.test("Filter Groups", {
	//Dummy data; this could be more interesting with a specific test account
	teardown: function(){
		this._contacts = null;
	},

	setup: function() {
		this._contacts = [];
		this._contacts[1] = {"_attrs" : {
					       "email" : "test@email.com",
						   "firstLast" : "Test User",
						   "firstName": "Test",
						   "fullName" : "Test User",
						   "lastName" : "User"
						   },
						"id": 1,
						"fileAsStr" : "User, Test"};

		this._contacts[2] = {"_attrs" : {
			               "dlist": "\"Test User\" <test@email.com>, \"John Doe\"  <jdoe@email.com>, jdoe@nospam.org",
						   "fileAs" : "1:test_group",
						   "firstLast": "",
						   "nickname" : "test_group",
						   "type" : "group"
						},
			            "fileAsStr" : "test_group",
					    "id" : 2
						};
	}},

	function() {
		UT.expect(1);
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var filtered = clc._filterGroups(this._contacts);
		for (var id in filtered) {
			var obj = filtered[id];
			UT.equal(obj._attrs.type, "group", "obj._attrs.type == " + obj._attrs.type);
		}
	}
);
*/

UT.test("Sort Contact Groups", {
	teardown: function() {
		this._contacts = null;
	},

	setup: function() {
		this._contacts = [];
		this._contacts[1] = {"_attrs" : {"nickname" : "Baseball"}, "id" : 1};
		this._contacts[2] = {"_attrs" : {"nickname" : "blog"}, "id": 2};
		this._contacts[3] = {"_attrs" : {"nickname" : "Family"}, "id" : 3};
		this._contacts[4] = {"_attrs" : {"nickname" : "Actors"}, "id" : 4};
		this._contacts[5] = {"_attrs" : {"nickname" : "academy"}, "id" : 5};
		this._contacts[6] = {"_attrs" : {"nickname" : "401k"}, "id" : 6};
	}},

	function() {
		UT.expect(6);
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var sorted = clc._sortContactGroups(this._contacts);
		var expected = ["401k", "academy", "Actors", "Baseball", "blog", "Family"];
		var count = 0;
		for (var id in sorted) {
			var obj = sorted[id];
			UT.equal(obj._attrs.nickname, expected[count], "nickname == " + obj._attrs.nickname);
			count++;
		}
	}
);

//TODO: Update DLIST is no longer applicable
/*
UT.test("Items for New Group", {
	teardown: function() {
	 	this._items = null;
	},

	setup: function() {
		//better way to do mock objects?
		var mockContact = new ZmMockContact();
		mockContact.email = "test@test.com";
		mockContact.type = null;
		mockContact.fileAs = "User, Test (PhD)";
		mockContact.fullName = "Test User";

		var mockGroup = new ZmMockContact();
		mockGroup.email = "";
		mockGroup.type = "group";
		mockGroup.dlist = "\"Clinton, Bill\" <bill@clinton.com>, \"W\" <w@bush.com>, <president@whitehouse.gov>";

		this._items = [mockContact, mockGroup];
	}},

	function() {
		UT.expect(1);
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var groupMembers = clc._getGroupMembers(this._items, null);
		var expected = "\"Clinton, Bill\" <bill@clinton.com>, \"User, Test (PhD)\" <test@test.com>, \"W\" <w@bush.com>, <president@whitehouse.gov>";
		UT.equal(groupMembers, expected, "group members = " + groupMembers);
	}
);
*/
/*
//TODO: DLIST is no longer applicable
UT.test("Add Items and Groups to Group", {
	teardown: function() {
		this._items = null;
		this._group = null;
	},

	setup: function() {
		var mockItem = new ZmMockContact();
		mockItem.email = "bush1@bush.com";
		mockItem.type = null;
		mockItem.fileAs = "Bush, Senior";
		mockItem.fullName = "George Bush";

		var mockPresidents = new ZmMockContact();
		mockPresidents.email = "";
		mockPresidents.type = "group";
		mockPresidents.dlist = "\"Clinton, Bill\" <bill@clinton.com>, \"W\" <w@bush.com>, \"Obama, Barak\" <mr.obama@whitehouse.gov>";

		this._items = [mockItem, mockPresidents];

		var presidents = new ZmMockContact();
		presidents.email = "";
		presidents.type = "group";
		presidents.dlist = "\"Lincoln, Abe\" <abe.lincoln@whitehouse.gov>, \"Jefferson, Thomas\" <thomas.jefferson@whitehouse.gov>";
	    this._group = presidents;
	}},

	function() {
		UT.expect(1);
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var members = clc._getGroupMembers(this._items, this._group);
		var expected =  "\"Bush, Senior\" <bush1@bush.com>, \"Clinton, Bill\" <bill@clinton.com>, \"Lincoln, Abe\" <abe.lincoln@whitehouse.gov>, \"Jefferson, Thomas\" <thomas.jefferson@whitehouse.gov>, \"W\" <w@bush.com>, \"Obama, Barak\" <mr.obama@whitehouse.gov>";
		UT.equal(members, expected, "group members = " + members);
		DBG.println("mock*****", members);
	}
);
*/
/*
//TODO: DLIST is no longer applicable
UT.test("Handle Duplicates in adding to group", {
	teardown: function() {
		this._items = null;
		this._group = null;
	},

	setup: function() {
		var mockGroup = new ZmMockContact();
		mockGroup.email = "";
		mockGroup.type = "group";
		mockGroup.dlist = "\"Clinton, Bill\" <bill.clinton@whitehouse.gov>";

		var clintons = new ZmMockContact();
		clintons.email = "";
		clintons.type = "group";
		clintons.dlist = "\"Clinton, Bill\" <bill.clinton@whitehouse.gov>, \"Clinton, Hillary\" <hillary.clinton@statedept.gov, \"Clinton, Chelsea\" <clinton.chelsea@alumni.stanford.edu>";
	 	this._items = [mockGroup];
		this._group = clintons;
	}},

	function() {
		UT.expect(1);
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		var groupMembers = clc._getGroupMembers(this._items, this._group);
		var expected =  "\"Clinton, Bill\" <bill.clinton@whitehouse.gov>, \"Clinton, Hillary\" <hillary.clinton@statedept.gov, \"Clinton, Chelsea\" <clinton.chelsea@alumni.stanford.edu>";
		UT.equal(groupMembers, expected, "group members = " + groupMembers);
	}
);
*/
//TODO: Cleanup to not hijack the response callback
UT.test("Group View: Verify contacts query uses is:local", {},
	function() {
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var controller = contactsApp.getContactController();
		var contact = new ZmContact(null, null, ZmItem.GROUP);
		setTimeout(function() {
			controller.show(contact, false);
			var ev = [];
			var groupView = controller.getCurrentView();
			var query = null;
			var queryHint = null;

			var _handleResponseSearch = function(firstTime, result) {
				query = result._data.search.query;
				queryHint = result._data.search.queryHint;
				UT.equal(query, '', "query = " + query);
				UT.equal(queryHint, "is:local", "queryHint = " + queryHint);
				UT.start();
			};
			groupView._handleResponseSearch = _handleResponseSearch.bind(this); //note - this makes the view forever tied to this method. So hopefully it's not re-used.
			var selectedOption = groupView._searchInSelect.getOptionWithValue(ZmContactsApp.SEARCHFOR_CONTACTS);
			ev.item = selectedOption._menuItem;
			groupView._searchInSelect._handleOptionSelection(ev);
			}, 200);
		UT.stop(10000);
		UT.expect(2);

	}

);

UT.test("Create Group: Verify group is in alphabet bar", {
	setup: function(){
		this._allContact = new ZmMockContact();
		this._allContact.fileAs = "User, Zimbra";

		this._AContact = new ZmMockContact();
		this._AContact.fileAs = "Anderson, Derek";

		this._digitContact = new ZmMockContact();
		this._digitContact.fileAs = "99 Center Store";

		this._spanishContact = new ZmMockContact();
		this._spanishContact.fileAs = "\u00d1ana";

		this._japaneseContact = new ZmMockContact();
		this._japaneseContact.fileAs = "\u3042";
	}},

	function() {
		UT.expect(18);
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var controller = contactsApp.getContactListController();
		var alphabetBar = controller.getCurrentView().getAlphabetBar();

		alphabetBar._currentLetter = null; //"all"
		var result = alphabetBar.isItemInAlphabetLetter(this._allContact);
		UT.equal(true, result, "result = " + result + " for 'All' test with user " + this._allContact.fileAs);

		alphabetBar._currentLetter = "A";
		var result = alphabetBar.isItemInAlphabetLetter(this._allContact);
		UT.equal(false, result, "result = " + result + " for 'A' test with user " + this._allContact.fileAs);

		alphabetBar._currentLetter = "123";
		var result = alphabetBar.isItemInAlphabetLetter(this._allContact);
		UT.equal(false, result, "result = " + result + " for '123' test with user " + this._allContact.fileAs);

		alphabetBar._currentLetter = null;
		var result = alphabetBar.isItemInAlphabetLetter(this._AContact);
		UT.equal(true, result, "result = " + result + " for 'All' test with user " + this._AContact.fileAs);

		alphabetBar._currentLetter = "A";
		var result = alphabetBar.isItemInAlphabetLetter(this._AContact);
		UT.equal(true, result, "result = " + result + " for 'A' test with user " + this._AContact.fileAs);

		alphabetBar._currentLetter = "Z";
		var result = alphabetBar.isItemInAlphabetLetter(this._AContact);
		UT.equal(false, result, "result = " + result + " for 'Z' test with user " + this._AContact.fileAs);

		alphabetBar._currentLetter = "123";
		var result = alphabetBar.isItemInAlphabetLetter(this._AContact);
		UT.equal(false, result, "result = " + result + " for '123' test with user " + this._AContact.fileAs);

		alphabetBar._currentLetter = null;
		var result = alphabetBar.isItemInAlphabetLetter(this._digitContact);
		UT.equal(true, result, "result = " + result + " for 'All' test with user " + this._digitContact.fileAs);

		alphabetBar._currentLetter = "A";
		var result = alphabetBar.isItemInAlphabetLetter(this._digitContact);
		UT.equal(false, result, "result = " + result + " for '123' test with user " + this._digitContact.fileAs);

		alphabetBar._currentLetter = '123';
		var result = alphabetBar.isItemInAlphabetLetter(this._digitContact);
		UT.equal(true, result, "result = " + result + " for '123' test with user " + this._digitContact.fileAs);

		alphabetBar._currentLetter = null;
		var result = alphabetBar.isItemInAlphabetLetter(this._spanishContact);
		UT.equal(true, result, "result = " + result + " for 'All' test with user " + this._spanishContact.fileAs);

		alphabetBar._currentLetter = 'A';
		var result = alphabetBar.isItemInAlphabetLetter(this._spanishContact);
		UT.equal(false, result, "result = " + result + " for 'A' test with user " + this._spanishContact.fileAs);

		alphabetBar._currentLetter = "\u00d1";
		var result = alphabetBar.isItemInAlphabetLetter(this._spanishContact);
		UT.equal(true, result, "result = " + result + " for '\u00d1' test with user " + this._spanishContact.fileAs);

		alphabetBar._currentLetter = "N";
		var result = alphabetBar.isItemInAlphabetLetter(this._spanishContact);
		UT.equal(false, result, "result = " + result + " for 'N' test with user " + this._spanishContact.fileAs);

		alphabetBar._currentLetter = null;
		var result = alphabetBar.isItemInAlphabetLetter(this._japaneseContact);
		UT.equal(true, result, "result = " + result + " for 'All' test with user " + this._japaneseContact.fileAs);

		alphabetBar._currentLetter = "A-Z";
		var result = alphabetBar.isItemInAlphabetLetter(this._japaneseContact);
		UT.equal(false, result, "result = " + result + " for 'A-Z' test with user " + this._japaneseContact.fileAs);

		alphabetBar._currentLetter = "\u3042";
		var result = alphabetBar.isItemInAlphabetLetter(this._japaneseContact);
		UT.equal(true, result, "result = " + result + " for '\u3042' test with user " + this._japaneseContact.fileAs);

		alphabetBar._currentLetter = "\u304b";
		var result = alphabetBar.isItemInAlphabetLetter(this._japaneseContact);
		UT.equal(false, result, "result = " + result + " for '\u304b' test with user " + this._japaneseContact.fileAs);

	}

);

UT.test("dedupe contact group", {
	teardown: function() {

	},

	setup: function() {
		this._inlineUser1 = {type: ZmContact.GROUP_INLINE_REF, value: "test1@zimbra.com"};
		this._inlineUser2 = {type: ZmContact.GROUP_INLINE_REF, value: "test2@zimbra.com"};
	}},

	function() {
		ZmUnitTestUtil.goToContacts();
		var contact = new ZmContact(null, null, "GROUP");
		UT.expect(5);
		//Test Inline dedupe
		var newItems = [ this._inlineUser1, this._inlineUser2];
		var existingItems = [ this._inlineUser1 ];
		newItems = ZmGroupView._dedupe(newItems, existingItems);
		UT.equal(1, newItems.length, "1 unique new item found after dedupe");
		
		//Test local contact dedupe
		var contactA = new ZmMockContact();
		contactA.id = "200";
		contactA.isGal = false;
		newItems.push(ZmContactsHelper._wrapContact(contactA));

		var contactB = new ZmMockContact();
		contactB.id = "201";
		contactB.isGal = false;
		newItems.push(ZmContactsHelper._wrapContact(contactB));

		// duplicate contacts in the list itself
		newItems.push(ZmContactsHelper._wrapContact(contactA));

		UT.equal(4, newItems.length, "4 contacts in new items list, including duplicate");

		newItems = ZmGroupView._dedupe(newItems, []);

		UT.equal(3, newItems.length, "1 duplicate found in contacts");

		//contact already belongs to group
		var listItemA = ZmContactsHelper._wrapContact(contactA); //no longer difference.
		existingItems.push(listItemA);

		//contact moved to group but not yet saved
		var listItemB = ZmContactsHelper._wrapContact(contactB);
		existingItems.push(listItemB);

		newItems = ZmGroupView._dedupe(newItems, existingItems);
		UT.equal(1, newItems.length, "2 duplicate found in contacts");
		
		//Test GAL contact dedupe
		var galContact = new ZmMockContact();
		galContact.ref = "uid=user1,ou=people,dc=eng,dc=vmware,dc=com";
		galContact.isGal = true;

		var galContactB = new ZmMockContact();
		galContactB.ref = "uid=user2,ou=people,dc=eng,dc=vmware,dc=com";
		galContactB.isGal = true;

		newItems.push(ZmContactsHelper._wrapContact(galContact));
		newItems.push(ZmContactsHelper._wrapContact(galContactB));

		var listItemGal = { address: "user1@eng.vmware.com", type: ZmContact.GROUP_GAL_REF, value: "uid=user1,ou=people,dc=eng,dc=vmware,dc=com"};
		existingItems.push(listItemGal);

		newItems = ZmGroupView._dedupe(newItems, existingItems);
		UT.equal(2, newItems.length, "1 duplicate found in gal");
	}
);

UT.test("ZmContactListController getGroupMembers",
	function() {
		/*
		Test 4 cases
		case 1) Create group with individual contacts
		case 2) Create group with contacts & groups
		case 3) Modify group with individual contacts
		case 4) Modify group with contacts & groups
		case 5) Modify GAL DL -- distribution list as type group, but no group contacts
		 */
		UT.expect(22);
		ZmUnitTestUtil.goToContacts();
		var contactsApp = appCtxt.getApp(ZmApp.CONTACTS);
		var clc = contactsApp.getContactListController();
		//add members to a group
		var contactA = new ZmMockContact();
		contactA.id = "200";
		contactA.isGal = false;
		
		var contactB = new ZmMockContact();
		contactB.id = "302";
		contactB.ref = "uid=user1,ou=zimbra,ou=com";
		contactB.isGal = true;
		
		var contactC = new ZmMockContact();
		contactC.value = "test@example.zimbra.com";
		contactC.type = "I";
			
		var group = new ZmMockContact();
		group.id = "201";
		group.isGal = false;
		group.type = "group";
		group.attr["groups"] = [contactA];
		
		var groupB = new ZmMockContact();
		groupB.id = "301";
		groupB.isGal = false;
		groupB.type = "group";
		groupB.attr["groups"] = [contactC];
		
		var groupC = new ZmMockContact();
		groupC.id = "303";
		groupC.isGal = "true";
		groupC.type = "group";
		groupC.ref = "uid=server-team,ou=zimbra,ou=com";
		
		//case 1
		var returnArr = clc._getGroupMembers([contactA]);
		UT.equal(returnArr[0].value, "1:200", "Group members should have value 1:200");
		UT.equal(returnArr[0].type, "C", "Group members should have type C");
		UT.notEqual(returnArr[0].op, "+", "Group member should not have an op");
		
		//case 2
		returnArr = clc._getGroupMembers([contactA, groupB]);
		UT.equal(returnArr[0].value, "1:200", "Group members should have value 1:200");
		UT.equal(returnArr[0].type, "C", "Group members should have type C");
		UT.notEqual(returnArr[0].op, "+", "Group member should not have an op");
		UT.equal(returnArr[1].value, "test@example.zimbra.com", "Group member should have value test@example.zimbra.com");
		UT.equal(returnArr[1].type, "I", "Group member should be type I");
		UT.notEqual(returnArr[1].op, "+", "Group member should not have an op");
		
		//case 3
		returnArr = clc._getGroupMembers([contactB], group);
		UT.equal(returnArr[0].value, "uid=user1,ou=zimbra,ou=com", "Group member should add contactB");
		UT.equal(returnArr[0].type, "G", "Group member contactB should be type G");
		UT.equal(returnArr[0].op , "+", "Group memeber contactB should have op +");
		
		//case 4
		returnArr = clc._getGroupMembers([contactA, groupB], group);
		UT.equal(returnArr.length, 2, "group should only have 2 members");
		UT.equal(returnArr[0].value, "1:200", "Group members should have value 1:200");
		UT.equal(returnArr[0].type, "C", "Group members should have type C");
		UT.equal(returnArr[0].op, "+", "Group member should have an op +");
		UT.equal(returnArr[1].value, "test@example.zimbra.com", "Group member should have value test@example.zimbra.com");
		UT.equal(returnArr[1].type, "I", "Group member should be type I");
		UT.equal(returnArr[1].op, "+", "Group member should have an op +");
		
		//case 5
		returnArr = clc._getGroupMembers([groupC]);
		UT.equal(returnArr[0].value, "uid=server-team,ou=zimbra,ou=com", "Group member should add groupC");
		UT.equal(returnArr[0].type, "G", "Group members should have type G");
		UT.notEqual(returnArr[0].op, "+", "Group member should not have an op");
		
		
	}		
);
}
if (AjxPackage.define("zimbraMail.unittest.UtMailListGroups")) {
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

UT.module("MailListGroups");

UT.test("Sort This Week: Today is Monday, Start of Week is Sunday", {},
	function() {
		UT.expect(2);
		var dateGroup = new ZmMailListDateGroup();
		var dayOfWeek = AjxDateUtil.MONDAY;
		dateGroup._weekStartDay = AjxDateUtil.SUNDAY;
		var sortedDays = dateGroup._sortThisWeek(dayOfWeek, false); //desc
		var expected = [ZmMailListDateGroup.MONDAY, ZmMailListDateGroup.SUNDAY];
		for (var i=0; i<sortedDays.length; i++) {
			UT.equal(sortedDays[i], expected[i], "sortedDay = " + sortedDays[i]);
		}
	}
);

UT.test("Sort This Week: Today is Friday, Start of Week is Monday", {},
	function() {
		UT.expect(5);
		var dateGroup = new ZmMailListDateGroup();
		var dayOfWeek = AjxDateUtil.FRIDAY;
		dateGroup._weekStartDay = AjxDateUtil.MONDAY;
		var sortedDays = dateGroup._sortThisWeek(dayOfWeek, false); //desc
		var expected = [ZmMailListDateGroup.FRIDAY, ZmMailListDateGroup.THURSDAY, ZmMailListDateGroup.WEDNESDAY, ZmMailListDateGroup.TUESDAY, ZmMailListDateGroup.MONDAY];
		for (var i=0; i<sortedDays.length; i++) {
			UT.equal(sortedDays[i], expected[i], "sortedDay = " + sortedDays[i]);
		}
	}
);

UT.test("Sort Date Groups Descending: Today is Friday, Start of Week is Sunday", {},
	function() {
		UT.expect(12);
		var dateGroup = new ZmMailListDateGroup();
		var dayOfWeek = AjxDateUtil.FRIDAY;
		var keys = dateGroup._sortKeys(dayOfWeek, false); //sort desc
		var expected = [ZmMailListDateGroup.TODAY, ZmMailListDateGroup.YESTERDAY, ZmMailListDateGroup.WEDNESDAY,
						ZmMailListDateGroup.TUESDAY, ZmMailListDateGroup.MONDAY, ZmMailListDateGroup.SUNDAY, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.THREE_WEEKS_AGO,
						ZmMailListDateGroup.EARLIER_THIS_MONTH, ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.OLDER];
		for (var i=0; i<keys.length; i++) {
			UT.equal(keys[i], expected[i], "keys = " + keys[i]);
		}
	}

);

UT.test("Sort Date Groups Descending: Today is Tuesday, Start of Week is Sunday", {},
	function() {
		UT.expect(9);
		var dateGroup = new ZmMailListDateGroup();
		var dayOfWeek = AjxDateUtil.TUESDAY;
		var keys = dateGroup._sortKeys(dayOfWeek, false); //sort desc
		var expected = [ZmMailListDateGroup.TODAY, ZmMailListDateGroup.YESTERDAY, ZmMailListDateGroup.SUNDAY, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.THREE_WEEKS_AGO,
						ZmMailListDateGroup.EARLIER_THIS_MONTH, ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.OLDER];
		for (var i=0; i<keys.length; i++) {
			UT.equal(keys[i], expected[i], "keys = " + keys[i]);
		}
	}
);

UT.test("Sort Date Groups Ascending: Today is Friday, Start of Week is Sunday", {},
	function() {
		UT.expect(12);
		var dateGroup = new ZmMailListDateGroup();
		dateGroup._weekStartDay = AjxDateUtil.SUNDAY;
		var dayOfWeek = AjxDateUtil.FRIDAY;
		var keys = dateGroup._sortKeys(dayOfWeek, true);
		var expected = [ZmMailListDateGroup.OLDER, ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.EARLIER_THIS_MONTH, ZmMailListDateGroup.THREE_WEEKS_AGO,
						ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.SUNDAY, ZmMailListDateGroup.MONDAY, ZmMailListDateGroup.TUESDAY,
						ZmMailListDateGroup.WEDNESDAY, ZmMailListDateGroup.YESTERDAY, ZmMailListDateGroup.TODAY];
		for (var i=0; i<keys.length; i++) {
			UT.equal(keys[i], expected[i], "keys = " + keys[i]);
		}
	}
);

UT.test("Date: isMsgInSection", {
	teardown: function() {

	},

	setup: function() {
		var oneDay = 86400000; //one day
		var lastWeek = oneDay * 7; //one week ago
		var twoWeeks = oneDay * 14; //two weeks ago
		var threeWeeks = oneDay * 21; //three weeks ago
		//var thisMonth = oneDay * 22; //more than three weeks ago
		var lastMonth = oneDay * 32; //one month ago
		var yearAgo = oneDay * 365; //one year ago

		this._sections = [ZmMailListDateGroup.TODAY, ZmMailListDateGroup.YESTERDAY, ZmMailListDateGroup.LAST_WEEK, ZmMailListDateGroup.TWO_WEEKS_AGO, ZmMailListDateGroup.THREE_WEEKS_AGO,
						  ZmMailListDateGroup.LAST_MONTH, ZmMailListDateGroup.OLDER];

		var today = new Date();
		var now = today.getTime();
		var todayMsg = {"sentDate": new Date()};
		var yesterdayMsg = {"sentDate": new Date(today.setTime(now - oneDay))};
		var lastWeekMsg = {"sentDate": new Date(today.setTime(now - lastWeek))};
	    var twoWeeksMsg = {"sentDate": new Date(today.setTime(now - twoWeeks))};
		var threeWeeksMsg = {"sentDate": new Date(today.setTime(now - threeWeeks))};
		//var thisMonthMsg = {"sentDate" : new Date(today.setTime(now - thisMonth))};
		var lastMonthMsg = {"sentDate" : new Date(today.setTime(now - lastMonth))};
		var olderMsg = {"sentDate" : new Date(today.setTime(now - yearAgo))};
		this._msgs = [todayMsg, yesterdayMsg, lastWeekMsg, twoWeeksMsg, threeWeeksMsg, lastMonthMsg, olderMsg];

	}},

	function() {
		UT.expect(56);
		var result = null;
	    var dateGroup = new ZmMailListDateGroup();
		for (var i=0; i<this._msgs.length; i++) {
			result = dateGroup.isMsgInSection(this._sections[i], this._msgs[i]);
			UT.equal(result, true, this._msgs[i].sentDate + " = " + result + " for section " + this._sections[i]);
		}

		for (var i=0; i<this._sections.length; i++) {
			for (var j=0; j<this._msgs.length; j++) {
				result = dateGroup.isMsgInSection(this._sections[i], this._msgs[j]); //test msg against all
				var expected = i == j ? true : false;
				UT.equal(result, expected, this._msgs[j].sentDate + " = " + result + " for section " + this._sections[i]);
		    }
		}
	}
);

UT.test("Date: isLastMonth", {
	teardown: function() {
		
	},
			
	setup: function() {
		var today = new Date();
		var now = today.getTime();
		var oneDay = 86400000; //one day
		var lastMonth = oneDay * 32; //one month ago
		var yearAgo = oneDay * 365; //one year ago
		this._lastMonthMsg = {"sentDate" : new Date(today.setTime(now - lastMonth))};
		this._oneYearAndOneMonthAgoMsg = {"sentDate" : new Date(today.setTime(now - lastMonth - yearAgo))};
	}},
		
	function() {
		UT.expect(2);
		var dateGroup = new ZmMailListDateGroup();
		var isLastMonth = dateGroup.isMsgInSection(ZmMailListDateGroup.LAST_MONTH, this._lastMonthMsg);
		UT.equal(isLastMonth, true, this._lastMonthMsg.sentDate + " = " + isLastMonth + " for last month");
		isLastMonth = dateGroup.isMsgInSection(ZmMailListDateGroup.LAST_MONTH, this._oneYearAndOneMonthAgoMsg);
		UT.equal(isLastMonth, false, this._oneYearAndOneMonthAgoMsg.sentDate + " = " + isLastMonth + " for last month");		
	}
);

UT.test("Message Size: isMsgInSection", {
	teardown: function() {

	},

	setup: function() {
		var megabyte = 1024 * 1024;
		this._tinySize = [(1024 * 9) + 511, 1024 * 5, 0]; //max, avg, min
		this._smallSize = [(1024 * 24) + 511, 1024 * 13, (1024*9) + 512];
		this._mediumSize = [(1024 * 99) + 511, 1024 * 50, (1024 * 24) + 512];
		this._largeSize = [(1024 * 499) + 511, 1024 * 250, (1024 * 99) + 512];
		this._veryLargeSize = [(1023 * 1024) + 511, 1024 * 750, (1024 * 499) + 512];
		this._hugeSize = [(megabyte * 4) + (megabyte/2) - 1, megabyte * 2, (1023 * 1024) + 512];
		this._enormousSize = [(megabyte * 20), megabyte * 10, (megabyte * 4) + (megabyte/2) + 1];
	}},

	function () {
		UT.expect(21);
		var sizeGroup = new ZmMailListSizeGroup();
		var msg = {};
		var result;
		for (var i=0; i<this._tinySize.length; i++) {
			msg.size = this._tinySize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.TINY, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 25) + " = " + result + " for section TINY");
		}

		for (var i=0; i<this._smallSize.length; i++) {
			msg.size = this._smallSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.SMALL, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section SMALL");
		}

		for (var i=0; i<this._mediumSize.length; i++) {
			msg.size = this._mediumSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.MEDIUM, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section MEDIUM");
		}

		for (var i=0; i<this._largeSize.length; i++) {
			msg.size = this._largeSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.LARGE, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section LARGE");
		}

		for (var i=0; i<this._veryLargeSize.length; i++) {
			msg.size = this._veryLargeSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.VERY_LARGE, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section VERY LARGE");
		}

		for (var i=0; i<this._hugeSize.length; i++) {
			msg.size = this._hugeSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.HUGE, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section HUGE");
		}

		for (var i=0; i<this._enormousSize.length; i++) {
			msg.size = this._enormousSize[i];
			result = sizeGroup.isMsgInSection(ZmMailListSizeGroup.ENORMOUS, msg);
			UT.equal(result, true, AjxUtil.formatSize(msg.size, false, 5) + " = " + result + " for section ENORMOUS");
		}
	}
);


}
if (AjxPackage.define("zimbraMail.unittest.UtYouTube")) {
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

UT.module("YouTube", ["Zimlet"]);

// Validate possible YouTube links
UT.test("YouTube link http://www.youtube.com/watch?v=ID", {

	teardown: function() {

	}},

	function() {
		UT.expect(1);
		var youTubeZimlet = new Com_Zimbra_Url();
		var url = "http://www.youtube.com/watch?v=WhwbxEfy7fg";
		var value = youTubeZimlet.getYouTubeId(url);
		UT.equal(value, "WhwbxEfy7fg", "YouTube ID is " + value);
	}
);

UT.test("YouTube link http://www.youtube.com/v/ID", {

	teardown: function() {

	}},

	function() {
		UT.expect(1);
		var youTubeZimlet = new Com_Zimbra_Url();
		var url = "http://www.youtube.com/v/WhwbxEfy7fg";
		var value = youTubeZimlet.getYouTubeId(url);
		UT.equal(value, "WhwbxEfy7fg", "YouTube ID is " + value);
	}
);

UT.test("YouTube link http://www.youtube.com/watch?feature=player_embedded&v=ID", {
	teardown: function() {

	}},

	function() {
		UT.expect(1);
		var youTubeZimlet = new Com_Zimbra_Url();
		var url = "http://www.youtube.com/watch?feature=player_embedded&v=tVwkUDRVmsA";
		var value = youTubeZimlet.getYouTubeId(url);
		UT.equal(value, "tVwkUDRVmsA", "YouTube ID is " + value);
	}
);

UT.test("YouTu.be link", {
	teardown: function() {

	}},

	function() {
		UT.expect(1);
		var youTubeZimlet = new Com_Zimbra_Url();
		var url = "http://youtu.be/WhwbxEfy7fg";
		var value = youTubeZimlet.getYouTubeId(url);
		UT.equal(value, "WhwbxEfy7fg", "YouTube ID is " + value);
	}
);

//Validate parsing of links from mail message
UT.test("YouTube Plain Text",  {
	teardown: function() {

	}},

	function() {
		UT.expect(4);
		var youTubeZimlet = new Com_Zimbra_Url();
		var txt = "Check out these videos on YouTube: " +
				   "B in the bath: http://www.youtube.com/watch?v=2vyEnQoG6q8 " +
				   "B doing the naked dance: http://www.youtube.com/watch?v=7-XYUlfBoFw " +
				   "B playing on the gymini: http://www.youtube.com/watch?v=TRRPNB4bgvM";
		var expected = ["2vyEnQoG6q8", "7-XYUlfBoFw", "TRRPNB4bgvM"];
		var hash = youTubeZimlet._getAllYouTubeLinks(txt);
		UT.notEqual(hash, null, "hash of links should not be null");
		if (hash) {
			var count = 0;
			for (var id in hash) {
				UT.equal(id, expected[count], "Found link with ID = " +id);
				count++;
			}
		}

	}
);

UT.test("YouTube HTML Text", {
	teardown: function() {

	}},

	function() {
		UT.expect(4);
		var txt = '------=_Part_37824_2551618.1163013234262' +
				   'Content-Type: text/html; charset=ISO-8859-1' +
				   'Content-Transfer-Encoding: 7bit' +
				   'Content-Disposition: inline' +
'You rock!&nbsp; Now, when you get your blog you can just embed them there.<br><br><div><span class="gmail_quote">On 11/8/06, <b class="gmail_sendername">Jessica </b> &lt;<a href="mailto:Jessica_@domain.com">Jessica_@domain.com ' +
'</a>&gt; wrote:</span><blockquote class="gmail_quote" style="border-left: 1px solid rgb(204, 204, 204); margin: 0pt 0pt 0pt 0.8ex; padding-left: 1ex;"> ' +
'<div link="blue" vlink="#FF8000" lang="EN-US"> ' +
'<div> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">We\'ve loaded a couple of short videos on YouTube for ' +
'your viewing pleasure. I\'m new to YouTube, but I believe that you just ' +
'need to click on the URL and you should be able to see the video (without ' +
'logging in or creating an account). I\'m not sure though, so let me know ' +
'how this work for you.</span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">&nbsp;</span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">Bennett in the bath: <a href="http://www.youtube.com/watch?v=2vyEnQoG6q8" target="_blank" onclick="return top.js.OpenExtLink(window,event,this)"> ' +
'http://www.youtube.com/watch?v=2vyEnQoG6q8</a></span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">Bennett doing the naked dance: <a href="http://www.youtube.com/watch?v=7-XYUlfBoFw" target="_blank" onclick="return top.js.OpenExtLink(window,event,this)"> ' +
'http://www.youtube.com/watch?v=7-XYUlfBoFw</a></span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">Bennett playing on the gymini: <a href="http://www.youtube.com/watch?v=TRRPNB4bgvM" target="_blank" onclick="return top.js.OpenExtLink(window,event,this)"> ' +
'http://www.youtube.com/watch?v=TRRPNB4bgvM</a></span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">&nbsp;</span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">Also attached is a picture from Sunday when we took a walk. </span></font></p> ' +
'<p><font face="Arial" size="2"><span style="font-size: 10pt; font-family: Arial;">&nbsp;</span></font></p> ';
		var youTubeZimlet = new Com_Zimbra_Url();
		var expected = ["2vyEnQoG6q8", "7-XYUlfBoFw", "TRRPNB4bgvM"];
		var hash = youTubeZimlet._getAllYouTubeLinks(txt);
		UT.notEqual(hash, null, "hash of links should not be null");
		if (hash) {
			var count = 0;
			for (var id in hash) {
				UT.equal(id, expected[count], "Found link with ID = " +id);
				count++;
			}
		}
	}

);

UT.test("YouTube Max Links", {
	teardown: function() {

	}},

	function() {
		UT.expect(6);
		var youTubeZimlet = new Com_Zimbra_Url();
		var txt = "Check out these videos: " +
				  "JT Put a Ring on It: http://youtu.be/uycrNZEWRsk " +
				  "Dear Persian: http://www.youtube.com/watch?v=MLyzscHXtWM&feature=grec_index " +
				  "Spongebob: http://www.youtube.com/watch?feature=grec_index&v=NEuJAkTcJ8c " +
				  "Will Ferrell as Bush on YouTube.com http://youtu.be/EkqrI3IibYI " +
				  "Will Ferrell on CNBC http://www.youtube.com/v/dT2DxkEHnJc " +
				  "The Decision: http://www.youtube.com/watch?v=0f7AtdF6B_0 " +
				  "More JT: http://www.youtube.com/watch?v=rWnSSEBroHk" +
				  "Gingerbread man -- http://youtu.be/uX4NT3iDuRE";
		var expected = ["uycrNZEWRsk", "MLyzscHXtWM", "NEuJAkTcJ8c", "EkqrI3IibYI", "dT2DxkEHnJc"];
		var hash = youTubeZimlet._getAllYouTubeLinks(txt);
		UT.notEqual(hash, null, "hash of links should not be null");
		if (hash) {
			var count = 0;
			for (var id in hash) {
				UT.equal(id, expected[count], "Found link with ID = " +id);
				count++;
			}
		}

	}

);

UT.test("YouTube handle duplicates", {
	teardown: function() {

	}},

	function() {
		UT.expect(2);
		var youTubeZimlet = new Com_Zimbra_Url();
		var txt = "Same video three different ways. " +
				   "Spongebob: https://www.youtube.com/watch?feature=grec_index&v=NEuJAkTcJ8c " +
				   "Spongebob: http://youtube.com/v/NEuJAkTcJ8c " +
				   "Spongebob: http://www.youtu.be/NEuJAkTcJ8c ";
		var expected = "NEuJAkTcJ8c";
		var hash = youTubeZimlet._getAllYouTubeLinks(txt);
		UT.notEqual(hash, null, "hash of all links should not be null");
		if (hash) {
			for (var id in hash) {
				UT.equal(id, expected, "Found link with ID = " +id);
			}
		}
	}

);
}
//AjxPackage.require({name:"zimbraMail.unittest.UtSpeed",				method:AjxPackage.METHOD_SCRIPT_TAG});

if (AjxPackage.define("zimbraMail.unittest.UtPreferences")) {
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


UT.module("Preferences");

UT.test("Show preferences view",
    function() {
        console.log("starting preferences test");

        UtZWCUtils.chooseApp(ZmApp.PREFERENCES);
        UT.stop(UtZWCUtils.MAX_STOP);

        UT.expect(1);
        setTimeout(
            function() {
                console.log("continuing preferences test");
                UT.start();
                var isRightView = UtZWCUtils.isPreferencesViewCurrent();
                UT.ok(isRightView,"Preferences view loaded");
            },
            UtZWCUtils.LOAD_VIEW_SETTIMEOUT
        );
    }
);

//Test Conversation
UT.test("Filter Rule addCondition: testConversation", 
	function() {
		UT.expect(6);
		var testRule = new ZmFilterRule("testConversation", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, null, "started");
		UT.equal(cData.where, "started", "condition.where should equal started");
		UT.notEqual(cData.negative, "1", "testConversation should not be negative" );
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, "participated");
		UT.equal(cData2.where, "participated", "condition.where should equal participated");
		UT.notEqual(cData2.negative, "1", "testConversation should not be negative");
		
		var cData3 = testRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_NOT_CONV, "started");
		UT.equal(cData3.where, "started", "condition where should equal started");
		UT.equal(cData3.negative, "1", "testConversation should be negative");
	}
);

//Test Bulk
UT.test("ZmFilterRule.addCondition: testBulk",
	function(){
		UT.expect(7);
	 	var testRule = new ZmFilterRule("testBulk", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_BULK);
		UT.equal(cData.value, null, "testBulk value should be null");
		UT.notEqual(cData.negative, "1", "testBulk should not be negative");
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_BULK, ZmFilterRule.OP_NOT_CONV);
		UT.equal(cData2.value, null, "testBulk value should be null");
		UT.equal(cData2.negative, "1", "testBulk should be null");
		
		var bulkRule = new ZmFilterRule("testBulk", true, {}, {});
		var cData3 = bulkRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, ZmFilterRule.C_BULK);
		var isBulk = bulkRule.conditions[ZmFilterRule.TEST_BULK].length == 1;
		UT.equal(isBulk, true, "bulkRule should be testType of testBulk");
		UT.equal(cData3.value, null, "testBulk value should be null");
		UT.notEqual(cData3.negative, "1", "testBulk should not be negative");
		
	}			
);

//Test List
UT.test("ZmFilterRule.addCondition: testList",
	function() {
		UT.expect(7);
		var testRule = new ZmFilterRule("testList", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_LIST);
		UT.equal(cData.value, null, "testList value should be null");
		UT.notEqual(cData.negative, "1", "testList should not be negative");
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_LIST, ZmFilterRule.OP_NOT_CONV);
		UT.equal(cData2.value, null, "testList value should be null");
		UT.equal(cData2.negative, "1", "testList should be negative");
		
		var listRule = new ZmFilterRule("testList", true, {}, {});
		var cData3 = listRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, ZmFilterRule.C_LIST);
		var isList = listRule.conditions[ZmFilterRule.TEST_LIST].length == 1;
		UT.equal(isList, true, "listRule should be testType of testList");
		UT.equal(cData3.value, null, "testList value should be null");
		UT.notEqual(cData3.negative, "1", "testList should not be negative");
	}
);

//Test Importance
UT.test("ZmFilterRule.addCondition: testImportance",
	function() {
		UT.expect(19);
		var testRule = new ZmFilterRule("testImportance", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_IMPORTANCE, null, "high");
		UT.equal(cData.imp, "high", "testImportance imp attribute should be high");
		UT.equal(cData.value, null, "testImportance value should be null");
		UT.notEqual(cData.negative, "1", "testImportance should not be negative");
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_IMPORTANCE, ZmFilterRule.OP_CONV_IS, "low");
		UT.equal(cData2.imp, "low", "testImportance imp attribute should be low");
		UT.equal(cData2.value, null, "testImportance value should be null");
		UT.notEqual(cData2.negative, "1", "testImportance should not be negative");
		
		var cData3 = testRule.addCondition(ZmFilterRule.TEST_IMPORTANCE, ZmFilterRule.OP_NOT_CONV, "normal");
		UT.equal(cData3.imp, "normal", "testImportance imp attribute should be normal");
		UT.equal(cData3.value, null, "testImportance value should be null");
		UT.equal(cData3.negative, "1", "testImportance valud should be negative");
		
		var importanceRule = new ZmFilterRule("testImportance", true, {}, {});
		var cData4 = importanceRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, "high");
		var isImportance = importanceRule.conditions[ZmFilterRule.TEST_IMPORTANCE].length == 1;
		UT.equal(isImportance, true, "importanceRule should be of testType testImportance");
		UT.equal(cData4.imp, "high", "importanceRule.imp should be high");
		UT.equal(cData4.value, null, "importanceRule value should be null");
		UT.notEqual(cData4.negative, "1", "importanceRule should not be negative");
		
		var cData5 = importanceRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_NOT_CONV, "normal");
		isImportance = importanceRule.conditions[ZmFilterRule.TEST_IMPORTANCE].length == 2;
		UT.equal(isImportance, true, "importanceRule should be of testType testImportance");
		UT.equal(cData5.imp, "normal", "importanceRule.imp should be normal");
		UT.equal(cData5.negative, "1", "importanceRule should be negative");
		
		var cData6 = importanceRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, "low");
		isImportance = importanceRule.conditions[ZmFilterRule.TEST_IMPORTANCE].length == 3;
		UT.equal(isImportance, true, "importanceRule should be of testType testImportance");
		UT.equal(cData6.imp, "low", "importanceRule.imp should be low");
		UT.notEqual(cData6.negative, "1", "importanceRule should not be negative");
	}		
);

//Test Flagged
UT.test("ZmFilterRule.addCondition: testFlagged", 
	function() {
		UT.expect(10);
		var testRule = new ZmFilterRule("testFlagged", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_FLAGGED, null, "read");
		UT.equal(cData.flagName, "read", "testFlagged flagName should be read");
		UT.notEqual(cData.negative, "1", "testFlagged should not be negative");
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_FLAGGED, ZmFilterRule.OP_CONV_IS, "flagged");
		UT.equal(cData2.flagName, "flagged", "testFlagged flagName should be flagged");
		UT.notEqual(cData2.negative, "1", "testFlagged should not be negative");
		
		var cData3 = testRule.addCondition(ZmFilterRule.TEST_FLAGGED, ZmFilterRule.OP_NOT_CONV, "priority");
		UT.equal(cData3.flagName, "priority", "testFlagged flagName should be priority");
		UT.equal(cData3.negative, "1", "testFlagged should be negative");
		
		var flagTest = new ZmFilterRule("flagTest", true, {}, {});
		var cData4 = flagTest.addCondition(ZmFilterRule.TEST_CONVERSATIONS, ZmFilterRule.OP_CONV_IS, "flagged");
		var isFlag = flagTest.conditions[ZmFilterRule.TEST_FLAGGED].length == 1;
		UT.equal(isFlag, true, "flagTest should be of testType testFlagged");
		UT.equal(cData4.flagName, "flagged", "flagTest flagName should be flagged");
		UT.notEqual(cData4.negative, "1", "flagTest should not be negative");
	}
);

//Test Me
UT.test("ZmFilerRule.addCondition: testMe",
	function() {
		UT.expect(3);
		var testRule = new ZmFilterRule("testMe", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_IS_ME, null, "to,cc");
		var isMe = testRule.conditions[ZmFilterRule.TEST_ME].length == 1;
		UT.equal(isMe, true, "testMe should be of testType testMe");
		
		var notMeRule = new ZmFilterRule("notMe", true, {}, {});
		var cData2 = notMeRule.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_NOT_ME, null, "to,cc");
		isMe = notMeRule.conditions[ZmFilterRule.TEST_ME].length == 1;
		UT.equal(isMe, true, "notMeRule should be of testType testMe");
		UT.equal(cData2.negative, "1", "notMeRule should be negative");
	}
);

//Test Ranking
UT.test("ZmFilterRule.addCondition: testRanking",
	function() {
		UT.expect(3);
		var testRule = new ZmFilterRule("testRanking", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_IN, "ranking");
		var isRanking = testRule.conditions[ZmFilterRule.TEST_RANKING].length == 1;
		UT.equal(isRanking, true, "testRule should be of testType testRanking");
		
		var notFrequent = new ZmFilterRule("testNotFrequent", true, {}, {});
		var cData2 = notFrequent.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_NOT_IN, "ranking");
		isRanking= notFrequent.conditions[ZmFilterRule.TEST_RANKING].length == 1;
		UT.equal(isRanking, true, "testNotFrequent should be of testType testRanking");
		UT.equal(cData2.negative, "1", "testNotFrequent should be negative");
	}		
);

//Test address book
UT.test("ZmFilterRule.addCondition: testAddrBook",
	function() {
		UT.expect(3);
		var testRule = new ZmFilterRule("testAddressBook", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_IN, "contacts", "from");
		UT.equal(cData.value, null, "testAddressBook value should be null");
		UT.equal(cData.header, "from", "testAdressBook header should be from");
		
		var cDatat2 = testRule.addCondition(ZmFilterRule.TEST_ADDRBOOK, ZmFilterRule.OP_NOT_IN, "contacts", "from");
		UT.equal(cDatat2.negative, "1", "testAdressBook should be negative");
	}
);

//Test Social Filters
UT.test("ZmFilterRule.addCondition: test social filters",
	function() {
		UT.expect(8);
		var testRule = new ZmFilterRule("testSocial", true, {}, {});
		var cData = testRule.addCondition(ZmFilterRule.TEST_SOCIAL, ZmFilterRule.OP_SOCIAL_FACEBOOK);
		var isFacebook = testRule.conditions[ZmFilterRule.TEST_FACEBOOK].length == 1;
		UT.equal(isFacebook, true, "testSocial should be of testType facebookTest");
		UT.notEqual(cData.negative, "1", "testSocial should not be negative");
		
		var cData2 = testRule.addCondition(ZmFilterRule.TEST_SOCIAL, ZmFilterRule.OP_SOCIAL_LINKEDIN, "social");
		var isLinkedIn = testRule.conditions[ZmFilterRule.TEST_LINKEDIN].length = 1;
		UT.equal(isLinkedIn, true, "testSocial should be of testType linkedInTest");
		UT.notEqual(cData.negative, "1", "testSocial should not be negative");
		
		var cData4 = testRule.addCondition(ZmFilterRule.TEST_SOCIAL, ZmFilterRule.OP_SOCIAL_TWITTER);
		var isTwitter = testRule.conditions[ZmFilterRule.TEST_TWITTER].length == 1;
		UT.equal(isTwitter, true, "testSocial should be of testType twitterTest");
		UT.notEqual(cData4.negative, "1", "testSocial should not be negative");
	}		
);
}
if (AjxPackage.define("zimbraMail.unittest.UtCalendar")) {
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

UT.module("Calendar");

UT.test("Show Calendar view",
    function() {
        console.log("starting calendar test");

        UtZWCUtils.chooseApp(ZmApp.CALENDAR);
        UT.stop(UtZWCUtils.MAX_STOP);

        UT.expect(1);
        setTimeout(
            function() {
                console.log("continuing calendar test");
                var isRightView = UtZWCUtils.isCalendarViewCurrent();
                UT.ok(isRightView, "Calendar view loaded");
                UT.start();
            },
            UtZWCUtils.LOAD_VIEW_SETTIMEOUT
        );
    }
);
}
if (AjxPackage.define("zimbraMail.unittest.UtContacts")) {
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

UT.module("Contacts");

UT.test("Show Contacts view",
    function() {
        ZmUnitTestUtil.log("starting contacts test");

        ZmUnitTestUtil.chooseApp(ZmApp.CONTACTS);
        UT.stop(UtZWCUtils.MAX_STOP);

        UT.expect(1);
        setTimeout(
            function() {
                ZmUnitTestUtil.log("continuing contacts test");
                var isRightView = UtZWCUtils.isAddressBookViewCurrent();
                UT.ok(isRightView, "Contacts view loaded");
                UT.start();
            },
            UtZWCUtils.LOAD_VIEW_SETTIMEOUT
        );
    }
);

UT.test("Add new contact",
    function() {
        var zmContactsApp = appCtxt.getApp(ZmApp.CONTACTS)
        zmContactsApp._handleLoadNewItem();
    }
);

UT.test("Wrap Inline Contact",
  	function() {
		UT.expect(3);
		var inline1 = "jwagner@vmware.com";
		var obj = ZmContactsHelper._wrapInlineContact(inline1);
		UT.equal(obj.address, inline1);
		  
		var inline2 = "Jeff Wagner <jwagner@vmware.com>";
		var obj2 = ZmContactsHelper._wrapInlineContact(inline2);
		UT.equal(obj2.address, "jwagner@vmware.com");
		  
		var inline3 = "\"John Doe\" <x@x.com>";
		var obj3 = ZmContactsHelper._wrapInlineContact(inline3);
		UT.equal(obj3.address, "x@x.com");
	  }
);
}
if (AjxPackage.define("zimbraMail.unittest.UtMail")) {
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

UT.module("MailCore", ["Mail"]);

UT.test("Show view",
    function() {
        console.log("starting mail test");

        UtZWCUtils.chooseApp(ZmApp.MAIL);
        UT.stop(UtZWCUtils.MAX_STOP);

        UT.expect(1);
        setTimeout(
            function() {
                console.log("continuing mail test");
                var isRightView = UtZWCUtils.isMailViewCurrent();
                UT.ok(isRightView,"Mail view loaded");
                UT.start();
            },
            UtZWCUtils.LOAD_VIEW_SETTIMEOUT
        );
    }
);

UT.test("Close compose views",
    function() {
		console.log("mail test #2 - close compose views");
		var newButton = appCtxt.getAppController().getNewButton();
        newButton._emulateSingleClick();
        newButton._emulateSingleClick();
        newButton._emulateSingleClick();

        UtZWCUtils.closeAllComposeViews();
        var openComposeViewCount = UtZWCUtils.getComposeViewCount();
        UT.ok(openComposeViewCount == 0, openComposeViewCount + " compose view(s) are open");
    }
);

UT.test("Send email",
	function() {
		console.log("send email");
		var newButton = appCtxt.getAppController().getNewButton();
		newButton._emulateSingleClick();

		var composeView = appCtxt.getCurrentView();
		var isRightView = (composeView && composeView instanceof ZmComposeView);
		UT.ok(isRightView, "Compose view loaded");

		var randomString = UtZWCUtils.getRandomString(10);
		var toEmail = UtZWCUtils.getEmailAddressOfCurrentAccount();
		composeView._subjectField.value = "Unit testing mail: " + randomString;
		composeView.getRecipientField(AjxEmailAddress.TO).value = toEmail;
		composeView._bodyField.value = "Unit test mail: " + randomString;

		var composeViewController = composeView._controller;
		var originalHandleResponse = composeViewController._handleResponseSendMsg;
		var postSendMessageClosure = UT._postSendMessage.bind(null, composeView, composeViewController, originalHandleResponse);
		composeViewController._handleResponseSendMsg = postSendMessageClosure;
		composeViewController._send();

		console.log("call stop");
		UT.stop(UtZWCUtils.MAX_STOP);
		UT.expect(2);
	}
);

UT.test("parseComposeUrl",
	function() {
		UT.expect(7);
		var mailApp = appCtxt.getApp(ZmApp.MAIL);
		var queryStr = "&to=mailto%3AFoo+Bar+<foo.bar%40host.com>";
		var result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.to, "mailto:Foo Bar <foo.bar@host.com>");
		
		queryStr = "&to=mailto%3AC%2B%2B+Team+<cplusteam%40host.com>";
		result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.to, "mailto:C++ Team <cplusteam@host.com>");
		
		queryStr = "to=mailto%3AJoe%20Smith%20%3Cjoe.smith@somewhere.com%3E?subject=My%20Subject";
		result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.to, "mailto:Joe Smith <joe.smith@somewhere.com>?subject=My Subject");

		queryStr =  "to=Joe%20Smith%20%3Cjoe.smith@somewhere.com%3E";
		result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.to, "Joe Smith <joe.smith@somewhere.com>");

		queryStr =  "cc=Joe%20Smith%20%3Cjoe.smith@somewhere.com%3E";
		result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.cc, "Joe Smith <joe.smith@somewhere.com>");

		queryStr =  "bcc=Joe%20Smith%20%3Cjoe.smith@somewhere.com%3E";
		result = mailApp._parseComposeUrl(queryStr);
		UT.equal(result.bcc, "Joe Smith <joe.smith@somewhere.com>");
		
		queryStr='&cc="\"><iframe src=a onload=alert(\"VL\") <\"><iframe src=a onload=alert(\"VL\") <" <qa-test1@zim"';
		result = mailApp._parseComposeUrl(queryStr);
		UT.notEqual(result.cc, '"\"><iframe src=a onload=alert(\"VL\") <\"><iframe src=a onload=alert(\"VL\") <" <qa-test1@zimbra.com>'); //should be HTML encoded
	}
		
);

UT._postSendMessage =
function(composeView, composeViewController, originalHandleResponse, draftType, msg, callback, result) {
	var success = !result.isException();
	UT.ok(success, "Send message failed");
	composeViewController._handleResponseSendMsg = originalHandleResponse;
	composeViewController._handleResponseSendMsg(draftType, msg, callback, result);

	console.log("returned, call start");
	UT.start();
	UtZWCUtils.closeAllComposeViews();
};

UT.test("trim HTML",
	function() {
		UT.expect(1);
		var str = '<html><body><div style="font-family: Verdana; font-size: 10pt; color: #000099"><div>content213451111738</div><div><br><br></div></div></body></html>';
		str = AjxStringUtil.trimHtml(str);
		UT.equals(str, '<div style="font-family: Verdana; font-size: 10pt; color: #000099"><div>content213451111738</div></div>');
	}
);
}
if (AjxPackage.define("zimbraMail.unittest.UtMailMsg")) {
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

UT.module("MailMsg");

// List-ID header
UT.test("Get List-ID header", {

	teardown: function() {

	}},

	function() {
		UT.expect(4);
		var mailMsg = new ZmMailMsg();
		var id = mailMsg.getListIdHeader();
		UT.equal(id, null, "no List-Id header");
		mailMsg.attrs = {};
		mailMsg.attrs["List-ID"] = "Ant Users List <user.ant.apache.org>";
		id = mailMsg.getListIdHeader();
		UT.equal(id, "user.ant.apache.org", "Apache Ant List-ID");
		
		mailMsg.attrs["List-ID"] = "<mylist@zimbra.com>";
		id = mailMsg.getListIdHeader();
		UT.equal(id, "mylist@zimbra.com", "Zimbra List-ID");
		
		mailMsg.attrs["List-ID"] = "This is the less than list (<). <test.legal.list>";
		id = mailMsg.getListIdHeader();
		UT.notEqual(id, "test.legal.list", "Angle bracket test. I'm hoping this is not a valid description");
	}
);

//X-Zimbra-DL header
UT.test("Get X-Zimbra-DL header",
	function() {
		UT.expect(7);
		var mailMsg = new ZmMailMsg();
		var xId = mailMsg.getXZimbraDLHeader();
		UT.equal(xId, null, "no X-Zimbra-DL header");
		
		mailMsg.attrs = {};
		mailMsg.attrs["X-Zimbra-DL"] = "Server Team <server-team@example.zimbra.com>";
		xId = mailMsg.getXZimbraDLHeader();
		var good = xId.good.getArray();
		UT.equal(good.length, 1, "Mail message should have 1 X-Zimbra-DL value");
		UT.equal(good[0].address, "server-team@example.zimbra.com", "mail message X-Zimbra-DL header should be server-team@example.zimbra.com");
		
		mailMsg = new ZmMailMsg();
		mailMsg.attrs = {};
		mailMsg.attrs["X-Zimbra-DL"] = "Server Team <server-team@example.zimbra.com>, ui-team@example.zimbra.com";
		xId = mailMsg.getXZimbraDLHeader();
		good = xId.good.getArray();
		UT.equal(good.length, 2, "Mail message should have 2 X-Zimbra-DL values");
		UT.equal(good[0].address, "server-team@example.zimbra.com", "mail mesage X-Zimbra-DL header should have have server-team@example.zimbra.com");
		UT.equal(good[1].address, "ui-team@example.zimbra.com", "mail message X-Zimbra-DL header should have ui-team@example.zimbrea.com");
		
		mailMsg = new ZmMailMsg();
		mailMsg.attrs = {};
		mailMsg.attrs["X-Zimbra-DL"] = "badaddress";
		xId = mailMsg.getXZimbraDLHeader();
		good = xId.good.getArray();
		UT.equal(good.length, 0, "Mail message should not have any good X-Zimbra-DL values");
	}		
);

UT.test("Unfang Internal Test: Copy/Paste Inline Image", {
	
	teardown: function() {
	}},
	
	function() {
		UT.expect(2);
		
		var node =    {
						cid: "570",
						d: 1316619883000,
						e: [
						   {
							a: "user1@prome-2n-dhcp138.eng.vmware.com",
							d: "Demo",
							p: "Demo User One",
							t: "f"
						   },
						  {
							a: "user1",
							d: "user1",
							t: "t"
						   }
						 ],
						f: "sa",
						id: "568",
						l: "5",
						mid: "<49b7b6b4-0783-4da5-8e25-aacc6c5e3f1f@prome-2n-dhcp138.eng.vmware.com>",
						mp: [
						  {
							ct: "multipart/alternative",
							mp: [
							  {
								ct: "text/plain",
								part: "1",
								s: 1
							   },
							   {
								ct: "multipart/related",
								mp: [
								 {
									body: true,
									content: "<html><head><style>p { margin: 0; }</style></head><body><div style=\"font-family: Times New Roman; font-size: 12pt; color: #000000\"><div><img src=\"cid:2eaca8a7d2cd054b66ea5be106299b74bd313773@zimbra\" alt=\"\"></div></div></body></html>",
									ct: "text/html",
									part: "2.1",
									s: 249
								   },
								   {
									cd: "attachment",
									ci: "<2eaca8a7d2cd054b66ea5be106299b74bd313773@zimbra>",
									ct: "image/png",
									filename: "1316619883060",
									part: "2.2",
									s: 20235
								   }
								 ],
								part: "2"
							   }
							 ],
							part: "TEXT"
						   }
						 ],
						rev: 314,
						s: 29174,
						sd: 1316619883000,
						su: "copy/paste image"
					   };
	   //var node = JSON.parse(nodeStr);
	   var args = {};
	   args.list = [];
	   var mailMsg = ZmMailMsg.createFromDom(node, args);
	   var bodyPart = mailMsg.getBodyPart(ZmMimeTable.TEXT_HTML);
	   var div = document.createElement("div");
	   div.innerHTML = bodyPart.getContent();
	   var images = div.getElementsByTagName("img");
       for(var i=0; i<images.length; i++) {
	     var isExternal = ZmMailMsgView._isExternalImage(images[i]);
	     UT.equal(isExternal, false, "src=cid:xxxx is not external");  
         var unfang = ZmMailMsgView.__unfangInternalImage(mailMsg, images[i], "src", false);
	     var src = images[i].getAttribute("src");
	     var hasCid = src.match("cid:");  //cid should be removed
	     UT.equal(hasCid, null, "src=" + src);
       }
	}	
);

UT.test("Unfang Internal Test: External Image", {
	
	teardown: function() {
	}},
	
	function() {
		UT.expect(3);
		
		var node =  { 
		cid: "-560",
        cm: true,
        d: 1316619774000,
        e: [
           {
            a: "user1@dcomfort.com",
            d: "Demo",
            p: "Demo User One",
            t: "f"
           },
          {
            a: "list@dcomfort.com",
            d: "list",
            t: "t"
           }
         ],
        fr: "Google",
        id: "560",
        l: "2",
        mid: "<670fbd72-6dc1-4218-a47d-e0608088d50a@prome-2n-dhcp175.eng.vmware.com>",
        mp: [
         {
            ct: "multipart/alternative",
            mp: [
              {
                ct: "text/plain",
                part: "1",
                s: 20
               },
              {
                body: true,
                content: '<html><head><style>p { margin: 0; }</style></head><body><div style="font-family: Times New Roman; font-size: 12pt; color: #000000"><br><span id="body"><center><div id="lga"><img alt="Google" id="hplogo" style="padding-top:28px" height="95" width="275" dfsrc="http://www.google.com/intl/en_com/images/srpr/logo3w.png"></div><form action="/search" name="f"><table class="jhp" cellpadding="0" cellspacing="0"><tbody><tr valign="top"><td align="center" nowrap="nowrap"><div class="ds" style="height:32px;margin:4px 0"><input dir="ltr" maxlength="2048" name="q" id="lst-ib" class="lst" title="Google Search" value="" size="57" style="background: none repeat scroll 0% 0% rgb(255, 255, 255); border-width: 1px; border-style: solid; border-right: 1px solid rgb(217, 217, 217); border-color: silver rgb(217, 217, 217) rgb(217, 217, 217); -moz-border-top-colors: none; -moz-border-right-colors: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none; -moz-border-image: none; color: rgb(0, 0, 0); margin: 0pt; padding: 5px 8px 0pt 6px; vertical-align: top; outline: medium none;"></div><br style="line-height:0"></td></tr></tbody></table></form><div style="font-size:83%;min-height:3.5em"><br></div></center></span> <br></div></body></html>',
                ct: "text/html",
                part: "2",
                s: 1417
               }
             ],
            part: "TEXT"
           }
         ],
        rev: 300,
        s: 2613,
        sd: 1316540964000,
        sf: "",
        su: "External image"
       }
	   var args = {};
	   args.list = [];
	   var mailMsg = ZmMailMsg.createFromDom(node, args);
	   var bodyPart = mailMsg.getBodyPart(ZmMimeTable.TEXT_HTML);
	   var div = document.createElement("div");
	   div.innerHTML = bodyPart.getContent();
	   var images = div.getElementsByTagName("img");
       for(var i=0; i<images.length; i++) {
	     var isExternal = ZmMailMsgView._isExternalImage(images[i]);
	     UT.equal(isExternal, true, "dfsrc=URL is external");  
	     var unfang = ZmMailMsgView.__unfangInternalImage(mailMsg, images[i], "src", true);
		 UT.equal(unfang, true, "dfsrc=URL not external according to unfanger");
	     var src = images[i].getAttribute("dfsrc");
	     UT.equal(src, "http://www.google.com/intl/en_com/images/srpr/logo3w.png", "dfsrc=http://www.google.com/intl/en_com/images/srpr/logo3w.png");  
       }
	}	
);

UT.test("Unfang Internal Test: Inline Attachment", {
	
	teardown: function() {
	}},
	
	function() {
		UT.expect(2);
		
		var node =  {
		cid: "566",
        d: 1316619840000,
        e: [
          {
            a: "user1@prome-2n-dhcp138.eng.vmware.com",
            d: "Demo",
            p: "Demo User One",
            t: "f"
           },
          {
            a: "user1@prome-2n-dhcp138.eng.vmware.com",
            d: "Demo",
            p: "Demo User One",
            t: "t"
           }
         ],
        f: "sa",
        id: "564",
        l: "5",
        mid: "<d8ae52d5-71f4-4b9b-a2b7-33f9aa6bd02b@prome-2n-dhcp138.eng.vmware.com>",
        mp: [
          {
            ct: "multipart/alternative",
            mp: [
             {
                ct: "text/plain",
                part: "1",
                s: 2
               },
              {
                ct: "multipart/related",
                mp: [
                  {
                    body: true,
                    content: '<html><head><style>p { margin: 0; }</style></head><body><div style="font-family: Times New Roman; font-size: 12pt; color: #000000"><div><img src="cid:29e427a6ce209cef3387c9a3aa5a4e689ab50d9c@zimbra"><br></div></div></body></html>',
                    ct: "text/html",
                    part: "2.1",
                    s: 308
                   },
                  {
                    cd: "attachment",
                    ci: "<29e427a6ce209cef3387c9a3aa5a4e689ab50d9c@zimbra>",
                    ct: "image/png",
                    filename: "Tag Icons.png",
                    part: "2.2",
                    s: 16692
                   }
                 ],
                part: "2"
               }
             ],
            part: "TEXT"
           }
         ],
        rev: 308,
        s: 24525,
        sd: 1316619840000,
        su: "inline attachment"
       }
	   var args = {};
	   args.list = [];
	   var mailMsg = ZmMailMsg.createFromDom(node, args);
	   var bodyPart = mailMsg.getBodyPart(ZmMimeTable.TEXT_HTML);
	   var div = document.createElement("div");
	   div.innerHTML = bodyPart.getContent();
	   var images = div.getElementsByTagName("img");
       for(var i=0; i<images.length; i++) {
	     var isExternal = ZmMailMsgView._isExternalImage(images[i]);
	     UT.equal(isExternal, false, "Image is inline and should not be external");
         var unfang = ZmMailMsgView.__unfangInternalImage(mailMsg, images[i], "src", false);
	     var src = images[i].getAttribute("src");
	     UT.equal(src, "http://localhost:7070/service/home/~/?auth=co&id=564&part=2.2", "src value should be converted from cid to server path reference");
       }
	}	
);

UT.test("Unfang Internal Test: Inline Attachment (Content-Location)", {
	
	teardown: function() {
	}},
	
	function() {
		UT.expect(2);
		
		var node =  {
		cid: "566",
        d: 1316619840000,
        e: [
          {
            a: "user1@prome-2n-dhcp138.eng.vmware.com",
            d: "Demo",
            p: "Demo User One",
            t: "f"
           },
          {
            a: "user1@prome-2n-dhcp138.eng.vmware.com",
            d: "Demo",
            p: "Demo User One",
            t: "t"
           }
         ],
        f: "sa",
        id: "564",
        l: "5",
        mid: "<d8ae52d5-71f4-4b9b-a2b7-33f9aa6bd02b@prome-2n-dhcp138.eng.vmware.com>",
        mp: [
          {
            ct: "multipart/alternative",
            mp: [
             {
                ct: "text/plain",
                part: "1",
                s: 2
               },
              {
                ct: "multipart/related",
                mp: [
                  {
                    body: true,
                    content: '<html><head><style>p { margin: 0; }</style></head><body><div style="font-family: Times New Roman; font-size: 12pt; color: #000000"><div><img pnsrc="image001.png"><br></div></div></body></html>',
                    ct: "text/html",
                    part: "2.1",
                    s: 308
                   },
                  {
                    cd: "attachment",
					cl: "image001.png",
                    ci: "<29e427a6ce209cef3387c9a3aa5a4e689ab50d9c@zimbra>",
                    ct: "image/png",
                    filename: "Tag Icons.png",
                    part: "2.2",
                    s: 16692
                   }
                 ],
                part: "2"
               }
             ],
            part: "TEXT"
           }
         ],
        rev: 308,
        s: 24525,
        sd: 1316619840000,
        su: "inline attachment"
       }
	   var args = {};
	   args.list = [];
	   var mailMsg = ZmMailMsg.createFromDom(node, args);
	   var bodyPart = mailMsg.getBodyPart(ZmMimeTable.TEXT_HTML);
	   var div = document.createElement("div");
	   div.innerHTML = bodyPart.getContent();
	   var images = div.getElementsByTagName("img");
       for(var i=0; i<images.length; i++) {
	     var isExternal = ZmMailMsgView._isExternalImage(images[i]);
	     UT.equal(isExternal, false, "Image is inline and should not be external");
         var unfang = ZmMailMsgView.__unfangInternalImage(mailMsg, images[i], "src", false);
	     var src = images[i].getAttribute("src");
	     UT.equal(src, "http://localhost:7070/service/home/~/?auth=co&id=564&part=2.2", "src value should be converted from cid to server path reference");
       }
	}	
);
}
if (AjxPackage.define("zimbraMail.unittest.UtShare")) {
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2014, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2011, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
UT.module("Share");

UT.test("Find Shares Link: get app options", {
	teardown: function(){
		appCtxt.set(ZmSetting.BRIEFCASE_ENABLED, this._briefcaseEnabled);
		appCtxt.set(ZmSetting.TASKS_ENABLED, this._tasksEnabled);
		appCtxt.set(ZmSetting.CONTACTS_ENABLED, this._contactsEnabled);
		appCtxt.set(ZmSetting.MAIL_ENABLED, this._mailEnabled);
	},

	setup: function() {
		//save original values
		this._briefCaseEnabled = appCtxt.get(ZmSetting.BRIEFCASE_ENABLED);
		this._tasksEnabled = appCtxt.get(ZmSetting.TASKS_ENABLED);
		this._contactEnabled = appCtxt.get(ZmSetting.CONTACTS_ENABLED);
		this._mailEnabled = appCtxt.get(ZmSetting.MAIL_ENABLED);
	}},

	function() {
		UT.expect(11);
		var dialog = appCtxt.getShareSearchDialog();
		//expect all apps enabled
		var options = dialog._getAppOptions();
		UT.equal(options.length, 6, "options.length = " + options.length);

		appCtxt._shareSeachDialog = null;
		appCtxt.set(ZmSetting.BRIEFCASE_ENABLED, false);
		dialog = appCtxt.getShareSearchDialog();
		var options = dialog._getAppOptions();
		UT.equal(options.length, 5, "options.length = " + options.length);
		UT.equal(options[1].id, "Mail");
		UT.equal(options[2].id, "Contacts");
		UT.equal(options[3].id, "Calendar");
		UT.equal(options[4].id, "Tasks");

		appCtxt._shareSeachDialog = null;
		appCtxt.set(ZmSetting.TASKS_ENABLED, false);
		appCtxt.set(ZmSetting.CONTACTS_ENABLED, false);
		dialog = appCtxt.getShareSearchDialog();
		var options = dialog._getAppOptions();
		UT.equal(options.length, 3, "options.length = " + options.length);
		UT.equal(options[1].id, "Mail");
		UT.equal(options[2].id, "Calendar");

		appCtxt.shareSearchDialog = null;
		appCtxt.set(ZmSetting.MAIL_ENABLED, false); //only calendar enabled
		dialog = appCtxt.getShareSearchDialog();
		var options = dialog._getAppOptions();
		UT.equal(options.length, 2, "options.length = " + options.length);
		UT.equal(options[1].id, "Calendar");

	}
);
}
if (AjxPackage.define("zimbraMail.unittest.UtSearch")) {
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

UT.module("Search");

UtSearch = function() {};

UtSearch.folderId = function() {
	ZmUnitTestUtil.log("starting Search.folderId test");

	UT.expect(5);
	var inboxQuery = "in:inbox";
	var pq = new ZmParsedQuery(inboxQuery);
	var inboxProps = pq.getProperties();
	UT.equal(inboxProps.folderId, ZmOrganizer.ID_INBOX, "folderId is INBOX");

	var anywhereQuery = "is:anywhere";
	var anywherePQ = new ZmParsedQuery(anywhereQuery);
	var anywhereProps = anywherePQ.getProperties();
	UT.equal(anywhereProps.folderId, null, "folderId is null");
	
	var notQuery = "is:anywhere larger:100KB not in:inbox";
	var notPQ = new ZmParsedQuery(notQuery);
	var notProps = notPQ.getProperties();
	UT.equal(notProps.folderId, null, "folderId is null");
	
	var orFolder = "in:inbox OR in:trash";
	var orPQ = new ZmParsedQuery(orFolder);
	var orProps = orPQ.getProperties();
	UT.equal(orProps.folderId, null, "folderId is null");
	
	var or2Folder = "(larger:100KB OR smaller: 10KB) in:inbox";
	var or2PQ = new ZmParsedQuery(or2PQ);
	var or2Props = or2PQ.getProperties();
	UT.equal(or2Props.folderId, ZmOrganizer.ID_INBOX, "folderId is INBOX");
};

UtSearch.tag = function() {
	ZmUnitTestUtil.log("starting Search.tag test");

	UT.expect(3);
	var tagQuery = "tag:test";
	var pq = new ZmParsedQuery(tagQuery);
	var tagProps = pq.getProperties();
	UT.notEqual(tagProps.tagId, null, "tagId is set");
	
	var notTag = "larger:10KB is:anywhere not tag:test";
	var notPQ = new ZmParsedQuery(notTag);
	var notProps = notPQ.getProperties();
	UT.equal(notProps.tagId, null, "tagId is not set");
	
	var orTag = "tag:test OR tag:test2";
	var orPQ = new ZmParsedQuery(orTag);
	var orProps = orPQ.getProperties();
	UT.equal(orProps.tagId, null, "tagId is not set");
};

UT.test("Search.folderId", UtSearch.folderId);
UT.test("Search.tag", UtSearch.tag);
}
if (AjxPackage.define("zimbraMail.unittest.UtPriorityInbox")) {
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

UT.module("PriorityInbox");

// Remove conditions
UT.test("Remove Conditions", {

	teardown: function() {

	}},

	function() {
		UT.expect(8);
		var priorityMessageDialog = appCtxt.getPriorityMessageFilterDialog();
		var testRule = new ZmFilterRule("testRule", true, {}, {});
		testRule.addCondition(ZmFilterRule.TEST_CONVERSATIONS, null, "started");
		testRule.addCondition(ZmFilterRule.TEST_RANKING, null, null, "contacts");
		testRule.addCondition(ZmFilterRule.TEST_FACEBOOK);
		testRule.addCondition(ZmFilterRule.TEST_LINKEDIN);
		testRule.addCondition(ZmFilterRule.TEST_TWITTER);
		testRule.addCondition(ZmFilterRule.TEST_BULK, ZmFilterRule.OP_NOT_CONV);
	    var resultRule = priorityMessageDialog._removeCondition(testRule, ZmFilterRule.TEST_FACEBOOK, null, null);
		var condition = resultRule.conditions[ZmFilterRule.TEST_FACEBOOK];
		UT.equal(condition.length, 0, "facebook removed");
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_CONVERSATIONS].length, 1, "has TEST_CONVERSATIONS");
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_RANKING].length, 1, "has TEST_RANKING");
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_LINKEDIN].length, 1, "has TEST_LINKEDIN");
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_TWITTER].length, 1, "has TEST_TWITTER");
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_BULK].length, 1, "has TEST_BULK");
		
		testRule.addCondition(ZmFilterRule.TEST_LIST, ZmFilterRule.OP_NOT_CONV);
		testRule.addCondition(ZmFilterRule.TEST_LIST, ZmFilterRule.OP_CONV);
		resultRule = priorityMessageDialog._removeCondition(testRule, ZmFilterRule.TEST_LIST, null, null);
		UT.equal(resultRule.conditions[ZmFilterRule.TEST_LIST].length, 1, "has one TEST_LIST");
		
	}
);

//Search conditions
UT.test("Search Conditions", {
	
	teardown: function() {
	}},

	function() {
		UT.expect(4);
		var activityStreamDialog = appCtxt.getActivityStreamFilterDialog();
		var testRule = new ZmFilterRule("testRule", true, {}, {});
		testRule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, "Daily Deal!", ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT]);
		testRule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, "test@example.zimbra.com", ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_FROM]);
		activityStreamDialog._subject = "Daily Deal!";
		activityStreamDialog._from = "test@example.zimbra.com";
		var result = activityStreamDialog._isNewCondition(testRule);
		UT.equal(result, false, "subject or from is not a new condition");
		
		activityStreamDialog._subject = "Daily Digest";
		activityStreamDialog._from = "daily@example.zimbra.com";
		result = activityStreamDialog._isNewCondition(testRule);
		UT.equal(result, true, "subject or from is new condition");
		
		testRule.addCondition(ZmFilterRule.TEST_HEADER, ZmFilterRule.OP_CONTAINS, "Daily", ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_SUBJECT]);
		activityStreamDialog._subject = "Daily Deal!";
		activityStreamDialog._from = null;
		result = activityStreamDialog._isNewCondition(testRule);
		UT.equal(result, false, "subject is not a new condition");
		
		activityStreamDialog._from = "deal@example.zimbra.com";
		activityStreamDialog._subject = null;
		testRule.addCondition(ZmFilterRule.TEST_ADDRESS, ZmFilterRule.OP_CONTAINS, "@example.zimbra.com", ZmFilterRule.C_HEADER_VALUE[ZmFilterRule.C_FROM]);
		result = activityStreamDialog._isNewCondition(testRule);
		UT.equal(result, false, "from is not a new condition");
	}
);
}
if (AjxPackage.define("zimbraMail.unittest.UtMailMsgView")) {
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

UT.module("MailMsgView", ["Mail"]);

UtMailMsgView = function() {};

UtMailMsgView.test = function() {
    ZmUnitTestUtil.log("starting message view test");

	UT.expect(UtMailMsgView_data.length);
    UT.stop(10000);

    UtMailMsgView._showMsg(0);
};

UtMailMsgView._showMsg = function (index) {
    var msg = ZmMailMsg.createFromDom(UtMailMsgView_data[index].json, {});
    var callback = UtMailMsgView._showCallback.bind(null, index);
    var controller = AjxDispatcher.run("GetMsgController");
    controller.show(msg, null, callback, null, true);
};

UtMailMsgView._showCallback = function(index, controller, view) {
    var data = UtMailMsgView_data[index];
    if (data.validate) {
        // Call the data's function to do the validation.
        data.validate.call(data, controller, view);
    } else {
        // If this piece of test data does not have a validate method, just compare the
        // view's body text with the data's expected value.
        var viewBody = AjxStringUtil.trim(view.getContentContainer().innerHTML);
        var expectedBody = AjxStringUtil.trim(data.expectedBody);
        UT.equal(viewBody, expectedBody, "UtMailMsgView[" + index + "]");
    }

    index++;
    if (index < UtMailMsgView_data.length) {
        UtMailMsgView._showMsg(index);
    } else {
        UT.start();
    }
};

UT.test("MailMsgView Tests", UtMailMsgView.test);
}
if (AjxPackage.define("zimbraMail.unittest.UtGetOriginalContent")) {
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

UT.module("GetOriginalContent", ["Mail"]);

UtGetOriginalContent = function() {};

UtGetOriginalContent.test = function() {
    ZmUnitTestUtil.log("starting conversation view test");

	UT.expect(UtGetOriginalContent_data.length);
    for (var i = 0, count = UtGetOriginalContent_data.length; i < count; i++) {
        var obj = UtGetOriginalContent_data[i];
        var output = AjxStringUtil.getOriginalContent(obj.input, obj.isHtml);
		var referenceOutput = (obj.output == UtZWCUtils.SAME) ? obj.input : obj.output;
        UT.equals(output, referenceOutput);
    }
};

UT.test("GetOriginalContent Tests", UtGetOriginalContent.test);
}
if (AjxPackage.define("zimbraMail.unittest.UtToolBar")) {
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
UT.module("Toolbars");

UT.test("DwtToolBar", function() {
	UT.expect(5);

	var shell = appCtxt.getShell();
	var toolbar = new DwtToolBar({parent: shell});

	try {
		UT.strictEqual(toolbar._itemsEl.childNodes.length, 0,
		               'no elements to begin with?');

		var sep = toolbar.addSeparator();
		var filler = toolbar.addFiller();
		var spacer = toolbar.addSpacer();
		var button = new DwtButton({parent: toolbar});

		UT.strictEqual(toolbar.getChildren().length, 4,
		               'all elements correspond to a child?');

		toolbar.removeChild(sep);
		toolbar.removeChild(filler);
		toolbar.removeChild(spacer);
		toolbar.removeChild(button);

		UT.strictEqual(toolbar.getChildren().length, 0,
		               'no children remain?');
		UT.strictEqual(toolbar._items.length, 0,
		               'no items remain?');
		UT.strictEqual(toolbar._itemsEl.childNodes.length, 0,
		               'no elements remain?');

	} finally {
		toolbar.dispose();
	}
});

UT.test("ZmAppChooser", function() {
	UT.expect(5);

	var shell = appCtxt.getShell();
	var toolbar = new ZmAppChooser({parent: shell, buttons: {}});

	try {
		UT.strictEqual(toolbar._itemsEl.childNodes.length, 2,
		               'just the suffix and prefix elements to begin with?');

		var butt = toolbar.addButton(Dwt.getNextId(), {
			text: 'a button',
			tooltip: 'something or other'
		});

		UT.strictEqual(toolbar.getChildren().length, 1,
		               'all elements correspond to a child?');

		toolbar.removeChild(butt);

		UT.strictEqual(toolbar.getChildren().length, 0,
		               'no children remain?');
		UT.strictEqual(toolbar._items.length, 0,
		               'no items remain?');
		UT.strictEqual(toolbar._itemsEl.childNodes.length, 2,
		               'back to square one?');

	} finally {
		toolbar.dispose();
	}
});
}

if (AjxPackage.define("zimbraMail.unittest.UtGeneral")) {
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

UT.module("General");

UT.test("Duplicate IDs",
	function() {
		console.log("starting duplicate ids test");

		UtZWCUtils.chooseApp(ZmApp.MAIL); // not sure it matters
		UT.stop(UtZWCUtils.MAX_STOP);

		UT.expect(1);
		setTimeout(
			function() {
				console.log("continuing duplicate ids test");
				var ids = [];
				var duplicateIds = [];
				var nodes = document.getElementsByTagName("*");
				for (var i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					var id = node.id;
					if (!id) {
						continue;
					}
					if (ids[id]) {
						duplicateIds.push(id);
					}
					ids[id] = true;
				}
				duplicateIds = AjxUtil.uniq(duplicateIds).sort();
				if (duplicateIds.length > 0) {
					console.log("duplicate ids", duplicateIds);
				}
				UT.equal(duplicateIds.length, 0 ,"duplicate ids count");
				UT.start();
			},
			UtZWCUtils.LOAD_VIEW_SETTIMEOUT
		);
	}
);
}
if (AjxPackage.define("zimbraMail.unittest.UTSearchHighlighterZimlet")) {
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

UT.module("SearchHighlighterZimlet");

UtSearchZimlet = function() {};
UtSearchZimlet._searchHighlighterZimlet = new SearchHighlighterZimlet();

UtSearchZimlet._performTest = function (queryExpArr, expectedRegexLength, lineArr, resultArr) {
	var base,ret;
	for (var i = 0; i < queryExpArr.length; i++) {
		UtSearchZimlet._searchHighlighterZimlet._searchController.currentSearch.query = queryExpArr[i].query;
		UtSearchZimlet._searchHighlighterZimlet._setRegExps();	
		if (expectedRegexLength==0 || (UtSearchZimlet._searchHighlighterZimlet._regexps.length == 0)) {
			UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps.length, expectedRegexLength, 
					"For query='" + queryExpArr[i].query + "' length of _regexps array should be " + expectedRegexLength);
		}
		else {
			UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps.length, expectedRegexLength, 
					"For query='" + queryExpArr[i].query + "' length of _regexps array should be " + expectedRegexLength);
			UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps[0].toString(), queryExpArr[i].regexp, 
					"For query='" + queryExpArr[i].query + "' check the generated regular expression");
			base = (lineArr.length * i);
			for (var j = 0; j < lineArr.length; j++) {
				ret = UtSearchZimlet._searchHighlighterZimlet.match(lineArr[j], 0);
				UT.equal(ret != null, resultArr[base + j], "For query='" + queryExpArr[i].query + "' match result for line='" + lineArr[j] + "'");	
			}
		}
	}
};

UtSearchZimlet.test = function() {
	
	//17queries
	var queryExpArr = [
					 {query:"2015", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"*2015", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"+2015", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"?2015", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"2015*", regexp: "/\\b(2015\\S*)\\b/gi"}, 
					 {query:"2015+", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"2015?", regexp: "/\\b(2015)\\b/gi"},
					 {query:"20*15", regexp: "/\\b(20\\*15)\\b/gi"}, 
					 {query:"20+15", regexp: "/\\b(20\\+15)\\b/gi"},  
					 {query:"20?15", regexp: "/\\b(20\\?15)\\b/gi"}, 
					 {query:"**??+2015", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"2015**", regexp: "/\\b(2015\\S*)\\b/gi"}, 
					 {query:"2015?*", regexp: "/\\b(2015\\S*)\\b/gi"}, 
					 {query:"2015+*", regexp: "/\\b(2015\\S*)\\b/gi"},
					 {query:"2015*?", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"2015+?", regexp: "/\\b(2015)\\b/gi"}, 
					 {query:"2015*+", regexp: "/\\b(2015)\\b/gi"}
				   ];
	
	//13lines
	var lineArr = [
					"2015", "*2015", "2015*", "20*15", "+2015", "2015+", "20+15", 
                    "?2015", "2015?", "20?15", "abc2015", "2015abc", "abc2015xyz"
				  ];
	
	//Every query will match with every corresponding line so (17x13 results)
	var resultArr = [
			         //=========query 1= "2015"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 2= "*2015"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 3= "+2015"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 4= "?2015"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 5= "2015*"================
					   true, true, true, false, true, true, false, true, true, false, false ,true, false,
					 //=========query 6= "2015+"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 7= "2015?"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 8= "20*15"================
					   false, false, false, true, false, false, false, false, false, false, false ,false, false,
					 //=========query 9= "20+15"================
					   false, false, false, false, false, false, true, false, false, false, false ,false, false,
					 //=========query 10= "20?15"================
					   false, false, false, false, false, false, false, false, false, true, false ,false, false,
					 //=========query 11= "**??+2015"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 12= "2015**"================
					   true, true, true, false, true, true, false, true, true, false, false ,true, false,
					 //=========query 13= "2015?*"================
					   true, true, true, false, true, true, false, true, true, false, false ,true, false,
					 //=========query 14= "2015+*"================
					   true, true, true, false, true, true, false, true, true, false, false ,true, false,
					 //=========query 15= "2015*?"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 16= "2015+?"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false,
					 //=========query 17= "2015*+"================
					   true, true, true, false, true, true, false, true, true, false, false ,false, false
					];
	
	UtSearchZimlet._searchHighlighterZimlet._searchController = appCtxt.getSearchController();
	UtSearchZimlet._performTest(queryExpArr, 1, lineArr, resultArr);
	
	//Query=bigger:2
	UtSearchZimlet._performTest([{query:"bigger:2", regexp: ""}], 0);
	
	//Query="not health"
	UtSearchZimlet._performTest([{query:"not health", regexp: ""}], 0);
	
	//Query="not in:inbox health"
	UtSearchZimlet._performTest([{query:"not in:inbox health", regexp: "/\\b(health)\\b/gi"}], 1, ["health"], [true]);
	
	//Test For exact word search.
	var ret = null;
	var query ="happy";
	var line ="hap happ happying abchappy Happy";
	UtSearchZimlet._searchHighlighterZimlet._searchController.currentSearch.query = query;
	ret = UtSearchZimlet._searchHighlighterZimlet.match(line, 0);
	UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps[0].toString(), "/\\b(happy)\\b/gi", 
			"For query='" + query + "' check the generated regular expression");
	UT.equal(ret.index, 27, "For query='" + query + "' check match index for line='" + line + "'");	
	
	//Test for multiple words: To show all the keywords in the search query are independently searched. 
	query ="happy republic";
	line ="happy testing abc republic";
	UtSearchZimlet._searchHighlighterZimlet._searchController.currentSearch.query = query;
	ret = UtSearchZimlet._searchHighlighterZimlet.match(line, 0);
	UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps[0].toString(), "/\\b(happy|republic)\\b/gi", 
			"For query='" + query + "' check the generated regular expression");
	UT.equal(ret.index, 0, "For query='" + query + "' check match index for line='" + line +
			"'.  This shows all the keywords in the search query are independently searched.");
		
	//Test for multiple words: To show order of keywords in search query does not matter.
	query ="happy republic";
	line ="republic testing hello happy";
	UtSearchZimlet._searchHighlighterZimlet._searchController.currentSearch.query = query;
	ret = UtSearchZimlet._searchHighlighterZimlet.match(line, 0);
	UT.equal(UtSearchZimlet._searchHighlighterZimlet._regexps[0].toString(), "/\\b(happy|republic)\\b/gi", 
			"For query='" + query + "' check the generated regular expression");
	UT.equal(ret.index, 0, "For query='" + query + "' check match index for line='" + line + 
			"'.  This shows order of keywords in search query does not matter.");
};

UT.test("SearchHightlighter Zimlet tests", UtSearchZimlet.test);
}

}
