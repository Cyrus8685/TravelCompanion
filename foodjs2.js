let site = JSON.parse(localStorage.getItem('City'));
console.log(site)
document.getElementById("vacaylocation").innerHTML = "Find delicious dining in " + site + ":"