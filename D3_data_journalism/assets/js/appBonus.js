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

//creating scales FUNCTION
// x scale
// y scale

//creating initial axis functions FUNCTION

// appending x axis FUNCTION
// appending y axis
//reading in csv data

//group for circles

// group for state abbreviations
d3.csv('assets/data/data.csv').then(data => {

    //parsing data  
    var stateAbbr = data.map(d => d.abbr) 
    var percentPoverty = data.map(d => +d.poverty)
    var percentLacksHealth = data.map(d =>+d.healthcare)
    //checking if values are int
    console.log(percentLacksHealth)

    //creating scales
    // x scale
    xScale = d3.scaleLinear().domain([d3.min(percentPoverty)-1,d3.max(percentPoverty)+1]).range([0,chartWidth])
    console.log(xScale)
    console.log(d3.extent(percentPoverty))

    // y scale
    yScale = d3.scaleLinear().domain([d3.min(percentLacksHealth)-2,d3.max(percentLacksHealth)+2]).range([chartHeight,0])
    console.log(d3.extent(percentLacksHealth))

    //creating initial axis functions
    var bottomAxis = d3.axisBottom(xScale)
    var leftAxis = d3.axisLeft(yScale)

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

    xLabelsGroup.append('text').attr('x',-30).attr('y',32).text("Percent Rate of Poverty")

    var yLabelsGroup = chartGroup.append('g').attr('transform',`translate(0,${chartHeight/2}) rotate(-90)`);
    yLabelsGroup.append('text').attr('x',-100).attr('y',-30).text('Percent Lack of Healthcare')
})
