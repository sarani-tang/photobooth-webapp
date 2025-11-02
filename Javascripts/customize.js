
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

// photo tracking for placing in slots
let slotAssignments = [null, null, null, null];
let selectedIndex = null;

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

    document.querySelectorAll('.photo-wrapper').forEach(wrapper => {
        wrapper.classList.remove = 'active';
    });

    const selectedWrapper = document.querySelector(`[data-photo-index="${photoIndex}"]`);
    if (selectedWrapper && !selectedWrapper.classList.contains('placed')) {
        selectedWrapper.classList.add = 'active';
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
downloadBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 180;
    canvas.height = 440;
    
    const frame = new Image();
    frame.src = frameImg;
    
    frame.onload = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let yPos = 10;
        let photosLoaded = 0;
        
        slotAssignments.forEach((photoIndex, slotIndex) => {
            const img = new Image();
            img.src = uploadedPhotos[photoIndex];
            
            img.onload = () => {
                ctx.drawImage(img, 5, yPos, 170, 100);
                yPos += 106;
                photosLoaded++;
                
                if (photosLoaded === slotAssignments.length) {
                    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
                    
                    const link = document.createElement('a');
                    link.download = 'photobooth-strip.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            };
        });
    };
});

// do another photobooth
againBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'index.html';
});

// initialize
displaySelectedPhotos();
checkIfComplete();