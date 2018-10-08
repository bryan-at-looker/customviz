function unique(arr) {
  var hash = {}, result = [];
  for ( var i = 0, l = arr.length; i < l; ++i ) {
    if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
      hash[ arr[i] ] = true;
      result.push(arr[i]);
    }
  }
  return result;
} 

(function() {
  var viz = {
    // id: "highcharts_waterfall",
    // label: "Waterfall",
    options: {
      xAxis: {
        section: "Chart",
        type: "boolean",
        label: "Show X Axis",
        display: "radio",
        default: true
      },
      yAxis: {
        section: "Chart",
        type: "boolean",
        label: "Show Y Axis",
        display: "radio",
        default: true
      },
      cellBorder: {
        section: "Chart",
        type: "boolean",
        label: "Show Cell Border",
        display: "radio",
        default: false
      },
      colors: {
        section: "Colors",
        type: "array",
        label: "Color Range",
        display: "colors"
      },
      color_mapping: {
        section: "Colors",
        type: "array",
        label: "Colored Categories",
        placeholder: "Completed, Delivered, Failed"
      }
    },
    // Set up the initial state of the visualization
    create: function(element, config) {
      var css = element.innerHTML = `
      <style>
      .remove-me { }
      
      .container {
        height: 100%;
        width: 100%;
      }
      </style>
      <div id="container" class="container"></div>
      `;
    },
    // Render in response to the data or settings changing
    updateAsync: function(data, element, config, queryResponse, details, doneRendering) {  

      // Clear any errors from previous updates.
      this.clearErrors();

      // Throw some errors and exit if the shape of the data isn't what this chart needs.
      if (queryResponse.fields.dimension_like.length != 1) {
        this.addError({title: "One Dimension Required", message: "This chart requires one and only one dimension"});
        return;
      }

      if (queryResponse.fields.measure_like.length != 1) {
        this.addError({title: "One Measure Required", message: "This chart requires one and only one measure"});
        return;
      }

      if (queryResponse.fields.measure_like.length != 1) {
        this.addError({title: "One Pivot Required", message: "This chart requires one and only pivoted dimensions"});
        return;
      }
      
      var pivot = queryResponse.fields.pivots[0].name
      var qrPivots = queryResponse.pivots
      var dimension = queryResponse.fields.dimension_like[0].name
      var box = queryResponse.fields.measure_like[0].name;
      let pivotData = qrPivots.map((val, i , qrPivots) => {
        return val['key'];
      });
      let dimensionData = data.map((val, i , data) => {
        return val[dimension].value;
      });

      var boxData = []
      
      for (var i=0; i<data.length; i++) {
        for (var j=0; j<pivotData.length; j++) {
          boxData.push(data[i][box][pivotData[j]].value);
        }
      }
      
      var pivotUnique = unique(pivotData);
      var dimensionUnique = unique(dimensionData);
      var uniqueBox = unique(boxData);

      var color_object = {};
      if ( !(config.colors && config.colors !== 'null' && config.colors !== 'undefined' ) ) {
        config.colors = ['#7B595E','#695D6F','#436676','#146D66','#286E42','#566917','#845901','#AA3E2A']
      }
      if ( config.colors.length < uniqueBox.length ) {
        const numberOfRepeats = Math.ceil(uniqueBox.length / config.colors.length)
        config.colors = [].concat(...Array(numberOfRepeats).fill(config.colors))
      } 

      if (config.color_mapping && config.color_mapping !== 'null' && config.color_mapping !== 'undefined' ) {
        for (var i=0; i<config.color_mapping.length; i++) {
          color_object[config.color_mapping[i]] = config.colors[i]
          color_object[config.color_mapping[i] + '_i'] = i
        }
        for ( item of uniqueBox ) {
          if ( config.color_mapping.indexOf(item) == -1 ) {
            i++;
            color_object[item] = config.colors[i];
            color_object[item + '_i'] = i
          }
        }
      } else {
        for ( var i=0; i<uniqueBox.length; i++ ) {
          color_object[uniqueBox[i]] = config.colors[i]
        }
      }
      
      var seriesData = []
      for (var i=0; i<data.length; i++) {
        for (var j=0; j<pivotData.length; j++) {
          var tmp = {}
          let link = data[i][box][pivotData[j]].links
          tmp['x'] = pivotUnique.indexOf(pivotData[j]);
          tmp['y'] = dimensionData.length - dimensionUnique.indexOf(dimensionData[i]) -1;
          tmp['value'] = data[i][box][pivotData[j]].value;
          tmp['color'] = color_object[tmp['value']];
          tmp['events'] = { click: function(event) {
            window.LookerCharts.Utils.openDrillMenu({links: link, event})
          }}
          
          seriesData.push(tmp)
        }
      }
      
      var chart = Highcharts.chart('container', {
        
        chart: {
          type: 'heatmap',
          plotBorderWidth: 1
        },
        
        exporting: { enabled: false },
        credits: { enabled: false },
        title: { text: null },
        
        xAxis: {
          categories: pivotUnique,
          visible: config.xAxis
        },
        
        yAxis: {
          categories: dimensionUnique,
          title: null,
          visible: config.yAxis
        },
        
        tooltip: {
          useHTML: true,
          formatter: function () {
            let tt = this.series.xAxis.categories[this.point.x] + '<br>' +
            this.series.yAxis.categories[this.point.y] + '<br>' +
            this.point.value + '<br>'
            return tt
          }
        },
        
        series: [{
          borderWidth: 1 ? config.cellBorder : 0,
          showInLegend: false,  
          turboThreshold: 0,
          data: seriesData
        }]
      });
      doneRendering()
    }
  };
  looker.plugins.visualizations.add(viz);
}());