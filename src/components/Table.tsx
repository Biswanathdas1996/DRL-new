import * as React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateResult } from "../redux/slices/chatSlices";
import Paper from "@mui/material/Paper";

import MuiTable from "@mui/material/Table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
interface TableProps {
  data: any[];
  loadingUi?: boolean;
  chatId?: number;
  setData?: any;
}

const CustomTable: React.FC<TableProps> = ({
  data,
  loadingUi,
  chatId,
  setData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const shouldDisplayTable = (data: any) => {
    return data.table1 && data.table1.length > 0;
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
    sortBy: "",
    order: "asc",
  });
  const [table1Data, setTable1Data] = React.useState(data);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        onChange={(e) => {
          const searchTerms = e.target.value
            .toLowerCase()
            .split(",")
            .map((term) => term.trim());
          const filteredData = data.filter((row) =>
            searchTerms.some((term) =>
              Object.values(row).some((value) =>
                String(value).toLowerCase().includes(term)
              )
            )
          );
          setPaginationModel({ ...paginationModel, page: 0 });
          setTable1Data(filteredData);
        }}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer sx={{ maxHeight: 440, width: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead style={{ height: 10 }}>
            <TableRow style={{ height: 10 }}>
              {table1Data.length > 0 &&
                Object.keys(table1Data[0]).map((columnName, index) => (
                  <TableCell
                    key={index}
                    style={{
                      minWidth: 170,
                      background: "rgb(51 51 51 / 86%)",
                      color: "white",
                      height: 10,
                      padding: "5px",
                      margin: 0,
                      textAlign: "center",
                      borderRight: "2px solid #ffffff",
                    }}
                  >
                    {columnName
                      .replace(/_/g, " ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table1Data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: Record<string, string | number>, rowIndex) => (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={rowIndex}
                  style={{
                    backgroundColor:
                      rowIndex % 2 === 0 ? "#a8a8a866" : "#f1f1f1",
                  }}
                >
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      align="center"
                      style={{
                        borderRight: "2px solid #ffffff",
                        padding: 5,
                      }}
                    >
                      {isNaN(Number(value)) ? value : Number(value).toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={3}
            count={table1Data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Paper>
  );
};

const paginationModel = { page: 0, pageSize: 5, sortBy: "", order: "asc" };

export default CustomTable;
