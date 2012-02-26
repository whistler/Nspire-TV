$(document).ready(function() {
	$(".video").waypoint(function(event, direction) {
		if (direction == "down") {
			$(".jcarousel-skin-tango").fadeIn("fast");
			$(".episodes-indicator").fadeOut("fast");
		} else {
			$(".jcarousel-skin-tango").fadeOut("fast");
			$(".episodes-indicator").fadeIn("fast");
		}
		
	});			

  	jQuery('#interviews').jcarousel({
        // Configuration goes here
        wrap: "circular"
    });	
});