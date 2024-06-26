const firebaseConfig = {
    apiKey: "AIzaSyCOcp6v39x5FFl8MLDkhHZAaAgmv_QsCkM",
    authDomain: "upload-images-e8dac.firebaseapp.com",
    projectId: "upload-images-e8dac",
    storageBucket: "upload-images-e8dac.appspot.com",
    messagingSenderId: "620222914132",
    appId: "1:620222914132:web:bf026dc1becd44c19ad7c1",
    measurementId: "G-FBDYTGSC3X"
};
  
firebase.initializeApp(firebaseConfig);

window.addEventListener('DOMContentLoaded', () => {
    const folderNames = Array.from(document.querySelectorAll('.f-name')).map(elem => elem.textContent);
    const selectElement = document.getElementById('path');
  
    folderNames.forEach(folderName => {
      const option = document.createElement('option');
      option.value = folderName;
      option.textContent = folderName;
      selectElement.add(option);
    });
  });

const selectElement = document.getElementById('path');

selectElement.addEventListener('change', (event) => {
  const selectedFolder = event.target.value;
  const folderDiv = Array.from(document.querySelectorAll('.folder')).find(div => div.querySelector('.f-name').textContent === selectedFolder);

  if (folderDiv) {
    // อัปเดตข้อมูลใน folderDiv ตามที่ต้องการ
    // เช่น folderDiv.querySelector('.upload-date').textContent = 'new date';
  }
});

document.querySelector('.file-input').addEventListener('change', function() {
    let allowed_mime_types = []; // ถ้ามีการจำกัดประเภทไฟล์ให้ระบุไว้ที่นี่
    let allowed_size_mb = 100; // ขนาดไฟล์สูงสุดที่อนุญาต (MB)

    var files_input = document.querySelector('.file-input').files;
    if (files_input.length == 0) {
        alert('Error : No file selected');
        return;
    }

    for (let i = 0; i < files_input.length; i++) {
        let file = files_input[i];

        // validate file size
        if (file.size > allowed_size_mb * 1024 * 1024) {
            alert('Error : Exceed size => ' + file.name);
            return;
        }

        uploadFile(file);
    }
});

function uploadFile(file) {
    let uniq = 'id-' + btoa(file.name).replace(/=/g, '').substring(0, 7);
    let filetype = file.type.split('/')[0];
    let fileIcon = getFileIcon(filetype);

    let li = `
    <li class="file-list ${filetype}" id="${uniq}" data-filename="${file.name}">
        <div class="thumbnail">
            <ion-icon name="${fileIcon}"></ion-icon>
            <span class="completed" style="display:none;">
                <ion-icon name="checkmark"></ion-icon>
            </span>
        </div>
        <div class="properties">
            <span class="title"><strong>${file.name}</strong></span>
            <span class="size">${bytesToSize(file.size)}</span>
            <span class="progress">
                <span class="buffer"></span>
                <span class="percentage"></span>
            </span>
        </div>
        <button class="remove" style="display:none;">
            <ion-icon name="close"></ion-icon>
        </button>
    </li>`;

    document.querySelector('.list-upload ul').innerHTML = li + document.querySelector('.list-upload ul').innerHTML;
    let li_el = document.querySelector('#' + uniq);

    // อัพโหลดไฟล์ไปยัง Firebase Storage
    const storageRef = firebase.storage().ref();
    const folderPath = document.querySelector('#path').value;
    const fileRef = storageRef.child(folderPath + '/' + file.name);
    const uploadTask = fileRef.put(file);

    uploadTask.on('state_changed', (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        li_el.querySelector('.buffer').style.width = progress + '%';
        li_el.querySelector('.percentage').innerHTML = progress + '%';
        li_el.querySelector('.percentage').style.left = progress + '%';
    }, (error) => {
        console.error('Upload failed:', error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            li_el.querySelector('.completed').style.display = 'inline-block';
            li_el.querySelector('.remove').style.display = 'inline-block';
            li_el.querySelector('.remove').addEventListener('click', function() {
                fileRef.delete().then(() => {
                    console.log('File deleted successfully');
                    li_el.remove();
                }).catch((error) => {
                    console.error('Error deleting file:', error);
                });
            });
        });
    });
}

function bytesToSize(bytes) {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    const unit = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, unit)).toFixed(2) + ' ' + units[unit];
}

function getFileIcon(filetype) {
    let icon;
    switch (filetype) {
        case 'image':
            icon = 'image-outline';
            break;
        case 'video':
            icon = 'videocam-outline';
            break;
        case 'audio':
            icon = 'musical-note-outline';
            break;
        case 'text':
            icon = 'document-text-outline';
            break;
        case 'application':
            icon = 'document-outline';
            break;
        default:
            icon = 'file-outline';
            break;
    }
    return icon;
}

const xhr = new XMLHttpRequest();

xhr.open('GET', '../index.html', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xhr.responseText, 'text/html');

    // สร้าง option จาก class="f-name"
    const folderNames = Array.from(doc.querySelectorAll('.f-name')).map(elem => elem.textContent);
    const selectElement = document.getElementById('path');

    folderNames.forEach(folderName => {
      const option = document.createElement('option');
      option.value = folderName;
      option.textContent = folderName;
      selectElement.add(option);
    });
  }
};
xhr.send();