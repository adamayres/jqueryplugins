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
		init: function(logSelector, storageSelector) {
			logArea = $(logSelector);
			storageArea = $(storageSelector);
			logArea.val("");
			storageArea.val("");
		},
		log: function(action, storage, obj) {
			logArea.val(logArea.val() + 
					"Action: [" + action + "]\n" +
					"Storage size: [" + storage.length + "]\n");
					
			if (action === "Get") {
				logArea.val(logArea.val() + 
					"Get: [" + obj.key + "] : [" + obj.value + "]\n");
			}
					
			var j = 2;
			while (j-->0) {
				logArea.val(logArea.val() + "------------------------------");
			}
			logArea.val(logArea.val() + "\n");
		},
		showStorage: function(storage) {
			storageArea.val("");
			for (var i = 0; i < storage.length; i++) {
				storageArea.val(storageArea.val() + "Key:\t" + storage.key(i+1) + "\nValue:\t" + storage.getItem(storage.key(i+1)) + "\n");
				var j = 2;
				while (j-->0) {
					storageArea.val(storageArea.val() + "------------------------------");
				}
				storageArea.val(storageArea.val() + "\n");
			}	
		}
	}
}();
