document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.querySelector('input[type="file"]');
    const presentationElement = document.querySelector('[role="presentation"]');
    const canvasContainer = document.getElementById('canvasContainer');
    const imageSelector = document.getElementById('imageSelector');
    const imageEditor = document.getElementById('imageEditor');

    imageSelector.addEventListener('click', function(e) {
        if (e.target.closest('button')) {
            const button = e.target.closest('button');
            const imageSrc = button.getAttribute('data-image-src');
            
            // Crear y añadir la imagen al imageEditor
            const selectedImg = document.createElement('img');
            selectedImg.src = imageSrc;
            selectedImg.className = 'absolute z-10 cursor-move';
            selectedImg.style.width = '100px';
            selectedImg.style.height = 'auto';
            
            // Crear el contenedor para la imagen y las líneas de referencia
            const imageContainer = document.createElement('div');
            imageContainer.className = 'absolute z-10';
            imageContainer.style.left = '50%';
            imageContainer.style.top = '50%';
            imageContainer.style.transform = 'translate(-50%, -50%)';
            
            imageContainer.appendChild(selectedImg);
            
            // Limpiar imageEditor antes de añadir el nuevo contenedor
            imageEditor.innerHTML = '';
            imageEditor.appendChild(imageContainer);
    
            // Añadir líneas de referencia
            addReferenceLines(imageContainer);
    
            // Hacer la imagen editable
            makeImageEditable(imageContainer);
    
            // Desactivar el elemento de presentación si está visible
            if (presentationElement.style.display !== 'none') {
                presentationElement.style.display = 'none';
            }
        }
    });
    
    // Función para añadir líneas de referencia
    function addReferenceLines(container) {
        const lines = document.createElement('div');
        lines.className = 'reference-lines';
        lines.innerHTML = `
            <div class="line top"></div>
            <div class="line right"></div>
            <div class="line bottom"></div>
            <div class="line left"></div>
            <div class="handle rotate"></div>
            <div class="handle resize"></div>
        `;
        container.appendChild(lines);
    }
    
    // Función para hacer la imagen editable
    function makeImageEditable(container) {
        let isDragging = false;
        let isRotating = false;
        let isResizing = false;
        let startX, startY, startAngle, startWidth, startHeight;
    
        container.addEventListener('mousedown', startEdit);
        document.addEventListener('mousemove', edit);
        document.addEventListener('mouseup', stopEdit);
    
        function startEdit(e) {
            if (e.target.classList.contains('rotate')) {
                isRotating = true;
                startAngle = Math.atan2(e.clientY - container.offsetTop, e.clientX - container.offsetLeft);
            } else if (e.target.classList.contains('resize')) {
                isResizing = true;
                startWidth = container.offsetWidth;
                startHeight = container.offsetHeight;
                startX = e.clientX;
                startY = e.clientY;
            } else {
                isDragging = true;
                startX = e.clientX - container.offsetLeft;
                startY = e.clientY - container.offsetTop;
            }
        }
    
        function edit(e) {
            if (isDragging) {
                container.style.left = `${e.clientX - startX}px`;
                container.style.top = `${e.clientY - startY}px`;
            } else if (isRotating) {
                const angle = Math.atan2(e.clientY - container.offsetTop, e.clientX - container.offsetLeft);
                const rotation = angle - startAngle;
                container.style.transform = `rotate(${rotation}rad)`;
            } else if (isResizing) {
                const newWidth = startWidth + (e.clientX - startX);
                const newHeight = startHeight + (e.clientY - startY);
                container.style.width = `${newWidth}px`;
                container.style.height = `${newHeight}px`;
            }
        }
    
        function stopEdit() {
            isDragging = false;
            isRotating = false;
            isResizing = false;
        }
    }
    
    // Evento para ocultar las líneas de referencia al hacer clic fuera de la imagen
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.reference-lines') && !e.target.closest('img')) {
            const referenceLines = document.querySelectorAll('.reference-lines');
            referenceLines.forEach(lines => lines.style.display = 'none');
        }
    });


    // Función para manejar la carga de la imagen
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Crear y añadir la imagen al contenedor
                const uploadedImg = document.createElement('img');
                uploadedImg.src = e.target.result;
                uploadedImg.className = 'absolute inset-0 z-0 object-cover w-full h-full pixelated';
                
                // Insertar la imagen antes del imageEditor
                canvasContainer.insertBefore(uploadedImg, imageEditor);
    
                // Desactivar el elemento de presentación
                presentationElement.style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Evento para arrastrar y soltar
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('bg-indigo-200');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('bg-indigo-200');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-indigo-200');
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });

    // Evento para selección de archivo
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // Evento para clic en el área de presentación
    presentationElement.addEventListener('click', () => {
        fileInput.click();
    });
});