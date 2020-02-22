import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import Treemap from '../components/Treemap'
import { nest } from 'd3-collection'
import ReactTooltip from 'react-tooltip'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { Select, MenuItem } from '@material-ui/core';

const usStateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']


class Post2Tree extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to LEAs",
      state: "Alabama"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {

     csv("datasets/treemap-and-table-bystate-2017.csv").then(csvdata => {
       const nestedData = nest()
             .key(function(d) { return d.Department; })
             .entries(csvdata)
       this.setState({data: nestedData});
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
    this.setState({state: e.target.value});
  }

  render() {
     const stateselectors = usStateNames
     .map((d,i) =>
       <MenuItem
          value={d}
       >
         {d}
      </MenuItem>
     )

    return (
      <div className="App">
        <div className="header-grid">
          <div className="grid-3">
            <ChartHeader title={"Federal funding received by " + this.state.state} />
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
        <div>
          <Treemap
            data={this.state.data}
            value={this.state.state}
            organizer="Department"
            size={[this.state.screenWidth, this.state.screenHeight]}
          />
          <ReactTooltip />
          <ChartFooter credit="Andrew Reamer, research professor at the George Washington Institute of Public Policy; “Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds”" />
        </div>
      </div>
    )
  }
}

export default Post2Tree
