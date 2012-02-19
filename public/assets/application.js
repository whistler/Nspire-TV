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
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":0,"x_max":764,"ha":863,"o":"m 380 -25 q 105 87 211 -25 q 0 372 0 200 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 372 764 544 q 658 87 764 200 q 380 -25 552 -25 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 218 204 283 q 379 142 294 142 "},"S":{"x_min":0,"x_max":826,"ha":915,"o":"m 826 306 q 701 55 826 148 q 423 -29 587 -29 q 138 60 255 -29 q 0 318 13 154 l 208 318 q 288 192 216 238 q 437 152 352 152 q 559 181 506 152 q 623 282 623 217 q 466 411 623 372 q 176 487 197 478 q 18 719 18 557 q 136 958 18 869 q 399 1040 244 1040 q 670 956 561 1040 q 791 713 791 864 l 591 713 q 526 826 583 786 q 393 866 469 866 q 277 838 326 866 q 218 742 218 804 q 374 617 218 655 q 667 542 646 552 q 826 306 826 471 "},"¦":{"x_min":0,"x_max":143,"ha":240,"o":"m 143 462 l 0 462 l 0 984 l 143 984 l 143 462 m 143 -242 l 0 -242 l 0 280 l 143 280 l 143 -242 "},"/":{"x_min":196.109375,"x_max":632.5625,"ha":828,"o":"m 632 1040 l 289 -128 l 196 -128 l 538 1040 l 632 1040 "},"Τ":{"x_min":-0.609375,"x_max":808,"ha":878,"o":"m 808 831 l 508 831 l 508 0 l 298 0 l 298 831 l 0 831 l 0 1013 l 808 1013 l 808 831 "},"y":{"x_min":0,"x_max":738.890625,"ha":828,"o":"m 738 749 l 444 -107 q 361 -238 413 -199 q 213 -277 308 -277 q 156 -275 176 -277 q 120 -271 131 -271 l 120 -110 q 147 -113 134 -111 q 179 -116 161 -116 q 247 -91 226 -116 q 269 -17 269 -67 q 206 173 269 -4 q 84 515 162 301 q 0 749 41 632 l 218 749 l 376 207 l 529 749 l 738 749 "},"Π":{"x_min":0,"x_max":809,"ha":922,"o":"m 809 0 l 598 0 l 598 836 l 208 836 l 208 0 l 0 0 l 0 1012 l 809 1012 l 809 0 "},"ΐ":{"x_min":-162,"x_max":364,"ha":364,"o":"m 364 810 l 235 810 l 235 952 l 364 952 l 364 810 m 301 1064 l 86 810 l -12 810 l 123 1064 l 301 1064 m -33 810 l -162 810 l -162 952 l -33 952 l -33 810 m 200 0 l 0 0 l 0 748 l 200 748 l 200 0 "},"g":{"x_min":0,"x_max":724,"ha":839,"o":"m 724 48 q 637 -223 724 -142 q 357 -304 551 -304 q 140 -253 226 -304 q 23 -72 36 -192 l 243 -72 q 290 -127 255 -110 q 368 -144 324 -144 q 504 -82 470 -144 q 530 71 530 -38 l 530 105 q 441 25 496 51 q 319 0 386 0 q 79 115 166 0 q 0 377 0 219 q 77 647 0 534 q 317 775 166 775 q 534 656 456 775 l 534 748 l 724 748 l 724 48 m 368 167 q 492 237 447 167 q 530 382 530 297 q 490 529 530 466 q 364 603 444 603 q 240 532 284 603 q 201 386 201 471 q 240 239 201 300 q 368 167 286 167 "},"²":{"x_min":0,"x_max":463,"ha":560,"o":"m 463 791 q 365 627 463 706 q 151 483 258 555 l 455 483 l 455 382 l 0 382 q 84 565 0 488 q 244 672 97 576 q 331 784 331 727 q 299 850 331 824 q 228 876 268 876 q 159 848 187 876 q 132 762 132 820 l 10 762 q 78 924 10 866 q 228 976 137 976 q 392 925 322 976 q 463 791 463 874 "},"–":{"x_min":0,"x_max":704.171875,"ha":801,"o":"m 704 297 l 0 297 l 0 450 l 704 450 l 704 297 "},"Κ":{"x_min":0,"x_max":899.671875,"ha":969,"o":"m 899 0 l 646 0 l 316 462 l 208 355 l 208 0 l 0 0 l 0 1013 l 208 1013 l 208 596 l 603 1013 l 863 1013 l 460 603 l 899 0 "},"ƒ":{"x_min":-46,"x_max":440,"ha":525,"o":"m 440 609 l 316 609 l 149 -277 l -46 -277 l 121 609 l 14 609 l 14 749 l 121 749 q 159 949 121 894 q 344 1019 208 1019 l 440 1015 l 440 855 l 377 855 q 326 841 338 855 q 314 797 314 827 q 314 773 314 786 q 314 749 314 761 l 440 749 l 440 609 "},"e":{"x_min":0,"x_max":708,"ha":808,"o":"m 708 321 l 207 321 q 254 186 207 236 q 362 141 298 141 q 501 227 453 141 l 700 227 q 566 36 662 104 q 362 -26 477 -26 q 112 72 213 -26 q 0 369 0 182 q 95 683 0 573 q 358 793 191 793 q 619 677 531 793 q 708 321 708 561 m 501 453 q 460 571 501 531 q 353 612 420 612 q 247 570 287 612 q 207 453 207 529 l 501 453 "},"ό":{"x_min":0,"x_max":764,"ha":863,"o":"m 380 -25 q 105 87 211 -25 q 0 372 0 200 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 372 764 544 q 658 87 764 200 q 380 -25 552 -25 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 218 204 283 q 379 142 294 142 m 593 1039 l 391 823 l 293 823 l 415 1039 l 593 1039 "},"J":{"x_min":0,"x_max":649,"ha":760,"o":"m 649 294 q 573 48 649 125 q 327 -29 497 -29 q 61 82 136 -29 q 0 375 0 173 l 200 375 l 199 309 q 219 194 199 230 q 321 145 249 145 q 418 193 390 145 q 441 307 441 232 l 441 1013 l 649 1013 l 649 294 "},"»":{"x_min":-0.234375,"x_max":526,"ha":624,"o":"m 526 286 l 297 87 l 296 250 l 437 373 l 297 495 l 297 660 l 526 461 l 526 286 m 229 286 l 0 87 l 0 250 l 140 373 l 0 495 l 0 660 l 229 461 l 229 286 "},"©":{"x_min":3,"x_max":1007,"ha":1104,"o":"m 507 -6 q 129 153 269 -6 q 3 506 3 298 q 127 857 3 713 q 502 1017 266 1017 q 880 855 740 1017 q 1007 502 1007 711 q 882 152 1007 295 q 507 -6 743 -6 m 502 934 q 184 800 302 934 q 79 505 79 680 q 184 210 79 331 q 501 76 302 76 q 819 210 701 76 q 925 507 925 331 q 820 800 925 682 q 502 934 704 934 m 758 410 q 676 255 748 313 q 506 197 605 197 q 298 291 374 197 q 229 499 229 377 q 297 713 229 624 q 494 811 372 811 q 666 760 593 811 q 752 616 739 710 l 621 616 q 587 688 621 658 q 509 719 554 719 q 404 658 441 719 q 368 511 368 598 q 403 362 368 427 q 498 298 438 298 q 624 410 606 298 l 758 410 "},"ώ":{"x_min":0,"x_max":945,"ha":1051,"o":"m 566 528 l 372 528 l 372 323 q 372 298 372 311 q 373 271 372 285 q 360 183 373 211 q 292 142 342 142 q 219 222 243 142 q 203 365 203 279 q 241 565 203 461 q 334 748 273 650 l 130 748 q 36 552 68 650 q 0 337 0 444 q 69 96 0 204 q 276 -29 149 -29 q 390 0 337 -29 q 470 78 444 28 q 551 0 495 30 q 668 -29 608 -29 q 874 96 793 -29 q 945 337 945 205 q 910 547 945 444 q 814 748 876 650 l 610 748 q 703 565 671 650 q 742 365 742 462 q 718 189 742 237 q 651 142 694 142 q 577 190 597 142 q 565 289 565 221 l 565 323 l 566 528 m 718 1039 l 516 823 l 417 823 l 540 1039 l 718 1039 "},"^":{"x_min":197.21875,"x_max":630.5625,"ha":828,"o":"m 630 836 l 536 836 l 413 987 l 294 836 l 197 836 l 331 1090 l 493 1090 l 630 836 "},"«":{"x_min":0,"x_max":526.546875,"ha":624,"o":"m 526 87 l 297 286 l 297 461 l 526 660 l 526 495 l 385 373 l 526 250 l 526 87 m 229 87 l 0 286 l 0 461 l 229 660 l 229 495 l 88 373 l 229 250 l 229 87 "},"D":{"x_min":0,"x_max":864,"ha":968,"o":"m 400 1013 q 736 874 608 1013 q 864 523 864 735 q 717 146 864 293 q 340 0 570 0 l 0 0 l 0 1013 l 400 1013 m 398 837 l 206 837 l 206 182 l 372 182 q 584 276 507 182 q 657 504 657 365 q 594 727 657 632 q 398 837 522 837 "},"∙":{"x_min":0,"x_max":207,"ha":304,"o":"m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 "},"ÿ":{"x_min":0,"x_max":47,"ha":125,"o":"m 47 3 q 37 -7 47 -7 q 28 0 30 -7 q 39 -4 32 -4 q 45 3 45 -1 l 37 0 q 28 9 28 0 q 39 19 28 19 l 47 16 l 47 19 l 47 3 m 37 1 q 44 8 44 1 q 37 16 44 16 q 30 8 30 16 q 37 1 30 1 m 26 1 l 23 22 l 14 0 l 3 22 l 3 3 l 0 25 l 13 1 l 22 25 l 26 1 "},"w":{"x_min":0,"x_max":1056.953125,"ha":1150,"o":"m 1056 749 l 848 0 l 647 0 l 527 536 l 412 0 l 211 0 l 0 749 l 202 749 l 325 226 l 429 748 l 633 748 l 740 229 l 864 749 l 1056 749 "},"$":{"x_min":0,"x_max":704,"ha":800,"o":"m 682 693 l 495 693 q 468 782 491 749 q 391 831 441 824 l 391 579 q 633 462 562 534 q 704 259 704 389 q 616 57 704 136 q 391 -22 528 -22 l 391 -156 l 308 -156 l 308 -22 q 76 69 152 -7 q 0 300 0 147 l 183 300 q 215 191 190 230 q 308 128 245 143 l 308 414 q 84 505 157 432 q 12 700 12 578 q 89 902 12 824 q 308 981 166 981 l 308 1069 l 391 1069 l 391 981 q 595 905 521 981 q 682 693 670 829 m 308 599 l 308 831 q 228 796 256 831 q 200 712 200 762 q 225 642 200 668 q 308 599 251 617 m 391 128 q 476 174 449 140 q 504 258 504 207 q 391 388 504 354 l 391 128 "},"\\":{"x_min":-0.03125,"x_max":434.765625,"ha":532,"o":"m 434 -128 l 341 -128 l 0 1039 l 91 1040 l 434 -128 "},"µ":{"x_min":0,"x_max":647,"ha":754,"o":"m 647 0 l 478 0 l 478 68 q 412 9 448 30 q 330 -11 375 -11 q 261 3 296 -11 q 199 43 226 18 l 199 -277 l 0 -277 l 0 749 l 199 749 l 199 358 q 216 221 199 267 q 322 151 244 151 q 435 240 410 151 q 448 401 448 283 l 448 749 l 647 749 l 647 0 "},"Ι":{"x_min":42,"x_max":250,"ha":413,"o":"m 250 0 l 42 0 l 42 1013 l 250 1013 l 250 0 "},"Ύ":{"x_min":0,"x_max":1211.15625,"ha":1289,"o":"m 1211 1012 l 907 376 l 907 0 l 697 0 l 697 376 l 374 1012 l 583 1012 l 802 576 l 1001 1012 l 1211 1012 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "},"’":{"x_min":0,"x_max":192,"ha":289,"o":"m 192 834 q 137 692 192 751 q 0 626 83 634 l 0 697 q 101 831 101 723 l 0 831 l 0 1013 l 192 1013 l 192 834 "},"Ν":{"x_min":0,"x_max":833,"ha":946,"o":"m 833 0 l 617 0 l 206 696 l 206 0 l 0 0 l 0 1013 l 216 1013 l 629 315 l 629 1013 l 833 1013 l 833 0 "},"-":{"x_min":27.78125,"x_max":413.890625,"ha":525,"o":"m 413 279 l 27 279 l 27 468 l 413 468 l 413 279 "},"Q":{"x_min":0,"x_max":995.59375,"ha":1096,"o":"m 995 49 l 885 -70 l 762 42 q 641 -12 709 4 q 497 -29 572 -29 q 135 123 271 -29 q 0 504 0 276 q 131 881 0 731 q 497 1040 270 1040 q 859 883 719 1040 q 994 506 994 731 q 966 321 994 413 q 884 152 938 229 l 995 49 m 730 299 q 767 395 755 344 q 779 504 779 446 q 713 743 779 644 q 505 857 638 857 q 284 745 366 857 q 210 501 210 644 q 279 265 210 361 q 492 157 357 157 q 615 181 557 157 l 508 287 l 620 405 l 730 299 "},"ς":{"x_min":0,"x_max":731.78125,"ha":768,"o":"m 731 448 l 547 448 q 485 571 531 533 q 369 610 440 610 q 245 537 292 610 q 204 394 204 473 q 322 186 204 238 q 540 133 430 159 q 659 -15 659 98 q 643 -141 659 -80 q 595 -278 627 -202 l 423 -278 q 458 -186 448 -215 q 474 -88 474 -133 q 352 0 474 -27 q 123 80 181 38 q 0 382 0 170 q 98 660 0 549 q 367 777 202 777 q 622 683 513 777 q 731 448 731 589 "},"M":{"x_min":0,"x_max":1019,"ha":1135,"o":"m 1019 0 l 823 0 l 823 819 l 618 0 l 402 0 l 194 818 l 194 0 l 0 0 l 0 1013 l 309 1012 l 510 241 l 707 1013 l 1019 1013 l 1019 0 "},"Ψ":{"x_min":0,"x_max":995,"ha":1085,"o":"m 995 698 q 924 340 995 437 q 590 200 841 227 l 590 0 l 404 0 l 404 200 q 70 340 152 227 q 0 698 0 437 l 0 1013 l 188 1013 l 188 694 q 212 472 188 525 q 404 383 254 383 l 404 1013 l 590 1013 l 590 383 q 781 472 740 383 q 807 694 807 525 l 807 1013 l 995 1013 l 995 698 "},"C":{"x_min":0,"x_max":970.828125,"ha":1043,"o":"m 970 345 q 802 70 933 169 q 490 -29 672 -29 q 130 130 268 -29 q 0 506 0 281 q 134 885 0 737 q 502 1040 275 1040 q 802 939 668 1040 q 965 679 936 838 l 745 679 q 649 809 716 761 q 495 857 582 857 q 283 747 361 857 q 214 508 214 648 q 282 267 214 367 q 493 154 359 154 q 651 204 584 154 q 752 345 718 255 l 970 345 "},"!":{"x_min":0,"x_max":204,"ha":307,"o":"m 204 739 q 182 515 204 686 q 152 282 167 398 l 52 282 q 13 589 27 473 q 0 739 0 704 l 0 1013 l 204 1013 l 204 739 m 204 0 l 0 0 l 0 203 l 204 203 l 204 0 "},"{":{"x_min":0,"x_max":501.390625,"ha":599,"o":"m 501 -285 q 229 -209 301 -285 q 176 -35 176 -155 q 182 47 176 -8 q 189 126 189 103 q 156 245 189 209 q 0 294 112 294 l 0 438 q 154 485 111 438 q 189 603 189 522 q 186 666 189 636 q 176 783 176 772 q 231 945 176 894 q 501 1015 306 1015 l 501 872 q 370 833 408 872 q 340 737 340 801 q 342 677 340 705 q 353 569 353 579 q 326 451 353 496 q 207 366 291 393 q 327 289 294 346 q 353 164 353 246 q 348 79 353 132 q 344 17 344 26 q 372 -95 344 -58 q 501 -141 408 -141 l 501 -285 "},"X":{"x_min":0,"x_max":894.453125,"ha":999,"o":"m 894 0 l 654 0 l 445 351 l 238 0 l 0 0 l 316 516 l 0 1013 l 238 1013 l 445 659 l 652 1013 l 894 1013 l 577 519 l 894 0 "},"#":{"x_min":0,"x_max":1019.453125,"ha":1117,"o":"m 1019 722 l 969 582 l 776 581 l 717 417 l 919 417 l 868 279 l 668 278 l 566 -6 l 413 -5 l 516 279 l 348 279 l 247 -6 l 94 -6 l 196 278 l 0 279 l 49 417 l 245 417 l 304 581 l 98 582 l 150 722 l 354 721 l 455 1006 l 606 1006 l 507 721 l 673 722 l 776 1006 l 927 1006 l 826 721 l 1019 722 m 627 581 l 454 581 l 394 417 l 567 417 l 627 581 "},"ι":{"x_min":42,"x_max":242,"ha":389,"o":"m 242 0 l 42 0 l 42 749 l 242 749 l 242 0 "},"Ά":{"x_min":0,"x_max":995.828125,"ha":1072,"o":"m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 m 995 0 l 776 0 l 708 208 l 315 208 l 247 0 l 29 0 l 390 1012 l 629 1012 l 995 0 m 652 376 l 509 809 l 369 376 l 652 376 "},")":{"x_min":0,"x_max":389,"ha":486,"o":"m 389 357 q 319 14 389 187 q 145 -293 259 -134 l 0 -293 q 139 22 90 -142 q 189 358 189 187 q 139 689 189 525 q 0 1013 90 853 l 145 1013 q 319 703 258 857 q 389 357 389 528 "},"ε":{"x_min":16.671875,"x_max":652.78125,"ha":742,"o":"m 652 259 q 565 49 652 123 q 340 -25 479 -25 q 102 39 188 -25 q 16 197 16 104 q 45 299 16 249 q 134 390 75 348 q 58 456 86 419 q 25 552 25 502 q 120 717 25 653 q 322 776 208 776 q 537 710 456 776 q 625 508 625 639 l 445 508 q 415 585 445 563 q 327 608 386 608 q 254 590 293 608 q 215 544 215 573 q 252 469 215 490 q 336 453 280 453 q 369 455 347 453 q 400 456 391 456 l 400 308 l 329 308 q 247 291 280 308 q 204 223 204 269 q 255 154 204 172 q 345 143 286 143 q 426 174 398 143 q 454 259 454 206 l 652 259 "},"Δ":{"x_min":0,"x_max":981.953125,"ha":1057,"o":"m 981 0 l 0 0 l 386 1013 l 594 1013 l 981 0 m 715 175 l 490 765 l 266 175 l 715 175 "},"}":{"x_min":0,"x_max":500,"ha":597,"o":"m 500 294 q 348 246 390 294 q 315 128 315 209 q 320 42 315 101 q 326 -48 326 -17 q 270 -214 326 -161 q 0 -285 196 -285 l 0 -141 q 126 -97 90 -141 q 154 8 154 -64 q 150 91 154 37 q 146 157 146 145 q 172 281 146 235 q 294 366 206 339 q 173 451 208 390 q 146 576 146 500 q 150 655 146 603 q 154 731 154 708 q 126 831 154 799 q 0 872 90 872 l 0 1015 q 270 944 196 1015 q 326 777 326 891 q 322 707 326 747 q 313 593 313 612 q 347 482 313 518 q 500 438 390 438 l 500 294 "},"‰":{"x_min":0,"x_max":1681,"ha":1775,"o":"m 861 484 q 1048 404 979 484 q 1111 228 1111 332 q 1048 51 1111 123 q 859 -29 979 -29 q 672 50 740 -29 q 610 227 610 122 q 672 403 610 331 q 861 484 741 484 m 861 120 q 939 151 911 120 q 967 226 967 183 q 942 299 967 270 q 861 333 912 333 q 783 301 811 333 q 756 226 756 269 q 783 151 756 182 q 861 120 810 120 m 904 984 l 316 -28 l 205 -29 l 793 983 l 904 984 m 250 984 q 436 904 366 984 q 499 730 499 832 q 436 552 499 626 q 248 472 366 472 q 62 552 132 472 q 0 728 0 624 q 62 903 0 831 q 250 984 132 984 m 249 835 q 169 801 198 835 q 140 725 140 768 q 167 652 140 683 q 247 621 195 621 q 327 654 298 621 q 357 730 357 687 q 329 803 357 772 q 249 835 301 835 m 1430 484 q 1618 404 1548 484 q 1681 228 1681 332 q 1618 51 1681 123 q 1429 -29 1548 -29 q 1241 50 1309 -29 q 1179 227 1179 122 q 1241 403 1179 331 q 1430 484 1311 484 m 1431 120 q 1509 151 1481 120 q 1537 226 1537 183 q 1511 299 1537 270 q 1431 333 1482 333 q 1352 301 1380 333 q 1325 226 1325 269 q 1352 151 1325 182 q 1431 120 1379 120 "},"a":{"x_min":0,"x_max":700,"ha":786,"o":"m 700 0 l 488 0 q 465 93 469 45 q 365 5 427 37 q 233 -26 303 -26 q 65 37 130 -26 q 0 205 0 101 q 120 409 0 355 q 343 452 168 431 q 465 522 465 468 q 424 588 465 565 q 337 611 384 611 q 250 581 285 611 q 215 503 215 552 l 26 503 q 113 707 26 633 q 328 775 194 775 q 538 723 444 775 q 657 554 657 659 l 657 137 q 666 73 657 101 q 700 33 675 45 l 700 0 m 465 297 l 465 367 q 299 322 358 340 q 193 217 193 287 q 223 150 193 174 q 298 127 254 127 q 417 175 370 127 q 465 297 465 224 "},"—":{"x_min":0,"x_max":941.671875,"ha":1039,"o":"m 941 297 l 0 297 l 0 450 l 941 450 l 941 297 "},"=":{"x_min":29.171875,"x_max":798.609375,"ha":828,"o":"m 798 502 l 29 502 l 29 635 l 798 635 l 798 502 m 798 204 l 29 204 l 29 339 l 798 339 l 798 204 "},"N":{"x_min":0,"x_max":833,"ha":949,"o":"m 833 0 l 617 0 l 206 695 l 206 0 l 0 0 l 0 1013 l 216 1013 l 629 315 l 629 1013 l 833 1013 l 833 0 "},"ρ":{"x_min":0,"x_max":722,"ha":810,"o":"m 364 -17 q 271 0 313 -17 q 194 48 230 16 l 194 -278 l 0 -278 l 0 370 q 87 656 0 548 q 358 775 183 775 q 626 655 524 775 q 722 372 722 541 q 621 95 722 208 q 364 -17 520 -17 m 360 607 q 237 529 280 607 q 201 377 201 463 q 234 229 201 292 q 355 147 277 147 q 467 210 419 147 q 515 374 515 273 q 471 537 515 468 q 360 607 428 607 "},"2":{"x_min":64,"x_max":764,"ha":828,"o":"m 764 685 q 675 452 764 541 q 484 325 637 415 q 307 168 357 250 l 754 168 l 754 0 l 64 0 q 193 301 64 175 q 433 480 202 311 q 564 673 564 576 q 519 780 564 737 q 416 824 475 824 q 318 780 358 824 q 262 633 270 730 l 80 633 q 184 903 80 807 q 415 988 276 988 q 654 907 552 988 q 764 685 764 819 "},"¯":{"x_min":0,"x_max":775,"ha":771,"o":"m 775 958 l 0 958 l 0 1111 l 775 1111 l 775 958 "},"Z":{"x_min":0,"x_max":804.171875,"ha":906,"o":"m 804 836 l 251 182 l 793 182 l 793 0 l 0 0 l 0 176 l 551 830 l 11 830 l 11 1013 l 804 1013 l 804 836 "},"u":{"x_min":0,"x_max":668,"ha":782,"o":"m 668 0 l 474 0 l 474 89 q 363 9 425 37 q 233 -19 301 -19 q 61 53 123 -19 q 0 239 0 126 l 0 749 l 199 749 l 199 296 q 225 193 199 233 q 316 146 257 146 q 424 193 380 146 q 469 304 469 240 l 469 749 l 668 749 l 668 0 "},"k":{"x_min":0,"x_max":688.890625,"ha":771,"o":"m 688 0 l 450 0 l 270 316 l 196 237 l 196 0 l 0 0 l 0 1013 l 196 1013 l 196 483 l 433 748 l 675 748 l 413 469 l 688 0 "},"Η":{"x_min":0,"x_max":837,"ha":950,"o":"m 837 0 l 627 0 l 627 450 l 210 450 l 210 0 l 0 0 l 0 1013 l 210 1013 l 210 635 l 627 635 l 627 1013 l 837 1013 l 837 0 "},"Α":{"x_min":0,"x_max":966.671875,"ha":1043,"o":"m 966 0 l 747 0 l 679 208 l 286 208 l 218 0 l 0 0 l 361 1013 l 600 1013 l 966 0 m 623 376 l 480 809 l 340 376 l 623 376 "},"s":{"x_min":0,"x_max":681,"ha":775,"o":"m 681 229 q 568 33 681 105 q 340 -29 471 -29 q 107 39 202 -29 q 0 245 0 114 l 201 245 q 252 155 201 189 q 358 128 295 128 q 436 144 401 128 q 482 205 482 166 q 363 284 482 255 q 143 348 181 329 q 25 533 25 408 q 129 716 25 647 q 340 778 220 778 q 554 710 465 778 q 658 522 643 643 l 463 522 q 419 596 458 570 q 327 622 380 622 q 255 606 290 622 q 221 556 221 590 q 339 473 221 506 q 561 404 528 420 q 681 229 681 344 "},"B":{"x_min":0,"x_max":835,"ha":938,"o":"m 674 547 q 791 450 747 518 q 835 304 835 383 q 718 75 835 158 q 461 0 612 0 l 0 0 l 0 1013 l 477 1013 q 697 951 609 1013 q 797 754 797 880 q 765 630 797 686 q 674 547 734 575 m 438 621 q 538 646 495 621 q 590 730 590 676 q 537 814 590 785 q 436 838 494 838 l 199 838 l 199 621 l 438 621 m 445 182 q 561 211 513 182 q 618 311 618 247 q 565 410 618 375 q 444 446 512 446 l 199 446 l 199 182 l 445 182 "},"…":{"x_min":0,"x_max":819,"ha":963,"o":"m 206 0 l 0 0 l 0 207 l 206 207 l 206 0 m 512 0 l 306 0 l 306 207 l 512 207 l 512 0 m 819 0 l 613 0 l 613 207 l 819 207 l 819 0 "},"?":{"x_min":1,"x_max":687,"ha":785,"o":"m 687 734 q 621 563 687 634 q 501 454 560 508 q 436 293 436 386 l 251 293 l 251 391 q 363 557 251 462 q 476 724 476 653 q 432 827 476 788 q 332 866 389 866 q 238 827 275 866 q 195 699 195 781 l 1 699 q 110 955 1 861 q 352 1040 210 1040 q 582 963 489 1040 q 687 734 687 878 m 446 0 l 243 0 l 243 203 l 446 203 l 446 0 "},"H":{"x_min":0,"x_max":838,"ha":953,"o":"m 838 0 l 628 0 l 628 450 l 210 450 l 210 0 l 0 0 l 0 1013 l 210 1013 l 210 635 l 628 635 l 628 1013 l 838 1013 l 838 0 "},"ν":{"x_min":0,"x_max":740.28125,"ha":828,"o":"m 740 749 l 473 0 l 266 0 l 0 749 l 222 749 l 373 211 l 529 749 l 740 749 "},"c":{"x_min":0,"x_max":751.390625,"ha":828,"o":"m 751 282 q 625 58 725 142 q 384 -26 526 -26 q 107 84 215 -26 q 0 366 0 195 q 98 651 0 536 q 370 774 204 774 q 616 700 518 774 q 751 486 715 626 l 536 486 q 477 570 516 538 q 380 607 434 607 q 248 533 298 607 q 204 378 204 466 q 242 219 204 285 q 377 139 290 139 q 483 179 438 139 q 543 282 527 220 l 751 282 "},"¶":{"x_min":0,"x_max":566.671875,"ha":678,"o":"m 21 892 l 52 892 l 98 761 l 145 892 l 176 892 l 178 741 l 157 741 l 157 867 l 108 741 l 88 741 l 40 871 l 40 741 l 21 741 l 21 892 m 308 854 l 308 731 q 252 691 308 691 q 227 691 240 691 q 207 696 213 695 l 207 712 l 253 706 q 288 733 288 706 l 288 763 q 244 741 279 741 q 193 797 193 741 q 261 860 193 860 q 287 860 273 860 q 308 854 302 855 m 288 842 l 263 843 q 213 796 213 843 q 248 756 213 756 q 288 796 288 756 l 288 842 m 566 988 l 502 988 l 502 -1 l 439 -1 l 439 988 l 317 988 l 317 -1 l 252 -1 l 252 602 q 81 653 155 602 q 0 805 0 711 q 101 989 0 918 q 309 1053 194 1053 l 566 1053 l 566 988 "},"β":{"x_min":0,"x_max":703,"ha":789,"o":"m 510 539 q 651 429 600 501 q 703 262 703 357 q 617 53 703 136 q 404 -29 532 -29 q 199 51 279 -29 l 199 -278 l 0 -278 l 0 627 q 77 911 0 812 q 343 1021 163 1021 q 551 957 464 1021 q 649 769 649 886 q 613 638 649 697 q 510 539 577 579 m 344 136 q 452 181 408 136 q 497 291 497 227 q 435 409 497 369 q 299 444 381 444 l 299 600 q 407 634 363 600 q 452 731 452 669 q 417 820 452 784 q 329 857 382 857 q 217 775 246 857 q 199 622 199 725 l 199 393 q 221 226 199 284 q 344 136 254 136 "},"Μ":{"x_min":0,"x_max":1019,"ha":1132,"o":"m 1019 0 l 823 0 l 823 818 l 617 0 l 402 0 l 194 818 l 194 0 l 0 0 l 0 1013 l 309 1013 l 509 241 l 708 1013 l 1019 1013 l 1019 0 "},"Ό":{"x_min":0.15625,"x_max":1174,"ha":1271,"o":"m 676 -29 q 312 127 451 -29 q 179 505 179 277 q 311 883 179 733 q 676 1040 449 1040 q 1040 883 901 1040 q 1174 505 1174 733 q 1041 127 1174 277 q 676 -29 903 -29 m 676 154 q 890 266 811 154 q 961 506 961 366 q 891 745 961 648 q 676 857 812 857 q 462 747 541 857 q 392 506 392 648 q 461 266 392 365 q 676 154 540 154 m 314 1034 l 98 779 l 0 779 l 136 1034 l 314 1034 "},"Ή":{"x_min":0,"x_max":1248,"ha":1361,"o":"m 1248 0 l 1038 0 l 1038 450 l 621 450 l 621 0 l 411 0 l 411 1012 l 621 1012 l 621 635 l 1038 635 l 1038 1012 l 1248 1012 l 1248 0 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "},"•":{"x_min":-27.78125,"x_max":691.671875,"ha":775,"o":"m 691 508 q 588 252 691 358 q 331 147 486 147 q 77 251 183 147 q -27 508 -27 355 q 75 761 -27 655 q 331 868 179 868 q 585 763 479 868 q 691 508 691 658 "},"¥":{"x_min":0,"x_max":836,"ha":931,"o":"m 195 625 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 l 650 625 l 777 625 l 777 472 l 578 472 l 538 389 l 777 389 l 777 236 l 532 236 l 532 0 l 322 0 l 322 236 l 79 236 l 79 389 l 315 389 l 273 472 l 79 472 l 79 625 l 195 625 "},"(":{"x_min":0,"x_max":388.890625,"ha":486,"o":"m 388 -293 l 243 -293 q 70 14 130 -134 q 0 357 0 189 q 69 703 0 526 q 243 1013 129 856 l 388 1013 q 248 695 297 860 q 200 358 200 530 q 248 24 200 187 q 388 -293 297 -138 "},"U":{"x_min":0,"x_max":813,"ha":926,"o":"m 813 362 q 697 79 813 187 q 405 -29 582 -29 q 114 78 229 -29 q 0 362 0 186 l 0 1013 l 210 1013 l 210 387 q 260 226 210 291 q 408 154 315 154 q 554 226 500 154 q 603 387 603 291 l 603 1013 l 813 1013 l 813 362 "},"γ":{"x_min":0.0625,"x_max":729.234375,"ha":815,"o":"m 729 749 l 457 37 l 457 -278 l 257 -278 l 257 37 q 218 155 243 95 q 170 275 194 215 l 0 749 l 207 749 l 363 284 l 522 749 l 729 749 "},"α":{"x_min":-1,"x_max":722,"ha":835,"o":"m 722 0 l 531 0 l 530 101 q 433 8 491 41 q 304 -25 375 -25 q 72 104 157 -25 q -1 372 -1 216 q 72 643 -1 530 q 308 775 158 775 q 433 744 375 775 q 528 656 491 713 l 528 749 l 722 749 l 722 0 m 361 601 q 233 527 277 601 q 196 375 196 464 q 232 224 196 288 q 358 144 277 144 q 487 217 441 144 q 528 370 528 281 q 489 523 528 457 q 361 601 443 601 "},"F":{"x_min":0,"x_max":706.953125,"ha":778,"o":"m 706 837 l 206 837 l 206 606 l 645 606 l 645 431 l 206 431 l 206 0 l 0 0 l 0 1013 l 706 1013 l 706 837 "},"­":{"x_min":0,"x_max":704.171875,"ha":801,"o":"m 704 297 l 0 297 l 0 450 l 704 450 l 704 297 "},":":{"x_min":0,"x_max":207,"ha":304,"o":"m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 m 207 0 l 0 0 l 0 207 l 207 207 l 207 0 "},"Χ":{"x_min":0,"x_max":894.453125,"ha":978,"o":"m 894 0 l 654 0 l 445 351 l 238 0 l 0 0 l 316 516 l 0 1013 l 238 1013 l 445 660 l 652 1013 l 894 1013 l 577 519 l 894 0 "},"*":{"x_min":115,"x_max":713,"ha":828,"o":"m 713 740 l 518 688 l 651 525 l 531 438 l 412 612 l 290 439 l 173 523 l 308 688 l 115 741 l 159 880 l 342 816 l 343 1013 l 482 1013 l 481 816 l 664 880 l 713 740 "},"†":{"x_min":0,"x_max":809,"ha":894,"o":"m 509 804 l 809 804 l 809 621 l 509 621 l 509 0 l 299 0 l 299 621 l 0 621 l 0 804 l 299 804 l 299 1011 l 509 1011 l 509 804 "},"°":{"x_min":-1,"x_max":363,"ha":460,"o":"m 181 808 q 46 862 94 808 q -1 992 -1 917 q 44 1118 -1 1066 q 181 1175 96 1175 q 317 1118 265 1175 q 363 991 363 1066 q 315 862 363 917 q 181 808 267 808 m 181 908 q 240 933 218 908 q 263 992 263 958 q 242 1051 263 1027 q 181 1075 221 1075 q 120 1050 142 1075 q 99 991 99 1026 q 120 933 99 958 q 181 908 142 908 "},"V":{"x_min":0,"x_max":895.828125,"ha":997,"o":"m 895 1013 l 550 0 l 347 0 l 0 1013 l 231 1013 l 447 256 l 666 1013 l 895 1013 "},"Ξ":{"x_min":0,"x_max":751.390625,"ha":800,"o":"m 733 826 l 5 826 l 5 1012 l 733 1012 l 733 826 m 681 432 l 65 432 l 65 617 l 681 617 l 681 432 m 751 0 l 0 0 l 0 183 l 751 183 l 751 0 "}," ":{"x_min":0,"x_max":0,"ha":853},"Ϋ":{"x_min":-0.21875,"x_max":836.171875,"ha":914,"o":"m 610 1046 l 454 1046 l 454 1215 l 610 1215 l 610 1046 m 369 1046 l 212 1046 l 212 1215 l 369 1215 l 369 1046 m 836 1012 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1012 l 208 1012 l 427 576 l 626 1012 l 836 1012 "},"0":{"x_min":51,"x_max":779,"ha":828,"o":"m 415 -26 q 142 129 242 -26 q 51 476 51 271 q 141 825 51 683 q 415 984 242 984 q 687 825 585 984 q 779 476 779 682 q 688 131 779 271 q 415 -26 587 -26 m 415 137 q 529 242 485 137 q 568 477 568 338 q 530 713 568 619 q 415 821 488 821 q 303 718 344 821 q 262 477 262 616 q 301 237 262 337 q 415 137 341 137 "},"”":{"x_min":0,"x_max":469,"ha":567,"o":"m 192 834 q 137 692 192 751 q 0 626 83 634 l 0 697 q 101 831 101 723 l 0 831 l 0 1013 l 192 1013 l 192 834 m 469 834 q 414 692 469 751 q 277 626 360 634 l 277 697 q 379 831 379 723 l 277 831 l 277 1013 l 469 1013 l 469 834 "},"@":{"x_min":0,"x_max":1276,"ha":1374,"o":"m 1115 -52 q 895 -170 1015 -130 q 647 -211 776 -211 q 158 -34 334 -211 q 0 360 0 123 q 179 810 0 621 q 698 1019 377 1019 q 1138 859 981 1019 q 1276 514 1276 720 q 1173 210 1276 335 q 884 75 1062 75 q 784 90 810 75 q 737 186 749 112 q 647 104 698 133 q 532 75 596 75 q 360 144 420 75 q 308 308 308 205 q 398 568 308 451 q 638 696 497 696 q 731 671 690 696 q 805 604 772 647 l 840 673 l 964 673 q 886 373 915 490 q 856 239 856 257 q 876 201 856 214 q 920 188 895 188 q 1084 284 1019 188 q 1150 511 1150 380 q 1051 779 1150 672 q 715 905 934 905 q 272 734 439 905 q 121 363 121 580 q 250 41 121 170 q 647 -103 394 -103 q 863 -67 751 -103 q 1061 26 975 -32 l 1115 -52 m 769 483 q 770 500 770 489 q 733 567 770 539 q 651 596 695 596 q 508 504 566 596 q 457 322 457 422 q 483 215 457 256 q 561 175 509 175 q 671 221 625 175 q 733 333 718 268 l 769 483 "},"Ί":{"x_min":0,"x_max":619,"ha":732,"o":"m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 m 619 0 l 411 0 l 411 1012 l 619 1012 l 619 0 "},"i":{"x_min":14,"x_max":214,"ha":326,"o":"m 214 830 l 14 830 l 14 1013 l 214 1013 l 214 830 m 214 0 l 14 0 l 14 748 l 214 748 l 214 0 "},"Β":{"x_min":0,"x_max":835,"ha":961,"o":"m 675 547 q 791 450 747 518 q 835 304 835 383 q 718 75 835 158 q 461 0 612 0 l 0 0 l 0 1013 l 477 1013 q 697 951 609 1013 q 797 754 797 880 q 766 630 797 686 q 675 547 734 575 m 439 621 q 539 646 496 621 q 590 730 590 676 q 537 814 590 785 q 436 838 494 838 l 199 838 l 199 621 l 439 621 m 445 182 q 561 211 513 182 q 618 311 618 247 q 565 410 618 375 q 444 446 512 446 l 199 446 l 199 182 l 445 182 "},"υ":{"x_min":0,"x_max":656,"ha":767,"o":"m 656 416 q 568 55 656 145 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 191 l 0 749 l 200 749 l 200 369 q 216 222 200 268 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 749 l 656 749 l 656 416 "},"]":{"x_min":0,"x_max":349,"ha":446,"o":"m 349 -300 l 0 -300 l 0 -154 l 163 -154 l 163 866 l 0 866 l 0 1013 l 349 1013 l 349 -300 "},"m":{"x_min":0,"x_max":1065,"ha":1174,"o":"m 1065 0 l 866 0 l 866 483 q 836 564 866 532 q 759 596 807 596 q 663 555 700 596 q 627 454 627 514 l 627 0 l 433 0 l 433 481 q 403 563 433 531 q 323 596 374 596 q 231 554 265 596 q 197 453 197 513 l 197 0 l 0 0 l 0 748 l 189 748 l 189 665 q 279 745 226 715 q 392 775 333 775 q 509 744 455 775 q 606 659 563 713 q 695 744 640 713 q 814 775 749 775 q 992 702 920 775 q 1065 523 1065 630 l 1065 0 "},"χ":{"x_min":0,"x_max":759.71875,"ha":847,"o":"m 759 -299 l 548 -299 l 379 66 l 215 -299 l 0 -299 l 261 233 l 13 749 l 230 749 l 379 400 l 527 749 l 738 749 l 500 238 l 759 -299 "},"8":{"x_min":57,"x_max":770,"ha":828,"o":"m 625 516 q 733 416 697 477 q 770 284 770 355 q 675 69 770 161 q 415 -29 574 -29 q 145 65 244 -29 q 57 273 57 150 q 93 413 57 350 q 204 516 130 477 q 112 609 142 556 q 83 718 83 662 q 177 905 83 824 q 414 986 272 986 q 650 904 555 986 q 745 715 745 822 q 716 608 745 658 q 625 516 688 558 m 414 590 q 516 624 479 590 q 553 706 553 659 q 516 791 553 755 q 414 828 480 828 q 311 792 348 828 q 275 706 275 757 q 310 624 275 658 q 414 590 345 590 m 413 135 q 527 179 487 135 q 564 279 564 218 q 525 386 564 341 q 411 436 482 436 q 298 387 341 436 q 261 282 261 344 q 300 178 261 222 q 413 135 340 135 "},"ί":{"x_min":42,"x_max":371.171875,"ha":389,"o":"m 242 0 l 42 0 l 42 748 l 242 748 l 242 0 m 371 1039 l 169 823 l 71 823 l 193 1039 l 371 1039 "},"Ζ":{"x_min":0,"x_max":804.171875,"ha":886,"o":"m 804 835 l 251 182 l 793 182 l 793 0 l 0 0 l 0 176 l 551 829 l 11 829 l 11 1012 l 804 1012 l 804 835 "},"R":{"x_min":0,"x_max":836.109375,"ha":947,"o":"m 836 0 l 608 0 q 588 53 596 20 q 581 144 581 86 q 581 179 581 162 q 581 215 581 197 q 553 345 581 306 q 428 393 518 393 l 208 393 l 208 0 l 0 0 l 0 1013 l 491 1013 q 720 944 630 1013 q 819 734 819 869 q 778 584 819 654 q 664 485 738 513 q 757 415 727 463 q 794 231 794 358 l 794 170 q 800 84 794 116 q 836 31 806 51 l 836 0 m 462 838 l 208 838 l 208 572 l 452 572 q 562 604 517 572 q 612 704 612 640 q 568 801 612 765 q 462 838 525 838 "},"o":{"x_min":0,"x_max":764,"ha":871,"o":"m 380 -26 q 105 86 211 -26 q 0 371 0 199 q 104 660 0 545 q 380 775 209 775 q 658 659 552 775 q 764 371 764 544 q 658 86 764 199 q 380 -26 552 -26 m 379 141 q 515 216 466 141 q 557 373 557 280 q 515 530 557 465 q 379 607 466 607 q 245 530 294 607 q 204 373 204 465 q 245 217 204 282 q 379 141 294 141 "},"5":{"x_min":59,"x_max":767,"ha":828,"o":"m 767 319 q 644 59 767 158 q 382 -29 533 -29 q 158 43 247 -29 q 59 264 59 123 l 252 264 q 295 165 252 201 q 400 129 339 129 q 512 172 466 129 q 564 308 564 220 q 514 437 564 387 q 398 488 464 488 q 329 472 361 488 q 271 420 297 456 l 93 428 l 157 958 l 722 958 l 722 790 l 295 790 l 271 593 q 348 635 306 621 q 431 649 389 649 q 663 551 560 649 q 767 319 767 453 "},"7":{"x_min":65.28125,"x_max":762.5,"ha":828,"o":"m 762 808 q 521 435 604 626 q 409 0 438 244 l 205 0 q 313 422 227 234 q 548 789 387 583 l 65 789 l 65 958 l 762 958 l 762 808 "},"K":{"x_min":0,"x_max":900,"ha":996,"o":"m 900 0 l 647 0 l 316 462 l 208 355 l 208 0 l 0 0 l 0 1013 l 208 1013 l 208 595 l 604 1013 l 863 1013 l 461 603 l 900 0 "},",":{"x_min":0,"x_max":206,"ha":303,"o":"m 206 5 q 150 -151 206 -88 q 0 -238 94 -213 l 0 -159 q 84 -100 56 -137 q 111 -2 111 -62 l 0 -2 l 0 205 l 206 205 l 206 5 "},"d":{"x_min":0,"x_max":722,"ha":836,"o":"m 722 0 l 530 0 l 530 101 q 303 -26 449 -26 q 72 103 155 -26 q 0 373 0 214 q 72 642 0 528 q 305 775 156 775 q 433 743 373 775 q 530 656 492 712 l 530 1013 l 722 1013 l 722 0 m 361 600 q 234 523 280 600 q 196 372 196 458 q 233 220 196 286 q 358 143 278 143 q 489 216 442 143 q 530 369 530 280 q 491 522 530 456 q 361 600 443 600 "},"¨":{"x_min":212,"x_max":609,"ha":933,"o":"m 609 1046 l 453 1046 l 453 1216 l 609 1216 l 609 1046 m 369 1046 l 212 1046 l 212 1216 l 369 1216 l 369 1046 "},"E":{"x_min":0,"x_max":761.109375,"ha":824,"o":"m 761 0 l 0 0 l 0 1013 l 734 1013 l 734 837 l 206 837 l 206 621 l 690 621 l 690 446 l 206 446 l 206 186 l 761 186 l 761 0 "},"Y":{"x_min":0,"x_max":836,"ha":931,"o":"m 836 1013 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 "},"\"":{"x_min":0,"x_max":357,"ha":454,"o":"m 357 604 l 225 604 l 225 988 l 357 988 l 357 604 m 132 604 l 0 604 l 0 988 l 132 988 l 132 604 "},"‹":{"x_min":35.984375,"x_max":791.671875,"ha":828,"o":"m 791 17 l 36 352 l 35 487 l 791 823 l 791 672 l 229 421 l 791 168 l 791 17 "},"„":{"x_min":0,"x_max":483,"ha":588,"o":"m 206 5 q 150 -151 206 -88 q 0 -238 94 -213 l 0 -159 q 84 -100 56 -137 q 111 -2 111 -62 l 0 -2 l 0 205 l 206 205 l 206 5 m 483 5 q 427 -151 483 -88 q 277 -238 371 -213 l 277 -159 q 361 -100 334 -137 q 388 -2 388 -62 l 277 -2 l 277 205 l 483 205 l 483 5 "},"δ":{"x_min":6,"x_max":732,"ha":835,"o":"m 732 352 q 630 76 732 177 q 354 -25 529 -25 q 101 74 197 -25 q 6 333 6 174 q 89 581 6 480 q 323 690 178 690 q 66 864 201 787 l 66 1013 l 669 1013 l 669 856 l 348 856 q 532 729 461 789 q 673 566 625 651 q 732 352 732 465 m 419 551 q 259 496 321 551 q 198 344 198 441 q 238 208 198 267 q 357 140 283 140 q 484 203 437 140 q 526 344 526 260 q 499 466 526 410 q 419 551 473 521 "},"έ":{"x_min":16.671875,"x_max":652.78125,"ha":742,"o":"m 652 259 q 565 49 652 123 q 340 -25 479 -25 q 102 39 188 -25 q 16 197 16 104 q 45 299 16 250 q 134 390 75 348 q 58 456 86 419 q 25 552 25 502 q 120 717 25 653 q 322 776 208 776 q 537 710 456 776 q 625 508 625 639 l 445 508 q 415 585 445 563 q 327 608 386 608 q 254 590 293 608 q 215 544 215 573 q 252 469 215 490 q 336 453 280 453 q 369 455 347 453 q 400 456 391 456 l 400 308 l 329 308 q 247 291 280 308 q 204 223 204 269 q 255 154 204 172 q 345 143 286 143 q 426 174 398 143 q 454 259 454 206 l 652 259 m 579 1039 l 377 823 l 279 823 l 401 1039 l 579 1039 "},"ω":{"x_min":0,"x_max":945,"ha":1051,"o":"m 565 323 l 565 289 q 577 190 565 221 q 651 142 597 142 q 718 189 694 142 q 742 365 742 237 q 703 565 742 462 q 610 749 671 650 l 814 749 q 910 547 876 650 q 945 337 945 444 q 874 96 945 205 q 668 -29 793 -29 q 551 0 608 -29 q 470 78 495 30 q 390 0 444 28 q 276 -29 337 -29 q 69 96 149 -29 q 0 337 0 204 q 36 553 0 444 q 130 749 68 650 l 334 749 q 241 565 273 650 q 203 365 203 461 q 219 222 203 279 q 292 142 243 142 q 360 183 342 142 q 373 271 373 211 q 372 298 372 285 q 372 323 372 311 l 372 528 l 566 528 l 565 323 "},"´":{"x_min":0,"x_max":132,"ha":299,"o":"m 132 604 l 0 604 l 0 988 l 132 988 l 132 604 "},"±":{"x_min":29,"x_max":798,"ha":828,"o":"m 798 480 l 484 480 l 484 254 l 344 254 l 344 480 l 29 480 l 29 615 l 344 615 l 344 842 l 484 842 l 484 615 l 798 615 l 798 480 m 798 0 l 29 0 l 29 136 l 798 136 l 798 0 "},"|":{"x_min":0,"x_max":143,"ha":240,"o":"m 143 462 l 0 462 l 0 984 l 143 984 l 143 462 m 143 -242 l 0 -242 l 0 280 l 143 280 l 143 -242 "},"ϋ":{"x_min":0,"x_max":656,"ha":767,"o":"m 535 810 l 406 810 l 406 952 l 535 952 l 535 810 m 271 810 l 142 810 l 142 952 l 271 952 l 271 810 m 656 417 q 568 55 656 146 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 200 369 q 216 222 200 268 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 748 l 656 748 l 656 417 "},"§":{"x_min":0,"x_max":633,"ha":731,"o":"m 633 469 q 601 356 633 406 q 512 274 569 305 q 570 197 548 242 q 593 105 593 152 q 501 -76 593 -5 q 301 -142 416 -142 q 122 -82 193 -142 q 43 108 43 -15 l 212 108 q 251 27 220 53 q 321 1 283 1 q 389 23 360 1 q 419 83 419 46 q 310 194 419 139 q 108 297 111 295 q 0 476 0 372 q 33 584 0 537 q 120 659 62 626 q 72 720 91 686 q 53 790 53 755 q 133 978 53 908 q 312 1042 207 1042 q 483 984 412 1042 q 574 807 562 921 l 409 807 q 379 875 409 851 q 307 900 349 900 q 244 881 270 900 q 218 829 218 862 q 324 731 218 781 q 524 636 506 647 q 633 469 633 565 m 419 334 q 473 411 473 372 q 451 459 473 436 q 390 502 430 481 l 209 595 q 167 557 182 577 q 153 520 153 537 q 187 461 153 491 q 263 413 212 440 l 419 334 "},"b":{"x_min":0,"x_max":722,"ha":822,"o":"m 416 -26 q 289 6 346 -26 q 192 101 232 39 l 192 0 l 0 0 l 0 1013 l 192 1013 l 192 656 q 286 743 226 712 q 415 775 346 775 q 649 644 564 775 q 722 374 722 533 q 649 106 722 218 q 416 -26 565 -26 m 361 600 q 232 524 279 600 q 192 371 192 459 q 229 221 192 284 q 357 145 275 145 q 487 221 441 145 q 526 374 526 285 q 488 523 526 460 q 361 600 442 600 "},"q":{"x_min":0,"x_max":722,"ha":833,"o":"m 722 -298 l 530 -298 l 530 97 q 306 -25 449 -25 q 73 104 159 -25 q 0 372 0 216 q 72 643 0 529 q 305 775 156 775 q 430 742 371 775 q 530 654 488 709 l 530 750 l 722 750 l 722 -298 m 360 601 q 234 527 278 601 q 197 378 197 466 q 233 225 197 291 q 357 144 277 144 q 488 217 441 144 q 530 370 530 282 q 491 523 530 459 q 360 601 443 601 "},"Ω":{"x_min":-0.03125,"x_max":1008.53125,"ha":1108,"o":"m 1008 0 l 589 0 l 589 199 q 717 368 670 265 q 764 580 764 471 q 698 778 764 706 q 504 855 629 855 q 311 773 380 855 q 243 563 243 691 q 289 360 243 458 q 419 199 336 262 l 419 0 l 0 0 l 0 176 l 202 176 q 77 355 123 251 q 32 569 32 459 q 165 908 32 776 q 505 1040 298 1040 q 844 912 711 1040 q 977 578 977 785 q 931 362 977 467 q 805 176 886 256 l 1008 176 l 1008 0 "},"ύ":{"x_min":0,"x_max":656,"ha":767,"o":"m 656 417 q 568 55 656 146 q 326 -25 490 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 201 369 q 218 222 201 269 q 326 142 245 142 q 440 247 411 142 q 456 422 456 304 l 456 748 l 656 748 l 656 417 m 579 1039 l 378 823 l 279 823 l 401 1039 l 579 1039 "},"z":{"x_min":0,"x_max":663.890625,"ha":753,"o":"m 663 0 l 0 0 l 0 154 l 411 591 l 25 591 l 25 749 l 650 749 l 650 584 l 245 165 l 663 165 l 663 0 "},"™":{"x_min":0,"x_max":951,"ha":1063,"o":"m 405 921 l 255 921 l 255 506 l 149 506 l 149 921 l 0 921 l 0 1013 l 405 1013 l 405 921 m 951 506 l 852 506 l 852 916 l 750 506 l 643 506 l 539 915 l 539 506 l 442 506 l 442 1013 l 595 1012 l 695 625 l 794 1013 l 951 1013 l 951 506 "},"ή":{"x_min":0,"x_max":669,"ha":779,"o":"m 669 -278 l 469 -278 l 469 390 q 448 526 469 473 q 348 606 417 606 q 244 553 288 606 q 201 441 201 501 l 201 0 l 0 0 l 0 749 l 201 749 l 201 665 q 301 744 244 715 q 423 774 359 774 q 606 685 538 774 q 669 484 669 603 l 669 -278 m 495 1039 l 293 823 l 195 823 l 317 1039 l 495 1039 "},"Θ":{"x_min":0,"x_max":993,"ha":1092,"o":"m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 133 883 0 733 q 497 1040 272 1040 q 861 883 722 1040 q 993 505 993 733 q 861 127 993 277 q 497 -29 722 -29 m 497 154 q 711 266 631 154 q 782 506 782 367 q 712 746 782 648 q 497 858 634 858 q 281 746 361 858 q 211 506 211 648 q 280 266 211 365 q 497 154 359 154 m 676 430 l 316 430 l 316 593 l 676 593 l 676 430 "},"®":{"x_min":3,"x_max":1007,"ha":1104,"o":"m 507 -6 q 129 153 269 -6 q 3 506 3 298 q 127 857 3 713 q 502 1017 266 1017 q 880 855 740 1017 q 1007 502 1007 711 q 882 152 1007 295 q 507 -6 743 -6 m 502 934 q 184 800 302 934 q 79 505 79 680 q 184 210 79 331 q 501 76 302 76 q 819 210 701 76 q 925 507 925 331 q 820 800 925 682 q 502 934 704 934 m 782 190 l 639 190 q 627 225 632 202 q 623 285 623 248 l 623 326 q 603 411 623 384 q 527 439 584 439 l 388 439 l 388 190 l 257 190 l 257 829 l 566 829 q 709 787 654 829 q 772 654 772 740 q 746 559 772 604 q 675 497 720 514 q 735 451 714 483 q 756 341 756 419 l 756 299 q 760 244 756 265 q 782 212 764 223 l 782 190 m 546 718 l 388 718 l 388 552 l 541 552 q 612 572 584 552 q 641 635 641 593 q 614 695 641 672 q 546 718 587 718 "},"~":{"x_min":0,"x_max":851,"ha":949,"o":"m 851 968 q 795 750 851 831 q 599 656 730 656 q 406 744 506 656 q 259 832 305 832 q 162 775 193 832 q 139 656 139 730 l 0 656 q 58 871 0 787 q 251 968 124 968 q 442 879 341 968 q 596 791 544 791 q 691 849 663 791 q 712 968 712 892 l 851 968 "},"Ε":{"x_min":0,"x_max":761.546875,"ha":824,"o":"m 761 0 l 0 0 l 0 1012 l 735 1012 l 735 836 l 206 836 l 206 621 l 690 621 l 690 446 l 206 446 l 206 186 l 761 186 l 761 0 "},"³":{"x_min":0,"x_max":467,"ha":564,"o":"m 467 555 q 393 413 467 466 q 229 365 325 365 q 70 413 134 365 q 0 565 0 467 l 123 565 q 163 484 131 512 q 229 461 190 461 q 299 486 269 461 q 329 553 329 512 q 281 627 329 607 q 187 641 248 641 l 187 722 q 268 737 237 722 q 312 804 312 758 q 285 859 312 837 q 224 882 259 882 q 165 858 189 882 q 135 783 140 834 l 12 783 q 86 930 20 878 q 230 976 145 976 q 379 931 314 976 q 444 813 444 887 q 423 744 444 773 q 365 695 402 716 q 439 640 412 676 q 467 555 467 605 "},"[":{"x_min":0,"x_max":347.21875,"ha":444,"o":"m 347 -300 l 0 -300 l 0 1013 l 347 1013 l 347 866 l 188 866 l 188 -154 l 347 -154 l 347 -300 "},"L":{"x_min":0,"x_max":704.171875,"ha":763,"o":"m 704 0 l 0 0 l 0 1013 l 208 1013 l 208 186 l 704 186 l 704 0 "},"σ":{"x_min":0,"x_max":851.3125,"ha":940,"o":"m 851 594 l 712 594 q 761 369 761 485 q 658 83 761 191 q 379 -25 555 -25 q 104 87 208 -25 q 0 372 0 200 q 103 659 0 544 q 378 775 207 775 q 464 762 407 775 q 549 750 521 750 l 851 750 l 851 594 m 379 142 q 515 216 466 142 q 557 373 557 280 q 515 530 557 465 q 379 608 465 608 q 244 530 293 608 q 203 373 203 465 q 244 218 203 283 q 379 142 293 142 "},"ζ":{"x_min":0,"x_max":622,"ha":701,"o":"m 622 -32 q 604 -158 622 -98 q 551 -278 587 -218 l 373 -278 q 426 -180 406 -229 q 446 -80 446 -131 q 421 -22 446 -37 q 354 -8 397 -8 q 316 -9 341 -8 q 280 -11 291 -11 q 75 69 150 -11 q 0 283 0 150 q 87 596 0 437 q 291 856 162 730 l 47 856 l 47 1013 l 592 1013 l 592 904 q 317 660 422 800 q 197 318 197 497 q 306 141 197 169 q 510 123 408 131 q 622 -32 622 102 "},"θ":{"x_min":0,"x_max":714,"ha":817,"o":"m 357 1022 q 633 833 534 1022 q 714 486 714 679 q 634 148 714 288 q 354 -25 536 -25 q 79 147 175 -25 q 0 481 0 288 q 79 831 0 679 q 357 1022 177 1022 m 510 590 q 475 763 510 687 q 351 862 430 862 q 233 763 272 862 q 204 590 204 689 l 510 590 m 510 440 l 204 440 q 233 251 204 337 q 355 131 274 131 q 478 248 434 131 q 510 440 510 337 "},"Ο":{"x_min":0,"x_max":995,"ha":1092,"o":"m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 132 883 0 733 q 497 1040 270 1040 q 861 883 722 1040 q 995 505 995 733 q 862 127 995 277 q 497 -29 724 -29 m 497 154 q 711 266 632 154 q 781 506 781 365 q 711 745 781 647 q 497 857 632 857 q 283 747 361 857 q 213 506 213 647 q 282 266 213 365 q 497 154 361 154 "},"Γ":{"x_min":0,"x_max":703.84375,"ha":742,"o":"m 703 836 l 208 836 l 208 0 l 0 0 l 0 1012 l 703 1012 l 703 836 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":0,"x_max":1111,"ha":1213,"o":"m 861 484 q 1048 404 979 484 q 1111 228 1111 332 q 1048 51 1111 123 q 859 -29 979 -29 q 672 50 740 -29 q 610 227 610 122 q 672 403 610 331 q 861 484 741 484 m 861 120 q 939 151 911 120 q 967 226 967 183 q 942 299 967 270 q 861 333 912 333 q 783 301 811 333 q 756 226 756 269 q 783 151 756 182 q 861 120 810 120 m 904 984 l 316 -28 l 205 -29 l 793 983 l 904 984 m 250 984 q 436 904 366 984 q 499 730 499 832 q 436 552 499 626 q 248 472 366 472 q 62 552 132 472 q 0 728 0 624 q 62 903 0 831 q 250 984 132 984 m 249 835 q 169 801 198 835 q 140 725 140 768 q 167 652 140 683 q 247 621 195 621 q 327 654 298 621 q 357 730 357 687 q 329 803 357 772 q 249 835 301 835 "},"P":{"x_min":0,"x_max":771,"ha":838,"o":"m 208 361 l 208 0 l 0 0 l 0 1013 l 450 1013 q 682 919 593 1013 q 771 682 771 826 q 687 452 771 544 q 466 361 604 361 l 208 361 m 421 837 l 208 837 l 208 544 l 410 544 q 525 579 480 544 q 571 683 571 615 q 527 792 571 747 q 421 837 484 837 "},"Έ":{"x_min":0,"x_max":1172.546875,"ha":1235,"o":"m 1172 0 l 411 0 l 411 1012 l 1146 1012 l 1146 836 l 617 836 l 617 621 l 1101 621 l 1101 446 l 617 446 l 617 186 l 1172 186 l 1172 0 m 313 1035 l 98 780 l 0 780 l 136 1035 l 313 1035 "},"Ώ":{"x_min":0.4375,"x_max":1189.546875,"ha":1289,"o":"m 1189 0 l 770 0 l 770 199 q 897 369 849 263 q 945 580 945 474 q 879 778 945 706 q 685 855 810 855 q 492 773 561 855 q 424 563 424 691 q 470 360 424 458 q 600 199 517 262 l 600 0 l 180 0 l 180 176 l 383 176 q 258 355 304 251 q 213 569 213 459 q 346 908 213 776 q 686 1040 479 1040 q 1025 912 892 1040 q 1158 578 1158 785 q 1112 362 1158 467 q 986 176 1067 256 l 1189 176 l 1189 0 m 314 1092 l 99 837 l 0 837 l 136 1092 l 314 1092 "},"_":{"x_min":61.109375,"x_max":766.671875,"ha":828,"o":"m 766 -333 l 61 -333 l 61 -190 l 766 -190 l 766 -333 "},"Ϊ":{"x_min":-56,"x_max":342,"ha":503,"o":"m 342 1046 l 186 1046 l 186 1215 l 342 1215 l 342 1046 m 101 1046 l -56 1046 l -56 1215 l 101 1215 l 101 1046 m 249 0 l 41 0 l 41 1012 l 249 1012 l 249 0 "},"+":{"x_min":43,"x_max":784,"ha":828,"o":"m 784 353 l 483 353 l 483 0 l 343 0 l 343 353 l 43 353 l 43 489 l 343 489 l 343 840 l 483 840 l 483 489 l 784 489 l 784 353 "},"½":{"x_min":0,"x_max":1090,"ha":1188,"o":"m 1090 380 q 992 230 1090 301 q 779 101 886 165 q 822 94 784 95 q 924 93 859 93 l 951 93 l 973 93 l 992 93 l 1009 93 q 1046 93 1027 93 q 1085 93 1066 93 l 1085 0 l 650 0 l 654 38 q 815 233 665 137 q 965 376 965 330 q 936 436 965 412 q 869 461 908 461 q 806 435 831 461 q 774 354 780 409 l 659 354 q 724 505 659 451 q 870 554 783 554 q 1024 506 958 554 q 1090 380 1090 459 m 868 998 l 268 -28 l 154 -27 l 757 999 l 868 998 m 272 422 l 147 422 l 147 799 l 0 799 l 0 875 q 126 900 91 875 q 170 973 162 926 l 272 973 l 272 422 "},"Ρ":{"x_min":0,"x_max":771,"ha":838,"o":"m 208 361 l 208 0 l 0 0 l 0 1012 l 450 1012 q 682 919 593 1012 q 771 681 771 826 q 687 452 771 544 q 466 361 604 361 l 208 361 m 422 836 l 209 836 l 209 544 l 410 544 q 525 579 480 544 q 571 683 571 614 q 527 791 571 747 q 422 836 484 836 "},"'":{"x_min":0,"x_max":192,"ha":289,"o":"m 192 834 q 137 692 192 751 q 0 626 82 632 l 0 697 q 101 830 101 726 l 0 830 l 0 1013 l 192 1013 l 192 834 "},"ª":{"x_min":0,"x_max":350,"ha":393,"o":"m 350 625 l 245 625 q 237 648 241 636 q 233 672 233 661 q 117 611 192 611 q 33 643 66 611 q 0 727 0 675 q 116 846 0 828 q 233 886 233 864 q 211 919 233 907 q 168 931 190 931 q 108 877 108 931 l 14 877 q 56 977 14 942 q 165 1013 98 1013 q 270 987 224 1013 q 329 903 329 955 l 329 694 q 332 661 329 675 q 350 641 336 648 l 350 625 m 233 774 l 233 809 q 151 786 180 796 q 97 733 97 768 q 111 700 97 712 q 149 689 126 689 q 210 713 187 689 q 233 774 233 737 "},"΅":{"x_min":57,"x_max":584,"ha":753,"o":"m 584 810 l 455 810 l 455 952 l 584 952 l 584 810 m 521 1064 l 305 810 l 207 810 l 343 1064 l 521 1064 m 186 810 l 57 810 l 57 952 l 186 952 l 186 810 "},"T":{"x_min":0,"x_max":809,"ha":894,"o":"m 809 831 l 509 831 l 509 0 l 299 0 l 299 831 l 0 831 l 0 1013 l 809 1013 l 809 831 "},"Φ":{"x_min":0,"x_max":949,"ha":1032,"o":"m 566 0 l 385 0 l 385 121 q 111 230 222 121 q 0 508 0 340 q 112 775 0 669 q 385 892 219 875 l 385 1013 l 566 1013 l 566 892 q 836 776 732 875 q 949 507 949 671 q 838 231 949 341 q 566 121 728 121 l 566 0 m 566 285 q 701 352 650 285 q 753 508 753 419 q 703 658 753 597 q 566 729 653 720 l 566 285 m 385 285 l 385 729 q 245 661 297 717 q 193 516 193 604 q 246 356 193 427 q 385 285 300 285 "},"j":{"x_min":-45.828125,"x_max":242,"ha":361,"o":"m 242 830 l 42 830 l 42 1013 l 242 1013 l 242 830 m 242 -119 q 180 -267 242 -221 q 20 -308 127 -308 l -45 -308 l -45 -140 l -24 -140 q 25 -130 8 -140 q 42 -88 42 -120 l 42 748 l 242 748 l 242 -119 "},"Σ":{"x_min":0,"x_max":772.21875,"ha":849,"o":"m 772 0 l 0 0 l 0 140 l 368 526 l 18 862 l 18 1012 l 740 1012 l 740 836 l 315 836 l 619 523 l 298 175 l 772 175 l 772 0 "},"1":{"x_min":197.609375,"x_max":628,"ha":828,"o":"m 628 0 l 434 0 l 434 674 l 197 674 l 197 810 q 373 837 318 810 q 468 984 450 876 l 628 984 l 628 0 "},"›":{"x_min":36.109375,"x_max":792,"ha":828,"o":"m 792 352 l 36 17 l 36 168 l 594 420 l 36 672 l 36 823 l 792 487 l 792 352 "},"<":{"x_min":35.984375,"x_max":791.671875,"ha":828,"o":"m 791 17 l 36 352 l 35 487 l 791 823 l 791 672 l 229 421 l 791 168 l 791 17 "},"£":{"x_min":0,"x_max":716.546875,"ha":814,"o":"m 716 38 q 603 -9 658 5 q 502 -24 548 -24 q 398 -10 451 -24 q 239 25 266 25 q 161 12 200 25 q 77 -29 122 0 l 0 113 q 110 211 81 174 q 151 315 151 259 q 117 440 151 365 l 0 440 l 0 515 l 73 515 q 35 610 52 560 q 15 710 15 671 q 119 910 15 831 q 349 984 216 984 q 570 910 480 984 q 693 668 674 826 l 501 668 q 455 791 501 746 q 353 830 414 830 q 256 795 298 830 q 215 705 215 760 q 249 583 215 655 q 283 515 266 548 l 479 515 l 479 440 l 309 440 q 316 394 313 413 q 319 355 319 374 q 287 241 319 291 q 188 135 263 205 q 262 160 225 152 q 332 168 298 168 q 455 151 368 168 q 523 143 500 143 q 588 152 558 143 q 654 189 617 162 l 716 38 "},"t":{"x_min":0,"x_max":412,"ha":511,"o":"m 412 -6 q 349 -8 391 -6 q 287 -11 307 -11 q 137 38 177 -11 q 97 203 97 87 l 97 609 l 0 609 l 0 749 l 97 749 l 97 951 l 297 951 l 297 749 l 412 749 l 412 609 l 297 609 l 297 191 q 315 152 297 162 q 366 143 334 143 q 389 143 378 143 q 412 143 400 143 l 412 -6 "},"¬":{"x_min":0,"x_max":704,"ha":801,"o":"m 704 93 l 551 93 l 551 297 l 0 297 l 0 450 l 704 450 l 704 93 "},"λ":{"x_min":0,"x_max":701.390625,"ha":775,"o":"m 701 0 l 491 0 l 345 444 l 195 0 l 0 0 l 238 697 l 131 1013 l 334 1013 l 701 0 "},"W":{"x_min":0,"x_max":1291.671875,"ha":1399,"o":"m 1291 1013 l 1002 0 l 802 0 l 645 777 l 490 0 l 288 0 l 0 1013 l 215 1013 l 388 298 l 534 1012 l 757 1013 l 904 299 l 1076 1013 l 1291 1013 "},">":{"x_min":36.109375,"x_max":792,"ha":828,"o":"m 792 352 l 36 17 l 36 168 l 594 420 l 36 672 l 36 823 l 792 487 l 792 352 "},"v":{"x_min":0,"x_max":740.28125,"ha":828,"o":"m 740 749 l 473 0 l 266 0 l 0 749 l 222 749 l 373 211 l 529 749 l 740 749 "},"τ":{"x_min":0.28125,"x_max":618.734375,"ha":699,"o":"m 618 593 l 409 593 l 409 0 l 210 0 l 210 593 l 0 593 l 0 749 l 618 749 l 618 593 "},"ξ":{"x_min":0,"x_max":640,"ha":715,"o":"m 640 -14 q 619 -157 640 -84 q 563 -299 599 -230 l 399 -299 q 442 -194 433 -223 q 468 -85 468 -126 q 440 -25 468 -41 q 368 -10 412 -10 q 333 -11 355 -10 q 302 -13 311 -13 q 91 60 179 -13 q 0 259 0 138 q 56 426 0 354 q 201 530 109 493 q 106 594 144 553 q 65 699 65 642 q 94 787 65 747 q 169 856 123 828 l 22 856 l 22 1013 l 597 1013 l 597 856 l 497 857 q 345 840 398 857 q 257 736 257 812 q 366 614 257 642 q 552 602 416 602 l 552 446 l 513 446 q 313 425 379 446 q 199 284 199 389 q 312 162 199 184 q 524 136 418 148 q 640 -14 640 105 "},"&":{"x_min":-1,"x_max":910.109375,"ha":1007,"o":"m 910 -1 l 676 -1 l 607 83 q 291 -47 439 -47 q 50 100 135 -47 q -1 273 -1 190 q 51 431 -1 357 q 218 568 104 505 q 151 661 169 629 q 120 769 120 717 q 201 951 120 885 q 382 1013 276 1013 q 555 957 485 1013 q 635 789 635 894 q 584 644 635 709 q 468 539 548 597 l 615 359 q 664 527 654 440 l 844 527 q 725 223 824 359 l 910 -1 m 461 787 q 436 848 461 826 q 381 870 412 870 q 325 849 349 870 q 301 792 301 829 q 324 719 301 757 q 372 660 335 703 q 430 714 405 680 q 461 787 461 753 m 500 214 l 318 441 q 198 286 198 363 q 225 204 198 248 q 347 135 268 135 q 425 153 388 135 q 500 214 462 172 "},"Λ":{"x_min":0,"x_max":894.453125,"ha":974,"o":"m 894 0 l 666 0 l 447 757 l 225 0 l 0 0 l 344 1013 l 547 1013 l 894 0 "},"I":{"x_min":41,"x_max":249,"ha":365,"o":"m 249 0 l 41 0 l 41 1013 l 249 1013 l 249 0 "},"G":{"x_min":0,"x_max":971,"ha":1057,"o":"m 971 -1 l 829 -1 l 805 118 q 479 -29 670 -29 q 126 133 261 -29 q 0 509 0 286 q 130 884 0 737 q 493 1040 268 1040 q 790 948 659 1040 q 961 698 920 857 l 736 698 q 643 813 709 769 q 500 857 578 857 q 285 746 364 857 q 213 504 213 644 q 285 263 213 361 q 505 154 365 154 q 667 217 598 154 q 761 374 736 280 l 548 374 l 548 548 l 971 548 l 971 -1 "},"ΰ":{"x_min":0,"x_max":655,"ha":767,"o":"m 583 810 l 454 810 l 454 952 l 583 952 l 583 810 m 186 810 l 57 809 l 57 952 l 186 952 l 186 810 m 516 1039 l 315 823 l 216 823 l 338 1039 l 516 1039 m 655 417 q 567 55 655 146 q 326 -25 489 -25 q 59 97 137 -25 q 0 369 0 192 l 0 748 l 200 748 l 201 369 q 218 222 201 269 q 326 142 245 142 q 439 247 410 142 q 455 422 455 304 l 455 748 l 655 748 l 655 417 "},"`":{"x_min":0,"x_max":190,"ha":288,"o":"m 190 654 l 0 654 l 0 830 q 55 970 0 909 q 190 1040 110 1031 l 190 969 q 111 922 134 952 q 88 836 88 892 l 190 836 l 190 654 "},"·":{"x_min":0,"x_max":207,"ha":304,"o":"m 207 528 l 0 528 l 0 735 l 207 735 l 207 528 "},"Υ":{"x_min":-0.21875,"x_max":836.171875,"ha":914,"o":"m 836 1013 l 532 376 l 532 0 l 322 0 l 322 376 l 0 1013 l 208 1013 l 427 576 l 626 1013 l 836 1013 "},"r":{"x_min":0,"x_max":431.9375,"ha":513,"o":"m 431 564 q 269 536 320 564 q 200 395 200 498 l 200 0 l 0 0 l 0 748 l 183 748 l 183 618 q 285 731 224 694 q 431 768 345 768 l 431 564 "},"x":{"x_min":0,"x_max":738.890625,"ha":826,"o":"m 738 0 l 504 0 l 366 238 l 230 0 l 0 0 l 252 382 l 11 749 l 238 749 l 372 522 l 502 749 l 725 749 l 488 384 l 738 0 "},"μ":{"x_min":0,"x_max":647,"ha":754,"o":"m 647 0 l 477 0 l 477 68 q 411 9 448 30 q 330 -11 374 -11 q 261 3 295 -11 q 199 43 226 18 l 199 -278 l 0 -278 l 0 749 l 199 749 l 199 358 q 216 222 199 268 q 322 152 244 152 q 435 240 410 152 q 448 401 448 283 l 448 749 l 647 749 l 647 0 "},"h":{"x_min":0,"x_max":669,"ha":782,"o":"m 669 0 l 469 0 l 469 390 q 449 526 469 472 q 353 607 420 607 q 248 554 295 607 q 201 441 201 501 l 201 0 l 0 0 l 0 1013 l 201 1013 l 201 665 q 303 743 245 715 q 425 772 362 772 q 609 684 542 772 q 669 484 669 605 l 669 0 "},".":{"x_min":0,"x_max":206,"ha":303,"o":"m 206 0 l 0 0 l 0 207 l 206 207 l 206 0 "},"φ":{"x_min":-1,"x_max":921,"ha":990,"o":"m 542 -278 l 367 -278 l 367 -22 q 99 92 200 -22 q -1 376 -1 206 q 72 627 -1 520 q 288 769 151 742 l 288 581 q 222 495 243 550 q 202 378 202 439 q 240 228 202 291 q 367 145 285 157 l 367 776 l 515 776 q 807 667 694 776 q 921 379 921 558 q 815 93 921 209 q 542 -22 709 -22 l 542 -278 m 542 145 q 672 225 625 145 q 713 381 713 291 q 671 536 713 470 q 542 611 624 611 l 542 145 "},";":{"x_min":0,"x_max":208,"ha":306,"o":"m 208 528 l 0 528 l 0 735 l 208 735 l 208 528 m 208 6 q 152 -151 208 -89 q 0 -238 96 -212 l 0 -158 q 87 -100 61 -136 q 113 0 113 -65 l 0 0 l 0 207 l 208 207 l 208 6 "},"f":{"x_min":0,"x_max":424,"ha":525,"o":"m 424 609 l 300 609 l 300 0 l 107 0 l 107 609 l 0 609 l 0 749 l 107 749 q 145 949 107 894 q 328 1019 193 1019 l 424 1015 l 424 855 l 362 855 q 312 841 324 855 q 300 797 300 827 q 300 773 300 786 q 300 749 300 761 l 424 749 l 424 609 "},"“":{"x_min":0,"x_max":468,"ha":567,"o":"m 190 631 l 0 631 l 0 807 q 55 947 0 885 q 190 1017 110 1010 l 190 947 q 88 813 88 921 l 190 813 l 190 631 m 468 631 l 278 631 l 278 807 q 333 947 278 885 q 468 1017 388 1010 l 468 947 q 366 813 366 921 l 468 813 l 468 631 "},"A":{"x_min":0,"x_max":966.671875,"ha":1069,"o":"m 966 0 l 747 0 l 679 208 l 286 208 l 218 0 l 0 0 l 361 1013 l 600 1013 l 966 0 m 623 376 l 480 810 l 340 376 l 623 376 "},"6":{"x_min":57,"x_max":771,"ha":828,"o":"m 744 734 l 544 734 q 500 802 533 776 q 425 828 466 828 q 315 769 359 828 q 264 571 264 701 q 451 638 343 638 q 691 537 602 638 q 771 315 771 449 q 683 79 771 176 q 420 -29 586 -29 q 134 123 227 -29 q 57 455 57 250 q 184 865 57 721 q 452 988 293 988 q 657 916 570 988 q 744 734 744 845 m 426 128 q 538 178 498 128 q 578 300 578 229 q 538 422 578 372 q 415 479 493 479 q 303 430 342 479 q 264 313 264 381 q 308 184 264 240 q 426 128 352 128 "},"‘":{"x_min":0,"x_max":190,"ha":289,"o":"m 190 631 l 0 631 l 0 807 q 55 947 0 885 q 190 1017 110 1010 l 190 947 q 88 813 88 921 l 190 813 l 190 631 "},"ϊ":{"x_min":-55,"x_max":337,"ha":389,"o":"m 337 810 l 208 810 l 208 952 l 337 952 l 337 810 m 74 810 l -55 810 l -55 952 l 74 952 l 74 810 m 242 0 l 42 0 l 42 748 l 242 748 l 242 0 "},"π":{"x_min":0.5,"x_max":838.890625,"ha":938,"o":"m 838 593 l 750 593 l 750 0 l 549 0 l 549 593 l 287 593 l 287 0 l 88 0 l 88 593 l 0 593 l 0 749 l 838 749 l 838 593 "},"ά":{"x_min":-1,"x_max":722,"ha":835,"o":"m 722 0 l 531 0 l 530 101 q 433 8 491 41 q 304 -25 375 -25 q 72 104 157 -25 q -1 372 -1 216 q 72 643 -1 530 q 308 775 158 775 q 433 744 375 775 q 528 656 491 713 l 528 749 l 722 749 l 722 0 m 361 601 q 233 527 277 601 q 196 375 196 464 q 232 224 196 288 q 358 144 277 144 q 487 217 441 144 q 528 370 528 281 q 489 523 528 457 q 361 601 443 601 m 579 1039 l 377 823 l 279 823 l 401 1039 l 579 1039 "},"O":{"x_min":0,"x_max":994,"ha":1094,"o":"m 497 -29 q 133 127 272 -29 q 0 505 0 277 q 131 883 0 733 q 497 1040 270 1040 q 860 883 721 1040 q 994 505 994 733 q 862 127 994 277 q 497 -29 723 -29 m 497 154 q 710 266 631 154 q 780 506 780 365 q 710 745 780 647 q 497 857 631 857 q 283 747 361 857 q 213 506 213 647 q 282 266 213 365 q 497 154 361 154 "},"n":{"x_min":0,"x_max":669,"ha":782,"o":"m 669 0 l 469 0 l 469 452 q 442 553 469 513 q 352 601 412 601 q 245 553 290 601 q 200 441 200 505 l 200 0 l 0 0 l 0 748 l 194 748 l 194 659 q 289 744 230 713 q 416 775 349 775 q 600 700 531 775 q 669 509 669 626 l 669 0 "},"3":{"x_min":61,"x_max":767,"ha":828,"o":"m 767 290 q 653 51 767 143 q 402 -32 548 -32 q 168 48 262 -32 q 61 300 61 140 l 250 300 q 298 173 250 219 q 405 132 343 132 q 514 169 471 132 q 563 282 563 211 q 491 405 563 369 q 343 432 439 432 l 343 568 q 472 592 425 568 q 534 701 534 626 q 493 793 534 758 q 398 829 453 829 q 306 789 344 829 q 268 669 268 749 l 80 669 q 182 909 80 823 q 410 986 274 986 q 633 916 540 986 q 735 719 735 840 q 703 608 735 656 q 615 522 672 561 q 727 427 687 486 q 767 290 767 369 "},"9":{"x_min":58,"x_max":769,"ha":828,"o":"m 769 492 q 646 90 769 232 q 384 -33 539 -33 q 187 35 271 -33 q 83 224 98 107 l 282 224 q 323 154 286 182 q 404 127 359 127 q 513 182 471 127 q 563 384 563 248 q 475 335 532 355 q 372 315 418 315 q 137 416 224 315 q 58 642 58 507 q 144 877 58 781 q 407 984 239 984 q 694 827 602 984 q 769 492 769 699 m 416 476 q 525 521 488 476 q 563 632 563 566 q 521 764 563 709 q 403 826 474 826 q 297 773 337 826 q 258 649 258 720 q 295 530 258 577 q 416 476 339 476 "},"l":{"x_min":41,"x_max":240,"ha":363,"o":"m 240 0 l 41 0 l 41 1013 l 240 1013 l 240 0 "},"¤":{"x_min":40.265625,"x_max":727.203125,"ha":825,"o":"m 727 792 l 594 659 q 620 552 620 609 q 598 459 620 504 l 725 331 l 620 224 l 491 352 q 382 331 443 331 q 273 352 322 331 l 144 224 l 40 330 l 167 459 q 147 552 147 501 q 172 658 147 608 l 40 794 l 147 898 l 283 759 q 383 776 330 776 q 482 759 434 776 l 620 898 l 727 792 m 383 644 q 308 617 334 644 q 283 551 283 590 q 309 489 283 517 q 381 462 335 462 q 456 488 430 462 q 482 554 482 515 q 455 616 482 588 q 383 644 429 644 "},"κ":{"x_min":0,"x_max":691.84375,"ha":779,"o":"m 691 0 l 479 0 l 284 343 l 196 252 l 196 0 l 0 0 l 0 749 l 196 749 l 196 490 l 440 749 l 677 749 l 416 479 l 691 0 "},"4":{"x_min":53,"x_max":775.21875,"ha":828,"o":"m 775 213 l 660 213 l 660 0 l 470 0 l 470 213 l 53 213 l 53 384 l 416 958 l 660 958 l 660 370 l 775 370 l 775 213 m 474 364 l 474 786 l 204 363 l 474 364 "},"p":{"x_min":0,"x_max":722,"ha":824,"o":"m 415 -26 q 287 4 346 -26 q 192 92 228 34 l 192 -298 l 0 -298 l 0 750 l 192 750 l 192 647 q 289 740 230 706 q 416 775 347 775 q 649 645 566 775 q 722 375 722 534 q 649 106 722 218 q 415 -26 564 -26 m 363 603 q 232 529 278 603 q 192 375 192 465 q 230 222 192 286 q 360 146 276 146 q 487 221 441 146 q 526 371 526 285 q 488 523 526 458 q 363 603 443 603 "},"‡":{"x_min":0,"x_max":809,"ha":894,"o":"m 299 621 l 0 621 l 0 804 l 299 804 l 299 1011 l 509 1011 l 509 804 l 809 804 l 809 621 l 509 621 l 509 387 l 809 387 l 809 205 l 509 205 l 509 0 l 299 0 l 299 205 l 0 205 l 0 387 l 299 387 l 299 621 "},"ψ":{"x_min":0,"x_max":875,"ha":979,"o":"m 522 142 q 657 274 620 163 q 671 352 671 316 l 671 748 l 875 748 l 875 402 q 806 134 875 240 q 525 -22 719 -1 l 525 -278 l 349 -278 l 349 -22 q 65 135 152 -1 q 0 402 0 238 l 0 748 l 204 748 l 204 352 q 231 240 204 295 q 353 142 272 159 l 353 922 l 524 922 l 522 142 "},"η":{"x_min":0,"x_max":669,"ha":779,"o":"m 669 -278 l 469 -278 l 469 390 q 448 526 469 473 q 348 606 417 606 q 244 553 288 606 q 201 441 201 501 l 201 0 l 0 0 l 0 749 l 201 749 l 201 665 q 301 744 244 715 q 423 774 359 774 q 606 685 538 774 q 669 484 669 603 l 669 -278 "}},"cssFontWeight":"bold","ascender":1216,"underlinePosition":-100,"cssFontStyle":"normal","boundingBox":{"yMin":-333,"xMin":-162,"yMax":1216,"xMax":1681},"resolution":1000,"original_font_information":{"postscript_name":"Helvetiker-Bold","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr","full_font_name":"Helvetiker Bold","font_family_name":"Helvetiker","copyright":"Copyright (c) Magenta ltd, 2004.","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta ltd:Helvetiker Bold:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta ltd","font_sub_family_name":"Bold"},"descender":-334,"familyName":"Helvetiker","lineHeight":1549,"underlineThickness":50});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":68.0625,"x_max":854.171875,"ha":863,"o":"m 375 -25 q 149 57 230 -25 q 68 275 68 140 q 79 372 68 319 q 245 660 116 545 q 545 775 373 775 q 772 691 690 775 q 854 472 854 608 q 843 372 854 427 q 675 87 805 200 q 375 -25 545 -25 m 409 142 q 561 216 497 142 q 636 373 616 282 q 644 444 644 409 q 613 557 644 514 q 508 607 577 607 q 358 530 423 607 q 283 373 304 466 q 276 305 276 336 q 305 191 276 233 q 409 142 340 142 "},"S":{"x_min":65,"x_max":948,"ha":915,"o":"m 891 306 q 713 55 857 148 q 417 -29 582 -29 q 167 47 264 -29 q 65 268 65 128 q 65 290 65 279 q 65 318 65 302 l 276 318 q 275 297 275 311 q 335 188 275 228 q 468 152 391 152 q 597 181 539 152 q 682 282 668 217 q 685 308 685 301 q 550 412 685 378 q 300 478 309 475 q 165 652 165 533 q 171 719 165 687 q 341 958 203 867 q 621 1040 466 1040 q 856 966 764 1040 q 948 764 948 893 q 943 713 948 741 l 744 713 q 745 731 745 720 q 697 831 745 796 q 577 866 649 866 q 456 838 510 866 q 375 742 389 803 q 373 718 373 725 q 509 616 373 650 q 761 552 757 553 q 898 374 898 496 q 896 342 898 359 q 891 306 895 324 "},"¦":{"x_min":-51.375,"x_max":354.28125,"ha":240,"o":"m 242 462 l 99 462 l 211 984 l 354 983 l 242 462 m 91 -242 l -51 -242 l 60 280 l 203 280 l 91 -242 "},"/":{"x_min":167.953125,"x_max":854.375,"ha":828,"o":"m 854 1040 l 261 -128 l 167 -128 l 759 1039 l 854 1040 "},"Τ":{"x_min":177.78125,"x_max":1025,"ha":878,"o":"m 986 831 l 686 831 l 508 0 l 298 0 l 476 831 l 177 831 l 216 1013 l 1025 1013 l 986 831 "},"y":{"x_min":61.5,"x_max":897.609375,"ha":828,"o":"m 897 749 l 421 -107 q 308 -237 369 -197 q 153 -277 247 -277 q 103 -274 130 -277 q 61 -271 76 -272 l 96 -110 q 122 -113 110 -111 q 153 -116 135 -116 q 264 -17 244 -116 q 242 173 267 -3 q 194 515 218 351 q 158 749 176 632 l 376 749 l 419 207 l 687 749 l 897 749 "},"Π":{"x_min":0,"x_max":1026.390625,"ha":922,"o":"m 809 0 l 598 0 l 777 836 l 387 836 l 208 0 l 0 0 l 216 1012 l 1026 1012 l 809 0 "},"ΐ":{"x_min":0,"x_max":566.671875,"ha":364,"o":"m 537 810 l 408 810 l 437 952 l 566 952 l 537 810 m 529 1064 l 259 810 l 161 810 l 351 1064 l 529 1064 m 140 810 l 11 810 l 40 952 l 169 952 l 140 810 m 200 0 l 0 0 l 159 748 l 359 748 l 200 0 "},"g":{"x_min":6.9375,"x_max":883.328125,"ha":839,"o":"m 733 48 q 589 -223 693 -142 q 291 -304 486 -304 q 95 -259 170 -304 q 6 -102 6 -206 q 8 -72 6 -83 l 227 -72 q 261 -127 231 -110 q 337 -144 291 -144 q 486 -83 438 -144 q 544 70 520 -38 l 551 104 q 446 25 506 51 q 319 0 385 0 q 128 79 194 0 q 69 272 69 151 q 71 329 69 312 q 80 377 73 347 q 216 647 113 533 q 481 775 331 775 q 673 656 622 775 l 692 748 l 883 748 l 733 48 m 403 167 q 542 237 483 167 q 611 382 593 297 q 617 425 616 412 q 618 447 618 439 q 590 555 618 515 q 492 603 558 603 q 352 532 412 603 q 282 386 301 472 q 277 354 278 364 q 276 322 276 344 q 303 214 276 254 q 403 167 337 167 "},"²":{"x_min":82,"x_max":636,"ha":560,"o":"m 631 791 q 499 627 613 706 q 254 483 376 555 l 558 483 l 537 382 l 82 382 q 208 565 105 488 q 388 672 227 579 q 498 784 486 727 q 500 804 500 791 q 476 855 500 836 q 418 875 452 875 q 347 850 377 875 q 294 762 309 819 l 172 762 q 283 924 202 867 q 444 976 356 976 q 580 935 524 976 q 636 824 636 894 q 631 791 636 807 "},"–":{"x_min":63.890625,"x_max":800,"ha":801,"o":"m 768 297 l 63 297 l 95 450 l 800 450 l 768 297 "},"Κ":{"x_min":0,"x_max":1080.5625,"ha":969,"o":"m 900 0 l 647 0 l 415 462 l 284 355 l 208 0 l 0 0 l 216 1013 l 425 1013 l 336 596 l 820 1013 l 1080 1013 l 590 603 l 900 0 "},"ƒ":{"x_min":-104.5625,"x_max":657.953125,"ha":525,"o":"m 571 609 l 448 609 l 91 -277 l -104 -277 l 252 609 l 145 609 l 174 749 l 281 749 q 363 949 312 894 q 563 1019 426 1019 l 657 1015 l 624 855 l 562 855 q 495 826 512 855 q 476 749 491 817 l 601 749 l 571 609 "},"e":{"x_min":66,"x_max":804,"ha":808,"o":"m 776 321 l 274 321 q 270 295 271 309 q 269 269 269 280 q 303 174 269 207 q 389 141 337 141 q 546 227 481 141 l 747 227 q 572 36 685 104 q 354 -26 470 -26 q 152 46 231 -26 q 66 264 66 125 q 78 369 66 312 q 241 683 121 573 q 527 793 360 793 q 733 724 662 793 q 804 516 804 656 q 776 321 804 434 m 598 453 q 602 476 601 462 q 604 500 604 490 q 571 583 604 555 q 484 612 538 612 q 369 570 418 612 q 304 453 320 529 l 598 453 "},"ό":{"x_min":68.0625,"x_max":854.171875,"ha":863,"o":"m 375 -25 q 149 57 230 -25 q 68 275 68 140 q 79 372 68 319 q 245 660 116 545 q 545 775 373 775 q 772 691 690 775 q 854 472 854 608 q 843 372 854 427 q 675 87 805 200 q 375 -25 545 -25 m 409 142 q 561 216 497 142 q 636 373 616 282 q 644 444 644 409 q 613 557 644 514 q 508 607 577 607 q 358 530 423 607 q 283 373 304 466 q 276 305 276 336 q 305 191 276 233 q 409 142 340 142 m 815 1039 l 568 823 l 469 823 l 637 1039 l 815 1039 "},"J":{"x_min":58,"x_max":865.28125,"ha":760,"o":"m 711 294 q 583 48 674 125 q 322 -29 491 -29 q 114 32 178 -29 q 58 198 58 87 q 80 375 58 270 l 280 375 l 264 309 q 255 235 255 264 q 275 167 255 190 q 350 145 296 145 q 459 193 421 145 q 505 307 488 231 l 656 1013 l 865 1013 l 711 294 "},"»":{"x_min":18.078125,"x_max":625,"ha":624,"o":"m 587 286 l 315 87 l 349 250 l 517 373 l 403 496 l 438 660 l 625 461 l 587 286 m 290 286 l 18 87 l 52 250 l 220 373 l 106 496 l 141 660 l 327 461 l 290 286 "},"©":{"x_min":97,"x_max":1126,"ha":1104,"o":"m 505 -6 q 195 112 303 -6 q 97 388 97 219 q 262 811 97 625 q 719 1017 444 1017 q 1028 898 920 1017 q 1126 622 1126 793 q 960 199 1126 385 q 505 -6 778 -6 m 702 934 q 316 761 470 934 q 176 405 176 604 q 256 174 176 262 q 517 76 346 76 q 902 249 748 76 q 1044 607 1044 409 q 963 836 1044 750 q 702 934 873 934 m 845 409 q 732 255 815 313 q 548 197 648 197 q 380 263 438 197 q 328 422 328 324 q 420 681 328 563 q 667 811 523 811 q 821 764 759 811 q 884 633 884 717 q 884 615 884 621 l 753 615 q 733 689 758 659 q 664 719 707 719 q 521 624 579 719 q 470 438 470 541 q 493 337 470 377 q 562 298 517 298 q 653 327 615 298 q 712 409 691 356 l 845 409 "},"ώ":{"x_min":63,"x_max":1031,"ha":1050,"o":"m 679 528 l 485 528 l 442 323 q 400 185 418 211 q 323 142 371 142 q 280 171 293 142 q 267 248 267 200 q 270 305 267 275 q 280 365 273 334 q 362 565 301 461 q 494 748 411 648 l 290 748 q 154 552 207 650 q 73 337 96 444 q 65 292 68 315 q 63 245 63 269 q 111 57 63 132 q 271 -29 167 -29 q 392 0 332 -29 q 487 78 451 28 q 552 0 503 29 q 662 -29 601 -29 q 894 96 787 -29 q 1017 337 989 205 q 1031 475 1031 405 q 1016 613 1031 545 q 974 748 1001 680 l 769 748 q 813 613 796 684 q 831 472 831 541 q 829 417 831 434 q 819 365 828 400 q 759 189 792 236 q 682 142 726 142 q 631 161 646 142 q 617 215 617 180 q 624 276 617 243 q 635 323 632 308 l 679 528 m 940 1039 l 693 823 l 594 823 l 762 1039 l 940 1039 "},"^":{"x_min":376.390625,"x_max":809.71875,"ha":828,"o":"m 809 836 l 715 836 l 625 987 l 473 836 l 376 836 l 565 1090 l 726 1090 l 809 836 "},"«":{"x_min":61.109375,"x_max":667.84375,"ha":624,"o":"m 544 87 l 358 286 l 395 461 l 667 660 l 631 496 l 464 374 l 579 250 l 544 87 m 247 87 l 61 286 l 98 461 l 370 660 l 334 496 l 167 374 l 282 250 l 247 87 "},"D":{"x_min":0,"x_max":990,"ha":968,"o":"m 616 1013 q 891 911 792 1013 q 990 646 990 810 q 976 523 990 593 q 749 146 927 293 q 340 0 572 0 l 0 0 l 216 1013 l 616 1013 m 577 837 l 384 837 l 244 182 l 411 182 q 644 276 547 182 q 765 504 734 364 q 772 549 769 526 q 775 595 775 571 q 729 763 775 697 q 577 837 677 837 "},"∙":{"x_min":111.5,"x_max":362.890625,"ha":304,"o":"m 318 528 l 111 528 l 155 735 l 362 735 l 318 528 "},"ÿ":{"x_min":3,"x_max":48.828125,"ha":125,"o":"m 47 0 q 36 -7 46 -7 q 28 0 28 -7 q 37 -4 30 -4 q 45 2 45 -1 l 37 0 q 30 9 29 0 q 45 19 32 19 l 48 15 l 48 19 l 47 0 m 37 1 q 47 8 45 1 q 45 16 50 16 q 32 8 34 16 q 37 1 29 1 m 27 0 l 28 25 l 14 0 l 7 22 l 3 0 l 5 25 l 15 1 l 28 25 l 27 0 "},"w":{"x_min":159,"x_max":1215.953125,"ha":1150,"o":"m 1215 749 l 847 0 l 646 0 l 641 536 l 411 0 l 210 0 l 159 749 l 361 749 l 373 227 l 588 748 l 792 749 l 788 227 l 1022 749 l 1215 749 "},"$":{"x_min":55,"x_max":834,"ha":800,"o":"m 829 693 l 642 693 q 645 725 645 715 q 627 796 645 768 q 569 830 610 825 l 515 577 q 711 486 649 540 q 773 348 773 433 q 767 293 773 316 q 759 258 761 270 q 623 56 724 134 q 386 -22 521 -22 l 357 -156 l 274 -156 l 303 -22 q 115 46 175 -10 q 55 211 55 102 q 63 300 55 251 l 246 300 q 244 275 245 286 q 244 258 244 265 q 264 173 244 207 q 335 128 285 140 l 396 413 q 154 627 154 444 q 162 700 154 659 q 278 900 190 825 q 517 981 374 981 l 537 1069 l 620 1069 l 600 981 q 774 920 714 981 q 834 748 834 859 q 829 693 834 722 m 436 598 l 486 831 q 397 797 431 831 q 352 712 362 764 q 350 686 350 693 q 436 598 350 628 m 419 127 q 513 172 480 140 q 559 258 546 205 q 562 289 562 269 q 474 387 562 360 l 419 127 "},"\\":{"x_min":221.59375,"x_max":406.296875,"ha":532,"o":"m 406 -128 l 314 -128 l 221 1040 l 313 1040 l 406 -128 "},"µ":{"x_min":-58.71875,"x_max":807.953125,"ha":754,"o":"m 648 0 l 478 0 l 492 68 q 414 9 455 30 q 328 -11 373 -11 q 262 3 294 -11 q 209 43 231 18 l 139 -277 l -58 -277 l 160 749 l 359 749 l 276 358 q 265 303 269 326 q 262 253 262 280 q 283 179 262 208 q 355 151 305 151 q 488 240 444 151 q 535 401 509 283 l 609 749 l 807 749 l 648 0 "},"Ι":{"x_min":41.671875,"x_max":466.671875,"ha":413,"o":"m 250 0 l 41 0 l 258 1013 l 466 1013 l 250 0 "},"Ύ":{"x_min":166.671875,"x_max":1427.78125,"ha":1289,"o":"m 1427 1012 l 987 376 l 906 0 l 697 0 l 777 376 l 591 1012 l 800 1012 l 926 576 l 1218 1012 l 1427 1012 m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 "},"’":{"x_min":133.328125,"x_max":408.328125,"ha":289,"o":"m 369 834 q 284 692 351 751 q 133 626 218 634 l 148 697 q 279 831 255 723 l 177 831 l 216 1013 l 408 1013 l 369 834 "},"Ν":{"x_min":0,"x_max":1050,"ha":946,"o":"m 833 0 l 618 0 l 354 696 l 205 0 l 0 0 l 216 1013 l 433 1013 l 697 315 l 845 1013 l 1050 1013 l 833 0 "},"-":{"x_min":86.5,"x_max":512.890625,"ha":525,"o":"m 472 279 l 86 279 l 126 468 l 512 468 l 472 279 "},"Q":{"x_min":93,"x_max":1118,"ha":1096,"o":"m 1004 47 l 866 -70 l 767 42 q 635 -12 706 4 q 490 -29 563 -29 q 194 83 301 -29 q 93 368 93 190 q 108 504 93 430 q 320 881 156 731 q 719 1040 494 1040 q 1015 926 908 1040 q 1118 638 1118 816 q 1113 575 1118 610 q 1102 506 1109 540 q 918 152 1061 311 l 1004 47 m 794 298 q 852 395 829 343 q 887 502 875 448 q 899 606 899 556 q 851 780 899 715 q 689 857 796 857 q 443 745 548 857 q 316 501 347 645 q 307 405 307 457 q 358 230 307 295 q 524 157 415 157 q 654 181 588 157 l 570 287 l 706 405 l 794 298 "},"ς":{"x_min":68,"x_max":832,"ha":768,"o":"m 827 448 l 643 448 q 606 571 643 533 q 500 610 569 610 q 359 537 422 610 q 289 394 305 475 q 281 319 281 352 q 471 155 281 191 q 661 29 661 119 q 656 -15 661 9 q 609 -150 641 -83 q 536 -278 586 -200 l 363 -278 q 419 -186 405 -212 q 455 -88 445 -136 q 456 -70 456 -82 q 356 -1 456 -25 q 169 59 212 33 q 68 261 68 122 q 81 382 68 316 q 240 660 118 547 q 533 777 368 777 q 747 701 663 777 q 832 504 832 625 q 827 448 832 478 "},"M":{"x_min":0,"x_max":1236.109375,"ha":1135,"o":"m 1019 0 l 823 0 l 998 818 l 618 0 l 403 0 l 369 819 l 194 0 l 0 0 l 216 1013 l 526 1013 l 561 240 l 924 1013 l 1236 1013 l 1019 0 "},"Ψ":{"x_min":118,"x_max":1210.78125,"ha":1085,"o":"m 1142 698 q 996 340 1087 436 q 633 200 891 227 l 589 0 l 403 0 l 446 200 q 191 282 265 220 q 118 471 118 344 q 148 698 118 557 l 216 1013 l 403 1013 l 335 694 q 316 600 317 608 q 308 518 308 554 q 346 417 308 451 q 485 383 385 383 l 620 1013 l 806 1013 l 671 383 q 883 472 821 383 q 955 694 919 525 l 1023 1013 l 1210 1013 l 1142 698 "},"C":{"x_min":94,"x_max":1109.71875,"ha":1043,"o":"m 1044 345 q 817 70 969 169 q 484 -29 666 -29 q 194 87 299 -29 q 94 375 94 197 q 107 506 94 441 q 323 885 157 737 q 724 1040 495 1040 q 999 939 888 1040 q 1109 679 1109 838 l 890 679 q 822 808 879 759 q 679 857 765 857 q 442 747 544 857 q 322 508 352 648 q 311 408 311 455 q 361 230 311 297 q 526 154 417 154 q 695 204 619 154 q 826 345 772 255 l 1044 345 "},"!":{"x_min":2.78125,"x_max":426.390625,"ha":307,"o":"m 368 739 q 298 515 354 676 q 216 282 256 398 l 113 282 q 138 584 129 473 q 158 739 148 696 l 216 1013 l 426 1013 l 368 739 m 206 0 l 2 0 l 45 203 l 250 203 l 206 0 "},"{":{"x_min":62,"x_max":717.5625,"ha":599,"o":"m 439 -285 q 211 -236 279 -285 q 156 -116 156 -195 q 188 37 156 -66 q 220 184 220 142 q 188 263 220 236 q 62 294 150 294 l 92 438 q 312 586 277 438 q 367 865 339 725 q 717 1015 441 1015 l 686 872 q 504 766 539 872 q 468 547 486 657 q 283 366 431 411 q 370 317 345 352 q 395 232 395 282 q 367 91 395 187 q 339 -43 339 -4 q 368 -115 339 -89 q 470 -141 397 -141 l 439 -285 "},"X":{"x_min":0,"x_max":1111.109375,"ha":999,"o":"m 894 0 l 654 0 l 520 351 l 238 0 l 0 0 l 426 516 l 216 1013 l 455 1013 l 587 659 l 869 1013 l 1111 1013 l 688 519 l 894 0 "},"#":{"x_min":58.71875,"x_max":1172.328125,"ha":1117,"o":"m 1172 722 l 1093 582 l 900 582 l 805 417 l 1007 417 l 926 279 l 726 278 l 564 -6 l 411 -5 l 575 279 l 407 278 l 244 -5 l 92 -6 l 254 278 l 58 279 l 137 417 l 333 417 l 427 582 l 222 582 l 303 722 l 507 721 l 669 1006 l 821 1005 l 661 721 l 827 721 l 991 1005 l 1142 1006 l 979 721 l 1172 722 m 751 582 l 578 582 l 482 416 l 655 417 l 751 582 "},"ι":{"x_min":41.671875,"x_max":401.390625,"ha":389,"o":"m 241 0 l 41 0 l 201 749 l 401 749 l 241 0 "},"Ά":{"x_min":29.171875,"x_max":995.828125,"ha":1072,"o":"m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 m 995 0 l 776 0 l 752 208 l 359 208 l 247 0 l 29 0 l 606 1012 l 845 1012 l 995 0 m 733 376 l 683 809 l 450 376 l 733 376 "},")":{"x_min":-61.5,"x_max":486,"ha":486,"o":"m 466 357 q 323 14 430 187 q 84 -293 233 -134 l -61 -293 q 145 23 60 -142 q 266 358 230 189 q 286 478 280 421 q 292 598 292 536 q 273 808 292 705 q 217 1013 254 910 l 363 1013 q 453 780 420 901 q 486 539 486 660 q 481 448 486 490 q 466 357 477 405 "},"ε":{"x_min":54.171875,"x_max":741.671875,"ha":742,"o":"m 708 259 q 573 47 679 123 q 334 -25 473 -25 q 127 27 200 -25 q 54 159 54 80 q 95 280 54 220 q 218 389 136 339 q 161 447 183 413 q 140 521 140 481 q 143 552 140 542 q 273 717 163 653 q 487 776 373 776 q 672 726 604 776 q 741 576 741 676 q 733 508 741 544 l 554 508 q 558 539 558 524 q 532 592 558 576 q 458 608 506 608 q 381 590 423 608 q 331 544 338 573 q 329 517 329 524 q 357 467 329 480 q 433 455 386 455 q 465 455 450 455 q 497 456 481 455 l 465 308 l 394 308 q 309 291 345 308 q 251 223 261 269 q 250 205 250 216 q 294 152 250 166 q 376 143 325 143 q 463 174 427 143 q 509 259 498 206 l 708 259 "},"Δ":{"x_min":0,"x_max":981.953125,"ha":1057,"o":"m 981 0 l 0 0 l 602 1013 l 811 1013 l 981 0 m 752 175 l 654 765 l 304 175 l 752 175 "},"}":{"x_min":-61,"x_max":593.171875,"ha":597,"o":"m 562 294 q 348 145 382 294 q 293 -134 320 4 q -61 -285 218 -285 l -30 -141 q 146 -30 109 -141 q 187 190 166 79 q 372 366 228 325 q 285 422 310 385 q 260 511 260 458 q 288 652 260 558 q 317 780 317 747 q 290 847 317 826 q 186 872 259 872 l 216 1015 q 446 967 377 1015 q 503 849 503 927 q 467 689 503 797 q 432 543 432 582 q 466 465 432 492 q 593 438 501 438 l 562 294 "},"‰":{"x_min":150,"x_max":1738,"ha":1775,"o":"m 965 484 q 1119 425 1065 484 q 1168 288 1168 373 q 1083 76 1168 172 q 853 -29 990 -29 q 699 29 753 -29 q 651 167 651 81 q 734 380 651 285 q 965 484 826 484 m 886 120 q 981 160 944 120 q 1018 251 1018 201 q 998 308 1018 287 q 931 333 974 333 q 836 292 873 333 q 800 201 800 251 q 821 142 800 165 q 886 120 843 120 m 1115 984 l 311 -28 l 200 -29 l 1004 983 l 1115 984 m 461 984 q 614 925 560 984 q 663 789 663 873 q 579 577 663 671 q 350 472 486 472 q 200 527 251 472 q 150 667 150 583 q 232 879 150 786 q 461 984 323 984 m 429 835 q 330 794 368 835 q 293 702 293 753 q 315 644 293 667 q 380 621 337 621 q 479 661 441 621 q 517 753 517 702 q 494 811 517 788 q 429 835 472 835 m 1534 484 q 1689 425 1634 484 q 1738 288 1738 373 q 1653 76 1738 172 q 1423 -29 1559 -29 q 1268 29 1323 -29 q 1220 167 1220 81 q 1303 380 1220 285 q 1534 484 1395 484 m 1455 120 q 1551 160 1514 120 q 1588 251 1588 201 q 1568 308 1588 287 q 1501 333 1544 333 q 1405 292 1442 333 q 1369 201 1369 251 q 1390 142 1369 165 q 1455 120 1412 120 "},"a":{"x_min":37,"x_max":779,"ha":786,"o":"m 699 0 l 489 0 q 483 56 483 30 q 483 74 483 65 q 483 93 483 87 q 364 5 433 37 q 227 -26 296 -26 q 88 21 139 -26 q 37 148 37 68 q 43 205 37 173 q 206 409 75 355 q 438 452 259 431 q 573 522 562 468 q 575 538 575 527 q 540 591 575 572 q 466 611 506 611 q 373 581 415 611 q 321 502 331 552 l 132 502 q 259 704 160 634 q 494 775 359 775 q 678 730 594 775 q 779 590 779 677 q 774 554 779 573 l 685 137 q 681 113 682 120 q 680 90 680 105 q 706 33 680 48 l 699 0 m 528 297 l 542 366 q 369 322 431 340 q 238 216 254 287 q 236 196 236 202 q 261 144 236 163 q 324 126 287 126 q 455 174 398 126 q 528 297 513 223 "},"—":{"x_min":63.890625,"x_max":1037.5,"ha":1039,"o":"m 1005 297 l 63 297 l 95 450 l 1037 450 l 1005 297 "},"=":{"x_min":72.21875,"x_max":934.71875,"ha":828,"o":"m 905 502 l 136 502 l 165 635 l 934 635 l 905 502 m 841 204 l 72 204 l 101 339 l 870 339 l 841 204 "},"N":{"x_min":0,"x_max":1050,"ha":949,"o":"m 833 0 l 618 0 l 354 695 l 205 0 l 0 0 l 216 1013 l 433 1013 l 697 315 l 845 1013 l 1050 1013 l 833 0 "},"ρ":{"x_min":-59.609375,"x_max":814,"ha":810,"o":"m 361 -17 q 272 0 311 -17 q 204 48 233 17 l 134 -278 l -59 -278 l 79 370 q 229 656 118 548 q 523 775 350 775 q 739 692 664 775 q 814 476 814 609 q 801 372 814 426 q 641 95 766 208 q 361 -17 516 -17 m 490 607 q 350 529 409 607 q 282 377 300 465 q 273 301 273 341 q 297 195 273 234 q 387 147 326 147 q 512 210 450 147 q 596 374 573 274 q 601 408 600 390 q 603 445 603 426 q 573 561 603 516 q 490 607 544 607 "},"2":{"x_min":63.890625,"x_max":917,"ha":828,"o":"m 910 685 q 772 452 879 540 q 554 325 726 415 q 343 168 411 250 l 790 168 l 754 0 l 63 0 q 252 301 97 175 q 534 480 263 311 q 708 673 687 576 q 711 707 711 685 q 676 791 711 758 q 592 824 642 824 q 484 780 533 824 q 397 633 427 730 l 215 633 q 384 903 259 807 q 633 988 495 988 q 835 923 753 988 q 917 746 917 858 q 916 725 917 735 q 910 685 915 715 "},"¯":{"x_min":204.171875,"x_max":1012.5,"ha":771,"o":"m 979 958 l 204 958 l 237 1111 l 1012 1111 l 979 958 "},"Z":{"x_min":0,"x_max":1020.828125,"ha":906,"o":"m 983 836 l 290 182 l 831 182 l 793 0 l 0 0 l 37 176 l 729 830 l 188 830 l 227 1013 l 1020 1013 l 983 836 "},"u":{"x_min":43.0625,"x_max":827.78125,"ha":782,"o":"m 668 0 l 473 0 l 493 88 q 365 10 434 39 q 229 -19 297 -19 q 90 31 137 -19 q 43 167 43 81 q 51 239 43 201 l 159 749 l 358 749 l 262 296 q 256 246 256 273 q 278 173 256 200 q 347 146 300 146 q 465 192 411 146 q 534 304 520 239 l 629 749 l 827 749 l 668 0 "},"k":{"x_min":0,"x_max":834.46875,"ha":771,"o":"m 688 0 l 450 0 l 338 316 l 247 237 l 195 0 l 0 0 l 216 1013 l 412 1013 l 298 483 l 592 748 l 834 748 l 513 469 l 688 0 "},"Η":{"x_min":0,"x_max":1054.171875,"ha":950,"o":"m 837 0 l 627 0 l 723 450 l 305 450 l 209 0 l 0 0 l 216 1013 l 426 1013 l 345 635 l 763 635 l 844 1013 l 1054 1013 l 837 0 "},"Α":{"x_min":0,"x_max":966.671875,"ha":1043,"o":"m 966 0 l 747 0 l 723 208 l 330 208 l 218 0 l 0 0 l 577 1013 l 816 1013 l 966 0 m 704 376 l 654 809 l 420 376 l 704 376 "},"s":{"x_min":48,"x_max":770.21875,"ha":775,"o":"m 728 229 q 574 33 702 105 q 334 -29 464 -29 q 134 26 211 -29 q 48 196 48 87 q 52 245 48 219 l 254 245 q 252 226 252 238 q 290 153 252 178 q 385 128 329 128 q 467 144 428 128 q 526 205 517 165 q 435 282 537 254 q 241 336 246 333 q 133 482 133 384 q 133 502 133 493 q 138 533 133 511 q 281 716 162 647 q 506 778 385 778 q 696 718 623 778 q 770 551 770 659 q 768 522 770 531 l 574 522 q 546 596 580 570 q 460 622 512 622 q 385 606 423 622 q 340 556 346 590 q 430 477 328 509 q 624 416 619 419 q 733 274 733 366 q 728 229 733 245 "},"B":{"x_min":0,"x_max":965,"ha":938,"o":"m 792 547 q 876 473 846 523 q 906 359 906 423 q 900 304 906 330 q 733 75 869 158 q 461 0 612 0 l 0 0 l 216 1013 l 694 1013 q 883 964 809 1013 q 965 811 965 910 q 958 754 965 789 q 900 630 944 687 q 792 547 857 573 m 571 621 q 675 646 628 621 q 745 730 734 676 q 748 753 748 747 q 707 816 748 794 q 614 838 666 838 l 377 838 l 331 621 l 571 621 m 485 182 q 607 211 554 182 q 685 311 671 245 q 688 337 688 330 q 644 418 688 390 q 540 446 600 446 l 294 446 l 237 182 l 485 182 "},"…":{"x_min":0,"x_max":862.5,"ha":963,"o":"m 205 0 l 0 0 l 44 207 l 250 207 l 205 0 m 511 0 l 305 0 l 350 207 l 555 207 l 511 0 m 818 0 l 612 0 l 656 207 l 862 207 l 818 0 "},"?":{"x_min":151.390625,"x_max":851,"ha":785,"o":"m 844 734 q 739 563 823 634 q 591 454 665 508 q 498 293 512 387 l 313 293 l 334 391 q 433 521 348 455 q 631 724 618 667 q 634 759 634 736 q 602 837 634 809 q 524 866 571 866 q 421 827 468 866 q 345 699 367 782 l 151 699 q 301 955 172 860 q 562 1040 416 1040 q 763 980 684 1040 q 851 799 851 913 q 849 768 851 785 q 844 734 848 751 m 445 0 l 243 0 l 286 203 l 488 203 l 445 0 "},"H":{"x_min":0,"x_max":1054.171875,"ha":953,"o":"m 837 0 l 627 0 l 723 450 l 305 450 l 209 0 l 0 0 l 216 1013 l 426 1013 l 345 635 l 763 635 l 844 1013 l 1054 1013 l 837 0 "},"ν":{"x_min":159.71875,"x_max":900,"ha":828,"o":"m 900 749 l 473 0 l 266 0 l 159 749 l 381 749 l 418 211 l 688 749 l 900 749 "},"c":{"x_min":68,"x_max":855.5625,"ha":828,"o":"m 811 282 q 638 58 755 142 q 379 -26 520 -26 q 152 56 236 -26 q 68 274 68 139 q 69 319 68 303 q 77 366 70 334 q 238 651 113 536 q 536 774 370 774 q 770 699 684 774 q 855 486 855 625 l 640 486 q 598 572 631 538 q 509 607 565 607 q 362 533 427 607 q 284 378 303 467 q 276 303 276 342 q 305 189 276 232 q 408 139 339 139 q 522 179 469 139 q 602 282 574 220 l 811 282 "},"¶":{"x_min":168,"x_max":791.609375,"ha":678,"o":"m 211 892 l 242 892 l 261 761 l 336 892 l 366 891 l 334 741 l 313 741 l 341 866 l 267 739 l 246 741 l 226 871 l 197 741 l 177 741 l 211 892 m 492 854 l 464 730 q 403 691 456 691 q 378 691 390 691 q 360 696 366 695 l 362 713 l 405 706 q 444 733 436 706 l 451 763 q 402 741 435 741 q 362 778 362 741 q 363 797 362 790 q 445 860 375 860 q 463 860 455 860 q 492 854 471 860 m 469 841 l 444 843 q 381 796 393 843 q 380 782 380 790 q 409 756 380 756 q 458 796 448 756 l 469 841 m 777 988 l 713 988 l 502 -1 l 439 -1 l 650 988 l 527 988 l 316 -1 l 253 -1 l 381 601 q 220 653 284 601 q 168 764 168 697 q 172 805 168 784 q 312 989 194 918 q 534 1053 420 1053 l 791 1053 l 777 988 "},"β":{"x_min":-59.71875,"x_max":818.0625,"ha":789,"o":"m 626 538 q 728 453 691 508 q 765 324 765 398 q 758 262 765 297 q 629 53 731 136 q 398 -29 526 -29 q 209 51 273 -29 l 138 -278 l -59 -278 l 134 627 q 272 911 173 812 q 561 1021 381 1021 q 738 969 666 1021 q 818 818 818 912 q 818 794 818 805 q 812 769 813 777 q 626 538 780 622 m 373 136 q 491 181 437 136 q 559 291 545 227 q 563 324 563 310 q 514 414 563 384 q 393 444 465 444 l 426 600 q 542 634 490 600 q 608 731 594 669 q 611 761 611 741 q 584 829 611 802 q 512 857 556 857 q 381 775 429 857 q 331 622 352 725 l 281 393 q 270 329 273 358 q 266 266 266 299 q 287 174 266 206 q 373 136 313 136 "},"Μ":{"x_min":0,"x_max":1236.109375,"ha":1132,"o":"m 1019 0 l 823 0 l 998 818 l 618 0 l 402 0 l 369 818 l 194 0 l 0 0 l 216 1013 l 526 1013 l 561 241 l 925 1013 l 1236 1013 l 1019 0 "},"Ό":{"x_min":166.390625,"x_max":1297,"ha":1271,"o":"m 670 -29 q 373 83 480 -29 q 272 369 272 190 q 287 505 272 431 q 499 883 335 733 q 898 1040 672 1040 q 1195 926 1088 1040 q 1297 640 1297 819 q 1292 574 1297 611 q 1281 505 1288 538 q 1067 127 1231 277 q 670 -29 895 -29 m 709 154 q 946 266 842 154 q 1068 506 1039 367 q 1077 554 1074 530 q 1080 604 1080 577 q 1028 781 1080 715 q 859 857 970 857 q 622 747 724 857 q 500 506 529 648 q 489 408 489 454 q 540 230 489 297 q 709 154 598 154 m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 "},"Ή":{"x_min":166.671875,"x_max":1465.28125,"ha":1361,"o":"m 1248 0 l 1038 0 l 1134 450 l 716 450 l 620 0 l 411 0 l 627 1012 l 837 1012 l 756 635 l 1175 635 l 1255 1012 l 1465 1012 l 1248 0 m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 "},"•":{"x_min":72.609375,"x_max":805.953125,"ha":775,"o":"m 799 508 q 642 252 767 358 q 362 147 517 147 q 153 227 233 147 q 72 434 72 308 q 74 471 72 452 q 79 508 75 490 q 237 761 111 655 q 517 868 364 868 q 725 786 644 868 q 805 580 805 704 q 804 545 805 563 q 799 508 803 526 "},"¥":{"x_min":129,"x_max":1052.609375,"ha":931,"o":"m 329 625 l 216 1013 l 424 1013 l 550 576 l 842 1013 l 1052 1013 l 783 625 l 910 625 l 878 472 l 678 472 l 620 389 l 860 389 l 827 236 l 581 236 l 531 0 l 322 0 l 372 236 l 129 236 l 162 389 l 398 389 l 374 472 l 180 472 l 212 625 l 329 625 "},"(":{"x_min":58,"x_max":605.5625,"ha":486,"o":"m 326 -293 l 180 -293 q 92 -66 123 -177 q 58 182 58 59 q 62 266 58 223 q 76 357 66 309 q 219 703 112 526 q 459 1013 312 854 l 605 1013 q 400 699 483 862 q 276 358 312 528 q 250 114 250 236 q 268 -92 250 7 q 326 -293 287 -191 "},"U":{"x_min":66,"x_max":1028.171875,"ha":926,"o":"m 889 362 q 713 79 851 187 q 399 -29 575 -29 q 157 51 249 -29 q 66 269 66 132 q 77 362 66 310 l 215 1013 l 425 1013 l 289 386 q 283 325 283 351 q 322 201 283 250 q 440 153 362 153 q 601 225 531 153 q 683 386 662 289 l 818 1013 l 1028 1013 l 889 362 "},"γ":{"x_min":159.71875,"x_max":888.890625,"ha":815,"o":"m 888 749 l 465 37 l 397 -278 l 197 -278 l 265 37 q 252 154 265 94 q 229 275 240 215 l 159 749 l 366 749 l 425 284 l 681 749 l 888 749 "},"α":{"x_min":65.28125,"x_max":881.953125,"ha":835,"o":"m 722 0 l 530 0 l 552 101 q 434 7 498 40 q 298 -25 370 -25 q 118 59 179 -25 q 65 256 65 133 q 77 372 65 315 q 209 643 112 529 q 473 775 323 775 q 593 743 540 775 q 668 656 645 712 l 687 749 l 881 749 l 722 0 m 490 601 q 347 527 408 601 q 276 375 295 464 q 268 303 268 339 q 294 194 268 235 q 388 144 326 144 q 534 217 472 144 q 606 370 587 280 q 613 416 612 402 q 613 439 613 431 q 587 551 613 510 q 490 601 555 601 "},"F":{"x_min":0,"x_max":923.609375,"ha":778,"o":"m 886 837 l 384 837 l 334 606 l 775 606 l 737 431 l 297 431 l 205 0 l 0 0 l 216 1013 l 923 1013 l 886 837 "},"­":{"x_min":63.890625,"x_max":800,"ha":801,"o":"m 768 297 l 63 297 l 95 450 l 800 450 l 768 297 "},":":{"x_min":0,"x_max":363.890625,"ha":304,"o":"m 319 528 l 112 528 l 156 735 l 363 735 l 319 528 m 206 0 l 0 0 l 44 207 l 251 207 l 206 0 "},"Χ":{"x_min":0,"x_max":1111.109375,"ha":978,"o":"m 894 0 l 654 0 l 520 351 l 238 0 l 0 0 l 426 516 l 216 1013 l 455 1013 l 587 660 l 869 1013 l 1111 1013 l 688 519 l 894 0 "},"*":{"x_min":273,"x_max":870.21875,"ha":828,"o":"m 870 740 l 665 688 l 763 524 l 624 438 l 542 612 l 385 439 l 285 523 l 455 688 l 273 741 l 346 880 l 517 816 l 559 1013 l 698 1012 l 656 816 l 850 880 l 870 740 "},"†":{"x_min":133.328125,"x_max":980.5625,"ha":894,"o":"m 680 804 l 980 804 l 941 622 l 641 622 l 508 0 l 298 0 l 431 622 l 133 622 l 172 804 l 470 804 l 515 1011 l 725 1011 l 680 804 "},"°":{"x_min":207,"x_max":579,"ha":460,"o":"m 352 808 q 243 847 280 808 q 207 949 207 887 q 266 1101 207 1034 q 431 1175 331 1175 q 544 1133 505 1175 q 579 1034 579 1095 q 517 883 579 951 q 352 808 451 808 m 374 908 q 447 940 419 908 q 476 1010 476 972 q 459 1056 476 1038 q 409 1075 442 1075 q 335 1042 363 1075 q 308 973 308 1010 q 324 926 308 944 q 374 908 341 908 "},"V":{"x_min":215.671875,"x_max":1111.5,"ha":997,"o":"m 1111 1013 l 549 0 l 346 0 l 215 1013 l 447 1013 l 500 256 l 882 1013 l 1111 1013 "},"Ξ":{"x_min":0,"x_max":950,"ha":800,"o":"m 909 826 l 181 826 l 222 1012 l 950 1012 l 909 826 m 773 432 l 156 432 l 197 617 l 813 617 l 773 432 m 751 0 l 0 0 l 38 183 l 790 183 l 751 0 "}," ":{"x_min":0,"x_max":0,"ha":853},"Ϋ":{"x_min":216.671875,"x_max":1052.78125,"ha":914,"o":"m 833 1046 l 677 1046 l 713 1215 l 869 1215 l 833 1046 m 593 1046 l 436 1046 l 472 1215 l 629 1215 l 593 1046 m 1052 1012 l 612 376 l 531 0 l 322 0 l 402 376 l 216 1012 l 425 1012 l 551 576 l 843 1012 l 1052 1012 "},"0":{"x_min":136,"x_max":897,"ha":828,"o":"m 409 -26 q 201 75 273 -26 q 136 320 136 167 q 270 761 136 558 q 624 984 417 984 q 833 881 760 984 q 897 633 897 789 q 763 195 897 396 q 409 -26 617 -26 m 444 137 q 616 310 540 137 q 687 636 687 470 q 663 770 687 720 q 589 821 639 821 q 418 647 495 821 q 346 320 346 485 q 369 186 346 235 q 444 137 393 137 "},"”":{"x_min":133.328125,"x_max":686.109375,"ha":567,"o":"m 369 834 q 284 692 351 751 q 133 626 218 634 l 148 697 q 279 831 255 723 l 177 831 l 216 1013 l 408 1013 l 369 834 m 647 834 q 562 692 629 751 q 411 626 495 634 l 426 697 q 556 831 533 723 l 455 831 l 494 1013 l 686 1013 l 647 834 "},"@":{"x_min":64,"x_max":1397,"ha":1374,"o":"m 1104 -52 q 602 -211 866 -211 q 191 -77 334 -211 q 64 237 64 41 q 298 759 64 522 q 916 1019 554 1019 q 1285 898 1159 1019 q 1397 621 1397 793 q 1255 251 1397 417 q 900 75 1105 75 q 807 91 827 75 q 777 188 777 114 q 670 105 727 135 q 550 75 612 75 q 412 121 457 75 q 367 244 367 168 q 493 539 367 391 q 787 696 627 696 q 875 672 840 696 q 934 604 910 648 l 984 673 l 1108 673 q 1001 446 1045 542 q 908 236 912 259 q 919 199 902 213 q 961 185 936 185 q 1173 317 1077 185 q 1269 599 1269 449 q 1188 811 1269 732 q 908 905 1094 905 q 383 692 597 905 q 188 262 188 498 q 292 5 188 102 q 625 -103 407 -103 q 848 -67 729 -103 q 1066 26 968 -32 l 1104 -52 m 872 483 q 877 500 876 491 q 879 515 877 509 q 848 572 879 548 q 779 596 818 596 q 598 480 682 596 q 521 270 521 372 q 540 201 521 227 q 598 175 559 175 q 719 221 664 175 q 804 333 775 268 l 872 483 "},"Ί":{"x_min":166.671875,"x_max":836.109375,"ha":732,"o":"m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 m 619 0 l 411 0 l 627 1012 l 836 1012 l 619 0 "},"i":{"x_min":13.890625,"x_max":430.5625,"ha":326,"o":"m 391 830 l 191 830 l 230 1013 l 430 1013 l 391 830 m 213 0 l 13 0 l 173 749 l 373 749 l 213 0 "},"Β":{"x_min":0.46875,"x_max":965.71875,"ha":962,"o":"m 792 547 q 876 473 846 523 q 906 359 906 423 q 900 304 906 330 q 733 75 869 158 q 461 0 612 0 l 0 0 l 217 1013 l 694 1013 q 883 964 810 1013 q 965 811 965 910 q 958 754 965 789 q 901 630 944 687 q 792 547 857 573 m 572 621 q 676 646 629 621 q 745 730 734 676 q 748 753 748 747 q 707 816 748 794 q 615 838 666 838 l 377 838 l 331 621 l 572 621 m 485 182 q 607 211 554 182 q 685 311 671 245 q 688 337 688 330 q 644 418 688 390 q 540 446 600 446 l 294 446 l 238 182 l 485 182 "},"υ":{"x_min":60,"x_max":815.390625,"ha":767,"o":"m 744 416 q 683 204 714 276 q 558 40 636 95 q 320 -25 466 -25 q 114 44 179 -25 q 60 214 60 102 q 64 287 60 248 q 79 369 69 326 l 159 749 l 359 749 l 279 369 q 266 298 269 321 q 264 253 264 276 q 284 171 264 201 q 357 142 304 142 q 493 247 441 142 q 545 422 520 303 l 615 749 l 815 749 l 744 416 "},"]":{"x_min":-63.890625,"x_max":565.28125,"ha":446,"o":"m 284 -300 l -63 -300 l -33 -154 l 129 -154 l 348 866 l 185 865 l 217 1013 l 565 1013 l 284 -300 "},"m":{"x_min":0,"x_max":1183,"ha":1174,"o":"m 1065 0 l 866 0 l 972 483 q 972 514 972 493 q 949 573 972 550 q 887 596 926 596 q 783 554 829 596 q 724 454 737 512 l 627 0 l 433 0 l 536 481 q 538 497 538 490 q 538 509 538 505 q 450 596 538 596 q 348 555 390 596 q 294 453 306 515 l 197 0 l 0 0 l 159 748 l 348 748 l 330 665 q 438 745 379 715 q 558 775 498 775 q 669 744 620 775 q 748 659 717 713 q 854 744 794 713 q 980 775 915 775 q 1127 719 1071 775 q 1183 576 1183 663 q 1182 555 1183 566 q 1177 523 1181 544 l 1065 0 "},"χ":{"x_min":-63.890625,"x_max":898.609375,"ha":847,"o":"m 695 -299 l 484 -299 l 393 66 l 151 -299 l -63 -299 l 311 233 l 173 749 l 390 749 l 465 400 l 687 749 l 898 749 l 551 238 l 695 -299 "},"8":{"x_min":109,"x_max":901,"ha":828,"o":"m 733 516 q 810 438 785 484 q 835 337 835 391 q 714 90 835 202 q 408 -29 586 -29 q 181 44 261 -29 q 109 215 109 111 q 163 388 109 304 q 313 516 217 472 q 251 589 271 548 q 231 674 231 630 q 348 889 231 793 q 624 986 465 986 q 825 920 750 986 q 901 760 901 855 q 860 629 901 692 q 733 516 819 566 m 539 590 q 660 633 613 590 q 707 730 707 677 q 677 800 707 772 q 590 828 648 828 q 469 784 516 828 q 423 684 423 740 q 452 617 423 644 q 539 590 481 590 m 442 135 q 578 193 525 135 q 627 315 627 245 q 597 399 627 368 q 503 436 564 436 q 370 377 424 436 q 317 248 317 318 q 348 167 317 200 q 442 135 379 135 "},"ί":{"x_min":41.671875,"x_max":593.0625,"ha":389,"o":"m 241 0 l 41 0 l 201 748 l 401 748 l 241 0 m 593 1039 l 345 823 l 247 823 l 415 1039 l 593 1039 "},"Ζ":{"x_min":0,"x_max":1020.828125,"ha":886,"o":"m 983 835 l 290 182 l 831 182 l 793 0 l 0 0 l 37 176 l 729 829 l 188 829 l 227 1012 l 1020 1012 l 983 835 "},"R":{"x_min":0,"x_max":983,"ha":947,"o":"m 836 0 l 608 0 q 600 56 600 27 q 613 155 600 93 q 626 212 620 184 q 634 257 631 240 q 637 293 637 274 q 608 368 637 343 q 512 393 580 393 l 291 393 l 208 0 l 0 0 l 216 1013 l 708 1013 q 905 958 828 1013 q 983 798 983 903 q 976 734 983 772 q 905 586 958 652 q 769 485 848 513 q 840 431 819 466 q 861 345 861 395 q 845 237 861 305 q 831 177 837 204 q 824 143 826 151 q 819 94 819 115 q 823 57 819 72 q 843 31 828 43 l 836 0 m 642 838 l 387 838 l 330 572 l 575 572 q 692 604 640 572 q 763 704 750 640 q 766 733 766 714 q 731 810 766 782 q 642 838 696 838 "},"o":{"x_min":68,"x_max":854,"ha":871,"o":"m 374 -26 q 149 56 230 -26 q 68 274 68 139 q 79 371 68 318 q 245 660 116 545 q 545 775 373 775 q 772 691 690 775 q 854 471 854 608 q 842 371 854 427 q 675 86 805 199 q 374 -26 545 -26 m 409 141 q 560 216 496 141 q 635 373 616 281 q 644 444 644 409 q 613 556 644 513 q 507 607 577 607 q 357 530 423 607 q 282 373 303 466 q 276 305 276 335 q 305 191 276 232 q 409 141 339 141 "},"5":{"x_min":112,"x_max":927.28125,"ha":828,"o":"m 836 319 q 662 59 801 158 q 387 -29 535 -29 q 194 30 269 -29 q 112 211 112 95 q 116 264 112 236 l 309 264 q 306 245 307 255 q 306 231 306 236 q 340 156 306 184 q 427 129 375 129 q 548 172 492 129 q 630 308 612 222 q 636 354 636 330 q 597 451 636 414 q 505 488 559 488 q 430 472 466 488 q 362 420 395 456 l 185 428 l 362 958 l 927 958 l 892 790 l 465 790 l 398 592 q 483 634 438 619 q 570 649 529 649 q 762 571 681 649 q 843 380 843 493 q 842 360 843 369 q 836 319 841 350 "},"7":{"x_min":204.5625,"x_max":965.671875,"ha":828,"o":"m 933 808 q 614 435 737 626 q 408 0 490 244 l 204 0 q 403 422 278 236 q 715 789 510 583 l 232 789 l 268 958 l 965 958 l 933 808 "},"K":{"x_min":0,"x_max":1080.5625,"ha":996,"o":"m 900 0 l 647 0 l 415 462 l 284 355 l 208 0 l 0 0 l 216 1013 l 425 1013 l 336 595 l 820 1013 l 1080 1013 l 590 603 l 900 0 "},",":{"x_min":-51.390625,"x_max":250,"ha":303,"o":"m 206 5 q 117 -150 186 -87 q -51 -238 48 -213 l -34 -159 q 111 -2 86 -116 l 0 -2 l 44 205 l 250 205 l 206 5 "},"d":{"x_min":66,"x_max":937.890625,"ha":836,"o":"m 721 0 l 529 0 l 551 101 q 435 7 500 41 q 297 -26 369 -26 q 118 58 178 -26 q 66 256 66 132 q 78 373 66 314 q 209 642 113 530 q 468 775 321 775 q 589 743 536 775 q 667 656 642 712 l 743 1013 l 937 1013 l 721 0 m 489 601 q 346 524 408 601 q 273 372 293 459 q 268 337 269 349 q 267 301 267 326 q 295 188 267 233 q 387 143 323 143 q 535 216 472 143 q 607 369 587 279 q 613 416 612 401 q 614 439 614 431 q 587 550 614 510 q 489 601 555 601 "},"¨":{"x_min":436.109375,"x_max":869.296875,"ha":933,"o":"m 833 1046 l 677 1046 l 713 1216 l 869 1216 l 833 1046 m 593 1045 l 436 1046 l 472 1216 l 629 1215 l 593 1045 "},"E":{"x_min":0,"x_max":951.390625,"ha":824,"o":"m 761 0 l 0 0 l 216 1013 l 951 1013 l 913 837 l 384 837 l 338 621 l 823 621 l 786 446 l 301 446 l 245 186 l 801 186 l 761 0 "},"Y":{"x_min":215.671875,"x_max":1051.78125,"ha":931,"o":"m 1051 1013 l 611 376 l 530 0 l 321 0 l 401 376 l 215 1013 l 424 1013 l 550 576 l 842 1013 l 1051 1013 "},"\"":{"x_min":129.171875,"x_max":568.015625,"ha":454,"o":"m 486 604 l 354 604 l 436 988 l 568 988 l 486 604 m 261 604 l 129 604 l 211 988 l 343 988 l 261 604 "},"‹":{"x_min":111.109375,"x_max":967.796875,"ha":828,"o":"m 795 17 l 111 352 l 140 487 l 967 823 l 934 671 l 319 421 l 827 169 l 795 17 "},"„":{"x_min":-51.390625,"x_max":527.78125,"ha":588,"o":"m 206 5 q 117 -150 185 -87 q -51 -238 48 -213 l -34 -159 q 111 -2 86 -116 l 0 -2 l 44 205 l 249 205 l 206 5 m 484 5 q 395 -150 463 -87 q 226 -238 326 -213 l 243 -159 q 388 -2 363 -116 l 277 -2 l 322 205 l 527 205 l 484 5 "},"δ":{"x_min":67,"x_max":886.453125,"ha":835,"o":"m 807 352 q 648 76 770 177 q 348 -25 525 -25 q 141 47 215 -25 q 67 242 67 120 q 68 285 67 270 q 77 333 69 301 q 214 581 108 478 q 471 690 326 690 q 251 864 369 787 l 283 1013 l 886 1013 l 853 856 l 532 856 q 728 683 662 765 q 817 440 817 571 q 815 398 817 414 q 807 352 814 383 m 537 551 q 366 497 438 551 q 272 344 294 444 q 266 292 266 321 q 297 184 266 228 q 387 140 328 140 q 527 203 468 140 q 600 344 581 260 q 607 406 607 378 q 591 491 607 455 q 537 551 575 528 "},"έ":{"x_min":54.171875,"x_max":801.390625,"ha":742,"o":"m 708 259 q 573 47 679 123 q 334 -25 473 -25 q 127 27 200 -25 q 54 159 54 80 q 95 280 54 220 q 218 389 136 339 q 161 447 183 413 q 140 521 140 481 q 143 552 140 542 q 273 717 163 653 q 487 776 373 776 q 672 726 604 776 q 741 576 741 676 q 733 508 741 544 l 554 508 q 558 539 558 524 q 532 592 558 576 q 458 608 506 608 q 381 590 423 608 q 331 544 338 573 q 329 517 329 524 q 357 467 329 480 q 433 455 386 455 q 465 455 450 455 q 497 456 481 455 l 465 308 l 394 308 q 309 291 345 308 q 251 223 261 269 q 250 205 250 216 q 294 152 250 166 q 376 143 325 143 q 463 174 427 143 q 509 259 498 206 l 708 259 m 801 1039 l 554 823 l 455 823 l 623 1039 l 801 1039 "},"ω":{"x_min":63,"x_max":1031,"ha":1050,"o":"m 635 323 q 624 276 632 308 q 617 215 617 243 q 631 161 617 180 q 682 142 646 142 q 759 189 726 142 q 819 365 792 236 q 829 417 828 400 q 831 472 831 435 q 813 613 831 542 q 769 749 796 685 l 974 749 q 1016 613 1001 680 q 1031 475 1031 546 q 1017 337 1031 405 q 894 96 989 205 q 662 -29 787 -29 q 552 0 601 -29 q 487 78 503 29 q 392 0 451 28 q 271 -29 332 -29 q 111 57 167 -29 q 63 246 63 132 q 65 292 63 269 q 73 337 68 315 q 154 553 96 444 q 290 749 207 650 l 494 749 q 362 565 411 648 q 280 365 301 461 q 270 305 273 335 q 267 248 267 275 q 280 171 267 200 q 323 142 293 142 q 400 185 371 142 q 442 323 418 211 l 485 528 l 679 528 l 635 323 "},"´":{"x_min":129.171875,"x_max":343.015625,"ha":299,"o":"m 261 604 l 129 604 l 211 988 l 343 988 l 261 604 "},"±":{"x_min":29.171875,"x_max":930.5625,"ha":828,"o":"m 901 480 l 586 480 l 538 254 l 398 253 l 446 480 l 131 480 l 161 615 l 475 615 l 523 841 l 664 842 l 615 615 l 930 615 l 901 480 m 798 0 l 29 0 l 58 136 l 827 136 l 798 0 "},"|":{"x_min":-51.375,"x_max":354.28125,"ha":240,"o":"m 242 462 l 99 462 l 211 984 l 354 983 l 242 462 m 91 -242 l -51 -242 l 60 280 l 203 280 l 91 -242 "},"ϋ":{"x_min":60,"x_max":815.390625,"ha":767,"o":"m 708 810 l 579 810 l 608 952 l 737 952 l 708 810 m 444 810 l 315 810 l 344 952 l 473 952 l 444 810 m 744 417 q 683 204 714 276 q 558 40 636 96 q 320 -25 466 -25 q 114 44 179 -25 q 60 214 60 103 q 64 287 60 248 q 79 369 69 326 l 159 748 l 359 748 l 279 369 q 266 298 269 321 q 264 253 264 276 q 284 171 264 201 q 357 142 304 142 q 493 247 441 142 q 545 422 520 303 l 615 748 l 815 748 l 744 417 "},"§":{"x_min":62,"x_max":748,"ha":731,"o":"m 732 469 q 570 274 705 337 q 619 146 619 223 q 614 105 619 126 q 488 -76 591 -7 q 280 -142 392 -142 q 127 -93 185 -142 q 62 60 62 -39 q 66 108 62 83 l 236 108 q 261 27 236 53 q 325 1 287 1 q 395 23 363 1 q 436 83 428 46 q 438 99 438 88 q 350 195 438 146 q 185 287 188 285 q 96 433 96 351 q 100 476 96 452 q 155 582 113 537 q 262 659 196 627 q 230 707 242 680 q 219 762 219 734 q 221 790 219 770 q 342 978 246 907 q 535 1042 430 1042 q 686 991 625 1042 q 748 843 748 940 q 748 826 748 834 q 748 807 748 812 l 580 807 q 583 830 583 823 q 559 882 583 865 q 499 900 535 900 q 432 881 463 900 q 395 829 401 862 q 470 736 385 781 q 642 648 556 691 q 737 508 737 587 q 732 469 737 490 m 490 333 q 562 421 562 377 q 545 464 562 444 q 496 502 528 484 l 337 595 q 280 551 296 572 q 263 509 263 530 q 289 456 263 481 q 352 413 310 435 l 490 333 "},"b":{"x_min":0,"x_max":815,"ha":822,"o":"m 410 -26 q 290 6 341 -26 q 213 101 240 39 l 191 0 l 0 0 l 216 1013 l 411 1013 l 334 656 q 448 744 383 713 q 581 775 513 775 q 762 688 701 775 q 815 489 815 613 q 802 374 815 431 q 672 106 767 218 q 410 -26 558 -26 m 490 600 q 344 524 406 600 q 272 371 291 462 q 265 325 266 339 q 265 302 265 310 q 291 193 265 234 q 388 145 323 145 q 534 221 472 145 q 607 374 587 285 q 614 441 614 412 q 587 551 614 510 q 490 600 555 600 "},"q":{"x_min":66,"x_max":880.953125,"ha":833,"o":"m 657 -298 l 462 -298 l 547 97 q 299 -26 440 -26 q 118 58 179 -26 q 66 256 66 132 q 78 371 66 314 q 209 642 113 530 q 470 775 321 775 q 588 742 536 775 q 669 654 640 709 l 689 750 l 880 750 l 657 -298 m 489 601 q 347 527 408 601 q 276 378 296 464 q 271 344 272 357 q 270 305 270 330 q 294 194 270 236 q 388 143 325 143 q 535 216 471 143 q 608 369 589 280 q 617 439 617 403 q 589 550 617 509 q 489 601 555 601 "},"Ω":{"x_min":0.5625,"x_max":1114,"ha":1108,"o":"m 1009 0 l 590 0 l 633 199 q 797 368 727 265 q 889 580 866 471 q 897 659 897 621 q 844 802 897 750 q 689 855 791 855 q 475 770 564 855 q 365 563 392 691 q 355 466 355 519 q 382 316 355 384 q 463 199 409 248 l 420 0 l 0 0 l 38 176 l 240 176 q 142 459 142 294 q 154 569 142 512 q 359 907 197 774 q 727 1040 521 1040 q 1008 945 902 1040 q 1114 689 1114 851 q 1101 578 1114 637 q 1010 362 1077 466 q 844 176 943 257 l 1047 176 l 1009 0 "},"ύ":{"x_min":60,"x_max":815.390625,"ha":767,"o":"m 744 417 q 683 204 714 276 q 558 40 636 96 q 320 -25 466 -25 q 114 44 179 -25 q 60 214 60 103 q 64 287 60 248 q 79 369 69 326 l 159 748 l 359 748 l 280 369 q 268 310 273 342 q 264 251 264 278 q 284 171 264 201 q 357 142 305 142 q 493 247 441 142 q 545 422 520 303 l 615 748 l 815 748 l 744 417 m 801 1039 l 554 823 l 455 823 l 623 1039 l 801 1039 "},"z":{"x_min":0,"x_max":809.71875,"ha":753,"o":"m 663 0 l 0 0 l 33 154 l 537 591 l 151 591 l 184 749 l 809 749 l 774 584 l 279 165 l 698 165 l 663 0 "},"™":{"x_min":197,"x_max":1167.84375,"ha":1063,"o":"m 601 921 l 451 921 l 362 506 l 256 505 l 345 920 l 197 921 l 216 1013 l 620 1013 l 601 921 m 1059 506 l 960 506 l 1047 915 l 858 506 l 751 506 l 734 915 l 646 506 l 549 506 l 658 1013 l 812 1013 l 828 628 l 1012 1013 l 1167 1013 l 1059 506 "},"ή":{"x_min":0,"x_max":781.953125,"ha":779,"o":"m 609 -278 l 409 -278 l 552 390 q 559 425 554 395 q 563 483 563 455 q 545 568 563 536 q 477 605 523 605 q 363 554 418 605 q 295 441 309 502 l 201 0 l 0 0 l 159 748 l 361 748 l 343 665 q 461 743 395 713 q 588 773 526 773 q 734 712 683 773 q 781 562 781 655 q 773 484 781 524 l 609 -278 m 718 1039 l 470 823 l 372 823 l 540 1039 l 718 1039 "},"Θ":{"x_min":93,"x_max":1117,"ha":1092,"o":"m 491 -29 q 194 83 301 -29 q 93 369 93 190 q 108 505 93 431 q 322 883 156 731 q 719 1040 494 1040 q 1015 926 908 1040 q 1117 640 1117 817 q 1112 574 1117 611 q 1101 505 1108 538 q 889 127 1051 277 q 491 -29 718 -29 m 530 154 q 769 266 666 154 q 890 506 861 365 q 902 605 902 559 q 850 781 902 714 q 680 858 792 858 q 441 746 545 858 q 319 506 348 648 q 310 458 313 480 q 308 409 308 435 q 359 230 308 297 q 530 154 417 154 m 768 430 l 408 430 l 443 593 l 802 593 l 768 430 "},"®":{"x_min":97,"x_max":1126,"ha":1104,"o":"m 505 -6 q 195 112 303 -6 q 97 388 97 219 q 262 811 97 625 q 719 1017 444 1017 q 1028 898 920 1017 q 1126 622 1126 793 q 960 199 1126 385 q 505 -6 778 -6 m 702 934 q 316 761 470 934 q 176 405 176 604 q 256 174 176 262 q 517 76 346 76 q 902 249 748 76 q 1044 607 1044 409 q 963 836 1044 750 q 702 934 873 934 m 822 190 l 678 190 q 673 223 673 205 q 679 270 673 241 q 691 325 686 299 q 698 356 697 351 q 699 377 699 361 q 680 423 699 408 q 620 439 662 439 l 481 439 l 427 189 l 296 190 l 434 829 l 743 829 q 868 795 821 829 q 916 694 916 761 q 911 654 916 675 q 865 559 900 604 q 781 497 831 515 q 825 464 812 486 q 839 411 839 441 q 833 357 839 384 q 819 299 823 318 q 814 267 816 280 q 812 251 812 254 q 827 212 812 223 l 822 190 m 699 718 l 540 717 l 505 551 l 659 552 q 734 572 702 552 q 776 635 766 593 q 778 652 778 641 q 756 700 778 683 q 699 718 735 718 "},"~":{"x_min":140.28125,"x_max":1058.328125,"ha":949,"o":"m 1058 968 q 956 750 1029 831 q 740 656 872 656 q 565 744 648 656 q 437 832 483 832 q 327 775 369 832 q 279 656 295 732 l 140 656 q 244 871 168 787 q 458 968 331 968 q 630 879 548 968 q 766 791 712 791 q 872 849 833 791 q 919 968 898 888 l 1058 968 "},"Ε":{"x_min":0,"x_max":951.390625,"ha":824,"o":"m 761 0 l 0 0 l 216 1012 l 951 1012 l 913 836 l 384 836 l 338 621 l 823 621 l 786 446 l 301 446 l 245 186 l 801 186 l 761 0 "},"³":{"x_min":115,"x_max":621,"ha":564,"o":"m 584 555 q 481 413 565 466 q 308 365 405 365 q 173 402 224 365 q 115 520 115 444 q 120 565 115 531 l 244 565 q 269 486 244 512 q 331 461 294 461 q 404 486 370 461 q 447 553 438 512 q 450 575 450 570 q 413 627 450 614 q 324 641 377 641 l 341 722 q 427 737 392 722 q 484 804 474 758 q 486 819 486 809 q 465 864 486 847 q 413 882 445 882 q 349 857 379 882 q 303 783 319 833 l 180 783 q 285 930 208 878 q 438 976 354 976 q 568 939 515 976 q 621 841 621 902 q 618 813 621 832 q 583 744 609 771 q 514 695 557 716 q 569 651 550 678 q 589 587 589 624 q 584 555 589 571 "},"[":{"x_min":-63.890625,"x_max":563.890625,"ha":444,"o":"m 282 -300 l -63 -300 l 216 1013 l 563 1013 l 531 866 l 372 866 l 154 -154 l 313 -153 l 282 -300 "},"L":{"x_min":0,"x_max":744.453125,"ha":763,"o":"m 704 0 l 0 0 l 216 1013 l 425 1013 l 248 186 l 744 186 l 704 0 "},"σ":{"x_min":68.0625,"x_max":1011.109375,"ha":940,"o":"m 977 594 l 838 594 q 852 480 852 542 q 840 369 852 426 q 675 83 801 191 q 373 -25 550 -25 q 148 56 229 -25 q 68 273 68 138 q 79 372 68 316 q 241 656 116 544 q 543 775 372 775 q 605 768 572 775 q 708 750 691 750 l 1011 750 l 977 594 m 409 142 q 561 216 497 142 q 636 373 616 282 q 644 444 644 409 q 613 558 644 515 q 509 608 579 608 q 358 530 425 608 q 281 373 302 465 q 275 305 275 336 q 304 191 275 233 q 409 142 338 142 "},"ζ":{"x_min":51,"x_max":809.828125,"ha":701,"o":"m 615 -32 q 570 -157 601 -97 q 491 -278 538 -218 l 313 -278 q 388 -180 359 -226 q 429 -80 416 -134 q 432 -59 432 -63 q 410 -19 432 -30 q 352 -8 388 -8 q 313 -9 340 -8 q 277 -11 287 -11 q 109 45 167 -11 q 51 201 51 102 q 55 248 51 223 q 60 283 59 272 q 215 596 92 436 q 475 856 319 732 l 230 856 l 264 1013 l 809 1013 l 786 904 q 459 660 594 800 q 265 318 302 496 q 257 247 257 276 q 439 131 257 136 q 622 26 622 127 q 615 -32 622 5 "},"θ":{"x_min":85,"x_max":836,"ha":817,"o":"m 575 1022 q 779 906 711 1022 q 836 655 836 809 q 817 486 836 569 q 665 148 776 290 q 348 -25 530 -25 q 143 79 211 -25 q 85 315 85 169 q 103 481 85 395 q 257 831 144 679 q 575 1022 395 1022 m 636 590 q 643 636 640 612 q 646 687 646 660 q 622 807 646 762 q 536 862 594 862 q 397 763 456 862 q 330 590 351 688 l 636 590 m 604 440 l 298 440 q 289 378 293 410 q 285 306 285 345 q 304 186 285 229 q 383 131 329 131 q 530 248 462 131 q 604 440 582 337 "},"Ο":{"x_min":93,"x_max":1118,"ha":1092,"o":"m 491 -29 q 194 83 301 -29 q 93 369 93 190 q 108 505 93 431 q 320 883 156 733 q 719 1040 493 1040 q 1016 926 909 1040 q 1118 640 1118 819 q 1113 574 1118 611 q 1102 505 1109 538 q 888 127 1052 277 q 491 -29 716 -29 m 530 154 q 768 266 665 154 q 888 506 859 366 q 900 605 900 559 q 848 781 900 715 q 680 857 790 857 q 441 747 543 857 q 321 506 351 649 q 310 408 310 454 q 361 230 310 297 q 530 154 419 154 "},"Γ":{"x_min":0,"x_max":920.828125,"ha":742,"o":"m 883 836 l 387 836 l 208 0 l 0 0 l 216 1012 l 920 1012 l 883 836 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":150,"x_max":1168,"ha":1213,"o":"m 965 484 q 1119 425 1065 484 q 1168 288 1168 373 q 1083 76 1168 172 q 853 -29 990 -29 q 699 29 753 -29 q 651 167 651 81 q 734 380 651 285 q 965 484 826 484 m 886 120 q 981 160 944 120 q 1018 251 1018 201 q 998 308 1018 287 q 931 333 974 333 q 836 292 873 333 q 800 201 800 251 q 821 142 800 165 q 886 120 843 120 m 1115 984 l 311 -28 l 200 -29 l 1004 983 l 1115 984 m 461 984 q 614 925 560 984 q 663 789 663 873 q 579 577 663 671 q 350 472 486 472 q 200 527 251 472 q 150 667 150 583 q 232 879 150 786 q 461 984 323 984 m 429 835 q 330 794 368 835 q 293 702 293 753 q 315 644 293 667 q 380 621 337 621 q 479 661 441 621 q 517 753 517 702 q 494 811 517 788 q 429 835 472 835 "},"P":{"x_min":0,"x_max":925,"ha":838,"o":"m 286 361 l 208 0 l 0 0 l 216 1013 l 666 1013 q 856 944 787 1013 q 925 762 925 875 q 916 682 925 723 q 784 452 886 544 q 544 361 681 361 l 286 361 m 601 837 l 388 837 l 326 544 l 527 544 q 647 577 597 544 q 716 683 702 615 q 721 718 721 700 q 688 802 721 768 q 601 837 655 837 "},"Έ":{"x_min":166.671875,"x_max":1362.5,"ha":1235,"o":"m 1172 0 l 411 0 l 627 1012 l 1362 1012 l 1325 836 l 795 836 l 750 621 l 1234 621 l 1197 446 l 712 446 l 656 186 l 1212 186 l 1172 0 m 534 1035 l 265 780 l 166 780 l 356 1035 l 534 1035 "},"Ώ":{"x_min":179.140625,"x_max":1295,"ha":1289,"o":"m 1190 0 l 771 0 l 814 199 q 977 369 907 265 q 1070 580 1047 474 q 1078 659 1078 621 q 1025 802 1078 750 q 869 855 972 855 q 656 770 744 855 q 545 563 572 691 q 535 466 535 519 q 562 316 535 384 q 643 199 589 248 l 600 0 l 180 0 l 218 176 l 420 176 q 322 459 322 294 q 334 569 322 512 q 539 907 377 774 q 908 1040 701 1040 q 1189 945 1083 1040 q 1295 689 1295 851 q 1282 578 1295 637 q 1191 362 1258 466 q 1025 176 1124 257 l 1228 176 l 1190 0 m 547 1092 l 277 837 l 179 837 l 369 1092 l 547 1092 "},"_":{"x_min":-8.71875,"x_max":727.390625,"ha":828,"o":"m 696 -333 l -8 -333 l 21 -190 l 727 -190 l 696 -333 "},"Ϊ":{"x_min":41.671875,"x_max":601.390625,"ha":503,"o":"m 565 1046 l 409 1046 l 445 1215 l 601 1215 l 565 1046 m 325 1046 l 168 1046 l 204 1215 l 361 1215 l 325 1046 m 250 0 l 41 0 l 258 1012 l 466 1012 l 250 0 "},"+":{"x_min":118.0625,"x_max":888.890625,"ha":828,"o":"m 859 353 l 558 353 l 483 0 l 343 0 l 418 353 l 118 353 l 147 489 l 447 489 l 522 839 l 662 840 l 587 489 l 888 489 l 859 353 "},"½":{"x_min":147.984375,"x_max":1176,"ha":1188,"o":"m 1171 380 q 1042 230 1153 301 q 800 101 921 165 q 842 94 804 95 q 943 93 880 93 l 970 93 l 994 93 l 1013 93 l 1030 93 q 1067 93 1048 93 q 1106 93 1087 93 l 1085 0 l 649 0 l 661 38 q 781 181 686 115 q 950 281 864 230 q 1045 376 1035 333 q 1047 385 1047 380 q 1047 391 1047 390 q 1024 440 1047 420 q 967 461 1001 461 q 898 435 930 461 q 849 354 866 409 l 734 354 q 841 505 761 451 q 996 554 911 554 q 1123 516 1071 554 q 1176 413 1176 479 q 1171 380 1176 399 m 1081 998 l 262 -28 l 147 -27 l 970 999 l 1081 998 m 361 422 l 237 422 l 317 798 l 170 799 l 186 875 q 323 902 278 875 q 378 973 359 925 l 479 973 l 361 422 "},"Ρ":{"x_min":0,"x_max":925,"ha":837,"o":"m 286 361 l 208 0 l 0 0 l 216 1012 l 666 1012 q 856 943 787 1012 q 925 762 925 874 q 916 681 925 723 q 784 452 886 544 q 544 361 681 361 l 286 361 m 601 836 l 389 836 l 326 544 l 527 544 q 647 577 597 544 q 716 683 702 614 q 721 717 721 699 q 688 801 721 767 q 601 836 655 836 "},"'":{"x_min":133.328125,"x_max":408.328125,"ha":289,"o":"m 369 834 q 284 692 351 752 q 133 626 218 632 l 148 697 q 279 830 256 726 l 177 830 l 216 1013 l 408 1013 l 369 834 "},"ª":{"x_min":153,"x_max":524,"ha":393,"o":"m 483 625 l 379 625 q 376 649 376 636 q 376 672 376 663 q 248 611 325 611 q 153 700 153 611 q 155 727 153 718 q 297 846 178 828 q 421 886 416 864 q 407 919 425 907 q 366 931 390 931 q 319 917 339 931 q 296 877 300 904 l 201 877 q 265 977 215 942 q 382 1013 315 1013 q 473 992 433 1013 q 524 921 524 965 q 524 903 524 908 l 478 694 q 475 669 475 677 q 487 641 475 648 l 483 625 m 398 773 l 405 808 q 297 779 351 793 q 254 733 260 762 q 260 700 248 712 q 297 689 273 689 q 363 712 334 689 q 398 773 391 736 "},"΅":{"x_min":230.5625,"x_max":786.109375,"ha":753,"o":"m 756 810 l 627 810 l 656 952 l 786 952 l 756 810 m 748 1064 l 479 810 l 380 810 l 570 1064 l 748 1064 m 359 810 l 230 810 l 259 952 l 388 952 l 359 810 "},"T":{"x_min":177.78125,"x_max":1025,"ha":894,"o":"m 986 831 l 686 831 l 508 0 l 298 0 l 476 831 l 177 831 l 216 1013 l 1025 1013 l 986 831 "},"Φ":{"x_min":99,"x_max":1067,"ha":1032,"o":"m 565 0 l 385 0 l 411 121 q 186 205 273 121 q 99 423 99 290 q 101 462 99 440 q 109 508 104 483 q 278 775 143 669 q 575 892 406 875 l 601 1013 l 782 1013 l 756 892 q 981 798 896 878 q 1067 589 1067 718 q 1065 557 1067 573 q 1057 507 1064 540 q 889 230 1020 340 q 591 121 757 121 l 565 0 m 626 285 q 779 354 711 285 q 861 508 841 418 q 868 564 868 540 q 829 677 868 632 q 720 729 791 722 l 626 285 m 446 285 l 540 729 q 387 661 450 718 q 304 516 323 604 q 298 462 298 493 q 337 337 298 389 q 446 285 377 285 "},"j":{"x_min":-111.109375,"x_max":458.328125,"ha":361,"o":"m 419 830 l 219 830 l 258 1013 l 458 1013 l 419 830 m 216 -119 q 123 -267 194 -221 q -44 -308 62 -308 l -111 -308 l -75 -140 l -54 -140 q -2 -130 -20 -140 q 23 -88 16 -120 l 201 749 l 401 749 l 216 -119 "},"Σ":{"x_min":0,"x_max":956.953125,"ha":849,"o":"m 772 0 l 0 0 l 30 140 l 480 526 l 202 862 l 234 1012 l 956 1012 l 919 836 l 494 836 l 731 523 l 336 175 l 809 175 l 772 0 "},"1":{"x_min":343.0625,"x_max":840.28125,"ha":828,"o":"m 629 0 l 434 0 l 579 674 l 343 674 l 372 810 q 555 837 494 810 q 680 984 638 874 l 840 984 l 629 0 "},"›":{"x_min":40.28125,"x_max":895.828125,"ha":828,"o":"m 866 352 l 40 17 l 72 168 l 683 420 l 179 671 l 212 823 l 895 487 l 866 352 "},"<":{"x_min":111.109375,"x_max":967.796875,"ha":828,"o":"m 795 17 l 111 352 l 140 487 l 967 823 l 934 671 l 319 421 l 827 169 l 795 17 "},"£":{"x_min":25,"x_max":839,"ha":814,"o":"m 724 38 q 601 -9 659 5 q 498 -24 544 -24 q 337 8 448 -24 q 244 25 279 25 q 163 12 205 25 q 72 -29 122 0 l 25 113 q 173 227 137 186 q 224 359 224 284 q 212 440 224 391 l 94 440 l 109 515 l 183 515 q 169 588 175 551 q 163 662 163 626 q 167 710 163 687 q 314 910 193 831 q 560 984 426 984 q 754 920 679 984 q 839 713 839 848 q 839 693 839 702 q 839 668 839 676 l 644 668 q 647 702 647 692 q 613 798 647 766 q 526 830 579 830 q 426 796 472 830 q 367 705 379 762 q 363 663 363 684 q 373 591 363 631 q 393 515 383 551 l 588 515 l 573 440 l 405 440 q 361 270 405 334 q 217 135 328 220 q 296 160 258 152 q 368 168 334 168 q 487 151 402 168 q 554 143 529 143 q 621 152 590 143 q 694 189 652 162 l 724 38 "},"t":{"x_min":129.171875,"x_max":572.328125,"ha":511,"o":"m 411 -6 q 338 -8 388 -6 q 284 -11 287 -11 q 164 17 200 -11 q 129 111 129 45 q 140 202 129 147 l 228 608 l 130 608 l 159 749 l 256 749 l 299 951 l 500 951 l 456 749 l 572 748 l 543 608 l 427 608 l 337 191 q 348 152 331 162 q 397 143 365 143 q 420 143 409 143 q 443 143 431 143 l 411 -6 "},"¬":{"x_min":63.890625,"x_max":800,"ha":801,"o":"m 723 93 l 570 93 l 614 297 l 63 297 l 95 450 l 800 450 l 723 93 "},"λ":{"x_min":0,"x_max":701.390625,"ha":775,"o":"m 701 0 l 491 0 l 440 444 l 195 0 l 0 0 l 387 697 l 348 1013 l 551 1013 l 701 0 "},"W":{"x_min":216,"x_max":1507.65625,"ha":1399,"o":"m 1507 1013 l 1002 0 l 802 0 l 810 776 l 489 0 l 288 0 l 216 1013 l 431 1013 l 452 297 l 750 1012 l 972 1013 l 967 298 l 1292 1013 l 1507 1013 "},">":{"x_min":40.28125,"x_max":895.828125,"ha":828,"o":"m 866 352 l 40 17 l 72 168 l 683 420 l 179 671 l 212 823 l 895 487 l 866 352 "},"v":{"x_min":158.71875,"x_max":899,"ha":828,"o":"m 899 749 l 472 0 l 265 0 l 158 749 l 380 749 l 417 211 l 687 749 l 899 749 "},"τ":{"x_min":126.390625,"x_max":777.78125,"ha":699,"o":"m 744 593 l 534 593 l 408 0 l 209 0 l 336 593 l 126 593 l 159 749 l 777 749 l 744 593 "},"ξ":{"x_min":48.609375,"x_max":813.890625,"ha":715,"o":"m 637 -14 q 586 -157 622 -86 q 500 -299 551 -229 l 336 -299 q 401 -194 390 -212 q 450 -85 441 -125 q 452 -62 452 -68 q 429 -21 452 -32 q 366 -10 405 -10 q 331 -11 354 -10 q 300 -13 308 -13 q 120 45 191 -13 q 48 202 48 103 q 55 259 48 227 q 148 426 76 354 q 315 530 215 493 q 241 583 268 551 q 211 669 211 621 q 213 699 211 679 q 265 790 225 747 q 352 856 301 828 l 205 856 l 238 1013 l 813 1013 l 780 856 l 680 857 q 526 840 581 857 q 413 736 430 811 q 411 719 411 728 q 411 707 411 711 q 487 618 411 642 q 638 602 540 602 l 681 602 l 648 446 l 609 446 q 405 425 475 446 q 259 284 281 387 q 255 248 255 263 q 449 151 255 165 q 643 33 643 137 q 643 6 643 19 q 637 -14 638 -8 "},"&":{"x_min":50,"x_max":956.953125,"ha":1007,"o":"m 909 -1 l 676 -1 l 625 83 q 280 -47 427 -47 q 70 100 123 -47 q 50 215 50 158 q 116 401 50 315 q 339 568 188 493 q 298 644 305 628 q 279 732 279 689 q 283 769 279 750 q 403 951 308 883 q 596 1013 491 1013 q 746 966 685 1013 q 808 837 808 919 q 808 815 808 826 q 802 789 803 797 q 721 644 785 711 q 583 539 674 596 l 691 359 q 776 527 747 441 l 956 527 q 772 223 898 358 l 909 -1 m 629 787 q 632 810 632 804 q 613 854 632 838 q 566 870 594 870 q 506 849 534 870 q 469 792 478 829 q 467 769 467 778 q 482 711 467 742 q 513 660 490 694 q 583 714 551 682 q 629 787 620 753 m 545 214 l 412 441 q 294 352 332 395 q 256 262 256 308 q 268 204 256 233 q 376 135 298 135 q 458 153 416 135 q 545 214 500 172 "},"Λ":{"x_min":0,"x_max":894.453125,"ha":974,"o":"m 894 0 l 666 0 l 608 757 l 225 0 l 0 0 l 561 1013 l 763 1013 l 894 0 "},"I":{"x_min":40.671875,"x_max":465.671875,"ha":365,"o":"m 249 0 l 40 0 l 257 1013 l 465 1013 l 249 0 "},"G":{"x_min":93,"x_max":1109.71875,"ha":1057,"o":"m 970 -1 l 829 -1 l 830 118 q 659 7 747 44 q 473 -29 572 -29 q 188 87 291 -29 q 93 373 93 197 q 108 509 93 437 q 319 884 158 737 q 715 1040 490 1040 q 993 950 883 1040 q 1109 698 1109 854 l 884 698 q 817 813 873 768 q 683 858 761 858 q 443 746 546 858 q 321 505 350 648 q 312 456 315 478 q 310 408 310 434 q 364 228 310 295 q 539 154 423 154 q 716 219 632 154 q 840 374 794 279 l 627 374 l 665 548 l 1087 548 l 970 -1 "},"ΰ":{"x_min":60,"x_max":815.390625,"ha":767,"o":"m 756 810 l 627 810 l 656 952 l 786 952 l 756 810 m 360 810 l 230 810 l 260 952 l 389 952 l 360 810 m 738 1039 l 491 823 l 393 823 l 561 1039 l 738 1039 m 744 417 q 683 204 714 276 q 558 40 636 96 q 320 -25 466 -25 q 114 44 179 -25 q 60 214 60 103 q 64 287 60 248 q 79 369 69 326 l 159 748 l 359 748 l 280 369 q 268 310 273 342 q 264 251 264 278 q 284 171 264 201 q 357 142 305 142 q 493 247 441 142 q 545 422 520 303 l 615 748 l 815 748 l 744 417 "},"`":{"x_min":140.28125,"x_max":412.5,"ha":288,"o":"m 330 654 l 140 654 l 177 830 q 262 970 194 909 q 412 1040 330 1031 l 397 969 q 309 922 338 952 q 268 836 279 892 l 369 836 l 330 654 "},"·":{"x_min":111.5,"x_max":362.890625,"ha":304,"o":"m 318 528 l 111 528 l 155 735 l 362 735 l 318 528 "},"Υ":{"x_min":216.671875,"x_max":1052.78125,"ha":914,"o":"m 1052 1013 l 612 376 l 531 0 l 322 0 l 402 376 l 216 1013 l 425 1013 l 551 576 l 843 1013 l 1052 1013 "},"r":{"x_min":0,"x_max":595.828125,"ha":513,"o":"m 552 564 q 383 536 440 564 q 284 395 306 498 l 200 0 l 0 0 l 159 748 l 343 748 l 315 618 q 595 768 430 768 l 552 564 "},"x":{"x_min":0,"x_max":884.71875,"ha":826,"o":"m 738 0 l 504 0 l 418 238 l 230 0 l 0 0 l 334 382 l 170 749 l 398 749 l 483 522 l 662 749 l 884 749 l 570 384 l 738 0 "},"μ":{"x_min":-59.71875,"x_max":806.953125,"ha":754,"o":"m 647 0 l 477 0 l 491 68 q 413 9 454 30 q 327 -11 372 -11 q 261 3 293 -11 q 208 43 230 18 l 138 -278 l -59 -278 l 159 749 l 358 749 l 275 358 q 264 304 268 326 q 261 254 261 281 q 282 180 261 208 q 354 152 304 152 q 487 240 443 152 q 534 401 508 283 l 608 749 l 806 749 l 647 0 "},"h":{"x_min":0,"x_max":783,"ha":782,"o":"m 669 0 l 469 0 l 552 390 q 560 444 557 412 q 564 491 564 476 q 548 572 564 544 q 483 607 529 607 q 366 554 425 607 q 295 441 308 501 l 201 0 l 0 0 l 216 1013 l 418 1013 l 343 665 q 463 743 398 715 q 591 772 527 772 q 737 712 687 772 q 783 566 783 658 q 780 529 783 549 q 773 484 778 509 l 669 0 "},".":{"x_min":0,"x_max":250,"ha":303,"o":"m 205 0 l 0 0 l 44 207 l 250 207 l 205 0 "},"φ":{"x_min":68,"x_max":1012,"ha":990,"o":"m 481 -278 l 306 -278 l 362 -22 q 145 60 222 -22 q 68 274 68 143 q 79 376 68 320 q 206 627 109 519 q 451 769 310 742 l 412 581 q 328 495 362 552 q 282 378 294 438 q 275 312 275 341 q 304 200 275 245 q 397 145 333 155 l 531 776 l 680 776 q 922 694 832 776 q 1012 474 1012 613 q 1000 379 1012 431 q 835 93 964 209 q 537 -22 705 -22 l 481 -278 m 571 145 q 720 225 656 145 q 794 381 774 290 q 799 413 798 404 q 801 445 801 423 q 771 559 801 516 q 671 611 737 611 l 571 145 "},";":{"x_min":-50,"x_max":365.28125,"ha":306,"o":"m 320 528 l 112 528 l 156 735 l 365 735 l 320 528 m 209 6 q 120 -151 188 -90 q -50 -238 52 -212 l -31 -158 q 70 -99 36 -135 q 113 0 105 -64 l 0 0 l 44 207 l 252 207 l 209 6 "},"f":{"x_min":106.953125,"x_max":643.0625,"ha":525,"o":"m 556 609 l 433 609 l 302 0 l 106 0 l 238 609 l 131 608 l 160 748 l 266 749 q 348 949 297 894 q 548 1019 411 1019 l 643 1015 l 609 855 l 547 855 q 480 826 497 855 q 461 749 476 817 l 586 749 l 556 609 "},"“":{"x_min":133.71875,"x_max":683.71875,"ha":567,"o":"m 324 631 l 133 631 l 171 807 q 256 948 187 886 q 405 1017 325 1010 l 392 947 q 261 813 285 921 l 362 813 l 324 631 m 601 631 l 410 631 l 448 807 q 534 948 465 886 q 683 1017 603 1010 l 669 947 q 539 813 562 921 l 640 813 l 601 631 "},"A":{"x_min":0,"x_max":966.671875,"ha":1069,"o":"m 966 0 l 747 0 l 723 208 l 330 208 l 218 0 l 0 0 l 577 1013 l 816 1013 l 966 0 m 704 376 l 654 810 l 420 376 l 704 376 "},"6":{"x_min":134,"x_max":903,"ha":828,"o":"m 903 734 l 700 734 q 672 802 700 776 q 604 828 645 828 q 481 769 537 828 q 385 571 413 700 q 587 638 478 638 q 784 564 714 638 q 847 390 847 497 q 731 109 847 235 q 414 -29 603 -29 q 195 62 266 -29 q 134 283 134 141 q 153 455 134 365 q 364 865 210 722 q 654 988 496 988 q 831 929 760 988 q 903 772 903 870 q 903 753 903 763 q 903 734 903 739 m 454 128 q 591 196 536 128 q 647 346 647 265 q 616 439 647 403 q 518 480 581 480 q 378 410 433 480 q 328 267 328 347 q 360 167 328 207 q 454 128 392 128 "},"‘":{"x_min":133.71875,"x_max":405.9375,"ha":289,"o":"m 324 631 l 133 631 l 171 807 q 256 948 187 886 q 405 1017 325 1010 l 392 947 q 261 813 285 921 l 362 813 l 324 631 "},"ϊ":{"x_min":41.671875,"x_max":540.28125,"ha":389,"o":"m 511 810 l 381 810 l 411 952 l 540 952 l 511 810 m 247 810 l 118 810 l 147 952 l 276 952 l 247 810 m 241 0 l 41 0 l 201 748 l 401 748 l 241 0 "},"π":{"x_min":87.5,"x_max":998.609375,"ha":938,"o":"m 965 593 l 876 593 l 750 0 l 548 0 l 675 593 l 412 593 l 286 0 l 87 0 l 213 593 l 126 593 l 159 749 l 998 749 l 965 593 "},"ά":{"x_min":65.28125,"x_max":881.953125,"ha":835,"o":"m 722 0 l 530 0 l 552 101 q 434 7 498 40 q 298 -25 370 -25 q 118 59 179 -25 q 65 256 65 133 q 77 372 65 315 q 209 643 112 529 q 473 775 323 775 q 593 743 540 775 q 668 656 645 712 l 687 749 l 881 749 l 722 0 m 490 601 q 347 527 408 601 q 276 375 295 464 q 268 303 268 339 q 294 194 268 235 q 388 144 326 144 q 534 217 472 144 q 606 370 587 280 q 613 416 612 402 q 613 439 613 431 q 587 551 613 510 q 490 601 555 601 m 801 1039 l 554 823 l 455 823 l 623 1039 l 801 1039 "},"O":{"x_min":93,"x_max":1118,"ha":1094,"o":"m 491 -29 q 194 83 301 -29 q 93 369 93 190 q 108 505 93 431 q 320 883 156 733 q 719 1040 493 1040 q 1016 926 909 1040 q 1118 640 1118 819 q 1113 574 1118 611 q 1102 505 1109 538 q 888 127 1052 277 q 491 -29 716 -29 m 530 154 q 768 266 665 154 q 888 506 859 366 q 900 605 900 559 q 848 781 900 715 q 680 857 790 857 q 441 747 543 857 q 321 506 351 649 q 310 408 310 454 q 361 230 310 297 q 530 154 419 154 "},"n":{"x_min":0,"x_max":786.109375,"ha":782,"o":"m 669 0 l 469 0 l 566 452 q 570 474 568 463 q 572 501 572 485 q 551 573 572 546 q 481 601 530 601 q 363 553 419 601 q 294 441 308 505 l 200 0 l 0 0 l 159 748 l 354 748 l 336 659 q 449 744 381 713 q 581 775 516 775 q 732 721 679 775 q 786 577 786 668 q 777 509 786 545 l 669 0 "},"3":{"x_min":115,"x_max":894,"ha":828,"o":"m 828 290 q 663 51 796 143 q 396 -32 541 -32 q 199 27 274 -32 q 115 218 115 94 q 116 256 115 243 q 124 300 117 270 l 313 300 q 309 276 310 290 q 308 252 308 262 q 344 163 308 194 q 432 132 380 132 q 549 169 498 132 q 621 282 606 211 q 626 322 626 305 q 564 412 626 386 q 434 432 519 432 l 463 568 q 598 592 545 568 q 683 701 666 626 q 686 730 686 711 q 656 801 686 774 q 580 829 626 829 q 483 791 527 829 q 410 669 431 748 l 223 669 q 377 909 256 823 q 621 986 485 986 q 814 928 735 986 q 894 772 894 870 q 893 751 894 762 q 888 719 892 740 q 829 605 874 656 q 725 522 790 559 q 806 448 779 491 q 834 345 834 405 q 828 290 834 316 "},"9":{"x_min":130,"x_max":895,"ha":828,"o":"m 874 492 q 670 90 818 232 q 389 -33 540 -33 q 204 36 278 -33 q 130 224 130 105 l 330 224 q 355 155 325 183 q 431 127 385 127 q 549 182 496 127 q 645 384 614 250 q 548 335 609 355 q 441 315 488 315 q 248 388 314 315 q 187 564 187 455 q 300 845 187 720 q 618 984 427 984 q 835 893 767 984 q 895 674 895 816 q 889 586 895 631 q 874 492 883 541 m 516 476 q 653 542 600 476 q 701 681 701 602 q 670 785 701 744 q 578 826 639 826 q 445 755 500 826 q 391 603 391 684 q 421 511 391 546 q 516 476 452 476 "},"l":{"x_min":40.671875,"x_max":455.9375,"ha":363,"o":"m 239 0 l 40 0 l 257 1013 l 455 1013 l 239 0 "},"¤":{"x_min":111.84375,"x_max":897.390625,"ha":825,"o":"m 897 792 l 736 660 q 743 624 742 633 q 744 604 744 615 q 698 459 744 526 l 798 331 l 671 224 l 567 353 q 453 330 514 330 q 349 353 393 330 l 193 224 l 111 330 l 266 459 q 261 503 261 480 q 313 658 261 585 l 209 793 l 338 898 l 446 760 q 549 776 496 776 q 600 772 578 776 q 645 760 621 768 l 812 898 l 897 792 m 521 645 q 434 610 467 645 q 401 532 401 575 q 421 481 401 501 q 481 461 441 461 q 568 495 535 461 q 602 573 602 530 q 581 624 602 604 q 521 645 561 645 "},"κ":{"x_min":0,"x_max":837.5,"ha":779,"o":"m 691 0 l 479 0 l 358 343 l 250 252 l 195 0 l 0 0 l 159 749 l 355 749 l 300 490 l 600 749 l 837 749 l 519 479 l 691 0 "},"4":{"x_min":97.609375,"x_max":862.890625,"ha":828,"o":"m 820 212 l 704 213 l 658 0 l 468 0 l 514 213 l 97 213 l 133 384 l 619 958 l 862 958 l 737 370 l 853 369 l 820 212 m 550 364 l 640 786 l 281 364 l 550 364 "},"p":{"x_min":-63.890625,"x_max":815,"ha":824,"o":"m 410 -26 q 290 4 342 -26 q 213 92 237 34 l 130 -298 l -63 -298 l 159 750 l 351 750 l 330 647 q 447 740 381 706 q 581 775 512 775 q 762 688 701 775 q 815 491 815 615 q 802 375 815 432 q 671 106 767 218 q 410 -26 559 -26 m 493 603 q 345 529 408 603 q 273 375 293 466 q 265 306 265 342 q 293 194 265 236 q 393 146 326 146 q 536 221 475 146 q 605 371 587 283 q 614 444 614 405 q 587 554 614 512 q 493 603 557 603 "},"‡":{"x_min":44.4375,"x_max":980.5625,"ha":894,"o":"m 431 622 l 133 622 l 172 804 l 470 804 l 515 1011 l 725 1011 l 680 804 l 980 804 l 941 622 l 641 622 l 591 387 l 891 387 l 852 205 l 552 205 l 508 0 l 298 0 l 343 205 l 44 205 l 83 387 l 381 387 l 431 622 "},"ψ":{"x_min":70.828125,"x_max":1034.71875,"ha":979,"o":"m 552 142 q 695 241 638 160 q 745 352 733 294 l 830 748 l 1034 748 l 961 402 q 836 134 926 240 q 520 -22 719 -1 l 465 -278 l 288 -278 l 344 -22 q 126 80 194 -5 q 70 269 70 151 q 86 402 70 334 l 159 748 l 363 748 l 279 352 q 275 305 275 335 q 295 208 275 248 q 383 142 322 156 l 550 922 l 722 922 l 552 142 "},"η":{"x_min":0,"x_max":781.953125,"ha":779,"o":"m 609 -278 l 409 -278 l 552 390 q 559 425 554 395 q 563 483 563 455 q 545 568 563 536 q 477 605 523 605 q 363 554 418 605 q 295 441 309 502 l 201 0 l 0 0 l 159 748 l 361 748 l 343 665 q 461 744 395 714 q 588 774 526 774 q 734 712 683 774 q 781 562 781 655 q 773 484 781 525 l 609 -278 "}},"cssFontWeight":"bold","ascender":1216,"underlinePosition":-100,"cssFontStyle":"italic","boundingBox":{"yMin":-333,"xMin":-111.109375,"yMax":1216.03125,"xMax":1738},"resolution":1000,"original_font_information":{"postscript_name":"Helvetiker-BoldOblique","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Helvetiker BoldOblique","font_family_name":"Helvetiker","copyright":"Copyright (c) Magenta ltd, 2004.","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta ltd:Helvetiker BoldOblique:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta ltd","font_sub_family_name":"BoldOblique"},"descender":-334,"familyName":"Helvetiker","lineHeight":1549,"underlineThickness":50});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":68,"x_max":802,"ha":815,"o":"m 351 -25 q 138 58 215 -25 q 68 265 68 136 q 79 368 68 312 q 230 642 113 533 q 518 761 355 761 q 731 676 654 761 q 802 466 802 597 q 790 368 802 420 q 638 91 754 201 q 351 -25 514 -25 m 374 85 q 564 175 482 85 q 662 369 637 255 q 670 449 670 409 q 629 591 670 538 q 495 651 584 651 q 308 560 388 651 q 214 369 238 483 q 206 327 209 348 q 204 287 204 306 q 242 146 204 198 q 374 85 287 85 "},"S":{"x_min":62,"x_max":916,"ha":890,"o":"m 849 291 q 674 54 817 143 q 390 -26 545 -26 q 155 46 243 -26 q 62 252 62 122 q 63 294 62 279 q 71 337 64 309 l 202 337 q 196 305 197 322 q 195 270 195 288 q 249 134 195 183 q 401 85 304 85 q 583 129 496 85 q 707 270 687 182 q 710 304 710 283 q 573 430 710 386 q 321 505 447 467 q 184 678 184 563 q 184 704 184 695 q 190 739 185 713 q 347 964 221 881 q 610 1041 464 1041 q 829 973 743 1041 q 916 788 916 906 q 907 716 916 753 l 777 716 q 781 742 780 727 q 783 770 783 758 q 732 889 783 846 q 594 933 682 933 q 432 891 507 933 q 324 759 342 841 q 322 741 323 751 q 322 727 322 731 q 459 606 322 647 q 716 536 587 570 q 856 357 856 477 q 854 325 856 343 q 849 291 853 308 "},"¦":{"x_min":290.59375,"x_max":658.5,"ha":792,"o":"m 546 462 l 441 462 l 553 986 l 658 986 l 546 462 m 395 -241 l 290 -241 l 402 280 l 507 280 l 395 -241 "},"/":{"x_min":154.796875,"x_max":829.640625,"ha":792,"o":"m 829 1041 l 237 -129 l 154 -130 l 742 1040 l 829 1041 "},"Τ":{"x_min":190.28125,"x_max":994.453125,"ha":839,"o":"m 968 893 l 648 893 l 458 0 l 319 0 l 509 892 l 190 892 l 216 1013 l 994 1013 l 968 893 "},"y":{"x_min":40.296875,"x_max":841.734375,"ha":771,"o":"m 841 738 l 370 -83 q 263 -216 320 -166 q 113 -279 191 -279 q 40 -266 73 -279 l 65 -149 q 90 -155 69 -150 q 133 -160 112 -160 q 216 -114 180 -160 q 269 -26 227 -100 l 156 738 l 294 738 l 372 140 l 705 737 l 841 738 "},"Π":{"x_min":0,"x_max":1019.453125,"ha":917,"o":"m 802 0 l 666 0 l 855 886 l 329 886 l 140 0 l 0 0 l 216 1012 l 1019 1012 l 802 0 "},"ΐ":{"x_min":59.71875,"x_max":536.109375,"ha":361,"o":"m 509 800 l 400 800 l 426 925 l 536 925 l 509 800 m 169 800 l 59 800 l 86 925 l 195 925 l 169 800 m 283 3 q 231 -9 258 -3 q 179 -15 204 -15 q 96 16 120 -15 q 72 105 72 48 q 74 148 72 132 q 84 200 76 164 l 198 737 l 323 737 l 213 215 q 206 180 209 198 q 202 150 202 162 q 212 114 202 126 q 248 101 222 101 q 281 105 265 101 q 306 112 297 110 l 283 3 m 525 1040 l 288 819 l 205 819 l 387 1040 l 525 1040 "},"g":{"x_min":11,"x_max":842.953125,"ha":838,"o":"m 692 34 q 540 -213 659 -121 q 266 -306 422 -306 q 92 -261 165 -306 q 11 -121 11 -210 q 11 -85 11 -97 l 137 -84 q 188 -173 137 -140 q 301 -207 239 -207 q 490 -109 410 -207 q 584 89 554 -31 q 463 6 529 36 q 330 -23 397 -23 q 133 64 204 -23 q 68 272 68 146 q 79 370 68 318 q 223 634 111 520 q 492 758 345 758 q 613 729 561 758 q 701 644 665 700 l 720 737 l 842 737 l 692 34 m 661 367 q 669 448 669 408 q 630 591 669 538 q 497 652 586 652 q 310 561 390 652 q 214 369 239 481 q 206 288 206 328 q 246 146 206 200 q 379 85 292 85 q 566 176 486 85 q 661 367 636 255 "},"²":{"x_min":82,"x_max":617,"ha":539,"o":"m 523 383 l 82 383 q 212 566 105 492 q 405 668 308 617 q 525 798 509 727 q 528 820 528 811 q 498 882 528 859 q 422 905 468 905 q 322 869 368 905 q 261 761 276 833 l 176 761 q 279 922 198 864 q 440 974 350 974 q 566 936 515 974 q 617 832 617 899 q 612 797 617 817 q 487 635 593 706 q 298 539 453 613 q 189 455 198 492 l 538 455 l 523 383 "},"–":{"x_min":72.21875,"x_max":793.0625,"ha":803,"o":"m 777 334 l 72 334 l 87 410 l 793 410 l 777 334 "},"Κ":{"x_min":0,"x_max":1026.390625,"ha":893,"o":"m 819 0 l 650 0 l 402 509 l 215 356 l 138 0 l 0 0 l 216 1013 l 355 1013 l 251 526 l 843 1013 l 1026 1013 l 523 600 l 819 0 "},"ƒ":{"x_min":-104.828125,"x_max":613.5,"ha":513,"o":"m 531 651 l 399 651 l 20 -278 l -104 -278 l 274 651 l 153 651 l 176 751 l 296 751 q 355 948 328 900 q 527 1041 407 1041 q 567 1039 552 1041 q 613 1034 582 1038 l 589 922 q 537 931 560 931 q 459 883 487 931 q 430 793 441 853 l 421 751 l 553 751 l 531 651 "},"e":{"x_min":66,"x_max":798,"ha":813,"o":"m 782 326 l 208 326 q 206 304 207 314 q 206 280 206 294 q 246 145 206 196 q 376 87 292 87 q 515 130 449 87 q 613 245 581 174 l 749 245 q 587 47 696 121 q 352 -26 478 -26 q 140 54 214 -26 q 66 265 66 134 q 77 363 66 308 q 231 642 111 529 q 521 765 359 765 q 732 673 660 765 q 798 455 798 591 q 793 392 798 427 q 782 326 789 357 m 667 429 q 669 456 669 438 q 623 595 669 540 q 493 650 577 650 q 329 583 403 650 q 231 429 264 523 l 667 429 "},"ό":{"x_min":68,"x_max":802,"ha":815,"o":"m 351 -25 q 140 55 213 -25 q 68 266 68 136 q 79 368 68 312 q 230 642 113 533 q 518 761 355 761 q 731 676 654 761 q 802 466 802 597 q 790 368 802 420 q 638 91 754 201 q 351 -25 514 -25 m 374 85 q 564 175 482 85 q 662 369 637 255 q 670 449 670 409 q 629 591 670 538 q 495 651 584 651 q 308 560 388 651 q 214 369 238 483 q 206 327 209 348 q 204 287 204 306 q 242 146 204 198 q 374 85 287 85 m 798 1040 l 561 819 l 478 819 l 660 1040 l 798 1040 "},"J":{"x_min":53,"x_max":804,"ha":699,"o":"m 647 279 q 282 -26 583 -26 q 102 32 158 -26 q 53 187 53 83 q 69 327 53 250 l 202 327 q 194 279 198 309 q 191 230 191 250 q 214 136 191 168 q 310 96 243 96 q 462 170 412 96 q 520 336 494 219 l 665 1013 l 804 1013 l 647 279 "},"»":{"x_min":29.375,"x_max":598.609375,"ha":601,"o":"m 569 302 l 311 136 l 338 255 l 508 371 l 386 486 l 412 608 l 598 440 l 569 302 m 287 302 l 29 136 l 56 256 l 225 372 l 104 486 l 130 608 l 316 440 l 287 302 "},"©":{"x_min":91,"x_max":1129,"ha":1106,"o":"m 500 -7 q 189 109 299 -7 q 91 383 91 215 q 259 805 91 617 q 719 1011 442 1011 q 1030 894 921 1011 q 1129 619 1129 788 q 962 198 1129 384 q 500 -7 778 -7 m 514 60 q 913 239 753 60 q 1058 604 1058 401 q 973 842 1058 751 q 703 944 878 944 q 305 764 465 944 q 160 398 160 601 q 244 161 160 252 q 514 60 339 60 m 826 394 q 713 246 795 302 q 536 190 631 190 q 377 253 431 190 q 324 416 324 317 q 418 680 324 561 q 672 813 522 813 q 810 768 754 813 q 867 647 867 723 q 867 625 867 633 l 767 625 q 735 704 767 673 q 654 735 703 735 q 491 632 558 735 q 432 429 432 540 q 461 315 432 359 q 547 272 490 272 q 654 304 607 272 q 722 394 700 337 l 826 394 "},"ώ":{"x_min":63,"x_max":1006,"ha":1031,"o":"m 910 1040 l 674 819 l 590 819 l 772 1040 l 910 1040 m 994 339 q 878 97 965 203 q 644 -26 773 -26 q 540 9 582 -26 q 483 103 499 44 q 390 12 446 46 q 274 -22 335 -22 q 111 59 167 -22 q 63 243 63 130 q 73 338 63 295 q 164 551 95 444 q 318 737 224 644 l 460 737 q 293 552 360 648 q 197 336 219 444 q 187 251 187 294 q 209 140 187 182 q 293 88 236 88 q 410 163 360 88 q 463 294 447 219 l 522 572 l 646 572 l 586 294 q 578 213 578 258 q 596 123 578 158 q 661 88 615 88 q 801 182 737 88 q 871 341 851 255 q 881 433 881 386 q 853 588 881 515 q 776 737 826 661 l 918 737 q 982 590 958 665 q 1006 438 1006 516 q 994 339 1006 394 "},"^":{"x_min":358.328125,"x_max":763.890625,"ha":792,"o":"m 763 772 l 680 772 l 594 931 l 443 772 l 358 772 l 543 1013 l 679 1013 l 763 772 "},"«":{"x_min":65.28125,"x_max":637.5,"ha":604,"o":"m 536 136 l 348 302 l 377 440 l 637 608 l 610 486 l 438 373 l 562 257 l 536 136 m 251 136 l 65 302 l 94 440 l 352 608 l 326 486 l 153 372 l 277 256 l 251 136 "},"D":{"x_min":0,"x_max":954,"ha":935,"o":"m 605 1013 q 867 910 774 1013 q 954 653 954 814 q 949 589 954 625 q 938 521 945 554 q 747 161 892 309 q 381 0 587 0 l 0 0 l 216 1013 l 605 1013 m 402 124 q 659 247 549 124 q 788 510 755 355 q 801 619 801 564 q 746 812 801 739 q 567 896 685 896 l 330 895 l 165 123 l 402 124 "},"∙":{"x_min":125,"x_max":297.9375,"ha":239,"o":"m 266 585 l 125 585 l 156 738 l 297 738 l 266 585 "},"ÿ":{"x_min":3,"x_max":48.828125,"ha":125,"o":"m 47 0 q 36 -7 46 -7 q 28 0 28 -7 q 37 -4 30 -4 q 45 2 45 -1 l 37 0 q 30 9 29 0 q 45 19 32 19 l 48 15 l 48 19 l 47 0 m 37 1 q 47 8 45 1 q 45 16 50 16 q 32 8 34 16 q 37 1 29 1 m 27 0 l 28 25 l 14 0 l 7 22 l 3 0 l 5 25 l 15 1 l 28 25 l 27 0 "},"w":{"x_min":156.9375,"x_max":1166.671875,"ha":1100,"o":"m 1166 738 l 783 0 l 658 0 l 622 567 l 345 0 l 222 0 l 156 738 l 287 738 l 322 175 l 588 738 l 733 738 l 758 173 l 1037 738 l 1166 738 "},"$":{"x_min":54,"x_max":821,"ha":793,"o":"m 816 718 l 695 718 q 664 826 695 787 q 566 872 634 865 l 498 551 q 696 470 629 526 q 764 323 764 413 q 751 241 764 286 q 622 45 715 115 q 374 -25 530 -25 l 348 -152 l 274 -152 l 301 -25 q 118 37 183 -25 q 54 207 54 99 q 55 250 54 235 q 63 297 56 265 l 187 297 q 181 267 182 283 q 180 233 180 250 q 215 126 180 167 q 323 81 251 86 l 401 441 q 215 513 274 465 q 157 644 157 562 q 158 684 157 670 q 168 725 159 697 q 293 910 197 838 q 516 982 390 982 l 537 1077 l 610 1077 l 590 982 q 751 930 688 982 q 821 770 821 873 q 816 718 821 745 m 427 565 l 492 872 q 366 831 419 872 q 297 724 314 791 q 292 680 292 702 q 427 565 292 588 m 397 76 q 614 237 572 95 q 621 288 621 259 q 471 423 621 398 l 397 76 "},"\\":{"x_min":222.3125,"x_max":397.328125,"ha":522,"o":"m 397 -129 l 310 -129 l 222 1041 l 305 1041 l 397 -129 "},"µ":{"x_min":-58.71875,"x_max":774.609375,"ha":747,"o":"m 696 -4 q 662 -11 678 -8 q 627 -14 645 -14 q 520 97 520 -14 q 426 8 480 40 q 309 -23 371 -23 q 209 4 252 -23 q 137 80 166 32 l 60 -278 l -58 -278 l 157 738 l 281 737 l 198 343 q 189 262 189 305 q 219 139 189 185 q 327 83 255 83 q 491 178 420 83 q 570 358 548 255 l 650 738 l 774 738 l 663 213 q 657 181 660 200 q 655 147 655 162 q 663 106 655 121 q 695 92 671 92 q 719 96 703 92 l 696 -4 "},"Ι":{"x_min":41.671875,"x_max":397.21875,"ha":297,"o":"m 180 0 l 41 0 l 258 1013 l 397 1013 l 180 0 "},"Ύ":{"x_min":170.828125,"x_max":1361.109375,"ha":1214,"o":"m 1361 1012 l 895 416 l 806 0 l 666 0 l 755 416 l 541 1012 l 681 1012 l 850 533 l 1220 1012 l 1361 1012 m 500 1040 l 254 799 l 170 799 l 362 1040 l 500 1040 "},"’":{"x_min":143.0625,"x_max":355.5625,"ha":236,"o":"m 320 851 q 259 737 306 785 q 143 669 211 689 l 156 734 q 227 787 201 741 q 258 873 247 819 l 186 872 l 216 1013 l 355 1013 l 320 851 "},"Ν":{"x_min":0,"x_max":1018.0625,"ha":915,"o":"m 801 0 l 651 0 l 306 822 l 130 0 l 0 0 l 216 1013 l 368 1013 l 711 191 l 887 1013 l 1018 1013 l 801 0 "},"-":{"x_min":77.78125,"x_max":443.0625,"ha":478,"o":"m 419 317 l 77 317 l 101 428 l 443 428 l 419 317 "},"Q":{"x_min":93,"x_max":1092,"ha":1072,"o":"m 955 5 l 871 -78 l 753 36 q 620 -11 689 3 q 477 -26 551 -26 q 190 85 293 -26 q 93 366 93 190 q 108 504 93 430 q 315 880 155 728 q 707 1041 484 1041 q 996 929 894 1041 q 1092 649 1092 825 q 1089 578 1092 607 q 1076 507 1086 549 q 997 291 1052 394 q 855 104 941 187 l 955 5 m 763 191 q 875 336 828 247 q 935 500 915 414 q 948 620 948 561 q 885 833 948 754 q 680 922 815 922 q 395 791 518 922 q 249 505 284 673 q 237 390 237 447 q 301 179 237 260 q 506 91 371 91 q 660 124 586 91 l 566 215 l 651 301 l 763 191 "},"ς":{"x_min":72,"x_max":779,"ha":740,"o":"m 775 460 l 650 460 q 651 478 651 469 q 651 492 651 488 q 614 607 651 564 q 503 651 578 651 q 324 577 403 651 q 222 401 244 503 q 214 327 214 359 q 322 169 214 217 q 524 110 423 139 q 633 -8 633 74 q 628 -50 633 -26 q 587 -166 617 -104 q 523 -278 566 -211 l 405 -278 q 472 -158 459 -186 q 498 -80 490 -121 q 499 -62 499 -73 q 390 12 499 -12 q 183 73 227 48 q 72 276 72 135 q 74 331 72 313 q 84 388 76 348 q 240 651 117 541 q 516 761 363 761 q 710 696 642 761 q 779 517 779 632 q 775 460 779 489 "},"M":{"x_min":0,"x_max":1170.828125,"ha":1067,"o":"m 954 0 l 820 0 l 1005 868 l 537 0 l 405 0 l 313 865 l 127 0 l 0 0 l 216 1013 l 416 1012 l 505 157 l 975 1012 l 1170 1013 l 954 0 "},"Ψ":{"x_min":121,"x_max":1222.71875,"ha":1094,"o":"m 1150 678 q 982 319 1097 429 q 614 200 857 200 l 571 0 l 433 0 l 476 200 q 205 271 289 200 q 121 491 121 343 q 144 678 121 571 l 217 1013 l 356 1013 l 283 679 q 267 590 272 627 q 263 517 263 552 q 314 376 263 420 q 503 326 371 326 l 650 1013 l 788 1013 l 640 326 l 650 326 q 904 423 817 326 q 1013 679 975 502 l 1085 1013 l 1222 1013 l 1150 678 "},"C":{"x_min":91,"x_max":1034,"ha":944,"o":"m 966 379 q 779 88 929 202 q 449 -26 628 -26 q 177 83 270 -26 q 91 355 91 184 q 107 509 91 430 q 306 882 157 737 q 690 1041 468 1041 q 929 967 832 1041 q 1034 758 1034 888 q 1029 708 1034 733 l 896 708 q 832 862 896 805 q 669 920 769 920 q 387 791 508 920 q 243 509 279 675 q 231 397 231 452 q 292 187 231 266 q 490 99 360 99 q 703 178 610 99 q 832 379 796 257 l 966 379 "},"!":{"x_min":0,"x_max":355.796875,"ha":236,"o":"m 284 684 q 226 466 266 597 q 158 244 191 355 l 86 244 q 111 465 102 389 q 145 684 126 594 l 216 1013 l 355 1012 l 284 684 m 139 0 l 0 0 l 31 151 l 170 150 l 139 0 "},"{":{"x_min":66,"x_max":696.546875,"ha":578,"o":"m 418 -286 q 216 -240 275 -286 q 166 -123 166 -201 q 200 40 166 -70 q 235 195 235 151 q 200 280 235 252 q 66 314 158 314 l 88 417 q 321 571 275 417 q 385 859 353 715 q 696 1015 454 1015 l 675 915 q 478 797 520 915 q 433 557 456 676 q 253 365 394 409 q 333 308 311 344 q 356 218 356 272 q 327 66 356 169 q 298 -76 298 -36 q 329 -154 298 -127 q 441 -182 360 -182 l 418 -286 "},"X":{"x_min":0,"x_max":1052.828125,"ha":940,"o":"m 854 0 l 683 0 l 511 409 l 167 0 l 0 0 l 457 520 l 234 1013 l 402 1012 l 563 638 l 891 1013 l 1052 1012 l 615 520 l 854 0 "},"#":{"x_min":65.671875,"x_max":1110.109375,"ha":1061,"o":"m 1110 690 l 1053 590 l 844 590 l 741 410 l 962 410 l 905 310 l 683 310 l 507 -3 l 394 -3 l 572 309 l 395 309 l 215 -3 l 101 -3 l 278 310 l 65 310 l 122 410 l 336 410 l 438 590 l 211 590 l 267 690 l 494 690 l 674 1006 l 787 1006 l 609 690 l 787 690 l 965 1005 l 1079 1006 l 901 690 l 1110 690 m 732 590 l 550 590 l 449 409 l 629 409 l 732 590 "},"ι":{"x_min":72.21875,"x_max":323.609375,"ha":361,"o":"m 283 3 q 231 -9 258 -3 q 179 -15 204 -15 q 96 16 120 -15 q 72 105 72 48 q 74 148 72 132 q 84 200 76 164 l 198 738 l 323 738 l 213 215 q 206 180 209 198 q 202 150 202 162 q 212 114 202 126 q 248 101 222 101 q 281 105 265 101 q 306 112 297 110 l 283 3 "},"Ά":{"x_min":0,"x_max":906.953125,"ha":982,"o":"m 505 1040 l 259 799 l 176 799 l 368 1040 l 505 1040 m 906 0 l 756 0 l 715 303 l 316 303 l 143 0 l 0 0 l 593 1012 l 745 1012 l 906 0 m 700 421 l 637 866 l 383 421 l 700 421 "},")":{"x_min":-61.5,"x_max":419,"ha":415,"o":"m 396 365 q 260 19 359 191 q 25 -290 167 -141 l -61 -290 q 146 21 68 -126 q 270 360 234 186 q 298 605 298 485 q 278 808 298 710 q 219 1024 259 907 l 306 1024 q 390 805 362 915 q 419 572 419 696 q 396 365 419 468 "},"ε":{"x_min":38.78125,"x_max":704,"ha":714,"o":"m 684 234 q 530 38 648 110 q 294 -25 424 -25 q 120 19 192 -25 q 38 159 38 70 q 42 204 38 180 q 104 314 56 265 q 212 390 142 353 q 161 449 180 414 q 141 525 141 485 q 144 555 141 536 q 266 712 165 655 q 458 763 354 763 q 633 709 563 763 q 704 561 704 655 q 699 515 704 540 l 589 515 q 552 618 589 580 q 448 657 515 657 q 343 630 395 657 q 268 547 279 598 q 265 522 265 527 q 345 444 265 462 q 483 434 389 434 l 461 331 l 420 331 q 273 315 325 331 q 169 210 186 287 q 166 184 166 191 q 215 102 166 132 q 319 76 258 76 q 462 116 397 76 q 559 234 527 157 l 684 234 "},"Δ":{"x_min":0,"x_max":952.78125,"ha":1028,"o":"m 952 0 l 0 0 l 616 1013 l 768 1013 l 952 0 m 788 124 l 661 867 l 213 124 l 788 124 "},"}":{"x_min":-61,"x_max":569.546875,"ha":578,"o":"m 547 314 q 318 158 357 314 q 264 -130 290 14 q -61 -286 197 -286 l -38 -182 q 155 -62 112 -182 q 202 179 179 58 q 383 365 242 323 q 302 423 326 384 q 279 512 279 461 q 308 665 279 562 q 338 808 338 767 q 310 885 338 860 q 195 915 276 915 l 216 1015 q 419 969 360 1015 q 470 852 470 930 q 449 731 470 804 q 400 534 400 564 q 434 450 400 478 q 569 417 476 417 l 547 314 "},"‰":{"x_min":144,"x_max":1730,"ha":1821,"o":"m 845 0 q 695 55 748 0 q 648 187 648 105 q 728 390 648 300 q 949 489 816 489 q 1099 433 1048 489 q 1147 300 1147 383 q 1066 98 1147 188 q 845 0 977 0 m 866 103 q 987 157 939 103 q 1036 278 1036 212 q 1010 353 1036 325 q 925 385 981 385 q 804 330 852 385 q 756 209 756 275 q 783 132 756 162 q 866 103 810 103 m 1099 986 l 278 -26 l 193 -25 l 1014 986 l 1099 986 m 341 468 q 191 524 243 468 q 144 659 144 576 q 223 860 144 772 q 442 958 309 958 q 592 902 539 958 q 641 769 641 851 q 561 566 641 655 q 341 468 474 468 m 424 855 q 297 799 346 855 q 248 678 248 744 q 276 601 248 631 q 361 572 304 572 q 491 628 439 572 q 537 745 537 680 q 509 824 537 793 q 424 855 481 855 m 1428 0 q 1279 55 1331 0 q 1232 187 1232 105 q 1312 390 1232 300 q 1533 489 1399 489 q 1682 433 1631 489 q 1730 300 1730 383 q 1649 98 1730 188 q 1428 0 1560 0 m 1449 103 q 1571 157 1523 103 q 1619 278 1619 212 q 1594 353 1619 325 q 1509 385 1564 385 q 1387 330 1435 385 q 1340 209 1340 275 q 1367 132 1340 162 q 1449 103 1394 103 "},"a":{"x_min":34,"x_max":735,"ha":794,"o":"m 697 0 q 610 -17 650 -17 q 540 12 560 -17 q 520 96 520 41 q 384 6 463 38 q 229 -25 306 -25 q 86 17 139 -25 q 34 138 34 59 q 40 194 34 162 q 202 390 70 333 q 421 435 271 420 q 589 483 571 451 q 599 504 595 494 q 606 526 603 513 q 609 547 609 540 q 565 625 609 597 q 464 654 522 654 q 340 616 396 654 q 261 513 284 579 l 142 513 q 272 703 171 634 q 496 772 372 772 q 662 724 597 772 q 735 581 735 671 q 735 552 735 566 q 729 531 730 537 l 650 163 q 645 124 645 135 q 652 99 645 108 q 682 90 660 90 l 718 94 l 697 0 m 545 262 l 568 372 q 404 341 546 363 q 169 201 193 308 q 167 173 167 181 q 198 105 167 128 q 280 83 229 83 q 440 130 363 83 q 545 262 528 184 "},"—":{"x_min":72.21875,"x_max":1029.171875,"ha":1039,"o":"m 1013 334 l 72 334 l 87 410 l 1029 410 l 1013 334 "},"=":{"x_min":58.71875,"x_max":910.109375,"ha":792,"o":"m 889 510 l 117 510 l 137 606 l 910 606 l 889 510 m 830 235 l 58 235 l 79 332 l 851 332 l 830 235 "},"N":{"x_min":0,"x_max":1018.0625,"ha":914,"o":"m 801 0 l 651 0 l 306 823 l 130 0 l 0 0 l 216 1013 l 368 1013 l 711 190 l 887 1013 l 1018 1013 l 801 0 "},"ρ":{"x_min":-59.5,"x_max":803,"ha":797,"o":"m 791 369 q 640 94 757 207 q 357 -26 516 -26 q 230 3 287 -26 q 137 83 173 32 l 59 -278 l -59 -278 l 78 362 q 230 643 114 530 q 519 764 355 764 q 732 679 655 764 q 803 471 803 601 q 791 369 803 425 m 661 366 q 668 408 665 387 q 671 449 671 429 q 630 589 671 535 q 498 651 584 651 q 309 562 390 651 q 214 370 239 484 q 205 288 205 329 q 244 146 205 198 q 377 85 289 85 q 566 175 484 85 q 661 366 637 254 "},"2":{"x_min":59,"x_max":887,"ha":792,"o":"m 731 0 l 59 0 q 265 314 99 187 q 561 487 270 316 q 744 691 721 580 q 749 732 749 712 q 705 831 749 796 q 596 867 662 867 q 446 811 514 867 q 343 630 368 747 l 215 630 q 375 901 253 804 q 618 986 482 986 q 809 924 731 986 q 887 755 887 862 q 886 734 887 744 q 880 694 885 724 q 710 449 846 541 q 445 316 577 383 q 227 122 286 234 l 757 122 l 731 0 "},"¯":{"x_min":220.828125,"x_max":1179.171875,"ha":938,"o":"m 1162 1033 l 220 1033 l 237 1109 l 1179 1109 l 1162 1033 "},"Z":{"x_min":0,"x_max":995.828125,"ha":849,"o":"m 779 0 l 0 0 l 24 113 l 812 896 l 231 896 l 256 1013 l 995 1013 l 969 887 l 199 124 l 805 124 l 779 0 "},"u":{"x_min":46,"x_max":773.515625,"ha":729,"o":"m 616 0 l 498 0 l 522 110 q 393 11 470 47 q 240 -25 316 -25 q 94 29 143 -25 q 46 173 46 83 q 47 215 46 200 q 55 258 48 230 l 156 738 l 281 738 l 185 284 q 178 215 178 251 q 205 119 178 157 q 291 82 232 82 q 469 165 387 82 q 565 340 544 241 l 649 738 l 773 738 l 616 0 "},"k":{"x_min":0.15625,"x_max":770.921875,"ha":697,"o":"m 770 738 l 438 465 l 608 0 l 468 0 l 332 382 l 174 252 l 120 0 l 0 0 l 216 1012 l 337 1013 l 207 402 l 615 738 l 770 738 "},"Η":{"x_min":0,"x_max":1019.453125,"ha":917,"o":"m 802 0 l 666 0 l 768 475 l 241 475 l 140 0 l 0 0 l 216 1013 l 356 1013 l 268 599 l 794 599 l 883 1013 l 1019 1013 l 802 0 "},"Α":{"x_min":0,"x_max":906.953125,"ha":985,"o":"m 906 0 l 756 0 l 715 303 l 316 303 l 143 0 l 0 0 l 593 1013 l 745 1013 l 906 0 m 700 421 l 637 866 l 383 421 l 700 421 "},"s":{"x_min":44,"x_max":702,"ha":697,"o":"m 649 217 q 509 36 625 104 q 287 -23 406 -23 q 111 28 178 -23 q 44 175 44 79 q 44 195 44 186 q 50 238 44 204 l 171 238 q 168 203 168 218 q 209 115 168 146 q 317 85 251 85 q 439 112 382 85 q 522 207 508 146 q 524 218 524 212 q 524 226 524 223 q 426 309 524 282 q 234 365 328 337 q 132 497 132 409 q 132 516 132 508 q 137 544 132 523 q 262 708 159 648 q 460 761 352 761 q 627 716 560 761 q 702 579 702 666 q 702 551 702 565 q 696 532 697 537 l 575 532 q 578 558 578 551 q 536 632 578 607 q 438 657 495 657 q 334 636 381 657 q 262 558 273 609 q 260 536 260 541 q 357 454 260 480 q 551 403 455 428 q 655 268 655 360 q 655 237 655 253 q 649 217 650 222 "},"B":{"x_min":0,"x_max":901,"ha":876,"o":"m 697 546 q 810 488 770 536 q 850 368 850 440 q 844 311 850 337 q 691 83 813 171 q 431 0 575 0 l 0 0 l 216 1013 l 627 1013 q 816 968 742 1013 q 901 819 901 917 q 901 789 901 804 q 895 768 896 774 q 826 633 880 693 q 697 546 772 572 m 584 899 l 330 899 l 263 588 l 504 588 q 654 624 587 588 q 751 744 733 667 q 754 775 754 756 q 702 866 754 833 q 584 899 651 899 m 445 124 q 602 169 530 124 q 699 303 681 219 q 704 338 704 322 q 640 445 704 407 q 503 477 585 477 l 240 477 l 164 124 l 445 124 "},"…":{"x_min":0,"x_max":644.84375,"ha":708,"o":"m 141 0 l 0 0 l 31 151 l 173 151 l 141 0 m 376 0 l 235 0 l 267 151 l 408 151 l 376 0 m 612 0 l 471 0 l 503 151 l 644 151 l 612 0 "},"?":{"x_min":151.390625,"x_max":779,"ha":704,"o":"m 773 777 q 667 599 751 676 q 517 474 592 537 q 415 272 434 391 l 294 272 q 394 487 315 396 q 540 619 400 494 q 636 762 621 691 q 641 803 641 785 q 602 897 641 862 q 507 933 564 933 q 373 880 435 933 q 275 706 304 819 l 151 706 q 299 963 186 873 q 524 1044 401 1044 q 704 984 630 1044 q 779 830 779 925 q 778 809 779 820 q 773 777 777 798 m 369 0 l 230 0 l 262 151 l 401 150 l 369 0 "},"H":{"x_min":0.1875,"x_max":1020.328125,"ha":915,"o":"m 803 0 l 667 0 l 769 475 l 242 475 l 141 0 l 0 0 l 216 1013 l 357 1013 l 269 599 l 795 599 l 884 1013 l 1020 1013 l 803 0 "},"ν":{"x_min":156.9375,"x_max":831.953125,"ha":761,"o":"m 831 738 l 404 0 l 272 0 l 156 738 l 290 738 l 372 147 l 698 738 l 831 738 "},"c":{"x_min":68,"x_max":796,"ha":775,"o":"m 758 264 q 595 53 711 133 q 348 -26 480 -26 q 139 53 211 -26 q 68 262 68 132 q 80 370 68 314 q 230 645 116 538 q 516 761 352 761 q 718 688 641 761 q 796 493 796 615 l 663 493 q 615 606 663 562 q 496 650 567 650 q 308 563 386 650 q 213 372 238 487 q 206 330 209 351 q 204 289 204 310 q 244 149 204 203 q 377 88 290 88 q 521 136 455 88 q 623 264 587 185 l 758 264 "},"¶":{"x_min":168,"x_max":791.609375,"ha":678,"o":"m 211 892 l 242 892 l 261 761 l 336 892 l 366 891 l 334 741 l 313 741 l 341 866 l 267 739 l 246 741 l 226 871 l 197 741 l 177 741 l 211 892 m 492 854 l 464 730 q 403 691 456 691 q 378 691 390 691 q 360 696 366 695 l 362 713 l 405 706 q 444 733 436 706 l 451 763 q 402 741 435 741 q 362 778 362 741 q 363 797 362 790 q 445 860 375 860 q 463 860 455 860 q 492 854 471 860 m 469 841 l 444 843 q 381 796 393 843 q 380 782 380 790 q 409 756 380 756 q 458 796 448 756 l 469 841 m 777 988 l 713 988 l 502 -1 l 439 -1 l 650 988 l 527 988 l 316 -1 l 253 -1 l 381 601 q 220 653 284 601 q 168 764 168 697 q 172 805 168 784 q 312 989 194 918 q 534 1053 420 1053 l 791 1053 l 777 988 "},"β":{"x_min":-59.328125,"x_max":774,"ha":745,"o":"m 589 550 q 692 474 657 528 q 726 347 726 421 q 719 280 726 308 q 592 64 692 151 q 364 -22 493 -22 q 241 5 296 -22 q 144 82 186 32 l 67 -278 l -59 -278 l 126 593 q 247 903 171 800 q 540 1042 351 1042 q 708 982 642 1042 q 774 826 774 922 q 768 771 774 797 q 705 644 753 701 q 589 550 657 586 m 354 79 q 506 138 434 79 q 594 279 578 198 q 598 319 598 299 q 507 445 598 404 q 329 477 436 477 l 351 583 q 530 620 454 583 q 648 762 629 668 q 653 798 653 782 q 613 896 653 858 q 512 935 573 935 q 353 861 418 935 q 275 698 297 798 l 204 362 q 193 259 193 306 q 228 131 193 177 q 354 79 268 79 "},"Μ":{"x_min":0,"x_max":1170.828125,"ha":1068,"o":"m 954 0 l 819 0 l 1005 868 l 537 0 l 405 0 l 312 865 l 127 0 l 0 0 l 216 1013 l 416 1013 l 505 158 l 975 1013 l 1170 1013 l 954 0 "},"Ό":{"x_min":170.65625,"x_max":1243,"ha":1217,"o":"m 1227 505 q 1023 132 1179 282 q 636 -29 855 -29 q 354 84 455 -29 q 260 365 260 191 q 264 432 260 394 q 275 505 268 469 q 483 883 323 730 q 873 1046 652 1046 q 1152 930 1054 1046 q 1243 650 1243 825 q 1238 580 1243 618 q 1227 505 1234 543 m 1084 504 q 1097 619 1097 562 q 1037 826 1097 748 q 840 915 969 915 q 559 785 680 915 q 415 504 451 670 q 403 391 403 447 q 465 183 403 262 q 665 95 536 95 q 942 224 823 95 q 1084 504 1048 339 m 499 1040 l 254 799 l 170 799 l 362 1040 l 499 1040 "},"Ή":{"x_min":170.828125,"x_max":1375,"ha":1275,"o":"m 1158 0 l 1022 0 l 1123 475 l 597 475 l 495 0 l 355 0 l 572 1012 l 712 1012 l 623 599 l 1150 599 l 1238 1012 l 1375 1012 l 1158 0 m 500 1040 l 254 799 l 170 799 l 362 1040 l 500 1040 "},"•":{"x_min":104.5625,"x_max":783.71875,"ha":775,"o":"m 775 529 q 628 294 746 393 q 372 196 510 196 q 158 293 235 196 q 104 457 104 363 q 105 492 104 473 q 111 529 107 511 q 258 763 140 665 q 514 861 376 861 q 728 762 654 861 q 783 600 783 690 q 775 529 783 566 "},"¥":{"x_min":190.28125,"x_max":1036.125,"ha":886,"o":"m 683 561 l 816 561 l 800 487 l 625 487 l 570 416 l 563 380 l 779 380 l 761 308 l 547 307 l 482 0 l 341 0 l 406 308 l 190 308 l 206 380 l 423 380 l 430 417 l 406 487 l 229 487 l 244 561 l 378 561 l 217 1013 l 356 1013 l 525 533 l 895 1013 l 1036 1012 l 683 561 "},"(":{"x_min":55,"x_max":535.109375,"ha":415,"o":"m 254 -290 l 167 -290 q 84 -71 114 -187 q 55 162 55 44 q 77 365 55 264 q 213 712 114 542 q 447 1024 302 867 l 535 1024 q 325 705 403 857 q 200 360 239 539 q 176 125 176 236 q 195 -81 176 21 q 254 -290 215 -184 "},"U":{"x_min":72,"x_max":1013.328125,"ha":904,"o":"m 880 392 q 702 93 842 212 q 380 -25 561 -25 q 151 60 231 -25 q 72 284 72 145 q 73 339 72 322 q 84 392 75 356 l 217 1012 l 354 1013 l 220 391 q 212 318 212 354 q 264 165 212 223 q 416 107 316 107 q 624 189 534 107 q 738 391 713 272 l 872 1013 l 1013 1012 l 880 392 "},"γ":{"x_min":138.890625,"x_max":901.390625,"ha":822,"o":"m 901 737 l 473 54 l 402 -278 l 277 -278 l 348 54 l 259 495 q 233 597 244 573 q 152 651 206 651 l 138 651 l 161 751 l 200 753 q 319 711 280 753 q 368 594 352 676 l 447 208 l 773 737 l 901 737 "},"α":{"x_min":68,"x_max":843,"ha":808,"o":"m 763 -4 q 695 -14 724 -14 q 584 97 584 -14 q 467 7 533 40 q 331 -26 401 -26 q 136 60 205 -26 q 68 272 68 146 q 79 369 68 318 q 224 637 112 525 q 499 760 347 760 q 620 728 569 760 q 698 637 672 696 l 720 739 l 843 739 l 731 222 q 726 189 729 208 q 723 155 723 171 q 733 110 723 126 q 769 94 743 94 q 786 96 780 94 l 763 -4 m 662 371 q 671 453 671 412 q 632 593 671 541 q 499 653 587 653 q 311 566 392 653 q 215 379 239 490 q 206 290 206 339 q 243 146 206 199 q 376 84 287 84 q 567 176 485 84 q 662 371 637 257 "},"F":{"x_min":0,"x_max":900,"ha":717,"o":"m 873 888 l 331 888 l 265 583 l 738 583 l 712 458 l 239 458 l 141 0 l 0 0 l 216 1013 l 900 1013 l 873 888 "},"­":{"x_min":72.21875,"x_max":793.0625,"ha":803,"o":"m 777 334 l 72 334 l 87 410 l 793 410 l 777 334 "},":":{"x_min":0,"x_max":297.9375,"ha":239,"o":"m 266 585 l 125 585 l 156 738 l 297 738 l 266 585 m 141 0 l 0 0 l 31 151 l 173 151 l 141 0 "},"Χ":{"x_min":0,"x_max":1052.78125,"ha":935,"o":"m 854 0 l 683 0 l 511 409 l 166 0 l 0 0 l 458 519 l 234 1013 l 402 1013 l 563 637 l 891 1013 l 1052 1013 l 615 521 l 854 0 "},"*":{"x_min":280,"x_max":838.328125,"ha":792,"o":"m 838 768 l 629 713 l 727 544 l 621 477 l 534 653 l 375 479 l 295 544 l 468 713 l 280 766 l 341 876 l 516 812 l 559 1013 l 663 1012 l 620 811 l 823 874 l 838 768 "},"†":{"x_min":145.828125,"x_max":950,"ha":835,"o":"m 630 804 l 950 804 l 923 683 l 604 683 l 458 0 l 319 0 l 465 681 l 145 683 l 172 804 l 491 804 l 535 1015 l 675 1014 l 630 804 "},"°":{"x_min":204,"x_max":560,"ha":444,"o":"m 345 802 q 240 841 276 802 q 204 937 204 880 q 261 1081 204 1017 q 419 1153 323 1153 q 526 1112 489 1153 q 560 1016 560 1076 q 502 873 560 937 q 345 802 440 802 m 362 884 q 441 918 411 884 q 472 995 472 953 q 454 1044 472 1024 q 401 1064 436 1064 q 322 1029 352 1064 q 292 952 292 994 q 310 903 292 923 q 362 884 328 884 "},"V":{"x_min":215.671875,"x_max":1077.90625,"ha":940,"o":"m 1077 1013 l 504 0 l 360 0 l 215 1013 l 359 1013 l 468 166 l 933 1013 l 1077 1013 "},"Ξ":{"x_min":0,"x_max":940.28125,"ha":763,"o":"m 913 889 l 200 889 l 226 1013 l 940 1013 l 913 889 m 772 463 l 159 463 l 187 589 l 800 589 l 772 463 m 734 0 l 0 0 l 26 124 l 761 124 l 734 0 "}," ":{"x_min":0,"x_max":0,"ha":853},"Ϋ":{"x_min":216.671875,"x_max":1036.109375,"ha":889,"o":"m 811 1046 l 683 1046 l 713 1189 l 841 1189 l 811 1046 m 583 1046 l 455 1046 l 486 1189 l 613 1189 l 583 1046 m 1036 1012 l 570 416 l 481 0 l 341 0 l 430 416 l 216 1012 l 356 1012 l 525 533 l 895 1012 l 1036 1012 "},"0":{"x_min":155,"x_max":838,"ha":792,"o":"m 388 -29 q 210 66 271 -29 q 155 301 155 154 q 279 755 155 543 q 604 989 417 989 q 782 891 721 989 q 838 657 838 804 q 713 202 838 414 q 388 -29 575 -29 m 413 89 q 631 277 536 89 q 719 640 719 451 q 687 804 719 744 q 579 871 650 871 q 361 682 456 871 q 274 319 274 508 q 308 152 274 215 q 413 89 342 89 "},"”":{"x_min":143.0625,"x_max":563.890625,"ha":454,"o":"m 320 851 q 259 737 306 785 q 143 669 211 689 l 156 734 q 227 787 201 741 q 258 873 247 819 l 186 872 l 216 1013 l 355 1013 l 320 851 m 529 851 q 467 737 515 785 q 351 669 419 689 l 365 734 q 436 787 409 741 q 466 873 455 819 l 394 872 l 424 1013 l 563 1013 l 529 851 "},"@":{"x_min":64,"x_max":1381,"ha":1357,"o":"m 1089 -45 q 842 -160 975 -117 q 590 -203 709 -203 q 189 -72 327 -203 q 64 238 64 45 q 294 752 64 517 q 903 1008 546 1008 q 1271 890 1146 1008 q 1381 619 1381 787 q 1239 255 1381 420 q 884 82 1089 82 q 802 99 829 82 q 775 160 775 117 q 780 201 775 180 q 672 113 730 144 q 546 82 614 82 q 416 127 458 82 q 374 248 374 172 q 494 535 374 394 q 786 690 625 690 q 936 588 907 690 l 992 668 l 1081 668 q 972 441 1015 532 q 882 226 890 266 q 880 211 880 220 q 896 178 880 190 q 937 167 912 167 q 1173 306 1068 167 q 1278 603 1278 445 q 1190 828 1278 743 q 885 925 1089 925 q 361 701 578 925 q 163 252 163 495 q 265 -10 163 87 q 601 -122 380 -122 q 837 -87 711 -122 q 1062 8 964 -53 l 1089 -45 m 890 488 q 860 581 890 547 q 775 615 830 615 q 574 492 665 615 q 488 266 488 379 q 511 185 488 215 q 586 156 535 156 q 782 273 700 156 q 890 488 805 308 "},"Ί":{"x_min":170.828125,"x_max":715.28125,"ha":613,"o":"m 500 1040 l 254 799 l 170 799 l 362 1040 l 500 1040 m 498 0 l 359 0 l 576 1012 l 715 1012 l 498 0 "},"i":{"x_min":13.890625,"x_max":353.25,"ha":275,"o":"m 323 872 l 200 872 l 231 1013 l 353 1012 l 323 872 m 136 0 l 13 0 l 170 738 l 293 737 l 136 0 "},"Β":{"x_min":-0.828125,"x_max":901,"ha":876,"o":"m 696 545 q 809 487 770 535 q 849 367 849 439 q 843 310 849 337 q 690 83 813 170 q 431 0 574 0 l 0 0 l 215 1013 l 626 1013 q 815 968 742 1013 q 901 819 901 916 q 901 788 901 804 q 895 768 896 773 q 825 632 879 692 q 696 545 771 571 m 584 899 l 330 899 l 263 587 l 504 587 q 654 623 587 587 q 751 744 733 666 q 754 775 754 755 q 702 866 754 833 q 584 899 651 899 m 445 124 q 602 169 530 124 q 700 302 681 219 q 704 337 704 322 q 640 444 704 406 q 504 476 586 476 l 240 476 l 165 124 l 445 124 "},"υ":{"x_min":64,"x_max":775.5625,"ha":725,"o":"m 692 352 q 561 94 660 199 q 303 -24 450 -24 q 121 56 183 -24 q 64 248 64 130 q 75 352 64 297 l 158 739 l 285 739 l 203 355 q 195 275 195 317 q 225 153 195 200 q 333 98 261 98 q 492 185 424 98 q 568 355 547 256 l 650 739 l 775 739 l 692 352 "},"]":{"x_min":-58.71875,"x_max":492.703125,"ha":372,"o":"m 216 -281 l -58 -281 l -39 -187 l 111 -186 l 348 920 l 196 920 l 217 1013 l 492 1013 l 216 -281 "},"m":{"x_min":-0.015625,"x_max":1135,"ha":1128,"o":"m 1019 0 l 896 0 l 993 454 q 1000 483 998 473 q 1002 514 1002 493 q 975 615 1002 577 q 882 660 944 660 q 738 586 801 660 q 666 436 684 522 l 573 0 l 447 0 l 544 454 q 551 517 551 489 q 526 615 551 580 q 434 657 497 657 q 290 585 354 657 q 215 436 234 522 l 121 0 l 0 0 l 158 738 l 275 738 l 254 640 q 357 729 297 695 q 479 763 418 763 q 594 730 544 763 q 664 642 644 697 q 777 732 708 701 q 916 763 846 763 q 1075 710 1015 763 q 1135 568 1135 658 q 1129 512 1135 538 l 1019 0 "},"χ":{"x_min":-50,"x_max":883.328125,"ha":815,"o":"m 720 -278 q 652 -294 686 -294 q 561 -257 600 -294 q 511 -175 527 -227 l 408 133 l 83 -277 l -50 -277 l 368 254 l 275 522 q 252 586 256 577 q 173 640 229 640 q 144 637 166 640 l 169 752 l 213 757 q 315 719 275 757 q 370 627 348 687 l 462 372 l 751 737 l 883 737 l 501 250 l 609 -69 q 637 -153 623 -110 q 702 -188 655 -188 q 741 -184 718 -188 l 720 -278 "},"8":{"x_min":108,"x_max":864,"ha":792,"o":"m 683 527 q 772 447 742 498 q 802 337 802 397 q 688 93 802 202 q 389 -26 564 -26 q 177 47 253 -26 q 108 218 108 114 q 167 398 108 312 q 333 527 226 484 q 262 596 284 557 q 240 683 240 636 q 345 887 240 794 q 606 986 458 986 q 797 922 726 986 q 864 773 864 862 q 820 640 864 702 q 683 527 772 570 m 516 565 q 666 624 607 565 q 721 749 721 678 q 685 837 721 802 q 579 872 650 872 q 429 812 488 872 q 375 688 375 758 q 410 600 375 635 q 516 565 445 565 m 415 91 q 595 165 523 91 q 662 320 662 235 q 623 422 662 384 q 495 465 578 465 q 315 391 387 465 q 250 239 250 325 q 288 135 250 174 q 415 91 333 91 "},"ί":{"x_min":72.21875,"x_max":548.609375,"ha":361,"o":"m 283 3 q 231 -9 258 -3 q 179 -15 204 -15 q 96 16 120 -15 q 72 105 72 48 q 74 148 72 132 q 84 200 76 164 l 198 737 l 323 737 l 213 215 q 206 180 209 198 q 202 150 202 162 q 212 114 202 126 q 248 101 222 101 q 281 105 265 101 q 306 112 297 109 l 283 3 m 548 1040 l 312 819 l 229 819 l 411 1040 l 548 1040 "},"Ζ":{"x_min":0,"x_max":995.828125,"ha":850,"o":"m 779 0 l 0 0 l 25 113 l 812 896 l 231 896 l 256 1013 l 995 1013 l 969 887 l 197 124 l 805 124 l 779 0 "},"R":{"x_min":0,"x_max":913,"ha":907,"o":"m 781 0 l 623 0 q 611 70 611 31 q 628 199 611 112 q 646 316 646 285 q 618 399 646 373 q 501 433 583 433 l 230 433 l 138 0 l 0 0 l 216 1013 l 612 1013 q 821 960 739 1013 q 913 790 913 900 q 906 731 913 766 q 838 597 890 659 q 715 502 787 534 q 778 453 760 487 q 797 367 797 419 q 785 269 797 330 q 761 106 761 131 q 787 26 761 52 l 781 0 m 491 551 q 662 594 583 551 q 772 731 754 645 q 775 749 775 740 q 775 763 775 759 q 705 866 775 832 q 565 896 648 896 l 328 896 l 254 551 l 491 551 "},"o":{"x_min":68,"x_max":803,"ha":821,"o":"m 351 -25 q 140 55 213 -25 q 68 266 68 136 q 79 368 68 312 q 230 642 113 533 q 519 761 355 761 q 732 676 655 761 q 803 466 803 597 q 791 368 803 420 q 639 91 755 201 q 351 -25 515 -25 m 374 85 q 565 175 483 85 q 662 369 637 255 q 671 449 671 409 q 630 591 671 538 q 495 651 584 651 q 308 560 388 651 q 213 369 238 483 q 206 327 209 348 q 204 287 204 306 q 242 146 204 198 q 374 85 287 85 "},"5":{"x_min":105,"x_max":888.328125,"ha":792,"o":"m 803 314 q 641 60 768 153 q 385 -23 525 -23 q 189 36 267 -23 q 105 212 105 101 q 105 256 105 240 l 237 256 q 284 131 237 175 q 397 91 327 91 q 562 149 486 91 q 668 314 647 213 q 672 340 671 325 q 674 365 674 354 q 625 484 674 441 q 498 528 576 528 q 392 505 445 528 q 291 439 340 483 l 175 439 l 363 958 l 888 958 l 863 840 l 432 840 l 337 579 q 440 627 388 612 q 543 643 492 643 q 734 571 657 643 q 812 384 812 500 q 803 314 812 351 "},"7":{"x_min":193.0625,"x_max":936.109375,"ha":792,"o":"m 911 839 q 567 448 701 644 q 336 0 433 252 l 193 0 q 425 441 290 249 q 772 830 559 632 l 237 830 l 263 958 l 936 958 l 911 839 "},"K":{"x_min":-0.171875,"x_max":1026.109375,"ha":906,"o":"m 819 0 l 650 0 l 403 509 l 215 356 l 138 0 l 0 0 l 216 1013 l 355 1013 l 251 526 l 843 1013 l 1026 1013 l 523 600 l 819 0 "},",":{"x_min":-44.4375,"x_max":173.609375,"ha":239,"o":"m 138 -12 q 76 -132 123 -84 q -44 -205 29 -180 l -29 -138 q 40 -82 15 -124 q 69 0 56 -55 l 0 0 l 32 150 l 173 151 l 138 -12 "},"d":{"x_min":68,"x_max":899.796875,"ha":796,"o":"m 683 0 l 563 0 l 583 93 q 456 6 523 37 q 322 -25 390 -25 q 131 66 201 -25 q 68 275 68 150 q 77 365 68 322 q 226 639 112 525 q 505 763 349 763 q 625 733 574 763 q 702 647 675 704 l 780 1013 l 899 1013 l 683 0 m 661 373 q 669 454 669 414 q 630 593 669 540 q 499 653 586 653 q 308 561 390 653 q 212 365 237 482 q 204 286 204 325 q 244 146 204 200 q 376 85 290 85 q 566 178 486 85 q 661 373 637 259 "},"¨":{"x_min":113.890625,"x_max":500.03125,"ha":232,"o":"m 469 1045 l 341 1046 l 372 1189 l 500 1189 l 469 1045 m 241 1046 l 113 1046 l 144 1189 l 272 1189 l 241 1046 "},"E":{"x_min":0,"x_max":941.671875,"ha":789,"o":"m 736 0 l 0 0 l 216 1013 l 941 1013 l 915 889 l 329 889 l 264 585 l 802 585 l 777 467 l 238 467 l 165 125 l 762 125 l 736 0 "},"Y":{"x_min":215.671875,"x_max":1034.796875,"ha":886,"o":"m 1034 1013 l 569 416 l 480 0 l 339 0 l 429 418 l 215 1013 l 355 1012 l 523 533 l 894 1013 l 1034 1013 "},"\"":{"x_min":129.171875,"x_max":510.03125,"ha":396,"o":"m 428 605 l 331 606 l 413 988 l 510 987 l 428 605 m 224 606 l 129 606 l 211 988 l 306 988 l 224 606 "},"‹":{"x_min":97.609375,"x_max":943.125,"ha":792,"o":"m 780 40 l 97 376 l 117 465 l 943 799 l 919 692 l 248 421 l 804 149 l 780 40 "},"„":{"x_min":-44.4375,"x_max":395.828125,"ha":467,"o":"m 138 -12 q 76 -132 123 -84 q -44 -205 29 -180 l -29 -138 q 40 -82 15 -124 q 69 0 56 -55 l 0 0 l 32 150 l 173 151 l 138 -12 m 361 -12 q 298 -132 345 -84 q 177 -205 251 -180 l 193 -138 q 262 -82 237 -124 q 291 0 279 -55 l 222 0 l 254 150 l 395 151 l 361 -12 "},"δ":{"x_min":67,"x_max":859.71875,"ha":810,"o":"m 787 360 q 635 87 750 195 q 351 -28 513 -28 q 141 52 216 -28 q 67 259 67 133 q 78 356 67 304 q 230 607 111 511 q 505 703 350 703 q 387 804 461 744 q 263 903 304 870 l 287 1012 l 859 1012 l 836 901 l 451 901 q 608 780 592 792 q 740 634 694 706 q 797 444 797 544 q 793 398 797 421 q 787 360 789 374 m 661 365 q 669 434 669 402 q 580 602 669 533 q 502 611 542 611 q 313 541 389 611 q 213 355 237 472 q 205 279 205 318 q 245 143 205 194 q 376 85 290 85 q 565 173 484 85 q 661 365 637 251 "},"έ":{"x_min":38.78125,"x_max":743.0625,"ha":714,"o":"m 684 234 q 530 38 648 111 q 294 -25 424 -25 q 120 19 192 -25 q 38 159 38 70 q 42 204 38 180 q 104 313 56 265 q 212 390 142 352 q 161 449 180 413 q 141 525 141 484 q 144 555 141 536 q 266 712 165 655 q 458 763 354 763 q 633 709 563 763 q 704 561 704 655 q 699 515 704 540 l 589 515 q 552 618 589 580 q 448 657 515 657 q 343 630 395 657 q 268 547 279 598 q 265 522 265 527 q 345 444 265 462 q 483 434 389 434 l 461 331 l 420 331 q 273 315 325 331 q 169 210 186 287 q 166 184 166 191 q 215 102 166 132 q 319 76 258 76 q 462 117 397 76 q 559 234 527 158 l 684 234 m 743 1040 l 506 819 l 423 819 l 605 1040 l 743 1040 "},"ω":{"x_min":63,"x_max":1006,"ha":1031,"o":"m 994 339 q 878 97 965 203 q 644 -26 773 -26 q 540 9 582 -26 q 483 103 499 44 q 390 12 446 46 q 274 -22 335 -22 q 111 59 167 -22 q 63 243 63 130 q 73 339 63 296 q 164 551 95 444 q 318 738 224 644 l 460 738 q 293 553 360 649 q 197 336 219 444 q 187 251 187 294 q 209 140 187 182 q 293 88 236 88 q 410 163 360 88 q 463 294 447 219 l 522 572 l 646 572 l 586 294 q 578 213 578 258 q 596 123 578 158 q 661 88 615 88 q 801 182 737 88 q 871 342 851 256 q 881 433 881 386 q 853 588 881 515 q 776 738 826 661 l 918 738 q 982 591 958 665 q 1006 439 1006 517 q 994 339 1006 394 "},"´":{"x_min":129.171875,"x_max":307.234375,"ha":251,"o":"m 225 605 l 129 606 l 211 988 l 307 987 l 225 605 "},"±":{"x_min":15.28125,"x_max":905.5625,"ha":792,"o":"m 884 490 l 549 490 l 500 255 l 402 254 l 452 490 l 115 490 l 136 586 l 473 586 l 522 818 l 620 819 l 570 586 l 905 586 l 884 490 m 784 21 l 15 21 l 36 115 l 805 115 l 784 21 "},"|":{"x_min":290.59375,"x_max":658.5,"ha":792,"o":"m 546 462 l 441 462 l 553 986 l 658 986 l 546 462 m 395 -241 l 290 -241 l 402 280 l 507 280 l 395 -241 "},"ϋ":{"x_min":64,"x_max":775.5625,"ha":725,"o":"m 652 800 l 543 800 l 569 925 l 679 925 l 652 800 m 409 800 l 300 800 l 326 925 l 436 925 l 409 800 m 692 352 q 561 93 660 199 q 303 -24 450 -24 q 121 56 183 -24 q 64 248 64 129 q 75 352 64 296 l 158 738 l 285 738 l 203 354 q 195 275 195 317 q 225 153 195 200 q 333 98 261 98 q 492 185 424 98 q 568 354 547 256 l 650 738 l 775 738 l 692 352 "},"§":{"x_min":64,"x_max":708,"ha":690,"o":"m 683 425 q 622 312 672 369 q 517 233 572 254 q 559 122 559 186 q 555 83 559 103 q 443 -74 534 -12 q 259 -133 358 -133 q 116 -83 169 -133 q 64 50 64 -33 q 68 96 64 72 l 188 96 q 183 64 183 79 q 210 -1 183 22 q 283 -26 237 -26 q 370 -5 327 -26 q 432 60 423 19 q 435 76 435 68 q 435 87 435 83 q 348 204 435 150 q 187 300 268 251 q 100 446 100 364 q 104 490 100 466 q 161 602 116 550 q 271 687 207 654 q 229 783 229 729 q 232 812 229 802 q 343 984 254 919 q 519 1043 422 1043 q 653 997 599 1043 q 708 866 708 952 q 707 845 708 857 q 702 814 706 834 l 585 814 q 586 836 586 822 q 558 912 586 886 q 490 939 530 939 q 407 911 446 939 q 360 841 368 884 q 359 820 359 834 q 443 719 359 770 q 603 625 522 672 q 689 473 689 559 q 689 450 689 461 q 683 425 684 433 m 554 409 q 556 427 556 415 q 426 576 556 497 q 331 630 378 602 q 271 587 292 608 q 236 525 243 559 q 235 508 235 519 q 329 380 235 448 q 462 298 437 315 q 522 345 497 316 q 554 409 547 375 "},"b":{"x_min":0,"x_max":774,"ha":783,"o":"m 764 372 q 618 99 730 213 q 341 -25 496 -25 q 220 5 272 -25 q 140 93 169 36 l 120 0 l 0 0 l 216 1013 l 337 1013 l 256 634 q 369 723 305 693 q 502 754 433 754 q 704 667 629 754 q 774 462 774 587 q 764 372 774 415 m 631 356 q 638 398 635 377 q 641 439 641 419 q 600 582 641 528 q 467 644 554 644 q 282 556 362 644 q 187 369 209 478 q 180 327 183 348 q 177 285 177 306 q 216 144 177 196 q 348 83 261 83 q 535 169 454 83 q 631 356 606 245 "},"q":{"x_min":66,"x_max":839.265625,"ha":876,"o":"m 622 -278 l 503 -278 l 584 97 q 474 8 540 39 q 339 -23 407 -23 q 137 59 209 -23 q 66 268 66 142 q 77 364 66 312 q 222 635 110 521 q 499 760 346 760 q 698 637 643 760 l 719 737 l 839 737 l 622 -278 m 661 375 q 669 452 669 413 q 629 592 669 539 q 496 652 583 652 q 309 565 390 652 q 213 377 237 488 q 206 335 209 356 q 204 292 204 314 q 244 147 204 203 q 377 84 290 84 q 566 179 486 84 q 661 375 636 261 "},"Ω":{"x_min":0.109375,"x_max":1087,"ha":1068,"o":"m 969 0 l 555 0 l 581 123 q 809 308 714 194 q 933 558 903 423 q 943 651 943 602 q 877 844 943 772 q 681 922 808 922 q 420 821 531 922 q 275 567 308 720 q 264 467 264 512 q 310 274 264 363 q 439 123 357 184 l 412 0 l 0 0 l 26 124 l 244 124 q 125 452 125 258 q 137 572 125 511 q 339 911 181 781 q 706 1041 497 1041 q 984 943 882 1041 q 1087 683 1087 845 q 1074 569 1087 630 q 969 326 1048 443 q 776 124 889 210 l 995 124 l 969 0 "},"ύ":{"x_min":64,"x_max":775.5625,"ha":725,"o":"m 692 352 q 561 93 660 199 q 303 -24 450 -24 q 121 56 183 -24 q 64 248 64 129 q 75 352 64 296 l 158 738 l 285 738 l 203 354 q 195 275 195 317 q 225 153 195 200 q 333 98 261 98 q 492 185 424 98 q 568 354 547 256 l 650 738 l 775 738 l 692 352 m 756 1040 l 520 819 l 437 819 l 619 1040 l 756 1040 "},"z":{"x_min":0,"x_max":751.390625,"ha":697,"o":"m 613 0 l 0 0 l 20 100 l 568 630 l 155 630 l 177 738 l 751 738 l 730 636 l 187 110 l 637 110 l 613 0 "},"™":{"x_min":202.78125,"x_max":1109.71875,"ha":1000,"o":"m 591 951 l 431 951 l 336 503 l 267 502 l 363 951 l 202 951 l 216 1011 l 605 1011 l 591 951 m 1000 503 l 933 502 l 1026 938 l 791 503 l 726 503 l 680 936 l 588 502 l 523 503 l 633 1011 l 733 1010 l 777 580 l 1012 1011 l 1109 1011 l 1000 503 "},"ή":{"x_min":80.5625,"x_max":812.5,"ha":810,"o":"m 637 -278 l 512 -278 l 669 454 q 676 520 676 491 q 651 611 676 577 q 563 650 622 650 q 395 579 476 650 q 295 420 313 509 l 205 0 l 80 0 l 184 489 q 193 535 190 517 q 197 574 197 553 q 186 623 197 607 q 137 644 170 644 l 158 741 q 229 755 197 755 q 309 721 283 755 q 334 630 334 688 q 452 726 381 692 q 597 761 522 761 q 752 709 693 761 q 812 570 812 658 q 812 545 812 558 q 806 516 808 526 l 637 -278 m 701 1040 l 465 819 l 381 819 l 563 1040 l 701 1040 "},"Θ":{"x_min":93,"x_max":1084,"ha":1056,"o":"m 1068 507 q 861 129 1020 280 q 469 -32 692 -32 q 186 81 286 -32 q 93 365 93 188 q 108 507 93 430 q 312 883 156 733 q 700 1045 479 1045 q 988 929 885 1045 q 1084 644 1084 822 q 1068 507 1084 580 m 924 500 q 937 618 937 558 q 875 832 937 751 q 673 924 806 924 q 392 792 513 924 q 249 507 285 675 q 237 387 237 446 q 296 177 237 257 q 495 89 363 89 q 778 218 654 89 q 924 500 889 334 m 812 449 l 338 449 l 365 571 l 838 571 l 812 449 "},"®":{"x_min":91,"x_max":1129,"ha":1106,"o":"m 617 532 q 735 562 680 532 q 811 658 798 598 q 814 681 814 674 q 770 750 814 729 q 668 772 726 772 l 503 771 l 452 531 l 617 532 m 500 -7 q 189 109 299 -7 q 91 383 91 215 q 259 805 91 617 q 719 1011 442 1011 q 1030 894 921 1011 q 1129 619 1129 788 q 962 198 1129 384 q 500 -7 778 -7 m 514 60 q 913 239 753 60 q 1058 604 1058 401 q 973 842 1058 751 q 703 944 878 944 q 305 764 465 944 q 160 398 160 601 q 244 161 160 252 q 514 60 339 60 m 818 146 l 709 146 q 701 194 701 169 q 707 259 701 222 q 724 367 724 350 q 704 425 724 405 q 622 449 679 449 l 434 448 l 368 146 l 271 146 l 422 854 l 700 854 q 846 817 790 854 q 910 699 910 776 q 905 658 910 681 q 859 564 894 607 q 774 497 824 521 q 818 463 806 486 q 831 404 831 440 q 813 286 831 380 q 805 219 805 243 q 822 164 805 180 l 818 146 "},"~":{"x_min":140.671875,"x_max":1036.5,"ha":931,"o":"m 1036 958 q 939 753 1010 831 q 735 665 857 665 q 564 761 643 665 q 422 857 485 857 q 300 795 347 857 q 244 665 262 747 l 140 665 q 237 867 167 789 q 440 958 319 958 q 613 861 536 958 q 757 765 690 765 q 880 827 835 765 q 932 958 915 874 l 1036 958 "},"Ε":{"x_min":0,"x_max":941.671875,"ha":778,"o":"m 736 0 l 0 0 l 216 1013 l 941 1013 l 915 889 l 329 889 l 263 585 l 802 585 l 777 467 l 238 467 l 165 125 l 762 125 l 736 0 "},"³":{"x_min":115,"x_max":604,"ha":547,"o":"m 567 552 q 466 413 548 466 q 299 366 391 366 q 170 403 220 366 q 115 520 115 445 q 115 537 115 529 q 120 566 115 545 l 205 566 q 203 547 204 557 q 203 534 203 538 q 235 461 203 486 q 317 437 268 437 q 419 467 373 437 q 477 552 466 498 q 480 576 480 569 q 443 637 480 618 q 355 657 407 657 q 335 657 345 657 q 316 657 321 657 l 330 722 q 437 733 404 722 q 508 815 496 752 q 510 826 510 820 q 510 834 510 831 q 482 886 510 866 q 415 907 455 907 q 320 875 363 907 q 263 780 277 844 l 181 780 q 277 926 202 874 q 428 972 344 972 q 553 938 503 972 q 604 845 604 905 q 601 817 604 837 q 492 697 581 731 q 572 585 572 670 q 567 552 572 569 "},"[":{"x_min":-58.6875,"x_max":491.28125,"ha":371,"o":"m 214 -281 l -58 -281 l 217 1013 l 491 1013 l 470 920 l 320 919 l 84 -186 l 234 -187 l 214 -281 "},"L":{"x_min":0,"x_max":672.21875,"ha":696,"o":"m 645 0 l 0 0 l 217 1013 l 357 1012 l 168 126 l 672 126 l 645 0 "},"σ":{"x_min":68,"x_max":962.203125,"ha":894,"o":"m 938 628 l 769 628 q 804 465 804 557 q 792 368 804 420 q 638 93 756 204 q 352 -25 513 -25 q 142 56 216 -25 q 68 266 68 137 q 79 368 68 312 q 231 644 113 533 q 519 761 356 761 q 642 750 560 761 q 767 739 724 739 l 962 739 l 938 628 m 379 85 q 567 180 484 85 q 665 374 640 263 q 673 451 673 415 q 630 592 673 540 q 491 651 582 651 q 306 559 385 651 q 214 368 237 478 q 206 286 206 326 q 244 146 206 197 q 379 85 290 85 "},"ζ":{"x_min":51,"x_max":777.453125,"ha":642,"o":"m 563 -40 q 517 -162 551 -97 q 449 -278 501 -194 l 339 -278 q 413 -162 388 -209 q 441 -90 434 -122 q 444 -68 444 -73 q 374 -14 444 -14 q 142 27 217 -14 q 51 199 51 78 q 62 289 51 237 q 162 524 87 409 q 335 730 230 628 q 545 901 421 813 l 248 901 l 271 1012 l 777 1012 l 758 924 q 402 669 556 830 q 191 301 233 491 q 183 231 183 260 q 376 105 183 110 q 569 6 569 99 q 569 -19 569 -5 q 563 -40 564 -35 "},"θ":{"x_min":86,"x_max":802,"ha":778,"o":"m 779 496 q 635 160 739 306 q 330 -26 503 -26 q 138 79 201 -26 q 86 312 86 168 q 104 485 86 399 q 252 840 145 682 q 567 1045 390 1045 q 753 936 693 1045 q 802 697 802 847 q 779 496 802 600 m 670 579 q 677 683 677 624 q 649 852 677 787 q 536 935 614 935 q 350 798 438 935 q 250 579 288 701 l 670 579 m 647 475 l 228 475 q 221 408 225 454 q 217 333 217 362 q 243 161 217 224 q 355 80 278 80 q 553 233 464 80 q 647 475 615 340 "},"Ο":{"x_min":93,"x_max":1083,"ha":1054,"o":"m 708 1042 q 989 929 890 1042 q 1083 650 1083 823 q 1067 511 1083 585 q 863 136 1019 287 q 476 -26 695 -26 q 188 86 291 -26 q 93 365 93 190 q 108 504 93 430 q 315 880 155 730 q 708 1042 485 1042 m 501 98 q 780 225 659 98 q 923 504 888 339 q 936 615 936 561 q 874 824 936 745 q 674 913 805 913 q 394 785 516 913 q 249 504 284 670 q 237 390 237 446 q 299 184 237 261 q 501 98 369 98 "},"Γ":{"x_min":0,"x_max":922.21875,"ha":749,"o":"m 894 886 l 329 886 l 140 0 l 0 0 l 216 1012 l 922 1012 l 894 886 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":144,"x_max":1147,"ha":1186,"o":"m 845 0 q 696 55 748 0 q 649 187 649 105 q 729 390 649 300 q 950 489 816 489 q 1099 433 1048 489 q 1147 300 1147 383 q 1066 98 1147 188 q 845 0 977 0 m 866 103 q 988 157 940 103 q 1036 278 1036 212 q 1011 353 1036 325 q 926 385 981 385 q 804 330 852 385 q 757 209 757 275 q 784 132 757 162 q 866 103 811 103 m 1099 986 l 278 -26 l 193 -25 l 1014 986 l 1099 986 m 341 468 q 191 524 243 468 q 144 659 144 576 q 223 860 144 772 q 442 958 309 958 q 592 902 539 958 q 641 769 641 851 q 561 566 641 655 q 341 468 474 468 m 424 855 q 297 799 346 855 q 248 678 248 744 q 276 601 248 631 q 361 572 304 572 q 491 628 439 572 q 537 745 537 680 q 509 824 537 793 q 424 855 481 855 "},"P":{"x_min":0,"x_max":888,"ha":806,"o":"m 642 1013 q 821 951 754 1013 q 888 787 888 890 q 881 719 888 748 q 746 506 851 587 q 505 426 640 426 l 232 425 l 141 0 l 0 0 l 216 1013 l 642 1013 m 570 889 l 331 888 l 257 547 l 489 548 q 647 589 575 548 q 747 720 729 638 q 752 755 752 740 q 698 854 752 820 q 570 889 645 889 "},"Έ":{"x_min":170.828125,"x_max":1283.328125,"ha":1118,"o":"m 1077 0 l 341 0 l 558 1013 l 1283 1013 l 1256 889 l 670 889 l 605 585 l 1144 585 l 1119 467 l 580 467 l 506 125 l 1104 125 l 1077 0 m 500 1040 l 254 799 l 170 799 l 362 1040 l 500 1040 "},"Ώ":{"x_min":167.109375,"x_max":1254,"ha":1235,"o":"m 1136 0 l 722 0 l 748 123 q 976 309 881 194 q 1100 558 1070 423 q 1110 651 1110 603 q 1044 845 1110 772 q 848 923 975 923 q 587 822 698 923 q 442 568 475 721 q 431 468 431 512 q 477 274 431 364 q 606 123 524 184 l 579 0 l 167 0 l 193 124 l 411 124 q 292 453 292 258 q 304 572 292 511 q 506 912 348 782 q 873 1042 664 1042 q 1151 944 1049 1042 q 1254 683 1254 846 q 1241 569 1254 630 q 1136 326 1215 443 q 943 124 1056 210 l 1162 124 l 1136 0 m 500 1040 l 254 800 l 171 800 l 362 1041 l 500 1040 "},"_":{"x_min":-70.828125,"x_max":655.5625,"ha":803,"o":"m 634 -334 l -70 -334 l -50 -234 l 655 -234 l 634 -334 "},"Ϊ":{"x_min":0,"x_max":500,"ha":275,"o":"m 469 1046 l 341 1046 l 372 1189 l 500 1189 l 469 1046 m 241 1046 l 113 1046 l 144 1189 l 272 1189 l 241 1046 m 136 0 l 0 0 l 216 1012 l 352 1012 l 136 0 "},"+":{"x_min":102.78125,"x_max":868.0625,"ha":792,"o":"m 847 372 l 523 372 l 444 0 l 347 0 l 426 372 l 102 372 l 123 468 l 446 468 l 525 839 l 622 840 l 543 468 l 868 468 l 847 372 "},"½":{"x_min":125.296875,"x_max":1136,"ha":1149,"o":"m 1051 0 l 625 0 q 751 179 647 106 q 935 277 766 190 q 1048 385 1035 330 q 1051 406 1051 399 q 1023 462 1051 442 q 953 483 996 483 q 858 452 899 483 q 795 352 809 416 l 715 352 q 812 502 736 448 q 967 551 881 551 q 1087 516 1038 551 q 1136 420 1136 481 q 1131 385 1136 405 q 1030 251 1113 301 q 866 179 948 215 q 731 68 768 133 l 1065 68 l 1051 0 m 1046 985 l 209 -28 l 125 -28 l 961 984 l 1046 985 m 313 422 l 232 422 l 315 811 l 173 811 l 184 867 q 294 889 247 867 q 372 973 352 916 l 431 973 l 313 422 "},"Ρ":{"x_min":-0.328125,"x_max":883,"ha":783,"o":"m 641 1013 q 817 953 752 1013 q 883 793 883 893 q 874 723 883 761 q 742 508 846 591 q 505 426 638 426 l 231 426 l 139 0 l 0 0 l 216 1013 l 641 1013 m 569 889 l 330 889 l 256 548 l 488 548 q 646 589 574 548 q 746 720 728 638 q 751 755 751 740 q 697 854 751 820 q 569 889 644 889 "},"'":{"x_min":143.0625,"x_max":355.5625,"ha":236,"o":"m 320 851 q 259 737 306 785 q 143 669 211 689 l 156 734 q 227 787 201 741 q 258 873 247 819 l 186 872 l 216 1013 l 355 1013 l 320 851 "},"ª":{"x_min":151,"x_max":501,"ha":397,"o":"m 482 625 q 439 616 459 616 q 404 631 414 616 q 394 673 394 645 q 325 628 364 644 q 248 613 287 613 q 151 696 151 613 q 153 722 151 703 q 248 826 170 800 q 428 866 338 846 l 437 887 q 421 935 442 918 q 366 953 399 953 q 304 934 332 953 q 264 882 275 915 l 205 882 q 270 977 220 943 q 382 1011 320 1011 q 466 986 431 1011 q 501 916 501 961 q 501 891 501 908 l 459 706 q 456 687 456 693 q 474 670 456 670 l 492 672 l 482 625 m 406 757 l 419 811 q 305 790 345 798 q 219 726 229 773 q 218 712 218 721 q 274 667 218 667 q 357 691 316 667 q 406 757 398 716 "},"΅":{"x_min":170.828125,"x_max":647.21875,"ha":553,"o":"m 620 800 l 511 800 l 537 925 l 647 925 l 620 800 m 629 1040 l 383 800 l 300 800 l 491 1040 l 629 1040 m 280 800 l 170 800 l 197 925 l 306 925 l 280 800 "},"T":{"x_min":190.28125,"x_max":994.453125,"ha":835,"o":"m 968 894 l 648 894 l 458 0 l 319 0 l 509 894 l 190 894 l 216 1013 l 994 1013 l 968 894 "},"Φ":{"x_min":99,"x_max":1033,"ha":997,"o":"m 526 0 l 388 0 l 415 122 q 185 204 272 122 q 99 423 99 287 q 100 465 99 451 q 109 510 101 479 q 278 786 145 678 q 579 894 412 894 l 605 1013 l 743 1013 l 716 894 q 946 812 859 894 q 1033 597 1033 731 q 1031 555 1033 571 q 1023 510 1030 540 q 854 231 988 341 q 552 122 720 122 l 526 0 m 574 226 q 778 310 689 226 q 887 508 862 390 q 895 580 895 545 q 843 728 895 672 q 693 788 788 788 l 574 226 m 437 226 l 556 788 q 355 699 440 776 q 245 505 269 622 q 240 475 242 495 q 238 436 238 455 q 290 285 238 344 q 437 226 342 226 "},"j":{"x_min":-136.5,"x_max":384.546875,"ha":349,"o":"m 354 870 l 229 870 l 259 1012 l 384 1013 l 354 870 m 150 -80 q 73 -231 127 -184 q -85 -278 18 -278 l -136 -278 l -111 -164 l -75 -164 q -3 -142 -22 -164 q 28 -63 16 -121 l 199 737 l 324 738 l 150 -80 "},"Σ":{"x_min":0,"x_max":962.5,"ha":819,"o":"m 756 0 l 0 0 l 22 107 l 508 523 l 215 904 l 238 1013 l 962 1013 l 936 889 l 400 889 l 679 523 l 213 125 l 783 125 l 756 0 "},"1":{"x_min":365.28125,"x_max":786.125,"ha":792,"o":"m 575 0 l 442 0 l 591 697 l 365 697 l 386 796 q 566 833 504 796 q 687 986 636 875 l 786 986 l 575 0 "},"›":{"x_min":26.390625,"x_max":873.609375,"ha":792,"o":"m 854 376 l 26 40 l 50 148 l 722 421 l 165 692 l 188 799 l 873 465 l 854 376 "},"<":{"x_min":97.609375,"x_max":943.125,"ha":792,"o":"m 780 40 l 97 376 l 117 465 l 943 799 l 919 692 l 248 421 l 804 149 l 780 40 "},"£":{"x_min":22,"x_max":840,"ha":801,"o":"m 712 41 q 621 -10 665 5 q 536 -26 577 -26 q 362 15 495 -26 q 251 36 295 36 q 164 23 205 36 q 69 -21 123 10 l 22 76 q 209 247 167 184 q 251 376 251 311 q 246 414 251 393 q 241 443 242 436 l 94 443 l 109 512 l 217 512 q 191 655 191 581 q 288 902 191 804 q 573 1010 393 1010 q 763 949 687 1010 q 840 786 840 889 q 833 729 840 761 l 823 684 l 697 684 q 705 750 705 720 q 667 857 705 818 q 553 896 629 896 q 374 830 430 896 q 329 681 329 776 q 335 601 329 641 q 356 512 342 562 l 577 512 l 562 443 l 373 443 q 377 399 377 419 q 282 206 377 305 q 175 107 252 175 q 254 132 215 123 q 322 142 294 142 q 435 119 368 142 q 537 96 502 96 q 601 105 570 96 q 677 142 631 115 l 712 41 "},"t":{"x_min":133.328125,"x_max":523.609375,"ha":458,"o":"m 366 0 q 310 -5 337 -2 q 261 -8 283 -8 q 133 91 133 -8 q 138 143 133 116 l 244 638 l 136 638 l 157 738 l 265 737 l 310 944 l 433 943 l 389 737 l 523 738 l 502 638 l 368 637 l 271 184 q 266 152 266 168 q 329 102 266 102 q 367 104 352 102 q 388 107 381 107 l 366 0 "},"¬":{"x_min":72.21875,"x_max":793.0625,"ha":803,"o":"m 793 411 l 738 158 l 662 158 l 701 335 l 72 335 l 87 411 l 793 411 "},"λ":{"x_min":0,"x_max":770.828125,"ha":803,"o":"m 748 -7 q 676 -15 712 -15 q 551 59 588 -15 q 512 214 533 97 l 454 551 l 126 0 l 0 0 l 422 705 q 402 837 412 770 q 308 899 381 899 q 281 898 291 899 l 305 1004 q 332 1008 318 1006 q 369 1011 347 1011 q 498 938 459 1011 q 541 783 519 901 l 647 193 q 673 116 656 136 q 736 96 690 96 l 756 96 q 770 97 766 97 l 748 -7 "},"W":{"x_min":216,"x_max":1479.890625,"ha":1351,"o":"m 1479 1013 l 995 0 l 859 0 l 806 837 l 404 0 l 265 0 l 216 1013 l 352 1013 l 385 203 l 773 1012 l 917 1013 l 965 208 l 1349 1013 l 1479 1013 "},">":{"x_min":26.390625,"x_max":873.609375,"ha":792,"o":"m 854 376 l 26 40 l 50 148 l 722 421 l 165 692 l 188 799 l 873 465 l 854 376 "},"v":{"x_min":156.9375,"x_max":832.265625,"ha":761,"o":"m 832 738 l 404 0 l 272 0 l 156 738 l 290 738 l 372 147 l 698 737 l 832 738 "},"τ":{"x_min":134.71875,"x_max":802.78125,"ha":703,"o":"m 779 628 l 516 628 l 420 179 q 413 133 413 154 q 455 91 413 91 q 488 94 465 91 q 525 97 512 97 l 504 0 q 398 -14 445 -14 q 314 15 338 -14 q 290 99 290 45 q 294 159 290 133 q 309 233 298 186 l 394 628 l 134 628 l 158 739 l 802 739 l 779 628 "},"ξ":{"x_min":51,"x_max":792.453125,"ha":699,"o":"m 616 -37 q 571 -161 603 -96 q 503 -278 546 -212 l 393 -278 q 452 -183 441 -204 q 492 -83 482 -126 q 495 -62 495 -66 q 461 -11 495 -25 q 371 1 427 1 q 323 0 353 1 q 282 -1 292 -1 q 116 58 182 -1 q 51 212 51 117 q 51 233 51 224 q 56 266 51 242 q 148 431 75 358 q 311 538 213 498 q 233 599 261 559 q 204 692 204 638 q 209 730 204 710 q 252 823 220 780 q 335 901 285 867 l 220 901 l 243 1012 l 792 1012 l 768 901 l 573 901 q 429 863 496 901 q 336 745 352 819 q 332 710 332 726 q 454 595 332 623 q 656 582 516 582 l 634 479 q 373 455 463 479 q 177 281 204 410 q 173 249 173 265 q 209 165 173 198 q 300 120 245 131 q 462 108 304 119 q 620 0 620 97 q 616 -37 620 -16 "},"&":{"x_min":51,"x_max":894.0625,"ha":992,"o":"m 894 0 l 723 0 l 650 123 q 472 0 563 40 q 298 -41 381 -41 q 81 92 141 -41 q 51 225 51 161 q 123 406 51 322 q 373 582 200 497 q 326 667 341 629 q 307 765 307 715 q 307 796 307 781 q 312 817 311 811 q 425 985 334 922 q 606 1041 505 1041 q 747 997 690 1041 q 804 872 804 953 q 804 850 804 861 q 798 824 799 832 q 706 666 780 739 q 551 557 648 608 l 692 326 q 744 427 718 362 q 769 493 757 458 l 887 493 q 752 229 855 351 l 894 0 m 678 819 q 683 852 683 838 q 655 917 683 895 q 585 940 627 940 q 487 908 532 940 q 430 819 442 876 q 426 784 426 799 q 448 699 426 741 q 498 628 462 674 q 633 730 592 684 q 678 819 667 770 m 601 209 l 421 500 q 247 380 303 443 q 191 250 191 317 q 216 159 191 204 q 349 80 257 80 q 601 209 466 80 "},"Λ":{"x_min":0,"x_max":862.5,"ha":942,"o":"m 862 0 l 719 0 l 606 847 l 143 0 l 0 0 l 573 1013 l 718 1013 l 862 0 "},"I":{"x_min":40.65625,"x_max":396.390625,"ha":293,"o":"m 179 0 l 40 0 l 257 1013 l 396 1012 l 179 0 "},"G":{"x_min":93,"x_max":1060,"ha":1011,"o":"m 920 0 l 831 0 l 830 136 q 658 15 754 58 q 465 -28 563 -28 q 187 88 288 -28 q 93 370 93 198 q 106 499 93 438 q 313 881 155 730 q 708 1043 482 1043 q 954 966 855 1043 q 1060 750 1060 885 q 1060 729 1060 739 q 1060 709 1060 715 l 924 709 q 856 865 924 805 q 684 926 789 926 q 396 795 520 926 q 249 507 285 678 q 237 396 237 450 q 300 184 237 266 q 503 94 371 94 q 751 195 644 94 q 888 435 851 290 l 570 435 l 594 549 l 1037 549 l 920 0 "},"ΰ":{"x_min":64,"x_max":775.5625,"ha":725,"o":"m 694 800 l 584 800 l 611 925 l 720 925 l 694 800 m 354 800 l 244 800 l 270 925 l 380 925 l 354 800 m 692 352 q 561 93 660 199 q 303 -24 450 -24 q 121 56 183 -24 q 64 248 64 129 q 75 352 64 296 l 158 738 l 285 738 l 203 354 q 195 275 195 317 q 225 153 195 200 q 333 98 261 98 q 492 185 424 98 q 568 354 547 256 l 650 738 l 775 738 l 692 352 m 711 1040 l 475 819 l 391 819 l 573 1040 l 711 1040 "},"`":{"x_min":147.609375,"x_max":360.109375,"ha":236,"o":"m 286 698 l 147 699 l 182 861 q 242 974 196 927 q 360 1041 289 1020 l 346 977 q 276 924 301 969 q 247 839 258 893 l 316 839 l 286 698 "},"·":{"x_min":125,"x_max":297.9375,"ha":239,"o":"m 266 585 l 125 585 l 156 738 l 297 738 l 266 585 "},"Υ":{"x_min":216.671875,"x_max":1036.109375,"ha":889,"o":"m 1036 1013 l 570 416 l 481 0 l 341 0 l 430 416 l 216 1013 l 356 1013 l 525 533 l 895 1013 l 1036 1013 "},"r":{"x_min":0,"x_max":516.671875,"ha":432,"o":"m 488 621 l 476 621 q 300 569 369 621 q 210 411 232 518 l 122 0 l 0 0 l 156 737 l 273 737 l 245 604 q 358 719 291 686 q 516 753 425 753 l 488 621 "},"x":{"x_min":0,"x_max":818.0625,"ha":764,"o":"m 675 0 l 525 0 l 392 286 l 143 0 l 0 0 l 337 379 l 169 738 l 315 737 l 438 474 l 673 737 l 818 738 l 494 380 l 675 0 "},"μ":{"x_min":-59.71875,"x_max":773.609375,"ha":747,"o":"m 695 -4 q 661 -11 677 -8 q 626 -14 644 -14 q 519 97 519 -14 q 425 8 479 40 q 308 -24 370 -24 q 208 3 251 -24 q 136 80 165 31 l 59 -278 l -59 -278 l 156 738 l 280 738 l 197 343 q 188 262 188 305 q 218 138 188 184 q 326 82 254 82 q 490 177 419 82 q 569 358 547 255 l 650 738 l 773 738 l 662 214 q 656 181 659 200 q 654 147 654 162 q 662 106 654 121 q 694 92 670 92 q 718 95 702 92 l 695 -4 "},"h":{"x_min":-0.46875,"x_max":726,"ha":724,"o":"m 716 472 l 615 0 l 489 0 l 587 454 q 595 522 595 487 q 570 615 595 581 q 478 654 540 654 q 313 588 392 654 q 215 436 234 523 l 122 0 l 0 0 l 216 1013 l 338 1013 l 256 633 q 374 727 298 694 q 524 760 449 760 q 677 703 624 760 q 726 557 726 650 q 723 518 726 540 q 716 472 720 497 "},".":{"x_min":0,"x_max":173.015625,"ha":239,"o":"m 141 0 l 0 0 l 31 151 l 173 151 l 141 0 "},"φ":{"x_min":67,"x_max":970,"ha":974,"o":"m 436 -279 l 318 -279 l 374 -17 q 146 58 226 -17 q 67 266 67 134 q 68 317 67 301 q 78 367 69 333 q 203 626 108 512 q 446 758 313 758 l 422 646 q 282 537 342 626 q 213 373 233 465 q 205 331 208 352 q 203 291 203 310 q 250 147 203 201 q 397 93 298 93 l 540 758 q 640 765 596 765 q 880 686 790 765 q 970 473 970 608 q 958 377 970 430 q 791 96 922 210 q 492 -17 660 -17 l 436 -279 m 516 93 l 534 93 q 727 183 642 93 q 829 380 804 265 q 837 458 837 420 q 797 598 837 545 q 663 658 752 658 l 637 656 l 516 93 "},";":{"x_min":-44.4375,"x_max":297.9375,"ha":239,"o":"m 266 585 l 125 585 l 156 738 l 297 738 l 266 585 m 138 -12 q 76 -132 123 -84 q -44 -206 29 -181 l -29 -138 q 40 -82 16 -123 q 68 0 55 -56 l 0 0 l 32 150 l 173 151 l 138 -12 "},"f":{"x_min":121.09375,"x_max":595.828125,"ha":472,"o":"m 513 638 l 381 638 l 245 0 l 121 0 l 257 637 l 136 638 l 156 738 l 277 738 q 337 935 311 887 q 509 1028 390 1028 q 550 1026 534 1028 q 595 1021 565 1025 l 572 908 q 519 918 543 918 q 441 870 469 918 q 412 780 423 840 l 402 738 l 534 738 l 513 638 "},"“":{"x_min":144.4375,"x_max":565.28125,"ha":454,"o":"m 283 669 l 144 670 l 179 830 q 240 943 193 896 q 356 1011 288 991 l 343 947 q 272 894 300 940 q 241 810 251 859 l 313 810 l 283 669 m 491 669 l 352 670 l 387 830 q 449 943 401 895 q 565 1011 497 991 l 551 947 q 480 894 508 940 q 450 810 459 859 l 522 810 l 491 669 "},"A":{"x_min":-0.015625,"x_max":906.96875,"ha":1008,"o":"m 906 0 l 757 0 l 713 303 l 316 303 l 142 0 l 0 0 l 593 1013 l 745 1013 l 906 0 m 700 421 l 637 867 l 383 421 l 700 421 "},"6":{"x_min":129,"x_max":889,"ha":792,"o":"m 805 312 q 646 62 773 162 q 394 -31 528 -31 q 208 42 278 -31 q 129 278 129 124 q 133 353 129 314 q 147 439 137 391 q 358 859 205 712 q 644 986 490 986 q 818 923 747 986 q 889 759 889 861 q 884 714 889 737 l 754 714 q 756 737 756 722 q 715 837 756 800 q 615 875 675 875 q 440 792 522 875 q 302 516 342 695 q 427 596 360 569 q 559 624 494 624 q 739 557 667 624 q 812 380 812 491 q 810 347 812 365 q 805 312 809 329 m 667 298 q 673 332 672 325 q 674 358 674 339 q 628 474 674 433 q 515 516 583 516 q 368 461 436 516 q 270 300 293 401 q 264 266 265 273 q 264 240 264 259 q 311 121 264 165 q 422 83 354 83 q 569 137 501 83 q 667 298 644 197 "},"‘":{"x_min":144.4375,"x_max":356.9375,"ha":236,"o":"m 283 669 l 144 670 l 179 830 q 240 943 193 895 q 356 1011 288 991 l 343 947 q 272 894 300 940 q 241 810 251 859 l 313 810 l 283 669 "},"ϊ":{"x_min":72.21875,"x_max":480.5625,"ha":361,"o":"m 454 800 l 344 800 l 370 925 l 480 925 l 454 800 m 211 800 l 101 800 l 127 925 l 237 925 l 211 800 m 283 3 q 231 -9 258 -3 q 179 -15 204 -15 q 96 16 120 -15 q 72 105 72 48 q 74 148 72 132 q 84 200 76 164 l 198 737 l 323 737 l 213 215 q 206 180 209 198 q 202 150 202 162 q 212 114 202 126 q 248 101 222 101 q 281 105 265 101 q 306 112 297 110 l 283 3 "},"π":{"x_min":97.21875,"x_max":930.5625,"ha":857,"o":"m 772 -6 l 705 -11 q 604 13 633 -11 q 576 86 576 37 q 587 168 576 116 q 601 226 594 197 l 686 626 l 355 626 l 222 0 l 97 0 l 230 626 l 133 626 l 156 737 l 930 737 l 906 626 l 809 626 l 712 172 q 708 134 708 148 q 726 97 708 105 q 793 90 744 90 l 772 -6 "},"ά":{"x_min":68,"x_max":843,"ha":808,"o":"m 763 -4 q 695 -14 724 -14 q 584 97 584 -14 q 467 7 533 40 q 331 -26 401 -26 q 136 60 205 -26 q 68 272 68 146 q 79 369 68 318 q 224 637 112 525 q 499 760 347 760 q 620 727 569 760 q 698 637 672 695 l 720 738 l 843 738 l 731 222 q 726 189 729 208 q 723 155 723 171 q 733 110 723 126 q 769 94 743 94 q 786 96 780 94 l 763 -4 m 662 371 q 671 453 671 412 q 632 593 671 541 q 499 653 587 653 q 311 566 392 653 q 215 379 239 490 q 206 290 206 339 q 243 146 206 199 q 376 84 287 84 q 567 176 485 84 q 662 371 637 257 m 826 1040 l 590 819 l 506 819 l 688 1040 l 826 1040 "},"O":{"x_min":93,"x_max":1083,"ha":1057,"o":"m 708 1041 q 989 928 890 1041 q 1083 649 1083 823 q 1067 512 1083 585 q 863 136 1019 287 q 476 -26 695 -26 q 188 86 291 -26 q 93 365 93 190 q 108 504 93 430 q 315 880 155 730 q 708 1041 485 1041 m 501 98 q 780 225 659 98 q 923 504 888 339 q 936 615 936 561 q 874 823 936 744 q 674 912 805 912 q 394 784 516 912 q 249 504 284 669 q 237 390 237 446 q 299 183 237 261 q 501 98 369 98 "},"n":{"x_min":-0.015625,"x_max":724,"ha":724,"o":"m 713 463 l 615 0 l 490 0 l 587 454 q 595 518 595 491 q 567 615 595 579 q 472 656 535 656 q 304 584 382 656 q 206 420 226 512 l 116 0 l 0 0 l 158 738 l 275 738 l 251 630 q 373 728 297 693 q 523 764 448 764 q 676 704 625 764 q 724 554 724 650 q 722 511 724 526 q 713 463 721 495 "},"3":{"x_min":109,"x_max":860,"ha":792,"o":"m 798 284 q 646 55 767 141 q 393 -25 534 -25 q 190 31 264 -25 q 109 218 109 95 q 118 308 109 261 l 249 308 q 242 248 242 273 q 289 134 242 172 q 415 96 336 96 q 569 140 504 96 q 661 280 642 190 q 667 326 667 302 q 586 434 667 405 q 420 454 532 454 l 443 565 q 611 584 561 565 q 717 719 695 617 q 722 753 722 738 q 682 844 722 810 q 581 879 642 879 q 432 824 496 879 q 343 661 369 769 l 218 661 q 356 907 253 823 q 599 992 458 992 q 785 934 711 992 q 860 777 860 877 q 860 752 860 765 q 854 723 855 733 q 798 606 840 656 q 689 524 756 556 q 776 458 748 503 q 805 348 805 412 q 798 284 805 322 "},"9":{"x_min":104,"x_max":869,"ha":792,"o":"m 850 524 q 638 94 789 242 q 356 -32 509 -32 q 176 31 249 -32 q 104 193 104 94 q 106 220 104 205 q 109 243 108 234 l 241 243 q 239 212 239 231 q 280 119 239 156 q 384 82 322 82 q 552 161 474 82 q 691 440 647 257 q 434 334 572 334 q 242 404 309 334 q 183 573 183 468 q 292 850 183 726 q 594 986 413 986 q 807 897 738 986 q 869 680 869 819 q 850 524 869 611 m 481 449 q 664 534 591 449 q 731 710 731 613 q 693 824 731 781 q 572 873 651 873 q 389 785 463 873 q 321 606 321 705 q 360 493 321 537 q 481 449 400 449 "},"l":{"x_min":40.65625,"x_max":382.09375,"ha":279,"o":"m 165 0 l 40 0 l 257 1013 l 382 1013 l 165 0 "},"¤":{"x_min":105.015625,"x_max":903.21875,"ha":825,"o":"m 793 303 l 698 224 l 589 363 q 453 331 528 331 q 334 363 382 331 l 167 224 l 105 304 l 271 442 q 262 503 262 469 q 328 673 262 596 l 215 818 l 310 898 l 427 749 q 485 766 455 759 q 549 773 516 773 q 611 766 582 773 q 660 749 639 759 l 841 898 l 903 818 l 729 675 q 744 600 744 643 q 685 441 744 512 l 793 303 m 529 682 q 405 632 453 682 q 358 524 358 583 q 386 451 358 479 q 473 423 414 423 q 597 472 549 423 q 645 580 645 521 q 618 651 645 625 q 529 682 588 682 "},"κ":{"x_min":0,"x_max":752.78125,"ha":679,"o":"m 631 0 l 481 0 l 306 384 l 184 288 l 123 0 l 0 0 l 156 738 l 280 738 l 219 446 l 590 738 l 752 738 l 412 466 l 631 0 "},"4":{"x_min":100,"x_max":818.0625,"ha":792,"o":"m 794 243 l 654 242 l 602 0 l 477 0 l 528 243 l 100 243 l 127 368 l 679 958 l 806 958 l 678 353 l 818 354 l 794 243 m 552 354 l 646 793 l 239 354 l 552 354 "},"p":{"x_min":-58.71875,"x_max":775,"ha":786,"o":"m 763 364 q 619 96 730 207 q 345 -23 500 -23 q 141 88 202 -23 l 62 -278 l -58 -278 l 159 738 l 280 738 l 256 633 q 376 726 307 691 q 515 761 444 761 q 711 673 641 761 q 775 465 775 593 q 763 364 775 419 m 637 371 q 646 448 646 411 q 605 590 646 535 q 470 651 559 651 q 281 559 362 651 q 187 366 212 480 q 178 289 178 326 q 219 147 178 202 q 352 87 265 87 q 541 178 459 87 q 637 371 612 258 "},"‡":{"x_min":50,"x_max":950,"ha":835,"o":"m 509 238 l 458 0 l 319 0 l 370 238 l 50 238 l 76 360 l 396 360 l 465 681 l 145 683 l 172 804 l 491 804 l 536 1015 l 675 1014 l 630 804 l 950 804 l 923 683 l 604 683 l 535 360 l 854 360 l 829 238 l 509 238 "},"ψ":{"x_min":68,"x_max":967.109375,"ha":907,"o":"m 406 -278 l 282 -278 l 339 -15 q 137 63 207 -15 q 68 270 68 142 q 80 378 68 321 l 158 739 l 292 739 l 214 379 q 206 303 206 343 q 242 163 206 218 q 362 98 283 98 l 539 922 l 662 922 l 486 98 q 665 195 585 98 q 757 382 733 278 l 833 742 l 967 742 l 890 381 q 746 104 854 211 q 464 -13 628 -13 l 406 -278 "},"η":{"x_min":80.5625,"x_max":812.5,"ha":810,"o":"m 637 -278 l 512 -278 l 669 454 q 676 520 676 491 q 651 611 676 577 q 563 650 622 650 q 395 579 476 650 q 295 420 313 509 l 205 0 l 80 0 l 184 489 q 193 535 190 517 q 197 574 197 553 q 186 623 197 607 q 137 644 170 644 l 158 741 q 229 755 197 755 q 309 721 283 755 q 334 630 334 688 q 452 726 381 692 q 597 761 522 761 q 752 709 693 761 q 812 570 812 658 q 812 545 812 558 q 806 516 808 526 l 637 -278 "}},"cssFontWeight":"normal","ascender":1189,"underlinePosition":-100,"cssFontStyle":"italic","boundingBox":{"yMin":-334,"xMin":-136.5,"yMax":1189,"xMax":1730},"resolution":1000,"original_font_information":{"postscript_name":"Helvetiker-Oblique","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Helvetiker Oblique","font_family_name":"Helvetiker","copyright":"Copyright (c) Magenta ltd, 2004.","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Magenta ltd:Helvetiker Oblique:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Magenta ltd","font_sub_family_name":"Oblique"},"descender":-334,"familyName":"Helvetiker","lineHeight":1522,"underlineThickness":50});
if (_typeface_js && _typeface_js.loadFace) _typeface_js.loadFace({"glyphs":{"ο":{"x_min":0,"x_max":712,"ha":815,"o":"m 356 -25 q 96 88 192 -25 q 0 368 0 201 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 "},"S":{"x_min":0,"x_max":788,"ha":890,"o":"m 788 291 q 662 54 788 144 q 397 -26 550 -26 q 116 68 226 -26 q 0 337 0 168 l 131 337 q 200 152 131 220 q 384 85 269 85 q 557 129 479 85 q 650 270 650 183 q 490 429 650 379 q 194 513 341 470 q 33 739 33 584 q 142 964 33 881 q 388 1041 242 1041 q 644 957 543 1041 q 756 716 756 867 l 625 716 q 561 874 625 816 q 395 933 497 933 q 243 891 309 933 q 164 759 164 841 q 325 609 164 656 q 625 526 475 568 q 788 291 788 454 "},"¦":{"x_min":343,"x_max":449,"ha":792,"o":"m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 "},"/":{"x_min":183.25,"x_max":608.328125,"ha":792,"o":"m 608 1041 l 266 -129 l 183 -129 l 520 1041 l 608 1041 "},"Τ":{"x_min":-0.4375,"x_max":777.453125,"ha":839,"o":"m 777 893 l 458 893 l 458 0 l 319 0 l 319 892 l 0 892 l 0 1013 l 777 1013 l 777 893 "},"y":{"x_min":0,"x_max":684.78125,"ha":771,"o":"m 684 738 l 388 -83 q 311 -216 356 -167 q 173 -279 252 -279 q 97 -266 133 -279 l 97 -149 q 132 -155 109 -151 q 168 -160 155 -160 q 240 -114 213 -160 q 274 -26 248 -98 l 0 738 l 137 737 l 341 139 l 548 737 l 684 738 "},"Π":{"x_min":0,"x_max":803,"ha":917,"o":"m 803 0 l 667 0 l 667 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 803 1012 l 803 0 "},"ΐ":{"x_min":-111,"x_max":339,"ha":361,"o":"m 339 800 l 229 800 l 229 925 l 339 925 l 339 800 m -1 800 l -111 800 l -111 925 l -1 925 l -1 800 m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 m 302 1040 l 113 819 l 30 819 l 165 1040 l 302 1040 "},"g":{"x_min":0,"x_max":686,"ha":838,"o":"m 686 34 q 586 -213 686 -121 q 331 -306 487 -306 q 131 -252 216 -306 q 31 -84 31 -190 l 155 -84 q 228 -174 166 -138 q 345 -207 284 -207 q 514 -109 454 -207 q 564 89 564 -27 q 461 6 521 36 q 335 -23 401 -23 q 88 100 184 -23 q 0 370 0 215 q 87 634 0 522 q 330 758 183 758 q 457 728 398 758 q 564 644 515 699 l 564 737 l 686 737 l 686 34 m 582 367 q 529 560 582 481 q 358 652 468 652 q 189 561 250 652 q 135 369 135 482 q 189 176 135 255 q 361 85 251 85 q 529 176 468 85 q 582 367 582 255 "},"²":{"x_min":0,"x_max":442,"ha":539,"o":"m 442 383 l 0 383 q 91 566 0 492 q 260 668 176 617 q 354 798 354 727 q 315 875 354 845 q 227 905 277 905 q 136 869 173 905 q 99 761 99 833 l 14 761 q 82 922 14 864 q 232 974 141 974 q 379 926 316 974 q 442 797 442 878 q 351 635 442 704 q 183 539 321 611 q 92 455 92 491 l 442 455 l 442 383 "},"–":{"x_min":0,"x_max":705.5625,"ha":803,"o":"m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 "},"Κ":{"x_min":0,"x_max":819.5625,"ha":893,"o":"m 819 0 l 650 0 l 294 509 l 139 356 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 "},"ƒ":{"x_min":-46.265625,"x_max":392,"ha":513,"o":"m 392 651 l 259 651 l 79 -279 l -46 -278 l 134 651 l 14 651 l 14 751 l 135 751 q 151 948 135 900 q 304 1041 185 1041 q 334 1040 319 1041 q 392 1034 348 1039 l 392 922 q 337 931 360 931 q 271 883 287 931 q 260 793 260 853 l 260 751 l 392 751 l 392 651 "},"e":{"x_min":0,"x_max":714,"ha":813,"o":"m 714 326 l 140 326 q 200 157 140 227 q 359 87 260 87 q 488 130 431 87 q 561 245 545 174 l 697 245 q 577 48 670 123 q 358 -26 484 -26 q 97 85 195 -26 q 0 363 0 197 q 94 642 0 529 q 358 765 195 765 q 626 627 529 765 q 714 326 714 503 m 576 429 q 507 583 564 522 q 355 650 445 650 q 206 583 266 650 q 140 429 152 522 l 576 429 "},"ό":{"x_min":0,"x_max":712,"ha":815,"o":"m 356 -25 q 94 91 194 -25 q 0 368 0 202 q 92 642 0 533 q 356 761 192 761 q 617 644 517 761 q 712 368 712 533 q 619 91 712 201 q 356 -25 520 -25 m 356 85 q 527 175 465 85 q 583 369 583 255 q 528 562 583 484 q 356 651 466 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 356 85 250 85 m 576 1040 l 387 819 l 303 819 l 438 1040 l 576 1040 "},"J":{"x_min":0,"x_max":588,"ha":699,"o":"m 588 279 q 287 -26 588 -26 q 58 73 126 -26 q 0 327 0 158 l 133 327 q 160 172 133 227 q 288 96 198 96 q 426 171 391 96 q 449 336 449 219 l 449 1013 l 588 1013 l 588 279 "},"»":{"x_min":-1,"x_max":503,"ha":601,"o":"m 503 302 l 280 136 l 281 256 l 429 373 l 281 486 l 280 608 l 503 440 l 503 302 m 221 302 l 0 136 l 0 255 l 145 372 l 0 486 l -1 608 l 221 440 l 221 302 "},"©":{"x_min":-3,"x_max":1008,"ha":1106,"o":"m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 741 394 q 661 246 731 302 q 496 190 591 190 q 294 285 369 190 q 228 497 228 370 q 295 714 228 625 q 499 813 370 813 q 656 762 588 813 q 733 625 724 711 l 634 625 q 589 704 629 673 q 498 735 550 735 q 377 666 421 735 q 334 504 334 597 q 374 340 334 408 q 490 272 415 272 q 589 304 549 272 q 638 394 628 337 l 741 394 "},"ώ":{"x_min":0,"x_max":922,"ha":1030,"o":"m 687 1040 l 498 819 l 415 819 l 549 1040 l 687 1040 m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 338 0 202 q 45 551 0 444 q 161 737 84 643 l 302 737 q 175 552 219 647 q 124 336 124 446 q 155 179 124 248 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 341 797 257 q 745 555 797 450 q 619 737 705 637 l 760 737 q 874 551 835 640 q 922 339 922 444 "},"^":{"x_min":193.0625,"x_max":598.609375,"ha":792,"o":"m 598 772 l 515 772 l 395 931 l 277 772 l 193 772 l 326 1013 l 462 1013 l 598 772 "},"«":{"x_min":0,"x_max":507.203125,"ha":604,"o":"m 506 136 l 284 302 l 284 440 l 506 608 l 507 485 l 360 371 l 506 255 l 506 136 m 222 136 l 0 302 l 0 440 l 222 608 l 221 486 l 73 373 l 222 256 l 222 136 "},"D":{"x_min":0,"x_max":828,"ha":935,"o":"m 389 1013 q 714 867 593 1013 q 828 521 828 729 q 712 161 828 309 q 382 0 587 0 l 0 0 l 0 1013 l 389 1013 m 376 124 q 607 247 523 124 q 681 510 681 355 q 607 771 681 662 q 376 896 522 896 l 139 896 l 139 124 l 376 124 "},"∙":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 "},"ÿ":{"x_min":0,"x_max":47,"ha":125,"o":"m 47 3 q 37 -7 47 -7 q 28 0 30 -7 q 39 -4 32 -4 q 45 3 45 -1 l 37 0 q 28 9 28 0 q 39 19 28 19 l 47 16 l 47 19 l 47 3 m 37 1 q 44 8 44 1 q 37 16 44 16 q 30 8 30 16 q 37 1 30 1 m 26 1 l 23 22 l 14 0 l 3 22 l 3 3 l 0 25 l 13 1 l 22 25 l 26 1 "},"w":{"x_min":0,"x_max":1009.71875,"ha":1100,"o":"m 1009 738 l 783 0 l 658 0 l 501 567 l 345 0 l 222 0 l 0 738 l 130 738 l 284 174 l 432 737 l 576 738 l 721 173 l 881 737 l 1009 738 "},"$":{"x_min":0,"x_max":700,"ha":793,"o":"m 664 717 l 542 717 q 490 825 531 785 q 381 872 450 865 l 381 551 q 620 446 540 522 q 700 241 700 370 q 618 45 700 116 q 381 -25 536 -25 l 381 -152 l 307 -152 l 307 -25 q 81 62 162 -25 q 0 297 0 149 l 124 297 q 169 146 124 204 q 307 81 215 89 l 307 441 q 80 536 148 469 q 13 725 13 603 q 96 910 13 839 q 307 982 180 982 l 307 1077 l 381 1077 l 381 982 q 574 917 494 982 q 664 717 664 845 m 307 565 l 307 872 q 187 831 233 872 q 142 724 142 791 q 180 618 142 656 q 307 565 218 580 m 381 76 q 562 237 562 96 q 517 361 562 313 q 381 423 472 409 l 381 76 "},"\\":{"x_min":-0.015625,"x_max":425.0625,"ha":522,"o":"m 425 -129 l 337 -129 l 0 1041 l 83 1041 l 425 -129 "},"µ":{"x_min":0,"x_max":697.21875,"ha":747,"o":"m 697 -4 q 629 -14 658 -14 q 498 97 513 -14 q 422 9 470 41 q 313 -23 374 -23 q 207 4 258 -23 q 119 81 156 32 l 119 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 173 124 246 q 308 83 216 83 q 452 178 402 83 q 493 359 493 255 l 493 738 l 617 738 l 617 214 q 623 136 617 160 q 673 92 637 92 q 697 96 684 92 l 697 -4 "},"Ι":{"x_min":42,"x_max":181,"ha":297,"o":"m 181 0 l 42 0 l 42 1013 l 181 1013 l 181 0 "},"Ύ":{"x_min":0,"x_max":1144.5,"ha":1214,"o":"m 1144 1012 l 807 416 l 807 0 l 667 0 l 667 416 l 325 1012 l 465 1012 l 736 533 l 1004 1012 l 1144 1012 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "},"’":{"x_min":0,"x_max":139,"ha":236,"o":"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 "},"Ν":{"x_min":0,"x_max":801,"ha":915,"o":"m 801 0 l 651 0 l 131 822 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 191 l 670 1013 l 801 1013 l 801 0 "},"-":{"x_min":8.71875,"x_max":350.390625,"ha":478,"o":"m 350 317 l 8 317 l 8 428 l 350 428 l 350 317 "},"Q":{"x_min":0,"x_max":968,"ha":1072,"o":"m 954 5 l 887 -79 l 744 35 q 622 -11 687 2 q 483 -26 556 -26 q 127 130 262 -26 q 0 504 0 279 q 127 880 0 728 q 484 1041 262 1041 q 841 884 708 1041 q 968 507 968 735 q 933 293 968 398 q 832 104 899 188 l 954 5 m 723 191 q 802 330 777 248 q 828 499 828 412 q 744 790 828 673 q 483 922 650 922 q 228 791 322 922 q 142 505 142 673 q 227 221 142 337 q 487 91 323 91 q 632 123 566 91 l 520 215 l 587 301 l 723 191 "},"ς":{"x_min":1,"x_max":676.28125,"ha":740,"o":"m 676 460 l 551 460 q 498 595 542 546 q 365 651 448 651 q 199 578 263 651 q 136 401 136 505 q 266 178 136 241 q 508 106 387 142 q 640 -50 640 62 q 625 -158 640 -105 q 583 -278 611 -211 l 465 -278 q 498 -182 490 -211 q 515 -80 515 -126 q 381 12 515 -15 q 134 91 197 51 q 1 388 1 179 q 100 651 1 542 q 354 761 199 761 q 587 680 498 761 q 676 460 676 599 "},"M":{"x_min":0,"x_max":954,"ha":1067,"o":"m 954 0 l 819 0 l 819 869 l 537 0 l 405 0 l 128 866 l 128 0 l 0 0 l 0 1013 l 200 1013 l 472 160 l 757 1013 l 954 1013 l 954 0 "},"Ψ":{"x_min":0,"x_max":1006,"ha":1094,"o":"m 1006 678 q 914 319 1006 429 q 571 200 814 200 l 571 0 l 433 0 l 433 200 q 92 319 194 200 q 0 678 0 429 l 0 1013 l 139 1013 l 139 679 q 191 417 139 492 q 433 326 255 326 l 433 1013 l 571 1013 l 571 326 l 580 326 q 813 423 747 326 q 868 679 868 502 l 868 1013 l 1006 1013 l 1006 678 "},"C":{"x_min":0,"x_max":886,"ha":944,"o":"m 886 379 q 760 87 886 201 q 455 -26 634 -26 q 112 136 236 -26 q 0 509 0 283 q 118 882 0 737 q 469 1041 245 1041 q 748 955 630 1041 q 879 708 879 859 l 745 708 q 649 862 724 805 q 473 920 573 920 q 219 791 312 920 q 136 509 136 675 q 217 229 136 344 q 470 99 311 99 q 672 179 591 99 q 753 379 753 259 l 886 379 "},"!":{"x_min":0,"x_max":138,"ha":236,"o":"m 138 684 q 116 409 138 629 q 105 244 105 299 l 33 244 q 16 465 33 313 q 0 684 0 616 l 0 1013 l 138 1013 l 138 684 m 138 0 l 0 0 l 0 151 l 138 151 l 138 0 "},"{":{"x_min":0,"x_max":480.5625,"ha":578,"o":"m 480 -286 q 237 -213 303 -286 q 187 -45 187 -159 q 194 48 187 -15 q 201 141 201 112 q 164 264 201 225 q 0 314 118 314 l 0 417 q 164 471 119 417 q 201 605 201 514 q 199 665 201 644 q 193 772 193 769 q 241 941 193 887 q 480 1015 308 1015 l 480 915 q 336 866 375 915 q 306 742 306 828 q 310 662 306 717 q 314 577 314 606 q 288 452 314 500 q 176 365 256 391 q 289 275 257 337 q 314 143 314 226 q 313 84 314 107 q 310 -11 310 -5 q 339 -131 310 -94 q 480 -182 377 -182 l 480 -286 "},"X":{"x_min":-0.015625,"x_max":854.15625,"ha":940,"o":"m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 428 637 l 675 1013 l 836 1013 l 504 520 l 854 0 "},"#":{"x_min":0,"x_max":963.890625,"ha":1061,"o":"m 963 690 l 927 590 l 719 590 l 655 410 l 876 410 l 840 310 l 618 310 l 508 -3 l 393 -2 l 506 309 l 329 310 l 215 -2 l 102 -3 l 212 310 l 0 310 l 36 410 l 248 409 l 312 590 l 86 590 l 120 690 l 347 690 l 459 1006 l 573 1006 l 462 690 l 640 690 l 751 1006 l 865 1006 l 754 690 l 963 690 m 606 590 l 425 590 l 362 410 l 543 410 l 606 590 "},"ι":{"x_min":42,"x_max":284,"ha":361,"o":"m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 738 l 167 738 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 103 239 101 q 284 112 257 104 l 284 3 "},"Ά":{"x_min":0,"x_max":906.953125,"ha":982,"o":"m 283 1040 l 88 799 l 5 799 l 145 1040 l 283 1040 m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1012 l 529 1012 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 "},")":{"x_min":0,"x_max":318,"ha":415,"o":"m 318 365 q 257 25 318 191 q 87 -290 197 -141 l 0 -290 q 140 21 93 -128 q 193 360 193 189 q 141 704 193 537 q 0 1024 97 850 l 87 1024 q 257 706 197 871 q 318 365 318 542 "},"ε":{"x_min":0,"x_max":634.71875,"ha":714,"o":"m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 314 0 265 q 128 390 67 353 q 56 460 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 "},"Δ":{"x_min":0,"x_max":952.78125,"ha":1028,"o":"m 952 0 l 0 0 l 400 1013 l 551 1013 l 952 0 m 762 124 l 476 867 l 187 124 l 762 124 "},"}":{"x_min":0,"x_max":481,"ha":578,"o":"m 481 314 q 318 262 364 314 q 282 136 282 222 q 284 65 282 97 q 293 -58 293 -48 q 241 -217 293 -166 q 0 -286 174 -286 l 0 -182 q 143 -130 105 -182 q 171 -2 171 -93 q 168 81 171 22 q 165 144 165 140 q 188 275 165 229 q 306 365 220 339 q 191 455 224 391 q 165 588 165 505 q 168 681 165 624 q 171 742 171 737 q 141 865 171 827 q 0 915 102 915 l 0 1015 q 243 942 176 1015 q 293 773 293 888 q 287 675 293 741 q 282 590 282 608 q 318 466 282 505 q 481 417 364 417 l 481 314 "},"‰":{"x_min":-3,"x_max":1672,"ha":1821,"o":"m 846 0 q 664 76 732 0 q 603 244 603 145 q 662 412 603 344 q 846 489 729 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 846 0 962 0 m 845 103 q 945 143 910 103 q 981 243 981 184 q 947 340 981 301 q 845 385 910 385 q 745 342 782 385 q 709 243 709 300 q 742 147 709 186 q 845 103 781 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 m 1428 0 q 1246 76 1314 0 q 1185 244 1185 145 q 1244 412 1185 344 q 1428 489 1311 489 q 1610 412 1542 489 q 1672 244 1672 343 q 1612 76 1672 144 q 1428 0 1545 0 m 1427 103 q 1528 143 1492 103 q 1564 243 1564 184 q 1530 340 1564 301 q 1427 385 1492 385 q 1327 342 1364 385 q 1291 243 1291 300 q 1324 147 1291 186 q 1427 103 1363 103 "},"a":{"x_min":0,"x_max":698.609375,"ha":794,"o":"m 698 0 q 661 -12 679 -7 q 615 -17 643 -17 q 536 12 564 -17 q 500 96 508 41 q 384 6 456 37 q 236 -25 312 -25 q 65 31 130 -25 q 0 194 0 88 q 118 390 0 334 q 328 435 180 420 q 488 483 476 451 q 495 523 495 504 q 442 619 495 584 q 325 654 389 654 q 209 617 257 654 q 152 513 161 580 l 33 513 q 123 705 33 633 q 332 772 207 772 q 528 712 448 772 q 617 531 617 645 l 617 163 q 624 108 617 126 q 664 90 632 90 l 698 94 l 698 0 m 491 262 l 491 372 q 272 329 350 347 q 128 201 128 294 q 166 113 128 144 q 264 83 205 83 q 414 130 346 83 q 491 262 491 183 "},"—":{"x_min":0,"x_max":941.671875,"ha":1039,"o":"m 941 334 l 0 334 l 0 410 l 941 410 l 941 334 "},"=":{"x_min":8.71875,"x_max":780.953125,"ha":792,"o":"m 780 510 l 8 510 l 8 606 l 780 606 l 780 510 m 780 235 l 8 235 l 8 332 l 780 332 l 780 235 "},"N":{"x_min":0,"x_max":801,"ha":914,"o":"m 801 0 l 651 0 l 131 823 l 131 0 l 0 0 l 0 1013 l 151 1013 l 670 193 l 670 1013 l 801 1013 l 801 0 "},"ρ":{"x_min":0,"x_max":712,"ha":797,"o":"m 712 369 q 620 94 712 207 q 362 -26 521 -26 q 230 2 292 -26 q 119 83 167 30 l 119 -278 l 0 -278 l 0 362 q 91 643 0 531 q 355 764 190 764 q 617 647 517 764 q 712 369 712 536 m 583 366 q 530 559 583 480 q 359 651 469 651 q 190 562 252 651 q 135 370 135 483 q 189 176 135 257 q 359 85 250 85 q 528 175 466 85 q 583 366 583 254 "},"2":{"x_min":59,"x_max":731,"ha":792,"o":"m 731 0 l 59 0 q 197 314 59 188 q 457 487 199 315 q 598 691 598 580 q 543 819 598 772 q 411 867 488 867 q 272 811 328 867 q 209 630 209 747 l 81 630 q 182 901 81 805 q 408 986 271 986 q 629 909 536 986 q 731 694 731 826 q 613 449 731 541 q 378 316 495 383 q 201 122 235 234 l 731 122 l 731 0 "},"¯":{"x_min":0,"x_max":941.671875,"ha":938,"o":"m 941 1033 l 0 1033 l 0 1109 l 941 1109 l 941 1033 "},"Z":{"x_min":0,"x_max":779,"ha":849,"o":"m 779 0 l 0 0 l 0 113 l 621 896 l 40 896 l 40 1013 l 779 1013 l 778 887 l 171 124 l 779 124 l 779 0 "},"u":{"x_min":0,"x_max":617,"ha":729,"o":"m 617 0 l 499 0 l 499 110 q 391 10 460 45 q 246 -25 322 -25 q 61 58 127 -25 q 0 258 0 136 l 0 738 l 125 738 l 125 284 q 156 148 125 202 q 273 82 197 82 q 433 165 369 82 q 493 340 493 243 l 493 738 l 617 738 l 617 0 "},"k":{"x_min":0,"x_max":612.484375,"ha":697,"o":"m 612 738 l 338 465 l 608 0 l 469 0 l 251 382 l 121 251 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 402 l 456 738 l 612 738 "},"Η":{"x_min":0,"x_max":803,"ha":917,"o":"m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 "},"Α":{"x_min":0,"x_max":906.953125,"ha":985,"o":"m 906 0 l 756 0 l 650 303 l 251 303 l 143 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 609 421 l 452 866 l 293 421 l 609 421 "},"s":{"x_min":0,"x_max":604,"ha":697,"o":"m 604 217 q 501 36 604 104 q 292 -23 411 -23 q 86 43 166 -23 q 0 238 0 114 l 121 237 q 175 122 121 164 q 300 85 223 85 q 415 112 363 85 q 479 207 479 147 q 361 309 479 276 q 140 372 141 370 q 21 544 21 426 q 111 708 21 647 q 298 761 190 761 q 492 705 413 761 q 583 531 583 643 l 462 531 q 412 625 462 594 q 298 657 363 657 q 199 636 242 657 q 143 558 143 608 q 262 454 143 486 q 484 394 479 397 q 604 217 604 341 "},"B":{"x_min":0,"x_max":778,"ha":876,"o":"m 580 546 q 724 469 670 535 q 778 311 778 403 q 673 83 778 171 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 892 q 691 633 732 693 q 580 546 650 572 m 393 899 l 139 899 l 139 588 l 379 588 q 521 624 462 588 q 592 744 592 667 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 303 635 219 q 559 436 635 389 q 402 477 494 477 l 139 477 l 139 124 l 419 124 "},"…":{"x_min":0,"x_max":614,"ha":708,"o":"m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 m 378 0 l 236 0 l 236 151 l 378 151 l 378 0 m 614 0 l 472 0 l 472 151 l 614 151 l 614 0 "},"?":{"x_min":0,"x_max":607,"ha":704,"o":"m 607 777 q 543 599 607 674 q 422 474 482 537 q 357 272 357 391 l 236 272 q 297 487 236 395 q 411 619 298 490 q 474 762 474 691 q 422 885 474 838 q 301 933 371 933 q 179 880 228 933 q 124 706 124 819 l 0 706 q 94 963 0 872 q 302 1044 177 1044 q 511 973 423 1044 q 607 777 607 895 m 370 0 l 230 0 l 230 151 l 370 151 l 370 0 "},"H":{"x_min":0,"x_max":803,"ha":915,"o":"m 803 0 l 667 0 l 667 475 l 140 475 l 140 0 l 0 0 l 0 1013 l 140 1013 l 140 599 l 667 599 l 667 1013 l 803 1013 l 803 0 "},"ν":{"x_min":0,"x_max":675,"ha":761,"o":"m 675 738 l 404 0 l 272 0 l 0 738 l 133 738 l 340 147 l 541 738 l 675 738 "},"c":{"x_min":1,"x_max":701.390625,"ha":775,"o":"m 701 264 q 584 53 681 133 q 353 -26 487 -26 q 91 91 188 -26 q 1 370 1 201 q 92 645 1 537 q 353 761 190 761 q 572 688 479 761 q 690 493 666 615 l 556 493 q 487 606 545 562 q 356 650 428 650 q 186 563 246 650 q 134 372 134 487 q 188 179 134 258 q 359 88 250 88 q 492 136 437 88 q 566 264 548 185 l 701 264 "},"¶":{"x_min":0,"x_max":566.671875,"ha":678,"o":"m 21 892 l 52 892 l 98 761 l 145 892 l 176 892 l 178 741 l 157 741 l 157 867 l 108 741 l 88 741 l 40 871 l 40 741 l 21 741 l 21 892 m 308 854 l 308 731 q 252 691 308 691 q 227 691 240 691 q 207 696 213 695 l 207 712 l 253 706 q 288 733 288 706 l 288 763 q 244 741 279 741 q 193 797 193 741 q 261 860 193 860 q 287 860 273 860 q 308 854 302 855 m 288 842 l 263 843 q 213 796 213 843 q 248 756 213 756 q 288 796 288 756 l 288 842 m 566 988 l 502 988 l 502 -1 l 439 -1 l 439 988 l 317 988 l 317 -1 l 252 -1 l 252 602 q 81 653 155 602 q 0 805 0 711 q 101 989 0 918 q 309 1053 194 1053 l 566 1053 l 566 988 "},"β":{"x_min":0,"x_max":660,"ha":745,"o":"m 471 550 q 610 450 561 522 q 660 280 660 378 q 578 64 660 151 q 367 -22 497 -22 q 239 5 299 -22 q 126 82 178 32 l 126 -278 l 0 -278 l 0 593 q 54 903 0 801 q 318 1042 127 1042 q 519 964 436 1042 q 603 771 603 887 q 567 644 603 701 q 471 550 532 586 m 337 79 q 476 138 418 79 q 535 279 535 198 q 427 437 535 386 q 226 477 344 477 l 226 583 q 398 620 329 583 q 486 762 486 668 q 435 884 486 833 q 312 935 384 935 q 169 861 219 935 q 126 698 126 797 l 126 362 q 170 169 126 242 q 337 79 224 79 "},"Μ":{"x_min":0,"x_max":954,"ha":1068,"o":"m 954 0 l 819 0 l 819 868 l 537 0 l 405 0 l 128 865 l 128 0 l 0 0 l 0 1013 l 199 1013 l 472 158 l 758 1013 l 954 1013 l 954 0 "},"Ό":{"x_min":0.109375,"x_max":1120,"ha":1217,"o":"m 1120 505 q 994 132 1120 282 q 642 -29 861 -29 q 290 130 422 -29 q 167 505 167 280 q 294 883 167 730 q 650 1046 430 1046 q 999 882 868 1046 q 1120 505 1120 730 m 977 504 q 896 784 977 669 q 644 915 804 915 q 391 785 484 915 q 307 504 307 669 q 391 224 307 339 q 644 95 486 95 q 894 224 803 95 q 977 504 977 339 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "},"Ή":{"x_min":0,"x_max":1158,"ha":1275,"o":"m 1158 0 l 1022 0 l 1022 475 l 496 475 l 496 0 l 356 0 l 356 1012 l 496 1012 l 496 599 l 1022 599 l 1022 1012 l 1158 1012 l 1158 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "},"•":{"x_min":0,"x_max":663.890625,"ha":775,"o":"m 663 529 q 566 293 663 391 q 331 196 469 196 q 97 294 194 196 q 0 529 0 393 q 96 763 0 665 q 331 861 193 861 q 566 763 469 861 q 663 529 663 665 "},"¥":{"x_min":0.1875,"x_max":819.546875,"ha":886,"o":"m 563 561 l 697 561 l 696 487 l 520 487 l 482 416 l 482 380 l 697 380 l 695 308 l 482 308 l 482 0 l 342 0 l 342 308 l 125 308 l 125 380 l 342 380 l 342 417 l 303 487 l 125 487 l 125 561 l 258 561 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 l 563 561 "},"(":{"x_min":0,"x_max":318.0625,"ha":415,"o":"m 318 -290 l 230 -290 q 61 23 122 -142 q 0 365 0 190 q 62 712 0 540 q 230 1024 119 869 l 318 1024 q 175 705 219 853 q 125 360 125 542 q 176 22 125 187 q 318 -290 223 -127 "},"U":{"x_min":0,"x_max":796,"ha":904,"o":"m 796 393 q 681 93 796 212 q 386 -25 566 -25 q 101 95 208 -25 q 0 393 0 211 l 0 1013 l 138 1013 l 138 391 q 204 191 138 270 q 394 107 276 107 q 586 191 512 107 q 656 391 656 270 l 656 1013 l 796 1013 l 796 393 "},"γ":{"x_min":0.5,"x_max":744.953125,"ha":822,"o":"m 744 737 l 463 54 l 463 -278 l 338 -278 l 338 54 l 154 495 q 104 597 124 569 q 13 651 67 651 l 0 651 l 0 751 l 39 753 q 168 711 121 753 q 242 594 207 676 l 403 208 l 617 737 l 744 737 "},"α":{"x_min":0,"x_max":765.5625,"ha":809,"o":"m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 728 407 760 q 563 637 524 696 l 563 739 l 685 739 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 96 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 "},"F":{"x_min":0,"x_max":683.328125,"ha":717,"o":"m 683 888 l 140 888 l 140 583 l 613 583 l 613 458 l 140 458 l 140 0 l 0 0 l 0 1013 l 683 1013 l 683 888 "},"­":{"x_min":0,"x_max":705.5625,"ha":803,"o":"m 705 334 l 0 334 l 0 410 l 705 410 l 705 334 "},":":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 "},"Χ":{"x_min":0,"x_max":854.171875,"ha":935,"o":"m 854 0 l 683 0 l 423 409 l 166 0 l 0 0 l 347 519 l 18 1013 l 186 1013 l 427 637 l 675 1013 l 836 1013 l 504 521 l 854 0 "},"*":{"x_min":116,"x_max":674,"ha":792,"o":"m 674 768 l 475 713 l 610 544 l 517 477 l 394 652 l 272 478 l 178 544 l 314 713 l 116 766 l 153 876 l 341 812 l 342 1013 l 446 1013 l 446 811 l 635 874 l 674 768 "},"†":{"x_min":0,"x_max":777,"ha":835,"o":"m 458 804 l 777 804 l 777 683 l 458 683 l 458 0 l 319 0 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 "},"°":{"x_min":0,"x_max":347,"ha":444,"o":"m 173 802 q 43 856 91 802 q 0 977 0 905 q 45 1101 0 1049 q 173 1153 90 1153 q 303 1098 255 1153 q 347 977 347 1049 q 303 856 347 905 q 173 802 256 802 m 173 884 q 238 910 214 884 q 262 973 262 937 q 239 1038 262 1012 q 173 1064 217 1064 q 108 1037 132 1064 q 85 973 85 1010 q 108 910 85 937 q 173 884 132 884 "},"V":{"x_min":0,"x_max":862.71875,"ha":940,"o":"m 862 1013 l 505 0 l 361 0 l 0 1013 l 143 1013 l 434 165 l 718 1012 l 862 1013 "},"Ξ":{"x_min":0,"x_max":734.71875,"ha":763,"o":"m 723 889 l 9 889 l 9 1013 l 723 1013 l 723 889 m 673 463 l 61 463 l 61 589 l 673 589 l 673 463 m 734 0 l 0 0 l 0 124 l 734 124 l 734 0 "}," ":{"x_min":0,"x_max":0,"ha":853},"Ϋ":{"x_min":0.328125,"x_max":819.515625,"ha":889,"o":"m 588 1046 l 460 1046 l 460 1189 l 588 1189 l 588 1046 m 360 1046 l 232 1046 l 232 1189 l 360 1189 l 360 1046 m 819 1012 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1012 l 140 1012 l 411 533 l 679 1012 l 819 1012 "},"0":{"x_min":73,"x_max":715,"ha":792,"o":"m 394 -29 q 153 129 242 -29 q 73 479 73 272 q 152 829 73 687 q 394 989 241 989 q 634 829 545 989 q 715 479 715 684 q 635 129 715 270 q 394 -29 546 -29 m 394 89 q 546 211 489 89 q 598 479 598 322 q 548 748 598 640 q 394 871 491 871 q 241 748 298 871 q 190 479 190 637 q 239 211 190 319 q 394 89 296 89 "},"”":{"x_min":0,"x_max":347,"ha":454,"o":"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 m 347 851 q 310 737 347 784 q 208 669 273 690 l 208 734 q 267 787 250 741 q 280 873 280 821 l 208 873 l 208 1013 l 347 1013 l 347 851 "},"@":{"x_min":0,"x_max":1260,"ha":1357,"o":"m 1098 -45 q 877 -160 1001 -117 q 633 -203 752 -203 q 155 -29 327 -203 q 0 360 0 127 q 176 802 0 616 q 687 1008 372 1008 q 1123 854 969 1008 q 1260 517 1260 718 q 1155 216 1260 341 q 868 82 1044 82 q 772 106 801 82 q 737 202 737 135 q 647 113 700 144 q 527 82 594 82 q 367 147 420 82 q 314 312 314 212 q 401 565 314 452 q 639 690 498 690 q 810 588 760 690 l 849 668 l 938 668 q 877 441 900 532 q 833 226 833 268 q 853 182 833 198 q 902 167 873 167 q 1088 272 1012 167 q 1159 512 1159 372 q 1051 793 1159 681 q 687 925 925 925 q 248 747 415 925 q 97 361 97 586 q 226 26 97 159 q 627 -122 370 -122 q 856 -87 737 -122 q 1061 8 976 -53 l 1098 -45 m 786 488 q 738 580 777 545 q 643 615 700 615 q 483 517 548 615 q 425 322 425 430 q 457 203 425 250 q 552 156 490 156 q 722 273 665 156 q 786 488 738 309 "},"Ί":{"x_min":0,"x_max":499,"ha":613,"o":"m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 m 499 0 l 360 0 l 360 1012 l 499 1012 l 499 0 "},"i":{"x_min":14,"x_max":136,"ha":275,"o":"m 136 873 l 14 873 l 14 1013 l 136 1013 l 136 873 m 136 0 l 14 0 l 14 737 l 136 737 l 136 0 "},"Β":{"x_min":0,"x_max":778,"ha":877,"o":"m 580 545 q 724 468 671 534 q 778 310 778 402 q 673 83 778 170 q 432 0 575 0 l 0 0 l 0 1013 l 411 1013 q 629 957 541 1013 q 732 768 732 891 q 691 632 732 692 q 580 545 650 571 m 393 899 l 139 899 l 139 587 l 379 587 q 521 623 462 587 q 592 744 592 666 q 531 859 592 819 q 393 899 471 899 m 419 124 q 566 169 504 124 q 635 302 635 219 q 559 435 635 388 q 402 476 494 476 l 139 476 l 139 124 l 419 124 "},"υ":{"x_min":0,"x_max":617,"ha":725,"o":"m 617 352 q 540 94 617 199 q 308 -24 455 -24 q 76 94 161 -24 q 0 352 0 199 l 0 739 l 126 739 l 126 355 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 355 492 257 l 492 739 l 617 739 l 617 352 "},"]":{"x_min":0,"x_max":275,"ha":372,"o":"m 275 -281 l 0 -281 l 0 -187 l 151 -187 l 151 920 l 0 920 l 0 1013 l 275 1013 l 275 -281 "},"m":{"x_min":0,"x_max":1019,"ha":1128,"o":"m 1019 0 l 897 0 l 897 454 q 860 591 897 536 q 739 660 816 660 q 613 586 659 660 q 573 436 573 522 l 573 0 l 447 0 l 447 455 q 412 591 447 535 q 294 657 372 657 q 165 586 213 657 q 122 437 122 521 l 122 0 l 0 0 l 0 738 l 117 738 l 117 640 q 202 730 150 697 q 316 763 254 763 q 437 730 381 763 q 525 642 494 697 q 621 731 559 700 q 753 763 682 763 q 943 694 867 763 q 1019 512 1019 625 l 1019 0 "},"χ":{"x_min":8.328125,"x_max":780.5625,"ha":815,"o":"m 780 -278 q 715 -294 747 -294 q 616 -257 663 -294 q 548 -175 576 -227 l 379 133 l 143 -277 l 9 -277 l 313 254 l 163 522 q 127 586 131 580 q 36 640 91 640 q 8 637 27 640 l 8 752 l 52 757 q 162 719 113 757 q 236 627 200 690 l 383 372 l 594 737 l 726 737 l 448 250 l 625 -69 q 670 -153 647 -110 q 743 -188 695 -188 q 780 -184 759 -188 l 780 -278 "},"8":{"x_min":55,"x_max":736,"ha":792,"o":"m 571 527 q 694 424 652 491 q 736 280 736 358 q 648 71 736 158 q 395 -26 551 -26 q 142 69 238 -26 q 55 279 55 157 q 96 425 55 359 q 220 527 138 491 q 120 615 153 562 q 88 726 88 668 q 171 904 88 827 q 395 986 261 986 q 618 905 529 986 q 702 727 702 830 q 670 616 702 667 q 571 527 638 565 m 394 565 q 519 610 475 565 q 563 717 563 655 q 521 823 563 781 q 392 872 474 872 q 265 824 312 872 q 224 720 224 783 q 265 613 224 656 q 394 565 312 565 m 395 91 q 545 150 488 91 q 597 280 597 204 q 546 408 597 355 q 395 465 492 465 q 244 408 299 465 q 194 280 194 356 q 244 150 194 203 q 395 91 299 91 "},"ί":{"x_min":42,"x_max":326.71875,"ha":361,"o":"m 284 3 q 233 -10 258 -5 q 182 -15 207 -15 q 85 26 119 -15 q 42 200 42 79 l 42 737 l 167 737 l 168 215 q 172 141 168 157 q 226 101 183 101 q 248 102 239 101 q 284 112 257 104 l 284 3 m 326 1040 l 137 819 l 54 819 l 189 1040 l 326 1040 "},"Ζ":{"x_min":0,"x_max":779.171875,"ha":850,"o":"m 779 0 l 0 0 l 0 113 l 620 896 l 40 896 l 40 1013 l 779 1013 l 779 887 l 170 124 l 779 124 l 779 0 "},"R":{"x_min":0,"x_max":781.953125,"ha":907,"o":"m 781 0 l 623 0 q 587 242 590 52 q 407 433 585 433 l 138 433 l 138 0 l 0 0 l 0 1013 l 396 1013 q 636 946 539 1013 q 749 731 749 868 q 711 597 749 659 q 608 502 674 534 q 718 370 696 474 q 729 207 722 352 q 781 26 736 62 l 781 0 m 373 551 q 533 594 465 551 q 614 731 614 645 q 532 859 614 815 q 373 896 465 896 l 138 896 l 138 551 l 373 551 "},"o":{"x_min":0,"x_max":713,"ha":821,"o":"m 357 -25 q 94 91 194 -25 q 0 368 0 202 q 93 642 0 533 q 357 761 193 761 q 618 644 518 761 q 713 368 713 533 q 619 91 713 201 q 357 -25 521 -25 m 357 85 q 528 175 465 85 q 584 369 584 255 q 529 562 584 484 q 357 651 467 651 q 189 560 250 651 q 135 369 135 481 q 187 177 135 257 q 357 85 250 85 "},"5":{"x_min":54.171875,"x_max":738,"ha":792,"o":"m 738 314 q 626 60 738 153 q 382 -23 526 -23 q 155 47 248 -23 q 54 256 54 125 l 183 256 q 259 132 204 174 q 382 91 314 91 q 533 149 471 91 q 602 314 602 213 q 538 469 602 411 q 386 528 475 528 q 284 506 332 528 q 197 439 237 484 l 81 439 l 159 958 l 684 958 l 684 840 l 254 840 l 214 579 q 306 627 258 612 q 407 643 354 643 q 636 552 540 643 q 738 314 738 457 "},"7":{"x_min":58.71875,"x_max":730.953125,"ha":792,"o":"m 730 839 q 469 448 560 641 q 335 0 378 255 l 192 0 q 328 441 235 252 q 593 830 421 630 l 58 830 l 58 958 l 730 958 l 730 839 "},"K":{"x_min":0,"x_max":819.46875,"ha":906,"o":"m 819 0 l 649 0 l 294 509 l 139 355 l 139 0 l 0 0 l 0 1013 l 139 1013 l 139 526 l 626 1013 l 809 1013 l 395 600 l 819 0 "},",":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 -12 q 105 -132 142 -82 q 0 -205 68 -182 l 0 -138 q 57 -82 40 -124 q 70 0 70 -51 l 0 0 l 0 151 l 142 151 l 142 -12 "},"d":{"x_min":0,"x_max":683,"ha":796,"o":"m 683 0 l 564 0 l 564 93 q 456 6 516 38 q 327 -25 395 -25 q 87 100 181 -25 q 0 365 0 215 q 90 639 0 525 q 343 763 187 763 q 564 647 486 763 l 564 1013 l 683 1013 l 683 0 m 582 373 q 529 562 582 484 q 361 653 468 653 q 190 561 253 653 q 135 365 135 479 q 189 175 135 254 q 358 85 251 85 q 529 178 468 85 q 582 373 582 258 "},"¨":{"x_min":-109,"x_max":247,"ha":232,"o":"m 247 1046 l 119 1046 l 119 1189 l 247 1189 l 247 1046 m 19 1046 l -109 1046 l -109 1189 l 19 1189 l 19 1046 "},"E":{"x_min":0,"x_max":736.109375,"ha":789,"o":"m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 "},"Y":{"x_min":0,"x_max":820,"ha":886,"o":"m 820 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 534 l 679 1012 l 820 1013 "},"\"":{"x_min":0,"x_max":299,"ha":396,"o":"m 299 606 l 203 606 l 203 988 l 299 988 l 299 606 m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 "},"‹":{"x_min":17.984375,"x_max":773.609375,"ha":792,"o":"m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 "},"„":{"x_min":0,"x_max":364,"ha":467,"o":"m 141 -12 q 104 -132 141 -82 q 0 -205 67 -182 l 0 -138 q 56 -82 40 -124 q 69 0 69 -51 l 0 0 l 0 151 l 141 151 l 141 -12 m 364 -12 q 327 -132 364 -82 q 222 -205 290 -182 l 222 -138 q 279 -82 262 -124 q 292 0 292 -51 l 222 0 l 222 151 l 364 151 l 364 -12 "},"δ":{"x_min":1,"x_max":710,"ha":810,"o":"m 710 360 q 616 87 710 196 q 356 -28 518 -28 q 99 82 197 -28 q 1 356 1 192 q 100 606 1 509 q 355 703 199 703 q 180 829 288 754 q 70 903 124 866 l 70 1012 l 643 1012 l 643 901 l 258 901 q 462 763 422 794 q 636 592 577 677 q 710 360 710 485 m 584 365 q 552 501 584 447 q 451 602 521 555 q 372 611 411 611 q 197 541 258 611 q 136 355 136 472 q 190 171 136 245 q 358 85 252 85 q 528 173 465 85 q 584 365 584 252 "},"έ":{"x_min":0,"x_max":634.71875,"ha":714,"o":"m 634 234 q 527 38 634 110 q 300 -25 433 -25 q 98 29 183 -25 q 0 204 0 93 q 37 313 0 265 q 128 390 67 352 q 56 459 82 419 q 26 555 26 505 q 114 712 26 654 q 295 763 191 763 q 499 700 416 763 q 589 515 589 631 l 478 515 q 419 618 464 580 q 307 657 374 657 q 207 630 253 657 q 151 547 151 598 q 238 445 151 469 q 389 434 280 434 l 389 331 l 349 331 q 206 315 255 331 q 125 210 125 287 q 183 107 125 145 q 302 76 233 76 q 436 117 379 76 q 509 234 493 159 l 634 234 m 520 1040 l 331 819 l 248 819 l 383 1040 l 520 1040 "},"ω":{"x_min":0,"x_max":922,"ha":1031,"o":"m 922 339 q 856 97 922 203 q 650 -26 780 -26 q 538 9 587 -26 q 461 103 489 44 q 387 12 436 46 q 277 -22 339 -22 q 69 97 147 -22 q 0 339 0 203 q 45 551 0 444 q 161 738 84 643 l 302 738 q 175 553 219 647 q 124 336 124 446 q 155 179 124 249 q 275 88 197 88 q 375 163 341 88 q 400 294 400 219 l 400 572 l 524 572 l 524 294 q 561 135 524 192 q 643 88 591 88 q 762 182 719 88 q 797 342 797 257 q 745 556 797 450 q 619 738 705 638 l 760 738 q 874 551 835 640 q 922 339 922 444 "},"´":{"x_min":0,"x_max":96,"ha":251,"o":"m 96 606 l 0 606 l 0 988 l 96 988 l 96 606 "},"±":{"x_min":11,"x_max":781,"ha":792,"o":"m 781 490 l 446 490 l 446 255 l 349 255 l 349 490 l 11 490 l 11 586 l 349 586 l 349 819 l 446 819 l 446 586 l 781 586 l 781 490 m 781 21 l 11 21 l 11 115 l 781 115 l 781 21 "},"|":{"x_min":343,"x_max":449,"ha":792,"o":"m 449 462 l 343 462 l 343 986 l 449 986 l 449 462 m 449 -242 l 343 -242 l 343 280 l 449 280 l 449 -242 "},"ϋ":{"x_min":0,"x_max":617,"ha":725,"o":"m 482 800 l 372 800 l 372 925 l 482 925 l 482 800 m 239 800 l 129 800 l 129 925 l 239 925 l 239 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 "},"§":{"x_min":0,"x_max":593,"ha":690,"o":"m 593 425 q 554 312 593 369 q 467 233 516 254 q 537 83 537 172 q 459 -74 537 -12 q 288 -133 387 -133 q 115 -69 184 -133 q 47 96 47 -6 l 166 96 q 199 7 166 40 q 288 -26 232 -26 q 371 -5 332 -26 q 420 60 420 21 q 311 201 420 139 q 108 309 210 255 q 0 490 0 383 q 33 602 0 551 q 124 687 66 654 q 75 743 93 712 q 58 812 58 773 q 133 984 58 920 q 300 1043 201 1043 q 458 987 394 1043 q 529 814 529 925 l 411 814 q 370 908 404 877 q 289 939 336 939 q 213 911 246 939 q 180 841 180 883 q 286 720 180 779 q 484 612 480 615 q 593 425 593 534 m 467 409 q 355 544 467 473 q 196 630 228 612 q 146 587 162 609 q 124 525 124 558 q 239 387 124 462 q 398 298 369 315 q 448 345 429 316 q 467 409 467 375 "},"b":{"x_min":0,"x_max":685,"ha":783,"o":"m 685 372 q 597 99 685 213 q 347 -25 501 -25 q 219 5 277 -25 q 121 93 161 36 l 121 0 l 0 0 l 0 1013 l 121 1013 l 121 634 q 214 723 157 692 q 341 754 272 754 q 591 637 493 754 q 685 372 685 526 m 554 356 q 499 550 554 470 q 328 644 437 644 q 162 556 223 644 q 108 369 108 478 q 160 176 108 256 q 330 83 221 83 q 498 169 435 83 q 554 356 554 245 "},"q":{"x_min":0,"x_max":683,"ha":876,"o":"m 683 -278 l 564 -278 l 564 97 q 474 8 533 39 q 345 -23 415 -23 q 91 93 188 -23 q 0 364 0 203 q 87 635 0 522 q 337 760 184 760 q 466 727 408 760 q 564 637 523 695 l 564 737 l 683 737 l 683 -278 m 582 375 q 527 564 582 488 q 358 652 466 652 q 190 565 253 652 q 135 377 135 488 q 189 179 135 261 q 361 84 251 84 q 530 179 469 84 q 582 375 582 260 "},"Ω":{"x_min":-0.171875,"x_max":969.5625,"ha":1068,"o":"m 969 0 l 555 0 l 555 123 q 744 308 675 194 q 814 558 814 423 q 726 812 814 709 q 484 922 633 922 q 244 820 334 922 q 154 567 154 719 q 223 316 154 433 q 412 123 292 199 l 412 0 l 0 0 l 0 124 l 217 124 q 68 327 122 210 q 15 572 15 444 q 144 911 15 781 q 484 1041 274 1041 q 822 909 691 1041 q 953 569 953 777 q 899 326 953 443 q 750 124 846 210 l 969 124 l 969 0 "},"ύ":{"x_min":0,"x_max":617,"ha":725,"o":"m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 535 1040 l 346 819 l 262 819 l 397 1040 l 535 1040 "},"z":{"x_min":-0.015625,"x_max":613.890625,"ha":697,"o":"m 613 0 l 0 0 l 0 100 l 433 630 l 20 630 l 20 738 l 594 738 l 593 636 l 163 110 l 613 110 l 613 0 "},"™":{"x_min":0,"x_max":894,"ha":1000,"o":"m 389 951 l 229 951 l 229 503 l 160 503 l 160 951 l 0 951 l 0 1011 l 389 1011 l 389 951 m 894 503 l 827 503 l 827 939 l 685 503 l 620 503 l 481 937 l 481 503 l 417 503 l 417 1011 l 517 1011 l 653 580 l 796 1010 l 894 1011 l 894 503 "},"ή":{"x_min":0.78125,"x_max":697,"ha":810,"o":"m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 721 124 755 q 200 630 193 687 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 m 479 1040 l 290 819 l 207 819 l 341 1040 l 479 1040 "},"Θ":{"x_min":0,"x_max":960,"ha":1056,"o":"m 960 507 q 833 129 960 280 q 476 -32 698 -32 q 123 129 255 -32 q 0 507 0 280 q 123 883 0 732 q 476 1045 255 1045 q 832 883 696 1045 q 960 507 960 732 m 817 500 q 733 789 817 669 q 476 924 639 924 q 223 792 317 924 q 142 507 142 675 q 222 222 142 339 q 476 89 315 89 q 730 218 636 89 q 817 500 817 334 m 716 449 l 243 449 l 243 571 l 716 571 l 716 449 "},"®":{"x_min":-3,"x_max":1008,"ha":1106,"o":"m 503 532 q 614 562 566 532 q 672 658 672 598 q 614 747 672 716 q 503 772 569 772 l 338 772 l 338 532 l 503 532 m 502 -7 q 123 151 263 -7 q -3 501 -3 294 q 123 851 -3 706 q 502 1011 263 1011 q 881 851 739 1011 q 1008 501 1008 708 q 883 151 1008 292 q 502 -7 744 -7 m 502 60 q 830 197 709 60 q 940 501 940 322 q 831 805 940 681 q 502 944 709 944 q 174 805 296 944 q 65 501 65 680 q 173 197 65 320 q 502 60 294 60 m 788 146 l 678 146 q 653 316 655 183 q 527 449 652 449 l 338 449 l 338 146 l 241 146 l 241 854 l 518 854 q 688 808 621 854 q 766 658 766 755 q 739 563 766 607 q 668 497 713 519 q 751 331 747 472 q 788 164 756 190 l 788 146 "},"~":{"x_min":0,"x_max":833,"ha":931,"o":"m 833 958 q 778 753 833 831 q 594 665 716 665 q 402 761 502 665 q 240 857 302 857 q 131 795 166 857 q 104 665 104 745 l 0 665 q 54 867 0 789 q 237 958 116 958 q 429 861 331 958 q 594 765 527 765 q 704 827 670 765 q 729 958 729 874 l 833 958 "},"Ε":{"x_min":0,"x_max":736.21875,"ha":778,"o":"m 736 0 l 0 0 l 0 1013 l 725 1013 l 725 889 l 139 889 l 139 585 l 677 585 l 677 467 l 139 467 l 139 125 l 736 125 l 736 0 "},"³":{"x_min":0,"x_max":450,"ha":547,"o":"m 450 552 q 379 413 450 464 q 220 366 313 366 q 69 414 130 366 q 0 567 0 470 l 85 567 q 126 470 85 504 q 225 437 168 437 q 320 467 280 437 q 360 552 360 498 q 318 632 360 608 q 213 657 276 657 q 195 657 203 657 q 176 657 181 657 l 176 722 q 279 733 249 722 q 334 815 334 752 q 300 881 334 856 q 220 907 267 907 q 133 875 169 907 q 97 781 97 844 l 15 781 q 78 926 15 875 q 220 972 135 972 q 364 930 303 972 q 426 817 426 888 q 344 697 426 733 q 421 642 392 681 q 450 552 450 603 "},"[":{"x_min":0,"x_max":273.609375,"ha":371,"o":"m 273 -281 l 0 -281 l 0 1013 l 273 1013 l 273 920 l 124 920 l 124 -187 l 273 -187 l 273 -281 "},"L":{"x_min":0,"x_max":645.828125,"ha":696,"o":"m 645 0 l 0 0 l 0 1013 l 140 1013 l 140 126 l 645 126 l 645 0 "},"σ":{"x_min":0,"x_max":803.390625,"ha":894,"o":"m 803 628 l 633 628 q 713 368 713 512 q 618 93 713 204 q 357 -25 518 -25 q 94 91 194 -25 q 0 368 0 201 q 94 644 0 533 q 356 761 194 761 q 481 750 398 761 q 608 739 564 739 l 803 739 l 803 628 m 360 85 q 529 180 467 85 q 584 374 584 262 q 527 566 584 490 q 352 651 463 651 q 187 559 247 651 q 135 368 135 478 q 189 175 135 254 q 360 85 251 85 "},"ζ":{"x_min":0,"x_max":573,"ha":642,"o":"m 573 -40 q 553 -162 573 -97 q 510 -278 543 -193 l 400 -278 q 441 -187 428 -219 q 462 -90 462 -132 q 378 -14 462 -14 q 108 45 197 -14 q 0 290 0 117 q 108 631 0 462 q 353 901 194 767 l 55 901 l 55 1012 l 561 1012 l 561 924 q 261 669 382 831 q 128 301 128 489 q 243 117 128 149 q 458 98 350 108 q 573 -40 573 80 "},"θ":{"x_min":0,"x_max":674,"ha":778,"o":"m 674 496 q 601 160 674 304 q 336 -26 508 -26 q 73 153 165 -26 q 0 485 0 296 q 72 840 0 683 q 343 1045 166 1045 q 605 844 516 1045 q 674 496 674 692 m 546 579 q 498 798 546 691 q 336 935 437 935 q 178 798 237 935 q 126 579 137 701 l 546 579 m 546 475 l 126 475 q 170 233 126 348 q 338 80 230 80 q 504 233 447 80 q 546 475 546 346 "},"Ο":{"x_min":0,"x_max":958,"ha":1054,"o":"m 485 1042 q 834 883 703 1042 q 958 511 958 735 q 834 136 958 287 q 481 -26 701 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 729 q 485 1042 263 1042 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 670 q 480 913 640 913 q 226 785 321 913 q 142 504 142 671 q 226 224 142 339 q 480 98 319 98 "},"Γ":{"x_min":0,"x_max":705.28125,"ha":749,"o":"m 705 886 l 140 886 l 140 0 l 0 0 l 0 1012 l 705 1012 l 705 886 "}," ":{"x_min":0,"x_max":0,"ha":375},"%":{"x_min":-3,"x_max":1089,"ha":1186,"o":"m 845 0 q 663 76 731 0 q 602 244 602 145 q 661 412 602 344 q 845 489 728 489 q 1027 412 959 489 q 1089 244 1089 343 q 1029 76 1089 144 q 845 0 962 0 m 844 103 q 945 143 909 103 q 981 243 981 184 q 947 340 981 301 q 844 385 909 385 q 744 342 781 385 q 708 243 708 300 q 741 147 708 186 q 844 103 780 103 m 888 986 l 284 -25 l 199 -25 l 803 986 l 888 986 m 241 468 q 58 545 126 468 q -3 715 -3 615 q 56 881 -3 813 q 238 958 124 958 q 421 881 353 958 q 483 712 483 813 q 423 544 483 612 q 241 468 356 468 m 241 855 q 137 811 175 855 q 100 710 100 768 q 136 612 100 653 q 240 572 172 572 q 344 614 306 572 q 382 713 382 656 q 347 810 382 771 q 241 855 308 855 "},"P":{"x_min":0,"x_max":726,"ha":806,"o":"m 424 1013 q 640 931 555 1013 q 726 719 726 850 q 637 506 726 587 q 413 426 548 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 379 889 l 140 889 l 140 548 l 372 548 q 522 589 459 548 q 593 720 593 637 q 528 845 593 801 q 379 889 463 889 "},"Έ":{"x_min":0,"x_max":1078.21875,"ha":1118,"o":"m 1078 0 l 342 0 l 342 1013 l 1067 1013 l 1067 889 l 481 889 l 481 585 l 1019 585 l 1019 467 l 481 467 l 481 125 l 1078 125 l 1078 0 m 277 1040 l 83 799 l 0 799 l 140 1040 l 277 1040 "},"Ώ":{"x_min":0.125,"x_max":1136.546875,"ha":1235,"o":"m 1136 0 l 722 0 l 722 123 q 911 309 842 194 q 981 558 981 423 q 893 813 981 710 q 651 923 800 923 q 411 821 501 923 q 321 568 321 720 q 390 316 321 433 q 579 123 459 200 l 579 0 l 166 0 l 166 124 l 384 124 q 235 327 289 210 q 182 572 182 444 q 311 912 182 782 q 651 1042 441 1042 q 989 910 858 1042 q 1120 569 1120 778 q 1066 326 1120 443 q 917 124 1013 210 l 1136 124 l 1136 0 m 277 1040 l 83 800 l 0 800 l 140 1041 l 277 1040 "},"_":{"x_min":0,"x_max":705.5625,"ha":803,"o":"m 705 -334 l 0 -334 l 0 -234 l 705 -234 l 705 -334 "},"Ϊ":{"x_min":-110,"x_max":246,"ha":275,"o":"m 246 1046 l 118 1046 l 118 1189 l 246 1189 l 246 1046 m 18 1046 l -110 1046 l -110 1189 l 18 1189 l 18 1046 m 136 0 l 0 0 l 0 1012 l 136 1012 l 136 0 "},"+":{"x_min":23,"x_max":768,"ha":792,"o":"m 768 372 l 444 372 l 444 0 l 347 0 l 347 372 l 23 372 l 23 468 l 347 468 l 347 840 l 444 840 l 444 468 l 768 468 l 768 372 "},"½":{"x_min":0,"x_max":1050,"ha":1149,"o":"m 1050 0 l 625 0 q 712 178 625 108 q 878 277 722 187 q 967 385 967 328 q 932 456 967 429 q 850 484 897 484 q 759 450 798 484 q 721 352 721 416 l 640 352 q 706 502 640 448 q 851 551 766 551 q 987 509 931 551 q 1050 385 1050 462 q 976 251 1050 301 q 829 179 902 215 q 717 68 740 133 l 1050 68 l 1050 0 m 834 985 l 215 -28 l 130 -28 l 750 984 l 834 985 m 224 422 l 142 422 l 142 811 l 0 811 l 0 867 q 104 889 62 867 q 164 973 157 916 l 224 973 l 224 422 "},"Ρ":{"x_min":0,"x_max":720,"ha":783,"o":"m 424 1013 q 637 933 554 1013 q 720 723 720 853 q 633 508 720 591 q 413 426 546 426 l 140 426 l 140 0 l 0 0 l 0 1013 l 424 1013 m 378 889 l 140 889 l 140 548 l 371 548 q 521 589 458 548 q 592 720 592 637 q 527 845 592 801 q 378 889 463 889 "},"'":{"x_min":0,"x_max":139,"ha":236,"o":"m 139 851 q 102 737 139 784 q 0 669 65 690 l 0 734 q 59 787 42 741 q 72 873 72 821 l 0 873 l 0 1013 l 139 1013 l 139 851 "},"ª":{"x_min":0,"x_max":350,"ha":397,"o":"m 350 625 q 307 616 328 616 q 266 631 281 616 q 247 673 251 645 q 190 628 225 644 q 116 613 156 613 q 32 641 64 613 q 0 722 0 669 q 72 826 0 800 q 247 866 159 846 l 247 887 q 220 934 247 916 q 162 953 194 953 q 104 934 129 953 q 76 882 80 915 l 16 882 q 60 976 16 941 q 166 1011 104 1011 q 266 979 224 1011 q 308 891 308 948 l 308 706 q 311 679 308 688 q 331 670 315 670 l 350 672 l 350 625 m 247 757 l 247 811 q 136 790 175 798 q 64 726 64 773 q 83 682 64 697 q 132 667 103 667 q 207 690 174 667 q 247 757 247 718 "},"΅":{"x_min":0,"x_max":450,"ha":553,"o":"m 450 800 l 340 800 l 340 925 l 450 925 l 450 800 m 406 1040 l 212 800 l 129 800 l 269 1040 l 406 1040 m 110 800 l 0 800 l 0 925 l 110 925 l 110 800 "},"T":{"x_min":0,"x_max":777,"ha":835,"o":"m 777 894 l 458 894 l 458 0 l 319 0 l 319 894 l 0 894 l 0 1013 l 777 1013 l 777 894 "},"Φ":{"x_min":0,"x_max":915,"ha":997,"o":"m 527 0 l 389 0 l 389 122 q 110 231 220 122 q 0 509 0 340 q 110 785 0 677 q 389 893 220 893 l 389 1013 l 527 1013 l 527 893 q 804 786 693 893 q 915 509 915 679 q 805 231 915 341 q 527 122 696 122 l 527 0 m 527 226 q 712 310 641 226 q 779 507 779 389 q 712 705 779 627 q 527 787 641 787 l 527 226 m 389 226 l 389 787 q 205 698 275 775 q 136 505 136 620 q 206 308 136 391 q 389 226 276 226 "},"⁋":{"x_min":0,"x_max":0,"ha":694},"j":{"x_min":-77.78125,"x_max":167,"ha":349,"o":"m 167 871 l 42 871 l 42 1013 l 167 1013 l 167 871 m 167 -80 q 121 -231 167 -184 q -26 -278 76 -278 l -77 -278 l -77 -164 l -41 -164 q 26 -143 11 -164 q 42 -65 42 -122 l 42 737 l 167 737 l 167 -80 "},"Σ":{"x_min":0,"x_max":756.953125,"ha":819,"o":"m 756 0 l 0 0 l 0 107 l 395 523 l 22 904 l 22 1013 l 745 1013 l 745 889 l 209 889 l 566 523 l 187 125 l 756 125 l 756 0 "},"1":{"x_min":215.671875,"x_max":574,"ha":792,"o":"m 574 0 l 442 0 l 442 697 l 215 697 l 215 796 q 386 833 330 796 q 475 986 447 875 l 574 986 l 574 0 "},"›":{"x_min":18.0625,"x_max":774,"ha":792,"o":"m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 "},"<":{"x_min":17.984375,"x_max":773.609375,"ha":792,"o":"m 773 40 l 18 376 l 17 465 l 773 799 l 773 692 l 159 420 l 773 149 l 773 40 "},"£":{"x_min":0,"x_max":704.484375,"ha":801,"o":"m 704 41 q 623 -10 664 5 q 543 -26 583 -26 q 359 15 501 -26 q 243 36 288 36 q 158 23 197 36 q 73 -21 119 10 l 6 76 q 125 195 90 150 q 175 331 175 262 q 147 443 175 383 l 0 443 l 0 512 l 108 512 q 43 734 43 623 q 120 929 43 854 q 358 1010 204 1010 q 579 936 487 1010 q 678 729 678 857 l 678 684 l 552 684 q 504 838 552 780 q 362 896 457 896 q 216 852 263 896 q 176 747 176 815 q 199 627 176 697 q 248 512 217 574 l 468 512 l 468 443 l 279 443 q 297 356 297 398 q 230 194 297 279 q 153 107 211 170 q 227 133 190 125 q 293 142 264 142 q 410 119 339 142 q 516 96 482 96 q 579 105 550 96 q 648 142 608 115 l 704 41 "},"t":{"x_min":0,"x_max":367,"ha":458,"o":"m 367 0 q 312 -5 339 -2 q 262 -8 284 -8 q 145 28 183 -8 q 108 143 108 64 l 108 638 l 0 638 l 0 738 l 108 738 l 108 944 l 232 944 l 232 738 l 367 738 l 367 638 l 232 638 l 232 185 q 248 121 232 140 q 307 102 264 102 q 345 104 330 102 q 367 107 360 107 l 367 0 "},"¬":{"x_min":0,"x_max":706,"ha":803,"o":"m 706 411 l 706 158 l 630 158 l 630 335 l 0 335 l 0 411 l 706 411 "},"λ":{"x_min":0,"x_max":750,"ha":803,"o":"m 750 -7 q 679 -15 716 -15 q 538 59 591 -15 q 466 214 512 97 l 336 551 l 126 0 l 0 0 l 270 705 q 223 837 247 770 q 116 899 190 899 q 90 898 100 899 l 90 1004 q 152 1011 125 1011 q 298 938 244 1011 q 373 783 326 901 l 605 192 q 649 115 629 136 q 716 95 669 95 l 736 95 q 750 97 745 97 l 750 -7 "},"W":{"x_min":0,"x_max":1263.890625,"ha":1351,"o":"m 1263 1013 l 995 0 l 859 0 l 627 837 l 405 0 l 265 0 l 0 1013 l 136 1013 l 342 202 l 556 1013 l 701 1013 l 921 207 l 1133 1012 l 1263 1013 "},">":{"x_min":18.0625,"x_max":774,"ha":792,"o":"m 774 376 l 18 40 l 18 149 l 631 421 l 18 692 l 18 799 l 774 465 l 774 376 "},"v":{"x_min":0,"x_max":675.15625,"ha":761,"o":"m 675 738 l 404 0 l 272 0 l 0 738 l 133 737 l 340 147 l 541 737 l 675 738 "},"τ":{"x_min":0.28125,"x_max":644.5,"ha":703,"o":"m 644 628 l 382 628 l 382 179 q 388 120 382 137 q 436 91 401 91 q 474 94 447 91 q 504 97 501 97 l 504 0 q 454 -9 482 -5 q 401 -14 426 -14 q 278 67 308 -14 q 260 233 260 118 l 260 628 l 0 628 l 0 739 l 644 739 l 644 628 "},"ξ":{"x_min":0,"x_max":624.9375,"ha":699,"o":"m 624 -37 q 608 -153 624 -96 q 563 -278 593 -211 l 454 -278 q 491 -183 486 -200 q 511 -83 511 -126 q 484 -23 511 -44 q 370 1 452 1 q 323 0 354 1 q 283 -1 293 -1 q 84 76 169 -1 q 0 266 0 154 q 56 431 0 358 q 197 538 108 498 q 94 613 134 562 q 54 730 54 665 q 77 823 54 780 q 143 901 101 867 l 27 901 l 27 1012 l 576 1012 l 576 901 l 380 901 q 244 863 303 901 q 178 745 178 820 q 312 600 178 636 q 532 582 380 582 l 532 479 q 276 455 361 479 q 118 281 118 410 q 165 173 118 217 q 274 120 208 133 q 494 101 384 110 q 624 -37 624 76 "},"&":{"x_min":-3,"x_max":894.25,"ha":992,"o":"m 894 0 l 725 0 l 624 123 q 471 0 553 40 q 306 -41 390 -41 q 168 -7 231 -41 q 62 92 105 26 q 14 187 31 139 q -3 276 -3 235 q 55 433 -3 358 q 248 581 114 508 q 170 689 196 640 q 137 817 137 751 q 214 985 137 922 q 384 1041 284 1041 q 548 988 483 1041 q 622 824 622 928 q 563 666 622 739 q 431 556 516 608 l 621 326 q 649 407 639 361 q 663 493 653 426 l 781 493 q 703 229 781 352 l 894 0 m 504 818 q 468 908 504 877 q 384 940 433 940 q 293 907 331 940 q 255 818 255 875 q 289 714 255 767 q 363 628 313 678 q 477 729 446 682 q 504 818 504 771 m 556 209 l 314 499 q 179 395 223 449 q 135 283 135 341 q 146 222 135 253 q 183 158 158 192 q 333 80 241 80 q 556 209 448 80 "},"Λ":{"x_min":0,"x_max":862.5,"ha":942,"o":"m 862 0 l 719 0 l 426 847 l 143 0 l 0 0 l 356 1013 l 501 1013 l 862 0 "},"I":{"x_min":41,"x_max":180,"ha":293,"o":"m 180 0 l 41 0 l 41 1013 l 180 1013 l 180 0 "},"G":{"x_min":0,"x_max":921,"ha":1011,"o":"m 921 0 l 832 0 l 801 136 q 655 15 741 58 q 470 -28 568 -28 q 126 133 259 -28 q 0 499 0 284 q 125 881 0 731 q 486 1043 259 1043 q 763 957 647 1043 q 905 709 890 864 l 772 709 q 668 866 747 807 q 486 926 589 926 q 228 795 322 926 q 142 507 142 677 q 228 224 142 342 q 483 94 323 94 q 712 195 625 94 q 796 435 796 291 l 477 435 l 477 549 l 921 549 l 921 0 "},"ΰ":{"x_min":0,"x_max":617,"ha":725,"o":"m 524 800 l 414 800 l 414 925 l 524 925 l 524 800 m 183 800 l 73 800 l 73 925 l 183 925 l 183 800 m 617 352 q 540 93 617 199 q 308 -24 455 -24 q 76 93 161 -24 q 0 352 0 199 l 0 738 l 126 738 l 126 354 q 169 185 126 257 q 312 98 220 98 q 451 185 402 98 q 492 354 492 257 l 492 738 l 617 738 l 617 352 m 489 1040 l 300 819 l 216 819 l 351 1040 l 489 1040 "},"`":{"x_min":0,"x_max":138.890625,"ha":236,"o":"m 138 699 l 0 699 l 0 861 q 36 974 0 929 q 138 1041 72 1020 l 138 977 q 82 931 95 969 q 69 839 69 893 l 138 839 l 138 699 "},"·":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 "},"Υ":{"x_min":0.328125,"x_max":819.515625,"ha":889,"o":"m 819 1013 l 482 416 l 482 0 l 342 0 l 342 416 l 0 1013 l 140 1013 l 411 533 l 679 1013 l 819 1013 "},"r":{"x_min":0,"x_max":355.5625,"ha":432,"o":"m 355 621 l 343 621 q 179 569 236 621 q 122 411 122 518 l 122 0 l 0 0 l 0 737 l 117 737 l 117 604 q 204 719 146 686 q 355 753 262 753 l 355 621 "},"x":{"x_min":0,"x_max":675,"ha":764,"o":"m 675 0 l 525 0 l 331 286 l 144 0 l 0 0 l 256 379 l 12 738 l 157 737 l 336 473 l 516 738 l 661 738 l 412 380 l 675 0 "},"μ":{"x_min":0,"x_max":696.609375,"ha":747,"o":"m 696 -4 q 628 -14 657 -14 q 498 97 513 -14 q 422 8 470 41 q 313 -24 374 -24 q 207 3 258 -24 q 120 80 157 31 l 120 -278 l 0 -278 l 0 738 l 124 738 l 124 343 q 165 172 124 246 q 308 82 216 82 q 451 177 402 82 q 492 358 492 254 l 492 738 l 616 738 l 616 214 q 623 136 616 160 q 673 92 636 92 q 696 95 684 92 l 696 -4 "},"h":{"x_min":0,"x_max":615,"ha":724,"o":"m 615 472 l 615 0 l 490 0 l 490 454 q 456 590 490 535 q 338 654 416 654 q 186 588 251 654 q 122 436 122 522 l 122 0 l 0 0 l 0 1013 l 122 1013 l 122 633 q 218 727 149 694 q 362 760 287 760 q 552 676 484 760 q 615 472 615 600 "},".":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 0 l 0 0 l 0 151 l 142 151 l 142 0 "},"φ":{"x_min":-2,"x_max":878,"ha":974,"o":"m 496 -279 l 378 -279 l 378 -17 q 101 88 204 -17 q -2 367 -2 194 q 68 626 -2 510 q 283 758 151 758 l 283 646 q 167 537 209 626 q 133 373 133 462 q 192 177 133 254 q 378 93 259 93 l 378 758 q 445 764 426 763 q 476 765 464 765 q 765 659 653 765 q 878 377 878 553 q 771 96 878 209 q 496 -17 665 -17 l 496 -279 m 496 93 l 514 93 q 687 183 623 93 q 746 380 746 265 q 691 569 746 491 q 522 658 629 658 l 496 656 l 496 93 "},";":{"x_min":0,"x_max":142,"ha":239,"o":"m 142 585 l 0 585 l 0 738 l 142 738 l 142 585 m 142 -12 q 105 -132 142 -82 q 0 -206 68 -182 l 0 -138 q 58 -82 43 -123 q 68 0 68 -56 l 0 0 l 0 151 l 142 151 l 142 -12 "},"f":{"x_min":0,"x_max":378,"ha":472,"o":"m 378 638 l 246 638 l 246 0 l 121 0 l 121 638 l 0 638 l 0 738 l 121 738 q 137 935 121 887 q 290 1028 171 1028 q 320 1027 305 1028 q 378 1021 334 1026 l 378 908 q 323 918 346 918 q 257 870 273 918 q 246 780 246 840 l 246 738 l 378 738 l 378 638 "},"“":{"x_min":1,"x_max":348.21875,"ha":454,"o":"m 140 670 l 1 670 l 1 830 q 37 943 1 897 q 140 1011 74 990 l 140 947 q 82 900 97 940 q 68 810 68 861 l 140 810 l 140 670 m 348 670 l 209 670 l 209 830 q 245 943 209 897 q 348 1011 282 990 l 348 947 q 290 900 305 940 q 276 810 276 861 l 348 810 l 348 670 "},"A":{"x_min":0.03125,"x_max":906.953125,"ha":1008,"o":"m 906 0 l 756 0 l 648 303 l 251 303 l 142 0 l 0 0 l 376 1013 l 529 1013 l 906 0 m 610 421 l 452 867 l 293 421 l 610 421 "},"6":{"x_min":53,"x_max":739,"ha":792,"o":"m 739 312 q 633 62 739 162 q 400 -31 534 -31 q 162 78 257 -31 q 53 439 53 206 q 178 859 53 712 q 441 986 284 986 q 643 912 559 986 q 732 713 732 833 l 601 713 q 544 830 594 786 q 426 875 494 875 q 268 793 331 875 q 193 517 193 697 q 301 597 240 570 q 427 624 362 624 q 643 540 552 624 q 739 312 739 451 m 603 298 q 540 461 603 400 q 404 516 484 516 q 268 461 323 516 q 207 300 207 401 q 269 137 207 198 q 405 83 325 83 q 541 137 486 83 q 603 298 603 197 "},"‘":{"x_min":1,"x_max":139.890625,"ha":236,"o":"m 139 670 l 1 670 l 1 830 q 37 943 1 897 q 139 1011 74 990 l 139 947 q 82 900 97 940 q 68 810 68 861 l 139 810 l 139 670 "},"ϊ":{"x_min":-70,"x_max":283,"ha":361,"o":"m 283 800 l 173 800 l 173 925 l 283 925 l 283 800 m 40 800 l -70 800 l -70 925 l 40 925 l 40 800 m 283 3 q 232 -10 257 -5 q 181 -15 206 -15 q 84 26 118 -15 q 41 200 41 79 l 41 737 l 166 737 l 167 215 q 171 141 167 157 q 225 101 182 101 q 247 103 238 101 q 283 112 256 104 l 283 3 "},"π":{"x_min":-0.21875,"x_max":773.21875,"ha":857,"o":"m 773 -7 l 707 -11 q 575 40 607 -11 q 552 174 552 77 l 552 226 l 552 626 l 222 626 l 222 0 l 97 0 l 97 626 l 0 626 l 0 737 l 773 737 l 773 626 l 676 626 l 676 171 q 695 103 676 117 q 773 90 714 90 l 773 -7 "},"ά":{"x_min":0,"x_max":765.5625,"ha":809,"o":"m 765 -4 q 698 -14 726 -14 q 564 97 586 -14 q 466 7 525 40 q 337 -26 407 -26 q 88 98 186 -26 q 0 369 0 212 q 88 637 0 525 q 337 760 184 760 q 465 727 407 760 q 563 637 524 695 l 563 738 l 685 738 l 685 222 q 693 141 685 168 q 748 94 708 94 q 765 95 760 94 l 765 -4 m 584 371 q 531 562 584 485 q 360 653 470 653 q 192 566 254 653 q 135 379 135 489 q 186 181 135 261 q 358 84 247 84 q 528 176 465 84 q 584 371 584 260 m 604 1040 l 415 819 l 332 819 l 466 1040 l 604 1040 "},"O":{"x_min":0,"x_max":958,"ha":1057,"o":"m 485 1041 q 834 882 702 1041 q 958 512 958 734 q 834 136 958 287 q 481 -26 702 -26 q 126 130 261 -26 q 0 504 0 279 q 127 880 0 728 q 485 1041 263 1041 m 480 98 q 731 225 638 98 q 815 504 815 340 q 733 783 815 669 q 480 912 640 912 q 226 784 321 912 q 142 504 142 670 q 226 224 142 339 q 480 98 319 98 "},"n":{"x_min":0,"x_max":615,"ha":724,"o":"m 615 463 l 615 0 l 490 0 l 490 454 q 453 592 490 537 q 331 656 410 656 q 178 585 240 656 q 117 421 117 514 l 117 0 l 0 0 l 0 738 l 117 738 l 117 630 q 218 728 150 693 q 359 764 286 764 q 552 675 484 764 q 615 463 615 593 "},"3":{"x_min":54,"x_max":737,"ha":792,"o":"m 737 284 q 635 55 737 141 q 399 -25 541 -25 q 156 52 248 -25 q 54 308 54 140 l 185 308 q 245 147 185 202 q 395 96 302 96 q 539 140 484 96 q 602 280 602 190 q 510 429 602 390 q 324 454 451 454 l 324 565 q 487 584 441 565 q 565 719 565 617 q 515 835 565 791 q 395 879 466 879 q 255 824 307 879 q 203 661 203 769 l 78 661 q 166 909 78 822 q 387 992 250 992 q 603 921 513 992 q 701 723 701 844 q 669 607 701 656 q 578 524 637 558 q 696 434 655 499 q 737 284 737 369 "},"9":{"x_min":53,"x_max":739,"ha":792,"o":"m 739 524 q 619 94 739 241 q 362 -32 516 -32 q 150 47 242 -32 q 59 244 59 126 l 191 244 q 246 129 191 176 q 373 82 301 82 q 526 161 466 82 q 597 440 597 255 q 363 334 501 334 q 130 432 216 334 q 53 650 53 521 q 134 880 53 786 q 383 986 226 986 q 659 841 566 986 q 739 524 739 719 m 388 449 q 535 514 480 449 q 585 658 585 573 q 535 805 585 744 q 388 873 480 873 q 242 809 294 873 q 191 658 191 745 q 239 514 191 572 q 388 449 292 449 "},"l":{"x_min":41,"x_max":166,"ha":279,"o":"m 166 0 l 41 0 l 41 1013 l 166 1013 l 166 0 "},"¤":{"x_min":40.09375,"x_max":728.796875,"ha":825,"o":"m 728 304 l 649 224 l 512 363 q 383 331 458 331 q 256 363 310 331 l 119 224 l 40 304 l 177 441 q 150 553 150 493 q 184 673 150 621 l 40 818 l 119 898 l 267 749 q 321 766 291 759 q 384 773 351 773 q 447 766 417 773 q 501 749 477 759 l 649 898 l 728 818 l 585 675 q 612 618 604 648 q 621 553 621 587 q 591 441 621 491 l 728 304 m 384 682 q 280 643 318 682 q 243 551 243 604 q 279 461 243 499 q 383 423 316 423 q 487 461 449 423 q 525 553 525 500 q 490 641 525 605 q 384 682 451 682 "},"κ":{"x_min":0,"x_max":632.328125,"ha":679,"o":"m 632 0 l 482 0 l 225 384 l 124 288 l 124 0 l 0 0 l 0 738 l 124 738 l 124 446 l 433 738 l 596 738 l 312 466 l 632 0 "},"4":{"x_min":48,"x_max":742.453125,"ha":792,"o":"m 742 243 l 602 243 l 602 0 l 476 0 l 476 243 l 48 243 l 48 368 l 476 958 l 602 958 l 602 354 l 742 354 l 742 243 m 476 354 l 476 792 l 162 354 l 476 354 "},"p":{"x_min":0,"x_max":685,"ha":786,"o":"m 685 364 q 598 96 685 205 q 350 -23 504 -23 q 121 89 205 -23 l 121 -278 l 0 -278 l 0 738 l 121 738 l 121 633 q 220 726 159 691 q 351 761 280 761 q 598 636 504 761 q 685 364 685 522 m 557 371 q 501 560 557 481 q 330 651 437 651 q 162 559 223 651 q 108 366 108 479 q 162 177 108 254 q 333 87 224 87 q 502 178 441 87 q 557 371 557 258 "},"‡":{"x_min":0,"x_max":777,"ha":835,"o":"m 458 238 l 458 0 l 319 0 l 319 238 l 0 238 l 0 360 l 319 360 l 319 681 l 0 683 l 0 804 l 319 804 l 319 1015 l 458 1013 l 458 804 l 777 804 l 777 683 l 458 683 l 458 360 l 777 360 l 777 238 l 458 238 "},"ψ":{"x_min":0,"x_max":808,"ha":907,"o":"m 465 -278 l 341 -278 l 341 -15 q 87 102 180 -15 q 0 378 0 210 l 0 739 l 133 739 l 133 379 q 182 195 133 275 q 341 98 242 98 l 341 922 l 465 922 l 465 98 q 623 195 563 98 q 675 382 675 278 l 675 742 l 808 742 l 808 381 q 720 104 808 213 q 466 -13 627 -13 l 465 -278 "},"η":{"x_min":0.78125,"x_max":697,"ha":810,"o":"m 697 -278 l 572 -278 l 572 454 q 540 587 572 536 q 425 650 501 650 q 271 579 337 650 q 206 420 206 509 l 206 0 l 81 0 l 81 489 q 73 588 81 562 q 0 644 56 644 l 0 741 q 68 755 38 755 q 158 720 124 755 q 200 630 193 686 q 297 726 234 692 q 434 761 359 761 q 620 692 544 761 q 697 516 697 624 l 697 -278 "}},"cssFontWeight":"normal","ascender":1189,"underlinePosition":-100,"cssFontStyle":"normal","boundingBox":{"yMin":-334,"xMin":-111,"yMax":1189,"xMax":1672},"resolution":1000,"original_font_information":{"postscript_name":"Helvetiker-Regular","version_string":"Version 1.00 2004 initial release","vendor_url":"http://www.magenta.gr/","full_font_name":"Helvetiker","font_family_name":"Helvetiker","copyright":"Copyright (c) Μagenta ltd, 2004","description":"","trademark":"","designer":"","designer_url":"","unique_font_identifier":"Μagenta ltd:Helvetiker:22-10-104","license_url":"http://www.ellak.gr/fonts/MgOpen/license.html","license_description":"Copyright (c) 2004 by MAGENTA Ltd. All Rights Reserved.\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy of the fonts accompanying this license (\"Fonts\") and associated documentation files (the \"Font Software\"), to reproduce and distribute the Font Software, including without limitation the rights to use, copy, merge, publish, distribute, and/or sell copies of the Font Software, and to permit persons to whom the Font Software is furnished to do so, subject to the following conditions: \r\n\r\nThe above copyright and this permission notice shall be included in all copies of one or more of the Font Software typefaces.\r\n\r\nThe Font Software may be modified, altered, or added to, and in particular the designs of glyphs or characters in the Fonts may be modified and additional glyphs or characters may be added to the Fonts, only if the fonts are renamed to names not containing the word \"MgOpen\", or if the modifications are accepted for inclusion in the Font Software itself by the each appointed Administrator.\r\n\r\nThis License becomes null and void to the extent applicable to Fonts or Font Software that has been modified and is distributed under the \"MgOpen\" name.\r\n\r\nThe Font Software may be sold as part of a larger software package but no copy of one or more of the Font Software typefaces may be sold by itself. \r\n\r\nTHE FONT SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL MAGENTA OR PERSONS OR BODIES IN CHARGE OF ADMINISTRATION AND MAINTENANCE OF THE FONT SOFTWARE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.","manufacturer_name":"Μagenta ltd","font_sub_family_name":"Regular"},"descender":-334,"familyName":"Helvetiker","lineHeight":1522,"underlineThickness":50});
// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
;
