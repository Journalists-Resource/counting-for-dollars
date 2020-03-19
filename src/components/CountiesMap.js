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



      colorScale.domain([-1.3, 0, 0.5, 1.3])

      const counties = topojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            data-tip={d.properties["name"] + ": " + Math.round(d.properties.pop_change * 1000)/1000 + "%"}
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
          <rect
            width={60} height={20} x={(width/2) - 150} y={this.props.size[1]-50}
            style={{fill: colorScale(-2)}}
          ></rect>
          <text
            x={(width/2) - 90}
            y={this.props.size[1]-10} fontSize="0.75rem" textAnchor="middle"
          >
            {colorScale.domain()[0] + "%"}
          </text>
          <rect
            width={60} height={20} x={(width/2) - 90} y={this.props.size[1]-50}
            style={{fill: colorScale(-0.5)}}
          ></rect>
          <text
            x={(width/2) - 30}
            y={this.props.size[1]-10} fontSize="0.75rem" textAnchor="middle"
          >
            {colorScale.domain()[1] + "%"}
          </text>
          <rect
            width={60} height={20} x={(width/2) - 30} y={this.props.size[1]-50}
            style={{fill: colorScale(0.25)}}
          ></rect>
          <text
            x={(width/2) + 30}
            y={this.props.size[1]-10} fontSize="0.75rem" textAnchor="middle"
          >
            {colorScale.domain()[2] + "%"}
          </text>
          <rect
            width={60} height={20} x={(width/2) + 30} y={this.props.size[1]-50}
            style={{fill: colorScale(0.5)}}
          ></rect>
          <text
            x={(width/2) + 90}
            y={this.props.size[1]-10} fontSize="0.75rem" textAnchor="middle"
          >
            {colorScale.domain()[3] + "%"}
          </text>
          <rect
            width={60} height={20} x={(width/2) + 90} y={this.props.size[1]-50}
            style={{fill: colorScale(2)}}
          ></rect>

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
