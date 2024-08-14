document.addEventListener("DOMContentLoaded", function () {
    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas('pdf-canvas', {
        backgroundColor: '#fff',
        selection: false
    });

    // Load the PDF using PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    async function loadAndRenderPDF(url) {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const container = document.getElementById('pdf-container');
        container.innerHTML = ''; // Clear previous content

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });

            const canvasElement = document.createElement('canvas');
            const context = canvasElement.getContext('2d');
            canvasElement.height = viewport.height;
            canvasElement.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            const img = new Image();
            img.src = canvasElement.toDataURL();
            img.onload = function () {
                const imgInstance = new fabric.Image(img, {
                    left: 0,
                    top: 0,
                    selectable: false
                });
                canvas.add(imgInstance);
                canvas.setWidth(viewport.width);
                canvas.setHeight(viewport.height);
                canvas.renderAll();
            };

            container.appendChild(canvasElement);
        }
    }

    // Trigger PDF load and render
    loadAndRenderPDF('css/images/D&DBeyondCharacterSheet.pdf');

    // Adding text via Fabric.js
    canvas.on('mouse:down', function (options) {
        if (options.target && options.target.type === 'text') {
            return;
        }

        const pointer = canvas.getPointer(options.e);
        const text = new fabric.Textbox('Edit Me', {
            left: pointer.x,
            top: pointer.y,
            fontSize: 20,
            fill: '#000',
            width: 200,
            editingBorderColor: 'red',
            editable: true,
        });

        canvas.add(text).setActiveObject(text);
        canvas.renderAll();
        text.enterEditing();
    });

    // Export to PDF function
    document.getElementById('save-character').addEventListener('click', exportToPDF);

    function exportToPDF() {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.getWidth(), canvas.getHeight()]
        });

        const imgData = canvas.toDataURL({
            format: 'png',
            multiplier: 2
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.getWidth(), canvas.getHeight());

        pdf.save('edited_character_sheet.pdf');
    }
});
