import * as d3 from "npm:d3";
export function Bar_points(
    data
) {
    // set the graph 
    const margin = { top: 7, right:7, bottom: 20, left: 20},
        total_width = 70,
        total_height = 70,
        width = total_width - margin.left - margin.right,
        height = total_height - margin.top - margin.bottom;

    var svg = d3.create("svg")
        .attr("width", total_width)
        .attr("height", total_height)
        .attr('transform', "scale(3)")

    // clean the data


    var stat = d3.rollup(data,
        v => {
            const mean = d3.mean(v, data => data.express);
            const sd = d3.deviation(v, data => data.express);
            const max = mean + sd;
            const min = mean - sd;
            return { mean: mean, sd: sd, max: max, min: min };
        },
        data => data.label)
    stat.forEach(values => { console.log(values) });
    var stat_data = [...stat].map((
        [key, value]) => ({ key: key, value: value })); // array 转化为 map对象

    var max = d3.max(data, d => d.express);
    // set the axis
    const xScale = d3.scaleBand()
        .domain(stat_data.map(d => d.key))
        .range([0, width])
        .paddingInner(0.5)
        .paddingOuter(0.1);

    const yScale = d3.scaleLinear()
        .domain([Math.ceil(max), 0])
        .range([0, height])
        .nice();

    svg.append("g").call(d3.axisBottom(xScale).tickSizeInner(2).tickSizeOuter(0))
        .attr('transform', `translate(${margin.left},${height + margin.top})`)
        .attr('font-size', 5)
        .attr('stroke-width',.5);

    svg.append("g").call(d3.axisLeft(yScale).ticks(3).tickSizeInner(2).tickSizeOuter(2))
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('font-size', 5)
        .attr('stroke-width',.5);

    svg.selectAll('rect')
        .data(stat_data)
        .join('rect')
        .attr('y', d => { return yScale(d.value.mean) })
        .attr('width', xScale.bandwidth())
        .attr('height', function (d) { return height - yScale(d.value.mean) })
        .attr('x', function (d) { return xScale(d.key) })
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('fill', '#ccc')
        .attr('stroke', '#000000')
        .attr('stroke-width',.5);
    // add the err line
    svg.selectAll('.error-line')
        .data(stat_data)
        .enter().append('line')
        .attr("x1", d => { return xScale(d.key) + xScale.bandwidth() / 2 })
        .attr("x2", d => { return xScale(d.key) + xScale.bandwidth() / 2 })
        .attr("y1", d => { return yScale(d.value.max) })
        .attr("y2", d => { return yScale(d.value.min) })
        .attr('stroke', 'black')
        .attr("width", 80)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('stroke-width',.5)


    // add the top capture
    svg.selectAll('.error-topline')
        .data(stat_data)
        .enter().append('line')
        .attr("x1", d => { return xScale(d.key) + xScale.bandwidth() / 4 })
        .attr("x2", d => { return xScale(d.key) + xScale.bandwidth() / 4 * 3 })
        .attr("y1", d => { return yScale(d.value.min) })
        .attr("y2", d => { return yScale(d.value.min) })
        .attr('stroke', 'black')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('stroke-width',.5)

    // add the bottom capture 
    svg.selectAll('.error-botline')
        .data(stat_data)
        .enter().append('line')
        .attr("x1", d => { return xScale(d.key) + xScale.bandwidth() / 4 })
        .attr("x2", d => { return xScale(d.key) + xScale.bandwidth() / 4 * 3 })
        .attr("y1", d => { return yScale(d.value.max) })
        .attr("y2", d => { return yScale(d.value.max) })
        .attr('stroke', 'black')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('stroke-width',.5)
        

    // jitter plot
    var jitterWidth = xScale.bandwidth() / 2
    svg
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return (
                xScale(d.label) + jitterWidth + (Math.random() * 2 - 1) * jitterWidth / 2
            )
        })
        .attr("cy", function (d) { return (yScale(d.express)) })
        .attr("r", 1)
        .style("fill", "white")
        .attr("stroke", "black")
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .attr('stroke-width',.5)
        .attr('board-width',.5)

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 14)
        .text("Label")
        .attr('font-size', 5);

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 12)
        .attr("x", -margin.top - height / 2)
        .text("Relative expression")
        .attr('font-size', 5)
    
    return svg.node();
}
