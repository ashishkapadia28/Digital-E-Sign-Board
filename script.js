const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
const penIcon = document.getElementById('pen-icon');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

document.getElementById('clear').addEventListener('click', clearCanvas);
document.getElementById('save').addEventListener('click', saveSignature);
document.getElementById('download').addEventListener('click', downloadSignature);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
    penIcon.style.display = 'block';
    movePenIcon(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
    penIcon.style.display = 'none';
}

function draw(e) {
    if (!isDrawing) return;
    ctx.strokeStyle = '#00796b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];

    movePenIcon(e);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const dataURL = canvas.toDataURL('image/png');
    const savedSignaturesContainer = document.getElementById('saved-signatures');
    
    const img = document.createElement('img');
    img.src = dataURL;
    img.alt = 'Saved Signature';
    img.className = 'saved-signature-img';
    
    savedSignaturesContainer.appendChild(img);
    img.scrollIntoView({ behavior: 'smooth' });
}

function downloadSignature() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'signature.png';
    link.click();
}

function movePenIcon(e) {
    penIcon.style.left = `${e.offsetX - 12}px`;
    penIcon.style.top = `${e.offsetY - 12}px`;
}
