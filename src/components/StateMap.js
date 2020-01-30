import React, { Component } from 'react'
import '../App.css'
import usstates from '../geo/states-10m'
import { min, max } from 'd3-array'
import { geoMercator, geoPath, geoAlbersUsa } from 'd3-geo'
import { feature } from "topojson-client"
import { scaleSequential } from "d3-scale"
import { interpolateViridis } from "d3-scale-chromatic"
import { csv } from 'd3-fetch'
const colorScale = scaleSequential(interpolateViridis)

const usStateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

let demographics = null;
csv("datasets/2017_income_and_pop.csv").then(function(data) {
  for (let s=0; s<data.length; s++) {
    let stateObj = {}
    data[s].income = +data[s].income;
    data[s].pop = +data[s].pop;
  }
  demographics = data;
  // console.log(demographics);
});


class StateMap extends Component {
  render() {
    const slice = this.props.slice;
    const dataset = this.props.data;
    console.log(demographics)

    const topojsonData = feature(usstates, usstates.objects.states).features
    const projection = geoAlbersUsa()
      .scale(this.props.size[0] * 1)
      .translate([this.props.size[0]/2, 350])
    const pathGenerator = geoPath().projection(projection)

    if (dataset.length > 0) {
      for (let s=0; s < topojsonData.length; s++) {
        if (demographics.find(e => e.state_name === topojsonData[s].properties.name)) {
          topojsonData[s].properties.total = +dataset.find(e => e.Program === this.props.program)[topojsonData[s].properties.name]
          topojsonData[s].properties.income = demographics.find(e => e.state_name === topojsonData[s].properties.name)["income"]
          topojsonData[s].properties.pop = demographics.find(e => e.state_name === topojsonData[s].properties.name)["pop"]
        }
      }

      const datarange = [];
      topojsonData.forEach(function(d){datarange.push(d.properties.total / (slice === "total" ? 1 : d.properties[slice]))})
      colorScale.domain([
        min(datarange),max(datarange)
      ])
      const states = topojsonData
        .map((d,i) => <path
          key={"path" + i}
          d={pathGenerator(d)}
          style={{
            fill: colorScale(d.properties.total / (slice === "total" ? 1 : d.properties[slice])),
            stroke: "black",
            strokeOpacity: 0.5
          }}
          className={"states " + d.properties.name}
        />)
        return (
          <svg width={this.props.size[0]} height={this.props.size[1]}>
            {states}
          </svg>
        )
    } else {
      const states = topojsonData
        .map((d,i) => <path
          key={"path" + i}
          d={pathGenerator(d)}
          style={{fill: "white", stroke: "black", strokeOpacity: 0.5 }}
          className={"states " + d.properties.name}
        />)
      return (
        <svg width={this.props.size[0]} height={this.props.size[1]}>
          {states}
        </svg>
      )
    }
  }
}

export default StateMap
