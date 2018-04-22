looker.plugins.visualizations.add({
  id: "demo_viz",
  label: "Demo",
  create: function (element, config) {
    element.innerHTML = "<p></p>";
  },
  update: function (data, element, config, queryResponse, details) {

    var html = '<table id="example" style="width:100%">';

    html += '<thead><tr>';

    html += '<th>Close Date</th>';

    html += '</tr></thead>'

    html += '<tbody>';

    for(var row of data) {
        var cell = row[queryResponse.fields.dimensions[0].name];
        html += '<tr><td>'
        html += LookerCharts.Utils.htmlForCell(cell);
        html += '</td></tr>'
    }
    
    var html += '</tbody>';

    var html += '</table>';

    element.innerHTML = html;

    $(document).ready(function() {
      $('#example').DataTable();
    } );
  }
});