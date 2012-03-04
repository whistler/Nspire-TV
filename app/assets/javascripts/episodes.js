
function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

$(document).ready(function() {
  	$('#interviews').jcarousel({
        // // Configuration goes here
        // wrap: "circular"
    });
	if (isScrolledIntoView($(".underlined"))) {
		$(".jcarousel-skin-tango").fadeIn("fast");
		$(".episodes-indicator").fadeOut("fast");
	} 
	$(".scroll-by-div").waypoint(function(event, direction) {
		if (direction == "down") {
			$(".jcarousel-skin-tango").fadeIn("fast");
			$(".episodes-indicator").fadeOut("fast");
		} else {
			$(".jcarousel-skin-tango").fadeOut("fast");
			$(".episodes-indicator").fadeIn("fast");
		}
		
	}, {
		offset: "40%"
	});					
});