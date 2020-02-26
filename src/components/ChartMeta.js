import React, { Component } from 'react'
import '../App.css'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import Code from '@material-ui/icons/Code';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Popover from '@material-ui/core/Popover';

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
    constructor(props){
      super(props)
      this.state = {
        anchorEl: false,
        setAnchorEl: null,
        open: false,
        id: open ? 'simple-popover' : undefined
      }
    }



    handleClick(event) {
      this.setState({
        anchorEl:event.currentTarget,
        setAnchorEl: event.currentTarget
      })
    };

    handleClose() {
      this.setState({
        anchorEl: null,
        setAnchorEl: null
      })
    };



   render() {

     const open = Boolean(this.state.anchorEl);
     const id = open ? 'simple-popover' : undefined;

      return (
         <div className="chart-footer">
            <div className="col1 credit">
               Data: {this.props.credit}.
            </div>
            <div className="col2">

            </div>
            <div className="col3">
               <Button variant="outlined" color="primary" onClick={this.handleClick.bind(this)}>
                  <Code />
                  &nbsp; Embed
               </Button>
               <Popover
                  className="embed-panel"
                  id={id}
                  open={open}
                  anchorEl={this.state.anchorEl}
                  onClose={this.handleClose.bind(this)}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  Use this code to embed this graphic on your own site:
                  <pre>{'<iframe src="' + window.location.href + '" />'}</pre>
                </Popover>
            </div>
         </div>
      )
   }
}

export { ChartHeader, ChartFooter }
