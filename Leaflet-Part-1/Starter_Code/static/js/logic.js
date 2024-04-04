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

//Customize marker color based on depth
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

//Create Markers for map
d3.json(url).then(function (data){
    geojson = L.geoJson(data, {
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
// Define legend content
var legendContent = '<strong>Earthquake Depth Legend</strong><br>' +
    '<i style="background: Green"></i> Depth &lt; 11 km<br>' +
    '<i style="background: YellowGreen"></i> 11 km &le; Depth &lt; 31 km<br>' +
    '<i style="background: Yellow"></i> 31 km &le; Depth &lt; 51 km<br>' +
    '<i style="background: Orange"></i> 51 km &le; Depth &lt; 71 km<br>' +
    '<i style="background: OrangeRed"></i> 71 km &le; Depth &lt; 91 km<br>' +
    '<i style="background: Red"></i> Depth &ge; 91 km';

// Create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = legendContent;
  return div;
};

legend.addTo(myMap);

//Style Legend
var legendStyle = document.createElement('style');
legendStyle.innerHTML = '.legend i { display: inline-block; width: 20px; height: 20px; margin-right: 8px; }';
document.getElementsByTagName('head')[0].appendChild(legendStyle);
});
