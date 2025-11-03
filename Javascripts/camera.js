
// dom elements
const selectedFrame = sessionStorage.getItem('selectedFrame');
const video = document.getElementById('live-video');
const captureBtn = document.getElementById('take-photo');
const readyBtn = document.getElementById('ready-button');
const countdownEl = document.querySelector('.countdown-timer');


if(!selectedFrame) {
    window.location.href = 'index.html';
}

let frameImg = '';
if (selectedFrame === 'Blue Frame') {
    frameImg = 'Assets/Frames/frame-blue.png';
} else if (selectedFrame === 'Pink Frame') {
    frameImg = 'Assets/Frames/frame-pink.png';
}

let capturedPhotos = [];
const maxPhotos = 4;

function customAlert(message, imageSrc = null) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert-box';

    if (imageSrc) {
        const alertImage = document.createElement('img');
        alertImage.src = imageSrc;
        alertImage.className = 'custom-alert-image';
        alertBox.appendChild(alertImage);
    }

    const alertMsg = document.createElement('p');
    alertMsg.textContent = message;
    alertMsg.className = 'custom-alert-message'

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.className = 'custom-alert-button';

    okBtn.addEventListener('click', () => {
        overlay.remove();
    });

    alertBox.appendChild(alertMsg);
    alertBox.appendChild(okBtn);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: 'user'}
        });
        video.srcObject = stream;
    } catch (error) {
        console.error('error accessing camera:', error);
        customAlert('Could not access camera. Please check permissions.');
    }
}

// countdown timer
const startCountdown = (callback) => {
    let count = 1; // adjust for testing
    countdownEl.textContent = count;
    countdownEl.style.display = 'flex';
    const intervalId = setInterval(() => {
        count--;
        if(count > 0) countdownEl.textContent = count;
        else {
            clearInterval(intervalId);
            countdownEl.textContent = '3';
            callback();
        }
    }, 1000);
};

function capturePhoto() {
    const canvas = document.getElementById('final-canvas');
    const context = canvas.getContext('2d');

    //context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();

    const imgData = canvas.toDataURL('image/png');
    capturedPhotos.push(imgData);

    displayCapturedPhoto(imgData);

    console.log(`Photo ${capturedPhotos.length} captured`);

    if (capturedPhotos.length === maxPhotos) {
        readyBtn.style.display = 'block';
        readyBtn.disabled = false;
        captureBtn.disabled = true;
        captureBtn.style.display = 'none';
        customAlert("All Photos captured!", 'Assets/Images/silly-cat.jpg');
    }
}

function displayCapturedPhoto(imgData) {
    const container = document.getElementById('photo-preview-container');
    
    const img = document.createElement('img');
    img.src = imgData;
    img.className = 'preview-photo';
    img.alt = `Captured photo ${capturedPhotos.length}`;
    
    container.appendChild(img);
}

// handler for capture button
captureBtn.addEventListener('click', () => {
    captureBtn.disabled = true;
    startCountdown(() => {
        capturePhoto();
        captureBtn.disabled = false;
    });
});

//handler for ready button
readyBtn.addEventListener('click', () => {
    sessionStorage.setItem('uploadedPhotos', JSON.stringify(capturedPhotos));
    window.location.href ='layout.html';
});

startCamera();