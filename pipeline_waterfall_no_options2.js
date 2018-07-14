function nFormatter(num) {
  num = (num>=0) ? num : Math.abs(num);
     if (num >= 1000000000) {  return ( (num / 1000000000.0,1).toFixed(1) + 'B');     }
     if (num >= 1000000) {  return ( (num / 1000000.0,1).toFixed(1) + 'M');           }
     if (num >= 1000) {  return ( (num / 1000.0,1).toFixed(1) + 'K');                 }
     if (num > 0) {  return (num,1).toFixed(1);     }
     return num;
}

(function() {
  var viz = {
    id: "highcharts_waterfall",
    label: "Waterfall",
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
  var total = 0;
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
      };
      total += (data[0][queryResponse.fields.measure_like[i].name].value > 0) ? data[0][queryResponse.fields.measure_like[i].name].value : 0;
      dt2.push(temp);
  }

  Highcharts.setOptions({
      lang: {
          thousandsSep: ','
      }
  });

  console.log(total)

var chart = Highcharts.chart('looker-waterfall-chart', {
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
        return '$'+nFormatter(this.y);
    },
  },

  series: [{
    upColor: "green", 
    color: "red",
    data: dt2,
    pointPadding: 0,
    dataLabels: {
      enabled: true,
      formatter: function() {
        return '$'+nFormatter(this.y);
      },
    }
  }]
});

if (config.dotted_line) { 
  chart.yAxis[0].addPlotLine({
      value : total,
      color : 'green',
      dashStyle : 'shortdash',
      width : 2,
      visible : config.dotted_line,
      label : {
          text : 'Cumulative In Pipeline: $'+nFormatter(total)
      }
    });
}
if (config.start_end_band) { 
  chart.yAxis[0].addPlotBand({
            from: data[0][queryResponse.fields.measure_like[0].name].value,
            to: -1* data[0][queryResponse.fields.measure_like[queryResponse.fields.measure_like.length-1].name].value,
            color: '#FCFFC5',
            id: 'plot-band-1',
            label: { text: 'Amount Changed: $'+nFormatter( data[0][queryResponse.fields.measure_like[0].name].value 
            + data[0][queryResponse.fields.measure_like[queryResponse.fields.measure_like.length-1].name].value),
                    verticalAlign: 'middle',
                    align: 'center' }
        });
}



    }
  };
  looker.plugins.visualizations.add(viz);
}());
