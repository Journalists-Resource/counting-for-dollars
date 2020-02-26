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
         program: "Title I Grants to Local Education Agencies"
      }

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
         <div>
         <ChartHeader title="Where $1.5 trillion in census-guided federal assistance goes" subhed="Decennial census data is used by over 300 federal programs in two broad ways – to determine eligibility and to apportion funding. Here’s where that money went in 2017." />
         <ReactTooltip className='tooltip-width'
         />
         <Treemap
            data={this.state.data}
            value="FY2017Expenditures"
            organizer="Agency"
            size={[this.state.screenWidth, this.state.screenHeight]}
         />
         <ChartFooter credit="Andrew Reamer, research professor at the George Washington Institute of Public Policy; “Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds”" />
         </div>
         </div>
      )
   }
}

export default Post1Tree
