import * as d3 from 'd3'

const Chart = {
    create(el, margin, width, height, x, y) {
        // margins have been subtracted from width and height.
        const svg = Chart.setSize(el, margin, width, height);
        const g = Chart.createGroup(svg, margin);

        return {
            svg,
            g,
            xAxis: Chart.createXAxis(x),
            yAxis: Chart.createYAxis(y),
            xAxisGroup: Chart.createXAxisGroup(g, height),
            yAxisGroup: Chart.createYAxisGroup(g)
        };
    },

    setSize(el, margin, width, height) {
        return d3.select(el)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);
    },

    createGroup(svg, margin) {
        return svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    createXAxis(x) {
        return d3.axisBottom()
            .scale(x)

    },

    createYAxis(y) {
        return d3.axisLeft()
            .scale(y)
    },

    createXAxisGroup(g, height) {
        return g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')');
    },

    createYAxisGroup(g) {
        return g.append('g')
            .attr('class', 'y axis');
    }
};

export default Chart