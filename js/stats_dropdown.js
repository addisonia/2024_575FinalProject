function updateStatsDropdown(state) {
    // Load the power plants data
    fetch("data/PowerPlants_Continental_US_project.geojson")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // Filter the power plants data based on the selected state
        var filteredData = data.features.filter(function (feature) {
          return feature.properties.State === state;
        });
  
        // Count the number of energy sources in the filtered data
        var energyCounts = {};
        filteredData.forEach(function (feature) {
          var energySource = feature.properties.PrimSource;
          if (energyCounts[energySource]) {
            energyCounts[energySource]++;
          } else {
            energyCounts[energySource] = 1;
          }
        });
  
        // Generate the dropdown content
        var dropdownContent = '<h2>' + state + '</h2>';
        for (var energySource in energyCounts) {
          dropdownContent += '<p>' + energySource + ': ' + energyCounts[energySource] + '</p>';
        }
  
        // Update the dropdown content
        var blankBox = document.querySelector('.blank-box');
        blankBox.innerHTML = dropdownContent;
      });
  }
  
  // Listen for the custom event triggered when a state is clicked
  document.addEventListener('stateclick', function (event) {
    var state = event.detail.state;
    updateStatsDropdown(state);
  });