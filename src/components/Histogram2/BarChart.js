import React, { Component } from "react"

class BarChart extends Component {


    render() {
        const { margin, data, scales, height } = this.props
        const { xScale, yScale } = scales
        //const { height } = svgDimensions

        console.log(data)

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