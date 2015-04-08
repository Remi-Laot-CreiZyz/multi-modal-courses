var	waitForLoadingPdfDocument = false;

$(document).ready(function(){
	//
    // Disable workers to avoid yet another cross-origin issue (workers need the URL of
    // the script to be loaded, and currently do not allow cross-origin scripts)
    //
    PDFJS.disableWorker = true;

	var fragment = 'rapport_cles.pdf?page=2';
	loadPdf(fragment);
});

function loadPdf(fragment){
	var url = fragment.split('?')[0],
		parameters = fragment.split('?')[1].split('&'),
		pageIndex = -1;

	// Looks for page parameter
	for (var i = 0; i < parameters.length; i++)
		if (parameters[i].split('=')[0] == 'page')
			pageIndex = i;


	if (!waitForLoadingPdfDocument && pageIndex != -1){
		var pdfDoc = null;
		waitForLoadingPdfDocument = true;
		PDFJS.getDocument(url).then(function (pdfDoc_) {
			pdfDoc = pdfDoc_;
			for (var i = 1; i <= pdfDoc_.numPages; i++){
				waitForLoadingPdfDocument = false;
				loadPage(i);
			}
		});
	}

	function loadPage(page_number){

		function renderPage(page) {
			var viewport = page.getViewport(1);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var renderContext = { canvasContext: ctx, viewport: viewport };

			var pdf_container = document.getElementById('pdf-container');
			var scale = $(pdf_container).innerWidth() / viewport.width * 0.95;

			canvas.height = viewport.height * scale;
			canvas.width = viewport.width * scale;

			viewport = page.getViewport(scale);

			var canvas_wrapper = document.createElement('div');
			canvas_wrapper.appendChild(canvas);
			document.getElementById('pdf-container').appendChild(canvas_wrapper);

			$(canvas).addClass('pdf-context').attr('data-page', page_number).attr('data-scale', scale);
			$(canvas_wrapper).addClass('canvas-wrapper').attr('data-page', page_number).attr('data-scale', scale);

			page.render(renderContext);
		}

		pdfDoc.getPage(page_number).then(renderPage)

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
		console.log("affichage fragment ("+eventElement.attr('data-fragment')+")")
		var target_canvas_wrapper = $('#pdf-container').find('.canvas-wrapper[data-page='+parameters[pageIndex].split('=')[1]+']');
		// Si la page est pas affichée
		if (target_canvas_wrapper) {
			target_canvas_wrapper.append('<div class="pdf-fragment"></div>');
			var addedDiv = target_canvas_wrapper.find('.pdf-fragment:last');

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
					var newFragment = fragment.split('?')[0];
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
				containment: "parent",
				stop: function( event, ui ) {
					var pdf_container = $(this).closest('.canvas-wrapper');
					var newFragment = fragment.split('?')[0];
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