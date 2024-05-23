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

// Function to get the download URLs and metadata for all files in a storage directory
async function listAllFiles() {
    const listRef = storageRef.child(folderName); // adjust this path to your storage path
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

    // Sort files by time created
    files.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated));

    return files;
}

async function displayImages() {
    const files = await listAllFiles();
    const mainDiv = document.querySelector('.main');
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

    files.forEach(file => {
        const figure = document.createElement('figure');
        figure.className = 'snip1277';
        
        const img = document.createElement('img');
        img.dataset.src = file.url; // Use data-src for lazy loading
        img.alt = file.name;
        img.loading = "lazy"; // Fallback for browsers supporting native lazy loading

        const figcaption = document.createElement('figcaption');

        const h3 = document.createElement('h3');
        h3.textContent = file.name;

        const icons = document.createElement('div');
        icons.className = 'icons';
        icons.innerHTML = `<a href="${file.url}"><ion-icon name="expand-outline"></ion-icon></a>`;

        figcaption.appendChild(h3);
        figcaption.appendChild(icons);

        figure.appendChild(img);
        figure.appendChild(figcaption);

        mainDiv.appendChild(figure);

        observer.observe(img); // Start observing the img
    });
}

// Call the displayImages function
displayImages();
