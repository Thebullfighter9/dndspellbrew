// Initialize Fabric.js
const canvas = new fabric.Canvas('characterCanvas', {
    width: 800, // Adjust this based on your HTML page size
    height: 1000, // Adjust this based on your HTML page size
});

// Load the converted PDF page as an image (assuming it's in the images folder)
fabric.Image.fromURL('css/images/D&DBeyondCharacterSheet.html', function(img) {
    img.set({ selectable: false }); // Set the background to be non-selectable
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
});

// Add text box on click
document.getElementById('addText').addEventListener('click', function() {
    const textbox = new fabric.Textbox('Enter text', {
        left: 50,
        top: 50,
        width: 200,
        fontSize: 16,
        fill: '#000000',
        editable: true,
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
});

// Save canvas progress
document.getElementById('saveCharacter').addEventListener('click', function() {
    const canvasData = JSON.stringify(canvas);
    const code = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(`character_${code}`, canvasData);
    alert(`Progress saved! Your code is: ${code}`);
});

// Load saved progress
function loadCharacter(code) {
    const canvasData = localStorage.getItem(`character_${code}`);
    if (canvasData) {
        canvas.loadFromJSON(canvasData, canvas.renderAll.bind(canvas));
    } else {
        alert('No saved progress found for this code.');
    }
}

// Export to PDF
document.getElementById('exportToPDF').addEventListener('click', function() {
    const canvasDataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: 2, // Increase resolution
    });

    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.addImage(canvasDataUrl, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
    pdf.save('character-sheet.pdf');
});
