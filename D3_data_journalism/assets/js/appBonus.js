// @TODO: YOUR CODE HERE!
//creating row for graph. will append a g group later
rowGraph = d3.select('.container').append('div').attr("class","row graph")

//defining svg area 
var svgHeight = 660;
var svgWidth = 960;

//defining chart's margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

//centering graph
var chartHeight = svgHeight - margin.top - margin.bottom
var chartWidth = svgWidth - margin.right - margin.left

//appending svg area and setting dimensions
var svg = rowGraph.append('svg').attr('height', svgHeight).attr('width', svgWidth);
// appending a group to svg area and translating it to the right and down
var chartGroup = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)


//Initial Parameters
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';

//creating scales FUNCTION
// x scale
function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain( [ d3.min(data, d => d[chosenXAxis])*0.5, d3.max(data, d => d[chosenXAxis]*1.1)] )
        .range([0,chartWidth])

    return xLinearScale
}
//y scale
function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain( [d3.min(data, d=>d[chosenYAxis]*0.5) ,d3.max(data, d=>d[chosenYAxis]*1.1)] )
        .range([chartHeight,0])

    return yLinearScale
}

//creating functions FUNCTION
// xAxis 
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)

    return xAxis;
}
// //yAxis
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis)

    return yAxis;
}
// appending x axis FUNCTION
// appending y axis

//function for updating circles group with transition to new circles
function renderXCircles(circlesGroup,newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cx', d => newXScale(d[chosenXAxis]))

    return circlesGroup;
}

function renderYCircles(circlesGroup,newYScale,chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr('cy', d => newYScale(d[chosenYAxis]))

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
    console.log(yLinearScale(data[0]['poverty']))
    //creating initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale)

    // appending initial x axis    
    xAxis = chartGroup.append('g')
        .classed('x-axis',true)
        .attr("transform",`translate(0,${chartHeight})`)
        .call(bottomAxis)

    // appending initial y axis
    yAxis = chartGroup.append('g')
        .classed('y-axis',true)
        .call(leftAxis)

    //append initial group for circles
    var circlesGroup = chartGroup.append('g').selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d[chosenXAxis]))
        .attr('cy', d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .classed('stateCircle',true);

    // group for state abbreviations
    chartGroup.append('g').selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xLinearScale(d[chosenXAxis]))
        .attr('y', d => yLinearScale(d[chosenYAxis])+5)
        .text(d=> d.abbr)
        .classed('stateText',true)
     
    
    // labels group
    //x labels
    var xLabelsGroup = chartGroup.append('g')
        .attr("transform", `translate(${chartWidth/2},${chartHeight})`)

    var povertyXLabel = xLabelsGroup.append('text')
        .attr('x',-30).attr('y',35)
        .attr('value','poverty')
        .classed('active',true)
        .text("In Poverty (%)")

    var ageXLabel = xLabelsGroup.append('text')
        .attr('x',-32).attr('y',55)
        .attr('value','age')
        .classed('inactive',true)
        .text("Age (Median)")

    var householdIncomeXLabel = xLabelsGroup.append('text')
        .attr('x',-30).attr('y',75)
        .attr('value','income')
        .classed('inactive',true)
        .text("Household Income (Median)")

    // y labels
    var yLabelsGroup = chartGroup.append('g')
        .attr('transform',`translate(0,${chartHeight/2}) rotate(-90)`);

    var healthcareYLabel = yLabelsGroup
        .append('text')
        .attr('x',0).attr('y',-40)
        .attr('value','healthcare')
        .classed('active',true)
        .text('Lacks Healthcare (%)')
    
    var smokesYlabel = yLabelsGroup
        .append('text')
        .attr('x',0).attr('y',-60)
        .attr('value','smokes')
        .classed('inactive', true)
        .text('Smokes (%)')

    var obeseYLabel = yLabelsGroup
        .append('text')
        .attr('x',0).attr('y',-80)
        .attr('value','obesity')
        .classed('inactive', true)
        .text('Obese (%)')

    xLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr('value');
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                
                //updating x scale and x axis 
                xLinearScale = xScale(data, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);

                //updating circles with new x values
                circlesGroup = renderXCircles(circlesGroup,xLinearScale,chosenXAxis);
                
                if (chosenXAxis === 'age') {
                    ageXLabel
                        .classed('active',true)
                        .classed('inactive', false)
                    povertyXLabel
                        .classed('active',false)
                        .classed('inactive',true)
                    householdIncomeXLabel
                        .classed('active',false)
                        .classed('inactive', true)
                } else if (chosenXAxis === 'income') {
                    ageXLabel
                        .classed('active',false)
                        .classed('inactive', true)
                    povertyXLabel
                        .classed('active',false)
                        .classed('inactive',true)
                    householdIncomeXLabel
                        .classed('active',true)
                        .classed('inactive', false)
                } else {
                    ageXLabel
                        .classed('active',false)
                        .classed('inactive', true)
                    povertyXLabel
                        .classed('active',true)
                        .classed('inactive',false)
                    householdIncomeXLabel
                        .classed('active',false)
                        .classed('inactive', true)
                }
            // end of if statement
            }
        //end of x axis on-click function
        })
    

    //updating circles position on y axis
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr('value');
            if (value !== chosenYAxis) {
                chosenYAxis = value;
                
                //updating x scale and x axis 
                yLinearScale = yScale(data, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);

                //updating circles with new x values
                circlesGroup = renderYCircles(circlesGroup,yLinearScale,chosenYAxis);
                
                if (chosenYAxis === 'smokes') {
                    healthcareYLabel
                        .classed('active',false)
                        .classed('inactive', true)
                    smokesYlabel
                        .classed('active',true)
                        .classed('inactive', false)
                    obeseYLabel
                        .classed('active',false)
                        .classed('inactive', true)
                } else if (chosenYAxis === 'obesity') {
                    healthcareYLabel
                        .classed('active',false)
                        .classed('inactive', true)
                    smokesYlabel
                        .classed('active',false)
                        .classed('inactive', true)
                    obeseYLabel
                        .classed('active',true)
                        .classed('inactive', false)
                } else {
                    healthcareYLabel
                        .classed('active',true)
                        .classed('inactive', false)
                    smokesYlabel
                        .classed('active',false)
                        .classed('inactive', true)
                    obeseYLabel
                        .classed('active',false)
                        .classed('inactive', true)
                }
            // end of if statement
            }
        // end of y axis on click function
        })

    

//end of 'then'
})