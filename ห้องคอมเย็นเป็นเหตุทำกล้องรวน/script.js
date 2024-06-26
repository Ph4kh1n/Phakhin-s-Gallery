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

const folderName = document.title;
const storageRef = firebase.storage().ref();

const itemsPerPage = 8;
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
let totalPages = 1;

async function listAllFiles() {
    const listRef = storageRef.child(folderName);
    const lowQualityFolderRef = storageRef.child(`low_quality_images/${folderName}`);

    const res = await listRef.listAll();
    const lowQualityRes = await lowQualityFolderRef.listAll();

    const lowQualityFilesMap = new Map();
    await Promise.all(lowQualityRes.items.map(async (itemRef) => {
        const url = await itemRef.getDownloadURL();
        lowQualityFilesMap.set(itemRef.name, url);
    }));

    const files = await Promise.all(res.items.map(async (itemRef) => {
        const url = await itemRef.getDownloadURL();
        const lowQualityUrl = lowQualityFilesMap.get(itemRef.name);

        const metadata = await itemRef.getMetadata();
        return {
            url: url,
            lowQualityUrl: lowQualityUrl, // ใช้ URL ของภาพคุณภาพต่ำ
            name: itemRef.name,
            timeCreated: metadata.timeCreated
        };
    }));

    files.sort((a, b) => a.name.localeCompare(b.name));

    return files;
}

function createPaginationButtons(totalPages) {
    const paginationDiv = document.querySelector('.pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'page-button';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            localStorage.setItem('currentPage', currentPage);
            displayImages();
        });
        paginationDiv.appendChild(button);
    }

    const activeButton = paginationDiv.querySelector('.active');
    if (activeButton) {
        activeButton.style.backgroundColor = '#fff';
        activeButton.style.color = '#212121';
    }
}

async function displayImages() {
    const files = await listAllFiles();
    totalPages = Math.ceil(files.length / itemsPerPage);
    const mainDiv = document.querySelector('.main');
    mainDiv.innerHTML = '';

    const head = document.querySelector('head');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);

                img.onload = () => {
                    img.classList.add('loaded');
                };
            }
        });
    }, observerOptions);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const filesToDisplay = files.slice(start, end);

    filesToDisplay.forEach(file => {
        const figure = document.createElement('figure');
        figure.className = 'snip1277';

        const img = document.createElement('img');
        img.dataset.src = file.url;
        img.src = file.lowQualityUrl; // ใช้ URL ของภาพคุณภาพต่ำสำหรับโหลดเริ่มต้น ถ้าไม่มีภาพคุณภาพต่ำ ให้ใช้ภาพคุณภาพสูง
        img.alt = file.name;
        img.decoding = "async";
        img.loading = "lazy";

        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = file.url;
        link.type = 'image/jpeg';
        head.appendChild(link);

        const figcaption = document.createElement('figcaption');

        const h3 = document.createElement('h3');
        h3.textContent = file.name;

        const icons = document.createElement('div');
        icons.className = 'icons';
        icons.innerHTML = `<a href="${file.url}" id="download"><ion-icon name="expand-outline"></ion-icon></a>`;

        figcaption.appendChild(h3);
        figcaption.appendChild(icons);

        figure.appendChild(img);
        figure.appendChild(figcaption);

        mainDiv.appendChild(figure);

        observer.observe(img);
    });

    createPaginationButtons(totalPages);
}

displayImages();
