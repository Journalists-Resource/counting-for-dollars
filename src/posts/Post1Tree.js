import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import Treemap from '../components/Treemap'
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
    // csv("datasets/fy2017expendituresbyprogram.csv", function(d){
    //   d.FY2017Expenditures = parseFloat(d.FY2017Expenditures.replace(/\$|,/g, ''));
    //   d.CFDA = +d.CFDA;
    //   return d;
    // }).then(data => this.setState({ data: ["test":90, "ax":35] }));

  csv("datasets/fy2017expendituresbyprogram.csv", function(d){
    d.FY2017Expenditures = parseFloat(d.FY2017Expenditures.replace(/\$|,/g, ''));
    d.CFDA = +d.CFDA;
    return d;
  }).then(csvdata => {
    this.setState({data: csvdata});
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
    // console.log(this.state.data);
    return (
      <div className="App">
        <div className="App-header">
          <h2>Total Funding Buckets</h2>
        </div>
        <div>
          <ReactTooltip />
          <Treemap data={this.state.data} size={[this.state.screenWidth, this.state.screenHeight]}  />
        </div>
      </div>
    )
  }
}

export default Post1Tree
