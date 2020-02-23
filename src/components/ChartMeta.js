import React, { Component } from 'react'
import '../App.css'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import Code from '@material-ui/icons/Code';
import SaveAlt from '@material-ui/icons/SaveAlt';

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
        <div className="col1 credit">
          Data: {this.props.credit}.
        </div>
        <div className="col2">
          <Button variant="outlined" color="primary" href="//google.com">
            <Code />
            Embed
          </Button>
        </div>
        <div className="col3">
          <Button variant="outlined" color="primary">
            <SaveAlt />
            Download PNG
          </Button>
        </div>
      </div>
    )
  }
}

export { ChartHeader, ChartFooter }
