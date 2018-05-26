      function nFormatter(num) {
        num = (num>=0) ? num : Math.abs(num);
           if (num >= 1000000000) {  return (num / 1000000000.0).toFixed(1).replace(/\.0$/, '') + 'B';     }
           if (num >= 1000000) {  return (num / 1000000.0).toFixed(1).replace(/\.0$/, '') + 'M';           }
           if (num >= 1000) {  return (num / 1000.0).toFixed(1).replace(/\.0$/, '') + 'K';                 }
           // if (num <= -1000000000) {  return (num / 1000000000.0).toFixed(1).replace(/\.0$/, '') + 'B';    }
           // if (num <= -1000000) {  return (num / 1000000.0).toFixed(1).replace(/\.0$/, '') + 'M';          }
           // if (num <= -1000) {  return (num / 1000.0).toFixed(1).replace(/\.0$/, '') + 'K';                }
           if (num > 0) {  return num.toFixed(1).replace(/\.0$/, '');     }
           return num;
      }

(function() {
  var viz = {
    id: "forecast_sankey",
    label: "Forecast Sankey2",

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
        // var temp = [];
        var dt2 = [];
        var nds = [];
        var node_0_val = {};
        var tt = {
          headerFormat: '',
          pointFormat: '{point.fromNode.name2} → {point.toNode.name2}<br><b>Opportunities: {point.weight}</b><br><b>Start Pipeline: {point.start_pipe}</b><br><b>End Pipeline: {point.end_pipe}</b><br><b>Difference: <span style="color:{point.diff_color}"> {point.difference}</span></b><br/>'
        };
        // var node_1_val = {};

        for (var i=0; i<data.length; i++) {
          node_0_val['dim'+'_'+'0'+'_'+data[i][queryResponse.fields.dimension_like[0].name].value] = (typeof node_0_val['dim'+'_'+'0'+'_'+data[i][queryResponse.fields.dimension_like[0].name].value]==='undefined') ? data[i][queryResponse.fields.measure_like[1].name].value : data[i][queryResponse.fields.measure_like[1].name].value+node_0_val['dim'+'_'+'0'+'_'+data[i][queryResponse.fields.dimension_like[0].name].value];
          node_0_val['dim'+'_'+'1'+'_'+data[i][queryResponse.fields.dimension_like[1].name].value] = (typeof node_0_val['dim'+'_'+'1'+'_'+data[i][queryResponse.fields.dimension_like[1].name].value]==='undefined') ? data[i][queryResponse.fields.measure_like[2].name].value : data[i][queryResponse.fields.measure_like[2].name].value+node_0_val['dim'+'_'+'1'+'_'+data[i][queryResponse.fields.dimension_like[1].name].value];
        }
        // for (var i=0; i<data.length; i++) {
          
        // }

        for (var key in node_0_val) {
          node_0_val[key] = '$'+nFormatter(node_0_val[key]);
        }

        for (var j=0; j < data.length; j++) {
            let temp = [];
            for (var i=0; i < num_objects; i++) { 
                let temp2 = [];
                temp[i] = 'dim'+'_'+i+'_'+data[j][queryResponse.fields.dimension_like[i].name].value;
                // let aln = (i==0) ? 'right' : 'left';
                // console.log(aln)
                temp2 = { id: temp[i], name: data[j][queryResponse.fields.dimension_like[i].name].value+'<br>'+node_0_val[temp[i]], name2: data[j][queryResponse.fields.dimension_like[i].name].value, column: i };
                nds.push(temp2);
            }
            temp[num_objects] = data[j][queryResponse.fields.measure_like[0].name].value;
            let link = data[j][queryResponse.fields.measure_like[0].name].links;
            temp[num_objects+1] = function(event) {
              window.LookerCharts.Utils.openDrillMenu({links: link, event});
            }
            temp[num_objects+2] = '$'+nFormatter(data[j][queryResponse.fields.measure_like[1].name].value);
            temp[num_objects+3] = '$'+nFormatter(data[j][queryResponse.fields.measure_like[2].name].value);
            temp[num_objects+4] = '$'+nFormatter(data[j][queryResponse.fields.measure_like[2].name].value + data[j][queryResponse.fields.measure_like[1].name].value);
            temp[num_objects+5] = ( data[j][queryResponse.fields.measure_like[2].name].value + data[j][queryResponse.fields.measure_like[1].name].value < 0 ) ? 'green' : ( ( data[j][queryResponse.fields.measure_like[2].name].value + data[j][queryResponse.fields.measure_like[1].name].value > 0 ) ? 'red' : 'black' )

            dt2.push(temp);
        }
            console.log(data)
            console.log(node_0_val)

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
            keys: ['from', 'to', 'weight', 'events.click', 'start_pipe','end_pipe', 'difference', 'diff_color'],
            data: dt2,
            type: 'sankey',
            name: null,
            nodes: nds,
            allowPointSelect: true,
            tooltip: tt
        }],

    });

}
};
looker.plugins.visualizations.add(viz);
}());
