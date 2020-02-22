import React, { Component } from 'react'
import '../App.css'
import { transpose } from 'd3-array'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMapWithDemographics from '../components/StateMapWithDemographics'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { Select, MenuItem } from '@material-ui/core'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




class Post2Map extends Component {
  constructor(props){
    super(props)
    this.filterData = this.filterData.bind(this)
    this.onResize = this.onResize.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      filtereddata: [],
      slice: "total",
      program: "",
      programlist: []
    }
  }

  filterData(target) {
    let newarray = []
    let entries = Object.entries(this.state.data.filter((d) => d.Program == target)[0]);
    for (let o in entries) {
      let newobj = {}
      if (!isNaN(parseFloat(entries[o][1]))) {
        newobj["State"] = entries[o][0]
        newobj["Total " + target + " Funding"] = parseFloat(entries[o][1])
        newarray.push(newobj)
      }
    }
    newarray.columns = ["State", "Total " + target + " Funding"];
    this.setState({
      program: target,
      filtereddata: newarray
    })
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
      programarray = programarray.sort();
      this.setState({
        data: data,
        programlist: programarray,
        program: programarray[0]
      });
      this.filterData(this.state.program);
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
    this.setState({slice: e});
    var actives = document.getElementsByClassName("active");
    for(var i = 0; i < actives.length; i++)
    {
        actives[i].classList.add("inactive");
        actives[i].classList.remove("active");
    }
    document.getElementById("button_" + e).classList.add("active");
  }

  handleChange(e) {
    let target = e.target.value;
    this.setState({program: target});
    this.filterData(target);
  }



  render() {
    const programselectors = this.state.programlist
    .sort()
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
            <ChartHeader title={this.state.program + " funding in FY2017"} />
          </div>
          <div className="grid-1">
            <Select
               labelId="state-select-label"
               id="state-select"
               value={this.state.program}
               onChange={this.handleChange.bind(this)}
             >
               {programselectors}
             </Select>
          </div>
        </div>

        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button id={"button_" + "total"} className="active"   onClick={this.handleClick.bind(this, "total")}>Total Funding</Button>
          <Button id={"button_" + "pop"} className="inactive" onClick={this.handleClick.bind(this, "pop")}>Per Capita</Button>
          <Button id={"button_" + "income"} className="inactive" onClick={this.handleClick.bind(this, "income")}>Per Income</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip />
          <StateMapWithDemographics data={this.state.data} program={this.state.program} size={[this.state.screenWidth, this.state.screenHeight-175]} slice={this.state.slice}  />
        </div>
        <div>
          <DataTable data={this.state.filtereddata}  />
        </div>
      </div>
    )
  }
}

export default Post2Map
