import React, { Component } from 'react'
import '../App.css'
import { transpose } from 'd3-array'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMap from '../components/StateMap'
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
      slice: "total",
      data: [],
      filtereddata: [],
      program: "",
      programlist: [],
      accessor: ""
    }
  }

  filterData(target, slice = "total") {
   const allowed = ['State', target];
   const newarray = [];

   let accessor = ""
   if (slice === "total") {
      accessor = "Total " + target + " Funding"
   } else if (slice === "pop") {
      accessor = target + " Funding Per Capita"
   } else if (slice === "income") {
      accessor = target + " Funding as % of State's Income"
   }

    for (let i=0; i<this.state.data.length; i++) {
      const filtered = Object.keys(this.state.data[i])
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          if (key === target) {
            obj[accessor] = this.state.data[i][key] / this.state.data[i][slice];
          } else {
            obj[key] = this.state.data[i][key];
          }
          return obj;
        }, {});
      newarray.push(filtered);
    }

    newarray.columns = ['State', accessor];

    this.setState({
      accessor: accessor,
      filtereddata: newarray,
      slice: slice
    })
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  componentWillMount() {
   Promise.all([
      csv("datasets/2017_income_and_pop.csv"),
      csv("datasets/fy2017expendituresbyprogram-state.csv")
   ])
   .then(datasets => {
      let data_states = datasets[0]
      let data_funding = datasets[1]

      let programarray = []
      data_funding.map((d,i) => programarray.push(d.Program));
      programarray = programarray.sort();

      data_states.map((d,i) => {
         d["income"] = +d["income"]
         d["pop"] = +d["pop"]
         d["total"] = 1
         data_funding.map((f,j) => {
            let program = f["Program"];
            d[program] = +f[d["State"]]
         })
      })

      this.setState({
         data: data_states,
         programlist: programarray,
         program: "Medicare"
      })

      this.filterData(this.state.program, "total")
   })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleClick(e) {
    var actives = document.getElementsByClassName("active");
    for(var i = 0; i < actives.length; i++)
    {
        actives[i].classList.add("inactive");
        actives[i].classList.remove("active");
    }
    document.getElementById("button_" + e).classList.add("active");
    this.filterData(this.state.program, e)
  }

  handleChange(e) {
    let target = e.target.value;
    this.setState({
      program: target
   });
    this.filterData(target, this.state.slice);
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
            <ChartHeader title={this.state.program + " funding received by states in 2017"} />
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
          <Button id={"button_" + "income"} className="inactive" onClick={this.handleClick.bind(this, "income")}>% of Income</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip className='tooltip-width' />
          <StateMap
            data={this.state.filtereddata}
            size={[this.state.screenWidth, this.state.screenHeight-175]}
            fill={this.state.accessor}
            slice={this.state.slice}
         />
        </div>
        <div>
          <DataTable data={this.state.filtereddata} sort="State" sortorder="asc" />
          <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>} />
        </div>
      </div>
    )
  }
}

export default Post2Map
