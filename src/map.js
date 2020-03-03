const d3 = require('d3')
const mapWidth = 640;
const mapHeight = 600;
let minNumListings = 10;
let maxNumListings = 500;
const colorPalette = ['#d3d3d3','#e08984','#bf809b','#65c1cf','#5374a6', '#776399'];
const neighborhoods = require('../data/neighbourhoods.geo.json');
//let neighborhoodMap = d3.map();
let neighborhoodListings = d3.map();
let pricesMap = d3.map();
var active = d3.select(null);

class MapVis extends null{
  constructor() {
    super();
    var self = this;
      d3.csv("listings_small.csv")
        .then((data) => {
            data.forEach(function(d) {
                let point = [d.longitude, d.latitude, d.minimum_nights, d.id];
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
      d3.csv("calendar.csv")
        .then((data) => {
          data.forEach(function(d) {
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
        neighborhoodCt.then(function(value){
          self.drawMap(value);
        });
        function getNeighborhoodCounts(data) {
          console.log("starting mapping...");
          var neighborhoodMap = d3.map();
          data.forEach((d) => {
            neighborhoodMap.set(d.neighborhood, d.num_listings);
          })
          var noListings = ["Glen Oaks", "Hollis Hills", "Port Ivory", "Bloomfield", "Chelsea, Staten Island", "Charleston", "Pleasant Plains"]
          noListings.forEach(function(d) {
            neighborhoodMap.set(d, 0);
          })
          return neighborhoodMap;
        }
  }

  drawMap(neighborhoodCt) {
    var colorScale = d3.scaleQuantize().domain([minNumListings,maxNumListings]).range(d3.schemePurples[5]);
    d3.select("#map-svg").append("rect")
        .attr("class", "background")
        .attr("width", mapWidth)
        .attr("height", mapHeight)
        .on("click", reset);

    var projection = d3.geoMercator()
      .center([-73.94, 40.70])
      .scale(60000)
      .translate([mapWidth / 2, mapHeight / 2]);
    var geoPath = d3.geoPath().projection(projection);

    var g = d3.select("map-svg").append("g");

    d3.select("#map-svg").selectAll("path")
      .data(neighborhoods.features)
      .enter()
      .append('path')
      .attr("d", geoPath)
      .attr("id", function(d) {
        return d.properties.neighbourhood; // neighborhood name
      })
      .attr("class", function(d) {
        return d.properties.neighbourhood_group; // borough name
      })
      .style("fill", function(d) {
        //return colorScale(0);
        return colorScale(neighborhoodCt.get(d.properties.neighbourhood));
      })
      .style("stroke", "#ffffff") // set outline to be white
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handlePathClick);

      // Display the neighborhood and borough name on mouseover
      function handleMouseOver(d) {
        d3.select(this)
            .style("fill", "#E9A553")
            .style("cursor", "pointer");
        d3.select("#selection").text("Neighborhood: " + this.id + ", Borough: " + d.properties.neighbourhood_group);
      }

      // Reset the visual to default fill on mouseout
      function handleMouseOut(d) {
        // d3.select(this).style("fill", "D3D3D3").style("cursor", "default");
        d3.select(this).style("fill", () => {
          return colorScale(neighborhoodCt.get(this.id));
        });
        d3.select("#selection").text("Neighborhood: none selected, Borough: none selected");
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
          d3.select("#selection").text("Neighborhood: " + d.id);
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
                          title: function() {}
                      }
                  },
                  scales : {
                      xAxes : [ {
                          gridLines : {
                              display : false
                          }
                      } ],
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
