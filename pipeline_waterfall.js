(function() {
  var viz = {
    id: "highcharts_waterfall",
    label: "Waterfall",
    options: {
      color_up: {
        section: "Chart",
        type: "string",
        label: "Up Color",
        display: "color",
        default: "green"
      },
      color_rest: {
        section: "Chart",
        type: "string",
        label: "Other Colors",
        display: "color",
        default: "red"
      }
    },
    // Set up the initial state of the visualization
    create: function(element, config) {
      var css = element.innerHTML = `
          <style>
              .remove-me {
              }

              .looker-waterfall-chart {
                  height: 100%;
                  width: 100%;
              }
          </style>
          <div id="looker-waterfall-chart" class="looker-waterfall-chart"></div>
      `;
    },
    // Render in response to the data or settings changing
    update: function(data, element, config, queryResponse) {

  let y = queryResponse.fields.measure_like

  var temp;
  var dt2 = [];
  
    for (var i = 0; i < queryResponse.fields.measure_like.length; i++) { 
        let link = data[0][queryResponse.fields.measure_like[i].name].links
        temp = {
            name: queryResponse.fields.measure_like[i].label_short
            , y: data[0][queryResponse.fields.measure_like[i].name].value
            , events: {
                click: function(event) {
                    window.LookerCharts.Utils.openDrillMenu({links: link, event})
                }
            }               
        }
        dt2.push(temp)
    }

    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    console.log(config)

Highcharts.chart('looker-waterfall-chart', {
  colors: config.color_range,
  chart: { type: 'waterfall' },
  credits: false,
  title: { text: null },
  exporting: { enabled: false },
  xAxis: {
    type: 'category'
  },

  yAxis: {
    title: {
      text: 'Pipeline ($)'
    }
  },

  legend: {
      enabled: false
  },

  tooltip: {
    // pointFormat: '<b>${point.y:,.0f}</b>'
    formatter: function() {
        return '$'+Highcharts.numberFormat(Math.abs(this.y), 0, ',');
    },
  },

  series: [{
    upColor: config.color_up, 
    color: config.color_rest,
    data: dt2,
    pointPadding: 0,
    dataLabels: {
      enabled: true,
      formatter: function() {
        return '$'+Highcharts.numberFormat(Math.abs(this.y), 0, ',');
      },
    }
  }]
});



    }
  };
  looker.plugins.visualizations.add(viz);
}());
