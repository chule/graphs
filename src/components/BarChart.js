import React from 'react'
import * as d3 from 'd3'
import Chart from './chart'
import store from './store'

class BarChart extends React.Component {

    // getDefaultProps() {
    //     return {
    //         margin: { top: 32, left: 32, bottom: 32, right: 32 },
    //         width: 320,
    //         height: 320,
    //         xAccessor: d => d.key
    //     };
    // }

    chart = null

    componentDidMount() {
        let {
            group,
            margin,
            width, height,
            x, y,
            //xAccessor, 
            yAccessor,
            padding
        } = this.props;

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;
        padding = padding || 1;

        const all = group.all();

        let extent = d3.extent(all, yAccessor)


        x = x || d3.scaleLinear()
            .domain([Math.floor(extent[0]), Math.floor(extent[1])])
            .range([0, width]);

        const histogram = d3.histogram()
            .value(d => d.value)
            .domain(x.domain())
            .thresholds(5);

        y = y || d3.scaleLinear()
            .domain([0, d3.max(histogram(all), d => d.length)])
            .range([height, 0]);

        const brush = d3.brushX()
            .extent([[0, 0], [width, height]])
        //.x(x);

        const {
            g,
            xAxis, yAxis,
            xAxisGroup, yAxisGroup
        } = Chart.create(this.component, margin, width, height, x, y);

        xAxis.ticks(6);
        yAxis.ticks(6);

        let barsGroup = g.append('g')
            .attr('class', 'bars');
        // console.log("g MOUNT --> ", g);
        // console.log("bars MOUNT --> ", bars);

        const brushGroup = g.append('g')
            .attr('class', 'brush')
            .call(brush);

        brushGroup.selectAll('rect')
            .attr('height', height);

        function redraw() {

            //bars.selectAll('.bar').remove()

            const all = group.all().filter(d => d.value);


            //console.log(histogram(all))

            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);

            let bars = barsGroup
                .selectAll('.bar')
                .data(histogram(all));
            //console.log("bars REDRAW --> ", bars);

            bars.exit().remove()

            bars.enter().append('rect')
                .attr('class', 'bar')
                // .attr('x', d => x(d.x1))
                // .attr('y', d => y(d.length))
                // .attr("width", function (d) { return x(d.x1) - x(d.x0) - padding; })
                // .attr("height", function (d) { return height - y(d.length); })
                .merge(bars)
                .attr('x', d => x(d.x0))
                .attr('y', d => y(d.length))
                .attr("width", function (d) { return x(d.x1) - x(d.x0) - padding; })
                .attr("height", function (d) { return height - y(d.length); })



        }

        redraw();

        this.chart = {
            // margin,
            // width, height,
            x, y,
            // xAxis, yAxis,
            // xAccessor, yAccessor,
            // xAxisGroup, yAxisGroup,
            // //bars,
            // padding,
            // brush, brushGroup,
            redraw
        };

        store.charts.push(this.chart);

        brush
            .on('brush', this.onBrush)
            .on('end', this.onBrushEnd);
    }

    onBrush = () => {

        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
        } else {
            //const extent = d3.event.selection;
            let extents = d3.event.selection.map(this.chart.x.invert);

            this.props.dimension.filter(extents);
        }

        this.props.redrawAll();
    }
    onBrushEnd = () => {
        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
            this.props.redrawAll();
        }
    }

    shouldComponentUpdate() {
        this.chart.redraw();
        return false;
    }

    render() {
        return <svg ref={el => this.component = el} className='chart'>{this.props.children}</svg>;
    }
};

BarChart.defaultProps = {
    margin: { top: 32, left: 32, bottom: 32, right: 32 },
    width: 320,
    height: 320,
    xAccessor: d => d.key
}

export default BarChart