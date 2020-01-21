import React, { Component } from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '../App.css'
import Treemap from '../components/Treemap'
import stateborderdata from '../components/usstates'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'
import { csv, json } from 'd3-fetch'

let csvdata;




class Post1 extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    // this.onHover = this.onHover.bind(this)
    // this.onBrush = this.onBrush.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight, hover: "none", data: null, jsondata: null }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("/data/fy2017expendituresbyprogram.csv", function(d){
      d.FY2017Expenditures = parseFloat(d.FY2017Expenditures.replace(/\$|,/g, ''));
      d.CFDA = +d.CFDA;
      return d;
    }).then(data => {this.setState({data: data}) });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    // console.log(this.state.data);
    return (
      <div className="App">
        <div className="App-header">
          <h2>d3ia dashboard</h2>
        </div>
        <div>
          <Treemap data={this.state.data} size={[this.state.screenWidth, this.state.screenHeight]}  />
        </div>
      </div>
    )
  }
}

export default Post1
