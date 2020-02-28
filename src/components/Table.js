import React, { Component } from 'react'
import '../App.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownSharpIcon from '@material-ui/icons/ArrowDropDownSharp'
import ArrowDropUpSharpIcon from '@material-ui/icons/ArrowDropUpSharp'
import usStateNames from './USStateNames'
import formatMoney from './FormatMoney'

function cellFormatter(row, column) {
   if ((column.indexOf("Total") > -1) || (column.indexOf("Per Capita") > -1) || (column.indexOf("FY2017 Funding") > -1)) {
      return formatMoney(row[column])
   } else if (column.indexOf("Funding as % of State's Income") > -1) {
     return formatMoney(row[column], "income")
   } else if ((column == "Program") && (row.URL !== "NA")) {
      return (
         <a href=
            {row.URL}
         >
            {row[column]}
         </a>
      )
   } else {
      return row[column]
   }
}

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}


class DataTable extends Component {
    constructor(props){
      super(props)
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        data: this.props.data,
        sort: this.props.sort,
        sortorder: this.props.sortorder
      }
    }

    handleClick(e) {
      this.setState({
        sort: e.target.getAttribute("value"),
        sortorder: (this.state.sortorder === "desc" ? "asc" : "desc"),
        data: this.state.data.sort(compareValues(this.state.sort, this.state.sortorder))
      })
    }

    addArrow(c) {
      if (c == this.state.sort && this.state.sortorder == "asc") {
         return <ArrowDropUpSharpIcon style={{verticalAlign:"bottom"}} />
      } else if (c == this.state.sort && this.state.sortorder == "desc") {
         return <ArrowDropDownSharpIcon style={{verticalAlign:"bottom"}} />
      } else {
         return "";
      }
   }

    render() {
      let data = this.props.data;

      data = data.sort(compareValues(this.state.sort, this.state.sortorder))

        if (data.length > 0) {
          return(
            <TableContainer component={Paper}>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {data.columns.map(column => (
                      <TableCell
                      key={column}
                      onClick={this.handleClick.bind(this)}
                      value={column}
                      data-sortstatus={this.state.sortorder}>
                        {column}
                        {this.addArrow(column)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row[data.columns[0]]}>
                      {data.columns.map(column => (
                        <TableCell key={column}>
                          { cellFormatter(row, column, this.state.sort) }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        } else {
          return <span></span>;
        }

    }


}

export default DataTable
