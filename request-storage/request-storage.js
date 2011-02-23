/**
 * Request Storage v1.0
 *  
 * Copyright (c) 2010 Adam Ayres 
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/request-storage
 * 
 * Overview:
 * 
 * Usage:
 *
 */

var requestStorage = function() {
	var data = {};
	var dataKeyMap = [];

	return {
		length: 0,
		key: function(n) {
			return dataKeyMap.length >= n ? dataKeyMap[n-1] : null;
		},
		getItem: function(key) {
			return data.hasOwnProperty(key) ? data[key] : null;
		},
		setItem: function(key, value) {
			if (!data.hasOwnProperty(key)) {		
				this["length"]++;
			}
			data[key] = value;
			dataKeyMap.push(key);
		},
		removeItem: function(key) {
			if (data.hasOwnProperty(key)) {
				this["length"]--;
				for (var i = 0; i < dataKeyMap.length; i++) {
					if (dataKeyMap[i] == key) {
						dataKeyMap.splice[i, 1];
					}
				}
			}
			delete data[key];
		},
		clear: function() {
			data = {};
			dataKeyMap = [];
		}
	}
}();
