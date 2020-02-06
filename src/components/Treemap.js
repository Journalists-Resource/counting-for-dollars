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
    const colorScale = scaleOrdinal(["#a71930","#574241","#bfa5a4","#00689d","#009dd4"]); //todo: use viridis
    function percent(number) {
      return (Math.round(number*1000)/100) + "%";
    }
    function wrap(text, width) {
      console.log(width);
      text.each(function() {
        let text = select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 1.1,
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    if(data.length > 0) {

      var newObj = new Object();
      newObj.values = data;
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
            d.data.FY2017Expenditures.toLocaleString('en-US')

          });

      // and to add the text labels
      select(node)
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .filter(function (d) {return !isNaN(d.data.FY2017Expenditures)})
        .append("text")
          .attr("x", function(d){ return d.x0 + 6 })
          .attr("y", function(d){ return d.y0 + 12 })
          .attr("text-anchor", "left")
          .text(function(d){
            return (((d.x1 - d.x0) > 95) ? d.data.Program + " " + percent(d.data.FY2017Expenditures/totalSpend) : ""); // label only the programs that take up more than 1% of spending
          })
          .call(wrap, 100)
          .attr("font-size", "12px")
          .attr("fill", "white")
          .attr("data-tip", function(d) {return d.data.Program + ", " +
            d.data.Agency + ": " +
            d.data.FY2017Expenditures.toLocaleString('en-US')

          });
    }
  }

  render() {
    return <svg ref={node => this.node = node} width={this.props.size[0]} height={this.props.size[1]}>
    </svg>
  }
}

export default TreeMap
