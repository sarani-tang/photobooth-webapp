
// dom references
const selectBtn = document.getElementById('select-button');
const frames = document.querySelectorAll('.clickable-frame');
const cameraBtn = document.getElementById('menu-camera-button');
const uploadBtn = document.getElementById('menu-upload-button');

let selectedFrame = null;

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

// click handlers for the frames (index.html)
if (frames.length > 0) {
    frames.forEach(frame => {
        frame.addEventListener('click', () => {
            // removes selected class from all frames
            frames.forEach(f => f.classList.remove('selected'));
            // adds selected class to clicked frame
            frame.classList.add('selected');
            //stores which frame was selected
            selectedFrame = frame.getAttribute('alt');
        });
    });
}

// handler for select button (index.html)
if (selectBtn) {
    selectBtn.addEventListener('click', () => {
        if (selectedFrame) {
            // stores selected frame for next pages
            sessionStorage.setItem('selectedFrame', selectedFrame);
            window.location.href = 'menu.html';
        } else {
            customAlert('Please select a frame first!', 'Assets/Images/screaming-cat.jpg');
        }
    });
}

// handler for menu buttons (menu.html)
if (cameraBtn) {
    cameraBtn.addEventListener('click', () => {
        window.location.href = 'camera.html';
    });
}

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        window.location.href = 'upload.html';
    });
}