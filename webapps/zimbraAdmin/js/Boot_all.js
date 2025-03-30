/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2006, 2007, 2009, 2010, 2011, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */
/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq) && matchMedia(mq).matches || false;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);
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
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array? Use check that doesn't rely on type info, which IE loses across windows

			if (AjxUtil.isArray1(value)) {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }


// Create a version of stringify that doesn't rely on type information, which IE can lose
// for arrays when going across windows.
         JSON.stringify1 = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };

// If the JSON object does not yet have a stringify method, add ours.
    if (typeof JSON.stringify !== 'function') {
		JSON.stringify = JSON.stringify1;
	}

// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
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
 * Information about the browser and run-time environment.
 * @class
 */
AjxEnv = function() {
};

//
// Constants
//

/** User locale. */
AjxEnv.DEFAULT_LOCALE = window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage;

//
// Data
//

AjxEnv._inited = false;

// NOTE: These are here so that the documentation tool can pick them up

/** Gecko date. */
AjxEnv.geckoDate;
/** Mozilla version. */
AjxEnv.mozVersion;
/** WebKit version. */
AjxEnv.webKitVersion;
/** Trident version. */
AjxEnv.tridentVersion;
/** Macintosh. */
AjxEnv.isMac;
/** Windows. */
AjxEnv.isWindows;
/** Windows 64-bit. */
AjxEnv.isWindows64;
/** Linux. */
AjxEnv.isLinux;
/** Netscape Navigator compatible. */
AjxEnv.isNav;
/** Netscape Navigator version 4. */
AjxEnv.isNav4;
/** "legacy" Internet Explorer -- i.e. version 10 and earlier */
AjxEnv.isIE;
/** "modern" Internet Explorer -- i.e. version 11 and Edge */
AjxEnv.isModernIE;


AjxEnv.trueNs;


/** Netscape Navigator version 6. */
AjxEnv.isNav6;
/** Netscape Navigator version 6 (or higher). */
AjxEnv.isNav6up;
/** Netscape Navigator version 7. */
AjxEnv.isNav7;
/** Internet Explorer version 3. */
AjxEnv.isIE3;
/** Internet Explorer version 4. */
AjxEnv.isIE4;
/** Internet Explorer version 4 (or higher). */
AjxEnv.isIE4up;
/** Internet Explorer version 5. */
AjxEnv.isIE5;
/** Internet Explorer version 5.5. */
AjxEnv.isIE5_5;
/** Internet Explorer version 5 (or higher). */
AjxEnv.isIE5up;
/** Internet Explorer version 5.5 (or higher). */
AjxEnv.isIE5_5up;
/** Internet Explorer version 6. */
AjxEnv.isIE6;
/** Internet Explorer version 6 (or higher). */
AjxEnv.isIE6up;
/** Internet Explorer version 7. */
AjxEnv.isIE7;
/** Internet Explorer version 7 (or higher). */
AjxEnv.isIE7up;
/** Internet Explorer version 8. */
AjxEnv.isIE8;
/** Internet Explorer version 8 (or higher). */
AjxEnv.isIE8up;
/** Internet Explorer version 9. */
AjxEnv.isIE9;
/** Internet Explorer version 9 (or higher). */
AjxEnv.isIE9up;
/** Internet Explorer version 10. */
AjxEnv.isIE10;

AjxEnv.isNormalResolution;
AjxEnv.ieScaleFactor;


/** Mozilla Firefox. */
AjxEnv.isFirefox;
/** Mozilla Firefox version 1 (or higher). */
AjxEnv.isFirefox1up;
/** Mozilla Firefox version 1.5 (or higher). */
AjxEnv.isFirefox1_5up;
/** Mozilla Firefox version 3 (or higher). */
AjxEnv.isFirefox3up;
/** Mozilla Firefox version 3.6 (or higher). */
AjxEnv.isFirefox3_6up;
/** Mozilla Firefox version 4 (or higher). */
AjxEnv.isFirefox4up;
/** Mozilla. */
AjxEnv.isMozilla;
/** Mozilla version 1.4 (or higher). */
AjxEnv.isMozilla1_4up;
/** Safari. */
AjxEnv.isSafari;
/** Safari version 2. */
AjxEnv.isSafari2;
/** Safari version 3. */
AjxEnv.isSafari3;
/** Safari version 3 (or higher). */
AjxEnv.isSafari3up;
/** Safari version 4. */
AjxEnv.isSafari4;
/** Safari version 4 (or higher). */
AjxEnv.isSafari4up;
/** Safari version 5 (or higher). */
AjxEnv.isSafari5up;
/** Safari version 5.1 (or higher). */
AjxEnv.isSafari5_1up;
/** Camino. */
AjxEnv.isCamino;
/** Chrome. */
AjxEnv.isChrome;
AjxEnv.isChrome2up;
AjxEnv.isChrome7;
AjxEnv.isChrome10up;
/** Gecko-based. */
AjxEnv.isGeckoBased;
/** WebKit-based. */
AjxEnv.isWebKitBased;
/** Trident, i.e. the MSIE rendering engine */
AjxEnv.isTrident;
/** Opera. */
AjxEnv.isOpera;


AjxEnv.useTransparentPNGs;


/** Zimbra Desktop. */
AjxEnv.isDesktop;
/** Zimbra Desktop version 2 (or higher). */
AjxEnv.isDesktop2up;
/** Screen size is less then 800x600. */
AjxEnv.is800x600orLower;
/** Screen size is less then 1024x768. */
AjxEnv.is1024x768orLower;

/** HTML5 Support **/
AjxEnv.supportsHTML5File;

AjxEnv.supported = Modernizr;

// Test for HTML's New Template Tag support
AjxEnv.supported.addTest('template', function() {
	return 'content' in document.createElement('template');
});

/** Supports indirect global eval() **/
AjxEnv.indirectEvalIsGlobal;
(function(){
	// Feature detection to see if eval referenced by alias runs in global scope
	// See davidflanagan.com/2010/12/global-eval-in.html 
	AjxEnv.indirectEvalIsGlobal=false;
	var evl=window.eval;
	try{
		evl('__indirectEval=true');
		if('__indirectEval' in window){
			AjxEnv.indirectEvalIsGlobal=true;
			delete __indirectEval;
		}
	}catch(e){}
})();

//
// Public functions
//

AjxEnv.reset =
function() {
	AjxEnv.geckoDate = 0;
	AjxEnv.mozVersion = -1;
	AjxEnv.webKitVersion = -1;
	AjxEnv.isMac = false;
	AjxEnv.isWindows = false;
	AjxEnv.isWindows64 = false;
	AjxEnv.isLinux = false;
	AjxEnv.isNav  = false;
	AjxEnv.isIE = false;
	AjxEnv.isNav4 = false;
	AjxEnv.trueNs = true;
	AjxEnv.isNav6 = false;
	AjxEnv.isNav6up = false;
	AjxEnv.isNav7 = false;
	AjxEnv.isIE3 = false;
	AjxEnv.isIE4 = false;
	AjxEnv.isIE4up = false;
	AjxEnv.isIE5 = false;
	AjxEnv.isIE5_5 = false;
	AjxEnv.isIE5up = false;
	AjxEnv.isIE5_5up = false;
	AjxEnv.isIE6  = false;
	AjxEnv.isIE6up = false;
	AjxEnv.isIE7  = false;
	AjxEnv.isIE7up = false;
	AjxEnv.isIE8  = false;
	AjxEnv.isIE8up = false;
	AjxEnv.isIE9   = false;
	AjxEnv.isIE9up = false;
	AjxEnv.isIE10  = false;
	AjxEnv.isModernIE  = false;
	AjxEnv.isMSEdge = false;
	AjxEnv.isNormalResolution = false;
	AjxEnv.ieScaleFactor = 1;
	AjxEnv.isFirefox = false;
	AjxEnv.isFirefox1up = false;
	AjxEnv.isFirefox1_5up = false;
	AjxEnv.isFirefox3up = false;
	AjxEnv.isFirefox3_6up = false;
	AjxEnv.isFirefox4up = false;
	AjxEnv.isMozilla = false;
	AjxEnv.isMozilla1_4up = false;
	AjxEnv.isSafari = false;
	AjxEnv.isSafari2 = false;
	AjxEnv.isSafari3 = false;
    AjxEnv.isSafari4 = false;
	AjxEnv.isSafari3up = false;
	AjxEnv.isSafari4up = false;
    AjxEnv.isSafari5up = false;
    AjxEnv.isSafari5_1up = false;
	AjxEnv.isSafari6up = false;
	AjxEnv.isCamino = false;
	AjxEnv.isChrome = false;
    AjxEnv.isChrome2up = false;
    AjxEnv.isChrome7 = false;
    AjxEnv.isChrome10up = false;
	AjxEnv.isChrome19up = false;
	AjxEnv.isGeckoBased = false;
	AjxEnv.isWebKitBased = false;
	AjxEnv.isTrident = false;
	AjxEnv.isOpera = false;
	AjxEnv.useTransparentPNGs = false;
	AjxEnv.isDesktop = false;
	AjxEnv.isDesktop2up = false;

    //HTML5
    AjxEnv.supportsHTML5File = false;
	AjxEnv.supportsPlaceholder = false;
    AjxEnv.supportsCSS3RemUnits = false;

	// screen resolution - ADD MORE RESOLUTION CHECKS AS NEEDED HERE:
	AjxEnv.is800x600orLower = screen && (screen.width <= 800 && screen.height <= 600);
    AjxEnv.is1024x768orLower = screen && (screen.width <= 1024 && screen.height <= 768);
};

