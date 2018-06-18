// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.


// svg container
var svgHeight = 500;
var svgWidth = 1000;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#svg-area").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/data.csv", function(error, censusData) {

    // Log an error if one exists
    if (error) return console.warn(error);
  
    // Print the censusData
    console.log(censusData);


// grab obesity for one of our arrays
var obesity = censusData.map(data => data.obesity);
console.log("obesity", obesity);

// grab poverty for the other array
var poverty = censusData.map(data => data.poverty);
console.log("poverty", poverty);


// Step 1: Parse Data/Cast as numbers
   // ==============================
  censusData.forEach(function(data) {
    data.obesity = parseInt(data.obesity);
    data.poverty = parseInt(data.poverty);
  });

// Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    //.domain([0,21])
    .domain([0, d3.max(censusData, data => data.poverty)])
    .range([0, chartWidth]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, data => data.obesity)])
    .range([chartHeight, 0]);

  // Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "15")
  .attr("fill", "purple")
  .attr("opacity", ".5");

  // Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
    });

  // reate tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
});