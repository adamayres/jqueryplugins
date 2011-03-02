/**
 * Request Storage v1.0
 *  
 * Copyright (c) 2010 Adam Ayres 
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 *   http://github.com/adamayres/jqueryplugins/tree/master/request-storage
 * 
 * Overview:
 *   Provides a per request storage in memory.  Implements the HTML5 web storage interface.
 *   See http://dev.w3.org/html5/webstorage/
 * 
 * Usage:
 *   Add item to storage:
 *
 *      requestStorage.setItem("keyName", "value");
 * 
 *   Get item from storage:
 *
 *      requestStorage.getItem("keyName");
 * 
 *   Remove item from storage:
 * 
 *      requestStorage.removeItem("keyName");
 * 
 *   Clear all items from storage:
 * 
 *      requestStorage.clear();
 * 
 *   Get storage size:
 * 
 *      requestStorage.length();
 * 
 *   Get key from storage based on position:
 * 
 *      requestStorage.key(1);
 */

var requestStorage = function() {
	var data = {};
	var dataKeyMap = [];

	return {
		length: 0,
		key: function(n) {
			return (typeof n === "number" && dataKeyMap.length >= n && n >= 0) ? dataKeyMap[n] : null;
		},
		getItem: function(key) {
			return data.hasOwnProperty(key) ? data[key] : null;
		},
		setItem: function(key, value) {
			if (!data.hasOwnProperty(key)) {		
				this.length++;
				dataKeyMap.push(key);
			} 
			data[key] = value;
		},
		removeItem: function(key) {
			if (data.hasOwnProperty(key)) {
				this.length--;
				for (var i = 0; i < dataKeyMap.length; i++) {
					if (dataKeyMap[i] == key) {
						dataKeyMap.splice(i, 1);
					}
				}
			}
			delete data[key];
		},
		clear: function() {
			data = {};
			dataKeyMap = [];
			this.length = 0;
		}
	};
}();
/**
 * jQuery Ajax Cache Response v1.0
 *  
 * Copyright (c) 2011, Adam Ayres 
 * 
 * Licensed under the MIT license:
 *    http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 *   http://github.com/adamayres/jqueryplugins/tree/master/ajax-cache-response
 * 
 * Requires: 
 *   jquery.js version 1.5
 *      http://code.jquery.com/jquery-1.5.min.js
 *   jquery.request-storage-1.0.js
 *      http://github.com/adamayres/jqueryplugins/tree/master/request-storage
 * 
 * Overview:
 *   The Ajax Cache Response plugin caches the response of 
 *   Ajax requests.  Subsequent Ajax requests that match the original
 *   Ajax options will return the cached response instead of making a 
 *   new call.  Cached responses can be stored in a HTML5 web storage 
 *   allowing them to persist across a session.
 * 
 * Usage:
 *   The Ajax Cache Response plugin wraps the main jQuery.ajax(...) method.
 *   Usage of the plugin is done by adding a "cacheResponse" property to
 *   the jQuery Ajax options obejct and setting it to true.
 *
 *   jQuery.ajax("/my-ajax-url", {
 *      cacheResponse: true
 *   });
 *
 *   An optional timer, in ms, can be set to control when the cache is invalidated.  The 
 *   timer will start after a successful Ajax request.
 *
 *   jQuery.ajax({
 *      cacheResponseTimer: 50000 
 *   });
 * 
 *   A optional function can be provided to invalidate the cache.  A return value
 *   of false will invalidate the cache.
 *
 *   jQuery.ajax({
 *      cacheResponseValid: function() { ... }
 *   });
 * 
 *   The storage for the cache respone is configurable.  By default the
 *   cache is request scoped.  Alternative storage options, that implement
 *   the HTML5 storage interface, can be used.
 * 
 *	 $.ajaxCacheResponse.storage = window.sessionStorage;
 * 
 *   In order for the jQuery.get(...) and jQuery.post(...) methods to
 *   use the Ajax cached response the default Ajax options need to be changed
 *   to set the "cacheResponse" to true:
 *
 *   jQuery.ajaxSetup({
 *      cacheResponse: true,
 *      cacheResponseTimer: 50000, //optional
 *      cacheResponseValid: function() { ... } //optional
 *   });
 */

