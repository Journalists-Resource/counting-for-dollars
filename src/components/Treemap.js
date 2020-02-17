import React, { Component } from 'react'
import '../App.css'
import { categoricalColors } from './ColorSchemes'
import formatMoney from './FormatMoney'
import { select, selectAll } from 'd3-selection'
import * as d3 from 'd3-hierarchy'

function wrap(text, width) {

  text.each(function() {
    let text = select(this),
      leafwidth = this.getAttribute("width") - 10,
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
      if (tspan.node().getComputedTextLength() > leafwidth) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

class TreeMap extends Component {
  constructor(props) {
    super(props);
    this.labelRef = React.createRef();
  }


  onResize() {
    selectAll("text.datalabel")
      .call(wrap, 100)
  }

  componentDidUpdate() {
    
  }

   render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const data = this.props.data;
    const value = this.props.value;
    const organizer = this.props.organizer;

    const colorScale = categoricalColors;



    function percent(number) {
      return (Math.round(number*1000)/10) + "%";
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
            key={i}
             x={d.x0}
             y={d.y0}
             width={d.x1 - d.x0}
             height={d.y1 - d.y0}
             data-tip={d.data.Program + ", " + d.data[organizer] + ": " + formatMoney(d.data[value])}
             style={{fill: colorScale(d.data[organizer]) }}
           />
         )

         textlabels = root.leaves().filter(function (d) {
           return !isNaN(d.data[value]) && ((d.data[value]/totalSpend) > 0.005) && ((d.x1 - d.x0) > 50)
         })
          .map((d,i) =>

              <text
                key={i}
                ref={this.labelRef}
                className="datalabel"
                x={d.x0 + 5}
                y={d.y0}
                textAnchor={"left"}
                fontSize={(((d.data[value]/totalSpend) * 72) + 10) + "px"}
                fill={"white"}
                width={d.x1 - d.x0}
                data-tip={d.data.Program + ", " + d.data[organizer] + ": " + formatMoney(d.data[value])}
              >
                 {d.data.Program + " " + percent(d.data[value]/totalSpend)}
              </text>

          )



          legend = colorScale.domain()
            .map((d,i) =>
              <g
              key={i}
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
    }



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
