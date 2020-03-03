const d3 = require('d3')
const mapWidth = 640;
const mapHeight = 600;
let minNumListings = 10;
let maxNumListings = 500;
const colorPalette = ['#d3d3d3', '#e08984', '#bf809b', '#65c1cf', '#5374a6', '#776399'];
const neighborhoodsNYC = require('../data/neighbourhoods-nyc.geo.json');
const neighborhoodsSeattle = require('../data/neighbourhoods-seattle.geo.json');
const neighborhoodsAustin = require('../data/neighbourhoods-austin.geo.json');
const neighborhoodsSF = require('../data/neighbourhoods-sf.geo.json');
const neighborhoodsNOLA = require('../data/neighbourhoods-nola.geo.json');
let neighborhoodListings = d3.map();
let pricesMap = d3.map();
var active = d3.select(null);

class MapVis {
  constructor(city) {
    var self = this;
    var listings_csv = "listings_small.csv"; // New York by default
    var calendar_csv = "calendar_nyc.csv";
    if (city === "Seattle") {
        listings_csv = "listings_seattle.csv";
        // update calendar_csv
    } else if (city === "Austin") {
        listings_csv = "listings_small_austin.csv";
        // update calendar.csv
    } else if (city === "San Francisco") {
        listings_csv = "listings_small_sf.csv";
        // update calendar.csv
    } else if (city === "New Orleans") {
        listings_csv = "listings_small_nola.csv";
        // update calendar.csv
    }
    d3.csv(listings_csv)
      .then((data) => {
        data.forEach(function (d) {
          let point = [d.longitude, d.latitude, d.minimum_nights, d.id, d.neighbourhood];
          let key = d.neighbourhood;
          if (neighborhoodListings.has(key)) {
            let currentListings = neighborhoodListings.get(key);
            currentListings.push(point);
            neighborhoodListings.set(key, currentListings);
          } else {
            neighborhoodListings.set(key, [point]);
          }
        });
      });
    console.log(neighborhoodListings);
    d3.csv(calendar_csv)
      .then((data) => {
        data.forEach(function (d) {
          let id = d.listing_id;
          let price = d.price;
          price = price.replace("$", "");
          price = price.replace(".00 ", "");
          price = parseInt(price);
          if (pricesMap.has(id)) {
            let currentPrices = pricesMap.get(id);
            currentPrices.push(price);
            pricesMap.set(id, currentPrices);
          } else {
            pricesMap.set(id, [price]);
          }
        });
      });
    const neighborhoodCt = d3.csv("num_listings_ny.csv").then(getNeighborhoodCounts);
    neighborhoodCt.then(function (value) {
      self.drawMap(city, value);
    });
    function getNeighborhoodCounts(data) {
      console.log("starting mapping...");
      var neighborhoodMap = d3.map();
      data.forEach((d) => {
        neighborhoodMap.set(d.neighborhood, d.num_listings);
      })
      var noListings = ["Glen Oaks", "Hollis Hills", "Port Ivory", "Bloomfield", "Chelsea, Staten Island", "Charleston", "Pleasant Plains"]
      noListings.forEach(function (d) {
        neighborhoodMap.set(d, 0);
      })
      return neighborhoodMap;
    }
}

  drawMap(city, neighborhoodCt) {
    var colorScale = d3.scaleQuantize().domain([minNumListings, maxNumListings]).range(d3.schemePurples[5]);
    d3.select("#map-svg").append("rect")
      .attr("class", "background")
      .attr("width", mapWidth)
      .attr("height", mapHeight)
      .on("click", reset);

    // default is New York
    let neighborhoods = neighborhoodsNYC;
    var projection = d3.geoMercator()
      .center([-73.94, 40.70])
      .scale(60000)
      .translate([mapWidth / 2, mapHeight / 2]);
    if (city == "Seattle") {
        var projection = d3.geoMercator()
          .center([-122.33, 47.61])
          .scale(90000)
          .translate([mapWidth / 2, mapHeight / 2]);
        neighborhoods = neighborhoodsSeattle;
    } else if (city == "Austin") {
        var projection = d3.geoMercator()
          .center([-97.7559964, 30.3071816])
          .scale(50000)
          .translate([mapWidth / 2, mapHeight / 2]);
        neighborhoods = neighborhoodsAustin;
    } else if (city == "San Francisco") {
        var projection = d3.geoMercator()
          .center([-122.433701, 37.767683])
          .scale(150000)
          .translate([mapWidth / 2, mapHeight / 2]);
        neighborhoods = neighborhoodsSF;
    } else if (city == "New Orleans") {
        var projection = d3.geoMercator()
          .center([-89.92697, 30.03979])
          .scale(60000)
          .translate([mapWidth / 2, mapHeight / 2]);
        neighborhoods = neighborhoodsNOLA;
    }
    var geoPath = d3.geoPath().projection(projection);

    var g = d3.select("map-svg").append("g");

    d3.select("#map-svg").selectAll("path")
      .data(neighborhoods.features)
      .enter()
      .append('path')
      .attr("d", geoPath)
      .attr("id", function (d) {
        return d.properties.neighbourhood; // neighborhood name
      })
      .attr("class", function (d) {
        return d.properties.neighbourhood_group; // borough name
      })
      .style("fill", function (d) {
        return colorScale(neighborhoodCt.get(d.properties.neighbourhood));
      })
      .style("stroke", "#d3d3d3") // set outline to be gray
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handlePathClick);