AjxEnv.parseUA = 
function() {
	AjxEnv.reset();

	var agt = navigator.userAgent.toLowerCase();
	var agtArr = agt.split(" ");
	var isSpoofer = false;
	var isWebTv = false;
	var isHotJava = false;
	var beginsWithMozilla = false;
	var isCompatible = false;
	var isTrident = false;

	if (agtArr != null) {
		var browserVersion;
		var index = -1;

		if ((index = agtArr[0].search(/^\s*mozilla\//))!= -1) {
			beginsWithMozilla = true;
			AjxEnv.browserVersion = parseFloat(agtArr[0].substring(index + 8));
			AjxEnv.isNav = true;
		}

		var token;
		for (var i = 0; i < agtArr.length; ++i) {
			token = agtArr[i];
			if (token.indexOf('compatible') != -1 ) {
				isCompatible = true;
				AjxEnv.isNav = false;
			} else if ((token.indexOf('opera')) != -1) {
				AjxEnv.isOpera = true;
				AjxEnv.isNav = false;
				browserVersion = parseFloat(agtArr[i+1]);
			} else if ((token.indexOf('spoofer')) != -1) {
				isSpoofer = true;
				AjxEnv.isNav = false;
			} else if ((token.indexOf('webtv')) != -1) {
				isWebTv = true;
				AjxEnv.isNav = false;
			} else if ((token.indexOf('hotjava')) != -1) {
				isHotJava = true;
				AjxEnv.isNav = false;
			} else if ((index = token.indexOf('msie')) != -1) {
				AjxEnv.isIE = true;
				browserVersion = parseFloat(agtArr[i+1]);
			} else if ((index = token.indexOf('trident/')) != -1) {
				AjxEnv.isTrident = true;
				AjxEnv.tridentVersion = parseFloat(token.substr(index + 8));
			} else if ((index = token.indexOf('edge/')) != -1) {
				AjxEnv.isMSEdge = true;
				browserVersion = parseFloat(token.substr(index + 5));
				AjxEnv.isSafari = false;
				AjxEnv.isChrome = false;
				AjxEnv.isWebKitBased = false;
			} else if ((index = token.indexOf('gecko/')) != -1) {
				AjxEnv.isGeckoBased = true;
				AjxEnv.geckoDate = parseFloat(token.substr(index + 6));
			} else if ((index = token.indexOf('applewebkit/')) != -1) {
				AjxEnv.isWebKitBased = true;
				AjxEnv.webKitVersion = parseFloat(token.substr(index + 12));
			} else if ((index = token.indexOf('rv:')) != -1) {
				AjxEnv.mozVersion = parseFloat(token.substr(index + 3));
				browserVersion = AjxEnv.mozVersion;
			} else if ((index = token.indexOf('firefox/')) != -1) {
				AjxEnv.isFirefox = true;
				browserVersion = parseFloat(token.substr(index + 8));
			} else if ((index = token.indexOf('prism')) != -1) {
				AjxEnv.isPrism = true;
			} else if ((index = token.indexOf('camino/')) != -1) {
				AjxEnv.isCamino = true;
				browserVersion = parseFloat(token.substr(index + 7));
			} else if ((index = token.indexOf('netscape6/')) != -1) {
				AjxEnv.trueNs = true;
				browserVersion = parseFloat(token.substr(index + 10));
			} else if ((index = token.indexOf('netscape/')) != -1) {
				AjxEnv.trueNs = true;
				browserVersion = parseFloat(token.substr(index + 9));
			} else if ((index = token.indexOf('safari/')) != -1) {
				AjxEnv.isSafari = true;
			} else if ((index = token.indexOf('chrome/')) != -1) {
				AjxEnv.isChrome = true;
				browserVersion = parseFloat(token.substr(index + 7));
			} else if (index = token.indexOf('version/') != -1) {
				// this is how safari sets browser version
				browserVersion = parseFloat(token.substr(index + 7));
			} else if (token.indexOf('windows') != -1) {
				AjxEnv.isWindows = true;
			} else if (token.indexOf('win64') != -1) {
				AjxEnv.isWindows64 = true;
			} else if ((token.indexOf('macintosh') != -1) ||
					   (token.indexOf('mac_') != -1)) {
				AjxEnv.isMac = true;
			} else if (token.indexOf('linux') != -1) {
				AjxEnv.isLinux = true;
			} else if ((index = token.indexOf('zdesktop/')) != -1) {
				AjxEnv.isDesktop = true;
				browserVersion = parseFloat(token.substr(index + 9));
			}
		}
		AjxEnv.browserVersion = browserVersion;

		// Note: Opera and WebTV spoof Navigator. We do strict client detection.
		AjxEnv.isNav 			= (beginsWithMozilla && !isSpoofer && !isCompatible && !AjxEnv.isOpera && !isWebTv && !isHotJava && !AjxEnv.isSafari);
		AjxEnv.isIE				= (AjxEnv.isIE && !AjxEnv.isOpera);
		AjxEnv.isNav4			= (AjxEnv.isNav && (browserVersion == 4) && (!AjxEnv.isIE));
		AjxEnv.isNav6			= (AjxEnv.isNav && AjxEnv.trueNs && (browserVersion >= 6.0 && browserVersion < 7.0));
		AjxEnv.isNav6up 		= (AjxEnv.isNav && AjxEnv.trueNs && (browserVersion >= 6.0));
		AjxEnv.isNav7 			= (AjxEnv.isNav && AjxEnv.trueNs && (browserVersion >= 7.0 && browserVersion < 8.0));
		AjxEnv.isIE3 			= (AjxEnv.isIE && browserVersion <  4.0);
		AjxEnv.isIE4			= (AjxEnv.isIE && browserVersion >= 4.0 && browserVersion < 5.0);
		AjxEnv.isIE4up			= (AjxEnv.isIE && browserVersion >= 4.0);
		AjxEnv.isIE5			= (AjxEnv.isIE && browserVersion >= 5.0 && browserVersion < 6.0);
		AjxEnv.isIE5_5			= (AjxEnv.isIE && browserVersion == 5.5);
		AjxEnv.isIE5up			= (AjxEnv.isIE && browserVersion >= 5.0);
		AjxEnv.isIE5_5up		= (AjxEnv.isIE && browserVersion >= 5.5);
		AjxEnv.isIE6			= (AjxEnv.isIE && browserVersion >= 6.0 && browserVersion < 7.0);
		AjxEnv.isIE6up			= (AjxEnv.isIE && browserVersion >= 6.0);
		AjxEnv.isIE7			= (AjxEnv.isIE && browserVersion >= 7.0 && browserVersion < 8.0);
		AjxEnv.isIE7up			= (AjxEnv.isIE && browserVersion >= 7.0);
		AjxEnv.isIE8			= (AjxEnv.isIE && browserVersion >= 8.0 && browserVersion < 9.0);
		AjxEnv.isIE8up			= (AjxEnv.isIE && browserVersion >= 8.0);
		AjxEnv.isIE9			= (AjxEnv.isIE && browserVersion >= 9.0 && browserVersion < 10.0);
		AjxEnv.isIE9up			= (AjxEnv.isIE && browserVersion >= 9.0);
		AjxEnv.isIE10			= (AjxEnv.isIE && browserVersion >= 10.0 && browserVersion < 11.0);
		// IE11
		AjxEnv.isModernIE	   = (!AjxEnv.isIE && AjxEnv.mozVersion >= 11.0 && AjxEnv.tridentVersion >= 7.0);
		// IE12
		AjxEnv.isModernIE	   = AjxEnv.isModernIE || (!AjxEnv.isIE && AjxEnv.isMSEdge && browserVersion >= 12.0);
		if (AjxEnv.isModernIE) {
			AjxEnv.isSafari = false;
			AjxEnv.isChrome = false;
			AjxEnv.isIE12 = (browserVersion >= 12.0);
		}


		AjxEnv.isMozilla		= ((AjxEnv.isNav && AjxEnv.mozVersion && AjxEnv.isGeckoBased && (AjxEnv.geckoDate != 0)));
		AjxEnv.isMozilla1_4up	= (AjxEnv.isMozilla && (AjxEnv.mozVersion >= 1.4));
		AjxEnv.isFirefox 		= ((AjxEnv.isMozilla && AjxEnv.isFirefox));
		AjxEnv.isFirefox1up		= (AjxEnv.isFirefox && browserVersion >= 1.0);
		AjxEnv.isFirefox1_5up	= (AjxEnv.isFirefox && browserVersion >= 1.5);
		AjxEnv.isFirefox2_0up	= (AjxEnv.isFirefox && browserVersion >= 2.0);
		AjxEnv.isFirefox3up		= (AjxEnv.isFirefox && browserVersion >= 3.0);
		AjxEnv.isFirefox3_5up	= (AjxEnv.isFirefox && browserVersion >= 3.5);
		AjxEnv.isFirefox3_6up	= (AjxEnv.isFirefox && browserVersion >= 3.6);
		AjxEnv.isFirefox4up		= (AjxEnv.isFirefox && browserVersion >= 4.0);
		AjxEnv.isSafari2		= (AjxEnv.isSafari && browserVersion >= 2.0 && browserVersion < 3.0);
		AjxEnv.isSafari3		= (AjxEnv.isSafari && browserVersion >= 3.0 && browserVersion < 4.0) || AjxEnv.isChrome;
        AjxEnv.isSafari4        = (AjxEnv.isSafari && browserVersion >= 4.0);
		AjxEnv.isSafari3up		= (AjxEnv.isSafari && browserVersion >= 3.0) || AjxEnv.isChrome;
		AjxEnv.isSafari4up		= (AjxEnv.isSafari && browserVersion >= 4.0) || AjxEnv.isChrome;
        AjxEnv.isSafari5up	    = (AjxEnv.isSafari && browserVersion >= 5.0) || AjxEnv.isChrome;
        AjxEnv.isSafari5_1up	= (AjxEnv.isSafari && browserVersion >= 5.1) || AjxEnv.isChrome;
		AjxEnv.isSafari6up      = AjxEnv.isSafari && browserVersion >= 6.0;
		AjxEnv.isDesktop2up		= (AjxEnv.isDesktop && browserVersion >= 2.0);
        AjxEnv.isChrome2up		= (AjxEnv.isChrome && browserVersion >= 2.0);
        AjxEnv.isChrome7		= (AjxEnv.isChrome && browserVersion >= 7.0);
        AjxEnv.isChrome10up		= (AjxEnv.isChrome && browserVersion >= 10.0);
		AjxEnv.isChrome19up		= (AjxEnv.isChrome && browserVersion >= 19.0);

		AjxEnv.browser = "[unknown]";
		if (AjxEnv.isOpera) 				{	AjxEnv.browser = "OPERA";	}
		else if (AjxEnv.isChrome)			{	AjxEnv.browser = "GC" + browserVersion;	}
		else if (AjxEnv.isSafari)			{	AjxEnv.browser = "SAF" + browserVersion; }
		else if (AjxEnv.isCamino)			{	AjxEnv.browser = "CAM";		}
		else if (isWebTv)					{	AjxEnv.browser = "WEBTV";	}
		else if (isHotJava)					{	AjxEnv.browser = "HOTJAVA";	}
		else if (AjxEnv.isFirefox)			{	AjxEnv.browser = "FF" + browserVersion; }
		else if (AjxEnv.isPrism)			{	AjxEnv.browser = "PRISM";	}
		else if (AjxEnv.isNav7)				{	AjxEnv.browser = "NAV7";	}
		else if (AjxEnv.isNav6)				{	AjxEnv.browser = "NAV6";	}
		else if (AjxEnv.isNav4)				{	AjxEnv.browser = "NAV4";	}
		else if (AjxEnv.isIE)				{	AjxEnv.browser = "IE" + browserVersion; }
		else if (AjxEnv.isModernIE)			{	AjxEnv.browser = "IE" + browserVersion; }
		else if (AjxEnv.isDesktop)			{	AjxEnv.browser = "ZD" + browserVersion; }

		AjxEnv.platform = "[unknown]";
		if (AjxEnv.isWindows)				{	AjxEnv.platform = "Win";	}
		else if (AjxEnv.isMac)				{	AjxEnv.platform = "Mac";	}
		else if (AjxEnv.isLinux)			{	AjxEnv.platform = "Linux";	}
	}

	// setup some global setting we can check for high resolution
	if (AjxEnv.isIE) {
		AjxEnv.isNormalResolution = true;
		AjxEnv.ieScaleFactor = screen.deviceXDPI / screen.logicalXDPI;
		if (AjxEnv.ieScaleFactor > 1) {
			AjxEnv.isNormalResolution = false;
		}
	}

	AjxEnv._inited = !AjxEnv.isIE;

	// test for safari nightly
	if (AjxEnv.isSafari) {
		var webkit = AjxEnv.getWebkitVersion();
		AjxEnv.isSafariNightly = (webkit && webkit['is_nightly']);
		// if not safari v3 or the nightly, assume we're dealing with v2  :/
		AjxEnv.isSafari2 = !AjxEnv.isSafari3 && !AjxEnv.isSafariNightly;
	}

    //HTML5
    AjxEnv.supportsHTML5File = !!( window.FileReader || AjxEnv.isChrome || AjxEnv.isSafari6up );
    AjxEnv.supportsPlaceholder 	= 'placeholder' in document.createElement('INPUT');

    try {
        // IE8 doesn't support REM units
        var div = document.createElement('div');
        div.style.fontSize = '1rem';
        AjxEnv.supportsCSS3RemUnits = (div.style.fontSize == '1rem');
    } catch (e) {
        AjxEnv.supportsCSS3RemUnits = false;
    }
};

// code provided by webkit authors to determine if nightly browser
AjxEnv.getWebkitVersion =
function() {

	var webkit_version;
	var regex = new RegExp("\\(.*\\) AppleWebKit/(.*) \\((.*)");
	var matches = regex.exec(navigator.userAgent);
	if (matches) {
		var version = matches[1];
		var bits = version.split(".");
		var is_nightly = (version[version.length - 1] == "+");
		var minor = is_nightly ? "+" : parseInt(bits[1]);
		// If minor is Not a Number (NaN) return an empty string
		if (isNaN(minor)) minor = "";

		webkit_version = {major:parseInt(bits[0]), minor:minor, is_nightly:is_nightly};
	}
	return webkit_version || {};
};


AjxEnv.parseUA();

AjxEnv.isOfflineSupported = (AjxEnv.isFirefox || AjxEnv.isChrome) && AjxEnv.supported.localstorage && AjxEnv.supported.applicationcache && AjxEnv.supported.indexeddb && AjxEnv.supported.template;

/**
 * This should be a temporary hack as we transition from AjxCallback to bind(). Rather
 * than change hundreds of call sites with 'callback.run()' to see if the callback is
 * an AjxCallback or a closure, add a run() method to Function which just invokes the
 * closure.
 */
Function.prototype.run = function() {
	return this.apply(this, arguments);
};

/**
 * Polyfill for String.startsWith -- currently required by Safari, Opera, and IE.
 */
if (typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};
}

/**
 * Polyfill for Array.prototype.some -- currently only required by IE8.
 *
 * From Mozilla:
 * https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/some
 */
if (!Array.prototype.some) {
	// Production steps of ECMA-262, Edition 5, 15.4.4.17
	// Reference: http://es5.github.io/#x15.4.4.17
	Array.prototype.some = function(fun/*, thisArg*/) {
		'use strict';

		if (this == null) {
			throw new TypeError('Array.prototype.some called on null or undefined');
		}

		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;

		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t && fun.call(thisArg, t[i], i, t)) {
				return true;
			}
		}

		return false;
	};
}
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
 * Creates a callback which consists of at least a function reference, and possibly also
 * an object to call it from.
 * @constructor
 * @class
 * This class represents a callback function which can be called standalone, or from a
 * given object. What the callback takes as arguments and what it returns are left to the
 * client.
 *
 * @author Conrad Damon
 * 
 * @param {object}	obj		the object to call the function from
 * @param {function}	func	the callback function
 * @param {array}	args   the default arguments
 * 
 */
