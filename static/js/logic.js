// Create the map object with center and zoom level
let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
  });
  
  // Add a tile layer (the background map image) to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // URL for earthquake data
  let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Function to determine the marker size based on the magnitude of the earthquake
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  
  // Function to determine the color of the marker based on the depth of the earthquake
  function getColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#fca35d' :
           depth > 50 ? '#fdb72a' :
           depth > 30 ? '#f7db11' :
           depth > 10 ? '#dcf400' :
                        '#a3f600';
  }
  
  // Perform a GET request to the query URL
  d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    
    // Define a function that we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    let earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    });
  
    // Add the earthquakes layer to the map
    earthquakes.addTo(myMap);
  
    // Create a legend to display information about our map
    let legend = L.control({position: "bottomright"});
  
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let grades = [0, 10, 30, 50, 70, 90];
      let labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
  
    // Add the legend to the map
    legend.addTo(myMap);
  }
  