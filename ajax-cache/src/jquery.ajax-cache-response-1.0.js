/**
 * jQuery Ajax Cache Response v1.0
 *  
 * Copyright (c) 2010 Adam Ayres 
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/ajax-cache
 * 
 * Requires: 
 * 		jquery.wrap-function-1.0.js
 * 			http://github.com/adamayres/jqueryplugins/tree/master/wrap-function
 * 		jquery.request-storage-1.0.js
 * 			http://github.com/adamayres/jqueryplugins/tree/master/request-storage
 * 
 * Overview:
 * 		The Ajax cache response plugin caches the response of 
 * 		Ajax requests.  Subsequent Ajax requests, within the
 * 		same page load, that match a given cache id will use
 * 		the cached response instead of making an additional call.
 * 		The cached response will run through the success and complete
 * 		callback methods.  The cache id for a given request is a combination
 * 		of the url, data, dataType and type fields of the Ajax options object
 * 		used when making the Ajax call.
 * 
 * Usage:
 * 		The Ajax Cache Response plugin wraps the main jQuery.ajax(...) method.
 * 		Usage of the plugin is done by adding a "cacheResponse" property to
 * 		the jQuery Ajax options obejct and setting it to true.
 *
 * 		jQuery.ajax({
 * 			cacheResponse: true
 * 		});
 * 
 * 		jQuery.ajax("/my-ajax-url", {
 *			cacheResponse: true
 * 		});
 * 
 * 		An optional timer, in ms, can be set to control when the cache is invalidated.  The 
 * 		timer will start after a successful Ajax request.
 * 
 * 		jQuery.ajax({
 * 			cacheResponseTimer: 50000 
 * 		});
 * 
 * 		A optional function can be provided to invalidate the cache.  A return value
 * 		of false will invalidate the cache.
 * 
 * 		jQuery.ajax({
 * 			cacheResponseValid: function() { ... }
 * 		});
 * 
 * 		The storage for the cache respone is configurable.  By default the
 * 		cache is request scoped.  Alternative storage options, that implement
 * 		the HTML5 storage interface, can be used.
 * 
 * 		jQuery.ajaxCacheResponse.defaults.storage = window.sessionStorage;
 * 
 * 		In order for the jQuery.get(...) and jQuery.post(...) methods to
 * 		use the Ajax cached response the default Ajax options need to be changed
 * 		to set the "cacheResponse" to true:
 * 
 * 		jQuery.ajaxSetup({
 * 			cacheResponse: true,
 * 			cacheResponseTimer: 50000, //optional
 * 			cacheResponseValid: function() { ... } //optional
 * 		});
 */

;(function($) {

$.ajaxCacheResponse = {
	defaults: {
		storage: window.requestStorage  
	}
}

var createCacheId = function(ajaxOptions) {
	var cacheId = "";
	for (a in ajaxOptions) {
		var type = typeof ajaxOptions[a];
		
		if (type === "string" || type === "number" || type === "boolean") {
			cacheId += a + "=" + ajaxOptions[a] + ",";
		} else if (type === "object") {
			cacheId += a + "=" + $.param(ajaxOptions[a]) + ",";
		} else if (type === "array") {
			
		}
	}
	return cacheId;
}
	
$.ajax = $.wrapFunction($.ajax, function(proceed, url, options) {
	if (typeof options !== "object") {
		options = url;
		url = undefined;
	}

	// Force options to be an object
	options = options || {};
	
	if (options.cacheResponse === true) {
		var storage = $.ajaxCacheResponse.defaults.storage;
		var cacheId = createCacheId(options);
		var responseText = storage.getItem(cacheId+"__responseText__");
		var cacheValid = true;
		
		if (responseText !== null) {
			if (typeof options.cacheResponseTimer == "number") {
				var cacheTime = storage.getItem(cacheId+"__time__");
				var currentTime = new Date().getTime();
				cacheValid = cacheTime + options.cacheResponseTimer > currentTime;  
			}
			
//			if ($.isFunction(options.cacheResponseValid)) {
//				cacheValid = options.cacheResponseValid.apply(this, cachedResponse);
//			}
			
			if (cacheValid === true) {
				options.xhr = $.wrapFunction($.ajaxSettings.xhr, function(proceed) {
					var responseXML;
					if (storage.getItem(cacheId+"__hasResponseXML__") === true) {
						responseXML = $.parseXML(responseText);
					}

					var xhr = proceed();
					var fakeXhr = {
						open: $.noop,
						setRequestHeader: $.noop,
						send: $.noop,
						abort: $.noop,
						//onreadystatechange: $.noop,
						readyState: 4,
						status: 200,
						statusText: "success",
						getResponseHeader: $.noop,
						getAllResponseHeaders: function() { return storage.getItem(cacheId+"__headers__"); },
						responseText: responseText,
						responseXML: responseXML
					}
					return fakeXhr;
				})
			    
			}
		} 
		
		if (responseText === null || cacheValid === false) {
			var originalSuccess = options.success;
			var newSuccess = function(data, textStatus, XMLHttpRequest) {
				storage.setItem(cacheId+"__responseText__", XMLHttpRequest.responseText);
				storage.setItem(cacheId+"__headers__", XMLHttpRequest.getAllResponseHeaders());
				storage.setItem(cacheId+"__time__", new Date().getTime());
				storage.setItem(cacheId+"__hasResponseXML__", XMLHttpRequest.responseXML !== undefined);		
				if ($.isFunction(originalSuccess)) {
					originalSuccess(data, textStatus, XMLHttpRequest);
				}		
			}
			options.success = newSuccess;
		}
	}
	
	return proceed(url, options);	
});	

})(jQuery);
