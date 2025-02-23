import React from "react";
import { data as rawData } from "./data";
import DateComp from "./DateComp";
import dayjs, { Dayjs } from "dayjs";
import { EXICUTE_QUERY } from "../../config";
import { useFetch } from "../../hook/useFetch";
import {
  Button,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { callLLM } from "../../helper/llm";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

interface Subsection {
  title: string;
  query: string;
}

const AgentsPage: React.FC = () => {
  const fetchData = useFetch();
  const [data, setData] = React.useState<any[]>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    sortBy: "",
    order: "asc",
  });

  const [sdate, setSdate] = React.useState<Dayjs | null>(dayjs());
  const [page, setPage] = React.useState(0);
  const [report, setReport] = React.useState<any[]>([]);

  const [edate, setEdate] = React.useState<Dayjs | null>(dayjs());
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const replaceDates = (data: any, startDate: string, endDate: string) => {
    return data.map((section: any) => ({
      ...section,
      subsections: section.subsections.map((subsection: any) => ({
        ...subsection,
        query: subsection.query
          .replace(/:start_date/g, startDate)
          .replace(/:end_date/g, endDate),
      })),
    }));
  };

  React.useEffect(() => {
    const updatedData = replaceDates(
      rawData,
      sdate?.format("YYYY-MM-DD") || "",
      edate?.format("YYYY-MM-DD") || ""
    );
    setData(updatedData);
  }, [sdate, edate]);

  const execute_query = async (query: string): Promise<any> => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      sql_query: query.replace(/\n/g, " "),
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    return fetchData(EXICUTE_QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => result?.result)
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  const fetchDataAndUpdate = async () => {
    const updatedData: any[] = [];
    for (const section of rawData) {
      const subsections: any[] = [];
      for (const [
        subsectionIndex,
        subsection,
      ] of section.subsections.entries()) {
        const query = subsection.query
          .replace(/:start_date/g, sdate?.format("YYYY-MM-DD") || "")
          .replace(/:end_date/g, edate?.format("YYYY-MM-DD") || "");
        const result = await execute_query(query);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Adding delay to hold the loop until promise is resolved
        subsections.push({ ...subsection, result, filteredResult: result });
        setData((prevData) => {
          const newData = [...prevData];
          newData[rawData.indexOf(section)].subsections[subsectionIndex] = {
            ...subsection,
            result,
          };
          newData[rawData.indexOf(section)].subsections[
            subsectionIndex
          ].filteredResult = result;
          return newData;
        });
      }
      updatedData.push({ ...section, subsections });
    }
  };

  const formatValues = (value: any) => {
    const roundOff = localStorage.getItem("roundOff") === "true";

    return isNaN(Number(value))
      ? value
      : Number(value).toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: roundOff ? 0 : 2,
        });
  };

  type Section = {
    subsections: Subsection[];
  };

  type Subsection = {
    title: string;
    query: string;
    filteredResult: any[];
  };

  const clearQueryAndFilteredResults = (data: Section[]) => {
    return data.map((section: Section) => ({
      ...section,
      subsections: section.subsections.map((subsection: Subsection) => ({
        ...subsection,
        query: "",
        filteredResult: [],
      })),
    }));
  };

  // interface FetchPromptProps {
  //   data: any[];
  // }

  const fetchPrompt = async (data: any): Promise<any> => {
    return callLLM(`
      Analyze the following data and provide business insights and suggestions for improvement:
      Give a HTML code 

      Data:
      ${JSON.stringify(data, null, 2)}

      Consider the following aspects:
      1. Identify high and low-performing HQs, stockists, brands, and SKUs.
      2. Highlight underperformed areas that might need to be discontinued.
      3. Suggest which SKUs/brands need higher production based on demand.
      4. Predict sales trends to optimize inventory and sales strategies.
      5. return a html code with the above points
      6. return html code inside html tag
    `).then((res: any) => res);
  };

  const fetchAllPrompts = async () => {
    const results = [];
    for (const section of data) {
      const clearedData = clearQueryAndFilteredResults([section])[0];
      const result = await fetchPrompt(clearedData);
      results.push(result);
    }
    setReport(results);
  };

  console.log("report", report);
  return (
    <div>
      <h1>Business Dashboard</h1>
      <div>
        <DateComp
          sdate={sdate}
          setSdate={setSdate}
          edate={edate}
          setEdate={setEdate}
        />
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchDataAndUpdate}
          id="temp_button"
        >
          Submit
        </Button>
        {/* <Button
          variant="outlined"
          color="primary"
          style={{ marginLeft: 10 }}
          id="temp_button"
          onClick={() => fetchAllPrompts()}
        >
          Generate
        </Button> */}
      </div>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={12}>
          {report.map((htmlContent, index) => {
            const htmlStart = htmlContent.indexOf("<html>");
            const htmlEnd = htmlContent.indexOf("</html>") + 7;
            const htmlSnippet = htmlContent.substring(htmlStart, htmlEnd);
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: htmlSnippet }}
                style={{ width: "100%", height: "auto", border: "none" }}
              />
            );
          })}
        </Grid>
        <Grid container spacing={2}>
          {data &&
            data?.map((section, sectionIndex) => (
              <Grid size={6}>
                <section key={sectionIndex}>
                  <h2>{section.title}</h2>
                  {section.subsections.map(
                    (subsection: Subsection, subsectionIndex: number) =>
                      section.subsections[subsectionIndex].result ? (
                        <div key={subsectionIndex}>
                          <h3>{subsection?.title}</h3>
                          <div style={{ width: "100%" }}>
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
                                  const filteredData = section.subsections[
                                    subsectionIndex
                                  ].result.filter((row: any) =>
                                    searchTerms.some((term: string) =>
                                      Object.values(row).some((value: any) =>
                                        String(value)
                                          .toLowerCase()
                                          .includes(term)
                                      )
                                    )
                                  );
                                  setData((prevData) => {
                                    const newData = [...prevData];
                                    newData[sectionIndex].subsections[
                                      subsectionIndex
                                    ].filteredResult = filteredData;
                                    return newData;
                                  });
                                }}
                                sx={{ marginBottom: 2 }}
                              />
                              {section.subsections[subsectionIndex].result
                                .length > 0 && (
                                <button
                                  className="newConversationButton"
                                  onClick={() => {
                                    const csvContent = [
                                      "Query",
                                      subsection.query,
                                      Object.keys(
                                        section.subsections[subsectionIndex]
                                          .result[0]
                                      ).join(","),
                                      ...section.subsections[
                                        subsectionIndex
                                      ].result.map((row: any) =>
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
                                    const csvName = prompt(
                                      "Enter the CSV file name:",
                                      "table_data.csv"
                                    );
                                    if (csvName) {
                                      link.setAttribute(
                                        "download",
                                        `${csvName}.csv`
                                      );
                                    } else {
                                      return;
                                    }
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
                              )}
                            </div>

                            {section.subsections[subsectionIndex].filteredResult
                              ?.length > 0 ? (
                              <TableContainer sx={{ width: "100%" }}>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead style={{ height: 10 }}>
                                    <TableRow style={{ height: 10 }}>
                                      {Object.keys(
                                        section.subsections[subsectionIndex]
                                          .filteredResult[0]
                                      ).map(
                                        (columnName: string, index: number) => (
                                          <TableCell
                                            key={index}
                                            style={{
                                              whiteSpace: "nowrap",
                                              background: "#4b2a91",
                                              color: "white",
                                              height: 10,
                                              padding: "5px",
                                              margin: 0,
                                              borderRight: "2px solid #ffffff",
                                            }}
                                            align={
                                              isNaN(
                                                Number(
                                                  section.subsections[
                                                    subsectionIndex
                                                  ].filteredResult[0][
                                                    columnName
                                                  ]
                                                )
                                              )
                                                ? "left"
                                                : "right"
                                            }
                                          >
                                            <TableSortLabel
                                              active={
                                                paginationModel.sortBy ===
                                                columnName
                                              }
                                              direction={
                                                paginationModel.order as
                                                  | "asc"
                                                  | "desc"
                                              }
                                              onClick={() => {
                                                const isAsc =
                                                  paginationModel.sortBy ===
                                                    columnName &&
                                                  paginationModel.order ===
                                                    "asc";
                                                setPaginationModel({
                                                  ...paginationModel,
                                                  sortBy: columnName,
                                                  order: isAsc ? "desc" : "asc",
                                                });
                                                const sortedData = [
                                                  ...section.subsections[
                                                    subsectionIndex
                                                  ].filteredResult,
                                                ].sort(
                                                  (
                                                    a: Record<string, any>,
                                                    b: Record<string, any>
                                                  ) => {
                                                    const aValue = isNaN(
                                                      Number(a[columnName])
                                                    )
                                                      ? a[columnName]
                                                      : Number(a[columnName]);
                                                    const bValue = isNaN(
                                                      Number(b[columnName])
                                                    )
                                                      ? b[columnName]
                                                      : Number(b[columnName]);
                                                    if (aValue < bValue)
                                                      return isAsc ? -1 : 1;
                                                    if (aValue > bValue)
                                                      return isAsc ? 1 : -1;
                                                    return 0;
                                                  }
                                                );
                                                setData((prevData) => {
                                                  const newData = [...prevData];
                                                  newData[
                                                    sectionIndex
                                                  ].subsections[
                                                    subsectionIndex
                                                  ].filteredResult = sortedData;
                                                  return newData;
                                                });
                                              }}
                                            >
                                              {columnName
                                                .replace(/_/g, " ")
                                                .replace(/^\w/, (c: string) =>
                                                  c.toUpperCase()
                                                )}
                                            </TableSortLabel>
                                          </TableCell>
                                        )
                                      )}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {section.subsections[
                                      subsectionIndex
                                    ].filteredResult
                                      .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                      )
                                      .map((row: any, rowIndex: number) => (
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
                                            (value: any, cellIndex: number) => (
                                              <TableCell
                                                key={cellIndex}
                                                align={
                                                  isNaN(Number(value))
                                                    ? "left"
                                                    : "right"
                                                }
                                                style={{
                                                  borderRight:
                                                    "2px solid #ffffff",
                                                  padding: 5,
                                                }}
                                              >
                                                {formatValues(value)}
                                              </TableCell>
                                            )
                                          )}
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                  <TableFooter>
                                    {section.subsections[subsectionIndex]
                                      .filteredResult.length > rowsPerPage && (
                                      <TableRow>
                                        <TablePagination
                                          rowsPerPageOptions={[5, 10, 25]}
                                          colSpan={3}
                                          count={
                                            section.subsections[subsectionIndex]
                                              .filteredResult.length
                                          }
                                          rowsPerPage={rowsPerPage}
                                          page={page}
                                          SelectProps={{
                                            inputProps: {
                                              "aria-label": "rows per page",
                                            },
                                            native: true,
                                          }}
                                          onPageChange={(event, newPage) =>
                                            setPage(newPage)
                                          }
                                          onRowsPerPageChange={(event) => {
                                            setPage(0);
                                            setRowsPerPage(
                                              parseInt(event.target.value, 10)
                                            );
                                          }}
                                        />
                                      </TableRow>
                                    )}
                                  </TableFooter>
                                </Table>
                              </TableContainer>
                            ) : (
                              <b>No data found</b>
                            )}
                          </div>
                        </div>
                      ) : null
                  )}
                </section>
              </Grid>
            ))}
        </Grid>
      </Box>

      <section>
        <h2>Conclusion</h2>
        <p>
          These queries will provide comprehensive insights into your business,
          helping in:
        </p>
        <ul>
          <li>
            Identifying high and low-performing HQs, stockists, brands, and
            SKUs.
          </li>
          <li>
            Understanding underperforming areas that might need to be
            discontinued.
          </li>
          <li>
            Determining which SKUs/brands need higher production based on
            demand.
          </li>
          <li>
            Predicting sales trends to optimize inventory and sales strategies.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AgentsPage;
