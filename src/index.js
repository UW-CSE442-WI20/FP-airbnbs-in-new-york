

// You can require libraries
const d3 = require('d3')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();


// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');
const neighborhoods = require('../data/neighbourhoods.geo.json');

const mapWidth = 600;
const mapHeight = 600;

// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('carbon-emissions.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
  })

$('#fullpage').fullpage({
    anchors:['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
    navigation: true,
	navigationPosition: 'right'
});

var projection = d3.geoMercator()
.center([-73.94, 40.70])
	.scale(60000)
	.translate([mapWidth / 2, mapHeight / 2]);
var geoPath = d3.geoPath().projection(projection);

d3.select("#map-svg").selectAll("path")
    .data(neighborhoods.features)
    .enter()
    .append('path')
    .attr("d", geoPath);
