import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMap from '../components/StateMap'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




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
      slice: "cost_low"
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
    var actives = document.getElementsByClassName("active");
    for(var i = 0; i < actives.length; i++)
    {
        actives[i].classList.add("inactive");
        actives[i].classList.remove("active");
    }
    document.getElementById("button_" + e).classList.add("active");
  }

  render() {
    return (
      <div className="App">
        <ChartHeader title="Impacts to Medicaid of 2020 census undercounts" subhed="Medicaid reimbursements states might gain or lose under 2020 low-, medium- and high-risk miscount scenarios projected by the Urban Institute" />
        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button id={"button_" + "cost_low"} className="active" onClick={this.handleClick.bind(this, "cost_low")}>Low Undercount</Button>
          <Button id={"button_" + "cost_med"} className="inactive" onClick={this.handleClick.bind(this, "cost_med")}>Medium Undercount</Button>
          <Button id={"button_" + "cost_high"} className="inactive" onClick={this.handleClick.bind(this, "cost_high")}>High Undercount</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip />
          <StateMap data={this.state.data} program={this.state.program} size={[this.state.screenWidth, this.state.screenHeight]} slice={this.state.slice}  />
        </div>
        <ChartFooter  credit="Andrew Reamer, research professor at the George Washington Institute of Public Policy; “Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds”, Urban Institute" />
      </div>
    )
  }
}

export default Post3Map
