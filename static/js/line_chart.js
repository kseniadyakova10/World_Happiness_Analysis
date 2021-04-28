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

d3.json("../getMyJson").then(function(worldData){

    console.log(worldData);

    //list of countries
    var allCountries = d3.map(worldData, d => d.country).keys()
    console.log(allCountries)

    //add countries to the button
    d3.select("#selDataset")
        .selectAll("myOptions")
            .data(allCountries)
        .enter()
            .append("option")
        .text(d => d)
        .attr("value", d => d)
        .sort();
    
    //add x-axis
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(worldData, d => +d.year))
        .range([0, chartWidth]);
    
    var bottomAxis = d3.axisBottom(xLinearScale).tickFormat(d3.format("d"));

    chartGroup.append("g")
      .classed("axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis.ticks(5));

    //add y-axis
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(worldData, d => d.score)])
      .range([chartHeight, 0]);

    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .classed("axis", true)
      .call(leftAxis);
    
    //initialize line with first country on list
    var line = chartGroup.append("path")
        .datum(worldData.filter(d => d.country == allCountries[0]))
        .attr("d", d3.line()
            .x(d => xLinearScale(d.year))
            .y(d => yLinearScale(d.score))
        )
        .attr("stroke", "black")
        .style("stroke-width", "1")
        .style("fill", "none");

    //function for updating
    function update(selectedGroup) {

        //create new data with selection
        var dataFilter = worldData.filter(d => d.country == selectedGroup)

        //give a line for new group
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(d => xLinearScale(d.year))
                .y(d => yLinearScale(d.score))
            )
            .attr("stroke", "black")
    }

    //when button is changed
    d3.select("#selDataset").on("change", function(d) {
        //recover option that was chosen
        var selectedOption = d3.select(this).property("value")
        //run the updateChart fucntion
        update(selectedOption)
    })
})
    