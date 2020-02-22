import React, { Component } from 'react'
import '../App.css'

class ChartHeader extends Component {
  render() {
    return (
      <div className="chart-header">
        <h2 className="chart-hed" style={{marginBottom: '1rem'}}>{this.props.title}</h2>
        <div className="chart-subhed" style={{marginBottom: '1rem'}}>{this.props.subhed}</div>
      </div>
    )
  }
}

class ChartFooter extends Component {
  render() {
    return (
      <div className="chart-footer">
        <div className="col1">
          Data: {this.props.credit}.
        </div>
        <div className="col2">
        </div>
        <div className="col3">
        </div>
      </div>
    )
  }
}

export { ChartHeader, ChartFooter }
