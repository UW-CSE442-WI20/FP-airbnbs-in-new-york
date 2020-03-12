const d3 = require('d3');
let HorizontalBarChart = require('./horizontalbarchart');
const colorPalette = ['#e08984', '#bf809b', '#65c1cf', '#5374a6', '#776399','#C0CAAD','#9DA9A0','#654c4F','#B26E63','#CEC075','#989788','#51344D','#6F5060','#A78682',
'#E7EBC5','#B3001B','#262626','#255C99','#7EA3CC','#CCAD8F','#F7B801','#F18701','#F35B04',
'#FFC4EB','#F39C6B','#FFE4FA','#3B1C32'];


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
                text: this.city + "\'s Breakdown of Airbnb Listings",
                fontSize: 25,
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
            var propertyMap = d3.map();
            console.log("graphClickEvent propertyMap : " + propertyMap);
            d3.csv(listings_csv)
                .then((data) => {
                    data.forEach(function (d) {      
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
          
                    var horizontalBarChart = new HorizontalBarChart(propertyMap, neighbourhood);
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

                    console.log("key : " + key);

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
            return colorPalette.slice(0, length);
        }
    

    }

}

module.exports = PieChartVis;
