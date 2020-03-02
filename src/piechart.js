const d3 = require('d3');

const propertyMap = d3.map();


class PieChartVis {


    constructor(context) {

        //options
        var options = {
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


        // return chart;
        return this.setDoughnutChartData(context, options);
    }


    // HELPER FUNCTION TO INITALIZE THE DATA
    setDoughnutChartData(context, options) {
        console.log("starting populating map...");
        d3.csv("listings_small.csv")
            .then((data) => {
                data.forEach(function (d) {
                    let key = d.property_type;
                    // let key = d.room_type;
                    if (propertyMap.has(key)) {
                        var value = propertyMap.get(key);
                        propertyMap.set(key, value + 1);
                    } else {
                        propertyMap.set(key, 1);
                    }
                });

                // debugging prints
                colors = generateColorArray(propertyMap.keys().length);

                propertyMap.set("other", 0);
                // iterate over propertyMap
                for (let key of propertyMap.keys()) {
                    let value = propertyMap.get(key);

                    // console.log("key : " + key);
                    // console.log("value : " + value);
                    if (value < 100) {
                        console.log("key : " + key + " value : " + value);
                        propertyMap.remove(key);
                        propertyMap.set("other", propertyMap.get("other") + value);
                    }
                }

                                this.debuggingPrints();



                //doughnut chart data
                let chartData = {
                    labels: propertyMap.keys(),
                    datasets: [
                        {
                            label: "TeamA Score",
                            data: propertyMap.values(),
                            backgroundColor: colors,
                            borderColor: colors,
                            borderWidth: Array(propertyMap.keys().length).fill(1)
                        }
                    ]
                };
        
                //create Chart class object
                var chart = new Chart(context, {
                    type: "doughnut",
                    data: chartData,
                    options: options
                });
                // return chartData;
                return chart;
            });

        // Helper function to generate an array of colors for pie chart data
        function generateColorArray(length) {
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


    // Helper method : debugg prints
    debuggingPrints() {
        console.log("keys : " + propertyMap.keys());
        console.log("keys length : " + propertyMap.keys().length);
        console.log("values : " + propertyMap.values());
        console.log("values length : " + propertyMap.values().length);
    }


}



module.exports = PieChartVis;




