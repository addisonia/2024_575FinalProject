// Global variable for the transmission layer
var transmissionLayer;

function getData() {
    // Find all the energy checkboxes
    var energyCheckboxes = document.querySelectorAll('input[name="energy"]');
    energyCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            updateDisplayedEnergySources();
        });
    });

    // Function to update the displayed energy sources based on the checked checkboxes
    function updateDisplayedEnergySources() {
        // Remove all existing layers from the map
        map.eachLayer(function (layer) {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });

        // Get the checked energy sources
        var checkedEnergySources = Array.from(energyCheckboxes)
            .filter(function (checkbox) {
                return checkbox.checked;
            })
            .map(function (checkbox) {
                return checkbox.value;
            });

        // Map the checkbox values to the corresponding values in the GeoJSON data
        var mappedEnergySources = checkedEnergySources.map(function (source) {
            switch (source) {
                case 'hydro':
                    return 'hydroelectric';
                case 'gas':
                    return 'natural gas';
                default:
                    return source;
            }
        });

        // Load the power plants data and filter based on the checked energy sources
        fetch("data/PowerPlants_Continental_US_project.geojson")
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                var filteredFeatures = json.features.filter(function (feature) {
                    return mappedEnergySources.includes(feature.properties.PrimSource);
                });
                var filteredJson = {
                    type: "FeatureCollection",
                    features: filteredFeatures
                };
                var attributes = processData(filteredJson);
                createPropSymbols(filteredJson, attributes);
            });
    }

    // Check the solar checkbox by default
    document.getElementById("solar").checked = true;
    updateDisplayedEnergySources();

    // Load the transmission data
    fetch("data/Transmission_Continental_US.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Store the transmission layer in the global variable but don't add to map yet
            transmissionLayer = L.geoJson(data);
        });
}


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