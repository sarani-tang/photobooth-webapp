
// dom references
const selectedFrame = sessionStorage.getItem('selectedFrame');
const booth = document.getElementById('booth');
const uploadBtn = document.getElementById('upload-photo');
const uploadInput = document.getElementById('upload-photo-input');
const readyBtn = document.getElementById('ready-button');

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

if(!selectedFrame) {
    window.location.href = 'index.html';
}

let frameImg = '';
if (selectedFrame === 'Blue Frame') {
    frameImg = 'Assets/Frames/frame-blue.png';
} else if (selectedFrame === 'Pink Frame') {
    frameImg = 'Assets/Frames/frame-pink.png';
}

console.log('Using frame:', frameImg);

let uploadedPhotos = [];
const maxPhotos = 4;

// frame container structure
function setupBoothDisplay() {
    booth.innerHTML = '';

    const photoSlots = document.createElement('div');
    photoSlots.className = 'photo-slots';
    photoSlots.id = 'photo-slots';

    // creating 4 photo slots
    for (let i = 0; i < maxPhotos; i++) {
        const slot = document.createElement('div');
        slot.className = 'photo-slot';
        slot.id = `photo-slot-${i}`;
        photoSlots.appendChild(slot);
    }

    booth.appendChild(photoSlots);

    const frameElement = document.createElement('img');
    frameElement.src = frameImg;
    frameElement.alt = selectedFrame;
    frameElement.className = 'frame-display';
    booth.appendChild(frameElement);
}

// displays uploaded photo
function displayPhoto(imageData) {
    if(uploadedPhotos.length >= maxPhotos) {
        return;
    }
    
    const slotIndex = uploadedPhotos.length;
    const slot = document.getElementById(`photo-slot-${slotIndex}`);

    if (!slot) {
        console.error('Photo slot not found:', slotIndex);
        return;
    }

    const img = document.createElement('img');
    img.src = imageData;
    img.className = 'uploaded-photo';
    slot.appendChild(img);

    uploadedPhotos.push(imageData);

    if(uploadedPhotos.length === maxPhotos) {
        readyBtn.style.display = 'block';
        readyBtn.disabled = false;
        uploadBtn.disabled = true;
        uploadBtn.style.display = 'none';
        customAlert('Photobooth frame completed!', 'Assets/Images/silly-cat.jpg');
    }
}

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        uploadInput.click();
    });
}

if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            displayPhoto(event.target.result);
        };
        reader.readAsDataURL(file);
    }
    uploadInput.value = '';
});
}

readyBtn.addEventListener('click', () => {
    sessionStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
    window.location.href = 'stickers.html';
});

setupBoothDisplay();