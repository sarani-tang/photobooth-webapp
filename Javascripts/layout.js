// dom references
const selectedFrame = sessionStorage.getItem('selectedFrame');
const uploadedPhotos = JSON.parse(sessionStorage.getItem('uploadedPhotos'));
const selectPhotosContainer = document.getElementById('selectable-photos');
const downloadBtn = document.getElementById('download-button');
const againBtn = document.getElementById('again-button');
const clearBtn = document.getElementById('clear-button');

// redirect user if no data was received
if (!selectedFrame || !uploadedPhotos) {
    window.location.href = 'index.html';
}

let frameImg = '';
if (selectedFrame === 'Blue Frame') {
    frameImg = 'Assets/Frames/frame-blue.png';
} else if (selectedFrame === 'Pink Frame') {
    frameImg = 'Assets/Frames/frame-pink.png';
}

// custom alert box
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

// photo tracking for placing in slots
let slotAssignments = [null, null, null, null];
let selectedPhotoIndex = null;

// frame display
document.getElementById('frame-display').src = frameImg;
document.getElementById('frame-display').alt = selectedFrame;

// photobooth w/ selected photos display
function displaySelectedPhotos() {
    selectPhotosContainer.innerHTML = '';

    uploadedPhotos.forEach((photoData, index) => {
        const photoWrapper = document.createElement('div');
        photoWrapper.className = 'photo-wrapper';
        photoWrapper.dataset.photoIndex = index;

        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'selectable-photo';
        img.alt = `Photo ${index + 1}`;

        if(slotAssignments.includes(index)) {
            photoWrapper.classList.add('placed');
        }

        photoWrapper.addEventListener('click', () => {
            console.log("selected");
            selectPhoto(index);
        });

        photoWrapper.appendChild(img);
        selectPhotosContainer.appendChild(photoWrapper);
    });
}

// selecting photo function
function selectPhoto(photoIndex) {

    if(slotAssignments.includes(photoIndex)) {
        return;
    }

    selectedPhotoIndex = photoIndex;
    console.log(selectedPhotoIndex);

    document.querySelectorAll('.photo-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
    });

    const selectedWrapper = document.querySelector(`[data-photo-index="${photoIndex}"]`);
    if (selectedWrapper && !selectedWrapper.classList.contains('placed')) {
        selectedWrapper.classList.add('active');
    }
}

// placing photo in slots
function placePhotoSlot(slotIndex) {
    if(selectedPhotoIndex === null) {
        return;
    }

    // checks if the photo is already in another slot
    const existingSlot = slotAssignments.indexOf(selectedPhotoIndex);
    if(existingSlot !== -1) {
        clearSlot(existingSlot);
    }

    // clear current slot if it has a photo in it
    if(slotAssignments[slotIndex] !== null) {
        clearSlot(slotIndex);
    }

    // place phot in slot
    slotAssignments[slotIndex] = selectedPhotoIndex;
    const slot = document.getElementById(`slot-${slotIndex}`);
    slot.innerHTML = '';

    const img = document.createElement('img');
    img.src = uploadedPhotos[selectedPhotoIndex];
    img.className = 'uploaded-photo';
    img.alt = `Photo ${selectedPhotoIndex + 1}`;
    
    slot.appendChild(img);
    slot.classList.add('filled');
    slot.classList.remove('clickable');
    
    // deselect photo
    selectedPhotoIndex = null;
    displaySelectedPhotos();
    checkIfComplete();
}

// clear a specific slot
function clearSlot(slotIndex) {
    slotAssignments[slotIndex] = null;
    const slot = document.getElementById(`slot-${slotIndex}`);
    slot.innerHTML = '';
    slot.classList.remove('filled');
    slot.classList.add('clickable');
}

// check if all slots are filled
function checkIfComplete() {
    const allFilled = slotAssignments.every(slot => slot !== null);
    downloadBtn.disabled = !allFilled;
}

// setup slot click handlers
document.querySelectorAll('.photo-slot').forEach(slot => {
    slot.addEventListener('click', () => {
        const slotIndex = parseInt(slot.dataset.slot);
        
        if (selectedPhotoIndex !== null) {
            placePhotoSlot(slotIndex);
        } else if (slotAssignments[slotIndex] !== null) {
            // if clicking a filled slot with no photo selected, clear it
            clearSlot(slotIndex);
            displaySelectedPhotos();
            checkIfComplete();
        }
    });
});

// clear all slots
clearBtn.addEventListener('click', () => {
    slotAssignments = [null, null, null, null];
    document.querySelectorAll('.photo-slot').forEach((slot, index) => {
        clearSlot(index);
    });
    selectedPhotoIndex = null;
    displaySelectedPhotos();
    checkIfComplete();
});

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
    } catch (error) {
        console.error('Download failed:', error);
        customeAlert('Download failed. Please try again.', 'Assets/Images/sad-cat.jpg')
    }
});

// do another photobooth
againBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
});

// initialize
displaySelectedPhotos();
checkIfComplete();