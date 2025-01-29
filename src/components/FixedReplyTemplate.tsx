import React, { useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import SqlUpdate from "./SqlUpdate";
import Analyse from "./DataVisualations";
import { UserContext } from "../App";

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

// Type definitions
interface Data {
  text1: string;
  table1: Array<Record<string, string>>;
  text2: string;
  questions: Array<string>;
  analytics: Array<any>;
}

interface Props {
  data: Data;
  doQuery?: any;
  chartId?: number;
  chat: any;
}

const DynamicDisplay: React.FC<Props> = ({ data, doQuery, chartId, chat }) => {
  const { message, time, id } = chat;
  const { user } = useContext(UserContext);
  const [page, setPage] = React.useState(0);
  const [loadingUi, setLoadingUi] = React.useState<boolean>(false);
  const [showQueryEditSection, setShowQueryEditSection] =
    React.useState<boolean>(false);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });
  const [table1Data, setTable1Data] = React.useState(data.table1);

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
  console.log(data);
  return (
    <div data-name="message-1" className="chat-msg-list msg-hldr-cb gap10px">
      <div className="icon-hldr">
        <img
          src="data:image/png;base64,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"
          alt="Bot Icon"
        />
      </div>
      <div data-name="message-stack-1" className="chat-msg-stack">
        <div className="chat-indv">
          <div className="bot-message">
            <div
              style={{ fontFamily: "Arial, sans-serif" }}
              className="chat-msg-stack"
            >
              <h3>Certainly, {user?.name}!</h3>
              {/* Display the first text dynamically */}
              <div style={{ marginBottom: "20px", fontSize: "14px" }}>
                {data?.text1}
              </div>

              <div style={{ marginBottom: "20px" }}>
                {shouldDisplayTable(data) ? (
                  <div style={{ width: "800px", overflow: "hidden" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        onChange={(e) => {
                          const searchTerms = e.target.value
                            .toLowerCase()
                            .split(",")
                            .map((term) => term.trim());
                          const filteredData = data.table1.filter((row) =>
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
                      <button
                        className="newConversationButton"
                        onClick={() => {
                          const csvContent = [
                            Object.keys(table1Data[0]).join(","),
                            ...table1Data.map((row) =>
                              Object.values(row)
                                .map((value) => `"${value}"`)
                                .join(",")
                            ),
                          ].join("\n");

                          const blob = new Blob([csvContent], {
                            type: "text/csv;charset=utf-8;",
                          });
                          const link = document.createElement("a");
                          const url = URL.createObjectURL(blob);
                          link.setAttribute("href", url);
                          link.setAttribute("download", "table_data.csv");
                          link.style.visibility = "hidden";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        style={{
                          background: "#989595",
                        }}
                      >
                        Export
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                          alt="Clear Chat"
                        />
                      </button>
                    </div>
                    <TableContainer sx={{ maxHeight: 440, width: "100%" }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead style={{ height: 10 }}>
                          <TableRow style={{ height: 10 }}>
                            {table1Data.length > 0 &&
                              Object.keys(table1Data[0]).map(
                                (columnName, index) => (
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
                                    {applyDateFilter(
                                      columnName
                                        .replace(/_/g, " ")
                                        .replace(/^\w/, (c) => c.toUpperCase())
                                    )}
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
                            .map(
                              (
                                row: Record<string, string | number>,
                                rowIndex
                              ) => (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={rowIndex}
                                  style={{
                                    backgroundColor:
                                      rowIndex % 2 === 0
                                        ? "#a8a8a866"
                                        : "#f1f1f1",
                                  }}
                                >
                                  {Object.values(row).map(
                                    (value, cellIndex) => (
                                      <TableCell
                                        key={cellIndex}
                                        align="center"
                                        style={{
                                          borderRight: "2px solid #ffffff",
                                          padding: 5,
                                        }}
                                      >
                                        {isNaN(Number(value)) ? (
                                          value === "button" ? (
                                            <button
                                              className="newConversationButton"
                                              onClick={() =>
                                                doQuery(
                                                  `Which Stockist within Headquarter ${row.name} are trailing?`
                                                )
                                              }
                                              style={{
                                                width: "120px",
                                                height: 30,
                                              }}
                                            >
                                              Trailing Stockists
                                              <img
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                                                alt="Clear Chat"
                                              />
                                            </button>
                                          ) : (
                                            value
                                          )
                                        ) : (
                                          Number(value).toFixed(2)
                                        )}
                                      </TableCell>
                                    )
                                  )}
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
                  </div>
                ) : (
                  <b>
                    Sorry! I can not find any data regarding this. Let me know
                    how can I help you further.
                  </b>
                )}
              </div>

              {shouldDisplayTable(data) && data?.questions.length > 0 && (
                <>
                  {/* Display the second text dynamically */}
                  <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {data?.text2}
                  </div>

                  {/* Display the buttons for questions dynamically */}
                  {data?.questions?.map((question, index) => (
                    <div
                      key={index}
                      style={{ marginTop: "20px", cursor: "pointer" }}
                    >
                      <Chip
                        label={`${index + 1}) ${question}`}
                        onClick={() => doQuery(question)}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* {chartId && data?.analytics && (
                <Analyse
                  data={{
                    analytics: data?.analytics,
                    result: table1Data,
                    query: "",

                    llmReply: "",
                    type: "",
                  }}
                />
              )} */}

              <div
                style={{ fontSize: "12px", fontWeight: "400", marginTop: 10 }}
              >
                If not, please proceed to close the chat, Thank you for your
                query, We look forward to helping you again!
              </div>
            </div>
          </div>
        </div>
        {showQueryEditSection && (
          <SqlUpdate
            query={message?.query}
            chatId={id}
            setLoadingUi={setLoadingUi}
          />
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="newConversationButton"
            onClick={() => setShowQueryEditSection(!showQueryEditSection)}
            style={{ background: "#989595" }}
          >
            {showQueryEditSection ? "Hide" : "SQL"}
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
              alt="Clear Chat"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicDisplay;
