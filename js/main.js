import fetchFileData from './fetch-file.js';

(function() {
    "use strict";
    document.addEventListener('DOMContentLoaded', function() {

        //#region Map init and geolocation
        // Map init
        const map = L.map('map', {
            zoom: 14
        }).fitWorld();

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Geolocation
        map.locate({setView: true, maxZoom: 16});

        function onLocationFound(e) {
            let radius = e.accuracy;

            L.marker(e.latlng).addTo(map)
                .bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).setStyle({color: 'purple', fillColor: 'purple'}).addTo(map);
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message);
        }

        map.on('locationerror', onLocationError);
        //#endregion Map init and geolocation


        // BEGIN
        const fileInput = document.getElementById('csv-file');
        const readDataButton = document.getElementById('read-data-btn');
        readDataButton.addEventListener('click', e => {
            e.preventDefault();
            
            try {
                fetchFileData(fileInput, map);
            } catch (error) {
                console.log(error)
                alert("Ocurrió un error, revisar en consola.")
            }
        });
        

    }); // DOM CONTENT LOADED
})();