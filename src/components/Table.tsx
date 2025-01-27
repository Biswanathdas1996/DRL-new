import * as React from "react";

import Paper from "@mui/material/Paper";
import Loader from "../components/Loader";
import MuiTable from "@mui/material/Table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ChatMessage {
  id: number;
  [key: string]: any;
}

interface TableProps {
  loadingUi?: boolean;
  chatId?: number;
  setData?: any;
  customData?: any;
}

const applyDateFilter = (input: string | number): string | number => {
  if (typeof input !== "string") {
    return input;
  }

  const date = new Date();
  let month = date.getMonth();
  let year = date.getFullYear();

  const match = input.match(/Current Month-(\d+)/);
  if (match) {
    const monthsToSubtract = parseInt(match[1], 10);
    month -= monthsToSubtract;
    while (month < 0) {
      month += 12;
      year -= 1;
    }
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return `${monthNames[month]}-${year.toString().slice(-2)}`;
  } else {
    return input;
  }
};

const CustomTable: React.FC<TableProps> = ({
  loadingUi,
  chatId,
  setData,
  customData,
}) => {
  const chatHistory = useSelector((state: RootState) => state.chat.value);

  const data = customData
    ? customData
    : typeof chatHistory.filter((chat) => chat.id === chatId)[0].message ===
        "object" &&
      !Array.isArray(
        chatHistory.filter((chat) => chat.id === chatId)[0].message
      )
    ? (
        chatHistory.filter((chat) => chat.id === chatId)[0].message as {
          result: any;
        }
      ).result
    : null;

  console.log("==============>", data);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

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
  const [table1Data, setTable1Data] = React.useState<ChatMessage[]>([]);

  React.useEffect(() => {
    if (data) {
      setTable1Data(data);
    }
  }, [data]);

  return (
    <>
      {loadingUi ? (
        <Loader showIcon={false} text={"Executing query"} />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {table1Data ? (
            <>
              <>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    const searchTerms = e.target.value
                      .toLowerCase()
                      .split(",")
                      .map((term) => term.trim());
                    const filteredData: ChatMessage[] = data.filter(
                      (row: ChatMessage) =>
                        searchTerms.some((term: string) =>
                          Object.values(row).some((value: any) =>
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
                        {table1Data?.length > 0 &&
                          Object.keys(table1Data[0]).map(
                            (columnName: string, index: number) => (
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
                                <TableSortLabel
                                  active={paginationModel.sortBy === columnName}
                                  direction={
                                    paginationModel.order as "asc" | "desc"
                                  }
                                  onClick={() => {
                                    const isAsc =
                                      paginationModel.sortBy === columnName &&
                                      paginationModel.order === "asc";
                                    setPaginationModel({
                                      ...paginationModel,
                                      sortBy: columnName,
                                      order: isAsc ? "desc" : "asc",
                                    });
                                    const sortedData = [...table1Data].sort(
                                      (
                                        a: Record<string, any>,
                                        b: Record<string, any>
                                      ) => {
                                        if (a[columnName] < b[columnName])
                                          return isAsc ? -1 : 1;
                                        if (a[columnName] > b[columnName])
                                          return isAsc ? 1 : -1;
                                        return 0;
                                      }
                                    );
                                    setTable1Data(sortedData);
                                  }}
                                >
                                  {applyDateFilter(
                                    columnName
                                      .replace(/_/g, " ")
                                      .replace(/^\w/, (c: string) =>
                                        c.toUpperCase()
                                      )
                                  )}
                                </TableSortLabel>
                              </TableCell>
                            )
                          )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {table1Data
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row: ChatMessage, rowIndex: number) => (
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
                            {Object.values(row).map(
                              (value: any, cellIndex: number) => (
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
                              )
                            )}
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
              </>
            </>
          ) : (
            <b>No data found</b>
          )}{" "}
        </Paper>
      )}
    </>
  );
};

const paginationModel = { page: 0, pageSize: 5, sortBy: "", order: "asc" };

export default CustomTable;
