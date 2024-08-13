pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;
let canvas = new fabric.Canvas('pdf-canvas');
let fabricObjects = [];

document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
document.getElementById('next-page').addEventListener('click', () => changePage(1));
document.getElementById('add-text').addEventListener('click', addText);
document.getElementById('save-progress').addEventListener('click', saveProgress);
document.getElementById('export-pdf').addEventListener('click', exportToPDF);

function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then(doc => {
        pdfDoc = doc;
        document.getElementById('page-count').textContent = pdfDoc.numPages;
        renderPage(currentPage);
    });
}

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const context = canvas.getContext('2d');
        canvas.setWidth(viewport.width);
        canvas.setHeight(viewport.height);

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext).promise.then(() => {
            canvas.clear();
            fabricObjects.forEach(obj => canvas.add(obj));
        });
    });
    document.getElementById('page-num').textContent = num;
}

function changePage(offset) {
    currentPage = Math.min(Math.max(currentPage + offset, 1), pdfDoc.numPages);
    renderPage(currentPage);
}

function addText() {
    const text = new fabric.Textbox('Enter text here', {
        left: 100,
        top: 100,
        fontSize: parseInt(document.getElementById('font-size').value, 10),
        fill: document.getElementById('font-color').value,
        fontFamily: document.getElementById('font-family').value
    });
    canvas.add(text);
    fabricObjects.push(text);
    canvas.setActiveObject(text);
    text.enterEditing();
}

function saveProgress() {
    const json = JSON.stringify(canvas.toJSON());
    localStorage.setItem(`pdf_page_${currentPage}`, json);
    alert('Progress saved!');
}

function loadProgress() {
    const savedJson = localStorage.getItem(`pdf_page_${currentPage}`);
    if (savedJson) {
        canvas.loadFromJSON(savedJson, canvas.renderAll.bind(canvas));
    }
}

function exportToPDF() {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.getWidth(), canvas.getHeight()]
    });

    const pages = [canvas]; // Assuming you have multiple canvases, you'd loop through them

    pages.forEach((pageCanvas, index) => {
        pageCanvas.renderAll();

        // Capture the content of the canvas
        const imgData = pageCanvas.toDataURL('image/png');

        // Calculate the proper scaling factor to maintain high quality
        const width = pdf.internal.pageSize.getWidth();
        const height = (pageCanvas.getHeight() / pageCanvas.getWidth()) * width;

        // Add image to PDF, adjust size and position
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);

        // Add a new page if there are more canvases to add
        if (index < pages.length - 1) {
            pdf.addPage();
        }
    });

    // Include metadata for the PDF
    pdf.setProperties({
        title: "Edited Character Sheet",
        subject: "Character Sheet PDF Export",
        author: "Your Name or App Name",
        keywords: "D&D, Character Sheet, Export",
        creator: "D&D SpellBrew"
    });

    // Optional: Add a watermark or additional information to each page
    const watermarkText = "dndspellbrew.com - Confidential";
    pages.forEach((_, pageIndex) => {
        pdf.setPage(pageIndex + 1);
        pdf.setTextColor(150);
        pdf.setFontSize(40);
        pdf.text(watermarkText, width / 2, height / 2, {
            angle: 45,
            align: 'center'
        });
    });

    // Optional: Add header and footer to each page
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Page ${i} of ${totalPages}`, width - 50, height - 10, {
            align: 'right'
        });
        pdf.text('D&D SpellBrew', 10, height - 10, {
            align: 'left'
        });
    }

    // Save the PDF with a dynamic file name based on the current date and time
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    pdf.save(`edited_character_sheet_${timestamp}.pdf`);
}

// Initialize the PDF editor with the first page of the PDF
loadPDF('css/images/D&DBeyondCharacterSheet.pdf');
