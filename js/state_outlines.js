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
              color: 'blue',
              weight: 3,
              fillOpacity: 0
            });

            selectedStateLayer = layer;

            // Trigger a custom event with the clicked state's data
            var event = new CustomEvent('stateclick', {
              detail: {
                state: feature.properties.NAME
              }
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

      // Highlight Wisconsin by default
      var wisconsinLayer = stateOutlines.getLayers().find(function (layer) {
        return layer.feature.properties.STATE === '55'; // Wisconsin's STATE code
      });

      if (wisconsinLayer) {
        wisconsinLayer.setStyle({
          color: 'blue',
          weight: 3,
          fillOpacity: 0
        });
        selectedStateLayer = wisconsinLayer;

        // Trigger the custom event for Wisconsin on page load
        var event = new CustomEvent('stateclick', {
          detail: {
            state: 'Wisconsin'
          }
        });
        document.dispatchEvent(event);
      }
    });
}