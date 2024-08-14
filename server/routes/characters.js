document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('pdf-container');
    
    document.getElementById('create-character').addEventListener('click', function () {
        document.querySelector('.pdf-viewer').style.display = 'block';
        document.querySelector('.text-tools').style.display = 'block';
        document.getElementById('save-character').style.display = 'inline';
        document.getElementById('submit-character').style.display = 'inline';
    });

    container.addEventListener('click', function(event) {
        const x = event.clientX;
        const y = event.clientY;

        const input = document.createElement('textarea');
        input.className = 'text-input';
        input.style.left = `${x}px`;
        input.style.top = `${y}px`;

        const fontSize = document.getElementById('font-size').value;
        const fontColor = document.getElementById('font-color').value;

        input.style.fontSize = `${fontSize}px`;
        input.style.color = fontColor;

        input.addEventListener('blur', function() {
            if (input.value.trim() === '') {
                input.remove();
            }
        });

        container.appendChild(input);
        input.focus();
    });

    document.getElementById('save-character').addEventListener('click', function() {
        const pdfState = container.innerHTML;
        const code = Math.random().toString(36).substring(2, 15);
        localStorage.setItem(`character_${code}`, pdfState);
        alert(`Progress saved! Your code is: ${code}`);
    });

    document.getElementById('submit-character').addEventListener('click', function() {
        const pdfState = container.innerHTML;

        // Make a POST request to submit the HTML version of the PDF
        fetch('/submit-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pdfState: pdfState }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Character submitted successfully!');
            } else {
                alert('Failed to submit character. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the character.');
        });
    });
});
