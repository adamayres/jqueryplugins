/**
 * jQuery iFrame Shim v1.0
 *  
 * Copyright (c) 2010 Adam Ayres
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/iframe-shim
 */

;(function($) {

$.extend.shim = function() {
	var options = {
		createNew: false
	};
			
	function createShim() {
		return $("<iframe/>")
			.attr({
				"src": "javascript:void(0);"})
			.css({
				"zIndex" : "500",
				"position": "absolute",
				"frameborder": "0", 
				"border": "0",
				"opacity": "0"})
			.hide();
	}
	
	var singletonShim = createShim();
	
	return {
		setOptions: function(options) {
			$.extend($.shim.options, options);
		},
		getShim: function(createNew) {
			return (createNew === true) ? createShim(): singletonShim;				
		}
	};
}();

$.fn.shim = function(options) {
	if (typeof options === "boolean") {
		return this.each(function() {
			$(this).data("shim").hide();
		});
	} else {
		var settings = $.extend({}, $.cssData.options, options);
		
		return this.each(function() {
			var shim = $.shim.getShim(settings.createNew);
			var element = $(this);
			element.data("shim", shim);
			
			if ($.browser.msie) {
				element.after(shim);						
				shim.css(element.position());
			} else {
				element.offsetParent().after(shim);						
				shim.css(element.offset());	
			}
			shim.css({
				height: element.outerHeight(),
				width: element.outerWidth()
			}).show();
		});	
	}
}
	
})(jQuery);