const imageContainer = document.querySelector('.images');
const loader = document.querySelector('.loader');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photoArray = []

let initialImageCount = 5;
const apiKey = 'ZMj5sBlND299jvJ34CwWEERdPMdM9OgreeC1eFDPvqs';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageCount}`;

const updateAPIwithNewCount = (imageCount) => {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

const imageLoaded = () => {
    imagesLoaded++;
    console.log(imagesLoaded);
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.classList.remove('loader_opened')
    }
}

const setAttributes = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

const displayPhotos = () => {
    imagesLoaded = 0;
    totalImages = photoArray.length;
    photoArray.forEach( photo => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        })
        const image = document.createElement('img');
        setAttributes(image, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })

        image.addEventListener('load', imageLoaded)
        item.appendChild(image);
        imageContainer.appendChild(item);
    });
}


const getPhotosFromApi = async () => {
    try {
        const response = await fetch(apiUrl);
        photoArray = await response.json();
        displayPhotos();
        if (isInitialLoad){
            updateAPIwithNewCount(30)
            isInitialLoad = false;
        }
    } catch (error) {
        console.log(error);
    }
}


window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotosFromApi();
    }
})

getPhotosFromApi()