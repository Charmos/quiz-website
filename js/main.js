(function($, document, window) {
	var header = $('#mainHeader'); // bg color is rgba(17, 17, 17, .5)

	$(document).scroll(function(event) {
		var top = header.offset().top;

		if(top < 100) {
			header.css('background-color', 'rgba(17, 17, 17, .5)');
		} else {
			header.css('background-color', 'rgba(17, 17, 17, 1)');
		}
	});

}($, document, window));