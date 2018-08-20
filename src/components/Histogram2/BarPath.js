import React, { Component } from "react"
import * as d3 from 'd3'

class BarPath extends Component {

    state = {
        brush: null
    }

    componentDidMount() {

        const { height, width } = this.props

        function resizePath(d) {
            const e = +(d.type === 'e');
            const x = e ? 1 : -1;
            const y = height / 3;
            return `M${0.5 * x},${y}A6,6 0 0 ${e} ${6.5 * x},${y + 6}V${2 * y - 6}A6,6 0 0 ${e} ${0.5 * x},${2 * y}ZM${2.5 * x},${y + 8}V${2 * y - 8}M${4.5 * x},${y + 8}V${2 * y - 8}`;
        }

        const brush = d3.brushX()
            .extent([[0, 0], [width, height]])

        let gBrush = d3.select(this.brush).append('g')
            .attr('class', 'brush')
            .call(brush);

        brush
            .on('brush', this.onBrush)
            .on('end', this.onBrushEnd);


        gBrush.selectAll('.handle--custom')
            .data([{ type: 'w' }, { type: 'e' }])
            .enter().append('path')
            .attr('class', 'brush-handle')
            .attr('cursor', 'ew-resize')
            .attr('d', resizePath)
            .style('display', 'none');


    }

    onBrush = () => {
        const { scales} = this.props
        const { xScale } = scales

        if (d3.event.selection === null) {
            this.props.dimension.filterAll();

        } else {

            d3.select(this.brush).selectAll('.brush-handle')
            .style('display', null)
            .attr('transform', (d, i) => `translate(${d3.event.selection[i]}, 0)`);

            this.setState(() => ({
                brush: d3.event.selection
            }))

            let extents = d3.event.selection.map(xScale.invert);

            this.props.dimension.filter(extents);
        }

        this.props.redrawAll();
    }

    onBrushEnd = () => {
        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
            this.props.redrawAll();
            this.setState(() => ({
                brush: null
            }))
            d3.select(this.brush).selectAll('.brush-handle')
            .style('display', 'none')
        }
        // else {
        //     this.setState(() => ({
        //         brush: d3.event.selection
        //     }))
        // }
    }

    render() {
        const { margin, data, scales, height, width } = this.props
        const { xScale, yScale } = scales
        //const { height } = svgDimensions

        let groups = data.map(d => {
            return { key: d.x0, value: d.length }
        })

        function barPath(groups) {
            const path = [];
            let i = -1;
            const n = groups.length;
            let d;
            while (++i < n) {
                d = groups[i];
                path.push('M', xScale(d.key), ',', height, 'V', yScale(d.value), 'h' + ((width / n) - 1) + 'V', height);
            }
            return path.join('');
        }

        return (
            <g transform={`translate(${[margin.left, margin.top]})`}>
                {this.state.brush &&
                    <clipPath id="clip">
                        <rect width={this.state.brush[1] - this.state.brush[0]} height={height} x={this.state.brush[0]}>
                        </rect>
                    </clipPath>
                }

                <path className="background bar" fill='#ccc' d={barPath(groups)}> </path>
                <path className="foreground bar" fill='#B42436' clipPath="url(#clip)" d={barPath(groups)}> </path>
                <g ref={el => this.brush = el}> </g>
            </g>
        );
    }
}

export default BarPath;