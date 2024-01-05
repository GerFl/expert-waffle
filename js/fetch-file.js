import sketchMap from './leaflet.js';
"use strict"

let properties = [];

//#region File handler
function fetchFileData(fileInput, map) {
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
                contact: obj[6],
                image: obj[7]
            };

            properties.push(property);
        });

        sketchMap(map, properties);
    };

    fr.readAsText(csv);
}
//#endregion File handler

export default fetchFileData;