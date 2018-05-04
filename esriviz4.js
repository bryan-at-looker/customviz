looker.plugins.visualizations.add({
  id: "esri_map",
  label: "Esri Map",
  create: function(element, config) {

  // Insert a <style> tag with some styles we'll use later.
  var css = element.innerHTML = `
    <style>
      .esri_map-vis {
        // Vertical centering
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
      }
    </style>
  `;

	// document.write("<script src=\"https://js.arcgis.com/4.6/\"></script>");

  // Create a container element to let us center the text.
  var container = element.appendChild(document.createElement("div"));
  container.className = "esri_map-vis";

  // Create an element to contain the text.
  // this._textElement = container.appendChild(document.createElement("div"));

  },
  update: function(data, element, config, queryResponse) {

  var fl;
  var map;
  var graphics = [];

function makeMap() {
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/renderers/UniqueValueRenderer", 
  "dojo/domReady!"
], function(Map, SceneView, Graphic, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, UniqueValueRenderer) {

  graphics = [];

  map = new Map({
    basemap: "streets",
    ground: "world-elevation"
  });


  var view = new SceneView({
    container: "esri_map-vis",
    map: map,
    scale: 50000000,
    center: [-101.17, 21.78]
  });

// dot1 = new SimpleMarkerSymbol({
//       size: 20,
//       color: "red",
//       outline: {
//         width: 1,
//         color: "white"
//       }})

// dot2 = new SimpleMarkerSymbol({
//       size: 20,
//       color: "blue",
//       outline: {
//         width: 1,
//         color: "white"
//       }})

// dot3 = new SimpleMarkerSymbol({
//       size: 20,
//       color: "green",
//       outline: {
//         width: 1,
//         color: "white"
//       }})

// var renderer = {
//   type: "unique-value",  // autocasts as new UniqueValueRenderer()
//   field: "crime_type",  // values returned by this function will
//                      // be used to render features by type
//   uniqueValueInfos: [{
//       value: "Burglary",  // features labeled as "High"
//       symbol: dot1  // will be assigned sym1
//     }, {
//       value: "Vandalism",  // features labeled as "Medium"
//       symbol: dot2  // will be assigned sym2
//     }, {
//       value: "Theft",  // features labeled as "Medium"
//       symbol: dot3  // will be assigned sym2
//     }]
// };

  // map.add(fl);

  // view.then(function() {
    view.goTo({
        center: [-117.1382,32.7232],
        zoom: 14,
        heading: 30,
        tilt: 60
      }, { speedFactor: 0.25 });
  // });
})
};
    makeMap();

  }
})