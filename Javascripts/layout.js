// dom references
const selectedFrame = sessionStorage.getItem('selectedFrame');
const uploadedPhotos = JSON.parse(sessionStorage.getItem('uploadedPhotos'));
const selectPhotosContainer = document.getElementById('selectable-photos');
const clearBtn = document.getElementById('clear-button');
const nextBtn = document.getElementById('next-button');

console.log('Selected Frame:', selectedFrame);
console.log('Uploaded Photos:', uploadedPhotos);

// redirect user if no data was received
if (!selectedFrame || !uploadedPhotos) {
    console.log('Redirecting - missing data');
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

// photo tracking
let slotAssignments = [null, null, null, null];
let dragPhoto = null;

// frame display
document.getElementById('frame-display').src = frameImg;
document.getElementById('frame-display').alt = selectedFrame;

// photobooth w/ selected photos display (drag n drop)
function displayPhotos() {
    selectPhotosContainer.innerHTML = '';

    uploadedPhotos.forEach((photoData, index) => {
        const photoWrapper = document.createElement('div');
        photoWrapper.className = 'photo-wrapper';
        photoWrapper.draggable = true;
        photoWrapper.dataset.photoIndex = index;

        const img = document.createElement('img');
        img.src = photoData;
        img.className = 'selectable-photo';
        img.alt = `Photo ${index + 1}`;

        // checks if photo was placed 
        if(slotAssignments.includes(index)) {
            photoWrapper.classList.add('placed');
        }

        // manages drag feature
        photoWrapper.addEventListener('dragstart', (e) => {
            if (slotAssignments.includes(index)) {
                e.preventDefault();
                return;
            }
            dragPhoto = index;
            photoWrapper.classList.add('dragging');
        });

        // drag and event
        photoWrapper.addEventListener('dragend', (e) => {
            photoWrapper.classList.remove('dragging');
        });

        photoWrapper.appendChild(img);
        selectPhotosContainer.appendChild(photoWrapper);
    });
}

// manages drop zones for slots
function setupDropZones() {
    document.querySelectorAll('.photo-slot').forEach(slot => {
        // drag over event
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        // drag leave event
        slot.addEventListener('dragleave', (e) => {
            slot.classList.remove('drag-over');
        });

        // drop event
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');

            if (dragPhoto !== null) {
                const slotIndex = parseInt(slot.dataset.slot);
                placePhotoInSlot(slotIndex, dragPhoto);
                dragPhoto = null;
            }
        });

        // click to remove photo from slot
        slot.addEventListener('click', () => {
            const slotIndex = parseInt(slot.dataset.slot);
            if (slotAssignments[slotIndex] !== null) {
                clearSlot(slotIndex);
                displayPhotos();
                checkIfComplete();
            }
        });
    });
}

// placing photo in a specific slot
function placePhotoInSlot(slotIndex, photoIndex) {
    const existingSlot = slotAssignments.indexOf(photoIndex);
    if(existingSlot !== -1) {
        clearSlot(existingSlot);
    }

    // clear current slot if it has a photo in it
    if(slotAssignments[slotIndex] !== null) {
        clearSlot(slotIndex);
    }

    // place photo in slot
    slotAssignments[slotIndex] = photoIndex;
    const slot = document.getElementById(`slot-${slotIndex}`);
    slot.innerHTML = '';

    const img = document.createElement('img');
    img.src = uploadedPhotos[photoIndex];
    img.className = 'uploaded-photo';
    img.alt = `Photo ${photoIndex + 1}`;

    slot.appendChild(img);
    slot.classList.add('filled');

    displayPhotos();
    checkIfComplete();
}

// clear a specific slot
function clearSlot(slotIndex) {
    slotAssignments[slotIndex] = null;
    const slot = document.getElementById(`slot-${slotIndex}`);
    slot.innerHTML = '';
    slot.classList.remove('filled');
}

// check if all slots are filled
function checkIfComplete() {
    const allFilled = slotAssignments.every(slot => slot !== null);
    nextBtn.disabled = !allFilled;
}

// clear all slots button
clearBtn.addEventListener('click', () => {
    slotAssignments = [null, null, null, null];
    document.querySelectorAll('.photo-slot').forEach((slot, index) => {
        clearSlot(index);
    });
    displayPhotos();
    checkIfComplete();
});

// next button
nextBtn.addEventListener('click', () => {
    if (slotAssignments.includes(null)) {
        customAlert('You forgot some photos!', 'Assets/Images/screaming-cat.jpg');
        return;
    }

    // saves order of photos to session storage
    const orderedPhotos = slotAssignments.map(index => uploadedPhotos[index]);
    sessionStorage.setItem('orderedPhotos', JSON.stringify(orderedPhotos));
    window.location.href = 'stickers.html';
});

// initialize
displayPhotos();
setupDropZones();
checkIfComplete();