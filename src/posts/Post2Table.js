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
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to Local Education Agencies",
      state: "Alabama",
      filtereddata: []
    }

  }

  filterData(state) {
    const allowed = ['Program', 'Department', 'URL', 'FY2017 Funding', state];
    let newarray = [];

    for (let i=0; i<this.state.data.length; i++) {
      const filtered = Object.keys(this.state.data[i])
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          if (key === state) {
            obj["FY2017 Funding"] = parseFloat(this.state.data[i][key]);
          } else {
            obj[key] = this.state.data[i][key];
          }
          return obj;
        }, {});
      newarray.push(filtered);
    }

    newarray.columns = allowed.filter(key => (key !== "URL" && key !== state));

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
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    let urlstate = params.get('state');

    if (urlstate === null) {
      urlstate = this.state.state
    }

    csv("datasets/fy2017expendituresbyprogram-state.csv").then(data => {
      this.setState({data: data, state: urlstate});
      this.filterData(urlstate);
    });

  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    // ReactTooltip.rebuild()
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
            <ChartHeader title={"Funding received by " + this.state.state + " from 40 of the largest census-guided federal programs in 2017"} />
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
          <DataTable data={this.state.filtereddata} sort={"FY2017 Funding"} sortorder="desc" />
          <ChartFooter key={this.state.state} credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>}  downloaddata={this.state.filtereddata} downloadfilename={"Funding received by " + this.state.state + " from 40 of the largest census-guided federal programs in 2017"} />
        </div>
      </div>
    )
  }
}

export default Post2Table
