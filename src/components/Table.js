import React, { Component } from 'react'
import '../App.css'
import { scaleLinear } from 'd3-scale'
import { max, sum } from 'd3-array'
import { select } from 'd3-selection'
import { legendColor } from 'd3-svg-legend'
import { transition } from 'd3-transition'

class DataTable extends Component {
  constructor(props){
    super(props)
    this.createDataTable = this.createDataTable.bind(this)
  }

  componentDidMount() {
    // this.createDataTable()
  }

  componentDidUpdate() {
    this.createDataTable()
  }

  createDataTable() {
    const node = this.node
    const data = this.props.data

    if (data.length > 0) {
      var table = select(node);

      table.append("thead")
        .selectAll("td")
        .data(data.columns.filter(function(d){return d !== "url"}))
        .enter()
        .append("td")
        .text(function(d) {return d})

      var tablerows = table
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        // .attr("class", function(d) {console.log(d); return d["Program"]})
        .html(function(d) {
          let htmlstring = "";
          for (let key in d) {
            if (key && key !== "url") {
              htmlstring += "<td>" + d[key] + "</td>"
            }
          }
          return htmlstring;

        })
      }



  }

  render() {
    return <table ref={node => this.node = node}>
    </table>
  }
}

export default DataTable
