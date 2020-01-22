import React, { Component } from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../App.css'
import StateMap from '../components/StateMap'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'
import { csv, json } from 'd3-fetch'





class Post1Map extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    // this.onHover = this.onHover.bind(this)
    // this.onBrush = this.onBrush.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight, hover: "none", geodata: [0,1,2], jsondata: null }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    json("data/states-10m.json")
    .then(data => {this.setState({geodata: data}) })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Chloropleth Map</h2>
        </div>
        <div>
          <StateMap geodata={this.state.geodata} size={[this.state.screenWidth, this.state.screenHeight]}   />
        </div>
      </div>
    )
  }
}

export default Post1Map
