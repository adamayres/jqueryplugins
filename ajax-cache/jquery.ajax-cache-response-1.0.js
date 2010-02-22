/**
 * jQuery ajax cache response v1.0
 * 
 * Author: Adam Ayres 
 * Requires: jquery.ajax-cache-response-1.0.js
 */

;(function($) {

$.ajaxCacheReponse = function() {
	var cache = {};
	
	var createCacheId = function(ajaxOptions) {
		var cacheId = ajaxOptions.url;
		
		if (ajaxOptions.data && ajaxOptions.processData) {
			if (typeof ajaxOptions.data === "string") {
				cacheId += ajaxOptions.data;
			}
			cacheId += $LITH.param(ajaxOptions.data, ajaxOptions.traditional);
		}
		
    	cacheId += ((typeof ajaxOptions.dataType == "string") ? ajaxOptions.dataType : "");
    	cacheId += ((typeof ajaxOptions.type == "string") ? ajaxOptions.type : "");
    	return cacheId;
	}
	
	return {
		get: function(options) {
			var id = createCacheId(options);			
			if (cache.hasOwnProperty(id)) {
				return cache[id];
			} else {
				return null;
			}
		},
		set: function(options, response) {
			var id = createCacheId(options);
			cache[id] = response;
		}
	}
}();

//$.ajax = $.wrap($.ajax, function(proceed, settings) {
//	if (settings.cacheRequest) {
//		var cachedResponse = $.ajaxCacheReponse.get(settings);
//		if (cachedResponse !== null) {
//			settings.success(cachedResponse);
//			settings.complete(cachedResponse);
//			return cachedResponse;
//		}
//	}
//	
//	var originalSuccess = settings.success;
//	var newSuccess = function(data, textStatus, XMLHttpRequest) {		
//		$.ajaxCacheReponse.set(settings, data);		
//		originalSuccess(data, textStatus, XMLHttpRequest);		
//	}
//	
//	settings.success = newSuccess;
//	return proceed(settings);	
//});	

})(jQuery);