//Leaflet map
var map;

//intialization
function createMap() {
    map = L.map('map', {
        center: [44.5, -92],
        zoom: 7,
        zoomControl: true
    });


    //set map to user location
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // Locate the user, but don't use 'setView' here to avoid auto zooming.
    map.locate();

    function onLocationFound(e) {
        // If the location is found, just center the map on it without zooming in too much.
        map.setView(e.latlng, 10);
    }

    function onLocationError(e) {
        alert(e.message);
        // Set the view to the default location (Wisconsin) if there's an error
        map.setView([44.5, -92], 7);
    }


    var whiteBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
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

    var topoBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Map data © USGS'
    });

    var climateZonesBasemap = L.tileLayer('https://lcz-generator.rub.de/tms/global-map-tiles/latest/{z}/{x}/{y}.png', {
        tms: true,
        maxZoom: 19,
        attribution: 'Climate Zones Data © Matthias Demuzere et al. 2022'
    });

    var basemaps = {
        "white": whiteBasemap,
        "openstreetmap": openStreetMap,
        "satellite": satelliteBasemap,
        "topographic": topoBasemap,
        "climatezones": climateZonesBasemap
    };

    // Initially set the current basemap to openStreetMap
    var currentBasemap = openStreetMap;

    var basemapRadios = document.querySelectorAll('input[name="basemap"]');
    basemapRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (currentBasemap) {
                map.removeLayer(currentBasemap);
            }
            currentBasemap = basemaps[this.value];
            currentBasemap.addTo(map);
        });
    });

    // Find the toggle checkbox
    var transmissionToggle = document.getElementById('toggle-transmission');

    // Add a change event listener to toggle the transmission layer
    transmissionToggle.addEventListener('change', function() {
        if (this.checked) {
            // If the checkbox is checked, add the transmission layer to the map
            transmissionLayer.addTo(map);
            transmissionLayer.bringToBack();
        } else {
            // If the checkbox is unchecked, remove the transmission layer from the map
            map.removeLayer(transmissionLayer);
        }
    });



    // Location button functionality
    var locationButton = document.querySelector('.location-button');
    locationButton.addEventListener('click', function () {
    map.locate({ setView: true, maxZoom: 10 });
    });

    // Zoom in button functionality
    var zoomInButton = document.querySelector('.zoom-in-button');
    zoomInButton.addEventListener('click', function () {
    map.zoomIn();
    });

    // Zoom out button functionality
    var zoomOutButton = document.querySelector('.zoom-out-button');
    zoomOutButton.addEventListener('click', function () {
    map.zoomOut();
    });

    
    addStateOutlines(map);
    createLegend();
};


function createLegend() {
    var legendBox = document.querySelector('.legend-box');

    var distances = [1, 10, 35, 150]; // Updated distances for the legend
    var colors = ['#ffeda0', '#feb24c', '#f03b20', '#bd0026']; // Updated colors corresponding to the distances

    // Create legend title
    var legendTitle = '<h4 class="legend-title">Distance to Closest High-Voltage Line</h4>';
    legendBox.innerHTML = legendTitle;

    // Create legend items
    for (var i = 0; i < distances.length; i++) {
        var distance = distances[i];
        var color = colors[i];

        var legendItem = '<div class="legend-item">';
        legendItem += '<div class="legend-circle" style="background-color: ' + color + '; border: 1px solid black;"></div>';
        legendItem += '<span class="legend-label">' + distance + ' miles</span>';
        legendItem += '</div>';

        legendBox.innerHTML += legendItem;
    }

    legendBox.innerHTML += '<div class="legend-spacer"></div>';
    legendBox.innerHTML += '<h4 class="line-title">High-voltage transmission line (>= 345 kV)</h4>';
    legendItem = '<div class="legend-item">';
    legendItem += '<div class="rounded-rectangle" style="background-color: #1E90FF	;"></div></div>';
    legendBox.innerHTML += legendItem;

}

// Update the calcColor function in the create_map.js file
function calcColor(attValue) {
    var color;
    if (attValue <= 1) {
        color = "#ffeda0";
    } else if (attValue <= 10) {
        color = "#feb24c";
    } else if (attValue <= 35) {
        color = "#f03b20";
    } else {
        color = "#bd0026";
    }

    return color;
}

function createPropSymbols(data, attributes) {
    //console.log(data)
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

function pointToLayer(feature, latlng, attributes) {
    //console.log(attributes[0])
    var valueDict = {};

    attributes.forEach(function (attribute) {
        var attValue = feature.properties[attribute];
        valueDict[attribute] = attValue
    });
    //console.log(valueDict)

    //create marker options
    var options = {
        color: "#000",
        weight: 1,
        opacity: 1,
        radius: 7,
        fillOpacity: 0.65
    };

    options.fillColor = calcColor(valueDict["NEAR_DIST"]);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = new PopupContent(feature.properties, valueDict);

    layer.bindPopup(popupContent.formatted, {
        offset: new L.Point(0, -Math.sqrt(options.radius))
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function calcColor(attValue) {
    var color
    if (attValue <= 5) {
        color = "#ffeda0"
    }
    else if (attValue <= 25) {
        color = "#fec44f"
    }
    else {
        color = "#f03b20"
    }

    linearScale = d3.scaleLinear()
        .domain([0, 20])
        .range(["#ffeda0", "#f03b20"]);

    return linearScale(attValue);
};



function PopupContent(properties, valueDict) {
    var distance = valueDict["NEAR_DIST"];

    // Round the distance to one decimal place
    var roundedDistance = Math.round(distance * 10) / 10;

    // Determine the correct unit (mile or miles)
    var distanceUnit = roundedDistance === 1 ? "mile" : "miles";

    // Format the distance for display in the popup
    var formattedDistance = roundedDistance + " " + distanceUnit;

    this.formatted = "<p><b>Plant Name:</b> " + valueDict["Plant_Name"] + "</p><p><b>Primary Source:</b> " + valueDict["PrimSource"] + "</p><p><b>Distance to high-voltage transmission:</b> " + formattedDistance + "</p>";
};

