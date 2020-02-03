import React, { Component } from 'react'
import '../App.css'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { group } from 'd3-array'
import { nest } from 'd3-collection'
import { select } from 'd3-selection'
import { legendColor } from 'd3-svg-legend'
import { transition } from 'd3-transition'
import * as d3 from 'd3-hierarchy'
import { interpolateViridis, schemeCategory10 } from "d3-scale-chromatic"

class TreeMap extends Component {
  constructor(props){
    super(props)
    this.state = { x: 0, y: 0 };
    this.createTreeMap = this.createTreeMap.bind(this)
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
  }

  componentDidMount() {
    this.createTreeMap()
  }

  componentDidUpdate() {
    this.createTreeMap()
  }

  createTreeMap() {
    console.log(this.props.data)
    const node = this.node
    const width = this.props.size[0];
    const height = this.props.size[1];
    const data = this.props.data;
    const jsondata = this.props.jsondata;
    const colorScale = scaleOrdinal(schemeCategory10); //todo: use viridis

        // Define the div for the tooltip
    const tooltip =   select(node).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const nestedData = nest()
          .key(function(d) { return d.Agency; })
          .entries(data)

    var newObj = new Object();
    newObj.values = nestedData;
    newObj.name = "Programs";

    const root = d3.hierarchy(newObj, d => d.values).sum(function(d){ return d.FY2017Expenditures})

    var totalSpend = root.value;

    colorScale.domain(data);


      // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(1)
    (root)

  // use this information to add rectangles:
  select(node)
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("fill", function (d) { return colorScale(d.data.Agency); })
      .attr("data-tip", function(d) {return d.data.Program + ", " +
        d.data.Agency + ": " +
        d.data.FY2017Expenditures

      });

  // and to add the text labels
  select(node)
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .filter(function (d) {return !isNaN(d.data.FY2017Expenditures)})
    .append("text")
      .attr("x", function(d){ return d.x0 + 3 })
      .attr("y", function(d){ return d.y0 + 6 })
      .attr("text-anchor", "left")
      .text(function(d){
        return ((d.data.FY2017Expenditures > (totalSpend*0.01)) ? d.data.Program : ""); // label only the programs that take up more than 1% of spending
      })
      // .call(wrap.bounds(
      //   {height: 600,
      //     width: function (d) { return 150; }}
      //   ))
      .attr("font-size", "8px")
      .attr("fill", "white");
  }

  render() {
    return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default TreeMap
