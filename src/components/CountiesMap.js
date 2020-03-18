import React, { Component } from 'react'
import '../App.css'
import { bucketScale } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { csv } from 'd3-fetch'
import uscounties from '../geo/counties-10m'
import { min, max } from 'd3-array'
import { geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"


let colorScale = bucketScale;


class CountiesMap extends Component {
  render() {
    const width = min([900, this.props.size[0]]);
    const slice = this.props.slice;
    const dataset = this.props.data;

    const topojsonData = feature(uscounties, uscounties.objects.counties).features
    const projection = geoAlbersUsa()
      .scale(width * 1)
      .translate([width/2, 250])
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
      for (let s=0; s < topojsonData.length; s++) {
        let countydata = dataset.find(e => e.GEOID === topojsonData[s].id)
        for (let key in countydata) {
          if (key !== "" && key !== "GEOID") {
            topojsonData[s].properties[key] = countydata[key]
          }
        }
      }



      const datarange = [];
      topojsonData.forEach(function(d){
        if (!isNaN(d.properties[slice])) {
          datarange.push(parseFloat(d.properties[slice]))
        }
      })

      colorScale.domain(datarange)
      const counties = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            data-tip={d.properties["NAME.x"] + ": " + Math.round(d.properties.pop_change * 100)/100 + "%"}
            style={{
              fill: colorScale(d.properties[slice]),
              stroke: "white",
              strokeOpacity: 0.1
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
            width={300}
            height={20}
            x={(width/2) - 150}
            y={this.props.size[1]-50}
            style={{fill: 'url("#gradient")'}}
          ></rect>
          <text
            x={(width/2) - 150}
            y={this.props.size[1]-10}
            fontSize="0.75rem"
            textAnchor="start"
          >
            {formatMoney(min(colorScale.domain()))}
          </text>
          <text
            x={(width/2) + 150}
            y={this.props.size[1]-10}
            fontSize="0.75rem"
            textAnchor="end"
          >
            {formatMoney(max(colorScale.domain()))}
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
            style={{fill: "#ccc", stroke: "white", strokeOpacity: 0.5 }}
            className={"counties " + d.properties.name}
          />
        )
      return (
         <svg width={width} height={this.props.size[1]}>
           {counties}
         </svg>
      )
    }
  }
}

export default CountiesMap
