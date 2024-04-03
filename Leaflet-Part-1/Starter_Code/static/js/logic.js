// url for dataset
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

//create map
let  myMap = L.map("map",{
    center : [0, 0],
    zoom : 1
});

//create base layer of map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Customize marker style based on magnitude
function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 9;
};

function markerColor(depth) {
    if (depth < 11) {
        color = "Green";
      } else if (depth < 31) {
        color = "YellowGreen";
      } else if (depth < 51) {
        color = "Yellow";
      } else if (depth < 71){
        color = "Orange";
      } else if  (depth < 91){
        color = "OrangeRed";
      } else {
        color = "Red"
      }
    return color
};

d3.json(url).then(function (data){
    L.geoJson(data, {
        style: function(feature) {
            return {
              radius: markerSize(feature.properties.mag),
              fillColor: markerColor(feature.geometry.coordinates[2]),
              color: markerColor(feature.geometry.coordinates[2]),
              opacity: 1,
              fillOpacity: 0.5
            };
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng).bindPopup(`<h1>Mag: ${feature.properties.mag}</h1> <hr> 
            <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}</h3> <hr> 
            <h3>Location: ${feature.geometry.coordinates.slice(0,2).toLocaleString()}`).addTo(myMap);;
        }
    })
});