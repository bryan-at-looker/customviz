(function() {
  var viz = {
    id: "highcharts_sankey",
    label: "Forecast Sankey",
    // Set up the initial state of the visualization
    create: function(element, config) {
        var css = element.innerHTML = `
        <style>
        .remove-me {
        }

        .looker-sankey-chart {
            height: 100%;
            width: 100%;
        }
        </style>
        <div id="looker-sankey-chart" class="looker-sankey-chart"></div>
        `;
    },
    // Render in response to the data or settings changing
    update: function(data, element, config, queryResponse) {

        var num_objects = queryResponse.fields.dimension_like.length;
        var temp = [];
        var dt2 = [];

        for (var j=0; j < data.length; j++) {
            temp = [];
            for (var i=0; i < num_objects; i++) { 
                temp[i] = data[j][queryResponse.fields.dimension_like[i].name].value;
            }
            temp[num_objects] = data[j][queryResponse.fields.measure_like[0].name].value;
            dt2.push(temp);
        }

    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    Highcharts.chart('looker-sankey-chart', {
        exporting: { enabled: false },
        title: {
            text: null
        },

        series: [{
            keys: ['from', 'to', 'weight'],
            data: dt2,
            type: 'sankey',
            name: null
        }]

    });



}
};
looker.plugins.visualizations.add(viz);
}());