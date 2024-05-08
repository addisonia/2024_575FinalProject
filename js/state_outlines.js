var stateOutlines;
var selectedStateLayer;

function addStateOutlines(map) {
    fetch('data/state_outlines_5m.json')
        .then(response => response.json())
        .then(data => {
            stateOutlines = L.geoJSON(data, {
                style: {
                    color: 'gray',
                    weight: 1,
                    fillOpacity: 0
                },
                onEachFeature: function (feature, layer) {
                    layer.on('click', function () {
                        // Reset style for all states
                        stateOutlines.resetStyle();

                        // Apply new style to the clicked state
                        layer.setStyle({
                            color: '#00CED1',
                            weight: 3,
                            fillOpacity: 0.1
                        });

                        selectedStateLayer = layer;

                        // Trigger a custom event with the clicked state's data
                        var event = new CustomEvent('stateclick', {
                            detail: { state: feature.properties.NAME }
                        });
                        document.dispatchEvent(event);
                    });
                },
                filter: function (feature) {
                    // Filter out non-continental states
                    return feature.properties.STATE !== '02' && // Alaska
                        feature.properties.STATE !== '15' && // Hawaii
                        feature.properties.STATE !== '60' && // American Samoa
                        feature.properties.STATE !== '66' && // Guam
                        feature.properties.STATE !== '69' && // Northern Mariana Islands
                        feature.properties.STATE !== '72' && // Puerto Rico
                        feature.properties.STATE !== '78';   // U.S. Virgin Islands
                }
            }).addTo(map);

            // Get the user's location
            map.locate({ setView: true, maxZoom: 10 });

            // Highlight the user's state by default
            map.on('locationfound', function (e) {
                var userLatLng = e.latlng;

                // Find the state layer that contains the user's location
                var userStateLayer = leafletPip.pointInLayer(userLatLng, stateOutlines, true)[0];

                if (userStateLayer) {
                    // Reset style for all states
                    stateOutlines.resetStyle();

                    // Apply new style to the user's state
                    userStateLayer.setStyle({
                        color: '#00CED1',
                        weight: 3,
                        fillOpacity: 0.1
                    });

                    selectedStateLayer = userStateLayer;

                    // Trigger the custom event for the user's state on page load
                    var event = new CustomEvent('stateclick', {
                        detail: { state: userStateLayer.feature.properties.NAME }
                    });
                    document.dispatchEvent(event);
                }
            });
        });
}