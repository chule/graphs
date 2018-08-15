import React, { Component } from 'react'
import BarChart from "./BarChart"
import Axes from './Axes'
import * as d3 from "d3";
import ResponsiveWrapper from './ResponsiveWrapper'


class Histogram extends Component {

    state = {
        margins: { top: 25, right: 15, bottom: 50, left: 35 },
        size: {},
        xScale: d3
            .scaleBand()
            .domain(d3.range(0, this.props.data.length))
            .range([0, Math.max(this.props.parentWidth, 300)]),

        yScale: d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data)])
            .range([0, Math.max(this.props.parentHeight, 400)])
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let { xScale, yScale } = prevState;

        xScale.domain(d3.range(0, nextProps.data.length));
        yScale.domain([0, d3.max(nextProps.data)]);

        prevState = { ...prevState, xScale, yScale };
        return prevState;
    }

    render() {

        //const { xScale, yScale, margins } = this.state;

        const svgDimensions = {
            width: Math.max(this.props.parentWidth, 300),
            height: Math.max(this.props.parentHeight, 200)
        }

        const margins = { top: 50, right: 20, bottom: 100, left: 60 }

        const xScale = d3
            .scaleBand()
            .domain(d3.range(0, this.props.data.length))
            .range([margins.left, svgDimensions.width - margins.right])

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data)])
            .range([svgDimensions.height - margins.bottom, margins.top])

        return (


            <svg width={svgDimensions.width} height={svgDimensions.height}>
                <BarChart
                    scales={{ xScale, yScale }}
                    margins={margins}
                    data={this.props.data}
                    //maxValue={maxValue}
                    svgDimensions={svgDimensions}
                />
                <Axes
                    scales={{ xScale, yScale }}
                    margins={margins}
                    svgDimensions={svgDimensions}
                />
            </svg>
        )
    }
}

export default ResponsiveWrapper(Histogram)