AjxCallback = function(obj, func, args) {
	if (arguments.length == 0) return;

    if (typeof arguments[0] == "function") {
        this.obj = null;
        this.func = arguments[0];
        this.args = arguments[1];
    }
    else {
        this.obj = obj;
        this.func = func;
        this.args = args;
    }
};

AjxCallback.prototype.isAjxCallback = true;
AjxCallback.prototype.toString = function() { return "AjxCallback"; }

AjxCallback.NOP = new AjxCallback(function(){});

/**
 * Runs the callback function, from within the object if there is one. The
 * called function passed arguments are the concatenation of the argument
 * array passed to this object's constructor and the argument array passed
 * to the <code>run</code> method. Whatever the called function returns is
 * returned to the caller.
 *
 * @param {array}	[arg1..argN]	the first argument which will be appended to the argument
 *				array passed to this object's constructor. Any number of
 *				arguments may be passed to the <code>run</code> method.
 */
AjxCallback.prototype.run =
function(/* arg1 ... argN */) {
	// combine original args with new ones
	var args = [];

	// sometimes we want to pass a null or false argument, so simply
	// checking for if (this.args) won't do.
	if (typeof this.args != "undefined") {
		if (this.args!==null && this.args instanceof Array) { // IE mysteriously screws up the instanceof test if this.args is null
			// NOTE: We must NOT use this.args directly if this method's
			//       params are gonna be pushed onto the array because it
			//       will change the original args!
			args = arguments.length > 0 ? args.concat(this.args) : this.args;
		} else {
			args.push(this.args);
		}
	}

	for (var i = 0; i < arguments.length; ++i) {
		args.push(arguments[i]);
	}

	// invoke function
	if (this.func) {
        return this.func.apply(this.obj || window, args);
	}
};

