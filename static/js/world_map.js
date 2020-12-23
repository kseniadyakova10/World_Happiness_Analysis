function makeResponsive() {
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    var margin = {
        top:50,
        right:50,
        bottom:50,
        left:50
    };

    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    var svg = d3
        .select("body")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);   

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    svg.call(d3.zoom().on("zoom", () => {
        chartGroup.attr("transform", d3.event.transform);
    }));
    function buildMap() {
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(data => {
            console.log(data);

            var projection = d3.geoMercator()
            var pathGenerator = d3.geoPath().projection(projection);

            var countries = topojson.feature(data, data.objects.countries);
            console.log(countries);
    
            chartGroup.selectAll("path")
                .data(countries.features)
                .enter()
                .append("path")
                    .attr("class", "country")
                    .attr("d", d => pathGenerator(d))
                .append("title")
                    .text(d => d.properties.name)
    })};

    buildMap();
}

makeResponsive();