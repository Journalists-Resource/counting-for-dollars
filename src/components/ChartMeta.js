import React, { Component } from 'react'
import '../App.css'

class ChartHeader extends Component {
  render() {
    return (
      <div className="chart-header">
        <h2 className="chart-hed">{this.props.title}</h2>
        <span className="chart-subhed">{this.props.subhed}</span>
      </div>
    )
  }
}

class ChartFooter extends Component {
  render() {
    return (
      <div className="chart-footer">
        Data: {this.props.credit}.
      </div>
    )
  }
}

export { ChartHeader, ChartFooter }
