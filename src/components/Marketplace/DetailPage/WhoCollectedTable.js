import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { yellow } from '@mui/material/colors';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  
  [`&.${tableCellClasses.head}`]
  : {
    // backgroundColor: theme.palette.common.white,
    color: theme.palette.common.white,
    fontSize:18,
    borderBottom:'1px solid yellow',
    fontWeight:600,
  },
  [TableBody]: {
    fontSize: 14,
    border:'1px solid yellow'

  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function truncate(str, max, sep) {
    max = max || 15; var len = str?.length; if (len > max) { sep = sep || "..."; var seplen = sep?.length; if (seplen > max) { return str.substr(len - max) } var n = -0.5 * (max - len - seplen); var center = len / 2; return str.substr(0, center - n) + sep + str.substr(len - center + n); } return str;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function CustomizedTables(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 600 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Event</StyledTableCell>
            <StyledTableCell align="left">Price</StyledTableCell>
            <StyledTableCell align="left">From</StyledTableCell>
            <StyledTableCell align="left">To</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data?.map((pub) => (
            <StyledTableRow key={pub.name}>
              <StyledTableCell component="th" scope="row">
                Collect
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                {props.price}
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
              0x00000
              </StyledTableCell>
               <StyledTableCell align="left">{pub.defaultProfile.handle }  ( {(truncate(pub?.address))} )</StyledTableCell> 
              
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}