const d3 = require('d3');

var highlighted = null;
var selectedCity = 'New York';

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

var ctx4 = document.getElementById('barchart-chartcanvas-4');
var name4 = 'San Franciso';
const sfcount = d3.csv("listings_small_sf.csv").then(processData);
sfcount.then(function(value) {
    makeChart(value, ctx4, name4);
});

var ctx5 = document.getElementById('barchart-chartcanvas-5');
var name5 = 'New Orleans';
const nolacount = d3.csv("listings_small_nola.csv").then(processData);
nolacount.then(function(value) {
    makeChart(value, ctx5, name5);
});

var ctx6 = document.getElementById('barchart-chartcanvas-6');
var name6 = 'Austin';
const austincount = d3.csv("listings_small_austin.csv").then(processData);
austincount.then(function(value) {
    makeChart(value, ctx6, name6);
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
                label: '',
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
            title: {
                display: true,
                fontColor: '#000',
                fontSize: 16,
                text: name
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 40000
                    }
                }]
            },
            events: ['click'],
            
            onClick:  (evt, item) => { 
               if(highlighted != null){
                    highlighted.options.title.fontColor= '#000';
                    highlighted.update();
               }
                myChart.options.title.fontColor= '#00A699';
                myChart.update();
                highlighted = myChart;
                selectedCity = myChart.options.title.text;
            }
        }
    });
}