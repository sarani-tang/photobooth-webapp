// dom references
const selectedFrame = sessionStorage.getItem('selectedFrame');
const orderedPhotos = JSON.parse(sessionStorage.getItem('orderedPhotos'));
const stickerSelection = document.getElementById('sticker-selection');
const stickerContainer = document.getElementById('sticker-container');
const downloadBtn = document.getElementById('download-button');
const againBtn = document.getElementById('again-button');

// redirect user if no data was received
if (!selectedFrame || !orderedPhotos) {
    window.location.href = 'index.html';
}

let frameImg = '';
if (selectedFrame === 'Blue Frame') {
    frameImg = 'Assets/Frames/frame-blue.png';
} else if (selectedFrame === 'Pink Frame') {
    frameImg = 'Assets/Frames/frame-pink.png';
}

// custom alert box
function customAlert(message, imageSrc = null, callback = null) {
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
        if (callback) callback();
    });

    alertBox.appendChild(alertMsg);
    alertBox.appendChild(okBtn);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
}

// sample stickers - you can replace these with your actual sticker images
const availableStickers = [
    '⭐', '❤️', '🌟', '✨', '💫', 
    '🌈', '🦋', '🌸', '🎀', '💖',
    '🎉', '🎊', '🎈', '🌺', '🌼'
];

let stickerIdCounter = 0;

// frame display
document.getElementById('frame-display').src = frameImg;
document.getElementById('frame-display').alt = selectedFrame;

// display photos in slots
function displayPhotos() {
    orderedPhotos.forEach((photoData, index) => {
        const slot = document.getElementById(`slot-${index}`);
        slot.innerHTML = '';

        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'uploaded-photo';
        img.alt = `Photo ${index + 1}`;
        
        slot.appendChild(img);
        slot.classList.add('filled');
    });
}

// display available stickers
function displayStickers() {
    availableStickers.forEach((sticker) => {
        const stickerBtn = document.createElement('button');
        stickerBtn.className = 'sticker-button';
        stickerBtn.textContent = sticker;
        stickerBtn.addEventListener('click', () => addSticker(sticker));
        stickerSelection.appendChild(stickerBtn);
    });
}

// add sticker to the photobooth
function addSticker(stickerEmoji) {
    const sticker = document.createElement('div');
    sticker.className = 'placed-sticker';
    sticker.textContent = stickerEmoji;
    sticker.id = `sticker-${stickerIdCounter++}`;
    
    // Random initial position within bounds
    sticker.style.left = `${Math.random() * 120 + 30}px`;
    sticker.style.top = `${Math.random() * 300 + 50}px`;
    
    makeDraggable(sticker);
    stickerContainer.appendChild(sticker);
}

// make sticker draggable
function makeDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - element.offsetLeft;
            initialY = e.touches[0].clientY - element.offsetTop;
        } else {
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        }

        isDragging = true;
        element.style.cursor = 'grabbing';

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);
    }

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
    }

    function dragEnd() {
        isDragging = false;
        element.style.cursor = 'grab';

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', dragEnd);
    }

    // double click to remove
    element.addEventListener('dblclick', () => {
        element.remove();
    });
}

// download functionality
downloadBtn.addEventListener('click', async () => {
    const boothContainer = document.getElementById('final-booth');

    try {
        const canvas = await html2canvas(boothContainer, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true
        });

        const link = document.createElement('a');
        link.download = 'photobooth-strip.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        customAlert('Photobooth strip downloaded!', 'Assets/Images/silly-cat.jpg');
    } catch (error) {
        console.error('Download failed:', error);
        customAlert('Download failed. Please try again.', 'Assets/Images/sad-cat.jpg');
    }
});

// do another photobooth - with warning
againBtn.addEventListener('click', () => {
    customAlert(
        'Have you downloaded your photobooth strip? Once you click OK, your current strip will be lost!',
        'Assets/Images/thinking-monkey.png',
        () => {
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    );
});

// initialize
displayPhotos();
displayStickers();