/**
 * This version of {@link AjxCallback.run} is here for {@link AjxDispatcher}, because it has a <code>run()</code>
 * method in which it marshals arguments into an array. That leads to a problem
 * in which the arguments are marshalled twice, so that by the time AjxDispatcher
 * calls <code>callback.run(args)</code>, the args have already been collected into an array.
 * Then when the function is invoked, it gets passed an actual array instead of the
 * intended arg list. Calling <code>callback.run.apply(callback, args)</code> works on Firefox,
 * but IE throws the error "Object expected", so we do this instead.
 *
 * @param	{array}	argList	 an array of arguments and treats them as an argument list, instead of as a single argument
 * 
 * @private
 */
AjxCallback.prototype.run1 =
function(argList) {
	// combine original args with new ones
	var args = [];

	// sometimes we want to pass a null or false argument, so simply
	// checking for if (this.args) won't do.
	if (typeof this.args != "undefined") {
		if (this.args!==null && this.args instanceof Array) {
			// NOTE: We must NOT use this.args directly if this method's
			//       params are gonna be pushed onto the array because it
			//       will change the original args!
			args = arguments.length > 0 ? args.concat(this.args) : this.args;
		} else {
			args.push(this.args);
		}
	}

	if (argList && argList.length) {
		for (var i = 0; i < argList.length; ++i) {
			args.push(argList[i]);
		}
	}

	// invoke function
	if (this.func) {
		return this.func.apply(this.obj || window, args);
	}
};

/**
 * This method returns a plain function that will call your supplied "func" in the context
 * of "obj" and pass to it, in this order, any additional arguments that you
 * pass to <code>simpleClosure</code> and the arguments that were passed to it at the call
 * time.
 *
 * <p>
 * An example should do:
 *
 * <pre>
 *   div.onclick = AjxCallback.simpleClosure(this.handler, this, "some data");
 *   ...
 *   this.handler = function(data, event) {
 *      // event will be passed for DOM2 compliant browsers
 *      // and data is "some data"
 *   };
 * </pre>
 * 
 * @param	{function}	func		the function
 * @param	{object}	obj			the object to call the function from
 * @param	{array}	[arg1...argN]		any number of arguments
 */
AjxCallback.simpleClosure = function(func, obj) {
	var args = [];
	for (var i = 2; i < arguments.length; ++i)
		args.push(arguments[i]);
	return function() {
		var args2 = [];
		for (var i = 0; i < arguments.length; ++i)
			args2.push(arguments[i]);
		return func.apply(obj || this, args.concat(args2));
	};
};

AjxCallback.returnFalse = function() { return false; };

AjxCallback.isNull = function(x) { return x == null; };
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
 * Minimal wrapper around XHR, with no dependencies.
 * 
 * @author Andy Clark
 * 
 * @private
 */
AjxLoader = function() {}

//
// Data
//

AjxLoader.__createXHR;

if (window.XMLHttpRequest) {
    AjxLoader.__createXHR = function() { return new XMLHttpRequest(); };
}
else if (window.ActiveXObject) {
    (function(){
        var vers = ["MSXML2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i = 0; i < vers.length; i++) {
            try {
                new ActiveXObject(vers[i]);
                AjxLoader.__createXHR = function() { return new ActiveXObject(vers[i]); };
                break;
            }
            catch (e) {
                // ignore
            }
        }
    })();
}

//
// Static functions
//

/**
 * This function uses XHR to load and return the contents at an arbitrary URL.
 * <p>
 * It can be called with either a URL string or a parameters object.
 *
 * @param	{hash}		urlOrParams			a hash of parameters
 * @param {string}	urlOrParams.url       the URL to load
 * @param {string}	[urlOrParams.method]    the load method (e.g. "GET").
 *                                  If this parameter is not specified, then
 *                                  the value is determined by whether content
 *                                  has been specified: "POST" if specified,
 *                                  "GET" otherwise.
 * @param {hash}	[urlOrParams.headers]  the map of request headers to set.
 * @param {boolean}	[urlOrParams.async]     determines whether the request
 *                                  is asynchronous or synchronous. If this
 *                                  parameter is not specified, then the value
 *                                  is determined by whether a callback has
 *                                  been specified: async if a callback is
 *                                  specified, sync if no callback.
 * @param {string}	[urlOrParams.content]   the content to POST to URL. If not specified, the request method is GET.
 * @param {string}	[urlOrParams.userName]  the username of the request.
 * @param {string}	[urlOrParams.password]  the password of the request.
 * @param {AjxCallback}	[urlOrParams.callback]  the callback to run at end of load.
 */
AjxLoader.load = function(urlOrParams) {
    var params = urlOrParams;
    if (typeof urlOrParams == "string") {
        params = { url: urlOrParams };
    }

    var req = AjxLoader.__createXHR();
    var func = Boolean(params.callback) ? function() { AjxLoader._response(req, params.callback); } : null;
    var method = params.method || (params.content != null ? "POST" : "GET");
	
	if (func) {
	    req.onreadystatechange = func;
	}
    var async = params.async != null ? params.async : Boolean(func);
    req.open(method, params.url, async, params.userName, params.password);
    for (var name in params.headers) {
        req.setRequestHeader(name, params.headers[name]);
    }
    req.send(params.content || "");

    return req;
};

AjxLoader._response = function(req, callback) {
    if (req.readyState == 4) {
        callback.run(req);
    }
};
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
 * This class is a collection of functions for defining packages and
 * loading them dynamically.
 * 
 * @author Andy Clark
 * 
 * @private
 */
AjxPackage = function() {}

//
// Constants
//

/**
 * Defines the "XHR SYNC" method.
 */
AjxPackage.METHOD_XHR_SYNC = "xhr-sync";
/**
 * Defines the "XHR ASYNC" method.
 */
AjxPackage.METHOD_XHR_ASYNC = "xhr-async";
/**
 * Defines the "SCRIPT TAG" method.
 */
AjxPackage.METHOD_SCRIPT_TAG = "script-tag";

AjxPackage.DEFAULT_SYNC = AjxPackage.METHOD_XHR_SYNC;
AjxPackage.DEFAULT_ASYNC = AjxEnv.isIE ? AjxPackage.METHOD_XHR_ASYNC : AjxPackage.METHOD_SCRIPT_TAG;

//
// Data
//

AjxPackage._packages = {};
AjxPackage._extension = ".js";

AjxPackage.__depth = 0;
AjxPackage.__scripts = [];
AjxPackage.__data = {};

//
// Static functions
//

/**
 * Sets the base path.
 * 
 * @param	{string}	basePath		the base path
 */
AjxPackage.setBasePath = function(basePath) {
    AjxPackage._basePath = basePath;
};
/**
 * Sets the extension.
 * 
 * @param	{string}	extension		the extension
 */
AjxPackage.setExtension = function(extension) {
    AjxPackage._extension = extension;
};
/**
 * Sets the query string.
 * 
 * @param	{string}	queryString		the query string
 */
AjxPackage.setQueryString = function(queryString) {
    AjxPackage._queryString = queryString;
};

/**
 * Checks if the specified package has been defined.
 * 
 * @param	{string}	name		the package name
 * @return	{boolean}	<code>true</code> if the package is defined
 */
