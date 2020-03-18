import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import DataTable from '../components/Table'




class Post5Table extends Component {
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
      program: "Title I Grants to Local Education Agencies"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/map-and-table-title-i-grants-per-state-per-child.csv").then(data => {
      this.setState({data: data});
    });

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
    return (
      <div className="App">
        <div className="header-grid">
          <div className="grid-3">
            <ChartHeader title={"How the census affects access to care in rural areas through programs like Medicare Advantage"} />
          </div>
        </div>
        <div>
          <DataTable data={this.state.data}  />
        </div>
        <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>} downloaddata={this.state.data} downloadfilename={"How the census affects access to care in rural areas through programs like Medicare Advantage"} />
      </div>
    )
  }
}

export default Post5Table
