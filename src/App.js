import React, { Component } from 'react';
import { range as d3Range } from "d3";

import Histogram from './components/Histogram'
import EntireChart from './components/EntireChart'
//import data from './data/ordinalData'

class App extends Component {


  render() {
    const data = d3Range(34).map(Math.random)

    return (

      <div style={{ width: "50%", height: 400 }}>
        <Histogram data={data} />
        <EntireChart />
      </div>

    );
  }
}

export default App;
