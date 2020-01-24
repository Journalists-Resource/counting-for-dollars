import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import StateMap from '../components/StateMap'





class Post1Map extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    // this.onHover = this.onHover.bind(this)
    // this.onBrush = this.onBrush.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight, hover: "none", data: [], program: "Title I Grants to LEAs" }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("data/fy2016statefunding.csv").then(data => {this.setState({data: data}) });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>{this.state.program} Funding</h2>
        </div>
        <div>
          <StateMap data={this.state.data} program={this.state.program} size={[this.state.screenWidth, this.state.screenHeight]}   />
        </div>
      </div>
    )
  }
}

export default Post1Map
