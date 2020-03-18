import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import Treemap from '../components/Treemap'
import { nest } from 'd3-collection'
import ReactTooltip from 'react-tooltip'
import queryString from 'query-string'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { Select, MenuItem } from '@material-ui/core';

const usStateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']


class Post2Tree extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 500,
      hover: "none",
      data: [],
      originaldata: [],
      slice: "total",
      program: "Title I Grants to Local Education Agencies",
      state: "Alabama",
      x: 0,
      y: 0,
      tooltipPos: "top"
   }
  }

  _onMouseMove(e) {
    let tooltipPos = "top"

    if (e.clientX < (this.state.screenWidth*0.33)) {
      tooltipPos = "right"
    } else if (e.clientX > (this.state.screenWidth*0.66)) {
      tooltipPos = "left"
    }
   this.setState({
     x: e.clientX,
     y: e.clientY,
     tooltipPos: tooltipPos
   });
 }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  componentWillMount() {
     csv("datasets/fy2017expendituresbyprogram-state.csv").then(csvdata => {
       const nestedData = nest()
             .key(function(d) { return d.Department; })
             .entries(csvdata)
       this.setState({
         originaldata: csvdata,
         data: nestedData
       });
     });


  }

  componentDidMount() {

    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleChange(e) {
    this.setState({
      state: e.target.value
    });
    this.props.history.push(`${window.location.pathname}Post2Tree?state=${e.target.value}`)

  }

  render() {
     const stateselectors = usStateNames
     .map((d,i) =>
       <MenuItem
          key={i}
          value={d}
       >
         {d}
      </MenuItem>
     )

    return (
      <div className="App">
        <div className="header-grid">
          <div className="grid-3">
            <ChartHeader title={"Funding received by " + this.state.state + " from census-guided federal programs in 2017"} />
          </div>
          <div className="grid-1">
            <Select
               labelId="state-select-label"
               id="state-select"
               value={this.state.state}
               onChange={this.handleChange.bind(this)}
             >
               {stateselectors}
             </Select>
          </div>
        </div>
        <div  onMouseMove={this._onMouseMove.bind(this)}>
          <Treemap
            data={this.state.data}
            value={this.state.state}
            organizer="Department"
            omitSBA={true}
            size={[this.state.screenWidth, this.state.screenHeight]}
          />
          <ReactTooltip className='tooltip-width' place={this.state.tooltipPos} />
          <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>} downloaddata={this.state.originaldata}  />
        </div>
      </div>
    )
  }
}

export default Post2Tree
