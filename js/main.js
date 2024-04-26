//Leaflet map
var map;

//intialization
function createMap() {
    map = L.map('map', {
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
    basemapRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (currentBasemap) {
                map.removeLayer(currentBasemap);
            }
            currentBasemap = basemaps[this.value];
            currentBasemap.addTo(map);
        });
    });

    // Dropdown functionality
    var chevron = document.querySelector('.stats-dropdown-chevron');
    chevron.addEventListener('click', function () {
        this.classList.toggle('expanded');
    });
    getData();
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

function lineToLayer() {

}

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

function createPropSymbols(data, attributes) {
    //console.log(data)
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

function PopupContent(properties, valueDict) {
    this.formatted = "<p><b>Plant Name:</b> " + valueDict["Plant_Name"] + "</p><p><b>Primary Source:</b> " + valueDict["PrimSource"] + "</p><p><b>Distance to high-voltage transmission:</b> " + valueDict["NEAR_DIST"] + " miles</p>";
};

function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    console.log(properties)

    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute == "Plant_Name" || attribute == "NEAR_DIST" || attribute == "PrimSource") {
            attributes.push(attribute);
        };
    };

    return attributes;
};

function getData() {
    //load the data
    fetch("data/PowerPlants_Continental_US_project.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var attributes = processData(json);
            createPropSymbols(json, attributes);
        })
    fetch("data/Transmission_Continental_US.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            L.geoJson(data).addTo(map);
        })
};

document.addEventListener('DOMContentLoaded', createMap())


