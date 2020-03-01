const d3 = require('d3');


    populateMap();

    //get the doughnut chart canvas
    var ctx1 = $("#doughnut-chartcanvas-1");
    var ctx2 = $("#doughnut-chartcanvas-2");
  
    //doughnut chart data
    var data1 = {
        labels: ["match1", "match2", "match3", "match4", "match5"],
        datasets: [
            {
                label: "TeamA Score",
                data: [10, 50, 25, 70, 40],
                backgroundColor: [
                    "#DEB887",
                    "#A9A9A9",
                    "#DC143C",
                    "#F4A460",
                    "#2E8B57"
                ],
                borderColor: [
                    "#CDA776",
                    "#989898",
                    "#CB252B",
                    "#E39371",
                    "#1D7A46"
                ],
                borderWidth: [1, 1, 1, 1, 1]
            }
        ]
    };
  
    //doughnut chart data
    var data2 = {
        labels: ["match1", "match2", "match3", "match4", "match5"],
        datasets: [
            {
                label: "TeamB Score",
                data: [20, 35, 40, 60, 50],
                backgroundColor: [
                    "#FAEBD7",
                    "#DCDCDC",
                    "#E9967A",
                    "#F5DEB3",
                    "#9ACD32"
                ],
                borderColor: [
                    "#E9DAC6",
                    "#CBCBCB",
                    "#D88569",
                    "#E4CDA2",
                    "#89BC21"
                ],
                borderWidth: [1, 1, 1, 1, 1]
            }
        ]
    };
  
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
  
    //create Chart class object
    var chart1 = new Chart(ctx1, {
        type: "doughnut",
        data: data1,
        options: options
    });
  
    //create Chart class object
    var chart2 = new Chart(ctx2, {
        type: "doughnut",
        data: data2,
        options: options
    });


function populateMap() {
    let propertyMap = new Map();

// d3.csv("./data/listings.csv")
// .then((data) => {
//     // console.log(data);
//     data.forEach(function(d) {
//         let property_type = d.property_type;
//         console.log(property_type);
//     });


    d3.csv("./data/listings.csv", function(d){
        return {
            property_type: d.property_type
        };
    }, function(error, rows) {
        console.log(d[0]); //<-- this is the first row
    });
        
    // d3.csv("example.csv", function(d) {
    //     return {
    //       year: new Date(+d.Year, 0, 1), // convert "Year" column to Date
    //       make: d.Make,
    //       model: d.Model,
    //       length: +d.Length // convert "Length" column to number
    //     };
    //   }, function(error, rows) {
    //     console.log(rows);
    //   });


    d3.csv("/data/listings.csv")
    .then((data) => {
        data.forEach(function(d) {
            let property_type = d.property_type;
            console.log(property_type);
            switch (property_type) {
                case 'Apartment':
                    mapReplacement('Apartment', propertyMap);
                case 'Guest suite':
                    mapReplacement('Guest suite', propertyMap);
                case 'Loft':
                    mapReplacement('Loft', propertyMap);
                case 'Bed and breakfast':
                    mapReplacement('Bed and breakfast', propertyMap);
                case 'Condominium':
                    mapReplacement('Condominium', propertyMap);
                case 'House':
                    mapReplacement('House', propertyMap);
                case 'Townhouse':
                    mapReplacement('Townhouse', propertyMap);

                default:
                  console.log('Missed this property type: ' + property_type);
              }
            });
      });
    // print the result
    for (let key of propertyMap.keys()) {
        console.log("property: " + key);
        console.log("count : " + propertyMap.get(key));
        console.log();
  }
}


function mapReplacement (property_type, propertyMap) {
    if (propertyMap.get(property_type) == null){
        propertyMap.set(property_type, 1);
    } else {
        propertyMap.set(property_type, propertyMap.get(property_type) + 1);
    }
}

