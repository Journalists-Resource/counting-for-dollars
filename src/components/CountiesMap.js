import React, { Component } from 'react'
import '../App.css'
import { divergingColors } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { csv } from 'd3-fetch'
import uscounties from '../geo/counties-10m'
import { min, max } from 'd3-array'
import { geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"


let colorScale = divergingColors;



class CountiesMap extends Component {
  render() {
    const slice = this.props.slice;
    const dataset = this.props.data;

    const topojsonData = feature(uscounties, uscounties.objects.counties).features
    const projection = geoAlbersUsa()
      .scale(this.props.size[0] * 1)
      .translate([this.props.size[0]/2, 350])
    const pathGenerator = geoPath().projection(projection)
    function tooltipGenerator(x,y,z) {
      // if (x === "total") {
      //   return y.properties.name + " received " + formatMoney(y.properties.total) + " in " + z + " funding in 2017."
      // } else if (x === "pop") {
      //   return y.properties.name + " received " + formatMoney(y.properties.total / y.properties.pop) + " in " + z + " funding per capita in 2017."
      // } else if (x === "income") {
      //   return y.properties.name + " received " + formatMoney(y.properties.total / y.properties.income) + " in " + z + " funding as a ratio of its personal income in 2017."
      // }
    }

    if (dataset.length > 0) {
      // for (let s=0; s < topojsonData.length; s++) {
      //   let statedata = dataset.find(e => e.state === topojsonData[s].properties.name)
      //   for (let key in statedata) {
      //     if (key !== "state") {
      //       topojsonData[s].properties[key] = statedata[key]
      //     }
      //   }
      // }

      console.log(topojsonData);

      const datarange = [];
      topojsonData.forEach(function(d){datarange.push(d.properties[slice])})
      colorScale.domain([
        max(datarange),min(datarange)
      ])
      const counties = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            data-tip={d.name}
            style={{
              fill: colorScale(d.properties[slice]),
              stroke: "black",
              strokeOpacity: 0.5
            }}
            className={"counties " + d.properties.name}
          />
      )

      const legend = (
        <g>
          <defs>
            <linearGradient
              id={"gradient"}
              x1="0%"
              y1="100%"
              x2="100%"
              y2="100%"
              spreadMethod="pad"
            >
              <stop offset="0%" stopColor={colorScale(((colorScale.domain()[1]-colorScale.domain()[0])*0.00)+colorScale.domain()[0])} stopOpacity="1"></stop>
              <stop offset="33%" stopColor={colorScale(((colorScale.domain()[1]-colorScale.domain()[0])*0.33)+colorScale.domain()[0])} stopOpacity="1"></stop>
              <stop offset="66%" stopColor={colorScale(((colorScale.domain()[1]-colorScale.domain()[0])*0.66)+colorScale.domain()[0])} stopOpacity="1"></stop>
              <stop offset="100%" stopColor={colorScale(((colorScale.domain()[1]-colorScale.domain()[0])*1.00)+colorScale.domain()[0])} stopOpacity="1"></stop>
            </linearGradient>
          </defs>
          <rect
            width={this.props.size[0]/2}
            height={20}
            x={this.props.size[0]/4}
            y={this.props.size[1]-50}
            style={{fill: 'url("#gradient")'}}
          ></rect>
          <text
            x={this.props.size[0] * 0.25}
            y={this.props.size[1]-10}
            textAnchor="start"
          >
            {formatMoney(colorScale.domain()[0])}
          </text>
          <text
            x={this.props.size[0] * 0.75}
            y={this.props.size[1]-10}
            textAnchor="end"
          >
            {formatMoney(colorScale.domain()[1])}
          </text>
        </g>
      )

      return (
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          {counties}
          {legend}
        </svg>
      )
    } else {
      const counties = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            style={{fill: "white", stroke: "black", strokeOpacity: 0.5 }}
            className={"counties " + d.properties.name}
          />
        )
      return (
          <svg width={this.props.size[0]} height={this.props.size[1]}>
            {counties}
          </svg>
      )
    }
  }
}

export default CountiesMap
