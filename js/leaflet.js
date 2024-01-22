"use strict"

//#region Variables and object declarations
let leases = [];
let sales = [];
let houses = [];
let vertexes = [];

let searchArea;
let layerControl;
let leasesGroup;
let salesGroup;

let leaseIcon = L.icon({
    iconUrl: './../img/lease-01.png',
    iconSize:     [80, 40], // size of the icon
    iconAnchor:   [40, 40], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

let saleIcon = L.icon({
    iconUrl: './../img/sale-01.png',
    iconSize:     [80, 40],
    iconAnchor:   [40,40],
    popupAnchor:  [-3, -76]
});
//#endregion Variables and objects declaration


function sketchMap(map, properties) {
    houses = properties.filter(x => x.type == "Lease" || x.type == "Sale");
    leases = (properties.filter(x => x.type == "Lease"));
    sales = properties.filter(x => x.type == "Sale");

    let leasesMapObj = [];
    let salesMapObj = [];
    let vertexesMapObj = [];

    let valuesLeases = [];
    let valuesSales = [];

    // Leases markers
    leases.forEach(lease => {
        leasesMapObj.push(
            L.marker([lease.latitude, lease.longitude], { icon: leaseIcon })
            .bindTooltip(`
                <img class="marker-image" src="${lease.image}" alt="">
                $${lease.value} <br>
                ${lease.address} <br>
                ${lease.contact}
            `)
        );

        (!isNaN(parseInt(lease.value))) ? valuesLeases.push(parseInt(lease.value)) : '';
    });

    (leasesGroup) ? leasesGroup.remove() : '' ;
    leasesGroup = L.layerGroup(leasesMapObj).addTo(map);


    // Sales markers
    sales.forEach(sale => {
        salesMapObj.push(
            L.marker([sale.latitude, sale.longitude], { icon: saleIcon })
            .bindTooltip(`
                <img class="marker-image" src="${sale.image}" alt="">
                $${sale.value} <br>
                ${sale.address} <br>
                ${sale.contact}
            `)
        );

        (!isNaN(parseInt(sale.value))) ? valuesSales.push(parseInt(sale.value)) : '';
    });

    (salesGroup) ? salesGroup.remove() : '' ;
    salesGroup = L.layerGroup(salesMapObj).addTo(map);


    // Polygon
    let area = houses.map((house) => L.latLng(house.latitude, house.longitude));
    let areaBounds = L.latLngBounds(area);

    vertexes = [areaBounds.getNorthEast(), areaBounds.getSouthEast(),
                areaBounds.getSouthWest(), areaBounds.getNorthWest()];

    vertexesMapObj = vertexes.map((vertex) => [vertex.lat, vertex.lng]);

    (searchArea) ? searchArea.remove() : '' ;
    searchArea = L.polygon(vertexesMapObj).addTo(map);

    map.fitBounds(searchArea.getBounds());
    
    searchArea.bindPopup(`
        LEASE (${leases.length} properties) <br>
        Max: $${Math.max(...valuesLeases) | 0} <br>
        Min: $${Math.min(...valuesLeases) | 0} <br> <br>
        SALE (${sales.length} properties) <br>
        Max: $${Math.max(...valuesSales) | 0} <br>
        Min: $${Math.min(...valuesSales) | 0} <br>
    `);
    

    // Layers control
    let overlayMaps = {
        "Lease": leasesGroup,
        "Sale": salesGroup
    };

    (layerControl) ? layerControl.remove() : '' ;
    layerControl = L.control.layers(null, overlayMaps).addTo(map);
    
}

export default sketchMap;