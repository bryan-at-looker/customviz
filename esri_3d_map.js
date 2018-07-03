  (function() {
    var viz = {
      id: "esrimap",
      label: "3D EsriMap",
          // Set up the initial state of the visualization
          create: function(element, config) {
            var css = element.innerHTML = `
            <style>
            .viewDiv {
              height: 100%;
              width: 100%;
            }
            </style>
            <div id="viewDiv" class="viewDiv"></div>
            `;

          },
          // Render in response to the data or settings changing
          update: function(data, element, config, queryResponse) {

            geoms = []
            for (var k in data) {
              var geom = {  "geometry": {
                "x": parseFloat(data[k][queryResponse.fields.dimension_like[0].name].value), 
                "y": parseFloat(data[k][queryResponse.fields.dimension_like[1].name].value), 
                "spatialReference": {"wkid": 4326}
              },
              "attributes": {
                "OBJECTID": k
              }
            }
            geoms[k] = geom;
          }
          console.log(JSON.stringify(geoms));

          require([
            "esri/Map",
            "esri/views/SceneView",
            "esri/geometry/Point",
            "esri/layers/FeatureLayer",
            "esri/Graphic",
            "esri/renderers/SimpleRenderer",
            "esri/symbols/SimpleMarkerSymbol",
            "dojo/domReady!"
            ], function(Map, SceneView, Point, FeatureLayer, Graphic, SimpleRenderer, SimpleMarkerSymbol) {

              var renderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                  size: 10,
                  color: "#FF4000",
                  outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 64, 0, 0.4], // autocasts as new Color()
                    width: 7
                  }
                }
              };

              var map = new Map({
                basemap: "streets",
                ground: "world-elevation"
              });

              var view = new SceneView({
                container: "viewDiv",
                map: map,
                scale: 50000000,
                center: [-6.266155, 53.350140]
              });

              view.goTo({
                center: [-122.4194,37.7749],
                zoom: 14,
                heading: 30,
                tilt: 60
              }, { speedFactor: 0.5 })

              graphics = [];

              geoms.forEach(function(gr) {
                var graphic = Graphic.fromJSON(gr);
                graphics.push(graphic);
              });

              var fl = new FeatureLayer({
                source: graphics,
                fields: [
                  {
                    name: "OBJECTID",
                    alias: "OBJECTID",
                    type: "oid"
                  }
                ],
                objectIdField: "OBJECTID",
                geometryType: "point",
                spatialReference: {wkid: 4326},
                renderer: renderer
              });



              map.add(fl);
console.log('added')
            });


        }
      };
      looker.plugins.visualizations.add(viz);
    }());
