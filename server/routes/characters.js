document.addEventListener('DOMContentLoaded', function() {
    // Load the converted HTML file into the container
    fetch('css/images/converted-page.html') // Adjust the path as needed
        .then(response => response.text())
        .then(data => {
            const htmlContainer = document.getElementById('html-container');
            htmlContainer.innerHTML = data;

            // Initialize Fabric.js on top of the loaded HTML content
            const canvas = new fabric.Canvas('characterCanvas', {
                width: htmlContainer.offsetWidth,
                height: htmlContainer.offsetHeight,
                backgroundColor: null,
                selection: false,
            });

            // Create an overlay canvas over the HTML content
            const overlayCanvas = document.createElement('canvas');
            overlayCanvas.width = htmlContainer.offsetWidth;
            overlayCanvas.height = htmlContainer.offsetHeight;
            overlayCanvas.id = 'characterCanvas';
            htmlContainer.appendChild(overlayCanvas);

            // Add text box functionality
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

            // Save progress
            document.getElementById('saveCharacter').addEventListener('click', function() {
                const canvasData = JSON.stringify(canvas);
                const code = Math.random().toString(36).substring(2, 15);
                localStorage.setItem(`character_${code}`, canvasData);
                alert(`Progress saved! Your code is: ${code}`);
            });

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
        })
        .catch(error => console.error('Error loading HTML:', error));
});
