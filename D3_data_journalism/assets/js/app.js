// @TODO: YOUR CODE HERE!
//creating row for graph. will append a g group later
rowGraph = d3.select('.container').append('div').attr("class","row graph")

//defining svg area 
var svgHeight = 660;
var svgWidth = 960;

//defining chart's margins as an object
var margin = {
    top:30,
    bottom:30,
    left:30,
    right:30
};

//centering graph
var chartHeight = svgHeight - margin.top - margin.bottom
var chartWidth = svgWidth - margin.right - margin.left

//appending svg area and setting dimensions
var svg = rowGraph.append('svg').attr('height', svgHeight).attr('width', svgWidth);
// appending a group to svg area and translating it to the right and down
var chartGroup = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)




    

//reading in csv data
d3.csv('assets/data/data.csv').then(data => {

    //parsing data
    var stateAbbr = data.map(d => d.abbr) 
    var percentPoverty = data.map(d => +d.poverty)
    var percentLacksHealth = data.map(d =>+d.healthcare)
    //checking if values are int
    console.log(percentLacksHealth)

    //creating scales
    // x scale
    xScale = d3.scaleLinear().domain([0,d3.max(percentPoverty)]).range([0,chartWidth])
    console.log(xScale)
    console.log(d3.extent(percentPoverty))

    // y scale
    yScale = d3.scaleLinear().domain([0,d3.max(percentLacksHealth)]).range([chartHeight,0])
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

    chartGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d=> xScale(+d.poverty))
        .attr('cy', d=> yScale(+d.healthcare))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    chartGroup.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(d=> d.abbr)
        .attr('x', d => xScale(+d.poverty)-10)
        .attr('y', d => yScale(+d.healthcare))
        .attr('fill','red')
        
        
})
