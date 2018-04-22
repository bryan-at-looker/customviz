looker.plugins.visualizations.add({
    id: "demo_viz",
    label: "Demo",
    create: function (element, config) {
        element.innerHTML = "<p></p>";
    },
    update: function (data, element, config, queryResponse, details) {
        var html = '<img style="width: 50%; height: 50%" src="https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?cs=srgb&dl=animal-animal-photography-cat-104827.jpg&fm=jpg"/></br><table id="table_id" class="display"></table>';
        element.innerHTML = html;
        $(document).ready( function () {
             $('#table_id').DataTable();
        } );
    }
});