AjxPackage.isDefined = function(name) {
	return Boolean(AjxPackage._packages[name]);
};

/**
 * Defines a package and returns true if this is the first definition.
 * 
 * @param	{string}	name		the package name
 * @return	{boolean}	<code>true</code> if this is the first package definition
 */
AjxPackage.define = function(name) {
    AjxPackage.__log("DEFINE "+name, "font-weight:bold;font-style:italic");
    name = AjxPackage.__package2path(name);
    if (!AjxPackage._packages[name]) {
        AjxPackage._packages[name] = true;
        return true;
    }
    return false;
};

/**
 * Undefines a package.
 * 
 * @param	{string}	name		the package name
 */
AjxPackage.undefine = function(name) {
    AjxPackage.__log("UNDEFINE "+name, "font-weight:bold;font-style:italic");
    name = AjxPackage.__package2path(name);
    if (AjxPackage._packages[name]) {
        delete AjxPackage._packages[name];
    }
};

/**
 * This function ensures that the specified module is loaded and available
 * for use. If already loaded, this function returns immediately. If not,
 * then this function will load the necessary code, either synchronously
 * or asynchronously depending on whether the <tt>callback</tt> or
 * <tt>forceSync</tt> parameters are specified.
 * <p>
 * It can be called with either a package name string or a parameters object.
 *
 * @param	{hash}		nameOrParams		a hash of parameters
 * @param {string}	name      		the package name
 * @param {string}	[basePath]	the base path of URL to load. If
 *                                  not specified, uses the global base path.
 * @param {string}	[extension] 	the filename extension of URL to
 *                                  load. If not specified, uses the global
 *                                  filename extension.
 * @param {string}	[queryString] the query string appended to URL.
 *                                  If not specified, uses the global query
 *                                  string.
 * @param {string}	[userName]  The username of the request
 * @param {string}	[password]  The password of the request
 * @param {AjxCallback}	[callback] the callback to run
 * @param {constant}	[method]    	the loading method for the package (see <code>METHOD_*</code> constants)
 * @param {boolean}	[forceSync] 	overrides the load mode (if
 *                                  this method is called during an async
 *                                  load) and forces the requested package to
 *                                  be loaded synchronously.
 * @param {boolean}	[forceReload=false]    specifies whether the package is reloaded even if already defined
 */
AjxPackage.require = function(nameOrParams) {
    var params = nameOrParams;
    if (typeof nameOrParams == "string") {
        params = { name: nameOrParams };
    }

    // is an array of names specified?
    var array = params.name;
    if (array instanceof Array) {
        // NOTE: This is to avoid a silent problem: when the caller expects
        //       the array of names to be left unchanged upon return. Because
        //       we call <code>shift</code> on the array, it modifies the
        //       original list so the caller would see an empty array after
        //       calling this function.
        if (!array.internal) {
            array = [].concat(array);
            array.internal = true;
            params.name = array;
        }

        var name = array.shift();

        // if more names, use callback to trigger next
        if (array.length > 0) {
            var ctor = new Function();
            ctor.prototype = params;
            ctor.prototype.constructor = ctor;

            var nparams = new ctor();
            nparams.name = name;
            nparams.callback = new AjxCallback(null, AjxPackage.__requireNext, params);

            AjxPackage.require(nparams);
            return;
        }

        // continue
        params.name = name;
    }

    // see if it's already loaded
    var oname = params.name;
    var name = AjxPackage.__package2path(oname);

    var callback = params.callback;
    if (typeof callback == "function") {
        callback = new AjxCallback(callback);
    }
    var cb = callback ? " (callback)" : "";
    var loaded = AjxPackage._packages[name] ? " LOADED" : "";
    var mode = AjxPackage.__scripts.length ? " (async, queueing...)" : "";
    AjxPackage.__log(["REQUIRE \"",oname,"\"",cb,loaded,mode].join(""));

    var reload = params.forceReload != null ? params.forceReload : false;
    if (AjxPackage._packages[name] && !reload) {
        if (callback) {
            callback.run();
        }
        return;
    }

    // assemble load url
    var basePath = params.basePath || AjxPackage._basePath || window.contextPath;
    var extension = params.extension || AjxPackage._extension;
    var queryString = params.queryString || AjxPackage._queryString;

    var pathParts = [basePath, "/", name, extension];
    if (queryString) {
        pathParts.push("?",queryString);
    }
    var path = pathParts.join("");

    // load
    var method = params.method || (params.callback ? AjxPackage.DEFAULT_ASYNC : AjxPackage.DEFAULT_SYNC);

    var isSync = method == AjxPackage.METHOD_XHR_SYNC || params.forceSync;
    var isAsync = !isSync;

    var data = {
        name: name,
        path: path,
        method: method,
        async: isAsync,
        callback: callback || AjxCallback.NOP,
        scripts: isAsync ? [] : null
    };

    if (isSync || AjxPackage.__scripts.length == 0) {
        AjxPackage.__doLoad(data);
    }
    else {
        var current = AjxPackage.__scripts[AjxPackage.__scripts.length - 1];
        data.method = current.method;
        data.async = current.async;
        data.scripts = [];
        if (callback) {
            // NOTE: This code is here to protect against interleaved async
            //       requests. If a second async request is made before the
            //       the first one is completely processed, the second request
            //       is added to the first request's stack and is processed
            //       as normal. This prevents the second request's callback
            //       from being called. Therefore, we chain the new callback
            //       to the original callback to ensure that they both get
            //       called.
            var top = AjxPackage.__scripts[0];
            top.callback = new AjxCallback(AjxPackage.__chainCallbacks, [top.callback, callback]);
            data.callback = AjxCallback.NOP;
        }
        current.scripts.push(data);
    }
};

AjxPackage.eval = function(text) {
    // eval in global scope (IE)
    if (window.execScript) {
        // NOTE: for IE
        window.execScript(text);
    }
    // eval in global scope (FF, Opera, WebKit)
    else if (AjxEnv.indirectEvalIsGlobal) {
        var evl=window.eval;
        evl(text);
    }
    // insert script tag into head
    // Note: if any scripts are still loading, this will not run immediately!
    else {
        var e = document.createElement("SCRIPT");
        var t = document.createTextNode(text);
        e.appendChild(t);

        var heads = document.getElementsByTagName("HEAD");
        if (heads.length == 0) {
            // NOTE: Safari doesn't automatically insert <head>
            heads = [ document.createElement("HEAD") ];
            document.documentElement.appendChild(heads[0]);
        }
        heads[0].appendChild(e);
    }
};

//
// Private functions
//

AjxPackage.__package2path = function(name) {
    return name.replace(/\./g, "/").replace(/\*$/, "__all__");
};

AjxPackage.__requireNext = function(params) {
    // NOTE: Both FF and IE won't eval the next loaded code unless we
    //       first return to the UI loop. So we use a timeout to kick
    //       off the next load.
    var func = AjxCallback.simpleClosure(AjxPackage.require, null, params);
    setTimeout(func, AjxEnv.isIE ? 10 : 0);
};

AjxPackage.__doLoad = function(data) {
    if (data.async) {
        AjxPackage.__doAsyncLoad(data);
    }
    else {
        AjxPackage.__doXHR(data);
    }
};

AjxPackage.__doAsyncLoad = function(data, force) {
    AjxPackage.__data[name] = data;
    if (force || AjxPackage.__scripts.length == 0) {
        AjxPackage.__scripts.push(data);
        if (data.method == AjxPackage.METHOD_SCRIPT_TAG) {
            AjxPackage.__doScriptTag(data);
        }
        else {
            AjxPackage.__doXHR(data);
        }
    }
    else {
        var current = AjxPackage.__scripts[AjxPackage.__scripts.length - 1];
        current.scripts.push(data);
    }
};

AjxPackage.__doScriptTag = function(data) {
    // create script element
    var script = document.createElement("SCRIPT");
    script.type = "text/javascript";
    script.src = data.path;

    // attach handler
    if (script.attachEvent) {
        var handler = AjxCallback.simpleClosure(AjxPackage.__onAsyncLoadIE, null, script);
        script.attachEvent("onreadystatechange", handler);
    }
    else if (script.addEventListener) {
        var handler = AjxCallback.simpleClosure(AjxPackage.__onAsyncLoad, null, data.name);
        script.addEventListener("load", handler, true);
    }

    // insert element
    var heads = document.getElementsByTagName("HEAD");
    if (!heads || heads.length == 0) {
        // NOTE: Safari doesn't automatically insert <head>
        heads = [ document.createElement("HEAD") ];
        document.documentElement.appendChild(heads[0]);
    }
    heads[0].appendChild(script);
};

