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


    const nestedData = nest()
        .key(function(d) { return d.Agency; })
        .entries(this.props.data)

    console.log(d3.hierarchy(nestedData)
      .sum(d => d.FY2017Expenditures)
      .sort((a, b) => b.FY2017Expenditures - a.FY2017Expenditures));

    // https://www.d3-graph-gallery.com/graph/treemap_basic.html

    const root = d3.stratify()
      .id(function(d) { return d.Program; })   // Name of the entity (column name is name in csv)
      .parentId(function(d) { return d.Agency; })   // Name of the parent (column name is parent in csv)
      (this.props.data);
    root.sum(function(d) { return +d.FY2017Expenditures })   // Compute the numeric value for each entity

    d3.treemap()
        .size([width, height])
        .padding(1)
        (root)


    select(node)
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "#69b3a2");

    select(node)
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+10})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.CFDA})
        .attr("font-size", "8px")
        .attr("fill", "white")
  }

  render() {
    return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default TreeMap
