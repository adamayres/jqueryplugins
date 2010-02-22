/**
 * jQuery Delay Toggle v1.0
 *  
 * Copyright (c) 2010 Adam Ayres
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/delay-toggle
 * 
 * A JavaScript object that manages triggering an open and close function after a configurable timeout.
 *
 * @param elements Apply the delayed toggle to matching elements
 * @param options A object literal that contains the following options:
 *		@param openFunction The function that gets fired when the openEvent occurs after the openDelayMs time period.
 *		@param closeFunction The function that gets fired when the closeEvent occurs after the closeDelayMs time period.
 *		@param openDelayMs The amount of time to wait before triggering the openFunction.
 *		@param closeDelayMs The amount of time to wait before triggering the closeFunction.
 * 		@param decayClose When true, the close event will not be called until at least the interval for the closeDelayMs has passed
 *		@param openEvent The dom event to observe on the specified element that triggers the open timer to start.
 *		@param closeEvent The dom event to observe on the specified element that triggers the close timer to start.
 */
 
;(function($) {

$.delayToggle = function(elem, options) {		
	var options = $.extend({}, $.fn.delayToggle.defaults, options);
	var enabled = false;
	var timeout = false;
	var decayCloseDelayMs = options.closeDelayMs;
	var decayTimeout = false;		
	
	//Apply event listeners		
	$(elem).bind(options.openEvent, function(event) {		
		var currentElement = $(this);
		clearTimeout(timeout);
		if (enabled == false) {			
			timeout = setTimeout(function(){
				enabled = true;						
				options.openFunction(currentElement);
				
				if (options.decayClose) {
					decayCloseDelayMs = options.closeDelayMs;
					decayTimeout = setInterval(function() {							
						if (decayCloseDelayMs > 100) {							
							decayCloseDelayMs = decayCloseDelayMs - 100;
						} else {
							decayCloseDelayMs = 0;
							clearInterval(decayTimeout);
						} 
					}, 100);
				}
				
			}, options.openDelayMs);	
		}
	});
	
	$(elem).bind(options.closeEvent, function(event) {
		var currentElement = $(this);
		var closeTime = options.decayClose ? decayCloseDelayMs : options.closeDelayMs;		
		clearInterval(decayTimeout);		
		if (enabled == false) {
			clearTimeout(timeout);				
		} else {
			timeout = setTimeout(function(){
				enabled = false;				
				options.closeFunction(currentElement);
			}, closeTime);			
		} 
	});
}	

$.fn.delayToggle = function(options){
	return this.each(function() {
		return $.delayToggle(this, options);
	});		
}

$.fn.delayToggle.defaults = {
	openFunction: function(item) { item.show() },
	closeFunction: function(item) { item.hide() },
	openDelayMs: 500,
	closeDelayMs: 100,
	decayClose: false,
	openEvent: "mouseover",
	closeEvent: "mouseout"
}
	
})(jQuery);
