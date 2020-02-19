import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMapWithDemographics from '../components/StateMapWithDemographics'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { Select, MenuItem } from '@material-ui/core'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




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
      program: "Supplemental Nutrition Assistance Program",
      programlist: []
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    let programarray = []
    csv("datasets/fy2016statefunding.csv").then(data => {
      data.map((d,i) => programarray.push(d.Program));
      this.setState({data: data, programlist: programarray});
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

  handleChange(e) {
    this.setState({program: e.target.value});
  }

  render() {
    const programselectors = this.state.programlist
    .map((d,i) =>
      <MenuItem
         value={d}
      >
        {d}
     </MenuItem>
    )

    return (
      <div className="App">
        <Select
           labelId="state-select-label"
           id="state-select"
           value={this.state.program}
           onChange={this.handleChange.bind(this)}
         >
           {programselectors}
         </Select>
        <ChartHeader title={this.state.program + " funding in FY2017"} />
        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button className="active" onClick={this.handleClick.bind(this, "total")}>Total Funding</Button>
          <Button className="inactive" onClick={this.handleClick.bind(this, "pop")}>Per Capita</Button>
          <Button className="inactive" onClick={this.handleClick.bind(this, "income")}>Per Income</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip />
          <StateMapWithDemographics data={this.state.data} program={this.state.program} size={[this.state.screenWidth, this.state.screenHeight]} slice={this.state.slice}  />
        </div>
        <div>
          <DataTable data={this.state.data}  />
        </div>
      </div>
    )
  }
}

export default Post1Map
