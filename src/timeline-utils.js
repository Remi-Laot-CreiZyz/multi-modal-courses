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

function exportFragment(){
	var _export="<tracks>";
	$(".timeline-track").each(function(){
			_export=_export+"<track>"
				$(this).find(".timeline-track-event").each(function(){
					console.log("export :"+$(this).attr('data-fragment'));
					var parameters = $(this).attr('data-fragment').split('?')[1].split('&'),
					indexPage;
					for (var i = 0; i < parameters.length; i++){
							if (parameters[i].split('=')[0] == 'page')
								indexPage=i;
					}
					var fragment = $(".pdf-fragment[data-id="+$(this).attr('data-id')+"]");
					_export=_export+"<fragment><track-timeline start='"+$(this).attr('data-start')+"' end='"+$(this).attr('data-end')+"' ><track-timeline-event type='pdf' page='"+parameters[indexPage].split('=')[1]+"' offsetx='"+parseFloat(fragment.css('left'))+"' offsety='"+parseFloat(fragment.css('top'))+"' width='"+parseFloat(fragment.css('width'))+"' height='"+parseFloat(fragment.css('height'))+"' /></track-timeline></fragment>"
				});
			_export=_export+"</track>"
		});
	_export=_export+"</tracks>"
	
	return _export;
}

function importFragment(text){
	var xml = text,
	xmlDoc = $.parseXML( xml ),
	$xml = $( xmlDoc );		
	$xml.find('tracks').find('track').each(function(){
		addTrack($("#timeline"));
		var selected_track = $('.timeline-track.selected-track');
			
		$(this).find("fragment").each(function(){
			if (selected_track.length != 0 && $('.canvas-wrapper').length != 0){
			var newEvent = addEvent(selected_track, {
					type: ''+$(this).find("track-timeline-event").attr('type')+'',
					startTime: $(this).find("track-timeline").attr("start"), // CURRENT TIME VIDEO
					endTime: $(this).find("track-timeline").attr("end"), // CURRENT TIME VIDEO + 5
					fragment: 'urlPdf?id='+idCount+'&page='+$(this).find("track-timeline-event").attr('page')+'&offsetx='+$(this).find("track-timeline-event").attr('offsetx')+'&offsety='+$(this).find("track-timeline-event").attr('offsety')+'&width='+$(this).find("track-timeline-event").attr('width')+'&height='+$(this).find("track-timeline-event").attr('height')+''
			});
			resizeEventsTimeline($('#timeline'));
			displayFragment(newEvent);
			}
		});
		

	});
}
