var pdfUrl = null,
	pdfDoc = null,
	pdfPage = null,
	scale = 1,
	waitForLoadingPdfPage = false,
	waitForLoadingPdfDocument = false;

$(document).ready(function(){
	//
    // Disable workers to avoid yet another cross-origin issue (workers need the URL of
    // the script to be loaded, and currently do not allow cross-origin scripts)
    //
    PDFJS.disableWorker = true;

	var fragment = 'rapport_cles.pdf?page=1';
	loadPage(fragment);
});

function loadPdf(fragment, callback){
	var url = fragment.split('?')[0];
	console.log(url);
	pdfDoc = null; // reset variable
	pdfUrl = null;

	if (!waitForLoadingPdfDocument){
		waitForLoadingPdfDocument = true;
		PDFJS.getDocument(url).then(function (pdfDoc_) {
			waitForLoadingPdfDocument = false;
			pdfUrl = url;
			pdfDoc = pdfDoc_;
			if (callback == loadPage) callback(fragment);
		});
	}
}

function loadPage(fragment){
	if (!waitForLoadingPdfPage){
		waitForLoadingPdfPage = true;
		var parameters = fragment.split('?')[1].split('&'),
			pageIndex = -1;

		// Looks for page parameter
		for (var i = 0; i < parameters.length; i++)
			if (parameters[i].split('=')[0] == 'page')
				pageIndex = i;

		if (pageIndex != -1){
			// We load the pdf
		 	if (pdfUrl != fragment.split('?')[0]){
		 		loadPdf(fragment, loadPage);
				waitForLoadingPdfPage = false;
		 	}
		 	// We load the page
		 	else {
		 		pdfDoc.getPage(parseInt(parameters[pageIndex].split('=')[1])).then(function(page) {
					var pdfViewBox = page.pageInfo.view;
					var pdfPageWidth = pdfViewBox[2];
					var pdfPageHeight = pdfViewBox[3];

					var width = $('#pdf-container').width();
					var height = (pdfPageHeight/pdfPageWidth) * width;
					var scale = height / pdfPageHeight;
					
					var viewport = new PDFJS.PageViewport(pdfViewBox, scale, page.rotate, 0,0);

					$('#pdf-container').append('<div class="canvas-wrapper" data-page="'+parameters[pageIndex].split('=')[1]+'"><canvas class="pdf-context"/></div>');
					var canvas_wrapper = $('#pdf-container').children('.canvas-wrapper:last');

					canvas_wrapper.width(width);
					canvas_wrapper.height(height);
					canvas_wrapper.find('.pdf-context').width(width);
					canvas_wrapper.find('.pdf-context').height(height);

					console.log(canvas_wrapper.find('canvas').get(0));
					console.log(scale);
					console.log(canvas_wrapper.find('canvas').get(0).getContext('2d'));
					var canvasContext = canvas_wrapper.find('canvas').get(0).getContext('2d');

					var renderTask = page.render({canvasContext:canvasContext,viewport:viewport});

					// Wait for rendering to finish
					renderTask.promise.then(function() {
						console.log('chargement page termine!');
						waitForLoadingPdfPage = false;
					});
				});
		 	}
		}
	}
}

function displayFragment(eventElement){
	var fragment = eventElement.attr('data-fragment'),
		parameters = fragment.split('?')[1].split('&'),
		pageIndex = -1,
		offsetXIndex = -1,
		offsetYIndex = -1,
		widthIndex = -1,
		heightIndex = -1;

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
	}

	if (pageIndex != -1 && offsetXIndex != -1 && offsetYIndex != -1 && widthIndex != -1 && heightIndex != -1){
		var target_canvas_wrapper = $('#pdf-container').find('.canvas-wrapper[data-page='+parameters[pageIndex].split('=')[1]+']');
		// Si la page n'est pas affichée
		if (!target_canvas_wrapper) {
			loadPage(eventElement.attr('data-fragment'));
		}
		// Si la page est affichée
		else {
			target_canvas_wrapper.append('<div class="pdf-fragment"></div>');
			var addedDiv = target_canvas_wrapper.children(':last');

			addedDiv.width(parseFloat(parameters[widthIndex].split('=')[1]) * scale);
			addedDiv.height(parseFloat(parameters[heightIndex].split('=')[1]) * scale);
			addedDiv.css('left', ((parseFloat(parameters[offsetXIndex].split('=')[1]) * scale)));
			addedDiv.css('top', ((parseFloat(parameters[offsetYIndex].split('=')[1]) * scale)));

			// RESIZABLE FRAGMENT
			addedDiv.resizable({
				containment: "parent",
				handles : "n,s,e,w,ne,nw,se,sw",
				stop: function( event, ui ) {
					var pdf_container = $('#pdf-container');
					var newFragment = fragment.split('?')[0];
					var width = Math.min((event.pageX - $(this).offset().left), pdf_container.width())/scale; // $(this).width n'est pas mit à jours lorsque l'event est lancé
					var height = Math.min((event.pageY - $(this).offset().top), pdf_container.height())/scale; // $(this).height n'est pas mit à jours lorsque l'event est lancé
					for (var i = 0; i < parameters.length; i++){
						if (i != 0)
							newFragment += '&';
						if (parameters[i].split('=')[0] == 'offsetx')
							newFragment += 'offsetx=' + ($(this).offset().left - pdf_container.offset().left)/scale;
						else if (parameters[i].split('=')[0] == 'offsety')
							newFragment += 'offsety=' + ($(this).offset().top - pdf_container.offset().top)/scale;
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
				containment: "parent",
				stop: function( event, ui ) {
					var pdf_container = $('#pdf-container');
					var newFragment = fragment.split('?')[0];
					for (var i = 0; i < parameters.length; i++){
						if (i != 0)
							newFragment += '&';
						if (parameters[i].split('=')[0] == 'offsetx')
							newFragment += 'offsetx=' + ($(this).offset().left - pdf_container.offset().left)/scale;
						else if (parameters[i].split('=')[0] == 'offsety')
							newFragment += 'offsety=' + ($(this).offset().top - pdf_container.offset().top)/scale;
						else
							newFragment += parameters[i];
					}
					eventElement.attr('data-fragment', newFragment);
				}
			});
		}
	}
}