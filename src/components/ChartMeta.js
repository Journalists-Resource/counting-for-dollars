import React, { Component } from 'react'
import '../App.css'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import Code from '@material-ui/icons/Code';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Popover from '@material-ui/core/Popover';
import { CSVLink } from "react-csv";

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
        search: props.search ? props.search : "",
        downloaddata: props.downloaddata,
        anchorEl: false,
        setAnchorEl: null,
        open: false,
        id: open ? 'simple-popover' : undefined
      }
    }

    handleDownloadData() {

    };

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
               {this.props.credit}
            </div>
            <div className="col2">
            {( (this.props.downloaddata.length>0) ?
              <CSVLink
                data={this.props.downloaddata}
                filename={this.props.downloadfilename + ".csv"}
                className="btn btn-primary"
                target="_blank"
              >
                <Button
                variant="outlined"
                size="small"
                color="primary"
                >
                   <SaveAlt />
                   &nbsp; Get Data
                </Button>
              </CSVLink>
              :
              <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds" target="_blank">
                <Button
                variant="outlined"
                size="small"
                color="primary"
                >
                   <SaveAlt />
                   &nbsp; Get Data
                </Button>
              </a>
            )}
            </div>
            <div className="col3">
               <Button
               variant="outlined"
               size="small"
               color="primary"
               onClick={this.handleClick.bind(this)}
               >
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
                  <pre>{'<iframe height="' + (document.body.clientHeight+100) + '" width="100%" src="' + window.location.href.split(/[?]/)[0] + this.state.search + '" frameborder="0" allowfullscreen scrolling="no"></iframe>'}</pre>
                </Popover>
            </div>
         </div>
      )
   }
}

export { ChartHeader, ChartFooter }
