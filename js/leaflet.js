"use strict"

//#region Variables and object declarations
let leases = [];
let sales = [];
let vertexes = [];

let searchArea;
let layerControl;
let leasesGroup;
let salesGroup;

let leaseIcon = L.icon({
    iconUrl: './../img/leaf-green.png',
    shadowUrl: './../img/leaf-shadow.png',
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

let saleIcon = L.icon({
    iconUrl: './../img/leaf-red.png',
    shadowUrl: './../img/leaf-shadow.png',
    iconSize:     [38, 95],
    shadowSize:   [50, 64],
    iconAnchor:   [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor:  [-3, -76]
});
//#endregion Variables and objects declaration


function sketchMap(map, properties) {

    leases = (properties.filter(x => x.type == "Lease"));
    sales = properties.filter(x => x.type == "Sale");
    vertexes = properties.filter(x => x.type == "Vertex");

    let leasesMapObj = [];
    let salesMapObj = [];
    let vertexesMapObj = [];

    // Leases markers
    leases.forEach(lease => {
        leasesMapObj.push(
            L.marker(
                [lease.latitude, lease.longitude],
                { icon: leaseIcon }
            )
            .bindTooltip(`
                <img class="marker-image" src="${lease.image}" alt="">
                ${lease.value}
                <br>
                ${lease.address}
                <br>
                ${lease.contact}
            `)
        );
    });

    (leasesGroup) ? leasesGroup.remove() : '' ;
    leasesGroup = L.layerGroup(leasesMapObj).addTo(map);


    // Sales markers
    sales.forEach(sale => {
        salesMapObj.push(
            L.marker(
                [sale.latitude, sale.longitude],
                { icon: saleIcon }
            )
            .bindTooltip(`
                <img class="marker-image" src="${sale.image}" alt="">
                ${sale.value}
                <br>
                ${sale.address}
                <br>
                ${sale.contact}
            `)
        );
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

export default sketchMap;