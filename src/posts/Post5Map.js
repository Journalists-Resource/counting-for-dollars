import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import CountiesMap from '../components/CountiesMap'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




class Post5Map extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "pop_change",
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
    csv("datasets/pop2017_2018_and_change_bycounty.csv").then(data => {
      console.log(data);
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
        <ChartHeader title="How the census affects access to care in rural areas through programs like Medicare Advantage" />
        <div>
          <CountiesMap
             data={this.state.data}
             program={this.state.program}
             size={[this.state.screenWidth, this.state.screenHeight-175]}
             slice={this.state.slice}
          />
          <ReactTooltip className='tooltip-width' />
        </div>
        <div>
          <DataTable data={this.state.data}  />
        </div>
      </div>
    )
  }
}

export default Post5Map
