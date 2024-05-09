function setupStatsDropdown() {
  var chevron = document.querySelector('.stats-dropdown-chevron');
  var blankBox = document.querySelector('.blank-box');

  chevron.addEventListener('click', function () {
    this.classList.toggle('expanded');
    blankBox.classList.toggle('expanded');
  });

  // Add the blink class to the chevron box after a 3-second delay
  setTimeout(function() {
    chevron.classList.add('blink');
  }, 3000);
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


      // Add missing energy sources with a count of 0
      var allEnergySources = ['coal', 'natural gas', 'nuclear', 'petroleum', 'hydro', 'geothermal', 'solar', 'wind', 'biomass'];
      allEnergySources.forEach(function (energySource) {
        if (!energyCounts[energySource]) {
          energyCounts[energySource] = 0;
        }
      });

      // Sort the energy sources in descending order based on their counts
      var sortedEnergySources = Object.keys(energyCounts).sort(function (a, b) {
        return energyCounts[b] - energyCounts[a];
      });

      // Generate the dropdown content
      var dropdownContent = '<h2>' + state + '</h2>';
      dropdownContent += '<h4>Number of Energy Plants:</h4>';
      sortedEnergySources.forEach(function (energySource) {
        var capitalizedEnergySource = energySource.charAt(0).toUpperCase() + energySource.slice(1);
        dropdownContent += '<p class="energy-count">' + capitalizedEnergySource + ': ' + energyCounts[energySource] + '</p>';
      });

      // Wrap the average distance and continental US average distance lines inside a <div>
      dropdownContent += '<div class="distance-info">';
      dropdownContent += '<p>Average Distance to TM Lines: ' + averageDistance + ' miles</p>';
      dropdownContent += '<p>Continental US Avg Distance: ' + continentalUSAverageDistance + ' miles</p>';
      dropdownContent += '</div>';

      // Update the dropdown content
      var blankBox = document.querySelector('.blank-box');
      blankBox.innerHTML = dropdownContent;
    });
}

document.addEventListener('stateclick', function (event) {
  var state = event.detail.state;
  updateStatsDropdown(state);
});