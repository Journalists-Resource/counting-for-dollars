import React, { Component } from 'react'
import '../App.css'
import { divergingColors, bucketScale } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { csv } from 'd3-fetch'
import usstates from '../geo/states-10m'
import { min, max } from 'd3-array'
import { geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"


let colorScale = bucketScale;



class StateMap extends Component {
  render() {
    const fill = this.props.fill;
    const slice = this.props.slice;
    const dataset = this.props.data;

    const topojsonData = feature(usstates, usstates.objects.states).features
    const projection = geoAlbersUsa()
      .scale(this.props.size[0] * 1)
      .translate([this.props.size[0]/2, 250])
    const pathGenerator = geoPath().projection(projection)
    function tooltipGenerator(slice,fill,d) {
      if (slice === "total" || slice === "pop" || slice === "income") {
        return d.properties.name + ": " + formatMoney(d.properties[fill], slice) + " in " + fill + " in 2017."
      } else if (slice === "cost_low" || slice === "cost_med" || slice === "cost_high") {
        return d.properties.name + ": " + formatMoney(d.properties[fill], slice) + " in " + fill + " scenario."
      }
    }

    if (dataset.length > 0) {
      for (let s=0; s < topojsonData.length; s++) {
        let statedata = dataset.find(e => e.State === topojsonData[s].properties.name)
        for (let key in statedata) {
          if (key !== "State") {
            topojsonData[s].properties[key] = statedata[key]
          }
        }
      }

      const datarange = [];
      topojsonData.forEach(function(d){
         if (!isNaN((d.properties[fill]))) { datarange.push((d.properties[fill])) }

      })
      colorScale.domain(datarange)

      const states = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            data-tip={tooltipGenerator(slice,fill,d)}
            style={{
              fill: colorScale((d.properties[fill])),
              stroke: "white",
              strokeOpacity: 0.5
            }}
            className={"states " + d.properties.name}
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
               <stop offset="0%" stopColor={colorScale.range()[0]} stopOpacity="1"></stop>
               <stop offset="25%" stopColor={colorScale.range()[1]} stopOpacity="1"></stop>
               <stop offset="50%" stopColor={colorScale.range()[2]} stopOpacity="1"></stop>
               <stop offset="75%" stopColor={colorScale.range()[3]} stopOpacity="1"></stop>
               <stop offset="100%" stopColor={colorScale.range()[4]} stopOpacity="1"></stop>
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
            {formatMoney(min(colorScale.domain()), slice)}
          </text>
          <text
            x={this.props.size[0] * 0.75}
            y={this.props.size[1]-10}
            textAnchor="end"
          >
            {formatMoney(max(colorScale.domain()), slice)}
          </text>
        </g>
      )

      return (
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          {states}
          {legend}
        </svg>
      )
    } else {
      const states = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            style={{fill: "#ccc", stroke: "white", strokeOpacity: 0.5 }}
            className={"states " + d.properties.name}
          />
        )
      return (
          <svg width={this.props.size[0]} height={this.props.size[1]}>
            {states}
          </svg>
      )
    }
  }
}

export default StateMap
