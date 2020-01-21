import React, { Component } from 'react'
import '../App.css'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { group } from 'd3-array'
import { nest } from 'd3-collection'
import { select } from 'd3-selection'
import { legendColor } from 'd3-svg-legend'
import { transition } from 'd3-transition'
import * as d3 from 'd3-hierarchy'

class TreeMap extends Component {
  constructor(props){
    super(props)
    this.createTreeMap = this.createTreeMap.bind(this)
  }

  componentDidMount() {
    this.createTreeMap()
  }

  componentDidUpdate() {
    this.createTreeMap()
  }

  createTreeMap() {
    const node = this.node
    const width = this.props.size[0];
    const height = this.props.size[1];
    const data = this.props.data;
    const jsondata = this.props.jsondata;

    const nestedData = nest()
          .key(function(d) { return d.Agency; })
          .entries(data.filter(function(d){ return d.Agency !== "HHS" }))

    var newObj = new Object();
    newObj.values = nestedData;
    newObj.name = "Programs";

    // https://www.d3-graph-gallery.com/graph/treemap_basic.html

    const root = d3.hierarchy(newObj, d => d.values).sum(function(d){ return d.FY2017Expenditures})

    console.log(root);

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
      .style("fill", "slateblue")

  // and to add the text labels
  select(node)
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0 + 3 })
      .attr("y", function(d){ return d.y0 + 6 })
      .attr("text-anchor", "left")
      .text(function(d){ return d.data.Agency })
      .attr("font-size", "8px")
      .attr("fill", "white")
  }

  render() {
    return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default TreeMap
