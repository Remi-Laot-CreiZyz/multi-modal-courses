var	waitForLoadingPdfDocument = false;

$(document).ready(function(){
	//
    // Disable workers to avoid yet another cross-origin issue (workers need the URL of
    // the script to be loaded, and currently do not allow cross-origin scripts)
    //
    PDFJS.disableWorker = true;
});

function loadPdf(url){
	if (!waitForLoadingPdfDocument){
		$('body').css('cursor', 'wait');
		$("#pdf-container").html('');
		var pdfDoc = null;
		waitForLoadingPdfDocument = true;
		PDFJS.getDocument(url).then(function (pdfDoc_) {
			pdfDoc = pdfDoc_;
			loadPage(1, pdfDoc_.numPages);
		});
	}
	function loadPage(page_number, maxPages){

		function renderPage(page) {
			var viewport = page.getViewport(1);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			var pdf_container = document.getElementById('pdf-container');
			var scale = $(pdf_container).innerWidth() / viewport.width * 0.95;

			canvas.height = viewport.height * scale;
			canvas.width = viewport.width * scale;

			var new_viewport = page.getViewport(scale);
			var renderContext = { canvasContext: ctx, viewport: new_viewport };

			var canvas_wrapper = document.createElement('div');
			canvas_wrapper.appendChild(canvas);
			document.getElementById('pdf-container').appendChild(canvas_wrapper);

			$(canvas).addClass('pdf-context').attr('data-page', page_number).attr('data-scale', scale);
			$(canvas_wrapper).addClass('canvas-wrapper').attr('data-page', page_number).attr('data-scale', scale);

			page.render(renderContext).promise.then(function(){
				if (page_number < maxPages) loadPage(page_number + 1, maxPages);
				else{
					waitForLoadingPdfDocument = false;
					$('body').css('cursor', '');
				}
			});

		}

		pdfDoc.getPage(page_number).then(renderPage)

	}
}

