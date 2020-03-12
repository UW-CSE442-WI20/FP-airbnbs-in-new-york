const d3 = require('d3');
const MapVis = require('./map');
const PieChartVis = require('./piechart');

var highlighted = null;
var selectedCity = 'New York';
var Charts = [];
var priceDistribList = [];
var peopleCountList = [];
var labelsPeople = ['1' , '2', '3', '4', '5', '6+'];
var labelsPrice = ['$50' , '$100', '$150', '$200', '$250', '$300+'];
var index = 0;
d3.select("#price").attr('checked', true);

var ctx1 = document.getElementById('barchart-chartcanvas-1');
var name1 = 'New York';
const nycount = d3.csv("listings_small.csv").then(processData);
const nyPeople = d3.csv("listings_small.csv").then(processDataPeople);
nycount.then(function(value) {
    Charts[0] = makeChart(value, ctx1, name1, true);
    priceDistribList[0] = value;
});
nyPeople.then(function(value) {
    peopleCountList [0] = value;
});

var ctx2 = document.getElementById('barchart-chartcanvas-2');
var name2 = 'Seattle';
const seattlecount = d3.csv("listings_seattle.csv").then(processData);
const seattlePeople = d3.csv("listings_seattle.csv").then(processDataPeople);
seattlecount.then(function(value) {
    Charts[1] = makeChart(value, ctx2, name2, false);
    priceDistribList[1] = value;
});
seattlePeople.then(function(value) {
    peopleCountList [1] = value;
});

var ctx3 = document.getElementById('barchart-chartcanvas-3');
var name3 = 'Honolulu';
const honolulucount = d3.csv("listings_hono.csv").then(processData);
const honoluluPeople = d3.csv("listings_hono.csv").then(processDataPeople);
honolulucount.then(function(value) {
    Charts[2] = makeChart(value, ctx3, name3, false);
    priceDistribList[2] = value;
});
honoluluPeople.then(function(value) {
    peopleCountList [2] = value;
});

var ctx4 = document.getElementById('barchart-chartcanvas-4');
var name4 = 'San Francisco';
const sfcount = d3.csv("listings_small_sf.csv").then(processData);
const sfPeople = d3.csv("listings_small_sf.csv").then(processDataPeople);
sfcount.then(function(value) {
    Charts[3] = makeChart(value, ctx4, name4, true);
    priceDistribList[3] = value;
});
sfPeople.then(function(value) {
    peopleCountList [3] = value;
});

var ctx5 = document.getElementById('barchart-chartcanvas-5');
var name5 = 'New Orleans';
const nolacount = d3.csv("listings_small_nola.csv").then(processData);
const nolaPeople = d3.csv("listings_small_nola.csv").then(processDataPeople);
nolacount.then(function(value) {
    Charts[4] = makeChart(value, ctx5, name5, false);
    priceDistribList[4] = value;
});
nolaPeople.then(function(value) {
    peopleCountList [4] = value;
});

var ctx6 = document.getElementById('barchart-chartcanvas-6');
var name6 = 'Austin';
const austincount = d3.csv("listings_small_austin.csv").then(processData);
const austinPeople = d3.csv("listings_small_austin.csv").then(processDataPeople);
austincount.then(function(value) {
    Charts[5] = makeChart(value, ctx6, name6, false);
    priceDistribList[5] = value;
});
austinPeople.then(function(value) {
    peopleCountList [5] = value;
});

listeners();

function processData (data) {
  var priceDistrib = new Array(0, 0, 0, 0, 0, 0);
  var total = 0;
    data.forEach(function(d) {
        let price = d.price;
        if(price >= 300){
            priceDistrib[5] = priceDistrib[5] + 1;
        } else if (price < 50) {
            priceDistrib[0] = priceDistrib[0]+1;
        } else if (price < 100) {
            priceDistrib[1] = priceDistrib[1]+1;
        } else if (price < 150) {
            priceDistrib[2] = priceDistrib[2]+1;
        }else if (price < 200) {
            priceDistrib[3] = priceDistrib[3]+1;
        } else if (price < 250) {
            priceDistrib[4] = priceDistrib[4]+1;
        }
        total += 1;
    });
    var i;
    for (i = 0; i < priceDistrib.length; i++) {
        priceDistrib[i] = Math.round((priceDistrib[i] / total)*100);
    }
    return priceDistrib;
}

