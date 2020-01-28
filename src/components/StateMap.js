import React, { Component } from 'react'
import '../App.css'
import usstates from '../geo/states-10m'
import { max } from 'd3-array'
import { geoMercator, geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"
import { scaleSequential } from "d3-scale"
import { interpolateViridis } from "d3-scale-chromatic"
const colorScale = scaleSequential(interpolateViridis)

const usStateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']


class StateMap extends Component {
  render() {
    const dataset = this.props.data;

    const topojsonData = feature(usstates, usstates.objects.states).features
    const projection = geoAlbersUsa()
      .scale(this.props.size[0] * 1)
      .translate([this.props.size[0]/2, 350])
    const pathGenerator = geoPath().projection(projection)

    if (dataset.length > 0) {
      const datasetNumbers = [];
      for (let s=0; s < usStateNames.length; s++) {
        datasetNumbers.push(parseFloat(dataset.find(element => element.Program === this.props.program)[usStateNames[s]]))
      }
      colorScale.domain([0,max(datasetNumbers)])
      const states = topojsonData
        .map((d,i) => <path
          key={"path" + i}
          d={pathGenerator(d)}
          style={{fill: colorScale(dataset.find(element => element.Program === this.props.program)[d.properties.name]), stroke: "black", strokeOpacity: 0.5 }}
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
