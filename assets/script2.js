let site = JSON.parse(localStorage.getItem('City'));
console.log(site)
document.getElementById("vacaylocation").innerHTML = "Find delicious dining in " + site + ":"
let map;

function initMap() {
 let latitude = JSON.parse(localStorage.getItem('lats'));
 let lat = latitude.map(Number)
 let longitude = JSON.parse(localStorage.getItem('longs'));
 let lng = longitude.map(Number)
 console.log(lat)
 console.log(lng)
  const mapOptions = {
    zoom: 8,
    center: { lat: lat[0], lng: lng[0] },
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  const marker = new google.maps.Marker({
    position: { lat: lat[0], lng: lng[0] },
    map: map,
  });
 
  const infowindow = new google.maps.InfoWindow({
    content: "<p>Marker Location:" + marker.getPosition() + "</p>",
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.open(map, marker);
  });
}

window.initMap = initMap;