import React from 'react'
import Axis from './Axis'

export default ({ scales, margin, svgDimensions, width, height }) => {
  //const { height, width } = svgDimensions

  const xProps = {
    orient: 'Bottom',
    scale: scales.xScale,
    translate: `translate(${margin.left}, ${height + margin.top})`,
    tickSize: height - margin.top - margin.bottom,
  }

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margin.left}, ${margin.top})`,
    //tickSize: width - margin.left - margin.right,
  }

  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  )
}