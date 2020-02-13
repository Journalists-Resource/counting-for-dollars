import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMapWithDemographics from '../components/StateMapWithDemographics'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';




class Post3Map extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "cost_low",
      program: "Title I Grants to LEAs"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/losses_undercount.csv").then(data => {
      this.setState({data: data});
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

  render() {
    return (
      <div className="App">
        <h2>Medicaid Reimbursement Per Capita Lost In Undercount Case</h2>
        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button className="active" onClick={this.handleClick.bind(this, "cost_low")}>Low Undercount</Button>
          <Button className="inactive" onClick={this.handleClick.bind(this, "cost_med")}>Medium Undercount</Button>
          <Button className="inactive" onClick={this.handleClick.bind(this, "cost_high")}>High Undercount</Button>
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

export default Post3Map
