import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import Treemap from '../components/Treemap'
import { nest } from 'd3-collection'
import ReactTooltip from 'react-tooltip'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'



class Post1Tree extends Component {
   constructor(props){
      super(props)
      this.onResize = this.onResize.bind(this)
      this.state = {
         screenWidth: window.innerWidth,
         screenHeight: 500,
         hover: "none",
         data: [],
         slice: "total",
         program: "Title I Grants to Local Education Agencies",
         x: 0,
         y: 0,
         tooltipPos: "top"
      }

   }

   _onMouseMove(e) {
     let tooltipPos = "top"

     if (e.clientX < (this.state.screenWidth*0.33)) {
       tooltipPos = "right"
     } else if (e.clientX > (this.state.screenWidth*0.66)) {
       tooltipPos = "left"
     }
    this.setState({
      x: e.clientX,
      y: e.clientY,
      tooltipPos: tooltipPos
    });
  }

   onResize() {
      this.setState({ screenWidth: window.innerWidth })
   }

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
         <div onMouseMove={this._onMouseMove.bind(this)}>
         <ChartHeader title="Where $1.5 trillion in census-guided federal assistance goes" subhed="Decennial census data is used by over 300 federal programs in two broad ways – to determine eligibility and to apportion funding. Here’s where that money went in 2017." />
         <ReactTooltip className='tooltip-width' place={this.state.tooltipPos}
         />
         <Treemap
            data={this.state.data}
            value="FY2017Expenditures"
            organizer="Agency"
            size={[this.state.screenWidth, this.state.screenHeight]}
         />
         <ChartFooter credit={<span>Source: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds.”</a></span>} />
         </div>
         </div>
      )
   }
}

export default Post1Tree
