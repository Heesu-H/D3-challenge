// @TODO: YOUR CODE HERE!
//creating row for graph. will append a g group later
rowGraph = d3.select('.container').append('div').attr("class","row graph")

//defining svg area 
var svgHeight = 660;
var svgWidth = 960;

//defining chart's margins as an object
var margin = {
    top:30,
    bottom:40,
    left:45,
    right:30
};

//centering graph
var chartHeight = svgHeight - margin.top - margin.bottom
var chartWidth = svgWidth - margin.right - margin.left

//appending svg area and setting dimensions
var svg = rowGraph.append('svg').attr('height', svgHeight).attr('width', svgWidth);
// appending a group to svg area and translating it to the right and down
var chartGroup = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)


//Initial Parameters
var chosenXAxis = 'In Poverty (%)'
var chosenYAxis = 'Lacks Healthcare (%)'

//creating scales FUNCTION
// x scale
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) , d3.max(data, d => d[chosenXAxis])])
        .range([0,chartWidth])

    return xLinearScale
}
// // y scale
// function yScale(data, chosenYAxis) {
//     var yLinearScale = d3.scaleLinear()
//         .domain([d3.min(data, d => d[chosenYAxis]) , d3.max(data, d => d[chosenYAxis])])
//         .range([0,chartHeight])

//     return yLinearScale
// }

//creating initial axis functions FUNCTION
// xAxis 
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisbottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)
}
// //yAxis
// function renderYAxis(newYScale, yAxis) {
//     var leftAxis = d3.axisleft(newYScale);

//     yAxis.transition()
//         .duration(1000)
//         .call(bottomAxis)
// }
// appending x axis FUNCTION
// appending y axis

//function for updating circles group with transition to new circles
function renderCircles(circlesGroup,newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', newXScale(d[chosenXAxis]))

    return circlesGroup;
}

// Retrieve data from CSV file and create graph
d3.csv('assets/data/data.csv').then(data => {

    //parsing data  
    var stateAbbr = data.map(d => d.abbr);
    //x axis
    var percentPoverty = data.map(d => +d.poverty);
    var ageMedian = data.map(d => +d.age);
    var householdIncome = data.map(d => +d.income);
    //y axis
    var percentLacksHealth = data.map(d => +d.healthcare);
    var obese = data.map(d => +d.obesity);
    var smokers = data.map(d => +d.smokes);

    //checking if values are int
    console.log(percentPoverty);

    //creating initial scales
    // xLinearScale
    var xLinearScale = xScale(data, chosenXAxis);

    // yLinearScale
    var yLinearScale = yScale(data, chosenYAxis);

    //creating initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale)

    // appending x axis    
    chartGroup.append('g')
        .classed('x-axis',true)
        .attr("transform",`translate(0,${chartHeight})`)
        .call(bottomAxis)

    // appending y axis
    chartGroup.append('g')
        .classed('y-axis',true)
        .call(leftAxis)

    //group for circles
    chartGroup.append('g').selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=> xScale(+d.poverty))
        .attr('cy', d=> yScale(+d.healthcare))
        .attr("r", 20)
        .attr("fill", "lightsteelblue")
        .attr("opacity", ".5");

    // group for state abbreviations
    chartGroup.append('g').selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(d=> d.abbr)
        .attr('x', d => xScale(+d.poverty)-11)
        .attr('y', d => yScale(+d.healthcare)+5)
        .attr('fill','steelblue')
    
    // labels group
    var xLabelsGroup = chartGroup.append('g')
        .attr("transform", `translate(${chartWidth/2},${chartHeight})`)

    xLabelsGroup.append('text').attr('x',-30).attr('y',32).text("In Poverty (%)")

    var yLabelsGroup = chartGroup.append('g').attr('transform',`translate(0,${chartHeight/2}) rotate(-90)`);
    yLabelsGroup.append('text').attr('x',-100).attr('y',-30).text('Lacks Healthcare (%)')
})
