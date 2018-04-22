looker.plugins.visualizations.add({
  id: "demo_viz",
  label: "Demo",
  create: function (element, config) {
    element.innerHTML = "<p id></p>";
  },
  update: function (data, element, config, queryResponse, details) {

    var html = "";
    for(var row of data) {
        var cell = row[queryResponse.fields.dimensions[0].name];
        html += LookerCharts.Utils.htmlForCell(cell);
    }
    element.innerHTML = html;

    // element.innerHTML = html;
    // $(document).ready(function() {
    //   $('#example').DataTable();
    // } );
  }
});