import React, { Component } from 'react'
import '../App.css'
import { categoricalColors } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { select } from 'd3-selection'
import * as d3 from 'd3-hierarchy'

class TreeMap extends Component {
   render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const data = this.props.data;
    const value = this.props.value;
    const organizer = this.props.organizer;

    const colorScale = categoricalColors;

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

    let rects;
    let textlabels;
    let legend;

    if(data.length > 0) {

      var newObj = new Object();
      newObj.values = data;
      newObj.name = "Programs";

      const root = d3.hierarchy(newObj, d => d.values).sum(function(d){ return d[value]})



      var totalSpend = root.value;

          // Then d3.treemap computes the position of each element of the hierarchy
      d3.treemap()
        .tile(d3.treemapBinary)
        .size([width, (height-50)])
        .padding(1)
        (root)

        rects = root.leaves()
         .map((d,i) =>
           <rect
             x={d.x0}
             y={d.y0}
             width={d.x1 - d.x0}
             height={d.y1 - d.y0}
             data-tip={d.data.Program + ", " + d.data[organizer] + ": " + formatMoney(d.data[value])}
             style={{fill: colorScale(d.data[organizer]) }}
           />
         )

         textlabels = root.leaves().filter(function (d) {return !isNaN(d.data[value])})
          .map((d,i) =>
            <text
              x={d.x0 + 6}
              y={d.y0 + 12}
              textAnchor={"left"}
              fontSize={"12px"}
              fill={"white"}
              data-tip={d.data.Program + ", " + d.data[organizer] + ": " + formatMoney(d.data[value])}
            >
               {(((d.x1 - d.x0) > 95) ? d.data.Program + " " + percent(d.data[value]/totalSpend) : "")}
            </text>
          )



          legend = colorScale.domain()
            .map((d,i) =>
              <g
                transform={"translate(" + ((this.props.size[0]/25) * i) + "," + (this.props.size[1] - 45) + ")"}
              >
                <rect
                  width={25}
                  height={15}
                  style={{fill: colorScale(d) }}
                >
                </rect>
                <text
                  transform={"translate(12,35)"}
                  style={{textAnchor: "middle", fontSize: "10px"}}
                >
                  {d}
                </text>
              </g>
            )

      // and to add the text labels
      // select(node)
      //   .selectAll("text")
      //   .data(root.leaves())
      //   .enter()
      //   .filter(function (d) {return !isNaN(d.data[value])})
      //   .append("text")
      //     .attr("x", function(d){ return d.x0 + 6 })
      //     .attr("y", function(d){ return d.y0 + 12 })
      //     .attr("text-anchor", "left")
      //     .text(function(d){
      //       return (((d.x1 - d.x0) > 95) ? d.data.Program + " " + percent(d.data[value]/totalSpend) : ""); // label only the programs that take up more than 1% of spending
      //     })
      //     .call(wrap, 100)
      //     .attr("font-size", "12px")
      //     .attr("fill", "white")
      //     .attr("data-tip", function(d) {return d.data.Program + ", " +
      //       d.data[organizer] + ": " +
      //       d.data[value].toLocaleString('en-US')
      //
      //     });
    }
    console.log(colorScale.range())
  return (
     <div>
        <svg ref={node => this.node = node} value={value} width={this.props.size[0]} height={this.props.size[1]}>
         {rects}
         {textlabels}
         {legend}
        </svg>
      </div>
   )
  }
}

export default TreeMap
