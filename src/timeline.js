$(document).ready(function(){
	createTimeline($('#timeline'), 36.51);
});

function createTimeline(timelineElement, duree){
	/* control-panel-top */
	timelineElement.append('<div class="control-panel-top"></div>');
	var control_panel_top = timelineElement.find('.control-panel-top');

	control_panel_top.append('<div class="video-controls"></div>');
	control_panel_top.append('<div class="time-control"></div>');

	/* timeline-panel */
	timelineElement.append('<div class="timeline-panel" data-duree="'+duree+'"></div>');

	addTrack(timelineElement);
	addEvent(getTrack(timelineElement, 0), {type:"pdf", startTime: 1, endTime: 2.5, fragment: "urlPdf/?offsetX=&offsetY=&width=&height="});
	resizeTimeline(timelineElement);
}

function resizeEvent(timeline, event){
	var duree_timeline = parseFloat(timeline.find('.timeline-panel').attr('data-duree'));
	var time_start = parseFloat(event.attr('data-start'));
	var time_end = parseFloat(event.attr('data-end'));

	console.log(duree_timeline + " ... " + time_start + " ... " + time_end);
	
	event.width(((time_end - time_start) / duree_timeline) * timeline.width());
}

function resizeTimeline(timeline){
	// Resize each events
	timeline.find('.timeline-track-event').each(function(){
		resizeEvent(timeline, $(this));
	})
}

function addTrack(timeline){
	timeline.find('.timeline-panel').append('<div class="timeline-track"></div>');
}

function addEvent(track, trackEvent){
	track.append('<div class="timeline-track-event" data-type="'+trackEvent.type+'" data-start="'+trackEvent.startTime+'" data-end="'+trackEvent.endTime+'" data-fragment="'+trackEvent.fragment+'"></div>');
	var eventDrag = track.children(":last");
	eventDrag.draggable({
		stop: function( event, ui ) {
			

			var dureeEvent = ($(this).width()/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var start = (($(this).offset().left-track.offset().left)/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var end = start+dureeEvent;
			$(this).attr("data-start", start);
			$(this).attr("data-end", end);
		},
		axis: "x",
	});

	eventDrag.resizable({
		animate: true,
		handles: "e",
		stop: function(event, ui) {
			var dureeEvent = ($(this).width()/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var start = (($(this).offset().left-track.offset().left)/track.width())*parseFloat(track.closest(".timeline-panel").attr("data-duree"));
			var end = start+dureeEvent;
			$(this).attr("data-start", start);
			$(this).attr("data-end", end);
		}
	});
}

function getTrack(timeline, index)
{
	return timeline.find('.timeline-panel').children(':eq('+index+')');
}
