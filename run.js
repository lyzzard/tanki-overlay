Date.prototype.format = function() {
	return this.getDate() + ' ' + (['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'])[this.getMonth()] + ' ' + this.getFullYear();
};

Math.min = function(a, b) {
	return a < b ? a : b;
};

Math.max = function(a, b) {
	return a > b ? a : b;
};

$.fn.pulseColor = function(color, length) {
	return $(this).each(function() {
		var old = $(this).stop(true, true).css('background-color');
		$(this).css({'background-color': color}).animate({'background-color': old}, length);
	});
};

$.fn.batch = function (options) {
	return $(this).each(function() {
		for (var exp in options) {
			$(exp, this).each(function() {
				var target = $(this);

				for (var param in options[exp]) {
					$.fn[param].apply(target, options[exp][param] instanceof Array ? options[exp][param] : [options[exp][param]]);
				}
			});
		}
	});
};

$.get("http://alex.badarin.s3.amazonaws.com/tv.json?" + Math.random(), function(config) {
	$(function() {
		var ol = $('<div id="js-overlay_wrapper" class="b-wrapper"><img class="b-splash" /><div class="b-overlay"><div class="b-left"><div class="b-logo"></div><span class="b-season"></span><span class="b-matchday"></span><span class="b-clan"></span><div class="b-flag"></div></div><div class="b-score"><div class="b-score_left"><span>0</span><u></u></div><span class="b-score_split">:</span><div class="b-score_right"><span>0</span><u></u></div></div><div class="b-right"><span class="b-clan"></span><div class="b-flag"></div></div><div class="b-round">Round <span>1</span>/4</div></div></div>').prependTo('body');

		function setPair(time) {
			var pair = config[time];

			ol.batch({
				'.b-score_left span': {
					text: 0
				},
				'.b-score_right span': {
					text: 0
				},
				'.b-round': {
					html: 'Round <span>1</span>/4'
				},
				'.b-left .b-clan': {
					text: pair.left.name
				},
				'.b-right .b-clan': {
					text: pair.right.name
				},
				'.b-left .b-flag': {
					each: function() {
						$(this).removeClass().addClass('b-flag ' + pair.left.flag);
					}
				},
				'.b-right .b-flag': {
					each: function() {
						$(this).removeClass().addClass('b-flag ' + pair.right.flag);
					}
				}
			});

			localStorage.overlayTime = time;
		}

		setPair(localStorage.overlayTime in config ? localStorage.overlayTime : '21:00');

		ol
			.on('init', function() {
				if ( ! $(this).hasClass('locked')) {
					if ($(this).is(':visible')) {
						$(this).fadeOut(1000);
					}
					else {
						$(this).fadeIn(1000);
					}
				}
			})
			.delegate('.b-overlay, .b-splash', 'selectstart contextmenu', false)
			.delegate('.b-round, .b-score_left, .b-score_right', 'mousedown', function(e, which) {
				var old = parseInt($('span', this).text());

				if ( ! which) {
					which = e.which;
				}

				if (which == 1) {
					$('span', this).text(Math.min(old + 1, 4));
					if ($(this).is('.b-score_left, .b-score_right')) {
						$('u', this).text($('span', this).text()).show().fadeOut(500);
						$('.b-score_split', ol).trigger('mousedown', [e.which]);
					}
					else if ($(this).is('.b-round') && old == 4) {
						$(this).html('Game over');
					}
				}
				else if (which == 3) {
					if ($(this).is('.b-round') && ! $('span', this).size()) {
						$(this).html('Round <span>4</span>/4');
					}
					else {
						$('span', this).text(Math.max(old - 1, $(this).is('.b-round') ? 1 : 0));
					}
				}

				e.stopPropagation();
				e.preventDefault();
				return false;
			})
			.delegate('.b-score_split', 'mousedown', function(e, which) {
				(which || e.which == 1) && $('.b-round', ol).trigger('mousedown', [which || e.which]);
				ol.toggleClass('b-wrapper_reverse');
			})
			.delegate('.b-clan', 'mousedown', function(e) {
				var newTime = parseInt(localStorage.overlayTime.split(':')[0]) + (e.which == 1 ? 1 : -1) + ':00';

				if (newTime in config) {
					setPair(newTime);
				}
			});
	});
});