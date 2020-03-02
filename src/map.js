const d3 = require('d3')
const mapWidth = 640;
const mapHeight = 600;
let minNumListings = 10;
let maxNumListings = 500;
const colorPalette = ['#d3d3d3','#f5ad49','#e08984','#bf809b','#776399', '#5374a6'];
const neighborhoods = require('../data/neighbourhoods.geo.json');
const neighborhoodMap = d3.map();
let neighborhoodListings = d3.map();
var active = d3.select(null);

class MapVis {
  constructor() {
      d3.csv("listings_small.csv")
        .then((data) => {
            data.forEach(function(d) {
                let point = [d.longitude, d.latitude, d.minimum_nights];
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
  }

  drawMap() {
    this.getNeighborhoodCounts();
    var colorScale = d3.scaleQuantize().domain([minNumListings,maxNumListings]).range(colorPalette);
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
        return colorScale(0);
        //return colorScale(neighborhoodMap.get(d.properties.neighbourhood));
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
          return colorScale(neighborhoodMap.get(this.id));
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
          console.log(neighborhoodListings.get(id));
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
              .attr("r", "1px")
              .attr("fill", "#fd5c63")
              .style("cursor", "pointer")
              .on("click", handlePointClick);
      }

      function handlePointClick(d) {
          d3.select("#min-nights").text("Minimum nights: " + d[2]);
          d3.selectAll("circle").attr("fill", "#fd5c63")
          d3.select(this).attr("fill", "black");
          displayPriceOverYear();
      }

      function displayPriceOverYear() {
          var ctx = $("#line-chart");
          var myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ['Jan', '', 'Feb', '', 'Mar', '', 'Apr', '', 'May', '', 'Jun', '', 'Jul', '', 'Aug', '', 'Sept', '', 'Oct', '', 'Nov', '', 'Dec'],
                datasets: [{
                    label: "Price ($USD)",
                    backgroundColor: "rgba(0,51,102,0.3)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [12, 19, 3, 17, 6, 3, 7, 9, 4, 13, 5, 10, 12, 19, 3, 17, 6, 3, 7, 9, 4, 13, 5, 10]
                }]
             },
            options : {
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
                    } ]
                }
            }
          });
      }

    $('svg path').tipsy({
        gravity: 'w',
        html: true,
        title: function () {
          var d = this.__data__;
          return 'Neighborhood: ' + this.id + '<br>' +
                 'Borough: ' + d.properties.neighbourhood_group +
                 '<br> Number of listings: ' + neighborhoodMap.get(this.id);
      }
    });
  }

  getNeighborhoodCounts() {
    console.log("starting mapping...");
    d3.csv("listings_small.csv")
        .then((data) => {
            data.forEach(function(d) {
                let key = d.neighbourhood;
                if (neighborhoodMap.has(key)) {
                  var value = neighborhoodMap.get(key);
                  neighborhoodMap.set(key, value + 1);
                } else {
                  neighborhoodMap.set(key, 1);
                }
            });
    });
  }
}

module.exports = MapVis;
