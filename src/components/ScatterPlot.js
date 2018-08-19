import React from 'react'
import * as d3 from 'd3'
import _ from 'lodash'
import Chart from './chart'
import store from './store'

class ScatterPlot extends React.Component {

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
            xAccessor, yAccessor,
            radius
        } = this.props;

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;
        radius = radius || 2;

        let all = group.all();

        x = x || d3.scaleLinear()
            .domain(d3.extent(all, xAccessor))
            .range([0, width]);

        y = y || d3.scaleLinear()
            .domain(d3.extent(all, yAccessor))
            .range([height, 0]);

        const plotX = _.flow(xAccessor, x);
        const plotY = _.flow(yAccessor, y);

        const brush = d3.brush()
            .extent([[0, 0], [width, height]])

        //.extent([x.range(),y.range()])

        const {
            g,
            xAxis, yAxis,
            xAxisGroup, yAxisGroup
        } = Chart.create(this.component, margin, width, height, x, y);

        xAxis.ticks(6);
        yAxis.ticks(6);

        let circlesGroup = g.append('g')

        const brushGroup = g.append('g')
            .attr('class', 'brush')
            .call(brush);

        function redraw() {

            let all = group.all();



            xAxisGroup.call(xAxis);
            yAxisGroup.call(yAxis);

            let circles = circlesGroup
                .selectAll('circle')
                .data(all);

            circles.exit().remove();

            circles.enter().append('circle')
                .merge(circles)
                .attr('r', radius)
                .attr('cx', plotX)
                .attr('cy', plotY);




        }

        redraw();

        this.chart = {
            margin,
            width, height,
            x, y,
            xAxis, yAxis,
            xAccessor, yAccessor,
            xAxisGroup, yAxisGroup,
            //circles,
            radius,
            brush, brushGroup,
            redraw
        };

        store.charts.push(this.chart);

        brush
            .on('brush', this.onBrush)
            .on('end', this.onBrushEnd);
    }

    onBrush = () => {
        //console.log(d3.event.selection)
        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
        } else {
            //const extent = d3.event.selection;

            let extents = d3.event.selection.map(d => {
                return [this.chart.x.invert(d[0]), this.chart.y.invert(d[1])]
            });

            // filter example
            // [[105.5859375, 7.929703856616639], [181.2890625, 6.757488482297106]]

            // d example
            // [136.46484375, 7.068309416649811]
            this.props.dimension.filterFunction(d => {
                //console.log(d)
                return (extents[0][0] <= d[0] && d[0] <= extents[1][0]) &&
                (extents[0][1] >= d[1] && d[1] >= extents[1][1]);
            });
        }

        this.props.redrawAll();
    }
    onBrushEnd = () => {
        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
            this.props.redrawAll();
        }
    }

    render() {
        return <svg ref={el => this.component = el} className='chart'>{this.props.children}</svg>;
    }
}

ScatterPlot.defaultProps = {
    margin: { top: 32, left: 32, bottom: 32, right: 32 },
    width: 320,
    height: 320,
    //xAccessor: d => d.key
}

export default ScatterPlot 