import React from 'react'
import * as d3 from 'd3'
import _ from 'lodash'
import Chart from './chart'
import store from './store'

class LineChart extends React.Component{

    chart = null
    
    componentDidMount() {
        let {
            group,
            margin,
            width, height,
            x, y,
            xAccessor, yAccessor
        } = this.props;

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        let all = group.all();

        x = x || d3.scaleLinear()
            .domain(d3.extent(all, xAccessor))
            .range([0, width]);

        y = y || d3.scaleLinear()
            .domain(d3.extent(all, yAccessor))
            .range([height, 0]);

        const line = d3.line()
            .x(_.flow(xAccessor, x))
            .y(_.flow(yAccessor, y));

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

        const linePath = g.append('path')
            .attr('class', 'line');

        const brushGroup = g.append('g')
            .attr('class', 'brush')
            .call(brush);

        brushGroup.selectAll('rect')
            .attr('height', height);

        function redraw() {
            all = group.all().filter(d => d.value);
            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);
            linePath.datum(all).attr('d', line);
        }

        redraw();

        this.chart = {
            margin,
            width, height,
            x, y,
            xAxis, yAxis,
            xAccessor, yAccessor,
            xAxisGroup, yAxisGroup,
            line, linePath,
            brush, brushGroup,
            redraw
        };

        store.charts.push(this.chart);

        brush
            .on('brush', this.onBrush)
            .on('end', this.onBrushEnd);
    }

    onBrush = () => {
        //console.log(this.chart.brush.extent().call())

        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
        } else {
            const extent = d3.event.selection//this.chart.brush.extent().call();
            this.props.dimension.filter(extent);
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
        // console.log( "store.charts --> ", store.charts );

        return <svg ref={el => this.component = el} className='chart'>{this.props.children}</svg>;
    }
}

LineChart.defaultProps = {
    margin: { top: 32, left: 32, bottom: 32, right: 32 },
    width: 320,
    height: 320,
    xAccessor: d => d.key
}

export default LineChart