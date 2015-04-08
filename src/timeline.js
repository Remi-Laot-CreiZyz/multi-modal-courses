$(document).ready(function(){
	createTimeline($('#timeline'), 36.51);
	
	// $('#timeline').mouseover(function(e){
	// 	$('#positionInTimeline').html('temps: ' + ((event.pageX/$(this).width())*parseFloat($(this).find(".timeline-panel").attr("data-duree"))).toFixed(2))
	// });
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

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em", id:"addTrack"}).text("addTrack").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));
		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em",id:"deleteTrack"}).text("deleteTrack").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));

		$("#addTrack").click(function(){
			//alert("addTrack");
			addTrack($("#timeline"));
		});


		


		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em",id:"ajout-frament"}).text("ajout-frament").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));
		
		$("#ajout-frament").click(function(){
			var selected_track = $('.timeline-tracks-holder > .selected');
			console.log(selected_track);
			if (!$.isEmptyObject(selected_track)){
				var newEvent = addEvent(selected_track, {
					type: 'pdf',
					startTime: 0, // CURRENT TIME VIDEO
					endTime: 5, // CURRENT TIME VIDEO + 5
					fragment: 'urlPdf?page=1&offsetx=0&offsety=0&width=200&height=100'
				});
				resizeEventsTimeline($('#timeline'));
				displayFragment(newEvent);
			}
			//alert("addTrack");
			// addEvent(getTrack($("#timeline",$('.selected').index())),{type:'pdf',startTime:$("#video").currentTime,endTime:$("#video").currentTime+2,});
		});

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em"}).text("editer").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));

	/* timeline-panel */
	timelineElement.append('<div class="timeline-panel col-xs-12 col-md-9" data-duree="'+duree+'"></div>')
	var timeline_panel = $('.timeline-panel');
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
	//addTrack(timelineElement);
	
	resizeEventsTimeline(timelineElement);
}

function resizeEvent(timeline, event){
	var duree_timeline = parseFloat(timeline.find('.timeline-panel').attr('data-duree'));
	var time_start = parseFloat(event.attr('data-start'));
	var time_end = parseFloat(event.attr('data-end'));

	event.width(((time_end - time_start) / duree_timeline) * timeline.width());
	event.css('left', (time_start/duree_timeline) * timeline.width() + timeline.offset().left);
}

function resizeEventsTimeline(timeline){
	// Resize each events
	timeline.find('.timeline-track-event').each(function(){
		resizeEvent(timeline, $(this));
	})
}

function addTrack(timeline){
	timeline.find('.timeline-track.selected').removeClass('selected');
	timeline.find('.timeline-tracks-holder').append('<div class="timeline-track selected"></div>');
	$(".timeline-track" ).off();
	$(".timeline-track").click(function(){
		if ($(this).hasClass('selected')) $(this).removeClass('selected');
		else{
			$('.timeline-track.selected').removeClass('selected');
			$(this).addClass('selected');
		}
	})
}

function addEvent(track, trackEvent){
	console.log(track);
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
			resizeEventsTimeline($('#timeline'));
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
			resizeEventsTimeline($('#timeline'));
		}
	});
	console.log('event added');
	console.log(addedEvent);
	return addedEvent;
}

function getTrack(timeline, index)
{
	return timeline.find('.timeline-tracks-holder').children(':eq('+index+')');
}

function getEvent(track, index){
	return track.children(':eq('+index+')');
}