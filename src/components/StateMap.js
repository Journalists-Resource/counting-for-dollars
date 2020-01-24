import React, { Component } from 'react'
import '../App.css'
import usstates from '../geo/states-10m'
import { geoMercator, geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"
import { scaleSequential } from "d3-scale"
import { interpolateViridis } from "d3-scale-chromatic"



class StateMap extends Component {
  render() {
    const depvariable = this.props.data;
    const colorScale = scaleSequential(interpolateViridis)
      .domain([0, 50000000])
    const topojsonData = feature(usstates, usstates.objects.states).features
    const projection = geoAlbersUsa()
      .scale(this.props.size[0] * 1)
      .translate([this.props.size[0]/2, 350])
    const pathGenerator = geoPath().projection(projection)

    if (depvariable.length > 0) {
      const states = topojsonData
        .map((d,i) => <path
          key={"path" + i}
          d={pathGenerator(d)}
          style={{fill: colorScale(depvariable[19][d.properties.name]), stroke: "black", strokeOpacity: 0.5 }}
          className={"states " + d.properties.name}
        />)
      return <svg width={this.props.size[0]} height={this.props.size[1]}>
        {states}
      </svg>
    } else {
      const states = topojsonData
        .map((d,i) => <path
          key={"path" + i}
          d={pathGenerator(d)}
          style={{fill: "white", stroke: "black", strokeOpacity: 0.5 }}
          className={"states " + d.properties.name}
        />)
      return <svg width={this.props.size[0]} height={this.props.size[1]}>
        {states}
      </svg>
    }
  }
}

export default StateMap
