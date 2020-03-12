const d3 = require('d3');
var TOPLISTINGS = 5;
const colorPalette = ['#310A31', '#847996', '#88B7B5', '#A7CAB1', '#F4ECD6']


class HorizontalBarChart {

  constructor(propertyMap, neighbourhood) {
    console.log("neighbourhood : " + neighbourhood);

    var self = this;
    var propertyMap = self.sortMapByValuesAndTopListings(propertyMap);

    console.log("keys :" + propertyMap.keys());
    console.log("values :" + propertyMap.values());

    var context  = $("#horizontal-bar-chart-canvas");
    var barChart = new Chart(context, {
      type: 'horizontalBar',
      data: {
        labels: propertyMap.keys(),
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: colorPalette,
            data: propertyMap.values()
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 13,
              labelString: 'Counts'
            }
          }]
        },
        legend: { display: false },
        title: {
          display: true,
          text: neighbourhood + "\'s Top Five Property Types",
          fontSize: 20,
          fontColor: "#111"
        }
      }
    });
    return barChart;

  }

  sortMapByValuesAndTopListings(propertyMap) {
    TOPLISTINGS = 5;
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
      if (newArrayLabel[i] == 'NA') {
        TOPLISTINGS++;
      } else {
        newMap.set(newArrayLabel[i], newArrayData[i]);
      }
    }
    return newMap;
  }
}

module.exports = HorizontalBarChart;