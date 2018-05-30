  (function() {
        var viz = {
          id: "highcharts_sankey",
          label: "Forecast Sankey",
          options: {
            color_up: {
              section: "Chart",
              type: "string",
              label: "Up Color",
              display: "color",
              default: "green"
            }
          },

          // Set up the initial state of the visualization
          create: function(element, config) {
              var css = element.innerHTML = `
              <div id="andychart" class="looker-sankey-chart"></div>
              `;
          },
          // Render in response to the data or settings changing
          update: function(data, element, config, queryResponse) {

Highcharts.chart('andychart', {
  plotOptions: {
    series: {
      animation: {
        duration: 10000
      }
    }
  },
  xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        plotLines: [{
            color: config.color_up,
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
