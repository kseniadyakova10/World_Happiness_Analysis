var svgWidth = 950;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 10,
  right: 10,
  bottom: 50,
  left: 100
};

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#myChart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

function onlyUnique(value, index, self){
  return self.indexOf(value) == index;
};

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

    console.log(data[4]);

    var selectedData = [data[4].gdp, data[4].social_support, data[4].life_expectancy, data[4].freedom, data[4].generosity, data[4].corruption];
    var selectedCountry = data.country

    var ctx = document.getElementById('myChart').getContext('2d');

    var mychart = new Chart(ctx, {
        //Chart type
        type: 'radar',

        //Plug in data
        data: {
            labels: ['GDP', 'Social Support', 'Life Expectancy', 'Freedom', 'Generosity', 'Corruption'],
            datasets: [{
                label: '2019 Data',
                backgroundColor: 'rgb(126, 237, 148)',
                borderColor: 'rgb(82, 186, 103)',
                data: selectedData
            }]
        }
    });
    
  })
};

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