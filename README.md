# leaflet-challenge


This project creates an interactive map displaying earthquake data and tectonic plate boundaries using Leaflet.js

## Files

-   `index.html`: Contains the HTML structure for the map.
-   `script.js`: Contains the JavaScript code to fetch and display the data on the map.

## Setup

1.  **Open `index.html`:** Simply open the `index.html` file in your web browser. Ensure you have an internet connection, as the script fetches data from online sources.

## Code Explanation (`script.js`)

```javascript
// Create the 'backgroundTiles' tile layer that will be the background of our map.
let backgroundTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
});
This line initializes the base map layer using Leaflet's L.tileLayer function. It fetches map tiles from OpenStreetMap, which provides the visual background of the map. The attribution property ensures proper copyright attribution for OpenStreetMap.
JavaScript

// OPTIONAL: Step 2
// Create the 'altTiles' tile layer as a second background of the map
let altTiles = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="[https://www.openstreetmap.org/copyright](https://www.openstreetmap.org/copyright)">OpenStreetMap</a> contributors'
});
This creates an alternative base map layer, also from OpenStreetMap but with a different style. This allows the user to switch between different map appearances.
JavaScript

// Create the map object with center and zoom options.
let mainMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 3,
  layers: [backgroundTiles] // Initialize with the backgroundTiles
});
This initializes the Leaflet map object itself. It associates the map with an HTML element with the ID "map", sets the initial center and zoom level, and adds the backgroundTiles layer to it.
JavaScript

// Then add the 'backgroundTiles' tile layer to the map.
backgroundTiles.addTo(mainMap);
This line explicitly adds the backgroundTiles layer to the created map. While it's already in the initial layers, this ensures it's properly added.
JavaScript

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
This section creates Leaflet layer groups (L.LayerGroup) to organize the earthquake data (tremors) and tectonic plate data (plateBoundaries). It also sets up baseLayers and overlayLayers objects, which will be used in the layer control to allow users to toggle map layers.
JavaScript

L.control.layers(baseLayers, overlayLayers).addTo(mainMap);
This adds a Leaflet layer control to the map. This control provides a user interface for switching between base map layers and toggling overlay layers.
JavaScript

d3.json("[https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson)").then(function (dataPoints) {
  // ...
});
This uses the D3 library's d3.json function to fetch earthquake data in GeoJSON format from the USGS. The .then() method executes a function once the data is successfully retrieved.
JavaScript

function pointStyle(feature) {
  // ...
}

function getColorValue(depthValue) {
  // ...
}

function getRadiusValue(intensityValue) {
  // ...
}
These functions define the visual style of the earthquake markers. pointStyle returns an object with style properties, getColorValue determines the marker color based on earthquake depth, and getRadiusValue determines the marker radius based on earthquake magnitude.
JavaScript

L.geoJson(dataPoints, {
  // ...
}).addTo(tremors);
tremors.addTo(mainMap);
This adds the fetched GeoJSON earthquake data to the map as circle markers using L.geoJson. It applies the defined styles and adds popups to the markers. The markers are added to the tremors layer group, which is then added to the map.
JavaScript

let mapLegend = L.control({
  position: "bottomright"
});

mapLegend.onAdd = function () {
  // ...
};

mapLegend.addTo(mainMap);
This creates a Leaflet control object to display a legend on the map, explaining the color coding for earthquake depths.
JavaScript

d3.json("[https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json](https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json)").then(function (plateData) {
  // ...
});
This fetches tectonic plate boundary data in GeoJSON format from a GitHub repository.
JavaScript

L.geoJson(plateData, {
  // ...
}).addTo(plateBoundaries);
plateBoundaries.addTo(mainMap);
This adds the tectonic plate boundary data to the map as lines. The lines are added to the plateBoundaries layer group, which is then added to the map.
Dependencies
Leaflet.js: For map display and interaction.
D3.js: For fetching and parsing GeoJSON data.
Data Sources
Earthquake data: USGS Earthquake Hazards Program.
Tectonic plate boundary data: Fraxen/tectonicplates on GitHub.