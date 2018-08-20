import React, { Component } from "react";
import { Transform } from "stream";

class BarChart extends Component {


    render() {
        const { margin, data, svgDimensions, scales, height } = this.props
        const { xScale, yScale } = scales
        //const { height } = svgDimensions

        return (
            <g transform={`translate(${[margin.left, margin.top]})`}>
                {data.map((d, i) => (
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
                ))}
            </g>
        );
    }
}

export default BarChart;