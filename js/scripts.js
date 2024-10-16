// Elementos del DOM
const dropZone = document.getElementById("dropZone");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const imageSelector = document.getElementById('imageSelector');
const baseImageUpload = document.getElementById('baseImageUpload');

// Variables para almacenar imágenes
let baseImage = null;
let overlayImage = null;

// Funciones principales
function drawImage(imageSrc, isBaseImage = false) {
    const img = new Image();
    img.onload = () => {
        if (isBaseImage) {
            canvas.width = img.width;
            canvas.height = img.height;
            baseImage = img;
            overlayImage = null;
        } else {
            overlayImage = img;
        }
        redrawCanvas();
    };
    img.src = imageSrc;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (baseImage) {
        ctx.drawImage(baseImage, 0, 0);
    }

    if (overlayImage) {
        ctx.drawImage(overlayImage, 50, 50, overlayImage.width / 2, overlayImage.height / 2);
    }

    canvas.classList.remove('d-none');
}

function downloadCanvasImage() {
    if (canvas.width > 0 && canvas.height > 0) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'imagen_generada.png';
        link.click();
    } else {
        alert("No hay una imagen para descargar.");
    }
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.classList.add('d-none');
    canvas.width = canvas.height = 0;
    baseImage = null;
    overlayImage = null;
}

function handleFileUpload(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => drawImage(event.target.result, true);
        reader.readAsDataURL(file);
    }
}

// Event Listeners
baseImageUpload.addEventListener('change', (event) => handleFileUpload(event.target.files[0]));

imageSelector.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button?.dataset.imageSrc) {
        drawImage(button.dataset.imageSrc, false);
    }
});

downloadBtn.addEventListener('click', downloadCanvasImage);
resetBtn.addEventListener('click', resetCanvas);

// Manejo de eventos de arrastre
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.toggle('dragging', ['dragenter', 'dragover'].includes(eventName));
    });
});

dropZone.addEventListener("drop", (e) => {
    handleFileUpload(e.dataTransfer.files[0]);
});