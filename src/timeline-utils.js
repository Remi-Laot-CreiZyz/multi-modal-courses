function getTrack(timeline, index)
{
	return timeline.find('.timeline-tracks-holder').children(':eq('+index+')');
}

function getEvent(track, index){
	return track.children(':eq('+index+')');
}

function selectEvent(_event, _fragment){
	// Si un event a été donné, on l'utilise, sinon on va le chercher à partir du fragment
	var event = _event || $('.timeline-track-event[data-id="'+_fragment.attr('data-id')+'"]');
	event.addClass('selected-event');
	event.draggable('enable');
	event.resizable('enable');
	// Si un fragment a été donné, on l'utilise, sinon on va le chercher à partir de l'event
	var fragment = _fragment || $('.pdf-fragment[data-id="'+event.attr('data-id')+'"]');
	fragment.addClass('selected-event');
	fragment.draggable('enable');
	fragment.resizable('enable');
	// On Déselectionne
}

function deselectEvent(_event, _fragment){
	// Si un event a été donné, on l'utilise, sinon on va le chercher à partir du fragment
	var event = _event || $('.timeline-track-event[data-id="'+_fragment.attr('data-id')+'"]');
	event.removeClass('selected-event');
	event.draggable('disable');
	event.resizable('disable');
	// Si un fragment a été donné, on l'utilise, sinon on va le chercher à partir de l'event
	var fragment = _fragment || $('.pdf-fragment[data-id="'+event.attr('data-id')+'"]');
	fragment.removeClass('selected-event');
	fragment.draggable('disable');
	fragment.resizable('disable');
}

function resizeEvent(timeline, event){
	var timeline_start = parseFloat(timeline.find('.timeline-controls').attr('data-start')),
		timeline_end = parseFloat(timeline.find('.timeline-controls').attr('data-end')),
		duree_timeline = timeline_end - timeline_start,
		time_start = parseFloat(event.attr('data-start')),
		time_end = parseFloat(event.attr('data-end'));

	event.width(((time_end - time_start) / duree_timeline) * timeline.find('.timeline-track').width());
	event.css('left', ((time_start - timeline_start)/duree_timeline) * timeline.find('.timeline-track').width());
}

function resizeEventsTimeline(timeline){
	// Resize each events
	timeline.find('.timeline-track-event').each(function(){
		resizeEvent(timeline, $(this));
	})
}