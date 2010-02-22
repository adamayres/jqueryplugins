/**
 * jQuery Outer HTML v1.0
 *  
 * Copyright (c) 2010 Adam Ayres
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/outer-html
 */

;(function($) {
	
$.fn.outerHTML = function() { 		
	var element = this.get(0); 		
	return (element.outerHTML) 
	       ? element.outerHTML 
	       : $("<div>").append(this.eq(0).clone()).html(); 	
}

})(jQuery);