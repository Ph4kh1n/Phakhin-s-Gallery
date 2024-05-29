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

let timeoutID;

// ฟังก์ชั่นสำหรับลบ localStorage
function clearLocalStorage() {
    localStorage.clear();
}

// ฟังก์ชั่นสำหรับเริ่มการนับเวลา
function startTimeout() {
    timeoutID = setTimeout(clearLocalStorage, 3 * 60 * 1000); // 3 นาที
}

// ฟังก์ชั่นสำหรับรีเซ็ตเวลาเมื่อผู้ใช้กลับมาที่หน้าเว็บ
function resetTimeout() {
    clearTimeout(timeoutID);
    startTimeout();
}

// เรียกใช้ฟังก์ชั่น startTimeout เมื่อโหลดหน้าเว็บ
window.addEventListener('load', startTimeout);

// รีเซ็ตเวลาเมื่อผู้ใช้กลับมาที่หน้าเว็บ
window.addEventListener('mousemove', resetTimeout);
window.addEventListener('scroll', resetTimeout);
window.addEventListener('keydown', resetTimeout);
window.addEventListener('click', resetTimeout);

// ล้าง localStorage เมื่อผู้ใช้ออกจากหน้าเว็บ
window.addEventListener('beforeunload', () => {
    clearTimeout(timeoutID);
});

const folderName = document.title;
const storageRef = firebase.storage().ref();

const itemsPerPage = 8;
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
let totalPages = 1;

async function listAllFiles() {
    const listRef = storageRef.child(folderName); // Use the folder name dynamically
    const res = await listRef.listAll();

    const files = await Promise.all(res.items.map(async (itemRef) => {
        const url = await itemRef.getDownloadURL();
        const metadata = await itemRef.getMetadata();
        return {
            url: url,
            name: itemRef.name,
            timeCreated: metadata.timeCreated
        };
    }));

    // Sort files by name
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

    // เพิ่ม CSS class ที่กำหนดสีพื้นหลังและสีตัวหนังสือเมื่อปุ่มถูกเลือก
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
        img.dataset.src = file.url; // Use data-src for lazy loading
        img.alt = file.name;
        img.decoding = "async";
        img.fetchPriority = "high"
        img.loading = "lazy"; // Fallback for browsers supporting native lazy loading

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

        observer.observe(img); // Start observing the img
    });

    createPaginationButtons(totalPages);
}

// Call the function to display images
displayImages();