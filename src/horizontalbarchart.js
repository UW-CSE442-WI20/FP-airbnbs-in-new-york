const d3 = require('d3');
var TOPLISTINGS = 5;

class HorizontalBarChart {

  constructor(context, propertyMap) {

    console.log("creating horizontal bar chart");

    var colorArray = this.generateColorArray(propertyMap.keys().length);

    var map = this.sortMapByValuesAndTopListings(propertyMap);

    var barChart = new Chart(context, {
      type: 'horizontalBar',
      data: {
        labels: map.keys(),
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: colorArray,
            data: map.values()
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

  sortMapByValuesAndTopListings(propertyMap) {
    var arrayLabel = propertyMap.keys();
    var arrayData = propertyMap.values();

    var arrayOfObj = arrayLabel.map(function (d, i) {
      return {
        label: d,
        data: arrayData[i] || 0
      };
    });

    var sortedArrayOfObj = arrayOfObj.sort(function (a, b) {
      return b.data - a.data;
    });

    var newArrayLabel = [];
    var newArrayData = [];
    sortedArrayOfObj.forEach(function (d) {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });
    var newMap = d3.map();
    for (var i = 0; i < TOPLISTINGS; i++) {
      newMap.set(newArrayLabel[i], newArrayData[i]);
    }
    return newMap;
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