import React, { Component } from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../App.css'
import TreeMap from '../components/Treemap'
import stateborderdata from '../components/usstates'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'
import { csv, json } from 'd3-fetch'


const appdata = stateborderdata.features
  .filter(d => geoCentroid(d)[0] < -20)

appdata
  .forEach((d,i) => {
    const offset = Math.random()
    d.launchday = i
    d.data = range(30).map((p,q) => q < i ? 0 : Math.random() * 2 + offset)
  })

const colorScale = scaleThreshold().domain([5,10,20,30]).range(["#75739F", "#5EAFC6", "#41A368", "#93C464"])

class Post1 extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    // this.onHover = this.onHover.bind(this)
    // this.onBrush = this.onBrush.bind(this)
    this.state = { screenWidth: 1000, screenHeight: 500, hover: "none" }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120 })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    csv("/data/fy2017expendituresbyprogram.csv", function(d){
      d.FY2017Expenditures = parseFloat(d.FY2017Expenditures.replace(/\$|,/g, ''));
      d.CFDA = +d.CFDA;
      return d;
    }).then(function(data) {
      console.log(data); // [{"Hello": "world"}, …]
    });

    const filteredAppdata = appdata
      .filter((d,i) => d.launchday)

    return (
      <div className="App">
        <div className="App-header">
          <h2>d3ia dashboard</h2>
        </div>
        <div>
        <TreeMap colorScale={colorScale} data={filteredAppdata} size={[this.state.screenWidth / 2, this.state.screenHeight / 2]} />
        </div>
      </div>
    )
  }
}

export default Post1
