const aw = {};
aw.line = {};
aw.chart = {};
aw.chart.linechart = {};
aw.utilities = {};

const utils = new Utils();
const lc = new LineChart(500, 500);

document.addEventListener("DOMContentLoaded", function() {

    const data = lc.data;

    lc.xScale = d3.scaleTime().range([0, lc.width]);
    lc.yScale = d3.scaleLinear().range([lc.height, 0]); // output

    aw.chart.createSVG();

    aw.line.computeLine = aw.computeLine(args = { x: "date", y: "sessions"});

    aw.data = aw.transformData(data);
    aw.setXDomain("date");
    aw.setYDomain("sessions");   
    aw.drawLine();
    aw.drawXAxis();
    aw.drawYAxis();

    let dotsConfig = {
        cx: {
            args: "date"
        },
        cy: {
            args: "sessions"
        }
    }

    aw.dots(dotsConfig, { cls: "add", radius:10});
});

/**
 * Create the SVG chart
 */
aw.chart.createSVG = () => {
    aw.chart.svg = d3.select("body")
                .append("svg")
                .attr("width", lc.width + lc.margin.left + lc.margin.right)
                .attr("height", lc.height + lc.margin.top + lc.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + lc.margin.left + "," + lc.margin.top + ")");
}

/**
 * Transforms the data, specifically the date to be readable
 * @param dataset: array of data
 */
aw.transformData = (dataset) => {

    let parseTime = utils.parseTime();

    return dataset.map((val, i, arr) => {
        return {
            date: parseTime(val.date),
            sessions: val.sessions
        }
    });
}
/**
 * Compute the points on the line
 * @param args: x and y properties to specify each point
 * @param addCurve: add curving to the line, defaulted to true.
 */
aw.computeLine = (args, addCurve = true) => {
    let line =  d3.line()
        .x(function(d) { return lc.xScale(d[args.x]); }) 
        .y(function(d) { return lc.yScale(d[args.y]); });

    if(addCurve) line.curve(d3.curveMonotoneX);
    
    return line;
}

/**
 * Draw line
 * @param cls: add additional classes for UI styling 
 */
aw.drawLine = (cls= "") => {
    aw.chart.svg.append("path")
        .data([aw.data]) 
        .attr("class", "line " + cls) 
        .attr("d", aw.line.computeLine);
}

/**
 * Sets domain for the X scale
 * @param args: property to filter on 
 */
aw.setXDomain = (args) => {
    
    if(!args) return;

    lc.xScale.domain(d3.extent(aw.data, function(d) { return d[args]; }));
}

/**
 * Sets domain for the Y scale
 * @param args: property to filter on 
 */
aw.setYDomain = (args) => {

    if(!args) return;

    lc.yScale.domain([0, d3.max(aw.data, function(d) { return d[args]; })]);
}

/** 
* Draws the X Axis onto the svg
* @param: additional classes for styling
* TODO: remove tick format to be more generic and configurable
*/
aw.drawXAxis = (cls = "") => {

    aw.chart.svg.append("g")
        .attr("class", "x-axis " + cls)
        .attr("transform", "translate(0," + lc.height + ")")
        .call(d3.axisBottom(lc.xScale)
                .ticks(aw.data.length)
                .tickFormat(d3.timeFormat("%d-%b-%y")));
}


/**
* Draws the Y Axis onto the svg
* @param: additional classes for styling
*/
aw.drawYAxis = (cls = "") => {

    aw.chart.svg.append("g")
        .attr("class", "y-axis " + cls)
        .call(d3.axisLeft(lc.yScale));
}


/**
* Add dots to line graph to specify points
* @param params: configurable args for altering cx and cy points.
* @param overrides: custom UI overrides such as additional classes or change circle radius size
*/
aw.dots = (params, overrides) => {

    let radius = 5;
    let cls = "";
    let cx = {}, cy = {};
    
    cx.fn = lc.xScale;
    cy.fn = lc.yScale;

    if("fn" in params.cx) cx.fn = params.cx.fn;
    if("fn" in params.cy) cy.fn = params.cy.fn;
    if("cls" in overrides) cls += overrides.cls;
    if("radius" in overrides) radius = overrides.radius;

    aw.chart.svg.selectAll(".dot")
        .data(aw.data)
        .enter().append("circle")
        .attr("class", "dot " + cls) 
        .attr("cx", function(d, i) { return cx.fn(d[params.cx.args])})
        .attr("cy", function(d) { return cy.fn(d[params.cy.args]) })
        .attr("r", radius);
}
