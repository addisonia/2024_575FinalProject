//Leaflet map

//intialization
document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map', {
        center: [44.5, -92], // Center coordinates for Wisconsin
        zoom: 7, 
        zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);
});
