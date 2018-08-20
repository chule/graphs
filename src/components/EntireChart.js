import React from 'react'
import _ from 'lodash'

import LineChart from './LineChart'
import BarChart from './BarChart'
import ScatterPlot from './ScatterPlot'

import Histogram from './Histogram2/index2'
import store from './store'

import './entireChart.css'

class EntireChart extends React.Component {
    componentWillMount() {
        this.filterAll();
    }

    filterAll() {
        _.forEach([
            store.index,
            store.value,
            store.index2D
        ], dimension => dimension.filterAll());
    }
    redrawAll() {
        _.forEach(store.charts, chart => chart.redraw());
    }

    render() {
        return (
            <div>
                <Histogram
                    id='histogram-chart'
                    dimension={store.value}
                    group={store.valueGroup}
                    yAccessor={d => d.value}
                    padding={2}
                    redrawAll={this.redrawAll} />
                {/* <div className='chart-group'>

                </div> */}

                <div className='chart-group'>
                    <LineChart
                        id='line-chart'
                        dimension={store.index}
                        group={store.indexGroup}
                        yAccessor={d => d.value}
                        redrawAll={this.redrawAll} />
                </div>

                <div className='chart-group'>
                    <BarChart
                        id='bar-chart'
                        dimension={store.value}
                        group={store.valueGroup}
                        yAccessor={d => d.value}
                        padding={2}
                        redrawAll={this.redrawAll} />
                </div>

                <div className='chart-group'>
                    <ScatterPlot
                        id='scatter-plot'
                        dimension={store.index2D}
                        group={store.index2DGroup}
                        xAccessor={d => d.key[0]}
                        yAccessor={d => d.key[1]}
                        redrawAll={this.redrawAll} />
                </div>



            </div>
        );
    }
}

export default EntireChart