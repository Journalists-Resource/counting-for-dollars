import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DataTable from '../components/Table'




class Post5Table extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.filterData = this.filterData.bind(this)
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      origdata: [],
      data: [],
      places: [],
      slice: ""
    }
  }

  filterData(slice = "") {
   let newarray = []
   newarray = this.state.origdata.filter(d => d["State"] === slice)
   newarray.columns = this.state.origdata.columns;

    this.setState({
      data: newarray,
      slice: slice
    })
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/Medicare-advantage-criteria-county-changes-19to20.csv").then(data => {
      let places = []
      data.forEach(d =>
        places.indexOf(d["State"]) === -1 ? places.push(d["State"]) : null
      )
      this.setState({
        origdata: data,
        places: places
      });
      this.filterData("")
    });

  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    // ReactTooltip.rebuild()
  }

  handleChangeFilter(e, v) {
    this.filterData(v)
  }

  render() {
    return (
      <div className="App">
        <div className="header-grid">
          <div className="grid-3">
            <ChartHeader title={"How the census affects access to care in rural areas through programs like Medicare Advantage"} />
          </div>
        </div>
        <div>
          <Autocomplete
            id="area-select"
            style={{ width: 300 }}
            options={this.state.places}
            className={"autocomplete"}
            autoHighlight
            getOptionLabel={(option) => option}
            onChange={this.handleChangeFilter}
            renderOption={(option) => (
              <React.Fragment>
                {option}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Find a county or state"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password', // disable autocomplete and autofill
                }}
              />
            )}
          />
          <DataTable data={this.state.data}  />
        </div>
        <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>} downloaddata={this.state.origdata} downloadfilename={"How the census affects access to care in rural areas through programs like Medicare Advantage"} />
      </div>
    )
  }
}

export default Post5Table
