const d3 = require('d3');

const neighborhoodMap = d3.map();
const propertyMap = d3.map();


class PieChartVis {


    constructor(context) {

        //options
        var options = {
            onClick: graphClickEvent,
            // onClick: function(evt, item) {
            //     console.log();
            // },
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

        function graphClickEvent(event, item) {
            var neighborhood = this.data.labels[item[0]._index];
            console.log("starting ranked bar map...");
            d3.csv("listings_small.csv")
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
               });
               console.log(propertyMap);
            }


        return this.setDoughnutChartData(context, options);
    }



    // create 5 maps for each borough
    //key : property type
    // value: count

    // HELPER FUNCTION TO INITALIZE THE DATA
    setDoughnutChartData(context, options) {
        console.log("starting populating map...");
        d3.csv("listings_small.csv")
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

                // debugging prints
                colors = generateColorArray(neighborhoodMap.keys().length);
                

                // this.debuggingPrints();

                //doughnut chart data
                let chartData = {
                    labels: neighborhoodMap.keys(),
                    datasets: [
                        {
                            label: "TeamA Score",
                            data: neighborhoodMap.values(),
                            backgroundColor: colors,
                            borderColor: colors,
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

                // function onMouseover(e){
                //     alert("data");
                // }

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
        console.log("keys : " + neighborhoodMap.keys());
        console.log("keys length : " + neighborhoodMap.keys().length);
        console.log("values : " + neighborhoodMap.values());
        console.log("values length : " + neighborhoodMap.values().length);
    }


}



module.exports = PieChartVis;




