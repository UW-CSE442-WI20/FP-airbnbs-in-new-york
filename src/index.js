

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
  anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
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
  .attr("d", geoPath)
  .attr("id", function(d) {
    return d.properties.neighbourhood; // neighborhood name
  })
  .attr("class", function(d) {
    return d.properties.neighbourhood_group; // borough name
  })
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

  // Display the neighborhood and borough name on mouseover
  function handleMouseOver(d) {
    d3.select("p").text("Neighborhood: " + this.id + ", Borough: " + d.properties.neighbourhood_group);
  }

  function handleMouseOut(d) {
    d3.select("p").text("Neighborhood: none selected, Borough: none selected");
  }
