const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
const penIcon = document.getElementById('pen-icon');
const typedSignature = document.getElementById('typed-signature');
const drawTab = document.getElementById('draw-tab');
const typeTab = document.getElementById('type-tab');
const homePage = document.getElementById('home-page');
const saveSignPage = document.getElementById('save-sign-page');
const navHome = document.getElementById('nav-home');
const navSave = document.getElementById('nav-save');
const backHome = document.getElementById('back-home');
const savedSignaturesContainer = document.getElementById('saved-signatures-container');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let savedSignatures = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('mouseout', stopDrawing);

document.getElementById('clear').addEventListener('click', clearCanvas);
document.getElementById('save').addEventListener('click', saveSignature);
document.getElementById('download').addEventListener('click', downloadSignature);
drawTab.addEventListener('click', () => switchTab('draw'));
typeTab.addEventListener('click', () => switchTab('type'));

navHome.addEventListener('click', () => showPage('home'));
navSave.addEventListener('click', () => showPage('save'));
backHome.addEventListener('click', () => showPage('home'));

function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoordinates(e);
    [lastX, lastY] = [offsetX, offsetY];
    penIcon.style.display = 'block';
}

function stopDrawing(e) {
    e.preventDefault();
    isDrawing = false;
    penIcon.style.display = 'none';
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];
    movePenIcon(e);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    typedSignature.value = '';
}

function saveSignature() {
    if (isCanvasEmpty() && typedSignature.value.trim() === '') {
        alert('No signature to save');
        return;
    }
    const dataURL = isCanvasEmpty() ? textToImage(typedSignature.value) : canvas.toDataURL('image/png');
    savedSignatures.push(dataURL);
    displaySavedSignatures();
}

function downloadSignature() {
    if (isCanvasEmpty() && typedSignature.value.trim() === '') {
        alert('No signature to download');
        return;
    }
    const dataURL = isCanvasEmpty() ? textToImage(typedSignature.value) : canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function movePenIcon(e) {
    const { offsetX, offsetY } = getEventCoordinates(e);
    penIcon.style.left = `${offsetX - 12}px`;
    penIcon.style.top = `${offsetY - 12}px`;
}

function getEventCoordinates(e) {
    if (e.touches) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: touch.clientX - rect.left,
            offsetY: touch.clientY - rect.top,
        };
    } else {
        return {
            offsetX: e.offsetX,
            offsetY: e.offsetY,
        };
    }
}

function isCanvasEmpty() {
    const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
}

function switchTab(tab) {
    if (tab === 'draw') {
        drawTab.classList.add('active');
        typeTab.classList.remove('active');
        canvas.style.display = 'block';
        typedSignature.style.display = 'none';
    } else {
        drawTab.classList.remove('active');
        typeTab.classList.add('active');
        canvas.style.display = 'none';
        typedSignature.style.display = 'block';
    }
}

function textToImage(text) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.fillStyle = '#00796b';
    tempCtx.font = '40px Arial';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    return tempCanvas.toDataURL('image/png');
}

function showPage(page) {
    if (page === 'home') {
        homePage.style.display = 'flex';
        saveSignPage.style.display = 'none';
    } else if (page === 'save') {
        homePage.style.display = 'none';
        saveSignPage.style.display = 'flex';
    }
}

function displaySavedSignatures() {
    savedSignaturesContainer.innerHTML = '';
    savedSignatures.forEach((signature, index) => {
        const img = document.createElement('img');
        img.src = signature;
        img.alt = `Saved Signature ${index + 1}`;
        img.className = 'saved-signature';
        savedSignaturesContainer.appendChild(img);
    });
}
