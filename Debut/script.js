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

const folderName = window.location.pathname;
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

// Function to insert image elements into the DOM
async function displayImages() {
    const files = await listAllFiles();
    const mainDiv = document.querySelector('.main');

    files.forEach(file => {
        const figure = document.createElement('figure');
        figure.className = 'snip1277';

        const img = document.createElement('img');
        img.src = file.url;
        img.alt = file.name;

        const figcaption = document.createElement('figcaption');

        const h3 = document.createElement('h3');
        h3.textContent = file.name;

        const icons = document.createElement('div');
        icons.className = 'icons';
        icons.innerHTML = '<a href="//www.instagram.com/tub2_pyo/"><i class="ion-social-instagram-outline"></i></a>';

        figcaption.appendChild(h3);
        figcaption.appendChild(icons);

        figure.appendChild(img);
        figure.appendChild(figcaption);

        mainDiv.appendChild(figure);
    });
}

// Call the function to display images
displayImages();