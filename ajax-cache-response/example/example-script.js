/** 
 * Copyright (c) 2011, Adam Ayres 
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 */
 
var logger = function() {
	var logArea;
	var responseArea;
	var storageArea;
	
	return {
		init: function(logSelector, responseSelector, storageSelector) {
			logArea = $(logSelector);
			responseArea = $(responseSelector);
			storageArea = $(storageSelector);
			logArea.val("");
			responseArea.val("");
			storageArea.val("");
		},
		log: function(xhr, timer) {
			logArea.val(logArea.val() + 
					"From cache: [" + xhr.responseFromCache + "]" + 
					" - Time remaining: [" + (xhr.cacheTimeRemaining || timer || "N/A") + "]" +
					"\n"); 
			responseArea.val(xhr.responseText);
		},
		showStorage: function() {
			storageArea.val("");
			var storage = $.ajaxCacheResponse.storage;
			for (var i = 0; i < storage.length; i++) {
				storageArea.val(storageArea.val() + "Key:\t" + storage.key(i) + "\nValue:\t" + storage.getItem(storage.key(i)) + "\n");
				var j = 4;
				while (j-->0) {
					storageArea.val(storageArea.val() + "------------------------------");
				}
				storageArea.val(storageArea.val() + "\n");
			}	
		}
	}
}();
