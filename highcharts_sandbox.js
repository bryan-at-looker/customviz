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

// <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
// <script src="https://code.highcharts.com/highcharts.js"></script>
// <script src="https://code.highcharts.com/highcharts-more.js"></script>
// <script src="https://code.highcharts.com/modules/exporting.js"></script>

  let y = queryResponse.fields.measure_like
  console.log(queryResponse)
  console.log(y)
  console.log(data)
  console.log(config)

  var temp;
  var dt2 = [];
  
    for (var i = 0; i < queryResponse.fields.measure_like.length; i++) { 
        temp = {
            name: queryResponse.fields.measure_like[i].label_short
            , y: data[0][queryResponse.fields.measure_like[i].name].value
            // , events: {
            //     click: function(event) {
            //         link = {
            //             label: data[0][queryResponse.fields.measure_like[i].name].links[0].label,
            //             type: 'url',
            //             type_label: 'Url',
            //             url: data[0][queryResponse.fields.measure_like[i].name].links[0].url
            //         }
            //         window.LookerCharts.Utils.openDrillMenu({links: [link], event})
            //     }
            // }               
        }
        dt2.push(temp)
    }

    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });


Highcharts.chart('looker-waterfall-chart', {
    chart: { type: 'waterfall' },
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
        upColor: Highcharts.getOptions().colors[2],
        color: Highcharts.getOptions().colors[3],
        data: dt2,
        pointPadding: 0,
        dataLabels: {
            enabled: true,
            formatter: function() {
                return '$'+Highcharts.numberFormat(Math.abs(this.y), 0, ',');
            },
            // style: {
            //     fontWeight: 'bold'
            // }
        }
    }]
});



    }
  };
  looker.plugins.visualizations.add(viz);
}());