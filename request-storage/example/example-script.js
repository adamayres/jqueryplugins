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
	
	var logSeparator = function(area) {
		var i = 2;
		while (i-- > 0) {
			area.value += "------------------------------";
		}
	}
	
	return {
		init: function(logSelector, storageSelector) {
			logArea = $(logSelector);
			storageArea = $(storageSelector);
			logArea.val("");
			storageArea.val("");
		},
		log: function(action, storage, obj) {
			var logAreaElement = logArea.get(0);
			logAreaElement.value += "Action: [" + action + "]\n" +
					"Storage size: [" + storage.length + "]\n";
					
			if (action === "Get") {
				logAreaElement.value += "Get: [" + obj.key + "] : [" + obj.value + "]\n";
			} else if (action === "Remove") {
				logAreaElement.value += "Remove: [" + obj.key + "] : [" + obj.value + "]\n";
			}
					
			logSeparator(logAreaElement);
			logAreaElement.value += "\n";
			logAreaElement.scrollTop = logAreaElement.scrollHeight;
		},
		showStorage: function(storage) {
			var storageAreaElement = storageArea.get(0);
			storageArea.val("");
			for (var i = 0; i < storage.length; i++) {
				storageAreaElement.value += "Key:\t" + storage.key(i+1) + "\nValue:\t" + storage.getItem(storage.key(i+1)) + "\n";
				logSeparator(storageAreaElement);
				storageAreaElement.value += "\n";
			}
			storageAreaElement.scrollTop = storageAreaElement.scrollHeight;
		}
	}
}();

var createRandomWord = function(len) {
	var consonants = "bcdfghjklmnpqrstvwxyz";
	var vowels = "aeiou";
	var rand = function(limit) {
		return Math.floor(Math.random()*limit);
	}
	var i;
	var word = "";
	if (typeof len !== "number") {
		var floorRan = Math.floor(Math.random()*11);
		len = Math.max(3, floorRan);
	}
	var length = parseInt(len, 10);
	var consonants = consonants.split("");
	var vowels = vowels.split("");
	for (i = 0; i < length/2; i++) {
		var randConsonant = consonants[rand(consonants.length)];
		var randVowel = vowels[rand(vowels.length)];
		word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
        word += i*2<length-1 ? randVowel : "";
    }
    return word;
}

