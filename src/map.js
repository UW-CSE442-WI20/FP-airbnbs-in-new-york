const d3 = require('d3')
const mapWidth = 640;
const mapHeight = 600;
const neighborhoods = require('../data/neighbourhoods.geo.json');

class Map {
  constructor() {}

  drawMap() {
    var projection = d3.geoMercator()
      .center([-73.94, 40.70])
      .scale(60000)
      .translate([mapWidth / 2, mapHeight / 2]);
    var geoPath = d3.geoPath().projection(projection);

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
      .style("stroke", "#ffffff") // set outline to be white
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

      // Display the neighborhood and borough name on mouseover
      function handleMouseOver(d) {
        d3.select(this).style("fill", "#d2b48c");
        d3.select("#selection").text("Neighborhood: " + this.id + ", Borough: " + d.properties.neighbourhood_group);
      }

      // Reset the visual to black fill on mouseout
      function handleMouseOut(d) {
        d3.select(this).style("fill", "black");
        d3.select("#selection").text("Neighborhood: none selected, Borough: none selected");
      }

    $('svg path').tipsy({
        gravity: 'w',
        html: true,
        title: function () {
          var d = this.__data__;
          return 'Neighborhood: ' + this.id + '<br>' + 'Borough: ' + d.properties.neighbourhood_group;
      }
    });
  }

  drawListingPoints() {
      let dataPoints = [];
      let projection = d3.geoMercator()
          .center([-73.94, 40.70])
          .scale(60000)
          .translate([mapWidth / 2, mapHeight / 2]);

      d3.csv("listings_small.csv")
        .then((data) => {
            console.log(data);
            data.forEach(function(d) {
                let point = [d.longitude, d.latitude, d.price];
                dataPoints.push(point);
            });

            d3.select("#map-svg").selectAll("circle")
          		.data(dataPoints)
                .enter()
          		.append("circle")
          		.attr("cx", function (d) {
                    let datum = [d[0], d[1]];
                    return projection(datum)[0];
                })
          		.attr("cy", function (d) {
                    let datum = [d[0], d[1]];
                    return projection(datum)[1]; })
          		.attr("r", "1px")
          		.attr("fill", "#fd5c63")
                .on("click", (d) => d3.select("#price").text("Price: $" + d[2]));
      });
  }
}

module.exports = Map;
