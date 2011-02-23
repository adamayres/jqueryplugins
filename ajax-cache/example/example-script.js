var logger = function() {
	var logArea = $("#log");
	var responseArea = $("#response");
	var storageArea = $("#storage");
	logArea.val("");
	responseArea.val("");
	storageArea.val("");
	
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
				storageArea.val(storageArea.val() + "Key:\t" + storage.key(i+1) + "\nValue:\t" + storage.getItem(storage.key(i+1)) + "\n");
				var j = 4;
				while (j-->0) {
					storageArea.val(storageArea.val() + "------------------------------");
				}
				storageArea.val(storageArea.val() + "\n");
			}	
		}
	}
}();