AjxPackage.__doXHR = function(data) {
    var callback = data.async ? new AjxCallback(null, AjxPackage.__onXHR, [data]) : null;
    var loadParams = {
        url: data.path,
        userName: data.userName,
        password: data.password,
        async: data.async,
        callback: callback
    };
    var req = AjxLoader.load(loadParams);
    if (!data.async) {
        AjxPackage.__onXHR(data, req);
    }
};

AjxPackage.__onXHR = function(data, req) {
    // evaluate source
    if (req.status == 200 || req.status == 0) {
        AjxPackage.__requireEval(req.responseText || "");
    }
    else {
        AjxPackage.__log("error: "+req.status, "background-color:red");
    }

    // continue
    if (data.async) {
        AjxPackage.__onAsyncLoad();
    }
    else {
        AjxPackage.__onLoad(data);
    }
};

AjxPackage.__onAsyncLoadIE = function(script) {
    if (script.readyState == 'loaded') {
        AjxPackage.__onAsyncLoad();
    }
};

AjxPackage.__onAsyncLoad = function() {
    var current;
    while (current = AjxPackage.__scripts.pop()) {
        // push next scope
        if (current.scripts.length) {
            // NOTE: putting the current back on the stack before adding new scope
            AjxPackage.__scripts.push(current);
            current = current.scripts.shift()
            AjxPackage.__scripts.push(current);
            AjxPackage.__doAsyncLoad(current, true);
            return;
        }
        AjxPackage.__onLoad(current);
    }
};

AjxPackage.__onLoad = function(data) {
    AjxPackage.define(data.name);
    if (data.callback) {
        try {
            data.callback.run();
        }
        catch (e) {
            AjxPackage.__log("error on callback: "+e,"color:red");
        }
    }
};

AjxPackage.__requireEval = function(text) {
    AjxPackage.__depth++;
    try {
        AjxPackage.eval(text);
    }
    catch (e) {
        AjxPackage.__log("error on eval: "+e,"color:red");
		if (window.console && window.console.log) {
			console.log("Error on eval : " +e);
		}
    }
    AjxPackage.__depth--;
};

/***
AjxPackage.__win = open("about:blank", "AjxPackageLog"+(new Date().getTime()));
AjxPackage.__win.document.write("<h3>AjxPackage Log</h3>");

AjxPackage.__log = function(s, style) {
    // AjxDebug
//    if (!window.AjxDebug) {
//        var msgs = AjxPackage.__msgs || (AjxPackage.__msgs = []);
//        msgs.push(s);
//        return;
//    }
//
//    if (AjxPackage.__msgs) {
//        AjxPackage.__DBG = new AjxDebug(AjxDebug.DBG1, "AjxPackage");
//        for (var i = 0; i < AjxPackage.__msgs.length; i++) {
//            AjxPackage.__DBG.println(AjxDebug.DBG1, AjxPackage.__msgs[i]);
//        }
//        delete AjxPackage.__msgs;
//    }
//    AjxPackage.__DBG.println(AjxDebug.DBG1, s);

    // new window
    var doc = AjxPackage.__win.document;
    var div = doc.createElement("DIV");
    style = ["padding-left:",AjxPackage.__depth,"em;",style||""].join("");
    div.setAttribute("style", style);
    div.innerHTML = s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
    doc.body.appendChild(div);    
};
/***
AjxPackage.__log = function(s, style) {
    console.log(s);
};
/***/
AjxPackage.__log = function(s, style) {
	// NOTE: This assumes a debug window has been created and assigned
	//       to the global variable "DBG".
//	if (window.DBG) { DBG.println(AjxDebug.DBG1, "PACKAGE: " + s); }
//	if (window.console) { console.log(s); }
}
/***/

AjxPackage.__alertStack = function(title) {
    var a = [];
    if (title) a.push(title, "\n\n");
    for (var i = AjxPackage.__scripts.length - 1; i >= 0; i--) {
        var script = AjxPackage.__scripts[i];
        a.push(script.name," (",Boolean(script.callback),")","\n");
        if (script.scripts) {
            for (var j = 0; j < script.scripts.length; j++) {
                var subscript = script.scripts[j];
                a.push("  ",subscript.name," (",Boolean(subscript.callback),")","\n");
            }
        }
    }
    alert(a.join(""));
};

AjxPackage.__chainCallbacks = function(callback1, callback2) {
    if (callback1) callback1.run();
    if (callback2) callback2.run();
};
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
 * Default constructor.
 * @constructor
 * @class
 * This class contains utility functions for using templates.
 * 
 * @author Andy Clark
 */
AjxTemplate = function() {};

//
// Data
//

AjxTemplate._templates = {};
AjxTemplate._stack = [];

//
// Public functions
//

/**
 * Sets the base path.
 * 
 * @param	{string}	basePath		the base path
 */
AjxTemplate.setBasePath = function(basePath) {
    AjxTemplate._basePath = basePath;
};
/**
 * Sets the extension.
 * 
 * @param	{string}	extension		the extension
 */
AjxTemplate.setExtension = function(extension) {
    AjxTemplate._extension = extension;
};

AjxTemplate.register = function(name, func, params, authoritative) {
    if (!authoritative && AjxTemplate._templates[name] &&
        AjxTemplate._templates[name].authoritative) {
        return;
    }
    AjxTemplate._templates[name] = {
        name: name, func: func, params: params || {}, authoritative: authoritative 
    };
};

AjxTemplate.getTemplate = function(name) {
    var template = AjxTemplate._templates[name];
    return template && template.func;
};

AjxTemplate.getParams = function(name) {
    var template = AjxTemplate._templates[name];
    return template && template.params;
};

/**
 * Expands the template.
 * 
 * @param	{string}		name		the template name
 * @param	{array}			[data]		the template date
 * @param	{array}			[buffer]	the buffer to use for template content
 * @return	{string}	the template content		
 */
