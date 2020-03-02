const d3 = require('d3');

var ctx1 = document.getElementById('barchart-chartcanvas-1');
var name1 = 'New York';
const nycount = d3.csv("listings_small.csv").then(processData);
nycount.then(function(value) {
    makeChart(value, ctx1, name1);
});

var ctx2 = document.getElementById('barchart-chartcanvas-2');
var name2 = 'Seattle';
const seattlecount = d3.csv("listings_seattle.csv").then(processData);
seattlecount.then(function(value) {
    makeChart(value, ctx2, name2);
});

var ctx3 = document.getElementById('barchart-chartcanvas-3');
var name3 = 'Honolulu';
const honolulucount = d3.csv("listings_hono.csv").then(processData);
honolulucount.then(function(value) {
    makeChart(value, ctx3, name3);
});

function processData (data) {
  var nyCount = new Array(0, 0, 0, 0, 0, 0);
    data.forEach(function(d) {
        let guests_included = d.guests_included;
        if(guests_included >= 6){
            nyCount[5] = nyCount[5] + 1;
        } else {
            nyCount[guests_included - 1] = nyCount[guests_included - 1] + 1;
        }
    });
    return nyCount;
}
function makeChart(count, ctx, name) {
    var myChart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: ['1' , '2', '3', '4', '5', '6+'],
            datasets: [{
                label: name,
                data: count,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}