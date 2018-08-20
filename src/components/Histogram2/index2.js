import React, { Component } from 'react'
import BarChart from "./BarChart2"
import Axes from './Axes'
import * as d3 from "d3";
import ResponsiveWrapper from './ResponsiveWrapper'
import store from '../store'

class Histogram extends Component {

    state = {
        margin: { top: 25, right: 15, bottom: 50, left: 35 },
        size: {},
        xScale: null,
        yScale: null,
        histogram: null,
        svgDimensions: null,
        all: this.props.group.all(),
        width: null,
        heigth: null
        // redraw: () => {
        //     let all = this.props.group.all().filter(d => d.value)
        //     //console.log(all)

        //     return all
        // }


    };

    componentDidMount() {

        let { group } = this.props

        let redraw = () => {

            const all = group.all().filter(d => d.value);

            this.setState(oldState => ({
                all
            }))

        }


        redraw();

        let chart = {
            redraw
        };

        store.charts.push(chart);
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        let { xScale, yScale, margin, histogram, all } = prevState;

        let {
            group,
            // margin,
            // width, height,
            // x, y,
            xAccessor,
            yAccessor,
            padding,
            parentWidth,
            parentHeight
        } = nextProps;

        const svgDimensions = {
            width: Math.max(parentWidth, 400),
            height: Math.max(parentHeight, 300)
        }

        let width = svgDimensions.width - margin.left - margin.right;
        let height = svgDimensions.height - margin.top - margin.bottom;

        //all = redraw()//group.all().filter(d => d.value);

        //console.log(all)

        let extent = d3.extent(all, yAccessor)

        xScale = d3.scaleLinear()
            .domain([Math.floor(extent[0]), Math.floor(extent[1])])
            .range([0, width]);

        histogram = d3.histogram()
            .value(d => d.value)
            .domain(xScale.domain())
            .thresholds(5);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(histogram(all), d => d.length)])
            .range([height, 0]);


        prevState = { ...prevState, xScale, yScale, histogram, svgDimensions, width, height };
        return prevState;
    }

    render() {

        const { xScale, yScale, margin, svgDimensions, histogram, all, width, height } = this.state;

        console.log("render", all)

        return (

            <svg width={svgDimensions.width} height={svgDimensions.height}>
                <BarChart
                    scales={{ xScale, yScale }}
                    margin={margin}
                    data={histogram(all)}
                    //maxValue={maxValue}
                    svgDimensions={svgDimensions}
                    width={width}
                    height={height}
                />
                <Axes
                    scales={{ xScale, yScale }}
                    margin={margin}
                    svgDimensions={svgDimensions}
                    width={width}
                    height={height}
                />
            </svg>
        )
    }
}

Histogram.defaultProps = {
    margin: { top: 32, left: 32, bottom: 32, right: 32 },
    // width: 320,
    // height: 320,
    xAccessor: d => d.key
}

export default ResponsiveWrapper(Histogram)