function displayFragment(eventElement){
	console.log("eventElement.attr('data-fragment') : "+eventElement.attr('data-fragment'));
	var fragment = eventElement.attr('data-fragment'),
		parameters = fragment.split('?')[1].split('&'),
		pageIndex = -1,
		offsetXIndex = -1,
		offsetYIndex = -1,
		widthIndex = -1,
		heightIndex = -1,
		idIndex = -1;
	// Looks for page parameter
	for (var i = 0; i < parameters.length; i++){
		if (parameters[i].split('=')[0] == 'page')
			pageIndex = i;
		if (parameters[i].split('=')[0] == 'offsetx')
			offsetXIndex = i;
		if (parameters[i].split('=')[0] == 'offsety')
			offsetYIndex = i;
		if (parameters[i].split('=')[0] == 'width')
			widthIndex = i;
		if (parameters[i].split('=')[0] == 'height')
			heightIndex = i;
		if (parameters[i].split('=')[0] == 'id')
			idIndex = i;
	}

	if (pageIndex != -1 && offsetXIndex != -1 && offsetYIndex != -1 && widthIndex != -1 && heightIndex != -1){
		//console.log("affichage fragment ("+eventElement.attr('data-fragment')+")")
		var target_canvas_wrapper = $('#pdf-container').find('.canvas-wrapper[data-page='+parameters[pageIndex].split('=')[1]+']');
		// Si la page est pas affichée
		if (target_canvas_wrapper) {

			target_canvas_wrapper.append('<div class="pdf-fragment selected-event" data-id="'+parameters[idIndex].split('=')[1]+'"></div>');
			var addedDiv = target_canvas_wrapper.find('.pdf-fragment:last');

			addedDiv.dblclick(function(){
				event = $(".timeline-track-event[data-id="+$(this).attr("data-id")+"]");
				if (event.hasClass('selected-event')){
					deselectEvent(event);
				}
				else{
					deselectEvent($('.timeline-track-event.selected-event'));
					selectEvent(event);
				}
			});

			addedDiv.width(parseFloat(parameters[widthIndex].split('=')[1]) * parseFloat(addedDiv.closest('.canvas-wrapper').attr('data-scale')));
			addedDiv.height(parseFloat(parameters[heightIndex].split('=')[1]) * parseFloat(addedDiv.closest('.canvas-wrapper').attr('data-scale')));
			addedDiv.css('left', ((parseFloat(parameters[offsetXIndex].split('=')[1]) * parseFloat(addedDiv.closest('.canvas-wrapper').attr('data-scale')))));
			addedDiv.css('top', ((parseFloat(parameters[offsetYIndex].split('=')[1]) * parseFloat(addedDiv.closest('.canvas-wrapper').attr('data-scale')))));
			// RESIZABLE FRAGMENT
			addedDiv.resizable({
				containment: "parent",
				handles : "n,s,e,w,ne,nw,se,sw",
				stop: function( event, ui ) {
					var pdf_container = $(this).closest('.canvas-wrapper');
					var newFragment = fragment.split('?')[0] + '?';
					var width = Math.min((event.pageX - $(this).offset().left), pdf_container.width())/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale')); // $(this).width n'est pas mit à jours lorsque l'event est lancé
					var height = Math.min((event.pageY - $(this).offset().top), pdf_container.height())/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale')); // $(this).height n'est pas mit à jours lorsque l'event est lancé
					for (var i = 0; i < parameters.length; i++){
						if (i != 0)
							newFragment += '&';
						if (parameters[i].split('=')[0] == 'offsetx')
							newFragment += 'offsetx=' + ($(this).offset().left - pdf_container.offset().left)/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale'));
						else if (parameters[i].split('=')[0] == 'offsety')
							newFragment += 'offsety=' + ($(this).offset().top - pdf_container.offset().top)/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale'));
						else if (parameters[i].split('=')[0] == 'width')
							newFragment += 'width=' + width;
						else if (parameters[i].split('=')[0] == 'height')
							newFragment += 'height=' + height;
						else
							newFragment += parameters[i];
					}
					eventElement.attr('data-fragment', newFragment);
					
				}
			});

			// DRAGGABLE FRAGMENT
			addedDiv.draggable({
				refreshPositions: true,
				containment: "parent",
				stop: function( event, ui ) {
					var pdf_container = $(this).closest('.canvas-wrapper');
					var newFragment = fragment.split('?')[0] + '?';
					for (var i = 0; i < parameters.length; i++){
						if (i != 0)
							newFragment += '&';
						if (parameters[i].split('=')[0] == 'offsetx')
							newFragment += 'offsetx=' + ($(this).offset().left - pdf_container.offset().left)/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale'));
						else if (parameters[i].split('=')[0] == 'offsety')
							newFragment += 'offsety=' + ($(this).offset().top - pdf_container.offset().top)/parseFloat($(this).closest('.canvas-wrapper').attr('data-scale'));
						else
							newFragment += parameters[i];
					}
					eventElement.attr('data-fragment', newFragment);
				}
			});
		}
	}
}

function getCurrentPageNumber(){
	var pdf_container = $( "#pdf-container" );
		var currentTop=pdf_container.scrollTop();
		var height=0;
		var page = -1;
		pdf_container.find(".canvas-wrapper").each(function(){
			height=height+$(this).outerHeight();
			//console.log("currentTop : "+currentTop)
			//console.log("height : "+height);
			if(currentTop<height && ($(this).attr("data-page") < page || page == -1)){
				//console.log($(this).attr("data-page"));
				page = $(this).attr("data-page");
			}
		});

		return page;

		//return currentTop/$(this).height();
}

function setCurrentPage(numPage, _offsetY){
	var pages = $('.canvas-wrapper'),
		offsetY = _offsetY || 0;
	if (numPage > 0 && numPage <= pages.length){
		$('#pdf-container').scrollTop($('#pdf-container').scrollTop() + $('.canvas-wrapper[data-page="'+numPage+'"]').offset().top + offsetY);
	}
}

function getScrollInCurrentPage(){
	var canvas_wrapper = $('.canvas-wrapper[data-page='+getCurrentPageNumber()+']');
	return - canvas_wrapper.position().top / parseFloat(canvas_wrapper.attr('data-scale'));
}

function goToFragment(fragment){
	var parameters = fragment.split("?")[1].split('&'),
		_offsety = 0,
		_page = 0,
		_scale = 1;
	// recherche des données dans le fragment	
	for (var i = 0; i < parameters.length; i++){
		if (parameters[i].split('=')[0] == 'offsety')
			_offsety = parseFloat(parameters[i].split('=')[1]);
		if (parameters[i].split('=')[0] == 'page')
			_page = parseFloat(parameters[i].split('=')[1]);
		if (parameters[i].split('=')[0] == 'scale')
			_scale = parseFloat(parameters[i].split('=')[1]);
	}
	setCurrentPage(_page, _offsety * _scale);
}