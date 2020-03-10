const d3 = require('d3');
let HorizontalBarChart = require('./horizontalbarchart');
const neighborhoodMap = d3.map();
const colorPalette = ['#d3d3d3', '#e08984', '#bf809b', '#65c1cf', '#5374a6', '#776399'];


class PieChartVis {


    constructor(city) {
        var self = this;
        this.city = city;

        var listings_csv = "listings_small.csv";
        if (this.city === "Seattle") {
            listings_csv = "listings_seattle.csv";
          } else if (this.city === "Austin") {
            listings_csv = "listings_small_austin.csv";
          } else if (this.city === "San Francisco") {
            listings_csv = "listings_small_sf.csv";
          } else if (this.city === "New Orleans") {
            listings_csv = "listings_small_nola.csv";
          }
          console.log("listings_csv : " + listings_csv);

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

        function graphClickEvent(event, item) {
            var neighborhood = this.data.labels[item[0]._index];
            console.log("neighborhood : " + neighborhood);
            console.log("starting horizontal bar map...");
            var propertyMap = d3.map();
            d3.csv(listings_csv)
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
                    var ctx  = $("#horizontal-bar-chart-canvas");
                    const horizontalBarChart = new HorizontalBarChart(ctx, propertyMap);
                });
        };
        return self.setDoughnutChartData(listings_csv, options);
    }


    // HELPER FUNCTION TO INITALIZE THE DATA
    setDoughnutChartData(listings_csv, options) {
        var context = $("#doughnut-chartcanvas-1");
        console.log("starting populating map...");
        d3.csv(listings_csv)
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
                // this.debuggingPrints();

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

}

module.exports = PieChartVis;
