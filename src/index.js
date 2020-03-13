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
const PieChart = require('./piechart');
const mypiechart = new PieChart("New York");
var index = 0;

//draw airbnb logo
var svgContainer = d3.select(".logo")
        .append("svg")
        .attr("width", 700)
        .attr("height", 700);
    var yCoord = 250;
    var xCoord = 350;

    var x = 0;
    var y = 0

    for (var i = 0; i < 40; i++) {
    	x = i;
    	y = Math.sqrt(40*40 - (x*x));
        drawCircles(xCoord + x, yCoord - y);
    }

    var tempx = xCoord + x;
    var tempy = yCoord - y;
    for (var i = 0; i < 13; i++) {
    	x = tempx + i*(0.1);
    	y = tempy + i;
        drawCircles(x, y);

    }

    var radius = 40;
    for (var i = 40; i > 10; i--) {
    	x = i;
    	y = Math.sqrt(radius*radius - (x*x));
        drawCircles(xCoord + x, yCoord + y - 3);
        radius  = radius + 0.75;
    }
    xCoord = xCoord + x;
    yCoord = yCoord + y - 3;

    for (var i = 0; i < 31; i++) {
    	var x = i;
    	var y = 1.0 * x;
        drawCircles(xCoord - x, yCoord + y);
    }

    xCoord = 270;
    yCoord = 420 - 100;

    var tempCord = xCoord + x

    radius = 61.5;

    for (var i = 58; i > -21; i--) {
    	x = i;
    	y = Math.sqrt(radius*radius - (x*x));
        drawCircles(xCoord + x, yCoord + y);
        radius  = radius - 0.5;

    }
    yCoord = yCoord + 15;
    for (var i = -20; i < -15; i++) {
    	x = i;
    	y = Math.sqrt(radius*radius - (x*x));
        drawCircles(xCoord + x, yCoord - y);
        radius  = radius + 1.8;
    }

    xCoord = xCoord + x;
    yCoord = yCoord - y;

    for (var i = 0; i < 60; i++) {
    	var x = i;
    	var y = 2.85*x;
       	drawCircles(xCoord + x, yCoord - y);
    }

    xCoord = 350;
    yCoord = 155;

    radius = 39;
    for (var i = -37; i < -5; i++) {
    	x = i;
    	y = Math.sqrt(radius*radius - (x*x));
        radius  = radius - 0.25;
        drawCircles(xCoord + x, yCoord - y);
    }
    xCoord = xCoord + x;
    yCoord = yCoord - y;
    for (var i = 0; i < 5; i++) {
    	x = i;
        drawCircles(xCoord + x, yCoord);
    }

function drawCircles(x, y){
	var circle = svgContainer.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 8)
            .style("opacity", 0)
            .style("fill", "#FF5A5F")
	var newX = 350 - (x - 350);
	var circleMirror = svgContainer.append("circle")
            .attr("cx", newX)
            .attr("cy", y)
            .attr("r", 8)
            .style("opacity", 0)
            .style("fill", "#FF5A5F")
    circle  // adds circle by circle after delay
	.transition()
	.delay(2000 + index*15)
	.style('opacity',1)
	index ++;
	circleMirror  // adds circle by for mirror circle after delay
	.transition()
	.delay(2000 + index*15)
	.style('opacity',1)
	index ++;
}
// listings csv includes id, name, host_id, host_name, neighbourhood_group, neigbourhood,
// latitude, longitude, room_type, price, minimum_nights, number_of_reviews, last_review,
// reviews_per_month, calculated_host_listings_count, property_type, guests_included, amenities
// d3.csv("listings_small.csv")
//   .then((data) => {
//     console.log('Dynamically loaded CSV data', data);
// })

$('#fullpage').fullpage({
  anchors: ['home', 'cities', 'map', 'property'],
  navigation: true,
  navigationPosition: 'right',
  verticallyCentered: false,
  navigationTooltips: ['Home', 'Select a City', 'Map of Listings', 'Property Types']
});
