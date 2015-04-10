$(document).ready(function(){
	$('input[value="charger vidéo"]').click(function(e){
		var video = $('input[name="path-video"]')[0].files[0];
		var url = URL.createObjectURL(video);
		$('#video-wrapper').html('<video id="video"><source src="'+url+'" type="'+video.type+'">Your browser does not support the video tag.</video>');
		$('video').on('loadedmetadata', function(){
			createTimeline($('#timeline'), document.getElementById('video'));
			$(this).bind('timeupdate', function(e){
				$('#time-position').css('left', (e.target.currentTime / e.target.duration) * $('#timeline-zone-slider').width());
				$('#time > input').val(e.target.currentTime.toFixed(2));
				var pos_handle_left = $('#timeline-zone-slider').children('span:eq(0)').offset().left;
				var pos_handle_right = $('#timeline-zone-slider').children('span:eq(1)').offset().left;
				var pos_time = $('#time-position').offset().left;
				console.log("postime :"+pos_time);
				$('#timeline-time-slider').slider('value', ((pos_time - pos_handle_left) / (pos_handle_right - pos_handle_left) * 100));
			});
		});
		$(window).trigger('resize');
	});
	$('input[value="charger pdf"]').click(function(e){
		var pdf = $('input[name="path-pdf"]')[0].files[0];
		var url = URL.createObjectURL(pdf);
		loadPdf(url);
		$(window).trigger('resize');
	});

	var unXml = "<tracks><track><fragment><track-timeline start='12.06001728808138' end='17.06001728808138' ><track-timeline-event type='pdf' page='2' offsetx='0' offsety='441' width='201' height='100' /></track-timeline></fragment><fragment><track-timeline start='20.41347371961665' end='25.41347371961665' ><track-timeline-event type='pdf' page='2' offsetx='248' offsety='585' width='201' height='100' /></track-timeline></fragment></track><track><fragment><track-timeline start='24.384789072313744' end='29.384789072313744' ><track-timeline-event type='pdf' page='3' offsetx='285' offsety='559' width='201' height='100' /></track-timeline></fragment><fragment><track-timeline start='4.048915628330342' end='9.048915628330342' ><track-timeline-event type='pdf' page='3' offsetx='0' offsety='511' width='201' height='100' /></track-timeline></fragment></track></tracks>"


	$('input[value="importer"]').click(function(e){
		// MODAL WINDOW for DETAIL

		var popup = $('#popup').css('visibility', 'visible');

		popup.append('<div id="fade"></div>');

		popup.find('input[type=textarea]').val('');
		popup.find('input[type=button]').click(function(e){
			importFragment(popup.find('input[type=textarea]').val());
			popup.css('visibility', 'hidden');
			$(this).closest('#popup').find('#fade').remove();
		});

		// QUIT DETAIL
		$("#fade").click(function(e){
			popup.css('visibility', 'hidden');
			$(this).remove();
		});
		
	});

	$('input[value="exporter"]').click(function(e){
		// MODAL WINDOW for DETAIL

		var popup = $('#popup').css('visibility', 'visible');

		popup.append('<div id="fade"></div>');

		popup.find('input[type=textarea]').val(exportFragment());
		popup.find('input[type=button]').click(function(e){
			popup.css('visibility', 'hidden');
			$(this).closest('#popup').find('#fade').remove();
		});

		// QUIT DETAIL
		$("#fade").click(function(e){
			popup.css('visibility', 'hidden');
			$(this).remove();
		});
	});
});