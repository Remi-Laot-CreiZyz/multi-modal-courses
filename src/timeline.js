$(document).ready(function(){
	createTimeline($('#timeline'), 36.51);
	
	// $('#timeline').mouseover(function(e){
	// 	$('#positionInTimeline').html('temps: ' + ((event.pageX/$(this).width())*parseFloat($(this).find(".timeline-panel").attr("data-duree"))).toFixed(2))
	// });

	$(window).resize(function(){
		console.log("window resized");
		// resizeTimeline($('#timeline'));
	});
});

function createTimeline(timelineElement, duree){
	timelineElement.addClass('row');
	
	/* control-panel-top */
	timelineElement.append('<div class="col-xs-6 col-md-3 control-panel"></div>');
	var control_panel = $('.control-panel');
		// Video controls 
		control_panel.append('<div class="video-controls"></div>');
		var video_controls = control_panel.children('.video-controls');
		video_controls.append('<div id="playpause" class="play"></div>');
		video_controls.append('<div id="volume" class="volume-100"></div>');
		video_controls.append('<div id="time" class="time-detail"></div>');
			$('#time').append('<input type="text"/>');
			$('#time').append('<span></span>');
			$('#time span').html("/"+duree);
		// Track controls
		control_panel.append('<div class="track-controls"></div>');
		var track_controls = $('.track-controls');
		$('<div/>',{class:"row"}).appendTo(track_controls);
		$('<div/>',{class:"col-xs-4 left-control"}).appendTo(track_controls.find($('.row')));
		$('<div/>',{class:"col-xs-8 right-control"}).appendTo(track_controls.find($('.row')));

		var left_control = $('.left-control');


		var right_control = $('.right-control');

		$('<div/>',{class:"row row-right-control1"}).appendTo($(right_control));
		$('<div/>',{class:"row row-right-control2"}).appendTo($(right_control));
		$('<div/>',{class:"row row-right-control3"}).appendTo($(right_control));

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em"}).text("débuit annotation").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));
		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em"}).text("fin annotation").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));

		
		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em", id:"assigner"}).text("assigner").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));
		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em"}).text("editer").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));


	/* timeline-panel */
	timelineElement.append('<div class="timeline-panel col-xs-12 col-md-9" data-duree="'+duree+'"></div>')
	var timeline_panel = $('.timeline-panel');
	// timeline_panel.resizable({
	// 	handles: "n"
	// });
		// Time controls
		timeline_panel.append('<div class="timeline-controls"></div>');
		$('.timeline-controls').append('<div id="timeline-time-slider"></div>');
		$('#timeline-time-slider').slider();
		// Timeline tracks
		timeline_panel.append('<div class="timeline-tracks-holder"></div>');
		// Slider to choose
		timeline_panel.append('<div class="timeline-zone-selector"></div>');
		$('.timeline-zone-selector').append('<div id="timeline-zone-slider"></div>');
		$('#timeline-zone-slider').slider({
			range: true,
			min: 0,
			max: 100,
			values: [0,100]
		});



	// TESTS
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addTrack(timelineElement);
	addEvent(getTrack(timelineElement, 0), {type:"pdf", startTime: 1, endTime: 2.5, fragment: "urlPdf/?page=1&offsetx=25&offsety=25&width=90&height=90"});
	addEvent(getTrack(timelineElement, 2), {type:"pdf", startTime: 20, endTime: 30, fragment: "urlPdf/?offsetx=&offsety=&width=&height="});
	addEvent(getTrack(timelineElement, 1), {type:"pdf", startTime: 15, endTime: 25.8, fragment: "urlPdf/?offsetx=&offsety=&width=&height="});
	addEvent(getTrack(timelineElement, 0), {type:"pdf", startTime: 4, endTime: 13, fragment: "urlPdf/?offsetx=&offsety=&width=&height="});
	displayFragment(getEvent(getTrack(timelineElement, 0), 0));
	resizeTimeline(timelineElement);
}

function resizeEvent(timeline, event){
	var duree_timeline = parseFloat(timeline.find('.timeline-panel').attr('data-duree'));
	var time_start = parseFloat(event.attr('data-start'));
	var time_end = parseFloat(event.attr('data-end'));

	event.width(((time_end - time_start) / duree_timeline) * timeline.width());
	event.css('left', (time_start/duree_timeline) * timeline.width() + timeline.offset().left);
}

function resizeTimeline(timeline){
	// Resize each events
	timeline.find('.timeline-track-event').each(function(){
		resizeEvent(timeline, $(this));
	})
}

function addTrack(timeline){
	timeline.find('.timeline-tracks-holder').append('<div class="timeline-track"></div>');
}

function addEvent(track, trackEvent){
	track.append('<div class="timeline-track-event" data-type="'+trackEvent.type+'" data-start="'+trackEvent.startTime+'" data-end="'+trackEvent.endTime+'" data-fragment="'+trackEvent.fragment+'"></div>');
	var addedEvent = track.children(":last");

	addedEvent.draggable({
		containment: "parent",
		axis: "x",
		stop: function( event, ui ) {
			var dureeEvent = parseFloat($(this).attr('data-end'))-parseFloat($(this).attr('data-start'));
			var start = (($(this).offset().left-track.offset().left)/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var end = start+dureeEvent;
			$(this).attr("data-start", start);
			$(this).attr("data-end", end);
		}
	});

	addedEvent.resizable({
		containment: "parent",
		animate: true,
		handles: "e",
		stop: function(event, ui) {
			var width = event.pageX - $(this).offset().left; // $(this).width n'est pas mit à jours lorsque l'event est lancé
			var dureeEvent = (width/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var start = parseFloat($(this).attr("data-start"));
			var end = Math.min(start + dureeEvent, parseFloat(track.closest(".timeline-panel").attr("data-duree")));
			$(this).attr("data-end", end);
			console.log(end);
		}
	});

}

function getTrack(timeline, index)
{
	return timeline.find('.timeline-tracks-holder').children(':eq('+index+')');
}

function getEvent(track, index){
	return track.children(':eq('+index+')');
}
