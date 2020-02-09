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


class DataTable extends Component {
    render() {
      const node = this.node
      const data = this.props.data


        if (data.length > 0) {
          return(
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {data.columns.filter(function(d){return d !== "url"}).map(column => (
                      <TableCell>{column}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map(row => (
                    <TableRow key={row.Program}>
                      <TableCell component="th" scope="row">
                        <a href="{row.url}">{row.Program}</a>
                      </TableCell>
                      <TableCell align="right">{row["Department"]}</TableCell>
                        {usStateNames.map(state => (
                          <TableCell align="right">{row[state]}</TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        } else {
          return null;
        }

    }


}

export default DataTable
