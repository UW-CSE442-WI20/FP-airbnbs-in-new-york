const d3 = require('d3')
const tipsy = require('jquery.tipsy') // for tooltip



// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

// Draw map
const MapVis = require('./map');
const myMap = new MapVis("New York");

// draw pie chart
const pieChart = require('./piechart');

//get the doughnut chart canvas
var ctx1 = $("#doughnut-chartcanvas-1");
const chart1 = new pieChart(ctx1);


var canvas = document.getElementById("doughnut-chartcanvas-1");
var ctx = canvas.getContext("2d");


// ctx1.onclick = function(evt) {
//   var activePoints = chart1.getElementsAtEvent(evt);
//   if (activePoints[0]) {
//      var chartData = activePoints[0]['_chart'].config.data;
//      var idx = activePoints[0]['_index'];

//      var label = chartData.labels[idx];
//      var value = chartData.datasets[0].data[idx];

//      alert(label + ' ' + value); //Or any other function you want to execute. I sent the data to the server, and used the response i got from the server to create a new chart in a Bootstrap modal.
//    }
//  };


// Working on adding click events on pie charts


// $("#doughnut-chartcanvas-1").on("click", handlePathClick);

// d3.select("#doughnut-chartcanvas-1").selectAll("borough")
//   .append("borough")
//   .attr("id", function(d) {
//     return d.properties.neighbourhood_group; // borough name
//   })
//   .on("mouseover", handleMouseOver)
//   .on("click", handlePathClick)

//   // Display the neighborhood and borough name on mouseover
//   function handleMouseOver(d) {
//     d3.select("#selection").text("Borough: " + d.properties.neighbourhood_group);
//   }
  
//   function handlePathClick(d) {
//     // d3.select(this).style("outline", "none");
//   }

var ctx2 = $("#doughnut-chartcanvas-2");
//create Chart class object
const chart2 = new pieChart(ctx2);


// listings csv includes id, name, host_id, host_name, neighbourhood_group, neigbourhood,
// latitude, longitude, room_type, price, minimum_nights, number_of_reviews, last_review,
// reviews_per_month, calculated_host_listings_count, property_type, guests_included, amenities
// d3.csv("listings_small.csv")
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
// })

$('#fullpage').fullpage({
  anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
  navigation: true,
  navigationPosition: 'right',
  verticallyCentered: false,
  navigationTooltips: ['Home', 'Map of New York', 'Guests', 'Property Types']
});
