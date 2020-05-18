import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMap from '../components/StateMap'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




class Post4Map extends Component {
  constructor(props){
     super(props)
     this.filterData = this.filterData.bind(this)
     this.onResize = this.onResize.bind(this)
     this.handleClick = this.handleClick.bind(this);
     this.state = {
       screenWidth: window.innerWidth,
       screenHeight: 700,
       slice: "Funding Per Child",
       data: [],
       filtereddata: [],
       program: "",
       programlist: [],
       accessor: ""
     }
  }

  filterData(slice = "Funding Per Child") {
   const allowed = ['State', slice];
   const newarray = [];

   let accessor = slice;

    for (let i=0; i<this.state.data.length; i++) {
      const filtered = Object.keys(this.state.data[i])
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          if (key === slice) {
            obj[accessor] = this.state.data[i][key];
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
    csv("datasets/map-and-table-title-i-grants-per-state-per-child-2017.csv")
   .then(dataset => {
     dataset.map(item => (
       Object.keys(item).filter(d => (d !== "State")).map(key => (
         item[key] = +item[key]
       ))
     ))

      this.setState({
         data: dataset
      })

      this.filterData("Funding Per Child")
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
    this.setState({slice: e})
  }

  render() {
    return (
      <div className="App">
        <ChartHeader title="Title I funding per low-income child in 2017 by state" subhed="Vermont, Wyoming and North Dakota received substantially more Title I grant money per eligible child in FY2017 than other states." />
        <div>
          <ReactTooltip className='tooltip-width' />
          <StateMap
             data={this.state.filtereddata}
             size={[this.state.screenWidth, this.state.screenHeight-175]}
             fill={this.state.accessor}
             slice={this.state.slice}
             reversescale={true}
         />
        </div>
        <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> U.S. Census Bureau’s SAIPE; Dept. of Education</span>} downloaddata={this.state.filtereddata} downloadfilename={"Title I Funding Per Child in 2017 by State"}  />
      </div>
    )
  }
}

export default Post4Map
