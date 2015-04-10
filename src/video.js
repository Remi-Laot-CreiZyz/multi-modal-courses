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
				$('#timeline-time-slider').slider('value', ((pos_time - pos_handle_left) / (pos_handle_right - pos_handle_left) * 100).toFixed(2));
			});
		});
	});
	$('input[value="charger pdf"]').click(function(e){
		var pdf = $('input[name="path-pdf"]')[0].files[0];
		var url = URL.createObjectURL(pdf);
		loadPdf(url);
	});
});