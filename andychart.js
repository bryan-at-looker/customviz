  (function() {
        var viz = {
          id: "highcharts_sankey",
          label: "Forecast Sankey",

          // Set up the initial state of the visualization
          create: function(element, config) {
              var css = element.innerHTML = `
              <div id="andychart" class="looker-sankey-chart"></div>
              `;
          },
          // Render in response to the data or settings changing
          update: function(data, element, config, queryResponse) {

Highcharts.chart('andychart', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        plotLines: [{
            color: '#FF0000',
            width: 2,
            value: 5.5
        }]
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});

          }
      };
      looker.plugins.visualizations.add(viz);
      }()); 
