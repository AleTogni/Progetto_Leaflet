import './style.css'
const map = L.map('map').setView([45.605811462904406, 10.212098934035723], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const earthquakeLayer = L.layerGroup().addTo(map);
const USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
const K = 0.15; // regolo la velocita in cui l opacita si modifica
const UPDATE_INTERVAL = 60 * 1000;  
const MAX_HOURS = 24;

let minMagnitude = 0;

// Slider magnitudo
const minMagInput = document.getElementById('minMag');
const minMagValue = document.getElementById('minMagValue');
minMagInput.addEventListener('input', () => {
    minMagnitude = parseFloat(minMagInput.value);
    minMagValue.textContent = minMagnitude;
    fetchAndDisplayEarthquakes();
});
minMagnitude = parseFloat(minMagInput.value);
minMagValue.textContent = minMagnitude;

// modifico il colore in base all eta del terremoto
function getColorByAge(hours) {
    const r = 255;
    const g = Math.min(255, Math.round((hours / MAX_HOURS) * 255));
    const b = 0;
    return `rgb(${r},${g},${b})`;
}

function fetchAndDisplayEarthquakes() {
    fetch(USGS_URL)
        .then(r => r.json())
        .then(body => {
            earthquakeLayer.clearLayers();
            const now = Date.now();
            const terremoti = body.features;
            for (const terremoto of terremoti) {
                const lat = terremoto.geometry.coordinates[1];
                const lng = terremoto.geometry.coordinates[0];
                const mag = terremoto.properties.mag;
                const place = terremoto.properties.place;
                const time = terremoto.properties.time;
                const eta = (now - time) / (1000 * 60 * 60); // ore trascorse al ms
                if (eta > MAX_HOURS) continue; 
                if (mag < minMagnitude) continue; // FILTRO MAGNITUDO

                const opacity = Math.max(0.2, Math.exp(-K * eta));
                const color = getColorByAge(eta);

                L.circle([lat, lng], {
                    color: color,
                    fillColor: color,
                    fillOpacity: opacity,
                    radius: 500 + 5 * Math.pow(5, mag)
                })
                .bindPopup(
                    `<b>Magnitudo:</b> ${mag}<br>
                    <b>Luogo:</b> ${place}<br>
                    <b>Ora:</b> ${new Date(time).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br>
                    <b>Età:</b> ${eta.toFixed(2)} ore`
                )
                .addTo(earthquakeLayer);
            }
        });
}

// faccio primo fetch e lo mantengo aggiornato
fetchAndDisplayEarthquakes();
setInterval(fetchAndDisplayEarthquakes, UPDATE_INTERVAL);