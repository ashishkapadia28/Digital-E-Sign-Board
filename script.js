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
}

function stopDrawing() {
    isDrawing = false;
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { offsetX, offsetY } = getEventCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = '#004d40';
    ctx.lineWidth = 2;
    ctx.stroke();
    [lastX, lastY] = [offsetX, offsetY];
}

function getEventCoordinates(e) {
    if (e.touches) {
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    }
    return { offsetX: e.offsetX, offsetY: e.offsetY };
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    typedSignature.value = '';
}

function saveSignature() {
    const dataURL = canvas.toDataURL('image/png');
    if (dataURL === 'data:,') {
        alert('No signature found. Please draw or type your signature.');
        return;
    }
    const img = document.createElement('img');
    img.src = dataURL;
    img.alt = 'Saved Signature';
    img.classList.add('saved-signature-item-img');

    const div = document.createElement('div');
    div.classList.add('saved-signature-item');
    div.appendChild(img);
    savedSignaturesContainer.appendChild(div);

    savedSignatures.push(dataURL);
}

function downloadSignature() {
    const dataURL = canvas.toDataURL('image/png');
    if (dataURL === 'data:,') {
        alert('No signature found. Please draw or type your signature.');
        return;
    }
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function switchTab(tab) {
    if (tab === 'draw') {
        drawTab.classList.add('active');
        typeTab.classList.remove('active');
        canvas.style.display = 'block';
        penIcon.style.display = 'block';
        typedSignature.style.display = 'none';
    } else {
        drawTab.classList.remove('active');
        typeTab.classList.add('active');
        canvas.style.display = 'none';
        penIcon.style.display = 'none';
        typedSignature.style.display = 'block';
    }
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
