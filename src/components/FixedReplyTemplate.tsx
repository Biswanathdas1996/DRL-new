import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Chip from "@mui/material/Chip";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// Type definitions
interface Data {
  text1: string;
  table1: Array<Record<string, string>>;
  text2: string;
  questions: Array<string>;
}

interface Props {
  data: Data;
  doQuery: any;
}

const DynamicDisplay: React.FC<Props> = ({ data, doQuery }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const shouldDisplayTable = (data: Data) => {
    return data.table1 && data.table1.length > 0;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  if (!data) return;
  console.log("================>", data);
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Display the first text dynamically */}
      <div style={{ marginBottom: "20px", fontSize: "14px" }}>
        {data?.text1}
      </div>

      {/* Display the table dynamically */}
      <div style={{ marginBottom: "20px" }}>
        {shouldDisplayTable(data) && (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead style={{ height: 10 }}>
                  <TableRow style={{ height: 10 }}>
                    {data.table1.length > 0 &&
                      Object.keys(data.table1[0]).map((columnName, index) => (
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
                  {data.table1
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
                  count={data.table1.length}
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
        )}
      </div>

      {/* Display the second text dynamically */}
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>{data?.text2}</div>

      {/* Display the buttons for questions dynamically */}
      {data?.questions?.map((question, index) => (
        <div key={index} style={{ marginTop: "20px", cursor: "pointer" }}>
          <Chip label={question} onClick={() => doQuery(question)} />
        </div>
      ))}
    </div>
  );
};

export default DynamicDisplay;