AjxTemplate.expand = function(name, data, buffer) {
	// allow template text to come from document
	if (!AjxTemplate._templates[name] && AjxTemplate.compile) {
		var el = document.getElementById(name);
		if (el) {
			// NOTE: In all major browsers (IE, FF, Saf) the value property
			//       of the textarea will be the literal text of the content.
			//       Using the innerHTML will escape the HTML content which
			//       is not desirable.
			var isTextArea = el.nodeName.toUpperCase() == "TEXTAREA";
			AjxTemplate.compile(name, true, true, isTextArea ? el.value : el.innerHTML);
		}
	}

    var pkg = AjxTemplate.__name2Package(name);
    var id = name.replace(/^[^#]*#?/, "");
    if (id) {
        name = [pkg, id].join("#");
    }

    AjxTemplate.require(pkg);

    var hasBuffer = Boolean(buffer);
    buffer = buffer || [];
    var func = AjxTemplate.getTemplate(name);
    if (func) {
        try {
            AjxTemplate._stack.push(pkg);
            var params = AjxTemplate.getParams(name);
            func(name, params, data, buffer);
	    }
        catch (e) {
	    	buffer.push(this.__formatError(name, e));
	    }
        finally {
            AjxTemplate._stack.pop();
        }
    } else {
    	buffer.push(this.__formatError(name, "template not found"));
    }

    return hasBuffer ? buffer.length : buffer.join("");
};

/**
 * Force load of template.
 * 
 * @return <code>true</code> if the template is defined
 * 
 * @private
 */
AjxTemplate.require = function(name) {
	AjxPackage.require({
		name: AjxTemplate.__name2Package(name),
		basePath: AjxTemplate._basePath,
		extension: AjxTemplate._extension
	});
	return AjxTemplate.getTemplate(name) != null;
};

// set innerHTML of a DOM element with the results of a template expansion
// TODO: have some sort of actual error reporting
AjxTemplate.setContent = function(element, name, data) {
	if (typeof element == "string") {
		element = document.getElementById(element);
	}
	if (element == null) return;
	var html = AjxTemplate.expand(name, data);
	element.innerHTML = html;
};

AjxTemplate.__name2Package = function(name) {
	var pkg = name.replace(/#.*$/, "");
	if (name.match(/^#/) && AjxTemplate._stack.length > 0) {
	    pkg = AjxTemplate._stack[AjxTemplate._stack.length - 1];
	}
	return pkg;
};

// temporary API for handling logic errors in templates
//	may change to more robust solution later
AjxTemplate.__formatError = function(templateName, error) {
	return "Error in template '" + templateName + "': " + error;	
};
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
 * @author Andy Clark
 * 
 * @private
 */
AjxTemplate.compile = function(pkg, authoritative, define, templateText) {
	var name = AjxPackage.__package2path(pkg);
	var lines = templateText != null ? templateText : AjxLoader.load(name).reponseText;
	var buffer = [], offset = 0, first = true;

	AjxTemplate.__RE_TEMPLATE.lastIndex = 0;
	var m = AjxTemplate.__RE_TEMPLATE.exec(lines);
	if (m) {
		do {
			var attrs = AjxTemplate.__parseAttrs(m[1]);
			var body = m[2];
			if (attrs["xml:space"] != "preserve") {
                // bug 47973: IE doesn't support String.prototype.trim
                // NOTE: This was caused when the Java TemplateCompiler class was ported.
                body = body.replace(AjxTemplate.__RE_GT_LINESEP_LT, "><").replace(/^\s+|\s+$/,"");
			}

			var packageId = pkg;
			var templateId = attrs.id;
			// NOTE: Template ids can be specified absolutely (i.e.
			//       overriding the default package) if the id starts
			//       with a forward slash (/), or if the id contains
			//       a hash mark (#). This allows a template file to
			//       override both types of template files (i.e. a
			//       single template per file or multiple templates
			//       per file).
			if (templateId && (templateId.indexOf('#') != -1 || templateId.match(/^\//))) {
				if (templateId.indexOf('#') == -1) {
					templateId += "#";
				}
				packageId = templateId.replace(/#.*$/, "").replace(/^\//,"").replace(/\//g,'.');
				templateId = templateId.replace(/^.*#/, "");
			}
			var id = templateId ? packageId+"#"+templateId : packageId;

			var func = AjxTemplate.__convertLines(body);
			AjxTemplate.register(id, func, attrs, authoritative);

			if (first && define) {
				AjxPackage.define(packageId);
			}
			if (first) {
				first = false;
				AjxTemplate.register(packageId, func, attrs, authoritative);
			}
		} while (m = AjxTemplate.__RE_TEMPLATE.exec(lines));
	}
	else {
		if (define) {
			AjxPackage.define(pkg);
		}
		var func = AjxTemplate.__convertLines(lines);
		AjxTemplate.register(pkg, func, {}, authoritative);
	}
};

// template compilation utility

AjxTemplate.__RE_REPLACE = new RegExp([ "\\$\\{(.+?)\\}", "<\\$=(.+?)\\$>", "<\\$(.+?)\\$>" ].join("|"), "mg");
AjxTemplate.__RE_TEMPLATE = new RegExp("<template(.*?)>(.*?)</template>", "mg");
AjxTemplate.__RE_ATTR = new RegExp("\\s*(\\S+)\\s*=\\s*('[^']*'|\"[^\"]*\")", "mg");
AjxTemplate.__RE_PARAM_PART = new RegExp("([^\\(\\.]+)(\\(.*?\\))?\\.?", "g");
AjxTemplate.__RE_GT_LINESEP_LT = new RegExp([">", "\\s*\\n+\\s*", "<"].join(""), "mg");

AjxTemplate.__convertLines = function(lines) {
	var buffer = [], offset = 0;

	buffer[offset++] = "\tvar _hasBuffer = Boolean(buffer);";
	buffer[offset++] = "\tdata = (typeof data == \"string\" ? { id: data } : data) || {};";
	buffer[offset++] = "\tbuffer = buffer || [];";
	buffer[offset++] = "\tvar _i = buffer.length;";
	buffer[offset++] = "\n";

	AjxTemplate.__RE_REPLACE.lastIndex = 0;
	var m = AjxTemplate.__RE_REPLACE.exec(lines);
	if (m) {
		var head = 0;
		do {
			var tail = AjxTemplate.__RE_REPLACE.lastIndex - m[0].length;
			if (head < tail) {
				AjxTemplate.__printStringLines(buffer, lines.substring(head, tail));
			}
			var param = m[1];
			var inline = m[2];
			if (param) {
				offset = AjxTemplate.__printDataLine(buffer, param);
			}
			else if (inline) {
				offset = AjxTemplate.__printBufferLine(buffer, inline);
			}
			else {
				offset = AjxTemplate.__printLine(buffer, "\t", m[3].replace(/\n/g, "\n\t"), "\n");
			}
			head = AjxTemplate.__RE_REPLACE.lastIndex;
		} while (m = AjxTemplate.__RE_REPLACE.exec(lines));
		if (head < lines.length) {
			offset = AjxTemplate.__printStringLines(buffer, lines.substring(head));
		}
	}
	else {
		offset = AjxTemplate.__printStringLines(buffer, lines);
	}
	buffer[offset++] = "\n";

	buffer[offset++] = "\treturn _hasBuffer ? buffer.length : buffer.join(\"\");";

	return new Function("name,params,data,buffer",buffer.join(""));
};

AjxTemplate.__parseAttrs = function(s) {
	var attrs = {}, m;
	AjxTemplate.__RE_ATTR.lastIndex = 0;
	while (m = AjxTemplate.__RE_ATTR.exec(s)) {
		var value = m[2];
		attrs[m[1]] = value.substring(1, value.length - 1);
	}
	return attrs;
};

AjxTemplate.__printLine = function(buffer, s1 /* ..., sN */) {
	var offset = buffer.length;
	for (var i = 1; i < arguments.length; i++) {
		buffer[offset++] = arguments[i];
	}
	return offset;
};

AjxTemplate.__printStringLines = function(buffer, s1 /* ..., sN */) {
	var offset = buffer.length;
	for (var j = 1; j < arguments.length; j++) {
		var s = arguments[j];
		var lines = s.split("\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			offset = AjxTemplate.__printStringLine(buffer, line, i < lines.length - 1 ? "\n" : "");
		}
	}
	return offset;
};

AjxTemplate.__printStringLine = function(buffer, s1 /* ..., sN */) {
	var offset = buffer.length;
	buffer[offset++] = "\tbuffer[_i++] = \"";
	for (var i = 1; i < arguments.length; i++) {
		offset = AjxTemplate.__printEscaped(buffer, arguments[i]);
	}
	buffer[offset++] = "\";";
	return offset;
};

AjxTemplate.__printDataLine = function(buffer, s) {
	var offset = buffer.length, m;
	buffer[offset++] = "\tbuffer[_i++] = data";
	AjxTemplate.__RE_PARAM_PART.lastIndex = 0;
	while (m = AjxTemplate.__RE_PARAM_PART.exec(s)) {
		buffer[offset++] = "[\"";
		buffer[offset++] = m[1];
		buffer[offset++] = "\"]";
		if (m[2] != null) {
			buffer[offset++] = m[2];
		}
	}
	buffer[offset++] = ";";
	return offset;
};

AjxTemplate.__printBufferLine = function(buffer, s1 /* ..., sN */) {
	var offset = buffer.length;
	buffer[offset++] = "\tbuffer[_i++] = ";
	for (var i = 1; i < arguments.length; i++) {
		buffer[offset++] = arguments[i];
	}
	buffer[offset++] = ";";
	return offset;
};

AjxTemplate.__printEscaped = function(buffer, s) {
	var offset = buffer.length;
	buffer[offset++] = s.replace(/\\/g,"\\\\").replace(/"/g,"\\\"").replace('\n',"\\n").replace('\r',"\\r").replace('\t',"\\t");
	return offset;
};
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
 * @class
 * This static class serves as a central location for registering and calling
 * public API methods. For example, the registration of a public API method for
 * pulling up the compose form might look something like this:
 * 
 * <pre>
 * AjxDispatcher.register("Compose", "Mail", new AjxCallback(this, this.doAction));
 * </pre>
 * 
 * and a client call of it like this:
 * 
 * <pre>
 * AjxDispatcher.run("Compose", {action:ZmOperation.NEW_MESSAGE, inNewWindow:false});
 * </pre>
 * 
 * Registration will most likely need to happen in a constructor, when 'this' is
 * available, since you'll most likely want the function call to happen in that
 * object's context.
 * <p>
 * A package can also register a callback to be run once the package has loaded. One use case for
 * that is to register newly-defined classes as drop targets. There is a wrapper method around
 * AjxPackage.require() that will call that method and then run the post-load callback (if any):
 *
 * <pre>
 * AjxDispatcher.require("Calendar");
 * </pre>
 * 
 * @author Conrad Damon
 */
AjxDispatcher = function() {}

// Table of API names, packages, and associated function calls
AjxDispatcher._registry = {};

// Table of package names and callbacks to run after loading (optional)
AjxDispatcher._package = {};

AjxDispatcher._preLoad	= [];
AjxDispatcher._postLoad	= [];
AjxDispatcher._loadFunctionsEnabled	= false;
AjxDispatcher._timedAction = null;

/**
 * Adds a function to be called after the given package has been loaded.
 * 
 * @param {string}	pkg		the name of package
 * @param {AjxCallback}	callback	the callback to run after package has loaded
 */
AjxDispatcher.addPackageLoadFunction =
function(pkg, callback) {
	var pkgData = AjxDispatcher._getPackageData(pkg);
	if (!pkgData._loaded && !AjxPackage.isDefined(pkg)) {
		pkgData.callback.push(callback);
	} else {
		AjxTimedAction.scheduleAction(new AjxTimedAction(callback, callback.run), 0);
	}
};

/**
 * Adds a function to be called while a package is being loaded. A typical use
 * is to display a "Loading..." screen.
 * 
 * @param {AjxCallback}	callback	the callback to run after package has loaded
 */
AjxDispatcher.addPreLoadFunction =
function(callback) {
	AjxDispatcher._preLoad.push(callback);
};

/**
 * Adds a function to be called after a package has been loaded. A typical use
 * is to clear a "Loading..." screen.
 * 
 * @param {AjxCallback}	callback	the callback to run after package has loaded
 */
AjxDispatcher.addPostLoadFunction =
function(callback) {
	AjxDispatcher._postLoad.push(callback);
};

/**
 * @deprecated Use addPackageLoadFunction instead.
 */
AjxDispatcher.setPackageLoadFunction = AjxDispatcher.addPackageLoadFunction;

/**
 * @deprecated Use addPreLoadFunction instead.
 */
AjxDispatcher.setPreLoadFunction = AjxDispatcher.addPreLoadFunction;

/**
 * @deprecated Use addPostLoadFunction instead.
 */
AjxDispatcher.setPostLoadFunction = AjxDispatcher.addPostLoadFunction;

/**
 * Enables/disables the running of the pre/post load functions.
 * 
 * @param {boolean}	enabled		if <code>true</code>, run pre/post load functions
 */
AjxDispatcher.enableLoadFunctions =
function(enable) {
	AjxDispatcher._loadFunctionsEnabled = enable;
};

/**
 * Checks if the given package has been loaded.
 * 
 * @param	{string}	pkg		the name of package
 * @return	{boolean}	<code>true</code> if the package is loaded
 */
AjxDispatcher.loaded =
function(pkg) {
    var pkgData = AjxDispatcher._getPackageData(pkg);
	return (pkgData && pkgData._loaded) || AjxPackage.isDefined(pkg);
};

/**
 * Programmatically sets whether the given packages has been loaded. Use with care!
 * 
 * @param {string}	pkg		the name of package
 * @return	{boolean}	if <code>true</code>, the package is loaded
 */
AjxDispatcher.setLoaded =
function(pkg, loaded) {
	var pkgData = AjxDispatcher._getPackageData(pkg);
	pkgData._loaded = loaded;
	if (loaded) {
		var callbacks = pkgData.callback || [];
		for (var i = 0; i < callbacks.length; i++) {
			callbacks[i].run();
		}
	}
};

/**
 * Registers an API method so that it may be called.
 * 
 * @param {string}	method	the name of the API method
 * @param {string}	pkg		the name of required package(s)
 * @param {AjxCallback}	callback	the callback to run for this API call
 */
AjxDispatcher.registerMethod =
function(method, pkg, callback) {
	AjxDispatcher._registry[method] = {pkg:pkg, callback:callback};
};

/**
 * Calls the given API method with the given arguments. It can be passed any
 * number of arguments (provided after the API name), and they will be passed
 * to the function that gets called.
 * 
 * PS: You are in a maze of twisty callbacks, all alike.
 * 
 * @param {string}	method		the name of the API method
 * @param {boolean}	async			if <code>true</code>, load package asynchronously
 * @param {AjxCallback}	callback		the callback to run with results (must be present
 * 										if there are pre- or post-load functions)
 * @param {boolean}		preLoadOk		if <code>true</code>, okay to run registered pre-load function
 * 
 * @private
 */
AjxDispatcher.run =
function(params /*, arg1 ... argN */) {
	if (!params) { return; }
	var method, noLoad, async, callback, preLoadOk;
	if (typeof(params) == "string") {
		method = params;
        async = false;
		preLoadOk = false;
	} else {
		method = params.method;
		noLoad = params.noLoad;
		callback = params.callback;
        async = params.async != null ? params.async : Boolean(callback);
		preLoadOk = params.preLoadOk != null ? params.preLoadOk : (callback != null);
	}
	var item = AjxDispatcher._registry[method];
	if (!item) {
		// method hasn't been registered
		AjxPackage.__log("API method '" + method + "' not found");
		return;
	}
	AjxPackage.__log("Run method: " + method);
	var pkg = item.pkg;
	var args = [];
	for (var i = 1; i < arguments.length; ++i) {
		args.push(arguments[i]);
	}
	if (callback) {
		args.push(callback);
	}
	
	return AjxDispatcher.require(pkg, async, item.callback, args, preLoadOk);
};

/**
 * Loads the given package, and runs its requested post-load callback. Clients should
 * be careful not to mix async and sync calls for the same package, in order to avoid
 * race conditions.
 * 
 * @param {string}	pkg				the name of the API method
 * @param {boolean}	async				if <code>true</code>, load package asynchronously
 * @param {AjxCallback}	callback			the callback to run after pkg load
 * @param {array}	args				the args to pass to callback
 * @param {boolean}	preLoadOk			if <code>true</code>, okay to run registered pre-load function
 */
AjxDispatcher.require =
function(pkg, async, callback, args, preLoadOk) {
	if (!pkg) { return; }
	
	if (typeof(pkg) == "string") {
		pkg = [pkg];
	}
	var unloaded = [];
	for (var i = 0; i < pkg.length; i++) {
		var p = pkg[i];
		if (!AjxDispatcher._getPackageData(p)._loaded) {
			unloaded.push(p);
		}
	}
	if (unloaded.length == 0) {
		return AjxDispatcher._postLoadCallback(pkg, false, callback, args);
	} else {
		// need callback in order to run pre-load function
		var preLoad = AjxDispatcher._preLoad;
		if (preLoadOk && AjxDispatcher._loadFunctionsEnabled && preLoad.length) {
			AjxPackage.__log("pre-load function");
			AjxDispatcher._timedAction = new AjxCallback(null, AjxDispatcher._continueRequire, [unloaded, async, callback, args]);
			for (var i = 0; i < preLoad.length; i++) {
				preLoad[i].run();
			}
			window.setTimeout('AjxDispatcher._timedAction.run()', 0);
		} else {
			return AjxDispatcher._continueRequire(unloaded, async, callback, args);
		}
	}
};

AjxDispatcher._continueRequire =
function(pkg, async, callback, args) {
	var pkgString = pkg.join(", ");
	AjxPackage.__log("------------------------------------- Loading package: " + pkgString);
	if (window.console && window.console.log) { console.log("------------------------------------- Loading package: " + pkgString); }
	if (async && callback) {
		var postLoadCallback = new AjxCallback(null, AjxDispatcher._postLoadCallback, [pkg, true, callback, args]);
		AjxPackage.require({name:pkg, callback:postLoadCallback});
	} else {
		var _st = new Date();
		for (var i = 0; i < pkg.length; i++) {
			AjxPackage.require(pkg[i]);
		}
		var _en = new Date();
		var t = _en.getTime() - _st.getTime();
		AjxPackage.__log("LOAD TIME for " + pkgString + ": " + t);

		return AjxDispatcher._postLoadCallback(pkg, true, callback, args);
	}
};

AjxDispatcher._postLoadCallback =
function(pkg, pkgWasLoaded, callback, args) {
    for (var i = 0; i < pkg.length; i++) {
        AjxDispatcher._getPackageData(pkg[i])._loaded = true;
    }
    for (var i = 0; i < pkg.length; i++) {
		var pkgData = AjxDispatcher._getPackageData(pkg[i]);
		if (pkgWasLoaded && pkgData.callback.length && !pkgData.callbackDone) {
			pkgData.callbackDone = true;
			AjxPackage.__log("Running post-load package function for " + pkg[i]);
			var callbacks = pkgData.callback;
			for (var j = 0; j < callbacks.length; j++) {
				callbacks[j].run();
			}
			pkgData.callback.length = 0;
		}
	}
	if (pkgWasLoaded) {
		var postLoad = AjxDispatcher._postLoad;
		if (AjxDispatcher._loadFunctionsEnabled && postLoad.length) {
			for (var i = 0; i < postLoad.length; i++) {
				postLoad[i].run();
			}
		}
	}
	
	if (callback) {
 		return callback.isAjxCallback ? callback.run1(args) : callback(args);
	}
};

AjxDispatcher._getPackageData = function(pkg) {
	if (!AjxDispatcher._package[pkg]) {
		AjxDispatcher._package[pkg] = { callback: [] };
	}
	return AjxDispatcher._package[pkg];
};
