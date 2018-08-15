import React, { Component } from 'react'
import { ResponsiveOrdinalFrame } from 'semiotic'
import './Barchart.css'

const axes = [
    {
        key: 'yAxis',
        orient: 'left',
        className: 'yscale',
        label: {
            name: "←  Frequentie  →",
            position: {
                anchor: 'middle',
            },
            locationDistance: 45,
        },//tickFormat: (d) => d + '%' 
    }
]

const sharedProps = {
    //size: [800, 300],
    margin: { top: 25, bottom: 50, left: 70, right: 20 },
    responsiveWidth: true,
    responsiveHeight: true

}

export default class Barchart extends Component {

    brushEnd(e) {
        if (e) {
            console.log(e)
        }
    }

    render() {
        return (

            <ResponsiveOrdinalFrame
                {...sharedProps}
                title={"←  Verzamelbereik  →"}
                className='divided-line-or'
                data={this.props.data}
                type={'bar'}
                oLabel={(d) => {
                    return <text transform="translate(-7.5,0)rotate(45)">{d}</text>
                }}
                //renderMode={"sketchy"}
                oAccessor={d => d.Verzamelbereik}
                rAccessor={d => d.Frequentie}
                style={() => ({ fill: 'darkred', opacity: 1, stroke: 'white' })}
                axis={axes}
                interaction={{
                    brush: "xBrush",
                    extent: [],
                    end: this.brushEnd
                }}
            // annotations={[
            //     { type: "or", valueL: 150, category: "tomatoes", label: "5 of these tomatoes" }
            //  ]}
            />
        )
    }
}