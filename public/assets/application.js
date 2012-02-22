/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */

(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data,
        crossDomain = element.data('cross-domain') || null,
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType),
        options;

      if (rails.fire(element, 'ajax:before')) {

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = element.attr('href');
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType, crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = link.attr('href'),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input,
        selector = specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input = $(this);
        // Collect non-blank inputs if nonBlank option is true, otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
    var link = $(this), method = link.data('method'), data = link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !== undefined) {
      if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

      if (rails.handleRemote(link) === false) { rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
      remote = form.data('remote') !== undefined,
      blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
      nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload is present
    if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
      if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
    var button = $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name = button.attr('name'),
      data = name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
    if (this == event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this == event.target) rails.enableFormElements($(this));
  });

})( jQuery );
!function(a){a(function(){"use strict",a.support.transition=function(){var b=document.body||document.documentElement,c=b.style,d=c.transition!==undefined||c.WebkitTransition!==undefined||c.MozTransition!==undefined||c.MsTransition!==undefined||c.OTransition!==undefined;return d&&{end:function(){var b="TransitionEnd";return a.browser.webkit?b="webkitTransitionEnd":a.browser.mozilla?b="transitionend":a.browser.opera&&(b="oTransitionEnd"),b}()}}()})}(window.jQuery),!function(a){"use strict";var b='[data-dismiss="alert"]',c=function(c){a(c).on("click",b,this.close)};c.prototype={constructor:c,close:function(b){function f(){e.trigger("closed").remove()}var c=a(this),d=c.attr("data-target"),e;d||(d=c.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),e=a(d),e.trigger("close"),b&&b.preventDefault(),e.length||(e=c.hasClass("alert")?c:c.parent()),e.trigger("close").removeClass("in"),a.support.transition&&e.hasClass("fade")?e.on(a.support.transition.end,f):f()}},a.fn.alert=function(b){return this.each(function(){var d=a(this),e=d.data("alert");e||d.data("alert",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.alert.Constructor=c,a(function(){a("body").on("click.alert.data-api",b,c.prototype.close)})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.button.defaults,c)};b.prototype={constructor:b,setState:function(a){var b="disabled",c=this.$element,d=c.data(),e=c.is("input")?"val":"html";a+="Text",d.resetText||c.data("resetText",c[e]()),c[e](d[a]||this.options[a]),setTimeout(function(){a=="loadingText"?c.addClass(b).attr(b,b):c.removeClass(b).removeAttr(b)},0)},toggle:function(){var a=this.$element.parent('[data-toggle="buttons-radio"]');a&&a.find(".active").removeClass("active"),this.$element.toggleClass("active")}},a.fn.button=function(c){return this.each(function(){var d=a(this),e=d.data("button"),f=typeof c=="object"&&c;e||d.data("button",e=new b(this,f)),c=="toggle"?e.toggle():c&&e.setState(c)})},a.fn.button.defaults={loadingText:"loading..."},a.fn.button.Constructor=b,a(function(){a("body").on("click.button.data-api","[data-toggle^=button]",function(b){a(b.currentTarget).button("toggle")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.carousel.defaults,c),this.options.slide&&this.slide(this.options.slide)};b.prototype={cycle:function(){return this.interval=setInterval(a.proxy(this.next,this),this.options.interval),this},to:function(b){var c=this.$element.find(".active"),d=c.parent().children(),e=d.index(c),f=this;if(b>d.length-1||b<0)return;return this.sliding?this.$element.one("slid",function(){f.to(b)}):e==b?this.pause().cycle():this.slide(b>e?"next":"prev",a(d[b]))},pause:function(){return clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(b,c){var d=this.$element.find(".active"),e=c||d[b](),f=this.interval,g=b=="next"?"left":"right",h=b=="next"?"first":"last",i=this;if(!e.length)return;return this.sliding=!0,f&&this.pause(),e=e.length?e:this.$element.find(".item")[h](),!a.support.transition&&this.$element.hasClass("slide")?(this.$element.trigger("slide"),d.removeClass("active"),e.addClass("active"),this.sliding=!1,this.$element.trigger("slid")):(e.addClass(b),e[0].offsetWidth,d.addClass(g),e.addClass(g),this.$element.trigger("slide"),this.$element.one(a.support.transition.end,function(){e.removeClass([b,g].join(" ")).addClass("active"),d.removeClass(["active",g].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger("slid")},0)})),f&&this.cycle(),this}},a.fn.carousel=function(c){return this.each(function(){var d=a(this),e=d.data("carousel"),f=typeof c=="object"&&c;e||d.data("carousel",e=new b(this,f)),typeof c=="number"?e.to(c):typeof c=="string"||(c=f.slide)?e[c]():e.cycle()})},a.fn.carousel.defaults={interval:5e3},a.fn.carousel.Constructor=b,a(function(){a("body").on("click.carousel.data-api","[data-slide]",function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=!e.data("modal")&&a.extend({},e.data(),c.data());e.carousel(f),b.preventDefault()})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.collapse.defaults,c),this.options.parent&&(this.$parent=a(this.options.parent)),this.options.toggle&&this.toggle()};b.prototype={constructor:b,dimension:function(){var a=this.$element.hasClass("width");return a?"width":"height"},show:function(){var b=this.dimension(),c=a.camelCase(["scroll",b].join("-")),d=this.$parent&&this.$parent.find(".in"),e;d&&d.length&&(e=d.data("collapse"),d.collapse("hide"),e||d.data("collapse",null)),this.$element[b](0),this.transition("addClass","show","shown"),this.$element[b](this.$element[0][c])},hide:function(){var a=this.dimension();this.reset(this.$element[a]()),this.transition("removeClass","hide","hidden"),this.$element[a](0)},reset:function(a){var b=this.dimension();this.$element.removeClass("collapse")[b](a||"auto")[0].offsetWidth,this.$element.addClass("collapse")},transition:function(b,c,d){var e=this,f=function(){c=="show"&&e.reset(),e.$element.trigger(d)};this.$element.trigger(c)[b]("in"),a.support.transition&&this.$element.hasClass("collapse")?this.$element.one(a.support.transition.end,f):f()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},a.fn.collapse=function(c){return this.each(function(){var d=a(this),e=d.data("collapse"),f=typeof c=="object"&&c;e||d.data("collapse",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.collapse.defaults={toggle:!0},a.fn.collapse.Constructor=b,a(function(){a("body").on("click.collapse.data-api","[data-toggle=collapse]",function(b){var c=a(this),d,e=c.attr("data-target")||b.preventDefault()||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""),f=a(e).data("collapse")?"toggle":c.data();a(e).collapse(f)})})}(window.jQuery),!function(a){function d(){a(b).parent().removeClass("open")}"use strict";var b='[data-toggle="dropdown"]',c=function(b){var c=a(b).on("click.dropdown.data-api",this.toggle);a("html").on("click.dropdown.data-api",function(){c.parent().removeClass("open")})};c.prototype={constructor:c,toggle:function(b){var c=a(this),e=c.attr("data-target"),f,g;return e||(e=c.attr("href"),e=e&&e.replace(/.*(?=#[^\s]*$)/,"")),f=a(e),f.length||(f=c.parent()),g=f.hasClass("open"),d(),!g&&f.toggleClass("open"),!1}},a.fn.dropdown=function(b){return this.each(function(){var d=a(this),e=d.data("dropdown");e||d.data("dropdown",e=new c(this)),typeof b=="string"&&e[b].call(d)})},a.fn.dropdown.Constructor=c,a(function(){a("html").on("click.dropdown.data-api",d),a("body").on("click.dropdown.data-api",b,c.prototype.toggle)})}(window.jQuery),!function(a){function c(){var b=this,c=setTimeout(function(){b.$element.off(a.support.transition.end),d.call(b)},500);this.$element.one(a.support.transition.end,function(){clearTimeout(c),d.call(b)})}function d(a){this.$element.hide().trigger("hidden"),e.call(this)}function e(b){var c=this,d=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var e=a.support.transition&&d;this.$backdrop=a('<div class="modal-backdrop '+d+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(a.proxy(this.hide,this)),e&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),e?this.$backdrop.one(a.support.transition.end,b):b()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(a.support.transition.end,a.proxy(f,this)):f.call(this)):b&&b()}function f(){this.$backdrop.remove(),this.$backdrop=null}function g(){var b=this;this.isShown&&this.options.keyboard?a(document).on("keyup.dismiss.modal",function(a){a.which==27&&b.hide()}):this.isShown||a(document).off("keyup.dismiss.modal")}"use strict";var b=function(b,c){this.options=c,this.$element=a(b).delegate('[data-dismiss="modal"]',"click.dismiss.modal",a.proxy(this.hide,this))};b.prototype={constructor:b,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var b=this;if(this.isShown)return;a("body").addClass("modal-open"),this.isShown=!0,this.$element.trigger("show"),g.call(this),e.call(this,function(){var c=a.support.transition&&b.$element.hasClass("fade");!b.$element.parent().length&&b.$element.appendTo(document.body),b.$element.show(),c&&b.$element[0].offsetWidth,b.$element.addClass("in"),c?b.$element.one(a.support.transition.end,function(){b.$element.trigger("shown")}):b.$element.trigger("shown")})},hide:function(b){b&&b.preventDefault();if(!this.isShown)return;var e=this;this.isShown=!1,a("body").removeClass("modal-open"),g.call(this),this.$element.trigger("hide").removeClass("in"),a.support.transition&&this.$element.hasClass("fade")?c.call(this):d.call(this)}},a.fn.modal=function(c){return this.each(function(){var d=a(this),e=d.data("modal"),f=a.extend({},a.fn.modal.defaults,d.data(),typeof c=="object"&&c);e||d.data("modal",e=new b(this,f)),typeof c=="string"?e[c]():f.show&&e.show()})},a.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},a.fn.modal.Constructor=b,a(function(){a("body").on("click.modal.data-api",'[data-toggle="modal"]',function(b){var c=a(this),d,e=a(c.attr("data-target")||(d=c.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,"")),f=e.data("modal")?"toggle":a.extend({},e.data(),c.data());b.preventDefault(),e.modal(f)})})}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("tooltip",a,b)};b.prototype={constructor:b,init:function(b,c,d){var e,f;this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.enabled=!0,this.options.trigger!="manual"&&(e=this.options.trigger=="hover"?"mouseenter":"focus",f=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(e,this.options.selector,a.proxy(this.enter,this)),this.$element.on(f,this.options.selector,a.proxy(this.leave,this))),this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(b){return b=a.extend({},a.fn[this.type].defaults,b,this.$element.data()),b.delay&&typeof b.delay=="number"&&(b.delay={show:b.delay,hide:b.delay}),b},enter:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);!c.options.delay||!c.options.delay.show?c.show():(c.hoverState="in",setTimeout(function(){c.hoverState=="in"&&c.show()},c.options.delay.show))},leave:function(b){var c=a(b.currentTarget)[this.type](this._options).data(this.type);!c.options.delay||!c.options.delay.hide?c.hide():(c.hoverState="out",setTimeout(function(){c.hoverState=="out"&&c.hide()},c.options.delay.hide))},show:function(){var a,b,c,d,e,f,g;if(this.hasContent()&&this.enabled){a=this.tip(),this.setContent(),this.options.animation&&a.addClass("fade"),f=typeof this.options.placement=="function"?this.options.placement.call(this,a[0],this.$element[0]):this.options.placement,b=/in/.test(f),a.remove().css({top:0,left:0,display:"block"}).appendTo(b?this.$element:document.body),c=this.getPosition(b),d=a[0].offsetWidth,e=a[0].offsetHeight;switch(b?f.split(" ")[1]:f){case"bottom":g={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"top":g={top:c.top-e,left:c.left+c.width/2-d/2};break;case"left":g={top:c.top+c.height/2-e/2,left:c.left-d};break;case"right":g={top:c.top+c.height/2-e/2,left:c.left+c.width}}a.css(g).addClass(f).addClass("in")}},setContent:function(){var a=this.tip();a.find(".tooltip-inner").html(this.getTitle()),a.removeClass("fade in top bottom left right")},hide:function(){function d(){var b=setTimeout(function(){c.off(a.support.transition.end).remove()},500);c.one(a.support.transition.end,function(){clearTimeout(b),c.remove()})}var b=this,c=this.tip();c.removeClass("in"),a.support.transition&&this.$tip.hasClass("fade")?d():c.remove()},fixTitle:function(){var a=this.$element;(a.attr("title")||typeof a.attr("data-original-title")!="string")&&a.attr("data-original-title",a.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(b){return a.extend({},b?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||(typeof c.title=="function"?c.title.call(b[0]):c.title),a=a.toString().replace(/(^\s*|\s*$)/,""),a},tip:function(){return this.$tip=this.$tip||a(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}},a.fn.tooltip=function(c){return this.each(function(){var d=a(this),e=d.data("tooltip"),f=typeof c=="object"&&c;e||d.data("tooltip",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.tooltip.Constructor=b,a.fn.tooltip.defaults={animation:!0,delay:0,selector:!1,placement:"top",trigger:"hover",title:"",template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'}}(window.jQuery),!function(a){"use strict";var b=function(a,b){this.init("popover",a,b)};b.prototype=a.extend({},a.fn.tooltip.Constructor.prototype,{constructor:b,setContent:function(){var b=this.tip(),c=this.getTitle(),d=this.getContent();b.find(".popover-title")[a.type(c)=="object"?"append":"html"](c),b.find(".popover-content > *")[a.type(d)=="object"?"append":"html"](d),b.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var a,b=this.$element,c=this.options;return a=b.attr("data-content")||(typeof c.content=="function"?c.content.call(b[0]):c.content),a=a.toString().replace(/(^\s*|\s*$)/,""),a},tip:function(){return this.$tip||(this.$tip=a(this.options.template)),this.$tip}}),a.fn.popover=function(c){return this.each(function(){var d=a(this),e=d.data("popover"),f=typeof c=="object"&&c;e||d.data("popover",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.popover.Constructor=b,a.fn.popover.defaults=a.extend({},a.fn.tooltip.defaults,{placement:"right",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(a){function b(b,c){var d=a.proxy(this.process,this),e=a(b).is("body")?a(window):a(b),f;this.options=a.extend({},a.fn.scrollspy.defaults,c),this.$scrollElement=e.on("scroll.scroll.data-api",d),this.selector=(this.options.target||(f=a(b).attr("href"))&&f.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=a("body").on("click.scroll.data-api",this.selector,d),this.refresh(),this.process()}"use strict",b.prototype={constructor:b,refresh:function(){this.targets=this.$body.find(this.selector).map(function(){var b=a(this).attr("href");return/^#\w/.test(b)&&a(b).length?b:null}),this.offsets=a.map(this.targets,function(b){return a(b).position().top})},process:function(){var a=this.$scrollElement.scrollTop()+this.options.offset,b=this.offsets,c=this.targets,d=this.activeTarget,e;for(e=b.length;e--;)d!=c[e]&&a>=b[e]&&(!b[e+1]||a<=b[e+1])&&this.activate(c[e])},activate:function(a){var b;this.activeTarget=a,this.$body.find(this.selector).parent(".active").removeClass("active"),b=this.$body.find(this.selector+'[href="'+a+'"]').parent("li").addClass("active"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active")}},a.fn.scrollspy=function(c){return this.each(function(){var d=a(this),e=d.data("scrollspy"),f=typeof c=="object"&&c;e||d.data("scrollspy",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.scrollspy.Constructor=b,a.fn.scrollspy.defaults={offset:10},a(function(){a('[data-spy="scroll"]').each(function(){var b=a(this);b.scrollspy(b.data())})})}(window.jQuery),!function(a){"use strict";var b=function(b){this.element=a(b)};b.prototype={constructor:b,show:function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.attr("data-target"),e,f;d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,""));if(b.parent("li").hasClass("active"))return;e=c.find(".active a").last()[0],b.trigger({type:"show",relatedTarget:e}),f=a(d),this.activate(b.parent("li"),c),this.activate(f,f.parent(),function(){b.trigger({type:"shown",relatedTarget:e})})},activate:function(b,c,d){function g(){e.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),b.addClass("active"),f?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu")&&b.closest("li.dropdown").addClass("active"),d&&d()}var e=c.find("> .active"),f=d&&a.support.transition&&e.hasClass("fade");f?e.one(a.support.transition.end,g):g(),e.removeClass("in")}},a.fn.tab=function(c){return this.each(function(){var d=a(this),e=d.data("tab");e||d.data("tab",e=new b(this)),typeof c=="string"&&e[c]()})},a.fn.tab.Constructor=b,a(function(){a("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(b){b.preventDefault(),a(this).tab("show")})})}(window.jQuery),!function(a){"use strict";var b=function(b,c){this.$element=a(b),this.options=a.extend({},a.fn.typeahead.defaults,c),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.$menu=a(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};b.prototype={constructor:b,select:function(){var a=this.$menu.find(".active").attr("data-value");return this.$element.val(a),this.hide()},show:function(){var b=a.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:b.top+b.height,left:b.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(b){var c=this,d,e;return this.query=this.$element.val(),this.query?(d=a.grep(this.source,function(a){if(c.matcher(a))return a}),d=this.sorter(d),d.length?this.render(d.slice(0,this.options.items)).show():this.shown?this.hide():this):this.shown?this.hide():this},matcher:function(a){return~a.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(a){var b=[],c=[],d=[],e;while(e=a.shift())e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?c.push(e):d.push(e):b.push(e);return b.concat(c,d)},highlighter:function(a){return a.replace(new RegExp("("+this.query+")","ig"),function(a,b){return"<strong>"+b+"</strong>"})},render:function(b){var c=this;return b=a(b).map(function(b,d){return b=a(c.options.item).attr("data-value",d),b.find("a").html(c.highlighter(d)),b[0]}),b.first().addClass("active"),this.$menu.html(b),this},next:function(b){var c=this.$menu.find(".active").removeClass("active"),d=c.next();d.length||(d=a(this.$menu.find("li")[0])),d.addClass("active")},prev:function(a){var b=this.$menu.find(".active").removeClass("active"),c=b.prev();c.length||(c=this.$menu.find("li").last()),c.addClass("active")},listen:function(){this.$element.on("blur",a.proxy(this.blur,this)).on("keypress",a.proxy(this.keypress,this)).on("keyup",a.proxy(this.keyup,this)),(a.browser.webkit||a.browser.msie)&&this.$element.on("keydown",a.proxy(this.keypress,this)),this.$menu.on("click",a.proxy(this.click,this)).on("mouseenter","li",a.proxy(this.mouseenter,this))},keyup:function(a){a.stopPropagation(),a.preventDefault();switch(a.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:this.hide();break;default:this.lookup()}},keypress:function(a){a.stopPropagation();if(!this.shown)return;switch(a.keyCode){case 9:case 13:case 27:a.preventDefault();break;case 38:a.preventDefault(),this.prev();break;case 40:a.preventDefault(),this.next()}},blur:function(a){var b=this;a.stopPropagation(),a.preventDefault(),setTimeout(function(){b.hide()},150)},click:function(a){a.stopPropagation(),a.preventDefault(),this.select()},mouseenter:function(b){this.$menu.find(".active").removeClass("active"),a(b.currentTarget).addClass("active")}},a.fn.typeahead=function(c){return this.each(function(){var d=a(this),e=d.data("typeahead"),f=typeof c=="object"&&c;e||d.data("typeahead",e=new b(this,f)),typeof c=="string"&&e[c]()})},a.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>'},a.fn.typeahead.Constructor=b,a(function(){a("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(b){var c=a(this);if(c.data("typeahead"))return;b.preventDefault(),c.typeahead(c.data())})})}(window.jQuery);
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":30,"x_max":741,"ha":774,"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "},"S":{"x_min":55,"x_max":687,"ha":742,"o":"m 95 251 l 116 251 q 188 116 145 158 q 322 75 231 75 q 438 113 385 75 q 491 211 491 151 q 382 350 491 294 q 168 461 273 407 q 55 664 55 539 q 159 875 55 801 q 409 949 264 949 q 653 891 535 949 q 622 805 635 848 q 598 712 609 762 l 583 712 q 509 818 559 779 q 391 857 459 857 q 283 827 328 857 q 238 738 238 797 q 349 609 238 666 q 570 497 461 551 q 687 295 687 416 q 570 62 687 143 q 292 -18 453 -18 q 171 -8 229 -18 q 55 26 113 1 q 72 116 64 68 q 95 251 80 165 "},"/":{"x_min":-32.953125,"x_max":420,"ha":383,"o":"m 339 1023 l 420 1024 l 47 -126 l -32 -126 l 339 1023 "},"Τ":{"x_min":8,"x_max":738,"ha":749,"o":"m 493 818 q 490 723 493 790 q 487 652 487 656 q 490 427 487 529 q 498 201 494 326 q 503 0 503 77 q 438 2 482 0 q 374 5 395 5 q 317 3 351 5 q 244 0 284 1 q 252 266 244 88 q 261 476 261 444 q 258 670 261 533 q 255 818 255 808 q 158 815 188 818 q 8 801 128 813 l 12 872 l 8 932 q 198 927 70 932 q 373 922 327 922 q 572 927 445 922 q 738 932 700 932 l 733 870 l 738 801 q 493 818 614 818 "},"ϕ":{"x_min":32,"x_max":997,"ha":1028,"o":"m 418 -6 q 146 79 261 -6 q 32 322 32 165 q 143 560 32 474 q 418 664 254 646 q 411 819 418 715 q 404 978 404 923 q 483 970 445 970 q 622 977 556 970 q 616 829 622 938 q 611 664 611 719 q 882 573 768 664 q 997 328 997 483 q 886 90 997 171 q 611 -6 776 9 q 616 -197 611 -68 q 622 -374 622 -326 l 544 -365 q 471 -366 503 -365 q 404 -373 438 -368 q 411 -183 404 -315 q 418 -6 418 -51 m 611 328 l 611 61 q 742 147 704 72 q 780 328 780 222 q 741 510 780 433 q 612 601 703 588 l 611 328 m 418 601 q 287 510 326 588 q 249 328 249 433 q 286 147 249 223 q 416 61 324 72 l 418 328 l 418 601 "},"y":{"x_min":0,"x_max":669.453125,"ha":653,"o":"m 269 -16 l 76 481 q 37 579 58 529 q 0 667 16 629 q 66 664 22 667 q 134 661 111 661 q 201 664 154 661 q 251 667 248 667 q 308 465 277 561 q 380 256 338 368 l 452 463 q 482 562 462 493 q 512 667 502 631 l 577 661 q 623 664 593 661 q 669 667 654 667 q 438 139 536 375 q 244 -373 341 -97 q 165 -368 206 -368 q 132 -368 145 -368 q 86 -373 119 -368 q 145 -277 119 -323 q 195 -176 170 -230 l 269 -16 "},"≈":{"x_min":118.0625,"x_max":1019.453125,"ha":1139,"o":"m 1019 527 q 894 458 956 483 q 766 433 831 433 q 570 477 698 433 q 373 522 443 522 q 238 489 297 522 q 118 417 179 457 l 118 563 q 254 632 187 607 q 391 658 320 658 q 577 614 450 658 q 761 571 704 571 q 886 596 826 571 q 1019 671 945 622 l 1019 527 m 1019 251 q 892 182 952 207 q 766 158 831 158 q 568 202 697 158 q 373 246 440 246 q 251 219 308 246 q 118 140 194 192 l 118 286 q 252 358 187 331 q 387 385 318 385 q 575 339 447 385 q 761 294 704 294 q 886 321 825 294 q 1019 397 947 348 l 1019 251 "},"Π":{"x_min":91,"x_max":957,"ha":1049,"o":"m 105 284 l 105 461 q 102 651 105 534 q 99 784 99 768 l 91 932 q 210 926 129 932 q 331 921 290 921 l 711 921 q 833 926 751 921 q 957 932 915 932 q 948 692 957 857 q 939 465 939 527 q 942 221 939 315 q 957 0 945 127 l 829 5 q 756 2 808 5 q 698 0 703 0 q 707 63 704 33 q 710 130 710 93 l 713 504 l 710 813 l 515 818 l 336 813 q 333 643 336 762 q 331 516 331 523 l 336 130 q 345 0 336 59 q 278 2 322 0 q 215 5 234 5 l 91 0 q 98 146 91 40 q 105 284 105 252 "},"ΐ":{"x_min":-147,"x_max":552,"ha":396,"o":"m 92 126 l 92 543 l 80 666 q 139 661 105 663 q 197 658 173 658 q 265 660 239 658 q 315 666 292 663 q 305 586 308 616 q 302 523 302 557 l 302 113 q 303 72 302 88 q 315 0 305 56 l 196 4 l 82 0 q 88 67 85 30 q 92 126 92 104 m -65 961 q -7 935 -31 961 q 17 877 17 909 q -8 820 17 844 q -65 797 -33 797 q -121 820 -96 797 q -147 879 -147 844 q -123 935 -147 910 q -65 961 -99 961 m 275 1017 q 316 998 298 1017 q 334 957 334 980 q 321 919 334 935 q 283 886 307 903 l 94 755 l 36 755 l 182 950 q 225 998 204 980 q 275 1017 247 1017 m 470 961 q 528 935 504 961 q 552 877 552 910 q 528 820 552 844 q 471 797 504 797 q 413 820 438 797 q 388 879 388 844 q 412 936 388 912 q 470 961 436 961 "},"g":{"x_min":23,"x_max":714.671875,"ha":700,"o":"m 213 272 q 93 331 142 278 q 45 456 45 384 q 128 623 45 563 q 322 683 211 683 l 382 683 l 534 664 l 606 660 q 666 662 641 660 q 714 666 692 665 l 714 585 l 581 589 q 623 543 610 570 q 637 477 637 515 q 541 300 637 353 q 310 248 446 248 q 258 236 281 248 q 236 199 236 225 q 386 142 236 150 q 623 102 536 134 q 711 -68 711 71 q 591 -296 711 -218 q 313 -374 471 -374 q 111 -326 199 -374 q 23 -175 23 -279 q 63 -64 23 -110 q 171 -7 104 -19 l 171 0 q 103 39 130 7 q 76 112 76 70 q 117 201 76 163 q 213 251 159 239 l 213 272 m 169 -143 q 221 -255 169 -215 q 351 -295 274 -295 q 483 -254 427 -295 q 540 -139 540 -214 q 524 -81 540 -107 q 472 -40 508 -54 q 383 -19 437 -25 q 269 -13 330 -13 l 239 -12 q 169 -143 169 -54 m 332 304 q 411 351 392 304 q 431 472 431 399 q 413 581 431 536 q 341 626 395 626 q 267 578 287 626 q 247 466 247 530 q 262 350 247 396 q 332 304 277 304 "},"²":{"x_min":22,"x_max":465.0625,"ha":494,"o":"m 22 401 q 156 502 102 456 q 248 607 210 548 q 287 742 287 667 q 267 825 287 802 q 216 848 248 848 q 146 816 167 848 q 110 725 126 785 l 102 725 l 30 800 q 245 901 116 901 q 385 864 327 901 q 444 751 444 827 q 411 643 444 681 q 201 471 378 604 l 284 471 q 387 473 314 471 q 465 476 459 476 q 456 413 456 439 q 459 383 456 401 q 465 354 462 365 q 331 356 412 354 q 249 358 251 358 l 27 354 l 22 401 "},"Κ":{"x_min":90,"x_max":892.78125,"ha":856,"o":"m 334 716 l 334 515 l 569 787 q 635 866 619 845 q 682 932 651 886 l 767 926 q 817 929 784 926 q 870 932 851 932 q 687 746 790 851 q 503 554 585 641 l 623 377 q 892 0 753 179 l 753 5 q 664 2 727 5 q 595 0 600 0 q 484 190 545 98 q 334 404 424 281 l 334 193 q 348 0 334 94 q 270 2 325 0 q 212 5 215 5 l 90 0 q 99 236 90 69 q 108 461 108 402 q 103 623 108 515 q 99 787 99 731 l 90 932 q 157 927 113 932 q 219 922 201 922 q 282 925 252 922 q 342 932 312 927 q 338 831 342 907 q 334 716 334 755 "},"ë":{"x_min":41,"x_max":684.046875,"ha":729,"o":"m 482 98 q 566 112 532 98 q 643 160 600 126 l 661 151 q 643 96 652 125 q 628 40 634 66 q 521 -1 577 11 q 403 -15 466 -15 q 141 79 241 -15 q 41 336 41 173 q 137 586 41 490 q 386 683 234 683 q 608 601 532 683 q 684 373 684 520 l 684 332 l 267 332 q 325 165 267 232 q 482 98 383 98 m 233 976 q 300 948 272 976 q 328 878 328 920 q 303 811 328 839 q 236 784 278 784 q 166 811 194 784 q 138 878 138 838 q 166 947 138 918 q 233 976 194 976 m 493 976 q 560 948 532 976 q 588 878 588 920 q 562 811 588 838 q 496 784 536 784 q 427 811 455 784 q 399 878 399 838 q 426 946 399 917 q 493 976 454 976 m 478 411 q 481 444 481 422 q 459 566 481 513 q 377 620 438 620 q 292 562 318 620 q 267 437 267 505 l 267 411 l 478 411 "},"e":{"x_min":43,"x_max":686.046875,"ha":729,"o":"m 484 95 q 566 110 531 95 q 644 161 601 125 l 662 154 q 640 84 647 105 q 629 40 634 62 q 522 -1 577 11 q 404 -15 468 -15 q 141 77 240 -15 q 43 336 43 170 q 138 585 43 488 q 387 683 234 683 q 609 602 533 683 q 686 375 686 522 l 684 332 l 269 332 q 326 162 269 230 q 484 95 384 95 m 480 411 l 482 444 q 459 567 482 513 q 379 622 437 622 q 293 565 318 622 q 269 438 269 509 l 269 411 l 480 411 "},"ό":{"x_min":30,"x_max":741,"ha":774,"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 538 953 q 591 1001 571 986 q 639 1017 611 1017 q 692 994 671 1017 q 713 943 713 972 q 694 897 713 915 q 643 863 675 878 l 420 755 l 352 755 l 538 953 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "},"J":{"x_min":-37,"x_max":356,"ha":447,"o":"m 214 926 q 293 929 237 926 q 356 932 349 932 q 349 680 356 857 q 342 450 342 502 q 344 314 342 411 q 346 213 346 218 l 346 105 q 249 -128 346 -36 q 10 -221 153 -221 l -24 -216 l -37 -143 l 13 -145 q 97 -94 76 -145 q 118 28 118 -44 l 118 219 q 110 619 118 352 q 103 931 103 886 l 214 926 "},"»":{"x_min":54.5625,"x_max":587.890625,"ha":629,"o":"m 187 330 l 54 604 l 110 656 l 339 333 l 110 9 l 54 66 l 187 330 m 437 330 l 304 604 l 358 656 l 587 333 l 358 9 l 304 66 l 437 330 "},"©":{"x_min":72,"x_max":1064,"ha":1138,"o":"m 1064 486 q 918 139 1064 285 q 570 -6 772 -6 q 220 139 369 -6 q 72 488 72 285 q 219 836 72 688 q 568 985 367 985 q 916 836 769 985 q 1064 486 1064 687 m 155 490 q 276 199 155 323 q 566 75 398 75 q 858 197 734 75 q 982 487 982 319 q 861 781 982 659 q 567 904 740 904 q 276 781 398 904 q 155 490 155 658 m 683 597 q 649 666 683 637 q 573 696 616 696 q 470 636 501 696 q 439 499 439 577 q 468 354 439 421 q 563 288 497 288 q 687 397 664 288 l 815 397 q 735 247 805 303 q 570 191 666 191 q 374 273 448 191 q 301 481 301 356 q 371 696 301 604 q 559 788 441 788 q 726 737 655 788 q 808 597 796 686 l 683 597 "},"ώ":{"x_min":30,"x_max":1059,"ha":1093,"o":"m 335 -15 q 111 79 192 -15 q 30 320 30 173 q 72 504 30 420 q 192 666 114 588 q 297 661 237 661 q 347 663 319 661 q 390 666 374 665 q 247 280 247 498 q 269 123 247 194 q 358 52 291 52 q 421 86 399 52 q 443 165 443 121 l 443 291 q 441 415 443 379 q 435 512 440 451 q 511 505 499 505 q 544 505 522 505 q 608 508 579 505 q 657 512 636 511 q 648 402 652 465 q 644 289 644 340 q 644 237 644 258 q 650 165 644 215 q 669 85 650 119 q 730 52 688 52 q 821 122 798 52 q 844 279 844 192 q 807 481 844 386 q 700 666 771 576 q 746 662 724 663 q 793 661 767 661 q 846 663 812 661 q 898 666 881 666 q 1016 508 974 594 q 1059 322 1059 422 q 974 83 1059 182 q 753 -15 890 -15 q 630 13 685 -15 q 545 100 575 41 q 459 14 516 44 q 335 -15 402 -15 m 684 953 q 737 1001 717 986 q 786 1017 757 1017 q 838 994 817 1017 q 859 943 859 972 q 840 897 859 915 q 790 863 821 878 l 567 755 l 498 755 l 684 953 "},"≥":{"x_min":170.828125,"x_max":965,"ha":1139,"o":"m 965 571 l 965 455 l 173 199 l 173 338 l 732 514 l 173 690 l 173 830 l 965 571 m 965 132 l 965 0 l 170 0 l 170 132 l 965 132 "},"^":{"x_min":-3,"x_max":425,"ha":438,"o":"m 148 1003 l 270 1003 l 425 755 l 357 755 l 210 878 l 62 755 l -3 755 l 148 1003 "},"«":{"x_min":40.28125,"x_max":575,"ha":629,"o":"m 193 336 l 326 62 l 272 9 l 40 333 l 272 656 l 325 599 l 193 336 m 443 336 l 575 62 l 520 9 l 288 333 l 520 656 l 575 599 l 443 336 "},"D":{"x_min":87,"x_max":987,"ha":1032,"o":"m 104 221 l 104 465 q 100 742 104 650 q 89 932 97 834 l 216 929 l 283 929 l 442 929 q 532 929 488 929 q 622 929 576 929 q 894 797 802 912 q 987 496 987 682 q 832 110 987 221 q 389 -1 677 -1 l 201 -1 l 87 -1 q 98 119 93 60 q 104 221 104 178 m 415 89 q 659 192 580 89 q 738 468 738 296 q 663 746 738 653 q 407 839 588 839 l 334 839 l 330 605 l 334 98 q 374 91 353 94 q 415 89 394 89 "},"w":{"x_min":6.9375,"x_max":1048.625,"ha":1042,"o":"m 302 6 q 270 5 281 6 q 215 0 258 4 l 6 667 q 77 663 33 667 q 129 659 120 659 q 197 663 154 659 q 248 667 240 667 q 359 238 293 457 l 440 505 l 484 667 q 540 663 502 667 q 580 659 577 659 q 637 663 598 659 q 677 667 676 667 q 712 520 695 586 q 748 383 729 454 l 790 238 l 855 475 q 875 555 862 501 q 899 667 888 609 q 939 662 917 665 q 973 659 961 659 q 1017 662 998 659 q 1048 667 1036 665 l 956 423 l 812 0 q 759 4 776 3 q 727 6 743 6 q 678 3 712 6 q 643 0 644 0 l 562 288 l 522 423 q 391 0 455 221 q 336 4 354 3 q 302 6 318 6 "},"$":{"x_min":43,"x_max":697,"ha":749,"o":"m 43 79 q 104 254 76 165 l 128 254 q 202 128 150 177 q 331 79 254 79 l 331 365 q 108 474 168 409 q 49 623 49 539 q 130 807 49 737 q 331 889 211 878 q 322 1010 331 949 q 344 1006 329 1008 q 371 1002 360 1004 q 393 1004 382 1004 q 417 1010 403 1005 q 410 955 412 983 q 409 892 409 926 q 555 868 502 880 q 662 823 607 855 q 601 665 626 746 l 570 665 q 409 817 538 789 l 409 554 q 637 445 577 511 q 697 289 697 379 q 615 91 697 168 q 409 0 534 15 l 409 -62 q 409 -97 409 -84 q 411 -136 410 -109 l 368 -133 l 325 -136 q 328 -69 328 -112 q 331 0 329 -26 q 43 79 173 0 m 331 817 q 243 778 278 817 q 209 686 209 739 q 245 615 209 644 q 331 577 282 586 l 331 817 m 534 212 q 499 299 534 267 q 405 347 464 330 l 405 78 q 497 123 461 89 q 534 212 534 157 "},"‧":{"x_min":105,"x_max":343,"ha":447,"o":"m 223 654 q 306 617 270 654 q 343 533 343 581 q 306 451 343 486 q 223 417 270 417 q 139 450 174 417 q 105 534 105 483 q 139 619 105 584 q 223 654 174 654 "},"\\":{"x_min":-31.953125,"x_max":422,"ha":383,"o":"m -31 1024 l 49 1024 l 422 -126 l 338 -126 l -31 1024 "},"Ι":{"x_min":94,"x_max":354,"ha":447,"o":"m 111 402 q 107 716 111 609 q 94 932 103 822 q 161 925 124 929 q 220 922 198 922 q 292 927 245 922 q 353 931 339 932 q 340 716 343 819 q 337 465 337 613 q 340 221 337 326 q 354 0 344 116 q 273 2 330 0 q 214 5 216 5 l 95 0 q 107 199 103 88 q 111 402 111 311 "},"Ύ":{"x_min":-28,"x_max":1295.609375,"ha":1247,"o":"m 635 650 q 566 772 622 672 q 469 931 509 872 l 591 926 q 683 929 619 926 q 755 931 748 931 q 844 740 803 825 q 941 554 885 656 q 1040 730 991 636 q 1135 931 1088 825 l 1210 926 q 1252 929 1224 926 q 1295 931 1280 931 q 1142 689 1213 812 q 997 420 1072 566 l 1001 143 l 1007 0 l 913 5 l 755 0 q 761 138 755 50 q 768 237 768 226 l 768 402 l 635 650 m 158 953 q 211 1001 191 986 q 259 1017 231 1017 q 312 994 291 1017 q 333 943 333 972 q 314 897 333 916 q 264 863 295 878 l 40 755 l -28 755 l 158 953 "},"’":{"x_min":70.828125,"x_max":337.5,"ha":374,"o":"m 70 528 l 151 848 q 183 919 158 889 q 244 949 208 949 q 310 924 283 949 q 337 862 337 900 q 331 829 337 845 q 316 797 326 813 l 111 511 l 70 528 "},"Ν":{"x_min":86,"x_max":930.453125,"ha":1010,"o":"m 101 444 q 97 645 101 523 q 94 787 94 768 l 90 931 l 177 926 l 268 934 q 526 623 395 775 q 792 327 657 470 l 792 584 q 787 766 792 643 q 782 931 782 888 q 825 927 811 929 q 854 926 838 926 q 890 927 876 926 q 930 934 904 929 q 919 838 923 889 q 915 738 915 788 q 913 461 915 600 q 911 184 912 322 q 913 106 911 147 q 920 0 915 66 q 876 4 901 2 q 838 6 851 6 q 794 4 812 6 q 756 0 777 2 q 495 309 631 151 q 220 618 359 466 l 220 241 l 227 0 q 194 4 213 1 q 159 6 175 6 q 119 4 134 6 q 86 0 103 2 q 97 208 94 105 q 101 444 101 311 "},"-":{"x_min":58.71875,"x_max":386.5,"ha":447,"o":"m 65 334 q 62 383 65 352 q 58 422 58 415 l 386 422 l 379 333 l 386 247 l 58 247 q 62 296 58 265 q 65 334 65 327 "},"Q":{"x_min":40,"x_max":1098.328125,"ha":1129,"o":"m 40 456 q 190 819 40 689 q 577 949 340 949 q 945 829 804 949 q 1086 486 1086 709 q 1004 185 1086 313 q 759 10 922 56 l 883 -72 q 1098 -182 979 -129 l 1098 -200 q 1005 -241 1053 -216 q 906 -294 956 -265 q 737 -160 824 -226 q 533 -13 649 -94 q 174 110 308 -13 q 40 456 40 233 m 562 72 q 773 193 706 72 q 840 472 840 315 q 773 741 840 623 q 566 860 706 860 q 354 741 421 860 q 287 465 287 622 q 353 192 287 312 q 562 72 420 72 "},"ς":{"x_min":48,"x_max":647,"ha":689,"o":"m 421 600 q 306 538 350 600 q 263 404 263 477 q 357 244 263 304 q 532 151 445 197 q 627 -17 627 88 q 527 -214 627 -140 q 302 -288 427 -288 q 291 -198 302 -247 q 318 -203 296 -198 q 353 -207 341 -207 q 440 -176 402 -207 q 484 -95 478 -145 q 324 60 484 -17 q 106 179 164 139 q 48 353 48 219 q 153 590 48 500 q 409 681 259 681 q 527 666 470 681 q 647 623 584 651 q 616 532 626 561 q 597 465 606 504 l 559 465 q 513 563 546 526 q 421 600 479 600 "},"M":{"x_min":32,"x_max":1165,"ha":1217,"o":"m 105 465 l 168 932 q 211 927 190 929 q 261 926 231 926 q 309 929 277 926 q 358 932 341 932 q 441 709 409 790 q 503 559 473 629 q 608 316 533 488 l 778 690 q 872 932 834 808 q 919 929 887 932 q 966 926 951 926 q 1027 929 1006 926 q 1059 932 1048 932 l 1105 473 q 1130 240 1117 354 q 1165 0 1144 127 q 1095 3 1140 0 q 1041 6 1051 6 q 969 3 1015 6 q 915 0 924 0 q 895 291 915 142 l 865 616 q 731 317 802 480 q 597 0 661 153 l 551 0 l 500 0 q 409 218 465 87 q 317 426 352 349 q 236 605 282 504 l 196 229 q 185 108 190 173 q 180 0 180 44 q 134 3 165 0 q 100 6 102 6 q 60 4 77 6 q 32 0 43 1 q 105 465 77 258 "},"Ψ":{"x_min":84,"x_max":1097.890625,"ha":1185,"o":"m 307 708 q 307 639 307 686 q 307 569 307 593 q 342 407 307 462 q 478 353 377 353 l 480 484 q 472 735 480 568 q 464 932 464 903 q 530 925 494 929 q 587 922 566 922 q 658 927 612 922 q 719 931 705 932 q 712 777 719 877 q 706 666 706 677 l 702 353 q 800 378 761 353 q 853 457 839 404 q 871 582 868 511 q 875 670 875 652 q 868 811 875 720 q 861 931 861 901 q 926 927 881 931 q 984 922 970 922 q 1039 926 1002 922 q 1097 930 1077 930 q 1093 869 1094 904 q 1092 801 1092 834 l 1092 738 l 1092 687 l 1092 610 q 992 354 1092 432 q 702 261 892 277 q 710 126 702 219 q 719 0 719 33 q 646 3 691 0 q 591 6 601 6 q 516 3 562 6 q 464 0 470 0 q 472 134 464 40 q 480 261 480 229 q 188 358 287 261 q 90 651 90 455 l 90 804 l 90 820 q 84 930 90 881 q 139 926 102 930 q 196 922 177 922 q 257 927 219 922 q 322 931 295 931 q 311 813 316 876 q 307 708 307 750 "},"C":{"x_min":43,"x_max":891.84375,"ha":900,"o":"m 587 856 q 363 744 442 856 q 285 479 285 632 q 361 202 285 322 q 586 82 437 82 q 740 108 668 82 q 855 194 812 135 l 877 184 q 861 120 868 152 q 846 45 854 88 q 710 -2 786 12 q 555 -18 634 -18 q 184 109 326 -18 q 43 464 43 236 q 190 819 43 690 q 569 949 338 949 q 723 932 652 949 q 891 876 793 915 q 866 793 879 840 q 846 710 852 746 l 827 710 q 734 818 799 781 q 587 856 669 856 "},"œ":{"x_min":36,"x_max":1154.0625,"ha":1197,"o":"m 387 -15 q 131 79 227 -15 q 36 334 36 173 q 131 586 36 490 q 383 683 226 683 q 630 606 515 683 q 735 664 677 645 q 859 683 792 683 q 1076 600 999 683 q 1154 377 1154 517 l 1152 332 l 736 332 q 793 165 736 232 q 951 98 851 98 q 1111 160 1042 98 l 1127 151 q 1111 101 1116 119 q 1094 40 1105 83 q 990 -1 1049 11 q 870 -15 931 -15 q 735 2 794 -15 q 628 68 676 20 q 521 4 584 23 q 387 -15 458 -15 m 949 411 l 949 445 q 921 580 949 541 q 844 620 893 620 q 756 557 777 620 q 736 411 736 494 l 949 411 m 276 171 q 315 80 286 115 q 395 45 344 45 q 453 62 424 45 q 498 115 481 79 q 520 204 514 151 q 526 329 526 257 q 516 475 526 408 q 476 577 506 542 q 394 612 445 612 q 294 552 327 612 q 271 470 279 520 q 264 329 264 420 q 266 244 264 269 q 276 171 268 219 "},"!":{"x_min":103,"x_max":341,"ha":444,"o":"m 222 221 q 306 187 271 221 q 341 104 341 154 q 306 19 341 54 q 222 -15 271 -15 q 138 19 173 -15 q 103 103 103 53 q 137 186 103 151 q 222 221 172 221 m 113 818 q 142 910 113 872 q 224 949 171 949 q 304 921 274 949 q 334 847 334 894 q 325 741 334 796 q 306 628 317 687 l 276 462 q 253 296 259 369 l 193 296 q 113 818 153 557 "},"ç":{"x_min":36,"x_max":622,"ha":660,"o":"m 423 600 q 306 528 346 600 q 267 373 267 457 q 313 176 267 265 q 459 88 359 88 q 542 99 500 88 q 612 133 584 111 l 622 126 l 590 19 q 502 -6 551 1 q 406 -15 453 -15 q 141 76 247 -15 q 36 325 36 168 q 140 583 36 485 q 408 681 245 681 q 622 637 519 681 q 590 459 602 550 l 565 459 q 519 561 555 522 q 423 600 483 600 m 175 -203 q 276 -231 251 -226 q 332 -236 301 -236 q 381 -223 361 -236 q 402 -184 402 -211 q 384 -144 402 -161 q 341 -128 366 -128 q 319 -130 328 -128 q 301 -135 310 -132 l 301 2 l 358 2 l 358 -77 l 418 -75 q 496 -108 465 -80 q 527 -183 527 -136 q 487 -274 527 -239 q 388 -310 448 -310 q 268 -299 326 -310 q 151 -265 211 -289 l 175 -203 "},"{":{"x_min":104,"x_max":587.328125,"ha":683,"o":"m 587 844 l 540 844 q 468 821 487 844 q 446 785 449 798 q 443 752 443 773 l 443 712 l 443 552 q 416 424 443 464 q 304 353 390 383 q 413 287 383 335 q 443 155 443 238 l 443 -5 q 465 -105 443 -74 q 555 -136 488 -136 l 587 -136 l 587 -277 l 481 -275 q 343 -234 396 -268 q 280 -122 289 -200 l 280 -50 l 280 116 q 246 238 280 194 q 137 283 212 283 l 104 283 l 104 422 q 240 458 201 422 q 280 588 280 494 l 280 756 l 280 831 q 355 951 292 919 q 517 983 417 983 l 587 983 l 587 844 "},"X":{"x_min":-1.390625,"x_max":801.390625,"ha":782,"o":"m 169 241 l 301 436 l 15 932 q 94 929 38 932 q 155 926 150 926 q 235 929 179 926 q 298 932 291 932 q 314 893 308 907 q 358 802 320 880 l 445 638 q 547 805 513 748 q 613 932 581 862 q 655 929 627 932 q 698 926 683 926 q 740 929 712 926 q 783 932 768 932 q 685 800 709 833 q 616 701 661 766 l 502 531 l 801 0 q 713 2 776 0 q 647 5 651 5 l 516 0 l 470 108 l 356 326 q 265 174 316 263 q 170 0 215 84 q 118 3 154 0 q 77 6 81 6 q 31 4 52 6 q -1 0 11 1 l 169 241 "},"ô":{"x_min":32,"x_max":743,"ha":775,"o":"m 395 683 q 647 588 551 683 q 743 337 743 494 q 648 79 743 173 q 387 -15 554 -15 q 129 78 227 -15 q 32 333 32 172 q 130 590 32 497 q 395 683 229 683 m 325 1003 l 450 1003 l 601 755 l 534 755 l 387 878 l 238 755 l 174 755 l 325 1003 m 269 174 q 307 85 277 120 q 387 50 337 50 q 466 84 437 50 q 500 156 494 119 q 511 215 507 194 q 517 335 517 271 q 511 450 517 395 q 500 509 507 471 q 466 582 494 548 q 387 616 439 616 q 294 564 319 616 q 263 459 269 513 q 258 333 258 406 q 260 244 258 270 q 269 174 262 217 "},"#":{"x_min":30,"x_max":1019,"ha":1049,"o":"m 619 974 l 522 698 l 684 698 l 781 974 l 930 975 l 831 698 l 1019 699 l 970 564 l 783 563 l 725 403 l 920 403 l 873 271 l 678 271 l 579 -5 l 432 -5 l 530 271 l 367 271 l 270 -5 l 121 -5 l 220 270 l 30 271 l 79 403 l 268 403 l 326 563 l 127 564 l 174 699 l 374 698 l 472 975 l 619 974 m 414 402 l 582 402 l 639 563 l 470 563 l 414 402 "},"ι":{"x_min":80,"x_max":314.71875,"ha":396,"o":"m 91 126 l 91 543 l 80 667 q 139 661 105 664 q 196 658 173 658 q 264 661 238 658 q 314 666 291 663 q 304 587 307 616 q 301 523 301 558 l 301 113 q 302 72 301 88 q 314 0 304 56 l 195 4 l 81 0 q 87 67 84 30 q 91 126 91 104 "},"Ά":{"x_min":-28,"x_max":983.109375,"ha":963,"o":"m 242 322 q 326 529 276 400 q 411 751 377 659 q 484 948 445 843 l 553 944 l 623 948 q 805 450 717 684 q 983 0 892 215 l 849 4 l 713 0 l 684 91 l 630 259 q 531 261 581 259 q 433 264 481 262 l 335 259 q 245 0 295 134 l 155 4 l 103 0 l 242 322 m 158 953 q 211 1001 191 986 q 259 1017 231 1017 q 312 994 291 1017 q 333 943 333 972 q 314 897 333 916 q 265 863 295 878 l 40 755 l -28 755 l 158 953 m 487 368 l 597 368 q 549 509 573 446 q 488 662 526 572 q 376 370 428 519 l 487 368 "},")":{"x_min":72.21875,"x_max":383,"ha":449,"o":"m 227 366 q 191 656 227 521 q 76 906 156 792 l 120 949 q 317 691 252 826 q 383 382 383 555 q 317 63 383 201 q 115 -201 252 -75 l 72 -158 q 191 81 156 -48 q 227 366 227 211 "},"ε":{"x_min":55,"x_max":599,"ha":657,"o":"m 512 502 q 472 579 502 548 q 396 611 442 611 q 323 577 352 611 q 295 499 295 544 q 317 429 295 460 q 377 394 340 399 l 449 394 l 449 373 q 449 336 449 349 q 449 316 449 323 q 413 319 438 319 q 322 281 362 319 q 283 195 283 244 q 323 101 283 144 q 412 59 363 59 q 498 88 461 59 q 571 167 535 117 l 599 155 q 593 130 595 144 q 592 104 592 115 q 592 82 592 90 q 599 53 592 74 q 351 -15 485 -15 q 145 30 236 -15 q 55 176 55 75 q 105 289 55 244 q 232 360 155 335 q 127 421 166 385 q 88 516 88 456 q 165 643 88 603 q 340 683 243 683 q 592 612 479 683 q 565 556 576 583 q 551 502 554 530 l 512 502 "},"Δ":{"x_min":11,"x_max":958.328125,"ha":972,"o":"m 490 926 q 531 928 509 926 q 566 932 554 930 q 690 599 633 746 q 815 296 747 452 q 958 0 884 140 q 720 3 879 0 q 481 8 562 8 q 247 3 404 8 q 11 0 90 0 q 234 470 126 223 q 415 932 342 716 q 448 928 429 930 q 490 926 468 926 m 314 373 q 217 127 262 259 q 425 118 314 118 q 542 122 468 118 q 636 127 616 127 q 598 232 616 184 q 538 391 580 280 l 433 645 l 314 373 "},"â":{"x_min":44,"x_max":706.78125,"ha":706,"o":"m 237 -15 q 98 35 153 -15 q 44 169 44 86 q 212 352 44 301 q 401 421 380 403 q 410 439 410 432 q 373 539 410 502 q 275 577 337 577 q 140 511 185 577 l 135 511 l 115 585 q 230 657 164 632 q 365 683 296 683 q 543 623 479 683 q 608 452 608 564 l 604 213 q 604 166 604 184 q 608 123 604 148 q 625 87 612 99 q 658 76 638 76 q 679 80 666 76 q 702 90 691 84 l 706 40 q 643 1 676 14 q 566 -15 610 -10 q 482 5 520 -15 q 421 64 443 25 q 237 -15 351 -15 m 291 1003 l 413 1003 l 566 755 l 501 755 l 350 878 l 203 755 l 138 755 l 291 1003 m 240 200 q 261 128 240 158 q 321 99 282 99 q 388 131 367 99 q 410 211 410 164 l 410 352 q 287 302 335 338 q 240 200 240 267 "},"}":{"x_min":93,"x_max":579,"ha":683,"o":"m 126 983 q 323 955 243 983 q 403 831 403 927 l 403 756 l 403 588 q 423 478 403 512 q 473 434 443 444 q 539 423 504 424 q 579 422 574 422 l 579 283 q 442 249 481 283 q 403 116 403 216 l 403 -50 q 373 -204 403 -147 q 284 -267 343 -260 q 179 -275 225 -274 q 93 -277 133 -277 l 93 -137 q 201 -121 163 -137 q 240 -43 240 -105 l 240 -4 l 240 155 q 269 285 240 241 q 380 353 298 328 q 268 421 296 378 q 240 553 240 463 l 240 713 q 227 805 240 771 q 166 844 215 838 l 93 844 l 93 983 l 126 983 "},"‰":{"x_min":28,"x_max":1618,"ha":1647,"o":"m 265 910 q 434 844 369 910 q 500 672 500 779 q 435 496 500 562 q 258 431 370 431 q 91 498 154 431 q 28 669 28 565 q 93 843 28 776 q 265 910 158 910 m 831 1015 l 917 1014 l 272 -125 l 184 -125 l 831 1015 m 850 463 q 1020 401 955 463 q 1085 230 1085 339 q 1023 51 1085 117 q 846 -15 961 -15 q 678 51 743 -15 q 613 222 613 118 q 676 398 613 333 q 850 463 739 463 m 1383 463 q 1554 400 1490 463 q 1618 229 1618 337 q 1556 51 1618 117 q 1378 -15 1494 -15 q 1209 51 1274 -15 q 1144 222 1144 118 q 1209 396 1144 329 q 1383 463 1274 463 m 780 112 q 798 57 780 83 q 847 31 817 31 q 895 59 874 31 q 916 114 916 87 q 922 222 922 162 q 922 275 922 248 q 915 338 917 312 q 896 389 912 364 q 848 414 880 414 q 813 404 828 414 q 792 375 797 394 q 777 312 781 347 q 773 241 773 276 l 773 222 q 773 183 773 201 q 780 112 774 165 m 196 561 q 214 505 196 532 q 261 478 232 478 q 297 489 280 478 q 323 525 314 501 q 335 586 332 548 q 339 669 339 625 q 337 723 339 697 q 332 780 336 749 q 311 836 327 811 q 264 861 296 861 q 204 820 222 861 q 191 752 194 786 q 188 669 188 719 q 196 561 188 615 m 1315 112 q 1333 56 1315 82 q 1381 31 1351 31 q 1417 42 1402 31 q 1442 76 1433 53 q 1454 138 1451 100 q 1458 222 1458 176 q 1458 275 1458 248 q 1449 344 1453 312 q 1426 395 1445 376 q 1383 414 1408 414 q 1327 379 1338 414 q 1311 301 1315 344 q 1307 222 1307 258 q 1308 164 1307 190 q 1315 112 1309 139 "},"Ä":{"x_min":-28,"x_max":848.390625,"ha":829,"o":"m 109 323 q 187 512 148 413 q 274 740 225 611 q 350 948 323 870 l 420 945 l 492 948 q 666 463 583 687 q 848 0 749 240 l 718 2 l 579 0 l 551 91 l 497 259 q 399 261 448 259 q 300 264 349 262 l 202 259 l 113 0 q 74 2 95 2 q 42 2 53 2 l 21 2 l -28 0 l 109 323 m 284 1242 q 351 1214 323 1242 q 380 1148 380 1187 q 353 1079 380 1108 q 286 1050 327 1050 q 216 1077 245 1050 q 187 1148 187 1105 q 215 1214 187 1187 q 284 1242 243 1242 m 543 1242 q 611 1215 583 1242 q 639 1148 639 1189 q 613 1078 639 1107 q 546 1050 587 1050 q 478 1077 507 1050 q 449 1148 449 1105 q 476 1214 449 1186 q 543 1242 504 1242 m 352 368 l 462 368 q 414 511 437 450 q 350 662 390 571 q 243 370 296 516 l 352 368 "},"a":{"x_min":47,"x_max":708.15625,"ha":706,"o":"m 237 -15 q 100 35 154 -15 q 47 169 47 86 q 213 352 47 301 q 403 422 380 404 q 410 440 410 433 q 373 541 410 504 q 273 579 337 579 q 197 561 232 579 q 140 509 162 544 l 135 509 l 114 585 q 364 683 218 683 q 541 624 478 683 q 604 452 604 566 l 604 214 q 604 169 604 191 q 606 119 604 148 q 656 76 616 76 q 677 79 665 76 q 702 89 690 83 l 708 40 q 563 -11 644 -11 q 479 7 516 -11 q 421 64 441 26 q 339 4 387 23 q 237 -15 291 -15 m 240 198 q 261 127 240 158 q 322 97 282 97 q 388 131 367 97 q 410 212 410 165 l 410 351 q 287 301 334 337 q 240 198 240 266 "},"—":{"x_min":226.390625,"x_max":1138.890625,"ha":1365,"o":"m 226 421 l 1138 421 l 1138 278 l 226 278 l 226 421 "},"=":{"x_min":169.4375,"x_max":968.0625,"ha":1138,"o":"m 968 615 l 968 484 l 169 484 l 169 615 l 968 615 m 968 329 l 968 196 l 169 196 l 169 329 l 968 329 "},"N":{"x_min":86,"x_max":930.453125,"ha":1010,"o":"m 101 444 q 97 645 101 523 q 94 787 94 768 l 90 931 l 177 926 l 268 934 q 526 623 395 775 q 792 327 657 470 l 792 584 q 787 766 792 643 q 782 931 782 888 q 825 927 811 929 q 854 926 838 926 q 890 927 876 926 q 930 934 904 929 q 919 838 923 889 q 915 738 915 788 q 913 461 915 600 q 911 184 912 322 q 913 106 911 147 q 920 0 915 66 q 876 4 901 2 q 838 6 851 6 q 794 4 812 6 q 756 0 777 2 q 495 309 631 151 q 220 618 359 466 l 220 241 l 227 0 q 194 4 213 1 q 159 6 175 6 q 119 4 134 6 q 86 0 103 2 q 97 208 94 105 q 101 444 101 311 "},"ρ":{"x_min":48,"x_max":759,"ha":793,"o":"m 160 -366 q 48 -374 109 -366 q 52 -291 48 -343 q 56 -223 56 -239 l 56 169 l 48 314 q 139 585 48 488 q 403 683 231 683 q 661 589 563 683 q 759 336 759 495 q 681 89 759 194 q 465 -15 603 -15 q 266 65 346 -15 l 264 -208 q 265 -268 264 -241 q 275 -373 267 -295 q 197 -367 220 -368 q 160 -366 173 -366 m 275 347 q 284 196 275 264 q 324 109 295 142 q 404 77 352 77 q 494 120 473 77 q 522 212 514 164 q 531 347 531 260 q 526 431 531 388 q 517 511 522 473 q 483 582 512 549 q 401 615 453 615 q 309 566 340 615 q 279 452 279 517 q 275 372 275 412 l 275 347 "},"2":{"x_min":33,"x_max":706.625,"ha":749,"o":"m 33 75 q 236 249 152 168 q 379 431 321 330 q 438 652 438 533 q 413 772 438 723 q 325 822 389 822 q 220 767 251 822 q 170 616 189 712 l 155 616 q 44 743 107 691 q 189 867 105 823 q 373 911 273 911 q 586 847 500 911 q 673 658 673 783 q 619 480 673 548 q 304 196 566 411 l 430 195 l 553 195 l 706 201 q 689 94 689 148 q 696 38 689 66 q 706 0 703 11 q 514 3 630 0 q 380 7 399 7 q 181 3 302 7 q 44 0 60 0 l 33 75 "},"ü":{"x_min":75,"x_max":722,"ha":808,"o":"m 292 -15 q 142 41 202 -15 q 83 188 83 98 l 83 337 q 79 508 83 394 q 75 666 75 623 q 134 660 108 662 q 185 658 160 658 q 240 660 209 658 q 300 666 271 663 q 290 454 290 569 l 290 384 l 290 279 q 316 146 290 181 q 394 111 343 111 q 467 147 441 111 q 501 234 493 184 l 501 330 q 498 498 501 385 q 495 666 495 610 q 554 660 518 663 q 613 658 589 658 q 671 660 640 658 q 722 666 701 663 q 717 479 722 598 q 712 326 712 359 q 717 156 712 270 q 722 1 722 43 l 617 4 l 511 1 l 511 96 q 410 15 468 46 q 292 -15 353 -15 m 273 976 q 338 948 310 976 q 366 878 366 920 q 339 811 366 839 q 274 784 313 784 q 205 811 234 784 q 176 878 176 839 q 204 947 176 918 q 273 976 232 976 m 531 976 q 599 948 571 976 q 627 878 627 920 q 599 812 627 841 q 533 784 572 784 q 464 811 495 784 q 434 878 434 839 q 462 947 434 918 q 531 976 490 976 "},"Z":{"x_min":25,"x_max":831.953125,"ha":831,"o":"m 25 54 q 186 311 81 142 q 354 582 291 480 q 495 813 418 685 l 294 813 q 98 801 186 813 l 105 852 q 98 932 105 894 l 444 926 q 657 928 509 926 q 815 931 805 931 l 815 903 q 573 517 695 715 q 331 119 451 320 l 566 119 q 706 122 654 119 q 831 136 758 125 q 826 43 826 96 l 827 0 q 606 3 761 0 q 443 6 451 6 q 203 3 370 6 q 25 0 36 0 l 25 54 "},"u":{"x_min":75,"x_max":722,"ha":808,"o":"m 292 -15 q 141 41 200 -15 q 83 189 83 97 l 83 336 q 79 508 83 393 q 75 667 75 624 q 140 659 109 662 q 185 656 171 656 q 251 661 218 656 q 299 666 285 665 l 290 454 l 290 382 l 290 279 q 316 147 290 182 q 393 112 343 112 q 464 146 441 112 q 497 234 488 181 l 501 331 q 497 498 501 387 q 493 667 493 610 q 563 659 531 662 q 612 656 594 656 q 672 661 640 656 q 722 666 703 665 q 716 495 722 609 q 711 326 711 381 q 716 163 711 272 q 722 1 722 55 l 616 4 l 511 1 l 511 94 q 411 15 470 45 q 292 -15 353 -15 "},"k":{"x_min":80,"x_max":732.765625,"ha":756,"o":"m 93 550 q 86 827 93 648 q 80 1024 80 1005 q 184 1018 125 1018 q 307 1023 252 1018 q 301 812 307 959 q 296 602 296 665 l 296 389 q 424 511 368 445 q 545 666 481 576 q 595 665 562 666 q 645 663 628 663 l 709 666 l 714 656 l 628 576 l 475 425 q 636 154 543 304 l 732 0 q 661 3 706 0 q 607 6 616 6 q 537 3 580 6 q 487 0 494 0 q 386 174 441 83 q 296 329 332 266 q 299 141 296 273 q 302 0 302 9 l 191 4 l 80 0 q 86 320 80 113 q 93 550 93 526 "},"Η":{"x_min":91,"x_max":955,"ha":1049,"o":"m 105 286 l 105 459 q 101 650 105 533 q 98 784 98 766 l 91 932 q 156 926 125 929 q 214 923 187 923 q 277 926 241 923 q 344 931 314 929 q 339 818 344 894 q 334 713 334 741 l 334 563 l 514 561 l 710 561 l 710 712 q 707 812 710 778 q 697 932 705 846 q 764 926 727 929 q 828 923 800 923 q 889 926 854 923 q 955 931 924 929 q 948 690 955 856 q 941 465 941 523 q 948 225 941 391 q 955 0 955 58 l 828 5 q 764 2 807 5 q 698 0 721 0 q 707 99 704 47 q 710 202 710 152 l 710 444 q 595 447 665 444 q 514 451 525 451 q 411 447 475 451 q 334 444 346 444 l 334 202 q 339 97 334 167 q 344 0 344 26 q 270 2 323 0 q 214 5 218 5 l 91 0 q 98 146 91 40 q 105 286 105 252 "},"Α":{"x_min":-29.171875,"x_max":850,"ha":829,"o":"m 109 322 q 193 530 143 400 q 278 751 244 660 q 351 949 312 843 l 420 944 l 490 949 q 672 450 584 685 q 850 0 759 215 l 716 4 l 580 0 l 551 91 l 497 259 q 398 261 448 259 q 300 264 348 262 l 202 259 q 112 0 162 134 l 22 4 l -29 0 l 109 322 m 354 368 l 464 368 q 416 509 440 446 q 355 662 393 572 q 243 370 295 519 l 354 368 "},"ß":{"x_min":84,"x_max":776,"ha":811,"o":"m 198 4 l 84 1 q 87 120 84 45 q 91 212 91 195 l 91 352 l 91 651 q 167 928 91 832 q 420 1024 243 1024 q 603 985 522 1024 q 684 854 684 946 q 607 713 684 786 q 530 601 530 640 q 543 563 530 583 q 574 533 556 543 l 688 447 q 776 275 776 379 q 690 67 776 150 q 478 -15 605 -15 q 373 8 428 -15 l 403 161 l 417 161 q 461 88 435 113 q 535 64 488 64 q 600 91 574 64 q 626 157 626 118 q 504 316 626 219 q 377 476 383 413 q 459 650 377 547 q 542 822 542 754 q 511 908 542 873 q 428 943 481 943 q 327 892 361 943 q 294 770 294 841 q 296 495 294 602 q 301 238 298 387 q 304 1 304 88 l 198 4 "},"é":{"x_min":41,"x_max":684.046875,"ha":729,"o":"m 482 98 q 566 112 532 98 q 643 160 600 126 l 661 151 q 643 96 652 125 q 628 40 634 66 q 521 -1 577 11 q 403 -15 466 -15 q 141 79 241 -15 q 41 336 41 173 q 137 586 41 490 q 386 683 234 683 q 608 601 532 683 q 684 373 684 520 l 684 332 l 267 332 q 325 165 267 232 q 482 98 383 98 m 409 951 q 459 1000 436 983 q 511 1017 481 1017 q 563 994 542 1017 q 585 943 585 971 q 565 895 585 915 q 515 861 545 875 l 292 754 l 223 754 l 409 951 m 478 411 q 481 444 481 422 q 459 566 481 513 q 377 620 438 620 q 292 562 318 620 q 267 437 267 505 l 267 411 l 478 411 "},"s":{"x_min":43,"x_max":543,"ha":583,"o":"m 95 197 q 155 95 115 133 q 256 57 195 57 q 338 77 300 57 q 376 140 376 98 q 213 259 376 195 q 51 456 51 323 q 129 623 51 563 q 319 683 208 683 q 411 671 366 683 q 515 638 455 660 l 464 485 l 450 485 q 397 575 433 542 q 303 608 362 608 q 234 588 264 608 q 205 530 205 569 q 374 417 205 478 q 543 227 543 356 q 464 48 543 112 q 266 -15 386 -15 q 148 -6 201 -15 q 43 26 95 3 l 76 197 l 95 197 "},"B":{"x_min":91,"x_max":773,"ha":815,"o":"m 109 208 l 109 465 q 105 714 109 605 q 91 932 102 823 l 250 929 l 417 929 q 655 881 560 929 q 751 707 751 834 q 692 566 751 618 q 542 503 634 515 l 542 491 q 704 431 636 491 q 773 276 773 372 q 678 69 773 138 q 438 0 584 0 l 250 4 q 152 2 211 4 q 91 0 92 0 q 103 104 97 51 q 109 208 109 158 m 519 698 q 479 803 519 763 q 374 844 440 844 l 335 839 q 331 687 331 766 l 331 540 q 466 578 413 540 q 519 698 519 617 m 380 87 q 490 137 450 87 q 531 258 531 187 q 484 392 531 338 q 360 446 437 446 l 331 446 l 331 276 l 335 91 l 380 87 "},"…":{"x_min":93,"x_max":1053,"ha":1182,"o":"m 195 191 q 268 160 236 191 q 300 88 300 129 q 268 16 300 46 q 195 -13 237 -13 q 123 16 154 -13 q 93 88 93 45 q 123 160 93 129 q 195 191 154 191 m 575 191 q 647 160 615 191 q 679 88 679 129 q 647 16 679 46 q 575 -13 616 -13 q 501 16 532 -13 q 471 88 471 45 q 501 160 471 129 q 575 191 532 191 m 948 191 q 1021 160 989 191 q 1053 88 1053 129 q 1021 16 1053 46 q 948 -13 990 -13 q 876 16 907 -13 q 846 88 846 45 q 876 160 846 129 q 948 191 907 191 "},"?":{"x_min":93,"x_max":539,"ha":597,"o":"m 295 221 q 377 186 340 221 q 414 104 414 152 q 378 23 414 61 q 295 -15 343 -15 q 210 19 245 -15 q 175 103 175 53 q 211 183 175 146 q 295 221 247 221 m 433 288 q 378 277 411 280 q 339 275 344 275 q 201 329 261 275 q 142 459 142 383 q 238 620 142 530 q 335 777 335 709 q 310 838 335 812 q 252 864 286 864 q 175 838 211 864 q 119 775 138 813 l 101 777 q 93 891 101 843 q 294 949 181 949 q 467 890 395 949 q 539 730 539 832 q 429 554 539 644 q 320 407 320 464 q 338 363 320 378 q 386 349 357 349 q 421 353 403 349 q 448 358 439 357 l 433 288 "},"H":{"x_min":91,"x_max":957,"ha":1049,"o":"m 105 284 l 105 461 q 101 651 105 534 q 98 787 98 768 l 91 932 q 153 927 107 932 q 222 922 200 922 q 288 926 252 922 q 345 932 324 930 q 336 827 339 886 q 334 712 334 769 l 334 564 l 515 560 l 710 564 l 710 712 q 699 932 710 833 q 767 927 721 932 q 829 922 813 922 q 895 927 851 922 q 956 932 940 932 q 943 702 947 829 q 939 461 939 576 q 942 217 939 306 q 957 0 945 128 q 883 3 930 0 q 829 6 837 6 q 755 3 804 6 q 698 0 706 0 q 707 97 704 35 q 710 201 710 158 l 710 445 q 599 447 676 445 q 515 450 522 450 l 334 445 l 334 201 q 336 88 334 120 q 345 0 338 56 q 278 2 322 0 q 215 5 234 5 q 153 2 194 5 q 91 0 111 0 q 98 146 91 40 q 105 284 105 252 "},"ν":{"x_min":9,"x_max":658,"ha":694,"o":"m 470 438 q 463 504 470 477 q 422 642 457 532 q 641 671 528 660 q 658 582 658 626 q 614 412 658 494 l 541 270 q 462 107 487 161 q 417 0 438 53 q 374 3 403 0 q 331 8 345 8 q 289 3 317 8 q 246 0 261 0 q 165 236 209 110 q 85 458 121 361 q 9 667 49 555 q 72 661 40 664 q 128 659 103 659 q 184 661 152 659 q 245 666 217 664 q 403 184 300 449 q 454 328 438 275 q 470 438 470 381 "},"î":{"x_min":-15,"x_max":413,"ha":396,"o":"m 93 126 l 93 543 q 87 602 93 558 q 82 666 82 645 q 141 661 111 664 q 198 659 172 659 q 255 661 223 659 q 316 666 287 664 q 311 621 315 658 q 303 544 307 584 l 303 319 q 305 144 303 212 q 316 0 307 76 l 196 2 l 81 0 q 93 126 93 66 m 136 1003 l 258 1003 l 413 755 l 345 755 l 198 878 l 50 755 l -15 755 l 136 1003 "},"c":{"x_min":36,"x_max":623.109375,"ha":660,"o":"m 421 600 q 306 530 344 600 q 268 376 268 461 q 313 177 268 266 q 459 88 359 88 q 539 99 498 88 q 608 135 580 111 l 617 126 l 587 21 q 500 -5 546 3 q 404 -15 454 -15 q 140 76 245 -15 q 36 324 36 168 q 140 583 36 484 q 406 683 245 683 q 623 638 514 683 q 607 570 617 620 q 587 462 596 520 l 562 462 q 515 561 550 522 q 421 600 480 600 "},"¶":{"x_min":18,"x_max":531,"ha":590,"o":"m 298 968 l 531 968 l 531 910 l 473 910 l 473 4 l 415 4 l 415 910 l 305 910 l 305 4 l 247 4 l 247 558 q 99 601 163 558 q 27 690 36 645 q 18 744 18 734 q 90 896 18 824 q 298 968 163 968 "},"β":{"x_min":82,"x_max":753,"ha":828,"o":"m 91 -115 q 86 188 91 -19 q 82 493 82 397 q 85 654 82 597 q 102 796 88 711 q 205 951 115 882 q 421 1021 294 1021 q 626 953 540 1021 q 713 770 713 886 q 671 634 713 690 q 553 542 629 579 q 700 438 647 506 q 753 273 753 369 q 680 68 753 152 q 490 -15 608 -15 q 390 0 435 -15 q 298 50 345 16 l 298 -105 l 306 -371 q 246 -365 278 -368 q 192 -362 214 -362 q 138 -365 169 -362 q 82 -370 108 -368 q 86 -238 82 -327 q 91 -115 91 -148 m 372 572 q 474 623 445 572 q 503 757 503 674 q 484 897 503 839 q 403 956 466 956 q 332 908 354 956 q 305 807 310 861 q 299 683 300 752 q 298 551 298 613 l 298 269 q 320 131 298 188 q 412 75 343 75 q 501 135 477 75 q 525 273 525 195 q 496 431 525 377 q 372 486 467 486 l 372 572 "},"Μ":{"x_min":32,"x_max":1165,"ha":1217,"o":"m 105 465 l 168 932 q 211 927 190 929 q 261 926 231 926 q 309 929 277 926 q 358 932 341 932 q 441 709 409 790 q 503 559 473 629 q 608 316 533 488 l 778 690 q 872 932 834 808 q 919 929 887 932 q 966 926 951 926 q 1027 929 1006 926 q 1059 932 1048 932 l 1105 473 q 1130 240 1117 354 q 1165 0 1144 127 q 1095 3 1140 0 q 1041 6 1051 6 q 969 3 1015 6 q 915 0 924 0 q 895 291 915 142 l 865 616 q 731 317 802 480 q 597 0 661 153 l 551 0 l 500 0 q 409 218 465 87 q 317 426 352 349 q 236 605 282 504 l 196 229 q 185 108 190 173 q 180 0 180 44 q 134 3 165 0 q 100 6 102 6 q 60 4 77 6 q 32 0 43 1 q 105 465 77 258 "},"Ό":{"x_min":-28,"x_max":1364,"ha":1407,"o":"m 855 949 q 1223 829 1082 949 q 1364 486 1364 710 q 1220 114 1364 244 q 830 -15 1076 -15 q 454 107 591 -15 q 318 465 318 229 q 466 823 318 697 q 855 949 615 949 m 158 953 q 211 1001 191 986 q 259 1017 231 1017 q 312 994 291 1017 q 333 943 333 972 q 314 897 333 916 q 265 863 295 878 l 40 755 l -28 755 l 158 953 m 840 73 q 1051 194 984 73 q 1118 472 1118 315 q 1051 742 1118 624 q 844 860 984 860 q 631 742 698 860 q 565 465 565 624 q 631 193 565 313 q 840 73 698 73 "},"Ή":{"x_min":-28,"x_max":1333.109375,"ha":1424,"o":"m 482 284 l 482 460 q 478 651 482 534 q 474 787 474 768 l 468 931 q 530 927 484 931 q 599 922 577 922 q 665 926 629 922 q 722 931 701 930 q 713 827 716 886 q 711 711 711 769 l 711 563 l 891 560 l 1086 564 l 1086 712 q 1075 931 1086 833 q 1143 927 1097 931 q 1205 922 1190 922 q 1272 927 1227 922 q 1333 931 1316 931 q 1319 702 1323 829 q 1315 460 1315 576 q 1318 217 1315 306 q 1333 0 1321 128 q 1260 3 1306 0 q 1205 6 1213 6 q 1131 3 1180 6 q 1074 0 1083 0 q 1083 97 1080 35 q 1086 201 1086 158 l 1086 444 q 975 447 1052 444 q 891 450 898 450 l 711 444 l 711 201 q 713 88 711 120 q 722 0 715 56 q 655 2 699 0 q 592 5 611 5 q 530 2 571 5 q 468 0 488 0 q 475 146 468 40 q 482 284 482 252 m 158 953 q 211 1001 191 986 q 259 1017 231 1017 q 312 994 291 1017 q 333 943 333 972 q 314 897 333 916 q 265 863 295 878 l 40 755 l -28 755 l 158 953 "},"•":{"x_min":215.28125,"x_max":805.5625,"ha":1024,"o":"m 512 803 q 718 714 631 803 q 805 505 805 626 q 719 299 805 387 q 512 212 633 212 q 301 298 387 212 q 215 505 215 384 q 303 714 215 626 q 512 803 391 803 "},"¥":{"x_min":8,"x_max":752,"ha":764,"o":"m 38 252 l 38 336 l 160 332 l 277 332 l 277 417 q 140 413 225 417 q 38 410 55 410 l 38 494 q 131 486 87 486 l 228 486 l 143 644 q 87 751 114 704 q 8 888 60 799 q 82 884 34 888 q 138 881 130 881 q 213 884 167 881 q 265 888 258 888 q 433 529 349 696 q 524 707 478 613 q 608 888 571 802 q 640 888 624 888 q 674 888 657 888 l 752 888 q 602 642 653 729 q 516 486 551 554 l 722 494 l 722 410 q 583 413 668 410 q 485 417 497 417 l 485 331 l 722 336 l 722 252 q 604 255 690 252 q 485 258 518 258 q 490 123 485 213 q 495 0 495 33 l 386 5 q 316 2 364 5 q 264 0 268 0 q 274 126 271 59 q 277 258 277 194 q 140 255 235 258 q 38 252 45 252 "},"(":{"x_min":91,"x_max":403.5,"ha":449,"o":"m 249 479 l 249 379 l 249 277 q 287 54 249 161 q 402 -158 326 -53 l 356 -201 q 158 57 225 -80 q 91 365 91 195 q 158 683 91 541 q 359 949 225 825 l 403 906 q 288 701 328 808 q 249 479 249 594 "},"U":{"x_min":82,"x_max":910,"ha":999,"o":"m 211 926 q 275 929 232 926 q 338 932 318 932 q 325 681 329 826 q 321 421 321 536 q 373 175 321 241 q 521 110 425 110 q 678 161 611 110 q 755 278 746 212 q 768 419 765 344 q 771 547 771 494 q 754 931 771 761 l 812 926 l 910 932 q 903 769 910 882 q 896 615 896 655 l 896 480 q 896 427 896 462 q 896 375 896 391 q 793 82 896 180 q 494 -15 691 -15 q 211 55 323 -15 q 100 286 100 126 q 91 616 100 383 q 82 932 82 850 q 154 929 102 932 q 211 926 207 926 "},"γ":{"x_min":0,"x_max":713.890625,"ha":700,"o":"m 523 199 q 486 87 498 128 q 474 -62 474 47 q 477 -246 474 -135 q 481 -374 481 -357 q 407 -366 442 -368 q 326 -365 373 -365 l 250 -370 q 258 -204 250 -315 q 267 -72 267 -93 q 246 138 267 52 q 189 344 225 224 q 130 512 154 463 q 50 561 105 561 q 25 558 38 561 q 0 553 11 555 l 0 635 q 79 669 38 656 q 159 683 119 683 q 329 593 293 683 q 433 233 365 503 q 519 456 482 349 q 576 666 555 562 l 644 663 l 713 666 q 633 490 665 572 q 523 199 601 408 "},"α":{"x_min":30,"x_max":827.21875,"ha":878,"o":"m 669 665 l 749 662 l 827 665 q 763 499 782 551 q 720 377 743 447 l 818 0 q 763 6 792 2 q 717 10 733 10 q 662 5 692 10 q 615 0 632 1 l 594 101 q 361 -15 501 -15 q 120 83 210 -15 q 30 334 30 182 q 123 583 30 484 q 368 683 217 683 q 515 647 449 683 q 633 547 582 612 q 651 601 640 563 q 669 665 662 638 m 383 614 q 313 588 343 614 q 276 523 283 562 q 260 434 265 484 q 256 333 256 385 q 269 174 256 249 q 305 87 275 122 q 385 52 335 52 q 509 144 473 52 q 546 340 546 236 q 522 504 546 428 q 455 597 498 580 q 383 614 411 614 "},"F":{"x_min":91,"x_max":645.15625,"ha":686,"o":"m 109 465 q 105 710 109 620 q 91 932 102 800 l 357 926 q 520 929 406 926 q 645 932 635 932 l 638 871 q 645 810 638 844 q 524 815 607 810 q 415 820 442 820 l 339 820 q 337 663 339 778 q 335 546 335 548 l 634 557 l 629 494 l 634 431 q 462 437 573 431 q 335 443 350 443 l 335 236 q 337 106 335 149 q 348 0 339 62 l 219 2 l 91 0 q 105 209 102 102 q 109 465 109 316 "},"­":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 0 421 l 683 421 l 683 278 l 0 278 l 0 421 "},":":{"x_min":105,"x_max":343,"ha":447,"o":"m 223 221 q 307 185 272 221 q 343 103 343 150 q 306 19 343 54 q 223 -15 270 -15 q 139 18 174 -15 q 105 103 105 51 q 139 186 105 151 q 223 221 174 221 m 223 654 q 306 617 270 654 q 343 532 343 581 q 306 450 343 485 q 223 416 270 416 q 139 449 174 416 q 105 534 105 482 q 139 619 105 584 q 223 654 174 654 "},"Χ":{"x_min":-1.390625,"x_max":801.390625,"ha":782,"o":"m 169 241 l 301 436 l 15 932 q 94 929 38 932 q 155 926 150 926 q 235 929 179 926 q 298 932 291 932 q 314 893 308 907 q 358 802 320 880 l 445 638 q 547 805 513 748 q 613 932 581 862 q 655 929 627 932 q 698 926 683 926 q 740 929 712 926 q 783 932 768 932 q 685 800 709 833 q 616 701 661 766 l 502 531 l 801 0 q 713 2 776 0 q 647 5 651 5 l 516 0 l 470 108 l 356 326 q 265 174 316 263 q 170 0 215 84 q 118 3 154 0 q 77 6 81 6 q 31 4 52 6 q -1 0 11 1 l 169 241 "},"*":{"x_min":91,"x_max":588,"ha":683,"o":"m 154 520 q 128 571 139 550 q 91 634 117 593 q 186 665 139 650 q 284 698 234 680 q 190 734 242 716 q 91 765 139 751 q 154 879 125 816 l 310 750 l 298 808 l 275 949 l 339 947 l 405 948 l 368 745 l 525 879 q 588 765 553 822 q 398 698 499 737 q 490 664 441 680 q 588 634 539 648 q 557 581 574 612 q 525 520 540 551 l 370 650 q 389 528 381 580 q 404 443 397 476 l 337 446 l 273 446 l 310 650 l 154 520 "},"°":{"x_min":165,"x_max":519,"ha":683,"o":"m 165 913 q 221 1032 165 980 q 351 1084 278 1084 q 469 1040 420 1084 q 519 926 519 996 q 464 804 519 853 q 335 755 409 755 q 214 799 264 755 q 165 913 165 844 m 241 905 q 268 832 241 863 q 338 801 295 801 q 414 837 388 801 q 441 927 441 874 q 416 1009 441 977 q 345 1042 392 1042 q 281 1018 310 1042 q 247 962 253 994 q 241 905 241 930 "},"V":{"x_min":-19.4375,"x_max":856.953125,"ha":818,"o":"m 255 230 l -19 932 q 61 929 4 932 q 120 926 117 926 l 247 932 q 298 768 270 840 l 476 296 l 646 770 q 673 852 662 812 q 692 932 685 891 l 766 926 q 812 929 781 926 q 856 932 843 932 q 752 706 801 819 l 566 231 q 488 0 520 123 q 445 4 463 2 q 413 6 427 6 q 368 3 397 6 q 336 0 340 0 q 304 97 322 46 q 255 230 286 147 "},"Ξ":{"x_min":58.328125,"x_max":816.671875,"ha":876,"o":"m 438 190 q 653 193 518 190 q 816 197 788 197 q 812 124 812 160 l 812 99 q 812 51 812 74 q 816 0 812 27 q 629 4 754 0 q 438 8 504 8 q 248 4 375 8 q 58 0 122 0 l 63 98 l 58 197 q 281 193 145 197 q 438 190 418 190 m 438 747 q 258 743 379 747 q 77 739 137 739 q 84 804 83 784 q 84 834 84 823 q 77 932 84 879 q 267 927 140 932 q 438 922 394 922 q 626 927 500 922 q 797 932 752 932 l 793 835 l 797 739 q 619 743 738 739 q 438 747 500 747 m 708 467 l 713 375 q 577 379 669 375 q 438 383 486 383 q 300 379 391 383 q 162 375 208 375 q 165 418 163 397 q 168 468 168 440 q 165 523 168 484 q 162 567 162 562 q 438 554 300 554 q 713 566 577 554 l 708 467 "}," ":{"x_min":0,"x_max":0,"ha":375},"Ϋ":{"x_min":-32,"x_max":797,"ha":747,"o":"m 133 650 q 52 795 94 720 q -32 931 11 869 l 91 928 l 256 932 q 365 700 329 773 q 441 554 401 627 q 541 731 491 634 q 636 932 590 827 l 711 928 l 797 932 q 644 689 714 812 q 498 420 573 566 l 502 143 l 509 0 l 413 5 l 256 0 q 261 118 256 38 q 267 236 267 197 l 267 402 l 133 650 m 242 1242 q 309 1215 281 1242 q 337 1148 337 1189 q 311 1078 337 1107 q 243 1050 285 1050 q 173 1078 203 1050 q 144 1148 144 1107 q 173 1214 144 1186 q 242 1242 202 1242 m 502 1242 q 571 1214 542 1242 q 600 1148 600 1187 q 572 1078 600 1107 q 505 1050 545 1050 q 435 1077 463 1050 q 408 1148 408 1105 q 435 1214 408 1186 q 502 1242 463 1242 "},"0":{"x_min":34,"x_max":709,"ha":749,"o":"m 367 -19 q 104 104 175 -19 q 34 436 34 228 q 109 777 34 644 q 377 910 184 910 q 640 785 572 910 q 709 443 709 660 q 635 108 709 236 q 367 -19 561 -19 m 260 447 q 261 330 260 382 q 269 213 262 279 q 296 101 276 147 q 374 56 316 56 q 453 108 430 56 q 477 221 477 160 q 480 287 478 254 q 483 458 483 365 q 480 590 483 543 q 477 665 478 637 q 452 779 477 727 q 372 832 428 832 q 281 765 299 832 q 263 598 263 698 q 261 505 263 561 q 260 447 260 448 "},"”":{"x_min":72.21875,"x_max":615.28125,"ha":654,"o":"m 72 528 l 152 848 q 183 920 159 891 q 245 949 206 949 q 311 926 286 949 q 337 861 337 903 q 315 797 337 827 l 112 511 l 72 528 m 351 528 l 430 848 q 462 919 437 889 q 525 949 487 949 q 588 925 562 949 q 615 864 615 901 q 609 829 615 845 q 594 797 604 813 l 391 511 l 351 528 "},"@":{"x_min":59,"x_max":1305,"ha":1365,"o":"m 581 72 q 418 131 475 72 q 362 298 362 191 q 455 554 362 437 q 684 672 548 672 q 771 650 734 672 q 843 586 808 629 l 877 653 l 998 653 l 897 254 l 893 229 q 912 193 893 205 q 957 181 931 181 q 1119 290 1056 181 q 1183 504 1183 399 q 1060 772 1183 668 q 771 877 937 877 q 354 735 526 877 q 183 353 183 594 q 327 20 183 140 q 689 -100 471 -100 q 898 -66 792 -100 q 1092 25 1004 -33 l 1143 -51 q 689 -204 945 -204 q 244 -54 429 -204 q 59 348 59 94 q 261 804 59 621 q 739 988 464 988 q 1134 856 964 988 q 1305 505 1305 725 q 1195 206 1305 340 q 920 72 1085 72 l 895 72 q 818 90 846 72 q 777 180 791 108 q 691 99 739 127 q 581 72 643 72 m 693 578 q 552 487 600 578 q 505 294 505 397 q 532 207 505 245 q 606 169 560 169 q 712 212 668 169 q 772 322 756 256 l 808 466 q 773 546 804 515 q 693 578 742 578 "},"Ί":{"x_min":-28,"x_max":728,"ha":822,"o":"m 485 402 q 481 715 485 609 q 468 931 477 822 q 535 925 498 929 q 594 922 572 922 q 666 927 620 922 q 727 931 713 931 q 714 716 717 819 q 711 465 711 613 q 714 221 711 326 q 728 0 718 116 q 647 2 704 0 q 588 5 590 5 l 469 0 q 481 199 477 88 q 485 402 485 310 m 157 953 q 210 1001 190 986 q 258 1017 230 1017 q 311 994 290 1017 q 332 943 332 972 q 313 897 332 916 q 264 863 294 878 l 40 755 l -28 755 l 157 953 "},"ö":{"x_min":32,"x_max":743,"ha":775,"o":"m 395 683 q 647 588 551 683 q 743 337 743 494 q 648 79 743 173 q 387 -15 554 -15 q 129 78 227 -15 q 32 333 32 172 q 130 590 32 497 q 395 683 229 683 m 257 976 q 324 948 296 976 q 352 878 352 920 q 325 811 352 839 q 258 784 299 784 q 190 811 221 784 q 160 878 160 839 q 188 947 160 918 q 257 976 217 976 m 517 976 q 585 948 557 976 q 613 878 613 920 q 586 811 613 839 q 519 784 560 784 q 450 811 479 784 q 421 878 421 839 q 449 947 421 918 q 517 976 478 976 m 269 174 q 307 85 277 120 q 387 50 337 50 q 466 84 437 50 q 500 156 494 119 q 511 215 507 194 q 517 335 517 271 q 511 450 517 395 q 500 509 507 471 q 466 582 494 548 q 387 616 439 616 q 294 564 319 616 q 263 459 269 513 q 258 333 258 406 q 260 244 258 270 q 269 174 262 217 "},"i":{"x_min":80,"x_max":314.71875,"ha":396,"o":"m 196 1014 q 273 980 240 1014 q 307 902 307 947 q 274 825 307 858 q 196 793 241 793 q 118 824 151 793 q 85 902 85 856 q 118 980 85 947 q 196 1014 151 1014 m 91 127 l 91 543 l 80 666 q 140 660 109 663 q 196 658 171 658 q 253 660 223 658 q 314 666 284 663 l 301 545 l 301 319 q 302 145 301 206 q 312 0 304 84 l 194 4 l 81 0 q 88 64 85 33 q 91 127 91 95 "},"Β":{"x_min":91,"x_max":773,"ha":815,"o":"m 109 208 l 109 465 q 105 714 109 605 q 91 932 102 823 l 250 929 l 417 929 q 655 881 560 929 q 751 707 751 834 q 692 566 751 618 q 542 503 634 515 l 542 491 q 704 431 636 491 q 773 276 773 372 q 678 69 773 138 q 438 0 584 0 l 250 4 q 152 2 211 4 q 91 0 92 0 q 103 104 97 51 q 109 208 109 158 m 519 698 q 479 803 519 763 q 374 844 440 844 l 335 839 q 331 687 331 766 l 331 540 q 466 578 413 540 q 519 698 519 617 m 380 87 q 490 137 450 87 q 531 258 531 187 q 484 392 531 338 q 360 446 437 446 l 331 446 l 331 276 l 335 91 l 380 87 "},"≤":{"x_min":170.984375,"x_max":962.28125,"ha":1139,"o":"m 960 690 l 403 514 l 960 338 l 960 200 l 171 455 l 170 572 l 960 830 l 960 690 m 962 132 l 962 0 l 171 0 l 171 132 l 962 132 "},"υ":{"x_min":82,"x_max":765,"ha":843,"o":"m 765 416 q 663 115 765 245 q 401 -15 562 -15 q 162 56 243 -15 q 82 284 82 128 l 86 479 q 84 590 86 523 q 82 666 82 656 q 145 663 99 666 q 195 661 191 661 q 263 663 216 661 q 311 666 309 666 q 295 477 301 566 q 290 294 290 387 q 310 122 290 193 q 402 52 330 52 q 515 146 487 52 q 544 351 544 240 q 525 502 544 433 q 469 656 507 570 q 580 659 528 656 q 684 673 632 662 q 743 548 721 614 q 765 416 765 482 "},"]":{"x_min":76,"x_max":385.71875,"ha":454,"o":"m 80 -129 l 76 -85 l 227 -88 q 231 134 227 -14 q 235 356 235 282 q 231 605 235 438 q 227 855 227 771 l 164 855 l 76 855 l 80 885 q 80 908 80 896 q 76 931 77 925 l 230 926 l 385 933 l 373 566 l 373 359 l 373 199 l 383 -164 l 227 -157 q 141 -160 195 -157 q 76 -164 86 -164 l 80 -129 "},"m":{"x_min":80,"x_max":1135,"ha":1217,"o":"m 91 329 q 85 517 91 394 q 80 667 80 640 l 184 662 l 293 666 l 293 571 q 392 651 334 619 q 511 683 450 683 q 628 653 579 683 q 700 559 676 623 q 791 651 733 620 q 921 683 849 683 q 1068 624 1011 683 q 1125 477 1125 566 l 1125 331 q 1130 158 1125 274 q 1135 0 1135 41 q 1070 2 1116 0 q 1019 5 1024 5 q 954 2 999 5 q 905 0 909 0 q 910 155 905 51 q 915 298 915 259 l 915 385 q 896 506 915 458 q 818 554 877 554 q 755 528 779 554 q 719 460 730 502 q 712 381 714 426 q 710 319 710 335 q 715 153 710 265 q 720 0 720 41 q 656 3 694 0 q 608 6 617 6 q 544 3 585 6 q 496 0 504 0 q 501 155 496 51 q 506 298 506 259 l 506 385 q 487 505 506 456 q 409 554 469 554 q 346 528 370 554 q 310 460 321 502 q 303 381 305 426 q 301 319 301 335 q 306 153 301 265 q 311 0 311 41 q 243 3 284 0 q 195 6 202 6 q 128 3 170 6 q 80 0 86 0 q 85 163 80 53 q 91 329 91 273 "},"χ":{"x_min":15.28125,"x_max":730.5625,"ha":731,"o":"m 569 380 l 472 204 l 545 31 q 631 -159 586 -62 q 729 -368 676 -255 l 600 -363 q 475 -371 537 -363 q 404 -147 438 -259 l 350 1 l 268 -155 q 218 -260 242 -204 q 176 -371 194 -316 q 105 -363 143 -363 q 16 -371 62 -363 q 97 -240 52 -319 q 197 -66 141 -162 l 298 111 l 168 423 q 130 509 148 466 q 63 568 101 563 l 15 564 l 15 638 q 166 683 83 683 q 286 628 252 683 q 367 445 320 573 l 422 318 l 499 479 q 572 665 544 582 l 634 662 q 697 665 674 662 q 730 668 719 668 l 569 380 "},"8":{"x_min":34,"x_max":710,"ha":749,"o":"m 511 492 q 654 412 598 471 q 710 266 710 352 q 607 53 710 128 q 360 -21 504 -21 q 131 50 229 -21 q 34 248 34 122 q 88 406 34 341 q 235 492 143 471 l 235 502 q 117 568 164 516 q 71 689 71 620 q 165 855 71 802 q 382 908 259 908 q 584 857 498 908 q 671 696 671 806 q 628 574 671 621 q 511 502 586 526 l 511 492 m 373 528 q 456 573 432 528 q 481 684 481 618 q 458 792 481 748 q 376 836 435 836 q 290 791 316 836 q 264 683 264 747 q 291 575 264 622 q 373 528 318 528 m 369 55 q 464 117 439 55 q 489 259 489 180 q 465 396 489 335 q 379 457 441 457 q 285 393 314 457 q 256 256 256 329 q 278 114 256 174 q 369 55 301 55 "},"ί":{"x_min":80,"x_max":478.609375,"ha":396,"o":"m 91 126 l 91 543 l 80 666 q 139 660 105 663 q 196 658 173 658 q 264 660 238 658 q 314 666 291 663 q 304 586 307 616 q 301 523 301 557 l 301 113 q 302 72 301 88 q 314 0 304 56 l 195 4 l 81 0 q 87 67 84 30 q 91 126 91 104 m 303 953 q 357 1001 337 986 q 406 1017 377 1017 q 457 994 437 1017 q 478 943 478 972 q 459 897 478 915 q 410 863 441 878 l 187 755 l 118 755 l 303 953 "},"Ζ":{"x_min":25,"x_max":831.953125,"ha":831,"o":"m 25 54 q 186 311 81 142 q 354 582 291 480 q 495 813 418 685 l 294 813 q 98 801 186 813 l 105 852 q 98 932 105 894 l 444 926 q 657 928 509 926 q 815 931 805 931 l 815 903 q 573 517 695 715 q 331 119 451 320 l 566 119 q 706 122 654 119 q 831 136 758 125 q 826 43 826 96 l 827 0 q 606 3 761 0 q 443 6 451 6 q 203 3 370 6 q 25 0 36 0 l 25 54 "},"R":{"x_min":87,"x_max":860.609375,"ha":836,"o":"m 106 398 q 96 663 106 486 q 87 931 87 841 l 182 927 q 295 932 207 927 q 420 938 382 938 q 699 874 625 938 q 773 697 773 811 q 713 538 773 603 q 560 465 654 474 q 701 235 627 350 q 860 0 775 120 l 753 5 l 578 0 q 469 202 531 100 q 320 438 408 304 l 320 258 q 322 114 320 154 q 331 0 324 75 q 261 3 304 0 q 211 6 217 6 q 140 3 184 6 q 87 0 95 0 q 96 198 87 65 q 106 398 106 331 m 544 689 q 505 805 544 760 q 397 850 467 850 l 324 850 l 320 696 l 320 506 q 483 548 422 506 q 544 689 544 590 "},"×":{"x_min":183.828125,"x_max":970.171875,"ha":1139,"o":"m 577 501 l 877 800 l 970 706 l 670 408 l 970 106 l 876 13 l 577 314 l 277 13 l 184 106 l 483 408 l 183 706 l 277 800 l 577 501 "},"o":{"x_min":30,"x_max":741,"ha":774,"o":"m 395 683 q 645 587 550 683 q 741 337 741 492 q 646 79 741 173 q 385 -15 552 -15 q 127 78 225 -15 q 30 333 30 172 q 129 590 30 498 q 395 683 228 683 m 269 174 q 305 85 275 119 q 386 52 335 52 q 464 85 436 52 q 503 172 491 119 q 510 237 506 194 q 515 336 515 279 q 510 431 515 391 q 503 494 506 472 q 464 581 491 548 q 385 615 436 615 q 291 563 315 615 q 261 459 267 512 q 256 333 256 407 q 269 174 256 248 "},"5":{"x_min":46,"x_max":670,"ha":749,"o":"m 284 60 q 397 118 360 60 q 434 258 434 176 q 404 391 434 333 q 307 450 375 450 q 183 388 238 450 l 118 422 q 128 525 126 467 q 131 606 131 583 q 126 749 131 684 q 108 878 121 814 l 118 888 q 268 883 173 888 q 387 878 362 878 q 635 888 519 878 l 630 793 q 636 696 630 739 q 479 702 579 696 q 365 709 378 709 l 225 709 q 213 501 213 608 q 399 548 301 548 q 591 480 513 548 q 670 300 670 413 q 559 59 670 139 q 280 -21 449 -21 q 156 -7 222 -21 q 46 32 90 5 q 94 133 74 84 q 131 238 115 182 l 152 237 q 180 109 152 158 q 284 60 208 60 "},"7":{"x_min":96,"x_max":760,"ha":749,"o":"m 333 343 l 549 689 q 439 693 511 689 q 329 697 366 697 q 221 694 272 697 q 98 689 171 691 q 105 755 104 734 q 105 787 105 775 q 102 844 105 808 q 98 888 98 881 l 401 883 l 741 887 l 760 849 q 312 0 491 452 l 216 0 l 105 0 l 96 18 q 229 187 177 119 q 333 343 280 255 "},"K":{"x_min":90,"x_max":892.78125,"ha":856,"o":"m 334 716 l 334 515 l 569 787 q 635 866 619 845 q 682 932 651 886 l 767 926 q 817 929 784 926 q 870 932 851 932 q 687 746 790 851 q 503 554 585 641 l 623 377 q 892 0 753 179 l 753 5 q 664 2 727 5 q 595 0 600 0 q 484 190 545 98 q 334 404 424 281 l 334 193 q 348 0 334 94 q 270 2 325 0 q 212 5 215 5 l 90 0 q 99 236 90 69 q 108 461 108 402 q 103 623 108 515 q 99 787 99 731 l 90 932 q 157 927 113 932 q 219 922 201 922 q 282 925 252 922 q 342 932 312 927 q 338 831 342 907 q 334 716 334 755 "},",":{"x_min":25,"x_max":319.4375,"ha":375,"o":"m 109 121 q 146 203 119 168 q 218 238 173 238 q 289 208 259 238 q 319 136 319 178 q 313 101 319 118 q 294 64 306 85 l 62 -253 l 25 -238 l 109 121 "},"d":{"x_min":54,"x_max":744,"ha":825,"o":"m 318 -15 q 115 84 177 -15 q 54 336 54 184 q 124 583 54 483 q 336 683 194 683 q 525 584 451 683 l 525 738 l 518 1024 q 581 1016 554 1019 q 630 1013 609 1013 q 678 1015 653 1013 q 744 1023 703 1018 q 740 900 744 983 q 736 775 736 816 q 738 403 736 627 q 740 176 740 179 l 744 0 q 680 3 721 0 q 630 6 638 6 q 568 3 608 6 q 520 0 528 0 q 523 39 522 16 q 525 85 525 62 q 430 8 477 32 q 318 -15 383 -15 m 396 587 q 328 562 355 587 q 289 499 300 538 q 273 409 277 460 q 269 316 269 358 q 295 158 269 227 q 396 89 321 89 q 501 167 473 89 q 530 338 530 245 q 503 511 530 435 q 396 587 477 587 "},"¨":{"x_min":65.28125,"x_max":609.71875,"ha":654,"o":"m 251 613 q 218 541 243 570 q 154 512 194 512 q 90 537 116 512 q 65 601 65 563 q 87 665 65 634 l 291 949 l 331 933 l 251 613 m 530 613 q 498 542 525 573 q 433 512 472 512 q 371 536 397 512 q 345 598 345 560 q 366 665 345 633 l 570 949 l 609 933 l 530 613 "},"E":{"x_min":90,"x_max":644.15625,"ha":703,"o":"m 108 222 l 108 465 q 104 710 108 620 q 91 932 101 800 l 357 926 q 520 929 405 926 q 644 932 634 932 q 640 903 641 916 q 638 872 638 890 q 639 848 638 857 q 644 810 640 840 q 530 815 606 810 q 414 820 453 820 l 338 820 l 334 545 l 634 557 q 630 527 631 541 q 628 494 628 514 l 633 431 q 459 437 571 431 q 334 444 347 444 l 334 296 q 336 190 334 264 q 338 113 338 115 q 638 129 489 113 l 634 63 l 638 0 q 433 3 562 0 q 278 7 305 7 q 169 3 235 7 q 90 0 102 0 q 102 114 96 54 q 108 222 108 175 "},"Y":{"x_min":-30,"x_max":797,"ha":747,"o":"m 136 650 q 67 772 123 672 q -30 932 10 872 l 92 926 q 184 929 120 926 q 256 931 249 931 q 345 740 304 825 q 442 554 386 656 q 541 730 492 636 q 637 931 589 825 l 712 926 q 753 929 726 926 q 797 931 781 931 q 644 689 714 812 q 498 420 573 566 l 502 143 l 508 0 l 414 5 l 256 0 q 262 138 256 50 q 269 237 269 226 l 269 402 l 136 650 "},"\"":{"x_min":53,"x_max":399,"ha":451,"o":"m 181 958 l 181 586 l 53 586 l 53 958 l 181 958 m 399 958 l 399 586 l 271 586 l 271 958 l 399 958 "},"ê":{"x_min":41,"x_max":684.046875,"ha":729,"o":"m 482 98 q 566 112 532 98 q 643 160 600 126 l 661 151 q 643 96 652 125 q 628 40 634 66 q 521 -1 577 11 q 403 -15 466 -15 q 141 79 241 -15 q 41 336 41 173 q 137 586 41 490 q 386 683 234 683 q 608 601 532 683 q 684 373 684 520 l 684 332 l 267 332 q 325 165 267 232 q 482 98 383 98 m 302 1001 l 426 1001 l 577 754 l 512 754 l 364 876 l 216 754 l 149 754 l 302 1001 m 478 411 q 481 444 481 422 q 459 566 481 513 q 377 620 438 620 q 292 562 318 620 q 267 437 267 505 l 267 411 l 478 411 "},"δ":{"x_min":30,"x_max":688,"ha":719,"o":"m 543 794 q 498 889 531 854 q 407 924 465 924 q 329 895 362 924 q 296 822 296 867 q 393 671 296 739 q 585 539 490 603 q 688 308 688 444 q 600 71 688 157 q 359 -15 513 -15 q 119 70 209 -15 q 30 305 30 155 q 88 503 30 419 q 256 614 147 586 q 130 696 178 650 q 82 812 82 743 q 173 968 82 916 q 374 1021 263 1021 q 629 946 510 1021 q 606 875 617 912 q 582 788 596 839 l 543 794 m 269 163 q 296 83 276 114 q 360 52 317 52 q 435 95 414 52 q 462 204 456 139 l 462 306 l 462 407 q 438 513 462 464 q 363 561 415 561 q 298 529 321 561 q 269 449 274 496 q 260 382 263 421 q 258 306 258 343 q 260 227 258 249 q 269 163 262 206 "},"έ":{"x_min":55,"x_max":667.5,"ha":657,"o":"m 512 501 q 472 579 502 548 q 396 611 442 611 q 323 577 352 611 q 295 498 295 544 q 316 429 295 458 q 375 394 337 399 l 450 394 l 450 373 q 450 336 450 349 q 450 316 450 323 q 414 319 438 319 q 322 280 361 319 q 283 194 283 242 q 323 101 283 144 q 413 59 363 59 q 498 88 461 59 q 572 167 536 117 l 600 155 q 594 130 596 144 q 593 104 593 115 q 593 82 593 90 q 600 53 593 74 q 351 -15 486 -15 q 145 30 236 -15 q 55 176 55 75 q 105 289 55 244 q 233 360 156 335 q 127 421 167 385 q 88 516 88 456 q 165 643 88 603 q 340 683 243 683 q 593 612 480 683 q 565 556 576 583 q 551 501 555 530 l 512 501 m 492 955 q 545 1003 525 988 q 595 1019 566 1019 q 646 996 625 1019 q 667 945 667 974 q 648 899 667 917 q 600 865 630 880 l 375 757 l 306 757 l 492 955 "},"ω":{"x_min":30,"x_max":1059,"ha":1093,"o":"m 335 -15 q 111 79 192 -15 q 30 321 30 173 q 72 505 30 421 q 192 667 114 589 q 297 661 237 661 q 347 663 319 661 q 390 667 374 665 q 247 281 247 499 q 269 123 247 195 q 358 52 291 52 q 421 86 399 52 q 443 165 443 121 l 443 291 q 441 415 443 379 q 435 512 440 451 q 510 505 499 505 q 544 505 522 505 q 608 508 579 505 q 657 512 636 511 q 648 402 652 465 q 644 289 644 340 q 644 237 644 258 q 650 165 644 215 q 669 85 650 119 q 730 52 688 52 q 821 122 798 52 q 844 279 844 192 q 807 481 844 386 q 700 666 771 576 q 746 662 724 663 q 793 661 767 661 q 846 664 812 661 q 898 667 881 667 q 1016 508 974 595 q 1059 322 1059 422 q 974 83 1059 182 q 753 -15 890 -15 q 630 13 685 -15 q 545 100 575 41 q 459 14 516 44 q 335 -15 402 -15 "},"´":{"x_min":70.828125,"x_max":337.5,"ha":374,"o":"m 70 528 l 151 848 q 183 919 158 889 q 244 949 208 949 q 310 924 283 949 q 337 862 337 900 q 331 829 337 845 q 316 797 326 813 l 111 511 l 70 528 "},"±":{"x_min":169,"x_max":969,"ha":1139,"o":"m 636 815 l 636 597 l 969 597 l 969 465 l 636 465 l 636 246 l 501 246 l 501 465 l 169 465 l 169 597 l 501 597 l 501 815 l 636 815 m 969 132 l 969 0 l 169 0 l 169 132 l 969 132 "},"|":{"x_min":272,"x_max":411,"ha":683,"o":"m 411 956 l 411 447 l 272 447 l 272 956 l 411 956 m 411 272 l 411 -233 l 272 -233 l 272 272 l 411 272 "},"ϋ":{"x_min":82,"x_max":765,"ha":843,"o":"m 765 415 q 663 114 765 244 q 401 -15 562 -15 q 162 56 243 -15 q 82 284 82 127 l 86 478 q 84 589 86 523 q 82 666 82 656 q 145 663 99 666 q 195 661 191 661 q 263 663 216 661 q 311 666 309 666 q 295 476 301 566 q 290 294 290 387 q 310 122 290 193 q 402 52 330 52 q 515 146 487 52 q 544 351 544 240 q 525 502 544 433 q 469 657 507 570 q 580 659 528 657 q 684 672 632 662 q 743 547 721 613 q 765 415 765 482 m 262 975 q 329 947 301 975 q 357 879 357 919 q 331 811 357 840 q 265 783 305 783 q 195 810 226 783 q 165 879 165 838 q 192 947 165 919 q 262 975 220 975 m 522 975 q 589 947 561 975 q 617 879 617 919 q 591 811 617 840 q 525 783 565 783 q 456 811 486 783 q 427 879 427 840 q 454 947 427 919 q 522 975 482 975 "},"§":{"x_min":61,"x_max":685,"ha":743,"o":"m 118 39 l 136 38 q 207 -72 149 -32 q 341 -113 265 -113 q 441 -84 398 -113 q 485 -1 485 -56 q 378 121 485 73 q 170 213 272 169 q 61 386 61 277 q 95 495 61 437 q 175 584 129 554 q 133 649 148 615 q 118 721 118 683 q 206 887 118 825 q 406 949 295 949 q 531 937 479 949 q 630 895 583 926 q 598 826 613 860 q 570 754 583 791 l 558 754 q 499 848 548 812 q 388 884 451 884 q 300 858 340 884 q 261 785 261 832 q 366 672 261 717 q 575 583 472 626 q 685 414 685 519 q 657 302 685 354 q 580 216 630 250 q 622 149 602 197 q 643 68 643 101 q 545 -116 643 -51 q 322 -182 447 -182 q 197 -171 255 -182 q 86 -135 138 -161 q 118 39 106 -38 m 197 478 q 310 346 197 400 q 521 249 423 293 q 546 312 546 274 q 433 432 546 379 q 224 528 320 485 q 197 478 201 508 "},"b":{"x_min":79,"x_max":772,"ha":825,"o":"m 89 647 q 84 844 89 712 q 79 1024 79 977 q 136 1018 105 1021 q 192 1015 167 1015 q 249 1018 217 1015 q 306 1023 280 1020 l 299 724 l 299 578 q 389 656 339 630 q 505 683 439 683 q 704 581 637 683 q 772 340 772 479 q 694 88 772 191 q 470 -15 617 -15 q 340 15 400 -15 q 237 104 280 45 q 202 74 215 87 q 136 1 190 62 l 79 1 q 84 357 79 132 q 89 647 89 583 m 430 586 q 318 512 346 586 q 291 338 291 438 q 316 162 291 238 q 424 86 342 86 q 528 159 503 86 q 554 331 554 233 q 531 510 554 434 q 430 586 508 586 "},"q":{"x_min":51,"x_max":741,"ha":825,"o":"m 331 -15 q 121 81 191 -15 q 51 323 51 177 q 117 576 51 469 q 323 683 184 683 q 523 580 446 683 l 523 605 q 516 666 523 631 q 586 660 568 661 q 627 659 604 659 q 741 666 675 659 q 738 416 741 561 q 732 125 735 271 q 730 -124 730 -19 q 735 -246 730 -164 q 741 -371 741 -328 q 687 -363 718 -366 q 628 -361 656 -361 q 563 -363 581 -361 q 514 -372 545 -365 l 523 -58 l 523 85 q 437 10 482 35 q 331 -15 392 -15 m 386 81 q 484 135 452 81 q 523 261 516 189 l 523 300 q 523 351 523 330 q 523 392 523 372 q 490 518 523 460 q 393 576 458 576 q 290 502 314 576 q 266 327 266 429 q 288 155 266 229 q 386 81 310 81 "},"Ω":{"x_min":36,"x_max":1174.890625,"ha":1211,"o":"m 1173 129 q 1170 103 1170 116 q 1170 83 1170 90 l 1170 70 q 1170 36 1170 52 q 1174 0 1170 19 l 953 4 l 715 0 l 715 103 q 848 251 813 162 q 883 473 883 340 q 815 741 883 623 q 607 860 747 860 q 396 738 461 860 q 331 457 331 616 q 369 245 331 339 q 496 102 407 152 l 496 0 l 256 4 l 36 0 l 38 80 l 36 129 q 264 113 151 113 q 128 258 172 167 q 85 464 85 350 q 235 821 85 693 q 622 949 386 949 q 988 830 846 949 q 1130 491 1130 712 q 1082 272 1130 363 q 928 112 1034 180 q 1173 129 1049 112 "},"ύ":{"x_min":82,"x_max":765,"ha":843,"o":"m 765 415 q 663 114 765 244 q 400 -15 561 -15 q 162 56 242 -15 q 82 284 82 128 l 86 479 q 84 590 86 523 q 82 666 82 656 q 145 663 99 666 q 195 661 191 661 q 263 663 216 661 q 311 666 309 666 q 295 477 301 566 q 290 294 290 387 q 310 122 290 193 q 402 52 330 52 q 515 146 487 52 q 544 351 544 240 q 525 502 544 433 q 469 656 507 570 q 580 659 528 656 q 684 672 632 662 q 743 547 721 613 q 765 415 765 482 m 548 953 q 601 1001 581 986 q 651 1017 621 1017 q 702 994 681 1017 q 723 943 723 972 q 704 897 723 916 q 655 863 685 878 l 431 755 l 362 755 l 548 953 "},"Ö":{"x_min":40,"x_max":1087,"ha":1129,"o":"m 577 949 q 946 829 805 949 q 1087 486 1087 710 q 942 115 1087 246 q 552 -15 798 -15 q 176 107 313 -15 q 40 465 40 229 q 188 823 40 697 q 577 949 337 949 m 434 1242 q 501 1215 473 1242 q 529 1148 529 1189 q 502 1079 529 1108 q 435 1050 476 1050 q 366 1079 396 1050 q 337 1148 337 1109 q 366 1214 337 1186 q 434 1242 395 1242 m 693 1242 q 761 1215 733 1242 q 789 1148 789 1189 q 762 1079 789 1108 q 695 1050 736 1050 q 627 1079 655 1050 q 600 1148 600 1108 q 627 1214 600 1186 q 693 1242 655 1242 m 562 71 q 774 194 706 71 q 843 470 843 318 q 774 742 843 623 q 563 861 706 861 q 353 741 420 861 q 287 465 287 622 q 354 191 287 312 q 562 71 421 71 "},"z":{"x_min":19.4375,"x_max":640.28125,"ha":664,"o":"m 19 75 q 118 216 33 94 q 257 415 204 337 q 359 567 311 493 l 255 568 q 151 562 205 568 q 65 552 97 556 l 68 608 l 65 667 l 337 660 q 507 663 404 660 q 627 666 611 666 l 627 588 q 515 441 573 519 q 399 276 458 362 q 280 98 340 190 l 375 96 q 506 101 418 96 q 640 107 595 107 q 638 76 638 93 q 637 51 637 59 l 637 34 l 640 0 q 459 3 568 0 q 333 7 351 7 q 147 3 259 7 q 19 0 36 0 l 19 75 "},"™":{"x_min":136,"x_max":964,"ha":1138,"o":"m 461 975 l 461 900 l 350 900 l 350 610 l 249 610 l 249 900 l 136 900 l 136 975 l 461 975 m 666 974 l 751 751 l 833 974 l 964 975 l 964 610 l 874 610 l 874 882 l 772 610 l 730 610 l 625 881 l 625 610 l 535 610 l 535 975 l 666 974 "},"ή":{"x_min":80,"x_max":727,"ha":808,"o":"m 91 339 q 85 512 91 391 q 80 667 80 632 q 137 661 125 662 q 180 661 149 661 q 244 663 199 661 q 293 666 290 666 l 293 568 q 391 651 338 622 q 511 681 443 681 q 660 622 602 681 q 719 471 719 564 l 719 327 l 719 -50 q 723 -219 719 -107 q 727 -374 727 -332 q 618 -365 670 -365 q 502 -373 562 -365 l 512 16 l 512 251 l 512 368 q 491 499 512 446 q 408 552 471 552 q 319 488 342 552 q 302 419 305 457 q 299 330 299 382 q 304 148 299 264 q 309 0 309 33 q 243 3 278 0 q 195 6 207 6 q 127 3 163 6 q 80 0 92 0 q 85 188 80 65 q 91 339 91 311 m 552 953 q 605 1001 585 986 q 654 1017 625 1017 q 706 994 685 1017 q 727 943 727 972 q 708 897 727 916 q 658 863 689 878 l 435 756 l 366 756 l 552 953 "},"Θ":{"x_min":40,"x_max":1087,"ha":1129,"o":"m 51 585 q 235 855 85 761 q 577 949 385 949 q 944 829 802 949 q 1087 487 1087 710 q 941 116 1087 247 q 552 -15 796 -15 q 176 107 313 -15 q 40 465 40 229 q 41 510 40 492 q 51 585 42 528 m 559 73 q 771 194 703 73 q 840 472 840 315 q 773 742 840 624 q 566 860 706 860 q 353 742 420 860 q 287 465 287 624 q 353 193 287 314 q 559 73 419 73 m 566 525 q 678 528 610 525 q 755 532 745 532 l 754 539 l 754 472 l 754 403 l 755 407 l 563 414 l 373 407 l 373 469 l 373 531 q 484 528 416 531 q 566 525 553 525 "},"®":{"x_min":72,"x_max":1065,"ha":1138,"o":"m 1065 488 q 917 139 1065 285 q 567 -6 770 -6 q 219 139 366 -6 q 72 488 72 285 q 219 836 72 688 q 567 985 367 985 q 917 839 770 985 q 1065 488 1065 693 m 155 488 q 276 197 155 320 q 566 75 398 75 q 858 197 734 75 q 983 487 983 320 q 860 780 983 656 q 567 904 738 904 q 277 780 399 904 q 155 488 155 656 m 577 774 q 741 740 670 774 q 812 625 812 707 q 778 527 812 569 q 692 468 745 484 l 811 223 l 666 222 l 561 447 l 497 447 l 497 223 l 361 223 l 361 774 l 577 774 m 497 528 l 562 528 q 641 546 609 528 q 673 608 673 564 q 655 660 673 638 q 607 685 638 682 q 555 691 584 691 l 497 691 l 497 528 "},"É":{"x_min":90,"x_max":644.15625,"ha":703,"o":"m 108 223 l 108 465 q 104 713 108 622 q 91 933 101 804 l 357 929 l 644 933 l 640 872 l 644 811 q 530 816 606 811 q 415 822 453 822 l 340 822 q 337 663 340 774 q 334 545 334 551 l 634 557 q 631 521 634 546 q 628 493 628 496 q 630 458 628 477 q 634 429 633 440 q 476 436 587 429 q 334 444 365 444 l 334 294 q 335 203 334 249 q 340 111 336 156 q 483 114 419 111 q 640 128 546 118 q 634 65 634 100 q 635 37 634 47 q 640 0 635 27 q 427 3 556 0 q 280 7 298 7 q 169 3 242 7 q 90 0 95 0 q 102 117 97 59 q 108 223 108 175 m 410 1222 q 465 1272 445 1257 q 515 1288 485 1288 q 566 1265 545 1288 q 587 1215 587 1243 q 568 1169 587 1189 q 519 1133 549 1148 l 294 1025 l 225 1025 l 410 1222 "},"~":{"x_min":266,"x_max":1091,"ha":1367,"o":"m 1091 938 q 1033 721 1091 807 q 847 636 975 636 q 661 720 757 636 q 518 805 564 805 q 427 756 453 805 q 402 636 402 708 l 266 636 q 327 849 266 761 q 510 938 388 938 q 696 853 599 938 q 846 768 793 768 q 933 815 911 768 q 956 938 956 863 l 1091 938 "},"Ε":{"x_min":90,"x_max":644.15625,"ha":703,"o":"m 108 222 l 108 465 q 104 710 108 620 q 91 932 101 800 l 357 926 q 520 929 405 926 q 644 932 634 932 q 640 903 641 916 q 638 872 638 890 q 639 848 638 857 q 644 810 640 840 q 530 815 606 810 q 414 820 453 820 l 338 820 l 334 545 l 634 557 q 630 527 631 541 q 628 494 628 514 l 633 431 q 459 437 571 431 q 334 444 347 444 l 334 296 q 336 190 334 264 q 338 113 338 115 q 638 129 489 113 l 634 63 l 638 0 q 433 3 562 0 q 278 7 305 7 q 169 3 235 7 q 90 0 102 0 q 102 114 96 54 q 108 222 108 175 "},"³":{"x_min":18,"x_max":448,"ha":494,"o":"m 242 899 q 370 867 315 899 q 425 770 425 836 q 399 699 425 730 q 301 645 373 667 q 403 605 359 642 q 448 512 448 569 q 375 384 448 426 q 210 342 303 342 q 108 352 152 342 q 18 391 65 362 q 88 505 60 451 l 98 505 q 119 420 98 452 q 191 388 141 388 q 263 421 237 388 q 290 501 290 454 q 262 580 290 549 q 186 612 235 612 l 151 612 l 151 660 l 181 658 q 259 684 228 658 q 290 759 290 710 q 268 828 290 800 q 207 856 246 856 q 141 821 163 856 q 119 742 119 787 l 110 736 q 26 815 75 777 q 120 876 53 854 q 242 899 187 899 "},"[":{"x_min":104,"x_max":415.109375,"ha":454,"o":"m 409 883 l 415 852 l 261 855 l 257 541 q 261 212 257 433 q 266 -86 266 -8 l 327 -88 l 415 -88 l 409 -117 q 415 -162 409 -142 l 261 -157 l 104 -164 q 110 154 104 -50 q 117 383 117 359 q 110 703 117 496 q 104 933 104 909 q 194 929 138 933 q 258 926 249 926 q 347 929 284 926 q 415 933 410 933 q 409 883 409 911 "},"L":{"x_min":91,"x_max":639.609375,"ha":650,"o":"m 109 465 q 105 710 109 620 q 91 932 102 800 l 216 927 l 350 931 q 337 618 337 783 l 337 296 q 337 201 337 249 q 341 113 337 153 q 639 129 491 113 l 635 63 l 639 0 q 434 3 563 0 q 279 7 306 7 q 170 3 236 7 q 91 0 103 0 q 105 209 102 102 q 109 465 109 316 "},"σ":{"x_min":30,"x_max":832,"ha":826,"o":"m 679 557 q 730 451 724 495 q 738 384 736 407 q 741 339 741 361 q 738 277 741 295 q 726 190 736 259 q 617 53 716 121 q 385 -15 518 -15 q 126 78 223 -15 q 30 336 30 172 q 127 588 30 494 q 384 683 224 683 q 536 671 432 683 q 677 660 639 660 q 765 663 705 660 q 831 666 825 666 q 827 611 827 637 l 827 594 l 832 552 l 702 557 l 679 557 m 256 333 q 269 174 256 248 q 304 88 275 124 q 381 52 332 52 q 475 104 443 52 q 508 221 508 156 q 512 258 509 235 q 515 323 515 282 q 512 411 515 370 q 508 444 509 427 q 479 563 508 511 q 389 615 450 615 q 299 565 327 615 q 263 450 271 516 q 256 333 256 384 "},"ζ":{"x_min":64,"x_max":667,"ha":656,"o":"m 231 360 l 231 340 l 231 314 q 343 192 231 217 q 554 162 448 176 q 667 24 667 133 q 628 -103 667 -42 q 525 -221 589 -164 l 458 -181 q 505 -114 493 -134 q 521 -63 516 -95 q 375 13 521 -6 q 146 71 229 33 q 64 260 64 110 q 123 495 64 382 q 257 692 182 608 q 467 905 333 776 q 278 903 353 905 q 122 893 204 901 l 126 958 l 122 1024 q 255 1019 166 1024 q 389 1015 344 1015 q 511 1019 429 1015 q 635 1024 593 1024 l 630 978 l 634 934 q 433 764 520 848 q 288 578 346 680 q 231 360 231 476 "},"θ":{"x_min":34,"x_max":710,"ha":749,"o":"m 710 450 q 636 110 710 240 q 367 -19 562 -19 q 104 103 175 -19 q 34 434 34 226 q 106 774 34 641 q 368 908 178 908 q 637 785 565 908 q 710 450 710 662 m 370 416 q 305 413 351 416 q 255 410 259 410 q 257 322 255 371 q 266 208 259 273 q 292 96 272 143 q 370 49 312 49 q 429 72 406 49 q 463 135 452 96 q 479 263 474 192 q 484 410 484 335 q 418 413 464 410 q 370 416 372 416 m 484 601 q 464 769 484 698 q 372 840 445 840 q 277 759 300 840 q 255 560 255 679 l 255 492 l 372 488 l 488 492 l 484 601 "},"Ο":{"x_min":40,"x_max":1086,"ha":1129,"o":"m 577 949 q 945 829 804 949 q 1086 486 1086 710 q 942 114 1086 244 q 552 -15 798 -15 q 176 107 313 -15 q 40 465 40 229 q 188 823 40 697 q 577 949 337 949 m 562 73 q 773 194 706 73 q 840 472 840 315 q 773 742 840 624 q 566 860 706 860 q 353 742 420 860 q 287 465 287 624 q 353 193 287 313 q 562 73 420 73 "},"Γ":{"x_min":91,"x_max":639.609375,"ha":650,"o":"m 232 926 l 449 926 l 639 932 l 635 866 l 639 802 q 485 815 548 812 q 341 819 423 819 q 338 769 339 805 q 337 681 337 734 l 337 635 l 337 312 q 339 138 337 195 q 351 0 341 81 l 216 4 l 91 0 q 100 238 91 70 q 109 465 109 406 q 105 713 109 613 q 91 932 102 813 q 161 929 114 932 q 232 926 209 926 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":28,"x_max":1085,"ha":1122,"o":"m 265 910 q 434 844 369 910 q 500 672 500 779 q 435 496 500 562 q 258 431 370 431 q 91 498 154 431 q 28 669 28 565 q 93 843 28 776 q 265 910 158 910 m 831 1015 l 917 1014 l 272 -125 l 184 -125 l 831 1015 m 849 463 q 1020 401 955 463 q 1085 230 1085 339 q 1023 51 1085 117 q 845 -15 961 -15 q 677 51 742 -15 q 612 222 612 118 q 675 398 612 333 q 849 463 738 463 m 196 561 q 214 505 196 532 q 261 478 232 478 q 297 489 280 478 q 323 525 314 501 q 335 586 332 548 q 339 669 339 625 q 337 723 339 697 q 332 780 336 749 q 311 836 327 811 q 264 861 296 861 q 204 820 222 861 q 191 752 194 786 q 188 669 188 719 q 196 561 188 615 m 779 112 q 797 57 779 83 q 847 31 816 31 q 895 59 873 31 q 916 114 916 87 q 922 222 922 162 q 922 275 922 248 q 915 338 917 312 q 896 389 912 364 q 848 414 880 414 q 812 404 827 414 q 791 375 797 394 q 776 312 780 347 q 772 241 772 276 l 772 222 q 772 183 772 201 q 779 112 773 165 "},"P":{"x_min":91,"x_max":765,"ha":801,"o":"m 334 201 q 335 129 334 148 q 348 0 336 110 q 272 3 317 0 q 219 6 226 6 q 143 3 189 6 q 91 0 97 0 q 104 212 100 112 q 108 462 108 313 q 99 725 108 549 q 91 933 91 900 q 161 929 111 933 q 215 925 211 925 l 395 933 l 445 933 q 677 876 590 933 q 765 681 765 819 q 691 486 765 565 q 544 400 618 408 q 423 390 470 391 q 334 389 375 389 l 334 201 m 536 669 q 498 788 536 741 q 390 836 461 836 l 334 836 l 334 694 l 334 486 q 485 529 435 486 q 536 669 536 572 "},"Ώ":{"x_min":-28,"x_max":1452.5625,"ha":1489,"o":"m 1451 129 q 1448 104 1448 117 q 1448 83 1448 90 l 1448 70 q 1448 36 1448 52 q 1452 0 1448 19 l 1231 4 l 993 0 l 993 103 q 1126 251 1091 162 q 1161 473 1161 340 q 1092 741 1161 623 q 884 860 1024 860 q 673 738 738 860 q 608 457 608 616 q 646 245 608 339 q 774 102 684 152 l 774 0 l 534 4 l 314 0 l 316 80 l 313 129 q 542 113 429 113 q 405 258 449 167 q 362 464 362 350 q 512 821 362 693 q 899 949 663 949 q 1266 830 1124 949 q 1408 491 1408 712 q 1360 272 1408 363 q 1206 112 1312 180 q 1451 129 1327 112 m 158 953 q 211 1001 191 986 q 259 1017 231 1017 q 312 994 291 1017 q 333 943 333 972 q 314 897 333 916 q 265 863 295 878 l 40 755 l -28 755 l 158 953 "},"Έ":{"x_min":-28,"x_max":1020.609375,"ha":1078,"o":"m 485 222 l 485 465 q 481 710 485 620 q 467 931 478 800 l 733 926 q 896 929 781 926 q 1020 932 1010 932 q 1016 903 1017 916 q 1015 872 1015 890 q 1015 848 1015 857 q 1020 810 1016 839 q 906 815 983 810 q 791 820 830 820 l 715 820 l 711 544 l 1010 556 q 1006 527 1008 540 q 1005 493 1005 513 l 1009 430 q 836 436 948 430 q 711 443 724 443 l 711 296 q 713 189 711 264 q 715 113 715 115 q 1015 129 865 113 l 1010 63 l 1015 0 q 810 3 938 0 q 655 7 681 7 q 545 3 612 7 q 466 0 478 0 q 478 114 472 54 q 485 222 485 175 m 158 953 q 212 1001 191 986 q 260 1017 232 1017 q 313 994 292 1017 q 334 943 334 972 q 315 897 334 916 q 265 863 296 878 l 40 755 l -28 755 l 158 953 "},"_":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 683 -184 l 683 -322 l 0 -322 l 0 -184 l 683 -184 "},"Ϊ":{"x_min":-1,"x_max":450,"ha":449,"o":"m 110 402 q 103 709 110 511 q 97 932 97 908 q 161 926 130 929 q 220 923 192 923 q 287 927 242 923 q 351 931 331 931 q 343 688 351 859 q 336 465 336 516 q 343 221 336 391 q 351 0 351 51 q 283 2 330 0 q 212 5 236 5 l 97 0 q 103 233 97 83 q 110 402 110 383 m 93 1242 q 160 1215 132 1242 q 188 1148 188 1189 q 162 1078 188 1107 q 97 1050 136 1050 q 28 1079 57 1050 q -1 1148 -1 1108 q 26 1214 -1 1186 q 93 1242 54 1242 m 352 1242 q 421 1214 393 1242 q 450 1148 450 1187 q 423 1079 450 1108 q 356 1050 397 1050 q 286 1078 316 1050 q 257 1148 257 1107 q 286 1214 257 1186 q 352 1242 315 1242 "},"+":{"x_min":169,"x_max":968,"ha":1138,"o":"m 636 813 l 636 473 l 968 473 l 968 340 l 636 340 l 636 0 l 501 0 l 501 340 l 169 340 l 169 473 l 501 473 l 501 813 l 636 813 "},"½":{"x_min":68,"x_max":1145.765625,"ha":1171,"o":"m 207 481 l 207 736 l 207 808 q 150 784 180 798 q 103 763 120 770 l 68 813 q 195 860 131 834 q 331 918 259 886 l 348 909 q 346 744 348 844 q 344 644 344 645 l 345 650 l 345 505 l 345 511 q 345 458 345 480 q 349 391 345 437 l 299 394 q 247 392 281 394 q 198 391 213 391 l 207 481 m 844 1014 l 928 1014 l 326 -124 l 243 -124 l 844 1014 m 721 42 q 908 194 839 122 q 977 365 977 266 q 962 434 977 408 q 905 460 947 460 q 840 427 864 460 q 805 345 816 395 l 795 345 q 768 379 789 358 q 727 418 747 400 q 822 487 773 465 q 936 510 870 510 q 1068 474 1012 510 q 1124 365 1124 439 q 1035 209 1124 271 q 890 110 947 147 l 970 109 q 1070 111 999 109 q 1145 114 1140 114 q 1134 48 1134 80 q 1138 23 1134 37 q 1144 0 1143 9 l 1006 3 l 729 3 l 721 42 "},"Ρ":{"x_min":91,"x_max":765,"ha":801,"o":"m 334 201 q 335 129 334 148 q 348 0 336 110 q 272 3 317 0 q 219 6 226 6 q 143 3 189 6 q 91 0 97 0 q 104 212 100 112 q 108 462 108 313 q 99 725 108 549 q 91 933 91 900 q 161 929 111 933 q 215 925 211 925 l 395 933 l 445 933 q 677 876 590 933 q 765 681 765 819 q 691 486 765 565 q 544 400 618 408 q 423 390 470 391 q 334 389 375 389 l 334 201 m 536 669 q 498 788 536 741 q 390 836 461 836 l 334 836 l 334 694 l 334 486 q 485 529 435 486 q 536 669 536 572 "},"'":{"x_min":72.21875,"x_max":337.5,"ha":375,"o":"m 72 528 l 152 848 q 184 919 159 889 q 245 949 209 949 q 311 923 284 949 q 337 861 337 898 q 315 797 337 827 l 112 511 l 72 528 "},"T":{"x_min":8,"x_max":738,"ha":749,"o":"m 493 818 q 490 723 493 790 q 487 652 487 656 q 490 427 487 529 q 498 201 494 326 q 503 0 503 77 q 438 2 482 0 q 374 5 395 5 q 317 3 351 5 q 244 0 284 1 q 252 266 244 88 q 261 476 261 444 q 258 670 261 533 q 255 818 255 808 q 158 815 188 818 q 8 801 128 813 l 12 872 l 8 932 q 198 927 70 932 q 373 922 327 922 q 572 927 445 922 q 738 932 700 932 l 733 870 l 738 801 q 493 818 614 818 "},"Φ":{"x_min":36,"x_max":1093,"ha":1129,"o":"m 445 960 q 513 952 484 955 q 566 950 543 950 q 634 954 599 950 q 683 960 669 958 q 676 909 680 943 q 672 858 672 876 l 751 851 q 998 732 904 829 q 1093 484 1093 634 q 980 206 1093 301 q 672 72 867 112 q 673 31 672 44 q 683 -26 674 19 q 619 -20 653 -23 q 566 -17 585 -17 q 500 -20 535 -17 q 445 -26 465 -24 q 453 17 449 -5 q 458 72 458 40 l 380 82 q 133 205 231 103 q 36 454 36 307 q 150 732 36 636 q 458 858 265 828 q 452 911 458 879 q 445 960 447 943 m 668 700 l 668 467 l 668 234 l 672 171 q 817 266 774 182 q 861 468 861 351 q 817 666 861 583 q 669 764 773 750 l 668 700 m 419 755 q 301 654 336 739 q 267 469 267 570 q 309 267 267 351 q 455 171 351 183 l 458 234 l 462 424 l 458 700 l 458 764 l 419 755 "},"j":{"x_min":-62,"x_max":313,"ha":396,"o":"m 196 660 q 235 660 215 660 q 307 666 254 661 l 306 490 q 309 182 306 369 q 313 -31 313 -4 q 217 -278 313 -195 q -49 -361 121 -361 l -62 -305 q 59 -240 24 -305 q 95 -81 95 -175 l 95 255 q 89 459 95 322 q 84 666 84 597 q 196 660 143 660 m 195 1014 q 272 980 239 1014 q 306 902 306 947 q 273 825 306 858 q 195 793 240 793 q 117 824 150 793 q 84 902 84 856 q 117 980 84 947 q 195 1014 150 1014 "},"Σ":{"x_min":18.0625,"x_max":801.390625,"ha":843,"o":"m 747 865 l 751 804 q 641 808 715 804 q 527 813 568 813 l 369 813 q 481 664 427 733 q 594 519 534 594 q 402 315 496 419 l 304 203 l 544 203 q 672 208 586 203 q 801 214 758 214 l 794 112 q 801 0 794 59 l 456 4 l 18 0 l 18 57 q 261 330 138 181 l 365 461 q 222 657 298 559 q 55 865 147 755 l 55 932 q 243 928 118 932 q 431 924 368 924 q 630 928 511 924 q 751 932 750 932 l 747 865 "},"1":{"x_min":55,"x_max":502,"ha":749,"o":"m 276 616 q 273 680 276 637 q 271 747 271 723 q 197 713 223 726 q 112 666 172 700 l 55 754 q 471 940 291 848 l 498 927 l 492 454 l 493 465 l 493 202 l 493 216 q 497 102 493 178 q 502 0 502 26 l 383 6 q 314 3 362 6 q 264 0 266 0 q 270 359 264 127 q 276 616 276 591 "},"ä":{"x_min":44,"x_max":706.78125,"ha":706,"o":"m 236 -15 q 98 35 153 -15 q 44 169 44 86 q 212 352 44 301 q 401 421 380 403 q 410 439 410 432 q 373 539 410 502 q 275 577 337 577 q 140 511 185 577 l 135 511 l 115 585 q 230 657 164 632 q 365 683 296 683 q 543 623 479 683 q 608 452 608 564 l 604 213 q 604 166 604 184 q 608 123 604 148 q 625 87 612 99 q 658 76 638 76 q 679 80 666 76 q 702 90 691 84 l 706 40 q 643 1 676 14 q 563 -15 610 -10 q 480 5 518 -15 q 419 64 442 25 q 236 -15 350 -15 m 221 976 q 289 948 261 976 q 317 878 317 920 q 290 811 317 839 q 223 784 264 784 q 155 811 186 784 q 125 878 125 839 q 154 946 125 917 q 221 976 183 976 m 481 976 q 549 948 521 976 q 577 878 577 920 q 550 811 577 839 q 483 784 524 784 q 414 812 444 784 q 385 878 385 841 q 412 946 385 917 q 481 976 440 976 m 240 200 q 261 128 240 158 q 321 99 282 99 q 388 131 367 99 q 410 211 410 164 l 410 352 q 287 302 335 338 q 240 200 240 267 "},"<":{"x_min":175,"x_max":959.75,"ha":1138,"o":"m 959 650 l 362 406 l 959 162 l 959 17 l 175 340 l 175 471 l 959 796 l 959 650 "},"£":{"x_min":48,"x_max":734.109375,"ha":749,"o":"m 56 88 q 52 142 56 117 q 48 181 49 167 q 138 198 100 181 q 185 254 177 215 q 193 315 193 292 l 191 429 l 153 429 q 99 425 128 429 q 56 421 70 421 l 61 467 l 56 512 q 113 506 81 508 q 184 504 145 504 q 172 598 172 552 q 259 829 172 748 q 499 910 346 910 q 734 848 623 910 q 710 778 718 809 q 691 695 702 747 l 658 695 q 613 795 645 758 q 523 833 581 833 q 417 787 455 833 q 379 671 379 741 q 384 582 379 637 q 391 504 390 527 l 463 504 l 480 504 q 519 504 500 504 q 598 512 538 505 l 593 466 l 598 422 l 493 429 l 391 429 q 343 288 382 340 q 219 184 303 236 l 542 189 l 724 195 q 716 146 720 174 q 711 98 711 117 q 713 62 711 78 q 724 0 716 45 q 557 3 667 0 q 391 8 448 8 q 220 3 334 8 q 48 0 106 0 q 52 46 49 16 q 56 88 56 77 "},"¹":{"x_min":66,"x_max":360,"ha":494,"o":"m 212 726 l 212 802 q 158 781 187 795 q 102 755 129 768 l 66 808 q 206 857 157 838 q 342 919 256 876 l 356 910 l 356 627 l 356 638 l 356 477 l 356 484 q 356 429 356 451 q 360 354 356 408 l 307 358 l 202 354 q 210 520 209 418 q 212 634 212 623 l 212 726 "},"t":{"x_min":9,"x_max":468.71875,"ha":463,"o":"m 9 584 l 10 627 l 10 671 q 54 667 25 668 q 102 667 84 667 l 102 687 l 102 704 q 95 823 102 765 q 192 859 147 839 q 298 914 237 880 l 327 914 q 319 853 323 890 q 315 791 315 816 l 315 667 l 344 667 q 433 670 387 667 l 430 629 l 430 582 l 309 584 l 309 226 q 322 107 309 149 q 393 65 335 65 q 468 72 427 65 l 463 9 q 381 -11 425 -4 q 292 -18 336 -18 q 145 25 196 -18 q 95 165 95 69 q 98 410 95 260 q 102 583 102 559 l 9 584 "},"λ":{"x_min":22.609375,"x_max":662.890625,"ha":686,"o":"m 550 0 l 433 0 q 394 177 417 79 q 360 323 372 275 q 318 490 349 372 q 234 238 269 359 q 179 0 199 116 l 103 0 l 22 0 q 109 214 69 109 q 182 416 149 318 q 264 662 215 514 q 214 834 247 760 q 111 909 180 909 q 80 903 99 909 q 51 895 61 898 l 32 964 q 121 1008 76 993 q 215 1024 167 1024 q 384 925 342 1024 q 458 718 426 826 l 529 459 l 662 0 l 550 0 "},"ù":{"x_min":75,"x_max":722,"ha":808,"o":"m 474 757 l 249 865 q 198 900 216 883 q 181 946 181 917 q 203 998 181 977 q 256 1019 225 1019 q 303 1003 282 1019 q 356 955 324 987 l 542 757 l 474 757 m 292 -15 q 142 41 202 -15 q 83 189 83 98 l 83 337 q 79 509 83 394 q 75 668 75 624 q 134 661 108 663 q 185 659 160 659 q 240 662 209 659 q 300 668 271 665 q 290 455 290 570 l 290 384 l 290 279 q 316 146 290 181 q 394 111 343 111 q 467 147 441 111 q 501 234 493 184 l 501 330 q 499 488 501 415 q 495 668 497 562 q 554 662 518 665 q 613 659 589 659 q 671 662 640 659 q 722 668 701 665 q 717 505 722 625 q 712 326 712 386 q 717 156 712 270 q 722 1 722 43 l 617 4 l 511 1 l 511 96 q 410 15 468 46 q 292 -15 353 -15 "},"W":{"x_min":-8.328125,"x_max":1325,"ha":1326,"o":"m -8 932 q 67 929 13 932 q 125 926 120 926 q 190 929 147 926 q 255 932 233 932 q 300 737 277 829 q 357 519 323 644 q 419 298 391 394 q 504 548 455 403 q 576 759 554 693 q 633 932 598 825 l 711 926 q 756 929 726 926 q 802 932 787 932 q 859 729 836 807 q 913 557 881 651 q 998 297 944 462 q 1166 932 1094 604 l 1248 926 q 1298 929 1280 926 q 1325 932 1316 932 l 1230 643 l 1019 0 q 972 4 983 4 q 937 5 962 5 q 884 2 904 5 q 855 0 865 0 q 793 200 831 80 q 740 363 754 319 l 652 623 q 543 325 594 476 q 441 0 493 175 q 393 3 423 0 q 359 6 363 6 q 308 4 330 6 q 272 0 286 1 q 184 320 222 191 q 107 576 147 450 q -8 932 68 703 "},"ï":{"x_min":-26,"x_max":422,"ha":396,"o":"m 93 126 l 93 542 q 87 601 93 557 q 82 666 82 645 q 141 660 111 663 q 198 658 172 658 q 255 661 223 658 q 316 666 287 663 q 311 621 315 658 q 303 544 307 584 l 303 319 l 303 115 l 315 0 l 195 2 l 81 0 q 93 126 93 66 m 68 976 q 134 947 107 976 q 162 878 162 918 q 136 811 162 839 q 71 784 111 784 q 2 811 31 784 q -26 878 -26 838 q 1 946 -26 917 q 68 976 29 976 m 327 976 q 394 948 366 976 q 422 878 422 920 q 396 811 422 838 q 329 784 370 784 q 260 811 288 784 q 232 878 232 838 q 260 947 232 918 q 327 976 288 976 "},">":{"x_min":174.984375,"x_max":961,"ha":1138,"o":"m 961 472 l 961 340 l 175 17 l 175 162 l 773 406 l 174 650 l 174 796 l 961 472 "},"v":{"x_min":0,"x_max":669.453125,"ha":667,"o":"m 0 667 q 75 663 26 667 q 131 659 123 659 q 202 663 156 659 q 255 667 247 667 l 293 528 l 387 223 q 526 667 473 447 l 595 659 q 637 663 611 659 q 669 667 663 667 q 541 343 602 505 q 418 0 480 181 q 368 4 395 2 q 330 6 341 6 q 279 3 311 6 q 244 0 248 0 q 129 340 184 186 q 0 667 73 494 "},"τ":{"x_min":9,"x_max":654.84375,"ha":661,"o":"m 446 557 l 445 521 l 445 108 q 456 0 445 55 l 338 4 l 225 0 q 234 69 231 40 q 237 125 237 98 l 237 320 l 237 516 l 237 557 q 59 459 115 557 l 24 459 q 20 516 24 490 q 9 581 17 543 q 122 641 59 625 q 263 658 185 658 l 440 656 q 654 667 556 656 q 649 610 649 641 q 654 554 649 580 q 525 555 603 554 q 446 557 447 557 "},"û":{"x_min":75,"x_max":722,"ha":808,"o":"m 339 1004 l 463 1004 l 616 757 l 549 757 l 400 879 l 254 757 l 186 757 l 339 1004 m 292 -15 q 142 41 202 -15 q 83 189 83 98 l 83 337 q 79 509 83 394 q 75 668 75 625 q 134 662 108 664 q 185 660 160 660 q 240 662 209 660 q 300 668 271 665 q 290 455 290 570 l 290 384 l 290 279 q 316 146 290 181 q 394 111 343 111 q 467 147 441 111 q 501 234 493 184 l 501 330 q 499 488 501 415 q 495 668 497 562 q 554 662 518 665 q 613 660 589 660 q 671 662 640 660 q 722 668 701 665 q 717 505 722 625 q 712 326 712 386 q 717 156 712 270 q 722 1 722 43 l 617 4 l 511 1 l 511 96 q 410 15 468 46 q 292 -15 353 -15 "},"ξ":{"x_min":53,"x_max":675,"ha":675,"o":"m 559 813 q 508 904 534 873 q 432 936 482 936 q 335 887 372 936 q 299 776 299 838 q 372 648 299 683 q 550 614 446 614 l 546 569 l 546 525 l 455 528 q 320 498 379 528 q 251 432 261 469 q 240 386 241 396 q 239 360 239 376 q 240 322 239 335 q 244 304 241 310 q 363 205 258 226 q 569 165 469 183 q 675 25 675 130 q 647 -83 675 -27 q 536 -221 619 -139 l 468 -181 q 514 -114 498 -141 q 531 -55 531 -88 q 380 23 531 -5 q 141 98 229 53 q 53 287 53 143 q 113 467 53 390 q 274 586 173 544 q 144 666 196 615 q 92 790 92 716 q 180 962 92 901 q 389 1024 269 1024 q 515 1009 455 1024 q 640 963 575 994 q 620 886 632 936 q 604 809 608 836 l 559 813 "},"&":{"x_min":50,"x_max":948.609375,"ha":974,"o":"m 316 -18 q 128 44 206 -18 q 50 215 50 107 q 115 388 50 315 q 281 502 180 462 q 216 609 243 547 q 190 723 190 670 q 266 877 190 823 q 446 932 342 932 q 604 889 537 932 q 672 761 672 847 q 621 631 672 687 q 495 541 571 576 q 709 295 593 412 q 786 421 751 348 q 845 567 822 494 q 880 517 861 538 q 934 463 899 495 q 851 336 888 387 q 761 233 813 285 q 856 123 811 174 q 948 26 902 71 l 948 1 q 860 7 887 6 q 817 8 833 8 q 756 6 779 8 q 690 1 734 5 l 612 92 q 469 11 545 40 q 316 -18 394 -18 m 232 284 q 284 160 232 214 q 408 106 337 106 q 484 118 449 106 q 562 155 519 130 q 421 323 469 264 q 330 443 373 382 q 258 373 284 411 q 232 284 232 336 m 547 759 q 522 831 547 802 q 453 860 498 860 q 419 854 435 860 q 379 823 394 850 q 365 769 365 797 q 383 697 365 740 q 449 597 402 654 q 520 668 493 627 q 547 759 547 709 "},"Λ":{"x_min":-19.4375,"x_max":856.953125,"ha":836,"o":"m 583 700 l 856 0 q 781 3 823 0 q 723 6 740 6 q 645 3 688 6 q 587 0 602 0 q 563 90 579 43 q 538 163 547 137 l 359 637 l 189 161 q 142 0 163 87 l 72 5 q 35 4 48 5 q -19 0 23 4 q 25 92 -2 33 q 83 226 52 151 l 272 698 q 311 810 290 747 q 348 932 331 873 q 394 927 379 929 q 423 926 409 926 q 474 929 456 926 q 501 932 491 932 q 583 700 536 819 "},"I":{"x_min":94,"x_max":354,"ha":447,"o":"m 111 402 q 107 716 111 609 q 94 932 103 822 q 161 925 124 929 q 220 922 198 922 q 292 927 245 922 q 353 931 339 932 q 340 716 343 819 q 337 465 337 613 q 340 221 337 326 q 354 0 344 116 q 273 2 330 0 q 214 5 216 5 l 95 0 q 107 199 103 88 q 111 402 111 311 "},"G":{"x_min":43,"x_max":948,"ha":1015,"o":"m 552 -15 q 183 110 324 -15 q 43 461 43 236 q 195 823 43 693 q 583 954 347 954 q 763 932 679 954 q 929 865 848 911 q 879 697 895 784 l 862 697 q 749 816 818 772 q 595 860 680 860 q 390 769 471 860 q 300 608 309 679 q 289 513 291 536 q 287 469 287 490 q 289 404 287 426 q 294 375 292 382 q 389 167 310 250 q 590 84 468 84 q 713 100 651 84 q 699 430 713 272 q 824 423 768 423 q 948 431 886 423 q 942 323 948 395 q 937 214 937 251 q 939 118 937 185 q 942 47 942 51 q 746 1 839 17 q 552 -15 652 -15 "},"ΰ":{"x_min":39,"x_max":768,"ha":843,"o":"m 768 415 q 666 114 768 244 q 404 -15 565 -15 q 165 56 246 -15 q 85 284 85 127 l 89 478 q 87 589 89 523 q 85 666 85 656 q 148 663 102 666 q 198 661 194 661 q 266 663 219 661 q 314 666 312 666 q 298 476 304 566 q 293 294 293 387 q 313 122 293 193 q 405 52 333 52 q 518 146 490 52 q 547 351 547 240 q 528 502 547 433 q 472 656 510 570 q 583 659 531 656 q 687 672 636 662 q 746 547 725 613 q 768 415 768 481 m 121 961 q 179 935 155 961 q 203 877 203 910 q 179 820 203 844 q 121 797 155 797 q 64 820 89 797 q 39 879 39 844 q 62 935 39 910 q 121 961 86 961 m 462 1017 q 504 998 486 1017 q 522 957 522 980 q 508 919 522 935 q 470 886 494 903 l 282 755 l 224 755 l 368 950 q 413 998 391 979 q 462 1017 434 1017 m 657 961 q 713 935 688 961 q 739 877 739 910 q 715 820 739 844 q 658 797 691 797 q 600 820 625 797 q 575 879 575 844 q 599 936 575 912 q 657 961 623 961 "},"`":{"x_min":65.671875,"x_max":330.9375,"ha":375,"o":"m 251 613 q 217 540 240 569 q 153 512 193 512 q 92 537 118 512 q 65 598 65 562 q 87 665 65 634 l 292 949 l 330 933 l 251 613 "},"Υ":{"x_min":-30,"x_max":797,"ha":747,"o":"m 136 650 q 67 772 123 672 q -30 932 10 872 l 92 926 q 184 929 120 926 q 256 931 249 931 q 345 740 304 825 q 442 554 386 656 q 541 730 492 636 q 637 931 589 825 l 712 926 q 753 929 726 926 q 797 931 781 931 q 644 689 714 812 q 498 420 573 566 l 502 143 l 508 0 l 414 5 l 256 0 q 262 138 256 50 q 269 237 269 226 l 269 402 l 136 650 "},"r":{"x_min":80,"x_max":505,"ha":521,"o":"m 91 326 q 85 495 91 381 q 80 666 80 609 l 181 661 q 246 663 201 661 q 297 666 291 666 q 283 592 287 630 q 280 504 280 554 l 288 504 q 357 632 311 581 q 474 683 403 683 l 505 683 q 495 571 498 631 q 492 457 492 511 q 448 477 471 468 q 406 486 424 486 q 320 439 343 486 q 298 323 298 392 q 300 147 298 208 q 311 0 302 85 q 247 3 288 0 q 195 6 206 6 q 130 3 171 6 q 80 0 88 0 q 85 162 80 53 q 91 326 91 270 "},"x":{"x_min":-4.5625,"x_max":646.828125,"ha":644,"o":"m 155 0 l 84 5 q 28 4 46 5 q -4 0 6 0 q 110 148 55 75 q 223 307 164 222 l 113 498 l 7 667 q 86 663 38 667 q 141 659 134 659 q 215 663 169 659 q 271 667 262 667 l 366 473 q 419 555 398 521 q 481 667 439 590 l 553 659 q 601 663 571 659 q 637 667 631 667 q 537 542 580 598 q 419 384 494 486 l 537 177 q 646 0 588 88 q 571 3 620 0 q 516 6 523 6 q 441 3 489 6 q 385 0 392 0 l 276 218 l 155 0 "},"è":{"x_min":41,"x_max":684.046875,"ha":729,"o":"m 482 98 q 566 112 532 98 q 643 160 600 126 l 661 151 q 643 96 652 125 q 628 40 634 66 q 521 -1 577 11 q 403 -15 466 -15 q 141 79 241 -15 q 41 336 41 173 q 137 586 41 490 q 386 683 234 683 q 608 601 532 683 q 684 373 684 520 l 684 332 l 267 332 q 325 165 267 232 q 482 98 383 98 m 436 754 l 211 862 q 162 896 181 877 q 143 946 143 915 q 165 996 143 976 q 217 1017 186 1017 q 274 996 250 1017 q 320 952 298 975 l 508 754 l 436 754 m 478 411 q 481 444 481 422 q 459 566 481 513 q 377 620 438 620 q 292 562 318 620 q 267 437 267 505 l 267 411 l 478 411 "},"μ":{"x_min":79,"x_max":729,"ha":808,"o":"m 717 322 q 723 136 717 256 q 729 0 729 15 l 629 5 q 564 2 609 5 q 518 0 519 0 l 518 81 q 448 4 479 23 q 384 -15 417 -15 q 333 -4 352 -15 q 288 25 313 7 l 288 34 l 287 -57 l 288 -190 l 287 -180 q 292 -278 287 -212 q 297 -368 297 -344 q 221 -361 240 -361 q 189 -361 201 -361 q 150 -361 168 -361 q 79 -368 131 -362 q 86 -277 83 -323 q 90 -187 90 -231 l 90 116 q 90 303 90 177 q 90 491 90 428 q 86 593 90 530 q 82 667 82 655 q 190 659 139 659 q 255 663 214 659 q 305 666 296 666 q 301 506 305 613 q 297 360 297 398 l 297 260 q 315 142 297 189 q 396 95 334 95 q 486 153 466 95 q 507 299 507 211 q 503 517 507 385 q 500 667 500 650 q 619 659 566 659 q 683 663 645 659 q 729 666 722 666 q 723 465 729 594 q 717 322 717 336 "},"÷":{"x_min":169,"x_max":969,"ha":1139,"o":"m 669 667 q 638 597 669 626 q 566 568 608 568 q 497 597 526 568 q 468 669 468 626 q 497 739 468 710 q 567 769 526 769 q 639 739 610 769 q 669 667 669 710 m 969 474 l 969 342 l 169 342 l 169 474 l 969 474 m 669 144 q 638 73 669 103 q 568 44 608 44 q 497 73 526 44 q 468 142 468 102 q 498 214 468 184 q 568 244 528 244 q 639 216 610 244 q 669 144 669 188 "},"h":{"x_min":80,"x_max":729,"ha":808,"o":"m 509 683 q 660 626 601 683 q 719 477 719 570 l 719 403 l 719 246 q 720 109 719 148 q 729 0 722 70 q 665 2 709 0 q 617 5 620 5 q 551 2 598 5 q 501 0 505 0 q 510 147 508 73 q 513 333 513 221 l 509 426 q 482 516 503 482 q 411 551 461 551 q 356 534 380 551 q 322 489 332 517 q 306 428 312 462 q 301 331 301 394 q 304 166 301 277 q 308 0 308 55 q 244 3 284 0 q 194 6 204 6 q 129 3 171 6 q 80 0 88 0 q 85 255 80 84 q 91 513 91 426 q 85 769 91 598 q 80 1024 80 940 l 180 1018 l 197 1018 q 308 1023 259 1018 q 304 902 308 976 q 301 815 301 827 l 301 583 q 509 683 379 683 "},".":{"x_min":68,"x_max":306,"ha":375,"o":"m 187 221 q 268 186 230 221 q 306 104 306 151 q 270 23 306 61 q 187 -15 235 -15 q 102 18 137 -15 q 68 103 68 51 q 102 186 68 151 q 187 221 137 221 "},"φ":{"x_min":32,"x_max":1012,"ha":1044,"o":"m 418 388 q 477 605 418 528 q 671 683 537 683 q 913 589 814 683 q 1012 352 1012 495 q 902 94 1012 180 q 612 -7 793 9 q 617 -198 612 -69 q 622 -374 622 -326 l 544 -365 q 471 -366 503 -365 q 404 -373 438 -368 q 411 -183 404 -315 q 418 -5 418 -51 q 359 1 377 0 q 320 8 341 2 q 112 118 193 29 q 32 334 32 206 q 123 568 32 488 q 374 669 215 648 q 381 643 376 656 q 393 612 386 629 q 278 504 311 576 q 246 329 246 431 q 285 142 246 223 q 418 61 325 61 l 418 276 l 418 388 m 612 61 q 707 88 670 66 q 763 157 743 109 q 788 255 782 205 q 794 377 794 305 q 791 450 794 416 q 779 528 788 484 q 748 593 770 572 q 696 614 725 614 q 631 564 650 614 q 612 459 612 515 l 612 276 l 612 61 "},";":{"x_min":51.390625,"x_max":347,"ha":447,"o":"m 226 654 q 310 619 274 654 q 347 534 347 584 q 312 450 347 485 q 227 416 277 416 q 142 449 177 416 q 108 534 108 482 q 142 619 108 584 q 226 654 177 654 m 134 120 q 172 203 145 170 q 244 237 200 237 q 313 207 284 237 q 343 137 343 178 q 337 100 343 116 q 319 63 331 84 l 88 -254 l 51 -238 l 134 120 "},"f":{"x_min":8,"x_max":463.5625,"ha":425,"o":"m 381 1024 q 433 1019 413 1024 q 463 1010 453 1012 q 443 934 456 987 q 419 826 430 880 l 412 826 q 362 862 384 850 q 310 874 339 874 q 233 812 233 874 q 258 729 233 773 q 300 658 284 685 l 317 658 q 354 658 336 658 q 428 665 372 659 l 425 669 l 425 641 q 425 607 425 625 q 425 576 425 590 l 356 583 l 306 583 l 306 273 q 308 166 306 200 q 323 0 310 133 q 258 3 299 0 q 209 6 217 6 q 144 3 185 6 q 92 0 102 0 q 102 127 99 51 q 105 272 105 203 l 105 580 l 56 583 l 8 583 l 9 622 l 9 665 q 52 659 29 660 q 105 658 74 658 q 183 904 105 784 q 381 1024 262 1024 "},"“":{"x_min":65.28125,"x_max":609.71875,"ha":654,"o":"m 251 613 q 218 541 243 570 q 154 512 194 512 q 90 537 116 512 q 65 601 65 563 q 87 665 65 634 l 291 949 l 331 933 l 251 613 m 530 613 q 498 542 525 573 q 433 512 472 512 q 371 536 397 512 q 345 598 345 560 q 366 665 345 633 l 570 949 l 609 933 l 530 613 "},"A":{"x_min":-29.171875,"x_max":850,"ha":829,"o":"m 109 322 q 193 530 143 400 q 278 751 244 660 q 351 949 312 843 l 420 944 l 490 949 q 672 450 584 685 q 850 0 759 215 l 716 4 l 580 0 l 551 91 l 497 259 q 398 261 448 259 q 300 264 348 262 l 202 259 q 112 0 162 134 l 22 4 l -29 0 l 109 322 m 354 368 l 464 368 q 416 509 440 446 q 355 662 393 572 q 243 370 295 519 l 354 368 "},"6":{"x_min":40,"x_max":716,"ha":749,"o":"m 463 545 q 646 475 576 545 q 716 293 716 405 q 628 65 716 150 q 398 -19 541 -19 q 133 84 226 -19 q 40 362 40 187 q 160 750 40 590 q 501 911 280 911 q 582 903 544 911 q 670 879 620 895 q 658 812 663 845 q 652 748 652 779 l 643 747 q 579 804 612 784 q 502 825 546 825 q 330 716 383 825 q 278 475 278 608 q 359 528 309 511 q 463 545 409 545 m 383 449 q 297 393 317 449 q 278 257 278 337 q 296 113 278 174 q 381 52 315 52 q 469 110 449 52 q 490 256 490 169 q 469 393 490 337 q 383 449 449 449 "},"‘":{"x_min":68.0625,"x_max":331.9375,"ha":374,"o":"m 251 613 q 218 540 241 569 q 151 512 194 512 q 92 537 116 512 q 68 599 68 563 q 75 632 68 612 q 90 663 81 652 l 293 949 l 331 935 l 251 613 "},"ϊ":{"x_min":-28,"x_max":423,"ha":396,"o":"m 91 126 l 91 543 l 80 666 q 139 661 105 663 q 196 658 173 658 q 264 660 238 658 q 314 666 290 663 q 304 586 307 616 q 301 523 301 557 l 301 113 q 302 72 301 88 q 314 0 304 56 l 195 4 l 81 0 q 87 67 84 30 q 91 126 91 104 m 68 975 q 136 947 108 975 q 164 879 164 919 q 138 811 164 840 q 72 783 112 783 q 2 810 33 783 q -28 879 -28 838 q 0 947 -28 919 q 68 975 27 975 m 328 975 q 395 947 367 975 q 423 879 423 919 q 397 811 423 840 q 331 783 371 783 q 261 810 292 783 q 231 879 231 838 q 258 947 231 919 q 328 975 286 975 "},"π":{"x_min":19,"x_max":957.890625,"ha":965,"o":"m 802 521 l 802 108 l 812 0 l 696 4 l 582 0 q 585 61 582 19 q 589 125 589 102 l 594 320 l 589 557 l 504 563 l 421 557 l 421 520 l 421 108 q 432 0 421 55 l 314 4 l 200 0 q 209 64 206 37 q 213 115 213 91 l 213 315 l 213 514 l 213 557 q 129 531 165 557 q 68 461 93 505 l 33 461 q 31 510 33 497 q 19 603 30 523 q 136 645 75 634 q 273 657 196 657 l 531 657 l 792 657 l 957 667 l 955 612 l 957 552 l 803 557 l 802 521 "},"ά":{"x_min":30,"x_max":827.21875,"ha":878,"o":"m 669 665 l 749 662 l 827 665 q 763 499 782 551 q 720 377 743 447 l 818 0 q 763 6 792 2 q 717 10 733 10 q 662 5 692 10 q 615 0 632 1 l 594 101 q 361 -15 501 -15 q 120 83 210 -15 q 30 334 30 182 q 123 583 30 484 q 368 683 217 683 q 515 647 449 683 q 633 547 582 612 q 651 601 640 563 q 669 665 662 638 m 523 952 q 576 1001 556 986 q 625 1017 596 1017 q 677 994 656 1017 q 698 943 698 972 q 679 896 698 915 q 629 862 660 877 l 406 754 l 337 754 l 523 952 m 383 614 q 313 588 343 614 q 276 523 283 562 q 260 434 265 484 q 256 333 256 385 q 269 174 256 249 q 305 87 275 122 q 385 52 335 52 q 509 144 473 52 q 546 340 546 236 q 522 504 546 428 q 455 597 498 580 q 383 614 411 614 "},"O":{"x_min":40,"x_max":1086,"ha":1129,"o":"m 577 949 q 945 829 804 949 q 1086 486 1086 710 q 942 114 1086 244 q 552 -15 798 -15 q 176 107 313 -15 q 40 465 40 229 q 188 823 40 697 q 577 949 337 949 m 562 73 q 773 194 706 73 q 840 472 840 315 q 773 742 840 624 q 566 860 706 860 q 353 742 420 860 q 287 465 287 624 q 353 193 287 313 q 562 73 420 73 "},"n":{"x_min":80,"x_max":727,"ha":808,"o":"m 91 338 q 85 512 91 391 q 80 667 80 632 q 137 661 125 662 q 180 661 149 661 q 249 661 215 661 q 293 666 279 665 l 293 568 q 391 648 333 616 q 508 681 449 681 q 659 624 600 681 q 719 475 719 567 l 719 329 q 723 172 719 287 q 727 0 727 58 q 673 2 709 0 q 617 5 637 5 q 552 2 598 5 q 502 0 506 0 q 507 175 502 58 q 512 333 512 291 l 512 358 q 508 426 512 393 q 483 514 508 476 q 411 552 459 552 q 355 534 379 552 q 318 487 331 517 q 302 419 305 457 q 299 330 299 382 q 304 148 299 264 q 309 0 309 33 q 244 3 285 0 q 195 6 203 6 q 128 3 170 6 q 80 0 86 0 q 85 188 80 65 q 91 338 91 311 "},"3":{"x_min":30,"x_max":680,"ha":749,"o":"m 365 908 q 561 853 479 908 q 643 691 643 799 q 593 565 643 612 q 457 485 544 517 l 457 476 q 617 410 555 463 q 680 260 680 356 q 573 50 680 122 q 318 -21 466 -21 q 30 58 155 -21 q 90 161 67 120 q 137 250 113 202 l 154 250 q 185 109 154 167 q 292 51 216 51 q 404 109 367 51 q 442 245 442 167 q 397 376 442 327 q 271 425 353 425 l 231 425 l 231 505 l 268 504 q 392 549 345 504 q 439 670 439 594 q 408 785 439 738 q 313 833 377 833 q 213 776 244 833 q 183 644 183 719 l 170 634 q 121 690 145 665 q 43 767 97 716 q 179 874 94 840 q 365 908 265 908 "},"9":{"x_min":30,"x_max":705,"ha":749,"o":"m 281 343 q 98 414 167 343 q 30 601 30 486 q 121 827 30 744 q 359 911 213 911 q 618 801 532 911 q 705 515 705 692 q 583 135 705 291 q 243 -21 461 -21 q 158 -12 193 -21 q 74 9 123 -4 q 87 74 82 42 q 92 140 92 106 l 102 143 q 163 84 127 105 q 243 64 199 64 q 414 172 362 64 q 467 414 467 280 q 386 359 435 376 q 281 343 337 343 m 360 440 q 446 495 426 440 q 467 630 467 551 q 447 775 467 714 q 361 837 427 837 q 274 778 293 837 q 256 631 256 720 q 276 496 256 553 q 360 440 296 440 "},"l":{"x_min":86,"x_max":316,"ha":407,"o":"m 99 501 q 95 701 99 579 q 92 843 92 823 l 86 1024 q 154 1016 125 1019 q 201 1013 183 1013 q 265 1018 232 1013 q 316 1023 297 1022 q 309 719 316 915 q 303 501 303 523 l 307 180 l 316 0 q 263 5 309 1 q 201 10 218 10 q 138 6 169 10 q 86 0 108 2 q 92 292 86 104 q 99 501 99 480 "},"κ":{"x_min":80,"x_max":732.765625,"ha":756,"o":"m 184 659 q 306 667 239 659 l 301 509 l 295 461 l 295 389 q 422 510 367 447 q 545 667 478 573 l 618 667 l 709 667 l 714 657 l 628 576 l 475 425 q 552 292 510 364 q 636 154 595 220 l 732 0 q 661 3 706 0 q 607 6 616 6 q 536 3 579 6 q 486 0 493 0 q 386 174 440 83 q 295 329 331 266 l 295 249 q 298 106 295 206 q 301 0 301 6 l 190 4 l 80 0 q 85 127 80 43 q 91 255 91 212 q 85 461 91 323 q 80 666 80 598 l 184 659 "},"4":{"x_min":43,"x_max":708.265625,"ha":749,"o":"m 706 383 l 701 299 q 704 248 701 271 q 708 211 706 225 q 592 221 650 221 l 592 176 q 594 83 592 127 q 606 0 597 40 q 540 3 579 0 q 497 6 501 6 q 433 3 473 6 q 384 0 393 0 q 393 104 390 44 q 396 219 396 165 l 309 221 q 169 216 262 221 q 43 212 76 212 l 44 296 l 44 379 q 174 568 113 477 q 287 738 235 658 q 396 909 338 818 q 503 902 444 902 q 553 902 527 902 q 606 909 589 907 q 599 720 606 843 q 592 534 592 596 l 592 370 q 650 375 614 370 q 706 383 686 380 m 396 370 l 396 752 l 141 370 l 396 370 "},"p":{"x_min":82,"x_max":772,"ha":825,"o":"m 502 683 q 704 574 636 683 q 772 322 772 466 q 701 82 772 179 q 491 -15 630 -15 q 302 85 371 -15 l 302 -71 l 309 -385 q 249 -379 278 -382 q 196 -376 221 -376 q 139 -379 171 -376 q 82 -384 108 -381 q 87 -252 82 -341 q 92 -131 92 -162 l 88 487 l 82 666 q 195 659 141 659 q 235 660 216 659 q 307 666 254 661 q 302 580 302 618 q 391 656 343 630 q 502 683 440 683 m 430 79 q 472 86 453 79 q 515 122 491 94 q 548 204 539 151 q 557 337 557 258 q 532 503 557 431 q 430 576 507 576 q 324 501 350 576 q 298 327 298 427 q 323 152 298 226 q 430 79 349 79 "},"ψ":{"x_min":59,"x_max":1025,"ha":1064,"o":"m 1025 437 q 919 131 1025 249 q 625 -7 813 13 q 630 -190 625 -68 q 636 -374 636 -312 l 558 -365 q 483 -366 516 -365 q 418 -373 451 -368 q 424 -159 418 -297 q 431 -5 431 -22 q 374 0 401 -2 q 271 20 348 2 q 127 124 195 37 q 59 331 59 211 l 60 484 l 59 666 l 168 663 l 277 666 q 269 506 277 619 q 261 358 261 392 q 293 144 261 228 q 431 51 325 60 l 431 253 q 424 572 431 367 q 418 800 418 777 l 536 795 l 636 798 q 630 650 636 748 q 625 501 625 551 l 625 254 l 625 51 q 767 146 726 51 q 808 359 808 241 q 798 498 808 440 q 762 650 788 556 q 867 654 821 650 q 980 666 913 658 q 1025 437 1025 552 "},"Ü":{"x_min":82,"x_max":910,"ha":997,"o":"m 210 927 l 338 931 q 329 643 338 836 q 321 421 321 451 q 360 197 321 284 q 521 110 400 110 q 678 162 609 110 q 756 279 747 214 q 768 420 765 344 q 771 548 771 495 q 756 931 771 755 l 814 927 l 910 931 q 903 770 910 883 q 896 616 896 657 l 896 480 l 896 375 q 794 81 896 178 q 493 -15 692 -15 q 210 56 321 -15 q 100 287 100 128 q 91 619 100 386 q 82 931 82 852 l 210 927 m 394 1242 q 461 1215 433 1242 q 489 1148 489 1189 q 463 1078 489 1107 q 396 1050 437 1050 q 327 1078 355 1050 q 299 1148 299 1107 q 326 1214 299 1186 q 394 1242 354 1242 m 654 1242 q 721 1214 694 1242 q 749 1148 749 1187 q 724 1079 749 1108 q 658 1050 699 1050 q 588 1077 617 1050 q 559 1148 559 1105 q 587 1214 559 1187 q 654 1242 615 1242 "},"à":{"x_min":44,"x_max":706.78125,"ha":706,"o":"m 237 -15 q 98 35 153 -15 q 44 169 44 86 q 212 352 44 301 q 401 421 380 403 q 410 439 410 432 q 373 539 410 502 q 275 577 337 577 q 140 511 185 577 l 135 511 l 115 585 q 230 657 164 632 q 365 683 296 683 q 543 623 479 683 q 608 452 608 564 l 604 213 q 604 166 604 184 q 608 123 604 148 q 625 87 612 99 q 658 76 638 76 q 679 80 666 76 q 702 90 691 84 l 706 40 q 643 1 676 14 q 563 -15 610 -10 q 481 5 520 -15 q 421 64 441 26 q 237 -15 351 -15 m 425 755 l 201 863 q 145 902 159 883 q 131 944 131 921 q 153 996 131 975 q 206 1017 175 1017 q 253 1002 232 1017 q 309 953 273 987 l 494 755 l 425 755 m 240 200 q 261 128 240 158 q 321 99 282 99 q 388 131 367 99 q 410 211 410 164 l 410 352 q 287 302 335 338 q 240 200 240 267 "},"η":{"x_min":80,"x_max":727,"ha":808,"o":"m 91 339 q 85 512 91 391 q 80 667 80 632 q 137 661 125 662 q 180 661 149 661 q 244 663 199 661 q 293 666 290 666 l 293 568 q 391 651 338 622 q 511 681 443 681 q 660 622 602 681 q 719 471 719 564 l 719 328 l 719 -49 q 723 -219 719 -106 q 727 -373 727 -332 q 618 -365 670 -365 q 502 -373 562 -365 l 512 16 l 512 251 l 512 368 q 491 499 512 446 q 408 552 471 552 q 319 488 342 552 q 302 419 305 457 q 299 330 299 382 q 304 148 299 264 q 309 0 309 33 q 243 3 278 0 q 195 6 207 6 q 127 3 163 6 q 80 0 92 0 q 85 188 80 65 q 91 339 91 311 "}},"cssFontWeight":"bold","ascender":1288,"underlinePosition":-133,"cssFontStyle":"normal","boundingBox":{"yMin":-385,"xMin":-147,"yMax":1288,"xMax":1618},"resolution":1000,"original_font_information":{"postscript_name":"Optimer-Bold","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Optimer Bold","font_family_name":"Optimer","copyright":"Copyright (c) Magenta Ltd., 2004.","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta Ltd.:Optimer Bold:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta Ltd.","font_sub_family_name":"Bold"},"descender":-385,"familyName":"Optimer","lineHeight":1672,"underlineThickness":20});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":5,"x_max":726,"ha":781,"o":"m 391 688 q 632 615 538 688 q 726 397 726 542 q 610 107 726 233 q 334 -18 494 -18 q 95 53 185 -18 q 5 272 5 125 q 11 350 5 314 q 45 460 17 386 q 173 611 73 535 q 391 688 273 688 m 212 196 q 234 94 212 139 q 306 49 257 49 q 462 201 411 49 q 513 489 513 353 q 490 585 513 543 q 417 627 468 627 q 293 535 329 627 q 241 381 257 444 q 218 280 225 318 q 212 196 212 242 "},"S":{"x_min":-36,"x_max":692.5625,"ha":692,"o":"m 27 284 l 41 277 q 115 125 64 179 q 262 71 166 71 q 372 105 325 71 q 420 200 420 139 q 337 337 420 265 q 177 478 255 409 q 93 666 93 568 q 190 871 93 794 q 416 949 287 949 q 553 933 485 949 q 692 886 621 917 q 657 790 675 844 q 630 704 639 735 l 614 707 q 548 821 596 779 q 427 863 499 863 q 328 831 370 863 q 287 743 287 799 q 368 600 287 668 q 529 468 449 532 q 614 284 614 384 q 509 64 614 145 q 261 -17 405 -17 q -36 61 98 -17 q 27 284 -1 162 "},"/":{"x_min":-44.03125,"x_max":439.4375,"ha":385,"o":"m -44 -123 l 360 1026 l 439 1025 l 35 -124 l -44 -123 "},"Τ":{"x_min":53,"x_max":809.9375,"ha":696,"o":"m 264 573 l 310 828 q 177 823 266 828 q 53 818 87 818 q 69 877 64 837 q 75 932 75 916 q 249 927 122 932 q 440 922 376 922 q 633 927 504 922 q 809 932 762 932 q 796 895 801 915 q 789 855 790 874 l 789 815 q 548 828 669 828 q 448 420 490 633 q 384 0 407 208 q 315 6 353 2 q 257 10 278 10 q 188 5 226 10 q 129 0 150 1 q 198 256 168 126 q 264 573 228 386 "},"ϕ":{"x_min":5,"x_max":969,"ha":1032,"o":"m 5 275 q 134 567 5 468 q 460 667 264 667 q 510 976 491 816 l 589 969 q 663 972 613 969 q 718 976 713 976 l 680 818 l 643 657 q 875 569 781 644 q 969 361 969 493 q 837 77 969 173 q 514 -18 706 -18 q 475 -202 495 -105 q 455 -374 455 -298 l 374 -365 q 246 -373 311 -365 q 330 -7 295 -181 q 102 70 199 -7 q 5 275 5 147 m 527 56 q 712 166 659 56 q 765 428 765 276 q 729 533 765 490 q 630 591 694 575 l 527 56 m 448 591 l 417 591 q 256 474 306 591 q 206 228 206 358 q 342 60 206 93 l 448 591 "},"y":{"x_min":-129,"x_max":657.125,"ha":603,"o":"m -30 -363 q -70 -366 -49 -363 q -129 -373 -91 -368 q -40 -268 -74 -312 q 30 -162 -6 -223 l 123 -11 q 93 242 105 154 q 65 428 82 330 q 17 667 48 525 l 129 659 q 190 661 156 659 q 255 666 225 664 q 264 480 255 569 q 293 264 274 391 l 392 429 q 445 527 421 479 q 511 666 469 576 l 573 659 q 614 661 590 659 q 657 666 639 664 q 405 271 486 399 q 224 -29 323 142 q 42 -373 125 -201 q 5 -366 22 -369 q -30 -363 -12 -363 "},"≈":{"x_min":118.0625,"x_max":1018.0625,"ha":1136,"o":"m 1018 526 q 891 458 954 483 q 765 433 829 433 q 566 477 704 433 q 373 522 429 522 q 236 488 297 522 q 118 417 176 455 l 118 561 q 254 633 191 608 q 390 658 318 658 q 577 613 444 658 q 759 569 711 569 q 868 588 812 569 q 1018 673 923 608 l 1018 526 m 1018 251 q 893 182 955 207 q 765 158 830 158 q 566 202 704 158 q 373 247 429 247 q 243 217 295 247 q 118 140 191 188 l 118 287 q 252 357 188 332 q 386 383 316 383 q 572 338 444 383 q 759 294 700 294 q 897 325 838 294 q 1018 397 955 356 l 1018 251 "},"Π":{"x_min":0,"x_max":1025,"ha":1025,"o":"m 638 205 l 716 577 q 736 675 729 639 q 761 814 742 710 l 579 819 l 406 815 l 356 608 l 280 237 q 261 118 270 190 q 247 0 251 46 q 174 7 205 4 q 122 10 143 10 q 55 5 91 10 q 0 0 19 1 q 84 343 51 204 q 144 629 116 483 q 188 932 172 776 q 415 927 272 932 q 601 922 559 922 q 823 927 675 922 q 1025 932 972 932 q 945 621 984 783 q 877 299 906 459 q 833 0 848 138 q 767 6 802 2 q 711 9 731 9 q 644 5 681 9 q 587 0 606 1 l 638 205 "},"ΐ":{"x_min":-11,"x_max":625,"ha":393,"o":"m 129 667 q 244 660 189 660 q 305 663 266 660 q 351 667 343 667 q 271 333 304 490 q 212 0 239 176 l 109 5 q 41 2 89 5 q -9 0 -6 0 q 69 351 32 176 q 129 667 107 526 m 71 963 q 128 939 104 963 q 152 881 152 915 q 131 821 152 845 q 73 798 110 798 q 14 821 39 798 q -11 881 -11 845 q 13 938 -11 914 q 71 963 37 963 m 167 757 l 276 930 q 324 995 304 973 q 376 1018 344 1018 q 427 966 427 1018 q 413 923 427 944 q 376 886 398 902 l 221 757 l 167 757 m 544 963 q 601 939 577 963 q 625 881 625 915 q 603 823 625 849 q 547 798 581 798 q 488 822 515 798 q 461 881 461 846 q 484 939 461 915 q 544 963 508 963 "},"g":{"x_min":-94,"x_max":707.390625,"ha":707,"o":"m 108 37 q 52 74 74 48 q 30 134 30 101 q 72 220 30 191 q 178 262 114 249 l 178 273 q 82 336 118 295 q 46 434 46 376 q 134 613 46 548 q 340 679 222 679 q 432 676 386 679 q 544 670 479 673 q 640 674 580 670 q 707 679 699 679 q 694 641 699 658 q 687 600 690 624 l 562 606 q 630 472 630 552 q 534 301 630 359 q 317 243 438 243 l 298 243 q 245 248 281 243 q 206 235 223 248 q 190 200 190 222 q 324 133 190 157 q 532 76 459 108 q 606 -63 606 44 q 485 -292 606 -209 q 211 -375 364 -375 q 0 -323 93 -375 q -94 -162 -94 -272 q -37 -34 -94 -80 q 107 27 18 11 l 108 37 m 239 405 q 256 334 239 362 q 314 306 273 306 q 408 376 380 306 q 436 522 436 447 q 417 592 436 563 q 360 622 398 622 q 290 586 311 622 q 248 487 268 551 q 239 405 243 445 m 46 -152 q 97 -262 46 -222 q 221 -303 148 -303 q 365 -262 300 -303 q 431 -144 431 -221 q 352 -29 431 -52 q 153 -5 274 -5 q 75 -64 104 -27 q 46 -152 46 -101 "},"²":{"x_min":-39,"x_max":464,"ha":493,"o":"m -27 397 q 229 593 144 517 q 314 768 314 669 q 295 829 314 804 q 239 855 276 855 q 176 819 195 855 q 151 734 156 784 l 146 727 q 108 761 121 748 q 63 807 95 774 q 259 901 140 901 q 401 868 338 901 q 464 764 464 836 q 343 579 464 658 q 151 457 223 501 q 305 460 208 457 q 422 464 402 464 q 393 356 401 411 l 247 356 q 104 356 200 356 q -39 356 8 356 q -27 397 -27 374 "},"Κ":{"x_min":0,"x_max":943.0625,"ha":813,"o":"m 376 705 l 336 504 l 519 670 q 630 776 581 723 q 768 932 679 829 l 850 925 q 900 927 880 925 q 943 932 919 929 l 940 918 q 776 770 866 852 q 640 646 686 688 q 506 516 594 604 q 663 198 581 358 l 768 0 q 704 4 747 0 q 637 8 661 8 q 570 4 616 8 q 501 0 524 0 q 406 227 443 143 q 316 406 369 312 l 286 268 q 245 0 259 127 q 172 7 204 4 q 119 10 140 10 q 55 5 91 10 q 0 0 19 1 q 84 315 40 150 q 157 643 127 481 q 187 931 187 805 q 250 926 204 930 q 311 922 295 922 q 381 926 341 922 q 434 932 420 930 q 402 830 413 877 q 376 705 390 783 "},"ë":{"x_min":3,"x_max":675,"ha":714,"o":"m 336 -18 q 100 60 197 -18 q 3 274 3 138 q 118 562 3 441 q 400 683 233 683 q 594 618 522 683 q 667 432 667 553 q 662 372 667 402 q 655 325 658 342 l 401 325 l 222 325 q 222 299 222 313 q 222 277 222 285 l 222 260 q 272 124 222 172 q 410 76 323 76 q 606 146 515 76 l 622 127 q 569 32 589 73 q 336 -18 451 -18 m 326 974 q 392 946 364 974 q 420 877 420 918 q 393 811 420 839 q 326 784 367 784 q 259 811 287 784 q 231 877 231 838 q 258 946 231 918 q 326 974 286 974 m 580 974 q 647 946 619 974 q 675 877 675 918 q 647 811 675 838 q 581 784 620 784 q 514 811 542 784 q 486 877 486 838 q 513 946 486 918 q 580 974 541 974 m 365 394 l 461 399 q 477 513 477 448 q 455 588 477 554 q 397 622 433 622 q 294 555 329 622 q 239 398 259 489 l 365 394 "},"e":{"x_min":3,"x_max":667,"ha":714,"o":"m 337 -18 q 100 60 197 -18 q 3 275 3 139 q 118 564 3 443 q 400 685 233 685 q 594 620 522 685 q 667 432 667 555 q 655 325 667 382 l 402 325 l 226 325 l 222 260 q 273 124 222 173 q 413 76 324 76 q 514 94 464 76 q 608 147 564 112 l 623 127 q 572 32 591 79 q 455 -5 511 7 q 337 -18 400 -18 m 365 394 l 463 399 q 472 455 468 422 q 477 514 477 487 q 455 589 477 554 q 396 624 433 624 q 291 555 328 624 q 239 399 255 487 q 314 396 271 399 q 365 394 358 394 "},"ό":{"x_min":5,"x_max":732.765625,"ha":781,"o":"m 391 688 q 632 615 538 688 q 726 397 726 542 q 610 107 726 233 q 334 -18 494 -18 q 95 53 185 -18 q 5 272 5 125 q 11 350 5 314 q 45 460 17 386 q 173 611 73 535 q 391 688 273 688 m 373 757 l 577 970 q 619 1004 598 991 q 664 1018 641 1018 q 711 994 691 1018 q 732 945 732 970 q 716 906 732 922 q 672 873 700 890 l 438 757 l 373 757 m 212 196 q 234 94 212 139 q 306 49 257 49 q 462 201 411 49 q 513 489 513 353 q 490 585 513 543 q 417 627 468 627 q 293 535 329 627 q 241 381 257 444 q 218 280 225 318 q 212 196 212 242 "},"J":{"x_min":-172.21875,"x_max":443.0625,"ha":456,"o":"m -172 -150 q -90 -141 -131 -150 q 12 -60 -16 -123 q 90 254 41 2 l 134 500 q 175 736 159 632 q 190 932 190 840 q 256 926 220 929 q 320 923 293 923 q 380 926 347 923 q 443 931 413 929 q 386 711 413 838 q 336 463 358 584 q 284 163 315 341 q 167 -119 254 -13 q -140 -225 80 -225 q -157 -190 -150 -209 q -172 -150 -165 -172 "},"»":{"x_min":-23,"x_max":612,"ha":696,"o":"m 8 0 q -4 24 2 13 q -23 47 -11 35 q 76 181 29 129 q 199 314 122 233 q 89 619 128 464 q 113 640 100 626 q 138 667 125 654 q 223 489 177 579 q 327 304 270 398 q 168 155 256 238 q 8 0 81 72 m 293 0 q 279 24 286 12 q 260 47 272 35 q 358 175 297 105 q 484 314 418 245 q 418 467 446 391 q 375 619 390 542 q 398 640 385 626 q 421 667 411 654 q 612 304 514 469 q 508 206 582 276 q 396 101 434 137 q 293 0 358 65 "},"©":{"x_min":72,"x_max":1064,"ha":1138,"o":"m 1064 487 q 918 140 1064 287 q 572 -6 773 -6 q 221 140 370 -6 q 72 490 72 287 q 220 837 72 690 q 569 985 369 985 q 917 836 770 985 q 1064 487 1064 688 m 155 491 q 276 199 155 323 q 567 75 398 75 q 858 197 734 75 q 982 488 982 319 q 861 781 982 659 q 569 904 740 904 q 277 781 399 904 q 155 491 155 659 m 684 598 q 650 668 684 639 q 574 697 617 697 q 470 638 501 697 q 439 499 439 579 q 468 355 439 422 q 563 289 497 289 q 687 398 667 289 l 815 398 q 737 248 806 304 q 572 192 669 192 q 376 275 450 192 q 303 482 303 358 q 372 695 303 604 q 559 786 441 786 q 725 735 653 786 q 810 598 797 685 l 684 598 "},"ώ":{"x_min":5,"x_max":1055,"ha":1118,"o":"m 248 -14 q 70 50 136 -14 q 5 226 5 115 q 75 466 5 347 q 250 668 145 584 q 300 665 266 668 q 353 662 335 662 q 416 665 393 662 q 449 668 438 668 q 273 436 338 562 q 209 172 209 311 q 227 87 209 123 q 288 51 245 51 q 409 186 377 51 q 460 514 440 322 l 571 508 l 684 514 q 632 337 652 418 q 600 168 613 256 l 599 132 l 600 96 q 649 51 610 55 q 794 169 753 51 q 836 420 836 288 q 817 543 836 486 q 760 668 798 601 q 812 663 802 663 q 852 662 823 662 q 905 665 870 662 q 957 668 939 668 q 1029 551 1003 611 q 1055 426 1055 491 q 945 121 1055 256 q 673 -14 836 -14 q 555 13 606 -14 q 482 101 503 41 q 380 16 443 46 q 248 -14 317 -14 m 545 758 l 749 971 q 793 1006 771 994 q 838 1019 814 1019 q 884 995 863 1019 q 905 946 905 971 q 889 907 905 923 q 846 874 873 891 l 612 758 l 545 758 "},"≥":{"x_min":169.4375,"x_max":965,"ha":1136,"o":"m 965 571 l 965 457 l 172 200 l 172 336 l 727 512 l 172 690 l 172 827 l 965 571 m 965 132 l 965 0 l 169 0 l 169 132 l 965 132 "},"^":{"x_min":32,"x_max":458,"ha":393,"o":"m 401 756 l 279 886 l 101 756 l 32 756 l 238 1003 l 351 1003 l 458 756 l 401 756 "},"«":{"x_min":30,"x_max":664.71875,"ha":696,"o":"m 348 668 q 364 635 362 639 q 381 621 366 632 q 279 490 341 561 q 156 354 218 419 q 220 197 196 261 q 266 47 243 133 q 243 26 255 38 q 220 0 231 13 q 129 182 173 97 q 30 363 85 267 q 184 507 106 433 q 348 668 262 582 m 631 668 q 664 621 643 641 q 566 488 623 554 q 440 354 509 422 q 500 209 473 284 q 550 47 527 134 q 528 27 539 38 q 503 0 517 16 q 408 195 448 117 q 314 363 368 273 q 631 668 472 507 "},"D":{"x_min":-4,"x_max":999,"ha":1038,"o":"m 183 932 q 255 925 237 926 q 296 925 273 925 q 440 928 353 925 q 541 932 528 932 q 871 849 744 932 q 999 575 999 766 q 818 149 999 298 q 353 0 637 0 q 237 5 315 0 q 132 10 159 10 q -4 0 62 10 q 80 329 46 183 q 141 624 115 474 q 183 932 168 773 m 340 86 q 649 219 537 86 q 761 552 761 352 q 690 769 761 691 q 482 846 619 846 l 409 842 q 319 466 359 658 q 255 94 279 273 q 305 88 276 91 q 340 86 333 86 "},"w":{"x_min":22,"x_max":1076.171875,"ha":1021,"o":"m 22 667 l 138 661 l 247 667 q 253 473 247 562 q 276 228 259 384 q 494 667 387 435 l 584 661 l 669 667 l 683 382 l 694 228 l 819 464 q 863 546 847 514 q 920 667 880 579 l 999 661 l 1076 667 q 859 339 959 505 q 677 0 759 172 l 594 5 l 512 0 q 508 171 512 104 q 487 417 503 239 q 375 220 431 325 q 263 0 319 115 l 198 4 l 81 0 q 66 320 81 159 q 22 667 51 480 "},"$":{"x_min":-1,"x_max":735.109375,"ha":749,"o":"m -1 86 q 35 177 18 132 q 68 271 53 222 l 93 265 q 137 134 93 187 q 259 64 181 82 l 323 368 q 150 495 196 433 q 105 626 105 557 q 200 836 105 765 q 440 907 296 907 q 454 1017 447 961 l 500 1017 l 550 1017 l 521 901 q 735 820 637 883 q 704 758 714 783 q 670 666 693 733 l 639 666 q 593 773 626 728 q 504 832 560 819 l 441 540 q 607 425 544 490 q 670 263 670 359 q 569 50 670 122 q 324 -20 468 -20 q 299 -165 307 -88 l 250 -165 l 204 -165 q 219 -117 214 -135 q 245 -11 224 -99 q 119 14 181 -11 q -1 86 57 40 m 481 205 q 457 279 481 247 q 394 330 434 311 l 335 64 q 437 105 394 64 q 481 205 481 147 m 430 835 q 322 799 368 835 q 277 701 277 764 q 306 629 277 663 q 376 577 335 596 l 430 835 "},"‧":{"x_min":137,"x_max":368,"ha":458,"o":"m 253 681 q 334 648 301 681 q 368 568 368 616 q 333 484 368 518 q 251 450 299 450 q 170 483 203 450 q 137 566 137 516 q 170 647 137 614 q 253 681 203 681 "},"\\":{"x_min":61.015625,"x_max":324.015625,"ha":385,"o":"m 247 -123 l 61 1026 l 137 1026 l 324 -124 l 247 -123 "},"Ι":{"x_min":8.328125,"x_max":451.390625,"ha":458,"o":"m 261 0 q 196 4 248 0 q 122 9 144 9 q 55 5 88 9 q 8 0 22 1 q 93 324 52 162 q 159 632 133 487 q 198 932 186 776 q 270 925 238 928 q 323 922 301 922 q 393 926 354 922 q 451 932 431 930 q 336 485 387 744 q 261 0 284 226 "},"Ύ":{"x_min":-44,"x_max":1217.109375,"ha":1108,"o":"m 535 80 l 574 259 l 601 391 q 531 667 568 536 q 444 932 493 798 q 506 926 474 929 q 566 924 538 924 q 631 926 595 924 q 700 931 667 929 q 793 540 734 729 q 930 727 865 630 q 1058 931 995 823 q 1105 926 1078 929 q 1139 924 1132 924 q 1176 926 1156 924 q 1217 931 1196 929 q 829 405 1010 672 l 797 267 q 766 108 775 160 q 757 0 757 56 q 692 6 726 2 q 637 10 658 10 q 571 5 608 10 q 514 0 533 1 l 535 80 m -44 756 l 160 970 q 203 1004 181 991 q 247 1018 225 1018 q 295 994 274 1018 q 316 945 316 970 q 300 906 316 922 q 257 873 284 890 l 23 756 l -44 756 "},"’":{"x_min":72.21875,"x_max":423.609375,"ha":374,"o":"m 72 516 l 226 848 q 273 929 250 907 q 326 951 297 951 q 393 930 362 951 q 423 877 423 910 q 406 821 423 851 q 365 764 388 791 l 100 492 l 72 516 "},"Ν":{"x_min":6.9375,"x_max":1033.328125,"ha":1038,"o":"m 194 946 l 265 938 q 341 941 317 938 q 379 946 365 944 q 467 795 399 911 q 560 640 536 680 q 652 493 584 600 l 780 281 l 841 615 q 895 931 872 766 l 962 925 q 1003 927 984 925 q 1033 931 1022 930 q 977 724 1002 827 q 927 501 952 620 l 858 159 l 825 -14 l 752 -5 q 714 -8 737 -5 q 673 -14 691 -11 q 533 237 605 109 q 404 458 461 364 q 263 678 347 551 l 208 384 q 151 -1 173 170 q 107 5 126 2 q 76 8 88 8 q 38 4 59 8 q 6 -1 18 0 q 123 473 73 227 q 194 946 172 718 "},"-":{"x_min":4.171875,"x_max":405.5625,"ha":444,"o":"m 37 425 l 198 418 q 319 421 245 418 q 405 425 393 425 q 383 332 391 374 q 370 244 375 289 q 284 249 354 244 q 180 255 213 255 q 91 249 152 255 q 4 244 30 244 q 24 332 16 288 q 37 425 31 376 "},"Q":{"x_min":36,"x_max":1080,"ha":1117,"o":"m 412 -9 q 137 120 238 13 q 36 402 36 227 q 195 789 36 628 q 578 951 355 951 q 938 854 796 951 q 1080 548 1080 758 q 966 202 1080 359 q 672 4 853 45 q 792 -44 736 -22 q 913 -88 849 -66 l 1051 -134 l 1048 -158 q 974 -219 1009 -186 q 905 -295 939 -252 q 674 -156 805 -231 q 412 -9 542 -80 m 282 360 q 336 156 282 237 q 511 75 390 75 q 758 230 677 75 q 840 570 840 385 q 782 777 840 692 q 608 862 724 862 q 402 757 479 862 q 303 546 325 653 q 282 360 282 438 "},"ς":{"x_min":9,"x_max":653.671875,"ha":707,"o":"m 403 616 q 262 547 317 616 q 208 388 208 478 q 307 240 208 288 q 496 174 402 207 q 598 35 598 129 q 534 -123 598 -59 q 404 -238 471 -187 l 352 -191 q 416 -128 395 -152 q 437 -69 437 -103 q 410 -23 437 -41 q 348 3 384 -5 q 96 119 184 55 q 9 319 9 183 q 121 585 9 483 q 399 688 234 688 q 524 670 461 688 q 653 621 587 652 q 618 545 638 593 q 587 466 598 497 l 569 466 q 513 578 549 541 q 403 616 477 616 "},"M":{"x_min":-11.109375,"x_max":1213.890625,"ha":1231,"o":"m 222 932 q 265 926 240 929 q 309 923 291 923 q 348 926 326 923 q 391 932 370 929 q 480 610 436 761 q 579 310 525 460 l 866 698 l 1033 932 q 1090 926 1061 929 q 1123 923 1119 923 q 1169 927 1138 923 q 1213 932 1200 932 q 1138 598 1168 740 q 1085 307 1109 457 q 1047 0 1061 157 l 962 8 q 881 6 913 8 q 809 0 848 5 q 859 239 833 93 q 890 413 886 386 l 919 590 q 702 297 808 448 q 497 -11 597 147 l 415 -11 q 344 289 383 141 q 256 597 305 437 q 195 304 226 463 q 140 0 163 144 q 101 4 127 0 q 62 8 74 8 q 26 5 45 8 q -11 0 6 2 q 222 932 116 459 "},"Ψ":{"x_min":80,"x_max":1168.890625,"ha":1143,"o":"m 297 472 q 329 380 297 407 q 428 353 362 353 q 492 658 466 516 q 530 932 517 800 q 610 924 582 926 q 655 922 638 922 q 724 926 687 922 q 782 932 761 930 q 710 662 743 808 q 648 352 677 516 l 688 353 q 855 494 818 353 q 931 932 892 635 q 989 927 952 932 q 1048 923 1027 923 q 1118 927 1075 923 q 1168 932 1161 932 q 1127 759 1153 883 q 1080 533 1102 634 q 936 347 1057 432 q 628 263 814 263 q 609 129 618 196 q 593 0 599 63 q 530 4 578 0 q 461 10 482 10 q 396 5 432 10 q 341 0 360 1 q 382 154 374 125 q 406 263 389 183 q 179 322 279 263 q 80 500 80 381 q 82 551 80 535 q 93 612 84 567 l 131 795 q 142 855 135 816 q 155 932 149 894 q 223 927 180 932 q 274 923 266 923 q 332 926 299 923 q 392 932 366 929 q 315 653 334 753 q 297 472 297 553 "},"C":{"x_min":36,"x_max":969.453125,"ha":929,"o":"m 502 -21 q 165 89 295 -21 q 36 403 36 199 q 212 796 36 641 q 630 951 388 951 q 806 929 723 951 q 969 863 890 908 q 942 792 963 851 q 902 670 920 733 l 884 676 q 794 817 861 769 q 629 865 727 865 q 365 712 452 865 q 278 366 278 559 q 343 151 278 234 q 537 69 408 69 q 680 96 612 69 q 812 179 748 124 l 829 159 q 808 105 818 133 q 788 40 798 77 q 654 -6 729 8 q 502 -21 580 -21 "},"œ":{"x_min":5,"x_max":1165,"ha":1211,"o":"m 300 -19 q 83 55 161 -19 q 5 268 5 129 q 121 561 5 436 q 406 686 238 686 q 540 663 475 686 q 643 593 604 641 q 765 661 703 637 q 893 686 827 686 q 1089 622 1014 686 q 1165 441 1165 559 q 1162 386 1165 415 q 1155 325 1160 358 l 902 325 l 724 325 q 720 295 721 309 q 718 261 718 282 q 773 128 718 178 q 910 79 827 79 q 1106 146 1016 79 l 1123 127 q 1068 32 1091 79 q 959 -4 1017 9 q 846 -19 902 -19 q 694 3 764 -19 q 572 78 624 25 q 451 4 524 28 q 300 -19 379 -19 m 871 390 l 960 390 q 972 453 969 428 q 976 506 976 477 q 957 587 976 556 q 892 619 939 619 q 790 553 824 619 q 738 394 757 488 l 871 390 m 218 193 q 245 94 218 140 q 321 49 272 49 q 479 196 428 49 q 531 473 531 343 q 506 582 531 534 q 427 630 482 630 q 308 553 349 630 q 244 375 266 476 q 218 193 218 282 "},"!":{"x_min":40,"x_max":440,"ha":458,"o":"m 158 -17 q 74 16 109 -17 q 40 98 40 49 q 74 181 40 146 q 159 216 109 216 q 241 179 208 216 q 275 93 275 143 q 241 14 275 46 q 158 -17 208 -17 m 178 310 l 199 792 q 226 909 199 868 q 323 951 252 951 q 405 928 370 951 q 440 860 440 905 q 433 810 440 835 q 410 745 426 785 l 222 310 l 178 310 "},"ç":{"x_min":3,"x_max":661.328125,"ha":658,"o":"m 332 -14 q 98 60 193 -14 q 3 269 3 134 q 128 561 3 441 q 428 682 254 682 q 552 668 496 682 q 661 621 608 655 q 624 527 641 584 q 597 440 607 470 l 575 436 l 576 465 q 537 572 576 529 q 434 615 498 615 q 273 507 324 615 q 222 277 222 399 q 262 132 222 190 q 388 74 302 74 q 464 88 426 74 q 539 128 502 103 l 555 111 l 503 15 q 417 -6 459 1 q 332 -14 375 -14 m 90 -194 q 189 -229 154 -220 q 255 -239 224 -239 q 304 -225 283 -239 q 326 -184 326 -211 q 306 -145 326 -158 q 258 -132 287 -132 q 201 -139 231 -132 l 247 1 l 305 1 l 280 -74 l 321 -70 q 411 -99 376 -70 q 447 -181 447 -128 q 404 -276 447 -245 q 294 -308 361 -308 q 196 -291 252 -308 q 94 -251 140 -274 l 90 -194 "},"{":{"x_min":104,"x_max":588.71875,"ha":683,"o":"m 588 844 l 540 844 q 495 836 516 844 q 463 816 473 828 q 448 792 453 803 q 442 753 444 781 l 442 712 l 442 552 q 415 423 442 464 q 305 353 388 381 q 413 287 384 335 q 442 154 442 240 l 442 -5 q 465 -105 442 -74 q 555 -137 489 -137 l 588 -137 l 588 -277 l 481 -275 q 344 -234 397 -268 q 281 -122 290 -200 l 281 -48 l 281 117 q 246 238 281 194 q 138 283 212 283 l 104 283 l 104 423 q 240 459 200 423 q 281 589 281 495 l 281 757 l 281 831 q 356 951 293 919 q 518 983 419 983 l 588 983 l 588 844 "},"X":{"x_min":-90,"x_max":868.34375,"ha":803,"o":"m 195 313 l 311 445 q 223 684 272 564 q 119 932 175 805 q 186 926 150 929 q 250 924 222 924 q 313 926 276 924 q 379 931 349 929 q 423 785 398 862 q 477 630 448 708 q 695 931 590 776 q 782 924 739 928 q 825 928 796 924 q 868 931 854 931 q 739 795 808 870 q 613 654 670 720 l 511 529 q 587 298 563 363 q 625 191 611 233 l 694 0 q 626 5 666 2 q 558 8 586 8 q 498 5 531 8 q 433 0 465 2 q 395 165 416 80 q 349 331 374 250 q 213 170 276 248 q 84 0 151 93 q 39 6 61 4 q -2 8 16 8 q -45 5 -22 8 q -90 0 -69 2 q 52 153 1 98 q 195 313 102 208 "},"ô":{"x_min":5,"x_max":724,"ha":781,"o":"m 390 688 q 630 615 536 688 q 724 398 724 542 q 608 108 724 234 q 333 -18 493 -18 q 93 52 181 -18 q 5 272 5 122 q 39 445 5 354 q 172 612 73 536 q 390 688 272 688 m 594 757 l 473 887 l 293 757 l 224 757 l 433 1004 l 547 1004 l 651 757 l 594 757 m 213 194 q 235 94 213 140 q 306 49 257 49 q 462 201 411 49 q 513 487 513 353 q 490 586 513 544 q 417 628 468 628 q 292 534 329 628 q 240 378 254 441 q 220 285 228 336 q 213 194 213 235 "},"#":{"x_min":30,"x_max":1019,"ha":1050,"o":"m 619 975 l 520 699 l 684 699 l 782 975 l 930 975 l 831 699 l 1019 700 l 972 564 l 784 563 l 727 403 l 922 403 l 872 271 l 678 271 l 579 -5 l 431 -5 l 530 271 l 366 271 l 269 -5 l 121 -5 l 221 271 l 30 271 l 79 403 l 268 403 l 325 564 l 126 564 l 176 700 l 374 700 l 471 975 l 619 975 m 412 403 l 580 403 l 637 564 l 469 564 l 412 403 "},"ι":{"x_min":-8.71875,"x_max":352.390625,"ha":393,"o":"m 130 667 q 245 660 189 660 q 305 663 267 660 q 352 667 344 667 q 272 333 305 490 q 213 0 239 176 l 110 5 q 41 2 89 5 q -8 0 -5 0 q 70 351 32 176 q 130 667 107 526 "},"Ά":{"x_min":-93,"x_max":786,"ha":856,"o":"m 519 34 q 511 147 519 88 q 496 265 503 206 q 341 275 416 275 q 265 270 306 275 q 201 265 224 266 q 115 111 137 151 q 61 0 94 70 l -8 5 q -44 3 -22 5 q -93 0 -66 1 q 97 292 6 149 q 274 577 187 434 q 491 938 362 721 l 555 933 q 589 935 570 933 q 617 938 608 936 l 665 618 q 701 394 681 514 q 739 188 722 273 q 786 0 756 102 q 701 10 734 7 q 648 13 669 13 q 598 10 621 13 q 519 0 576 7 l 519 34 m -44 756 l 159 970 q 202 1004 180 991 q 247 1018 225 1018 q 294 994 273 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 m 333 363 l 485 363 q 468 529 473 478 q 448 671 462 580 q 350 518 404 603 q 257 365 295 433 l 333 363 "},")":{"x_min":-86.109375,"x_max":360,"ha":446,"o":"m 360 473 q 249 87 360 262 q -52 -187 139 -87 l -86 -132 l -17 -82 q 154 196 100 26 q 209 551 209 366 q 190 750 209 659 q 125 922 172 841 l 172 957 q 314 730 268 844 q 360 473 360 616 "},"ε":{"x_min":-5,"x_max":590.84375,"ha":657,"o":"m 545 483 l 531 483 q 485 579 521 546 q 387 612 450 612 q 307 582 340 612 q 275 503 275 552 q 309 425 275 453 q 438 397 344 397 q 426 365 429 378 q 418 315 424 351 q 383 320 401 319 q 345 322 365 322 q 243 287 285 322 q 201 192 201 252 q 244 92 201 130 q 353 54 288 54 q 470 87 418 54 q 556 179 522 120 l 570 173 q 565 144 567 158 q 564 113 564 130 q 567 74 564 98 q 571 44 571 49 q 450 0 518 13 q 310 -14 382 -14 q 90 30 185 -14 q -5 185 -5 74 q 49 307 -5 265 q 188 359 103 349 q 117 414 143 381 q 92 494 92 446 q 173 635 92 588 q 358 683 255 683 q 478 662 419 683 q 590 605 536 642 q 564 542 571 558 q 545 483 557 526 "},"Δ":{"x_min":-93,"x_max":786,"ha":856,"o":"m 491 938 q 522 934 508 935 q 555 933 536 933 q 589 935 570 933 q 618 938 608 937 l 665 618 q 720 278 695 416 q 786 0 745 139 q 568 4 734 0 q 327 10 402 10 q 107 4 255 10 q -93 0 -40 0 q 100 298 22 174 q 268 566 179 421 q 491 938 356 711 m 257 113 q 408 116 317 113 q 514 120 500 120 l 498 255 q 448 671 476 469 q 314 460 380 572 l 120 119 l 257 113 "},"â":{"x_min":-9,"x_max":622.9375,"ha":714,"o":"m 175 -14 q 42 32 94 -14 q -9 159 -9 79 q 61 320 -9 267 q 220 382 132 372 q 366 401 307 392 q 419 486 419 417 q 386 561 419 536 q 300 586 353 586 q 135 505 198 586 l 119 501 q 139 611 134 558 q 266 662 203 643 q 389 682 328 682 q 549 635 483 682 q 615 500 615 588 q 609 454 612 476 q 601 409 606 432 l 560 232 q 544 162 552 198 q 536 95 536 126 q 552 68 536 79 q 585 57 567 57 q 606 59 595 57 q 622 63 617 61 l 619 15 q 492 -10 560 -10 q 352 88 384 -10 q 280 11 326 37 q 175 -14 234 -14 m 562 755 l 440 886 l 260 755 l 192 755 l 399 1003 l 512 1003 l 619 755 l 562 755 m 190 177 q 206 115 190 141 q 256 90 223 90 q 357 195 336 90 q 384 328 378 300 q 250 291 303 328 q 190 177 196 254 "},"}":{"x_min":93,"x_max":579,"ha":683,"o":"m 125 983 q 323 955 244 983 q 403 831 403 927 l 403 757 l 403 589 q 419 490 403 532 q 480 431 436 448 q 524 425 500 427 q 579 423 549 423 l 579 283 q 442 249 481 283 q 403 117 403 216 l 403 -49 q 373 -204 403 -147 q 284 -267 343 -260 q 179 -275 225 -274 q 93 -277 133 -277 l 93 -138 q 201 -120 162 -138 q 240 -42 240 -103 l 240 -4 l 240 153 q 269 284 240 241 q 380 353 298 328 q 268 421 296 378 q 240 552 240 463 l 240 712 q 218 814 240 785 q 126 844 197 844 l 93 844 l 93 983 l 125 983 "},"‰":{"x_min":30,"x_max":1559,"ha":1579,"o":"m 296 910 q 444 860 382 910 q 507 726 507 811 q 425 547 507 620 q 238 475 344 475 q 91 524 153 475 q 30 657 30 573 q 54 762 30 702 q 145 866 78 822 q 296 910 213 910 m 126 -123 l 844 1015 l 927 1014 l 211 -123 l 126 -123 m 1348 413 q 1495 365 1431 413 q 1559 235 1559 317 q 1478 53 1559 128 q 1290 -22 1398 -22 q 1141 25 1201 -22 q 1082 160 1082 73 q 1105 262 1082 204 q 1197 366 1129 319 q 1348 413 1265 413 m 815 413 q 963 365 899 413 q 1027 235 1027 317 q 946 53 1027 128 q 757 -22 865 -22 q 610 25 671 -22 q 549 160 549 73 q 568 247 549 205 q 665 366 597 319 q 815 413 733 413 m 1215 111 q 1233 51 1215 75 q 1285 28 1251 28 q 1393 112 1359 28 q 1427 280 1427 196 q 1406 339 1427 319 q 1354 360 1386 360 q 1278 314 1307 360 q 1235 215 1249 269 q 1219 162 1224 186 q 1215 111 1215 139 m 163 609 q 181 552 163 577 q 231 528 200 528 q 339 611 305 528 q 374 781 374 694 q 354 837 374 813 q 304 861 335 861 q 227 819 254 861 q 185 729 200 777 q 167 661 171 680 q 163 609 163 643 m 685 111 q 701 50 685 73 q 754 28 718 28 q 860 112 826 28 q 895 280 895 196 q 876 337 895 314 q 824 360 857 360 q 749 316 778 360 q 707 230 721 273 q 689 162 694 186 q 685 111 685 137 "},"Ä":{"x_min":-94,"x_max":832,"ha":856,"o":"m 520 33 q 512 147 520 87 q 497 265 504 206 q 406 272 446 269 q 342 275 365 275 q 269 270 318 275 q 201 265 219 265 q 96 71 115 108 q 60 0 76 34 l -7 5 q -55 2 -21 5 q -94 0 -89 0 q 96 292 6 149 q 274 577 186 434 q 491 938 361 721 q 531 932 521 933 q 556 932 542 932 q 585 933 574 932 q 617 938 596 934 l 665 617 q 718 301 690 462 q 785 0 746 140 q 716 6 762 2 q 647 11 669 11 q 601 9 618 11 q 518 0 585 8 l 520 33 m 482 1253 q 548 1225 520 1253 q 577 1159 577 1198 q 550 1092 577 1120 q 484 1065 524 1065 q 415 1092 443 1065 q 387 1159 387 1119 q 416 1225 387 1197 q 482 1253 445 1253 m 736 1253 q 803 1225 775 1253 q 832 1159 832 1198 q 804 1092 832 1120 q 736 1065 776 1065 q 669 1092 696 1065 q 642 1159 642 1119 q 669 1225 642 1197 q 736 1253 697 1253 m 332 364 l 485 364 q 449 671 468 540 q 334 493 368 547 q 257 365 300 440 l 332 364 "},"a":{"x_min":-9,"x_max":624.328125,"ha":713,"o":"m 174 -14 q 42 31 93 -14 q -9 158 -9 77 q 61 320 -9 266 q 244 386 132 373 q 388 410 356 398 q 421 489 421 421 q 386 561 421 535 q 302 588 351 588 q 135 505 198 588 l 120 502 q 139 612 134 564 q 265 662 203 644 q 389 681 327 681 q 550 635 485 681 q 615 500 615 590 q 601 411 610 448 l 560 230 q 541 140 543 159 q 538 94 538 120 q 552 65 538 77 q 586 54 567 54 q 624 63 604 58 l 621 11 q 495 -14 560 -14 q 354 86 386 -14 q 281 10 327 34 q 174 -14 235 -14 m 190 176 q 206 114 190 140 q 256 89 223 89 q 330 124 310 89 q 386 328 349 159 q 250 291 303 328 q 190 176 196 254 "},"—":{"x_min":183.328125,"x_max":1127.78125,"ha":1367,"o":"m 204 404 l 1127 404 l 1105 261 l 183 261 l 204 404 "},"=":{"x_min":169.4375,"x_max":969.453125,"ha":1138,"o":"m 969 617 l 969 485 l 169 485 l 169 617 l 969 617 m 969 329 l 969 197 l 169 197 l 169 329 l 969 329 "},"N":{"x_min":6.9375,"x_max":1033.328125,"ha":1038,"o":"m 194 946 l 265 938 q 341 941 317 938 q 379 946 365 944 q 467 795 399 911 q 560 640 536 680 q 652 493 584 600 l 780 281 l 841 615 q 895 931 872 766 l 962 925 q 1003 927 984 925 q 1033 931 1022 930 q 977 724 1002 827 q 927 501 952 620 l 858 159 l 825 -14 l 752 -5 q 714 -8 737 -5 q 673 -14 691 -11 q 533 237 605 109 q 404 458 461 364 q 263 678 347 551 l 208 384 q 151 -1 173 170 q 107 5 126 2 q 76 8 88 8 q 38 4 59 8 q 6 -1 18 0 q 123 473 73 227 q 194 946 172 718 "},"ρ":{"x_min":-115.671875,"x_max":737,"ha":793,"o":"m 27 187 q 85 425 56 305 q 199 620 125 553 q 421 688 273 688 q 642 615 548 688 q 737 418 737 542 q 642 125 737 264 q 400 -14 548 -14 q 282 15 337 -14 q 202 101 228 45 q 142 -147 166 -34 q 109 -374 119 -259 q 6 -366 56 -366 q -115 -374 -53 -366 q -36 -84 -68 -209 q 27 187 -4 40 m 531 489 q 507 581 531 541 q 433 621 483 621 q 290 482 341 621 q 239 226 239 343 q 263 133 239 175 q 334 92 287 92 q 426 137 388 92 q 503 312 464 183 q 525 419 519 380 q 531 489 531 458 "},"2":{"x_min":-57,"x_max":703,"ha":749,"o":"m -41 76 q 195 259 88 169 q 388 466 302 350 q 475 690 475 582 q 446 790 475 747 q 363 834 417 834 q 263 773 294 834 q 233 636 233 712 l 223 623 q 139 705 169 673 q 94 754 109 737 q 405 910 205 910 q 614 854 525 910 q 703 686 703 798 q 638 510 703 586 q 462 351 573 434 l 340 257 l 228 171 l 495 180 l 640 187 q 615 94 627 148 q 597 0 602 40 q 433 3 544 0 q 268 8 322 8 q 105 3 213 8 q -57 0 -2 0 q -41 76 -41 35 "},"ü":{"x_min":25,"x_max":772.21875,"ha":808,"o":"m 630 0 q 571 2 613 0 q 527 5 530 5 q 465 2 509 5 q 418 0 422 0 q 443 86 436 38 q 333 13 395 40 q 206 -14 272 -14 q 75 27 126 -14 q 25 148 25 69 q 29 207 25 176 q 43 274 34 238 l 77 426 q 100 530 90 476 q 122 668 109 584 l 230 664 l 348 668 q 270 375 301 501 q 239 180 239 249 q 256 117 239 141 q 311 94 273 94 q 349 105 331 94 q 468 245 438 150 q 517 501 498 340 l 546 668 l 658 664 l 772 668 q 630 0 687 341 m 365 974 q 432 946 404 974 q 460 878 460 918 q 433 811 460 837 q 366 785 407 785 q 299 811 327 785 q 272 878 272 837 q 299 945 272 917 q 365 974 326 974 m 621 974 q 687 946 659 974 q 715 878 715 918 q 688 811 715 837 q 621 785 662 785 q 553 811 581 785 q 526 878 526 837 q 553 946 526 918 q 621 974 581 974 "},"Z":{"x_min":-44.4375,"x_max":900,"ha":857,"o":"m -40 60 q 177 333 84 216 q 349 554 270 451 q 552 823 427 656 l 438 825 q 277 818 388 825 q 127 811 166 811 q 144 864 138 837 q 155 932 150 890 q 348 928 215 932 q 543 924 481 924 q 720 928 601 924 q 900 932 840 932 l 894 882 q 565 486 718 675 q 276 111 412 298 q 545 119 355 111 q 801 128 734 128 q 779 0 779 67 q 572 3 709 0 q 365 8 434 8 q 161 3 297 8 q -44 0 25 0 l -40 60 "},"u":{"x_min":25,"x_max":772.21875,"ha":810,"o":"m 628 -1 q 571 3 583 2 q 528 4 559 4 q 466 1 510 4 q 419 -1 423 -1 q 443 85 437 43 q 335 11 395 37 q 206 -14 274 -14 q 75 27 126 -14 q 25 147 25 68 q 27 188 25 173 q 43 273 29 202 l 77 426 q 102 545 90 475 q 120 670 113 614 q 229 663 169 663 q 348 670 294 663 q 270 374 301 501 q 239 179 239 247 q 256 116 239 140 q 311 93 273 93 q 386 122 332 93 q 470 245 441 151 q 519 501 500 339 l 547 670 q 602 667 565 670 q 658 663 640 663 q 724 667 679 663 q 772 670 769 670 q 696 345 731 511 q 628 -1 660 179 "},"k":{"x_min":-13.890625,"x_max":800,"ha":742,"o":"m 194 1025 q 305 1018 252 1018 q 423 1025 358 1018 q 356 765 386 893 l 275 388 l 300 381 l 448 505 q 527 575 497 545 q 615 666 556 604 q 661 661 637 663 q 705 658 686 658 q 747 661 723 658 q 791 666 772 663 l 800 656 q 636 539 712 598 q 472 402 559 480 q 652 0 552 197 q 577 3 626 0 q 522 6 529 6 q 453 3 496 6 q 404 0 411 0 q 360 142 383 74 q 298 306 336 210 l 260 306 q 227 143 236 188 q 203 0 218 98 q 139 3 177 0 q 93 6 100 6 q 31 3 69 6 q -13 0 -6 0 q 106 496 48 208 q 194 1025 163 784 "},"Η":{"x_min":0,"x_max":1023.609375,"ha":1024,"o":"m 283 247 q 258 115 268 177 q 248 0 248 54 q 187 4 234 0 q 118 10 140 10 q 64 7 94 10 q 0 0 34 4 q 65 247 1 5 q 158 639 130 488 q 186 932 186 790 q 238 925 208 929 q 305 922 268 922 q 363 924 333 922 q 433 931 394 926 l 383 730 l 344 560 l 541 556 l 713 556 l 741 691 q 762 824 752 746 q 775 931 772 902 q 838 925 809 927 q 897 922 866 922 q 955 925 923 922 q 1023 931 987 927 q 911 483 956 716 q 834 0 865 251 q 772 4 819 0 q 705 9 726 9 q 642 4 684 9 q 586 0 600 0 q 615 102 598 40 q 640 209 631 165 l 690 449 l 501 453 l 323 448 l 283 247 "},"Α":{"x_min":-93,"x_max":786,"ha":856,"o":"m 519 34 q 511 147 519 88 q 496 265 503 206 q 341 275 416 275 q 265 270 306 275 q 201 265 224 266 q 115 111 137 151 q 61 0 94 70 l -8 5 q -44 3 -22 5 q -93 0 -66 1 q 97 292 6 149 q 274 577 187 434 q 491 938 362 721 l 555 933 q 589 935 570 933 q 617 938 608 936 l 665 618 q 701 394 681 514 q 739 188 722 273 q 786 0 756 102 q 701 10 734 7 q 648 13 669 13 q 598 10 621 13 q 519 0 576 7 l 519 34 m 333 363 l 485 363 q 468 529 473 478 q 448 671 462 580 q 350 518 404 603 q 257 365 295 433 l 333 363 "},"ß":{"x_min":-18,"x_max":728,"ha":801,"o":"m 57 317 l 100 541 q 164 780 123 676 q 284 955 205 885 q 490 1026 364 1026 q 655 986 583 1026 q 728 859 728 946 q 633 705 728 781 q 539 573 539 628 q 633 441 539 540 q 728 255 728 342 q 636 63 728 145 q 428 -18 544 -18 q 274 26 344 -18 q 312 111 298 72 q 338 199 327 150 l 358 186 q 395 95 362 134 q 478 57 428 57 q 545 87 519 57 q 572 159 572 118 q 473 318 572 224 q 374 484 374 412 q 494 661 374 563 q 615 845 615 760 q 584 922 615 893 q 505 952 553 952 q 406 903 448 952 q 321 680 363 854 q 250 322 279 505 q 206 0 222 140 l 52 2 l -18 0 q 18 149 0 68 q 57 317 37 230 "},"é":{"x_min":3,"x_max":667,"ha":714,"o":"m 336 -18 q 100 60 197 -18 q 3 274 3 138 q 118 562 3 441 q 400 683 233 683 q 594 618 522 683 q 667 432 667 553 q 662 372 667 402 q 655 325 658 342 l 401 325 l 222 325 q 222 299 222 313 q 222 277 222 285 l 222 260 q 272 124 222 172 q 411 76 323 76 q 607 146 515 76 l 622 127 q 569 32 589 73 q 336 -18 451 -18 m 299 757 l 503 968 q 546 1005 529 994 q 590 1017 562 1017 q 640 996 621 1017 q 659 944 659 975 q 647 908 659 919 q 625 887 632 890 q 600 873 618 883 l 366 757 l 299 757 m 366 394 l 461 399 q 477 513 477 448 q 455 588 477 554 q 397 622 433 622 q 291 553 328 622 q 239 398 254 485 l 366 394 "},"s":{"x_min":-40,"x_max":548.890625,"ha":581,"o":"m 12 231 l 30 228 q 95 102 53 151 q 209 54 137 54 q 277 75 248 54 q 307 134 307 97 q 180 277 307 197 q 54 451 54 358 q 131 617 54 553 q 312 681 208 681 q 448 658 377 681 q 548 593 518 635 q 512 523 529 562 q 480 444 494 484 l 462 451 q 417 565 462 516 q 306 614 373 614 q 240 593 269 614 q 211 538 211 573 q 350 404 211 486 q 489 220 489 322 q 406 48 489 111 q 208 -14 323 -14 q 75 6 140 -14 q -40 66 11 26 q -12 142 -26 98 q 12 231 1 186 "},"B":{"x_min":4,"x_max":793,"ha":832,"o":"m 187 931 q 261 925 244 926 q 301 925 279 925 q 415 930 342 925 q 511 935 488 935 q 709 889 626 935 q 793 736 793 843 q 718 568 793 633 q 535 487 644 502 l 535 479 q 669 425 613 479 q 726 293 726 372 q 617 65 726 130 q 333 0 508 0 q 196 3 281 0 q 94 6 110 6 l 4 0 q 86 311 42 136 q 158 649 130 486 q 187 931 187 812 m 572 717 q 540 812 572 776 q 448 849 508 849 l 402 849 q 381 755 391 808 q 366 682 370 703 l 340 531 q 508 573 445 531 q 572 717 572 615 m 287 89 q 443 152 385 89 q 501 315 501 215 q 455 423 501 397 q 323 449 410 449 l 290 287 l 251 90 l 287 89 "},"…":{"x_min":36,"x_max":988,"ha":1179,"o":"m 134 187 q 206 157 176 187 q 237 85 237 128 q 206 15 237 44 q 134 -14 176 -14 q 65 15 94 -14 q 36 85 36 44 q 65 156 36 126 q 134 187 94 187 m 886 187 q 957 157 927 187 q 988 85 988 128 q 957 15 988 44 q 886 -14 927 -14 q 816 15 845 -14 q 787 85 787 44 q 816 157 787 127 q 886 187 846 187 m 510 187 q 581 157 550 187 q 613 85 613 127 q 582 15 613 44 q 510 -14 552 -14 q 441 15 470 -14 q 412 85 412 44 q 441 156 412 126 q 510 187 470 187 "},"?":{"x_min":116,"x_max":585,"ha":600,"o":"m 231 -17 q 149 14 182 -17 q 116 95 116 46 q 147 180 116 146 q 226 215 178 215 q 312 181 276 215 q 349 98 349 148 q 314 16 349 49 q 231 -17 279 -17 m 439 356 q 422 319 431 341 q 409 276 414 297 l 353 272 q 205 317 268 272 q 142 444 142 363 q 269 627 142 530 q 397 793 397 724 q 369 852 397 829 q 305 875 342 875 q 238 857 276 875 q 189 818 200 840 l 160 818 q 177 872 172 852 q 182 916 182 891 q 340 951 253 951 q 511 893 437 951 q 585 741 585 835 q 542 609 585 646 q 396 504 500 572 q 293 390 293 437 q 313 351 294 366 q 356 336 331 336 q 390 342 374 336 q 424 361 406 348 l 439 356 "},"H":{"x_min":0,"x_max":1025,"ha":1025,"o":"m 280 238 q 261 119 270 191 q 247 0 251 47 q 174 7 205 4 q 122 10 143 10 q 55 5 91 10 q 0 0 19 1 q 84 343 51 204 q 144 629 116 483 q 188 932 172 776 q 253 925 218 929 q 309 922 288 922 q 377 926 340 922 q 436 932 415 930 q 406 824 419 875 q 384 726 394 773 l 347 559 l 538 554 l 711 559 l 740 695 q 763 836 751 751 q 776 932 775 922 q 849 925 818 928 q 901 922 880 922 q 968 926 931 922 q 1025 932 1004 930 q 945 621 984 783 q 877 299 906 459 q 833 0 848 138 q 770 6 804 2 q 718 9 737 9 q 651 6 686 9 q 587 0 616 2 l 638 205 l 691 448 q 594 451 662 448 q 498 454 526 454 q 412 451 470 454 q 325 448 354 448 l 280 238 "},"ν":{"x_min":21,"x_max":642,"ha":638,"o":"m 21 666 q 82 660 59 662 q 130 658 105 658 q 187 661 157 658 q 248 666 218 663 q 274 398 265 481 q 305 189 283 314 l 379 316 q 434 428 416 381 q 453 531 453 476 q 448 578 453 555 q 432 641 443 601 q 523 648 480 641 q 629 672 565 655 q 637 640 633 659 q 642 606 642 620 q 589 446 642 533 q 430 214 536 360 q 296 0 323 67 q 253 3 276 0 q 208 8 229 8 q 165 3 189 8 q 121 0 141 0 q 75 348 98 192 q 21 666 52 504 "},"î":{"x_min":-9,"x_max":459,"ha":393,"o":"m 131 667 q 198 663 156 667 q 246 660 240 660 q 308 663 269 660 q 352 667 346 667 q 272 330 308 505 q 215 0 236 155 q 162 2 197 0 q 110 5 127 5 q 43 2 88 5 q -9 0 0 0 q 49 252 21 129 q 92 452 77 376 q 131 667 108 527 m 402 756 l 280 886 l 102 756 l 33 756 l 239 1003 l 352 1003 l 459 756 l 402 756 "},"c":{"x_min":4,"x_max":662.5,"ha":658,"o":"m 333 -14 q 97 58 191 -14 q 4 269 4 131 q 129 562 4 443 q 429 681 255 681 q 554 667 495 681 q 662 624 612 654 q 627 537 644 589 q 597 440 611 486 l 575 437 l 576 466 q 538 573 576 530 q 436 616 499 616 q 274 508 326 616 q 222 278 222 401 q 263 130 222 189 q 388 71 304 71 q 465 85 427 71 q 538 126 504 99 l 554 110 l 504 12 q 419 -7 461 0 q 333 -14 377 -14 "},"¶":{"x_min":173,"x_max":736.890625,"ha":590,"o":"m 503 968 l 736 968 l 724 910 l 666 910 l 473 4 l 415 4 l 607 910 l 498 909 l 306 3 l 247 4 l 364 558 q 227 602 281 558 q 173 718 173 645 q 264 882 173 797 q 503 968 356 968 "},"β":{"x_min":-100,"x_max":774,"ha":794,"o":"m 52 277 q 134 671 95 494 q 271 937 172 849 q 507 1026 369 1026 q 696 962 619 1026 q 774 787 774 898 q 721 631 774 695 q 580 538 669 567 q 687 448 650 509 q 724 309 724 387 q 630 78 724 170 q 394 -14 536 -14 q 288 1 339 -14 q 201 51 237 16 l 169 -104 l 119 -371 q 9 -362 65 -362 q -100 -371 -45 -362 q -22 -62 -61 -239 q 52 277 16 115 m 388 575 l 419 575 q 550 653 511 575 q 589 834 589 731 q 568 917 589 880 q 507 955 548 955 q 425 918 451 955 q 305 583 368 852 q 242 198 242 314 q 267 106 242 143 q 344 69 293 69 q 477 162 437 69 q 517 363 517 255 q 479 458 517 431 q 369 486 441 486 l 388 575 "},"Μ":{"x_min":-11.109375,"x_max":1213.890625,"ha":1231,"o":"m 222 932 q 265 926 240 929 q 309 923 291 923 q 348 926 326 923 q 391 932 370 929 q 480 610 436 761 q 579 310 525 460 l 866 698 l 1033 932 q 1090 926 1061 929 q 1123 923 1119 923 q 1169 927 1138 923 q 1213 932 1200 932 q 1138 598 1168 740 q 1085 307 1109 457 q 1047 0 1061 157 l 962 8 q 881 6 913 8 q 809 0 848 5 q 859 239 833 93 q 890 413 886 386 l 919 590 q 702 297 808 448 q 497 -11 597 147 l 415 -11 q 344 289 383 141 q 256 597 305 437 q 195 304 226 463 q 140 0 163 144 q 101 4 127 0 q 62 8 74 8 q 26 5 45 8 q -11 0 6 2 q 222 932 116 459 "},"Ό":{"x_min":-44,"x_max":1289,"ha":1325,"o":"m 244 392 q 402 787 244 623 q 785 951 560 951 q 1150 857 1011 951 q 1289 546 1289 763 q 1121 147 1289 308 q 713 -14 953 -14 q 582 -7 636 -14 q 447 34 528 0 q 305 169 366 69 q 244 392 244 270 m -44 756 l 160 970 q 203 1004 181 991 q 247 1018 225 1018 q 294 994 274 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 m 491 360 q 545 156 491 237 q 720 75 599 75 q 967 230 886 75 q 1049 570 1049 385 q 991 777 1049 692 q 817 862 933 862 q 611 757 688 862 q 512 546 534 653 q 491 360 491 438 "},"Ή":{"x_min":-44,"x_max":1302.78125,"ha":1303,"o":"m 558 237 q 538 118 548 190 q 525 0 529 47 q 452 7 483 4 q 400 10 420 10 q 333 5 369 10 q 277 0 297 1 q 361 343 329 203 q 422 629 394 483 q 466 931 450 776 q 531 925 495 929 q 587 922 566 922 q 655 926 618 922 q 713 931 693 930 q 684 824 697 874 q 662 726 672 773 l 625 559 l 816 554 l 988 560 l 1018 696 q 1040 836 1029 751 q 1054 931 1052 922 q 1127 925 1095 927 q 1179 922 1158 922 q 1245 926 1209 922 q 1302 931 1281 930 q 1223 621 1262 783 q 1155 299 1184 459 q 1111 0 1126 138 q 1048 6 1081 2 q 995 9 1015 9 q 929 6 963 9 q 865 0 894 2 l 916 205 l 969 448 q 872 451 940 448 q 776 454 804 454 q 690 449 748 454 q 602 445 631 445 l 558 237 m -44 756 l 159 970 q 202 1004 180 991 q 247 1018 225 1018 q 294 994 273 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 "},"•":{"x_min":208.328125,"x_max":801.390625,"ha":1008,"o":"m 504 796 q 714 709 627 796 q 801 500 801 622 q 714 290 801 377 q 504 204 627 204 q 295 290 381 204 q 208 500 208 377 q 295 709 208 622 q 504 796 381 796 "},"¥":{"x_min":9,"x_max":817.34375,"ha":749,"o":"m 229 264 q 120 262 175 264 q 9 259 64 261 l 25 332 l 243 332 l 263 422 l 43 418 l 57 490 l 249 490 q 181 714 206 640 q 121 886 156 788 q 172 882 139 886 q 224 877 206 877 q 278 882 242 877 q 333 886 314 886 q 422 540 365 714 q 672 886 543 689 q 705 880 688 883 q 739 877 722 877 q 777 880 756 877 q 817 886 797 883 q 637 678 707 761 q 489 490 568 595 q 589 490 522 490 q 690 490 657 490 l 677 418 l 455 422 l 433 329 l 657 332 l 643 259 q 531 261 588 259 q 418 264 473 262 q 392 126 404 194 q 373 0 380 58 q 317 4 354 0 q 268 10 280 10 q 212 4 249 10 q 165 0 175 0 q 197 125 178 44 q 229 264 217 206 "},"(":{"x_min":57,"x_max":505.5625,"ha":446,"o":"m 57 294 q 169 682 57 505 q 472 957 281 859 l 505 901 q 276 611 345 789 q 207 215 207 433 q 226 19 207 111 q 290 -153 245 -72 l 244 -187 q 102 38 148 -75 q 57 294 57 152 "},"U":{"x_min":71,"x_max":1014.0625,"ha":1006,"o":"m 305 923 q 364 926 330 923 q 426 932 398 929 q 361 705 394 822 q 306 473 328 587 q 285 259 285 358 q 334 139 285 183 q 459 96 383 96 q 585 120 528 96 q 692 203 643 144 q 777 391 741 262 q 834 665 814 521 q 873 932 855 810 l 946 926 l 1014 932 q 911 504 946 658 q 868 306 877 349 q 831 195 855 270 q 691 51 807 120 q 427 -17 576 -17 q 171 43 272 -17 q 71 249 71 103 q 95 440 71 308 q 147 718 119 573 q 182 932 175 862 q 247 925 216 927 q 305 923 277 923 "},"γ":{"x_min":-11.109375,"x_max":716.671875,"ha":669,"o":"m 350 62 q 299 -164 319 -65 q 263 -374 279 -262 l 187 -365 q 47 -374 123 -365 q 134 -68 109 -169 q 159 152 159 32 q 133 425 159 287 q 30 563 106 563 q 8 560 16 563 q -11 555 0 558 l -11 636 q 64 671 33 662 q 145 681 95 681 q 288 596 254 681 q 333 422 323 511 q 343 233 343 334 q 579 666 484 438 l 650 663 l 716 666 q 593 479 656 581 q 481 292 530 377 q 350 62 431 208 "},"α":{"x_min":5,"x_max":850.828125,"ha":890,"o":"m 277 -14 q 78 71 152 -14 q 5 284 5 156 q 127 566 5 449 q 414 683 249 683 q 653 538 581 683 q 687 666 674 600 l 769 663 l 850 666 q 788 520 816 590 q 718 340 760 451 q 797 1 744 170 l 634 2 l 564 1 q 557 68 564 34 q 548 122 551 102 q 427 21 495 56 q 277 -14 359 -14 m 425 627 q 257 475 307 627 q 208 173 208 323 q 230 83 208 117 q 307 50 253 50 q 478 169 419 62 q 537 396 537 276 q 529 502 537 456 q 507 576 521 549 q 467 618 493 603 q 425 627 448 627 "},"F":{"x_min":0,"x_max":734.71875,"ha":674,"o":"m 186 932 q 313 928 229 932 q 441 924 398 924 q 588 928 491 924 q 734 932 686 932 q 713 873 722 904 q 705 813 705 842 q 600 825 652 820 q 500 831 548 831 l 402 831 q 388 789 394 812 q 370 705 383 766 l 340 548 l 466 547 q 640 558 551 547 q 620 433 620 499 q 529 441 581 437 q 438 446 476 446 q 390 446 409 446 q 323 440 370 446 l 284 265 q 250 0 263 142 q 184 6 219 2 q 126 10 148 10 q 58 5 95 10 q 0 0 20 1 q 113 489 66 262 q 186 932 161 716 "},"­":{"x_min":-36.5,"x_max":667.671875,"ha":683,"o":"m -12 404 l 667 404 l 646 261 l -36 261 l -12 404 "},":":{"x_min":51,"x_max":368,"ha":458,"o":"m 168 217 q 250 183 217 217 q 284 101 284 150 q 248 20 284 54 q 167 -14 213 -14 q 84 18 118 -14 q 51 100 51 51 q 85 182 51 147 q 168 217 120 217 m 253 681 q 334 648 301 681 q 368 568 368 616 q 333 484 368 518 q 251 450 299 450 q 170 483 203 450 q 137 566 137 516 q 170 647 137 614 q 253 681 203 681 "},"Χ":{"x_min":-90,"x_max":868.34375,"ha":803,"o":"m 195 313 l 311 445 q 223 684 272 564 q 119 932 175 805 q 186 926 150 929 q 250 924 222 924 q 313 926 276 924 q 379 931 349 929 q 423 785 398 862 q 477 630 448 708 q 695 931 590 776 q 782 924 739 928 q 825 928 796 924 q 868 931 854 931 q 739 795 808 870 q 613 654 670 720 l 511 529 q 587 298 563 363 q 625 191 611 233 l 694 0 q 626 5 666 2 q 558 8 586 8 q 498 5 531 8 q 433 0 465 2 q 395 165 416 80 q 349 331 374 250 q 213 170 276 248 q 84 0 151 93 q 39 6 61 4 q -2 8 16 8 q -45 5 -22 8 q -90 0 -69 2 q 52 153 1 98 q 195 313 102 208 "},"*":{"x_min":137,"x_max":652,"ha":683,"o":"m 355 656 q 247 603 281 619 q 173 563 213 586 q 164 625 173 596 q 137 688 155 654 q 340 711 228 688 q 256 765 300 740 q 163 813 211 791 q 249 913 215 862 q 307 831 278 869 q 376 754 337 794 q 379 870 376 797 q 383 958 383 944 q 444 937 415 944 q 511 930 474 930 q 467 838 487 886 q 433 738 446 790 q 613 836 516 776 q 652 710 619 769 q 558 704 603 710 q 451 686 513 698 q 538 628 499 651 q 626 583 577 605 q 578 537 596 558 q 538 484 559 515 q 490 552 512 525 q 413 644 469 579 q 405 547 406 590 q 404 435 404 505 q 338 456 372 448 q 276 463 305 463 q 355 656 323 557 "},"°":{"x_min":264,"x_max":603,"ha":683,"o":"m 454 1068 q 559 1031 516 1068 q 603 933 603 995 q 543 798 603 855 q 405 742 483 742 q 305 783 347 742 q 264 882 264 825 q 319 1013 264 959 q 454 1068 375 1068 m 415 786 q 497 831 466 786 q 528 930 528 876 q 508 997 528 970 q 450 1025 489 1025 q 368 977 397 1025 q 340 872 340 929 q 367 803 348 820 q 415 786 385 786 "},"V":{"x_min":54,"x_max":930.390625,"ha":813,"o":"m 399 298 q 608 618 512 456 q 772 932 705 780 l 844 925 q 892 928 860 925 q 930 932 923 932 q 634 472 776 702 q 358 0 492 242 q 318 8 334 5 q 285 11 302 11 q 245 6 267 11 q 208 0 223 1 q 143 474 178 255 q 54 931 108 694 l 187 925 l 315 932 q 326 733 315 832 q 355 533 337 634 q 399 298 373 431 "},"Ξ":{"x_min":-50,"x_max":872.21875,"ha":844,"o":"m 440 549 q 594 553 497 549 q 719 558 691 558 q 695 473 704 515 q 679 375 686 431 q 534 380 630 375 q 404 385 438 385 q 258 380 355 385 q 126 375 161 375 q 150 460 140 413 q 168 558 161 506 q 293 550 238 551 q 440 549 348 549 m 470 755 q 283 749 409 755 q 112 744 156 744 q 136 841 125 787 q 152 932 148 894 q 331 928 212 932 q 512 924 451 924 q 691 928 572 924 q 872 932 811 932 q 848 840 859 889 q 831 744 837 791 q 643 749 769 744 q 470 755 516 755 m 368 183 q 577 187 444 183 q 747 192 711 192 q 720 92 731 138 q 705 0 709 45 q 516 3 643 0 q 327 8 390 8 q 138 3 265 8 q -50 0 12 0 q -25 99 -37 48 q -8 192 -13 151 q 188 187 56 192 q 368 183 320 183 "}," ":{"x_min":0,"x_max":0,"ha":375},"Ϋ":{"x_min":41,"x_max":813.21875,"ha":706,"o":"m 131 80 l 168 259 l 197 391 q 128 663 166 531 q 41 932 91 794 q 160 924 107 924 q 296 932 227 924 q 389 540 331 725 q 654 932 541 738 q 688 927 661 930 q 734 924 714 924 q 813 932 775 924 q 618 676 717 811 q 425 405 518 541 l 393 267 q 352 0 364 130 q 295 4 339 0 q 234 10 252 10 q 170 6 202 10 q 109 0 139 2 q 124 49 122 44 q 131 80 125 53 m 373 1253 q 438 1225 410 1253 q 466 1159 466 1197 q 439 1092 466 1120 q 373 1065 413 1065 q 303 1091 331 1065 q 276 1159 276 1117 q 304 1225 276 1198 q 373 1253 332 1253 m 625 1253 q 691 1225 663 1253 q 719 1159 719 1197 q 693 1092 719 1119 q 627 1065 667 1065 q 558 1091 586 1065 q 531 1159 531 1117 q 558 1225 531 1197 q 625 1253 586 1253 "},"0":{"x_min":23,"x_max":727,"ha":749,"o":"m 452 908 q 654 827 582 908 q 727 615 727 746 q 618 183 727 384 q 296 -18 509 -18 q 88 71 154 -18 q 23 306 23 161 q 27 384 23 340 q 59 549 32 429 q 188 789 85 670 q 452 908 292 908 m 212 181 q 231 88 212 127 q 299 50 250 50 q 423 179 371 50 q 504 479 475 308 q 534 726 534 651 q 512 804 534 772 q 447 836 490 836 q 334 748 366 836 q 270 522 303 661 q 225 316 238 383 q 212 181 212 249 "},"”":{"x_min":72.21875,"x_max":733.328125,"ha":685,"o":"m 72 518 l 227 849 q 275 928 251 906 q 327 951 298 951 q 395 931 365 951 q 425 877 425 912 q 406 820 425 851 q 365 765 388 790 l 101 494 l 72 518 m 381 518 l 537 849 q 577 921 554 892 q 636 951 600 951 q 702 930 672 951 q 733 877 733 910 q 714 819 733 851 q 675 765 695 787 l 411 494 l 381 518 "},"@":{"x_min":61,"x_max":1307,"ha":1367,"o":"m 581 72 q 418 131 475 72 q 362 300 362 191 q 454 556 362 439 q 684 674 546 674 q 772 651 734 674 q 844 586 810 629 l 879 654 l 1000 654 l 898 254 l 894 229 q 913 193 894 205 q 958 181 931 181 q 1119 290 1056 181 q 1183 505 1183 400 q 1060 773 1183 669 q 771 878 937 878 q 354 736 526 878 q 183 352 183 595 q 327 19 183 138 q 691 -100 471 -100 q 899 -65 790 -100 q 1092 25 1008 -30 l 1145 -49 q 691 -204 947 -204 q 245 -55 430 -204 q 61 348 61 93 q 262 805 61 622 q 740 988 463 988 q 1136 857 965 988 q 1307 507 1307 727 q 1196 206 1307 341 q 922 72 1086 72 l 895 72 q 820 90 848 72 q 778 180 792 109 q 692 99 740 126 q 581 72 645 72 m 695 578 q 554 486 602 578 q 506 294 506 395 q 533 207 506 245 q 607 169 561 169 q 713 212 670 169 q 774 322 757 256 l 811 466 q 775 546 806 515 q 695 578 744 578 "},"Ί":{"x_min":-44,"x_max":729.171875,"ha":736,"o":"m 538 0 q 474 4 526 0 q 400 9 422 9 q 333 5 366 9 q 286 0 300 1 q 370 324 330 162 q 437 631 411 487 q 476 932 463 776 q 547 925 516 927 q 601 922 579 922 q 670 926 631 922 q 729 932 709 930 q 613 485 665 744 q 538 0 562 226 m -44 756 l 159 970 q 202 1004 180 991 q 247 1018 225 1018 q 294 994 273 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 "},"ö":{"x_min":5,"x_max":724,"ha":781,"o":"m 390 688 q 630 615 536 688 q 724 398 724 542 q 608 108 724 234 q 333 -18 493 -18 q 93 52 181 -18 q 5 272 5 122 q 39 445 5 354 q 172 612 73 536 q 390 688 272 688 m 347 974 q 413 946 385 974 q 441 878 441 918 q 414 811 441 837 q 347 785 388 785 q 279 811 307 785 q 252 878 252 837 q 279 946 252 918 q 347 974 307 974 m 601 974 q 667 946 638 974 q 697 878 697 918 q 670 811 697 837 q 602 785 644 785 q 535 811 563 785 q 508 878 508 837 q 535 945 508 917 q 601 974 562 974 m 213 194 q 235 94 213 140 q 306 49 257 49 q 462 201 411 49 q 513 487 513 353 q 490 586 513 544 q 417 628 468 628 q 302 551 343 628 q 240 378 261 475 q 220 285 228 336 q 213 194 213 235 "},"i":{"x_min":-9,"x_max":387,"ha":393,"o":"m 129 666 q 195 663 153 666 q 245 660 236 660 q 305 663 267 660 q 352 666 343 666 q 272 333 305 490 q 213 0 239 176 q 155 2 196 0 q 110 5 114 5 q 41 2 89 5 q -9 0 -6 0 q 70 351 32 176 q 129 666 107 526 m 277 1018 q 353 986 320 1018 q 387 909 387 954 q 355 834 387 865 q 278 804 323 804 q 203 835 234 804 q 172 911 172 866 q 202 986 172 954 q 277 1018 233 1018 "},"Β":{"x_min":4,"x_max":793,"ha":832,"o":"m 187 931 q 261 925 244 926 q 301 925 279 925 q 415 930 342 925 q 511 935 488 935 q 709 889 626 935 q 793 736 793 843 q 718 568 793 633 q 535 487 644 502 l 535 479 q 669 425 613 479 q 726 293 726 372 q 617 65 726 130 q 333 0 508 0 q 196 3 281 0 q 94 6 110 6 l 4 0 q 86 311 42 136 q 158 649 130 486 q 187 931 187 812 m 572 717 q 540 812 572 776 q 448 849 508 849 l 402 849 q 381 755 391 808 q 366 682 370 703 l 340 531 q 508 573 445 531 q 572 717 572 615 m 287 89 q 443 152 385 89 q 501 315 501 215 q 455 423 501 397 q 323 449 410 449 l 290 287 l 251 90 l 287 89 "},"≤":{"x_min":169,"x_max":962.28125,"ha":1136,"o":"m 961 690 l 406 512 l 960 336 l 960 199 l 169 457 l 169 571 l 961 827 l 961 690 m 962 132 l 962 0 l 169 0 l 169 132 l 962 132 "},"υ":{"x_min":33,"x_max":743,"ha":810,"o":"m 743 490 q 612 137 743 289 q 283 -14 481 -14 q 108 30 183 -14 q 33 168 33 75 q 75 448 33 248 q 118 670 117 648 q 169 665 139 667 q 225 663 199 663 q 301 663 263 663 q 345 670 331 668 q 270 387 306 539 q 234 153 234 236 q 247 85 234 112 q 299 51 261 57 q 488 161 427 51 q 550 412 550 272 q 537 538 550 478 q 496 657 524 597 q 582 658 535 657 q 706 670 629 659 q 733 585 724 632 q 743 490 743 538 "},"]":{"x_min":-100,"x_max":441.671875,"ha":446,"o":"m 219 -160 l 61 -160 l -100 -160 q -83 -82 -87 -121 q -32 -86 -61 -85 q 22 -88 -4 -88 l 70 -88 q 173 367 122 118 q 267 860 223 616 l 208 863 q 156 860 179 863 q 120 857 133 858 l 135 932 l 280 926 l 441 932 q 318 364 375 639 q 219 -160 262 89 "},"m":{"x_min":-14,"x_max":1130,"ha":1207,"o":"m 126 666 q 176 663 142 666 q 226 661 209 661 q 290 663 245 661 q 336 666 334 666 q 321 620 324 633 q 312 580 317 608 q 421 653 360 625 q 545 681 481 681 q 660 653 613 681 q 717 562 708 625 q 812 647 757 613 q 924 681 866 681 q 1071 642 1013 681 q 1130 519 1130 604 q 1085 240 1130 421 q 1032 0 1041 60 q 967 3 1006 0 q 921 6 928 6 q 858 3 898 6 q 809 0 817 0 q 900 347 881 262 q 919 491 919 433 l 919 517 q 848 572 905 572 q 726 488 763 572 q 665 278 689 405 l 617 0 q 566 2 600 0 q 515 5 533 5 q 449 2 494 5 q 401 0 404 0 q 481 289 455 184 q 508 492 508 394 q 494 549 508 526 q 448 572 480 572 q 287 444 319 572 q 209 0 255 317 q 144 3 183 0 q 98 6 105 6 q 34 3 74 6 q -14 0 -5 0 q 58 317 26 162 q 126 666 90 472 "},"χ":{"x_min":-151,"x_max":736.5,"ha":692,"o":"m 572 666 l 632 663 q 692 666 650 663 q 736 669 735 669 q 628 529 683 601 q 521 387 574 458 l 393 212 l 454 4 l 494 -133 q 541 -263 514 -193 q 582 -370 568 -333 q 455 -365 526 -365 q 332 -373 394 -365 q 324 -260 332 -315 q 301 -137 316 -205 l 258 18 l 128 -162 q 8 -373 64 -250 q -60 -365 -23 -365 q -151 -373 -105 -365 l -53 -254 l 55 -102 l 226 122 l 151 367 q 98 516 122 467 q 21 566 75 566 q -5 561 3 562 l -5 636 q 86 674 53 665 q 153 683 120 683 q 277 589 243 683 q 320 463 310 496 l 360 320 l 472 483 q 572 666 534 573 "},"8":{"x_min":28,"x_max":735,"ha":749,"o":"m 273 506 q 185 570 218 526 q 153 673 153 615 q 232 844 153 780 q 422 908 312 908 q 641 858 547 908 q 735 695 735 809 q 677 555 735 612 q 534 483 619 498 l 533 469 q 636 398 598 449 q 674 278 674 346 q 574 61 674 140 q 332 -18 475 -18 q 118 46 208 -18 q 28 229 28 111 q 96 403 28 334 q 273 494 165 472 l 273 506 m 239 183 q 256 95 239 132 q 319 53 273 58 q 436 136 405 53 q 467 324 467 219 q 446 411 467 375 q 379 448 426 448 q 294 400 321 448 q 254 280 268 353 q 239 183 239 231 m 346 614 q 367 551 350 576 q 422 526 384 526 q 514 598 486 526 q 542 746 542 670 q 522 812 542 785 q 465 840 503 840 q 401 799 430 840 q 359 712 372 758 q 346 614 346 666 "},"ί":{"x_min":-9,"x_max":546.546875,"ha":393,"o":"m 129 666 q 245 660 189 660 q 305 663 267 660 q 352 666 343 666 q 272 333 304 490 q 213 0 239 176 l 110 5 q 41 2 89 5 q -9 0 -6 0 q 70 351 32 176 q 129 666 107 526 m 187 757 l 391 970 q 439 1008 418 998 q 478 1018 460 1018 q 525 994 504 1018 q 546 945 546 970 q 530 906 546 922 q 488 873 514 890 l 252 757 l 187 757 "},"Ζ":{"x_min":-44.4375,"x_max":900,"ha":857,"o":"m -40 60 q 177 333 84 216 q 349 554 270 451 q 552 823 427 656 l 438 825 q 277 818 388 825 q 127 811 166 811 q 144 864 138 837 q 155 932 150 890 q 348 928 215 932 q 543 924 481 924 q 720 928 601 924 q 900 932 840 932 l 894 882 q 565 486 718 675 q 276 111 412 298 q 545 119 355 111 q 801 128 734 128 q 779 0 779 67 q 572 3 709 0 q 365 8 434 8 q 161 3 297 8 q -44 0 25 0 l -40 60 "},"R":{"x_min":0,"x_max":840,"ha":847,"o":"m 188 932 q 251 928 209 932 q 313 925 293 925 q 442 928 365 925 q 530 932 519 932 q 750 881 660 932 q 840 709 840 831 q 767 530 840 591 q 567 456 694 468 q 658 233 610 345 q 763 0 706 121 q 683 7 723 3 q 616 11 642 11 q 545 6 580 11 q 490 0 511 2 q 422 233 454 129 q 353 430 390 337 l 317 430 l 283 266 q 264 140 276 228 q 247 0 253 52 q 171 7 204 4 q 119 10 139 10 q 54 5 90 10 q 0 0 19 1 q 85 322 40 151 q 159 648 130 492 q 188 932 188 804 m 370 508 q 544 557 474 508 q 615 707 615 606 q 573 806 615 771 q 466 842 531 842 l 405 842 l 377 726 l 329 509 l 370 508 "},"×":{"x_min":183.875,"x_max":969.125,"ha":1136,"o":"m 575 500 l 877 800 l 969 706 l 669 406 l 969 106 l 877 13 l 575 313 l 275 13 l 183 106 l 483 406 l 183 706 l 275 800 l 575 500 "},"o":{"x_min":5,"x_max":726,"ha":781,"o":"m 391 688 q 632 615 538 688 q 726 397 726 542 q 610 107 726 233 q 334 -18 494 -18 q 95 53 185 -18 q 5 272 5 125 q 11 350 5 314 q 45 460 17 386 q 173 611 73 535 q 391 688 273 688 m 212 196 q 234 94 212 139 q 306 49 257 49 q 462 201 411 49 q 513 489 513 353 q 490 585 513 543 q 417 627 468 627 q 293 535 329 627 q 241 381 257 444 q 218 280 225 318 q 212 196 212 242 "},"5":{"x_min":4,"x_max":733.15625,"ha":749,"o":"m 95 251 l 122 245 q 158 109 122 167 q 270 51 195 51 q 393 130 356 51 q 430 306 430 209 q 396 428 430 379 q 292 477 363 477 q 226 461 257 477 q 160 418 195 445 q 133 438 151 427 q 106 454 116 448 q 163 669 138 562 q 208 889 188 776 l 556 889 l 733 889 q 700 793 710 834 q 690 708 690 753 l 480 711 l 270 707 l 222 523 q 291 548 245 539 q 374 558 337 558 q 572 499 489 558 q 655 331 655 440 q 550 76 655 170 q 280 -18 445 -18 q 125 2 201 -18 q 4 67 49 22 q 48 153 29 115 q 95 251 67 191 "},"7":{"x_min":33.71875,"x_max":808.71875,"ha":749,"o":"m 33 8 q 230 247 130 124 q 433 502 329 370 l 600 718 l 129 707 q 150 797 142 750 q 158 889 158 844 l 483 888 l 808 888 l 807 843 q 508 454 647 662 q 230 0 368 247 q 180 3 214 0 q 130 8 147 8 q 86 5 111 8 q 37 0 61 2 l 33 8 "},"K":{"x_min":0,"x_max":943.0625,"ha":813,"o":"m 376 705 l 336 504 l 519 670 q 630 776 581 723 q 768 932 679 829 l 850 925 q 900 927 880 925 q 943 932 919 929 l 940 918 q 776 770 866 852 q 640 646 686 688 q 506 516 594 604 q 663 198 581 358 l 768 0 q 704 4 747 0 q 637 8 661 8 q 570 4 616 8 q 501 0 524 0 q 406 227 443 143 q 316 406 369 312 l 286 268 q 245 0 259 127 q 172 7 204 4 q 119 10 140 10 q 55 5 91 10 q 0 0 19 1 q 84 315 40 150 q 157 643 127 481 q 187 931 187 805 q 250 926 204 930 q 311 922 295 922 q 381 926 341 922 q 434 932 420 930 q 402 830 413 877 q 376 705 390 783 "},",":{"x_min":-83.71875,"x_max":273.21875,"ha":375,"o":"m 67 123 q 119 209 92 185 q 178 233 145 233 q 241 212 210 233 q 273 162 273 191 q 255 97 273 131 q 212 34 238 63 l -53 -253 l -83 -227 l 67 123 "},"d":{"x_min":21,"x_max":875,"ha":825,"o":"m 472 91 q 255 -17 391 -17 q 82 57 144 -17 q 21 245 21 131 q 111 544 21 407 q 355 681 201 681 q 558 568 487 681 l 605 768 q 655 1027 634 897 q 758 1019 713 1019 q 875 1027 815 1019 q 783 687 827 866 q 706 334 738 508 q 656 0 673 159 q 600 3 634 0 q 558 6 565 6 q 500 3 536 6 q 458 0 465 0 l 472 91 m 235 192 q 262 109 235 142 q 337 76 289 76 q 481 204 437 76 q 526 457 526 333 q 501 542 526 507 q 426 578 476 578 q 309 500 343 578 q 260 369 275 422 q 240 278 246 316 q 235 192 235 240 "},"¨":{"x_min":79.5625,"x_max":740.671875,"ha":685,"o":"m 433 933 l 278 600 q 234 522 253 546 q 176 499 215 499 q 111 521 143 499 q 79 572 79 543 q 94 625 79 600 q 139 686 110 650 l 404 957 l 433 933 m 740 933 l 586 600 q 543 523 562 548 q 486 499 524 499 q 420 521 453 499 q 387 572 387 543 q 405 628 387 598 q 447 686 422 658 l 712 957 l 740 933 "},"E":{"x_min":-3,"x_max":733.109375,"ha":700,"o":"m 184 932 q 312 928 227 932 q 440 924 397 924 q 587 928 490 924 q 733 932 684 932 q 710 872 717 900 q 702 813 702 845 q 599 825 651 820 q 498 831 547 831 l 399 831 q 382 770 391 804 q 366 705 373 735 l 338 548 l 458 544 q 561 547 497 544 q 638 551 626 551 q 624 494 630 533 q 619 432 619 455 q 529 436 585 432 q 456 441 473 441 l 317 441 l 279 265 q 254 109 262 184 q 443 117 316 109 q 591 126 570 126 q 574 64 583 101 q 562 0 566 27 q 415 4 516 0 q 267 8 313 8 q 133 4 223 8 q -3 0 42 0 q 108 458 60 216 q 184 932 156 700 "},"Y":{"x_min":40.28125,"x_max":813.890625,"ha":706,"o":"m 131 80 l 170 259 l 198 391 q 127 667 165 536 q 40 932 90 798 q 102 926 70 929 q 162 924 134 924 q 227 926 191 924 q 297 931 263 929 q 390 540 330 729 q 527 727 462 630 q 655 931 591 823 q 702 926 675 929 q 736 924 729 924 q 772 926 752 924 q 813 931 793 929 q 426 405 606 672 l 394 267 q 363 108 372 160 q 354 0 354 56 q 289 6 323 2 q 234 10 255 10 q 168 5 205 10 q 111 0 130 1 l 131 80 "},"\"":{"x_min":53,"x_max":399,"ha":453,"o":"m 181 958 l 181 586 l 53 586 l 53 958 l 181 958 m 399 958 l 399 586 l 271 586 l 271 958 l 399 958 "},"ê":{"x_min":3,"x_max":667,"ha":714,"o":"m 336 -18 q 100 60 197 -18 q 3 275 3 139 q 118 563 3 442 q 400 684 233 684 q 594 619 522 684 q 667 432 667 554 q 662 372 667 402 q 655 325 658 342 l 401 325 l 222 325 q 222 300 222 313 q 222 278 222 286 l 222 261 q 272 126 222 174 q 411 79 323 79 q 607 146 515 79 l 622 127 q 569 32 589 73 q 336 -18 451 -18 m 574 756 l 451 886 l 274 756 l 203 756 l 411 1003 l 525 1003 l 631 756 l 574 756 m 365 394 l 461 399 q 477 514 477 448 q 455 588 477 554 q 397 622 433 622 q 291 554 328 622 q 239 398 254 485 l 365 394 "},"δ":{"x_min":5,"x_max":755.28125,"ha":763,"o":"m 168 823 q 259 976 168 927 q 464 1026 350 1026 q 611 1005 542 1026 q 755 945 680 985 q 714 870 724 891 q 690 812 703 849 l 671 812 q 609 904 654 869 q 502 940 563 940 q 408 906 448 940 q 368 820 368 873 q 451 677 368 738 q 614 559 534 616 q 702 359 702 479 q 588 94 702 206 q 324 -18 474 -18 q 93 43 182 -18 q 5 241 5 105 q 97 487 5 386 q 336 620 189 588 q 214 702 260 653 q 168 823 168 751 m 212 178 q 232 86 212 124 q 303 49 253 49 q 443 177 397 49 q 489 424 489 305 q 464 518 489 475 q 392 561 440 561 q 291 495 325 561 q 234 339 257 429 q 212 178 212 250 "},"έ":{"x_min":-5,"x_max":690.84375,"ha":657,"o":"m 545 483 l 531 483 q 485 579 521 546 q 387 612 450 612 q 307 582 340 612 q 275 503 275 552 q 309 425 275 453 q 438 397 344 397 q 426 365 429 378 q 418 315 424 351 q 383 320 401 319 q 345 322 365 322 q 243 287 285 322 q 201 192 201 252 q 244 92 201 130 q 353 54 288 54 q 470 86 418 54 q 556 178 522 119 l 570 172 q 565 143 567 157 q 564 113 564 130 q 567 74 564 98 q 571 44 571 49 q 450 0 518 13 q 310 -14 382 -14 q 90 30 185 -14 q -5 184 -5 74 q 49 307 -5 265 q 188 359 103 349 q 117 414 143 381 q 92 494 92 446 q 173 635 92 588 q 358 683 255 683 q 478 662 419 683 q 590 605 536 642 q 564 542 571 558 q 545 483 557 526 m 329 757 l 534 970 q 577 1004 555 991 q 622 1018 598 1018 q 669 994 649 1018 q 690 945 690 970 q 674 906 690 922 q 631 873 658 890 l 396 757 l 329 757 "},"ω":{"x_min":5,"x_max":1055,"ha":1118,"o":"m 248 -14 q 70 50 136 -14 q 5 227 5 115 q 74 465 5 348 q 250 667 143 582 q 300 664 266 667 q 353 661 335 661 q 416 664 393 661 q 449 667 438 667 q 273 435 338 561 q 209 172 209 310 q 227 87 209 123 q 288 51 245 51 q 409 186 377 51 q 460 512 441 322 l 571 506 l 684 512 q 633 336 653 416 q 600 168 613 256 l 599 132 l 600 96 q 649 51 610 55 q 794 168 753 51 q 836 419 836 286 q 817 542 836 485 q 760 666 798 599 q 812 661 802 662 q 852 661 823 661 q 905 663 870 661 q 957 667 939 666 q 1029 550 1003 610 q 1055 425 1055 490 q 945 121 1055 257 q 673 -14 836 -14 q 555 13 606 -14 q 482 101 503 41 q 380 16 443 46 q 248 -14 317 -14 "},"´":{"x_min":72.21875,"x_max":423.609375,"ha":374,"o":"m 72 516 l 226 848 q 273 929 250 907 q 326 951 297 951 q 393 930 362 951 q 423 877 423 910 q 406 821 423 851 q 365 764 388 791 l 100 492 l 72 516 "},"±":{"x_min":169,"x_max":968,"ha":1136,"o":"m 636 815 l 636 597 l 968 597 l 968 465 l 636 465 l 636 247 l 501 247 l 501 465 l 169 465 l 169 597 l 501 597 l 501 815 l 636 815 m 968 132 l 968 0 l 169 0 l 169 132 l 968 132 "},"|":{"x_min":272,"x_max":412,"ha":683,"o":"m 412 956 l 412 448 l 272 448 l 272 956 l 412 956 m 412 272 l 412 -233 l 272 -233 l 272 272 l 412 272 "},"ϋ":{"x_min":33,"x_max":743,"ha":810,"o":"m 743 489 q 612 137 743 288 q 283 -14 481 -14 q 108 30 183 -14 q 33 167 33 74 q 75 447 33 248 q 118 669 117 646 q 169 665 139 666 q 225 663 199 663 q 301 663 263 663 q 345 669 331 667 q 270 387 306 538 q 234 153 234 235 q 248 85 234 112 q 299 51 262 57 q 488 161 427 51 q 550 412 550 272 q 537 537 550 477 q 496 657 524 597 q 582 657 535 657 q 706 669 629 658 q 733 584 724 631 q 743 489 743 537 m 324 974 q 392 946 366 974 q 418 879 418 919 q 391 812 418 838 q 324 786 365 786 q 256 812 284 786 q 229 880 229 838 q 256 947 229 921 q 324 974 284 974 m 578 974 q 645 946 617 974 q 673 877 673 918 q 646 811 673 836 q 579 786 620 786 q 511 812 539 786 q 484 880 484 838 q 510 947 484 921 q 578 974 536 974 "},"§":{"x_min":25,"x_max":691.671875,"ha":751,"o":"m 74 56 l 99 55 q 175 -69 125 -20 q 299 -118 225 -118 q 382 -93 346 -118 q 419 -23 419 -69 q 330 98 419 40 q 155 211 241 155 q 61 379 61 286 q 101 500 61 446 q 205 587 141 554 q 172 647 184 615 q 161 712 161 679 q 247 884 161 819 q 445 949 334 949 q 572 930 512 949 q 691 872 633 911 q 636 730 655 808 l 612 730 q 550 833 598 793 q 439 874 503 874 q 355 846 395 874 q 315 778 315 819 q 406 664 315 721 q 584 555 497 608 q 681 384 681 480 q 644 270 681 316 q 540 172 608 223 q 572 111 560 141 q 584 45 584 80 q 493 -132 584 -69 q 280 -196 402 -196 q 148 -174 211 -196 q 25 -111 86 -152 q 57 -6 50 -30 q 74 56 65 17 m 541 287 q 394 452 541 361 q 242 549 248 544 q 204 499 209 509 q 199 468 199 488 q 345 316 199 409 q 496 218 491 223 q 541 287 536 244 "},"b":{"x_min":-22,"x_max":754,"ha":825,"o":"m 191 1027 q 305 1019 251 1019 q 418 1027 358 1019 q 395 948 405 988 q 365 824 384 908 l 314 596 q 403 663 355 638 q 508 688 451 688 q 687 611 620 688 q 754 418 754 535 q 648 115 754 247 q 376 -17 543 -17 q 157 86 239 -17 q 98 51 122 70 q 21 -13 73 33 l -22 0 q 105 524 53 281 q 191 1027 157 767 m 242 192 q 269 101 242 141 q 345 62 297 62 q 493 193 446 62 q 541 448 541 324 q 514 550 541 505 q 431 596 487 596 q 326 532 359 596 q 266 363 293 469 q 248 271 255 308 q 242 192 242 235 "},"q":{"x_min":15,"x_max":799.71875,"ha":831,"o":"m 421 -90 l 460 76 q 369 6 426 30 q 251 -18 313 -18 q 78 57 142 -18 q 15 241 15 132 q 107 541 15 404 q 353 678 199 678 q 473 650 417 678 q 567 572 528 622 q 576 618 570 583 q 583 666 581 652 q 648 659 619 662 q 695 656 677 656 q 751 661 720 656 q 799 666 783 665 q 673 150 742 483 q 580 -373 603 -182 q 522 -366 551 -369 q 465 -363 494 -363 q 411 -366 440 -363 q 348 -373 383 -368 q 384 -241 363 -322 q 421 -90 405 -161 m 236 201 q 263 122 236 155 q 338 89 291 89 q 487 213 447 89 q 528 474 528 338 q 501 557 528 522 q 426 593 473 593 q 329 545 367 593 q 267 409 290 498 q 240 282 245 320 q 236 201 236 244 "},"Ω":{"x_min":-68,"x_max":1107.015625,"ha":1147,"o":"m 47 417 q 216 803 47 655 q 629 951 385 951 q 966 849 840 951 q 1093 542 1093 748 q 1031 299 1093 413 q 865 110 970 184 q 972 115 919 110 q 1107 130 1026 120 q 1093 0 1093 69 l 856 4 l 594 0 l 612 91 q 796 274 743 141 q 850 573 850 407 q 793 778 850 695 q 620 862 737 862 q 371 704 447 862 q 296 348 296 546 q 329 186 296 256 q 440 91 362 116 l 420 0 q 248 1 335 0 q 74 4 160 2 l -68 0 q -48 128 -48 66 q 66 118 2 122 q 183 114 130 114 q 81 253 115 180 q 47 417 47 326 "},"ύ":{"x_min":33,"x_max":746.890625,"ha":810,"o":"m 743 490 q 612 137 743 288 q 283 -14 481 -14 q 108 30 183 -14 q 33 167 33 74 q 75 447 33 248 q 118 669 117 647 q 169 665 139 666 q 225 663 199 663 q 301 663 263 663 q 345 669 331 668 q 270 387 306 538 q 234 153 234 235 q 247 85 234 112 q 299 51 261 57 q 488 161 427 51 q 550 412 550 271 q 537 537 550 477 q 496 656 524 597 q 582 657 535 656 q 706 669 629 658 q 733 584 724 631 q 743 490 743 537 m 387 756 l 591 970 q 634 1004 612 991 q 678 1018 656 1018 q 726 994 705 1018 q 746 945 746 970 q 730 906 746 922 q 688 873 714 890 l 454 756 l 387 756 "},"Ö":{"x_min":33,"x_max":1080,"ha":1115,"o":"m 33 394 q 191 787 33 623 q 576 951 349 951 q 941 857 802 951 q 1080 546 1080 763 q 910 147 1080 308 q 502 -14 741 -14 q 374 -5 432 -14 q 236 36 316 2 q 94 172 156 70 q 33 394 33 273 m 576 1253 q 643 1225 615 1253 q 672 1159 672 1198 q 644 1093 672 1122 q 577 1065 617 1065 q 511 1092 540 1065 q 482 1159 482 1120 q 509 1225 482 1197 q 576 1253 537 1253 m 833 1253 q 898 1225 870 1253 q 926 1159 926 1197 q 898 1094 926 1123 q 833 1065 870 1065 q 765 1092 794 1065 q 736 1159 736 1120 q 764 1225 736 1198 q 833 1253 792 1253 m 283 362 q 336 156 283 237 q 509 76 389 76 q 756 231 675 76 q 838 569 838 387 q 780 776 838 691 q 606 861 722 861 q 400 757 477 861 q 303 545 324 653 q 283 362 283 437 "},"z":{"x_min":-36.5,"x_max":669.0625,"ha":669,"o":"m 266 10 q 122 5 228 10 q -36 0 16 0 l -36 69 q 131 260 67 185 q 246 397 195 335 q 382 575 296 459 q 94 559 238 575 l 110 667 q 249 662 156 667 q 389 658 342 658 q 528 662 435 658 q 669 667 621 667 l 669 589 q 449 350 557 475 q 237 93 341 226 l 606 114 q 594 52 598 75 q 591 0 591 30 q 437 5 555 0 q 266 10 320 10 "},"™":{"x_min":137,"x_max":965,"ha":1138,"o":"m 460 975 l 460 900 l 349 900 l 349 611 l 248 611 l 248 900 l 137 900 l 137 975 l 460 975 m 666 975 l 751 751 l 833 974 l 965 975 l 965 611 l 872 611 l 872 883 l 772 611 l 732 611 l 625 883 l 625 611 l 536 611 l 536 975 l 666 975 "},"ή":{"x_min":-14,"x_max":790.171875,"ha":810,"o":"m 126 666 q 176 663 142 666 q 226 661 209 661 q 290 663 245 661 q 336 666 334 666 q 321 620 324 633 q 312 580 317 608 q 423 653 362 626 q 546 681 484 681 q 680 640 627 681 q 733 519 733 599 q 727 461 733 492 q 713 398 721 430 l 656 155 q 597 -118 627 23 q 554 -373 567 -259 q 445 -365 501 -365 q 328 -373 385 -365 q 364 -240 345 -315 q 413 -25 383 -165 l 474 251 q 503 375 488 312 q 518 492 518 438 q 499 549 518 526 q 445 572 480 572 q 292 448 324 572 q 209 0 261 324 q 145 2 190 0 q 98 5 99 5 q 33 2 79 5 q -14 0 -11 0 q 58 317 26 162 q 126 666 90 472 m 430 757 l 634 970 q 678 1005 656 993 q 723 1018 699 1018 q 769 994 748 1018 q 790 945 790 970 q 774 906 790 922 q 733 873 758 890 l 497 757 l 430 757 "},"Θ":{"x_min":33,"x_max":1080,"ha":1117,"o":"m 33 387 q 201 792 33 634 q 617 951 369 951 q 952 850 825 951 q 1080 546 1080 749 q 912 144 1080 303 q 502 -14 745 -14 q 371 -7 424 -14 q 237 33 317 0 q 95 167 157 67 q 33 387 33 266 m 282 359 q 336 155 282 236 q 509 75 391 75 q 757 229 677 75 q 838 569 838 383 q 783 778 838 694 q 607 862 728 862 q 401 757 478 862 q 303 545 324 653 q 282 359 282 437 m 574 526 q 683 529 614 526 q 767 533 753 533 q 751 474 758 506 q 739 407 743 443 q 631 410 699 407 q 549 413 563 413 q 454 411 503 413 q 358 407 405 410 q 371 460 366 436 q 384 533 376 484 q 492 529 424 533 q 574 526 560 526 "},"®":{"x_min":72,"x_max":1065,"ha":1138,"o":"m 1065 490 q 919 139 1065 285 q 569 -6 773 -6 q 220 141 369 -6 q 72 490 72 288 q 220 837 72 690 q 569 985 369 985 q 918 839 771 985 q 1065 490 1065 694 m 155 490 q 277 199 155 323 q 567 75 400 75 q 858 197 734 75 q 983 488 983 320 q 861 781 983 658 q 569 904 739 904 q 277 781 400 904 q 155 490 155 658 m 577 775 q 742 740 670 775 q 814 625 814 706 q 780 527 814 569 q 694 468 747 486 l 814 225 l 667 224 l 560 448 l 497 449 l 497 225 l 361 225 l 361 775 l 577 775 m 497 530 l 562 530 q 643 547 611 530 q 675 608 675 564 q 657 658 675 637 q 609 684 640 680 q 555 690 586 690 l 497 690 l 497 530 "},"É":{"x_min":-3,"x_max":733.109375,"ha":699,"o":"m 184 932 q 311 928 225 932 q 441 924 397 924 q 587 928 490 924 q 733 932 684 932 q 701 810 708 877 q 597 825 645 819 q 498 831 549 831 l 399 831 q 385 781 392 812 q 366 704 377 749 l 338 548 l 456 543 q 547 547 485 543 q 638 551 608 551 q 624 494 631 535 q 617 432 617 452 q 541 437 598 432 q 456 442 484 442 l 318 442 l 280 265 q 266 192 275 244 q 253 109 257 141 q 413 112 344 109 q 591 126 483 116 q 574 66 581 99 q 560 0 566 33 q 415 4 516 0 q 267 8 313 8 q 131 4 222 8 q -3 0 41 0 q 109 456 61 216 q 184 932 157 697 m 350 1037 l 556 1248 q 599 1283 576 1269 q 642 1297 622 1297 q 690 1273 666 1297 q 713 1225 713 1249 q 697 1184 713 1201 q 651 1153 680 1168 l 418 1037 l 350 1037 "},"~":{"x_min":268,"x_max":1092,"ha":1365,"o":"m 1092 938 q 1034 720 1092 806 q 848 635 976 635 q 660 720 758 635 q 518 805 562 805 q 428 757 453 805 q 403 635 403 709 l 268 635 q 327 850 268 763 q 509 938 387 938 q 695 852 598 938 q 847 767 793 767 q 934 815 911 767 q 957 938 957 864 l 1092 938 "},"Ε":{"x_min":-3,"x_max":733.109375,"ha":700,"o":"m 184 932 q 312 928 227 932 q 440 924 397 924 q 587 928 490 924 q 733 932 684 932 q 710 872 717 900 q 702 813 702 845 q 599 825 651 820 q 498 831 547 831 l 399 831 q 382 770 391 804 q 366 705 373 735 l 338 548 l 458 544 q 561 547 497 544 q 638 551 626 551 q 624 494 630 533 q 619 432 619 455 q 529 436 585 432 q 456 441 473 441 l 317 441 l 279 265 q 254 109 262 184 q 443 117 316 109 q 591 126 570 126 q 574 64 583 101 q 562 0 566 27 q 415 4 516 0 q 267 8 313 8 q 133 4 223 8 q -3 0 42 0 q 108 458 60 216 q 184 932 156 700 "},"³":{"x_min":-11,"x_max":442,"ha":493,"o":"m 83 502 q 101 416 83 440 q 155 389 120 391 q 227 427 202 389 q 259 517 253 465 q 238 584 259 554 q 184 615 217 615 l 144 615 q 150 637 148 626 q 151 665 151 648 l 183 661 q 268 695 233 661 q 303 779 303 730 q 284 838 303 813 q 233 863 266 863 q 176 834 196 863 q 150 763 157 806 l 134 750 q 114 785 125 766 q 76 835 102 804 q 161 885 116 870 q 261 901 207 901 q 385 873 329 901 q 442 785 442 846 q 398 688 442 719 q 277 644 354 656 l 277 636 q 372 595 337 623 q 408 511 408 566 q 341 384 408 426 q 183 342 274 342 q 73 357 122 342 q -11 411 25 372 l 66 508 l 83 502 "},"[":{"x_min":-11,"x_max":532.046875,"ha":446,"o":"m 212 932 q 319 932 247 932 q 427 932 391 932 l 532 932 q 523 903 527 922 q 513 854 518 883 q 442 860 462 859 q 409 861 422 861 l 359 861 q 259 415 307 647 q 164 -90 212 183 l 222 -93 q 270 -90 251 -93 q 313 -86 289 -88 l 296 -161 l 148 -154 l -11 -161 q 61 179 27 19 q 136 542 95 339 q 212 932 177 746 "},"L":{"x_min":0,"x_max":587.5,"ha":631,"o":"m 263 110 q 429 118 312 110 q 587 127 547 127 q 568 60 575 91 q 561 0 561 28 q 347 2 497 0 q 187 5 198 5 l 0 0 q 81 338 51 205 q 142 629 112 470 q 187 932 172 787 q 260 925 229 928 q 312 922 291 922 q 379 926 343 922 q 437 932 416 930 q 350 629 390 772 q 286 360 309 486 q 263 110 263 235 "},"σ":{"x_min":5,"x_max":842.5,"ha":801,"o":"m 727 405 q 603 104 727 229 q 305 -21 480 -21 q 86 56 167 -21 q 5 269 5 133 q 116 558 5 431 q 388 686 228 686 q 525 673 420 686 q 670 660 631 660 q 771 663 711 660 q 842 667 831 667 q 826 601 830 619 q 823 553 823 583 l 734 557 l 686 557 q 727 405 727 488 m 212 195 q 234 93 212 138 q 306 48 257 48 q 463 199 412 48 q 514 487 514 350 q 491 584 514 542 q 416 626 469 626 q 303 552 342 626 q 245 398 264 478 q 218 279 225 317 q 212 195 212 241 "},"ζ":{"x_min":16,"x_max":738.21875,"ha":706,"o":"m 227 305 q 329 205 227 226 q 529 169 431 185 q 637 27 637 134 q 584 -114 637 -51 q 447 -237 532 -178 l 393 -191 q 457 -128 438 -151 q 477 -69 477 -104 q 326 3 477 -19 q 95 56 175 26 q 16 201 16 85 q 90 467 16 342 q 259 681 164 591 q 520 906 354 772 q 350 904 410 906 q 208 894 290 902 q 225 957 218 921 q 238 1026 232 994 q 377 1021 283 1026 q 503 1016 470 1016 q 738 1026 629 1016 l 734 951 q 498 769 610 869 q 306 547 386 669 q 227 305 227 426 "},"θ":{"x_min":12,"x_max":702,"ha":738,"o":"m 12 321 q 117 722 12 535 q 421 910 223 910 q 635 814 568 910 q 702 566 702 719 q 595 168 702 354 q 292 -17 488 -17 l 256 -17 q 68 88 125 -4 q 12 321 12 180 m 519 722 q 497 810 519 774 q 427 847 475 847 q 310 751 342 847 q 251 494 277 655 l 327 492 q 406 492 353 492 q 484 492 459 492 q 505 606 491 538 q 519 722 519 675 m 351 418 l 236 414 q 213 287 227 363 q 200 156 200 211 q 220 79 200 110 q 283 48 240 48 q 406 128 381 48 q 466 413 431 209 l 351 418 "},"Ο":{"x_min":34,"x_max":1080,"ha":1117,"o":"m 34 392 q 192 787 34 623 q 575 951 350 951 q 941 857 802 951 q 1080 546 1080 763 q 911 147 1080 308 q 503 -14 743 -14 q 372 -7 427 -14 q 237 34 318 0 q 95 169 156 69 q 34 392 34 270 m 281 360 q 335 156 281 237 q 510 75 389 75 q 758 230 677 75 q 840 570 840 385 q 782 777 840 692 q 607 862 724 862 q 401 757 478 862 q 302 546 324 653 q 281 360 281 438 "},"Γ":{"x_min":-2.78125,"x_max":741.671875,"ha":650,"o":"m 429 922 q 600 927 490 922 q 741 932 709 932 q 718 869 726 897 q 709 813 709 842 q 604 825 655 820 q 502 830 554 830 l 400 830 q 380 761 390 799 q 366 704 370 724 l 323 485 q 279 247 297 364 q 248 0 262 130 q 171 7 205 4 q 118 10 137 10 q 52 5 88 10 q -2 0 16 1 q 66 267 5 35 q 156 650 127 499 q 184 931 184 801 q 429 922 300 922 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":30,"x_max":1036,"ha":1076,"o":"m 296 910 q 444 860 382 910 q 507 726 507 811 q 425 547 507 620 q 238 475 344 475 q 91 524 153 475 q 30 657 30 573 q 54 762 30 702 q 145 866 78 822 q 296 910 213 910 m 126 -123 l 844 1015 l 927 1014 l 211 -123 l 126 -123 m 823 413 q 973 362 911 413 q 1036 226 1036 311 q 954 50 1036 122 q 765 -22 872 -22 q 616 25 676 -22 q 557 160 557 73 q 582 264 557 204 q 672 368 608 324 q 823 413 737 413 m 693 111 q 710 51 693 75 q 761 28 727 28 q 868 112 834 28 q 903 280 903 196 q 900 303 903 291 q 891 329 897 315 q 868 351 886 343 q 832 360 850 360 q 756 318 784 360 q 709 215 729 276 q 697 158 701 179 q 693 111 693 137 m 163 609 q 181 552 163 577 q 231 528 200 528 q 339 611 305 528 q 374 781 374 694 q 354 837 374 813 q 304 861 335 861 q 227 819 254 861 q 185 729 200 777 q 167 661 171 680 q 163 609 163 643 "},"P":{"x_min":0,"x_max":822,"ha":831,"o":"m 188 932 l 309 928 l 472 931 q 722 881 622 931 q 822 694 822 830 q 699 467 822 538 q 413 395 577 395 q 316 401 359 395 l 288 267 q 247 0 258 116 q 173 7 193 5 q 119 9 154 9 q 56 6 88 9 q 0 0 25 2 q 85 322 40 151 q 159 647 130 492 q 188 932 188 802 m 363 490 q 533 552 477 490 q 590 730 590 615 q 548 819 590 789 q 444 849 506 849 l 416 849 q 396 781 404 809 q 384 724 388 754 l 333 491 l 363 490 "},"Ώ":{"x_min":-44,"x_max":1315.71875,"ha":1356,"o":"m 256 417 q 425 803 256 655 q 838 951 594 951 q 1175 849 1049 951 q 1302 542 1302 748 q 1240 299 1302 413 q 1074 110 1179 184 q 1181 115 1128 110 q 1315 130 1235 120 q 1302 0 1302 69 l 1065 4 l 803 0 l 821 91 q 1005 274 951 141 q 1059 573 1059 407 q 1002 778 1059 695 q 829 862 946 862 q 580 704 656 862 q 505 348 505 546 q 538 186 505 256 q 649 91 571 116 l 629 0 q 457 1 544 0 q 283 4 369 2 l 140 0 q 160 128 160 66 q 275 118 211 122 q 392 114 339 114 q 290 253 324 180 q 256 417 256 326 m -44 756 l 160 970 q 203 1004 181 991 q 247 1018 225 1018 q 294 994 274 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 "},"Έ":{"x_min":-44,"x_max":1011.546875,"ha":978,"o":"m 462 932 q 590 928 505 932 q 718 924 675 924 q 865 928 768 924 q 1011 932 962 932 q 988 872 996 900 q 981 813 981 844 q 877 825 929 819 q 776 831 825 831 l 678 831 q 660 770 669 804 q 644 705 651 736 l 617 549 l 736 545 q 840 548 775 545 q 917 551 904 551 q 903 494 908 533 q 897 432 897 455 q 807 437 864 432 q 734 442 751 442 l 595 442 l 557 265 q 532 109 540 184 q 721 117 594 109 q 869 126 849 126 q 853 64 861 101 q 840 0 844 27 q 693 4 794 0 q 546 8 591 8 q 411 4 501 8 q 275 0 320 0 q 386 458 338 216 q 462 932 434 700 m -44 756 l 160 970 q 203 1004 181 991 q 247 1018 225 1018 q 294 994 274 1018 q 315 945 315 970 q 299 906 315 922 q 257 873 283 890 l 23 756 l -44 756 "},"_":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 683 -185 l 683 -322 l 0 -322 l 0 -185 l 683 -185 "},"Ϊ":{"x_min":8,"x_max":598,"ha":457,"o":"m 258 0 q 183 4 235 0 q 123 9 132 9 q 69 4 110 9 q 8 0 28 0 q 98 324 51 152 q 172 637 146 495 q 198 932 198 779 q 261 924 230 927 q 323 922 292 922 q 381 924 349 922 q 449 931 413 927 q 334 486 384 737 q 258 0 283 235 m 247 1253 q 313 1225 285 1253 q 342 1159 342 1198 q 315 1092 342 1120 q 249 1065 289 1065 q 180 1092 208 1065 q 152 1159 152 1119 q 181 1225 152 1197 q 247 1253 210 1253 m 502 1253 q 569 1225 541 1253 q 598 1159 598 1198 q 570 1092 598 1119 q 502 1065 543 1065 q 435 1091 461 1065 q 409 1159 409 1117 q 436 1225 409 1198 q 502 1253 463 1253 "},"+":{"x_min":169,"x_max":969,"ha":1138,"o":"m 636 814 l 636 474 l 969 474 l 969 342 l 636 342 l 636 0 l 501 0 l 501 342 l 169 342 l 169 474 l 501 474 l 501 814 l 636 814 "},"½":{"x_min":118,"x_max":1142,"ha":1169,"o":"m 258 801 q 196 781 228 794 q 131 752 163 769 q 128 778 131 766 q 118 809 124 790 q 238 842 190 826 q 402 901 285 858 l 426 890 q 357 645 385 765 q 305 390 328 525 l 227 394 l 155 390 q 221 610 194 509 q 258 801 248 711 m 1011 1015 l 254 -123 l 172 -124 l 923 1014 l 1011 1015 m 674 41 q 905 211 811 129 q 1000 383 1000 294 q 981 440 1000 416 q 930 465 962 465 q 868 431 890 465 q 847 356 847 398 l 843 348 l 758 422 q 845 486 794 465 q 957 508 897 508 q 1084 478 1027 508 q 1142 383 1142 448 q 1096 274 1142 317 q 843 97 1050 230 q 992 100 887 97 q 1103 103 1097 103 q 1088 55 1096 86 q 1075 0 1080 25 q 972 0 1041 0 q 868 0 902 0 q 765 0 834 0 q 661 0 695 0 q 674 41 674 16 "},"Ρ":{"x_min":0,"x_max":822,"ha":831,"o":"m 188 932 l 309 928 l 472 931 q 722 881 622 931 q 822 694 822 830 q 699 467 822 538 q 413 395 577 395 q 316 401 359 395 l 288 267 q 247 0 258 116 q 173 7 193 5 q 119 9 154 9 q 56 6 88 9 q 0 0 25 2 q 85 322 40 151 q 159 647 130 492 q 188 932 188 802 m 363 490 q 533 552 477 490 q 590 730 590 615 q 548 819 590 789 q 444 849 506 849 l 416 849 q 396 781 404 809 q 384 724 388 754 l 333 491 l 363 490 "},"'":{"x_min":70.828125,"x_max":423.609375,"ha":375,"o":"m 70 518 l 226 849 q 273 928 250 906 q 326 951 297 951 q 393 931 363 951 q 423 878 423 912 q 406 821 423 851 q 363 765 388 791 l 100 494 l 70 518 "},"T":{"x_min":53,"x_max":809.9375,"ha":696,"o":"m 264 573 l 310 828 q 177 823 266 828 q 53 818 87 818 q 69 877 64 837 q 75 932 75 916 q 249 927 122 932 q 440 922 376 922 q 633 927 504 922 q 809 932 762 932 q 796 895 801 915 q 789 855 790 874 l 789 815 q 548 828 669 828 q 448 420 490 633 q 384 0 407 208 q 315 6 353 2 q 257 10 278 10 q 188 5 226 10 q 129 0 150 1 q 198 256 168 126 q 264 573 228 386 "},"Φ":{"x_min":34,"x_max":1080,"ha":1117,"o":"m 572 -25 q 508 -17 542 -20 q 450 -14 474 -14 q 386 -18 428 -14 q 338 -25 345 -23 l 370 81 q 134 185 234 100 q 34 401 34 270 q 178 731 34 608 q 529 854 322 854 l 539 961 q 594 951 568 954 q 649 949 620 949 q 697 951 672 949 q 772 961 721 954 l 739 851 l 793 841 q 998 736 916 819 q 1080 531 1080 652 q 932 205 1080 333 q 584 77 784 77 q 577 25 581 58 q 572 -25 572 -8 m 858 568 q 821 694 858 639 q 716 749 784 749 q 655 477 685 619 q 596 176 625 334 q 796 302 735 191 q 858 568 858 412 m 253 382 q 286 247 253 303 q 393 185 319 191 q 454 457 425 316 q 513 758 483 598 q 317 633 382 741 q 253 382 253 525 "},"j":{"x_min":-189,"x_max":380,"ha":394,"o":"m 266 1018 q 346 986 313 1018 q 380 908 380 954 q 347 829 380 862 q 269 797 314 797 q 190 828 223 797 q 158 906 158 859 q 188 986 158 954 q 266 1018 219 1018 m -189 -307 q -64 -267 -94 -307 q -18 -151 -33 -227 q 30 108 -4 -75 q 89 423 66 291 q 127 666 113 555 q 192 662 153 666 q 235 659 231 659 q 300 662 262 659 q 345 666 339 666 q 292 441 317 556 q 244 198 267 326 l 210 20 q 102 -281 173 -191 q -165 -371 31 -371 l -189 -307 "},"Σ":{"x_min":-90.28125,"x_max":838.890625,"ha":843,"o":"m 813 814 q 696 819 775 814 q 591 824 618 824 l 423 824 q 497 672 461 743 q 586 512 534 601 q 356 312 469 416 l 226 194 l 472 194 l 733 203 q 705 85 718 157 q 691 0 693 13 l 333 4 l -90 0 l -77 56 q 145 258 54 173 q 354 461 237 343 q 127 866 252 658 l 144 932 q 363 928 230 932 q 517 925 495 925 q 706 928 591 925 q 838 932 820 932 q 820 873 827 902 q 813 814 813 843 "},"1":{"x_min":137,"x_max":626,"ha":749,"o":"m 357 736 q 250 693 298 713 q 157 650 202 673 q 153 688 157 670 q 137 747 149 705 q 588 914 363 816 l 626 894 q 514 446 560 659 q 433 0 467 233 q 372 3 415 0 q 309 8 328 8 q 255 5 281 8 q 192 0 228 2 q 265 250 232 131 q 322 495 297 369 q 357 736 347 620 "},"ä":{"x_min":-9,"x_max":662,"ha":714,"o":"m 175 -14 q 43 32 95 -14 q -9 159 -9 79 q 61 320 -9 267 q 220 382 132 372 q 366 401 307 392 q 419 486 419 417 q 386 561 419 536 q 300 586 353 586 q 135 505 198 586 l 119 501 q 139 611 134 558 q 266 662 203 643 q 389 682 328 682 q 549 635 483 682 q 615 500 615 588 q 609 454 612 476 q 601 409 606 432 l 560 232 q 544 162 552 198 q 536 95 536 126 q 552 68 536 79 q 585 57 567 57 q 606 59 595 57 q 623 63 617 61 l 620 15 q 493 -10 561 -10 q 404 13 439 -10 q 353 88 368 37 q 281 11 327 37 q 175 -14 235 -14 m 314 974 q 381 946 353 974 q 409 878 409 918 q 382 811 409 837 q 314 785 356 785 q 246 811 274 785 q 219 878 219 837 q 246 946 219 918 q 314 974 274 974 m 568 974 q 634 946 606 974 q 662 878 662 918 q 636 811 662 837 q 570 785 611 785 q 501 811 529 785 q 474 878 474 837 q 501 946 474 918 q 568 974 529 974 m 190 177 q 206 115 190 141 q 256 90 223 90 q 357 195 336 90 q 384 328 378 300 q 250 291 303 328 q 190 177 196 254 "},"<":{"x_min":176,"x_max":961.453125,"ha":1138,"o":"m 961 651 l 364 405 l 961 163 l 961 16 l 176 341 l 176 472 l 961 796 l 961 651 "},"£":{"x_min":-27.78125,"x_max":761.109375,"ha":749,"o":"m 154 267 q 167 344 163 303 q 170 437 170 385 q 106 433 151 437 q 59 429 61 429 q 76 515 72 470 q 124 515 93 515 q 172 515 156 515 q 278 805 194 699 q 537 911 362 911 q 659 898 604 911 q 761 854 713 886 q 698 675 723 765 l 672 679 q 640 795 672 748 q 541 842 608 842 q 407 745 437 842 q 377 515 377 649 q 494 519 408 515 q 615 524 580 524 q 600 477 605 501 q 595 424 595 453 q 370 437 486 437 q 320 290 359 353 q 212 183 281 227 l 530 188 l 686 196 q 650 95 663 144 q 637 -3 637 47 l 320 7 q 115 3 240 7 q -27 0 -9 0 q -13 72 -22 22 q 0 156 -4 123 q 98 189 58 163 q 154 267 138 215 "},"¹":{"x_min":119,"x_max":443,"ha":493,"o":"m 267 794 q 202 774 234 787 q 135 743 169 761 q 119 802 130 770 q 270 849 201 826 q 418 903 340 872 l 443 891 q 315 356 366 635 l 234 356 q 197 356 215 356 q 157 356 180 356 q 232 607 208 518 q 267 794 257 697 "},"t":{"x_min":34,"x_max":475.671875,"ha":442,"o":"m 95 593 q 59 593 77 593 q 34 589 43 589 q 49 670 49 625 q 114 665 77 665 l 146 665 l 171 840 q 272 869 227 852 q 386 917 318 886 l 402 898 q 365 754 368 769 q 347 667 361 739 l 393 665 l 475 669 q 464 629 468 651 q 460 584 460 606 q 364 589 411 589 l 332 589 q 255 255 270 328 q 241 126 241 183 q 263 78 241 93 q 324 63 286 63 q 356 64 343 63 q 384 69 368 66 l 364 12 q 211 -14 295 -14 q 86 26 135 -14 q 37 143 37 66 q 66 355 37 232 q 125 592 96 479 l 95 593 "},"λ":{"x_min":-75,"x_max":582,"ha":654,"o":"m 187 273 q 125 143 154 209 q 69 0 97 76 l 5 8 q -34 5 -11 8 q -75 0 -56 2 q 269 631 115 323 q 234 846 254 778 q 130 915 215 915 q 107 911 120 915 q 86 906 94 908 l 81 988 q 163 1014 118 1003 q 248 1026 208 1026 q 393 946 356 1026 q 447 707 429 866 q 500 364 465 548 q 582 0 536 180 l 469 8 q 409 5 442 8 q 347 0 376 2 q 340 148 347 86 q 294 475 334 211 l 187 273 "},"ù":{"x_min":25,"x_max":772.21875,"ha":808,"o":"m 630 0 q 572 2 613 0 q 527 5 530 5 q 465 2 509 5 q 418 0 422 0 q 443 86 436 38 q 333 13 395 40 q 206 -14 272 -14 q 75 27 126 -14 q 25 148 25 69 q 29 207 25 176 q 43 274 34 238 l 77 426 q 100 530 90 476 q 122 668 109 584 l 230 664 l 348 668 q 270 375 301 501 q 239 180 239 249 q 256 117 239 141 q 311 94 273 94 q 349 105 331 94 q 468 245 438 150 q 517 501 498 340 l 546 668 l 658 664 l 772 668 q 630 0 687 341 m 540 757 l 349 875 q 306 908 322 890 q 291 951 291 926 q 312 997 291 978 q 359 1017 333 1017 q 400 1005 384 1017 q 440 966 416 993 l 607 757 l 540 757 "},"W":{"x_min":51,"x_max":1306.5625,"ha":1232,"o":"m 51 932 q 112 929 83 932 q 183 923 141 926 q 242 926 209 923 q 307 932 275 929 q 322 627 307 791 q 355 307 338 462 q 508 606 434 453 q 658 932 581 760 l 733 926 q 785 929 767 926 q 813 932 804 932 q 856 601 838 733 q 899 312 874 469 q 1037 619 973 465 q 1158 932 1101 773 q 1230 923 1194 927 q 1267 927 1242 923 q 1306 932 1292 932 q 1099 484 1207 727 q 888 0 991 241 q 808 8 848 3 q 767 5 789 8 q 724 0 745 2 q 687 318 705 188 q 634 615 669 448 q 536 423 595 541 q 428 201 477 305 q 334 0 378 98 q 283 4 312 1 q 248 8 253 8 q 199 4 228 8 q 166 0 169 0 q 150 290 166 147 q 105 604 134 433 q 51 932 77 776 "},"ï":{"x_min":-9,"x_max":502,"ha":393,"o":"m 131 667 q 197 663 156 667 q 244 660 239 660 q 306 663 268 660 q 350 667 344 667 q 271 330 307 505 q 214 0 235 155 q 161 2 196 0 q 110 5 127 5 l -9 0 q 49 252 21 129 q 92 452 77 376 q 131 667 107 527 m 153 974 q 220 946 192 974 q 248 878 248 918 q 221 811 248 837 q 156 785 195 785 q 86 811 114 785 q 59 878 59 837 q 86 946 59 918 q 153 974 114 974 m 408 974 q 474 946 446 974 q 502 878 502 918 q 476 811 502 837 q 410 785 451 785 q 341 811 369 785 q 314 878 314 837 q 341 946 314 918 q 408 974 369 974 "},">":{"x_min":176.078125,"x_max":963,"ha":1138,"o":"m 962 472 l 963 342 l 176 16 l 176 163 l 772 407 l 176 651 l 176 796 l 962 472 "},"v":{"x_min":21,"x_max":693.234375,"ha":654,"o":"m 211 4 l 121 0 q 21 667 91 310 q 82 660 59 663 q 130 658 105 658 q 187 661 157 658 q 249 666 218 664 q 259 484 249 560 q 305 198 269 408 l 419 406 q 479 524 447 456 q 546 666 511 591 l 616 661 l 693 666 q 549 436 619 552 q 423 218 479 320 q 314 0 366 115 l 211 4 "},"τ":{"x_min":-37,"x_max":638,"ha":583,"o":"m 21 448 l 3 448 q -12 522 -5 494 q -37 583 -20 551 q 103 638 29 620 q 256 657 176 657 l 478 657 q 566 662 510 657 q 638 667 622 667 q 614 550 619 608 q 488 558 551 558 l 426 558 q 314 0 356 283 l 210 5 q 143 2 190 5 q 92 0 96 0 q 141 202 119 106 q 186 412 163 297 l 213 558 q 87 526 137 548 q 21 448 37 504 "},"û":{"x_min":25,"x_max":772.21875,"ha":808,"o":"m 630 0 q 572 2 613 0 q 527 5 530 5 q 465 2 509 5 q 418 0 422 0 q 443 86 436 38 q 333 13 395 40 q 206 -14 272 -14 q 75 27 126 -14 q 25 148 25 69 q 29 207 25 176 q 43 274 34 238 l 77 426 q 100 530 90 476 q 122 668 109 584 l 230 664 l 348 668 q 270 375 301 501 q 239 180 239 249 q 256 117 239 141 q 311 94 273 94 q 349 105 331 94 q 468 245 438 150 q 517 501 498 340 l 546 668 l 658 664 l 772 668 q 630 0 687 341 m 615 756 l 492 886 l 313 756 l 244 756 l 451 1003 l 565 1003 l 672 756 l 615 756 "},"ξ":{"x_min":4,"x_max":720.28125,"ha":728,"o":"m 434 531 q 277 480 344 531 q 210 344 210 430 q 325 214 210 247 q 538 169 431 191 q 655 26 655 132 q 603 -118 655 -63 q 477 -238 551 -173 l 424 -197 q 479 -131 464 -154 q 494 -74 494 -109 q 339 11 494 -24 q 94 94 185 47 q 4 279 4 141 q 81 474 4 405 q 296 581 159 542 q 192 661 232 611 q 153 776 153 711 q 252 960 153 895 q 477 1026 351 1026 q 600 1010 538 1026 q 720 965 663 994 q 686 903 699 928 q 655 825 674 877 l 638 825 q 592 913 629 880 q 496 947 554 947 q 391 890 426 947 q 356 761 356 834 q 396 652 356 692 q 505 613 437 613 l 530 613 q 552 613 541 613 q 575 613 568 613 l 550 517 q 482 527 509 524 q 434 531 455 531 "},"&":{"x_min":50,"x_max":913.890625,"ha":976,"o":"m 572 83 q 317 -18 463 -18 q 129 45 209 -18 q 50 215 50 109 q 122 401 50 323 q 311 542 194 480 q 259 648 272 609 q 247 726 247 687 q 324 887 247 824 q 502 951 401 951 q 662 905 594 951 q 731 774 731 860 q 677 640 731 689 q 528 550 623 591 q 689 273 605 402 q 770 388 740 327 q 815 531 800 450 l 836 534 q 877 465 865 484 q 913 421 890 446 q 726 211 835 304 l 863 0 l 776 8 q 691 6 726 8 q 617 0 657 5 l 572 83 m 623 781 q 597 848 623 823 q 529 873 572 873 q 460 842 484 873 q 436 766 436 811 q 452 689 436 730 q 493 612 468 649 q 584 684 546 638 q 623 781 623 730 m 342 474 q 264 404 293 445 q 235 307 235 363 q 290 173 235 237 q 416 110 345 110 q 538 152 481 110 q 342 474 432 316 "},"Λ":{"x_min":-91,"x_max":784,"ha":856,"o":"m 436 640 q 287 411 349 511 q 173 218 225 312 q 67 0 121 123 l -6 6 q -56 3 -25 6 q -91 0 -88 0 q 202 461 57 222 q 479 943 346 700 q 513 934 495 939 q 554 930 532 930 q 592 935 568 930 q 628 943 615 940 q 784 0 674 482 l 652 6 l 520 0 q 508 212 520 112 q 487 376 497 312 q 436 640 476 440 "},"I":{"x_min":8.328125,"x_max":451.390625,"ha":458,"o":"m 261 0 q 196 4 248 0 q 122 9 144 9 q 55 5 88 9 q 8 0 22 1 q 93 324 52 162 q 159 632 133 487 q 198 932 186 776 q 270 925 238 928 q 323 922 301 922 q 393 926 354 922 q 451 932 431 930 q 336 485 387 744 q 261 0 284 226 "},"G":{"x_min":36,"x_max":1034.15625,"ha":1025,"o":"m 716 422 q 780 415 754 418 q 833 413 806 413 q 894 416 858 413 q 956 422 930 419 q 905 236 927 338 q 866 29 883 133 q 695 -2 781 8 q 522 -14 609 -14 q 170 88 304 -14 q 36 402 36 190 q 217 801 36 651 q 652 951 399 951 q 852 932 757 951 q 1034 869 948 913 l 942 663 l 921 670 q 829 814 907 768 q 646 861 752 861 q 373 711 467 861 q 280 368 280 561 q 350 157 280 243 q 544 71 420 71 q 594 75 571 71 q 649 87 617 79 q 716 422 694 255 "},"ΰ":{"x_min":33,"x_max":782,"ha":810,"o":"m 743 490 q 612 137 743 289 q 283 -14 481 -14 q 108 30 183 -14 q 33 168 33 74 q 75 448 33 248 q 118 670 117 647 q 169 666 139 667 q 225 665 199 665 q 301 665 263 665 q 345 670 331 668 q 270 387 306 539 q 234 153 234 236 q 248 85 234 112 q 300 51 262 57 q 489 161 428 51 q 550 412 550 272 q 537 537 550 478 q 496 657 524 597 q 582 658 535 657 q 706 670 629 658 q 733 585 724 632 q 743 490 743 537 m 228 963 q 285 939 261 963 q 309 881 309 915 q 288 821 309 845 q 230 798 267 798 q 171 821 196 798 q 146 881 146 845 q 170 938 146 914 q 228 963 194 963 m 323 756 l 432 930 q 481 996 460 974 q 532 1018 502 1018 q 584 966 584 1018 q 569 923 584 944 q 532 886 555 902 l 377 756 l 323 756 m 701 963 q 758 939 734 963 q 782 881 782 915 q 760 823 782 849 q 704 798 738 798 q 645 822 672 798 q 618 881 618 846 q 641 939 618 915 q 701 963 665 963 "},"`":{"x_min":79.5625,"x_max":433.71875,"ha":375,"o":"m 433 933 l 278 600 q 235 528 255 553 q 176 499 214 503 q 110 519 140 499 q 79 573 79 540 q 94 625 79 601 q 139 686 108 648 l 404 957 l 433 933 "},"Υ":{"x_min":40.28125,"x_max":813.890625,"ha":706,"o":"m 131 80 l 170 259 l 198 391 q 127 667 165 536 q 40 932 90 798 q 102 926 70 929 q 162 924 134 924 q 227 926 191 924 q 297 931 263 929 q 390 540 330 729 q 527 727 462 630 q 655 931 591 823 q 702 926 675 929 q 736 924 729 924 q 772 926 752 924 q 813 931 793 929 q 426 405 606 672 l 394 267 q 363 108 372 160 q 354 0 354 56 q 289 6 323 2 q 234 10 255 10 q 168 5 205 10 q 111 0 130 1 l 131 80 "},"r":{"x_min":-11.5,"x_max":574.609375,"ha":585,"o":"m 126 666 q 187 663 146 666 q 232 659 227 659 q 292 662 260 659 q 328 666 317 666 q 308 599 317 631 q 287 519 299 567 l 302 519 q 406 645 357 612 q 507 679 455 679 q 538 677 527 679 q 574 672 549 676 q 549 571 559 623 q 539 469 539 519 q 445 487 489 487 q 234 224 274 487 q 213 0 219 58 q 148 3 187 0 q 103 6 110 6 q 38 3 80 6 q -11 0 -3 0 q 63 346 28 180 q 126 666 98 512 "},"x":{"x_min":-105,"x_max":651.953125,"ha":631,"o":"m -17 4 q -70 1 -42 4 q -105 0 -98 0 q 43 152 -27 74 l 201 318 q 56 667 127 508 q 115 661 83 664 q 171 658 146 658 q 228 661 195 658 q 287 666 262 664 l 350 484 q 412 558 357 493 q 495 666 467 623 l 568 658 q 609 661 585 658 q 651 666 633 663 l 534 547 l 387 387 l 454 209 l 539 0 q 481 3 518 0 q 421 8 443 8 q 359 3 400 8 q 296 0 317 0 l 232 215 q 146 113 193 170 q 54 0 98 56 l -17 4 "},"è":{"x_min":3,"x_max":667,"ha":714,"o":"m 336 -18 q 100 60 197 -18 q 3 274 3 138 q 118 562 3 441 q 400 683 233 683 q 594 618 522 683 q 667 432 667 553 q 662 372 667 402 q 655 325 658 342 l 401 325 l 222 325 q 222 299 222 313 q 222 277 222 285 l 222 260 q 272 124 222 172 q 411 76 323 76 q 607 146 515 76 l 622 127 q 569 32 589 73 q 336 -18 451 -18 m 499 757 l 308 875 q 266 910 280 891 q 251 953 251 929 q 273 998 251 979 q 319 1017 294 1017 q 360 1005 344 1017 q 400 966 376 993 l 567 757 l 499 757 m 365 394 l 461 399 q 477 513 477 448 q 455 588 477 554 q 397 622 433 622 q 291 553 328 622 q 239 398 254 485 l 365 394 "},"μ":{"x_min":-86.5,"x_max":773.21875,"ha":810,"o":"m 287 -14 q 243 -2 266 -14 q 205 28 220 9 q 165 -167 181 -85 q 132 -366 149 -250 q 78 -361 96 -362 q 23 -359 60 -359 q -15 -360 2 -359 q -86 -366 -33 -361 q 32 147 -33 -191 q 117 670 99 486 q 171 665 139 667 q 230 663 202 663 q 298 667 251 663 q 349 670 346 670 q 271 381 303 511 q 239 182 239 251 q 257 119 239 143 q 312 96 274 96 q 403 130 332 96 q 503 360 474 165 q 548 670 532 556 q 603 667 566 670 q 659 663 641 663 q 725 667 680 663 q 773 670 770 670 q 696 344 731 510 q 630 1 662 179 l 530 6 l 420 1 q 444 87 438 45 q 377 15 419 44 q 287 -14 335 -14 "},"÷":{"x_min":169,"x_max":968,"ha":1136,"o":"m 668 665 q 638 596 668 625 q 566 567 609 567 q 496 596 524 567 q 468 667 468 626 q 497 737 468 708 q 568 767 526 767 q 638 737 609 767 q 668 665 668 708 m 968 474 l 968 342 l 169 342 l 169 474 l 968 474 m 668 146 q 638 74 668 105 q 568 44 609 44 q 498 72 528 44 q 468 142 468 100 q 498 214 468 184 q 568 244 528 244 q 638 216 609 244 q 668 146 668 188 "},"h":{"x_min":-7,"x_max":733,"ha":810,"o":"m 199 1025 l 302 1016 q 358 1019 327 1016 q 416 1025 390 1022 l 368 827 l 316 580 q 421 654 372 627 q 527 681 470 681 q 674 640 616 681 q 733 514 733 600 q 711 361 733 457 q 665 160 689 266 q 635 0 641 53 q 574 2 617 0 q 528 5 530 5 q 462 2 509 5 q 413 0 415 0 q 489 298 460 176 q 519 488 519 421 q 502 547 519 522 q 451 573 485 573 q 410 561 428 573 q 294 429 324 518 q 216 0 263 340 q 153 3 192 0 q 105 6 113 6 q 41 3 81 6 q -7 0 1 0 q 106 529 52 266 q 199 1025 161 791 "},".":{"x_min":0,"x_max":235,"ha":375,"o":"m 118 217 q 203 184 172 217 q 235 98 235 151 q 203 15 235 47 q 118 -17 171 -17 q 31 13 63 -17 q 0 98 0 44 q 32 184 0 151 q 118 217 65 217 "},"φ":{"x_min":5,"x_max":972,"ha":1032,"o":"m 5 275 q 117 555 5 447 q 399 664 230 664 l 402 583 q 248 475 278 583 q 206 233 218 367 q 242 116 206 158 q 342 60 279 75 l 405 375 q 488 600 434 524 q 673 676 542 676 q 888 589 805 676 q 972 372 972 503 q 841 81 972 180 q 514 -18 710 -18 q 475 -202 495 -105 q 455 -374 455 -298 l 374 -365 q 246 -373 311 -365 q 330 -7 295 -181 q 102 70 199 -7 q 5 275 5 147 m 527 56 q 713 168 657 56 q 769 428 769 281 q 752 542 769 492 q 685 593 735 593 q 637 564 653 593 q 614 494 621 535 l 527 56 "},";":{"x_min":-75,"x_max":372,"ha":458,"o":"m 253 683 q 337 649 302 683 q 372 567 372 616 q 337 484 372 519 q 253 450 302 450 q 171 483 205 450 q 137 566 137 517 q 170 648 137 613 q 253 683 203 683 m 75 123 q 122 205 101 177 q 186 233 144 233 q 247 212 218 233 q 280 162 277 191 q 264 97 280 127 q 220 34 248 66 l -45 -254 l -75 -227 l 75 123 "},"f":{"x_min":0,"x_max":598.609375,"ha":449,"o":"m 48 600 l 65 669 l 155 669 q 275 917 186 809 q 494 1026 363 1026 q 545 1019 520 1026 q 598 999 570 1013 q 537 825 563 917 l 519 827 q 483 880 505 860 q 429 901 461 901 q 369 862 386 901 q 352 774 352 823 l 358 669 l 490 669 q 479 637 483 652 q 473 600 476 621 l 347 600 q 277 292 305 431 q 230 0 250 153 q 165 3 206 0 q 115 6 123 6 q 52 3 94 6 q 0 0 11 0 q 70 286 33 134 q 144 600 108 438 l 48 600 "},"“":{"x_min":79.5625,"x_max":740.671875,"ha":685,"o":"m 433 933 l 278 600 q 234 522 253 546 q 176 499 215 499 q 111 521 143 499 q 79 572 79 543 q 94 625 79 600 q 139 686 110 650 l 404 957 l 433 933 m 740 933 l 586 600 q 543 523 562 548 q 486 499 524 499 q 420 521 453 499 q 387 572 387 543 q 405 628 387 598 q 447 686 422 658 l 712 957 l 740 933 "},"A":{"x_min":-93,"x_max":786,"ha":856,"o":"m 519 34 q 511 147 519 88 q 496 265 503 206 q 341 275 416 275 q 265 270 306 275 q 201 265 224 266 q 115 111 137 151 q 61 0 94 70 l -8 5 q -44 3 -22 5 q -93 0 -66 1 q 97 292 6 149 q 274 577 187 434 q 491 938 362 721 l 555 933 q 589 935 570 933 q 617 938 608 936 l 665 618 q 701 394 681 514 q 739 188 722 273 q 786 0 756 102 q 701 10 734 7 q 648 13 669 13 q 598 10 621 13 q 519 0 576 7 l 519 34 m 333 363 l 485 363 q 468 529 473 478 q 448 671 462 580 q 350 518 404 603 q 257 365 295 433 l 333 363 "},"6":{"x_min":43,"x_max":678,"ha":749,"o":"m 445 536 q 609 467 541 536 q 678 304 678 399 q 581 70 678 162 q 343 -22 484 -22 q 122 62 201 -22 q 43 290 43 147 q 173 716 43 525 q 527 907 304 907 q 590 903 563 907 q 658 888 617 900 l 678 766 l 658 762 q 601 816 633 797 q 527 835 569 835 q 369 732 420 835 q 307 500 318 629 q 445 536 376 536 m 246 171 q 265 84 246 121 q 332 47 284 47 q 430 140 399 47 q 461 323 461 234 q 441 412 461 374 q 376 451 422 451 q 292 396 319 451 q 254 269 265 341 q 247 223 248 245 q 246 171 246 201 "},"‘":{"x_min":79.5625,"x_max":432.328125,"ha":374,"o":"m 432 932 l 276 600 q 233 524 253 550 q 175 499 214 499 q 110 519 140 499 q 79 574 79 540 q 89 617 79 596 q 139 685 100 639 l 404 956 l 432 932 "},"ϊ":{"x_min":-9,"x_max":516,"ha":393,"o":"m 130 667 q 245 660 189 660 q 305 663 267 660 q 352 667 343 667 q 272 333 305 490 q 213 0 240 176 l 110 5 q 41 2 89 5 q -9 0 -6 0 q 70 351 32 176 q 130 667 108 526 m 167 974 q 235 946 209 974 q 261 879 261 919 q 234 812 261 838 q 167 786 208 786 q 99 812 127 786 q 72 880 72 838 q 99 947 72 921 q 167 974 127 974 m 421 974 q 488 946 460 974 q 516 877 516 918 q 489 811 516 836 q 422 786 463 786 q 354 812 382 786 q 327 880 327 838 q 353 947 327 921 q 421 974 379 974 "},"π":{"x_min":-25,"x_max":970.828125,"ha":926,"o":"m 34 448 l 13 448 q -25 583 13 512 q 120 639 40 622 q 285 656 199 656 l 488 656 l 783 656 q 867 658 820 656 q 970 667 913 660 q 951 610 956 635 q 945 550 945 585 q 880 557 911 556 q 807 559 850 559 l 787 559 q 728 285 755 425 q 679 0 701 146 l 576 5 q 505 2 554 5 q 453 0 456 0 q 548 413 503 190 l 576 559 l 411 559 q 348 283 377 428 q 298 0 319 139 l 195 5 q 125 2 173 5 q 75 0 77 0 q 127 211 102 106 q 170 412 152 315 l 197 558 q 92 522 136 548 q 34 448 47 497 "},"ά":{"x_min":5,"x_max":850.828125,"ha":890,"o":"m 277 -14 q 78 71 152 -14 q 5 284 5 156 q 127 566 5 449 q 414 683 249 683 q 653 538 581 683 q 687 666 674 600 l 769 663 l 850 666 q 788 520 816 590 q 718 340 760 451 q 797 1 744 170 l 634 2 l 564 1 q 557 68 564 34 q 548 122 551 102 q 427 21 495 56 q 277 -14 359 -14 m 387 757 l 591 970 q 634 1004 611 991 q 678 1018 656 1018 q 725 994 705 1018 q 746 945 746 970 q 730 906 746 922 q 688 873 714 890 l 454 757 l 387 757 m 425 627 q 257 475 307 627 q 208 173 208 323 q 230 83 208 117 q 307 50 253 50 q 478 169 419 62 q 537 396 537 276 q 529 502 537 456 q 507 576 521 549 q 467 618 493 603 q 425 627 448 627 "},"O":{"x_min":34,"x_max":1080,"ha":1117,"o":"m 34 392 q 192 787 34 623 q 575 951 350 951 q 941 857 802 951 q 1080 546 1080 763 q 911 147 1080 308 q 503 -14 743 -14 q 372 -7 427 -14 q 237 34 318 0 q 95 169 156 69 q 34 392 34 270 m 281 360 q 335 156 281 237 q 510 75 389 75 q 758 230 677 75 q 840 570 840 385 q 782 777 840 692 q 607 862 724 862 q 401 757 478 862 q 302 546 324 653 q 281 360 281 438 "},"n":{"x_min":-14,"x_max":733,"ha":810,"o":"m 126 666 q 176 663 142 666 q 226 661 209 661 q 290 663 245 661 q 336 666 334 666 q 321 620 324 633 q 312 580 317 608 q 423 654 362 627 q 548 681 484 681 q 681 639 630 681 q 733 519 733 598 q 731 488 733 501 q 721 432 730 475 l 676 240 q 657 148 671 222 q 633 0 642 74 q 580 2 615 0 q 527 5 545 5 q 460 2 508 5 q 409 0 413 0 q 481 275 445 126 q 518 488 518 425 q 499 548 518 524 q 445 573 481 573 q 354 536 424 573 q 254 307 283 500 q 209 0 224 113 q 144 3 183 0 q 98 6 105 6 q 34 3 74 6 q -14 0 -5 0 q 58 317 26 162 q 126 666 90 472 "},"3":{"x_min":-16,"x_max":673,"ha":749,"o":"m 125 248 q 151 112 125 168 q 250 56 177 56 q 361 130 326 56 q 396 289 396 204 q 365 391 396 347 q 279 435 335 435 l 263 435 l 221 435 q 231 517 231 473 q 261 514 240 515 q 297 513 281 513 q 418 569 374 513 q 462 707 462 626 q 436 805 462 764 q 356 846 410 846 q 266 800 293 846 q 227 680 239 754 l 203 661 q 115 805 172 734 q 236 884 168 858 q 384 910 303 910 q 585 865 497 910 q 673 718 673 821 q 604 559 673 615 q 424 482 535 503 l 422 469 q 566 400 513 450 q 620 264 620 350 q 523 50 620 122 q 279 -22 426 -22 q 106 3 183 -22 q -16 94 29 29 q 48 181 24 147 q 101 254 73 215 l 125 248 "},"9":{"x_min":40,"x_max":714,"ha":749,"o":"m 40 158 l 65 161 q 121 75 84 106 q 215 44 158 44 q 373 137 326 44 q 453 388 419 230 q 393 365 433 374 q 324 356 354 356 q 148 417 213 356 q 84 592 84 479 q 184 821 84 732 q 426 910 284 910 q 640 825 567 910 q 714 595 714 741 q 576 167 714 356 q 208 -21 438 -21 q 138 -16 174 -21 q 65 -1 102 -11 q 40 158 48 76 m 513 710 q 494 802 513 764 q 427 841 476 841 q 329 747 360 841 q 298 567 298 654 q 322 467 298 498 q 385 437 346 437 q 468 495 439 437 q 504 620 497 553 q 513 710 513 666 "},"l":{"x_min":-8.328125,"x_max":419.4375,"ha":392,"o":"m 193 1025 q 309 1018 251 1018 q 349 1018 330 1018 q 419 1025 368 1019 q 299 505 352 768 q 211 0 245 242 q 145 3 184 0 q 101 6 106 6 q 37 3 76 6 q -8 0 -1 0 q 113 527 54 234 q 193 1025 172 820 "},"κ":{"x_min":-8.71875,"x_max":801,"ha":742,"o":"m 301 382 l 449 506 q 514 563 477 528 q 616 667 552 599 q 662 661 638 664 q 706 658 687 658 q 748 661 724 658 q 792 667 773 664 l 801 657 q 641 542 714 600 q 473 403 567 485 q 653 0 553 197 q 578 3 627 0 q 523 6 530 6 q 454 3 496 6 q 405 0 411 0 q 356 149 385 65 q 298 306 327 233 l 258 306 q 227 135 241 219 q 205 0 213 51 l 110 5 q 41 2 89 5 q -8 0 -5 0 q 70 351 32 176 q 130 667 107 526 q 244 660 188 660 q 301 663 264 660 q 345 667 337 667 q 302 501 326 599 q 276 389 278 403 l 301 382 "},"4":{"x_min":4.5625,"x_max":718.453125,"ha":749,"o":"m 354 225 q 179 221 296 225 q 4 217 62 217 q 25 300 17 264 q 39 384 33 337 q 196 552 119 468 q 342 710 274 636 q 517 908 410 785 l 611 902 q 678 902 644 902 q 718 908 705 906 q 590 382 643 638 l 622 380 q 676 383 657 380 q 705 386 696 386 q 671 215 671 305 q 591 224 614 223 q 554 225 568 225 l 517 0 q 464 4 499 0 q 411 8 429 8 q 355 4 392 8 q 301 0 319 0 q 327 104 312 44 q 354 225 342 165 m 392 385 q 433 565 411 472 q 472 750 454 658 q 237 475 282 525 q 151 380 192 425 q 271 382 211 380 q 392 385 330 383 "},"p":{"x_min":-98,"x_max":755,"ha":828,"o":"m 299 573 q 393 652 345 623 q 497 681 442 681 q 686 612 618 681 q 755 422 755 544 q 663 123 755 261 q 418 -14 571 -14 q 220 101 284 -14 q 157 -144 189 -15 q 125 -374 125 -273 q 24 -366 75 -366 q -98 -375 -35 -366 q 24 146 -28 -105 q 120 665 78 398 q 183 659 154 662 q 227 656 211 656 q 270 659 245 656 q 317 665 295 662 l 299 573 m 542 472 q 516 558 542 519 q 444 597 490 597 q 301 469 349 597 q 254 219 254 341 q 280 130 254 169 q 351 92 306 92 q 454 150 419 92 q 515 305 489 209 q 539 413 536 395 q 542 472 542 430 "},"ψ":{"x_min":28,"x_max":1041,"ha":1113,"o":"m 490 -372 l 412 -363 q 280 -372 347 -363 q 330 -157 303 -288 q 362 -8 358 -26 q 124 80 221 8 q 28 286 28 152 q 30 339 28 318 q 46 427 33 361 l 76 574 l 89 670 q 197 665 137 665 q 243 665 218 665 q 315 670 269 666 q 248 436 272 538 q 224 236 224 333 q 265 117 224 162 q 380 61 307 73 l 429 311 q 485 605 469 518 q 512 803 501 693 l 591 794 q 722 803 655 794 q 655 518 690 686 q 614 309 621 351 l 566 53 q 775 164 707 53 q 844 427 844 275 q 836 522 844 473 q 809 658 828 572 q 1003 670 899 658 q 1030 569 1020 623 q 1041 468 1041 515 q 908 113 1041 241 q 550 -14 776 -14 q 516 -199 533 -102 q 490 -372 498 -297 "},"Ü":{"x_min":72,"x_max":1014,"ha":1006,"o":"m 305 923 q 426 932 363 923 q 361 704 394 822 q 306 472 327 586 q 285 259 285 358 q 333 140 285 183 q 458 97 382 97 q 585 119 529 97 q 691 201 641 142 q 775 387 740 260 q 833 661 811 513 q 873 932 855 808 q 944 925 912 925 q 1014 932 975 925 q 979 792 991 841 q 929 579 966 743 q 883 379 891 416 q 868 316 875 341 q 834 205 861 290 q 689 51 806 120 q 426 -18 572 -18 q 172 43 273 -18 q 72 250 72 105 q 95 438 72 304 q 146 716 119 573 q 181 932 173 859 q 305 923 243 923 m 540 1253 q 605 1225 577 1253 q 633 1159 633 1197 q 606 1092 633 1120 q 540 1065 580 1065 q 470 1091 498 1065 q 443 1159 443 1117 q 472 1225 443 1197 q 540 1253 501 1253 m 794 1253 q 861 1225 833 1253 q 889 1159 889 1197 q 861 1092 889 1119 q 794 1065 834 1065 q 726 1091 754 1065 q 699 1159 699 1117 q 727 1225 699 1198 q 794 1253 755 1253 "},"à":{"x_min":-9,"x_max":622.9375,"ha":714,"o":"m 175 -14 q 43 32 95 -14 q -9 159 -9 79 q 61 320 -9 267 q 220 382 132 372 q 366 401 307 392 q 419 486 419 417 q 386 561 419 536 q 300 586 353 586 q 135 505 198 586 l 119 501 q 139 611 134 558 q 266 662 203 643 q 389 682 328 682 q 549 635 483 682 q 615 500 615 588 q 609 454 612 476 q 601 409 606 432 l 560 232 q 544 162 552 198 q 536 95 536 126 q 552 68 536 79 q 585 57 567 57 q 606 59 595 57 q 622 63 617 61 l 620 15 q 493 -10 561 -10 q 353 88 385 -10 q 281 11 327 37 q 175 -14 235 -14 m 487 757 l 297 875 q 254 910 270 893 q 239 951 239 928 q 260 997 239 978 q 307 1017 281 1017 q 349 1003 331 1017 q 386 966 367 990 l 556 757 l 487 757 m 190 177 q 206 115 190 141 q 256 90 223 90 q 357 195 336 90 q 384 328 378 300 q 250 291 303 328 q 190 177 196 254 "},"η":{"x_min":-14,"x_max":733,"ha":810,"o":"m 126 666 q 176 663 142 666 q 226 661 209 661 q 290 663 245 661 q 336 666 334 666 q 321 620 324 633 q 312 580 317 608 q 423 653 362 626 q 546 681 484 681 q 680 640 627 681 q 733 519 733 599 q 727 461 733 492 q 713 398 721 430 l 656 155 q 597 -118 627 23 q 554 -373 567 -259 q 445 -365 501 -365 q 328 -373 385 -365 q 364 -240 345 -315 q 413 -25 383 -165 l 474 251 q 503 375 488 312 q 518 492 518 438 q 499 549 518 526 q 445 572 480 572 q 292 448 324 572 q 209 0 261 324 q 145 2 190 0 q 98 5 99 5 q 33 2 79 5 q -14 0 -11 0 q 58 317 26 162 q 126 666 90 472 "}},"cssFontWeight":"bold","ascender":1298,"underlinePosition":-133,"cssFontStyle":"italic","boundingBox":{"yMin":-375,"xMin":-189,"yMax":1297,"xMax":1559},"resolution":1000,"original_font_information":{"postscript_name":"Optimer-Bold Oblique","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Optimer Bold Oblique","font_family_name":"Optimer","copyright":"Copyright (c) Magenta Ltd., 2004","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta Ltd.:Optimer Bold Oblique:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta Ltd.","font_sub_family_name":"Bold Oblique"},"descender":-375,"familyName":"Optimer","lineHeight":1672,"underlineThickness":20});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":11,"x_max":699,"ha":761,"o":"m 372 669 q 607 596 516 669 q 699 380 699 523 q 591 106 699 226 q 333 -14 484 -14 q 100 58 190 -14 q 11 271 11 130 q 18 346 11 309 q 54 459 26 384 q 170 601 83 534 q 372 669 258 669 m 135 235 q 177 93 135 149 q 303 37 219 37 q 501 159 432 37 q 570 421 570 282 q 523 560 570 502 q 394 618 476 618 q 244 547 305 618 q 158 380 183 477 q 135 235 135 307 "},"S":{"x_min":-34,"x_max":667.390625,"ha":656,"o":"m 16 211 l 40 211 q 114 91 60 136 q 245 46 167 46 q 401 105 336 46 q 466 255 466 164 q 371 409 466 346 q 196 514 284 461 q 101 686 101 583 q 196 876 101 807 q 418 946 292 946 q 553 930 493 946 q 667 876 613 915 q 641 820 653 851 q 622 761 628 788 l 604 763 q 523 859 571 824 q 409 895 474 895 q 276 847 330 895 q 222 721 222 800 q 312 579 222 638 q 489 468 402 521 q 584 295 584 396 q 478 71 584 156 q 231 -14 372 -14 q 86 9 160 -14 q -34 77 13 33 q 16 211 2 138 "},"¦":{"x_min":15,"x_max":929,"ha":996,"o":"m 349 -10 q 114 78 213 -10 q 15 303 15 166 q 144 576 15 494 q 477 658 274 658 q 510 822 496 741 q 537 1010 523 903 q 571 1004 558 1006 q 608 1003 584 1003 q 638 1004 626 1003 q 674 1010 651 1006 q 626 812 645 894 q 592 652 606 730 q 833 554 738 632 q 929 337 929 476 q 807 79 929 173 q 517 -13 685 -13 l 462 -10 q 403 -372 428 -168 q 358 -366 378 -366 q 314 -367 334 -366 q 266 -372 294 -367 q 316 -182 295 -267 q 349 -10 337 -97 m 511 41 q 724 127 648 41 q 801 353 801 213 q 743 523 801 454 q 584 605 685 591 l 476 40 l 511 41 m 144 301 q 201 118 144 196 q 359 41 259 41 l 469 609 q 231 530 319 609 q 144 301 144 452 "},"/":{"x_min":-33.546875,"x_max":409,"ha":383,"o":"m 409 1025 l 39 -126 l -33 -126 l 335 1024 l 409 1025 "},"Τ":{"x_min":68.0625,"x_max":769.453125,"ha":669,"o":"m 358 857 q 198 854 261 857 q 68 844 136 852 q 77 886 72 853 q 83 932 83 919 q 234 927 133 932 q 372 922 336 922 q 579 927 440 922 q 769 932 718 932 q 758 902 763 918 q 752 874 752 887 l 751 861 l 752 844 q 631 854 704 851 q 494 857 558 857 q 390 409 434 627 q 326 0 345 191 q 289 3 306 1 q 250 5 272 5 q 209 3 230 5 q 175 0 187 1 q 273 404 227 184 q 358 857 319 624 "},"y":{"x_min":-47.609375,"x_max":656.5625,"ha":606,"o":"m 89 -176 l 171 -34 l 118 220 l 66 466 l 14 656 q 53 648 35 651 q 88 646 70 646 q 118 648 102 646 q 162 655 134 650 q 204 369 179 493 l 257 110 l 356 292 q 446 461 404 376 q 537 655 489 545 q 597 646 569 646 q 624 648 609 646 q 656 655 638 650 q 342 144 491 405 q 74 -373 194 -116 l 34 -366 q -7 -367 13 -366 q -47 -373 -28 -369 q 39 -253 -1 -313 q 89 -176 73 -201 "},"≈":{"x_min":118.0625,"x_max":1019.453125,"ha":1139,"o":"m 763 441 q 572 487 708 441 q 376 533 437 533 q 250 506 298 533 q 118 428 202 480 l 118 503 q 247 572 181 545 q 376 600 312 600 q 575 554 440 600 q 763 508 711 508 q 871 527 816 508 q 1019 613 926 547 l 1019 538 q 890 467 952 493 q 763 441 829 441 m 759 215 q 568 261 702 215 q 375 308 433 308 q 262 285 309 308 q 118 202 215 262 l 118 276 q 247 347 183 322 q 380 373 312 373 q 577 327 444 373 q 763 282 711 282 q 868 302 813 282 q 1019 387 922 322 l 1019 311 q 894 241 959 267 q 759 215 829 215 "},"Π":{"x_min":13.890625,"x_max":999,"ha":1011,"o":"m 585 861 l 332 861 q 237 454 283 691 q 162 0 191 216 l 90 5 q 62 4 73 5 q 13 0 51 4 q 124 450 76 215 q 204 932 172 686 q 399 927 268 932 q 578 922 530 922 q 798 927 650 922 q 999 932 946 932 q 884 481 936 741 q 807 0 832 220 l 736 5 q 706 4 718 5 q 659 0 694 4 q 838 859 779 416 l 585 861 "},"ΐ":{"x_min":8,"x_max":461,"ha":335,"o":"m 128 656 q 201 648 166 648 q 271 655 238 648 q 186 311 218 474 q 155 0 155 148 q 117 3 135 1 q 78 5 100 5 l 8 0 q 70 230 45 130 q 112 442 95 330 q 128 656 128 554 m 84 869 q 130 850 111 869 q 149 805 149 831 q 130 762 149 780 q 84 744 112 744 q 41 762 58 744 q 25 805 25 780 q 42 850 25 831 q 84 869 59 869 m 235 947 q 254 990 238 968 q 290 1013 270 1013 q 323 999 309 1013 q 337 965 337 985 q 330 938 337 951 q 321 918 324 925 l 235 727 l 193 727 l 235 947 m 400 869 q 442 849 424 869 q 461 805 461 830 q 442 762 461 780 q 400 744 424 744 q 357 762 375 744 q 339 805 339 780 q 357 849 339 830 q 400 869 375 869 "},"g":{"x_min":-91,"x_max":660.390625,"ha":638,"o":"m 47 430 q 133 605 47 540 q 332 671 219 671 q 426 655 362 671 q 513 639 491 639 q 598 642 546 639 q 660 646 650 646 q 648 614 654 634 q 639 583 642 594 q 583 586 607 585 q 524 588 558 588 q 563 526 550 554 q 577 464 577 499 q 490 293 577 353 q 286 233 403 233 q 225 240 267 233 q 171 248 183 248 q 124 223 146 248 q 102 171 102 198 q 249 98 102 117 q 470 55 397 80 q 542 -82 542 30 q 428 -291 542 -211 q 178 -371 314 -371 q -8 -318 74 -371 q -91 -165 -91 -265 q -40 -44 -91 -95 q 83 34 9 6 q 22 72 42 47 q 1 138 1 97 q 45 217 10 187 q 137 273 80 248 q 69 343 92 306 q 47 430 47 380 m 459 483 q 424 584 459 544 q 329 624 390 624 q 211 561 256 624 q 166 422 166 498 q 196 325 166 365 q 284 286 227 286 q 411 343 363 286 q 459 483 459 401 m 2 -160 q 58 -274 2 -234 q 189 -315 114 -315 q 357 -262 284 -315 q 430 -119 430 -209 q 266 9 430 -6 q 122 18 160 15 q 34 -60 67 -18 q 2 -160 2 -102 "},"²":{"x_min":-3,"x_max":432,"ha":496,"o":"m 388 425 q 383 400 386 416 q 380 376 380 384 l 380 354 q 274 357 348 354 q 195 360 199 360 q 81 357 162 360 q -3 354 1 354 l 0 387 q 254 592 169 512 q 340 769 340 672 q 313 840 340 812 q 242 868 287 868 q 173 845 203 868 q 127 783 142 822 l 115 783 q 85 831 108 808 q 165 884 122 867 q 259 901 208 901 q 380 864 329 901 q 432 760 432 827 q 300 556 432 647 q 91 414 169 465 l 128 414 l 162 414 q 255 414 204 414 q 388 425 306 415 "},"Κ":{"x_min":13.890625,"x_max":836.109375,"ha":747,"o":"m 270 500 q 346 568 308 530 q 406 626 384 605 l 523 746 q 604 832 565 788 q 687 932 643 876 l 752 926 l 836 932 q 768 877 798 901 q 688 808 738 852 l 587 713 l 372 508 l 546 247 l 649 87 l 701 18 l 701 0 q 655 3 683 0 q 624 6 627 6 q 582 4 598 6 q 546 0 566 2 q 444 171 492 92 q 350 320 396 250 l 259 453 l 242 454 l 212 311 q 162 0 184 163 q 125 4 148 1 q 90 6 101 6 q 46 3 73 6 q 13 0 19 0 q 129 463 81 234 q 204 932 176 693 l 273 926 q 318 929 287 926 q 351 932 350 932 q 286 665 312 811 l 252 504 l 270 500 "},"ë":{"x_min":9,"x_max":616,"ha":664,"o":"m 142 236 q 192 100 142 153 q 322 47 242 47 q 433 76 376 47 q 538 153 490 106 l 553 139 q 536 93 544 118 q 523 50 528 69 q 415 0 471 16 q 301 -18 360 -18 q 89 61 169 -18 q 9 273 9 140 q 114 550 9 431 q 377 669 220 669 q 547 594 479 669 q 616 417 616 519 q 613 369 616 397 q 610 334 610 342 l 379 336 l 147 336 q 142 236 142 292 m 292 924 q 341 903 318 924 q 357 880 350 893 q 364 851 364 868 q 357 823 364 835 q 335 796 350 811 q 293 781 321 781 q 240 801 261 781 q 220 853 220 822 q 240 903 220 882 q 292 924 261 924 m 526 924 q 576 903 553 924 q 592 879 585 892 q 599 849 599 867 q 591 818 599 829 q 569 794 583 807 q 528 781 555 781 q 476 801 497 781 q 456 853 456 822 q 476 903 456 882 q 526 924 497 924 m 324 389 l 488 389 q 495 452 495 426 q 460 567 495 516 q 364 618 426 618 q 232 550 282 618 q 159 389 182 483 l 324 389 "},"e":{"x_min":11,"x_max":615,"ha":664,"o":"m 143 238 q 192 100 143 154 q 323 46 241 46 q 434 75 377 46 q 538 153 491 105 l 554 137 q 522 48 534 94 q 417 0 474 18 q 301 -18 359 -18 q 91 61 172 -18 q 11 270 11 140 q 116 549 11 430 q 378 669 222 669 q 548 594 481 669 q 615 415 615 519 q 612 368 615 401 q 609 334 609 335 l 380 337 l 149 337 q 144 291 145 315 q 143 238 143 266 m 324 388 l 489 388 l 494 453 q 461 568 494 519 q 364 618 428 618 q 231 549 283 618 q 161 389 180 480 l 324 388 "},"ό":{"x_min":11,"x_max":729.0625,"ha":761,"o":"m 372 669 q 607 596 516 669 q 699 380 699 523 q 591 106 699 226 q 333 -14 484 -14 q 100 58 190 -14 q 11 271 11 130 q 18 346 11 309 q 54 459 26 384 q 170 601 83 534 q 372 669 258 669 m 406 744 l 600 941 q 638 971 620 961 q 676 982 655 982 q 713 965 697 982 q 729 929 729 949 q 709 897 729 917 q 679 870 690 876 l 464 744 l 406 744 m 135 235 q 177 93 135 149 q 303 37 219 37 q 501 159 432 37 q 570 421 570 282 q 523 560 570 502 q 394 618 476 618 q 244 547 305 618 q 158 380 183 477 q 135 235 135 307 "},"J":{"x_min":-154.5625,"x_max":364.890625,"ha":385,"o":"m 241 352 l 210 176 q 99 -114 178 -11 q -149 -217 20 -217 l -154 -161 q -58 -139 -101 -161 q 9 -73 -15 -117 q 94 181 51 -17 q 166 582 137 380 q 212 932 196 785 q 259 927 244 929 q 288 926 274 926 q 329 928 306 926 q 364 932 352 930 q 295 637 326 778 q 241 352 264 497 "},"»":{"x_min":-7,"x_max":521,"ha":600,"o":"m 267 0 q 244 47 261 20 q 318 162 283 113 q 431 307 354 211 q 373 460 396 393 q 334 606 350 528 q 354 629 344 616 q 370 652 365 643 q 425 510 404 561 q 521 296 447 458 q 396 152 466 234 q 267 0 325 69 m 13 0 q -7 47 8 23 q 65 161 29 112 q 178 307 101 211 q 81 606 112 454 l 118 652 q 182 487 148 568 q 267 296 216 406 l 13 0 "},"©":{"x_min":80,"x_max":1056,"ha":1139,"o":"m 814 904 q 991 727 926 840 q 1056 481 1056 613 q 910 137 1056 281 q 567 -6 765 -6 q 224 138 368 -6 q 80 481 80 283 q 224 826 80 681 q 568 971 368 971 q 814 904 697 971 m 568 918 q 262 788 391 918 q 133 481 133 659 q 262 175 133 306 q 565 45 391 45 q 872 174 742 45 q 1003 478 1003 303 q 946 697 1003 595 q 786 858 889 799 q 568 918 683 918 m 571 721 q 441 650 485 721 q 398 489 398 579 q 437 320 398 395 q 560 245 477 245 q 663 280 618 245 q 721 369 708 315 l 799 369 q 719 232 787 283 q 561 181 651 181 q 378 268 445 181 q 312 476 312 355 q 380 693 312 602 q 573 784 448 784 q 717 736 656 784 q 794 608 778 689 l 716 608 q 665 690 704 660 q 571 721 625 721 "},"ώ":{"x_min":12,"x_max":1090,"ha":1153,"o":"m 1090 384 q 985 102 1090 219 q 716 -15 880 -15 q 591 10 644 -15 q 500 94 539 36 q 405 13 459 41 q 285 -15 350 -15 q 89 73 166 -15 q 12 283 12 161 q 64 486 12 393 q 212 658 117 580 q 266 646 238 651 q 332 641 293 641 q 191 461 245 562 q 137 248 137 359 q 178 101 137 167 q 296 36 219 36 q 480 280 428 36 q 510 474 503 429 l 538 655 q 580 649 558 651 q 631 648 602 648 l 680 652 q 610 394 632 487 q 588 205 588 302 q 621 81 588 127 q 728 36 655 36 q 898 149 842 36 q 955 389 955 262 q 933 528 955 464 q 864 648 911 592 q 925 650 898 648 q 998 661 953 653 q 1067 534 1044 606 q 1090 384 1090 462 m 578 744 l 772 941 q 810 971 792 961 q 848 982 827 982 q 884 965 869 982 q 900 929 900 949 q 882 896 900 916 q 850 870 863 876 l 636 744 l 578 744 "},"≥":{"x_min":176.171875,"x_max":963,"ha":1139,"o":"m 963 463 l 176 196 l 176 266 l 847 493 l 176 718 l 176 788 l 963 520 l 963 463 m 963 26 l 176 26 l 176 93 l 963 93 l 963 26 "},"^":{"x_min":8,"x_max":402,"ha":335,"o":"m 352 744 l 242 888 l 75 744 l 8 744 l 215 978 l 291 978 l 402 744 l 352 744 "},"«":{"x_min":46,"x_max":575.171875,"ha":600,"o":"m 551 652 q 575 604 558 624 q 492 480 536 539 q 388 346 449 421 q 441 197 415 276 q 484 45 468 118 q 464 21 473 35 q 448 0 454 6 q 378 173 414 90 q 299 354 343 257 l 551 652 m 299 652 q 308 627 302 638 q 322 604 313 616 q 234 474 282 539 q 135 346 186 408 q 193 192 171 258 q 230 45 215 126 q 211 21 221 35 q 196 0 201 6 q 125 173 161 90 q 46 354 90 257 q 189 521 155 481 q 299 652 224 561 "},"D":{"x_min":11,"x_max":967,"ha":1011,"o":"m 195 931 l 294 933 l 538 933 q 850 833 734 933 q 967 538 967 733 q 780 140 967 280 q 326 0 593 0 l 115 4 l 11 4 q 98 323 62 179 q 165 639 134 466 q 195 931 195 812 m 298 62 q 676 192 523 62 q 829 544 829 322 q 742 786 829 697 q 502 876 656 876 q 403 873 473 876 q 329 870 333 870 q 236 494 283 728 q 165 71 190 260 q 231 66 187 71 q 298 62 276 62 "},"w":{"x_min":22.21875,"x_max":1036.109375,"ha":1015,"o":"m 22 656 q 91 647 54 647 q 156 655 125 647 q 187 411 169 536 q 229 149 205 287 l 330 333 q 408 485 370 407 q 483 655 445 563 q 537 647 508 647 q 586 655 565 647 q 611 448 586 569 q 648 266 636 327 l 676 125 l 773 307 q 858 487 825 412 q 925 655 891 563 q 949 650 936 652 q 972 647 962 648 q 1036 655 1004 647 q 846 317 944 493 q 683 0 748 141 q 654 3 672 0 q 633 6 637 6 q 608 3 625 6 q 586 0 591 0 q 554 182 569 108 q 488 512 540 256 q 233 0 359 269 l 186 5 q 160 3 175 5 q 136 0 145 1 q 22 656 94 330 "},"$":{"x_min":23,"x_max":679.953125,"ha":749,"o":"m 75 178 l 92 175 q 156 71 116 107 q 263 36 196 36 l 340 420 q 187 507 245 458 q 129 638 129 556 q 219 827 129 757 q 435 911 310 897 q 441 955 438 933 q 444 996 444 976 q 481 990 459 991 q 505 988 503 988 q 493 951 499 976 q 482 908 486 926 q 586 890 534 908 q 679 842 639 873 q 636 743 651 797 l 619 743 q 568 813 607 788 q 471 851 529 838 l 406 511 q 576 414 516 462 q 636 280 636 366 q 536 63 636 145 q 300 -18 437 -18 q 288 -83 293 -50 q 282 -146 282 -116 l 243 -141 l 221 -144 q 238 -84 229 -121 q 253 -18 248 -48 q 136 1 192 -18 q 23 60 81 21 q 56 119 43 92 q 75 178 68 145 m 518 239 q 481 336 518 296 q 382 402 444 376 l 310 33 q 456 93 394 33 q 518 239 518 153 m 426 855 q 292 806 349 855 q 236 681 236 758 q 271 589 236 627 q 360 532 306 551 l 426 855 "},"‧":{"x_min":155,"x_max":322,"ha":426,"o":"m 238 646 q 296 621 271 646 q 322 562 322 596 q 296 504 322 530 q 238 478 271 478 q 180 501 205 478 q 155 559 155 525 l 159 593 q 189 632 168 618 q 238 646 210 646 "},"\\":{"x_min":55,"x_max":311.109375,"ha":383,"o":"m 240 -125 l 55 1025 l 126 1024 l 311 -125 l 240 -125 "},"Ι":{"x_min":19.4375,"x_max":362.5,"ha":385,"o":"m 172 0 l 100 5 q 47 2 66 5 q 19 0 29 0 q 136 482 86 248 q 211 932 186 716 q 247 927 230 929 q 287 926 263 926 q 336 929 318 926 q 362 932 354 932 q 250 477 297 712 q 172 0 202 241 "},"Ύ":{"x_min":-39,"x_max":1180.453125,"ha":1069,"o":"m 658 380 q 578 583 601 526 q 513 740 555 641 q 433 931 471 840 q 475 927 466 927 q 509 926 484 926 q 553 929 521 926 q 587 931 584 931 q 634 772 615 830 q 756 450 653 715 l 904 674 q 979 800 938 730 q 1051 931 1020 869 l 1109 926 q 1154 929 1138 926 q 1180 931 1170 931 l 1073 794 l 980 663 l 784 387 l 754 236 q 720 0 731 117 q 679 4 702 1 q 644 6 656 6 q 603 4 619 6 q 567 0 587 2 q 620 199 597 90 q 658 380 642 308 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 235 870 247 876 l 19 744 l -39 744 "},"’":{"x_min":108.71875,"x_max":393.4375,"ha":375,"o":"m 254 876 q 285 929 265 910 q 336 949 304 949 q 378 939 362 949 q 393 903 393 929 q 384 867 393 885 q 358 829 375 850 l 137 543 l 108 556 l 254 876 "},"Ν":{"x_min":2.78125,"x_max":1000,"ha":1001,"o":"m 68 252 l 126 504 q 176 729 156 625 q 208 945 195 833 q 235 938 228 938 q 249 940 240 938 q 265 945 259 943 q 413 714 345 815 q 575 474 480 612 q 762 208 670 335 l 844 624 q 872 777 858 691 q 894 931 886 862 l 943 926 q 974 928 958 926 q 1000 931 990 930 q 884 460 934 690 q 795 -12 834 230 q 784 -9 793 -11 q 769 -6 776 -7 q 745 -12 752 -8 q 530 315 641 159 l 244 719 l 179 412 q 139 203 158 311 q 108 0 120 95 q 78 3 97 0 q 55 6 59 6 q 25 3 41 6 q 2 0 8 0 l 68 252 "},"-":{"x_min":15.28125,"x_max":380.5625,"ha":446,"o":"m 41 391 q 126 388 69 391 q 212 385 183 385 q 295 388 240 385 q 380 391 351 391 q 365 337 372 368 q 355 271 359 306 q 256 275 316 271 q 187 279 197 279 q 90 275 151 279 q 15 271 29 271 q 31 327 26 304 q 41 391 36 350 "},"Q":{"x_min":46,"x_max":1063,"ha":1103,"o":"m 321 6 q 117 149 189 41 q 46 398 46 256 q 212 789 46 626 q 605 953 378 953 q 933 842 804 953 q 1063 534 1063 732 q 989 262 1063 390 q 791 59 915 134 q 708 24 754 40 q 605 -7 662 8 q 809 -53 698 -30 q 1008 -90 921 -76 l 1008 -98 q 983 -144 994 -118 q 965 -194 972 -169 q 674 -82 768 -116 q 460 -16 581 -47 q 321 6 394 -11 m 186 413 q 261 147 186 250 q 494 44 337 44 q 804 194 686 44 q 923 539 923 344 q 836 787 923 685 q 605 890 750 890 q 336 778 444 890 q 211 571 229 667 q 189 451 192 476 q 186 413 186 427 "},"ς":{"x_min":28,"x_max":640.5,"ha":674,"o":"m 475 -61 q 336 13 470 -29 q 115 115 202 56 q 28 302 28 173 q 135 564 28 459 q 403 669 243 669 q 523 651 465 669 q 640 599 582 633 l 606 494 l 581 494 q 506 583 554 548 q 403 618 458 618 q 228 538 297 618 q 159 350 159 458 q 268 172 159 229 q 478 100 371 138 q 585 -17 585 63 q 546 -127 585 -76 q 446 -227 508 -177 l 404 -191 q 455 -131 436 -163 q 475 -61 475 -100 "},"M":{"x_min":1.390625,"x_max":1138.890625,"ha":1168,"o":"m 213 932 q 251 929 224 932 q 280 926 279 926 q 315 928 295 926 q 345 932 334 930 q 356 876 349 907 q 370 815 363 844 l 444 539 l 538 188 l 784 568 q 1011 932 897 750 l 1069 926 q 1106 928 1086 926 q 1138 932 1126 930 q 1035 471 1087 751 q 965 0 983 191 q 919 3 947 0 q 887 6 891 6 q 844 3 872 6 q 808 0 816 0 q 856 176 833 87 q 898 362 879 265 l 980 761 l 670 269 l 593 145 q 557 84 577 122 q 510 0 536 47 l 464 0 q 394 252 429 126 q 324 504 359 379 q 254 757 288 630 l 193 461 q 148 224 170 349 q 113 0 126 98 l 59 5 q 31 2 51 5 q 1 0 12 0 q 125 468 68 220 q 213 932 183 716 "},"Ψ":{"x_min":94,"x_max":1084.28125,"ha":1067,"o":"m 628 926 q 669 929 641 926 q 702 933 698 933 q 632 665 662 796 q 566 345 603 535 q 630 347 605 345 q 721 362 656 349 q 836 472 785 375 q 910 715 887 569 q 937 933 923 823 l 1009 926 l 1084 933 q 1010 592 1048 761 q 878 342 973 422 q 550 262 784 262 q 531 150 544 223 q 512 0 519 77 l 444 5 q 413 4 424 5 q 363 0 402 4 q 397 130 374 38 q 431 267 420 222 q 198 332 302 267 q 94 520 94 398 l 97 595 l 130 777 l 154 933 l 222 926 l 300 929 l 252 726 q 230 616 239 675 q 222 511 222 557 q 288 385 222 425 q 449 345 355 345 q 489 547 469 442 q 526 747 510 653 q 552 933 542 841 q 589 929 564 933 q 628 926 614 926 "},"C":{"x_min":43,"x_max":916.609375,"ha":876,"o":"m 609 889 q 300 747 417 889 q 183 411 183 605 q 257 147 183 251 q 487 43 331 43 q 653 80 576 43 q 808 186 730 117 l 819 173 q 794 111 805 145 q 776 43 783 77 q 628 -2 702 13 q 479 -18 554 -18 q 323 0 406 -18 q 116 148 190 36 q 43 402 43 259 q 210 791 43 629 q 605 953 377 953 q 766 934 684 953 q 916 883 848 916 q 887 825 901 859 q 869 761 874 791 l 851 761 q 609 889 767 889 "},"œ":{"x_min":9,"x_max":1154.84375,"ha":1204,"o":"m 678 265 q 725 109 678 171 q 862 47 772 47 q 974 76 918 47 q 1079 155 1029 106 l 1095 140 q 1063 50 1075 100 q 954 0 1010 17 q 842 -18 899 -18 q 697 12 764 -18 q 591 107 630 43 q 308 -18 483 -18 q 92 61 175 -18 q 9 274 9 140 q 120 552 9 432 q 387 672 231 672 q 651 551 551 672 q 773 642 712 612 q 914 672 835 672 q 1088 596 1021 672 q 1154 414 1154 521 l 1152 336 l 917 336 l 683 336 q 678 265 678 306 m 134 234 q 177 93 134 152 q 301 35 221 35 q 500 157 432 35 q 568 422 568 280 q 522 563 568 506 q 394 621 476 621 q 245 551 305 621 q 159 394 185 481 q 134 234 134 308 m 867 389 l 1031 389 l 1035 460 q 1001 572 1035 523 q 904 621 967 621 q 774 551 824 621 q 700 389 724 482 l 867 389 "},"!":{"x_min":62,"x_max":373,"ha":446,"o":"m 149 -13 q 86 10 111 -13 q 62 71 62 34 q 86 130 62 105 q 145 155 111 155 q 205 130 181 155 q 230 70 230 106 q 216 18 230 50 q 149 -13 203 -13 m 217 825 q 236 909 217 872 q 297 946 256 946 q 350 929 328 946 q 373 884 373 912 q 364 836 373 863 q 349 784 356 809 l 186 248 l 149 248 l 217 825 "},"ç":{"x_min":11,"x_max":613.78125,"ha":626,"o":"m 308 -18 q 95 63 180 -18 q 11 274 11 145 q 119 551 11 434 q 387 669 227 669 q 495 657 447 669 q 613 616 542 645 q 590 556 599 583 q 575 501 580 529 l 554 501 q 489 586 530 554 q 392 618 448 618 q 206 503 273 618 q 140 258 140 388 q 185 107 140 169 q 316 46 230 46 q 433 69 376 46 q 522 139 490 93 l 542 123 q 509 34 522 80 q 410 -4 461 9 q 308 -18 359 -18 m 117 -205 q 198 -235 165 -225 q 266 -246 231 -246 q 327 -234 302 -246 q 353 -190 353 -222 q 339 -147 353 -166 q 302 -126 325 -128 q 253 -128 274 -126 q 217 -133 231 -131 l 261 -1 l 307 -1 l 281 -81 q 302 -76 290 -77 q 327 -75 313 -75 q 413 -105 377 -75 q 449 -183 449 -135 q 404 -273 449 -242 q 298 -304 359 -304 q 208 -293 245 -304 q 117 -256 170 -283 l 117 -205 "},"{":{"x_min":116,"x_max":567.390625,"ha":683,"o":"m 490 911 q 420 872 445 905 q 395 794 395 838 l 395 745 l 395 583 q 367 434 395 491 q 263 352 340 376 q 366 272 338 331 q 395 124 395 213 l 395 -36 q 412 -151 395 -110 q 470 -199 429 -192 q 529 -206 511 -206 q 567 -206 547 -206 l 567 -277 q 386 -240 458 -277 q 314 -107 314 -204 l 314 -29 l 314 130 q 295 244 314 194 q 224 306 276 294 q 161 317 192 316 q 116 318 129 318 l 116 389 q 268 429 223 389 q 314 577 314 470 l 314 737 q 338 903 314 842 q 449 977 363 963 q 567 983 503 983 l 567 914 l 490 911 "},"X":{"x_min":-95.828125,"x_max":784.71875,"ha":699,"o":"m 154 287 l 301 465 l 183 712 l 125 836 l 70 932 l 148 926 q 200 929 182 926 q 229 931 219 931 q 269 824 245 881 q 309 729 293 766 l 381 561 l 494 718 q 641 931 572 820 l 704 926 q 756 929 737 926 q 784 931 775 931 q 675 820 725 875 q 559 690 625 765 l 408 506 l 547 201 q 645 0 593 98 l 586 5 l 485 0 q 455 92 468 55 q 417 187 442 129 l 328 403 l 177 197 q 119 115 147 156 q 44 0 91 73 l -13 5 q -45 4 -34 5 q -95 0 -56 4 q 15 122 -22 79 q 154 287 52 166 "},"ô":{"x_min":9,"x_max":697,"ha":761,"o":"m 370 669 q 605 596 514 669 q 697 383 697 524 q 591 105 697 225 q 332 -15 485 -15 q 97 57 186 -15 q 9 274 9 130 q 15 348 9 320 q 52 455 22 376 q 170 601 81 534 q 370 669 259 669 m 576 744 l 466 888 l 298 744 l 231 744 l 437 978 l 516 978 l 626 744 l 576 744 m 134 234 q 177 94 134 152 q 302 36 221 36 q 500 157 432 36 q 569 421 569 279 q 523 561 569 504 q 395 618 477 618 q 245 548 306 618 q 159 393 185 479 q 134 234 134 307 "},"#":{"x_min":78,"x_max":972.4375,"ha":1050,"o":"m 499 647 l 675 647 l 792 971 l 877 970 l 763 647 l 972 647 l 947 578 l 736 578 l 669 390 l 896 390 l 873 321 l 644 321 l 531 0 l 446 0 l 559 321 l 381 321 l 266 0 l 182 0 l 295 321 l 78 321 l 101 390 l 321 390 l 385 578 l 153 578 l 176 647 l 411 647 l 526 971 l 610 971 l 499 647 m 471 578 l 408 390 l 587 390 l 650 578 l 471 578 "},"ι":{"x_min":8,"x_max":271.890625,"ha":335,"o":"m 128 656 q 201 648 166 648 q 271 655 238 648 q 185 311 217 474 q 153 0 153 148 q 117 3 134 1 q 77 5 99 5 l 8 0 q 70 230 45 130 q 112 442 95 330 q 128 656 128 554 "},"Ά":{"x_min":-89,"x_max":757,"ha":808,"o":"m 495 956 l 525 947 l 558 956 q 625 544 608 641 q 675 297 641 447 q 757 0 708 148 q 713 3 741 0 q 677 6 686 6 q 627 4 648 6 q 593 0 606 1 q 574 186 593 80 q 545 349 555 292 l 390 354 l 233 349 l 156 213 q 97 108 126 162 q 40 0 68 55 q 1 3 24 0 q -25 6 -22 6 q -62 4 -45 6 q -89 0 -79 1 q 233 486 66 217 q 495 956 399 754 m 3 744 l 198 941 q 235 970 216 959 q 273 982 254 982 q 311 966 294 982 q 327 929 327 951 q 308 897 327 918 q 277 870 288 876 l 61 744 l 3 744 m 389 417 l 530 421 l 464 762 l 266 421 l 389 417 "},")":{"x_min":-115.28125,"x_max":296,"ha":372,"o":"m 207 572 q 178 767 207 669 q 98 943 150 864 l 140 963 q 255 748 215 860 q 296 515 296 636 q 194 141 296 312 q -81 -156 93 -29 l -115 -128 q 124 179 41 -7 q 207 572 207 365 "},"ε":{"x_min":32,"x_max":559.78125,"ha":642,"o":"m 533 512 q 459 586 502 558 q 367 615 416 615 q 277 582 315 615 q 240 497 240 549 q 286 405 240 430 q 415 369 333 381 q 408 329 408 351 l 408 309 q 361 315 398 310 q 318 321 324 321 q 209 283 254 321 q 165 182 165 246 q 215 78 165 115 q 334 42 265 42 q 442 66 394 42 q 544 139 490 91 q 532 41 532 93 q 319 -15 434 -15 q 120 32 208 -15 q 32 182 32 80 q 81 302 32 255 q 207 367 130 348 q 141 427 166 391 q 115 508 115 463 q 183 628 115 587 q 337 669 251 669 q 452 650 394 669 q 559 598 511 631 q 544 560 550 578 q 533 512 538 541 "},"Δ":{"x_min":-98,"x_max":760,"ha":833,"o":"m 760 0 q 544 3 687 0 q 329 8 401 8 q 114 3 257 8 q -98 0 -28 0 q 212 458 57 219 q 505 932 367 697 l 552 932 q 642 479 592 702 q 760 0 693 255 m 333 73 l 367 73 q 600 84 496 73 q 472 722 545 391 q 331 522 396 620 q 202 321 265 424 q 62 84 139 217 q 190 75 116 78 q 333 73 265 73 "},"â":{"x_min":-11,"x_max":572.328125,"ha":642,"o":"m 161 -14 q 38 29 88 -14 q -11 147 -11 72 q 97 317 -11 270 q 310 374 199 344 q 433 492 420 404 q 403 583 433 549 q 315 618 373 618 q 210 591 255 618 q 134 512 165 565 l 111 519 q 122 581 122 549 l 119 618 q 235 661 195 651 q 315 672 275 672 q 472 633 405 672 q 539 511 539 594 q 532 434 539 479 q 525 375 526 390 l 477 143 q 469 92 473 117 q 482 63 469 78 q 508 48 494 48 q 554 58 529 48 l 572 23 q 452 -10 519 -10 q 386 15 408 -10 q 358 90 365 41 q 266 11 310 37 q 161 -14 222 -14 m 492 744 l 383 888 l 213 744 l 149 744 l 354 978 l 432 978 l 539 744 l 492 744 m 103 159 q 131 86 103 115 q 204 58 159 58 q 311 99 259 58 q 375 194 363 140 l 402 345 q 176 283 250 313 q 103 159 103 254 "},"}":{"x_min":115,"x_max":566,"ha":683,"o":"m 368 577 q 404 437 368 486 q 528 389 440 389 l 566 389 l 566 318 q 414 277 461 318 q 368 130 368 237 l 368 -29 q 319 -231 368 -185 q 115 -277 271 -277 l 115 -206 q 241 -182 196 -206 q 287 -83 287 -158 l 287 -36 l 287 124 q 313 272 287 215 q 417 352 340 329 q 311 432 335 380 q 287 583 287 485 l 287 746 q 269 860 287 817 q 191 914 252 902 l 115 914 l 115 983 q 317 939 266 983 q 368 815 368 896 l 368 737 l 368 577 "},"‰":{"x_min":47,"x_max":1518,"ha":1578,"o":"m 202 -124 l 121 -125 l 844 1015 l 924 1015 l 202 -124 m 1010 230 q 936 54 1010 126 q 757 -18 862 -18 q 625 31 677 -18 q 573 161 573 80 q 647 336 573 262 q 824 411 721 411 q 949 368 898 411 q 1010 254 1000 326 l 1010 230 m 488 731 q 414 551 488 627 q 235 475 341 475 q 99 526 152 475 q 47 662 47 577 q 122 837 47 763 q 298 911 197 911 q 422 870 375 911 q 488 752 469 829 l 488 731 m 1518 234 q 1444 55 1518 129 q 1265 -18 1370 -18 q 1130 30 1181 -18 q 1079 163 1079 79 q 1153 338 1079 265 q 1331 411 1228 411 q 1456 368 1405 411 q 1518 254 1508 326 l 1518 234 m 673 119 q 695 46 673 75 q 762 17 718 17 q 870 96 834 17 q 907 255 907 175 q 888 338 907 305 q 818 372 870 372 q 715 304 751 372 q 673 157 680 236 l 673 119 m 150 627 q 172 549 150 584 q 234 514 194 514 q 345 591 309 514 q 382 753 382 669 q 361 836 382 803 q 293 869 341 869 q 191 801 225 869 q 150 655 156 734 l 150 627 m 1180 119 q 1202 45 1180 73 q 1269 17 1224 17 q 1377 96 1341 17 q 1414 256 1414 176 q 1393 338 1414 304 q 1327 372 1373 372 q 1224 306 1259 372 q 1181 157 1190 240 l 1180 119 "},"Ä":{"x_min":-90,"x_max":757,"ha":810,"o":"m 496 956 l 526 948 l 560 956 q 612 629 585 796 q 675 301 640 462 q 757 0 711 140 q 713 3 741 0 q 677 6 686 6 q 628 4 649 6 q 593 0 606 1 q 574 185 593 78 q 545 349 555 291 l 392 354 l 232 349 l 157 215 q 79 78 83 85 q 39 0 75 70 q 4 3 26 0 q -24 6 -17 6 q -61 4 -44 6 q -90 0 -78 1 q 121 308 8 135 q 333 650 233 480 q 496 956 432 819 m 438 1204 q 486 1181 467 1204 q 509 1129 509 1159 q 486 1079 509 1098 q 436 1061 464 1061 q 385 1081 407 1061 q 363 1131 363 1102 q 385 1183 363 1162 q 438 1204 407 1204 m 670 1204 q 720 1181 698 1204 q 743 1130 743 1159 q 720 1081 743 1101 q 670 1061 698 1061 q 620 1081 641 1061 q 600 1131 600 1102 q 620 1182 600 1160 q 670 1204 640 1204 m 392 418 q 460 418 414 418 q 531 418 505 418 l 467 762 l 267 418 q 329 418 287 418 q 392 418 371 418 "},"a":{"x_min":-12,"x_max":574.109375,"ha":640,"o":"m 163 -14 q 38 29 89 -14 q -12 145 -12 72 q 96 316 -12 270 q 311 372 200 342 q 434 492 421 402 q 402 583 434 549 q 314 618 371 618 q 135 513 194 618 l 113 519 q 119 550 117 536 q 122 583 122 565 l 121 618 q 222 658 181 645 q 314 672 264 672 q 472 633 404 672 q 541 509 541 594 q 535 444 541 483 q 522 376 529 405 l 478 143 q 469 91 474 117 q 482 63 469 78 q 507 46 494 47 q 528 49 517 46 q 554 57 540 52 l 574 20 q 454 -14 517 -14 q 388 13 410 -14 q 357 89 367 40 q 267 11 311 37 q 163 -14 222 -14 m 102 161 q 131 86 102 115 q 205 57 160 57 q 312 98 260 57 q 375 194 363 140 l 404 347 q 174 284 247 313 q 102 161 102 254 "},"—":{"x_min":194.4375,"x_max":1116.671875,"ha":1365,"o":"m 208 374 l 1116 374 l 1105 290 l 194 290 l 208 374 "},"=":{"x_min":169.4375,"x_max":969.453125,"ha":1139,"o":"m 969 499 l 169 499 l 169 564 l 969 564 l 969 499 m 969 248 l 169 248 l 169 315 l 969 315 l 969 248 "},"N":{"x_min":2.78125,"x_max":1000,"ha":1001,"o":"m 68 252 l 126 504 q 176 729 156 625 q 208 945 195 833 q 235 938 228 938 q 249 940 240 938 q 265 945 259 943 q 413 714 345 815 q 575 474 480 612 q 762 208 670 335 l 844 624 q 872 777 858 691 q 894 931 886 862 l 943 926 q 974 928 958 926 q 1000 931 990 930 q 884 460 934 690 q 795 -12 834 230 q 784 -9 793 -11 q 769 -6 776 -7 q 745 -12 752 -8 q 530 315 641 159 l 244 719 l 179 412 q 139 203 158 311 q 108 0 120 95 q 78 3 97 0 q 55 6 59 6 q 25 3 41 6 q 2 0 8 0 l 68 252 "},"ρ":{"x_min":-81.9375,"x_max":696,"ha":761,"o":"m 113 -25 q 81 -189 97 -103 q 50 -372 66 -274 q 22 -367 38 -370 q -12 -365 5 -365 q -45 -367 -27 -365 q -81 -372 -62 -370 q -6 -77 -37 -210 q 50 209 23 55 q 102 447 76 362 q 196 601 127 533 q 394 669 265 669 q 609 587 522 669 q 696 380 696 506 q 594 107 696 228 q 345 -14 493 -14 q 224 24 277 -14 q 144 126 170 62 l 113 -25 m 176 243 q 213 109 176 158 q 333 60 251 60 q 512 172 450 60 q 574 412 574 284 q 537 553 574 491 q 426 615 500 615 q 270 537 333 615 q 194 388 208 460 q 178 295 180 315 q 176 243 176 276 "},"2":{"x_min":-5,"x_max":653,"ha":749,"o":"m 318 99 q 460 106 361 99 q 590 114 559 114 q 577 36 577 72 l 577 0 l 296 7 q 119 3 226 7 q -5 0 11 0 l 0 51 q 224 240 105 138 q 429 458 343 341 q 515 690 515 576 q 475 806 515 759 q 366 854 435 854 q 261 815 304 854 q 196 713 218 777 l 174 713 q 156 754 168 733 q 129 794 144 775 q 389 910 238 910 q 578 849 503 910 q 653 676 653 789 q 569 464 653 568 q 363 269 485 361 q 138 99 242 176 l 318 99 "},"ü":{"x_min":43,"x_max":709.65625,"ha":767,"o":"m 587 0 l 527 6 q 491 3 511 6 q 460 0 471 1 q 475 50 465 13 q 496 130 486 86 q 378 21 441 58 q 231 -15 315 -15 q 97 30 152 -15 q 43 155 43 76 q 71 383 43 239 q 124 655 99 528 q 162 648 140 651 q 190 645 184 645 q 256 655 223 650 q 187 379 206 467 q 168 186 168 291 q 190 104 168 136 q 259 66 212 71 q 497 214 449 66 q 574 655 545 363 q 611 649 591 651 q 643 647 630 647 q 674 650 654 647 q 709 655 695 653 q 625 320 663 511 q 587 0 587 129 m 333 924 q 384 903 359 924 q 397 879 391 892 q 404 849 404 867 q 392 807 404 825 q 374 792 388 804 q 333 781 360 781 q 282 802 304 781 q 261 853 261 824 q 282 903 261 883 q 333 924 304 924 m 568 924 q 619 903 595 924 q 632 879 626 892 q 638 849 638 867 q 627 807 638 825 q 611 792 623 804 q 568 781 598 781 q 517 802 538 781 q 496 853 496 824 q 517 903 496 883 q 568 924 538 924 "},"Z":{"x_min":-26.390625,"x_max":815.28125,"ha":785,"o":"m -26 24 q 311 448 158 251 q 623 865 465 645 l 454 862 q 308 855 379 862 q 140 839 237 849 q 152 879 148 862 q 159 932 155 896 q 315 929 205 932 q 433 926 425 926 l 540 926 l 815 932 l 815 915 q 609 651 695 763 q 411 394 522 538 q 168 72 301 250 l 330 75 q 500 80 423 75 q 745 101 577 85 q 728 56 736 84 q 718 0 720 27 q 486 4 640 0 q 254 8 331 8 q 118 7 183 8 q -26 0 54 6 l -26 24 "},"u":{"x_min":43,"x_max":708.265625,"ha":765,"o":"m 587 0 l 526 6 q 491 3 511 6 q 461 0 472 1 q 494 129 484 62 q 378 22 441 59 q 233 -14 315 -14 q 97 30 151 -14 q 43 155 43 75 q 68 360 43 225 q 125 656 93 494 q 188 645 161 645 q 221 648 204 645 q 256 656 238 651 q 187 381 207 471 q 167 185 167 290 q 189 104 167 136 q 261 66 212 71 q 497 214 450 66 q 574 656 545 363 q 641 647 606 647 q 708 656 674 647 q 625 318 663 510 q 587 0 587 126 "},"k":{"x_min":4.171875,"x_max":673.609375,"ha":663,"o":"m 188 1025 q 217 1020 204 1022 q 252 1018 230 1018 q 277 1018 265 1018 q 323 1025 288 1019 l 297 927 l 258 719 l 197 386 l 220 383 q 374 493 304 429 q 534 655 444 556 q 606 648 573 648 q 670 655 633 648 l 673 640 q 581 579 641 620 q 466 497 522 537 l 318 387 q 608 0 451 195 q 565 3 594 0 q 529 6 536 6 q 482 4 502 6 q 450 0 462 1 q 331 177 383 104 q 213 337 280 251 l 186 336 q 160 172 173 262 q 136 0 147 83 q 100 3 125 0 q 70 6 76 6 q 31 3 55 6 q 4 0 6 0 q 188 1025 143 506 "},"Η":{"x_min":13.890625,"x_max":997,"ha":1011,"o":"m 275 927 l 352 932 q 317 811 330 865 q 258 533 304 758 l 509 529 l 780 533 l 809 684 q 837 819 827 761 q 848 932 848 877 q 891 928 864 932 q 923 925 917 925 q 965 928 938 925 q 997 932 992 932 q 880 477 928 716 q 808 0 831 237 l 737 5 q 706 4 718 5 q 659 0 694 4 q 696 143 675 55 q 729 283 718 231 l 766 462 l 505 465 l 244 465 l 212 312 q 189 185 200 245 q 161 0 179 125 l 90 5 q 60 4 72 5 q 13 0 48 4 q 123 450 70 186 q 202 932 176 715 l 275 927 "},"Α":{"x_min":-89,"x_max":757,"ha":808,"o":"m 495 956 l 525 947 l 558 956 q 625 544 608 641 q 675 297 641 447 q 757 0 708 148 q 713 3 741 0 q 677 6 686 6 q 627 4 648 6 q 593 0 606 1 q 574 186 593 80 q 545 349 555 292 l 390 354 l 233 349 l 156 213 q 97 108 126 162 q 40 0 67 55 q 1 3 24 0 q -25 6 -22 6 q -62 4 -45 6 q -89 0 -79 1 q 233 486 66 217 q 495 956 399 754 m 389 417 l 530 421 l 464 762 l 266 421 l 389 417 "},"ß":{"x_min":8,"x_max":685,"ha":747,"o":"m 49 187 q 109 550 76 351 q 219 887 142 750 q 459 1025 295 1025 q 609 984 544 1025 q 675 862 675 943 q 575 702 675 781 q 475 580 475 623 q 580 440 475 534 q 685 266 685 346 q 592 74 685 155 q 386 -6 500 -6 q 257 30 322 -6 q 271 88 262 58 q 292 153 279 119 q 346 82 314 107 q 428 57 378 57 q 531 104 489 57 q 574 216 574 152 q 469 376 574 290 q 365 532 365 463 q 476 685 365 596 q 587 856 587 774 q 550 941 587 908 q 459 974 513 974 q 308 885 342 974 q 242 604 274 796 l 185 285 q 161 142 176 234 q 141 0 146 51 q 74 10 107 4 q 39 6 55 10 q 8 0 24 2 l 49 187 "},"é":{"x_min":9,"x_max":616,"ha":664,"o":"m 142 236 q 192 100 142 153 q 322 47 242 47 q 433 77 376 47 q 538 155 490 108 l 553 140 q 536 95 545 119 q 524 50 528 70 q 415 0 471 17 q 302 -18 360 -18 q 89 61 170 -18 q 9 273 9 140 q 114 550 9 431 q 377 669 220 669 q 547 594 479 669 q 616 418 616 520 q 613 382 616 403 q 610 336 611 360 l 379 336 l 147 336 q 142 236 142 292 m 274 743 l 467 942 q 504 970 486 960 q 543 981 521 981 q 581 966 564 981 q 599 930 599 951 q 580 897 599 916 q 545 869 561 878 l 331 743 l 274 743 m 324 389 l 488 389 q 495 452 495 426 q 460 567 495 516 q 364 618 426 618 q 232 550 282 618 q 159 389 182 483 l 324 389 "},"s":{"x_min":-23,"x_max":468.734375,"ha":526,"o":"m 42 179 q 91 79 50 118 q 196 41 133 41 q 293 72 251 41 q 335 158 335 104 q 195 303 335 240 q 55 463 55 365 q 122 612 55 555 q 284 669 189 669 q 380 657 334 669 q 468 620 427 646 q 434 509 447 570 l 416 509 q 364 589 396 563 q 277 616 332 616 q 196 581 234 616 q 159 503 159 546 q 300 371 159 435 q 441 217 441 306 q 366 48 441 112 q 184 -15 292 -15 q 72 2 129 -15 q -23 51 15 19 q -5 115 -14 84 q 17 179 3 145 l 42 179 "},"B":{"x_min":12,"x_max":718,"ha":760,"o":"m 202 933 l 303 927 q 390 930 328 927 q 455 933 451 933 q 640 887 562 933 q 718 744 718 842 q 639 577 718 634 q 438 498 560 519 q 611 439 544 488 q 679 291 679 390 q 572 79 679 158 q 328 0 466 0 l 130 4 l 12 4 q 119 442 71 203 q 202 933 166 682 m 593 727 q 547 844 593 801 q 427 887 501 887 q 377 884 405 887 q 325 878 349 881 q 285 708 307 812 q 248 521 263 605 q 493 561 394 521 q 593 727 593 601 m 259 55 q 460 114 373 55 q 548 282 548 174 q 486 420 548 373 q 328 468 424 468 l 238 468 q 193 253 211 347 q 163 60 175 160 q 223 56 203 57 q 259 55 242 55 "},"…":{"x_min":62,"x_max":945,"ha":1160,"o":"m 135 134 q 185 113 164 134 q 206 62 206 92 q 185 13 206 34 q 135 -7 164 -7 q 83 13 104 -7 q 62 62 62 33 q 70 88 62 77 q 135 134 86 134 m 505 134 q 555 112 534 134 q 577 62 577 91 q 555 13 577 33 q 505 -7 534 -7 q 453 12 474 -7 q 433 62 433 31 l 437 88 q 505 134 460 134 m 875 134 q 924 113 903 134 q 945 62 945 92 q 925 13 945 34 q 875 -7 906 -7 q 823 13 845 -7 q 802 62 802 33 q 807 88 802 78 q 875 134 825 134 "},"?":{"x_min":130,"x_max":545,"ha":600,"o":"m 214 155 q 283 124 271 155 q 296 86 295 93 q 298 68 298 80 q 296 50 298 57 q 288 30 295 43 q 259 1 282 16 q 210 -13 236 -13 q 154 9 178 -13 q 130 70 130 32 q 144 121 130 88 q 214 155 159 155 m 318 235 q 197 278 246 235 q 148 394 148 322 q 222 542 148 476 q 361 646 292 593 q 438 792 438 713 q 408 866 438 836 q 332 896 378 896 q 272 879 299 896 q 211 833 245 863 l 195 835 l 200 883 l 199 926 q 336 947 260 947 q 484 896 424 947 q 545 759 545 845 q 470 590 545 661 q 320 482 397 537 q 237 364 243 426 q 260 306 237 325 q 323 288 284 288 q 357 293 342 288 l 341 235 l 318 235 "},"H":{"x_min":13.890625,"x_max":998.609375,"ha":1011,"o":"m 204 932 l 273 926 q 318 929 287 926 q 351 932 350 932 q 320 823 333 876 q 258 533 308 770 l 508 529 l 779 533 l 809 684 q 838 818 827 761 q 848 931 848 876 q 890 927 869 929 q 918 925 912 925 q 960 927 943 925 q 998 932 977 929 q 884 490 931 727 q 806 0 837 252 l 736 5 q 698 2 723 5 q 659 0 673 0 q 697 143 681 81 q 727 282 712 204 l 765 464 l 505 465 l 244 465 l 212 311 q 162 0 184 164 q 125 4 148 1 q 90 6 101 6 q 46 3 73 6 q 13 0 19 0 q 121 445 69 184 q 204 932 173 705 "},"ν":{"x_min":23,"x_max":602,"ha":657,"o":"m 238 290 l 275 130 q 401 320 338 225 q 470 536 470 438 q 449 641 470 590 q 586 660 511 641 q 599 603 597 614 q 602 576 602 593 q 553 424 602 505 q 404 199 504 343 q 278 0 303 56 q 228 8 253 3 q 204 5 217 8 q 177 0 191 2 q 134 215 157 115 q 82 430 111 316 q 23 652 52 544 q 117 647 63 647 l 170 651 q 194 479 178 563 q 238 290 210 395 "},"î":{"x_min":8,"x_max":402.671875,"ha":335,"o":"m 130 654 q 167 650 146 652 q 200 647 188 647 q 239 649 224 647 q 274 654 255 651 q 184 310 216 469 q 152 0 152 152 q 114 4 138 1 q 82 6 91 6 q 61 6 71 6 q 8 0 51 5 q 66 218 38 102 q 112 446 94 333 q 130 654 130 559 m 352 744 l 242 888 l 75 744 l 8 744 l 215 978 l 291 978 l 402 744 l 352 744 "},"c":{"x_min":12,"x_max":613.390625,"ha":626,"o":"m 306 -15 q 96 66 180 -15 q 12 273 12 147 q 119 551 12 434 q 385 669 227 669 q 498 655 442 669 q 613 614 553 641 q 590 556 599 584 q 576 499 581 529 l 554 499 q 487 584 527 553 q 391 616 447 616 q 205 503 270 616 q 140 261 140 391 q 185 111 140 175 q 314 48 231 48 q 432 71 374 48 q 520 140 489 94 l 542 124 q 522 81 530 98 q 507 37 514 63 q 306 -15 413 -15 "},"¶":{"x_min":173,"x_max":736.890625,"ha":590,"o":"m 503 968 l 736 968 l 724 910 l 666 910 l 473 4 l 415 4 l 607 910 l 498 909 l 306 3 l 247 4 l 364 558 q 227 602 281 558 q 173 718 173 645 q 264 882 173 797 q 503 968 356 968 "},"β":{"x_min":-91,"x_max":735,"ha":792,"o":"m -15 -366 q -52 -366 -34 -366 q -91 -372 -71 -366 q -24 -109 -50 -226 q 43 208 2 6 q 124 618 85 410 q 252 926 163 827 q 471 1025 342 1025 q 655 963 576 1025 q 735 798 735 901 q 679 630 735 700 q 527 528 624 561 q 646 437 602 494 q 690 300 690 379 q 599 77 690 169 q 378 -14 509 -14 q 246 14 305 -14 q 145 103 186 43 q 88 -138 113 -16 q 50 -372 63 -260 q 22 -368 41 -370 q -15 -366 3 -366 m 340 567 l 396 567 q 565 634 512 567 q 618 825 618 701 q 580 930 618 887 q 479 974 543 974 q 387 944 439 974 q 287 777 336 915 q 211 478 238 638 q 184 220 184 317 q 228 95 184 146 q 346 44 273 44 q 506 135 449 44 q 564 336 564 227 q 511 461 564 419 q 371 503 459 503 l 327 503 l 340 567 "},"Μ":{"x_min":1.390625,"x_max":1138.890625,"ha":1168,"o":"m 213 932 q 251 929 224 932 q 280 926 279 926 q 315 928 295 926 q 345 932 334 930 q 356 876 349 907 q 370 815 363 844 l 444 539 l 538 188 l 784 568 q 1011 932 897 750 l 1069 926 q 1106 928 1086 926 q 1138 932 1126 930 q 1035 471 1087 751 q 965 0 983 191 q 919 3 947 0 q 887 6 891 6 q 844 3 872 6 q 808 0 816 0 q 856 176 833 87 q 898 362 879 265 l 980 761 l 670 269 l 593 145 q 557 84 577 122 q 510 0 536 47 l 464 0 q 394 252 429 126 q 324 504 359 379 q 254 757 288 630 l 193 461 q 148 224 170 349 q 113 0 126 98 l 59 5 q 31 2 51 5 q 1 0 12 0 q 125 468 68 220 q 213 932 183 716 "},"Ό":{"x_min":-39,"x_max":1226,"ha":1269,"o":"m 781 953 q 1097 847 969 953 q 1226 555 1226 741 q 1059 150 1226 318 q 655 -18 892 -18 q 335 88 461 -18 q 210 387 210 195 q 237 572 210 440 q 420 828 264 704 q 781 953 577 953 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 235 870 247 876 l 19 744 l -39 744 m 772 888 q 467 735 583 888 q 352 386 352 583 q 433 139 352 236 q 662 43 515 43 q 968 189 851 43 q 1086 529 1086 336 q 1076 651 1086 596 q 1033 763 1066 705 q 929 854 1001 821 q 772 888 858 888 "},"Ή":{"x_min":-39,"x_max":1234.609375,"ha":1247,"o":"m 440 931 l 509 926 q 554 929 523 926 q 587 931 586 931 q 556 823 569 876 q 494 533 544 770 l 744 529 l 1015 533 l 1045 684 q 1074 818 1063 761 q 1084 931 1084 876 q 1126 927 1105 929 q 1154 925 1148 925 q 1196 927 1179 925 q 1234 931 1213 929 q 1120 490 1167 727 q 1042 0 1073 252 l 972 5 q 934 2 959 5 q 895 0 909 0 q 933 143 917 81 q 963 282 948 204 l 1001 464 l 741 465 l 480 465 l 448 311 q 398 0 420 164 q 361 4 384 1 q 326 6 337 6 q 282 3 309 6 q 249 0 255 0 q 357 445 305 184 q 440 931 409 705 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 235 870 247 876 l 19 744 l -39 744 "},"•":{"x_min":208.328125,"x_max":798.609375,"ha":1006,"o":"m 502 789 q 711 702 625 789 q 798 494 798 615 q 711 285 798 372 q 502 199 625 199 q 293 285 379 199 q 208 494 208 372 q 230 606 208 553 q 293 702 252 659 q 388 766 333 744 q 502 789 443 789 "},"¥":{"x_min":38.890625,"x_max":762.5,"ha":749,"o":"m 277 290 q 157 290 237 290 q 38 290 77 290 l 52 344 q 146 340 90 344 q 204 337 202 337 l 290 337 l 308 438 l 73 436 l 83 489 l 294 485 q 218 673 252 593 q 123 888 184 753 q 156 885 133 888 q 193 881 180 881 q 223 885 202 881 q 255 888 244 888 q 294 770 273 828 q 337 653 315 711 l 395 496 l 495 644 q 638 888 570 758 l 692 881 q 733 885 705 881 q 762 888 761 888 q 659 758 701 813 q 566 633 616 702 l 456 484 l 668 489 l 658 436 l 419 436 l 401 337 q 518 339 458 337 q 637 344 577 341 l 626 290 q 509 290 587 290 q 391 290 430 290 q 363 137 376 221 q 343 0 351 53 q 306 3 323 1 q 266 5 290 5 l 202 0 q 242 133 225 65 q 277 290 259 202 "},"(":{"x_min":47,"x_max":462.5,"ha":372,"o":"m 139 234 q 245 -136 139 27 l 205 -156 q 88 60 129 -50 q 47 291 47 170 q 149 664 47 494 q 429 963 252 835 l 462 936 q 222 624 305 807 q 139 234 139 441 "},"U":{"x_min":75,"x_max":991.671875,"ha":992,"o":"m 266 926 q 309 929 281 926 q 350 932 337 932 q 275 692 303 786 q 227 498 247 598 q 208 300 208 398 l 208 276 l 208 240 q 280 100 208 150 q 448 50 352 50 q 594 81 528 50 q 707 184 661 113 q 787 387 752 254 q 843 668 821 521 q 874 932 865 815 q 906 927 895 929 q 933 926 916 926 q 964 928 947 926 q 991 932 981 930 q 898 528 938 723 q 820 230 858 333 q 689 55 781 126 q 426 -15 597 -15 q 178 46 281 -15 q 75 246 75 108 q 79 305 75 282 q 107 439 83 329 q 158 685 131 548 q 198 932 184 821 l 266 926 "},"γ":{"x_min":-22.21875,"x_max":688.890625,"ha":669,"o":"m 201 66 q 160 384 201 197 q 40 584 119 571 l -22 577 l -16 636 q 84 667 27 667 q 227 581 180 667 q 288 378 275 496 q 312 161 302 261 q 443 394 383 276 q 562 652 502 512 l 609 650 q 688 656 644 650 q 556 447 626 560 q 436 246 486 333 q 329 42 387 159 q 248 -344 283 -144 q 209 -337 225 -340 q 179 -334 193 -334 q 138 -339 162 -334 q 101 -344 113 -343 q 167 -132 133 -243 q 201 66 201 -20 "},"α":{"x_min":11,"x_max":820.71875,"ha":847,"o":"m 685 326 q 729 120 708 201 q 761 0 751 40 l 695 2 l 629 0 q 614 73 623 30 q 595 156 605 115 q 468 29 538 73 q 304 -14 398 -14 q 93 65 176 -14 q 11 273 11 145 q 118 548 11 427 q 380 669 226 669 q 543 625 480 669 q 652 488 605 581 q 674 542 664 513 q 708 655 684 570 l 763 651 l 820 655 q 685 326 744 493 m 135 238 q 178 93 135 150 q 307 37 222 37 q 495 136 419 37 q 572 351 572 236 q 522 534 572 450 q 380 618 472 618 q 198 495 261 618 q 135 238 135 372 "},"F":{"x_min":14,"x_max":668.0625,"ha":619,"o":"m 204 932 l 454 928 l 668 932 q 644 847 652 894 q 568 857 605 854 q 483 860 530 860 l 331 860 q 306 771 318 819 q 283 665 294 722 l 256 531 l 377 531 q 488 533 458 531 q 577 542 519 535 q 565 502 569 522 q 559 454 562 481 q 477 463 516 460 q 388 466 437 466 l 244 466 l 211 310 q 183 177 206 285 q 161 0 161 70 q 118 4 136 2 q 87 6 99 6 q 45 3 72 6 q 14 0 19 0 q 123 445 77 218 q 204 932 168 673 "},"­":{"x_min":-33.328125,"x_max":662.5,"ha":683,"o":"m -18 375 l 662 375 l 648 290 l -33 290 l -18 375 "},":":{"x_min":51,"x_max":322,"ha":426,"o":"m 135 159 q 195 135 171 159 q 219 75 219 111 q 195 15 219 39 q 135 -8 171 -8 q 75 17 100 -8 q 51 78 51 42 q 53 94 51 88 q 62 114 56 100 q 88 143 67 128 q 135 159 109 159 m 238 646 q 296 621 271 646 q 322 562 322 596 q 296 504 322 530 q 238 478 271 478 q 180 501 205 478 q 155 559 155 525 l 159 593 q 189 632 168 618 q 238 646 210 646 "},"Χ":{"x_min":-95.828125,"x_max":784.71875,"ha":699,"o":"m 154 287 l 301 465 l 183 712 l 125 836 l 70 932 l 148 926 q 200 929 182 926 q 229 931 219 931 q 269 824 245 881 q 309 729 293 766 l 381 561 l 494 718 q 641 931 572 820 l 704 926 q 756 929 737 926 q 784 931 775 931 q 675 820 725 875 q 559 690 625 765 l 408 506 l 547 201 q 645 0 593 98 l 586 5 l 485 0 q 455 92 468 55 q 417 187 442 129 l 328 403 l 177 197 q 119 115 147 156 q 44 0 91 73 l -13 5 q -45 4 -34 5 q -95 0 -56 4 q 15 122 -22 79 q 154 287 52 166 "},"*":{"x_min":126,"x_max":627,"ha":675,"o":"m 343 666 q 162 573 249 627 q 149 627 158 600 q 126 676 140 654 q 327 713 234 688 q 251 765 288 743 q 153 822 214 788 q 223 904 194 854 q 276 836 246 873 q 357 750 306 800 q 367 851 364 797 q 370 956 370 904 q 412 940 381 948 q 473 933 443 933 q 434 837 451 885 q 407 743 416 788 q 486 775 454 758 q 592 834 519 793 q 627 730 592 783 q 517 715 563 723 q 423 693 471 708 q 505 636 459 665 q 597 583 551 606 q 558 546 584 576 q 523 501 531 516 q 391 658 457 591 q 382 601 385 629 q 380 540 380 573 q 380 495 380 518 q 380 452 380 473 q 341 468 352 465 q 310 472 329 472 l 277 472 q 308 558 292 510 q 343 666 324 606 "},"°":{"x_min":254,"x_max":586,"ha":683,"o":"m 435 1059 q 541 1020 497 1059 q 586 923 586 982 q 529 788 586 845 q 395 731 473 731 q 296 771 338 731 q 254 870 254 812 q 307 1002 254 946 q 435 1059 360 1059 m 398 774 q 484 818 451 774 q 518 918 518 863 q 496 989 518 961 q 433 1017 475 1017 q 349 967 377 1017 q 321 859 321 918 q 344 798 325 822 q 398 774 364 774 "},"V":{"x_min":47.609375,"x_max":835.109375,"ha":740,"o":"m 47 932 q 90 929 58 932 q 125 926 122 926 q 167 929 137 926 q 199 932 197 932 q 224 737 210 830 q 260 504 237 643 l 321 161 l 519 533 q 623 735 578 641 q 708 932 668 829 l 765 926 q 803 928 782 926 q 835 932 824 930 l 693 691 l 546 433 q 428 214 477 306 q 320 0 379 122 l 285 5 q 249 5 267 5 q 225 0 235 1 q 186 298 211 152 q 131 575 161 443 q 47 932 101 708 "},"Ξ":{"x_min":-50,"x_max":852.78125,"ha":826,"o":"m 493 924 q 673 928 554 924 q 852 932 793 932 q 836 811 836 871 q 658 815 777 811 q 476 820 538 820 q 297 815 416 820 q 118 811 177 811 q 131 932 131 868 q 312 928 191 932 q 493 924 433 924 m 425 533 q 546 538 456 533 q 680 544 636 544 q 662 462 662 500 l 661 447 l 662 422 q 545 426 623 422 q 437 430 466 430 q 302 426 406 430 q 151 422 197 422 q 169 544 169 487 q 290 538 201 544 q 425 533 380 533 m 343 119 q 531 123 405 119 q 720 127 658 127 q 709 59 712 87 q 705 0 705 31 q 516 3 643 0 q 326 8 390 8 q 138 3 263 8 q -50 0 13 0 q -40 52 -44 20 q -36 109 -36 84 l -36 127 q 152 123 26 127 q 343 119 279 119 "}," ":{"x_min":0,"x_max":0,"ha":375},"Ϋ":{"x_min":30,"x_max":778.609375,"ha":668,"o":"m 255 383 q 151 640 207 504 q 30 931 95 776 l 106 927 l 185 931 q 230 780 207 847 q 352 450 253 714 l 502 674 q 577 801 538 734 q 649 931 616 868 l 706 927 l 778 931 l 670 794 l 576 663 l 382 388 l 350 234 q 317 0 328 119 q 276 4 299 1 q 241 6 253 6 q 200 4 216 6 q 166 0 184 2 q 204 147 186 69 q 255 383 221 224 m 349 1204 q 376 1199 364 1204 q 395 1185 388 1194 q 406 1174 402 1177 q 419 1129 419 1152 q 412 1097 419 1108 q 392 1073 405 1085 q 348 1061 380 1061 q 297 1082 319 1061 q 276 1131 276 1104 q 298 1183 276 1162 q 349 1204 320 1204 m 583 1204 q 626 1189 615 1204 q 644 1167 638 1174 q 654 1130 654 1148 q 647 1101 654 1112 q 627 1075 641 1090 q 583 1061 613 1061 q 532 1082 554 1061 q 511 1131 511 1104 q 531 1183 511 1162 q 583 1204 552 1204 "},"0":{"x_min":29,"x_max":705,"ha":749,"o":"m 431 910 q 638 814 571 910 q 705 573 705 719 q 604 170 705 358 q 308 -18 503 -18 q 94 75 160 -18 q 29 325 29 169 q 33 406 29 364 q 60 554 38 448 q 181 784 83 659 q 431 910 278 910 m 146 266 q 182 101 146 170 q 304 33 218 33 q 470 137 408 33 q 558 382 531 241 q 586 627 586 524 q 549 790 586 721 q 429 859 513 859 q 241 725 288 859 q 175 493 194 592 q 151 355 157 393 q 146 266 146 316 "},"”":{"x_min":102.78125,"x_max":650,"ha":606,"o":"m 248 876 q 281 930 266 913 q 330 947 297 947 q 371 937 356 947 q 386 902 386 927 q 377 865 386 883 q 352 829 368 847 l 131 543 l 102 556 l 248 876 m 512 876 q 545 928 529 910 q 595 947 562 947 q 636 937 622 947 q 650 904 650 928 q 643 872 650 886 q 619 829 637 859 l 397 543 l 369 556 l 512 876 "},"@":{"x_min":78,"x_max":1288,"ha":1365,"o":"m 905 639 l 970 639 l 876 266 l 863 205 q 885 156 863 171 q 942 142 907 142 q 1137 263 1061 142 q 1213 513 1213 385 q 1069 803 1213 695 q 736 911 925 911 q 326 755 496 911 q 156 362 156 600 q 303 3 156 137 q 679 -130 451 -130 q 903 -97 789 -130 q 1105 -6 1018 -65 l 1130 -43 q 923 -148 1034 -111 q 693 -186 811 -186 q 258 -42 439 -186 q 78 351 78 101 q 273 793 78 615 q 737 971 469 971 q 1120 844 953 971 q 1288 507 1288 717 q 1186 214 1288 346 q 930 82 1085 82 q 836 103 879 82 q 794 170 794 124 l 794 204 q 709 115 763 148 q 596 82 656 82 q 439 139 493 82 q 386 301 386 197 q 471 552 386 440 q 691 665 557 665 q 797 638 753 665 q 863 556 840 612 l 905 639 m 849 477 q 797 571 835 534 q 701 608 758 608 q 529 510 592 608 q 467 297 467 412 q 503 184 467 230 q 606 139 540 139 q 733 188 679 139 q 807 312 786 237 l 849 477 "},"Ί":{"x_min":-39,"x_max":598.609375,"ha":621,"o":"m 408 0 l 336 5 q 284 2 302 5 q 255 0 265 0 q 372 482 322 248 q 447 931 422 716 q 483 927 466 929 q 523 926 500 926 q 572 929 554 926 q 598 931 590 931 q 486 477 533 712 q 408 0 438 241 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 236 870 247 876 l 19 744 l -39 744 "},"ö":{"x_min":9,"x_max":697,"ha":761,"o":"m 370 669 q 605 596 514 669 q 697 383 697 524 q 591 105 697 225 q 332 -15 485 -15 q 98 58 188 -15 q 9 274 9 132 q 18 348 9 302 q 54 464 28 394 q 170 601 81 534 q 370 669 259 669 m 341 924 q 392 903 367 924 q 404 884 396 897 q 413 851 413 871 q 404 816 413 828 q 382 792 396 804 q 342 781 368 781 q 290 802 311 781 q 269 853 269 824 q 291 903 271 883 q 341 924 311 924 m 575 924 q 626 903 603 924 q 642 880 635 893 q 649 851 649 868 q 643 822 649 836 q 620 796 635 811 q 577 781 606 781 q 526 802 547 781 q 505 853 505 824 q 525 903 505 882 q 575 924 546 924 m 134 234 q 177 94 134 152 q 302 36 221 36 q 500 157 432 36 q 569 421 569 279 q 523 561 569 504 q 395 618 477 618 q 245 548 306 618 q 159 393 185 479 q 134 234 134 307 "},"i":{"x_min":8,"x_max":300,"ha":335,"o":"m 128 656 q 201 648 166 648 q 271 655 238 648 q 185 311 217 474 q 153 0 153 148 q 117 4 138 1 q 83 6 95 6 q 39 4 58 6 q 8 0 20 1 q 94 348 60 180 q 128 656 128 517 m 234 963 q 280 943 261 963 q 300 895 300 924 q 281 847 300 867 q 234 827 262 827 q 186 846 205 827 q 167 893 167 865 q 186 942 167 921 q 234 963 205 963 "},"Β":{"x_min":12,"x_max":718,"ha":760,"o":"m 202 933 l 303 927 q 390 930 328 927 q 455 933 451 933 q 640 887 562 933 q 718 744 718 842 q 639 577 718 634 q 438 498 560 519 q 611 439 544 488 q 679 291 679 390 q 572 79 679 158 q 328 0 466 0 l 130 4 l 12 4 q 119 442 71 203 q 202 933 166 682 m 593 727 q 547 844 593 801 q 427 887 501 887 q 377 884 405 887 q 325 878 349 881 q 285 708 307 812 q 248 521 263 605 q 493 561 394 521 q 593 727 593 601 m 259 55 q 460 114 373 55 q 548 282 548 174 q 486 420 548 373 q 328 468 424 468 l 238 468 q 193 253 211 347 q 163 60 175 160 q 223 56 203 57 q 259 55 242 55 "},"≤":{"x_min":175,"x_max":962.703125,"ha":1139,"o":"m 290 493 l 962 266 l 962 195 l 175 463 l 175 521 l 962 788 l 962 718 l 290 493 m 962 26 l 175 26 l 175 93 l 962 93 l 962 26 "},"υ":{"x_min":41,"x_max":699,"ha":774,"o":"m 699 433 q 582 121 699 257 q 292 -14 465 -14 q 113 42 186 -14 q 41 204 41 99 q 79 459 41 305 q 124 655 117 613 q 192 650 156 650 q 230 652 208 650 q 264 655 252 654 q 195 406 231 538 q 160 188 160 274 q 194 80 160 123 q 294 37 229 37 q 495 158 426 37 q 564 423 564 280 q 549 535 564 477 q 510 650 535 593 l 546 648 q 588 651 568 648 q 646 663 608 654 q 699 433 699 553 "},"]":{"x_min":-46,"x_max":355,"ha":372,"o":"m 199 896 l 151 896 l 159 943 l 257 943 l 355 943 q 292 645 331 834 q 207 226 253 456 q 137 -136 162 -4 l 45 -136 l -46 -136 l -37 -85 l 17 -89 l 49 -85 q 105 177 72 16 q 183 569 138 338 q 247 893 228 800 l 199 896 "},"m":{"x_min":4,"x_max":1100,"ha":1197,"o":"m 533 469 q 503 556 533 523 q 420 589 473 589 q 241 491 299 589 q 165 255 183 394 q 134 0 147 116 q 97 3 120 0 q 70 6 74 6 q 31 3 55 6 q 4 0 6 0 q 89 340 54 160 q 124 655 124 519 l 183 647 q 251 655 217 647 q 215 523 226 583 q 331 631 267 594 q 474 669 395 669 q 648 524 627 669 q 769 629 701 590 q 915 669 837 669 q 1045 623 991 669 q 1100 501 1100 577 q 1097 459 1100 485 q 1091 420 1094 432 l 1040 138 l 1019 0 q 956 8 987 3 q 923 3 945 8 q 888 0 901 0 q 949 244 924 119 q 975 469 975 369 q 949 557 975 526 q 862 589 923 589 q 683 490 742 589 q 601 234 624 391 q 577 0 588 116 q 545 4 567 0 q 512 8 523 8 q 479 4 499 8 q 447 0 459 1 q 508 245 483 120 q 533 469 533 370 "},"χ":{"x_min":-104.171875,"x_max":694.453125,"ha":714,"o":"m 456 425 q 576 655 520 529 q 634 650 599 650 q 673 650 654 650 q 694 655 688 654 q 584 504 636 584 q 458 302 533 425 l 381 181 l 427 27 q 562 -370 491 -186 l 511 -369 q 461 -372 494 -369 q 411 -375 427 -375 l 286 82 l 177 -92 q 92 -235 128 -170 q 29 -375 57 -299 l -55 -369 l -104 -375 q 131 -37 20 -209 l 263 161 l 212 344 q 145 539 173 491 q 72 587 118 587 l 25 583 l 25 636 q 80 661 55 653 q 137 669 105 669 q 256 612 229 669 q 323 408 284 555 l 360 264 l 456 425 "},"8":{"x_min":26,"x_max":687,"ha":749,"o":"m 159 686 q 247 850 159 790 q 443 911 335 911 q 612 865 538 911 q 687 730 687 819 q 624 583 687 641 q 468 503 562 525 q 603 431 550 493 q 657 287 657 369 q 555 67 657 153 q 315 -18 454 -18 q 110 45 195 -18 q 26 223 26 108 q 106 412 26 337 q 305 510 187 487 q 199 573 239 526 q 159 686 159 619 m 270 675 q 306 567 270 610 q 407 524 342 524 q 525 582 481 524 q 569 718 569 640 q 533 820 569 780 q 435 860 498 860 q 331 817 375 860 q 276 714 288 775 q 270 675 272 701 m 152 211 q 195 83 152 133 q 314 33 238 33 q 476 117 418 33 q 535 311 535 202 q 490 428 535 383 q 374 473 445 473 q 234 415 295 473 q 163 303 174 357 q 152 211 152 248 "},"ί":{"x_min":8,"x_max":484.390625,"ha":335,"o":"m 128 656 q 201 648 166 648 q 271 655 238 648 q 185 311 217 474 q 153 0 153 148 q 117 3 134 1 q 77 5 99 5 l 8 0 q 70 230 45 130 q 112 442 95 330 q 128 656 128 554 m 161 745 l 355 941 q 394 970 374 959 q 431 982 413 982 q 468 966 452 982 q 484 929 484 950 q 465 896 484 916 q 434 871 446 876 l 219 745 l 161 745 "},"Ζ":{"x_min":-26.390625,"x_max":815.28125,"ha":785,"o":"m -26 24 q 311 448 158 251 q 623 865 465 645 l 454 862 q 308 855 379 862 q 140 839 237 849 q 152 879 148 862 q 159 932 155 896 q 315 929 205 932 q 433 926 425 926 l 540 926 l 815 932 l 815 915 q 609 651 695 763 q 411 394 522 538 q 168 72 301 250 l 330 75 q 500 80 423 75 q 745 101 577 85 q 728 56 736 84 q 718 0 720 27 q 486 4 640 0 q 254 8 331 8 q 118 7 183 8 q -26 0 54 6 l -26 24 "},"R":{"x_min":14,"x_max":745,"ha":758,"o":"m 204 932 l 305 928 l 461 932 q 659 881 574 932 q 745 726 745 831 q 651 536 745 598 q 414 457 558 475 q 707 0 561 209 l 640 4 q 594 1 619 4 q 544 -3 569 -1 q 385 267 470 127 l 273 452 l 240 452 l 210 309 q 183 177 206 284 q 161 0 161 70 q 118 4 136 2 q 87 6 99 6 q 45 3 72 6 q 14 0 19 0 q 123 445 77 218 q 204 932 168 673 m 614 716 q 556 836 614 798 q 410 875 498 875 l 334 869 q 288 689 310 787 q 249 501 266 591 q 510 542 406 501 q 614 716 614 584 "},"×":{"x_min":202.921875,"x_max":939,"ha":1139,"o":"m 890 775 l 939 729 l 617 408 l 938 86 l 890 38 l 569 359 l 248 38 l 202 86 l 524 407 l 202 729 l 248 775 l 569 453 l 890 775 "},"o":{"x_min":11,"x_max":699,"ha":761,"o":"m 372 669 q 607 596 516 669 q 699 380 699 523 q 591 106 699 226 q 333 -14 484 -14 q 100 58 190 -14 q 11 271 11 130 q 18 346 11 309 q 54 459 26 384 q 170 601 83 534 q 372 669 258 669 m 135 235 q 177 93 135 149 q 303 37 219 37 q 501 159 432 37 q 570 421 570 282 q 523 560 570 502 q 394 618 476 618 q 244 547 305 618 q 158 380 183 477 q 135 235 135 307 "},"5":{"x_min":4.5625,"x_max":672.609375,"ha":749,"o":"m 376 551 q 545 486 476 551 q 614 322 614 421 q 498 79 614 176 q 233 -18 382 -18 q 121 -3 178 -18 q 4 37 64 11 q 40 160 19 102 l 50 157 q 115 69 79 100 q 208 38 151 38 q 398 113 322 38 q 474 301 474 189 q 430 435 474 380 q 308 490 386 490 q 239 474 278 490 q 167 434 200 458 l 140 452 q 183 663 162 545 q 218 888 204 782 l 435 888 l 672 888 q 660 830 664 862 q 655 771 655 798 q 511 776 607 771 q 369 782 415 782 l 276 782 l 222 517 q 376 551 293 551 "},"7":{"x_min":79.171875,"x_max":751.390625,"ha":749,"o":"m 615 777 l 309 772 l 138 764 q 158 806 152 789 q 163 846 163 823 l 163 888 l 427 885 l 751 885 l 751 850 q 702 781 716 802 q 665 726 687 761 l 461 412 q 333 203 390 304 q 227 0 276 103 q 190 4 211 0 q 152 8 169 8 q 116 4 136 8 q 79 0 97 0 q 256 222 175 106 q 435 491 338 339 q 615 777 531 643 "},"K":{"x_min":13.890625,"x_max":836.109375,"ha":747,"o":"m 270 500 q 346 568 308 530 q 406 626 384 605 l 523 746 q 604 832 565 788 q 687 932 643 876 l 752 926 l 836 932 q 768 877 798 901 q 688 808 738 852 l 587 713 l 372 508 l 546 247 l 649 87 l 701 18 l 701 0 q 655 3 683 0 q 624 6 627 6 q 582 4 598 6 q 546 0 566 2 q 444 171 492 92 q 350 320 396 250 l 259 453 l 242 454 l 212 311 q 162 0 184 163 q 125 4 148 1 q 90 6 101 6 q 46 3 73 6 q 13 0 19 0 q 129 463 81 234 q 204 932 176 693 l 273 926 q 318 929 287 926 q 351 932 350 932 q 286 665 312 811 l 252 504 l 270 500 "},",":{"x_min":-68.0625,"x_max":213.890625,"ha":375,"o":"m 76 91 q 110 148 95 131 q 158 165 125 165 q 199 155 184 165 q 213 120 213 145 q 209 94 213 105 q 181 44 205 84 l -38 -240 l -68 -225 l 76 91 "},"d":{"x_min":16,"x_max":801.78125,"ha":765,"o":"m 254 -14 q 79 65 143 -14 q 16 259 16 145 q 115 544 16 419 q 372 669 215 669 q 492 628 436 669 q 572 527 549 588 l 604 678 q 635 841 615 733 q 665 1025 654 950 q 706 1018 689 1020 q 733 1015 724 1015 q 770 1019 750 1015 q 801 1025 790 1023 q 676 528 728 783 q 586 0 624 273 l 528 2 l 464 0 l 492 94 q 377 13 431 40 q 254 -14 324 -14 m 144 239 q 178 105 144 160 q 291 51 213 51 q 460 139 400 51 q 528 294 519 228 q 539 377 537 360 q 540 404 540 395 q 539 448 540 439 q 536 463 539 457 q 485 556 526 521 q 383 591 443 591 q 234 516 292 591 q 163 378 175 441 q 147 284 150 316 q 144 239 144 252 "},"¨":{"x_min":106.9375,"x_max":652.78125,"ha":606,"o":"m 244 617 q 206 557 223 571 q 162 544 188 544 l 134 548 q 114 558 122 552 q 106 588 106 564 q 117 625 106 605 q 137 663 127 645 l 361 948 l 388 935 l 244 617 m 509 617 l 493 581 q 468 552 483 560 q 426 544 452 544 q 385 554 400 544 q 370 589 370 564 q 381 630 370 612 q 404 663 391 648 l 625 948 l 652 935 l 509 617 "},"E":{"x_min":13.890625,"x_max":652.78125,"ha":647,"o":"m 204 932 l 438 928 l 652 932 q 631 847 631 887 q 552 857 591 854 q 468 860 513 860 l 327 860 q 301 759 315 822 q 280 664 287 696 l 252 531 l 370 531 q 474 532 440 531 q 572 542 508 533 q 555 452 555 501 q 470 461 518 457 q 381 466 422 466 l 240 466 l 208 311 q 186 199 197 260 q 166 75 176 139 q 384 78 309 75 q 523 90 458 81 q 513 57 516 72 q 509 27 509 42 l 511 0 l 200 8 q 13 0 105 8 q 122 451 65 165 q 204 932 180 737 "},"Y":{"x_min":29.5625,"x_max":776.78125,"ha":667,"o":"m 254 380 q 174 584 197 526 q 110 741 151 641 q 29 932 68 840 q 71 927 62 927 q 105 926 80 926 q 149 929 118 926 q 183 931 180 931 q 230 772 211 830 q 353 450 250 715 l 500 674 q 576 800 535 730 q 647 931 617 869 l 705 926 q 751 929 735 926 q 776 931 767 931 l 669 794 l 577 663 l 380 387 l 350 236 q 317 0 328 117 q 276 4 299 1 q 240 6 253 6 q 199 4 215 6 q 164 0 183 2 q 216 199 193 90 q 254 380 239 308 "},"\"":{"x_min":65,"x_max":315,"ha":381,"o":"m 132 588 l 65 588 l 65 957 l 132 957 l 132 588 m 315 588 l 247 588 l 247 957 l 315 957 l 315 588 "},"ê":{"x_min":9,"x_max":616,"ha":664,"o":"m 142 236 q 192 100 142 153 q 322 47 242 47 q 433 76 376 47 q 538 153 490 106 l 553 139 q 536 93 545 118 q 524 50 528 69 q 415 0 471 16 q 302 -18 360 -18 q 89 61 170 -18 q 9 273 9 140 q 114 550 9 431 q 377 669 220 669 q 547 594 479 669 q 616 417 616 519 q 613 369 616 403 q 610 334 610 335 l 379 336 l 147 336 q 142 236 142 292 m 527 743 l 417 886 l 246 743 l 183 743 l 388 976 l 466 976 l 576 743 l 527 743 m 324 389 l 488 389 q 495 452 495 426 q 460 567 495 516 q 364 618 426 618 q 232 550 282 618 q 159 389 182 483 l 324 389 "},"δ":{"x_min":12,"x_max":673.109375,"ha":703,"o":"m 440 968 q 333 931 378 968 q 288 833 288 895 q 374 674 288 747 q 543 536 460 602 q 633 327 633 445 q 544 85 633 184 q 313 -14 455 -14 q 97 68 182 -14 q 12 281 12 151 q 99 513 12 417 q 323 624 186 609 q 213 717 259 665 q 162 830 167 769 q 237 971 162 920 q 407 1022 313 1022 q 593 1000 513 1022 q 673 902 673 979 q 666 876 673 893 q 657 852 660 859 q 555 938 604 908 q 440 968 506 968 m 356 577 q 200 469 256 577 q 144 252 144 360 q 180 99 144 166 q 295 33 217 33 q 449 135 398 33 q 500 352 500 238 q 479 478 500 417 q 422 558 458 538 q 356 577 385 577 "},"έ":{"x_min":32,"x_max":658.390625,"ha":642,"o":"m 533 512 q 459 586 502 558 q 367 615 416 615 q 277 582 315 615 q 240 497 240 549 q 286 405 240 430 q 415 369 333 381 q 408 329 408 351 l 408 309 q 361 315 398 310 q 317 321 324 321 q 209 283 253 321 q 165 182 165 246 q 215 78 165 115 q 334 42 265 42 q 442 66 394 42 q 544 139 490 91 q 532 41 532 93 q 319 -15 434 -15 q 120 32 208 -15 q 32 182 32 80 q 81 302 32 255 q 207 367 130 348 q 141 427 166 391 q 115 508 115 463 q 183 628 115 587 q 337 669 251 669 q 452 650 394 669 q 559 598 511 631 q 544 560 550 578 q 533 512 538 541 m 334 744 l 529 941 q 566 970 547 959 q 604 982 584 982 q 641 966 625 982 q 658 929 658 951 q 638 897 658 917 q 607 870 619 876 l 392 744 l 334 744 "},"ω":{"x_min":12,"x_max":1090,"ha":1153,"o":"m 1090 384 q 985 102 1090 219 q 716 -15 880 -15 q 591 10 644 -15 q 500 94 539 36 q 405 13 459 41 q 285 -15 350 -15 q 89 73 166 -15 q 12 284 12 162 q 64 489 12 394 q 212 661 117 583 q 266 647 238 653 q 332 641 293 641 q 191 461 245 562 q 137 248 137 359 q 177 101 137 167 q 296 36 218 36 q 480 280 428 36 q 510 474 503 429 l 538 655 q 580 650 557 651 q 631 648 602 648 l 680 652 q 610 394 632 487 q 588 205 588 302 q 621 81 588 127 q 728 36 655 36 q 898 148 842 36 q 955 388 955 261 q 933 526 955 462 q 864 645 911 590 q 925 649 898 645 q 998 661 953 652 q 1067 534 1044 607 q 1090 384 1090 462 "},"´":{"x_min":108.71875,"x_max":393.4375,"ha":375,"o":"m 254 876 q 285 929 265 910 q 336 949 304 949 q 378 939 362 949 q 393 903 393 929 q 384 867 393 885 q 358 829 375 850 l 137 543 l 108 556 l 254 876 "},"±":{"x_min":169,"x_max":969,"ha":1139,"o":"m 604 547 l 969 547 l 969 482 l 604 482 l 604 249 l 536 249 l 536 482 l 169 482 l 169 547 l 536 547 l 536 781 l 604 781 l 604 547 m 969 33 l 169 33 l 169 100 l 969 100 l 969 33 "},"|":{"x_min":304,"x_max":378,"ha":683,"o":"m 378 448 l 304 448 l 304 956 l 378 956 l 378 448 m 378 -235 l 304 -235 l 304 271 l 378 270 l 378 -235 "},"ϋ":{"x_min":41,"x_max":699,"ha":774,"o":"m 699 433 q 582 121 699 256 q 292 -14 465 -14 q 113 42 186 -14 q 41 204 41 99 q 79 459 41 305 q 124 655 117 613 q 191 651 155 651 q 230 652 208 651 q 264 655 251 654 q 195 406 230 538 q 160 188 160 274 q 194 80 160 123 q 294 37 229 37 q 495 158 426 37 q 564 423 564 280 q 549 535 564 477 q 510 650 535 593 l 546 651 q 588 653 568 651 q 646 662 608 655 q 699 433 699 552 m 305 924 q 354 902 334 924 q 375 850 375 881 q 355 800 375 821 q 305 780 336 780 q 253 800 274 780 q 233 853 233 821 q 253 903 233 883 q 305 924 273 924 m 538 924 q 588 902 568 924 q 609 850 609 881 q 590 800 609 820 q 539 780 571 780 q 488 801 510 780 q 467 853 467 822 q 487 903 467 883 q 538 924 507 924 "},"§":{"x_min":7,"x_max":605.625,"ha":675,"o":"m 41 43 l 58 41 q 141 -59 93 -22 q 257 -97 190 -97 q 374 -56 326 -97 q 423 51 423 -16 q 336 191 423 129 q 175 294 256 243 q 88 453 88 362 q 120 554 88 510 q 208 636 152 598 q 188 681 195 660 q 182 728 182 703 q 254 883 182 817 q 420 949 327 949 q 522 931 472 949 q 605 882 572 914 q 590 856 598 871 q 563 802 582 841 l 545 802 q 482 868 517 844 q 404 893 448 893 q 307 856 348 893 q 266 763 266 819 q 348 640 266 694 q 512 537 431 585 q 599 380 599 470 q 568 284 599 330 q 492 202 537 238 q 520 97 520 158 q 441 -84 520 -8 q 257 -160 361 -160 q 7 -71 118 -160 q 33 -11 25 -36 q 41 43 41 13 m 517 340 q 418 468 517 395 q 238 602 320 541 q 189 560 208 586 q 170 502 170 534 q 272 364 170 436 q 461 235 374 293 q 500 284 483 255 q 517 340 517 312 "},"b":{"x_min":-11,"x_max":689,"ha":765,"o":"m 172 879 l 198 1025 q 232 1018 214 1022 q 265 1015 251 1015 q 301 1019 282 1015 q 332 1025 320 1023 q 262 750 298 913 q 220 558 226 586 q 325 640 266 612 q 452 669 383 669 q 626 589 564 669 q 689 392 689 509 q 589 107 689 229 q 330 -15 490 -15 q 213 7 266 -15 q 111 76 161 30 q 35 0 70 46 l -11 0 q 56 281 23 129 q 114 563 89 433 q 172 879 139 693 m 561 409 q 524 544 561 488 q 412 600 488 600 q 222 482 284 600 q 161 223 161 365 q 201 95 161 148 q 317 43 242 43 q 467 119 409 43 q 540 267 526 195 q 557 360 554 338 q 561 409 561 381 "},"q":{"x_min":23,"x_max":716.0625,"ha":765,"o":"m 267 -14 q 88 65 154 -14 q 23 262 23 145 q 125 546 23 423 q 385 669 227 669 q 500 633 452 669 q 577 531 549 597 q 590 613 588 597 q 592 654 592 629 q 620 650 603 651 q 652 648 636 648 q 686 650 667 648 q 716 654 704 652 q 654 393 679 515 q 538 -225 629 271 l 513 -373 q 483 -367 496 -369 q 446 -365 470 -365 q 409 -367 421 -365 q 379 -373 396 -369 q 438 -152 413 -260 l 477 30 l 492 95 q 386 15 441 44 q 267 -14 332 -14 m 149 241 q 185 109 149 165 q 294 53 221 53 q 481 166 418 53 q 545 413 545 279 q 504 542 545 491 q 386 594 463 594 q 237 519 294 594 q 164 367 179 444 q 149 241 149 291 "},"Ω":{"x_min":-39,"x_max":1063.78125,"ha":1103,"o":"m 1063 92 q 1044 0 1051 55 q 937 3 1008 0 q 830 8 866 8 q 723 3 795 8 q 615 0 651 0 l 631 53 q 842 248 766 116 q 918 537 918 380 q 839 791 918 695 q 605 888 761 888 q 299 737 416 888 q 183 390 183 586 q 234 183 183 274 q 389 53 286 92 l 375 0 l 168 8 q 49 4 133 8 q -39 0 -33 0 q -26 39 -30 20 q -18 92 -22 58 q 83 86 37 87 q 208 86 130 86 q 82 231 121 165 q 44 395 44 297 q 211 791 44 629 q 615 953 378 953 q 933 845 807 953 q 1060 548 1060 737 q 1004 301 1060 407 q 836 86 948 195 q 945 89 863 86 q 1063 92 1026 92 "},"ύ":{"x_min":41,"x_max":699,"ha":774,"o":"m 699 433 q 582 121 699 256 q 292 -14 465 -14 q 113 42 186 -14 q 41 204 41 99 q 79 459 41 305 q 124 655 117 613 q 192 650 156 650 q 230 652 208 650 q 264 655 252 654 q 195 406 231 538 q 160 188 160 274 q 194 80 160 123 q 294 37 229 37 q 495 158 426 37 q 564 423 564 280 q 549 535 564 477 q 510 650 535 593 l 546 648 q 588 651 568 648 q 646 662 608 654 q 699 433 699 552 m 376 744 l 570 941 q 607 970 588 959 q 645 982 625 982 q 682 966 665 982 q 699 929 699 951 q 679 897 699 918 q 647 870 660 876 l 434 744 l 376 744 "},"Ö":{"x_min":43,"x_max":1061,"ha":1103,"o":"m 616 953 q 932 847 804 953 q 1061 555 1061 741 q 893 149 1061 316 q 488 -18 726 -18 q 167 89 292 -18 q 43 389 43 197 q 70 574 43 444 q 254 828 97 704 q 616 953 411 953 m 555 1204 q 604 1181 582 1204 q 626 1129 626 1158 q 603 1080 626 1099 q 553 1061 581 1061 q 503 1081 524 1061 q 483 1131 483 1102 q 503 1183 483 1162 q 555 1204 524 1204 m 791 1204 q 840 1181 820 1204 q 861 1129 861 1158 q 839 1080 861 1099 q 788 1061 817 1061 q 738 1081 759 1061 q 718 1131 718 1102 q 739 1182 718 1160 q 791 1204 761 1204 m 608 888 q 300 736 415 888 q 186 387 186 585 q 266 139 186 236 q 495 43 347 43 q 802 188 685 43 q 919 529 919 334 q 909 651 919 596 q 866 765 899 707 q 764 855 834 822 q 608 888 694 888 "},"z":{"x_min":-33.71875,"x_max":631.5625,"ha":633,"o":"m 312 423 l 448 589 q 269 587 337 589 q 112 578 201 586 l 116 628 l 114 656 q 195 649 176 650 q 238 649 214 649 q 468 652 328 649 q 631 655 607 655 l 631 631 q 462 441 517 504 q 320 274 406 377 q 155 69 234 170 q 350 73 259 69 q 544 89 441 77 q 530 44 537 68 q 521 0 523 20 q 381 4 474 0 q 241 8 288 8 q -33 -4 110 8 l -33 31 q 312 423 139 212 "},"™":{"x_min":176,"x_max":918,"ha":1139,"o":"m 464 931 l 347 931 l 347 616 l 294 616 l 294 931 l 176 931 l 176 971 l 464 971 l 464 931 m 735 688 l 840 970 l 918 971 l 918 616 l 871 616 l 871 928 l 752 616 l 716 616 l 594 931 l 594 616 l 548 616 l 548 971 l 625 971 l 735 688 "},"ή":{"x_min":4,"x_max":672.046875,"ha":765,"o":"m 70 6 q 31 3 55 6 q 4 0 6 0 q 90 339 55 166 q 124 655 124 512 l 183 647 q 251 655 217 647 q 216 523 228 588 q 332 629 266 590 q 475 669 398 669 q 612 623 557 669 q 667 497 667 577 q 651 376 667 437 l 558 -111 q 534 -253 547 -173 q 515 -372 520 -333 q 480 -367 495 -369 q 451 -365 465 -365 q 418 -367 437 -365 q 383 -372 399 -370 q 461 -62 427 -200 q 519 217 494 75 q 545 460 545 359 q 514 551 545 515 q 428 588 483 588 q 318 556 384 588 q 211 431 252 524 q 158 221 170 339 q 135 0 145 104 q 100 3 125 0 q 70 6 76 6 m 347 744 l 545 941 q 581 971 562 959 q 620 982 601 982 q 656 966 640 982 q 672 929 672 950 q 652 897 672 918 q 622 870 633 876 l 407 744 l 347 744 "},"Θ":{"x_min":43,"x_max":1060,"ha":1103,"o":"m 615 953 q 933 845 807 953 q 1060 548 1060 737 q 895 143 1060 305 q 488 -18 730 -18 q 168 88 294 -18 q 43 387 43 195 q 70 572 43 440 q 254 828 97 704 q 615 953 411 953 m 606 888 q 301 735 417 888 q 185 386 185 583 q 266 139 185 236 q 496 43 348 43 q 802 189 685 43 q 920 529 920 336 q 910 651 920 596 q 867 763 900 705 q 763 854 835 821 q 606 888 692 888 m 550 419 l 497 419 l 290 410 q 300 458 297 440 q 304 502 304 477 q 442 497 354 502 q 556 493 531 493 l 608 493 l 818 502 q 806 452 809 471 q 803 410 803 433 q 676 414 761 410 q 550 419 591 419 "},"®":{"x_min":80,"x_max":1056,"ha":1139,"o":"m 814 904 q 991 727 926 840 q 1056 481 1056 613 q 910 137 1056 281 q 567 -6 765 -6 q 224 138 368 -6 q 80 481 80 283 q 224 826 80 681 q 568 971 368 971 q 814 904 697 971 m 568 918 q 262 788 391 918 q 133 481 133 659 q 262 175 133 306 q 565 45 391 45 q 872 174 742 45 q 1003 478 1003 303 q 946 697 1003 595 q 786 858 889 799 q 568 918 683 918 m 813 620 q 775 522 813 563 q 681 468 737 480 l 808 209 l 712 209 l 592 456 l 462 457 l 462 209 l 377 209 l 377 771 l 581 771 q 745 739 678 771 q 813 620 813 707 m 462 715 l 462 513 l 566 513 q 680 532 634 513 q 727 609 727 551 q 680 693 727 672 q 564 715 634 715 l 462 715 "},"É":{"x_min":14,"x_max":668.171875,"ha":647,"o":"m 202 929 l 440 929 l 652 929 q 630 847 637 894 q 550 858 586 855 q 468 861 514 861 l 327 861 q 304 779 312 813 q 282 664 297 745 l 252 531 l 369 531 q 482 533 451 531 q 570 541 512 535 q 555 451 555 500 q 464 463 500 459 q 383 467 427 467 l 237 467 l 208 312 q 188 203 197 257 q 168 75 179 148 q 384 79 308 75 q 525 90 459 83 q 514 55 516 66 q 511 26 511 44 l 511 0 l 200 8 q 14 0 105 8 q 123 454 66 168 q 202 929 180 739 m 343 1021 l 538 1221 q 579 1254 562 1243 q 616 1265 595 1265 q 652 1246 637 1265 q 668 1207 668 1228 q 655 1178 668 1189 q 618 1151 643 1166 l 403 1021 l 343 1021 "},"~":{"x_min":284,"x_max":1080,"ha":1367,"o":"m 852 652 q 664 750 775 652 q 510 849 553 849 q 395 792 430 849 q 360 652 360 736 l 284 652 q 340 845 284 767 q 510 924 396 924 q 696 824 604 924 q 853 724 788 724 q 968 779 935 724 q 1002 924 1002 835 l 1080 924 q 1023 729 1080 806 q 852 652 967 652 "},"Ε":{"x_min":13.890625,"x_max":652.78125,"ha":647,"o":"m 204 932 l 438 928 l 652 932 q 631 847 631 887 q 552 857 591 854 q 468 860 513 860 l 327 860 q 301 759 315 822 q 280 664 287 696 l 252 531 l 370 531 q 474 532 440 531 q 572 542 508 533 q 555 452 555 501 q 470 461 518 457 q 381 466 422 466 l 240 466 l 208 311 q 186 199 197 260 q 166 75 176 139 q 384 78 309 75 q 523 90 458 81 q 513 57 516 72 q 509 27 509 42 l 511 0 l 200 8 q 13 0 105 8 q 122 451 65 165 q 204 932 180 737 "},"³":{"x_min":1,"x_max":433,"ha":496,"o":"m 24 445 l 35 443 q 84 392 53 408 q 157 377 116 377 q 279 417 227 377 q 331 525 331 457 q 304 595 331 567 q 235 623 278 623 l 174 616 q 182 660 180 634 l 217 660 q 306 691 263 660 q 354 768 348 723 q 330 843 354 815 q 259 871 306 871 q 144 791 177 871 l 134 791 q 110 848 130 819 q 274 903 181 903 q 384 872 335 903 q 433 780 433 841 q 387 692 433 723 q 276 644 342 661 q 374 610 332 639 q 416 526 416 580 q 329 388 416 435 q 142 342 242 342 q 81 346 103 342 q 1 368 59 351 l 24 445 "},"[":{"x_min":-7,"x_max":394.375,"ha":372,"o":"m 150 -90 l 199 -90 l 186 -136 l 90 -136 l -7 -136 q 211 942 106 386 l 302 942 l 394 942 l 384 891 l 327 895 l 295 891 q 236 610 262 733 q 168 272 211 487 q 98 -87 126 57 l 150 -90 "},"L":{"x_min":13.890625,"x_max":544.4375,"ha":600,"o":"m 204 932 q 236 927 220 929 q 276 926 252 926 q 314 928 293 926 q 347 932 336 930 q 240 502 295 764 q 169 75 186 240 q 358 79 270 75 q 544 94 445 83 q 526 27 526 60 l 529 0 l 205 8 q 13 0 109 8 q 131 469 80 226 q 204 932 181 712 "},"σ":{"x_min":11,"x_max":788.78125,"ha":800,"o":"m 774 567 q 706 573 738 572 q 632 575 675 575 q 698 384 698 498 q 592 106 698 226 q 331 -14 486 -14 q 99 58 187 -14 q 11 273 11 130 q 120 548 11 428 q 383 669 229 669 q 482 656 405 669 q 587 643 559 643 q 676 645 647 643 q 788 656 706 647 q 778 621 781 640 q 774 567 774 601 m 136 236 q 179 95 136 153 q 304 37 223 37 q 503 159 434 37 q 572 421 572 281 q 525 561 572 504 q 395 618 478 618 l 358 613 q 192 474 249 590 q 136 236 136 358 "},"ζ":{"x_min":37,"x_max":691.171875,"ha":657,"o":"m 688 946 q 434 773 552 872 q 238 547 316 675 q 161 278 161 420 q 288 149 172 174 q 499 126 394 137 q 611 1 611 102 q 585 -93 611 -47 q 474 -229 560 -138 l 424 -192 q 483 -119 466 -145 q 501 -56 501 -94 q 353 15 501 -5 q 121 73 205 36 q 37 251 37 111 q 94 473 37 364 q 238 677 152 583 q 427 858 324 772 l 535 946 l 402 946 q 292 943 342 946 q 188 931 242 940 q 205 1025 205 974 q 345 1021 259 1025 q 445 1018 431 1018 q 584 1021 496 1018 q 691 1025 673 1025 l 688 946 "},"θ":{"x_min":29,"x_max":705,"ha":749,"o":"m 705 572 q 604 169 705 357 q 308 -18 503 -18 q 95 73 162 -18 q 29 318 29 165 q 131 719 29 529 q 427 910 233 910 l 464 905 q 648 799 591 890 q 705 572 705 708 m 146 257 q 183 100 146 167 q 304 33 220 33 q 475 140 424 33 q 562 422 525 248 l 399 427 l 162 424 q 150 332 154 368 q 146 257 146 296 m 586 632 q 548 790 586 721 q 427 859 510 859 q 259 755 310 859 q 173 483 209 651 l 320 478 q 465 480 364 478 q 573 483 566 483 q 581 558 577 515 q 586 632 586 601 "},"Ο":{"x_min":43,"x_max":1060,"ha":1103,"o":"m 615 953 q 931 847 802 953 q 1060 555 1060 741 q 893 150 1060 318 q 488 -18 726 -18 q 168 88 294 -18 q 43 387 43 195 q 70 572 43 440 q 254 828 97 704 q 615 953 411 953 m 606 888 q 301 735 417 888 q 185 386 185 583 q 266 139 185 236 q 496 43 348 43 q 802 189 685 43 q 920 529 920 336 q 910 651 920 596 q 867 763 900 705 q 763 854 835 821 q 606 888 692 888 "},"Γ":{"x_min":13.890625,"x_max":691.671875,"ha":593,"o":"m 91 5 q 62 4 73 5 q 13 0 51 4 q 126 454 79 222 q 204 932 173 687 q 331 929 251 932 q 429 926 411 926 q 583 929 488 926 q 691 932 677 932 q 669 842 676 890 q 515 858 590 858 l 327 858 q 231 441 286 732 q 162 0 177 149 l 91 5 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":47,"x_max":1010,"ha":1075,"o":"m 488 731 q 414 551 488 627 q 235 475 341 475 q 99 526 152 475 q 47 662 47 577 q 122 837 47 763 q 298 911 197 911 q 422 870 375 911 q 488 752 469 829 l 488 731 m 1010 230 q 936 54 1010 126 q 757 -18 862 -18 q 625 31 677 -18 q 573 161 573 80 q 647 336 573 262 q 824 411 721 411 q 949 368 898 411 q 1010 254 1000 326 l 1010 230 m 202 -124 l 121 -125 l 844 1015 l 924 1015 l 202 -124 m 673 119 q 695 46 673 75 q 762 17 718 17 q 870 96 834 17 q 907 255 907 175 q 888 338 907 305 q 818 372 870 372 q 715 304 751 372 q 673 157 680 236 l 673 119 m 150 627 q 172 549 150 584 q 234 514 194 514 q 345 591 309 514 q 382 753 382 669 q 361 836 382 803 q 293 869 341 869 q 191 801 225 869 q 150 655 156 734 l 150 627 "},"P":{"x_min":13.890625,"x_max":722,"ha":711,"o":"m 204 935 l 284 927 q 378 931 319 927 q 449 935 437 935 q 641 877 560 935 q 722 712 722 819 q 653 533 722 609 q 506 441 585 456 q 360 422 426 426 q 233 418 294 418 q 192 196 213 313 q 161 0 170 78 q 118 4 136 2 q 87 6 99 6 q 45 3 72 6 q 13 0 19 0 q 130 466 81 231 q 204 935 179 702 m 584 700 q 529 829 584 783 q 389 875 475 875 l 333 870 q 244 475 277 670 q 489 521 394 475 q 584 700 584 568 "},"Ώ":{"x_min":-39,"x_max":1230.453125,"ha":1269,"o":"m 1230 92 q 1210 0 1217 55 q 1103 3 1174 0 q 996 8 1033 8 q 890 3 962 8 q 781 0 817 0 l 798 53 q 1008 248 932 116 q 1084 537 1084 380 q 1005 791 1084 695 q 771 888 927 888 q 466 737 583 888 q 350 390 350 586 q 401 183 350 274 q 556 53 453 92 l 542 0 l 334 8 q 216 4 300 8 q 127 0 133 0 q 140 39 136 20 q 148 92 144 58 q 250 86 204 87 q 375 86 297 86 q 249 231 288 165 q 211 395 211 297 q 378 791 211 629 q 781 953 545 953 q 1099 845 973 953 q 1226 548 1226 737 q 1170 301 1226 407 q 1002 86 1115 195 q 1111 89 1030 86 q 1230 92 1192 92 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 235 870 247 876 l 19 744 l -39 744 "},"Έ":{"x_min":-39,"x_max":888.78125,"ha":883,"o":"m 440 931 l 674 928 l 888 931 q 867 847 867 887 q 788 857 827 854 q 704 860 749 860 l 563 860 q 537 759 551 822 q 516 664 523 696 l 488 531 l 606 531 q 710 532 676 531 q 808 542 744 533 q 791 452 791 501 q 706 461 754 457 q 617 466 658 466 l 476 466 l 444 311 q 422 199 433 260 q 402 75 412 139 q 620 78 545 75 q 759 90 694 81 q 749 57 752 72 q 745 27 745 42 l 747 0 l 436 8 q 249 0 341 8 q 358 451 301 165 q 440 931 416 737 m -39 744 l 156 941 q 193 970 174 959 q 231 982 212 982 q 269 966 252 982 q 286 929 286 951 q 266 897 286 918 q 235 870 247 876 l 19 744 l -39 744 "},"_":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 683 -324 l 0 -324 l 0 -256 l 683 -256 l 683 -324 "},"Ϊ":{"x_min":19,"x_max":513,"ha":386,"o":"m 172 0 l 100 5 q 48 2 67 5 q 19 0 28 0 q 97 314 56 138 q 165 632 139 490 q 208 932 192 775 l 286 927 l 360 932 q 172 0 229 472 m 207 1204 q 234 1199 222 1204 q 253 1184 246 1194 q 266 1167 261 1174 q 278 1130 278 1145 q 271 1101 278 1113 q 250 1075 264 1090 q 207 1061 236 1061 q 156 1081 178 1061 q 134 1131 134 1102 q 155 1183 134 1163 q 207 1204 176 1204 m 442 1204 q 469 1199 457 1204 q 489 1184 481 1194 q 503 1167 497 1174 q 513 1130 513 1148 q 506 1101 513 1112 q 486 1075 500 1090 q 442 1061 471 1061 q 391 1081 413 1061 q 369 1131 369 1102 q 390 1183 369 1163 q 442 1204 411 1204 "},"+":{"x_min":169,"x_max":970,"ha":1139,"o":"m 603 439 l 970 439 l 970 375 l 603 375 l 603 0 l 536 0 l 536 375 l 169 375 l 169 439 l 536 439 l 536 814 l 603 814 l 603 439 "},"½":{"x_min":134,"x_max":1110,"ha":1172,"o":"m 302 836 q 211 800 239 812 q 143 763 182 787 q 139 789 143 776 q 134 809 135 802 q 266 855 213 836 q 386 904 319 875 l 399 894 q 340 666 364 773 q 282 391 315 559 l 237 395 l 194 391 q 254 613 227 501 q 302 836 281 725 m 1012 1015 l 254 -124 l 175 -125 l 929 1014 l 1012 1015 m 1070 63 q 1062 18 1062 37 l 1062 0 l 886 3 l 693 3 l 699 30 q 955 232 889 172 q 1022 386 1022 292 q 997 451 1022 425 q 930 478 972 478 q 864 457 893 478 q 823 400 835 436 l 809 400 q 779 444 797 428 q 946 511 849 511 q 1060 475 1010 511 q 1110 377 1110 440 q 985 188 1110 275 q 786 53 860 101 q 942 58 842 53 q 1070 63 1041 63 "},"Ρ":{"x_min":13.890625,"x_max":722,"ha":711,"o":"m 204 935 l 284 927 q 378 931 319 927 q 449 935 437 935 q 641 877 560 935 q 722 712 722 819 q 653 533 722 609 q 506 441 585 456 q 360 422 426 426 q 233 418 294 418 q 192 196 213 313 q 161 0 170 78 q 118 4 136 2 q 87 6 99 6 q 45 3 72 6 q 13 0 19 0 q 130 466 81 231 q 204 935 179 702 m 584 700 q 529 829 584 783 q 389 875 475 875 l 333 870 q 244 475 277 670 q 489 521 394 475 q 584 700 584 568 "},"'":{"x_min":111.109375,"x_max":393.0625,"ha":375,"o":"m 255 876 q 285 928 266 909 q 337 947 304 947 q 378 937 363 947 q 393 902 393 927 q 384 865 393 884 q 361 829 375 847 l 138 543 l 111 556 l 255 876 "},"T":{"x_min":68.0625,"x_max":769.453125,"ha":669,"o":"m 358 857 q 198 854 261 857 q 68 844 136 852 q 77 886 72 853 q 83 932 83 919 q 234 927 133 932 q 372 922 336 922 q 579 927 440 922 q 769 932 718 932 q 758 902 763 918 q 752 874 752 887 l 751 861 l 752 844 q 631 854 704 851 q 494 857 558 857 q 390 409 434 627 q 326 0 345 191 q 289 3 306 1 q 250 5 272 5 q 209 3 230 5 q 175 0 187 1 q 273 404 227 184 q 358 857 319 624 "},"Φ":{"x_min":50,"x_max":1061,"ha":1103,"o":"m 530 -24 q 461 -15 497 -15 q 380 -24 422 -15 l 408 71 q 156 170 263 83 q 50 393 50 257 q 197 741 50 615 q 569 868 345 868 l 581 957 q 620 951 598 954 q 658 948 641 948 q 695 951 673 948 q 731 957 716 954 l 705 862 q 956 761 852 845 q 1061 539 1061 676 q 915 191 1061 315 q 544 67 769 67 l 530 -24 m 919 521 q 857 718 919 636 q 688 800 796 800 q 611 454 642 605 q 552 134 580 303 q 813 249 708 134 q 919 521 919 364 m 193 407 q 254 213 193 293 q 424 134 315 134 q 495 464 463 304 q 558 800 527 625 q 294 686 395 800 q 193 407 193 572 "},"j":{"x_min":-140,"x_max":298,"ha":338,"o":"m 233 963 q 279 944 260 963 q 298 897 298 925 q 278 847 298 868 q 229 827 259 827 q 182 846 201 827 q 163 893 163 865 q 183 942 163 921 q 233 963 204 963 m -140 -335 q -30 -272 -63 -328 q 18 -123 1 -216 l 61 107 q 107 391 83 243 q 132 655 132 540 q 203 648 168 648 q 266 655 237 648 q 216 395 239 526 q 171 109 194 265 q 124 -136 147 -46 q 40 -301 101 -226 q -131 -376 -20 -376 l -140 -335 "},"Σ":{"x_min":-61.109375,"x_max":736.109375,"ha":714,"o":"m 718 836 q 563 851 636 846 q 419 857 490 857 l 269 857 q 336 737 305 792 q 417 600 367 682 l 497 472 q 131 119 295 300 l 355 119 l 661 127 q 643 63 650 95 q 636 0 636 31 q 456 3 577 0 q 277 8 336 8 q 108 3 219 8 q -61 0 -2 0 l -50 48 q 358 453 158 244 q 262 625 294 570 q 180 753 230 681 l 89 891 l 98 932 q 296 929 176 932 q 437 926 417 926 q 613 929 506 926 q 736 932 720 932 q 718 836 718 881 "},"1":{"x_min":153,"x_max":572,"ha":749,"o":"m 419 793 q 268 723 308 743 q 168 665 229 704 q 163 706 166 686 q 153 748 159 727 q 354 825 250 781 q 552 915 458 869 l 572 895 q 387 0 461 459 q 352 4 376 0 q 315 8 329 8 q 282 5 301 8 q 247 0 264 2 q 340 401 295 199 q 419 793 384 602 "},"ä":{"x_min":-11,"x_max":572.328125,"ha":642,"o":"m 161 -14 q 39 29 89 -14 q -11 147 -11 72 q 97 317 -11 270 q 310 374 199 344 q 433 492 420 404 q 403 583 433 549 q 315 618 373 618 q 210 591 255 618 q 134 512 165 565 l 111 519 q 122 581 122 549 l 119 618 q 235 661 195 651 q 315 672 275 672 q 472 633 405 672 q 539 511 539 594 q 532 434 539 479 q 525 375 526 390 l 477 143 q 469 92 473 117 q 482 63 469 78 q 508 48 494 48 q 554 58 529 48 l 572 23 q 452 -10 519 -10 q 386 15 408 -10 q 358 90 365 41 q 266 11 311 37 q 161 -14 222 -14 m 259 924 q 309 903 289 924 q 330 849 330 883 q 310 803 330 825 q 259 781 291 781 q 208 801 229 781 q 188 853 188 822 q 208 903 188 882 q 259 924 229 924 m 494 924 q 543 903 523 924 q 564 849 564 883 q 544 803 564 825 q 494 781 524 781 q 441 802 463 781 q 420 853 420 824 q 441 903 420 883 q 494 924 463 924 m 103 159 q 131 86 103 115 q 204 58 159 58 q 311 99 259 58 q 375 194 363 140 l 402 345 q 176 283 250 313 q 103 159 103 254 "},"<":{"x_min":176,"x_max":961.109375,"ha":1139,"o":"m 279 408 l 960 128 l 961 56 l 176 381 l 176 435 l 961 757 l 960 683 l 279 408 "},"£":{"x_min":-15.28125,"x_max":755.5625,"ha":749,"o":"m -4 99 l 13 97 q 180 199 140 97 q 220 453 220 301 q 155 453 187 453 q 86 448 123 453 l 97 510 q 159 507 118 510 q 222 504 201 504 q 222 532 222 519 q 229 587 223 545 q 321 813 229 715 q 543 911 413 911 q 665 882 606 911 q 755 801 723 854 q 675 718 706 760 l 650 725 q 624 822 650 785 q 543 860 598 860 q 393 745 437 860 q 350 504 350 631 l 469 502 l 604 510 q 593 479 595 496 q 590 440 590 462 q 345 450 475 450 q 292 247 331 319 q 148 96 252 175 l 309 93 q 506 99 379 93 q 662 105 634 105 l 652 -7 q 443 0 579 -7 q 291 6 306 6 q 114 3 237 6 q -15 0 -8 0 l -4 99 "},"¹":{"x_min":136,"x_max":414,"ha":496,"o":"m 311 831 q 226 795 269 813 q 144 754 184 777 q 136 804 144 779 q 304 863 293 859 q 401 904 315 867 l 414 894 q 348 631 379 766 q 291 353 318 496 q 245 359 270 359 q 213 356 224 359 q 198 353 202 353 q 311 831 267 594 "},"t":{"x_min":33,"x_max":436,"ha":433,"o":"m 33 587 q 41 618 38 600 q 44 656 44 636 q 92 648 64 651 q 166 646 120 646 q 182 726 173 679 q 197 813 191 773 q 255 829 231 820 q 319 857 279 837 l 330 843 l 292 701 l 280 645 q 436 655 362 645 q 429 624 434 651 q 423 586 423 597 q 349 593 383 592 q 267 594 315 594 l 195 268 q 179 199 184 227 q 175 138 175 170 q 198 77 175 99 q 261 55 222 55 q 297 59 284 55 q 347 81 310 63 l 341 29 q 272 -1 306 10 q 202 -13 237 -13 q 97 20 141 -13 q 54 113 54 53 q 63 187 54 144 q 76 249 72 230 l 155 594 q 91 593 119 594 q 33 587 63 592 "},"¬":{"x_min":48,"x_max":467,"ha":539,"o":"m 316 793 q 168 725 214 747 q 64 666 121 702 q 59 706 61 687 q 48 748 56 726 q 237 818 152 783 q 448 915 322 853 l 467 895 q 283 0 357 453 q 247 4 271 0 q 211 8 224 8 q 179 5 197 8 q 142 0 160 2 q 316 793 242 398 "},"λ":{"x_min":-54.5625,"x_max":587.109375,"ha":664,"o":"m 234 1025 q 380 939 346 1025 q 431 769 413 854 l 477 509 q 528 248 506 349 q 587 0 549 147 q 548 3 566 1 q 505 5 530 5 l 434 0 q 401 240 421 119 q 346 540 381 362 q 187 263 257 395 q 60 0 116 131 l 3 6 l -54 0 q 106 257 39 148 q 223 455 173 365 q 327 662 274 546 q 276 877 299 812 q 170 942 253 942 q 144 940 152 942 q 87 923 137 939 l 87 983 q 158 1014 123 1004 q 234 1025 194 1025 "},"ù":{"x_min":43,"x_max":709.65625,"ha":767,"o":"m 587 0 l 527 6 q 490 3 510 6 q 460 0 471 1 q 475 50 465 13 q 496 130 486 86 q 378 21 441 58 q 231 -15 315 -15 q 97 30 152 -15 q 43 155 43 76 q 71 383 43 239 q 124 654 99 527 q 162 648 140 651 q 190 645 184 645 q 256 654 223 650 q 187 378 206 466 q 168 186 168 290 q 190 104 168 136 q 259 66 212 71 q 497 214 449 66 q 574 654 545 362 q 611 649 591 651 q 643 647 630 647 q 679 649 665 647 q 709 654 693 651 q 625 320 663 511 q 587 0 587 129 m 494 744 l 316 876 q 276 936 276 897 q 293 969 276 953 q 327 985 311 985 q 356 976 342 985 q 384 953 370 968 l 547 744 l 494 744 "},"W":{"x_min":71,"x_max":1268.234375,"ha":1179,"o":"m 71 932 l 139 926 q 176 929 151 926 q 214 932 201 932 q 220 756 214 838 q 240 559 226 673 l 282 200 q 464 572 379 393 q 627 932 550 751 l 679 926 q 708 929 689 926 q 740 932 727 932 q 751 696 740 815 q 781 443 762 577 q 820 186 801 309 l 980 530 q 1141 932 1070 719 l 1194 926 q 1234 928 1212 926 q 1268 932 1255 930 l 1198 818 l 1109 633 l 972 354 q 893 190 932 273 q 808 0 855 106 l 766 5 q 736 2 747 5 q 719 0 725 0 q 680 367 701 188 q 629 751 658 546 q 431 355 520 541 q 276 0 341 169 q 234 6 255 2 q 214 4 226 6 q 189 0 202 2 q 71 932 141 480 "},"ï":{"x_min":8,"x_max":425,"ha":335,"o":"m 130 655 q 167 650 146 653 q 201 647 188 647 q 239 649 224 647 q 274 654 255 651 q 184 310 216 469 q 152 0 152 152 q 115 4 135 1 q 83 6 95 6 q 41 4 56 6 q 8 0 26 2 q 66 218 38 102 q 112 447 94 333 q 130 655 130 560 m 117 924 q 169 903 145 924 q 183 878 176 892 q 190 849 190 864 q 182 819 190 830 q 161 794 174 807 q 117 781 148 781 q 66 801 88 781 q 44 853 44 822 q 66 903 44 882 q 117 924 88 924 m 352 924 q 402 903 379 924 q 418 880 411 893 q 425 851 425 868 q 418 823 425 835 q 396 796 411 811 q 352 781 381 781 q 303 802 323 781 q 283 853 283 824 q 302 903 283 882 q 352 924 321 924 "},">":{"x_min":176.390625,"x_max":963,"ha":1139,"o":"m 963 381 l 176 56 l 176 128 l 858 408 l 176 683 l 176 757 l 963 435 l 963 381 "},"v":{"x_min":15.28125,"x_max":640.28125,"ha":606,"o":"m 15 656 q 86 648 52 648 q 156 655 120 648 q 195 385 169 513 l 245 118 l 369 337 q 444 481 411 409 q 520 655 477 552 q 575 648 548 648 q 640 655 608 648 q 439 340 533 501 q 255 0 345 180 q 227 4 238 2 q 208 6 216 6 q 178 4 191 6 q 156 0 165 1 q 115 222 140 105 q 72 422 91 339 q 15 656 52 506 "},"τ":{"x_min":18,"x_max":623.546875,"ha":606,"o":"m 219 5 l 151 0 q 240 348 216 218 q 265 576 265 478 q 140 554 186 576 q 45 468 94 532 q 18 556 36 518 q 127 623 65 603 q 262 644 188 644 l 448 644 q 623 656 527 644 q 613 621 616 640 q 609 567 609 601 q 538 573 574 570 q 466 576 502 576 l 390 576 q 342 367 367 480 q 306 176 317 254 q 295 0 295 98 q 247 4 262 2 q 219 5 231 5 "},"û":{"x_min":43,"x_max":709.65625,"ha":767,"o":"m 587 0 l 527 6 q 491 3 511 6 q 460 0 471 1 q 475 50 465 13 q 496 130 486 86 q 378 21 441 58 q 231 -15 315 -15 q 97 30 152 -15 q 43 155 43 76 q 71 383 43 239 q 124 654 99 527 q 162 648 140 651 q 190 645 184 645 q 256 654 223 649 q 187 378 206 466 q 168 186 168 290 q 190 104 168 136 q 259 66 212 71 q 497 214 449 66 q 574 654 545 362 q 611 649 591 651 q 642 647 630 647 q 674 649 654 647 q 709 654 695 652 q 625 320 663 510 q 587 0 587 129 m 568 744 l 458 888 l 290 744 l 225 744 l 432 978 l 508 978 l 618 744 l 568 744 "},"ξ":{"x_min":44,"x_max":689,"ha":696,"o":"m 639 851 q 575 940 608 909 q 491 972 543 972 q 367 906 414 972 q 321 760 321 841 q 386 630 321 667 q 553 594 451 594 q 549 571 551 582 q 547 547 548 560 l 547 521 q 466 531 499 527 q 406 536 432 536 q 246 488 312 536 q 168 351 180 440 l 168 311 l 168 272 q 303 144 186 179 q 508 102 405 123 q 615 -9 615 73 q 579 -128 615 -74 q 480 -240 544 -181 l 434 -212 q 497 -136 478 -160 q 516 -80 516 -112 q 362 9 516 -22 q 126 81 209 40 q 44 272 44 123 q 118 475 44 398 q 321 588 192 552 q 227 668 261 624 q 193 773 193 712 q 272 954 193 883 q 463 1025 351 1025 q 577 1004 525 1025 q 689 943 630 983 q 665 902 679 929 q 639 851 651 875 "},"&":{"x_min":34,"x_max":859,"ha":936,"o":"m 242 722 q 314 879 242 816 q 486 943 387 943 q 610 900 558 943 q 663 787 663 858 q 599 651 663 705 q 432 540 536 596 q 524 402 479 465 q 650 230 569 339 q 742 348 704 281 q 802 493 779 414 l 816 493 q 831 456 818 480 q 859 414 845 432 q 790 299 835 355 q 684 185 746 243 q 764 82 745 107 q 832 -1 784 57 q 746 8 789 2 q 713 6 731 8 q 671 -1 696 4 q 640 45 653 25 q 597 106 628 65 q 447 14 524 47 q 286 -18 371 -18 q 108 44 182 -18 q 34 209 34 106 q 107 395 34 322 q 306 536 181 469 q 259 627 276 579 q 242 722 242 674 m 577 783 q 549 860 577 827 q 476 894 521 894 q 383 851 423 894 q 343 755 343 808 q 355 682 343 720 q 408 581 368 644 q 532 673 487 630 q 577 783 577 716 m 492 267 l 329 493 q 207 399 253 450 q 155 271 161 347 q 211 121 155 182 q 357 60 268 60 q 464 83 413 60 q 569 150 514 107 l 492 267 "},"Λ":{"x_min":-104.171875,"x_max":681.953125,"ha":740,"o":"m 681 0 l 604 5 l 530 0 q 499 245 506 191 q 468 426 491 298 l 409 771 l 211 398 q 106 193 154 293 q 19 0 58 94 l -34 5 q -73 2 -45 5 q -104 0 -101 0 q 36 240 -29 123 l 181 498 q 304 718 252 620 q 411 932 355 815 l 461 926 l 502 932 q 544 626 518 776 q 602 335 570 476 q 681 0 633 194 "},"I":{"x_min":19.4375,"x_max":362.5,"ha":385,"o":"m 172 0 l 100 5 q 47 2 66 5 q 19 0 29 0 q 136 482 86 248 q 211 932 186 716 q 247 927 230 929 q 287 926 263 926 q 336 929 318 926 q 362 932 354 932 q 250 477 297 712 q 172 0 202 241 "},"G":{"x_min":53,"x_max":963.890625,"ha":982,"o":"m 605 889 q 309 743 422 889 q 196 411 196 598 q 277 141 196 243 q 523 39 359 39 q 610 46 577 39 q 698 69 643 54 q 743 266 730 200 q 763 394 756 333 q 841 380 805 380 q 872 383 858 380 q 915 394 887 386 q 863 208 886 300 q 826 26 840 116 q 509 -18 668 4 q 427 -15 452 -18 q 309 2 402 -13 q 134 133 215 19 q 53 390 53 247 q 216 793 53 634 q 623 953 379 953 q 790 931 708 953 q 963 869 872 909 l 938 836 q 920 802 929 825 q 904 761 911 780 l 887 759 q 759 856 829 823 q 605 889 690 889 "},"ΰ":{"x_min":41,"x_max":699,"ha":774,"o":"m 699 432 q 582 121 699 256 q 292 -14 465 -14 q 113 42 186 -14 q 41 204 41 99 q 79 459 41 305 q 124 655 117 613 q 191 650 155 650 q 230 652 208 650 q 264 655 251 654 q 195 406 230 538 q 160 188 160 274 q 194 80 160 123 q 294 37 229 37 q 495 158 426 37 q 564 423 564 280 q 549 535 564 477 q 510 650 535 593 l 546 648 q 588 651 568 648 q 646 662 608 653 q 699 432 699 552 m 272 869 q 318 850 299 869 q 337 805 337 831 q 318 762 337 780 q 272 744 300 744 q 230 762 247 744 q 213 805 213 781 q 231 849 213 830 q 272 869 249 869 m 424 947 q 443 991 426 969 q 478 1013 460 1013 q 511 999 497 1013 q 525 965 525 985 q 519 938 525 951 q 510 918 512 925 l 423 726 l 381 726 l 424 947 m 589 869 q 630 849 612 869 q 649 805 649 830 q 632 762 649 780 q 589 744 615 744 q 546 762 564 744 q 528 805 528 780 q 545 850 528 831 q 589 869 562 869 "},"`":{"x_min":111.5,"x_max":393.4375,"ha":375,"o":"m 249 617 q 219 565 240 587 q 167 544 197 544 q 126 551 142 544 q 111 588 111 559 q 119 623 111 606 q 143 663 126 639 l 365 948 l 393 935 l 249 617 "},"Υ":{"x_min":29.5625,"x_max":776.78125,"ha":667,"o":"m 254 380 q 174 584 197 526 q 110 741 151 641 q 29 932 68 840 q 71 927 62 927 q 105 926 80 926 q 149 929 118 926 q 183 931 180 931 q 230 772 211 830 q 353 450 250 715 l 500 674 q 576 800 535 730 q 647 931 617 869 l 705 926 q 751 929 735 926 q 776 931 767 931 l 669 794 l 577 663 l 380 387 l 350 236 q 317 0 328 117 q 276 4 299 1 q 240 6 253 6 q 199 4 215 6 q 164 0 183 2 q 216 199 193 90 q 254 380 239 308 "},"r":{"x_min":4,"x_max":452.609375,"ha":453,"o":"m 124 656 l 183 649 q 247 656 215 649 q 217 522 227 584 q 307 626 258 583 q 413 669 356 669 q 452 663 438 664 q 438 608 442 635 q 433 550 433 581 q 370 559 401 554 q 204 426 237 559 q 135 0 172 294 q 100 3 125 0 q 70 6 76 6 q 31 3 55 6 q 4 0 6 0 q 88 339 52 158 q 124 656 124 520 "},"x":{"x_min":-66,"x_max":622,"ha":615,"o":"m 129 206 l 235 320 q 148 486 191 405 q 53 656 104 567 q 126 648 89 648 q 198 655 162 648 q 247 534 223 588 q 309 403 272 480 q 427 550 394 508 q 502 655 461 591 q 553 648 527 648 q 622 655 584 648 l 452 477 l 336 351 l 404 216 q 453 117 434 151 q 523 0 472 84 q 479 3 506 0 q 447 6 451 6 q 404 3 430 6 q 373 0 377 0 q 338 90 351 58 q 259 268 325 122 q 153 136 209 209 q 54 0 97 63 q 21 3 42 0 q -4 6 0 6 q -38 3 -17 6 q -66 0 -60 0 l 129 206 "},"è":{"x_min":9,"x_max":616,"ha":664,"o":"m 142 236 q 192 100 142 153 q 322 47 242 47 q 433 77 376 47 q 538 155 490 108 l 553 140 q 536 95 545 119 q 524 50 528 70 q 415 0 471 17 q 302 -18 360 -18 q 89 61 170 -18 q 9 273 9 140 q 114 550 9 431 q 377 669 220 669 q 547 594 479 669 q 616 418 616 520 l 610 336 l 379 336 l 147 336 q 142 236 142 292 m 452 743 l 274 874 q 246 899 257 884 q 235 933 235 915 q 252 965 235 948 q 286 983 270 983 q 315 974 302 983 q 342 951 328 966 l 508 743 l 452 743 m 324 389 l 488 389 q 495 452 495 426 q 460 567 495 516 q 364 618 426 618 q 232 550 282 618 q 159 389 182 483 l 324 389 "},"μ":{"x_min":-81.9375,"x_max":711.109375,"ha":768,"o":"m 644 647 q 711 656 677 647 q 627 315 665 503 q 590 0 590 127 l 530 6 l 468 0 l 490 108 q 393 17 440 48 q 283 -13 347 -13 q 203 2 237 -13 q 131 53 169 18 q 83 -175 105 -51 q 48 -372 61 -299 q 15 -367 30 -369 q -13 -365 0 -365 q -46 -367 -29 -365 q -81 -372 -63 -370 q 1 -59 -37 -229 q 72 302 40 110 q 127 656 105 493 q 162 648 150 650 q 193 645 175 645 q 225 648 208 645 q 261 656 243 651 q 191 386 209 484 q 173 211 173 288 q 210 115 173 153 q 304 77 247 77 q 478 174 422 77 q 550 406 534 271 q 577 656 566 540 q 644 647 611 647 "},"÷":{"x_min":169,"x_max":969,"ha":1139,"o":"m 641 644 q 618 593 641 615 q 566 571 596 571 q 517 592 537 571 q 497 643 497 614 q 517 693 497 672 q 567 714 538 714 l 593 709 q 627 682 614 700 q 641 644 641 664 m 969 375 l 169 375 l 169 440 l 969 440 l 969 375 m 641 170 q 621 120 641 141 q 570 100 601 100 q 519 120 542 100 q 497 170 497 141 q 518 221 497 199 q 569 243 540 243 q 581 241 576 243 q 605 234 587 240 q 632 215 624 229 q 641 170 641 201 "},"h":{"x_min":4,"x_max":668,"ha":765,"o":"m 192 1025 q 222 1019 212 1020 q 252 1018 231 1018 q 276 1018 265 1018 q 323 1025 288 1019 q 284 850 308 969 q 258 719 260 731 l 223 534 q 335 633 269 598 q 479 669 402 669 q 612 623 556 669 q 668 502 668 577 q 630 223 668 409 q 587 0 592 37 q 520 8 553 4 q 488 5 506 8 q 454 0 470 2 q 519 247 495 131 q 544 469 544 363 q 512 555 544 521 q 428 590 481 590 l 412 590 q 237 477 292 571 q 165 249 181 382 q 135 0 148 116 q 100 3 124 0 q 70 6 76 6 q 31 3 55 6 q 4 0 6 0 q 131 536 70 226 q 192 1025 192 847 "},".":{"x_min":34,"x_max":202,"ha":375,"o":"m 118 158 q 178 134 154 158 q 202 75 202 110 q 178 15 202 39 q 118 -8 154 -8 q 58 16 82 -8 q 34 77 34 40 q 36 93 34 87 q 49 128 39 99 q 118 158 60 158 "},"φ":{"x_min":15,"x_max":934,"ha":999,"o":"m 405 -372 q 359 -366 381 -366 q 315 -367 335 -366 q 267 -372 295 -367 q 311 -194 287 -300 q 351 -10 335 -87 q 115 77 216 -10 q 15 302 15 164 q 121 554 15 456 q 385 653 228 653 l 410 653 l 412 606 q 213 517 282 606 q 144 293 144 429 q 203 116 144 192 q 360 41 263 41 q 388 184 375 118 q 423 368 400 250 q 484 578 445 487 q 666 669 524 669 q 861 580 788 669 q 934 366 934 491 q 811 85 934 188 q 507 -17 688 -17 l 464 -17 q 429 -187 444 -101 q 405 -372 414 -274 m 502 32 q 726 147 643 32 q 810 412 810 263 q 780 554 810 491 q 682 618 751 618 q 646 611 664 618 q 591 568 628 605 q 522 336 553 532 q 476 33 491 140 l 502 32 "},";":{"x_min":-47.21875,"x_max":315,"ha":426,"o":"m 230 644 q 289 619 264 644 q 315 560 315 594 q 289 501 315 527 q 230 476 263 476 q 171 500 195 476 q 148 560 148 525 q 161 611 148 578 q 230 644 174 644 m 95 91 q 129 149 115 133 q 177 165 143 165 q 220 155 205 165 q 234 120 234 145 q 227 88 234 103 q 201 44 219 72 l -18 -240 l -47 -224 l 95 91 "},"f":{"x_min":7,"x_max":513.78125,"ha":382,"o":"m 143 597 q 58 597 99 597 q 7 592 23 593 q 20 625 16 615 q 27 656 23 635 q 91 648 59 651 q 152 646 122 646 q 248 907 176 789 q 441 1025 320 1025 q 481 1022 474 1025 q 513 1004 488 1020 q 502 964 506 980 q 484 883 498 948 l 474 879 q 440 911 461 895 q 386 932 420 926 q 279 850 299 932 q 259 645 259 769 l 418 656 q 412 626 413 643 q 411 592 411 608 q 320 594 383 592 q 252 597 256 597 l 206 341 q 176 162 191 256 q 161 0 161 68 l 91 4 l 26 0 q 89 299 58 140 q 143 597 120 459 "},"“":{"x_min":106.9375,"x_max":652.78125,"ha":606,"o":"m 244 617 q 206 557 223 571 q 162 544 188 544 l 134 548 q 114 558 122 552 q 106 588 106 564 q 117 625 106 605 q 137 663 127 645 l 361 948 l 388 935 l 244 617 m 509 617 l 493 581 q 468 552 483 560 q 426 544 452 544 q 385 554 400 544 q 370 589 370 564 q 381 630 370 612 q 404 663 391 648 l 625 948 l 652 935 l 509 617 "},"A":{"x_min":-89,"x_max":757,"ha":808,"o":"m 495 956 l 525 947 l 558 956 q 625 544 608 641 q 675 297 641 447 q 757 0 708 148 q 713 3 741 0 q 677 6 686 6 q 627 4 648 6 q 593 0 606 1 q 574 186 593 80 q 545 349 555 292 l 390 354 l 233 349 l 156 213 q 97 108 126 162 q 40 0 67 55 q 1 3 24 0 q -25 6 -22 6 q -62 4 -45 6 q -89 0 -79 1 q 233 486 66 217 q 495 956 399 754 m 389 417 l 530 421 l 464 762 l 266 421 l 389 417 "},"6":{"x_min":51,"x_max":664,"ha":749,"o":"m 548 852 q 308 726 402 852 q 186 438 215 600 q 293 519 234 490 q 419 549 352 549 q 592 481 520 549 q 664 312 664 414 q 567 78 664 175 q 331 -18 470 -18 q 121 68 191 -18 q 51 297 51 154 q 185 714 51 523 q 537 906 320 906 q 577 904 565 906 q 636 894 590 903 l 648 829 q 548 852 605 852 m 162 231 q 203 92 162 152 q 322 33 245 33 q 482 114 423 33 q 542 303 542 196 q 495 428 542 376 q 374 481 448 481 q 239 424 297 481 q 168 289 181 367 q 162 231 162 263 "},"‘":{"x_min":111.109375,"x_max":395.828125,"ha":375,"o":"m 250 618 q 220 564 240 585 q 168 544 200 544 q 126 551 141 544 q 111 588 111 559 q 119 621 111 605 q 144 663 127 638 l 366 949 l 395 936 l 250 618 "},"ϊ":{"x_min":8,"x_max":437,"ha":335,"o":"m 128 656 q 201 648 166 648 q 271 655 238 648 q 185 311 217 474 q 153 0 153 148 q 117 3 134 1 q 77 5 99 5 l 8 0 q 70 230 45 130 q 112 442 95 330 q 128 656 128 554 m 132 924 q 181 902 161 924 q 202 850 202 881 q 182 800 202 821 q 132 780 163 780 q 80 801 102 780 q 59 853 59 822 q 79 903 59 882 q 132 924 100 924 m 366 924 q 416 902 396 924 q 437 850 437 881 q 418 800 437 820 q 367 780 399 780 q 316 801 338 780 q 295 853 295 822 q 315 903 295 883 q 366 924 335 924 "},"π":{"x_min":11,"x_max":940.171875,"ha":931,"o":"m 649 0 q 608 4 617 4 q 577 5 599 5 l 506 0 q 596 339 570 229 q 622 575 622 450 l 495 578 l 361 578 q 314 375 338 481 q 276 182 290 269 q 263 0 263 94 q 229 4 245 2 q 188 5 212 5 l 120 0 q 191 291 162 152 q 237 578 220 431 q 126 551 173 578 q 38 468 79 525 q 26 515 30 502 q 11 557 22 529 q 132 627 63 609 q 291 646 201 646 l 692 646 l 723 646 l 752 646 q 940 656 852 646 q 930 614 933 639 q 927 567 927 590 q 842 576 883 574 q 747 578 801 578 q 700 375 724 481 q 663 182 676 269 q 649 0 649 94 "},"ά":{"x_min":11,"x_max":820.71875,"ha":847,"o":"m 685 326 q 729 120 708 201 q 761 0 751 40 l 695 2 l 629 0 q 614 73 623 30 q 595 156 605 115 q 468 29 538 73 q 304 -14 398 -14 q 93 65 176 -14 q 11 273 11 145 q 118 548 11 427 q 379 669 225 669 q 542 625 480 669 q 652 488 605 581 q 674 542 664 513 q 708 655 684 570 l 763 651 l 820 655 q 685 326 744 493 m 362 744 l 556 941 q 594 971 576 961 q 632 982 611 982 q 669 965 653 982 q 685 929 685 949 q 665 897 685 917 q 635 870 646 876 l 420 744 l 362 744 m 135 238 q 178 93 135 150 q 307 37 222 37 q 495 136 419 37 q 572 351 572 236 q 521 534 572 450 q 379 618 471 618 q 197 495 260 618 q 135 238 135 372 "},"O":{"x_min":43,"x_max":1060,"ha":1103,"o":"m 615 953 q 931 847 802 953 q 1060 555 1060 741 q 893 150 1060 318 q 488 -18 726 -18 q 168 88 294 -18 q 43 387 43 195 q 70 572 43 440 q 254 828 97 704 q 615 953 411 953 m 606 888 q 301 735 417 888 q 185 386 185 583 q 266 139 185 236 q 496 43 348 43 q 802 189 685 43 q 920 529 920 336 q 910 651 920 596 q 867 763 900 705 q 763 854 835 821 q 606 888 692 888 "},"n":{"x_min":4,"x_max":667,"ha":765,"o":"m 124 655 l 183 647 q 251 655 217 647 q 216 523 228 591 q 335 631 273 593 q 477 669 398 669 q 612 623 558 669 q 667 496 667 577 q 662 437 667 469 q 651 376 658 405 l 615 178 q 599 82 607 135 q 587 0 592 28 q 521 8 554 3 q 488 5 507 8 q 454 0 470 2 q 517 248 490 120 q 545 469 545 376 q 510 557 539 525 q 426 589 481 589 q 245 490 305 589 q 167 254 186 391 q 135 0 148 116 q 100 3 125 0 q 70 6 76 6 q 31 3 55 6 q 4 0 6 0 q 89 340 54 160 q 124 655 124 519 "},"3":{"x_min":3,"x_max":657,"ha":749,"o":"m 41 154 l 55 145 q 128 65 77 93 q 241 38 179 38 q 424 106 348 38 q 500 282 500 175 q 461 397 500 349 q 357 445 423 445 q 312 439 337 445 q 264 429 287 434 l 276 503 q 305 503 291 503 q 332 503 318 503 q 479 564 419 503 q 539 712 539 625 q 498 816 539 776 q 393 857 458 857 q 286 822 330 857 q 220 725 242 787 l 206 725 q 195 764 201 745 q 169 822 189 783 q 415 911 282 911 q 584 859 512 911 q 657 714 657 808 q 607 582 657 640 q 417 479 558 525 q 569 420 510 467 q 629 284 629 373 q 507 65 629 148 q 241 -18 386 -18 q 115 -7 179 -18 q 3 25 51 3 q 21 90 11 59 q 41 154 30 120 "},"9":{"x_min":41,"x_max":687,"ha":749,"o":"m 53 132 q 124 63 86 88 q 208 39 161 39 q 424 158 346 39 q 531 438 501 277 q 435 369 486 392 q 321 347 383 347 q 145 417 214 347 q 77 594 77 487 q 174 818 77 726 q 407 911 272 911 q 613 825 539 911 q 687 605 687 740 q 554 178 687 374 q 204 -18 421 -18 q 139 -12 172 -18 q 70 0 106 -6 q 53 63 60 32 q 41 129 46 95 l 53 132 m 208 592 q 249 466 208 517 q 364 416 291 416 q 516 490 460 416 q 573 663 573 564 q 530 802 573 746 q 406 858 488 858 q 283 797 337 858 q 220 687 230 737 q 209 627 210 638 q 208 592 208 616 "},"l":{"x_min":8.328125,"x_max":337.5,"ha":338,"o":"m 200 1025 q 231 1019 222 1020 q 263 1018 241 1018 q 337 1025 295 1018 q 225 516 277 790 q 144 0 173 242 q 108 4 127 1 q 76 6 88 6 q 39 4 54 6 q 8 0 25 2 q 125 506 73 234 q 200 1025 176 779 "},"κ":{"x_min":4.171875,"x_max":673.609375,"ha":663,"o":"m 493 145 l 608 0 q 562 3 593 0 q 526 6 531 6 q 481 4 501 6 q 450 0 462 1 q 331 177 383 104 q 213 337 280 251 l 186 336 q 160 172 173 262 q 136 0 147 83 q 100 3 125 0 q 70 6 76 6 q 31 3 55 6 q 4 0 6 0 q 76 316 45 145 q 125 656 106 486 q 187 647 156 647 q 256 656 225 647 q 197 386 223 526 l 220 383 q 354 475 283 416 q 534 656 425 535 q 606 648 573 648 q 670 656 633 648 l 673 640 q 581 579 641 621 q 466 497 522 538 l 318 387 q 493 145 404 265 "},"4":{"x_min":19,"x_max":680,"ha":749,"o":"m 404 254 q 211 249 335 254 q 19 244 88 244 l 28 296 q 180 467 62 334 q 419 736 299 600 q 571 910 539 872 q 589 906 576 908 q 614 902 602 904 l 666 910 q 610 699 631 780 q 565 510 589 618 l 531 337 q 606 339 558 337 q 680 345 654 342 q 660 278 660 310 l 660 244 q 573 249 625 244 q 514 254 520 254 q 486 117 496 178 q 476 0 476 56 l 411 6 q 370 3 396 6 q 338 0 343 0 q 370 117 354 54 q 404 254 386 181 m 424 337 q 489 598 452 441 q 531 773 527 755 l 387 620 q 228 439 244 457 q 137 332 212 420 l 424 337 "},"p":{"x_min":-81.9375,"x_max":699,"ha":765,"o":"m -22 -145 q 65 268 20 53 q 127 654 111 483 q 187 648 156 648 q 222 650 202 648 q 251 654 241 652 l 225 556 q 329 639 269 609 q 455 669 389 669 q 633 589 568 669 q 699 392 699 509 q 598 110 699 234 q 343 -14 498 -14 q 223 24 276 -14 q 144 126 169 62 l 113 -25 q 82 -189 97 -103 q 50 -372 66 -274 q 18 -367 36 -370 q -13 -365 0 -365 q -46 -367 -29 -365 q -81 -372 -63 -370 q -44 -240 -59 -297 q -22 -145 -29 -184 m 574 406 q 537 542 574 484 q 425 601 500 601 q 238 487 301 601 q 175 240 175 373 q 214 112 175 163 q 327 61 254 61 q 482 135 423 61 q 553 272 542 209 q 569 366 564 335 q 574 406 574 396 "},"ψ":{"x_min":44,"x_max":976,"ha":1050,"o":"m 845 438 q 840 514 845 481 q 817 641 836 547 q 878 647 848 641 q 945 665 907 654 q 966 569 957 619 q 976 479 976 519 q 845 117 976 249 q 482 -14 714 -14 q 427 -373 449 -185 l 380 -366 q 291 -373 330 -366 l 344 -153 l 374 -9 q 136 79 228 8 q 44 288 44 149 q 59 463 44 363 q 91 655 75 563 q 123 651 105 652 q 157 650 141 650 q 195 652 174 650 q 227 655 216 654 q 179 473 196 567 q 162 291 162 379 q 218 108 162 178 q 382 39 275 39 q 459 432 428 255 q 509 786 491 609 q 543 779 523 783 q 577 775 564 775 q 603 776 594 775 q 646 786 613 777 q 597 572 620 679 q 544 302 574 465 q 495 39 513 139 q 755 150 666 39 q 845 438 845 262 "},"Ü":{"x_min":75,"x_max":993,"ha":993,"o":"m 266 927 l 349 931 q 260 608 296 763 q 208 300 224 452 l 208 275 l 208 236 q 281 98 208 147 q 448 49 354 49 q 595 80 528 49 q 720 202 661 112 q 826 525 778 291 q 873 931 873 759 l 934 927 l 993 931 q 899 528 940 723 q 820 229 858 333 q 689 53 781 125 q 426 -18 597 -18 q 177 44 280 -18 q 75 244 75 107 q 84 321 75 275 q 114 458 94 368 q 158 672 134 548 q 198 931 181 797 l 266 927 m 534 1204 q 582 1181 563 1204 q 605 1130 605 1159 q 582 1079 605 1098 q 534 1061 560 1061 q 483 1081 505 1061 q 461 1131 461 1102 q 482 1182 461 1160 q 534 1204 503 1204 m 769 1204 q 818 1182 797 1204 q 839 1129 839 1160 q 818 1080 839 1099 q 768 1061 798 1061 q 718 1081 740 1061 q 696 1131 696 1102 q 717 1182 696 1160 q 769 1204 739 1204 "},"à":{"x_min":-11,"x_max":572.328125,"ha":642,"o":"m 161 -14 q 39 29 89 -14 q -11 147 -11 72 q 97 317 -11 270 q 310 374 199 344 q 433 492 420 404 q 403 583 433 549 q 315 618 373 618 q 210 591 255 618 q 134 512 165 565 l 111 519 q 122 581 122 549 l 119 618 q 235 661 195 651 q 315 672 275 672 q 472 633 405 672 q 539 511 539 594 q 532 434 539 479 q 525 375 526 390 l 477 143 q 469 92 473 117 q 482 63 469 78 q 508 48 494 48 q 554 58 529 48 l 572 23 q 452 -10 519 -10 q 386 15 408 -10 q 358 90 365 41 q 266 11 311 37 q 161 -14 222 -14 m 418 744 l 240 876 q 213 902 225 884 q 201 936 201 919 q 218 969 201 953 q 252 985 236 985 q 281 976 268 985 q 308 953 294 968 l 474 744 l 418 744 m 103 159 q 131 86 103 115 q 204 58 159 58 q 311 99 259 58 q 375 194 363 140 l 402 345 q 176 283 250 313 q 103 159 103 254 "},"η":{"x_min":4,"x_max":667,"ha":765,"o":"m 70 6 q 31 3 55 6 q 4 0 6 0 q 90 339 55 166 q 124 655 124 512 l 183 647 q 251 655 217 647 q 216 523 228 588 q 332 629 266 590 q 475 669 398 669 q 612 623 557 669 q 667 497 667 577 q 651 376 667 437 l 558 -111 q 534 -253 547 -173 q 515 -372 520 -333 q 480 -367 495 -369 q 451 -365 465 -365 q 418 -367 437 -365 q 383 -372 399 -370 q 461 -62 427 -200 q 519 217 494 75 q 545 460 545 359 q 514 551 545 515 q 428 588 483 588 q 318 556 384 588 q 211 431 252 524 q 158 221 170 339 q 135 0 145 104 q 100 3 125 0 q 70 6 76 6 "}},"cssFontWeight":"normal","ascender":1266,"underlinePosition":-133,"cssFontStyle":"italic","boundingBox":{"yMin":-376,"xMin":-154.5625,"yMax":1265,"xMax":1518},"resolution":1000,"original_font_information":{"postscript_name":"Optimer-Oblique","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Optimer Oblique","font_family_name":"Optimer","copyright":"Copyright (c) Magenta Ltd., 2004.","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta Ltd.:Optimer Oblique:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta Ltd.","font_sub_family_name":"Oblique"},"descender":-377,"familyName":"Optimer","lineHeight":1642,"underlineThickness":20});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":41,"x_max":710,"ha":753,"o":"m 371 -15 q 131 78 222 -15 q 41 322 41 172 q 133 573 41 474 q 378 672 225 672 q 619 574 528 672 q 710 326 710 477 q 617 80 710 175 q 371 -15 525 -15 m 377 619 q 226 530 272 619 q 180 327 180 441 q 227 125 180 216 q 375 35 274 35 q 524 123 478 35 q 570 326 570 211 q 524 529 570 440 q 377 619 479 619 "},"S":{"x_min":50,"x_max":639,"ha":699,"o":"m 88 208 q 179 88 122 131 q 318 46 237 46 q 457 98 397 46 q 518 227 518 150 q 401 400 518 336 q 184 498 293 448 q 68 688 68 566 q 156 880 68 811 q 370 950 244 950 q 480 936 430 950 q 597 891 530 922 q 570 822 583 858 q 553 756 558 786 l 539 756 q 354 897 502 897 q 231 855 282 897 q 181 742 181 813 q 298 580 181 640 q 519 483 408 531 q 639 286 639 413 q 538 68 639 152 q 301 -15 438 -15 q 166 2 229 -15 q 50 59 104 19 q 68 135 62 104 q 75 205 75 166 l 88 208 "},"/":{"x_min":-36.03125,"x_max":404.15625,"ha":383,"o":"m -36 -125 l 340 1025 l 404 1024 l 28 -126 l -36 -125 "},"Τ":{"x_min":11,"x_max":713,"ha":725,"o":"m 11 839 l 15 884 l 11 932 q 194 927 72 932 q 361 922 316 922 q 544 927 421 922 q 713 932 668 932 q 707 883 707 911 q 707 861 707 870 q 713 834 707 852 q 609 850 666 843 q 504 857 552 857 l 428 857 q 426 767 428 830 q 424 701 424 704 l 428 220 q 442 0 428 122 q 362 8 401 3 q 323 5 344 8 q 282 0 301 2 q 289 132 282 40 q 296 259 296 225 l 296 683 l 296 857 q 11 839 164 857 "},"ϕ":{"x_min":41,"x_max":960,"ha":1006,"o":"m 441 -10 q 162 76 283 -10 q 41 316 41 163 q 162 562 41 470 q 441 654 283 654 q 434 838 441 719 q 427 971 427 957 q 464 965 443 968 q 503 962 485 962 q 540 965 519 962 q 578 970 560 968 q 563 654 563 824 q 839 567 719 654 q 960 324 960 481 q 841 79 960 169 q 563 -10 722 -10 q 570 -201 563 -68 q 578 -371 578 -334 q 505 -362 539 -362 q 465 -365 483 -362 q 427 -372 446 -368 q 434 -161 427 -297 q 441 -10 441 -26 m 563 39 q 757 118 690 39 q 824 330 824 198 q 750 523 824 445 q 564 601 677 601 l 563 319 l 563 39 m 441 319 l 441 601 q 253 523 326 601 q 180 330 180 446 q 245 117 180 195 q 439 39 310 39 l 441 319 "},"y":{"x_min":4.171875,"x_max":665.28125,"ha":664,"o":"m 4 654 l 86 647 l 165 654 q 202 536 188 577 q 241 431 215 495 l 363 129 l 473 413 q 552 654 519 537 q 606 647 583 647 q 665 654 633 647 q 416 125 531 388 q 223 -372 301 -137 l 187 -366 q 141 -366 163 -366 q 112 -372 122 -370 l 290 -22 q 4 654 170 294 "},"≈":{"x_min":118.0625,"x_max":1019.453125,"ha":1139,"o":"m 765 442 q 564 487 700 442 q 376 533 429 533 q 250 506 298 533 q 118 427 202 480 l 118 501 q 245 572 180 545 q 376 600 311 600 q 574 553 438 600 q 765 507 709 507 q 888 534 829 507 q 1019 614 947 562 l 1019 538 q 892 467 954 493 q 765 442 830 442 m 759 214 q 568 260 702 214 q 376 307 433 307 q 236 272 300 307 q 118 202 173 238 l 118 277 q 247 346 181 320 q 380 372 312 372 q 570 326 445 372 q 765 281 695 281 q 883 306 830 281 q 1019 388 936 331 l 1019 313 q 894 240 959 266 q 759 214 829 214 "},"Π":{"x_min":108,"x_max":927.453125,"ha":1036,"o":"m 432 846 l 263 846 q 260 634 263 781 q 257 475 257 486 q 262 236 257 395 q 268 0 268 77 q 229 3 255 0 q 188 8 202 8 q 149 3 177 8 q 108 0 121 0 q 117 239 108 70 q 126 465 126 408 q 122 711 126 620 q 108 932 119 803 q 285 926 166 932 q 464 921 405 921 q 695 926 541 921 q 927 932 849 932 q 915 793 921 871 q 909 659 909 716 l 909 504 q 917 245 909 427 q 926 0 926 62 q 887 4 913 0 q 847 8 860 8 q 810 5 827 8 q 768 0 792 2 q 773 259 768 94 q 778 469 778 423 l 778 731 l 773 846 l 432 846 "},"ΐ":{"x_min":-41,"x_max":384,"ha":342,"o":"m 105 333 l 105 520 q 104 566 105 544 q 97 654 103 588 q 141 647 131 648 q 166 647 152 647 q 234 654 196 647 q 225 555 226 599 q 224 437 224 510 l 224 406 q 229 194 224 337 q 234 0 234 51 q 202 3 217 1 q 166 5 186 5 q 128 3 149 5 q 97 0 108 1 q 101 165 97 51 q 105 333 105 279 m 18 865 q 61 846 43 865 q 80 804 80 828 q 61 761 80 779 q 18 743 43 743 q -22 761 -4 743 q -41 804 -41 779 q -22 846 -41 828 q 18 865 -4 865 m 172 929 q 189 969 179 956 q 225 982 199 982 q 256 971 243 982 q 270 941 270 961 q 257 904 270 919 l 149 743 l 117 743 l 172 929 m 324 865 q 366 846 348 865 q 384 804 384 828 q 366 761 384 779 q 324 743 348 743 q 281 761 298 743 q 265 804 265 779 q 281 846 265 828 q 324 865 298 865 "},"g":{"x_min":32,"x_max":672,"ha":688,"o":"m 81 123 q 112 201 81 169 q 193 252 144 233 l 193 262 q 97 329 130 277 q 64 447 64 380 q 141 610 64 549 q 323 672 218 672 q 421 661 357 672 q 500 650 486 651 l 672 654 l 672 582 q 599 592 635 587 q 537 597 563 597 q 607 458 607 548 q 527 294 607 356 q 342 232 447 232 q 291 235 319 232 q 255 239 262 239 q 208 220 228 239 q 188 173 188 201 q 221 120 188 136 q 296 104 254 104 l 427 104 q 603 56 534 104 q 672 -93 672 9 q 560 -299 672 -226 q 309 -372 448 -372 q 115 -327 199 -372 q 32 -183 32 -283 q 76 -62 32 -110 q 193 8 121 -13 q 112 51 143 25 q 81 123 81 77 m 332 278 q 439 332 401 278 q 478 457 478 386 q 441 575 478 525 q 338 625 404 625 q 232 570 271 625 q 194 447 194 515 q 230 328 194 379 q 332 278 266 278 m 337 -316 q 491 -270 423 -316 q 559 -141 559 -224 q 500 -29 559 -62 q 353 3 441 3 q 199 -36 263 3 q 136 -162 136 -76 q 195 -277 136 -238 q 337 -316 255 -316 "},"²":{"x_min":15.28125,"x_max":412.5,"ha":496,"o":"m 297 744 q 270 830 297 795 q 197 866 244 866 q 120 837 149 866 q 83 761 90 808 l 76 759 q 54 802 68 780 q 31 837 40 824 q 210 901 108 901 q 334 862 278 901 q 390 758 390 824 q 282 568 390 656 q 111 428 174 479 l 293 428 q 350 431 316 428 q 412 439 384 434 l 406 397 l 412 356 l 304 361 l 111 361 l 15 355 l 15 378 q 220 567 144 484 q 297 744 297 651 "},"Κ":{"x_min":108,"x_max":856.625,"ha":821,"o":"m 255 314 q 261 132 255 250 q 268 0 268 13 q 229 4 255 0 q 188 8 202 8 q 148 4 174 8 q 108 0 121 0 q 117 239 108 70 q 126 465 126 408 q 122 712 126 621 q 108 932 119 803 q 153 928 124 932 q 188 925 183 925 q 231 928 203 925 q 267 932 259 932 l 255 671 l 255 499 q 480 693 375 586 q 687 932 585 800 q 732 932 710 932 q 777 932 753 932 l 837 932 q 606 727 720 830 q 389 522 493 623 q 525 358 465 426 q 666 202 586 290 q 856 0 747 115 l 746 0 q 692 -1 716 0 q 644 -8 669 -2 q 571 92 610 44 q 477 204 532 140 l 255 459 l 255 314 "},"ë":{"x_min":40,"x_max":646.9375,"ha":681,"o":"m 406 42 q 602 130 523 42 l 621 130 q 613 93 617 112 q 609 47 609 73 q 496 0 558 14 q 369 -15 435 -15 q 130 73 220 -15 q 40 311 40 162 q 126 562 40 456 q 355 669 212 669 q 564 590 481 669 q 646 386 646 512 l 644 331 q 438 333 562 331 q 313 335 315 335 l 179 331 q 235 127 179 212 q 406 42 291 42 m 219 929 q 271 906 249 929 q 294 854 294 884 q 273 800 294 822 q 221 778 252 778 q 166 800 190 778 q 143 854 143 822 q 165 906 143 884 q 219 929 187 929 m 460 929 q 513 906 492 929 q 534 854 534 884 q 513 799 534 820 q 461 778 493 778 q 407 800 429 778 q 385 854 385 822 q 407 906 385 884 q 460 929 429 929 m 513 392 l 513 437 q 470 563 513 509 q 356 618 427 618 q 233 552 271 618 q 183 390 195 487 l 513 392 "},"e":{"x_min":41,"x_max":645.15625,"ha":681,"o":"m 406 42 q 602 130 523 42 l 618 125 q 611 86 614 104 q 609 44 609 67 q 497 0 561 14 q 370 -15 434 -15 q 130 73 220 -15 q 41 311 41 161 q 127 563 41 455 q 356 672 214 672 q 563 592 482 672 q 645 385 645 512 l 643 331 l 313 335 l 179 331 q 235 126 179 210 q 406 42 291 42 m 511 392 l 513 436 q 470 563 513 509 q 356 618 427 618 q 230 553 268 618 q 179 388 191 488 l 511 392 "},"ό":{"x_min":41,"x_max":710,"ha":753,"o":"m 371 -15 q 131 78 222 -15 q 41 322 41 172 q 133 573 41 474 q 378 672 225 672 q 619 574 528 672 q 710 326 710 477 q 617 80 710 175 q 371 -15 525 -15 m 524 943 q 558 974 542 964 q 595 985 574 985 q 632 969 618 985 q 646 932 646 954 q 632 897 646 911 q 591 866 618 883 l 390 743 l 341 743 l 524 943 m 377 619 q 226 530 272 619 q 180 327 180 441 q 227 125 180 216 q 375 35 274 35 q 524 123 478 35 q 570 326 570 211 q 524 529 570 440 q 377 619 479 619 "},"J":{"x_min":-71,"x_max":277,"ha":385,"o":"m 118 -40 q 131 62 128 9 q 135 184 135 115 q 132 462 135 325 q 127 690 130 598 q 111 932 123 782 q 159 928 129 932 q 193 925 189 925 q 238 927 221 925 q 277 932 256 929 q 268 665 277 843 q 260 457 260 487 l 260 165 q 260 107 260 147 q 260 48 260 68 q 169 -155 260 -88 q -62 -222 79 -222 l -71 -180 q 50 -134 1 -166 q 118 -40 100 -102 "},"»":{"x_min":43,"x_max":543,"ha":607,"o":"m 196 322 l 43 607 l 81 645 l 303 322 l 81 0 l 43 37 l 196 322 m 436 322 l 283 607 l 322 645 l 543 322 l 322 0 l 283 37 l 436 322 "},"©":{"x_min":80,"x_max":1058,"ha":1139,"o":"m 816 905 q 992 726 927 841 q 1058 481 1058 611 q 912 138 1058 283 q 567 -6 766 -6 q 225 139 370 -6 q 80 481 80 284 q 224 826 80 681 q 569 971 368 971 q 816 905 698 971 m 569 918 q 263 788 392 918 q 134 481 134 659 q 261 175 134 306 q 566 45 389 45 q 872 174 741 45 q 1004 478 1004 304 q 947 699 1004 596 q 787 859 890 801 q 569 918 684 918 m 570 724 q 441 652 483 724 q 399 490 399 581 q 438 320 399 396 q 560 245 478 245 q 664 278 621 245 q 723 370 707 311 l 798 370 q 720 232 788 283 q 561 181 653 181 q 379 268 446 181 q 313 476 313 355 q 380 694 313 604 q 571 785 447 785 q 717 738 656 785 q 793 610 779 691 l 715 610 q 664 692 705 660 q 570 724 624 724 "},"ώ":{"x_min":39.71875,"x_max":1028.9375,"ha":1068,"o":"m 534 528 l 596 528 l 594 305 q 616 117 594 193 q 722 42 638 42 q 850 118 811 42 q 888 293 888 194 q 829 502 888 409 q 664 654 769 594 l 717 648 q 805 654 766 648 q 967 510 905 606 q 1028 304 1028 413 q 948 81 1028 177 q 744 -15 867 -15 q 622 16 678 -15 q 534 104 566 47 q 445 16 500 48 q 323 -15 389 -15 q 118 83 196 -15 q 39 311 39 182 q 100 511 39 419 q 262 654 161 604 q 303 650 278 651 q 349 648 327 648 l 402 654 q 238 501 296 593 q 179 291 179 409 q 218 116 179 191 q 348 42 257 42 q 419 68 390 42 q 461 138 448 94 q 472 216 469 175 q 475 303 475 257 q 472 420 475 353 q 469 529 470 486 l 534 528 m 681 943 q 714 974 699 964 q 751 985 730 985 q 788 969 774 985 q 802 932 802 954 q 787 896 802 912 q 746 866 773 880 l 547 743 l 498 743 l 681 943 "},"≥":{"x_min":176.1875,"x_max":963,"ha":1139,"o":"m 963 462 l 176 196 l 176 266 l 850 491 l 176 718 l 176 788 l 963 522 l 963 462 m 963 26 l 176 26 l 176 93 l 963 93 l 963 26 "},"^":{"x_min":0,"x_max":390,"ha":403,"o":"m 150 978 l 239 978 l 390 743 l 344 743 l 195 875 l 49 743 l 0 743 l 150 978 "},"«":{"x_min":48,"x_max":549.390625,"ha":607,"o":"m 152 326 l 309 42 l 268 3 l 48 326 l 268 649 l 309 611 l 152 326 m 394 326 l 549 42 l 509 3 l 288 326 l 509 649 l 549 611 l 394 326 "},"D":{"x_min":108,"x_max":991,"ha":1043,"o":"m 126 465 q 117 704 126 536 q 108 931 108 872 l 210 929 q 350 934 251 929 q 477 939 449 939 q 579 936 553 939 q 709 917 605 934 q 902 775 814 900 q 991 483 991 650 q 852 130 991 261 q 491 0 713 0 l 378 0 l 228 7 l 203 7 q 148 4 173 7 q 108 0 123 1 q 117 239 108 70 q 126 465 126 408 m 402 64 q 724 168 609 64 q 840 479 840 273 q 730 774 840 671 q 428 878 621 878 q 345 873 400 878 q 262 869 289 869 l 255 497 l 255 376 l 262 76 q 332 68 292 72 q 402 64 373 64 "},"w":{"x_min":4.171875,"x_max":1052.78125,"ha":1047,"o":"m 4 655 q 55 648 41 648 q 86 647 69 647 q 165 654 120 647 q 190 540 176 587 q 238 394 204 492 l 329 141 q 498 654 419 386 q 551 647 526 647 q 609 654 577 647 q 637 544 620 601 q 677 420 654 487 l 770 135 l 872 413 q 911 532 893 472 q 944 654 930 592 q 979 647 970 648 q 1000 647 988 647 q 1052 654 1022 647 q 961 457 1002 555 q 871 235 919 359 q 782 0 824 110 q 755 3 772 0 q 733 6 738 6 q 708 3 724 6 q 686 0 692 0 q 650 127 667 72 q 611 239 632 183 l 518 494 q 432 258 475 382 q 348 0 390 134 q 325 3 336 1 q 297 5 313 5 q 269 3 284 5 q 245 0 254 1 q 162 244 200 140 q 86 447 125 347 q 4 655 47 546 "},"$":{"x_min":89,"x_max":666,"ha":749,"o":"m 139 186 l 146 186 q 213 91 165 119 q 342 50 261 63 l 342 416 q 142 515 196 458 q 89 648 89 573 q 164 819 89 752 q 342 886 239 886 q 330 985 342 936 l 359 979 l 404 984 q 400 924 401 945 q 399 886 399 904 q 510 874 457 886 q 605 834 562 862 q 582 788 592 808 q 555 729 572 768 l 547 729 q 495 810 535 783 q 399 837 455 837 l 399 520 q 610 419 554 479 q 666 277 666 359 q 588 87 666 164 q 399 0 511 9 l 399 -32 q 399 -63 399 -48 q 405 -125 400 -78 l 368 -121 l 329 -125 l 342 0 q 210 13 273 0 q 98 58 147 27 l 139 186 m 342 836 q 237 787 278 826 q 196 686 196 748 q 237 588 196 626 q 342 537 279 551 l 342 836 m 553 231 q 513 337 553 300 q 399 402 473 375 l 399 51 q 512 113 471 66 q 553 231 553 159 "},"‧":{"x_min":134,"x_max":309,"ha":446,"o":"m 222 636 q 284 611 259 636 q 309 548 309 586 q 284 486 309 512 q 222 461 260 461 q 160 486 186 461 q 134 548 134 511 q 159 610 134 584 q 222 636 185 636 "},"\\":{"x_min":-36,"x_max":403.140625,"ha":383,"o":"m -36 1025 l 28 1025 l 403 -125 l 340 -125 l -36 1025 "},"Ι":{"x_min":109,"x_max":271,"ha":385,"o":"m 127 465 q 123 711 127 620 q 109 932 120 803 q 154 927 129 929 q 190 925 179 925 q 238 928 209 925 q 271 931 266 931 q 263 788 271 887 q 256 659 256 690 l 256 448 l 256 283 q 263 135 256 238 q 271 0 271 31 q 231 3 258 0 q 190 8 204 8 q 151 5 172 8 q 109 0 129 2 q 118 239 109 70 q 127 465 127 408 "},"Ύ":{"x_min":-1,"x_max":1204.5625,"ha":1165,"o":"m 758 177 l 758 386 q 651 570 717 458 q 543 750 585 681 q 431 931 501 819 q 483 928 449 931 q 522 925 518 925 q 572 927 550 925 q 606 931 593 930 q 666 800 633 866 q 735 676 699 734 l 849 475 q 968 688 910 575 q 1086 931 1027 801 l 1142 926 q 1174 927 1160 926 q 1204 931 1187 929 q 1014 627 1099 769 l 891 415 l 891 240 q 894 101 891 198 q 897 0 897 5 q 860 4 885 1 q 820 6 835 6 q 778 4 793 6 q 743 0 763 2 q 753 88 748 36 q 758 177 758 140 m 182 943 q 215 974 200 964 q 252 985 231 985 q 289 969 274 985 q 305 932 305 954 q 290 896 305 911 q 248 866 275 882 l 48 743 l -1 743 l 182 943 "},"’":{"x_min":90.28125,"x_max":305.5625,"ha":374,"o":"m 169 859 q 197 923 177 894 q 250 953 218 953 q 288 939 272 953 q 305 902 305 925 q 295 857 305 882 q 269 811 284 833 l 120 568 l 90 576 l 169 859 "},"Ν":{"x_min":98,"x_max":911.890625,"ha":1011,"o":"m 112 230 q 114 486 112 315 q 117 741 117 656 l 117 950 l 166 950 q 326 766 239 865 q 468 606 413 667 q 610 451 524 544 l 821 227 l 821 604 q 816 765 821 685 q 803 931 812 845 l 855 927 l 911 931 q 901 831 906 884 q 897 741 897 779 q 894 413 897 619 q 892 165 892 207 l 892 -15 l 849 -15 q 730 125 796 50 q 589 281 664 201 l 193 702 l 193 330 q 212 -1 193 169 l 149 2 l 98 -1 q 108 125 105 79 q 112 230 112 170 "},"-":{"x_min":58.328125,"x_max":388.890625,"ha":449,"o":"m 58 390 l 388 390 l 388 273 l 58 273 l 58 390 "},"Q":{"x_min":51,"x_max":1074.609375,"ha":1119,"o":"m 566 -14 q 194 113 338 -14 q 51 465 51 241 q 192 820 51 690 q 559 950 333 950 q 892 853 754 950 q 1047 654 1031 756 q 1065 525 1062 551 q 1068 462 1068 499 q 1065 405 1068 429 q 1050 305 1062 381 q 960 144 1038 229 q 748 6 881 59 l 930 -112 q 1004 -161 963 -136 q 1074 -200 1045 -186 q 1008 -228 1035 -214 q 951 -267 980 -243 q 876 -208 912 -234 q 803 -154 841 -182 l 606 -14 l 566 -14 m 202 468 q 290 163 202 283 q 559 43 379 43 q 826 163 738 43 q 915 468 915 284 q 825 770 915 651 q 559 889 735 889 q 348 826 429 889 q 225 638 267 763 q 202 468 202 552 "},"ς":{"x_min":44,"x_max":613.453125,"ha":644,"o":"m 305 -206 q 350 -218 325 -218 q 447 -177 407 -218 q 487 -79 487 -136 q 376 55 487 4 q 159 156 266 106 q 44 365 44 231 q 143 585 44 499 q 380 672 242 672 q 506 658 448 672 q 613 616 564 645 q 587 500 595 559 l 562 500 q 501 586 549 557 q 391 616 453 616 q 233 551 296 616 q 170 393 170 486 q 216 271 170 320 q 339 196 263 223 l 467 149 q 569 76 531 119 q 608 -27 608 34 q 522 -206 608 -136 q 321 -293 437 -276 l 305 -206 "},"M":{"x_min":55,"x_max":1165,"ha":1238,"o":"m 190 950 l 243 950 q 331 772 291 851 q 412 612 370 693 q 504 436 454 532 l 626 214 q 742 435 671 298 q 882 711 813 572 q 1001 950 952 850 l 1052 950 q 1082 649 1067 791 q 1118 341 1098 508 q 1165 0 1139 174 q 1121 8 1139 5 q 1088 11 1103 11 q 1049 6 1071 11 q 1008 0 1027 2 q 998 226 1008 109 q 974 461 989 343 q 944 695 959 579 l 748 312 q 610 0 665 152 l 594 1 l 576 0 q 227 685 402 364 l 188 307 q 172 128 175 179 q 168 0 168 77 q 138 4 157 1 q 110 6 118 6 q 81 4 93 6 q 55 0 68 2 q 121 333 89 168 q 171 652 152 498 q 190 950 190 805 "},"Ψ":{"x_min":73,"x_max":995.609375,"ha":1071,"o":"m 609 0 q 561 5 585 2 q 532 8 536 8 q 494 5 515 8 q 456 0 474 2 q 463 151 456 45 q 470 297 470 258 q 180 383 287 297 q 73 650 73 469 l 73 817 l 73 932 q 139 925 110 925 q 180 928 155 925 q 212 931 206 931 q 200 818 204 861 q 197 723 197 774 l 197 688 l 197 638 q 268 438 197 508 q 472 368 340 368 l 473 481 q 464 736 473 566 q 456 932 456 905 q 499 927 481 929 q 532 925 518 925 q 577 927 557 925 q 609 931 596 930 q 601 635 609 841 q 594 368 594 429 l 645 372 q 816 465 765 372 q 868 691 868 559 q 861 829 868 740 q 855 932 855 919 q 896 927 878 929 q 924 925 913 925 q 971 927 955 925 q 995 931 987 930 l 994 839 l 994 675 q 894 388 994 480 q 594 297 794 297 q 601 142 594 249 q 609 0 609 35 "},"C":{"x_min":51,"x_max":881.5625,"ha":913,"o":"m 828 737 q 552 889 733 889 q 295 768 383 889 q 207 469 207 647 q 299 177 207 305 q 551 50 391 50 q 710 86 637 50 q 855 189 783 122 l 870 183 q 858 122 862 147 q 855 69 855 97 q 521 -15 699 -15 q 180 116 309 -15 q 51 462 51 248 q 189 820 51 690 q 556 950 327 950 q 719 930 638 950 q 881 875 799 911 q 857 809 867 843 q 845 737 847 775 l 828 737 "},"œ":{"x_min":39,"x_max":1195.9375,"ha":1226,"o":"m 359 -15 q 125 76 212 -15 q 39 318 39 167 q 125 571 39 470 q 362 672 212 672 q 514 640 441 672 q 641 551 588 608 q 897 672 741 672 q 1110 593 1024 672 q 1195 390 1195 515 l 1193 331 q 1022 332 1108 331 q 851 334 935 333 l 708 331 q 765 124 708 206 q 944 42 822 42 q 1145 130 1068 42 l 1162 130 q 1155 85 1158 110 q 1151 47 1152 60 q 1036 0 1100 14 q 904 -15 973 -15 q 754 12 819 -15 q 641 106 689 40 q 514 14 584 44 q 359 -15 444 -15 m 376 625 q 224 534 270 625 q 179 328 179 443 q 224 124 179 215 q 369 34 269 34 q 521 127 470 34 q 573 328 573 221 q 526 534 573 443 q 376 625 480 625 m 1061 392 l 1061 423 q 1017 561 1061 504 q 894 618 973 618 q 756 549 805 618 q 708 390 708 480 l 1061 392 "},"!":{"x_min":136,"x_max":312,"ha":449,"o":"m 223 156 q 285 130 259 156 q 312 68 312 105 q 285 8 312 32 q 223 -15 259 -15 q 161 9 187 -15 q 136 68 136 33 q 160 130 136 105 q 223 156 185 156 m 150 752 l 144 841 q 161 919 144 888 q 223 950 178 950 q 282 925 260 950 q 304 863 304 901 q 299 808 304 845 q 295 752 295 770 l 246 250 q 223 250 238 250 q 199 250 206 250 l 150 752 "},"ç":{"x_min":34,"x_max":614.5625,"ha":644,"o":"m 607 119 l 592 41 q 490 -2 549 10 q 363 -15 431 -15 q 130 80 227 -15 q 34 313 34 175 q 132 576 34 480 q 397 672 231 672 q 511 659 456 672 q 614 617 565 647 q 597 558 604 587 q 584 492 589 528 l 570 492 q 507 587 547 553 q 406 622 467 622 q 234 534 293 622 q 176 329 176 447 q 238 126 176 211 q 414 42 300 42 q 592 124 521 42 l 607 119 m 202 -212 q 350 -246 273 -246 q 414 -232 388 -246 q 440 -186 440 -219 q 421 -142 440 -158 q 373 -126 402 -126 l 323 -126 l 323 0 l 367 0 l 367 -77 l 404 -73 q 495 -102 457 -73 q 533 -183 533 -132 q 494 -270 533 -237 q 402 -303 456 -303 q 286 -294 335 -303 q 184 -261 238 -286 l 202 -212 "},"{":{"x_min":116,"x_max":567.390625,"ha":683,"o":"m 491 909 q 421 874 445 909 q 397 792 397 839 l 397 744 l 397 583 q 368 434 397 493 q 263 354 339 376 q 367 272 338 332 q 397 125 397 212 l 397 -35 q 414 -149 397 -108 q 471 -197 431 -191 q 529 -204 511 -204 q 567 -204 548 -204 l 567 -276 q 387 -239 459 -276 q 315 -105 315 -203 l 315 -28 l 315 132 q 296 244 315 194 q 240 303 277 294 q 176 314 204 312 q 116 317 148 317 l 116 389 q 270 429 225 389 q 315 576 315 469 l 315 737 q 348 918 315 870 q 450 977 381 966 q 567 983 503 983 l 567 912 l 491 909 "},"X":{"x_min":0,"x_max":739,"ha":739,"o":"m 200 285 l 318 456 q 18 932 159 718 q 63 929 33 932 q 109 926 94 926 q 168 929 147 926 q 198 932 188 932 q 296 743 244 841 q 391 568 348 644 l 489 726 q 597 932 548 825 q 627 927 614 929 q 661 926 641 926 q 693 929 671 926 q 728 932 715 932 q 616 781 673 862 q 524 652 558 700 l 427 512 q 523 347 480 419 q 614 197 566 275 q 739 0 662 119 q 686 3 719 0 q 647 6 652 6 q 595 4 618 6 q 558 0 572 1 q 459 197 512 97 q 353 398 405 298 l 265 249 q 174 96 193 130 q 127 0 155 62 q 89 3 113 0 q 62 6 65 6 q 26 4 43 6 q 0 0 9 1 l 200 285 "},"ô":{"x_min":40,"x_max":712,"ha":753,"o":"m 371 -15 q 131 79 223 -15 q 40 322 40 173 q 133 572 40 473 q 380 672 227 672 q 621 575 530 672 q 712 327 712 479 q 619 80 712 175 q 371 -15 527 -15 m 332 978 l 421 978 l 572 743 l 525 743 l 376 875 l 229 743 l 180 743 l 332 978 m 377 622 q 227 532 274 622 q 180 327 180 442 q 227 125 180 216 q 375 35 274 35 q 524 124 478 35 q 570 327 570 214 q 524 531 570 441 q 377 622 479 622 "},"#":{"x_min":78,"x_max":972.4375,"ha":1050,"o":"m 497 647 l 675 647 l 791 969 l 877 968 l 761 647 l 972 647 l 948 576 l 736 576 l 671 390 l 896 390 l 873 319 l 644 319 l 531 0 l 446 0 l 559 319 l 382 319 l 266 0 l 182 0 l 294 319 l 78 319 l 102 390 l 320 390 l 386 576 l 151 576 l 176 647 l 410 647 l 526 969 l 610 969 l 497 647 m 472 576 l 407 390 l 587 390 l 650 576 l 472 576 "},"ι":{"x_min":96,"x_max":233.5,"ha":342,"o":"m 104 333 l 104 521 q 103 567 104 545 q 96 655 102 589 q 141 648 130 648 q 165 647 151 647 q 233 654 196 647 q 224 555 226 599 q 223 437 223 511 l 223 406 q 228 194 223 337 q 233 0 233 51 q 201 3 216 1 q 165 5 185 5 q 127 3 148 5 q 96 0 107 1 q 100 165 96 51 q 104 333 104 279 "},"Ά":{"x_min":12,"x_max":910.609375,"ha":896,"o":"m 328 639 l 458 950 q 489 944 464 947 q 522 950 507 944 q 655 613 602 745 q 770 331 709 480 q 910 0 832 181 q 859 3 891 0 q 823 6 827 6 q 772 4 795 6 q 735 0 749 1 q 672 195 692 135 q 613 353 652 255 l 449 358 l 285 353 l 233 205 q 173 0 194 94 l 116 5 q 76 2 91 5 q 55 0 62 0 q 146 211 101 105 q 229 404 192 317 q 328 639 266 490 m 195 943 q 228 974 213 964 q 265 985 244 985 q 302 969 287 985 q 318 932 318 954 q 303 896 318 911 q 261 866 288 882 l 61 743 l 12 743 l 195 943 m 450 419 l 585 425 l 451 761 l 318 425 l 450 419 "},")":{"x_min":65.671875,"x_max":332,"ha":449,"o":"m 332 376 q 271 81 332 217 q 96 -183 211 -54 q 65 -151 83 -164 q 193 104 155 -16 q 232 386 232 226 q 191 661 232 533 q 65 918 150 789 q 96 950 87 933 q 273 681 215 816 q 332 376 332 545 "},"ε":{"x_min":53,"x_max":567,"ha":628,"o":"m 506 516 q 433 591 467 566 q 353 616 400 616 q 261 580 298 616 q 225 492 225 545 q 268 406 225 437 q 372 375 311 375 l 418 375 l 417 349 l 417 310 l 343 317 q 236 282 280 317 q 193 183 193 247 q 238 77 193 117 q 352 38 284 38 q 460 66 410 38 q 543 144 510 94 q 553 99 547 121 q 567 54 558 76 q 452 2 515 19 q 321 -15 388 -15 q 134 31 216 -15 q 53 175 53 78 q 95 286 53 246 q 214 355 137 326 q 127 408 162 370 q 93 497 93 445 q 165 625 93 579 q 323 672 237 672 q 430 654 378 672 q 541 604 481 637 q 522 564 529 584 q 506 516 514 545 "},"Δ":{"x_min":0,"x_max":899,"ha":899,"o":"m 899 0 q 701 5 833 0 q 501 11 569 11 q 251 5 418 11 q 0 0 84 0 q 225 473 126 251 q 407 932 323 696 q 432 929 415 932 q 457 926 448 926 q 482 927 471 926 q 505 932 493 929 q 691 449 601 664 q 899 0 782 234 m 281 429 q 158 90 212 259 q 290 84 201 90 q 423 79 379 79 l 456 79 q 587 81 550 79 q 692 90 625 83 l 651 188 l 576 383 l 422 778 l 281 429 "},"â":{"x_min":43,"x_max":655.5,"ha":649,"o":"m 234 -15 q 98 33 153 -15 q 43 162 43 82 q 106 303 43 273 q 303 364 169 333 q 444 448 437 395 q 403 568 444 521 q 288 616 362 616 q 191 587 233 616 q 124 507 149 559 l 95 520 l 104 591 q 202 651 144 631 q 323 672 261 672 q 500 622 444 672 q 557 455 557 573 l 557 133 q 567 69 557 84 q 618 54 577 54 q 655 58 643 54 l 655 26 q 594 5 626 14 q 537 -6 562 -3 q 438 85 453 -6 q 342 10 388 35 q 234 -15 296 -15 m 279 978 l 368 978 l 522 743 l 471 743 l 323 875 l 176 743 l 126 743 l 279 978 m 176 186 q 204 98 176 133 q 284 64 232 64 q 390 107 342 64 q 438 212 438 151 l 438 345 q 239 293 303 319 q 176 186 176 268 "},"}":{"x_min":114,"x_max":567,"ha":683,"o":"m 369 576 q 405 438 369 487 q 527 389 441 389 l 567 389 l 567 317 q 415 278 461 317 q 369 132 369 239 l 369 -28 q 319 -229 369 -182 q 114 -276 270 -276 l 114 -204 q 252 -172 218 -204 q 286 -83 286 -141 l 286 -35 l 286 125 q 314 271 286 212 q 418 354 342 329 q 311 435 337 382 q 286 584 286 488 l 286 745 q 268 860 286 818 q 191 913 251 903 l 114 913 l 114 983 l 186 982 q 287 960 242 982 q 346 900 331 938 q 365 822 362 862 q 369 737 369 783 l 369 576 "},"‰":{"x_min":28,"x_max":1511,"ha":1536,"o":"m 799 0 q 647 62 708 0 q 586 218 586 124 q 647 372 586 309 q 799 436 709 436 q 949 373 888 436 q 1011 223 1011 311 q 995 130 1011 176 q 918 35 972 70 q 799 0 865 0 m 1298 0 q 1146 62 1206 0 q 1087 218 1087 124 q 1148 372 1087 308 q 1299 436 1209 436 q 1449 373 1388 436 q 1511 223 1511 311 q 1494 130 1511 169 q 1418 34 1472 69 q 1298 0 1365 0 m 241 448 q 89 510 150 448 q 28 663 28 573 q 89 820 28 755 q 241 885 151 885 q 391 823 329 885 q 453 672 453 761 q 434 580 453 620 q 359 483 412 518 q 241 448 307 448 m 863 1015 l 227 -125 l 158 -125 l 793 1015 l 863 1015 m 897 260 q 872 353 897 310 q 798 397 847 397 q 718 340 737 397 q 700 202 700 283 q 719 86 700 133 q 798 40 738 40 q 866 73 840 40 q 892 149 892 106 q 895 206 894 169 q 897 260 897 242 m 339 684 q 319 797 339 750 q 244 845 300 845 q 161 784 182 845 q 141 645 141 723 q 165 540 141 590 q 237 490 189 490 q 303 524 278 490 q 334 598 329 558 q 339 684 339 638 m 1397 260 q 1373 356 1397 315 q 1297 397 1349 397 q 1218 340 1237 397 q 1200 202 1200 283 q 1219 87 1200 134 q 1297 40 1238 40 q 1366 73 1340 40 q 1392 149 1392 106 q 1395 206 1394 169 q 1397 260 1397 242 "},"Ä":{"x_min":-16,"x_max":839.5625,"ha":826,"o":"m 258 638 l 389 951 q 420 945 395 948 q 453 951 438 945 q 570 651 500 826 q 688 360 640 477 q 839 0 736 242 q 788 3 820 0 q 752 6 756 6 q 702 3 728 6 q 665 0 675 0 q 599 204 615 158 q 542 357 584 251 l 378 357 l 214 357 l 161 207 q 130 109 147 170 q 102 0 113 47 l 45 5 q 20 4 29 5 q -16 0 10 4 q 72 203 29 105 q 169 427 115 301 q 258 638 222 552 m 293 1208 q 345 1186 325 1208 q 366 1133 366 1164 q 345 1080 366 1102 q 293 1058 324 1058 q 239 1080 261 1058 q 217 1133 217 1102 q 239 1185 217 1163 q 293 1208 261 1208 m 535 1208 q 587 1186 565 1208 q 609 1133 609 1164 q 587 1080 609 1103 q 535 1058 565 1058 q 481 1080 503 1058 q 459 1133 459 1102 q 481 1185 459 1163 q 535 1208 503 1208 m 378 421 l 515 425 l 381 762 l 247 425 l 378 421 "},"a":{"x_min":44,"x_max":653.734375,"ha":647,"o":"m 233 -15 q 99 33 154 -15 q 44 162 44 82 q 105 302 44 273 q 302 363 167 331 q 444 448 437 395 q 401 567 444 519 q 287 615 359 615 q 190 587 231 615 q 124 508 149 560 l 95 519 l 103 591 q 204 651 148 631 q 323 672 260 672 q 499 623 443 672 q 555 457 555 574 l 555 132 q 566 70 555 86 q 616 55 578 55 l 653 55 l 653 26 q 594 4 624 15 q 536 -6 564 -6 q 468 15 492 -6 q 436 83 445 38 q 341 9 387 34 q 233 -15 294 -15 m 175 185 q 204 99 175 135 q 282 63 234 63 q 389 106 343 63 q 436 211 436 150 l 436 344 q 239 294 304 320 q 175 185 175 268 "},"—":{"x_min":226.390625,"x_max":1138.890625,"ha":1367,"o":"m 226 375 l 1138 375 l 1138 292 l 226 292 l 226 375 "},"=":{"x_min":169.4375,"x_max":969.453125,"ha":1139,"o":"m 969 499 l 169 499 l 169 564 l 969 564 l 969 499 m 969 248 l 169 248 l 169 315 l 969 315 l 969 248 "},"N":{"x_min":98,"x_max":911.890625,"ha":1011,"o":"m 112 230 q 114 486 112 315 q 117 741 117 656 l 117 950 l 166 950 q 326 766 239 865 q 468 606 413 667 q 610 451 524 544 l 821 227 l 821 604 q 816 765 821 685 q 803 931 812 845 l 855 927 l 911 931 q 901 831 906 884 q 897 741 897 779 q 894 413 897 619 q 892 165 892 207 l 892 -15 l 849 -15 q 730 125 796 50 q 589 281 664 201 l 193 702 l 193 330 q 212 -1 193 169 l 149 2 l 98 -1 q 108 125 105 79 q 112 230 112 170 "},"ρ":{"x_min":65,"x_max":711,"ha":758,"o":"m 191 -99 q 195 -235 191 -145 q 199 -371 199 -325 q 161 -367 169 -367 q 134 -366 153 -366 q 96 -368 116 -366 q 65 -372 76 -370 q 70 -190 65 -311 q 76 -8 76 -69 q 73 166 76 67 q 70 329 71 265 q 148 578 70 484 q 380 672 226 672 q 617 573 524 672 q 711 329 711 474 q 625 84 711 184 q 396 -15 539 -15 q 285 7 334 -15 q 191 78 236 30 l 191 -99 m 377 619 q 231 533 271 619 q 191 327 191 447 q 241 103 191 169 q 376 38 292 38 q 525 125 479 38 q 571 326 571 212 q 525 529 571 440 q 377 619 480 619 "},"2":{"x_min":22,"x_max":622,"ha":749,"o":"m 449 648 q 410 789 449 727 q 298 851 371 851 q 173 802 219 851 q 128 676 128 753 l 118 673 q 84 740 100 712 q 47 799 69 768 q 313 911 158 911 q 507 844 426 911 q 589 667 589 777 q 527 479 589 555 q 315 258 466 404 l 169 118 l 442 118 q 531 123 485 118 q 622 136 576 129 q 617 102 619 117 q 616 68 616 87 q 617 37 616 54 q 622 0 619 20 q 438 4 562 0 q 252 8 315 8 q 142 7 195 8 q 22 0 88 6 l 22 40 q 234 238 155 158 q 380 430 312 319 q 449 648 449 541 "},"ü":{"x_min":90,"x_max":664,"ha":754,"o":"m 653 498 q 653 329 653 443 q 653 158 653 215 q 664 0 653 82 q 631 3 647 1 q 598 5 616 5 q 563 3 583 5 q 533 0 544 1 l 538 118 q 440 18 494 52 q 312 -15 385 -15 q 148 50 201 -15 q 96 229 96 115 l 96 354 l 96 516 l 90 655 q 120 650 103 651 q 158 648 136 648 q 192 650 175 648 q 227 656 210 651 q 220 446 227 592 q 213 247 213 300 q 247 115 213 163 q 362 68 281 68 q 477 113 428 68 q 531 217 525 159 q 538 340 538 274 q 533 520 538 394 q 528 655 528 647 q 558 650 542 651 q 596 648 574 648 q 629 650 612 648 q 663 656 646 651 q 653 498 653 574 m 253 929 q 307 906 285 929 q 330 854 330 884 q 309 800 330 822 q 257 778 288 778 q 202 800 225 778 q 180 854 180 823 q 200 906 180 884 q 253 929 221 929 m 498 929 q 549 906 527 929 q 572 854 572 884 q 551 799 572 820 q 499 778 531 778 q 444 800 466 778 q 422 854 422 822 q 444 906 422 884 q 498 929 466 929 "},"Z":{"x_min":6.9375,"x_max":801.390625,"ha":828,"o":"m 6 36 q 222 324 112 176 q 425 605 333 473 l 597 857 l 433 857 q 59 836 247 857 l 65 883 l 59 932 q 262 927 134 932 q 427 922 390 922 q 622 927 491 922 q 801 932 754 932 l 801 904 q 594 629 709 785 q 399 361 479 473 q 201 77 319 249 l 427 77 q 581 82 520 77 q 801 103 643 87 l 797 68 l 795 54 l 797 34 l 801 0 q 504 4 683 0 q 325 8 326 8 q 166 4 272 8 q 6 0 61 0 l 6 36 "},"u":{"x_min":90,"x_max":662.21875,"ha":754,"o":"m 653 497 l 653 156 q 654 83 653 122 q 661 -1 656 44 q 623 3 632 2 q 596 4 615 4 q 572 3 581 4 q 533 -1 563 2 l 536 117 q 439 18 491 51 q 313 -15 386 -15 q 147 48 199 -15 q 96 227 96 112 l 96 352 l 96 516 l 90 654 q 158 647 125 647 q 189 648 178 647 q 226 654 200 650 q 220 450 226 586 q 215 246 215 314 q 248 114 215 163 q 361 66 281 66 q 473 112 426 66 q 527 225 520 158 q 536 340 536 282 q 531 497 536 393 q 527 654 527 601 q 572 647 563 647 q 595 647 581 647 q 626 648 616 647 q 662 654 637 650 l 653 497 "},"k":{"x_min":97,"x_max":677.5625,"ha":683,"o":"m 104 656 q 100 873 104 741 q 97 1025 97 1005 q 164 1018 134 1018 q 231 1025 196 1018 q 227 825 231 962 q 223 622 223 687 l 223 377 l 245 377 q 507 654 391 506 q 563 647 538 647 q 616 647 589 647 q 648 652 638 651 l 349 398 l 548 165 q 608 93 577 127 q 677 19 638 59 l 677 0 q 628 3 659 0 q 591 6 597 6 q 544 3 567 6 q 510 0 520 0 q 438 101 473 54 q 360 197 402 148 l 269 308 l 252 324 l 223 326 q 227 164 223 272 q 231 0 231 55 q 200 4 215 2 q 164 5 185 5 q 127 3 146 5 q 97 0 108 1 q 100 386 97 151 q 104 656 104 620 "},"Η":{"x_min":109,"x_max":928.453125,"ha":1039,"o":"m 257 317 q 262 142 257 253 q 267 0 267 30 q 226 3 253 0 q 188 8 200 8 q 147 3 174 8 q 109 0 121 0 q 116 243 109 72 q 124 465 124 415 q 116 710 124 540 q 109 932 109 880 q 152 929 121 932 q 188 926 183 926 q 231 929 200 926 q 267 932 262 932 q 262 719 267 854 q 257 547 257 584 q 406 544 301 547 q 517 541 511 541 q 666 544 562 541 q 777 547 770 547 q 773 786 777 641 q 769 932 769 930 q 813 929 781 932 q 849 926 845 926 q 893 929 861 926 q 928 932 924 932 q 914 795 920 866 q 909 659 909 723 l 909 505 q 918 252 909 420 q 927 0 927 84 q 887 4 913 0 q 848 8 861 8 q 811 5 829 8 q 769 0 793 2 q 773 103 769 41 q 777 176 777 166 l 777 317 l 777 465 q 604 466 692 465 q 430 469 517 467 l 257 465 l 257 317 "},"Α":{"x_min":-15.28125,"x_max":838.890625,"ha":825,"o":"m 257 639 l 387 950 q 402 945 395 947 q 417 944 409 944 q 452 950 437 944 q 576 629 536 733 q 686 359 617 526 q 838 0 755 192 q 789 3 820 0 q 751 6 758 6 q 700 4 723 6 q 663 0 677 1 q 600 199 622 137 q 543 353 579 260 l 377 358 l 215 353 l 162 205 q 130 110 145 160 q 101 0 115 59 l 44 5 q 6 2 20 5 q -15 0 -8 0 q 76 211 30 105 q 158 404 121 318 q 257 639 195 490 m 378 419 l 513 425 l 379 761 l 246 425 l 378 419 "},"ß":{"x_min":94,"x_max":726,"ha":765,"o":"m 107 431 l 107 611 l 107 761 q 200 948 118 872 q 395 1025 283 1025 q 543 979 478 1025 q 608 852 608 933 q 530 709 608 783 q 453 586 453 636 q 589 457 453 547 q 726 259 726 368 q 648 64 726 143 q 453 -15 570 -15 q 379 -6 418 -15 q 309 15 339 1 l 334 128 l 348 127 q 405 70 368 91 q 485 49 442 49 q 583 92 544 49 q 622 193 622 135 q 484 365 622 280 q 347 525 347 450 q 433 667 347 561 q 520 838 520 773 q 483 939 520 899 q 386 979 446 979 q 269 924 313 979 q 226 795 226 870 l 226 629 l 226 344 q 229 141 226 265 q 233 1 233 18 q 196 4 219 1 q 166 8 173 8 q 123 5 142 8 q 94 1 105 2 q 100 250 94 91 q 107 431 107 409 "},"é":{"x_min":40,"x_max":646.9375,"ha":681,"o":"m 406 42 q 602 130 523 42 l 621 130 q 613 93 617 112 q 609 47 609 73 q 496 0 558 14 q 369 -15 435 -15 q 130 73 220 -15 q 40 311 40 162 q 126 562 40 456 q 355 669 212 669 q 564 590 481 669 q 646 386 646 512 l 644 331 q 438 333 562 331 q 313 335 315 335 l 179 331 q 235 127 179 212 q 406 42 291 42 m 406 945 q 440 976 424 966 q 477 986 455 986 q 528 934 528 986 q 513 895 528 912 q 471 866 498 879 l 272 743 l 222 743 l 406 945 m 513 392 l 513 437 q 470 563 513 509 q 356 618 427 618 q 233 552 271 618 q 183 390 195 487 l 513 392 "},"s":{"x_min":68,"x_max":531,"ha":593,"o":"m 117 161 q 172 69 130 102 q 276 36 214 36 q 378 67 333 36 q 424 152 424 98 q 334 260 424 224 q 168 320 251 290 q 79 460 79 366 q 147 612 79 552 q 310 672 216 672 q 400 660 355 672 q 500 627 446 649 l 461 508 l 448 508 q 401 587 433 561 q 314 614 369 614 q 223 584 262 614 q 185 505 185 555 q 358 375 185 427 q 531 197 531 322 q 450 39 531 93 q 259 -15 369 -15 q 68 23 162 -15 l 103 161 l 117 161 "},"B":{"x_min":109,"x_max":751,"ha":801,"o":"m 127 559 q 109 931 127 759 l 203 929 q 338 932 244 929 q 438 935 432 935 q 629 883 549 935 q 709 726 709 832 q 638 579 709 633 q 464 504 567 524 q 673 438 595 490 q 751 268 751 387 q 639 66 751 133 q 382 0 528 0 l 232 6 q 162 3 211 6 q 109 0 113 0 q 118 287 109 86 q 127 559 127 488 m 256 257 l 256 149 l 261 61 l 337 57 q 526 108 450 57 q 602 266 602 159 q 523 428 602 386 q 312 471 444 471 l 256 471 l 256 257 m 569 706 q 507 834 569 788 q 361 879 446 879 l 261 875 q 252 709 252 798 l 252 522 q 476 558 384 522 q 569 706 569 595 "},"…":{"x_min":119,"x_max":1005,"ha":1160,"o":"m 191 130 q 244 108 223 130 q 266 55 266 87 q 244 5 266 25 q 191 -15 223 -15 q 139 4 160 -15 q 119 55 119 23 q 139 108 119 87 q 191 130 159 130 m 560 130 q 612 108 591 130 q 634 55 634 87 q 612 5 634 25 q 560 -15 591 -15 q 507 4 528 -15 q 487 55 487 23 q 507 109 487 88 q 560 130 528 130 m 930 130 q 983 108 962 130 q 1005 55 1005 87 q 983 5 1005 25 q 930 -15 962 -15 q 878 4 899 -15 q 858 55 858 23 q 878 108 858 87 q 930 130 898 130 "},"?":{"x_min":128,"x_max":520,"ha":601,"o":"m 307 156 q 367 130 342 156 q 392 68 392 105 q 367 7 392 30 q 307 -15 343 -15 q 244 8 269 -15 q 220 68 220 32 q 244 130 220 105 q 307 156 269 156 m 329 250 q 214 290 261 250 q 168 399 168 331 q 287 595 168 479 q 406 776 406 712 q 371 858 406 823 q 292 894 337 894 q 207 867 243 894 q 162 794 171 840 l 150 794 q 142 835 146 822 q 128 894 139 849 q 210 936 165 922 q 305 950 255 950 q 457 893 394 950 q 520 748 520 837 q 398 550 520 657 q 276 370 276 443 q 293 316 276 337 q 343 296 310 296 q 397 302 372 296 l 383 256 q 357 251 365 252 q 329 250 348 250 "},"H":{"x_min":108,"x_max":927.453125,"ha":1036,"o":"m 258 318 q 263 143 258 255 q 268 0 268 30 q 229 3 255 0 q 188 8 202 8 q 148 3 174 8 q 108 0 121 0 q 117 239 108 70 q 126 465 126 408 q 122 711 126 620 q 108 932 119 803 q 153 928 124 932 q 188 925 183 925 q 231 928 204 925 q 268 932 259 932 q 263 719 268 854 q 258 547 258 584 l 517 543 l 777 547 q 773 786 777 641 q 769 932 769 930 q 814 928 785 932 q 848 925 842 925 q 894 928 864 925 q 927 932 923 932 q 914 798 919 868 q 909 659 909 729 l 909 448 l 909 283 q 916 135 909 238 q 924 0 924 31 q 885 4 911 0 q 846 8 860 8 q 807 4 832 8 q 769 0 781 0 q 773 101 769 37 q 777 177 777 164 l 777 318 l 777 468 q 604 468 720 468 q 431 468 489 468 l 258 468 l 258 318 "},"ν":{"x_min":0,"x_max":632,"ha":654,"o":"m 319 8 q 296 5 309 8 q 272 0 283 2 q 200 206 234 120 q 0 654 165 291 q 84 647 45 647 q 113 647 98 647 q 168 654 127 648 q 252 402 204 529 l 360 131 q 469 358 440 267 q 499 520 499 448 q 492 579 499 543 q 477 641 486 615 q 552 649 527 645 q 613 661 576 652 q 628 611 625 623 q 632 576 632 598 q 621 501 632 536 q 560 373 611 466 q 461 190 509 280 q 372 0 412 99 q 345 3 363 0 q 319 8 327 8 "},"î":{"x_min":-25,"x_max":365.328125,"ha":340,"o":"m 104 144 l 104 522 l 97 655 q 138 650 113 651 q 167 649 162 649 q 233 655 206 649 q 225 506 225 581 q 229 254 225 423 q 233 0 233 84 q 201 3 216 1 q 164 5 186 5 q 127 3 146 5 q 97 0 108 1 l 104 144 m 125 978 l 214 978 l 365 743 l 319 743 l 170 875 l 24 743 l -25 743 l 125 978 "},"c":{"x_min":36,"x_max":613.78125,"ha":644,"o":"m 606 119 l 594 41 q 493 -3 548 7 q 365 -15 438 -15 q 131 79 227 -15 q 36 312 36 173 q 134 576 36 480 q 399 672 233 672 q 513 658 459 672 q 613 616 566 645 q 586 492 597 563 l 571 492 q 510 586 550 553 q 406 619 470 619 q 235 532 294 619 q 176 327 176 445 q 237 125 176 209 q 415 42 299 42 q 594 122 520 42 l 606 119 "},"¶":{"x_min":18,"x_max":531,"ha":590,"o":"m 298 968 l 531 968 l 531 910 l 473 910 l 473 4 l 415 4 l 415 910 l 305 910 l 305 4 l 247 4 l 247 558 q 99 602 163 558 q 27 690 36 645 q 18 744 18 734 q 90 896 18 824 q 298 968 163 968 "},"β":{"x_min":96,"x_max":737.671875,"ha":779,"o":"m 160 -365 q 129 -367 151 -365 q 96 -369 107 -369 q 100 -253 96 -325 q 104 -169 104 -182 l 104 101 l 104 565 q 168 898 104 771 q 419 1025 232 1025 q 605 960 525 1025 q 686 787 686 895 q 641 641 686 705 q 522 548 597 577 q 682 454 626 515 q 737 290 737 394 q 648 73 737 162 q 431 -15 559 -15 q 324 3 372 -15 q 226 61 276 22 q 224 -44 226 19 q 223 -110 223 -107 l 230 -369 q 193 -367 220 -369 q 160 -365 166 -365 m 356 564 q 507 618 458 564 q 557 779 557 673 q 520 917 557 859 q 407 975 483 975 q 279 906 323 975 q 234 752 234 838 q 232 613 234 701 q 230 506 230 524 l 226 355 l 230 230 q 275 94 230 147 q 406 41 321 41 q 552 116 504 41 q 600 297 600 192 q 550 443 600 386 q 412 499 500 499 q 361 497 384 499 q 327 493 337 494 l 329 516 l 329 565 l 356 564 "},"Μ":{"x_min":55,"x_max":1165,"ha":1238,"o":"m 190 950 l 243 950 q 331 772 291 851 q 412 612 370 693 q 504 436 454 532 l 626 214 q 742 435 671 298 q 882 711 813 572 q 1001 950 952 850 l 1052 950 q 1082 649 1067 791 q 1118 341 1098 508 q 1165 0 1139 174 q 1121 8 1139 5 q 1088 11 1103 11 q 1049 6 1071 11 q 1008 0 1027 2 q 998 226 1008 109 q 974 461 989 343 q 944 695 959 579 l 748 312 q 610 0 665 152 l 594 1 l 576 0 q 227 685 402 364 l 188 307 q 172 128 175 179 q 168 0 168 77 q 138 4 157 1 q 110 6 118 6 q 81 4 93 6 q 55 0 68 2 q 121 333 89 168 q 171 652 152 498 q 190 950 190 805 "},"Ό":{"x_min":-1,"x_max":1305,"ha":1356,"o":"m 288 465 q 429 820 288 690 q 796 950 570 950 q 1129 853 991 950 q 1284 654 1268 757 q 1302 525 1299 551 q 1305 462 1305 500 q 1302 402 1305 426 q 1284 277 1299 379 q 1131 80 1268 175 q 797 -15 993 -15 q 684 -10 733 -15 q 541 29 635 -5 q 367 186 447 64 q 288 465 288 308 m 182 943 q 215 974 200 964 q 251 985 230 985 q 289 969 274 985 q 304 932 304 954 q 290 896 304 911 q 247 866 275 882 l 48 743 l -1 743 l 182 943 m 439 468 q 527 162 439 282 q 796 42 616 42 q 1063 162 975 42 q 1152 468 1152 283 q 1062 770 1152 651 q 796 889 972 889 q 585 826 666 889 q 462 639 504 764 q 439 468 439 552 "},"Ή":{"x_min":-1.390625,"x_max":1233.046875,"ha":1341,"o":"m 564 316 q 569 142 564 254 q 574 0 574 30 q 535 4 561 0 q 494 8 508 8 q 454 4 480 8 q 414 0 427 0 q 423 239 414 70 q 432 465 432 408 q 428 711 432 620 q 414 931 425 802 q 459 928 430 931 q 494 924 489 924 q 537 928 510 924 q 574 931 565 931 q 569 719 574 854 q 564 547 564 584 l 823 543 l 1083 547 q 1078 786 1083 641 q 1074 931 1074 930 q 1119 928 1091 931 q 1153 924 1148 924 q 1199 928 1170 924 q 1233 931 1228 931 q 1221 798 1226 868 q 1217 659 1217 729 l 1215 448 l 1217 283 q 1225 135 1217 238 q 1233 0 1233 31 q 1194 4 1220 0 q 1154 8 1167 8 q 1113 4 1140 8 q 1075 0 1087 0 q 1078 100 1075 37 q 1082 176 1082 163 l 1083 316 l 1083 465 q 910 466 1026 465 q 737 468 795 468 l 564 465 l 564 316 m 181 943 q 215 974 200 964 q 251 985 230 985 q 288 969 273 985 q 304 932 304 954 q 289 896 304 911 q 247 866 275 882 l 47 743 l -1 743 l 181 943 "},"•":{"x_min":204.171875,"x_max":795.828125,"ha":1003,"o":"m 501 789 q 709 702 622 789 q 795 493 795 615 q 709 286 795 372 q 501 201 623 201 q 290 286 377 201 q 204 493 204 371 q 226 605 204 550 q 312 725 248 661 q 501 789 376 789 "},"¥":{"x_min":32,"x_max":699,"ha":750,"o":"m 313 278 q 176 273 268 278 q 50 268 83 268 l 50 335 q 147 332 82 335 q 246 329 213 329 l 313 329 l 313 436 l 176 436 l 50 432 l 50 495 q 182 492 90 495 q 281 490 275 490 l 126 743 l 32 888 l 91 883 l 191 887 q 225 814 208 845 q 287 699 241 783 l 397 512 q 477 653 433 570 q 592 887 521 736 l 643 883 l 699 887 l 625 773 l 554 655 l 454 490 q 593 492 496 490 q 697 495 690 495 l 697 431 l 434 436 l 434 330 l 572 329 q 636 332 595 329 q 697 335 678 335 l 697 268 l 568 278 l 434 278 q 434 143 434 208 q 442 0 435 77 l 365 5 l 299 0 q 310 131 307 54 q 313 278 313 208 "},"(":{"x_min":114,"x_max":380.5625,"ha":449,"o":"m 114 388 q 175 684 114 545 q 351 950 237 822 q 380 918 361 933 q 253 660 291 782 q 215 379 215 538 q 256 103 215 231 q 380 -151 297 -25 q 351 -183 361 -167 q 173 84 232 -50 q 114 388 114 219 "},"U":{"x_min":101,"x_max":919.0625,"ha":1015,"o":"m 181 926 q 228 929 195 926 q 263 932 262 932 q 251 804 255 853 q 248 697 248 755 l 248 457 q 315 134 248 212 q 515 57 382 57 q 733 129 654 57 q 813 334 813 201 l 813 458 l 813 655 q 810 797 813 733 q 798 931 807 862 q 827 927 813 929 q 859 926 841 926 q 888 929 868 926 q 919 932 907 932 q 905 779 909 853 q 902 600 902 705 l 902 366 q 793 81 902 178 q 492 -15 685 -15 q 211 66 307 -15 q 116 323 116 147 l 116 425 l 116 698 q 109 826 116 759 q 101 931 103 893 q 138 927 120 929 q 181 926 156 926 "},"γ":{"x_min":-12,"x_max":701,"ha":681,"o":"m 642 647 q 701 654 669 647 q 593 440 633 520 q 502 247 553 359 l 411 48 l 411 -90 q 415 -238 411 -138 q 419 -372 419 -337 l 372 -366 q 282 -372 325 -366 q 287 -195 282 -313 q 292 -33 292 -76 q 260 192 292 47 q 170 460 229 338 q 39 583 111 583 l -12 579 l -10 608 l -12 638 q 43 662 14 653 q 101 672 71 672 q 279 554 234 672 q 398 143 324 437 q 496 393 439 244 q 590 654 553 541 q 615 648 607 650 q 642 647 623 647 "},"α":{"x_min":41,"x_max":827.109375,"ha":846,"o":"m 705 352 q 803 -1 763 155 l 739 1 l 673 -1 l 632 172 q 521 36 593 87 q 356 -15 448 -15 q 129 81 217 -15 q 41 316 41 177 q 130 569 41 467 q 368 672 220 672 q 537 622 464 672 q 659 486 610 573 q 711 654 691 569 l 770 650 l 827 654 q 763 505 792 576 q 705 352 734 434 m 377 619 q 226 530 272 619 q 181 326 181 442 q 223 124 181 214 q 367 34 265 34 q 528 137 480 34 q 601 323 577 240 q 527 531 578 444 q 377 619 475 619 "},"F":{"x_min":108,"x_max":613.5625,"ha":671,"o":"m 258 316 q 263 142 258 254 q 268 0 268 30 q 229 3 255 0 q 188 8 202 8 q 148 3 174 8 q 108 0 121 0 q 117 239 108 70 q 126 465 126 408 q 122 711 126 620 q 108 932 119 802 l 358 928 l 613 931 l 610 886 l 613 836 q 505 855 549 851 q 388 860 460 860 l 260 860 l 258 671 l 258 528 l 398 528 q 587 541 480 528 l 584 497 l 587 451 l 394 463 l 258 463 l 258 316 "},"­":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 0 374 l 683 374 l 683 289 l 0 289 l 0 374 "},":":{"x_min":134,"x_max":309,"ha":446,"o":"m 222 636 q 284 611 259 636 q 309 548 309 586 q 284 486 309 512 q 222 461 260 461 q 160 486 186 461 q 134 548 134 511 q 159 610 134 584 q 222 636 185 636 m 221 156 q 283 131 257 156 q 309 69 309 107 q 284 8 309 32 q 221 -15 259 -15 q 159 9 185 -15 q 134 69 134 33 q 159 131 134 107 q 221 156 185 156 "},"Χ":{"x_min":0,"x_max":739,"ha":739,"o":"m 200 285 l 318 456 q 18 932 159 718 q 63 929 33 932 q 109 926 94 926 q 168 929 147 926 q 198 932 188 932 q 296 743 244 841 q 391 568 348 644 l 489 726 q 597 932 548 825 q 627 927 614 929 q 661 926 641 926 q 693 929 671 926 q 728 932 715 932 q 616 781 673 862 q 524 652 558 700 l 427 512 q 523 347 480 419 q 614 197 566 275 q 739 0 662 119 q 686 3 719 0 q 647 6 652 6 q 595 4 618 6 q 558 0 572 1 q 459 197 512 97 q 353 398 405 298 l 265 249 q 174 96 193 130 q 127 0 155 62 q 89 3 113 0 q 62 6 65 6 q 26 4 43 6 q 0 0 9 1 l 200 285 "},"*":{"x_min":94,"x_max":580,"ha":675,"o":"m 336 940 q 367 944 349 940 q 389 948 385 948 q 368 850 375 902 q 362 747 362 799 q 522 873 442 800 q 548 812 539 829 q 580 778 556 796 q 386 702 485 750 q 476 661 427 680 q 575 629 524 643 q 521 535 539 587 q 441 604 478 573 q 362 661 403 634 q 369 564 362 615 q 391 459 377 513 q 360 463 379 459 q 336 467 340 467 q 306 463 325 467 q 282 459 288 459 q 304 568 296 522 q 313 661 313 615 q 152 535 221 602 q 128 589 138 569 q 97 630 117 608 q 185 661 140 643 q 287 704 231 679 q 189 746 234 728 q 94 777 145 763 q 125 818 113 795 q 150 873 137 841 q 227 805 184 839 q 313 747 269 771 q 309 810 313 784 q 282 950 305 836 q 310 942 297 945 q 336 940 324 940 "},"°":{"x_min":176,"x_max":508,"ha":683,"o":"m 176 889 q 228 1010 176 961 q 355 1060 280 1060 q 460 1011 413 1060 q 508 904 508 962 q 455 785 508 839 q 337 731 402 731 q 222 776 269 731 q 176 889 176 821 m 241 880 q 266 805 241 836 q 336 775 292 775 q 413 811 386 775 q 441 899 441 847 q 417 985 441 952 q 343 1018 393 1018 q 281 995 307 1018 q 247 940 254 973 q 241 880 241 906 "},"V":{"x_min":0,"x_max":852.78125,"ha":853,"o":"m 190 477 l 74 759 l 0 932 l 83 926 q 134 929 98 926 q 173 931 170 931 q 206 829 187 884 q 248 704 224 773 l 308 548 l 454 153 l 586 502 q 729 931 666 713 l 790 927 l 852 931 q 643 467 748 720 q 470 0 538 215 q 445 4 457 1 q 418 6 432 6 q 384 3 399 6 q 366 0 368 0 q 279 256 331 123 q 190 477 226 389 "},"Ξ":{"x_min":58.328125,"x_max":818.0625,"ha":878,"o":"m 437 821 q 258 817 377 821 q 77 813 138 813 q 84 851 83 838 q 84 872 84 864 q 77 932 84 900 q 256 928 137 932 q 437 924 376 924 q 618 928 497 924 q 797 932 738 932 l 791 872 q 794 842 791 861 q 797 813 797 822 q 619 817 738 813 q 437 821 500 821 m 470 430 q 335 425 440 430 q 183 421 230 421 q 187 456 186 433 q 188 481 188 480 q 183 543 188 515 q 304 538 215 543 q 437 533 394 533 q 572 538 481 533 q 694 543 662 543 l 687 482 l 694 421 q 572 425 650 421 q 470 430 494 430 m 437 8 q 250 4 376 8 q 58 0 123 0 l 63 63 l 58 129 q 268 124 134 129 q 437 119 401 119 q 636 124 502 119 q 818 129 769 129 l 813 63 l 818 0 q 627 4 754 0 q 437 8 501 8 "}," ":{"x_min":0,"x_max":0,"ha":375},"Ϋ":{"x_min":-26,"x_max":746,"ha":708,"o":"m 299 177 l 299 387 q 190 577 235 501 q 87 747 146 652 q -26 931 29 841 q 23 929 -13 931 q 65 926 61 926 q 110 929 78 926 q 146 931 143 931 q 208 800 175 866 q 278 676 241 734 l 391 475 q 627 931 519 693 l 683 927 q 721 929 701 927 q 746 931 741 931 q 652 786 702 866 q 557 627 602 705 l 432 415 l 432 241 q 435 97 432 184 q 439 0 439 10 q 395 4 414 2 q 361 6 376 6 q 320 4 336 6 q 286 0 304 2 q 294 88 290 36 q 299 177 299 141 m 233 1208 q 286 1187 265 1208 q 307 1133 307 1166 q 285 1080 307 1103 q 233 1058 263 1058 q 179 1080 202 1058 q 157 1133 157 1103 q 179 1186 157 1164 q 233 1208 202 1208 m 475 1208 q 528 1186 506 1208 q 550 1133 550 1164 q 528 1080 550 1103 q 475 1058 506 1058 q 422 1080 444 1058 q 400 1133 400 1102 q 421 1186 400 1164 q 475 1208 443 1208 "},"0":{"x_min":48,"x_max":699,"ha":749,"o":"m 372 909 q 621 773 544 909 q 699 451 699 637 q 627 116 699 252 q 372 -19 556 -19 q 120 114 193 -19 q 48 444 48 247 q 120 774 48 639 q 372 909 193 909 m 187 365 q 226 137 187 238 q 373 37 266 37 q 457 62 421 37 q 519 142 494 88 q 552 271 545 196 q 559 455 559 346 q 526 736 559 622 q 371 851 493 851 q 245 783 280 851 q 198 647 210 716 q 187 444 187 577 l 187 365 "},"”":{"x_min":104.171875,"x_max":570.828125,"ha":625,"o":"m 184 858 q 211 924 193 898 q 265 951 230 951 q 320 903 316 951 q 310 856 320 881 q 283 812 300 831 l 136 568 l 104 576 l 184 858 m 433 858 q 468 928 452 905 q 516 951 483 951 q 555 938 540 951 q 570 903 570 926 q 561 859 570 881 q 536 812 552 837 l 387 568 l 355 576 l 433 858 "},"@":{"x_min":78,"x_max":1289,"ha":1367,"o":"m 906 640 l 970 640 l 876 266 l 864 203 q 886 157 864 172 q 940 142 908 142 q 1136 262 1062 142 q 1211 513 1211 383 q 1067 801 1211 693 q 735 909 923 909 q 324 753 495 909 q 154 362 154 598 q 301 1 154 135 q 679 -132 448 -132 q 904 -99 791 -132 q 1105 -6 1016 -67 l 1129 -43 q 923 -150 1033 -113 q 694 -188 812 -188 q 258 -43 439 -188 q 78 350 78 100 q 273 791 78 614 q 737 969 469 969 q 1122 843 955 969 q 1289 507 1289 717 q 1187 214 1289 346 q 930 82 1086 82 q 835 103 879 82 q 792 170 792 124 l 792 203 q 709 116 762 150 q 595 82 655 82 q 439 139 493 82 q 386 302 386 197 q 471 553 386 441 q 692 665 556 665 q 797 639 754 665 q 864 556 840 613 l 906 640 m 849 477 q 796 572 835 535 q 701 609 758 609 q 529 511 592 609 q 467 297 467 413 q 503 184 467 230 q 605 139 540 139 q 733 188 679 139 q 807 313 787 238 l 849 477 "},"Ί":{"x_min":-1.390625,"x_max":580.0625,"ha":690,"o":"m 433 465 q 429 711 433 620 q 414 931 426 802 q 461 927 435 929 q 498 925 487 925 q 546 928 517 925 q 580 931 575 931 q 572 788 580 887 q 564 659 564 690 l 562 448 l 564 283 q 572 135 564 238 q 580 0 580 31 q 539 4 567 0 q 498 8 512 8 q 457 5 480 8 q 414 0 435 2 q 423 239 414 70 q 433 465 433 408 m 181 943 q 215 974 200 964 q 251 985 230 985 q 288 969 273 985 q 304 932 304 954 q 289 896 304 911 q 247 866 275 882 l 47 743 l -1 743 l 181 943 "},"ö":{"x_min":40,"x_max":712,"ha":753,"o":"m 371 -15 q 131 79 223 -15 q 40 322 40 173 q 133 572 40 473 q 380 672 227 672 q 621 575 530 672 q 712 327 712 479 q 619 80 712 175 q 371 -15 527 -15 m 253 929 q 307 906 285 929 q 330 854 330 884 q 309 800 330 822 q 257 778 288 778 q 202 800 225 778 q 180 854 180 823 q 200 906 180 884 q 253 929 221 929 m 498 929 q 549 906 527 929 q 572 854 572 884 q 551 799 572 820 q 499 778 531 778 q 444 800 466 778 q 422 854 422 822 q 444 906 422 884 q 498 929 466 929 m 377 622 q 227 532 274 622 q 180 327 180 442 q 227 125 180 216 q 375 35 274 35 q 524 124 478 35 q 570 327 570 214 q 524 531 570 441 q 377 622 479 622 "},"i":{"x_min":91.765625,"x_max":244,"ha":342,"o":"m 100 144 l 100 520 l 93 654 q 161 648 130 648 q 194 649 182 648 q 229 654 207 650 q 221 579 224 616 q 219 505 219 543 q 224 240 219 417 q 229 0 229 63 q 197 3 212 1 q 161 5 181 5 q 116 2 131 5 q 91 0 100 0 l 100 144 m 168 963 q 223 940 202 963 q 244 881 244 917 q 222 831 244 849 q 168 813 200 813 q 115 833 137 813 q 93 885 93 853 q 113 941 93 919 q 168 963 134 963 "},"Β":{"x_min":109,"x_max":751,"ha":801,"o":"m 127 559 q 109 931 127 759 l 203 929 q 338 932 244 929 q 438 935 432 935 q 629 883 549 935 q 709 726 709 832 q 638 579 709 633 q 464 504 567 524 q 673 438 595 490 q 751 268 751 387 q 639 66 751 133 q 382 0 528 0 l 232 6 q 162 3 211 6 q 109 0 113 0 q 118 287 109 86 q 127 559 127 488 m 256 257 l 256 149 l 261 61 l 337 57 q 526 108 450 57 q 602 266 602 159 q 523 428 602 386 q 312 471 444 471 l 256 471 l 256 257 m 569 706 q 507 834 569 788 q 361 879 446 879 l 261 875 q 252 709 252 798 l 252 522 q 476 558 384 522 q 569 706 569 595 "},"≤":{"x_min":176,"x_max":962.703125,"ha":1139,"o":"m 288 491 l 962 266 l 962 196 l 176 462 l 176 521 l 962 788 l 962 718 l 288 491 m 962 26 l 176 26 l 176 93 l 962 93 l 962 26 "},"υ":{"x_min":79,"x_max":703,"ha":774,"o":"m 703 397 q 596 110 703 236 q 332 -15 489 -15 q 145 54 211 -15 q 79 244 79 123 l 83 430 q 81 542 83 486 q 79 654 80 598 l 146 650 l 217 654 q 209 503 217 608 q 202 366 202 398 l 202 261 q 240 105 202 168 q 369 43 279 43 q 523 133 476 43 q 571 341 571 223 q 548 493 571 418 q 488 645 526 568 q 550 648 529 645 q 627 659 571 650 q 703 397 703 538 "},"]":{"x_min":83,"x_max":332,"ha":449,"o":"m 209 -154 l 83 -158 l 85 -129 l 85 -98 q 183 -104 128 -104 l 229 -104 l 232 386 l 232 880 l 185 880 q 134 877 162 880 q 83 872 107 874 l 85 903 l 85 932 l 205 929 l 332 929 q 326 852 332 909 q 321 766 321 794 l 321 455 l 321 2 l 332 -158 l 209 -154 "},"m":{"x_min":91,"x_max":1075,"ha":1167,"o":"m 101 155 l 101 494 q 98 568 101 529 q 91 654 96 606 q 155 647 123 647 l 221 654 l 216 537 q 317 638 261 604 q 450 672 373 672 q 629 547 581 672 q 733 639 677 606 q 860 672 789 672 q 1018 606 968 672 q 1069 429 1069 540 l 1069 298 l 1069 136 l 1075 0 q 1038 3 1063 0 q 1006 6 1013 6 q 968 3 992 6 q 938 0 943 0 q 944 203 938 68 q 950 406 950 338 q 918 536 950 486 q 810 587 887 587 q 699 540 745 587 q 648 452 653 493 q 642 376 643 410 q 641 326 641 342 l 641 314 q 644 132 641 258 q 647 0 647 6 q 607 4 621 2 q 581 5 593 5 q 542 2 570 5 q 514 0 515 0 q 519 168 514 55 q 524 321 524 280 l 524 406 q 490 534 524 482 q 383 587 457 587 q 273 541 314 587 q 223 436 231 496 q 216 314 216 376 q 219 133 216 244 q 222 0 222 22 q 183 3 207 0 q 154 6 159 6 q 117 4 134 6 q 91 0 100 1 l 101 155 "},"χ":{"x_min":-1,"x_max":725.390625,"ha":713,"o":"m 500 426 q 554 536 528 476 q 607 654 580 595 l 675 650 l 725 652 q 623 507 672 586 q 519 330 573 427 l 444 197 q 575 -85 507 55 q 719 -371 643 -227 q 665 -371 701 -371 q 611 -371 629 -371 l 560 -371 q 444 -115 497 -230 q 358 72 392 -1 l 255 -95 q 178 -237 208 -174 q 125 -371 147 -299 l 62 -371 l 0 -371 q 125 -192 68 -278 q 240 -5 182 -106 l 324 136 l 201 402 q 146 519 174 460 q 43 587 103 587 l -1 584 l -1 638 q 128 672 57 672 q 222 627 181 672 q 292 522 264 583 l 359 374 l 411 260 l 500 426 "},"8":{"x_min":59,"x_max":689,"ha":749,"o":"m 110 696 q 187 853 110 797 q 370 909 264 909 q 558 854 480 909 q 636 694 636 800 q 589 575 636 621 q 467 510 543 529 l 467 499 q 630 413 572 475 q 689 247 689 351 q 597 51 689 120 q 374 -18 505 -18 q 149 48 239 -18 q 59 247 59 115 q 118 414 59 347 q 281 499 178 480 l 281 510 q 157 570 205 521 q 110 696 110 619 m 371 531 q 472 577 437 531 q 507 693 507 624 q 470 810 507 764 q 366 856 433 856 q 271 807 305 856 q 238 693 238 758 q 271 578 238 625 q 371 531 305 531 m 373 31 q 505 97 461 31 q 550 255 550 164 q 506 415 550 348 q 373 482 462 482 q 239 416 283 482 q 195 255 195 351 q 240 96 195 162 q 373 31 285 31 "},"ί":{"x_min":96,"x_max":429.34375,"ha":342,"o":"m 104 333 l 104 520 q 103 566 104 544 q 96 654 102 588 q 141 647 130 648 q 165 647 151 647 q 233 654 196 647 q 224 555 226 599 q 223 437 223 511 l 223 406 q 228 194 223 337 q 233 0 233 51 q 201 3 216 1 q 165 5 185 5 q 127 3 148 5 q 96 0 107 1 q 100 165 96 51 q 104 333 104 279 m 308 943 q 341 974 326 964 q 377 985 357 985 q 415 969 401 985 q 429 932 429 954 q 414 896 429 912 q 373 866 400 880 l 174 743 l 125 743 l 308 943 "},"Ζ":{"x_min":6.9375,"x_max":801.390625,"ha":828,"o":"m 6 36 q 222 324 112 176 q 425 605 333 473 l 597 857 l 433 857 q 59 836 247 857 l 65 883 l 59 932 q 262 927 134 932 q 427 922 390 922 q 622 927 491 922 q 801 932 754 932 l 801 904 q 594 629 709 785 q 399 361 479 473 q 201 77 319 249 l 427 77 q 581 82 520 77 q 801 103 643 87 l 797 68 l 795 54 l 797 34 l 801 0 q 504 4 683 0 q 325 8 326 8 q 166 4 272 8 q 6 0 61 0 l 6 36 "},"R":{"x_min":109,"x_max":806.234375,"ha":785,"o":"m 261 0 q 223 3 248 0 q 185 8 198 8 q 148 5 168 8 q 109 0 127 2 q 118 306 109 90 q 127 598 127 523 q 122 761 127 672 q 109 931 117 849 l 203 929 l 409 935 q 618 882 529 935 q 708 719 708 830 q 634 559 708 615 q 442 473 560 503 q 620 240 533 355 q 806 0 708 124 l 732 5 l 610 0 q 449 240 529 127 q 283 455 369 353 l 251 455 l 251 307 q 256 138 251 245 q 261 0 261 31 m 570 699 q 504 835 570 791 q 344 879 439 879 l 261 875 q 253 772 255 834 q 251 701 251 709 l 251 504 q 479 542 388 504 q 570 699 570 581 "},"×":{"x_min":203.984375,"x_max":938.015625,"ha":1139,"o":"m 892 775 l 938 729 l 616 406 l 938 86 l 892 38 l 571 361 l 247 38 l 203 86 l 525 407 l 204 729 l 247 775 l 570 453 l 892 775 "},"o":{"x_min":41,"x_max":710,"ha":753,"o":"m 371 -15 q 131 78 222 -15 q 41 322 41 172 q 133 573 41 474 q 378 672 225 672 q 619 574 528 672 q 710 326 710 477 q 617 80 710 175 q 371 -15 525 -15 m 377 619 q 226 530 272 619 q 180 327 180 441 q 227 125 180 216 q 375 35 274 35 q 524 123 478 35 q 570 326 570 211 q 524 529 570 440 q 377 619 479 619 "},"5":{"x_min":75,"x_max":654,"ha":749,"o":"m 116 201 q 176 77 131 120 q 303 35 221 35 q 454 98 396 35 q 512 255 512 161 q 457 407 512 346 q 313 469 403 469 q 170 417 227 469 l 150 428 l 158 526 q 158 662 158 570 q 158 801 158 754 l 147 888 l 383 879 l 412 879 q 628 887 520 879 q 624 848 626 870 q 622 818 622 826 l 626 760 l 425 761 l 227 761 q 221 631 227 717 q 216 500 216 544 q 375 536 296 536 q 572 465 491 536 q 654 279 654 394 q 550 60 654 139 q 304 -18 447 -18 q 179 -6 231 -18 q 75 34 127 4 q 101 201 87 118 l 116 201 "},"7":{"x_min":122.609375,"x_max":729.5625,"ha":749,"o":"m 461 553 l 586 770 l 362 770 q 129 755 232 770 q 133 786 132 769 q 135 820 135 804 q 128 888 135 853 l 408 883 l 729 887 l 729 871 q 463 429 582 641 q 251 0 344 216 l 194 8 q 153 5 169 8 q 122 0 137 2 q 214 146 179 91 q 333 339 249 201 q 461 553 417 477 "},"K":{"x_min":108,"x_max":856.625,"ha":821,"o":"m 255 314 q 261 132 255 250 q 268 0 268 13 q 229 4 255 0 q 188 8 202 8 q 148 4 174 8 q 108 0 121 0 q 117 239 108 70 q 126 465 126 408 q 122 712 126 621 q 108 932 119 803 q 153 928 124 932 q 188 925 183 925 q 231 928 203 925 q 267 932 259 932 l 255 671 l 255 499 q 480 693 375 586 q 687 932 585 800 q 732 932 710 932 q 777 932 753 932 l 837 932 q 606 727 720 830 q 389 522 493 623 q 525 358 465 426 q 666 202 586 290 q 856 0 747 115 l 746 0 q 692 -1 716 0 q 644 -8 669 -2 q 571 92 610 44 q 477 204 532 140 l 255 459 l 255 314 "},",":{"x_min":40.28125,"x_max":272.21875,"ha":374,"o":"m 131 75 q 160 147 144 120 q 213 175 176 175 q 272 119 272 175 q 259 67 272 91 q 231 18 245 43 l 73 -243 l 40 -231 l 131 75 "},"d":{"x_min":55,"x_max":676,"ha":758,"o":"m 668 762 l 672 137 l 676 -1 q 638 3 653 1 q 611 5 623 5 q 574 2 597 5 q 547 -1 551 -1 l 557 119 q 336 -15 484 -15 q 127 86 200 -15 q 55 330 55 187 q 127 569 55 467 q 332 672 199 672 q 457 643 402 672 q 551 556 513 615 l 551 756 l 551 789 l 551 818 q 542 1025 551 927 q 609 1018 576 1018 q 639 1019 628 1018 q 675 1025 651 1020 l 668 762 m 374 57 q 515 139 473 57 q 557 332 557 222 q 513 522 557 437 q 374 607 470 607 q 236 522 278 607 q 194 332 194 438 q 235 141 194 225 q 374 57 277 57 "},"¨":{"x_min":83.71875,"x_max":550.390625,"ha":625,"o":"m 471 659 q 441 593 458 618 q 389 568 424 568 q 350 579 365 568 q 335 613 335 591 q 346 660 335 633 q 371 706 358 687 l 519 950 l 550 940 l 471 659 m 221 659 q 192 593 211 618 q 137 568 174 568 q 83 613 83 568 q 93 658 83 637 q 119 706 103 680 l 268 950 l 300 940 l 221 659 "},"E":{"x_min":108,"x_max":613.5625,"ha":686,"o":"m 126 465 q 122 711 126 620 q 108 932 119 802 l 353 928 l 610 931 l 606 884 l 610 836 q 508 853 562 847 q 408 860 453 860 l 260 860 l 258 671 l 258 528 l 398 528 q 587 541 480 528 l 584 497 l 587 451 l 394 463 l 258 463 l 258 316 l 264 73 q 456 76 380 73 q 613 94 531 80 l 610 47 l 613 0 l 358 4 l 108 0 q 117 239 108 70 q 126 465 126 408 "},"Y":{"x_min":-28,"x_max":746,"ha":707,"o":"m 297 177 l 297 386 q 191 570 256 458 q 84 750 125 682 q -28 932 42 819 q 24 928 -9 932 q 63 925 59 925 q 112 927 91 925 q 146 932 134 930 q 207 800 174 866 q 275 676 239 735 l 389 475 q 509 688 451 575 q 627 932 567 801 l 683 926 q 715 927 701 926 q 746 932 729 929 q 555 627 640 769 l 432 415 l 432 240 q 435 101 432 198 q 438 0 438 5 q 401 4 426 1 q 361 6 376 6 q 319 4 334 6 q 284 0 304 2 q 292 88 288 36 q 297 177 297 140 "},"\"":{"x_min":64,"x_max":315,"ha":379,"o":"m 133 587 l 64 587 l 64 957 l 133 957 l 133 587 m 315 587 l 247 587 l 247 957 l 315 957 l 315 587 "},"ê":{"x_min":40,"x_max":646.9375,"ha":681,"o":"m 406 42 q 602 130 523 42 l 621 130 q 613 93 617 112 q 609 47 609 73 q 496 0 558 14 q 369 -15 435 -15 q 130 73 220 -15 q 40 311 40 162 q 126 562 40 456 q 355 669 212 669 q 564 590 481 669 q 646 386 646 512 l 644 331 q 438 333 562 331 q 314 335 315 335 l 179 331 q 235 127 179 212 q 406 42 291 42 m 296 978 l 386 978 l 537 743 l 488 743 l 340 875 l 193 743 l 143 743 l 296 978 m 513 392 l 513 437 q 470 563 513 509 q 356 618 427 618 q 233 552 271 618 q 183 390 195 487 l 513 392 "},"δ":{"x_min":41,"x_max":670,"ha":710,"o":"m 102 840 q 185 981 102 937 q 375 1025 268 1025 q 497 1010 436 1025 q 621 968 559 995 q 595 876 604 923 q 500 947 547 923 q 393 972 453 972 q 280 937 328 972 q 233 840 233 902 q 272 742 233 794 q 434 627 312 691 q 613 504 556 563 q 670 305 670 445 q 581 75 670 165 q 350 -15 492 -15 q 125 73 210 -15 q 41 305 41 162 q 113 526 41 430 q 306 622 186 622 q 145 726 189 674 q 102 840 102 779 m 356 576 q 221 492 261 576 q 181 302 181 409 q 223 118 181 203 q 356 34 265 34 q 490 116 450 34 q 530 307 530 198 q 489 492 530 409 q 356 576 449 576 "},"έ":{"x_min":53,"x_max":598.828125,"ha":628,"o":"m 506 516 q 433 591 467 566 q 353 616 400 616 q 261 580 298 616 q 225 492 225 545 q 268 406 225 437 q 372 375 311 375 l 418 375 l 417 352 l 417 313 l 343 317 q 237 282 281 317 q 193 185 193 247 q 238 78 193 118 q 352 38 284 38 q 460 66 410 38 q 543 144 510 94 q 553 99 547 121 q 567 54 558 76 q 452 2 515 19 q 321 -15 388 -15 q 134 31 216 -15 q 53 176 53 78 q 96 286 53 246 q 214 355 139 326 q 127 408 162 370 q 93 497 93 445 q 165 625 93 579 q 323 672 237 672 q 430 654 378 672 q 541 604 481 637 q 522 564 529 584 q 506 516 514 545 m 476 944 q 510 975 494 965 q 547 986 526 986 q 584 970 569 986 q 598 933 598 954 q 584 898 598 912 q 541 867 569 884 l 342 744 l 293 744 l 476 944 "},"ω":{"x_min":39.71875,"x_max":1028.9375,"ha":1068,"o":"m 535 526 l 596 528 l 594 305 q 616 117 594 193 q 722 42 638 42 q 850 118 811 42 q 888 293 888 194 q 829 502 888 409 q 664 654 769 594 l 717 648 q 805 654 766 648 q 967 510 905 606 q 1028 304 1028 413 q 948 81 1028 177 q 744 -15 867 -15 q 622 16 678 -15 q 534 104 566 47 q 445 16 500 48 q 323 -15 389 -15 q 118 83 196 -15 q 39 311 39 182 q 100 511 39 419 q 262 654 161 604 q 303 650 278 651 q 349 648 327 648 l 402 654 q 238 501 296 593 q 179 291 179 409 q 218 116 179 191 q 348 42 257 42 q 419 68 390 42 q 461 137 448 94 q 472 216 469 175 q 475 303 475 257 q 472 419 475 353 q 469 528 470 485 l 535 526 "},"´":{"x_min":90.28125,"x_max":305.5625,"ha":374,"o":"m 169 859 q 197 923 177 894 q 250 953 218 953 q 288 939 272 953 q 305 902 305 925 q 295 857 305 882 q 269 811 284 833 l 120 568 l 90 576 l 169 859 "},"±":{"x_min":169,"x_max":969,"ha":1139,"o":"m 602 549 l 969 549 l 969 482 l 602 482 l 602 247 l 534 247 l 534 482 l 169 482 l 169 549 l 534 549 l 534 779 l 602 779 l 602 549 m 969 33 l 169 33 l 169 100 l 969 100 l 969 33 "},"|":{"x_min":305,"x_max":376,"ha":683,"o":"m 376 448 l 305 448 l 305 956 l 376 956 l 376 448 m 376 -233 l 305 -233 l 305 272 l 376 272 l 376 -233 "},"ϋ":{"x_min":79,"x_max":703,"ha":774,"o":"m 703 395 q 595 110 703 236 q 332 -15 488 -15 q 145 54 211 -15 q 79 244 79 123 l 83 429 q 81 542 83 486 q 79 654 80 598 l 146 650 l 217 654 q 209 502 217 608 q 202 365 202 397 l 202 261 q 240 105 202 168 q 369 43 279 43 q 523 132 476 43 q 571 340 571 222 q 548 493 571 418 q 488 645 526 568 q 550 647 529 645 q 627 658 571 650 q 703 395 703 537 m 227 928 q 281 907 259 928 q 304 853 304 886 q 283 800 304 822 q 230 778 262 778 q 175 800 197 778 q 153 853 153 822 q 174 906 153 884 q 227 928 195 928 m 469 928 q 523 906 501 928 q 545 853 545 884 q 524 799 545 821 q 472 778 504 778 q 418 800 440 778 q 396 853 396 822 q 416 905 396 883 q 469 928 437 928 "},"§":{"x_min":64,"x_max":620,"ha":675,"o":"m 114 36 l 128 36 q 198 -76 148 -33 q 319 -120 247 -120 q 430 -78 384 -120 q 476 27 476 -37 q 369 169 476 116 q 170 252 269 210 q 64 419 64 312 q 91 522 64 476 q 171 609 119 568 q 122 739 122 669 q 195 896 122 837 q 369 956 268 956 q 473 940 422 956 q 576 894 523 925 q 559 864 568 882 q 521 775 551 846 l 508 775 q 445 871 483 839 q 343 903 407 903 q 251 867 289 903 q 213 777 213 832 q 318 644 213 694 q 514 563 415 604 q 620 408 620 507 q 592 299 620 348 q 515 213 565 251 q 560 143 544 179 q 576 65 576 108 q 494 -112 576 -46 q 298 -178 412 -178 q 179 -163 239 -178 q 76 -119 120 -148 q 97 -42 86 -89 q 114 36 108 4 m 138 479 q 257 340 138 396 q 478 238 376 285 q 524 285 508 261 q 541 342 541 310 q 384 490 541 423 q 197 587 228 556 q 156 532 175 563 q 138 479 138 501 "},"b":{"x_min":78,"x_max":703,"ha":758,"o":"m 152 1018 q 219 1025 181 1018 q 212 916 214 966 q 210 788 210 866 l 210 755 l 210 555 q 419 672 283 672 q 629 569 555 672 q 703 322 703 466 q 630 79 703 173 q 414 -15 558 -15 q 296 8 350 -15 q 193 79 242 31 q 160 49 175 64 q 120 -1 145 33 l 78 -1 q 87 106 82 43 q 92 213 92 169 l 92 545 q 88 784 92 625 q 85 1025 85 944 q 152 1018 119 1018 m 383 605 q 243 520 285 605 q 202 323 202 435 q 245 133 202 218 q 383 48 288 48 q 522 132 480 48 q 564 326 564 217 q 522 519 564 434 q 383 605 480 605 "},"q":{"x_min":54,"x_max":675,"ha":758,"o":"m 608 -368 q 579 -368 591 -368 q 540 -373 567 -369 q 549 -213 548 -312 q 551 -101 551 -115 l 551 99 q 339 -15 476 -15 q 130 82 207 -15 q 54 316 54 180 q 125 564 54 456 q 333 672 197 672 q 464 636 407 672 q 557 535 520 601 q 546 655 557 594 q 586 649 576 650 q 611 648 597 648 q 674 655 640 648 l 671 433 q 669 163 671 298 q 666 -106 668 27 l 675 -373 q 643 -369 658 -370 q 608 -368 627 -368 m 373 48 q 515 134 473 48 q 557 331 557 220 q 511 514 557 433 q 372 596 466 596 q 234 512 276 596 q 193 322 193 429 q 236 133 193 218 q 373 48 279 48 "},"Ω":{"x_min":8,"x_max":1119.125,"ha":1129,"o":"m 449 0 q 318 4 410 0 q 223 8 227 8 l 10 0 l 13 47 q 11 74 13 59 q 8 95 9 88 q 119 88 69 90 q 249 86 169 86 q 103 261 152 170 q 55 473 55 352 q 200 822 55 694 q 567 950 345 950 q 931 823 791 950 q 1072 473 1072 697 q 1025 261 1072 350 q 878 86 978 173 q 992 91 902 86 q 1119 96 1083 96 l 1114 33 l 1117 0 l 906 8 q 778 4 867 8 q 682 0 688 0 l 682 72 q 864 215 807 122 q 921 451 921 309 q 834 764 921 639 q 565 889 747 889 q 296 767 384 889 q 209 454 209 645 q 268 217 209 319 q 449 72 327 115 l 449 0 "},"ύ":{"x_min":79,"x_max":703,"ha":774,"o":"m 703 395 q 595 110 703 236 q 332 -15 488 -15 q 145 54 211 -15 q 79 244 79 123 l 83 429 q 81 541 83 484 q 79 652 80 597 l 146 648 l 217 652 q 209 502 217 606 q 202 365 202 397 l 202 261 q 240 105 202 168 q 369 43 279 43 q 523 132 476 43 q 571 340 571 222 q 548 491 571 416 q 488 644 526 566 q 550 646 529 644 q 627 656 571 648 q 703 395 703 536 m 499 941 q 532 972 517 962 q 568 983 547 983 q 606 967 592 983 q 620 930 620 952 q 605 894 620 910 q 564 865 590 878 l 365 741 l 316 741 l 499 941 "},"Ö":{"x_min":51,"x_max":1069,"ha":1121,"o":"m 51 465 q 191 819 51 688 q 559 950 332 950 q 891 852 750 950 q 1046 659 1031 755 q 1065 535 1062 562 q 1069 462 1069 508 q 1066 395 1069 416 q 1047 275 1063 373 q 894 80 1031 176 q 562 -15 756 -15 q 451 -8 503 -15 q 304 31 399 -2 q 130 187 209 65 q 51 465 51 308 m 439 1208 q 491 1186 470 1208 q 513 1133 513 1164 q 491 1080 513 1103 q 439 1058 470 1058 q 385 1080 409 1058 q 362 1133 362 1102 q 384 1186 362 1164 q 439 1208 407 1208 m 682 1208 q 735 1186 713 1208 q 757 1133 757 1164 q 735 1080 757 1103 q 682 1058 713 1058 q 628 1079 650 1058 q 607 1133 607 1101 q 628 1186 607 1164 q 682 1208 650 1208 m 204 469 q 292 162 204 283 q 559 42 380 42 q 827 162 739 42 q 916 469 916 283 q 825 767 916 648 q 559 887 735 887 q 349 825 430 887 q 226 638 267 763 q 204 469 204 558 "},"z":{"x_min":15.28125,"x_max":606.9375,"ha":647,"o":"m 15 29 q 164 224 88 124 q 302 416 240 323 l 418 586 l 270 586 q 181 581 218 586 q 62 565 145 577 l 68 609 l 62 654 q 181 648 115 650 q 330 646 248 646 l 363 646 l 393 646 q 606 654 500 646 l 606 626 q 453 428 545 549 q 317 246 361 306 q 194 68 273 185 l 343 68 q 456 72 400 68 q 594 86 513 77 l 588 42 l 594 0 l 280 8 q 148 4 237 8 q 15 0 59 0 l 15 29 "},"™":{"x_min":176,"x_max":918,"ha":1139,"o":"m 463 930 l 346 930 l 346 614 l 293 614 l 293 930 l 176 930 l 176 969 l 463 969 l 463 930 m 736 690 l 840 968 l 918 969 l 918 614 l 871 614 l 871 927 l 752 614 l 719 614 l 594 930 l 594 614 l 548 614 l 548 969 l 625 969 l 736 690 "},"ή":{"x_min":91,"x_max":662,"ha":754,"o":"m 594 -365 q 557 -366 577 -365 q 526 -369 537 -368 q 531 -189 526 -310 q 537 -7 537 -68 l 537 406 q 503 536 537 485 q 391 587 469 587 q 255 508 290 587 q 220 315 220 430 q 222 133 220 259 q 224 1 224 8 l 158 6 l 91 1 l 101 156 l 101 495 q 97 584 101 527 q 93 655 93 640 q 119 650 105 652 q 155 648 134 648 q 185 650 175 648 q 221 655 195 651 l 220 538 q 321 637 265 602 q 452 672 378 672 q 604 603 552 672 q 656 430 656 535 l 656 329 l 656 -186 q 659 -293 656 -227 q 662 -370 662 -359 q 630 -366 645 -368 q 594 -365 614 -365 m 481 944 q 515 975 499 965 q 552 986 531 986 q 589 970 575 986 q 603 933 603 955 q 589 898 603 912 q 547 868 575 884 l 348 744 l 298 744 l 481 944 "},"Θ":{"x_min":51,"x_max":1068,"ha":1119,"o":"m 51 465 q 193 820 51 690 q 562 950 335 950 q 893 852 755 950 q 1047 653 1031 755 q 1065 525 1062 551 q 1068 462 1068 500 q 1065 402 1068 426 q 1047 280 1062 379 q 892 83 1033 182 q 560 -15 751 -15 q 435 -7 480 -15 q 299 32 390 0 q 130 187 209 65 q 51 465 51 308 m 202 468 q 290 163 202 283 q 559 43 379 43 q 826 163 738 43 q 915 468 915 283 q 826 770 915 652 q 559 889 738 889 q 254 720 306 889 q 202 468 202 552 m 560 507 q 683 510 608 507 q 768 514 758 514 l 765 465 l 765 429 q 648 432 730 429 q 558 435 566 435 q 440 432 523 435 q 351 429 357 429 l 353 470 l 353 514 q 474 510 400 514 q 560 507 549 507 "},"®":{"x_min":80,"x_max":1058,"ha":1139,"o":"m 816 905 q 992 726 927 841 q 1058 481 1058 611 q 912 138 1058 283 q 567 -6 766 -6 q 225 139 370 -6 q 80 481 80 284 q 224 826 80 681 q 569 971 368 971 q 816 905 698 971 m 569 918 q 263 788 392 918 q 134 481 134 659 q 261 175 134 306 q 566 45 389 45 q 872 174 741 45 q 1004 478 1004 304 q 947 699 1004 596 q 787 859 890 801 q 569 918 684 918 m 815 619 q 776 521 815 562 q 681 468 738 480 l 809 209 l 709 208 l 592 456 l 462 457 l 462 209 l 376 209 l 376 771 l 581 771 q 745 737 676 771 q 815 619 815 704 m 462 714 l 462 513 l 566 513 q 682 532 635 513 q 729 611 729 551 q 681 692 729 671 q 564 714 634 714 l 462 714 "},"É":{"x_min":109,"x_max":614.5625,"ha":685,"o":"m 124 465 q 116 710 124 540 q 109 932 109 880 l 353 929 l 610 929 q 607 904 607 918 q 607 884 607 891 l 610 838 q 407 860 506 860 l 259 860 l 257 670 l 257 530 l 397 530 q 586 542 492 530 q 584 518 584 530 q 584 499 584 506 q 586 450 584 465 q 487 458 542 454 q 393 463 432 463 l 257 463 l 257 318 l 262 74 q 452 77 381 74 q 614 94 524 80 l 613 47 l 614 0 l 356 0 l 109 0 q 116 243 109 72 q 124 465 124 415 m 426 1225 q 461 1255 445 1244 q 499 1267 478 1267 q 536 1251 522 1267 q 549 1212 549 1236 q 533 1176 549 1192 q 492 1147 517 1160 l 292 1024 l 242 1024 l 426 1225 "},"~":{"x_min":284,"x_max":1080,"ha":1368,"o":"m 850 650 q 667 750 761 650 q 511 850 573 850 q 396 793 431 850 q 362 650 362 737 l 284 650 q 339 846 284 768 q 508 924 395 924 q 697 824 606 924 q 853 725 788 725 q 969 779 936 725 q 1002 924 1002 834 l 1080 924 q 1023 727 1080 805 q 850 650 966 650 "},"Ε":{"x_min":108,"x_max":613.5625,"ha":686,"o":"m 126 465 q 122 711 126 620 q 108 932 119 802 l 353 928 l 610 931 l 606 884 l 610 836 q 508 853 562 847 q 408 860 453 860 l 260 860 l 258 671 l 258 528 l 398 528 q 587 541 480 528 l 584 497 l 587 451 l 394 463 l 258 463 l 258 316 l 264 73 q 456 76 380 73 q 613 94 531 80 l 610 47 l 613 0 l 358 4 l 108 0 q 117 239 108 70 q 126 465 126 408 "},"³":{"x_min":48,"x_max":424,"ha":496,"o":"m 159 636 l 156 663 q 178 661 167 661 q 200 661 189 661 q 280 690 248 661 q 312 767 312 719 q 212 869 312 869 q 143 846 168 869 q 107 781 117 823 l 102 779 q 84 812 93 795 q 66 845 75 830 q 134 886 98 871 q 212 901 171 901 q 341 873 284 901 q 398 778 398 845 q 355 691 398 724 q 252 643 313 658 q 373 610 322 643 q 424 509 424 577 q 353 385 424 427 q 196 343 283 343 q 48 373 117 343 q 57 422 52 391 q 66 469 63 454 l 75 469 q 120 399 88 425 q 199 374 153 374 q 294 409 254 374 q 334 499 334 444 q 299 588 334 553 q 207 623 264 623 q 179 620 193 623 q 156 617 166 618 l 159 636 "},"[":{"x_min":116,"x_max":364.609375,"ha":449,"o":"m 127 2 l 127 386 l 127 769 l 116 932 l 235 929 l 364 929 l 363 908 l 363 872 q 263 880 313 880 l 216 880 l 216 387 l 216 -105 l 264 -105 q 329 -102 308 -105 q 364 -98 351 -99 l 363 -123 l 363 -158 l 237 -154 l 116 -158 q 121 -81 116 -138 q 127 2 127 -24 "},"L":{"x_min":108,"x_max":627.453125,"ha":629,"o":"m 126 465 q 122 712 126 621 q 108 932 119 803 q 149 930 126 932 q 188 926 173 927 q 233 929 202 926 q 268 932 265 932 q 263 797 268 883 q 258 684 258 711 q 261 332 258 577 q 264 73 264 86 l 402 73 q 512 78 458 73 q 627 94 566 84 l 624 47 l 627 0 l 358 4 l 108 0 q 117 239 108 70 q 126 465 126 408 "},"σ":{"x_min":41,"x_max":802.109375,"ha":806,"o":"m 625 644 l 802 651 l 797 611 l 802 566 l 626 573 q 690 464 671 527 q 710 327 710 402 q 616 81 710 177 q 371 -15 522 -15 q 131 78 222 -15 q 41 322 41 172 q 131 572 41 472 q 371 672 221 672 q 439 665 403 672 q 508 653 475 659 q 569 645 541 646 q 625 644 597 644 m 376 619 q 226 530 272 619 q 181 326 181 442 q 224 124 181 213 q 369 35 268 35 q 522 123 474 35 q 570 326 570 211 q 524 529 570 440 q 376 619 479 619 "},"ζ":{"x_min":75,"x_max":675,"ha":683,"o":"m 642 987 l 642 949 q 425 760 524 860 q 260 545 326 661 q 194 303 194 428 q 194 278 194 289 q 202 215 194 267 q 335 141 210 163 q 558 116 447 128 q 675 -7 675 91 q 643 -109 675 -65 q 544 -232 612 -154 l 500 -205 q 565 -113 555 -131 q 576 -66 576 -94 q 552 -20 576 -37 q 292 22 509 2 q 75 240 75 41 q 143 487 75 357 q 297 719 212 616 q 508 949 383 821 l 359 949 q 252 945 301 949 q 130 933 204 941 l 134 977 l 130 1025 q 272 1021 186 1025 q 372 1018 358 1018 q 526 1021 429 1018 q 643 1025 623 1025 l 642 987 "},"θ":{"x_min":48,"x_max":699,"ha":749,"o":"m 375 909 q 621 773 544 909 q 699 456 699 638 q 627 118 699 255 q 372 -19 556 -19 q 120 114 193 -19 q 48 444 48 247 q 122 773 48 638 q 375 909 196 909 m 184 383 q 221 136 184 242 q 374 31 259 31 q 534 137 505 31 q 564 424 564 244 l 408 428 l 184 423 l 184 383 m 371 858 q 257 804 300 858 q 196 673 214 751 q 186 581 189 630 q 184 483 184 532 l 322 478 q 461 480 364 478 q 564 483 558 483 q 528 747 564 637 q 371 858 493 858 "},"Ο":{"x_min":51,"x_max":1068,"ha":1119,"o":"m 51 465 q 192 820 51 690 q 559 950 333 950 q 892 853 754 950 q 1047 654 1031 757 q 1065 525 1062 551 q 1068 462 1068 500 q 1065 402 1068 426 q 1047 277 1062 379 q 894 80 1031 175 q 560 -15 756 -15 q 447 -10 496 -15 q 304 29 398 -5 q 130 186 210 64 q 51 465 51 308 m 202 468 q 290 162 202 282 q 559 42 379 42 q 826 162 738 42 q 915 468 915 283 q 825 770 915 651 q 559 889 735 889 q 348 826 429 889 q 225 639 267 764 q 202 468 202 552 "},"Γ":{"x_min":108,"x_max":627.453125,"ha":629,"o":"m 448 932 l 627 932 q 623 902 624 921 q 621 874 621 883 l 627 836 q 402 863 512 863 l 264 863 q 261 586 264 779 q 258 379 258 393 q 263 181 258 313 q 268 0 268 48 l 187 5 l 108 0 q 121 209 117 106 q 126 427 126 311 q 117 686 126 504 q 108 932 108 869 l 448 932 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":28,"x_max":1011,"ha":1032,"o":"m 799 0 q 647 62 708 0 q 586 218 586 124 q 647 372 586 309 q 799 436 709 436 q 949 373 888 436 q 1011 223 1011 311 q 995 130 1011 176 q 918 35 972 70 q 799 0 865 0 m 863 1015 l 227 -125 l 158 -125 l 793 1015 l 863 1015 m 241 451 q 89 513 150 451 q 28 668 28 576 q 89 823 28 759 q 241 888 150 888 q 391 825 330 888 q 453 673 453 762 q 434 581 453 623 q 359 486 412 521 q 241 451 307 451 m 897 260 q 872 353 897 310 q 798 397 847 397 q 718 340 737 397 q 700 202 700 283 q 719 86 700 133 q 798 40 738 40 q 866 73 840 40 q 892 149 892 106 q 895 206 894 169 q 897 260 897 242 m 339 689 q 312 812 339 775 q 240 849 285 849 q 160 788 179 849 q 141 648 141 728 q 164 541 141 590 q 240 493 188 493 q 307 527 281 493 q 334 602 334 561 q 339 689 339 641 "},"P":{"x_min":109,"x_max":722,"ha":736,"o":"m 127 559 q 109 931 127 759 l 231 927 q 337 931 270 927 q 416 935 403 935 q 632 874 543 935 q 722 694 722 814 q 616 493 722 564 q 371 422 510 422 l 252 422 q 257 200 252 348 q 262 0 262 52 q 224 3 249 0 q 185 8 199 8 q 147 5 168 8 q 109 0 127 2 q 118 287 109 85 q 127 559 127 488 m 576 684 q 515 826 576 773 q 364 879 455 879 l 262 875 q 254 781 257 827 q 252 688 252 735 l 252 476 q 507 530 439 476 q 576 684 576 584 "},"Ώ":{"x_min":-1,"x_max":1355.953125,"ha":1365,"o":"m 685 0 q 555 4 646 0 q 460 8 464 8 l 247 0 l 250 47 q 248 74 250 59 q 244 95 246 88 q 355 88 305 90 q 486 86 405 86 q 340 261 389 170 q 292 473 292 352 q 437 822 292 694 q 804 950 582 950 q 1168 823 1028 950 q 1309 473 1309 697 q 1262 261 1309 350 q 1115 86 1215 173 q 1229 91 1139 86 q 1355 96 1319 96 l 1351 33 l 1354 0 l 1143 8 q 1014 4 1104 8 q 918 0 924 0 l 918 72 q 1100 215 1043 122 q 1158 451 1158 309 q 1071 764 1158 639 q 802 889 984 889 q 533 767 621 889 q 446 454 446 645 q 505 217 446 319 q 685 72 564 115 l 685 0 m 182 943 q 215 974 200 964 q 251 985 230 985 q 289 969 274 985 q 304 932 304 954 q 290 896 304 911 q 247 866 275 882 l 48 743 l -1 743 l 182 943 "},"Έ":{"x_min":-1.390625,"x_max":920.015625,"ha":992,"o":"m 432 465 q 428 711 432 620 q 414 932 425 802 l 660 928 l 917 932 l 912 884 l 917 836 q 814 853 868 847 q 714 860 760 860 l 567 860 l 564 671 l 564 528 l 704 528 q 893 541 786 528 l 890 497 l 893 451 l 700 462 l 564 462 l 564 317 l 570 74 q 762 77 686 74 q 920 94 838 80 l 917 47 l 920 0 l 664 4 l 414 0 q 423 239 414 70 q 432 465 432 408 m 181 943 q 215 974 200 964 q 251 985 230 985 q 288 969 273 985 q 304 932 304 954 q 289 896 304 911 q 247 866 275 882 l 47 743 l -1 743 l 181 943 "},"_":{"x_min":0,"x_max":683.328125,"ha":683,"o":"m 683 -322 l 0 -322 l 0 -256 l 683 -256 l 683 -322 "},"Ϊ":{"x_min":-3,"x_max":388,"ha":386,"o":"m 126 465 q 118 710 126 540 q 111 932 111 880 q 156 929 123 932 q 192 926 190 926 q 238 929 205 926 q 276 932 271 932 q 265 697 276 863 q 255 465 255 530 q 265 230 255 397 q 276 0 276 63 q 233 3 260 0 q 192 8 205 8 q 153 5 176 8 q 111 0 131 2 q 118 243 111 72 q 126 465 126 415 m 73 1208 q 124 1186 102 1208 q 146 1133 146 1164 q 123 1081 146 1105 q 73 1058 101 1058 q 19 1080 42 1058 q -3 1133 -3 1103 q 19 1185 -3 1163 q 73 1208 41 1208 m 313 1208 q 366 1186 344 1208 q 388 1133 388 1164 q 365 1080 388 1103 q 313 1058 342 1058 q 260 1080 283 1058 q 238 1133 238 1103 q 260 1185 238 1163 q 313 1208 282 1208 "},"+":{"x_min":169,"x_max":970,"ha":1139,"o":"m 603 441 l 970 441 l 970 374 l 603 374 l 603 0 l 536 0 l 536 374 l 169 374 l 169 441 l 536 441 l 536 816 l 603 816 l 603 441 "},"½":{"x_min":83,"x_max":1094.125,"ha":1172,"o":"m 250 743 l 245 836 q 181 804 205 818 q 120 768 156 791 q 104 788 117 775 q 83 808 91 801 q 200 851 141 825 q 327 913 259 877 l 336 911 q 331 724 336 850 q 326 551 326 598 l 326 391 q 301 394 319 391 q 280 397 283 397 q 254 394 271 397 q 233 391 238 391 q 246 551 242 473 q 250 743 250 629 m 859 1015 l 929 1015 l 312 -124 l 243 -124 l 859 1015 m 982 363 q 959 443 982 413 q 887 478 936 473 q 821 458 852 478 q 784 407 790 439 l 778 377 l 773 376 q 728 448 753 416 q 899 513 801 513 q 1019 476 967 513 q 1072 374 1072 439 q 955 189 1072 285 q 806 67 838 93 l 978 67 q 1094 79 1039 67 q 1090 63 1092 76 q 1088 41 1088 49 q 1094 3 1088 18 q 981 3 1056 3 q 867 3 906 3 q 791 3 842 3 q 714 3 739 3 l 714 25 q 913 198 844 125 q 982 363 982 270 "},"Ρ":{"x_min":109,"x_max":722,"ha":736,"o":"m 127 559 q 109 931 127 759 l 231 927 q 337 931 270 927 q 416 935 403 935 q 632 874 543 935 q 722 694 722 814 q 616 493 722 564 q 371 422 510 422 l 252 422 q 257 200 252 348 q 262 0 262 52 q 224 3 249 0 q 185 8 199 8 q 147 5 168 8 q 109 0 127 2 q 118 287 109 85 q 127 559 127 488 m 576 684 q 515 826 576 773 q 364 879 455 879 l 262 875 q 254 781 257 827 q 252 688 252 735 l 252 476 q 507 530 439 476 q 576 684 576 584 "},"'":{"x_min":88.890625,"x_max":306.9375,"ha":374,"o":"m 169 858 q 196 923 177 896 q 250 951 215 951 q 289 937 272 951 q 306 903 306 923 q 295 858 306 883 q 269 812 284 833 l 122 568 l 88 576 l 169 858 "},"T":{"x_min":11,"x_max":713,"ha":725,"o":"m 11 839 l 15 884 l 11 932 q 194 927 72 932 q 361 922 316 922 q 544 927 421 922 q 713 932 668 932 q 707 883 707 911 q 707 861 707 870 q 713 834 707 852 q 609 850 666 843 q 504 857 552 857 l 428 857 q 426 767 428 830 q 424 701 424 704 l 428 220 q 442 0 428 122 q 362 8 401 3 q 323 5 344 8 q 282 0 301 2 q 289 132 282 40 q 296 259 296 225 l 296 683 l 296 857 q 11 839 164 857 "},"Φ":{"x_min":50,"x_max":1068,"ha":1119,"o":"m 637 -25 q 559 -15 591 -15 q 527 -17 544 -15 q 483 -25 509 -19 l 487 68 q 181 179 313 68 q 50 465 50 291 q 172 744 50 647 q 487 865 295 842 l 483 958 q 522 952 502 955 q 559 950 543 950 q 596 952 576 950 q 637 958 616 955 l 631 865 q 942 758 816 865 q 1068 465 1068 651 q 944 184 1068 286 q 631 68 820 83 l 637 -25 m 501 502 q 497 677 501 570 q 494 800 494 784 q 278 698 354 786 q 203 466 203 611 q 282 231 203 331 q 494 132 361 132 q 497 363 494 225 q 501 502 501 501 m 915 466 q 839 706 915 612 q 626 800 764 800 q 622 636 626 738 q 618 470 618 533 q 622 301 618 408 q 626 132 626 194 q 839 226 764 132 q 915 466 915 320 "},"j":{"x_min":-55,"x_max":248,"ha":342,"o":"m 113 391 q 106 543 113 444 q 100 654 100 641 q 144 648 135 648 q 167 648 153 648 q 202 649 189 648 q 241 654 214 650 q 237 507 241 595 q 234 405 234 419 l 234 -13 l 234 -109 q 154 -303 234 -234 q -55 -372 74 -372 l -55 -333 q 78 -267 44 -323 q 113 -103 113 -212 l 113 -26 l 113 391 m 171 963 q 226 940 205 963 q 248 881 248 917 q 226 831 248 849 q 171 813 204 813 q 116 833 139 813 q 94 885 94 853 q 115 941 94 919 q 171 963 136 963 "},"Σ":{"x_min":44.4375,"x_max":790.28125,"ha":825,"o":"m 729 883 l 733 835 q 272 855 519 855 q 544 500 391 691 q 372 312 446 399 q 219 119 297 224 l 455 119 q 638 124 522 119 q 790 129 755 129 l 784 86 l 783 68 l 784 42 q 785 25 784 33 q 790 0 786 17 q 558 4 694 0 q 416 8 422 8 q 230 4 350 8 q 44 0 111 0 l 44 50 q 169 182 105 109 q 307 344 232 255 l 406 468 q 242 689 314 594 q 76 899 170 785 l 76 932 q 231 929 123 932 q 345 926 340 926 q 568 929 412 926 q 733 932 723 932 l 729 883 "},"1":{"x_min":72,"x_max":472,"ha":749,"o":"m 334 626 q 331 722 334 655 q 329 793 329 788 q 228 737 278 765 q 133 673 177 709 q 102 713 124 688 q 72 743 80 737 q 274 827 177 780 q 458 935 372 875 l 472 929 q 463 552 472 804 q 455 259 455 300 l 459 0 q 421 5 441 2 q 384 8 401 8 q 349 5 367 8 q 312 0 330 2 q 329 289 324 133 q 334 626 334 445 "},"ä":{"x_min":43,"x_max":655.5,"ha":649,"o":"m 234 -15 q 98 33 153 -15 q 43 162 43 82 q 106 303 43 273 q 303 364 169 333 q 444 448 437 395 q 403 568 444 521 q 288 616 362 616 q 191 587 233 616 q 124 507 149 559 l 95 520 l 104 591 q 202 651 144 631 q 323 672 261 672 q 500 622 444 672 q 557 455 557 573 l 557 133 q 567 69 557 84 q 618 54 577 54 q 655 58 643 54 l 655 26 q 594 5 626 14 q 537 -6 562 -3 q 438 85 453 -6 q 342 10 388 35 q 234 -15 296 -15 m 203 929 q 254 906 232 929 q 277 854 277 884 q 256 799 277 820 q 204 778 236 778 q 149 800 173 778 q 126 854 126 822 q 148 906 126 884 q 203 929 170 929 m 444 929 q 498 906 476 929 q 521 854 521 884 q 500 800 521 822 q 447 778 479 778 q 392 800 415 778 q 370 854 370 823 q 392 906 370 884 q 444 929 414 929 m 176 186 q 204 98 176 133 q 284 64 232 64 q 390 107 342 64 q 438 212 438 151 l 438 345 q 239 293 303 319 q 176 186 176 268 "},"<":{"x_min":176,"x_max":961.109375,"ha":1139,"o":"m 279 406 l 960 130 l 961 56 l 176 379 l 176 432 l 960 756 l 960 682 l 279 406 "},"£":{"x_min":65,"x_max":728.890625,"ha":749,"o":"m 67 47 l 65 98 l 116 101 q 203 168 176 112 q 231 292 231 224 q 227 375 231 330 q 221 444 223 420 q 139 441 171 444 q 76 432 107 439 l 78 479 l 76 503 q 105 495 92 498 q 134 493 117 493 l 219 493 q 212 550 214 522 q 209 609 209 578 q 304 825 209 742 q 537 909 399 909 q 633 896 592 909 q 723 864 673 884 q 666 731 694 809 l 656 731 q 605 825 641 791 q 512 859 570 859 q 383 796 427 859 q 340 646 340 734 l 345 493 l 366 493 q 523 502 450 493 l 521 466 l 526 434 q 438 441 493 439 q 345 444 383 444 l 345 378 q 310 238 345 302 q 213 107 275 173 q 527 113 421 107 q 728 134 633 119 l 721 66 q 728 0 721 34 q 542 3 666 0 q 358 8 419 8 q 176 3 285 8 q 65 0 67 0 l 67 47 "},"¹":{"x_min":82,"x_max":347,"ha":496,"o":"m 255 731 l 255 833 l 123 759 q 104 780 120 763 q 82 801 87 797 q 208 850 148 822 q 337 917 269 878 l 347 912 q 341 721 347 848 q 336 529 336 593 l 336 356 q 311 358 327 356 q 289 361 295 361 q 264 358 280 361 q 242 356 248 356 q 251 498 247 407 q 255 731 255 590 "},"t":{"x_min":18,"x_max":415.21875,"ha":425,"o":"m 18 586 l 22 630 l 18 654 q 133 643 80 643 q 131 732 133 669 q 129 799 129 796 q 199 827 163 811 q 263 863 234 843 q 252 758 255 811 q 250 643 250 705 q 334 645 310 643 q 401 654 358 647 l 398 618 l 401 586 q 248 594 323 594 l 243 258 l 243 162 q 272 76 243 109 q 353 43 301 43 q 387 44 369 43 q 415 48 405 46 l 415 4 q 349 -10 378 -5 q 290 -15 319 -15 q 174 18 221 -15 q 123 118 128 51 l 123 200 l 129 387 l 133 594 q 84 592 113 594 q 18 586 55 590 "},"λ":{"x_min":2.78125,"x_max":652.78125,"ha":657,"o":"m 302 670 q 227 871 262 803 q 111 940 193 940 q 78 937 94 940 q 20 924 62 934 l 20 978 q 96 1012 59 1000 q 170 1025 133 1025 q 329 947 287 1025 q 427 692 372 869 q 538 340 481 515 q 652 1 594 166 l 579 5 l 504 0 q 336 573 423 305 q 218 301 272 438 q 111 0 163 163 l 61 6 q 27 3 48 6 q 2 0 5 0 q 302 670 165 329 "},"ù":{"x_min":90,"x_max":664,"ha":754,"o":"m 653 498 q 653 329 653 443 q 653 158 653 215 q 664 0 653 81 q 631 3 647 1 q 598 5 616 5 q 563 3 583 5 q 533 0 544 1 l 538 118 q 440 18 494 52 q 312 -15 385 -15 q 148 50 201 -15 q 96 229 96 115 l 96 354 l 96 516 l 90 655 q 120 650 103 651 q 158 648 136 648 q 192 650 175 648 q 227 655 210 651 q 220 445 227 591 q 213 247 213 299 q 247 115 213 163 q 362 68 281 68 q 477 113 428 68 q 531 217 525 159 q 538 340 538 274 q 533 520 538 394 q 528 655 528 647 q 561 650 548 651 q 596 648 574 648 q 663 655 628 648 q 653 498 653 573 m 445 743 l 244 866 q 205 896 223 877 q 187 934 187 915 q 202 970 187 955 q 238 986 217 986 q 277 973 256 986 q 309 945 298 961 l 496 743 l 445 743 "},"W":{"x_min":0,"x_max":1306.953125,"ha":1307,"o":"m 0 932 q 47 927 31 929 q 76 926 62 926 q 121 929 88 926 q 155 931 154 931 q 262 547 200 750 l 380 171 q 470 437 415 272 q 552 693 525 602 q 619 931 580 784 l 672 926 q 700 928 684 926 q 726 931 716 930 q 825 604 787 727 q 883 419 862 482 q 969 171 904 357 l 1087 522 q 1143 720 1120 623 q 1187 931 1166 816 q 1221 929 1197 931 q 1247 926 1245 926 q 1280 928 1262 926 q 1306 931 1298 930 q 1131 467 1218 716 q 990 0 1045 217 q 963 4 980 1 q 937 7 947 7 q 904 3 925 7 q 880 0 883 0 q 761 385 831 184 l 641 733 l 491 287 q 402 0 438 133 q 370 3 391 0 q 344 7 350 7 q 315 4 327 7 q 287 0 302 2 q 206 296 252 142 q 122 568 161 450 q 0 932 83 686 "},"ï":{"x_min":-25,"x_max":365.328125,"ha":340,"o":"m 104 144 l 104 522 l 97 655 q 138 650 113 651 q 167 648 162 648 q 233 655 206 648 q 225 506 225 581 q 229 254 225 423 q 233 0 233 84 q 201 3 216 1 q 164 5 186 5 q 128 3 143 5 q 97 0 113 1 l 104 144 m 50 929 q 102 906 80 929 q 125 854 125 884 q 104 799 125 820 q 52 778 84 778 q -2 800 19 778 q -25 854 -25 822 q -4 906 -25 884 q 50 929 16 929 m 290 929 q 343 906 320 929 q 365 854 365 884 q 345 799 365 820 q 294 778 324 778 q 238 800 260 778 q 216 854 216 822 q 237 906 216 884 q 290 929 258 929 "},">":{"x_min":176.390625,"x_max":963,"ha":1139,"o":"m 963 379 l 176 56 l 176 130 l 858 406 l 176 682 l 176 756 l 962 432 l 963 379 "},"v":{"x_min":0,"x_max":658.328125,"ha":654,"o":"m 0 655 q 54 648 38 648 q 86 647 69 647 q 113 647 100 647 q 168 654 127 648 q 252 402 204 529 l 358 134 l 470 436 q 543 654 508 533 q 570 650 554 651 q 600 648 586 648 q 636 648 618 648 q 658 654 652 652 q 506 340 577 502 q 372 0 436 177 q 347 5 362 2 q 319 8 333 8 q 296 5 309 8 q 272 0 283 2 q 200 206 234 120 q 0 655 165 292 "},"τ":{"x_min":30,"x_max":677,"ha":701,"o":"m 423 573 l 419 303 q 423 146 419 250 q 428 0 428 42 q 394 4 410 2 q 359 5 378 5 q 333 4 343 5 q 289 0 323 4 l 298 194 l 294 573 q 156 553 207 573 q 57 472 105 534 q 30 559 49 522 q 149 626 82 609 q 307 644 216 644 l 510 644 q 604 647 545 644 q 677 651 664 651 l 671 610 q 677 566 671 586 q 527 569 618 566 q 423 573 436 573 "},"û":{"x_min":90,"x_max":664,"ha":754,"o":"m 653 498 q 653 328 653 442 q 653 158 653 215 q 664 0 653 81 q 631 3 647 1 q 598 5 616 5 q 563 3 583 5 q 533 0 544 1 l 538 118 q 440 18 494 52 q 312 -15 385 -15 q 148 50 201 -15 q 96 229 96 115 l 96 354 l 96 516 l 90 655 q 120 650 103 651 q 158 648 136 648 q 192 649 175 648 q 227 655 210 651 q 220 445 227 591 q 213 247 213 299 q 247 115 213 163 q 362 68 281 68 q 477 113 428 68 q 531 217 525 159 q 538 340 538 274 q 533 520 538 394 q 528 655 528 647 q 558 650 542 651 q 596 648 574 648 q 629 649 612 648 q 663 655 646 651 q 653 498 653 573 m 332 978 l 421 978 l 572 743 l 525 743 l 376 875 l 227 743 l 180 743 l 332 978 "},"ξ":{"x_min":64,"x_max":654,"ha":656,"o":"m 562 861 q 502 941 539 911 q 414 972 465 972 q 299 917 342 972 q 256 788 256 862 q 312 650 256 701 q 458 599 369 599 l 526 599 l 524 563 l 524 528 q 480 533 503 532 q 427 535 457 535 q 271 494 337 535 q 197 408 205 454 q 187 347 188 361 q 186 326 186 333 q 186 294 186 300 q 190 282 187 287 q 238 200 201 229 q 335 153 276 171 l 494 118 q 610 73 567 100 q 654 -13 654 46 q 628 -103 654 -60 q 511 -238 602 -146 l 466 -210 q 541 -121 530 -139 q 553 -75 553 -103 q 393 16 553 -18 q 149 92 234 50 q 64 276 64 133 q 130 462 64 379 q 299 575 197 544 q 175 652 222 600 q 128 780 128 704 q 213 954 128 883 q 405 1025 298 1025 q 507 1009 458 1025 q 609 965 555 994 q 585 914 600 945 q 562 861 571 883 "},"&":{"x_min":76,"x_max":917.671875,"ha":975,"o":"m 360 -18 q 160 41 245 -18 q 76 211 76 101 q 137 382 76 315 q 314 515 199 448 q 249 618 273 569 q 225 722 225 668 q 287 872 225 812 q 441 932 349 932 q 581 891 520 932 q 643 777 643 851 q 588 640 643 701 q 453 532 533 579 q 568 390 509 459 q 690 253 627 321 q 815 530 792 379 l 829 530 l 887 466 q 814 327 856 396 q 727 209 772 259 q 807 115 760 169 q 917 0 853 61 q 855 1 896 0 q 791 2 813 2 l 739 0 l 649 110 q 515 15 586 48 q 360 -18 445 -18 m 341 475 q 234 380 267 419 q 201 273 201 340 q 258 125 201 190 q 401 61 316 61 q 508 86 458 61 q 606 154 559 111 l 341 475 m 547 770 q 524 854 547 823 q 454 886 502 886 q 363 851 402 886 q 325 769 325 817 q 344 685 325 718 q 422 575 363 652 q 514 661 481 615 q 547 770 547 708 "},"Λ":{"x_min":0,"x_max":852.78125,"ha":853,"o":"m 662 452 l 778 172 l 852 0 l 769 5 q 734 4 747 5 q 679 0 722 4 q 647 102 661 55 q 605 226 633 148 l 547 383 l 401 777 l 266 429 q 191 213 226 319 q 125 0 157 108 l 62 2 l 0 0 q 205 459 95 191 q 380 932 315 726 q 404 927 393 929 q 431 926 416 926 q 459 929 441 926 q 487 932 477 932 q 548 743 511 850 q 662 452 586 637 "},"I":{"x_min":109,"x_max":271,"ha":385,"o":"m 127 465 q 123 711 127 620 q 109 932 120 803 q 154 927 129 929 q 190 925 179 925 q 238 928 209 925 q 271 931 266 931 q 263 788 271 887 q 256 659 256 690 l 256 448 l 256 283 q 263 135 256 238 q 271 0 271 31 q 231 3 258 0 q 190 8 204 8 q 151 5 172 8 q 109 0 129 2 q 118 239 109 70 q 127 465 127 408 "},"G":{"x_min":51,"x_max":942,"ha":1001,"o":"m 581 -15 q 198 107 345 -15 q 51 459 51 229 q 196 815 51 680 q 566 950 342 950 q 755 929 659 950 q 930 869 852 909 q 906 802 916 836 q 895 737 897 769 l 874 737 q 739 855 808 818 q 571 893 670 893 q 305 770 406 893 q 204 479 204 647 q 298 168 204 291 q 577 46 393 46 q 689 56 640 46 q 790 94 738 66 q 794 184 790 123 q 798 251 798 246 q 794 337 798 280 q 790 423 790 394 q 830 417 821 418 q 863 416 838 416 q 901 419 880 416 q 941 425 923 422 l 936 236 q 939 121 936 201 q 942 37 942 41 q 757 -1 843 11 q 581 -15 672 -15 "},"ΰ":{"x_min":79,"x_max":703,"ha":774,"o":"m 703 395 q 595 110 703 236 q 332 -15 488 -15 q 145 54 211 -15 q 79 244 79 123 l 83 430 q 81 542 83 486 q 79 654 80 598 l 146 650 l 217 654 q 209 502 217 608 q 202 365 202 397 l 202 261 q 240 105 202 168 q 369 43 279 43 q 523 132 476 43 q 571 340 571 222 q 548 493 571 418 q 488 645 526 568 q 550 647 529 645 q 627 658 571 650 q 703 395 703 537 m 209 865 q 250 846 232 865 q 269 804 269 828 q 251 761 269 780 q 209 743 234 743 q 166 761 184 743 q 148 804 148 779 q 166 846 148 828 q 209 865 184 865 m 361 929 q 378 969 368 956 q 414 982 388 982 q 458 941 458 982 q 446 904 458 919 l 338 743 l 306 743 l 361 929 m 513 865 q 555 846 537 865 q 573 804 573 828 q 555 761 573 779 q 513 743 537 743 q 470 761 487 743 q 454 804 454 779 q 470 846 454 828 q 513 865 487 865 "},"`":{"x_min":86.5,"x_max":303.171875,"ha":374,"o":"m 222 659 q 194 595 214 622 q 140 568 175 568 q 86 613 86 568 q 96 660 86 636 q 122 706 107 684 l 271 950 l 303 940 l 222 659 "},"Υ":{"x_min":-28,"x_max":746,"ha":707,"o":"m 297 177 l 297 386 q 191 570 256 458 q 84 750 125 682 q -28 932 42 819 q 24 928 -9 932 q 63 925 59 925 q 112 927 91 925 q 146 932 134 930 q 207 800 174 866 q 275 676 239 735 l 389 475 q 509 688 451 575 q 627 932 567 801 l 683 926 q 715 927 701 926 q 746 932 729 929 q 555 627 640 769 l 432 415 l 432 240 q 435 101 432 198 q 438 0 438 5 q 401 4 426 1 q 361 6 376 6 q 319 4 334 6 q 284 0 304 2 q 292 88 288 36 q 297 177 297 140 "},"r":{"x_min":89,"x_max":465.390625,"ha":488,"o":"m 99 120 l 99 400 l 99 433 q 91 654 99 548 q 125 648 114 650 q 162 647 136 647 q 232 654 195 647 q 223 588 226 626 q 220 516 220 550 q 313 628 264 589 q 437 668 362 668 l 465 668 l 459 604 l 465 537 q 427 544 448 541 q 383 551 407 548 q 256 482 292 551 q 220 312 220 413 q 222 131 220 256 q 225 0 225 6 l 157 6 l 89 0 l 99 120 "},"x":{"x_min":1,"x_max":635,"ha":632,"o":"m 264 316 l 158 461 q 78 563 120 508 q 5 655 36 619 q 97 647 51 647 q 141 649 120 647 q 177 654 162 651 q 249 538 214 592 q 334 415 284 484 q 420 533 377 473 q 501 654 464 592 q 523 650 508 652 q 550 647 539 648 q 616 654 582 647 l 371 365 q 477 210 434 267 q 635 0 519 152 q 587 3 616 0 q 551 6 558 6 q 501 4 523 6 q 465 0 479 1 q 380 140 407 98 q 295 264 352 183 q 172 84 194 117 q 123 0 151 51 l 66 5 q 33 2 55 5 q 1 0 10 0 q 131 154 63 72 q 264 316 199 236 "},"è":{"x_min":40,"x_max":646.9375,"ha":681,"o":"m 407 42 q 602 130 523 42 l 621 130 q 613 93 617 112 q 609 47 609 73 q 496 0 558 14 q 369 -15 435 -15 q 130 73 220 -15 q 40 311 40 162 q 126 562 40 456 q 355 669 212 669 q 564 590 481 669 q 646 386 646 512 l 644 331 q 438 333 562 331 q 313 335 315 335 l 179 331 q 235 127 179 212 q 407 42 291 42 m 407 743 l 208 866 q 166 895 183 880 q 149 934 149 911 q 167 967 149 949 q 202 986 185 986 q 243 969 220 986 q 273 945 266 952 l 457 743 l 407 743 m 513 392 l 513 437 q 470 563 513 509 q 356 618 427 618 q 233 552 271 618 q 183 390 195 487 l 513 392 "},"μ":{"x_min":84,"x_max":669.109375,"ha":754,"o":"m 331 -15 q 265 -7 292 -15 q 210 19 238 0 l 208 -128 q 211 -266 208 -178 q 214 -373 214 -354 q 183 -369 198 -370 q 150 -368 168 -368 q 114 -370 133 -368 q 84 -373 95 -372 q 89 -165 84 -304 q 94 43 94 -26 q 89 363 94 149 q 84 655 84 578 q 150 647 118 647 q 219 654 180 647 q 213 495 219 601 q 208 334 208 390 q 232 155 208 227 q 339 75 256 83 q 471 112 419 75 q 531 212 523 150 q 539 332 539 273 q 536 518 539 388 q 533 655 533 648 q 600 647 568 647 q 669 654 629 647 q 660 477 662 566 q 658 257 658 389 q 660 113 658 171 q 669 -1 662 55 l 602 4 l 537 -1 l 539 106 q 449 17 502 50 q 331 -15 397 -15 "},"÷":{"x_min":169,"x_max":969,"ha":1139,"o":"m 641 643 q 618 593 641 615 q 566 571 596 571 q 518 592 538 571 q 498 643 498 613 q 518 692 498 670 q 567 715 539 715 q 610 703 579 715 q 641 643 641 691 m 969 374 l 169 374 l 169 441 l 969 441 l 969 374 m 641 170 q 619 120 641 141 q 570 100 598 100 q 519 120 540 100 q 498 170 498 141 q 518 221 498 199 q 568 243 538 243 q 604 235 584 243 q 632 214 624 227 q 641 170 641 201 "},"h":{"x_min":92,"x_max":665,"ha":758,"o":"m 102 136 l 102 859 q 100 934 102 894 q 94 1025 98 975 q 136 1018 126 1019 q 158 1018 146 1018 q 226 1025 188 1018 q 222 957 223 1001 q 221 888 221 913 l 221 868 l 221 543 q 322 637 264 602 q 450 672 380 672 q 608 606 558 672 q 659 429 659 541 l 659 298 l 659 136 l 665 0 q 633 3 648 1 q 597 5 617 5 q 560 3 580 5 q 529 0 540 1 q 534 202 529 68 q 540 405 540 337 q 503 533 540 481 q 394 586 467 586 q 256 508 291 586 q 221 313 221 430 q 224 133 221 244 q 227 0 227 22 q 188 3 211 0 q 161 6 164 6 q 123 4 137 6 q 92 0 108 2 l 102 136 "},".":{"x_min":100,"x_max":274,"ha":374,"o":"m 187 156 q 248 130 223 156 q 274 68 274 105 q 248 8 274 32 q 187 -15 223 -15 q 125 8 150 -15 q 100 68 100 32 q 125 130 100 105 q 187 156 150 156 "},"φ":{"x_min":39,"x_max":965,"ha":1006,"o":"m 578 -371 q 505 -362 539 -362 q 465 -365 483 -362 q 427 -372 446 -368 q 433 -163 427 -298 q 440 -11 440 -29 q 156 76 274 -11 q 39 327 39 163 q 145 571 39 486 q 410 656 252 656 q 412 635 411 645 q 413 615 413 625 q 235 516 292 580 q 179 327 179 451 q 247 118 179 197 q 442 39 316 39 l 444 197 l 444 311 q 444 400 444 340 q 444 491 444 461 q 514 619 452 570 q 657 668 577 668 q 879 568 794 668 q 965 332 965 469 q 850 84 965 169 q 563 -14 735 0 q 570 -203 563 -71 q 578 -371 578 -334 m 826 347 q 794 534 826 451 q 677 617 763 617 q 592 572 621 617 q 563 470 563 527 l 559 350 l 563 39 q 759 126 693 39 q 826 347 826 213 "},";":{"x_min":72.609375,"x_max":312,"ha":446,"o":"m 224 636 q 287 611 262 636 q 312 548 312 586 q 287 486 312 511 q 224 461 262 461 q 162 486 188 461 q 137 548 137 512 q 162 611 137 586 q 224 636 187 636 m 164 75 q 198 157 182 140 q 244 175 214 175 q 304 119 304 175 q 296 75 304 93 q 262 18 287 56 l 103 -243 l 72 -231 l 164 75 "},"f":{"x_min":12,"x_max":432.546875,"ha":397,"o":"m 127 324 l 127 597 q 66 595 92 597 q 12 588 39 594 l 14 626 l 12 654 q 79 648 38 649 q 127 647 121 647 q 192 901 127 777 q 378 1025 257 1025 q 409 1022 400 1025 q 432 1015 418 1019 l 415 896 q 371 911 395 905 q 325 918 347 918 q 252 886 278 918 q 227 805 227 855 q 235 713 227 760 q 246 647 243 665 q 330 650 276 647 q 396 654 384 654 q 391 642 393 647 q 389 633 389 637 l 388 622 l 389 610 q 396 589 389 609 q 323 595 357 594 q 246 597 289 597 l 246 366 q 250 183 246 305 q 254 0 254 60 q 213 3 238 0 q 183 6 187 6 q 144 4 161 6 q 116 0 127 1 q 121 160 116 52 q 127 324 127 269 "},"“":{"x_min":83.71875,"x_max":550.390625,"ha":625,"o":"m 471 659 q 441 593 458 618 q 389 568 424 568 q 350 579 365 568 q 335 613 335 591 q 346 660 335 633 q 371 706 358 687 l 519 950 l 550 940 l 471 659 m 221 659 q 192 593 211 618 q 137 568 174 568 q 83 613 83 568 q 93 658 83 637 q 119 706 103 680 l 268 950 l 300 940 l 221 659 "},"A":{"x_min":-15.28125,"x_max":838.890625,"ha":825,"o":"m 257 639 l 387 950 q 402 945 395 947 q 417 944 409 944 q 452 950 437 944 q 576 629 536 733 q 686 359 617 526 q 838 0 755 192 q 789 3 820 0 q 751 6 758 6 q 700 4 723 6 q 663 0 677 1 q 600 199 622 137 q 543 353 579 260 l 377 358 l 215 353 l 162 205 q 130 110 145 160 q 101 0 115 59 l 44 5 q 6 2 20 5 q -15 0 -8 0 q 76 211 30 105 q 158 404 121 318 q 257 639 195 490 m 378 419 l 513 425 l 379 761 l 246 425 l 378 419 "},"6":{"x_min":64,"x_max":692,"ha":749,"o":"m 464 859 q 267 730 324 859 q 210 442 210 602 q 315 514 262 488 q 431 540 367 540 q 618 462 545 540 q 692 270 692 385 q 604 65 692 145 q 390 -15 516 -15 q 142 93 221 -15 q 64 377 64 201 q 167 745 64 581 q 462 909 270 909 q 524 905 501 909 q 579 890 547 902 l 574 827 q 521 851 547 844 q 464 859 495 859 m 554 258 q 510 409 554 347 q 380 471 466 471 q 255 409 300 471 q 210 264 210 348 q 253 105 210 172 q 384 39 297 39 q 485 73 441 39 q 540 148 529 108 q 552 206 551 187 q 554 258 554 225 "},"‘":{"x_min":86.5,"x_max":303.171875,"ha":374,"o":"m 224 659 q 193 594 212 620 q 140 568 174 568 q 86 615 86 568 q 98 660 86 633 q 122 708 110 687 l 271 951 l 303 942 l 224 659 "},"ϊ":{"x_min":-29,"x_max":362,"ha":342,"o":"m 104 333 l 104 520 q 103 566 104 544 q 96 654 102 588 q 140 647 130 648 q 165 647 151 647 q 232 654 195 647 q 224 555 225 599 q 223 437 223 511 l 223 406 q 228 194 223 337 q 233 0 233 51 q 201 3 216 1 q 165 5 185 5 q 127 3 148 5 q 96 0 107 1 q 100 165 96 51 q 104 333 104 279 m 45 928 q 99 907 77 928 q 122 853 122 886 q 101 800 122 822 q 48 778 80 778 q -6 800 15 778 q -29 853 -29 822 q -7 906 -29 884 q 45 928 13 928 m 286 928 q 340 906 318 928 q 362 853 362 884 q 341 799 362 821 q 289 778 321 778 q 235 800 257 778 q 213 853 213 822 q 233 905 213 883 q 286 928 254 928 "},"π":{"x_min":19,"x_max":957,"ha":989,"o":"m 702 5 l 635 0 q 639 114 635 44 q 643 196 643 185 l 643 575 l 508 575 l 373 575 l 369 284 q 373 143 369 236 q 377 0 377 50 q 345 3 360 1 q 309 5 329 5 q 271 3 292 5 q 239 0 250 1 l 248 196 l 243 575 q 130 553 171 575 q 43 472 89 532 q 19 559 35 519 q 139 627 71 611 q 305 644 207 644 l 658 644 l 852 644 l 957 651 l 951 610 l 957 566 l 769 575 l 765 310 q 769 154 765 257 q 773 0 773 51 q 739 3 755 1 q 702 5 724 5 "},"ά":{"x_min":41,"x_max":827.109375,"ha":846,"o":"m 705 352 q 803 -1 763 155 l 739 1 l 673 -1 l 632 172 q 521 36 593 87 q 356 -15 448 -15 q 129 81 217 -15 q 41 316 41 177 q 130 569 41 467 q 368 672 220 672 q 537 622 464 672 q 659 486 610 573 q 711 654 691 569 l 770 650 l 827 654 q 763 505 792 576 q 705 352 734 434 m 518 943 q 552 974 536 964 q 589 985 568 985 q 626 969 611 985 q 641 932 641 953 q 627 897 641 911 q 585 866 613 883 l 384 743 l 335 743 l 518 943 m 377 619 q 226 530 272 619 q 181 326 181 442 q 223 124 181 214 q 367 34 265 34 q 528 137 480 34 q 601 323 577 240 q 527 531 578 444 q 377 619 475 619 "},"O":{"x_min":51,"x_max":1068,"ha":1119,"o":"m 51 465 q 192 820 51 690 q 559 950 333 950 q 892 853 754 950 q 1047 654 1031 757 q 1065 525 1062 551 q 1068 462 1068 500 q 1065 402 1068 426 q 1047 277 1062 379 q 894 80 1031 175 q 560 -15 756 -15 q 447 -10 496 -15 q 304 29 398 -5 q 130 186 210 64 q 51 465 51 308 m 202 468 q 290 162 202 282 q 559 42 379 42 q 826 162 738 42 q 915 468 915 283 q 825 770 915 651 q 559 889 735 889 q 348 826 429 889 q 225 639 267 764 q 202 468 202 552 "},"n":{"x_min":89,"x_max":661,"ha":754,"o":"m 99 155 l 99 495 q 97 569 99 530 q 91 655 95 608 q 153 648 122 648 l 219 656 l 218 539 q 319 635 260 599 q 451 672 378 672 q 591 624 528 672 q 654 501 654 576 l 654 299 l 654 136 l 661 0 q 629 3 644 1 q 593 5 613 5 q 556 3 576 5 q 525 0 536 1 q 530 222 525 80 q 535 406 535 364 q 501 536 535 485 q 389 587 467 587 q 253 508 288 587 q 218 313 218 430 q 220 132 218 258 q 222 0 222 6 q 184 3 208 0 q 155 6 159 6 q 117 3 141 6 q 89 0 93 0 l 99 155 "},"3":{"x_min":75,"x_max":644,"ha":749,"o":"m 241 465 l 238 512 l 294 510 q 424 554 375 510 q 474 680 474 599 q 434 805 474 754 q 322 856 394 856 q 220 818 257 856 q 164 711 183 780 l 153 706 q 127 767 136 747 q 99 819 118 788 q 220 886 162 863 q 348 909 278 909 q 526 857 450 909 q 603 706 603 805 q 542 564 603 617 q 383 479 482 511 q 567 423 490 479 q 644 262 644 366 q 542 55 644 129 q 302 -18 441 -18 q 183 -6 240 -18 q 75 32 127 5 q 99 189 91 116 l 113 188 q 182 73 136 115 q 302 31 229 31 q 448 92 392 31 q 505 246 505 154 q 451 389 505 333 q 312 446 398 446 q 238 435 279 446 l 241 465 "},"9":{"x_min":57,"x_max":688,"ha":749,"o":"m 261 38 q 475 166 405 38 q 546 451 546 295 q 442 378 494 403 q 325 354 389 354 q 132 428 208 354 q 57 617 57 502 q 148 828 57 748 q 372 909 240 909 q 612 801 536 909 q 688 520 688 693 q 574 143 688 305 q 252 -18 461 -18 q 186 -14 211 -18 q 127 0 161 -11 l 113 90 q 180 51 143 64 q 261 38 218 38 m 372 419 q 501 482 457 419 q 546 634 546 545 q 504 790 546 725 q 373 855 462 855 q 238 791 284 855 q 193 637 193 727 q 238 482 193 545 q 372 419 284 419 "},"l":{"x_min":100,"x_max":237.5,"ha":342,"o":"m 107 118 l 107 881 q 104 965 107 915 q 101 1025 101 1016 q 169 1018 138 1018 q 237 1025 203 1018 q 228 872 230 948 q 226 684 226 797 l 226 512 l 232 111 l 237 0 q 205 3 220 1 q 169 5 189 5 q 131 3 152 5 q 100 0 111 1 l 107 118 "},"κ":{"x_min":97,"x_max":677.5625,"ha":683,"o":"m 104 365 q 100 531 104 428 q 97 655 97 634 q 164 647 134 647 q 231 654 196 647 q 227 516 231 608 q 223 377 223 425 l 258 377 q 386 498 323 431 q 528 654 449 565 q 588 647 563 647 q 640 647 613 647 q 672 652 662 651 l 358 387 l 548 165 q 608 93 577 127 q 677 19 638 59 l 677 0 q 628 3 659 0 q 591 6 596 6 q 544 3 567 6 q 510 0 520 0 q 437 100 477 47 q 360 196 398 153 l 269 308 l 252 323 l 223 326 q 227 163 223 274 q 231 0 231 52 l 164 5 l 97 0 q 100 208 97 77 q 104 365 104 339 "},"4":{"x_min":39,"x_max":691.78125,"ha":749,"o":"m 453 252 l 177 257 l 39 253 l 39 291 q 204 522 111 392 q 345 721 297 653 q 475 906 394 789 l 527 906 l 581 906 q 575 805 581 872 q 569 705 569 739 l 569 343 l 598 343 q 644 344 620 343 q 690 350 667 345 l 683 297 q 686 270 683 287 q 691 244 689 254 q 568 253 629 253 l 568 137 l 569 0 l 505 6 l 437 0 q 450 120 447 51 q 453 252 453 190 m 453 767 l 344 626 q 230 465 298 562 q 144 343 162 368 l 453 343 l 453 767 "},"p":{"x_min":83,"x_max":702,"ha":758,"o":"m 91 -106 q 89 202 91 47 q 87 513 88 358 l 83 655 q 109 650 95 652 q 146 648 124 648 q 177 650 165 648 q 213 655 188 651 q 202 535 202 591 q 297 637 246 602 q 425 672 349 672 q 630 567 558 672 q 702 322 702 463 q 629 84 702 183 q 423 -15 556 -15 q 210 99 287 -15 l 210 -101 q 214 -244 210 -148 q 219 -373 219 -340 q 185 -369 201 -370 q 151 -368 170 -368 q 130 -368 138 -368 q 83 -373 123 -368 q 87 -240 83 -329 q 91 -106 91 -151 m 384 596 q 245 514 289 596 q 202 328 202 433 q 244 134 202 220 q 383 48 286 48 q 520 131 478 48 q 563 322 563 215 q 519 509 563 423 q 384 596 475 596 "},"ψ":{"x_min":78,"x_max":1002,"ha":1038,"o":"m 78 294 l 82 477 l 82 654 l 145 650 l 215 654 q 209 517 215 605 q 203 421 203 430 l 203 341 q 264 117 203 197 q 465 38 325 38 l 468 260 q 461 535 468 342 q 455 786 455 729 q 496 779 479 782 q 526 776 513 776 q 566 780 545 776 q 600 786 587 784 q 591 496 600 690 q 583 270 583 302 l 587 38 q 791 132 715 38 q 867 357 867 227 q 824 641 867 506 q 885 645 857 641 q 960 656 912 648 q 1002 419 1002 544 q 891 118 1002 231 q 587 -13 780 5 l 591 -221 l 600 -372 q 561 -365 578 -367 q 526 -363 543 -363 q 491 -366 511 -363 q 455 -372 471 -369 q 461 -162 455 -302 q 468 -13 468 -22 q 194 64 310 -13 q 78 294 78 142 "},"Ü":{"x_min":101,"x_max":919.0625,"ha":1015,"o":"m 182 927 l 262 931 q 250 805 253 854 q 247 697 247 757 l 247 457 q 314 136 247 212 q 516 60 381 60 q 733 130 654 60 q 813 336 813 201 l 813 458 l 813 657 q 799 931 813 802 l 859 927 l 919 931 q 905 770 909 863 q 901 600 901 677 l 901 366 q 792 82 901 179 q 491 -15 684 -15 q 211 66 307 -15 q 116 325 116 148 l 116 426 l 116 698 q 112 805 116 757 q 101 931 109 854 l 182 927 m 410 1208 q 462 1186 442 1208 q 483 1133 483 1164 q 460 1081 483 1105 q 410 1058 438 1058 q 356 1080 379 1058 q 334 1133 334 1103 q 356 1185 334 1163 q 410 1208 378 1208 m 650 1208 q 704 1187 682 1208 q 727 1133 727 1166 q 704 1080 727 1103 q 650 1058 681 1058 q 598 1078 620 1058 q 576 1133 576 1099 q 598 1185 576 1163 q 650 1208 620 1208 "},"à":{"x_min":43,"x_max":655.5,"ha":649,"o":"m 234 -15 q 98 33 153 -15 q 43 162 43 82 q 106 303 43 273 q 303 364 169 333 q 444 448 437 395 q 403 568 444 521 q 288 616 362 616 q 191 587 233 616 q 124 507 149 559 l 95 520 l 104 591 q 202 651 144 631 q 323 672 261 672 q 500 622 444 672 q 557 455 557 573 l 557 133 q 567 69 557 84 q 618 54 577 54 q 655 58 643 54 l 655 26 q 594 5 626 14 q 537 -6 562 -3 q 438 85 453 -6 q 342 10 388 35 q 234 -15 296 -15 m 392 743 l 191 866 q 152 896 170 877 q 133 934 133 915 q 148 970 133 955 q 186 986 163 986 q 222 972 200 986 q 254 945 245 958 l 442 743 l 392 743 m 176 186 q 204 98 176 133 q 284 64 232 64 q 390 107 342 64 q 438 212 438 151 l 438 345 q 239 293 303 319 q 176 186 176 268 "},"η":{"x_min":91,"x_max":662,"ha":754,"o":"m 594 -365 q 557 -366 577 -365 q 526 -369 537 -368 q 531 -189 526 -310 q 537 -7 537 -68 l 537 406 q 503 536 537 485 q 391 587 469 587 q 255 508 290 587 q 220 315 220 430 q 222 133 220 259 q 224 1 224 8 l 158 6 l 91 1 l 101 156 l 101 495 q 97 584 101 527 q 93 655 93 640 q 119 650 105 652 q 155 648 134 648 q 185 650 175 648 q 221 655 195 651 l 220 538 q 321 637 265 602 q 452 672 378 672 q 604 603 552 672 q 656 430 656 535 l 656 329 l 656 -186 q 659 -293 656 -227 q 662 -370 662 -359 q 630 -366 645 -368 q 594 -365 614 -365 "}},"cssFontWeight":"normal","ascender":1267,"underlinePosition":-133,"cssFontStyle":"normal","boundingBox":{"yMin":-373.75,"xMin":-71,"yMax":1267,"xMax":1511},"resolution":1000,"original_font_information":{"postscript_name":"Optimer-Regular","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Optimer","font_family_name":"Optimer","copyright":"Copyright (c) Magenta Ltd., 2004","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta Ltd.:Optimer:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta Ltd.","font_sub_family_name":"Regular"},"descender":-374,"familyName":"Optimer","lineHeight":1640,"underlineThickness":20});
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
;
