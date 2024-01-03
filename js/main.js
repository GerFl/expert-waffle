// BEGIN
const fileInput = document.getElementById("csv-file");

let properties = [];
let leases = [];
let sales = [];
let vertexes = [];

// Map init
const map = L.map('map', {
    center: [25.680858669916173, -100.30201005332778],
    zoom: 14
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

//#region File handler
function fetchFileData() {
    const csv = fileInput.files[0];
    const fr = new FileReader();

    fr.onload = function (e) {
        // Read file data
        const data = e.target.result;

        // Split by line break and store in array
        let rows = data.split('\n');        
        properties = [];

        rows.forEach(row => {
            let obj = row.split(',');

            const property = {
                type: obj[0],
                latitude: obj[1],
                longitude: obj[2],
                address: obj[3],
                value: obj[4],
                description: obj[5],
                contact: obj[6]
            };

            properties.push(property);
        });

        leases = (properties.filter(x => x.type == "Lease"));
        sales = properties.filter(x => x.type == "Sale");
        vertexes = properties.filter(x => x.type == "Vertex");
        
        sketchMap();
    };

    fr.readAsText(csv);
}
//#endregion File handler

let searchArea;
let layerControl;
let leasesGroup;
let salesGroup;

function sketchMap() {

    let leasesMapObj = [];
    let salesMapObj = [];
    let vertexesMapObj = [];

    // Leases
    leases.forEach(lease => {
        leasesMapObj.push(L.marker([lease.latitude, lease.longitude]));
    });

    (leasesGroup) ? leasesGroup.remove() : '' ;
    leasesGroup = L.layerGroup(leasesMapObj).addTo(map);

    // Sales
    sales.forEach(sale => {
        salesMapObj.push(L.marker([sale.latitude, sale.longitude]),);
    });

    (salesGroup) ? salesGroup.remove() : '' ;
    salesGroup = L.layerGroup(salesMapObj).addTo(map);

    // Polygon
    vertexes.forEach(vertex => {
        vertexesMapObj.push([vertex.latitude, vertex.longitude]);
    });

    (searchArea) ? searchArea.remove() : '' ;
    searchArea = L.polygon(vertexesMapObj).addTo(map);

    map.fitBounds(searchArea.getBounds());
    searchArea.bindPopup("Aquí asaltan.");
    
    // Layers control
    let overlayMaps = {
        "Lease": leasesGroup,
        "Sale": salesGroup
    };
    
    (layerControl) ? layerControl.remove() : '' ;
    layerControl = L.control.layers(null, overlayMaps).addTo(map);
    
}