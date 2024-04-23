//Leaflet map

//intialization
document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map', {
        center: [44.5, -92],
        zoom: 7,
        zoomControl: true
    });

    var whiteBasemap = L.tileLayer('', {
        maxZoom: 19,
        attribution: 'White Basemap'
    });

    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map); // Start with the openStreetMap

    var satelliteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Satellite Basemap'
    });

    var basemaps = {
        "white": whiteBasemap,
        "openstreetmap": openStreetMap,
        "satellite": satelliteBasemap
    };

    // Initially set the current basemap to white
    var currentBasemap = openStreetMap;

    var basemapRadios = document.querySelectorAll('input[name="basemap"]');
    basemapRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (currentBasemap) {
                map.removeLayer(currentBasemap);
            }
            currentBasemap = basemaps[this.value];
            currentBasemap.addTo(map);
        });
    });

    // Dropdown functionality
    var chevron = document.querySelector('.stats-dropdown-chevron');
    chevron.addEventListener('click', function() {
        this.classList.toggle('expanded');
    });
});