    // Display the neighborhood and borough name on mouseover
    function handleMouseOver(d) {
      d3.select(this)
        .style("fill", "#E9A553")
        .style("cursor", "pointer");
      d3.select("#selection").text("Neighborhood: " + this.id + ", Borough: " + d.properties.neighbourhood_group);
      d3.select("#total-listings").text("Total number of listings in this neighborhood: " + neighborhoodCt.get(d.properties.neighbourhood));
    }

    // Reset the visual to default fill on mouseout
    function handleMouseOut(d) {
      d3.select(this).style("fill", () => {
        return colorScale(neighborhoodCt.get(this.id));
      });
      //d3.select("#selection").text("Neighborhood: none selected, Borough: none selected");
    }

    function handlePathClick(d) {
      if (active.node() === this) return reset();
      d3.select(this).style("outline", "none");
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      var zoom = d3.zoom().on("zoom", zoomed);
      // d3.select("#map-svg").selectAll("path")
      //   .on("mouseover", handleMouseOver);
      // d3.select(this).style("fill", "#D3D3D3")
      //   .on("mouseover", d3.select(this).style("fill", "#D3D3D3"));
      var bounds = geoPath.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.5 / Math.max(dx / mapWidth, dy / mapHeight),
        translate = [mapWidth / 2 - scale * x, mapHeight / 2 - scale * y];

      drawListingPoints(this.id);
      d3.select("#map-svg").transition()
        .duration(750)
        .style("stroke-width", "0.5px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    function zoomed() {
      d3.select("#map-svg").attr("transform", d3.event.transform);
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);
      d3.select("#map-svg").transition()
        .duration(750)
        .style("stroke-width", "0.5px")
        .attr("transform", "");
      d3.select("#map-svg").selectAll("circle")
        .data([])
        .exit()
        .remove();
    }

    function drawListingPoints(id) {
      d3.select("#map-svg").selectAll("circle").remove();
      var circles = d3.select("#map-svg").selectAll("circle")
        .data(neighborhoodListings.get(id));
      circles.enter().append("circle")
        .attr("cx", function (d) {
          let datum = [d[0], d[1]];
          return projection(datum)[0];
        })
        .attr("cy", function (d) {
          let datum = [d[0], d[1]];
          return projection(datum)[1];
        })
        .attr("r", "0.7px")
        .attr("fill", function (d) {
            // TODO: fix for different cities
          if (d[3] <= 1881586) {
            return "#00ff00";
          } else {
            return "#fd5c63";
          }
        })
        .style("cursor", "pointer")
        .on("click", handlePointClick);
    }

    function handlePointClick(d) {
      d3.select("#selection").text("Neighborhood: " + d[4]);
      d3.select("#min-nights").text("Minimum nights: " + d[2]);
      d3.selectAll("circle").attr("stroke", "transparent")
      d3.select(this).attr("stroke", "white").attr("stroke-width", "0.3px");
      displayPriceOverYear(d);
    }

    function displayPriceOverYear(d) {
      let id = d[3];
      var pricesOverMonths = pricesMap.get(id);

      if (pricesOverMonths === undefined) {
        document.getElementById("price-over-year-container").style.display = "none";
      } else {
        document.getElementById("price-over-year-container").style.display = "block";
        var ctx = $("#line-chart");
        let data = {
          labels: ['Jan', '', 'Feb', '', 'Mar', '', 'Apr', '', 'May', '', 'Jun', '', 'Jul', '', 'Aug', '', 'Sept', '', 'Oct', '', 'Nov', '', 'Dec'],
          datasets: [
            {
              label: "Price ($USD)",
              data: pricesOverMonths,
              backgroundColor: "rgba(0,51,102,0.3)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)"
            }
          ]
        };
        let options = {
          tooltips: {
            callbacks: {
              title: function () { }
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        };
        var myChart = new Chart(ctx, {
          type: 'line',
          data: data,
          options: options
        });
      }
    }

    $('svg path').tipsy({
      gravity: 'w',
      html: true,
      title: function () {
        var d = this.__data__;
        return 'Neighborhood: ' + this.id + '<br>' +
          'Borough: ' + d.properties.neighbourhood_group +
          '<br> Number of listings: ' + neighborhoodCt.get(this.id);
      }
    });
  }

}

module.exports = MapVis;
