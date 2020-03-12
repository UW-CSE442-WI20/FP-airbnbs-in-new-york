const d3 = require('d3');
let HorizontalBarChart = require('./horizontalbarchart');
const colorPalette = ['#d3d3d3', '#e08984', '#bf809b', '#65c1cf', '#5374a6', '#776399'];
let city = "New York"

class PieChartVis {


    constructor(city) {
        var self = this;
        this.city = city;


        var listings_csv = "listings_small.csv"; // New York by default        
        if (this.city === "Seattle") {
            listings_csv = "listings_small_seattle.csv";
        } else if (this.city === "Austin") {
            listings_csv = "listings_small_austin.csv";
        } else if (this.city === "San Francisco") {
            listings_csv = "listings_small_sf.csv";
        } else if (this.city === "New Orleans") {
            listings_csv = "listings_small_nola.csv";
        } else if (this.city == "Honolulu") { // use neighborhoods
            listings_csv = "listings_hono.csv";
        }

          console.log("listings_csv : " + listings_csv);
          console.log("listings_csv : " + city);


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

        return self.setDoughnutChartData(listings_csv, options);

        function graphClickEvent(event, item) {
            var neighbourhood = this.data.labels[item[0]._index];
            console.log("neighborhood : " + neighbourhood);
            var propertyMap = d3.map();
            console.log("graphClickEvent propertyMap : " + propertyMap);
            d3.csv(listings_csv)
                .then((data) => {
                    data.forEach(function (d) {      
                        console.log("property_type : " + d.property_type);        
                        if (d.neighbourhood_group == neighbourhood) {
                            let key = d.property_type;
                            if (propertyMap.has(key)) {
                                var value = propertyMap.get(key);
                                propertyMap.set(key, value + 1);
                            } else {
                                propertyMap.set(key, 1);
                            }
                        }
                    });
                    $("#horizontal-bar-chart-canvas").remove();
                    $('#horizontal-bar-chart-container').append('<canvas id="horizontal-bar-chart-canvas"></canvas>');            
                    var horizontalBarChart = new HorizontalBarChart(propertyMap);
                });
        };
    }
    // HELPER FUNCTION TO INITALIZE THE DATA
    setDoughnutChartData(listings_csv, options) {
        resetPieChart();
        console.log("setDoughnutChartData listings_csv : " + listings_csv);
        var neighbourhoodMap = d3.map();

        d3.csv(listings_csv)
            .then((data) => {
                data.forEach(function (d) {
                    let key = d.neighbourhood_group;

                    if (neighbourhoodMap.has(key)) {
                        var value = neighbourhoodMap.get(key);
                        neighbourhoodMap.set(key, value + 1);
                    } else {
                        neighbourhoodMap.set(key, 1);
                    }
                });
                
                colors = generateColorArray(neighbourhoodMap.keys().length);

                //doughnut chart data
                let chartData = {
                    labels: neighbourhoodMap.keys(),
                    datasets: [
                        {
                            label: "TeamA Score",
                            data: neighbourhoodMap.values(),
                            // backgroundColor: colorPalette,
                            // borderColor: colorPalette,
                            backgroundColor: colors,
                            borderColor: colors,
                            borderWidth: Array(neighbourhoodMap.keys().length).fill(1)
                        }
                    ]
                };
        
                var context = $("#doughnut-chartcanvas-1");
                //create Chart class object
                var chart = new Chart(context, {
                    type: "doughnut",
                    data: chartData,
                    options: options
                });
                return chart;
            });

        function resetPieChart() {
            $("#doughnut-chartcanvas-1").remove();// remove <canvas> element
            $('#doughnut-chart-container').append('<canvas id="doughnut-chartcanvas-1"></canvas>');
        }
    
        // Helper function to generate an array of colors for pie chart data
        function generateColorArray(length) {
            var colors = [];
            while (colors.length < length) {
                do {
                    var color = Math.floor((Math.random() * 1000000) + 1);
                } while (colors.indexOf(color) >= 0);
                colors.push("#" + ("000000" + color.toString(16)).slice(-6));
            }
            return colors;
        }
    

    }

}

module.exports = PieChartVis;
