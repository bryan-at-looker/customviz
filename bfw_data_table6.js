looker.plugins.visualizations.add({
  id: "demo_viz",
  label: "Demo",
  create: function (element, config) {
    element.innerHTML = "<p></p>";
  },
  update: function (data, element, config, queryResponse, details) {
    console.log(data)
    console.log(queryResponse)

    var num_cols = queryResponse.fields.dimension.length


    var html = '<table id="example" style="width:100%">';

    html += '<thead><tr>';

    for(var cols of queryResponse.fields.dimension) {
        html += '<th>';
        html += cols.name;
        html += '</th>';
    }

    html += '</tr></thead>';

    html += '<tbody>';

    for(var row of data) {
        html += '<tr>';
        for (i = 0; i < num_cols; i++) {
            var cell = row[queryResponse.fields.dimensions[i].name];
            html += '<td>';
            html += LookerCharts.Utils.htmlForCell(cell);
            html += '</td>';
        }
        html += '</tr>';   
    }
    
    html += '</tbody>';

    html += '</table>';

    element.innerHTML = html;

    $(document).ready(function() {
      $('#example').DataTable();
    } );
  }
});