import React from "react";
import Paper from "@mui/material/Paper";
import { useFetch } from "../hook/useFetch";
import { QUERY_LIST, EXICUTE_QUERY } from "../config";
import MuiTable from "@mui/material/Table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { format } from "sql-formatter";
import Loader from "../components/Loader";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-mysql";
// import "ace-builds/src-noconflict/worker-mysql";

import FixedReplyTemplate from "../components/Table";
import TextField from "@mui/material/TextField";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 600,
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
interface PaginationModel {
  page: number;
  pageSize: number;
}

const Queries: React.FC = () => {
  const [message, setMessage] = React.useState<any>(null);
  const [id, setId] = React.useState<string>("");
  const [loadingUi, setLoadingUi] = React.useState<boolean>(false);

  const [error, setError] = React.useState<any>(null);

  const [data, setData] = React.useState<any>({});

  const fetchData = useFetch();
  const [paginationModel, setPaginationModel] = React.useState<PaginationModel>(
    { page: 0, pageSize: 20 }
  );

  const [open, setOpen] = React.useState(false);

  const [selectedQuery, setSelectedQuery] = React.useState<string | null>(null);

  interface Query {
    [key: string]: string | number;
  }

  const handleFormat = (query: string): string | undefined => {
    try {
      const formatted = format(query, {
        language: "postgresql",
        tabWidth: 5,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });
      return formatted;
    } catch (error) {
      console.error("Error formatting SQL:", error);
    }
  };

  const handleOpen = (value: string): void => {
    setOpen(true);
    setSelectedQuery(handleFormat(value) as string);
  };
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setData({});
  };

  React.useEffect(() => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    fetchData(QUERY_LIST, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result = result.filter((data: any) => !data?.hide);

        setMessage(result);
        setId(result.id || "");
      })
      .catch((error) => console.error(error));
  }, []);

  console.log(message);
  if (!message) {
    return <h1>Loading...</h1>;
  }

  const onsubmitHandler = (query: string) => {
    setLoadingUi(true);

    setData({});
    setError(null);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      sql_query: query,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(EXICUTE_QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoadingUi(false);
        setData(result?.result);

        if (result?.error) {
          setError(result.error);
        } else {
          setError(null);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error?.status === 500) {
          setError("Internal Server Error");
        } else {
          setError(error);
        }
        setLoadingUi(false);
      });
  };

  const applyDateFilter = (input: string | number): string | number => {
    if (typeof input !== "string") {
      return input;
    }

    const date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();

    const match = input.match(/Current_Month-(\d+)/);
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

  const columnsNotToShow = ["name", "query", "show"];

  return (
    <div>
      <h2>Saved Queries</h2>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              const filteredData = message.filter((row: Query) =>
                Object.values(row).some((value) =>
                  String(value).toLowerCase().includes(searchTerm)
                )
              );
              setMessage(filteredData);
            }}
          />
        </Box>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ height: 10 }}>
              <TableRow style={{ height: 10 }}>
                {message.length > 0 &&
                  Object.keys(message[0])
                    .filter((columnName) =>
                      columnsNotToShow.includes(columnName)
                    )
                    .map((columnName, index) => (
                      <TableCell
                        key={index}
                        style={{
                          minWidth: 170,
                          background: "#4b2a91",
                          color: "white",
                          height: 10,
                          padding: 10,
                          margin: 0,
                          textAlign: "left",
                          borderRight: "2px solid #ffffff",
                        }}
                      >
                        {applyDateFilter(
                          columnName
                            .replace(/_/g, " ")
                            .replace(/^\w/, (c) => c.toUpperCase())
                        )}
                      </TableCell>
                    ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {message
                .slice(
                  paginationModel.page * paginationModel.pageSize,
                  paginationModel.page * paginationModel.pageSize +
                    paginationModel.pageSize
                )
                .map(
                  (row: Record<string, string | number>, rowIndex: number) => (
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
                      {Object.entries(row)
                        .filter(([columnName]) =>
                          columnsNotToShow.includes(columnName)
                        )
                        .map(([key, value], cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            align="left"
                            style={{
                              borderRight: "2px solid #ffffff",
                              padding: 10,
                            }}
                          >
                            {key === "query" ? (
                              <Button
                                onClick={() => handleOpen(String(value))}
                                size="small"
                                variant="contained"
                                id="temp_button"
                              >
                                Run Query
                              </Button>
                            ) : (
                              <>
                                {isNaN(Number(value))
                                  ? value
                                  : Number(value).toFixed(1)}
                              </>
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  )
                )}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={message.length}
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

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AceEditor
              key="testScript"
              placeholder="Placeholder Text"
              mode="mysql"
              theme="monokai"
              name="blah2"
              fontSize={12}
              lineHeight={15}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={selectedQuery || ""}
              onChange={(newValue) => {
                setSelectedQuery(newValue);
              }}
              setOptions={{
                useWorker: false,
              }}
              editorProps={{ $blockScrolling: true }}
              //   height="400px"
              width="100%"
              style={{ padding: 10, borderRadius: 15 }}
            />

            <div style={{ marginTop: 20 }}>
              {loadingUi && <Loader text="Exicuting query " showIcon={false} />}
            </div>
            <b>*Please update variable data before execute the SQL</b>
            <div style={{ marginTop: 20 }}>
              <Button
                onClick={() => onsubmitHandler(String(selectedQuery))}
                size="small"
                variant="contained"
                id="temp_button"
              >
                Execute
              </Button>
            </div>
            <div style={{ marginTop: 20 }}>
              {data && (
                <FixedReplyTemplate
                  customData={Array.isArray(data) ? data : []}
                  setData={setData}
                />
              )}
              {error && (
                <pre
                  style={{
                    background: "#f7012c24",
                    padding: 12,
                    borderRadius: 12,
                  }}
                >
                  {error}
                </pre>
              )}
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

const paginationModel = { page: 0, pageSize: 20 };
export default Queries;