(function($) {

/**
 * The cacheFields provides a convenience for a mapping of the suffixes used when 
 * generating the cache key ids for a given Ajax request.
 */

var cacheFields = {
	timeStamp: "__timeStamp__",
	responseText: "__responseText__",
	hasResponseXML: "__hasResponseXML__",
	responseHeaders: "__responseHeaders__"
};

/**
 * Set the default cacheResponseStorage
 */
$.ajaxCacheResponse = {
	storage: window.requestStorage
};

/**
 * Private method to create the cache id prefix for a given JavaScript object.
 * Usually this will be the Ajax options for a given request.
 * 
 * @param obj {object} the object to create a cache id for
 */
var getCreateCacheId = function(obj) {
	var cacheId = "";
	for (var field in obj) {
		var type = typeof obj[field];
		/*
		 * For stringable object types we simply add it to cache id.  If
		 * an object then we attempt to use the $.param() method to stringify.  For
		 * arrays we iterate over each item and recursively call the same method
		 * on each item.  We ignore other data types.
		 */
		if (type === "string" || type === "number" || type === "boolean") {
			cacheId += field + "=" + obj[field] + ",";
		} else if (type === "object") {
			cacheId += field + "=" + $.param(obj[field]) + ",";
		} else if (type === "array") {
			$.each(obj[field], function(index, value) {
				cacheId += getCreateCacheId(value);
			});
		}
	}
	return cacheId;
};

/**
 * Private method to check if the cache item exists and is still valid.  Validity can be configured
 * to use a timeout or invalidated based on a user contributed callback.
 * 
 * @param cacheId {string} the stringified cache id
 * @param options {object} the ajax settings object
 */
var isCacheItemExistsAndValid = function(cacheId, options) {
	if ($.ajaxCacheResponse.storage.getItem(cacheId + cacheFields.timeStamp) === null) {
		return false;
	}
	
	var valid = true;
	
	if (typeof options.cacheResponseTimer === "number") {
		var cacheTime = parseInt($.ajaxCacheResponse.storage.getItem(cacheId + cacheFields.timeStamp));
		if (typeof cacheTime === "number") {
			var currentTime = new Date().getTime();
			valid = cacheTime + options.cacheResponseTimer > currentTime;
			if (valid === true) {
				options.cacheTimeRemaining = options.cacheResponseTimer - (currentTime - cacheTime);
			}
		}
	}
	
	if ($.isFunction(options.cacheResponseValid)) {
		valid = options.cacheResponseValid.call(this, options);
	}

	return valid;
};

/**
 * Use an ajaxPrefilter to modify the ajax settings object when the cacheResponse 
 * option is used.
 */
$.ajaxPrefilter(function(options, originalOptions, jqXhr) {
	if (options.cacheResponse === true) {
		/*
		 * Make sure a valid storage is defined.
		 */
		if ($.ajaxCacheResponse.storage === undefined) { 
			throw "No valid storage defined for the Ajax Cache Response plugin"; 
		}
		
		var cacheId = getCreateCacheId(originalOptions);
		options.cacheResponseId = cacheId;
		/*
		 * When a cache item exists and is valid then we circumvent the normal
		 * Ajax request we override it with a fake XHR object that provides
		 * cached values.
		 */
		if (isCacheItemExistsAndValid(cacheId, options) === true) {
			var cachedItem = $.extend({}, cacheFields);
			/*
			 * Builds the cachedItem from storage based on the cacheId and the cacheFields
			 */
			for (var field in cachedItem) {
				cachedItem[field] = $.ajaxCacheResponse.storage.getItem(cacheId + cachedItem[field]);
			}

			/*
			 * Provides a skeleton of the XHR interface.  By setting the readyState field
			 * to 4 the XHR callback jQuery registers is triggered.  Values for the 
			 * response headers, responseText and responseXML are provides from cache.
			 * 
			 * TODO: This appears to be a good instance in which to use jQuery.ajaxTransport, 
			 * however the new ajaxTransport extension does not allow one to provide a transport
			 * when no dataType is specified.  The "*" dataType transport is already provided
			 * by jQuery and wins out over a user contribution of the same type.
			 */
			options.xhr = function() {
				return {
					open: $.noop,
					setRequestHeader: $.noop,
					send: $.noop,
					abort: $.noop,
					onreadystatechange: $.noop,
					getResponseHeader: $.noop,
					getAllResponseHeaders: function() { return cachedItem.responseHeaders; },
					readyState: 4,
					status: 200,
					statusText: "success",
					responseText: cachedItem.responseText,
					responseXML: (cachedItem.hasResponseXML === true) ? $.parseXML(cachedItem.responseText) : undefined
				};
			};
			jqXhr.responseFromCache = true;
			jqXhr.cacheTimeRemaining = options.cacheTimeRemaining;
		} else {
			jqXhr.responseFromCache = false;
		}
	}
});

/**
 * On all Ajax successes we attempt to store the results of the request
 */
$(document).ajaxSuccess(function(elem, jqXhr, options, data) {
	if (options.cacheResponse === true) {
		var cacheId = options.cacheResponseId;
		if (isCacheItemExistsAndValid(cacheId, options) === false) {
			/*
			 * Save the Ajax response to storage
			 */
			var storage = $.ajaxCacheResponse.storage;
			storage.setItem(cacheId + cacheFields.responseText, jqXhr.responseText);
			storage.setItem(cacheId + cacheFields.responseHeaders, jqXhr.getAllResponseHeaders());
			storage.setItem(cacheId + cacheFields.timeStamp, new Date().getTime());
			storage.setItem(cacheId + cacheFields.hasResponseXML, jqXhr.responseXML !== undefined);	
		}
	}
});

})(jQuery);
