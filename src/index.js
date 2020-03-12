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
