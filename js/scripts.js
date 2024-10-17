const canvas = new fabric.Canvas('canvas');
const fileInput = document.getElementById('baseImageUpload');
const dropZone = document.getElementById('dropZone');
const presentation = document.getElementById('presentation');
const canvasContainer = document.getElementById('canvasContainer');
const imageSelector = document.getElementById('imageSelector');
const imageButton = document.getElementById('imageButton');
function resizeCanvas() {
    canvas.setWidth(canvasContainer.offsetWidth);
    canvas.setHeight(canvasContainer.offsetHeight);
    canvas.renderAll();
}

function showCanvas() {
    presentation.classList.add('hidden');
}


function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        fabric.Image.fromURL(e.target.result, function(img) {
            canvas.clear();
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
            });
            showCanvas();
        });
    };
    reader.readAsDataURL(file);
}


let currentSelectorImage = null;


function addImageToCanvas(imageSrc) {
    if (currentSelectorImage) {
        canvas.remove(currentSelectorImage);
    }
    fabric.Image.fromURL(imageSrc, function(img) {
        img.scaleToWidth(100); // Ajusta este valor según tus necesidades
        img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center'
        });
        currentSelectorImage = img;
        canvas.add(img);
        canvas.setActiveObject(img);
    });
}
imageSelector.addEventListener('click', function(e) {
    if (e.target.closest('button')) {
        const button = e.target.closest('button');
        const imageSrc = button.getAttribute('data-image-src');
        if (imageSrc) {
            addImageToCanvas(imageSrc);
        }
    }
});

fileInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        loadImage(e.target.files[0]);
    }
});

dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadImage(e.dataTransfer.files[0]);
    }
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();