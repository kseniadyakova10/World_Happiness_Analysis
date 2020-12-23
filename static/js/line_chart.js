var svgWidth = 950;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 10,
  right: 10,
  bottom: 50,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#myChart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Search function
function onlyUnique(value, index, self){
  return self.indexOf(value) == index;
}


//get the data from each country based on the search function and create a line chart of country's score
function getChart(dataID){
  d3.json("../getMyJson").then(function(worldData){
    console.log(worldData);

    var data = worldData.filter(d => d.country == dataID);

    console.log(data);

    data.forEach(function(data){
      data.rank = +data.rank;
      data.country = data.country;
      data.score =  +data.score;
      data.gdp = +data.gdp;
      data.social_support = +data.social_support;
      data.life_expectancy = +data.life_expectancy;
      data.freedom = +data.freedom;
      data.generosity = +data.generosity;
      data.corruption = +data.corruption;
      data.year = data.year;
    })

    var xLinearScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.year))
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.score), d3.max(data, d => d.score)])
      .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale).tickFormat(d3.format("d"));
    var leftAxis = d3.axisLeft(yLinearScale);


    var line = d3.line()
      .x(data => xLinearScale(data.year))
      .y(data => yLinearScale(data.score));


    chartGroup.append("path")
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", "none")
      .attr("d", line(data));

    chartGroup.append("g")
      .classed("axis", true)
      .call(leftAxis);

    chartGroup.append("g")
      .classed("axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .classed("year text", true)
      .text("Year");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 60)
      .attr("x", 0 - (chartHeight/2))
      .attr("class", "axisText")
      .text("Country Score")

  })
};

//default
function init(){
  var selector = d3.select("#selDataset");
  d3.json("../getMyJson").then((data) => {
    var countryData = data.map(d => d.country);
    var uniqueData = countryData.filter(onlyUnique).sort();
    console.log(uniqueData);

    uniqueData.forEach((d) => {
      selector
        .append("option")
        .text(d)
        .property("value", d);
    });

    var resultData = uniqueData[0];
    getChart(resultData);


  });

};

init();

d3.selectAll("#selDataset").on("change", optionChanged);

//get new data and create new chart per new data
function optionChanged(newSample){
  chartGroup.html("");
  getChart(newSample);

};
