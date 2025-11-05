import './style.css'
const map = L.map('map').setView([45.605811462904406, 10.212098934035723], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//fai const "nome" = L.maker per poter usare poi bindpopup
const marker = L.marker([45.605811462904406, 10.212098934035723]).addTo(map);
marker.bindPopup("Casa");

const circle = L.circle([45.605811462904406, 10.212098934035723], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.1,
    radius: 500
}).addTo(map);
circle.bindPopup("Concesio");

