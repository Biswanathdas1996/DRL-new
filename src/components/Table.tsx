import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
interface TableProps {
  data: any[];
  loadingUi?: boolean;
  chatId?: number;
}

const CustomTable: React.FC<TableProps> = ({ data, loadingUi, chatId }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const columns: GridColDef[] = Object.keys(data[0] || {}).map((key) => {
    if (key === "fullName") {
      return {
        field: key,
        headerName: "Full name",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 160,
      };
    }
    return {
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      width: 130,
    };
  });

  const rows = data.map((item, index) => {
    return { id: index, ...item };
  });

  const handleDeleteColumn = (fields: any) => {
    console.log("======>", fields, data);
    const fieldsData = Object.keys(fields);

    const updatedData = data.map((item) => {
      const newItem = { ...item };
      fieldsData.forEach((field: string) => {
        delete newItem[field];
      });
      return newItem;
    });
    if (chatId !== undefined) {
      dispatch(
        updateResult({
          chatId,
          result: updatedData,
        })
      );
    }
    console.log("Updated Data: ", updatedData);
    // chatId;
  };

  if (data.length !== 0) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ height: 10 }}>
              <TableRow style={{ height: 10 }}>
                {data.length > 0 &&
                  Object.keys(data[0]).map((columnName, index) => (
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
              {data
                .slice(
                  paginationModel.page * paginationModel.pageSize,
                  paginationModel.page * paginationModel.pageSize +
                    paginationModel.pageSize
                )
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
                        {isNaN(Number(value))
                          ? value
                          : Number(value).toFixed(2)}
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
              count={data.length}
              rowsPerPage={paginationModel.pageSize}
              page={paginationModel.page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={(event, newPage) => {
                setPaginationModel((prev) => ({ ...prev, page: newPage }));
              }}
              onRowsPerPageChange={(event) => {
                setPaginationModel((prev) => ({
                  ...prev,
                  pageSize: parseInt(event.target.value, 10),
                }));
              }}
            />
          </TableRow>
        </TableFooter>
      </Paper>
    );
  }
};

const paginationModel = { page: 0, pageSize: 5 };

export default CustomTable;
