
const cardTemplate = document.querySelector('#card-template').content;
const cardsContainer = document.querySelector('.cards__container');

const imageContainer = document.querySelector('.images');
const loader = document.querySelector('.loader');

let isInitialLoad = true;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photoArray = []

let initialImageCount = 6;
const apiKey = 'ZMj5sBlND299jvJ34CwWEERdPMdM9OgreeC1eFDPvqs';
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialImageCount}`;

const updateAPIwithNewCount = (imageCount) => {
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

const imageLoaded = () => {
    imagesLoaded++;
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



const createCard = (card) => {
    imagesLoaded = 0;
    totalImages = photoArray.length;
    const cardElement = cardTemplate.querySelector('.card__container').cloneNode(true);
    const url = cardElement.querySelector('.card__image-link');
    const likesNumber = cardElement.querySelector('.card__like-count');
    const image = cardElement.querySelector('.card__image');
    const title = cardElement.querySelector('.card__title');
    const creatorImage = cardElement.querySelector('.card__creator-image');
    const creatorName = cardElement.querySelector('.card__creator-name');
    const creatorLocation = cardElement.querySelector('.card__creator-location');
    const creatorBio = cardElement.querySelector('.card__creator-bio');

    setAttributes(url, { href: card.links.html, target: '_blank' })
    setAttributes(image, { src: card.urls.regular, alt: card.alt_description, title: card.alt_description});
    setAttributes(creatorImage, {src: card.user.profile_image.medium, alt: card.user.name});
    likesNumber.textContent = card.likes;
    title.textContent = card.alt_description;
    creatorLocation.textContent = card.user.location;
    creatorName.textContent = card.user.name;
    creatorBio.textContent = card.user.bio;

    image.addEventListener('load', imageLoaded)
    return cardElement;
}

const populateCards = () => {
 photoArray.forEach(card => {
    cardsContainer.append(createCard(card))
 })
}


const getPhotosFromApi = async () => {
    try {
        const response = await fetch(apiUrl);
        photoArray = await response.json();
        populateCards();

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