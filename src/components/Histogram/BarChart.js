import React, { Component } from "react";

class BarChart extends Component {


    render() {
        const { margins, data, svgDimensions, scales } = this.props
        const { xScale, yScale } = scales
        const { height } = svgDimensions

        return (
            <g>
                {data.map((d, i) => (
                    <rect
                        x={xScale(i)}
                        y={yScale(d)}
                        width={xScale.bandwidth()}
                        height={height - margins.bottom - yScale(d)}
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