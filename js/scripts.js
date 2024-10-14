const canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
let overlayImage;
let baseImageLoaded = false;

const canvasContainer = document.getElementById('canvasContainer');
const glassesCatalog = document.getElementById('glassesCatalog');

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    canvasContainer.classList.remove('dragging');

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImageBase(file);
    }
}

// Eventos para drag and drop
['dragenter', 'dragleave', 'dragover', 'drop'].forEach(eventName => {
    canvasContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (eventName === 'dragenter') {
            canvasContainer.classList.add('dragging');
        } else if (eventName === 'dragleave' && !canvasContainer.contains(e.relatedTarget)) {
            canvasContainer.classList.remove('dragging');
        } else if (eventName === 'drop') {
            handleDrop(e);
        }
    });
});

function loadImageBase(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        fabric.Image.fromURL(e.target.result, function(img) {
            canvas.clear();
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
            baseImageLoaded = true;
            enableGlassesCatalog();
        });
    };
    reader.readAsDataURL(file);
}

// Cargar imagen base desde el botón de subir archivos
document.getElementById('baseImageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImageBase(file);
    }
});

// Función para cargar imagen superpuesta
function loadOverlayImage(selectedImage) {
    if (!baseImageLoaded) {
        alert('Por favor, carga una imagen base primero.');
        return;
    }

    fabric.Image.fromURL(selectedImage, function(img) {
        if (overlayImage) {
            canvas.remove(overlayImage);
        }
        overlayImage = img;
        overlayImage.set({
            left: 100,
            top: 100,
            scaleX: 0.5,
            scaleY: 0.5,
            angle: 0,
            selectable: true
        });
        canvas.add(overlayImage);
        canvas.bringToFront(overlayImage);
    });
}

// Habilitar/deshabilitar catálogo de gafas
function enableGlassesCatalog() {
    glassesCatalog.classList.remove('disabled');
    glassesCatalog.querySelectorAll('.glasses-option').forEach(option => {
        option.style.pointerEvents = 'auto';
        option.style.opacity = '1';
    });
}

function disableGlassesCatalog() {
    glassesCatalog.classList.add('disabled');
    glassesCatalog.querySelectorAll('.glasses-option').forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.5';
    });
}

// Inicialmente deshabilitar el catálogo de gafas
disableGlassesCatalog();

// Selección de imagen superpuesta desde el catálogo
glassesCatalog.addEventListener('click', function(event) {
    if (event.target.classList.contains('glasses-option')) {
        const selectedImage = event.target.getAttribute('data-src');
        if (selectedImage) {
            loadOverlayImage(selectedImage);
        }
    }
});

// Descargar imagen editada
document.getElementById('downloadButton').addEventListener('click', function() {
    if (!baseImageLoaded) {
        alert('Por favor, carga una imagen base primero.');
        return;
    }
    const link = document.createElement('a');
    link.download = 'imagen-editada.png';
    link.href = canvas.toDataURL({
        format: 'png',
        quality: 1.0
    });
    link.click();
});