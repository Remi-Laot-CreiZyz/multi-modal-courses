$(document).ready(function(){
	resizeDocument();
	$(window).resize(function(){
		resizeDocument();
	});
	$('#timeline').resizable({
		handles : 'n',
		resize : function(event, ui){
			if ($(this).height() < 100) $(this).height(100); // Min height
			if ($(this).height() > $(document).height/2) $(this).height($(document).height/2);// Max height
			resizeDocument();
		}
	});
});

function resizeVideo(){
	var video_wrapper = $('#video-wrapper');

	var height = $('#content').width() * (9/16);
	if (height > $('#content').height()){
		height = $('#content').height() - 10;
		video_wrapper.width(height * (16/9));
	}
	if (video_wrapper.width() > $('#video-container').width()){
		video_wrapper.width($('#video-container').width() - 10);
		height = video_wrapper.width() * (9/16);
	}

	video_wrapper.height(height);
	video_wrapper.css('margin-top', (video_wrapper.parent().height() - video_wrapper.height())/2);
}

function resizeDocument(){
	var header = $('#header');
	var content = $('#content');
	var timeline = $('#timeline');

	resizeTimeline();
	content.height($(document).height() - header.height() - timeline.height());
	resizeVideo();
}

function resizeTimeline(){
	var timeline = $('#timeline');
	var timeline_panel = timeline.find('.timeline-panel');
	timeline_panel.height(timeline.height());
	$('.timeline-zone-selector .ui-slider').width(timeline_panel.width() - 18)

	var timeline_tracks_holder = timeline.find('.timeline-tracks-holder');
	var timeline_controls = timeline.find('.timeline-controls');
	var timeline_zone_selector = timeline.find('.timeline-zone-selector');

	timeline_tracks_holder.height(timeline.height() - timeline_zone_selector.height() - timeline_controls.height());
}