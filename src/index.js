const d3 = require('d3')
const tipsy = require('jquery.tipsy') // for tooltip

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

// Draw map
const Map = require('./map');
const myMap = new Map();
myMap.drawMap();
myMap.drawListingPoints();

// listings csv includes id, name, host_id, host_name, neighbourhood_group, neigbhorhood,
// latitude, longitude, room_type, price, minimum_nights, number_of_reviews, last_review,
// reviews_per_month, calculated_host_listings_count, property_type, guests_included, amenities
// d3.csv("listings_small.csv")
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
// })

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
  .style("stroke", "#ffffff") // set outline to be white
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

  // Display the neighborhood and borough name on mouseover
  function handleMouseOver(d) {
    d3.select(this).style("fill", "#d2b48c");
    d3.select("p").text("Neighborhood: " + this.id + ", Borough: " + d.properties.neighbourhood_group);
  }

  // Reset the visual to black fill on mouseout
  function handleMouseOut(d) {
    d3.select(this).style("fill", "black");
    d3.select("p").text("Neighborhood: none selected, Borough: none selected");
  }

$('svg path').tipsy({
    gravity: 'w',
    html: true,
    title: function () {
      var d = this.__data__;
      return 'Neighborhood: ' + this.id + '<br>' + 'Borough: ' + d.properties.neighbourhood_group;
  }
});


