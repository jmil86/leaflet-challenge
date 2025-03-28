// Create the 'backgroundTiles' tile layer that will be the background of our map.
let backgroundTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// OPTIONAL: Step 2
// Create the 'altTiles' tile layer as a second background of the map
let altTiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom options.
let mainMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 3,
  layers: [backgroundTiles] // Initialize with the backgroundTiles
});

// Then add the 'backgroundTiles' tile layer to the map.
backgroundTiles.addTo(mainMap);

// OPTIONAL: Step 2
// Create the layer groups, dataPoints, and lines for our two sets of data, tremors and plateBoundaries.
let tremors = new L.LayerGroup();
let plateBoundaries = new L.LayerGroup();

let baseLayers = {
  "Alt Map": altTiles,
  "Base Map": backgroundTiles
};

let overlayLayers = {
  "Tremors": tremors,
  "Plate Boundaries": plateBoundaries
};

// Add a control to the map that will allow the user to change which layers are visible.
L.control.layers(baseLayers, overlayLayers).addTo(mainMap);

// Make a request that retrieves the tremor geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (dataPoints) {

  // This function returns the style data for each of the tremors we plot on
  // the map. Pass the intensity and depth of the tremor into two separate functions
  // to calculate the color and size.
  function pointStyle(feature) {
    return {
      fillColor: getColorValue(feature.geometry.coordinates[2]),
      radius: getRadiusValue(feature.properties.mag),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }

  // This function determines the color of the marker based on the depth of the tremor.
  function getColorValue(depthValue) {
    if (depthValue > 90) return "#ea2c2c";
    if (depthValue > 70) return "#ea822c";
    if (depthValue > 50) return "#ee9c00";
    if (depthValue > 30) return "#eecc00";
    if (depthValue > 10) return "#d4ee00";
    return "#98ee00";
  }

  // This function determines the radius of the tremor marker based on its intensity.
  function getRadiusValue(intensityValue) {
    if (intensityValue === 0) return 1;
    return intensityValue * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(dataPoints, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our pointStyle function.
    style: pointStyle,
    // Create a popup for each marker to display the intensity and location of the tremor after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Intensity: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place
      );
    }
    // OPTIONAL: Step 2
    // Add the data to the tremor layer instead of directly to the map.
  }).addTo(tremors);
  tremors.addTo(mainMap);

  // Create a legend control object.
  let mapLegend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  mapLegend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depthRanges = [0, 10, 30, 50, 70, 90];
    let colorRanges = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depthRanges.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colorRanges[i] + '"></i> ' +
        depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // Finally, add the legend to the map.
  mapLegend.addTo(mainMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plateData) {
    // Save the geoJSON data, along with style information, to the plateBoundaries layer.
    L.geoJson(plateData, {
      color: "orange",
      weight: 2
    }).addTo(plateBoundaries);

    // Then add the plateBoundaries layer to the map.
    plateBoundaries.addTo(mainMap);
  });
});