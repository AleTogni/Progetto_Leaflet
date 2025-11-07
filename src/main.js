import './style.css'
const map = L.map('map').setView([45.605811462904406, 10.212098934035723], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//fai const "nome" = L.marker per poter usare poi bindpopup
const marker = L.marker([45.605811462904406, 10.212098934035723]).addTo(map);
marker.bindPopup("Casa");

const circle = L.circle([45.605811462904406, 10.212098934035723], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.1,
    radius: 500
}).addTo(map);
circle.bindPopup("Concesio");


fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson")
.then(r => r.json())
.then(body => {
    const terremoti = body.features
    console.log(terremoti)
    for(const terremoto of terremoti) {
        const lat = terremoto.geometry.coordinates[1]
        const lng = terremoto.geometry.coordinates[0]
        const mag = terremoto.properties.mag
        const place = terremoto.properties.place
        L.circle([lat, lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.1,
            radius: 500 + 5*Math.pow(5, mag)
        }).addTo(map);
    }
})