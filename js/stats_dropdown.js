function setupStatsDropdown() {
    var chevron = document.querySelector('.stats-dropdown-chevron');
    var blankBox = document.querySelector('.blank-box');
    chevron.addEventListener('click', function () {
        this.classList.toggle('expanded');
        blankBox.classList.toggle('expanded');
    });
}



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
  
        // Calculate the average distance to transmission lines for the selected state
        var totalDistance = 0;
        filteredData.forEach(function (feature) {
          totalDistance += feature.properties.NEAR_DIST;
        });
        var averageDistance = filteredData.length > 0 ? (totalDistance / filteredData.length).toFixed(2) : 0;
  
        // Calculate the overall continental US average distance to transmission lines
        var continentalUSData = data.features.filter(function (feature) {
          return feature.properties.State !== 'Alaska' && feature.properties.State !== 'Hawaii';
        });
        var continentalUSTotalDistance = 0;
        continentalUSData.forEach(function (feature) {
          continentalUSTotalDistance += feature.properties.NEAR_DIST;
        });
        var continentalUSAverageDistance = continentalUSData.length > 0 ? (continentalUSTotalDistance / continentalUSData.length).toFixed(2) : 0;
  
        // Generate the dropdown content
        var dropdownContent = '<h2>' + state + '</h2>';
        for (var energySource in energyCounts) {
          dropdownContent += '<p>' + energySource + ': ' + energyCounts[energySource] + '</p>';
        }
        dropdownContent += '<p>Average Distance to Transmission Lines: ' + averageDistance + ' miles</p>';
        dropdownContent += '<p>Continental US Average Distance: ' + continentalUSAverageDistance + ' miles</p>';
  
        // Update the dropdown content
        var blankBox = document.querySelector('.blank-box');
        blankBox.innerHTML = dropdownContent;
      });
  }
  
  document.addEventListener('stateclick', function (event) {
    var state = event.detail.state;
    updateStatsDropdown(state);
  });

