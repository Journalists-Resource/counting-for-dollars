import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import DataTable from '../components/Table'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { Select, MenuItem } from '@material-ui/core';

const usStateNames = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']


class Post2Table extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.filterData = this.filterData.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to LEAs",
      state: "Alabama",
      filtereddata: []
    }

  }

  filterData(state) {
    const allowed = ['Program', 'Department', state];
    let newarray = [];

    for (let i=0; i<this.state.data.length; i++) {
      const filtered = Object.keys(this.state.data[i])
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.state.data[i][key];
          return obj;
        }, {});
      newarray.push(filtered)
    }

    newarray.columns = allowed;

    this.setState({
      state: state,
      filtereddata: newarray
    })
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  handleChange(e) {
    let newstate = e.target.value;
    this.filterData(newstate);
  }

  componentWillMount() {
    csv("datasets/treemap-and-table-bystate-2017.csv").then(data => {
      this.setState({data: data});
    });
    this.filterData("Alabama");
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    // ReactTooltip.rebuild()
  }

  handleClick(e) {
    this.setState({slice: e})
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
        <Select
           labelId="state-select-label"
           id="state-select"
           value={this.state.state}
           onChange={this.handleChange.bind(this)}
         >
           {stateselectors}
         </Select>
        <ChartHeader title={this.state.state + " funding in FY2017"} />
        <div>
          <DataTable data={this.state.filtereddata}  />
        </div>
      </div>
    )
  }
}

export default Post2Table
