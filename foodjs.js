function storeInput() {
    const Cities = [];
let currentCities = JSON.parse(localStorage.getItem('city'));

if (currentCities == null) {
     currentCities = [];
};

const newCity= document.getElementById('location').value;
if (newCity == "") {
  alert("Please enter a location");}

  else {

if (currentCities === null) {
  Cities.push(newCity);
  localStorage.setItem('City', JSON.stringify(Cities));

} else {
currentCities.push(newCity);
localStorage.setItem('City', JSON.stringify(currentCities));
}
if (newCity !== "" ) {

    window.location.assign('index.html');
   }
   
  };
}