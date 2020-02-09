import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import StateMap from '../components/StateMap'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';




class Post1Map extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to LEAs"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/fy2016statefunding.csv").then(data => {
      this.setState({data: data});
      data.map((d,i) => console.log(d.Program))
    });

  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleClick(e) {
    this.setState({slice: e})
  }

  render() {
    return (
      <div className="App">
        <h2>{this.state.program} Funding</h2>
        <ButtonGroup aria-label="outlined button group">
          <Button onClick={this.handleClick.bind(this, "total")}>Total Funding</Button>
          <Button onClick={this.handleClick.bind(this, "pop")}>Per Capita</Button>
          <Button onClick={this.handleClick.bind(this, "income")}>Per Income</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip />
          <StateMap data={this.state.data} program={this.state.program} size={[this.state.screenWidth, this.state.screenHeight]} slice={this.state.slice}  />
        </div>
      </div>
    )
  }
}

export default Post1Map
