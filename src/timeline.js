var idCount = 0;

function createTimeline(timelineElement, video){

	var counter = 0;

	setInterval(function(e){
		counter ++;
		$('.timeline-track-event').each(function(e){
			console.log("!!!!"+counter);
			console.log(parseFloat($(this).attr('data-start')));
			console.log(parseFloat($(this).attr('data-end')));
			console.log(video.currentTime);
			console.log("!!!!"+counter);
			if (parseFloat($(this).attr('data-start')) <= video.currentTime && video.currentTime <= parseFloat($(this).attr('data-end'))){
				console.log('REUSSI!');
				$('.pdf-fragment[data-id="'+$(this).attr('data-id')+'"]').css('background-color', '#58ACFA');
				$(this).css('background-color', '#58ACFA');
				$(this).addClass('displayed');
				goToFragment($(this).attr('data-fragment'));
			}
			else {
				$(this).css('background-color', '');
				$('.pdf-fragment[data-id="'+$(this).attr('data-id')+'"]').css('background-color', '');
				$(this).removeClass('displayed');
			}
		})
	}, 1000);

	timelineElement.addClass('row').html('');
	
	/* control-panel-top */
	timelineElement.append('<div class="col-xs-6 col-md-3 control-panel"></div>');
	var control_panel = $('.control-panel');

		// Video controls
		var video_controls = $(document.createElement('div')).addClass('video-controls')
		control_panel.append(video_controls);
		video_controls.append($(document.createElement('div')).attr('id','playpause').addClass('play').click(function(e){
			// Click handler play/pause button
			if ($(this).hasClass('play')) { $(this).removeClass('play'); $(this).addClass('pause'); video.play(); }
			else { $(this).removeClass('pause'); $(this).addClass('play'); video.pause(); }
		})).append($(document.createElement('div')).attr('id', 'volume').addClass('volume-100').click(function(e){
			// Click handler volume button
			if ($(this).hasClass('volume-100')) { $(this).removeClass('volume-100'); $(this).addClass('volume-50'); video.volume = 0.5; }
			else if ($(this).hasClass('volume-50')) { $(this).removeClass('volume-50'); $(this).addClass('volume-0'); video.volume = 0; }
			else { $(this).removeClass('volume-0'); $(this).addClass('volume-100'); video.volume = 1; }
		})).append($(document.createElement('div')).attr('id', 'time').addClass('time-detail').append($(document.createElement('input')).attr('type', 'text')).append($(document.createElement('span')).html("/"+video.duration.toFixed(2))));

		// Click on time
		$('#time').click(function(e){
			$(this).find('input').focus();
		});
		// Check time inputs
		$('#time>input').on('input', function(e){
			$(this).val($(this).val().replace(/[^0-9.]/g,''));
		})
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

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em", id:"addTrack"}).text("ajouter track").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));
		
		$("#addTrack").click(function(){
			//alert("addTrack");
			addTrack($("#timeline"));
		});

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em",id:"deleteTrack"}).text("supprimer track").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control1')));

		$("#deleteTrack").click(function(){
			if(!$(".timeline-track").hasClass('selected-track')){
				alert("no timline selected");
				return;
			}
			$(".timeline-track.selected").find(".timeline-track-event").each(function(){
				var eventFragment = $(this);
				$(".pdf-fragment").each(function(){
					if($(this).attr("data-id")==eventFragment.attr("data-id"))$(this).remove();
				});
			}).remove();
			$(".selected").remove();
		});
		


		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em",id:"ajout-frament"}).text("ajouter fragment").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));
		
		$("#ajout-frament").click(function(){
			if(!$(".timeline-track").hasClass('selected-track')){
				alert("no timeline selected");
				return;
			}
			var selected_track = $('.timeline-track.selected-track');
			if (selected_track.length != 0 && $('.canvas-wrapper').length != 0){
				document.getElementById('video').pause();
				$('#playpause').removeClass('pause').addClass('play');
				var newEvent = addEvent(selected_track, {
					type: 'pdf',
					startTime: document.getElementById('video').currentTime, // CURRENT TIME VIDEO
					endTime: document.getElementById('video').currentTime+5, // CURRENT TIME VIDEO + 5
					fragment: 'urlPdf?id='+idCount+'&page='+getCurrentPageNumber()+'&offsetx=0&offsety='+Math.max(0, getScrollInCurrentPage())+'&width=200&height=100'
				});
				resizeEventsTimeline($('#timeline'));
				displayFragment(newEvent);


			}
			//alert(getCurrentPageNumber());
			//alert("addTrack");
			// addEvent(getTrack($("#timeline",$('.selected').index())),{type:'pdf',startTime:$("#video").currentTime,endTime:$("#video").currentTime+2,});
		});

		$('<button/>',{type:"submit",class:"btn-primary", style:"width:6em", id:"deleteFragment"}).text("supprimer fragment").appendTo($('<div/>',{class:"col-xs-6 right-control"}).appendTo($('.row-right-control3')));

		$("#deleteFragment").click(function(){
			if(!$(".timeline-track-event").hasClass('selected-event')){
				alert("no fragment selected");
				return;
			}
			var eventFragment = $(".selected-event");

			if(eventFragment.length!=0){
				$(".pdf-fragment").each(function(){
					if($(this).attr("data-id")==eventFragment.attr("data-id"))$(this).remove();
				});
				eventFragment.remove();
				idCount=idCount-1;
			}
		});

	/* timeline-panel */
	timelineElement.append('<div class="timeline-panel col-xs-12 col-md-9" data-duree="'+video.duration+'"></div>')
	var timeline_panel = $('.timeline-panel');
		// Time controls
		timeline_panel.append('<div class="timeline-controls" data-start="0" data-end="'+video.duration+'"></div>');
		$('.timeline-controls').append('<div id="timeline-time-slider"></div>');
		$('#timeline-time-slider').slider({
			step: 0.1,
			stop : function(event, ui){
				var video = document.getElementById('video');
				video.currentTime = (parseFloat($('.timeline-controls').attr('data-end')) - parseFloat($('.timeline-controls').attr('data-start')))*ui.value + parseFloat($('.timeline-controls').attr('data-start'));
			}
		});
		
		// Timeline tracks
		timeline_panel.append($(document.createElement('div')).addClass('timeline-tracks-holder'));
		// Slider to choose
		timeline_panel.append('<div class="timeline-zone-selector"></div>');
		$('.timeline-zone-selector').append('<div id="timeline-zone-slider"></div>');
		$('#timeline-zone-slider').slider({
			range: true,
			min: 0,
			max: 100,
			values: [0,100],
			change: function(event, ui){
				$('.timeline-controls').attr('data-start', ui.values[0]/100 * video.duration);
				$('.timeline-controls').attr('data-end', ui.values[1]/100 * video.duration);
				resizeEventsTimeline($('#timeline'));
			}
		});

		$('.timeline-zone-selector').append('<div id="time-position"></div>');

	resizeEventsTimeline(timelineElement);
	resizeDocument();
}

