function changeFormatter(value1, value2, percent_change, positive_is_bad) {
  var output = ''

  if (percent_change == 'subtract' ) {
    var change = value1 - value2; 
  } else {
    var change = value1 / value2 - 1.0;
  }

  var singleValueChangeText = ((change < 0) ? '▼ ' : '▲ ') + (change*100).toFixed(2) + '%';
  if (change > 0) {
    var singleValueChangeColor = ( positive_is_bad ) ? 'red' : 'green';
  } else if (change < 0 ) {
    var singleValueChangeColor = ( positive_is_bad ) ? 'green' : 'red';
  } else {
    var singleValueChangeColor = 'black'
  }

  output = '<font color="' + singleValueChangeColor + '">' + singleValueChangeText + '</font>'
  return output
}

looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker
  // id: "hello_world",
  // label: "Hello World",
  options: {
    area_color: {
      type: "string",
      display: "color",
      label: "Area Color",
      default: "#ff0000"
    },
    percent_change: {
      type: "string",
      label: "% Change Type",
      display: "select",
      default: "subtract",
      values: [
        {"Subtraction": "subtract"},
        {"Division": "divide"}
      ]
    },
    positive_is_bad: {
      type: "boolean",
      label: "Positive Values are Bad",
      default: false
    }
    // font_size: {
    //   type: "string",
    //   label: "Font Size",
    //   values: [
    //     {"Large": "large"},
    //     {"Small": "small"}
    //   ],
    //   display: "radio",
    //   default: "large"
    // },
  },
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.

    element.innerHTML = `
      <style>
        #chartContainer {
          position: absolute;
          bottom: 0px;
          height: 100%;
          width: 100%;
        }
        #singleValue {
          z-index: 1;
          position: absolute;
          height: 50%;
          top: 0px;
          width: 100%;
        }
        h1, h2 {
          display: inline;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    var singleValue = element.appendChild(document.createElement("div"));
    singleValue.id = "singleValue";
    singleValue.innerHTML = `
        <h1 id="singleValueNumber"></h1><br/><h2 id="singleValueChange"></h2>
    `

    var chartContainer = element.appendChild(document.createElement("div"));
    chartContainer.id = "chartContainer";


    // Create an element to contain the text.
    // this._textElement = container.appendChild(document.createElement("div"));

  },
  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {

    // Clear any errors from previous updates
    this.clearErrors();
    var errors = false;

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimension_like.length == 0) {
      this.addError({title: "Dimension Error", message: "This chart requires 1 dimension."});
      errors = true;
    } else if (queryResponse.fields.measure_like.length != 1) {
      this.addError({title: "Measure Error", message: "This chart requires 1 measure."});
      errors = true;
    } else if (queryResponse.pivots.length != 2) {
      this.addError({title: "Pivot Error", message: "This chart requires only 2 pivoted values and no row totals."});
      errors = true;
    } else if (!queryResponse.totals_data ) {
      this.addError({title: "Total Error", message: "This chart requires totals."});
      errors = true;
    }

    if (!errors) {
  
      var firstPivot = queryResponse.pivots[0].key
      var secondPivot = queryResponse.pivots[1].key
      var firstMeasure = queryResponse.fields.measure_like[0].name
      var firstDimension = queryResponse.fields.dimension_like[0].name
  
      var singleValueNumber = document.querySelector("#singleValueNumber");
      var singleValueChange = document.querySelector("#singleValueChange");
      var totalPivotValues = [queryResponse.totals_data[firstMeasure][firstPivot].value, 
                         queryResponse.totals_data[firstMeasure][secondPivot].value ]
      
      singleValueNumber.innerHTML = totalPivotValues[0]
      singleValueChange.innerHTML = changeFormatter(totalPivotValues[0],totalPivotValues[1],config.percent_change, config.positive_is_bad)
      
  
      var firstPivot = data.map(row => {
        let link = row[firstMeasure][firstPivot].links;
        var obj = {
          x_rendered: ( row[firstDimension].rendered_value ) ? row[firstDimension].rendered_value : row[firstDimension].value,
          y: row[firstMeasure][firstPivot].value,
          y_rendered: ( row[firstMeasure][firstPivot].rendered_value ) ? row[firstMeasure][firstPivot].rendered_value : row[firstMeasure][firstPivot].value,
          change: changeFormatter(row[firstMeasure][firstPivot].value,row[firstMeasure][secondPivot].value,config.percent_change, config.positive_is_bad),
          events: {
            click: function(event) {
                window.LookerCharts.Utils.openDrillMenu({links: link, event})
            }
          }
        }
        return obj
      })
  
      Highcharts.chart('chartContainer', {
        chart: {
            type: 'area',
            margin: [0, 0, 0, 0],
            spacing: [0,0,0,0],
            backgroundColor: 'rgba(255, 255, 255, 0.0)'
        },
        title:{text:'', margin: 0},
        // subTitle:{text:'', margin: 0},
        legend: {
          enabled: false
        },
        yAxis: {
          visible: false
        },
        xAxis: {
          title: '',
          visible: false,
        },
        plotOptions: {
          series: {
              fillOpacity: 0.1
          }
        },
    
        series: [{
            data: firstPivot,
            color: (config.area_color) ? config.area_color : "#ff0000"
        }],
        tooltip: {
          useHTML: true,
          formatter: function () {
              return '<strong>' + this.points[0].point.x_rendered + ':</strong> ' +
              this.points[0].point.y_rendered + '<br/>' +
              this.points[0].point.change + 
              ' vs.<br/>same day last period';
          },
          shared: true
        }
    });
    }
    // We are done rendering! Let Looker know.
    done()
  }
});
