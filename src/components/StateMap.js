import React, { Component } from 'react'
import '../App.css'
import usstates from '../geo/states-10m'
import { geoMercator, geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"

class StateMap extends Component {
  render() {
    const projection = geoAlbersUsa()
      .scale(1000)
      .translate([430,250])
    const pathGenerator = geoPath().projection(projection)
    const states = feature(usstates, usstates.objects.states).features
      .map((d,i) => <path
        key={"path" + i}
        d={pathGenerator(d)}
        style={{fill: "teal", stroke: "black", strokeOpacity: 0.5 }}
        className={"states " + d.properties.name}
      />)
    return <svg width={this.props.size[0]} height={this.props.size[1]}>
      {states}
    </svg>
  }
}

export default StateMap
