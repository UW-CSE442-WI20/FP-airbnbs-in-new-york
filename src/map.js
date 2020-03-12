const d3 = require('d3')
const simpleslider = require('d3-simple-slider')
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
const neighborhoodsHonolulu = require('../data/neighbourhoods-hono.geo.json');
let neighborhoodListings = d3.map();
let pricesMap = d3.map();
let austinZipCodes = d3.map();
var active = d3.select(null);
let city = "New York"; // default
const mapInstructions = "Click on a neighborhood to explore listings in that area! Keep exploring by clicking on another neighborhood, or click anywhere else to zoom out.";

class MapVis {
  constructor(city) {
    var self = this;
    this.city = city;
    var listings_csv = "listings_small.csv"; // New York by default
    var calendar_csv = "calendar_nyc.csv";
    var numlistings_csv = "num_listings_ny.csv";
    if (this.city === "Seattle") {
      listings_csv = "listings_small_seattle.csv";
      numlistings_csv = "num_listings_seattle.csv";
      calendar_csv = "calendar_seattle.csv";
    } else if (this.city === "Austin") {
      listings_csv = "listings_small_austin.csv";
      numlistings_csv = "num_listings_austin.csv";
      calendar_csv = "calendar_austin.csv";
      d3.csv("austin-zipcodes.csv").then((data) => {
        data.forEach((d) => {
          austinZipCodes.set(d.neighborhood, d.name);
        })
      });
    } else if (this.city === "San Francisco") {
      listings_csv = "listings_small_sf.csv";
      numlistings_csv = "num_listings_sf.csv";
      calendar_csv = "calendar_sf.csv";
    } else if (this.city === "New Orleans") {
      listings_csv = "listings_small_nola.csv";
      numlistings_csv = "num_listings_nola.csv";
      calendar_csv = "calendar_nola.csv";
    } else if (this.city === "Honolulu") {
      listings_csv = "listings_hono.csv";
      numlistings_csv = "num_listings_hono.csv";
      calendar_csv = "calendar_hono.csv";
    }
    d3.select("#city-name").text("Map of Airbnbs in " + this.city).style("font-weight", "bold");
    d3.select("#map-info").text(mapInstructions);
    d3.csv(listings_csv)
      .then((data) => {
        data.forEach(function (d) {
          let point = [d.longitude, d.latitude, d.minimum_nights, d.id, d.neighbourhood, d.name, d.availability_365, d.room_type];
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

    const neighborhoodCt = d3.csv(numlistings_csv).then(getNeighborhoodCounts);
    neighborhoodCt.then(function (value) {
      self.drawMap(value);
      self.showTooltips(value);
      console.log("drawing map")
    });
    function getNeighborhoodCounts(data) {
      console.log("starting mapping...");
      var neighborhoodMap = d3.map();
      data.forEach((d) => {
        neighborhoodMap.set(d.neighborhood, d.num_listings);
      })
      minNumListings = Math.min(...neighborhoodMap.values());
      maxNumListings = Math.max(...neighborhoodMap.values());
      return neighborhoodMap;
    }
  }

  showTooltips(neighborhoodCt) {
    var currentCity = this.city;
    $('svg path').tipsy({
      gravity: 'w',
      html: true,
      title: function () {
        var d = this.__data__;
        var numlistings = neighborhoodCt.get(this.id) == undefined ? 0 : neighborhoodCt.get(this.id);
        var tooltipText = '';
        if (currentCity == 'New York') {
          tooltipText = 'Neighborhood: ' + this.id + '<br>' +
            'Borough: ' + d.properties.neighbourhood_group +
            '<br> Number of listings: ' + numlistings;
        } else {
          tooltipText = 'Neighborhood: ' + this.id +
            '<br> Number of listings: ' + numlistings;
        }
        return tooltipText;
      }
    });
  }

  drawMap(neighborhoodCt) {
    reset();
    d3.selectAll("#map-svg > *").remove();
    console.log("min listings: " + minNumListings + " max listings: " + maxNumListings);
    //var colorScale = d3.scaleQuantize().domain([minNumListings, maxNumListings]).range(d3.schemePurples[6]);
    var colorScale = d3.scaleLinear().domain([minNumListings, maxNumListings]).range([d3.interpolatePurples(0.3), d3.interpolatePurples(1)]);
    //var colorScale = d3.scaleLinear().domain([minNumListings, maxNumListings]).range(["#ffc7c9", "#e3363c"]);

    drawLegend();
    d3.select("#map-svg").append("rect")
      .attr("class", "background")
      .attr("width", mapWidth)
      .attr("height", mapHeight)
      .on("click", reset);
    var city = this.city;
    // default is New York
    let neighborhoods = neighborhoodsNYC;
    var projection = d3.geoMercator()
      .center([-73.94, 40.70])
      .scale(60000)
      .translate([mapWidth / 2, mapHeight / 2]);
    if (this.city == "Seattle") {
      var projection = d3.geoMercator()
        .center([-122.33, 47.61])
        .scale(90000)
        .translate([mapWidth / 2, mapHeight / 2]);
      neighborhoods = neighborhoodsSeattle;
    } else if (this.city == "Austin") {
      var projection = d3.geoMercator()
        .center([-97.7559964, 30.3071816])
        .scale(50000)
        .translate([mapWidth / 2, mapHeight / 2]);
      neighborhoods = neighborhoodsAustin;
    } else if (this.city == "San Francisco") {
      var projection = d3.geoMercator()
        .center([-122.433701, 37.767683])
        .scale(150000)
        .translate([mapWidth / 2, mapHeight / 2]);
      neighborhoods = neighborhoodsSF;
    } else if (this.city == "New Orleans") {
      var projection = d3.geoMercator()
        .center([-89.92697, 30.03979])
        .scale(60000)
        .translate([mapWidth / 2, mapHeight / 2]);
      neighborhoods = neighborhoodsNOLA;
    } else if (this.city == "Honolulu") {
      var projection = d3.geoMercator()
        .center([-157.95, 21.48])
        .scale(50000)
        .translate([mapWidth / 2, mapHeight / 2]);
      neighborhoods = neighborhoodsHonolulu;
    }
    var geoPath = d3.geoPath().projection(projection);
    var currentCity = this.city;

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
        var numlistings = neighborhoodCt.get(this.id) == undefined ? 0 : neighborhoodCt.get(this.id);
        return colorScale(numlistings);
      })
      .style("stroke", "#9e9d9d") // set outline to be gray
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handlePathClick);

    function drawLegend() {

      var svg = d3.select("#legend-svg");

      var defs = svg.append("defs");

      var gradient = defs.append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "100%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "100%");

      gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", "0%")
        .attr("stop-color", d3.interpolatePurples(1))
        .attr("stop-opacity", 1);

      gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", "100%")
        .attr("stop-color", d3.interpolatePurples(0.3))
        .attr("stop-opacity", 1);

      var legend = svg.append("rect")
        .attr("width", 40)
        .attr("height", 300)
        .attr("fill", "url(#svgGradient)")
        .attr("stroke", "#9e9d9d");
      var label = d3.scaleLinear().range([300, 0]).domain([minNumListings, maxNumListings]);
      var legendLabels = d3.axisRight(label);
      svg.append("g")
        .attr("class", "axisWhite")
        .call(legendLabels);
    }

    // Display the neighborhood and borough name on mouseover
    function handleMouseOver(d) {
      d3.select(this)
        .style("fill", "#767676")
        .style("cursor", "pointer");
    }

    // Reset the visual to default fill on mouseout
    function handleMouseOut(d) {
      d3.select(this).style("fill", () => {
        var numlistings = neighborhoodCt.get(this.id) == undefined ? 0 : neighborhoodCt.get(this.id);
        return colorScale(numlistings);
      });
    }

    var largerCircles = "small";

    function handlePathClick(d) {
      if (active.node() === this) return reset();
      clearNeighborhoodInfo();
      clearPreviousListing();
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

      console.log("dx: " + dx);
      console.log("dy: " + dy);

      if (dx > 150 || dy > 150) {
          largerCircles = "large";
      } else if (dx > 80 || dy > 80) {
          largerCircles = "medium";
      }

      d3.select("#map-svg").transition()
        .duration(750)
        .style("stroke-width", "0.5px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

      drawListingPoints(neighborhoodListings.get(this.id));
      showSlider(this.id);
      showRoomTypeFilter(this.id);
      var numlistings = neighborhoodCt.get(this.id) == undefined ? 0 : neighborhoodCt.get(this.id);
      if (city == "Austin") {
        d3.select("#selection").text("General Neighborhood: " + austinZipCodes.get(this.id) + ", Zip Code: " + this.id);
      } else {
        d3.select("#selection").text("Neighborhood: " + this.id);
      }
      d3.select("#total-listings").text("Total number of listings in this neighborhood: " + numlistings);
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
      clearPreviousListing();
      clearNeighborhoodInfo();
      d3.select("#map-info").text(mapInstructions);
    }

    function clearPreviousListing() {
      d3.select("#listing-avail").select("svg").data([]).exit().remove();
      d3.select("#listing-info").selectAll("p").text("");
      document.getElementById("price-over-year-container").style.display = "none";
      d3.selectAll("button").remove();
      d3.selectAll("#map-info").text("");
    }

    function clearNeighborhoodInfo() {
      d3.select("#slider-range").select("svg").data([]).exit().remove();
      d3.select("#value-range").text("");
      d3.selectAll("button").remove();
      d3.selectAll("p").text("");
      d3.selectAll("#map-info").text("");
    }

    function drawListingPoints(inputdata) {
      d3.select("#map-svg").selectAll("circle").remove();
      var circles = d3.select("#map-svg").selectAll("circle")
        .data(inputdata);
      circles.enter().append("circle")
        .attr("cx", function (d) {
          let datum = [d[0], d[1]];
          return projection(datum)[0];
        })
        .attr("cy", function (d) {
          let datum = [d[0], d[1]];
          return projection(datum)[1];
        })
        .attr("r", function(d) {
            if (largerCircles == "small") {
                return "0.07em";
            } else if (largerCircles == "medium") {
                return "0.12em";
            } else {
                return "0.18em";
            }
        })
        .attr("fill", function (d) {
          if (currentCity === "New York") {
            if (d[3] <= 1881586) {
              return "#00ff00";
            } else {
              return "#fd5c63";
            }
          }
          return "#00ff00";
        })
        .style("cursor", "pointer")
        .on("mouseover", handlePointMouseover)
        .on("mouseout", handlePointMouseout)
        .on("click", handlePointClick);
    }

    function handlePointMouseover(d) {
      d3.select(this).attr("stroke", "white").attr("stroke-width", "0.3px");
    }

    function handlePointMouseout(d) {
      d3.select(this).attr("stroke", "transparent");
    }

    function handlePointClick(d) {
      var data = d;
      console.log(data);
      // remove old point data
      clearPreviousListing();
      clearNeighborhoodInfo();
      // add new point data
      d3.select("#selection").text("Neighborhood: " + d[4]);
      d3.select("#listing-name").text("Listing name: " + d[5]);
      d3.select("#min-nights").text("Minimum nights: " + d[2]);
      d3.select(".active-point").classed("active-point", false);
      d3.select(this).classed("active-point", true);
      showAvailability(d[6]);
      displayPriceOverYear(d);
      d3.select("#go-back").append("button")
        .text("< Back to neighborhood filters")
        .attr("id", "neighborhood-back-button")
        .attr("class", "btn btn-outline-info btn-sm")
        .lower()
        .on("click", () => {
          clearPreviousListing();
          drawListingPoints(neighborhoodListings.get(data[4]));
          showSlider(data[4]);
          showRoomTypeFilter(data[4]);
          var numlistings = neighborhoodCt.get(data[4]) == undefined ? 0 : neighborhoodCt.get(data[4]);
          if (city == "Austin") {
            d3.select("#selection").text("General Neighborhood: " + austinZipCodes.get(data[4]) + ", Zip Code: " + data[4]);
          } else {
            d3.select("#selection").text("Neighborhood: " + data[4]);
          }
          d3.select("#total-listings").text("Total number of listings in this neighborhood: " + numlistings);
        });
    }

    function showAvailability(avail) {
      d3.select("p#avail-text").text("Listing availability out of the year: " + avail + " days");
      var colorScale = d3.scaleLinear().domain([0, 365]).range(["yellow", "#00a699"]);
      var svg = d3.select("#listing-avail").append('svg')
        .attr("height", 20)
        .attr("width", 500)
        .attr('transform', 'translate(70,0)');
      svg.append('rect')
        .attr('class', 'bg-rect')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', 'gray')
        .attr('height', 15)
        .attr('width', 365)
        .attr('x', 0);
      var progress = svg.append('rect')
        .attr('class', 'progress-rect')
        .attr('fill', function () {
          return colorScale(avail);
        })
        .attr('height', 15)
        .attr('width', 0)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('x', 0);

      progress.transition()
        .duration(1000)
        .attr('width', avail);

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
              backgroundColor: "rgba(0,166,153,0.3)",
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

    function showSlider(id) {
      var listingPoints = neighborhoodListings.get(id);
      var nightsArray = [];
      listingPoints.forEach((d) => {
        nightsArray.push(d[2]);
      })
      var min = d3.min(nightsArray);
      var max = d3.max(nightsArray);
      var f = d3.format(',.2r');

      d3.select('p#value-range')
        .text("Minimum nights range: " + f(min) + "-" + f(max) + " nights");
      var sliderRange = simpleslider
        .sliderBottom()
        .min(min)
        .max(max)
        .width(360)
        .tickFormat(f)
        .ticks(10)
        .default([min, max])
        .fill('#2196f3')
        .on('onchange', val => {
          var filteredPoints = [];
          listingPoints.forEach((d) => {
            if (d[2] >= val[0] && d[2] <= val[1]) {
              filteredPoints.push(d);
            }
          })
          // remove old points
          d3.select("#map-svg").selectAll("circle").data([]).exit().remove();
          // draw new points
          drawListingPoints(filteredPoints);
          d3.select('p#value-range')
            .text("Minimum nights range: " + f(val[0]) + "-" + f(val[1]) + " nights");
        });

      var gRange = d3
        .select('div#slider-range')
        .append('svg')
        .attr('width', 500)
        .attr('height', 70)
        .append('g')
        .attr('transform', 'translate(70,10)');

      gRange.call(sliderRange);
    }

    function showRoomTypeFilter(id) {
      d3.select("#room-filter").append("button")
        .text("Entire home/apt")
        .attr("id", "entire-home")
        .attr("class", "btn btn-outline-info btn-sm");
      d3.select("#room-filter").append("button")
        .text("Hotel room")
        .attr("id", "hotel")
        .attr("class", "btn btn-outline-info btn-sm ");
      d3.select("#room-filter").append("button")
        .text("Private room")
        .attr("id", "private")
        .attr("class", "btn btn-outline-info btn-sm ");
      d3.select("#room-filter").append("button")
        .text("Shared room")
        .attr("id", "shared")
        .attr("class", "btn btn-outline-info btn-sm ");
      d3.select("#room-filter").append("button")
        .text("Show all points")
        .attr("id", "all-points")
        .attr("class", "btn btn-outline-warning btn-sm ");
      var listingPoints = neighborhoodListings.get(id);
      d3.select("#entire-home").on("click", function (data) {
        // remove old points
        d3.select("#map-svg").selectAll("circle").data([]).exit().remove();
        // draw new points
        drawListingPoints(listingPoints.filter((d) => {
          return d[7] == "Entire home/apt";
        }));
      });

      d3.select("#hotel").on("click", function (data) {
        // remove old points
        d3.select("#map-svg").selectAll("circle").data([]).exit().remove();
        // draw new points
        drawListingPoints(listingPoints.filter((d) => {
          return d[7] == "Hotel room";
        }));
      });

      d3.select("#private").on("click", function (data) {
        // remove old points
        d3.select("#map-svg").selectAll("circle").data([]).exit().remove();
        // draw new points
        drawListingPoints(listingPoints.filter((d) => {
          return d[7] == "Private room";
        }));
      });

      d3.select("#shared").on("click", function (data) {
        // remove old points
        d3.select("#map-svg").selectAll("circle").data([]).exit().remove();
        // draw new points
        drawListingPoints(listingPoints.filter((d) => {
          return d[7] == "Shared room";
        }));
      });

      d3.select("#all-points").on("click", () => {
        drawListingPoints(neighborhoodListings.get(id));
      })
    }
  }


}

module.exports = MapVis;
