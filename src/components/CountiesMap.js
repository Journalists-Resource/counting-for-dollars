import React, { Component } from 'react'
import '../App.css'
import { bucketScale } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { csv } from 'd3-fetch'
import uscounties from '../geo/counties-10m'
import usstates from '../geo/states-10m'
import { min, max } from 'd3-array'
import { geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"


let colorScale = bucketScale;


class CountiesMap extends Component {
  render() {
    const width = min([900, this.props.size[0]]);
    const slice = this.props.slice;
    const dataset = this.props.data;

    const stateTopojsonData = feature(usstates, usstates.objects.states).features
    const topojsonData = feature(uscounties, uscounties.objects.counties).features
    const projection = geoAlbersUsa()
      .scale(width * 1)
      .translate([width/2, 250])
    const pathGenerator = geoPath().projection(projection)

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

      const states = stateTopojsonData
        .map((d,i) =>
          <path
            key={"path" + i}
            d={pathGenerator(d)}
            style={{
               fill:"none",
              stroke: "white",
              strokeOpacity: 1,
              strokeWidth: "1.5px"
            }}
            className={"states " + d.properties.name}
          />
      )

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

      const legmargin = {
         vertical: 20,
         textoffset: 25
      }

      const legend = (
        <g transform={"translate(" + (width-150) + ", " + (this.props.size[1]-(legmargin.vertical*8)) + ")"}>
          <rect
            width={20} height={20} x={0} y={0}
            style={{fill: colorScale(-2)}}
          ></rect>
          <text
            x={legmargin.textoffset}
            y={legmargin.vertical * 1 - 5} fontSize="0.75rem" textAnchor="start"
          >
            {"Less than " + colorScale.domain()[0] + "%"}
          </text>

          <rect
            width={20} height={20} x={0} y={legmargin.vertical * 1}
            style={{fill: colorScale(-0.5)}}
          ></rect>
          <text
            x={legmargin.textoffset}
            y={legmargin.vertical * 2 - 5} fontSize="0.75rem" textAnchor="start"
          >
            {colorScale.domain()[0] + "% - " + colorScale.domain()[1] + "%"}
          </text>

          <rect
            width={20} height={20} x={0} y={legmargin.vertical * 2}
            style={{fill: colorScale(0.25)}}
          ></rect>
          <text
            x={legmargin.textoffset}
            y={legmargin.vertical * 3 - 5} fontSize="0.75rem" textAnchor="start"
          >
            {colorScale.domain()[1] + "% - " + colorScale.domain()[2] + "%"}
          </text>

          <rect
            width={20} height={20} x={0} y={legmargin.vertical * 3}
            style={{fill: colorScale(0.5)}}
          ></rect>
          <text
            x={legmargin.textoffset}
            y={legmargin.vertical * 4 - 5} fontSize="0.75rem" textAnchor="start"
          >
            {colorScale.domain()[2] + "% - " + colorScale.domain()[3] + "%"}
          </text>

          <rect
            width={20} height={20} x={0} y={legmargin.vertical * 4}
            style={{fill: colorScale(2)}}
          ></rect>
          <text
            x={legmargin.textoffset}
            y={legmargin.vertical * 5 - 5} fontSize="0.75rem" textAnchor="start"
          >
            {colorScale.domain()[3] + "% and up"}
          </text>

        </g>
      )

      return (
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          {counties}
          {states}
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
