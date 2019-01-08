$(document).ready(function() {
	// Header Scroll
	$(document.body).on('scroll', function() {
		var scroll = $(document.body).scrollTop();
		if (scroll >= 50) {
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});

	$(window).on('scroll', function() {
		var scroll = $(window).scrollTop();
		if (scroll >= 50) {
			$('#header').addClass('fixed');
		} else {
			$('#header').removeClass('fixed');
		}
	});
	// Fancybox
	$('.work-box').fancybox();

	// Flexslider
	$('.flexslider').flexslider({
		animation: "fade",
		directionNav: false,
	});

	// Page Scroll
	var sections = $('section')
		nav = $('nav[role="navigation"]');

	$(document.body).on('scroll', function () {
	  	var cur_pos = $(this).scrollTop();
	  	sections.each(function() {
	    	var top = $(this).offset().top - 76
	        	bottom = top + $(this).outerHeight();
	    	if (cur_pos >= top && cur_pos <= bottom) {
	      		nav.find('a').removeClass('active');
	    	}
	  	});
	});
	nav.find('a').on('click', function () {
	  	var $el = $(this)
	    	id = $el.attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top - 75
		}, 500);
	  return false;
	});

	// Mobile Navigation
	$('.nav-toggle').on('click', function() {
		if(nav.hasClass('open')){
			nav.removeClass('open');
			var scroll = $(document.body).scrollTop() || $(window).scrollTop();
			if (scroll >= 50) {
				$('#header').addClass('fixed');
			}
		}else{
			nav.addClass('open');
			$('#header').removeClass('fixed');
		}
		$(this).toggleClass('close-nav');
		return false;
	});	
	nav.find('a').on('click', function() {
		// $('#header').addClass('fixed');
		$('.nav-toggle').toggleClass('close-nav');
		nav.toggleClass('open');
	});
});