function addTrack(timeline){
	timeline.find('.selected-track').removeClass('selected-track');
	timeline.find('.timeline-tracks-holder').append($(document.createElement('div')).addClass('track-wrapper').append($(document.createElement('div')).addClass('timeline-track-selector').addClass('selected-track').click(function(e){
		if ($(this).hasClass('selected-track')) { $(this).parent().children().removeClass('selected-track'); }
		else { $('.selected-track').removeClass('selected-track'); $(this).parent().children().addClass('selected-track'); }
	})).append($(document.createElement('div')).addClass('timeline-track').addClass('selected-track')));
}

function addEvent(track, trackEvent){
	deselectEvent($('.timeline-track-event.selected-event'));
	track.append('<div class="timeline-track-event selected-event" data-id="'+idCount+'" data-type="'+trackEvent.type+'" data-start="'+trackEvent.startTime+'" data-end="'+trackEvent.endTime+'" data-fragment="'+trackEvent.fragment+'"></div>');
	idCount=idCount+1;
	var addedEvent = track.children(":last");

	addedEvent.dblclick(function(e){
		if ($(this).hasClass('selected-event')) deselectEvent($(this));
		else{
			goToFragment($(this).attr('data-fragment'));
			deselectEvent($('.timeline-track-event.selected-event'));
			selectEvent($(this));
		}
	});

	addedEvent.draggable({
		containment: "parent",
		axis: "x",
		stop: function( event, ui ) {
			var dureeEvent = parseFloat($(this).attr('data-end'))-parseFloat($(this).attr('data-start'));
			var start = (($(this).offset().left-track.offset().left)/track.width())*(parseFloat(track.closest(".timeline-panel").find('.timeline-controls').attr("data-end")) - parseFloat(track.closest(".timeline-panel").find('.timeline-controls').attr("data-start")));
			var end = start+dureeEvent;
			$(this).attr("data-start", start);
			$(this).attr("data-end", end);
		}
	});

	addedEvent.resizable({
		refreshPositions: true,
		containment: "parent",
		// animate: true,
		handles: "e",
		stop: function(event, ui) {
			var width = $(this).width(); // $(this).width n'est pas mit à jours lorsque l'event est lancé
			var dureeTimeline = (parseFloat(track.closest(".timeline-panel").find('.timeline-controls').attr("data-end")) - parseFloat(track.closest(".timeline-panel").find('.timeline-controls').attr("data-start")));
			var dureeEvent = (width/track.width())*dureeTimeline;
			var start = parseFloat($(this).attr("data-start"));
			var end = Math.min(start + dureeEvent, dureeTimeline);
			$(this).attr("data-end", end);
			resizeEventsTimeline($('#timeline'));
		}
	});
	return addedEvent;

}

