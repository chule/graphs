import React, { Component } from "react"
import * as d3 from 'd3'

class BarPath extends Component {

    state = {
        brush: null
    }

    componentDidMount() {

        const { margin, data, scales, height, width } = this.props

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
        const { margin, data, scales, height, width } = this.props
        const { xScale, yScale } = scales

        if (d3.event.selection === null) {
            this.props.dimension.filterAll();
            // d3.select(this.brush).selectAll('.brush-handle')
            // .style('display', 'none')

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
        //M0,325V307.71276595744683h9V325M132.6,325V179.7872340425532h9V325M265.2,325V0h9V325M397.8,325V69.14893617021275h9V325M530.4,325V200.53191489361703h9V325
        console.log(this.state.brush)

        return (
            <g transform={`translate(${[margin.left, margin.top]})`}>
                {this.state.brush &&
                    <clipPath id="clip">
                        <rect width={this.state.brush[1] - this.state.brush[0]} height={height} x={this.state.brush[0]}>
                        </rect>
                    </clipPath>
                }
                {/* {data.map((d, i) => (
                    <rect
                        x={xScale(d.x0)}
                        y={yScale(d.length)}
                        width={xScale(d.x1) - xScale(d.x0) -1}
                        height={height - yScale(d.length)}
                        style={{
                            fill: "darkred"
                        }}

                        key={i}
                    />
                ))} */}


                <path className="background bar" fill='#ccc' d={barPath(groups)}> </path>
                <path className="foreground bar" fill='darkred' clipPath="url(#clip)" d={barPath(groups)}> </path>
                <g ref={el => this.brush = el}> </g>
            </g>
        );
    }
}

export default BarPath;