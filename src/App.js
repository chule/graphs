import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import Barchart from './components/Barchart'
import data from './data/ordinalData'

class App extends Component {


  render() {
    return (


      <div style={{ width: "50%", height: 400 }}>
        <Barchart data={data} />
      </div>

    );
  }
}

export default App;
