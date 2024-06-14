let autocomplete;

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {
        fields: ['place_id', 'geometry', 'name', 'address_components', 'photos']
    });
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
    const autocompleteElem = document.getElementById('autocomplete');
    const detailsElem = document.getElementById('details');
    const imagesElem = document.getElementById('images');

    if (!place.geometry) {
        autocompleteElem.placeholder = 'Enter a place';
        return;
    }

    detailsElem.innerHTML = place.name;
    imagesElem.innerHTML = '';

    if (place.photos && place.photos.length > 0) {
        const randomPhoto = place.photos[Math.floor(Math.random() * place.photos.length)];
        const img = document.createElement('img');
        img.src = randomPhoto.getUrl({ maxWidth: 300, maxHeight: 300 });
        imagesElem.appendChild(img);
    } else {
        const noImageText = document.createElement('p');
        noImageText.textContent = 'No images available';
        imagesElem.appendChild(noImageText);
    }
    
    console.log(place.address_components);
}

function searchLocation() {
    const location = document.getElementById('autocomplete').value.toLowerCase();
    if (!location) {
        alert('Please enter a location');
        return;
    }

    alert('Searching for ' + location);

    const encodedLocation = encodeURIComponent(location);
    if (['restaurant', 'food', 'places to eat', 'restaurants near'].some(term => location.includes(term))) {
        window.location.href = '#' + encodedLocation;
    } else if (['hotel', 'places to stay'].some(term => location.includes(term))) {
        window.location.href = '#' + encodedLocation;
    }
}

function goToPage(page) {
    window.location.href = page;
}
