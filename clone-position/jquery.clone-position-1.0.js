/**
 * jQuery Ajax Cache Response v1.0
 *  
 * Copyright (c) 2010 Adam Ayres, Tim Wong
 * 
 * Licensed under the MIT license:
 * 		http://www.opensource.org/licenses/mit-license.php
 * 
 * Project home:
 * 		http://github.com/adamayres/jqueryplugins/tree/master/clone-position
 */

;(function($) {
 
/** Modifies the jQuery cloning the position of source.
 * 
 * @param source The source DOM element to clone the position of
 * @param options position and offset parameters to clone. This serves as an override to default options:
 * 		{ 	setLeft: true, 
 * 			setTop: true, 
 * 			setWidth: true, 
 * 			setHeight: true, 
 * 			offsetTop: 0, 
 * 			offsetLeft: 0 	} 
 * @return jQuery with position cloned
 */
$.fn.clonePosition = function(source, options) {
	var options = $.extend({
		setLeft: true,
		setTop: true,
		setWidth: true,
		setHeight: true,
		offsetTop: 0,
		offsetLeft: 0
	}, options || {});

	// find coordinate system to use
	var delta = { top: 0, left: 0 };
	var parent = null;
	
	// delta [0,0] will do fine with position: fixed elements,
	// position:absolute needs offsetParent deltas
	if (this.css("position") == "absolute") {
		parent = this.offsetParent();
		delta = parent.offset();
	}

	// correct by body offsets (fixes Safari)
	if (parent == document.body) {
		delta.top -= document.body.offsetTop;
		delta.left -= document.body.offsetLeft;
	}

	// find page position of source
	source = $(source);
	var sourceOffset = source.offset();

    // set position
    if (options.setLeft) {
		this.css("left", (sourceOffset.left - delta.left + options.offsetLeft) + "px");
	}
    if (options.setTop) {
		this.css("top", (sourceOffset.top - delta.top + options.offsetTop) + "px");
	}
	if (options.setWidth) {
		this.css("width", source.attr("offsetWidth") + "px");
	}
	if (options.setHeight) {
		this.css("height", source.attr("offsetHeight") + "px");
	}
	return this;		
}

})(jQuery);