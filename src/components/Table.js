import React, { Component } from 'react'
import '../App.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import usStateNames from './USStateNames'
import formatMoney from './FormatMoney'


class DataTable extends Component {
    render() {
      const node = this.node
      const data = this.props.data

        if (data.length > 0) {
          return(
            <TableContainer component={Paper}>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {data.columns.map(column => (
                      <TableCell>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row[data.columns[0]]}>
                      {data.columns.map(column => (
                        <TableCell>
                          {formatMoney(row[column])}
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
