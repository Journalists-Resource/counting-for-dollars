import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import Treemap from '../components/Treemap'
import { nest } from 'd3-collection'
import ReactTooltip from 'react-tooltip'



class Post1Tree extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to LEAs"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {


     csv("datasets/fy2017expendituresbyprogram.csv", function(d){
       d.FY2017Expenditures = parseFloat(d.FY2017Expenditures.replace(/\$|,/g, ''));
       d.CFDA = +d.CFDA;
       return d;
     }).then(csvdata => {
       const nestedData = nest()
             .key(function(d) { return d.Agency; })
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

  render() {
    return (
      <div className="App">
        <div>
          <ReactTooltip />
          <h2>Funding by Department</h2>
          <Treemap
            data={this.state.data}
            value="FY2017Expenditures"
            organizer="Agency"
            size={[this.state.screenWidth, this.state.screenHeight]}
          />
        </div>
      </div>
    )
  }
}

export default Post1Tree
