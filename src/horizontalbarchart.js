const d3 = require('d3');

class HorizontalBarChart {

    constructor(context, propertyMap) {

      console.log("creating horizontal bar chart");
      console.log("propertyMap : " + propertyMap);

      var colorArray = this.generateColorArray(propertyMap.keys().length);     

      console.log("keys : " + propertyMap.keys());
      console.log("values : " + propertyMap.values());


      
      var barChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
          labels: propertyMap.keys(),
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: colorArray,
              data: propertyMap.values()
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });

    return barChart;
    }

    // Helper function to generate an array of colors for pie chart data
    generateColorArray(length) {
      var colors = [];
      while (colors.length < length) {
          do {
              var color = Math.floor((Math.random() * 1000000) + 1);
          } while (colors.indexOf(color) >= 0);
          colors.push("#" + ("000000" + color.toString(16)).slice(-6));
      }
      return colors
    }

}



module.exports = HorizontalBarChart;