function processDataPeople (data) {
  var peopleCount = new Array(0, 0, 0, 0, 0, 0);
  var total = 0;
    data.forEach(function(d) {
        let guests_included = d.guests_included;
        if(guests_included >= 6){
            peopleCount[5] = peopleCount[5] + 1;
        } else {
            peopleCount[guests_included - 1] = peopleCount[guests_included - 1] + 1;
        }
        total += 1;
    });

    var i;
    for (i = 0; i < peopleCount.length; i++) {
        peopleCount[i] = Math.round((peopleCount[i] / total)*100) ;
    }
    return peopleCount;
}
function makeChart(count, ctx, name, scale) {
    var myChart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: labelsPrice,
            datasets: [{
                label: '',
                data: count,
                backgroundColor: [
                    'rgba(0,166,153, 0.1)',
                    'rgba(0,166,153, 0.2)',
                    'rgba(0,166,153, 0.3)',
                    'rgba(0,166,153, 0.4)',
                    'rgba(0,166,153, 0.5)',
                    'rgba(0,166,153, 0.6)',
                ],
                borderColor: 'rgba(0,166,153, 1)',
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
                    gridLines: {
                     drawBorder: false,
                    },
                    ticks: {
                        callback: function(value, index, values) {
                        return value + '%' ;
                        },
                        display: scale,
                        beginAtZero: true,
                        suggestedMax: 50
                    },
                    scaleLabel: {
                        display: scale,
                        labelString: "Percent of Listings",
                    }
                }],
                xAxes: [{
                  gridLines: {
                    display: false
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
                var myMap = new MapVis(selectedCity);
                var myPieChart = new PieChartVis(selectedCity);
                $("#horizontal-bar-chart-canvas").remove();
                $('#horizontal-bar-chart-container').append('<canvas id="horizontal-bar-chart-canvas"></canvas>');  
                //window.location = "index.html#map"
            }
        }
    });
    return myChart;
}

ctx1.onmousemove = function(evt) {
    clearall(ctx6,ctx2,ctx3,ctx4,ctx5);
    select(ctx1);
}
ctx2.onmousemove = function(evt) {
    clearall(ctx6,ctx1,ctx3,ctx4,ctx5);
    select(ctx2);
}
ctx3.onmousemove = function(evt) {
    clearall(ctx6,ctx2,ctx1,ctx4,ctx5);
    select(ctx3);
}
ctx4.onmousemove = function(evt) {
    clearall(ctx6,ctx2,ctx3,ctx1,ctx5);
    select(ctx4);
}
ctx5.onmousemove = function(evt) {
    clearall(ctx6,ctx2,ctx3,ctx4,ctx1);
    select(ctx5);
}
ctx6.onmousemove = function(evt) {
    clearall(ctx1,ctx2,ctx3,ctx4,ctx5);
    select(ctx6);
}

function select(ctx1){
    var ctx = ctx1.getContext("2d");
    ctx.strokeStyle= 'rgba(186, 221, 217,1)';
    ctx.lineWidth = "2";
    ctx.rect(120, 3, 140, 29);
    ctx.stroke();
}

function clearall(cx1,cx2,cx3,cx4,cx5){
    clear(cx1);
    clear(cx2);
    clear(cx3);
    clear(cx4);
    clear(cx5);
}
function clear(ctx1){
    var ctx = ctx1.getContext("2d");
    ctx.strokeStyle = 'rgba(245,245,245, 1)';
    ctx.lineWidth = "3";
    ctx.rect(120, 3, 140, 29);
    ctx.stroke();
}

function listeners() {
    d3.select("#people").on("click", function() {
        var i;
        for(i = 0; i < Charts.length; i++){
            Charts[i].data.datasets[0].data = peopleCountList[i];
            Charts[i].data.labels = labelsPeople;
            Charts[i].options.scales.yAxes[0].ticks.suggestedMax = 80;
            Charts[i].update();
        }
    });
    d3.select("#price").on("click", function() {
        var i;
        for(i = 0; i < 6; i++){
            Charts[i].data.datasets[0].data = priceDistribList[i];
            Charts[i].data.labels = labelsPrice;
            Charts[i].options.scales.yAxes[0].ticks.suggestedMax = 50;
            Charts[i].update();
        }
    });
}

function upDatePrice(){
    ctx1
}
