const d3 = require('d3');
// export class HorizontalBarChart {...}
let HorizontalBarChart = require('./horizontalbarchart');
let city = "New York"; // default
const colorPalette = ['#d3d3d3', '#e08984', '#bf809b', '#65c1cf', '#5374a6', '#776399'];
let selectedCSVPath = "listings_small.csv"
const neighborhoodMap = d3.map();

class PieChartVis {
    constructor(context) {

        //options
        var options = {
            onClick: graphClickEvent,
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Doughnut Chart",
                fontSize: 18,
                fontColor: "#111"
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16
                }
            }
        };
        this.setSelectedCSVPath();

        function graphClickEvent(event, item) {
            var neighborhood = this.data.labels[item[0]._index];
            // console.log("neighborhood : " + neighborhood);
            console.log("starting horizontal bar map...");
            var propertyMap = d3.map();
            d3.csv(selectedCSVPath)
                .then((data) => {
                    data.forEach(function (d) {
                        if (d.neighbourhood_group == neighborhood) {
                            let key = d.property_type;
                            if (propertyMap.has(key)) {
                                var value = propertyMap.get(key);
                                propertyMap.set(key, value + 1);
                            } else {
                                propertyMap.set(key, 1);
                            }
                        }
                    });

                    propertyMap = sortMapByValues(propertyMap);

                    function sortMapByValues(propertyMap){
                        var arrayLabel = propertyMap.keys();
                        var arrayData = propertyMap.values();
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
                        var map = d3.map();
                        for (var i = 0; i < newArrayLabel.length; i++) {
                            map.set(newArrayLabel[i], newArrayData[i]);
                        }
                        return map;
                    }
                    var ctx = $("#horizontal-bar-chart-canvas");
                    const horizontalBarChart = new HorizontalBarChart(ctx, propertyMap);
                });
        };
        return this.setDoughnutChartData(context, options);
    }

    setSelectedCSVPath() {
        switch (this.city) {
            case "Seattle":
                this.selectedCSVPath = "listings_seattle.csv";
                break;
            case "Austin":
                this.selectedCSVPath = "listings_small_austin.csv";
                break;
            case "San Francisco":
                this.selectedCSVPath = "listings_small_sf.csv";
                break;
            case "New Orleans":
                this.selectedCSVPath = "listings_small_nola.csv";
                break;
            default:
                this.selectedCSVPath = "listings_small.csv";
        }
    }


// HELPER FUNCTION TO INITALIZE THE DATA
setDoughnutChartData(context, options) {
    console.log("starting populating map...");
    d3.csv(selectedCSVPath)
        .then((data) => {
            data.forEach(function (d) {
                let key = d.neighbourhood_group;
                if (neighborhoodMap.has(key)) {
                    var value = neighborhoodMap.get(key);
                    neighborhoodMap.set(key, value + 1);
                } else {
                    neighborhoodMap.set(key, 1);
                }
            });

            //doughnut chart data
            let chartData = {
                labels: neighborhoodMap.keys(),
                datasets: [
                    {
                        label: "TeamA Score",
                        data: neighborhoodMap.values(),
                        backgroundColor: colorPalette,
                        borderColor: colorPalette,
                        borderWidth: Array(neighborhoodMap.keys().length).fill(1)
                    }
                ]
            };

            //create Chart class object
            var chart = new Chart(context, {
                type: "doughnut",
                data: chartData,
                options: options
            });
            return chart;
        });
}


    // Helper method : debugg prints
    debuggingPrints() {
        console.log("keys : " + neighborhoodMap.keys());
        console.log("keys length : " + neighborhoodMap.keys().length);
        console.log("values : " + neighborhoodMap.values());
        console.log("values length : " + neighborhoodMap.values().length);
    }

}


module.exports = PieChartVis;




