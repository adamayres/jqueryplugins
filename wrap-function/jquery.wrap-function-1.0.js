/**
 * jQuery Wrap Function v1.0
 *  
 * Copyright (c) 2010 Adam Ayres
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/wrap-function
 */

;(function($) {

$.extend({
	/** 
	 * Port of Prototype JS Function#bind:
	 * 
	 * Wraps the function in another, locking its execution scope to an object specified by scope.
	 */
	protoBind: function(func, scope) {
		return function() {
			return func.apply(scope, $.makeArray(arguments));
		}
	},
	
	/** 
	 * Port of Prototype JS Function#wrap:
	 * 
	 * Returns a function "wrapped" around the original function.
	 */
	wrapFunction: function(func, wrapper) {		
		return function() {
			return wrapper.apply(this, [$.protoBind(func, this)].concat($.makeArray(arguments)));
		}
	}
});
	
})(jQuery);