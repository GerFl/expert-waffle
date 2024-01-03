// BEGIN
//#region File handler
const fileInput = document.getElementById("csv-file");

let properties = [];
let leases = [];
let sales;

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

            const object = {
                tipo: obj[0],
                latitud: obj[1],
                longitud: obj[2],
                direccion: obj[3],
                precio: obj[4],
                descripcion: obj[5],
                contacto: obj[6]
            };

            properties.push(object);
        });
    };

    leases.push(properties.filter(x => x.tipo == "Renta"));
    sales = properties.filter(x => x.tipo == "Venta");
    fr.readAsText(csv);

}
//#endregion File handler

// Lease
var rentas = L.layerGroup([
]);
// Sale
var ventas = L.layerGroup([
]);

// Map & layers
const map = L.map('map', {
    zoom: 15,
    layers: [rentas, ventas]
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Layers control
var overlayMaps = {
    "Renta": rentas,
    "Venta": ventas
};
var layerControl = L.control.layers(null, overlayMaps).addTo(map);

// Polygon
var searchArea = L.polygon([
]).addTo(map);
searchArea.bindPopup("Aquí asaltan.");