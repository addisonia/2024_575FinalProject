// Global variable for the transmission layer
var transmissionLayer;

function getData() {
    // Load the power plants data as before
    fetch("data/PowerPlants_Continental_US_project.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            var attributes = processData(json);
            createPropSymbols(json, attributes);
        });

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

document.addEventListener('DOMContentLoaded', function() {

    // Find the toggle checkbox
    var transmissionToggle = document.getElementById('toggle-transmission');
    
    // Add a change event listener to toggle the transmission layer
    transmissionToggle.addEventListener('change', function() {
        if (this.checked) {
            // If the checkbox is checked, add the transmission layer to the map
            transmissionLayer.addTo(map);
        } else {
            // If the checkbox is unchecked, remove the transmission layer from the map
            transmissionLayer.remove();
        }
    });
});
