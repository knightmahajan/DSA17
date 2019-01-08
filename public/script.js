$(document).ready(function(){
	 $('.lightSlider').lightSlider({
	    gallery: true,
	    item: 1,
	    loop: true,
	    slideMargin: 0,
	    thumbItem: 9,
	    verticalHeight: 500,
	    vThumbWidth: 100,

	    onBeforeSlide: function(el) {
	    	console.log("match")
	    	$(".item:not(.active)").matchHeight();
	    }
	});
});