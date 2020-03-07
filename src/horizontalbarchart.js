const d3 = require('d3');

class HorizontalBarChart {

    constructor(context, propertyMap) {

      console.log("creating horizontal bar chart");

      var colorArray = this.generateColorArray(propertyMap.keys().length);     

      propertyMap = this.sortMapByValues(propertyMap);
      
      // console.log("keys : " + propertyMap.keys());
      // console.log("values : " + propertyMap.values());


      // propertyMap = this.sortMapByValues(propertyMap);
      // console.log(sortedMap);


      
      var barChart = new Chart(context, {
        type: 'horizontalBar',
        data: {
          // labels: propertyMap.keys(),
          lablels: newArrayLabel,
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: colorArray,
              // data: propertyMap.values()
              data: newArrayData
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

    sortMapByValues(propertyMap) {
      console.log("keys : " + propertyMap.keys());
      console.log("value : " + propertyMap.values());

      arrayLabel = propertyMap.keys();
      arrayData = propertyMap.values();

      arrayOfObj = arrayLabel.map(function(d, i) {
        return {
          label: d,
          data: arrayData[i] || 0
        };
      });

      sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
        return b.data-a.data;
      });

      newArrayLabel = [];
      newArrayData = [];
      sortedArrayOfObj.forEach(function(d){
        newArrayLabel.push(d.label);
        newArrayData.push(d.data);
      });


      // console.log("newArrayLabel : " + newArrayLabel);
      // console.log("newArrayData : " + newArrayData);
      var newMap = new Map();
      for (var i in newMap.keys()) {
        newMap.put(newArrayLabel[i], newArrayData[i]);
      }

      console.log("new map : " + newMap);

    }



    

    sortMapByValues(myMap) {
      let ar = [...myMap.entries()];
      // sorty by value
      sortedArray = ar.sort((a, b) => b[1] - a[1]);
      sortedMap = new Map(sortedArray);
      console.log(sortedMap);

      // // sort by value
      // const mapSort1 = new Map([...propertyMap.entries()].sort((a, b) => b[1] - a[1]));
      // console.log(mapSort1);
      // // Map(4) {"c" => 4, "a" => 3, "d" => 2, "b" => 1}
      // return mapSort1;
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